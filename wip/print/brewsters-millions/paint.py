"""Soft wear layers for the hotel in-suite dining card (US letter, heavy two sided card).
Gloss black board with a rose panel that has sat on a room service tray: faint warm mottling,
the black rubbed grey at the corners and edges where the board core shows through,
and a pale champagne ring on the back by the bar list. Big, low-detail shapes only.
The fine grain comes from the shared paper-grain.png."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056

def lowfreq(cells, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((cells, int(cells * W / H) + 1)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((W, H), Image.BICUBIC))

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)

def wear(face, seed):
    # warm toning over the whole card
    rgba = np.zeros((H, W, 4), np.float32)
    rgba[..., :3] = np.array([168, 140, 88], np.float32)
    mott = lowfreq(5, seed) * 0.6 + lowfreq(3, seed + 1) * 0.4
    rgba[..., 3] = np.clip(8 + mott * 6, 0, 18)
    tone = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
    # pale rubbing on the green border, strongest at the corners
    rub = np.zeros((H, W, 4), np.float32)
    rub[..., :3] = np.array([150, 136, 130], np.float32)
    e = np.minimum.reduce([xx, yy, W - xx, H - yy])
    wob = lowfreq(9, seed + 2) * 6
    edge = np.clip(1 - (e + wob * 0.5) / 7, 0, 1) ** 1.6 * 46
    cx = np.minimum(xx, W - xx); cy = np.minimum(yy, H - yy)
    corner = np.clip(1 - np.sqrt(cx ** 2 + cy ** 2) / 42, 0, 1) ** 1.8 * 60
    rub[..., 3] = np.clip(edge * 0.8 + corner, 0, 64)
    rub = Image.fromarray(rub.astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(1))
    out = Image.alpha_composite(tone, rub)
    # a soft thumb mark, lower right on the front where the card gets picked up
    st = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    if face == 'front':
        sd.ellipse([(724, 930), (812, 1040)], fill=(120, 100, 70, 22))
    else:
        sd.ellipse([(-40, 40), (90, 170)], fill=(120, 100, 70, 18))
    st = st.filter(ImageFilter.GaussianBlur(18))
    Image.alpha_composite(out, st).save(os.path.join(D, 'assets', f'wear-{face}.png'), optimize=True)

def ring():
    """A pale ring left by the foot of a champagne flute. Thin, uneven, broken in one place."""
    S = 240; c = S / 2
    y, x = np.mgrid[0:S, 0:S].astype(np.float32)
    r = np.sqrt((x - c) ** 2 + (y - c) ** 2)
    ang = np.arctan2(y - c, x - c)
    rad = 92 + np.sin(ang * 3 + 0.7) * 1.6
    band = np.exp(-((r - rad) / 2.2) ** 2)
    inner = np.clip(1 - r / rad, 0, 1) * 0.10
    strength = 0.55 + 0.45 * np.cos(ang - 2.2)          # heavier on one side, fades on the other
    a = (band * strength + inner) * 70
    im = np.zeros((S, S, 4), np.float32); im[..., :3] = np.array([176, 140, 70], np.float32); im[..., 3] = np.clip(a, 0, 255)
    Image.fromarray(im.astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(1.2)).save(os.path.join(D, 'assets', 'stain-ring.png'), optimize=True)

os.makedirs(os.path.join(D, 'assets'), exist_ok=True)
wear('front', 31); wear('back', 47); ring()
print('wear done')
