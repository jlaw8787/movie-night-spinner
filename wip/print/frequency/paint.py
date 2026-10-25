"""Paints the signature piece (v2, gouache repaint: brick courses, limestone trim, recessed lit windows): the Queens firehouse at dusk, northern lights over the block,
Frank's ham radio aerial on the roof. CSS size 1056x560, painted at 2x into assets/firehouse-dusk.jpg."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
S = 2
CW, CH = 1056, 560
w, h = CW * S, CH * S
rng = np.random.default_rng(1969)
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32) / S


def noise(octaves, base, seed, shape=(h, w)):
    r = np.random.default_rng(seed); out = np.zeros(shape, np.float32); amp, tot = 1.0, 0
    for o in range(octaves):
        n = base * 2 ** o
        g = r.standard_normal((n + 1, int(n * shape[1] / shape[0]) + 1)).astype(np.float32)
        out += amp * np.asarray(Image.fromarray(g, 'F').resize((shape[1], shape[0]), Image.BICUBIC)); tot += amp; amp *= 0.5
    return out / tot


def mix(a, b, t):
    t = np.clip(t, 0, 1)[..., None]
    return a * (1 - t) + b * t


def C(hexs):
    return np.array([int(hexs[i:i + 2], 16) for i in (1, 3, 5)], np.float32)


HORIZON = 470
# ---------------------------------------------------------------- sky
t = np.clip(yy / HORIZON, 0, 1)
sky = mix(np.broadcast_to(C('#0a1230'), (h, w, 3)), np.broadcast_to(C('#1f3563'), (h, w, 3)), t ** 1.2)
sky = mix(sky, np.broadcast_to(C('#5a4f78'), (h, w, 3)), np.clip((t - 0.72) / 0.28, 0, 1) ** 1.5)
sky = mix(sky, np.broadcast_to(C('#d7774a'), (h, w, 3)), np.clip((t - 0.88) / 0.12, 0, 1) ** 1.6 * 0.85)
sky += noise(4, 3, 5)[..., None] * 6

# aurora: three curtains, bright lower hem, rays fading upward
rays_hi = noise(3, 60, 7, (1, w)) if False else None
glow = np.zeros((h, w), np.float32)
hue_t = np.zeros((h, w), np.float32)
for i, (base, amp, freq, ph, height, strength) in enumerate([
        (250, 34, 1.6, 0.4, 150, 1.0), (300, 26, 2.3, 2.1, 120, 0.8), (200, 40, 1.1, 4.0, 110, 0.55)]):
    x = xx[0] / CW
    hem = base + amp * np.sin(x * math.pi * 2 * freq + ph) + 14 * np.sin(x * math.pi * 7.3 + ph * 2)
    r1 = np.random.default_rng(30 + i)
    ray = np.interp(np.arange(w), np.linspace(0, w, 140), r1.random(140)) * 0.55 \
        + np.interp(np.arange(w), np.linspace(0, w, 520), r1.random(520)) * 0.45
    ray = ndimage.gaussian_filter1d(ray.astype(np.float32), 1.5 * S)
    env = 0.35 + 0.65 * np.clip(np.sin(x * math.pi * (1.3 + i * 0.4) + ph) * 0.5 + 0.6, 0, 1)
    d = hem[None, :] - yy                       # positive above the hem
    up = np.exp(-np.clip(d, 0, None) / height) * (d >= 0)
    down = np.exp(-(np.clip(-d, 0, None) / 26) ** 1.5) * (d < 0) * 0.85
    g = (up * (0.45 + 0.75 * ray[None, :] ** 1.6) + down) * env[None, :] * strength
    glow += g
    hue_t = np.maximum(hue_t, np.clip(d / (height * 1.6), 0, 1) * (g > 0.02))
glow = ndimage.gaussian_filter(glow, 2.2 * S)
green, teal, violet = C('#63e6a2'), C('#3fb6c9'), C('#8a6ad1')
acol = mix(np.broadcast_to(green, (h, w, 3)), np.broadcast_to(teal, (h, w, 3)), hue_t * 1.6)
acol = mix(acol, np.broadcast_to(violet, (h, w, 3)), np.clip(hue_t * 1.6 - 0.9, 0, 1))
a = np.clip(glow, 0, 1.4)[..., None] * 0.78
img = sky + acol * a                       # additive light
img = mix(img, img * 0 + 255, np.clip(glow - 1.1, 0, 0.3) * 0.0)

# stars
for _ in range(420):
    sx, sy = rng.random() * w, rng.random() * HORIZON * S * 0.8
    b = rng.random() ** 3 * 200 + 40
    r = 1 if rng.random() < 0.85 else 2
    fade = 1 - min(1, glow[int(sy), int(sx)] * 1.2)
    img[int(sy):int(sy) + r, int(sx):int(sx) + r] += b * fade
img = np.clip(img, 0, 255)

# ---------------------------------------------------------------- back row of houses (silhouettes with lit windows)
pil = Image.fromarray(img.astype(np.uint8))
dr = ImageDraw.Draw(pil)


def P(v): return int(round(v * S))


HOUSE = (22, 30, 56)
x = -10
r2 = np.random.default_rng(12)
houses = []
while x < CW + 10:
    bw = r2.integers(70, 120)
    top = HORIZON - r2.integers(95, 165)
    if 380 < x < 900:                  # leave room around the firehouse, lower roofs there
        top = HORIZON - r2.integers(80, 110)
    houses.append((x, top, bw))
    x += bw
for (hx, top, bw) in houses:
    kind = r2.integers(0, 3)
    if kind == 0:   # gable
        dr.polygon([(P(hx), P(top + 24)), (P(hx + bw / 2), P(top - 6)), (P(hx + bw), P(top + 24)), (P(hx + bw), P(HORIZON + 4)), (P(hx), P(HORIZON + 4))], fill=HOUSE)
    else:           # flat roof with cornice
        dr.rectangle([P(hx), P(top), P(hx + bw), P(HORIZON + 4)], fill=HOUSE)
        dr.rectangle([P(hx - 2), P(top - 4), P(hx + bw + 2), P(top + 2)], fill=(18, 25, 48))
    if r2.random() < 0.6:   # chimney
        cx = hx + bw * r2.uniform(0.2, 0.8)
        dr.rectangle([P(cx), P(top - 18), P(cx + 9), P(top + 4)], fill=HOUSE)
    if r2.random() < 0.55:  # TV antenna
        ax = hx + bw * r2.uniform(0.3, 0.7)
        dr.line([P(ax), P(top), P(ax), P(top - 34)], fill=(30, 38, 66), width=S)
        for k in range(3):
            yk = top - 30 + k * 8; hw = 16 - k * 4
            dr.line([P(ax - hw), P(yk), P(ax + hw), P(yk)], fill=(30, 38, 66), width=S)
    for wy in range(int(top + 30), HORIZON - 30, 46):     # windows
        for wx in np.arange(hx + 12, hx + bw - 22, 30):
            if r2.random() < 0.42:
                col = (246, 196, 112) if r2.random() < 0.7 else (214, 226, 236)
                dr.rectangle([P(wx), P(wy), P(wx + 14), P(wy + 20)], fill=col)
                dr.line([P(wx + 7), P(wy), P(wx + 7), P(wy + 20)], fill=HOUSE, width=S)

# ---------------------------------------------------------------- the firehouse (gouache: brick, limestone trim, recessed lit windows)
FX0, FX1, FTOP = 452, 892, 196
LB0, LB1, BT = FX0 + 22, FX0 + 212, 346
RB0, RB1 = FX0 + 236, FX1 - 22
img = np.asarray(pil).astype(np.float32)


def R(x0, y0, x1, y1):
    return (xx >= x0) & (xx < x1) & (yy >= y0) & (yy < y1)


def paint(m, col, val=None):
    global img
    v = np.broadcast_to(C(col) if isinstance(col, str) else np.array(col, np.float32), (h, w, 3)) if val is None else val
    img = np.where(m[..., None], v, img)


def vgrad(c0, c1, y0, y1):
    return mix(np.broadcast_to(C(c0), (h, w, 3)), np.broadcast_to(C(c1), (h, w, 3)), (yy - y0) / max(y1 - y0, 1))


def mult(m, f):
    global img
    f = np.broadcast_to(np.asarray(f, np.float32), (h, w))
    img = np.where(m[..., None], img * f[..., None], img)


tex = noise(4, 40, 101)          # fine surface tooth
tex2 = noise(3, 9, 102)          # broad weathering
# brick field, running bond 16 x 6 with lighter recessed mortar
row = np.floor((yy - FTOP) / 6.0)
bx = np.floor((xx - FX0 + (row % 2) * 8) / 16.0)
hsh = (np.sin(row * 12.9898 + bx * 78.233) * 43758.5453) % 1.0
pal = np.stack([C('#8c3c27'), C('#7a3121'), C('#9b4b31'), C('#6a2a1c'), C('#87452f')])
bcol = pal[np.minimum((hsh * 5).astype(int), 4)] * (0.92 + 0.16 * tex[..., None])
my = (yy - FTOP) % 6.0
mxp = (xx - FX0 + (row % 2) * 8) % 16.0
mort = (my < 1.1) | (mxp < 1.1)
bcol = np.where(mort[..., None], C('#6d5a4e')[None, None, :] * (0.9 + 0.2 * tex[..., None]), bcol)
bcol = np.where(((my >= 1.1) & (my < 1.9) & ~mort)[..., None], bcol * 0.8, bcol)      # shadow under each course
bcol *= (0.86 + 0.18 * tex2[..., None])
soot = 0.62 + 0.38 * np.clip((yy - FTOP) / 150, 0, 1)
bcol *= soot[..., None]
cool = np.exp(-np.clip(yy - FTOP, 0, None) / 70)[..., None] * 0.22                    # aurora light on the upper wall
bcol = bcol * (1 - cool) + C('#3d8f9a') * cool
paint(R(FX0, FTOP, FX1, HORIZON + 4), None, bcol)

STONE = vgrad('#cdbf9f', '#b9a987', 0, 1) * 0 + C('#c9bb9b')
stone = C('#c9bb9b')[None, None, :] * (0.9 + 0.14 * tex[..., None]) * (0.92 + 0.12 * tex2[..., None])
stone_cool = stone * (1 - cool) + C('#7fc0c0') * cool


def stoneblock(x0, y0, x1, y1, lit_top=True):
    m = R(x0, y0, x1, y1)
    paint(m, None, stone_cool)
    mult(R(x0, y1 - 2, x1, y1), 0.62)          # bottom edge in shade
    mult(R(x1 - 2, y0, x1, y1), 0.78)
    if lit_top:
        mult(R(x0, y0, x1, y0 + 1.5), 1.18)


# quoins
for side in (0, 1):
    for k, y0 in enumerate(np.arange(FTOP + 8, 316, 13)):
        wq = 22 if k % 2 == 0 else 14
        x0 = FX0 if side == 0 else FX1 - wq
        stoneblock(x0, y0, x0 + wq, y0 + 11)
# cornice: projecting, rim lit by the aurora, dentils, cast shadow
mult(R(FX0, FTOP + 6, FX1, FTOP + 30), np.clip(0.45 + 0.55 * (yy - (FTOP + 6)) / 24, 0, 1))
paint(R(FX0 - 14, FTOP - 18, FX1 + 14, FTOP - 6), None, stone_cool * 0.95)
paint(R(FX0 - 14, FTOP - 20, FX1 + 14, FTOP - 17), '#a8e0d6')
paint(R(FX0 - 8, FTOP - 6, FX1 + 8, FTOP + 2), None, stone_cool * 0.7)
for dx in np.arange(FX0 - 4, FX1 + 4, 10):
    paint(R(dx, FTOP + 2, dx + 5, FTOP + 8), None, stone_cool * 0.82)
    mult(R(dx + 5, FTOP + 2, dx + 7, FTOP + 8), 0.5)
# parapet
paint(R(FX0 - 4, FTOP - 34, FX1 + 4, FTOP - 20), None, bcol * 0.7)
paint(R(FX0 - 6, FTOP - 38, FX1 + 6, FTOP - 34), '#9fd2cc')
# upper floor: four recessed double-hung windows with segmental lintels and keystones
for i in range(4):
    wx, ww, wy0, wy1 = FX0 + 46 + i * 96, 56, 238, 306
    stoneblock(wx - 6, wy0 - 14, wx + ww + 6, wy0 - 2)
    stoneblock(wx + ww / 2 - 6, wy0 - 18, wx + ww / 2 + 6, wy0)
    inner = R(wx, wy0, wx + ww, wy1)
    glow = vgrad('#e8964a', '#ffd896', wy0, wy1)
    hot = np.exp(-(((xx - (wx + ww / 2)) / 18) ** 2 + ((yy - (wy0 + 12)) / 14) ** 2))[..., None]
    paint(inner, None, glow + hot * C('#fff1c8') * 0.5)
    if i == 1:   # a fireman at the window, watching the sky
        fx = wx + ww * 0.62
        head = ((xx - fx) / 7) ** 2 + ((yy - (wy0 + 30)) / 8.5) ** 2 < 1
        sh = ((xx - fx) / 19) ** 2 + ((yy - (wy1 + 6)) / 30) ** 2 < 1
        paint((head | sh) & inner, '#3a2218')
    if i == 3:   # blind half down
        paint(R(wx, wy0, wx + ww, wy0 + 26), None, vgrad('#d9a45e', '#f0c27c', wy0, wy0 + 26))
        mult(R(wx, wy0 + 24, wx + ww, wy0 + 26), 0.6)
    mult(R(wx, wy0, wx + ww, wy0 + 4), 0.45)            # reveal shadows
    mult(R(wx, wy0, wx + 4, wy1), 0.55)
    paint(R(wx + ww / 2 - 1, wy0, wx + ww / 2 + 1, wy1), '#3b2016')
    paint(R(wx, (wy0 + wy1) / 2 - 1.5, wx + ww, (wy0 + wy1) / 2 + 1.5), '#3b2016')
    paint(R(wx, wy0 + 17, wx + ww, wy0 + 18), '#4a2a1c')
    paint(R(wx, wy1 - 17, wx + ww, wy1 - 16), '#4a2a1c')
    stoneblock(wx - 8, wy1, wx + ww + 8, wy1 + 6)
    mult(R(wx - 6, wy1 + 6, wx + ww + 6, wy1 + 14), np.clip(0.5 + 0.5 * (yy - (wy1 + 6)) / 8, 0, 1))
# string course with a carved panel over the bays
stoneblock(FX0, 316, FX1, 330)
mult(R(FX0, 330, FX1, 338), np.clip(0.5 + 0.5 * (yy - 330) / 8, 0, 1))
# rusticated piers
for px0, px1 in ((FX0, FX0 + 22), (FX0 + 212, FX0 + 236), (FX1 - 22, FX1)):
    for y0 in np.arange(334, HORIZON + 2, 14):
        stoneblock(px0, y0, px1, min(y0 + 12, HORIZON + 4))
stoneblock(LB0, BT - 12, RB1, BT)
for x0, x1 in ((LB0 + 30, LB1 - 30), (RB0 + 30, RB1 - 30)):
    mult(R(x0, BT - 9, x1, BT - 3), 0.8)
# left bay, open: warm interior, hanging lamp, gear on the back wall, engine nosed out
paint(R(LB0, BT, LB1, HORIZON + 4), None, vgrad('#4d3322', '#c9965a', BT, HORIZON + 4))
lamp = np.exp(-(((xx - (LB0 + LB1) / 2) / 60) ** 2 + ((yy - (BT + 14)) / 26) ** 2))[..., None]
img = np.where(R(LB0, BT, LB1, HORIZON + 4)[..., None], img + lamp * C('#ffe0a0') * 0.75, img)
for k in range(6):   # turnout coats and helmets on hooks
    gx = LB0 + 14 + k * 30
    if 50 < gx - LB0 < 140:
        continue
    paint(R(gx, BT + 22, gx + 14, BT + 50), '#3a2a1e')
    paint(R(gx, BT + 40, gx + 14, BT + 43), '#d6b24a')
    paint(((xx - (gx + 7)) / 8) ** 2 + ((yy - (BT + 18)) / 5) ** 2 < 1, '#2a1c14')
mult(R(LB0, BT, LB1, BT + 10), 0.45)                     # rolled-up door
EX0, EX1, ET = LB0 + 34, LB1 - 34, 384
body = vgrad('#e2463a', '#7e1914', ET, HORIZON)
paint(R(EX0, ET, EX1, HORIZON - 2), None, body * (0.9 + 0.1 * tex[..., None]))
mult(R(EX0, ET, EX0 + 8, HORIZON - 2), 0.72); mult(R(EX1 - 8, ET, EX1, HORIZON - 2), 0.72)
paint(R(EX0 + 10, ET + 8, EX1 - 10, ET + 34), None, vgrad('#30384c', '#5c667c', ET + 8, ET + 34))
streakm = R(EX0 + 14, ET + 8, EX1 - 10, ET + 34) & (np.abs((xx - EX0) - (yy - ET) * 1.2 - 40) < 6)
img = np.where(streakm[..., None], img * 0.6 + C('#c8d4e2') * 0.4, img)
paint(R((EX0 + EX1) / 2 - 1.5, ET + 8, (EX0 + EX1) / 2 + 1.5, ET + 34), '#9a1c16')
paint(R(EX0 + 40, ET + 44, EX1 - 40, ET + 70), None, vgrad('#f0f0ea', '#8d8f92', ET + 44, ET + 70))
for k in range(7):
    gx = EX0 + 43 + k * (EX1 - EX0 - 86) / 6.0
    paint(R(gx, ET + 45, gx + 1.5, ET + 69), '#55585e')
paint(R(EX0 - 6, HORIZON - 12, EX1 + 6, HORIZON - 2), None, vgrad('#ffffff', '#6b6e74', HORIZON - 12, HORIZON - 2))
for lx in (EX0 + 17, EX1 - 17):
    hl = ((xx - lx) / 9) ** 2 + ((yy - (ET + 56)) / 9) ** 2
    paint(hl < 1, '#fff6d8'); paint((hl >= 1) & (hl < 1.5), '#9a9ca0')
paint(R(EX0 + 28, ET - 8, EX1 - 28, ET), None, vgrad('#ff5a44', '#a0201a', ET - 8, ET))
# right bay: paneled wooden doors with a row of lit glass
paint(R(RB0, BT, RB1, HORIZON + 4), None, vgrad('#8a2a22', '#5e1a16', BT, HORIZON + 4) * (0.9 + 0.12 * tex2[..., None]))
mid = (RB0 + RB1) / 2
paint(R(mid - 1.5, BT, mid + 1.5, HORIZON + 4), '#3a100c')
for leaf0, leaf1 in ((RB0, mid), (mid, RB1)):
    n = 4; pw = (leaf1 - leaf0 - 10) / n
    for k in range(n):
        gx0 = leaf0 + 5 + k * pw
        paint(R(gx0 + 2, BT + 10, gx0 + pw - 2, BT + 32), None, vgrad('#ffcf86', '#f0a050', BT + 10, BT + 32))
        mult(R(gx0 + 2, BT + 10, gx0 + pw - 2, BT + 13), 0.6)
        for py0, py1 in ((BT + 42, BT + 82), (BT + 90, HORIZON - 6)):
            mult(R(gx0 + 2, py0, gx0 + pw - 2, py0 + 2), 1.35)
            mult(R(gx0 + 2, py0, gx0 + 4, py1), 1.25)
            mult(R(gx0 + 2, py1 - 2, gx0 + pw - 2, py1), 0.55)
            mult(R(gx0 + pw - 4, py0, gx0 + pw - 2, py1), 0.6)
img = np.clip(img, 0, 255)
pil = Image.fromarray(img.astype(np.uint8))
dr = ImageDraw.Draw(pil)
# globe lamps on the piers
for lx in (FX0 + 11, FX0 + 224, FX1 - 11):
    dr.line([P(lx), P(344), P(lx), P(352)], fill=(30, 26, 24), width=2 * S)
    dr.ellipse([P(lx - 6), P(350), P(lx + 6), P(362)], fill=(255, 240, 205))
LAMPS = [(FX0 + 11, 356), (FX0 + 224, 356), (FX1 - 11, 356)]

# ham radio aerial on the roof: mast, beam elements, guy wires
MX = FX1 - 92
RT = FTOP - 38
dr.line([P(MX), P(RT), P(MX), P(RT - 100)], fill=(14, 18, 34), width=3 * S)
for k, hw in enumerate((58, 46, 40)):
    yk = RT - 94 + k * 14
    dr.line([P(MX - hw), P(yk), P(MX + hw), P(yk)], fill=(14, 18, 34), width=2 * S)
for gx in (MX - 70, MX + 62):
    dr.line([P(MX), P(RT - 76), P(gx), P(RT)], fill=(40, 46, 70), width=S)
dr.line([P(FX0 + 30), P(RT), P(FX0 + 30), P(RT - 44)], fill=(14, 18, 34), width=2 * S)
pts = [(P(FX0 + 30 + (MX - FX0 - 30) * s), P(RT - 44 + 6 * s + 10 * math.sin(math.pi * s))) for s in np.linspace(0, 1, 30)]
dr.line(pts, fill=(28, 34, 58), width=S)
dr.line([P(FX0 + 120), P(RT), P(FX0 + 120), P(RT - 50)], fill=(30, 36, 60), width=S * 2)

# ---------------------------------------------------------------- street, sidewalk, light spill, streetlamp, hydrant
img = np.asarray(pil).astype(np.float32)
road = (yy > HORIZON + 4)
street = mix(np.broadcast_to(C('#3a3f52'), (h, w, 3)), np.broadcast_to(C('#1c2134'), (h, w, 3)), (yy - HORIZON) / (CH - HORIZON))
side = (yy > HORIZON + 4) & (yy < HORIZON + 26)
street = np.where(side[..., None], C('#6c6a72')[None, None, :] * (0.9 + 0.1 * noise(3, 30, 9)[..., None]), street)
img = np.where(road[..., None], street, img)
# light spill from the open bay, a trapezoid widening toward the viewer
cx = (LB0 + LB1) / 2
spread = (LB1 - LB0) / 2 + (yy - HORIZON) * 0.9
spill = np.clip(1 - np.abs(xx - cx) / np.maximum(spread, 1), 0, 1) * np.clip(1 - (yy - HORIZON) / 120, 0, 1) * road
img += spill[..., None] ** 1.3 * C('#ffcf86') * 0.55
# streetlamp on the left with a soft halo
LX, LY = 330, 300
halo = np.exp(-(((xx - LX) ** 2 + (yy - LY) ** 2) / (2 * 60 ** 2)))
img += halo[..., None] * C('#ffd59a') * 0.32
for (gx, gy) in LAMPS:
    img += np.exp(-(((xx - gx) ** 2 + (yy - gy) ** 2) / (2 * 16 ** 2)))[..., None] * C('#ffd9a0') * 0.45
pool = np.exp(-(((xx - LX) / 120) ** 2 + ((yy - (HORIZON + 40)) / 30) ** 2)) * road
img += pool[..., None] * C('#ffd59a') * 0.35
img = np.clip(img, 0, 255)
pil = Image.fromarray(img.astype(np.uint8))
dr = ImageDraw.Draw(pil)
dr.line([P(LX), P(LY + 6), P(LX), P(HORIZON + 22)], fill=(26, 30, 46), width=4 * S)
dr.line([P(LX), P(LY + 6), P(LX + 26), P(LY - 4)], fill=(26, 30, 46), width=3 * S)
dr.ellipse([P(LX - 8), P(LY - 6), P(LX + 8), P(LY + 8)], fill=(255, 236, 190))
# hydrant at the curb
HX = 404
dr.rectangle([P(HX - 7), P(HORIZON + 2), P(HX + 7), P(HORIZON + 22)], fill=(200, 60, 36))
dr.pieslice([P(HX - 8), P(HORIZON - 6), P(HX + 8), P(HORIZON + 10)], 180, 360, fill=(200, 60, 36))
dr.rectangle([P(HX - 12), P(HORIZON + 8), P(HX + 12), P(HORIZON + 12)], fill=(176, 50, 30))
# curb line
dr.line([P(0), P(HORIZON + 26), P(CW), P(HORIZON + 26)], fill=(40, 42, 56), width=2 * S)

# ---------------------------------------------------------------- light: facade falloff, bloom, wet street reflection
img = np.asarray(pil).astype(np.float32)
fac = (xx >= FX0 - 10) & (xx < FX1 + 10) & (yy >= FTOP - 14) & (yy < HORIZON + 4)
lum = img.mean(axis=2)
lit = np.clip((lum - 170) / 60, 0, 1) * (img[..., 0] > img[..., 2])           # warm lit areas only
spillmap = ndimage.gaussian_filter(lit, 26 * S)
spillmap /= spillmap.max() + 1e-6
dark = 0.62 + 0.38 * np.clip((yy - FTOP) / (HORIZON - FTOP), 0, 1) ** 0.7
facade_l = np.clip(dark + spillmap * 0.55, 0, 1.25)
img = np.where(fac[..., None] & (lit[..., None] < 0.5), img * (0.55 + 0.45 * facade_l)[..., None], img)
under = np.exp(-np.clip(yy - (FTOP + 19), 0, None) / 10) * (yy > FTOP + 19) * fac        # shadow under the cornice
img *= (1 - 0.35 * under)[..., None]
bay = (xx > LB0) & (xx < LB1) & (yy > BT) & (yy < HORIZON + 4)
img = np.where(bay[..., None], img * (0.7 + 0.3 * np.clip((yy - BT) / (HORIZON - BT), 0, 1))[..., None], img)
bloom = ndimage.gaussian_filter(np.clip(lum - 175, 0, None) / 80, (10 * S, 10 * S))
img += bloom[..., None] * C('#ffc27a') * 0.5
# wet street: mirror the scene below the curb, smeared down the road
cut = P(HORIZON + 27)
src = img[:cut][::-1]
n = min(h - cut, src.shape[0])
refl = ndimage.gaussian_filter(src[:n], (14 * S, 2 * S, 0))
fade = np.clip(1 - np.arange(n) / (n * 0.9), 0, 1)[:, None, None] * 0.32
img[cut:cut + n] = img[cut:cut + n] * (1 - fade) + refl * fade
img = np.clip(img, 0, 255)
pil = Image.fromarray(img.astype(np.uint8))

# ---------------------------------------------------------------- painterly finish: soften, mottle, fine brush grain
g = pil.filter(ImageFilter.MedianFilter(5))
pil = Image.blend(pil, g, 0.55).filter(ImageFilter.GaussianBlur(0.8))
img = np.asarray(pil).astype(np.float32)
mott = noise(5, 6, 77)[..., None] * 10 + noise(2, 120, 78)[..., None] * 4
streak = np.asarray(Image.fromarray(rng.standard_normal((h // 6, w)).astype(np.float32), 'F').resize((w, h), Image.BICUBIC))[..., None] * 3
img = np.clip(img + mott + streak, 0, 255)
vign = 1 - 0.18 * (((xx - CW / 2) / (CW / 2)) ** 2)
img *= vign[..., None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(D, 'assets', 'firehouse-dusk.jpg'), quality=92)
print('painted')
