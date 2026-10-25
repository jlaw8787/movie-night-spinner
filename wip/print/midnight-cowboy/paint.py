"""Paints the art for the Silver Palm Coaches timetable (Midnight Cowboy, 1969).
assets/coach-art.png    cover picture: a stainless intercity coach on the coast road under palms,
                        flat offset colours (sky aqua, tangerine, black, silver), no people.
assets/pencil-ring.png  a soft graphite ring, someone circled the midnight departure.
assets/wear-outside.png / wear-inside.png  soft edge yellowing, two fold creases, pocket wear.
assets/paper-grain.png  shared grain, copied from the Jurassic kit.
Everything is drawn at 4x and scaled down for clean edges."""
import os, math, random, shutil
from PIL import Image, ImageDraw, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets'); os.makedirs(A, exist_ok=True)
shutil.copy('/home/claude/polish/wip/print/jurassic/src/assets/paper-grain.png', os.path.join(A, 'paper-grain.png'))

PAPER = (246, 241, 228)
INK = (29, 27, 25)
ORANGE = (231, 98, 38)
YEL = (241, 186, 52)
SKY = (98, 178, 196)
SKY2 = (150, 205, 214)
SEA = (40, 128, 150)
SAND = (236, 214, 160)
SILVER = (206, 208, 206)
SILVER_D = (150, 154, 155)
GLASS = (34, 52, 58)

# ---------------- cover art: 352 x 330 css px, painted at 4x ----------------
S = 4
W, H = 352 * S, 330 * S
im = Image.new('RGB', (W, H), PAPER)
d = ImageDraw.Draw(im)

# sky in two flat bands, like a two-pass offset job
d.rectangle([0, 0, W, int(H * 0.30)], fill=SKY)
d.rectangle([0, int(H * 0.30), W, int(H * 0.52)], fill=SKY2)
# a few flat clouds
for cx, cy, r in ((70, 52, 26), (100, 46, 32), (134, 56, 22), (250, 88, 18), (272, 82, 24), (296, 90, 16)):
    d.ellipse([(cx - r) * S, (cy - r * 0.55) * S, (cx + r) * S, (cy + r * 0.55) * S], fill=PAPER)
d.rectangle([40 * S, 56 * S, 160 * S, 64 * S], fill=PAPER)
d.rectangle([232 * S, 90 * S, 316 * S, 96 * S], fill=PAPER)
# sea and sand
d.rectangle([0, int(H * 0.52), W, int(H * 0.62)], fill=SEA)
for y in (0.555, 0.59):
    for x0 in range(0, 352, 46):
        d.rectangle([(x0 + 8) * S, int(H * y), (x0 + 30) * S, int(H * y) + 2 * S], fill=SKY2)
d.rectangle([0, int(H * 0.62), W, int(H * 0.70)], fill=SAND)

def palm(x, base, height, lean, scale=1.0):
    """trunk from (x, base) curving by lean, crown of fronds"""
    pts = []
    for i in range(41):
        t = i / 40
        pts.append((x + lean * t * t, base - height * t))
    for i in range(40):
        (x1, y1), (x2, y2) = pts[i], pts[i + 1]
        w = (9 - 4 * i / 40) * scale
        d.line([(x1 * S, y1 * S), (x2 * S, y2 * S)], fill=INK, width=int(w * S))
    # trunk rings
    for i in range(3, 40, 4):
        x1, y1 = pts[i]
        w = (9 - 4 * i / 40) * scale
        d.line([((x1 - w / 2) * S, y1 * S), ((x1 + w / 2) * S, (y1 + 1.5) * S)], fill=PAPER, width=int(1.2 * S))
    tx, ty = pts[-1]
    for ang, ln in ((-170, 58), (-140, 64), (-110, 50), (-75, 46), (-40, 62), (-10, 60), (20, 46), (160, 44), (195, 48)):
        a = math.radians(ang)
        ln *= scale
        # frond as a curved leaf: spine bends downward
        spine = []
        for j in range(21):
            t = j / 20
            sx = tx + math.cos(a) * ln * t
            sy = ty + math.sin(a) * ln * t + (ln * 0.55) * t * t
            spine.append((sx, sy))
        left, right = [], []
        for j, (sx, sy) in enumerate(spine):
            t = j / 20
            wdt = 7 * scale * math.sin(math.pi * min(1, t * 1.15)) + 0.6
            if j < 20:
                nx, ny = spine[j + 1][0] - sx, spine[j + 1][1] - sy
            else:
                nx, ny = sx - spine[j - 1][0], sy - spine[j - 1][1]
            nl = math.hypot(nx, ny) or 1
            px, py = -ny / nl, nx / nl
            left.append(((sx + px * wdt) * S, (sy + py * wdt) * S))
            right.append(((sx - px * wdt * 0.5) * S, (sy - py * wdt * 0.5) * S))
        d.polygon(left + right[::-1], fill=INK)
        # notches in the frond
        for j in range(4, 19, 3):
            sx, sy = spine[j]
            d.line([(sx * S, sy * S), left[j]], fill=SKY2 if sy < H * 0.52 / S else SEA, width=int(1.1 * S))
    d.ellipse([(tx - 6 * scale) * S, (ty - 3 * scale) * S, (tx + 6 * scale) * S, (ty + 7 * scale) * S], fill=INK)

