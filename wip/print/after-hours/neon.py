"""Paints the LAST STOP neon sign for the front of the Last Stop bar menu (After Hours, 1985).
Bent-glass tube letters, LAST in cream and STOP in red, lit on the black flood: wide soft glow,
a tighter halo, a coloured tube with a hot centre line, dark electrode ends, back-painted jumps
between letters, metal mounting clips, and the A in LAST running a little dim.
The canvas background is the flood colour, so the PNG sits on the page without a seam.
Writes assets/neon-sign.png at 2x (816 x 600 layout px)."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 2
LW, LH = 816, 600
W, H = LW * S, LH * S
FLOOD = np.array([22, 20, 18], float)

def arc(cx, cy, rx, ry, a0, a1, n=48):
    """Points on an ellipse, angles in degrees, y up in maths terms, flipped for screen."""
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy - ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]

# glyphs in units of letter height, y down; each is (advance width, [strokes])
G = {
 'L': (0.50, [[(0, 0), (0, 1), (0.50, 1)]]),
 'A': (0.64, [[(0, 1), (0.32, 0), (0.64, 1)], [(0.15, 0.63), (0.49, 0.63)]]),
 'S': (0.56, [arc(0.28, 0.255, 0.27, 0.245, 28, 270) + arc(0.28, 0.745, 0.27, 0.245, 90, -152)[1:]]),
 'T': (0.60, [[(0, 0), (0.60, 0)], [(0.30, 0), (0.30, 1)]]),
 'O': (0.60, [arc(0.30, 0.5, 0.30, 0.5, -84, 264, 96)]),
 'P': (0.56, [[(0, 1), (0, 0), (0.29, 0)] + arc(0.29, 0.27, 0.27, 0.27, 90, -90)[1:] + [(0, 0.54)]]),
}

def blur(a, r):
    im = Image.fromarray(np.clip(a * 255, 0, 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r)), float) / 255

def mask(strokes, w):
    m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
    for s in strokes:
        d.line(s, fill=255, width=int(w))
        for x, y in s: d.ellipse((x - w / 2, y - w / 2, x + w / 2, y + w / 2), fill=255)
    return np.asarray(m, float) / 255

def word(text, h, x0, y0, track):
    """Returns per-letter stroke lists in canvas px (2x)."""
    out, x = [], x0
    for ch in text:
        adv, strokes = G[ch]
        out.append([[(x + px * h, y0 + py * h) for px, py in s] for s in strokes])
        x += (adv + track) * h
    return out

def width(text, h, track):
    return (sum(G[c][0] for c in text) + track * (len(text) - 1)) * h

img = np.ones((H, W, 3)) * FLOOD
CREAM = dict(glow=np.array([255, 196, 130]), tube=np.array([255, 226, 178]), hot=np.array([255, 250, 236]))
RED = dict(glow=np.array([255, 42, 24]), tube=np.array([255, 92, 66]), hot=np.array([255, 214, 196]))

h1, h2, tr = 168 * S, 212 * S, 0.24
w1, w2 = width('LAST', h1, tr), width('STOP', h2, tr)
last = word('LAST', h1, (W - w1) / 2 - 4 * S, 74 * S, tr)
stop = word('STOP', h2, (W - w2) / 2, 74 * S + h1 + 70 * S, tr)
letters = [(s, CREAM, 15 * S, 'A' == c) for s, c in zip(last, 'LAST')] + [(s, RED, 17 * S, False) for s in stop]

# back-painted jumps (glass painted black where the tube runs between letters) and electrode ends
dark = Image.new('RGBA', (W, H), (0, 0, 0, 0)); dd = ImageDraw.Draw(dark)
def jump(p, q, w):
    dd.line([p, q], fill=(52, 47, 43, 255), width=int(w * 0.8))
    for x, y in (p, q): dd.ellipse((x - w * 0.4, y - w * 0.4, x + w * 0.4, y + w * 0.4), fill=(52, 47, 43, 255))
    dd.line([(p[0], p[1] - w * 0.18), (q[0], q[1] - w * 0.18)], fill=(78, 72, 66, 255), width=max(2, int(w * 0.14)))
# LAST: L foot to A foot along the baseline; STOP: T foot to O bottom, O to P foot
jump(last[0][0][-1], last[1][0][0], 15 * S)
jump(stop[1][1][-1], stop[2][0][0], 17 * S)
jump(stop[2][0][-1], stop[3][0][0], 17 * S)
da = np.asarray(dark, float) / 255
img = img * (1 - da[..., 3:]) + da[..., :3] * 255 * da[..., 3:]

glow_wide = np.zeros((H, W, 3)); glow_mid = np.zeros((H, W, 3))
for strokes, col, w, dim in letters:
    m = mask(strokes, w)
    k = 0.62 if dim else 1.0
    glow_wide += blur(m, 46 * S)[..., None] * col['glow'] * 0.55 * k
    glow_mid += blur(m, 11 * S)[..., None] * col['glow'] * 0.85 * k
img += glow_wide + glow_mid

for strokes, col, w, dim in letters:
    m = blur(mask(strokes, w), 1.1 * S)[..., None]
    hot = blur(mask(strokes, w * 0.36), 1.6 * S)[..., None]
    k = 0.8 if dim else 1.0
    tube = col['tube'] * k + FLOOD * (1 - k) * 0.6
    img = img * (1 - m) + tube * m
    img = img * (1 - hot * (0.55 if dim else 0.92)) + col['hot'] * (0.86 if dim else 1.0) * hot * (0.55 if dim else 0.92)

# fade the light out before the canvas edge so the PNG meets the flood without a seam
yy, xx = np.mgrid[0:H, 0:W]
edge = np.minimum.reduce([xx, yy, W - 1 - xx, H - 1 - yy]).astype(float)
feather = np.clip(edge / (70 * S), 0, 1)[..., None] ** 1.5
img = FLOOD + (img - FLOOD) * feather
img = np.clip(img, 0, 255)

# electrode ends: short dark caps where each stroke dives through the backing
out = Image.fromarray(img.astype(np.uint8)); od = ImageDraw.Draw(out)
def cap(p, q, w):
    dx, dy = p[0] - q[0], p[1] - q[1]; L = math.hypot(dx, dy) or 1
    ux, uy = dx / L, dy / L
    a = (p[0] - ux * w * 0.15, p[1] - uy * w * 0.15)
    od.line([a, (p[0] + ux * w * 0.35, p[1] + uy * w * 0.35)], fill=(46, 42, 38), width=int(w * 0.95))
    od.ellipse((p[0] + ux * w * 0.35 - w * 0.47, p[1] + uy * w * 0.35 - w * 0.47, p[0] + ux * w * 0.35 + w * 0.47, p[1] + uy * w * 0.35 + w * 0.47), fill=(46, 42, 38))
    od.line([a, (p[0] + ux * w * 0.3, p[1] + uy * w * 0.3)], fill=(84, 78, 70), width=max(2, int(w * 0.18)))
for strokes, col, w, dim in letters:
    a, b = strokes[0], strokes[-1]
    if math.dist(a[0], b[-1]) < w * 0.5 and len(strokes) == 1:
        cap(a[0], a[1], w * 0.6); cap(b[-1], b[-2], w * 0.6)
    else:
        cap(a[0], a[1], w); cap(b[-1], b[-2], w)

# mounting clips: a small metal saddle across the tube on a standoff, at two points per letter
def point_at(s, t):
    seg = [math.dist(s[i], s[i + 1]) for i in range(len(s) - 1)]; tot = sum(seg); goal = t * tot
    for i, l in enumerate(seg):
        if goal <= l:
            f = goal / l if l else 0
            return (s[i][0] + (s[i + 1][0] - s[i][0]) * f, s[i][1] + (s[i + 1][1] - s[i][1]) * f), (s[i + 1][0] - s[i][0], s[i + 1][1] - s[i][1])
        goal -= l
    return s[-1], (s[-1][0] - s[-2][0], s[-1][1] - s[-2][1])
def clip(p, d, w, tint):
    L = math.hypot(*d) or 1; ux, uy = d[0] / L, d[1] / L; nx, ny = -uy, ux
    half, th = w * 0.78, 2.4 * S
    pts = [(p[0] + nx * half + ux * th, p[1] + ny * half + uy * th), (p[0] - nx * half + ux * th, p[1] - ny * half + uy * th),
           (p[0] - nx * half - ux * th, p[1] - ny * half - uy * th), (p[0] + nx * half - ux * th, p[1] + ny * half - uy * th)]
    sh = [(x + 3 * S, y + 4 * S) for x, y in pts]
    od.polygon(sh, fill=(14, 12, 11))
    base = tuple(int(min(255, 84 + 0.12 * c)) for c in tint)
    od.polygon(pts, fill=base)
    od.line([pts[0], pts[1]], fill=tuple(min(255, b + 46) for b in base), width=max(2, int(1.2 * S)))
    for sgn in (1, -1):
        cx, cy = p[0] + nx * half * sgn, p[1] + ny * half * sgn
        od.ellipse((cx - 2 * S, cy - 2 * S, cx + 2 * S, cy + 2 * S), fill=(58, 54, 50))
CLIPS = {0: [(0, 0.36)], 1: [(0, 0.3), (0, 0.78)], 2: [(0, 0.62)], 3: [(1, 0.55)],
         4: [(0, 0.3), (0, 0.78)], 5: [(1, 0.5)], 6: [(0, 0.25), (0, 0.68)], 7: [(0, 0.1), (0, 0.6)]}
for i, (strokes, col, w, dim) in enumerate(letters):
    for si, t in CLIPS[i]:
        p, d = point_at(strokes[si], t); clip(p, d, w, col['glow'] * (0.5 if dim else 1))

out.save(os.path.join(A, 'neon-sign.png'), optimize=True)
print('neon', out.size)
