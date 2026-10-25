"""Paints the art and soft textures for the Departure Lounge table card (PIL only).
assets/runway-dusk.png  the dusk sky, climbing jet and approach lights at the top of the front
assets/wear-front.png, assets/wear-back.png  soft edge wear and big gentle mottling
assets/stain-ring.png   a faint ring left by a cold glass, for the back"""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
random.seed(1990)
S = 3                                   # paint at 3x the CSS size
W, H = 408, 1056

def lerp(a, b, t): return tuple(round(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))

# ---------- dusk over the runway ----------
AW, AH = 408 * S, 268 * S
sky = Image.new('RGB', (AW, AH))
stops = [(0.0, (22, 34, 66)), (0.42, (52, 62, 104)), (0.70, (176, 96, 88)), (0.86, (236, 150, 82)), (1.0, (246, 196, 120))]
px = sky.load()
for y in range(AH):
    t = y / (AH * 0.78)
    t = min(t, 1)
    for i in range(len(stops) - 1):
        if stops[i][0] <= t <= stops[i + 1][0]:
            c = lerp(stops[i][1], stops[i + 1][1], (t - stops[i][0]) / (stops[i + 1][0] - stops[i][0])); break
    for x in range(AW): px[x, y] = c
d = ImageDraw.Draw(sky, 'RGBA')
# a few early stars high up
for _ in range(40):
    x, y = random.randrange(AW), random.randrange(int(AH * 0.32))
    r = random.choice((1, 1, 2)); d.ellipse((x - r, y - r, x + r, y + r), fill=(255, 246, 220, random.randrange(90, 190)))
