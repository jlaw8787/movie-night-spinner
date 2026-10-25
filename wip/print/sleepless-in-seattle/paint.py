"""Prepares the two TMDB stills (clean crops, gentle lift) and the soft page wear vignettes."""
import os
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
D = os.path.dirname(os.path.abspath(__file__))
SRC = '/tmp/claude-0/-home-claude/6d06a22c-2024-50a8-a2d1-a12880d59711/scratchpad/sis'
A = os.path.join(D, 'assets')

def crop(src, out, w, h, cx=0.5, cy=0.5, bright=1.0):
    im = Image.open(os.path.join(SRC, src)).convert('RGB')
    W, H = im.size
    r = w / h
    if W / H > r:
        nw = int(H * r); x0 = int((W - nw) * cx); box = (x0, 0, x0 + nw, H)
    else:
        nh = int(W / r); y0 = int((H - nh) * cy); box = (0, y0, W, y0 + nh)
    im = im.crop(box).resize((w * 2, h * 2), Image.LANCZOS)
    im = ImageEnhance.Brightness(im).enhance(bright)
    im = im.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
    im.save(os.path.join(A, out), quality=90)

crop('heart-full.jpg', 'still-heart.jpg', 704, 340, 0.5, 0.5, 1.06)
crop('dinner-full.jpg', 'still-window-table.jpg', 318, 200, 0.5, 0.45, 1.08)

def wear(out, W=816, H=1056, seed=3):
    """Soft aged vignette toward the edges, big gentle mottling, no pixel noise."""
    s = 4
    m = Image.new('L', (W // s, H // s), 0)
    dr = ImageDraw.Draw(m)
    for i in range(26):
        a = int(150 * (1 - i / 26) ** 2.2)
        dr.rectangle([i, i, W // s - 1 - i, H // s - 1 - i], outline=a)
    m = m.filter(ImageFilter.GaussianBlur(9)).resize((W, H), Image.BICUBIC)
    col = Image.new('RGBA', (W, H), (150, 92, 84, 0))
    col.putalpha(m.point(lambda v: int(v * 0.55)))
    col.save(os.path.join(A, out))

wear('wear-front.png')
wear('wear-back.png')
print('painted')
