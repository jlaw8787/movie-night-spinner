"""Line-cut art for the Autumn Moon take-out menu (Ghost Dog, 1999), printed the way a 1999
quick-print shop would: two spot inks (red and black), engraved line tone instead of flat fills,
rough ink edges, uneven density and the black plate a hair out of register with the red.
Writes assets/art-moon.png (cover moon with pigeons), assets/art-bowl.png (rice bowl clip art),
assets/art-frame.png (red key-fret panel frame)."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
RED = (181, 40, 31)
BLK = (31, 30, 27)


def noise(w, h, scale, seed):
    rng = np.random.default_rng(seed)
    n = rng.random((max(2, h // scale), max(2, w // scale)))
    im = Image.fromarray((n * 255).astype('uint8')).resize((w, h), Image.BICUBIC)
    return np.asarray(im.filter(ImageFilter.GaussianBlur(max(1, scale * 0.4))), dtype=np.float32) / 255


def ink(mask, seed, lo=0.80):
    """mask: L image (255 = ink). Roughen the edge, mottle the density."""
    w, h = mask.size
    m = np.asarray(mask.filter(ImageFilter.GaussianBlur(2.2)), dtype=np.float32) / 255
    m = m + (noise(w, h, 3, seed) - 0.5) * 0.55
    hard = (m > 0.5).astype(np.float32)
    dens = lo + (1 - lo) * noise(w, h, 40, seed + 1)
    speck = (noise(w, h, 2, seed + 2) > 0.16).astype(np.float32)  # tiny voids where ink skipped
    a = hard * dens * (0.88 + 0.12 * speck)
    a = Image.fromarray((a * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.7))
    return a


def plate(alpha, col):
    im = Image.new('RGBA', alpha.size, col + (0,)); im.putalpha(alpha); return im


def bez(p0, p1, p2, p3, n=24):
    out = []
    for i in range(n + 1):
        t = i / n; u = 1 - t
        out.append((u**3*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t**3*p3[0],
                    u**3*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t**3*p3[1]))
    return out


def bird(dr, cx, cy, s, ang, fill=255, hatch=0):
    """A pigeon gliding, wings raised, fan tail. Draws solid, then white feather cuts."""
    ca, sa = math.cos(ang), math.sin(ang)
    def P(pts):
        return [(cx + (x * ca - y * sa) * s, cy + (x * sa + y * ca) * s) for x, y in pts]
    body = bez((-1.3, 0.0), (-1.0, -0.42), (0.9, -0.42), (1.35, -0.12)) + bez((1.35, -0.12), (1.5, -0.05), (1.5, 0.12), (1.3, 0.2)) \
        + bez((1.3, 0.2), (0.8, 0.42), (-1.0, 0.38), (-1.3, 0.0))
    dr.polygon(P(body), fill=fill)
    dr.polygon(P(bez((1.15, -0.25), (1.35, -0.48), (1.75, -0.4), (1.78, -0.12)) + [(2.08, -0.05), (1.75, 0.04)]
                 + bez((1.75, 0.04), (1.6, 0.18), (1.3, 0.16), (1.15, 0.05))), fill=fill)
    tail = bez((-1.1, -0.18), (-1.6, -0.35), (-2.0, -0.55), (-2.3, -0.55)) + bez((-2.3, -0.55), (-2.45, -0.2), (-2.45, 0.2), (-2.3, 0.55)) \
        + bez((-2.3, 0.55), (-2.0, 0.55), (-1.6, 0.35), (-1.1, 0.18))
    dr.polygon(P(tail), fill=fill)
    lead = bez((0.55, -0.2), (0.75, -0.9), (0.4, -1.8), (-0.35, -2.55))
    trail = []
    tips = [(-0.62, -2.35), (-0.78, -2.05), (-0.86, -1.7), (-0.88, -1.35), (-0.84, -1.0), (-0.75, -0.65)]
    prev = (-0.35, -2.55)
    for tx, ty in tips:
        trail += bez(prev, (prev[0] - 0.05, prev[1] + 0.05), (tx + 0.12, ty - 0.12), (tx, ty), 6)
        trail.append((tx + 0.16, ty - 0.02)); prev = (tx + 0.16, ty - 0.02)
    trail += [(-0.55, -0.25)]
    dr.polygon(P(lead + trail), fill=fill)
    far = bez((0.35, 0.15), (0.45, 0.6), (0.2, 1.05), (-0.25, 1.35)) + bez((-0.25, 1.35), (-0.55, 1.2), (-0.65, 0.8), (-0.5, 0.2))
    dr.polygon(P(far), fill=fill)
    if hatch:
        lw = max(2, int(s * 0.05))
        # feather cuts on the raised wing, running from the trailing edge toward the leading edge
        for (x0, y0, x1, y1) in [(-0.62, -2.2, -0.15, -2.15), (-0.74, -1.9, 0.1, -1.75), (-0.8, -1.55, 0.3, -1.3),
                                 (-0.8, -1.2, 0.42, -0.9), (-0.72, -0.85, 0.45, -0.55)]:
            dr.line(P([(x0, y0), (x1, y1)]), fill=0, width=lw)
        # tail cuts
        for yy in (-0.3, 0.0, 0.3):
            dr.line(P([(-1.55, yy * 0.4), (-2.25, yy)]), fill=0, width=lw)
        # neck ring and eye
        dr.line(P(bez((0.95, -0.36), (1.05, -0.1), (1.05, 0.1), (0.95, 0.3), 10)), fill=0, width=lw)
        ex, ey = P([(1.55, -0.2)])[0]
        r = s * 0.07
        dr.ellipse((ex - r, ey - r, ex + r, ey + r), fill=0)


# ---------------- moon with pigeons, engraved line tone ----------------
def moon():
    L = 1200
    cx = cy = L / 2
    R = 520
    yy, xx = np.mgrid[0:L, 0:L].astype(np.float32)
    dx, dy = (xx - cx) / R, (yy - cy) / R
    rr = np.sqrt(dx * dx + dy * dy)
    inside = rr < 1
    # tone: darker toward the lower left limb, soft maria (dark seas) and bright cloud bands
    z = np.sqrt(np.clip(1 - rr * rr, 0, 1))
    light = np.clip(0.55 * z + 0.45 * (0.6 * (dx * 0.5 - dy * 0.6) + 0.4), 0, 1)
    tone = 0.16 + 0.80 * (1 - light)
    for (mx, my, mr, k) in [(-0.25, -0.2, 0.32, 0.28), (0.22, -0.35, 0.22, 0.22), (0.05, 0.25, 0.28, 0.2), (0.45, 0.15, 0.16, 0.18)]:
        tone += k * np.exp(-((dx - mx) ** 2 + (dy - my) ** 2) / (mr * mr))
    tone += (noise(L, L, 60, 7) - 0.5) * 0.18
    # cloud bands across the lower third, knocked almost clear
    for (by, bw, x0, x1) in [(0.52, 0.045, -0.9, 0.35), (0.64, 0.035, -0.4, 0.95), (0.75, 0.03, -0.75, 0.25)]:
        ramp = np.clip(np.minimum(dx - x0, x1 - dx) / 0.18, 0, 1)
        band = np.exp(-((dy - by) / (bw * (0.4 + 0.6 * ramp + 1e-3))) ** 2) * ramp
        tone = tone * (1 - 0.92 * band)
    tone = np.clip(tone, 0.06, 0.92)
    # engraving lines bowed with the sphere
    sp = 15.0
    yl = yy + 26 * (dx ** 2)
    ph = np.abs(((yl / sp) % 1.0) - 0.5) * 2
    lines = (ph < tone) & inside
    redm = Image.fromarray((lines * 255).astype('uint8'))
    d = ImageDraw.Draw(redm)
    d.ellipse((cx - R - 46, cy - R - 46, cx + R + 46, cy + R + 46), outline=255, width=16)
    d.ellipse((cx - R - 2, cy - R - 2, cx + R + 2, cy + R + 2), outline=255, width=7)
    # birds: knock them out of the red plate at true register, print them in black slightly off
    birds = [(500, 560, 128, -0.20), (880, 340, 76, -0.32), (300, 290, 56, -0.12)]
    for b in birds:
        bird(d, *b, fill=0)
    blk = Image.new('L', (L, L), 0); db = ImageDraw.Draw(blk)
    off = (5, 3)
    for (bx, by, s, a) in birds:
        bird(db, bx + off[0], by + off[1], s, a, fill=255, hatch=1)
    out = Image.alpha_composite(plate(ink(redm, 11, 0.78), RED), plate(ink(blk, 12, 0.86), BLK))
    out.resize((600, 600), Image.LANCZOS).save(os.path.join(A, 'art-moon.png'))


# ---------------- rice bowl clip art ----------------
def bowl():
    W, H = 1000, 760
    blk = Image.new('L', (W, H), 0); d = ImageDraw.Draw(blk)
    red = Image.new('L', (W, H), 0); dr = ImageDraw.Draw(red)
    cx, rimy, rw, rh = 470, 360, 330, 64
    # bowl body outline (black): rim ellipse plus the curved belly down to the foot
    belly = bez((cx - rw, rimy), (cx - rw + 10, rimy + 250), (cx - 120, rimy + 300), (cx - 90, rimy + 300), 40) + \
        [(cx + 90, rimy + 300)] + bez((cx + 90, rimy + 300), (cx + 120, rimy + 300), (cx + rw - 10, rimy + 250), (cx + rw, rimy), 40)
    d.line(belly, fill=255, width=11, joint='curve')
    d.rectangle((cx - 100, rimy + 296, cx + 100, rimy + 330), outline=255, width=10)
    # rim: the far edge shows above the rice, the near edge in front
    d.arc((cx - rw, rimy - rh, cx + rw, rimy + rh), 0, 180, fill=255, width=10)
    d.arc((cx - rw, rimy - rh, cx + rw, rimy + rh), 180, 205, fill=255, width=8)
    d.arc((cx - rw, rimy - rh, cx + rw, rimy + rh), 335, 360, fill=255, width=8)
    # contour hatching that follows the right of the belly
    for k in range(1, 7):
        o = k * 17
        pts = bez((cx + rw - o, rimy + rh - 4 + k * 2), (cx + rw - 10 - o, rimy + 250 - k * 8), (cx + 120 - o * 0.4, rimy + 300 - k * 6), (cx + 90 - o * 0.2, rimy + 300 - k * 5), 30)
        n = len(pts)
        d.line(pts[int(n * 0.05):int(n * (0.95 - k * 0.07))], fill=255, width=5)
    # red key band around the belly
    for k in range(-5, 6):
        x = cx + k * 52
        yb = rimy + 120 + 18 * (k / 5) ** 2
        dr.rectangle((x - 18, yb - 18, x + 18, yb + 18), outline=255, width=7)
        dr.rectangle((x - 6, yb - 6, x + 6, yb + 6), fill=255)
    dr.line(bez((cx - rw + 22, rimy + 88), (cx - 100, rimy + 116), (cx + 100, rimy + 116), (cx + rw - 22, rimy + 88), 40), fill=255, width=6)
    dr.line(bez((cx - rw + 38, rimy + 156), (cx - 100, rimy + 184), (cx + 100, rimy + 184), (cx + rw - 38, rimy + 156), 40), fill=255, width=6)
    # rice mound and grains
    mound = bez((cx - rw + 20, rimy), (cx - 240, rimy - 150), (cx + 240, rimy - 150), (cx + rw - 20, rimy), 40)
    d.line(mound, fill=255, width=8)
    rng = random.Random(4)
    for _ in range(70):
        gx = rng.uniform(cx - 260, cx + 260); gy = rng.uniform(rimy - 100, rimy + 20)
        if (gx - cx) ** 2 / 280 ** 2 + (gy - rimy + 10) ** 2 / 110 ** 2 < 1 and gy < rimy + 40 - abs(gx - cx) * 0.1:
            a = rng.uniform(0, math.pi)
            d.line([(gx - 9 * math.cos(a), gy - 9 * math.sin(a)), (gx + 9 * math.cos(a), gy + 9 * math.sin(a))], fill=255, width=5)
    # sliced glazed chicken fanned on the rice: red glaze, black edge, two cut lines each
    for i in range(4):
        px, py = cx - 120 + i * 62, rimy - 60 - 18 * math.sin((i + 0.5) / 4 * math.pi)
        box = (px - 44, py - 30, px + 44, py + 30)
        dr.ellipse(box, fill=255)
        d.arc(box, 200, 340, fill=255, width=7)
        d.arc(box, 20, 160, fill=255, width=4)
        for j in (-12, 12):
            d.line([(px + j - 6, py - 18), (px + j + 6, py + 18)], fill=255, width=4)
    # chopsticks laid across the rim
    for (x0, y0, x1, y1) in [(cx - 40, rimy - 210, cx + 470, rimy + 90), (cx + 10, rimy - 236, cx + 494, rimy + 52)]:
        ang = math.atan2(y1 - y0, x1 - x0); nx, ny = -math.sin(ang), math.cos(ang)
        d.polygon([(x0 + nx * 5, y0 + ny * 5), (x1 + nx * 11, y1 + ny * 11), (x1 - nx * 11, y1 - ny * 11), (x0 - nx * 5, y0 - ny * 5)], fill=255)
    # steam
    for k, sx in enumerate((cx - 150, cx - 40, cx + 70)):
        pts = [(sx + 22 * math.sin(t / 9.0 + k), rimy - 150 - t * 3.0) for t in range(0, 52)]
        d.line(pts, fill=255, width=7, joint='curve')
    off = (4, -3)
    blk2 = Image.new('L', (W, H), 0); blk2.paste(blk, off)
    out = Image.alpha_composite(plate(ink(red, 21, 0.75), RED), plate(ink(blk2, 22, 0.85), BLK))
    out.resize((W // 2, H // 2), Image.LANCZOS).save(os.path.join(A, 'art-bowl.png'))


# ---------------- red frame with key-fret corners ----------------
def frame():
    FWp, FHp = 404 * 2, 764 * 2
    m = Image.new('L', (FWp, FHp), 0); d = ImageDraw.Draw(m)
    d.rectangle((0, 0, FWp - 1, FHp - 1), outline=255, width=7)
    d.rectangle((14, 14, FWp - 15, FHp - 15), outline=255, width=3)
    c = 58
    for (ox, oy, sx, sy) in [(0, 0, 1, 1), (FWp, 0, -1, 1), (0, FHp, 1, -1), (FWp, FHp, -1, -1)]:
        # solid corner block with a key-fret spiral cut into it
        x0, y0 = ox, oy
        def Q(x, y): return (x0 + sx * x, y0 + sy * y)
        xs = sorted([Q(0, 0)[0], Q(c, c)[0]]); ys = sorted([Q(0, 0)[1], Q(c, c)[1]])
        d.rectangle((xs[0], ys[0], xs[1], ys[1]), fill=255)
        path = [Q(10, 48), Q(10, 10), Q(48, 10), Q(48, 40), Q(22, 40), Q(22, 22), Q(36, 22), Q(36, 30)]
        d.line(path, fill=0, width=5, joint='curve')
    ink(m, 31, 0.8).save(os.path.join(A, 'art-frame-mask.png'))
    plate(ink(m, 31, 0.8), RED).resize((404, 764), Image.LANCZOS).save(os.path.join(A, 'art-frame.png'))
    os.remove(os.path.join(A, 'art-frame-mask.png'))


moon(); bowl(); frame()
print('art done')
