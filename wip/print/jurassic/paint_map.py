"""Paints the Isla Nublar guest map as a print-resolution illustration.
Coordinates are in CSS px of the 661x592 map window; the image is drawn at 4x."""
import numpy as np, json, os, math, random
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
S = 4
W, H = 661, 592
w, h = W * S, H * S
rng = np.random.default_rng(7)
LAYOUT = json.load(open(os.path.join(D, 'map_layout.json')))

def noise(octaves=5, base=6, seed=1):
    r = np.random.default_rng(seed); out = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        g = r.standard_normal((n + 1, int(n * w / h) + 1))
        im = Image.fromarray(g.astype(np.float32), mode='F').resize((w, h), Image.BICUBIC)
        out += amp * np.asarray(im); tot += amp; amp *= 0.5
    return out / tot

yy, xx = np.mgrid[0:h, 0:w] / S          # css px grid

def bump(cx, cy, rx, ry, a=1.0):
    return a * np.exp(-(((xx - cx) / rx) ** 2 + ((yy - cy) / ry) ** 2))

# ---- height field ----
isl = LAYOUT['island']
r2 = ((xx - isl['cx']) / isl['rx']) ** 2 + ((yy - isl['cy']) / isl['ry']) ** 2
n1 = noise(6, 3, 11)
height = (1 - r2) * 0.55 + n1 * 0.22
ridged = 1 - np.abs(noise(5, 8, 21))*2.2
for m in LAYOUT['mountains']:
    height += bump(m[0], m[1], m[2] * 1.3, m[3] * 1.3, 0.28)
height += noise(5, 10, 3) * 0.05
land = height > 0.0
land = ndimage.binary_opening(land, iterations=6)
lab, n = ndimage.label(land)
sizes = ndimage.sum(land, lab, range(1, n + 1))
land = lab == (1 + int(np.argmax(sizes)))          # keep the main island only
coast_dist = ndimage.distance_transform_edt(~land) / S   # css px from shore (sea side)
inland = ndimage.distance_transform_edt(land) / S         # css px from shore (land side)

# ---- colours ----
img = np.zeros((h, w, 3))
deep, shallow = np.array([38, 96, 118]), np.array([102, 170, 184])
t = np.clip(coast_dist / 60, 0, 1)[..., None]
sea = shallow * (1 - t) + deep * t
img[:] = sea

hn = np.clip(height, 0, None)
low, up, rock, peak = np.array([138, 176, 92]), np.array([92, 132, 62]), np.array([104, 100, 84]), np.array([132, 126, 108])
e = np.clip(hn / 1.1, 0, 1)[..., None]
col = low * (1 - np.clip(e * 2, 0, 1)) + up * np.clip(e * 2, 0, 1)
rk = np.clip((hn - 0.95) / 0.3, 0, 1)[..., None]
col = col * (1 - rk) + rock * rk
pk = np.clip((hn - 1.35) / 0.3, 0, 1)[..., None]
col = col * (1 - pk) + peak * pk
# meadows are lighter and flatter
for m in LAYOUT['meadows']:
    mm = np.clip(bump(m[0], m[1], m[2], m[3]) * 1.6, 0, 1)[..., None]
    col = col * (1 - mm * 0.75) + np.array([168, 196, 112]) * mm * 0.75
# hillshade from the north west
gy, gx = np.gradient(ndimage.gaussian_filter(height, 5))
k = (0.25 + 0.75 * np.clip((hn - 0.5) / 0.6, 0, 1))
mead = np.zeros_like(hn)
for m in LAYOUT['meadows']: mead = np.maximum(mead, np.clip(bump(m[0], m[1], m[2], m[3]) * 1.6, 0, 1))
k = k * (1 - 0.8 * mead)
shade = np.clip(1 + (-gx - gy) * S * 110 * k, 0.5, 1.4)[..., None]
col = np.clip(col * shade, 0, 255)
sand = np.array([228, 212, 160])
beach = np.clip(1 - inland / 5, 0, 1)[..., None]
col = col * (1 - beach) + sand * beach
img = np.where(land[..., None], col, img)
# a fine paper grain
img += (rng.standard_normal((h, w)) * 3)[..., None]
im = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
dr = ImageDraw.Draw(im, 'RGBA')

