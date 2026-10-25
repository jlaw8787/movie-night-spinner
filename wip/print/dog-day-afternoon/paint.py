"""Paints the printed art for the Pizzeria Canicola take-out menu (Brooklyn, summer 1972).
Two spot inks (sun orange and tomato red) plus a warm black, with slight misregistration and
soft ink speckle, as a small job printer would have run it on offset in 1972.
Writes assets/sun-badge.png, assets/delivery-bike.png, assets/paper-wear-front.png, assets/paper-wear-back.png."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
ORANGE = (236, 128, 38)
GOLD = (246, 184, 58)
RED = (200, 52, 34)
INK = (38, 28, 24)
rng = random.Random(822)


def speckle(mask, amount=0.10, seed=1):
    """Soft ink starvation: knock small, soft holes out of a solid mask so it reads as printed ink."""
    r = random.Random(seed)
    w, h = mask.size
    holes = Image.new('L', (w // 6, h // 6), 0)
    px = holes.load()
    for _ in range(int(w * h / 36 * amount * 0.08)):
        px[r.randrange(w // 6), r.randrange(h // 6)] = r.randrange(120, 255)
    holes = holes.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1.6))
    return ImageChops.subtract(mask, holes.point(lambda v: int(v * 0.55)))


def layer(color, mask):
    im = Image.new('RGBA', mask.size, color + (0,))
    im.putalpha(mask)
    return im


def sun_badge():
    S = 1200
    c = S / 2
    # rays, orange ink
    rays = Image.new('L', (S, S), 0)
    d = ImageDraw.Draw(rays)
    n = 32
    for i in range(n):
        a = (i / n) * 2 * math.pi + 0.05
        half = (2 * math.pi / n) * 0.30
        r0, r1 = 320, (588 if i % 2 == 0 else 500)
        pts = [(c + r0 * math.cos(a - half), c + r0 * math.sin(a - half)),
               (c + r1 * math.cos(a), c + r1 * math.sin(a)),
               (c + r0 * math.cos(a + half), c + r0 * math.sin(a + half))]
        d.polygon(pts, fill=255)
    rays = speckle(rays, 0.12, 3)
    # sun disc, gold ink
    disc = Image.new('L', (S, S), 0)
    ImageDraw.Draw(disc).ellipse([c - 330, c - 330, c + 330, c + 330], fill=255)
    disc = speckle(disc, 0.08, 4)
    # red halftone shading around the lower edge of the disc, 45 degree screen
    ht = Image.new('L', (S, S), 0)
    hd = ImageDraw.Draw(ht)
    step = 18
    for gy in range(-S, 2 * S, step):
        for gx in range(-S, 2 * S, step):
            x = (gx - gy) * 0.7071 + c
            y = (gx + gy) * 0.7071 * 0.5 + c
            x, y = gx * 0.7071 - gy * 0.7071 + c, gx * 0.7071 + gy * 0.7071 - c * 0.4
            dx, dy = x - c, y - c
            rr = math.hypot(dx, dy)
            if rr > 326:
                continue
            # tone grows toward the rim and the lower right
            t = max(0.0, (rr - 215) / 111) * (0.55 + 0.45 * max(0, (dx + dy) / (rr + 1e-6)))
            if t <= 0.02:
                continue
            rad = step * 0.52 * math.sqrt(min(1, t))
            hd.ellipse([x - rad, y - rad, x + rad, y + rad], fill=255)
    # rim rule in red and the inner rule
    rim = Image.new('L', (S, S), 0)
    rd = ImageDraw.Draw(rim)
    rd.ellipse([c - 336, c - 336, c + 336, c + 336], outline=255, width=14)
    rd.ellipse([c - 300, c - 300, c + 300, c + 300], outline=255, width=4)
    red = ImageChops.lighter(ht, rim)
    red = speckle(red, 0.08, 5)
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    im.alpha_composite(layer(ORANGE, rays), (3, 2))
    im.alpha_composite(layer(GOLD, disc))
    im.alpha_composite(layer(RED, red), (-3, 2))
    # punch the text field back to a clean gold so the type over it stays crisp
    clean = Image.new('L', (S, S), 0)
    ImageDraw.Draw(clean).ellipse([c - 270, c - 250, c + 270, c + 250], fill=255)
    clean = clean.filter(ImageFilter.GaussianBlur(14))
    im.alpha_composite(layer(GOLD, clean))
    im = im.resize((600, 600), Image.LANCZOS)
    im.save(os.path.join(A, 'sun-badge.png'))


def bike():
    W, H = 1600, 1000
    k = 1.0
    ink = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(ink)
    red = Image.new('L', (W, H), 0)
    rdw = ImageDraw.Draw(red)
    org = Image.new('L', (W, H), 0)
    od = ImageDraw.Draw(org)
    R = 230
    rear = (400, 720)
    front = (1200, 720)
    lw = 22

    def wheel(cx, cy):
        d.ellipse([cx - R, cy - R, cx + R, cy + R], outline=255, width=30)
        d.ellipse([cx - R + 34, cy - R + 34, cx + R - 34, cy + R - 34], outline=255, width=7)
        for i in range(18):
            a = i * math.pi / 9
            d.line([(cx + 26 * math.cos(a), cy + 26 * math.sin(a)), (cx + (R - 34) * math.cos(a + 0.18), cy + (R - 34) * math.sin(a + 0.18))], fill=255, width=4)
        d.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill=255)
    wheel(*rear)
    wheel(*front)
    bb = (720, 740)                # bottom bracket
    seat_top = (640, 400)
    head_top = (1080, 410)
    head_bot = (1110, 500)
    frame = [(rear, bb), (rear, seat_top), (bb, seat_top), (bb, head_bot), (seat_top, (1085, 430)), (head_top, head_bot)]
    for a, b in frame:
        rdw.line([a, b], fill=255, width=34)
    for p in [rear, bb, seat_top, head_bot]:
        rdw.ellipse([p[0] - 17, p[1] - 17, p[0] + 17, p[1] + 17], fill=255)
    # fork
    d.line([head_bot, (1150, 600), front], fill=255, width=22, joint='curve')
    # seat post and saddle
    d.line([seat_top, (622, 340)], fill=255, width=20)
    d.polygon([(540, 330), (700, 318), (712, 338), (600, 356), (540, 350)], fill=255)
    # handlebar, swept back
    d.line([head_top, (1060, 330)], fill=255, width=20)
    d.line([(1060, 330), (960, 300), (900, 320)], fill=255, width=20, joint='curve')
    d.rounded_rectangle([880, 300, 950, 336], radius=14, fill=255)
    # chainring, crank and pedal
    d.ellipse([bb[0] - 62, bb[1] - 62, bb[0] + 62, bb[1] + 62], outline=255, width=12)
    d.line([bb, (790, 830)], fill=255, width=18)
    d.rounded_rectangle([760, 820, 850, 845], radius=8, fill=255)
    d.line([(bb[0] - 10, bb[1] - 60), (rear[0], rear[1] - 22)], fill=255, width=6)
    d.line([(bb[0] - 10, bb[1] + 60), (rear[0], rear[1] + 22)], fill=255, width=6)
    # rear fender and front fender
    d.arc([rear[0] - R - 30, rear[1] - R - 30, rear[0] + R + 30, rear[1] + R + 30], 190, 330, fill=255, width=14)
    d.arc([front[0] - R - 30, front[1] - R - 30, front[0] + R + 30, front[1] + R + 30], 210, 350, fill=255, width=14)
    # front delivery rack carrying two pie boxes
    d.line([(1120, 470), (1150, 600)], fill=255, width=10)
    d.line([(1110, 440), (1430, 440)], fill=255, width=18)
    d.line([(1400, 440), (1300, 600)], fill=255, width=12)
    for i, (y0, y1) in enumerate([(370, 440), (300, 370)]):
        od.rectangle([1120 + i * 10, y0, 1420 + i * 10, y1 - 4], fill=255)
        d.rectangle([1120 + i * 10, y0, 1420 + i * 10, y1 - 4], outline=255, width=10)
        d.line([(1120 + i * 10, y0 + 18), (1420 + i * 10, y0 + 18)], fill=255, width=5)
    # steam, three soft strokes
    for j, x0 in enumerate((1210, 1280, 1350)):
        pts = [(x0 + 22 * math.sin(t / 7.0 + j), 285 - t * 2.6) for t in range(0, 42)]
        d.line(pts, fill=255, width=11, joint='curve')
    # ground line, broken like a woodcut
    for x in range(120, 1500, 70):
        d.line([(x, 962), (x + 44 + rng.randint(-8, 8), 962)], fill=255, width=8)
    ink = speckle(ink, 0.07, 7)
    red = speckle(red, 0.08, 8)
    org = speckle(org, 0.10, 9)
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    im.alpha_composite(layer(ORANGE, org), (6, 4))
    im.alpha_composite(layer(RED, red), (-4, 3))
    im.alpha_composite(layer(INK, ink))
    im = im.resize((W // 4 * 1, H // 4 * 1), Image.LANCZOS)
    im.save(os.path.join(A, 'delivery-bike.png'))


def wear(name, seed):
    W, H = 816, 1056
    r = random.Random(seed)
    m = Image.new('L', (W // 8, H // 8), 0)
    px = m.load()
    w, h = m.size
    for y in range(h):
        for x in range(w):
            e = min(x, y, w - 1 - x, h - 1 - y)
            v = max(0, 9 - e) * 9
            px[x, y] = min(255, int(v * (0.6 + 0.8 * r.random())))
    # a few big soft mottles
    md = ImageDraw.Draw(m)
    for _ in range(9):
        cx, cy, rr = r.randrange(w), r.randrange(h), r.randrange(8, 22)
        md.ellipse([cx - rr, cy - rr, cx + rr, cy + rr], fill=r.randrange(8, 18))
    m = m.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))
    im = Image.new('RGBA', (W, H), (150, 112, 62, 0))
    im.putalpha(m.point(lambda v: int(v * 0.55)))
    im.save(os.path.join(A, f'paper-wear-{name}.png'))


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    sun_badge()
    wear('front', 1)
    wear('back', 2)
    print('ok')
