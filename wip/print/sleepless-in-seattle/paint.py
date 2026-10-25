"""Paints the placemat art and soft wear layers with PIL.
assets/dock-art.png    two-ink illustration of the houseboat docks at night (teal and red on paper)
assets/wear-stain.png  soft coffee ring, grease sheen and edge wear for the placemat (transparent)"""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
PAPER, TEAL, TEAL_T, TEAL_D, RED = (243, 237, 222), (29, 88, 88), (96, 142, 138), (18, 62, 64), (196, 64, 44)
random.seed(1993)

# ---- art: 452 x 300 css px, painted at 4x then reduced to 2x
CW, CH = 452, 300
S = 4
W, H = CW * S, CH * S
im = Image.new('RGB', (W, H), TEAL_T)
d = ImageDraw.Draw(im)
def P(x, y): return (int(x * S), int(y * S))
def poly(pts, fill): d.polygon([P(x, y) for x, y in pts], fill=fill)
def rect(x0, y0, x1, y1, fill): d.rectangle([P(x0, y0), P(x1, y1)], fill=fill)
# sky is the light teal screen; moon and stars in paper
mx, my, mr = 360, 66, 30
d.ellipse([P(mx - mr, my - mr), P(mx + mr, my + mr)], fill=PAPER)
for _ in range(38):
    x, y = random.uniform(8, CW - 8), random.uniform(8, 120)
    if math.hypot(x - mx, y - my) < mr + 12: continue
    r = random.choice((0.9, 1.1, 1.4))
    d.ellipse([P(x - r, y - r), P(x + r, y + r)], fill=PAPER)
# far hills with city lights, full teal
hill = [(0, 150)]
for i in range(0, CW + 20, 20):
    hill.append((i, 140 - 14 * math.sin(i / 70) - 6 * math.sin(i / 23)))
hill += [(CW, 190), (0, 190)]
poly(hill, TEAL)
for _ in range(70):
    x = random.uniform(4, CW - 4); y = random.uniform(150, 176)
    rect(x, y, x + 1.6, y + 1.6, PAPER if random.random() < 0.8 else RED)
# water, deep teal
rect(0, 182, CW, CH, TEAL_D)
# reflected moon streaks
for i in range(9):
    y = 250 + i * 5.5; w = 26 - i * 1.6
    rect(mx - w, y, mx + w, y + 1.5, PAPER)

