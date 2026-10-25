"""Lettering-guide heads for the ditto master (a Leroy-style template and a stylus: single-stroke,
even-weight gothic capitals, each letter set by hand so the baseline and spacing drift a little).
Writes assets/letter-*.png at 2x and letters.json with each piece's css size."""
import os, json, re
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
from skimage.morphology import skeletonize, disk, dilation

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
INK = (75, 54, 160)
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSansCondensed-Bold.ttf'


def field(seed, scale, blur, w, h):
    rng = np.random.default_rng(seed)
    small = rng.random((h // scale + 2, w // scale + 2)).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(np.float32) / 255
    return (a - a.min()) / (a.max() - a.min() + 1e-6)


def letter(key, text, cap, seed=1, track=.075, weight=.12):
    """cap = css cap height in px. Painted at 2x, worked at 8x."""
    S = 8
    capS = cap * S
    f = ImageFont.truetype(FONT, int(capS / .73))
    rng = np.random.default_rng(seed)
    pad = int(capS * .45)
    # lay out letter by letter with hand drift
    x = pad; glyphs = []
    for ch in text:
        if ch == ' ':
            x += int(capS * .42); continue
        bb = f.getbbox(ch)
        gw = bb[2] - bb[0]
        dy = rng.normal(0, capS * .022)
        glyphs.append((ch, x - bb[0], dy))
        x += gw + int(capS * track * (1 + rng.normal(0, .18)))
    w = x + pad; h = int(capS + 2 * pad)
    m = Image.new('L', (w, h), 0); d = ImageDraw.Draw(m)
    top = f.getbbox('H')[1]
    for ch, gx, dy in glyphs:
        d.text((gx, pad - top + dy), ch, font=f, fill=255)
    sk = skeletonize(np.asarray(m) > 127)
    r = max(2, int(capS * weight / 2))
    stroke = dilation(sk, disk(r)) > 0
    im = Image.fromarray((stroke * 255).astype(np.uint8))
    W2, H2 = int(round(w / S * 2)), int(round(h / S * 2))
    im = im.resize((W2, H2), Image.LANCZOS).filter(ImageFilter.GaussianBlur(.8))
    a = np.asarray(im).astype(np.float32) / 255
    halo = np.asarray(im.filter(ImageFilter.GaussianBlur(3.5))).astype(np.float32) / 255
    dens = 0.62 + 0.38 * field(seed + 50, 22, 6, W2, H2)
    a = np.clip(np.clip(a * 1.3, 0, 1) * dens + halo * .16, 0, 1)
    out = np.zeros((H2, W2, 4), np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = INK
    out[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, f'letter-{key}.png'))
    return {"w": W2 / 2, "h": H2 / 2, "pad": pad / S, "alt": text}


PIECES = [
  ("deli", "FROM THE DELI", 22), ('bakery', 'BAKERY', 22), ('also', 'ALSO AT THE DELI', 15),
  ('daytour', 'DAY TOUR', 22), ('tokyo', 'TOKYO SUBWAY VISITORS TODAY. JACKETS ON.', 17),
  ('hero', 'TURKEY & SWISS HERO', 19), ('soup', 'CHICKEN SOUP', 19), ('eggcream', 'EGG CREAM', 19),
  ('coffee', 'COFFEE', 19), ('danish', 'DANISH', 18), ('jelly', 'JELLY DOUGHNUTS', 16),
  ('rugelach', 'RUGELACH', 18), ('toddy', 'AFTER THE TOUR: HOT TODDY', 20),
  ('flu', 'FLU GOING ROUND. EVEN THE MAYOR.', 14), ('friday', 'FRIDAY PASTRY RUN', 16),
  ('name', 'NAME', 13), ('want', 'WHAT YOU WANT', 13), ('total', 'TOTAL', 14),
]
out = {}
for i, (k, t, c) in enumerate(PIECES):
    out[k] = letter(k, t, c, seed=i + 3)
json.dump(out, open(os.path.join(D, 'letters.json'), 'w'), indent=1)
print('lettered', len(out))
