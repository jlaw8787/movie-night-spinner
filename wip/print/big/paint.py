"""Paints the packaging art and the card wear for the MacMillan Toy Company party menu (Big, 1988).
toy-art.png : a box-front product shot, three wooden letter blocks, a spinning top and a ball.
wear-front.png / wear-back.png : soft shelf wear for a printed blue card, big gentle mottling and edge scuffs."""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FONT = os.path.join(D, 'fonts', 'TitanOne.ttf')
random.seed(1988)

def shade(c, f):
    return tuple(max(0, min(255, int(v * f))) for v in c[:3]) + (255,)

# ---------- toy art: 2x of 600 x 380 ----------
W, H = 1200, 760
art = Image.new('RGBA', (W, H), (0, 0, 0, 0))

# soft floor shadow
sh = Image.new('L', (W, H), 0)
sd = ImageDraw.Draw(sh)
sd.ellipse([90, 640, 860, 730], fill=120)
sd.ellipse([860, 650, 1140, 720], fill=110)
sh = sh.filter(ImageFilter.GaussianBlur(26))
shadow = Image.new('RGBA', (W, H), (8, 20, 60, 0)); shadow.putalpha(sh)
art.alpha_composite(shadow)

d = ImageDraw.Draw(art)
font = ImageFont.truetype(FONT, 190)

def block(x, y, s, face, letter, ink):
    """Cube with front face at (x, y) size s, top and right faces receding up-right."""
    dx, dy = int(s * 0.32), int(s * 0.24)
    top = [(x, y), (x + dx, y - dy), (x + s + dx, y - dy), (x + s, y)]
    side = [(x + s, y), (x + s + dx, y - dy), (x + s + dx, y + s - dy), (x + s, y + s)]
    d.polygon(top, fill=shade(face, 1.18))
    d.polygon(side, fill=shade(face, 0.68))
    d.rectangle([x, y, x + s, y + s], fill=face + (255,))
    # bevelled inner panel, like a routed wooden block
    m = int(s * 0.09)
    d.rectangle([x + m, y + m, x + s - m, y + s - m], outline=shade(face, 0.82), width=6)
    # wood edge lines
    for poly in (top, side):
        d.line(poly + [poly[0]], fill=shade(face, 0.55), width=4)
    d.rectangle([x, y, x + s, y + s], outline=shade(face, 0.55), width=4)
    # letter, with a darker drop for depth
    bb = d.textbbox((0, 0), letter, font=font)
    tw, th = bb[2] - bb[0], bb[3] - bb[1]
    tx, ty = x + (s - tw) / 2 - bb[0], y + (s - th) / 2 - bb[1]
    d.text((tx + 6, ty + 7), letter, font=font, fill=shade(ink, 0.6))
    d.text((tx, ty), letter, font=font, fill=ink + (255,))
    # soft highlight on the top-left of the face
    hl = Image.new('L', (W, H), 0)
    ImageDraw.Draw(hl).ellipse([x - s * 0.2, y - s * 0.3, x + s * 0.55, y + s * 0.45], fill=46)
    hl = hl.filter(ImageFilter.GaussianBlur(30))
    mask = Image.new('L', (W, H), 0); ImageDraw.Draw(mask).rectangle([x, y, x + s, y + s], fill=255)
    from PIL import ImageChops
    hl = ImageChops.multiply(hl, mask)
    white = Image.new('RGBA', (W, H), (255, 255, 255, 0)); white.putalpha(hl)
    art.alpha_composite(white)

