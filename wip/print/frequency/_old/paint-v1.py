"""Paints the signature piece: the Queens firehouse at dusk, northern lights over the block,
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

# ---------------------------------------------------------------- the firehouse
FX0, FX1, FTOP = 452, 892, 196
img = np.asarray(pil).astype(np.float32)
fh = (xx >= FX0) & (xx < FX1) & (yy >= FTOP) & (yy < HORIZON + 6)
# brick: running bond, per-brick tint, mortar lines
row = np.floor((yy - FTOP) / 7.0)
bx = np.floor((xx - FX0 + (row % 2) * 9) / 18.0)
tint = (np.sin(row * 12.9898 + bx * 78.233) * 43758.5453) % 1.0
brick = C('#7c3422')[None, None, :] * (0.82 + 0.3 * tint[..., None])
mort = (((yy - FTOP) % 7.0) < 1.2) | (((xx - FX0 + (row % 2) * 9) % 18.0) < 1.2)
brick = np.where(mort[..., None], C('#4a2a22')[None, None, :], brick)
shade = 0.55 + 0.45 * np.clip((yy - FTOP) / (HORIZON - FTOP), 0, 1)      # darker up top at dusk
brick = brick * shade[..., None]
img = np.where(fh[..., None], brick, img)
pil = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
dr = ImageDraw.Draw(pil)

STONE, STONE_D = (196, 182, 156), (120, 108, 92)
# parapet and cornice
dr.rectangle([P(FX0 - 10), P(FTOP - 14), P(FX1 + 10), P(FTOP + 8)], fill=STONE)
dr.rectangle([P(FX0 - 10), P(FTOP + 8), P(FX1 + 10), P(FTOP + 12)], fill=STONE_D)
for dx in np.arange(FX0 - 4, FX1 + 6, 12):
    dr.rectangle([P(dx), P(FTOP + 12), P(dx + 6), P(FTOP + 19)], fill=STONE_D)
# string course between floors and stone lintel over the bays
dr.rectangle([P(FX0), P(318), P(FX1), P(328)], fill=STONE)
dr.rectangle([P(FX0), P(328), P(FX1), P(331)], fill=STONE_D)
# upper floor: four tall arched windows, warm light
for i in range(4):
    wx = FX0 + 42 + i * 98
    ww, wy0, wy1 = 58, 232, 306
    dr.rectangle([P(wx - 5), P(wy1), P(wx + ww + 5), P(wy1 + 6)], fill=STONE)
    dr.pieslice([P(wx - 4), P(wy0 - 33), P(wx + ww + 4), P(wy0 + 33)], 180, 360, fill=STONE)
    dr.rectangle([P(wx), P(wy0), P(wx + ww), P(wy1)], fill=(242, 178, 92))
    dr.pieslice([P(wx), P(wy0 - 29), P(wx + ww), P(wy0 + 29)], 180, 360, fill=(250, 200, 120))
    dr.line([P(wx + ww / 2), P(wy0 - 29), P(wx + ww / 2), P(wy1)], fill=(60, 34, 24), width=2 * S)
    dr.line([P(wx), P(wy0 + 22), P(wx + ww), P(wy0 + 22)], fill=(60, 34, 24), width=2 * S)
    dr.rectangle([P(wx), P(wy1 - 26), P(wx + ww), P(wy1)], fill=(214, 150, 82))   # lower sash, curtain
# ground floor piers
for px in (FX0, FX0 + 210, FX1 - 20):
    dr.rectangle([P(px), P(331), P(px + 20), P(HORIZON + 4)], fill=STONE)
    for k in range(5):
        dr.line([P(px), P(345 + k * 26), P(px + 20), P(345 + k * 26)], fill=STONE_D, width=S)
# left bay: open, engine nosed out in the light
LB0, LB1, BT = FX0 + 20, FX0 + 210, 344
dr.rectangle([P(LB0), P(BT), P(LB1), P(HORIZON + 4)], fill=(255, 214, 140))
dr.rectangle([P(LB0), P(BT), P(LB1), P(BT + 18)], fill=(150, 90, 52))       # rolled-up door
for k in range(4):
    dr.line([P(LB0), P(BT + 4 + k * 4), P(LB1), P(BT + 4 + k * 4)], fill=(110, 64, 38), width=S)
# fire engine (front view): cab, windshield, grille, bumper, lights
EX0, EX1 = LB0 + 26, LB1 - 26
dr.rectangle([P(EX0), P(382), P(EX1), P(HORIZON - 4)], fill=(196, 34, 30))
dr.rectangle([P(EX0 + 10), P(390), P(EX1 - 10), P(420)], fill=(64, 72, 88))         # windshield
dr.line([P((EX0 + EX1) / 2), P(390), P((EX0 + EX1) / 2), P(420)], fill=(196, 34, 30), width=3 * S)
dr.rectangle([P(EX0 + 42), P(430), P(EX1 - 42), P(456)], fill=(212, 214, 210))      # grille
for k in range(6):
    gx = EX0 + 46 + k * (EX1 - EX0 - 92) / 5.0
    dr.line([P(gx), P(431), P(gx), P(455)], fill=(150, 150, 150), width=S)
dr.rectangle([P(EX0 - 6), P(HORIZON - 12), P(EX1 + 6), P(HORIZON - 3)], fill=(220, 222, 220))   # bumper
for lx in (EX0 + 18, EX1 - 18):
    dr.ellipse([P(lx - 9), P(434), P(lx + 9), P(452)], fill=(255, 248, 220))
dr.rectangle([P(EX0 + 30), P(374), P(EX1 - 30), P(382)], fill=(220, 40, 34))       # light bar
dr.ellipse([P((EX0 + EX1) / 2 - 7), P(368), P((EX0 + EX1) / 2 + 7), P(380)], fill=(255, 90, 60))
# right bay: closed door with glass row
RB0, RB1 = FX0 + 230, FX1 - 20
dr.rectangle([P(RB0), P(BT), P(RB1), P(HORIZON + 4)], fill=(118, 30, 26))
for k in range(1, 6):
    yk = BT + k * (HORIZON - BT) / 6
    dr.line([P(RB0), P(yk), P(RB1), P(yk)], fill=(84, 22, 20), width=S)
for k in range(8):
    gx = RB0 + 8 + k * (RB1 - RB0 - 16) / 8
    dr.rectangle([P(gx + 2), P(BT + 28), P(gx + (RB1 - RB0 - 16) / 8 - 4), P(BT + 46)], fill=(244, 196, 120))
# house lamps either side of the bays
for lx in (FX0 + 205 - 10, FX1 - 26):
    pass

# ham radio aerial on the roof: mast, beam elements, guy wires
MX = FX1 - 92
dr.line([P(MX), P(FTOP - 14), P(MX), P(FTOP - 118)], fill=(14, 18, 34), width=3 * S)
for k, hw in enumerate((58, 46, 40)):
    yk = FTOP - 112 + k * 14
    dr.line([P(MX - hw), P(yk), P(MX + hw), P(yk)], fill=(14, 18, 34), width=2 * S)
dr.line([P(MX - 4), P(FTOP - 118), P(MX + 4), P(FTOP - 118)], fill=(14, 18, 34), width=2 * S)
for gx in (MX - 70, MX + 62):
    dr.line([P(MX), P(FTOP - 92), P(gx), P(FTOP - 14)], fill=(40, 46, 70), width=S)
# long wire dipole from the mast to a pole on the left of the roof
dr.line([P(FX0 + 30), P(FTOP - 14), P(FX0 + 30), P(FTOP - 62)], fill=(14, 18, 34), width=2 * S)
pts = [(P(FX0 + 30 + (MX - FX0 - 30) * s), P(FTOP - 62 - (FTOP - 70 - (FTOP - 62)) * s + 10 * math.sin(math.pi * s))) for s in np.linspace(0, 1, 30)]
dr.line(pts, fill=(28, 34, 58), width=S)
# flagpole
dr.line([P(FX0 + 120), P(FTOP - 14), P(FX0 + 120), P(FTOP - 70)], fill=(30, 36, 60), width=S * 2)

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
img = np.where(fac[..., None] & (lit[..., None] < 0.5), img * facade_l[..., None], img)
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
pil = pil.filter(ImageFilter.GaussianBlur(1.1))
img = np.asarray(pil).astype(np.float32)
mott = noise(5, 6, 77)[..., None] * 10 + noise(2, 120, 78)[..., None] * 4
streak = np.asarray(Image.fromarray(rng.standard_normal((h // 6, w)).astype(np.float32), 'F').resize((w, h), Image.BICUBIC))[..., None] * 3
img = np.clip(img + mott + streak, 0, 255)
vign = 1 - 0.18 * (((xx - CW / 2) / (CW / 2)) ** 2)
img *= vign[..., None]
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(os.path.join(D, 'assets', 'firehouse-dusk.jpg'), quality=92)
print('painted')
