"""Paint the two material textures for the horror diner menu (no pictures, no icons: light and wear only).
rain-glass.png: water drops and runs on a storm window, lit from above, used behind the front cover's photo.
laminate-wear.png: fine scratches, rubbed edges and a soft sheen for the back's laminated menu sleeve.
Run: python3 paint.py"""
import math, random
from PIL import Image, ImageDraw, ImageFilter
OUT = '/home/claude/polish/wip/genre/horror/'
W, H, S = 816, 1056, 2  # face size, supersample

def rain(seed=13):
    rnd = random.Random(seed)
    im = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
    shade = Image.new('RGBA', im.size, (0, 0, 0, 0))
    d, ds = ImageDraw.Draw(im), ImageDraw.Draw(shade)

    def drop(x, y, r):
        rx, ry = r, r * 1.12
        ds.ellipse([x - rx, y - ry + r * .3, x + rx, y + ry + r * .3], fill=(0, 0, 0, 80))
        d.ellipse([x - rx, y - ry, x + rx, y + ry], fill=(220, 230, 240, 26))
        # light caught along the lower rim, the way a lens throws the sky down
        d.arc([x - rx * .82, y - ry * .82, x + rx * .82, y + ry * .82], 20, 160, fill=(235, 242, 250, 90), width=max(1, int(r * .22)))
        hs = max(1.2, r * .24)
        d.ellipse([x - r * .42 - hs, y - r * .48 - hs, x - r * .42 + hs, y - r * .48 + hs], fill=(255, 255, 255, 210))

    for _ in range(1300):
        r = min(11, 1.1 + rnd.expovariate(1 / 2.3)) * S
        drop(rnd.uniform(0, W * S), rnd.uniform(0, H * S), r)
    for _ in range(34):  # runs: a drop that broke and slid, leaving a thin wet trail
        x, y = rnd.uniform(0, W * S), rnd.uniform(-100, H * S * .8)
        L, w = rnd.uniform(90, 420) * S, rnd.uniform(1.2, 3.2) * S
        for i in range(int(L / 3)):
            x += rnd.uniform(-1.2, 1.2); y += 3
            d.ellipse([x - w, y - w, x + w, y + w], fill=(225, 235, 245, 14))
            ds.ellipse([x - w + 1, y - w + 2, x + w + 1, y + w + 2], fill=(0, 0, 0, 12))
        drop(x, y + w, w * 2.6)
    shade = shade.filter(ImageFilter.GaussianBlur(2 * S))
    out = Image.alpha_composite(shade, im.filter(ImageFilter.GaussianBlur(.55 * S)))
    out.resize((W, H), Image.LANCZOS).save(OUT + 'rain-glass.png', optimize=True)

def laminate(seed=7):
    rnd = random.Random(seed)
    im = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    for _ in range(520):  # hairline scratches, mostly along one handling direction
        x, y = rnd.uniform(0, W * S), rnd.uniform(0, H * S)
        a = math.radians(rnd.gauss(-35, 25)); L = rnd.uniform(6, 44) * S
        d.line([x, y, x + L * math.cos(a), y + L * math.sin(a)], fill=(255, 255, 255, rnd.randint(14, 40)), width=1)
    for _ in range(9):
        x, y, a = rnd.uniform(0, W * S), rnd.uniform(0, H * S), rnd.uniform(0, math.pi)
        pts = []
        for i in range(40):
            a += rnd.uniform(-.04, .04); x += 9 * S * math.cos(a); y += 9 * S * math.sin(a); pts.append((x, y))
        d.line(pts, fill=(255, 255, 255, 30), width=1)
    # rubbed edges and corners where hands hold the menu
    rub = Image.new('L', im.size, 0); dr = ImageDraw.Draw(rub)
    for _ in range(2600):
        side = rnd.random()
        if side < .5:
            x = rnd.choice([rnd.uniform(0, 70), rnd.uniform(W - 70, W)]) * S; y = rnd.uniform(0, H) * S
        else:
            x = rnd.uniform(0, W) * S; y = rnd.choice([rnd.uniform(0, 60), rnd.uniform(H - 60, H)]) * S
        r = rnd.uniform(2, 9) * S
        dr.ellipse([x - r, y - r, x + r, y + r], fill=rnd.randint(8, 30))
    rub = rub.filter(ImageFilter.GaussianBlur(3 * S))
    white = Image.new('RGBA', im.size, (255, 255, 255, 0)); white.putalpha(rub)
    # one broad soft sheen across the sleeve
    sheen = Image.new('L', im.size, 0); dsh = ImageDraw.Draw(sheen)
    dsh.polygon([(W * S * .05, 0), (W * S * .32, 0), (W * S * .02, H * S * .55), (-W * S * .25, H * S * .55)], fill=34)
    sheen = sheen.filter(ImageFilter.GaussianBlur(60 * S))
    shw = Image.new('RGBA', im.size, (255, 255, 255, 0)); shw.putalpha(sheen)
    out = Image.alpha_composite(Image.alpha_composite(shw, white), im)
    out.resize((W, H), Image.LANCZOS).save(OUT + 'laminate-wear.png', optimize=True)

rain(); laminate(); print('painted')
