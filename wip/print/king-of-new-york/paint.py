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
src = src.crop((1150, 50, 1960, 970))     # Frank at the theatre bar, head and shoulders, from the TMDB still
PW, PH = 352, 400                         # 2x of 176 x 200
g = src.resize((PW, PH), Image.LANCZOS)
g = ImageOps.autocontrast(g, cutoff=1)
g = g.point(lambda v: int(255 * (v / 255) ** 0.62))
g = ImageEnhance.Contrast(g).enhance(1.22)
# amplitude-modulated screen at 45 degrees, drawn 3x oversize then reduced so the dots stay round
import numpy as np
SS = 3
gs = np.array(g.resize((PW * SS, PH * SS), Image.BICUBIC).filter(ImageFilter.GaussianBlur(0.9 * SS)), np.float32) / 255.0
cell = 3.8 * SS
yy, xx = np.mgrid[0:PH * SS, 0:PW * SS].astype(np.float32)
u = (xx + yy) / math.sqrt(2); v = (xx - yy) / math.sqrt(2)
du = np.mod(u, cell) - cell / 2; dv = np.mod(v, cell) - cell / 2
dist = np.sqrt(du * du + dv * dv)
dark = np.clip(1 - gs, 0, 1)
r = cell * np.sqrt(dark / math.pi) * 1.06
ink = np.clip(r - dist + 0.5 * SS, 0, SS) / SS
dots = Image.fromarray((ink * 255).astype(np.uint8)).resize((PW, PH), Image.LANCZOS)
ht = Image.new('RGBA', (PW, PH), (24, 24, 22, 0)); ht.putalpha(dots.point(lambda v: int(v * 0.92)))
ht.save(os.path.join(A, 'host-halftone.png'))

# ---------------- cover wear (on green stock) ----------------
# A thin, broken rub along the trimmed edges where the stock has scuffed pale, a worn corner at the
# lower right where the journal was held, and a faint glass ring. No spine effects: the stitched
# edge is simply the trimmed edge of the cover.
em = edge_mask(W, H, 5 * S, 1.3)
a = ImageChops.multiply(em, mottle(W, H, 22, 40, 255, 7)).point(lambda v: int(v * 0.55))
cor = Image.new('L', (W, H), 0)
ImageDraw.Draw(cor).ellipse((W - 46 * S, H - 46 * S, W + 30 * S, H + 30 * S), fill=110)
cor = ImageChops.multiply(cor.filter(ImageFilter.GaussianBlur(10 * S)), mottle(W, H, 14, 60, 255, 8))
a = ImageChops.lighter(a, cor)
a = ImageChops.lighter(a, mottle(W, H, 160, 0, 10, 11))
front = Image.new('RGBA', (W, H), (214, 222, 205, 0)); front.putalpha(a)
ring = Image.new('L', (W, H), 0); rg = ImageDraw.Draw(ring)
cx, cy, r = W * 0.86, H * 0.955, 58 * S
rg.ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=6 * S)
rg.ellipse((cx - r + 4 * S, cy - r + 2 * S, cx + r - 3 * S, cy + r - 4 * S), outline=140, width=2 * S)
ring = ring.filter(ImageFilter.GaussianBlur(3.2 * S))
ring = ImageChops.multiply(ring, mottle(W, H, 18, 60, 255, 31)).point(lambda v: int(v * 0.32))
rl = Image.new('RGBA', (W, H), (8, 22, 16, 0)); rl.putalpha(ring)
front = Image.alpha_composite(front, rl)
front.save(os.path.join(A, 'wear-front.png'))

