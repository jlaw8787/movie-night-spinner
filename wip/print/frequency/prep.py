"""Crops the two TMDB stills to their frames and lifts exposure a touch. No painted art on this menu."""
import os
from PIL import Image, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')


def crop(src, dst, w, h, fx=0.5, fy=0.5, bright=1.08, sat=1.04):
    im = Image.open(os.path.join(A, src)).convert('RGB')
    W, H = im.size
    r = w / h
    if W / H > r:
        nw = int(H * r); x = int((W - nw) * fx); im = im.crop((x, 0, x + nw, H))
    else:
        nh = int(W / r); y = int((H - nh) * fy); im = im.crop((0, y, W, y + nh))
    im = im.resize((w * 2, h * 2), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(bright)
    im = ImageEnhance.Color(im).enhance(sat)
    im.save(os.path.join(A, dst), quality=90)


crop('still-batting.jpg', 'hero-batting.jpg', 692, 272, fx=0.5, fy=0.3, bright=1.12)
crop('still-radio.jpg', 'spot-radio.jpg', 272, 202, fx=0.62, fy=0.4, bright=1.06)
print('prepped')
