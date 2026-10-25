"""Paints the press sheet for the FRONT of the Last Stop bar card (After Hours, 1985).
A two-colour offset job on cream uncoated card, the way a downtown quick printer ran a bar card:
  black plate: a solid flood with the sign and the block drawing knocked out to bare card,
               and the sign glow screened as a coarse 45 degree halftone,
  red plate:   one fluorescent red spot ink for STOP and the window sign, laid a hair out of
               register so a thin sliver of card shows on one side and red overprints black on the other.
No glow render, no gradients: every pixel is card, red ink, black ink, or red under black.
Below the sign is a reversed line cut (scratchboard style) of the block: a brick walk-up with a
water tower, the cast-iron front with the bar at street level, and a lower building with a fire
escape, cobra head street light and hydrant on the curb.
Writes assets/front-print.png at 2x (816 x 1056 layout px)."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 2
LW, LH = 816, 1056
W, H = LW * S, LH * S
PAPER = np.array([234, 224, 200], float)
RED = np.array([236, 70, 46], float)      # fluorescent red-orange spot
BLACK = np.array([30, 27, 25], float)
MIS = (3, 2)                               # red plate offset in 2x px
random.seed(1985)

def arc(cx, cy, rx, ry, a0, a1, n=48):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy - ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]

# neon glyphs in units of letter height, y down: (advance, strokes)
G = {
 'L': (0.50, [[(0, 0), (0, 1), (0.50, 1)]]),
 'A': (0.64, [[(0, 1), (0.32, 0), (0.64, 1)], [(0.15, 0.63), (0.49, 0.63)]]),
 'S': (0.56, [arc(0.28, 0.255, 0.27, 0.245, 28, 270) + arc(0.28, 0.745, 0.27, 0.245, 90, -152)[1:]]),
 'T': (0.60, [[(0, 0), (0.60, 0)], [(0.30, 0), (0.30, 1)]]),
 'O': (0.60, [arc(0.30, 0.5, 0.30, 0.5, -84, 264, 96)]),
 'P': (0.56, [[(0, 1), (0, 0), (0.29, 0)] + arc(0.29, 0.27, 0.27, 0.27, 90, -90)[1:] + [(0, 0.54)]]),
 'B': (0.54, [[(0, 1), (0, 0), (0.27, 0)] + arc(0.27, 0.24, 0.24, 0.24, 90, -90)[1:] + [(0, 0.48), (0.29, 0.48)] + arc(0.29, 0.74, 0.25, 0.26, 90, -90)[1:] + [(0, 1)]]),
 'R': (0.56, [[(0, 1), (0, 0), (0.29, 0)] + arc(0.29, 0.25, 0.25, 0.25, 90, -90)[1:] + [(0, 0.5)], [(0.22, 0.5), (0.56, 1)]]),
}

def word(text, h, x0, y0, track):
    out, x = [], x0
    for ch in text:
        adv, strokes = G[ch]
        out.append([[(x + px * h, y0 + py * h) for px, py in s] for s in strokes])
        x += (adv + track) * h
    return out

def width(text, h, track):
    return (sum(G[c][0] for c in text) + track * (len(text) - 1)) * h

def new(): return Image.new('L', (W, H), 0)
def arr(im): return np.asarray(im, float) / 255

def stroke_into(d, strokes, w, fill=255):
    for s in strokes:
        d.line(s, fill=fill, width=int(round(w)), joint='curve')
        for x, y in (s[0], s[-1]):
            d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=fill)

def blur(a, r):
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), float) / 255

def shift(a, dx, dy):
    return np.roll(np.roll(a, dy, 0), dx, 1)

# ---------------- the sign ----------------
h1, h2, tr = 120 * S, 152 * S, 0.24
t1, t2 = 11 * S, 13 * S
w1, w2 = width('LAST', h1, tr), width('STOP', h2, tr)
y1 = 126 * S
y2 = y1 + h1 + 44 * S
last = word('LAST', h1, (W - w1) / 2 - 3 * S, y1, tr)
stop = word('STOP', h2, (W - w2) / 2, y2, tr)

m_last, m_stop = new(), new()
dl, ds = ImageDraw.Draw(m_last), ImageDraw.Draw(m_stop)
for L in last: stroke_into(dl, L, t1)
for L in stop: stroke_into(ds, L, t2)
LAST_M, STOP_M = arr(m_last), arr(m_stop)

# glow as halftone: the black plate is screened where the light falls
glow = np.maximum(blur(LAST_M, 26 * S) * 1.9, blur(STOP_M, 30 * S) * 2.0)
glow = np.clip(glow, 0, 1) ** 1.25
glow_last = np.clip(blur(LAST_M, 26 * S) * 1.9, 0, 1) ** 1.25
glow_stop = np.clip(blur(STOP_M, 30 * S) * 2.0, 0, 1) ** 1.25

yy, xx = np.mgrid[0:H, 0:W].astype(float)
P = 11.0  # screen cell in 2x px, about 17 lines per inch at size: a coarse poster screen
u, v = (xx + yy) / math.sqrt(2), (xx - yy) / math.sqrt(2)
T = (np.cos(2 * math.pi * u / P) + np.cos(2 * math.pi * v / P) + 2) / 4   # 1 at dot centres

T2 = 0.04 + 0.92 * T
u2, v2 = xx * math.cos(0.26) + yy * math.sin(0.26), -xx * math.sin(0.26) + yy * math.cos(0.26)
TR = 0.04 + 0.92 * (np.cos(2 * math.pi * u2 / P) + np.cos(2 * math.pi * v2 / P) + 2) / 4   # red at 15 degrees

def screen(cov, t=None):
    """ink where the screen says so, coverage 0..1, soft 1px edge; solid at full coverage"""
    t = T2 if t is None else t
    return np.where(cov > 0.985, 1.0, np.clip((cov - (1 - t)) * 14 + 0.5, 0, 1))

black_cov = 1 - glow * 0.92
black = screen(black_cov)
black = np.minimum(black, 1 - LAST_M)
black = np.minimum(black, 1 - STOP_M)

# red plate: STOP tube solid plus a solid red base under the STOP glow, offset
red = np.maximum(STOP_M, screen(np.clip(glow_stop * 1.5, 0, 1), TR))
# keep the red base off the LAST tubes so cream stays clean
red = red * (1 - blur(LAST_M, 2 * S) * 1.5).clip(0, 1)
red = shift(red, *MIS)

# mounting clips: short black saddles across the tubes, and dark electrode ends
clips = Image.new('L', (W, H), 0); cd = ImageDraw.Draw(clips)
def point_at(s, t):
    seg = [math.dist(s[i], s[i + 1]) for i in range(len(s) - 1)]; goal = t * sum(seg)
    for i, l in enumerate(seg):
        if goal <= l:
            f = goal / l if l else 0
            return (s[i][0] + (s[i + 1][0] - s[i][0]) * f, s[i][1] + (s[i + 1][1] - s[i][1]) * f), (s[i + 1][0] - s[i][0], s[i + 1][1] - s[i][1])
        goal -= l
    return s[-1], (s[-1][0] - s[-2][0], s[-1][1] - s[-2][1])
def saddle(p, d, w):
    L = math.hypot(*d) or 1; ux, uy = d[0] / L, d[1] / L; nx, ny = -uy, ux
    half, th = w * 0.95, 1.6 * S
    cd.polygon([(p[0] + nx * half + ux * th, p[1] + ny * half + uy * th), (p[0] - nx * half + ux * th, p[1] - ny * half + uy * th),
                (p[0] - nx * half - ux * th, p[1] - ny * half - uy * th), (p[0] + nx * half - ux * th, p[1] + ny * half - uy * th)], fill=255)
def endcap(p, q, w):
    dx, dy = p[0] - q[0], p[1] - q[1]; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    cd.line([(p[0] - ux * w * 0.1, p[1] - uy * w * 0.1), (p[0] + ux * w * 0.6, p[1] + uy * w * 0.6)], fill=255, width=int(w * 0.62))
letters = [(L, t1) for L in last] + [(L, t2) for L in stop]
CLIPS = {0: [(0, 0.36)], 1: [(0, 0.3), (0, 0.78)], 2: [(0, 0.62)], 3: [(1, 0.55)],
         4: [(0, 0.3), (0, 0.78)], 5: [(1, 0.5)], 6: [(0, 0.25), (0, 0.68)], 7: [(0, 0.1), (0, 0.6)]}
for i, (strokes, w) in enumerate(letters):
    for si, t in CLIPS[i]:
        p, d = point_at(strokes[si], t); saddle(p, d, w)
    a, b = strokes[0], strokes[-1]
    endcap(a[0], a[1], w); endcap(b[-1], b[-2], w)
CL = arr(clips)
black = np.maximum(black, CL)
red = red * (1 - CL)

# ---------------- the block: reversed line cut ----------------
lines = Image.new('L', (W, H), 0); ld = ImageDraw.Draw(lines)
redw = Image.new('L', (W, H), 0); rd = ImageDraw.Draw(redw)
ko = Image.new('L', (W, H), 0); kd = ImageDraw.Draw(ko)      # knock a red area clear of black
def J(v, a=0.5): return v + random.uniform(-a, a)
def ln(x0, y0, x1, y1, w=1.3):
    ld.line([(J(x0) * S, J(y0) * S), (J(x1) * S, J(y1) * S)], fill=255, width=max(1, int(round(w * S))))
def rect(x0, y0, x1, y1, w=1.3):
    ln(x0, y0, x1, y0, w); ln(x1, y0, x1, y1, w); ln(x1, y1, x0, y1, w); ln(x0, y1, x0, y0, w)
def hatch(x0, y0, x1, y1, gap=2.6, w=0.7, ang=0):
    """lit window: close parallel cuts, the engraver's grey"""
    if ang == 0:
        y = y0 + gap / 2
        while y < y1:
            ln(x0 + 0.8, y, x1 - 0.8, y, w); y += gap
    else:
        x = x0 - (y1 - y0)
        while x < x1:
            a = (max(x0, x), y1 - (max(x0, x) - x)); b = (min(x1, x + (y1 - y0)), y1 - (min(x1, x + (y1 - y0)) - x))
            if a[0] < b[0]: ln(a[0], a[1], b[0], b[1], w)
            x += gap
