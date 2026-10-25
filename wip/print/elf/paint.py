"""Paints the Elf placemat art: the four main food groups wheel (signature), the Christmas spirit gauge,
the fur trim for the header band, and the street still crop. Run before build.py."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
GF = os.path.join(D, 'fonts', 'Grandstander-900.ttf')
NF = os.path.join(D, 'fonts', 'Nunito-800.ttf')
GREEN = np.array([24, 96, 56.]); DKGREEN = np.array([14, 58, 34.]); RED = np.array([196, 30, 44.])
SNOW = np.array([252, 250, 244.]); INK = np.array([22, 44, 30.])
rng = np.random.default_rng(2003)


class Canvas:
    """Float RGB canvas with painter-style compositing, gouache mottling and ink outlines."""
    def __init__(s, w, h, bg=None):
        s.w, s.h = w, h
        s.rgb = np.zeros((h, w, 3)); s.a = np.zeros((h, w))
        if bg is not None: s.rgb[:] = bg; s.a[:] = 1
        s.yy, s.xx = np.mgrid[0:h, 0:w].astype(float)

    def put(s, mask, col, outline=6, ink=INK, alpha=1.0):
        m = mask.astype(float) * alpha
        if outline:
            ring = ndimage.binary_dilation(mask, iterations=outline) & ~mask
            s.rgb[ring] = ink; s.a[ring] = 1
        s.rgb = s.rgb * (1 - m[..., None]) + col * m[..., None]
        s.a = np.maximum(s.a, m)

    def image(s, size=None):
        im = Image.fromarray(np.dstack([s.rgb.clip(0, 255), s.a[..., None] * 255]).astype('uint8'), 'RGBA')
        return im.resize(size, Image.LANCZOS) if size else im


def mottle(h, w, scale, amp, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale)))
    big = np.asarray(Image.fromarray((small * 255).astype('uint8')).resize((w, h), Image.BICUBIC), float) / 255
    return (big - 0.5) * 2 * amp


# ------------------------------------------------------------------ the wheel
N = 1880; C = N / 2
cv = Canvas(N, N)
r = np.hypot(cv.xx - C, cv.yy - C); th = np.arctan2(cv.yy - C, cv.xx - C)
R_OUT, R_TXT_IN, R_IN = 920, 760, 732
cv.put(r < R_OUT, GREEN, outline=0)
cv.rgb += (mottle(N, N, 60, 7, 1))[..., None] * (r < R_OUT)[..., None]
# candy stripe ring between text band and the plate
ring = (r >= R_IN) & (r < R_TXT_IN)
stripe = ((th / (2 * math.pi) * 96 + (r - R_IN) / 40) % 1) < 0.5
cv.put(ring & stripe, RED, outline=0); cv.put(ring & ~stripe, SNOW, outline=0)
# plate: four quadrants, alternating mint and blush, soft light from top left
plate = r < R_IN
q = ((cv.xx > C).astype(int) + 2 * (cv.yy > C).astype(int))
tints = {0: np.array([231, 242, 232.]), 1: np.array([250, 230, 226.]), 2: np.array([250, 230, 226.]), 3: np.array([231, 242, 232.])}
for k, t in tints.items():
    cv.put(plate & (q == k), t, outline=0)
shade = (1 - r / R_IN) * 10 - ((cv.xx - C) + (cv.yy - C)) / N * 10
cv.rgb += (shade + mottle(N, N, 90, 4, 5))[..., None] * plate[..., None]
cross = plate & ((np.abs(cv.xx - C) < 9) | (np.abs(cv.yy - C) < 9))
cv.put(cross, DKGREEN, outline=0)
cv.put((r > R_IN - 4) & (r < R_IN + 3), DKGREEN, outline=0)
cv.put((r > R_TXT_IN - 3) & (r < R_TXT_IN + 3), DKGREEN, outline=0)

LX, LY, LZ = -0.55, -0.6, 0.58


def shade_cyl(p):
    """p in [-1,1] across a tube: soft gouache light from the top left plus a hard white highlight."""
    nz = np.sqrt(np.clip(1 - p * p, 0, 1))
    lit = np.clip(-0.55 * p + 0.75 * nz, 0, 1)
    return 0.55 + 0.5 * lit, np.clip(1 - np.abs(p + 0.45) / 0.12, 0, 1)


def cane(pts_fn, rad, steps=900, seed=0):
    pts = [pts_fn(t / steps) for t in range(steps + 1)]
    s_acc = 0
    for i in range(1, len(pts)):
        (x0, y0), (x1, y1) = pts[i - 1], pts[i]
        L = math.hypot(x1 - x0, y1 - y0); s_acc += L
        if L == 0: continue
        tx, ty = (x1 - x0) / L, (y1 - y0) / L; nx, ny = -ty, tx
        xa, xb, ya, yb = int(x1 - rad - 8), int(x1 + rad + 9), int(y1 - rad - 8), int(y1 + rad + 9)
        dx = cv.xx[ya:yb, xa:xb] - x1; dy = cv.yy[ya:yb, xa:xb] - y1
        d = np.hypot(dx, dy)
        inside = d < rad; edge = (d >= rad) & (d < rad + 6)
        p = (dx * nx + dy * ny) / rad
        a = dx * tx + dy * ty
        u = ((s_acc + a + p * rad * 1.1) / 74) % 1
        col = np.where((u < 0.36)[..., None], RED, np.where(((u > 0.52) & (u < 0.6))[..., None], GREEN, SNOW))
        lit, hi = shade_cyl(np.clip(p, -1, 1))
        col = col * lit[..., None]
        col = col + (255 - col) * (hi[..., None] * 0.85)
        sub = cv.rgb[ya:yb, xa:xb]; cs = CANE[ya:yb, xa:xb]
        sub[edge & ~cs] = INK
        sub[inside] = col[inside]; cs[inside] = True


def hook(cx, cy, length, hr, ang, flip=1):
    ca, sa = math.cos(ang), math.sin(ang)
    def f(t):
        shaft = length / (length + math.pi * hr)
        if t < shaft:
            lx, ly = 0, length * (1 - t / shaft)
        else:
            u = (t - shaft) / (1 - shaft) * math.pi
            lx, ly = flip * (hr - hr * math.cos(u)), -hr * math.sin(u)
        return cx + lx * ca - ly * sa, cy + lx * sa + ly * ca
    return f


# Quadrant TR: candy canes, crossed
CANE = np.zeros((N, N), bool)
cane(hook(1120, 560, 330, 92, math.radians(-16)), 32)
CANE[:] = False
cane(hook(1450, 560, 330, 96, math.radians(18), flip=-1), 34)
CANE[:] = False
cane(hook(1290, 520, 360, 84, math.radians(3)), 30)

# Quadrant BL: candy corn, a little heap
def kernel(cx, cy, size, ang):
    ca, sa = math.cos(ang), math.sin(ang)
    lx = (cv.xx - cx) * ca + (cv.yy - cy) * sa
    ly = -(cv.xx - cx) * sa + (cv.yy - cy) * ca
    y = (ly / size + 0.55)
    wd = 0.42 * size * (0.06 + 0.94 * np.clip(y, 0, 1) ** 0.62) * (1 - 0.25 * np.clip((y - 0.85) / 0.15, 0, 1) ** 2)
    base = 1.0 + 0.06 * (1 - (lx / (0.42 * size)) ** 2)
    m = (y > 0) & (y < base) & (np.abs(lx) < wd)
    tip = np.hypot(lx, (y - 0.06) * size) < 0.08 * size
    m = (m & (y > 0.05)) | tip
    band = np.where(y < 0.36, 0, np.where(y < 0.68, 1, 2))
    cols = np.array([[250, 246, 236], [236, 120, 30], [248, 196, 40]], float)
    col = cols[band]
    nx = np.clip(lx / np.maximum(wd, 1), -1, 1)
    lit, hi = shade_cyl(nx)
    col = col * (0.82 + 0.25 * (lit[..., None] - 0.55))
    col = col + (255 - col) * hi[..., None] * 0.6
    cv.put(m, col, outline=5)

for (x, y, s_, a) in [(430, 1150, 170, 70), (860, 1130, 160, -30), (470, 1300, 200, -20), (690, 1240, 210, 18),
                      (370, 1440, 180, -52), (800, 1400, 190, 44), (590, 1450, 210, 4)]:
    kernel(x, y, s_, math.radians(a))

# Quadrant TL: candy. Peppermint swirls, gumdrops, a wrapped candy
def peppermint(cx, cy, rad, wrap=False, spin=0.0):
    d = np.hypot(cv.xx - cx, cv.yy - cy); t = np.arctan2(cv.yy - cy, cv.xx - cx)
    if wrap:
        for sgn in (-1, 1):
            ex = cx + sgn * rad * 1.05
            dx = (cv.xx - ex) * sgn; dy = cv.yy - cy
            fan = (dx > -rad * 0.2) & (dx < rad * 0.75) & (np.abs(dy) < rad * 0.2 + dx * 0.75)
            crink = (np.sin(np.arctan2(dy, dx + rad * 0.3) * 18) > 0.6)
            col = np.where(crink[..., None], np.array([226, 236, 238.]), np.array([246, 250, 250.]))
            cv.put(fan, col, outline=4)
    m = d < rad
    sw = np.sin(8 * (t + spin) + d / rad * 2.4) > 0.05
    col = np.where(sw[..., None], RED, SNOW)
    nz = np.sqrt(np.clip(1 - (d / rad) ** 2, 0, 1))
    lit = 0.7 + 0.35 * np.clip(-((cv.xx - cx) * 0.55 + (cv.yy - cy) * 0.6) / rad + nz * 0.5, -1, 1)
    col = col * lit[..., None]
    hi = np.clip(1 - np.hypot(cv.xx - (cx - rad * 0.4), cv.yy - (cy - rad * 0.42)) / (rad * 0.22), 0, 1)
    col = col + (255 - col) * hi[..., None] * 0.9
    cv.put(m, col, outline=6)

def gumdrop(cx, cy, w, h, col0):
    lx = (cv.xx - cx) / (w / 2); ly = (cy - cv.yy) / h
    lyc = np.clip(ly, 0, 1)
    prof = np.sqrt(np.clip(1 - lyc ** 1.6, 0, 1)) * (1 - 0.18 * lyc)
    m = (ly >= 0) & (ly < 1) & (np.abs(lx) < prof)
    p = np.clip(lx / np.maximum(prof, 0.01), -1, 1)
    lit, hi = shade_cyl(p)
    col = col0 * lit[..., None] * (0.9 + 0.2 * lyc[..., None])
    sugar = rng.random((N, N)) < 0.06
    col = np.where(sugar[..., None], col + (255 - col) * 0.55, col)
    col = col + (255 - col) * hi[..., None] * 0.5
    cv.put(m, col, outline=6)

peppermint(600, 610, 140, wrap=True, spin=0.3)
gumdrop(860, 900, 210, 200, np.array([30, 128, 70.]))
peppermint(330, 800, 100, spin=1.2)
gumdrop(620, 920, 230, 220, RED)
peppermint(840, 560, 80, spin=2.0)
gumdrop(420, 900, 140, 120, np.array([248, 196, 40.]))

# Quadrant BR: syrup. A diner glass dispenser, a short stack, syrup running down
def ellipse_mask(cx, cy, rx, ry):
    return ((cv.xx - cx) / rx) ** 2 + ((cv.yy - cy) / ry) ** 2 < 1

def pancake(cx, cy, rx, ry, th_):
    side = (np.abs(cv.xx - cx) < rx) & (cv.yy > cy - 0) & (cv.yy < cy + th_)
    side = (side & (((cv.xx - cx) / rx) ** 2 + ((cv.yy - cy - th_) / ry) ** 2 < 1)) | (side & (cv.yy < cy + th_))
    side = side & (np.abs(cv.xx - cx) < rx * np.sqrt(np.clip(1 - 0, 0, 1)))
    bot = ellipse_mask(cx, cy + th_, rx, ry)
    m = side | bot
    p = np.clip((cv.xx - cx) / rx, -1, 1)
    lit, _ = shade_cyl(p)
    col = np.array([204, 140, 66.]) * lit[..., None]
    cv.put(m, col, outline=5)
    top = ellipse_mask(cx, cy, rx, ry)
    tex = mottle(N, N, 14, 18, int(cx + cy))
    col = np.array([226, 168, 92.]) + tex[..., None] - ((cv.xx - cx) / rx * 12)[..., None]
    cv.put(top, col, outline=5)

cx0 = 1380
for i in range(3):
    pancake(cx0, 1440 - i * 40, 190, 54, 34)
# syrup pool on top with drips over the edge
top = ellipse_mask(cx0 + 10, 1362, 130, 36)
for dx_, ln in [(-110, 60), (-40, 110), (60, 90), (125, 50)]:
    top |= (np.abs(cv.xx - (cx0 + dx_)) < 14) & (cv.yy > 1360) & (cv.yy < 1372 + ln)
    top |= ellipse_mask(cx0 + dx_, 1372 + ln, 16, 19)
amber = np.array([150, 70, 18.])
lit = 0.75 + 0.5 * np.clip(1 - np.hypot(cv.xx - (cx0 - 40), cv.yy - 1350) / 180, 0, 1)
col = amber * lit[..., None]
gl = np.clip(1 - np.hypot((cv.xx - (cx0 - 50)) / 50, (cv.yy - 1350) / 10), 0, 1)
col = col + (255 - col) * gl[..., None] * 0.9
cv.put(top, col, outline=5)
# butter pat
bm = (np.abs(cv.xx - (cx0 + 20)) < 36) & (np.abs(cv.yy - 1340) < 17)
cv.put(bm, np.array([252, 232, 150.]), outline=4)

# the dispenser
dx0, dy0, dw, dh = 1160, 1090, 220, 250
body = (np.abs(cv.xx - dx0) < dw / 2) & (cv.yy > dy0) & (cv.yy < dy0 + dh)
body |= ellipse_mask(dx0, dy0 + dh, dw / 2, 36)
handle = (np.hypot((cv.xx - (dx0 + dw / 2 + 30)) / 70, (cv.yy - (dy0 + 150)) / 110) < 1) & \
         (np.hypot((cv.xx - (dx0 + dw / 2 + 30)) / 40, (cv.yy - (dy0 + 150)) / 80) > 1) & (cv.xx > dx0 + dw / 2 - 4)
cv.put(handle, np.array([215, 230, 228.]), outline=5)
p = np.clip((cv.xx - dx0) / (dw / 2), -1, 1)
lit, hi = shade_cyl(p)
level = dy0 + 70
glass = np.array([226, 238, 236.]) * (0.9 + 0.1 * lit[..., None])
syr = np.array([168, 82, 20.]) * lit[..., None] * (1 - 0.25 * ((cv.yy - level) / dh).clip(0, 1))[..., None]
col = np.where((cv.yy > level)[..., None], syr, glass)
col = col + (255 - col) * hi[..., None] * 0.85
rib = (np.sin((cv.xx - dx0) / dw * math.pi * 7) > 0.92) & (cv.yy > dy0 + 30)
col = np.where(rib[..., None], col * 0.88 + 30, col)
cv.put(body, col, outline=6)
# chrome lid and spout
lid = (np.abs(cv.xx - dx0) < (dw / 2 + 14) - (dy0 - cv.yy) * 0.55) & (cv.yy > dy0 - 90) & (cv.yy <= dy0 + 6)
pp = np.clip((cv.xx - dx0) / (dw / 2 + 14), -1, 1)
chrome = 150 + 95 * np.sin(pp * 5 + 1.2) ** 2
col = np.dstack([chrome, chrome + 4, chrome + 8])
cv.put(lid, col, outline=6)
spout = (cv.xx > dx0 - 150) & (cv.xx < dx0 - 40) & (np.abs(cv.yy - (dy0 - 46) + (dx0 - 40 - cv.xx) * 0.32) < 20)
cv.put(spout, np.dstack([chrome, chrome + 4, chrome + 8]) * 0.95, outline=5)
knob = ellipse_mask(dx0 + 20, dy0 - 96, 34, 24)
cv.put(knob, np.array([200, 204, 210.]), outline=5)
# a drip from the spout falling to the stack
drip = (np.abs(cv.xx - (dx0 - 146)) < 8) & (cv.yy > dy0 - 40) & (cv.yy < dy0 + 10)
drip |= ellipse_mask(dx0 - 146, dy0 + 14, 12, 16)
cv.put(drip, np.array([176, 88, 24.]), outline=3)

# hub
hub = r < 150
cv.put(hub, RED, outline=0)
cv.rgb += (mottle(N, N, 40, 6, 9) * hub)[..., None]
cv.put((r > 150) & (r < 162), SNOW, outline=0)
cv.put((r > 162) & (r < 170), DKGREEN, outline=0)
# gentle overall paper mottle so it reads as gouache on stock
cv.rgb += (mottle(N, N, 30, 5, 13) * (r < R_OUT))[..., None]

wheel = cv.image()
dr = ImageDraw.Draw(wheel)

def arc_text(img, text, radius, centre_deg, font, fill, top=True, track=6):
    widths = [font.getlength(ch) + track for ch in text]
    total = sum(widths) - track
    ang = centre_deg - (total / 2) / radius * 180 / math.pi * (1 if top else -1)
    for ch, wch in zip(text, widths):
        mid = ang + (wch - track) / 2 / radius * 180 / math.pi * (1 if top else -1)
        if ch != ' ':
            box = font.getbbox(ch)
            g = Image.new('RGBA', (int(box[2] + 40), int(font.size * 1.6)), (0, 0, 0, 0))
            ImageDraw.Draw(g).text((20, font.size * 0.25), ch, font=font, fill=fill)
            rot = -(mid + 90) if top else -(mid - 90)
            g = g.rotate(rot, resample=Image.BICUBIC, expand=True)
            x = C + radius * math.cos(math.radians(mid)); y = C + radius * math.sin(math.radians(mid))
            img.alpha_composite(g, (int(x - g.width / 2), int(y - g.height / 2)))
        ang += wch / radius * 180 / math.pi * (1 if top else -1)

gf = ImageFont.truetype(GF, 120)
arc_text(wheel, 'THE FOUR MAIN FOOD GROUPS', 840, -90, gf, (252, 250, 244, 255), top=True)
arc_text(wheel, 'AS TAUGHT AT THE NORTH POLE', 840, 90, ImageFont.truetype(GF, 92), (252, 250, 244, 255), top=False)
for a in (180, 0):
    x = C + 840 * math.cos(math.radians(a)); y = C + 840 * math.sin(math.radians(a))
    for k in range(6):
        t = math.radians(k * 30)
        dr.line([(x - 36 * math.cos(t), y - 36 * math.sin(t)), (x + 36 * math.cos(t), y + 36 * math.sin(t))], fill=(252, 250, 244, 255), width=10)

# quadrant labels on little snow tags
lf = ImageFont.truetype(GF, 92)
for text, (x, y) in [('CANDY', (600, 400)), ('CANDY CANES', (1290, 400)), ('CANDY CORN', (600, 1580)), ('SYRUP', (1290, 1580))]:
    w = lf.getlength(text)
    dr.rounded_rectangle([x - w / 2 - 30, y - 62, x + w / 2 + 30, y + 58], radius=40, fill=(196, 30, 44, 255), outline=(14, 58, 34, 255), width=8)
    dr.text((x, y), text, font=lf, fill=(252, 250, 244, 255), anchor='mm')
hf = ImageFont.truetype(GF, 64)
for i, t in enumerate(['EAT', 'ALL FOUR,', 'EVERY DAY']):
    dr.text((C, C - 62 + i * 62), t, font=hf, fill=(252, 250, 244, 255), anchor='mm')
wheel.resize((940, 940), Image.LANCZOS).save(A('food-groups-wheel.png'))

# ------------------------------------------------------------------ spirit gauge (180x120 css, painted at 4x)
GW, GH = 720, 480
g = Canvas(GW, GH)
gc = (GW / 2, 420)
rr = np.hypot(g.xx - gc[0], g.yy - gc[1]); ta = np.degrees(np.arctan2(gc[1] - g.yy, g.xx - gc[0]))
up = g.yy <= gc[1] + 30
bez = (rr < 340) & up
chrome = 170 + 70 * np.cos(np.radians(ta * 2 + 40)) ** 2
g.put(bez, np.dstack([chrome, chrome + 4, chrome + 10]), outline=6)
face = (rr < 300) & up
g.put(face, np.array([250, 247, 236.]) - (rr / 300 * 14)[..., None], outline=3)
band = (rr > 210) & (rr < 260) & (g.yy < gc[1])
frac = (180 - ta) / 180
bcol = np.where((frac < 0.33)[..., None], np.array([214, 222, 216.]), np.where((frac < 0.72)[..., None], np.array([126, 178, 140.]), RED))
g.put(band, bcol, outline=0)
gim = g.image(); gd = ImageDraw.Draw(gim)
for k in range(21):
    a = math.radians(180 - k * 9); L = 40 if k % 5 == 0 else 22
    x0, y0 = gc[0] + 290 * math.cos(a), gc[1] - 290 * math.sin(a)
    x1, y1 = gc[0] + (290 - L) * math.cos(a), gc[1] - (290 - L) * math.sin(a)
    gd.line([(x0, y0), (x1, y1)], fill=(22, 44, 30, 255), width=8 if k % 5 == 0 else 5)
nf = ImageFont.truetype(NF, 40)
for t, a in [('LOW', 160), ('JOLLY', 90), ('FULL', 20)]:
    x, y = gc[0] + 170 * math.cos(math.radians(a)), gc[1] - 170 * math.sin(math.radians(a))
    gd.text((x, y), t, font=nf, fill=(22, 44, 30, 255), anchor='mm')
a = math.radians(180 - 0.86 * 180)
tip = (gc[0] + 270 * math.cos(a), gc[1] - 270 * math.sin(a))
nrm = (math.sin(a), math.cos(a))
gd.polygon([tip, (gc[0] + 14 * nrm[0], gc[1] + 14 * nrm[1]), (gc[0] - 14 * nrm[0], gc[1] - 14 * nrm[1])], fill=(196, 30, 44, 255))
gd.ellipse([gc[0] - 30, gc[1] - 30, gc[0] + 30, gc[1] + 30], fill=(22, 44, 30, 255))
gim = gim.crop((0, 60, GW, GH))
gim.resize((360, 210), Image.LANCZOS).save(A('spirit-gauge.png'))

# ------------------------------------------------------------------ fur trim for the header band (1300x44 css)
FW, FH = 2600, 88
fur = np.zeros((FH, FW)); yy, xx = np.mgrid[0:FH, 0:FW].astype(float)
edge = 40 + 10 * np.sin(xx / 37) + 7 * np.sin(xx / 13 + 1) + mottle(1, FW, 9, 9, 4)[0]
fur = (yy < edge).astype(float)
tuft = Image.fromarray((fur * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(2))
t = np.asarray(tuft, float) / 255
strands = (rng.random((FH, FW)) < 0.05) & (yy < edge + 10)
t = np.maximum(t, strands * 0.9)
tone = 236 + mottle(FH, FW, 6, 14, 8) - yy / FH * 18
col = np.dstack([tone, tone, tone - 6])
Image.fromarray(np.dstack([col.clip(0, 255), t * 255]).astype('uint8'), 'RGBA').resize((1300, 44), Image.LANCZOS).save(A('fur-trim.png'))

# ------------------------------------------------------------------ the street still, signs softened
st = Image.open(S('2dsieAsbogrPNpGHwK7fMRMTWd1.jpg')).convert('RGB')
k = 3.0
for b in [(440, 255, 530, 300), (590, 60, 780, 140), (1010, 225, 1090, 280), (0, 150, 100, 235), (1150, 230, 1190, 260)]:
    bb = tuple(int(v * k) for v in b)
    st.paste(st.crop(bb).filter(ImageFilter.GaussianBlur(18)), bb[:2])
crop = st.crop((int(170 * k), int(28 * k), int(1110 * k), int(28 * k + 940 * k / 2.35)))
crop = crop.resize((940, 400), Image.LANCZOS)
arr = np.asarray(crop, float); arr = 255 * (arr / 255) ** 0.92
Image.fromarray(arr.clip(0, 255).astype('uint8')).save(A('still-seventh-ave.jpg'), quality=90)
print('painted')
