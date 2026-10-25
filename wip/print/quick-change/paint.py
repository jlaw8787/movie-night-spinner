"""Paints the art and soft textures for the Runway Lounge table card, 1990 (PIL only).
Printed look: two spot inks (brown key, orange) offset on cover stock, with the orange plate
a hair out of register, a coarse halftone screen and line-cut (engraved) hatching.

assets/header-art.png     front header: halftone sun, line-cut 747 climbing out, terminal and runway, speed stripes
assets/back-art.png       back header: speed stripes with a small line-cut control tower and tail fin
assets/foot-stripes.png   speed stripes for the foot of each face
assets/wear-front.png, assets/wear-back.png   soft mottling, edge wear and a laminate sheen
assets/stain-ring.png     the ring a cold glass leaves on the laminate"""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
S = 3                                   # paint at 3x the CSS size
W, H = 408, 1056
BROWN = (66, 40, 26)
ORANGE = (228, 110, 34)
RUST = (176, 64, 30)

def ink(mask, colour, seed, starve=0.16):
    """Turn an L mask into an RGBA ink layer with a little ink starvation and a rough edge."""
    random.seed(seed)
    w, h = mask.size
    m = mask.filter(ImageFilter.GaussianBlur(0.9)).point(lambda v: 255 if v > 118 else (v * 2 if v > 60 else 0))
    # big soft starvation: ink a little thinner in patches, never pixel noise
    n = Image.new('L', (w // 24 + 1, h // 24 + 1))
    n.putdata([random.randrange(int(255 * (1 - starve)), 256) for _ in range(n.width * n.height)])
    n = n.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))
    m = ImageChops.multiply(m, n)
    out = Image.new('RGBA', (w, h), colour + (255,)); out.putalpha(m)
    return out

