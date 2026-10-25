"""Paints the PNG assets for the Harbor & Hudson dining car card (The Out-of-Towners, 1970).
coast-train.png : flat 1970 railroad poster scene, low sun, sea fog, a train running the shore
wear-front.png / wear-back.png : soft mottling and edge rub, a faint coffee ring on the back
"""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
random.seed(1970)

ORANGE = (210, 86, 42)
BROWN = (74, 44, 29)
CREAM = (243, 236, 222)
SEA = (95, 127, 138)
SEA_DK = (70, 99, 110)
SAND = (226, 196, 150)


def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))


def coast_train(w=576, h=232, s=4):
    W, H = w * s, h * s
    im = Image.new('RGB', (W, H), CREAM)
    dr = ImageDraw.Draw(im)
    # sky, warm band gradient in flat steps (poster style)
    sky_top, sky_bot = (246, 214, 170), (250, 236, 214)
    steps = 7
    horizon = int(H * 0.56)
    for i in range(steps):
        y0 = int(horizon * i / steps); y1 = int(horizon * (i + 1) / steps)
        dr.rectangle([0, y0, W, y1], fill=lerp(sky_top, sky_bot, i / (steps - 1)))
    # low sun, sliced by the horizon
    cx, cy, r = int(W * 0.74), int(horizon - H * 0.02), int(H * 0.26)
    dr.ellipse([cx - r, cy - r, cx + r, cy + r], fill=ORANGE)
    # stripes cut across the sun, 1970 style
    for k, yy in enumerate([0.36, 0.44, 0.51]):
        y = int(H * yy)
        dr.rectangle([cx - r - 4, y, cx + r + 4, y + int(H * (0.012 + k * 0.006))], fill=lerp(sky_top, sky_bot, yy / 0.56))
    # far headland
    pts = [(0, horizon), (0, int(horizon - H * 0.07)), (int(W * 0.08), int(horizon - H * 0.10)),
           (int(W * 0.20), int(horizon - H * 0.06)), (int(W * 0.33), int(horizon - H * 0.04)), (int(W * 0.40), horizon)]
    dr.polygon(pts, fill=(176, 140, 112))
    # sea
    dr.rectangle([0, horizon, W, H], fill=SEA)
    for i in range(9):
        y = horizon + int((H - horizon) * (i / 9) ** 1.4)
        dr.rectangle([0, y, W, y + max(2, s)], fill=SEA_DK)
    # sun glitter on water
    for i in range(14):
        y = horizon + 10 * s + i * 5 * s
        ww = int(r * (1.1 - i * 0.06))
        if ww <= 0: break
        dr.rectangle([cx - ww // 2, y, cx + ww // 2, y + 2 * s], fill=(222, 140, 96))
    # soft fog banks drifting over the water and headland
    fog = Image.new('L', (W, H), 0)
    fd = ImageDraw.Draw(fog)
    for (x0, y0, x1, y1, a) in [(-0.1, 0.40, 0.55, 0.53, 200), (0.30, 0.52, 1.1, 0.61, 150), (-0.1, 0.58, 0.7, 0.66, 90)]:
        fd.rounded_rectangle([int(W * x0), int(H * y0), int(W * x1), int(H * y1)], radius=int(H * 0.05), fill=a)
    fog = fog.filter(ImageFilter.GaussianBlur(8 * s))
    im.paste(Image.new('RGB', (W, H), (248, 244, 236)), (0, 0), fog)
    dr = ImageDraw.Draw(im)
    # embankment the line runs along
    emb_top = int(H * 0.76)
    dr.polygon([(0, emb_top), (W, emb_top - int(H * 0.02)), (W, H), (0, H)], fill=SAND)
    dr.rectangle([0, int(H * 0.91), W, H], fill=BROWN)
    # rails
    rail_y = int(H * 0.80)
    dr.rectangle([0, rail_y, W, rail_y + 2 * s], fill=BROWN)
    for x in range(0, W, 9 * s):
        dr.rectangle([x, rail_y + 2 * s, x + 4 * s, rail_y + 4 * s], fill=(120, 86, 60))
    # the train: an electric locomotive and two coaches, side profile, running left
    car_h = int(H * 0.17)
    base = rail_y - 2 * s
    top = base - car_h
    x = int(W * 0.06)
    loco_w = int(W * 0.21)
    # locomotive with sloped nose
    nose = int(car_h * 0.9)
    dr.polygon([(x + nose, top), (x + loco_w, top), (x + loco_w, base), (x, base), (x, top + int(car_h * 0.55))], fill=BROWN)
    dr.rectangle([x, base - int(car_h * 0.36), x + loco_w, base - int(car_h * 0.24)], fill=ORANGE)
    # cab window
    dr.polygon([(x + int(nose * 0.62), top + int(car_h * 0.16)), (x + nose + 6 * s, top + int(car_h * 0.16)),
                (x + nose + 6 * s, top + int(car_h * 0.42)), (x + int(nose * 0.22), top + int(car_h * 0.42))], fill=(236, 214, 180))
    # pantograph
    px = x + int(loco_w * 0.62)
    dr.line([(px, top), (px + 14 * s, top - 14 * s), (px + 30 * s, top - 14 * s)], fill=BROWN, width=2 * s)
    dr.line([(px + 10 * s, top), (px + 20 * s, top - 14 * s)], fill=BROWN, width=2 * s)
    # coaches
    cx0 = x + loco_w + 4 * s
    coach_w = int(W * 0.30)
    for c in range(2):
        x0 = cx0 + c * (coach_w + 4 * s)
        x1 = min(x0 + coach_w, W + 40 * s)
        dr.rounded_rectangle([x0, top, x1, base], radius=4 * s, fill=CREAM, outline=BROWN, width=2 * s)
        dr.rectangle([x0 + 2 * s, base - int(car_h * 0.36), x1 - 2 * s, base - int(car_h * 0.24)], fill=ORANGE)
        dr.rectangle([x0 + 2 * s, base - int(car_h * 0.20), x1 - 2 * s, base - 2 * s], fill=BROWN)
        # window band
        wy0, wy1 = top + int(car_h * 0.18), top + int(car_h * 0.48)
        n = 9
        gap = (x1 - x0 - 16 * s) / n
        for k in range(n):
            wx = int(x0 + 10 * s + k * gap)
            dr.rounded_rectangle([wx, wy0, wx + int(gap * 0.72), wy1], radius=2 * s, fill=(92, 72, 58))
        # gangway between cars
        dr.rectangle([x0 - 4 * s, top + int(car_h * 0.12), x0, base - int(car_h * 0.1)], fill=BROWN)
    # wheels
    for xx in range(x + 8 * s, min(W, cx0 + 2 * (coach_w + 4 * s)), 26 * s):
        dr.ellipse([xx, base - 3 * s, xx + 8 * s, base + 5 * s], fill=(40, 26, 18))
    # speed lines behind the train
    for k, (yy, ln) in enumerate([(0.62, 0.20), (0.67, 0.14), (0.72, 0.24)]):
        y = int(H * yy)
        x0 = cx0 + 2 * (coach_w + 4 * s) + 8 * s
        dr.rectangle([x0, y, min(W, x0 + int(W * ln)), y + 2 * s], fill=BROWN)
    im = im.resize((w * 2, h * 2), Image.LANCZOS)
    im.save(os.path.join(A, 'coast-train.png'))


def wear(face, w=672, h=1056, ring=None):
    s = 2
    W, H = w * s, h * s
    # big soft mottling
    small = Image.new('L', (w // 24 + 2, h // 24 + 2))
    small.putdata([random.randint(0, 255) for _ in range(small.size[0] * small.size[1])])
    mott = small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(22 * s))
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    tint = Image.new('RGBA', (W, H), (150, 118, 80, 255))
    a = mott.point(lambda v: int(max(0, v - 120) * 0.14))
    out.paste(tint, (0, 0), a)
    # edge rub: darker toward edges and corners
    edge = Image.new('L', (W, H), 0)
    ed = ImageDraw.Draw(edge)
    for i in range(26):
        v = int(30 * (1 - i / 26) ** 2)
        ed.rectangle([i * s, i * s, W - 1 - i * s, H - 1 - i * s], outline=v, width=s)
    edge = edge.filter(ImageFilter.GaussianBlur(6 * s))
    out = Image.alpha_composite(out, Image.composite(Image.new('RGBA', (W, H), (110, 82, 56, 255)), Image.new('RGBA', (W, H), (0, 0, 0, 0)), edge))
    if ring:
        rx, ry, rr = [v * s for v in ring]
        rl = Image.new('L', (W, H), 0)
        rd = ImageDraw.Draw(rl)
        for t in range(3):
            o = t * 2 * s
            rd.arc([rx - rr + o, ry - rr - o, rx + rr + o, ry + rr - o], start=random.randint(0, 40), end=300 + random.randint(0, 50), fill=46 - t * 12, width=3 * s)
        rd.ellipse([rx - rr, ry - rr, rx + rr, ry + rr], fill=None)
        rl = rl.filter(ImageFilter.GaussianBlur(2.5 * s))
        inner = Image.new('L', (W, H), 0)
        ImageDraw.Draw(inner).ellipse([rx - rr + 4 * s, ry - rr + 4 * s, rx + rr - 4 * s, ry + rr - 4 * s], fill=8)
        inner = inner.filter(ImageFilter.GaussianBlur(10 * s))
        both = Image.eval(Image.merge('L', [rl]), lambda v: v)
        from PIL import ImageChops
        both = ImageChops.add(rl, inner)
        out = Image.alpha_composite(out, Image.composite(Image.new('RGBA', (W, H), (128, 80, 40, 255)), Image.new('RGBA', (W, H), (0, 0, 0, 0)), both))
    out.save(os.path.join(A, f'wear-{face}.png'))


coast_train()
wear('front')
wear('back', ring=(586, 1012, 62))
print('painted')
