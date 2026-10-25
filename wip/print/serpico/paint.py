"""Paints the storefront line cut for the Garfein's menu cover, and the paper wear.
Two printing inks (black and deli red) on transparent ground, drawn at 4x and reduced,
with the red plate slightly out of register, the way a two-colour job shop menu printed in 1967.
Writes assets/storefront.png (1408x600, shown at 704x300) and assets/wear-front.png / wear-back.png."""
import math, os, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
FD = os.path.join(D, 'fonts')
random.seed(1967)

W, H, K = 704, 300, 4
CW, CH = W * K, H * K
BLACK = (31, 28, 27); RED = (184, 38, 43)

ink = Image.new('L', (CW, CH), 0)      # black plate coverage
red = Image.new('L', (CW, CH), 0)      # red plate coverage
di, dr = ImageDraw.Draw(ink), ImageDraw.Draw(red)

def P(x, y): return (x * K, y * K)
def font(name, size, wght=None):
    f = ImageFont.truetype(os.path.join(FD, name), int(size * K))
    if wght:
        try: f.set_variation_by_axes([wght])
        except Exception: pass
    return f

def line(d, x1, y1, x2, y2, w=0.7, wob=0.25, seg=10):
    """A pen line with a slight hand wobble."""
    n = max(1, int(math.hypot(x2 - x1, y2 - y1) / seg))
    pts = []
    for i in range(n + 1):
        t = i / n
        j = 0 if i in (0, n) else random.uniform(-wob, wob)
        dx, dy = (y2 - y1), -(x2 - x1); L = math.hypot(dx, dy) or 1
        pts.append(P(x1 + (x2 - x1) * t + dx / L * j, y1 + (y2 - y1) * t + dy / L * j))
    d.line(pts, fill=255, width=max(1, int(w * K)), joint='curve')

def rect(d, x1, y1, x2, y2, w=0.8):
    line(d, x1, y1, x2, y1, w); line(d, x2, y1, x2, y2, w); line(d, x2, y2, x1, y2, w); line(d, x1, y2, x1, y1, w)

def region(poly=None, box=None):
    m = Image.new('L', (CW, CH), 0); md = ImageDraw.Draw(m)
    if box: md.rectangle([P(*box[:2]), P(*box[2:])], fill=255)
    if poly: md.polygon([P(x, y) for x, y in poly], fill=255)
    return m

def hatch(target, mask, angle=45, gap=2.2, w=0.45, wob=0.15, skip=0.0):
    """Parallel engraving lines over the whole sheet, kept only inside mask."""
    lay = Image.new('L', (CW, CH), 0); ld = ImageDraw.Draw(lay)
    a = math.radians(angle); ca, sa = math.cos(a), math.sin(a)
    R = math.hypot(W, H)
    k = -R
    while k < R:
        if random.random() >= skip:
            cx, cy = W / 2 - sa * k, H / 2 + ca * k
            line(ld, cx - ca * R, cy - sa * R, cx + ca * R, cy + sa * R, w, wob, seg=14)
        k += gap
    target.paste(ImageChops.lighter(target, ImageChops.multiply(lay, mask)), (0, 0))

def clear(target, mask):
    target.paste(ImageChops.subtract(target, mask), (0, 0))

def text_mask(txt, f, cx, cy, stroke=0, anchor='mm'):
    m = Image.new('L', (CW, CH), 0); md = ImageDraw.Draw(m)
    md.text(P(cx, cy), txt, font=f, fill=255, anchor=anchor, stroke_width=int(stroke * K), stroke_fill=255)
    return m

# ---------------- upper storey: brick, three windows, fire escape ----------------
brick = region(box=(0, 0, W, 98))
lay = Image.new('L', (CW, CH), 0); ld = ImageDraw.Draw(lay)
y, row = 2.0, 0
while y < 98:
    line(ld, 0, y, W, y, 0.42, 0.1, seg=20)
    off = 6 if row % 2 else 0
    x = off
    while x < W:
        if random.random() < 0.7: line(ld, x, y, x, y + 4.2, 0.38, 0.05)
        x += 12
    y += 4.4; row += 1
ink.paste(ImageChops.lighter(ink, ImageChops.multiply(lay, brick)), (0, 0))

