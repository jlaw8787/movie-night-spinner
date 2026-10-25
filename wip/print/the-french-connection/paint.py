"""Paints the assets for the Narcotics Bureau surveillance report (The French Connection, 1971).
The object is copy 2 of a two-page typed report, the green manifold sheet that goes to the bureau
file. Everything here is soft and low-detail:
  wear-p1.png, wear-p2.png  edge yellowing, broad cockle mottling, two punch holes for the file
                            fastener, and on page 2 a paper-cup coffee ring and a pizza grease spot
  photo-frogone.png         the stapled surveillance print: a TMDB still turned into a 1971 black and
                            white glossy, with film grain, soft contrast and a white border
  sketch.png                the observer's ballpoint diagram of the street, drawn with a wobbling hand
"""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FW, FH, S = 816, 1056, 2
W, H = FW * S, FH * S


def mottle(w, h, scale, lo, hi, seed):
    random.seed(seed)
    n = Image.effect_noise((max(2, w // scale), max(2, h // scale)), 60).resize((w, h), Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(scale * 0.6))
    return n.point(lambda v: int(max(0, min(255, lo + (v - 70) / 116 * (hi - lo)))))


def edge_mask(width, power=2.0):
    small = Image.new('L', (W // 8, H // 8), 0)
    px = small.load(); sw, sh = small.size; wd = width / 8
    for y in range(sh):
        for x in range(sw):
            d = min(x, y, sw - 1 - x, sh - 1 - y)
            dc = min(math.hypot(x, y), math.hypot(sw - x, y), math.hypot(x, sh - y), math.hypot(sw - x, sh - y))
            v = max(0.0, 1 - d / wd) ** power
            v = max(v, max(0.0, 1 - dc / (wd * 2.4)) ** 1.5)
            px[x, y] = int(255 * min(1, v))
    return small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))


def punch_holes(img):
    """Two holes for a file fastener, centred 2 3/4 in apart near the top edge."""
    d = ImageDraw.Draw(img)
    for cx in (FW / 2 - 132, FW / 2 + 132):
        cx *= S; cy = 22 * S; r = 9 * S
        # the hole shows the sheet underneath: a little darker, with a soft shadow on the upper rim
        sh = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(sh)
        sd.ellipse((cx - r - 3 * S, cy - r - 3 * S, cx + r + 3 * S, cy + r + 2 * S), fill=70)
        sh = sh.filter(ImageFilter.GaussianBlur(3 * S))
        lay = Image.new('RGBA', (W, H), (60, 66, 52, 0)); lay.putalpha(sh)
        img.alpha_composite(lay)
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=(196, 203, 186, 255))
        d.arc((cx - r, cy - r, cx + r, cy + r), 200, 340, fill=(120, 126, 108, 255), width=2 * S)
    return img


def base_wear(seed):
    em = edge_mask(64 * S, 1.7)
    a = ImageChops.multiply(em, mottle(W, H, 70, 70, 255, seed)).point(lambda v: int(v * 0.40))
    a = ImageChops.lighter(a, mottle(W, H, 140, 0, 26, seed + 1))      # broad cockle in the thin sheet
    img = Image.new('RGBA', (W, H), (150, 128, 60, 0)); img.putalpha(a)
    # one soft horizontal handling crease low on the sheet, light only
    cr = Image.new('L', (W, H), 0); cd = ImageDraw.Draw(cr)
    random.seed(seed + 2)
    y0 = H * 0.62
    cd.line([(0, y0), (W * 0.45, y0 + 6 * S), (W, y0 - 4 * S)], fill=60, width=3 * S)
    cr = cr.filter(ImageFilter.GaussianBlur(5 * S))
    cl = Image.new('RGBA', (W, H), (255, 255, 245, 0)); cl.putalpha(cr.point(lambda v: int(v * 0.5)))
    img.alpha_composite(cl)
    return punch_holes(img)


p1 = base_wear(71)
p1.save(os.path.join(A, 'wear-p1.png'))

p2 = base_wear(171)
# coffee ring from a paper cup set down on the sheet, bottom right, broken and faint
ring = Image.new('L', (W, H), 0); rg = ImageDraw.Draw(ring)
cx, cy, r = W * 0.86, H * 0.585, 44 * S
rg.ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=5 * S)
rg.ellipse((cx - r + 3 * S, cy - r + 4 * S, cx + r - 2 * S, cy + r - 3 * S), outline=120, width=2 * S)
ring = ring.filter(ImageFilter.GaussianBlur(2.6 * S))
ring = ImageChops.multiply(ring, mottle(W, H, 16, 40, 255, 7)).point(lambda v: int(v * 0.34))
fill = Image.new('L', (W, H), 0); ImageDraw.Draw(fill).ellipse((cx - r, cy - r, cx + r, cy + r), fill=26)
fill = fill.filter(ImageFilter.GaussianBlur(6 * S))
rl = Image.new('RGBA', (W, H), (120, 80, 36, 0)); rl.putalpha(ImageChops.lighter(ring, fill))
p2.alpha_composite(rl)
# grease spot from the slice: a soft translucent blotch, left of the expenses
gs = Image.new('L', (W, H), 0); gd = ImageDraw.Draw(gs)
gx, gy = W * 0.055, H * 0.47
gd.ellipse((gx - 22 * S, gy - 16 * S, gx + 26 * S, gy + 20 * S), fill=255)
gd.ellipse((gx + 10 * S, gy + 8 * S, gx + 34 * S, gy + 28 * S), fill=200)
gs = gs.filter(ImageFilter.GaussianBlur(9 * S))
gs = ImageChops.multiply(gs, mottle(W, H, 20, 120, 255, 9)).point(lambda v: int(v * 0.22))
gl = Image.new('RGBA', (W, H), (96, 104, 60, 0)); gl.putalpha(gs)
p2.alpha_composite(gl)
p2.save(os.path.join(A, 'wear-p2.png'))

# ---------------- surveillance print ----------------
src = Image.open(os.path.join(A, 'src-frogone.jpg')).convert('RGB')
sx = src.size[0] / 1280
crop = src.crop(tuple(int(v * sx) for v in (330, 50, 950, 690)))                      # Frog One at the counter, hat to coat
g = ImageOps.grayscale(crop)
g = ImageOps.autocontrast(g, cutoff=1)
g = ImageEnhance.Contrast(g).enhance(1.12)
g = ImageEnhance.Brightness(g).enhance(1.12)
PW, PH = 196 * S, 202 * S
g = g.resize((PW, PH), Image.LANCZOS)
# film grain, fine but soft, then a touch of blur so it reads as a print, not a screen
random.seed(1971)
grain = Image.effect_noise((PW, PH), 26).filter(ImageFilter.GaussianBlur(0.7))
g = ImageChops.add(g, grain.point(lambda v: int((v - 128) * 0.35) + 128), 1, -128)
g = g.filter(ImageFilter.GaussianBlur(0.5))
# slight warm tone of a fibre print
tone = ImageOps.colorize(g, (22, 20, 18), (238, 234, 222))
B = 12 * S
pr = Image.new('RGB', (PW + 2 * B, PH + 2 * B + 10 * S), (240, 238, 230))
pr.paste(tone, (B, B))
# light silvering at the corners of the print
pm = Image.new('L', pr.size, 0); pmd = ImageDraw.Draw(pm)
for (x, y) in ((0, 0), (pr.size[0], 0), (0, pr.size[1]), pr.size):
    pmd.ellipse((x - 40 * S, y - 40 * S, x + 40 * S, y + 40 * S), fill=40)
pm = pm.filter(ImageFilter.GaussianBlur(16 * S))
pr = Image.composite(Image.new('RGB', pr.size, (205, 200, 186)), pr, pm)
pr.save(os.path.join(A, 'photo-frogone.png'))
print('photo', pr.size)

# ---------------- ballpoint diagram ----------------
SW, SH = 300 * S, 262 * S
sk = Image.new('RGBA', (SW, SH), (0, 0, 0, 0))
sd = ImageDraw.Draw(sk)
INK = (38, 52, 120, 235)
random.seed(42)


def wob(pts, w=2, jit=1.6, step=10):
    out = []
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        n = max(2, int(math.hypot(x1 - x0, y1 - y0) / (step * S)))
        for i in range(n):
            t = i / n
            out.append((x0 + (x1 - x0) * t + random.uniform(-jit, jit) * S * 0.5,
                        y0 + (y1 - y0) * t + random.uniform(-jit, jit) * S * 0.5))
    out.append(pts[-1])
    sd.line(out, fill=INK, width=int(w * S), joint='curve')


def P(x, y): return (x * S, y * S)

# building line and the restaurant front, top
wob([P(8, 74), P(292, 72)], 2)
wob([P(70, 20), P(70, 74)], 2); wob([P(232, 18), P(232, 73)], 2)
# the front window, drawn twice over like a pen going back
wob([P(96, 70), P(206, 70)], 3.2, 1.0)
wob([P(98, 66), P(204, 67)], 1.4, 1.2)
# table inside with two seats
sd.ellipse((140 * S, 32 * S, 168 * S, 54 * S), outline=INK, width=2 * S)
for cx in (128, 180):
    sd.ellipse(((cx - 6) * S, 37 * S, (cx + 6) * S, 49 * S), outline=INK, width=2 * S)
# curbs of the street
wob([P(4, 98), P(296, 100)], 1.6, 2)
wob([P(4, 176), P(296, 174)], 1.6, 2)
# far building line, observer side
wob([P(8, 204), P(292, 206)], 2)
# pizza counter, a little box against the far wall
wob([P(30, 204), P(30, 184), P(96, 184), P(96, 204)], 2)
# observer X
wob([P(150, 186), P(166, 200)], 2.4, 0.8); wob([P(166, 186), P(150, 200)], 2.4, 0.8)
# sight line, dashed, across the street to the window
x0, y0, x1, y1 = 158, 182, 154, 76
for i in range(0, 12, 2):
    t0, t1 = i / 12, (i + 1) / 12
    wob([P(x0 + (x1 - x0) * t0, y0 + (y1 - y0) * t0), P(x0 + (x1 - x0) * t1, y0 + (y1 - y0) * t1)], 1.6, 0.6, 4)
# arrow head at the window
wob([P(147, 88), P(154, 77), P(162, 88)], 1.8, 0.6, 4)
# north arrow, small, bottom right
wob([P(270, 252), P(270, 222)], 1.6, 0.6); wob([P(263, 231), P(270, 221), P(277, 231)], 1.6, 0.6, 4)
sk = sk.filter(ImageFilter.GaussianBlur(0.45))
sk.save(os.path.join(A, 'sketch.png'))
print('painted')