def P(p): return (p[0] * S, p[1] * S)

def smooth(pts, k=8):
    out = []
    for i in range(len(pts) - 1):
        p0 = pts[max(i - 1, 0)]; p1 = pts[i]; p2 = pts[i + 1]; p3 = pts[min(i + 2, len(pts) - 1)]
        for j in range(k):
            t = j / k; t2 = t * t; t3 = t2 * t
            out.append(tuple(0.5 * ((2 * p1[a]) + (-p0[a] + p2[a]) * t + (2 * p0[a] - 5 * p1[a] + 4 * p2[a] - p3[a]) * t2 + (-p0[a] + 3 * p1[a] - 3 * p2[a] + p3[a]) * t3) for a in (0, 1)))
    out.append(pts[-1]); return out

def stroke(pts, width, fill, k=8):
    sp = [P(p) for p in smooth(pts, k)]
    dr.line(sp, fill=fill, width=int(width * S), joint='curve')
    r = width * S / 2
    for p in (sp[0], sp[-1]): dr.ellipse([p[0] - r, p[1] - r, p[0] + r, p[1] + r], fill=fill)

# ---- coastal surf lines ----
for d0 in (6, 13):
    ring = (coast_dist > d0) & (coast_dist < d0 + 0.6)
    ys, xs = np.nonzero(ring[::3, ::3])
    for y, x in zip(ys[::9], xs[::9]):
        dr.ellipse([x * 3 - 3, y * 3 - 3, x * 3 + 3, y * 3 + 3], fill=(255, 255, 255, 70))

# ---- rivers ----
for rv in LAYOUT['rivers']:
    stroke(rv['pts'], rv['w'] + 3, (52, 116, 138, 255))
    stroke(rv['pts'], rv['w'], (88, 160, 184, 255))
    stroke(rv['pts'], max(1.5, rv['w'] * 0.3), (150, 205, 220, 200))
# waterfall
wf = LAYOUT['waterfall']
for i in range(7):
    x = wf[0] + i * 2.2 - 6
    dr.line([P((x, wf[1])), P((x + 1, wf[1] + 22))], fill=(245, 250, 255, 230), width=int(1.6 * S))
dr.ellipse([P((wf[0] - 14, wf[1] + 18)), P((wf[0] + 14, wf[1] + 30))], fill=(235, 245, 250, 200))

# ---- roads (drawn before trees so canopy can overhang slightly) ----
road_mask = Image.new('L', (w, h), 0); rm = ImageDraw.Draw(road_mask)
for rd in LAYOUT['roads']:
    stroke(rd, 9, (120, 98, 60, 255)); stroke(rd, 7, (222, 202, 150, 255))
    sp = [P(p) for p in smooth(rd)]; rm.line(sp, fill=255, width=int(26 * S))

# ---- clearings: buildings, paddock meadows ----
clear = np.asarray(road_mask) > 0
for c in LAYOUT['clearings']:
    clear |= bump(c[0], c[1], c[2], c[3]) > 0.5
for m in LAYOUT['meadows']:
    clear |= bump(m[0], m[1], m[2], m[3]) > 0.35
river_mask = Image.new('L', (w, h), 0); rv_d = ImageDraw.Draw(river_mask)
for rv in LAYOUT['rivers']:
    rv_d.line([P(p) for p in smooth(rv['pts'])], fill=255, width=int((rv['w'] + 10) * S))
clear |= np.asarray(river_mask) > 0

# ---- jungle canopy ----
r = random.Random(4)
greens = [(52, 96, 40), (62, 110, 46), (44, 84, 34), (72, 120, 52), (58, 104, 44)]
trees = []
for _ in range(26000):
    x = r.uniform(0, W); y = r.uniform(0, H); xi, yi = int(x * S), int(y * S)
    if xi >= w or yi >= h or not land[yi, xi] or clear[yi, xi] or inland[yi, xi] < 6: continue
    hh = height[yi, xi]
    if hh > 1.05 + r.uniform(-0.12, 0.12): continue
    dens = 0.85 if hh > 0.25 else 0.55
    if r.random() > dens: continue
    trees.append((y, x, r.uniform(3.2, 6.2), r.choice(greens)))
