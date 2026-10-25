"""Paints the art and textures for the Liberty Island mess printout (Escape from New York, 1981, set in 1997).
The object is two pages of fanfold green-bar computer paper off a line printer at U.S. Police Force
Security Control: tractor strips with sprocket holes, pale green bands every half inch, and a
dot-matrix plot of the island that the printer hammers out in ribbon dots.
Writes assets/paper-p1.png, assets/paper-p2.png (bands, holes, perforations),
assets/plot-map.png (dot-matrix island plot), assets/wear-p1.png, assets/wear-p2.png, map_layout.json.
All images are drawn at 2x the page px (912 x 1056 css px, 9.5 x 11 in)."""
import os, json, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
FW, FH, S = 912, 1056, 2
PAPER = (246, 244, 236)
GREEN = (206, 228, 204)
INK = (40, 38, 48)
random.seed(1997); np.random.seed(1997)


def paper(name, band_start):
    W, H = FW * S, FH * S
    im = Image.new('RGB', (W, H), PAPER)
    d = ImageDraw.Draw(im)
    # green bands, half an inch each, alternating, across the printing area only (between the perfs)
    y = band_start
    while y < FH:
        d.rectangle([48 * S, y * S, 864 * S - 1, (y + 48) * S - 1], fill=GREEN)
        y += 96
    # thin green rule at each band edge, like the press plate leaves
    y = band_start
    while y < FH + 48:
        for yy in (y, y + 48):
            if 0 <= yy < FH:
                d.line([48 * S, yy * S, 864 * S, yy * S], fill=(186, 214, 184), width=1)
        y += 96
    # tractor-strip perforations: short slits every 4px
    for x in (48, 864):
        for yy in range(0, FH * S, 8):
            d.line([x * S, yy, x * S, yy + 4], fill=(196, 194, 186), width=2)
    # sprocket holes every half inch, centred in each strip; the grey of the desk shows through
    for cx in (24, 888):
        for k in range(11 * 2 + 1):
            cy = 24 + k * 48
            r = 7.5 * S
            d.ellipse([cx * S - r, cy * S - r, cx * S + r, cy * S + r], fill=(118, 116, 110))
            d.ellipse([cx * S - r + 2, cy * S - r + 2, cx * S + r - 1, cy * S + r - 1], fill=(138, 136, 130))
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    im.save(os.path.join(A, name))


paper('paper-p1.png', 0)
paper('paper-p2.png', 0)

# ---------------- dot-matrix plot of the island ----------------
# lat, lon, rough outline of Manhattan clockwise from the Battery
ISLAND = [(40.7003, -74.0170), (40.7060, -74.0190), (40.7150, -74.0160), (40.7280, -74.0110), (40.7420, -74.0090),
          (40.7550, -74.0070), (40.7680, -73.9960), (40.7800, -73.9880), (40.7950, -73.9780), (40.8100, -73.9690),
          (40.8250, -73.9590), (40.8400, -73.9490), (40.8550, -73.9410), (40.8680, -73.9310), (40.8760, -73.9260),
          (40.8790, -73.9220), (40.8740, -73.9110), (40.8650, -73.9150), (40.8520, -73.9260), (40.8350, -73.9330),
          (40.8180, -73.9340), (40.8040, -73.9300), (40.7960, -73.9290), (40.7870, -73.9380), (40.7760, -73.9430),
          (40.7620, -73.9560), (40.7500, -73.9660), (40.7400, -73.9720), (40.7270, -73.9730), (40.7130, -73.9770),
          (40.7100, -73.9890), (40.7060, -74.0000), (40.7020, -74.0100)]
LIBERTY = (40.6892, -74.0445)
BRIDGE69 = (40.7655, -73.9545)
LAT0, LON0, LAT1, LON1 = 40.888, -74.062, 40.676, -73.888
MW, MH = 330, 560          # css px of the plot box
coslat = math.cos(math.radians(40.78))
sx = MW / ((LON1 - LON0) * coslat)
sy = MH / (LAT0 - LAT1)
sc = min(sx, sy)
ox = (MW - (LON1 - LON0) * coslat * sc) / 2
oy = (MH - (LAT0 - LAT1) * sc) / 2


def P(lat, lon):
    return (ox + (lon - LON0) * coslat * sc, oy + (LAT0 - lat) * sc)


G = 4  # supersample for the mask
mask = Image.new('L', (MW * G, MH * G), 0)
ImageDraw.Draw(mask).polygon([(x * G, y * G) for x, y in (P(*p) for p in ISLAND)], fill=255)
m = np.asarray(mask) > 127
# the containment wall sits across the water on the far shores: dilate the island about 900 m
px_per_km = sc / 111.0 * G
wall_r = int(0.95 * px_per_km)
yy, xx = np.mgrid[-wall_r:wall_r + 1, -wall_r:wall_r + 1]
disk = (xx * xx + yy * yy) <= wall_r * wall_r
grown = ndimage.binary_dilation(m, structure=disk)
edge_island = m & ~ndimage.binary_erosion(m, iterations=G * 2)
edge_wall = grown & ~ndimage.binary_erosion(grown, iterations=G * 2)

DOT = 4.0                   # css px between printer dots (a coarse 24 dpi plot mode)
out = Image.new('RGBA', (MW * S, MH * S), (0, 0, 0, 0))
dd = ImageDraw.Draw(out)


