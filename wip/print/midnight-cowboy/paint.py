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
for i, y in enumerate(range(HZ + 7, SHORE, 8)):
    for x0 in range(-30 + (i % 2) * 29, AW, 58):
        t.line(P(x0, y, x0 + 30 - (i % 3) * 5, y), fill=0, width=int(1.8 * S))
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

# the coach: a 1960s split-level intercity coach, nose to the right. Raised rear deck with its
# own window row, a lower front cab, fluted stainless sides, chrome belt, tandem rear axle,
# louvred engine door at the tail. Drawn as an engraver would: outline, fluting, glazing tone.
from PIL import ImageFont
GND = 250
BX0, BX1 = 10, 260          # tail, nose
DECK, CAB = 138, 160        # roof heights: raised deck, front cab
STEP0, STEP1 = 168, 186     # where the roof steps down
BELT = 200
BOT = 238
body = [(BX0 + 4, DECK + 6), (BX0 + 10, DECK), (STEP0, DECK), (STEP1, CAB), (BX1 - 12, CAB), (BX1 - 3, CAB + 8),
        (BX1, CAB + 30), (BX1, BOT), (BX0, BOT), (BX0, DECK + 14)]
bodyS = [(x * S, y * S) for x, y in body]
l.polygon(bodyS, fill=0)                 # coach sits in front of palms
t.polygon(bodyS, fill=34)
o.polygon(bodyS, fill=0)
# shading: light roof, darker toward the rocker panel
for y in range(BELT + 6, BOT):
    t.line(P(BX0 + 1, y, BX1 - 1, y), fill=int(26 + ((y - BELT - 6) / (BOT - BELT - 6)) ** 1.3 * 110), width=S)
for y in range(DECK, DECK + 8):
    t.line(P(BX0 + 12, y, STEP0 - 2, y), fill=int(46 - (y - DECK) * 5), width=S)
l.line(bodyS + [bodyS[0]], fill=255, width=int(1.6 * S))
# roof rib and marker lamps
l.line(P(BX0 + 16, DECK + 4, STEP0 - 4, DECK + 4), fill=255, width=int(0.8 * S))
for xm in (BX0 + 14, STEP0 - 10, BX1 - 18):
    yy = DECK if xm < STEP0 else CAB
    o.rectangle(P(xm, yy - 3, xm + 5, yy), fill=255); l.rectangle(P(xm, yy - 3, xm + 5, yy), outline=255, width=S)
# raised deck windows, tinted glass with pillars and a glint each
UW0, UW1 = DECK + 9, DECK + 31
t.rectangle(P(BX0 + 14, UW0, STEP0 - 4, UW1), fill=215)
for xw in range(BX0 + 14, STEP0 - 8, 22):
    l.rectangle(P(xw + 19, UW0, xw + 22, UW1), fill=255)
    t.polygon(P(xw + 5, UW1, xw + 9, UW1, xw + 15, UW0, xw + 11, UW0), fill=70)
l.rectangle(P(BX0 + 14, UW0, STEP0 - 4, UW1), outline=255, width=int(1.3 * S))
# raked glass where the deck steps down
t.polygon(P(STEP0 + 1, DECK + 5, STEP1 - 3, CAB - 2, STEP1 - 3, CAB + 4, STEP0 + 1, CAB + 4), fill=200)
# lower front windows under the cab roof
LW0, LW1 = CAB + 8, CAB + 32
t.rectangle(P(STEP0 + 2, LW0, BX1 - 30, LW1), fill=215)
for xw in (STEP0 + 2, STEP0 + 24, STEP0 + 46):
    l.rectangle(P(xw + 20, LW0, xw + 23, LW1), fill=255)
    t.polygon(P(xw + 5, LW1, xw + 9, LW1, xw + 15, LW0, xw + 11, LW0), fill=70)
l.rectangle(P(STEP0 + 2, LW0, BX1 - 30, LW1), outline=255, width=int(1.3 * S))
# lower deck windows under the raised section (the passengers' lounge row)
t.rectangle(P(96, DECK + 38, STEP0 - 2, DECK + 52), fill=200)
for xw in (96, 120, 144):
    l.rectangle(P(xw + 21, DECK + 38, xw + 24, DECK + 52), fill=255)
