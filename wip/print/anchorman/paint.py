"""Paints the signature piece: the 70s Channel 4 news set, full front face (816x1056 at 2x).
Burgundy header valance with 70s stripes, pale blue Channel 4 wallpaper of circle-4 badges, a row of five
world clocks, the big monitor bezel (the news team still is set into it by build.py), the walnut anchor desk
with a burgundy front panel, and studio carpet below. No people are drawn."""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
S = 2
W, H = 816 * S, 1056 * S
RAM = os.path.join(D, 'src', 'RammettoOne-Regular.ttf')
rnd = random.Random(1975)

BURG = (122, 30, 44); BURG_D = (74, 16, 26); GOLD = (216, 160, 50); AVO = (111, 122, 43)
SKY = (176, 205, 232); SKY_L = (204, 224, 243); BADGE = (150, 186, 222)

def s(v): return int(round(v * S))

def vgrad(w, h, top, bot):
    g = Image.new('RGB', (1, h))
    for y in range(h):
        t = y / max(1, h - 1)
        g.putpixel((0, y), tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)))
    return g.resize((w, h))

def noise(w, h, seed, cell=6, amp=10, blur=2):
    r = random.Random(seed)
    m = Image.new('L', (w // cell + 1, h // cell + 1))
    m.putdata([128 + r.randint(-amp, amp) for _ in range(m.width * m.height)])
    return m.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))

def shade(img, lum):
    """Multiply-ish light: lum is L image, 128 = no change."""
    lo = lum.point(lambda v: max(0, min(255, 255 - (128 - v) * 2)) if v < 128 else 255)
    hi = lum.point(lambda v: max(0, (v - 128) * 2) if v > 128 else 0)
    out = ImageChops.multiply(img, Image.merge('RGB', (lo, lo, lo)))
    return ImageChops.screen(out, Image.merge('RGB', (hi, hi, hi)))

img = Image.new('RGB', (W, H), SKY)

