"""Paints the C.H.U.D. soup kitchen notice assets with PIL.

The object: a 1984 church basement Xerox of a typed and marker-lettered notice,
taped to the wall of the Reverend's soup kitchen. Every layer copies a real
copier fault rather than a filter look.

paper.jpg        : 20 lb copier bond with the copier's own marks printed on it: lid shadow down
                   the left, and the dark glass where the original sat crooked and its bottom
                   right corner was folded under (the lost corner). Bleed included.
toner-wear.png   : top layer. Uneven toner (big soft dropouts and a pale roller band that grey the
                   blacks), toner specks and clumps, a drum streak, a mug ring, hand grime, and the
                   pin hole with its small tear from the last time it was put up.
tape.png         : a strip of crepe masking tape with torn ends.
photo.png        : the manhole picture as a newspaper clipping run through the copier:
                   coarse dot screen, crushed blacks, grey newsprint, hard paste-up edge.
"""
import numpy as np, os, math
from scipy import ndimage
from PIL import Image, ImageDraw, ImageFilter, ImageOps

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 3
BL = 12                      # css px of bleed painted around the 816 x 1056 sheet
CW, CH = 816 + 2 * BL, 1056 + 2 * BL
W, H = CW * S, CH * S
rng = np.random.default_rng(1984)