def halftone(gray, pitch, angle=45):
    """gray: L image, 255 = full ink. Returns an L mask of round dots on a rotated screen."""
    w, h = gray.size
    out = Image.new('L', (w, h), 0); d = ImageDraw.Draw(out)
    a = math.radians(angle); ca, sa = math.cos(a), math.sin(a)
    R = int(math.hypot(w, h)) + pitch
    gp = gray.load()
    for i in range(-R // pitch, R // pitch + 1):
        for j in range(-R // pitch, R // pitch + 1):
            u, v = i * pitch, j * pitch
            x, y = u * ca - v * sa, u * sa + v * ca
            if 0 <= x < w and 0 <= y < h:
                t = gp[int(x), int(y)] / 255
                if t > 0.004:
                    r = pitch * 0.72 * math.sqrt(t)
                    d.ellipse((x - r, y - r, x + r, y + r), fill=255)
    return out

def hatch(size, spacing, width_fn, angle=0):
    """Line-cut hatching: parallel lines whose weight is width_fn(y_fraction)."""
    w, h = size
    big = Image.new('L', (w * 2, h * 2), 0); d = ImageDraw.Draw(big)
    for y in range(0, h * 2, spacing):
        lw = width_fn(min(max((y - h / 2) / h, 0), 1))
        if lw > 0.3: d.line((0, y, w * 2, y), fill=255, width=max(1, round(lw)))
    big = big.rotate(angle, resample=Image.BICUBIC)
    return big.crop((w // 2, h // 2, w // 2 + w, h // 2 + h))

def jet747(scale):
    """Side view of a 747, nose to the right, as an L outline mask, a hatched fill mask and details.
    Units: 0 to 100 along the fuselage."""
    U = scale
    def P(pts, ox=0, oy=0): return [((x + 8) * U + ox, (y - 10) * U + oy) for x, y in pts]
    w, h = int(118 * U), int(62 * U)
    body = [(100, 50.2), (99.2, 48.4), (97.6, 46.6), (95.2, 44.6), (92, 42.9), (88, 41.9), (78, 41.6), (72.5, 42.0),
            (68.5, 43.6), (64, 44.6), (20, 44.6), (12, 44.0), (6, 42.4), (1.5, 41.4), (-1.2, 42.6), (1, 46.0),
            (6, 49.0), (14, 52.6), (24, 54.4), (92, 54.4), (96.6, 53.6), (99.2, 52.2)]
    fin = [(15, 44.4), (6.5, 25.5), (1.6, 23.8), (-1.6, 24.4), (0.8, 41.8), (4, 44.4)]
    stab = [(10, 47.6), (-2.6, 46.0), (-5.6, 47.0), (-4.8, 48.0), (6, 50.4)]
    wing = [(66, 51.8), (54, 54.6), (34, 61.6), (30.4, 62.2), (29.8, 61.4), (40, 55.4), (45, 53.0)]
    eng = [((52, 54.9), (61.5, 58.1)), ((38, 59.4), (46.5, 62.4))]
    out = Image.new('L', (w, h), 0); fill = Image.new('L', (w, h), 0); det = Image.new('L', (w, h), 0)
    od, fd, dd = ImageDraw.Draw(out), ImageDraw.Draw(fill), ImageDraw.Draw(det)
    for poly in (body, fin, stab, wing):
        fd.polygon(P(poly), fill=255)
        od.line(P(poly) + [P(poly)[0]], fill=255, width=max(2, int(U * 0.42)), joint='curve')
    for (a, b) in eng:
        bx = P([a, b]); fd.rounded_rectangle(bx, radius=U * 1.2, fill=255)
        od.rounded_rectangle(bx, radius=U * 1.2, outline=255, width=max(2, int(U * 0.42)))
        dd.line((bx[0][0] + U * 0.8, bx[0][1] + U * 0.9, bx[0][0] + U * 0.8, bx[1][1] - U * 0.9), fill=255, width=max(2, int(U * 0.5)))
        px = (bx[0][0] + bx[1][0]) / 2
        dd.line((px, bx[0][1] - U * 1.4, px + U * 2.2, bx[0][1]), fill=255, width=max(2, int(U * 0.45)))   # pylon
    # cheatline under the windows, upper deck windows and the main window row
    dd.line(P([(97, 49.0), (14, 49.0)]), fill=255, width=max(2, int(U * 0.9)))
    for x in range(20, 92, 2): dd.rectangle(P([(x, 46.6), (x + 0.7, 47.5)]), fill=255)
    for x in range(75, 88, 2): dd.rectangle(P([(x, 43.3), (x + 0.7, 44.1)]), fill=255)
    dd.polygon(P([(97.4, 46.6), (95.6, 45.4), (94.4, 46.6), (96.2, 47.2)]), fill=255)       # cockpit glass
    for x in (82, 56, 30): dd.line(P([(x, 45.4), (x, 48.0)]), fill=255, width=max(1, int(U * 0.3)))   # door outlines
    # engraved shading: light hatching on top, heavier underneath
    hz = Image.new('L', (w, h), 0); hd = ImageDraw.Draw(hz)
    y0, y1 = 41.6, 54.4                       # fuselage top and belly in units
    sp = max(5, int(U * 1.15))
    for y in range(0, h, sp):
        t = min(max((y / U + 10 - y0) / (y1 - y0), 0), 1)
        lw = 1.5 if t < 0.5 else 1.5 + (t - 0.5) * 7
        hd.line((0, y, w, y), fill=255, width=max(2, round(lw)))
    fillmask = ImageChops.multiply(fill, hz)
    # the wing and tail get diagonal hatching so they read as separate surfaces
    wmask = Image.new('L', (w, h), 0); ImageDraw.Draw(wmask).polygon(P(wing), fill=255); ImageDraw.Draw(wmask).polygon(P(fin), fill=255)
    dh = hatch((w, h), max(4, int(U * 0.85)), lambda t: 1.6, angle=-35)
    fillmask = ImageChops.lighter(fillmask, ImageChops.multiply(wmask, dh))
    return ImageChops.lighter(ImageChops.lighter(out, fillmask), det)

def stripes(w, ys, dx=0):
    """Speed stripes: list of (y, thickness, colour) on a w-wide canvas."""
    hmax = max(y + t for y, t, c in ys) + 4
    layers = {}
    for y, t, c in ys:
        m = layers.setdefault(c, Image.new('L', (w, hmax), 0))
        ImageDraw.Draw(m).rectangle((-10, y, w + 10, y + t - 1), fill=255)
    return layers, hmax

# ---------------------------------------------------------------- front header
AW, AH = W * S, 300 * S
random.seed(1990)
key = Image.new('L', (AW, AH), 0)          # brown plate
org = Image.new('L', (AW, AH), 0)          # orange plate
kd, od = ImageDraw.Draw(key), ImageDraw.Draw(org)
hz = int(AH * 0.70)                          # horizon

# 1. the sun, a coarse halftone that thins toward its rim, cut by bands below the middle
cx, cy, R = int(AW * 0.66), int(AH * 0.43), int(AW * 0.30)
g = Image.new('L', (AW, AH), 0); gp = g.load()
for y in range(max(0, cy - R), min(AH, cy + R)):
    for x in range(max(0, cx - R), min(AW, cx + R)):
        r = math.hypot(x - cx, y - cy) / R
        if r < 1: gp[x, y] = int(255 * (0.92 - 0.55 * r ** 2.2))
gd = ImageDraw.Draw(g)
yb, gap = cy + int(R * 0.12), 6
while yb < cy + R:
    gd.rectangle((0, yb, AW, yb + gap), fill=0); yb += gap + max(10, int(46 - (yb - cy) * 0.11)); gap += 3
gd.rectangle((0, hz, AW, AH), fill=0)
org = ImageChops.lighter(org, halftone(g, 13))
# a pale orange screen for the sky behind, fading upward
sky = Image.new('L', (AW, AH), 0); sp = ImageDraw.Draw(sky)
for y in range(hz):
    sp.line((0, y, AW, y), fill=int(255 * 0.32 * (y / hz) ** 1.4))
org = ImageChops.lighter(org, halftone(sky, 13))

# 2. ground: the terminal and tower in line-cut, runway lights in perspective
gl = Image.new('L', (AW, AH), 0); gld = ImageDraw.Draw(gl)
x = 0
while x < AW:
    bw = random.randrange(70, 210); bh = random.choice((26, 38, 52, 64, 80))
    if random.random() < 0.22: gld.chord((x, hz - 46, x + bw, hz + 46), 180, 360, fill=255)
    else: gld.rectangle((x, hz - bh, x + bw, hz), fill=255)
    x += bw + random.randrange(4, 40)
tx = int(AW * 0.17)
gld.rectangle((tx - 16, hz - 250, tx + 16, hz), fill=255)
gld.polygon([(tx - 64, hz - 300), (tx + 64, hz - 300), (tx + 48, hz - 250), (tx - 48, hz - 250)], fill=255)
gld.rectangle((tx - 70, hz - 318, tx + 70, hz - 300), fill=255)
gld.rectangle((tx - 3, hz - 360, tx + 3, hz - 318), fill=255)
gh = hatch((AW, AH), 7, lambda t: 3.2, angle=90)
ground = ImageChops.multiply(gl, gh)
gd2 = ImageDraw.Draw(ground)
# tower cab glass left open, with mullions
gd2.rectangle((tx - 58, hz - 296, tx + 58, hz - 262), fill=0)
for k in range(-58, 60, 23): gd2.rectangle((tx + k, hz - 296, tx + k + 5, hz - 262), fill=255)
gd2.line((0, hz, AW, hz), fill=255, width=5)
key = ImageChops.lighter(key, ground)
# the field below the horizon: horizontal engraved lines that tighten toward the viewer
fd = ImageDraw.Draw(key)
yy, step = hz + 10, 10
while yy < AH:
    fd.line((0, yy, AW, yy), fill=255, width=max(2, int(2 + (yy - hz) / 60))); step = max(5, step - 0.4); yy += int(step) + 4
# runway: a clear wedge with edge lights and centreline bars
vx = int(AW * 0.60)
rw = Image.new('L', (AW, AH), 0); ImageDraw.Draw(rw).polygon([(vx - 18, hz + 4), (vx + 18, hz + 4), (vx + 560, AH), (vx - 560, AH)], fill=255)
key = ImageChops.subtract(key, rw)
rd = ImageDraw.Draw(key)
for side in (-1, 1):
    rd.line((vx + side * 18, hz + 4, vx + side * 560, AH), fill=255, width=4)
for i in range(1, 9):
    t = (i / 8) ** 1.8; y = hz + 4 + (AH - hz) * t; wbar = 3 + 22 * t; hbar = 2 + 9 * t
    rd.rectangle((vx - wbar, y - hbar, vx + wbar, y + hbar), fill=255)
ld = ImageDraw.Draw(org)
for side in (-1, 1):
    for i in range(1, 13):
        t = (i / 12) ** 1.8; y = hz + 4 + (AH - hz) * t; xx = vx + side * (18 + 542 * t); r = 3 + 9 * t
        ld.ellipse((xx - r, y - r * 0.7, xx + r, y + r * 0.7), fill=255)

# 3. engraved cloud streaks crossing the sun
cd = ImageDraw.Draw(key)
for (x0, y0, n) in ((60, 150, 4), (int(AW * 0.48), int(AH * 0.56), 5), (int(AW * 0.70), int(AH * 0.22), 3)):
    for k in range(n):
        L = random.randrange(140, 300) - k * 22
        xs = x0 + random.randrange(-30, 40)
        cd.line((xs, y0 + k * 13, xs + L, y0 + k * 13), fill=255, width=4)

# 4. the jet climbing out, line-cut in the key plate, over the sun
jet = jet747(6.4).rotate(10, resample=Image.BICUBIC, expand=True)
# knock the sun dots out behind the jet so it reads cleanly
sil = jet.filter(ImageFilter.MaxFilter(9)).point(lambda v: 255 if v > 30 else 0)
jx, jy = int(AW * 0.27), int(AH * 0.08)
holes = Image.new('L', (AW, AH), 0); holes.paste(sil, (jx, jy))
org = ImageChops.subtract(org, holes)
key = ImageChops.subtract(key, holes)
key.paste(ImageChops.lighter(key.crop((jx, jy, jx + jet.width, jy + jet.height)), jet), (jx, jy))

# 5. speed stripes along the bottom edge of the art: clear a band, then lay three stripes
SY = AH - 66
for p in (key, org):
    ImageDraw.Draw(p).rectangle((0, SY - 14, AW, AH), fill=0)
rust = Image.new('L', (AW, AH), 0)
ImageDraw.Draw(org).rectangle((-4, SY, AW + 4, SY + 23), fill=255)
ImageDraw.Draw(rust).rectangle((-4, SY + 32, AW + 4, SY + 45), fill=255)
ImageDraw.Draw(key).rectangle((-4, SY + 54, AW + 4, SY + 61), fill=255)

def compose(key, org, rust, seed, shift=(4, 2)):
    w, h = key.size
    base = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    o = ink(org, ORANGE, seed + 1)
    base.alpha_composite(o, (shift[0], shift[1]))          # orange plate a hair out of register
    if rust is not None:
        r = ink(rust, RUST, seed + 2); base.alpha_composite(r, (shift[0] // 2, 0))
    k = ink(key, BROWN, seed + 3, starve=0.12)
    # overprint: where brown sits on orange, darken rather than cover
    base = Image.alpha_composite(base, k)
    return base

art = compose(key, org, rust, 11)
art.save(os.path.join(A, 'header-art.png'))

# ---------------------------------------------------------------- back header and foot stripes
def stripe_band(w, h, seed, flip=False, tower=False):
    k = Image.new('L', (w, h), 0); o = Image.new('L', (w, h), 0); r = Image.new('L', (w, h), 0)
    rows = [(0, 24, o), (32, 14, r), (52, 8, k)]
    if flip: rows = [(h - 8 - y - t + 8, t, p) for y, t, p in rows]
    for y, t, p in rows:
        ImageDraw.Draw(p).rectangle((-4, y, w + 4, y + t - 1), fill=255)
    return compose(k, o, r, seed)

stripe_band(W * S, 66, 21).save(os.path.join(A, 'stripes-top.png'))
stripe_band(W * S, 66, 23, flip=True).save(os.path.join(A, 'stripes-foot.png'))

# a small line-cut vignette for the back: tail fin of the 747 and the tower over the stripes
BW, BH = 150 * S, 120 * S
k = Image.new('L', (BW, BH), 0); o = Image.new('L', (BW, BH), 0)
bh = int(BH * 0.86)
kd = ImageDraw.Draw(k)
t0 = int(BW * 0.52)
kd.rectangle((t0 - 12, bh - 200, t0 + 12, bh), fill=255)
kd.polygon([(t0 - 50, bh - 240), (t0 + 50, bh - 240), (t0 + 38, bh - 200), (t0 - 38, bh - 200)], fill=255)
kd.rectangle((t0 - 55, bh - 254, t0 + 55, bh - 240), fill=255)
kd.rectangle((t0 - 2, bh - 290, t0 + 2, bh - 254), fill=255)
hh = hatch((BW, BH), 7, lambda t: 3.0, angle=90)
k = ImageChops.multiply(k, hh)
kd = ImageDraw.Draw(k)
kd.rectangle((t0 - 45, bh - 236, t0 + 45, bh - 206), fill=0)
for q in range(-45, 47, 18): kd.rectangle((t0 + q, bh - 236, t0 + q + 4, bh - 206), fill=255)
kd.line((0, bh, BW, bh), fill=255, width=5)
for i in range(4): kd.line((0, bh + 12 + i * 11, BW, bh + 12 + i * 11), fill=255, width=3 + i)
og = Image.new('L', (BW, BH), 0); ogp = og.load()
scx, scy, sr = int(BW * 0.52), int(bh - 150), 130
for y in range(BH):
    for x in range(BW):
        rr = math.hypot(x - scx, y - scy) / sr
        if rr < 1 and y < bh - 4: ogp[x, y] = int(255 * (0.85 - 0.5 * rr ** 2))
o = halftone(og, 12)
o = ImageChops.subtract(o, k.filter(ImageFilter.MaxFilter(7)))
compose(k, o, None, 31).save(os.path.join(A, 'tower-art.png'))

# ---------------------------------------------------------------- soft wear, laminate sheen
def wear(name, seed, warm):
    random.seed(seed)
    w, h = W * 2, H * 2
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    for _ in range(22):                                   # big soft blotches
        x, y = random.randrange(w), random.randrange(h); r = random.randrange(110, 280)
        dr.ellipse((x - r, y - r, x + r, y + r), fill=warm + (random.randrange(5, 12),))
    im = im.filter(ImageFilter.GaussianBlur(80))
    edge = Image.new('L', (w, h), 0); ed = ImageDraw.Draw(edge)
    for i in range(26):                                   # handled edges, darker toward the trim
        ed.rectangle((i, i, w - 1 - i, h - 1 - i), outline=int(44 * (1 - i / 26) ** 2.2))
    for (x, y) in ((0, 0), (w, 0), (0, h), (w, h)):        # corners rubbed by the acrylic holder
        ed.ellipse((x - 34, y - 34, x + 34, y + 34), fill=60)
    edge = edge.filter(ImageFilter.GaussianBlur(10))
    ec = Image.new('RGBA', (w, h), (92, 70, 48, 255)); ec.putalpha(edge)
    im = Image.alpha_composite(im, ec)
    # laminate: one long soft diagonal sheen and a faint lift line near the edge
    sh = Image.new('L', (w, h), 0); sd = ImageDraw.Draw(sh)
    sd.polygon([(int(w * 0.10), 0), (int(w * 0.42), 0), (int(w * 1.0), int(h * 0.62)), (int(w * 1.0), int(h * 0.80))], fill=30)
    sh = sh.filter(ImageFilter.GaussianBlur(90))
    sl = Image.new('RGBA', (w, h), (255, 255, 250, 255)); sl.putalpha(sh)
    im = Image.alpha_composite(im, sl)
    lift = Image.new('L', (w, h), 0); ImageDraw.Draw(lift).rounded_rectangle((10, 10, w - 11, h - 11), radius=22, outline=34, width=2)
    lift = lift.filter(ImageFilter.GaussianBlur(1.4))
    ll = Image.new('RGBA', (w, h), (255, 255, 255, 255)); ll.putalpha(lift)
    im = Image.alpha_composite(im, ll)
    im.save(os.path.join(A, name))
wear('wear-front.png', 7, (140, 112, 78))
wear('wear-back.png', 11, (132, 104, 72))

# ---------------------------------------------------------------- a cold glass ring on the laminate
R = 330
ring = Image.new('L', (R * 2, R * 2), 0); rd = ImageDraw.Draw(ring)
rd.ellipse((40, 40, 2 * R - 40, 2 * R - 40), outline=120, width=9)
rd.ellipse((54, 54, 2 * R - 54, 2 * R - 54), outline=46, width=5)
rd.pieslice((0, 0, 2 * R, 2 * R), 200, 236, fill=0)
ring = ring.filter(ImageFilter.GaussianBlur(6))
rc = Image.new('RGBA', (R * 2, R * 2), (120, 96, 66, 255)); rc.putalpha(ring.point(lambda v: int(v * 0.36)))
rc.save(os.path.join(A, 'stain-ring.png'))
print('painted')
