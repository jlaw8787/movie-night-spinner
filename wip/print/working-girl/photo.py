"""Treats the real hero photo (replaces the painted ferry, rule 22): NARA 549900, Staten Island Ferry crossing
toward lower Manhattan, May 1973 (Wil Blanche, DOCUMERICA, public domain). Crops off the slide border, pulls out
the faded magenta cast, warms it toward the burgundy and ivory palette, and lifts the sky toward paper behind the
wordmark. Output: assets/ferry-hero.jpg at 2x (1920 x 1200 for the 960 x 600 css box)."""
import os
import numpy as np
from PIL import Image, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
im = Image.open(os.path.join(D, 'src', 'ferry-nara-549900.jpg')).convert('RGB')
W, H = im.size                                   # 1920 x 1288
x0, x1 = 22, W - 22                              # trim the slide mount edge
cw = x1 - x0; ch = int(cw / 1.6)
y0 = 40
im = im.crop((x0, y0, x1, y0 + ch)).resize((1920, 1200), Image.LANCZOS)
a = np.asarray(im).astype(np.float32)
# per-channel levels from robust percentiles removes the dye fade
for c in range(3):
    lo, hi = np.percentile(a[..., c], 0.5), np.percentile(a[..., c], 99.7)
    a[..., c] = (a[..., c] - lo) / max(hi - lo, 1) * 255
# gentle warm tone: a touch of red and yellow in the mids, cooler water kept
a[..., 0] *= 1.05; a[..., 1] *= 1.00; a[..., 2] *= 0.92
a = np.clip(a, 0, 255)
im = Image.fromarray(a.astype(np.uint8))
im = ImageEnhance.Contrast(im).enhance(1.06)
im = ImageEnhance.Color(im).enhance(0.92)
a = np.asarray(im).astype(np.float32)
# lift the top of the sky toward the paper so the dark wordmark reads clean
paper = np.array([0xf3, 0xeb, 0xe1], np.float32)
yy = np.arange(1200, dtype=np.float32)[:, None]
t = np.clip(1 - (yy - 120) / 380, 0, 1) ** 1.4 * 0.62
a = a * (1 - t[..., None]) + paper * t[..., None]
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(D, 'assets', 'ferry-hero.jpg'), quality=90)
print('ferry-hero.jpg written')
