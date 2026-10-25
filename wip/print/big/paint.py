"""Paints the printed art for the MacMillan company party menu (Big, 1988).

Two spot inks on ivory board, like a 1988 two-colour offset job: black and a lacquer red, with the red
plate a hair out of register. Everything is drawn at 3x and reduced, so lines come out fine and even.
  cover-keys.png   the cover engraving: a floor keyboard in perspective under a red deco sunburst
  strip-keys.png   the back's left border: a straight-on keyboard running the full height
  clip.png         a small steel paper clip for the business card
  wear-*.png       soft edge wear and big gentle mottling (no pixel noise)
"""
import math, os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
S = 3
BLACK = (27, 42, 74)        # navy plate
RED = (196, 32, 44)
W, H = 816, 1056


def plate(w, h):
    return Image.new('L', (w, h), 0)


def ink(layers, w, h, reg=(0, 0)):
    """Stack ink plates (L masks) into an RGBA print; each plate is a flat spot ink."""
    out = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    for mask, col, off in layers:
        if off != (0, 0):
            mask = ImageChops.offset(mask, *off)
        layer = Image.new('RGBA', (w, h), col + (0,))
        layer.putalpha(mask)
        out = Image.alpha_composite(out, layer)
    return out


def rough(mask, amt=0.10, seed=1):
    """Slightly uneven ink coverage: big soft blotches knocked out of a solid, like offset on uncoated board."""
    rnd = random.Random(seed)
    w, h = mask.size
    n = Image.new('L', (w // 24 + 1, h // 24 + 1))
    n.putdata([int(255 * (1 - amt * rnd.random())) for _ in range(n.size[0] * n.size[1])])
    n = n.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6))
    return ImageChops.multiply(mask, n)


