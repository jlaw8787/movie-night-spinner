"""Soft wear layers for the two memo sheets: bond paper gone faintly ivory, uneven edge toning,
a little rust bleeding from the staple, and a grey thumb smudge where the mail cart handled page 1.
Big, low-detail shapes only. The fine grain comes from the shared paper-grain.png."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
W, H, S = 816, 1056, 1
w, h = W * S, H * S

def lowfreq(cells, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((cells, int(cells * w / h) + 1)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))

yy, xx = np.mgrid[0:h, 0:w] / S

def layer(face, seed):
    rgba = np.zeros((h, w, 4), np.float32)
    tone = np.array([176, 146, 92], np.float32)
    rgba[..., :3] = tone
    mott = lowfreq(6, seed) * 0.6 + lowfreq(3, seed + 1) * 0.4
    a = np.clip(10 + mott * 7, 0, 22)
    e = np.minimum.reduce([xx, yy, W - xx, H - yy])
    wob = lowfreq(8, seed + 2) * 10
    edge = np.clip(1 - (e + wob) / 60, 0, 1) ** 1.8 * 62
    rgba[..., 3] = np.clip(a + edge, 0, 255)
    im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
    st = Image.new('RGBA', (w, h), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    # rust halo around the staple (staple sits at 30,34 to 62,22 on both sheets)
    sd.ellipse([(24 * S, 16 * S), (70 * S, 42 * S)], fill=(150, 92, 40, 30))
    if face == 'front':
        # grey thumb smudge on the right edge, low, where the sheet came off the mail cart
        sd.ellipse([(770 * S, 820 * S), (840 * S, 930 * S)], fill=(90, 86, 80, 22))
    else:
        # a pale tide line from a damp desk, lower left, mostly in the margin
        sd.ellipse([(-60 * S, 930 * S), (120 * S, 1110 * S)], fill=(170, 140, 90, 16))
    st = st.filter(ImageFilter.GaussianBlur(16 * S))
    Image.alpha_composite(im, st).save(os.path.join(D, 'assets', f'wear-{face}.png'), optimize=True)

layer('front', 11); layer('back', 23)
print('wear done')
