"""Paints the period art and soft wear for the Perlmutter's tab sheet (Serpico, Greenwich Village, 1967).
The object: one sheet off a pale green two-column columnar pad, kept under the register.
The owner wrote his price list on one side and the cops' tab on the other.
Art here is rubber-stamp work, the only art a deli counter makes: the shop's violet
address stamp and a red PAID stamp, inked unevenly with a light double strike.
Wear is big and soft: edge yellowing, a coffee ring, a grease spot, two binder holes.
Writes assets/stamp-shop.png, assets/stamp-paid-*.png, assets/wear-front.png, assets/wear-back.png."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageFont
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
F = '/home/claude/polish/wip/print/jurassic/fonts/'
FW, FH, S = 816, 1056, 2
W, H = FW * S, FH * S

def font(w, px): return ImageFont.truetype(F + f'LibreFranklin-{w}.ttf', px)

def blotch(size, scale, seed, lo=0, hi=255):
    random.seed(seed)
    n = Image.effect_noise((max(2, size[0] // scale), max(2, size[1] // scale)), 64).resize(size, Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(max(1, scale * 0.5)))
    return n.point(lambda v: int(max(0, min(255, lo + (v - 70) / 116 * (hi - lo)))))

def ink(mask, rgb, seed, strength=1.0):
    """Turn a hard mask into a rubber-stamp impression: uneven inking, starved patches, soft bleed."""
    w, h = mask.size
    m = mask.filter(ImageFilter.GaussianBlur(1.1))
    patchy = blotch((w, h), 18, seed, 120, 255)          # big uneven inking
    starve = blotch((w, h), 7, seed + 1, 150, 300)        # small starved spots
    m = ImageChops.multiply(m, patchy)
    m = ImageChops.multiply(m, starve.point(lambda v: min(255, v)))
    m = m.point(lambda v: int(min(255, v * 1.25 * strength)))
    out = Image.new('RGBA', (w, h), rgb + (0,)); out.putalpha(m)
    return out

def shop_stamp():
    w, h = 640, 250
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    d.rounded_rectangle((6, 6, w - 6, h - 6), 22, outline=255, width=7)
    d.rounded_rectangle((20, 20, w - 20, h - 20), 14, outline=255, width=3)
    def c(t, f, y):
        tw = d.textlength(t, font=f); d.text(((w - tw) / 2, y), t, font=f, fill=255)
    c("PERLMUTTER'S", font(900, 66), 30)
    c('DELICATESSEN  &  APPETIZING', font(700, 30), 104)
    d.line((70, 148, w - 70, 148), fill=255, width=3)
    c('Hot Meats  ·  Platters  ·  We Deliver', font(600, 27), 158)
    c('GREENWICH VILLAGE, N. Y. C.', font(700, 24), 198)
    a = ink(m, (88, 52, 140), 67)
    # light double strike, offset a hair, as when the stamp rocks
    b = ink(m, (88, 52, 140), 68, 0.14)
    out = Image.new('RGBA', (w + 8, h + 8), (0, 0, 0, 0))
    out.alpha_composite(b, (3, 2)); out.alpha_composite(a, (0, 0))
    out.save(os.path.join(A, 'stamp-shop.png'))

def paid_stamp(n, seed, strength):
    w, h = 210, 86
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    d.rectangle((4, 4, w - 4, h - 4), outline=255, width=6)
    f = font(900, 58); t = 'PAID'; tw = d.textlength(t, font=f)
    d.text(((w - tw) / 2, 4), t, font=f, fill=255)
    a = ink(m, (186, 40, 38), seed, strength)
    a.save(os.path.join(A, f'stamp-paid-{n}.png'))

def edge_mask(width, power=2.0):
    small = Image.new('L', (W // 8, H // 8), 0); px = small.load()
    sw, sh = small.size; wd = width / 8
    for y in range(sh):
        for x in range(sw):
            dd = min(x, y, sw - 1 - x, sh - 1 - y)
            px[x, y] = int(255 * max(0.0, 1 - dd / wd) ** power)
    return small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(10))

def ring(img, cx, cy, r, alpha, seed):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=int(r * 0.07))
    d.ellipse((cx - r * 0.97, cy - r * 0.97, cx + r * 0.97, cy + r * 0.97), outline=120, width=int(r * 0.04))
    m = m.filter(ImageFilter.GaussianBlur(5))
    gap = blotch((W, H), 60, seed, 0, 255)               # the ring breaks up where the cup lifted
    m = ImageChops.multiply(m, gap).point(lambda v: int(v * alpha))
    fill = Image.new('L', (W, H), 0); ImageDraw.Draw(fill).ellipse((cx - r, cy - r, cx + r, cy + r), fill=int(30 * alpha))
    fill = fill.filter(ImageFilter.GaussianBlur(26))
    m = ImageChops.lighter(m, fill)
    layer = Image.new('RGBA', (W, H), (120, 82, 40, 0)); layer.putalpha(m)
    img.alpha_composite(layer)

def holes(img):
    d = ImageDraw.Draw(img)
    for x in (W * 0.5 - 2.125 * 96 * S, W * 0.5 + 2.125 * 96 * S):   # two-post binder holes, 4.25 in apart
        cy = 20 * S
        sh = Image.new('L', (W, H), 0); ImageDraw.Draw(sh).ellipse((x - 15 * S, cy - 13 * S, x + 15 * S, cy + 17 * S), fill=70)
        sh = sh.filter(ImageFilter.GaussianBlur(4 * S))
        lay = Image.new('RGBA', (W, H), (90, 80, 60, 0)); lay.putalpha(sh); img.alpha_composite(lay)
        d.ellipse((x - 12 * S, cy - 12 * S, x + 12 * S, cy + 12 * S), fill=(214, 206, 188, 255))

def base(seed):
    em = edge_mask(46 * S, 1.7)
    mot = blotch((W, H), 90, seed, 90, 255)
    a = ImageChops.multiply(em, mot).point(lambda v: int(v * 0.55))
    a = ImageChops.lighter(a, blotch((W, H), 220, seed + 5, 0, 26))   # whole sheet aged unevenly
    img = Image.new('RGBA', (W, H), (170, 150, 92, 0)); img.putalpha(a)
    return img

def grease(img, cx, cy, rx, ry, seed):
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    m = m.filter(ImageFilter.GaussianBlur(rx * 0.35))
    m = ImageChops.multiply(m, blotch((W, H), 40, seed, 140, 255)).point(lambda v: int(v * 0.16))
    lay = Image.new('RGBA', (W, H), (140, 120, 60, 0)); lay.putalpha(m); img.alpha_composite(lay)

def smudge(img, cx, cy, r, alpha):
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).ellipse((cx - r, cy - r * 0.6, cx + r, cy + r * 0.6), fill=int(255 * alpha))
    m = m.filter(ImageFilter.GaussianBlur(r * 0.5))
    lay = Image.new('RGBA', (W, H), (70, 70, 80, 0)); lay.putalpha(m); img.alpha_composite(lay)

shop_stamp()
for i, (sd, st) in enumerate(((11, 1.0), (12, 0.85), (13, 1.1), (14, 0.75), (15, 0.95), (16, 0.9), (17, 1.05), (18, 0.8))):
    paid_stamp(i, sd, st)

fr = base(3); holes(fr)
ring(fr, int(W * 0.80), int(H * 0.86), 88 * S, 0.55, 21)
smudge(fr, int(W * 0.12), int(H * 0.93), 46 * S, 0.07)
fr.save(os.path.join(A, 'wear-front.png'))

bk = base(9); holes_x = None
# the back is the reverse of the same sheet: holes mirror to the same top edge
holes(bk)
grease(bk, int(W * 0.26), int(H * 0.70), 70 * S, 52 * S, 31)
ring(bk, int(W * 0.17), int(H * 0.13), 70 * S, 0.30, 41)
smudge(bk, int(W * 0.88), int(H * 0.55), 40 * S, 0.06)
bk.save(os.path.join(A, 'wear-back.png'))
print('painted')
