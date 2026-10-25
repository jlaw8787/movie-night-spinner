"""Paints the assets for the El Ultimo Tren bakery bag (Money Train, 1995).
A flat kraft merchandise bag, 8.5 x 11 in, printed one colour (dark green) by flexo.
- assets/train-ink.png : the subway car front printed on the bag, solid ink with knock-outs
- assets/bag-paper-front.png / bag-paper-back.png : bag construction (thumb notch, serrated top,
  bottom flap, glued back seam) plus soft kraft mottling, edge wear and a grease spot.
Low detail on purpose: big gentle shapes, no pixel noise."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
W, H = 1632, 2112          # 2x of 816 x 1056
INK = (23, 58, 40)


def blob_field(seed, scale, blur, w=W, h=H):
    rng = np.random.default_rng(seed)
    small = rng.random((h // scale + 2, w // scale + 2)).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(np.float32) / 255
    return (a - a.min()) / (a.max() - a.min() + 1e-6)


# ------------------------------------------------------------------ subway car, one ink
def train():
    w, h = 560, 560
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    # car body, solid ink
    d.rounded_rectangle((60, 20, 500, 452), radius=46, fill=255)
    # roof line knock-out
    d.rounded_rectangle((84, 40, 476, 50), radius=5, fill=0)
    # destination sign window (text is set in HTML on top)
    d.rounded_rectangle((128, 70, 432, 134), radius=8, fill=0)
    # two front windows and the storm door window
    d.rounded_rectangle((90, 162, 216, 286), radius=12, fill=0)
    d.rounded_rectangle((344, 162, 470, 286), radius=12, fill=0)
    d.rounded_rectangle((246, 156, 314, 330), radius=10, fill=0)
    # wiper on each window
    d.line((112, 276, 180, 196), fill=255, width=7)
    d.line((366, 276, 434, 196), fill=255, width=7)
    # headlights and marker lamps
    for cx in (130, 430):
        d.ellipse((cx - 26, 334, cx + 26, 386), fill=0)
        d.ellipse((cx - 12, 348, cx + 12, 372), fill=255)
    for cx in (200, 360):
        d.ellipse((cx - 11, 349, cx + 11, 371), fill=0)
    # anticlimber ribs
    for y in (404, 422):
        d.rounded_rectangle((96, y, 464, y + 7), radius=3, fill=0)
    # coupler and truck
    d.rectangle((262, 452, 298, 482), fill=255)
    d.rounded_rectangle((210, 476, 350, 492), radius=6, fill=255)
    # running rails and ties
    d.rectangle((0, 506, w, 518), fill=255)
    for x in range(14, w, 52):
        d.rectangle((x, 524, x + 30, 540), fill=255)
    # light ink spread, then a soft uneven flexo lay-down
    m = m.filter(ImageFilter.GaussianBlur(0.9))
    lay = 0.86 + 0.14 * blob_field(5, 40, 18, w, h)
    a = (np.asarray(m).astype(np.float32) * lay).clip(0, 255)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = INK
    out[..., 3] = a.astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, 'train-ink.png'), optimize=True)


# ------------------------------------------------------------------ bag construction + wear
def yy_xx():
    return np.mgrid[0:H, 0:W].astype(np.float32)


def soft_rect(x0, y0, x1, y1, feather):
    y, x = yy_xx()
    dx = np.minimum(x - x0, x1 - x)
    dy = np.minimum(y - y0, y1 - y)
    return np.clip(np.minimum(dx, dy) / feather, 0, 1)


def spot(cx, cy, rx, ry, seed):
    y, x = yy_xx()
    wob = blob_field(seed, 40, 30) * 0.35
    dd = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2) + wob - 0.15
    core = np.clip(1 - dd, 0, 1) ** 0.7
    rim = np.exp(-((dd - 0.92) / 0.12) ** 2) * 0.25
    return np.clip(core * 0.7 + rim, 0, 1)


def base_wear(seed):
    y, x = yy_xx()
    mott = blob_field(seed, 110, 70) * 0.6 + blob_field(seed + 1, 36, 26) * 0.4
    alpha = (mott - 0.42).clip(0, 1) * 0.13                    # kraft clouds
    dedge = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    alpha += np.clip(1 - dedge / 150, 0, 1) ** 2.2 * 0.22         # handled edges
    # serrated top: a fine row of darker teeth along the cut
    teeth = (np.abs(((x / 22) % 1) - 0.5) * 2) * 14 + 3
    alpha += np.where(y < teeth, 0.28, 0)
    # soft creases where the bag was crumpled shut
    for yc, s in ((300, 0.05), (330, -0.03)):
        band = np.exp(-((y - yc - (x - W / 2) * s) / 9) ** 2)
        alpha += band * 0.06
    return alpha


def save(alpha, rgb, name):
    alpha = np.clip(alpha, 0, 0.62)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, name), optimize=True)


def front():
    y, x = yy_xx()
    alpha = base_wear(31)
    rgb = np.zeros((H, W, 3), np.float32)
    rgb[...] = (92, 58, 26)
    # thumb notch: half moon cut from the front panel; the inside of the back panel shows through
    cx, r = W / 2, 128
    dn = np.sqrt((x - cx) ** 2 + y ** 2)
    hole = np.clip((r - dn) / 1.5, 0, 1)
    shade = np.clip(1 - y / r, 0, 1) * 0.22 + 0.34
    alpha = alpha * (1 - hole) + hole * shade
    lip = np.exp(-((dn - r) / 2.2) ** 2) * (y < r) * 0.35       # cut edge catching light
    rgb = rgb * (1 - lip[..., None]) + np.array((236, 205, 160), np.float32) * lip[..., None]
    alpha = np.maximum(alpha, lip * 0.55)
    # bottom fold of the bag
    alpha += np.exp(-((H - y) / 16) ** 2) * 0.25
    # grease spot where a hot pastelito sat
    g = spot(1300, 1690, 150, 112, 41)
    alpha = alpha + g * 0.30
    rgb = rgb * (1 - g[..., None] * 0.5) + np.array((96, 58, 14), np.float32) * g[..., None] * 0.5
    save(alpha, rgb, 'bag-paper-front.png')


def back():
    y, x = yy_xx()
    alpha = base_wear(57)
    rgb = np.zeros((H, W, 3), np.float32)
    rgb[...] = (92, 58, 26)
    # glued seam: overlap strip near the right edge, darker with a thin shadow line
    sx = 1488
    strip = np.clip((x - sx) / 2, 0, 1)
    alpha += strip * 0.07
    alpha += np.exp(-((x - sx) / 3) ** 2) * 0.32
    alpha += np.exp(-((x - sx - 6) / 10) ** 2) * 0.06
    # bottom flap folded up and glued
    fy = H - 150
    alpha += np.clip((y - fy) / 2, 0, 1) * 0.07
    alpha += np.exp(-((y - fy) / 3) ** 2) * 0.32
    alpha += np.exp(-((y - fy - 7) / 12) ** 2) * 0.06
    # faint ring where a cup of coffee stood on the bag
    dr = np.sqrt((x - 330) ** 2 + (y - 1640) ** 2)
    ring = np.exp(-((dr - 96) / 5) ** 2) * (0.6 + 0.4 * blob_field(77, 20, 8))
    alpha += ring * 0.13
    save(alpha, rgb, 'bag-paper-back.png')


os.makedirs(A, exist_ok=True)
train()
front()
back()
print('painted')
