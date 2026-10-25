"""Paints the printed faces of the MacMillan Toy Co. party pack (Big, 1988).

The pack is laid out like a 1988 toy carton printed by four-colour offset on white box board:
everything below is painted as four process plates (C, M, Y, K), screened as halftone dots at
the usual angles (C 15, M 75, Y 0, K 45), printed slightly out of register, then the die-cut
window, film glare and shelf wear go on top.

Writes assets/face-front.png and assets/face-back.png (2x, 1632 x 2112) and the wear overlays.
build.py sets the menu type over these."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageChops

from layout import W, H, F, B, PAPER, INKS

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FD = os.path.join(D, 'fonts')
S = 2                                  # output scale
OW, OH = W * S, H * S
CELL = 5.2                             # halftone cell in output px (a coarse box-board screen)
ANG = {'c': 15, 'm': 75, 'y': 0, 'k': 45}
SHIFT = {'c': (0.0, 0.0), 'm': (1.7, -0.9), 'y': (-1.3, 1.5), 'k': (0.7, 0.5)}   # misregistration, output px
STILL = os.path.join(A, 'still-piano.jpg')   # TMDB still, the floor-piano duet

BOWL = os.path.join(FD, 'BowlbyOne.ttf')
MICRO = os.path.join(FD, 'Michroma.ttf')
SP8 = os.path.join(FD, 'LeagueSpartan-800.ttf')
SP7 = os.path.join(FD, 'LeagueSpartan-700.ttf')


def font(path, px):
    return ImageFont.truetype(path, int(px * S))


# ------------------------------------------------------------------ plate canvas
class Plates:
    def __init__(self):
        self.p = {k: np.zeros((OH, OW), np.float32) for k in 'cmyk'}

    def fill(self, mask, c=0, m=0, y=0, k=0):
        """Lay ink percentages through an L mask. Unlisted inks are knocked out (white board)."""
        a = np.asarray(mask, np.float32) / 255.0
        for name, v in (('c', c), ('m', m), ('y', y), ('k', k)):
            v = v / 100.0 if np.isscalar(v) else v
            self.p[name] = self.p[name] * (1 - a) + v * a

    def overprint(self, mask, k=100):
        """Black overprints whatever is under it (keylines, type)."""
        a = np.asarray(mask, np.float32) / 255.0
        self.p['k'] = np.maximum(self.p['k'], a * k / 100.0)

    def place_rgb(self, img, x, y, mask=None):
        """Separate an RGB(A) painting into the four plates and place it at output px (x, y)."""
        img = img.convert('RGBA')
        arr = np.asarray(img, np.float32) / 255.0
        r, g, b, al = arr[..., 0], arr[..., 1], arr[..., 2], arr[..., 3]
        if mask is not None:
            al = al * (np.asarray(mask, np.float32) / 255.0)
        c, m, yy = 1 - r, 1 - g, 1 - b
        k = np.minimum(np.minimum(c, m), yy) * 0.72
        d = np.maximum(1 - k, 1e-4)
        sep = {'c': (c - k) / d, 'm': (m - k) / d, 'y': (yy - k) / d, 'k': k}
        h, w = al.shape
        for n in 'cmyk':
            reg = self.p[n][y:y + h, x:x + w]
            self.p[n][y:y + h, x:x + w] = reg * (1 - al) + np.clip(sep[n], 0, 1) * al


def L():
    return Image.new('L', (OW, OH), 0)


def rect_mask(box, r=0):
    m = L()
    x0, y0, x1, y1 = [v * S for v in box]
    if r:
        ImageDraw.Draw(m).rounded_rectangle([x0, y0, x1 - 1, y1 - 1], r * S, fill=255)
    else:
        ImageDraw.Draw(m).rectangle([x0, y0, x1 - 1, y1 - 1], fill=255)
    return m


def outline_mask(box, w=1.5, r=0):
    m = L()
    x0, y0, x1, y1 = [v * S for v in box]
    if r:
        ImageDraw.Draw(m).rounded_rectangle([x0, y0, x1 - 1, y1 - 1], r * S, outline=255, width=int(w * S))
    else:
        ImageDraw.Draw(m).rectangle([x0, y0, x1 - 1, y1 - 1], outline=255, width=int(w * S))
    return m


def shear(m, k, ybase):
    """Lean a mask to the right by k (photo-typesetting oblique, the way 1980s package type was set)."""
    return m.transform(m.size, Image.AFFINE, (1, k, -k * ybase, 0, 1, 0), resample=Image.BICUBIC)


def text_mask(txt, fnt, x, y, stroke=0, k=0.0, spacing=0):
    m = L()
    d = ImageDraw.Draw(m)
    if spacing:
        cx = x * S
        for ch in txt:
            d.text((cx, y * S), ch, font=fnt, fill=255, stroke_width=int(stroke * S), stroke_fill=255)
            cx += fnt.getlength(ch) + spacing * S
    else:
        d.text((x * S, y * S), txt, font=fnt, fill=255, stroke_width=int(stroke * S), stroke_fill=255)
    if k:
        bb = fnt.getbbox(txt)
        m = shear(m, k, y * S + bb[3])
    return m


def union_shift(m, dx, dy, steps):
    out = m.copy()
    for i in range(1, steps + 1):
        out = ImageChops.lighter(out, ImageChops.offset(m, int(round(dx * i / steps)), int(round(dy * i / steps))))
    return out


def dilate(m, px):
    n = int(px * S) | 1
    return m.filter(ImageFilter.MaxFilter(n)) if n > 1 else m


def logotype(pl, txt, fnt, x, y, k=0.2, fill='yellow', stroke=4, extr=(7, 9), outer=4):
    """1980s toy-box logotype: fill, red keyline, deep blue extrusion, white outer keyline."""
    body = text_mask(txt, fnt, x, y, 0, k)
    st = text_mask(txt, fnt, x, y, stroke, k)
    ex = union_shift(st, extr[0] * S, extr[1] * S, 14)
    pl.fill(dilate(ex, outer * 2), 0, 0, 0, 0)                          # white outer keyline (knockout)
    pl.fill(ex, 100, 85, 0, 45)                                         # extrusion
    pl.fill(st, 0, 100, 100, 0)                                         # red keyline
    if fill == 'yellow':
        bb = body.getbbox()
        grad = np.zeros((OH, OW), np.float32)
        if bb:
            y0, y1 = bb[1], bb[3]
            t = np.clip((np.arange(OH) - y0) / max(1, y1 - y0), 0, 1)[:, None]
            grad = np.broadcast_to(np.clip((t - 0.45) * 0.62, 0, 0.34), (OH, OW)).astype(np.float32)
        pl.fill(body, 0, grad, 100, 0)                                  # chrome-yellow, warming to orange low down
        # a thin white highlight line along the top of each letter
        hl = ImageChops.subtract(body, ImageChops.offset(body, 0, int(4 * S)))
        hl = ImageChops.multiply(hl, text_mask(txt, fnt, x, y, -0, k).filter(ImageFilter.MinFilter(3)))
        pl.fill(hl.point(lambda v: int(v * 0.85)), 0, 0, 0, 0)
    elif fill == 'white':
        pl.fill(body, 0, 0, 0, 0)
    elif fill == 'red':
        pl.fill(body, 0, 100, 100, 0)


# ------------------------------------------------------------------ halftone and press
def halftone(cov, ang, cell=CELL, ss=2):
    """Round-dot AM screen. cov is 0..1 at output size; returns antialiased ink coverage."""
    h, w = cov.shape
    big = np.asarray(Image.fromarray(cov.astype(np.float32), 'F').resize((w * ss, h * ss), Image.BILINEAR))
    yy, xx = np.mgrid[0:h * ss, 0:w * ss].astype(np.float32)
    a = math.radians(ang)
    f = 2 * math.pi / (cell * ss)
    u = (xx * math.cos(a) + yy * math.sin(a)) * f
    v = (-xx * math.sin(a) + yy * math.cos(a)) * f
    del xx, yy
    th = 0.5 - 0.25 * (np.cos(u) + np.cos(v))
    del u, v
    dots = (big > th).astype(np.float32)
    dots[big >= 0.985] = 1.0
    dots[big <= 0.015] = 0.0
    return dots.reshape(h, ss, w, ss).mean(axis=(1, 3))


def mottle(seed, lo=0.9):
    rnd = np.random.RandomState(seed)
    n = rnd.rand(OH // 64 + 2, OW // 64 + 2).astype(np.float32)
    im = Image.fromarray((n * 255).astype(np.uint8)).resize((OW, OH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    return lo + (1 - lo) * (np.asarray(im, np.float32) / 255.0)


def press(pl, seed):
    """Screen each plate, print it a hair out of register with a little ink spread, and composite."""
    out = np.ones((OH, OW, 3), np.float32) * (np.array(PAPER, np.float32) / 255.0)
    for i, n in enumerate('cmyk'):
        dots = halftone(np.clip(pl.p[n], 0, 1), ANG[n])
        im = Image.fromarray((dots * 255 + 0.5).astype(np.uint8), 'L')
        dx, dy = SHIFT[n]
        im = im.transform(im.size, Image.AFFINE, (1, 0, -dx, 0, 1, -dy), resample=Image.BILINEAR)
        im = im.filter(ImageFilter.GaussianBlur(0.45))          # ink spread on board
        a = np.asarray(im, np.float32) / 255.0 * mottle(seed + i)
        T = np.array(INKS[n], np.float32)
        out *= 1 - a[..., None] * (1 - T)
    return Image.fromarray((np.clip(out, 0, 1) * 255).astype(np.uint8), 'RGB')


# ------------------------------------------------------------------ the window painting (airbrush, RGB)
def soft(img, r):
    return img.filter(ImageFilter.GaussianBlur(r))


def paint_window(aw, ah, seed=88):
    rnd = random.Random(seed)
    art = Image.new('RGBA', (aw, ah), (0, 0, 0, 255))
    hz = int(ah * 0.50)
    # airbrushed backdrop: night blue to a magenta glow at the horizon, dark floor below
    g = np.zeros((ah, aw, 3), np.float32)
    for yv in range(ah):
        if yv < hz:
            t = (yv / hz) ** 1.6
            c = np.array([20, 26, 96]) * (1 - t) + np.array([196, 70, 160]) * t
        else:
            t = (yv - hz) / (ah - hz)
            c = np.array([58, 30, 112]) * (1 - t) + np.array([18, 14, 58]) * t
        g[yv] = c
    art = Image.fromarray(g.astype(np.uint8), 'RGB').convert('RGBA')
    # perspective grid on the floor
    grid = Image.new('L', (aw, ah), 0)
    gd = ImageDraw.Draw(grid)
    vx = aw * 0.5
    for i in range(-14, 15):
        gd.line([(vx, hz), (vx + i * aw * 0.16, ah * 1.6)], fill=200, width=3)
    for j in range(1, 12):
        yv = hz + (ah - hz) * (j / 11) ** 2.1
        gd.line([(0, yv), (aw, yv)], fill=200, width=3)
    fade = Image.linear_gradient('L').resize((aw, ah)).point(lambda v: min(255, int(v * 1.5)))
    grid = ImageChops.multiply(grid, fade)
    gl = Image.new('RGBA', (aw, ah), (110, 210, 255, 0)); gl.putalpha(soft(grid, 1.2))
    art.alpha_composite(gl)
    hzl = Image.new('L', (aw, ah), 0); ImageDraw.Draw(hzl).rectangle([0, hz - 3, aw, hz + 3], fill=220)
    glow = Image.new('RGBA', (aw, ah), (255, 190, 230, 0)); glow.putalpha(soft(hzl, 6))
    art.alpha_composite(glow)
    # airbrush stars
    st = Image.new('L', (aw, ah), 0); sd = ImageDraw.Draw(st)
    for _ in range(70):
        x, y, r = rnd.randint(0, aw), rnd.randint(0, int(hz * 0.85)), rnd.choice((2, 2, 3, 4))
        sd.ellipse([x - r, y - r, x + r, y + r], fill=rnd.randint(120, 230))
    stars = Image.new('RGBA', (aw, ah), (255, 255, 255, 0)); stars.putalpha(soft(st, 1.1))
    art.alpha_composite(stars)

    # ---- the giant cookie, painted flat then laid down in perspective
    R = 360
    flat = Image.new('RGBA', (2 * R, 2 * R), (0, 0, 0, 0))
    yy, xx = np.mgrid[0:2 * R, 0:2 * R].astype(np.float32)
    rr = np.sqrt((xx - R) ** 2 + (yy - R) ** 2) / R
    noise = np.asarray(soft(Image.fromarray((np.random.RandomState(7).rand(2 * R, 2 * R) * 255).astype(np.uint8)), 9), np.float32) / 255
    noise2 = np.asarray(soft(Image.fromarray((np.random.RandomState(8).rand(2 * R, 2 * R) * 255).astype(np.uint8)), 3), np.float32) / 255
    light = 1.0 - 0.28 * np.clip(rr, 0, 1) ** 2.4 + 0.10 * ((R - xx) + (R - yy)) / (2 * R)
    base = np.stack([np.full_like(rr, 214), np.full_like(rr, 156), np.full_like(rr, 86)], -1)
    col = base * (light * (0.86 + 0.30 * noise) * (0.95 + 0.1 * noise2))[..., None]
    alpha = np.clip((1.0 - rr) * R / 2.0, 0, 1) * 255
    flat = Image.fromarray(np.dstack([np.clip(col, 0, 255), alpha]).astype(np.uint8), 'RGBA')
    fd = ImageDraw.Draw(flat)
    # chips
    band = (-0.30 * R, 0.30 * R)
    for _ in range(46):
        for _try in range(30):
            ang = rnd.random() * 2 * math.pi
            dist = math.sqrt(rnd.random()) * 0.86 * R
            cx, cy = R + dist * math.cos(ang), R + dist * math.sin(ang)
            if not (band[0] - 20 < cy - R < band[1] + 20):
                break
        rad = rnd.randint(13, 22)
        pts = [(cx + rad * (0.7 + 0.5 * rnd.random()) * math.cos(t), cy + rad * (0.6 + 0.5 * rnd.random()) * math.sin(t))
               for t in [i * 2 * math.pi / 7 for i in range(7)]]
        sh = Image.new('L', flat.size, 0); ImageDraw.Draw(sh).polygon([(px + 4, py + 6) for px, py in pts], fill=120)
        shl = Image.new('RGBA', flat.size, (60, 30, 10, 0)); shl.putalpha(ImageChops.multiply(soft(sh, 4), flat.getchannel('A')))
        flat.alpha_composite(shl)
        fd = ImageDraw.Draw(flat)
        fd.polygon(pts, fill=(62, 36, 24, 255))
        fd.ellipse([cx - rad * 0.45, cy - rad * 0.5, cx - rad * 0.05, cy - rad * 0.15], fill=(128, 88, 66, 255))
    # icing keyboard piped across the middle
    keys = Image.new('RGBA', flat.size, (0, 0, 0, 0))
    kd = ImageDraw.Draw(keys)
    kshadow = Image.new('L', flat.size, 0); ksd = ImageDraw.Draw(kshadow)
    n = 13
    x0, x1 = R - 0.88 * R, R + 0.88 * R
    kw = (x1 - x0) / n
    ky0, ky1 = R + band[0], R + band[1]
    for i in range(n):
        a0, a1 = x0 + i * kw + 4 + rnd.uniform(-2, 2), x0 + (i + 1) * kw - 4 + rnd.uniform(-2, 2)
        t0, t1 = ky0 + rnd.uniform(-4, 4), ky1 + rnd.uniform(-6, 6)
        ksd.rounded_rectangle([a0 + 5, t0 + 8, a1 + 5, t1 + 8], 14, fill=150)
        kd.rounded_rectangle([a0, t0, a1, t1], 14, fill=(250, 247, 238, 255))
        kd.rounded_rectangle([a0 + 6, ky0 + 6, a0 + 14, ky1 - 14], 4, fill=(255, 255, 255, 255))
        kd.line([(a1 - 3, ky0 + 10), (a1 - 3, ky1 - 6)], fill=(214, 206, 192, 255), width=4)
    blacks = [0, 1, 3, 4, 5, 7, 8, 10, 11]
    for i in blacks:
        cx = x0 + (i + 1) * kw
        bw = kw * 0.56
        ksd.rounded_rectangle([cx - bw / 2 + 5, ky0 - 2 + 8, cx + bw / 2 + 5, ky0 + (ky1 - ky0) * 0.58 + 8], 7, fill=170)
        kd.rounded_rectangle([cx - bw / 2, ky0 - 2, cx + bw / 2, ky0 + (ky1 - ky0) * 0.58], 7, fill=(46, 28, 22, 255))
        kd.rounded_rectangle([cx - bw / 2 + 5, ky0 + 4, cx - bw / 2 + 10, ky0 + (ky1 - ky0) * 0.45], 3, fill=(120, 92, 80, 255))
    clip = Image.new('L', flat.size, 0); ImageDraw.Draw(clip).ellipse([R - 0.93 * R, R - 0.93 * R, R + 0.93 * R, R + 0.93 * R], fill=255)
    ksl = Image.new('RGBA', flat.size, (40, 20, 6, 0)); ksl.putalpha(ImageChops.multiply(soft(kshadow, 6), clip))
    flat.alpha_composite(ksl)
    keys.putalpha(ImageChops.multiply(keys.getchannel('A'), clip))
    flat.alpha_composite(keys)
    # lay it down
    sq = 0.40
    cw, ch = 2 * R, int(2 * R * sq)
    top = flat.resize((cw, ch), Image.LANCZOS)
    ccx, ccy = int(aw * 0.385), int(ah * 0.60)
    thick = 30
    # floor shadow
    shd = Image.new('L', (aw, ah), 0)
    ImageDraw.Draw(shd).ellipse([ccx - R * 1.02, ccy - ch / 2 + thick + 10, ccx + R * 1.06, ccy + ch / 2 + thick + 34], fill=200)
    shl = Image.new('RGBA', (aw, ah), (6, 4, 20, 0)); shl.putalpha(soft(shd, 22))
    art.alpha_composite(shl)
    # baked edge
    edge = Image.new('RGBA', (aw, ah), (0, 0, 0, 0)); ed = ImageDraw.Draw(edge)
    for t in range(thick, 0, -1):
        f = 0.62 + 0.25 * (1 - t / thick)
        ed.ellipse([ccx - R, ccy - ch / 2 + t, ccx + R, ccy + ch / 2 + t], fill=(int(176 * f), int(110 * f), int(52 * f), 255))
    # light from the left on the edge
    lm = Image.new('L', (aw, ah), 0); ImageDraw.Draw(lm).ellipse([ccx - R - 40, ccy - 40, ccx - R * 0.2, ccy + ch], fill=90)
    hl = Image.new('RGBA', (aw, ah), (255, 220, 170, 0)); hl.putalpha(ImageChops.multiply(soft(lm, 30), edge.getchannel('A')))
    edge.alpha_composite(hl)
    art.alpha_composite(edge)
    art.alpha_composite(top, (ccx - R, ccy - ch // 2))

    # ---- egg cream glass
    gx, gt, gb = int(aw * 0.83), 46, ah - 50
    tw, bw = 116, 92
    poly = [(gx - tw, gt), (gx + tw, gt), (gx + bw, gb), (gx - bw, gb)]
    gshd = Image.new('L', (aw, ah), 0)
    ImageDraw.Draw(gshd).ellipse([gx - bw - 30, gb - 18, gx + bw + 60, gb + 26], fill=210)
    gs = Image.new('RGBA', (aw, ah), (6, 4, 20, 0)); gs.putalpha(soft(gshd, 14))
    art.alpha_composite(gs)
    # straw first (behind the front wall of glass)
    straw = Image.new('RGBA', (aw, ah), (0, 0, 0, 0)); sdr = ImageDraw.Draw(straw)
    sx0, sy0, sx1, sy1 = gx + 30, gt + 150, gx + 120, 2
    L_ = math.hypot(sx1 - sx0, sy1 - sy0)
    segs = int(L_ // 20)
    for i in range(segs):
        t0, t1 = i / segs, (i + 1) / segs
        sdr.line([(sx0 + (sx1 - sx0) * t0, sy0 + (sy1 - sy0) * t0), (sx0 + (sx1 - sx0) * t1, sy0 + (sy1 - sy0) * t1)],
                 fill=(214, 36, 44, 255) if i % 2 else (250, 248, 244, 255), width=17)
    art.alpha_composite(straw)
    gm = Image.new('L', (aw, ah), 0); ImageDraw.Draw(gm).polygon(poly, fill=255)
    # liquid: chocolate milk under a white head
    liq = np.zeros((ah, aw, 3), np.float32)
    foam_top, foam_bot = gt + 64, gt + 64 + 120
    for yv in range(ah):
        if yv < foam_bot:
            t = (yv - foam_top) / (foam_bot - foam_top)
            c = np.array([250, 244, 230]) * (1 - t * 0.18) + np.array([200, 160, 120]) * (t ** 3) * 0.18
        else:
            t = (yv - foam_bot) / (gb - foam_bot)
            c = np.array([138, 88, 54]) * (1 - t) + np.array([82, 48, 30]) * t
        liq[yv] = c
    xs = (np.arange(aw) - gx) / tw
    shade = (1 - 0.30 * np.clip(xs, -1, 1) ** 2 + 0.08 * np.clip(-xs, 0, 1))[None, :, None]
    liqi = Image.fromarray(np.clip(liq * shade, 0, 255).astype(np.uint8), 'RGB').convert('RGBA')
    lm = Image.new('L', (aw, ah), 0)
    inset = [(gx - tw + 9, foam_top), (gx + tw - 9, foam_top), (gx + bw - 9, gb - 22), (gx - bw + 9, gb - 22)]
    ImageDraw.Draw(lm).polygon(inset, fill=255)
    ImageDraw.Draw(lm).ellipse([gx - tw + 9, foam_top - 16, gx + tw - 9, foam_top + 16], fill=255)
    liqi.putalpha(lm)
    # foam bubbles
    bd = ImageDraw.Draw(liqi)
    for _ in range(60):
        bx = rnd.randint(gx - tw + 20, gx + tw - 20); by = rnd.randint(foam_top - 8, foam_bot - 10)
        r = rnd.randint(3, 7)
        bd.ellipse([bx - r, by - r, bx + r, by + r], outline=(222, 210, 190, 255), width=2)
    liqi.putalpha(lm)
    art.alpha_composite(liqi)
    # straw again where it rises out of the foam
    sm = Image.new('L', (aw, ah), 0); ImageDraw.Draw(sm).rectangle([0, 0, aw, foam_top - 4], fill=255)
    straw2 = straw.copy(); straw2.putalpha(ImageChops.multiply(straw.getchannel('A'), sm))
    art.alpha_composite(straw2)
    # glass: faint tint, rim, highlights
    tint = Image.new('RGBA', (aw, ah), (200, 220, 255, 0)); tint.putalpha(gm.point(lambda v: int(v * 0.12)))
    art.alpha_composite(tint)
    rim = Image.new('L', (aw, ah), 0); rd = ImageDraw.Draw(rim)
    rd.ellipse([gx - tw, gt - 16, gx + tw, gt + 16], outline=255, width=4)
    rd.line(poly[1:3], fill=170, width=4); rd.line([poly[3], poly[0]], fill=170, width=4)
    rd.ellipse([gx - bw, gb - 22, gx + bw, gb + 10], outline=200, width=6)
    rl = Image.new('RGBA', (aw, ah), (235, 244, 255, 0)); rl.putalpha(soft(rim, 1.2))
    art.alpha_composite(rl)
    hlm = Image.new('L', (aw, ah), 0); hd = ImageDraw.Draw(hlm)
    hd.polygon([(gx - tw + 26, gt + 30), (gx - tw + 50, gt + 30), (gx - bw + 44, gb - 40), (gx - bw + 24, gb - 40)], fill=150)
    hd.polygon([(gx + tw - 34, gt + 40), (gx + tw - 26, gt + 40), (gx + bw - 22, gb - 60), (gx + bw - 28, gb - 60)], fill=120)
    hlw = Image.new('RGBA', (aw, ah), (255, 255, 255, 0)); hlw.putalpha(soft(hlm, 5))
    art.alpha_composite(hlw)

    # airbrush glints
    def glint(x, y, s):
        gmk = Image.new('L', (aw, ah), 0); gdd = ImageDraw.Draw(gmk)
        gdd.polygon([(x - s, y), (x, y - s * 0.12), (x + s, y), (x, y + s * 0.12)], fill=255)
        gdd.polygon([(x, y - s * 0.8), (x + s * 0.1, y), (x, y + s * 0.8), (x - s * 0.1, y)], fill=255)
        gdd.ellipse([x - s * 0.22, y - s * 0.22, x + s * 0.22, y + s * 0.22], fill=200)
        gw = Image.new('RGBA', (aw, ah), (255, 255, 255, 0)); gw.putalpha(ImageChops.lighter(soft(gmk, 1.2), soft(gmk, 8).point(lambda v: v // 2)))
        art.alpha_composite(gw)
    glint(gx - tw + 6, gt - 4, 46)
    glint(ccx - R * 0.55, ccy - ch * 0.38, 40)
    glint(gx + bw - 20, gb - 70, 26)
    return art


# ------------------------------------------------------------------ barcode
def upc_mask(x, y, digits='01988008800'):
    s = sum(int(d) * (3 if i % 2 == 0 else 1) for i, d in enumerate(digits))
    digits += str((10 - s % 10) % 10)
    Lc = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011']
    Rc = [''.join('1' if b == '0' else '0' for b in c) for c in Lc]
    bits = '101' + ''.join(Lc[int(d)] for d in digits[:6]) + '01010' + ''.join(Rc[int(d)] for d in digits[6:]) + '101'
    guard = set(list(range(0, 3)) + list(range(45, 50)) + list(range(92, 95)) + list(range(3, 10)) + list(range(85, 92)))
    m = L(); d = ImageDraw.Draw(m)
    mod = 1.25 * S
    X = (x + 10) * S
    for i, b in enumerate(bits):
        if b == '1':
            hgt = 58 if i in guard else 50
            d.rectangle([X + i * mod, y * S, X + (i + 1) * mod - 0.5, (y + hgt) * S], fill=255)
    f = font(SP7, 12)
    d.text(((x + 1) * S, (y + 48) * S), digits[0], font=f, fill=255)
    d.text((X + 12 * mod, (y + 51) * S), digits[1:6], font=f, fill=255)
    d.text((X + 50 * mod, (y + 51) * S), digits[6:11], font=f, fill=255)
    d.text((X + 96 * mod, (y + 48) * S), digits[11], font=f, fill=255)
    return m, 95 * 1.25 + 22, digits


# ------------------------------------------------------------------ faces
def bg_blue(pl, seed):
    """Process blue box colour with an airbrushed glow behind the logotype."""
    yy, xx = np.mgrid[0:OH, 0:OW].astype(np.float32)
    d = np.sqrt(((xx - OW * 0.42) / OW) ** 2 + ((yy - OH * 0.27) / OH) ** 2)
    t = np.clip(d / 0.75, 0, 1)
    m = 0.42 + 0.48 * t
    k = 0.02 + 0.30 * t ** 1.5
    pl.fill(Image.new('L', (OW, OH), 255), 100, m, 0, k)
    # a printed pinstripe grid, the kind every action-figure box carried
    g = L(); gd = ImageDraw.Draw(g)
    for xv in range(0, OW, 32 * S):
        gd.line([(xv, 0), (xv, OH)], fill=255, width=S)
    for yv in range(0, OH, 32 * S):
        gd.line([(0, yv), (OW, yv)], fill=255, width=S)
    a = np.asarray(g, np.float32) / 255 * 0.55
    pl.p['m'] = pl.p['m'] * (1 - a) + (pl.p['m'] * 0.45) * a
    pl.p['k'] = pl.p['k'] * (1 - a)


def front():
    pl = Plates()
    bg_blue(pl, 1)
    # red maker's band with a yellow rule
    pl.fill(rect_mask(F['banner']), 0, 100, 100, 0)
    x0, y0, x1, y1 = F['banner']
    pl.fill(rect_mask((0, y1, W, y1 + 6)), 0, 0, 100, 0)
    pl.fill(rect_mask((0, y1 + 6, W, y1 + 8)), 100, 85, 0, 45)
    # MacMillan maker's logo: white, black drop, leaning
    f = font(BOWL, 62)
    sh = text_mask('MacMillan', f, 50 + 4, 30 + 4, 0, 0.18)
    pl.fill(sh, 0, 100, 100, 100)
    pl.fill(text_mask('MacMillan', f, 50, 30, 0, 0.18), 0, 0, 0, 0)
    fm = font(MICRO, 17)
    pl.fill(text_mask('TOY CO.', fm, 448, 40, 0, 0), 0, 0, 0, 0)
    pl.fill(text_mask('NEW YORK, N.Y.', font(MICRO, 13), 448, 66, 0, 0), 0, 0, 100, 0)
    fs = font(MICRO, 13)
    for i, t in enumerate(('ITEM NO. 8800', 'PARTY PACK')):
        w = fs.getlength(t) / S
        pl.fill(text_mask(t, fs, 776 - w, 40 + i * 24, 0, 0), 0, 0, 0, 0)
    # yellow ribbon
    fx0, fy0, fx1, fy1 = F['flag']
    rib = L(); ImageDraw.Draw(rib).polygon([((fx0 + 18) * S, fy0 * S), (fx1 * S, fy0 * S), (fx1 * S, fy1 * S), (fx0 * S, fy1 * S)], fill=255)
    pl.fill(dilate(rib, 3), 0, 0, 0, 0)
    pl.fill(rib, 0, 8, 100, 0)
    pl.fill(text_mask('NEW FOR 1988!', font(BOWL, 25), fx0 + 36, fy0 + 7, 0, 0.18), 0, 100, 100, 0)
    # product logotype
    cx, cy = F['company']
    logotype(pl, 'THE COMPANY', font(BOWL, 46), cx, cy, k=0.2, fill='white', stroke=3, extr=(4, 5), outer=3)
    px, py = F['party']
    logotype(pl, 'PARTY', font(BOWL, 140), px, py, k=0.2, fill='yellow', stroke=5, extr=(9, 11), outer=5)
    # age box
    ax0, ay0, ax1, ay1 = F['age']
    pl.fill(rect_mask((ax0 + 5, ay0 + 5, ax1 + 5, ay1 + 5)), 100, 85, 0, 60)
    pl.fill(rect_mask(F['age']), 0, 0, 0, 0)
    pl.overprint(outline_mask(F['age'], 3))
    pl.fill(rect_mask((ax0, ay0, ax1, ay0 + 30)), 0, 0, 0, 100)
    fa = font(MICRO, 14)
    wa = fa.getlength('AGES') / S
    pl.fill(text_mask('AGES', fa, (ax0 + ax1) / 2 - wa / 2, ay0 + 6), 0, 0, 0, 0)
    fn, fu = font(BOWL, 46), font(BOWL, 18)
    wn, wu = fn.getlength('30') / S, fu.getlength('& UP') / S
    lx = (ax0 + ax1) / 2 - (wn + 6 + wu) / 2
    pl.fill(text_mask('30', fn, lx, ay0 + 22), 0, 100, 100, 0)
    pl.fill(text_mask('& UP', fu, lx + wn + 6, ay0 + 46), 0, 0, 0, 100)
    fe = font(SP7, 13)
    for i, t in enumerate(('Some exceptions', 'apply.')):
        we = fe.getlength(t) / S
        pl.fill(text_mask(t, fe, (ax0 + ax1) / 2 - we / 2, ay0 + 88 + i * 16), 0, 0, 0, 100)
    # window: white printed surround and black keyline, art inside
    wx0, wy0, wx1, wy1 = F['window']
    pl.fill(rect_mask((wx0 - 8, wy0 - 8, wx1 + 8, wy1 + 8), 26), 0, 0, 0, 0)
    pl.overprint(outline_mask((wx0 - 8, wy0 - 8, wx1 + 8, wy1 + 8), 2.5, 26))
    aw, ah = (wx1 - wx0) * S, (wy1 - wy0) * S
    art = paint_window(aw, ah)
    pl.place_rgb(art, wx0 * S, wy0 * S, rect_mask((0, 0, wx1 - wx0, wy1 - wy0), 18).crop((0, 0, aw, ah)))
    # bottom panel: plain white board, black keyline, red header bar
    pl.fill(rect_mask(F['panel']), 0, 0, 0, 0)
    pl.overprint(outline_mask(F['panel'], 3))
    bx0, by0, bx1, by1 = F['panel']
    pl.fill(rect_mask((bx0, by0, bx1, by0 + 42)), 0, 100, 100, 0)
    pl.overprint(outline_mask(F['panel'], 3))
    pl.fill(text_mask('PASSED ON TRAYS', font(BOWL, 24), bx0 + 22, by0 + 7, 0, 0.18), 0, 0, 0, 0)
    t = 'NO. 8801 TO 8803'
    pl.fill(text_mask(t, fs, bx1 - 22 - fs.getlength(t) / S, by0 + 14), 0, 0, 100, 0)
    # thin cyan tint rule above the footer line inside the panel
    pl.fill(rect_mask((bx0 + 22, by1 - 40, bx1 - 22, by1 - 38)), 100, 85, 0, 45)
    img = press(pl, 10)
    return finish_window(img)


def finish_window(img):
    """Die-cut window: the cut board edge, its shadow on the tray behind, and glare on the film."""
    wx0, wy0, wx1, wy1 = F['window']
    wm = rect_mask(F['window'], 18)
    rgba = img.convert('RGBA')
    # inner shadow from the board thickness (top and left)
    inner = ImageChops.subtract(wm, ImageChops.offset(wm, 7 * S, 9 * S))
    sh = Image.new('RGBA', rgba.size, (10, 8, 30, 0)); sh.putalpha(ImageChops.multiply(soft(inner, 5 * S).point(lambda v: int(v * 0.75)), wm))
    rgba.alpha_composite(sh)
    # white cut edge of the board
    edge = ImageChops.subtract(dilate(wm, 1.2), wm)
    ew = Image.new('RGBA', rgba.size, (252, 250, 244, 0)); ew.putalpha(edge)
    rgba.alpha_composite(ew)
    # acetate glare, two diagonal sweeps
    gl = L(); gd = ImageDraw.Draw(gl)
    for x, w_, a in ((wx0 + 90, 70, 60), (wx0 + 190, 22, 70), (wx0 + 560, 40, 38)):
        gd.polygon([((x) * S, wy0 * S), ((x + w_) * S, wy0 * S), ((x + w_ - 150) * S, wy1 * S), ((x - 150) * S, wy1 * S)], fill=a)
    gl = ImageChops.multiply(soft(gl, 6 * S), wm)
    gw = Image.new('RGBA', rgba.size, (255, 255, 255, 0)); gw.putalpha(gl)
    rgba.alpha_composite(gw)
    return rgba.convert('RGB')


def halftone_photo(path, w, h):
    im = Image.open(path).convert('RGB')
    iw, ih = im.size
    tr = w / h
    if iw / ih > tr:
        nw = int(ih * tr); x = int((iw - nw) * 0.55); im = im.crop((x, 0, x + nw, ih))
    else:
        nh = int(iw / tr); im = im.crop((0, 0, iw, nh))
    im = im.resize((w, h), Image.LANCZOS)
    from PIL import ImageEnhance
    im = ImageEnhance.Contrast(im).enhance(1.12)
    im = ImageEnhance.Color(im).enhance(1.08)
    return im


def back():
    pl = Plates()
    bg_blue(pl, 2)
    # yellow band, red rule
    pl.fill(rect_mask(B['banner']), 0, 8, 100, 0)
    y1 = B['banner'][3]
    pl.fill(rect_mask((0, y1, W, y1 + 6)), 0, 100, 100, 0)
    pl.fill(rect_mask((0, y1 + 6, W, y1 + 8)), 100, 85, 0, 45)
    logotype(pl, 'LOOK WHAT’S INSIDE!', font(BOWL, 44), 46, 30, k=0.2, fill='red', stroke=0.01, extr=(5, 6), outer=3)
    fs = font(MICRO, 13)
    for i, t in enumerate(('ITEM NO. 8800', 'PARTY PACK')):
        w = fs.getlength(t) / S
        pl.fill(text_mask(t, fs, 776 - w, 44 + i * 24), 100, 85, 0, 45)
    # white panels with keylines
    for key in ('menu', 'photo_panel', 'note'):
        pl.fill(rect_mask(B[key]), 0, 0, 0, 0)
        pl.overprint(outline_mask(B[key], 3))
    # menu centre rule
    mx0, my0, mx1, my1 = B['menu']
    mid = (mx0 + mx1) // 2
    pl.fill(rect_mask((mid - 1, my0 + 22, mid + 2, my1 - 22)), 0, 0, 100, 0)
    # how to play: solid yellow
    pl.fill(rect_mask(B['play']), 0, 8, 100, 0)
    pl.overprint(outline_mask(B['play'], 3))
    # collect panel: light cyan tint
    pl.fill(rect_mask(B['check']), 28, 0, 6, 0)
    pl.overprint(outline_mask(B['check'], 3))
    # token: white with a dashed cut line
    tx0, ty0, tx1, ty1 = B['token']
    pl.fill(rect_mask(B['token']), 0, 0, 0, 0)
    dm = L(); dd = ImageDraw.Draw(dm)
    def dash(p0, p1):
        (a, b), (c, d) = p0, p1
        n = int(math.hypot(c - a, d - b) / 10)
        for i in range(0, n, 2):
            dd.line([((a + (c - a) * i / n) * S, (b + (d - b) * i / n) * S), ((a + (c - a) * (i + 1) / n) * S, (b + (d - b) * (i + 1) / n) * S)], fill=255, width=int(2.5 * S))
    dash((tx0, ty0), (tx1, ty0)); dash((tx1, ty0), (tx1, ty1)); dash((tx1, ty1), (tx0, ty1)); dash((tx0, ty1), (tx0, ty0))
    pl.overprint(dm)
    # scissors on the cut line
    sc = L(); sd = ImageDraw.Draw(sc)
    sx, sy = (tx0 + 28) * S, ty0 * S
    for oy in (-7, 7):
        sd.ellipse([sx - 16 * S, sy + oy * S - 5 * S, sx - 6 * S, sy + oy * S + 5 * S], outline=255, width=int(2.2 * S))
    sd.line([(sx - 6 * S, sy - 5 * S), (sx + 16 * S, sy + 4 * S)], fill=255, width=int(2.4 * S))
    sd.line([(sx - 6 * S, sy + 5 * S), (sx + 16 * S, sy - 4 * S)], fill=255, width=int(2.4 * S))
    pl.fill(dilate(sc, 4), 0, 0, 0, 0)
    pl.overprint(sc)
    # photo, four-colour halftone
    px0, py0, px1, py1 = B['photo']
    ph = halftone_photo(STILL, (px1 - px0) * S, (py1 - py0) * S)
    pl.place_rgb(ph, px0 * S, py0 * S)
    pl.overprint(outline_mask(B['photo'], 1))
    # UPC with lot code and the press check dots
    ux, uy = B['upc']
    pl.fill(rect_mask((ux - 4, uy - 6, ux + 136, uy + 72)), 0, 0, 0, 0)
    um, uw, digits = upc_mask(ux, uy)
    pl.overprint(um)
    dots = [(100, 0, 0, 0), (0, 100, 0, 0), (0, 0, 100, 0), (0, 0, 0, 100)]
    for i, inks in enumerate(dots):
        m = L(); cx_, cy_ = (ux + 12 + i * 16) * S, (uy + 80) * S
        ImageDraw.Draw(m).ellipse([cx_ - 5 * S, cy_ - 5 * S, cx_ + 5 * S, cy_ + 5 * S], fill=255)
        pl.fill(m, *inks)
    img = press(pl, 20)
    return img, digits


# ------------------------------------------------------------------ wear
def wear(seed, name):
    rnd = random.Random(seed)
    w, h = W, H
    lt = Image.new('L', (w, h), 0); ld = ImageDraw.Draw(lt)
    for _ in range(30):
        side = rnd.choice('tblr'); t = rnd.random(); r = rnd.randint(3, 10)
        x, y = {'t': (t * w, rnd.randint(-3, 4)), 'b': (t * w, h - rnd.randint(-3, 4)),
                'l': (rnd.randint(-3, 4), t * h), 'r': (w - rnd.randint(-3, 4), t * h)}[side]
        ld.ellipse([x - r * 2.4, y - r, x + r * 2.4, y + r], fill=rnd.randint(40, 90))
    for (x, y) in ((0, 0), (w, 0), (0, h), (w, h)):
        ld.ellipse([x - 22, y - 22, x + 22, y + 22], fill=120)
    lt = lt.filter(ImageFilter.GaussianBlur(5))
    light = Image.new('RGBA', (w, h), (246, 242, 232, 0)); light.putalpha(lt)
    mt = Image.new('L', (w, h), 0); md = ImageDraw.Draw(mt)
    for _ in range(12):
        x, y, r = rnd.randint(0, w), rnd.randint(0, h), rnd.randint(140, 280)
        md.ellipse([x - r, y - r, x + r, y + r], fill=rnd.randint(6, 14))
    mt = mt.filter(ImageFilter.GaussianBlur(90))
    mott = Image.new('RGBA', (w, h), (255, 250, 238, 0)); mott.putalpha(mt)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    out.alpha_composite(mott); out.alpha_composite(light)
    out.save(os.path.join(A, name))


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    f = front(); f.save(os.path.join(A, 'face-front.png'), optimize=True)
    b, digits = back(); b.save(os.path.join(A, 'face-back.png'), optimize=True)
    wear(1, 'wear-front.png'); wear(2, 'wear-back.png')
    print('painted; UPC', digits)
