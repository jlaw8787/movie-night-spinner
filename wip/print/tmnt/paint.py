"""Paints the signature piece: a cutaway map of the block above and the sewers below, 1990.
Street level: April's building with the antique shop downstairs, Corner Grate Pizza, the rooftops.
Below: the manhole drop with a pizza box falling, the long brick tunnel, the lair. No characters drawn.
Printed look: three spot inks (sewer green, pizza box red, iron grey) plus black, halftone shading.
Output: assets/sewer-map.png at 2x (2544 x 660)."""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
W1, H1, S = 1272, 330, 2
W, H = W1 * S, H1 * S
R = random.Random(1990)

PAPER = (226, 233, 210)
GREEN = (46, 92, 52)
GREEN_L = (110, 150, 92)
RED = (196, 38, 46)
IRON = (62, 66, 70)
IRON_L = (120, 124, 126)
BLACK = (24, 28, 26)
GLOW = (246, 236, 196)

im = Image.new('RGB', (W, H), PAPER)
d = ImageDraw.Draw(im)
s = lambda v: int(round(v * S))
def rect(x0, y0, x1, y1, fill=None, outline=None, w=1):
    d.rectangle([s(x0), s(y0), s(x1), s(y1)], fill=fill, outline=outline, width=s(w) if outline else 0)
def poly(pts, fill=None, outline=None, w=1):
    d.polygon([(s(x), s(y)) for x, y in pts], fill=fill, outline=outline)
    if outline and w > 1:
        d.line([(s(x), s(y)) for x, y in pts + [pts[0]]], fill=outline, width=s(w))
def line(pts, fill, w=1):
    d.line([(s(x), s(y)) for x, y in pts], fill=fill, width=max(1, s(w)))
def ell(x0, y0, x1, y1, fill=None, outline=None, w=1):
    d.ellipse([s(x0), s(y0), s(x1), s(y1)], fill=fill, outline=outline, width=s(w) if outline else 0)

def halftone(box, ink, f, step=4.0, maxr=1.9):
    """Dot screen inside box; f(x, y) gives coverage 0 to 1 (1x coords)."""
    x0, y0, x1, y1 = box
    y = y0
    row = 0
    while y < y1:
        x = x0 + (step / 2 if row % 2 else 0)
        while x < x1:
            c = f(x, y)
            if c > 0.03:
                r = maxr * math.sqrt(min(1, c))
                d.ellipse([s(x - r), s(y - r), s(x + r), s(y + r)], fill=ink)
            x += step
        y += step * 0.866
        row += 1

STREET = 172      # top of sidewalk
GROUND = 190      # bottom of roadway
TUN_T, TUN_B = 232, 318   # main tunnel

# ---------------- sky ----------------
rect(0, 0, W1, STREET, fill=(48, 54, 60))
halftone((0, 0, W1, STREET), (34, 38, 44), lambda x, y: 0.9 - y / STREET * 0.8, 4.2, 2.1)
for i in range(70):  # a few stars over the city
    x, y = R.uniform(0, W1), R.uniform(4, 60)
    ell(x - 0.6, y - 0.6, x + 0.6, y + 0.6, fill=(200, 205, 196))
# a big moon low over the rooftops
mg = Image.new('L', (W, H), 0); ImageDraw.Draw(mg).ellipse([s(560), s(-30), s(680), s(90)], fill=150)
mg = mg.filter(ImageFilter.GaussianBlur(s(18)))
im = Image.composite(Image.new('RGB', (W, H), (120, 130, 126)), im, mg); d = ImageDraw.Draw(im)
ell(586, -4, 654, 64, fill=(226, 228, 206))
halftone((586, -4, 654, 64), (196, 198, 176), lambda x, y: 0.5 if (x - 608) ** 2 + (y - 20) ** 2 < 140 or (x - 632) ** 2 + (y - 40) ** 2 < 60 else 0, 3, 1.5)
# far skyline, iron grey silhouettes
x = 0
while x < W1:
    bw = R.uniform(26, 60); bh = R.uniform(60, 130)
    rect(x, STREET - bh, x + bw, STREET, fill=(70, 76, 80))
    for wy in range(int(STREET - bh + 8), STREET - 10, 9):
        for wx in range(int(x + 5), int(x + bw - 5), 7):
            if R.random() < 0.22:
                rect(wx, wy, wx + 2.4, wy + 3.6, fill=(170, 172, 150))
    if R.random() < 0.25:  # antenna
        line([(x + bw / 2, STREET - bh), (x + bw / 2, STREET - bh - 18)], (70, 76, 80), 1.2)
    x += bw + R.uniform(-4, 6)
