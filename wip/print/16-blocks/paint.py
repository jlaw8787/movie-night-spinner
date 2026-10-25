"""Paints the signature piece: the shop's printed delivery map of the sixteen blocks,
precinct to the courts, engraved style in two inks (navy and yellow) on cream.
Also paints the board wear overlay. Writes assets/map16.png and assets/wear-board.png."""
import os, random, math
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
random.seed(16)

W, H = 864, 1096          # 2x of the 432x548 display box
K = 2                     # supersample
NAVY = (22, 38, 66)
YEL = (242, 182, 48)
CREAM = (242, 233, 212)
BLOCK = (226, 214, 184)
CHINA = (232, 205, 150)
def F(n, s): return ImageFont.truetype(os.path.join(D, 'fonts', n), int(s * K))
def k(*v): return [int(round(x * K)) for x in v]

img = Image.new('RGB', (W * K, H * K), CREAM)
d = ImageDraw.Draw(img)

# hatch pattern sheets
def hatch_sheet(gap, ang, width=1):
    s = Image.new('L', img.size, 0); hd = ImageDraw.Draw(s)
    L = W * K + H * K
    for i in range(-L, L, int(gap * K)):
        x0, y0 = i, 0
        x1, y1 = i + math.tan(math.radians(ang)) * H * K, H * K
        hd.line([(x0, y0), (x1, y1)], fill=255, width=int(width * K))
    return s
H45 = hatch_sheet(5, 45)
H45f = hatch_sheet(3.2, 45)
HV = hatch_sheet(4, 0)
def hatch(box, sheet, col=NAVY, poly=None):
    m = Image.new('L', img.size, 0); md = ImageDraw.Draw(m)
    if poly: md.polygon([(x * K, y * K) for x, y in poly], fill=255)
    else: md.rectangle(k(*box), fill=255)
    m = ImageChops.multiply(m, sheet)
    img.paste(col, (0, 0), m)

# ---- grid ----
X0, Y0, BX, BY = 150, 200, 79, 70
widths = [70, 84, 74, 90, 72, 86, 76, 80, 90]
xs = [X0 - 170, X0 - 84, X0]
for w_ in widths: xs.append(xs[-1] + w_)
ys = [Y0 + j * BY for j in range(-2, 15)]
SW = {}   # street half widths
def hw_x(x): return 13 if x == X0 else 8
def hw_y(y): return 13 if y == Y0 + 8 * BY else 8
EAST_Y = Y0 + 8 * BY
END_X = xs[2 + 8]

# blocks
MERGE = {(4, 2), (7, 3), (1, 3), (9, 5), (6, 1), (0, 6), (5, 11), (8, 0)}
for i in range(len(xs) - 1):
    for j in range(len(ys) - 1):
        l = xs[i] + hw_x(xs[i]); r = xs[i + 1] - hw_x(xs[i + 1])
        t = ys[j] + hw_y(ys[j]); b = ys[j + 1] - hw_y(ys[j + 1])
        if r < 0 or l > W or b < 0 or t > H: continue
        # leave room for the two vignettes and the legend
        l, r, t, b = max(l, 18), min(r, W - 18), max(t, 18), min(b, H - 18)
        if r - l < 24 or b - t < 24: continue
        if t < 172 and l < 300: continue
        if t < 190 and r > 690: continue
        if b > EAST_Y + 20 and r > 500: continue
        if (i, j - 1) in MERGE: continue
        if (i, j) in MERGE: b = ys[j + 2] - hw_y(ys[j + 2])
        china = (EAST_Y - 2 * BY - 5 < t < EAST_Y + BY + 5) and l > X0 + 2 * BX - 5
        park = (i == 3 and j == 6)
        fill = CHINA if china else BLOCK
        if park: fill = (214, 216, 186)
        d.rounded_rectangle(k(l, t, r, b), radius=4 * K, fill=fill, outline=NAVY, width=2 * K)
        if park:
            for _ in range(26):
                cx = random.uniform(l + 10, r - 10); cy = random.uniform(t + 10, b - 10); rr = random.uniform(5, 8)
                d.ellipse(k(cx - rr, cy - rr, cx + rr, cy + rr), outline=NAVY, width=K, fill=(200, 204, 168))
                hatch((cx - rr + 2, cy, cx + rr - 2, cy + rr - 2), H45f)
            continue
        # building lots along long edges
        n = random.randint(3, 5)
        cuts = sorted(random.sample(range(int(l) + 10, int(r) - 10), n - 1))
        midy = (t + b) / 2 + random.uniform(-8, 8)
        d.line(k(l + 3, midy, r - 3, midy), fill=NAVY, width=K)
        for c in cuts:
            d.line(k(c, t + 2, c, midy), fill=NAVY, width=K)
        cuts2 = sorted(random.sample(range(int(l) + 10, int(r) - 10), n - 1))
        for c in cuts2:
            d.line(k(c, midy, c, b - 2), fill=NAVY, width=K)
        # shadow on south and east sides
        hatch((l + 3, b - 9, r - 3, b - 2), H45)
        hatch((r - 9, t + 3, r - 2, b - 3), H45)
        # a rooftop tank or two
        for _ in range(1 if random.random() < 0.35 else 0):
            cx = random.uniform(l + 12, r - 18); cy = random.uniform(t + 10, b - 18)
            d.ellipse(k(cx, cy, cx + 7, cy + 7), outline=NAVY, width=K, fill=CREAM)

