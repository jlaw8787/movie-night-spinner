"""Paints the art and textures for the Docket Coffee Shop faxed specials sheet (16 Blocks, 2006).
The sheet is a cheap word-processor flyer with clip art, sent through a plain-paper fax
into a precinct squad room. Clip art is 1-bit dithered the way a fax renders grey.
Writes assets/mug.png, assets/cake.png, assets/hero.png, assets/route-map.png, assets/route-pen.png, assets/wear-p1.png, assets/wear-p2.png."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
INK = (24, 24, 24)
random.seed(2006)
np.random.seed(2006)

BAYER = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]]) / 16.0

def dither(grey):
    """grey L image (0 black .. 255 white) -> RGBA ink with ordered dither, like fax halftone."""
    g = np.asarray(grey, dtype=float) / 255.0
    h, w = g.shape
    t = np.tile(BAYER, (h // 4 + 1, w // 4 + 1))[:h, :w]
    on = (g < t).astype(np.uint8) * 255
    out = Image.new('RGBA', (w, h), INK + (0,))
    out.putalpha(Image.fromarray(on))
    return out

SS = 4  # supersample for drawing, then down to 2x page pixels and error-diffused like a fax

def fax(im, w, h):
    """greyscale drawing -> black ink on clear, still continuous tone. These go on the clean
    sheet as the shop printed it; fax.py dithers the whole transmitted page once, the way
    the sending machine did, so the art and the type break up together."""
    g = im.resize((w, h), Image.LANCZOS)
    on = 255 - np.asarray(g, dtype=np.uint8)
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    out.putalpha(Image.fromarray(on.astype(np.uint8)))
    return out

def grad_fill(im, mask_box_fn, x0, x1, stops):
    """cylindrical shading: horizontal grey ramp across x0..x1 through stops [(t, grey)], clipped by a mask."""
    W, H = im.size
    t = np.clip((np.arange(W) - x0) / max(1, x1 - x0), 0, 1)
    ts = [s[0] for s in stops]; gs = [s[1] for s in stops]
    row = np.interp(t, ts, gs)
    ramp = Image.fromarray(np.tile(row, (H, 1)).astype(np.uint8))
    m = Image.new('L', (W, H), 0)
    mask_box_fn(ImageDraw.Draw(m))
    im.paste(ramp, (0, 0), m)

def mug(w=380, h=330):
    S = SS * 2  # design units are page css px, 190 x 165
    im = Image.new('L', (w * SS, h * SS), 255)
    d = ImageDraw.Draw(im)
    u = lambda *v: [x * S for x in v]
    lw = 4 * S
    # saucer: wide ellipse with darker rim and inner well
    grad_fill(im, lambda m: m.ellipse(u(8, 128, 182, 162), fill=255), 8 * S, 182 * S, [(0, 215), (0.45, 245), (1, 120)])
    d.ellipse(u(8, 128, 182, 162), outline=0, width=lw)
    d.ellipse(u(40, 134, 150, 154), fill=150, outline=0, width=2 * S)
    # spoon resting on the saucer
    d.line(u(132, 150, 176, 138), fill=0, width=5 * S)
    d.line(u(133, 150, 175, 139), fill=200, width=2 * S)
    d.ellipse(u(114, 146, 136, 156), fill=90, outline=0, width=2 * S)
    # heavy diner mug body, shaded like a cylinder
    body = u(44, 52, 140, 148)
    def bodymask(m):
        m.rounded_rectangle(body, radius=18 * S, fill=255)
        m.rectangle(u(44, 52, 140, 100), fill=255)
    grad_fill(im, bodymask, 44 * S, 140 * S,
              [(0, 150), (0.18, 235), (0.32, 255), (0.62, 205), (0.88, 110), (1, 70)])
    d.rounded_rectangle(body, radius=18 * S, outline=0, width=lw)
    grad_fill(im, lambda m: m.rectangle(u(46, 50, 138, 80), fill=255), 44 * S, 140 * S,
              [(0, 150), (0.18, 235), (0.32, 255), (0.62, 205), (0.88, 110), (1, 70)])
    d.line(u(46, 52, 46, 132), fill=0, width=lw); d.line(u(138, 52, 138, 132), fill=0, width=lw)
    # two diner stripes under the rim
    for y in (66, 74):
        grad_fill(im, lambda m, y=y: m.rectangle(u(46, y, 138, y + 4), fill=255), 44 * S, 140 * S, [(0, 40), (0.3, 70), (1, 10)])
    # rim and coffee
    d.ellipse(u(44, 42, 140, 62), fill=245, outline=0, width=lw)
    d.ellipse(u(50, 46, 134, 59), fill=35)
    d.ellipse(u(62, 48, 92, 53), fill=110)
    # handle, thick with an inner shadow
    d.arc(u(116, 72, 168, 128), -80, 80, fill=0, width=12 * S)
    d.arc(u(120, 76, 164, 124), -76, 76, fill=205, width=5 * S)
    d.arc(u(121, 77, 163, 123), 10, 70, fill=110, width=3 * S)
    # tiny highlight down the left of the body
    d.rounded_rectangle(u(56, 84, 61, 132), radius=2 * S, fill=255)
    # steam, tapered wavy strokes
    for k, x0 in enumerate((70, 92, 114)):
        for t in range(0, 34):
            y = 40 - t
            x = x0 + 6 * math.sin((t + k * 5) / 5.0)
            r = 2.6 - t * 0.055
            d.ellipse(u(x - r, y - r, x + r, y + r), fill=0)
    return fax(im, w, h)

def cake(w=224, h=210):
    S = SS * 2  # design units 112 x 105
    im = Image.new('L', (w * SS, h * SS), 255)
    d = ImageDraw.Draw(im)
    u = lambda *v: [x * S for x in v]
    lw = 3 * S
    # cake stand plate
    grad_fill(im, lambda m: m.ellipse(u(4, 88, 108, 102), fill=255), 4 * S, 108 * S, [(0, 200), (0.4, 250), (1, 130)])
    d.ellipse(u(4, 88, 108, 102), outline=0, width=lw)
    # sides: dark chocolate, cylindrical
    side = lambda m: (m.rectangle(u(14, 52, 98, 92), fill=255), m.ellipse(u(14, 84, 98, 98), fill=255))
    grad_fill(im, side, 14 * S, 98 * S, [(0, 60), (0.25, 120), (0.45, 140), (0.8, 50), (1, 25)])
    # filling line between layers
    grad_fill(im, lambda m: m.rectangle(u(15, 70, 97, 74), fill=255), 14 * S, 98 * S, [(0, 200), (0.4, 250), (1, 150)])
    d.line(u(14, 52, 14, 91), fill=0, width=lw); d.line(u(98, 52, 98, 91), fill=0, width=lw)
    d.arc(u(14, 84, 98, 98), 0, 180, fill=0, width=lw)
    # top, frosted
    d.ellipse(u(14, 44, 98, 60), fill=95, outline=0, width=lw)
    d.ellipse(u(30, 47, 70, 54), fill=150)
    # frosting drips down the front
    for x, ln in ((22, 9), (31, 14), (42, 7), (53, 12), (64, 8), (75, 15), (86, 9)):
        y0 = 52 + 6 * math.sin(math.pi * (x - 14) / 84)
        d.rounded_rectangle(u(x - 2.4, y0, x + 2.4, y0 + ln), radius=2.4 * S, fill=20)
    # piped rosettes round the top edge
    for i in range(11):
        a = math.pi * i / 10
        x = 56 + 40 * math.cos(a); y = 52 + 7 * math.sin(a)
        d.ellipse(u(x - 4.5, y - 3.5, x + 4.5, y + 3.5), fill=235, outline=0, width=1 * S)
        d.arc(u(x - 2.5, y - 2, x + 2.5, y + 2), 200, 340, fill=0, width=1 * S)
    # piped dots round the base
    for i in range(12):
        x = 18 + i * 7
        y = 91 + 5 * math.sin(math.pi * (x - 14) / 84)
        d.ellipse(u(x - 3, y - 2.5, x + 3, y + 2.5), fill=225, outline=0, width=1 * S)
    # candles, striped, with flames and a glow
    for cx in (40, 56, 72):
        d.ellipse(u(cx - 10, 4, cx + 10, 30), fill=225)
        d.rectangle(u(cx - 3, 22, cx + 3, 50), fill=245, outline=0, width=1 * S)
        for y in range(24, 50, 6):
            d.polygon(u(cx - 3, y, cx + 3, y - 3, cx + 3, y + 0, cx - 3, y + 3), fill=40)
        d.line(u(cx, 22, cx, 18), fill=0, width=1 * S)
        d.polygon(u(cx, 6, cx + 4, 14, cx, 19, cx - 4, 14), fill=110, outline=0)
        d.ellipse(u(cx - 1.4, 12, cx + 1.4, 17), fill=250)
    return fax(im, w, h)

def sandwich(w=320, h=150):
    """chopped beef and cheese hero, side on, with a frilled pick, the way office clip art drew a sub."""
    S = SS * 2  # design units 160 x 75
    im = Image.new('L', (w * SS, h * SS), 255)
    d = ImageDraw.Draw(im)
    u = lambda *v: [x * S for x in v]
    lw = 3 * S
    # bottom roll
    grad_fill(im, lambda m: m.rounded_rectangle(u(10, 54, 150, 70), radius=8 * S, fill=255), 10 * S, 150 * S, [(0, 140), (0.3, 215), (1, 110)])
    d.rounded_rectangle(u(10, 54, 150, 70), radius=8 * S, outline=0, width=lw)
    # chopped beef and onion, lumpy dark band
    pts = [(12, 55)] + [(12 + i * 4, 46 + 2.2 * math.sin(i * 1.7) + 1.3 * math.cos(i * 3.1)) for i in range(35)] + [(148, 55)]
    d.polygon(u(*[c for p in pts for c in p]), fill=40, outline=0)
    for x in range(18, 146, 8):
        d.ellipse(u(x - 2, 48, x + 2, 51), fill=120)
    # melted cheese hanging over the roll
    for x, ln in ((22, 8), (47, 11), (70, 6), (96, 12), (121, 8), (140, 6)):
        d.rounded_rectangle(u(x - 3.2, 47, x + 3.2, 47 + ln), radius=3 * S, fill=235, outline=0, width=1 * S)
    # tomato slices
    for x in (26, 56, 86, 116, 140):
        d.ellipse(u(x - 13, 39, x + 13, 47), fill=120, outline=0, width=2 * S)
        d.arc(u(x - 8, 41, x + 8, 45), 180, 360, fill=210, width=1 * S)
    # ruffled lettuce
    lpts = [(6, 40)] + [(6 + i * 3, 36 + (3.4 if i % 2 else 0)) for i in range(51)] + [(154, 40), (150, 34), (10, 34)]
    d.polygon(u(*[c for p in lpts for c in p]), fill=165, outline=0)
    # long top roll, low dome with rounded ends, shaded and seeded
    roll = u(6, 6, 154, 40)
    grad_fill(im, lambda m: (m.rounded_rectangle(roll, radius=16 * S, fill=255)), 6 * S, 154 * S, [(0, 130), (0.22, 230), (0.5, 210), (1, 85)])
    d.rounded_rectangle(roll, radius=16 * S, outline=0, width=lw)
    d.line(u(30, 14, 90, 12), fill=255, width=3 * S)
    rnd = random.Random(16)
    for _ in range(34):
        x = rnd.uniform(20, 142); y = rnd.uniform(12, 32)
        d.ellipse(u(x - 1.7, y - 0.9, x + 1.7, y + 0.9), fill=255, outline=0, width=max(1, S // 2))
    # three slashes across the top, like a baked hero
    for x in (52, 80, 108):
        d.arc(u(x - 8, 8, x + 8, 24), 200, 290, fill=30, width=2 * S)
    # frilled pick
    d.line(u(80, 0, 80, 16), fill=0, width=2 * S)
    for i in range(6):
        a2 = i * math.pi / 3
        d.line(u(80, 3, 80 + 5 * math.cos(a2), 3 + 4 * math.sin(a2)), fill=0, width=2 * S)
    return fax(im, w, h)

# ---------------- the sixteen blocks ----------------
# Street elevation strip map, the way a shop's word-processor flyer would show "we deliver along here":
# the precinct at the west end, sixteen blocks of mixed buildings standing on the north sidewalk,
# the avenue with crosswalks and a city bus, the courthouse up its steps at the east end.
# Design units are css px of the map box (MW x MH); painted at 8x then brought to 4x css,
# the resolution the clean sheet is rendered at before it is faxed.
MW, MH = 704, 252
MX0, MX1 = 92, 612
MBW = (MX1 - MX0) / 16
CURB_N, CURB_S = 158, 206      # avenue band between the two curbs
WALK = 152                     # building base line (north sidewalk)

def route_map():
    S = 8
    im = Image.new('L', (MW * S, MH * S), 255)
    d = ImageDraw.Draw(im)
    u = lambda *v: [x * S for x in v]
    rnd = random.Random(16)
    LW = 1.4

    def box(x0, y0, x1, y1, fill=255, w=LW):
        d.rectangle(u(x0, y0, x1, y1), fill=fill, outline=0, width=max(1, int(w * S)))

    def line(*pts, w=1.0, fill=0):
        d.line(u(*pts), fill=fill, width=max(1, int(w * S)))

    def hatch(x0, y0, x1, y1, step=2.2, fill=150, w=0.5):
        y = y0 + step / 2
        while y < y1:
            line(x0, y, x1, y, w=w, fill=fill)
            y += step

    def windows(x0, y0, x1, y1, cols, rows, ww=4.0, wh=5.5, dark=None):
        gx = (x1 - x0) / cols; gy = (y1 - y0) / rows
        for r in range(rows):
            for c in range(cols):
                cx = x0 + gx * (c + 0.5); cy = y0 + gy * (r + 0.5)
                lit = rnd.random() < 0.35 if dark is None else dark
                d.rectangle(u(cx - ww / 2, cy - wh / 2, cx + ww / 2, cy + wh / 2),
                            fill=235 if lit else 40, outline=0, width=S // 2)
                line(cx - ww / 2 - 0.6, cy + wh / 2 + 0.6, cx + ww / 2 + 0.6, cy + wh / 2 + 0.6, w=0.9)

    def cornice(x0, x1, y):
        box(x0 - 1.2, y - 2.5, x1 + 1.2, y, fill=60, w=0.8)
        x = x0 + 1
        while x < x1 - 1:
            d.rectangle(u(x, y, x + 1, y + 1.4), fill=0); x += 2.6

    def storefront(x0, x1, awning=None):
        top = WALK - 15
        box(x0, top, x1, WALK, fill=255, w=1.0)
        d.rectangle(u(x0 + 2, top + 3, x1 - 9, WALK - 1), fill=90, outline=0, width=S // 2)
        line(x0 + 2, top + 8, x1 - 9, top + 8, w=0.6, fill=200)
        d.rectangle(u(x1 - 7, top + 3, x1 - 2, WALK), fill=25)
        if awning == 'stripe':
            n = 6; ww = (x1 - x0 + 4) / n
            for i in range(n):
                d.polygon(u(x0 - 2 + i * ww, top - 4, x0 - 2 + (i + 1) * ww, top - 4,
                            x0 - 2 + (i + 1) * ww + 0.6, top + 2, x0 - 2 + i * ww + 0.6, top + 2),
                          fill=30 if i % 2 == 0 else 245, outline=0)
            line(x0 - 2, top + 2, x1 + 2.6, top + 2, w=0.8)
        elif awning == 'plain':
            d.polygon(u(x0 - 1, top - 3, x1 + 1, top - 3, x1 + 3, top + 2, x0 + 1, top + 2), fill=120, outline=0)

    def tenement(x0, x1, top, floors, fire=True, tower=False, store=None):
        box(x0, top, x1, WALK, fill=250)
        hatch(x0 + 0.8, top + 3, x1 - 0.8, WALK - 16, step=2.4, fill=175, w=0.45)
        cornice(x0, x1, top + 2.5)
        windows(x0 + 2, top + 5, x1 - 2, WALK - 17, 2, floors)
        if fire:
            fx0, fx1 = x0 + 3, x1 - 3
            fy = top + 5
            step = (WALK - 17 - fy) / floors
            for f in range(floors):
                y = fy + step * (f + 1) - 1
                line(fx0, y, fx1, y, w=0.9)
                for xx in np.arange(fx0, fx1, 1.6):
                    line(xx, y, xx, y - 2.4, w=0.35)
                line(fx0, y - 2.6, fx1, y - 2.6, w=0.5)
                if f < floors - 1:
                    a, b = (fx0 + 2, fx1 - 2) if f % 2 == 0 else (fx1 - 2, fx0 + 2)
                    line(a, y, b, y + step, w=0.7)
        if tower:
            tx = (x0 + x1) / 2
            for lx in (tx - 5, tx - 1.5, tx + 2, tx + 5):
                line(lx, top - 7, lx, top, w=0.6)
            line(tx - 6, top - 4, tx + 6, top - 4, w=0.4)
            d.rectangle(u(tx - 6.5, top - 18, tx + 6.5, top - 7), fill=150, outline=0, width=S)
            for yy in (top - 15, top - 11):
                line(tx - 6.5, yy, tx + 6.5, yy, w=0.7)
            d.polygon(u(tx - 7.5, top - 18, tx, top - 24, tx + 7.5, top - 18), fill=40, outline=0)
        storefront(x0, x1, store)

    def office(x0, x1, top):
        box(x0, top, x1, WALK, fill=225)
        box(x0 + 3, top - 8, x1 - 3, top, fill=200, w=1.0)
        gx = (x1 - x0 - 4) / 4
        for i in range(5):
            line(x0 + 2 + gx * i, top + 2, x0 + 2 + gx * i, WALK - 16, w=0.7)
        y = top + 4
        while y < WALK - 17:
            d.rectangle(u(x0 + 2, y, x1 - 2, y + 2.4), fill=60); y += 5.2
        storefront(x0, x1, None)

    def church(x0, x1):
        cx = (x0 + x1) / 2
        top = 92
        box(x0, top, x1, WALK, fill=245)
        d.polygon(u(x0 - 1, top, cx, top - 12, x1 + 1, top), fill=210, outline=0, width=S)
        # stone coursing
        for yy in np.arange(top + 3, WALK, 3.2):
            line(x0 + 0.8, yy, x1 - 0.8, yy, w=0.35, fill=160)
        # tower and spire, set on the gable
        box(cx - 5, top - 34, cx + 5, top - 6, fill=235)
        d.arc(u(cx - 2.5, top - 30, cx + 2.5, top - 22), 180, 360, fill=0, width=S)
        d.rectangle(u(cx - 2.5, top - 26, cx + 2.5, top - 20), fill=30)
        d.polygon(u(cx - 6, top - 34, cx, top - 62, cx + 6, top - 34), fill=110, outline=0, width=S)
        for k in range(1, 6):
            yy = top - 34 - k * 4.6; hw = 6 * (1 - k * 4.6 / 28)
            line(cx - hw, yy, cx + hw, yy, w=0.45, fill=30)
        line(cx, top - 62, cx, top - 70, w=1.0); line(cx - 2.5, top - 67, cx + 2.5, top - 67, w=1.0)
        # rose window and arched door
        d.ellipse(u(cx - 5, top + 6, cx + 5, top + 16), fill=245, outline=0, width=S)
        for a in range(0, 360, 45):
            r = math.radians(a)
            line(cx, top + 11, cx + 5 * math.cos(r), top + 11 + 5 * math.sin(r), w=0.5)
        d.pieslice(u(cx - 5, WALK - 22, cx + 5, WALK - 12), 180, 360, fill=25)
        d.rectangle(u(cx - 5, WALK - 17, cx + 5, WALK), fill=25)
        line(cx, WALK - 17, cx, WALK, w=0.6, fill=200)
        for sx in (x0 + 3.5, x1 - 3.5):
            d.pieslice(u(sx - 2, top + 20, sx + 2, top + 24), 180, 360, fill=40)
            d.rectangle(u(sx - 2, top + 22, sx + 2, top + 34), fill=40)
        for i in range(3):
            line(x0 - i, WALK + 1.2 * i - 0.5, x1 + i, WALK + 1.2 * i - 0.5, w=0.6)

    def lot(x0, x1):
        # small parking lot behind a chain-link fence, one car parked
        line(x0, WALK - 12, x1, WALK - 12, w=0.9)
        for xx in np.arange(x0, x1, 2.0):
            line(xx, WALK - 12, xx + 2, WALK, w=0.35, fill=60)
            line(xx + 2, WALK - 12, xx, WALK, w=0.35, fill=60)
        for xx in (x0, (x0 + x1) / 2, x1):
            line(xx, WALK - 13, xx, WALK, w=1.0)
        d.rectangle(u(x0 + 4, WALK - 24, x1 - 4, WALK - 13), fill=255, outline=0, width=S)
        line(x0 + 6, WALK - 20, x1 - 6, WALK - 20, w=0.6); line(x0 + 6, WALK - 17, x1 - 10, WALK - 17, w=0.6)

    def liquor(x0, x1):
        top = 112
        box(x0, top, x1, WALK, fill=250)
        hatch(x0 + 0.8, top + 3, x1 - 0.8, WALK - 16, step=2.4, fill=175, w=0.45)
        cornice(x0, x1, top + 2.5)
        windows(x0 + 2, top + 5, x1 - 2, WALK - 18, 2, 1, dark=True)
        storefront(x0, x1, 'plain')
        # hanging sign with a bottle on it
        bx = x1 - 1
        line(bx, WALK - 22, bx + 7, WALK - 22, w=0.8)
        d.rectangle(u(bx + 1, WALK - 21, bx + 8, WALK - 12), fill=245, outline=0, width=S)
        d.rectangle(u(bx + 3.7, WALK - 20, bx + 5.3, WALK - 18), fill=0)
        d.rounded_rectangle(u(bx + 2.8, WALK - 18, bx + 6.2, WALK - 13), radius=S, fill=0)

    def precinct():
        x0, x1, top = 4, 84, 58
        box(x0, top, x1, WALK, fill=240, w=1.8)
        # rusticated stone base, smoother upper floors
        for yy in np.arange(WALK - 26, WALK, 3.4):
            line(x0 + 1, yy, x1 - 1, yy, w=0.5, fill=120)
        hatch(x0 + 1, top + 6, x1 - 1, WALK - 27, step=2.6, fill=190, w=0.4)
        box(x0 - 2, top - 4, x1 + 2, top + 2, fill=60, w=1.0)
        for xx in np.arange(x0, x1, 3.0):
            d.rectangle(u(xx, top + 2, xx + 1.5, top + 3.6), fill=0)
        for row, y in enumerate((top + 10, top + 30, top + 50)):
            for c in range(5):
                wx = x0 + 9 + c * 15.5
                d.pieslice(u(wx - 4, y - 3, wx + 4, y + 3), 180, 360, fill=40)
                d.rectangle(u(wx - 4, y, wx + 4, y + 11), fill=40 if (row + c) % 3 else 230, outline=0, width=S // 2)
                line(wx - 5, y + 11.8, wx + 5, y + 11.8, w=1.0)
        # door with fanlight, two lamp posts with globes, front steps
        cx = (x0 + x1) / 2
        d.pieslice(u(cx - 7, WALK - 26, cx + 7, WALK - 14), 180, 360, fill=200, outline=0, width=S)
        d.rectangle(u(cx - 7, WALK - 20, cx + 7, WALK - 3), fill=20)
        line(cx, WALK - 20, cx, WALK - 3, w=0.6, fill=180)
        for lx in (cx - 15, cx + 15):
            line(lx, WALK - 22, lx, WALK - 3, w=1.3)
            d.ellipse(u(lx - 3.6, WALK - 29.5, lx + 3.6, WALK - 22.3), fill=150, outline=0, width=S)
            d.ellipse(u(lx - 1.6, WALK - 28, lx + 0.2, WALK - 26), fill=245)
        for i in range(3):
            box(cx - 11 - i * 2, WALK - 3 + i * 1.6, cx + 11 + i * 2, WALK - 1.4 + i * 1.6, fill=220, w=0.6)

    def courthouse():
        x0, x1 = 624, 700
        cx = (x0 + x1) / 2
        podium = 122
        # pediment and entablature
        d.polygon(u(x0 - 4, 66, cx, 44, x1 + 4, 66), fill=245, outline=0, width=int(1.4 * S))
        d.polygon(u(x0 + 6, 63.5, cx, 49, x1 - 6, 63.5), fill=150)
        box(x0 - 4, 66, x1 + 4, 76, fill=240, w=1.2)
        for xx in np.arange(x0 - 2, x1 + 2, 3.0):
            d.rectangle(u(xx, 76, xx + 1.6, 78), fill=0)
        line(x0 - 4, 70, x1 + 4, 70, w=0.5)
        # back wall in shadow, then six fluted columns with capitals and bases
        d.rectangle(u(x0, 78, x1, podium), fill=70)
        n = 6
        for i in range(n):
            ccx = x0 + 5 + i * (x1 - x0 - 10) / (n - 1)
            grad_fill(im, lambda m, c=ccx: m.rectangle(u(c - 3.6, 80, c + 3.6, podium - 3), fill=255),
                      int((ccx - 3.6) * S), int((ccx + 3.6) * S), [(0, 210), (0.35, 255), (0.7, 225), (1, 120)])
            d.rectangle(u(ccx - 3.6, 80, ccx + 3.6, podium - 3), outline=0, width=S // 2)
            for fx in (-1.6, 0, 1.6):
                line(ccx + fx, 81, ccx + fx, podium - 4, w=0.3, fill=110)
            box(ccx - 5, 78, ccx + 5, 80.5, fill=230, w=0.6)
            box(ccx - 4.8, podium - 3, ccx + 4.8, podium, fill=230, w=0.6)
        # the steps: nine treads, each wider than the last, down to the sidewalk, with cheek walls
        treads = 9
        th = (WALK - podium) / treads
        for i in range(treads):
            y = podium + i * th
            grow = 2 + i * 1.8
            d.rectangle(u(x0 - grow, y, x1 + grow, y + th), fill=250, outline=0, width=S // 2)
            line(x0 - grow, y + th * 0.62, x1 + grow, y + th * 0.62, w=0.3, fill=150)
        # pedestals flanking the top of the steps
        for px in (x0 - 9, x1 + 1):
            box(px, podium - 9, px + 8, podium, fill=215, w=0.9)
            box(px - 1, podium - 11, px + 9, podium - 9, fill=120, w=0.6)
        # lamp standards at the foot of the steps
        for lx in (x0 - 20, x1 + 20):
            if 0 < lx < MW:
                line(lx, WALK - 26, lx, WALK, w=1.0)
                d.ellipse(u(lx - 2.6, WALK - 31, lx + 2.6, WALK - 25.5), fill=200, outline=0, width=S // 2)

    def bus(x0, y0):
        # a boxy city transit bus of the period, side view, heading east
        L, H = 74, 25
        d.rounded_rectangle(u(x0, y0, x0 + L, y0 + H), radius=3 * S, fill=245, outline=0, width=int(1.3 * S))
        line(x0, y0 + 15.5, x0 + L, y0 + 15.5, w=1.6)
        line(x0, y0 + 18, x0 + L, y0 + 18, w=0.5)
        for i in range(7):
            wx = x0 + 4 + i * 8.6
            d.rectangle(u(wx, y0 + 4, wx + 7, y0 + 12), fill=60, outline=0, width=S // 2)
            line(wx + 1, y0 + 5, wx + 3.5, y0 + 8, w=0.4, fill=220)
        d.rectangle(u(x0 + L - 6, y0 + 3, x0 + L - 1.2, y0 + 13), fill=90, outline=0, width=S // 2)
        d.rectangle(u(x0 + 20, y0 + 13.5, x0 + 26, y0 + H - 1.5), fill=40)
        d.rectangle(u(x0 + L - 14, y0 + 13.5, x0 + L - 8, y0 + H - 1.5), fill=40)
        d.rectangle(u(x0 + L - 17, y0 + 0.8, x0 + L - 3, y0 + 3.2), fill=20)
        for wx in (x0 + 12, x0 + L - 22):
            d.pieslice(u(wx - 6, y0 + H - 6, wx + 6, y0 + H + 6), 180, 360, fill=255)
            d.ellipse(u(wx - 4.6, y0 + H - 4.6, wx + 4.6, y0 + H + 4.6), fill=20)
            d.ellipse(u(wx - 1.8, y0 + H - 1.8, wx + 1.8, y0 + H + 1.8), fill=200)

    def bus_stop(x):
        line(x, WALK - 30, x, WALK + 4, w=1.0)
        d.rectangle(u(x - 4.5, WALK - 34, x + 4.5, WALK - 26), fill=30)
        d.rectangle(u(x - 3, WALK - 32.5, x + 3, WALK - 30.5), fill=240)

    # the avenue: curbs, lane line, crosswalks at every corner
    line(0, CURB_N, MW, CURB_N, w=1.8)
    line(0, CURB_S, MW, CURB_S, w=1.8)
    line(0, WALK, MW, WALK, w=0.6, fill=120)
    x = 2
    while x < MW:
        line(x, (CURB_N + CURB_S) / 2, min(x + 10, MW), (CURB_N + CURB_S) / 2, w=1.0)
        x += 18
    for k in range(17):
        bx = MX0 + k * MBW
        for yy in np.arange(CURB_N + 3, CURB_S - 2, 3.4):
            d.rectangle(u(bx - 2.6, yy, bx + 2.6, yy + 1.6), fill=150)
        # cross street gap: short curb returns either side
        line(bx - 3, WALK - 0.2, bx - 3, CURB_N, w=0.6)
        line(bx + 3, WALK - 0.2, bx + 3, CURB_N, w=0.6)
        line(bx - 3, CURB_S, bx - 3, CURB_S + 8, w=0.6)
        line(bx + 3, CURB_S, bx + 3, CURB_S + 8, w=0.6)

    def blk(k): return MX0 + k * MBW + 3.4, MX0 + (k + 1) * MBW - 3.4
    plan = [('tenement', 70, 5, True, False, None), ('tenement', 88, 4, True, False, 'plain'), ('liquor',),
            ('tenement', 80, 4, True, True, None), ('church',), ('tenement', 66, 5, False, False, 'plain'),
            ('lot',), ('office', 28), ('docket',), ('tenement', 74, 5, True, True, None),
            ('tenement', 96, 3, False, False, 'plain'), ('office', 40), ('tenement', 62, 5, True, False, None),
            ('tenement', 84, 4, True, True, 'plain'), ('tenement', 72, 5, False, False, None), ('tenement', 100, 3, True, False, 'plain')]
    for k, p in enumerate(plan):
        x0, x1 = blk(k)
        t = p[0]
        if t == 'tenement': tenement(x0, x1, p[1], p[2], p[3], p[4], p[5])
        elif t == 'liquor': liquor(x0, x1)
        elif t == 'church': church(x0, x1)
        elif t == 'lot': lot(x0, x1)
        elif t == 'office': office(x0, x1, p[1])
        elif t == 'docket':
            box(x0, 98, x1, WALK, fill=250)
            hatch(x0 + 0.8, 101, x1 - 0.8, WALK - 16, step=2.4, fill=175, w=0.45)
            cornice(x0, x1, 100.5)
            windows(x0 + 2, 103, x1 - 2, WALK - 18, 2, 3, dark=False)
            storefront(x0, x1, 'stripe')
    precinct()
    courthouse()
    bus_stop(MX0 + 10 * MBW + 9)
    bus(MX0 + 10 * MBW + 14, CURB_N + 4)
    out = fax(im, MW * 4, MH * 4)
    layout = dict(W=MW, H=MH, x0=MX0, x1=MX1, bw=MBW, curb_n=CURB_N, curb_s=CURB_S, walk=WALK)
    return out, layout


# ---------------- ballpoint, added by hand on the received copy ----------------
PEN = (26, 28, 38)

def _pen_img(W, H, draw_fn, seed, S=3):
    """draws thin ballpoint strokes at 3x css, returns RGBA in pen ink. Ballpoint skips a little
    and pools at the ends of strokes, so the alpha is mottled along the line."""
    big = Image.new('L', (W * S * 2, H * S * 2), 0)
    d = ImageDraw.Draw(big)
    draw_fn(d, S * 2)
    a = big.resize((W * S, H * S), Image.LANCZOS)
    arr = np.asarray(a, dtype=float)
    mott = 0.78 + 0.22 * soft_noise(W * S, H * S, 10, seed)
    alpha = np.clip(arr * mott, 0, 245)
    out = Image.new('RGBA', (W * S, H * S), PEN + (0,))
    out.putalpha(Image.fromarray(alpha.astype(np.uint8)))
    return out

def _polyline(d, pts, S, w):
    for (xa, ya), (xb, yb) in zip(pts, pts[1:]):
        n = max(2, int(math.hypot(xb - xa, yb - ya) * 2))
        for t in np.linspace(0, 1, n):
            x = xa + (xb - xa) * t; y = ya + (yb - ya) * t
            d.ellipse([(x - w / 2) * S, (y - w / 2) * S, (x + w / 2) * S, (y + w / 2) * S], fill=255)

def route_pen(W=MW, H=MH):
    """the 8 A.M. run traced in ballpoint: out of the precinct door, along the south lane,
    up the court steps, with an arrowhead. Quick, slightly wobbly, one lift halfway."""
    def draw(d, S):
        r = np.random.RandomState(8)
        lane = CURB_S - 7
        start = [(44, WALK - 6), (45, WALK + 2), (47, CURB_N + 12), (52, lane - 3), (60, lane)]
        _polyline(d, start, S, 1.25)
        for xa, xb, sd in ((60, 330, 3), (326, 640, 5)):
            n = int((xb - xa) / 3)
            xs = np.linspace(xa, xb, n)
            wob = np.cumsum(r.randn(n)) * 0.12
            wob -= np.linspace(wob[0], wob[-1], n)
            ys = lane + wob + 0.8 * np.sin(xs / 31.0 + sd)
            _polyline(d, list(zip(xs, ys)), S, 1.2)
        end = [(640, lane), (652, lane - 6), (660, CURB_N + 4), (662, WALK - 4), (662, WALK - 14)]
        _polyline(d, end, S, 1.2)
        _polyline(d, [(656, WALK - 7), (662, WALK - 15), (668, WALK - 8)], S, 1.3)
    return _pen_img(W, H, draw, 31)

def pen_loop(W, H, seed=4):
    """a quick ballpoint loop round a line of type, overshooting where it closes."""
    def draw(d, S):
        r = np.random.RandomState(seed)
        cx, cy = W / 2, H / 2
        rx, ry = W / 2 - 4, H / 2 - 4
        ts = np.linspace(-0.3, 2 * math.pi + 0.55, 260)
        pts = []
        for i, t in enumerate(ts):
            grow = 1 + 0.035 * (t / (2 * math.pi))
            x = cx + rx * grow * math.cos(t) * (1 + 0.012 * math.sin(3 * t))
            y = cy + ry * (grow + 0.06 * (t > math.pi * 2)) * math.sin(t) + 1.4 * math.sin(2.1 * t + 1)
            pts.append((x, y))
        _polyline(d, pts, S, 1.3)
    return _pen_img(W, H, draw, seed + 40)

def pen_tick(W=30, H=26):
    def draw(d, S):
        _polyline(d, [(4, 14), (8, 19), (11, 22), (17, 13), (26, 3)], S, 1.5)
    return _pen_img(W, H, draw, 77)

def pen_rules(W, H):
    """double underline under the total, two quick strokes"""
    def draw(d, S):
        _polyline(d, [(2, 3), (W * 0.5, 2.4), (W - 2, 3.4)], S, 1.3)
        _polyline(d, [(5, 7.5), (W * 0.55, 7), (W - 4, 8)], S, 1.2)
    return _pen_img(W, H, draw, 78)

def soft_noise(W, H, scale, seed):
    rng = np.random.RandomState(seed)
    small = rng.rand(max(2, H // scale), max(2, W // scale))
    img = Image.fromarray((small * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC)
    return np.asarray(img.filter(ImageFilter.GaussianBlur(scale / 2)), dtype=float) / 255.0

def wear(face, W=816 * 2, H=1056 * 2, ring=None):
    """Soft fax wear: faint horizontal banding from the scan head, a gentle toner mottle,
    darker edges and one pale vertical streak. Low detail, no pixel noise."""
    alpha = np.zeros((H, W))
    # banding: a few wide soft horizontal bands
    rng = np.random.RandomState(7 if face == 'p1' else 11)
    rows = np.zeros(H)
    for _ in range(9):
        c = rng.randint(0, H)
        w = rng.randint(6, 22)
        rows += 0.05 * np.exp(-((np.arange(H) - c) / w) ** 2)
    alpha += rows[:, None]
    alpha += 0.05 * soft_noise(W, H, 180, 3 if face == 'p1' else 5)
    # edge darkening
    yy, xx = np.mgrid[0:H, 0:W]
    ex = np.minimum(xx, W - 1 - xx) / W
    ey = np.minimum(yy, H - 1 - yy) / H
    e = np.minimum(ex, ey)
    alpha += 0.14 * np.clip(1 - e / 0.035, 0, 1) ** 2
    # pale vertical streak (dirty glass on the sending machine)
    sx = 1180 if face == 'p1' else 430
    alpha += 0.035 * np.exp(-((xx[0] - sx) / 5.0) ** 2)[None, :]
    a = Image.fromarray((np.clip(alpha, 0, 1) * 255).astype(np.uint8))
    out = Image.new('RGBA', (W, H), (40, 40, 38, 0))
    out.putalpha(a)
    if ring:
        cx, cy, r = ring
        rl = Image.new('L', (W, H), 0)
        rd = ImageDraw.Draw(rl)
        rd.ellipse([cx - r, cy - r, cx + r, cy + r], outline=70, width=14)
        rd.ellipse([cx - r + 8, cy - r + 6, cx + r - 4, cy + r - 2], outline=30, width=6)
        rl = rl.filter(ImageFilter.GaussianBlur(5))
        # break the ring up a little so it reads as a dried mark
        m = (soft_noise(W, H, 60, 21) * 1.6).clip(0, 1)
        rl = Image.fromarray((np.asarray(rl, dtype=float) * m).astype(np.uint8))
        stain = Image.new('RGBA', (W, H), (120, 84, 44, 0))
        stain.putalpha(rl)
        out = Image.alpha_composite(out, stain)
    return out

if __name__ == '__main__':
    import json
    mug().save(os.path.join(A, 'mug.png'))
    cake().save(os.path.join(A, 'cake.png'))
    sandwich().save(os.path.join(A, 'hero.png'))
    m, info = route_map()
    m.save(os.path.join(A, 'route-map.png'))
    json.dump(info, open(os.path.join(A, 'map.json'), 'w'))
    route_pen().save(os.path.join(A, 'pen-route.png'))
    pen_loop(330, 46).save(os.path.join(A, 'pen-loop.png'))
    pen_tick().save(os.path.join(A, 'pen-tick.png'))
    pen_rules(64, 11).save(os.path.join(A, 'pen-rules.png'))
    wear('p1').save(os.path.join(A, 'wear-p1.png'))
    wear('p2', ring=(1330, 1880, 120)).save(os.path.join(A, 'wear-p2.png'))
    print('painted', info)
