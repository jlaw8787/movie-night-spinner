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
        """Scale to the drawing size, adding a hand-cut wobble that depends only on position,
        so a fill and its outline wobble together."""
        if len(pts) < 3:
            return [(x * SS, y * SS) for x, y in pts]
        out = []
        n = len(pts)
        closed = pts[0] == pts[-1]
        for i in range(n - 1):
            x0, y0 = pts[i]; x1, y1 = pts[(i + 1) % n]
            seg = math.hypot(x1 - x0, y1 - y0)
            k = max(1, int(seg / 5))
            for j in range(k):
                t = j / k
                x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
                q = x * 0.7 + y * 1.3
                dx = 0.32 * math.sin(q * 0.061 + 1.1) + 0.22 * math.sin(q * 0.137 + 2.3) + 0.12 * math.sin(q * 0.291)
                q = x * 1.2 + y * 0.8
                dy = 0.32 * math.sin(q * 0.053 + 0.4) + 0.22 * math.sin(q * 0.149 + 1.9) + 0.12 * math.sin(q * 0.311 + 3)
                out.append(((x + dx) * SS, (y + dy) * SS))
        if closed:
            out.append(out[0])
        else:
            x, y = pts[-1]
            out.append((x * SS, y * SS))
        return out

    def save(self, name, kcell=5.2, gcell=5.6):
        kd = np.asarray(self.k, np.float32) / 255
        gd = np.asarray(self.g, np.float32) / 255
        kink = screen(kd, kcell * SS / 2, 45) | (np.asarray(self.kl) > 127)
        gink = screen(gd, gcell * SS / 2, 15) | (np.asarray(self.gl) > 127)
        knock = np.asarray(self.p) > 127
        kink &= ~knock
        gink &= ~knock
        # the green plate never quite lines up with the black on a web press
        gink = np.roll(gink, (int(1.1 * SS), int(1.4 * SS)), axis=(0, 1))
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


def hatch(a, region, angle, gap=3.4, width=0.8, cross=None):
    """Engraver's hatching: parallel ruled lines clipped to a region (a polygon in display
    coords, or an 'L' mask at drawing size), added to the solid black line layer."""
    if isinstance(region, Image.Image):
        m = region
    else:
        m = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m).polygon(a.pts(region), fill=255)
    lines = Image.new('L', (a.W, a.H), 0); ld = ImageDraw.Draw(lines)
    for ang in [angle] + ([cross] if cross is not None else []):
        t = math.radians(ang)
        dx, dy = math.cos(t), math.sin(t)
        nx, ny = -dy, dx
        diag = math.hypot(a.w, a.h)
        k = -diag
        while k < diag:
            pts = []
            for i in range(41):
                u = -diag + 2 * diag * i / 40
                wob = 0.18 * math.sin(u * 0.21 + k * 1.3)
                pts.append(((a.w / 2 + dx * u + nx * (k + wob)) * SS, (a.h / 2 + dy * u + ny * (k + wob)) * SS))
            ld.line(pts, fill=255, width=max(1, int(width * SS)))
            k += gap
    hit = np.minimum(np.asarray(lines), np.asarray(m))
    a.kl = Image.fromarray(np.maximum(np.asarray(a.kl), hit))


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
    hatch(a, Sd, 74, 3.6, 0.75)
    hatch(a, [(188, 112), (226, 104), (226, 296), (188, 306)], -16, 3.6, 0.7)
    hatch(a, roofF, 30, 4.2, 0.6)
    a.save('carton.png')


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
    hatch(a, [(118, 172), (160, 172), (148, 252), (118, 252)], 96, 3.2, 0.8)
    hatch(a, [(136, 172), (160, 172), (148, 252), (136, 252)], 20, 3.2, 0.7)
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
    hatch(a, [(80, 76), (106, 70), (96, 196), (74, 196)], 96, 3.0, 0.7)
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
    hatch(a, [(84, 76), (122, 76), (110, 150), (84, 150)], 98, 3.0, 0.8)
    hatch(a, [(104, 76), (122, 76), (110, 150), (100, 150)], 24, 3.0, 0.7)
    a.save('dirtcup.png')


