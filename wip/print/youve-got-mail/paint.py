"""Paints the print finish for the Fox & Sons Books cafe card (1998, 5.5 x 8.5 in).

The real object is chain collateral: four colour process on gloss coated card.
So the store photo is screened CMYK with dot gain and a hair of misregistration,
the burgundy cover flood gets offset mottle and rubbed edges, the cup on the back
is a line engraving of the kind 1990s coffee bars took from clip art books, and
the whole sheet gets a soft gloss sheen. Everything is painted at S x CSS px."""
import numpy as np, os, math, random, sys
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 3
W, H = 528, 816


def noise(h, w, octaves, base, seed):
    r = np.random.default_rng(seed); out = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        g = r.standard_normal((n + 1, int(n * w / h) + 1)).astype(np.float32)
        out += amp * np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC)); tot += amp; amp *= 0.5
    return out / tot


# ---------------------------------------------------------------- store photo
def screen(ch, angle, cell, gain):
    """AM halftone of one channel (0..1 coverage), round dot, with dot gain."""
    h, w = ch.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle)
    u = (xx * math.cos(a) + yy * math.sin(a)) / cell
    v = (-xx * math.sin(a) + yy * math.cos(a)) / cell
    spot = (np.cos(2 * math.pi * u) + np.cos(2 * math.pi * v)) / 4 + 0.5   # 0..1
    cov = np.clip(ch + gain * ch * (1 - ch) * 4 * 0.5, 0, 1)                 # midtone gain
    # soft threshold keeps dot edges from stair-stepping when the page is scaled
    return np.clip((cov - (1 - spot)) * 3.2 + 0.5, 0, 1)


def storefront():
    bw, bh = 448, 184                      # CSS box
    P = 4                                  # paint finer than the page so dots stay round
    im = Image.open(os.path.join(A, 'still12.jpg')).convert('RGB').crop((40, 0, 1000, 395))
    im = im.resize((bw * P, bh * P), Image.LANCZOS)
    im = ImageEnhance.Contrast(im).enhance(1.06)
    rgb = np.asarray(im).astype(np.float32) / 255
    rgb = np.clip(rgb * np.array([1.03, 1.0, 0.95]), 0, 1)   # warm the north light a little
    k = 1 - rgb.max(axis=2)
    den = np.maximum(1 - k, 1e-4)
    c = (1 - rgb[..., 0] - k) / den; m = (1 - rgb[..., 1] - k) / den; y = (1 - rgb[..., 2] - k) / den
    k = np.clip(k * 1.05 - 0.02, 0, 1)    # gray component replacement, a little lift in the darks
    cell = 4.2                             # about 90 lpi at this paint size
    sc = screen(c * 0.8, 15, cell, 0.16); sm = screen(m, 75, cell, 0.16)
    sy = screen(y, 0, cell, 0.12); sk = screen(k, 45, cell, 0.18)
    # plates a hair out of register: magenta right, yellow up
    sm = np.roll(sm, 2, axis=1); sy = np.roll(sy, -1, axis=0)
    paper = np.array([0.975, 0.962, 0.94])
    inks = {'c': np.array([0.0, 0.62, 0.86]), 'm': np.array([0.86, 0.10, 0.45]),
            'y': np.array([1.0, 0.90, 0.05]), 'k': np.array([0.16, 0.14, 0.14])}
    out = np.ones(rgb.shape) * paper
    for s, kk in ((sy, 'y'), (sc, 'c'), (sm, 'm'), (sk, 'k')):
        out *= 1 - s[..., None] * (1 - inks[kk])
    out = ndimage.gaussian_filter(out, (0.7, 0.7, 0))          # ink spread on coated stock
    img = Image.fromarray((out.clip(0, 1) * 255).astype(np.uint8))
    img = img.resize((bw * S, bh * S), Image.LANCZOS)
    img.save(os.path.join(A, 'storefront-screened.jpg'), quality=93)


