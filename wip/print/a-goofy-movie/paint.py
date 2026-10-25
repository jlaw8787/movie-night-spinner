"""Paints the art for the Lester's Possum Park placemat (A Goofy Movie, 1995).

assets/route-map.jpg   real 1950 Bureau of Public Roads US highway map (LOC, public domain), cropped to the band
                       from Lake Destiny down to L.A. Route line and pins are HTML/SVG overlays in build.py
assets/wear-front.png  soft edge wear and big gentle mottling
assets/still-map.jpg   TMDB still, cropped (Goofy and Max with the road map)
assets/postcard.jpg    public domain Tichnor linen postcard, cropped and warmed
map_layout.json        label anchor points for build.py
"""
import os, json, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 2
W, H = 1344, 960
MW, MH = 854, 246          # map box in px at 1x

INK = (52, 32, 79)
ORANGE = (224, 69, 43)
LAND = (226, 228, 186)
FIELD = (196, 206, 150)
WATER = (128, 178, 201)
WATER_D = (74, 128, 160)


def P(fx, fy):
    return (fx * MW * S, fy * MH * S)


def bez(pts, n=80):
    """Catmull-Rom through points, returns a dense polyline."""
    out = []
    p = [pts[0]] + pts + [pts[-1]]
    for i in range(1, len(p) - 2):
        p0, p1, p2, p3 = p[i - 1], p[i], p[i + 1], p[i + 2]
        for k in range(n):
            t = k / n
            t2, t3 = t * t, t * t * t
            x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
            y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
            out.append((x, y))
    out.append(p[-2])
    return out


def line(d, pts, col, w):
    d.line(pts, fill=col, width=w, joint='curve')
    r = w / 2
    for x, y in (pts[0], pts[-1]):
        d.ellipse([x - r, y - r, x + r, y + r], fill=col)


def blob(cx, cy, rx, ry, seed, n=40):
    rnd = random.Random(seed)
    ph = [rnd.uniform(0, 6.28) for _ in range(3)]
    pts = []
    for i in range(n):
        a = i / n * 2 * math.pi
        k = 1 + 0.13 * math.sin(3 * a + ph[0]) + 0.08 * math.sin(5 * a + ph[1]) + 0.05 * math.sin(7 * a + ph[2])
        pts.append((cx + rx * k * math.cos(a), cy + ry * k * math.sin(a)))
    return pts