# a tall broadcast tower far right, red light on top
rect(1176, 20, 1186, STREET, fill=(78, 84, 88))
poly([(1172, 26), (1190, 26), (1181, 2)], fill=(78, 84, 88))
line([(1181, 2), (1181, -10)], (78, 84, 88), 1.4)
ell(1178, -2, 1184, 4, fill=RED)

BOXES = []
def bricks(x0, y0, x1, y1, base, mortar, bh=5.0, bw=12.0, var=14):
    if y1 <= STREET + 1: BOXES.append((x0, y0, x1, y1))
    rect(x0, y0, x1, y1, fill=mortar)
    yy = y0; row = 0
    while yy < y1:
        xx = x0 - (bw / 2 if row % 2 else 0)
        while xx < x1:
            v = R.randint(-var, var)
            c = tuple(max(0, min(255, k + v)) for k in base)
            rect(max(x0, xx + 0.6), yy + 0.6, min(x1, xx + bw - 0.6), min(y1, yy + bh - 0.6), fill=c)
            xx += bw
        yy += bh; row += 1

def windows(x0, x1, top, floors, fh, lit=(), cols=3, ww=16, wh=20, frame=BLACK):
    gap = (x1 - x0 - cols * ww) / (cols + 1)
    for f in range(floors):
        for c in range(cols):
            wx = x0 + gap + c * (ww + gap); wy = top + f * fh + (fh - wh) / 2
            on = (f, c) in lit
            rect(wx - 2, wy - 2, wx + ww + 2, wy + wh + 3, fill=(196, 190, 170))  # lintel and sill stone
            rect(wx, wy, wx + ww, wy + wh, fill=GLOW if on else (30, 34, 40))
            if on:
                halftone((wx, wy, wx + ww, wy + wh), (232, 200, 120), lambda x, y: (y - wy) / wh * 0.6, 3, 1.2)
            line([(wx + ww / 2, wy), (wx + ww / 2, wy + wh)], frame, 1)
            line([(wx, wy + wh / 2), (wx + ww, wy + wh / 2)], frame, 1)

def fire_escape(x0, x1, top, floors, fh):
    for f in range(1, floors):
        y = top + f * fh - 2
        rect(x0, y, x1, y + 2, fill=BLACK)
        for k in range(int(x0), int(x1), 5):
            line([(k, y), (k, y - 9)], BLACK, 0.7)
        line([(x0, y - 9), (x1, y - 9)], BLACK, 0.9)
        # ladder to the next landing
        lx = x1 - 10 if f % 2 else x0 + 6
        line([(lx, y), (lx + 6, y + fh - 4)], BLACK, 0.9)

