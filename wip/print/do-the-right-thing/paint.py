"""Paints the art for Sal's wall menu (1056x1344 css px, painted at 2x).
- band.jpg: the film's own red brick wall (TMDB still), cropped above the corner men, shaded for the sign.
- hero.jpg: Sal's dining room first thing in the morning (TMDB still), lifted and warmed, cooler logo blurred.
- triangles.png: the zigzag triangle band from the film's title art, in heat colours.
- wall.png: the signature. Sal's dark wood panelling with the Wall of Fame, a row of empty frames, no faces.
- board.png: the hot yellow menu board stock, soft mottle.
- heat.png: a soft heat haze over the top of the face."""
import os, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', 'full', f)
K = 2
W, H = 1056, 1344
rnd = random.Random(1989)
np.random.seed(1989)

def fit(im, w, h):
    return im.resize((w * K, h * K), Image.LANCZOS)

# ---------- band: the red wall ----------
b = Image.open(S('njeCvtiagMMZyyp9evPFLilsKfy.jpg')).convert('RGB').crop((0, 115, 2803, 515))
b = fit(b, W, 150)
a = np.asarray(b).astype(float)
xx = np.linspace(0, 1, a.shape[1])[None, :, None]
shade = 0.62 + 0.38 * np.clip((xx - 0.05) / 0.75, 0, 1)
a = a * shade
Image.fromarray(a.clip(0, 255).astype('uint8')).save(A('band.jpg'), quality=90)

# ---------- hero: Sal's in the morning ----------
h = Image.open(S('3leftVRvO17DjEkUnY0Xadfsztg.jpg')).convert('RGB')
h = h.crop((0, 100, 1260, 100 + 453))  # stops short of the cooler
a = np.asarray(h).astype(float) / 255
a = a ** 0.72
a[..., 0] *= 1.04; a[..., 2] *= 0.94
h = Image.fromarray((a.clip(0, 1) * 255).astype('uint8'))
h = ImageEnhance.Contrast(h).enhance(1.08)
h = ImageEnhance.Color(h).enhance(1.12)
fit(h, 952, 342).save(A('hero.jpg'), quality=90)

