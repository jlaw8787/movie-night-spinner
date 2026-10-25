"""Prepares the back-table TMDB still (clean greyscale, lifted for print) and a soft edge wear for each
landscape face of the folded card (1123x794), with a gentle fold shadow down the middle."""
import os
from PIL import Image, ImageOps, ImageFilter, ImageEnhance
import numpy as np
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
W, H = 1123, 794

def still(src, out, w, h, gamma=1.0, contrast=1.0):
    im = ImageOps.grayscale(Image.open(os.path.join(A, src)))
    im = ImageOps.fit(im, (w * 2, h * 2), Image.LANCZOS, centering=(0.5, 0.45))
    a = (np.asarray(im).astype(float) / 255.0) ** (1.0 / gamma)
    im = ImageEnhance.Contrast(Image.fromarray((a * 255).clip(0, 255).astype('uint8'))).enhance(contrast)
    im.convert('RGB').save(os.path.join(A, out), quality=92)

still('src-table.jpg', 'still-table.jpg', 465, 248, 1.55, 1.08)

def wear(name, seed):
    rng = np.random.default_rng(seed)
    y, x = np.mgrid[0:H, 0:W]
    d = np.minimum(np.minimum(x, W - 1 - x), np.minimum(y, H - 1 - y)).astype(float)
    edge = np.clip(1 - d / 64.0, 0, 1) ** 2.2
    fold = np.exp(-((x - W / 2) / 7.0) ** 2) * 0.10
    blot = Image.fromarray((rng.random((H // 48 + 1, W // 48 + 1)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    m = np.asarray(blot).astype(float) / 255.0
    alpha = (edge * 0.30 + m * 0.035 + fold) * 255
    rgba = np.zeros((H, W, 4), 'uint8')
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = 92, 88, 84
    rgba[..., 3] = alpha.clip(0, 255).astype('uint8')
    Image.fromarray(rgba, 'RGBA').save(os.path.join(A, f'wear-{name}.png'))

wear('outside', 7); wear('inside', 79)
print('prepped')
