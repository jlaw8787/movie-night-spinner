"""Paints the C.H.U.D. soup kitchen notice assets with PIL.
paper.png  : cheap copier paper, bleed included (840 x 1080 css px at 3x), sits under everything
wear.png   : top layer, toner specks, a copier drum streak, a stew-pot ring, corner grime (transparent)
tack.png   : red push pin seen from above, with its shadow
photo.png  : the manhole still as a photocopied paste-up (grey, crushed blacks, grain, paste-up edge)
"""
import numpy as np, os, math
from scipy import ndimage
from PIL import Image, ImageDraw, ImageFilter, ImageOps, ImageEnhance

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 3
BL = 12                      # css px of bleed painted around the 816 x 1056 sheet
CW, CH = 816 + 2 * BL, 1056 + 2 * BL
W, H = CW * S, CH * S
rng = np.random.default_rng(1984)

def smooth_noise(w, h, cells, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((cells, max(2, int(cells * w / h)))).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))

# ---------- paper ----------
base = np.array([234, 230, 214], dtype=np.float32)          # cheap 20 lb copier bond, a little aged
img = np.ones((H, W, 3), np.float32) * base
blot = smooth_noise(W, H, 7, 2) * 3.2 + smooth_noise(W, H, 28, 3) * 1.6
img += blot[..., None] * np.array([1.0, 1.0, 1.25])
fib = rng.standard_normal((H, W)).astype(np.float32)
fib = ndimage.gaussian_filter(fib, 0.8)
img += fib[..., None] * 3.0
# yellowing towards the edges, the sheet has been on the wall a while
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
ex = np.minimum(xx, W - xx) / S; ey = np.minimum(yy, H - yy) / S
edge = np.clip(1 - np.minimum(ex, ey) / 70, 0, 1) ** 2
img -= edge[..., None] * np.array([6, 9, 22])
# copier lid shadow down the left edge (original was squared off a hair short)
lid = np.clip(1 - (xx / S - BL) / 10, 0, 1) * (xx / S > BL - 4)
img -= lid[..., None] * 58
# a grey copier band along the bottom where the original sat crooked on the glass
band = np.clip(1 - ((CH * S - yy) / S - BL - (xx / W) * 7) / 6, 0, 1)
img -= band[..., None] * 44
paper = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
paper.save(os.path.join(A, 'paper.png'))

# ---------- wear (top layer, RGBA) ----------
wear = Image.new('RGBA', (W, H), (0, 0, 0, 0))
d = ImageDraw.Draw(wear)
# toner specks, mostly tiny, a few clumps
for _ in range(1100):
    x, y = rng.uniform(0, W), rng.uniform(0, H)
    r = abs(rng.normal(0, 0.9)) + 0.4
    a = int(rng.uniform(60, 170))
    d.ellipse([x - r, y - r, x + r, y + r], fill=(30, 28, 26, a))
# a toner smear in the right margin, dragged by the copier rollers
sm = np.zeros((H, W), np.float32)
sm[int(560 * S):int(640 * S), int((BL + 786) * S):int((BL + 789) * S)] = 1
sm = ndimage.gaussian_filter(sm, 1.5 * S) * np.clip(smooth_noise(W, H, 60, 4) * 0.6 + 0.6, 0, 1)
wear.paste((40, 38, 36, 255), (0, 0), Image.fromarray(np.clip(sm * 40, 0, 255).astype(np.uint8), 'L'))
for _ in range(14):
    cx, cy = rng.uniform(0, W), rng.uniform(0, H)
    for _ in range(int(rng.uniform(6, 18))):
        x, y = cx + rng.normal(0, 7), cy + rng.normal(0, 7)
        r = rng.uniform(0.5, 1.8)
        d.ellipse([x - r, y - r, x + r, y + r], fill=(30, 28, 26, int(rng.uniform(80, 160))))
# drum streak: a faint grey line down the sheet, broken in places
sx = int((BL + 598) * S)
streak = np.zeros((H, W), np.float32)
prof = np.clip(smooth_noise(1, H, 40, 9)[:, 0] * 0.6 + 0.5, 0, 1)
for k, wgt in ((0, 1.0), (1, 0.7), (-1, 0.5), (2, 0.3)):
    streak[:, sx + k] = prof * wgt
