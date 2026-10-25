"""Paints the assets for the Kessler & Lowe caterer's price folder, spring 1979.
Offset printed in two inks (black and a cool grey) on felt finish white cover stock, US Letter folded once.
All images are painted at 2x (1 css px = 2 image px).

bridge-halftone.png : the dawn still at the Queensboro Bridge, cropped to the lamp, sign, railing and empty
                      bench end, printed as a two-ink duotone: a grey plate at 45 deg and a black plate at
                      75 deg, about 65 lines to the inch, with dot gain and the grey plate 1.5 px out of register.
tint-grey.png       : a 25 percent screen tint in the grey ink, for the ruled boxes.
paper-stock-<face>.png : felt finish cover stock, soft mottle, toned edges and the fold (under the art).
wear-ink-<face>.png : ink starvation, big soft patches of paper colour over everything (only shows on ink).
wear-<face>.png     : handling wear on top, the fold crease, a corner bump and, outside, a faint glass ring.
"""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
W, H, S = 1056, 816, 2
PAPER = np.array([241, 240, 235], float)
BLACK = np.array([24, 25, 29], float)
GREY = np.array([138, 141, 146], float)


def lowfreq(w, h, n, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((n, int(n * w / h) + 1)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))


def screen(tone, lpi_px, angle, gain=0.10, sharp=1.6):
    """tone 0..1 (1 = full ink). Returns ink coverage 0..1 from a round dot screen."""
    h, w = tone.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = np.deg2rad(angle)
    u = (xx * np.cos(a) + yy * np.sin(a)) / lpi_px
    v = (-xx * np.sin(a) + yy * np.cos(a)) / lpi_px
    fu, fv = u - np.floor(u) - 0.5, v - np.floor(v) - 0.5
    d = np.sqrt(fu ** 2 + fv ** 2)                      # 0 at cell centre, ~0.707 at the corner
    t = np.clip(tone + gain * tone * (1 - tone) * 2, 0, 1)
    r = np.sqrt(t / np.pi)                              # dot radius for that coverage
    r = np.where(t > 0.75, 0.5 + (t - 0.75) * 0.9, r)   # dots join into a checker past 75 percent
    cov = np.clip((r - d) * lpi_px * sharp + 0.5, 0, 1)
    return cov


def put(arr_rgb, cov, ink):
    """multiply an ink layer over what is there (inks are transparent)."""
    f = 1 - cov[..., None] * (1 - ink / 255.0)
    return arr_rgb * f


# 1. cover halftone ------------------------------------------------------------
pw, ph = 528 * S, 528 * S
src = Image.open(os.path.join(A, 'bridge_orig.jpg')).convert('L')
crop = src.crop((0, 0, 1236, 1236)).filter(ImageFilter.GaussianBlur(1.2))
crop = crop.resize((pw, ph), Image.LANCZOS)
g = np.asarray(crop, float) / 255
lo, hi = np.percentile(g, 1), np.percentile(g, 99.3)
g = np.clip((g - lo) / (hi - lo), 0, 1)
dark = 1 - g                                           # ink amount wanted
grey_tone = np.clip(dark * 0.95 + 0.06, 0, 1)          # grey plate carries the mid tones and the haze
black_tone = np.clip((dark - 0.32) / 0.68, 0, 1) ** 1.25  # black plate only in the shadows
cell = 192 / 65                                         # 65 lpi at 192 px per inch
gc = screen(grey_tone, cell, 45, gain=0.16)
bc = screen(black_tone, cell, 75, gain=0.18)
# grey plate 1.5 px right and 1 px down of the black
gc = np.roll(np.roll(gc, 3, axis=1), 2, axis=0)
# uneven ink on the press: soft density drift across the sheet
drift_g = np.clip(1 + lowfreq(pw, ph, 5, 7) * 0.06, 0.85, 1.1)
drift_b = np.clip(1 + lowfreq(pw, ph, 6, 8) * 0.05, 0.88, 1.1)
rgb = np.ones((ph, pw, 3)) * PAPER
rgb = put(rgb, np.clip(gc * drift_g, 0, 1), GREY)
rgb = put(rgb, np.clip(bc * drift_b, 0, 1), BLACK)
im = Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), 'RGB').filter(ImageFilter.GaussianBlur(0.45))
im.save(os.path.join(A, 'bridge-halftone.png'), optimize=True)

# 2. grey screen tint -----------------------------------------------------------
tw, th = 528 * S, 816 * S
tc = screen(np.full((th, tw), 0.26, np.float32), 192 / 85, 45, gain=0.12)
tc = tc * np.clip(1 + lowfreq(tw, th, 6, 31) * 0.10, 0.8, 1.15)
rgba = np.zeros((th, tw, 4))
rgba[..., :3] = GREY
rgba[..., 3] = np.clip(tc, 0, 1) * 255
Image.fromarray(rgba.astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(0.4)).save(
    os.path.join(A, 'tint-grey.png'), optimize=True)

