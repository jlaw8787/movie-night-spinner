"""Signature piece, second pass: the cast-iron loft building at night, painted in a gouache and pen-and-ink manner.
Cast-iron front with fluted columns, capitals and arched window heads, brick neighbours with a fire escape,
warm lit windows spilling light on the iron, the Moonlight coffee shop under its awning, and the bassinet with
its note on the top step under the door lamp. Output assets/loft-night.png at 2x (1632x840)."""
import os, random, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
random.seed(1987); rng = np.random.default_rng(1125)
W, H = 1632, 840
GROUND = 712
BX0, BX1 = 640, 1560
TOP = 214
GF = GROUND - 176
INK = (26, 24, 44)
WARM = (246, 196, 116)


def L():
    return Image.new('RGBA', (W, H), (0, 0, 0, 0))


def comp(img, lay, blur=0):
    img.alpha_composite(lay.filter(ImageFilter.GaussianBlur(blur)) if blur else lay)


def glow(img, x, y, r, col, a, blur):
    g = L(); ImageDraw.Draw(g).ellipse((x - r, y - r, x + r, y + r), fill=col + (a,))
    comp(img, g, blur)


def vgrad(d, box, top, bot):
    x0, y0, x1, y1 = box
    for y in range(int(y0), int(y1)):
        t = (y - y0) / max(1, y1 - y0)
        d.line([(x0, y), (x1, y)], fill=tuple(int(top[i] + (bot[i] - top[i]) * t) for i in range(3)) + (255,))


def ink(d, pts, w=2, col=INK, a=230, j=0.9):
    """Pen line with a slight hand wobble."""
    out = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(1, int(math.hypot(x1 - x0, y1 - y0) / 14))
        for k in range(n):
            t = k / n
            out.append((x0 + (x1 - x0) * t + random.uniform(-j, j), y0 + (y1 - y0) * t + random.uniform(-j, j)))
    out.append(pts[-1])
    d.line(out, fill=col + (a,), width=w, joint='curve')


def hatch(img, box, step=6, a=60, cross=False, ang=1):
    x0, y0, x1, y1 = box
    h = L(); hd = ImageDraw.Draw(h)
    span = y1 - y0
    for x in range(int(x0 - span), int(x1), step):
        ink(hd, [(x, y1), (x + span * ang, y0)] if ang > 0 else [(x + span, y1), (x, y0)], 1, INK, a, 0.6)
        if cross:
            ink(hd, [(x + span, y1), (x, y0)], 1, INK, a, 0.6)
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).rectangle(box, fill=255)
    h.putalpha(ImageChops.multiply(h.getchannel('A'), m))
    comp(img, h)


img = Image.new('RGBA', (W, H), (0, 0, 0, 255))
d = ImageDraw.Draw(img)

# ---- sky: deep blue gouache with a soft lit band of cloud near the moon
vgrad(d, (0, 0, W, GROUND), (14, 20, 50), (58, 66, 112))
cl = L(); cd = ImageDraw.Draw(cl)
for _ in range(26):
    x, y = random.randint(700, W + 100), random.randint(20, 200)
    cd.ellipse((x - 160, y - 18, x + 160, y + 18), fill=(120, 130, 180, 36))
comp(img, cl, 14)
for _ in range(110):
    x, y = random.randrange(W), random.randrange(6, 360)
    r = random.choice((1, 1, 1, 1.6, 2.2))
    d.ellipse((x - r, y - r, x + r, y + r), fill=(244, 236, 210, random.randint(80, 210)))
mx, my, mr = 1572, 86, 32
glow(img, mx, my, 130, (250, 236, 200), 60, 60)
m = L(); md = ImageDraw.Draw(m)
md.ellipse((mx - mr, my - mr, mx + mr, my + mr), fill=(250, 241, 214, 255))
cut = Image.new('L', (W, H), 0); ImageDraw.Draw(cut).ellipse((mx - mr + 22, my - mr - 9, mx + mr + 22, my + mr - 9), fill=255)
m.putalpha(ImageChops.subtract(m.getchannel('A'), cut)); comp(img, m)
d = ImageDraw.Draw(img)