# ------------------------------------------------------------ cover engraving
def cover_keys():
    w, h = 736 * S, 330 * S
    blk, red = plate(w, h), plate(w, h)
    db, dr = ImageDraw.Draw(blk), ImageDraw.Draw(red)

    N = 15                                  # two octaves, C to C
    yf, yb = h - 34 * S, int(h * 0.42)      # front and back edge of the keys
    wf = w - 70 * S                         # front edge width
    r = 0.50                                # back edge is half the front edge
    cx = w / 2
    hy = (yb - yf * r) / (1 - r)            # horizon, from the two edges

    def P(u, t, lift=0.0):
        """u: key units across (0..N), t: 0 back to 1 front (even in depth), lift: height in key units."""
        z = (1 / r) * (1 - t) + t
        x = cx + (u - N / 2) * (wf / N) / z
        y = hy + (yf - hy) / z - lift * (wf / N) / z
        return (x, y)

    # deco sunburst behind the keyboard, red plate: alternating wide and hairline rays
    vx, vy = cx, yb + 6 * S
    for i in range(-24, 25):
        a = math.radians(90 + i * 3.4)
        L = h * 1.4
        x2, y2 = vx + L * math.cos(a), vy - L * math.sin(a)
        if i % 2 == 0:
            a1, a2 = a - math.radians(0.32), a + math.radians(0.32)
            dr.polygon([(vx, vy), (vx + L * math.cos(a1), vy - L * math.sin(a1)), (vx + L * math.cos(a2), vy - L * math.sin(a2))], fill=255)
        else:
            dr.line([(vx, vy), (x2, y2)], fill=255, width=max(1, int(0.7 * S)))
    # fade the rays out radially so they end well inside the art, like an engraved sunburst
    import numpy as np
    yy, xx = np.mgrid[0:h, 0:w]
    dist = np.hypot((xx - vx) / (w * 0.47), (yy - vy) / (h * 0.62))
    f = np.clip((1.0 - dist) / 0.45, 0, 1) ** 1.3
    fade = Image.fromarray((f * 255).astype('uint8'))
    red = ImageChops.multiply(red, fade)
    # keep rays above the back edge of the keyboard only
    cut = plate(w, h)
    ImageDraw.Draw(cut).rectangle([0, 0, w, yb - 4 * S], fill=255)
    red = ImageChops.multiply(red, cut)
    dr = ImageDraw.Draw(red)

    lw = int(1.3 * S)
    # floor shadow under the front lip, hatched
    for k in range(0, 26 * S, int(2.6 * S)):
        y = yf + 9 * S + k * 0.55
        x0, x1 = P(-0.15, 1)[0] + k * 0.6, P(N + 0.15, 1)[0] - k * 0.6
        db.line([(x0, y), (x1, y)], fill=int(200 * (1 - k / (26 * S))), width=max(1, int(0.8 * S)))
    # front lip of the white keys (the key fronts, seen edge on)
    lip = 8 * S
    fl, fr = P(0, 1), P(N, 1)
    db.rectangle([fl[0], fl[1], fr[0], fl[1] + lip], fill=0)
    for u in range(N + 1):
        x = P(u, 1)[0]
        db.line([(x, fl[1]), (x, fl[1] + lip)], fill=255, width=lw)
    for k in range(int(1.6 * S), lip, int(2.0 * S)):     # hatch the lip
        db.line([(fl[0], fl[1] + k), (fr[0], fl[1] + k)], fill=150, width=max(1, int(0.6 * S)))
    db.line([(fl[0], fl[1] + lip), (fr[0], fr[1] + lip)], fill=255, width=int(1.6 * S))
    # key outlines
    for u in range(N + 1):
        db.line([P(u, 0), P(u, 1)], fill=255, width=lw)
    db.line([P(0, 0), P(N, 0)], fill=255, width=int(1.8 * S))
    db.line([P(0, 1), P(N, 1)], fill=255, width=int(1.8 * S))

    # black keys: C# D#  F# G# A# in each octave
    offs = []
    for o in range(2):
        for b in (1, 2, 4, 5, 6):
            offs.append(o * 7 + b)
    bw = 0.56
    tb = 0.60          # black keys run 60% of the way forward
    hgt = 0.28         # raised height in key units
    for c in offs:
        u0, u1 = c - bw / 2, c + bw / 2
        # cast shadow on the white keys, hatched with fine diagonals toward the right
        sh = [P(u1, 0.02), P(u1 + 0.30, 0.04), P(u1 + 0.30, tb + 0.05), P(u1, tb)]
        smask = plate(w, h)
        ImageDraw.Draw(smask).polygon(sh, fill=255)
        hatch = plate(w, h)
        hd = ImageDraw.Draw(hatch)
        x0, y0 = sh[0]
        for k in range(-80 * S, 80 * S, int(2.4 * S)):
            hd.line([(x0 + k, y0 - 10 * S), (x0 + k + 140 * S, y0 + 260 * S)], fill=170, width=max(1, int(0.55 * S)))
        blk = ImageChops.lighter(blk, ImageChops.multiply(hatch, smask))
        db = ImageDraw.Draw(blk)
        # front face (vertical) and top face
        front = [P(u0, tb), P(u1, tb), P(u1, tb, hgt), P(u0, tb, hgt)]
        top = [P(u0, 0, hgt), P(u1, 0, hgt), P(u1, tb, hgt), P(u0, tb, hgt)]
        side = [P(u0, 0), P(u0, tb), P(u0, tb, hgt), P(u0, 0, hgt)]
        db.polygon(side, fill=255)
        db.polygon(front, fill=255)
        db.polygon(top, fill=255)
        # engraved highlights cut out of the black: one hairline down the top, fine lines across the front face
        a, b = P(u0 + 0.12, 0.03, hgt), P(u0 + 0.12, tb - 0.04, hgt)
        db.line([a, b], fill=0, width=max(1, int(0.9 * S)))
        fy0, fy1 = P(u0, tb)[1], P(u0, tb, hgt)[1]
        for k in range(1, 4):
            yy = fy1 + (fy0 - fy1) * k / 4.0
            db.line([(P(u0, tb)[0] + 2 * S, yy), (P(u1, tb)[0] - 2 * S, yy)], fill=0, width=max(1, int(0.5 * S)))

    blk = rough(blk, 0.08, 3)
    red = rough(red, 0.14, 4)
    art = ink([(red, RED, (int(1.2 * S), int(0.6 * S))), (blk, BLACK, (0, 0))], w, h)
    art = art.resize((736 * 2, 330 * 2), Image.LANCZOS)
    art.save(os.path.join(A, 'cover-keys.png'))