WINS = [(58, 12, 136, 84), (313, 12, 391, 84), (568, 12, 646, 84)]
for x1, y1, x2, y2 in WINS:
    clear(ink, region(box=(x1 - 7, y1 - 9, x2 + 7, y2 + 5)))
    rect(di, x1 - 6, y1 - 9, x2 + 6, y1 - 2, 0.9)                         # stone lintel
    hatch(ink, region(box=(x1 - 6, y1 - 9, x2 + 6, y1 - 2)), 0, 2.4, 0.35)
    rect(di, x1 - 5, y2, x2 + 5, y2 + 5, 0.9)                             # sill
    hatch(ink, region(box=(x1 - 5, y2 + 2.5, x2 + 5, y2 + 5)), 0, 1.2, 0.4)
    rect(di, x1, y1, x2, y2, 1.0)
    pane = region(box=(x1 + 3, y1 + 3, x2 - 3, y2 - 3))
    hatch(ink, pane, 50, 1.9, 0.5); hatch(ink, pane, -40, 2.6, 0.45)
    shade = region(box=(x1 + 3, y1 + 3, x2 - 3, y1 + 22))                 # drawn shade at top
    clear(ink, shade); hatch(ink, shade, 0, 2.0, 0.35, skip=0.2)
    line(di, x1 + 3, y1 + 22, x2 - 3, y1 + 22, 0.8)
    line(di, (x1 + x2) / 2 - 2, y1 + 22, (x1 + x2) / 2 + 2, y1 + 26, 0.6)
    clear(ink, region(box=(x1, (y1 + y2) / 2 + 4, x2, (y1 + y2) / 2 + 7)))   # meeting rail
    rect(di, x1, (y1 + y2) / 2 + 4, x2, (y1 + y2) / 2 + 7, 0.6)
    clear(ink, region(box=((x1 + x2) / 2 - 1.2, y1 + 22, (x1 + x2) / 2 + 1.2, y2)))

# fire escape across the middle window bays
fx1, fx2, top, plat = 30, 430, 46, 80
clear(ink, region(box=(fx1, plat, fx2, plat + 4)))
for yy in (plat, plat + 4): line(di, fx1, yy, fx2, yy, 1.1)
x = fx1
while x <= fx2: line(di, x, plat, x, plat + 4, 0.5, 0); x += 3
line(di, fx1, top, fx2, top, 1.3); line(di, fx1, top + 3, fx2, top + 3, 0.6)
x = fx1
while x <= fx2: line(di, x, top, x, plat, 0.55, 0.05); x += 5.5
for xb in (fx1 + 40, fx1 + 200, fx2 - 40):                               # brackets
    line(di, xb, plat + 4, xb - 14, plat + 16, 0.9); line(di, xb - 14, plat + 16, xb - 14, plat + 4, 0.6)
# drop ladder hooked up at the right end
for xl in (fx2 - 26, fx2 - 12): line(di, xl, plat + 4, xl, 118, 1.0)
yy = plat + 9
while yy < 118: line(di, fx2 - 26, yy, fx2 - 12, yy, 0.8); yy += 6
# stair from upper landing
line(di, fx1 + 60, top - 46, fx1 + 120, plat, 1.0); line(di, fx1 + 68, top - 46, fx1 + 128, plat, 1.0)
for t in range(1, 12):
    a = fx1 + 60 + t * 5; b = top - 46 + t * (plat - top + 46) / 12
    line(di, a, b, a + 8, b, 0.6, 0)

# ---------------- cornice and sign board ----------------
clear(ink, region(box=(0, 96, W, 136)))
line(di, 0, 97, W, 97, 1.4); line(di, 0, 100.5, W, 100.5, 0.6)
x = 4
while x < W: rect(di, x, 101.5, x + 4, 105, 0.45); x += 9                 # dentils
line(di, 0, 106, W, 106, 0.9)
board = region(box=(10, 108, W - 10, 132))
hatch(ink, board, 0, 1.05, 0.62); hatch(ink, board, 90, 2.4, 0.3)
rect(di, 10, 108, W - 10, 132, 1.1)
f_sign = font('Antonio.ttf', 20.5, 700)
tm = text_mask('GARFEIN’S  DELICATESSEN  &  APPETIZING', f_sign, W / 2, 120.6, stroke=1.0)
clear(ink, tm)
tm2 = text_mask('GARFEIN’S  DELICATESSEN  &  APPETIZING', f_sign, W / 2, 120.6)
# leave the letters as bare paper with a fine black keyline
edge = ImageChops.subtract(tm, tm2.filter(ImageFilter.MaxFilter(3)))
ink.paste(ImageChops.lighter(ink, ImageChops.multiply(edge, Image.new('L', (CW, CH), 120))), (0, 0))
line(di, 0, 134, W, 134, 1.2)