def water_tower(cx, base, scale=1.0):
    w, h = 30 * scale, 34 * scale
    for lx in (-w / 2 + 3, -w / 6, w / 6, w / 2 - 3):
        line([(cx + lx, base), (cx + lx * 0.8, base - 16 * scale)], BLACK, 1.1)
    line([(cx - w / 2 + 3, base - 6 * scale), (cx + w / 2 - 3, base - 6 * scale)], BLACK, 0.8)
    rect(cx - w / 2, base - 16 * scale - h, cx + w / 2, base - 16 * scale, fill=(92, 70, 52))
    for k in range(int(cx - w / 2) + 3, int(cx + w / 2), 4):
        line([(k, base - 16 * scale - h), (k, base - 16 * scale)], (70, 52, 38), 0.7)
    for hy in (0.25, 0.6, 0.9):
        line([(cx - w / 2, base - 16 * scale - h * hy), (cx + w / 2, base - 16 * scale - h * hy)], BLACK, 0.9)
    poly([(cx - w / 2 - 2, base - 16 * scale - h), (cx + w / 2 + 2, base - 16 * scale - h), (cx, base - 16 * scale - h - 16 * scale)], fill=BLACK)

# ---------------- April's building with the antique shop ----------------
AX0, AX1, ATOP = 40, 300, 30
bricks(AX0, ATOP, AX1, STREET, (150, 74, 56), (116, 108, 96))
rect(AX0 - 4, ATOP - 6, AX1 + 4, ATOP, fill=(186, 178, 160))      # cornice
for k in range(int(AX0), int(AX1), 8):
    rect(k, ATOP, k + 4, ATOP + 4, fill=(186, 178, 160))
windows(AX0, AX1, ATOP + 6, 4, 28, lit={(1, 1), (1, 2), (0, 0)}, cols=4, ww=18, wh=18)
fire_escape(AX0 + 150, AX0 + 250, ATOP + 6, 4, 28)
# shop front
rect(AX0, 128, AX1, STREET, fill=(60, 44, 34))
rect(AX0 + 10, 132, AX1 - 10, 146, fill=(210, 200, 176))            # sign board (lettered in HTML)
rect(AX0 + 16, 150, AX0 + 110, STREET - 2, fill=(196, 176, 120))     # warm display window
halftone((AX0 + 16, 150, AX0 + 110, STREET - 2), (150, 110, 60), lambda x, y: 0.5, 3.2, 1.3)
for k in range(5):  # antique clutter silhouettes in the window
    cx = AX0 + 26 + k * 18
    rect(cx, 160 - (k % 3) * 3, cx + 9, STREET - 2, fill=(70, 50, 34))
ell(AX0 + 80, 152, AX0 + 96, 164, fill=(70, 50, 34))
rect(AX0 + 124, 150, AX0 + 150, STREET, fill=(40, 30, 24))           # door
rect(AX0 + 164, 150, AX1 - 16, STREET - 2, fill=(196, 176, 120))
halftone((AX0 + 164, 150, AX1 - 16, STREET - 2), (150, 110, 60), lambda x, y: 0.5, 3.2, 1.3)
water_tower(AX0 + 50, ATOP - 6, 0.9)

# small walk-up between
bricks(300, 64, 380, STREET, (120, 110, 100), (96, 92, 86), 4.5, 11)
windows(300, 380, 70, 3, 30, lit={(2, 0)}, cols=2, ww=14, wh=18)
rect(306, 150, 374, STREET, fill=(48, 50, 52))

# ---------------- Corner Grate Pizza block ----------------
PX0, PX1, PTOP = 470, 760, 52
bricks(380, PTOP + 30, PX0, STREET, (104, 96, 90), (86, 82, 78), 4.5, 11)
windows(380, PX0, PTOP + 36, 2, 30, cols=2, ww=14, wh=18)
rect(380, 142, PX0, STREET, fill=(40, 44, 46))
bricks(PX0, PTOP, PX1, STREET, (176, 150, 112), (140, 124, 100))
rect(PX0 - 4, PTOP - 6, PX1 + 4, PTOP, fill=(206, 196, 172))
windows(PX0, PX1, PTOP + 4, 2, 32, lit={(0, 2), (1, 0), (1, 3)}, cols=5, ww=18, wh=20)
fire_escape(PX0 + 40, PX0 + 150, PTOP + 4, 3, 32)
water_tower(PX1 - 50, PTOP - 6, 1.05)
# rooftop vent and stair bulkhead
rect(PX0 + 20, PTOP - 22, PX0 + 54, PTOP - 6, fill=(96, 92, 86))
rect(PX0 + 30, PTOP - 30, PX0 + 44, PTOP - 22, fill=(96, 92, 86))
# shopfront
rect(PX0, 122, PX1, STREET, fill=(34, 30, 28))
rect(PX0 + 6, 124, PX1 - 6, 140, fill=RED)                     # sign band (lettered in HTML)
# striped awning
aw_y0, aw_y1 = 142, 154
for i, k in enumerate(range(PX0, PX1, 14)):
    poly([(k, aw_y0), (k + 14, aw_y0), (k + 16, aw_y1), (k + 2, aw_y1)], fill=RED if i % 2 == 0 else (238, 234, 222))
