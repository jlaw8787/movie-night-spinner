"""Paints the art and soft wear layers for the Cape Bay Excursion Line leaflet (Splash, 1984).
assets/bay-art.png        two-ink harbour scene: excursion boat, lighthouse point, low sun (blue and red on paper)
assets/wear-front.png     soft edge wear, salt-spray mottling (transparent)
assets/wear-back.png      soft edge wear, a faint melted-butter spot near the lobster line (transparent)
assets/paper-grain.png    copied from the Jurassic kit, shared fine grain"""
import os, random, math, shutil
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
shutil.copy('/home/claude/polish/wip/print/jurassic/src/assets/paper-grain.png', os.path.join(A, 'paper-grain.png'))
PAPER, BLUE, BLUE_T, RED = (247, 243, 233), (31, 79, 158), (150, 175, 214), (207, 59, 42)
random.seed(1964)

# ---------- art: 496 x 268 css px, painted at 4x, saved at 2x
CW, CH, S = 496, 268, 4
W, H = CW * S, CH * S
im = Image.new('RGB', (W, H), PAPER)
d = ImageDraw.Draw(im)
def P(x, y): return (round(x * S), round(y * S))
def poly(pts, fill): d.polygon([P(x, y) for x, y in pts], fill=fill)
def rect(x0, y0, x1, y1, fill): d.rectangle([P(x0, y0), P(x1, y1)], fill=fill)
def ell(cx, cy, r, fill): d.ellipse([P(cx - r, cy - r), P(cx + r, cy + r)], fill=fill)

HOR = 150
# sky: blue halftone dots, heavy at the top, fading to paper at the horizon
step = 6
for j, y in enumerate(range(3, HOR, step)):
    t = 1 - y / HOR
    r = 2.1 * t ** 1.1
    if r < 0.35: continue
    off = (step / 2) if j % 2 else 0
    x = off
    while x < CW + step:
        ell(x, y, r, BLUE)
        x += step
# low sun, red, sitting on the horizon
sx, sr = 452, 30
d.pieslice([P(sx - sr, HOR - sr), P(sx + sr, HOR + sr)], 180, 360, fill=RED)
# sun bands cut in paper, a printed sunset
for k, yy in enumerate((HOR - 9, HOR - 18, HOR - 26)):
    rect(sx - sr, yy, sx + sr, yy + 2.2 - k * 0.5, PAPER)

# lighthouse point on the left: low dune, keeper's house, tower
dune = [(0, HOR + 2), (0, HOR - 18)]
for i in range(0, 200, 8):
    dune.append((i, HOR - 18 + 10 * (i / 200) ** 1.6 - 3 * math.sin(i / 17)))
dune += [(200, HOR + 2)]
poly(dune, BLUE)
# keeper's house
rect(88, HOR - 40, 124, HOR - 18, PAPER)
poly([(84, HOR - 40), (106, HOR - 56), (128, HOR - 40)], RED)
rect(94, HOR - 34, 101, HOR - 26, BLUE); rect(111, HOR - 34, 118, HOR - 26, BLUE)
# tower
tx, tb, tt = 56, HOR - 20, HOR - 108
poly([(tx - 13, tb), (tx - 8, tt), (tx + 8, tt), (tx + 13, tb)], PAPER)
for k in range(3):   # red bands
    y0 = tt + 18 + k * 30; y1 = y0 + 12
    w0 = 8 + 5 * (y0 - tt) / (tb - tt); w1 = 8 + 5 * (y1 - tt) / (tb - tt)
    poly([(tx - w0, y0), (tx + w0, y0), (tx + w1, y1), (tx - w1, y1)], RED)
rect(tx - 11, tt - 3, tx + 11, tt, BLUE)        # gallery
rect(tx - 7, tt - 15, tx + 7, tt - 3, PAPER)   # lantern glass
rect(tx - 7, tt - 15, tx - 5.5, tt - 3, BLUE); rect(tx + 5.5, tt - 15, tx + 7, tt - 3, BLUE)
poly([(tx - 9, tt - 15), (tx, tt - 25), (tx + 9, tt - 15)], RED)
# beam, two pale rays
poly([(tx + 7, tt - 9), (tx + 74, tt - 16), (tx + 74, tt - 6)], BLUE_T)
poly([(tx - 7, tt - 9), (tx - 50, tt - 15), (tx - 50, tt - 6)], BLUE_T)

# sea: solid blue with paper wave strokes
rect(0, HOR, CW, CH, BLUE)
for row in range(9):
    y = HOR + 10 + row * 12.5
    amp = 1.2 + row * 0.25
    x = (row * 23) % 40
    while x < CW:
        L = random.uniform(26, 60)
        pts = [P(x + u, y + amp * math.sin((x + u) / 9)) for u in range(0, int(L), 2)]
        if len(pts) > 1: d.line(pts, fill=PAPER, width=round(S * (1.1 + row * 0.12)))
        x += L + random.uniform(20, 46)
# sun glitter on the water, red dashes
for k in range(7):
    y = HOR + 6 + k * 7
    w = 26 - k * 3.2
    rect(sx - w, y, sx + w, y + 1.8, RED)