def route_map():
    """Painted relief road map: hillshaded terrain, Midwest fields, forests, lake, desert, ocean, the fork."""
    import numpy as np
    w, h = MW * S, MH * S
    rng = np.random.default_rng(11)

    def noise(gx, gy, blur):
        g = Image.fromarray((rng.random((gy, gx)) * 255).astype('uint8'))
        g = g.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))
        return np.asarray(g, dtype=float) / 255.0

    X, Y = np.meshgrid(np.linspace(0, 1, w), np.linspace(0, 1, h))
    rough = 0.45 * noise(24, 7, 6) + 0.3 * noise(60, 17, 3) + 0.17 * noise(140, 40, 1) + 0.08 * noise(300, 86, 0)
    ridges = 1 - np.abs(2 * (0.6 * noise(26, 8, 6) + 0.4 * noise(70, 20, 2)) - 1)
    bt = np.clip((X - 0.40) / 0.14, 0, 1)
    belt = bt * bt * (3 - 2 * bt) * np.clip((0.95 - X) / 0.05, 0, 1)
    north = np.clip((0.78 - Y) / 0.35, 0.25, 1)
    height = 0.025 * rough + belt * north * (0.5 * ridges ** 2.2 + 0.32 * rough)
    # lake basin
    lx, ly = 0.725, 0.24
    d2 = ((X - lx) / 0.075) ** 2 + ((Y - ly) / 0.11) ** 2
    height = height * np.clip(d2 / 2.5, 0.2, 1)

    gy, gx = np.gradient(height * 150)
    shade = np.clip(0.78 + 0.34 * (-gx * 0.7 - gy * 0.7) / np.sqrt(1 + gx ** 2 + gy ** 2), 0.35, 1.25)

    def ramp(v):
        stops = [(0.0, (124, 186, 74)), (0.12, (150, 196, 86)), (0.26, (196, 186, 104)), (0.42, (168, 128, 82)), (0.6, (140, 104, 74)), (0.75, (246, 242, 230))]
        out = np.zeros(v.shape + (3,))
        for (a, ca), (b, cb) in zip(stops, stops[1:]):
            m = (v >= a) & (v < b)
            t = ((v - a) / (b - a))[m][:, None]
            out[m] = np.array(ca) * (1 - t) + np.array(cb) * t
        out[v >= stops[-1][0]] = stops[-1][1]
        return out
    col = ramp(height)
    # desert south-west, warm sand
    desert = np.clip((Y - 0.55) / 0.15, 0, 1) * np.clip((X - 0.52) / 0.1, 0, 1) * (height < 0.42)
    col = col * (1 - desert[..., None] * 0.85) + np.array((236, 196, 120)) * desert[..., None] * 0.85
    # forests: dark green mottling around the lake and the north road
    forest = (noise(120, 34, 1) > 0.52) * np.clip(1 - ((X - 0.62) / 0.2) ** 2 - ((Y - 0.28) / 0.38) ** 2, 0, 1) * (height < 0.5)
    col = col * (1 - forest[..., None] * 0.6) + np.array((46, 112, 58)) * forest[..., None] * 0.6
    col = np.clip(col * shade[..., None], 0, 255)
    im = Image.fromarray(col.astype('uint8'), 'RGB')
    d = ImageDraw.Draw(im)
    rnd = random.Random(5)

    # Midwest fields: a patchwork grid east of the mountains
    lay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    ld = ImageDraw.Draw(lay)
    gyi = 0
    while gyi < h:
        rh = rnd.choice([22, 28, 34])
        gxi = 0
        while gxi < w * 0.42:
            rw = rnd.choice([26, 34, 44, 52])
            if rnd.random() < 0.6:
                c = rnd.choice([(176, 214, 96), (206, 214, 112), (226, 206, 118), (120, 176, 70)])
                ld.rectangle([gxi + 1, gyi + 1, gxi + rw - 1, gyi + rh - 1], fill=c + (95,))
            gxi += rw
        gyi += rh
    im = Image.alpha_composite(im.convert('RGBA'), lay).convert('RGB')
    d = ImageDraw.Draw(im)
    # soften the field edge into the foothills
    fade = Image.new('L', (w, h), 0)
    fd = ImageDraw.Draw(fade)
    for k in range(59, -1, -1):
        fd.rectangle([0, 0, int(w * (0.34 + k * 0.0012)), h], fill=int(255 * (1 - k / 60)))
    base = Image.fromarray(col.astype('uint8'), 'RGB')
    im = Image.composite(im, base, fade.filter(ImageFilter.GaussianBlur(30)))
    d = ImageDraw.Draw(im)

    # ocean with depth bands and surf line
    coast = [(w * 0.935 + 14 * math.sin(y / 41) + 8 * math.sin(y / 11), y) for y in range(-10, h + 20, 6)]
    d.polygon(coast + [(w + 10, h + 10), (w + 10, -10)], fill=(40, 140, 196))
    for k, c in ((10, (58, 158, 210)), (26, (30, 120, 180)), (48, (22, 100, 160))):
        d.line([(x + k, y) for x, y in coast], fill=c, width=8)
    d.line(coast, fill=(250, 250, 240), width=5)
    d.line([(x - 3, y) for x, y in coast], fill=(218, 196, 140), width=4)

    # river from the mountains, east across the plains
    river = bez([P(0.56, 0.5), P(0.48, 0.66), P(0.40, 0.74), P(0.30, 0.82), P(0.18, 0.78), P(0.08, 0.9), P(0.0, 0.94)], 50)
    line(d, river, (36, 120, 180), 6)
    line(d, river, (96, 176, 222), 3)

    # Lake Destiny
    lxp, lyp = P(lx, ly)
    lake = blob(lxp, lyp, 62 * S, 26 * S, 3)
    d.polygon(lake, fill=(38, 132, 196))
    for k, c in ((0.78, (60, 156, 214)), (0.5, (92, 178, 226))):
        d.polygon(blob(lxp, lyp, 62 * S * k, 26 * S * k, 3), fill=c)
    d.line(lake + [lake[0]], fill=(250, 250, 240), width=3)
    # dock and rowboat
    dx0, dy0 = lxp + 40 * S, lyp + 12 * S
    d.rectangle([dx0, dy0, dx0 + 22 * S, dy0 + 4 * S], fill=(120, 80, 44), outline=INK)

    # pine stands
    def pine(x, y, s):
        d.polygon([(x - s * 0.45, y), (x, y - s * 1.3), (x + s * 0.45, y)], fill=(30, 92, 48), outline=(22, 60, 36))
        d.line([(x, y), (x, y + s * 0.25)], fill=(80, 50, 30), width=3)
    for _ in range(70):
        fx, fy = rnd.uniform(0.5, 0.86), rnd.uniform(0.05, 0.6)
        if ((fx - lx) / 0.08) ** 2 + ((fy - ly) / 0.14) ** 2 < 1.1:
            continue
        if rnd.random() < 0.5 and not (0.58 < fx < 0.82):
            continue
        x, y = P(fx, fy)
        pine(x, y, rnd.uniform(8, 12) * S)

    # roads
    main = bez([P(0.03, 0.62), P(0.12, 0.66), P(0.205, 0.56), P(0.30, 0.62), P(0.385, 0.58)], 90)
    northr = bez([P(0.385, 0.58), P(0.46, 0.50), P(0.55, 0.47), P(0.62, 0.36), P(0.69, 0.30)], 90)
    south = bez([P(0.385, 0.58), P(0.47, 0.74), P(0.6, 0.82), P(0.74, 0.80), P(0.84, 0.74), P(0.905, 0.70)], 90)
    for pts in (northr, south, main):
        line(d, pts, (250, 244, 226), 19)
    for pts in (northr, south, main):
        line(d, pts, INK, 14)
    for pts in (northr, south, main):
        line(d, pts, ORANGE, 9)
    for pts in (main, northr, south):
        for i in range(0, len(pts) - 6, 14):
            d.line(pts[i:i + 6], fill=(255, 238, 190), width=2)

    # Bigfoot footprints crossing the north road
    for i in range(6):
        fx, fy = 0.505 + i * 0.016, 0.30 + i * 0.05 + (0.012 if i % 2 else -0.012)
        x, y = P(fx, fy)
        d.ellipse([x - 3 * S, y - 5 * S, x + 3 * S, y + 5 * S], fill=(60, 38, 26))
        for t in range(4):
            d.ellipse([x - 4 * S + t * 2.2 * S, y - 8 * S, x - 2.4 * S + t * 2.2 * S, y - 6.2 * S], fill=(60, 38, 26))

    # Spoonerville houses
    for i, (fx, fy) in enumerate([(0.03, 0.47), (0.055, 0.44), (0.075, 0.49), (0.045, 0.53)]):
        x, y = P(fx, fy)
        d.rectangle([x - 7 * S, y - 6 * S, x + 7 * S, y + 4 * S], fill=(250, 244, 226), outline=INK, width=2)
        d.polygon([(x - 9 * S, y - 6 * S), (x, y - 13 * S), (x + 9 * S, y - 6 * S)], fill=ORANGE if i % 2 else (90, 60, 140), outline=INK)

    # the concert in L.A.: stage glow and searchlight beams
    sx, sy = P(0.905, 0.70)
    glow = Image.new('L', (w, h), 0)
    gd = ImageDraw.Draw(glow)
    for ang in (-62, -38, -14):
        a = math.radians(ang - 90 + 90)
        ex, ey = sx + 80 * S * math.cos(math.radians(ang * 0.6 - 80)), sy + 80 * S * math.sin(math.radians(ang * 0.6 - 80))
        gd.polygon([(sx - 3 * S, sy), (ex - 14 * S, ey), (ex + 14 * S, ey), (sx + 3 * S, sy)], fill=210)
    glow = glow.filter(ImageFilter.GaussianBlur(6))
    beam = Image.new('RGB', (w, h), (255, 236, 150))
    im = Image.composite(beam, im, glow)
    d = ImageDraw.Draw(im)

    im = im.filter(ImageFilter.SMOOTH)
    im.save(os.path.join(A, 'route-map.png'))

    def f(pt):
        return [round(pt[0] / S / MW, 4), round(pt[1] / S / MH, 4)]
    return {'spoonerville': f(main[0]), 'possum': f(P(0.205, 0.56)), 'fork': f(main[-1]),
            'lake': f(P(lx, ly)), 'la': f(south[-1]), 'neptune': f(south[int(len(south) * 0.66)]),
            'bigfoot': f(P(0.545, 0.36)), 'desert': f(P(0.62, 0.9))}


