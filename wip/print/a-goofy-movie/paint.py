"""Paints the art for the Lester's Possum Park placemat (A Goofy Movie, 1995).

assets/route-map.png   the strip road map, Spoonerville to the fork, Lake Destiny and L.A. (labels are HTML)
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
MW, MH = 1264, 176          # map box in px at 1x

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
    w, h = MW * S, MH * S
    rnd = random.Random(7)
    im = Image.new('RGB', (w, h), LAND)
    d = ImageDraw.Draw(im)

    # farm fields: a halftone dot screen in soft patches (the flat country east of the park)
    noise = Image.new('L', (14, 4))
    noise.putdata([rnd.randint(0, 255) for _ in range(56)])
    noise = noise.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    step = 9
    for y in range(0, h, step):
        for x in range((y // step) % 2 * step // 2, w, step):
            v = noise.getpixel((min(x, w - 1), min(y, h - 1)))
            if x > w * 0.43:
                v -= 70
            r = max(0, (v - 110) / 145) * 3.4
            if r > 0.5:
                d.ellipse([x - r, y - r, x + r, y + r], fill=FIELD)

    # ocean at the west edge (right side of the strip map)
    ox = w * 0.955
    coast = [(ox + 18 * math.sin(y / 37) + 10 * math.sin(y / 13), y) for y in range(0, h + 8, 8)]
    d.polygon(coast + [(w, h), (w, 0)], fill=WATER)
    for k in range(1, 8):
        d.line([(x + 14 * k, y) for x, y in coast], fill=WATER_D if k % 2 else (150, 195, 214), width=2)
    d.line(coast, fill=INK, width=3)

    # Lake Destiny, up in the Idaho pines
    lx, ly = P(0.745, 0.24)
    lake = blob(lx, ly, 70 * S, 26 * S, 3)
    d.polygon(lake, fill=WATER)
    for k in (0.82, 0.62, 0.42):
        d.line(blob(lx, ly, 70 * S * k, 26 * S * k, 3) + [blob(lx, ly, 70 * S * k, 26 * S * k, 3)[0]], fill=WATER_D, width=2)
    d.line(lake + [lake[0]], fill=INK, width=3)

    # rivers
    for pts in ([P(0.11, 0.0), P(0.13, 0.35), P(0.10, 0.7), P(0.14, 1.0)],
                [P(0.70, 0.30), P(0.64, 0.55), P(0.58, 0.72), P(0.52, 1.0)]):
        line(d, bez([(x, y) for x, y in pts], 60), WATER_D, 4)

    # mountains: engraved ridges with hatching, between the fork and the coast
    peaks = []
    for i in range(22):
        fx = 0.47 + i * 0.019 + rnd.uniform(-0.006, 0.006)
        fy = 0.30 + rnd.uniform(-0.08, 0.30)
        if 0.66 < fx < 0.83 and fy < 0.42:
            continue
        peaks.append((fx, fy, rnd.uniform(15, 26)))
    peaks.sort(key=lambda p: p[1])
    for fx, fy, ht in peaks:
        cx, base = P(fx, fy)
        hh = ht * S
        bw = hh * 1.15
        top = (cx, base - hh)
        left = (cx - bw, base)
        right = (cx + bw, base)
        d.polygon([left, top, right], fill=LAND)
        # shaded east face: hatch lines
        for t in range(1, 9):
            u = t / 9
            x0 = cx + (right[0] - cx) * u
            y0 = (base - hh) + hh * u
            d.line([(x0, y0), (cx + (right[0] - cx) * u * 0.35, base)], fill=INK, width=2)
        d.line([left, top, right], fill=INK, width=3, joint='curve')
        # snow cap
        d.polygon([top, (cx - bw * 0.22, base - hh * 0.78), (cx - bw * 0.05, base - hh * 0.72), (cx + bw * 0.12, base - hh * 0.8)], fill=(250, 246, 232))
        d.line([(cx - bw * 0.22, base - hh * 0.78), top, (cx + bw * 0.12, base - hh * 0.8)], fill=INK, width=2)

    # pine trees around the lake and the campground
    def pine(x, y, s):
        for j in range(3):
            yy = y - j * s * 0.55
            ww = s * (0.62 - j * 0.15)
            d.polygon([(x - ww, yy), (x, yy - s * 0.75), (x + ww, yy)], fill=(70, 104, 62))
            d.line([(x - ww, yy), (x, yy - s * 0.75), (x + ww, yy)], fill=INK, width=2)
        d.line([(x, y), (x, y + s * 0.25)], fill=INK, width=3)
    for fx, fy in [(0.655, 0.16), (0.672, 0.34), (0.69, 0.10), (0.81, 0.13), (0.825, 0.36), (0.80, 0.47),
                   (0.70, 0.47), (0.845, 0.22), (0.53, 0.20), (0.545, 0.36), (0.515, 0.32)]:
        x, y = P(fx, fy)
        pine(x, y, rnd.uniform(14, 18) * S)

    # roads: grey county roads first
    for pts in ([P(0.0, 0.18), P(0.2, 0.25), P(0.34, 0.12), P(0.45, 0.05)],
                [P(0.05, 0.95), P(0.2, 0.85), P(0.3, 0.92), P(0.4, 0.86)],
                [P(0.86, 0.95), P(0.9, 0.55), P(0.94, 0.2)]):
        line(d, bez(pts, 60), (150, 140, 150), 3)

    # the highway west: Spoonerville, Possum Park, the fork
    main = bez([P(0.02, 0.56), P(0.12, 0.62), P(0.255, 0.52), P(0.34, 0.6), P(0.425, 0.55)], 90)
    north = bez([P(0.425, 0.55), P(0.5, 0.5), P(0.6, 0.62), P(0.66, 0.5), P(0.72, 0.43)], 90)
    south = bez([P(0.425, 0.55), P(0.52, 0.72), P(0.64, 0.8), P(0.78, 0.74), P(0.92, 0.80)], 90)
    for pts in (north, south, main):
        line(d, pts, INK, 15)
    for pts in (north, south, main):
        line(d, pts, ORANGE, 9)
    # center dashes on the highway
    for pts in (main, north, south):
        for i in range(0, len(pts) - 6, 14):
            d.line(pts[i:i + 6], fill=(250, 236, 200), width=2)

    im = im.filter(ImageFilter.SMOOTH_MORE)
    im.save(os.path.join(A, 'route-map.png'))

    def f(pt):
        return [round(pt[0] / S / MW, 4), round(pt[1] / S / MH, 4)]
    return {'spoonerville': f(main[0]), 'possum': f(P(0.255, 0.52)), 'fork': f(main[-1]),
            'lake': f(P(0.745, 0.24)), 'la': f(south[-1]), 'neptune': f(south[int(len(south) * 0.62)]),
            'bigfoot': f(north[int(len(north) * 0.45)])}


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
    tw = int(th * 390 / 236)
    left = (w - tw) // 2
    im = im.crop((left, 0, left + tw, th)).resize((390 * 2, 236 * 2), Image.LANCZOS)
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
    im = im.resize((290 * 2, int(290 * 2 * im.size[1] / im.size[0])), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(1.05)
    im.save(os.path.join(A, 'postcard.jpg'), quality=90)
    print('postcard', im.size)


if __name__ == '__main__':
    lay = route_map()
    json.dump(lay, open(os.path.join(D, 'map_layout.json'), 'w'), indent=1)
    wear('front', 31)
    still()
    postcard()
    print('painted', lay)