for k in range(PX0 + 2, PX1, 14):
    d.chord([s(k), s(aw_y1 - 4), s(k + 14), s(aw_y1 + 4)], 0, 180, fill=RED)
rect(PX0 + 12, 156, PX0 + 150, STREET - 2, fill=(236, 210, 140))  # lit window
halftone((PX0 + 12, 156, PX0 + 150, STREET - 2), (214, 150, 70), lambda x, y: (y - 156) / 16, 3, 1.4)
# counter, pizza peel and ovens in the window
rect(PX0 + 12, 164, PX0 + 150, 166, fill=(80, 50, 34))
for k in range(3):
    ell(PX0 + 22 + k * 40, 158, PX0 + 50 + k * 40, 164, fill=(206, 120, 56), outline=(150, 70, 30))
rect(PX0 + 160, 156, PX0 + 186, STREET, fill=(30, 26, 24))       # door
rect(PX0 + 164, 160, PX0 + 182, 166, fill=(236, 210, 140))
rect(PX0 + 196, 156, PX1 - 12, STREET - 2, fill=(236, 210, 140))
halftone((PX0 + 196, 156, PX1 - 12, STREET - 2), (214, 150, 70), lambda x, y: (y - 156) / 16, 3, 1.4)
for k in range(4):  # stacked boxes in the window
    rect(PX0 + 206, STREET - 4 - k * 3.4, PX0 + 236, STREET - 1.6 - k * 3.4, fill=(232, 228, 216), outline=(150, 140, 120))

# ---------------- right: rooftops ----------------
bricks(760, 98, 860, STREET, (128, 118, 106), (100, 96, 90), 4.5, 11)
windows(760, 860, 104, 2, 30, lit={(0, 1)}, cols=3, ww=14, wh=18)
rect(760, 158, 860, STREET, fill=(44, 46, 48))
RX = 890
bricks(RX, 70, RX + 120, STREET, (150, 84, 64), (118, 108, 96))
windows(RX, RX + 120, 76, 3, 30, lit={(2, 2), (0, 0)}, cols=3, ww=16, wh=18)
water_tower(RX + 92, 64, 1.0)
rect(RX + 10, 54, RX + 34, 70, fill=(110, 104, 96))
bricks(RX + 120, 40, RX + 260, STREET, (112, 104, 96), (90, 86, 80))
rect(RX + 116, 34, RX + 264, 40, fill=(186, 178, 160))
windows(RX + 120, RX + 260, 46, 4, 30, lit={(0, 3), (2, 1), (3, 0)}, cols=4, ww=16, wh=18)
fire_escape(RX + 150, RX + 240, 46, 4, 30)
# rooftop line between towers, a run of washing line and a skylight
line([(RX + 124, 34), (RX + 92, 64)], BLACK, 0.6)
poly([(RX + 196, 34), (RX + 232, 34), (RX + 222, 22), (RX + 206, 22)], fill=(150, 170, 160))
bricks(RX + 260, 88, W1, STREET, (126, 96, 78), (100, 90, 82))
windows(RX + 260, W1, 94, 2, 32, lit={(1, 1)}, cols=3, ww=16, wh=18)
rect(RX + 260, 154, W1, STREET, fill=(40, 42, 44))