def wear(name, seed):
    rnd = random.Random(seed)
    w, h = W * 2, H * 2
    n = Image.new('L', (12, 9))
    n.putdata([rnd.randint(0, 255) for _ in range(12 * 9)])
    n = n.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(70))
    mott = n.point(lambda v: int(max(0, v - 120) * 0.10))
    e = Image.new('L', (w, h), 0)
    ed = ImageDraw.Draw(e)
    for k in range(46):
        a = int(52 * (1 - k / 46) ** 2.2)
        ed.rectangle([k, k, w - 1 - k, h - 1 - k], outline=a)
    e = e.filter(ImageFilter.GaussianBlur(6))
    # grease-proof sheen: one broad soft light patch
    alpha = ImageChops.lighter(mott, e)
    out = Image.new('RGBA', (w, h), (122, 88, 40, 0))
    out.putalpha(alpha)
    out.save(os.path.join(A, f'wear-{name}.png'))


def still():
    im = Image.open(os.path.join(A, 'still-map-src.jpg')).convert('RGB')
    w, h = im.size
    # 390 x 236 frame: keep the map, the wheel and both faces
    th = h
    tw = int(th * 390 / 240)
    left = (w - tw) // 2
    im = im.crop((left, 0, left + tw, th)).resize((390 * 2, 240 * 2), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(1.04)
    im.save(os.path.join(A, 'still-map.jpg'), quality=90)


def postcard():
    src = os.path.join(A, 'postcard-src.jpg')
    if not os.path.exists(src):
        print('postcard source missing')
        return
    im = Image.open(src).convert('RGB')
    w, h = im.size
    # paint out the publisher's stock number in the top right corner with the sky colour around it
    from PIL import ImageDraw as _D
    box = (int(w * 0.78), int(h * 0.02), int(w * 0.95), int(h * 0.10))
    patch = im.crop((box[0], box[3], box[2], box[3] + (box[3] - box[1]))).transpose(Image.FLIP_TOP_BOTTOM)
    im.paste(patch.filter(ImageFilter.GaussianBlur(3)), box[:2])
    # trim the scan's outer white edge a touch
    m = int(w * 0.012)
    im = im.crop((m, m, w - m, h - m))
    im = im.resize((276 * 2, int(276 * 2 * im.size[1] / im.size[0])), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(1.05)
    im.save(os.path.join(A, 'postcard.jpg'), quality=90)
    print('postcard', im.size)


def real_map():
    """Crop the LOC 1950 'United States System of Highways' map to the panel shape, warm it a touch."""
    im = Image.open(os.path.join(D, 'src', 'loc-ct006400-25pct.jpg')).convert('RGB')
    w, h = im.size
    top = int(h * 0.1605)
    ch = round(w * MH / MW)
    im = im.crop((0, top, w, top + ch)).resize((MW * S, MH * S), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(0.92)
    tone = Image.new('RGB', im.size, (255, 238, 196))
    im = ImageChops.multiply(im, tone)
    im.save(os.path.join(A, 'route-map.jpg'), quality=90)
    # anchors as fractions of the panel, placed on the real geography
    lay = {'spoonerville': [0.715, 0.66], 'possum': [0.63, 0.62], 'fork': [0.355, 0.6],
           'bigfoot': [0.25, 0.32], 'lake': [0.205, 0.1], 'desert': [0.215, 0.8],
           'neptune': [0.15, 0.89], 'la': [0.11, 0.955]}
    lay['route'] = [
        [lay['spoonerville'], lay['possum'], [0.55, 0.6], [0.46, 0.61], lay['fork']],
        [lay['fork'], [0.3, 0.47], lay['bigfoot'], [0.225, 0.2], lay['lake']],
        [lay['fork'], [0.28, 0.69], lay['desert'], lay['neptune'], lay['la']],
    ]
    return lay


if __name__ == '__main__':
    lay = real_map()
    json.dump(lay, open(os.path.join(D, 'map_layout.json'), 'w'), indent=1)
    wear('front', 31)
    still()
    postcard()
    print('painted', lay)
