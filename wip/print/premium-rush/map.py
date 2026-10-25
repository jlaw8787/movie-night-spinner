"""Paints the signature map for the Premium Rush truck window sheet: Manhattan, 2012, grid turned upright
the way messengers read it, with the run from 116th St down to Chinatown in red.
Real shorelines from the NYC borough boundaries (src/new-york-city-boroughs.geojson) and Central Park from
the neighborhood file (src/manhattan.geojson). Street grid set from the park: 59th and 110th St, 5th Ave and CPW.
Three inks only: cab yellow paper, black, Wilee red. Painted at 2x. Writes assets/map.png and map_layout.json."""
import os, json, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
COLW, COLH = 316, 1344          # CSS px of the map column
K = 2                           # paint scale
W, H = COLW * K, COLH * K
YEL, BLK, RED = (245, 196, 49), (22, 22, 22), (193, 39, 45)
LAT0, LON0 = 40.78, -73.97
TH = math.radians(29)           # Manhattan grid bearing

def metres(lat, lon):
    return ((lon - LON0) * math.cos(math.radians(LAT0)) * 111320, (lat - LAT0) * 110540)

def rot(x, y):
    return (x * math.cos(TH) - y * math.sin(TH), x * math.sin(TH) + y * math.cos(TH))

def polys(geom):
    g = geom['coordinates']
    return [p for p in (g if geom['type'] == 'MultiPolygon' else [g])]

bor = json.load(open(os.path.join(D, 'src', 'new-york-city-boroughs.geojson')))['features']
hood = json.load(open(os.path.join(D, 'src', 'manhattan.geojson')))['features']
park = [f for f in hood if f['properties']['name'] == 'Central Park'][0]

def R(lat, lon): return rot(*metres(lat, lon))

# park bounds in the turned frame give the grid
pts = np.array([R(la, lo) for poly in polys(park['geometry']) for ring in poly[:1] for lo, la in ring])
PX0, PX1 = np.percentile(pts[:, 0], 2), np.percentile(pts[:, 0], 98)
PY0, PY1 = np.percentile(pts[:, 1], 2), np.percentile(pts[:, 1], 98)
AV = (PX1 - PX0) / 3            # 5th Ave to CPW is three avenue blocks
ST = (PY1 - PY0) / 51           # 59th to 110th

def grid(av, st):               # avenue number (5 = 5th, 8 = CPW), street number -> turned metres
    return (PX1 - (av - 5) * AV, PY0 + (st - 59) * ST)

# frame: Battery to about 127th St
S = 0.071 * K                   # px per metre at 2x
TOP_ST = 127.5
YTOP = 200 * K                  # CSS 186 is where the map starts under the title
X5 = 172 * K                    # where 5th Ave sits across the column
def P(xm, ym):                  # turned metres -> paint px
    gx0, gy0 = grid(5, TOP_ST)
    return (X5 + (xm - gx0) * S, YTOP + (gy0 - ym) * S)
def G(lat, lon): return P(*R(lat, lon))
def GA(av, st): return P(*grid(av, st))

img = Image.new('RGB', (W, H), BLK)
dr = ImageDraw.Draw(img)

# land masks
def mask_of(features):
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for f in features:
        for poly in polys(f['geometry']):
            md.polygon([G(la, lo) for lo, la in poly[0]], fill=255)
            for hole in poly[1:]:
                md.polygon([G(la, lo) for lo, la in hole], fill=0)
    return m
man = mask_of([f for f in bor if f['properties']['name'] == 'Manhattan'])
other = mask_of([f for f in bor if f['properties']['name'] != 'Manhattan'])
# New Jersey is not in the borough file: fill the far shore of the Hudson as land
nj = Image.new('L', (W, H), 0); njd = ImageDraw.Draw(nj)
hud = [(40.700, -74.032), (40.712, -74.031), (40.727, -74.026), (40.745, -74.024), (40.760, -74.016),
       (40.775, -74.006), (40.790, -73.996), (40.805, -73.985), (40.820, -73.975), (40.835, -73.962), (40.85, -73.952)]
njd.polygon([G(*p) for p in hud] + [G(40.85, -74.2), G(40.68, -74.2)], fill=255)
other = Image.fromarray(np.maximum(np.asarray(other), np.asarray(nj)))

