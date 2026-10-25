"""Paints the one signature piece for the Mandel's trifold (Annie Hall, 1977):
a large engraving of the Coney Island wooden roller coaster with Alvy's family house underneath it.
Single dark ink, line engraving, drawn at high resolution and reduced to 2x. Writes assets/coaster-engraving.png."""
import os, math
import numpy as np
from PIL import Image, ImageDraw

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'assets', 'coaster-engraving.png')
CSS_W, CSS_H = 368, 470
S, K = 2, 3
w, h = CSS_W * S * K, CSS_H * S * K
INK = (28, 25, 21)
im = Image.new('L', (w, h), 0)
d = ImageDraw.Draw(im)
rng = np.random.default_rng(7)
px = S * K               # one css px in hi-res px
LW = int(px * 1.0)       # standard line
FINE = max(2, int(px * 0.55))
ground = int(h * 0.90)


def sig(x):
    return 1 / (1 + math.exp(-x))


def track(x):
    u = x / w
    v = 0.12 + 0.40 * sig((u - 0.33) * 13) - 0.17 * max(0.0, min(1.0, (u - 0.80) / 0.22)) ** 1.4
    if u < 0.13:
        v += (0.13 - u) * 0.55
    return v * h


def line(pts, width):
    d.line(pts, fill=255, width=width, joint='curve')


# ---------------------------------------------------------------- sky: ruled engraving with two clouds and a low sun
clouds = [(0.70, 0.12, 0.22, 0.045), (0.30, 0.27, 0.17, 0.035), (0.86, 0.30, 0.12, 0.028)]
y = int(h * 0.025)
while y < ground:
    gap_pts = []
    for cu, cv, rx, ry in clouds:
        cy = cv * h
        if abs(y - cy) < ry * h:
            half = rx * w * math.sqrt(max(0, 1 - ((y - cy) / (ry * h)) ** 2))
            gap_pts.append((cu * w - half, cu * w + half))
    xs = [0.0]
    for a, b in sorted(gap_pts):
        xs += [a, b]
    xs.append(float(w))
    frac = y / ground
    width = max(2, int(FINE * (0.7 + 0.9 * frac)))   # sky lines thicken toward the horizon
    for i in range(0, len(xs), 2):
        if xs[i + 1] - xs[i] > 4:
            line([(xs[i], y), (xs[i + 1], y)], width)
    y += int(px * (5.2 - 1.6 * frac))
# cloud undersides: short scalloped strokes
for cu, cv, rx, ry in clouds:
    n = 7
    for i in range(n):
        x0 = (cu - rx * 0.9) * w + i * (rx * 1.8 * w / n)
        d.arc([x0, (cv + ry * 0.2) * h, x0 + rx * 1.8 * w / n * 1.25, (cv + ry * 1.25) * h], 200, 340, fill=255, width=FINE)

# ---------------------------------------------------------------- structure: clear the sky under the track, then the lattice
xs = np.linspace(-0.03 * w, 1.03 * w, 600)
top = [(x, track(x)) for x in xs]
d.polygon(top + [(1.03 * w, ground), (-0.03 * w, ground)], fill=0)

