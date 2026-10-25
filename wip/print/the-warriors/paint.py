"""Paints the signature art for The Warriors menu (Last Stop snack stand, Coney Island, 1979).
1. assets/ride-home-map.jpg: the long ride home, Bronx to Coney Island, painted night to dawn.
   North is to the left so the route reads left to right; drawn at 4x and reduced for a soft painted edge.
2. assets/token.png: a brass subway token, generic (no transit authority marks).
Labels for stations are set in HTML over the map; only region names are painted."""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
F_SQ = os.path.join(D, 'src', 'SquadaOne.ttf')
MW, MH = 1344, 540          # map size in page px
OUT = 2                      # saved at 2x
SS = 4                       # painted at 4x
K = SS
LAT0, LAT1 = 40.925, 40.560
LON0, LON1 = -73.835, -74.051
rnd = random.Random(1979)


def P(lat, lon, k=K):
    return ((LAT0 - lat) / (LAT0 - LAT1) * MW * k, (LON0 - lon) / (LON0 - LON1) * MH * k)


def smooth(pts, n=10, closed=True):
    """Catmull-Rom through the points, for an organic coast."""
    out = []
    m = len(pts)
    rng = range(m) if closed else range(m - 1)
    for i in rng:
        p0 = pts[(i - 1) % m] if closed or i > 0 else pts[0]
        p1, p2 = pts[i], pts[(i + 1) % m]
        p3 = pts[(i + 2) % m] if closed or i + 2 < m else pts[-1]
        for t in [j / n for j in range(n)]:
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[c]) + (-p0[c] + p2[c]) * t + (2 * p0[c] - 5 * p1[c] + 4 * p2[c] - p3[c]) * t2
                                    + (-p0[c] + 3 * p1[c] - 3 * p2[c] + p3[c]) * t3) for c in (0, 1)))
    if not closed:
        out.append(pts[-1])
    return out


def wobble(pts, amt):
    return [(x + rnd.uniform(-amt, amt), y + rnd.uniform(-amt, amt)) for x, y in pts]


def geo(poly):
    return [P(a, b) for a, b in poly]


W4, H4 = MW * K, MH * K

# ---------------- coast data (lat, lon), simplified by hand ----------------
MANHATTAN = [(40.8745, -73.9105), (40.8790, -73.9225), (40.8700, -73.9300), (40.8550, -73.9440), (40.8300, -73.9550),
             (40.8000, -73.9730), (40.7700, -73.9950), (40.7500, -74.0085), (40.7300, -74.0115), (40.7100, -74.0165),
             (40.7010, -74.0150), (40.7050, -73.9980), (40.7100, -73.9770), (40.7270, -73.9710), (40.7420, -73.9720),
             (40.7600, -73.9580), (40.7750, -73.9420), (40.7950, -73.9280), (40.8100, -73.9330), (40.8350, -73.9350),
             (40.8550, -73.9200), (40.8680, -73.9110)]
BRONX = [(41.000, -73.9150), (40.9100, -73.9150), (40.8820, -73.9255), (40.8760, -73.9125), (40.8600, -73.9170),
         (40.8350, -73.9310), (40.8150, -73.9330), (40.8010, -73.9280), (40.7990, -73.9100), (40.8020, -73.8900),
         (40.8060, -73.8700), (40.8100, -73.8200), (41.000, -73.8200)]
LONG_ISLAND = [(40.7900, -73.9100), (40.7750, -73.9350), (40.7600, -73.9450), (40.7450, -73.9580), (40.7350, -73.9600),
               (40.7200, -73.9620), (40.7050, -73.9750), (40.7000, -73.9900), (40.6950, -73.9990), (40.6850, -74.0050),
               (40.6750, -74.0200), (40.6650, -74.0100), (40.6500, -74.0200), (40.6350, -74.0350), (40.6100, -74.0400),
               (40.6050, -74.0300), (40.5980, -74.0100), (40.5900, -73.9950), (40.5800, -74.0040), (40.5740, -74.0100),
               (40.5720, -73.9900), (40.5730, -73.9700), (40.5780, -73.9400), (40.5850, -73.9250), (40.5950, -73.9000),
               (40.6000, -73.8800), (40.6050, -73.8400), (40.6000, -73.8000), (40.7800, -73.8000), (40.7850, -73.8800),
               (40.7850, -73.9050)]