# ---- route ----
pts = [(X0, Y0 - 34), (X0, EAST_Y), (END_X, EAST_Y)]
d.line([tuple(k(*p)) for p in pts], fill=NAVY, width=20 * K, joint='curve')
yl = Image.new('RGB', img.size, YEL)
m = Image.new('L', img.size, 0); ImageDraw.Draw(m).line([tuple(k(p[0] + 1.5, p[1] + 1)) for p in pts], fill=255, width=15 * K, joint='curve')
img.paste(yl, (0, 0), m)
d = ImageDraw.Draw(img)
# centre dashes
for a, b in zip(pts, pts[1:]):
    L = math.dist(a, b); n = int(L // 14)
    for s in range(0, n, 2):
        p0 = (a[0] + (b[0] - a[0]) * s / n, a[1] + (b[1] - a[1]) * s / n)
        p1 = (a[0] + (b[0] - a[0]) * (s + 1) / n, a[1] + (b[1] - a[1]) * (s + 1) / n)
        d.line(k(*p0, *p1), fill=NAVY, width=2 * K)

# block numbers
fN = F('BSD-800.ttf', 21)
marks = [(X0, Y0 + (n - 0.5) * BY) for n in range(1, 9)] + [((xs[1 + n] + xs[2 + n]) / 2, EAST_Y) for n in range(1, 9)]
for n, (x, y) in enumerate(marks, 1):
    r = 14
    d.ellipse(k(x - r, y - r, x + r, y + r), fill=NAVY, outline=CREAM, width=2 * K)
    d.text(k(x, y + 1), str(n), font=fN, fill=CREAM, anchor='mm')

# street names
def label(text, x, y, size=17, rot=0, col=NAVY, font='BSD-800.ttf', track=3):
    f = F(font, size)
    t = ' '.join(text) if track else text
    t = text
    bb = f.getbbox(t)
    tw = bb[2] - bb[0] + int(track * K) * len(t); th = bb[3] - bb[1]
    tile = Image.new('L', (tw + 8 * K, th + 10 * K), 0); td = ImageDraw.Draw(tile)
    cx = 4 * K
    for ch in t:
        td.text((cx, 3 * K - bb[1]), ch, font=f, fill=255)
        cx += f.getlength(ch) + int(track * K)
    if rot: tile = tile.rotate(rot, expand=True, resample=Image.BICUBIC)
    img.paste(col, (int(x * K - tile.width / 2), int(y * K - tile.height / 2)), tile)

def plate(text, x, y, size=17, rot=0):
    # street name on a cream plate so it reads over the route
    label(text, x, y, size, rot)

label('BROADWAY', X0 - 30, Y0 + 3.5 * BY + 4, 18, 90)
label('CANAL ST', (xs[6] + xs[7]) / 2, EAST_Y + 30, 18)
cxl, cyl = (xs[6] + xs[8]) / 2 + 30, ys[2 + 6] + BY / 2
d.rectangle(k(cxl - 110, cyl - 20, cxl + 110, cyl + 20), fill=CREAM, outline=NAVY, width=2 * K)
label('CHINATOWN', cxl + 4, cyl, 26, 0, NAVY, 'BSD-800.ttf', 9)
label('WALKER ST', (xs[8] + xs[9]) / 2, ys[2 + 4], 14, 0)
label('SQUARE', (xs[3] + xs[4]) / 2, ys[7] + 14, 14, 0)

# shop marker at block 8, the corner
cx, cy = X0, EAST_Y
d.ellipse(k(cx - 24, cy - 24, cx + 24, cy + 24), fill=YEL, outline=NAVY, width=3 * K)
d.ellipse(k(cx - 15, cy - 15, cx + 15, cy + 15), fill=NAVY)
d.ellipse(k(cx - 6, cy - 6, cx + 6, cy + 6), fill=YEL)
# callout
bx0, by0 = 22, EAST_Y + 46
d.line(k(cx - 8, cy + 22, bx0 + 70, by0), fill=NAVY, width=2 * K)
d.rectangle(k(bx0, by0, bx0 + 236, by0 + 62), fill=NAVY)
label('DOCKET, WE ARE HERE', bx0 + 118, by0 + 21, 21, 0, CREAM)
label('HALFWAY, BLOCK 8', bx0 + 118, by0 + 46, 16, 0, YEL)

# bus stop sign on the east leg, block 11
bx, by = X0 + 10.5 * BX - 0 , EAST_Y - 40
bx = (xs[4] + xs[5]) / 2
d.line(k(bx, by + 8, bx, EAST_Y - 14), fill=NAVY, width=3 * K)
d.rounded_rectangle(k(bx - 28, by - 22, bx + 28, by + 10), radius=5 * K, fill=CREAM, outline=NAVY, width=2 * K)
label('BUS', bx, by - 6, 18, 0)

# ---- vignette: precinct (top left) ----
px, py = 34, 18
pw, ph = 236, 140
d.rectangle(k(px, py + 14, px + pw, py + ph), fill=(214, 190, 160), outline=NAVY, width=2 * K)
d.rectangle(k(px - 6, py + 6, px + pw + 6, py + 16), fill=NAVY)
hatch((px + 2, py + 16, px + pw - 2, py + ph - 2), hatch_sheet(6, 0))  # brick courses
d = ImageDraw.Draw(img)
for row in range(3):
    for col in range(6):
        wx = px + 14 + col * 37; wy = py + 26 + row * 30
        if row == 2 and col in (2, 3): continue
        d.rectangle(k(wx, wy, wx + 20, wy + 20), fill=CREAM, outline=NAVY, width=2 * K)
        d.line(k(wx, wy + 10, wx + 20, wy + 10), fill=NAVY, width=K)
        hatch((wx + 1, wy + 1, wx + 19, wy + 6), H45f)
d = ImageDraw.Draw(img)
dx = px + pw / 2
d.rectangle(k(dx - 22, py + 88, dx + 22, py + ph), fill=NAVY)
d.rectangle(k(dx - 30, py + 82, dx + 30, py + 90), fill=NAVY)
for s in (-1, 1):
    lx = dx + s * 40
    d.line(k(lx, py + 100, lx, py + ph), fill=NAVY, width=3 * K)
    d.ellipse(k(lx - 9, py + 88, lx + 9, py + 106), fill=YEL, outline=NAVY, width=2 * K)
d.rectangle(k(px - 10, py + ph, px + pw + 10, py + ph + 6), fill=NAVY)
label('THE PRECINCT', px + pw / 2 + 74, py + ph + 22, 19, 0)

# ---- vignette: courthouse (bottom right) ----
cx0, cy0, cw = 528, EAST_Y + 52, 300
top = cy0 + 54
d.polygon([tuple(k(cx0 - 6, top)), tuple(k(cx0 + cw / 2, cy0)), tuple(k(cx0 + cw + 6, top))], fill=CREAM, outline=NAVY)
d.line([tuple(k(cx0 - 6, top)), tuple(k(cx0 + cw / 2, cy0)), tuple(k(cx0 + cw + 6, top)), tuple(k(cx0 - 6, top))], fill=NAVY, width=3 * K)
hatch(None, H45f, poly=[(cx0 + 30, top - 6), (cx0 + cw / 2, cy0 + 12), (cx0 + cw - 30, top - 6)])
d = ImageDraw.Draw(img)
d.rectangle(k(cx0 - 10, top, cx0 + cw + 10, top + 14), fill=NAVY)
label('COURTHOUSE', cx0 + cw / 2, top - 14, 15, 0)
colh = 116
for c in range(8):
    x = cx0 + 8 + c * (cw - 16) / 7.0
    d.rectangle(k(x - 9, top + 14, x + 9, top + 14 + colh), fill=CREAM, outline=NAVY, width=2 * K)
    hatch((x + 2, top + 16, x + 8, top + 12 + colh), HV)
    d = ImageDraw.Draw(img)
    d.rectangle(k(x - 12, top + 14, x + 12, top + 20), fill=NAVY)
hatch((cx0 + 2, top + 22, cx0 + cw - 2, top + 12 + colh), hatch_sheet(7, 45))
d = ImageDraw.Draw(img)
for c in range(8):
    x = cx0 + 8 + c * (cw - 16) / 7.0
    d.rectangle(k(x - 9, top + 20, x + 9, top + 14 + colh), fill=CREAM, outline=NAVY, width=2 * K)
    hatch((x + 3, top + 22, x + 8, top + 12 + colh), HV)
d = ImageDraw.Draw(img)
sy = top + 14 + colh
for s in range(6):
    inset = 10 - s * 7
    d.rectangle(k(cx0 + inset - 6, sy + s * 7, cx0 + cw - inset + 6, sy + s * 7 + 7), fill=CREAM, outline=NAVY, width=K * 2)
# route arrow into the steps
d.line(k(END_X, EAST_Y, END_X, EAST_Y + 6), fill=NAVY, width=K)
d.polygon([tuple(k(END_X - 14, EAST_Y + 14)), tuple(k(END_X + 14, EAST_Y + 14)), tuple(k(END_X, EAST_Y + 34))], fill=NAVY)
label('THE COURTS', cx0 + cw / 2, sy + 60, 24, 0)

# ---- compass ----
nx, ny = 800, 100
d.polygon([tuple(k(nx, ny - 34)), tuple(k(nx + 11, ny)), tuple(k(nx, ny - 6)), tuple(k(nx - 11, ny))], fill=NAVY)
d.polygon([tuple(k(nx, ny + 34)), tuple(k(nx + 11, ny)), tuple(k(nx, ny + 6)), tuple(k(nx - 11, ny))], outline=NAVY, fill=CREAM)
d.ellipse(k(nx - 22, ny - 22, nx + 22, ny + 22), outline=NAVY, width=K)
label('N', nx, ny - 48, 18, 0)
# scale
d.rectangle(k(620, 64, 620 + BX, 72), outline=NAVY, width=K * 2, fill=CREAM)
d.rectangle(k(620, 64, 620 + BX / 2, 72), fill=NAVY)
label('ONE BLOCK', 620 + BX / 2, 90, 14, 0)

# border
d.rectangle(k(3, 3, W - 4, H - 4), outline=NAVY, width=4 * K)
d.rectangle(k(11, 11, W - 12, H - 12), outline=NAVY, width=K)

# finish: soft ink spread and paper mottle
img = img.resize((W, H), Image.LANCZOS)
mott = Image.effect_noise((W // 16, H // 16), 30).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))
mott = mott.point(lambda v: 128 + (v - 128) * 0.5)
img = ImageChops.multiply(img, Image.merge('RGB', [mott.point(lambda v: min(255, v + 140))] * 3))
img.save(os.path.join(A, 'map16.png'))

# board wear: soft edge darkening only, low detail
BW, BH = 1344 * 2, 816 * 2
w = Image.new('L', (BW // 8, BH // 8), 0)
wd = ImageDraw.Draw(w)
for i in range(40):
    a = int(i * 3.2)
    wd.rectangle((i, i, BW // 8 - 1 - i, BH // 8 - 1 - i), outline=max(0, 130 - a))
w = w.resize((BW, BH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
rgba = Image.new('RGBA', (BW, BH), (8, 14, 28, 0)); rgba.putalpha(w)
rgba.save(os.path.join(A, 'wear-board.png'))
print('ok')