# ---------------------------------------------------------------- engraved cup
def engraving():
    """Cup, saucer and three beans as a line engraving. Hatching follows the form,
    weight carries the shade, outlines are cut heavier on the shadow side."""
    w, h = 1320, 900
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    ink = np.zeros((h, w), np.float32)
    rough = noise(h, w, 3, 30, 7) * 0.18

    def hatch(mask, dark, pitch, bow, cx, tilt=0.0):
        """Lines bowed around a cylinder: y' = y - bow*(1-((x-cx)/R)^2)."""
        R = max(1, np.ptp(mask.any(axis=0).nonzero()[0]) / 2)
        t = (xx - cx) / R
        yb = yy - bow * np.sqrt(np.clip(1 - t * t, 0, 1)) + tilt * xx
        ph = np.abs(((yb / pitch) % 1) - 0.5) * 2          # 0 at line centre, 1 between
        width = np.clip(dark + rough, 0, 0.95)
        return mask & (ph < width)

    cx = 560
    # saucer: wide flat ellipse with a rim
    sau = ((xx - cx) / 470) ** 2 + ((yy - 735) / 92) ** 2 <= 1
    well = ((xx - cx) / 300) ** 2 + ((yy - 722) / 52) ** 2 <= 1
    # cup body: a bowl from y 300 to 740, narrowing to the foot
    top, bot = 330, 735
    fr = np.clip((yy - top) / (bot - top), 0, 1)
    half = 300 - 120 * fr ** 2.2
    body = (yy >= top) & (yy <= bot) & (np.abs(xx - cx) <= half)
    rim_e = ((xx - cx) / 300) ** 2 + ((yy - top) / 58) ** 2
    body = (body | (rim_e <= 1))
    mouth = ((xx - cx) / 278) ** 2 + ((yy - top) / 46) ** 2 <= 1
    foam = ((xx - cx) / 262) ** 2 + ((yy - top - 4) / 40) ** 2 <= 1
    # handle: a ring on the right
    hr = np.hypot((xx - 880) / 1.0, (yy - 470) / 1.12)
    handle = (hr >= 72) & (hr <= 118) & (xx > cx + 230)
    # shade: light from the upper left
    tcup = (xx - (cx - 140)) / 440
    dcup = np.clip(0.10 + 0.62 * np.clip(tcup, 0, 1) ** 1.3 + 0.18 * fr, 0, 0.85)
    ink = np.maximum(ink, hatch(body & ~mouth, dcup, 15, 40, cx))
    ink = np.maximum(ink, hatch(handle, np.clip(0.25 + 0.5 * (xx - 800) / 200, 0.2, 0.8), 13, 0, 880, 0.35))
    # coffee inside the mouth, dark, with a stippled foam island
    ink = np.maximum(ink, hatch(mouth & ~foam, np.full_like(xx, 0.78), 9, 0, cx, 0.12))
    rng = np.random.default_rng(3)
    foam_d = np.zeros((h, w), np.float32)
    for _ in range(900):
        x, y = rng.uniform(cx - 260, cx + 260), rng.uniform(top - 40, top + 44)
        if ((x - cx) / 262) ** 2 + ((y - top - 4) / 40) ** 2 <= 0.92:
            r = rng.uniform(2.0, 4.2) * (0.6 + 0.8 * max(0, (x - cx) / 262))
            foam_d[int(y) - 6:int(y) + 7, int(x) - 6:int(x) + 7] = np.maximum(
                foam_d[int(y) - 6:int(y) + 7, int(x) - 6:int(x) + 7],
                (np.hypot(np.arange(-6, 7)[:, None], np.arange(-6, 7)[None, :]) <= r).astype(np.float32))
    ink = np.maximum(ink, foam_d * foam)
    # saucer: bowed hatching, darker under the cup on the right
    tsau = (xx - (cx - 200)) / 650
    dsau = np.clip(0.08 + 0.45 * np.clip(tsau, 0, 1) + 0.25 * ((yy - 700) / 120).clip(0, 1), 0, 0.8)
    ink = np.maximum(ink, hatch(sau & ~body & ~well, dsau, 12, -18, cx))
    ink = np.maximum(ink, hatch(well & ~body, np.clip(dsau + 0.2, 0, 0.85), 10, -10, cx))
    # cast shadow of the cup on the saucer well, cross hatched
    # outlines, cut heavier on the shadow side
    def outline(m, wl, wr):
        e = m & ~ndimage.binary_erosion(m, iterations=int(wl))
        e2 = m & ~ndimage.binary_erosion(m, iterations=int(wr))
        return np.where(xx > cx, e2, e)
    for m, a_, b_ in ((body, 4, 8), (mouth, 3, 4), (sau, 4, 7), (well, 2, 3), (handle, 4, 7)):
        ink = np.maximum(ink, outline(m, a_, b_))
    # three beans to the left on the table
    for (bx, by, ang) in ((1120, 790, 25), (1215, 818, -20), (1150, 848, 75)):
        a = math.radians(ang)
        u = ((xx - bx) * math.cos(a) + (yy - by) * math.sin(a)) / 48
        v = (-(xx - bx) * math.sin(a) + (yy - by) * math.cos(a)) / 32
        bean = u ** 2 + v ** 2 <= 1
        crease = bean & (np.abs(v - 0.25 * np.sin(u * 2.4)) < 0.11)
        shade = hatch(bean, np.clip(0.25 + 0.5 * (u + v + 1) / 2.5, 0, 0.85), 8, 0, bx, math.tan(a + 1.2) * 0.5)
        ink = np.maximum(ink, shade.astype(np.float32))
        ink = np.maximum(ink, (bean & ~ndimage.binary_erosion(bean, iterations=4)).astype(np.float32))
        ink[crease] = 1
    # three wisps of steam, fine single lines
    im = Image.fromarray((ink * 255).astype(np.uint8))
    dr = ImageDraw.Draw(im)
    for i, x0 in enumerate((470, 560, 650)):
        pts = [(x0 + 26 * math.sin(t / 22 + i * 1.7), 250 - t) for t in range(0, 210, 3)]
        dr.line(pts, fill=255, width=5 - (i == 1))
    ink = np.asarray(im).astype(np.float32) / 255
    # press: ink squeezes slightly, then a small loss where the plate was dry
    ink = ndimage.gaussian_filter(ink, 1.0)
    ink = np.clip((ink - 0.35) * 2.4, 0, 1)
    ink *= np.clip(0.88 + noise(h, w, 3, 14, 11) * 0.5, 0.6, 1)
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., :3] = (44, 30, 26)
    rgba[..., 3] = (ink * 255).astype(np.uint8)
    out = Image.fromarray(rgba, 'RGBA').crop((60, 120, 1320, 900))
    out = out.resize((420, int(420 * 780 / 1260)), Image.LANCZOS)   # 3x of 140 css px
    out.save(os.path.join(A, 'engraving-cup.png'))


