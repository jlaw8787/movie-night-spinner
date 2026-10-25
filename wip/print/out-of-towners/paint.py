"""Paints the PNG assets for the Harbor & Hudson Lines dining car card (The Out-of-Towners, 1970).

engraving.png : two-ink line cut, black engraving over a gold tint, of a 1970 Shore Line train
                (FL9-style diesel and fluted stainless coaches) running the Connecticut shore.
                Tone is built from engraved line hatching whose width swells with darkness,
                then squashed like letterpress ink. Gold plate is printed 2px out of register.
pencil-1..3.png : soft graphite strike lines, the way a steward crossed out sold-out items.
wear-front.png / wear-back.png : soft mottling and edge rub, a faint tumbler ring on the back.
"""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
random.seed(1970)
rng = np.random.default_rng(1970)

CW, CH = 672, 300          # css size of the cut
S = 3                       # paint scale
W, H = CW * S, CH * S
INK = (28, 24, 22)
GOLD = (214, 168, 70)

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def P(pts):
    return [(x * S, y * S) for x, y in pts]


def mask_poly(pts, blur=0):
    m = Image.new('L', (W, H), 0)
    ImageDraw.Draw(m).polygon(P(pts), fill=255)
    if blur:
        m = m.filter(ImageFilter.GaussianBlur(blur))
    return np.asarray(m, np.float32) / 255


def mask_rect(x0, y0, x1, y1):
    return mask_poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)])


def hatch(mask, tone, angle=0.0, sp=2.1, wave=None):
    """Engraved lines: line thickness follows tone (0 white, 1 black). angle in degrees, sp in css px."""
    a = math.radians(angle)
    proj = -xx * math.sin(a) + yy * math.cos(a)
    if wave is not None:
        amp, per = wave
        proj = proj + amp * S * np.sin(xx / (per * S) * 2 * math.pi + yy * 0.013)
    f = (proj / (sp * S)) % 1.0
    d = np.abs(f - 0.5) * 2          # 0 at line centre, 1 between lines
    t = np.clip(tone, 0, 1)
    return (mask > 0.5) & (d < t)


def vgrad(y0, y1, t0, t1):
    t = np.clip((yy - y0 * S) / ((y1 - y0) * S), 0, 1)
    return t0 + (t1 - t0) * t


def hgrad(x0, x1, t0, t1):
    t = np.clip((xx - x0 * S) / ((x1 - x0) * S), 0, 1)
    return t0 + (t1 - t0) * t


ink = np.zeros((H, W), bool)
cover = np.zeros((H, W), bool)   # areas already drawn by nearer objects (painter's order: far to near, near clears far)


def put(layer, region):
    """Lay a nearer object: clear what's behind it inside region, then add its ink."""
    global ink
    r = region > 0.5
    ink[r] = False
    ink |= layer & r


lines = Image.new('L', (W, H), 0)   # solid outline strokes, merged at the end
LD = ImageDraw.Draw(lines)


def stroke(pts, w=1.0):
    LD.line(P(pts), fill=255, width=max(1, int(round(w * S))), joint='curve')


def clear_lines(region_pts):
    LD.polygon(P(region_pts), fill=0)


def bez(p0, p1, p2, n=14):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * p1[0] + t * t * p2[0], (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * p1[1] + t * t * p2[1]) for t in np.linspace(0, 1, n)]


HOR = 132   # horizon
RAIL = 228  # rail head

# ---------------- sky ----------------
sky = mask_rect(0, 0, CW, HOR)
sky_tone = vgrad(0, HOR, 0.62, 0.10)
# cumulus banks: soft shapes where the lines thin out to white
cl = Image.new('L', (W, H), 0)
cd = ImageDraw.Draw(cl)
for (cx, cy, r) in [(120, 64, 26), (150, 52, 32), (186, 60, 26), (214, 70, 18), (96, 76, 18), (170, 78, 30),
                    (430, 40, 22), (462, 30, 28), (498, 38, 24), (526, 50, 16), (470, 54, 26), (404, 52, 14)]:
    cd.ellipse([(cx - r) * S, (cy - r) * S, (cx + r) * S, (cy + r) * S], fill=255)
