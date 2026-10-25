"""Paints the period art for the Cape Bay Excursion Line handout (Splash, 1984).
Everything is drawn as it would have been for a 1984 two-colour offset job:
pen-and-ink line work and ruled hatching on the blue plate, flat spot red on a second plate
that sits slightly out of register, ink that spreads and drops out a little on uncoated stock.
Writes into assets/: boat-art.png, chart.png, lobster.png, wear-front.png, wear-back.png,
ink-front.png, ink-back.png (soft ink-coverage mottling for the solid areas)."""
import os, math, random, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
shutil.copy('/home/claude/polish/wip/print/jurassic/src/assets/paper-grain.png', os.path.join(A, 'paper-grain.png'))

PAPER = (246, 241, 228)
BLUE = (30, 58, 128)      # reflex-style blue
RED = (205, 58, 40)       # warm red
S = 4                     # working pixels per css px; saved at 2x


class Plate:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.im = Image.new('L', (w * S, h * S), 0)
        self.d = ImageDraw.Draw(self.im)

    def P(self, x, y): return (x * S, y * S)

    def line(self, pts, w=1.0, ink=255):
        self.d.line([self.P(*p) for p in pts], fill=ink, width=max(1, round(w * S)), joint='curve')

    def poly(self, pts, ink=255, outline=None, ow=1.0):
        self.d.polygon([self.P(*p) for p in pts], fill=ink)
        if outline is not None:
            self.line(list(pts) + [pts[0]], ow, outline)

    def rect(self, x0, y0, x1, y1, ink=255):
        self.d.rectangle([self.P(x0, y0), self.P(x1, y1)], fill=ink)

    def box(self, x0, y0, x1, y1, w=1.0):
        self.line([(x0, y0), (x1, y0), (x1, y1), (x0, y1), (x0, y0)], w)

    def ell(self, cx, cy, rx, ry, ink=255, outline=None, ow=1.0):
        bb = [self.P(cx - rx, cy - ry), self.P(cx + rx, cy + ry)]
        if ink is not None: self.d.ellipse(bb, fill=ink)
        if outline is not None: self.d.ellipse(bb, outline=outline, width=max(1, round(ow * S)))

    def arr(self): return np.asarray(self.im, dtype=np.float32) / 255.0


def region(w, h, fn):
    """A throwaway mask plate for clipping hatching."""
    m = Plate(w, h); fn(m); return m.arr()


def hatch(w, h, mask, angle, spacing, lw=0.7, jitter=0.25, seed=1, gaps=0.0):
    """Ruled hatching clipped to mask (0..1 array at S scale)."""
    random.seed(seed)
    p = Plate(w, h)
    a = math.radians(angle)
    dx, dy = math.cos(a), math.sin(a)
    nx, ny = -dy, dx
    diag = math.hypot(w, h)
    t = -diag
    while t < diag:
        cx, cy = w / 2 + nx * t, h / 2 + ny * t
        pts = []
        for k in range(-int(diag), int(diag), 6):
            pts.append((cx + dx * k + random.uniform(-jitter, jitter) * nx, cy + dy * k + random.uniform(-jitter, jitter) * ny))
        if gaps:
            seg = []
            for q in pts:
                if random.random() < gaps:
                    if len(seg) > 1: p.line(seg, lw)
                    seg = []
                else:
                    seg.append(q)
            if len(seg) > 1: p.line(seg, lw)
        else:
            p.line(pts, lw)
        t += spacing
    return p.arr() * mask