def bricks(x0, y0, x1, y1, rowh=5.2, w=0.55):
    """sparse brick coursing so the walk-up reads as brick, not glass"""
    y, k = y0 + rowh, 0
    while y < y1:
        xx_ = x0 + (k % 2) * 6
        while xx_ < x1 - 4:
            if random.random() < 0.55: ln(xx_ + 1, y, min(x1 - 1, xx_ + 9), y, w)
            xx_ += 12
        y += rowh; k += 1

GROUND, CURB = 792, 800
top_y = 560
# --- building A: brick walk-up, left
ax0, ax1, aroof = 48, 238, 616
rect(ax0, aroof, ax1, GROUND, 1.6)
ln(ax0 - 2, aroof, ax1 + 2, aroof, 2.2); ln(ax0, aroof + 5, ax1, aroof + 5, 1.0)   # cornice
for k in range(9): ln(ax0 + 6 + k * 21, aroof + 5, ax0 + 6 + k * 21, aroof + 9, 1.0)  # dentils
bricks(ax0 + 2, aroof + 10, ax1 - 2, GROUND - 62)
floors = [(aroof + 18, aroof + 46), (aroof + 58, aroof + 86), (aroof + 98, aroof + 126)]
for i, (fy0, fy1) in enumerate(floors):
    for j, wx in enumerate((ax0 + 20, ax0 + 82, ax0 + 144)):
        ld.rectangle(((wx - 3) * S, (fy0 - 4) * S, (wx + 31) * S, (fy1 + 3) * S), fill=0)
        rect(wx, fy0, wx + 28, fy1, 1.2)
        ln(wx - 3, fy0 - 3, wx + 31, fy0 - 3, 2.0)           # lintel
        ln(wx - 2, fy1 + 2, wx + 30, fy1 + 2, 1.4)           # sill
        ln(wx + 14, fy0, wx + 14, fy1, 0.8)                  # sash
        if (i, j) in ((0, 2), (1, 0), (2, 1)): hatch(wx, fy0, wx + 28, fy1)   # lights on
