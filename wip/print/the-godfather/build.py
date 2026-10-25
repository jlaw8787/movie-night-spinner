"""Louis' Italian-American Restaurant, the Bronx, 1946.
Single heavy card, two faces 816x1056 (US Letter). Lift pass: Gordon Willis chiaroscuro.
Deep espresso stock, warm amber light falling from above, cream and amber inks.
Signature: a real 1940 Bronx pushcart market photo (Library of Congress, no known restrictions) across the front,
plus the TMDB still of the fruit stand with the spilled oranges, large on the back, and an engraved spot of oranges.
Props: a bakery cannoli box tied with string (Nazorine's), a wedding favour card from Connie's wedding.
Film moments: the best veal in the city, take the cannoli, the oranges. Played straight.
Writes photo crops, painted art, props and light, front/back .body.html and .html."""
import os, random, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056
BG, CREAM, MID, AMBER, ORANGE, INK, CARD = '#1b120d', '#f1e3c3', '#cdb790', '#e39a3c', '#d0621f', '#2b1b13', '#f7f2e4'
FONTS = ('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC'
         '&family=Spectral:ital,wght@0,400;0,600;0,700;1,400&family=Mrs+Saint+Delafield&display=swap')
DISP = "'IM Fell English SC', serif"; BODY = "'Spectral', serif"; SCRIPT = "'Mrs Saint Delafield', cursive"
M = 40
BGc = (27, 18, 13)

def fit(im, w, h):
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

def fade(im, bottom=0, sides=0, top=0):
    """Melt a photo into the dark stock: alpha ramps at the chosen edges, composited on the background colour."""
    w, h = im.size
    m = np.ones((h, w))
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    if bottom: m *= np.clip((h - yy) / bottom, 0, 1) ** 1.4
    if top: m *= np.clip(yy / top, 0, 1) ** 1.4
    if sides: m *= np.clip(np.minimum(xx, w - xx) / sides, 0, 1) ** 1.2
    a = np.asarray(im.convert('RGB')).astype(float)
    out = a * m[..., None] + np.array(BGc) * (1 - m[..., None])
    return Image.fromarray(out.clip(0, 255).astype('uint8'))

# Front: 1940 Arthur Avenue pushcart market, lit amber, melting into the dark at the foot.
PH = 400
st = Image.open(S('loc-12707-3000.jpg')).convert('L')
X0, Y0, K = 88, 879, 2.03
def box(x0, y0, x1, y1):
    return tuple(int(v) for v in (X0 + x0 * K, Y0 + y0 * K, X0 + x1 * K, Y0 + y1 * K))
for b in [box(400, 0, 578, 70), box(808, 0, 875, 68), box(1190, 130, 1245, 180)]:
    reg = st.crop(b).filter(ImageFilter.GaussianBlur(9)); st.paste(reg, b[:2])
st = st.crop(box(0, 0, 1400, 610))
st = ImageOps.autocontrast(st, cutoff=0.4)
st = ImageOps.colorize(st, black='#120a06', white='#f6deae', mid='#8c5f2e')
fade(fit(st, W, PH), bottom=230, sides=0).save(A('market-1940.jpg'), quality=90)

# Back: TMDB fruit stand still, the spilled oranges. Wide crop above the car, lifted and warmed.
fr = Image.open(S('c4y3FQ0cCVuhJCvJrV9a8KeBuvq.jpg')).convert('RGB').crop((1300, 0, 3300, 1090))
a = np.asarray(fr).astype(float) / 255
a = a ** 0.55
a[..., 0] *= 1.08; a[..., 1] *= 0.98; a[..., 2] *= 0.86
fr = Image.fromarray((a.clip(0, 1) * 255).astype('uint8'))
fr = ImageEnhance.Contrast(fr).enhance(1.15); fr = ImageEnhance.Color(fr).enhance(1.12)
FW, FH = W - 2 * M - 8, 360
fit(fr, FW, FH).save(A('fruit-stand.jpg'), quality=90)

