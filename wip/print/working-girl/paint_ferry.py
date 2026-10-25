"""Signature hero for the Whitehall Grill luncheon sheet (Working Girl, 1988): a Kennedy-class Staten Island
ferry crossing the upper bay toward lower Manhattan on a hazy morning, painted in the manner of a mid-century
gouache travel poster. Layered washes, atmospheric depth in the skyline (World Financial Center tops, the twin
towers, 40 Wall's pyramid, 70 Pine's spire, Woolworth's crown, One New York Plaza at the water), sun glitter on
the water, and the ferry built as a real 3D double-ended hull in perspective so it has depth, then painted.
The top of the sky fades into the paper so the wordmark can sit over it.
Output: assets/ferry-hero.png at 2x (1920 x 1200 for a 960 x 600 css box)."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
W, H, HZ = 1920, 1200, 860
PAPER = np.array((243, 235, 225), float)
rng = np.random.default_rng(1988)

def mix(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def noise(w, h, cx, cy, blur):
    n = rng.random((max(2, h // cy), max(2, w // cx)))
    return np.asarray(Image.fromarray((n * 255).astype('uint8')).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))) / 255.0

# ------------------------------------------------------------------ sky
yy, xx = np.mgrid[0:H, 0:W].astype(float)
sky = np.zeros((H, W, 3))
stops = [(0.0, (238, 232, 222)), (0.35, (214, 222, 228)), (0.72, (226, 222, 214)), (1.0, (246, 212, 176))]
t = np.clip(yy / HZ, 0, 1)
for (a, ca), (b, cb) in zip(stops, stops[1:]):
    m = (t >= a) & (t <= b)
    k = ((t - a) / (b - a))[..., None]
    sky = np.where(m[..., None], np.array(ca) + (np.array(cb) - np.array(ca)) * k, sky)
glow = np.exp(-(((xx - 1560) / 520.0) ** 2 + ((yy - 760) / 300.0) ** 2))
sky += glow[..., None] * np.array((26, 14, 0))
# stratus bands, brushed horizontally
st = noise(W, H, 160, 26, 10)
band = np.clip((st - 0.52) * 3.0, 0, 1) * np.clip((yy - 260) / 400, 0, 1) * (yy < HZ)
sky = sky * (1 - band[..., None] * 0.30) + np.array((250, 240, 228)) * band[..., None] * 0.30
img = Image.fromarray(np.clip(sky, 0, 255).astype('uint8'))
d = ImageDraw.Draw(img, 'RGBA')

# ------------------------------------------------------------------ far shores
d.polygon([(0, HZ), (0, HZ - 30), (120, HZ - 44), (210, HZ - 36), (300, HZ - 52), (330, HZ - 20), (360, HZ)], fill=(176, 182, 186))
for x in range(20, 320, 26):
    h = rng.integers(14, 46); d.rectangle((x, HZ - 36 - h, x + 16, HZ - 20), fill=(180, 186, 192))
d.polygon([(1640, HZ), (1700, HZ - 34), (1800, HZ - 46), (1920, HZ - 40), (1920, HZ)], fill=(172, 178, 182))

# ------------------------------------------------------------------ lower Manhattan, 1988
K = 1.05      # px per metre
def bcol(layer):
    return mix((186, 192, 204), (78, 84, 104), min(1, layer)), mix((222, 212, 202), (204, 154, 118), min(1, layer))
def building(x, w, hm, kind, layer, base=HZ - 6):
    col, lit = bcol(layer)
    top = base - hm * K
    sw = max(4, int(w * 0.30))
    def slab(x0, x1, y0):
        d.rectangle((x0, y0, x1, base), fill=col)
        d.rectangle((x1 - max(3, int((x1 - x0) * 0.30)), y0, x1, base), fill=lit)
    if kind == 'wtc':
        slab(x, x + w, top)
        for lx in range(int(x) + 3, int(x + w - sw), 4):
            d.line((lx, top + 4, lx, base), fill=col[:3] + (0,) if False else mix(col, (255, 255, 255), 0.12), width=1)
    elif kind == 'stepped':
        slab(x, x + w, top)
        for i in range(1, 4):
            inset = w * 0.12 * i
            slab(x + inset, x + w - inset, top - 14 * i)
    elif kind == 'dome':
        slab(x, x + w, top)
        d.pieslice((x + w * 0.12, top - w * 0.42, x + w * 0.88, top + w * 0.34), 180, 360, fill=col)
        d.pieslice((x + w * 0.5, top - w * 0.42, x + w * 0.88, top + w * 0.34), 270, 360, fill=lit)
    elif kind == 'pyramid':
        slab(x, x + w, top)
        d.polygon([(x, top), (x + w, top), (x + w / 2, top - w * 0.55)], fill=col)
        d.polygon([(x + w / 2, top - w * 0.55), (x + w, top), (x + w * 0.62, top)], fill=lit)
    elif kind == 'wall40':                     # setbacks, pyramid roof and spire
        slab(x, x + w, top + 90); slab(x + w * 0.15, x + w * 0.85, top + 40); slab(x + w * 0.25, x + w * 0.75, top)
        d.polygon([(x + w * 0.25, top), (x + w * 0.75, top), (x + w * 0.5, top - 34)], fill=mix(col, (90, 130, 120), 0.35))
        d.line((x + w * 0.5, top - 34, x + w * 0.5, top - 70), fill=col, width=3)
    elif kind == 'pine70':                     # slim setbacks, lantern spire
        slab(x, x + w, top + 70); slab(x + w * 0.18, x + w * 0.82, top + 20); slab(x + w * 0.32, x + w * 0.68, top)
        d.polygon([(x + w * 0.38, top), (x + w * 0.62, top), (x + w * 0.5, top - 46)], fill=col)
    elif kind == 'woolworth':
        slab(x, x + w, top + 60); slab(x + w * 0.2, x + w * 0.8, top)
        d.polygon([(x + w * 0.2, top), (x + w * 0.8, top), (x + w * 0.5, top - 40)], fill=col)
        d.line((x + w * 0.5, top - 40, x + w * 0.5, top - 58), fill=col, width=2)
    else:                                      # plain box, banded windows on near ones
        slab(x, x + w, top)
    if layer > 0.7 and kind in ('box', 'grid'):
        for wy in range(int(top) + 8, base - 4, 8):
            d.line((x + 3, wy, x + w - sw - 2, wy), fill=mix(col, (230, 220, 200), 0.18), width=2)
    if kind == 'grid':
        for wx in range(int(x) + 6, int(x + w - sw), 9):
            d.line((wx, top + 4, wx, base), fill=mix(col, (20, 20, 30), 0.25), width=1)

city = [
    # far
    (860, 36, 241, 'woolworth', 0.10), (910, 64, 226, 'box', 0.18), (990, 76, 248, 'box', 0.22), (1500, 70, 160, 'box', 0.20),
    (1560, 60, 120, 'box', 0.15), (780, 50, 150, 'box', 0.15),
    # the twin towers, behind the World Financial Center
    (612, 58, 417, 'wtc', 0.30), (684, 58, 412, 'wtc', 0.34),
    # Financial District cluster
    (1068, 46, 283, 'wall40', 0.46), (1150, 40, 290, 'pine70', 0.50), (1210, 70, 190, 'box', 0.55), (1290, 64, 170, 'box', 0.58),
    (960, 60, 170, 'box', 0.60), (1420, 120, 210, 'box', 0.62), (1020, 54, 150, 'box', 0.66),
    # World Financial Center and Battery Park City
    (408, 62, 152, 'stepped', 0.70), (476, 74, 176, 'stepped', 0.74), (548, 76, 225, 'dome', 0.76), (624, 78, 225, 'pyramid', 0.80),
    (300, 60, 90, 'box', 0.85), (360, 44, 110, 'box', 0.88),
    # at the water: 17 State, One New York Plaza, the Battery
    (1100, 70, 135, 'box', 0.90), (1176, 58, 165, 'box', 0.95), (1320, 92, 195, 'grid', 1.0), (1240, 66, 120, 'box', 1.0),
]
for x, w, hm, kind, layer in sorted(city, key=lambda c: c[4]):
    building(x, w, hm, kind, layer)
img = img.filter(ImageFilter.GaussianBlur(0.8))
veil = Image.new('RGBA', (W, H), (240, 226, 210, 26)); img.paste(veil, (0, 0), veil)
d = ImageDraw.Draw(img, 'RGBA')
# Battery Park trees and the seawall, the ferry terminal low at the water
trees = Image.new('L', (W, H), 0); td = ImageDraw.Draw(trees)
for i in range(420):
    x = rng.uniform(260, 1660); r = rng.uniform(10, 26)
    td.ellipse((x - r, HZ - 30 - r * 0.6, x + r, HZ - 2), fill=255)
trees = trees.filter(ImageFilter.GaussianBlur(1.5))
img.paste(Image.new('RGB', (W, H), (64, 82, 70)), (0, 0), trees)
d = ImageDraw.Draw(img, 'RGBA')
d.rectangle((1380, HZ - 34, 1560, HZ - 2), fill=(118, 112, 110)); d.rectangle((1380, HZ - 34, 1560, HZ - 28), fill=(150, 142, 136))
d.rectangle((250, HZ - 6, 1680, HZ + 3), fill=(112, 106, 100))

# ------------------------------------------------------------------ water
arr = np.asarray(img).astype(float)
wt = np.clip((yy[HZ:] - HZ) / (H - HZ), 0, 1)[..., None]
near, far = np.array((44, 78, 96)), np.array((176, 186, 188))
arr[HZ:] = far + (near - far) * (wt ** 0.65)
arr[HZ:] += (np.exp(-(((xx[HZ:] - 1560) / (180 + (yy[HZ:] - HZ) * 0.9)) ** 2)) * np.exp(-((yy[HZ:] - HZ) / 260.0)))[..., None] * np.array((60, 44, 20))
img = Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))
# skyline reflection
refl = img.crop((0, HZ - 260, W, HZ)).transpose(Image.FLIP_TOP_BOTTOM).resize((W, 170)).filter(ImageFilter.GaussianBlur(3))
mask = Image.linear_gradient('L').resize((W, 170)).point(lambda v: int((255 - v) * 0.42))
img.paste(refl, (0, HZ + 2), mask)
d = ImageDraw.Draw(img, 'RGBA')
for i in range(9000):                         # gouache ripple strokes
    y = HZ + (H - HZ) * (rng.random() ** 1.3)
    t = (y - HZ) / (H - HZ)
    L = rng.uniform(10, 34) + t * 110
    x = rng.uniform(-60, W)
    th = 1.2 + t * 4.5
    r = rng.random()
    if r < 0.45: c = (34, 62, 80, int(36 + 70 * t))
    elif r < 0.80: c = (150, 176, 186, int(40 + 40 * (1 - t)))
    else: c = (250, 232, 206, int(40 + 90 * (1 - t)))
    d.ellipse((x, y, x + L, y + th), fill=c)
for i in range(1600):                         # sun glitter path
    y = HZ + rng.uniform(4, 330) ** 1.0
    x = 1560 + rng.normal(0, 30 + (y - HZ) * 0.42)
    L = rng.uniform(6, 30)
    d.ellipse((x, y, x + L, y + 2.5), fill=(255, 240, 210, int(rng.uniform(80, 190))))

# ------------------------------------------------------------------ the ferry, a real 3D hull in perspective
cam = np.array([-46.0, 15.0, -150.0]); tgt = np.array([52.0, 9.0, 0.0])
f = tgt - cam; f /= np.linalg.norm(f)
rgt = np.cross(f, [0, 1, 0]); rgt /= np.linalg.norm(rgt)
up = np.cross(rgt, f)
def proj(p):
    q = np.asarray(p, float) - cam
    z = q @ f
    return np.array([q @ rgt / z, q @ up / z])

def plan(x0, x1, hw, rx, n=10):
    pts = []
    for i in range(n + 1):                    # far end arc (+x)
        a = -math.pi / 2 + math.pi * i / n
        pts.append((x1 - rx + rx * math.cos(a), hw * math.sin(a)))
    for i in range(n + 1):                    # near end arc (-x)
        a = math.pi / 2 + math.pi * i / n
        pts.append((x0 + rx + rx * math.cos(a), hw * math.sin(a)))
    return pts

OR = np.array((226, 102, 42), float)
SUN = np.array([0.55, 0.45, -0.70]); SUN /= np.linalg.norm(SUN)
faces = []                                     # (depth, poly3d, colour)
def prism(pl, y0, y1, base=OR, top_col=None):
    n = len(pl)
    for i in range(n):
        (ax, az), (bx, bz) = pl[i], pl[(i + 1) % n]
        nrm = np.array([bz - az, 0, -(bx - ax)])
        if np.linalg.norm(nrm) == 0: continue
        nrm /= np.linalg.norm(nrm)
        mid = np.array([(ax + bx) / 2, (y0 + y1) / 2, (az + bz) / 2])
        if nrm @ (cam - mid) <= 0: continue
        sh = 0.62 + 0.42 * max(0, nrm @ SUN)
        quad = [(ax, y0, az), (bx, y0, bz), (bx, y1, bz), (ax, y1, az)]
        faces.append((np.linalg.norm(cam - mid), quad, np.clip(base * sh, 0, 255)))
    if cam[1] > y1:
        c = np.mean([(p[0], y1, p[1]) for p in pl], axis=0)
        faces.append((np.linalg.norm(cam - c) + 0.5, [(p[0], y1, p[1]) for p in pl], top_col if top_col is not None else np.clip(base * 1.06, 0, 255)))

# hull, main deck cabin, saloon deck, top-deck pilot houses, stack and mast (Kennedy class proportions)
prism(plan(0, 100, 12.5, 11), 0, 6.0, OR * 0.92, np.array((150, 70, 40)))
prism(plan(3, 97, 11.0, 9), 6.0, 13.0)
prism(plan(9, 91, 10.2, 8), 13.0, 19.5, OR, np.array((96, 92, 92)))
prism(plan(11, 21, 4.6, 3), 19.5, 24.5)
prism(plan(79, 89, 4.6, 3), 19.5, 24.5)
prism(plan(47.6, 52.4, 2.0, 1.0), 19.5, 30.5, OR * 0.88)
faces.sort(key=lambda f_: -f_[0])

# fit the ferry to its place in the picture
allp = np.array([proj(p) for _, q, _ in faces for p in q])
mn, mx = allp.min(0), allp.max(0)
S = 860 / (mx[0] - mn[0])
WL = 1132                                      # waterline at the near end, px
def scr(p):
    v = proj(p)
    return (650 + (v[0] - mn[0]) * S, 0)
y_near = proj((0, 0, -12.5))[1]
def P(p):
    v = proj(p)
    return (720 + (v[0] - mn[0]) * S, WL - (v[1] - y_near) * S)

SS = 2
lay = Image.new('RGBA', (W * SS, H * SS), (0, 0, 0, 0))
ld = ImageDraw.Draw(lay, 'RGBA')
def poly(pts3, col, a=255):
    ld.polygon([(x * SS, y * SS) for x, y in (P(p) for p in pts3)], fill=tuple(int(c) for c in col) + (a,))
def line3(a3, b3, col, w=2, a=255):
    pa, pb = P(a3), P(b3)
    ld.line((pa[0] * SS, pa[1] * SS, pb[0] * SS, pb[1] * SS), fill=col + (a,), width=w * SS)

for _, q, c in faces:
    poly(q, c)
# details on the camera side (z negative): boot top, rub rails, window rows, open vehicle ends, rails
hwh = 12.5
for xa, xb in ((11, 89),):
    poly([(xa, 0, -hwh - .05), (xb, 0, -hwh - .05), (xb, 1.4, -hwh - .05), (xa, 1.4, -hwh - .05)], (40, 34, 36))
line3((11, 6.0, -hwh - .1), (89, 6.0, -hwh - .1), (250, 238, 222), 2)
line3((11, 3.6, -hwh - .1), (89, 3.6, -hwh - .1), (250, 238, 222), 1)
def windows(x0, x1, y0, y1, z, step, ww):
    x = x0
    while x + ww <= x1:
        poly([(x, y0, z), (x + ww, y0, z), (x + ww, y1, z), (x, y1, z)], (62, 56, 62))
        poly([(x, y1 - (y1 - y0) * 0.35, z - .02), (x + ww * 0.45, y1 - (y1 - y0) * 0.35, z - .02), (x + ww * 0.45, y1, z - .02), (x, y1, z - .02)], (150, 172, 188), 120)
        x += step
windows(12, 88, 8.2, 11.4, -11.06, 3.1, 2.0)
windows(17, 83, 15.0, 18.0, -10.26, 2.6, 1.7)
line3((9, 13.0, -10.3), (91, 13.0, -10.3), (250, 240, 226), 2)
line3((9, 14.6, -10.6), (17, 14.6, -10.6), (250, 240, 226), 1); line3((83, 14.6, -10.6), (91, 14.6, -10.6), (250, 240, 226), 1)
line3((9, 19.5, -10.25), (91, 19.5, -10.25), (250, 240, 226), 2)
line3((11, 21.0, -10.0), (89, 21.0, -10.0), (250, 240, 226), 1, 200)   # top deck rail
for xr in np.arange(11, 89.1, 2.6): line3((xr, 19.5, -10.0), (xr, 21.0, -10.0), (250, 240, 226), 1, 170)
for xa in (11, 79):                             # pilot house windows, white roof
    windows(xa + 1, xa + 9.5, 21.6, 23.6, -4.66, 2.2, 1.6)
    poly([(xa - .5, 24.5, -5.1), (xa + 10.5, 24.5, -5.1), (xa + 10.5, 25.1, -5.1), (xa - .5, 25.1, -5.1)], (250, 242, 230))
poly([(47.6, 29.2, -2.05), (52.4, 29.2, -2.05), (52.4, 30.5, -2.05), (47.6, 30.5, -2.05)], (40, 36, 38))
line3((50, 30.5, 0), (50, 39, 0), (60, 56, 58), 2); line3((47, 35.5, 0), (53, 35.5, 0), (60, 56, 58), 1)
fer = lay.resize((W, H), Image.LANCZOS)
fa = np.asarray(fer).astype(float)
grad = 1.05 - 0.20 * np.clip((yy - 900) / 220.0, 0, 1)        # gouache light falling off toward the water
fa[..., :3] *= grad[..., None]
fa[..., :3] += rng.normal(0, 3.5, (H, W, 1)) * (fa[..., 3:] > 0)
fer = Image.fromarray(np.clip(fa, 0, 255).astype('uint8'), 'RGBA')

# wake and bow wave under the ferry, then the reflection, then the ferry
d = ImageDraw.Draw(img, 'RGBA')
nx, ny = P((0, 0, -6))
for i in range(1100):
    t = rng.random() ** 0.75
    side = rng.choice([-1, 1])
    x = nx - 40 + t * 380 + rng.normal(0, 10)
    y = ny + 6 + t * 46 + side * t * 22 + rng.normal(0, 3 + 5 * t)
    L = rng.uniform(12, 50) * (1 - 0.5 * t)
    d.ellipse((x, y, x + L, y + rng.uniform(2, 6)), fill=(252, 250, 244, int(rng.uniform(70, 200) * (1 - 0.75 * t))))
bx, by = P((100, 0, -4))
for i in range(160):
    x = bx - rng.uniform(0, 90); y = by + rng.uniform(-2, 10)
    d.ellipse((x, y, x + rng.uniform(10, 40), y + 4), fill=(252, 250, 244, int(rng.uniform(90, 200))))
box = fer.getbbox()
rf = fer.crop(box).transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(3))
ra = np.asarray(rf).astype(float)
hh = ra.shape[0]
for y in range(hh):
    ra[y, :, 3] *= 0.42 * (1 - y / hh) * (0.55 + 0.45 * ((y // 4) % 2))
rf = Image.fromarray(ra.astype('uint8'), 'RGBA')
img.paste(rf, (box[0], WL + 6), rf)
img.paste(fer, (0, 0), fer)
d = ImageDraw.Draw(img, 'RGBA')
for gx, gy, s in [(1260, 520, 15), (1300, 548, 11), (420, 470, 13)]:   # gulls
    d.arc((gx - s, gy - s / 2, gx, gy + s / 2), 200, 340, fill=(70, 70, 80), width=3)
    d.arc((gx, gy - s / 2, gx + s, gy + s / 2), 200, 340, fill=(70, 70, 80), width=3)

# ------------------------------------------------------------------ gouache finish
a = np.asarray(img).astype(float)
brush = noise(W, H, 90, 8, 3)[..., None]                   # horizontal brush drag
a = a * (0.965 + 0.07 * brush) + rng.normal(0, 2.5, (H, W, 1))
img = Image.fromarray(np.clip(a, 0, 255).astype('uint8'))
flat = img.filter(ImageFilter.ModeFilter(5))
img = Image.blend(img, flat, 0.45)
# fade the upper sky into the paper for the lettering
a = np.asarray(img).astype(float)
fade = np.clip((yy - 120) / 380.0, 0, 1) ** 1.3
a = PAPER + (a - PAPER) * fade[..., None]
Image.fromarray(np.clip(a, 0, 255).astype('uint8')).save(os.path.join(D, 'assets', 'ferry-hero.png'))
print('painted')