# ---------------- baguette party tray ----------------
def baguette():
    """A whole baguette lying behind, twelve bias-cut bites in two rows in front, on a tray."""
    a = Art(600, 200)
    s = SS

    def mask(poly):
        m = Image.new('L', (a.W, a.H), 0); ImageDraw.Draw(m).polygon(a.pts(poly), fill=255); return m

    def clear(m):
        z = Image.new('L', (a.W, a.H), 0)
        for name in ('k', 'g', 'kl', 'gl', 'p'):
            setattr(a, name, Image.composite(z, getattr(a, name), m))

    def kline(pts, w=2.2, closed=True):
        ImageDraw.Draw(a.kl).line(a.pts(pts + ([pts[0]] if closed else [])), fill=255, width=max(1, int(w * s)), joint='curve')

    # tray
    tray = [(8, 158), (592, 158), (574, 196), (26, 196)]
    m = mask(tray); clear(m); a.g = masked(a.g, m, 70)
    kline(tray, 2.4)
    kline([(20, 168), (580, 168)], 1.1, False)

    # whole baguette, long and thin with pointed ends, lying across the back of the tray
    top, bot = [], []
    for i in range(81):
        t = i / 80
        x = 30 + 540 * t
        h = 15 * math.sin(math.pi * t) ** 0.42
        cy = 108 - 10 * t                       # lies at a slight angle
        top.append((x, cy - h)); bot.append((x, cy + h * 0.9))
    loaf = top + bot[::-1]
    m = mask(loaf); clear(m)
    a.k = Image.composite(shade(Image.new('L', m.size, 0), (0, 80 * s, a.W, 124 * s), 0.18, 0.5), a.k, m)
    under = mask([(px, py + 7) for px, py in top] + bot[::-1])
    hatch(a, under, 8, 2.6, 0.7)
    for i in range(7):                       # the grigne: long diagonal slashes, opened with a raised ear
        x = 74 + i * 66
        cy = 108 - 10 * ((x - 30) / 540)
        sl = leaf(x, cy + 4, 58, 4.6, math.radians(-12))
        ImageDraw.Draw(a.p).polygon(a.pts(sl), fill=255)
        kline(sl, 1.3)
        kline([(x + 6, cy + 1), (x + 54, cy - 10)], 1.8, False)
    kline(loaf, 2.4)

    # bites: short lengths of baguette cut on the bias, cut face toward us on the left
    def bite(x, y, ln=34, r=18):
        rx = 13
        body = [(x, y - r)] + [(x + ln + rx * 0.9 * math.cos(math.pi / 2 - math.pi * j / 12), y - r * math.cos(math.pi * j / 12))
                               for j in range(13)] + [(x, y + r)]
        face = [(x + rx * math.cos(2 * math.pi * j / 32), y + r * math.sin(2 * math.pi * j / 32)) for j in range(32)]
        mb = mask(body); mf = mask(face)
        mm = Image.fromarray(np.maximum(np.asarray(mb), np.asarray(mf)))
        clear(mm)
        a.k = Image.composite(shade(Image.new('L', mb.size, 0), (0, int((y - r) * s), a.W, int((y + r) * s)), 0.20, 0.48), a.k, mb)
        hatch(a, mask([(x, y + 4)] + body[7:]), 4, 2.4, 0.65)
        clear(mf)
        a.k = masked(a.k, mf, 16)                 # pale crumb
        ham = [(x - rx * 0.95 + 2 * rx * 0.95 * j / 8, y - 2 + 1.6 * math.sin(j * 1.9 + x)) for j in range(9)] + \
              [(x + rx * 0.95 - 2 * rx * 0.95 * j / 8, y + 6 + 1.4 * math.sin(j * 2.3 + x)) for j in range(9)]
        hm = mask(ham); hm = Image.fromarray(np.minimum(np.asarray(hm), np.asarray(mf)))
        a.gl = Image.fromarray(np.maximum(np.asarray(a.gl), np.asarray(hm)))
        ImageDraw.Draw(a.kl).line(a.pts([(x - rx * 0.8, y - 4), (x + rx * 0.8, y - 4.5)]), fill=255, width=int(1.0 * s))
        random.seed(int(x * 7 + y))
        for _ in range(7):                          # holes in the crumb
            hx = x + random.uniform(-rx * 0.6, rx * 0.6); hy = random.choice([y - random.uniform(7, 13), y + random.uniform(9, 14)])
            ImageDraw.Draw(a.kl).ellipse(a.pts([(hx - 1.1, hy - .8), (hx + 1.1, hy + .8)]), fill=255)
        for cxp in (x - rx * 0.35, x + rx * 0.4):   # cornichon coins in the filling
            ImageDraw.Draw(a.kl).ellipse(a.pts([(cxp - 2.2, y), (cxp + 2.2, y + 3.4)]), outline=255, width=int(.9 * s))
        kline(body, 2.0, False)
        kline(face, 2.6)

    for i in range(6):
        bite(222 + i * 54, 126)
    for i in range(6):
        bite(200 + i * 54, 146)

    # cornichons and a pot of Dijon at the right end
    pot = [(548, 124), (586, 124), (582, 160), (552, 160)]
    m = mask(pot); clear(m); a.k = masked(a.k, m, 30)
    hatch(a, [(568, 124), (586, 124), (582, 160), (566, 160)], 96, 2.6, 0.7)
    kline(pot, 2.0)
    rim = [(567 + 19 * math.cos(math.pi * j / 16), 124 + 5 * math.sin(math.pi * j / 16)) for j in range(32)]
    m = mask(rim); clear(m); a.k = masked(a.k, m, 190); kline(rim, 1.6)
    for (cx, cy, dg) in ((80, 182, -4), (112, 186, 6), (142, 181, -2)):
        pc = leaf(cx - 16, cy, 32, 7, math.radians(dg))
        m = mask(pc); clear(m)
        ImageDraw.Draw(a.gl).polygon(a.pts(pc), fill=255)
        for j in range(4):
            bx = cx - 10 + j * 6
            ImageDraw.Draw(a.p).ellipse(a.pts([(bx - .8, cy - 2), (bx + .8, cy - .4)]), fill=255)
        kline(pc, 1.3)
    a.save('baguette.png')
    im = Image.open(os.path.join(A, 'baguette.png'))
    im.crop((0, 140, im.width, im.height)).save(os.path.join(A, 'baguette.png'))


