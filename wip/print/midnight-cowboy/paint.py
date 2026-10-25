"""Paints the art for the Silver Palm Coaches timetable (Midnight Cowboy, 1969).
assets/coach-art.png    cover picture: a 1960s stainless coach on the causeway into Miami Beach,
                        printed as two spot inks (black halftone plus line cut, orange off register).
assets/pencil-ring.png  a soft graphite ring, someone circled the midnight departure.
assets/wear-outside.png / wear-inside.png  soft edge yellowing, two fold creases, pocket wear.
assets/paper-grain.png  shared grain, copied from the Jurassic kit.
Everything is drawn at 4x and scaled down for clean edges."""
import os, math, random, shutil
from PIL import Image, ImageDraw, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets'); os.makedirs(A, exist_ok=True)
shutil.copy('/home/claude/polish/wip/print/jurassic/src/assets/paper-grain.png', os.path.join(A, 'paper-grain.png'))

PAPER = (246, 241, 228)
INK = (29, 27, 25)
ORANGE = (231, 98, 38)
YEL = (241, 186, 52)
SKY = (98, 178, 196)
SKY2 = (150, 205, 214)
SEA = (40, 128, 150)
SAND = (236, 214, 160)
SILVER = (206, 208, 206)
SILVER_D = (150, 154, 155)
GLASS = (34, 52, 58)

# ---------------- cover art: two spot inks, halftone and line cut ----------------
# Drawn as three plates at 4x: a tone plate (black halftone), a line plate (solid black line cut)
# and an orange plate (solid and tint screen). Plates are screened, overprinted by multiply,
# and the orange plate is set 3px off register, like a cheap two-colour job on a small press.
import numpy as np
AW, AH = 272, 290             # css px
S = 4
W, H = AW * S, AH * S
tone = Image.new('L', (W, H), 0)     # 0 = no ink, 255 = full black (before screening)
line = Image.new('L', (W, H), 0)     # solid black line work
org = Image.new('L', (W, H), 0)      # orange coverage (0 to 255)
t, l, o = ImageDraw.Draw(tone), ImageDraw.Draw(line), ImageDraw.Draw(org)
def P(*xy): return [v * S for v in xy]

HZ = 100          # horizon
SHORE = 140       # far shore line
ROAD = 214
# sky: orange tint screen fading to paper at the horizon, plus a thin black screen high up
for y in range(0, HZ):
    k = y / HZ
    o.line(P(0, y, AW, y), fill=int(96 * (1 - k) ** 1.2 + 16), width=S)
    t.line(P(0, y, AW, y), fill=int(70 * (1 - k) ** 1.8), width=S)
# clouds: knocked out of both plates, edged with line
for cx, cy, rx, ry in ((70, 34, 44, 11), (106, 27, 28, 12), (204, 54, 36, 8), (228, 49, 22, 8)):
    for d_ in (o, t):
        d_.ellipse(P(cx - rx, cy - ry, cx + rx, cy + ry), fill=0)
# Miami Beach hotel row across the water, period slab blocks
x = 4
random.seed(11)
while x < AW - 4:
    w_ = random.choice((12, 16, 20, 24))
    h_ = random.choice((6, 10, 14, 18, 24))
    if 90 < x < 180: h_ = min(h_, 8)
    t.rectangle(P(x, HZ - h_, x + w_, HZ + 2), fill=72)
    for yy in range(HZ - h_ + 3, HZ, 4):
        t.line(P(x + 2, yy, x + w_ - 2, yy), fill=150, width=S)
    l.line(P(x, HZ - h_, x + w_, HZ - h_), fill=255, width=S)
    x += w_ + random.choice((0, 2, 4))
