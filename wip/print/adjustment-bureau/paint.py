"""Paints the press assets for the Norris for Senate election night reception card
(The Adjustment Bureau, 2006). The card is a two-spot-ink job from a union campaign
print shop: PMS navy and PMS red on 130 lb uncoated white cover.

Every piece of art is painted here so it carries a press finish: uneven ink laydown,
ink spread on knocked-out letters, the red plate sitting a hair off the navy plate,
and a coarse 45 degree halftone for the candidate photo.

assets/panel-front.png   navy solid with NORRIS knocked out, stars, red and white stripe band
assets/panel-back.png    navy header strip with stars and stripe band for the menu side
assets/photo-halftone.png  TMDB podium still as a coarse one-colour red halftone
assets/perf-h.png, perf-v.png  perforation cuts for the tear-off drink tickets
assets/union-bug.png     generic union print shop mark (not a real union's label)
assets/wear-front.png, wear-back.png  soft handling wear and card-edge toning
assets/stain-ring.png    faint champagne flute ring for the back
"""
import math, os, random, shutil, subprocess
from PIL import Image, ImageChops, ImageDraw, ImageFilter, ImageFont, ImageOps

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets'); os.makedirs(A, exist_ok=True)
F = os.path.join(D, 'fonts')
S = 2                                   # assets at 2x CSS px
W, H = 576, 864
NAVY = (29, 42, 78); RED = (196, 34, 46)

shutil.copy('/home/claude/polish/wip/print/jurassic/src/assets/paper-grain.png', os.path.join(A, 'paper-grain.png'))

def font(name, size, wght):
    f = ImageFont.truetype(os.path.join(F, name), size)
    f.set_variation_by_axes([wght])
    return f

def soft_noise(w, h, scale, seed):
    """Big, gentle low-frequency mottling, 0..255."""
    random.seed(seed)
    sw, sh = max(2, w // scale), max(2, h // scale)
    small = Image.new('L', (sw, sh))
    small.putdata([random.randint(0, 255) for _ in range(sw * sh)])
    return small.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(scale * 0.35))

def fine_noise(w, h, seed):
    random.seed(seed)
    n = Image.new('L', (w, h))
    n.putdata([random.randint(0, 255) for _ in range(w * h)])
    return n

