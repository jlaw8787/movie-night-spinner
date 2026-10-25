"""Paints the placemat art for Die Hard with a Vengeance (1995).
1. map-run.png: two-ink placemat map of Manhattan (real borough outlines, NYC Open Data via dwillis/nyc-maps)
   with the taxi race route, halftone water, yellow parks and the avenue grid.
2. jugs.png: the 5 and 3 gallon fountain jugs, heavy line with halftone water and a yellow spot ink.
3. still-avenue.jpg: TMDB still cropped for the header frame.
Writes map_layout.json (1x pixel positions of stops and labels) for build.py."""
import json, math, os
from PIL import Image, ImageDraw, ImageEnhance, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
INK, YEL, RED, PAPER = (27, 26, 23), (245, 194, 24), (214, 50, 42), (251, 248, 240)

# ---------- map ----------
MW, MH = 296, 497                     # 1x size in the layout
LON0, LON1, LAT1, LAT0 = -74.025, -73.915, 40.838, 40.698
KX = math.cos(math.radians(40.77))
S1 = MW / ((LON1 - LON0) * KX)        # 1x px per degree latitude
SS = 4                                 # draw scale (2x output, 2x supersample)


def P(lat, lon, s=SS):
    return ((lon - LON0) * KX * S1 * s, (LAT1 - lat) * S1 * s)


def dots(size, pitch, r, ang=45):
    """Rotated halftone dot screen as an L mask."""
    w, h = size
    m = Image.new('L', size, 0)
    d = ImageDraw.Draw(m)
    ca, sa = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    n = int((w + h) / pitch) + 2
    for i in range(-n, n):
        for j in range(-n, n):
            x = (i * ca - j * sa) * pitch
            y = (i * sa + j * ca) * pitch
            if -r <= x <= w + r and -r <= y <= h + r:
                d.ellipse((x - r, y - r, x + r, y + r), fill=255)
    return m