# bay: mid tone with white line-cut streaks
t.rectangle(P(0, HZ + 2, AW, SHORE + 2), fill=125)
o.rectangle(P(0, HZ + 2, AW, SHORE + 2), fill=40)
for i, y in enumerate(range(HZ + 6, SHORE, 5)):
    for x0 in range(-20 + (i % 2) * 17, AW, 34):
        t.line(P(x0, y, x0 + 18 - (i % 3) * 3, y), fill=0, width=int(2.2 * S))
# causeway shoulder and sand
t.rectangle(P(0, SHORE + 2, AW, ROAD), fill=0)
o.rectangle(P(0, SHORE + 2, AW, ROAD), fill=95)
for y in range(SHORE + 8, ROAD, 6):
    for x0 in range((y * 7) % 23, AW, 23):
        l.point([(x0 * S + dx, y * S + dy) for dx in range(4) for dy in range(4)], fill=200)
# road
for y in range(ROAD, AH):
    t.line(P(0, y, AW, y), fill=int(70 + 90 * ((y - ROAD) / (AH - ROAD)) ** 1.2), width=S)
l.rectangle(P(0, ROAD, AW, ROAD + 1.5), fill=255)
for x0 in range(-6, AW, 34):
    t.rectangle(P(x0, 262, x0 + 18, 265), fill=0)
    o.rectangle(P(x0, 262, x0 + 18, 265), fill=255)

def palm(x, base, height, lean, sc):
    pts = [(x + lean * (i / 40) ** 2, base - height * i / 40) for i in range(41)]
    for i in range(40):
        (x1, y1), (x2, y2) = pts[i], pts[i + 1]
        w = (7.5 - 3.5 * i / 40) * sc
        l.line(P(x1, y1, x2, y2), fill=255, width=int(w * S))
    for i in range(2, 40, 3):     # bark rings cut out of the trunk
        x1, y1 = pts[i]; w = (7.5 - 3.5 * i / 40) * sc
        l.line(P(x1 - w / 2 + 1, y1, x1 + w / 2, y1 + 1.2), fill=0, width=int(0.9 * S))
    tx, ty = pts[-1]
    for ang, ln in ((-172, 50), (-145, 56), (-115, 42), (-82, 38), (-48, 52), (-15, 54), (14, 44), (162, 40), (196, 44)):
        a = math.radians(ang); ln *= sc
        spine = [(tx + math.cos(a) * ln * k / 24, ty + math.sin(a) * ln * k / 24 + ln * 0.5 * (k / 24) ** 2) for k in range(25)]
        for k in range(24):
            l.line(P(*spine[k], *spine[k + 1]), fill=255, width=int(1.8 * S))
        # leaflets drawn as short strokes, like an engraver's line cut
        for k in range(2, 24):
            sx, sy = spine[k]
            nx, ny = spine[min(k + 1, 24)][0] - spine[k - 1][0], spine[min(k + 1, 24)][1] - spine[k - 1][1]
            nl = math.hypot(nx, ny) or 1
            ux, uy = nx / nl, ny / nl
            lf = 9 * sc * math.sin(math.pi * k / 26) + 2
            for side in (1, -1):
                px, py = -uy * side, ux * side
                ex = sx + (px * 0.85 + ux * 0.55) * lf
                ey = sy + (py * 0.85 + uy * 0.55) * lf + 2.5
                l.line(P(sx, sy, ex, ey), fill=255, width=int(1.1 * S))
    l.ellipse(P(tx - 4 * sc, ty - 2 * sc, tx + 4 * sc, ty + 5 * sc), fill=255)

palm(30, ROAD - 2, 150, 16, 0.95)
palm(250, ROAD - 2, 120, -12, 0.8)

# the coach: a 1960s flat-roof stainless intercity coach, nose to the right
bx0, bx1, by0, by1 = 14, 252, 150, 240
# body tone: light at the roof, shaded under the belt; the coach sits in front of the palm
l.rounded_rectangle(P(bx0, by0, bx1, by1), radius=10 * S, fill=0)
t.rounded_rectangle(P(bx0, by0, bx1, by1), radius=10 * S, fill=20)
for y in range(by0 + 46, by1):
    t.line(P(bx0 + 2, y, bx1 - 2, y), fill=int(24 + ((y - by0 - 46) / (by1 - by0 - 46)) ** 1.4 * 120), width=S)
