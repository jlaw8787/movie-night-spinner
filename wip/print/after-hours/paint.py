"""Paints the soft wear for the Last Stop bar menu (After Hours, 1985).
Cream card stock, printed with a solid black flood on the front and black plus red on the back.
Wear is big and gentle: rubbed corners and edges where the black flood has scuffed back to the
card, a little yellowing at the edges of the back, and one faint glass ring.
Writes assets/wear-front.png, assets/wear-back.png."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FW, FH, S = 816, 1056, 2
W, H = FW * S, FH * S
random.seed(1985)

def mottle(scale, lo, hi, seed):
    """Big soft noise field, values lo..hi."""
    random.seed(seed)
    n = Image.effect_noise((max(2, W // scale), max(2, H // scale)), 60).resize((W, H), Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(scale * 0.6))
    return n.point(lambda v: int(max(0, min(255, lo + (v - 70) / 116 * (hi - lo)))))

def edge_mask(width, power=2.2):
    """255 at the very edge, falling to 0 at `width` px in, corners stronger."""
    m = Image.new('L', (W, H), 0)
    px = m.load()
    for y in range(0, H, 4):
        for x in range(0, W, 4):
            d = min(x, y, W - 1 - x, H - 1 - y)
            dc = min(math.hypot(x, y), math.hypot(W - x, y), math.hypot(x, H - y), math.hypot(W - x, H - y))
            v = max(0.0, 1 - d / width) ** power
            v = max(v, max(0.0, 1 - dc / (width * 2.2)) ** 1.6)
            val = int(255 * min(1, v))
            for yy in range(y, min(y + 4, H)):
                for xx in range(x, min(x + 4, W)):
                    px[xx, yy] = val
    return m.filter(ImageFilter.GaussianBlur(6))

# ---- front: scuffs back to cream card on a black flood ----
em = edge_mask(16 * S, 1.6)
mot = mottle(50, 110, 255, 7)
a = ImageChops.multiply(em, mot).point(lambda v: int(v * 0.55))
# one broad rub at the lower right where a thumb holds the card
rub = Image.new('L', (W, H), 0); rd = ImageDraw.Draw(rub)
rd.ellipse((W * 0.80, H * 0.90, W * 1.10, H * 1.06), fill=34)
rub = rub.filter(ImageFilter.GaussianBlur(36 * S))
a = ImageChops.lighter(a, rub)
# whole-face unevenness of the flood, very low
a = ImageChops.lighter(a, mottle(160, 0, 10, 11))
front = Image.new('RGBA', (W, H), (228, 219, 196, 0)); front.putalpha(a)
front.save(os.path.join(A, 'wear-front.png'))

# ---- back: edge yellowing, soft mottling, one faint glass ring ----
em2 = edge_mask(70 * S, 1.8)
a2 = ImageChops.multiply(em2, mottle(70, 60, 255, 21)).point(lambda v: int(v * 0.42))
a2 = ImageChops.lighter(a2, mottle(120, 0, 22, 23))
back = Image.new('RGBA', (W, H), (150, 110, 50, 0)); back.putalpha(a2)
ring = Image.new('L', (W, H), 0); rg = ImageDraw.Draw(ring)
cx, cy, r = W * 0.94, H * 0.035, 66 * S        # top right corner, mostly off the trim
rg.ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=7 * S)
rg.ellipse((cx - r + 4 * S, cy - r + 3 * S, cx + r - 2 * S, cy + r - 5 * S), outline=150, width=3 * S)
ring = ring.filter(ImageFilter.GaussianBlur(3.2 * S))
ring = ImageChops.multiply(ring, mottle(18, 60, 255, 31)).point(lambda v: int(v * 0.30))
ringl = Image.new('RGBA', (W, H), (140, 92, 40, 0)); ringl.putalpha(ring)
back = Image.alpha_composite(back, ringl)
back.save(os.path.join(A, 'wear-back.png'))

print('painted wear')
