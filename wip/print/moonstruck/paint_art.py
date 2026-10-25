"""Line-cut art for the St. Cecilia's bulletin (Moonstruck, 1987).
Every picture is drawn as a tone map, then cut into engraved line work for the black plate
and a coarse dot screen for the ochre plate, with the ochre plate a hair out of register,
the way a bulletin company's preprinted two-colour cover came off the press."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(D, 'assets')
BLACK = (27, 25, 22)
OCHRE = (184, 128, 38)
rng = np.random.default_rng(1987)


def lowfreq(h, w, n, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((n, max(2, int(n * w / h)))).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))


class Plate:
    """Tone, hatch angle and region id, drawn shape by shape at S times the CSS size."""
    def __init__(self, w, h, S=3):
        self.S, self.w, self.h = S, w * S, h * S
        self.tone = Image.new('F', (self.w, self.h), 0.0)
        self.ang = Image.new('F', (self.w, self.h), 0.0)
        self.rid = Image.new('I', (self.w, self.h), 0)
        self.och = Image.new('F', (self.w, self.h), 0.0)
        self.n = 1
        self.dt, self.da, self.dr, self.do = (ImageDraw.Draw(i) for i in (self.tone, self.ang, self.rid, self.och))

    def P(self, pts):
        return [(x * self.S, y * self.S) for x, y in pts]

    def poly(self, pts, tone, ang=0, och=None, edge=True):
        p = self.P(pts)
        self.dt.polygon(p, fill=float(tone)); self.da.polygon(p, fill=float(ang))
        self.n += 1
        if edge: self.dr.polygon(p, fill=self.n)
        if och is not None: self.do.polygon(p, fill=float(och))

    def rect(self, x0, y0, x1, y1, tone, ang=0, och=None, edge=True):
        self.poly([(x0, y0), (x1, y0), (x1, y1), (x0, y1)], tone, ang, och, edge)

    def ellipse(self, cx, cy, rx, ry, tone, ang=0, och=None, edge=True):
        b = [((cx - rx) * self.S, (cy - ry) * self.S), ((cx + rx) * self.S, (cy + ry) * self.S)]
        self.dt.ellipse(b, fill=float(tone)); self.da.ellipse(b, fill=float(ang))
        self.n += 1
        if edge: self.dr.ellipse(b, fill=self.n)
        if och is not None: self.do.ellipse(b, fill=float(och))

    def arch(self, x0, y0, x1, y1, tone, ang=0, och=None):
        """A round-headed opening: rectangle with a half circle on top."""
        r = (x1 - x0) / 2
        pts = [(x0, y1), (x0, y0 + r)]
        for i in range(0, 33):
            t = math.pi + math.pi * i / 32
            pts.append((x0 + r + r * math.cos(t), y0 + r + r * math.sin(t)))
        pts += [(x1, y0 + r), (x1, y1)]
        self.poly(pts, tone, ang, och)

    def line(self, pts, tone, width, ang=0):
        p = self.P(pts)
        self.dt.line(p, fill=float(tone), width=int(width * self.S))
        self.da.line(p, fill=float(ang), width=int(width * self.S))

    def render(self, name, period=2.3, seed=0, outline=1.0, och_shift=(4, 2), tone_mod=None):
        S = self.S
        T = np.asarray(self.tone, dtype=np.float32).copy()
        A = np.deg2rad(np.asarray(self.ang, dtype=np.float32))
        R = np.asarray(self.rid)
        O = np.asarray(self.och, dtype=np.float32)
        h, w = T.shape
        if tone_mod is not None: T = np.clip(T + tone_mod(T, h, w), 0, 1)
        yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
        p = period * S
        wob = lowfreq(h, w, 18, seed + 5) * 0.35 * S + lowfreq(h, w, 90, seed + 6) * 0.05 * S
        # main hatch: line width follows the tone
        d = -xx * np.sin(A) + yy * np.cos(A) + wob
        ph = np.abs((d / p) % 1 - 0.5) * 2
        k = np.clip((T * 1.08 - ph) * p / 2.2 + 0.5, 0, 1)
        k[T < 0.06] = 0
        # cross hatch in the darks
        d2 = xx * np.cos(A) + yy * np.sin(A) + wob
        ph2 = np.abs((d2 / (p * 1.1)) % 1 - 0.5) * 2
        k2 = np.clip(((T - 0.62) * 2.2 - ph2) * p / 2.2 + 0.5, 0, 1)
        ink = np.maximum(k, k2)
        # cut outline where regions meet
        if outline:
            e = np.zeros_like(R, dtype=bool)
            e[:, 1:] |= R[:, 1:] != R[:, :-1]; e[1:, :] |= R[1:, :] != R[:-1, :]
            e &= (R > 0) | np.roll(R > 0, 1, 0) | np.roll(R > 0, 1, 1)
            ei = Image.fromarray((e * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3 if S < 4 else 5))
            ei = ei.filter(ImageFilter.GaussianBlur(0.6))
            ink = np.maximum(ink, np.asarray(ei, dtype=np.float32) / 255 * outline)
        # uneven ink film, a little lighter in patches like a worn plate
        ink *= np.clip(1 - 0.16 * (lowfreq(h, w, 9, seed + 7) * 0.5 + 0.5), 0.7, 1)
        # ochre plate as a 45 degree dot screen
        u = (xx + yy) / math.sqrt(2); v = (xx - yy) / math.sqrt(2)
        q = 2.4 * S
        cu = (u / q) % 1 - 0.5; cv = (v / q) % 1 - 0.5
        dist = np.sqrt(cu * cu + cv * cv)
        rad = np.sqrt(np.clip(O, 0, 1) / math.pi)
        dots = np.clip((rad - dist) * q / 1.4 + 0.5, 0, 1)
        dots[O < 0.04] = 0
        dots = np.roll(dots, och_shift, axis=(1, 0))
        rgba = np.zeros((h, w, 4), np.float32)
        oa = dots * 0.92
        ba = ink * 0.96
        a = ba + oa * (1 - ba)
        col = (np.array(BLACK)[None, None] * ba[..., None] + np.array(OCHRE)[None, None] * (oa * (1 - ba))[..., None]) / np.maximum(a, 1e-4)[..., None]
        rgba[..., :3] = col; rgba[..., 3] = a * 255
        im = Image.fromarray(rgba.astype(np.uint8), 'RGBA')
        im.save(os.path.join(OUT, name), optimize=True)
        print('painted', name, im.size)


def brick(T, h, w):
    yy = np.mgrid[0:h, 0:w][0]
    return ((yy // 9) % 2) * 0.04 + lowfreq(h, w, 50, 11) * 0.05


# ---------- cover: the church on the block under a full moon ----------
def cover():
    W, H = 448, 300
    pl = Plate(W, H)
    S = pl.S
    # sky, lightening toward the horizon and around the moon
    yy, xx = np.mgrid[0:H * S, 0:W * S] / S
    md = np.sqrt((xx - 338) ** 2 + (yy - 84) ** 2)
    sky = 0.36 - yy / H * 0.18 - np.clip(1 - (md - 52) / 90, 0, 1) * 0.36
    pl.tone = Image.fromarray(np.clip(sky, 0.04, 1).astype(np.float32), 'F')
    pl.dt = ImageDraw.Draw(pl.tone)
    glow = np.clip(1 - (md - 50) / 70, 0, 1) ** 1.6 * 0.22
    pl.och = Image.fromarray(glow.astype(np.float32), 'F'); pl.do = ImageDraw.Draw(pl.och)
    # the moon: no black on the face except the seas, ochre dot screen for its colour
    pl.ellipse(338, 84, 52, 52, 0.0, 0, och=0.30)
    # the seas: soft blotches from low noise, cut lightly, deeper ochre
    mar = lowfreq(H * S, W * S, 26, 41)
    inm = md < 50
    seas = np.clip((mar - 0.35) * 0.9, 0, 0.32) * inm
    T0 = np.asarray(pl.tone).copy(); T0[inm] = seas[inm] * 0.55
    O0 = np.asarray(pl.och).copy(); O0[inm] = 0.26 + seas[inm] * 1.1
    pl.tone = Image.fromarray(T0.astype(np.float32), 'F'); pl.dt = ImageDraw.Draw(pl.tone)
    pl.och = Image.fromarray(O0.astype(np.float32), 'F'); pl.do = ImageDraw.Draw(pl.och)
    A0 = np.asarray(pl.ang).copy(); A0[inm] = 28
    pl.ang = Image.fromarray(A0.astype(np.float32), 'F'); pl.da = ImageDraw.Draw(pl.ang)
    # left brownstones
    pl.rect(-4, 124, 118, 282, 0.62, 90)
    pl.rect(-4, 116, 118, 128, 0.28, 0)                  # cornice
    pl.rect(-4, 128, 118, 133, 0.85, 0)                  # shadow under it
    for x in (8, 40, 72):
        for y, lit in ((146, x == 40), (186, False), (226, x == 8)):
            pl.rect(x, y, x + 20, y + 28, 0.12 if lit else 0.88, 45, och=0.55 if lit else None)
            pl.rect(x - 2, y - 4, x + 22, y, 0.25, 0)
    pl.poly([(80, 282), (80, 252), (106, 252), (118, 282)], 0.3, 0)    # stoop
    for i in range(5): pl.line([(80 + i * 7.6, 252 + i * 6), (118, 252 + i * 6)], 0.75, 0.8)
    # bell tower and spire
    pl.rect(120, 44, 178, 282, 0.5, 0, och=None)
    pl.poly([(116, 46), (182, 46), (149, 16)], 0.62, 62)
    pl.line([(149, 17), (149, 2)], 0.95, 1.6); pl.line([(144, 7), (154, 7)], 0.95, 1.6)
    pl.rect(116, 44, 182, 50, 0.22, 0)
    for x in (128, 152):
        pl.arch(x, 60, x + 18, 104, 0.9, 45)
    pl.rect(118, 110, 180, 114, 0.22, 0)
    pl.arch(140, 128, 158, 170, 0.86, 45)
    pl.rect(118, 186, 180, 190, 0.22, 0)
    pl.arch(138, 204, 160, 250, 0.86, 45)
    # nave front with gable
    pl.poly([(178, 282), (178, 118), (249, 58), (322, 118), (322, 282)], 0.42, 0)
    pl.poly([(174, 120), (249, 54), (326, 120), (320, 124), (249, 64), (180, 124)], 0.2, 0)
    pl.ellipse(249, 136, 22, 22, 0.24, 0)
    pl.ellipse(249, 136, 17, 17, 0.88, 45, och=0.35)
    for i in range(8):
        t = i * math.pi / 4
        pl.line([(249, 136), (249 + 17 * math.cos(t), 136 + 17 * math.sin(t))], 0.2, 1.4)
    pl.ellipse(249, 136, 4, 4, 0.2, 0)
    pl.rect(178, 174, 322, 179, 0.22, 0)
    pl.arch(228, 196, 270, 270, 0.88, 90)
    pl.arch(222, 190, 276, 202, 0.22, 0)
    pl.line([(249, 216), (249, 270)], 0.4, 1)
    for x in (188, 290):
        pl.arch(x, 220, x + 22, 270, 0.88, 90)
        pl.arch(x + 3, 186, x + 19, 210, 0.86, 45)
    pl.rect(172, 270, 328, 276, 0.16, 0); pl.rect(166, 276, 334, 282, 0.2, 0)
    # right brownstones, two houses
    for x0, x1, lit in ((322, 386, (0, 1)), (386, 452, (2,))):
        pl.rect(x0, 142, x1, 282, 0.64 if x0 == 322 else 0.58, 90)
        pl.rect(x0, 134, x1, 146, 0.28, 0)
        pl.rect(x0, 146, x1, 151, 0.86, 0)
        n = 0
        for wx in (x0 + 10, x0 + 36):
            for wy in (160, 200):
                isl = n in lit; n += 1
                pl.rect(wx, wy, wx + 18, wy + 26, 0.12 if isl else 0.88, 45, och=0.55 if isl else None)
                pl.rect(wx - 2, wy - 4, wx + 20, wy, 0.24, 0)
        pl.arch(x0 + 36, 236, x0 + 54, 270, 0.86, 90)
        pl.poly([(x0 + 4, 282), (x0 + 30, 244), (x0 + 36, 244), (x0 + 36, 282)], 0.28, 0)
        pl.line([(x0 + 2, 282), (x0 + 30, 240)], 0.95, 1.4)
    # street lamp and the curb
    pl.line([(104, 282), (104, 206)], 0.95, 2.4)
    pl.poly([(97, 206), (111, 206), (108, 192), (100, 192)], 0.15, 0, och=0.6)
    pl.rect(98, 190, 110, 193, 0.9, 0)
    pl.rect(-4, 282, W + 4, 288, 0.12, 0)
    pl.rect(-4, 288, W + 4, H + 4, 0.38, 0)
    pl.render('cover-church-linecut.png', seed=1, tone_mod=lambda T, h, w: np.where((T > 0.38) & (T < 0.7), brick(T, h, w), 0))


# ---------- the dinner dance moon ----------
def dance_moon():
    W = H = 132
    pl = Plate(W, H)
    S = pl.S
    yy, xx = np.mgrid[0:H * S, 0:W * S] / S
    md = np.sqrt((xx - 66) ** 2 + (yy - 66) ** 2)
    inm = md < 56
    mar = lowfreq(H * S, W * S, 7, 43)
    seas = np.clip((mar - 0.25) * 0.5, 0, 0.3)
    rim = np.clip((md - 38) / 18, 0, 1) ** 2 * 0.3 * np.clip((xx + yy - 110) / 60, 0, 1)
    t = np.where(inm, 0.05 + seas + rim, 0)
    pl.tone = Image.fromarray(t.astype(np.float32), 'F'); pl.dt = ImageDraw.Draw(pl.tone)
    pl.ang = Image.fromarray(np.full((H * S, W * S), 20, np.float32), 'F'); pl.da = ImageDraw.Draw(pl.ang)
    o = np.where(inm, 0.26 + seas * 1.2, np.clip(1 - (md - 56) / 12, 0, 1) * 0.12)
    pl.och = Image.fromarray(o.astype(np.float32), 'F'); pl.do = ImageDraw.Draw(pl.och)
    pl.n += 1; pl.dr.ellipse([(10 * S, 10 * S), (122 * S, 122 * S)], fill=pl.n)
    pl.render('dance-moon-linecut.png', period=2.0, seed=2)


# ---------- small advertising cuts ----------
def bread():
    pl = Plate(110, 50)
    pl.ellipse(55, 28, 50, 17, 0.32, 0)
    pl.ellipse(55, 34, 48, 11, 0.5, 0, edge=False)
    for i in range(4):
        x = 24 + i * 20
        pl.poly([(x - 6, 18), (x + 8, 14), (x + 10, 18), (x - 4, 23)], 0.08, 0, edge=False)
        pl.line([(x - 6, 22), (x + 9, 17)], 0.85, 1.2)
    pl.rect(0, 45, 110, 47, 0.9, 0, edge=False)
    pl.render('ad-bread-linecut.png', period=1.8, seed=3)


def wrench():
    pl = Plate(110, 50)
    pl.rect(2, 26, 108, 38, 0.28, 0)                 # copper pipe
    pl.rect(2, 34, 108, 38, 0.6, 0, edge=False)
    pl.rect(40, 23, 52, 41, 0.45, 0)                 # coupling
    a = math.radians(-24)
    def R(x, y): return (56 + x * math.cos(a) - y * math.sin(a), 22 + x * math.sin(a) + y * math.cos(a))
    pl.poly([R(-46, -3), R(30, -3), R(30, 3), R(-46, 3)], 0.7, 66)
    pl.poly([R(26, -9), R(46, -9), R(46, -3), R(34, -3), R(34, 3), R(46, 3), R(46, 9), R(26, 9)], 0.55, 66)
    pl.render('ad-wrench-linecut.png', period=1.8, seed=4, och_shift=(0, 0))


def plane():
    pl = Plate(120, 46)
    pl.poly([(6, 24), (14, 18), (100, 16), (112, 20), (114, 24), (110, 28), (14, 30)], 0.18, 0)
    pl.poly([(10, 19), (2, 4), (12, 4), (26, 18)], 0.55, 60)
    pl.poly([(8, 24), (0, 22), (0, 26), (16, 27)], 0.55, 0)
    pl.poly([(52, 26), (36, 42), (46, 42), (74, 26)], 0.6, 120)
    pl.ellipse(52, 34, 7, 3.4, 0.75, 0)
    for x in range(22, 100, 5): pl.rect(x, 20, x + 2, 22, 0.9, 0, edge=False)
    pl.rect(14, 26, 112, 30, 0.42, 0, edge=False)
    pl.render('ad-plane-linecut.png', period=1.6, seed=5)


def ring():
    pl = Plate(50, 50)
    pl.ellipse(25, 32, 15, 13, 0.55, 0)
    pl.ellipse(25, 32, 11, 9.4, 0.0, 0)
    pl.poly([(18, 18), (32, 18), (36, 13), (25, 4), (14, 13)], 0.1, 0)
    pl.poly([(18, 18), (25, 4), (21, 13)], 0.5, 45, edge=False)
    pl.poly([(32, 18), (36, 13), (28, 13)], 0.4, 45, edge=False)
    pl.render('ad-ring-linecut.png', period=1.5, seed=6, och_shift=(0, 0))


def thermometer():
    """The roof fund thermometer, drawn by hand on the bulletin board and pasted up."""
    W, H = 64, 250
    pl = Plate(W, H)
    pl.rect(22, 10, 42, 214, 0.06, 0)
    pl.ellipse(32, 224, 18, 18, 0.06, 0)
    fill_top = 10 + (1 - 0.68) * 204
    pl.rect(26, fill_top, 38, 220, 0.0, 0, och=0.72, edge=False)
    pl.ellipse(32, 224, 13, 13, 0.0, 0, och=0.8, edge=False)
    for i in range(11):
        y = 14 + i * 19.6
        pl.line([(42, y), (52 if i % 5 == 0 else 48, y)], 0.95, 1.1)
    pl.render('roof-fund-thermometer.png', period=1.6, seed=7, och_shift=(1, 1))


if __name__ == '__main__':
    os.makedirs(OUT, exist_ok=True)
    cover(); dance_moon(); plane(); ring(); thermometer()