palm(56, 236, 150, 22, 1.0)
palm(300, 236, 118, -16, 0.85)
palm(330, 236, 160, 12, 1.05)

# road
d.rectangle([0, int(H * 0.70), W, H], fill=(88, 88, 84))
for x0 in range(-10, 352, 40):
    d.rectangle([x0 * S, int(H * 0.86), (x0 + 22) * S, int(H * 0.86) + 3 * S], fill=YEL)
d.rectangle([0, int(H * 0.70), W, int(H * 0.70) + 3 * S], fill=PAPER)

# the coach, facing right, flat-roof stainless body
bx0, bx1 = 22, 330         # css px
by0, by1 = 152, 252
r = 14
d.rounded_rectangle([bx0 * S, by0 * S, bx1 * S, by1 * S], radius=r * S, fill=SILVER)
# fluted lower panels
for y in range(206, 244, 5):
    d.rectangle([(bx0 + 4) * S, y * S, (bx1 - 6) * S, (y + 1.6) * S], fill=SILVER_D)
# livery stripes under the windows
d.rectangle([bx0 * S, 192 * S, bx1 * S, 199 * S], fill=ORANGE)
d.rectangle([bx0 * S, 199 * S, bx1 * S, 203 * S], fill=YEL)
# window band
d.rounded_rectangle([(bx0 + 8) * S, 162 * S, (bx1 - 4) * S, 188 * S], radius=5 * S, fill=GLASS)
for x in range(bx0 + 44, bx1 - 40, 30):
    d.rectangle([x * S, 162 * S, (x + 3) * S, 188 * S], fill=SILVER)
# windscreen sweeps down at the nose
d.polygon([((bx1 - 34) * S, 162 * S), ((bx1 - 4) * S, 162 * S), ((bx1 - 1) * S, 196 * S), ((bx1 - 30) * S, 196 * S)], fill=GLASS)
d.rectangle([(bx1 - 36) * S, 162 * S, (bx1 - 33) * S, 196 * S], fill=SILVER)
# destination sign box (text goes on in HTML)
d.rectangle([(bx1 - 92) * S, 149 * S, (bx1 - 8) * S, 163 * S], fill=INK)
from PIL import ImageFont
f = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 11 * S)
d.text(((bx1 - 50) * S, 156.5 * S), 'MIAMI', font=f, fill=YEL, anchor='mm')
# door at the front
d.rectangle([(bx1 - 66) * S, 204 * S, (bx1 - 40) * S, 248 * S], fill=SILVER_D)
d.rectangle([(bx1 - 64) * S, 206 * S, (bx1 - 54) * S, 230 * S], fill=GLASS)
d.rectangle([(bx1 - 52) * S, 206 * S, (bx1 - 42) * S, 230 * S], fill=GLASS)
# baggage bay doors
for x in (110, 170):
    d.rectangle([x * S, 208 * S, (x + 50) * S, 244 * S], outline=SILVER_D, width=2 * S)
# headlamp and bumper
d.ellipse([(bx1 - 12) * S, 226 * S, (bx1 - 2) * S, 236 * S], fill=YEL)
d.rectangle([(bx1 - 22) * S, 244 * S, (bx1 + 4) * S, 252 * S], fill=INK)
d.rectangle([(bx0 - 2) * S, 244 * S, (bx0 + 16) * S, 252 * S], fill=INK)
# wheels
for wx in (78, 278):
    d.ellipse([(wx - 21) * S, 232 * S, (wx + 21) * S, 274 * S], fill=INK)
    d.ellipse([(wx - 10) * S, 243 * S, (wx + 10) * S, 263 * S], fill=SILVER)
    d.ellipse([(wx - 4) * S, 249 * S, (wx + 4) * S, 257 * S], fill=SILVER_D)