l.rectangle(P(96, DECK + 38, STEP0 - 2, DECK + 52), outline=255, width=int(1.2 * S))
# windshield, two pieces, raked back
t.polygon(P(BX1 - 27, CAB + 6, BX1 - 6, CAB + 6, BX1 - 1, CAB + 40, BX1 - 24, CAB + 40), fill=215)
l.line(P(BX1 - 15, CAB + 6, BX1 - 12, CAB + 40), fill=255, width=int(1.4 * S))
t.polygon(P(BX1 - 22, CAB + 40, BX1 - 18, CAB + 40, BX1 - 12, CAB + 8, BX1 - 16, CAB + 8), fill=60)
l.polygon(P(BX1 - 27, CAB + 6, BX1 - 6, CAB + 6, BX1 - 1, CAB + 40, BX1 - 24, CAB + 40), outline=255, width=int(1.3 * S))
# destination sign
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', int(6.6 * S))
l.rectangle(P(STEP1 + 6, CAB - 1, BX1 - 30, CAB + 6), fill=255)
l.text(((STEP1 + BX1 - 24) / 2 * S, (CAB + 2.6) * S), 'MIAMI', font=F, fill=0, anchor='mm')
# chrome belt molding with the orange stripe under it
l.line(P(BX0 + 1, BELT - 1, BX1 - 1, BELT - 1), fill=255, width=int(1.3 * S))
o.rectangle(P(BX0 + 1, BELT, BX1 - 1, BELT + 6), fill=255)
t.rectangle(P(BX0 + 1, BELT, BX1 - 1, BELT + 6), fill=0)
l.line(P(BX0 + 1, BELT + 6.5, BX1 - 1, BELT + 6.5), fill=255, width=int(1.1 * S))
# fluted stainless lower sides: fine engraved lines
for y in range(BELT + 10, BOT - 3, 4):
    l.line(P(BX0 + 2, y, BX1 - 2, y), fill=255, width=int(1.0 * S))
# baggage bay doors and the entrance door behind the front wheel
for xb in (100, 140):
    t.rectangle(P(xb, BELT + 9, xb + 36, BOT - 7), fill=40)
    l.rectangle(P(xb, BELT + 9, xb + 36, BOT - 7), outline=255, width=int(1.1 * S))
t.rectangle(P(BX1 - 50, LW1 + 2, BX1 - 32, BOT - 2), fill=205)
l.rectangle(P(BX1 - 50, LW1 + 2, BX1 - 32, BOT - 2), outline=255, width=int(1.3 * S))
l.line(P(BX1 - 41, LW1 + 2, BX1 - 41, BOT - 2), fill=255, width=int(1.1 * S))
# louvred engine door at the tail
t.rectangle(P(BX0 + 3, BELT + 9, BX0 + 26, BOT - 6), fill=60)
for y in range(BELT + 11, BOT - 7, 4):
    l.line(P(BX0 + 5, y, BX0 + 24, y), fill=255, width=int(1.4 * S))
# lamps and bumpers
l.ellipse(P(BX1 - 8, BOT - 22, BX1 - 1, BOT - 15), outline=255, width=S)
o.ellipse(P(BX1 - 8, BOT - 22, BX1 - 1, BOT - 15), fill=170)
l.rectangle(P(BX1 - 18, BOT - 5, BX1 + 3, BOT + 1), fill=255)
l.rectangle(P(BX0 - 3, BOT - 5, BX0 + 12, BOT + 1), fill=255)
# wheels: single front axle, tandem rear axle
for wx in (52, 86, 214):
    l.pieslice(P(wx - 19, BOT - 19, wx + 19, BOT + 19), 180, 360, fill=255)
    l.ellipse(P(wx - 15, BOT - 15, wx + 15, BOT + 15), fill=255)
    l.ellipse(P(wx - 7, BOT - 7, wx + 7, BOT + 7), fill=0)
    t.ellipse(P(wx - 7, BOT - 7, wx + 7, BOT + 7), fill=80)
    l.ellipse(P(wx - 2.5, BOT - 2.5, wx + 2.5, BOT + 2.5), fill=255)
