"""Paper finish for the menu card: cream cover stock grain, warm edge toning from handling,
a faint thumb smudge on the front and a pale red wine ring on the back.
Drawn at bleed size (trim plus 3mm a side) so the same layer serves the trim and printer PDFs."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
B = 11.34
CW, CH = 816 + 2 * B, 1056 + 2 * B
S = 2
w, h = int(round(CW * S)), int(round(CH * S))
rng = np.random.default_rng(37)

def lowfreq(n, seed):
    r = np.random.default_rng(seed); g = r.standard_normal((n, int(n * w / h) + 1)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))

yy, xx = np.mgrid[0:h, 0:w] / S - B     # css px measured from the trim corner

def layer(face):
    rgba = np.zeros((h, w, 4))
    # fibre grain: fine speckle plus a little cloudiness in the stock
    fine = rng.normal(0, 1, (h, w))
    cloud = lowfreq(40, 3 if face == 'front' else 4) * 0.6 + lowfreq(12, 9) * 0.4
    a = np.clip(fine * 7 + cloud * 9 + 6, 0, 26)
    rgba[..., :3] = np.where((fine > 0)[..., None], [255, 252, 240], [150, 120, 80])
    rgba[..., 3] = a
    # edge toning, strongest at the corners, uneven along each edge
    e = np.minimum.reduce([xx, yy, 816 - xx, 1056 - yy])
    wob = lowfreq(10, 21 if face == 'front' else 22) * 8
    edge = np.clip(1 - (e + wob) / 46, 0, 1) ** 1.7 * 70
    tone = np.array([168, 126, 70])
    k = edge / 255
    rgba[..., :3] = rgba[..., :3] * (1 - k[..., None]) + tone * k[..., None]
    rgba[..., 3] = np.clip(rgba[..., 3] + edge, 0, 255)
    im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
    st = Image.new('RGBA', (w, h), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    if face == 'front':
        # a faint thumb smudge low on the right edge, where a waiter holds the card
        cx, cy = 790, 930
        sd.ellipse([((cx - 34 + B) * S, (cy - 48 + B) * S), ((cx + 34 + B) * S, (cy + 48 + B) * S)], fill=(150, 120, 80, 22))
        st = st.filter(ImageFilter.GaussianBlur(14 * S))
    else:
        # a pale ring from a glass of red set down on the card, mostly in the right margin
        cx, cy, r = 738, 948, 44
        for i in range(260):
            t = i / 260 * 2 * np.pi
            if 2.1 < t < 2.9: continue           # the ring breaks where the glass lifted
            rr = r + np.sin(t * 3) * 1.2
            x, y = cx + rr * np.cos(t), cy + rr * np.sin(t)
            al = int(34 + 20 * np.sin(t * 2 + 1))
            sd.ellipse([((x - 2.2 + B) * S, (y - 2.2 + B) * S), ((x + 2.2 + B) * S, (y + 2.2 + B) * S)], fill=(128, 40, 52, al))
        st = st.filter(ImageFilter.GaussianBlur(0.9 * S))
        inner = Image.new('RGBA', (w, h), (0, 0, 0, 0)); idr = ImageDraw.Draw(inner)
        idr.ellipse([((cx - r + B) * S, (cy - r + B) * S), ((cx + r + B) * S, (cy + r + B) * S)], fill=(150, 60, 70, 8))
        st = Image.alpha_composite(inner.filter(ImageFilter.GaussianBlur(3 * S)), st)
    im = Image.alpha_composite(im, st)
    im.save(os.path.join(D, 'assets', f'wear-{face}.png'), optimize=True)

for f in ('front', 'back'):
    layer(f)
print('wear done', w, h)