def paint_map():
    W, H = MW * SS, MH * SS
    gj = json.load(open(os.path.join(A, 'nyc-boroughs.geojson')))
    land = Image.new('L', (W, H), 0)
    man = Image.new('L', (W, H), 0)
    dl, dm = ImageDraw.Draw(land), ImageDraw.Draw(man)
    rings = []
    for f in gj['features']:
        for poly in f['geometry']['coordinates']:
            for k, ring in enumerate(poly):
                pts = [P(la, lo) for lo, la in ring]
                if len(pts) < 3:
                    continue
                dl.polygon(pts, fill=0 if k else 255)
                if f['properties']['BoroName'] == 'Manhattan':
                    dm.polygon(pts, fill=0 if k else 255)
                if k == 0:
                    rings.append(pts)
    # New Jersey shore (west bank of the Hudson), drawn by hand from the shoreline
    nj = [(40.700, -74.060), (40.705, -74.035), (40.716, -74.033), (40.728, -74.029), (40.740, -74.026),
          (40.752, -74.022), (40.766, -74.016), (40.780, -74.007), (40.792, -73.998), (40.804, -73.989),
          (40.818, -73.977), (40.830, -73.968), (40.845, -73.960), (40.860, -73.960), (40.860, -74.060)]
    njp = [P(a, b) for a, b in nj]
    dl.polygon(njp, fill=255)
    rings.append(njp[1:-2])

    img = Image.new('RGB', (W, H), PAPER)
    # water: black halftone, about 18 percent
    water = ImageChops.invert(land)
    scr = dots((W, H), 13, 2.5)
    img.paste(Image.new('RGB', (W, H), INK), (0, 0), ImageChops.multiply(water, scr))

    # parks in yellow, offset a hair for a two-ink print
    parks = Image.new('L', (W, H), 0)
    dp = ImageDraw.Draw(parks)
    cp = [P(40.7681, -73.9819), P(40.7644, -73.9730), P(40.7968, -73.9494), P(40.8006, -73.9581)]
    tsp = [P(40.7282, -73.9842), P(40.7270, -73.9790), P(40.7245, -73.9802), P(40.7259, -73.9853)]
    ys = [P(40.8310, -73.9290), P(40.8300, -73.9240), P(40.8280, -73.9250), P(40.8290, -73.9300)]
    for poly in (cp, tsp, ys):
        dp.polygon(poly, fill=255)
    img.paste(Image.new('RGB', (W, H), YEL), (5, -4), parks)

    # avenue grid north of Houston, inside Manhattan, outside the park
    grid = Image.new('L', (W, H), 0)
    dg = ImageDraw.Draw(grid)
    ax, ay = math.sin(math.radians(29)), -math.cos(math.radians(29))   # along an avenue (screen coords)
    sx, sy = -ay, ax                                                     # along a street
    ox, oy = P(40.758, -73.985)
    av = 0.28 / 111 * S1 * SS        # 280 m between avenues
    st = 0.80 / 111 * S1 * SS        # every tenth street
    L = 4000
    for i in range(-14, 16):
        cx, cy = ox + sx * av * i, oy + sy * av * i
        dg.line((cx - ax * L, cy - ay * L, cx + ax * L, cy + ay * L), fill=255, width=2)
    for i in range(-30, 40):
        cx, cy = ox + ax * st * i, oy + ay * st * i
        dg.line((cx - sx * L, cy - sy * L, cx + sx * L, cy + sy * L), fill=255, width=2)
    gm = Image.new('L', (W, H), 0)
    ImageDraw.Draw(gm).rectangle((0, 0, W, P(40.7255, -74)[1]), fill=255)
    grid = ImageChops.multiply(ImageChops.multiply(grid, man), gm)
    grid = ImageChops.subtract(grid, parks)
    img.paste(Image.new('RGB', (W, H), (150, 146, 136)), (0, 0), grid)

    # shorelines
    d = ImageDraw.Draw(img)
    for pts in rings:
        d.line(pts + [pts[0]] if pts is not rings[-1] else pts, fill=INK, width=6, joint='curve')

    # the run
    legs = [
        ('car', [(40.8205, -73.9501), (40.8130, -73.9530), (40.8003, -73.9583), (40.7745, -73.9712),
                 (40.7766, -73.9762), (40.7782, -73.9819)]),
        ('sub', [(40.7782, -73.9819), (40.7590, -73.9905), (40.7400, -73.9985), (40.7200, -74.0060),
                 (40.7069, -74.0113)]),
        ('car', [(40.7069, -74.0113), (40.7130, -74.0010), (40.7200, -73.9900), (40.7265, -73.9817)]),
        ('car', [(40.7265, -73.9817), (40.7380, -73.9760), (40.7560, -73.9640), (40.7760, -73.9470),
                 (40.7960, -73.9330), (40.8120, -73.9330), (40.8190, -73.9310), (40.8296, -73.9262)]),
    ]
    for kind, pts in legs:
        xy = [P(a, b) for a, b in pts]
        seg = []
        for (x0, y0), (x1, y1) in zip(xy, xy[1:]):
            n = max(1, int(math.hypot(x1 - x0, y1 - y0) / 4))
            seg += [(x0 + (x1 - x0) * t / n, y0 + (y1 - y0) * t / n) for t in range(n)]
        seg.append(xy[-1])
        dash, gap, w = (34, 20, 12) if kind == 'car' else (10, 14, 10)
        acc, on, run = 0, True, [seg[0]]
        for a, b in zip(seg, seg[1:]):
            acc += math.hypot(b[0] - a[0], b[1] - a[1])
            if on:
                run.append(b)
            if acc >= (dash if on else gap):
                if on and len(run) > 1:
                    d.line(run, fill=RED, width=w, joint='curve')
                on, acc, run = not on, 0, [b]
        if on and len(run) > 1:
            d.line(run, fill=RED, width=w, joint='curve')

    # north arrow, bottom right over Brooklyn and Queens water
    nx, ny = P(40.7055, -73.9255)
    d.polygon([(nx, ny - 70), (nx - 22, ny + 18), (nx, ny), (nx + 22, ny + 18)], fill=INK)
    d.polygon([(nx, ny - 70), (nx, ny), (nx + 22, ny + 18)], fill=YEL, outline=INK)

    img = img.resize((MW * 2, MH * 2), Image.LANCZOS)
    img.save(os.path.join(A, 'map-run.png'))

    def q(a, b):
        x, y = P(a, b, 1)
        return [round(x, 1), round(y, 1)]
    lay = {'stops': [q(40.8205, -73.9501), q(40.7880, -73.9655), q(40.7782, -73.9819), q(40.7069, -74.0113),
                     q(40.7265, -73.9817), q(40.8296, -73.9262)],
           'north': q(40.7055, -73.9255)}
    json.dump(lay, open(os.path.join(D, 'map_layout.json'), 'w'), indent=1)


