"""Paints the front signature: a leasing-brochure cutaway of Nakatomi Plaza on Christmas Eve 1988,
set against the Century City night. One PNG covering the whole front face (672x1344, painted at 2x).
Glass facade on the left, sectioned floors on the right: garage with a limousine, lobby, dark office
floors, the elevator core, the red air handling duct, the gold-lit 30th floor party with its tree,
floors 32 to 34 open for construction, and the roof helipad."""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'assets', 'tower-cutaway.png')
S = 2
W, H = 672 * S, 1344 * S
rnd = random.Random(1988)

def s(*v): return [int(round(x * S)) for x in v]
def lerp(a, b, t): return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

# ---------- sky: charcoal night falling into amber city haze ----------
img = Image.new('RGB', (W, H))
top, mid, haze = (20, 21, 26), (34, 33, 38), (118, 78, 40)
px = img.load()
for y in range(H):
    t = y / H
    if t < 0.55: c = lerp(top, mid, t / 0.55)
    elif t < 0.80: c = lerp(mid, haze, (t - 0.55) / 0.25)
    else: c = lerp(haze, (36, 26, 20), min(1, (t - 0.80) / 0.06))
    for x in range(W): px[x, y] = c
# soft mottled cloud
mot = Image.new('L', (W // 40, H // 40))
for x in range(mot.width):
    for y in range(mot.height): mot.putpixel((x, y), rnd.randint(0, 40))
mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40 * S))
img = Image.composite(Image.new('RGB', (W, H), (90, 70, 52)), img, mot.point(lambda v: v // 3))
d = ImageDraw.Draw(img)

GY = 1080            # ground line
X0, X1 = 330, 620    # tower
CUT = 412            # facade / section split
NF = 35
HT = {n: (40 if n == 30 else 19.5) for n in range(1, NF + 1)}
def fy(n): return GY - sum(HT[k] for k in range(1, n + 1))   # top of floor n

# ---------- distant city: low blocks and lights ----------
for i in range(70):
    bx = rnd.uniform(-10, 672); bw = rnd.uniform(14, 46); bh = rnd.uniform(16, 90)
    if X0 - 20 < bx + bw / 2 < X1 + 20: bh *= 0.5
    d.rectangle(s(bx, GY - bh, bx + bw, GY), fill=(28, 24, 24))
    for j in range(int(bw * bh / 70)):
        lx = bx + rnd.uniform(2, bw - 3); ly = GY - rnd.uniform(3, bh - 3)
        d.rectangle(s(lx, ly, lx + 1.6, ly + 1.2), fill=rnd.choice([(255, 196, 110), (240, 170, 90), (220, 210, 190)]))
# glow along the ground
glow = Image.new('L', (W, H), 0); gd = ImageDraw.Draw(glow)
gd.rectangle(s(0, GY - 40, 672, GY + 6), fill=120)
glow = glow.filter(ImageFilter.GaussianBlur(30 * S))
img = Image.composite(Image.new('RGB', (W, H), (240, 160, 70)), img, glow.point(lambda v: v // 3))
d = ImageDraw.Draw(img)

# palms (silhouettes)
def palm(x, base, h, lean):
    pts = []
    for i in range(30):
        t = i / 29
        pts.append((x + lean * t * t, base - h * t))
    for i in range(len(pts) - 1):
        w = 4.2 - 2 * (i / 30)
        d.line(s(*pts[i], *pts[i + 1]), fill=(18, 14, 14), width=int(w * S))
    cx, cy = pts[-1]
    for k in range(11):
        a = math.radians(-180 + k * 18 + rnd.uniform(-6, 6))
        L = rnd.uniform(26, 40)
        prev = (cx, cy)
        for j in range(1, 12):
            t = j / 11
            nx = cx + math.cos(a) * L * t
            ny = cy + math.sin(a) * L * t * 0.55 + (L * 0.55) * t * t
            d.line(s(*prev, nx, ny), fill=(18, 14, 14), width=int(max(1, 4 - 3 * t) * S))
            for side in (-1, 1):
                fx = nx + math.cos(a + side * 1.2) * 6 * (1 - t)
                fy2 = ny + 5 * (1 - t) + 3
                d.line(s(nx, ny, fx, fy2), fill=(18, 14, 14), width=S)
            prev = (nx, ny)
for x, h, lean in [(24, 230, 10), (70, 180, -8), (128, 150, 6), (262, 120, -4), (650, 210, -12), (612, 140, 8)]:
    palm(x, GY + 4, h, lean)

# ---------- garage (below ground) ----------
d.rectangle(s(0, GY, 672, 1180), fill=(30, 24, 20))
for i in range(260):  # earth speckle
    ex, ey = rnd.uniform(0, 672), rnd.uniform(GY + 2, 1178)
    d.point(s(ex, ey), fill=(52, 42, 34))
d.rectangle(s(300, GY, 652, GY + 76), fill=(62, 60, 58))
d.rectangle(s(304, GY + 4, 648, GY + 36), fill=(46, 47, 50))
d.rectangle(s(304, GY + 40, 648, GY + 72), fill=(46, 47, 50))
d.rectangle(s(300, GY + 36, 652, GY + 40), fill=(80, 78, 74))
for cx in range(330, 640, 52):
    d.rectangle(s(cx, GY + 4, cx + 5, GY + 72), fill=(70, 68, 64))
# garage lamps
for lx in (360, 460, 560):
    for ly in (GY + 6, GY + 42):
        d.rectangle(s(lx, ly, lx + 16, ly + 2), fill=(250, 236, 200))
# ramp
d.polygon(s(300, GY, 330, GY, 360, GY + 36, 330, GY + 36), fill=(86, 84, 80))
# the limousine, parked on P1
lx, ly = 392, GY + 22
d.rounded_rectangle(s(lx, ly, lx + 168, ly + 11), radius=3 * S, fill=(10, 10, 12))
d.polygon(s(lx + 30, ly, lx + 46, ly - 9, lx + 132, ly - 9, lx + 146, ly), fill=(12, 12, 14))
for wx in range(int(lx + 48), int(lx + 128), 21):
    d.rectangle(s(wx, ly - 7, wx + 17, ly - 1), fill=(64, 74, 86))
d.line(s(lx + 2, ly + 3, lx + 166, ly + 3), fill=(205, 170, 90), width=S)
for wx in (lx + 22, lx + 142):
    d.ellipse(s(wx - 8, ly + 5, wx + 8, ly + 21), fill=(8, 8, 8))
    d.ellipse(s(wx - 4, ly + 9, wx + 4, ly + 17), fill=(120, 116, 110))
d.rectangle(s(lx + 164, ly + 2, lx + 168, ly + 6), fill=(255, 230, 170))  # headlamp

# ---------- tower shell ----------
d.rectangle(s(X0 - 4, fy(NF) - 4, X1 + 4, GY), fill=(48, 46, 46))

# facade (left): ribbon windows reflecting amber, gold spandrels
for n in range(1, NF + 1):
    y0, y1 = fy(n), fy(n - 1)
    d.rectangle(s(X0, y0, CUT, y0 + 7), fill=(176, 142, 88))         # spandrel
    for xx in range(X0, CUT):
        t = (xx - X0) / (CUT - X0)
        base = lerp((96, 72, 46), (40, 44, 54), t) if n > 6 else lerp((70, 60, 50), (36, 40, 48), t)
        refl = 0.5 + 0.5 * math.sin((n * 0.7) + t * 3)
        c = lerp(base, (190, 130, 70), 0.25 * refl * (1 - t))
        d.line(s(xx, y0 + 7, xx, y1 - 1), fill=c)
    d.line(s(X0, y1 - 1, CUT, y1 - 1), fill=(30, 28, 28), width=S)
    for m in range(X0 + 13, CUT, 13):
        d.line(s(m, y0 + 7, m, y1 - 1), fill=(36, 34, 34), width=S)
    if rnd.random() < 0.18:  # a lamp left on
        wx = rnd.uniform(X0 + 6, CUT - 18)
        d.rectangle(s(wx, y0 + 9, wx + 11, y1 - 3), fill=(236, 186, 100))
# corner chamfer highlight
d.line(s(X0, fy(NF), X0, GY), fill=(210, 176, 118), width=2 * S)

# section (right): slabs and rooms
SEC0 = CUT + 6
CORE0, CORE1 = 478, 512
for n in range(1, NF + 1):
    y0, y1 = fy(n), fy(n - 1)
    k = rnd.uniform(-6, 6)
    room = (int(40 + k), int(46 + k), int(58 + k))
    if n == 1: room = (92, 84, 70)
    d.rectangle(s(SEC0, y0, X1, y1), fill=room)
    d.rectangle(s(SEC0, y0, X1, y0 + 4), fill=(122, 118, 110))       # slab
    d.rectangle(s(SEC0, y0 + 4, X1, y0 + 7), fill=(30, 32, 38))      # plenum
    if 2 <= n <= 29 and n != 24:
        # partitions, desks, a few lamps
        for px_ in (SEC0 + 18, 560, 596):
            d.line(s(px_, y0 + 7, px_, y1 - 2), fill=(58, 64, 74), width=S)
        if rnd.random() < 0.35:
            wx = rnd.choice([SEC0 + 30, 530, 575, 604])
            g = Image.new('L', (W, H), 0); ImageDraw.Draw(g).ellipse(s(wx - 10, y0 + 6, wx + 10, y1 + 2), fill=170)
            g = g.filter(ImageFilter.GaussianBlur(5 * S))
            img = Image.composite(Image.new('RGB', (W, H), (230, 170, 90)), img, g.point(lambda v: v // 2)); d = ImageDraw.Draw(img)
        for dx in (SEC0 + 30, 530, 575):
            d.rectangle(s(dx, y1 - 7, dx + 14, y1 - 5), fill=(70, 62, 54))
            d.line(s(dx + 2, y1 - 5, dx + 2, y1 - 1), fill=(70, 62, 54), width=S)
    # outer wall glazing at section edge
    d.rectangle(s(X1 - 3, y0 + 7, X1, y1), fill=(90, 110, 130))

# mechanical floor 24
y0, y1 = fy(24), fy(23)
d.rectangle(s(SEC0, y0 + 7, X1, y1), fill=(52, 52, 54))
for mx in (SEC0 + 8, 530, 576):
    d.rectangle(s(mx, y0 + 9, mx + 30, y1 - 2), fill=(84, 84, 86), outline=(30, 30, 30))
    d.ellipse(s(mx + 8, y0 + 10, mx + 20, y1 - 3), outline=(40, 40, 40), width=S)

# lobby: marble, security desk, lit
y0, y1 = fy(1), GY
for xx in range(int(SEC0), X1):
    d.line(s(xx, y0 + 7, xx, y1), fill=lerp((150, 132, 104), (120, 104, 84), (xx - SEC0) / (X1 - SEC0)))
d.rectangle(s(540, y1 - 9, 590, y1), fill=(70, 50, 36))
d.rectangle(s(540, y1 - 11, 590, y1 - 9), fill=(210, 180, 120))
d.rectangle(s(SEC0, y1 - 2, X1, y1), fill=(196, 186, 170))

# construction floors 32 to 34: open slabs, steel, work lamps, plastic sheet
for n in (32, 33, 34):
    y0, y1 = fy(n), fy(n - 1)
    d.rectangle(s(SEC0, y0 + 7, X1, y1), fill=(30, 30, 34))
    for cx in range(int(SEC0) + 6, X1, 22):
        d.rectangle(s(cx, y0 + 7, cx + 3, y1), fill=(110, 92, 70))
        d.line(s(cx + 3, y0 + 8, cx + 19, y1 - 1), fill=(84, 72, 56), width=S)
    for lx_ in (SEC0 + 40, 590):
        d.line(s(lx_, y0 + 7, lx_, y0 + 11), fill=(120, 120, 120), width=S)
        g = Image.new('L', (W, H), 0); ImageDraw.Draw(g).ellipse(s(lx_ - 9, y0 + 7, lx_ + 9, y1 + 1), fill=200)
        g = g.filter(ImageFilter.GaussianBlur(4 * S))
        img = Image.composite(Image.new('RGB', (W, H), (250, 230, 170)), img, g.point(lambda v: v // 2)); d = ImageDraw.Draw(img)
        d.ellipse(s(lx_ - 2, y0 + 10, lx_ + 2, y0 + 14), fill=(255, 246, 210))
    # plastic sheeting over the open edge
    for yy in range(int(y0) + 7, int(y1)):
        d.line(s(X1 - 6, yy, X1, yy), fill=(150, 160, 170) if yy % 3 else (120, 130, 140))
# facade on construction floors: no glass, open frame
for n in (32, 33, 34):
    y0, y1 = fy(n), fy(n - 1)
    d.rectangle(s(X0 + 2, y0 + 7, CUT, y1 - 1), fill=(26, 26, 30))
    for m in range(X0 + 13, CUT, 13):
        d.line(s(m, y0 + 7, m, y1 - 1), fill=(120, 98, 70), width=S)

# 30th floor: the party, gold
y0, y1 = fy(30), fy(29)
for xx in range(int(SEC0), X1):
    t = (xx - SEC0) / (X1 - SEC0)
    d.line(s(xx, y0 + 7, xx, y1), fill=lerp((236, 186, 96), (214, 150, 70), t))
g = Image.new('L', (W, H), 0); ImageDraw.Draw(g).rectangle(s(SEC0 - 10, y0 - 6, X1 + 20, y1 + 6), fill=255)
g = g.filter(ImageFilter.GaussianBlur(10 * S))
img = Image.composite(Image.new('RGB', (W, H), (255, 190, 90)), img, g.point(lambda v: int(v * 0.35))); d = ImageDraw.Draw(img)
for xx in range(int(SEC0), X1):
    t = (xx - SEC0) / (X1 - SEC0)
    d.line(s(xx, y0 + 7, xx, y1), fill=lerp((240, 196, 112), (220, 160, 78), t))
# string lights along the ceiling
for k, xx in enumerate(range(int(SEC0) + 3, X1 - 3, 6)):
    d.ellipse(s(xx, y0 + 8, xx + 2.4, y0 + 10.4), fill=[(200, 30, 30), (40, 140, 60), (255, 250, 220)][k % 3])
# back wall window bays with the night city beyond
for bx in range(int(SEC0) + 4, CORE0 - 4, 16):
    d.rectangle(s(bx, y0 + 12, bx + 12, y1 - 16), fill=(52, 44, 44))
    for j in range(4):
        d.point(s(bx + rnd.uniform(1, 11), rnd.uniform(y1 - 22, y1 - 17)), fill=(255, 210, 130))
# buffet table with trays and glasses
tx = SEC0 + 4
d.rectangle(s(tx, y1 - 11, tx + 54, y1 - 7), fill=(250, 246, 236))
d.rectangle(s(tx + 2, y1 - 7, tx + 52, y1), fill=(226, 216, 196))
for k in range(3):
    d.ellipse(s(tx + 4 + k * 17, y1 - 14, tx + 16 + k * 17, y1 - 10), fill=(214, 214, 220), outline=(140, 140, 150))
d.rectangle(s(CORE1 + 4, y1 - 11, CORE1 + 34, y1 - 7), fill=(250, 246, 236))
d.rectangle(s(CORE1 + 6, y1 - 7, CORE1 + 32, y1), fill=(226, 216, 196))
for k in range(6):
    gx = CORE1 + 8 + k * 4.4
    d.polygon(s(gx, y1 - 17, gx + 2.6, y1 - 17, gx + 1.3, y1 - 13), fill=(250, 240, 200))
    d.line(s(gx + 1.3, y1 - 13, gx + 1.3, y1 - 11), fill=(240, 236, 220), width=S)
# the tree, tall
tx, tb = 588, y1
d.rectangle(s(tx - 2, tb - 4, tx + 2, tb), fill=(90, 60, 30))
for i, w in enumerate([15, 12.5, 10, 7.5, 5]):
    yb = tb - 3 - i * 5.5
    d.polygon(s(tx - w, yb, tx + w, yb, tx, yb - 10), fill=(22, 92 + i * 6, 50))
d.polygon(s(tx, tb - 37, tx + 2.4, tb - 32, tx - 2.4, tb - 32), fill=(255, 220, 90))
for k in range(26):
    a = rnd.uniform(0, 1); yy = tb - 4 - a * 28; ww = 14 * (1 - a) + 1
    bx = tx + rnd.uniform(-ww, ww)
    d.ellipse(s(bx - 0.9, yy - 0.9, bx + 0.9, yy + 0.9),
              fill=rnd.choice([(220, 36, 36), (255, 214, 90), (250, 250, 230)]))
# gifts under the tree
for gx, gc in [(574, (196, 38, 46)), (600, (214, 170, 70)), (606, (196, 38, 46))]:
    d.rectangle(s(gx - 3, tb - 5, gx + 3, tb), fill=gc); d.line(s(gx, tb - 5, gx, tb), fill=(250, 240, 210), width=S)
# facade of 30: every window lit
d.rectangle(s(X0 + 1, y0 + 7, CUT, y1 - 1), fill=(244, 196, 110))
for m in range(X0 + 13, CUT, 13):
    d.line(s(m, y0 + 7, m, y1 - 1), fill=(150, 104, 50), width=S)

# elevator core, full height
d.rectangle(s(CORE0, fy(NF) + 7, CORE1, GY), fill=(18, 18, 22))
for cx in (CORE0 + 11, CORE0 + 23):
    d.line(s(cx, fy(NF) + 7, cx, GY), fill=(92, 92, 96), width=S)
d.rectangle(s(CORE0, fy(NF) + 7, CORE1, fy(NF) + 7 + 3), fill=(80, 80, 84))
for n in range(1, NF + 1):
    d.line(s(CORE0, fy(n) + 4, CORE1, fy(n) + 4), fill=(44, 44, 50), width=S)
# cars: one on 30, one waiting low
for n in (30, 6):
    y0, y1 = fy(n), fy(n - 1)
    d.rectangle(s(CORE0 + 3, y0 + 8, CORE1 - 3, y1 - 1), fill=(160, 150, 136), outline=(60, 56, 50))
    d.line(s((CORE0 + CORE1) / 2, y0 + 8, (CORE0 + CORE1) / 2, y1 - 1), fill=(90, 84, 76), width=S)

# air handling: red duct above 30 into the core, down to the plant room on 24
RED = (196, 38, 46)
yd = fy(30) + 4.5
d.rectangle(s(SEC0, yd - 2, CORE0, yd + 2), fill=RED)
d.rectangle(s(CORE1 + 2, fy(NF) + 7, CORE1 + 7, fy(23)), fill=RED)
d.rectangle(s(CORE1 + 2, yd - 2, X1 - 4, yd + 2), fill=RED)
for yy in range(int(fy(NF)) + 10, int(fy(23)), 6):
    d.line(s(CORE1 + 2, yy, CORE1 + 7, yy), fill=(140, 24, 30), width=S)
# grilles
for gx in (SEC0 + 22, 548, 590):
    d.rectangle(s(gx, yd + 2, gx + 6, yd + 4), fill=(120, 20, 24))

# ---------- roof: parapet, helipad, antenna ----------
RT = fy(NF)
d.rectangle(s(X0 - 6, RT - 6, X1 + 6, RT + 2), fill=(70, 68, 66))
d.rectangle(s(X0 + 40, RT - 20, X1 - 40, RT - 6), fill=(58, 56, 56))
d.rectangle(s(X0 + 60, RT - 23, X1 - 60, RT - 20), fill=(110, 106, 100))
pad_cx = (X0 + X1) / 2
d.ellipse(s(pad_cx - 66, RT - 28, pad_cx + 66, RT - 18), fill=(80, 80, 84), outline=(230, 220, 200), width=S)
d.text((0, 0), '')
# H marking in perspective (flat on the pad)
hx, hy = pad_cx, RT - 23
d.rectangle(s(hx - 9, hy - 2.5, hx - 6, hy + 2.5), fill=(240, 236, 226))
d.rectangle(s(hx + 6, hy - 2.5, hx + 9, hy + 2.5), fill=(240, 236, 226))
d.rectangle(s(hx - 6, hy - 0.6, hx + 6, hy + 0.6), fill=(240, 236, 226))
d.line(s(X1 - 26, RT - 6, X1 - 26, RT - 66), fill=(120, 116, 110), width=2 * S)
d.ellipse(s(X1 - 29, RT - 70, X1 - 23, RT - 64), fill=(230, 40, 40))
g = Image.new('L', (W, H), 0); ImageDraw.Draw(g).ellipse(s(X1 - 38, RT - 79, X1 - 14, RT - 55), fill=200)
g = g.filter(ImageFilter.GaussianBlur(6 * S))
img = Image.composite(Image.new('RGB', (W, H), (255, 60, 60)), img, g.point(lambda v: v // 2)); d = ImageDraw.Draw(img)
d.ellipse(s(X1 - 28, RT - 69, X1 - 24, RT - 65), fill=(255, 120, 110))

# section cut edge: torn concrete line between facade and interior
pts = []
for y in range(int(RT), GY + 1, 4):
    pts.append((CUT + 3 + rnd.uniform(-2, 2), y))
d.line([tuple(int(v * S) for v in p) for p in pts], fill=(150, 146, 138), width=3 * S)

# ---------- finish: glass sheen, softening, gentle grain ----------
sheen = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(sheen)
sd.polygon(s(X0, fy(NF) + 80, CUT, fy(NF) - 20, CUT, fy(NF) + 160, X0, fy(NF) + 260), fill=90)
sd.polygon(s(X0, 760, CUT, 640, CUT, 700, X0, 820), fill=60)
sheen = sheen.filter(ImageFilter.GaussianBlur(14 * S))
img = Image.composite(Image.new('RGB', (W, H), (255, 214, 150)), img, sheen.point(lambda v: v // 2))
img = img.filter(ImageFilter.GaussianBlur(0.55 * S))
mot2 = Image.new('L', (W // 6, H // 6))
for x in range(mot2.width):
    for y in range(mot2.height): mot2.putpixel((x, y), rnd.randint(0, 255))
mot2 = mot2.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(2 * S))
img = Image.composite(Image.new('RGB', (W, H), (255, 236, 200)), img, mot2.point(lambda v: max(0, v - 150) // 10))
noise = Image.effect_noise((W // 2, H // 2), 22).resize((W, H), Image.BICUBIC)
img = Image.composite(Image.new('RGB', (W, H), (0, 0, 0)), img, noise.point(lambda v: max(0, (v - 128)) // 6))
img = img.filter(ImageFilter.UnsharpMask(2, 40, 2))
# vignette
v = Image.new('L', (W, H), 0); vd = ImageDraw.Draw(v)
for i in range(60):
    vd.rectangle([i * S * 2, i * S * 2, W - 1 - i * S * 2, H - 1 - i * S * 2], outline=int(110 - i * 1.8))
v = v.filter(ImageFilter.GaussianBlur(30 * S))
img = Image.composite(Image.new('RGB', (W, H), (8, 8, 10)), img, v)
img.save(OUT, quality=92)
print('painted', OUT, img.size)
