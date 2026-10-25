"""Crops the two TMDB stills for the Wendover room service card and paints the soft paper wear.
Writes assets/still-park.jpg, assets/still-flight.jpg, assets/wear-front.png, assets/wear-back.png."""
import os, random, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1]  # folder holding s1.jpg (park steps) and s2.jpg (jet cabin) from TMDB


def crop(src, box, size, out):
    im = Image.open(os.path.join(SRC, src)).convert('RGB').crop(box).resize(size, Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(1.04)
    im.save(os.path.join(D, 'assets', out), quality=90)


crop('s1.jpg', (0, 120, 3840, 2080), (1384, 706), 'still-park.jpg')       # shown 692x353
crop('s2.jpg', (40, 20, 1280, 720), (636, 359), 'still-flight.jpg')        # shown 318x179


def wear(name, seed):
    rnd = random.Random(seed)
    PW, PH = 816, 1056
    m = Image.new('L', (PW, PH), 0); md = ImageDraw.Draw(m)
    for i in range(46):
        md.rectangle([i, i, PW - 1 - i, PH - 1 - i], outline=max(0, int(70 - i * 1.5)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (PW // 16, PH // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 20))
    mot = mot.resize((PW, PH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    a = ImageChops.add(m, mot)
    lay = Image.new('RGBA', (PW, PH), (110, 70, 30, 0)); lay.putalpha(a.point(lambda v: int(v * 0.5)))
    lay.save(os.path.join(D, 'assets', f'wear-{name}.png'))


wear('front', 3); wear('back', 7)
print('painted')
