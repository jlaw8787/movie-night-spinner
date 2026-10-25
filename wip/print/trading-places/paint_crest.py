"""Engraved crest of the Heritage Club, the Trading Places menu's signature piece.
A heater shield in gules hatching, two orange sprigs crossed over a one dollar bill (the Dukes'
wager), on a scroll reading MUTATIS MUTANDIS. Two inks, oxblood line and orange spot, line-width
modulated engraving drawn with numpy and supersampled. Output: assets/crest.png, 440 x 440 CSS px at 2x."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
OUT_W, OUT_H = 880, 880
SS = 2
W, H = OUT_W * SS, OUT_H * SS
INK = np.array([74, 21, 25], float)
ORANGE = np.array([217, 102, 28], float)
PAPER = np.array([239, 226, 200], float)
FONT = os.path.join(A, 'fonts', 'CinzelDecorative-900.ttf')
SERIF = os.path.join(A, 'fonts', 'CrimsonPro-700.ttf')

yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
rgb = np.zeros((H, W, 3), np.float32) + PAPER
alpha = np.zeros((H, W), np.float32)


def s(v):
    return v * SS


def mask(fn):
    im = Image.new('L', (W, H), 0)
    fn(ImageDraw.Draw(im))
    return np.asarray(im, np.float32) / 255.0


def lay(m, col, a=1.0):
    """Paint colour col over mask m (0..1)."""
    global rgb, alpha
    m = np.clip(m * a, 0, 1)[..., None]
    rgb = rgb * (1 - m) + col * m
    alpha = np.maximum(alpha, m[..., 0])


def hatch(tone, angle, spacing):
    """Engraving lines: coverage where the distance to the line centre is under the tone."""
    t = math.radians(angle)
    u = (xx * math.cos(t) + yy * math.sin(t)) / s(spacing)
    d = np.abs((u % 1.0) - 0.5) * 2
    return (d < np.clip(tone, 0, 1)).astype(np.float32)


def stroke_line(p, q, w, col):
    lay(mask(lambda d: d.line([(s(p[0]), s(p[1])), (s(q[0]), s(q[1]))], fill=255, width=int(s(w)))), col)


# ---------------- shield ----------------
def shield_pts(inset=0):
    l, r, t, mid, tip = 210 + inset, 670 - inset, 70 + inset, 430, 720 - inset * 1.4
    pts = [(l, t), (r, t), (r, mid)]
    for i in range(1, 25):  # right curve to the point
        a = i / 24
        pts.append((r + (440 - r) * a ** 1.15, mid + (tip - mid) * math.sin(a * math.pi / 2)))
    for i in range(1, 25):
        a = 1 - i / 24
        pts.append((l + (440 - l) * a ** 1.15, mid + (tip - mid) * math.sin(a * math.pi / 2)))
    return [(s(x), s(y)) for x, y in pts]


sh_out = mask(lambda d: d.polygon(shield_pts(0), fill=255))
sh_in = mask(lambda d: d.polygon(shield_pts(16), fill=255))
lay(sh_out, PAPER)
# field: gules, vertical lines, lighter toward the upper left
light = np.clip(((yy - s(70)) / s(650)) * 0.6, 0, 1)
lay(sh_in * hatch(0.20 + light * 0.32, 0, 7), INK)
# border: thick outer, thin inner, with a band of tiny dots between
lay(np.clip(sh_out - mask(lambda d: d.polygon(shield_pts(7), fill=255)), 0, 1), INK)
lay(np.clip(mask(lambda d: d.polygon(shield_pts(13), fill=255)) - sh_in, 0, 1), INK)

# ---------------- the one dollar bill ----------------
bx0, by0, bx1, by1 = 262, 418, 618, 570
lay(mask(lambda d: d.rectangle((s(bx0 - 6), s(by0 - 6), s(bx1 + 6), s(by1 + 6)), fill=255)), PAPER)
inbill = mask(lambda d: d.rectangle((s(bx0), s(by0), s(bx1), s(by1)), fill=255))
lay(inbill - mask(lambda d: d.rectangle((s(bx0 + 4), s(by0 + 4), s(bx1 - 4), s(by1 - 4)), fill=255)), INK)
# guilloche band
band = mask(lambda d: d.rectangle((s(bx0 + 10), s(by0 + 10), s(bx1 - 10), s(by1 - 10)), fill=255)) - \
       mask(lambda d: d.rectangle((s(bx0 + 26), s(by0 + 26), s(bx1 - 26), s(by1 - 26)), fill=255))
band = np.clip(band, 0, 1)
g = np.zeros_like(xx)
for ph in (0.0, math.pi):
    for axis in ('x', 'y'):
        v = xx if axis == 'x' else yy
        c = (yy - s((by0 + by1) / 2)) if axis == 'x' else (xx - s((bx0 + bx1) / 2))
        wave = np.sin(v / s(5.5) + ph) * s(6)
        g = np.maximum(g, (np.abs(((c - wave) % s(8)) - s(4)) < s(0.9)).astype(np.float32))
lay(band * g, INK, 0.9)
lay(np.clip(mask(lambda d: d.rectangle((s(bx0 + 26), s(by0 + 26), s(bx1 - 26), s(by1 - 26)), outline=255, width=int(s(2)))), 0, 1), INK)
# fine background lines in the bill
inner = mask(lambda d: d.rectangle((s(bx0 + 28), s(by0 + 28), s(bx1 - 28), s(by1 - 28)), fill=255))
lay(inner * hatch(0.10, 0, 4), INK, 0.55)
# centre oval with a big 1
cx, cy = (bx0 + bx1) / 2, (by0 + by1) / 2
lay(mask(lambda d: d.ellipse((s(cx - 46), s(cy - 40), s(cx + 46), s(cy + 40)), fill=255)), PAPER)
oval = mask(lambda d: d.ellipse((s(cx - 46), s(cy - 40), s(cx + 46), s(cy + 40)), fill=255))
lay(oval * hatch(0.16 + np.clip((yy - s(cy - 40)) / s(80), 0, 1) * 0.3, 45, 4), INK)
lay(mask(lambda d: d.ellipse((s(cx - 46), s(cy - 40), s(cx + 46), s(cy + 40)), outline=255, width=int(s(3)))), INK)
f1 = ImageFont.truetype(SERIF, s(66))
fs = ImageFont.truetype(SERIF, s(15))
fc = ImageFont.truetype(SERIF, s(22))
lay(mask(lambda d: d.text((s(cx), s(cy + 2)), '1', font=f1, anchor='mm', fill=255)), PAPER)
lay(mask(lambda d: d.text((s(cx), s(cy + 2)), '1', font=f1, anchor='mm', fill=0, stroke_width=int(s(2)), stroke_fill=255)), INK)
for (ox, oy) in ((bx0 + 50, by0 + 46), (bx1 - 50, by0 + 46), (bx0 + 50, by1 - 46), (bx1 - 50, by1 - 46)):
    lay(mask(lambda d: d.ellipse((s(ox - 17), s(oy - 17), s(ox + 17), s(oy + 17)), fill=255)), PAPER)
    lay(mask(lambda d: d.ellipse((s(ox - 17), s(oy - 17), s(ox + 17), s(oy + 17)), outline=255, width=int(s(2)))), INK)
    lay(mask(lambda d: d.text((s(ox), s(oy + 1)), '1', font=fc, anchor='mm', fill=255)), INK)
lay(mask(lambda d: d.rectangle((s(cx - 90), s(by1 - 40), s(cx + 90), s(by1 - 18)), fill=255)), PAPER)
lay(mask(lambda d: d.text((s(cx), s(by1 - 29)), 'ONE  DOLLAR', font=fs, anchor='mm', fill=255)), INK)
lay(mask(lambda d: d.rectangle((s(cx - 92), s(by0 + 18), s(cx + 92), s(by0 + 38)), fill=255)), PAPER)
lay(mask(lambda d: d.text((s(cx), s(by0 + 28)), 'PAYABLE  TO  THE  WINNER', font=ImageFont.truetype(SERIF, s(12)), anchor='mm', fill=255)), INK)

# ---------------- crossed orange sprigs ----------------
def leaf(cx, cy, ang, ln, wd, flip):
    t = math.radians(ang)
    ca, sa = math.cos(t), math.sin(t)
    pts_top, pts_bot = [], []
    for i in range(31):
        a = i / 30
        x = (a - 0.5) * ln
        y = math.sin(a * math.pi) ** 0.9 * wd / 2
        pts_top.append((cx + x * ca - y * sa, cy + x * sa + y * ca))
        pts_bot.append((cx + x * ca + y * sa, cy + x * sa - y * ca))
    poly = [(s(x), s(y)) for x, y in pts_top + pts_bot[::-1]]
    half = [(s(x), s(y)) for x, y in (pts_top if flip else pts_bot)]
    m = mask(lambda d: d.polygon(poly, fill=255))
    lay(mask(lambda d: d.polygon(poly, fill=255, outline=255, width=int(s(8)))) * 0 + m, PAPER)
    hm = mask(lambda d: d.polygon(half, fill=255))
    lay(hm * hatch(0.42, ang + 60, 4.2), INK)
    lay(m * hatch(0.12, ang + 60, 4.2), INK)
    lay(mask(lambda d: d.line(poly + [poly[0]], fill=255, width=int(s(2.6)))), INK)
    p0 = (s(cx - ln / 2 * ca), s(cy - ln / 2 * sa)); p1 = (s(cx + ln / 2 * 0.8 * ca), s(cy + ln / 2 * 0.8 * sa))
    lay(mask(lambda d: d.line([p0, p1], fill=255, width=int(s(1.8)))), INK)


def orange(cx, cy, r):
    disc = mask(lambda d: d.ellipse((s(cx - r - 5), s(cy - r - 5), s(cx + r + 5), s(cy + r + 5)), fill=255))
    lay(disc, PAPER)
    m = mask(lambda d: d.ellipse((s(cx - r), s(cy - r), s(cx + r), s(cy + r)), fill=255))
    # sphere lit from the upper left
    nx = (xx - s(cx)) / s(r); ny = (yy - s(cy)) / s(r)
    nz = np.sqrt(np.clip(1 - nx ** 2 - ny ** 2, 0, 1))
    lit = np.clip(-0.55 * nx - 0.6 * ny + 0.58 * nz, 0, 1)
    shade = 1 - lit
    lay(m * hatch(0.30 + shade * 0.55, 35, 5.0), ORANGE)               # spot colour body
    lay(m * hatch(np.clip(shade - 0.55, 0, 1) * 0.9, -40, 4.5), INK)   # cross hatch in the shadow
    # peel pores: a soft stipple of tiny dots in the mid tones
    rng = np.random.default_rng(int(cx))
    pts = rng.uniform(-r, r, (900, 2))
    pts = pts[(pts ** 2).sum(1) < (r * 0.92) ** 2]
    def dots(d):
        for px, py in pts:
            rr = 0.9 + 0.6 * rng.random()
            d.ellipse((s(cx + px - rr), s(cy + py - rr), s(cx + px + rr), s(cy + py + rr)), fill=255)
    lay(m * mask(dots) * (0.25 + shade * 0.75), ORANGE)
    lay(mask(lambda d: d.ellipse((s(cx - r), s(cy - r), s(cx + r), s(cy + r)), outline=255, width=int(s(3.2)))), INK)
    # stem button
    lay(mask(lambda d: d.ellipse((s(cx + r * 0.25 - 5), s(cy - r * 0.62 - 5), s(cx + r * 0.25 + 5), s(cy - r * 0.62 + 5)), fill=255)), INK)


def sprig(x0, y0, x1, y1, fruit, leaves):
    stroke_line((x0, y0), (x1, y1), 20, PAPER)
    stroke_line((x0, y0), (x1, y1), 9, INK)
    for lx, ly, ang, flip in leaves:
        leaf(lx, ly, ang, 128, 50, flip)
    orange(fruit[0], fruit[1], fruit[2])


# sprig A runs lower left to upper right; sprig B lower right to upper left, over the bill top
sprig(300, 420, 540, 236, (586, 180, 84), [(496, 252, -100, True), (548, 290, 15, False)])
sprig(580, 420, 340, 236, (294, 180, 84), [(384, 252, -80, False), (332, 290, 165, True)])
# a tie where they cross
lay(mask(lambda d: d.ellipse((s(440 - 13), s(328 - 13), s(440 + 13), s(328 + 13)), fill=255)), PAPER)
lay(mask(lambda d: d.ellipse((s(440 - 10), s(328 - 10), s(440 + 10), s(328 + 10)), fill=255)), INK)

# ---------------- monogram and scroll ----------------
fm = ImageFont.truetype(FONT, s(66))
for ch, x in (('H', 120), ('C', 760)):
    lay(mask(lambda d: d.text((s(x), s(330)), ch, font=fm, anchor='mm', fill=255)), INK)
fy = ImageFont.truetype(SERIF, s(26))
lay(mask(lambda d: d.text((s(120), s(400)), '18', font=fy, anchor='mm', fill=255)), ORANGE)
lay(mask(lambda d: d.text((s(760), s(400)), '74', font=fy, anchor='mm', fill=255)), ORANGE)


def ribbon():
    # tails behind, folded, then the main band with a gentle upward arc
    def arc_band(x0, x1, ytop, h, sag):
        top, bot = [], []
        for i in range(41):
            a = i / 40; x = x0 + (x1 - x0) * a
            dy = -sag * math.sin(a * math.pi)
            top.append((x, ytop + dy)); bot.append((x, ytop + h + dy))
        return top, bot
    for side in (-1, 1):
        bx = 440 + side * 300
        tail = [(bx - side * 40, 756), (bx + side * 70, 756), (bx + side * 40, 790), (bx + side * 70, 824), (bx - side * 40, 824)]
        tp = [(s(x), s(y)) for x, y in tail]
        lay(mask(lambda d: d.polygon(tp, fill=255)), PAPER)
        lay(mask(lambda d: d.polygon(tp, fill=255)) * hatch(0.45, 0, 4), INK)
        lay(mask(lambda d: d.line(tp + [tp[0]], fill=255, width=int(s(2.6)))), INK)
    top, bot = arc_band(170, 710, 740, 64, 18)
    poly = [(s(x), s(y)) for x, y in top + bot[::-1]]
    lay(mask(lambda d: d.polygon(poly, fill=255)), PAPER)
    lay(mask(lambda d: d.line(poly + [poly[0]], fill=255, width=int(s(3)))), INK)
    for off in (7, 57):
        ln = [(s(x), s(y + off)) for x, y in top]
        lay(mask(lambda d: d.line(ln, fill=255, width=int(s(1.2)))), INK)
    # the motto, letter by letter along the arc
    ft = ImageFont.truetype(FONT, s(31))
    text = 'MUTATIS MUTANDIS'
    widths = [ft.getlength(c) / SS for c in text]
    tot = sum(widths) + 3 * (len(text) - 1)
    x = 440 - tot / 2
    for c, w in zip(text, widths):
        mx = x + w / 2
        a = (mx - 170) / 540
        my = 740 + 32 - 18 * math.sin(a * math.pi)
        lay(mask(lambda d: d.text((s(mx), s(my)), c, font=ft, anchor='mm', fill=255)), INK)
        x += w + 3


ribbon()

out = np.dstack([rgb, alpha * 255]).astype(np.uint8)
Image.fromarray(out, 'RGBA').resize((OUT_W, OUT_H), Image.LANCZOS).save(os.path.join(A, 'crest.png'))
print('crest painted')
