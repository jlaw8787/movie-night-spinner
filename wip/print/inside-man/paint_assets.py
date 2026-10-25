"""Paints the layers for the Pearl & Broad pizza box lid (Inside Man, 2006).
A stock-style 8 inch box: kraft B-flute corrugate, two-ink flexo (red and black).
Art is drawn as line cuts at 4x, then printed: ink squash, a faint flexo halo, uneven coverage,
washboard banding along the flutes, and red slightly out of register with black.
All outputs are 1536 px square (2x of the 768 px face)."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
F = 768; S = 1536; K = 4; BIG = F * K
rng = np.random.default_rng(2006); random.seed(392)
RED = (176, 36, 27); BLACK = (22, 18, 15)

def blur_noise(scale, sigma, size=S):
    small = rng.random((size // scale + 2, size // scale + 2)).astype('float32')
    im = Image.fromarray((small * 255).astype('uint8')).resize((size, size), Image.BICUBIC)
    a = np.asarray(im.filter(ImageFilter.GaussianBlur(sigma)), dtype='float32') / 255
    return (a - a.min()) / (a.max() - a.min() + 1e-6)

# flutes: B-flute, about 3.2 mm pitch, running across the lid
y = np.arange(S, dtype='float32')
PITCH = 24.0  # px at 2x
crest = (np.cos(y / PITCH * 2 * math.pi) * 0.5 + 0.5)
CREST = np.tile(crest[:, None], (1, S))
CREST *= 0.6 + 0.4 * blur_noise(96, 50)

def save(arr, name):
    Image.fromarray(arr, 'RGBA').save(os.path.join(A, name))

def ink(mask4, color, seed, cover=0.86, wash=0.20, pins=0.99):
    """mask4: L image at 4x. Returns RGBA uint8 at 2x printed like flexo on corrugate."""
    m = mask4.resize((S, S), Image.LANCZOS)
    squash = m.filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.35))
    halo = np.asarray(m.filter(ImageFilter.MaxFilter(7)).filter(ImageFilter.GaussianBlur(0.8)), 'float32') / 255
    core = np.asarray(squash, 'float32') / 255
    halo = np.clip(halo - np.asarray(m.filter(ImageFilter.MaxFilter(5)), 'float32') / 255, 0, 1) * 0.09
    r2 = np.random.default_rng(seed)
    mott = blur_noise(30, 16) * 0.6 + blur_noise(120, 60) * 0.4
    # small soft pinholes where ink skipped the liner
    pin = r2.random((S // 3, S // 3)).astype('float32')
    pin = np.asarray(Image.fromarray(((pin > pins) * 255).astype('uint8')).resize((S, S), Image.BILINEAR).filter(ImageFilter.GaussianBlur(1.3)), 'float32') / 255
    cov = cover + (1 - cover) * mott
    cov *= 1 - wash * (1 - CREST)            # troughs take less ink: washboard bands
    cov *= 1 - 0.55 * np.clip(pin * 2.5, 0, 1)
    a = np.clip(core * cov + halo, 0, 1)
    out = np.zeros((S, S, 4), 'uint8')
    out[..., 0], out[..., 1], out[..., 2] = color
    out[..., 3] = (a * 255).astype('uint8')
    return out

def P(*xy):
    return [v * K for v in xy]

# ---------------- 1. kraft board ----------------
mott = blur_noise(48, 40) * 0.6 + blur_noise(160, 90) * 0.4
dark = (mott - 0.5) * 0.9 + (1 - CREST) * 0.55
alpha = np.clip(dark * 52 + 14, 0, 72).astype('uint8')
kraft = np.zeros((S, S, 4), 'uint8'); kraft[..., 0] = 70; kraft[..., 1] = 42; kraft[..., 2] = 18; kraft[..., 3] = alpha
save(kraft, 'kraft-paper.png')

# ---------------- 2. red plate: checker frame + steaming pie ----------------
red = Image.new('L', (BIG, BIG), 0); d = ImageDraw.Draw(red)
# checker border, 12 px squares, inside the creases
X0, Y0, X1, Y1, CS = 18, 18, F - 18, F - 18, 12
n = int((X1 - X0) / CS)
for i in range(n):
    for j in range(n):
        if (i in (0, n - 1) or j in (0, n - 1)) and (i + j) % 2 == 0:
            d.rectangle(P(X0 + i * CS, Y0 + j * CS, X0 + (i + 1) * CS, Y0 + (j + 1) * CS), fill=255)

# the pie, three-quarter view, on a peel
cx, cy, rx, ry = 440, 136, 90, 39
def ell(cx, cy, rx, ry, w, fill=None):
    d.ellipse(P(cx - rx, cy - ry, cx + rx, cy + ry), outline=255, width=w * K // 2 if w else 0, fill=fill)
# peel handle out to the lower left
# peel blade under the pie
d.ellipse(P(cx - rx - 14, cy - ry - 6 + 14, cx + rx + 14, cy + ry + 6 + 14), outline=255, width=K * 3)
# pie edge (side of crust) with engraved hatching
for t in np.linspace(0.02, 0.98, 70):
    a = math.pi * t
    x = cx + rx * math.cos(a); y0 = cy + ry * math.sin(a)
    d.line(P(x, y0, x, y0 + 9), fill=255, width=int(K * 1.8))
d.arc(P(cx - rx, cy - ry + 9, cx + rx, cy + ry + 9), 0, 180, fill=255, width=K * 3)
# top crust ring and sauce line
ell(cx, cy, rx, ry, 6, fill=0)
d.ellipse(P(cx - rx + 10, cy - ry + 5, cx + rx - 10, cy + ry - 5), outline=255, width=int(K * 2.5))
# cut lines
for k in range(4):
    a = k * math.pi / 4 + 0.2
    d.line(P(cx - (rx - 10) * math.cos(a), cy - (ry - 5) * math.sin(a), cx + (rx - 10) * math.cos(a), cy + (ry - 5) * math.sin(a)), fill=255, width=int(K * 1.7))
# pepperoni with stipple
random.seed(7)
pep = [(-52, -10), (-18, -22), (22, -16), (58, -6), (-40, 14), (2, 6), (40, 18), (-8, 26), (70, 14), (-70, 4)]
for dx, dy in pep:
    px, py = cx + dx, cy + dy
    d.ellipse(P(px - 9, py - 4.5, px + 9, py + 4.5), fill=255)
    for _ in range(5):
        sx, sy = px + random.uniform(-5, 5), py + random.uniform(-2, 2)
        d.ellipse(P(sx - 1, sy - 0.6, sx + 1, sy + 0.6), fill=0)
# cheese stipple between
for _ in range(120):
    a = random.uniform(0, 2 * math.pi); r = math.sqrt(random.random())
    sx, sy = cx + (rx - 14) * r * math.cos(a), cy + (ry - 7) * r * math.sin(a)
    if all((sx - (cx + dx)) ** 2 / 100 + (sy - (cy + dy)) ** 2 / 30 > 1 for dx, dy in pep):
        d.ellipse(P(sx - 1.1, sy - 0.9, sx + 1.1, sy + 0.9), fill=255)
# steam: three wavy strokes
for k, sx in enumerate((404, 440, 476)):
    pts = []
    for i in range(60):
        t = i / 59
        pts.append(tuple(P(sx + 9 * math.sin(t * 2.6 * math.pi + k), 90 - t * 56)))
    d.line(pts, fill=255, width=int(K * 3.6), joint='curve')
red_ink = ink(red, RED, 11)
# out of register: red sits about 1.5 px right and 1 px down of the black
red_ink = np.roll(np.roll(red_ink, 3, axis=1), 2, axis=0)
save(red_ink, 'flexo-red.png')

# ---------------- 3. black plate: rule, skyline and delivery band ----------------
blk = Image.new('L', (BIG, BIG), 0); d = ImageDraw.Draw(blk)
d.rectangle(P(31, 31, F - 31, F - 31), outline=255, width=int(K * 1.5))
BASE, BAND = 292, 320          # skyline ground line, bottom of the reversed delivery band
random.seed(2006)
x = 32
blds = []
while x < F - 32:
    w = random.choice([18, 22, 26, 30, 34, 40])
    h = random.choice([14, 18, 22, 26, 30, 34])
    blds.append((x, w, h)); x += w + random.choice([0, 0, 2])
for i, (x, w, h) in enumerate(blds):
    x1 = min(x + w, F - 32); top = BASE - h
    d.rectangle(P(x, top, x1, BASE), fill=255)
    if h >= 30 and i % 3 == 0:                      # deco setbacks and a spire
        d.rectangle(P(x + 4, top - 6, x1 - 4, top), fill=255)
        d.rectangle(P(x + 8, top - 10, x1 - 8, top - 6), fill=255)
        d.line(P((x + x1) / 2, top - 16, (x + x1) / 2, top - 10), fill=255, width=K * 2)
    elif h <= 34 and i % 2 == 0:                    # rooftop water tower
        tx = x + w * 0.55
        d.rectangle(P(tx - 5, top - 12, tx + 5, top - 4), fill=255)
        d.polygon([tuple(P(tx - 6, top - 12)), tuple(P(tx, top - 17)), tuple(P(tx + 6, top - 12))], fill=255)
        d.line(P(tx - 4, top - 4, tx - 5, top), fill=255, width=K)
        d.line(P(tx + 4, top - 4, tx + 5, top), fill=255, width=K)
    # windows knocked out in rows
    for wy in range(int(top) + 5, BASE - 5, 7):
        for wx in range(int(x) + 4, int(x1) - 5, 6):
            if random.random() < 0.8:
                d.rectangle(P(wx, wy, wx + 3, wy + 3.5), fill=0)
# ground and band
d.rectangle(P(31, BASE, F - 31, BAND), fill=255)
blk_ink = ink(blk, BLACK, 23, cover=0.96, wash=0.09, pins=0.994)
save(blk_ink, 'flexo-black.png')

# ---------------- 4. washboard ink layer laid over the type ----------------
# light kraft showing through the ink along flute troughs, plus soft dropout patches
wash = (1 - CREST) * 0.7 + blur_noise(36, 20) * 0.3
wa = np.clip((wash - 0.35) * 70, 0, 34).astype('uint8')
w = np.zeros((S, S, 4), 'uint8'); w[..., 0] = 205; w[..., 1] = 168; w[..., 2] = 122; w[..., 3] = wa
save(w, 'paper-washboard.png')

# ---------------- 5. grease stain ----------------
def blob(cx, cy, r, n=14, jit=0.22):
    return [(cx + r * (1 + random.uniform(-jit, jit)) * math.cos(i / n * 2 * math.pi),
             cy + r * (1 + random.uniform(-jit, jit)) * math.sin(i / n * 2 * math.pi)) for i in range(n)]
st = Image.new('L', (S, S), 0); dr = ImageDraw.Draw(st)
dr.polygon(blob(1440, 1450, 170), fill=150)
dr.polygon(blob(1300, 1520, 90), fill=130)
dr.polygon(blob(90, 760, 60, 10, .15), fill=100)
body = st.filter(ImageFilter.GaussianBlur(26))
rim = st.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(10))
b = np.asarray(body, 'float32') * 0.40 + np.asarray(rim, 'float32') * 0.45
b *= 0.7 + 0.3 * blur_noise(40, 30)
g = np.zeros((S, S, 4), 'uint8'); g[..., 0] = 92; g[..., 1] = 54; g[..., 2] = 20; g[..., 3] = np.clip(b * 1.2, 0, 105).astype('uint8')
save(g, 'stain-grease.png')

# ---------------- 6. edge wear and fold creases ----------------
yy, xx = np.mgrid[0:S, 0:S].astype('float32')
edge = np.minimum(np.minimum(xx, S - xx), np.minimum(yy, S - yy))
e = np.clip(1 - edge / 40, 0, 1) ** 1.6
e *= 0.5 + 0.8 * blur_noise(24, 14)
corner = np.zeros((S, S), 'float32')
for cx, cy in ((0, 0), (S, 0), (0, S), (S, S)):
    corner = np.maximum(corner, np.clip(1 - np.hypot(xx - cx, yy - cy) / 200, 0, 1))
light = np.clip(e * 120 + corner * 46 * blur_noise(30, 20), 0, 130)
wear = np.zeros((S, S, 4), 'float32'); wear[..., 0] = 236; wear[..., 1] = 218; wear[..., 2] = 186; wear[..., 3] = light
# score lines where the lid folds down: a shadowed groove with a lit shoulder
def groove(dist, pos, depth):
    sh = np.exp(-((dist - pos) / 2.2) ** 2) * depth
    lit = np.exp(-((dist - pos - 5) / 3) ** 2) * depth * 0.5
    return sh, lit
for dist, depth in ((yy, 130), (S - yy, 80), (xx, 85), (S - xx, 85)):    # top is the hinge, deepest
    sh, lit = groove(dist, 14, depth)
    a = wear[..., 3]
    wear[..., 0] = np.where(sh > a, 70, wear[..., 0]); wear[..., 1] = np.where(sh > a, 45, wear[..., 1]); wear[..., 2] = np.where(sh > a, 22, wear[..., 2])
    wear[..., 3] = np.maximum(a, np.maximum(sh, lit * 0.6))
save(np.clip(wear, 0, 255).astype('uint8'), 'wear-edges.png')
print('assets painted')