# wheel arches
for wx in (78, 278):
    d.pieslice([(wx - 25) * S, 228 * S, (wx + 25) * S, 278 * S], 180, 360, fill=None, outline=INK, width=2 * S)
# shadow on road
d.rectangle([(bx0 + 6) * S, 274 * S, (bx1 - 6) * S, 278 * S], fill=(48, 48, 46))

art = im.resize((352 * 2, 330 * 2), Image.LANCZOS)
art.save(os.path.join(A, 'coach-art.png'))

# ---------------- pencil ring ----------------
PW, PH = 150, 54
pr = Image.new('L', (PW * S, PH * S), 0)
pd = ImageDraw.Draw(pr)
random.seed(7)
pts = []
for i in range(0, 400):
    t = i / 360 * 2 * math.pi
    rx = (PW / 2 - 6) * (1 + 0.02 * math.sin(3 * t))
    ry = (PH / 2 - 6) * (1 + 0.04 * math.cos(2 * t))
    x = PW / 2 + rx * math.cos(t - 0.15) + (i / 400) * 4
    y = PH / 2 + ry * math.sin(t - 0.15) - (i / 400) * 3
    pts.append((x * S, y * S))
for i in range(len(pts) - 1):
    w = 1.6 + 0.7 * math.sin(i / 37)
    pd.line([pts[i], pts[i + 1]], fill=int(150 + 60 * math.sin(i / 23) ** 2), width=int(w * S))
pr = pr.filter(ImageFilter.GaussianBlur(1.2)).resize((PW * 2, PH * 2), Image.LANCZOS)
ring = Image.new('RGBA', pr.size, (70, 70, 74, 0))
ring.putalpha(pr.point(lambda v: int(v * 0.85)))
ring.save(os.path.join(A, 'pencil-ring.png'))

# ---------------- wear: soft, low-detail ----------------
FW, FH = 1056, 816
def wear(name, seed, dog):
    random.seed(seed)
    w, h = FW // 2, FH // 2     # painted small, scaled up = soft
    a = Image.new('L', (w, h), 0)
    ad = ImageDraw.Draw(a)
    # edge yellowing
    for i in range(18):
        v = int(70 * (1 - i / 18) ** 2)
        ad.rectangle([i, i, w - 1 - i, h - 1 - i], outline=v)
    # big gentle mottling
    for _ in range(14):
        x, y, rr = random.randint(0, w), random.randint(0, h), random.randint(40, 110)
        ad.ellipse([x - rr, y - rr, x + rr, y + rr], fill=random.randint(8, 18))
    a = a.filter(ImageFilter.GaussianBlur(22))
    tint = Image.new('RGBA', (w, h), (176, 140, 70, 0)); tint.putalpha(a)
    tint = tint.resize((FW, FH), Image.LANCZOS)
    # fold creases at the two panel lines: a soft shadow and a hairline highlight
    cr = Image.new('RGBA', (FW, FH), (0, 0, 0, 0))
    cd = ImageDraw.Draw(cr)
    for fx in (352, 704):
        for k, al in ((-3, 6), (-2, 12), (-1, 22), (0, 30), (1, 10)):
            cd.line([(fx + k, 0), (fx + k, FH)], fill=(80, 60, 30, al))
        cd.line([(fx + 2, 0), (fx + 2, FH)], fill=(255, 255, 250, 40))
    cr = cr.filter(ImageFilter.GaussianBlur(0.8))
    # a pocket rub along the cover's lower corner area
    if dog:
        rub = Image.new('L', (FW, FH), 0)
        rd = ImageDraw.Draw(rub)
        rd.ellipse([FW - 260, FH - 150, FW + 120, FH + 120], fill=26)
        rd.ellipse([-120, -100, 200, 120], fill=18)
        rub = rub.filter(ImageFilter.GaussianBlur(40))
        rt = Image.new('RGBA', (FW, FH), (150, 120, 70, 0)); rt.putalpha(rub)
        tint = Image.alpha_composite(tint, rt)
    out = Image.alpha_composite(tint, cr)
    out.save(os.path.join(A, f'wear-{name}.png'))

wear('outside', 3, True)
wear('inside', 5, False)
print('painted')
