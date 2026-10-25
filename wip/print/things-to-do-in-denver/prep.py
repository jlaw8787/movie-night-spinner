"""Crops the skyline photo and the diner still, paints the soft edge wear. Run once before build.py."""
import os
from PIL import Image, ImageEnhance, ImageFilter, ImageDraw
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
SRC = os.path.join(A, 'src')

# skyline strip, 816x280 at 2x. Source preview was 900 wide, so scale crop coords by W/900
im = Image.open(os.path.join(SRC, 'loc-17837-2400.jpg')).convert('RGB')
W, H = im.size
k = W / 900
box = (0, int(150 * k), W, int(150 * k + W / (816 / 280)))
sky = im.crop(box).resize((1632, 560), Image.LANCZOS)
sky = ImageEnhance.Brightness(sky).enhance(1.08)
sky = ImageEnhance.Contrast(sky).enhance(1.04)
sky = sky.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
# soften the small rooftop company sign on the left building (no readable brand names)
b = (98, 410, 142, 436)
sky.paste(sky.crop(b).filter(ImageFilter.GaussianBlur(6)), b[:2])
sky.save(os.path.join(A, 'skyline.jpg'), quality=90)

# diner counter still, 360x250 at 2x
im = Image.open(os.path.join(SRC, 'hMo3Hp1CFVJNnGcyO2EuXMOhRXz.jpg')).convert('RGB')
W, H = im.size
cw = int(H * 360 / 250)
x0 = int(W * 0.06)
st = im.crop((x0, 0, x0 + cw, H)).resize((720, 500), Image.LANCZOS)
st = ImageEnhance.Brightness(st).enhance(1.12)
st.save(os.path.join(A, 'still-counter.jpg'), quality=90)

# soft edge wear, big gentle falloff only
S = 1632
w = Image.new('L', (S, S), 0)
dr = ImageDraw.Draw(w)
for i in range(60):
    a = int(70 * (1 - i / 60) ** 2.2)
    dr.rectangle((i * 2, i * 2, S - 1 - i * 2, S - 1 - i * 2), outline=a, width=2)
w = w.filter(ImageFilter.GaussianBlur(18))
out = Image.new('RGBA', (S, S), (40, 62, 58, 0))
out.putalpha(w)
out.save(os.path.join(A, 'paper-wear.png'))
print('prepped')
