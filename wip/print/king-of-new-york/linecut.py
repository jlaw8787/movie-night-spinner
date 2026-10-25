"""Engraves the cover drawing for the South Bronx benefit journal (King of New York, 1990).
A line cut, the way a journal printer would reproduce a pen drawing: tone is carried only by ruled
hatching (horizontal on the walls, diagonal in the shadows), with pen outlines on top. Two spot inks
on the green cover stock: silver for the drawing, white for the lit windows, the entrance canopy and
the street lamp, laid down a hair out of register with the silver.
The scene: the hospital at night, an old brick block with a limestone centre pavilion, a wooden water
tank on the roof, tenements with fire escapes either side, a cobra-head street lamp, and a black
stretch limousine at the kerb.
Writes assets/hospital.png (RGBA, 1360 x 880, shown at 680 x 440)."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1360, 880
SILVER = (202, 207, 199)
WHITE = (243, 241, 231)
random.seed(1990)
rng = np.random.default_rng(1990)

T = np.zeros((H, W), np.float32)     # tone for horizontal hatching, 0..1
Dg = np.zeros((H, W), np.float32)    # tone for diagonal shadow hatching
pen = Image.new('L', (W, H), 0); pd = ImageDraw.Draw(pen)
wht = Image.new('L', (W, H), 0); wd = ImageDraw.Draw(wht)
yy, xx = np.mgrid[0:H, 0:W]

def rect(a, x0, y0, x1, y1, v):
    a[max(0, y0):min(H, y1), max(0, x0):min(W, x1)] = v

def wline(pts, w=3):
    """pen line with a slight hand wobble"""
    out = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(2, int(math.hypot(x1 - x0, y1 - y0) / 40))
        for i in range(n + 1):
            t = i / n
            out.append((x0 + (x1 - x0) * t + random.uniform(-0.7, 0.7), y0 + (y1 - y0) * t + random.uniform(-0.7, 0.7)))
    pd.line(out, fill=255, width=w, joint='curve')

def box(x0, y0, x1, y1, w=3):
    wline([(x0, y0), (x1, y0), (x1, y1), (x0, y1), (x0, y0)], w)

GROUND = 790
# ---- sky: faint ruling, a little brighter toward the street glow ----
sky = 0.02 + 0.16 * (yy / H) ** 1.4
T[:] = sky
# ---- tenements either side ----
for (x0, x1, top) in ((0, 118, 300), (1242, W, 270)):
    rect(T, x0, top, x1, GROUND, 0.36)
    wline([(x0, top), (x1, top)], 4)
    for r in range(7):
        y = top + 30 + r * 66
        if y + 40 > GROUND - 20: break
        for c in range(2):
            x = x0 + 18 + c * 52
            if x + 30 > x1: continue
            rect(T, x, y, x + 30, y + 42, 0.0)
            if random.random() < 0.35:
                wd.rectangle((x + 3, y + 3, x + 27, y + 39), fill=255)
            box(x, y, x + 30, y + 42, 2)
    # fire escape: landings and a zigzag of ladders
    fx0, fx1 = (x1 - 64, x1 - 4) if x0 == 0 else (x0 + 4, x0 + 64)
    for r in range(6):
        y = top + 78 + r * 66
        if y > GROUND - 60: break
        wline([(fx0, y), (fx1, y)], 3)
        wline([(fx0, y + 8), (fx1, y + 8)], 2)
        for k in range(fx0, fx1 + 1, 10):
            pd.line((k, y, k, y + 8), fill=255, width=1)
        if r % 2 == 0: wline([(fx0 + 6, y + 8), (fx1 - 6, y + 66)], 2)
        else: wline([(fx1 - 6, y + 8), (fx0 + 6, y + 66)], 2)

# ---- the hospital block ----
BX0, BX1, BTOP = 136, 1226, 246
grad = 0.30 + 0.24 * np.clip((yy - BTOP) / (GROUND - BTOP), 0, 1)       # lit from the street
blk = (xx >= BX0) & (xx < BX1) & (yy >= BTOP) & (yy < GROUND)
T[blk] = grad[blk]
# shadow under the cornice and down the inner corners of the pavilion
Dg[(xx >= BX0) & (xx < BX1) & (yy >= BTOP + 16) & (yy < BTOP + 58)] = 0.35
PX0, PX1, PTOP = 556, 806, 186
pav = (xx >= PX0) & (xx < PX1) & (yy >= PTOP) & (yy < GROUND)
T[pav] = np.minimum(0.70, grad[pav] + 0.14)
Dg[(xx >= PX1) & (xx < PX1 + 26) & (yy >= BTOP + 16) & (yy < GROUND)] = 0.45
# pediment
ped = Image.new('L', (W, H), 0)
ImageDraw.Draw(ped).polygon([(PX0 - 10, PTOP), (PX1 + 10, PTOP), ((PX0 + PX1) // 2, PTOP - 62)], fill=255)
pm = np.array(ped) > 0
T[pm] = 0.50
wline([(PX0 - 14, PTOP), ((PX0 + PX1) // 2, PTOP - 64), (PX1 + 14, PTOP), (PX0 - 14, PTOP)], 4)
wd.ellipse(((PX0 + PX1) // 2 - 16, PTOP - 40, (PX0 + PX1) // 2 + 16, PTOP - 10), fill=255)   # lit clock face
pd.ellipse(((PX0 + PX1) // 2 - 19, PTOP - 43, (PX0 + PX1) // 2 + 19, PTOP - 7), outline=255, width=3)
# cornices and limestone string courses, solid
for (y0, y1) in ((BTOP - 12, BTOP + 4), (BTOP + 96, BTOP + 104), (GROUND - 160, GROUND - 150)):
    rect(T, BX0 - 10, y0, BX1 + 10, y1, 1.0)
rect(T, PX0 - 14, PTOP - 4, PX1 + 14, PTOP + 10, 1.0)
box(BX0, BTOP, BX1, GROUND, 4); box(PX0, PTOP + 10, PX1, GROUND, 4)
# roof: bulkhead and the wooden water tank on its stand
rect(T, 240, BTOP - 70, 350, BTOP - 12, 0.52); box(240, BTOP - 70, 350, BTOP - 12)
tx = 980
for lx in (tx + 6, tx + 52, tx + 98):
    wline([(lx, BTOP - 70), (lx, BTOP - 12)], 4)
wline([(tx - 4, BTOP - 70), (tx + 110, BTOP - 70)], 5)
rect(T, tx, BTOP - 172, tx + 106, BTOP - 72, 0.48)
for i in range(4): wline([(tx, BTOP - 156 + i * 24), (tx + 106, BTOP - 156 + i * 24)], 3)
box(tx, BTOP - 172, tx + 106, BTOP - 72)
wline([(tx - 8, BTOP - 172), (tx + 53, BTOP - 214), (tx + 114, BTOP - 172)], 4)
cone = Image.new('L', (W, H), 0)
ImageDraw.Draw(cone).polygon([(tx - 8, BTOP - 172), (tx + 53, BTOP - 214), (tx + 114, BTOP - 172)], fill=255)
T[np.array(cone) > 0] = 0.62
# windows: six floors, double-hung, about a third lit
def window(x, y, w=36, h=54):
    rect(T, x, y, x + w, y + h, 0.0)
    Dg[y:y + h, x:x + w] = 0.0
    if random.random() < 0.34:
        wd.rectangle((x + 3, y + 3, x + w - 3, y + h - 3), fill=255)
    else:
        Dg[y + 4:y + h - 4, x + 4:x + w - 4] = 0.16
    box(x, y, x + w, y + h, 3)
    pd.line((x, y + h // 2, x + w, y + h // 2), fill=255, width=2)
    rect(T, x - 4, y + h, x + w + 4, y + h + 7, 0.95)       # stone sill
floors = [BTOP + 30, BTOP + 120, BTOP + 196, BTOP + 272, BTOP + 348, BTOP + 424]
for f, y in enumerate(floors):
    for b in range(15):
        x = BX0 + 26 + b * 72
        if PX0 - 30 < x < PX1:
            continue
        window(x, y)
    for b in range(3):
        x = PX0 + 34 + b * 70
        if f >= 5: continue
        window(x, y - (0 if f else 0), 42, 54)
# entrance: steps, doors, the canopy with its sign (lettering set in HTML)
rect(T, PX0 + 30, GROUND - 120, PX1 - 30, GROUND - 6, 0.0)
box(PX0 + 30, GROUND - 120, PX1 - 30, GROUND - 6, 3)
Dg[GROUND - 112:GROUND - 10, PX0 + 40:PX1 - 40] = 0.22
wd.rectangle((PX0 - 10, GROUND - 168, PX1 + 10, GROUND - 130), fill=255)        # canopy face
pd.rectangle((PX0 - 12, GROUND - 170, PX1 + 12, GROUND - 128), outline=255, width=3)
from PIL import ImageFont
fnt = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf', 28)
lab = 'EMERGENCY'
tw = wd.textlength(lab, font=fnt) + 6 * (len(lab) - 1)
x = (PX0 + PX1) / 2 - tw / 2
for ch in lab:
    wd.text((x, GROUND - 165), ch, font=fnt, fill=0)
    x += wd.textlength(ch, font=fnt) + 6
# door leaves and their panes
DX0, DX1 = PX0 + 30, PX1 - 30
wline([((DX0 + DX1) // 2, GROUND - 120), ((DX0 + DX1) // 2, GROUND - 6)], 4)
for q in (DX0 + 28, (DX0 + DX1) // 2 + 28):
    wd.rectangle((q, GROUND - 106, q + 40, GROUND - 60), fill=255)
    pd.rectangle((q - 3, GROUND - 109, q + 43, GROUND - 57), outline=255, width=3)
for sx in (PX0 + 2, PX1 - 6):
    wline([(sx, GROUND - 128), (sx, GROUND - 6)], 4)
for i in range(3):
    wline([(PX0 + 10 - i * 8, GROUND - 6 + i * 6 - 12), (PX1 - 10 + i * 8, GROUND - 6 + i * 6 - 12)], 3)
# ---- street, kerb, lamp ----
rect(T, 0, GROUND, W, H, 0.30)
rect(T, 0, GROUND, W, GROUND + 8, 1.0)
rect(T, 0, GROUND + 34, W, GROUND + 38, 0.9)
lx = 70
wline([(lx, GROUND), (lx, 520), (lx + 8, 500), (lx + 60, 486)], 5)
wline([(lx + 50, 482), (lx + 92, 480), (lx + 96, 492), (lx + 54, 496), (lx + 50, 482)], 4)
wd.ellipse((lx + 52, 492, lx + 94, 508), fill=255)
glow = Image.new('L', (W, H), 0)
ImageDraw.Draw(glow).polygon([(lx + 56, 500), (lx + 92, 500), (lx + 190, GROUND), (lx - 30, GROUND)], fill=255)
gm = np.array(glow.filter(ImageFilter.GaussianBlur(30))) / 255.0
T[:] = np.minimum(1.0, T + 0.22 * gm * ((xx < BX0 + 200)))

# ---- black stretch limousine at the kerb, right of the doors ----
cx0, cx1, cy = 848, 1340, GROUND + 4
lim = Image.new('L', (W, H), 0); ld = ImageDraw.Draw(lim)
body = [(cx0, cy - 18), (cx0 + 8, cy - 52), (cx0 + 62, cy - 58), (cx0 + 96, cy - 92), (cx1 - 120, cy - 94),
        (cx1 - 84, cy - 62), (cx1 - 8, cy - 56), (cx1, cy - 22), (cx1 - 6, cy - 8), (cx0 + 6, cy - 8)]
ld.polygon(body, fill=255)
wd.polygon(body, fill=0)
pd.polygon(body, fill=0)
lm = np.array(lim) > 0
T[lm] = 0.12; Dg[lm] = 0.0
wline(body + [body[0]], 4)
# long side glass, pillars, chrome rub strip, bumpers, wheels
wd.polygon([(cx0 + 104, cy - 86), (cx1 - 126, cy - 88), (cx1 - 98, cy - 62), (cx0 + 80, cy - 60)], fill=0)
rect(T, cx0 + 84, cy - 86, cx1 - 102, cy - 62, 0.0)
for px in (cx0 + 104, cx0 + 200, cx0 + 300, cx1 - 200, cx1 - 128):
    wline([(px, cy - 88), (px - 4, cy - 60)], 4)
wline([(cx0 + 84, cy - 60), (cx1 - 100, cy - 60)], 3)
wline([(cx0 + 10, cy - 36), (cx1 - 10, cy - 36)], 3)
rect(T, cx0 - 2, cy - 22, cx0 + 14, cy - 10, 1.0); rect(T, cx1 - 14, cy - 22, cx1 + 2, cy - 10, 1.0)
for wx in (cx0 + 70, cx1 - 70):
    pd.ellipse((wx - 30, cy - 34, wx + 30, cy + 26), fill=0, outline=255, width=4)
    pd.ellipse((wx - 13, cy - 17, wx + 13, cy + 9), outline=255, width=3)
    T[(xx - wx) ** 2 + (yy - (cy - 4)) ** 2 < 30 ** 2] = 0.0
wd.rectangle((cx1 - 10, cy - 50, cx1 - 2, cy - 38), fill=255)     # headlamp

# ---- engrave ----
P = 7.0
wob = 0.8 * np.sin(xx / 57.0 + yy / 300.0) + 0.35 * np.sin(xx / 23.0 + yy / 90.0)
ph = np.mod(yy + wob, P) - P / 2
hatch = np.clip(T * P * 0.52 - np.abs(ph) + 0.5, 0, 1)
P2 = 8.0
ph2 = np.mod((xx + yy) / math.sqrt(2) + 0.6 * np.sin(yy / 29.0), P2) - P2 / 2
hatch2 = np.clip(Dg * P2 * 0.5 - np.abs(ph2) + 0.5, 0, 1) * (Dg > 0)
hatch = hatch * (T > 0.02)
ink = np.maximum(np.maximum(hatch, hatch2), np.array(pen) / 255.0)
# the lit windows and canopy are white ink, so knock the silver out beneath them
wm = np.array(wht) > 0
ink[wm] = 0
silver = Image.fromarray((ink * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.45))
mott = Image.fromarray((rng.random((H // 40 + 2, W // 40 + 2)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(20))
mot = np.array(mott) / 255.0
sa = (np.array(silver) * (0.80 + 0.20 * mot)).astype(np.uint8)
# white ink: printed on a second pass, 2 px right and 1 px down of the silver
wimg = Image.new('L', (W, H), 0); wimg.paste(wht, (2, 1))
wa = (np.array(wimg.filter(ImageFilter.GaussianBlur(0.6))) * (0.86 + 0.14 * (1 - mot))).astype(np.uint8)
out = Image.new('RGBA', (W, H), SILVER + (0,)); out.putalpha(Image.fromarray(sa))
wl = Image.new('RGBA', (W, H), WHITE + (0,)); wl.putalpha(Image.fromarray(wa))
out = Image.alpha_composite(out, wl)
out.save(os.path.join(D, 'assets', 'hospital.png'))
print('engraved', out.size, 'canopy box', (PX0 - 10, GROUND - 168, PX1 + 10, GROUND - 130))
