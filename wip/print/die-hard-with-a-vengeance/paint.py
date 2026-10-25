"""Paints clip art and wear for the Chester A. Arthur Elementary lunch calendar
(Die Hard with a Vengeance, 1995). The sheet was laid out on the school office computer
with bold black clip art, then run off on the copier onto pale green paper.
Writes assets/apple.png, elephant.png, jug.png, drumstick.png, wear-front.png, wear-back.png."""
import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
INK = (22, 24, 22)
FW, FH = 816, 1056
rng = np.random.default_rng(1995)
SS = 8  # design in page px, draw at 8x, save at 2x


def canvas(w, h):
    im = Image.new('L', (w * SS, h * SS), 0)  # 0 = no ink
    return im, ImageDraw.Draw(im)


def u(*v):
    return [x * SS for x in v]


def save(im, w, h, name):
    """ink mask -> black RGBA at 2x, with a slightly soft copier edge"""
    m = im.resize((w * 2, h * 2), Image.LANCZOS)
    m = m.point(lambda p: min(255, int(p * 1.08)))
    out = Image.new('RGBA', (w * 2, h * 2), INK + (0,))
    out.putalpha(m)
    out.save(os.path.join(A, name))


def apple(w=120, h=120):
    im, d = canvas(w, h)
    lw = 5 * SS
    # body: two overlapping lobes
    d.ellipse(u(14, 30, 70, 110), fill=255)
    d.ellipse(u(48, 30, 106, 110), fill=255)
    d.ellipse(u(20, 36, 64, 104), fill=0)
    d.ellipse(u(54, 36, 100, 104), fill=0)
    d.rectangle(u(40, 40, 78, 102), fill=0)
    # restore outline across the inner gap
    d.arc(u(14, 30, 70, 110), 90, 250, fill=255, width=lw)
    d.arc(u(48, 30, 106, 110), 290, 90, fill=255, width=lw)
    d.arc(u(40, 22, 80, 44), 20, 160, fill=255, width=lw)
    # shine
    d.arc(u(26, 44, 56, 90), 160, 230, fill=255, width=4 * SS)
    # stem and leaf
    d.line(u(60, 34, 64, 12), fill=255, width=5 * SS)
    d.chord(u(64, 6, 100, 30), 180, 360, fill=255)
    d.chord(u(64, 0, 100, 28), 0, 180, fill=0)
    d.line(u(66, 18, 96, 16), fill=255, width=3 * SS)
    save(im, w, h, 'apple.png')


def elephant(w=150, h=112):
    im, d = canvas(w, h)
    lw = 5 * SS
    # body
    d.ellipse(u(34, 22, 132, 82), fill=255)
    d.ellipse(u(39, 27, 127, 77), fill=0)
    # legs
    for x in (44, 66, 98, 116):
        d.rounded_rectangle(u(x, 58, x + 15, 104), radius=4 * SS, fill=255)
        d.rounded_rectangle(u(x + 5, 60, x + 10, 99), radius=2 * SS, fill=0)
    d.rectangle(u(41, 56, 128, 66), fill=0)
    d.arc(u(34, 22, 132, 82), 20, 165, fill=255, width=lw)
    # head
    d.ellipse(u(10, 14, 58, 62), fill=255)
    d.ellipse(u(15, 19, 53, 57), fill=0)
    # ear
    d.ellipse(u(30, 18, 62, 56), fill=255)
    d.ellipse(u(35, 23, 57, 51), fill=0)
    # trunk, curled up at the tip
    d.arc(u(-2, 34, 30, 92), 90, 270, fill=255, width=lw)
    d.arc(u(4, 80, 26, 102), 270, 450, fill=255, width=lw)
    d.ellipse(u(22, 30, 28, 36), fill=255)  # eye
    # tail
    d.line(u(131, 46, 142, 62), fill=255, width=3 * SS)
    d.ellipse(u(138, 58, 146, 68), fill=255)
    save(im, w, h, 'elephant.png')


