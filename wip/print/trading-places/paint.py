"""Assets for the Heritage Club bill of fare (Trading Places, 1983). US Letter, painted at 2x.
  still-hall.jpg     : TMDB still of the club's front hall, cropped wide for the front hero
  still-portrait.jpg : the founder's portrait from the same still, for the back
  wear-front/back    : soft aged vignette toward the edges, low-detail mottling, no marks over text
"""
import os
import numpy as np
from PIL import Image, ImageEnhance

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 2
W, H = 816, 1056

src = Image.open(os.path.join(A, 'src-club.jpg')).convert('RGB')


def bright(im, b=1.10, c=1.06, s=1.04):
    im = ImageEnhance.Brightness(im).enhance(b)
    im = ImageEnhance.Contrast(im).enhance(c)
    return ImageEnhance.Color(im).enhance(s)


# hero: 692 x 330 CSS px
hw, hh = 692 * S, 330 * S
cw = 3012; ch = int(cw * hh / hw); top = 20
bright(src.crop((0, top, cw, top + ch)).resize((hw, hh), Image.LANCZOS), 1.14, 1.05).save(
    os.path.join(A, 'still-hall.jpg'), quality=90)

# portrait: 200 x 270 CSS px, from the gilt frame on the wall
pw, ph = 186 * S, 250 * S
box = (992, 146, 992 + 252, 150 + int(282 * ph / pw))
bright(src.crop(box).resize((pw, ph), Image.LANCZOS), 1.22, 1.04, 1.0).save(
    os.path.join(A, 'still-portrait.jpg'), quality=90)


def noise(h, w, base, seed, octaves=3):
    r = np.random.default_rng(seed); out = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        g = r.standard_normal((n + 1, int(n * w / h) + 1)).astype(np.float32)
        out += amp * np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC)); tot += amp; amp *= 0.5
    return out / tot


def wear(name, seed):
    gw, gh = W * S, H * S
    y, x = np.mgrid[0:gh, 0:gw].astype(np.float32)
    dx = np.minimum(x, gw - 1 - x) / gw; dy = np.minimum(y, gh - 1 - y) / gh
    edge = np.clip(1 - np.minimum(dx * 7.5, dy * 9.5), 0, 1) ** 2.4
    mott = noise(gh, gw, 3, seed)
    a = np.clip(edge * 0.30 + (mott * 0.5 + 0.5) * 0.045 * (0.4 + edge), 0, 0.36)
    rgba = np.zeros((gh, gw, 4), np.uint8)
    rgba[..., 0], rgba[..., 1], rgba[..., 2] = 120, 78, 40
    rgba[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(os.path.join(A, name))


wear('wear-front.png', 11)
wear('wear-back.png', 23)
print('painted')