# A storefront: closed, roll-down gate
gx0, gx1 = ax0 + 14, ax1 - 14
rect(gx0, GROUND - 52, gx1, GROUND, 1.3)
for k in range(1, 13): ln(gx0, GROUND - 52 + k * 4, gx1, GROUND - 52 + k * 4, 0.6)
ln(ax0, GROUND - 58, ax1, GROUND - 58, 1.8)
# water tower on A's roof
wx0, wx1 = 116, 168
ld.rectangle((wx0 * S, 574 * S, wx1 * S, 604 * S), fill=0)
rect(wx0, 574, wx1, 604, 1.4)
for k in range(1, 7): ln(wx0 + k * 7.4, 575, wx0 + k * 7.4, 603, 0.6)              # staves
ln(wx0, 584, wx1, 584, 1.0); ln(wx0, 595, wx1, 595, 1.0)                              # hoops
ld.polygon([(wx0 - 3) * S, 574 * S, (wx0 + wx1) / 2 * S, 562 * S, (wx1 + 3) * S, 574 * S], outline=255, width=int(1.4 * S))
for lx in (wx0 + 4, wx1 - 4): ln(lx, 604, lx - 4 if lx < 140 else lx + 4, aroof, 1.2)
ln(wx0 + 2, 610, wx1 - 2, 610, 0.9)

