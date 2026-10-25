"""Paints the print textures and art for the Liberty View Manor party menu (Working Girl, 1988).
Sheet is US letter, 816 x 1056 CSS px; everything is painted at 2x.
Two-ink offset look: harbor navy plus ferry orange on pale blue card stock."""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance, ImageChops

HERE = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(HERE, 'assets')
PAPER = (221, 228, 229)
NAVY = (31, 43, 78)
ORANGE = (214, 98, 44)


def halftone(gray, pitch, angle, gain=1.0, ss=3):
    """gray: L image where 255 = full ink. Returns L mask (255 = ink) of round dots on a rotated screen."""
    w, h = gray.size
    big = gray.resize((w * ss, h * ss), Image.BICUBIC)
    rot = big.rotate(angle, expand=True, resample=Image.BICUBIC, fillcolor=0)
    rw, rh = rot.size
    out = Image.new('L', (rw, rh), 0)
    d = ImageDraw.Draw(out)
    p = pitch * ss
    px = rot.load()
    y = p / 2
    while y < rh:
        x = p / 2
        while x < rw:
            v = px[int(x), int(y)] / 255.0
            if v > 0.02:
                r = math.sqrt(min(1.0, v * gain)) * p * 0.72
                r *= random.uniform(0.93, 1.07)  # slightly ragged ink
                d.ellipse((x - r, y - r, x + r, y + r), fill=255)
            x += p
        y += p
    back = out.rotate(-angle, expand=True, resample=Image.BICUBIC)
    bw, bh = back.size
    back = back.crop(((bw - w * ss) // 2, (bh - h * ss) // 2, (bw - w * ss) // 2 + w * ss, (bh - h * ss) // 2 + h * ss))
    return back.resize((w, h), Image.LANCZOS)


def multiply(base, color, mask, strength):
    ink = Image.new('RGB', base.size, color)
    tinted = ImageChops.multiply(base, ink)
    m = mask.point(lambda v: int(v * strength))
    return Image.composite(tinted, base, m)


def skyline(w=456, h=860):
    """TMDB publicity still (/obybnndTx4I0rUaBvGpjX2nSftT.jpg), cropped to the left edge only: the downtown
    towers over the water, no people. Printed as a two-ink duotone: a navy key plate from the cool channel and
    an orange plate in the warm stone, out of register by about 1.5 CSS px."""
    src = Image.open(os.path.join(HERE, 'src', 'skyline-still.jpg')).convert('RGB')
    bw = 540
    box = (0, 1730 - int(bw * h / w), bw, 1730)
    im = src.crop(box).resize((w, h), Image.LANCZOS)
    im = ImageEnhance.Sharpness(im).enhance(1.6)
    r, g, b = im.split()
    lum = ImageOps.equalize(im.convert('L'))
    skym = ImageChops.subtract(b, r).point(lambda v: max(0, min(255, int((v - 18) * 6))))
    key = ImageOps.invert(lum).point(lambda v: int(((v / 255.0) ** 1.3) * 212))
    key = ImageChops.subtract(key, skym.point(lambda v: int(v * 0.42)))
    warm = skym.point(lambda v: int(v * 0.27))  # blue sky goes to the orange plate as a light tint
    random.seed(11)
    navy_m = halftone(key, 4.4, 45, gain=1.0)
    random.seed(12)
    org_m = halftone(warm, 4.4, 15, gain=0.9)
    shifted = Image.new('L', (w, h), 0)
    shifted.paste(org_m, (3, 2))
    base = Image.new('RGB', (w, h), PAPER)
    base = multiply(base, ORANGE, shifted, 0.85)
    base = multiply(base, NAVY, navy_m, 0.95)
    base.save(os.path.join(A, 'photo-skyline.png'))


def tint_tile(color, name, cell=12, frac=0.32):
    """A 45 degree flat screen tint (one tile = two dots), used behind panels so tints are dots, not flat fills."""
    ss = 4
    t = Image.new('RGBA', (cell * ss, cell * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(t)
    r = math.sqrt(frac / math.pi) * cell * ss * 0.72
    for cx, cy in ((0, 0), (cell * ss, 0), (0, cell * ss), (cell * ss, cell * ss), (cell * ss / 2, cell * ss / 2)):
        d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=color + (235,))
    t = t.resize((cell, cell), Image.LANCZOS)
    t.save(os.path.join(A, name))


def mottle(seed, w=1632, h=2112):
    """Soft card-stock mottling, a darker handled edge, and a faint thumb smudge. Low detail by design."""
    random.seed(seed)
    small = Image.new('L', (12, 16), 128)
    px = small.load()
    for y in range(16):
        for x in range(12):
            px[x, y] = random.randint(100, 156)
    big = small.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(70))
    a = big.point(lambda v: max(0, v - 128) * 0.55)
    # edge wear
    edge = Image.new('L', (w, h), 0)
    ed = ImageDraw.Draw(edge)
    for i in range(40):
        ed.rectangle((i, i, w - 1 - i, h - 1 - i), outline=int(70 - i * 1.7))
    edge = edge.filter(ImageFilter.GaussianBlur(10))
    a = ImageChops.add(a, edge)
    # corner rubbed where it was held
    c = Image.new('L', (w, h), 0)
    cd = ImageDraw.Draw(c)
    cx, cy = (w - 60, h - 60) if seed % 2 else (60, h - 70)
    cd.ellipse((cx - 220, cy - 160, cx + 220, cy + 160), fill=38)
    a = ImageChops.add(a, c.filter(ImageFilter.GaussianBlur(70)))
    out = Image.new('RGBA', (w, h), (92, 96, 98, 0))
    out.putalpha(a.point(lambda v: min(v, 80)))
    return out


def pencil(points_list, size, width=4, seed=1):
    random.seed(seed)
    im = Image.new('RGBA', size, (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for pts in points_list:
        for k in range(3):
            j = [(x + random.uniform(-1.1, 1.1), y + random.uniform(-1.1, 1.1)) for x, y in pts]
            d.line(j, fill=(74, 76, 84, 70), width=width, joint='curve')
    return im.filter(ImageFilter.GaussianBlur(0.7))


def pencil_ring(w, h, seed=4):
    pts = []
    for i in range(0, 400):
        t = i / 360 * 2 * math.pi * 1.08 - 0.5
        rx = (w / 2 - 10) * (1 + 0.03 * math.sin(3 * t))
        ry = (h / 2 - 10) * (1 + 0.04 * math.cos(2 * t))
        pts.append((w / 2 + rx * math.cos(t) + i * 0.03, h / 2 + ry * math.sin(t)))
    return pencil([pts], (w, h), width=3, seed=seed)


def scissors(w=88, h=52):
    """Coupon scissors in the navy plate, drawn as a small line cut with thick and thin strokes."""
    ss = 4
    im = Image.new('RGBA', (w * ss, h * ss), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    ink = NAVY + (255,)
    # finger loops
    for cy in (14, 38):
        d.ellipse((4 * ss, (cy - 9) * ss, 26 * ss, (cy + 9) * ss), outline=ink, width=int(3.2 * ss))
    # blades, crossing at the pivot
    d.polygon([(24 * ss, 18 * ss), (86 * ss, 33 * ss), (26 * ss, 24 * ss)], fill=ink)
    d.polygon([(24 * ss, 34 * ss), (86 * ss, 19 * ss), (26 * ss, 28 * ss)], fill=ink)
    d.ellipse((44 * ss, 23 * ss, 50 * ss, 29 * ss), fill=PAPER + (255,))
    im = im.resize((w, h), Image.LANCZOS)
    return im


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    skyline()
    tint_tile(ORANGE, 'tint-orange.png', 12, 0.30)
    tint_tile(ORANGE, 'tint-orange-light.png', 12, 0.13)
    mottle(7).save(os.path.join(A, 'wear-front.png'))
    mottle(8).save(os.path.join(A, 'wear-back.png'))
    pencil_ring(428, 128).save(os.path.join(A, 'pencil-ring.png'))
    scissors().save(os.path.join(A, 'scissors.png'))
    print('painted')