# houseboats: (left x, width, wall height, roof style)
boats = [(14, 96, 46, 'gable'), (122, 112, 56, 'flat'), (246, 92, 50, 'gable'), (350, 92, 42, 'shed')]
base = 236
for (x, w, h, roof) in boats:
    top = base - h
    # float (hull) and pilings in red
    rect(x - 4, base, x + w + 4, base + 9, RED)
    # wall in paper
    rect(x, top, x + w, base, PAPER)
    # siding lines in light teal
    for yy in range(int(top) + 7, base, 7):
        rect(x, yy, x + w, yy + 0.8, TEAL_T)
    if roof == 'gable':
        poly([(x - 8, top + 1), (x + w / 2, top - 30), (x + w + 8, top + 1)], RED)
    elif roof == 'flat':
        rect(x - 6, top - 7, x + w + 6, top + 1, RED)
        # upper deck rail
        rect(x + 8, top - 24, x + w - 20, top - 22, PAPER)
        for px in range(x + 8, x + w - 18, 9): rect(px, top - 24, px + 1.4, top - 7, PAPER)
    else:
        poly([(x - 6, top - 16), (x + w + 6, top + 1), (x - 6, top + 1)], RED)
    # windows: some lit (red ink), some dark (deep teal)
    n = max(2, int((w - 26) // 30))
    gap = (w - 26) / n
    for k in range(n):
        wx = x + gap * k + gap / 2 - 9
        lit = (x, k) in [(122, 1), (14, 0), (350, 1), (246, 1)]
        rect(wx, top + 12, wx + 18, top + 30, RED if lit else TEAL_D)
        rect(wx + 8.4, top + 12, wx + 9.6, top + 30, PAPER)
    # door on the boardwalk side
    rect(x + w - 22, base - 26, x + w - 10, base, TEAL)
    # reflection of lit windows in the water, broken into dashes
    for k in range(n):
        if (x, k) in [(122, 1), (14, 0), (350, 1), (246, 1)]:
            wx = x + gap * k + gap / 2 - 9
            for j in range(4):
                yy = base + 16 + j * 8
                rect(wx + j % 2 * 3, yy, wx + 14 - j * 2, yy + 1.6, RED)
# the dock walkway runs behind the row, seen in the gaps between homes
for gx in (110, 234, 338):
    rect(gx, base - 6, gx + 12, base, PAPER)
    rect(gx + 2, base - 22, gx + 3.2, base - 6, PAPER)
# ripple lines on the water
for _ in range(26):
    x = random.uniform(0, CW - 30); y = random.uniform(266, CH - 6); w = random.uniform(10, 34)
    rect(x, y, x + w, y + 1.2, TEAL_T)

im = im.resize((CW * 2, CH * 2), Image.LANCZOS)
im.save(os.path.join(A, 'dock-art.png'))

# ---- wear layer for the whole placemat, 1344 x 960 css px, painted at 1x (soft, low detail)
PW, PH = 1344, 960
wear = Image.new('RGBA', (PW, PH), (0, 0, 0, 0))
# big soft mottling
mott = Image.new('L', (PW // 32, PH // 32))
mott.putdata([random.randint(0, 255) for _ in range((PW // 32) * (PH // 32))])
mott = mott.resize((PW, PH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
tone = Image.new('RGBA', (PW, PH), (150, 128, 90, 0))
tone.putalpha(mott.point(lambda v: int(v * 0.06)))
wear = Image.alpha_composite(wear, tone)
# edge wear: warm darkening toward the edges
edge = Image.new('L', (PW, PH), 0)
ed = ImageDraw.Draw(edge)
for i in range(26):
    ed.rectangle([i, i, PW - 1 - i, PH - 1 - i], outline=int(64 * (1 - i / 26) ** 2))
edge = edge.filter(ImageFilter.GaussianBlur(6))
et = Image.new('RGBA', (PW, PH), (128, 100, 62, 0)); et.putalpha(edge)
wear = Image.alpha_composite(wear, et)
# coffee ring, lower right of the art, under where a mug sat
def ring(cx, cy, r, a):
    m = Image.new('L', (PW, PH), 0); md = ImageDraw.Draw(m)
    md.ellipse([cx - r, cy - r, cx + r, cy + r], outline=a, width=5)
    md.arc([cx - r - 3, cy - r - 2, cx + r + 2, cy + r + 3], 200, 330, fill=int(a * 0.7), width=5)
    m = m.filter(ImageFilter.GaussianBlur(2.2))
    inner = Image.new('L', (PW, PH), 0); idr = ImageDraw.Draw(inner)
    idr.ellipse([cx - r + 6, cy - r + 6, cx + r - 6, cy + r - 6], fill=int(a * 0.12))
    inner = inner.filter(ImageFilter.GaussianBlur(14))
    from PIL import ImageChops
    m = ImageChops.add(m, inner)
    c = Image.new('RGBA', (PW, PH), (122, 80, 40, 0)); c.putalpha(m)
    return c
wear = Image.alpha_composite(wear, ring(820, 806, 62, 50))
# grease sheen: a faint translucent smear, slightly lighter and cooler
sheen = Image.new('L', (PW, PH), 0); sd = ImageDraw.Draw(sheen)
sd.ellipse([300, 720, 520, 860], fill=40)
sheen = sheen.filter(ImageFilter.GaussianBlur(40))
sh = Image.new('RGBA', (PW, PH), (255, 252, 240, 0)); sh.putalpha(sheen)
wear = Image.alpha_composite(wear, sh)
wear.save(os.path.join(A, 'wear-stain.png'))
print('painted')
