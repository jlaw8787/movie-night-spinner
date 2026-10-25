"""Engraved view of the Manhattan skyline from a Pemrose tower window, tall slim card (408x1056 at 2x = 816x2112).
Line engraving in charcoal on transparent ground (paper shows through), burgundy window frame with a lettered transom.
Drawn at 4x with slight hand wobble, then downsampled."""
import os, random
from PIL import Image, ImageDraw

D = os.path.dirname(os.path.abspath(__file__))
S = 4
W, H = 408 * S, 1056 * S
INK = (37, 39, 44, 255)
FAR = (120, 122, 128, 255)
MID = (72, 74, 80, 255)
RED = (139, 29, 44, 255)
PAPER = (231, 228, 221, 255)
random.seed(1987)
im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(im)
u = S
F, TRANSOM, SILL = 24, 344, 1032


def line(x0, y0, x1, y1, w=1.0, c=INK, wob=0.25):
    j = lambda: random.uniform(-wob, wob) * u
    d.line((x0 * u + j(), y0 * u + j(), x1 * u + j(), y1 * u + j()), fill=c, width=max(1, round(w * u)))


# ---- sky: engraved horizontal lines, heavier near the top of the glass, opening to light at the horizon
y = TRANSOM + 6
while y < 760:
    t = (y - TRANSOM) / (760 - TRANSOM)
    w = 1.1 - 0.85 * t
    gap = 3.2 + 3.5 * t
    x = F
    while x < 408 - F:
        seg = random.uniform(30, 120)
        line(x, y, min(x + seg, 408 - F), y, w, INK, 0.08)
        x += seg + random.uniform(0.5, 3 + 6 * t)
    y += gap
# soft cloud gaps
for cx, cy, rx, ry in ((110, 410, 80, 7), (300, 450, 70, 6), (190, 520, 100, 7), (80, 600, 60, 5), (330, 590, 50, 5)):
    d.ellipse(((cx - rx) * u, (cy - ry) * u, (cx + rx) * u, (cy + ry) * u), fill=(0, 0, 0, 0))


def block(a, t, b, bt, layer):
    """One engraved block: lit face with floor lines and piers, shaded face with close verticals (+ diagonals near)."""
    col = (FAR, MID, INK)[layer]
    d.rectangle((a * u, t * u, b * u, bt * u), fill=PAPER)
    shade = (0.38, 0.45, 0.52)[layer]
    split = a + (b - a) * (1 - shade)
    floor = (5.0, 4.2, 3.6)[layer]
    pier = (7.0, 5.5, 4.6)[layer]
    yy = t + 3
    while yy < bt - 1:
        line(a + 1, yy, split - 1, yy, 0.42, col, 0.1)
        yy += floor
    if layer:
        xx = a + pier
        while xx < split - 1:
            line(xx, t + 2, xx, bt, 0.32, col, 0.15)
            xx += pier
    step = (2.6, 1.8, 1.25)[layer]
    xx = split
    while xx < b:
        line(xx, t, xx, bt, 0.5, col, 0.15)
        xx += step
    if layer == 2:
        k = t - (b - split)
        dx = b - split
        while k < bt:
            y0, y1, x0, x1 = k, k + dx, split, b
            if y0 < t: x0 += t - y0; y0 = t
            if y1 > bt: x1 -= y1 - bt; y1 = bt
            if x1 > x0:
                line(x0, y0, x1, y1, 0.38, col, 0.1)
            k += 3.0
        d.rectangle((a * u, (bt - 0) * u, b * u, bt * u), fill=PAPER)
    d.rectangle((a * u, t * u, b * u, bt * u), outline=col, width=round((0.6, 0.8, 1.0)[layer] * u))
    line(split, t, split, bt, (0.6, 0.8, 1.0)[layer], col, 0.05)
    # cornice
    line(a - 1, t, b + 1, t, (0.8, 1.1, 1.4)[layer], col, 0.05)


def tower(x, w, top, base, tiers=(), layer=2):
    blocks = [(x, top, x + w, base)]
    yy, a, b = top, x, x + w
    for inset, h in tiers:
        a += inset; b -= inset
        blocks.append((a, yy - h, b, yy)); yy -= h
    for bl in blocks:
        block(*bl, layer)
    return yy, (a + b) / 2