def jug(w=130, h=150):
    im, d = canvas(w, h)
    lw = 5 * SS
    # glass jug body
    d.rounded_rectangle(u(14, 34, 92, 140), radius=14 * SS, fill=255)
    d.rounded_rectangle(u(19, 39, 87, 135), radius=10 * SS, fill=0)
    # liquid line and lemon slices floating
    d.line(u(19, 58, 87, 58), fill=255, width=3 * SS)
    for cx, cy in ((38, 84), (66, 106)):
        d.ellipse(u(cx - 12, cy - 12, cx + 12, cy + 12), fill=255)
        d.ellipse(u(cx - 8, cy - 8, cx + 8, cy + 8), fill=0)
        for a in range(0, 360, 60):
            t = np.radians(a)
            d.line(u(cx, cy, cx + 8 * np.cos(t), cy + 8 * np.sin(t)), fill=255, width=2 * SS)
    # neck and lip
    d.rectangle(u(26, 20, 80, 36), fill=255)
    d.rectangle(u(31, 25, 75, 36), fill=0)
    d.line(u(19, 38, 87, 38), fill=255, width=lw)
    d.polygon(u(14, 18, 26, 24, 26, 30), fill=255)  # spout
    # handle
    d.arc(u(74, 50, 118, 112), 270, 90, fill=255, width=7 * SS)
    # whole lemon beside
    d.ellipse(u(92, 116, 128, 146), fill=255)
    d.ellipse(u(97, 121, 123, 141), fill=0)
    d.arc(u(100, 124, 118, 138), 200, 260, fill=255, width=3 * SS)
    save(im, w, h, 'jug.png')


def drumstick(w=120, h=96):
    im, d = canvas(w, h)
    lw = 5 * SS
    # meaty end
    d.ellipse(u(8, 10, 74, 70), fill=255)
    d.ellipse(u(13, 15, 69, 65), fill=0)
    # bone
    d.line(u(60, 54, 98, 78), fill=255, width=16 * SS)
    d.line(u(60, 54, 98, 78), fill=0, width=7 * SS)
    for cx, cy in ((100, 74), (94, 84)):
        d.ellipse(u(cx - 8, cy - 8, cx + 8, cy + 8), fill=255)
        d.ellipse(u(cx - 4, cy - 4, cx + 4, cy + 4), fill=0)
    d.ellipse(u(13, 15, 69, 65), fill=0)
    d.arc(u(8, 10, 74, 70), 0, 360, fill=255, width=lw)
    # crunchy crust marks
    for x0, y0, x1, y1 in ((22, 30, 30, 26), (34, 46, 44, 42), (26, 52, 32, 50), (46, 24, 54, 22), (52, 38, 60, 36)):
        d.line(u(x0, y0, x1, y1), fill=255, width=3 * SS)
    save(im, w, h, 'drumstick.png')


def soft_noise(w, h, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale)))
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(scale / 2)), dtype=float) / 255.0


def wear(face, seed, edge):
    """big soft mottling, a grey copier-lid shadow down one edge, darker corners. No pixel noise."""
    w, h = FW * 2, FH * 2
    a = np.zeros((h, w))
    col = np.zeros((h, w, 3))
    # mottled toner haze
    mot = soft_noise(w, h, 160, seed)
    a += np.clip(mot - 0.55, 0, 1) * 0.10
    # copier edge shadow: a soft grey band that wanders slightly
    xs = np.arange(w)[None, :]
    ys = np.arange(h)[:, None]
    wob = 6 + 4 * np.sin(ys / 260.0 + seed)
    dist = xs if edge == 'left' else (w - 1 - xs)
    band = np.exp(-np.clip(dist - wob, 0, None) / 9.0) * 0.38
    band *= 0.75 + 0.25 * soft_noise(w, h, 90, seed + 1)
    a = np.maximum(a, band)
    # corner and edge darkening from handling
    nx = (xs / w - 0.5) * 2
    ny = (ys / h - 0.5) * 2
    vig = np.clip((nx ** 2 + ny ** 2) ** 0.5 - 1.0, 0, 1) * 0.35
    a = np.maximum(a, vig * (0.6 + 0.4 * mot))
    col[...] = (40, 46, 36)
    out = np.dstack([col, np.clip(a, 0, 1) * 255]).astype(np.uint8)
    img = Image.fromarray(out, 'RGBA')
    if face == 'front':
        # a faint ring from a carton of milk set down on it
        ring = Image.new('L', (w, h), 0)
        rd = ImageDraw.Draw(ring)
        cx, cy, r = 1480, 2010, 70
        rd.ellipse((cx - r, cy - r, cx + r, cy + r), outline=58, width=16)
        ring = ring.filter(ImageFilter.GaussianBlur(9))
        st = Image.new('RGBA', (w, h), (120, 128, 96, 0))
        st.putalpha(ring)
        img = Image.alpha_composite(img, st)
    else:
        # thumb smudge where it was carried home
        sm = Image.new('L', (w, h), 0)
        sd = ImageDraw.Draw(sm)
        sd.ellipse((70, 980, 190, 1130), fill=34)
        sm = sm.filter(ImageFilter.GaussianBlur(30))
        st = Image.new('RGBA', (w, h), (60, 66, 52, 0))
        st.putalpha(sm)
        img = Image.alpha_composite(img, st)
    img.save(os.path.join(A, f'wear-{face}.png'))


apple(); elephant(); jug(); drumstick()
wear('front', 7, 'left')
wear('back', 11, 'right')
print('painted')