# ------------------------------------------------------------ the back's keyboard border
def strip_keys():
    sw, sh = 104, H
    w, h = sw * S, sh * S
    blk, red = plate(w, h), plate(w, h)
    db, dr = ImageDraw.Draw(blk), ImageDraw.Draw(red)
    n = 22
    kh = h / n
    lw = int(1.2 * S)
    # keys run left (back) to right (front); black keys sit at the back, against the trim
    for i in range(n + 1):
        y = i * kh
        db.line([(0, y), (w - 8 * S, y)], fill=255, width=lw)
    db.line([(w - 8 * S, 0), (w - 8 * S, h)], fill=255, width=int(1.8 * S))
    # front lip shading on the key fronts, engraved hatch
    for k in range(int(2 * S), int(8 * S), int(1.8 * S)):
        db.line([(w - 8 * S + k, 0), (w - 8 * S + k, h)], fill=120, width=max(1, int(0.5 * S)))
    # black keys: pattern of the octave starting on C at the top
    pat = [1, 2, 4, 5, 6]
    bl = 0.60 * (w - 8 * S)
    bwid = 0.56 * kh
    for i in range(n + 1):
        if (i % 7) in pat:
            yc = i * kh
            y0, y1 = yc - bwid / 2, yc + bwid / 2
            # hatched shadow below each black key
            for k in range(0, int(0.28 * kh), int(2.2 * S)):
                db.line([(0, y1 + k), (bl - k * 0.5, y1 + k)], fill=150, width=max(1, int(0.5 * S)))
            db.rectangle([0, y0, bl, y1], fill=255)
            db.line([(0, y0 + 0.22 * bwid), (bl - 4 * S, y0 + 0.22 * bwid)], fill=0, width=max(1, int(0.9 * S)))
            for k in range(1, 4):
                xx = bl - k * 1.6 * S
                db.line([(xx, y0 + 2 * S), (xx, y1 - 2 * S)], fill=0, width=max(1, int(0.45 * S)))
    # red rule to the right of the keys
    dr.rectangle([w - 3 * S, 0, w - 1 * S, h], fill=255)
    blk = rough(blk, 0.08, 7)
    red = rough(red, 0.12, 8)
    art = ink([(red, RED, (int(0.9 * S), int(0.5 * S))), (blk, BLACK, (0, 0))], w, h)
    art.resize((sw * 2, sh * 2), Image.LANCZOS).save(os.path.join(A, 'strip-keys.png'))


# ------------------------------------------------------------ paper clip
def clip():
    w, h = 40 * S * 2, 120 * S * 2
    im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    sc = 2 * S
    lw = int(2.6 * sc)

    def loop(x0, y0, x1, y1, col):
        rr = (x1 - x0) / 2
        d.arc([x0, y0, x1, y0 + 2 * rr], 180, 360, fill=col, width=lw)
        d.arc([x0, y1 - 2 * rr, x1, y1], 0, 180, fill=col, width=lw)
    # outer wire, inner wire: a classic gem clip
    col = (120, 124, 130, 255)
    d.line([(6 * sc, 16 * sc), (6 * sc, 100 * sc)], fill=col, width=lw)
    d.line([(34 * sc, 16 * sc), (34 * sc, 108 * sc)], fill=col, width=lw)
    d.arc([6 * sc - lw / 2, 2 * sc, 34 * sc + lw / 2, 30 * sc], 180, 360, fill=col, width=lw)
    d.arc([12 * sc - lw / 2, 92 * sc, 34 * sc + lw / 2, 116 * sc], 0, 180, fill=col, width=lw)
    d.line([(12 * sc, 104 * sc), (12 * sc, 28 * sc)], fill=col, width=lw)
    d.arc([12 * sc - lw / 2, 16 * sc, 28 * sc + lw / 2, 38 * sc], 180, 360, fill=col, width=lw)
    d.line([(28 * sc, 27 * sc), (28 * sc, 88 * sc)], fill=col, width=lw)
    # highlight
    hl = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    hd = ImageDraw.Draw(hl)
    hd.line([(5 * sc, 20 * sc), (5 * sc, 96 * sc)], fill=(235, 238, 242, 200), width=int(0.8 * sc))
    hd.line([(33 * sc, 20 * sc), (33 * sc, 104 * sc)], fill=(235, 238, 242, 200), width=int(0.8 * sc))
    im = Image.alpha_composite(im, hl)
    sh = Image.new('RGBA', (w, h), (0, 0, 0, 0))
    sh.putalpha(im.split()[3].point(lambda v: v * 0.25))
    sh = ImageChops.offset(sh, int(1.5 * sc), int(2 * sc)).filter(ImageFilter.GaussianBlur(2 * S))
    out = Image.alpha_composite(sh, im)
    out.resize((40 * 2, 120 * 2), Image.LANCZOS).save(os.path.join(A, 'clip.png'))


# ------------------------------------------------------------ soft wear
def wear(name, seed):
    rnd = random.Random(seed)
    w, h = W * 2, H * 2
    # big gentle mottling
    n = Image.new('L', (9, 12))
    n.putdata([rnd.randint(0, 255) for _ in range(9 * 12)])
    n = n.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(60))
    mott = n.point(lambda v: int(max(0, v - 120) * 0.10))
    # edge wear: a soft warm darkening right at the trim, a touch heavier at corners
    e = Image.new('L', (w, h), 0)
    ed = ImageDraw.Draw(e)
    for k in range(40):
        a = int(46 * (1 - k / 40) ** 2.2)
        ed.rectangle([k, k, w - 1 - k, h - 1 - k], outline=a)
    e = e.filter(ImageFilter.GaussianBlur(5))
    alpha = ImageChops.lighter(mott, e)
    out = Image.new('RGBA', (w, h), (120, 92, 52, 0))
    out.putalpha(alpha)
    out.save(os.path.join(A, f'wear-{name}.png'))


