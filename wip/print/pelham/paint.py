"""Paints the assets for the Command Center lunch run sheet (The Taking of Pelham One Two Three, 1974).
A ditto (spirit duplicator) copy on legal paper, 8.5 x 14 in, purple ink, pinned to a board.
- assets/doodle-hero.png : the hero sandwich someone drew on the ditto master with a stylus
- assets/ditto-wear.png  : soft uneven ink transfer, edge wear, two tack holes, a coffee ring
Low detail on purpose: big gentle shapes, no pixel noise."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
W, H = 1632, 2688          # 2x of 816 x 1344
INK = (93, 71, 168)


def field(seed, scale, blur, w=W, h=H):
    rng = np.random.default_rng(seed)
    small = rng.random((h // scale + 2, w // scale + 2)).astype(np.float32)
    im = Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    im = im.filter(ImageFilter.GaussianBlur(blur))
    a = np.asarray(im).astype(np.float32) / 255
    return (a - a.min()) / (a.max() - a.min() + 1e-6)


def wob(points, rng, amp=2.2):
    out = []
    for i in range(len(points) - 1):
        (x0, y0), (x1, y1) = points[i], points[i + 1]
        n = max(2, int(math.hypot(x1 - x0, y1 - y0) / 14))
        for k in range(n):
            t = k / n
            out.append((x0 + (x1 - x0) * t + rng.normal(0, amp * .35), y0 + (y1 - y0) * t + rng.normal(0, amp * .35)))
    out.append(points[-1])
    return out


def arc(cx, cy, rx, ry, a0, a1, n=40):
    return [(cx + rx * math.cos(math.radians(a0 + (a1 - a0) * i / n)),
             cy + ry * math.sin(math.radians(a0 + (a1 - a0) * i / n))) for i in range(n + 1)]


def hero():
    w, h = 720, 300
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    rng = np.random.default_rng(7)
    lw = 6
    def line(pts):
        q = wob(pts, rng, 3.4)
        for i in range(len(q) - 1):
            wv = max(3, int(lw + rng.normal(0, 1.4)))
            d.line([q[i], q[i + 1]], fill=255, width=wv)
            d.ellipse((q[i][0] - wv / 2, q[i][1] - wv / 2, q[i][0] + wv / 2, q[i][1] + wv / 2), fill=255)
    # top of the roll: a long dome
    line(arc(360, 128, 320, 92, 180, 360, 60))
    line([(40, 128), (680, 128)])
    # seeds on the crust
    for x, y in ((170, 70), (250, 52), (330, 44), (410, 46), (490, 56), (570, 76), (210, 96), (450, 90)):
        d.ellipse((x - 5, y - 3, x + 5, y + 3), fill=255)
    # lettuce: a frilly zigzag hanging under the roll
    pts = []
    for i in range(33):
        x = 34 + i * 20
        pts.append((x, 140 + (14 if i % 2 else 0)))
    line(pts)
    # tomato slices peeking out
    for x in (120, 300, 480, 620):
        line(arc(x, 160, 34, 14, 0, 180, 18))
    # meat and cheese layers
    line([(44, 182), (676, 182)])
    line([(56, 200), (664, 200)])
    # bottom of the roll
    line(arc(360, 206, 316, 40, 0, 180, 50))
    line([(44, 206), (676, 206)])
    # toothpick with a little flag
    line([(360, 20), (360, 110)])
    line([(360, 20), (404, 30), (360, 42)])
    halo = np.asarray(m.filter(ImageFilter.GaussianBlur(5))).astype(np.float32) / 255
    a = np.asarray(m.filter(ImageFilter.GaussianBlur(1.3))).astype(np.float32) / 255
    a = np.clip(np.clip(a * 1.2, 0, 1) * (0.6 + 0.4 * field(3, 30, 8, w, h)) + halo * .18, 0, 1)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., 0], out[..., 1], out[..., 2] = INK
    out[..., 3] = (a * 255).astype(np.uint8)
    Image.fromarray(out, 'RGBA').save(os.path.join(A, 'doodle-hero.png'))


def wear():
    out = np.zeros((H, W, 4), np.float32)
    yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
    # uneven ditto transfer: big soft pale patches, a little stronger toward the lower right
    pale = field(11, 260, 120)
    lean = np.clip((xx / W) * .5 + (yy / H) * .5, 0, 1)
    a_pale = np.clip(pale - .45, 0, 1) * .55 + lean * .10
    # a crease in the master prints as a pale streak running across the sheet
    cy0 = 1180 + (xx - W / 2) * .06
    crease = np.exp(-((yy - cy0) / 9) ** 2) * .42 * (0.5 + 0.5 * field(21, 90, 20))
    a_pale = np.clip(a_pale + crease, 0, .8)
    # purple thumb smudge where the operator pulled the sheet off the drum
    sx, sy = 1560, 1500
    sm = np.exp(-(((xx - sx) / 34) ** 2 + ((yy - sy) / 52) ** 2)) * .16 * (0.6 + 0.4 * field(23, 20, 6))
    # edge wear: darker, slightly yellowed border fading in
    e = np.minimum(np.minimum(xx, W - xx), np.minimum(yy, H - yy))
    a_edge = np.clip(1 - e / 70, 0, 1) ** 2 * .22 * (0.6 + 0.4 * field(5, 120, 30))
    # coffee ring, lower right
    cx, cy, r = 1360, 2330, 118
    dist = np.hypot(xx - cx, yy - cy)
    ring = np.exp(-((dist - r) / 7) ** 2) * .20 + np.exp(-((dist - r + 10) / 22) ** 2) * .05
    ring *= (0.55 + 0.45 * field(9, 60, 14))
    inside = np.clip(1 - dist / r, 0, 1) ** .3 * .035
    stain = ring + inside
    # compose: pale (white), edge (warm grey), stain (coffee)
    def over(rgb, a):
        nonlocal out
        a = np.clip(a, 0, 1)
        out[..., :3] = out[..., :3] * (1 - a[..., None]) * (out[..., 3:4] > 0) + np.array(rgb, np.float32) * a[..., None] + \
            out[..., :3] * (out[..., 3:4] == 0) * 0
        out[..., 3] = out[..., 3] + a * (1 - out[..., 3])
    # simpler premultiplied-style stack
    rgb = np.zeros((H, W, 3), np.float32); al = np.zeros((H, W), np.float32)
    for col, a in (((247, 245, 240), a_pale), ((150, 136, 108), a_edge), ((122, 82, 42), stain), ((96, 70, 170), sm)):
        a = np.clip(a, 0, 1)
        rgb = rgb * (1 - a[..., None]) + np.array(col, np.float32) * a[..., None]
        al = al + a * (1 - al)
    rgb = np.where(al[..., None] > 1e-4, rgb / np.maximum(al[..., None], 1e-4) * np.minimum(1, al[..., None] / np.maximum(al[..., None], 1e-4)), 0)
    img = np.dstack([np.clip(rgb, 0, 255), np.clip(al * 255, 0, 255)]).astype(np.uint8)
    im = Image.fromarray(img, 'RGBA')
    # two tack holes at the top
    d = ImageDraw.Draw(im)
    for x in (150, W - 150):
        d.ellipse((x - 9, 52, x + 9, 70), fill=(70, 66, 60, 150))
        d.ellipse((x - 5, 56, x + 5, 66), fill=(40, 38, 35, 200))
    im.save(os.path.join(A, 'ditto-wear.png'))


hero(); wear(); print('painted')