# ---------------- awning ----------------
aw = [(26, 136), (W - 26, 136), (W - 12, 160), (12, 160)]
clear(ink, region(poly=aw + [(12, 174), (W - 12, 174)]))
# stripes in perspective: equal at the top edge, wider at the bottom edge
n = 22
for i in range(n):
    if i % 2: continue
    t1, t2 = i / n, (i + 1) / n
    xa1 = 26 + (W - 52) * t1; xa2 = 26 + (W - 52) * t2
    xb1 = 12 + (W - 24) * t1; xb2 = 12 + (W - 24) * t2
    dr.polygon([P(xa1, 136), P(xa2, 136), P(xb2, 160), P(xb1, 160)], fill=230)
for i in range(n + 1):
    t = i / n
    line(di, 26 + (W - 52) * t, 136, 12 + (W - 24) * t, 160, 0.4, 0.05)
hatch(ink, region(poly=aw), 0, 2.6, 0.32, skip=0.35)                         # canvas fold shading
line(di, 26, 136, W - 26, 136, 1.0); line(di, 12, 160, W - 12, 160, 1.0)
line(di, 26, 136, 12, 160, 1.0); line(di, W - 26, 136, W - 12, 160, 1.0)
# scalloped valance in solid red with the words knocked out
val = Image.new('L', (CW, CH), 0); vd = ImageDraw.Draw(val)
vd.rectangle([P(12, 160), P(W - 12, 170)], fill=255)
sc = 16
x = 12
while x < W - 12:
    vd.pieslice([P(x, 164), P(x + sc, 178)], 0, 180, fill=255); x += sc
red.paste(ImageChops.lighter(red, val), (0, 0))
vt = text_mask('HOT  MEATS   ·   SANDWICHES   ·   PLATTERS   ·   WE  DELIVER', font('Antonio.ttf', 8.4, 600), W / 2, 166.3)
clear(red, vt)
vedge = ImageChops.subtract(val.filter(ImageFilter.MaxFilter(5)), val)
ink.paste(ImageChops.lighter(ink, ImageChops.multiply(vedge, Image.new('L', (CW, CH), 200))), (0, 0))
# shadow the awning throws on the glass
shadow_band = (0, 172, W, 188)

# ---------------- storefront ----------------
LW = (40, 178, 318, 250); DOOR = (332, 172, 390, 282); RW = (404, 178, 664, 250)
# brick piers
for x1, x2 in ((0, 28), (W - 28, W)):
    pm = region(box=(x1, 172, x2, 284))
    lay = Image.new('L', (CW, CH), 0); ld = ImageDraw.Draw(lay)
    y, row = 172.0, 0
    while y < 284:
        line(ld, x1, y, x2, y, 0.42, 0.08)
        x = x1 + (6 if row % 2 else 0)
        while x < x2: line(ld, x, y, x, y + 4.2, 0.38, 0.04); x += 12
        y += 4.4; row += 1
    ink.paste(ImageChops.lighter(ink, ImageChops.multiply(lay, pm)), (0, 0))
    line(di, x1 if x1 else x2, 172, x1 if x1 else x2, 284, 1.0)