# --- building B: cast-iron front, the bar at street level
bx0, bx1, broof = 246, 566, 580
rect(bx0, broof, bx1, GROUND, 1.6)
ln(bx0 - 4, broof, bx1 + 4, broof, 2.6); ln(bx0 - 2, broof + 6, bx1 + 2, broof + 6, 1.2)
for k in range(16): ln(bx0 + 8 + k * 20, broof + 6, bx0 + 8 + k * 20, broof + 11, 1.0)
bays = 5; bw = (bx1 - bx0) / bays
for k in range(1, bays):
    cx = bx0 + k * bw
    ln(cx - 3, broof + 12, cx - 3, GROUND - 64, 1.1); ln(cx + 3, broof + 12, cx + 3, GROUND - 64, 1.1)   # columns
lit = {(0, 1), (1, 3), (2, 0), (2, 4), (3, 2)}
fl_h = (GROUND - 64 - (broof + 14)) / 4
for f in range(4):
    fy0 = broof + 16 + f * fl_h
    ln(bx0, fy0 + fl_h - 2, bx1, fy0 + fl_h - 2, 1.4)       # floor band
    for b in range(bays):
        x0 = bx0 + b * bw + 9; x1 = bx0 + (b + 1) * bw - 9
        y0 = fy0 + 8; y1 = fy0 + fl_h - 8
        r = (x1 - x0) / 2
        x0 += 4; x1 -= 4; ah = 4.5
        ld.arc(((x0) * S, (y0) * S, (x1) * S, (y0 + 2 * ah) * S), 180, 360, fill=255, width=int(1.2 * S))
        ld.arc(((x0 - 2) * S, (y0 - 3) * S, (x1 + 2) * S, (y0 + 2 * ah - 1) * S), 200, 340, fill=255, width=int(1.8 * S))   # hood
        ln(x0, y0 + ah, x0, y1, 1.2); ln(x1, y0 + ah, x1, y1, 1.2); ln(x0 - 2, y1, x1 + 2, y1, 1.6)
        ln((x0 + x1) / 2, y0 + 1, (x0 + x1) / 2, y1, 0.7); ln(x0, (y0 + y1) / 2 + 2, x1, (y0 + y1) / 2 + 2, 0.7)
        if (f, b) in lit: hatch(x0 + 1, y0 + ah + 1, x1 - 1, y1)