# ---------------------------------------------------------------- finish
def front_wear():
    """Offset mottle in the burgundy flood and the rubbed white that coated card
    shows along its edges after a few weeks on a cafe counter."""
    gw, gh = W * S, H * S
    mott = noise(gh, gw, 4, 3, 21)
    yy, xx = np.mgrid[0:gh, 0:gw] / S
    d = np.minimum.reduce([xx, yy, W - xx, H - yy])
    nz = noise(gh, gw, 5, 10, 33)
    rub = np.clip((5.5 - d) / 5.5, 0, 1) ** 1.5 * np.clip(nz * 1.6 + 0.55, 0, 1)
    corner = np.zeros_like(d)
    for (cx_, cy_) in ((0, 0), (W, 0), (0, H), (W, H)):
        corner = np.maximum(corner, np.clip(1 - np.hypot(xx - cx_, yy - cy_) / 22, 0, 1) ** 2)
    rub = np.clip(rub + corner * np.clip(nz + 0.7, 0, 1) * 0.8, 0, 1)
    dark = np.clip(mott, 0, None) * 0.10
    light = np.clip(-mott, 0, None) * 0.08 + rub * 0.55
    rgba = np.zeros((gh, gw, 4), np.float32)
    # light where the flood is rubbed or thin, dark where ink pooled
    rgba[..., :3] = np.where((light > dark)[..., None], np.array([250, 244, 232]), np.array([40, 6, 12]))
    rgba[..., 3] = np.maximum(light, dark) * 255
    Image.fromarray(rgba.clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(A, 'wear-front.png'))


def back_wear():
    """The back is mostly white coated stock: only soft handling at the edges
    and a cup that was set down once on the lower corner."""
    gw, gh = W * S, H * S
    yy, xx = np.mgrid[0:gh, 0:gw] / S
    d = np.minimum.reduce([xx, yy, W - xx, H - yy])
    nz = noise(gh, gw, 4, 8, 44)
    edge = np.clip((14 - d) / 14, 0, 1) ** 2 * np.clip(nz + 0.6, 0, 1) * 0.16
    a = edge * 255
    rgba = np.zeros((gh, gw, 4), np.float32); rgba[..., :3] = (120, 96, 70); rgba[..., 3] = a
    Image.fromarray(rgba.clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(A, 'wear-back.png'))
    # cup ring: on gloss stock coffee beads up, so the rim is thin and broken
    rw = 200 * S
    yy, xx = np.mgrid[0:rw, 0:rw] / S
    c0 = 100; R = 46
    ang = np.arctan2(yy - c0, xx - c0)
    r = np.hypot(xx - c0, yy - c0) - (R + 1.2 * np.sin(ang * 3 + 0.4) + 0.6 * np.sin(ang * 8))
    rim = np.exp(-(r / 1.1) ** 2) * np.clip(np.sin(ang * 1.1 + 0.8) * 0.8 + 0.5, 0.05, 1)
    beads = noise(rw, rw, 3, 18, 5)
    rim *= np.clip(beads * 2 + 0.6, 0, 1)
    inner = np.where(r < 0, np.exp(r / 20) * 0.06, 0)
    al = ndimage.gaussian_filter((rim + inner), 0.5 * S) * 150
    rgba = np.zeros((rw, rw, 4), np.float32); rgba[..., :3] = (128, 84, 44); rgba[..., 3] = al
    Image.fromarray(rgba.clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(A, 'stain-ring.png'))


def gloss():
    """Gloss coated sheen: one broad soft highlight across the sheet."""
    gw, gh = W * 2, H * 2
    yy, xx = np.mgrid[0:gh, 0:gw] / 2
    t = (xx * 0.8 + yy * 0.6 - 520) / 120
    a = np.exp(-t ** 2) * 0.07 + np.exp(-((xx * 0.8 + yy * 0.6 - 300) / 40) ** 2) * 0.025
    rgba = np.zeros((gh, gw, 4), np.float32); rgba[..., :3] = 255; rgba[..., 3] = a * 255
    Image.fromarray(rgba.clip(0, 255).astype(np.uint8), 'RGBA').save(os.path.join(A, 'paper-gloss.png'))


only = sys.argv[1:] or ['photo', 'cup', 'wear', 'gloss']
if 'photo' in only: storefront()
if 'cup' in only: engraving()
if 'wear' in only: front_wear(); back_wear()
if 'gloss' in only: gloss()
print('painted')
