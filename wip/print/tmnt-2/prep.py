"""Prepares the photos for the Lucky 4 Pizza box lid (TMNT II, 1991).
lair: TMDB still of the Turtles at home with a pie. april: TMDB still of April with the Turtles.
wear-lid.png: soft edge wear for the white corrugated lid."""
import os
from PIL import Image, ImageEnhance, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')


def prep(src, out, box, size, bright=1.08, con=1.06, col=1.05):
    im = Image.open(os.path.join(A, src)).convert('RGB').crop(box).resize(size, Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(bright)
    im = ImageEnhance.Contrast(im).enhance(con)
    im = ImageEnhance.Color(im).enhance(col)
    im.save(os.path.join(A, out), quality=92)


prep('src-lair.jpg', 'still-lair.jpg', (0, 20, 1920, 1060), (1000, 542), bright=1.14)
prep('src-april.jpg', 'still-april.jpg', (560, 0, 1920, 830), (520, 318), bright=1.06)

S = 960
m = Image.new('L', (S, S), 0)
dm = ImageDraw.Draw(m)
for i in range(70):
    dm.rectangle([i, i, S - 1 - i, S - 1 - i], outline=int(60 * (1 - i / 70) ** 2))
m = m.filter(ImageFilter.GaussianBlur(12))
wear = Image.new('RGBA', (S, S), (92, 80, 52, 255))
wear.putalpha(m)
wear.save(os.path.join(A, 'wear-lid.png'))
print('ok')
