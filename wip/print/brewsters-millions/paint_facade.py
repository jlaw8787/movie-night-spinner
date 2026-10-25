"""Paints the cover art for The Vandermeer in-suite dining card: the hotel's Fifth Avenue
front at dusk in gouache, limestone lit from the street, a long burgundy canopy with brass
poles, a red carpet to the curb, a black stretch limousine waiting and the park trees at
the right. Framed in a shallow arched window with a gold rule, all painted here so the page
needs no SVG or clip-path. Output: assets/facade-gouache.png at 2x (1376 x 640 for a
688 x 320 CSS box). Drawn at 4x and brought down, then given brush texture."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
CW, CH = 688, 320          # CSS box
K = 4                      # draw scale
w, h = CW * K, CH * K
rng = np.random.default_rng(1985)


def lowfreq(ny, nx, seed, W=w, H=h):
    g = np.random.default_rng(seed).standard_normal((ny, nx)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((W, H), Image.BICUBIC))


yy, xx = np.mgrid[0:h, 0:w].astype(np.float32) / K

# ---------- sky: plum overhead, warm rose low behind the roofline ----------
t = np.clip(yy / 120, 0, 1)[..., None]
sky = np.array([46, 30, 58]) * (1 - t) + np.array([196, 112, 112]) * t
t2 = np.clip((yy - 60) / 80, 0, 1)[..., None]
sky = sky * (1 - t2) + np.array([232, 158, 120]) * t2
img = Image.fromarray(sky.astype(np.uint8), 'RGB')
d = ImageDraw.Draw(img)


def R(x0, y0, x1, y1, fill):
    d.rectangle([x0 * K, y0 * K, x1 * K, y1 * K], fill=fill)


def P(pts, fill):
    d.polygon([(x * K, y * K) for x, y in pts], fill=fill)


def E(cx, cy, rx, ry, fill):
    d.ellipse([(cx - rx) * K, (cy - ry) * K, (cx + rx) * K, (cy + ry) * K], fill=fill)


# ---------- the neighbour to the left, darker brownstone ----------
R(-2, 70, 96, 300, (92, 62, 66))
for row in range(6):
    for col in range(3):
        x = 10 + col * 28; y = 86 + row * 30
        lit = rng.random() < 0.45
        R(x, y, x + 13, y + 18, (232, 186, 104) if lit else (54, 38, 50))
R(-2, 66, 96, 72, (70, 46, 52))

# ---------- the hotel ----------
BX0, BX1 = 96, 596
# mansard roof in weathered copper, with dormers
P([(BX0 + 6, 46), (BX0 + 22, 18), (BX1 - 22, 18), (BX1 - 6, 46)], (92, 124, 112))
P([(BX0 + 22, 18), (BX1 - 22, 18), (BX1 - 24, 22), (BX0 + 24, 22)], (120, 152, 138))
for i in range(9):
    x = BX0 + 52 + i * 50
    P([(x - 9, 44), (x - 9, 30), (x, 23), (x + 9, 30), (x + 9, 44)], (210, 190, 168))
    lit = i % 3 != 1
    R(x - 5, 31, x + 5, 43, (246, 206, 120) if lit else (60, 46, 62))
# flagpoles and gold house flags
for fx in (BX0 + 120, BX1 - 120):
    R(fx - 0.8, 9, fx + 0.8, 21, (70, 60, 60))
    P([(fx + 1, 10), (fx + 20, 11), (fx + 18, 14), (fx + 21, 18), (fx + 1, 18)], (214, 170, 82))
    P([(fx + 1, 15), (fx + 21, 18), (fx + 1, 18)], (176, 132, 60))
# limestone face, warmer toward the street lamps
face = Image.new('RGB', (w, h))
fy = np.clip((yy - 46) / 250, 0, 1)[..., None]
fcol = np.array([196, 164, 148]) * (1 - fy) + np.array([226, 196, 160]) * fy
face = Image.fromarray(fcol.astype(np.uint8), 'RGB')
m = Image.new('L', (w, h), 0)
ImageDraw.Draw(m).rectangle([BX0 * K, 46 * K, BX1 * K, 300 * K], fill=255)
img.paste(face, (0, 0), m)
d = ImageDraw.Draw(img)
# cornice and belt courses
R(BX0 - 4, 44, BX1 + 4, 50, (238, 216, 186)); R(BX0 - 4, 50, BX1 + 4, 53, (128, 104, 104))
R(BX0 - 2, 206, BX1 + 2, 212, (240, 220, 190)); R(BX0 - 2, 212, BX1 + 2, 215, (120, 96, 92))
# corner quoins
for side in (BX0, BX1 - 14):
    for i in range(8):
        y = 56 + i * 19
        R(side, y, side + 14, y + 15, (206, 178, 158) if i % 2 else (190, 160, 146))
# guest room windows, six floors, most lit
cols = [BX0 + 30 + i * 32 for i in range(14)]
for r in range(6):
    y = 60 + r * 24
    for c, x in enumerate(cols):
        lit = rng.random() < 0.68
        R(x - 2, y - 2, x + 15, y + 17, (196, 168, 150))          # stone surround
        if lit:
            R(x, y, x + 13, y + 15, (250, 210, 118)); R(x, y, x + 13, y + 5, (255, 232, 160))
        else:
            R(x, y, x + 13, y + 15, (58, 46, 66)); R(x, y, x + 5, y + 15, (78, 64, 86))
        R(x + 6, y, x + 7, y + 15, (186, 150, 120))                # mullion
        R(x - 3, y + 16, x + 16, y + 18, (232, 210, 182))         # sill
# ground floor: tall arched windows glowing from the lobby
for i, x in enumerate([BX0 + 30, BX0 + 82, BX0 + 134, BX1 - 160, BX1 - 108, BX1 - 56]):
    R(x - 3, 228, x + 29, 290, (204, 174, 150))
    E(x + 13, 230, 16, 14, (204, 174, 150))
    R(x, 230, x + 26, 288, (252, 196, 98))
    E(x + 13, 230, 13, 12, (255, 216, 130))
    R(x + 12, 226, x + 14, 288, (176, 120, 70))
    R(x, 256, x + 26, 258, (176, 120, 70))
# the entrance: brass revolving door in a lit bay
EX = (BX0 + BX1) / 2
R(EX - 36, 232, EX + 36, 290, (190, 160, 140))
R(EX - 28, 236, EX + 28, 290, (255, 214, 128))
for k in range(4):
    x = EX - 22 + k * 15
    R(x, 238, x + 2, 290, (170, 120, 54))
R(EX - 28, 236, EX + 28, 239, (200, 150, 70))

# ---------- sidewalk, curb, street ----------
P([(-2, 290), (690, 290), (690, 302), (-2, 302)], (150, 126, 132))
R(-2, 290, 690, 291, (120, 96, 104))
R(-2, 302, 690, 305, (196, 176, 170))
st = np.clip((yy - 305) / 18, 0, 1)
street = Image.fromarray((np.array([58, 44, 62]) * (1 - st[..., None]) + np.array([34, 26, 40]) * st[..., None]).astype(np.uint8), 'RGB')
ms = Image.new('L', (w, h), 0); ImageDraw.Draw(ms).rectangle([0, 305 * K, w, h], fill=255)
img.paste(street, (0, 0), ms)
d = ImageDraw.Draw(img)
# red carpet from the door to the curb, widening toward us
P([(EX - 22, 290), (EX + 22, 290), (EX + 34, 304), (EX - 34, 304)], (166, 30, 46))
P([(EX - 22, 290), (EX + 22, 290), (EX + 24, 292), (EX - 24, 292)], (190, 52, 64))

# ---------- the canopy: burgundy, gold scallops, brass poles ----------
CX0, CX1 = EX - 70, EX + 70
for px in (CX0 + 6, CX1 - 6):
    R(px - 1.4, 230, px + 1.4, 302, (196, 150, 66))
    R(px - 0.4, 230, px + 0.4, 302, (246, 214, 130))
    E(px, 302, 3, 1.4, (150, 110, 50))
# underside, seen from the street, deep shadow
P([(EX - 40, 222), (EX + 40, 222), (CX1, 232), (CX0, 232)], (70, 20, 34))
# front face of the canopy
R(CX0, 216, CX1, 232, (128, 24, 48))
R(CX0, 216, CX1, 218.5, (222, 182, 96))
R(CX0, 229, CX1, 230.5, (222, 182, 96))
n = 14
for i in range(n):
    x0 = CX0 + i * (CX1 - CX0) / n
    x1 = x0 + (CX1 - CX0) / n
    d.pieslice([x0 * K, (232 - 4.5) * K, x1 * K, (232 + 4.5) * K], 0, 180, fill=(128, 24, 48))
    d.arc([x0 * K, (232 - 4.5) * K, x1 * K, (232 + 4.5) * K], 0, 180, fill=(222, 182, 96), width=K)
# house mark on the face: a gold V between two diamonds
P([(EX - 5, 220), (EX - 2.6, 220), (EX, 225.5), (EX + 2.6, 220), (EX + 5, 220), (EX + 0.9, 228), (EX - 0.9, 228)], (240, 206, 122))
for dx in (-14, 14):
    P([(EX + dx, 221.5), (EX + dx + 2.6, 224), (EX + dx, 226.5), (EX + dx - 2.6, 224)], (240, 206, 122))
# brass lanterns on the wall either side of the canopy
for lx in (CX0 - 22, CX1 + 22):
    R(lx - 1, 238, lx + 1, 246, (120, 90, 50))
    R(lx - 5, 246, lx + 5, 262, (180, 136, 60))
    R(lx - 3.5, 248, lx + 3.5, 260, (255, 236, 168))
    P([(lx - 6, 246), (lx, 241), (lx + 6, 246)], (150, 110, 50))

# ---------- the park at the right: trees and a lamp ----------
R(BX1, 120, 690, 300, (92, 70, 82))
for (cx, cy, rx, ry, c) in [(640, 210, 60, 70, (40, 62, 52)), (672, 160, 46, 60, (34, 54, 46)),
                             (612, 248, 40, 46, (50, 76, 60)), (690, 240, 40, 70, (38, 58, 50)),
                             (628, 176, 30, 34, (58, 86, 66)), (660, 222, 22, 20, (70, 98, 72)), (600, 200, 18, 22, (46, 70, 56)), (684, 120, 22, 26, (44, 66, 54)), (646, 140, 16, 18, (62, 90, 70))]:
    E(cx, cy, rx, ry, c)
R(616, 260, 620, 300, (40, 30, 34)); R(652, 250, 656, 300, (40, 30, 34))
# street lamp at the curb
R(604, 214, 606.4, 303, (36, 30, 36))
E(605.2, 210, 5.5, 6.5, (255, 226, 150))
R(600, 202, 610.5, 204, (36, 30, 36))

# ---------- black stretch limousine at the curb ----------
LX0, LX1, LY = 70, 262, 296
body = (24, 20, 26)
d.rounded_rectangle([LX0 * K, (LY - 2) * K, LX1 * K, (LY + 13) * K], radius=5 * K, fill=body)
P([(LX0 + 30, LY - 2), (LX0 + 42, LY - 13), (LX1 - 48, LY - 13), (LX1 - 34, LY - 2)], body)
# tinted windows catching the hotel light
for (a, b) in [(LX0 + 44, LX0 + 72), (LX0 + 76, LX1 - 82), (LX1 - 78, LX1 - 50)]:
    P([(a, LY - 3), (a + 3, LY - 11), (b, LY - 11), (b + (3 if b == LX1 - 50 else 0), LY - 3)], (92, 72, 92))
    R(a + 2, LY - 10.5, b - 2, LY - 9.6, (196, 160, 140))
# chrome line and the hotel's glow on the paint
R(LX0 + 4, LY + 4, LX1 - 4, LY + 5, (214, 196, 186))
R(LX0 + 8, LY - 1, LX1 - 8, LY - 0.2, (160, 120, 96))
for wx in (LX0 + 26, LX1 - 30):
    E(wx, LY + 13, 8.5, 8.5, (14, 12, 16)); E(wx, LY + 13, 4, 4, (170, 166, 170))
R(LX1 - 4, LY + 1, LX1 + 0.5, LY + 5, (255, 236, 190))    # headlamp
R(LX0 - 0.5, LY + 1, LX0 + 3, LY + 5, (200, 40, 40))       # tail lamp

# ---------- reflections of the lit windows in the wet street ----------
img = img.resize((CW * 2, CH * 2), Image.LANCZOS)
W2, H2 = img.size
a = np.asarray(img).astype(np.float32)
Y2, X2 = np.mgrid[0:H2, 0:W2].astype(np.float32)
refl = np.zeros((H2, W2), np.float32)
for x in list(range(2 * (BX0 + 30), 2 * (BX1 - 30), 34)) + [int(2 * EX)]:
    s = 0.6 + 0.4 * rng.random()
    refl += s * np.exp(-((X2 - x - rng.normal(0, 4)) / 5) ** 2) * (Y2 > 612)
a += refl[..., None] * np.array([90, 62, 20]) * 0.55

# ---------- gouache handling: wobble, flat patches, brush streaks ----------
dx = lowfreq(30, 60, 3, W2, H2) * 1.1
dy = lowfreq(30, 60, 4, W2, H2) * 1.1
xi = np.clip((X2 + dx).round().astype(int), 0, W2 - 1)
yi = np.clip((Y2 + dy).round().astype(int), 0, H2 - 1)
a = a[yi, xi]
pim = Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGB').filter(ImageFilter.ModeFilter(3)).filter(ImageFilter.GaussianBlur(0.7))
a = np.asarray(pim).astype(np.float32)
streak_h = lowfreq(160, 22, 7, W2, H2)          # horizontal strokes in the sky and street
streak_v = lowfreq(18, 200, 8, W2, H2)          # vertical strokes on the stone
sky_mask = ((Y2 < 40) | (Y2 > 610)).astype(np.float32)
streak = streak_h * sky_mask + streak_v * (1 - sky_mask)
mott = lowfreq(8, 16, 9, W2, H2)
a *= (1 + streak[..., None] * (0.03 * sky_mask + 0.014)[..., None][..., 0][..., None] + mott[..., None] * 0.03)
# gouache dries a touch chalky: lift the darks a little
a = a * 0.94 + 10
# a soft edge vignette inside the window
cxn, cyn = (X2 / W2 - 0.5) * 2, (Y2 / H2 - 0.55) * 2
a *= (1 - 0.12 * np.clip(cxn ** 2 + cyn ** 2 - 0.5, 0, 1))[..., None]

# ---------- arched window mask and the gold rule ----------
RISE = 70   # px at 2x
def arch_top(x):
    u = (x - W2 / 2) / (W2 / 2)
    return RISE * (1 - np.sqrt(np.clip(1 - u ** 2, 0, 1))) + 0.0
top = arch_top(X2)
inset = 0.0
dist = np.minimum.reduce([Y2 - top, X2, W2 - 1 - X2, H2 - 1 - Y2])   # signed distance-ish to the frame edge
alpha = np.clip(dist + 1, 0, 1)
gold_band = np.exp(-((dist - 4) / 2.2) ** 2)            # thick gold rule
gold_hair = np.exp(-((dist - 13) / 0.8) ** 2) * 0.9     # hairline inside
gshade = 0.8 + 0.2 * np.cos(X2 / W2 * 6.0 + Y2 / H2 * 2)
gold = np.stack([222 * gshade, 184 * gshade, 104 * gshade], -1)
g = np.clip(gold_band + gold_hair, 0, 1)[..., None]
a = a * (1 - g) + gold * g
rgba = np.dstack([np.clip(a, 0, 255), alpha * 255]).astype(np.uint8)
os.makedirs(os.path.join(D, 'assets'), exist_ok=True)
Image.fromarray(rgba, 'RGBA').save(os.path.join(D, 'assets', 'facade-gouache.png'), optimize=True)
print('facade painted', W2, H2)
