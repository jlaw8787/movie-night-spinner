"""Paints the stock cut for the BACK of the Last Stop bar card (After Hours, 1985): a whiskey sour
in a rocks glass drawn as an engraved line cut, the kind of clip art a quick printer pasted onto a
bar card. Black plate lines and hatching, the cherry on the red plate a hair out of register.
Writes assets/sour-cut.png (transparent, 2x of 150 x 170 layout px)."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 4                     # draw at 4x, save at 2x
LW, LH = 150, 170
W, H = LW * S, LH * S
K = (30, 27, 25); R = (226, 68, 45)
random.seed(7)
ink = Image.new('L', (W, H), 0); d = ImageDraw.Draw(ink)
red = Image.new('L', (W, H), 0); rd = ImageDraw.Draw(red)
def J(v, a=0.35): return v + random.uniform(-a, a)
def ln(x0, y0, x1, y1, w=1.0, img=d):
    img.line([(J(x0) * S, J(y0) * S), (J(x1) * S, J(y1) * S)], fill=255, width=max(1, int(round(w * S))))

# glass: slightly tapered tumbler, heavy base
gx0, gx1, gt, gb = 30, 120, 52, 156
tap = 5
ln(gx0, gt, gx0 + tap, gb, 1.6); ln(gx1, gt, gx1 - tap, gb, 1.6)
d.ellipse(((gx0) * S, (gt - 6) * S, (gx1) * S, (gt + 6) * S), outline=255, width=int(1.3 * S))
d.arc(((gx0 + tap) * S, (gb - 5) * S, (gx1 - tap) * S, (gb + 5) * S), 0, 180, fill=255, width=int(1.6 * S))
d.arc(((gx0 + tap + 1) * S, (gb - 16) * S, (gx1 - tap - 1) * S, (gb - 6) * S), 0, 180, fill=255, width=int(1.1 * S))
# heavy base: dense hatching
for k in range(10):
    y = gb - 10 + k * 1.2
    ln(gx0 + tap + 2, y, gx1 - tap - 2, y, 0.45)
# foam line and foam stipple
fy = gt + 14
d.arc(((gx0 + 1.5) * S, (fy - 5) * S, (gx1 - 1.5) * S, (fy + 5) * S), 0, 180, fill=255, width=int(1.1 * S))
for i in range(150):
    a = random.uniform(0, 2 * math.pi); rr = random.uniform(0, 1) ** 0.6
    x = 75 + math.cos(a) * 42 * rr; y = gt + 2 + (math.sin(a) * 5 * rr) + random.uniform(0, 10)
    if y < fy + 3: d.ellipse(((x - 0.45) * S, (y - 0.45) * S, (x + 0.45) * S, (y + 0.45) * S), fill=255)
# bitters drops on the foam
for x, y in ((62, gt + 2), (86, gt + 4)):
    d.ellipse(((x - 2.2) * S, (y - 1.2) * S, (x + 2.2) * S, (y + 1.2) * S), fill=255)
# ice cubes: outlined, with a few hatched faces
cubes = [(40, 76, 30, 26, 8), (72, 70, 32, 28, -6), (54, 104, 30, 26, 14), (86, 108, 26, 24, -10)]
for cx, cy, w, h, ang in cubes:
    a = math.radians(ang); ca, sa = math.cos(a), math.sin(a)
    pts = [(cx + ca * px - sa * py, cy + sa * px + ca * py) for px, py in ((0, 0), (w, 0), (w, h), (0, h))]
    for i in range(4): ln(*pts[i], *pts[(i + 1) % 4], 0.9)
    for k in range(1, 6):
        t = k / 6
        p = (pts[0][0] + (pts[3][0] - pts[0][0]) * t, pts[0][1] + (pts[3][1] - pts[0][1]) * t)
        ln(p[0] + 2, p[1], p[0] + 2 + ca * w * 0.35, p[1] + sa * w * 0.35, 0.45)
# liquid shading: vertical hatching on the right side of the glass, sparse
for k in range(12):
    x = gx1 - 8 - k * 2.2
    ln(x, fy + 4 + k * 0.5, x - 0.4 * (k % 3), gb - 14, 0.4)
# highlight: a clean strip left of centre (by leaving it bare)
# cherry: red ball with a black stem and outline
cx, cy, cr = 104, 44, 9
rd.ellipse(((cx - cr) * S, (cy - cr) * S, (cx + cr) * S, (cy + cr) * S), fill=255)
d.arc(((cx - cr) * S, (cy - cr) * S, (cx + cr) * S, (cy + cr) * S), 20, 250, fill=255, width=int(1.1 * S))
for k in range(5):
    ln(cx + 1 + k * 1.4, cy - 6 + k * 0.6, cx + 3 + k * 1.4, cy + 7 - k * 0.6, 0.45)
d.line([(cx * S, (cy - cr + 1) * S), ((cx + 6) * S, (cy - 22) * S), ((cx + 14) * S, (cy - 28) * S)], fill=255, width=int(1.2 * S), joint='curve')
# hold the red clear of the black lines but slip it a hair right and down
red_a = np.asarray(red, float) / 255
red_a = np.roll(np.roll(red_a, 3, 0), 4, 1)
ink_a = np.asarray(ink.filter(ImageFilter.GaussianBlur(0.8)), float) / 255
rough = np.random.RandomState(3).rand(H, W)
rough = np.asarray(Image.fromarray((rough * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5)), float) / 255
ink_a = np.clip((ink_a - 0.40 - (rough - 0.5) * 0.4) * 4 + 0.5, 0, 1)

paper = np.array([255, 255, 255], float)
col = np.ones((H, W, 3)) * paper
col = col * (1 - red_a[..., None]) + col * (np.array(R) / 255) * red_a[..., None]
col = col * (1 - ink_a[..., None]) + col * (np.array(K) / 255) * ink_a[..., None]
alpha = np.clip(np.maximum(red_a, ink_a), 0, 1)
# un-premultiply against white so the PNG sits on the card as ink
rgb = np.where(alpha[..., None] > 0, 255 - (255 - col) / np.maximum(alpha[..., None], 1e-3), 255)
out = np.dstack([np.clip(rgb, 0, 255), alpha * 255]).astype(np.uint8)
im = Image.fromarray(out, 'RGBA').resize((LW * 2, LH * 2), Image.LANCZOS)
im.save(os.path.join(A, 'sour-cut.png'), optimize=True)
print('sour-cut', im.size)
