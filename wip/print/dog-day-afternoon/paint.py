"""Paints the printed safety tint and the soft wear for the savings deposit ticket
(Dog Day Afternoon, Brooklyn, August 22, 1972).
Bank forms of the period were printed on pale green safety paper: a fine wavy tint
that shows any erasure, plus a faint rosette. The wear is a sheet torn off a pad,
carried around a hot bank lobby all afternoon: padding gum on the top edge, soft
yellowing at the edges, a damp thumb mark. All at 2x page pixels (528 x 816 css px).
Writes assets/paper-safety-front.png, assets/paper-safety-back.png,
assets/wear-front.png, assets/wear-back.png, assets/stamp-wear.png."""
import os, math, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
W, H = 1056, 1632
rng = np.random.default_rng(1972)

BASE = np.array([228, 236, 223], float)   # pale green safety stock
LINE = np.array([206, 222, 203], float)   # tint line, low contrast so type stays crisp


def soft_noise(w, h, scale, seed):
    r = np.random.default_rng(seed)
    sw, sh = max(2, w // scale), max(2, h // scale)
    n = Image.fromarray((r.random((sh, sw)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(scale / 2))
    a = np.asarray(n, float) / 255.0
    return (a - a.min()) / (a.max() - a.min() + 1e-9)


def safety(seed):
    y, x = np.mgrid[0:H, 0:W].astype(float)
    # two crossing families of fine waves, the classic check-paper weave
    w1 = np.sin((y + 7 * np.sin(x / 38.0)) / 4.2 * math.pi)
    w2 = np.sin((y - 9 * np.sin(x / 61.0 + 1.3)) / 5.6 * math.pi)
    t = np.clip((w1 > 0.86) * 0.65 + (w2 > 0.9) * 0.45, 0, 1)
    # faint rosette in the middle of the sheet
    cx, cy = W / 2, H * 0.52
    r = np.hypot(x - cx, y - cy)
    th = np.arctan2(y - cy, x - cx)
    ros = np.zeros_like(r)
    for k, (rad, lobes) in enumerate(((150, 18), (205, 24), (260, 30))):
        rr = rad + 14 * np.sin(lobes * th + k)
        ros = np.maximum(ros, np.clip(1 - np.abs(r - rr) / 1.6, 0, 1))
    t = np.clip(t * 0.8 + ros * 0.55, 0, 1)
    # printing never lays down perfectly even: big soft variation in tint density
    t *= 0.7 + 0.3 * soft_noise(W, H, 160, seed)
    img = BASE[None, None, :] * (1 - t[..., None]) + LINE[None, None, :] * t[..., None]
    return Image.fromarray(img.astype(np.uint8), 'RGB')


def wear(seed, thumb):
    a = np.zeros((H, W), float)
    col = np.zeros((H, W, 3), float)
    y, x = np.mgrid[0:H, 0:W].astype(float)
    # edge yellowing, soft and uneven
    d = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    edge = np.clip(1 - d / 70.0, 0, 1) ** 2 * (0.6 + 0.4 * soft_noise(W, H, 90, seed + 1))
    a += edge * 0.22
    col += np.array([150, 140, 90]) * 1.0
    # broad gentle mottling, like a sheet handled with damp hands on a hot day
    mot = soft_noise(W, H, 220, seed + 2)
    a += np.clip(mot - 0.55, 0, 1) * 0.12
    # damp thumb mark
    tx, ty, rx, ry = thumb
    th = np.clip(1 - np.hypot((x - tx) / rx, (y - ty) / ry), 0, 1) ** 1.6
    a += th * 0.10
    # padding gum along the top edge where the sheet tore off the pad
    edge_y = 9 + 3 * soft_noise(W, 1, 40, seed + 3)[0] * 2
    gum = (y < edge_y[None, :]).astype(float)
    gum = np.asarray(Image.fromarray((gum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), float) / 255
    out = np.zeros((H, W, 4), float)
    out[..., :3] = col
    out[..., 3] = np.clip(a, 0, 0.4) * 255
    gcol = np.array([168, 92, 70], float)
    out[..., :3] = out[..., :3] * (1 - gum[..., None]) + gcol * gum[..., None]
    out[..., 3] = np.maximum(out[..., 3], gum * 0.75 * 255)
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def stamp_wear():
    # paper showing through a rubber stamp: soft blotches, not pixel noise
    w, h = 480, 220
    n = soft_noise(w, h, 14, 822)
    m = np.clip((n - 0.62) * 3.0, 0, 1)
    edge = soft_noise(w, h, 60, 823)
    m = np.clip(m + np.clip(edge - 0.7, 0, 1) * 1.5, 0, 0.85)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = BASE.astype(np.uint8)
    out[..., 3] = (m * 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA').filter(ImageFilter.GaussianBlur(1.0))


safety(11).save(os.path.join(A, 'paper-safety-front.png'), optimize=True)
safety(12).save(os.path.join(A, 'paper-safety-back.png'), optimize=True)
wear(21, (860, 1460, 70, 90)).save(os.path.join(A, 'wear-front.png'), optimize=True)
wear(22, (170, 1480, 70, 90)).save(os.path.join(A, 'wear-back.png'), optimize=True)
stamp_wear().save(os.path.join(A, 'stamp-wear.png'), optimize=True)
shutil.copy(os.path.join(D, '..', 'jurassic', 'src', 'assets', 'paper-grain.png'), os.path.join(A, 'paper-grain.png'))
print('painted')
