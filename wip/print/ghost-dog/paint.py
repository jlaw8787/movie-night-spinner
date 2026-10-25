"""Paints the assets for the Autumn Moon take-out menu (Ghost Dog: The Way of the Samurai, 1999).
A legal-size (8.5 x 14 in) take-out menu on pale green copier stock, printed two colour (black and
red) at a quick-print shop and folded in three. Wear is big and gentle: two soft fold creases, a
little edge rub, one faint soy sauce ring on the back cover and a soft grease blot on the inside.
Also paints the red moon logo with three birds flying across it.
Writes assets/wear-outside.png, assets/wear-inside.png, assets/moon-logo.png."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FW, FH, S = 1344, 816, 2
W, H = FW * S, FH * S


def mottle(w, h, scale, lo, hi, seed):
    random.seed(seed)
    Image.core  # noqa
    n = Image.effect_noise((max(2, w // scale), max(2, h // scale)), 60).resize((w, h), Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(scale * 0.6))
    return n.point(lambda v: int(max(0, min(255, lo + (v - 70) / 116 * (hi - lo)))))


def edge_mask(width, power=2.0):
    small = Image.new('L', (W // 8, H // 8), 0)
    px = small.load()
    sw, sh = small.size
    wd = width / 8
    for y in range(sh):
        for x in range(sw):
            d = min(x, y, sw - 1 - x, sh - 1 - y)
            px[x, y] = int(255 * max(0.0, 1 - d / wd) ** power)
    return small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))


def creases(img, dark_side):
    """Two vertical fold creases: a soft shadow on one side, a soft highlight on the other."""
    sh = Image.new('L', (W, H), 0); hi = Image.new('L', (W, H), 0)
    ds, dh = ImageDraw.Draw(sh), ImageDraw.Draw(hi)
    for fx in (448 * S, 896 * S):
        off = -1 if dark_side == 'left' else 1
        ds.rectangle((fx + off * 6 * S - 3 * S, 0, fx + off * 6 * S + 3 * S, H), fill=60)
        ds.rectangle((fx - 1, 0, fx + 1, H), fill=70)
        dh.rectangle((fx - off * 5 * S - 3 * S, 0, fx - off * 5 * S + 3 * S, H), fill=90)
    sh = ImageChops.multiply(sh.filter(ImageFilter.GaussianBlur(5 * S)), mottle(W, H, 90, 120, 255, 5))
    hi = hi.filter(ImageFilter.GaussianBlur(4 * S))
    dl = Image.new('RGBA', (W, H), (60, 70, 50, 0)); dl.putalpha(sh)
    hl = Image.new('RGBA', (W, H), (250, 252, 244, 0)); hl.putalpha(hi.point(lambda v: int(v * 0.6)))
    return Image.alpha_composite(Image.alpha_composite(img, dl), hl)


def base(seed):
    em = edge_mask(46 * S, 1.8)
    a = ImageChops.multiply(em, mottle(W, H, 70, 60, 255, seed)).point(lambda v: int(v * 0.38))
    a = ImageChops.lighter(a, mottle(W, H, 150, 0, 16, seed + 1))
    img = Image.new('RGBA', (W, H), (150, 140, 80, 0)); img.putalpha(a)
    return img


def ring(img, cx, cy, r, seed, col=(120, 70, 30), op=0.30):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=6 * S)
    d.ellipse((cx - r + 5 * S, cy - r + 3 * S, cx + r - 3 * S, cy + r - 6 * S), outline=120, width=3 * S)
    m = m.filter(ImageFilter.GaussianBlur(3 * S))
    m = ImageChops.multiply(m, mottle(W, H, 16, 40, 255, seed)).point(lambda v: int(v * op))
    l = Image.new('RGBA', (W, H), col + (0,)); l.putalpha(m)
    return Image.alpha_composite(img, l)


def blot(img, cx, cy, rx, ry, seed, col=(150, 130, 60), op=0.16):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(14 * S))
    m = ImageChops.multiply(m, mottle(W, H, 30, 120, 255, seed)).point(lambda v: int(v * op))
    l = Image.new('RGBA', (W, H), col + (0,)); l.putalpha(m)
    return Image.alpha_composite(img, l)


# outside: creases bend toward the outside, a soy ring on the back cover top right, rubbed corners
out = base(11)
out = creases(out, 'left')
out = ring(out, int(852 * S), int(40 * S), 58 * S, 31)
out.resize((FW * 2, FH * 2)).save(os.path.join(A, 'wear-outside.png'))

# inside: valley folds, one soft grease blot low on the left panel, mostly in the margin
ins = base(21)
ins = creases(ins, 'right')
ins = blot(ins, int(30 * S), int(770 * S), 70 * S, 46 * S, 41)
ins.resize((FW * 2, FH * 2)).save(os.path.join(A, 'wear-inside.png'))

# ---- moon logo: red disc, three birds crossing it in paper colour ----
L = 1200
RED = (179, 38, 30, 255)
PAPER = (219, 235, 211, 255)
logo = Image.new('RGBA', (L, L), (0, 0, 0, 0))
d = ImageDraw.Draw(logo)
d.ellipse((60, 60, L - 60, L - 60), fill=RED)
# a thin outer ring, quick-print style
d.ellipse((14, 14, L - 14, L - 14), outline=RED, width=14)


def bez(p0, p1, p2, p3, n=24):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out


def bird(dr, cx, cy, s, ang, flip=False):
    """A pigeon gliding, wings raised in a shallow V, fan tail, small head."""
    def P(pts):
        ca, sa = math.cos(ang), math.sin(ang)
        r = []
        for x, y in pts:
            if flip: y = -y
            r.append((cx + (x * ca - y * sa) * s, cy + (x * sa + y * ca) * s))
        return r
    # body, head and beak
    body = bez((-1.3, 0.0), (-1.0, -0.42), (0.9, -0.42), (1.35, -0.12)) + bez((1.35, -0.12), (1.5, -0.05), (1.5, 0.12), (1.3, 0.2)) \
        + bez((1.3, 0.2), (0.8, 0.42), (-1.0, 0.38), (-1.3, 0.0))
    dr.polygon(P(body), fill=PAPER)
    dr.polygon(P(bez((1.15, -0.25), (1.35, -0.48), (1.75, -0.4), (1.78, -0.12)) + [(2.08, -0.05), (1.75, 0.04)] + bez((1.75, 0.04), (1.6, 0.18), (1.3, 0.16), (1.15, 0.05))), fill=PAPER)
    # fan tail
    tail = bez((-1.1, -0.18), (-1.6, -0.35), (-2.0, -0.55), (-2.3, -0.55)) + bez((-2.3, -0.55), (-2.45, -0.2), (-2.45, 0.2), (-2.3, 0.55)) \
        + bez((-2.3, 0.55), (-2.0, 0.55), (-1.6, 0.35), (-1.1, 0.18))
    dr.polygon(P(tail), fill=PAPER)
    # near wing, raised: leading edge bows forward, trailing edge in feather scallops
    lead = bez((0.55, -0.2), (0.75, -0.9), (0.4, -1.8), (-0.35, -2.55))
    trail = [(-0.35, -2.55)]
    tips = [(-0.62, -2.35), (-0.78, -2.05), (-0.86, -1.7), (-0.88, -1.35), (-0.84, -1.0), (-0.75, -0.65)]
    prev = (-0.35, -2.55)
    for tx, ty in tips:
        trail += bez(prev, (prev[0] - 0.05, prev[1] + 0.05), (tx + 0.12, ty - 0.12), (tx, ty), 6)
        trail.append((tx + 0.16, ty - 0.02))
        prev = (tx + 0.16, ty - 0.02)
    trail += [(-0.55, -0.25)]
    dr.polygon(P(lead + trail), fill=PAPER)
    # far wing, lower, foreshortened
    far = bez((0.35, 0.15), (0.45, 0.6), (0.2, 1.05), (-0.25, 1.35)) + bez((-0.25, 1.35), (-0.55, 1.2), (-0.65, 0.8), (-0.5, 0.2))
    dr.polygon(P(far), fill=PAPER)


bird(d, 520, 560, 122, -0.20)
bird(d, 860, 330, 74, -0.32)
bird(d, 290, 300, 52, -0.12)
# three thin cloud streaks across the lower moon
for (x0, x1, y, w) in [(150, 760, 900, 16), (330, 1020, 950, 12), (220, 640, 1000, 10)]:
    d.rounded_rectangle((x0, y - w // 2, x1, y + w // 2), radius=w // 2, fill=PAPER)
# keep everything inside the disc
mask = Image.new('L', (L, L), 0); ImageDraw.Draw(mask).ellipse((60, 60, L - 60, L - 60), fill=255)
inner = Image.new('RGBA', (L, L), (0, 0, 0, 0)); inner.paste(logo, (0, 0), mask)
ringl = Image.new('RGBA', (L, L), (0, 0, 0, 0)); ImageDraw.Draw(ringl).ellipse((14, 14, L - 14, L - 14), outline=RED, width=14)
logo = Image.alpha_composite(ringl, inner)
# paper colour areas become transparent so the page shows through like unprinted stock
px = logo.load()
for y in range(L):
    for x in range(L):
        r, g, b, a = px[x, y]
        if a and g > 150:
            px[x, y] = (0, 0, 0, 0)
logo = logo.resize((560, 560), Image.LANCZOS)
logo.save(os.path.join(A, 'moon-logo.png'))
print('painted')
