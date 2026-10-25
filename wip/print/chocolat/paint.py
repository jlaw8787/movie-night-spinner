"""Paints the Chocolat art in PIL plus numpy (all painted here, no outside images):
assets/window.jpg   the chocolaterie's Easter shop window, seen from the street at dusk (signature piece)
assets/plate.png    Vianne's painted earthenware plate, the one she spins ("what do you see?")
assets/bow.png      satin chilli red gift-box bow; assets/ribbon-v.png the ribbon band under it
assets/wear-*.png   soft edge wear for both faces"""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
FONT = lambda f, s: ImageFont.truetype(os.path.join(D, 'fonts', f), s)
os.makedirs(os.path.join(D, 'assets'), exist_ok=True)
R = random.Random(1959)


def hexc(h):
    h = h.lstrip('#'); return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


# ---------------------------------------------------------------- sprites
def ball(rw, rh, base, spec=0.55, matte=0.0, seed=0, flecks=None, drizzle=None, light=(-0.45, -0.6)):
    """Shaded chocolate ball or egg sprite (RGBA), light from upper left."""
    w, h = int(rw * 2) + 4, int(rh * 2) + 4
    y, x = np.mgrid[0:h, 0:w].astype(float)
    nx = (x - w / 2) / rw; ny = (y - h / 2) / rh
    rr = nx ** 2 + ny ** 2
    inside = rr < 1
    nz = np.sqrt(np.clip(1 - rr, 0, 1))
    lx, ly = light; lz = math.sqrt(max(0, 1 - lx * lx - ly * ly))
    lam = np.clip(nx * lx + ny * ly + nz * lz, 0, 1)
    shade = 0.32 + 0.78 * lam
    b = np.array(base, float)
    col = b[None, None, :] * shade[..., None]
    rnd = np.random.default_rng(seed)
    if matte:
        n = rnd.random((h, w))
        n = np.array(Image.fromarray((n * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))) / 255.0
        col *= (1 - matte * 0.35 + matte * 0.5 * n)[..., None]
    if flecks is not None:
        fc, dens = flecks
        m = rnd.random((h, w)) < dens
        m = np.array(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3))) > 0
        col[m] = np.array(fc, float) * (0.6 + 0.6 * lam[m])[:, None]
    if drizzle is not None:
        dc, n = drizzle
        for k in range(n):
            ph = rnd.uniform(0, 6.28); fx = (k + 0.5) / n * 2 - 1
            band = np.abs(nx - fx - 0.12 * np.sin(ny * 3 + ph)) < 0.055
            col[band] = np.array(dc, float)[None, :] * (0.45 + 0.75 * lam[band])[:, None]
    hx, hy = lx * 0.55, ly * 0.55
    sp = np.exp(-(((nx - hx) ** 2 + (ny - hy) ** 2) / (0.035 if not matte else 0.09)))
    col += (255 * spec * (1 - matte * 0.8) * sp)[..., None]
    rim = np.exp(-((1 - np.sqrt(np.clip(rr, 0, 1))) / 0.05)) * np.clip(ny + 0.2, 0, 1)
    col += (90 * rim * 0.6)[..., None] * np.array([1.0, 0.75, 0.45])
    a = np.clip((1 - np.sqrt(rr)) * min(rw, rh) * 1.2, 0, 1) * 255
    img = np.dstack([np.clip(col, 0, 255), a]).astype(np.uint8)
    return Image.fromarray(img, 'RGBA')


def paste(dst, spr, cx, cy):
    dst.alpha_composite(spr, (int(cx - spr.width / 2), int(cy - spr.height / 2)))


def shadow(dst, cx, cy, rx, ry, alpha=150, blur=8):
    s = Image.new('L', dst.size, 0)
    ImageDraw.Draw(s).ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=alpha)
    s = s.filter(ImageFilter.GaussianBlur(blur))
    dst.alpha_composite(Image.merge('RGBA', (Image.new('L', dst.size, 18), Image.new('L', dst.size, 8),
                                              Image.new('L', dst.size, 4), s)))


DARK, MILK, WHITE = (66, 33, 20), (122, 72, 40), (236, 222, 196)
COCOA = (92, 54, 36)
CHILLI, GOLD = (176, 40, 30), (214, 168, 74)