# soft low cloud bands
cl = Image.new('RGBA', (AW, AH), (0, 0, 0, 0)); cd = ImageDraw.Draw(cl)
for yy, a in ((0.52, 70), (0.60, 55), (0.66, 45)):
    for _ in range(9):
        cx = random.randrange(-100, AW + 100); w = random.randrange(240, 620); h = random.randrange(18, 34)
        cd.ellipse((cx - w // 2, int(AH * yy) - h // 2, cx + w // 2, int(AH * yy) + h // 2), fill=(250, 200, 170, a))
sky.paste(cl.filter(ImageFilter.GaussianBlur(14)), (0, 0), cl.filter(ImageFilter.GaussianBlur(14)))
d = ImageDraw.Draw(sky, 'RGBA')
# far shoreline and the field, dark
hz = int(AH * 0.80)
d.rectangle((0, hz, AW, AH), fill=(24, 28, 44))
# low far shore: hangars and flat-roofed terminal blocks, no hills
x = 0
while x < AW:
    w = random.randrange(30, 120); h = random.choice((8, 12, 18, 26, 34))
    if random.random() < 0.25:                      # a curved hangar roof
        d.chord((x, hz - min(h, 18), x + w, hz + min(h, 18)), 180, 360, fill=(34, 36, 58))
    else:
        d.rectangle((x, hz - h, x + w, hz), fill=(34, 36, 58))
        for k in range(x + 6, x + w - 4, 14):
            if random.random() < 0.35: d.rectangle((k, hz - h + 5, k + 3, hz - h + 8), fill=(250, 210, 140, 200))
    x += w + random.randrange(0, 30)
# control tower, simple shape left of centre
tx = int(AW * 0.18)
d.rectangle((tx - 9, hz - 120, tx + 9, hz), fill=(30, 32, 52))
d.polygon([(tx - 34, hz - 150), (tx + 34, hz - 150), (tx + 26, hz - 120), (tx - 26, hz - 120)], fill=(30, 32, 52))
d.rectangle((tx - 30, hz - 148, tx + 30, hz - 132), fill=(244, 196, 120))
for k in range(-24, 30, 12): d.rectangle((tx + k, hz - 148, tx + k + 2, hz - 132), fill=(30, 32, 52))
d.rectangle((tx - 36, hz - 158, tx + 36, hz - 150), fill=(30, 32, 52))
d.rectangle((tx - 1, hz - 178, tx + 1, hz - 158), fill=(30, 32, 52))
d.ellipse((tx - 4, hz - 184, tx + 4, hz - 176), fill=(230, 60, 50))
# runway in perspective with edge and approach lights
vx, vy = int(AW * 0.62), hz + 2
for side in (-1, 1):
    for i in range(1, 15):
        t = (i / 14) ** 1.7
        yy = vy + (AH - vy) * t; xx = vx + side * (14 + 330 * t)
        r = 1.2 + 4.2 * t
        d.ellipse((xx - r * 1.6, yy - r, xx + r * 1.6, yy + r), fill=(255, 226, 150, 235))
for i in range(1, 12):     # centreline approach bars
    t = (i / 11) ** 1.7; yy = vy + (AH - vy) * t; w = 3 + 30 * t; h = 1 + 4 * t
    d.rectangle((vx - w, yy - h, vx + w, yy + h), fill=(255, 250, 230, 200))
# a glow under the lights
gl = Image.new('RGBA', (AW, AH), (0, 0, 0, 0)); gd = ImageDraw.Draw(gl)
gd.polygon([(vx - 20, vy), (vx + 20, vy), (vx + 380, AH), (vx - 380, AH)], fill=(255, 190, 110, 40))
gl = gl.filter(ImageFilter.GaussianBlur(30)); sky.paste(gl, (0, 0), gl)
d = ImageDraw.Draw(sky, 'RGBA')

# the jet climbing out, seen from below and behind, plain silhouette
jet = Image.new('RGBA', (900, 900), (0, 0, 0, 0)); jd = ImageDraw.Draw(jet)
c = (26, 30, 52, 255)
jd.polygon([(450, 90), (468, 130), (472, 600), (462, 780), (438, 780), (428, 600), (432, 130)], fill=c)       # fuselage
jd.polygon([(452, 360), (830, 560), (830, 590), (476, 500), (424, 500), (70, 590), (70, 560), (448, 360)], fill=c)  # wings
jd.polygon([(452, 700), (580, 770), (580, 786), (452, 750), (448, 750), (320, 786), (320, 770), (448, 700)], fill=c) # tailplane
for ex in (300, 600):
    jd.rounded_rectangle((ex - 16, 440, ex + 16, 520), 10, fill=c)                                       # engines
jd.ellipse((60, 556, 76, 572), fill=(235, 70, 60, 255)); jd.ellipse((824, 556, 840, 572), fill=(90, 220, 140, 255))
jd.ellipse((443, 784, 457, 798), fill=(255, 250, 235, 255))
jet = jet.rotate(-28, resample=Image.BICUBIC, expand=True)
js = 0.42; jet = jet.resize((int(jet.width * js), int(jet.height * js)), Image.LANCZOS)
sky.paste(jet, (int(AW * 0.60), int(AH * 0.06)), jet)
# a soft halo for the landing light
hl = Image.new('RGBA', (AW, AH), (0, 0, 0, 0)); hd = ImageDraw.Draw(hl)
sky = sky.convert('RGBA')
# printed in two passes: a touch of halftone softness
sky = sky.filter(ImageFilter.GaussianBlur(0.6))
sky.convert('RGB').save(os.path.join(A, 'runway-dusk.png'))

# ---------- soft wear: big gentle mottling and edge wear ----------
def wear(name, seed, warm):
    random.seed(seed)
    w, h = W * 2, H * 2
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    for _ in range(26):                                   # big soft blotches
        x, y = random.randrange(w), random.randrange(h); r = random.randrange(90, 260)
        dr.ellipse((x - r, y - r, x + r, y + r), fill=warm + (random.randrange(6, 14),))
    im = im.filter(ImageFilter.GaussianBlur(70))
    edge = Image.new('L', (w, h), 0); ed = ImageDraw.Draw(edge)
    for i in range(36):                                   # darker toward the trim
        a = int(56 * (1 - i / 36) ** 2.2)
        ed.rectangle((i, i, w - 1 - i, h - 1 - i), outline=a)
    for _ in range(14):                                   # scuffed corners and edges
        side = random.choice('tblr'); p = random.randrange(0, w if side in 'tb' else h); r = random.randrange(10, 34)
        x, y = {'t': (p, 0), 'b': (p, h), 'l': (0, p), 'r': (w, p)}[side]
        ed.ellipse((x - r, y - r, x + r, y + r), fill=random.randrange(40, 80))
    for (x, y) in ((0, 0), (w, 0), (0, h), (w, h)):
        ed.ellipse((x - 40, y - 40, x + 40, y + 40), fill=80)
    edge = edge.filter(ImageFilter.GaussianBlur(9))
    ec = Image.new('RGBA', (w, h), (96, 74, 46, 255)); ec.putalpha(edge)
    im = Image.alpha_composite(im, ec)
    im.save(os.path.join(A, name))
wear('wear-front.png', 7, (150, 120, 80))
wear('wear-back.png', 11, (140, 112, 76))

# ---------- the ring a cold glass leaves ----------
R = 330
ring = Image.new('L', (R * 2, R * 2), 0); rd = ImageDraw.Draw(ring)
rd.ellipse((40, 40, 2 * R - 40, 2 * R - 40), outline=150, width=10)
rd.ellipse((52, 52, 2 * R - 52, 2 * R - 52), outline=60, width=6)
# a gap where the glass was lifted off at an angle
rd.pieslice((0, 0, 2 * R, 2 * R), 200, 238, fill=0)
rd.ellipse((90, 90, 2 * R - 90, 2 * R - 90), fill=12)
ring = ring.filter(ImageFilter.GaussianBlur(5))
rc = Image.new('RGBA', (R * 2, R * 2), (128, 100, 62, 255)); rc.putalpha(ring.point(lambda v: int(v * 0.42)))
rc.save(os.path.join(A, 'stain-ring.png'))
print('painted')