# ---------- jugs ----------
def jug(d, x, y, w, h, level, scr_img, img):
    """x,y top-left of the body; w,h body size. Returns nothing; draws on d/img at 4x."""
    neck_w, neck_h = w * 0.36, h * 0.13
    cx = x + w / 2
    sh = h * 0.2                                    # shoulder height
    body = [(x, y + sh), (x + w * 0.12, y + sh * 0.25), (cx - neck_w / 2, y), (cx + neck_w / 2, y),
            (x + w * 0.88, y + sh * 0.25), (x + w, y + sh), (x + w, y + h - 30), (x + w - 30, y + h),
            (x + 30, y + h), (x, y + h - 30)]
    # yellow spot ink, offset like a loose second plate
    d.polygon([(px + 26, py + 16) for px, py in body], fill=YEL)
    # water, halftone inside the body below the level
    m = Image.new('L', img.size, 0)
    md = ImageDraw.Draw(m)
    md.polygon(body, fill=255)
    wl = y + h - h * level
    clip = Image.new('L', img.size, 0)
    cd = ImageDraw.Draw(clip)
    wave = [(x - 10, wl)] + [(x + t, wl + 7 * math.sin(t / 26)) for t in range(0, int(w) + 12, 6)] + \
           [(x + w + 10, y + h + 10), (x - 10, y + h + 10)]
    cd.polygon(wave, fill=255)
    water = ImageChops.multiply(m, clip)
    img.paste(Image.new('RGB', img.size, PAPER), (0, 0), m)
    img.paste(Image.new('RGB', img.size, INK), (0, 0), ImageChops.multiply(water, scr_img))
    d.line([(x + 4, wl + 7 * math.sin(t / 26)) for t in [0]] + [(x + t, wl + 7 * math.sin(t / 26)) for t in range(0, int(w), 6)],
           fill=INK, width=6)
    # neck, cap, ribs, highlight
    d.rectangle((cx - neck_w / 2, y - neck_h, cx + neck_w / 2, y + 4), fill=PAPER, outline=INK, width=12)
    d.rounded_rectangle((cx - neck_w / 2 - 14, y - neck_h - 46, cx + neck_w / 2 + 14, y - neck_h + 4), 12,
                        fill=RED, outline=INK, width=12)
    for k in range(1, 4):
        d.line((cx - neck_w / 2 - 6, y - neck_h - 46 + k * 12.5, cx + neck_w / 2 + 6, y - neck_h - 46 + k * 12.5), fill=INK, width=4)
    for fy in (0.42, 0.70):
        d.line((x + 8, y + h * fy, x + w - 8, y + h * fy), fill=INK, width=7)
    d.line(body + [body[0]], fill=INK, width=14, joint='curve')
    d.line((x + w * 0.16, y + sh + 30, x + w * 0.16, y + h * 0.38), fill=PAPER, width=16)
    d.line((x + w * 0.16, y + h * 0.47, x + w * 0.16, y + h * 0.62), fill=PAPER, width=16)
    # handle on the shoulder
    hx = x + w * 0.88
    d.arc((hx - 40, y + sh * 0.1 - 10, hx + 90, y + sh + 110), 250, 90, fill=INK, width=14)


def paint_jugs():
    JW, JH = 284, 140
    W, H = JW * 4, JH * 4
    img = Image.new('RGB', (W, H), PAPER)
    scr = dots((W, H), 12, 3.4)
    d = ImageDraw.Draw(img)
    # floor line and puddle
    d.ellipse((60, H - 70, 700, H - 18), fill=(236, 230, 214))
    d.ellipse((620, H - 60, 1080, H - 22), fill=(236, 230, 214))
    jug(d, 120, 150, 330, 360, 0.55, scr, img)
    d = ImageDraw.Draw(img)
    jug(d, 680, 250, 250, 260, 0.30, scr, img)
    d = ImageDraw.Draw(img)
    # splash drops
    for (x, y, r) in [(560, 120, 16), (600, 80, 11), (520, 70, 9), (1000, 160, 13), (1040, 120, 9), (60, 220, 11)]:
        d.ellipse((x - r, y - r * 1.3, x + r, y + r), fill=PAPER, outline=INK, width=6)
    img = img.resize((JW * 2, JH * 2), Image.LANCZOS)
    img.save(os.path.join(A, 'jugs.png'))


def crop_still():
    im = Image.open(os.path.join(A, 'still-avenue-src.jpg')).convert('RGB')
    w, h = 300, 106
    W, H = im.size
    nh = int(W / (w / h))
    y = int((H - nh) * 0.55)
    im = im.crop((0, y, W, y + nh)).resize((w * 2, h * 2), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(1.08)
    im.save(os.path.join(A, 'still-avenue.jpg'), quality=90)


paint_map()
paint_jugs()
crop_still()
print('painted')
