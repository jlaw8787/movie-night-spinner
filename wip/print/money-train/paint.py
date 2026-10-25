"""Paints the assets for the El Ultimo Tren bakery bag (Money Train, 1995).
A gusseted kraft bag (self-opening sack), face 8.5 x 11 in, printed one ink (dark green) by flexo
from a line-cut plate, with a violet rubber date stamp added by hand at the counter.

Art is drawn at 3x with lines and engraving-style hatching, then shrunk to 2x and given a flexo
lay-down: ink squash (fat, rounded edges), a heavier rim, soft uneven coverage and small voids.
- assets/car-ink.png      : R-type subway car front at the platform, line cut
- assets/counter-ink.png  : cup of cafe con leche and two pastelitos on wax paper
- assets/token-ink.png    : the house token, milled edge, lettered on the ring
- assets/recycle-ink.png  : the 1990s recycled-paper arrows for the bag bottom
- assets/kraft-paper-<face>.png : opaque kraft base, soft mottling and machine-direction streaks
- assets/ink-wear-<face>.png    : kraft-coloured voids laid over the ink, uneven coverage
- assets/bag-paper-<face>.png   : bag construction (serrated top, thumb notch, side folds, glued
  seam, folded bottom) plus soft wear, a grease spot and a coffee ring
Low detail on the textures on purpose: big gentle shapes, no pixel noise."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
F_OSW = os.path.join(D, 'fonts', 'Oswald-SemiBold.ttf')
F_COR = os.path.join(D, 'fonts', 'Corben-Bold.ttf')
W, H = 1632, 2112          # 2x of 816 x 1056
INK = (24, 60, 42)
KRAFT = np.array((196, 154, 108), np.float32)


def blob_field(seed, scale, blur, w=W, h=H):
    rng = np.random.default_rng(seed)
    small = rng.random((h // scale + 2, w // scale + 2)).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(np.float32) / 255
    return (a - a.min()) / (a.max() - a.min() + 1e-6)


# ================================================================== drawing helpers (3x canvas)
class Plate:
    def __init__(self, w, h):
        self.w, self.h = w, h
        self.im = Image.new('L', (w, h), 0)
        self.d = ImageDraw.Draw(self.im)

    def mask(self, fn):
        m = Image.new('L', (self.w, self.h), 0)
        fn(ImageDraw.Draw(m))
        return np.asarray(m).astype(np.float32) / 255

    def hatch(self, region, angle=0, spacing=10, width=4, wobble=0.0, seed=1):
        """parallel engraved lines inside region (float mask)"""
        y, x = np.mgrid[0:self.h, 0:self.w].astype(np.float32)
        a = math.radians(angle)
        u = x * math.sin(a) + y * math.cos(a)
        if wobble:
            u = u + (blob_field(seed, 30, 10, self.w, self.h) - .5) * wobble
        ph = np.mod(u, spacing)
        lines = (ph < width).astype(np.float32)
        self.add(lines * region)

    def add(self, arr):
        cur = np.asarray(self.im).astype(np.float32) / 255
        self.im = Image.fromarray((np.clip(np.maximum(cur, arr), 0, 1) * 255).astype(np.uint8))
        self.d = ImageDraw.Draw(self.im)

    def clear(self, region):
        cur = np.asarray(self.im).astype(np.float32) / 255
        self.im = Image.fromarray((np.clip(cur * (1 - region), 0, 1) * 255).astype(np.uint8))
        self.d = ImageDraw.Draw(self.im)

    def line(self, pts, w):
        self.d.line(pts, fill=255, width=w, joint='curve')
        r = w / 2 - .5
        for (x, y) in (pts[0], pts[-1]):
            self.d.ellipse((x - r, y - r, x + r, y + r), fill=255)

    def poly(self, pts, w):
        self.line(list(pts) + [pts[0], pts[1]], w)

    def text(self, xy, s, size, font=F_OSW, anchor='mm', fill=255):
        self.d.text(xy, s, font=ImageFont.truetype(font, size), fill=fill, anchor=anchor)


def flexo(plate, out_w, out_h, name, seed, colour=INK):
    """3x plate -> 2x RGBA with flexo ink squash, heavier rim, uneven lay-down and voids"""
    m = plate.im.resize((out_w, out_h), Image.LANCZOS)
    m = m.filter(ImageFilter.GaussianBlur(0.9))
    a = np.asarray(m).astype(np.float32) / 255
    a = np.clip((a - 0.30) / 0.42, 0, 1)                          # squash: a touch fatter
    a = a * a * (3 - 2 * a)
    er = np.asarray(Image.fromarray((a * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(5))).astype(np.float32) / 255
    rim = np.clip(a - er, 0, 1)
    mott = blob_field(seed, 26, 12, out_w, out_h)
    cov = 0.80 + 0.14 * mott + rim * 0.16
    v = blob_field(seed + 7, 3, 0.9, out_w, out_h)
    voids = np.clip((v - 0.80) / 0.08, 0, 1) * (mott < 0.55)
    cov = cov * (1 - 0.6 * voids)
    alpha = np.clip(a * cov, 0, 1)
    out = np.zeros((out_h, out_w, 4), np.uint8)
    out[..., :3] = colour
    out[..., 3] = (alpha * 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, name), optimize=True)


def quad_curve(p0, c, p1, n=40):
    return [((1 - t) ** 2 * p0[0] + 2 * (1 - t) * t * c[0] + t * t * p1[0],
             (1 - t) ** 2 * p0[1] + 2 * (1 - t) * t * c[1] + t * t * p1[1]) for t in np.linspace(0, 1, n)]


# ================================================================== subway car, line cut
def car():
    P = Plate(1020, 1140)
    FL, FR, FB = 150, 640, 880
    arc = quad_curve((FL, 178), (395, 70), (FR, 178))
    front = [(FL, FB)] + arc + [(FR, FB)]

    def S(t, v):
        x = FR + 260 * t
        top = 178 + 62 * t
        bot = FB - 52 * t
        return (x, top + (bot - top) * v)
    side = [S(0, 0), S(1, 0), S(1, 1), S(0, 1)]

    # tunnel portal behind the car: engraved horizontal lines inside an arch
    portal = P.mask(lambda d: (d.ellipse((24, 26, 996, 998), fill=255), d.rectangle((24, 512, 996, 1000), fill=255)))
    P.hatch(portal, 0, 13, 4.6, wobble=3, seed=3)
    # wall columns, riveted I-beams either side
    for x0 in (52, 924):
        col = P.mask(lambda d: d.rectangle((x0, 300, x0 + 44, 1000), fill=255))
        P.clear(col)
        P.d.rectangle((x0, 300, x0 + 44, 1000), outline=255, width=6)
        P.d.rectangle((x0 - 8, 300, x0 + 52, 318), fill=255)
        for yy in range(340, 990, 34):
            P.d.ellipse((x0 + 17, yy, x0 + 27, yy + 10), fill=255)
    body = P.mask(lambda d: (d.polygon(front, fill=255), d.polygon(side, fill=255),
                             d.rectangle((FL - 6, FB - 2, 905, 1000), fill=255)))
    P.clear(body)

    # ---- side of the car, receding: door, window, fluted stainless
    P.poly(side, 8)
    for (t0, t1) in ((0.07, 0.35),):
        P.poly([S(t0, .08), S(t1, .08), S(t1, .97), S(t0, .97)], 6)
        P.line([S((t0 + t1) / 2, .08), S((t0 + t1) / 2, .97)], 4)
        for (a0, a1) in ((t0 + .025, (t0 + t1) / 2 - .02), ((t0 + t1) / 2 + .02, t1 - .025)):
            win = P.mask(lambda d: d.polygon([S(a0, .14), S(a1, .14), S(a1, .44), S(a0, .44)], fill=255))
            P.hatch(win, 0, 7, 3.6)
            P.poly([S(a0, .14), S(a1, .14), S(a1, .44), S(a0, .44)], 4)
    win = P.mask(lambda d: d.polygon([S(.44, .14), S(.93, .14), S(.93, .44), S(.44, .44)], fill=255))
    P.hatch(win, 0, 7, 3.6)
    P.clear(P.mask(lambda d: d.polygon([S(.58, .14), S(.66, .14), S(.56, .44), S(.48, .44)], fill=255)))
    P.poly([S(.44, .14), S(.93, .14), S(.93, .44), S(.44, .44)], 5)
    P.line([S(.685, .14), S(.685, .44)], 4)
    P.line([S(0, .52), S(1, .52)], 5)
    P.line([S(0, .035), S(1, .035)], 4)
    for t in np.arange(0.39, 0.995, 0.026):
        P.line([S(t, .57), S(t, .95)], 3)
    # light shade on the side panel top and below the belt
    shade = P.mask(lambda d: d.polygon([S(.36, .47), S(1, .47), S(1, .52), S(.36, .52)], fill=255))
    P.hatch(shade, 0, 6, 2.6)

    # ---- front of the car
    P.d.line(quad_curve((FL + 8, 200), (395, 96), (FR - 8, 200)), fill=255, width=4)
    P.poly(front, 9)
    # cab windows with engraved glass and a diagonal glint
    for (x0, x1) in ((170, 348), (442, 622)):
        g = P.mask(lambda d: d.rounded_rectangle((x0, 258, x1, 488), 10, fill=255))
        P.hatch(g, 0, 7, 3.8)
        P.clear(P.mask(lambda d: d.polygon([(x0 + 70, 258), (x0 + 96, 258), (x0 + 34, 488), (x0 + 8, 488)], fill=255)))
        P.clear(P.mask(lambda d: d.polygon([(x0 + 112, 258), (x0 + 122, 258), (x0 + 60, 488), (x0 + 50, 488)], fill=255)))
        P.d.rounded_rectangle((x0, 258, x1, 488), 10, outline=255, width=8)
    # destination sign in the left window
    P.clear(P.mask(lambda d: d.rectangle((182, 270, 336, 326), fill=255)))
    P.d.rectangle((182, 270, 336, 326), outline=255, width=5)
    P.text((259, 299), 'ÚLTIMO', 40)
    # storm door
    P.d.rectangle((362, 236, 428, FB), outline=255, width=7)
    g = P.mask(lambda d: d.rectangle((374, 258, 416, 486), fill=255))
    P.hatch(g, 0, 7, 3.8)
    P.d.rectangle((374, 258, 416, 486), outline=255, width=5)
    P.d.rectangle((406, 560, 418, 616), fill=255)
    # route box and classification lamps
    P.d.rounded_rectangle((358, 150, 432, 222), 8, outline=255, width=6)
    P.d.ellipse((377, 168, 413, 204), outline=255, width=6)
    P.d.ellipse((389, 180, 401, 192), fill=255)
    for cx in (196, 238, 552, 594):
        P.d.ellipse((cx - 15, 196, cx + 15, 226), fill=255)
        P.d.ellipse((cx - 5, 206, cx + 5, 216), fill=0)
    # belt and car number plate
    P.line([(FL + 4, 512), (362, 512)], 5)
    P.line([(428, 512), (FR - 4, 512)], 5)
    P.d.rectangle((474, 536, 596, 588), outline=255, width=5)
    P.text((535, 562), '1995', 38)
    # grab irons beside the storm door
    for x in (344, 446):
        P.line([(x, 560), (x, 700)], 7)
        P.line([(x, 560), (x + (10 if x < 400 else -10), 560)], 6)
        P.line([(x, 700), (x + (10 if x < 400 else -10), 700)], 6)
    # headlights and tail lamps
    for cx in (220, 572):
        P.d.ellipse((cx - 40, 726, cx + 40, 806), outline=255, width=8)
        P.d.ellipse((cx - 22, 744, cx + 22, 788), fill=255)
        P.d.ellipse((cx - 8, 752, cx + 6, 766), fill=0)
    for cx in (292, 500):
        P.d.ellipse((cx - 13, 753, cx + 13, 779), outline=255, width=6)
    # rounded-body shading at both front edges, lower panel
    for (x0, x1) in ((FL + 6, FL + 34), (FR - 34, FR - 6)):
        P.hatch(P.mask(lambda d: d.rectangle((x0, 520, x1, FB - 6), fill=255)), 90, 8, 3)
    P.hatch(P.mask(lambda d: d.rectangle((FL + 6, 820, FR - 6, FB - 6), fill=255)), 0, 7, 2.6)

    # ---- anticlimber, coupler, trucks
    for y in (888, 914, 940):
        P.d.rounded_rectangle((164, y, 626, y + 16), 6, fill=255)
    under = P.mask(lambda d: d.polygon([(FL, 960), (905, 960), (905, 820), (FR, FB)], fill=255))
    P.hatch(under, 45, 9, 4)
    P.hatch(P.mask(lambda d: d.rectangle((FL, 958, 905, 1000), fill=255)), -45, 9, 4)
    P.clear(P.mask(lambda d: d.rectangle((356, 950, 434, 1004), fill=255)))
    P.d.rectangle((368, 956, 422, 1000), fill=255)
    P.d.rectangle((346, 990, 444, 1012), fill=255)
    for (cx, cy, r) in ((706, 946, 38), (842, 918, 34)):
        P.clear(P.mask(lambda d: d.ellipse((cx - r, cy - r, cx + r, cy + r), fill=255)))
        P.d.ellipse((cx - r, cy - r, cx + r, cy + r), outline=255, width=7)
        P.d.ellipse((cx - 9, cy - 9, cx + 9, cy + 9), fill=255)

    # ---- track: rails running at you, ties, third rail with its cover board
    for (y, x0, x1, h) in ((1018, 236, 556, 13), (1052, 212, 580, 15), (1092, 184, 608, 17), (1128, 150, 640, 18)):
        P.d.rectangle((x0, y, x1, y + h), fill=255)
    P.line([(300, 1004), (206, 1140)], 11)
    P.line([(490, 1004), (584, 1140)], 11)
    P.line([(600, 1006), (760, 1140)], 9)
    P.line([(620, 1000), (800, 1128)], 5)
    # portal rings
    P.d.arc((14, 16, 1006, 1008), 180, 360, fill=255, width=10)
    P.d.arc((34, 36, 986, 988), 180, 360, fill=255, width=4)
    P.line([(14, 512), (14, 1004)], 10)
    P.line([(1006, 512), (1006, 1004)], 10)
    P.line([(34, 512), (34, 1004)], 4)
    P.line([(986, 512), (986, 1004)], 4)
    P.line([(14, 1004), (200, 1004)], 8)
    P.line([(820, 1004), (1006, 1004)], 8)
    flexo(P, 680, 760, 'car-ink.png', 5)


# ================================================================== counter drawing
def counter():
    P = Plate(840, 600)
    # saucer
    P.d.ellipse((24, 400, 456, 510), outline=255, width=7)
    P.d.ellipse((110, 428, 370, 482), outline=255, width=4)
    P.hatch(P.mask(lambda d: (d.ellipse((24, 400, 456, 510), fill=255), d.ellipse((30, 396, 450, 486), fill=0))), 0, 6, 2.6)
    # cup body
    lft = quad_curve((86, 200), (70, 360), (150, 440))
    rgt = quad_curve((330, 440), (410, 360), (394, 200))
    cup = lft + rgt
    P.clear(P.mask(lambda d: d.polygon(cup, fill=255)))
    P.hatch(P.mask(lambda d: (d.polygon(cup, fill=255), d.rectangle((0, 0, 290, 600), fill=0))), 90, 9, 3.4)
    P.hatch(P.mask(lambda d: (d.polygon(cup, fill=255), d.rectangle((0, 0, 350, 600), fill=0))), 90, 9, 6)
    P.line(lft, 8)
    P.line(rgt, 8)
    P.d.arc((150, 424, 330, 456), 0, 180, fill=255, width=7)
    # handle
    P.d.arc((326, 232, 466, 380), -84, 84, fill=255, width=20)
    P.d.arc((352, 260, 440, 352), -70, 70, fill=255, width=4)
    # rim and the coffee
    P.d.ellipse((84, 176, 396, 226), outline=255, width=8)
    cof = P.mask(lambda d: d.ellipse((104, 186, 376, 220), fill=255))
    P.hatch(cof, 0, 6, 3.6)
    P.clear(P.mask(lambda d: d.ellipse((150, 192, 250, 204), fill=255)))
    # steam
    for i, x0 in enumerate((180, 240, 300)):
        pts = [(x0 + 18 * math.sin(t / 26 + i * 1.7), 170 - t) for t in range(0, 140, 4)]
        P.line(pts, 6 if i != 1 else 7)
    # wax paper
    paper = [(452, 300), (826, 262), (834, 548), (470, 588)]
    P.poly(paper, 4)
    P.line([(500, 578), (528, 520)], 3)
    P.line([(790, 272), (806, 330)], 3)

    def pastry(p):
        (a, b, c, e) = p
        P.clear(P.mask(lambda d: d.polygon([a, b, (c[0], c[1] + 26), (e[0], e[1] + 26)], fill=255)))
        P.hatch(P.mask(lambda d: d.polygon([e, c, (c[0], c[1] + 26), (e[0], e[1] + 26)], fill=255)), 0, 5, 2.8)
        for k in range(5):
            y = e[1] + 5 + k * 5
            P.line([(e[0] + 2, y), (c[0] - 2, y - (e[1] - c[1]))], 2)
        P.poly([a, b, c, e], 7)
        P.line([(e[0], e[1] + 26), (c[0], c[1] + 26)], 6)
        P.line([e, (e[0], e[1] + 26)], 6)
        P.line([c, (c[0], c[1] + 26)], 6)
        for (p0, p1) in ((a, b), (b, c), (c, e), (e, a)):        # fork crimp along the seal
            n = 7
            for k in range(1, n):
                t = k / n
                x = p0[0] + (p1[0] - p0[0]) * t
                y = p0[1] + (p1[1] - p0[1]) * t
                cx = (a[0] + c[0]) / 2
                cy = (a[1] + c[1]) / 2
                dx, dy = cx - x, cy - y
                L = math.hypot(dx, dy)
                P.line([(x + dx / L * 6, y + dy / L * 6), (x + dx / L * 16, y + dy / L * 16)], 3)
        cx = (a[0] + b[0] + c[0] + e[0]) / 4
        cy = (a[1] + b[1] + c[1] + e[1]) / 4
        # puffed top: a few curved flake lines, then three slits with guava showing
        P.hatch(P.mask(lambda d: d.polygon([(a[0] + 22, a[1] + 24), (a[0] + 70, a[1] + 18), (a[0] + 26, a[1] + 66)], fill=255)), -40, 7, 2.4)
        for k in (-1, 0, 1):
            sx0 = cx + k * 26
            P.d.polygon([(sx0 - 14, cy + 22), (sx0 - 6, cy + 22), (sx0 + 14, cy - 22), (sx0 + 6, cy - 22)], fill=255)
    pastry([(482, 336), (640, 318), (650, 470), (492, 490)])
    pastry([(662, 312), (808, 296), (816, 440), (672, 456)])
    flexo(P, 560, 400, 'counter-ink.png', 11)


# ================================================================== the house token
def arc_text(P, s, cx, cy, r, centre_deg, size, bottom=False):
    f = ImageFont.truetype(F_OSW, size)
    widths = [f.getlength(ch) + size * 0.08 for ch in s]
    total = sum(widths)
    ang = centre_deg + (-1 if not bottom else 1) * math.degrees(total / 2 / r)
    for ch, w in zip(s, widths):
        step = math.degrees(w / r)
        mid = ang + (step / 2 if not bottom else -step / 2)
        th = math.radians(mid)
        x = cx + r * math.sin(th)
        y = cy - r * math.cos(th)
        g = Image.new('L', (size * 2, size * 2), 0)
        ImageDraw.Draw(g).text((size, size), ch, font=f, fill=255, anchor='mm')
        rot = -mid if not bottom else -(mid - 180)
        g = g.rotate(rot, resample=Image.BICUBIC)
        P.im.paste(255, (int(x - size), int(y - size)), g)
        ang += step if not bottom else -step
    P.d = ImageDraw.Draw(P.im)


def token():
    P = Plate(420, 420)
    c = 210
    P.d.ellipse((c - 200, c - 200, c + 200, c + 200), outline=255, width=12)
    for k in range(0, 360, 4):
        t = math.radians(k)
        P.line([(c + 186 * math.cos(t), c + 186 * math.sin(t)), (c + 198 * math.cos(t), c + 198 * math.sin(t))], 4)
    P.d.ellipse((c - 128, c - 128, c + 128, c + 128), outline=255, width=7)
    arc_text(P, 'EL ÚLTIMO TREN', c, c, 152, 0, 40)
    arc_text(P, 'GOOD FOR ONE COOKIE', c, c, 152, 180, 40, bottom=True)
    for side in (-1, 1):
        x = c + side * 154
        P.d.regular_polygon((x, c, 11), 5, rotation=0, fill=255)
    # middle: cut-out hole and engraved field
    field = P.mask(lambda d: (d.ellipse((c - 120, c - 120, c + 120, c + 120), fill=255), d.ellipse((c - 52, c - 52, c + 52, c + 52), fill=0)))
    P.hatch(field, 45, 10, 2.8)
    P.d.ellipse((c - 52, c - 52, c + 52, c + 52), outline=255, width=8)
    flexo(P, 280, 280, 'token-ink.png', 17)


# ================================================================== recycled-paper arrows
def recycle():
    P = Plate(240, 240)
    c, R = 120, 92
    V = [(c + R * math.cos(math.radians(a)), c + R * math.sin(math.radians(a))) for a in (-90, 30, 150)]
    for k in range(3):
        p0, p1 = V[k], V[(k + 1) % 3]
        a = (p0[0] + (p1[0] - p0[0]) * .2, p0[1] + (p1[1] - p0[1]) * .2)
        b = (p0[0] + (p1[0] - p0[0]) * .66, p0[1] + (p1[1] - p0[1]) * .66)
        P.line([a, b], 20)
        dx, dy = p1[0] - p0[0], p1[1] - p0[1]
        L = math.hypot(dx, dy)
        ux, uy = dx / L, dy / L
        tip = (b[0] + ux * 40, b[1] + uy * 40)
        P.d.polygon([tip, (b[0] - uy * 26, b[1] + ux * 26), (b[0] + uy * 26, b[1] - ux * 26)], fill=255)
    flexo(P, 160, 160, 'recycle-ink.png', 23)


# ================================================================== paper, wear and bag construction
def yy_xx():
    return np.mgrid[0:H, 0:W].astype(np.float32)


def kraft_base(seed, name):
    y, x = yy_xx()
    big = blob_field(seed, 160, 90)
    mid = blob_field(seed + 1, 40, 22)
    streak = blob_field(seed + 2, 1, 0, 1, H)  # one value per row, machine-direction streaks
    streak = np.asarray(Image.fromarray((streak * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
                        .filter(ImageFilter.GaussianBlur(3))).astype(np.float32) / 255
    tone = (big - .5) * 16 + (mid - .5) * 8 + (streak - .5) * 5
    rgb = KRAFT[None, None, :] + tone[..., None] * np.array((1.0, .92, .8), np.float32)[None, None, :]
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), 'RGB').save(os.path.join(A, name), optimize=True)


def ink_wear(seed, name):
    """kraft-coloured speckle and mottle sitting over the ink: uneven flexo coverage"""
    mott = blob_field(seed, 60, 30)
    v = blob_field(seed + 1, 3, 1.0)
    voids = np.clip((v - 0.78) / 0.1, 0, 1) * np.clip((0.62 - mott) / 0.2, 0, 1)
    alpha = voids * 0.55 + np.clip(mott - 0.6, 0, 1) * 0.28
    out = np.zeros((H, W, 4), np.uint8)
    out[..., :3] = KRAFT.astype(np.uint8)
    out[..., 3] = (np.clip(alpha, 0, 0.6) * 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, name), optimize=True)


def spot(cx, cy, rx, ry, seed):
    y, x = yy_xx()
    wob = blob_field(seed, 40, 30) * 0.35
    dd = np.sqrt(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2) + wob - 0.15
    core = np.clip(1 - dd, 0, 1) ** 0.7
    rim = np.exp(-((dd - 0.92) / 0.12) ** 2) * 0.25
    return np.clip(core * 0.7 + rim, 0, 1)


TOOTH = 18      # serration period at 2x
DEPTH = 18      # serration depth at 2x


def serrate(y, x):
    """1 where the paper has been cut away above the serrated edge"""
    ph = np.abs(((x / TOOTH) % 1) - 0.5) * 2          # 0 at tooth tip, 1 at gullet
    edge = DEPTH * ph                                   # y of paper edge
    return np.clip((edge - y) / 1.2 + 0.5, 0, 1), edge


class Layer:
    def __init__(self):
        self.a = np.zeros((H, W), np.float32)
        self.rgb = np.zeros((H, W, 3), np.float32)
        self.rgb[...] = (84, 52, 22)

    def shade(self, amt, colour=None):
        """lay a shadow (or highlight with colour) with alpha amt"""
        if colour is None:
            self.a = self.a + amt * (1 - self.a)
            return
        c = np.array(colour, np.float32)[None, None, :]
        newa = self.a + amt * (1 - self.a)
        self.rgb = (self.rgb * self.a[..., None] + c * amt[..., None] * (1 - self.a[..., None])) / np.maximum(newa[..., None], 1e-4)
        self.a = newa

    def over(self, amt, colour):
        c = np.array(colour, np.float32)[None, None, :]
        newa = amt + self.a * (1 - amt)
        self.rgb = (c * amt[..., None] + self.rgb * self.a[..., None] * (1 - amt[..., None])) / np.maximum(newa[..., None], 1e-4)
        self.a = newa

    def save(self, name):
        out = np.dstack([np.clip(self.rgb, 0, 255), np.clip(self.a, 0, 1) * 255]).astype(np.uint8)
        Image.fromarray(out, 'RGBA').save(os.path.join(A, name), optimize=True)


def wear_common(L, seed):
    y, x = yy_xx()
    mott = blob_field(seed, 110, 70) * 0.6 + blob_field(seed + 1, 36, 26) * 0.4
    L.shade((mott - 0.45).clip(0, 1) * 0.12)
    dedge = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    L.shade(np.clip(1 - dedge / 130, 0, 1) ** 2.4 * 0.20)
    # the side folds: each edge is a fold into the gusset, a lit ridge and a dark break
    for xe in (0, W - 1):
        dx = np.abs(x - xe)
        L.shade(np.exp(-(dx / 5) ** 2) * 0.35)
        L.shade(np.exp(-((dx - 12) / 5) ** 2) * 0.25, (232, 200, 156))
    # gusset fold pressed through from inside: a faint line near each side
    for xg in (52, W - 53):
        L.shade(np.exp(-((x - xg) / 2.0) ** 2) * 0.16)
        L.shade(np.exp(-((x - xg - 4) / 3.0) ** 2) * 0.10, (226, 192, 148))
    # bottom fold edge
    L.shade(np.exp(-((H - 1 - y) / 10) ** 2) * 0.35)
    # serrated top: background shows through the cut, shadow under each tooth
    cut, edge = serrate(y, x)
    L.shade(np.exp(-((y - edge - 3) / 3) ** 2) * (1 - cut) * 0.30)
    L.over(cut, (236, 232, 224))
    return cut


def crease(L, x0, y0, x1, y1, seed, strength=1.0):
    y, x = yy_xx()
    dx, dy = x1 - x0, y1 - y0
    Ln = math.hypot(dx, dy)
    nx, ny = -dy / Ln, dx / Ln
    t = ((x - x0) * dx + (y - y0) * dy) / Ln ** 2
    dist = (x - x0) * nx + (y - y0) * ny
    fade = np.clip(np.minimum(t, 1 - t) * 6, 0, 1) * (t > 0) * (t < 1)
    var = 0.6 + 0.4 * blob_field(seed, 60, 30)
    L.shade(np.exp(-((dist) / 2.2) ** 2) * fade * 0.20 * var * strength)
    L.shade(np.exp(-((dist - 5) / 4) ** 2) * fade * 0.14 * var * strength, (234, 204, 160))


def front_paper():
    y, x = yy_xx()
    L = Layer()
    cut = wear_common(L, 31)
    # thumb notch: half moon cut from the front panel, back panel's inside shows, then its own teeth
    cx, r = W / 2, 120
    dn = np.sqrt((x - cx) ** 2 + (y + 6) ** 2)
    hole = np.clip((r - dn) / 1.4, 0, 1) * (1 - cut)
    inside = np.clip(1 - (y / r), 0, 1)
    L.over(hole * (0.42 + inside * 0.25), (70, 44, 20))
    lip = np.exp(-((dn - r) / 2.4) ** 2) * (dn > r - 6) * (1 - cut)
    L.over(lip * 0.55, (238, 208, 166))
    L.shade(np.exp(-((dn - r - 7) / 5) ** 2) * (1 - cut) * 0.12)
    # creases where it was folded over and carried
    crease(L, 0, 1188, W, 1150, 3, 0.9)
    crease(L, 980, 2112, 1632, 1560, 5, 0.8)
    # grease spot where a hot pastelito sat, away from the type
    g = spot(1460, 1980, 120, 80, 41)
    L.shade(g * 0.22)
    save_layer = L
    save_layer.save('bag-paper-front.png')


def back_paper():
    y, x = yy_xx()
    L = Layer()
    wear_common(L, 57)
    # glued side seam: the outer ply ends at sx, glue line just inside it
    sx = 1532
    over = np.clip((x - sx) / 1.5, 0, 1)
    L.shade(over * 0.05)
    L.shade(np.exp(-((x - sx + 3) / 3) ** 2) * 0.38)
    L.shade(np.exp(-((x - sx - 5) / 3) ** 2) * 0.22, (236, 206, 162))
    L.shade(np.exp(-((x - sx - 26) / 9) ** 2) * 0.08)
    # bottom folded up onto the back: fold line, two diagonal ears and the pasted closure flap
    fy = 1808
    L.shade(np.exp(-((y - fy) / 3) ** 2) * 0.40)
    L.shade(np.exp(-((y - fy - 7) / 6) ** 2) * 0.16, (238, 210, 166))
    below = y > fy
    L.shade(below * 0.05, (230, 196, 150))
    for (xa, sgn) in ((0, 1), (W - 1, -1)):
        d = ((x - xa) * sgn - (y - fy))          # 45 degree line from the fold corner
        band = (y > fy) * (y < 2030)
        L.shade(np.exp(-(d / 2.6) ** 2) * band * 0.36)
        L.shade(np.exp(-((d - 6) / 4) ** 2) * band * 0.14, (236, 206, 162))
        L.shade(np.clip(-d / 3, 0, 1) * band * 0.05)
    cy = 2030
    L.shade(np.exp(-((y - cy) / 3) ** 2) * 0.32)
    L.shade(np.exp(-((y - cy + 6) / 5) ** 2) * 0.12, (236, 206, 162))
    L.shade(np.clip((y - cy) / 2, 0, 1) * 0.06)
    # crease across the middle
    crease(L, 0, 1010, W, 1040, 9, 0.8)
    # faint coffee ring where a cup stood on the bag
    dr = np.sqrt((x - 1380) ** 2 + (y - 1505) ** 2)
    ring = np.exp(-((dr - 92) / 5) ** 2) * (0.6 + 0.4 * blob_field(77, 20, 8))
    L.shade(ring * 0.16)
    L.save('bag-paper-back.png')


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    car(); counter(); token(); recycle()
    for n, s in (('front', 1), ('back', 2)):
        kraft_base(100 + s, f'kraft-paper-{n}.png')
        ink_wear(200 + s, f'ink-wear-{n}.png')
    front_paper(); back_paper()
    print('painted')
