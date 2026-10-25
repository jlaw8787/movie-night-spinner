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

#@@MAP@@

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

#@@MAIN@@