def smooth_noise(w, h, cells, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((max(2, cells), max(2, int(cells * w / h)))).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
sx_ = xx / S - BL            # sheet css coords
sy_ = yy / S - BL

# ---------- paper ----------
base = np.array([238, 236, 229], dtype=np.float32)        # white copier bond, a season on the wall
img = np.ones((H, W, 3), np.float32) * base
blot = smooth_noise(W, H, 6, 2) * 3.0 + smooth_noise(W, H, 22, 3) * 1.4
img += blot[..., None] * np.array([1.0, 1.0, 1.3])
# yellowing at the edges where the air gets at it
ex = np.minimum(sx_ + BL, 816 + BL - sx_); ey = np.minimum(sy_ + BL, 1056 + BL - sy_)
edge = np.clip(1 - np.minimum(ex, ey) / 60, 0, 1) ** 2
img -= edge[..., None] * np.array([5, 8, 20])
# copier lid shadow down the left edge, soft grey
lid = np.clip(1 - (sx_ + 2) / 14, 0, 1) ** 1.5
img -= lid[..., None] * 70
# a faint grey fog across the top where the lid did not sit flat
fog = np.clip(1 - (sy_ + 2) / 40, 0, 1) ** 2 * np.clip(smooth_noise(W, H, 30, 21) * 0.5 + 0.7, 0, 1)
img -= fog[..., None] * 22
# crooked original: the glass beyond its right and bottom edges prints dark
right_line = 816 - (1.5 + 13.0 * sy_ / 1056)                 # 814.5 at the top to 801.5 at the bottom
bottom_line = 1056 - (1.0 + 12.0 * sx_ / 816)                # 1055 at the left to 1043 at the right
# the folded under corner: everything past this diagonal is glass too
corner = (sx_ - (816 - 74)) / 74 + (sy_ - (1056 - 52)) / 52 - 1.0
dist = np.maximum.reduce([sx_ - right_line, sy_ - bottom_line, corner * 30])
dark = np.clip(dist * 1.6 + 0.5, 0, 1)                        # about a 1 px soft edge
mott = np.clip(smooth_noise(W, H, 40, 31) * 0.35 + smooth_noise(W, H, 160, 32) * 0.2 + 0.5, 0, 1)
streak = np.clip(smooth_noise(1, H, 220, 33)[:, :1] * 0.4 + 0.5, 0, 1)   # roller streaks run down the sheet
glass = np.array([40, 39, 37], np.float32) + (mott * 26 + streak * 14)[..., None]
img = img * (1 - dark[..., None]) + glass * dark[..., None]
# the bright halo copiers leave just inside a dark edge
halo = np.clip(1 - np.abs(dist + 2.5) / 2.5, 0, 1) * (dist < 0)
img += halo[..., None] * 6
fib = ndimage.gaussian_filter(rng.standard_normal((H, W)).astype(np.float32), 1.2)
img += fib[..., None] * 1.6
paper = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
paper.save(os.path.join(A, 'paper.jpg'), quality=88)

# ---------- toner and wear (top layer) ----------
W2, H2 = W, H
wear = np.zeros((H2, W2, 4), np.float32)
def put(alpha, rgb):
    """composite a colour with an alpha map (0..1) over the running layer"""
    global wear
    a = np.clip(alpha, 0, 1)[..., None]
    col = np.array(rgb, np.float32)
    out_a = a + wear[..., 3:] * (1 - a)
    out_rgb = (col * a + wear[..., :3] * wear[..., 3:] * (1 - a)) / np.maximum(out_a, 1e-6)
    wear = np.concatenate([out_rgb, out_a], -1)

# uneven toner: paper coloured dropouts that turn the black type grey in big soft patches
drop = smooth_noise(W, H, 5, 41) * 0.55 + smooth_noise(W, H, 16, 42) * 0.35 + smooth_noise(W, H, 60, 43) * 0.12
drop = np.clip(drop * 0.5 + 0.30, 0, 1)
band = np.exp(-((sy_ - 610) / 70) ** 2) * 0.55 + np.exp(-((sy_ - 205) / 40) ** 2) * 0.3   # roller bands
side = np.clip((sx_ - 420) / 400, 0, 1) * 0.35                                               # drum worn on the right
put((drop + band + side) * 0.36, (236, 234, 227))

# toner specks and clumps (soft, a few px, not pixel noise)
sp = np.zeros((H, W), np.float32)
pts = rng.uniform(0, 1, (520, 2)) * [W, H]
for x, y in pts:
    r = (abs(rng.normal(0, 0.45)) + 0.35) * S
    x0, y0 = int(x), int(y); R = int(r + 3)
    ys, xs = np.mgrid[max(0, y0 - R):min(H, y0 + R), max(0, x0 - R):min(W, x0 + R)]
    sp[ys, xs] = np.maximum(sp[ys, xs], np.clip((r - np.hypot(xs - x, ys - y)) / 1.5 + 0.5, 0, 1) * rng.uniform(0.45, 0.9))
for _ in range(18):
    cx, cy = rng.uniform(0, W), rng.uniform(0, H)
    for _ in range(int(rng.uniform(8, 22))):
        x, y = np.clip(cx + rng.normal(0, 9 * S / 3), 8, W - 8), np.clip(cy + rng.normal(0, 9 * S / 3), 8, H - 8)
        r = rng.uniform(0.4, 1.2) * S
        x0, y0 = int(x), int(y); R = int(r + 3)
        ys, xs = np.mgrid[max(0, y0 - R):min(H, y0 + R), max(0, x0 - R):min(W, x0 + R)]
        sp[ys, xs] = np.maximum(sp[ys, xs], np.clip((r - np.hypot(xs - x, ys - y)) / 1.5 + 0.5, 0, 1) * rng.uniform(0.5, 0.85))
put(sp, (34, 32, 30))
# copier fog: a light toner haze that thickens towards the dark glass at the right
fogr = np.clip(1 - (right_line - sx_) / 40, 0, 1) ** 2 * (sx_ < right_line)
put(fogr * 0.18 * np.clip(smooth_noise(W, H, 50, 51) * 0.5 + 0.7, 0, 1), (60, 58, 55))
# drum streak, a broken grey hairline down the sheet
prof = np.clip(smooth_noise(1, H, 30, 9)[:, 0] * 0.7 + 0.45, 0, 1)
dsx = (BL + 612) * S
stk = np.zeros((H, W), np.float32)
for k, wgt in ((0, 1.0), (1, 0.8), (-1, 0.5), (2, 0.35), (-2, 0.2)):
    stk[:, dsx + k] = prof * wgt
put(ndimage.gaussian_filter(stk, 1.0) * 0.16, (40, 38, 36))
# mug ring, faint, lower right margin, on the copy itself (added after posting)
ring = Image.new('L', (W, H), 0); rd = ImageDraw.Draw(ring)
cx, cy, R = (BL + 742) * S, (BL + 1000) * S, 46 * S
for i in range(24):
    a0 = rng.uniform(0, 360); da = rng.uniform(25, 80)
    rr = R + rng.normal(0, 1.5) * S
    rd.arc([cx - rr, cy - rr, cx + rr, cy + rr], a0, a0 + da, fill=int(rng.uniform(40, 90)), width=int(rng.uniform(2, 4) * S))
ring = np.asarray(ring.filter(ImageFilter.GaussianBlur(1.6 * S))).astype(np.float32) / 255
put(ring * 0.55, (128, 92, 50))
# hand grime where people lift the bottom corners to read the next sheet underneath
gr = np.zeros((H, W), np.float32)
for gx, gy in ((0, 1056), (816, 1056)):
    gr += np.exp(-(((sx_ - gx) / 70) ** 2 + ((sy_ - gy) / 50) ** 2))
gr *= np.clip(smooth_noise(W, H, 26, 12) * 0.5 + 0.7, 0, 1)
put(gr * 0.20, (88, 70, 48))
# pin hole with a small tear, top centre, from the last time this went up with a tack
ph = np.zeros((H, W), np.float32)
hx, hy = (BL + 412) * S, (BL + 20) * S
ph += np.exp(-((xx - hx) ** 2 + (yy - hy) ** 2) / (2 * (1.3 * S) ** 2))
# the tear runs down and a little left, ragged
t = np.linspace(0, 1, 60)
tx = hx - t * 5 * S + np.sin(t * 9) * 0.6 * S; ty = hy + t * 11 * S
tear = Image.new('L', (W, H), 0); td = ImageDraw.Draw(tear)
td.line(list(zip(tx, ty)), fill=210, width=max(1, int(0.7 * S)))
# a hair of torn paper fibre lifted beside the tear (lighter) with its shadow
td2 = Image.new('L', (W, H), 0); ImageDraw.Draw(td2).polygon([(hx - 1 * S, hy + 2 * S), (hx + 2.6 * S, hy + 4 * S), (hx + 0.4 * S, hy + 9 * S)], fill=120)
tear = np.asarray(tear.filter(ImageFilter.GaussianBlur(0.5 * S))).astype(np.float32) / 255
lift = np.asarray(td2.filter(ImageFilter.GaussianBlur(0.8 * S))).astype(np.float32) / 255
put(np.clip(ph * 1.1, 0, 1), (30, 26, 22))
put(tear * 0.9, (60, 54, 46))
put(lift * 0.5, (120, 112, 100))
Image.fromarray(np.clip(wear * [1, 1, 1, 255], 0, 255).astype(np.uint8), 'RGBA').save(os.path.join(A, 'toner-wear.png'), optimize=True)

# ---------- masking tape ----------
TW, TH = 128 * S, 34 * S
tp = np.zeros((TH, TW, 4), np.float32)
ty_, tx_ = np.mgrid[0:TH, 0:TW].astype(np.float32)
# torn ends: ragged edge profiles
def torn(n, seed, amp):
    r = np.random.default_rng(seed)
    v = np.cumsum(r.normal(0, 1, n)); v = v - np.linspace(v[0], v[-1], n)
    v = ndimage.gaussian_filter1d(v, 2) ; v = v / (np.abs(v).max() + 1e-6) * amp
    return v + r.uniform(0, 1, n) * amp * 0.35
le = torn(TH, 7, 5 * S) + 7 * S; re_ = TW - 7 * S - torn(TH, 8, 5 * S)
inside = (tx_ > le[:, None]) & (tx_ < re_[:, None])
edges = np.clip(np.minimum(tx_ - le[:, None], re_[:, None] - tx_) / (1.2 * S), 0, 1) * inside
crepe = ndimage.gaussian_filter(np.random.default_rng(3).standard_normal((TH, TW)), (0.6 * S, 5 * S)) * 9
long = smooth_noise(TW, TH, 3, 4) * 6
col = np.array([222, 208, 168], np.float32) + (crepe + long)[..., None] * np.array([1, 1, 0.9])
# the long edges slightly darker where dust collects, the top edge a touch lifted
lip = np.clip(1 - np.minimum(ty_, TH - 1 - ty_) / (2.5 * S), 0, 1)
col -= lip[..., None] * 22
tp[..., :3] = col
tp[..., 3] = edges * (0.80 + crepe / 120)
tape = Image.fromarray(np.clip(tp * [1, 1, 1, 255], 0, 255).astype(np.uint8), 'RGBA')
# soft contact shadow below the tape
sh = Image.new('RGBA', (TW + 8 * S, TH + 8 * S), (0, 0, 0, 0))
mask = tape.split()[3].point(lambda v: int(v * 0.22))
sh.paste((40, 34, 24, 255), (5 * S, 6 * S), mask)
sh = sh.filter(ImageFilter.GaussianBlur(2 * S))
sh.alpha_composite(tape, (4 * S, 4 * S))
sh.save(os.path.join(A, 'tape.png'), optimize=True)

# ---------- photo: newspaper clipping, photocopied ----------
src = Image.open(os.path.join(A, 'manhole_orig.jpg')).convert('L')
w0, h0 = src.size
crop = src.crop((int(w0 * 0.14), int(h0 * 0.50), int(w0 * 0.86), h0))   # the cover and its steam, nobody in frame
PWc, PHc = 264, 138                                                       # css px of the printed picture
pw, phh = PWc * S, PHc * S
p = ImageOps.fit(crop, (pw, phh), Image.LANCZOS, centering=(0.5, 0.55))
p = ImageOps.autocontrast(p, cutoff=1)
tone = np.asarray(p).astype(np.float32) / 255
tone = np.clip((tone - 0.06) / 0.86, 0, 1) ** 0.85
# 65 line newspaper screen at 45 degrees
pitch = 1.6 * S                                   # about 1.6 css px a cell
gy, gx = np.mgrid[0:phh, 0:pw].astype(np.float32)
c, s_ = math.cos(math.radians(45)), math.sin(math.radians(45))
u = (gx * c + gy * s_) / pitch; v = (-gx * s_ + gy * c) / pitch
du = u - np.floor(u) - 0.5; dv = v - np.floor(v) - 0.5
dd = np.hypot(du, dv)                                   # 0 at the cell centre
cover = 1 - tone                                         # ink coverage
rad = np.sqrt(np.clip(cover, 0, 1) / math.pi) * 1.02
ink = np.clip((rad - dd) * pitch / 1.1 + 0.5, 0, 1)
ink = np.maximum(ink, (cover > 0.9) * 1.0)
# copier: the screen fills in, blacks crush, highlights drop out, a little blur
ink = ndimage.gaussian_filter(ink, 0.55 * S)
ink = np.clip((ink - 0.22) / 0.5, 0, 1)
ink *= np.clip(smooth_noise(pw, phh, 6, 61) * 0.15 + 0.92, 0, 1)
news = np.array([214, 211, 203], np.float32)           # newsprint reads grey on the copy
toner = np.array([36, 35, 33], np.float32)
rgb = news * (1 - ink[..., None]) + toner * ink[..., None]
# clipping cut with scissors, a hair off square, with a white border of newsprint around the picture
mg = 4 * S
fr = np.ones((phh + 2 * mg, pw + 2 * mg, 3), np.float32) * news
fr[mg:mg + phh, mg:mg + pw] = rgb
clip_img = Image.fromarray(fr.astype(np.uint8))
out = Image.new('RGBA', (clip_img.width + 6 * S, clip_img.height + 6 * S), (0, 0, 0, 0))
out.paste(clip_img, (3 * S, 3 * S))
od = ImageDraw.Draw(out)
# the hard dark line the copier draws where the clipping's cut edge sat on the page
ex0, ey0, ex1, ey1 = 3 * S, 3 * S, 3 * S + clip_img.width - 1, 3 * S + clip_img.height - 1
od.line([(ex0, ey0), (ex1, ey0 + 1)], fill=(70, 68, 64, 255), width=int(0.9 * S))
od.line([(ex0, ey1), (ex1, ey1)], fill=(52, 50, 47, 255), width=int(1.4 * S))
od.line([(ex1, ey0), (ex1, ey1)], fill=(58, 56, 52, 255), width=int(1.2 * S))
od.line([(ex0, ey0), (ex0, ey1)], fill=(96, 94, 90, 255), width=int(0.7 * S))
out.save(os.path.join(A, 'photo.png'), optimize=True)
print('assets painted', paper.size, out.size, (out.width / S, out.height / S))
