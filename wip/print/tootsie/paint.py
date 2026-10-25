"""Paints the engraved samovar and tea glass for the front of the Tea Room folder.
One ink (deep teal line work) over a soft copper tint plate. Shown at 300x1100, painted at 2x.
Writes assets/samovar.png."""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
K = 2
WD, HD = 300, 1100
INK = (23, 63, 60, 255)
TINT = (222, 150, 128, 85)
TEA = (150, 62, 40, 170)
rnd = random.Random(1982)

tint = Image.new('RGBA', (WD * K, HD * K), (0, 0, 0, 0))
ink = Image.new('RGBA', (WD * K, HD * K), (0, 0, 0, 0))
dt, di = ImageDraw.Draw(tint), ImageDraw.Draw(ink)
P = lambda x, y: (x * K, y * K)

def smooth(pts):
    """Profile as list of (y, r); returns r(y) with cosine easing between points."""
    def r(y):
        for (y0, r0), (y1, r1) in zip(pts, pts[1:]):
            if y0 <= y <= y1:
                t = (y - y0) / (y1 - y0 or 1)
                t = (1 - math.cos(t * math.pi)) / 2
                return r0 + (r1 - r0) * t
        return pts[-1][1]
    return r

def poly(d, pts, w):
    d.line([P(x, y) for x, y in pts], fill=INK, width=max(1, int(w * K)), joint='curve')

# right side lies in shadow: contour lines bunch toward the right edge
THETAS = [-80, -72, -64, -56, -48, -40, -32] + [12 + i * 3.6 for i in range(22)]

def body(cx, y0, y1, prof, bands=(), tinted=True, thetas=THETAS, ell=0.17):
    ys = [y0 + (y1 - y0) * i / 160 for i in range(161)]
    if tinted:
        outline = [P(cx - prof(y), y) for y in ys] + [P(cx + prof(y), y) for y in reversed(ys)]
        dt.polygon(outline, fill=TINT)
        dt.polygon([P(cx + prof(y) * 0.45, y) for y in ys] + [P(cx + prof(y), y) for y in reversed(ys)], fill=TINT)
        dt.polygon([P(cx - prof(y), y) for y in ys] + [P(cx - prof(y) * 0.8, y) for y in reversed(ys)], fill=TINT)
        if (y1 - y0) > 20:                              # cross hatch in the deepest shadow
            for k in range(int(y0) + 3, int(y1) - 2, 5):
                r = prof(k)
                poly(di, [(cx + r * 0.80, k), (cx + r * 0.985, k + 1.5)], 0.7)
    for th in thetas:
        s = math.sin(math.radians(th))
        w = (0.5 + 0.9 * max(0, s) ** 2) if s > 0 else 0.5 + 0.4 * abs(s) ** 2
        pts = [(cx + prof(y) * s, y + prof(y) * ell * math.cos(math.radians(th)) * 0.0) for y in ys]
        poly(di, pts, w)
    poly(di, [(cx - prof(y), y) for y in ys], 1.6)
    poly(di, [(cx + prof(y), y) for y in ys], 2.2)
    for by in bands:
        r = prof(by)
        arc = [(cx + r * math.cos(t / 40 * math.pi), by + r * ell * math.sin(t / 40 * math.pi)) for t in range(41)]
        poly(di, arc, 1.3)
        poly(di, [(x, y + 4) for x, y in arc], 0.8)

def ellipse_ring(cx, cy, r, ell=0.17, w=1.4, full=True):
    n = 60
    rng = range(n + 1) if full else range(n // 2 + 1)
    poly(di, [(cx + r * math.cos(t / (n / 2) * math.pi), cy + r * ell * math.sin(t / (n / 2) * math.pi)) for t in rng], w)

def tube(pts, outer=7, inner=4.2):
    """Outlined metal rod: ink stroke, tint core, then a fine highlight line."""
    di.line([P(x, y) for x, y in pts], fill=INK, width=int(outer * K), joint='curve')
    di.line([P(x, y) for x, y in pts], fill=(244, 226, 220, 255), width=int(inner * K), joint='curve')
    dt.line([P(x, y) for x, y in pts], fill=TINT, width=int(inner * K), joint='curve')
    di.line([P(x + 0.8, y + 0.8) for x, y in pts], fill=INK, width=max(1, int(0.9 * K)), joint='curve')

def arcpts(cx, cy, rx, ry, a0, a1, n=30):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]

def wisp(x, y0, y1, amp=7, w=0.9, ph=0):
    pts = [(x + amp * math.sin((y0 - y) / 26 + ph) * (1 - (y0 - y) / (y0 - y1)), y) for y in range(int(y0), int(y1), -2)]
    poly(di, pts, w)

CX = 146

# ---------------- teapot on the crown ----------------
wisp(CX - 6, 40, 0, 6, 0.8); wisp(CX + 10, 46, 8, 5, 0.7, 1.4)
body(CX, 48, 60, smooth([(48, 6), (60, 10)]), tinted=True)                         # lid knob
body(CX, 60, 150, smooth([(60, 26), (72, 50), (105, 58), (138, 46), (150, 30)]), bands=(72, 138))
tube([(CX + 56, 112), (CX + 76, 104), (CX + 92, 84), (CX + 102, 74)], 8, 4.8)       # spout
tube(arcpts(CX - 58, 106, 22, 24, 120, 250), 6.5, 3.6)                              # handle
body(CX, 150, 178, smooth([(150, 22), (164, 30), (178, 38)]))                       # crown seat
ellipse_ring(CX, 178, 40, w=1.6)