# ---------------- inside page wear (white offset) ----------------
# gentle yellowing in from the trimmed edges and a soft thumb mark at the lower right
em2 = edge_mask(W, H, 34 * S, 1.6)
a2 = ImageChops.multiply(em2, mottle(W, H, 60, 70, 255, 21)).point(lambda v: int(v * 0.26))
a2 = ImageChops.lighter(a2, mottle(W, H, 120, 0, 14, 23))
th = Image.new('L', (W, H), 0)
ImageDraw.Draw(th).ellipse((W - 70 * S, H - 64 * S, W + 10 * S, H + 10 * S), fill=40)
a2 = ImageChops.lighter(a2, th.filter(ImageFilter.GaussianBlur(14 * S)))
back = Image.new('RGBA', (W, H), (160, 128, 70, 0)); back.putalpha(a2)
back.save(os.path.join(A, 'wear-back.png'))

# ---------------- pledge thermometer, a printed line cut ----------------
# Black plate: the glass tube and bulb in pen line with ruled shading, the scale ruled underneath.
# Green plate: the column and the bulb, ruled, printed a hair out of register.
TW, TH = 460, 120                       # 2x of 230 x 60
blk = Image.new('L', (TW, TH), 0); bd = ImageDraw.Draw(blk)
grn = Image.new('L', (TW, TH), 0); gd2 = ImageDraw.Draw(grn)
bx, by, br = 40, 46, 30                 # bulb
t0, t1, ty0, ty1 = 64, 446, 34, 58      # tube
# tube outline, double ruled
bd.rounded_rectangle((bx, ty0, t1, ty1), radius=12, outline=255, width=3)
bd.ellipse((bx - br, by - br, bx + br, by + br), outline=255, width=3)
bd.ellipse((bx - br + 3, by - br + 3, bx + br - 3, by + br - 3), fill=0)   # clear the tube line inside the bulb
bd.rectangle((bx + br - 4, ty0 + 3, bx + br + 2, ty1 - 3), fill=0)         # open the neck
# glass shine: two fine ruled highlights along the empty part of the tube
fill_x = t0 + round((t1 - 14 - t0) * 0.70)
for yy in (ty0 + 7, ty0 + 10):
    bd.line((fill_x + 10, yy, t1 - 16, yy), fill=255, width=1)
# column and bulb in green, ruled with horizontal lines like an engraving
gd2.ellipse((bx - br + 6, by - br + 6, bx + br - 6, by + br - 6), fill=255)
gd2.rectangle((t0 - 6, ty0 + 7, fill_x, ty1 - 7), fill=255)
rule = Image.new('L', (TW, TH), 0); rd2 = ImageDraw.Draw(rule)
for yy in range(0, TH, 4):
    rd2.line((0, yy, TW, yy), fill=255, width=3)
grn = ImageChops.multiply(grn, rule)
gd2 = ImageDraw.Draw(grn)
gd2.arc((bx - 16, by - 18, bx + 8, by + 6), 200, 290, fill=0, width=4)   # highlight on the bulb
gd2.line((fill_x, ty0 + 7, fill_x, ty1 - 7), fill=255, width=3)
# scale: a tick for every million, long ticks at 4, 8, 12 and 16
for i in range(17):
    x = t0 + 10 + round((t1 - 24 - t0) * i / 16)
    ln = 16 if i % 4 == 0 else 8
    bd.line((x, ty1 + 6, x, ty1 + 6 + ln), fill=255, width=3 if i % 4 == 0 else 2)
bd.line((t0 + 10, ty1 + 6, t1 - 14, ty1 + 6), fill=255, width=2)
INKC, GRC = (28, 29, 26), (31, 90, 67)
th_img = Image.new('RGBA', (TW, TH), GRC + (0,))
g2 = Image.new('L', (TW, TH), 0); g2.paste(grn, (3, 2))
th_img.putalpha(g2.filter(ImageFilter.GaussianBlur(0.5)))
bl = Image.new('RGBA', (TW, TH), INKC + (0,)); bl.putalpha(blk.filter(ImageFilter.GaussianBlur(0.5)))
th_img = Image.alpha_composite(th_img, bl)
th_img.save(os.path.join(A, 'thermometer.png'))
print('painted', ht.size, 'thermometer long ticks at display x', [(t0 + 10 + round((t1 - 24 - t0) * i / 16)) / 2 for i in (0, 4, 8, 12, 16)])