RED, YEL, GRN = (206, 38, 44), (250, 196, 30), (36, 150, 84)
CREAM = (255, 248, 232)
S = 270
block(120, 400, S, RED, 'B', CREAM)
block(120 + S + 40, 400, S, GRN, 'G', CREAM)
block(120 + S // 2 + 20, 400 - S - 6, S, YEL, 'I', (190, 30, 36))
d = ImageDraw.Draw(art)

# spinning top: one striped body (short upper cone, rim, long lower cone), handle and tip
cx, cy = 1000, 455
R0 = 150
m = Image.new('L', (W, H), 0)
md = ImageDraw.Draw(m)
md.polygon([(cx - R0, cy), (cx - 40, cy - 110), (cx + 40, cy - 110), (cx + R0, cy)], fill=255)
md.ellipse([cx - 40, cy - 128, cx + 40, cy - 92], fill=255)
md.ellipse([cx - R0, cy - 44, cx + R0, cy + 44], fill=255)
md.polygon([(cx - R0, cy), (cx + R0, cy), (cx + 7, cy + 220), (cx - 7, cy + 220)], fill=255)
stripes = Image.new('RGBA', (W, H), (0, 0, 0, 0))
sd2 = ImageDraw.Draw(stripes)
bands = [(206, 38, 44), (255, 248, 232), (30, 80, 170), (255, 248, 232), (250, 196, 30), (206, 38, 44), (255, 248, 232), (206, 38, 44)]
y0, step = cy - 130, 44
for i in range(12):
    sd2.rectangle([cx - R0 - 2, y0 + i * step, cx + R0 + 2, y0 + (i + 1) * step], fill=bands[i % len(bands)] + (255,))
# round shading: darker toward the right edge
sh2 = Image.new('L', (W, H), 0)
ImageDraw.Draw(sh2).rectangle([cx + 40, cy - 140, cx + R0 + 10, cy + 230], fill=90)
sh2 = sh2.filter(ImageFilter.GaussianBlur(40))
dark = Image.new('RGBA', (W, H), (20, 10, 30, 0)); dark.putalpha(sh2)
stripes.alpha_composite(dark)
hl2 = Image.new('L', (W, H), 0)
ImageDraw.Draw(hl2).rectangle([cx - 110, cy - 120, cx - 70, cy + 120], fill=90)
hl2 = hl2.filter(ImageFilter.GaussianBlur(18))
lite = Image.new('RGBA', (W, H), (255, 255, 255, 0)); lite.putalpha(hl2)
stripes.alpha_composite(lite)
topimg = Image.new('RGBA', (W, H), (0, 0, 0, 0))
topimg.paste(stripes, (0, 0), m)
td = ImageDraw.Draw(topimg)
td.arc([cx - R0, cy - 44, cx + R0, cy + 44], 0, 180, fill=(110, 18, 24, 255), width=5)
td.rectangle([cx - 15, cy - 230, cx + 15, cy - 110], fill=(40, 40, 46, 255))
td.ellipse([cx - 26, cy - 246, cx + 26, cy - 216], fill=(250, 196, 30, 255))
td.polygon([(cx - 7, cy + 218), (cx + 7, cy + 218), (cx, cy + 250)], fill=(60, 60, 66, 255))
topimg = topimg.rotate(-8, center=(cx, cy + 250), resample=Image.BICUBIC)
art.alpha_composite(topimg)

# small ball in front
bx, by, br = 840, 640, 62
ball = Image.new('RGBA', (W, H), (0, 0, 0, 0))
bl = ImageDraw.Draw(ball)
bl.ellipse([bx - br, by - br, bx + br, by + br], fill=(30, 80, 170, 255))
bl.chord([bx - br, by - br, bx + br, by + br], 200, 340, fill=(250, 196, 30, 255))
bl.ellipse([bx - br, by - br, bx + br, by + br], outline=(16, 40, 100, 255), width=4)
hl = Image.new('L', (W, H), 0); ImageDraw.Draw(hl).ellipse([bx - 40, by - 46, bx - 6, by - 14], fill=150)
hl = hl.filter(ImageFilter.GaussianBlur(8))
wt = Image.new('RGBA', (W, H), (255, 255, 255, 0)); wt.putalpha(hl)
ball.alpha_composite(wt)
art.alpha_composite(ball)
art.save(os.path.join(A, 'toy-art.png'))

# ---------- wear: 816 x 1056 at 1x, scaled up in the page ----------
def wear(seed, name):
    rnd = random.Random(seed)
    w, h = 816, 1056
    # light layer: scuffed edges and corners where blue ink rubs to white board
    lt = Image.new('L', (w, h), 0)
    ld = ImageDraw.Draw(lt)
    for _ in range(26):
        side = rnd.choice('tblr')
        t = rnd.random()
        r = rnd.randint(4, 14)
        x, y = {'t': (t * w, rnd.randint(-4, 6)), 'b': (t * w, h - rnd.randint(-4, 6)),
                'l': (rnd.randint(-4, 6), t * h), 'r': (w - rnd.randint(-4, 6), t * h)}[side]
        ld.ellipse([x - r * 2, y - r, x + r * 2, y + r], fill=rnd.randint(22, 48))
    for (x, y) in ((0, 0), (w, 0), (0, h), (w, h)):
        ld.ellipse([x - 30, y - 30, x + 30, y + 30], fill=60)
    lt = lt.filter(ImageFilter.GaussianBlur(9))
    light = Image.new('RGBA', (w, h), (250, 246, 236, 0)); light.putalpha(lt)
    # big gentle mottling, slightly darker and lighter patches
    mt = Image.new('L', (w, h), 0)
    md = ImageDraw.Draw(mt)
    for _ in range(14):
        x, y, r = rnd.randint(0, w), rnd.randint(0, h), rnd.randint(120, 260)
        md.ellipse([x - r, y - r, x + r, y + r], fill=rnd.randint(8, 18))
    mt = mt.filter(ImageFilter.GaussianBlur(90))
    mott = Image.new('RGBA', (w, h), (255, 250, 235, 0)); mott.putalpha(mt)
    # sun fade at one edge, the way a sheet pinned near a window goes
    fd = Image.new('L', (w, h), 0)
    ImageDraw.Draw(fd).rectangle([0, 0, w, 60], fill=28)
    fd = fd.filter(ImageFilter.GaussianBlur(50))
    fade = Image.new('RGBA', (w, h), (255, 252, 240, 0)); fade.putalpha(fd)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    out.alpha_composite(mott); out.alpha_composite(fade); out.alpha_composite(light)
    out.save(os.path.join(A, name))

wear(1, 'wear-front.png')
wear(2, 'wear-back.png')
print('painted')
