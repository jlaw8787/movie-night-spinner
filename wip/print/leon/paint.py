"""Paints the art for the Corner Food Market weekly circular (Leon: The Professional, 1994).
A two-colour newsprint flyer: black plus one spot green. Every picture is clip art printed as a
coarse halftone screen, the way a neighbourhood grocer's circular came off a web press.
Writes assets/carton.png, plant.png, shake.png, dirtcup.png, baguette.png, burst.png,
and the soft newsprint wear: assets/wear-front.png, assets/wear-back.png."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
BLACK = (29, 28, 26)
GREEN = (30, 122, 70)
SS = 4          # supersample while drawing, saved at 2x display


def screen(dens, cell, angle):
    """dens: float array 0..1 at supersampled size. Returns bool ink mask as a round-dot halftone."""
    h, w = dens.shape
    y, x = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle)
    u = (x * math.cos(a) + y * math.sin(a)) / cell
    v = (-x * math.sin(a) + y * math.cos(a)) / cell
    fu = u - np.floor(u) - 0.5
    fv = v - np.floor(v) - 0.5
    t = np.sqrt(fu * fu + fv * fv) / 0.7071          # 0 centre .. 1 corner
    r = np.sqrt(np.clip(dens, 0, 1))                   # dot radius from coverage
    ink = t < r * 0.86
    ink |= dens > 0.94                                 # solids print solid
    ink &= dens > 0.04
    return ink


class Art:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.W, self.H = w * 2 * SS // 2, h * 2 * SS // 2
        self.k = Image.new('L', (self.W, self.H), 0)   # black density
        self.g = Image.new('L', (self.W, self.H), 0)   # green density
        self.kl = Image.new('L', (self.W, self.H), 0)  # black line work (solid)
        self.gl = Image.new('L', (self.W, self.H), 0)  # green solids
        self.p = Image.new('L', (self.W, self.H), 0)   # paper knockouts (white highlights over all)

    def s(self, v):
        return v * SS

    def pts(self, pts):
        return [(x * SS, y * SS) for x, y in pts]

    def save(self, name, kcell=7, gcell=7):
        kd = np.asarray(self.k, np.float32) / 255
        gd = np.asarray(self.g, np.float32) / 255
        kink = screen(kd, kcell * SS / 2, 45) | (np.asarray(self.kl) > 127)
        gink = screen(gd, gcell * SS / 2, 15) | (np.asarray(self.gl) > 127)
        knock = np.asarray(self.p) > 127
        kink &= ~knock
        gink &= ~knock
        out = np.zeros((self.H, self.W, 4), np.float32)
        # green first, black overprints
        for ink, col in ((gink, GREEN), (kink, BLACK)):
            for c in range(3):
                out[..., c] = np.where(ink, col[c], out[..., c])
            out[..., 3] = np.where(ink, 255, out[..., 3])
        im = Image.fromarray(out.astype(np.uint8), 'RGBA')
        im = im.resize((self.w * 2, self.h * 2), Image.LANCZOS)
        im.save(os.path.join(A, name))


def shade(img, box, top, bottom, kind='v'):
    """Linear density ramp inside box (supersampled coords) added to a layer."""
    x0, y0, x1, y1 = [int(v) for v in box]
    arr = np.asarray(img, np.float32).copy()
    n = (y1 - y0) if kind == 'v' else (x1 - x0)
    ramp = np.linspace(top, bottom, max(n, 1)) * 255
    if kind == 'v':
        arr[y0:y1, x0:x1] = np.maximum(arr[y0:y1, x0:x1], ramp[:, None])
    else:
        arr[y0:y1, x0:x1] = np.maximum(arr[y0:y1, x0:x1], ramp[None, :])
    return Image.fromarray(arr.astype(np.uint8), 'L')


def masked(layer, mask, value):
    """Set layer to max(layer, value) where mask is on."""
    fill = Image.new('L', layer.size, value)
    return Image.composite(Image.fromarray(np.maximum(np.asarray(layer), np.asarray(fill))), layer, mask)


# ---------------- quart milk carton, three-quarter view ----------------
def carton():
    a = Art(250, 330)
    s = SS
    # front panel x 20..150, y 120..318 ; side panel to the right, receding
    F = [(20, 122), (150, 122), (150, 318), (20, 318)]
    Sd = [(150, 122), (226, 104), (226, 296), (150, 318)]
    roofF = [(20, 122), (85, 52), (150, 122)]             # front gable slope (seen as triangle face)
    roofS = [(85, 52), (161, 34), (226, 104), (150, 122)]  # sloped roof plane on the side
    fin = [(83, 52), (159, 34), (159, 18), (83, 36)]       # sealed fin along the ridge
    m = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m).polygon(a.pts(Sd), fill=255)
    a.g = masked(a.g, m, 120)
    a.g = Image.composite(shade(Image.new('L', m.size, 0), (150 * s, 0, 226 * s, a.H), 0.55, 0.30, 'h'), a.g, m)
    m2 = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m2).polygon(a.pts(roofS), fill=255)
    a.g = masked(a.g, m2, 70)
    m3 = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m3).polygon(a.pts(roofF), fill=255)
    a.k = masked(a.k, m3, 26)
    m4 = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m4).polygon(a.pts(fin), fill=255)
    a.k = masked(a.k, m4, 60)
    gd = ImageDraw.Draw(a.gl)
    # solid green bands on the front panel (the dairy's colour), label sits between them in HTML
    gd.rectangle((20 * s, 122 * s, 150 * s, 146 * s), fill=255)
    gd.rectangle((20 * s, 286 * s, 150 * s, 318 * s), fill=255)
    gd.polygon(a.pts([(150, 122), (226, 104), (226, 124), (150, 146)]), fill=255)
    gd.polygon(a.pts([(150, 286), (226, 266), (226, 296), (150, 318)]), fill=255)
    # light shading on the front panel's right edge
    a.k = Image.composite(shade(Image.new('L', m.size, 0), (110 * s, 146 * s, 150 * s, 286 * s), 0.0, 0.18, 'h'),
                          a.k, Image.fromarray(((np.mgrid[0:a.H, 0:a.W][1] >= 110 * s) & (np.mgrid[0:a.H, 0:a.W][1] < 150 * s) &
                                                (np.mgrid[0:a.H, 0:a.W][0] >= 146 * s) & (np.mgrid[0:a.H, 0:a.W][0] < 286 * s)).astype(np.uint8) * 255))
    kd = ImageDraw.Draw(a.kl)
    lw = int(2.4 * s)
    for poly in (F, Sd, roofF, roofS, fin):
        kd.line(a.pts(poly + [poly[0]]), fill=255, width=lw, joint='curve')
    # crease lines of the gable
    kd.line(a.pts([(85, 52), (85, 36)]), fill=255, width=int(1.6 * s))
    # cast shadow on the ground
    sh = Image.new('L', (a.W, a.H), 0)
    ImageDraw.Draw(sh).polygon(a.pts([(20, 318), (150, 318), (226, 296), (246, 300), (190, 326), (30, 326)]), fill=255)
    a.k = masked(a.k, sh, 70)
    a.save('carton.png', kcell=6, gcell=6)


# ---------------- Chinese evergreen in a pot ----------------
def leaf(cx, cy, length, width, ang):
    pts = []
    for i in range(41):
        t = i / 40
        w = width * math.sin(math.pi * t) ** 0.9 * (1 - 0.35 * t)
        pts.append((t * length, w))
    for i in range(40, -1, -1):
        t = i / 40
        w = width * math.sin(math.pi * t) ** 0.9 * (1 - 0.35 * t)
        pts.append((t * length, -w))
    c, sn = math.cos(ang), math.sin(ang)
    return [(cx + x * c - y * sn, cy + x * sn + y * c) for x, y in pts]


def plant():
    a = Art(230, 260)
    s = SS
    gd = ImageDraw.Draw(a.gl); kd = ImageDraw.Draw(a.kl)
    pd = ImageDraw.Draw(a.p)
    random.seed(1994)
    leaves = [(-152, 92, 26), (-128, 100, 28), (-104, 104, 29), (-80, 100, 28), (-58, 92, 26),
              (-140, 70, 22), (-92, 78, 24), (-40, 74, 22), (-166, 66, 20), (-20, 60, 19)]
    base = (115, 150)
    for deg, ln, wd in leaves:
        ang = math.radians(deg)
        sx = base[0] + random.uniform(-14, 14); sy = base[1]
        stem_len = ln * 0.32
        ex, ey = sx + stem_len * math.cos(ang), sy + stem_len * math.sin(ang)
        kd.line(a.pts([(sx, sy), (ex, ey)]), fill=255, width=int(2 * s))
        poly = leaf(ex, ey, ln, wd * 0.62, ang)
        gd.polygon(a.pts(poly), fill=255)
        kd.line(a.pts(poly + [poly[0]]), fill=255, width=int(1.6 * s))
        # silver variegation: paper knockouts feathered along the midrib
        for j in range(5):
            t = 0.22 + j * 0.14
            px, py = ex + ln * t * math.cos(ang), ey + ln * t * math.sin(ang)
            for side in (-1, 1):
                off = wd * 0.22 * (1 - 0.4 * t)
                qx, qy = px - side * off * math.sin(ang), py + side * off * math.cos(ang)
                pv = leaf(qx, qy, ln * 0.12, wd * 0.12, ang + side * 0.5)
                pd.polygon(a.pts(pv), fill=255)
        kd.line(a.pts([(ex, ey), (ex + ln * 0.9 * math.cos(ang), ey + ln * 0.9 * math.sin(ang))]), fill=255, width=int(1.3 * s))
    # pot: tapered, with a rim
    rim = [(64, 150), (166, 150), (166, 170), (64, 170)]
    body = [(70, 170), (160, 170), (148, 252), (82, 252)]
    m = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m).polygon(a.pts(body), fill=255)
    a.k = masked(a.k, m, 40)
    a.k = Image.composite(shade(Image.new('L', m.size, 0), (70 * s, 0, 160 * s, a.H), 0.15, 0.55, 'h'), a.k, m)
    m2 = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m2).polygon(a.pts(rim), fill=255)
    a.k = masked(a.k, m2, 70)
    # knockouts must not eat the pot
    pd.polygon(a.pts(rim + [(0, 0)])[:0] or [(0, 0), (0, 0), (0, 0)], fill=0)
    pa = np.asarray(a.p).copy(); pa[150 * s:, :] = 0; a.p = Image.fromarray(pa)
    for poly in (rim, body):
        kd.line(a.pts(poly + [poly[0]]), fill=255, width=int(2.4 * s))
    sh = Image.new('L', (a.W, a.H), 0)
    ImageDraw.Draw(sh).ellipse(a.pts([(60, 248), (196, 258)]), fill=255)
    a.k = masked(a.k, sh, 60)
    a.save('plant.png')


# ---------------- tall shake ----------------
def shake():
    a = Art(130, 210)
    s = SS
    kd = ImageDraw.Draw(a.kl); gd = ImageDraw.Draw(a.gl)
    glass = [(24, 70), (106, 70), (96, 196), (34, 196)]
    m = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m).polygon(a.pts(glass), fill=255)
    a.g = masked(a.g, m, 52)
    a.g = Image.composite(shade(Image.new('L', m.size, 0), (24 * s, 0, 106 * s, a.H), 0.18, 0.5, 'h'), a.g, m)
    # highlight stripe down the glass
    ImageDraw.Draw(a.p).polygon(a.pts([(36, 84), (44, 84), (44, 184), (40, 184)]), fill=255)
    # foam dome above the rim
    foam = Image.new('L', (a.W, a.H), 0); fd = ImageDraw.Draw(foam)
    for cx, cy, r in ((38, 66, 16), (58, 58, 20), (80, 60, 18), (98, 68, 12), (66, 70, 18)):
        fd.ellipse(a.pts([(cx - r, cy - r), (cx + r, cy + r)]), fill=255)
    a.k = masked(a.k, foam, 14)
    kd.line(a.pts([(118, 6), (78, 64)]), fill=255, width=int(5 * s))     # straw
    gd.line(a.pts([(116, 9), (80, 61)]), fill=255, width=int(2.4 * s))
    kd.line(a.pts(glass + [glass[0]]), fill=255, width=int(2.4 * s))
    # foam outline: outer edge only
    edge = foam.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 40 else 0).filter(ImageFilter.MaxFilter(5))
    a.kl = Image.fromarray(np.maximum(np.asarray(a.kl), np.asarray(edge)))
    ImageDraw.Draw(a.kl).rectangle((34 * s, 196 * s, 96 * s, 202 * s), fill=255)
    a.save('shake.png')


# ---------------- clay pot dirt cup with mint ----------------
def dirtcup():
    a = Art(150, 160)
    s = SS
    kd = ImageDraw.Draw(a.kl); gd = ImageDraw.Draw(a.gl)
    body = [(28, 74), (122, 74), (110, 150), (40, 150)]
    rim = [(20, 60), (130, 60), (130, 76), (20, 76)]
    m = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m).polygon(a.pts(body), fill=255)
    a.k = Image.composite(shade(Image.new('L', m.size, 0), (28 * s, 0, 122 * s, a.H), 0.12, 0.5, 'h'), a.k, m)
    m2 = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m2).polygon(a.pts(rim), fill=255)
    a.k = masked(a.k, m2, 50)
    # crumb mound
    soil = Image.new('L', (a.W, a.H), 0); sd = ImageDraw.Draw(soil)
    sd.ellipse(a.pts([(22, 46), (128, 70)]), fill=255)
    a.k = masked(a.k, soil, 220)
    random.seed(7)
    pd = ImageDraw.Draw(a.p)
    for _ in range(26):
        x, y = random.uniform(32, 118), random.uniform(52, 64)
        r = random.uniform(1.2, 2.2)
        pd.ellipse(a.pts([(x - r, y - r), (x + r, y + r)]), fill=255)
    # mint sprig
    kd.line(a.pts([(76, 56), (72, 22)]), fill=255, width=int(2 * s))
    for (cx, cy, ln, wd, deg) in ((73, 40, 30, 12, -150), (73, 34, 30, 12, -30), (72, 24, 24, 10, -110), (72, 24, 22, 9, -70)):
        poly = leaf(cx, cy, ln, wd, math.radians(deg))
        gd.polygon(a.pts(poly), fill=255)
        kd.line(a.pts(poly + [poly[0]]), fill=255, width=int(1.4 * s))
    for poly in (rim, body):
        kd.line(a.pts(poly + [poly[0]]), fill=255, width=int(2.4 * s))
    a.save('dirtcup.png')


# ---------------- baguette, part sliced into a party tray ----------------
def baguette():
    a = Art(560, 170)
    s = SS
    kd = ImageDraw.Draw(a.kl); gd = ImageDraw.Draw(a.gl)
    # tray
    tray = [(10, 120), (550, 120), (534, 158), (26, 158)]
    m = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m).polygon(a.pts(tray), fill=255)
    a.g = masked(a.g, m, 60)
    kd.line(a.pts(tray + [tray[0]]), fill=255, width=int(2.4 * s))
    # whole loaf on the left, rising off the tray
    loaf = Image.new('L', (a.W, a.H), 0)
    ImageDraw.Draw(loaf).rounded_rectangle((20 * s, 64 * s, 250 * s, 118 * s), radius=26 * s, fill=255)
    a.k = masked(a.k, loaf, 30)
    a.k = Image.composite(shade(Image.new('L', loaf.size, 0), (0, 64 * s, a.W, 118 * s), 0.1, 0.55), a.k, loaf)
    kd.rounded_rectangle((20 * s, 64 * s, 250 * s, 118 * s), radius=26 * s, outline=255, width=int(2.4 * s))
    pd = ImageDraw.Draw(a.p)
    for i in range(5):                       # scoring slashes, opened up to the crumb
        x = 48 + i * 42
        sl = [(x, 74), (x + 30, 66), (x + 34, 72), (x + 6, 82)]
        pd.polygon(a.pts(sl), fill=255)
        kd.line(a.pts(sl + [sl[0]]), fill=255, width=int(1.6 * s))
    # cut pieces: crust ring, butter line, ham folds (green), crumb
    for i in range(6):
        x = 270 + i * 46
        y = 74 + (i % 2) * 4
        piece = (x, y, x + 40, y + 44)
        pm = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(pm).ellipse(a.pts([piece[:2], piece[2:]]), fill=255)
        a.k = masked(a.k, pm, 18)
        kd.ellipse(a.pts([piece[:2], piece[2:]]), outline=255, width=int(3 * s))
        # filling across the middle
        hm = [(x + 3, y + 19), (x + 37, y + 19), (x + 37, y + 27), (x + 3, y + 27)]
        gd.polygon(a.pts(hm), fill=255)
        for k in range(3):
            gd.ellipse(a.pts([(x + 4 + k * 11, y + 14), (x + 16 + k * 11, y + 22)]), fill=255)
        kd.line(a.pts([(x + 4, y + 18), (x + 36, y + 18)]), fill=255, width=int(1.2 * s))
    # cornichon pile at the front right
    for (cx, cy) in ((520, 104), (506, 110), (530, 112)):
        pc = leaf(cx - 14, cy, 28, 7, math.radians(-8))
        gd.polygon(a.pts(pc), fill=255)
        kd.line(a.pts(pc + [pc[0]]), fill=255, width=int(1.4 * s))
    a.save('baguette.png')


# ---------------- price burst ----------------
def burst():
    a = Art(170, 170)
    s = SS
    pts = []
    for i in range(36):
        r = 84 if i % 2 == 0 else 68
        t = math.radians(i * 10 - 90)
        pts.append((85 + r * math.cos(t), 85 + r * math.sin(t)))
    ImageDraw.Draw(a.gl).polygon(a.pts(pts), fill=255)
    a.save('burst.png')


# ---------------- newsprint wear ----------------
def wear(name, seed, edge_w, tone):
    FW, FH, S2 = 816, 1056, 2
    W, H = FW * S2, FH * S2
    rng = np.random.default_rng(seed)
    small = rng.random((H // 64 + 2, W // 64 + 2)).astype(np.float32)
    mot = Image.fromarray((small * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    mot = np.asarray(mot, np.float32) / 255
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    e = np.clip(1 - d / (edge_w * S2), 0, 1) ** 2.0
    alpha = e * (0.45 + 0.55 * mot) * 0.60 + (mot - 0.5).clip(0) * 0.10
    # a soft thumb-rub where the flyer was held, lower right
    cx, cy = W * 0.9, H * 0.95
    rub = np.exp(-(((x - cx) / (W * 0.16)) ** 2 + ((y - cy) / (H * 0.08)) ** 2))
    alpha = np.maximum(alpha, rub * 0.10)
    a8 = (np.clip(alpha, 0, 1) * 255).astype(np.uint8)
    im = Image.new('RGBA', (W, H), tone + (0,))
    im.putalpha(Image.fromarray(a8))
    im.save(os.path.join(A, name))


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    carton(); plant(); shake(); dirtcup(); baguette(); burst()
    wear('wear-front.png', 94, 90, (176, 146, 86))
    wear('wear-back.png', 12, 90, (176, 146, 86))
    print('painted')
