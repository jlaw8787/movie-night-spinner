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
INK = (36, 34, 46)
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
    # torn fanfold perforation along the top and bottom: the ties leave ragged nubs and a grey shadow line
    d = ImageDraw.Draw(im)
    rr = random.Random(name)
    for y0, sgn in ((0, 1), (FH * S - 1, -1)):
        d.line([0, y0 + sgn * 3, FW * S, y0 + sgn * 3], fill=(214, 211, 202), width=2)
        for x in range(0, FW * S, 8):
            h = rr.choice((2, 3, 4, 5, 6))
            w = rr.choice((3, 4, 5))
            sh = rr.randint(150, 190)
            d.rectangle([x, min(y0, y0 + sgn * h), x + w, max(y0, y0 + sgn * h)], fill=(sh, sh - 2, sh - 8))
            if rr.random() < 0.35:   # a loose paper fiber
                fx = x + rr.randint(0, 6)
                d.line([fx, y0 + sgn * (h + 1), fx + rr.randint(-3, 3), y0 + sgn * (h + rr.randint(3, 7))], fill=(200, 197, 188), width=1)
    im.save(os.path.join(A, name))


paper('paper-p1.png', 0)
paper('paper-p2.png', 0)

# ---------------- dot-matrix plot of the island ----------------
# lat, lon, rough outline of Manhattan clockwise from the Battery
ISLAND = [  # west side, Hudson, Battery north to Spuyten Duyvil
    (40.7006, -74.0141), (40.7033, -74.0172), (40.7080, -74.0190), (40.7140, -74.0172), (40.7205, -74.0140),
    (40.7300, -74.0115), (40.7400, -74.0105), (40.7465, -74.0095), (40.7545, -74.0075), (40.7645, -74.0000),
    (40.7730, -73.9935), (40.7870, -73.9855), (40.8000, -73.9760), (40.8150, -73.9640), (40.8270, -73.9555),
    (40.8400, -73.9500), (40.8517, -73.9475), (40.8650, -73.9330), (40.8730, -73.9270), (40.8775, -73.9225),
    # Harlem River, north to south
    (40.8740, -73.9110), (40.8620, -73.9145), (40.8460, -73.9285), (40.8280, -73.9330), (40.8195, -73.9335),
    (40.8130, -73.9340), (40.8075, -73.9300), (40.8000, -73.9300),
    # East River, north to south
    (40.7925, -73.9375), (40.7830, -73.9425), (40.7755, -73.9430), (40.7650, -73.9535), (40.7590, -73.9590),
    (40.7490, -73.9680), (40.7365, -73.9745), (40.7300, -73.9725), (40.7180, -73.9745), (40.7125, -73.9765),
    (40.7110, -73.9800), (40.7075, -73.9905), (40.7060, -73.9970), (40.7030, -74.0060), (40.7010, -74.0130)]
LIBERTY = (40.6892, -74.0445)
BRIDGE69 = (40.7660, -73.9530)
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
grown = ndimage.distance_transform_edt(~m) <= wall_r
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
        if at(m, x, y):
            # land: a light checker fill so the island reads as ground
            if (i + j) % 2 == 0 and (j % 2 == 0):
                dot(x, y, 1.15, random.randint(95, 150))
            continue
        winw = edge_wall[max(0, int((y - DOT / 2) * G)):int((y + DOT / 2) * G), max(0, int((x - DOT / 2) * G)):int((x + DOT / 2) * G)]
        if winw.any() and (i * 7 + j * 3) % 5 < 3:
            dot(x, y, 1.45)   # the wall, printed as a broken run of dots

# the shoreline: plotted along the outline in a fine graphics mode, every 2 px, snapped to its grid
pts = [P(*p) for p in ISLAND] + [P(*ISLAND[0])]
seen = set()
for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
    n = max(1, int(math.hypot(x1 - x0, y1 - y0) / 1.0))
    for t in range(n):
        x = x0 + (x1 - x0) * t / n; y = y0 + (y1 - y0) * t / n
        key = (round(x / 2.0), round(y / 2.0))
        if key in seen:
            continue
        seen.add(key)
        dot(key[0] * 2.0, key[1] * 2.0, 1.4, random.randint(170, 225))

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
    a = np.zeros((H, W), np.float32)
    col = np.zeros((H, W, 3), np.float32)
    col[...] = (150, 132, 96)
    n = soft_noise(W, H, 160, seed)
    a += np.clip(n - 0.45, 0, 1) * 30          # big gentle mottling
    # edge wear: handled pages darken a little at the corners and edges
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
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


wear('wear-p1.png', 11, ring=(770, 1012, 50))

# rubber stamp, inked unevenly: red with voids where the pad ran dry, slightly rotated
from PIL import ImageFont
SW, SH = 250, 120
st = Image.new('L', (SW * S, SH * S), 0)
sd = ImageDraw.Draw(st)
bx0, by0, bx1, by1 = 24 * S, 24 * S, (SW - 24) * S, (SH - 24) * S
sd.rounded_rectangle([bx0, by0, bx1, by1], radius=5 * S, outline=255, width=4 * S)
fbig = ImageFont.truetype(os.path.join(D, 'fonts', 'BlackOpsOne-Regular.ttf'), 30 * S)
fsm = ImageFont.truetype(os.path.join(D, 'fonts', 'BlackOpsOne-Regular.ttf'), 14 * S)
cx = SW * S / 2
sd.text((cx, 52 * S), 'FILE COPY', font=fbig, fill=255, anchor='mm')
sd.text((cx, 80 * S), 'SECURITY  CONTROL', font=fsm, fill=255, anchor='mm')
st = st.rotate(5, resample=Image.BICUBIC, expand=False)
ink = np.asarray(st).astype(np.float32) / 255.0
n1 = soft_noise(SW * S, SH * S, 18, 77)
n2 = soft_noise(SW * S, SH * S, 4, 78)
dens = np.clip(0.86 + (n1 - 0.5) * 0.9 + (n2 - 0.5) * 0.6, 0, 1)
dens = np.where(n2 < 0.2, dens * 0.35, dens)          # dry speckles
alpha = ink * dens * 225
img = np.zeros((SH * S, SW * S, 4), np.uint8)
img[..., 0], img[..., 1], img[..., 2] = 176, 52, 44
img[..., 3] = np.clip(alpha, 0, 255).astype(np.uint8)
Image.fromarray(img, 'RGBA').filter(ImageFilter.GaussianBlur(0.5)).save(os.path.join(A, 'stamp-file-copy.png'))
print('painted', layout)