for y in range(by0 + 2, by0 + 10):
    t.line(P(bx0 + 4, y, bx1 - 4, y), fill=int(50 - (y - by0) * 5), width=S)
o.rounded_rectangle(P(bx0, by0, bx1, by1), radius=10 * S, fill=0)
l.rounded_rectangle(P(bx0, by0, bx1, by1), radius=10 * S, outline=255, width=int(1.6 * S))
# roof marker lamps and roof rib
l.line(P(bx0 + 16, by0 + 5, bx1 - 22, by0 + 5), fill=255, width=int(0.9 * S))
for xm in (bx0 + 8, bx1 - 14):
    o.rectangle(P(xm, by0 - 3, xm + 6, by0), fill=255); l.rectangle(P(xm, by0 - 3, xm + 6, by0), outline=255, width=S)
# window band: dark tone with a white diagonal glint per pane
t.rectangle(P(bx0 + 6, by0 + 10, bx1 - 30, by0 + 36), fill=210)
for xw in range(bx0 + 6, bx1 - 34, 26):
    l.rectangle(P(xw + 22, by0 + 10, xw + 26, by0 + 36), fill=255)
    t.polygon(P(xw + 6, by0 + 36, xw + 11, by0 + 36, xw + 19, by0 + 10, xw + 14, by0 + 10), fill=60)
l.rectangle(P(bx0 + 6, by0 + 10, bx1 - 30, by0 + 36), outline=255, width=int(1.4 * S))
# windshield, raked
t.polygon(P(bx1 - 27, by0 + 10, bx1 - 5, by0 + 10, bx1 - 1, by0 + 44, bx1 - 24, by0 + 44), fill=210)
t.polygon(P(bx1 - 20, by0 + 44, bx1 - 15, by0 + 44, bx1 - 11, by0 + 10, bx1 - 16, by0 + 10), fill=70)
l.polygon(P(bx1 - 27, by0 + 10, bx1 - 5, by0 + 10, bx1 - 1, by0 + 44, bx1 - 24, by0 + 44), outline=255, width=int(1.4 * S))
# destination sign over the windshield (lettered in the HTML? no, too small: lettered here)
from PIL import ImageFont
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(7.2 * S))
l.rectangle(P(bx1 - 70, by0 + 1, bx1 - 30, by0 + 9), fill=255)
l.text(((bx1 - 50) * S, (by0 + 5.2) * S), 'MIAMI', font=F, fill=0, anchor='mm')
# livery: orange belt stripe with black pinstripes
o.rectangle(P(bx0 + 1, by0 + 39, bx1 - 1, by0 + 47), fill=255)
t.rectangle(P(bx0 + 1, by0 + 39, bx1 - 1, by0 + 47), fill=0)
l.line(P(bx0 + 1, by0 + 38.5, bx1 - 3, by0 + 38.5), fill=255, width=int(1.2 * S))
l.line(P(bx0 + 1, by0 + 47.5, bx1 - 1, by0 + 47.5), fill=255, width=int(1.2 * S))
# fluted stainless side panels: fine engraved lines
for y in range(by0 + 52, by1 - 6, 3):
    l.line(P(bx0 + 3, y, bx1 - 3, y), fill=255, width=int(0.75 * S))
# baggage bays and entrance door
for xb in (78, 128):
    t.rectangle(P(xb, by0 + 52, xb + 42, by1 - 10), fill=40)
    l.rectangle(P(xb, by0 + 52, xb + 42, by1 - 10), outline=255, width=int(1.2 * S))
