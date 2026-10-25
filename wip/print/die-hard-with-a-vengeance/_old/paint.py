"""Paints clip art and wear for the Chester A. Arthur Elementary lunch calendar
(Die Hard with a Vengeance, 1995). The office pasted up teacher's-book pen-and-ink clip art,
then ran the sheet off on a tired photocopier onto pale green stock. So every drawing is a
wobbly inked line with hatching, then pushed through a copier pass: toner fill-in, broken
thin lines and stray specks.
Writes assets/carton.png, elephant.png, jug.png, chickwaffle.png, sun.png, scissors.png,
crumb.png, wear-front.png, wear-back.png."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
INK = (24, 26, 24)
FW, FH = 816, 1056
S = 6  # work scale relative to page px; saved at 2x
WEIGHT = 1.45  # 1990s school clip art: heavy marker line, solid black fills


class Pen:
    def __init__(self, w, h, seed):
        self.w, self.h = w, h
        self.im = Image.new('L', (w * S, h * S), 0)
        self.d = ImageDraw.Draw(self.im)
        self.r = np.random.default_rng(seed)

    def line(self, pts, wd=2.2, wob=0.7, taper=True):
        """inked stroke along a polyline in page px, with hand wobble and pressure"""
        pts = np.array(pts, float)
        seg = np.hypot(*np.diff(pts, axis=0).T)
        L = seg.sum()
        n = max(8, int(L * 1.5))
        t = np.concatenate([[0], np.cumsum(seg)]) / max(L, 1e-6)
        ts = np.linspace(0, 1, n)
        x = np.interp(ts, t, pts[:, 0]); y = np.interp(ts, t, pts[:, 1])
        k = self.r.normal(0, 1, (2, int(L / 22) + 3))
        nx = np.interp(np.linspace(0, len(k[0]) - 1, n), np.arange(len(k[0])), k[0]) * wob
        ny = np.interp(np.linspace(0, len(k[1]) - 1, n), np.arange(len(k[1])), k[1]) * wob
        x += nx; y += ny
        pr = np.ones(n)
        if taper:
            pr = 0.55 + 0.45 * np.sin(np.pi * np.clip(ts * 1.15 - 0.07, 0, 1)) ** 0.5
        pr *= 1 + 0.12 * np.interp(np.linspace(0, 5, n), np.arange(6), self.r.normal(0, 1, 6))
        for i in range(n):
            rr = wd * WEIGHT * pr[i] * S / 2
            cx, cy = x[i] * S, y[i] * S
            self.d.ellipse((cx - rr, cy - rr, cx + rr, cy + rr), fill=255)

    def ellipse(self, cx, cy, rx, ry, wd=2.2, a0=0, a1=360, rot=0, wob=0.7):
        ts = np.radians(np.linspace(a0, a1, max(12, int((a1 - a0) / 4))))
        c, s = math.cos(math.radians(rot)), math.sin(math.radians(rot))
        pts = [(cx + rx * math.cos(t) * c - ry * math.sin(t) * s, cy + rx * math.cos(t) * s + ry * math.sin(t) * c) for t in ts]
        self.line(pts, wd, wob, taper=(a1 - a0) < 350)

    def hatch(self, poly_fn, ang=45, gap=4.0, wd=1.0):
        """shadow areas: solid black fill, as the clip-art books printed them"""
        poly_fn(self.d, S)
        return
        m = Image.new('L', self.im.size, 0)
        poly_fn(ImageDraw.Draw(m), S)
        h = Image.new('L', self.im.size, 0)
        hd = ImageDraw.Draw(h)
        W, H = self.w, self.h
        a = math.radians(ang)
        dx, dy = math.cos(a), math.sin(a)
        R = W + H
        k = -R
        while k < R:
            ox, oy = W / 2 - dy * k, H / 2 + dx * k
            j = self.r.normal(0, 0.35)
            hd.line(((ox - dx * R + j) * S, (oy - dy * R) * S, (ox + dx * R + j) * S, (oy + dy * R) * S), fill=255, width=max(1, int(wd * S)))
            k += gap
        self.im.paste(255, (0, 0), Image.fromarray(np.minimum(np.asarray(m), np.asarray(h))))

    def blot(self, poly_fn):
        poly_fn(self.d, S)

    def erase(self, poly_fn):
        poly_fn(ImageDraw.Draw(self.im), S, 0)

    def save(self, name, seed=0):
        copier(self.im, self.w, self.h, name, seed)


def copier(mask, w, h, name, seed):
    """toner pass: soften, add low-frequency density drift, re-threshold, a few specks, save at 2x"""
    r = np.random.default_rng(seed + 31)
    m = mask.filter(ImageFilter.GaussianBlur(S * 0.45))
    a = np.asarray(m, float) / 255
    H, W = a.shape
    drift = Image.fromarray((r.random((H // 40 + 2, W // 40 + 2)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    drift = np.asarray(drift.filter(ImageFilter.GaussianBlur(12)), float) / 255
    a = a * (0.86 + 0.28 * drift)
    a = np.clip((a - 0.40) / 0.22, 0, 1)
    # stray toner specks near the art
    sp = np.zeros_like(a)
    for _ in range(int(w * h / 900)):
        x, y = int(r.integers(6, W - 6)), int(r.integers(6, H - 6))
        rad = r.uniform(0.4, 1.0) * S * 0.5
        yy, xx = np.ogrid[max(0, y - 6):y + 6, max(0, x - 6):x + 6]
        sp[max(0, y - 6):y + 6, max(0, x - 6):x + 6] = np.maximum(sp[max(0, y - 6):y + 6, max(0, x - 6):x + 6], ((xx - x) ** 2 + (yy - y) ** 2 < rad ** 2) * 0.85)
    a = np.maximum(a, sp)
    im = Image.fromarray((a * 255).astype(np.uint8)).resize((w * 2, h * 2), Image.LANCZOS)
    out = Image.new('RGBA', (w * 2, h * 2), INK + (0,))
    out.putalpha(im)
    out.save(os.path.join(A, name))


def poly(pts):
    return lambda d, s, f=255: d.polygon([(x * s, y * s) for x, y in pts], fill=f)


def ell(cx, cy, rx, ry):
    return lambda d, s, f=255: d.ellipse(((cx - rx) * s, (cy - ry) * s, (cx + rx) * s, (cy + ry) * s), fill=f)


def carton(w=118, h=150):
    """gable-top half pint of milk, front panel lettered, side panel hatched"""
    p = Pen(w, h, 3)
    F = [(14, 52), (64, 52), (64, 142), (14, 142)]          # front face
    Sd = [(64, 52), (100, 40), (100, 128), (64, 142)]        # side face
    p.hatch(poly(Sd), 70, 3.6, 0.9)
    p.line([(14, 52), (14, 142), (64, 142), (100, 128), (100, 40)], 2.6)
    p.line([(64, 52), (64, 142)], 2.2)
    # gable roof
    p.line([(14, 52), (39, 22), (64, 52)], 2.4)
    p.line([(39, 22), (76, 12), (100, 40)], 2.4)
    p.line([(64, 52), (100, 40)], 2.0)
    p.hatch(poly([(64, 52), (39, 22), (76, 12), (100, 40)]), -20, 4.2, 0.8)
    p.line([(33, 16), (72, 6)], 3.2)                          # sealed fin
    p.line([(36, 20), (34, 15)], 1.6); p.line([(73, 10), (71, 5)], 1.6)
    # lettering band
    p.line([(20, 74), (58, 74)], 1.4); p.line([(20, 104), (58, 104)], 1.4)
    for x0 in (22, 33, 41, 49):
        pass
    # M I L K hand lettered
    p.line([(22, 99), (22, 79), (27, 90), (32, 79), (32, 99)], 2.2, 0.3)
    p.line([(37, 79), (37, 99)], 2.2, 0.3)
    p.line([(42, 79), (42, 99), (48, 99)], 2.2, 0.3)
    p.line([(51, 79), (51, 99)], 2.2, 0.3); p.line([(57, 79), (51, 90), (57, 99)], 2.2, 0.3)
    # a little cow face on the panel
    p.ellipse(39, 124, 9, 7, 1.6)
    p.ellipse(39, 130, 6, 3.4, 1.3)
    p.line([(31, 118), (26, 116), (24, 111)], 1.6); p.line([(47, 118), (52, 116), (54, 111)], 1.6)
    p.line([(31, 118), (28, 120)], 1.4); p.line([(47, 118), (50, 120)], 1.4)
    p.blot(ell(35, 133, 1.0, 1.0)); p.blot(ell(43, 133, 1.0, 1.0))
    p.blot(ell(35.5, 121.5, 1.3, 1.3)); p.blot(ell(42.5, 121.5, 1.3, 1.3))
    p.save('carton.png', 3)


def elephant(w=168, h=124):
    p = Pen(w, h, 5)
    # body outline
    p.ellipse(98, 58, 52, 34, 2.6, 200, 520)
    # belly shading
    # legs
    for x in (60, 80, 118, 136):
        p.line([(x, 80), (x - 1, 114), (x + 13, 114), (x + 13, 84)], 2.4)
        p.line([(x + 1, 111), (x + 4, 111)], 1.2); p.line([(x + 6, 112), (x + 9, 112)], 1.2)
    # head and ear
    p.ellipse(44, 46, 26, 28, 2.6, 120, 420)
    p.ellipse(60, 46, 17, 23, 2.2, -100, 210, rot=8)
    p.ellipse(60, 50, 9, 13, 1.2, 100, 260)
    # trunk up and curled, as for a parade
    p.line([(21, 56), (14, 72), (13, 90), (17, 104), (27, 108), (33, 101), (27, 96)], 2.6, 0.4)
    p.line([(30, 66), (25, 78), (24, 92), (27, 96)], 2.0, 0.4)
    for yy in (78, 85, 92):
        p.line([(13, yy), (22, yy + 1)], 1.0, 0.2)
    p.line([(26, 66), (16, 70)], 1.6)                          # tusk
    p.blot(ell(36, 40, 2.4, 2.6))
    p.line([(31, 33), (39, 32)], 1.4)
    p.line([(150, 56), (162, 74), (159, 80)], 1.8)               # tail
    p.line([(157, 78), (163, 84)], 1.2); p.line([(160, 77), (165, 81)], 1.2)
    # ground line
    p.line([(46, 117), (156, 117)], 1.2, 0.4)
    p.save('elephant.png', 5)


def jug(w=140, h=160):
    p = Pen(w, h, 7)
    # glass pitcher body, slight belly
    left = [(26, 34), (20, 70), (18, 112), (24, 146)]
    right = [(92, 34), (98, 70), (100, 112), (94, 146)]
    p.line(left, 2.6); p.line(right, 2.6)
    p.ellipse(59, 146, 35, 6, 2.6, 0, 180)
    p.ellipse(59, 34, 33, 6, 2.2)
    p.line([(26, 32), (16, 22), (24, 26)], 2.2)                  # spout
    # handle
    p.line([(96, 50), (118, 52), (124, 80), (118, 110), (100, 116)], 3.2)
    p.line([(98, 58), (114, 60), (117, 82), (112, 104), (100, 108)], 1.6)
    # lemonade level and hatched glass shading on the right
    p.ellipse(59, 56, 38, 5, 1.6, 0, 180)
    p.hatch(poly([(84, 60), (96, 62), (98, 112), (92, 144), (82, 144)]), 80, 3.4, 0.9)
    # ice cubes and slices in the drink
    for cx, cy, a in ((40, 82, 8), (60, 98, -12), (44, 120, 20)):
        c, s = math.cos(math.radians(a)), math.sin(math.radians(a))
        q = [(-7, -7), (7, -7), (7, 7), (-7, 7), (-7, -7)]
        p.line([(cx + x * c - y * s, cy + x * s + y * c) for x, y in q], 1.4, 0.3, taper=False)
    p.ellipse(72, 76, 10, 10, 1.8)
    p.ellipse(72, 76, 6.5, 6.5, 1.0)
    for a in range(0, 360, 45):
        t = math.radians(a)
        p.line([(72, 76), (72 + 6 * math.cos(t), 76 + 6 * math.sin(t))], 0.9, 0.1, taper=False)
    # a whole lemon and a half on the table
    p.ellipse(120, 140, 16, 11, 2.2, rot=-15)
    p.line([(103, 145), (99, 147)], 1.8); p.line([(137, 136), (140, 134)], 1.8)
    p.hatch(lambda d, s, f=255: d.chord(((104) * s, (130) * s, (136) * s, (151) * s), 10, 150, fill=f), 30, 3.2, 0.8)
    for x in (34, 54, 76):
        p.line([(x, 40), (x + 2, 46)], 1.0, 0.2)
    p.save('jug.png', 7)


def chickwaffle(w=168, h=120):
    p = Pen(w, h, 9)
    # waffle square in perspective
    tl, tr, br, bl = (10, 62), (98, 50), (126, 96), (34, 112)
    p.line([tl, tr, br, bl, tl], 2.6, 0.5, taper=False)
    p.line([bl, (34, 117), (126, 101), br], 2.0, 0.4)             # thickness
    for i in range(1, 6):
        t = i / 6
        a = (tl[0] + (tr[0] - tl[0]) * t, tl[1] + (tr[1] - tl[1]) * t)
        b = (bl[0] + (br[0] - bl[0]) * t, bl[1] + (br[1] - bl[1]) * t)
        p.line([a, b], 1.5, 0.3, taper=False)
        a = (tl[0] + (bl[0] - tl[0]) * t, tl[1] + (bl[1] - tl[1]) * t)
        b = (tr[0] + (br[0] - tr[0]) * t, tr[1] + (br[1] - tr[1]) * t)
        p.line([a, b], 1.5, 0.3, taper=False)
    # fried drumstick on top, hiding the grid beneath it
    p.erase(lambda d, s, f=0: d.ellipse((54 * s, 22 * s, 114 * s, 66 * s), fill=f))
    p.erase(poly([(104, 48), (142, 60), (140, 80), (100, 64)]))
    p.ellipse(84, 44, 30, 21, 2.6, rot=-18)
    p.line([(108, 50), (138, 64)], 2.4); p.line([(104, 60), (134, 72)], 2.4)
    p.ellipse(141, 64, 6, 6, 2.0, -110, 140); p.ellipse(137, 74, 6, 6, 2.0, -40, 220)
    # craggy crust ticks
    r = np.random.default_rng(4)
    for _ in range(22):
        a = r.uniform(0, 2 * math.pi); rr = r.uniform(0.2, 0.85)
        cx, cy = 84 + 26 * rr * math.cos(a), 44 + 17 * rr * math.sin(a)
        p.line([(cx, cy), (cx + r.uniform(-3, 3), cy + r.uniform(2, 4))], 1.2, 0.2, taper=False)
    p.hatch(lambda d, s, f=255: d.chord(((56) * s, (26) * s, (112) * s, (64) * s), 0, 150, fill=f), 50, 3.4, 0.9)
    # honey drip
    p.line([(36, 66), (50, 70), (64, 66)], 1.8, 0.4)
    p.line([(50, 70), (50, 80)], 1.6, 0.2); p.blot(ell(50, 81, 2.2, 2.6))
    p.save('chickwaffle.png', 9)


def crumb(w=128, h=96):
    p = Pen(w, h, 13)
    # a square of crumb cake, crumbs heaped on top
    p.line([(16, 50), (78, 40), (114, 58), (52, 72), (16, 50)], 2.4, 0.4, taper=False)
    p.line([(16, 50), (16, 76), (52, 92), (114, 80), (114, 58)], 2.4, 0.4)
    p.line([(52, 72), (52, 92)], 2.0)
    p.hatch(poly([(52, 72), (114, 58), (114, 80), (52, 92)]), 75, 3.4, 0.9)
    p.line([(18, 60), (52, 79), (112, 66)], 1.2, 0.5)            # crumb layer line
    r = np.random.default_rng(13)
    for _ in range(34):
        cx, cy = r.uniform(26, 104), r.uniform(42, 66)
        if cy > 40 + (cx - 16) * 0.3 + 14 and cx < 60:
            continue
        p.ellipse(cx, cy - 5, r.uniform(2.6, 4.6), r.uniform(2.2, 3.6), 1.4, wob=0.3)
    p.save('crumb.png', 13)


def roll(w=150, h=96):
    """kaiser roll sandwich: domed top with the pinwheel cuts, bacon and egg peeking out"""
    p = Pen(w, h, 23)
    p.ellipse(74, 44, 60, 30, 2.6, 180, 360)                       # dome
    p.line([(14, 44), (134, 44)], 2.0, 0.5)
    for a in (200, 236, 272, 308, 344):                            # kaiser cuts curling to the crown
        t = math.radians(a)
        p.line([(74 + 52 * math.cos(t), 44 + 25 * math.sin(t)), (74 + 30 * math.cos(t + 0.5), 40 + 14 * math.sin(t + 0.5)), (74, 30)], 1.5, 0.3)
    p.hatch(lambda d, s, f=255: d.chord((14 * s, 14 * s, 134 * s, 74 * s), 300, 360, fill=f), 60, 3.6, 0.9)
    # wavy bacon
    p.line([(10, 50), (24, 46), (40, 54), (58, 47), (76, 55), (94, 47), (112, 55), (128, 48), (140, 53)], 2.2, 0.3)
    p.line([(12, 56), (26, 52), (42, 60), (60, 53), (78, 61), (96, 53), (114, 61), (130, 54), (138, 58)], 1.6, 0.3)
    # egg white spilling over, cheese corner
    p.line([(20, 60), (16, 66), (30, 66), (44, 64)], 2.0, 0.4)
    p.line([(104, 62), (126, 70), (124, 62)], 1.8, 0.3)
    # bottom bun
    p.line([(16, 66), (18, 80), (40, 88), (108, 88), (130, 80), (132, 66)], 2.6, 0.5)
    p.hatch(poly([(22, 80), (128, 80), (108, 87), (40, 87)]), 20, 3.4, 0.9)
    for cx, cy in ((44, 26), (60, 22), (90, 22), (104, 28), (76, 20)):
        p.ellipse(cx, cy, 1.6, 1.0, 1.0, wob=0.1)                  # poppy seeds
    p.save('roll.png', 23)


def lunchline(w=232, h=150):
    """three kids with trays shuffling toward the counter, a lunch lady in a hairnet serving"""
    p = Pen(w, h, 29)
    floor = 142
    p.line([(4, floor), (228, floor)], 1.4, 0.5)
    # counter with sneeze guard on the right
    p.line([(160, 92), (228, 92)], 2.6, 0.4)
    p.line([(160, 92), (160, floor)], 2.4, 0.4)
    p.hatch(poly([(162, 96), (228, 96), (228, floor - 2), (162, floor - 2)]), 75, 4.0, 0.9)
    p.line([(166, 60), (228, 56)], 1.6, 0.3); p.line([(168, 60), (168, 90)], 1.4, 0.2)
    p.erase(poly([(176, 98), (222, 98), (222, 118), (176, 118)]))
    p.line([(176, 98), (222, 98), (222, 118), (176, 118), (176, 98)], 1.4, 0.3, taper=False)
    # lunch lady behind the counter
    p.ellipse(198, 40, 13, 14, 2.2)
    p.ellipse(198, 30, 14, 7, 1.4, 180, 360)                         # hairnet
    for x in range(186, 212, 4):
        p.line([(x, 25), (x + 2, 31)], 0.8, 0.1, taper=False)
    p.blot(ell(193, 39, 1.3, 1.5)); p.blot(ell(203, 39, 1.3, 1.5))
    p.ellipse(198, 45, 5, 3, 1.3, 20, 160)
    smock = [(186, 55), (210, 55), (218, 92), (178, 92)]
    p.line([(178, 92), (182, 64), (186, 55), (198, 58), (210, 55), (214, 64), (218, 92)], 2.2, 0.3)
    p.line([(192, 58), (198, 70), (204, 58)], 1.4, 0.2)                # collar
    p.hatch(poly([(186, 72), (210, 72), (216, 92), (180, 92)]), 30, 3.4, 0.8)
    p.blot(ell(198, 76, 1.4, 1.4)); p.blot(ell(198, 84, 1.4, 1.4))
    p.line([(184, 62), (174, 76), (164, 78)], 2.2)                    # arm with serving spoon
    p.line([(164, 78), (150, 82)], 1.8)
    p.ellipse(146, 83, 5, 3, 1.6, 0, 200)
    def kid(x, top, hair, seed):
        r = np.random.default_rng(seed)
        hy = top + 12
        p.ellipse(x, hy, 11, 12, 2.2)
        if hair == 'curly':
            for a in range(190, 350, 22):
                t = math.radians(a)
                p.ellipse(x + 11 * math.cos(t), hy + 12 * math.sin(t), 4, 4, 1.6, wob=0.2)
        elif hair == 'pony':
            p.ellipse(x, hy - 2, 12, 11, 2.0, 180, 360)
            p.hatch(lambda d, s, f=255: d.chord(((x - 12) * s, (hy - 13) * s, (x + 12) * s, (hy + 9) * s), 180, 360, fill=f), -40, 2.6, 0.8)
            p.line([(x - 11, hy - 2), (x - 18, hy + 8), (x - 15, hy + 14)], 2.4)
        else:  # ball cap
            p.blot(lambda d, s, f=255: d.chord(((x - 12) * s, (hy - 14) * s, (x + 12) * s, (hy + 6) * s), 180, 360, fill=f))
            p.line([(x + 4, hy - 4), (x + 18, hy - 3)], 3.0)
        p.blot(ell(x + 3, hy + 1, 1.2, 1.4)); p.blot(ell(x + 8, hy + 1, 1.2, 1.4))
        p.ellipse(x + 5, hy + 5, 3.5, 2.2, 1.2, 20, 160)
        by = hy + 12
        # shirt, hatched, with stripes on one kid
        body = [(x - 10, by), (x + 10, by), (x + 12, by + 30), (x - 12, by + 30)]
        p.line(body + [body[0]], 2.2, 0.3, taper=False)
        if seed % 2:
            for k in range(6, 30, 7):
                p.line([(x - 11, by + k), (x + 11, by + k)], 1.4, 0.2, taper=False)
        else:
            p.hatch(poly(body), 60, 3.2, 0.8)
        # legs and sneakers
        p.line([(x - 6, by + 40), (x - 7, floor - 4)], 2.4); p.line([(x + 6, by + 40), (x + 7, floor - 4)], 2.4)
        p.blot(ell(x - 5, floor - 3, 6, 3)); p.blot(ell(x + 10, floor - 3, 6, 3))
        # arms out holding a tray with a milk and a plate
        ty = by + 12
        p.line([(x + 9, by + 4), (x + 18, ty + 2)], 2.0); p.line([(x - 8, by + 6), (x + 6, ty + 4)], 2.0)
        p.line([(x + 4, ty), (x + 28, ty - 2), (x + 31, ty + 2), (x + 7, ty + 5), (x + 4, ty)], 1.8, 0.2, taper=False)
        p.ellipse(x + 13, ty - 1, 6, 2.2, 1.2)
        p.line([(x + 21, ty - 1), (x + 21, ty - 9), (x + 24, ty - 13), (x + 27, ty - 9), (x + 27, ty - 2)], 1.3, 0.1, taper=False)
        # shorts
        p.line([(x - 12, by + 30), (x - 11, by + 40), (x - 1, by + 40), (x, by + 34), (x + 1, by + 40), (x + 11, by + 40), (x + 12, by + 30)], 1.8, 0.2, taper=False)
    kid(20, 58, 'pony', 2)
    kid(70, 48, 'cap', 3)
    kid(120, 62, 'curly', 4)
    p.save('lunchline.png', 29)


def skillet(w=150, h=92):
    """black iron pan with a fried egg and two strips of bacon, steam rising"""
    p = Pen(w, h, 31)
    p.blot(lambda d, s, f=255: d.rounded_rectangle((96 * s, 52 * s, 146 * s, 62 * s), radius=5 * s, fill=f))   # handle
    p.blot(ell(58, 60, 54, 26))                                    # pan, solid
    p.erase(ell(58, 57, 46, 20))                                   # cooking surface
    p.ellipse(58, 57, 46, 20, 1.6, wob=0.3)
    # egg white, wavy edge, and yolk
    pts = [(30 + 18 * math.cos(t) * (1 + 0.12 * math.sin(5 * t)), 57 + 11 * math.sin(t) * (1 + 0.12 * math.cos(4 * t))) for t in np.linspace(0, 2 * math.pi, 40)]
    p.line(pts, 1.8, 0.2, taper=False)
    p.blot(ell(30, 56, 7, 6)); p.erase(ell(28, 54, 2, 1.6))
    # bacon: wavy strips with solid stripes
    for off in (0, 9):
        top = [(54 + k * 4, 49 + off + 3 * math.sin(k * 1.2)) for k in range(10)]
        bot = [(x, y + 6) for x, y in top]
        p.line(top, 1.8, 0.2, taper=False); p.line(bot, 1.8, 0.2, taper=False)
        p.line([(x, y + 3) for x, y in top][1:-1], 2.2, 0.1, taper=False)
    # steam
    for x in (40, 62, 84):
        p.line([(x, 30), (x - 4, 22), (x + 2, 14), (x - 2, 6)], 2.0, 0.2)
    p.save('skillet.png', 31)


def tray(w=232, h=150):
    """cafeteria tray from above: milk carton, apple, sandwich half, fruit cup, spoon"""
    p = Pen(w, h, 37)
    p.blot(lambda d, s, f=255: d.rounded_rectangle((14 * s, 30 * s, 228 * s, 146 * s), radius=14 * s, fill=f))  # shadow
    p.erase(lambda d, s, f=0: d.rounded_rectangle((6 * s, 22 * s, 220 * s, 138 * s), radius=14 * s, fill=f))
    p.line([(20, 22), (206, 22)], 2.4, 0.3, taper=False)
    p.line([(20, 138), (206, 138)], 2.4, 0.3, taper=False)
    p.ellipse(20, 36, 14, 14, 2.4, 180, 270, wob=0.2); p.ellipse(206, 36, 14, 14, 2.4, 270, 360, wob=0.2)
    p.ellipse(20, 124, 14, 14, 2.4, 90, 180, wob=0.2); p.ellipse(206, 124, 14, 14, 2.4, 0, 90, wob=0.2)
    p.line([(6, 36), (6, 124)], 2.4, 0.3, taper=False); p.line([(220, 36), (220, 124)], 2.4, 0.3, taper=False)
    p.line([(112, 30), (112, 130)], 1.8, 0.3); p.line([(118, 80), (212, 80)], 1.8, 0.3)
    # sandwich half: triangle with crust and a solid filling edge
    p.line([(22, 120), (98, 120), (22, 44), (22, 120)], 2.4, 0.3, taper=False)
    p.line([(30, 112), (82, 112), (30, 60), (30, 112)], 1.4, 0.3, taper=False)
    p.blot(poly([(22, 120), (98, 120), (96, 126), (22, 126)]))
    # apple, solid with a white shine and a leaf
    p.blot(ell(146, 52, 15, 15)); p.blot(ell(160, 52, 15, 15))
    p.erase(ell(143, 46, 3, 6))
    p.line([(153, 38), (156, 28)], 2.2); p.blot(lambda d, s, f=255: d.chord((156 * s, 24 * s, 178 * s, 36 * s), 180, 360, fill=f))
    # half pint of milk, front face open, side solid
    p.line([(184, 36), (204, 36), (204, 70), (184, 70), (184, 36)], 2.0, 0.2, taper=False)
    p.blot(poly([(204, 36), (212, 31), (212, 64), (204, 70)]))
    p.line([(184, 36), (194, 28), (204, 36)], 1.8, 0.2)
    p.line([(187, 50), (201, 50)], 1.2, 0.1, taper=False); p.line([(187, 58), (201, 58)], 1.2, 0.1, taper=False)
    # fruit cup with a spoon
    p.ellipse(150, 108, 22, 16, 2.4); p.ellipse(150, 108, 16, 11, 1.4)
    for cx, cy in ((144, 104), (154, 110), (148, 113), (158, 103)):
        p.blot(ell(cx, cy, 2.6, 2.2))
    p.line([(180, 96), (210, 126)], 2.6); p.blot(ell(178, 94, 5, 3.4))
    p.save('tray.png', 37)


def beachball(w=150, h=104):
    """beach ball with solid panels next to a pail and shovel, for the summer box"""
    p = Pen(w, h, 41)
    cx, cy, r = 48, 54, 38
    # curved panels: meridian coordinate u across the ball, alternate bands solid
    W, H = p.im.size
    yy, xx = np.mgrid[0:H, 0:W] / S
    dx, dy = xx - cx, yy - cy
    inside = dx ** 2 + dy ** 2 < r ** 2
    half = np.sqrt(np.clip(r ** 2 - dy ** 2, 1e-6, None))
    u = dx / half + 0.25 * (dy / r)
    band = ((u < -0.62) | ((u > -0.12) & (u < 0.38))) & inside & (dx ** 2 + (dy + r * 0.86) ** 2 > (r * 0.3) ** 2)
    arr = np.maximum(np.asarray(p.im), (band * 255).astype(np.uint8))
    p.im.paste(Image.fromarray(arr)); p.d = ImageDraw.Draw(p.im)
    for u0 in (-0.62, -0.12, 0.38):
        pts = [(cx + (u0 - 0.25 * t) * math.sqrt(max(r * r - (t * r) ** 2, 0)), cy + t * r) for t in np.linspace(-0.97, 0.97, 30)]
        p.line(pts, 1.6, 0.2, taper=False)
    p.ellipse(cx, cy, r, r, 2.6, wob=0.2)
    p.ellipse(cx, cy - r * 0.86, r * 0.3, r * 0.14, 2.0, wob=0.1)
    p.erase(lambda d, s, f=0: d.ellipse(((cx - 24) * s, (cy - 24) * s, (cx - 15) * s, (cy - 10) * s), fill=f))
    p.line([(10, 98), (140, 98)], 1.6, 0.4)
    # pail
    p.line([(98, 52), (102, 96), (134, 96), (138, 52)], 2.4, 0.3)
    p.ellipse(118, 52, 20, 5, 2.2, wob=0.2)
    p.blot(poly([(99, 66), (137, 66), (136, 76), (100, 76)]))
    p.ellipse(118, 52, 22, 22, 1.8, 200, 340, wob=0.2)
    # shovel leaning in
    p.line([(128, 50), (146, 14)], 2.4)
    p.blot(poly([(143, 6), (150, 10), (148, 22), (140, 18)]))
    p.save('beachball.png', 41)


def sun(w=120, h=120):
    p = Pen(w, h, 17)
    p.ellipse(60, 60, 26, 26, 2.8)
    for i in range(16):
        a = math.radians(i * 22.5)
        r0, r1 = (34, 54) if i % 2 == 0 else (34, 46)
        p.line([(60 + r0 * math.cos(a), 60 + r0 * math.sin(a)), (60 + r1 * math.cos(a), 60 + r1 * math.sin(a))], 2.4, 0.3)
    # sunglasses and grin
    p.blot(lambda d, s, f=255: d.rounded_rectangle(((44) * s, (50) * s, (58) * s, (60) * s), radius=3 * s, fill=f))
    p.blot(lambda d, s, f=255: d.rounded_rectangle(((62) * s, (50) * s, (76) * s, (60) * s), radius=3 * s, fill=f))
    p.line([(57, 53), (63, 53)], 1.6)
    p.ellipse(60, 66, 11, 8, 2.0, 20, 160)
    p.save('sun.png', 17)


def scissors(w=72, h=44):
    p = Pen(w, h, 19)
    p.ellipse(13, 12, 9, 7, 2.6, wob=0.2); p.ellipse(13, 32, 9, 7, 2.6, wob=0.2)
    p.blot(poly([(20, 15), (24, 14), (68, 27), (66, 29)]))
    p.blot(poly([(20, 29), (24, 30), (68, 17), (66, 15)]))
    p.blot(ell(34, 22, 2.4, 2.4)); p.erase(ell(34, 22, 1.0, 1.0))
    p.save('scissors.png', 19)


def soft_noise(w, h, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale)))
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(scale / 2)), dtype=float) / 255.0


def punches(w, h, edge):
    """three-hole punch down the binding edge (4.25 in centers) and a pulled staple in the top corner,
    seen as the dark desk through the holes. 2x pixel space."""
    lay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    hx = 56 if edge == 'left' else w - 56
    for cy in (h // 2 - 816, h // 2, h // 2 + 816):
        sh = Image.new('L', (w, h), 0)
        ImageDraw.Draw(sh).ellipse((hx - 27, cy - 25, hx + 29, cy + 31), fill=90)       # soft shadow of the rim
        sh = sh.filter(ImageFilter.GaussianBlur(4))
        t = Image.new('RGBA', (w, h), (30, 36, 28, 0)); t.putalpha(sh)
        lay = Image.alpha_composite(lay, t)
        hole = Image.new('L', (w, h), 0)
        ImageDraw.Draw(hole).ellipse((hx - 24, cy - 24, hx + 24, cy + 24), fill=255)
        hole = hole.filter(ImageFilter.GaussianBlur(0.8))
        t = Image.new('RGBA', (w, h), (74, 64, 52, 0)); t.putalpha(hole)               # wood desk showing through
        lay = Image.alpha_composite(lay, t)
    # staple: two punctures with a pressed dent between, top corner
    sx = 50 if edge == 'left' else w - 50
    d = 1 if edge == 'left' else -1
    a, b = (sx, 36), (sx + d * 38, 62)
    dent = Image.new('L', (w, h), 0)
    ImageDraw.Draw(dent).line((a, b), fill=70, width=5)
    dent = dent.filter(ImageFilter.GaussianBlur(2))
    t = Image.new('RGBA', (w, h), (40, 46, 36, 0)); t.putalpha(dent)
    lay = Image.alpha_composite(lay, t)
    pk = Image.new('L', (w, h), 0)
    pd = ImageDraw.Draw(pk)
    for x, y in (a, b):
        pd.ellipse((x - 4, y - 4, x + 4, y + 4), fill=235)
    t = Image.new('RGBA', (w, h), (50, 44, 36, 0)); t.putalpha(pk.filter(ImageFilter.GaussianBlur(0.7)))
    return Image.alpha_composite(lay, t)


def wear(face, seed, edge):
    """big soft toner haze, a grey copier-lid shadow down one edge, handled corners. No pixel noise."""
    w, h = FW * 2, FH * 2
    mot = soft_noise(w, h, 170, seed)
    a = np.clip(mot - 0.55, 0, 1) * 0.12
    xs = np.arange(w)[None, :]
    ys = np.arange(h)[:, None]
    wob = 5 + 4 * np.sin(ys / 260.0 + seed)
    dist = xs if edge == 'left' else (w - 1 - xs)
    band = np.exp(-np.clip(dist - wob, 0, None) / 10.0) * 0.40
    band *= 0.7 + 0.3 * soft_noise(w, h, 90, seed + 1)
    a = np.maximum(a, band)
    topband = np.exp(-ys / 7.0) * 0.22 * np.ones((1, w))
    a = np.maximum(a, topband)
    nx = (xs / w - 0.5) * 2
    ny = (ys / h - 0.5) * 2
    vig = np.clip((nx ** 2 + ny ** 2) ** 0.5 - 1.0, 0, 1) * 0.32
    a = np.maximum(a, vig * (0.6 + 0.4 * mot))
    col = np.zeros((h, w, 3)); col[...] = (38, 46, 34)
    img = Image.fromarray(np.dstack([col, np.clip(a, 0, 1) * 255]).astype(np.uint8), 'RGBA')
    st = Image.new('L', (w, h), 0)
    sd = ImageDraw.Draw(st)
    if face == 'front':
        # faint ring from a milk carton set down on the sheet, in the bottom margin
        cx, cy, r = 1500, 2050, 62
        sd.ellipse((cx - r, cy - r, cx + r, cy + r), outline=52, width=14)
        st = st.filter(ImageFilter.GaussianBlur(8))
        tint = (110, 120, 90)
    else:
        sd.ellipse((60, 1500, 190, 1680), fill=30)
        st = st.filter(ImageFilter.GaussianBlur(30))
        tint = (60, 66, 52)
    lay = Image.new('RGBA', (w, h), tint + (0,)); lay.putalpha(st)
    img = Image.alpha_composite(img, lay)
    img = Image.alpha_composite(img, punches(w, h, edge))
    img.save(os.path.join(A, f'wear-{face}.png'))


if __name__ == '__main__':
    carton(); skillet(); tray(); beachball(); elephant(); jug(); chickwaffle(); crumb(); scissors()
    wear('front', 7, 'left')
    wear('back', 11, 'right')
    print('painted')
