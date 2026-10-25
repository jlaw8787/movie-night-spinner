"""Paints the signature piece for the Liberty Island watch mess card (Escape from New York, 1981, set in 1997):
a Security Control plan of Manhattan Island Prison, turned on the grid so the island lies across the card.
Coastlines are real (NYC borough boundaries, NYC Open Data; New Jersey bank traced by hand).
The containment wall runs along the far shores, the bridges carry mine marks, the river patrol line runs
mid channel, Liberty Island is picked out in the accent ink. Engraved chart finish: hairline water,
hatched mainland, dark prison island with its avenue grid, slight two-ink misregistration.
Writes assets/prison-map.png (2x) and map_layout.json (label anchors in css px inside the map box)."""
import os, json, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
MW, MH, S = 880, 330, 2          # map box in css px, paint scale
W, H = MW * S, MH * S
PAPER = (222, 206, 166)
INK = (30, 36, 44)
ORANGE = (214, 84, 34)
random.seed(1988); np.random.seed(1988)

LAT0, LON0 = 40.7006, -74.0141   # the Battery, origin
KX, KY = 84.3, 111.0             # km per degree lon / lat here
B = math.radians(29.0)           # Manhattan grid bearing
U = (math.sin(B), math.cos(B))   # along the island (east, north)
WV = (-math.cos(B), math.sin(B)) # across, toward New Jersey
X0, X1 = -3.3, 21.9              # km along the axis shown
PXK = MW / (X1 - X0)
YC = 0.55                         # km across the axis at the centre of the box


def P(lat, lon):
    e, n = (lon - LON0) * KX, (lat - LAT0) * KY
    a = e * U[0] + n * U[1]
    c = e * WV[0] + n * WV[1]
    return ((a - X0) * PXK, MH / 2 - (c - YC) * PXK)


def PS(lat, lon):
    x, y = P(lat, lon)
    return (x * S, y * S)


geo = json.load(open(os.path.join(D, 'src', 'boroughs.geojson')))
land = Image.new('L', (W, H), 0)
manh = Image.new('L', (W, H), 0)
lib = Image.new('L', (W, H), 0)
dl, dm, dli = ImageDraw.Draw(land), ImageDraw.Draw(manh), ImageDraw.Draw(lib)
for f in geo['features']:
    name = f['properties']['boroname']
    for poly in f['geometry']['coordinates']:
        for k, ring in enumerate(poly):
            pts = [PS(lat, lon) for lon, lat in ring]
            fill = 255 if k == 0 else 0
            dl.polygon(pts, fill=fill)
            if name == 'Manhattan':
                lon_c = sum(p[0] for p in ring) / len(ring)
                lat_c = sum(p[1] for p in ring) / len(ring)
                if abs(lat_c - 40.6892) < 0.004 and abs(lon_c + 74.0445) < 0.005:
                    dli.polygon(pts, fill=fill)          # Liberty Island
                elif lat_c < 40.695 and lon_c < -74.03:
                    pass                                   # Ellis Island stays mainland
                else:
                    dm.polygon(pts, fill=fill)
# New Jersey bank, Bayonne to the Palisades, hand traced
NJ = [(40.640, -74.30), (40.648, -74.080), (40.662, -74.068), (40.680, -74.060), (40.693, -74.050),
      (40.703, -74.044), (40.712, -74.036), (40.719, -74.033), (40.728, -74.030), (40.737, -74.027),
      (40.748, -74.023), (40.758, -74.018), (40.768, -74.010), (40.780, -74.000), (40.795, -73.990),
      (40.810, -73.980), (40.826, -73.970), (40.842, -73.963), (40.855, -73.958), (40.870, -73.948),
      (40.885, -73.936), (40.905, -73.925), (40.95, -73.92), (40.95, -74.30)]
dl.polygon([PS(*p) for p in NJ], fill=255)
L = np.asarray(land) > 127
M = np.asarray(manh) > 127
LI = np.asarray(lib) > 127
mainland = L & ~M & ~LI

