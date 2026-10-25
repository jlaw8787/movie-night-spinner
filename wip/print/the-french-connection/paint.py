"""Paints the image assets for Le Vieux Port, the East Side French restaurant in The French Connection (1971).
  photo-street.png  TMDB still: a Manhattan street on a January morning, steam and cabs (signs cropped out)
  photo-port.png    LOC photochrom of the Vieux Port, Marseille (public domain), printed as the house picture
  wear-f1.png, wear-f2.png  soft aged edges on the pearl grey stock
  ring.png          a cold paper-cup coffee ring, placed off the text
"""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageOps, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FW, FH, S = 672, 1344, 2
W, H = FW * S, FH * S


def mottle(w, h, scale, lo, hi, seed):
    random.seed(seed)
    n = Image.effect_noise((max(2, w // scale), max(2, h // scale)), 60).resize((w, h), Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(scale * 0.6))
    return n.point(lambda v: int(max(0, min(255, lo + (v - 70) / 116 * (hi - lo)))))


def edge_mask(width):
    sw, sh = W // 8, H // 8
    m = Image.new('L', (sw, sh), 0); px = m.load(); wd = width / 8
    for y in range(sh):
        for x in range(sw):
            d = min(x, y, sw - 1 - x, sh - 1 - y)
            px[x, y] = int(255 * max(0.0, 1 - d / wd) ** 1.8)
    return m.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(12))


def wear(seed):
    a = ImageChops.multiply(edge_mask(70 * S), mottle(W, H, 80, 80, 255, seed)).point(lambda v: int(v * 0.42))
    a = ImageChops.lighter(a, mottle(W, H, 160, 0, 18, seed + 1))
    img = Image.new('RGBA', (W, H), (120, 112, 84, 0)); img.putalpha(a)
    return img


wear(71).save(os.path.join(A, 'wear-f1.png'))
wear(171).save(os.path.join(A, 'wear-f2.png'))


def photo(src, box, size, out, warm=False):
    im = Image.open(os.path.join(A, src)).convert('RGB').crop(box)
    im = ImageOps.autocontrast(im, cutoff=0.6)
    im = ImageEnhance.Brightness(im).enhance(1.06)
    im = ImageEnhance.Color(im).enhance(1.05)
    im = im.resize((size[0] * S, size[1] * S), Image.LANCZOS)
    im = im.filter(ImageFilter.UnsharpMask(2, 60, 2))
    random.seed(19)
    g = Image.effect_noise(im.size, 14).filter(ImageFilter.GaussianBlur(0.6))
    g = Image.merge('RGB', (g, g, g))
    im = ImageChops.add(im, g.point(lambda v: int((v - 128) * 0.25) + 128), 1, -128)
    im.save(os.path.join(A, out))


# the street: right of the hotel canopy, steam rising, yellow cabs at the kerb (no signs in frame)
photo('src-street.jpg', (872, 40, 1280, 690), (276, 440), 'photo-street.png')
# Vieux Port photochrom: quay, ships and the old town
photo('src-vieuxport.jpg', (0, 190, 1008, 659), (588, 274), 'photo-port.png')

# coffee ring: a paper cup set down cold, broken and faint
R = 120 * S
ring = Image.new('L', (R, R), 0); rg = ImageDraw.Draw(ring)
c, r = R / 2, 46 * S
rg.ellipse((c - r, c - r, c + r, c + r), outline=255, width=5 * S)
rg.ellipse((c - r + 4 * S, c - r + 3 * S, c + r - 3 * S, c + r - 4 * S), outline=110, width=2 * S)
ring = ring.filter(ImageFilter.GaussianBlur(2.4 * S))
ring = ImageChops.multiply(ring, mottle(R, R, 10, 30, 255, 7)).point(lambda v: int(v * 0.42))
fill = Image.new('L', (R, R), 0); ImageDraw.Draw(fill).ellipse((c - r, c - r, c + r, c + r), fill=22)
fill = fill.filter(ImageFilter.GaussianBlur(6 * S))
rl = Image.new('RGBA', (R, R), (112, 74, 34, 0)); rl.putalpha(ImageChops.lighter(ring, fill))
rl.save(os.path.join(A, 'ring.png'))
print('painted')