# shadow under the coach
t.rectangle(P(BX0 + 4, BOT + 13, BX1 - 4, BOT + 18), fill=230)

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
    g = gain if gain.shape == cov.shape else np.asarray(Image.fromarray((gain * 255).astype(np.uint8)).resize((cov.shape[1], cov.shape[0])), dtype=np.float32) / 255.0
    thr = base - 0.08 * g
    out = np.clip((b - thr) / 0.10 + 0.5, 0, 1)
    return np.asarray(Image.fromarray((out * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7)), dtype=np.float32) / 255.0
blk = spread(blk, 1.3, 0.47)
ob = screen(org, 3 * S, 75, W, H)
ob = np.maximum(ob, (np.asarray(org, dtype=np.float32) > 250).astype(np.float32))
# misregister the orange plate by 3 css px right, 2 up (scaled at 4x)
ob = spread(ob, 1.4, 0.47)
ob = np.roll(np.roll(ob, 3 * S // 2, axis=1), -S, axis=0)

paper = np.array(PAPER, dtype=np.float32) / 255
ink_k = np.array((38, 34, 32), dtype=np.float32) / 255
ink_o = np.array((226, 96, 44), dtype=np.float32) / 255
img = np.ones((H, W, 3), dtype=np.float32) * paper
img *= (1 - ob[..., None] * 0.92) + ob[..., None] * 0.92 * (ink_o / paper)
img *= (1 - blk[..., None] * 0.94) + blk[..., None] * 0.94 * ink_k
art = Image.fromarray(np.clip(img * 255, 0, 255).astype(np.uint8)).resize((AW * 2, AH * 2), Image.LANCZOS)
art.save(os.path.join(A, 'coach-art.png'))

# ---------------- route map: line-cut coast, tint-screened land, two inks ----------------
import json
MW, MH = 272, 236
LON0, LON1, LAT0, LAT1 = -84.2, -73.2, 25.0, 41.0
ky = MH / (LAT1 - LAT0)
kx = ky * math.cos(math.radians(33))
def pj(lon, lat): return ((lon - LON0) * kx, (LAT1 - lat) * ky)
COAST = [(-73.2, 40.75), (-73.9, 40.55), (-74.0, 40.4), (-74.05, 40.0), (-74.3, 39.45), (-74.9, 38.93), (-75.05, 39.2),
         (-75.5, 39.6), (-75.4, 39.0), (-75.1, 38.6), (-75.25, 38.1), (-75.6, 37.8), (-75.95, 37.15), (-76.25, 37.95),
         (-76.4, 38.9), (-76.6, 39.25), (-76.3, 38.3), (-76.3, 37.3), (-75.98, 36.9), (-75.75, 36.2), (-75.5, 35.25),
         (-76.0, 35.05), (-76.55, 34.65), (-77.4, 34.45), (-77.9, 33.88), (-78.6, 33.82), (-79.15, 33.25), (-79.9, 32.75),
         (-80.5, 32.3), (-81.1, 31.85), (-81.3, 31.2), (-81.45, 30.5), (-81.3, 29.9), (-81.0, 29.2), (-80.6, 28.45),
         (-80.55, 28.0), (-80.15, 27.2), (-80.03, 26.6), (-80.1, 25.9), (-80.3, 25.35), (-80.9, 25.15), (-81.2, 25.55),
         (-81.75, 26.2), (-82.15, 26.8), (-82.6, 27.6), (-82.75, 28.3), (-82.7, 29.0), (-83.6, 29.85), (-84.2, 30.05)]
CITIES = [('New York', -74.0, 40.71), ('Newark', -74.17, 40.73), ('Philadelphia', -75.16, 39.95), ('Wilmington', -75.55, 39.74),
          ('Baltimore', -76.61, 39.29), ('Washington', -77.04, 38.9), ('Richmond', -77.44, 37.54), ('Rocky Mount', -77.79, 35.94),
          ('Florence', -79.76, 34.2), ('Savannah', -81.1, 32.08), ('Jacksonville', -81.66, 30.33), ('Daytona Beach', -81.02, 29.21),
          ('West Palm Beach', -80.05, 26.71), ('Fort Lauderdale', -80.14, 26.12), ('Miami', -80.19, 25.77)]
mt = Image.new('L', (MW * S, MH * S), 0); ml = Image.new('L', (MW * S, MH * S), 0); mo = Image.new('L', (MW * S, MH * S), 0)
dt, dl, do = ImageDraw.Draw(mt), ImageDraw.Draw(ml), ImageDraw.Draw(mo)
# engraved water lines over the whole sheet, land knocks them out
for y in range(2, MH, 4):
    dl.line([(0, y * S), (MW * S, y * S)], fill=150, width=int(0.6 * S))
land = [pj(*p) for p in COAST] + [pj(LON0, 25.0)[0:1] + (MH + 5,), (-5, MH + 5), (-5, -5), (MW + 5, -5), (MW + 5, pj(-73.2, 40.75)[1])]
land = [(x * S, y * S) for x, y in land]
dl.polygon(land, fill=0)
do.polygon(land, fill=70)
dt.polygon(land, fill=10)
dl.line([(x * S, y * S) for x, y in (pj(*p) for p in COAST)], fill=255, width=int(1.3 * S))
# state lines, dotted, the way old folders show them
STATES = [[(-75.55, 39.72), (-79.5, 39.72)], [(-75.25, 38.45), (-75.7, 38.45), (-75.8, 39.72)], [(-75.9, 36.55), (-83.6, 36.6)],
          [(-78.55, 33.85), (-80.8, 35.1), (-84.3, 35.0)], [(-80.9, 32.05), (-82.2, 33.6), (-83.1, 34.9)], [(-81.5, 30.7), (-82.2, 30.5), (-84.9, 30.7)]]
for line_ in STATES:
    pts = [pj(*p) for p in line_]
    for (x1, y1), (x2, y2) in zip(pts, pts[1:]):
        n = int(math.hypot(x2 - x1, y2 - y1) / 3)
        for k in range(n):
            if k % 2 == 0:
                fx, fy = x1 + (x2 - x1) * k / n, y1 + (y2 - y1) * k / n
                dl.ellipse([(fx - 0.6) * S, (fy - 0.6) * S, (fx + 0.6) * S, (fy + 0.6) * S], fill=255)
# the route
rp = [pj(lon, lat) for _, lon, lat in CITIES]
dl.line([(x * S, y * S) for x, y in rp], fill=255, width=int(2.6 * S), joint='curve')
do.line([(x * S, y * S) for x, y in rp[10:]], fill=255, width=int(5 * S), joint='curve')
for i, (x, y) in enumerate(rp):
    r = 3.4 if i in (0, 2, 5, 9, 10, 14) else 2.4
    dl.ellipse([(x - r) * S, (y - r) * S, (x + r) * S, (y + r) * S], fill=255)
    if r > 3:
        dl.ellipse([(x - 1.5) * S, (y - 1.5) * S, (x + 1.5) * S, (y + 1.5) * S], fill=0)
# compass N
dl.polygon([((MW - 18) * S, 8 * S), ((MW - 23) * S, 24 * S), ((MW - 18) * S, 20 * S), ((MW - 13) * S, 24 * S)], fill=255)
mtb = screen(mt, 3 * S, 45, MW * S, MH * S)
mlb = np.asarray(ml, dtype=np.float32) / 255.0
mb = np.maximum(mtb, mlb)
mb = spread(mb, 1.0, 0.47)
mob = screen(mo, 3 * S, 75, MW * S, MH * S)
mob = np.maximum(mob, (np.asarray(mo, dtype=np.float32) > 250).astype(np.float32))
mob = np.roll(np.roll(spread(mob, 1.2, 0.47), 2 * S // 2, axis=1), S, axis=0)
mi = np.ones((MH * S, MW * S, 3), dtype=np.float32) * paper
mi *= (1 - mob[..., None] * 0.92) + mob[..., None] * 0.92 * (ink_o / paper)
mi *= (1 - mb[..., None] * 0.94) + mb[..., None] * 0.94 * ink_k
Image.fromarray(np.clip(mi * 255, 0, 255).astype(np.uint8)).resize((MW * 2, MH * 2), Image.LANCZOS).save(os.path.join(A, 'route-map.png'))
json.dump({n: [round(x, 1), round(y, 1)] for (n, _, _), (x, y) in zip(CITIES, rp)}, open(os.path.join(A, 'map-cities.json'), 'w'), indent=0)

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
