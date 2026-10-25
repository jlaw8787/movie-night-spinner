"""Paints the soft textures and pencil marks for the Petty Marsh dining room card.
Card is 4.25 x 11 in, 408 x 1056 CSS px; textures are painted at 2x."""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
W, H = 816, 2112

def mottle(seed, alpha):
    random.seed(seed)
    small = Image.new('L', (17, 44), 128)
    px = small.load()
    for y in range(44):
        for x in range(17): px[x, y] = random.randint(96, 160)
    big = small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(60))
    out = Image.new('RGBA', (W, H))
    o = out.load(); b = big.load()
    for y in range(H):
        for x in range(W):
            v = b[x, y] - 128
            # edge wear: darken toward the edges, more at corners
            dx = min(x, W - 1 - x) / W; dy = min(y, H - 1 - y) / H
            e = max(0, 1 - min(dx * 9, dy * 22))
            a = max(0, v) * alpha + e * e * 70
            o[x, y] = (120, 104, 72, int(min(a, 90)))
    return out

def ring():
    im = Image.new('RGBA', (360, 360)); d = ImageDraw.Draw(im)
    for i in range(14):
        r = 140 + i * 0.6
        d.ellipse((180 - r, 180 - r * 0.97, 180 + r, 180 + r * 0.97), outline=(150, 128, 92, 34 - i * 2), width=3)
    d.arc((40, 42, 320, 318), 200, 330, fill=(150, 128, 92, 40), width=6)
    return im.filter(ImageFilter.GaussianBlur(2.2))

def tick():
    im = Image.new('RGBA', (120, 100)); d = ImageDraw.Draw(im)
    pts = [(14, 52), (30, 66), (44, 82), (62, 56), (84, 30), (108, 10)]
    for k in range(3):
        j = [(x + random.uniform(-1.2, 1.2), y + random.uniform(-1.2, 1.2)) for x, y in pts]
        d.line(j, fill=(70, 72, 78, 110), width=5, joint='curve')
    return im.filter(ImageFilter.GaussianBlur(0.8))

mottle(7, 0.9).save(os.path.join(D, 'wear-front.png'))
mottle(19, 0.9).save(os.path.join(D, 'wear-back.png'))
ring().save(os.path.join(D, 'stain-ring.png'))
random.seed(3); tick().save(os.path.join(D, 'pencil-tick.png'))
print('painted')