# ---------------- light: a warm pool from above, deep shadow at the corners ----------------
def light(name, cx, cy, rx, ry, seed):
    rnd = random.Random(seed)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    d = ((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2
    glow = np.exp(-d * 1.6) * 62
    for i in range(6):
        x, y, r = rnd.randint(0, W), rnd.randint(0, H), rnd.randint(140, 260)
        glow += np.exp(-(((xx - x) / r) ** 2 + ((yy - y) / r) ** 2)) * rnd.uniform(3, 7)
    lay = np.zeros((H, W, 4))
    lay[..., 0], lay[..., 1], lay[..., 2] = 214, 140, 62
    lay[..., 3] = glow.clip(0, 255)
    edge = np.minimum(np.minimum(xx, W - xx), np.minimum(yy, H - yy))
    dark = (np.clip(1 - edge / 70, 0, 1) ** 2) * 120
    g = Image.fromarray(lay.astype('uint8'), 'RGBA')
    k = np.zeros((H, W, 4)); k[..., 3] = dark
    g = Image.alpha_composite(g, Image.fromarray(k.astype('uint8'), 'RGBA'))
    g.save(A(f'light-{name}.png'))
light('front', 408, 640, 520, 420, 3); light('back', 300, 560, 560, 520, 9)

# ---------------- engraved spot: oranges and leaves, scraperboard on the dark stock ----------------
def engraved_oranges():
    SS = 2
    cw, ch = 300 * 2 * SS, 210 * 2 * SS
    yy, xx = np.mgrid[0:ch, 0:cw].astype(float)
    lum = np.zeros((ch, cw)); cov = np.zeros((ch, cw), bool)
    rnd = np.random.default_rng(7)
    Lx, Ly, Lz = -0.55, -0.62, 0.56
    def sphere(cx, cy, r, ax=(0.28, -1.0, 0.25), N=30):
        nonlocal lum, cov
        nx, ny = (xx - cx) / r, (yy - cy) / r
        rr = nx * nx + ny * ny; ins = rr < 1
        nz = np.sqrt(np.clip(1 - rr, 0, 1))
        lit = np.clip(nx * Lx + ny * Ly + nz * Lz, 0, 1)
        a = np.array(ax) / np.linalg.norm(ax)
        ph = np.arcsin(np.clip(nx * a[0] + ny * a[1] + nz * a[2], -1, 1)) / math.pi * N
        f = ph - np.floor(ph)
        w = 0.06 + 0.8 * lit ** 1.3
        line = np.abs(f - 0.5) < w / 2
        pores = rnd.random((ch, cw)) < 0.012 * (0.3 + lit)
        rim = (rr > 0.93) & (lit > 0.05)
        v = (line | pores | rim).astype(float) * (0.55 + 0.45 * lit)
        lum = np.where(ins, v, lum); cov |= ins
    def half(cx, cy, r, sq=0.62):
        nonlocal lum, cov
        nx, ny = (xx - cx) / r, (yy - cy) / (r * sq)
        rr = np.sqrt(nx * nx + ny * ny); ins = rr < 1
        th = np.arctan2(ny, nx) + math.pi
        seg = th / (2 * math.pi) * 11
        fs = seg - np.floor(seg)
        membrane = (np.minimum(fs, 1 - fs) < 0.05) & (rr < 0.84) & (rr > 0.1)
        rad = th / (2 * math.pi) * 150; fr_ = rad - np.floor(rad)
        flesh = (np.abs(fr_ - 0.5) < 0.22 * (1.1 - rr)) & (rr < 0.8) & (rr > 0.12) & ~membrane
        ves = (rnd.random((ch, cw)) < 0.05) & (rr < 0.8)
        pith = (rr > 0.84) & (rr < 0.89)
        rindl = (rr >= 0.89) & ((np.sin(th * 90) > 0.2) | (rr > 0.975))
        centre = rr < 0.07
        v = np.zeros_like(rr)
        v[flesh | ves] = 0.85; v[membrane] = 0.35; v[pith] = 1.0; v[rindl] = 0.75; v[centre] = 0.9
        lum = np.where(ins, v, lum); cov |= ins
    def leaf(x0, y0, x1, y1, wid, ang=35):
        nonlocal lum, cov
        L = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L
        s = ((xx - x0) * ux + (yy - y0) * uy) / L
        t = (-(xx - x0) * uy + (yy - y0) * ux)
        half_w = wid * np.sin(np.clip(s, 0, 1) * math.pi) ** 0.8
        ins = (s > 0) & (s < 1) & (np.abs(t) < half_w)
        rib = np.abs(t) < 2.6 * SS
        vein = np.sin((s * L + np.abs(t) * 0.9) / (5.5 * SS) * math.pi) > 0.55
        edge = np.abs(np.abs(t) - half_w) < 2.2 * SS
        side = (t < 0)
        v = np.where(rib | edge, 0.9, np.where(vein, np.where(side, 0.7, 0.4), 0))
        lum = np.where(ins & ~cov, v, lum); cov |= ins
    S2 = SS * 2
    sphere(150 * S2, 120 * S2, 72 * S2)
    half(232 * S2, 160 * S2, 56 * S2)
    sphere(66 * S2, 150 * S2, 50 * S2, ax=(-0.2, -1, 0.3), N=24)
    leaf(150 * S2, 52 * S2, 250 * S2, 18 * S2, 20 * S2)
    leaf(132 * S2, 50 * S2, 40 * S2, 30 * S2, 17 * S2)
    # colour: lit lines amber to cream, a soft dark halo so the spot reads over the photo
    c0, c1 = np.array([205, 98, 34]), np.array([250, 214, 150])
    rgb = c0 + (c1 - c0) * np.clip(lum, 0, 1)[..., None] ** 1.2
    al = np.clip(lum * 1.4, 0, 1) * 255
    halo = Image.fromarray((cov * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(14 * SS))
    halo = np.asarray(halo).astype(float) / 255
    base = np.zeros((ch, cw, 4)); base[..., :3] = BGc; base[..., 3] = np.clip(halo * 1.25, 0, 1) * 235
    top = np.dstack([rgb, al])
    a1 = top[..., 3:4] / 255
    out = base.copy()
    out[..., :3] = top[..., :3] * a1 + base[..., :3] * (1 - a1)
    out[..., 3] = np.maximum(base[..., 3], top[..., 3])
    im = Image.fromarray(out.clip(0, 255).astype('uint8'), 'RGBA').resize((cw // SS, ch // SS), Image.LANCZOS)
    im.save(A('engraved-oranges.png'))
engraved_oranges()

# ---------------- painted props ----------------
def twine(dr, p0, p1, w=7):
    """Red and white twisted bakery string."""
    (x0, y0), (x1, y1) = p0, p1
    L = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L; nx, ny = -uy, ux
    dr.line([p0, p1], fill=(250, 246, 238, 255), width=w)
    s = 0.0
    while s < L:
        ax, ay = x0 + ux * s + nx * w / 2, y0 + uy * s + ny * w / 2
        bx, by = x0 + ux * (s + 6) - nx * w / 2, y0 + uy * (s + 6) - ny * w / 2
        dr.line([(ax, ay), (bx, by)], fill=(176, 36, 32, 255), width=3)
        s += 9
    dr.line([(x0 + nx * w / 2, y0 + ny * w / 2), (x1 + nx * w / 2, y1 + ny * w / 2)], fill=(120, 30, 26, 110), width=1)

def cannoli_box():
    """Top-down white pastry box, tied with string, a soft shadow. 330x210 css px painted at 2x."""
    cw, ch = 660, 420
    im = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    sh = Image.new('L', (cw, ch), 0); ImageDraw.Draw(sh).rectangle([30, 34, 640, 404], fill=120)
    sh = sh.filter(ImageFilter.GaussianBlur(12))
    shadow = Image.new('RGBA', (cw, ch), (40, 26, 14, 0)); shadow.putalpha(sh)
    im = Image.alpha_composite(im, shadow)
    lid = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); ld = ImageDraw.Draw(lid)
    ld.rectangle([16, 14, 626, 348], fill=(246, 242, 232, 255))
    ld.rectangle([16, 348, 626, 392], fill=(222, 215, 199, 255))     # front wall of the box
    ld.line([(16, 348), (626, 348)], fill=(190, 180, 160, 255), width=2)
    g = np.zeros((ch, cw), float)
    yy, xx = np.mgrid[0:ch, 0:cw]
    g += 14 * (xx / cw) + 10 * (yy / ch)
    rnd = np.random.default_rng(3)
    blot = Image.fromarray((rnd.random((ch // 20, cw // 20)) * 255).astype('uint8')).resize((cw, ch), Image.BICUBIC)
    g += (np.asarray(blot, float) - 128) / 128 * 4
    arr = np.asarray(lid).astype(float)
    mask = arr[..., 3] > 0
    for c in range(3): arr[..., c][mask] -= g[mask]
    lid = Image.fromarray(arr.clip(0, 255).astype('uint8'))
    ld = ImageDraw.Draw(lid)
    ld.rectangle([16, 14, 626, 392], outline=(176, 166, 146, 255), width=2)
    im = Image.alpha_composite(im, lid)
    dr = ImageDraw.Draw(im)
    kx, ky = 470, 300
    twine(dr, (kx, 6), (kx, 400)); twine(dr, (8, ky), (634, ky))
    for ang, rx, ry in [(-30, 46, 22), (205, 46, 22)]:          # the bow loops
        loop = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); lo = ImageDraw.Draw(loop)
        lo.ellipse([kx - rx, ky - ry, kx + rx, ky + ry], outline=(250, 246, 238, 255), width=7)
        lo.ellipse([kx - rx, ky - ry, kx + rx, ky + ry], outline=(176, 36, 32, 200), width=2)
        loop = loop.rotate(ang, center=(kx, ky)).transform(loop.size, Image.AFFINE, (1, 0, -math.cos(math.radians(ang)) * rx, 0, 1, math.sin(math.radians(ang)) * rx))
        im = Image.alpha_composite(im, loop)
    dr = ImageDraw.Draw(im)
    twine(dr, (kx, ky), (kx + 40, ky + 70)); twine(dr, (kx, ky), (kx - 34, ky + 74))
    dr.ellipse([kx - 9, ky - 9, kx + 9, ky + 9], fill=(232, 222, 206, 255), outline=(150, 34, 30, 255), width=3)
    im.save(A('cannoli-box.png'))
cannoli_box()

def almonds():
    """Five white sugared almonds for a wedding favour. 230x64 css px at 2x."""
    cw, ch = 460, 128
    im = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    rnd = random.Random(5)
    tints = [(250, 248, 243), (247, 240, 236), (250, 248, 243), (244, 238, 230), (250, 248, 243)]
    for i in range(5):
        cx, cy = 52 + i * 89, 64 + (8 if i % 2 else -6); rx, ry = 42, 28
        ang = rnd.uniform(-25, 25)
        sh = Image.new('L', (cw, ch), 0); ImageDraw.Draw(sh).ellipse([cx - rx + 4, cy - ry + 8, cx + rx + 4, cy + ry + 8], fill=110)
        sh = sh.filter(ImageFilter.GaussianBlur(6)).rotate(ang, center=(cx, cy))
        shadow = Image.new('RGBA', (cw, ch), (60, 40, 20, 0)); shadow.putalpha(sh)
        im = Image.alpha_composite(im, shadow)
        yy, xx = np.mgrid[0:ch, 0:cw].astype(float)
        dx, dy = (xx - cx) / rx, (yy - cy) / ry
        r2 = dx * dx + dy * dy
        inside = r2 <= 1
        shade = 1 - 0.22 * np.clip(dx * 0.4 + dy * 0.8 + 0.3, 0, 1.5) + 0.12 * np.exp(-((dx + 0.35) ** 2 + (dy + 0.45) ** 2) * 6)
        arr = np.zeros((ch, cw, 4))
        for c in range(3): arr[..., c] = tints[i][c] * shade
        arr[..., 3] = np.where(inside, 255, 0)
        al = Image.fromarray(arr.clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.6)).rotate(ang, center=(cx, cy))
        im = Image.alpha_composite(im, al)
    im.save(A('almonds.png'))
almonds()


# ---------------- type pieces ----------------
def kicker(t, color=AMBER, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 22px;{extra}">{t}</div>')

def head(kick, title, top=0, size=42):
    return (f'<div style="margin-top: {top}px">{kicker(kick)}'
            f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 44px; color: {CREAM}; margin-top: 2px">{title}</div>'
            f'<div style="height: 3px; background: {AMBER}; margin-top: 4px; opacity: 0.9"></div>'
            f'<div style="height: 1px; background: {AMBER}; margin-top: 2px; opacity: 0.7"></div></div>')

def item(name, price, desc, top=14, note=None, size=27):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.25; color: {AMBER}; margin-top: 3px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.15; color: {CREAM}"><span>{name}</span><span>{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {MID}; margin-top: 3px">{desc}</div>{n}</div>')

def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'

def page(name, inner):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {BG}">'
            f'<img src="assets/light-{name}.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px">'
            f'<img src="assets/paper-grain.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; opacity: 0.25">'
            f'{inner}</div>')

# ---------------- front ----------------
def front():
    o = []
    o.append(f'<img src="assets/market-1940.jpg" alt="Pushcart market on Arthur Avenue, the Bronx, 1940" '
             f'style="position: absolute; left: 0; top: 0; width: {W}px; height: {PH}px">')
    # name, set into the shadow at the foot of the photograph
    o.append(at(M, 286, 520, kicker('Ristorante, the Bronx, N.Y.', AMBER, 18)
                + f'<div style="font-family: {DISP}; font-size: 72px; line-height: 72px; color: {CREAM}; margin-top: 2px">Louis\'</div>'))
    o.append(at(276, 318, 300, f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MID}">'
                'The pushcart market round our corner, where we buy every tomato.</div>'))
    # the veal seal
    o.append(f'<div style="position: absolute; left: 592px; top: 236px; width: 190px; height: 190px; border-radius: 50%; background: {ORANGE}; '
             f'transform: rotate(-6deg); box-shadow: 0 4px 14px rgba(0,0,0,0.55)">'
             f'<div style="position: absolute; left: 9px; top: 9px; width: 172px; height: 172px; border-radius: 50%; border: 2px solid {CARD}; box-sizing: border-box"></div>'
             f'<div style="position: absolute; left: 0; top: 34px; width: 190px; text-align: center; color: {CARD}">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.2em; line-height: 22px">THE BEST</div>'
             f'<div style="font-family: {DISP}; font-size: 64px; line-height: 62px">Veal</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.14em; line-height: 20px">IN THE CITY</div>'
             f'</div></div>')
    TOP = 424
    left = (head('To start', 'Antipasti')
            + item('Antipasto, wedding style', '.65', 'Salami, aged provolone, olives and roasted peppers, at room temperature.')
            + item('Arancini', '.40', 'Crisp risotto balls, fried golden round a melting mozzarella heart.')
            + head('By hand, every morning', 'Pasta', 26)
            + item('Rigatoni, Sunday gravy', '.85', 'Pork and beef meatballs, fennel sausage, slow tomato, pecorino.')
            + f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MID}; margin-top: 22px">'
              'We cook with Genco Pura olive oil. Prices subject to change. OLinville 2-1972. Form L-46.</div>')
    o.append(at(M, TOP, 366, left))
    o.append(f'<div style="position: absolute; left: 427px; top: {TOP + 4}px; width: 1px; height: 540px; background: {AMBER}; opacity: 0.35"></div>')
    RX = 448; RW = W - M - RX
    right = (head('Specialità della casa', 'The Veal')
             + item('Veal scaloppine', '1.72', 'Thin cutlets pan-fried in butter, with Marsala wine and mushrooms.', 14,
                    'Pounded to order. Allow a few minutes.', 28))
    o.append(at(RX, TOP, RW, right))
    o.append(at(RX, TOP + 232, RW,
                f'<div style="border: 2px solid {AMBER}; padding: 12px 16px 14px; box-sizing: border-box; background: rgba(0,0,0,0.28)">'
                + kicker('Complete dinner', AMBER, 16)
                + f'<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px">'
                  f'<div style="font-family: {DISP}; font-size: 30px; line-height: 32px; color: {CREAM}">The family dinner</div>'
                  f'<div style="font-family: {BODY}; font-weight: 700; font-size: 28px; color: {CREAM}">2.50</div></div>'
                + f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {MID}; margin-top: 6px">'
                  'Antipasto, rigatoni and gravy, the veal, cannoli, espresso.</div></div>'))
    # prop: wedding favour card, catching the light on the table
    o.append(f'<div style="position: absolute; left: {RX + 22}px; top: {TOP + 412}px; width: 300px; height: 140px; background: {CARD}; '
             f'transform: rotate(3.5deg); box-shadow: 0 6px 14px rgba(0,0,0,0.6); border: 1px solid #cfc3a6">'
             f'<div style="position: absolute; left: 22px; top: 0; width: 16px; height: 140px; background: #ead2c9"></div>'
             f'<div style="position: absolute; left: 22px; top: 0; width: 2px; height: 140px; background: #d9b9ad"></div>'
             f'<div style="position: absolute; left: 36px; top: 0; width: 2px; height: 140px; background: #d9b9ad"></div>'
             f'<div style="position: absolute; left: 54px; top: 12px; width: 234px; text-align: center">'
             + kicker('Bomboniera', ORANGE, 16)
             + f'<div style="font-family: {DISP}; font-size: 28px; line-height: 30px; color: {INK}">Connie &amp; Carlo</div>'
               f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 20px; color: #57463a">Long Beach, 1945</div></div>'
             f'<img src="assets/almonds.png" alt="" style="position: absolute; left: 62px; top: 74px; width: 218px; height: 61px">'
             f'</div>')
    return page('front', ''.join(o))

# ---------------- back ----------------
def back():
    o = []
    # the fruit stand, large, with the engraved oranges laid over its corner
    o.append(f'<div style="position: absolute; left: {M}px; top: {M}px; width: {FW + 8}px; height: {FH + 8}px; background: {AMBER}"></div>')
    o.append(f'<img src="assets/fruit-stand.jpg" alt="The fruit stand with oranges on the street" '
             f'style="position: absolute; left: {M + 4}px; top: {M + 4}px; width: {FW}px; height: {FH}px">')
    o.append(f'<img src="assets/engraved-oranges.png" alt="Engraved oranges" style="position: absolute; left: 486px; top: 290px; width: 300px; height: 210px">')
    o.append(at(M, M + FH + 22, 440, f'<div style="font-family: {DISP}; font-size: 34px; line-height: 36px; color: {CREAM}">An orange on every table</div>'
                f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MID}; margin-top: 4px">'
                'Bought each morning at the fruit stand<br>by the olive oil company.</div>'))
    TOP = 524
    # dolci and the cannoli box
    o.append(at(M, TOP, 366, head('From Nazorine\'s', 'Take the cannoli', 0, 38)
                + item('Cannoli', '.25', 'Crisp shells, orange-scented ricotta, dark chocolate, crushed pistachio.')))
    o.append(f'<img src="assets/cannoli-box.png" alt="" style="position: absolute; left: 30px; top: 710px; width: 250px; height: 159px">')
    o.append(f'<div style="position: absolute; left: 44px; top: 729px; width: 150px; height: 86px; border-radius: 50%; border: 2px solid {ORANGE}; '
             f'box-sizing: border-box; text-align: center; padding-top: 14px">'
             f'<div style="font-family: {DISP}; font-size: 24px; line-height: 24px; color: {INK}">Nazorine</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; line-height: 20px; color: {ORANGE}">PASTRY</div></div>')
    o.append(at(296, 722, 132, f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MID}">'
                'Boxed and tied with string, for the ride home.</div>'))
    # character voice
    o.append(at(M, 884, 388, f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {CREAM}">'
                'Oil, garlic, tomatoes, then sausage and meatballs. Wine and a pinch of sugar. My trick.</div>'))
    o.append(at(250, 942, 200, f'<div style="font-family: {SCRIPT}; font-size: 36px; line-height: 34px; color: {AMBER}">Pete Clemenza</div>'))
    # cafe and bar
    BX = 448; BW = W - M - BX
    o.append(at(BX, TOP, BW, head('After dinner', 'Caffè &amp; Bar')
                + item('Espresso', '.10', 'Dark roast, a curl of lemon peel.', 10)
                + item('Blood orange soda', '.15', 'Ruby citrus syrup, cold seltzer.', 10)
                + item('Chianti', '.35', 'By the glass, from the straw bottle.', 10)
                + item('Anisette', '.30', 'Sweet cordial, two coffee beans.', 10)))
    rules = ['Old-fashioned plumbing out back.',
             'Police officers dine here often.', 'Never side against the family.']
    rl = ''.join(f'<div style="font-family: {BODY}; font-size: 17px; line-height: 1.3; color: {CREAM}; margin-top: 3px">{r}</div>' for r in rules)
    o.append(at(BX, 890, BW, f'<div style="border-top: 2px solid {AMBER}; padding-top: 6px">'
                + kicker('House customs', AMBER, 16) + rl + '</div>'))
    return page('back', ''.join(o))

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Louis\' restaurant card</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
