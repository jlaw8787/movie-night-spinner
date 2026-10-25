"""Prepares the two TMDB stills (crop, gentle lift) and the soft edge-wear overlays. No painted art on this menu."""
import os
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')

def still(src, out, box, size, gamma=0.86, sat=1.0):
    im = Image.open(os.path.join(A, src)).convert('RGB').crop(box).resize(size, Image.LANCZOS)
    a = np.asarray(im).astype(float) / 255.0
    im = Image.fromarray((np.power(a, gamma) * 255).clip(0, 255).astype('uint8'))
    im = ImageEnhance.Contrast(im).enhance(1.04); im = ImageEnhance.Color(im).enhance(sat)
    im.save(os.path.join(A, out), quality=90)

# hero: the main room, lobster at the table (2048x1152)
still('1zQMEoRf1NOLWF5wh3VmtcIpI5y.jpg', 'still-main-room.jpg', (0, 70, 2048, 1152), (1408, 744), 0.8, 1.02)
# back: the Cape shore
still('eQxT6JoUCpGp56GB3NdD5XdrHtW.jpg', 'still-cape.jpg', (300, 60, 1920, 1080), (660, 416), 0.95)

def wear(name, seed):
    W, H = 1632, 2112
    y, x = np.mgrid[0:H, 0:W]
    dx = np.minimum(x, W - 1 - x) / W; dy = np.minimum(y, H - 1 - y) / H
    d = np.minimum(dx * 1.3, dy)
    v = np.clip(1 - d / 0.11, 0, 1) ** 2.2 * 0.30
    rng = np.random.default_rng(seed)
    m = Image.fromarray((rng.random((H // 64, W // 64)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    mot = (np.asarray(m) / 255.0 - 0.5) * 0.07
    alpha = np.clip(v + np.maximum(mot, 0), 0, 0.4)
    rgba = np.zeros((H, W, 4), 'uint8'); rgba[..., 0] = 150; rgba[..., 1] = 102; rgba[..., 2] = 84
    rgba[..., 3] = (alpha * 255).astype('uint8')
    Image.fromarray(rgba).save(os.path.join(A, name))

wear('wear-front.png', 4); wear('wear-back.png', 9)
print('ok')