# ---------------- ink shading and keylines on the buildings ----------------
for (x0, y0, x1, y1) in BOXES:
    w = x1 - x0
    halftone((x0, y0, x1, y1), (30, 26, 24), lambda x, y, x0=x0, w=w: max(0, (x - x0) / w - 0.55) * 1.4, 3.4, 1.6)
    halftone((x0, y0, x1, y1), (30, 26, 24), lambda x, y, y1=y1: 0.25 if y > y1 - 6 else 0, 3.4, 1.3)
    rect(x0, y0, x1, y1, outline=(22, 22, 20), w=1.1)
# steam curling out of the open manhole
for i, (ox, oy, r) in enumerate([(718, 160, 9), (712, 146, 12), (722, 128, 14), (714, 108, 16), (724, 88, 15)]):
    sg = Image.new('L', (W, H), 0); ImageDraw.Draw(sg).ellipse([s(ox - r), s(oy - r * 0.8), s(ox + r), s(oy + r * 0.8)], fill=110 - i * 16)
    sg = sg.filter(ImageFilter.GaussianBlur(s(5)))
    im = Image.composite(Image.new('RGB', (W, H), (232, 234, 222)), im, sg)
d = ImageDraw.Draw(im)

# ---------------- street ----------------
rect(0, STREET, W1, STREET + 6, fill=(150, 150, 142))   # sidewalk
for k in range(0, W1, 26):
    line([(k, STREET), (k, STREET + 6)], (120, 120, 112), 0.6)
rect(0, STREET + 6, W1, GROUND, fill=(70, 72, 74))      # roadway
for k in range(14, W1, 60):
    rect(k, STREET + 11.5, k + 26, STREET + 13, fill=(200, 196, 170))
# hydrant and a street lamp by the pizzeria
rect(450, 162, 456, STREET, fill=RED); ell(449, 159, 457, 165, fill=RED)
line([(844, STREET), (844, 120)], BLACK, 1.6); line([(844, 120), (830, 116)], BLACK, 1.4)
ell(822, 114, 834, 120, fill=GLOW)

# ---------------- underground ----------------
rect(0, GROUND, W1, H1, fill=(96, 84, 66))   # earth
halftone((0, GROUND, W1, H1), (74, 62, 48), lambda x, y: 0.5 + 0.3 * math.sin(x / 37 + y / 11), 3.6, 1.6)
for k in range(9):   # stones in the fill
    x, y = R.uniform(0, W1), R.uniform(GROUND + 4, TUN_T - 8)
    ell(x, y, x + R.uniform(5, 11), y + R.uniform(3, 6), fill=(124, 112, 92))
for k in range(0, W1, 3):
    line([(k, GROUND + 26 + 3 * math.sin(k / 23)), (k + 2, GROUND + 30 + 3 * math.sin(k / 23))], (60, 50, 38), 0.6)
# pipes and cables under the street
line([(0, GROUND + 9), (W1, GROUND + 9)], (40, 44, 46), 3.2)
line([(0, GROUND + 9), (W1, GROUND + 9)], (90, 96, 100), 1.0)
line([(0, GROUND + 19), (W1, GROUND + 19)], (134, 76, 50), 2.4)

# main brick tunnel
bricks(0, TUN_T - 10, W1, TUN_B + 8, (74, 92, 70), (52, 64, 50), 5, 13, 10)
rect(0, TUN_T, W1, TUN_B, fill=(26, 40, 32))       # dark interior
halftone((0, TUN_T, W1, TUN_B), (40, 64, 46), lambda x, y: 0.35 + 0.35 * math.sin(x / 90), 4.2, 2.0)
# vaulted arch ribs along the tunnel
for k in range(30, W1, 90):
    d.arc([s(k - 36), s(TUN_T - 4), s(k + 36), s(TUN_T + 50)], 180, 360, fill=(74, 92, 70), width=s(3))
