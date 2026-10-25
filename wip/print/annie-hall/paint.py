"""Paints every raster asset for the Mandel's take-out menu (Annie Hall, 1977).
The sheet is two-colour offset (brown and red) on goldenrod stock, so everything here is painted
the way that press would have put it down: rough ink edges, a little spread and fill-in on heavy
letters, the red plate a hair out of register with the brown, coarse tint screens, a line-cut
drawing, plus the marks the menu picked up afterwards (a purple rubber stamp, blue ballpoint).
All assets are 2x (the page renders at device scale 2)."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
PF = os.path.join(D, 'paintfonts')
INK = (58, 32, 18)
RED = (178, 48, 30)
PAPER = (236, 189, 92)
BLUE = (34, 52, 120)
PURPLE = (92, 52, 120)
S = 2  # asset scale


def font(name, size):
    return ImageFont.truetype(os.path.join(PF, name), size)


def noise(h, w, scale, seed, blur=None):
    rng = np.random.default_rng(seed)
    small = rng.random((max(2, h // scale + 2), max(2, w // scale + 2))).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    if blur:
        im = im.filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(np.float32) / 255
    return (a - a.min()) / (a.max() - a.min() + 1e-6)


def inkify(mask, seed, spread=0.0, rough=0.22, blur=1.6, voids=0.03):
    """mask: float 0..1 (hi-res). Returns float alpha with rough, slightly spread edges,
    uneven density and a few pinholes where the ink did not take."""
    h, w = mask.shape
    m = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(blur))).astype(np.float32) / 255
    n = noise(h, w, 3, seed) * 0.6 + noise(h, w, 9, seed + 1) * 0.4
    thr = 0.5 - spread + (n - 0.5) * rough
    a = np.clip((m - thr) * 6 + 0.5, 0, 1)
    dens = 0.86 + noise(h, w, 60, seed + 2, 8) * 0.14
    pin = (noise(h, w, 2, seed + 3) > 1 - voids).astype(np.float32)
    pin = np.asarray(Image.fromarray((pin * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))).astype(np.float32) / 255
    return np.clip(a * dens - pin * 0.55 * a, 0, 1)


def save_rgba(alpha_layers, size, path):
    """alpha_layers: list of (alpha float array, rgb) drawn in order (later on top, ink overprints)."""
    h, w = size
    rgb = np.zeros((h, w, 3), np.float32)
    al = np.zeros((h, w), np.float32)
    for a, col in alpha_layers:
        c = np.array(col, np.float32)
        rgb = rgb * (1 - a[..., None]) * al[..., None] / np.maximum(al + a * (1 - al), 1e-6)[..., None] + c * a[..., None] / np.maximum(al + a * (1 - al), 1e-6)[..., None]
        al = al + a * (1 - al)
    out = np.dstack([np.clip(rgb, 0, 255), al * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(path, optimize=True)


def text_mask(w, h, txt, fnt, xy, anchor='la'):
    im = Image.new('L', (w, h), 0)
    ImageDraw.Draw(im).text(xy, txt, font=fnt, fill=255, anchor=anchor)
    return np.asarray(im).astype(np.float32) / 255


def shift(a, dx, dy):
    return np.roll(np.roll(a, dy, axis=0), dx, axis=1)


# ------------------------------------------------------------- masthead
def masthead(name, txt, size, w, h, seed, red_dx=5, red_dy=4):
    f = font('Caprasimo.ttf', size)
    m = text_mask(w, h, txt, f, (10, h // 2), 'lm')
    brown = inkify(m, seed, spread=0.04, rough=0.28, blur=2.2)
    # red shadow plate: same letters, pushed down-right, printed first and off register
    redm = inkify(shift(m, red_dx * 3, red_dy * 3), seed + 9, spread=0.02, rough=0.3, blur=2.2) * 0.95
    save_rgba([(redm, RED), (brown, INK)], (h, w), os.path.join(A, name))


# ------------------------------------------------------------- starburst
def burst(name, size, lines, fs, seed, rot=-9):
    w = h = size * S
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    cx = cy = w / 2
    ang = np.arctan2(yy - cy, xx - cx)
    r = np.hypot(xx - cx, yy - cy)
    pts = 16
    rr = (w * 0.36) + (w * 0.11) * (np.abs(((ang + math.pi) * pts / (2 * math.pi)) % 1 - 0.5) * 2)
    m = (r < rr).astype(np.float32)
    f = font('Caprasimo.ttf', fs * S)
    tm = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(tm)
    tot = len(lines) * fs * S * 1.02
    for i, ln in enumerate(lines):
        d.text((w / 2, h / 2 - tot / 2 + (i + 0.5) * fs * S * 1.02), ln, font=f, fill=255, anchor='mm')
    tm = tm.rotate(rot, resample=Image.BICUBIC, center=(w / 2, h / 2))
    t = np.asarray(tm).astype(np.float32) / 255
    red = inkify(np.clip(m - t, 0, 1), seed, spread=0.0, rough=0.3, blur=1.8)
    # thin brown keyline ring, printed with the brown plate, slightly off register
    ring = ((r < rr - 7) & (r > rr - 12)).astype(np.float32)
    ring = inkify(shift(ring, 4, -3), seed + 4, rough=0.35, blur=1.2, voids=0.1)
    save_rgba([(red, RED), (ring * 0.95, INK)], (h, w), os.path.join(A, name))


# ------------------------------------------------------------- coaster line cut
def coaster(name, W1, H1, seed):
    k = 4  # draw big, ink, then reduce to 2x
    w, h = W1 * S * k, H1 * S * k
    im = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(im)
    rng = np.random.default_rng(seed)
    lw = 2 * k  # line weight in hi-res px (about 1 css px)
    ground = int(h * 0.90)
    # sky: engraved horizontal rules, wider apart near the top, gaps for two clouds
    y = int(h * 0.04)
    gap = 5 * k
    while y < int(h * 0.62):
        x0 = 0
        segs = []
        for cxr, cyr, rx, ry in ((0.72, 0.16, 0.20, 0.06), (0.22, 0.30, 0.16, 0.05)):
            cy = cyr * h
            if abs(y - cy) < ry * h:
                half = rx * w * math.sqrt(max(0, 1 - ((y - cy) / (ry * h)) ** 2))
                segs.append((cxr * w - half, cxr * w + half))
        xs = [0]
        for a, b in sorted(segs):
            xs += [a, b]
        xs.append(w)
        for i in range(0, len(xs), 2):
            if xs[i + 1] - xs[i] > 4:
                d.line([(xs[i], y), (xs[i + 1], y)], fill=255, width=max(2, int(lw * 0.6)))
        y += gap
        gap = int(gap * 1.0) if y < h * 0.3 else gap
    # track profile: high lift hill on the left, long drop, low run over the house, rise on the right

    def track(x):
        u = x / w
        return h * (0.17 + 0.43 * (1 / (1 + math.exp(-(u - 0.36) * 14))) - 0.30 * max(0, (u - 0.80)) ** 1.0 * 1.6)
    xs = np.linspace(-0.02 * w, 1.02 * w, 400)
    top = [(x, track(x)) for x in xs]
    # white-out the sky behind the structure so lattice reads clean
    poly = top + [(1.02 * w, ground), (-0.02 * w, ground)]
    d.polygon(poly, fill=0)
    # bents (posts) every so often, braces and ledgers between them
    step = 19 * S * k // 2
    posts = list(range(int(0.01 * w), int(w), step))
    for i, x in enumerate(posts):
        ty = track(x) + 6 * k
        d.line([(x, ty), (x, ground)], fill=255, width=lw)
        if i + 1 < len(posts):
            x2 = posts[i + 1]
            ty2 = track(x2) + 6 * k
            yl = max(ty, ty2)
            ledg = 20 * S * k // 2
            yy = ground - ledg
            levels = []
            while yy > yl + 3 * k:
                levels.append(yy)
                yy -= ledg
            for a in levels:
                d.line([(x, a), (x2, a)], fill=255, width=max(2, int(lw * 0.8)))
            bounds = [ground] + levels + [yl]
            for j in range(len(bounds) - 1):
                ya, yb = bounds[j], bounds[j + 1]
                d.line([(x, ya), (x2, yb)], fill=255, width=max(2, int(lw * 0.7)))
                if j % 2 == 0:
                    d.line([(x2, ya), (x, yb)], fill=255, width=max(2, int(lw * 0.7)))
    # track: heavy top chord and rail
    d.line(top, fill=255, width=lw * 2)
    d.line([(x, y + 6 * k) for x, y in top], fill=255, width=lw)
    # cars on the lift hill crest
    for i in range(4):
        cx = 0.12 * w + i * 13 * S * k // 2
        cy = track(cx)
        a = math.atan2(track(cx + 5) - track(cx - 5), 10)
        ca, sa = math.cos(a), math.sin(a)
        L, Hh = 11 * S * k // 2, 6 * S * k // 2
        pts = [(0, 0), (L, 0), (L, -Hh), (0, -Hh * 0.7)]
        d.polygon([(cx + px * ca - py * sa, cy + px * sa + py * ca - 2 * k) for px, py in pts], fill=255)
    # the house under the track: two storeys, clapboard, porch
    hx0, hx1 = int(0.47 * w), int(0.83 * w)
    roof = int(max(track(x) for x in range(hx0, hx1, 8)) + 12 * k)
    hy0 = int(roof + 26 * k)
    d.rectangle([hx0 - 6 * k, roof, hx1 + 6 * k, ground], fill=0)
    d.polygon([(hx0 - 6 * k, hy0), ((hx0 + hx1) // 2, roof), (hx1 + 6 * k, hy0)], fill=0)
    # roof hatching
    for t in range(0, 60):
        yy = roof + t * 3 * k
        if yy > hy0:
            break
        frac = (yy - roof) / max(1, hy0 - roof)
        half = frac * ((hx1 - hx0) / 2 + 6 * k)
        d.line([((hx0 + hx1) / 2 - half, yy), ((hx0 + hx1) / 2 + half, yy)], fill=255, width=max(2, int(lw * 0.6)))
    d.line([(hx0 - 6 * k, hy0), ((hx0 + hx1) // 2, roof), (hx1 + 6 * k, hy0)], fill=255, width=lw)
    d.rectangle([hx0, hy0, hx1, ground], outline=255, width=lw)
    # clapboard
    yy = hy0 + 4 * k
    while yy < ground:
        d.line([(hx0, yy), (hx1, yy)], fill=255, width=max(2, int(lw * 0.5)))
        yy += 4 * k
    # windows, door, porch roof
    win = []
    wy1 = hy0 + 10 * k
    wy2 = hy0 + int((ground - hy0) * 0.55)
    for wy in (wy1, wy2):
        for i in range(3):
            if wy == wy2 and i == 1:
                continue
            wx = hx0 + int((hx1 - hx0) * (0.12 + i * 0.32))
            win.append((wx, wy))
    for wx, wy in win:
        ww, wh = 16 * k, 19 * k
        d.rectangle([wx, wy, wx + ww, wy + wh], fill=0, outline=255, width=lw)
        d.line([(wx + ww // 2, wy), (wx + ww // 2, wy + wh)], fill=255, width=max(2, lw // 2))
        d.line([(wx, wy + wh // 2), (wx + ww, wy + wh // 2)], fill=255, width=max(2, lw // 2))
        for t in range(wy + 2 * k, wy + wh, 3 * k):  # shade in the glass
            d.line([(wx + 2, t), (wx + ww // 2 - 2, t)], fill=255, width=max(2, lw // 3))
    dx = (hx0 + hx1) // 2 - 7 * k
    d.rectangle([dx, ground - 24 * k, dx + 14 * k, ground], fill=0, outline=255, width=lw)
    for t in range(ground - 22 * k, ground, 3 * k):
        d.line([(dx + 2 * k, t), (dx + 12 * k, t)], fill=255, width=max(2, lw // 3))
    py = ground - 30 * k
    d.polygon([(hx0 - 8 * k, py), (hx1 + 8 * k, py), (hx1 + 2 * k, py - 7 * k), (hx0 - 2 * k, py - 7 * k)], fill=255)
    for px in range(hx0 - 4 * k, hx1 + 8 * k, 18 * k):
        d.line([(px, py), (px, ground)], fill=255, width=lw)
    # ground: heavy rule, a fence and short strokes of shadow
    d.line([(0, ground), (w, ground)], fill=255, width=lw * 2)
    for gx in range(0, w, 7 * k):
        gl = int(rng.integers(3, 9)) * k
        d.line([(gx, ground + 4 * k), (gx + gl, ground + 4 * k)], fill=255, width=max(2, lw // 2))
    for gx in range(0, w, 6 * k):
        if gx < hx0 - 16 * k or gx > hx1 + 16 * k:
            d.line([(gx, ground - 10 * k), (gx, ground)], fill=255, width=max(2, lw // 2))
    d.line([(0, ground - 8 * k), (hx0 - 16 * k, ground - 8 * k)], fill=255, width=max(2, lw // 2))
    d.line([(hx1 + 16 * k, ground - 8 * k), (w, ground - 8 * k)], fill=255, width=max(2, lw // 2))
    big = im.resize((W1 * S, H1 * S), Image.LANCZOS)
    m = np.asarray(big).astype(np.float32) / 255
    a = inkify(m, seed, spread=0.10, rough=0.32, blur=0.7, voids=0.03)
    save_rgba([(a, INK)], (H1 * S, W1 * S), os.path.join(A, name))


# ------------------------------------------------------------- coarse tint screen (red, about 15%)
def tint(name, W1, H1, seed, cell=6, cover=0.13, col=RED):
    w, h = W1 * S, H1 * S
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    c = cell * S
    th = math.radians(45)
    u = (xx * math.cos(th) + yy * math.sin(th)) / c
    v = (-xx * math.sin(th) + yy * math.cos(th)) / c
    du, dv = u - np.round(u), v - np.round(v)
    dist = np.sqrt(du * du + dv * dv)
    rad = math.sqrt(cover / math.pi) * (0.92 + noise(h, w, 50, seed, 6) * 0.16)
    m = np.clip((rad - dist) * c * 1.2 + 0.5, 0, 1)
    a = inkify(m, seed, spread=0.0, rough=0.25, blur=0.6, voids=0.01)
    save_rgba([(a * 0.85, col)], (h, w), os.path.join(A, name))


# ------------------------------------------------------------- rough solid bar (brown plate)
def bar(name, W1, H1, seed):
    w, h = W1 * S, H1 * S
    m = np.zeros((h, w), np.float32)
    m[3:h - 3, 3:w - 3] = 1
    a = inkify(m, seed, spread=0.02, rough=0.45, blur=1.5, voids=0.05)
    save_rgba([(a, INK)], (h, w), os.path.join(A, name))


# ------------------------------------------------------------- purple rubber stamp
def stamp(name, W1, H1, lines, seed, rot=-6):
    w, h = W1 * S, H1 * S
    im = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(im)
    d.rounded_rectangle([10, 10, w - 10, h - 10], radius=10, outline=255, width=5)
    d.rounded_rectangle([20, 20, w - 20, h - 20], radius=6, outline=255, width=2)
    fs = [font('Franklin800.ttf', 30), font('Franklin800.ttf', 46), font('Franklin800.ttf', 30)]
    ys = [h * 0.28, h * 0.53, h * 0.77]
    for ln, f, y in zip(lines, fs, ys):
        d.text((w / 2, y), ln, font=f, fill=255, anchor='mm')
    im = im.rotate(rot, resample=Image.BICUBIC, expand=False)
    m = np.asarray(im).astype(np.float32) / 255
    # stamps print heavy on one side, starved on the other
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    press = 0.45 + 0.55 * np.clip(1.15 - xx / w * 0.8 - yy / h * 0.25, 0, 1)
    a = inkify(m, seed, spread=0.05, rough=0.55, blur=1.2, voids=0.18) * press
    save_rgba([(a * 0.78, PURPLE)], (h, w), os.path.join(A, name))


# ------------------------------------------------------------- blue ballpoint ring and tick
def pen_ring(name, W1, H1, seed):
    w, h = W1 * S, H1 * S
    im = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(im)
    rng = np.random.default_rng(seed)
    pts = []
    turns = 1.18
    for i in range(240):
        t = i / 239 * turns * 2 * math.pi - 2.2
        rx = w * 0.45 * (1 + 0.04 * math.sin(3 * t + 1)) * (1 - 0.05 * i / 239)
        ry = h * 0.40 * (1 + 0.05 * math.cos(2 * t))
        pts.append((w / 2 + rx * math.cos(t) + rng.normal(0, 0.4), h / 2 + ry * math.sin(t) + rng.normal(0, 0.4) + 2 * i / 239))
    d.line(pts, fill=255, width=4, joint='curve')
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    m = np.asarray(im).astype(np.float32) / 255
    a = m * (0.75 + noise(h, w, 6, seed) * 0.25)
    save_rgba([(np.clip(a * 1.1, 0, 1) * 0.92, BLUE)], (h, w), os.path.join(A, name))


def pen_tick(name, seed):
    w, h = 36 * S, 30 * S
    im = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(im)
    d.line([(6, 32), (22, 50), (64, 8)], fill=255, width=5, joint='curve')
    im = im.filter(ImageFilter.GaussianBlur(0.6))
    m = np.asarray(im).astype(np.float32) / 255
    save_rgba([(m * 0.9, BLUE)], (h, w), os.path.join(A, name))


# ------------------------------------------------------------- paper and wear
W, H = 816 * S, 1056 * S


def edge_field(width):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    d = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    return np.clip(1 - d / width, 0, 1) ** 2.2


def corner(cx, cy, r):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    return np.clip(1 - np.sqrt((x - cx) ** 2 + (y - cy) ** 2) / r, 0, 1) ** 2


def paper(name, seed):
    """Opaque goldenrod stock: soft cloudy formation and long, faint fibres. Low detail."""
    base = np.zeros((H, W, 3), np.float32) + np.array(PAPER, np.float32)
    cloud = noise(H, W, 70, seed, 30) * 0.6 + noise(H, W, 18, seed + 1, 6) * 0.4
    base += ((cloud - 0.5) * 16)[..., None] * np.array([1.0, 0.9, 0.6])
    fib = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(fib)
    rng = np.random.default_rng(seed + 5)
    for _ in range(2600):
        x, y = rng.random() * W, rng.random() * H
        L = rng.uniform(14, 46)
        a = rng.uniform(0, math.pi)
        bend = rng.normal(0, 0.25)
        pts = [(x + math.cos(a + bend * t) * L * t, y + math.sin(a + bend * t) * L * t) for t in np.linspace(0, 1, 6)]
        d.line(pts, fill=int(rng.uniform(90, 200)), width=2)
    fib = np.asarray(fib.filter(ImageFilter.GaussianBlur(1.1))).astype(np.float32) / 255
    light = noise(H, W, 4, seed + 7) > 0.5
    sign = np.where(light, 1.0, -0.8)
    base += (fib * sign * 9)[..., None]
    Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), 'RGB').save(os.path.join(A, name), optimize=True)


def ink_wear(name, seed):
    """Paper-coloured pinholes and dry patches that sit over all the ink: the press ran a little dry."""
    n1 = noise(H, W, 2, seed)
    holes = (n1 > 0.985).astype(np.float32)
    holes = np.asarray(Image.fromarray((holes * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))).astype(np.float32) / 255
    dry = np.clip((noise(H, W, 120, seed + 1, 40) - 0.62) * 2.2, 0, 1) * (noise(H, W, 3, seed + 2) > 0.7)
    dry = np.asarray(Image.fromarray((dry * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.7))).astype(np.float32) / 255
    a = np.clip(holes * 0.55 + dry * 0.35, 0, 0.6)
    out = np.dstack([np.zeros((H, W, 3), np.float32) + np.array((238, 194, 100), np.float32), a * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, name), optimize=True)


def spot(cx, cy, rx, ry, seed):
    y, x = np.mgrid[0:H, 0:W].astype(np.float32)
    wob = noise(H, W, 40, seed, 30) * 0.35
    d = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2) + wob - 0.15
    core = np.clip(1 - d, 0, 1) ** 0.8
    rim = np.exp(-((d - 0.9) / 0.14) ** 2) * 0.35
    return np.clip(core * 0.55 + rim, 0, 1)


def wear(name, seed, grease=None, fold=False):
    mott = noise(H, W, 90, seed, 60) * 0.6 + noise(H, W, 30, seed + 1, 22) * 0.4
    alpha = (mott - 0.45).clip(0, 1) * 0.10
    alpha += edge_field(150) * 0.28
    alpha += corner(W, H, 520) * 0.10 + corner(0, H, 380) * 0.07 + corner(W, 0, 300) * 0.05
    rgb = np.zeros((H, W, 3), np.float32) + np.array((122, 78, 24), np.float32)
    if grease:
        g = spot(*grease, seed + 7)
        alpha = alpha + g * 0.15
        rgb = rgb * (1 - g[..., None] * 0.4) + np.array((150, 96, 10), np.float32) * g[..., None] * 0.4
    alpha = np.clip(alpha, 0, 0.36)
    out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, name), optimize=True)


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    masthead('mast-front.png', 'Mandel’s', 250, 1180, 330, 3)
    masthead('mast-back.png', 'Mandel’s', 110, 560, 150, 4, 3, 2)
    burst('burst-deliver.png', 176, ['WE', 'DELIVER'], 22, 5)
    coaster('linecut-coaster.png', 232, 168, 6)
    for nm, w, h in (('front', 456, 34), ('fronts', 456, 34), ('back', 456, 34), ('backr', 232, 34), ('wide', 720, 34)):
        bar(f'bar-{nm}.png', w, h, sum(map(ord, nm)))
    tint('tint-history.png', 232, 210, 8)
    tint('tint-beach.png', 456, 118, 9)
    tint('tint-deliver.png', 720, 96, 10)
    stamp('stamp-prices.png', 236, 104, ['PRICES EFFECTIVE', 'MAY 1, 1977', 'CATERING DEPT.'], 11)
    pen_ring('pen-ring.png', 96, 50, 12)
    pen_tick('pen-tick.png', 13)
    paper('paper-goldenrod-front.png', 21)
    paper('paper-goldenrod-back.png', 22)
    ink_wear('wear-ink-front.png', 31)
    ink_wear('wear-ink-back.png', 32)
    wear('wear-front.png', 11)
    wear('wear-back.png', 23, grease=(1240, 1500, 160, 120))
    print('painted')
