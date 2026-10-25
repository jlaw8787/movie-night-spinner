"""Paints the firehouse World Series supper window card (Frequency, 2000; Queens, October 1969).

The object: an 11 x 14 inch letterpress window card from a neighborhood job printer, taped inside
shop windows up and down the block. Two press runs on white board, reflex blue and orange.
Headlines are wood type (salty, grainy solids, squashed edges); the small copy is metal type;
the baseball is a stock line cut. The orange run sits a touch out of register with the blue, and
where orange and blue overlap the inks overprint dark. "See Frank or Satch" is grease pencil,
added by hand after printing.

Everything printed is painted here at 3x into assets/ink-card.png (transparent, over the paper div).
"""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
F = os.path.join(D, 'fonts')
S = 3
FW, FH = 1056, 1344
W, H = FW * S, FH * S
BLUE = np.array([30, 58, 132], float)
ORANGE = np.array([236, 104, 36], float)
PENCIL = np.array([46, 44, 48], float)

def P(v): return int(round(v * S))

_fc = {}
def font(name, px):
    k = (name, px)
    if k not in _fc:
        _fc[k] = ImageFont.truetype(os.path.join(F, name), P(px))
    return _fc[k]

GOTH = 'LeagueGothic.ttf'
FAT = 'Ultra.ttf'
WOODSLAB = 'HoltwoodOneSC.ttf'
NEWS = 'NewsCycle.ttf'
NEWSB = 'NewsCycle-Bold.ttf'
SER = 'OldStandard.ttf'
SERB = 'OldStandard-Bold.ttf'
SERI = 'OldStandard-Italic.ttf'
HAND = 'ReenieBeanie.ttf'

# plates: blue wood, blue metal, orange wood, orange metal, grease pencil
M = {k: Image.new('L', (W, H), 0) for k in ('bw', 'bm', 'ow', 'om', 'pen')}
DR = {k: ImageDraw.Draw(v) for k, v in M.items()}

# ---------------------------------------------------------------- type helpers (1x coordinates)
def width(s, f, track=0):
    return sum(f.getlength(c) for c in s) + P(track) * max(0, len(s) - 1) if track else f.getlength(s)

def text(plate, x, y, s, fname, px, align='l', track=0):
    """Baseline at y. align l, c, r about x. Returns the width in 1x px."""
    f = font(fname, px)
    w = width(s, f, track)
    X = P(x) - (w / 2 if align == 'c' else w if align == 'r' else 0)
    if track:
        for c in s:
            DR[plate].text((X, P(y)), c, font=f, fill=255, anchor='ls')
            X += f.getlength(c) + P(track)
    else:
        DR[plate].text((X, P(y)), s, font=f, fill=255, anchor='ls')
    return w / S

def fit(s, fname, target_w, track=0, max_px=999):
    f = font(fname, 100)
    w = width(s, f, track * 1.0) / S  # tracking is absolute, near enough at this size
    return min(max_px, 100 * target_w / w)

def cap_h(fname, px):
    f = font(fname, px)
    b = f.getbbox('H', anchor='ls')
    return -b[1] / S

def wrap(s, fname, px, w):
    f = font(fname, px)
    def go(maxw):
        lines, cur = [], ''
        for word in s.split():
            t = (cur + ' ' + word).strip()
            if f.getlength(t) <= P(maxw) or not cur:
                cur = t
            else:
                lines.append(cur); cur = word
        lines.append(cur)
        return lines
    mw = w
    lines = go(mw)
    while len(lines) > 1 and len(lines[-1].split()) < 2 and mw > w * 0.7:
        mw -= 6; lines = go(mw)
    return lines

def para(plate, x, y, s, fname, px, w, lh, align='l'):
    lines = wrap(s, fname, px, w)
    for i, ln in enumerate(lines):
        text(plate, x + (w / 2 if align == 'c' else 0), y + i * lh, ln, fname, px, 'c' if align == 'c' else 'l')
    return y + (len(lines) - 1) * lh