# window frames
for x1, y1, x2, y2 in (LW, RW):
    rect(di, x1 - 5, y1 - 6, x2 + 5, y2 + 4, 1.2)
    rect(di, x1 - 2, y1 - 3, x2 + 2, y2 + 1, 0.6)
    glass = region(box=(x1, y1, x2, y2))
    hatch(ink, glass, 62, 2.5, 0.48); hatch(ink, glass, -28, 3.3, 0.4)
    hatch(ink, region(box=(x1, y1, x2, y1 + 12)), 0, 1.3, 0.5)              # awning shadow on the glass
    line(di, x1, y2 - 22, x2, y2 - 22, 0.8)                                 # counter line inside
    hatch(ink, region(box=(x1, y2 - 22, x2, y2)), 90, 1.6, 0.42)
    # rail and hanging salamis
    line(di, x1 + 4, y1 + 5, x2 - 4, y1 + 5, 1.0)
    x = x1 + 10
    k = 0
    while x < x2 - 10:
        ln = 26 + (k * 7) % 13; wd = 6.4 + (k % 3) * 0.9
        sx = x + random.uniform(-1, 1)
        line(di, sx, y1 + 5, sx, y1 + 9, 0.5)
        sal = Image.new('L', (CW, CH), 0); sd = ImageDraw.Draw(sal)
        sd.rounded_rectangle([P(sx - wd / 2, y1 + 9), P(sx + wd / 2, y1 + 9 + ln)], radius=int(wd / 2 * K), fill=255)
        clear(ink, sal.filter(ImageFilter.MaxFilter(5)))
        e = ImageChops.subtract(sal.filter(ImageFilter.MaxFilter(5)), sal)
        ink.paste(ImageChops.lighter(ink, e), (0, 0))
        hatch(ink, ImageChops.multiply(sal, region(box=(sx + wd * 0.08, y1, sx + wd, y2))), 90, 1.1, 0.4)
        for tt in (0.3, 0.55, 0.8):                                         # string ties
            line(di, sx - wd / 2, y1 + 9 + ln * tt, sx + wd / 2, y1 + 9 + ln * tt + 0.8, 0.45, 0)
        x += 15 if (k % 4) != 3 else 22
        k += 1

# window lettering: left, the name in red script with a paper keyline; right, reversed gothic
f_scr = font('Yellowtail.ttf', 46)
km = text_mask('Garfein’s', f_scr, (LW[0] + LW[2]) / 2, 228, stroke=2.2)
clear(ink, km)
nm = text_mask('Garfein’s', f_scr, (LW[0] + LW[2]) / 2, 228)
red.paste(ImageChops.lighter(red, nm), (0, 0))
f_win = font('Antonio.ttf', 15, 700)
for t, yy in (('HOT PASTRAMI', 214), ('CORNED BEEF  ·  TONGUE', 233)):
    clear(ink, text_mask(t, f_win, (RW[0] + RW[2]) / 2, yy, stroke=1.4))
    m = text_mask(t, f_win, (RW[0] + RW[2]) / 2, yy)
    red.paste(ImageChops.lighter(red, m), (0, 0))

# door: recessed, glass upper, panel lower, transom, OPEN card
x1, y1, x2, y2 = DOOR
dm = region(box=(x1, y1, x2, y2))
clear(ink, dm)
hatch(ink, dm, 0, 1.5, 0.5); hatch(ink, dm, 90, 2.8, 0.35)
rect(di, x1, y1, x2, y2, 1.2)
rect(di, x1 + 4, y1 + 2, x2 - 4, y1 + 12, 0.7)                                  # transom
dg = (x1 + 9, y1 + 18, x2 - 9, y1 + 72)
clear(ink, region(box=(dg[0] - 3, dg[1] - 3, dg[2] + 3, dg[3] + 3)))
rect(di, dg[0] - 3, dg[1] - 3, dg[2] + 3, dg[3] + 3, 0.9)
hatch(ink, region(box=dg), 62, 2.4, 0.45)
clear(ink, region(box=(dg[0] + 6, dg[1] + 14, dg[2] - 6, dg[1] + 27)))
rect(di, dg[0] + 6, dg[1] + 14, dg[2] - 6, dg[1] + 27, 0.6)
di.text(P((dg[0] + dg[2]) / 2, dg[1] + 20.8), 'OPEN', font=font('Antonio.ttf', 8.6, 700), fill=255, anchor='mm')
line(di, (dg[0] + dg[2]) / 2 - 6, dg[1] + 14, (dg[0] + dg[2]) / 2, dg[1] + 5, 0.4, 0)
line(di, (dg[0] + dg[2]) / 2 + 6, dg[1] + 14, (dg[0] + dg[2]) / 2, dg[1] + 5, 0.4, 0)
pn = (x1 + 9, y1 + 80, x2 - 9, y2 - 6)
clear(ink, region(box=pn)); rect(di, *pn, 0.9); hatch(ink, region(box=(pn[0] + 3, pn[1] + 3, pn[2] - 3, pn[3] - 3)), 45, 2.6, 0.38)
di.ellipse([P(x2 - 13, y1 + 74), P(x2 - 9, y1 + 78)], fill=255)

