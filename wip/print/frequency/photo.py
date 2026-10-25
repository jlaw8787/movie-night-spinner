"""Treats the real hero photo (replaces the painted firehouse, rule 22): the 1913 firehouse of Engine 291 and
Ladder 140, 56-07 Metropolitan Avenue, Ridgewood, Queens (Jim Henderson, Wikimedia Commons, CC0). Patches out the
department banner with neighbouring brick, crops to the upper floors and the carved ENGINE frieze (no shop signs,
cars or people), and tones it toward dusk (extra contrast because the card's paper grain sits over it at 0.75) with a navy falloff under the headline.
Output: assets/firehouse-photo.jpg at 2x (2112 x 1000 for the 1056 x 500 css box)."""
import os
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
im = Image.open(os.path.join(D, 'src', 'engine291-jeh.jpg')).convert('RGB')     # 1920 x 1921
k = 1920 / 800
def P(*v): return tuple(int(round(x * k)) for x in v)
# cover the hanging banner (thumb x 252-304, y 214-362) with brick from just left of it
bx0, by0, bx1, by1 = P(250, 212, 306, 364)
patch = im.crop((bx0 - (bx1 - bx0) - P(4)[0], by0, bx0 - P(4)[0], by1))
mask = Image.new('L', patch.size, 255).filter(ImageFilter.GaussianBlur(0))
m = Image.new('L', patch.size, 0); m.paste(255, (8, 8, patch.size[0] - 8, patch.size[1] - 8)); m = m.filter(ImageFilter.GaussianBlur(6))
im.paste(patch, (bx0, by0), m)
x0, x1 = P(100)[0], P(800)[0] - 2
ch = int((x1 - x0) / (1056 / 500))
y1 = P(0, 465)[1]; y0 = y1 - ch
im = im.crop((x0, y0, x1, y1)).resize((2112, 1000), Image.LANCZOS)
im = ImageEnhance.Contrast(im).enhance(1.22)
im = ImageEnhance.Brightness(im).enhance(0.80)
im = ImageEnhance.Color(im).enhance(1.05)
a = np.asarray(im).astype(np.float32)
navy = np.array([0x1b, 0x2a, 0x55], np.float32)
a = a * 0.80 + navy * 0.20                                   # dusk cast
xx = np.linspace(0, 1, 2112, dtype=np.float32)[None, :]
yy = np.linspace(0, 1, 1000, dtype=np.float32)[:, None]
t = np.clip(1 - (xx - 0.10) / 0.55, 0, 1) ** 1.2 * np.clip(1 - (yy - 0.30) / 0.45, 0, 1) * 0.86
t = np.maximum(t, np.clip(1 - yy / 0.22, 0, 1) * 0.45)
a = a * (1 - t[..., None]) + navy * t[..., None]
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(D, 'assets', 'firehouse-photo.jpg'), quality=90)
print('firehouse-photo.jpg written')
