"""Paints the one-ink art and the paper textures for the Lowenthal & Daughter delivery menu.
Everything is drawn in a single ink colour on transparency, the way a quick-print shop
would run a one-colour job on canary stock in 1987."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
INK = (150, 34, 24)
random.seed(1987)

def ink_layer(mask):
    """mask (L) -> RGBA in ink colour."""
    out = Image.new('RGBA', mask.size, INK + (0,))
    out.putalpha(mask)
    return out

def halftone(draw, box, step, r, clipmask=None):
    x0, y0, x1, y1 = [v * S for v in box]
    y = y0
    row = 0
    while y < y1:
        x = x0 + (step / 2 if row % 2 else 0)
        while x < x1:
            draw.ellipse([x - r, y - r, x + r, y + r], fill=255)
            x += step
        y += step * 0.866
        row += 1

# ---------- storefront, 2x of 736 x 300 ----------
S = 3                                   # supersample
W, H = 1472, 600
w, h = W * S, H * S
m = Image.new('L', (w, h), 0)
d = ImageDraw.Draw(m)
def P(v): return [int(t * S) for t in v]
def L(x0, y0, x1, y1, wd=3): d.line(P([x0, y0, x1, y1]), fill=255, width=int(wd * S))
def R(x0, y0, x1, y1, wd=3, fill=None):
    if fill is not None: d.rectangle(P([x0, y0, x1, y1]), fill=fill)
    d.rectangle(P([x0, y0, x1, y1]), outline=255, width=int(wd * S))

GROUND = 540
# building outline
R(60, 20, 1412, GROUND, 4)
# brick courses above the awning
for i, y in enumerate(range(28, 150, 18)):
    L(64, y, 1408, y, 1.4)
    off = 0 if i % 2 else 30
    for x in range(64 + off, 1408, 60):
        L(x, y, x, y + 18, 1.4)
# cornice band
R(60, 150, 1412, 170, 3, fill=255)
# awning: slanted striped canopy
AW_T, AW_B = 182, 268
d.polygon(P([90, AW_T, 1382, AW_T, 1412, AW_B, 60, AW_B]), outline=255)
stripes = 16
for i in range(stripes):
    if i % 2: continue
    xa0 = 90 + (1382 - 90) * i / stripes
    xa1 = 90 + (1382 - 90) * (i + 1) / stripes
    xb0 = 60 + (1412 - 60) * i / stripes
    xb1 = 60 + (1412 - 60) * (i + 1) / stripes
    d.polygon(P([xa0, AW_T, xa1, AW_T, xb1, AW_B, xb0, AW_B]), fill=255)
L(90, AW_T, 1382, AW_T, 4); L(60, AW_B, 1412, AW_B, 4)
# scalloped valance
VW = (1412 - 60) / 32
for i in range(32):
    x = 60 + i * VW
    d.chord(P([x, AW_B - 16, x + VW, AW_B + 22]), 0, 180, fill=255 if i % 2 == 0 else 0, outline=255, width=int(3 * S))
# shopfront: two windows and a door
WIN_T = 300
for (x0, x1) in ((96, 600), (872, 1376)):
    R(x0, WIN_T, x1, 500, 5)
    # dark interior as halftone
    halftone(d, (x0 + 10, WIN_T + 10, x1 - 10, 492), 9 * S, 2.1 * S)
    # shelf
    d.rectangle(P([x0 + 6, 430, x1 - 6, 438]), fill=255)
    # cans and jars on the shelf
    x = x0 + 24
    k = 0
    while x < x1 - 60:
        cw = 30 if k % 3 else 40
        ch = 44 if k % 2 else 58
        d.rectangle(P([x, 430 - ch, x + cw, 430]), fill=0, outline=255, width=int(3 * S))
        L(x, 430 - ch + 12, x + cw, 430 - ch + 12, 2)
        x += cw + 12
        k += 1
    # hanging salamis and cheeses from a rail
    L(x0 + 10, WIN_T + 20, x1 - 10, WIN_T + 20, 3)
    for j, x in enumerate(range(x0 + 46, x1 - 30, 64)):
        if j % 3 == 1:
            # cheese ball on a string
            L(x, WIN_T + 20, x, WIN_T + 44, 2)
            d.ellipse(P([x - 20, WIN_T + 44, x + 20, WIN_T + 80]), fill=0, outline=255, width=int(3 * S))
            d.ellipse(P([x - 7, WIN_T + 54, x + 3, WIN_T + 62]), fill=255)
        else:
            L(x, WIN_T + 20, x, WIN_T + 34, 2)
            d.rounded_rectangle(P([x - 10, WIN_T + 34, x + 10, WIN_T + 100 + (j % 2) * 10]), radius=10 * S, fill=0, outline=255, width=int(3 * S))
            for t in range(3):
                L(x - 9, WIN_T + 50 + t * 16, x + 9, WIN_T + 50 + t * 16, 1.5)
    # base panel
    R(x0, 500, x1, GROUND, 4)
# door
R(640, WIN_T - 6, 832, GROUND, 5)
R(660, WIN_T + 14, 812, 440, 3)
halftone(d, (668, WIN_T + 22, 806, 434), 9 * S, 2.1 * S)
d.ellipse(P([792, 470, 808, 486]), fill=255)
# transom with house number, left blank for type
R(640, 276, 832, WIN_T - 6, 3)
# pavement
L(0, GROUND, W, GROUND, 5)
for x in range(20, W, 140):
    L(x, GROUND + 6, x + 30, H - 4, 1.6)
# fruit crates on the pavement, left
for cx in (150, 290, 430):
    cy = GROUND - 62
    # fruit heaped in two rows above the crate
    for row, (n, yy) in enumerate(((5, cy - 14), (4, cy - 36))):
        for j in range(n):
            fx = cx - (n - 1) * 11.5 + j * 23
            d.ellipse(P([fx - 12, yy - 12, fx + 12, yy + 12]), fill=0, outline=255, width=int(3 * S))
            d.ellipse(P([fx - 5, yy - 7, fx + 1, yy - 1]), fill=255)
    d.rectangle(P([cx - 62, cy, cx + 62, GROUND]), fill=0, outline=255, width=int(4 * S))
    for t in (1, 2):
        L(cx - 62, cy + 62 * t / 3, cx + 62, cy + 62 * t / 3, 2)
# delivery bicycle, right, with a wicker basket on the front
base_mask = m
m = Image.new('L', (w, h), 0)
d = ImageDraw.Draw(m)
bx, by = 1180, GROUND - 50
r = 52
for wx in (bx - 120, bx + 120):
    d.ellipse(P([wx - r, by - r, wx + r, by + r]), outline=255, width=int(5 * S))
    d.ellipse(P([wx - 5, by - 5, wx + 5, by + 5]), fill=255)
    for a in range(0, 360, 30):
        L(wx, by, wx + (r - 4) * math.cos(math.radians(a)), by + (r - 4) * math.sin(math.radians(a)), 1.2)
# frame
seat = (bx - 60, by - 110)
head = (bx + 86, by - 118)
crank = (bx - 6, by)
L(bx - 120, by, *crank, 5); L(*crank, *seat, 5); L(bx - 120, by, *seat, 5)
L(*seat, head[0] - 6, head[1] + 8, 5); L(*crank, head[0] - 4, head[1] + 4, 5)
L(head[0] - 4, head[1] + 4, bx + 120, by, 5)
d.rounded_rectangle(P([seat[0] - 26, seat[1] - 12, seat[0] + 22, seat[1] + 2]), radius=6 * S, fill=255)
L(head[0], head[1], head[0] + 10, head[1] - 34, 5)
L(head[0] - 18, head[1] - 34, head[0] + 30, head[1] - 34, 5)
d.ellipse(P([crank[0] - 14, crank[1] - 14, crank[0] + 14, crank[1] + 14]), outline=255, width=int(4 * S))
# basket, woven
bk = (head[0] + 4, head[1] - 30, head[0] + 120, head[1] + 44)
d.polygon(P([bk[0], bk[1], bk[2], bk[1], bk[2] - 10, bk[3], bk[0] + 10, bk[3]]), fill=0, outline=255)
d.line(P([bk[0], bk[1], bk[2], bk[1], bk[2] - 10, bk[3], bk[0] + 10, bk[3], bk[0], bk[1]]), fill=255, width=int(4 * S))
for t in range(1, 5):
    y = bk[1] + (bk[3] - bk[1]) * t / 5
    L(bk[0] + 2 * t, y, bk[2] - 2 * t, y, 2)
for t in range(1, 8):
    x = bk[0] + (bk[2] - bk[0]) * t / 8
    L(x, bk[1], x + (5 if t < 4 else -5), bk[3], 1.6)
# a paper bag and a loaf poking out of the basket
d.rectangle(P([bk[0] + 20, bk[1] - 46, bk[0] + 64, bk[1]]), fill=0, outline=255, width=int(3 * S))
L(bk[0] + 20, bk[1] - 38, bk[0] + 64, bk[1] - 38, 2)
d.rounded_rectangle(P([bk[0] + 70, bk[1] - 64, bk[0] + 88, bk[1] + 2]), radius=9 * S, fill=0, outline=255, width=int(3 * S))
for t in range(3):
    L(bk[0] + 72, bk[1] - 50 + t * 16, bk[0] + 86, bk[1] - 56 + t * 16, 1.6)

# knock the window dots out from behind the bicycle so it reads clean
solid = m.copy()
sd_ = ImageDraw.Draw(solid)
for wx in (bx - 120, bx + 120):
    sd_.ellipse(P([wx - r, by - r, wx + r, by + r]), fill=255)
sd_.polygon(P([bx - 120, by, crank[0], crank[1], head[0], head[1], *seat]), fill=255)
sd_.rectangle(P([bk[0], bk[1] - 64, bk[2], bk[3]]), fill=255)
halo = solid.filter(ImageFilter.MaxFilter(int(8 * S) | 1))
m = ImageChops.add(ImageChops.subtract(base_mask, halo), m)
m = m.resize((W, H), Image.LANCZOS)
# offset-press softness: a touch of ink spread, then speckle where the ink starved
m = m.filter(ImageFilter.GaussianBlur(0.5))
noise = Image.effect_noise((W // 6, H // 6), 60).resize((W, H), Image.BICUBIC).point(lambda v: 255 if v > 40 else int(255 * (0.4 + 0.6 * v / 40)))
m = ImageChops.multiply(m, noise)
ink_layer(m).save(os.path.join(A, 'storefront.png'))

# ---------- paper wear, one per face, at 2x of 816 x 1056 ----------
PW, PH = 1632, 2112
def wear(seed, curl_corner):
    rnd = random.Random(seed)
    base = Image.effect_noise((PW // 48, PH // 48), 40).resize((PW, PH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    # big soft mottling, warm brown in low alpha
    a = base.point(lambda v: max(0, min(255, int((v - 110) * 0.55))))
    # edge darkening: distance from edge
    edge = Image.new('L', (PW, PH), 0)
    ed = ImageDraw.Draw(edge)
    for i in range(60):
        v = int(70 * (1 - i / 60) ** 2.2)
        ed.rectangle([i, i, PW - 1 - i, PH - 1 - i], outline=v, width=1)
    edge = edge.filter(ImageFilter.GaussianBlur(10))
    # one corner that was pushed under a door: a soft diagonal crease shadow
    cr = Image.new('L', (PW, PH), 0)
    cd = ImageDraw.Draw(cr)
    cx, cy = curl_corner
    sx = -1 if cx > 0 else 1
    sy = -1 if cy > 0 else 1
    p1 = (cx + sx * 190, cy)
    p2 = (cx, cy + sy * 150)
    cd.line([p1, p2], fill=46, width=6)
    cd.polygon([(cx, cy), p1, p2], fill=18)
    cr = cr.filter(ImageFilter.GaussianBlur(5))
    alpha = ImageChops.add(ImageChops.add(a, edge), cr)
    out = Image.new('RGBA', (PW, PH), (120, 82, 30, 0))
    out.putalpha(alpha)
    return out

wear(1, (PW, PH)).save(os.path.join(A, 'wear-front.png'))
wear(2, (0, PH)).save(os.path.join(A, 'wear-back.png'))

# ---------- a blue ballpoint ring, drawn by hand around one grocery line ----------
BW, BH = 520, 120
s = 3
bm = Image.new('L', (BW * s, BH * s), 0)
bd = ImageDraw.Draw(bm)
pts = []
turns = 1.12
for i in range(260):
    t = i / 259 * turns * 2 * math.pi
    rx = (BW / 2 - 14) * (1 + 0.025 * math.sin(3 * t))
    ry = (BH / 2 - 14) * (1 + 0.05 * math.sin(2 * t + 1))
    x = BW / 2 + rx * math.cos(t - 0.3) + 4 * math.sin(t * 0.5)
    y = BH / 2 + ry * math.sin(t - 0.3) + 3 * (t / (2 * math.pi))
    pts.append((x * s, y * s))
for i in range(len(pts) - 1):
    wdt = int((2.4 + 0.8 * math.sin(i / 20)) * s)
    bd.line([pts[i], pts[i + 1]], fill=230, width=wdt)
bm = bm.resize((BW, BH), Image.LANCZOS)
pen = Image.new('RGBA', (BW, BH), (34, 52, 140, 0))
pen.putalpha(bm)
pen.save(os.path.join(A, 'pen-ring.png'))
print('painted')
