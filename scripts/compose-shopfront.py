import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SP = 'scratchpad/'  # folder holding gv-master.png (Galaxy Video master logo export) and fonts
REPO = '/home/claude/movie-night-spinner/'
rng = np.random.default_rng(7)

photo = np.asarray(Image.open(REPO + 'assets/hero/shopfront.webp').convert('RGB')).astype(np.float32) / 255
H0, W = photo.shape[:2]
EXT = 170
H = H0 + EXT

# ---- 1. extend the night sky upward, matching the photo's sky colour and near-zero grain
sky_top = photo[0:24].mean(axis=(0, 1))
canvas = np.zeros((H, W, 3), np.float32)
t = np.linspace(0, 1, EXT)[:, None, None]
canvas[:EXT] = sky_top * (0.72 + 0.28 * t)
canvas[:EXT] += rng.normal(0, 1.1 / 255, (EXT, W, 3))
canvas[EXT:] = photo
# soften the old crop line
for i in range(10):
    a = (i + 1) / 11
    canvas[EXT - 5 + i] = canvas[EXT - 6] * (1 - a) + canvas[EXT + 4] * a

PY0, PY1, PX0, PX1 = 52 + EXT, 158 + EXT, 92, 1688   # fascia panel

def smooth_noise(h, w, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale))).astype(np.float32)
    return np.asarray(Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)).astype(np.float32) / 255

# ---- 2. faded red vinyl lettering on the lit panel (translucent film, so multiply)
FONT = SP + 'logo/node_modules/@fontsource/archivo-black/files/archivo-black-latin-400-normal.woff'
def vinyl(text, cx, size, seed):
    f = ImageFont.truetype(FONT, size)
    l, tp, r, b = f.getbbox(text)
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    d.text((cx - (r - l) / 2 - l, (PY0 + PY1) / 2 - (b + tp) / 2 + 2), text, font=f, fill=255)
    a = np.asarray(m).astype(np.float32) / 255
    # sun-faded film: even fade, crisp edges, a few chips peeled off
    chips = Image.new('L', (W, H), 0); cd = ImageDraw.Draw(chips); r = np.random.default_rng(seed)
    ys, xs = np.nonzero(a > 0.5)
    for i in r.choice(len(xs), 9, replace=False):
        x, y, s_ = xs[i], ys[i], r.uniform(3, 9) * r.uniform(0.5, 2.0)
        cd.polygon([(x, y), (x + s_, y + r.uniform(-3, 3)), (x + r.uniform(-2, 4), y + s_)], fill=255)
    a *= 1 - np.asarray(chips).astype(np.float32) / 255
    a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32) / 255
    return a * 0.85
mask = np.maximum(vinyl('NEW RELEASES', (PX0 + 668) / 2, 37, 11), vinyl('WEEKLYS · OPEN 7 DAYS', (1108 + PX1) / 2 - 6, 37, 12))
ink = np.array([0.80, 0.42, 0.30], np.float32)   # sun-faded red film
canvas = canvas * (1 - mask[..., None] * (1 - ink))