def truffle(kind, r, seed):
    if kind == 'dark': return ball(r, r, DARK, 0.6, seed=seed)
    if kind == 'milk': return ball(r, r, MILK, 0.5, seed=seed)
    if kind == 'white': return ball(r, r, WHITE, 0.35, seed=seed, drizzle=(DARK, 5))
    if kind == 'cocoa': return ball(r, r * 0.97, COCOA, 0.2, matte=1.0, seed=seed)
    if kind == 'chilli': return ball(r, r, DARK, 0.4, seed=seed, flecks=((196, 42, 30), 0.012))
    if kind == 'nut': return ball(r, r, DARK, 0.35, seed=seed, flecks=((196, 150, 96), 0.03))
    if kind == 'swirl': return ball(r, r * 0.8, DARK, 0.6, seed=seed, drizzle=(MILK, 3))


KINDS = ['dark', 'milk', 'white', 'cocoa', 'chilli', 'nut', 'swirl']


def foil_egg(rw, rh, base, seed):
    e = ball(rw, rh, base, 0.9, seed=seed)
    a = np.array(e).astype(float)
    n = np.random.default_rng(seed).random(a.shape[:2])
    n = np.array(Image.fromarray((n * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))) / 255.0
    a[..., :3] *= (0.75 + 0.5 * n)[..., None]
    return Image.fromarray(np.clip(a, 0, 255).astype(np.uint8), 'RGBA')


def gold_ellipse(dst, box, dark=(120, 84, 30), light=(246, 214, 130)):
    x0, y0, x1, y1 = box
    w, h = int(x1 - x0), int(y1 - y0)
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    t = xx / max(1, w - 1)
    g = 0.5 + 0.5 * np.cos((t - 0.32) * 2 * math.pi * 0.9)
    col = np.array(dark, float) + (np.array(light, float) - np.array(dark, float)) * g[..., None]
    m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).ellipse([0, 0, w - 1, h - 1], fill=255)
    img = Image.fromarray(np.dstack([col, np.array(m)]).astype(np.uint8), 'RGBA')
    dst.alpha_composite(img, (int(x0), int(y0)))


def gold_rect(dst, box, dark=(110, 76, 26), light=(240, 206, 120)):
    x0, y0, x1, y1 = [int(v) for v in box]
    w, h = x1 - x0, y1 - y0
    t = np.linspace(0, 1, w)
    g = 0.5 + 0.5 * np.cos((t - 0.32) * 2 * math.pi * 0.9)
    col = np.array(dark, float) + (np.array(light, float) - np.array(dark, float)) * g[:, None]
    col = np.repeat(col[None, :, :], h, 0)
    img = Image.fromarray(np.dstack([col, np.full((h, w), 255.0)]).astype(np.uint8), 'RGBA')
    dst.alpha_composite(img, (x0, y0))


def cake_stand(dst, cx, base_y, tiers, seed):
    """Gilt tiered stand piled with truffles. tiers: list of (plate half width, height above base)."""
    rnd = random.Random(seed)
    top = base_y - tiers[-1][1]
    gold_rect(dst, (cx - 9, top, cx + 9, base_y))
    gold_ellipse(dst, (cx - 70, base_y - 14, cx + 70, base_y + 14))
    for hw, hgt in tiers:
        py = base_y - hgt
        shadow(dst, cx, py + 6, hw, 12, 120, 6)
        gold_ellipse(dst, (cx - hw, py - 16, cx + hw, py + 16))
        ImageDraw.Draw(dst).ellipse([cx - hw + 10, py - 10, cx + hw - 10, py + 8], fill=(232, 222, 200, 255))  # paper doily
        dd = ImageDraw.Draw(dst)
        for k in range(28):
            ang = k / 28 * 2 * math.pi
            dd.ellipse([cx + math.cos(ang) * (hw - 6) - 4, py + math.sin(ang) * 12 - 4,
                        cx + math.cos(ang) * (hw - 6) + 4, py + math.sin(ang) * 12 + 4], fill=(244, 238, 222, 255))
        r = 24 if hw > 120 else 21
        rows = [(-6, int((hw - 22) / (r * 1.05)))]
        if hw > 90: rows.insert(0, (-26, int((hw - 50) / (r * 1.1))))
        for dy, n in rows:
            xs = np.linspace(-(n - 1) * r * 0.98, (n - 1) * r * 0.98, n)
            for x in xs:
                paste(dst, truffle(rnd.choice(KINDS), r, rnd.randint(0, 9999)), cx + x + rnd.uniform(-2, 2), py + dy - r * 0.55)