NEW_JERSEY = [(41.000, -73.9250), (40.8800, -73.9350), (40.8500, -73.9520), (40.8000, -73.9850), (40.7600, -74.0100),
              (40.7300, -74.0280), (40.7000, -74.0350), (40.6800, -74.0500), (40.6650, -74.0700), (40.5000, -74.2000),
              (41.000, -74.2000)]
STATEN = [(40.6450, -74.0800), (40.6400, -74.0700), (40.6200, -74.0620), (40.6000, -74.0600), (40.5850, -74.0700),
          (40.5000, -74.1500), (40.6500, -74.1500)]
CENTRAL_PARK = [(40.7968, -73.9493), (40.8007, -73.9581), (40.7681, -73.9819), (40.7644, -73.9730)]
VCP = [(40.9120, -73.8970), (40.9100, -73.8650), (40.8840, -73.8780), (40.8880, -73.9000)]
WOODLAWN = [(40.9000, -73.8780), (40.8980, -73.8640), (40.8840, -73.8620), (40.8850, -73.8780)]
PROSPECT = [(40.6720, -73.9700), (40.6650, -73.9620), (40.6510, -73.9660), (40.6550, -73.9790)]
GREENWOOD = [(40.6600, -73.9960), (40.6550, -73.9850), (40.6480, -73.9890), (40.6520, -74.0000)]
HIGHWAYS = [
    [(40.5850, -73.9200), (40.5800, -73.9600), (40.5900, -74.0000), (40.6100, -74.0350), (40.6400, -74.0300), (40.6700, -74.0150)],
    [(40.7050, -74.0130), (40.7400, -74.0090), (40.7700, -73.9930), (40.8000, -73.9760), (40.8500, -73.9480)],
    [(40.7100, -73.9790), (40.7400, -73.9740), (40.7700, -73.9480), (40.8000, -73.9320)],
    [(40.8050, -73.9200), (40.8400, -73.9150), (40.8800, -73.9050), (40.9100, -73.8980)],
]
RIVERSIDE = [(40.8150, -73.9600), (40.8155, -73.9625), (40.7700, -73.9930), (40.7690, -73.9900)]

ROUTE = [(40.8970, -73.8860), (40.8900, -73.8800), (40.8780, -73.8880), (40.8620, -73.8960), (40.8480, -73.9050),
         (40.8280, -73.9250), (40.8080, -73.9450), (40.7937, -73.9722), (40.7680, -73.9820), (40.7500, -73.9880),
         (40.7359, -73.9906), (40.7180, -73.9950), (40.7050, -73.9900), (40.6800, -73.9750), (40.6450, -73.9700),
         (40.6100, -73.9750), (40.5774, -73.9812)]
OTHER_LINES = [
    [(40.8870, -73.8570), (40.8500, -73.8700), (40.8200, -73.8950), (40.8040, -73.9330), (40.7800, -73.9550), (40.7500, -73.9760),
     (40.7200, -73.9930), (40.7050, -74.0100)],
    [(40.8680, -73.9200), (40.8300, -73.9420), (40.8000, -73.9580), (40.7700, -73.9800), (40.7400, -73.9990), (40.7100, -74.0080)],
    [(40.7550, -73.8400), (40.7500, -73.9000), (40.7480, -73.9450), (40.7520, -73.9750), (40.7560, -73.9900)],
    [(40.7100, -73.9900), (40.6900, -73.9600), (40.6600, -73.9450), (40.6300, -73.9300), (40.6000, -73.9550), (40.5780, -73.9750)],
]


def mask_of(poly, wob=1.5 * K, n=8, closed=True):
    m = Image.new('L', (W4, H4), 0)
    ImageDraw.Draw(m).polygon(smooth(wobble(geo(poly), wob), n, closed), fill=255)
    return m