step = int(px * 15)
posts = list(range(-step // 2, w + step, step))
for i, x in enumerate(posts[:-1]):
    x2 = posts[i + 1]
    t1, t2 = track(x) + 7 * px, track(x2) + 7 * px
    line([(x, t1), (x, ground)], LW)
    led = int(px * 17)
    levels, yy = [], ground - led
    while yy > max(t1, t2) + 3 * px:
        levels.append(yy)
        yy -= led
    for a in levels:
        line([(x, a), (x2, a)], FINE)
    bounds = [ground] + levels + [max(t1, t2)]
    for j in range(len(bounds) - 1):
        ya, yb = bounds[j], bounds[j + 1]
        line([(x, ya), (x2, yb)], FINE)
        line([(x2, ya), (x, yb)], FINE)
    # shade the far half of every other bay with fine vertical hatching
    if i % 2 == 0:
        for hx in range(int(x + step * 0.55), int(x2), int(px * 2.2)):
            line([(hx, max(t1, t2) + 4 * px), (hx, ground)], max(2, FINE // 2))

# track: heavy top chord, rail and a fringe of ties
line(top, LW * 3)
line([(x, yy + 7 * px) for x, yy in top], LW)
for x in range(0, w, int(px * 3.5)):
    line([(x, track(x) - 1.5 * px), (x, track(x) + 7 * px)], FINE)
# handrail posts on the lift hill
for x in range(int(0.02 * w), int(0.26 * w), int(px * 6)):
    line([(x, track(x)), (x, track(x) - 6 * px)], FINE)
line([(x, track(x) - 6 * px) for x in range(int(0.02 * w), int(0.26 * w), int(px * 2))], FINE)

# a train of four cars cresting the lift hill
for i in range(4):
    cx = 0.06 * w + i * 13 * px
    cy = track(cx)
    a = math.atan2(track(cx + 5) - track(cx - 5), 10)
    ca, sa = math.cos(a), math.sin(a)
    L, Hh = 11 * px, 7 * px
    pts = [(0, 0), (L, 0), (L, -Hh), (L * 0.15, -Hh * 0.75)]
    d.polygon([(cx + p * ca - q * sa, cy + p * sa + q * ca - 2 * px) for p, q in pts], fill=255)
    for hd in (0.35, 0.7):  # riders
        hx = cx + L * hd * ca - (-Hh - 2 * px) * sa
        hy = cy + L * hd * sa + (-Hh - 2 * px) * ca - 2 * px
        d.ellipse([hx - 2 * px, hy - 2 * px, hx + 2 * px, hy + 2 * px], fill=255)

# ---------------------------------------------------------------- the house under the track
hx0, hx1 = int(0.30 * w), int(0.90 * w)
low = max(track(x) for x in range(hx0, hx1, 8))
ridge = int(low + 16 * px)
eave = int(ridge + 34 * px)
mid = (hx0 + hx1) // 2
d.polygon([(hx0 - 12 * px, eave + 2 * px), (mid, ridge - 5 * px), (hx1 + 12 * px, eave + 2 * px), (hx1 + 4 * px, eave + 2 * px), (hx1 + 4 * px, ground), (hx0 - 4 * px, ground), (hx0 - 4 * px, eave + 2 * px)], fill=0)
# roof: gable to the street, hatched with diagonal lines
roof = [(hx0 - 8 * px, eave), (mid, ridge), (hx1 + 8 * px, eave)]
for t in range(0, int(eave - ridge), int(px * 2.4)):
    yy = ridge + t
    half = (yy - ridge) / (eave - ridge) * ((hx1 - hx0) / 2 + 8 * px)
    line([(mid - half, yy), (mid + half, yy)], FINE)
line(roof, LW * 2)
# chimney
cx0 = int(hx0 + (hx1 - hx0) * 0.70)
cy_roof = ridge + (cx0 + 6 * px - mid) / ((hx1 - hx0) / 2 + 8 * px) * (eave - ridge)
d.rectangle([cx0, cy_roof - 18 * px, cx0 + 11 * px, cy_roof + 4 * px], fill=0, outline=255, width=LW)
for yy in range(int(cy_roof - 16 * px), int(cy_roof + 2 * px), int(px * 4)):
    line([(cx0, yy), (cx0 + 11 * px, yy)], FINE)
# attic window in the gable
aw = 14 * px
d.ellipse([mid - aw // 2, eave - 24 * px, mid + aw // 2, eave - 24 * px + aw], fill=0, outline=255, width=LW)
line([(mid, eave - 24 * px), (mid, eave - 24 * px + aw)], FINE)
# walls and clapboard
d.rectangle([hx0, eave, hx1, ground], outline=255, width=LW)
yy = eave + 3 * px
while yy < ground:
    line([(hx0, yy), (hx1, yy)], FINE)
    yy += int(px * 3.2)
# corner boards
for cxb in (hx0, hx1 - 3 * px):
    d.rectangle([cxb, eave, cxb + 3 * px, ground], fill=255)
# windows: two storeys
porch_top = ground - int(px * 36)
rows = [eave + int(px * 10), porch_top + int(px * 7)]
for r, wy in enumerate(rows):
    for i in range(4):
        if r == 1 and i in (1, 2):
            continue
        wx = hx0 + int((hx1 - hx0) * (0.08 + i * 0.235))
        ww, wh = 17 * px, 22 * px if r == 0 else 18 * px
        d.rectangle([wx - 2 * px, wy - 2 * px, wx + ww + 2 * px, wy + wh + 3 * px], fill=0)
        d.rectangle([wx, wy, wx + ww, wy + wh], outline=255, width=LW)
        line([(wx + ww // 2, wy), (wx + ww // 2, wy + wh)], FINE)
        line([(wx, wy + wh // 2), (wx + ww, wy + wh // 2)], FINE)
        for t in range(wy + 2 * px, wy + wh, int(px * 2)):
            line([(wx + px, t), (wx + ww - px, t)], max(2, FINE // 2))
        line([(wx - 3 * px, wy + wh + 3 * px), (wx + ww + 3 * px, wy + wh + 3 * px)], LW)   # sill
        d.rectangle([wx - 5 * px, wy, wx - 2 * px, wy + wh], outline=255, width=max(2, FINE // 2))  # shutters
        d.rectangle([wx + ww + 2 * px, wy, wx + ww + 5 * px, wy + wh], outline=255, width=max(2, FINE // 2))
# porch: roof, posts, rail, steps and a screen door
pr0, pr1 = hx0 + int((hx1 - hx0) * 0.26), hx0 + int((hx1 - hx0) * 0.74)
d.rectangle([pr0 - 6 * px, porch_top - 6 * px, pr1 + 6 * px, ground], fill=0)
d.polygon([(pr0 - 10 * px, porch_top), (pr1 + 10 * px, porch_top), (pr1 + 4 * px, porch_top - 8 * px), (pr0 - 4 * px, porch_top - 8 * px)], fill=255)
for p in np.linspace(pr0 - 6 * px, pr1 + 6 * px, 5):
    line([(p, porch_top), (p, ground)], LW)
rail = ground - 12 * px
line([(pr0 - 6 * px, rail), (pr1 + 6 * px, rail)], LW)
for p in range(int(pr0 - 4 * px), int(pr1 + 6 * px), int(px * 3)):
    line([(p, rail), (p, ground - 2 * px)], max(2, FINE // 2))
dx = mid - 9 * px
d.rectangle([dx - 2 * px, porch_top + 4 * px, dx + 20 * px, ground], fill=0)
d.rectangle([dx, porch_top + 6 * px, dx + 18 * px, ground], outline=255, width=LW)
for t in range(int(porch_top + 9 * px), int(ground), int(px * 2)):
    line([(dx + 2 * px, t), (dx + 16 * px, t)], max(2, FINE // 2))
for s_ in range(3):
    line([(dx - (4 + s_ * 3) * px, ground + (3 + s_ * 3) * px), (dx + (22 + s_ * 3) * px, ground + (3 + s_ * 3) * px)], LW)

# ---------------------------------------------------------------- ground, fence, lamp post, foreground hatching
line([(0, ground), (w, ground)], LW * 2)
for gy in range(int(ground + 5 * px), h, int(px * 3)):
    for gx in range(0, w, int(px * 9)):
        if dx - 14 * px < gx < dx + 34 * px and gy < ground + 13 * px:
            continue
        ln = int(rng.integers(3, 7)) * px
        line([(gx + rng.integers(0, 3 * px), gy), (gx + ln, gy)], max(2, FINE // 2))
for gx in range(0, w, int(px * 5)):
    if gx < hx0 - 14 * px or gx > hx1 + 14 * px:
        line([(gx, ground - 11 * px), (gx, ground)], FINE)
line([(0, ground - 9 * px), (hx0 - 14 * px, ground - 9 * px)], FINE)
line([(hx1 + 14 * px, ground - 9 * px), (w, ground - 9 * px)], FINE)
lx = int(0.14 * w)
line([(lx, ground), (lx, ground - 58 * px)], LW * 2)
d.ellipse([lx - 5 * px, ground - 68 * px, lx + 5 * px, ground - 56 * px], fill=0, outline=255, width=LW)
line([(lx - 6 * px, ground - 68 * px), (lx + 6 * px, ground - 68 * px)], LW)

# ---------------------------------------------------------------- engraver's double frame
d.rectangle([0, 0, w - 1, h - 1], outline=255, width=LW * 2)
d.rectangle([5 * px, 5 * px, w - 5 * px, h - 5 * px], outline=255, width=FINE)

m = np.asarray(im.resize((CSS_W * S, CSS_H * S), Image.LANCZOS)).astype(np.float32) / 255
a = np.clip(m * 1.15, 0, 1)
rgba = np.dstack([np.full_like(a, INK[0]), np.full_like(a, INK[1]), np.full_like(a, INK[2]), a * 255]).astype(np.uint8)
Image.fromarray(rgba, 'RGBA').save(OUT, optimize=True)
print('painted', OUT)