# ---------------------------------------------------------------- the window
def window():
    W, H = 1240, 1340
    im = Image.new('RGBA', (W, H), (0, 0, 0, 255))
    # limestone surround
    st = np.random.default_rng(3).random((H // 6, W // 6))
    st = np.array(Image.fromarray((st * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(5))) / 255.0
    stone = np.array([196, 176, 140], float)[None, None, :] * (0.78 + 0.3 * st[..., None])
    im = Image.fromarray(np.dstack([stone, np.full((H, W), 255.)]).astype(np.uint8), 'RGBA')
    d = ImageDraw.Draw(im)
    for yy in range(0, H, 92):  # coursing
        d.line([(0, yy), (W, yy)], fill=(150, 130, 100, 255), width=3)
        off = 0 if (yy // 92) % 2 else 140
        for xx in range(off, W, 280):
            d.line([(xx, yy), (xx, yy + 92)], fill=(150, 130, 100, 255), width=3)
    # wooden shopfront, painted cocoa with gold beading
    FX0, FY0, FX1, FY1 = 70, 40, W - 70, 1260
    d.rectangle([FX0, FY0, FX1, FY1], fill=(58, 26, 18, 255))
    d.rectangle([FX0 + 10, FY0 + 10, FX1 - 10, FY1 - 10], outline=(200, 156, 70, 255), width=4)
    # fascia with gilt lettering
    d.rectangle([FX0 + 26, FY0 + 26, FX1 - 26, FY0 + 150], fill=(124, 26, 22, 255))
    d.rectangle([FX0 + 34, FY0 + 34, FX1 - 34, FY0 + 142], outline=(214, 170, 80, 255), width=3)
    f = FONT('BerkshireSwash.ttf', 92)
    txt = 'Chocolats'
    tw = d.textlength(txt, font=f)
    tl = Image.new('L', (W, H), 0); ImageDraw.Draw(tl).text(((W - tw) / 2, FY0 + 38), txt, font=f, fill=255)
    gold = Image.new('RGBA', (W, H), (0, 0, 0, 0)); gold_rect(gold, (0, FY0 + 30, W, FY0 + 150), (150, 104, 36), (252, 226, 150))
    sh = tl.filter(ImageFilter.GaussianBlur(3))
    im.alpha_composite(Image.merge('RGBA', (Image.new('L', (W, H), 20), Image.new('L', (W, H), 6), Image.new('L', (W, H), 4),
                                            ImageChops.offset(sh, 4, 5).point(lambda v: int(v * 0.8)))))
    gold.putalpha(ImageChops.multiply(gold.getchannel('A'), tl)); im.alpha_composite(gold)
    # glass opening
    GX0, GY0, GX1, GY1 = FX0 + 40, FY0 + 170, FX1 - 40, FY0 + 170 + 940
    gw, gh = GX1 - GX0, GY1 - GY0
    yy, xx = np.mgrid[0:gh, 0:gw].astype(float)
    glow = np.exp(-(((xx - gw * 0.5) / (gw * 0.55)) ** 2 + ((yy - gh * 0.12) / (gh * 0.75)) ** 2))
    deep = np.array([36, 16, 10], float); warm = np.array([214, 140, 62], float)
    inter = deep + (warm - deep) * (glow ** 1.3)[..., None]
    room = Image.fromarray(np.dstack([inter, np.full((gh, gw), 255.)]).astype(np.uint8), 'RGBA')
    rd = ImageDraw.Draw(room)
    # back shelves with jars and ribboned boxes
    rnd = random.Random(7)
    for sy in (170, 350):
        rd.rectangle([0, sy, gw, sy + 12], fill=(70, 36, 20, 255))
        x = 18
        while x < gw - 60:
            if rnd.random() < 0.45:
                bw, bh = rnd.randint(70, 110), rnd.randint(50, 80)
                c = rnd.choice([(150, 36, 28), (226, 206, 168), (120, 74, 44), (200, 160, 80)])
                c = tuple(int(v * (0.55 + 0.45 * glow[min(gh - 1, sy - 10), min(gw - 1, x)])) for v in c)
                rd.rectangle([x, sy - bh, x + bw, sy], fill=c + (255,))
                rc = (212, 170, 80) if c[0] > 140 and c[1] < 100 else (170, 40, 30)
                rd.rectangle([x + bw // 2 - 5, sy - bh, x + bw // 2 + 5, sy], fill=rc + (255,))
                x += bw + rnd.randint(6, 16)
            else:
                jw, jh = rnd.randint(46, 60), rnd.randint(70, 96)
                g = glow[min(gh - 1, sy - 30), min(gw - 1, x)]
                rd.rounded_rectangle([x, sy - jh, x + jw, sy], 10, fill=(int(150 * g + 50), int(110 * g + 30), int(70 * g + 20), 255))
                rd.rectangle([x + 6, sy - jh - 10, x + jw - 6, sy - jh + 2], fill=(190, 150, 70, 255))
                for k in range(5):
                    bx, by = x + rnd.randint(10, jw - 10), sy - rnd.randint(10, jh - 14)
                    rd.ellipse([bx - 8, by - 8, bx + 8, by + 8], fill=rnd.choice([(60, 30, 18), (110, 64, 36), (220, 200, 170)]) + (255,))
                rd.line([(x + 10, sy - jh + 8), (x + 10, sy - 10)], fill=(255, 236, 200, 110), width=4)
                x += jw + rnd.randint(8, 18)
    room = room.filter(ImageFilter.GaussianBlur(2.2))  # shelves sit back, out of focus
    rd = ImageDraw.Draw(room)
    # display cloth: a chilli red velvet step with a lace edge
    for (top, col) in ((660, (128, 24, 20)), (790, (150, 30, 24))):
        rd.rectangle([0, top, gw, gh], fill=col + (255,))
        for x in range(-10, gw + 20, 34):
            rd.ellipse([x, top - 12, x + 34, top + 16], fill=(238, 228, 206, 255))
            rd.ellipse([x + 13, top - 4, x + 21, top + 4], fill=col + (255,))
        rd.rectangle([0, top - 2, gw, top + 4], fill=(238, 228, 206, 255))
    vel = np.random.default_rng(9).random((gh // 3, gw // 3))
    vel = Image.fromarray((vel * 255).astype(np.uint8)).resize((gw, gh), Image.BICUBIC).filter(ImageFilter.GaussianBlur(4))
    vel_a = Image.new('RGBA', (gw, gh), (0, 0, 0, 0)); vel_a.putalpha(vel.point(lambda v: int(v * 0.16)))
    mask = Image.new('L', (gw, gh), 0); ImageDraw.Draw(mask).rectangle([0, 675, gw, gh], fill=255)
    vel_a.putalpha(ImageChops.multiply(vel_a.getchannel('A'), mask)); room.alpha_composite(vel_a)
    # centre: the great Easter egg on a gilt stand
    cx = gw // 2
    shadow(room, cx, 656, 180, 26, 170, 10)
    gold_rect(room, (cx - 74, 560, cx + 74, 656))
    gold_ellipse(room, (cx - 118, 638, cx + 118, 676))
    gold_ellipse(room, (cx - 86, 542, cx + 86, 578))
    egg = ball(214, 284, (74, 38, 22), 0.7, seed=4)
    ea = np.array(egg).astype(float)
    hh, ww = ea.shape[:2]
    yy2, xx2 = np.mgrid[0:hh, 0:ww].astype(float)
    taper = 1 - 0.18 * np.clip((hh * 0.5 - yy2) / (hh * 0.5), 0, 1)  # narrower top, egg shape
    nxn = (xx2 - ww / 2) / (ww / 2 * taper); nyn = (yy2 - hh / 2) / (hh / 2)
    ea[..., 3] = np.clip((1 - np.sqrt(nxn ** 2 + nyn ** 2)) * 160, 0, 1) * 255
    band = (np.abs(yy2 - hh * 0.52 - 18 * np.sqrt(np.clip(1 - nxn ** 2, 0, 1))) < 26)
    lum = ea[..., :3].mean(-1) / 74.0
    ea[band, 0] = np.clip(170 * lum[band], 0, 255); ea[band, 1] = np.clip(34 * lum[band], 0, 255); ea[band, 2] = np.clip(26 * lum[band], 0, 255)
    edge = (np.abs(np.abs(yy2 - hh * 0.52 - 18 * np.sqrt(np.clip(1 - nxn ** 2, 0, 1))) - 26) < 3)
    ea[edge, 0] = 230; ea[edge, 1] = 186; ea[edge, 2] = 96
    for k in range(40):  # piped gold scrolls on the shell
        ang = k / 40 * 2 * math.pi
        px, py = ww / 2 + math.cos(ang) * ww * 0.3, hh * 0.28 + math.sin(ang) * hh * 0.08
    eggi = Image.fromarray(np.clip(ea, 0, 255).astype(np.uint8), 'RGBA')
    ed = ImageDraw.Draw(eggi)
    for k in range(9):  # piped dots, upper shell
        t = (k - 4) / 4.6
        px = ww / 2 + t * ww * 0.36; py = hh * 0.27 + (t * t) * 30
        ed.ellipse([px - 7, py - 7, px + 7, py + 7], fill=(222, 178, 92, 255))
        ed.ellipse([px - 3, py - 4, px + 1, py], fill=(255, 240, 190, 255))
    for k in range(7):
        t = (k - 3) / 3.6
        px = ww / 2 + t * ww * 0.34; py = hh * 0.77 - (t * t) * 26
        ed.ellipse([px - 6, py - 6, px + 6, py + 6], fill=(222, 178, 92, 255))
    room.alpha_composite(eggi, (int(cx - ww / 2), int(560 - hh + 40)))
    b = bow_sprite(230)
    room.alpha_composite(b, (int(cx - b.width / 2), int(560 - hh + 40 + hh * 0.52 - b.height * 0.42 + 18)))
    # gilt stands of truffles either side
    cake_stand(room, 190, 660, [(168, 0), (126, 150), (84, 290)], 11)
    cake_stand(room, gw - 190, 660, [(168, 0), (126, 150), (84, 290)], 12)
    # front step: nests of foil eggs and rows of pralines
    def nest(nx0, ny0, seed):
        r2 = random.Random(seed)
        shadow(room, nx0, ny0 + 22, 108, 22, 160, 8)
        nd = ImageDraw.Draw(room)
        for k in range(520):
            a = r2.uniform(0, 2 * math.pi); rr = r2.uniform(60, 100)
            x0 = nx0 + math.cos(a) * rr; y0 = ny0 + math.sin(a) * rr * 0.36
            L = r2.uniform(16, 34); t = a + math.pi / 2 + r2.uniform(-0.5, 0.5)
            c = r2.choice([(56, 28, 16), (88, 50, 28), (120, 74, 42), (40, 20, 12)])
            nd.line([(x0, y0), (x0 + math.cos(t) * L, y0 + math.sin(t) * L * 0.4)], fill=c + (255,), width=4)
        for k, (dx, col) in enumerate([(-34, (214, 168, 74)), (0, (176, 40, 30)), (34, (214, 168, 74)), (-14, (66, 33, 20)), (18, (240, 226, 200))]):
            dy = -8 if k < 3 else -26
            paste(room, foil_egg(22, 28, col, seed + k) if col != (66, 33, 20) and col != (240, 226, 200) else ball(22, 28, col, 0.6, seed=k), nx0 + dx, ny0 + dy)
        for k in range(180):
            a = r2.uniform(0, math.pi); rr = r2.uniform(70, 102)
            x0 = nx0 + math.cos(a) * rr; y0 = ny0 + math.sin(a) * rr * 0.36
            L = r2.uniform(14, 30); t = a + math.pi / 2 + r2.uniform(-0.5, 0.5)
            c = r2.choice([(70, 36, 20), (104, 62, 34), (136, 86, 50)])
            nd.line([(x0, y0), (x0 + math.cos(t) * L, y0 + math.sin(t) * L * 0.4)], fill=c + (255,), width=4)
    nest(190, 850, 21)
    nest(gw - 190, 850, 22)
    # pralines in paper cases along the front, centre
    rnd = random.Random(31)
    for row, (y0, n) in enumerate(((760, 6), (880, 5))):
        xs = np.linspace(cx - (n - 1) * 33, cx + (n - 1) * 33, n)
        for x in xs:
            shadow(room, x, y0 + 16, 30, 9, 140, 4)
            pd = ImageDraw.Draw(room)
            pd.polygon([(x - 30, y0 - 4), (x + 30, y0 - 4), (x + 24, y0 + 18), (x - 24, y0 + 18)], fill=(232, 214, 176, 255))
            for k in range(7):
                pd.line([(x - 26 + k * 8.6, y0 - 2), (x - 21 + k * 7, y0 + 16)], fill=(200, 176, 132, 255), width=2)
            paste(room, truffle(rnd.choice(KINDS), 25, rnd.randint(0, 999)), x, y0 - 12)
    # glass: soft painterly finish, then reflections and a faint dusk sheen
    room = room.filter(ImageFilter.ModeFilter(3)).filter(ImageFilter.GaussianBlur(0.6))
    refl = Image.new('L', (gw, gh), 0); rf = ImageDraw.Draw(refl)
    for (x0, wd, a) in ((70, 70, 40), (170, 26, 32), (gw - 330, 110, 26), (gw - 190, 30, 34)):
        rf.polygon([(x0, 0), (x0 + wd, 0), (x0 + wd - 260, gh), (x0 - 260, gh)], fill=a)
    refl = refl.filter(ImageFilter.GaussianBlur(14))
    room.alpha_composite(Image.merge('RGBA', (Image.new('L', (gw, gh), 255), Image.new('L', (gw, gh), 246),
                                              Image.new('L', (gw, gh), 232), refl)))
    vg = np.exp(-((((xx - gw / 2) / (gw * 0.7)) ** 2 + ((yy - gh * 0.45) / (gh * 0.75)) ** 2)))
    va = Image.fromarray(((1 - vg) * 120).astype(np.uint8))
    room.alpha_composite(Image.merge('RGBA', (Image.new('L', (gw, gh), 20), Image.new('L', (gw, gh), 8), Image.new('L', (gw, gh), 4), va)))
    im.alpha_composite(room, (GX0, GY0))
    d = ImageDraw.Draw(im)
    # glazing bars and sill
    d.rectangle([GX0 - 8, GY0 - 8, GX1 + 8, GY0], fill=(58, 26, 18, 255))
    d.rectangle([GX0 - 8, GY0 - 8, GX0, GY1 + 8], fill=(58, 26, 18, 255))
    d.rectangle([GX1, GY0 - 8, GX1 + 8, GY1 + 8], fill=(58, 26, 18, 255))
    d.rectangle([GX0 - 2, GY0 - 2, GX1 + 2, GY1 + 2], outline=(204, 160, 72, 255), width=3)
    d.rectangle([FX0 + 26, GY1 + 18, FX1 - 26, FY1 - 26], fill=(124, 26, 22, 255))
    pw = (FX1 - FX0 - 120 - 2 * 30) / 3
    for k in range(3):
        px = FX0 + 60 + k * (pw + 30)
        d.rectangle([px, GY1 + 34, px + pw, FY1 - 42], outline=(214, 170, 80, 255), width=3)
    sill_y = FY1
    d.rectangle([FX0 - 20, sill_y, FX1 + 20, sill_y + 28], fill=(176, 158, 124, 255))
    d.line([(FX0 - 20, sill_y + 28), (FX1 + 20, sill_y + 28)], fill=(120, 104, 80, 255), width=4)
    # cobbles under the sill
    d.rectangle([0, sill_y + 32, W, H], fill=(120, 108, 92, 255))
    rr = random.Random(5)
    for row in range(4):
        for k in range(30):
            x = k * 46 + (row % 2) * 23 + rr.randint(-4, 4); y = sill_y + 38 + row * 15
            c = rr.randint(130, 168)
            d.ellipse([x, y, x + 40, y + 13], fill=(c, c - 10, c - 24, 255))
    # whole-painting finish: soft grain and warm cast
    out = im.convert('RGB')
    gn = np.random.default_rng(12).normal(0, 5, (H, W, 1))
    arr = np.clip(np.array(out).astype(float) + gn, 0, 255)
    out = Image.fromarray(arr.astype(np.uint8))
    out.save(A('window.jpg'), quality=92)


# ---------------------------------------------------------------- bow and ribbon
def satin(mask, base, seed=0, sheen_ang=0.6):
    m = np.array(mask).astype(float) / 255
    puff = np.array(mask.filter(ImageFilter.GaussianBlur(10))).astype(float) / 255
    h, w = m.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(float)
    sheen = 0.5 + 0.5 * np.sin((xx * math.cos(sheen_ang) + yy * math.sin(sheen_ang)) / 18.0)
    shade = 0.45 + 0.55 * puff + 0.28 * sheen * puff
    col = np.array(base, float)[None, None, :] * shade[..., None]
    col += (np.clip(sheen - 0.82, 0, 1) * 5 * 60 * puff)[..., None]
    return Image.fromarray(np.dstack([np.clip(col, 0, 255), m * 255]).astype(np.uint8), 'RGBA')


def bow_sprite(size):
    S = 4; W = H = size * S
    out = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    c = W / 2
    def loop(sign):
        m = Image.new('L', (W, H), 0); d = ImageDraw.Draw(m)
        pts = []
        for k in range(60):
            t = k / 59 * 2 * math.pi
            r = 1 - 0.55 * (0.5 + 0.5 * math.cos(t))
            x = c + sign * (W * 0.05 + W * 0.42 * (0.5 - 0.5 * math.cos(t)))
            y = H * 0.42 + math.sin(t) * H * 0.21 * (0.35 + 0.65 * (0.5 - 0.5 * math.cos(t))) - (0.5 - 0.5 * math.cos(t)) * H * 0.06
            pts.append((x, y))
        d.polygon(pts, fill=255)
        return m
    for s in (-1, 1):
        tail = Image.new('L', (W, H), 0); td = ImageDraw.Draw(tail)
        x0 = c + s * W * 0.02
        td.polygon([(x0, H * 0.45), (x0 + s * W * 0.1, H * 0.45), (x0 + s * W * 0.3, H * 0.95), (x0 + s * W * 0.22, H * 0.88), (x0 + s * W * 0.16, H * 0.97)], fill=255)
        out.alpha_composite(satin(tail, (140, 26, 22), sheen_ang=1.2 * s))
    for s in (-1, 1):
        lm = loop(s)
        out.alpha_composite(satin(lm, (176, 36, 28), sheen_ang=0.4 * s))
        inner = Image.new('L', (W, H), 0)
        ImageDraw.Draw(inner).ellipse([c + s * W * 0.2 - W * 0.07, H * 0.36, c + s * W * 0.2 + W * 0.07, H * 0.46], fill=255)
        inner = ImageChops.multiply(inner.filter(ImageFilter.GaussianBlur(8)), lm)
        out.alpha_composite(Image.merge('RGBA', (Image.new('L', (W, H), 70), Image.new('L', (W, H), 10), Image.new('L', (W, H), 8), inner.point(lambda v: int(v * 0.35)))))
    k = Image.new('L', (W, H), 0)
    ImageDraw.Draw(k).rounded_rectangle([c - W * 0.08, H * 0.33, c + W * 0.08, H * 0.53], W * 0.05, fill=255)
    out.alpha_composite(satin(k, (196, 44, 34), sheen_ang=1.4))
    return out.resize((size, size), Image.LANCZOS)


def ribbon():
    w, h = 96, 2112
    m = Image.new('L', (w, h), 255)
    arr = np.zeros((h, w, 4))
    x = np.linspace(0, 1, w)
    prof = 0.62 + 0.38 * np.sin(x * math.pi) + 0.25 * np.exp(-((x - 0.34) / 0.07) ** 2)
    base = np.array([168, 34, 26], float)
    arr[..., :3] = base[None, None, :] * prof[None, :, None]
    arr[..., 3] = 255
    arr[:, :4, :3] *= 0.6; arr[:, -4:, :3] *= 0.6
    Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA').save(A('ribbon-v.png'))


# ---------------------------------------------------------------- the painted plate
def plate():
    S = 760; im = Image.new('RGBA', (S, S), (0, 0, 0, 0)); c = S / 2
    d = ImageDraw.Draw(im)
    sh = Image.new('L', (S, S), 0); ImageDraw.Draw(sh).ellipse([30, 46, S - 18, S - 6], fill=150)
    im.putalpha(0); im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    im.alpha_composite(Image.merge('RGBA', (Image.new('L', (S, S), 30), Image.new('L', (S, S), 12), Image.new('L', (S, S), 6), sh.filter(ImageFilter.GaussianBlur(14)))))
    d = ImageDraw.Draw(im)
    R0 = 350
    d.ellipse([c - R0, c - R0, c + R0, c + R0], fill=(236, 220, 186, 255))
    CH, GD, CO, TQ = (168, 36, 26, 255), (206, 156, 58, 255), (70, 36, 22, 255), (40, 108, 104, 255)
    # rim: chilli band with stepped gold pattern
    d.ellipse([c - 340, c - 340, c + 340, c + 340], fill=CH)
    d.ellipse([c - 282, c - 282, c + 282, c + 282], fill=(236, 220, 186, 255))
    for k in range(24):
        a0 = k / 24 * 2 * math.pi
        pts = []
        for j, (rr, da) in enumerate(((290, 0), (290, 0.06), (306, 0.06), (306, 0.12), (322, 0.12), (322, 0.17), (306, 0.17), (306, 0.22), (290, 0.22), (290, 0.26))):
            pts.append((c + math.cos(a0 + da) * rr, c + math.sin(a0 + da) * rr))
        pts += [(c + math.cos(a0 + 0.26) * 288, c + math.sin(a0 + 0.26) * 288), (c + math.cos(a0) * 288, c + math.sin(a0) * 288)]
        d.polygon(pts, fill=GD)
        mx, my = c + math.cos(a0 + 0.13) * 333, c + math.sin(a0 + 0.13) * 333
        d.ellipse([mx - 4, my - 4, mx + 4, my + 4], fill=(240, 224, 190, 255))
    # middle ring of spirals
    for k in range(12):
        a0 = k / 12 * 2 * math.pi
        sx, sy = c + math.cos(a0) * 220, c + math.sin(a0) * 220
        pts = [(sx + math.cos(t * 0.5 + a0) * t * 1.7, sy + math.sin(t * 0.5 + a0) * t * 1.7) for t in np.linspace(0, 26, 80)]
        d.line(pts, fill=CO, width=7, joint='curve')
        tx, ty = c + math.cos(a0 + math.pi / 12) * 230, c + math.sin(a0 + math.pi / 12) * 230
        d.polygon([(tx + math.cos(a0) * 22, ty + math.sin(a0) * 22), (tx + math.cos(a0 + 2.1) * 12, ty + math.sin(a0 + 2.1) * 12),
                   (tx + math.cos(a0 - 2.1) * 12, ty + math.sin(a0 - 2.1) * 12)], fill=TQ)
    d.ellipse([c - 172, c - 172, c + 172, c + 172], outline=CO, width=6)
    d.ellipse([c - 160, c - 160, c + 160, c + 160], outline=GD, width=4)
    # centre: sun with rays, a cacao pod at its heart
    for k in range(16):
        a0 = k / 16 * 2 * math.pi
        d.polygon([(c + math.cos(a0 - 0.12) * 80, c + math.sin(a0 - 0.12) * 80), (c + math.cos(a0) * 146, c + math.sin(a0) * 146),
                   (c + math.cos(a0 + 0.12) * 80, c + math.sin(a0 + 0.12) * 80)], fill=CH if k % 2 else GD)
    d.ellipse([c - 84, c - 84, c + 84, c + 84], fill=GD)
    d.ellipse([c - 70, c - 70, c + 70, c + 70], fill=(236, 220, 186, 255))
    pod = Image.new('L', (S, S), 0); ImageDraw.Draw(pod).ellipse([c - 30, c - 56, c + 30, c + 56], fill=255)
    d.ellipse([c - 30, c - 56, c + 30, c + 56], fill=CO)
    for k in (-14, 0, 14):
        d.line([(c + k, c - 50 + abs(k)), (c + k, c + 50 - abs(k))], fill=(120, 70, 40, 255), width=4)
    # glaze: crackle-free soft sheen and a hint of spin blur on the rim
    arr = np.array(im).astype(float)
    yy, xx = np.mgrid[0:S, 0:S].astype(float)
    sp = np.exp(-(((xx - c * 0.72) ** 2 + (yy - c * 0.62) ** 2) / (2 * 120 ** 2)))
    inside = ((xx - c) ** 2 + (yy - c) ** 2) < R0 ** 2
    arr[..., :3][inside] += (sp[inside] * 70)[:, None]
    out = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA')
    rim = out.rotate(5, resample=Image.BICUBIC, center=(c, c))
    rim2 = out.rotate(-5, resample=Image.BICUBIC, center=(c, c))
    mixed = Image.blend(Image.blend(out, rim, 0.33), rim2, 0.25)
    ring = Image.new('L', (S, S), 0); ImageDraw.Draw(ring).ellipse([c - R0, c - R0, c + R0, c + R0], fill=255)
    ImageDraw.Draw(ring).ellipse([c - 280, c - 280, c + 280, c + 280], fill=0)
    ring = ring.filter(ImageFilter.GaussianBlur(10))
    out = Image.composite(mixed, out, ring)
    out.resize((380, 380), Image.LANCZOS).save(A('plate.png'))


def wear(name, seed, col, strength):
    W, H = 816, 1056; rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(36):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(16))
    mot = Image.new('L', (W // 24, H // 24), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 16))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    lay = Image.new('RGBA', (W, H), col + (0,)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * strength)))
    lay.save(A(f'wear-{name}.png'))


if __name__ == '__main__':
    window()
    bow_sprite(220).save(A('bow.png'))
    ribbon()
    plate()
    wear('front', 2000, (10, 4, 2), 0.7)
    wear('back', 1959, (96, 60, 30), 0.5)
    print('painted')