# 3. stock, ink wear and handling wear -------------------------------------------
w, h = W * S, H * S
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32) / S


def stock(face, seed):
    rgba = np.zeros((h, w, 4))
    # felt finish: soft mid scale mottle, faintly darker in a woven direction
    felt = lowfreq(w, h, 60, seed) * 0.5 + lowfreq(w, h, 140, seed + 1) * 0.35 + lowfreq(w, h, 9, seed + 2) * 0.5
    rgba[..., :3] = [120, 118, 110]
    rgba[..., 3] = np.clip(felt * 3 + 4, 0, 9)
    im = Image.fromarray(rgba.astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(1.2))
    im.save(os.path.join(A, f'paper-stock-{face}.png'), optimize=True)


def inkwear(face, seed):
    # patches where the ink ran thin, paper coloured, only visible over ink
    m = lowfreq(w, h, 70, seed) * 0.5 + lowfreq(w, h, 24, seed + 1) * 0.5
    a = np.clip(m * 9 + 7, 0, 20)
    # a pale roller band across the sheet, very slight
    band = np.exp(-((yy - (300 if face == 'outside' else 520)) / 60) ** 2) * 8
    a = np.clip(a + band, 0, 26)
    rgba = np.zeros((h, w, 4))
    rgba[..., :3] = PAPER
    rgba[..., 3] = a
    Image.fromarray(rgba.astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(3)).save(
        os.path.join(A, f'wear-ink-{face}.png'), optimize=True)


def wear(face, seed):
    rgba = np.zeros((h, w, 4))
    m = lowfreq(w, h, 7, seed) * 0.65 + lowfreq(w, h, 16, seed + 1) * 0.35
    rgba[..., :3] = [140, 134, 118]
    rgba[..., 3] = np.clip(m * 3 + 3, 0, 7)
    e = np.minimum.reduce([xx, yy, W - xx, H - yy])
    wob = lowfreq(w, h, 9, seed + 2) * 6
    edge = np.clip(1 - (e + wob) / 30, 0, 1) ** 1.8 * 52
    rgba[..., 3] += edge
    # one bumped corner (bottom right outside, bottom left inside: the same corner of the sheet)
    cx, cy = (W, H) if face == 'outside' else (0, H)
    cb = np.clip(1 - np.hypot(xx - cx, yy - cy) / 46, 0, 1) ** 1.5 * 40
    rgba[..., 3] += cb
    d = xx - W / 2
    if face == 'outside':
        shade = np.exp(-((d + 2.2) / 1.4) ** 2) * 40 + np.exp(-((d - 3) / 7) ** 2) * 12
        light = np.exp(-((d - 0.4) / 0.9) ** 2) * 80
    else:
        shade = np.exp(-(d / 1.2) ** 2) * 36 + np.exp(-(d / 10) ** 2) * 16
        light = np.exp(-((d - 2.6) / 1.1) ** 2) * 44
    along = 0.75 + 0.25 * np.clip(lowfreq(w, h, 5, seed + 3), -1, 1)
    shade, light = shade * along, light * along
    tot = rgba[..., 3] + shade + light
    col = (rgba[..., :3] * rgba[..., 3:4] + np.array([84, 82, 78]) * shade[..., None]
           + np.array([255, 255, 253]) * light[..., None]) / np.maximum(tot, 1)[..., None]
    rgba[..., :3] = col
    rgba[..., 3] = np.clip(tot, 0, 255)
    im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
    st = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(st)
    if face == 'outside':
        # a faint ring from a cocktail glass set down on the back panel
        cx, cy, r = 400, 640, 37
        for k, al in ((0, 26), (2, 14), (-2, 10)):
            sd.ellipse([((cx - r - k) * S, (cy - r - k) * S), ((cx + r + k) * S, (cy + r + k) * S)],
                       outline=(150, 128, 92, al), width=2 * S)
        ring = st.filter(ImageFilter.GaussianBlur(1.3 * S))
        # break the ring up so it is not a perfect circle
        brk = np.clip(lowfreq(w, h, 40, seed + 9) * 1.4 + 0.6, 0, 1)
        ra = np.asarray(ring).astype(float)
        ra[..., 3] *= brk
        im = Image.alpha_composite(im, Image.fromarray(ra.astype(np.uint8), 'RGBA'))
    else:
        cx, cy = 1012, 600
        sd.ellipse([((cx - 28) * S, (cy - 40) * S), ((cx + 28) * S, (cy + 40) * S)], fill=(170, 150, 105, 18))
        im = Image.alpha_composite(im, st.filter(ImageFilter.GaussianBlur(16 * S)))
    im.save(os.path.join(A, f'wear-{face}.png'), optimize=True)


for face, seed in (('outside', 11), ('inside', 23)):
    stock(face, seed + 100)
    inkwear(face, seed + 200)
    wear(face, seed)
print('painted')
