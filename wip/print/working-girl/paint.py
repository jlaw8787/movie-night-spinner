"""Prepares the two TMDB stills (crop and size) and the warm edge vignette for each face."""
import os
from PIL import Image, ImageFilter, ImageEnhance
import numpy as np
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
def crop(src, out, w, h, cx=0.5, cy=0.5, bright=1.0):
    im = Image.open(os.path.join(D, 'src', src)).convert('RGB')
    W, H = im.size; r = w / h
    cw, ch = (W, int(W / r)) if W / H < r else (int(H * r), H)
    x = int((W - cw) * cx); y = int((H - ch) * cy)
    im = im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(bright)
    im.save(os.path.join(A, out), quality=90)
crop('boardroom.jpg', 'still-private-room.jpg', 270, 150, 0.5, 0.45, 1.10)
# warm vignette: big soft mottling toward the edges, nothing in the middle
W2, H2 = 1920, 2688
for n, seed in (('sheet', 3),):
    rng = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:H2, 0:W2]
    dx = np.minimum(xx, W2 - xx) / 180.0; dy = np.minimum(yy, H2 - yy) / 180.0
    edge = np.clip(1 - np.minimum(dx, dy), 0, 1) ** 1.6
    mott = np.array(Image.fromarray((rng.random((H2 // 64, W2 // 64)) * 255).astype('uint8')).resize((W2, H2), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))) / 255.0
    a = np.clip(edge * (0.55 + 0.45 * mott) * 70 + mott * 8, 0, 90).astype('uint8')
    rgba = np.zeros((H2, W2, 4), 'uint8'); rgba[..., 0] = 120; rgba[..., 1] = 84; rgba[..., 2] = 58; rgba[..., 3] = a
    Image.fromarray(rgba, 'RGBA').save(os.path.join(A, f'wear-{n}.png'))
print('ok')
