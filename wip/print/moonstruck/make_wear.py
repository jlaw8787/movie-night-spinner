"""Paper finish for the bulletin: 60 lb offset stock that has been folded once down the middle,
carried home in a coat pocket and left on a kitchen table. Soft mottling, a centre crease,
a little edge toning, a softened corner and a few specks of press scum. All low detail."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
W, H, S = 1056, 816, 2
w, h = W * S, H * S
FOLD = 528


def lowfreq(n, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((n, int(n * w / h) + 1)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))


yy, xx = np.mgrid[0:h, 0:w] / S


def layer(face, seed):
    rgba = np.zeros((h, w, 4), np.float32)
    cloud = lowfreq(7, seed) * 0.6 + lowfreq(16, seed + 1) * 0.4
    # mottling: warm darker patches and cooler light patches, very soft
    dark = np.clip(cloud, 0, None) * 16
    rgba[..., :3] = [150, 128, 92]
    rgba[..., 3] = dark
    # edge toning, a little stronger along the open edges
    e = np.minimum.reduce([xx, yy, W - xx, H - yy])
    wob = lowfreq(9, seed + 3) * 6
    edge = np.clip(1 - (e + wob) / 30, 0, 1) ** 1.8 * 44
    rgba[..., 3] = np.clip(rgba[..., 3] + edge, 0, 255)
    # centre crease: a shaded valley on the inside, a worn ridge on the outside
    dx = xx - FOLD
    if face == 'inside':
        crease = np.exp(-(dx / 3.2) ** 2) * 34 + np.exp(-((dx + 7) / 9) ** 2) * 10
        rgba[..., 3] = np.clip(rgba[..., 3] + crease, 0, 255)
    im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
    over = Image.new('RGBA', (w, h), (0, 0, 0, 0)); od = ImageDraw.Draw(over)
    if face == 'outside':
        # the ridge of the fold catches wear: a pale line with a soft grey shoulder
        od.rectangle([((FOLD - 1.2) * S, 0), ((FOLD + 1.2) * S, h)], fill=(250, 246, 236, 120))
        od.rectangle([((FOLD + 1.2) * S, 0), ((FOLD + 5) * S, h)], fill=(120, 104, 80, 20))
        od.rectangle([((FOLD - 5) * S, 0), ((FOLD - 1.2) * S, h)], fill=(120, 104, 80, 12))
        # a softened bottom right corner from the coat pocket
        od.polygon([((W - 34) * S, h), (w, (H - 30) * S), (w, h)], fill=(140, 118, 84, 40))
        od.line([((W - 34) * S, h), (w, (H - 30) * S)], fill=(250, 246, 236, 130), width=2 * S)
    # press scum: a few faint specks of ink, mostly in the margins
    r = np.random.default_rng(seed + 9)
    for _ in range(26):
        x, y = r.uniform(10, W - 10), r.uniform(10, H - 10)
        rad = r.uniform(0.5, 1.3)
        od.ellipse([((x - rad) * S, (y - rad) * S), ((x + rad) * S, (y + rad) * S)], fill=(40, 36, 30, int(r.uniform(40, 110))))
    over = over.filter(ImageFilter.GaussianBlur(0.8 * S))
    im = Image.alpha_composite(im, over)
    im.save(os.path.join(D, 'assets', f'wear-{face}.png'), optimize=True)
    print('wear', face)


layer('outside', 51)
layer('inside', 61)
