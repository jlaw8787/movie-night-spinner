"""Paints soft paper wear for both faces of the Whistle Stop Cafe card (honey_jar and chalk_mark are retired under rule 25 and not called). Photo crops are made in build.py."""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
W, H = 600, 1200

# ---------- paper wear (big soft mottling and edge tone, no pixel noise) ----------
def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(34):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(16))
    mot = Image.new('L', (W // 30, H // 30), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 16))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(34))
    lay = Image.new('RGBA', (W, H), (112, 78, 30, 0))
    lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.55)))
    lay.save(A(f'wear-{name}.png'))

# ---------- honey jar, painted at 4x ----------
def honey_jar():
    S = 4; w, h = 150 * S, 190 * S
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    jx0, jx1, jy0, jy1 = 22 * S, 128 * S, 52 * S, 184 * S
    # soft shadow
    sh = Image.new('L', (w, h), 0); ImageDraw.Draw(sh).ellipse([jx0 + 6 * S, jy1 - 10 * S, jx1 + 14 * S, jy1 + 4 * S], fill=120)
    sh = sh.filter(ImageFilter.GaussianBlur(6 * S)); im.paste((60, 40, 15, 255), (0, 0), sh)
    # honey body: vertical gradient, darker at the bottom and the sides
    body = Image.new('RGBA', (w, h), (0, 0, 0, 0)); bp = body.load()
    for y in range(jy0, jy1):
        t = (y - jy0) / (jy1 - jy0)
        for x in range(jx0, jx1):
            s = abs((x - (jx0 + jx1) / 2) / ((jx1 - jx0) / 2))
            k = 1 - 0.45 * s ** 2.2
            r = int((244 - 70 * t) * k); g = int((178 - 92 * t) * k); b = int((58 - 40 * t) * k)
            bp[x, y] = (r, g, max(0, b), 255)
    mask = Image.new('L', (w, h), 0); ImageDraw.Draw(mask).rounded_rectangle([jx0, jy0, jx1, jy1], radius=16 * S, fill=255)
    im.paste(body, (0, 0), mask)
    # comb chunk inside, hex cells
    comb = Image.new('RGBA', (w, h), (0, 0, 0, 0)); cd = ImageDraw.Draw(comb)
    cx0, cy0 = 44 * S, 92 * S
    for row in range(6):
        for col in range(5):
            cx = cx0 + col * 13 * S + (6.5 * S if row % 2 else 0); cy = cy0 + row * 11 * S
            pts = [(cx + 6.5 * S * math.cos(math.radians(a + 30)), cy + 6.5 * S * math.sin(math.radians(a + 30))) for a in range(0, 360, 60)]
            cd.polygon(pts, fill=(250, 214, 120, 150), outline=(176, 108, 30, 220))
    cm = Image.new('L', (w, h), 0); ImageDraw.Draw(cm).polygon([(40 * S, 96 * S), (104 * S, 86 * S), (112 * S, 150 * S), (46 * S, 160 * S)], fill=255)
    cm = cm.filter(ImageFilter.GaussianBlur(3 * S))
    im.paste(comb, (0, 0), ImageChops.multiply(cm, comb.split()[3]))
    # glass rim and highlights
    gl = Image.new('RGBA', (w, h), (0, 0, 0, 0)); gd = ImageDraw.Draw(gl)
    gd.rounded_rectangle([jx0, jy0, jx1, jy1], radius=16 * S, outline=(255, 246, 220, 200), width=3 * S)
    gd.rounded_rectangle([jx0 + 10 * S, jy0 + 12 * S, jx0 + 18 * S, jy1 - 20 * S], radius=4 * S, fill=(255, 252, 236, 150))
    gd.rounded_rectangle([jx1 - 16 * S, jy0 + 20 * S, jx1 - 12 * S, jy1 - 40 * S], radius=2 * S, fill=(255, 252, 236, 90))
    gl = gl.filter(ImageFilter.GaussianBlur(1.2 * S)); im.alpha_composite(gl)
    # neck
    d.rectangle([32 * S, 40 * S, 118 * S, 56 * S], fill=(214, 196, 150, 255))
    # gingham cloth cover, flared, tied with twine
    cl = Image.new('RGBA', (w, h), (0, 0, 0, 0)); cld = ImageDraw.Draw(cl)
    for gx in range(0, w, 9 * S):
        for gy in range(0, 70 * S, 9 * S):
            a = ((gx // (9 * S)) % 2) + ((gy // (9 * S)) % 2)
            col = [(246, 236, 212, 255), (196, 92, 70, 255), (150, 46, 34, 255)][a]
            cld.rectangle([gx, gy, gx + 9 * S, gy + 9 * S], fill=col)
    cmk = Image.new('L', (w, h), 0)
    ImageDraw.Draw(cmk).polygon([(30 * S, 10 * S), (120 * S, 10 * S), (140 * S, 58 * S), (118 * S, 50 * S), (100 * S, 62 * S), (75 * S, 52 * S),
                                 (52 * S, 63 * S), (32 * S, 50 * S), (10 * S, 58 * S)], fill=255)
    cmk = cmk.filter(ImageFilter.GaussianBlur(0.8 * S)); im.paste(cl, (0, 0), cmk)
    sd = Image.new('L', (w, h), 0); ImageDraw.Draw(sd).polygon([(30 * S, 10 * S), (120 * S, 10 * S), (124 * S, 36 * S), (26 * S, 36 * S)], fill=60)
    sd = sd.filter(ImageFilter.GaussianBlur(6 * S)); im.paste((255, 255, 255, 255), (0, 0), sd)
    d = ImageDraw.Draw(im)
    d.line([(26 * S, 42 * S), (124 * S, 42 * S)], fill=(170, 140, 90, 255), width=3 * S)
    d.line([(74 * S, 42 * S), (66 * S, 64 * S)], fill=(170, 140, 90, 255), width=2 * S)
    d.line([(76 * S, 42 * S), (86 * S, 62 * S)], fill=(170, 140, 90, 255), width=2 * S)
    # blank paper label (text is set in HTML)
    lb = Image.new('L', (w, h), 0); ImageDraw.Draw(lb).rectangle([34 * S, 108 * S, 116 * S, 152 * S], fill=255)
    im.paste((246, 238, 214, 255), (0, 0), lb)
    ImageDraw.Draw(im).rectangle([34 * S, 108 * S, 116 * S, 152 * S], outline=(150, 46, 34, 255), width=1 * S)
    im.resize((300, 380), Image.LANCZOS).save(A('honey-jar.png'))

# ---------- chalk hobo mark: the cat, "a kind lady lives here" ----------
def chalk_mark():
    S = 4; w, h = 200 * S, 150 * S
    rnd = random.Random(7)
    lines = Image.new('L', (w, h), 0); d = ImageDraw.Draw(lines)
    def stroke(pts, wd=5):
        for _ in range(3):
            j = [(x * S + rnd.uniform(-1.4, 1.4) * S, y * S + rnd.uniform(-1.4, 1.4) * S) for x, y in pts]
            d.line(j, fill=255, width=int(wd * S * rnd.uniform(0.7, 1.0)), joint='curve')
    def arc(cx, cy, rx, ry, a0, a1, n=24):
        return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)), cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]
    # sitting cat: body, head, ears, tail
    stroke(arc(100, 98, 30, 36, 200, 520))
    stroke(arc(100, 46, 17, 15, 0, 360))
    stroke([(86, 38), (84, 22), (95, 32)]); stroke([(105, 32), (116, 22), (114, 38)])
    stroke(arc(140, 116, 14, 16, 180, 330), 4)
    stroke([(93, 46), (95, 46)], 3); stroke([(105, 46), (107, 46)], 3)
    # ground line
    stroke([(40, 136), (160, 136)], 4)
    lines = lines.filter(ImageFilter.GaussianBlur(0.8 * S))
    # chalk tooth: break the strokes with coarse noise
    nz = Image.new('L', (w // 3, h // 3)); nz.putdata([rnd.randint(90, 255) for _ in range((w // 3) * (h // 3))])
    nz = nz.resize((w, h), Image.NEAREST).filter(ImageFilter.GaussianBlur(1.2))
    a = ImageChops.multiply(lines, nz)
    out = Image.new('RGBA', (w, h), (240, 236, 222, 0)); out.putalpha(a)
    out.resize((400, 300), Image.LANCZOS).save(A('chalk-cat.png'))

if __name__ == '__main__':
    os.makedirs(os.path.join(D, 'assets'), exist_ok=True)
    wear('front', 1931); wear('back', 1991)
    print('painted')
