"""Paints the signature piece: the loft building front at night, Moonlight Coffee Shop on the ground floor,
the bassinet on the doorstep under the door lamp. Output assets/loft-night.png at 2x (1632x840)."""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
random.seed(1987)
W, H = 1632, 840
GROUND = 712            # sidewalk top line
BX0, BX1 = 640, 1560    # main building
TOP = 230               # building roofline (below conservatory)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(len(a)))


def layer():
    return Image.new('RGBA', (W, H), (0, 0, 0, 0))


def glow(img, xy, r, col, a=200, blur=None):
    g = layer(); d = ImageDraw.Draw(g)
    x, y = xy
    d.ellipse((x - r, y - r, x + r, y + r), fill=col + (a,))
    g = g.filter(ImageFilter.GaussianBlur(blur or r * 0.55))
    img.alpha_composite(g)


img = Image.new('RGBA', (W, H))
# sky
sky = ImageDraw.Draw(img)
for y in range(H):
    t = min(1, y / GROUND)
    sky.line([(0, y), (W, y)], fill=lerp((12, 20, 52), (52, 62, 108), t ** 1.4) + (255,))
# stars
d = ImageDraw.Draw(img)
for _ in range(90):
    x, y = random.randrange(W), random.randrange(10, 330)
    r = random.choice((1, 1, 1, 2))
    d.ellipse((x - r, y - r, x + r, y + r), fill=(240, 232, 205, random.randrange(90, 200)))
# moon, crescent, top right of the sky clear of the header
mx, my, mr = 1572, 92, 34
glow(img, (mx, my), 120, (250, 236, 200), 70, 60)
m = layer(); md = ImageDraw.Draw(m)
md.ellipse((mx - mr, my - mr, mx + mr, my + mr), fill=(250, 240, 212, 255))
md.ellipse((mx - mr + 24, my - mr - 10, mx + mr + 24, my + mr - 10), fill=(0, 0, 0, 0))
cut = Image.new('L', (W, H), 0); ImageDraw.Draw(cut).ellipse((mx - mr + 24, my - mr - 10, mx + mr + 24, my + mr - 10), fill=255)
m.putalpha(ImageChops.subtract(m.getchannel('A'), cut))
img.alpha_composite(m)

# neighbouring buildings, flat dark with a few lit windows
d = ImageDraw.Draw(img)
for x0, x1, top, col in ((0, 250, 400, (26, 30, 58)), (230, 470, 352, (33, 37, 68)), (450, 660, 420, (28, 32, 62)),
                         (1540, 1632, 330, (30, 34, 64))):
    d.rectangle((x0, top, x1, GROUND), fill=col + (255,))
    d.rectangle((x0, top - 10, x1, top), fill=lerp(col, (0, 0, 0), 0.3) + (255,))
    for wy in range(top + 40, GROUND - 120, 86):
        for wx in range(x0 + 24, x1 - 40, 62):
            lit = random.random() < 0.22
            c = (236, 186, 108) if lit else lerp(col, (70, 82, 128), 0.35)
            d.rectangle((wx, wy, wx + 30, wy + 50), fill=c + (255,))
            if lit:
                glow(img, (wx + 15, wy + 25), 34, (236, 180, 100), 60, 18)
d = ImageDraw.Draw(img)