st = Image.fromarray((streak * 26).astype(np.uint8), 'L').filter(ImageFilter.GaussianBlur(0.7))
wear.paste((40, 38, 36, 255), (0, 0), st)
# a ring off the bottom of a hot stew pot or a mug, faint, lower left in the footer margin
ring = Image.new('L', (W, H), 0); rd = ImageDraw.Draw(ring)
cx, cy, R = (BL + 70) * S, (BL + 1012) * S, 62 * S
for i in range(26):
    a = rng.uniform(0, 2 * math.pi); da = rng.uniform(0.3, 1.1)
    w_ = int(rng.uniform(2, 5) * S)
    rr = R + rng.normal(0, 2) * S
    rd.arc([cx - rr, cy - rr, cx + rr, cy + rr], math.degrees(a), math.degrees(a + da), fill=int(rng.uniform(40, 90)), width=w_)
ring = ring.filter(ImageFilter.GaussianBlur(1.6 * S))
wear.paste((120, 82, 40, 255), (0, 0), ring.point(lambda v: int(v * 0.85)))
# grime where hands have pulled at the bottom corners
gr = np.zeros((H, W), np.float32)
for (gx, gy) in ((BL * S, H - BL * S), (W - BL * S, H - BL * S)):
    gr += np.exp(-(((xx - gx) / (60 * S)) ** 2 + ((yy - gy) / (44 * S)) ** 2))
gr *= np.clip(smooth_noise(W, H, 30, 12) * 0.5 + 0.7, 0, 1)
g = Image.fromarray(np.clip(gr * 46, 0, 255).astype(np.uint8), 'L')
wear.paste((70, 56, 38, 255), (0, 0), g)
wear.save(os.path.join(A, 'wear.png'))

# ---------- push pin ----------
T = 64 * S
tk = Image.new('RGBA', (T, T), (0, 0, 0, 0))
sh = Image.new('L', (T, T), 0)
ImageDraw.Draw(sh).ellipse([T * 0.30, T * 0.34, T * 0.84, T * 0.88], fill=120)
sh = sh.filter(ImageFilter.GaussianBlur(4 * S))
tk.paste((20, 16, 12, 255), (0, 0), sh)
dd = ImageDraw.Draw(tk)
c = T * 0.44; r1 = T * 0.21
for i in range(40):                     # domed red head, lit from top left
    t = i / 39
    rr = r1 * (1 - t * 0.85)
    off = -t * r1 * 0.28
    col = (int(140 + 80 * t), int(30 + 60 * t * t), int(26 + 50 * t * t), 255)
    dd.ellipse([c + off - rr, c + off - rr, c + off + rr, c + off + rr], fill=col)
dd.ellipse([c - r1, c - r1, c + r1, c + r1], outline=(90, 12, 10, 255), width=S)
tk.save(os.path.join(A, 'tack.png'))

# ---------- photo, photocopied ----------
src = Image.open(os.path.join(A, 'manhole_orig.jpg')).convert('L')
w0, h0 = src.size
crop = src.crop((int(w0 * 0.16), int(h0 * 0.46), int(w0 * 0.84), h0))   # the cover and its steam, nobody in frame
pw = 900; ph = int(pw * crop.size[1] / crop.size[0])
p = crop.resize((pw, ph), Image.LANCZOS)
p = ImageOps.autocontrast(p, cutoff=1)
arr = np.asarray(p).astype(np.float32) / 255
arr = np.clip((arr - 0.12) / 0.78, 0, 1) ** 0.9                       # copier crush
arr += np.random.default_rng(5).standard_normal(arr.shape) * 0.05
arr = np.clip(arr, 0, 1)
ink = np.array([27, 26, 24], np.float32); pap = np.array([233, 228, 212], np.float32)
rgb = pap * arr[..., None] + ink * (1 - arr[..., None])
ph_img = Image.fromarray(rgb.astype(np.uint8))
# paste-up edge: the copier catches the edge of the glued print as a hard dark line
fr = Image.new('RGB', (pw + 16, ph + 16), tuple(int(v) for v in pap))
fr.paste(ph_img, (8, 8))
fd = ImageDraw.Draw(fr)
fd.rectangle([4, 5, pw + 11, ph + 11], outline=(70, 68, 64), width=2)
fr.save(os.path.join(A, 'photo.jpg'), quality=92)
print('assets painted', paper.size, fr.size)