# ---------- triangles: zigzag band from the title art ----------
TW, TH = W * K, 16 * K
t = Image.new('RGB', (TW, TH), '#2a0f0a')
d = ImageDraw.Draw(t)
cols = ['#ffd23a', '#e8411f', '#f58a1f', '#ffd23a', '#9c2a1a', '#f58a1f']
step = 24 * K
for i, x in enumerate(range(-step, TW + step, step)):
    d.polygon([(x, TH), (x + step // 2, 0), (x + step, TH)], fill=cols[i % len(cols)])
    d.polygon([(x + step // 2, 0), (x + step, TH), (x + step * 3 // 2, 0)], fill='#2a0f0a')
t.save(A('triangles.png'))

# ---------- wall.png: dark wood panelling and the Wall of Fame ----------
WT = 548
WW, WH = W * K, (H - WT) * K
small = np.random.rand(WH // 60 + 2, WW // 2)
grain = np.asarray(Image.fromarray((small * 255).astype('uint8')).resize((WW, WH), Image.BICUBIC)).astype(float) / 255
fine = np.random.rand(WH // 14 + 2, WW)
fine = np.asarray(Image.fromarray((fine * 255).astype('uint8')).resize((WW, WH), Image.BICUBIC)).astype(float) / 255
base = np.zeros((WH, WW, 3))
board_w = 96 * K
for i, x0 in enumerate(range(0, WW, board_w)):
    tone = [(78, 44, 26), (70, 39, 23), (84, 48, 28)][i % 3]
    base[:, x0:x0 + board_w] = tone
g = (grain - 0.5) * 34 + (fine - 0.5) * 18
base += g[..., None] * np.array([1.0, 0.7, 0.45])
for x0 in range(0, WW, board_w):
    base[:, max(0, x0 - 3):x0 + 2] *= 0.45
    base[:, x0 + 2:x0 + 5] *= 1.18
yy, xx = np.mgrid[0:WH, 0:WW].astype(float)
light = np.exp(-(((xx - WW * 0.3) / (WW * 0.75)) ** 2 + ((yy - 0) / (WH * 0.7)) ** 2))
base = base * (0.62 + 0.55 * light[..., None]) + np.array([60, 28, 6]) * light[..., None] * 0.35
edge = np.minimum(xx, WW - xx)
base *= (0.75 + 0.25 * np.clip(edge / (90 * K), 0, 1))[..., None]
# chair rail just under the frames
wall = Image.fromarray(base.clip(0, 255).astype('uint8')).convert('RGBA')

def gilt(w, h, kind):
    """A frame w x h (2x px) with its mat and empty glass."""
    f = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(f)
    fw = max(14, int(min(w, h) * 0.11))
    if kind == 'gilt':
        ring = [(120, 84, 30), (196, 150, 64), (238, 204, 118), (176, 128, 50), (110, 74, 26)]
    elif kind == 'black':
        ring = [(14, 10, 8), (36, 28, 22), (54, 44, 34), (24, 18, 14), (10, 8, 6)]
    else:
        ring = [(52, 28, 14), (96, 58, 30), (128, 82, 44), (82, 48, 24), (44, 24, 12)]
    n = len(ring)
    for i in range(fw):
        c = ring[min(n - 1, int(i / fw * n))]
        jitter = rnd.randint(-6, 6)
        c = tuple(max(0, min(255, v + jitter)) for v in c) + (255,)
        d.rectangle([i, i, w - 1 - i, h - 1 - i], outline=c)
    if kind == 'black':
        d.rectangle([fw - 3, fw - 3, w - fw + 2, h - fw + 2], outline=(200, 160, 80, 255), width=2)
    # mat
    mx0, my0, mx1, my1 = fw, fw, w - fw, h - fw
    d.rectangle([mx0, my0, mx1, my1], fill=(236, 226, 200, 255))
    mw = int(min(w, h) * 0.12)
    # empty opening: pale backing card, a little shadow from the mat bevel
    ox0, oy0, ox1, oy1 = mx0 + mw, my0 + mw, mx1 - mw, my1 - mw
    d.rectangle([ox0, oy0, ox1, oy1], fill=(214, 200, 172, 255))
    d.rectangle([ox0, oy0, ox1, oy0 + 5], fill=(170, 152, 120, 255))
    d.rectangle([ox0, oy0, ox0 + 5, oy1], fill=(178, 160, 128, 255))
    d.rectangle([ox0 - 3, oy0 - 3, ox1 + 3, oy1 + 3], outline=(250, 244, 228, 255), width=3)
    # bevel shading on the frame: light top-left, dark bottom-right
    sh = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sd = ImageDraw.Draw(sh)
    sd.polygon([(0, 0), (w, 0), (w - fw, fw), (fw, fw), (fw, h - fw), (0, h)], fill=(255, 240, 200, 40))
    sd.polygon([(w, h), (0, h), (fw, h - fw), (w - fw, h - fw), (w - fw, fw), (w, 0)], fill=(0, 0, 0, 70))
    f = Image.alpha_composite(f, sh)
    # glass: one soft diagonal glint
    gl = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    gd = ImageDraw.Draw(gl)
    gd.polygon([(mx0 + (mx1 - mx0) * 0.55, my0), (mx0 + (mx1 - mx0) * 0.8, my0),
                (mx0 + (mx1 - mx0) * 0.35, my1), (mx0 + (mx1 - mx0) * 0.1, my1)], fill=(255, 255, 255, 38))
    gl = gl.filter(ImageFilter.GaussianBlur(6))
    f = Image.alpha_composite(f, gl)
    # worn finish: soft mottle over the moulding so it reads painted, not drawn
    nz = np.random.rand(h // 6 + 2, w // 6 + 2)
    nz = np.asarray(Image.fromarray((nz * 255).astype('uint8')).resize((w, h), Image.BICUBIC)).astype(float) / 255
    arr = np.asarray(f).astype(float)
    ring = np.ones((h, w)); ring[fw:h - fw, fw:w - fw] = 0
    arr[..., :3] *= (1 + (0.2 * nz - 0.1) * ring)[..., None]
    return Image.fromarray(arr.clip(0, 255).astype('uint8'), 'RGBA')

# frame row, css px relative to the wall top (548)
FR = [(48, 58, 96, 124, 'gilt'), (160, 46, 110, 140, 'black'), (288, 64, 92, 116, 'wood'),
      (398, 50, 104, 132, 'gilt'), (520, 40, 118, 150, 'black'), (656, 58, 96, 120, 'gilt'),
      (770, 48, 104, 136, 'wood'), (892, 56, 116, 126, 'black')]
shadow = Image.new('RGBA', wall.size, (0, 0, 0, 0))
sdraw = ImageDraw.Draw(shadow)
for x, y, w, h, k in FR:
    sdraw.rectangle([(x + 5) * K, (y + 8) * K, (x + w + 5) * K, (y + h + 9) * K], fill=(0, 0, 0, 150))
shadow = shadow.filter(ImageFilter.GaussianBlur(9 * K))
wall = Image.alpha_composite(wall, shadow)
dw = ImageDraw.Draw(wall)
for x, y, w, h, k in FR:
    cx = (x + w / 2) * K
    ny = (y - 18) * K
    dw.line([(cx, ny), ((x + 10) * K, (y + 2) * K)], fill=(40, 30, 22, 255), width=2)
    dw.line([(cx, ny), ((x + w - 10) * K, (y + 2) * K)], fill=(40, 30, 22, 255), width=2)
    dw.ellipse([cx - 5, ny - 5, cx + 5, ny + 5], fill=(170, 150, 110, 255))
    fr = gilt(w * K, h * K, k).rotate(rnd.uniform(-1.6, 1.6), resample=Image.BICUBIC, expand=True)
    wall.alpha_composite(fr, (x * K - (fr.width - w * K) // 2, y * K - (fr.height - h * K) // 2))
    # blank brass name plate under each frame
    pw, ph = 46 * K, 9 * K
    px, py = int(cx - pw / 2), (y + h + 6) * K
    dw.rectangle([px + 3, py + 4, px + pw + 3, py + ph + 4], fill=(20, 10, 6, 150))
    for j in range(ph):
        c = int(150 + 70 * (1 - abs(j / ph - 0.35) * 1.6))
        dw.line([(px, py + j), (px + pw, py + j)], fill=(c, int(c * 0.78), int(c * 0.4), 255))
    dw.rectangle([px, py, px + pw, py + ph], outline=(110, 80, 34, 255), width=2)
wall.convert('RGB').save(A('wall.png'))

# ---------- board.png: hot yellow menu board ----------
BW, BH = 960, 538
by, bx = np.mgrid[0:BH * K, 0:BW * K].astype(float)
m = np.random.rand(BH // 40 + 2, BW // 40 + 2)
m = np.asarray(Image.fromarray((m * 255).astype('uint8')).resize((BW * K, BH * K), Image.BICUBIC)).astype(float) / 255
bd = np.zeros((BH * K, BW * K, 3))
bd[...] = (252, 214, 84)
e = np.minimum(np.minimum(bx, BW * K - bx), np.minimum(by, BH * K - by)) / K
heat = np.clip(1 - e / 120, 0, 1) ** 1.6
bd = bd * (1 - heat[..., None] * 0.22) + np.array([240, 120, 30]) * heat[..., None] * 0.22
bd += (m[..., None] - 0.5) * np.array([10, 12, 10])
Image.fromarray(bd.clip(0, 255).astype('uint8')).save(A('board.png'))

# ---------- heat.png: soft orange haze from the top ----------
yy, xx = np.mgrid[0:H, 0:W].astype(float)
al = np.clip(1 - yy / 620, 0, 1) ** 2 * 60
lay = np.zeros((H, W, 4)); lay[..., 0], lay[..., 1], lay[..., 2] = 255, 150, 40; lay[..., 3] = al
Image.fromarray(lay.astype('uint8'), 'RGBA').save(A('heat.png'))
print('painted')