# fire escape on B's right bays
fx0, fx1 = bx0 + 3 * bw + 2, bx1 - 4
for f in range(4):
    py = broof + 16 + (f + 1) * fl_h - 4
    ld.rectangle((fx0 * S, (py - 7) * S, fx1 * S, py * S), fill=0)
    ln(fx0, py, fx1, py, 1.6); ln(fx0, py - 9, fx1, py - 9, 1.0)
    for k in range(int((fx1 - fx0) / 6) + 1): ln(fx0 + k * 6, py - 9, fx0 + k * 6, py, 0.6)
    if f < 3: ln(fx0 + 10 + (f % 2) * 70, py, fx0 + 80 - (f % 2) * 70, py + fl_h - 9, 1.2)   # stair
# storefront: sign band, the bar window in red, door with transom
sb0, sb1 = GROUND - 64, GROUND - 50
rect(bx0 + 2, sb0, bx1 - 2, sb1, 1.4)
for k in range(30): ln(bx0 + 8 + k * 10.6, sb0 + 3, bx0 + 8 + k * 10.6, sb1 - 3, 0.5)
winx0, winx1, winy0, winy1 = bx0 + 16, bx0 + 196, GROUND - 46, GROUND - 6
kd.rectangle((winx0 * S, winy0 * S, winx1 * S, winy1 * S), fill=255)
rd.rectangle((winx0 * S, winy0 * S, winx1 * S, winy1 * S), fill=255)
rect(winx0, winy0, winx1, winy1, 1.6)
ln((winx0 + winx1) / 2, winy0, (winx0 + winx1) / 2, winy1, 1.2)
# little LAST STOP in the window, card-coloured in the red
mini = word('LAST', 12 * S, (winx0 + 14) * S, (winy0 + 13) * S, 0.24) + word('STOP', 12 * S, (winx0 + 100) * S, (winy0 + 13) * S, 0.24)
for L in mini: stroke_into(ld, L, 1.6 * S)
dx0 = bx0 + 214; dx1 = dx0 + 34
rect(dx0, GROUND - 46, dx1, GROUND, 1.4); rect(dx0 + 5, GROUND - 40, dx1 - 5, GROUND - 22, 0.9)
hatch(dx0 + 5, GROUND - 40, dx1 - 5, GROUND - 22, 2.2, 0.6)
ld.ellipse(((dx1 - 8) * S, (GROUND - 20) * S, (dx1 - 5) * S, (GROUND - 17) * S), fill=255)
rect(dx1 + 14, GROUND - 46, bx1 - 14, GROUND - 6, 1.3)
hatch(dx1 + 15, GROUND - 45, bx1 - 15, GROUND - 7, 3.2, 0.6, ang=1)
for k in range(2): ln(bx0 + 2 + k * 2, GROUND - 2 - k * 2, bx1 - 2 - k * 2, GROUND - 2 - k * 2, 0.9)  # step

# --- building C: lower, right
cx0, cx1, croof = 574, 768, 648
rect(cx0, croof, cx1, GROUND, 1.6)
ln(cx0 - 2, croof, cx1 + 2, croof, 2.2)
bricks(cx0 + 2, croof + 6, cx1 - 2, GROUND - 60)
for i, fy in enumerate((croof + 14, croof + 50)):
    for j, wx in enumerate((cx0 + 16, cx0 + 76, cx0 + 136)):
        ld.rectangle(((wx - 3) * S, (fy - 4) * S, (wx + 33) * S, (fy + 28) * S), fill=0)
        rect(wx, fy, wx + 30, fy + 26, 1.2); ln(wx - 3, fy - 3, wx + 33, fy - 3, 2.0); ln(wx + 15, fy, wx + 15, fy + 26, 0.8)
        if (i, j) in ((0, 0), (1, 2)): hatch(wx, fy, wx + 30, fy + 26)