# ---- 3. the sign cabinet face: master logo, weathered like 30 years on a highway
logo = np.asarray(Image.open(SP + 'gv-master.png').convert('RGB')).astype(np.float32) / 255
FW, FH, FR = 396, 264, 16
face = np.asarray(Image.fromarray((logo * 255).astype(np.uint8)).resize((FW, FH), Image.LANCZOS)).astype(np.float32) / 255
lum = face.mean(2, keepdims=True)
face = face * 0.68 + lum * 0.32                          # sun-faded saturation
face = (face - 0.5) * 0.8 + 0.5                           # flatter, like old acrylic
face = face * np.array([1.0, 0.95, 0.82]) + np.array([0.035, 0.022, 0.0])  # yellowed acrylic
face = face * np.array([1.0, 0.91, 0.80])                # warm fluoro behind the face
face = np.maximum(face, np.array([0.14, 0.10, 0.18]) + face * 0.25)   # backlit, blacks never true black
face = face * (1 - 0.15 * np.clip((v_ := np.mgrid[0:FH, 0:FW][0].astype(np.float32) / FH) - 0.8, 0, 1)[..., None] / 0.2)
yy, xx = np.mgrid[0:FH, 0:FW].astype(np.float32)
u, v = xx / FW, yy / FH
light = 1.26 - 0.34 * np.clip((u - 0.62) / 0.38, 0, 1) ** 1.4      # tired tube on the right
light *= 0.90 + sum(0.24 * np.exp(-((v - vk) / 0.075) ** 2) for vk in (0.17, 0.5, 0.83))   # three tubes behind the face
light *= 1 + 0.05 * np.exp(-((u - 0.5) / 0.35) ** 2)
edge = np.minimum.reduce([u, 1 - u, v * 1.2, (1 - v) * 0.8]) * 7
grime = 0.62 + 0.38 * np.clip(edge, 0, 1)
dirt = 1 - 0.10 * smooth_noise(FH, FW, 9, 3) - 0.05 * (smooth_noise(FH, FW, 2, 4) > 0.9)
face = face * (light * grime * dirt)[..., None]
# screen-printed acrylic: ink laid down unevenly, so colour mottles in big soft patches
mott = np.stack([smooth_noise(FH, FW, 18, 20 + c) for c in range(3)], 2)
face = face * (0.93 + 0.14 * mott)
# light bleeding through thin spots in the dark ink, worst where the tubes sit
lum2 = face.mean(2, keepdims=True)
thin = smooth_noise(FH, FW, 12, 31) ** 2 * 0.6 + smooth_noise(FH, FW, 4, 32) ** 3 * 0.4
bleed = np.clip(1 - lum2 / 0.32, 0, 1) * thin[..., None] * (light[..., None] - 0.8) * 0.28
face = face + bleed * np.array([0.95, 0.72, 1.0])
face = face * (1 - (1 - grime)[..., None] * np.array([0, 0.12, 0.3]))   # brown, not grey
# dead bugs settled along the bottom edge
bugs = Image.new('L', (FW, FH), 0); bd = ImageDraw.Draw(bugs)
for _ in range(7):
    x = rng.uniform(14, 70); y = FH - rng.uniform(4, 14); s = rng.uniform(1.0, 2.2)
    bd.ellipse((x, y, x + s * 1.6, y + s), fill=int(rng.uniform(120, 200)))
bugs = np.asarray(bugs.filter(ImageFilter.GaussianBlur(0.6))).astype(np.float32)[..., None] / 255
face = face * (1 - bugs * 0.75)
sheen = np.clip(1 - np.abs((u * 0.6 + v) - 0.35) * 6, 0, 1) * 0.05
face = face + sheen[..., None]
face = np.clip(face, 0, 1)
face = np.asarray(Image.fromarray((face * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))).astype(np.float32) / 255
face = np.clip(face + rng.normal(0, 2 / 255, face.shape), 0, 1)

OW, OH = FW + 2 * FR, FH + 2 * FR
CX = 887
BOTTOM = 150 + EXT
X0, Y0 = int(CX - OW / 2), int(BOTTOM - OH)

# ---- 3b. steel structure: two posts poking out the top and kicker braces back to the roof
ROOF = 207 + 0   # parapet cap in the extended canvas
SS = 4
st = Image.new('L', (W * SS, H * SS), 0); sd = ImageDraw.Draw(st)
hl = Image.new('L', (W * SS, H * SS), 0); hd = ImageDraw.Draw(hl)
for px_ in (X0 + 74, X0 + OW - 74):
    sd.rectangle(((px_ - 5) * SS, (Y0 - 16) * SS, (px_ + 5) * SS, (Y0 + 40) * SS), fill=255)
    sd.rectangle(((px_ - 7) * SS, (Y0 - 18) * SS, (px_ + 7) * SS, (Y0 - 14) * SS), fill=255)   # cap plate
    hd.rectangle(((px_ - 7) * SS, (Y0 - 18) * SS, (px_ + 7) * SS, (Y0 - 17) * SS), fill=255)
for side in (-1, 1):
    ax = X0 + 8 if side < 0 else X0 + OW - 8
    for (y_top, dx_, w_) in ((Y0 + 70, 58, 10), (Y0 + 150, 34, 8)):
        bx = ax + side * dx_
        sd.line((ax * SS, y_top * SS, bx * SS, (ROOF + 3) * SS), fill=255, width=w_ * SS)
        hd.line((ax * SS, (y_top - 2) * SS, bx * SS, (ROOF + 1) * SS), fill=200, width=2 * SS)
    sd.rectangle(((ax + side * 64 - 6) * SS, (ROOF - 2) * SS, (ax + side * 64 + 6) * SS, (ROOF + 4) * SS), fill=255)   # base plate