# other land: yellow halftone dots on black (one ink, screened)
dots = Image.new('L', (W, H), 0); dd = ImageDraw.Draw(dots)
for yy in range(0, H, 7):
    for xx in range((yy // 7) % 2 * 3, W, 7):
        dd.ellipse((xx - 1.5, yy - 1.5, xx + 1.5, yy + 1.5), fill=255)
img.paste(Image.new('RGB', (W, H), YEL), (0, 0), Image.fromarray((np.asarray(dots) * (np.asarray(other) > 0)).astype('uint8')))
# shore line on the far banks
edge = other.filter(ImageFilter.FIND_EDGES)
img.paste(Image.new('RGB', (W, H), YEL), (0, 0), edge.point(lambda v: 255 if v > 60 else 0))

# Manhattan: solid paper yellow
img.paste(Image.new('RGB', (W, H), YEL), (0, 0), man)

# street layer, painted on its own and clipped to the island outside the park
st = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(st)
MAJOR = {14, 23, 34, 42, 57, 59, 72, 79, 86, 96, 110, 116, 125}
for n in range(14, 128):
    a, b = GA(13, n), GA(-1, n)
    sd.line([a, b], fill=255 if n in MAJOR else 120, width=3 if n in MAJOR else 1)
for av in (1, 2, 3, 3.5, 4, 4.5, 5, 6, 7, 8, 9, 10, 11, 12):
    top = 127.5 if av not in (12,) else 127.5
    sd.line([GA(av, 14), GA(av, top)], fill=255 if av in (5, 6, 7, 8, 1, 2, 3, 9, 10, 11) else 160, width=3)
# Broadway: on the grid north of 14th, real points below
bway_grid = [(10.6, 127.5), (10.55, 116), (10.5, 107), (10.45, 79), (10, 72), (8, 59), (7, 45), (6, 34), (5, 23), (4.6, 14)]
bway_geo = [(40.7350, -73.9910), (40.7300, -73.9925), (40.7254, -73.9968), (40.7192, -74.0018), (40.7142, -74.0060), (40.7049, -74.0137)]
bway = [GA(*p) for p in bway_grid] + [G(*p) for p in bway_geo[1:]]
sd.line(bway, fill=255, width=4)
# downtown: the real neighborhood lines stand in for the crooked streets below 14th
cut = GA(5, 14)[1]
low = Image.new('L', (W, H), 0); ld = ImageDraw.Draw(low)
for f in hood:
    if f['properties']['name'] in ('Central Park', 'Governors Island', 'Liberty Island', 'Ellis Island', "Randall's Island", 'Roosevelt Island', 'Marble Hill'):
        continue
    for poly in polys(f['geometry']):
        ld.line([G(la, lo) for lo, la in poly[0]], fill=200, width=2)
# Canal St, Houston St, Bowery, 7th Ave South and Varick
for line in ([(40.7228, -74.0108), (40.7208, -74.0050), (40.7190, -74.0018), (40.7166, -73.9988), (40.7140, -73.9935)],
             [(40.7290, -74.0108), (40.7275, -74.0040), (40.7254, -73.9968), (40.7235, -73.9905), (40.7210, -73.9790)],
             [(40.7255, -73.9918), (40.7180, -73.9945), (40.7138, -73.9975)],
             [(40.7378, -74.0012), (40.7330, -74.0035), (40.7285, -74.0054), (40.7232, -74.0062)]):
    ld.line([G(*p) for p in line], fill=255, width=3)
la = np.asarray(low).copy(); la[:int(cut), :] = 0
st = Image.fromarray(np.maximum(np.asarray(st) * (np.arange(H)[:, None] <= cut + 2), la).astype('uint8'))
pm = mask_of([park])
clip = (np.asarray(man) > 0) & (np.asarray(pm) == 0)
sa = (np.asarray(st).astype(float) * clip * 0.62).astype('uint8')
img.paste(Image.new('RGB', (W, H), BLK), (0, 0), Image.fromarray(sa))

# Central Park: dense black screen with the reservoir and the lake in solid black
pdots = Image.new('L', (W, H), 0); pd = ImageDraw.Draw(pdots)
for yy in range(0, H, 5):
    for xx in range((yy // 5) % 2 * 2, W, 5):
        pd.ellipse((xx - 1.4, yy - 1.4, xx + 1.4, yy + 1.4), fill=255)
img.paste(Image.new('RGB', (W, H), BLK), (0, 0), Image.fromarray((np.asarray(pdots) * (np.asarray(pm) > 0)).astype('uint8')))
pd2 = ImageDraw.Draw(img)
x0, y0 = GA(7.85, 96); x1, y1 = GA(5.25, 85.5)
pd2.ellipse((x0, y0, x1, y1), fill=BLK)
x0, y0 = GA(7.4, 79); x1, y1 = GA(6.3, 72.5)
pd2.ellipse((x0, y0, x1, y1), fill=BLK)
# park outline
edgep = pm.filter(ImageFilter.FIND_EDGES).point(lambda v: 255 if v > 60 else 0).filter(ImageFilter.MaxFilter(3))
img.paste(Image.new('RGB', (W, H), BLK), (0, 0), edgep)

# bridges: paper yellow over the water
for a, b in (((40.7085, -73.9985), (40.7035, -73.9925)), ((40.7120, -73.9940), (40.7050, -73.9880)),
             ((40.7160, -73.9810), (40.7110, -73.9640)), ((40.7598, -73.9615), (40.7525, -73.9409))):
    pa, pb = G(*a), G(*b)
    dr.line([pa, pb], fill=YEL, width=7); dr.line([pa, pb], fill=BLK, width=3)

# the run: 116th St to Chinatown, red with a black keyline
run_grid = [(10.55, 116), (10.5, 110), (8.0, 110), (7.75, 108), (7.7, 96), (7.72, 80), (7.8, 63), (8, 59.4), (7.4, 52), (7, 45), (7, 14)]
run_geo = [(40.7378, -74.0012), (40.7330, -74.0035), (40.7285, -74.0054), (40.7232, -74.0062), (40.7208, -74.0050), (40.7190, -74.0018), (40.7168, -73.9990)]
run = [GA(*p) for p in run_grid] + [G(*p) for p in run_geo]
dr.line(run, fill=BLK, width=17, joint='curve')
dr.line(run, fill=RED, width=10, joint='curve')
# chevrons down the line every so often
def chevrons(pts, every=110):
    acc = 0
    for (ax, ay), (bx, by) in zip(pts, pts[1:]):
        L = math.hypot(bx - ax, by - ay)
        if L == 0: continue
        ux, uy = (bx - ax) / L, (by - ay) / L
        t = every - acc
        while t < L:
            cx, cy = ax + ux * t, ay + uy * t
            px, py = -uy, ux
            dr.line([(cx - ux * 6 + px * 5, cy - uy * 6 + py * 5), (cx, cy), (cx - ux * 6 - px * 5, cy - uy * 6 - py * 5)], fill=YEL, width=3)
            t += every
        acc = (acc + L) % every
chevrons(run)

# soft print wear: big gentle mottle, no pixel noise
rng = np.random.default_rng(116)
mot = Image.fromarray((rng.random((14, 4)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(60))
m = (np.asarray(mot).astype(float) / 255 - 0.5) * 18
arr = np.clip(np.asarray(img).astype(float) + m[..., None], 0, 255).astype('uint8')
arr[:YTOP - 2] = BLK
Image.fromarray(arr).save(os.path.join(D, 'assets', 'map.png'))

# layout for the HTML labels (CSS px)
def css(p): return [round(p[0] / K, 1), round(p[1] / K, 1)]
lay = {
  'start': css(GA(10.55, 116)), 'park_in': css(GA(7.9, 110)), 'circle': css(GA(8, 59.4)), 'times': css(GA(7, 45)),
  'union': css(GA(7, 14)), 'canal': css(G(40.7215, -74.0060)), 'end': css(G(40.7168, -73.9990)),
  'park_mid': css(GA(6.5, 84)), 'hudson': css(GA(12.6, 70)), 'east': css(GA(0.2, 70)),
  'nj': css(G(40.765, -74.03)), 'bk': css(G(40.700, -73.975)), 'qn': css(G(40.752, -73.935)),
  'battery': css(G(40.701, -74.015)), 'st': {str(n): css(GA(12.2, n)) for n in (125, 110, 96, 86, 72, 59, 42, 34, 23, 14)},
  'av': {str(a): css(GA(a, 30)) for a in (1, 3, 5, 6, 7, 8, 10, 11)}
}
json.dump(lay, open(os.path.join(D, 'map_layout.json'), 'w'), indent=1)
print('map ok', lay['start'], lay['end'], lay['battery'], 'grid check 7th/14th', css(GA(7, 14)), 'geo', css(G(40.7378, -74.0012)))
