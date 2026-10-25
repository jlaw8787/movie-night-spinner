"""Paints the signature piece: Adam's attic model of Winter River, the Maitland house on its hill,
as a painted tabletop model (no longer used on the menu). Paints the sandworm-stripe border and the plain night paper for the front.
Everything is drawn here in PIL; no characters are drawn."""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance

D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
R = random.Random(1988)
INKC = (24, 18, 28)

def wob(pts, a=2.0):
    return [(x + R.uniform(-a, a), y + R.uniform(-a, a)) for x, y in pts]

def rot(pts, ang, cx, cy):
    c, s = math.cos(math.radians(ang)), math.sin(math.radians(ang))
    return [(cx + (x - cx) * c - (y - cy) * s, cy + (x - cx) * s + (y - cy) * c) for x, y in pts]

def mix(c1, c2, t):
    return tuple(int(a + (b - a) * t) for a, b in zip(c1, c2))

def shade_fill(img, pts, top, bot, mottle=0.0, outline=True, ow=3):
    """Fill a polygon with a vertical gradient plus soft mottling, then ink it."""
    xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
    x0, y0, x1, y1 = int(min(xs)) - 2, int(min(ys)) - 2, int(max(xs)) + 3, int(max(ys)) + 3
    w, h = max(1, x1 - x0), max(1, y1 - y0)
    m = Image.new('L', (w, h), 0)
    ImageDraw.Draw(m).polygon([(x - x0, y - y0) for x, y in pts], fill=255)
    g = Image.new('RGB', (1, h))
    for y in range(h):
        g.putpixel((0, y), mix(top, bot, y / max(1, h - 1)))
    g = g.resize((w, h))
    if mottle:
        n = Image.effect_noise((max(2, w // 10), max(2, h // 10)), 60).resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(3))
        n = n.point(lambda v: int(128 + (v - 128) * mottle))
        g = ImageChops.overlay(g, Image.merge('RGB', (n, n, n)))
    img.paste(g, (x0, y0), m)
    if outline:
        ImageDraw.Draw(img).line(pts + [pts[0]], fill=INKC, width=ow, joint='curve')

# ---------------- signature painting ----------------
PW, PH = 1392, 1260

def tree(img, x, y, r, seed):
    rr = random.Random(seed)
    d = ImageDraw.Draw(img)
    d.line([(x, y), (x + rr.uniform(-3, 3), y - r * 0.9)], fill=(58, 40, 34), width=max(3, int(r * 0.18)))
    d.ellipse([x - r * 0.9, y - r * 0.25, x + r * 0.9, y + r * 0.2], fill=(30, 40, 26))  # ground shadow
    greens = [(52, 86, 40), (74, 112, 44), (104, 138, 52), (140, 168, 70)]
    cy = y - r * 1.25
    for i, col in enumerate(greens):
        k = 1 - i * 0.2
        for _ in range(9 - i * 2):
            ox, oy = rr.uniform(-r * 0.6, r * 0.6) * k, rr.uniform(-r * 0.55, r * 0.5) * k
            rad = r * rr.uniform(0.35, 0.55) * k
            ox -= r * 0.12 * i; oy -= r * 0.12 * i  # lamp from upper left
            d.ellipse([x + ox - rad, cy + oy - rad, x + ox + rad, cy + oy + rad], fill=col)
    for _ in range(int(r * 1.4)):
        a, q = rr.uniform(0, 6.28), rr.uniform(0, r * 0.95)
        px, py = x + math.cos(a) * q, cy + math.sin(a) * q * 0.9
        d.point((px, py), fill=rr.choice([(36, 58, 30), (170, 190, 96), (90, 70, 110)]))

def box_house(img, x, y, s, wall, roof, ang=0, steeple=False):
    """A small model house in three-quarter view: front gable face, side face, roof. Slightly askew."""
    fw, fh, dx, dy = s * 0.6, s * 0.7, s * 0.55, -s * 0.22
    front = [(x - fw / 2, y), (x + fw / 2, y), (x + fw / 2, y - fh), (x - fw / 2, y - fh)]
    gable = [(x - fw / 2 - 2, y - fh), (x + fw / 2 + 2, y - fh), (x, y - fh - s * 0.38)]
    side = [(x + fw / 2, y), (x + fw / 2 + dx, y + dy), (x + fw / 2 + dx, y + dy - fh), (x + fw / 2, y - fh)]
    rf = [(x, y - fh - s * 0.38), (x + fw / 2 + 2, y - fh), (x + fw / 2 + dx + 4, y + dy - fh), (x + dx, y + dy - fh - s * 0.38)]
    tf = lambda p: wob(rot(p, ang, x, y), 1.4)
    ImageDraw.Draw(img).polygon([(x - fw / 2 - 6, y + 4), (x + fw / 2 + dx + 10, y + dy + 6), (x + fw / 2 + dx + 26, y + dy + 18), (x - fw / 2 + 14, y + 18)], fill=(34, 46, 30))
    shade_fill(img, tf(side), mix(wall, (40, 40, 60), 0.45), mix(wall, (20, 20, 40), 0.6), 0.5)
    shade_fill(img, tf(front), wall, mix(wall, (90, 90, 100), 0.25), 0.5)
    shade_fill(img, tf(gable), wall, mix(wall, (120, 120, 130), 0.2), 0.4)
    shade_fill(img, tf(rf), mix(roof, (255, 255, 255), 0.12), roof, 0.6)
    d = ImageDraw.Draw(img)
    for k in range(1, 5):
        t = k / 5
        a0 = (rf[0][0] + (rf[1][0] - rf[0][0]) * t, rf[0][1] + (rf[1][1] - rf[0][1]) * t)
        a1 = (rf[3][0] + (rf[2][0] - rf[3][0]) * t, rf[3][1] + (rf[2][1] - rf[3][1]) * t)
        d.line(tf([a0, a1]), fill=mix(roof, (0, 0, 0), 0.4), width=2)
    for k in range(1, 6):
        t = k / 6
        hx = side[0][0] + (side[1][0] - side[0][0]) * t
        hy = side[0][1] + (side[1][1] - side[0][1]) * t
        d.line(tf([(hx, hy - 2), (hx, hy - fh + 4)]), fill=mix(wall, (30, 20, 50), 0.6), width=1)
    win = (36, 30, 44)
    for wx in (-0.3, 0.12):
        p = tf([(x + fw * wx, y - fh * 0.78), (x + fw * wx + s * 0.1, y - fh * 0.78), (x + fw * wx + s * 0.1, y - fh * 0.48), (x + fw * wx, y - fh * 0.48)])
        d.polygon(p, fill=win)
    p = tf([(x - s * 0.05, y), (x + s * 0.06, y), (x + s * 0.06, y - fh * 0.38), (x - s * 0.05, y - fh * 0.38)])
    d.polygon(p, fill=(70, 30, 40))
    if steeple:
        bx = x
        tw = [(bx - s * 0.13, y - fh - s * 0.3), (bx + s * 0.13, y - fh - s * 0.3), (bx + s * 0.13, y - fh - s * 0.85), (bx - s * 0.13, y - fh - s * 0.85)]
        sp = [(bx - s * 0.16, y - fh - s * 0.85), (bx + s * 0.16, y - fh - s * 0.85), (bx + s * 0.02, y - fh - s * 1.55)]
        shade_fill(img, tf(tw), wall, mix(wall, (110, 110, 120), 0.3), 0.3)
        shade_fill(img, tf(sp), (90, 90, 104), (50, 50, 64), 0.3)
        d.polygon(tf([(bx - s * 0.05, y - fh - s * 0.72), (bx + s * 0.05, y - fh - s * 0.72), (bx + s * 0.05, y - fh - s * 0.55), (bx - s * 0.05, y - fh - s * 0.55)]), fill=win)

def maitland(img, cx, cy, u):
    """The Maitland house: white clapboard, steep front gable with round window, tower with dark mansard
    and roof walk, porch with red door, stone footing. Drawn on its own layer and set a little askew."""
    L = Image.new('RGBA', img.size, (0, 0, 0, 0))
    d = ImageDraw.Draw(L)
    P = lambda pts: [(cx + px * u, cy + py * u) for px, py in pts]
    WHITE, WSH, SLATE, SL2 = (236, 234, 222), (150, 152, 170), (74, 72, 84), (44, 42, 54)
    # stone footing
    shade_fill(L, wob(P([(-1.55, 0), (1.95, 0), (1.95, -0.3), (-1.55, -0.3)])), (130, 124, 116), (88, 82, 78), 1.2)
    for _ in range(60):
        sx, sy = R.uniform(-1.5, 1.9), R.uniform(-0.28, -0.04)
        d.ellipse([cx + sx * u - 6, cy + sy * u - 4, cx + sx * u + 6, cy + sy * u + 4], outline=(70, 64, 60), width=1)
    # side depth of tower
    shade_fill(L, wob(P([(1.55, -0.3), (1.95, -0.42), (1.95, -3.05), (1.55, -2.95)])), WSH, (110, 110, 132), 0.4)
    # chimney behind
    shade_fill(L, wob(P([(-0.2, -2.3), (0.08, -2.3), (0.08, -4.1), (-0.2, -4.1)])), (96, 52, 46), (64, 34, 34), 0.8)
    # left wing with gable
    shade_fill(L, wob(P([(-1.5, -0.3), (0.2, -0.3), (0.2, -2.3), (-1.5, -2.3)])), WHITE, (206, 204, 196), 0.35)
    shade_fill(L, wob(P([(-1.62, -2.28), (0.32, -2.28), (-0.65, -3.75)])), WHITE, (214, 212, 204), 0.35)
    shade_fill(L, wob(P([(-0.65, -3.75), (0.32, -2.28), (0.55, -2.28), (-0.5, -3.9)])), (96, 94, 108), SL2, 0.5)
    d.line(P([(-1.68, -2.22), (-0.65, -3.82), (0.4, -2.22)]), fill=INKC, width=5)
    # tower
    shade_fill(L, wob(P([(0.2, -0.3), (1.55, -0.3), (1.55, -3.0), (0.2, -3.0)])), WHITE, (200, 198, 192), 0.35)
    shade_fill(L, wob(P([(0.08, -3.0), (1.68, -3.0), (1.45, -3.7), (0.32, -3.7)])), (100, 98, 112), SL2, 0.7)
    for i in range(9):  # roof walk railing
        px = 0.36 + i * 0.135
        d.line(P([(px, -3.7), (px, -3.92)]), fill=INKC, width=3)
    d.line(P([(0.32, -3.92), (1.45, -3.92)]), fill=INKC, width=4)
    # clapboard lines
    for yy in [x * 0.12 for x in range(3, 25)]:
        d.line(P([(-1.48, -yy), (0.18, -yy)]), fill=(196, 194, 188), width=1)
        if yy < 2.95:
            d.line(P([(0.22, -yy), (1.53, -yy)]), fill=(190, 188, 184), width=1)
    # windows
    WIN = (34, 30, 48)
    def window(x0, y0, w, h, glow=False):
        q = P([(x0, y0), (x0 + w, y0), (x0 + w, y0 - h), (x0, y0 - h)])
        d.polygon(wob(q, 1), fill=(150, 170, 70) if glow else WIN, outline=(240, 238, 230))
        d.line([((q[0][0] + q[1][0]) / 2, q[0][1]), ((q[2][0] + q[3][0]) / 2, q[2][1])], fill=(240, 238, 230), width=2)
    window(-1.28, -1.55, 0.3, 0.62); window(-0.55, -1.55, 0.3, 0.62)
    window(0.45, -1.55, 0.3, 0.62); window(1.0, -1.55, 0.3, 0.62)
    window(0.45, -2.25, 0.3, 0.5); window(1.0, -2.25, 0.3, 0.5, glow=True)  # attic light on
    window(-1.28, -0.55, 0.3, 0.55); window(-0.55, -0.55, 0.3, 0.55)
    ox, oy = cx - 0.65 * u, cy - 2.85 * u
    d.ellipse([ox - 0.2 * u, oy - 0.2 * u, ox + 0.2 * u, oy + 0.2 * u], fill=WIN, outline=(240, 238, 230), width=3)
    tx, ty = cx + 1.1 * u, cy - 3.3 * u
    d.ellipse([tx - 0.14 * u, ty - 0.14 * u, tx + 0.14 * u, ty + 0.14 * u], fill=WIN, outline=(240, 238, 230), width=3)
    # porch
    shade_fill(L, wob(P([(0.05, -0.3), (2.05, -0.3), (2.05, -0.38), (0.05, -0.38)])), (180, 176, 168), (140, 136, 130), 0.2)
    for px in (0.1, 0.62, 1.14, 1.66, 2.0):
        d.rectangle([cx + px * u - 4, cy - 1.12 * u, cx + px * u + 4, cy - 0.38 * u], fill=(236, 234, 226), outline=INKC)
    shade_fill(L, wob(P([(-0.05, -1.12), (2.15, -1.12), (2.0, -1.38), (0.1, -1.38)])), (110, 108, 120), SL2, 0.5)
    shade_fill(L, wob(P([(0.78, -0.38), (1.05, -0.38), (1.05, -1.0), (0.78, -1.0)])), (178, 36, 40), (120, 20, 30), 0.3)
    for i in range(5):  # steps
        d.line(P([(0.66 - i * 0.03, -0.3 + i * 0.09), (1.17 + i * 0.03, -0.3 + i * 0.09)]), fill=(210, 206, 196), width=6)
        d.line(P([(0.66 - i * 0.03, -0.26 + i * 0.09), (1.17 + i * 0.03, -0.26 + i * 0.09)]), fill=INKC, width=2)
    L = L.rotate(2.5, center=(cx, cy), resample=Image.BICUBIC)
    sh = L.getchannel('A').filter(ImageFilter.GaussianBlur(10)).point(lambda v: int(v * 0.5))
    img.paste((20, 26, 22), (int(0.25 * u), int(0.06 * u)), sh)
    img.paste(L, (0, 0), L)

def flock(img, poly, n, cols, seed):
    rr = random.Random(seed)
    m = Image.new('L', img.size, 0); ImageDraw.Draw(m).polygon(poly, fill=255)
    lay = Image.new('RGB', img.size); ld = ImageDraw.Draw(lay)
    lay.paste(img)
    xs = [p[0] for p in poly]; ys = [p[1] for p in poly]
    for _ in range(n):
        x, y = rr.uniform(min(xs), max(xs)), rr.uniform(min(ys), max(ys))
        r = rr.uniform(1, 2.6)
        ld.ellipse([x - r, y - r, x + r, y + r], fill=rr.choice(cols))
    img.paste(lay, (0, 0), m)

def soft_shadow(img, poly, col, alpha, blur):
    m = Image.new('L', img.size, 0); ImageDraw.Draw(m).polygon(poly, fill=alpha)
    img.paste(col, (0, 0), m.filter(ImageFilter.GaussianBlur(blur)))

def painting():
    img = Image.new('RGB', (PW, PH))
    g = Image.linear_gradient('L').resize((PW, PH))
    img = Image.composite(Image.new('RGB', (PW, PH), (14, 9, 20)), Image.new('RGB', (PW, PH), (48, 32, 66)), g)
    bg = Image.new('L', (PW, PH), 0)
    ImageDraw.Draw(bg).ellipse([-100, -300, 760, 520], fill=255)
    bg = bg.filter(ImageFilter.GaussianBlur(170))
    img = Image.composite(Image.new('RGB', (PW, PH), (120, 132, 70)), img, bg.point(lambda v: int(v * 0.4)))
    d = ImageDraw.Draw(img)
    # bare attic bulb on its cord
    d.line([(300, 0), (300, 96)], fill=(10, 8, 14), width=4)
    hal = Image.new('L', (PW, PH), 0); ImageDraw.Draw(hal).ellipse([180, 20, 420, 240], fill=255)
    img.paste((214, 222, 140), (0, 0), hal.filter(ImageFilter.GaussianBlur(50)).point(lambda v: int(v * 0.55)))
    d = ImageDraw.Draw(img)
    d.rectangle([288, 92, 312, 112], fill=(60, 56, 50), outline=(10, 8, 14), width=2)
    d.ellipse([272, 108, 328, 166], fill=(250, 248, 210), outline=(150, 150, 90), width=2)
    # board top surface (flock grass), lit from the upper left
    top = wob([(30, 470), (360, 400), (760, 380), (1180, 420), (1370, 470), (1372, 1030), (900, 1100), (330, 1080), (24, 1010)], 4)
    shade_fill(img, top, (150, 166, 80), (84, 104, 50), 0.45, ow=4)
    soft_shadow(img, [(700, 380), (1372, 420), (1372, 1100), (900, 1100)], (60, 50, 80), 90, 120)
    flock(img, top, 16000, [(170, 186, 96), (96, 120, 54), (120, 140, 64), (80, 96, 70), (186, 196, 110)], 7)
    # board side, painted in black and white stripes
    side = [(24, 1010), (330, 1080), (900, 1100), (1372, 1030), (1372, 1150), (900, 1220), (330, 1200), (24, 1130)]
    m = Image.new('L', (PW, PH), 0); ImageDraw.Draw(m).polygon(side, fill=255)
    st = Image.new('RGB', (PW, PH), (232, 230, 220)); sd = ImageDraw.Draw(st)
    for x in range(-40, PW + 60, 56):
        sd.polygon([(x, 980), (x + 28, 980), (x + 18, 1260), (x - 10, 1260)], fill=(20, 18, 22))
    st = ImageEnhance.Brightness(st).enhance(0.82)
    img.paste(st, (0, 0), m)
    d = ImageDraw.Draw(img)
    d.line(side + [side[0]], fill=INKC, width=4)
    d.line([(24, 1016), (330, 1086), (900, 1106), (1372, 1036)], fill=(250, 248, 236), width=2)
    # big hill with the house
    hill = wob([(700, 640), (770, 500), (880, 410), (1010, 372), (1150, 384), (1270, 436), (1350, 500), (1372, 520), (1372, 700), (1200, 760), (900, 760)], 4)
    soft_shadow(img, [(x + 30, y + 26) for x, y in hill], (30, 30, 40), 150, 30)
    shade_fill(img, hill, (186, 196, 104), (110, 132, 60), 0.4, ow=4)
    soft_shadow(img, [(1120, 380), (1372, 520), (1372, 760), (1100, 760)], (70, 56, 96), 110, 60)
    flock(img, hill, 6000, [(196, 206, 120), (120, 140, 66), (150, 166, 84)], 9)
    # river with covered bridge
    river = [(40, 560), (170, 600), (300, 660), (400, 730), (470, 800), (520, 900), (560, 1000), (600, 1092)]
    d.line(river, fill=(36, 52, 74), width=64, joint='curve')
    d.line(river, fill=(70, 100, 132), width=46, joint='curve')
    d.line([(p[0] - 8, p[1] - 6) for p in river], fill=(150, 176, 196), width=4, joint='curve')
    # road from the house down through town
    road = [(1010, 700), (930, 760), (820, 800), (700, 820), (600, 860), (470, 860), (330, 880), (200, 930), (40, 960)]
    d.line(road, fill=(96, 82, 60), width=34, joint='curve')
    d.line(road, fill=(184, 164, 120), width=24, joint='curve')
    d.line([(x, y + 2) for x, y in road[:5]], fill=(206, 190, 150), width=3, joint='curve')
    # bridge
    shade_fill(img, wob([(380, 840), (520, 820), (520, 772), (380, 792)], 1), (164, 54, 48), (110, 34, 34), 0.4)
    shade_fill(img, wob([(372, 794), (528, 774), (500, 734), (396, 752)], 1), (70, 64, 74), (40, 36, 46), 0.4)
    d.polygon([(420, 830), (480, 822), (480, 796), (420, 804)], fill=(30, 18, 22))
    # things, painted back to front
    items = []
    BONE, SAGE, MAUVE, BARN = (228, 224, 208), (184, 192, 164), (176, 150, 170), (150, 58, 52)
    PR, SL = (70, 54, 82), (56, 58, 72)
    houses = [(200, 600, 74, BONE, PR), (330, 640, 70, BARN, SL), (560, 650, 76, SAGE, PR), (640, 720, 80, BONE, SL),
              (120, 720, 86, MAUVE, SL), (250, 760, 90, BONE, PR), (560, 950, 104, BONE, SL), (720, 900, 96, BARN, PR),
              (200, 1000, 110, SAGE, PR), (860, 960, 100, BONE, PR), (1020, 1000, 108, MAUVE, SL), (380, 980, 96, BONE, SL)]
    for x, y, s, w, r in houses:
        items.append((y, 'h', (x, y, s, w, r)))
    items.append((700, 'c', (430, 700, 92)))
    for x, y in [(330, 712), (360, 718), (350, 740), (385, 735), (318, 744)]:
        items.append((y, 's', (x, y)))
    spots = [(60, 640), (100, 560), (280, 560), (470, 610), (500, 680), (700, 640), (760, 700), (650, 600), (430, 920), (130, 840),
             (60, 900), (300, 860), (480, 1050), (700, 1020), (800, 860), (960, 880), (1110, 900), (1200, 840), (1300, 820),
             (1290, 980), (1180, 1040), (900, 1060), (60, 1040), (330, 1060), (760, 1080), (1330, 640), (1280, 520), (800, 560),
             (880, 520), (1220, 640), (170, 1070), (620, 1080), (1000, 790), (1120, 780), (1250, 760)]
    for i, (x, y) in enumerate(spots):
        items.append((y, 't', (x + R.uniform(-10, 10), y + R.uniform(-8, 8), R.uniform(24, 34) * (0.75 + y / 1400), i)))
    items.append((470, 'm', None))
    items.sort(key=lambda t: t[0])
    for y, k, a in items:
        if k == 'h':
            box_house(img, *a[:4], a[4], ang=R.uniform(-6, 6))
        elif k == 'c':
            box_house(img, a[0], a[1], a[2], (238, 236, 226), (72, 70, 84), ang=-3, steeple=True)
        elif k == 's':
            sx, sy = a
            ImageDraw.Draw(img).rounded_rectangle([sx - 6, sy - 16, sx + 6, sy], radius=5, fill=(150, 150, 158), outline=INKC)
        elif k == 't':
            tree(img, a[0], a[1], a[2], a[3])
        elif k == 'm':
            maitland(img, 1010, 470, 96)
    # a tiny striped worm sneaking along the board edge (the sandworm motif, not a character)
    # paint finish: oil-paint blotch, lamp falloff, soft grain
    img = img.filter(ImageFilter.ModeFilter(3))
    br = Image.effect_noise((PW // 3, PH // 14), 50).resize((PW, PH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(1))
    br = br.rotate(-8, resample=Image.BICUBIC, expand=False, fillcolor=128).point(lambda v: 128 + (v - 128) // 14)
    img = ImageChops.overlay(img, Image.merge('RGB', (br, br, br)))
    img = img.filter(ImageFilter.UnsharpMask(2, 60, 2))
    vig = Image.new('L', (PW, PH), 0)
    ImageDraw.Draw(vig).ellipse([-200, -200, PW + 300, PH + 200], fill=255)
    vig = vig.filter(ImageFilter.GaussianBlur(180))
    img = Image.composite(img, ImageEnhance.Brightness(img).enhance(0.55), vig)
    n = Image.effect_noise((PW, PH), 22).filter(ImageFilter.GaussianBlur(0.8))
    img = ImageChops.overlay(img, Image.merge('RGB', (n.point(lambda v: 118 + v // 12),) * 3))
    img.save(A('model-town.jpg'), quality=92)

# ---------------- sandworm stripe border ----------------
def worm_border(name, W=816, H=1056, band=26, seg=22, light=(232, 230, 220), dark=(20, 18, 22)):
    S = 2; w, h = W * S, H * S; b = band * S
    img = Image.new('RGBA', (w, h), (0, 0, 0, 0)); d = ImageDraw.Draw(img)
    per = 2 * (w + h)
    t = 0.0; i = 0
    def at(t):
        t %= per
        if t < w: return t, 0, 0
        if t < w + h: return w, t - w, 1
        if t < 2 * w + h: return w - (t - w - h), h, 2
        return 0, h - (t - 2 * w - h), 3
    while t < per:
        x, y, s = at(t)
        L = seg * S
        wid = b * (0.86 + 0.14 * math.sin(t / (90 * S)))
        col = dark if i % 2 == 0 else light
        if s in (0, 2):
            x0, x1 = (x, x + L) if s == 0 else (x - L, x)
            yy = 0 if s == 0 else h - wid
            d.polygon([(x0, yy), (x1 + 4, yy), (x1 + 4 - 6, yy + wid), (x0 - 6, yy + wid)], fill=col)
        else:
            y0, y1 = (y, y + L) if s == 1 else (y - L, y)
            xx = w - wid if s == 1 else 0
            d.polygon([(xx, y0), (xx + wid, y0 - 6), (xx + wid, y1 + 4 - 6), (xx, y1 + 4)], fill=col)
        t += L; i += 1
    # rounded inner edge shading so the band reads as a body
    sh = Image.new('L', (w, h), 0); sd = ImageDraw.Draw(sh)
    sd.rectangle([b * 0.55, b * 0.55, w - b * 0.55, h - b * 0.55], outline=60, width=int(b * 0.4))
    sh = sh.filter(ImageFilter.GaussianBlur(8))
    dark_l = Image.new('RGBA', (w, h), (40, 20, 60, 0)); dark_l.putalpha(ImageChops.multiply(sh, img.getchannel('A')))
    img = Image.alpha_composite(img, dark_l)
    img.resize((W * 2, H * 2), Image.LANCZOS).save(A(name))

# ---------------- spiral paper texture for the front ----------------
def spiral(d, cx, cy, r, turns, col, wd):
    pts = []
    for k in range(int(turns * 120)):
        a = k / 120 * 2 * math.pi
        q = r * k / (turns * 120)
        pts.append((cx + math.cos(a) * q, cy + math.sin(a) * q * 0.8))
    d.line(pts, fill=col, width=wd, joint='curve')

def front_paper(W=816, H=1056):
    img = Image.new('RGB', (W * 2, H * 2), (30, 20, 40))
    d = ImageDraw.Draw(img)
    rnd = random.Random(88)
    for _ in range(9000):
        x, y = rnd.randrange(W * 2), rnd.randrange(H * 2); c = rnd.randint(22, 44)
        d.point((x, y), fill=(c, c - 8, c + 12))
    img = img.filter(ImageFilter.GaussianBlur(1.2))
    v = Image.new('L', img.size, 0); ImageDraw.Draw(v).ellipse([-300, -200, W * 2 + 300, H * 2 + 200], fill=255)
    v = v.filter(ImageFilter.GaussianBlur(220))
    img = Image.composite(img, ImageEnhance.Brightness(img).enhance(0.5), v)
    img.save(A('paper-front.jpg'), quality=90)

def spiral_png(name, col=(24, 18, 28), size=120):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    spiral(ImageDraw.Draw(img), size / 2, size / 2, size * 0.46, 3.0, col + (255,), 6)
    img.save(A(name))

if __name__ == '__main__':
    worm_border('worm-border.png')
    front_paper()
    print('painted')