# the river zone: water within 2.2 km of the prison island; the wall stands on the mainland bank facing it
pxk = PXK * S
dist_m = ndimage.distance_transform_edt(~M)
ms = ndimage.gaussian_filter(mainland.astype(np.float32), 0.14 * pxk) > 0.5     # smoothed bank, the wall ignores piers
river = (~L) & (dist_m < 1.7 * pxk)
river = river & ~(ndimage.distance_transform_edt(~LI) < 0.9 * pxk)     # open water off Liberty stays clear
near_river = ndimage.distance_transform_edt(~river) < 0.3 * pxk
edge = ms & ~ndimage.binary_erosion(ms, iterations=2)
wall = ndimage.binary_dilation(edge & near_river, iterations=int(1.7 * S))
# patrol line: mid channel, where the distance to the island equals the distance to the mainland
dist_ml = ndimage.distance_transform_edt(~ms)
patrol = river & ~ms & (np.abs(dist_m - dist_ml) < 1.0 * S) & (dist_m > 6 * S) & (dist_ml > 6 * S)

img = Image.new('RGB', (W, H), PAPER)
px = np.asarray(img).astype(np.float32)


def lay(mask, colour, alpha):
    a = (mask.astype(np.float32) * alpha)[..., None]
    global px
    px = px * (1 - a) + np.array(colour, np.float32) * a


yy, xx = np.mgrid[0:H, 0:W]
# water: engraved horizontal hairlines, closer together near the shores
water = ~L
shore_d = np.minimum(ndimage.distance_transform_edt(water), 60 * S)
gap = 7 + (shore_d / (60 * S)) * 5
hair = ((yy % np.round(gap * S / 2 * 2).astype(int)) == 0)
lay(water & hair, INK, 0.30)
# a fine shore line round all water
coast = L & (ndimage.distance_transform_edt(L) <= 1.4 * S)
lay(coast & ~M, INK, 0.85)
# mainland: diagonal hatching, light
hatch = ((xx + yy) % (6 * S)) < 1.3 * S
lay(mainland & hatch, INK, 0.38)
# the prison island: solid dark ink
lay(M, INK, 0.94)
# avenue grid (runs with the axis) and cross streets every tenth, knocked out in paper, above Houston St
ax_px = 0.27 * pxk
st_px = 0.80 * pxk
aa, cc = xx / S, yy / S
grid_av = (np.abs(((yy + 3) % ax_px)) < 0.9 * S)
grid_st = (np.abs(((xx + 5) % st_px)) < 0.9 * S)
hx, _ = PS(40.7250, -73.9930)
grid = (grid_av | grid_st) & (xx > hx) & ndimage.binary_erosion(M, iterations=int(2.5 * S))
lay(grid, PAPER, 0.30)
# the park, knocked out lighter
park = Image.new('L', (W, H), 0)
ImageDraw.Draw(park).polygon([PS(40.7644, -73.9730), PS(40.7681, -73.9819), PS(40.8006, -73.9581), PS(40.7968, -73.9493)], fill=255)
pk = np.asarray(park) > 127
lay(pk, PAPER, 0.42)
lay(pk & (((xx - yy) % (5 * S)) < 1.2 * S), INK, 0.5)