# main building: cast-iron loft facade
FAC = (92, 62, 58)
d.rectangle((BX0, TOP, BX1, GROUND), fill=FAC + (255,))
# brick courses
for y in range(TOP, GROUND - 180, 14):
    off = 0 if (y // 14) % 2 else 22
    for x in range(BX0 - off, BX1, 44):
        tone = random.uniform(-12, 12)
        c = tuple(max(0, min(255, int(v + tone))) for v in FAC)
        d.rectangle((max(BX0, x + 1), y + 1, min(BX1, x + 42), y + 12), fill=c + (255,))
    d.line([(BX0, y), (BX1, y)], fill=(58, 40, 40, 255), width=2)
# night wash over the brick so it reads as moonlit, not daylight
wash = layer(); ImageDraw.Draw(wash).rectangle((BX0, TOP, BX1, GROUND), fill=(30, 38, 84, 120))
img.alpha_composite(wash)
d = ImageDraw.Draw(img)
# cornice
CI = (44, 50, 80)
d.rectangle((BX0 - 18, TOP - 26, BX1 + 18, TOP + 6), fill=CI + (255,))
for x in range(BX0 - 10, BX1 + 10, 26):
    d.rectangle((x, TOP + 6, x + 12, TOP + 22), fill=CI + (255,))
d.line([(BX0 - 18, TOP - 26), (BX1 + 18, TOP - 26)], fill=(120, 130, 170, 255), width=3)

# conservatory on the roof, lit warm, the loft upstairs
cx0, cx1, cy1 = BX0 + 120, BX1 - 120, TOP - 26
cy0 = 120
glow(img, ((cx0 + cx1) // 2, cy1 - 40), 300, (240, 190, 110), 70, 90)
d = ImageDraw.Draw(img)
d.rectangle((cx0, cy0 + 40, cx1, cy1), fill=(214, 160, 88, 255))
d.pieslice((cx0, cy0, cx1, cy0 + 90), 180, 360, fill=(222, 172, 98, 255))
for x in range(cx0, cx1 + 1, 40):
    d.line([(x, cy0 + 44), (x, cy1)], fill=(40, 40, 64, 255), width=4)
d.line([(cx0, cy0 + 44), (cx1, cy0 + 44)], fill=(40, 40, 64, 255), width=5)
d.line([(cx0, (cy0 + cy1) // 2 + 20), (cx1, (cy0 + cy1) // 2 + 20)], fill=(40, 40, 64, 255), width=3)
d.arc((cx0, cy0, cx1, cy0 + 90), 180, 360, fill=(40, 40, 64, 255), width=5)
for i in range(1, 12):
    a = math.pi + math.pi * i / 12
    rx, ry = (cx1 - cx0) / 2, 45
    ox, oy = (cx0 + cx1) / 2, cy0 + 45
    d.line([(ox, oy), (ox + rx * math.cos(a), oy + ry * math.sin(a))], fill=(40, 40, 64, 255), width=3)
# plants silhouetted in the glass
for x in range(cx0 + 20, cx1 - 20, 54):
    h = random.randint(30, 70)
    for k in range(7):
        ang = -math.pi / 2 + random.uniform(-0.9, 0.9)
        d.line([(x, cy1 - 4), (x + math.cos(ang) * h, cy1 - 4 + math.sin(ang) * h)], fill=(52, 70, 50, 255), width=5)

# upper floors: tall sash windows between cast-iron pilasters
bays = 6
bw = (BX1 - BX0) / bays
for row, wy in enumerate((TOP + 40, TOP + 190)):
    for b in range(bays):
        x = int(BX0 + b * bw + 26); x2 = int(BX0 + (b + 1) * bw - 26)
        lit = (row, b) in ((0, 1), (0, 4), (1, 2), (1, 5))
        glass = (238, 192, 118) if lit else (46, 58, 104)
        d.rectangle((x - 6, wy - 6, x2 + 6, wy + 118), fill=(52, 54, 82, 255))
        d.rectangle((x, wy, x2, wy + 112), fill=glass + (255,))
        if not lit:  # moon sheen
            d.polygon([(x, wy + 70), (x + 30, wy), (x + 52, wy), (x, wy + 104)], fill=(78, 92, 146, 255))
        d.line([(x, wy + 56), (x2, wy + 56)], fill=(36, 38, 62, 255), width=5)
        d.line([((x + x2) // 2, wy), ((x + x2) // 2, wy + 112)], fill=(36, 38, 62, 255), width=3)
        d.rectangle((x - 12, wy + 118, x2 + 12, wy + 128), fill=(120, 126, 160, 255))  # sill
        d.rectangle((x - 10, wy - 18, x2 + 10, wy - 6), fill=(70, 74, 108, 255))       # lintel
        if lit:
            glow(img, ((x + x2) // 2, wy + 56), 90, (240, 186, 104), 70, 40)
            d = ImageDraw.Draw(img)
for b in range(bays + 1):
    x = int(BX0 + b * bw)
    d.rectangle((x - 9, TOP + 6, x + 9, GROUND - 180), fill=(62, 64, 96, 255))
    d.line([(x - 9, TOP + 6), (x - 9, GROUND - 180)], fill=(98, 104, 146, 255), width=2)

# ground floor
GF = GROUND - 180
d.rectangle((BX0, GF, BX1, GROUND), fill=(40, 42, 70, 255))
d.rectangle((BX0, GF - 12, BX1, GF + 4), fill=(70, 74, 108, 255))
# coffee shop storefront on the left four bays, warmly lit, with a rose striped awning
sx0, sx1 = BX0 + 30, BX0 + 600
glow(img, ((sx0 + sx1) // 2, GF + 90), 300, (246, 196, 120), 110, 70)
d = ImageDraw.Draw(img)
d.rectangle((sx0, GF + 40, sx1, GROUND - 14), fill=(244, 206, 140, 255))
# counter, stools, coffee urn silhouettes inside
d.rectangle((sx0, GROUND - 70, sx1, GROUND - 14), fill=(130, 70, 70, 255))
for x in range(sx0 + 40, sx1 - 20, 70):
    d.rectangle((x, GROUND - 92, x + 26, GROUND - 82), fill=(60, 40, 50, 255))
    d.rectangle((x + 10, GROUND - 82, x + 16, GROUND - 70), fill=(60, 40, 50, 255))
d.rounded_rectangle((sx1 - 120, GF + 70, sx1 - 70, GF + 130), 8, fill=(170, 170, 180, 255))
d.ellipse((sx0 + 30, GF + 70, sx0 + 64, GF + 104), fill=(250, 236, 200, 255))  # wall clock
d.line([(sx0 + 47, GF + 87), (sx0 + 47, GF + 76)], fill=(60, 40, 50, 255), width=3)
d.line([(sx0 + 47, GF + 87), (sx0 + 57, GF + 87)], fill=(60, 40, 50, 255), width=3)
for x in range(sx0 + 142, sx1, 142):
    d.line([(x, GF + 40), (x, GROUND - 14)], fill=(52, 44, 64, 255), width=6)
# neon script in the window
from PIL import ImageFont
f = ImageFont.truetype(os.path.join(D, 'fonts', 'Righteous-Regular.ttf'), 44)
neon = layer(); nd = ImageDraw.Draw(neon)
nd.text(((sx0 + sx1) // 2, GF + 100), 'Moonlight', font=f, anchor='mm', fill=(255, 90, 140, 255))
img.alpha_composite(neon.filter(ImageFilter.GaussianBlur(9)))
img.alpha_composite(neon)
nd2 = layer(); ImageDraw.Draw(nd2).text(((sx0 + sx1) // 2, GF + 100), 'Moonlight', font=f, anchor='mm', fill=(255, 214, 228, 180))
img.alpha_composite(nd2.filter(ImageFilter.GaussianBlur(1)))
f2 = ImageFont.truetype(os.path.join(D, 'fonts', 'Righteous-Regular.ttf'), 22)
d = ImageDraw.Draw(img)
d.text(((sx0 + sx1) // 2, GF + 136), 'OPEN ALL NIGHT', font=f2, anchor='mm', fill=(90, 150, 220, 255))
# awning
aw0, aw1 = sx0 - 14, sx1 + 14
stripes = 14
for i in range(stripes):
    x = aw0 + (aw1 - aw0) * i / stripes; x2 = aw0 + (aw1 - aw0) * (i + 1) / stripes
    c = (206, 79, 114) if i % 2 == 0 else (246, 237, 207)
    d.polygon([(x, GF - 8), (x2, GF - 8), (x2 + 8, GF + 40), (x + 8, GF + 40)], fill=c + (255,))
    d.pieslice((x + 8, GF + 26, x2 + 8, GF + 56), 0, 180, fill=c + (255,))
shade = layer(); ImageDraw.Draw(shade).rectangle((aw0, GF - 8, aw1 + 10, GF + 56), fill=(20, 24, 60, 70))
img.alpha_composite(shade); d = ImageDraw.Draw(img)

# loft entrance: door, transom, lamp, stoop on the right
dx0, dx1 = BX1 - 300, BX1 - 150
d.rectangle((dx0 - 24, GF + 10, dx1 + 24, GROUND - 40), fill=(70, 74, 108, 255))
d.rectangle((dx0, GF + 30, dx1, GROUND - 40), fill=(34, 30, 48, 255))
d.rectangle((dx0, GF + 30, dx1, GF + 62), fill=(238, 196, 120, 255))       # lit transom
d.line([(dx0, GF + 62), (dx1, GF + 62)], fill=(60, 60, 90, 255), width=5)
d.line([((dx0 + dx1) // 2, GF + 62), ((dx0 + dx1) // 2, GROUND - 40)], fill=(60, 60, 90, 255), width=4)
for px in (dx0 + 12, (dx0 + dx1) // 2 + 10):
    d.rectangle((px, GF + 76, px + 52, GROUND - 60), outline=(70, 66, 96, 255), width=3)
d.ellipse(((dx0 + dx1) // 2 - 22, GF + 120, (dx0 + dx1) // 2 - 12, GF + 130), fill=(200, 176, 110, 255))  # knob
# door lamp and its pool of light
lx, ly = dx1 + 40, GF + 40
glow(img, (lx, ly + 70), 220, (250, 210, 140), 95, 80)
d = ImageDraw.Draw(img)
d.rectangle((lx - 3, ly - 30, lx + 3, ly - 10), fill=(30, 30, 40, 255))
d.polygon([(lx - 16, ly - 10), (lx + 16, ly - 10), (lx + 12, ly + 24), (lx - 12, ly + 24)], fill=(252, 226, 160, 255))
d.rectangle((lx - 18, ly - 14, lx + 18, ly - 8), fill=(30, 30, 40, 255))
glow(img, (lx, ly + 6), 40, (255, 240, 190), 170, 14)
d = ImageDraw.Draw(img)
# stoop, three steps
for i, (y0, ext) in enumerate(((GROUND - 40, 34), (GROUND - 26, 52), (GROUND - 13, 70))):
    d.rectangle((dx0 - ext, y0, dx1 + ext, y0 + 14), fill=lerp((132, 136, 168), (96, 100, 136), i / 2) + (255,))
    d.line([(dx0 - ext, y0), (dx1 + ext, y0)], fill=(176, 178, 204, 255), width=2)

# the bassinet on the top step, wicker with a pink blanket and ruffle
bx, by = 200, 200
BAS = Image.new('RGBA', (400, 260), (0, 0, 0, 0)); _img = img; img = BAS
d = ImageDraw.Draw(BAS)
d.ellipse((bx - 64, by - 6, bx + 64, by + 6), fill=(20, 20, 30, 120))   # shadow
d.polygon([(bx - 60, by - 52), (bx + 60, by - 52), (bx + 48, by), (bx - 48, by)], fill=(206, 168, 104, 255))
for k in range(1, 8):  # weave
    y = by - 52 + k * 6.5
    d.line([(bx - 60 + k * 1.6, y), (bx + 60 - k * 1.6, y)], fill=(160, 120, 70, 255), width=2)
for k in range(-5, 6):
    d.line([(bx + k * 10, by - 52), (bx + k * 8, by)], fill=(176, 136, 82, 255), width=2)
d.arc((bx - 50, by - 112, bx + 50, by - 22), 200, 340, fill=(190, 150, 92, 255), width=7)  # handle
d.ellipse((bx - 66, by - 66, bx + 66, by - 42), fill=(244, 188, 204, 255))                  # blanket
for k in range(-6, 7):  # ruffle
    d.ellipse((bx + k * 10 - 7, by - 58, bx + k * 10 + 7, by - 46), fill=(252, 226, 232, 255))
d.ellipse((bx - 18, by - 74, bx + 16, by - 54), fill=(252, 236, 238, 255))                  # bonnet
d.ellipse((bx - 9, by - 70, bx + 7, by - 58), fill=(246, 206, 186, 255))                    # face
# note tucked in the blanket
d.polygon([(bx + 22, by - 70), (bx + 46, by - 74), (bx + 48, by - 58), (bx + 24, by - 54)], fill=(250, 248, 236, 255))
d.line([(bx + 27, by - 66), (bx + 42, by - 68)], fill=(120, 120, 150, 255), width=1)
d.line([(bx + 27, by - 61), (bx + 40, by - 63)], fill=(120, 120, 150, 255), width=1)

img = _img
glow(img, ((dx0 + dx1) // 2, GROUND - 52), 60, (255, 214, 220), 80, 22)
small = BAS.resize((240, 156), Image.LANCZOS)
img.alpha_composite(small, ((dx0 + dx1) // 2 - 120, GROUND - 40 - 120))
d = ImageDraw.Draw(img)
# sidewalk and street
d.rectangle((0, GROUND, W, H), fill=(58, 64, 98, 255))
d.rectangle((0, GROUND, W, GROUND + 4), fill=(110, 116, 150, 255))
for x in range(-40, W, 150):
    d.line([(x, GROUND + 4), (x - 40, H - 40)], fill=(48, 54, 86, 255), width=2)
d.rectangle((0, H - 40, W, H - 32), fill=(130, 134, 160, 255))   # curb
d.rectangle((0, H - 32, W, H), fill=(30, 34, 58, 255))           # street
# warm reflections on the pavement
refl = layer(); rd = ImageDraw.Draw(refl)
rd.rectangle((sx0, GROUND + 6, sx1, GROUND + 90), fill=(246, 196, 120, 70))
rd.ellipse((dx0 - 90, GROUND, dx1 + 120, GROUND + 80), fill=(250, 210, 140, 60))
img.alpha_composite(refl.filter(ImageFilter.GaussianBlur(22)))
d = ImageDraw.Draw(img)

# street lamp at left
px = 560
glow(img, (px, 470), 200, (250, 214, 150), 60, 90)
d = ImageDraw.Draw(img)
d.rectangle((px - 6, 470, px + 6, GROUND + 50), fill=(24, 26, 40, 255))
d.rectangle((px - 14, GROUND + 30, px + 14, GROUND + 52), fill=(24, 26, 40, 255))
d.arc((px - 2, 432, px + 60, 494), 180, 270, fill=(24, 26, 40, 255), width=6)
d.polygon([(px + 40, 444), (px + 74, 444), (px + 66, 466), (px + 48, 466)], fill=(24, 26, 40, 255))
glow(img, (px + 57, 470), 26, (255, 236, 180), 220, 10)
cone = layer(); ImageDraw.Draw(cone).polygon([(px + 48, 466), (px + 66, 466), (px + 170, GROUND + 60), (px - 60, GROUND + 60)], fill=(250, 220, 160, 40))
img.alpha_composite(cone.filter(ImageFilter.GaussianBlur(18)))

# engraved finish: fine diagonal hatching on the shadows, then soft grain
hat = layer(); hd = ImageDraw.Draw(hat)
for x in range(-H, W, 7):
    hd.line([(x, 0), (x + H, H)], fill=(8, 10, 30, 46), width=1)
lum = img.convert('L').point(lambda v: 255 if v < 70 else (150 if v < 120 else 0))
hat.putalpha(ImageChops.multiply(hat.getchannel('A'), lum))
img.alpha_composite(hat)
noise = Image.effect_noise((W // 4, H // 4), 40).resize((W, H), Image.BICUBIC)
grain = Image.merge('RGBA', (noise, noise, noise, noise.point(lambda v: int(abs(v - 128) * 0.18))))
img.alpha_composite(grain)
img = img.filter(ImageFilter.UnsharpMask(2, 40, 2))
img.convert('RGB').save(os.path.join(D, 'assets', 'loft-night.png'), optimize=True)
print('painted')