st = np.asarray(st.resize((W, H), Image.LANCZOS)).astype(np.float32)[..., None] / 255
hl = np.asarray(hl.resize((W, H), Image.LANCZOS)).astype(np.float32)[..., None] / 255
steel = np.array([0.075, 0.07, 0.078]) * (0.85 + 0.3 * smooth_noise(H, W, 6, 41))[..., None]
canvas = canvas * (1 - st) + steel * st
canvas = canvas + hl * st * np.array([0.26, 0.21, 0.30])

# ---- 4. glow: the face lights the sky above and the fascia around it, then spills on the wet car park
glow = np.zeros((H, W, 3), np.float32)
glow[Y0 + FR:Y0 + FR + FH, X0 + FR:X0 + FR + FW] = np.clip(face.mean(2, keepdims=True) * 1.8, 0, 1) * np.array([0.69, 0.55, 1.0])
g = np.asarray(Image.fromarray((glow * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(25))).astype(np.float32) / 255
canvas = 1 - (1 - canvas) * (1 - g * 0.42)
g2 = np.asarray(Image.fromarray((glow * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(70))).astype(np.float32) / 255
canvas = 1 - (1 - canvas) * (1 - g2 * 0.30)
# the sign lights the parapet cap and the fascia either side of it, falling off with distance
dx = np.abs(np.arange(W) - CX) - OW / 2
fall = np.exp(-(np.clip(dx, 0, None) / 150.0) ** 2)[None, :]
ys_ = np.arange(H)[:, None]
cap = np.exp(-((ys_ - (ROOF + 6)) / 9.0) ** 2) * fall
side = ((ys_ >= ROOF) & (ys_ < PY1 + 30)) * fall * np.exp(-np.clip(ys_ - ROOF, 0, None) / 90.0)
lightcol = np.array([0.80, 0.62, 1.0])
canvas = canvas * (1 + (side * 0.55)[..., None] * lightcol) + (cap * 0.20)[..., None] * lightcol
# reflection on the wet asphalt: only where it is already shiny
wet = canvas[EXT + 690:H].mean(2, keepdims=True)
shine = np.clip((wet - 0.10) * 3, 0, 1)
col = face.mean(axis=(0, 1)) * 1.6
ry = np.linspace(0, 1, H - (EXT + 690))[:, None]
rx = np.exp(-((np.arange(W) - CX) / 120.0) ** 2)[None, :]
refl = (rx * (0.35 + 0.65 * ry))[..., None] * col * shine * 0.22
canvas[EXT + 690:] = 1 - (1 - canvas[EXT + 690:]) * (1 - refl)

# ---- 5. cabinet frame: oxidised aluminium, silhouetted against the lit fascia behind it
fy, fx = np.mgrid[0:OH, 0:OW].astype(np.float32)
frame = np.zeros((OH, OW, 3), np.float32)
base = 0.20 + 0.10 * (fy / OH)
frame[:] = (base[..., None] * np.array([1.0, 0.97, 0.92]))
# bevel: lighter outer top-left edge, darker inner lip
outer = (np.minimum.reduce([fx, OW - 1 - fx, fy, OH - 1 - fy]) < 2)
frame[outer] = frame[outer] * 1.55
inner = (np.minimum.reduce([fx - FR, OW - 1 - FR - fx, fy - FR, OH - 1 - FR - fy]) > -3)
frame[inner] *= 0.55
# rim light where the lit panel behind wraps the lower sides
behind = (fy + Y0 >= PY0).astype(np.float32)
rim = ((fx < 2) | (fx > OW - 3)) * behind
frame += (rim[..., None] * np.array([0.30, 0.24, 0.12]))
frame *= (1 - 0.18 * smooth_noise(OH, OW, 5, 9))[..., None]
frame *= (0.85 + 0.25 * (fx / OW))[..., None] ** 0.5 * (0.8 + 0.2 * (fy / OH))[..., None]
frame[0:3] *= 1.25
frame[OH - 6:] *= 0.6
frame[:, OW - 6:] *= 0.6
for sx, l in ((5, 30), (OW - 9, 38), (FR + 60, 18), (OW - FR - 90, 22)):
    for k in range(l):
        a_ = 0.55 * (1 - k / l)
        yk = OH - FR + 2 + k if sx in (FR + 60, OW - FR - 90) else 6 + k
        if 0 <= yk < OH:
            frame[yk, sx:sx + 2] = frame[yk, sx:sx + 2] * (1 - a_) + np.array([0.29, 0.20, 0.125]) * a_
# dents: little pressed-in dimples, dark on top, light below
for _ in range(9):
    dx0 = rng.uniform(4, OW - 4); dy0 = rng.choice([rng.uniform(2, FR - 2), rng.uniform(OH - FR + 2, OH - 2)])
    rr = rng.uniform(2, 4.5)
    d2 = ((fx - dx0) ** 2 + (fy - dy0) ** 2) / rr ** 2
    frame *= (1 - 0.35 * np.exp(-d2) * np.sign(dy0 - fy + 0.5).clip(0, 1) + 0.25 * np.exp(-d2) * np.sign(fy - dy0).clip(0, 1))[..., None]
frame[FR:FR + FH, FR:FR + FW] = face
# inner retainer lip catches the face light; face edge just inside sits in its shadow
lipw = np.zeros((OH, OW), np.float32)
ring = np.minimum.reduce([fx - FR, OW - 1 - FR - fx, fy - FR, OH - 1 - FR - fy])
frame[(ring >= -2) & (ring < -1)] = frame[(ring >= -2) & (ring < -1)] * 0.6 + np.array([0.42, 0.36, 0.40]) * 0.4
inshade = np.clip(1 - ring / 7, 0, 1) * (ring >= 0)
frame *= (1 - 0.35 * inshade)[..., None]
# silhouette: the bottom rail sags in the middle and the top rail is not dead straight
sag = (2.6 * np.sin(np.pi * np.arange(OW) / OW)).astype(np.float32)
wob = (smooth_noise(1, OW, 40, 50)[0] - 0.5) * 2.4
keep = (fy >= np.clip(wob, 0, None)[None, :]) & (fy <= OH - 1 - (2.6 - sag)[None, :] + 0)
# soft contact shadow on the panel around the lower half of the cabinet
sh = np.zeros((H, W), np.float32)
sh[max(Y0, PY0):Y0 + OH, X0:X0 + OW] = 1
sh[Y0 + OH:Y0 + OH + 12, X0 - 4:X0 + OW + 4] = 1
sh = np.asarray(Image.fromarray((sh * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(6))).astype(np.float32) / 255
panel_mask = np.zeros((H, W), np.float32); panel_mask[PY0:PY1, PX0:PX1] = 1
canvas *= (1 - 0.5 * sh * panel_mask)[..., None]
reg = canvas[Y0:Y0 + OH, X0:X0 + OW]
canvas[Y0:Y0 + OH, X0:X0 + OW] = np.where(keep[..., None], np.clip(frame, 0, 1), reg)
# underside of the cabinet, seen from the car park below: a thin dark return, lit faintly by the fascia
UD = 11
for i in range(UD):
    k = i / UD
    yrow = Y0 + OH + i - 3
    xs_ = np.arange(X0 + 3 + i // 2, X0 + OW - 3 - i // 2)
    ok = (yrow - Y0) > OH - 1 - (2.6 - sag[xs_ - X0])
    canvas[yrow, xs_[ok]] = np.array([0.07, 0.065, 0.06]) * (1 - k) + np.array([0.26, 0.21, 0.13]) * k

# ---- 6. one overall grade and grain so everything shares the same film
canvas = np.clip(canvas, 0, 1)
canvas += rng.normal(0, 1.4 / 255, canvas.shape)
out = Image.fromarray((np.clip(canvas, 0, 1) * 255).astype(np.uint8))
out.save(SP + 'galaxy-front-full.png')
for w in (1774, 1400, 1000):
    name = 'galaxy-front.webp' if w == 1774 else f'galaxy-front-{w}.webp'
    out.resize((w, round(w * H / W)), Image.LANCZOS).save(REPO + 'assets/hero/' + name, 'WEBP', quality=84)
print(out.size, 'cabinet', X0, Y0, OW, OH)