# ------------------------------------------------------------ the giant cookie, engraved spot art for the back
def cookie():
    w = h = 300 * S
    rnd = random.Random(21)
    cx = cy = w / 2
    R = w * 0.46
    pts = []
    for k in range(180):
        a = 2 * math.pi * k / 180
        rr = R * (1 + 0.018 * math.sin(a * 7) + 0.012 * math.sin(a * 13 + 1))
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    body = plate(w, h)
    ImageDraw.Draw(body).polygon(pts, fill=255)
    tan = plate(w, h)
    tan.paste(body)
    blk = plate(w, h)
    db = ImageDraw.Draw(blk)
    db.line(pts + [pts[0]], fill=255, width=int(1.6 * S))
    # stipple: denser toward the rim and lower right, like an engraved shaded disc
    for _ in range(9000):
        a = rnd.random() * 2 * math.pi
        rr = R * math.sqrt(rnd.random())
        x, y = cx + rr * math.cos(a), cy + rr * math.sin(a)
        p = 0.08 + 0.75 * (rr / R) ** 3 + 0.25 * max(0, ((x - cx) + (y - cy)) / (2 * R))
        if rnd.random() < p:
            r0 = rnd.uniform(0.5, 1.1) * S
            db.ellipse([x - r0, y - r0, x + r0, y + r0], fill=255)
    # chocolate chips, kept off the icing band
    band0, band1 = cy - R * 0.20, cy + R * 0.20
    for _ in range(26):
        for _t in range(40):
            a = rnd.random() * 2 * math.pi
            rr = R * 0.82 * math.sqrt(rnd.random())
            x, y = cx + rr * math.cos(a), cy + rr * math.sin(a)
            if not (band0 - 22 * S < y < band1 + 22 * S):
                break
        s0 = rnd.uniform(8, 13) * S
        poly = [(x + s0 * (0.7 + 0.4 * rnd.random()) * math.cos(t), y + s0 * (0.7 + 0.4 * rnd.random()) * math.sin(t))
                for t in [i * 2 * math.pi / 7 for i in range(7)]]
        db.polygon(poly, fill=255)
        db.line([(x - s0 * 0.35, y - s0 * 0.25), (x + s0 * 0.05, y - s0 * 0.45)], fill=0, width=max(1, int(0.8 * S)))
    # piped icing keyboard across the middle: knock out to paper, then draw keys
    icing = plate(w, h)
    x0, x1 = cx - R * 0.86, cx + R * 0.86
    ImageDraw.Draw(icing).rounded_rectangle([x0, band0, x1, band1], radius=10 * S, fill=255)
    icing = ImageChops.multiply(icing, body)
    tan = ImageChops.subtract(tan, icing)
    blk = ImageChops.subtract(blk, icing)
    db = ImageDraw.Draw(blk)
    db.rounded_rectangle([x0, band0, x1, band1], radius=10 * S, outline=255, width=int(1.4 * S))
    n = 12
    kw = (x1 - x0) / n
    for i in range(1, n):
        db.line([(x0 + i * kw, band0), (x0 + i * kw, band1)], fill=255, width=int(1.1 * S))
    for i in range(1, n):
        if (i - 1) % 7 in (0, 1, 3, 4, 5):
            db.rectangle([x0 + i * kw - kw * 0.28, band0, x0 + i * kw + kw * 0.28, band0 + (band1 - band0) * 0.6], fill=255)
    tan = rough(tan, 0.18, 22)
    blk = rough(blk, 0.06, 23)
    white = icing.point(lambda v: int(v * 0.9))
    art = ink([(tan, (201, 150, 86), (0, 0)), (white, (252, 250, 244), (0, 0)), (blk, BLACK, (0, 0))], w, h)
    # soft plate shadow so it sits on the card
    sh = Image.new('RGBA', (w, h), (27, 42, 74, 0))
    sh.putalpha(body.point(lambda v: int(v * 0.22)))
    sh = ImageChops.offset(sh, int(3 * S), int(4 * S)).filter(ImageFilter.GaussianBlur(4 * S))
    out = Image.alpha_composite(sh, art)
    out.resize((300, 300), Image.LANCZOS).save(os.path.join(A, 'cookie.png'))


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    cover_keys()
    cookie()
    wear('front', 11)
    wear('back', 12)
    print('painted')