t.rectangle(P(bx1 - 46, by0 + 50, bx1 - 26, by1 - 4), fill=200)
l.rectangle(P(bx1 - 46, by0 + 50, bx1 - 26, by1 - 4), outline=255, width=int(1.4 * S))
l.line(P(bx1 - 36, by0 + 50, bx1 - 36, by1 - 4), fill=255, width=int(1.2 * S))
# headlamps and bumper
l.ellipse(P(bx1 - 9, by1 - 24, bx1 - 1, by1 - 16), outline=255, width=S)
o.ellipse(P(bx1 - 9, by1 - 24, bx1 - 1, by1 - 16), fill=150)
l.rectangle(P(bx1 - 20, by1 - 6, bx1 + 3, by1 + 1), fill=255)
l.rectangle(P(bx0 - 2, by1 - 6, bx0 + 14, by1 + 1), fill=255)
# wheels in arches
for wx in (56, 210):
    l.pieslice(P(wx - 21, by1 - 22, wx + 21, by1 + 20), 180, 360, fill=255)
    l.ellipse(P(wx - 17, by1 - 16, wx + 17, by1 + 18), fill=255)
    l.ellipse(P(wx - 8, by1 - 7, wx + 8, by1 + 9), fill=0)
    t.ellipse(P(wx - 8, by1 - 7, wx + 8, by1 + 9), fill=70)
    l.ellipse(P(wx - 3, by1 - 2, wx + 3, by1 + 4), fill=255)
# shadow under the coach
t.rectangle(P(bx0 + 4, by1 + 14, bx1 - 4, by1 + 20), fill=230)

def screen(plate, cell, angle, w, h):
    """AM halftone at the given cell size (px at 4x) and angle, returns 0..1 ink coverage at 4x"""
    a = np.asarray(plate, dtype=np.float32) / 255.0
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ca, sa = math.cos(math.radians(angle)), math.sin(math.radians(angle))
    u = (xx * ca + yy * sa) / cell
    v = (-xx * sa + yy * ca) / cell
    du = u - np.floor(u) - 0.5
    dv = v - np.floor(v) - 0.5
    dist = np.sqrt(du * du + dv * dv)          # 0 at centre to ~0.707 at corner
    r = np.sqrt(a / math.pi)                   # dot radius giving coverage a
    ink = (dist < r).astype(np.float32)
    ink[a > 0.93] = 1.0
    return ink

