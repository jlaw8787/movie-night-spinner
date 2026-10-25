"""Signature piece: a black and white line engraving of the Queensboro Bridge at dawn with the bench,
the couple and the little dog, cut from the TMDB still as a modulated line screen with cross-hatching
in the shadows. Output: assets/engraving-bridge.png (RGBA ink on transparent, 2x for the cover panel)."""
import os
from PIL import Image, ImageOps, ImageFilter
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
OW, OH = 562, 540          # cover panel art size at 1x
S = 2                      # render scale
INK = (22, 22, 24)

src = ImageOps.grayscale(Image.open(os.path.join(A, 'src-bridge.jpg')))
# square-ish crop around the bench, the couple, the arch and the tree
box = (700, 0, 700 + int(1427 * OW / OH), 1427)
im = src.crop(box).resize((OW * S, OH * S), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.8))
a = np.asarray(im).astype(float) / 255.0
lo, hi = np.percentile(a, 2), np.percentile(a, 97)
a = np.clip((a - lo) / (hi - lo), 0, 1) ** 0.78          # levels: fog goes light, silhouettes stay solid
dark = 1.0 - a

h, w = dark.shape
y, x = np.mgrid[0:h, 0:w].astype(float)
SP = 7.0                                                   # line pitch at 2x
# gentle swell in the lines, like a burin following the plate
yy = y + 1.3 * np.sin(x / 61.0) + 0.8 * np.sin(x / 23.0 + y / 90.0)
dy = np.abs((yy % SP) - SP / 2)
half = dark * SP * 0.47 + 0.2
cov = np.clip(half - dy + 0.5, 0, 1)
cov[dark < 0.06] = 0                                       # clean highlights in the dawn sky
# cross-hatch on the diagonal where it is darkest
dd = (x + y) / np.sqrt(2)
dy2 = np.abs((dd % SP) - SP / 2)
half2 = np.clip(dark - 0.62, 0, 1) * SP * 0.9
cov = np.maximum(cov, np.clip(half2 - dy2 + 0.5, 0, 1) * (half2 > 0.3))
# second hatch for the deepest blacks
dd3 = (x - y) / np.sqrt(2)
dy3 = np.abs((dd3 % SP) - SP / 2)
half3 = np.clip(dark - 0.78, 0, 1) * SP * 1.6
cov = np.maximum(cov, np.clip(half3 - dy3 + 0.5, 0, 1) * (half3 > 0.3))
# soften the bottom edge into a ruled plate line
out = np.zeros((h, w, 4), 'uint8')
out[..., 0], out[..., 1], out[..., 2] = INK
out[..., 3] = (cov * 238).astype('uint8')
Image.fromarray(out, 'RGBA').save(os.path.join(A, 'engraving-bridge.png'))
print('engraved', w, h)