rect(cx0 + 12, GROUND - 46, cx1 - 70, GROUND, 1.3)
for k in range(1, 12): ln(cx0 + 12, GROUND - 46 + k * 4, cx1 - 70, GROUND - 46 + k * 4, 0.6)
rect(cx1 - 56, GROUND - 46, cx1 - 24, GROUND, 1.3)
ln(cx0, GROUND - 52, cx1, GROUND - 52, 1.8)
# rooftop: chimney and vents on C, against the sky
rect(cx1 - 48, croof - 22, cx1 - 34, croof, 1.2); ln(cx1 - 50, croof - 22, cx1 - 32, croof - 22, 1.8)
rect(cx0 + 30, croof - 12, cx0 + 38, croof, 1.0)

# --- street: curb, cobra head light, hydrant, the bar's own light pooled on the sidewalk
ln(48, GROUND, 768, GROUND, 1.8)
ln(48, CURB, 768, CURB, 1.2)
for k in range(15): ln(60 + k * 48, GROUND + 1, 56 + k * 48, CURB - 1, 0.7)   # sidewalk joints
px = 236
ld.line([(px * S, GROUND * S), (px * S, 650 * S), ((px + 34) * S, 640 * S)], fill=0, width=int(7 * S))
ld.polygon([(px + 23) * S, 634 * S, (px + 49) * S, 635 * S, (px + 47) * S, 647 * S, (px + 25) * S, 647 * S], fill=0)
ln(px, GROUND, px, 650, 2.2); ln(px - 1, 650, px + 34, 640, 2.0)
ld.polygon([(px + 26) * S, 637 * S, (px + 46) * S, 638 * S, (px + 44) * S, 644 * S, (px + 28) * S, 644 * S], fill=255)
ld.rectangle(((px - 4) * S, (GROUND - 8) * S, (px + 4) * S, GROUND * S), fill=255)
hx = 590
ld.rounded_rectangle(((hx - 5) * S, (GROUND - 16) * S, (hx + 5) * S, (GROUND - 1) * S), radius=2 * S, outline=255, width=int(1.2 * S))
ld.ellipse(((hx - 5) * S, (GROUND - 21) * S, (hx + 5) * S, (GROUND - 12) * S), outline=255, width=int(1.2 * S))
ln(hx - 9, GROUND - 10, hx + 9, GROUND - 10, 1.4)

LN = blur(arr(lines), 0.9)
rough = np.random.RandomState(9).rand(H, W)
rough = np.asarray(Image.fromarray((rough * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), float) / 255
LN = np.clip((LN - 0.42 - (rough - 0.5) * 0.5) * 5 + 0.5, 0, 1)
RW = arr(redw)
KO = arr(ko)

# composite the block into the plates: lines are bare card, the window is red on card
black = np.minimum(black, 1 - LN)
black = np.minimum(black, 1 - KO)
red_blk = shift(RW * (1 - LN), *MIS)
red = np.maximum(red, red_blk)

# ---------------- ink texture and print ----------------
def mottle(scale, seed):
    rs = np.random.RandomState(seed)
    n = rs.rand(H // scale + 2, W // scale + 2)
    im = Image.fromarray((n * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(scale * 0.5))
    return np.asarray(im, float) / 255
mk = mottle(90, 3)
k_ink = BLACK[None, None, :] + (mk[..., None] - 0.5) * 7       # uneven solid
r_ink = RED[None, None, :] * (0.94 + 0.08 * mottle(30, 5)[..., None])

out = np.ones((H, W, 3)) * PAPER
out = out * (1 - red[..., None]) + out * (r_ink / 255) * red[..., None]
out = out * (1 - black[..., None]) + out * (k_ink / 255) * black[..., None]
img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8))
img.save(os.path.join(A, 'front-print.png'), optimize=True)
print('front-print', img.size)
