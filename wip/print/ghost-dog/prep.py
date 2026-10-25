"""Prepares the photos for Raymond's truck board (Ghost Dog, 1999).
coop: TMDB still of the rooftop pigeon coop, cropped above the roof deck and given a gentle dusk warmth.
truck: TMDB still of Raymond's truck window. wear-board.png: soft edge wear for the enamel board."""
import os
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')

# rooftop coop, crop to the coop and sky, no figures
im = Image.open(os.path.join(A, 'src-coop.jpg')).convert('RGB')
im = im.crop((230, 0, 1050, 500)).resize((968, 590), Image.LANCZOS)
im = ImageEnhance.Brightness(im).enhance(1.10)
im = ImageEnhance.Contrast(im).enhance(1.08)
im = ImageEnhance.Color(im).enhance(1.15)
w, h = im.size
# dusk: warm peach low on the sky, soft lavender at the top, faded out by the roofline
glow = Image.new('RGB', (w, h))
gd = ImageDraw.Draw(glow)
for y in range(h):
    t = y / h
    r = int(206 + (250 - 206) * min(1, t * 1.6)); g = int(184 + (180 - 184) * min(1, t * 1.6)); b = int(222 + (132 - 222) * min(1, t * 1.6))
    gd.line([(0, y), (w, y)], fill=(r, g, b))
mask = Image.new('L', (w, h))
md = ImageDraw.Draw(mask)
for y in range(h):
    t = y / h
    a = (0.16 + 0.16 * t / 0.5) if t < 0.5 else max(0.0, 0.32 * (1 - (t - 0.5) / 0.2))
    md.line([(0, y), (w, y)], fill=int(255 * a))
# only where the picture is bright (sky), so the coop timber keeps its colour
lum = im.convert('L').point(lambda v: 255 if v > 150 else int(v * 1.2) if v > 110 else 0).filter(ImageFilter.GaussianBlur(6))
from PIL import ImageChops
mask = ImageChops.multiply(mask, lum)
im = Image.composite(Image.blend(im, glow, 0.85), im, mask)
im.save(os.path.join(A, 'still-coop.jpg'), quality=92)

# Raymond's truck window
tr = Image.open(os.path.join(A, 'src-truck.jpg')).convert('RGB')
tr = tr.crop((900, 0, 2600, 1388)).resize((640, 523), Image.LANCZOS)
tr = ImageEnhance.Brightness(tr).enhance(1.06)
tr.save(os.path.join(A, 'still-truck.jpg'), quality=92)

# soft edge wear for the board (low detail, big gentle falloff)
S = 960
wear = Image.new('RGBA', (S, S), (0, 0, 0, 0))
m = Image.new('L', (S, S), 0)
dm = ImageDraw.Draw(m)
for i in range(60):
    a = int(70 * (1 - i / 60) ** 2)
    dm.rectangle([i, i, S - 1 - i, S - 1 - i], outline=a)
m = m.filter(ImageFilter.GaussianBlur(10))
wear.putalpha(m)
wear = Image.composite(Image.new('RGBA', (S, S), (20, 30, 24, 255)), Image.new('RGBA', (S, S), (0, 0, 0, 0)), m)
wear.save(os.path.join(A, 'wear-board.png'))
print('ok')