def rect(plate, x0, y0, x1, y1, fill=255):
    DR[plate].rectangle([P(x0), P(y0), P(x1) - 1, P(y1) - 1], fill=fill)

def frame(plate, x0, y0, x1, y1, t):
    rect(plate, x0, y0, x1, y0 + t); rect(plate, x0, y1 - t, x1, y1)
    rect(plate, x0, y0, x0 + t, y1); rect(plate, x1 - t, y0, x1, y1)

def leaders(plate, x0, x1, y, px=20):
    """Printer's dot leaders: periods from the type case, evenly set."""
    f = font(SER, px)
    step = P(9)
    X = P(x0) + step // 2
    while X < P(x1) - step // 3:
        DR[plate].text((X, P(y)), '.', font=f, fill=255, anchor='ms')
        X += step

# ---------------------------------------------------------------- stock cuts
def maltese(plate, cx, cy, r, centre_plate=None):
    """Firefighter's cross as a small stock cut: four flared arms with notched ends."""
    d = DR[plate]
    cx, cy, r = P(cx), P(cy), P(r)
    for k in range(4):
        a = k * math.pi / 2
        ca, sa = math.cos(a), math.sin(a)
        def pt(u, v): return (cx + u * ca - v * sa, cy + u * sa + v * ca)
        w0, w1, notch = r * 0.16, r * 0.62, r * 0.28
        d.polygon([pt(0, -w0), pt(r, -w1), pt(r - notch, 0), pt(r, w1), pt(0, w0)], fill=255)
    d.ellipse([cx - r * 0.34, cy - r * 0.34, cx + r * 0.34, cy + r * 0.34], fill=255)
    if centre_plate:
        DR[centre_plate].ellipse([cx - r * 0.24, cy - r * 0.24, cx + r * 0.24, cy + r * 0.24], fill=255)
        d.ellipse([cx - r * 0.24, cy - r * 0.24, cx + r * 0.24, cy + r * 0.24], fill=0)