cl_s = cl.filter(ImageFilter.GaussianBlur(5 * S))
cloud = np.asarray(cl_s, np.float32) / 255
# shade the cloud bellies a little so they read as form
belly = np.asarray(cl.filter(ImageFilter.GaussianBlur(2 * S)).transform((W, H), Image.AFFINE, (1, 0, 0, 0, 1, -7 * S)), np.float32) / 255
tone = sky_tone * (1 - cloud * 0.97) + np.clip(cloud - belly, 0, 1) * 0.22
ink |= hatch(sky, tone, 0, 2.0)
# cloud outlines, broken like a graver would leave them
edge = np.asarray(cl.filter(ImageFilter.FIND_EDGES).filter(ImageFilter.GaussianBlur(1)), np.float32) / 255
ink |= (edge > 0.25) & (yy < (HOR - 4) * S) & (rng.random((H, W)) > 0.35)

# gulls
for gx, gy, gs in [(312, 44, 7), (334, 36, 5), (352, 50, 6), (600, 70, 5)]:
    stroke([(gx - gs, gy), (gx - gs * 0.45, gy - gs * 0.45), (gx, gy)], 1.0)
    stroke([(gx, gy), (gx + gs * 0.45, gy - gs * 0.5), (gx + gs, gy - gs * 0.05)], 1.0)

# ---------------- far shore, left: hills, trees, white church ----------------
shore = [(0, HOR), (0, 104), (30, 98), (62, 102), (96, 94), (140, 99), (176, 108), (214, 116), (250, 124), (290, HOR)]
m = mask_poly(shore)
put(hatch(m, vgrad(94, HOR, 0.55, 0.30), 28, 1.7), m)
# tree crowns along the ridge, cross-hatched darker
for i in range(26):
    tx = 6 + i * 9.5 + random.uniform(-2, 2)
    ty = 100 + (abs(tx - 96) * 0.12) + random.uniform(-3, 2)
    r = random.uniform(5, 8)
    tm = Image.new('L', (W, H), 0)
    ImageDraw.Draw(tm).ellipse([(tx - r) * S, (ty - r) * S, (tx + r) * S, (ty + r * 1.2) * S], fill=255)
    tmm = np.asarray(tm, np.float32) / 255 * m.clip(0, 1) if False else np.asarray(tm, np.float32) / 255
    tmm = tmm * (yy < HOR * S)
    put(hatch(tmm, 0.62, -35, 1.6) | hatch(tmm, 0.35, 40, 1.9), tmm)
# white clapboard church with steeple on the ridge
ch = [(138, 118), (138, 104), (147, 97), (156, 104), (156, 118)]
st = [(141, 104), (141, 92), (144, 86), (144, 78), (145.5, 70), (147, 78), (147, 86), (150, 92), (150, 104)]
m1, m2 = mask_poly(ch), mask_poly(st)
put(hatch(m1, hgrad(138, 156, 0.0, 0.25), 90, 1.6), m1)
put(np.zeros_like(ink), m2)
stroke(ch + [ch[0]], 0.8); stroke(st, 0.8)
stroke([(144, 92), (147, 92)], 0.6)
for wy in (106, 112):
    stroke([(150, wy), (150, wy + 3)], 1.2)

# ---------------- far point, right: lighthouse and keeper's house ----------------
pt = [(470, HOR), (520, 126), (560, 121), (600, 118), (640, 116), (672, 115), (672, HOR)]
m = mask_poly(pt)
put(hatch(m, 0.5, 25, 1.7), m)
lh = [(598, 118), (600, 82), (612, 82), (614, 118)]
m = mask_poly(lh)
put(hatch(m, hgrad(598, 614, 0.04, 0.42), 90, 1.4), m)
stroke(lh, 0.8)
stroke([(597, 82), (615, 82)], 1.0)
stroke([(599, 82), (599, 74), (613, 74), (613, 82)], 0.7)   # lantern room
for k in range(3):
    stroke([(601 + k * 4, 74), (601 + k * 4, 82)], 0.5)
