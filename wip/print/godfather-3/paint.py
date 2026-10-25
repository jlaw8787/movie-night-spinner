"""Paints the red velvet valance for the front: three swagged drapes with soft folds,
gold bullion fringe, a twisted gold rope pelmet and tassels at the joins. 2x size, 1344x260."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1344, 260
VEL = np.array([118, 18, 30], float); DEEP = np.array([44, 4, 10], float); HI = np.array([190, 52, 60], float)
GOLD = (214, 172, 88); GOLDD = (140, 100, 40); GOLDH = (246, 222, 150)

img = np.zeros((H, W, 4), float)
yy, xx = np.mgrid[0:H, 0:W].astype(float)

# back drape: vertical folds, fills the band down to 92
fold = 0.5 + 0.5 * np.sin(xx / 22.0) * np.cos(xx / 61.0)
back = DEEP[None, None, :] + (VEL - DEEP)[None, None, :] * (0.25 + 0.55 * fold[..., None])
mask = yy < 92
img[mask, :3] = back[mask]; img[mask, 3] = 255

def swag(cx, half, top, sag_top, sag_bot):
    u = (xx - cx) / half
    inside_u = np.abs(u) <= 1
    t_top = top + sag_top * (1 - u ** 2)
    t_bot = top + 70 + sag_bot * (1 - u ** 2)
    t = (yy - t_top) / np.maximum(t_bot - t_top, 1)
    m = inside_u & (t >= 0) & (t <= 1)
    # curved folds that gather towards the ends
    f = np.sin(t * math.pi * 4.2 + 0.3) ** 2
    end = 1 - 0.55 * np.abs(u) ** 3
    light = (0.35 + 0.65 * f) * end * (0.75 + 0.25 * (1 - t))
    col = DEEP[None, None, :] + (HI - DEEP)[None, None, :] * light[..., None]
    img[m, :3] = col[m]; img[m, 3] = 255
    return t_bot, inside_u

swags = [(224, 234), (672, 234), (1120, 234)]
fringe_pts = []
for cx, half in swags:
    t_bot, ins = swag(cx, half, 18, 22, 112)
    for x in range(int(cx - half) + 6, int(cx + half) - 6, 3):
        if 0 <= x < W:
            u = (x - cx) / half
            fringe_pts.append((x, 18 + 70 + 112 * (1 - u ** 2)))

im = Image.fromarray(img.astype('uint8'), 'RGBA')
d = ImageDraw.Draw(im)
# gold bullion fringe along each swag hem
for x, y in fringe_pts:
    L = 20
    d.line([(x, y - 2), (x, y + L)], fill=GOLDD, width=3)
    d.line([(x, y - 2), (x, y + L - 3)], fill=GOLD, width=2)
    d.point((x, y + 3), fill=GOLDH)
for x, y in fringe_pts[::3]:
    d.line([(x - 1, y - 4), (x + 3, y - 4)], fill=GOLDH, width=1)
# twisted rope pelmet
d.rectangle([0, 0, W, 22], fill=(60, 8, 14))
for x in range(-20, W + 20, 14):
    d.line([(x, 20), (x + 12, 2)], fill=GOLD, width=7)
    d.line([(x + 2, 17), (x + 10, 5)], fill=GOLDH, width=2)
d.line([(0, 22), (W, 22)], fill=GOLDD, width=2)
# tassels at the joins and ends
for tx in (0, 448, 896, 1344):
    d.ellipse([tx - 14, 76, tx + 14, 104], fill=GOLD, outline=GOLDD, width=2)
    d.ellipse([tx - 7, 82, tx + 3, 92], fill=GOLDH)
    d.polygon([(tx - 13, 104), (tx + 13, 104), (tx + 22, 176), (tx - 22, 176)], fill=GOLD)
    for k in range(-20, 21, 4):
        d.line([(tx + k * 0.55, 106), (tx + k, 176)], fill=GOLDD, width=1)
    d.rectangle([tx - 15, 102, tx + 15, 110], fill=GOLDD)
    d.line([(tx, 22), (tx, 76)], fill=GOLD, width=4)
# soft shadow under the drape onto the cover
sh = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(sh)
for x, y in fringe_pts:
    sd.line([(x, y + 8), (x, y + 30)], fill=110, width=4)
sh = sh.filter(ImageFilter.GaussianBlur(9))
shadow = Image.new('RGBA', (W, H), (10, 0, 2, 0)); shadow.putalpha(sh)
out = Image.alpha_composite(shadow, im)
out.save(os.path.join(D, 'assets', 'velvet-valance.png'))
print('valance painted')