def baseball(cx, cy, rad):
    """An engraved ball: contour hatching that thickens into the shadow side, an outline,
    a hatched cast shadow, and the seams and stitches on the orange plate."""
    cx, cy, R = P(cx), P(cy), P(rad)
    x0, y0 = cx - R - 4, cy - R - 4
    n = 2 * R + 9
    yy, xx = np.mgrid[0:n, 0:n].astype(float)
    nx = (xx + x0 - cx) / R
    ny = (yy + y0 - cy) / R
    rr = nx * nx + ny * ny
    inside = rr < 1
    nz = np.sqrt(np.clip(1 - rr, 0, 1))
    L = np.array([-0.55, -0.62, 0.56]); L /= np.linalg.norm(L)
    shade = nx * L[0] + ny * L[1] + nz * L[2]
    dark = np.clip((0.78 - shade) / 1.25, 0, 1) ** 1.15
    Ax = np.array([0.42, -0.86, 0.28]); Ax /= np.linalg.norm(Ax)
    u = np.arcsin(np.clip(nx * Ax[0] + ny * Ax[1] + nz * Ax[2], -1, 1))
    lines = 26
    fr = (u / math.pi * lines) % 1.0
    hatch = (np.abs(fr - 0.5) * 2 < dark * 0.92) & inside & (dark > 0.06)
    ring = (rr < 1) & (rr > (1 - 9 / R) ** 2)
    m = np.where(hatch | ring, 255, 0).astype(np.uint8)
    cut = Image.fromarray(m, 'L')
    M['bm'].paste(Image.new('L', cut.size, 255), (x0, y0), cut)
    # cast shadow: horizontal engraved lines in a flat ellipse, thinning outward
    sd = DR['bm']
    sh_cx, sh_cy, sw, shh = cx + R * 0.18, cy + R * 1.08, R * 0.95, R * 0.16
    k = 0
    yv = sh_cy - shh
    while yv < sh_cy + shh:
        t = (yv - sh_cy) / shh
        half = sw * math.sqrt(max(0, 1 - t * t))
        thick = max(1, int(S * (2.2 - 1.4 * abs(t))))
        if half > 6:
            sd.line([sh_cx - half, yv, sh_cx + half * 0.92, yv], fill=255, width=thick)
        yv += S * 4.2
    # seams: the tennis-ball curve on the unit sphere, turned to face us
    a, b = 0.7, 0.3
    def rot(p):
        x, y, z = p
        ax, az = math.radians(64), math.radians(-28)
        y, z = y * math.cos(ax) - z * math.sin(ax), y * math.sin(ax) + z * math.cos(ax)
        x, y = x * math.cos(az) - y * math.sin(az), x * math.sin(az) + y * math.cos(az)
        return np.array([x, y, z])
    def seam(t):
        return rot((a * math.cos(t) + b * math.cos(3 * t), a * math.sin(t) - b * math.sin(3 * t),
                    2 * math.sqrt(a * b) * math.sin(2 * t)))
    def scr(p): return (cx + R * p[0], cy + R * p[1])
    od = DR['om']
    N = 900
    pts = [seam(2 * math.pi * i / N) for i in range(N + 1)]
    for side in (-1, 1):
        for i in range(N):
            p, q = pts[i], pts[i + 1]
            if p[2] < 0.08 or q[2] < 0.08:
                continue
            T = q - p; T /= np.linalg.norm(T)
            B = np.cross(T, p); B /= np.linalg.norm(B)
            od.line([scr(p + side * 0.03 * B), scr(q + side * 0.03 * B)], fill=255, width=max(2, int(S * 1.1)))
    for i in range(0, N, 15):
        p = pts[i]
        if p[2] < 0.15:
            continue
        T = pts[i + 1] - p; T /= np.linalg.norm(T)
        B = np.cross(T, p); B /= np.linalg.norm(B)
        for side in (-1, 1):
            s0 = p + side * 0.03 * B
            s1 = p + side * 0.10 * B + T * 0.035
            od.line([scr(s0), scr(s1)], fill=255, width=int(S * 1.6))

# ---------------------------------------------------------------- textures
rng = np.random.default_rng(1969)

def lowres(cells_w, cells_h, seed):
    r = np.random.default_rng(seed)
    a = (r.random((cells_h, cells_w)) * 255).astype(np.uint8)
    return np.asarray(Image.fromarray(a).resize((W, H), Image.BICUBIC), float) / 255

