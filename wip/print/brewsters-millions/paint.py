"""Prepares art for the Hackensack Bulls ballpark bill of fare: two TMDB stills, cropped and lightly brightened,
plus a soft paper wear layer (edge vignette and big gentle mottling, no pixel noise)."""
import os, random
from PIL import Image, ImageEnhance, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
S = '/tmp/claude-0/-home-claude/6d06a22c-2024-50a8-a2d1-a12880d59711/scratchpad/bm'
A = os.path.join(D, 'assets')


def lift(im):
    im = ImageEnhance.Brightness(im).enhance(1.05)
    im = ImageEnhance.Contrast(im).enhance(1.04)
    return ImageEnhance.Color(im).enhance(1.06)


hero = Image.open(os.path.join(S, 'hero.jpg')).convert('RGB')
hero = hero.crop((0, 8, 1280, 8 + 597)).resize((1372, 640), Image.LANCZOS)
lift(hero).save(os.path.join(A, 'still-battery.jpg'), quality=90)

close = Image.open(os.path.join(S, 'close.jpg')).convert('RGB')
close = close.crop((540, 0, 1340, 1000)).resize((560, 700), Image.LANCZOS)
lift(close).save(os.path.join(A, 'still-pitcher.jpg'), quality=90)

# paper wear: warm edge vignette plus low-frequency mottling, transparent centre
W, H = 816, 1056
random.seed(1985)
small = Image.new('L', (17, 22))
small.putdata([random.randint(0, 255) for _ in range(17 * 22)])
mott = small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
alpha = Image.new('L', (W, H))
px, mp = alpha.load(), mott.load()
for y in range(H):
    for x in range(W):
        dx = min(x, W - 1 - x) / 120.0
        dy = min(y, H - 1 - y) / 120.0
        e = max(0.0, 1.0 - min(dx, dy, 1.0))
        a = 70 * e ** 1.6 + (mp[x, y] - 128) * 0.10
        px[x, y] = max(0, min(255, int(a)))
wear = Image.new('RGBA', (W, H), (120, 84, 30, 0))
wear.putalpha(alpha)
wear.save(os.path.join(A, 'paper-wear.png'))
print('painted')