# ink grain: the dark ink lies a little unevenly
noise = ndimage.gaussian_filter(np.random.rand(H // 4, W // 4), 2)
noise = np.kron(noise, np.ones((4, 4)))[:H, :W]
noise = (noise - noise.mean()) / noise.std()
dark = px.mean(axis=2, keepdims=True) < 90
px = np.where(dark, px + noise[..., None] * 7, px)

# second ink (orange), registered 1 px off: wall, patrol line, Liberty Island
o = 1
def sh(m): return np.roll(np.roll(m, o, 0), o, 1)
lay(sh(wall), ORANGE, 0.92)
dash = ((xx // (7 * S)) + (yy // (7 * S))) % 2 == 0
lay(sh(ndimage.binary_dilation(patrol, iterations=S) & dash), ORANGE, 0.85)
lay(sh(LI), ORANGE, 1.0)
lay(sh(LI & (ndimage.distance_transform_edt(LI) <= 1.2 * S)), INK, 0.9)
img = Image.fromarray(np.clip(px, 0, 255).astype(np.uint8))
d = ImageDraw.Draw(img)

# bridges: double rule with end ticks, mines as small crosses in orange
BR = {
    'brooklyn': ((40.7075, -73.9985), (40.7015, -73.9905)),
    'manhattan': ((40.7135, -73.9935), (40.7045, -73.9845)),
    'williamsburg': ((40.7155, -73.9805), (40.7105, -73.9620)),
    'b69': ((40.7665, -73.9545), (40.7560, -73.9370)),
    'triboro': ((40.7960, -73.9300), (40.7900, -73.9220)),
    'gwb': ((40.8517, -73.9505), (40.8540, -73.9630)),
}
for k, (a, b) in BR.items():
    (x1, y1), (x2, y2) = PS(*a), PS(*b)
    dx, dy = x2 - x1, y2 - y1
    ln = math.hypot(dx, dy); nx, ny = -dy / ln * 3 * S, dx / ln * 3 * S
    for s in (-1, 1):
        d.line([x1 + s * nx, y1 + s * ny, x2 + s * nx, y2 + s * ny], fill=INK, width=int(1.4 * S))
    d.line([x1, y1, x2, y2], fill=PAPER, width=int(2 * S))
    for t in (0.35, 0.65):
        cx, cy = x1 + dx * t, y1 + dy * t
        r = 3.2 * S
        d.line([cx - r, cy - r, cx + r, cy + r], fill=ORANGE, width=int(1.6 * S))
        d.line([cx - r, cy + r, cx + r, cy - r], fill=ORANGE, width=int(1.6 * S))

# twin towers, Lower Manhattan: two small squares knocked out
for lat, lon in ((40.7127, -74.0134), (40.7116, -74.0124)):
    x, y = PS(lat, lon)
    d.rectangle([x - 2.6 * S, y - 2.6 * S, x + 2.6 * S, y + 2.6 * S], fill=PAPER, outline=INK)
# the library: a small knocked-out block at 42nd and 5th
x, y = PS(40.7532, -73.9822)
d.rectangle([x - 3 * S, y - 2 * S, x + 3 * S, y + 2 * S], fill=PAPER)

# compass: north arrow turned with the grid, drawn as an engraved needle
cx, cy = (MW - 70) * S, (MH - 66) * S
ang = math.radians(-29) + math.pi / 2  # north on the page
nxp, nyp = -math.sin(B), -math.cos(B)   # north direction on page coords
# north in page coords: P of a point due north minus origin
x0p, y0p = P(LAT0, LON0); x1p, y1p = P(LAT0 + 0.01, LON0)
vx, vy = x1p - x0p, y1p - y0p; vl = math.hypot(vx, vy); vx, vy = vx / vl, vy / vl
R = 30 * S
d.ellipse([cx - R - 14 * S, cy - R - 14 * S, cx + R + 14 * S, cy + R + 14 * S], fill=PAPER)
tip = (cx + vx * R, cy + vy * R); tail = (cx - vx * R, cy - vy * R)
side = (-vy * 7 * S, vx * 7 * S)
d.ellipse([cx - R - 6 * S, cy - R - 6 * S, cx + R + 6 * S, cy + R + 6 * S], outline=INK, width=int(1.2 * S))
d.ellipse([cx - R - 2 * S, cy - R - 2 * S, cx + R + 2 * S, cy + R + 2 * S], outline=INK, width=int(0.8 * S))
d.polygon([tip, (cx + side[0], cy + side[1]), (cx, cy)], fill=INK)
d.polygon([tip, (cx - side[0], cy - side[1]), (cx, cy)], fill=ORANGE)
d.polygon([tail, (cx + side[0], cy + side[1]), (cx, cy)], fill=PAPER, outline=INK)
d.polygon([tail, (cx - side[0], cy - side[1]), (cx, cy)], fill=INK)
for k in range(36):
    t = k / 36 * 2 * math.pi
    r1 = R + 2 * S; r2 = R + (6 if k % 9 == 0 else 4) * S
    d.line([cx + math.cos(t) * r1, cy + math.sin(t) * r1, cx + math.cos(t) * r2, cy + math.sin(t) * r2], fill=INK, width=S)

# scale bar, bottom left: 0 to 2 miles
sx0, sy0 = 26 * S, 40 * S
d.rectangle([16 * S, 16 * S, 16 * S + 2 * 1.609 * pxk + 22 * S, 52 * S], fill=PAPER, outline=INK, width=S)
mi = 1.609 * pxk
for k in range(2):
    d.rectangle([sx0 + k * mi, sy0, sx0 + (k + 1) * mi, sy0 + 5 * S], fill=INK if k == 0 else PAPER, outline=INK, width=S)
# neat line with a fine double frame
d.rectangle([0, 0, W - 1, H - 1], outline=INK, width=int(2.4 * S))
d.rectangle([5 * S, 5 * S, W - 1 - 5 * S, H - 1 - 5 * S], outline=INK, width=S)
# grid ticks on the frame every 110 px
for gx in range(110, MW, 110):
    d.line([gx * S, 0, gx * S, 9 * S], fill=INK, width=S)
    d.line([gx * S, H - 9 * S, gx * S, H], fill=INK, width=S)
for gy in range(110, MH, 110):
    d.line([0, gy * S, 9 * S, gy * S], fill=INK, width=S)
    d.line([W - 9 * S, gy * S, W, gy * S], fill=INK, width=S)
img = img.filter(ImageFilter.GaussianBlur(0.35))
img.save(os.path.join(A, 'prison-map.png'))


def C(lat, lon):
    x, y = P(lat, lon)
    return [round(x, 1), round(y, 1)]


lay_out = {
    'liberty': C(40.6892, -74.0445), 'battery': C(40.7030, -74.0150), 'towers': C(40.7120, -74.0130),
    'library': C(40.7532, -73.9822), 'park': C(40.7820, -73.9660), 'harlem': C(40.8100, -73.9450),
    'b69': C(40.7610, -73.9460), 'gwb': C(40.8530, -73.9580), 'brooklyn': C(40.7045, -73.9945),
    'nj': C(40.7550, -74.0350), 'bklyn': C(40.6950, -73.9750), 'queens': C(40.7500, -73.9300),
    'hudson': C(40.7800, -74.0010), 'east': C(40.7350, -73.9690), 'bronx': C(40.8350, -73.9150),
    'compass': [MW - 70, MH - 66], 'scale': [26, 40], 'mi_px': round(1.609 * PXK, 1),
}
json.dump(lay_out, open(os.path.join(D, 'map_layout.json'), 'w'), indent=1)
print(lay_out)

# ---------------- manila card stock for both faces: soft mottling, aged edge vignette ----------------
FW, FH = 960, 672
for name, seed in (('paper-front.png', 1), ('paper-back.png', 2)):
    rs = np.random.RandomState(seed)
    w, h = FW * S, FH * S
    base = np.ones((h, w, 3), np.float32) * np.array([222, 207, 168], np.float32)
    m1 = ndimage.zoom(ndimage.gaussian_filter(rs.rand(h // 16, w // 16), 3), 16, order=1)[:h, :w]
    m1 = (m1 - m1.mean()) / m1.std()
    base += m1[..., None] * np.array([3.5, 3.5, 4], np.float32)
    yy2, xx2 = np.mgrid[0:h, 0:w]
    dx = np.abs(xx2 / w - 0.5) * 2; dy = np.abs(yy2 / h - 0.5) * 2
    v = np.clip(np.maximum(dx ** 6, dy ** 6) * 1.0 + (dx ** 2 + dy ** 2) * 0.05, 0, 1)
    base -= v[..., None] * np.array([34, 40, 48], np.float32)
    Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).save(os.path.join(A, name))

# ---------------- ID card photo: Rehme, cropped from the Security Control still ----------------
st = Image.open(os.path.join(A, 'still-control.jpg')).convert('RGB')
k = st.width / 2000
ph = st.crop((int(1440 * k), int(110 * k), int(1800 * k), int(560 * k))).resize((180, 225), Image.LANCZOS)
ph.save(os.path.join(A, 'id-photo.jpg'), quality=92)