# walkway ledges and the channel of green water
rect(0, TUN_B - 26, W1, TUN_B - 22, fill=(96, 110, 94))
rect(0, TUN_B - 22, W1, TUN_B, fill=GREEN)
for k in range(140):
    x = R.uniform(0, W1); y = R.uniform(TUN_B - 20, TUN_B - 3); l = R.uniform(8, 26)
    line([(x, y), (x + l, y)], GREEN_L, 0.7)
# drips and pipe outfalls
for k in range(60, W1, 130):
    ell(k, TUN_T + 8, k + 14, TUN_T + 22, fill=(20, 24, 22), outline=(96, 104, 96), w=1.4)
    line([(k + 7, TUN_T + 22), (k + 7, TUN_B - 22)], (90, 130, 88), 0.8)

# ---------------- the lair (left, under April's block) ----------------
LX0, LX1, LT = 40, 330, 214
rect(LX0, LT, LX1, TUN_B - 22, fill=(52, 46, 38))
halftone((LX0, LT, LX1, TUN_B - 22), (80, 66, 46), lambda x, y: 0.75 - abs(x - 180) / 200, 3.4, 1.7)
d.arc([s(LX0 - 10), s(LT - 16), s(LX1 + 10), s(LT + 60)], 180, 360, fill=(74, 92, 70), width=s(5))
# hanging lamp and its pool of light
line([(186, LT - 2), (186, LT + 22)], BLACK, 0.8)
poly([(178, LT + 22), (194, LT + 22), (190, LT + 16), (182, LT + 16)], fill=(40, 40, 36))
glow = Image.new('L', (W, H), 0)
ImageDraw.Draw(glow).polygon([(s(180), s(LT + 22)), (s(192), s(LT + 22)), (s(250), s(TUN_B - 26)), (s(120), s(TUN_B - 26))], fill=120)
glow = glow.filter(ImageFilter.GaussianBlur(s(8)))
im = Image.composite(Image.new('RGB', (W, H), (232, 210, 150)), im, glow)
d = ImageDraw.Draw(im)
# old TV set with a glowing screen
rect(64, 262, 112, 292, fill=(70, 54, 40), outline=BLACK, w=1)
rect(70, 267, 100, 287, fill=(170, 200, 190))
halftone((70, 267, 100, 287), (120, 160, 150), lambda x, y: 0.45, 2.6, 0.9)
line([(84, 262), (74, 248)], BLACK, 0.8); line([(88, 262), (100, 249)], BLACK, 0.8)
rect(66, 292, 110, 296, fill=(40, 32, 26))
# an old armchair and a low table
rect(128, 274, 160, 296, fill=(110, 54, 46)); rect(124, 266, 132, 296, fill=(96, 46, 40)); rect(156, 266, 164, 296, fill=(96, 46, 40))
rect(132, 262, 156, 276, fill=(120, 60, 50))
rect(176, 284, 230, 288, fill=(70, 54, 40)); rect(180, 288, 184, 296, fill=(70, 54, 40)); rect(222, 288, 226, 296, fill=(70, 54, 40))
# the pizza on the low table, open box
rect(184, 280, 216, 284, fill=(236, 232, 220)); ell(188, 278, 212, 283, fill=(214, 128, 56))
# stacked empty pizza boxes, a teetering tower
for k in range(9):
    off = (k % 3 - 1) * 1.6
    rect(246 + off, 292 - k * 4.2, 290 + off, 295.5 - k * 4.2, fill=(236, 232, 220), outline=(170, 160, 140))
    rect(250 + off, 293 - k * 4.2, 262 + off, 294.6 - k * 4.2, fill=RED)
# candles on a ledge
for k in range(5):
    cx = 300 + k * 5
    rect(cx, 262, cx + 2.6, 270, fill=(232, 226, 200)); ell(cx - 0.6, 258, cx + 3.2, 262.5, fill=(240, 200, 100))
