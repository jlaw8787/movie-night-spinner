"""Prepares the two TMDB stills (clean greyscale, lifted for print) and a soft edge wear for each face."""
import os
from PIL import Image, ImageOps, ImageFilter, ImageEnhance
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')

def still(src, out, w, h, gamma=1.0, contrast=1.0):
    im = ImageOps.grayscale(Image.open(os.path.join(A, src)))
    im = ImageOps.fit(im, (w * 2, h * 2), Image.LANCZOS, centering=(0.5, 0.5))
    a = np.asarray(im).astype(float) / 255.0
    a = a ** (1.0 / gamma)
    im = Image.fromarray((a * 255).clip(0, 255).astype('uint8'))
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im.convert('RGB').save(os.path.join(A, out), quality=92)

still('src-bridge.jpg', 'still-bridge.jpg', 704, 350, 1.0, 1.06)
still('src-table.jpg', 'still-table.jpg', 300, 169, 1.55, 1.08)

def wear(name, seed):
    W, H = 816, 1056
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W]
    d = np.minimum(np.minimum(x, W - 1 - x), np.minimum(y, H - 1 - y)).astype(float)
    edge = np.clip(1 - d / 70.0, 0, 1) ** 2.2
    blot = Image.fromarray((rng.random((H // 48, W // 48)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    m = np.asarray(blot).astype(float) / 255.0
    alpha = (edge * 0.30 + m * 0.035) * 255
    rgba = np.zeros((H, W, 4), 'uint8')
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = 92, 88, 84
    rgba[..., 3] = alpha.clip(0, 255).astype('uint8')
    Image.fromarray(rgba, 'RGBA').save(os.path.join(A, f'wear-{name}.png'))

wear('front', 7); wear('back', 79)
print('prepped')