# ---- brick neighbours
def brick_wall(box, base):
    x0, y0, x1, y1 = box
    vgrad(d, box, tuple(int(c * 1.05) for c in base), tuple(int(c * 0.7) for c in base))
    for y in range(y0, y1, 9):
        off = 0 if (y // 9) % 2 else 13
        for x in range(x0 - off, x1, 26):
            t = random.uniform(-0.12, 0.12)
            c = tuple(max(0, min(255, int(v * (1 + t)))) for v in base)
            d.rectangle((max(x0, x + 1), y + 1, min(x1, x + 24), y + 7), fill=c + (90,))
        d.line([(x0, y), (x1, y)], fill=(24, 22, 40, 70), width=1)


def brick_windows(box, cols, rows, lit_set, arch=True):
    x0, y0, x1, y1 = box
    cw = (x1 - x0) / cols; rh = (y1 - y0) / rows
    for r in range(rows):
        for c in range(cols):
            wx = int(x0 + c * cw + cw * 0.28); wx2 = int(x0 + (c + 1) * cw - cw * 0.28)
            wy = int(y0 + r * rh + rh * 0.22); wy2 = int(y0 + (r + 1) * rh - rh * 0.12)
            lit = (r, c) in lit_set
            if lit:
                vgrad(d, (wx, wy, wx2, wy2), (250, 214, 140), (214, 150, 84))
                glow(img, (wx + wx2) // 2, (wy + wy2) // 2, 46, WARM, 50, 20)
            else:
                vgrad(d, (wx, wy, wx2, wy2), (40, 46, 84), (22, 26, 52))
            d.rectangle((wx - 4, wy - 8, wx2 + 4, wy - 2), fill=(96, 92, 110, 255))   # stone lintel
            d.rectangle((wx - 5, wy2, wx2 + 5, wy2 + 5), fill=(110, 106, 126, 255))  # sill
            d.line([(wx, (wy + wy2) // 2), (wx2, (wy + wy2) // 2)], fill=(30, 26, 40, 255), width=2)


for box, base, lit in (((0, 400, 250, GROUND), (96, 52, 46), {(0, 0), (2, 2)}),
                       ((232, 340, 472, GROUND), (110, 62, 50), {(1, 1), (3, 0)}),
                       ((452, 420, 640, GROUND), (88, 50, 48), {(0, 1)}),
                       ((1548, 320, W, GROUND), (96, 56, 50), {(1, 0)})):
    brick_wall(box, base)
    d.rectangle((box[0] - 4, box[1] - 14, box[2] + 4, box[1]), fill=(40, 38, 60, 255))
    brick_windows((box[0], box[1], box[2], GROUND - 40), max(1, (box[2] - box[0]) // 80), 4, lit)
    d = ImageDraw.Draw(img)
# night wash over the neighbours so the main building leads
wash = L(); ImageDraw.Draw(wash).rectangle((0, 300, BX0, GROUND), fill=(16, 22, 60, 110)); comp(img, wash)
wash = L(); ImageDraw.Draw(wash).rectangle((BX1, 300, W, GROUND), fill=(16, 22, 60, 110)); comp(img, wash)
d = ImageDraw.Draw(img)
# fire escape on the middle brick building
fe = L(); fd = ImageDraw.Draw(fe)
for i, y in enumerate(range(410, GROUND - 60, 74)):
    fd.rectangle((262, y, 446, y + 4), fill=INK + (255,))
    for x in range(262, 447, 9):
        fd.line([(x, y - 22), (x, y)], fill=INK + (200,), width=1)
    fd.line([(262, y - 22), (446, y - 22)], fill=INK + (255,), width=2)
    if y + 74 < GROUND - 60:
        a, b = (284, 420) if i % 2 == 0 else (420, 284)
        fd.line([(a, y + 4), (b, y + 74)], fill=INK + (255,), width=3)
        for k in range(1, 9):
            t = k / 9
            fd.line([(a + (b - a) * t - 6, y + 4 + 70 * t), (a + (b - a) * t + 6, y + 4 + 70 * t)], fill=INK + (220,), width=1)
comp(img, fe)
d = ImageDraw.Draw(img)

# ---- the conservatory on the roof, lit warm, plants against the glass
cx0, cx1, cy1, cy0 = BX0 + 120, BX1 - 120, TOP - 30, 112
glow(img, (cx0 + cx1) // 2, cy1 - 30, 320, WARM, 70, 90)
d = ImageDraw.Draw(img)
vgrad(d, (cx0, cy0 + 40, cx1, cy1), (250, 210, 132), (222, 160, 86))
d.pieslice((cx0, cy0, cx1, cy0 + 90), 180, 360, fill=(246, 204, 128, 255))
for x in range(cx0 + 20, cx1 - 20, 46):
    h = random.randint(28, 62)
    for k in range(8):
        ang = -math.pi / 2 + random.uniform(-1.0, 1.0)
        d.line([(x, cy1 - 4), (x + math.cos(ang) * h, cy1 - 4 + math.sin(ang) * h)], fill=(60, 82, 56, 255), width=4)
    d.rectangle((x - 9, cy1 - 14, x + 9, cy1), fill=(150, 80, 60, 255))
fr = L(); frd = ImageDraw.Draw(fr)
for x in range(cx0, cx1 + 1, 36):
    ink(frd, [(x, cy0 + 44), (x, cy1)], 3, (34, 34, 56))
ink(frd, [(cx0, cy0 + 44), (cx1, cy0 + 44)], 4, (34, 34, 56))
ink(frd, [(cx0, (cy0 + cy1) // 2 + 22), (cx1, (cy0 + cy1) // 2 + 22)], 2, (34, 34, 56))
frd.arc((cx0, cy0, cx1, cy0 + 90), 180, 360, fill=(34, 34, 56, 255), width=4)
ox, oy = (cx0 + cx1) / 2, cy0 + 45
for i in range(1, 14):
    a = math.pi + math.pi * i / 14
    ink(frd, [(ox, oy), (ox + (cx1 - cx0) / 2 * math.cos(a), oy + 45 * math.sin(a))], 2, (34, 34, 56))
comp(img, fr)
d = ImageDraw.Draw(img)

# ---- cast-iron front: painted iron, pale grey in moonlight, darker toward the street
IRON_T, IRON_B = (150, 152, 170), (84, 88, 116)
vgrad(d, (BX0, TOP, BX1, GROUND), IRON_T, IRON_B)
# rusticated joints in the iron panels
for y in range(TOP + 14, GF, 22):
    d.line([(BX0, y), (BX1, y)], fill=(70, 72, 100, 60), width=1)
# cornice with brackets and a dentil band
d.rectangle((BX0 - 22, TOP - 34, BX1 + 22, TOP - 4), fill=(110, 114, 144, 255))
d.rectangle((BX0 - 22, TOP - 40, BX1 + 22, TOP - 32), fill=(170, 174, 200, 255))
for x in range(BX0 - 14, BX1 + 14, 14):
    d.rectangle((x, TOP - 4, x + 7, TOP + 6), fill=(96, 100, 130, 255))
for x in range(BX0 + 4, BX1, 76):
    d.polygon([(x, TOP - 4), (x + 16, TOP - 4), (x + 12, TOP + 28), (x + 4, TOP + 28)], fill=(120, 124, 154, 255))
sh = L(); ImageDraw.Draw(sh).rectangle((BX0, TOP + 6, BX1, TOP + 30), fill=(10, 12, 34, 120)); comp(img, sh, 8)
d = ImageDraw.Draw(img)

bays, floors = 6, 3
bw = (BX1 - BX0) / bays
fh = (GF - 14 - (TOP + 30)) / floors
lit_set = {(0, 1), (0, 4), (1, 2), (1, 5), (2, 0), (2, 3)}
inkL = L(); il = ImageDraw.Draw(inkL)
for f in range(floors):
    fy0 = TOP + 30 + f * fh
    # floor band / entablature
    d.rectangle((BX0, fy0 + fh - 12, BX1, fy0 + fh), fill=(122, 126, 156, 255))
    ink(il, [(BX0, fy0 + fh - 12), (BX1, fy0 + fh - 12)], 2)
    for b in range(bays):
        x0 = BX0 + b * bw + 22; x1 = BX0 + (b + 1) * bw - 22
        wy0, wy1 = fy0 + 22, fy0 + fh - 22
        lit = (f, b) in lit_set
        # deep reveal
        d.rectangle((x0 - 4, wy0 - 4, x1 + 4, wy1 + 4), fill=(40, 42, 66, 255))
        # glass with segmental arch head
        archh = 18
        if lit:
            vgrad(d, (x0, wy0, x1, wy1), (252, 222, 150), (218, 148, 80))
            d.pieslice((x0, wy0 - archh, x1, wy0 + archh), 180, 360, fill=(252, 222, 150, 255))
            # half drawn shade and a lamp shape inside
            d.rectangle((x0, wy0 - 4, x1, wy0 + (wy1 - wy0) * 0.28), fill=(236, 200, 150, 255))
            d.line([(x0, wy0 + (wy1 - wy0) * 0.28), (x1, wy0 + (wy1 - wy0) * 0.28)], fill=(150, 110, 70, 255), width=2)
        else:
            vgrad(d, (x0, wy0, x1, wy1), (58, 70, 118), (26, 32, 64))
            d.pieslice((x0, wy0 - archh, x1, wy0 + archh), 180, 360, fill=(58, 70, 118, 255))
            d.polygon([(x0 + 6, wy1 - 14), (x0 + 34, wy0 + 6), (x0 + 52, wy0 + 6), (x0 + 6, wy1 - 2)], fill=(92, 106, 156, 150))
        # sash frames
        mid = (wy0 + wy1) / 2
        for seg in ((x0, wy0, x1, wy1),):
            ink(il, [(x0, mid), (x1, mid)], 4, (40, 38, 58))
            ink(il, [((x0 + x1) / 2, wy0 - archh + 4), ((x0 + x1) / 2, wy1)], 3, (40, 38, 58))
        il.arc((x0 - 4, wy0 - archh - 4, x1 + 4, wy0 + archh + 4), 180, 360, fill=INK + (230,), width=3)
        ink(il, [(x0 - 4, wy0), (x0 - 4, wy1 + 4), (x1 + 4, wy1 + 4), (x1 + 4, wy0)], 2)
        # arched hood moulding with keystone
        d.arc((x0 - 12, wy0 - archh - 14, x1 + 12, wy0 + archh + 4), 180, 360, fill=(170, 174, 198, 255), width=6)
        kx = (x0 + x1) / 2
        d.polygon([(kx - 8, wy0 - archh - 16), (kx + 8, wy0 - archh - 16), (kx + 6, wy0 - archh + 2), (kx - 6, wy0 - archh + 2)], fill=(176, 180, 204, 255))
        ink(il, [(kx - 8, wy0 - archh - 16), (kx + 8, wy0 - archh - 16), (kx + 6, wy0 - archh + 2), (kx - 6, wy0 - archh + 2), (kx - 8, wy0 - archh - 16)], 1)
        # sill with shadow under it
        d.rectangle((x0 - 10, wy1 + 4, x1 + 10, wy1 + 11), fill=(176, 180, 204, 255))
        s2 = L(); ImageDraw.Draw(s2).rectangle((x0 - 8, wy1 + 11, x1 + 8, wy1 + 20), fill=(10, 12, 34, 120)); comp(img, s2, 4)
        d = ImageDraw.Draw(img)
        if lit:
            glow(img, (x0 + x1) // 2, (wy0 + wy1) // 2, 92, WARM, 64, 34)
            d = ImageDraw.Draw(img)
    # fluted Corinthian-style columns between bays
    for b in range(bays + 1):
        x = BX0 + b * bw
        c0, c1 = fy0 + 4, fy0 + fh - 12
        d.rectangle((x - 11, c0, x + 11, c1), fill=(160, 164, 190, 255))
        d.rectangle((x + 3, c0, x + 11, c1), fill=(120, 124, 154, 255))          # shaded side
        for k in (-6, -1, 4):
            il.line([(x + k, c0 + 14), (x + k, c1 - 10)], fill=(70, 72, 100, 170), width=1)   # flutes
        d.rectangle((x - 16, c0, x + 16, c0 + 12), fill=(184, 188, 210, 255))   # capital
        for k in range(-14, 15, 6):
            d.ellipse((x + k - 3, c0 + 10, x + k + 3, c0 + 16), fill=(150, 154, 182, 255))
        d.rectangle((x - 15, c1 - 8, x + 15, c1), fill=(150, 154, 182, 255))    # base
        ink(il, [(x - 11, c0 + 12), (x - 11, c1 - 8)], 2)
        ink(il, [(x + 11, c0 + 12), (x + 11, c1 - 8)], 2)
        ink(il, [(x - 16, c0), (x + 16, c0), (x + 16, c0 + 12), (x - 16, c0 + 12), (x - 16, c0)], 1)
comp(img, inkL)
d = ImageDraw.Draw(img)
# side edges and cornice inked
edge = L(); ed = ImageDraw.Draw(edge)
ink(ed, [(BX0 - 22, TOP - 40), (BX1 + 22, TOP - 40), (BX1 + 22, TOP - 4), (BX0 - 22, TOP - 4), (BX0 - 22, TOP - 40)], 3)
ink(ed, [(BX0, TOP - 4), (BX0, GROUND)], 3); ink(ed, [(BX1, TOP - 4), (BX1, GROUND)], 3)
comp(img, edge)
d = ImageDraw.Draw(img)

# ---- ground floor: iron storefront, rusticated piers
d.rectangle((BX0, GF - 14, BX1, GF), fill=(150, 154, 182, 255))
vgrad(d, (BX0, GF, BX1, GROUND), (64, 68, 98), (40, 42, 70))
sx0, sx1 = BX0 + 26, BX0 + 600
glow(img, (sx0 + sx1) // 2, GF + 100, 320, WARM, 110, 70)
d = ImageDraw.Draw(img)
vgrad(d, (sx0, GF + 44, sx1, GROUND - 16), (252, 220, 150), (232, 170, 96))
# inside: back wall shelves, counter, stools, pie case, urn, clock
d.rectangle((sx0, GF + 44, sx1, GF + 60), fill=(214, 160, 96, 255))
d.rectangle((sx0, GROUND - 74, sx1, GROUND - 16), fill=(150, 64, 70, 255))
d.rectangle((sx0, GROUND - 78, sx1, GROUND - 72), fill=(220, 210, 200, 255))
for x in range(sx0 + 34, sx1 - 20, 64):
    d.ellipse((x - 2, GROUND - 98, x + 30, GROUND - 88), fill=(196, 60, 80, 255))
    d.rectangle((x + 12, GROUND - 90, x + 16, GROUND - 74), fill=(70, 60, 70, 255))
d.rounded_rectangle((sx1 - 118, GF + 96, sx1 - 70, GF + 150), 8, fill=(196, 196, 206, 255))
d.ellipse((sx0 + 26, GF + 98, sx0 + 58, GF + 130), fill=(252, 240, 210, 255))
d.line([(sx0 + 42, GF + 114), (sx0 + 42, GF + 104)], fill=INK + (255,), width=3)
d.line([(sx0 + 42, GF + 114), (sx0 + 52, GF + 114)], fill=INK + (255,), width=3)
f = ImageFont.truetype(os.path.join(D, 'fonts', 'Righteous-Regular.ttf'), 44)
f2 = ImageFont.truetype(os.path.join(D, 'fonts', 'Righteous-Regular.ttf'), 22)
d = ImageDraw.Draw(img)
gl = L(); gd = ImageDraw.Draw(gl)
for x in range(sx0, sx1 + 1, 115):
    gd.rectangle((x - 5, GF + 44, x + 5, GROUND - 16), fill=(54, 56, 84, 255))
    ink(gd, [(x - 5, GF + 44), (x - 5, GROUND - 16)], 1); ink(gd, [(x + 5, GF + 44), (x + 5, GROUND - 16)], 1)
ink(gd, [(sx0, GF + 44), (sx1, GF + 44), (sx1, GROUND - 16), (sx0, GROUND - 16), (sx0, GF + 44)], 3)
comp(img, gl)
neon = L(); ImageDraw.Draw(neon).text(((sx0 + sx1) // 2, GF + 86), 'Moonlight', font=f, anchor='mm', fill=(255, 84, 136, 255))
comp(img, neon, 10); comp(img, neon)
n2 = L(); ImageDraw.Draw(n2).text(((sx0 + sx1) // 2, GF + 86), 'Moonlight', font=f, anchor='mm', fill=(255, 220, 232, 170)); comp(img, n2, 1)
d = ImageDraw.Draw(img)
# awning with scalloped valance, shaded underside
aw0, aw1 = sx0 - 14, sx1 + 14
for i in range(16):
    x = aw0 + (aw1 - aw0) * i / 16; x2 = aw0 + (aw1 - aw0) * (i + 1) / 16
    c = (206, 79, 114) if i % 2 == 0 else (242, 232, 204)
    d.polygon([(x, GF - 6), (x2, GF - 6), (x2 + 10, GF + 34), (x + 10, GF + 34)], fill=c + (255,))
    d.pieslice((x + 10, GF + 22, x2 + 10, GF + 46), 0, 180, fill=c + (255,))
shade = L(); sd = ImageDraw.Draw(shade)
sd.polygon([(aw0, GF - 6), (aw1, GF - 6), (aw1 + 10, GF + 46), (aw0 + 10, GF + 46)], fill=(20, 22, 64, 0))
for y in range(GF - 6, GF + 46):
    sd.line([(aw0, y), (aw1 + 10, y)], fill=(20, 22, 64, int(20 + 60 * (y - GF + 6) / 52)))
comp(img, shade)
a2 = L(); ad = ImageDraw.Draw(a2)
ink(ad, [(aw0, GF - 6), (aw1, GF - 6)], 2); ink(ad, [(aw0, GF - 6), (aw0 + 10, GF + 34)], 2); ink(ad, [(aw1, GF - 6), (aw1 + 10, GF + 34)], 2)
comp(img, a2)
sh = L(); ImageDraw.Draw(sh).rectangle((sx0, GF + 44, sx1, GF + 70), fill=(60, 30, 40, 90)); comp(img, sh, 10)
d = ImageDraw.Draw(img)

# loft entrance
dx0, dx1 = BX1 - 300, BX1 - 150
d.rectangle((dx0 - 26, GF + 12, dx1 + 26, GROUND - 40), fill=(150, 154, 182, 255))
d.rectangle((dx0, GF + 30, dx1, GROUND - 40), fill=(44, 34, 46, 255))
vgrad(d, (dx0, GF + 30, dx1, GF + 62), (252, 218, 140), (226, 170, 96))
dl = L(); dd = ImageDraw.Draw(dl)
ink(dd, [(dx0 - 26, GF + 12), (dx1 + 26, GF + 12), (dx1 + 26, GROUND - 40)], 3); ink(dd, [(dx0 - 26, GF + 12), (dx0 - 26, GROUND - 40)], 3)
ink(dd, [(dx0, GF + 62), (dx1, GF + 62)], 4); ink(dd, [((dx0 + dx1) / 2, GF + 62), ((dx0 + dx1) / 2, GROUND - 40)], 3)
for px in (dx0 + 12, (dx0 + dx1) // 2 + 10):
    ink(dd, [(px, GF + 76), (px + 50, GF + 76), (px + 50, GROUND - 62), (px, GROUND - 62), (px, GF + 76)], 2, (110, 96, 120))
dd.text(((dx0 + dx1) // 2, GF + 22), '87', font=f2, anchor='mm', fill=(40, 36, 56, 255))
comp(img, dl)
d = ImageDraw.Draw(img)
d.ellipse(((dx0 + dx1) // 2 - 22, GF + 124, (dx0 + dx1) // 2 - 12, GF + 134), fill=(214, 184, 110, 255))
# piers either side of the doorway, rusticated
for px0 in (BX0 + 612, BX1 - 116):
    d.rectangle((px0, GF, px0 + 30, GROUND), fill=(120, 124, 154, 255))
    for y in range(GF + 10, GROUND, 18):
        d.line([(px0, y), (px0 + 30, y)], fill=(60, 62, 92, 255), width=2)
# door lamp, its pool of light, and the stoop
lx, ly = dx1 + 44, GF + 44
glow(img, lx, ly + 80, 230, (252, 212, 140), 100, 80)
d = ImageDraw.Draw(img)
d.rectangle((lx - 3, ly - 32, lx + 3, ly - 12), fill=INK + (255,))
d.polygon([(lx - 16, ly - 12), (lx + 16, ly - 12), (lx + 12, ly + 24), (lx - 12, ly + 24)], fill=(255, 232, 170, 255))
d.rectangle((lx - 18, ly - 16, lx + 18, ly - 10), fill=INK + (255,))
glow(img, lx, ly + 6, 40, (255, 242, 196), 180, 12)
d = ImageDraw.Draw(img)
for i, (y0, ext) in enumerate(((GROUND - 40, 34), (GROUND - 26, 52), (GROUND - 13, 70))):
    vgrad(d, (dx0 - ext, y0, dx1 + ext, y0 + 13), (176, 172, 180), (120, 118, 140))
    d.line([(dx0 - ext, y0), (dx1 + ext, y0)], fill=(214, 206, 196, 255), width=2)
    d.line([(dx0 - ext, y0 + 13), (dx1 + ext, y0 + 13)], fill=INK + (200,), width=2)

# the bassinet on the top step, drawn large then reduced so the weave stays fine
bx, by = 200, 200
BAS = Image.new('RGBA', (400, 260), (0, 0, 0, 0))
bd = ImageDraw.Draw(BAS)
bd.ellipse((bx - 64, by - 6, bx + 64, by + 6), fill=(20, 20, 30, 120))
bd.polygon([(bx - 60, by - 52), (bx + 60, by - 52), (bx + 48, by), (bx - 48, by)], fill=(206, 168, 104, 255))
for k in range(1, 8):
    y = by - 52 + k * 6.5
    bd.line([(bx - 60 + k * 1.6, y), (bx + 60 - k * 1.6, y)], fill=(150, 112, 64, 255), width=2)
for k in range(-5, 6):
    bd.line([(bx + k * 10, by - 52), (bx + k * 8, by)], fill=(172, 132, 78, 255), width=2)
bd.arc((bx - 50, by - 112, bx + 50, by - 22), 200, 340, fill=(190, 150, 92, 255), width=7)
bd.ellipse((bx - 66, by - 66, bx + 66, by - 42), fill=(244, 188, 204, 255))
for k in range(-6, 7):
    bd.ellipse((bx + k * 10 - 7, by - 58, bx + k * 10 + 7, by - 46), fill=(252, 226, 232, 255))
bd.ellipse((bx - 18, by - 74, bx + 16, by - 54), fill=(252, 236, 238, 255))
bd.ellipse((bx - 9, by - 70, bx + 7, by - 58), fill=(246, 206, 186, 255))
bd.polygon([(bx + 22, by - 70), (bx + 46, by - 74), (bx + 48, by - 58), (bx + 24, by - 54)], fill=(250, 248, 236, 255))
bd.line([(bx + 27, by - 66), (bx + 42, by - 68)], fill=(120, 120, 150, 255), width=1)
bd.line([(bx + 27, by - 61), (bx + 40, by - 63)], fill=(120, 120, 150, 255), width=1)
bd.polygon([(bx - 60, by - 52), (bx + 60, by - 52), (bx + 48, by), (bx - 48, by)], outline=INK + (255,), width=3)
glow(img, (dx0 + dx1) // 2, GROUND - 56, 70, (255, 214, 220), 80, 24)
img.alpha_composite(BAS.resize((240, 156), Image.LANCZOS), ((dx0 + dx1) // 2 - 120, GROUND - 160))
d = ImageDraw.Draw(img)

# ---- bluestone sidewalk, curb, wet street with warm reflections
vgrad(d, (0, GROUND, W, H - 40), (78, 84, 118), (54, 60, 94))
for x in range(-60, W, 132):
    d.line([(x, GROUND + 2), (x - 46, H - 40)], fill=(40, 44, 76, 255), width=2)
d.line([(0, GROUND + 40), (W, GROUND + 40)], fill=(44, 48, 80, 255), width=2)
d.rectangle((0, H - 40, W, H - 30), fill=(140, 142, 166, 255))
vgrad(d, (0, H - 30, W, H), (30, 34, 58), (18, 20, 40))
refl = L(); rd = ImageDraw.Draw(refl)
rd.rectangle((sx0, GROUND + 4, sx1, GROUND + 96), fill=(246, 196, 120, 80))
rd.ellipse((dx0 - 100, GROUND - 4, dx1 + 140, GROUND + 86), fill=(252, 212, 140, 70))
for x in range(sx0 + 40, sx1, 90):
    rd.rectangle((x, GROUND + 6, x + 6, GROUND + 70), fill=(255, 120, 160, 60))
comp(img, refl, 18)
d = ImageDraw.Draw(img)

# street lamp
px = 560
glow(img, px + 56, 470, 210, (250, 214, 150), 60, 90)
d = ImageDraw.Draw(img)
d.rectangle((px - 6, 474, px + 6, GROUND + 50), fill=INK + (255,))
d.rectangle((px - 14, GROUND + 28, px + 14, GROUND + 52), fill=INK + (255,))
d.arc((px - 2, 432, px + 60, 494), 180, 270, fill=INK + (255,), width=6)
d.polygon([(px + 40, 444), (px + 74, 444), (px + 66, 466), (px + 48, 466)], fill=INK + (255,))
glow(img, px + 57, 470, 26, (255, 238, 184), 220, 10)
cone = L(); ImageDraw.Draw(cone).polygon([(px + 48, 466), (px + 66, 466), (px + 180, GROUND + 60), (px - 70, GROUND + 60)], fill=(250, 220, 160, 38))
comp(img, cone, 18)

# ---- pen hatching in the shadows: under the cornice, the street end of the iron, the alley edges
hatch(img, (BX0, GF - 14 - 60, BX0 + 26, GROUND), 5, 70)
hatch(img, (BX1 - 26, TOP, BX1, GROUND), 5, 80, cross=True)
hatch(img, (0, 400, 250, GROUND), 7, 46, ang=-1)
hatch(img, (452, 420, 640, GROUND), 7, 46)
hatch(img, (1548, 320, W, GROUND), 7, 50, cross=True)
hatch(img, (0, H - 30, W, H), 6, 50)

# ---- gouache finish: soft brush streaks, low frequency mottling, gentle vignette
arr = np.asarray(img.convert('RGB')).astype(np.float32)
lo = rng.normal(0, 1, (H // 24 + 1, W // 24 + 1)).astype(np.float32)
lo = np.asarray(Image.fromarray(((lo - lo.min()) / (np.ptp(lo) + 1e-6) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)).astype(np.float32) / 255
streak = rng.normal(0, 1, (H, W // 6)).astype(np.float32)
streak = np.asarray(Image.fromarray(((streak - streak.min()) / np.ptp(streak) * 255).astype(np.uint8)).resize((W, H), Image.BILINEAR)
                    .filter(ImageFilter.GaussianBlur(1.2))).astype(np.float32) / 255
fine = rng.normal(0, 1, (H, W)).astype(np.float32)
mod = 1 + (lo - 0.5) * 0.10 + (streak - 0.5) * 0.08 + fine * 0.018
arr = arr * mod[..., None]
yy, xx = np.mgrid[0:H, 0:W]
vig = 1 - 0.22 * (((xx - W / 2) / (W / 2)) ** 2 + ((yy - H * 0.45) / (H * 0.7)) ** 2)
arr = arr * np.clip(vig, 0.72, 1)[..., None]
out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
out = out.filter(ImageFilter.UnsharpMask(1.6, 50, 2))
out.save(os.path.join(D, 'assets', 'loft-night.png'), optimize=True)
print('painted')