def inkify(a, seed, spread=0.9, rough=0.22, voids=0.05):
    """Turn a clean plate into printed ink: slight spread, ragged edge, a few dropouts."""
    rng = np.random.default_rng(seed)
    h, w = a.shape
    b = ndimage.gaussian_filter(a, spread * S / 2)
    lo = rng.random((h // 24 + 2, w // 24 + 2)).astype(np.float32)
    lo = np.asarray(Image.fromarray((lo * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), dtype=np.float32) / 255
    hi = ndimage.gaussian_filter(rng.random((h, w)).astype(np.float32), 1.2)
    hi = (hi - hi.mean()) / (hi.std() + 1e-6)
    thr = 0.42 + (lo - 0.5) * rough + hi * 0.05
    ink = np.clip((b - thr) * 6 + 0.5, 0, 1)
    # dropouts: tiny pale spots inside solids, as on uncoated stock
    v = ndimage.gaussian_filter(rng.random((h, w)).astype(np.float32), 2.5)
    v = (v - v.mean()) / (v.std() + 1e-6)
    ink *= 1 - np.clip((v - 2.2) * 0.9, 0, 1) * (voids * 8)
    # coverage varies a touch across the sheet
    return np.clip(ink * (0.86 + lo * 0.14), 0, 1)


def compose(w, h, plates, out, paper=PAPER, alpha=False):
    """plates: list of (array, rgb, (dx, dy) css offset). Inks multiply onto paper."""
    H, W = h * S, w * S
    res = np.ones((H, W, 3), np.float32) * (np.array(paper, np.float32) / 255)
    cov = np.zeros((H, W), np.float32)
    for a, col, (ox, oy) in plates:
        a = ndimage.shift(a, (oy * S, ox * S), order=1, mode='constant')
        c = np.array(col, np.float32) / 255
        res *= 1 - a[..., None] * (1 - c / (np.array(paper, np.float32) / 255).clip(0.01))
        cov = np.maximum(cov, a)
    res = np.clip(res, 0, 1)
    if alpha:
        img = Image.fromarray((res * 255).astype(np.uint8)).convert('RGBA')
        img.putalpha(Image.fromarray((cov * 255).astype(np.uint8)))
    else:
        img = Image.fromarray((res * 255).astype(np.uint8))
    img.resize((w * 2, h * 2), Image.LANCZOS).save(os.path.join(A, out))


# =====================================================================
# 1. Cover drawing: the excursion boat leaving the Town Pier, 496 x 252
# =====================================================================
ONLY = os.environ.get('ONLY', 'boat chart lobster wear')
if 'boat' in ONLY:
    CW, CH = 496, 252
    HOR = 126
    random.seed(1984)
    blue = Plate(CW, CH)
    red = Plate(CW, CH)
    paperkeep = Plate(CW, CH)   # areas the boat and pier cover, so water lines stop at them

    # --- boat geometry (bow to the left)
    WL = 202                        # waterline
    bowx, sternx = 92, 352
    def sheer(x):                   # deck edge, rising to the bow
        t = (x - bowx) / (sternx - bowx)
        return 160 - 18 * (1 - t) ** 2.2 + 2 * t
    hull_top = [(x, sheer(x)) for x in range(bowx, sternx + 1, 4)]
    hull = hull_top + [(sternx + 2, WL - 6), (sternx - 4, WL), (bowx + 34, WL), (bowx + 6, sheer(bowx) + 20)]
    # pier geometry
    PX0, PDECK = 382, 150

    def boat_and_pier_mask(m):
        m.poly(hull)
        m.rect(116, 100, 342, 162)             # cabins and upper deck
        m.rect(PX0, PDECK - 46, CW, PDECK + 6)  # pier deck and shed
        for k in range(7):
            x = PX0 + 6 + k * 17
            m.rect(x - 3.2, PDECK, x + 3.2, 236)
    cover = region(CW, CH, boat_and_pier_mask)

    # --- sky: engraver's ruling, closer at the top, broken for clouds
    sky = region(CW, CH, lambda m: m.rect(0, 0, CW, HOR - 14))
    clouds = region(CW, CH, lambda m: [m.ell(cx, cy, rx, ry) for cx, cy, rx, ry in
                                       ((96, 34, 70, 13), (150, 24, 46, 10), (338, 46, 84, 14), (420, 30, 50, 10), (250, 62, 40, 7))])
    fade = np.linspace(1, 0, CH * S, dtype=np.float32)[:, None] ** 0.6
    rule = np.zeros((CH * S, CW * S), np.float32)
    y = 2.0
    random.seed(7)
    while y < HOR - 14:
        gap = 2.3 + (y / HOR) * 3.2
        p = Plate(CW, CH)
        x = random.uniform(0, 30)
        while x < CW:
            L = random.uniform(40, 160)
            p.line([(x, y), (x + L, y + random.uniform(-0.2, 0.2))], 0.42 + 0.3 * (1 - y / HOR))
            x += L + random.uniform(2, 14)
        rule = np.maximum(rule, p.arr())
        y += gap
    rule *= sky * (1 - clouds)
    # cloud undersides, a pen stroke each
    cl = Plate(CW, CH)
    for cx, cy, rx, ry in ((96, 34, 70, 13), (150, 24, 46, 10), (338, 46, 84, 14), (420, 30, 50, 10), (250, 62, 40, 7)):
        pts = [(cx + rx * math.cos(a), cy + ry * math.sin(a)) for a in np.linspace(0.15, math.pi - 0.15, 18)]
        cl.line(pts, 0.7)
    blue_arr = rule + cl.arr()

    # --- far shore: low dunes, bluff, cottages, lighthouse
    far = Plate(CW, CH)
    shore = [(0, HOR - 22), (20, HOR - 24), (40, HOR - 21), (70, HOR - 17), (100, HOR - 9), (140, HOR - 7), (190, HOR - 4),
             (260, HOR - 3), (300, HOR - 2), (330, HOR)]
    land_mask = region(CW, CH, lambda m: m.poly(shore + [(330, HOR + 1), (0, HOR + 1)]))
    far.line(shore, 0.8)
    blue_arr = np.maximum(blue_arr, far.arr())
    blue_arr = np.maximum(blue_arr, hatch(CW, CH, land_mask, 0, 1.7, 0.4, 0.15, 11) * (1 - cover))
    # dune grass ticks
    g = Plate(CW, CH)
    random.seed(3)
    for x in np.arange(4, 300, 3.5):
        yy = np.interp(x, [p[0] for p in shore], [p[1] for p in shore])
        if random.random() < 0.55:
            g.line([(x, yy + 0.5), (x + random.uniform(-1.5, 1.5), yy - random.uniform(2, 4.5))], 0.45)
    blue_arr = np.maximum(blue_arr, g.arr())
    # cottages on the dunes
    ct = Plate(CW, CH)
    for cx, base, cw_, ch_ in ((112, HOR - 8, 13, 7), (128, HOR - 7.5, 10, 6), (176, HOR - 4.5, 15, 7), (210, HOR - 3.5, 9, 5)):
        ct.poly([(cx, base - ch_), (cx + cw_, base - ch_), (cx + cw_, base), (cx, base)], 0)
        ct.box(cx, base - ch_, cx + cw_, base, 0.6)
        ct.poly([(cx - 1.5, base - ch_), (cx + cw_ / 2, base - ch_ - 5), (cx + cw_ + 1.5, base - ch_)], 255)
        ct.rect(cx + cw_ * 0.3, base - ch_ * 0.6, cx + cw_ * 0.45, base - ch_ * 0.3)
    blue_arr = np.maximum(blue_arr * (1 - region(CW, CH, lambda m: [m.rect(cx - 2, base - ch_ - 6, cx + cw_ + 2, base) for cx, base, cw_, ch_ in ((112, HOR - 8, 13, 7), (128, HOR - 7.5, 10, 6), (176, HOR - 4.5, 15, 7), (210, HOR - 3.5, 9, 5))])), ct.arr())
    # lighthouse on the bluff, conical white tower shaded on the right
    lx, lb, lt = 44, HOR - 21, HOR - 74
    tower = [(lx - 7, lb), (lx + 7, lb), (lx + 5, lt), (lx - 5, lt)]
    lh_mask = region(CW, CH, lambda m: m.poly(tower))
    lhc = region(CW, CH, lambda m: m.rect(lx - 9, lt - 22, lx + 9, lb + 1))
    blue_arr *= 1 - lhc
    lh = Plate(CW, CH)
    lh.line(tower + [tower[0]], 0.8)
    lh.rect(lx - 8, lt - 2, lx + 8, lt)                         # gallery
    lh.line([(lx - 8, lt - 5), (lx + 8, lt - 5)], 0.5)            # rail
    for k in range(5): lh.line([(lx - 8 + k * 4, lt - 5), (lx - 8 + k * 4, lt - 2)], 0.4)
    lh.box(lx - 4.5, lt - 13, lx + 4.5, lt - 5, 0.7)              # lantern
    lh.line([(lx, lt - 13), (lx, lt - 5)], 0.4)
    lh.poly([(lx - 6, lt - 13), (lx, lt - 19), (lx + 6, lt - 13)])
    lh.line([(lx, lt - 19), (lx, lt - 22)], 0.5)
    lh.box(lx - 1.6, lt + 14, lx + 1.6, lt + 18, 0.5); lh.box(lx - 1.6, lt + 32, lx + 1.6, lt + 36, 0.5)
    lh.rect(lx - 2.2, lb - 7, lx + 2.2, lb)
    shade = region(CW, CH, lambda m: m.poly([(lx + 1.5, lb), (lx + 7, lb), (lx + 5, lt), (lx + 1, lt)]))
    blue_arr = np.maximum(blue_arr, lh.arr())
    blue_arr = np.maximum(blue_arr, hatch(CW, CH, shade, 90, 1.25, 0.45, 0.05, 12))
    # keeper's house beside it
    kh = Plate(CW, CH)
    kh.poly([(56, HOR - 19), (74, HOR - 19), (74, HOR - 11), (56, HOR - 11)], 0, 255, 0.6)
    kh.poly([(54, HOR - 19), (65, HOR - 26), (76, HOR - 19)], 255)
    kh.rect(60, HOR - 17, 62.5, HOR - 14); kh.rect(67, HOR - 17, 69.5, HOR - 14)
    blue_arr = np.maximum(blue_arr * (1 - region(CW, CH, lambda m: m.rect(53, HOR - 27, 77, HOR - 11))), kh.arr())
    red_arr = region(CW, CH, lambda m: (m.box(lx - 4.5, lt - 13, lx + 4.5, lt - 5, 0.0), m.poly([(lx - 6, lt - 13), (lx, lt - 19), (lx + 6, lt - 13)])))

    # --- water: wavering engraved lines, wider apart toward the viewer
    water = region(CW, CH, lambda m: m.rect(0, HOR, CW, CH))
    wl_ = Plate(CW, CH)
    random.seed(11)
    y = HOR + 1.2
    while y < CH + 2:
        t = (y - HOR) / (CH - HOR)
        gap = 1.6 + t * 5.2
        lw = 0.38 + t * 0.75
        x = random.uniform(-20, 0)
        while x < CW:
            L = random.uniform(18, 70) * (0.6 + t)
            amp = 0.25 + t * 1.6
            ph = random.uniform(0, 6)
            pts = [(x + u, y + amp * math.sin((x + u) / (5 + t * 9) + ph)) for u in np.arange(0, L, 1.5)]
            if len(pts) > 1: wl_.line(pts, lw)
            x += L + random.uniform(3, 10) * (0.5 + t * 1.4)
        y += gap
    blue_arr = np.maximum(blue_arr, wl_.arr() * water * (1 - cover))

    # --- the pier: plank deck, pilings, a shingled ticket shed
    pr = Plate(CW, CH)
    pr.line([(PX0, PDECK), (CW, PDECK)], 1.1)
    pr.line([(PX0, PDECK + 6), (CW, PDECK + 6)], 1.1)
    pr.line([(PX0, PDECK), (PX0, PDECK + 6)], 0.9)
    for x in np.arange(PX0 + 4, CW, 5): pr.line([(x, PDECK + 1), (x, PDECK + 5)], 0.4)
    for k in range(7):
        x = PX0 + 6 + k * 17
        pr.line([(x - 3.2, PDECK + 6), (x - 3.2, 236)], 0.8)
        pr.line([(x + 3.2, PDECK + 6), (x + 3.2, 236)], 0.8)
        pr.ell(x, PDECK - 1.2, 3.2, 1.2, None, 255, 0.6)
        pm = region(CW, CH, lambda m: m.rect(x + 0.6, PDECK + 6, x + 3.2, 236))
        blue_arr = np.maximum(blue_arr, hatch(CW, CH, pm, 90, 1.1, 0.45, 0.05, k + 30))
        for yy in (196, 214): pr.line([(x - 3.2, yy), (x + 3.2, yy)], 0.4)   # weed line rings
    # cross bracing between pilings
    for k in range(6):
        x0 = PX0 + 6 + k * 17 + 3.2
        pr.line([(x0, PDECK + 9), (x0 + 10.6, 186)], 0.6)
    # shed
    sx0, sx1, sy0 = 410, 474, PDECK - 40
    pr.box(sx0, sy0, sx1, PDECK, 0.9)
    pr.poly([(sx0 - 5, sy0), ((sx0 + sx1) / 2, sy0 - 14), (sx1 + 5, sy0)], 0, 255, 0.9)
    roof = region(CW, CH, lambda m: m.poly([(sx0 - 5, sy0), ((sx0 + sx1) / 2, sy0 - 14), (sx1 + 5, sy0)]))
    blue_arr = np.maximum(blue_arr, hatch(CW, CH, roof, 0, 1.4, 0.5, 0.1, 41))
    walls = region(CW, CH, lambda m: m.rect(sx0, sy0, sx1, PDECK))
    sh = Plate(CW, CH)
    random.seed(5)
    for yy in np.arange(sy0 + 3, PDECK, 3.2):                    # shingle courses
        sh.line([(sx0, yy), (sx1, yy)], 0.45)
        off = random.uniform(0, 4)
        for xx in np.arange(sx0 + off, sx1, 4.2):
            sh.line([(xx, yy - 3.2), (xx, yy)], 0.35)
    blue_arr = np.maximum(blue_arr, sh.arr() * walls * (1 - region(CW, CH, lambda m: (m.rect(sx0 + 6, sy0 + 8, sx0 + 30, sy0 + 26), m.rect(sx1 - 18, sy0 + 12, sx1 - 6, PDECK)))))
    pr.box(sx0 + 6, sy0 + 8, sx0 + 30, sy0 + 26, 0.8)            # ticket window
    pr.rect(sx0 + 6, sy0 + 26, sx0 + 30, sy0 + 28)
    pr.box(sx1 - 18, sy0 + 12, sx1 - 6, PDECK, 0.8)               # door
    pr.line([(sx0 + 18, sy0 + 8), (sx0 + 18, sy0 + 26)], 0.4)
    pr.line([(458, sy0 - 8), (458, sy0 - 40)], 0.8)              # flagpole on the shed
    for k in range(3):                                          # life ring hung on the shed
        pass
    blue_arr = np.maximum(blue_arr, pr.arr())
    pier_window = region(CW, CH, lambda m: m.rect(sx0 + 7, sy0 + 9, sx0 + 29, sy0 + 25))
    blue_arr = np.maximum(blue_arr, hatch(CW, CH, pier_window, 0, 1.3, 0.5, 0.05, 42))
    red_arr = np.maximum(red_arr, region(CW, CH, lambda m: m.poly([(458, sy0 - 40), (474, sy0 - 35), (458, sy0 - 30)])))
    red_arr = np.maximum(red_arr, region(CW, CH, lambda m: m.ell(sx1 - 2, sy0 + 6, 4.3, 4.3, None, 255, 2.0)))

    # --- the boat
    bt = Plate(CW, CH)
    blue_arr *= 1 - region(CW, CH, lambda m: (m.poly(hull), m.rect(116, 96, 344, 162)))
    bt.line(hull + [hull[0]], 1.1)
    bt.line([(x, sheer(x) + 3) for x in range(bowx + 4, sternx, 4)], 0.6)      # rub rail
    # hull shading: horizontal ruling, closer toward the waterline
    hull_m = region(CW, CH, lambda m: m.poly(hull))
    for yy in np.arange(172, WL, 1.0):
        t = (yy - 172) / (WL - 172)
        if random.random() < 0.25 + t * 0.75:
            bt.line([(bowx, yy), (sternx + 4, yy + 0.2)], 0.28 + t * 0.4)
    # lower deck cabin: wall, row of windows
    LC0, LC1, LT = 126, 340, 128
    lower = lambda x: sheer(x)
    bt.line([(LC0, LT), (LC1, LT)], 1.0)
    bt.line([(LC0, LT), (LC0, sheer(LC0))], 0.9)
    bt.line([(LC1, LT), (LC1, sheer(LC1))], 0.9)
    for k in range(12):
        wx = 136 + k * 16.5
        top = LT + 7
        bt.box(wx, top, wx + 11, top + 12, 0.7)
        wm = region(CW, CH, lambda m: m.rect(wx + 0.6, top + 0.6, wx + 10.4, top + 11.4))
        hl = region(CW, CH, lambda m: m.poly([(wx + 2, top + 11), (wx + 6, top + 1), (wx + 8, top + 1), (wx + 4, top + 11)]))
        blue_arr = np.maximum(blue_arr, hatch(CW, CH, wm * (1 - hl), 0, 0.9, 0.5, 0.0, 60 + k))
    # door amidships
    bt.box(306, LT + 6, 318, sheer(312) - 1, 0.8)
    # upper deck: floor, rail with stanchions, canopy on posts
    UD = LT
    bt.line([(LC0 - 6, UD), (LC1 + 4, UD)], 1.4)
    bt.line([(LC0 + 50, UD - 13), (LC1 + 2, UD - 13)], 0.9)
    for x in np.arange(LC0 + 50, LC1 + 2, 4.5):
        bt.line([(x, UD - 13), (x, UD)], 0.45)
    bt.line([(LC0 + 50, UD - 7), (LC1 + 2, UD - 7)], 0.4)
    # passengers at the rail, heads and shoulders only, tiny and anonymous
    random.seed(19)
    for x in (186, 197, 214, 232, 241, 262, 281, 300, 318):
        hh = random.uniform(-1, 1)
        bt.ell(x, UD - 17 + hh, 2.1, 2.3, 255)
        bt.poly([(x - 3.6, UD - 13), (x - 2.6, UD - 15.5 + hh), (x + 2.6, UD - 15.5 + hh), (x + 3.6, UD - 13)], 255)
    # canopy
    CN = UD - 30
    can = [(LC0 + 46, CN), (LC1 + 6, CN), (LC1 + 4, CN + 4), (LC0 + 48, CN + 4)]
    bt.line(can + [can[0]], 0.9)
    for x in np.arange(LC0 + 48, LC1 + 4, 7):                  # scalloped valance
        bt.d.arc([bt.P(x, CN + 2), bt.P(x + 7, CN + 7)], 0, 180, fill=255, width=round(0.6 * S))
    canm = region(CW, CH, lambda m: m.poly(can))
    blue_arr = np.maximum(blue_arr, hatch(CW, CH, canm, 0, 1.2, 0.5, 0.0, 70))
    for x in (LC0 + 52, 214, 262, 310, LC1):
        bt.line([(x, CN + 4), (x, UD - 13)], 0.7)
    # wheelhouse forward on the upper deck
    WH0, WH1, WHT = LC0 + 4, LC0 + 44, UD - 30
    bt.box(WH0, WHT, WH1, UD, 1.0)
    bt.poly([(WH0 - 3, WHT), (WH1 + 3, WHT), (WH1 + 2, WHT - 4), (WH0 - 2, WHT - 4)], 255)
    for k in range(3):
        wx = WH0 + 4 + k * 12.5
        bt.box(wx, WHT + 5, wx + 8, WHT + 14, 0.6)
        wm = region(CW, CH, lambda m: m.rect(wx + 0.5, WHT + 5.5, wx + 7.5, WHT + 13.5))
        blue_arr = np.maximum(blue_arr, hatch(CW, CH, wm, 0, 0.9, 0.5, 0.0, 80 + k))
    # wheelhouse side shading
    blue_arr = np.maximum(blue_arr, hatch(CW, CH, region(CW, CH, lambda m: m.rect(WH0 + 1, WHT + 16, WH1 - 1, UD - 1)), 90, 1.6, 0.4, 0.05, 85))
    # mast, stays and searchlight
    bt.line([(WH0 + 20, WHT - 4), (WH0 + 20, WHT - 34)], 0.9)
    bt.line([(WH0 + 20, WHT - 30), (bowx + 8, sheer(bowx + 8) - 1)], 0.4)
    bt.line([(WH0 + 20, WHT - 30), (LC0 + 74, CN)], 0.4)
    bt.ell(WH0 + 32, WHT - 6, 2.4, 2.0, 255)
    # bow rail and anchor
    bt.line([(bowx + 6, sheer(bowx + 6) - 7), (LC0, LT + 10)], 0.7)
    for x in np.arange(bowx + 10, LC0, 5):
        bt.line([(x, sheer(x) - 1), (x, sheer(x) - 7 + (x - bowx - 6) * 0.0)], 0.4)
    bt.ell(bowx + 22, sheer(bowx + 22) + 9, 2.2, 2.2, None, 255, 0.6)
    blue_arr = np.maximum(blue_arr, bt.arr())
    blue_arr = np.maximum(blue_arr * (1 - 0) , blue_arr)
    # hull ruling clipped to the hull
    hr = Plate(CW, CH)
    random.seed(23)
    for yy in np.arange(176, WL - 9, 1.6):
        t = (yy - 176) / (WL - 9 - 176)
        hr.line([(bowx, yy), (sternx + 4, yy)], 0.25 + t * 0.35)
    blue_arr = np.maximum(blue_arr, hr.arr() * hull_m * region(CW, CH, lambda m: m.rect(0, 176, CW, WL - 9)) * 0.85)
    # red plate on the boat: boot-top stripe, flag, two life rings, the canopy edge
    boot = region(CW, CH, lambda m: m.poly([(bowx + 22, WL - 9), (sternx + 1, WL - 9), (sternx - 4, WL), (bowx + 34, WL)]))
    red_arr = np.maximum(red_arr, boot)
    red_arr = np.maximum(red_arr, region(CW, CH, lambda m: m.poly([(WH0 + 20, WHT - 34), (WH0 + 40, WHT - 29), (WH0 + 20, WHT - 24)])))
    for rx_ in (150, 290):
        red_arr = np.maximum(red_arr, region(CW, CH, lambda m: m.ell(rx_, sheer(rx_) + 9, 4.4, 4.4, None, 255, 2.2)))
    red_arr = np.maximum(red_arr, region(CW, CH, lambda m: m.rect(LC0 + 46, CN, LC1 + 6, CN + 1.6)))
    # name board under the wheelhouse, red ruled
    red_arr = np.maximum(red_arr, region(CW, CH, lambda m: m.box(WH0 + 2, UD + 3, WH1 - 2, UD + 6.5, 0.6)))

    # --- bow wave, wake and reflections
    fx = Plate(CW, CH)
    random.seed(31)
    for k in range(9):
        x0 = bowx + 30 - k * 5
        fx.line([(x0, WL - 1 + k * 0.4), (x0 - 10 - k * 2, WL + 4 + k * 1.6)], 0.6)
    for k in range(14):                                       # wake trailing to the right
        y0 = WL + 2 + k * 2.2
        x0 = sternx - 2 + k * 3
        L = 18 + k * 3
        fx.line([(x0, y0), (x0 + L, y0 + 0.6)], 0.5 + k * 0.02)
    for k in range(16):                                       # broken reflection of the hull
        y0 = WL + 3 + k * 2.6
        x = bowx + 40 + random.uniform(0, 8)
        while x < sternx - 6:
            L = random.uniform(6, 22)
            if random.random() < 0.75 - k * 0.03: fx.line([(x, y0), (x + L, y0)], 0.7)
            x += L + random.uniform(3, 9)
    blue_arr = np.maximum(blue_arr * (1 - region(CW, CH, lambda m: m.rect(bowx + 34, WL + 2, sternx - 6, WL + 46)) * 0.7), fx.arr())
    # red echo of the boot top in the water
    rr = Plate(CW, CH)
    for k in range(5):
        y0 = WL + 4 + k * 4.4
        x = bowx + 46 + random.uniform(0, 10)
        while x < sternx - 16:
            L = random.uniform(5, 14)
            if random.random() < 0.6: rr.line([(x, y0), (x + L, y0)], 1.0)
            x += L + random.uniform(6, 14)
    red_arr = np.maximum(red_arr, rr.arr())

    # gulls
    gl = Plate(CW, CH)
    for gx, gy, gs in ((236, 44, 6), (258, 56, 4.5), (214, 70, 4), (372, 82, 5), (392, 74, 3.6)):
        gl.line([(gx - gs, gy - gs * 0.35), (gx - gs * 0.45, gy - gs * 0.45), (gx, gy + gs * 0.12)], 0.8)
        gl.line([(gx, gy + gs * 0.12), (gx + gs * 0.45, gy - gs * 0.45), (gx + gs, gy - gs * 0.35)], 0.8)
    blue_arr = np.maximum(blue_arr * (1 - region(CW, CH, lambda m: [m.ell(gx, gy, gs + 2, gs * 0.6 + 2) for gx, gy, gs in ((236, 44, 6), (258, 56, 4.5), (214, 70, 4), (372, 82, 5), (392, 74, 3.6))])), gl.arr())

    # light blue screen tint on the water, coarse 65-line halftone dots, the press's only "tone"
    dots = Plate(CW, CH)
    pitch = 3.3
    for j in range(int(CH / pitch) + 4):
        for i in range(int(CW / pitch) + 4):
            x = (i + (j % 2) * 0.5) * pitch
            y = j * pitch * 0.866 + HOR
            if y > CH + 2: continue
            t = (y - HOR) / (CH - HOR)
            r = 0.42 + 0.28 * (1 - t)
            dots.ell(x, y, r, r)
    blue_arr = np.maximum(blue_arr, dots.arr() * water * (1 - cover) * 0.9)

    blue_ink = inkify(np.clip(blue_arr, 0, 1), 1, spread=0.55, rough=0.18)
    red_ink = inkify(np.clip(red_arr, 0, 1), 2, spread=0.7, rough=0.3)
    compose(CW, CH, [(blue_ink, BLUE, (0, 0)), (red_ink, RED, (1.4, -0.9))], 'boat-art.png')
    print('boat')


# =====================================================================
# shared curve helpers
# =====================================================================
def smooth(pts, n=10, closed=False):
    P = [np.array(p, float) for p in pts]
    if closed:
        P = [P[-1]] + P + [P[0], P[1]]
    else:
        P = [P[0]] + P + [P[-1]]
    out = []
    for i in range(1, len(P) - 2):
        p0, p1, p2, p3 = P[i - 1], P[i], P[i + 1], P[i + 2]
        for t in np.linspace(0, 1, n, endpoint=False):
            out.append(tuple(0.5 * ((2 * p1) + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t * t + (-p0 + 3 * p1 - 3 * p2 + p3) * t ** 3)))
    if not closed: out.append(tuple(P[-2]))
    return out


def part(cx, cy, L, W, ang, taper=0.0, bulge=0.0, n=48):
    """A rounded body part: ellipse along its axis, narrowed toward one end (taper)."""
    a = math.radians(ang)
    pts = []
    for t in np.linspace(0, 2 * math.pi, n, endpoint=False):
        x = L / 2 * math.cos(t)
        y = W / 2 * math.sin(t) * (1 - taper * math.cos(t)) + bulge * W * math.sin(t) ** 2 * (1 if math.sin(t) < 0 else 0)
        pts.append((cx + x * math.cos(a) - y * math.sin(a), cy + x * math.sin(a) + y * math.cos(a)))
    return pts


if 'chart' in ONLY:
    # =================================================================
    # 2. Harbor chart: waterlined coast, tinted land, routes. 220 x 286
    # =================================================================
    MW, MH = 220, 286
    arm = smooth([(-4, 300), (-4, 204), (20, 198), (50, 208), (82, 216), (110, 212), (134, 198), (152, 178), (162, 150),
                  (160, 118), (150, 90), (144, 62), (152, 38), (170, 22), (194, 14), (214, 20), (222, 34), (210, 38),
                  (196, 34), (184, 42), (182, 62), (192, 92), (204, 128), (208, 168), (200, 208), (180, 244), (156, 274),
                  (140, 300)], 8)
    island = smooth([(46, 96), (60, 84), (80, 84), (94, 94), (92, 110), (74, 118), (56, 114)], 8, closed=True)
    land_p = Plate(MW, MH); land_p.poly(arm); land_p.poly(island)
    la = land_p.arr()
    dist = ndimage.distance_transform_edt(la < 0.5) / S
    wl = np.zeros_like(la)
    for k, dd in enumerate((1.8, 3.8, 6.2, 9.0, 12.4)):
        wl = np.maximum(wl, np.clip(1 - np.abs(dist - dd) / (0.62 - k * 0.07), 0, 1) * (1 - k * 0.1))
    wl *= (la < 0.5)
    coast = Plate(MW, MH)
    coast.line(arm, 1.2); coast.line(island + [island[0]], 1.2)
    # land carries a light 65-line screen tint, as tourist maps did
    tint = Plate(MW, MH)
    pitch = 2.6
    for j in range(int(MH / pitch / 0.866) + 2):
        for i in range(int(MW / pitch) + 2):
            tint.ell((i + (j % 2) * 0.5) * pitch, j * pitch * 0.866, 0.5, 0.5)
    chart_blue = np.maximum(np.maximum(wl, coast.arr()), tint.arr() * la * 0.95)
    # a road along the arm and through the town, drawn double, knocked out of the tint
    road = smooth([(0, 252), (40, 248), (84, 242), (126, 236), (164, 222), (184, 186), (190, 140), (180, 100), (170, 66), (176, 44), (192, 30)], 8)
    rk_ = Plate(MW, MH); rk_.line(road, 2.6)
    rkk = rk_.arr()
    chart_blue = chart_blue * (1 - rkk * la)
    rd = Plate(MW, MH)
    for off in (-1.3, 1.3):
        rd.line([(x, y + off) for x, y in road], 0.45)
    chart_blue = np.maximum(chart_blue, rd.arr() * la)
    sym = Plate(MW, MH)
    for x, y in ((112, 120), (118, 113), (108, 110), (123, 123), (115, 128)):     # ledge rocks
        sym.line([(x - 2.2, y), (x + 2.2, y)], 0.8); sym.line([(x, y - 2.2), (x, y + 2.2)], 0.8)
    sym.ell(206, 27, 2.4, 2.4)                                                       # light on the point
    cxn, cyn = 28, 34                                                                # north arrow
    sym.ell(cxn, cyn, 11, 11, None, 255, 0.6)
    sym.poly([(cxn, cyn - 17), (cxn + 4, cyn), (cxn - 4, cyn)])
    sym.poly([(cxn, cyn + 17), (cxn + 4, cyn), (cxn - 4, cyn)], 0, 255, 0.6)
    sym.rect(82, 214, 86, 228)                                                       # town pier
    sym.line([(60, 22), (110, 22)], 0.9)                                             # scale bar, one mile
    for x in (60, 85, 110): sym.line([(x, 18), (x, 22)], 0.7)
    sym.rect(60, 21, 85, 23)
    chart_blue = np.maximum(chart_blue * (1 - region(MW, MH, lambda m: m.rect(80, 212, 88, 230))), sym.arr())
    # red plate: the two cruise courses, bell buoy, light flash, pier dot
    rt = Plate(MW, MH)
    def dotted(pts, step, r):
        pts = [np.array(p, float) for p in pts]
        acc = 0
        for a_, b_ in zip(pts, pts[1:]):
            L = np.linalg.norm(b_ - a_)
            while acc < L:
                q = a_ + (b_ - a_) * acc / L
                rt.ell(q[0], q[1], r, r)
                acc += step
            acc -= L
    seal = smooth([(86, 212), (96, 182), (104, 152), (100, 128), (110, 100), (132, 104), (136, 128), (126, 154), (112, 182), (90, 212)], 10)
    dotted(seal, 3.6, 0.85)
    supper = smooth([(84, 212), (64, 186), (38, 156), (28, 124), (32, 96), (48, 70), (80, 60), (110, 66), (132, 84), (142, 112),
                     (144, 150), (128, 190), (92, 213)], 10)
    sp = Plate(MW, MH)
    acc, on, seg = 0.0, True, [supper[0]]
    for a_, b_ in zip(supper, supper[1:]):
        acc += math.dist(a_, b_)
        if on: seg.append(b_)
        if acc > (5 if on else 3):
            if on and len(seg) > 1: sp.line(seg, 1.0)
            on, acc, seg = not on, 0.0, [b_]
    rt.ell(152, 150, 3.2, 3.2, None, 255, 0.9)    # bell buoy
    rt.poly([(152, 145.5), (155, 151.5), (149, 151.5)])
    rt.ell(206, 27, 6, 6, None, 255, 0.8)          # light flash ring
    rt.ell(84, 222, 3.4, 3.4)                      # Town Pier
    chart_red = np.maximum(rt.arr(), sp.arr())
    compose(MW, MH, [(inkify(np.clip(chart_blue, 0, 1), 5, 0.45, 0.15, 0.02), BLUE, (0, 0)),
                     (inkify(np.clip(chart_red, 0, 1), 6, 0.55, 0.2, 0.0), RED, (1.1, 0.8))], 'chart.png')
    print('chart')


if 'lobster' in ONLY:
    # =================================================================
    # 3. Engraved lobster for the supper panel, 220 x 150, head left
    # =================================================================
    LW_, LH_ = 220, 150
    cy = 75
    parts = []          # (points, shade side) in drawing order, back to front
    # legs first so the body covers their roots
    legs = Plate(LW_, LH_)
    for k in range(4):
        x0 = 92 + k * 9
        for sg in (-1, 1):
            legs.line(smooth([(x0, cy + sg * 10), (x0 - 2, cy + sg * 22), (x0 + 6, cy + sg * 32), (x0 + 12, cy + sg * 36)], 6), 0.75)
    # antennae
    ant = Plate(LW_, LH_)
    for sg in (-1, 1):
        ant.line(smooth([(66, cy + sg * 4), (52, cy + sg * 14), (40, cy + sg * 34), (44, cy + sg * 54), (80, cy + sg * 66), (150, cy + sg * 68), (206, cy + sg * 62)], 10), 0.7)
        ant.line(smooth([(66, cy + sg * 3), (58, cy + sg * 8), (52, cy + sg * 10)], 6), 0.5)   # short antennules
    # claws: merus, carpus, propodus (big), dactyl (moving finger)
    def claw(sg, big):
        out = []
        out.append(part(68, cy + sg * 19, 26, 8, 215 if sg < 0 else 145, 0.2))      # merus, body to wrist
        out.append(part(54, cy + sg * 28, 13, 9, 200 if sg < 0 else 160, 0.1))     # carpus
        L, Wd = (48, 24) if big else (46, 16)
        pc = (26, cy + sg * 32)
        out.append(part(pc[0], pc[1], L, Wd, 180 + sg * 8, 0.38))                  # propodus
        out.append(part(pc[0] - 9, pc[1] + sg * (Wd * 0.40), L * 0.6, Wd * 0.34, 180 - sg * 10, 0.5))  # dactyl, outer side
        return out
    claws = claw(-1, True) + claw(1, False)
    cara = part(90, cy, 58, 30, 0, 0.18)
    rostrum = [(62, cy - 3), (50, cy), (62, cy + 3)]
    segs = []
    x = 118
    for k, (L, Wd) in enumerate(((11, 27), (10.5, 26), (10, 24.5), (9.5, 23), (9, 20), (8.5, 17))):
        segs.append(part(x + L / 2, cy, L + 3, Wd, 0, 0.0))
        x += L
    fan = [part(x + 7, cy, 16, 9, 0, 0.3), part(x + 6, cy - 7, 15, 7, -28, 0.3), part(x + 6, cy + 7, 15, 7, 28, 0.3)]
    body = Plate(LW_, LH_)
    ol = Plate(LW_, LH_)
    shade = np.zeros((LH_ * S, LW_ * S), np.float32)
    order = claws + segs[::-1] + fan + [cara]
    full = np.zeros_like(shade)
    for i, p in enumerate(order):
        m = region(LW_, LH_, lambda mm: mm.poly(p))
        # each new part knocks out what lies under it, then adds its own outline and shading
        cen = np.mean(np.array(p), axis=0)
        up = region(LW_, LH_, lambda mm: mm.poly([(q[0] - 1.6, q[1] - (4.2 if cen[1] <= cy + 1 else 3.2)) for q in p]))
        crescent = m * (1 - up)
        sh = hatch(LW_, LH_, crescent, 12, 1.05, 0.42, 0.05, 100 + i)
        light = hatch(LW_, LH_, m * up, 12, 2.4, 0.32, 0.1, 200 + i, gaps=0.35) * 0.7
        o = Plate(LW_, LH_); o.line(p + [p[0]], 0.85)
        shade = shade * (1 - m) + np.maximum(sh, light)
        ol_arr = o.arr()
        full = np.maximum(full * (1 - m), ol_arr)
        full = np.maximum(full, ol_arr)
        body.poly(p)
    body.poly(rostrum)
    # carapace groove, segment pleura ticks, eyes, crusher teeth
    det = Plate(LW_, LH_)
    det.line(smooth([(84, cy - 13), (80, cy - 4), (80, cy + 4), (84, cy + 13)], 6), 0.6)
    for sg in (-1, 1):
        det.ell(64, cy + sg * 5, 1.6, 1.6)
    dt = Plate(LW_, LH_); dt.poly(rostrum, 0, 255, 0.7)
    lob_blue = np.maximum(np.maximum(full, shade), np.maximum(det.arr(), dt.arr()))
    bm = body.arr()
    lob_blue = np.maximum(lob_blue, (legs.arr() + ant.arr()) * (1 - bm))
    red_body = np.maximum(bm, legs.arr() * 0.0)
    compose(LW_, LH_, [(inkify(np.clip(red_body, 0, 1) * 0.94, 9, 0.6, 0.25, 0.04), RED, (0, 0)),
                       (inkify(np.clip(lob_blue, 0, 1), 10, 0.42, 0.15, 0.0), BLUE, (-1.2, 0.8))], 'lobster.png', alpha=True)
    print('lobster')


# =====================================================================
# 4. Wear and ink layers, full face, 576 x 864 css at 2x
# =====================================================================
if 'wear' in ONLY:
    FW, FH = 576 * 2, 864 * 2
    def wear(seed, folds=True, spot=None):
        rng = np.random.default_rng(seed)
        a = np.zeros((FH, FW), np.float32)
        lo = rng.random((14, 10)).astype(np.float32)
        lo = np.asarray(Image.fromarray((lo * 255).astype(np.uint8)).resize((FW, FH), Image.BICUBIC), np.float32) / 255
        a += ndimage.gaussian_filter(lo, 40) * 16
        yy, xx = np.mgrid[0:FH, 0:FW]
        edge = np.minimum(np.minimum(xx, FW - 1 - xx), np.minimum(yy, FH - 1 - yy)).astype(np.float32)
        a += np.clip(1 - edge / 70, 0, 1) ** 2 * 60
        for cx, cy in ((0, 0), (FW, 0), (0, FH), (FW, FH)):
            d = np.hypot(xx - cx, yy - cy)
            a += np.clip(1 - d / 150, 0, 1) ** 1.5 * 34
        if folds:   # rack-card handouts get carried folded once, top to bottom, in a pocket
            y0 = FH // 2
            a += np.exp(-((yy - y0) / 3.0) ** 2) * 22 + np.exp(-((yy - y0 - 5) / 9.0) ** 2) * 7
        if spot:
            sx, sy, sr = spot
            d = np.hypot((xx - sx), (yy - sy) / 0.88)
            ring = np.exp(-((d - sr) / 5.0) ** 2) * 26 + np.clip(1 - d / sr, 0, 1) * 10
            a += ndimage.gaussian_filter(ring, 3)
        rgba = np.zeros((FH, FW, 4), np.uint8)
        rgba[..., 0], rgba[..., 1], rgba[..., 2] = 118, 96, 60
        rgba[..., 3] = np.clip(a, 0, 255).astype(np.uint8)
        return Image.fromarray(rgba, 'RGBA')
    # no fold on this card: it's a 6 x 9 rack card handed out flat; the wear is edges and a little handling
    wear(84, folds=False).save(os.path.join(A, 'wear-front.png'))
    wear(1984, folds=False, spot=(FW - 210, FH - 380, 70)).save(os.path.join(A, 'wear-back.png'))

    def inkmottle(seed):
        """Paper-coloured soft mottling laid over the solids so flat ink looks pressed, not digital."""
        rng = np.random.default_rng(seed)
        m = rng.random((FH // 6, FW // 6)).astype(np.float32)
        m = ndimage.gaussian_filter(m, 2.2)
        m = (m - m.mean()) / (m.std() + 1e-6)
        m = np.asarray(Image.fromarray(((np.clip(m, -3, 3) + 3) / 6 * 255).astype(np.uint8)).resize((FW, FH), Image.BICUBIC), np.float32) / 255
        al = np.clip((m - 0.6) * 140, 0, 34)
        rgba = np.zeros((FH, FW, 4), np.uint8)
        rgba[..., 0], rgba[..., 1], rgba[..., 2] = PAPER
        rgba[..., 3] = al.astype(np.uint8)
        return Image.fromarray(rgba, 'RGBA')
    inkmottle(5).save(os.path.join(A, 'paper-ink-front.png'))
    inkmottle(6).save(os.path.join(A, 'paper-ink-back.png'))
    for old in ('bay-art.png',):
        p = os.path.join(A, old)
        if os.path.exists(p): os.remove(p)
    print('painted')
