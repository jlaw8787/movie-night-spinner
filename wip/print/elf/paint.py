"""Prepares the Elf placemat pictures: the four main food groups as four real photos (Wikimedia Commons, see CREDITS.md),
the fur trim texture for the header band, and the street still crop. Run before build.py."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
GF = os.path.join(D, 'fonts', 'Grandstander-900.ttf')
NF = os.path.join(D, 'fonts', 'Nunito-800.ttf')
GREEN = np.array([24, 96, 56.]); DKGREEN = np.array([14, 58, 34.]); RED = np.array([196, 30, 44.])
SNOW = np.array([252, 250, 244.]); INK = np.array([22, 44, 30.])
rng = np.random.default_rng(2003)


class Canvas:
    """Float RGB canvas with painter-style compositing, gouache mottling and ink outlines."""
    def __init__(s, w, h, bg=None):
        s.w, s.h = w, h
        s.rgb = np.zeros((h, w, 3)); s.a = np.zeros((h, w))
        if bg is not None: s.rgb[:] = bg; s.a[:] = 1
        s.yy, s.xx = np.mgrid[0:h, 0:w].astype(float)

    def put(s, mask, col, outline=6, ink=INK, alpha=1.0):
        m = mask.astype(float) * alpha
        if outline:
            ring = ndimage.binary_dilation(mask, iterations=outline) & ~mask
            s.rgb[ring] = ink; s.a[ring] = 1
        s.rgb = s.rgb * (1 - m[..., None]) + col * m[..., None]
        s.a = np.maximum(s.a, m)

    def image(s, size=None):
        im = Image.fromarray(np.dstack([s.rgb.clip(0, 255), s.a[..., None] * 255]).astype('uint8'), 'RGBA')
        return im.resize(size, Image.LANCZOS) if size else im


def mottle(h, w, scale, amp, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale)))
    big = np.asarray(Image.fromarray((small * 255).astype('uint8')).resize((w, h), Image.BICUBIC), float) / 255
    return (big - 0.5) * 2 * amp


# ------------------------------------------------------------------ the four main food groups, real photos
from PIL import ImageEnhance
CW, CH = 456, 398   # each cell at 2x (228x199 css)
def cell(src, box, out, sat=1.0, bright=1.0):
    im = Image.open(S(src)).convert('RGB').crop(box)
    sw, sh = im.size; r = CW / CH
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    im = im.crop((x, y, x + cw, y + ch)).resize((CW, CH), Image.LANCZOS)
    im = ImageEnhance.Color(im).enhance(sat); im = ImageEnhance.Brightness(im).enhance(bright)
    im.save(A(out), quality=90)
cell('candy-gumdrops.jpg', (0, 80, 1280, 1210), 'fg-candy.jpg')
cv_ = Image.open(S('candy-canes.jpg')).convert('RGB')
bgc = cv_.getpixel((6, 6))
pad = Image.new('RGB', (cv_.width, cv_.height + 110), bgc); pad.paste(cv_, (0, 110)); pad.save(S('candy-canes-padded.jpg'), quality=95)
cell('candy-canes-padded.jpg', (0, 0, 1280, 1308), 'fg-canes.jpg', bright=1.05)
cell('candy-corn.jpg', (300, 200, 2700, 2300), 'fg-corn.jpg')
cell('maple-syrup.jpg', (0, 50, 564, 560), 'fg-syrup.jpg', bright=1.04)

# ------------------------------------------------------------------ fur trim for the header band (1300x44 css)
FW, FH = 2600, 88
fur = np.zeros((FH, FW)); yy, xx = np.mgrid[0:FH, 0:FW].astype(float)
top_e = 18 + 9 * np.sin(xx / 37) + 6 * np.sin(xx / 13 + 1) + mottle(1, FW, 9, 8, 4)[0]
bot_e = 70 + 7 * np.sin(xx / 29 + 2) + 5 * np.sin(xx / 11) + mottle(1, FW, 9, 7, 6)[0]
fur = ((yy > top_e) & (yy < bot_e)).astype(float)
edge = bot_e
tuft = Image.fromarray((fur * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(2))
t = np.asarray(tuft, float) / 255
strands = (rng.random((FH, FW)) < 0.05) & (yy > top_e - 8) & (yy < bot_e + 6)
t = np.maximum(t, strands * 0.9)
tone = 250 + mottle(FH, FW, 6, 10, 8) - np.clip((yy - top_e) / (bot_e - top_e), 0, 1) ** 2 * 40
col = np.dstack([tone, tone, tone - 6])
Image.fromarray(np.dstack([col.clip(0, 255), t * 255]).astype('uint8'), 'RGBA').resize((1300, 44), Image.LANCZOS).save(A('fur-trim.png'))

# ------------------------------------------------------------------ the street still, signs softened
st = Image.open(S('2dsieAsbogrPNpGHwK7fMRMTWd1.jpg')).convert('RGB')
k = 3.0
for b in []:
    bb = tuple(int(v * k) for v in b)
    st.paste(st.crop(bb).filter(ImageFilter.GaussianBlur(18)), bb[:2])
crop = st.crop((int(170 * k), int(28 * k), int(1110 * k), int(28 * k + 940 * k / 2.35)))
crop = crop.resize((940, 400), Image.LANCZOS)
arr = np.asarray(crop, float); arr = 255 * (arr / 255) ** 0.92
Image.fromarray(arr.clip(0, 255).astype('uint8')).save(A('still-seventh-ave.jpg'), quality=90)
print('painted')