# ---------- wallpaper: pale blue with diagonal circle-4 badges ----------
WALL_T, WALL_B = s(96), s(640)
wall = vgrad(W, WALL_B - WALL_T, SKY_L, SKY)
def badge(r):
    b = Image.new('RGBA', (2 * r + 8, 2 * r + 8), (0, 0, 0, 0)); d = ImageDraw.Draw(b)
    c = r + 4
    d.ellipse([c - r, c - r, c + r, c + r], outline=BADGE + (255,), width=max(3, r // 9))
    d.ellipse([c - r * 0.56, c - r * 0.56, c + r * 0.56, c + r * 0.56], fill=BADGE + (255,))
    f4 = ImageFont.truetype(RAM, int(r * 0.8))
    d.text((c, c + r * 0.03), '4', font=f4, fill=SKY_L + (255,), anchor='mm')
    ft = ImageFont.truetype(RAM, int(r * 0.2))
    def arc(text, mid, rad, top=True):
        n = len(text); step = 15
        for i, ch in enumerate(text):
            a = mid + (i - (n - 1) / 2) * step * (1 if top else -1)
            x = c + rad * math.sin(math.radians(a)); y = c - rad * math.cos(math.radians(a))
            t = Image.new('RGBA', (int(r * 0.4), int(r * 0.4)), (0, 0, 0, 0))
            ImageDraw.Draw(t).text((t.width / 2, t.height / 2), ch, font=ft, fill=BADGE + (255,), anchor='mm')
            t = t.rotate(-a if top else 180 - a, resample=Image.BICUBIC)
            b.alpha_composite(t, (int(x - t.width / 2), int(y - t.height / 2)))
    arc('CHANNEL', 0, r * 0.76, True)
    arc('NEWS TEAM', 180, r * 0.76, False)
    return b
bd = badge(s(46)).rotate(18, resample=Image.BICUBIC, expand=True)
wl = wall.convert('RGBA')
step_x, step_y = s(150), s(118)
for j, y in enumerate(range(-s(60), wall.height + s(60), step_y)):
    for x in range(-s(80) + (j % 2) * step_x // 2, W + s(80), step_x):
        wl.paste(bd, (x, y), bd)
wall = wl.convert('RGB')
# studio light: bright pool in the middle, falling off at the sides and top
lum = Image.new('L', wall.size, 0); ld = ImageDraw.Draw(lum)
ld.ellipse([-s(120), s(40), W + s(120), wall.height + s(260)], fill=150)
lum = lum.filter(ImageFilter.GaussianBlur(s(90))).point(lambda v: 96 + int(v * 0.24))
wall = shade(wall, ImageChops.add(lum, noise(W, wall.height, 4, 10, 4, 6), offset=-128))
img.paste(wall, (0, WALL_T))

# ---------- valance: burgundy band with three 70s stripes ----------
val = vgrad(W, s(84), (110, 24, 38), (92, 20, 32))
val = shade(val, noise(W, s(84), 9, 8, 6, 3))
img.paste(val, (0, 0))
d = ImageDraw.Draw(img)
for i, (col, h) in enumerate([(GOLD, 5), (BURG_D, 2), (AVO, 5), (BURG_D, 2), (GOLD, 5)]):
    y0 = s(84) + s(sum(x[1] for x in [(GOLD, 5), (BURG_D, 2), (AVO, 5), (BURG_D, 2), (GOLD, 5)][:i]))
    d.rectangle([0, y0, W, y0 + s(h)], fill=col)
# soft shadow under the valance onto the wall
sh = Image.new('L', (W, s(40)), 0); ImageDraw.Draw(sh).rectangle([0, 0, W, s(8)], fill=120)
sh = sh.filter(ImageFilter.GaussianBlur(s(8)))
img.paste((40, 50, 70), (0, s(103)), sh.point(lambda v: v // 2))

# ---------- clocks ----------
CL_Y, CL_R = s(162), s(38)
TIMES = [(6, 0), (9, 0), (2, 0), (11, 0), (5, 0)]
for i, (hh, mm) in enumerate(TIMES):
    cx = s(136 + 136 * i)
    sh = Image.new('L', (CL_R * 3, CL_R * 3), 0)
    ImageDraw.Draw(sh).ellipse([CL_R // 2, CL_R // 2, CL_R // 2 + 2 * CL_R, CL_R // 2 + 2 * CL_R], fill=150)
    sh = sh.filter(ImageFilter.GaussianBlur(s(6)))
    img.paste((40, 55, 80), (cx - CL_R - CL_R // 2 + s(4), CL_Y - CL_R - CL_R // 2 + s(6)), sh)
    face = Image.new('RGBA', (2 * CL_R, 2 * CL_R), (0, 0, 0, 0)); fd = ImageDraw.Draw(face)
    for k in range(CL_R, 0, -1):  # brass rim with a light at upper left
        t = k / CL_R
        col = tuple(int(c * (0.7 + 0.45 * t)) for c in (190, 150, 70))
        fd.ellipse([CL_R - k, CL_R - k, CL_R + k, CL_R + k], fill=col + (255,))
    rim = ImageDraw.Draw(face)
    rim.ellipse([s(3), s(3), 2 * CL_R - s(3), 2 * CL_R - s(3)], fill=(232, 200, 120, 255))
    rim.ellipse([s(6), s(6), 2 * CL_R - s(6), 2 * CL_R - s(6)], fill=(246, 244, 236, 255))
    for t in range(60):
        a = math.radians(t * 6); big = t % 5 == 0
        r1 = CL_R - s(9); r2 = r1 - (s(6) if big else s(2.5))
        rim.line([CL_R + r1 * math.sin(a), CL_R - r1 * math.cos(a), CL_R + r2 * math.sin(a), CL_R - r2 * math.cos(a)],
                 fill=(30, 28, 30, 255), width=s(1.6) if big else s(0.8))
    ah = math.radians((hh % 12) * 30 + mm * 0.5); am = math.radians(mm * 6)
    rim.line([CL_R, CL_R, CL_R + (CL_R * 0.45) * math.sin(ah), CL_R - (CL_R * 0.45) * math.cos(ah)], fill=(20, 20, 22, 255), width=s(3))
    rim.line([CL_R, CL_R, CL_R + (CL_R * 0.7) * math.sin(am), CL_R - (CL_R * 0.7) * math.cos(am)], fill=(20, 20, 22, 255), width=s(2))
    rim.line([CL_R, CL_R, CL_R - (CL_R * 0.2) * math.sin(am + 1.2), CL_R + (CL_R * 0.2) * math.cos(am + 1.2)], fill=(168, 30, 40, 255), width=s(1))
    rim.ellipse([CL_R - s(3), CL_R - s(3), CL_R + s(3), CL_R + s(3)], fill=(20, 20, 22, 255))
    # glass glint
    gl = Image.new('L', face.size, 0); ImageDraw.Draw(gl).ellipse([s(14), s(10), CL_R + s(4), CL_R - s(6)], fill=70)
    gl = gl.filter(ImageFilter.GaussianBlur(s(5)))
    face = Image.alpha_composite(face, Image.merge('RGBA', (Image.new('L', face.size, 255),) * 3 + (ImageChops.multiply(gl, face.getchannel('A')),)))
    img.paste(face, (cx - CL_R, CL_Y - CL_R), face)
    # name plate under each clock (text set by build.py)
    d = ImageDraw.Draw(img)
    d.rounded_rectangle([cx - s(54), CL_Y + CL_R + s(8), cx + s(54), CL_Y + CL_R + s(30)], radius=s(3), fill=(36, 44, 70))
    d.line([cx - s(52), CL_Y + CL_R + s(9), cx + s(52), CL_Y + CL_R + s(9)], fill=(90, 104, 140), width=s(1))

# ---------- monitor bezel ----------
MX0, MY0, MX1, MY1 = s(96), s(246), s(720), s(604)
sh = Image.new('L', (W, H), 0)
ImageDraw.Draw(sh).rounded_rectangle([MX0 + s(8), MY0 + s(14), MX1 + s(8), MY1 + s(18)], radius=s(30), fill=170)
sh = sh.filter(ImageFilter.GaussianBlur(s(14)))
img.paste((30, 40, 60), (0, 0), sh)
bez = Image.new('RGB', (MX1 - MX0, MY1 - MY0))
bez.paste(vgrad(bez.width, bez.height, (66, 48, 34), (34, 24, 18)))  # dark walnut cabinet
grain = Image.new('L', bez.size, 128); gd = ImageDraw.Draw(grain)
for y in range(0, bez.height, s(2)):
    off = int(10 * math.sin(y / s(23)) + rnd.randint(-6, 6))
    gd.line([0, y, bez.width, y + s(1)], fill=128 + off, width=s(1))
bez = shade(bez, grain.filter(ImageFilter.GaussianBlur(1)))
m = Image.new('L', bez.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, bez.width - 1, bez.height - 1], radius=s(30), fill=255)
img.paste(bez, (MX0, MY0), m)
d = ImageDraw.Draw(img)
d.rounded_rectangle([MX0, MY0, MX1, MY1], radius=s(30), outline=GOLD, width=s(3))
d.rounded_rectangle([MX0 + s(7), MY0 + s(7), MX1 - s(7), MY1 - s(7)], radius=s(24), outline=(120, 92, 50), width=s(1))
# screen well (build.py sets the still at 112,262 592x333)
d.rounded_rectangle([s(106), s(256), s(710), s(601)], radius=s(16), fill=(14, 14, 18))
# cabinet glint
gl = Image.new('L', (W, H), 0); ImageDraw.Draw(gl).rounded_rectangle([MX0 + s(10), MY0 + s(4), MX1 - s(10), MY0 + s(14)], radius=s(6), fill=60)
img.paste((255, 236, 200), (0, 0), gl.filter(ImageFilter.GaussianBlur(s(3))))

# ---------- anchor desk ----------
DT, DF, DB = s(626), s(660), s(860)
d = ImageDraw.Draw(img)
sh = Image.new('L', (W, H), 0); ImageDraw.Draw(sh).rectangle([s(20), DT - s(10), W - s(20), DT + s(10)], fill=160)
img.paste((30, 40, 60), (0, 0), sh.filter(ImageFilter.GaussianBlur(s(10))))
top = vgrad(W - s(36), DF - DT, (176, 122, 64), (120, 78, 40))
tg = Image.new('L', top.size, 128); tgd = ImageDraw.Draw(tg)
for x in range(0, top.width, s(3)):
    tgd.line([x, 0, x + rnd.randint(-s(4), s(4)), top.height], fill=128 + rnd.randint(-14, 14), width=s(2))
top = shade(top, tg.filter(ImageFilter.GaussianBlur(s(1))))
img.paste(top, (s(18), DT))
d.rectangle([s(18), DT, W - s(18), DT + s(4)], fill=(236, 196, 120))
front = vgrad(W - s(36), DB - DF, (98, 66, 36), (58, 38, 22))
fg = Image.new('L', front.size, 128); fgd = ImageDraw.Draw(fg)
for y in range(0, front.height, s(2)):
    off = int(12 * math.sin(y / s(9) + math.sin(y / s(40)) * 2) + rnd.randint(-5, 5))
    fgd.line([0, y, front.width, y], fill=128 + off, width=s(1))
front = shade(front, fg.filter(ImageFilter.GaussianBlur(1)))
img.paste(front, (s(18), DF))
d.rectangle([s(18), DF, W - s(18), DF + s(3)], fill=(40, 26, 16))
# burgundy front panel with gold inlay (title set on it by build.py)
PX0, PY0, PX1, PY1 = s(66), s(678), s(750), s(842)
pan = vgrad(PX1 - PX0, PY1 - PY0, (134, 34, 50), (96, 22, 36))
pan = shade(pan, noise(pan.width, pan.height, 22, 8, 7, 3))
img.paste(pan, (PX0, PY0))
d.rectangle([PX0, PY0, PX1, PY1], outline=GOLD, width=s(3))
d.rectangle([PX0 + s(8), PY0 + s(8), PX1 - s(8), PY1 - s(8)], outline=(196, 140, 48), width=s(1))
for bx in (s(34), W - s(34)):  # little brass studs on the desk ends
    for by in (s(700), s(820)):
        d.ellipse([bx - s(5), by - s(5), bx + s(5), by + s(5)], fill=(214, 170, 80), outline=(120, 86, 30))

# ---------- carpet ----------
car = vgrad(W, H - DB, (86, 22, 32), (52, 12, 20))
car = shade(car, noise(W, H - DB, 31, 3, 12, 1))
img.paste(car, (0, DB))
sh = Image.new('L', (W, s(40)), 0); ImageDraw.Draw(sh).rectangle([s(18), 0, W - s(18), s(10)], fill=200)
img.paste((20, 6, 10), (0, DB), sh.filter(ImageFilter.GaussianBlur(s(9))))

# overall vignette
vig = Image.new('L', (W, H), 0); ImageDraw.Draw(vig).rectangle([0, 0, W, H], outline=255, width=s(30))
vig = vig.filter(ImageFilter.GaussianBlur(s(40))).point(lambda v: int(v * 0.55))
img.paste((30, 14, 18), (0, 0), vig)
os.makedirs(os.path.join(D, 'assets'), exist_ok=True)
img.save(os.path.join(D, 'assets', 'channel4-set.jpg'), quality=92)
print('painted')
