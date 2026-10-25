"""Paints the raster assets for the Southwest General call sheet (pink bond, 1982).
wear-front.png / wear-back.png : soft mottling, handling grime and edge wear (alpha overlay)
tint-red.png                    : a 20 percent halftone screen in the form's red ink, for the section bands
stamp-revised.png               : a rubber stamp in violet pad ink, uneven, with voids
liquid-paper.png                : a dab of correction fluid
tape.png                        : a strip of yellowed cellophane tape
polaroid.png                    : an SX-70 wardrobe continuity print, frame and all, from a TMDB still
coffee-stain.png                : a faint half coffee ring
lipstick-stain.png              : a lipstick blot (kept from the first pass)"""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageChops, ImageFont
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets')
FR = '/home/claude/polish/wip/print/jurassic/fonts/LibreFranklin-900.ttf'
W, H = 816, 1056

def soft_noise(w, h, cell, seed):
    rnd = random.Random(seed)
    s = Image.new('L', (max(2, w // cell), max(2, h // cell)))
    s.putdata([rnd.randint(0, 255) for _ in range(s.width * s.height)])
    return s.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(cell * 0.6))

def wear(name, seed, thumb):
    w, h = W * 2, H * 2
    big = soft_noise(w, h, 200, seed)
    mid = soft_noise(w, h, 70, seed + 1)
    m = ImageChops.add(big.point(lambda v: v * 0.7), mid.point(lambda v: v * 0.3))
    edge = Image.new('L', (w, h), 0); d = ImageDraw.Draw(edge)
    for i in range(70):
        d.rectangle([i, i, w - 1 - i, h - 1 - i], outline=int(95 * (1 - i / 70) ** 2.2))
    edge = edge.filter(ImageFilter.GaussianBlur(12))
    # handling grime where a thumb holds the sheet
    g = Image.new('L', (w, h), 0); gd = ImageDraw.Draw(g)
    tx, ty = thumb
    gd.ellipse([tx - 120, ty - 170, tx + 120, ty + 170], fill=46)
    g = g.filter(ImageFilter.GaussianBlur(70))
    tone = Image.new('RGBA', (w, h), (120, 62, 58, 0))
    alpha = ImageChops.add(ImageChops.add(m.point(lambda v: max(0, v - 118) * 0.24), edge), g)
    tone.putalpha(alpha)
    light = Image.new('RGBA', (w, h), (255, 246, 244, 0))
    light.putalpha(soft_noise(w, h, 260, seed + 7).point(lambda v: max(0, v - 150) * 0.32))
    Image.alpha_composite(light, tone).resize((W, H), Image.LANCZOS).save(os.path.join(A, name))

def tint():
    # 65 line screen at 20 percent, drawn at 4x and reduced to 2x, then shown at 1x in the page
    S = 4; w, h = 720 * 2, 34 * 2
    big = Image.new('L', (w * S // 2, h * S // 2), 0); d = ImageDraw.Draw(big)
    pitch = 3.0 * S / 2 * 1.0   # 3 px at 2x
    r = pitch * 0.27
    rnd = random.Random(5)
    y = 0.0; row = 0
    while y < big.height + pitch:
        x = (pitch / 2) if row % 2 else 0.0
        while x < big.width + pitch:
            rr = r * rnd.uniform(0.82, 1.15)
            d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=255)
            x += pitch
        y += pitch * 0.5; row += 1
    m = big.resize((w, h), Image.LANCZOS)
    # uneven ink: a little lighter in patches
    m = ImageChops.multiply(m, soft_noise(w, h, 40, 6).point(lambda v: 170 + v * 0.33))
    out = Image.new('RGBA', (w, h), (178, 42, 52, 0)); out.putalpha(m)
    out.save(os.path.join(A, 'tint-red.png'))

def stamp():
    S = 3; w, h = 230 * S, 74 * S
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    d.rounded_rectangle([3 * S, 3 * S, w - 3 * S, h - 3 * S], radius=5 * S, outline=255, width=int(3.2 * S))
    d.rounded_rectangle([8 * S, 8 * S, w - 8 * S, h - 8 * S], radius=3 * S, outline=255, width=int(1.2 * S))
    f = ImageFont.truetype(FR, 38 * S)
    t = 'REVISED'
    # hand-set rubber letters, slightly uneven spacing
    x = 22 * S
    rnd = random.Random(12)
    for ch in t:
        bb = d.textbbox((0, 0), ch, font=f)
        d.text((x, 14 * S + rnd.uniform(-1, 1) * S), ch, font=f, fill=255)
        x += (bb[2] - bb[0]) + 4.5 * S
    m = m.filter(ImageFilter.GaussianBlur(0.7 * S))
    # ink voids and heavier edges, as a rubber stamp prints
    voids = soft_noise(w, h, 9, 13).point(lambda v: 255 if v > 104 else int(v * 1.6))
    m = ImageChops.multiply(m, voids)
    m = ImageChops.multiply(m, soft_noise(w, h, 60, 14).point(lambda v: 120 + v // 2))
    m = m.rotate(-4, resample=Image.BICUBIC, expand=True)
    out = Image.new('RGBA', m.size, (92, 52, 132, 0)); out.putalpha(m.point(lambda v: int(v * 0.86)))
    out = out.resize((m.width * 2 // S, m.height * 2 // S), Image.LANCZOS)
    out.save(os.path.join(A, 'stamp-revised.png'))

def liquid_paper():
    S = 4; w, h = 64 * S, 30 * S
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    rnd = random.Random(3)
    for i in range(9):
        cx = rnd.uniform(14, 50) * S; cy = rnd.uniform(11, 19) * S
        rx = rnd.uniform(10, 16) * S; ry = rnd.uniform(7, 10) * S
        d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)
    m = m.filter(ImageFilter.GaussianBlur(1.2 * S))
    m = m.point(lambda v: 255 if v > 120 else int(v * 1.6))
    m = m.filter(ImageFilter.GaussianBlur(0.6 * S))
    col = Image.new('RGBA', (w, h), (250, 247, 240, 0)); col.putalpha(m.point(lambda v: int(v * 0.95)))
    # brush ridges, slightly shaded
    sh = Image.new('L', (w, h), 0); sd = ImageDraw.Draw(sh)
    for i in range(14):
        y = rnd.uniform(8, 22) * S
        sd.line([(rnd.uniform(6, 20) * S, y), (rnd.uniform(42, 58) * S, y + rnd.uniform(-2, 2) * S)], fill=40, width=S)
    sh = ImageChops.multiply(sh.filter(ImageFilter.GaussianBlur(S)), m)
    shade = Image.new('RGBA', (w, h), (190, 175, 160, 0)); shade.putalpha(sh)
    out = Image.alpha_composite(col, shade)
    out.resize((w // 2, h // 2), Image.LANCZOS).save(os.path.join(A, 'liquid-paper.png'))

def tape(name, seed, w0=96, h0=30):
    S = 3; w, h = w0 * S, h0 * S
    rnd = random.Random(seed)
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    pts = []
    for i in range(9):   # torn left end
        pts.append((rnd.uniform(0, 4) * S, i * h / 8))
    for i in range(9):   # torn right end
        pts.append((w - rnd.uniform(0, 4) * S, h - i * h / 8))
    d.polygon(pts, fill=255)
    body = Image.new('RGBA', (w, h), (240, 232, 196, 0)); body.putalpha(m.point(lambda v: int(v * 0.32)))
    # a soft sheen band and yellowed edges
    sheen = Image.new('L', (w, h), 0); sd = ImageDraw.Draw(sheen)
    sd.rectangle([0, int(h * 0.22), w, int(h * 0.36)], fill=70)
    sheen = ImageChops.multiply(sheen.filter(ImageFilter.GaussianBlur(4 * S)), m)
    s = Image.new('RGBA', (w, h), (255, 255, 250, 0)); s.putalpha(sheen)
    e = Image.new('L', (w, h), 0); ed = ImageDraw.Draw(e)
    ed.rectangle([0, 0, w, h], outline=60, width=int(1.4 * S))
    e = ImageChops.multiply(e.filter(ImageFilter.GaussianBlur(S)), m)
    eb = Image.new('RGBA', (w, h), (176, 140, 70, 0)); eb.putalpha(e)
    out = Image.alpha_composite(Image.alpha_composite(body, s), eb)
    out.resize((w0 * 2, h0 * 2), Image.LANCZOS).save(os.path.join(A, name))

def polaroid():
    # SX-70 integral print: 88 x 107 mm, image 79 x 79 mm, side and top borders about 4.5 to 6 mm, bottom about 22 mm
    S = 4
    fw, fh = 88 * S * 3, 107 * S * 3            # 3 px per mm at 4x
    ix, iy, isz = int(4.5 * S * 3), int(6 * S * 3), 79 * S * 3
    frame = Image.new('RGB', (fw, fh), (240, 238, 228))
    fn = soft_noise(fw, fh, 50, 21).point(lambda v: 236 + v // 24)
    frame = Image.merge('RGB', [fn, fn.point(lambda v: v - 2), fn.point(lambda v: v - 10)])
    im = Image.open(os.path.join(A, 'still-set.jpg')).convert('RGB')
    im = im.crop((600, 70, 1500, 970)).resize((isz, isz), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(0.82)
    im = ImageEnhance.Contrast(im).enhance(0.84)
    r, g, b = im.split()
    r = r.point(lambda v: int(22 + v * 0.93))      # lifted, warm highlights
    g = g.point(lambda v: int(18 + v * 0.9))
    b = b.point(lambda v: int(30 + v * 0.78))      # cyan blue cast in the shadows, yellowed whites
    im = Image.merge('RGB', (r, g, b)).filter(ImageFilter.GaussianBlur(1.6))
    vig = Image.new('L', (isz, isz), 0); vd = ImageDraw.Draw(vig)
    vd.ellipse([-isz * 0.25, -isz * 0.25, isz * 1.25, isz * 1.25], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(isz * 0.12))
    im = Image.composite(im, Image.new('RGB', im.size, (52, 46, 60)), vig)
    frame.paste(im, (ix, iy))
    d = ImageDraw.Draw(frame)
    d.rectangle([ix, iy, ix + isz, iy + isz], outline=(150, 146, 140), width=S)
    frame = frame.resize((480, 584), Image.LANCZOS)
    frame.save(os.path.join(A, 'polaroid.png'))

def coffee():
    S = 3; w = h = 170 * S
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    c = w / 2; r = 72 * S
    for a0 in range(200, 520, 4):   # an open ring, heavier on one side
        a = math.radians(a0)
        wgt = 0.4 + 0.6 * max(0, math.sin(math.radians(a0 - 240)))
        x, y = c + r * math.cos(a), c + r * math.sin(a)
        rr = (2.0 + 2.5 * wgt) * S
        d.ellipse([x - rr, y - rr, x + rr, y + rr], fill=int(90 + 110 * wgt))
    m = m.filter(ImageFilter.GaussianBlur(2.2 * S))
    inner = Image.new('L', (w, h), 0); idr = ImageDraw.Draw(inner)
    idr.ellipse([c - r, c - r, c + r, c + r], fill=26)
    inner = inner.filter(ImageFilter.GaussianBlur(10 * S))
    m = ImageChops.add(m, inner)
    m = ImageChops.multiply(m, soft_noise(w, h, 24, 31).point(lambda v: 110 + v // 2))
    out = Image.new('RGBA', (w, h), (132, 82, 44, 0)); out.putalpha(m.point(lambda v: int(v * 0.55)))
    out.resize((340, 340), Image.LANCZOS).save(os.path.join(A, 'coffee-stain.png'))

wear('wear-front.png', 11, (1500, 1880))
wear('wear-back.png', 23, (140, 1880))
tint(); stamp(); liquid_paper(); tape('tape.png', 8); tape('tape-b.png', 9, 84, 28); polaroid(); coffee()
print('painted')
