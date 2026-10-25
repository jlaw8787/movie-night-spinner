"""Paints the print assets for the Duke & Duke Market Letter (Trading Places, 1983).
A one-sheet offset newsletter in two inks, black and an orange spot, on white offset stock.
US Letter portrait, 816 x 1056 CSS px, painted at 2x.
  still-halftone.png : TMDB breakfast still as a coarse black and orange duotone screen
  tint-screen.png    : a 20% orange dot tint for the bar box
  wear-front/back    : soft mottling, handled edges, binder punch holes, two mailing creases
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageOps, ImageFilter
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 2
W, H = 816, 1056
GW, GH = W * S, H * S
BLACK = (28, 25, 23)
ORANGE = (226, 112, 36)


def noise(h, w, octaves, base, seed):
    r = np.random.default_rng(seed); out = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        g = r.standard_normal((n + 1, int(n * w / h) + 1)).astype(np.float32)
        out += amp * np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC)); tot += amp; amp *= 0.5
    return out / tot


def screen(gray, cell, angle, gain=1.0, up=4):
    """Classic AM halftone: rotate, sample each cell, draw a round dot sized to the tone,
    rotate back. gray is 0..1 ink coverage. Drawn at `up` times then reduced for clean edges."""
    h, w = gray.shape
    big = Image.fromarray((gray * 255).astype(np.uint8)).resize((w * up, h * up), Image.BICUBIC)
    rot = big.rotate(angle, resample=Image.BICUBIC, expand=True, fillcolor=0)
    rw, rh = rot.size
    c = cell * up
    small = np.asarray(rot.resize((max(1, rw // c), max(1, rh // c)), Image.BOX)) / 255.0
    out = Image.new('L', (rw, rh), 0); dr = ImageDraw.Draw(out)
    for j in range(small.shape[0]):
        for i in range(small.shape[1]):
            v = min(1.0, small[j, i] * gain)
            if v < 0.03:
                continue
            rad = c * 0.5 * np.sqrt(v) * 1.18
            cx, cy = i * c + c / 2, j * c + c / 2
            dr.ellipse((cx - rad, cy - rad, cx + rad, cy + rad), fill=255)
    back = out.rotate(-angle, resample=Image.BICUBIC, expand=False)
    l, t = (rw - w * up) // 2, (rh - h * up) // 2
    back = back.crop((l, t, l + w * up, t + h * up)).resize((w, h), Image.LANCZOS)
    return np.asarray(back) / 255.0


def halftone_still():
    # crop to the three men and the breakfast table, 400 x 288 CSS px at 2x
    im = Image.open(os.path.join(A, 'still-dukes.jpg')).convert('RGB')
    bw, bh = 400 * S, 288 * S
    box = (440, 22, 1880, 22 + int(1440 * bh / bw))
    im = im.crop(box).resize((bw, bh), Image.LANCZOS)
    g = np.asarray(ImageOps.grayscale(im)).astype(float) / 255
    g = ndimage.gaussian_filter(g, 0.6)
    # lift the shadows the way a newsletter printer's camera would, then dot gain
    lo, hi = np.percentile(g, 1), np.percentile(g, 99.5)
    lum = np.clip((g - lo) / (hi - lo), 0, 1) ** 0.62
    lum = np.clip(0.5 + (lum - 0.5) * 1.35, 0, 1)
    k = np.clip((1 - lum) * 0.96 - 0.02, 0, 1) ** 1.05
    rgb = np.asarray(im).astype(float) / 255
    warm = np.clip((rgb[..., 0] - rgb[..., 2]) * 1.6 + 0.10, 0, 1) * np.clip(lum * 1.4, 0, 1)
    o = np.clip(0.06 + warm * 0.45, 0, 0.5)
    kd = screen(k, 3, 45)
    od = screen(o, 3, 75)
    od = np.roll(od, (2, 3), axis=(0, 1))                  # the orange plate sits a hair off
    paper = np.array([246, 244, 238], float)
    out = paper * np.ones((bh, bw, 3))
    out = out * (1 - od[..., None] * 0.92) + np.array(ORANGE) * od[..., None] * 0.92
    out = out * (1 - kd[..., None] * 0.94) + np.array(BLACK) * kd[..., None] * 0.94
    # starved ink at the edges of the plate, very soft
    starve = np.clip(0.5 + noise(bh, bw, 3, 3, 4) * 0.8, 0, 1)
    out = out + (paper - out) * (starve[..., None] * 0.10)
    Image.fromarray(out.clip(0, 255).astype(np.uint8)).save(os.path.join(A, 'still-halftone.png'))


def tint_screen():
    # 16% orange tint as a visible dot screen, 300 x 340 CSS px region is plenty; tiled in CSS
    w = h = 120 * S
    v = np.full((h, w), 0.16)
    d = screen(v, 3, 15)
    rgba = np.zeros((h, w, 4)); rgba[..., :3] = ORANGE; rgba[..., 3] = d * 235
    Image.fromarray(rgba.astype(np.uint8), 'RGBA').save(os.path.join(A, 'tint-screen.png'))


def wear(seed, name, holes_left):
    mott = noise(GH, GW, 3, 3, seed)
    a = np.clip(0.5 + mott * 1.1, 0, 1) * 14
    yy, xx = np.mgrid[0:GH, 0:GW] / S
    d = np.minimum.reduce([xx, yy, W - xx, H - yy])
    rough = np.clip(noise(GH, GW, 3, 5, seed + 7) + 0.6, 0.2, 1.2)
    edge = np.clip(1 - d / 22, 0, 1) ** 2 * rough
    a = a + edge * 60
    # two mailing creases (letter folded in thirds for the envelope): a soft shadow and a light ridge
    for fy in (352, 704):
        dy = yy - fy
        a = a + np.exp(-(dy / 2.2) ** 2) * 26 * (0.7 + 0.3 * rough)
    a = ndimage.gaussian_filter(a, 1.6 * S)
    rgb = np.zeros((GH, GW, 3)); rgb[:] = (110, 98, 80)
    img = Image.fromarray(np.dstack([rgb, a]).clip(0, 255).astype(np.uint8), 'RGBA')
    # ridge highlight just under each crease
    hl = Image.new('RGBA', (GW, GH), (0, 0, 0, 0)); hd = ImageDraw.Draw(hl)
    for fy in (352, 704):
        hd.rectangle((0, (fy + 2) * S, GW, (fy + 3) * S), fill=(255, 255, 250, 60))
    hl = hl.filter(ImageFilter.GaussianBlur(1.2 * S))
    img = Image.alpha_composite(img, hl)
    # binder punch holes, 1/4 in across, 3/8 in in from the spine edge, 4 1/4 in apart
    dr = ImageDraw.Draw(img)
    cx = 36 if holes_left else W - 36
    for cy in (H / 2 - 408, H / 2, H / 2 + 408):
        r = 12
        # the desk shows through: mid grey, with the hole's own shadow along the top edge
        dr.ellipse(((cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S), fill=(92, 88, 82, 255))
        dr.ellipse(((cx - r + 1) * S, (cy - r + 3) * S, (cx + r - 1) * S, (cy + r) * S), fill=(122, 117, 110, 255))
        dr.arc(((cx - r - 1) * S, (cy - r - 1) * S, (cx + r + 1) * S, (cy + r + 1) * S), 200, 340, fill=(150, 140, 125, 120), width=S)
    img.save(os.path.join(A, name))


wear(11, 'wear-front.png', True)
wear(23, 'wear-back.png', False)
print('painted')
