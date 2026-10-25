"""Paints the menu art as a two-ink offset print (navy and wine red on cream stock):
the big moon over the bridge and the river, plus a small moon mark for the back.
Coordinates are CSS px of the 704x300 art window; drawn at 4x."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
S = 4
W, H = 704, 300
w, h = W * S, H * S
rng = np.random.default_rng(1987)

PAPER = np.array([244, 236, 217])
NAVY = np.array([28, 38, 66])
DEEP = np.array([17, 23, 42])
RED = np.array([142, 42, 40])

yy, xx = np.mgrid[0:h, 0:w] / S
HORIZON = 214

# ---- sky: navy ink, a touch lighter low on the horizon and around the moon ----
t = np.clip(yy / HORIZON, 0, 1)[..., None]
sky = DEEP * (1 - t) + np.array([40, 54, 88]) * t
MX, MY, MR = 560, 90, 60
d = np.sqrt((xx - MX) ** 2 + (yy - MY) ** 2)
glow = np.clip(1 - (d - MR) / 120, 0, 1) ** 2.2
sky = sky * (1 - glow[..., None] * 0.55) + np.array([120, 128, 140]) * glow[..., None] * 0.55
img = sky.copy()

# ---- moon: paper showing through, faint navy tint maria ----
moon = np.clip((MR - d) * S / 2.0 + 0.5, 0, 1)
mcol = np.tile(PAPER.astype(float), (h, w, 1))
def lowfreq(n, seed):
    r = np.random.default_rng(seed); g = r.standard_normal((n, n)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))
mar = lowfreq(18, 5) * 0.7 + lowfreq(40, 6) * 0.3
mar = np.clip((mar - 0.45) * 1.4, 0, 1) * 0.11
mcol = mcol * (1 - mar[..., None]) + NAVY * mar[..., None]
limb = np.clip((d / MR) ** 6, 0, 1) * 0.06
mcol = mcol * (1 - limb[..., None]) + np.array([200, 190, 170]) * limb[..., None]
img = img * (1 - moon[..., None]) + mcol * moon[..., None]

# ---- river ----
wt = np.clip((yy - HORIZON) / (H - HORIZON), 0, 1)[..., None]
water = np.array([30, 42, 72]) * (1 - wt) + DEEP * wt
wmask = (yy >= HORIZON)[..., None]
img = np.where(wmask, water, img)

im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
dr = ImageDraw.Draw(im)

def P(x, y):
    return (x * S, y * S)

def col(c, a=255):
    return tuple(int(v) for v in c) + (a,)

# far bridge, low and faint on the left, with its string of lights
far = Image.new('RGBA', (w, h), (0, 0, 0, 0)); fd = ImageDraw.Draw(far)
fd.rectangle([P(0, 196), P(300, 200)], fill=col(np.array([46, 58, 92])))
for tx in (118, 262):
    fd.rectangle([P(tx - 6, 168), P(tx + 6, 200)], fill=col(np.array([46, 58, 92])))
for x in np.arange(0, 300, 6):
    if x <= 118: s_ = x / 118; y = 170 + 24 * (1 - (2 * s_ - 1) ** 2)
    elif x <= 262: s_ = (x - 118) / 144; y = 170 + 24 * (1 - (2 * s_ - 1) ** 2)
    else: s_ = (x - 262) / 76; y = 170 + 26 * s_ ** 1.5
    fd.ellipse([P(x - 0.8, y - 0.8), P(x + 0.8, y + 0.8)], fill=(236, 226, 196, 170))
im = Image.alpha_composite(im.convert('RGBA'), far)

# skyline across the river, right of the bridge tower
sky_l = Image.new('RGBA', (w, h), (0, 0, 0, 0)); sd = ImageDraw.Draw(sky_l)
x = 300
blds = []
while x < W:
    bw = rng.integers(12, 30)
    bh = rng.integers(14, 46) if x < 430 else rng.integers(26, 92)
    if 470 < x < 520: bh = rng.integers(60, 84)
    blds.append((x, bw, bh)); x += bw + rng.integers(0, 3)
red_b = None
for (bx, bw, bh) in blds:
    top = HORIZON - bh
    shade = col(np.array([20, 27, 48]) + rng.integers(-3, 4))
    sd.rectangle([P(bx, top), P(bx + bw, HORIZON)], fill=shade)
    if bh > 50 and bw > 16 and rng.random() < 0.6:
        inset = bw * 0.22
        sd.rectangle([P(bx + inset, top - bh * 0.14), P(bx + bw - inset, top)], fill=shade)
        if rng.random() < 0.5:
            sd.rectangle([P(bx + bw / 2 - 0.8, top - bh * 0.14 - 9), P(bx + bw / 2 + 0.8, top - bh * 0.14)], fill=shade)
    if 600 < bx < 640 and red_b is None and bh > 50:
        red_b = (bx, bw, top)
    for wy in np.arange(top + 5, HORIZON - 3, 5):
        for wx in np.arange(bx + 3, bx + bw - 2, 4):
            if rng.random() < (0.10 if (wy // 9) % 3 == 0 else 0.26):
                sd.rectangle([P(wx, wy), P(wx + 1.3, wy + 1.6)], fill=(238, 222, 176, 215))
if red_b:
    bx, bw, top = red_b
    sd.rectangle([P(bx + 2, top - 9), P(bx + bw - 2, top - 2)], fill=col(RED))
im = Image.alpha_composite(im, sky_l)

# reflections: broken horizontal strokes in the water
ref = Image.new('RGBA', (w, h), (0, 0, 0, 0)); rd = ImageDraw.Draw(ref)
for i in range(70):
    y = HORIZON + 4 + (i ** 1.25) * 0.9
    if y > H - 2: break
    spread = 10 + (y - HORIZON) * 0.55
    for _ in range(2):
        cx = MX + rng.normal(0, spread * 0.45)
        ln = rng.uniform(5, 18) * (1 + (y - HORIZON) / 60)
        a = int(max(0, 200 - (y - HORIZON) * 1.6))
        rd.rectangle([P(cx - ln / 2, y), P(cx + ln / 2, y + 0.9)], fill=(240, 232, 210, a))
if red_b:
    rx0 = red_b[0] + red_b[1] / 2
    for i in range(26):
        y = HORIZON + 5 + i * 3.2
        ln = rng.uniform(3, 9)
        cx = rx0 + rng.normal(0, 3)
        rd.rectangle([P(cx - ln / 2, y), P(cx + ln / 2, y + 1.0)], fill=col(RED, 170 - i * 5))
im = Image.alpha_composite(im, ref)

# ---- the bridge: deck sloping away, a stone tower with twin arches, cables strung with lights ----
br = Image.new('RGBA', (w, h), (0, 0, 0, 0)); bd = ImageDraw.Draw(br)
INK = col(np.array([12, 16, 30]))
def deck_y(x): return 116 + (x / 470) * 88
def deck_t(x): return 16 - (x / 470) * 10
# deck
poly = [P(-2, deck_y(-2) - deck_t(-2) / 2)]
for x in range(0, 476, 4): poly.append(P(x, deck_y(x) - deck_t(x) / 2))
for x in range(474, -4, -4): poly.append(P(x, deck_y(x) + deck_t(x) / 2))
bd.polygon(poly, fill=INK)
# tower
TX, TW, TT = 386, 30, 124
bd.rectangle([P(TX - TW / 2, TT), P(TX + TW / 2, HORIZON + 2)], fill=INK)
bd.rectangle([P(TX - TW / 2 - 3, TT - 5), P(TX + TW / 2 + 3, TT + 2)], fill=INK)
for ax in (TX - 7, TX + 7):
    bd.rectangle([P(ax - 3.5, TT + 18), P(ax + 3.5, TT + 52)], fill=col(np.array([44, 58, 92])))
    bd.ellipse([P(ax - 3.5, TT + 14.5), P(ax + 3.5, TT + 21.5)], fill=col(np.array([44, 58, 92])))
# main cable from the near tower (off the page, upper left) down and up to the far tower
def cable_y(x):
    s = (x + 140) / (TX + 140)
    top_near, top_far = -40, TT - 2
    line = top_near + (top_far - top_near) * s
    return line + 86 * 4 * s * (1 - s) * (1 - 0.35 * s)
pts = [P(x, cable_y(x)) for x in np.arange(-4, TX + 1, 2)]
bd.line(pts, fill=INK, width=int(2.6 * S))
# suspenders
for x in np.arange(6, TX - 10, 9):
    bd.line([P(x, cable_y(x)), P(x, deck_y(x))], fill=col(np.array([12, 16, 30]), 190), width=int(0.7 * S))
# stays from the tower top fanning down to the deck
for k in range(1, 7):
    x = TX - k * 30
    bd.line([P(TX, TT + 4), P(x, deck_y(x))], fill=col(np.array([12, 16, 30]), 150), width=int(0.6 * S))
# beyond the tower toward the shore
pts2 = [P(TX + i, TT - 2 + (i / 90) ** 1.6 * 70) for i in range(0, 92, 2)]
bd.line(pts2, fill=INK, width=int(2.2 * S))
im = Image.alpha_composite(im, br)

lights = Image.new('RGBA', (w, h), (0, 0, 0, 0)); ld = ImageDraw.Draw(lights)
for x in np.arange(4, TX - 2, 9.5):
    y = cable_y(x); r = 1.15 - x / TX * 0.45
    ld.ellipse([P(x - r * 2.4, y - r * 2.4), P(x + r * 2.4, y + r * 2.4)], fill=(240, 230, 200, 40))
    ld.ellipse([P(x - r, y - r), P(x + r, y + r)], fill=(250, 244, 226, 255))
for i in range(0, 90, 10):
    x = TX + i; y = TT - 2 + (i / 90) ** 1.6 * 70
    ld.ellipse([P(x - 1, y - 1), P(x + 1, y + 1)], fill=(250, 244, 226, 255))
for x in np.arange(10, 470, 14):
    y = deck_y(x) + deck_t(x) / 2 - 1.5
    ld.ellipse([P(x - 0.8, y - 0.8), P(x + 0.8, y + 0.8)], fill=(238, 214, 150, 230))
lights = Image.alpha_composite(lights.filter(ImageFilter.GaussianBlur(S * 0.6)), lights)
im = Image.alpha_composite(im, lights)

# halftone-ish ink texture: tiny noise so the flat ink reads as press-printed
a = np.asarray(im).astype(float)
n = rng.normal(0, 3.2, (h, w, 1))
a[..., :3] = np.clip(a[..., :3] + n, 0, 255)
im = Image.fromarray(a.astype(np.uint8))
im.convert('RGB').save(os.path.join(D, 'assets', 'moon-bridge.jpg'), quality=92)

# ---- small moon mark for the back, on paper ----
ms = 96 * S
mk = Image.new('RGBA', (ms, ms), (0, 0, 0, 0)); md = ImageDraw.Draw(mk)
md.ellipse([0, 0, ms - 1, ms - 1], fill=col(NAVY))
r = ms * 0.40; c = ms / 2
md.ellipse([c - r, c - r, c + r, c + r], fill=col(PAPER))
for (dx, dy, rr) in [(-0.10, -0.08, 0.10), (0.09, -0.12, 0.07), (-0.02, 0.10, 0.12), (0.12, 0.07, 0.05)]:
    md.ellipse([c + dx * ms - rr * ms / 2, c + dy * ms - rr * ms / 2 * 0.8, c + dx * ms + rr * ms / 2, c + dy * ms + rr * ms / 2 * 0.8],
               fill=(226, 218, 202, 255))
mk.save(os.path.join(D, 'assets', 'moon-mark.png'))
print('art painted')
