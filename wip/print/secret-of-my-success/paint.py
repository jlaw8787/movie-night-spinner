"""Painted assets for the Pemrose memo (The Secret of My Success, 1987).
The memo is a second-generation office photocopy on white bond, so the wear layers carry copier
faults: a grey shadow down the left edge where the original lifted off the glass, a lost bottom
corner, a faint drum streak, scattered toner specks and uneven, slightly washed blacks.
Things added after copying stay crisp: a real staple, a red mailroom RECEIVED stamp, blue ballpoint.
Everything is painted at 2x (1632 x 2112) and shown at 816 x 1056."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageChops
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
F = os.path.join(D, 'paintfonts')
S = 2
W, H = 816, 1056
w, h = W * S, H * S
yy, xx = np.mgrid[0:h, 0:w].astype(np.float32) / S

def lowfreq(cells, seed, ww=w, hh=h):
    r = np.random.default_rng(seed)
    g = r.standard_normal((cells, int(cells * ww / hh) + 2)).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((ww, hh), Image.BICUBIC))

STAPLE_AT = (46, 42)          # 1x position of the staple crown centre, top left corner
STAPLE_ANG = -32              # degrees

def wear(face, seed):
    """Dark copier faults, sits above the type."""
    rgba = np.zeros((h, w, 4), np.float32)
    rgba[..., :3] = (58, 58, 56)
    # very light grey cast, uneven (copier exposure)
    mott = lowfreq(5, seed) * 0.6 + lowfreq(11, seed + 1) * 0.4
    a = np.clip(5 + mott * 5, 0, 12)
    # left edge: original lifted off the platen, a soft grey band with a wavy inner edge
    wob = lowfreq(9, seed + 2) * 5
    band = np.clip(10 + wob + (yy / H) * 6, 4, 24)
    left = np.clip(1 - (xx - 0) / np.maximum(band, 2), 0, 1) ** 1.3 * 120
    left += np.clip(1 - xx / (band * 2.6), 0, 1) ** 2 * 40
    # top edge: thinner shadow
    top = np.clip(1 - yy / np.clip(5 + lowfreq(7, seed + 3) * 1.5, 3, 8), 0, 1) ** 1.5 * 70
    # lost corner at bottom right, a wedge where the sheet sat crooked on the glass
    cx = (W - xx) + (H - yy)
    corner = np.clip(1 - cx / np.clip(46 + lowfreq(6, seed + 4) * 6, 36, 58), 0, 1)
    corner = np.where(corner > 0, 0.55 + 0.45 * corner, 0) * 175
    # faint drum streak
    sx = 594 if face == 'front' else 588
    streak = np.exp(-((xx - sx - np.sin(yy / 140) * 1.5) ** 2) / 0.9) * (6 + np.clip(lowfreq(14, seed + 5), -1, 1) * 4)
    rgba[..., 3] = np.clip(a + left + top + corner + streak, 0, 255)
    im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')

    # toner specks: small, soft, mostly clustered toward the left edge and the bottom
    sp = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(sp)
    r = np.random.default_rng(seed + 9)
    n = 0
    while n < 150:
        x, y = r.uniform(0, W), r.uniform(0, H)
        bias = 0.25 + 0.75 * max(math.exp(-x / 120), math.exp(-(H - y) / 160), 0.15)
        if r.uniform() > bias: continue
        rad = r.uniform(0.35, 1.0) * S
        al = int(r.uniform(70, 170))
        d.ellipse([x * S - rad, y * S - rad * r.uniform(0.6, 1.1), x * S + rad, y * S + rad], fill=(40, 40, 38, al))
        n += 1
    sp = sp.filter(ImageFilter.GaussianBlur(0.6))
    im = Image.alpha_composite(im, sp)

    st = Image.new('RGBA', (w, h), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    if face == 'back':
        # page 2 sits under the staple: two punctures with a small pressed dimple between them
        cx0, cy0 = STAPLE_AT
        ang = math.radians(STAPLE_ANG)
        for s in (-1, 1):
            px, py = cx0 + s * 24 * math.cos(ang), cy0 + s * 24 * math.sin(ang)
            sd.ellipse([((px - 1.6) * S, (py - 1.6) * S), ((px + 1.6) * S, (py + 1.6) * S)], fill=(30, 30, 30, 210))
            sd.ellipse([((px - 4) * S, (py - 4) * S), ((px + 4) * S, (py + 4) * S)], outline=(90, 90, 86, 60), width=2)
        # a coffee ring from the cafeteria cup, mostly off the page at lower right
        ring = Image.new('RGBA', (w, h), (0, 0, 0, 0)); rd = ImageDraw.Draw(ring)
        rd.ellipse([(668 * S, 954 * S), (842 * S, 1128 * S)], outline=(150, 112, 70, 70), width=5)
        rd.ellipse([(672 * S, 958 * S), (838 * S, 1124 * S)], outline=(150, 112, 70, 25), width=12)
        ring = ring.filter(ImageFilter.GaussianBlur(2.2))
        st = Image.alpha_composite(st, ring)
    else:
        # grey thumb print where the mail cart handled page 1, right margin, low
        sd.ellipse([(778 * S, 690 * S), (836 * S, 780 * S)], fill=(70, 70, 66, 26))
        st = st.filter(ImageFilter.GaussianBlur(10 * S))
    im = Image.alpha_composite(im, st)
    im.save(os.path.join(A, f'wear-{face}.png'), optimize=True)

def fade(face, seed):
    """White wash above the type: blacks go slightly grey and uneven, like a tired copier."""
    m = lowfreq(7, seed) * 0.55 + lowfreq(18, seed + 1) * 0.3 + lowfreq(40, seed + 2) * 0.15
    a = np.clip(18 + m * 26, 0, 46)
    # a lighter vertical band where the toner ran thin
    bx = 470 if face == 'front' else 300
    a += np.exp(-((xx - bx) ** 2) / (2 * 60 ** 2)) * 16
    rgba = np.zeros((h, w, 4), np.uint8)
    rgba[..., :3] = 250
    rgba[..., 3] = np.clip(a, 0, 70).astype(np.uint8)
    Image.fromarray(rgba, 'RGBA').save(os.path.join(A, f'wear-fade-{face}.png'), optimize=True)

def staple():
    """A real chisel-point staple seen from the front: a short steel crown with rounded
    shoulders, a highlight, a dark underside and a soft cast shadow, both legs into the paper."""
    cw, ch = 80 * S, 56 * S
    im = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    cx, cy = cw / 2, ch / 2
    ang = math.radians(STAPLE_ANG)
    ux, uy = math.cos(ang), math.sin(ang)
    nx, ny = -uy, ux
    L = 24 * S
    def P(t, o=0.0): return (cx + ux * t + nx * o, cy + uy * t + ny * o)
    # dimples and holes
    d = ImageDraw.Draw(im)
    for s in (-1, 1):
        x, y = P(s * L)
        d.ellipse([x - 3.5 * S, y - 3.5 * S, x + 3.5 * S, y + 3.5 * S], fill=(120, 120, 116, 50))
    # shadow
    sh = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); sd = ImageDraw.Draw(sh)
    sd.line([P(-L + 1 * S, 1.6 * S), P(L - 1 * S, 1.6 * S)], fill=(20, 20, 20, 120), width=int(4.2 * S))
    sh = sh.filter(ImageFilter.GaussianBlur(1.6 * S))
    im = Image.alpha_composite(im, sh); d = ImageDraw.Draw(im)
    # legs: short dark stubs at each end going into the paper
    for s in (-1, 1):
        x, y = P(s * L)
        d.ellipse([x - 2.1 * S, y - 2.1 * S, x + 2.1 * S, y + 2.1 * S], fill=(48, 50, 54, 255))
    # crown: layered strokes, dark edge, steel body, bright highlight
    d.line([P(-L, 0), P(L, 0)], fill=(70, 72, 78, 255), width=int(4 * S))
    d.line([P(-L + 0.8 * S, -0.3 * S), P(L - 0.8 * S, -0.3 * S)], fill=(150, 153, 160, 255), width=int(2.8 * S))
    d.line([P(-L + 3 * S, -0.8 * S), P(L - 6 * S, -0.8 * S)], fill=(226, 228, 232, 255), width=int(1.1 * S))
    d.line([P(-L + 1 * S, 0.9 * S), P(L - 1 * S, 0.9 * S)], fill=(92, 94, 100, 200), width=int(0.8 * S))
    im = im.filter(ImageFilter.GaussianBlur(0.35))
    im.save(os.path.join(A, 'staple.png'), optimize=True)

def stamp():
    """Red rubber RECEIVED stamp from the mailroom: double rule box, condensed gothic,
    the ink heavy on one side, a few dry voids, slightly rotated."""
    sw, sh = 236 * S, 118 * S
    im = Image.new('L', (sw, sh), 0); d = ImageDraw.Draw(im)
    pad = 6 * S
    d.rounded_rectangle([pad, pad, sw - pad, sh - pad], radius=5 * S, outline=255, width=int(3.2 * S))
    d.rounded_rectangle([pad + 6 * S, pad + 6 * S, sw - pad - 6 * S, sh - pad - 6 * S], radius=3 * S, outline=255, width=int(1.2 * S))
    f1 = ImageFont.truetype(os.path.join(F, 'Oswald.ttf'), 17 * S)
    f2 = ImageFont.truetype(os.path.join(F, 'Oswald.ttf'), 36 * S)
    f3 = ImageFont.truetype(os.path.join(F, 'Oswald.ttf'), 15 * S)
    def ctext(y, t, f, sp):
        chars = list(t)
        widths = [d.textlength(c, font=f) for c in chars]
        tot = sum(widths) + sp * (len(chars) - 1)
        x = (sw - tot) / 2
        for c, cw in zip(chars, widths):
            d.text((x, y), c, font=f, fill=255); x += cw + sp
    ctext(16 * S, 'RECEIVED', f1, 6 * S)
    ctext(34 * S, 'MAR 3  1987', f2, 2 * S)
    ctext(84 * S, 'MAILROOM', f3, 7 * S)
    a = np.asarray(im).astype(np.float32) / 255
    # uneven ink: heavier on the left, mottled, a few voids
    gx = np.linspace(1.0, 0.72, sw)[None, :]
    m = lowfreq(6, 77, sw, sh) * 0.12 + lowfreq(30, 78, sw, sh) * 0.10
    voids = (lowfreq(55, 79, sw, sh) > 1.55).astype(np.float32) * 0.6
    a = a * np.clip(gx + m - voids, 0.25, 1.0)
    a = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32)
    out = np.zeros((sh, sw, 4), np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = 184, 36, 40
    out[..., 3] = np.clip(a * 0.86, 0, 255).astype(np.uint8)
    o = Image.fromarray(out, 'RGBA').rotate(5, resample=Image.BICUBIC, expand=True)
    o.save(os.path.join(A, 'stamp-received.png'), optimize=True)

PEN = (32, 52, 140)
def pen_stroke(d, pts, wid, alpha=230):
    for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
        steps = int(max(abs(x1 - x0), abs(y1 - y0)) / 0.6) + 1
        for i in range(steps + 1):
            t = i / steps
            x, y = x0 + (x1 - x0) * t, y0 + (y1 - y0) * t
            r = wid / 2 * (0.85 + 0.25 * math.sin(i * 0.7))
            d.ellipse([x - r, y - r, x + r, y + r], fill=PEN + (alpha,))

def ticks():
    """Blue ballpoint ticks for the distribution list, four slightly different hands."""
    r = np.random.default_rng(5)
    for i in range(4):
        im = Image.new('RGBA', (30 * S, 28 * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        j = lambda v: v + r.uniform(-1.4, 1.4)
        pts = [(j(4), j(14)), (j(9), j(20)), (j(11.5), j(24)), (j(17), j(13)), (j(26), j(3))]
        pen_stroke(d, [(x * S, y * S) for x, y in pts], 1.7 * S)
        im.filter(ImageFilter.GaussianBlur(0.4)).save(os.path.join(A, f'pen-tick-{i}.png'), optimize=True)
    # initials, the mailroom runner signing for each copy
    f = ImageFont.truetype(os.path.join(F, 'ReenieBeanie.ttf'), 30 * S)
    for i in range(3):
        im = Image.new('RGBA', (48 * S, 34 * S), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
        d.text((3 * S, 0), 'BF', font=f, fill=PEN + (235,))
        im = im.rotate(r.uniform(-8, 4), resample=Image.BICUBIC)
        im.filter(ImageFilter.GaussianBlur(0.3)).save(os.path.join(A, f'pen-initials-{i}.png'), optimize=True)

wear('front', 11); wear('back', 23)
fade('front', 31); fade('back', 41)
staple(); stamp(); ticks()
print('paint done')