trees.sort()
def draw_tree(y, x, rad, g):
    dr.ellipse([P((x - rad + 1.6, y - rad + 2.2)), P((x + rad + 1.6, y + rad + 2.2))], fill=(20, 40, 18, 90))
    dr.ellipse([P((x - rad, y - rad)), P((x + rad, y + rad))], fill=g + (255,))
    hr = rad * 0.45
    dr.ellipse([P((x - rad * 0.55 - hr * 0.2, y - rad * 0.6)), P((x - rad * 0.55 + hr, y - rad * 0.6 + hr * 1.2))], fill=(min(g[0] + 40, 255), min(g[1] + 46, 255), min(g[2] + 30, 255), 150))
PEAKS = LAYOUT['peaks']
peak_x = [(pk[0] - pk[2] / 2, pk[0] + pk[2] / 2, pk[1]) for pk in PEAKS]
front = []
for t_ in trees:
    draw_tree(*t_)
    if any(a - 4 < t_[1] < b + 4 and base - 6 < t_[0] < base + 9 for a, b, base in peak_x): front.append(t_)
for cx, base, pw, ph in sorted(PEAKS, key=lambda q: q[1]):
    ap = (cx + pw * 0.06, base - ph); bl = (cx - pw / 2, base); br = (cx + pw / 2, base); mid = (cx + pw * 0.12, base)
    dr.polygon([P((bl[0] + 3, bl[1] + 3)), P((ap[0] + 3, ap[1] + 3)), P((br[0] + 3, br[1] + 3))], fill=(20, 30, 18, 90))
    dr.polygon([P(ap), P(bl), P(mid)], fill=(160, 150, 124, 255))
    dr.polygon([P(ap), P(mid), P(br)], fill=(98, 92, 76, 255))
    for i in range(1, 4):
        t = i / 4
        dr.line([P((ap[0] + (bl[0] - ap[0]) * t * 0.9, ap[1] + (bl[1] - ap[1]) * t * 0.9)), P((ap[0] + (mid[0] - ap[0]) * t, ap[1] + (mid[1] - ap[1]) * t + 4))], fill=(128, 118, 96, 200), width=int(1 * S))
    dr.polygon([P(ap), P((ap[0] - pw * 0.12, ap[1] + ph * 0.22)), P((ap[0] + pw * 0.02, ap[1] + ph * 0.18)), P((ap[0] + pw * 0.12, ap[1] + ph * 0.24))], fill=(196, 190, 170, 255))
    dr.line([P(bl), P(ap), P(br)], fill=(52, 48, 38, 255), width=int(1.4 * S))
for t_ in front: draw_tree(*t_)
# palms along the beach
for _ in range(900):
    x = r.uniform(0, W); y = r.uniform(0, H); xi, yi = int(x * S), int(y * S)
    if xi >= w or yi >= h or not land[yi, xi] or not (5 < inland[yi, xi] < 11) or clear[yi, xi] or r.random() > 0.5: continue
    for a in range(5):
        ang = a * 72 + r.uniform(-12, 12); L = r.uniform(4, 6)
        dr.line([P((x, y)), P((x + L * math.cos(math.radians(ang)), y + L * math.sin(math.radians(ang))))], fill=(60, 112, 44, 255), width=int(1.6 * S))

# ---- paddock fences ----
for fz in LAYOUT['fences']:
    pts = fz + [fz[0]]
    for a, b in zip(pts, pts[1:]):
        L = math.hypot(b[0] - a[0], b[1] - a[1]); n = max(1, int(L / 9))
        for i in range(n):
            t0, t1 = i / n, (i + 0.62) / n
            p0 = (a[0] + (b[0] - a[0]) * t0, a[1] + (b[1] - a[1]) * t0); p1 = (a[0] + (b[0] - a[0]) * t1, a[1] + (b[1] - a[1]) * t1)
            dr.line([P(p0), P(p1)], fill=(35, 30, 18, 255), width=int(4.4 * S))
            dr.line([P(p0), P(p1)], fill=(246, 184, 28, 255), width=int(2.6 * S))
        for i in range(n + 1):
            p = (a[0] + (b[0] - a[0]) * i / n, a[1] + (b[1] - a[1]) * i / n)
            dr.rectangle([P((p[0] - 1.6, p[1] - 1.6)), P((p[0] + 1.6, p[1] + 1.6))], fill=(40, 36, 30, 255))