def mast(cx, ytop, h, w=1.0, c=INK):
    line(cx, ytop, cx, ytop - h, w, c, 0.02)


# ---- far: river haze, downtown towers and low blocks
for x, w, top in ((300, 16, 612), (318, 16, 608)):
    tower(x, w, top, 720, layer=0)
mast(326, 608, 20, 0.7, FAR)
for x, w, top in ((30, 30, 640), (62, 22, 628), (240, 28, 650), (340, 40, 650), (196, 30, 636)):
    tower(x, w, top, 720, layer=0)

# ---- middle: the stepped spire with its mast, the arched crown, and neighbours
ytop, cx = tower(86, 66, 560, 780, tiers=((7, 64), (6, 56), (5, 46), (4, 30), (3, 14)), layer=1)
mast(cx, ytop, 76, 1.3, MID)
for i in range(3):
    line(cx - 3 + i * 3, ytop, cx - 3 + i * 3, ytop - 10, 0.5, MID, 0.02)
ytop2, cx2 = tower(262, 42, 610, 790, tiers=((5, 40), (5, 24)), layer=1)
for i in range(6):
    r = 16 - i * 2.6
    yc = ytop2 - i * 6
    d.arc(((cx2 - r) * u, (yc - r) * u, (cx2 + r) * u, (yc + r) * u), 180, 360, fill=MID, width=round(0.9 * u))
    for k in (-2, -1, 0, 1, 2):
        line(cx2 + k * r / 2.6, yc - r * 0.75, cx2 + k * r / 3, yc, 0.4, MID, 0.05)
mast(cx2, ytop2 - 5 * 6 - 3, 40, 1.0, MID)
for x, w, top in ((32, 50, 660), (164, 46, 640), (216, 40, 672), (316, 64, 668)):
    tower(x, w, top, 800, tiers=((4, 12),), layer=1)

# ---- near: dark blocks rising to the sill, with water tanks
for x, w, top in ((24, 64, 742), (84, 58, 780), (140, 76, 726), (214, 58, 770), (270, 70, 712), (336, 50, 752)):
    tower(x, w, top, SILL, tiers=((6, 14),), layer=2)
for cx, ty in ((52, 728), (306, 698), (170, 712)):
    d.rectangle(((cx - 8) * u, (ty - 16) * u, (cx + 8) * u, ty * u), fill=PAPER)
    for k in range(-7, 8, 2):
        line(cx + k, ty - 16, cx + k, ty, 0.45, INK, 0.05)
    for k in (-14, -9, -4):
        line(cx - 8, ty + k, cx + 8, ty + k, 0.5, INK, 0.05)
    d.polygon(((cx - 9) * u, (ty - 16) * u, cx * u, (ty - 24) * u, (cx + 9) * u, (ty - 16) * u), fill=PAPER, outline=INK)
    line(cx - 6, ty, cx - 7, ty + 9, 0.8); line(cx + 6, ty, cx + 7, ty + 9, 0.8); line(cx - 7, ty + 5, cx + 7, ty + 5, 0.5)

# ---- keep the transom glass clear for lettering, and nothing below the sill
d.rectangle((0, 0, W, TRANSOM * u), fill=(0, 0, 0, 0))
d.rectangle((0, SILL * u, W, H), fill=(0, 0, 0, 0))
# ---- the window: burgundy frame the full height of the card, a transom bar, a sill
d.rectangle(((F - 6) * u, (F - 6) * u, F * u, (SILL + 6) * u), fill=RED)
d.rectangle(((408 - F) * u, (F - 6) * u, (408 - F + 6) * u, (SILL + 6) * u), fill=RED)
d.rectangle(((F - 6) * u, (F - 6) * u, (408 - F + 6) * u, F * u), fill=RED)
d.rectangle(((F - 6) * u, (TRANSOM - 5) * u, (408 - F + 6) * u, (TRANSOM + 1) * u), fill=RED)
d.rectangle(((F - 6) * u, SILL * u, (408 - F + 6) * u, (SILL + 6) * u), fill=RED)

im.resize((408 * 2, 1056 * 2), Image.LANCZOS).save(os.path.join(D, 'assets', 'skyline-engraving.png'))
print('painted')
