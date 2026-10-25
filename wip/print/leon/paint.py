"""Prepares the image assets for Tony's card: the Mulberry Street photo crop, the milk still,
a red gingham band (the restaurant's tablecloth) and a soft edge wear layer for the walnut stock."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__)); A = os.path.join(D, 'assets'); DL = os.path.join(D, '_dl')
W, H = 528, 1344

# Signature: Mulberry Street, c.1900 (LOC / Detroit Publishing, public domain). Crop keeps out the
# brewery sign at the far left and the publisher's caption along the bottom.
im = Image.open(os.path.join(DL, 'mul_edit.jpg')).convert('RGB')
x0, x1 = 560, 2330; h = round((x1 - x0) * 500 / 448); y0 = 1950 - h
im = im.crop((x0, y0, x1, 1950)).resize((896, 1000), Image.LANCZOS)
im = ImageEnhance.Brightness(im).enhance(1.04); im = ImageEnhance.Contrast(im).enhance(1.05)
im.save(os.path.join(A, 'mulberry.jpg'), quality=90)

# Back still: the glass of milk on the checked cloth (TMDB).
st = Image.open(os.path.join(DL, 'milk.jpg')).convert('RGB')
sw, sh = st.size; ch = round(sw * 236 / 448)
st = st.crop((0, sh - ch, sw, sh)).resize((896, 472), Image.LANCZOS)
st = ImageEnhance.Brightness(st).enhance(1.16); st = ImageEnhance.Contrast(st).enhance(1.04)
st.save(os.path.join(A, 'milk.jpg'), quality=90)

# Gingham band, 2x.
def gingham(w, h, cell=12):
    g = Image.new('RGB', (w, h), (241, 230, 207))
    red = (200, 64, 46)
    px = g.load()
    for y in range(h):
        for x in range(w):
            a = (x // cell) % 2 == 0; b = (y // cell) % 2 == 0
            if a and b: px[x, y] = red
            elif a or b: px[x, y] = (226, 152, 132)
    return g.filter(ImageFilter.GaussianBlur(0.6))
gingham(W * 2, 48).save(os.path.join(A, 'gingham-band.png'))
gingham(96, 96).save(os.path.join(A, 'gingham-square.png'))

# Wear: soft vignette and gentle mottling (low detail), transparent PNG.
def wear(seed):
    random.seed(seed)
    w2, h2 = W * 2, H * 2
    small = Image.new('L', (27, 68))
    sp = small.load()
    for y in range(68):
        for x in range(27): sp[x, y] = random.randint(0, 255)
    mott = small.resize((w2, h2), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    vig = Image.new('L', (w2, h2), 0); d = ImageDraw.Draw(vig)
    for i in range(70):
        v = int(150 * (1 - i / 70) ** 2.2)
        d.rectangle((i * 2, i * 2, w2 - 1 - i * 2, h2 - 1 - i * 2), outline=v, width=2)
    vig = vig.filter(ImageFilter.GaussianBlur(18))
    out = Image.new('RGBA', (w2, h2), (12, 7, 4, 0))
    alpha = Image.eval(vig, lambda v: v)
    lm = Image.eval(mott, lambda v: max(0, v - 150) // 6)
    light = Image.new('RGBA', (w2, h2), (255, 236, 200, 0)); light.putalpha(lm)
    out.putalpha(alpha)
    return Image.alpha_composite(light, out)
wear(7).save(os.path.join(A, 'wear-front.png'))
wear(11).save(os.path.join(A, 'wear-back.png'))
print('ok')