# ---------------- plate of spaghetti for Tony's ad ----------------
def spaghetti():
    a = Art(250, 150)
    s = SS
    kd = ImageDraw.Draw(a.kl); gd = ImageDraw.Draw(a.gl)
    plate = Image.new('L', (a.W, a.H), 0)
    ImageDraw.Draw(plate).ellipse(a.pts([(8, 40), (242, 144)]), fill=255)
    a.k = Image.composite(shade(Image.new('L', plate.size, 0), (0, 40 * s, a.W, 144 * s), 0.05, 0.32), a.k, plate)
    kd.ellipse(a.pts([(8, 40), (242, 144)]), outline=255, width=int(2.4 * s))
    kd.ellipse(a.pts([(34, 52), (216, 132)]), outline=255, width=int(1.3 * s))
    # nest of pasta: many loose loops, sauce as a dark screen in the middle
    nest = Image.new('L', (a.W, a.H), 0)
    ImageDraw.Draw(nest).ellipse(a.pts([(50, 30), (200, 118)]), fill=255)
    pd = ImageDraw.Draw(a.p)
    pd.ellipse(a.pts([(50, 30), (200, 118)]), fill=255)
    random.seed(25)
    strands = Image.new('L', (a.W, a.H), 0); sd = ImageDraw.Draw(strands)
    for _ in range(46):
        cx, cy = random.uniform(80, 170), random.uniform(52, 98)
        rx, ry = random.uniform(18, 52), random.uniform(8, 24)
        t0 = random.uniform(0, 6.28); span = random.uniform(2.2, 4.4)
        pts = [(cx + rx * math.cos(t0 + span * i / 30), cy + ry * math.sin(t0 + span * i / 30)) for i in range(31)]
        sd.line(a.pts(pts), fill=255, width=int(1.5 * s))
    a.p = Image.fromarray(np.where(np.asarray(strands) > 0, 0, np.asarray(a.p)).astype(np.uint8))
    a.kl = Image.fromarray(np.maximum(np.asarray(a.kl), np.asarray(strands)))
    sauce = Image.new('L', (a.W, a.H), 0)
    ImageDraw.Draw(sauce).ellipse(a.pts([(92, 46), (160, 84)]), fill=255)
    sauce = sauce.filter(ImageFilter.GaussianBlur(6 * s))
    a.k = Image.fromarray(np.maximum(np.asarray(a.k), (np.asarray(sauce) * 0.75).astype(np.uint8)))
    a.p = Image.fromarray(np.where(np.asarray(sauce) > 60, 0, np.asarray(a.p)).astype(np.uint8))
    for (cx, cy, deg) in ((118, 54, -40), (136, 50, 20), (128, 60, 80)):
        poly = leaf(cx, cy, 20, 7, math.radians(deg))
        gd.polygon(a.pts(poly), fill=255)
        kd.line(a.pts(poly + [poly[0]]), fill=255, width=int(1.2 * s))
    # fork resting on the rim
    kd.line(a.pts([(196, 132), (246, 96)]), fill=255, width=int(3.2 * s))
    for k in range(4):
        kd.line(a.pts([(190 - k * 2.2, 128 + k * 2.8), (170 - k * 2.2, 142 + k * 2.8)]), fill=255, width=int(1.4 * s))
    rimband = Image.new('L', (a.W, a.H), 0); rd = ImageDraw.Draw(rimband)
    rd.ellipse(a.pts([(8, 40), (242, 144)]), fill=255); rd.ellipse(a.pts([(30, 40), (226, 128)]), fill=0)
    hatch(a, rimband, 82, 2.8, 0.7)
    a.save('spaghetti.png')


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
def wear(name, seed, edge_w, tone, crease=None, ring=None):
    FW, FH, S2 = 816, 1056, 2
    W, H = FW * S2, FH * S2
    rng = np.random.default_rng(seed)
    small = rng.random((H // 64 + 2, W // 64 + 2)).astype(np.float32)
    mot = Image.fromarray((small * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    mot = np.asarray(mot, np.float32) / 255
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    e = np.clip(1 - d / (edge_w * S2), 0, 1) ** 2.0
    alpha = e * (0.45 + 0.55 * mot) * 0.42 + (mot - 0.5).clip(0) * 0.08
    # a soft thumb-rub where the flyer was held, lower right
    cx, cy = W * 0.9, H * 0.95
    rub = np.exp(-(((x - cx) / (W * 0.16)) ** 2 + ((y - cy) / (H * 0.08)) ** 2))
    alpha = np.maximum(alpha, rub * 0.10)
    a8 = (np.clip(alpha, 0, 1) * 255).astype(np.uint8)
    im = Image.new('RGBA', (W, H), tone + (0,))
    im.putalpha(Image.fromarray(a8))
    if crease:
        # a soft handling crease from being folded into a grocery bag: faint shadow, then a light ridge
        (x0, y0), (x1, y1) = [(px * S2, py * S2) for px, py in crease]
        dist = ((x - x0) * (y1 - y0) - (y - y0) * (x1 - x0)) / math.hypot(x1 - x0, y1 - y0)
        sh = np.exp(-((dist - 6) / 9) ** 2) * 0.08 + np.exp(-((dist - 30) / 44) ** 2) * 0.03
        hi = np.exp(-((dist + 2) / 4.5) ** 2) * 0.14
        fade = np.clip(np.minimum.reduce([x, y, W - x, H - y]) / (60 * S2), 0.55, 1)
        shade_l = Image.new('RGBA', (W, H), (92, 74, 44, 0)); shade_l.putalpha(Image.fromarray((np.clip(sh * fade, 0, 1) * 255).astype(np.uint8)))
        hi_l = Image.new('RGBA', (W, H), (252, 249, 238, 0)); hi_l.putalpha(Image.fromarray((np.clip(hi * fade, 0, 1) * 255).astype(np.uint8)))
        im = Image.alpha_composite(Image.alpha_composite(im, shade_l), hi_l)
    if ring:
        # where a sweating quart carton stood: a rounded square, darker at its rim, uneven
        cx, cy, side = ring[0] * S2, ring[1] * S2, ring[2] * S2
        ang = math.radians(ring[3])
        u = (x - cx) * math.cos(ang) + (y - cy) * math.sin(ang)
        v = -(x - cx) * math.sin(ang) + (y - cy) * math.cos(ang)
        rr = side * 0.12
        qx = np.maximum(np.abs(u) - (side / 2 - rr), 0); qy = np.maximum(np.abs(v) - (side / 2 - rr), 0)
        sd = np.sqrt(qx ** 2 + qy ** 2) + np.minimum(np.maximum(np.abs(u) - (side / 2 - rr), np.abs(v) - (side / 2 - rr)), 0) - rr
        wob = 1 + 0.5 * np.sin(np.arctan2(v, u) * 3 + 1) * np.sin(np.arctan2(v, u) * 7)
        edge = np.exp(-((sd + 3 * S2) / (2.6 * S2 * wob.clip(.4))) ** 2) * 0.30
        inside = (sd < 0) * 0.05 * mot
        gap = (np.abs(np.arctan2(v, u) - 2.3) < 0.5) * 1.0       # the ring breaks where the carton tilted
        ra = np.clip((edge + inside) * (1 - 0.8 * gap), 0, 1)
        ring_l = Image.new('RGBA', (W, H), (120, 98, 60, 0)); ring_l.putalpha(Image.fromarray((ra * 255).astype(np.uint8)))
        im = Image.alpha_composite(im, ring_l)
    im.save(os.path.join(A, name))


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    carton(); plant(); shake(); dirtcup(); baguette(); spaghetti(); burst()
    wear('wear-front.png', 94, 64, (176, 146, 86), crease=((560, -20), (836, 470)))
    wear('wear-back.png', 12, 64, (176, 146, 86), crease=((-20, 586), (280, 1076)), ring=(724, 980, 152, 7))
    print('painted')
