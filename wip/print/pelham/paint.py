"""Paints the printed and prop parts of the Motorman Coffee Shop menu (Pelham One Two Three, 1974).
- assets/photo-halftone.png : TMDB still of the Lexington local pulling in, as a two ink letterpress halftone
- assets/guest-check.png    : the pencilled lunch run guest check, paper clip and PAID stamp baked in
- assets/paper-wear.png     : soft edge wear and big gentle mottling for the card stock
Run once before build.py. Needs the still in /tmp scratch or downloads it from TMDB."""
import os, math, random, subprocess
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets'); F = os.path.join(D, 'fonts')
BROWN = (46, 31, 24); ORANGE = (201, 83, 29)
random.seed(123)

# ---------- 1. the photo: clean crop of the TMDB still, shadows lifted a touch for print ----------
STILL = os.path.join(A, 'src-still.jpg')
if not os.path.exists(STILL):
    subprocess.run(['curl', '-s', '-o', STILL, 'https://image.tmdb.org/t/p/original/syWyIUCzKB0xYiDpKlYbgV7ctGi.jpg'], check=True)
src = Image.open(STILL).convert('RGB')
sw, sh = src.size
ph = src.crop((40, 150, 1240, 150 + int(1200 * 268 / 686)))       # tighter on the platform and the train
from PIL import ImageEnhance
ph = ph.point([int(255 * ((i % 256) / 255) ** 0.62) for i in range(768)])
ph = ImageEnhance.Contrast(ph).enhance(1.12)
ph.resize((1372, 536), Image.LANCZOS).save(os.path.join(A, 'still-platform.jpg'), quality=90)
bd = Image.open(os.path.join(A, 'src-board.jpg')).convert('RGB').crop((0, 0, 1180, 520))
bd = bd.point([int(255 * ((i % 256) / 255) ** 0.8) for i in range(768)])
bd.resize((664, 292), Image.LANCZOS).save(os.path.join(A, 'still-board.jpg'), quality=90)

# ---------- 2. guest check with clip and stamp ----------
SW, SH = 520, 700                      # check paper at 2x (260 x 350 css)
PAD = 70                               # room for the clip above and the shadow
GREEN = (48, 104, 78); PAPER = (234, 240, 224); RED = (196, 46, 38); LEAD = (66, 66, 74)
fh = ImageFont.truetype(os.path.join(F, 'ArchivoNarrow-700.ttf'), 30)
fs = ImageFont.truetype(os.path.join(F, 'ArchivoNarrow-700.ttf'), 18)
fn = ImageFont.truetype(os.path.join(F, 'ArchivoNarrow-700.ttf'), 30)
pen = lambda s: ImageFont.truetype(os.path.join(F, 'ShadowsIntoLight.ttf'), s)

chk = Image.new('RGBA', (SW, SH), PAPER + (255,))
d = ImageDraw.Draw(chk)
# printed form, green ink
d.text((26, 20), 'GUEST CHECK', font=fh, fill=GREEN)
d.text((SW - 26, 22), 'No 0123', font=fn, fill=RED, anchor='ra')
y0 = 66
d.line((0, y0, SW, y0), fill=GREEN, width=3)
cols = [('TABLE', 0), ('TAKE OUT', 150), ('', 300)]
for t, x in cols:
    d.text((x + 10, y0 + 6), t, font=fs, fill=GREEN)
    if x:
        d.line((x, y0, x, y0 + 56), fill=GREEN, width=2)
d.line((0, y0 + 56, SW, y0 + 56), fill=GREEN, width=3)
rows_top, row_h = y0 + 56, 44
for i in range(12):
    yy = rows_top + row_h * (i + 1)
    d.line((0, yy, SW, yy), fill=GREEN + (150,), width=2)
d.line((SW - 112, rows_top, SW - 112, rows_top + row_h * 11), fill=GREEN, width=2)
d.text((26, SH - 40), 'THANK YOU, CALL AGAIN', font=fs, fill=GREEN)
d.text((SW - 26, SH - 40), 'TOTAL', font=fs, fill=GREEN, anchor='ra')

# pencil layer (graphite: grey, a touch of grain)
pl = Image.new('L', (SW, SH), 0)
pd = ImageDraw.Draw(pl)
pd.text((14, y0 + 8 + 4), '', font=pen(30), fill=255)
pd.text((22, y0 + 22), 'Cmd Ctr', font=pen(28), fill=230)
pd.text((170, y0 + 22), 'del.', font=pen(28), fill=230)
lines = [('1 Tky Swiss hero', '1.23', 'Garber'), ('1 Coffee reg', '.25', ''),
         ('1 Tky Swiss hero', '1.23', 'Patrone'), ('1 Egg cream', '.35', ''),
         ('2 Cheese danish', '.80', 'Correll'), ('1 Coffee BLACK', '.25', ''),
         ('6 Coffee, Tokyo visitors', '1.50', '')]
for i, (it, pr, who) in enumerate(lines):
    yy = rows_top + row_h * i + 2
    jit = random.uniform(-2, 2)
    pd.text((18 + jit, yy + jit), it, font=pen(31), fill=random.randint(205, 240))
    pd.text((SW - 22, yy + 1), pr, font=pen(31), fill=225, anchor='ra')
    if who:
        w = pd.textlength(it, font=pen(31))
        pd.text((18 + w + 14, yy + 4), who, font=pen(25), fill=180)
