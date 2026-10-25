"""Paints the soft wear overlays for the Mandel's take-out menu (goldenrod offset stock, 1977).
Big gentle mottling, sun-faded edges, handling grime at the corners, and on the back a faint
grease spot where it sat under a sandwich. Low detail on purpose: no pixel noise."""
import os
import numpy as np
from PIL import Image, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
W, H = 1632, 2112   # 2x of 816 x 1056


def blob_field(seed, scale, blur):
    rng = np.random.default_rng(seed)
    small = rng.random((H // scale + 2, W // scale + 2)).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(np.float32) / 255
    return (a - a.min()) / (a.max() - a.min() + 1e-6)


def edge_field(width):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    return np.clip(1 - d / width, 0, 1) ** 2.2


def corner(cx, cy, r):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.sqrt((x - cx) ** 2 + (y - cy) ** 2)
    return np.clip(1 - d / r, 0, 1) ** 2


def spot(cx, cy, rx, ry, seed):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    wob = blob_field(seed, 40, 30) * 0.35
    d = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2) + wob - 0.15
    core = np.clip(1 - d, 0, 1) ** 0.8
    rim = np.exp(-((d - 0.92) / 0.06) ** 2) * 0.6
    return np.clip(core * 0.55 + rim, 0, 1)


def paint(name, seed, grease=None):
    mott = blob_field(seed, 90, 60) * 0.6 + blob_field(seed + 1, 30, 22) * 0.4
    alpha = (mott - 0.45).clip(0, 1) * 0.10            # gentle darker clouds
    alpha += edge_field(150) * 0.20                      # sun-faded, handled edges
    alpha += corner(W, H, 520) * 0.10 + corner(0, H, 380) * 0.07 + corner(W, 0, 300) * 0.05
    rgb = np.zeros((H, W, 3), np.float32)
    rgb[...] = (122, 78, 24)                              # warm brown, reads as age on goldenrod
    if grease:
        g = spot(*grease, seed + 7)
        # grease turns goldenrod stock darker and more saturated, not grey
        alpha = alpha + g * 0.16
        rgb = rgb * (1 - g[..., None] * 0.4) + np.array((150, 96, 10), np.float32) * g[..., None] * 0.4
    alpha = np.clip(alpha, 0, 0.36)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(D, 'assets', f'wear-{name}.png'), optimize=True)


paint('front', 11)
paint('back', 23, grease=(1330, 1700, 150, 120))
print('painted')