def lowfreq(seed, cell, amp):
    r = np.random.RandomState(seed)
    g = r.rand(H4 // cell + 2, W4 // cell + 2).astype(np.float32)
    im = Image.fromarray((g * 255).astype(np.uint8)).resize((W4, H4), Image.BICUBIC).filter(ImageFilter.GaussianBlur(cell * 0.4))
    return (np.asarray(im).astype(np.float32) / 255.0 - 0.5) * amp


def paint_map():
    x = np.linspace(0, 1, W4, dtype=np.float32)[None, :]
    y = np.linspace(0, 1, H4, dtype=np.float32)[:, None]
    # dawn factor: night on the left, sunrise on the right
    t = np.clip((x - 0.30) / 0.70, 0, 1) ** 1.6
    t = t * (0.85 + 0.15 * (1 - y))
    night = np.array([8, 11, 24], np.float32)
    dusk = np.array([34, 24, 52], np.float32)
    dawn = np.array([226, 122, 58], np.float32)
    mid = np.clip(t * 2, 0, 1)[..., None]
    hi = np.clip(t * 2 - 1, 0, 1)[..., None]
    water = night * (1 - mid) + dusk * mid
    water = water * (1 - hi) + dawn * hi
    water = water + lowfreq(5, 90 * K // 4, 16)[..., None]
    # sun glow, top right
    sx, sy = W4 * 1.0, H4 * 0.05
    dist = np.sqrt(((np.arange(W4)[None, :] - sx) / W4) ** 2 + ((np.arange(H4)[:, None] - sy) / H4 * 0.55) ** 2)
    glow = np.clip(1 - dist / 0.42, 0, 1) ** 2
    water = water + glow[..., None] * np.array([40, 46, 30], np.float32)
    img = Image.fromarray(np.clip(water, 0, 255).astype(np.uint8))

    # wave strokes in the water
    wv = Image.new('L', (W4, H4), 0); wd = ImageDraw.Draw(wv)
    for i in range(520):
        cx, cy = rnd.uniform(0, W4), rnd.uniform(0, H4)
        ln = rnd.uniform(14, 40) * K
        pts = [(cx + j * ln / 6, cy + math.sin(j * 1.1 + cx) * 1.5 * K) for j in range(7)]
        wd.line(pts, fill=rnd.randint(40, 90), width=max(1, int(0.9 * K)))
    wv = wv.filter(ImageFilter.GaussianBlur(0.6 * K))

    # land
    land = Image.new('L', (W4, H4), 0)
    for poly in (MANHATTAN, BRONX, LONG_ISLAND, NEW_JERSEY, STATEN):
        land = ImageChops.lighter(land, mask_of(poly))
    waves_col = Image.new('RGB', (W4, H4), (230, 220, 200))
    wmask = ImageChops.multiply(wv, ImageChops.invert(land).filter(ImageFilter.GaussianBlur(2 * K)))
    img = Image.composite(waves_col, img, wmask.point(lambda v: int(v * 0.55)))
    # shallow-water rim
    rim = land.filter(ImageFilter.GaussianBlur(9 * K))
    rim = ImageChops.subtract(rim, land)
    img = Image.composite(Image.new('RGB', (W4, H4), (120, 120, 130)), img, rim.point(lambda v: int(v * 0.35)))

    for i, rad in enumerate((4, 9, 15, 23, 33)):
        b = land.filter(ImageFilter.GaussianBlur(rad * K * 0.6)).point(lambda v: 255 if v > 14 else 0)
        ring = ImageChops.subtract(b, b.filter(ImageFilter.MinFilter(5))).filter(ImageFilter.GaussianBlur(0.5 * K))
        img = Image.composite(Image.new('RGB', (W4, H4), (196, 186, 170)), img, ring.point(lambda v, i=i: int(v * (0.42 - i * 0.07))))
    lt = t[..., None] if t.shape == (H4, W4) else np.broadcast_to(t, (H4, W4))[..., None]
    lnight = np.array([74, 71, 68], np.float32)
    ldawn = np.array([70, 46, 40], np.float32)
    lcol = lnight * (1 - lt) + ldawn * lt + lowfreq(11, 60 * K // 4, 22)[..., None] + lowfreq(12, 14 * K // 4, 10)[..., None] + lowfreq(13, 5 * K, 16)[..., None]
    lcol = lcol + glow[..., None] * np.array([18, 10, 4], np.float32)
    land_img = Image.fromarray(np.clip(lcol, 0, 255).astype(np.uint8))
    img = Image.composite(land_img, img, land)
    # coast highlight and inner shade
    edge = ImageChops.subtract(land, land.filter(ImageFilter.MinFilter(5)))
    edge = edge.filter(ImageFilter.GaussianBlur(0.8 * K))
    img = Image.composite(Image.new('RGB', (W4, H4), (214, 196, 168)), img, edge.point(lambda v: int(v * 0.85)))
    inner = ImageChops.subtract(land, land.filter(ImageFilter.MinFilter(4 * K + 1)).filter(ImageFilter.GaussianBlur(5 * K)))
    img = Image.composite(Image.new('RGB', (W4, H4), (20, 20, 22)), img, inner.point(lambda v: int(v * 0.30)))

    d = ImageDraw.Draw(img, 'RGBA')
    # Manhattan street grid, clipped to the island
    grid = Image.new('L', (W4, H4), 0); gd = ImageDraw.Draw(grid)
    a = P(40.75, -73.990); b = P(40.80, -73.955)
    ux, uy = b[0] - a[0], b[1] - a[1]; L = math.hypot(ux, uy); ux, uy = ux / L, uy / L
    vx, vy = -uy, ux
    for i in range(-80, 80):
        ox, oy = a[0] + vx * i * 4.2 * K, a[1] + vy * i * 4.2 * K
        gd.line([(ox - ux * 3000 * K, oy - uy * 3000 * K), (ox + ux * 3000 * K, oy + uy * 3000 * K)], fill=70, width=int(0.5 * K))
    for i in range(-300, 300):
        ox, oy = a[0] + ux * i * 2.2 * K, a[1] + uy * i * 2.2 * K
        gd.line([(ox - vx * 3000 * K, oy - vy * 3000 * K), (ox + vx * 3000 * K, oy + vy * 3000 * K)], fill=40, width=int(0.4 * K))
    mman = mask_of(MANHATTAN, wob=0)
    mman = mman.filter(ImageFilter.MinFilter(2 * K + 1))
    img = Image.composite(Image.new('RGB', (W4, H4), (150, 140, 130)), img, ImageChops.multiply(grid, mman).point(lambda v: int(v * 0.85)))
    # Brooklyn and Bronx blocks, a looser grid
    for poly, ang, sp in ((LONG_ISLAND, 0.18, 6.0), (BRONX, -0.05, 6.5)):
        g2 = Image.new('L', (W4, H4), 0); g2d = ImageDraw.Draw(g2)
        ca, sa = math.cos(ang), math.sin(ang)
        for i in range(-200, 400):
            o = i * sp * K
            g2d.line([(o * ca - 3000 * K * sa, o * sa + 3000 * K * ca), (o * ca + 3000 * K * sa, o * sa - 3000 * K * ca)], fill=50, width=int(0.4 * K))
            g2d.line([(o * sa * -1 - 3000 * K * ca, o * ca - 3000 * K * sa), (-o * sa + 3000 * K * ca, o * ca + 3000 * K * sa)], fill=50, width=int(0.4 * K))
        mm = mask_of(poly, wob=0).filter(ImageFilter.MinFilter(3 * K + 1))
        img = Image.composite(Image.new('RGB', (W4, H4), (150, 140, 130)), img, ImageChops.multiply(g2, mm).point(lambda v: int(v * 0.95)))

    # parks, with tree stipple
    d = ImageDraw.Draw(img, 'RGBA')
    for poly, col in ((CENTRAL_PARK, (44, 58, 40)), (VCP, (40, 54, 38)), (WOODLAWN, (52, 58, 44)), (RIVERSIDE, (44, 58, 40)), (PROSPECT, (44, 60, 40)), (GREENWOOD, (52, 58, 44))):
        pts = smooth(wobble(geo(poly), 0.8 * K), 6)
        d.polygon(pts, fill=col + (255,))
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        pm = Image.new('L', (W4, H4), 0); ImageDraw.Draw(pm).polygon(pts, fill=255)
        pa = np.asarray(pm)
        for i in range(int((max(xs) - min(xs)) * (max(ys) - min(ys)) / (K * K * 9))):
            px, py = rnd.uniform(min(xs), max(xs)), rnd.uniform(min(ys), max(ys))
            if pa[int(min(py, H4 - 1)), int(min(px, W4 - 1))]:
                r = rnd.uniform(0.8, 1.8) * K
                g = rnd.randint(64, 92)
                d.ellipse([px - r, py - r, px + r, py + r], fill=(g - 14, g, g - 22, 200))
    # the conclave: a ring of torches and a crowd in Van Cortlandt Park
    cx, cy = P(40.8970, -73.8860)
    for i in range(140):
        a_ = rnd.uniform(0, 2 * math.pi); rr = rnd.uniform(8, 17) * K
        px, py = cx + math.cos(a_) * rr, cy + math.sin(a_) * rr * 0.8
        d.ellipse([px - 0.7 * K, py - 0.7 * K, px + 0.7 * K, py + 0.7 * K], fill=(20, 18, 18, 230))

    # city lights, thinning out as the sun comes up
    la = np.asarray(land.filter(ImageFilter.MinFilter(3 * K + 1)))
    mm_ = np.asarray(mask_of(MANHATTAN, wob=0))
    for i in range(16000):
        px, py = rnd.uniform(0, W4 - 1), rnd.uniform(0, H4 - 1)
        if not la[int(py), int(px)]:
            continue
        dawnf = float(np.clip((px / W4 - 0.30) / 0.70, 0, 1))
        keep = (1 - dawnf) ** 1.5 * (1.0 if mm_[int(py), int(px)] else 0.38)
        if rnd.random() > keep:
            continue
        r = rnd.uniform(0.35, 0.9) * K
        al = rnd.randint(90, 230)
        d.ellipse([px - r, py - r, px + r, py + r], fill=(255, rnd.randint(190, 226), rnd.randint(110, 160), al))
    # parkways and highways, pale
    for ln in HIGHWAYS:
        d.line(smooth(geo(ln), 8, closed=False), fill=(214, 196, 168, 95), width=int(1.6 * K), joint='curve')
    # faint other lines
    for ln in OTHER_LINES:
        d.line(smooth(geo(ln), 8, closed=False), fill=(150, 146, 140, 120), width=int(2.2 * K), joint='curve')

    # dawn rays over the ocean
    rays = Image.new('L', (W4, H4), 0); rd = ImageDraw.Draw(rays)
    for i in range(14):
        a_ = math.radians(100 + i * 6.5 + rnd.uniform(-1.5, 1.5))
        rd.polygon([(sx, sy), (sx + math.cos(a_) * 2.2 * W4, sy + math.sin(a_) * 2.2 * W4),
                    (sx + math.cos(a_ + 0.03) * 2.2 * W4, sy + math.sin(a_ + 0.03) * 2.2 * W4)], fill=40)
    rays = rays.filter(ImageFilter.GaussianBlur(10 * K))
    rays = ImageChops.multiply(rays, Image.fromarray((np.clip(glow * 3, 0, 1) * 255).astype(np.uint8)))
    img = Image.composite(Image.new('RGB', (W4, H4), (255, 214, 150)), img, rays)
    d = ImageDraw.Draw(img, 'RGBA')

    # the route home: dark shadow, paper casing, maroon line
    rpts = smooth(geo(ROUTE), 12, closed=False)
    sh = Image.new('L', (W4, H4), 0)
    ImageDraw.Draw(sh).line([(x + 2 * K, y + 3 * K) for x, y in rpts], fill=150, width=int(11 * K), joint='curve')
    img = Image.composite(Image.new('RGB', (W4, H4), (0, 0, 0)), img, sh.filter(ImageFilter.GaussianBlur(3 * K)))
    d = ImageDraw.Draw(img, 'RGBA')
    d.line(rpts, fill=(238, 228, 208, 255), width=int(11 * K), joint='curve')
    d.line(rpts, fill=(128, 34, 38, 255), width=int(7.5 * K), joint='curve')
    # leather sheen on the line
    d.line([(x, y - 1.2 * K) for x, y in rpts], fill=(176, 72, 66, 150), width=int(1.6 * K), joint='curve')

    # Coney Island: wheel and the parachute tower in silhouette against the dawn
    wx, wy = P(40.5745, -73.9730)
    R = 30 * K
    wx, wy = wx - 20 * K, wy - 92 * K
    sil = (24, 16, 20, 255)
    d.line([(wx, wy), (wx - R * 0.55, wy + R * 1.35)], fill=sil, width=int(2.6 * K))
    d.line([(wx, wy), (wx + R * 0.55, wy + R * 1.35)], fill=sil, width=int(2.6 * K))
    d.ellipse([wx - R, wy - R, wx + R, wy + R], outline=sil, width=int(2.4 * K))
    d.ellipse([wx - R * 0.72, wy - R * 0.72, wx + R * 0.72, wy + R * 0.72], outline=sil, width=int(1.2 * K))
    for i in range(16):
        a_ = i * math.pi / 8
        d.line([(wx, wy), (wx + math.cos(a_) * R, wy + math.sin(a_) * R)], fill=sil, width=int(0.9 * K))
        gx, gy = wx + math.cos(a_) * R, wy + math.sin(a_) * R
        d.rectangle([gx - 2.6 * K, gy, gx + 2.6 * K, gy + 4.2 * K], fill=sil)
    d.ellipse([wx - 3 * K, wy - 3 * K, wx + 3 * K, wy + 3 * K], fill=sil)
    tx, ty = wx - 70 * K, wy + R * 1.35
    top = ty - 88 * K
    d.polygon([(tx - 9 * K, ty), (tx + 9 * K, ty), (tx + 2.4 * K, top), (tx - 2.4 * K, top)], outline=sil, width=int(1.6 * K))
    for i in range(1, 9):
        yy = ty - i * 10 * K; hw = 9 * K - (9 - 2.4) * K * i / 8.8
        d.line([(tx - hw, yy), (tx + hw, yy + 10 * K)], fill=sil, width=int(0.8 * K))
        d.line([(tx + hw, yy), (tx - hw, yy + 10 * K)], fill=sil, width=int(0.8 * K))
    for i in range(12):
        a_ = i * math.pi / 6
        d.line([(tx, top - 4 * K), (tx + math.cos(a_) * 16 * K, top - 4 * K + math.sin(a_) * 4 * K)], fill=sil, width=int(1.1 * K))
    d.ellipse([tx - 16 * K, top - 8 * K, tx + 16 * K, top - 0 * K], outline=sil, width=int(1.2 * K))
    d.line([(tx - 20 * K, ty), (wx + R * 1.2, ty)], fill=sil, width=int(1.4 * K))

    # stations
    for i, (la, lo) in enumerate([(40.8970, -73.8860), (40.8900, -73.8800), (40.8480, -73.9050), (40.7937, -73.9722),
                                  (40.7359, -73.9906)]):
        x, y = P(la, lo)
        r = 7.5 * K
        d.ellipse([x - r + 1.5 * K, y - r + 2.5 * K, x + r + 1.5 * K, y + r + 2.5 * K], fill=(0, 0, 0, 140))
        d.ellipse([x - r, y - r, x + r, y + r], fill=(244, 236, 220, 255), outline=(18, 18, 20, 255), width=int(2.6 * K))
    # terminal bullet
    x, y = P(40.5774, -73.9812)
    r = 19 * K
    d.ellipse([x - r + 2 * K, y - r + 3 * K, x + r + 2 * K, y + r + 3 * K], fill=(0, 0, 0, 150))
    d.ellipse([x - r, y - r, x + r, y + r], fill=(128, 34, 38, 255), outline=(244, 236, 220, 255), width=int(3 * K))
    f = ImageFont.truetype(F_SQ, int(28 * K))
    d.text((x, y + 1 * K), 'W', font=f, fill=(244, 236, 220, 255), anchor='mm')

    # region names, painted and spaced
    def region(text, la, lo, size, alpha, ang=0, col=(220, 206, 186)):
        f = ImageFont.truetype(F_SQ, int(size * K))
        sp = ' '.join(text)
        bb = ImageDraw.Draw(Image.new('L', (1, 1))).textbbox((0, 0), sp, font=f)
        tw, th = bb[2] - bb[0] + 20 * K, bb[3] - bb[1] + 20 * K
        tl = Image.new('L', (int(tw), int(th)), 0)
        ImageDraw.Draw(tl).text((tw / 2, th / 2), sp, font=f, fill=alpha, anchor='mm')
        tl = tl.rotate(ang, resample=Image.BICUBIC, expand=True)
        x, y = P(la, lo)
        layer = Image.new('L', (W4, H4), 0); layer.paste(tl, (int(x - tl.width / 2), int(y - tl.height / 2)))
        return Image.composite(Image.new('RGB', (W4, H4), col), img, layer)
    img = region('THE BRONX', 40.865, -73.862, 22, 120)
    mang = -math.degrees(math.atan2(-uy, -ux))
    img = region('MANHATTAN', 40.758, -73.968, 20, 110, mang)
    img = region('BROOKLYN', 40.655, -73.925, 24, 120)
    img = region('QUEENS', 40.745, -73.872, 18, 90)
    img = region('NEW JERSEY', 40.875, -74.010, 18, 70)
    img = region('HUDSON RIVER', 40.835, -73.968, 13, 90, mang)
    img = region('EAST RIVER', 40.762, -73.946, 12, 80, mang)
    img = region('ATLANTIC OCEAN', 40.588, -73.875, 16, 120, 0, (60, 30, 18))
    img = region('UPPER BAY', 40.668, -74.040, 13, 80)

    # soft edge vignette
    vg = Image.new('L', (W4, H4), 0); vd = ImageDraw.Draw(vg)
    for i in range(40):
        vd.rectangle([i * K, i * K, W4 - 1 - i * K, H4 - 1 - i * K], outline=int(max(0, 90 - i * 2.3)))
    vg = vg.filter(ImageFilter.GaussianBlur(12 * K))
    img = Image.composite(Image.new('RGB', (W4, H4), (6, 6, 8)), img, vg)

    img = img.resize((MW * OUT, MH * OUT), Image.LANCZOS)
    # fine paper grain over everything, very light
    g = np.random.RandomState(7).normal(0, 5, (MH * OUT, MW * OUT, 1)).astype(np.float32)
    arr = np.clip(np.asarray(img).astype(np.float32) + g, 0, 255).astype(np.uint8)
    Image.fromarray(arr).save(A('ride-home-map.jpg'), quality=92)


def paint_token():
    S = 4; R = 70; N = R * 2 * S + 40
    c = N // 2
    yy, xx = np.mgrid[0:N, 0:N].astype(np.float32)
    dx, dy = (xx - c) / (R * S), (yy - c) / (R * S)
    rr = np.sqrt(dx * dx + dy * dy)
    lightdir = (dx * -0.6 + dy * -0.8)
    base = np.array([196, 150, 72], np.float32)
    shade = (0.82 + 0.28 * lightdir)[..., None]
    col = base * shade
    # raised rim
    rim = (rr > 0.86) & (rr <= 1.0)
    col[rim] = (base * (0.95 + 0.35 * lightdir[rim][:, None]))
    col = col + lowfreq_small(N, 3) [..., None]
    alpha = np.clip((1.0 - rr) * R * S * 0.5, 0, 1)
    # punched centre, a plain round hole
    hole = rr < 0.17
    alpha[hole] = 0
    img = Image.fromarray(np.clip(col, 0, 255).astype(np.uint8)).convert('RGBA')
    img.putalpha(Image.fromarray((alpha * 255).astype(np.uint8)))
    d = ImageDraw.Draw(img)
    d.ellipse([c - 0.86 * R * S, c - 0.86 * R * S, c + 0.86 * R * S, c + 0.86 * R * S], outline=(120, 86, 36, 255), width=2 * S)
    d.ellipse([c - 0.19 * R * S, c - 0.19 * R * S, c + 0.19 * R * S, c + 0.19 * R * S], outline=(110, 78, 30, 255), width=2 * S)
    f = ImageFont.truetype(F_SQ, int(17 * S))

    def arc(text, radius, start, top=True):
        n = len(text)
        step = 11.5
        for i, ch in enumerate(text):
            a = math.radians(start + (i - (n - 1) / 2) * step * (1 if top else -1))
            x, y = c + math.cos(a) * radius, c + math.sin(a) * radius
            t = Image.new('RGBA', (40 * S, 40 * S), (0, 0, 0, 0))
            td = ImageDraw.Draw(t)
            td.text((20 * S + 1.2 * S, 20 * S + 1.2 * S), ch, font=f, fill=(250, 220, 150, 170), anchor='mm')
            td.text((20 * S, 20 * S), ch, font=f, fill=(96, 64, 22, 255), anchor='mm')
            rot = -math.degrees(a) - 90 if top else -math.degrees(a) + 90
            t = t.rotate(rot, resample=Image.BICUBIC)
            img.alpha_composite(t, (int(x - 20 * S), int(y - 20 * S)))
    arc('GOOD FOR ONE FARE', 0.66 * R * S, -90, True)
    arc('CITY TRANSIT', 0.66 * R * S, 90, False)
    img = img.resize((N // S * 2, N // S * 2), Image.LANCZOS)
    img.save(A('token.png'))


def lowfreq_small(n, seed):
    r = np.random.RandomState(seed)
    g = r.rand(n // 30 + 2, n // 30 + 2).astype(np.float32)
    im = Image.fromarray((g * 255).astype(np.uint8)).resize((n, n), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))
    return (np.asarray(im).astype(np.float32) / 255 - 0.5) * 30


if __name__ == '__main__':
    os.makedirs(os.path.join(D, 'assets'), exist_ok=True)
    paint_token()
    paint_map()
    print('painted')