# bulkheads under the windows, panelled
for wx1, wy1, wx2, wy2 in (LW, RW):
    rect(di, wx1 - 5, 255, wx2 + 5, 283, 1.0)
    pw = (wx2 - wx1) / 3
    for i in range(3):
        a = wx1 + i * pw + 4; b = a + pw - 8
        rect(di, a, 260, b, 278, 0.7)
        hatch(ink, region(box=(a + 2, 262, b - 2, 276)), 45, 2.7, 0.35)
        hatch(ink, region(box=(a, 276, b, 278)), 0, 0.9, 0.5)

# sidewalk with slab joints, curb
line(di, 0, 284, W, 284, 1.3)
for x in (90, 250, 470, 640): line(di, x, 284, x - 10, H, 0.5)
hatch(ink, region(box=(0, 296, W, H)), 0, 1.0, 0.55)
# fire hydrant on the curb, right of the door
hx = 382 + 0
hx = 690 - 0
hx = 300
hm = Image.new('L', (CW, CH), 0); hd = ImageDraw.Draw(hm)
hd.rounded_rectangle([P(hx - 7, 262), P(hx + 7, 293)], radius=2 * K, fill=255)
hd.pieslice([P(hx - 8, 254), P(hx + 8, 270)], 180, 360, fill=255)
hd.rectangle([P(hx - 9, 261), P(hx + 9, 264)], fill=255)
hd.rectangle([P(hx - 12, 270), P(hx + 12, 276)], fill=255)
hd.rectangle([P(hx - 10, 291), P(hx + 10, 295)], fill=255)
hd.rectangle([P(hx - 2, 249), P(hx + 2, 256)], fill=255)
big = hm.filter(ImageFilter.MaxFilter(5))
clear(ink, big)
ink.paste(ImageChops.lighter(ink, ImageChops.subtract(big, hm)), (0, 0))
hatch(ink, ImageChops.multiply(hm, region(box=(hx + 1, 240, hx + 14, 300))), 90, 1.1, 0.45)
red.paste(ImageChops.lighter(red, ImageChops.multiply(hm, Image.new('L', (CW, CH), 150))), (0, 0))

# ---------------- compose two inks, red out of register ----------------
def plate(cov, rgb, dx=0, dy=0, op=1.0):
    cov = cov.filter(ImageFilter.GaussianBlur(0.6))
    if dx or dy: cov = ImageChops.offset(cov, int(dx * K), int(dy * K))
    lay = Image.new('RGBA', (CW, CH), rgb + (0,)); lay.putalpha(cov.point(lambda v: int(v * op)))
    return lay

out = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
out = Image.alpha_composite(out, plate(red, RED, 0.9, 0.6, 0.92))
out = Image.alpha_composite(out, plate(ink, BLACK, 0, 0, 0.94))
out = out.resize((W * 2, H * 2), Image.LANCZOS)
out.save(os.path.join(D, 'assets', 'storefront.png'))

# ---------------- paper wear: soft edge toning only ----------------
def wear(name, seed):
    rnd = random.Random(seed)
    PW, PH = 816, 1056
    m = Image.new('L', (PW, PH), 0); md = ImageDraw.Draw(m)
    for i in range(46):                                      # edge toning, soft and uneven
        a = 18 + i * 0.0
        md.rectangle([i, i, PW - 1 - i, PH - 1 - i], outline=max(0, int(70 - i * 1.5)))
    for _ in range(30):                                      # big gentle mottles
        x, y, r = rnd.randint(0, PW), rnd.randint(0, PH), rnd.randint(60, 200)
        md.ellipse([x - r, y - r, x + r, y + r], fill=None)
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (PW // 16, PH // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 22))
    mot = mot.resize((PW, PH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    a = ImageChops.add(m, mot)
    lay = Image.new('RGBA', (PW, PH), (120, 88, 40, 0)); lay.putalpha(a.point(lambda v: int(v * 0.55)))
    lay.save(os.path.join(D, 'assets', f'wear-{name}.png'))
wear('front', 3); wear('back', 7)
print('painted')