yy = rows_top + row_h * 8 + 6
pd.text((18, yy), 'Inside the hour!', font=pen(31), fill=225)
pd.text((SW - 22, rows_top + row_h * 11 + 8), '5.61', font=pen(36), fill=240, anchor='ra')
pd.line((SW - 100, rows_top + row_h * 11 + 50, SW - 20, rows_top + row_h * 11 + 47), fill=200, width=2)
# graphite texture: break up the strokes a little, low detail
noise = Image.effect_noise((SW // 2, SH // 2), 60).resize((SW, SH), Image.BILINEAR)
pl = ImageChops.multiply(pl, noise.point(lambda v: min(255, 150 + v)))
lead = Image.new('RGBA', (SW, SH), LEAD + (0,)); lead.putalpha(pl)
chk.alpha_composite(lead)

# PAID rubber stamp, red, rotated, inked unevenly
st = Image.new('L', (230, 100), 0)
sd = ImageDraw.Draw(st)
sd.rounded_rectangle((4, 4, 225, 95), radius=10, outline=255, width=6)
sd.text((115, 52), 'PAID', font=ImageFont.truetype(os.path.join(F, 'ArchivoNarrow-700.ttf'), 72), fill=255, anchor='mm')
mott = Image.effect_noise((58, 25), 90).resize((230, 100), Image.BICUBIC).point(lambda v: 255 if v > 70 else int(v * 2.6))
st = ImageChops.multiply(st, mott).rotate(-14, resample=Image.BICUBIC, expand=True)
stamp = Image.new('RGBA', st.size, RED + (0,)); stamp.putalpha(st.point(lambda v: int(v * .82)))
chk.alpha_composite(stamp, (40, rows_top + row_h * 9 - 6))

# soft paper wear on the check: a faint fold line and darker edges
wear = Image.new('L', (SW, SH), 0)
wd = ImageDraw.Draw(wear)
wd.rectangle((0, 0, SW - 1, SH - 1), outline=60, width=10)
wear = wear.filter(ImageFilter.GaussianBlur(10))
shade = Image.new('RGBA', (SW, SH), (120, 110, 80, 0)); shade.putalpha(wear)
chk.alpha_composite(shade)
# ragged top edge where it tore off the pad
mask = Image.new('L', (SW, SH), 255)
md = ImageDraw.Draw(mask)
for x in range(0, SW, 3):
    md.line((x, 0, x, random.choice([0, 1, 2, 3, 4])), fill=0)
chk.putalpha(ImageChops.multiply(chk.split()[3], mask))

# compose on a canvas with room for clip and shadow, then rotate a little
CW, CH = SW + PAD * 2, SH + PAD * 2
can = Image.new('RGBA', (CW, CH), (0, 0, 0, 0))
sh_ = Image.new('L', (CW, CH), 0)
sh_.paste(chk.split()[3].point(lambda v: int(v * .30)), (PAD + 5, PAD + 8))
sh_ = sh_.filter(ImageFilter.GaussianBlur(9))
shadow = Image.new('RGBA', (CW, CH), (40, 28, 20, 0)); shadow.putalpha(sh_)
can.alpha_composite(shadow)
can.alpha_composite(chk, (PAD, PAD))


def clip_layer():
    """A steel paper clip, drawn as a wire with a dark edge and a highlight, 4x supersampled."""
    S = 4
    w, h = 76, 196
    L = Image.new('RGBA', (w * S, h * S), (0, 0, 0, 0))
    dr = ImageDraw.Draw(L)

    def loop(x0, x1, ytop, ybot):
        r = (x1 - x0) / 2
        pts = []
        for a in range(180, 361, 6):
            t = math.radians(a)
            pts.append((x0 + r + r * math.cos(t), ytop + r + r * math.sin(t)))
        return pts, r

    def path():
        # outer wire: down the left, round the top, down the right, round the bottom, up the inner
        P = []
        top, r = loop(8, 68, 8, 0)
        P += [(8, 150)] + top + [(68, 160)]
        for a in range(0, 181, 6):
            t = math.radians(a)
            P.append((48 + 20 * math.cos(t), 160 + 20 * math.sin(t)))
        P += [(28, 160), (28, 40)]
        for a in range(180, 361, 6):
            t = math.radians(a)
            P.append((40 + 12 * math.cos(t), 40 + 12 * math.sin(t)))
        P += [(52, 130)]
        return [(x * S, y * S) for x, y in P]

    p = path()
    dr.line(p, fill=(92, 94, 100, 255), width=7 * S, joint='curve')
    dr.line(p, fill=(168, 172, 178, 255), width=5 * S, joint='curve')
    dr.line([(x - 1.2 * S, y - 1.2 * S) for x, y in p], fill=(232, 234, 236, 255), width=int(1.6 * S), joint='curve')
    return L.resize((w, h), Image.LANCZOS)


cl = clip_layer()
csh = Image.new('RGBA', cl.size, (30, 20, 10, 0)); csh.putalpha(cl.split()[3].point(lambda v: int(v * .35)).filter(ImageFilter.GaussianBlur(3)))
cx, cy = PAD + 334, PAD - 46
can.alpha_composite(csh, (cx + 4, cy + 5))
can.alpha_composite(cl, (cx, cy))
can = can.rotate(3.2, resample=Image.BICUBIC, expand=False)
can.save(os.path.join(A, 'guest-check.png'))
print('guest check', can.size)

print('done')