def dot(cx, cy, r=1.55, a=None):
    a = a if a is not None else random.randint(150, 225)
    rr = r * S
    dd.ellipse([cx * S - rr, cy * S - rr, cx * S + rr, cy * S + rr], fill=INK + (a,))


def at(arr, x, y):
    X, Y = int(x * G), int(y * G)
    if 0 <= X < arr.shape[1] and 0 <= Y < arr.shape[0]:
        return arr[Y, X]
    return False


ny, nx = int(MH / DOT), int(MW / DOT)
for j in range(ny):
    for i in range(nx):
        x, y = (i + 0.5) * DOT, (j + 0.5) * DOT
        # outline of the island: every dot, solid
        win = edge_island[max(0, int((y - DOT / 2) * G)):int((y + DOT / 2) * G), max(0, int((x - DOT / 2) * G)):int((x + DOT / 2) * G)]
        if win.any():
            dot(x, y, 1.75)
            continue
        if at(m, x, y):
            # land: a light checker fill so the island reads as ground
            if (i + j) % 2 == 0 and (j % 2 == 0):
                dot(x, y, 1.15, random.randint(95, 150))
            continue
        winw = edge_wall[max(0, int((y - DOT / 2) * G)):int((y + DOT / 2) * G), max(0, int((x - DOT / 2) * G)):int((x + DOT / 2) * G)]
        if winw.any() and (i * 7 + j * 3) % 5 < 3:
            dot(x, y, 1.45)   # the wall, printed as a broken run of dots

# Liberty Island: a small solid block with a ring around it
lx, ly = P(*LIBERTY)
for dx in (-1, 0, 1):
    for dy in (-1, 0, 1):
        dot(lx + dx * DOT * 0.8, ly + dy * DOT * 0.8, 1.7)
for k in range(16):
    t = k / 16 * math.tau
    dot(lx + math.cos(t) * 12, ly + math.sin(t) * 12, 1.2)
# the bridge at 69th: three dots out into the East River, with a cross on it
bx, by = P(*BRIDGE69)
for k in range(1, 7):
    dot(bx + k * 3.4, by + k * 1.2, 1.5)
for k in (-2, -1, 0, 1, 2):
    dot(bx + 12 + k * 2.6, by + 4 + k * 2.6, 1.3)
    dot(bx + 12 + k * 2.6, by + 4 - k * 2.6, 1.3)

# ribbon wear: the plot fades a little toward the bottom of the run
arr = np.asarray(out).astype(float)
fade = np.linspace(1.0, 0.82, arr.shape[0])[:, None]
arr[..., 3] *= fade
Image.fromarray(arr.astype(np.uint8)).save(os.path.join(A, 'plot-map.png'))

layout = {"w": MW, "h": MH, "liberty": [round(lx, 1), round(ly, 1)], "bridge": [round(bx, 1), round(by, 1)],
          "battery": [round(v, 1) for v in P(40.7003, -74.0170)], "harlem": [round(v, 1) for v in P(40.835, -73.933)],
          "hudson": [round(v, 1) for v in P(40.80, -73.985)], "wall_w": [round(v, 1) for v in P(40.83, -73.975)]}
json.dump(layout, open(os.path.join(D, 'map_layout.json'), 'w'), indent=1)

# ---------------- soft wear ----------------
def soft_noise(w, h, scale, seed):
    rs = np.random.RandomState(seed)
    small = rs.rand(max(2, h // scale), max(2, w // scale))
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(scale / 3))).astype(float) / 255.0


def wear(name, seed, ring=None):
    W, H = FW * S, FH * S
    a = np.zeros((H, W), float)
    col = np.zeros((H, W, 3), float)
    col[...] = (150, 132, 96)
    n = soft_noise(W, H, 160, seed)
    a += np.clip(n - 0.45, 0, 1) * 30          # big gentle mottling
    # edge wear: handled pages darken a little at the corners and edges
    yy, xx = np.mgrid[0:H, 0:W]
    ex = np.minimum(xx, W - 1 - xx) / W
    ey = np.minimum(yy, H - 1 - yy) / H
    e = np.clip(1 - np.minimum(ex * 9, 1), 0, 1) ** 2 + np.clip(1 - np.minimum(ey * 11, 1), 0, 1) ** 2
    a += e * 34
    # a soft crease where the fanfold stack pressed on the page above
    a += np.exp(-((yy - H * 0.47) / 5.0) ** 2) * 14
    out = np.dstack([col, a])
    if ring:
        cx, cy, r = [v * S for v in ring]
        dist = np.sqrt((xx - cx) ** 2 + ((yy - cy) * 1.04) ** 2)
        band = np.exp(-((dist - r) / (2.6 * S)) ** 2) * 62
        inner = np.clip(1 - dist / r, 0, 1) ** 0.5 * 12 * (dist < r)
        broken = 0.55 + 0.45 * soft_noise(W, H, 40, seed + 9)
        ra = (band + inner) * broken
        rc = np.array([118, 74, 38], float)
        tot = out[..., 3] + ra
        w2 = np.where(tot > 0, ra / np.maximum(tot, 1e-6), 0)[..., None]
        out[..., :3] = out[..., :3] * (1 - w2) + rc * w2
        out[..., 3] = tot
    out[..., 3] = np.clip(out[..., 3], 0, 120)
    Image.fromarray(out.astype(np.uint8), 'RGBA').save(os.path.join(A, name))


wear('wear-p1.png', 11, ring=(760, 980, 54))
wear('wear-p2.png', 23)
print('painted', layout)
