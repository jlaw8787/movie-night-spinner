"""Paints the assets for the South Bronx hospital benefit journal (King of New York, 1990).
The object is the souvenir journal handed out at the benefit dinner Frank White hosts to keep the
South Bronx hospital open: a saddle-stitched letter-size booklet with a green cover stock printed
in silver and white, and plain white offset pages inside printed black and green.
The cover line cut of the hospital is engraved separately by linecut.py.
Writes:
  assets/host-halftone.png  Frank's portrait as a coarse newspaper-style dot screen, black ink
  assets/wear-front.png  soft edge rub, spine crease, staples and a faint glass ring on the cover
  assets/wear-back.png   gutter shadow, staple and gentle edge yellowing on the inside page
"""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FW, FH, S = 816, 1056, 2
W, H = FW * S, FH * S
SILVER = (196, 201, 194)
WHITE = (243, 241, 232)

def mottle(w, h, scale, lo, hi, seed):
    random.seed(seed)
    n = Image.effect_noise((max(2, w // scale), max(2, h // scale)), 60).resize((w, h), Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(scale * 0.6))
    return n.point(lambda v: int(max(0, min(255, lo + (v - 70) / 116 * (hi - lo)))))

def edge_mask(w, h, width, power=2.0):
    m = Image.new('L', (w // 4, h // 4), 0)
    px = m.load(); ww, hh = m.size; wd = width / 4
    for y in range(hh):
        for x in range(ww):
            d = min(x, y, ww - 1 - x, hh - 1 - y)
            dc = min(math.hypot(x, y), math.hypot(ww - x, y), math.hypot(x, hh - y), math.hypot(ww - x, hh - y))
            v = max(0.0, 1 - d / wd) ** power
            v = max(v, max(0.0, 1 - dc / (wd * 2.2)) ** 1.6)
            px[x, y] = int(255 * min(1, v))
    return m.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6))

# ---------------- host portrait halftone ----------------
src = Image.open(os.path.join(D, 'src', 'still-host.jpg')).convert('L')
src = src.crop((330, 0, 1460, 1080))      # head and shoulders, 950 x 1080
PW, PH = 440, 420                         # 2x of 220 x 210
g = src.resize((PW, PH), Image.LANCZOS)
g = ImageOps.autocontrast(g, cutoff=2)
g = g.point(lambda v: int(255 * (v / 255) ** 0.72))
g = ImageEnhance.Contrast(g).enhance(1.12)
big = 3 * max(PW, PH)
canvas = Image.new('L', (big, big), 255)
canvas.paste(g, ((big - PW) // 2, (big - PH) // 2))
rot = canvas.rotate(45, resample=Image.BICUBIC, fillcolor=255)
dots = Image.new('L', (big, big), 0)
dd = ImageDraw.Draw(dots)
cell = 5.0
px = rot.load()
y = 0.0
while y < big:
    x = 0.0
    while x < big:
        cx, cy = int(x + cell / 2), int(y + cell / 2)
        if 0 <= cx < big and 0 <= cy < big:
            dark = 1 - px[cx, cy] / 255
            r = cell * 0.6 * math.sqrt(dark)
            if r > 0.35:
                dd.ellipse((x + cell / 2 - r, y + cell / 2 - r, x + cell / 2 + r, y + cell / 2 + r), fill=255)
        x += cell
    y += cell
dots = dots.rotate(-45, resample=Image.BICUBIC).crop(((big - PW) // 2, (big - PH) // 2, (big + PW) // 2, (big + PH) // 2))
ht = Image.new('RGBA', (PW, PH), (24, 24, 22, 0)); ht.putalpha(dots.point(lambda v: int(v * 0.92)))
ht.save(os.path.join(A, 'host-halftone.png'))

# ---------------- cover wear (on green stock) ----------------
em = edge_mask(W, H, 12 * S, 1.8)
a = ImageChops.multiply(em, mottle(W, H, 50, 90, 255, 7)).point(lambda v: int(v * 0.30))
# spine crease along the left fold, a soft light line where the ink cracked
sp = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(sp)
sd.rectangle((0, 0, 7 * S, H), fill=150)
sp = sp.filter(ImageFilter.GaussianBlur(4 * S))
sp = ImageChops.multiply(sp, mottle(W, H, 30, 120, 255, 9))
a = ImageChops.lighter(a, sp)
a = ImageChops.lighter(a, mottle(W, H, 160, 0, 12, 11))
front = Image.new('RGBA', (W, H), (214, 222, 205, 0)); front.putalpha(a)
# faint glass ring, darker where the wet base sat, low on the cover and mostly off the type
ring = Image.new('L', (W, H), 0); rg = ImageDraw.Draw(ring)
cx, cy, r = W * 0.86, H * 0.955, 58 * S
rg.ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=6 * S)
rg.ellipse((cx - r + 4 * S, cy - r + 2 * S, cx + r - 3 * S, cy + r - 4 * S), outline=140, width=2 * S)
ring = ring.filter(ImageFilter.GaussianBlur(3.2 * S))
ring = ImageChops.multiply(ring, mottle(W, H, 18, 60, 255, 31)).point(lambda v: int(v * 0.32))
rl = Image.new('RGBA', (W, H), (8, 22, 16, 0)); rl.putalpha(ring)
front = Image.alpha_composite(front, rl)
# two staple ends showing on the spine
st = Image.new('RGBA', (W, H), (0, 0, 0, 0)); sdd = ImageDraw.Draw(st)
for yy in (FH * 0.25, FH * 0.75):
    y0 = int(yy * S)
    sdd.rectangle((1 * S, y0 - 22 * S, 4 * S, y0 + 22 * S), fill=(178, 182, 178, 235))
    sdd.rectangle((1 * S, y0 - 22 * S, 2 * S, y0 + 22 * S), fill=(220, 224, 220, 235))
front = Image.alpha_composite(front, st)
front.save(os.path.join(A, 'wear-front.png'))

# ---------------- inside page wear (white offset) ----------------
em2 = edge_mask(W, H, 64 * S, 1.9)
a2 = ImageChops.multiply(em2, mottle(W, H, 70, 60, 255, 21)).point(lambda v: int(v * 0.30))
a2 = ImageChops.lighter(a2, mottle(W, H, 120, 0, 16, 23))
back = Image.new('RGBA', (W, H), (160, 128, 70, 0)); back.putalpha(a2)
# gutter shadow at the left where the page curves into the staples
gs = Image.new('L', (W, H), 0); gd = ImageDraw.Draw(gs)
for x in range(0, 30 * S):
    gd.line((x, 0, x, H), fill=int(70 * (1 - x / (30 * S)) ** 2))
gs = gs.filter(ImageFilter.GaussianBlur(2 * S))
gl = Image.new('RGBA', (W, H), (60, 58, 50, 0)); gl.putalpha(gs)
back = Image.alpha_composite(back, gl)
st2 = Image.new('RGBA', (W, H), (0, 0, 0, 0)); s2 = ImageDraw.Draw(st2)
for yy in (FH * 0.25, FH * 0.75):
    y0 = int(yy * S)
    s2.rectangle((2 * S, y0 - 22 * S, 4 * S, y0 + 22 * S), fill=(150, 152, 150, 210))
back = Image.alpha_composite(back, st2)
back.save(os.path.join(A, 'wear-back.png'))
print('painted', ht.size)
