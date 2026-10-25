"""Paints the assets for the Kessler & Lowe caterer's price folder (US Letter, folded once to 5.5 x 8.5 in).
1. skyline.jpg: the film's East Side skyline still, cropped for the cover and toned like one black ink on uncoated stock.
2. wear-outside.png / wear-inside.png: soft handling wear at 2x. Big gentle mottling, toned edges and the
   centre fold (a raised crease outside, a valley inside). No pixel noise; the shared paper grain does the fine work."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
W, H, S = 1056, 816, 2
PAPER = np.array([244, 242, 236], float)
INK = np.array([22, 22, 24], float)

# 1. cover photo
src = Image.open(os.path.join(A, 'skyline_orig.jpg')).convert('L')
crop = src.crop((205, 0, 1125, 817))                       # Empire State, Chrysler and the tall tower on the right
crop = crop.filter(ImageFilter.GaussianBlur(0.6))          # take the film grain down a touch before upscaling
g = np.asarray(crop, float) / 255
lo, hi = np.percentile(g, 1.5), np.percentile(g[:200], 70)   # deepest building shadow to the hazy sky
g = np.clip((g - lo) / (hi - lo), 0, 1)
g = g ** 0.92
sky = np.clip(np.linspace(0.10, 0, g.shape[0])[:, None], 0, 1)
g = np.clip(g + sky * (g > 0.62), 0, 1)                     # lift the top of the sky slightly, as if printed
rgb = INK + (PAPER - INK) * g[..., None] * 0.97
im = Image.fromarray(rgb.astype(np.uint8), 'RGB').resize((528 * S, 470 * S), Image.LANCZOS)
im.save(os.path.join(A, 'skyline.jpg'), quality=90)

# 2. wear layers
w, h = W * S, H * S
yy, xx = np.mgrid[0:h, 0:w] / S

def lowfreq(n, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((n, int(n * w / h) + 1)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))

def layer(face, seed):
    rgba = np.zeros((h, w, 4))
    # big, gentle mottling in the stock
    m = lowfreq(7, seed) * 0.65 + lowfreq(16, seed + 1) * 0.35
    a = np.clip(m * 3.5 + 3, 0, 8)
    rgba[..., :3] = [150, 140, 118]
    rgba[..., 3] = a
    # toned, uneven edges from a kitchen drawer
    e = np.minimum.reduce([xx, yy, W - xx, H - yy])
    wob = lowfreq(9, seed + 2) * 7
    edge = np.clip(1 - (e + wob) / 34, 0, 1) ** 1.8 * 60
    rgba[..., 3] = np.clip(rgba[..., 3] + edge, 0, 255)
    # the fold at x = 528
    d = xx - W / 2
    if face == 'outside':
        shade = np.exp(-((d + 2.2) / 1.4) ** 2) * 34 + np.exp(-((d - 3) / 6) ** 2) * 10
        light = np.exp(-((d - 0.4) / 0.9) ** 2) * 70
    else:
        shade = np.exp(-(d / 1.2) ** 2) * 30 + np.exp(-(d / 9) ** 2) * 14
        light = np.exp(-((d - 2.6) / 1.1) ** 2) * 40
    along = 0.75 + 0.25 * np.clip(lowfreq(5, seed + 3), -1, 1)
    shade, light = shade * along, light * along
    tot = rgba[..., 3] + shade + light
    col = (rgba[..., :3] * rgba[..., 3:4] + np.array([90, 86, 78]) * shade[..., None] + np.array([255, 255, 252]) * light[..., None]) / np.maximum(tot, 1)[..., None]
    rgba[..., :3] = col
    rgba[..., 3] = np.clip(tot, 0, 255)
    im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
    if face == 'inside':
        # a faint greasy thumb mark where a hand held it open by the supper list
        st = Image.new('RGBA', (w, h), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
        cx, cy = 1022, 640
        sd.ellipse([((cx - 30) * S, (cy - 42) * S), ((cx + 30) * S, (cy + 42) * S)], fill=(170, 150, 105, 20))
        im = Image.alpha_composite(im, st.filter(ImageFilter.GaussianBlur(16 * S)))
    im.save(os.path.join(A, f'wear-{face}.png'), optimize=True)

layer('outside', 11)
layer('inside', 23)
print('painted')