def roughen(m, amt, blur, seed):
    """Irregular edges: blur the plate, add noise, threshold again."""
    b = np.asarray(m.filter(ImageFilter.GaussianBlur(blur)), float) / 255
    nz = lowres(W // 3, H // 3, seed)
    return np.clip((b + (nz - 0.5) * amt - 0.5) * 6 + 0.5, 0, 1)

def wood(m, seed):
    """Wood type ink film: salt (paper showing through), horizontal grain, heavier at the edges."""
    base = roughen(m, 0.55, 2.2, seed)
    grain = lowres(W // 220, H // 3, seed + 1)
    grain = np.clip((grain - 0.30) * 1.6, 0, 1)
    salt = lowres(W // 5, H // 5, seed + 2)
    salt = np.clip((salt - 0.72) * 5, 0, 1)
    blot = lowres(26, 34, seed + 3)
    cov = 1 - 0.30 * grain - 0.55 * salt - 0.22 * np.clip(blot - 0.45, 0, 1)
    ero = np.asarray(m.filter(ImageFilter.MinFilter(9)), float) / 255
    rim = np.clip(base - ero, 0, 1)
    cov = np.maximum(cov, rim * 0.97)
    return np.clip(base * cov, 0, 1)

def metal(m, seed):
    """Metal type and rules: a little ink spread, soft edges, gentle unevenness."""
    base = roughen(m, 0.28, 0.9, seed)
    blot = lowres(30, 40, seed + 5)
    fine = lowres(W // 6, H // 6, seed + 6)
    cov = 0.97 - 0.12 * np.clip(blot - 0.5, 0, 1) - 0.18 * np.clip(fine - 0.8, 0, 1) * 4
    return np.clip(base * np.clip(cov, 0.6, 1), 0, 1)

def pencil(m, seed):
    """Grease pencil: waxy, skips on the board grain, thick in the downstrokes."""
    base = np.asarray(m.filter(ImageFilter.GaussianBlur(1.2)), float) / 255
    streak = lowres(W // 3, H // 30, seed)
    skip = lowres(W // 4, H // 4, seed + 1)
    cov = 0.88 - 0.45 * np.clip(streak - 0.55, 0, 1) * 2 - 0.4 * np.clip(skip - 0.75, 0, 1) * 4
    return np.clip(base * np.clip(cov, 0.2, 1), 0, 1)

def shift(img, dx, dy, deg):
    return img.rotate(deg, resample=Image.BICUBIC, center=(W / 2, H / 2),
                      translate=(dx, dy))

def finish():
    blue = np.maximum(wood(M['bw'], 11), metal(M['bm'], 21))
    # second run: the orange plate lands a little off the blue
    ow = shift(M['ow'], 7, -5, 0.10)
    om = shift(M['om'], 7, -5, 0.10)
    orange = np.maximum(wood(ow, 31), metal(om, 41))
    # orange is the fugitive ink: a soft window fade, strongest up top where the sun came in
    fade = 1 - 0.16 * (1 - np.linspace(0, 1, H))[:, None] - 0.08 * lowres(8, 10, 77)
    orange = orange * np.clip(fade, 0.7, 1)
    blue = blue * np.clip(1 - 0.05 * (1 - np.linspace(0, 1, H))[:, None], 0.9, 1)
    pen = pencil(M['pen'], 51)
    # multiply the inks over white, then turn back into colour plus alpha for the paper div
    mult = np.ones((H, W, 3))
    for a, col in ((orange, ORANGE), (blue, BLUE), (pen, PENCIL)):
        mult *= 1 - a[..., None] * (1 - col / 255)
    alpha = 1 - (1 - orange) * (1 - blue) * (1 - pen)
    safe = np.maximum(alpha, 1e-4)[..., None]
    rgb = 1 - (1 - mult) / safe
    out = np.dstack([np.clip(rgb * 255, 0, 255), alpha * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, 'ink-card.png'), optimize=True)

# ---------------------------------------------------------------- page wear
def wear():
    """Soft sun yellowing and grimy edges for a card that sat in a shop window. 1x is plenty."""
    w, h = FW, FH
    r = np.random.default_rng(7)
    def soft(cw, ch, blur, seed):
        a = (np.random.default_rng(seed).random((ch, cw)) * 255).astype(np.uint8)
        return np.asarray(Image.fromarray(a).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur)), float) / 255
    top = (1 - np.linspace(0, 1, h))[:, None] * np.ones((1, w))
    a = 0.10 * top + 0.08 * soft(6, 8, 40, 3)
    yy, xx = np.mgrid[0:h, 0:w]
    e = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy)).astype(float)
    a += 0.22 * np.exp(-e / 14) * (0.6 + 0.6 * soft(14, 18, 6, 4))
    # one ring where a wet bottle stood on the sill against the card
    ring = Image.new('L', (w, h), 0)
    ImageDraw.Draw(ring).ellipse([w - 330, h - 282, w - 96, h - 50], outline=40, width=7)
    a += np.asarray(ring.filter(ImageFilter.GaussianBlur(5)), float) / 255
    col = np.array([150, 118, 62])
    out = np.dstack([np.broadcast_to(col, (h, w, 3)), np.clip(a, 0, 0.5) * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, 'wear-window.png'), optimize=True)
