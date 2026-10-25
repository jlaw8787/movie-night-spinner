"""Paints the soft textures for the messenger delivery ticket (US Letter, 816 x 1056 CSS px, painted at 2x).
wear-*.png: big gentle mottling and edge wear from a ticket that rode in a messenger bag.
stain-chainring.png: a faint greasy chainring print, the kind you get leaning a ticket on a bike."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'assets')
W, H = 1632, 2112

def wear(seed, warm=(96, 92, 84)):
    rng = np.random.default_rng(seed)
    small = Image.fromarray((rng.random((11, 9)) * 255).astype('uint8'), 'L')
    big = np.asarray(small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(90)), dtype=float) / 255
    y, x = np.mgrid[0:H, 0:W]
    dx = np.minimum(x, W - 1 - x) / W; dy = np.minimum(y, H - 1 - y) / H
    edge = np.clip(1 - np.minimum(dx * 14, dy * 18), 0, 1) ** 2
    corner = np.clip(1 - np.hypot(np.minimum(dx, 0.2), np.minimum(dy, 0.2)) * 9, 0, 1) ** 2
    a = np.clip((big - 0.55), 0, 1) * 70 + edge * 60 + corner * 40
    out = np.zeros((H, W, 4), dtype='uint8')
    out[..., 0], out[..., 1], out[..., 2] = warm
    out[..., 3] = np.clip(a, 0, 70).astype('uint8')
    return Image.fromarray(out, 'RGBA')

def chainring():
    S = 700; im = Image.new('RGBA', (S, S)); d = ImageDraw.Draw(im)
    cx = cy = S / 2; R = 300; teeth = 48
    random.seed(4)
    for i in range(teeth):
        ang = 2 * math.pi * i / teeth
        if not (math.radians(150) < ang < math.radians(330)):
            continue  # only part of the ring touched the paper
        fade = math.sin((ang - math.radians(150)) / math.radians(180) * math.pi)
        a = int(46 * fade * random.uniform(0.6, 1.0))
        for r0, w in ((R, 13), (R - 22, 9)):
            px, py = cx + r0 * math.cos(ang), cy + r0 * math.sin(ang)
            d.ellipse((px - w, py - w, px + w, py + w), fill=(48, 46, 44, a))
    d.arc((cx - R + 26, cy - R + 26, cx + R - 26, cy + R - 26), 160, 320, fill=(48, 46, 44, 22), width=26)
    return im.filter(ImageFilter.GaussianBlur(5))

RED = (194, 47, 34)

def catmull(pts, n=12):
    """Smooth a closed list of (x, y) points with a Catmull-Rom spline."""
    out = []; P = pts; L = len(P)
    for i in range(L):
        p0, p1, p2, p3 = P[i - 1], P[i], P[(i + 1) % L], P[(i + 2) % L]
        for t in np.linspace(0, 1, n, endpoint=False):
            t2, t3 = t * t, t * t * t
            out.append(tuple(0.5 * ((2 * p1[k]) + (-p0[k] + p2[k]) * t + (2 * p0[k] - 5 * p1[k] + 4 * p2[k] - p3[k]) * t2
                                    + (-p0[k] + 3 * p1[k] - 3 * p2[k] + p3[k]) * t3) for k in (0, 1)))
    return out

# Zone map, CSS px (250 x 440), painted at 2x through an 8x supersample.
# Grid north is up. y: 18 = 125th St, 72 = 110th, 184 = 59th, 292 = 14th, 362 = Canal, 440 = the Battery.
MAP_W, MAP_H = 250, 440
LINES = [72, 184, 292, 362]
WEST = [(25, 0), (24, 18), (20, 72), (16, 130), (13, 184), (11, 240), (10, 292), (15, 330), (22, 362), (26, 386), (36, 412), (52, 432)]
EAST = [(68, 440), (84, 432), (100, 412), (112, 386), (118, 356), (108, 322), (98, 292), (94, 250), (90, 184), (92, 130), (100, 100), (108, 72), (102, 40), (98, 18), (97, 0)]

def zone_map():
    S = 8; size = (MAP_W * S, MAP_H * S); ink = RED + (255,)
    shore = [(x * S, y * S) for x, y in catmull(WEST + EAST, 24)]
    # land: a light screen of the red ink, fading out above 125th (above 125th is by quote)
    land = Image.new('L', size, 0); ImageDraw.Draw(land).polygon(shore, fill=255)
    ramp = np.clip((np.arange(size[1])[:, None] - 2 * S) / (16 * S), 0.15, 1)
    im = np.zeros((size[1], size[0], 4), dtype=float); im[..., :3] = RED
    im[..., 3] = np.asarray(land, dtype=float) / 255 * 34 * ramp
    im = Image.fromarray(im.astype('uint8'), 'RGBA')
    # Central Park, 59th to 110th, Fifth to Eighth: hatched, clipped to its rectangle
    px0, px1, py0, py1 = 36 * S, 54 * S, 72 * S, 184 * S
    hatch = Image.new('RGBA', size); hd = ImageDraw.Draw(hatch)
    for k in range(-40, 120, 5):
        x0 = px0 + k * S
        hd.line((x0, py1, x0 + (py1 - py0) * 0.45, py0), fill=RED + (160,), width=int(0.8 * S))
    clip = Image.new('L', size, 0); ImageDraw.Draw(clip).rectangle((px0, py0, px1, py1), fill=255)
    im.paste(hatch, (0, 0), Image.composite(hatch.getchannel('A'), Image.new('L', size, 0), clip))
    d = ImageDraw.Draw(im)
    d.rectangle((px0, py0, px1, py1), outline=ink, width=int(1.2 * S))
    # zone lines: dashed, across the island and out under the labels
    for y in LINES:
        x = 2
        while x < MAP_W - 2:
            d.line((x * S, y * S, min(x + 6, MAP_W - 2) * S, y * S), fill=ink, width=int(1.3 * S)); x += 10
    # 125th St: solid rule across the island only
    d.line((20 * S, 18 * S, 102 * S, 18 * S), fill=ink, width=int(1.3 * S))
    # shoreline: solid ink south of 125th, a dotted trail north of it
    pairs = list(zip(shore, shore[1:] + shore[:1]))
    for p, q in pairs:
        if p[1] >= 18 * S and q[1] >= 18 * S and not (p[1] < 1 * S and q[1] < 1 * S):
            d.line((p, q), fill=ink, width=int(2.2 * S))
    for i, (p, q) in enumerate(pairs):
        if p[1] < 17 * S and i % 3 == 0 and abs(p[1] - q[1]) > 0.05 * S:
            d.ellipse((p[0] - 1.1 * S, p[1] - 1.1 * S, p[0] + 1.1 * S, p[1] + 1.1 * S), fill=ink)
    # north arrow, top right
    ax, ay = 238, 1
    d.polygon(((ax * S, ay * S), ((ax - 5) * S, (ay + 13) * S), (ax * S, (ay + 10) * S), ((ax + 5) * S, (ay + 13) * S)), fill=ink)
    return im.resize((MAP_W * 2, MAP_H * 2), Image.LANCZOS)

def carbon():
    """The pink copy faintly showing through the thin white top sheet. Soft and low detail:
    a pink cast heavier toward the bottom right, and pressure ghosts just off where the pen pressed hardest."""
    rng = np.random.default_rng(88)
    small = Image.fromarray((rng.random((9, 7)) * 255).astype('uint8'), 'L')
    big = np.asarray(small.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(120)), dtype=float) / 255
    y, x = np.mgrid[0:H, 0:W]
    lean = np.clip((x / W) * 0.6 + (y / H) * 0.9 - 0.5, 0, 1)
    blob = np.zeros((H, W))
    # 2x px: signature, time in, rider name, the Premium Rush X, each nudged a few px like a slipped sheet
    for cx, cy, rx, ry, k in ((200, 1830, 150, 50, 1.0), (840, 1832, 80, 34, 0.7), (1000, 528, 120, 34, 0.8), (1452, 668, 44, 40, 0.8)):
        blob += k * np.exp(-(((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2))
    a = lean * 30 + np.clip(big - 0.5, 0, 1) * 34 + np.clip(blob, 0, 1) * 26
    out = np.zeros((H, W, 4), dtype='uint8')
    out[..., 0], out[..., 1], out[..., 2] = (236, 112, 146)
    out[..., 3] = np.clip(a, 0, 38).astype('uint8')
    return Image.fromarray(out, 'RGBA').filter(ImageFilter.GaussianBlur(8))

zone_map().save(os.path.join(D, 'zone-map.png'))
carbon().save(os.path.join(D, 'stain-carbon-pink.png'))
wear(7).save(os.path.join(D, 'wear-front.png'))
wear(21).save(os.path.join(D, 'wear-back.png'))
chainring().save(os.path.join(D, 'stain-chainring.png'))
print('painted')
