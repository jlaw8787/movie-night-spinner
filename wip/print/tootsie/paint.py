"""Paints the raster assets for the Southwest General schedule sheet.
wear-front.png / wear-back.png : soft mottling and edge wear on pink bond (alpha overlay)
polaroid.jpg                    : wardrobe continuity Polaroid cut from a TMDB still
paperclip.png                   : a steel paper clip
lipstick-stain.png              : a lipstick blot"""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
W, H = 816, 1056

def soft_noise(w, h, cell, seed):
    random.seed(seed)
    s = Image.new('L', (max(2, w // cell), max(2, h // cell)))
    s.putdata([random.randint(0, 255) for _ in range(s.width * s.height)])
    return s.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(cell * 0.6))

def wear(name, seed, holes_left):
    w, h = W * 2, H * 2
    big = soft_noise(w, h, 180, seed)
    mid = soft_noise(w, h, 60, seed + 1)
    m = ImageChops.add(big.point(lambda v: v * 0.7), mid.point(lambda v: v * 0.3))
    # darken toward the edges, a sheet handled all day
    edge = Image.new('L', (w, h), 0); d = ImageDraw.Draw(edge)
    for i in range(60):
        d.rectangle([i, i, w - 1 - i, h - 1 - i], outline=int(85 * (1 - i / 60) ** 2.4))
    edge = edge.filter(ImageFilter.GaussianBlur(10))
    tone = Image.new('RGBA', (w, h), (120, 60, 50, 0))
    alpha = ImageChops.add(m.point(lambda v: max(0, v - 120) * 0.22), edge)
    tone.putalpha(alpha)
    # a slightly lighter, sun-faded band where the sheet sat under others
    light = Image.new('RGBA', (w, h), (255, 248, 244, 0))
    la = soft_noise(w, h, 240, seed + 7).point(lambda v: max(0, v - 150) * 0.35)
    light.putalpha(la)
    out = Image.alpha_composite(light, tone)
    out.resize((W, H), Image.LANCZOS).save(os.path.join(A, name))

def polaroid():
    im = Image.open(os.path.join(A, 'still-set.jpg')).convert('RGB')
    im = im.crop((560, 60, 1500, 1000)).resize((560, 560), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(0.86)
    im = ImageEnhance.Contrast(im).enhance(0.9)
    warm = Image.new('RGB', im.size, (236, 214, 176))
    im = Image.blend(im, warm, 0.10)
    im.save(os.path.join(A, 'polaroid.jpg'), quality=90)

def paperclip():
    S = 4; w, h = 46 * S, 150 * S
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    def loop(x0, y0, x1, y1, col, wd):
        r = (x1 - x0) // 2
        d.arc([x0, y0, x1, y0 + 2 * r], 180, 360, fill=col, width=wd)
        d.arc([x0, y1 - 2 * r, x1, y1], 0, 180, fill=col, width=wd)
    def clip(col, wd, o=0):
        # outer wire
        d.arc([4*S+o, 4*S+o, 42*S+o, 42*S+o], 180, 360, fill=col, width=wd)
        d.line([4*S+o, 23*S+o, 4*S+o, 124*S+o], fill=col, width=wd)
        d.arc([4*S+o, 108*S+o, 34*S+o, 140*S+o], 0, 180, fill=col, width=wd)
        d.line([34*S+o, 124*S+o, 34*S+o, 40*S+o], fill=col, width=wd)
        d.arc([14*S+o, 28*S+o, 34*S+o, 50*S+o], 180, 360, fill=col, width=wd)
        d.line([14*S+o, 39*S+o, 14*S+o, 112*S+o], fill=col, width=wd)
        d.line([42*S+o, 23*S+o, 42*S+o, 96*S+o], fill=col, width=wd)
    shadow = Image.new('RGBA', (w, h), (0, 0, 0, 0)); sd = ImageDraw.Draw(shadow)
    d0 = d; d = sd; clip((40, 30, 30, 90), 4 * S, 3 * S); d = d0
    shadow = shadow.filter(ImageFilter.GaussianBlur(3 * S))
    im = Image.alpha_composite(shadow, im); d = ImageDraw.Draw(im)
    clip((128, 132, 138, 255), 4 * S)
    clip((214, 218, 224, 255), int(1.4 * S))
    im.resize((w // S, h // S), Image.LANCZOS).save(os.path.join(A, 'paperclip.png'))

def lipstick():
    import math
    S = 4; w, h = 200 * S, 130 * S
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    def mid(x):   # the line where the lips meet, a soft curve
        t = (x - 100) / 82
        return 66 + 4 * (1 - t * t) - 2
    xs = [18 + i * 1.64 for i in range(101)]
    up_top = []
    for x in xs:
        t = (x - 100) / 82
        bow = 7 * math.exp(-((x - 100) / 7) ** 2)
        peak = 30 + 26 * t ** 2 + bow
        up_top.append((x, min(peak, mid(x) - 1)))
    up = up_top + [(x, mid(x) - 2) for x in reversed(xs)]
    lo_bot = [(x, mid(x) + 2 + 44 * (1 - ((x - 100) / 82) ** 2) ** 1.2) for x in xs]
    lo = [(x, mid(x) + 3) for x in xs] + list(reversed(lo_bot))
    d.polygon([(x * S, y * S) for x, y in up], fill=225)
    d.polygon([(x * S, y * S) for x, y in lo], fill=240)
    m = m.filter(ImageFilter.GaussianBlur(1.8 * S))
    random.seed(4)
    cr = Image.new('L', (w, h), 255); cd = ImageDraw.Draw(cr)
    for i in range(70):
        x = random.uniform(22, 178)
        upper = random.random() < 0.45
        top, bot = (random.uniform(28, 44), mid(x) - 3) if upper else (mid(x) + 4, random.uniform(92, 112))
        lean = (x - 100) * random.uniform(0.08, 0.2)
        cd.line([(x * S, top * S), ((x + lean) * S, bot * S)], fill=random.randint(70, 200), width=int(random.uniform(0.6, 1.8) * S))
    cr = cr.filter(ImageFilter.GaussianBlur(0.9 * S))
    m = ImageChops.multiply(m, cr)
    patchy = soft_noise(w, h, 30, 9).point(lambda v: 120 + v * 0.53)
    m = ImageChops.multiply(m, patchy.convert('L'))
    col = Image.new('RGBA', (w, h), (168, 22, 44, 0)); col.putalpha(m.point(lambda v: int(v * 0.72)))
    col.resize((w // S, h // S), Image.LANCZOS).save(os.path.join(A, 'lipstick-stain.png'))

wear('wear-front.png', 11, True)
wear('wear-back.png', 23, False)
polaroid(); paperclip(); lipstick()
print('painted')