# ---------------- samovar body ----------------
prof = smooth([(184, 44), (220, 80), (300, 104), (420, 106), (520, 92), (600, 66), (630, 52)])
body(CX, 184, 630, prof, bands=(220, 300, 420, 520, 600))
# engraved medallion band on the belly
for i in range(9):
    t = -0.9 + i * 0.225
    x = CX + 104 * math.sin(t); y = 360
    w = 7 * math.cos(t)
    di.ellipse([P(x - w, y - 9), P(x + w, y + 9)], outline=INK, width=max(1, int(1.1 * K)))
# loop handles, both sides
tube(arcpts(CX - 104, 262, 30, 34, 95, 265), 9, 5.4)
tube(arcpts(CX + 104, 262, 30, 34, -85, 85), 9, 5.4)
for sx in (-1, 1):
    di.ellipse([P(CX + sx * 104 - 6, 222), P(CX + sx * 104 + 6, 234)], fill=INK)
    di.ellipse([P(CX + sx * 104 - 6, 290), P(CX + sx * 104 + 6, 302)], fill=INK)
# spigot with its key
tube([(CX + 70, 560), (CX + 104, 560), (CX + 120, 566), (CX + 128, 584)], 10, 6)
tube([(CX + 98, 548), (CX + 98, 534)], 6, 3.4)
di.polygon([P(CX + 86, 530), P(CX + 98, 520), P(CX + 110, 530), P(CX + 98, 538)], fill=INK)
for k in range(3):                                                                    # drip
    pass

# ---------------- neck, foot and ball feet ----------------
body(CX, 630, 700, smooth([(630, 50), (660, 34), (700, 42)]), bands=(660,))
body(CX, 700, 772, smooth([(700, 42), (730, 78), (760, 100), (772, 104)]), bands=(730, 760))
ellipse_ring(CX, 772, 104, w=1.8)
for fx in (-80, -27, 27, 80):
    dt.ellipse([P(CX + fx - 11, 776), P(CX + fx + 11, 798)], fill=TINT)
    di.ellipse([P(CX + fx - 11, 776), P(CX + fx + 11, 798)], outline=INK, width=int(1.4 * K))
    for k in range(4):
        poly(di, [(CX + fx + 2 + k * 2, 780 + k), (CX + fx + 2 + k * 2, 794 - k)], 0.6)

# ---------------- tray ----------------
dt.ellipse([P(CX - 140, 790), P(CX + 140, 836)], fill=TINT)
di.ellipse([P(CX - 140, 790), P(CX + 140, 836)], outline=INK, width=int(1.8 * K))
di.ellipse([P(CX - 126, 796), P(CX + 126, 830)], outline=INK, width=int(1.0 * K))
for i in range(14):                                     # rim shading toward the front right
    a = 20 + i * 9
    x1, y1 = CX + 140 * math.cos(math.radians(a)), 813 + 23 * math.sin(math.radians(a))
    x2, y2 = CX + 126 * math.cos(math.radians(a)), 813 + 17 * math.sin(math.radians(a))
    poly(di, [(x1, y1), (x2, y2)], 0.9)
for y in range(846, 862, 4):                            # cast shadow lines
    poly(di, [(CX - 120 + (y - 846) * 2, y), (CX + 130 - (y - 846) * 2, y)], 0.7)

# ---------------- tea glass in its holder ----------------
GX = 150
wisp(GX - 8, 902, 852, 7, 0.8); wisp(GX + 12, 906, 866, 6, 0.7, 2.0)
glass = smooth([(910, 44), (1000, 40)])
dt.polygon([P(GX - 43, 930), P(GX + 43, 930), P(GX + 40, 1000), P(GX - 40, 1000)], fill=TEA)    # tea
body(GX, 910, 1000, glass, tinted=False, thetas=[-50, 60, 80])
ellipse_ring(GX, 910, 44, w=1.6)
ellipse_ring(GX, 930, 43, w=1.0)
for y in range(940, 1000, 7):                                                      # tea tone
    poly(di, [(GX + 6, y), (GX + 40, y)], 0.6)
# lemon slice floating
di.ellipse([P(GX - 30, 922), P(GX + 2, 936)], fill=(240, 214, 120, 255), outline=INK, width=int(1.1 * K))
for a in range(0, 180, 30):
    poly(di, [(GX - 14, 929), (GX - 14 + 13 * math.cos(math.radians(a)), 929 + 5 * math.sin(math.radians(a)))], 0.6)
# spoon
tube([(GX + 20, 928), (GX + 44, 860)], 5, 2.6)
di.ellipse([P(GX + 38, 846), P(GX + 52, 864)], fill=INK)
# holder (podstakannik): pierced metal sleeve over the lower glass
hold = smooth([(964, 42), (1000, 40), (1020, 46), (1036, 52)])
body(GX, 964, 1036, hold, bands=(964, 1000, 1020))
for i in range(7):
    t = -1.0 + i * 0.33
    x = GX + 41 * math.sin(t); w = 4 * math.cos(t)
    di.ellipse([P(x - w, 976), P(x + w, 992)], fill=(244, 226, 220, 255), outline=INK, width=max(1, int(0.9 * K)))
ellipse_ring(GX, 1036, 52, w=1.6)
tube(arcpts(GX + 44, 1000, 24, 26, -80, 80), 7, 4)
for y in range(1046, 1066, 4):
    poly(di, [(GX - 60 + (y - 1046) * 2, y), (GX + 74 - (y - 1046) * 2, y)], 0.7)

# ---------------- composite ----------------
out = Image.alpha_composite(tint.filter(ImageFilter.GaussianBlur(0.8)), ink)
out.save(os.path.join(D, 'assets', 'samovar.png'))
print('painted', out.size)
