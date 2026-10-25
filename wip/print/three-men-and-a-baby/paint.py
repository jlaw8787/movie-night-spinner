"""Paints the line work for the loft supper sheet (Three Men and a Baby, 1987).
Everything is drawn the way a diazo blueline print looks: one violet blue ink, lines
slightly soft where the ammonia print spread them. Text is NOT painted here; it sits
on top as live HTML so it stays crisp.
Writes assets/plan.png, assets/north.png, assets/wear-sheet.png."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 2                                   # paint at 2x
INK = (44, 58, 143)
random.seed(1987)

def layer(w, h):
    im = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0))
    return im, ImageDraw.Draw(im)

def P(*v): return [round(x * S) for x in v]

def soften(im, r=0.55):
    """Diazo spread: a touch of blur and a slightly uneven ink density."""
    a = im.split()[3].filter(ImageFilter.GaussianBlur(r * S))
    n = Image.effect_noise((im.width // 24 + 1, im.height // 24 + 1), 40).resize(im.size, Image.BICUBIC)
    n = n.point(lambda v: 205 + (v - 128) * 0.35)
    a = ImageChops.multiply(a, n)
    out = Image.new('RGBA', im.size, INK + (0,)); out.putalpha(a)
    return out

def dashed(d, x1, y1, x2, y2, dash=10, gap=6, w=1.2):
    L = math.hypot(x2 - x1, y2 - y1); ux, uy = (x2 - x1) / L, (y2 - y1) / L
    t = 0
    while t < L:
        e = min(t + dash, L)
        d.line(P(x1 + ux * t, y1 + uy * t, x1 + ux * e, y1 + uy * e), fill=INK + (255,), width=round(w * S))
        t = e + gap

def wall(d, x1, y1, x2, y2, t=12):
    """Solid poche wall with diagonal hatch, outlined."""
    d.rectangle(P(x1, y1, x2, y2), outline=INK + (255,), width=round(1.6 * S))
    w, h = x2 - x1, y2 - y1
    for k in range(-int(h), int(w), 6):
        ax, ay = x1 + k, y1
        bx, by = x1 + k + h, y2
        # clip the diagonal to the wall rectangle
        if ax < x1: ay += (x1 - ax); ax = x1
        if bx > x2: by -= (bx - x2); bx = x2
        if ay < by:
            d.line(P(ax, ay, bx, by), fill=INK + (200,), width=round(0.9 * S))

def door(d, hx, hy, r, a0, a1, leaf_angle):
    """Hinge at (hx, hy), leaf of length r drawn open at leaf_angle, swing arc a0 to a1."""
    d.arc(P(hx - r, hy - r, hx + r, hy + r), a0, a1, fill=INK + (230,), width=round(1 * S))
    ex, ey = hx + r * math.cos(math.radians(leaf_angle)), hy + r * math.sin(math.radians(leaf_angle))
    d.line(P(hx, hy, ex, ey), fill=INK + (255,), width=round(2 * S))

def window(d, x1, y1, x2, y2, horiz=True):
    d.rectangle(P(x1, y1, x2, y2), fill=(0, 0, 0, 0), outline=INK + (255,), width=round(1.4 * S))
    if horiz:
        m = (y1 + y2) / 2
        d.line(P(x1, m - 2, x2, m - 2), fill=INK + (255,), width=round(1 * S))
        d.line(P(x1, m + 2, x2, m + 2), fill=INK + (255,), width=round(1 * S))
    else:
        m = (x1 + x2) / 2
        d.line(P(m - 2, y1, m - 2, y2), fill=INK + (255,), width=round(1 * S))
        d.line(P(m + 2, y1, m + 2, y2), fill=INK + (255,), width=round(1 * S))

def rect(d, x1, y1, x2, y2, w=1.6, fill=None, r=0):
    if r:
        d.rounded_rectangle(P(x1, y1, x2, y2), radius=r * S, outline=INK + (255,), width=round(w * S), fill=fill)
    else:
        d.rectangle(P(x1, y1, x2, y2), outline=INK + (255,), width=round(w * S), fill=fill)

def cloud(d, x1, y1, x2, y2, bump=13):
    """Revision cloud: a ring of scalloped arcs around a rounded rectangle."""
    pts = []
    cx, cy, rx, ry = (x1 + x2) / 2, (y1 + y2) / 2, (x2 - x1) / 2, (y2 - y1) / 2
    n = 400
    for i in range(n):
        t = 2 * math.pi * i / n
        c, s = math.cos(t), math.sin(t)
        # superellipse so the cloud hugs a rectangle
        x = cx + rx * math.copysign(abs(c) ** 0.45, c)
        y = cy + ry * math.copysign(abs(s) ** 0.45, s)
        pts.append((x, y))
    # walk the path and drop arcs every ~bump px
    acc, last, marks = 0, pts[0], [pts[0]]
    for p in pts[1:] + [pts[0]]:
        acc += math.hypot(p[0] - last[0], p[1] - last[1]); last = p
        if acc >= bump * 1.6:
            marks.append(p); acc = 0
    for (ax, ay), (bx, by) in zip(marks, marks[1:] + marks[:1]):
        mx, my = (ax + bx) / 2, (ay + by) / 2
        r = math.hypot(bx - ax, by - ay) / 2
        ang = math.degrees(math.atan2(by - ay, bx - ax))
        # outward bulge: arc on the side away from the centre
        out = math.degrees(math.atan2(my - cy, mx - cx))
        d.arc(P(mx - r, my - r, mx + r, my + r), out - 95, out + 95, fill=INK + (255,), width=round(1.6 * S))

# ------------------------------------------------------------------ plan
W, H = 660, 600
im, d = layer(W, H)
X1, Y1, X2, Y2, T = 40, 50, 640, 560, 12

# column grid, dashed centre lines (bubbles are HTML)
for gx in (40, 240, 440, 640):
    dashed(d, gx, 30, gx, 582, 14, 5, 0.9)
for gy in (50, 305, 560):
    dashed(d, 24, gy, 650, gy, 14, 5, 0.9)
for gx, gy in ((240, 305), (440, 305)):
    rect(d, gx - 6, gy - 6, gx + 6, gy + 6, 1.4, fill=INK + (255,))

# exterior walls with openings for windows and the front door
wall(d, X1 - T / 2, Y1 - T / 2, X2 + T / 2, Y1 + T / 2)              # north
wall(d, X1 - T / 2, Y2 - T / 2, X2 + T / 2, Y2 + T / 2)              # south
wall(d, X1 - T / 2, Y1 - T / 2, X1 + T / 2, Y2 + T / 2)              # west
wall(d, X2 - T / 2, Y1 - T / 2, X2 + T / 2, Y2 + T / 2)              # east
# loft windows along the north and west walls
for a, b in ((70, 130), (318, 420)):
    d.rectangle(P(a, Y1 - T / 2 + 1, b, Y1 + T / 2 - 1), fill=(0, 0, 0, 0))
    window(d, a, Y1 - T / 2, b, Y1 + T / 2, True)
for a, b in ((330, 420), (470, 545)):
    d.rectangle(P(X1 - T / 2 + 1, a, X1 + T / 2 - 1, b), fill=(0, 0, 0, 0))
    window(d, X1 - T / 2, a, X1 + T / 2, b, False)
# front door opening in the south wall
DX1, DX2 = 252, 300
d.rectangle(P(DX1, Y2 - T / 2 - 1, DX2, Y2 + T / 2 + 1), fill=(0, 0, 0, 0))
door(d, DX1, Y2 - T / 2, DX2 - DX1, 270, 360, 270)
d.line(P(DX1, Y2 - T / 2, DX1, Y2 + T / 2), fill=INK + (255,), width=round(1.6 * S))
d.line(P(DX2, Y2 - T / 2, DX2, Y2 + T / 2), fill=INK + (255,), width=round(1.6 * S))

# bedroom partitions on the east side
PX = 470
def part(x1, y1, x2, y2): wall(d, x1, y1, x2, y2, 0)
part(PX - 4, Y1, PX + 4, Y2)
part(PX, 220 - 4, X2, 220 + 4)
part(PX, 390 - 4, X2, 390 + 4)
for y0 in (172, 342, 512):                          # door openings into each bedroom
    d.rectangle(P(PX - 5, y0 - 34, PX + 5, y0 + 1), fill=(0, 0, 0, 0))
    d.line(P(PX - 4, y0 - 34, PX + 4, y0 - 34), fill=INK + (255,), width=round(1.4 * S))
    d.line(P(PX - 4, y0, PX + 4, y0), fill=INK + (255,), width=round(1.4 * S))
    door(d, PX + 4, y0, 34, 270, 360, 0)
# beds, each with a pillow and turned-down sheet
for y0 in (90, 260, 430):
    rect(d, 560, y0, 628, y0 + 96, 1.6)
    rect(d, 566, y0 + 6, 622, y0 + 22, 1.1, r=4)
    d.line(P(560, y0 + 34, 628, y0 + 34), fill=INK + (255,), width=round(1 * S))
    rect(d, 562, y0 + 100, 580, y0 + 118, 1.1)     # night table

# kitchen run along the north wall, refrigerator in the corner
rect(d, 52, 62, 300, 92, 1.6)
d.line(P(52, 86, 300, 86), fill=INK + (160,), width=round(0.8 * S))
rect(d, 52, 100, 88, 146, 1.6)                     # refrigerator
d.line(P(52, 100, 88, 146), fill=INK + (190,), width=round(0.8 * S))
d.line(P(88, 100, 52, 146), fill=INK + (190,), width=round(0.8 * S))
for cx in (166, 192):                              # range, four burners
    for cy in (70, 84):
        r = 5.5
        d.ellipse(P(cx - r, cy - r, cx + r, cy + r), outline=INK + (255,), width=round(1.1 * S))
rect(d, 228, 66, 270, 88, 1.2, r=4)                # sink
d.ellipse(P(247, 69, 251, 73), fill=INK + (255,))
# island counter
rect(d, 120, 128, 300, 156, 1.6)
for sx in (150, 200, 250):                         # stools
    d.ellipse(P(sx - 8, 166 - 8, sx + 8, 166 + 8), outline=INK + (255,), width=round(1.1 * S))

# long dining table and chairs
TX1, TY1, TX2, TY2 = 110, 222, 330, 276
rect(d, TX1, TY1, TX2, TY2, 1.8)
for cx in (145, 220, 295):
    rect(d, cx - 12, TY1 - 22, cx + 12, TY1 - 6, 1.2, r=3)
    rect(d, cx - 12, TY2 + 6, cx + 12, TY2 + 22, 1.2, r=3)
rect(d, TX1 - 22, 237, TX1 - 6, 261, 1.2, r=3)
rect(d, TX2 + 6, 237, TX2 + 22, 261, 1.2, r=3)

# Mary's bassinet by the column, inside revision cloud 1
rect(d, 384, 230, 432, 260, 1.6, r=12)
rect(d, 389, 235, 402, 255, 1.0, r=5)
cloud(d, 366, 210, 450, 280)

# living area: sofa, coffee table, two drawing tables by the west windows
rect(d, 80, 470, 250, 500, 1.6, r=4)               # sofa
rect(d, 86, 476, 244, 494, 0.9, r=3)
rect(d, 110, 400, 220, 440, 1.4)                   # coffee table
rect(d, 70, 340, 92, 400, 1.4)                     # side chair
# drafting table (Peter) and drawing board (Michael), each with a stool
for x0, y0 in ((300, 470), (380, 470)):
    rect(d, x0, y0, x0 + 64, y0 + 42, 1.6)
    d.line(P(x0 + 4, y0 + 10, x0 + 60, y0 + 10), fill=INK + (190,), width=round(0.9 * S))
    d.ellipse(P(x0 + 24, y0 + 50, x0 + 40, y0 + 66), outline=INK + (255,), width=round(1.1 * S))

# hall outside the front door, dashed outline where the bassinet was found
dashed(d, 222, 576, 340, 576, 8, 5, 1.0)
for (a, b, c, e) in ((262, 572, 292, 572), (262, 590, 292, 590), (262, 572, 262, 590), (292, 572, 292, 590)):
    dashed(d, a, b, c, e, 4, 3, 1.0)

soften(im).save(os.path.join(A, 'plan.png'))

# ------------------------------------------------------------------ north arrow
im, d = layer(64, 64)
d.ellipse(P(6, 6, 58, 58), outline=INK + (255,), width=round(1.6 * S))
d.polygon(P(32, 8, 42, 44, 32, 37, 22, 44), outline=INK + (255,))
d.polygon(P(32, 8, 32, 37, 22, 44), fill=INK + (255,))
d.line(P(32, 8, 42, 44), fill=INK + (255,), width=round(1.2 * S))
d.line(P(42, 44, 32, 37), fill=INK + (255,), width=round(1.2 * S))
soften(im, 0.4).save(os.path.join(A, 'north.png'))

# ------------------------------------------------------------------ wear
FW, FH = 1632, 1056
w, h = FW, FH
base = Image.new('RGBA', (w, h), (0, 0, 0, 0))
# 1. soft blue background haze, the light tint every diazo print carries, uneven
haze = Image.effect_noise((w // 90, h // 90), 60).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
haze_a = haze.point(lambda v: max(0, min(255, int((v - 100) * 0.22))))
tint = Image.new('RGBA', (w, h), (120, 132, 196, 0)); tint.putalpha(haze_a)
base = Image.alpha_composite(base, tint)
# 2. the faint banding a diazo machine leaves along the feed direction
band = Image.new('L', (1, h))
for y in range(h):
    band.putpixel((0, y), int(9 + 7 * math.sin(y / 37.0) + 5 * math.sin(y / 11.3 + 1)))
band = band.resize((w, h)).filter(ImageFilter.GaussianBlur(6))
bl = Image.new('RGBA', (w, h), (110, 120, 180, 0)); bl.putalpha(band.point(lambda v: max(0, v - 6)))
base = Image.alpha_composite(base, bl)
# 3. edges yellowed from the light, stronger on the right where it sat on a sill
edge = Image.new('L', (w, h), 0); ed = ImageDraw.Draw(edge)
for i in range(70):
    a = int((70 - i) * 0.95)
    ed.rectangle([i, i, w - 1 - i, h - 1 - i], outline=a)
edge = edge.filter(ImageFilter.GaussianBlur(18))
side = Image.linear_gradient('L').rotate(90, expand=True).resize((w, h)).point(lambda v: int((255 - v) * 0.10))
edge = ImageChops.add(edge, side)
yl = Image.new('RGBA', (w, h), (196, 170, 96, 0)); yl.putalpha(edge)
base = Image.alpha_composite(base, yl)
# 4. a pale ring where a baby bottle stood on the sheet, partly off the plan corner
ring = Image.new('L', (w, h), 0); rd = ImageDraw.Draw(ring)
cx, cy, r = 660, 690, 46
for k in range(5):
    rd.ellipse([cx - r - k, cy - r - k, cx + r + k, cy + r + k], outline=26 - k * 4, width=2)
rd.arc([cx - r - 3, cy - r - 3, cx + r + 3, cy + r + 3], 200, 320, fill=40, width=4)
ring = ring.filter(ImageFilter.GaussianBlur(3))
rg = Image.new('RGBA', (w, h), (170, 150, 110, 0)); rg.putalpha(ring)
base = Image.alpha_composite(base, rg)
base.save(os.path.join(A, 'wear-sheet.png'))
print('painted')
