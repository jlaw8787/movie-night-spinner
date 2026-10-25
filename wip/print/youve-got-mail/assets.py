"""Prepares the photo assets and the soft paper wear for the Fox Books cafe menu.
TMDB stills are cropped and lifted a touch (no tints). Wear is soft edge toning only."""
import os, random, sys
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
S = sys.argv[1]  # folder holding the TMDB originals

def still(src, box, size, out, bright=1.0, contrast=1.0):
    im = Image.open(os.path.join(S, src)).convert('RGB').crop(box).resize(size, Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(bright)
    im = ImageEnhance.Contrast(im).enhance(contrast)
    im.save(os.path.join(D, 'assets', out), quality=92)

# Front hero: the Fox & Sons Books facade and sign (crop above the street).
still('oiZ1HwAER8jWgjkc0Vhu32T5sUAI.jpg', (150, 0, 990, 396), (1408, 664), 'still-facade.jpg', 1.04, 1.04)
# Back: a book party spread (salmon roe garnish, sliced ham, crudites).
still('ogsjkFchbhQLymCum88qT0Pu07fs.jpg', (380, 90, 1280, 630), (636, 382), 'still-platter.jpg', 1.22, 1.03)

def wear(name, seed):
    rnd = random.Random(seed)
    PW, PH = 816, 1056
    m = Image.new('L', (PW, PH), 0); md = ImageDraw.Draw(m)
    for i in range(40):
        md.rectangle([i, i, PW - 1 - i, PH - 1 - i], outline=max(0, int(56 - i * 1.4)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (PW // 16, PH // 16), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 16))
    mot = mot.resize((PW, PH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(26))
    a = ImageChops.add(m, mot)
    lay = Image.new('RGBA', (PW, PH), (120, 92, 60, 0)); lay.putalpha(a.point(lambda v: int(v * 0.5)))
    lay.save(os.path.join(D, 'assets', f'wear-{name}.png'))

wear('front', 152); wear('back', 295)
print('assets done')
