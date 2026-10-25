"""Prepares the two TMDB stills (crop, soften one bottle label so no brand reads, gentle lift) and the soft edge wear.
Sources: /t/p/original/iSHvcF2DfqoFQky7SMuVAFydwIS.jpg (gentlemen's lounge) and /8q2UGgp8YSQWLrTtU9YJyA1u0Fd.jpg (podium)."""
import os, sys
from PIL import Image, ImageFilter, ImageEnhance, ImageDraw
D = os.path.dirname(os.path.abspath(__file__))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(D, '_old')
A = os.path.join(D, 'assets')

# Hero: the gentlemen's lounge, 704x372 at 2x
im = Image.open(os.path.join(SRC, 'o9.jpg')).convert('RGB')          # 3840x2160
# soften the champagne label (about x 1150 to 1340, y 1360 to 1920)
box = (1140, 1380, 1350, 1930)
patch = im.crop(box).filter(ImageFilter.GaussianBlur(28))
patch = ImageEnhance.Brightness(patch).enhance(0.55)
mask = Image.new('L', patch.size, 0)
ImageDraw.Draw(mask).rounded_rectangle((6, 6, patch.size[0] - 6, patch.size[1] - 6), 40, fill=255)
mask = mask.filter(ImageFilter.GaussianBlur(14))
im.paste(patch, box[:2], mask)
crop = im.crop((1345, 0, 3840, int(2495 * 372 / 704)))   # right of the bottle, above its neck: no label in frame
crop = ImageEnhance.Brightness(crop).enhance(1.10)
crop = ImageEnhance.Contrast(crop).enhance(1.04)
crop.resize((1408, 744), Image.LANCZOS).save(os.path.join(A, 'still-lounge.jpg'), quality=90)

# Back: the Congressman at the podium, 340x190 at 2x
im = Image.open(os.path.join(SRC, 'o13.jpg')).convert('RGB')        # 1920x1080
w = 1500; h = int(w * 190 / 340)
crop = im.crop((420, 60, 420 + w, 60 + h))
crop = ImageEnhance.Brightness(crop).enhance(1.18)
crop.resize((680, 380), Image.LANCZOS).save(os.path.join(A, 'still-podium.jpg'), quality=90)

# Soft edge wear: gentle cool vignette, low detail
W, H = 816 * 2, 1056 * 2
for n, seed in (('front', 0), ('back', 1)):
    m = Image.new('L', (W, H), 0)
    dr = ImageDraw.Draw(m)
    for i in range(60):
        dr.rectangle((i * 2, i * 2, W - 1 - i * 2, H - 1 - i * 2), outline=int(70 * (1 - i / 60) ** 2))
    m = m.filter(ImageFilter.GaussianBlur(30))
    layer = Image.new('RGBA', (W, H), (70, 74, 70, 0))
    layer.putalpha(m)
    layer.save(os.path.join(A, f'wear-{n}.png'))
print('prepped')
