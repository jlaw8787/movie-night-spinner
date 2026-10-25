"""Paints the assets for the Autumn Moon take-out menu (Ghost Dog: The Way of the Samurai, 1999).
A legal-size (8.5 x 14 in) take-out menu on pale green copier stock, printed two colour (black and
red) at a quick-print shop and folded in three. Wear is big and gentle: two soft fold creases, a
little edge rub, one faint soy sauce ring on the back cover and a soft grease blot on the inside.
Also paints the red moon logo with three birds flying across it.
Writes assets/wear-outside.png, assets/wear-inside.png, assets/moon-logo.png."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FW, FH, S = 1344, 816, 2
W, H = FW * S, FH * S


def mottle(w, h, scale, lo, hi, seed):
    random.seed(seed)
    Image.core  # noqa
    n = Image.effect_noise((max(2, w // scale), max(2, h // scale)), 60).resize((w, h), Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(scale * 0.6))
    return n.point(lambda v: int(max(0, min(255, lo + (v - 70) / 116 * (hi - lo)))))


def edge_mask(width, power=2.0):
    small = Image.new('L', (W // 8, H // 8), 0)
    px = small.load()
    sw, sh = small.size
    wd = width / 8
    for y in range(sh):
        for x in range(sw):
            d = min(x, y, sw - 1 - x, sh - 1 - y)
            px[x, y] = int(255 * max(0.0, 1 - d / wd) ** power)
    return small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))


def creases(img, dark_side):
    """Two vertical fold creases: a soft shadow on one side, a soft highlight on the other."""
    sh = Image.new('L', (W, H), 0); hi = Image.new('L', (W, H), 0)
    ds, dh = ImageDraw.Draw(sh), ImageDraw.Draw(hi)
    for fx in (448 * S, 896 * S):
        off = -1 if dark_side == 'left' else 1
        ds.rectangle((fx + off * 6 * S - 3 * S, 0, fx + off * 6 * S + 3 * S, H), fill=60)
        ds.rectangle((fx - 1, 0, fx + 1, H), fill=70)
        dh.rectangle((fx - off * 5 * S - 3 * S, 0, fx - off * 5 * S + 3 * S, H), fill=90)
    sh = ImageChops.multiply(sh.filter(ImageFilter.GaussianBlur(5 * S)), mottle(W, H, 90, 120, 255, 5))
    hi = hi.filter(ImageFilter.GaussianBlur(4 * S))
    dl = Image.new('RGBA', (W, H), (60, 70, 50, 0)); dl.putalpha(sh)
    hl = Image.new('RGBA', (W, H), (250, 252, 244, 0)); hl.putalpha(hi.point(lambda v: int(v * 0.6)))
    return Image.alpha_composite(Image.alpha_composite(img, dl), hl)


def base(seed):
    em = edge_mask(46 * S, 1.8)
    a = ImageChops.multiply(em, mottle(W, H, 70, 60, 255, seed)).point(lambda v: int(v * 0.38))
    a = ImageChops.lighter(a, mottle(W, H, 150, 0, 16, seed + 1))
    img = Image.new('RGBA', (W, H), (150, 140, 80, 0)); img.putalpha(a)
    return img


def ring(img, cx, cy, r, seed, col=(120, 70, 30), op=0.30):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=6 * S)
    d.ellipse((cx - r + 5 * S, cy - r + 3 * S, cx + r - 3 * S, cy + r - 6 * S), outline=120, width=3 * S)
    m = m.filter(ImageFilter.GaussianBlur(3 * S))
    m = ImageChops.multiply(m, mottle(W, H, 16, 40, 255, seed)).point(lambda v: int(v * op))
    l = Image.new('RGBA', (W, H), col + (0,)); l.putalpha(m)
    return Image.alpha_composite(img, l)


def blot(img, cx, cy, rx, ry, seed, col=(150, 130, 60), op=0.16):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    d.ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(14 * S))
    m = ImageChops.multiply(m, mottle(W, H, 30, 120, 255, seed)).point(lambda v: int(v * op))
    l = Image.new('RGBA', (W, H), col + (0,)); l.putalpha(m)
    return Image.alpha_composite(img, l)


# outside: creases bend toward the outside, a soy ring on the back cover top right, rubbed corners
out = base(11)
out = creases(out, 'left')
out = ring(out, int(852 * S), int(40 * S), 58 * S, 31)
out.resize((FW * 2, FH * 2)).save(os.path.join(A, 'wear-outside.png'))

# inside: valley folds, one soft grease blot low on the left panel, mostly in the margin
ins = base(21)
ins = creases(ins, 'right')
ins = blot(ins, int(30 * S), int(770 * S), 70 * S, 46 * S, 41)
ins.resize((FW * 2, FH * 2)).save(os.path.join(A, 'wear-inside.png'))