# ---- buildings ----
def roof(x, y, bw, bh, c=(186, 140, 78), ridge=(140, 98, 50)):
    dr.rectangle([P((x - bw / 2 + 2, y - bh / 2 + 3)), P((x + bw / 2 + 2, y + bh / 2 + 3))], fill=(20, 30, 18, 110))
    dr.rectangle([P((x - bw / 2, y - bh / 2)), P((x + bw / 2, y + bh / 2))], fill=c + (255,), outline=(40, 34, 26, 255), width=int(1.4 * S))
    for i in range(1, 6):
        yy_ = y - bh / 2 + bh * i / 6
        dr.line([P((x - bw / 2 + 1, yy_)), P((x + bw / 2 - 1, yy_))], fill=ridge + (150,), width=int(0.8 * S))

vc = LAYOUT['visitor_centre']
roof(vc[0] - 26, vc[1] + 4, 36, 26)                       # kitchen wing
roof(vc[0] + 2, vc[1], 40, 34)                            # dining hall
cx, cy = vc[0] + 34, vc[1] - 2                            # rotunda
dr.ellipse([P((cx - 15, cy - 13)), P((cx + 17, cy + 19))], fill=(20, 30, 18, 110))
dr.ellipse([P((cx - 16, cy - 16)), P((cx + 16, cy + 16))], fill=(196, 150, 86, 255), outline=(40, 34, 26, 255), width=int(1.4 * S))
for a in range(0, 360, 30):
    dr.line([P((cx, cy)), P((cx + 15 * math.cos(math.radians(a)), cy + 15 * math.sin(math.radians(a))))], fill=(140, 98, 50, 170), width=int(0.8 * S))
dr.ellipse([P((cx - 4, cy - 4)), P((cx + 4, cy + 4))], fill=(230, 214, 170, 255))
hx = LAYOUT['hatchery']; roof(hx[0], hx[1], 30, 20, (196, 198, 190), (150, 152, 146))
ms = LAYOUT['shed']; roof(ms[0], ms[1], 22, 16, (150, 150, 140), (110, 110, 104))
hp = LAYOUT['helipad']
dr.ellipse([P((hp[0] - 15, hp[1] - 15)), P((hp[0] + 15, hp[1] + 15))], fill=(70, 74, 72, 255), outline=(240, 240, 232, 255), width=int(1.6 * S))
for seg in (((hp[0] - 6, hp[1] - 8), (hp[0] - 6, hp[1] + 8)), ((hp[0] + 6, hp[1] - 8), (hp[0] + 6, hp[1] + 8)), ((hp[0] - 6, hp[1]), (hp[0] + 6, hp[1]))):
    dr.line([P(seg[0]), P(seg[1])], fill=(245, 245, 238, 255), width=int(2.4 * S))
dk = LAYOUT['dock']
dr.rectangle([P((dk[0], dk[1] - 4)), P((dk[0] + 34, dk[1] + 4))], fill=(140, 104, 60, 255), outline=(60, 44, 26, 255), width=int(1.2 * S))
for i in range(1, 8):
    dr.line([P((dk[0] + i * 4.2, dk[1] - 4)), P((dk[0] + i * 4.2, dk[1] + 4))], fill=(90, 66, 38, 255), width=int(0.8 * S))
# main gate: two torch pillars across the road
gt = LAYOUT['gate']
for dx in (-9, 9):
    dr.rectangle([P((gt[0] + dx - 3, gt[1] - 3)), P((gt[0] + dx + 3, gt[1] + 3))], fill=(70, 58, 46, 255), outline=(30, 24, 18, 255), width=int(1 * S))
    dr.ellipse([P((gt[0] + dx - 2, gt[1] - 7)), P((gt[0] + dx + 2, gt[1] - 3))], fill=(255, 150, 30, 255))
dr.line([P((gt[0] - 9, gt[1] - 1)), P((gt[0] + 9, gt[1] - 1))], fill=(70, 58, 46, 255), width=int(2.2 * S))

im = im.filter(ImageFilter.UnsharpMask(radius=2, percent=40, threshold=2))
im.save(os.path.join(D, 'assets', 'isla-nublar-map.jpg'), quality=90)
print('map', im.size)
