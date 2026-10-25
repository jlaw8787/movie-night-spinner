"""Paints the cover's signature piece: an orange Staten Island ferry crossing the upper bay toward the
lower Manhattan skyline on a hazy morning, 1988 (twin towers in the skyline). Painted in PIL with layered
soft brushwork: sky wash, two haze layers of towers, a Battery tree line, rippled water, wake and reflections.
The top of the sky fades into the card's paper so the cover lettering sits on it. Output assets/ferry-cover.png (2x)."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1124, 1088
HZ = 560                                    # horizon / seawall line
rng = np.random.default_rng(1988)
PAPER = (243, 235, 225)

def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))
def blob_noise(w, h, cell, blur):
    n = rng.random((max(2, h // cell), max(2, w // cell)))
    return np.asarray(Image.fromarray((n * 255).astype('uint8')).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))) / 255.0

img = Image.new('RGB', (W, H))
px = np.zeros((H, W, 3), float)
# ---- sky: pale blue up top, warm peach haze at the horizon (morning sun low in the east, to the right)
top, mid, low = np.array((196, 214, 226)), np.array((226, 222, 214)), np.array((246, 214, 182))
for y in range(HZ):
    t = y / HZ
    c = top + (mid - top) * min(1, t / 0.55) if t < 0.55 else mid + (low - mid) * ((t - 0.55) / 0.45)
    px[y, :, :] = c
# sun glow, right side
yy, xx = np.mgrid[0:H, 0:W]
glow = np.exp(-(((xx - 930) / 330.0) ** 2 + ((yy - 470) / 210.0) ** 2))
px[:HZ] += (glow[:HZ, :, None] * np.array((30, 18, 2)))
# soft cloud bands
cl = blob_noise(W, HZ, 90, 26)
band = np.clip((cl - 0.45) * 2.2, 0, 1) * (np.linspace(0.2, 1, HZ)[:, None])
px[:HZ] = px[:HZ] * (1 - band[..., None] * 0.35) + np.array((252, 244, 234)) * band[..., None] * 0.35
img = Image.fromarray(np.clip(px, 0, 255).astype('uint8'))
d = ImageDraw.Draw(img, 'RGBA')

# ---- skyline: far layer (haze) then near layer, buildings as painted slabs
def tower(x, w, top_y, col, lit, win=True, crown=None, base=HZ):
    j = int(rng.integers(-10, 11)); col = tuple(int(max(0, min(255, c + j))) for c in col)
    for yy_ in range(int(top_y), base, 3):
        t = (yy_ - top_y) / max(1, base - top_y)
        d.rectangle((x, yy_, x + w, yy_ + 3), fill=lerp((col[0] + 26, col[1] + 24, col[2] + 20), col, min(1, t * 1.6)))
    # sunlit right face strip
    sw = max(3, int(w * 0.28))
    d.rectangle((x + w - sw, top_y, x + w, base), fill=lit)
    if crown == 'step':
        d.rectangle((x + w * 0.2, top_y - 18, x + w * 0.8, top_y), fill=col)
        d.rectangle((x + w * 0.35, top_y - 32, x + w * 0.65, top_y - 18), fill=col)
    if crown == 'spire':
        d.polygon([(x + w * 0.5 - 4, top_y), (x + w * 0.5 + 4, top_y), (x + w * 0.5, top_y - 60)], fill=col)
    if win:
        for wy in range(int(top_y) + 8, base - 6, 9):
            if rng.random() < 0.85:
                a = int(rng.integers(18, 46))
                d.line((x + 3, wy, x + w - sw - 2, wy), fill=(255, 250, 235, a), width=2)

far = (150, 160, 178); far_lit = (196, 190, 186)
for x, w, h in [(250, 46, 330), (300, 60, 300), (370, 40, 360), (420, 70, 280), (500, 52, 340), (560, 44, 300),
                (690, 64, 290), (760, 44, 350), (812, 74, 320), (900, 52, 270), (960, 80, 300), (1050, 70, 260)]:
    tower(x, w, HZ - h, far, far_lit, win=False)
# the twin towers, slightly nearer, tall and pale in the morning haze
for x in (596, 652):
    tower(x, 46, 120 if x == 596 else 132, (160, 168, 184), (214, 206, 198), win=False)
    for lx in range(x + 4, x + 34, 4):
        d.line((lx, 136, lx, HZ), fill=(120, 130, 150, 40), width=1)
d.rectangle((614, 92, 617, 120), fill=(160, 168, 184))          # antenna
img = img.filter(ImageFilter.GaussianBlur(1.6))
# haze veil over the far layer
veil = Image.new('RGBA', (W, H), (236, 222, 206, 70)); img.paste(veil, (0, 0), veil)
d = ImageDraw.Draw(img, 'RGBA')
near = (92, 98, 116); near_lit = (178, 150, 130)
for x, w, h, cr in [(232, 58, 210, 'step'), (296, 40, 250, None), (340, 76, 190, None), (420, 50, 270, 'spire'),
                    (476, 64, 200, None), (546, 40, 230, None), (700, 58, 215, 'step'), (762, 82, 180, None),
                    (850, 46, 240, None), (900, 70, 200, None), (976, 54, 170, None), (1034, 90, 150, None)]:
    tower(x, w, HZ - h, near, near_lit, crown=cr)
# Battery: seawall and a dark band of trees along the water
trees = Image.new('L', (W, H), 0); td = ImageDraw.Draw(trees)
for i in range(260):
    x = rng.uniform(200, W); r = rng.uniform(10, 24)
    td.ellipse((x - r, HZ - 26 - r * 0.6, x + r, HZ - 4 + r * 0.2), fill=255)
trees = trees.filter(ImageFilter.GaussianBlur(2))
img.paste(Image.new('RGB', (W, H), (58, 74, 62)), (0, 0), trees)
d = ImageDraw.Draw(img, 'RGBA')
d.rectangle((180, HZ - 6, W, HZ + 2), fill=(118, 112, 104))
# far shore at left (Governors Island side), low and pale
d.polygon([(0, HZ), (0, HZ - 22), (90, HZ - 30), (210, HZ - 18), (260, HZ)], fill=(140, 150, 152))

# ---- water: deep blue-green below, lighter toward the horizon, painted with horizontal strokes
wpx = np.asarray(img).astype(float)
for y in range(HZ, H):
    t = (y - HZ) / (H - HZ)
    wpx[y, :, :] = np.array(lerp((180, 190, 192), (62, 92, 108), t ** 0.7))
img = Image.fromarray(wpx.astype('uint8'))
d = ImageDraw.Draw(img, 'RGBA')
# skyline reflections: soft vertical smears below the towers
refl = img.crop((0, HZ - 220, W, HZ)).transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(3))
refl = refl.resize((W, 160))
mask = Image.linear_gradient('L').resize((W, 160)).point(lambda v: int((255 - v) * 0.38))
img.paste(refl, (0, HZ), mask)
d = ImageDraw.Draw(img, 'RGBA')
# ripple strokes
for i in range(5200):
    y = HZ + (H - HZ) * (rng.random() ** 1.25)
    t = (y - HZ) / (H - HZ)
    L = rng.uniform(8, 30) + t * 70
    x = rng.uniform(-40, W)
    th = 1 + t * 3.2
    if rng.random() < 0.5:
        c = (246, 226, 200, int(30 + 70 * (1 - t))) if rng.random() < 0.55 else (225, 235, 236, 60)
    else:
        c = (34, 58, 74, int(40 + 60 * t))
    d.ellipse((x, y, x + L, y + th), fill=c)
# sun glitter path on the right
for i in range(900):
    y = HZ + rng.uniform(4, 360)
    x = 930 + rng.normal(0, 40 + (y - HZ) * 0.35)
    L = rng.uniform(6, 24)
    d.ellipse((x, y, x + L, y + 2.2), fill=(255, 238, 206, int(rng.uniform(60, 150))))

# ---- the ferry: double-ended, orange, heading right toward the city
fx0, fx1, wl = 110, 760, 840           # bow/stern x, waterline y
hull_top = 760
def ferry(dr):
    # wake behind (left) and bow wave
    for i in range(700):
        t = rng.random() ** 0.7
        x = fx0 + 10 - t * 260 + rng.normal(0, 8)
        arm = 1 if rng.random() < 0.5 else -1
        y = wl - 4 + arm * t * 70 * 0.5 + t * 34 + rng.normal(0, 3 + 6 * t)
        L = rng.uniform(10, 40) * (1 - 0.5 * t)
        dr.ellipse((x, y, x + L, y + rng.uniform(2, 5)), fill=(250, 248, 240, int(rng.uniform(60, 180) * (1 - 0.7 * t))))
    for i in range(80):
        x = fx1 - rng.uniform(-10, 40); y = wl + rng.uniform(-4, 14)
        dr.ellipse((x, y, x + rng.uniform(10, 34), y + 4), fill=(250, 248, 240, int(rng.uniform(90, 190))))
    OR, OR_D, OR_L = (214, 96, 40), (160, 62, 26), (236, 136, 72)
    # hull: long, low, rounded ends, sheer line
    dr.polygon([(fx0, hull_top), (fx1, hull_top), (fx1 + 22, hull_top + 30), (fx1 - 16, wl), (fx0 + 18, wl), (fx0 - 22, hull_top + 30)], fill=OR)
    dr.polygon([(fx0 + 18, wl - 22), (fx1 - 16, wl - 22), (fx1 - 16, wl), (fx0 + 18, wl)], fill=OR_D)          # shadowed lower hull
    dr.line((fx0 - 20, hull_top + 6, fx1 + 20, hull_top + 6), fill=(250, 240, 226), width=4)                   # rub rail
    # main deck cabin, with window band
    c1t = 690
    dr.rectangle((fx0 + 30, c1t, fx1 - 30, hull_top), fill=OR)
    dr.rectangle((fx0 + 30, c1t, fx1 - 30, c1t + 6), fill=OR_L)
    for x in range(fx0 + 46, fx1 - 46, 26):
        dr.rectangle((x, c1t + 18, x + 17, c1t + 46), fill=(44, 46, 54))
        dr.rectangle((x + 2, c1t + 20, x + 7, c1t + 30), fill=(150, 170, 186, 120))
    # upper deck cabin
    c2t = 632
    dr.rectangle((fx0 + 70, c2t, fx1 - 70, c1t), fill=OR)
    dr.rectangle((fx0 + 70, c2t, fx1 - 70, c2t + 5), fill=OR_L)
    for x in range(fx0 + 84, fx1 - 84, 24):
        dr.rectangle((x, c2t + 16, x + 15, c2t + 40), fill=(44, 46, 54))
    dr.line((fx0 + 30, c1t - 1, fx1 - 30, c1t - 1), fill=(250, 240, 226), width=3)                            # deck rail
    # open deck rails on the upper deck ends
    for x in range(fx0 + 32, fx0 + 70, 7): dr.line((x, c1t - 16, x, c1t), fill=(250, 240, 226, 200), width=2)
    for x in range(fx1 - 70, fx1 - 30, 7): dr.line((x, c1t - 16, x, c1t), fill=(250, 240, 226, 200), width=2)
    dr.line((fx0 + 30, c1t - 16, fx0 + 70, c1t - 16), fill=(250, 240, 226), width=2)
    dr.line((fx1 - 70, c1t - 16, fx1 - 30, c1t - 16), fill=(250, 240, 226), width=2)
    # pilot houses at both ends
    for px0 in (fx0 + 80, fx1 - 160):
        dr.rectangle((px0, 590, px0 + 80, c2t), fill=OR)
        dr.rectangle((px0 - 6, 584, px0 + 86, 592), fill=(250, 240, 226))
        for x in range(px0 + 8, px0 + 76, 18): dr.rectangle((x, 600, x + 12, 620), fill=(44, 46, 54))
    # stack and mast amidships
    mx = (fx0 + fx1) // 2
    dr.rectangle((mx - 18, 560, mx + 18, c2t), fill=OR_D)
    dr.rectangle((mx - 18, 560, mx + 18, 570), fill=(36, 34, 36))
    dr.line((mx, 500, mx, 560), fill=(60, 56, 56), width=3)
    dr.line((mx - 26, 520, mx + 26, 520), fill=(60, 56, 56), width=2)

layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
ferry(ImageDraw.Draw(layer, 'RGBA'))
la = np.asarray(layer).astype(float)
yy2, xx2 = np.mgrid[0:H, 0:W]
shade = 1.08 - 0.28 * np.clip((yy2 - 560) / 280.0, 0, 1) + 0.10 * np.clip((xx2 - 110) / 650.0, 0, 1)
la[..., :3] *= shade[..., None]
la[..., :3] += rng.normal(0, 5, (H, W, 1))
layer = Image.fromarray(np.clip(la, 0, 255).astype('uint8'), 'RGBA').filter(ImageFilter.GaussianBlur(0.9))
img.paste(layer, (0, 0), layer)
d = ImageDraw.Draw(img, 'RGBA')
# the ferry's reflection, broken by ripples
rf = img.crop((fx0 - 30, 560, fx1 + 30, wl)).transpose(Image.FLIP_TOP_BOTTOM).filter(ImageFilter.GaussianBlur(4))
m = Image.new('L', rf.size, 0); md = ImageDraw.Draw(m)
for y in range(0, rf.size[1], 5):
    a = int(110 * (1 - y / rf.size[1]))
    md.rectangle((0, y, rf.size[0], y + 2), fill=a)
img.paste(rf, (fx0 - 30, wl + 2), m)
d = ImageDraw.Draw(img, 'RGBA')
# a few gulls
for gx, gy, s in [(860, 300, 14), (905, 330, 10), (300, 250, 12)]:
    d.arc((gx - s, gy - s / 2, gx, gy + s / 2), 200, 340, fill=(70, 70, 80), width=2)
    d.arc((gx, gy - s / 2, gx + s, gy + s / 2), 200, 340, fill=(70, 70, 80), width=2)

# ---- painterly finish: canvas tooth, gentle colour mottling, a touch of softness
arr = np.asarray(img).astype(float)
mot = blob_noise(W, H, 40, 12)[..., None]
arr = arr * (0.96 + 0.08 * mot)
tooth = rng.normal(0, 4.0, (H, W, 1))
arr = arr + tooth
img = Image.fromarray(np.clip(arr, 0, 255).astype('uint8'))
oil = img.filter(ImageFilter.ModeFilter(7)).filter(ImageFilter.GaussianBlur(0.6))
img = Image.blend(img, oil, 0.55).filter(ImageFilter.SMOOTH)
# fade the top of the sky into the paper
alpha = np.ones((H, W)) * 255
fade = 230
alpha[:fade] = (np.linspace(0, 1, fade) ** 1.4 * 255)[:, None]
paper = Image.new('RGB', (W, H), PAPER)
img = Image.composite(img, paper, Image.fromarray(alpha.astype('uint8')))
img.save(os.path.join(D, 'assets', 'ferry-cover.png'))
print('painted')
