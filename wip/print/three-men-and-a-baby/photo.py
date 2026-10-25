"""Treats the real hero photo (replaces the painted loft building, rule 22): HABS NY-5459 photo 1, the cast-iron
E. V. Haughwout Building at Broadway and Broome, SoHo, by Cervin Robinson (Library of Congress, no known
restrictions). Crops to the upper arcaded floors (no shop signs), tones it as a moonlit night-blue duotone, and
darkens the left side under the wordmark. Output: assets/loft-photo.jpg at 2x (1632 x 644 for 816 x 322 css)."""
import os
import numpy as np
from PIL import Image, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
im = Image.open(os.path.join(D, 'src', 'haughwout-habs-119885.jpg')).convert('L')   # 3947 x 5000
x0, x1, y0 = 87, 3760, 749
y1 = y0 + int((x1 - x0) / (1632 / 644))
im = im.crop((x0, y0, x1, y1)).resize((1632, 644), Image.LANCZOS)
im = ImageOps.autocontrast(im, cutoff=(0.5, 0.3))
g = np.asarray(im).astype(np.float32) / 255.0
g = g ** 1.25                                            # sink the mids toward night
dark = np.array([0x12, 0x1a, 0x3a], np.float32)          # NIGHT
light = np.array([0xb6, 0xc6, 0xe6], np.float32)         # moonlit cast iron
a = dark + (light - dark) * g[..., None]
# soft night falloff on the left under the wordmark and door sign, and a little at the top
xx = np.linspace(0, 1, 1632, dtype=np.float32)[None, :]
yy = np.linspace(0, 1, 644, dtype=np.float32)[:, None]
t = np.clip(1 - (xx - 0.06) / 0.42, 0, 1) ** 1.3 * 0.82
t = np.maximum(t, np.clip(1 - yy / 0.18, 0, 1) * 0.35)
a = a * (1 - t[..., None]) + dark * t[..., None]
Image.fromarray(np.clip(a, 0, 255).astype(np.uint8)).save(os.path.join(D, 'assets', 'loft-photo.jpg'), quality=90)
print('loft-photo.jpg written')