def press(mask, seed, lo=0.86, spread=1.2, pin=0.0):
    """Turn a hard mask (255 = ink) into a press impression: soft ink spread on edges,
    uneven laydown across the solid, and optional tiny pinholes in the solid."""
    w, h = mask.size
    m = mask.filter(ImageFilter.GaussianBlur(spread))
    # roughen the edge: threshold the blurred edge against fine noise
    nz = fine_noise(w, h, seed).filter(ImageFilter.GaussianBlur(0.7))
    m = ImageChops.add(m, nz.point(lambda v: (v - 128) // 3 if v > 128 else 0))
    m = m.point(lambda v: 0 if v < 110 else (255 if v > 150 else int((v - 110) * 255 / 40)))
    dens = soft_noise(w, h, 90, seed + 1).point(lambda v: int(255 * (lo + (1 - lo) * v / 255)))
    out = ImageChops.multiply(m, dens)
    if pin:
        p = fine_noise(w, h, seed + 2).point(lambda v: 255 if v > 255 - pin else 0).filter(ImageFilter.GaussianBlur(0.6))
        out = ImageChops.subtract(out, p.point(lambda v: v // 2))
    return out

def ink_layer(alpha, colour):
    lay = Image.new('RGBA', alpha.size, colour + (0,))
    lay.putalpha(alpha)
    return lay

def star(d, cx, cy, r, fill):
    pts = []
    for i in range(10):
        a = -math.pi / 2 + i * math.pi / 5
        rr = r if i % 2 == 0 else r * 0.40
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=fill)

def stripes(h_css, top_css, seed, dx=1.5, dy=1.0):
    """Red stripe band: two red stripes printed on the red plate, sitting a hair off register."""
    w = W * S
    m = Image.new('L', (w, h_css * S), 0)
    d = ImageDraw.Draw(m)
    y = (top_css + dy) * S
    d.rectangle([0, y, w, y + 9 * S], fill=255)
    d.rectangle([0, y + 15 * S, w, y + 19 * S], fill=255)
    m = ImageChops.offset(m, int(dx * S), 0)
    return ink_layer(press(m, seed, lo=0.88), RED)

# ---------- front panel ----------
PH = 304                                   # navy solid height, CSS px
def panel_front():
    w, h = W * S, (PH + 26) * S
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    d.rectangle([0, 0, w, PH * S], fill=255)
    # knock out NORRIS
    f = font('Antonio.ttf', 400 * S, 700)
    bb = f.getbbox('NORRIS')
    sc = (W - 2 * 38) * S / (bb[2] - bb[0])
    f = font('Antonio.ttf', int(400 * S * sc), 700)
    bb = f.getbbox('NORRIS')
    x0 = 38 * S - bb[0]
    y0 = 78 * S - bb[1]
    d.text((x0, y0), 'NORRIS', font=f, fill=0)
    cap_bottom = 78 * S + (bb[3] - bb[1])
    # knocked out stars, a row of five each side of the kicker line
    for i in range(5):
        star(d, (44 + i * 17) * S, 50 * S, 6 * S, 0)
        star(d, (W - 44 - i * 17) * S, 50 * S, 6 * S, 0)
    # knocked out rule under the wordmark
    d.rectangle([40 * S, cap_bottom + 14 * S, (W - 40) * S, cap_bottom + 16 * S], fill=0)
    navy = press(m, 7, lo=0.84, pin=1)
    img = ink_layer(navy, NAVY)
    img.alpha_composite(stripes(PH + 26, PH + 3, 8))
    img.save(os.path.join(A, 'panel-front.png'))
    print('front wordmark bottom css', cap_bottom / S)

def panel_back():
    hh = 58
    w, h = W * S, (hh + 26) * S
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    d.rectangle([0, 0, w, hh * S], fill=255)
    for i in range(3):
        star(d, (W - 48 - i * 17) * S, 18 * S, 5 * S, 0)
    navy = press(m, 17, lo=0.84, pin=1)
    img = ink_layer(navy, NAVY)
    img.alpha_composite(stripes(hh + 26, hh + 3, 18))
    img.save(os.path.join(A, 'panel-back.png'))

# ---------- coarse red halftone ----------
def halftone():
    SRC = os.path.join(A, 'podium-original.jpg')
    if not os.path.exists(SRC):
        subprocess.run(['curl', '-s', '-o', SRC, 'https://image.tmdb.org/t/p/original/8q2UGgp8YSQWLrTtU9YJyA1u0Fd.jpg'], check=True)
    cw, ch = 236, 288                       # CSS box
    im = Image.open(SRC).convert('L')
    box = (905, 0, 905 + int(1080 * cw / ch), 1080)
    im = im.crop(box)
    # lift the deep shadows so a one-colour plate still holds the jacket and the dark backdrop
    im = ImageOps.autocontrast(im, cutoff=0.5)
    im = im.point(lambda v: int(255 * ((v / 255) ** 0.8)))
    im = im.filter(ImageFilter.UnsharpMask(6, 120, 2))
    im = ImageOps.autocontrast(im.point(lambda v: int(40 + v * 0.84)))
    SS = 4                                  # supersample for clean dots
    W2, H2 = cw * S * SS, ch * S * SS
    src = im.resize((W2, H2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(SS))
    px = src.load()
    out = Image.new('L', (W2, H2), 0)
    d = ImageDraw.Draw(out)
    cell = 5.6 * SS                          # about 34 lines per inch at 96 dpi: a coarse newsprint screen
    ang = math.radians(45)
    ca, sa = math.cos(ang), math.sin(ang)
    diag = int(math.hypot(W2, H2) / cell) + 2
    random.seed(45)
    for i in range(-diag, diag):
        for j in range(-diag, diag):
            u, v = (i + 0.5) * cell, (j + 0.5) * cell
            x = u * ca - v * sa + W2 / 2
            y = u * sa + v * ca + H2 / 2
            if not (-cell <= x < W2 + cell and -cell <= y < H2 + cell):
                continue
            g = px[min(W2 - 1, max(0, int(x))), min(H2 - 1, max(0, int(y)))]
            dark = 1 - g / 255
            dark = 0.04 + 0.64 * dark            # cap the solids so the screen stays open in the backdrop
            if dark < 0.05:
                continue
            gain = 1.06 + random.uniform(-0.05, 0.05)       # dot gain on uncoated stock
            r = cell * 0.5 * math.sqrt(dark * 4 / math.pi) * gain
            r = min(r, cell * 0.74)
            d.ellipse([x - r, y - r, x + r, y + r], fill=255)
    out = out.resize((cw * S, ch * S), Image.LANCZOS)
    out = press(out.point(lambda v: 255 if v > 127 else int(v * 2)), 31, lo=0.86, spread=0.5)
    ink_layer(out, RED).save(os.path.join(A, 'photo-halftone.png'))

# ---------- perforations ----------
def perf(horizontal, length_css):
    L = length_css * S
    w, h = (L, 6 * S) if horizontal else (6 * S, L)
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sh = Image.new('L', (w, h), 0); hi = Image.new('L', (w, h), 0)
    ds, dh = ImageDraw.Draw(sh), ImageDraw.Draw(hi)
    step, cut = 11, 7                           # CSS px: a tear-off ticket perf, about 9 cuts to the inch
    p = 3
    while p + cut < length_css - 2:
        if horizontal:
            ds.rounded_rectangle([p * S, 2.2 * S, (p + cut) * S, 3.6 * S], radius=S, fill=170)
            dh.rectangle([p * S, 3.7 * S, (p + cut) * S, 4.4 * S], fill=120)
        else:
            ds.rounded_rectangle([2.2 * S, p * S, 3.6 * S, (p + cut) * S], radius=S, fill=170)
            dh.rectangle([3.7 * S, p * S, 4.4 * S, (p + cut) * S], fill=120)
        p += step
    sh = sh.filter(ImageFilter.GaussianBlur(0.6)); hi = hi.filter(ImageFilter.GaussianBlur(0.6))
    img.alpha_composite(ink_layer(hi, (255, 255, 255)))
    img.alpha_composite(ink_layer(sh, (62, 58, 52)))
    return img

# ---------- union bug ----------
def union_bug():
    SS = 4
    cw, ch = 70, 38
    w, h = cw * S * SS, ch * S * SS
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    lw = int(1.4 * S * SS)
    d.ellipse([lw, lw, w - lw, h - lw], outline=255, width=lw)
    d.ellipse([lw * 3.2, lw * 3.2, w - lw * 3.2, h - lw * 3.2], outline=255, width=max(1, lw // 2))
    f = font('Antonio.ttf', int(9.5 * S * SS), 700)
    def arc_text(txt, top):
        n = len(txt)
        span = math.radians(100 if top else 50)
        cx, cy = w / 2, h / 2
        rx, ry = w / 2 - lw * 5.8, h / 2 - lw * 5.8
        for k, ch_ in enumerate(txt):
            t = (k - (n - 1) / 2) / max(1, n - 1) * span
            if top:
                a = -math.pi / 2 + t
            else:
                a = math.pi / 2 - t
            x, y = cx + rx * math.cos(a), cy + ry * math.sin(a)
            g = Image.new('L', (int(14 * S * SS), int(14 * S * SS)), 0)
            ImageDraw.Draw(g).text((g.width / 2, g.height / 2), ch_, font=f, fill=255, anchor='mm')
            rot = -math.degrees(a + math.pi / 2) if top else -math.degrees(a - math.pi / 2)
            g = g.rotate(rot, resample=Image.BICUBIC)
            m.paste(255, (int(x - g.width / 2), int(y - g.height / 2)), g)
    arc_text('UNION LABEL', True)
    arc_text('N.Y.C.', False)
    f2 = font('Antonio.ttf', int(10 * S * SS), 700)
    d.text((w / 2, h / 2), '12', font=f2, fill=255, anchor='mm')
    m = m.resize((cw * S, ch * S), Image.LANCZOS)
    ink_layer(press(m, 51, lo=0.9, spread=0.4), NAVY).save(os.path.join(A, 'union-bug.png'))

# ---------- soft wear, heavy card ----------
def wear(seed, corner, name):
    w, h = W * S, H * S
    edge = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(edge)
    for i in range(36):
        d.rectangle([i, i, w - 1 - i, h - 1 - i], outline=int(30 * (1 - i / 36) ** 2))
    edge = edge.filter(ImageFilter.GaussianBlur(8))
    # the cut edge of a thick cover stock reads as a fine darker line
    cut = Image.new('L', (w, h), 0)
    ImageDraw.Draw(cut).rectangle([0, 0, w - 1, h - 1], outline=46, width=2)
    mott = soft_noise(w, h, 140, seed).point(lambda v: max(0, (v - 150) // 9))
    a = ImageChops.add(ImageChops.add(edge, cut.filter(ImageFilter.GaussianBlur(1))), mott)
    cx, cy = corner
    c = Image.new('L', (w, h), 0)
    ImageDraw.Draw(c).ellipse([cx * S - 110, cy * S - 110, cx * S + 110, cy * S + 110], fill=18)
    a = ImageChops.add(a, c.filter(ImageFilter.GaussianBlur(60)))
    ink_layer(a, (118, 98, 70)).save(os.path.join(A, name))

def ring():
    R = 74 * S; sz = R * 2 + 40; c = sz // 2
    m = Image.new('L', (sz, sz), 0); d = ImageDraw.Draw(m)
    d.ellipse([c - R, c - R, c + R, c + R], outline=40, width=5)
    d.ellipse([c - R + 5, c - R + 5, c + R - 5, c + R - 5], outline=12, width=8)
    gap = Image.new('L', (sz, sz), 255)
    ImageDraw.Draw(gap).pieslice([0, 0, sz, sz], 200, 255, fill=30)
    m = ImageChops.multiply(m, gap).filter(ImageFilter.GaussianBlur(2.4))
    ink_layer(m, (150, 125, 70)).save(os.path.join(A, 'stain-ring.png'))

panel_front(); panel_back(); halftone()
perf(True, W).save(os.path.join(A, 'perf-h.png'))
perf(False, 120).save(os.path.join(A, 'perf-v.png'))
union_bug(); wear(11, (W, H), 'wear-front.png'); wear(23, (0, 0), 'wear-back.png'); ring()
for f in ('candidate.jpg',):
    p = os.path.join(A, f)
    if os.path.exists(p): os.remove(p)
print('painted')
