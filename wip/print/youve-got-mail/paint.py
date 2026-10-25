"""Paints the print finish for the Fox & Sons Books cafe card.
Card stock grain, edge wear, a coffee ring for the back, the cafe cup mark,
and the storefront photo prepared at print resolution. All in CSS px x S."""
import numpy as np, os, math, random
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 3                      # 3x CSS px, about 288 dpi
W, H = 528, 816            # 5.5 x 8.5 in at 96 dpi
B = 11.34                  # 3 mm bleed
GW, GH = int((W + 2 * B) * S), int((H + 2 * B) * S)

def noise(h, w, octaves, base, seed):
    r = np.random.default_rng(seed); out = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        g = r.standard_normal((n + 1, int(n * w / h) + 1)).astype(np.float32)
        out += amp * np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC)); tot += amp; amp *= 0.5
    return out / tot

def grain(seed, name):
    """Uncoated card stock: soft mottling, short fibres, a little edge handling."""
    rng = np.random.default_rng(seed)
    mott = noise(GH, GW, 5, 4, seed)
    a = np.clip(0.5 + mott * 0.9, 0, 1) * 26                       # mottling alpha
    fine = rng.standard_normal((GH, GW)) * 7
    a = np.clip(a + fine, 0, 60)
    # edge handling: a warm darkening that only lives in the last few mm
    yy, xx = np.mgrid[0:GH, 0:GW] / S
    d = np.minimum.reduce([xx, yy, (GW / S) - xx, (GH / S) - yy]) - B   # distance in from trim
    edge = np.clip(1 - d / 22, 0, 1) ** 2 * (0.6 + 0.4 * np.clip(noise(GH, GW, 4, 6, seed + 3) + 0.5, 0, 1))
    a = a + edge * 70
    rgb = np.zeros((GH, GW, 3)); rgb[:] = (150, 118, 72)
    im = Image.fromarray(np.dstack([rgb, a]).clip(0, 255).astype(np.uint8), 'RGBA')
    dr = ImageDraw.Draw(im)
    r = random.Random(seed)
    for _ in range(1400):                                              # paper fibres
        x, y = r.uniform(0, GW), r.uniform(0, GH); L = r.uniform(4, 16) * S / 3; ang = r.uniform(0, math.pi)
        dr.line([(x, y), (x + L * math.cos(ang), y + L * math.sin(ang))], fill=(120, 96, 60, r.randint(14, 34)), width=1)
    im.save(os.path.join(A, name))

def coffee_ring():
    """One cup ring, set down once and lifted a little off true, on the back's top right."""
    w, h = int(240 * S), int(240 * S)
    yy, xx = np.mgrid[0:h, 0:w] / S
    cx, cy, R = 120, 120, 54
    ang = np.arctan2(yy - cy, xx - cx)
    wob = 1.6 * np.sin(ang * 3 + 0.7) + 0.9 * np.sin(ang * 7)
    r = np.hypot(xx - cx, yy - cy) - (R + wob)
    rim = np.exp(-(r / 1.3) ** 2) * (0.55 + 0.45 * np.clip(np.sin(ang * 1.3 + 2.1) + 0.4, 0, 1))
    inner = np.where(r < 0, np.exp(r / 16) * 0.10, 0)
    # a second, fainter ring where the cup was nudged
    r2 = np.hypot(xx - cx - 6, yy - cy - 4) - (R + 1)
    rim2 = np.exp(-(r2 / 1.0) ** 2) * 0.22 * np.clip(np.cos(ang - 0.6), 0, 1)
    a = (rim + inner + rim2) * (0.75 + 0.25 * noise(h, w, 4, 5, 41))
    a = ndimage.gaussian_filter(a, 0.6 * S)
    rgb = np.zeros((h, w, 3)); rgb[:] = (120, 74, 34)
    Image.fromarray(np.dstack([rgb, np.clip(a * 210, 0, 255)]).astype(np.uint8), 'RGBA').save(os.path.join(A, 'coffee-ring.png'))

def cup():
    """The cafe mark: a cup and saucer, burgundy, the way the store's banners show it."""
    s = 8; w, h = 64 * s, 52 * s
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0)); dr = ImageDraw.Draw(im)
    c = (122, 31, 43, 255)
    dr.rounded_rectangle([12 * s, 14 * s, 44 * s, 40 * s], radius=9 * s, fill=c)            # cup body
    dr.rectangle([12 * s, 14 * s, 44 * s, 24 * s], fill=c)
    dr.ellipse([38 * s, 18 * s, 54 * s, 34 * s], outline=c, width=4 * s)                   # handle
    dr.rounded_rectangle([4 * s, 41 * s, 56 * s, 46 * s], radius=3 * s, fill=c)             # saucer
    for i, x in enumerate((20, 28, 36)):                                                     # steam
        pts = [(x * s + 3 * s * math.sin(t / 3 + i), (12 - t * 0.9) * s) for t in range(0, 11)]
        dr.line(pts, fill=c, width=int(2.4 * s), joint='curve')
    im.resize((w // 2, h // 2), Image.LANCZOS).save(os.path.join(A, 'cup.png'))

def storefront():
    """The new store's facade, cropped above street level, enlarged for print."""
    im = Image.open(os.path.join(A, 'still12.jpg')).convert('RGB')
    im = im.crop((96, 0, 1010, 384))
    im = im.resize((int(448 * S), int(448 * S * 384 / 914)), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(0.92)
    im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=50, threshold=2))
    # a light offset-litho dot of warmth so it sits on the stock rather than on a screen
    arr = np.asarray(im).astype(float)
    arr = arr * 0.94 + np.array([246, 238, 222]) * 0.06
    Image.fromarray(arr.clip(0, 255).astype(np.uint8)).save(os.path.join(A, 'storefront.jpg'), quality=92)

import sys
only = sys.argv[1:] or ['grain', 'ring', 'cup', 'photo']
if 'grain' in only: grain(5, 'grain-front.png'); grain(9, 'grain-back.png')
if 'ring' in only: coffee_ring()
if 'cup' in only: cup()
if 'photo' in only: storefront()
print('painted', GW, GH)