tb = screen(tone, 3 * S, 45, W, H)
lb = np.asarray(line, dtype=np.float32) / 255.0
blk = np.maximum(tb, lb)
# ink spread: dots and lines swell and round off where the press ran heavy, unevenly across the sheet
rng = np.random.default_rng(4)
gain = np.asarray(Image.fromarray((rng.random((H // 64 + 1, W // 64 + 1)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), dtype=np.float32) / 255.0
def spread(cov, rad, base):
    b = np.asarray(Image.fromarray((cov * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(rad)), dtype=np.float32) / 255.0
    thr = base - 0.14 * gain
    out = np.clip((b - thr) / 0.10 + 0.5, 0, 1)
    return np.asarray(Image.fromarray((out * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.0)), dtype=np.float32) / 255.0
blk = spread(blk, 2.2, 0.42)
ob = screen(org, 3 * S, 75, W, H)
ob = np.maximum(ob, (np.asarray(org, dtype=np.float32) > 250).astype(np.float32))
# misregister the orange plate by 3 css px right, 2 up (scaled at 4x)
ob = spread(ob, 2.0, 0.45)
ob = np.roll(np.roll(ob, 3 * S // 2, axis=1), -S, axis=0)

paper = np.array(PAPER, dtype=np.float32) / 255
ink_k = np.array((38, 34, 32), dtype=np.float32) / 255
ink_o = np.array((226, 96, 44), dtype=np.float32) / 255
img = np.ones((H, W, 3), dtype=np.float32) * paper
img *= (1 - ob[..., None] * 0.92) + ob[..., None] * 0.92 * (ink_o / paper)
img *= (1 - blk[..., None] * 0.94) + blk[..., None] * 0.94 * ink_k
art = Image.fromarray(np.clip(img * 255, 0, 255).astype(np.uint8)).resize((AW * 2, AH * 2), Image.LANCZOS)
art.save(os.path.join(A, 'coach-art.png'))

# ---------------- pencil ring ----------------
PW, PH = 150, 54
pr = Image.new('L', (PW * S, PH * S), 0)
pd = ImageDraw.Draw(pr)
random.seed(7)
pts = []
for i in range(0, 400):
    t = i / 360 * 2 * math.pi
    rx = (PW / 2 - 6) * (1 + 0.02 * math.sin(3 * t))
    ry = (PH / 2 - 6) * (1 + 0.04 * math.cos(2 * t))
    x = PW / 2 + rx * math.cos(t - 0.15) + (i / 400) * 4
    y = PH / 2 + ry * math.sin(t - 0.15) - (i / 400) * 3
    pts.append((x * S, y * S))
for i in range(len(pts) - 1):
    w = 1.6 + 0.7 * math.sin(i / 37)
    pd.line([pts[i], pts[i + 1]], fill=int(150 + 60 * math.sin(i / 23) ** 2), width=int(w * S))
pr = pr.filter(ImageFilter.GaussianBlur(1.2)).resize((PW * 2, PH * 2), Image.LANCZOS)
ring = Image.new('RGBA', pr.size, (70, 70, 74, 0))
ring.putalpha(pr.point(lambda v: int(v * 0.85)))
ring.save(os.path.join(A, 'pencil-ring.png'))

# ---------------- wear: soft, low-detail ----------------
FW, FH = 1056, 816
def wear(name, seed, dog):
    random.seed(seed)
    w, h = FW // 2, FH // 2     # painted small, scaled up = soft
    a = Image.new('L', (w, h), 0)
    ad = ImageDraw.Draw(a)
    # edge yellowing
    for i in range(18):
        v = int(70 * (1 - i / 18) ** 2)
        ad.rectangle([i, i, w - 1 - i, h - 1 - i], outline=v)
    # big gentle mottling
    for _ in range(14):
        x, y, rr = random.randint(0, w), random.randint(0, h), random.randint(40, 110)
        ad.ellipse([x - rr, y - rr, x + rr, y + rr], fill=random.randint(8, 18))
    a = a.filter(ImageFilter.GaussianBlur(22))
    tint = Image.new('RGBA', (w, h), (176, 140, 70, 0)); tint.putalpha(a)
    tint = tint.resize((FW, FH), Image.LANCZOS)
    # fold creases at the two panel lines: a soft shadow and a hairline highlight
    cr = Image.new('RGBA', (FW, FH), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cr)
    for fx in (352, 704):
        for k, al in ((-3, 6), (-2, 12), (-1, 22), (0, 30), (1, 10)):
            cd.line([(fx + k, 0), (fx + k, FH)], fill=(80, 60, 30, al))
        cd.line([(fx + 2, 0), (fx + 2, FH)], fill=(255, 255, 250, 40))
    cr = cr.filter(ImageFilter.GaussianBlur(0.8))
    # a pocket rub along the cover's lower corner area
    if dog:
        rub = Image.new('L', (FW, FH), 0)
        rd = ImageDraw.Draw(rub)
        rd.ellipse([FW - 260, FH - 150, FW + 120, FH + 120], fill=26)
        rd.ellipse([-120, -100, 200, 120], fill=18)
        rub = rub.filter(ImageFilter.GaussianBlur(40))
        rt = Image.new('RGBA', (FW, FH), (150, 120, 70, 0)); rt.putalpha(rub)
        tint = Image.alpha_composite(tint, rt)
    out = Image.alpha_composite(tint, cr)
    out.save(os.path.join(A, f'wear-{name}.png'))

wear('outside', 3, True)
wear('inside', 5, False)
print('painted')