# excursion boat, side view, heading left
bx, bw = 176, 228         # hull left, length
wl = HOR + 30             # waterline
hull = [(bx, wl - 30), (bx + bw + 6, wl - 34), (bx + bw - 10, wl), (bx + 22, wl)]
poly(hull, PAPER)
poly([(bx + 2, wl - 21), (bx + bw + 2, wl - 24), (bx + bw - 4, wl - 13), (bx + 12, wl - 12)], BLUE)
poly([(bx + 12, wl - 12), (bx + bw - 4, wl - 13), (bx + bw - 10, wl), (bx + 22, wl)], RED)
# portholes on the blue band
for k in range(9):
    ell(bx + 30 + k * 21, wl - 17, 2.6, PAPER)
# main deck cabin
cy0 = wl - 30
rect(bx + 26, cy0 - 30, bx + bw - 22, cy0, PAPER)
d.rectangle([P(bx + 26, cy0 - 30), P(bx + bw - 22, cy0)], outline=BLUE, width=S * 2)
for k in range(10):
    wx = bx + 34 + k * 17.4
    rect(wx, cy0 - 23, wx + 11, cy0 - 12, BLUE)
# upper deck rail and wheelhouse
uy = cy0 - 30
rect(bx + 20, uy - 2, bx + bw - 14, uy, BLUE)
rect(bx + 20, uy - 15, bx + bw - 60, uy - 13.5, BLUE)
for px in range(bx + 20, bx + bw - 58, 8):
    rect(px, uy - 15, px + 1.2, uy - 2, BLUE)
rect(bx + bw - 62, uy - 30, bx + bw - 22, uy - 1, PAPER)
d.rectangle([P(bx + bw - 62, uy - 30), P(bx + bw - 22, uy - 1)], outline=BLUE, width=S * 2)
rect(bx + bw - 56, uy - 24, bx + bw - 46, uy - 15, BLUE); rect(bx + bw - 40, uy - 24, bx + bw - 30, uy - 15, BLUE)
rect(bx + bw - 66, uy - 34, bx + bw - 18, uy - 30, RED)  # wheelhouse roof
# mast and flag
rect(bx + bw - 43, uy - 62, bx + bw - 41, uy - 34, BLUE)
poly([(bx + bw - 41, uy - 62), (bx + bw - 23, uy - 57), (bx + bw - 41, uy - 52)], RED)
# bow rail
d.line([P(bx + bw - 22, cy0 - 1), P(bx + bw + 4, wl - 36)], fill=BLUE, width=S * 2)
# wake behind the stern, paper foam
for k in range(5):
    y = wl + 2 + k * 4
    rect(bx + 18 - k * 14, y, bx + 30 - k * 4, y + 1.6, PAPER)

# gulls
for gx, gy, gs in ((262, 40, 7), (290, 58, 5), (232, 66, 4.5), (420, 30, 5.5)):
    d.line([P(gx - gs, gy - gs * 0.5), P(gx - gs * 0.4, gy - gs * 0.1), P(gx, gy + gs * 0.15),
            P(gx + gs * 0.4, gy - gs * 0.1), P(gx + gs, gy - gs * 0.5)], fill=BLUE, width=S * 2, joint='curve')

im = im.resize((CW * 2, CH * 2), Image.LANCZOS)
im.save(os.path.join(A, 'bay-art.png'))

# ---------- soft wear layers, 576 x 864 css at 2x
FW, FH = 576 * 2, 864 * 2
def wear(seed, spot=None):
    random.seed(seed)
    a = Image.new('L', (FW, FH), 0)
    g = ImageDraw.Draw(a)
    # big gentle mottling
    for _ in range(26):
        x, y = random.uniform(0, FW), random.uniform(0, FH)
        r = random.uniform(120, 320)
        g.ellipse([x - r, y - r, x + r, y + r], fill=random.randint(6, 16))
    a = a.filter(ImageFilter.GaussianBlur(90))
    # edge wear: a soft darkening band all round, heavier at the corners
    e = Image.new('L', (FW, FH), 0)
    ge = ImageDraw.Draw(e)
    for i in range(36):
        ge.rectangle([i, i, FW - 1 - i, FH - 1 - i], outline=int(70 * (1 - i / 36) ** 2))
    for cx, cy in ((0, 0), (FW, 0), (0, FH), (FW, FH)):
        ge.ellipse([cx - 90, cy - 90, cx + 90, cy + 90], fill=34)
    e = e.filter(ImageFilter.GaussianBlur(14))
    a = Image.fromarray(__import__('numpy').maximum(__import__('numpy').array(a), __import__('numpy').array(e)))
    rgba = Image.new('RGBA', (FW, FH), (120, 98, 62, 0))
    rgba.putalpha(a)
    if spot:   # soft greasy spot: slightly darker, warmer, blurred, with a faint rim
        sx, sy, sr = spot
        s = Image.new('L', (FW, FH), 0)
        gs = ImageDraw.Draw(s)
        gs.ellipse([sx - sr, sy - sr * 0.86, sx + sr, sy + sr * 0.86], fill=20)
        gs.ellipse([sx - sr, sy - sr * 0.86, sx + sr, sy + sr * 0.86], outline=30, width=5)
        s = s.filter(ImageFilter.GaussianBlur(9))
        sp = Image.new('RGBA', (FW, FH), (176, 132, 40, 0)); sp.putalpha(s)
        rgba = Image.alpha_composite(rgba, sp)
    return rgba
wear(84, None).save(os.path.join(A, 'wear-front.png'))
wear(1984, (FW - 170, 560, 62)).save(os.path.join(A, 'wear-back.png'))
print('painted')