# mat on the floor
rect(120, 296, 236, 298, fill=(150, 60, 50))
rect(LX0, LT, LX1, TUN_B - 22, outline=(22, 22, 20), w=1.2)
# pipes running along the lair wall
line([(LX0, LT + 14), (LX1, LT + 14)], (110, 112, 108), 2.6)
line([(300, LT + 14), (300, 250)], (110, 112, 108), 2.6)

# ---------------- the manhole drop ----------------
MX = 720
rect(MX - 18, STREET + 6, MX + 18, GROUND, fill=(70, 72, 74))
# shaft down to the tunnel
bricks(MX - 22, GROUND, MX + 22, TUN_T, (74, 92, 70), (52, 64, 50), 4, 10, 8)
rect(MX - 14, GROUND, MX + 14, TUN_T, fill=(18, 26, 22))
for y in range(int(GROUND) + 4, TUN_B - 26, 7):   # ladder rungs
    line([(MX - 10, y), (MX - 3, y)], (130, 134, 130), 1.0)
line([(MX - 10, GROUND), (MX - 10, TUN_B - 26)], (130, 134, 130), 1.0)
# manhole cover slid open beside the hole, iron grey with tread
ell(MX + 14, STREET + 4, MX + 50, STREET + 12, fill=IRON, outline=BLACK, w=0.8)
for k in range(5):
    line([(MX + 20 + k * 6, STREET + 6), (MX + 22 + k * 6, STREET + 10)], IRON_L, 0.6)
ell(MX - 16, STREET + 5, MX + 16, STREET + 11, fill=(10, 12, 12))
# falling pizza box with motion lines
bx, by = MX + 2, GROUND + 26
box = Image.new('RGBA', (s(34), s(34)), (0, 0, 0, 0))
bd = ImageDraw.Draw(box)
bd.rectangle([s(4), s(12), s(30), s(22)], fill=(238, 234, 222), outline=(120, 110, 96), width=2)
bd.rectangle([s(4), s(12), s(30), s(15)], fill=RED)
box = box.rotate(-18, resample=Image.BICUBIC)
im.paste(box, (s(bx - 17), s(by - 17)), box)
d = ImageDraw.Draw(im)
for k in (-8, 0, 8):
    line([(bx + k, by - 30), (bx + k, by - 18)], (220, 220, 200), 0.8)
# dotted delivery route from the pizzeria door to the manhole
for k in range(PX0 + 186, MX - 18, 7):
    ell(k, STREET + 1.6, k + 2.4, STREET + 4, fill=RED)

# ladder up at right to a second manhole on the rooftop block
MX2 = 1100
bricks(MX2 - 14, GROUND, MX2 + 14, TUN_T, (74, 92, 70), (52, 64, 50), 4, 10, 8)
rect(MX2 - 8, GROUND, MX2 + 8, TUN_T, fill=(18, 26, 22))
for y in range(int(GROUND) + 4, TUN_B - 26, 7):
    line([(MX2 - 6, y), (MX2 + 6, y)], (130, 134, 130), 1.0)
ell(MX2 - 12, STREET + 6, MX2 + 12, STREET + 10, fill=IRON, outline=BLACK, w=0.8)

# ---------------- print finish ----------------
# soft misregistration of the red ink, gentle ink spread, grain
im = im.filter(ImageFilter.GaussianBlur(0.6))
noise = Image.effect_noise((W // 3, H // 3), 18).resize((W, H), Image.BICUBIC).convert('RGB')
im = ImageChops.blend(im, ImageChops.multiply(im, Image.merge('RGB', [noise.split()[0].point(lambda v: 200 + v // 5)] * 3)), 0.35)
os.makedirs(os.path.join(D, 'assets'), exist_ok=True)
im.save(os.path.join(D, 'assets', 'sewer-map.png'), optimize=True)
print('painted', im.size)
