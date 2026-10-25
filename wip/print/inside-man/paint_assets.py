"""Paints the soft texture layers for the Pearl & Broad pizza box lid (Inside Man, 2006).
All at 2x (1536 px square). Big gentle shapes only, no pixel noise."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
S = 1536
rng = np.random.default_rng(2006); random.seed(392)

def blur_noise(scale, sigma):
    small = rng.random((S // scale + 2, S // scale + 2)).astype('float32')
    im = Image.fromarray((small * 255).astype('uint8')).resize((S, S), Image.BICUBIC)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(sigma)), dtype='float32') / 255

# 1. kraft board: soft mottling plus the corrugated flutes showing faintly through the liner
mott = blur_noise(48, 40) * 0.6 + blur_noise(160, 90) * 0.4
x = np.arange(S, dtype='float32')
flute = (np.sin(x / 15.5 * math.pi) * 0.5 + 0.5) ** 2           # about 4 mm pitch, horizontal flutes
flute = np.tile(flute[:, None], (1, S))
flute *= 0.55 + 0.45 * blur_noise(96, 60)                         # uneven, as the board was crushed in places
dark = (mott - 0.5) * 0.9 + flute * 0.35
alpha = np.clip(dark * 46 + 10, 0, 60).astype('uint8')
kraft = np.zeros((S, S, 4), 'uint8'); kraft[..., 0] = 70; kraft[..., 1] = 42; kraft[..., 2] = 18; kraft[..., 3] = alpha
Image.fromarray(kraft, 'RGBA').save(os.path.join(A, 'kraft-paper.png'))

# 2. grease stain: oil soaked through from a slice, darker rim, soft
def blob(cx, cy, r, n=14, jit=0.22):
    pts = []
    for i in range(n):
        a = i / n * 2 * math.pi
        rr = r * (1 + random.uniform(-jit, jit))
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts
st = Image.new('L', (S, S), 0); dr = ImageDraw.Draw(st)
dr.polygon(blob(150, 1420, 230), fill=150)
dr.polygon(blob(330, 1500, 120), fill=130)
dr.polygon(blob(1390, 120, 55, 10, .15), fill=110)
body = st.filter(ImageFilter.GaussianBlur(26))
rim = st.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.MaxFilter(9)).filter(ImageFilter.GaussianBlur(10))
b = np.asarray(body, 'float32') * 0.42 + np.asarray(rim, 'float32') * 0.5
b *= 0.7 + 0.3 * blur_noise(40, 30)
g = np.zeros((S, S, 4), 'uint8'); g[..., 0] = 92; g[..., 1] = 54; g[..., 2] = 20; g[..., 3] = np.clip(b * 1.25, 0, 120).astype('uint8')
Image.fromarray(g, 'RGBA').save(os.path.join(A, 'stain-grease.png'))

# 3. edge wear: scuffed, lighter kraft along the box edges and corners, a crushed band near the hinge
yy, xx = np.mgrid[0:S, 0:S].astype('float32')
edge = np.minimum(np.minimum(xx, S - xx), np.minimum(yy, S - yy))
e = np.clip(1 - edge / 70, 0, 1) ** 1.6
e *= 0.5 + 0.8 * blur_noise(24, 14)
corner = np.zeros((S, S), 'float32')
for cx, cy in ((0, 0), (S, 0), (0, S), (S, S)):
    corner = np.maximum(corner, np.clip(1 - np.hypot(xx - cx, yy - cy) / 260, 0, 1))
light = np.clip(e * 120 + corner * 40 * blur_noise(30, 20), 0, 120).astype('uint8')
w = np.zeros((S, S, 4), 'uint8'); w[..., 0] = 236; w[..., 1] = 218; w[..., 2] = 186; w[..., 3] = light
Image.fromarray(w, 'RGBA').save(os.path.join(A, 'wear-edges.png'))
print('assets painted')