m = mask_poly([(598, 74), (606, 66), (614, 74)])
put(hatch(m, 0.8, 0, 1.2), m)
stroke([(606, 66), (606, 62)], 0.6)
# light rays, faint engraved fan
# keeper's house
hs = [(620, 118), (620, 106), (630, 98), (640, 106), (640, 118)]
m = mask_poly(hs)
put(hatch(m, 0.12, 90, 1.6), m)
stroke(hs + [hs[0]], 0.7)
m = mask_poly([(618, 106), (630, 96), (642, 106)])
put(hatch(m, 0.7, 0, 1.3), m)

# ---------------- sea ----------------
sea = mask_rect(0, HOR, CW, 226)
tone = vgrad(HOR, 226, 0.20, 0.55)
# glitter path where the lines break up
gl = (np.abs(xx - 380 * S) < (30 + (yy / S - HOR) * 1.6) * S) & (rng.random((H, W)) > 0.0)
gl_noise = np.asarray(Image.fromarray((rng.random((H // 9, W // 24)) * 255).astype(np.uint8)).resize((W, H), Image.NEAREST), np.float32) / 255
tone = np.where(gl, tone * 0.55, tone)
ink |= hatch(sea, tone, 0, 1.75, wave=(0.6, 23)) & (yy >= HOR * S)
stroke([(0, HOR), (CW, HOR)], 0.6)

# catboat sailing out past the point
boat_hull = [(520, 150), (548, 150), (544, 156), (524, 156)]
sail = [(533, 149), (533, 112), (552, 147)]
m = mask_poly(sail); put(hatch(m, hgrad(533, 552, 0.0, 0.3), 70, 1.4), m)
m = mask_poly(boat_hull); put(hatch(m, 0.85, 0, 1.0), m)
stroke(sail + [sail[0]], 0.7); stroke([(533, 149), (533, 110)], 0.9)
stroke([(516, 158), (552, 158)], 0.5)

# ---------------- telegraph line on the sea side ----------------
poles = [26, 286, 548]
tops = {}
for px in poles:
    stroke([(px, 112), (px, 214)], 1.6)
    stroke([(px - 9, 116), (px + 9, 116)], 1.3)
    stroke([(px - 7, 122), (px + 7, 122)], 1.1)
    for dx in (-8, -3, 3, 8):
        stroke([(px + dx, 116), (px + dx, 114)], 0.9)
    tops[px] = True
for a, b in zip(poles, poles[1:] + [CW + 120]):
    for dx, yy0 in ((-8, 115), (8, 115), (-5, 121), (5, 121)):
        x0, x1 = a + dx, b + dx
        pts = [(x0 + (x1 - x0) * t, yy0 + 7 * math.sin(math.pi * t)) for t in np.linspace(0, 1, 30)]
        stroke(pts, 0.45)
for dx, yy0 in ((-8, 115), (8, 115), (-5, 121), (5, 121)):
    x1 = poles[0] + dx
    pts = [(-120 + (x1 + 120) * t, yy0 + 5 * math.sin(math.pi * t)) for t in np.linspace(0, 1, 30)]
    stroke(pts, 0.45)

# ---------------- embankment and riprap ----------------
emb = [(0, 226), (CW, 226), (CW, 300), (0, 300)]
m = mask_poly(emb)
put(hatch(m, vgrad(226, 262, 0.30, 0.55), -32, 1.8), m)
# ballast shoulder: stipple of stones just under the rails
stip = (rng.random((H, W)) > 0.93) & (yy > 230 * S) & (yy < 240 * S)
ink |= stip
# riprap: big angular granite blocks tumbled down to the water, nearer ones larger
rocks = []
for row, (ry, sz) in enumerate([(244, 0.8), (258, 1.0), (274, 1.25)]):
    x = -20 + random.uniform(0, 14)
    while x < CW + 20:
        w = random.uniform(22, 44) * sz; h = random.uniform(11, 17) * sz
        cx, cy = x + w / 2, ry + random.uniform(-3, 3)
        n = random.randint(5, 7)
        ang0 = random.uniform(0, 1)
        pts = []
        for k in range(n):
            t = ang0 + 2 * math.pi * k / n + random.uniform(-0.25, 0.25)
            pts.append((cx + math.cos(t) * w / 2 * random.uniform(0.75, 1.05), cy + math.sin(t) * h / 2 * random.uniform(0.7, 1.05)))
        rocks.append(pts)
        x += w * random.uniform(0.72, 0.95)
for pts in rocks:
    m = mask_poly(pts)
    top = min(p[1] for p in pts); bot = max(p[1] for p in pts)
    lft = min(p[0] for p in pts); rgt = max(p[0] for p in pts)
    t = vgrad(top, bot, 0.12, 0.75) + hgrad(lft, rgt, -0.08, 0.12)
    a1 = random.choice([-40, -28, 32, 48])
    put(hatch(m, t, a1, 1.45) | hatch(m, np.clip(t - 0.5, 0, 1) * 1.8, a1 + 80, 1.7), m)
    stroke(pts + [pts[0]], 0.8)
    # a facet line across the top of each block
    k = len(pts)
    stroke([pts[k // 2], pts[0]], 0.45)
# tide water and beach grass in the foreground
fw = mask_rect(0, 280, CW, 300)
put(hatch(fw, vgrad(280, 300, 0.25, 0.5), 0, 1.6, wave=(0.5, 17)), fw)
for i in range(26):
    gx = random.uniform(-4, CW + 4)
    base = random.uniform(292, 302)
    for b in range(random.randint(5, 9)):
        hgt = random.uniform(12, 30); lean = random.uniform(-10, 10)
        bx = gx + random.uniform(-3, 3)
        stroke(bez((bx, base), (bx + lean * 0.2, base - hgt * 0.6), (bx + lean, base - hgt), 8), random.uniform(0.45, 0.8))

# ---------------- the train ----------------
TRUCK_Y = RAIL - 6.5   # axle centre
WR = 6.2               # wheel radius


def wheels(xc, n, gap=13):
    for k in range(n):
        wx = xc + (k - (n - 1) / 2) * gap
        m = Image.new('L', (W, H), 0)
        ImageDraw.Draw(m).ellipse([(wx - WR) * S, (TRUCK_Y - WR) * S, (wx + WR) * S, (TRUCK_Y + WR) * S], fill=255)
        mm = np.asarray(m, np.float32) / 255
        put(hatch(mm, 0.55, 90, 1.2), mm)
        LD.ellipse([(wx - WR) * S, (TRUCK_Y - WR) * S, (wx + WR) * S, (TRUCK_Y + WR) * S], outline=255, width=int(0.9 * S))
        LD.ellipse([(wx - 1.6) * S, (TRUCK_Y - 1.6) * S, (wx + 1.6) * S, (TRUCK_Y + 1.6) * S], fill=255)


def truck(xc, n, gap=13):
    half = (n - 1) * gap / 2 + 9
    fr = [(xc - half, TRUCK_Y - 7), (xc + half, TRUCK_Y - 7), (xc + half - 3, TRUCK_Y - 2), (xc - half + 3, TRUCK_Y - 2)]
    wheels(xc, n, gap)
    m = mask_poly(fr)
    put(hatch(m, 0.78, 0, 1.2), m)
    stroke(fr + [fr[0]], 0.8)
    # journal boxes and spring nests
    for k in range(n):
        wx = xc + (k - (n - 1) / 2) * gap
        b = [(wx - 3, TRUCK_Y - 4), (wx + 3, TRUCK_Y - 4), (wx + 3, TRUCK_Y + 1), (wx - 3, TRUCK_Y + 1)]
        m = mask_poly(b); put(np.zeros_like(ink), m); stroke(b + [b[0]], 0.6)
    for k in range(n - 1):
        sx = xc + (k - (n - 2) / 2) * gap
        for j in range(4):
            stroke([(sx - 2.5, TRUCK_Y - 9 + j * 1.6), (sx + 2.5, TRUCK_Y - 8.2 + j * 1.6)], 0.5)


# rails first (train stands on them)
stroke([(0, RAIL), (CW, RAIL)], 1.8)
stroke([(0, RAIL + 2.2), (CW, RAIL + 2.2)], 0.6)
for x in np.arange(0, CW, 5.5):
    stroke([(x, RAIL + 3), (x - 1.2, RAIL + 5.2)], 0.9)   # tie ends

# ---- coaches: fluted stainless, two in view, the second running off the edge
CAR_TOP, CAR_BOT = 170, 213
for c0 in (292, 632):
    c1 = c0 + 336
    body = [(c0, CAR_TOP + 5), (c0 + 4, CAR_TOP), (c1 - 4, CAR_TOP), (c1, CAR_TOP + 5), (c1, CAR_BOT), (c0, CAR_BOT)]
    m = mask_poly(body)
    # body is bright metal: very light sky reflection lines
    put(hatch(m, vgrad(CAR_TOP, CAR_BOT, 0.05, 0.14), 0, 1.9), m)
    # roof, curved, with shading
    roof = [(c0 + 4, CAR_TOP), (c0 + 10, CAR_TOP - 4), (c1 - 10, CAR_TOP - 4), (c1 - 4, CAR_TOP)]
    m = mask_poly(roof)
    put(hatch(m, vgrad(CAR_TOP - 4, CAR_TOP, 0.15, 0.55), 0, 1.0), m)
    stroke(roof, 0.9)
    stroke(body + [body[0]], 1.0)
    # letterboard fluting above windows
    for k in range(3):
        y = CAR_TOP + 2.2 + k * 1.5
        stroke([(c0 + 3, y), (c1 - 3, y)], 0.4)
    # window band, paired windows
    WY0, WY1 = CAR_TOP + 8, CAR_TOP + 20
    x = c0 + 34
    while x + 16 < c1 - 30:
        win = [(x, WY0), (x + 16, WY0), (x + 16, WY1), (x, WY1)]
        m = mask_poly(win)
        put(hatch(m, 0.82, 0, 1.0) | hatch(m, 0.2, 60, 1.6), m)
        stroke(win + [win[0]], 0.7)
        x += 22
    # vestibule doors at both ends
    for dx in (c0 + 6, c1 - 24):
        door = [(dx, CAR_TOP + 6), (dx + 16, CAR_TOP + 6), (dx + 16, CAR_BOT - 2), (dx, CAR_BOT - 2)]
        stroke(door + [door[0]], 0.7)
        dw = [(dx + 4, CAR_TOP + 9), (dx + 12, CAR_TOP + 9), (dx + 12, CAR_TOP + 19), (dx + 4, CAR_TOP + 19)]
        m = mask_poly(dw); put(hatch(m, 0.8, 0, 1.0), m); stroke(dw + [dw[0]], 0.5)
    # the flutes: the thing that makes a stainless car, engraved as fine parallel lines
    for k in range(9):
        y = WY1 + 3 + k * 2.0
        stroke([(c0 + 23, y), (c1 - 25, y)], 0.55 if k < 7 else 0.8)
    # shadow under the sill, tumble-home
    sh = mask_poly([(c0, CAR_BOT - 3), (c1, CAR_BOT - 3), (c1, CAR_BOT + 4), (c0, CAR_BOT + 4)])
    put(hatch(sh, 0.85, 0, 1.0), sh)
    # skirt equipment boxes between trucks
    for ex, ew in ((c0 + 110, 40), (c0 + 180, 26)):
        bx = [(ex, CAR_BOT + 3), (ex + ew, CAR_BOT + 3), (ex + ew, CAR_BOT + 9), (ex, CAR_BOT + 9)]
        m = mask_poly(bx); put(hatch(m, 0.7, 0, 1.1), m); stroke(bx + [bx[0]], 0.6)
    truck(c0 + 40, 2, 14)
    truck(c1 - 40, 2, 14)
# diaphragm between locomotive and coach, and between coaches
for gx in (288, 628):
    dg = [(gx, CAR_TOP + 2), (gx + 4, CAR_TOP + 2), (gx + 4, CAR_BOT - 2), (gx, CAR_BOT - 2)]
    m = mask_poly(dg); put(hatch(m, 0.9, 90, 0.9), m)

# ---- the locomotive: an FL9-style bulldog-nose diesel, facing left (toward New York)
L0, L1 = 54, 287
LT, LB = 160, 212   # roof line and body bottom


nose = (bez((L0, LB), (L0 - 4, 196), (L0 + 3, 186)) + bez((L0 + 3, 186), (L0 + 10, 179), (L0 + 22, 177))
        + [(L0 + 34, LT + 4)] + bez((L0 + 34, LT + 4), (L0 + 38, LT), (L0 + 46, LT)))
body = nose + [(L1 - 8, LT), (L1 - 2, LT + 3), (L1, LT + 9), (L1, LB)]
mb = mask_poly(body)
# dark paint: mid-dark tone, lighter toward the roof where the sky catches it
put(hatch(mb, vgrad(LT, LB, 0.30, 0.66), 0, 1.6), mb)
# the light band along the side (railroad stripe), kept almost white
band = mask_poly([(L0 + 2, 194), (L1, 194), (L1, 200), (L0 + 1, 200)])
put(hatch(band * mb, 0.06, 0, 1.6), band * mb)
stroke([(L0 + 3, 194), (L1, 194)], 0.6); stroke([(L0 + 2, 200), (L1, 200)], 0.6)
stroke(body + [body[0]], 1.2)
# nose shading, rounded form with curved contour lines
for k in range(5):
    off = 3 + k * 2.6
    pts = bez((L0 + off * 0.5, LB - 2), (L0 - 2 + off, 194), (L0 + 6 + off * 0.8, 184 + off * 0.2), 10)
    stroke(pts, 0.5)
# windshield and cab side window
ws = [(L0 + 22, 177), (L0 + 34, LT + 4), (L0 + 40, LT + 4), (L0 + 33, 178)]
m = mask_poly(ws); put(hatch(m, 0.25, 60, 1.2), m); stroke(ws + [ws[0]], 0.8)
cw = [(L0 + 44, 166), (L0 + 62, 166), (L0 + 62, 178), (L0 + 44, 178)]
m = mask_poly(cw); put(hatch(m, 0.3, 60, 1.3), m); stroke(cw + [cw[0]], 0.8)
# cab door and grab irons
cd_ = [(L0 + 66, 165), (L0 + 76, 165), (L0 + 76, 193), (L0 + 66, 193)]
stroke(cd_ + [cd_[0]], 0.7)
for gy in range(196, 210, 3):
    stroke([(L0 + 70, gy), (L0 + 74, gy)], 0.6)
# headlight and number boards
LD.ellipse([(L0 + 15 - 3.2) * S, (180 - 3.2) * S, (L0 + 15 + 3.2) * S, (180 + 3.2) * S], outline=255, width=int(0.9 * S))
m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).ellipse([(L0 + 15 - 2.6) * S, (180 - 2.6) * S, (L0 + 15 + 2.6) * S, (180 + 2.6) * S], fill=255)
put(np.zeros_like(ink), np.asarray(m, np.float32) / 255)
nb = [(L0 + 24, 172), (L0 + 31, 168), (L0 + 33, 171), (L0 + 26, 175)]
m = mask_poly(nb); put(np.zeros_like(ink), m); stroke(nb + [nb[0]], 0.5)
# portholes along the side
for px in (L0 + 104, L0 + 140):
    LD.ellipse([(px - 4) * S, (174 - 4) * S, (px + 4) * S, (174 + 4) * S], outline=255, width=int(1.0 * S))
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).ellipse([(px - 3.3) * S, (174 - 3.3) * S, (px + 3.3) * S, (174 + 3.3) * S], fill=255)
    mm = np.asarray(m, np.float32) / 255
    put(hatch(mm, 0.75, 0, 1.0), mm)
# side doors and panel seams
for sx in (L0 + 86, L0 + 122, L0 + 158, L0 + 196):
    stroke([(sx, LT + 4), (sx, 192)], 0.5)
# radiator grilles and fans at the rear: engraved screen
gr = [(L0 + 168, LT + 3), (L1 - 8, LT + 3), (L1 - 8, 172), (L0 + 168, 172)]
m = mask_poly(gr)
put(hatch(m, 0.55, 90, 0.9) | hatch(m, 0.3, 0, 1.1), m)
stroke(gr + [gr[0]], 0.7)
for fx in (L0 + 186, L0 + 212):
    stroke([(fx - 9, LT - 1), (fx + 9, LT - 1)], 1.3)
stroke([(L0 + 70, LT - 1), (L0 + 92, LT - 1)], 1.2)   # horn and roof hatch
stroke([(L0 + 76, LT - 1), (L0 + 76, LT - 5), (L0 + 82, LT - 5)], 0.8)
# underframe, fuel tank between the trucks, pilot and plow
ft = [(L0 + 82, LB), (L0 + 152, LB), (L0 + 148, LB + 9), (L0 + 86, LB + 9)]
m = mask_poly(ft); put(hatch(m, vgrad(LB, LB + 9, 0.5, 0.9), 0, 1.1), m); stroke(ft + [ft[0]], 0.7)
sill = mask_poly([(L0, LB - 2), (L1, LB - 2), (L1, LB + 2), (L0, LB + 2)])
put(hatch(sill, 0.9, 0, 0.9), sill)
pilot = [(L0, LB), (L0 + 22, LB), (L0 + 22, RAIL - 2), (L0 - 7, RAIL - 2)]
m = mask_poly(pilot); put(hatch(m, 0.5, -55, 1.2), m); stroke(pilot + [pilot[0]], 0.8)
for k in range(4):
    stroke([(L0 - 5 + k * 6, RAIL - 2), (L0 + 1 + k * 6, LB + 1)], 0.6)
stroke([(L0 + 2, LB + 3), (L0 - 3, LB + 3)], 0.8)   # coupler
truck(L0 + 44, 2, 15)
truck(L1 - 44, 3, 13)
# ---------------- merge, frame, ink squash ----------------
lin = np.asarray(lines, np.float32) / 255
art = np.maximum(ink.astype(np.float32), lin)
# keyline frame of the cut
fr = Image.new('L', (W, H), 0)
fd = ImageDraw.Draw(fr)
fd.rectangle([0, 0, W - 1, H - 1], outline=255, width=int(2.2 * S))
art = np.maximum(art, np.asarray(fr, np.float32) / 255)
# letterpress squash: soften, then re-threshold against a low-frequency coverage field so edges wander
img = Image.fromarray((art * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))
a = np.asarray(img, np.float32) / 255
cov = np.asarray(Image.fromarray((rng.random((H // 40 + 1, W // 40 + 1)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32) / 255
fine = rng.random((H, W)).astype(np.float32)
th = 0.42 + (cov - 0.5) * 0.08 + (fine - 0.5) * 0.06
a = np.clip((a - th) * 6 + 0.5, 0, 1)
# light patches where the forme did not quite kiss the paper
a *= 1 - np.clip((cov - 0.85) * 1.2, 0, 0.12)

out_w, out_h = CW * 2, CH * 2
black = Image.fromarray((a * 255).astype(np.uint8)).resize((out_w, out_h), Image.LANCZOS)

# gold plate: flat tint with gentle uneven coverage, printed 2px (css) right and 1.5px down of the key
gold_a = Image.new('L', (out_w, out_h), 0)
off = (4, 3)
ImageDraw.Draw(gold_a).rectangle([off[0] + 4, off[1] + 4, out_w - 1 - 4 + off[0], out_h - 1 - 4 + off[1]], fill=255)
mott = Image.fromarray((rng.random((out_h // 30 + 2, out_w // 30 + 2)) * 255).astype(np.uint8)).resize((out_w, out_h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(14))
gold_alpha = ImageChops.multiply(gold_a, mott.point(lambda v: int(205 + (v - 128) * 0.25)))
res = Image.new('RGBA', (out_w, out_h), (0, 0, 0, 0))
res.paste(Image.new('RGBA', (out_w, out_h), GOLD + (255,)), (0, 0), gold_alpha)
# black over gold multiplies; on paper it is plain ink
res = Image.alpha_composite(res, Image.merge('RGBA', [Image.new('L', (out_w, out_h), INK[0]), Image.new('L', (out_w, out_h), INK[1]),
                                                       Image.new('L', (out_w, out_h), INK[2]), black]))
res.save(os.path.join(A, 'engraving.png'))
print('engraving done')


# ---------------- pencil strike lines ----------------
def pencil(name, w=420, h=26, seed=0):
    r = random.Random(seed)
    s = 2
    im = Image.new('L', (w * s, h * s), 0)
    d = ImageDraw.Draw(im)
    y0 = h * s / 2 + r.uniform(-3, 3)
    tilt = r.uniform(-5, 5)
    for k in range(2):
        pts = []
        for i in range(40):
            t = i / 39
            pts.append((t * w * s, y0 + tilt * s * (t - 0.5) + math.sin(t * 7 + k) * 1.2 * s + k * 2.4 * s))
        d.line(pts, fill=150 if k == 0 else 95, width=int(2.1 * s))
    g = np.asarray(im, np.float32) / 255
    grain = rng.random(g.shape).astype(np.float32)
    g = g * (0.55 + 0.45 * grain)
    # taper the ends like a hand stroke
    ramp = np.clip(np.minimum(np.arange(w * s) / (w * s * 0.06), (w * s - np.arange(w * s)) / (w * s * 0.04)), 0, 1)
    g = g * ramp[None, :]
    al = Image.fromarray((np.clip(g, 0, 1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    out = Image.new('RGBA', al.size, (72, 72, 78, 0))
    out.putalpha(al)
    out.save(os.path.join(A, name))


for i in range(3):
    pencil(f'pencil-{i + 1}.png', seed=i + 3)


# ---------------- wear ----------------
def wear(face, w=768, h=1056, ring=None):
    s = 2
    W2, H2 = w * s, h * s
    small = Image.new('L', (w // 24 + 2, h // 24 + 2))
    small.putdata([random.randint(0, 255) for _ in range(small.size[0] * small.size[1])])
    mott = small.resize((W2, H2), Image.BICUBIC).filter(ImageFilter.GaussianBlur(22 * s))
    out = Image.new('RGBA', (W2, H2), (0, 0, 0, 0))
    a = mott.point(lambda v: int(max(0, v - 120) * 0.16))
    out.paste(Image.new('RGBA', (W2, H2), (150, 118, 80, 255)), (0, 0), a)
    edge = Image.new('L', (W2, H2), 0)
    ed = ImageDraw.Draw(edge)
    for i in range(26):
        v = int(34 * (1 - i / 26) ** 2)
        ed.rectangle([i * s, i * s, W2 - 1 - i * s, H2 - 1 - i * s], outline=v, width=s)
    edge = edge.filter(ImageFilter.GaussianBlur(6 * s))
    out = Image.alpha_composite(out, Image.composite(Image.new('RGBA', (W2, H2), (110, 82, 56, 255)), Image.new('RGBA', (W2, H2), (0, 0, 0, 0)), edge))
    # corner rub where the card was handled
    cr = Image.new('L', (W2, H2), 0)
    cdr = ImageDraw.Draw(cr)
    cdr.ellipse([W2 - 140 * s, H2 - 120 * s, W2 + 60 * s, H2 + 60 * s], fill=26)
    cdr.ellipse([-60 * s, H2 - 110 * s, 120 * s, H2 + 60 * s], fill=18)
    cr = cr.filter(ImageFilter.GaussianBlur(30 * s))
    out = Image.alpha_composite(out, Image.composite(Image.new('RGBA', (W2, H2), (120, 92, 60, 255)), Image.new('RGBA', (W2, H2), (0, 0, 0, 0)), cr))
    if ring:
        rx, ry, rr = [v * s for v in ring]
        rl = Image.new('L', (W2, H2), 0)
        rd = ImageDraw.Draw(rl)
        for t in range(3):
            o = t * 2 * s
            rd.arc([rx - rr + o, ry - rr - o, rx + rr + o, ry + rr - o], start=random.randint(0, 40), end=290 + random.randint(0, 50), fill=40 - t * 11, width=3 * s)
        rl = rl.filter(ImageFilter.GaussianBlur(2.5 * s))
        out = Image.alpha_composite(out, Image.composite(Image.new('RGBA', (W2, H2), (128, 80, 40, 255)), Image.new('RGBA', (W2, H2), (0, 0, 0, 0)), rl))
    out.save(os.path.join(A, f'wear-{face}.png'))


wear('front')
wear('back', ring=(640, 108, 52))
print('painted')
