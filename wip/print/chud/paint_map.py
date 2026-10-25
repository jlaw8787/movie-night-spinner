"""Paints the signature piece for the Spring & Crosby placemat (C.H.U.D., 1984):
a night map of the SoHo blocks from Houston to Grand, Greene to Lafayette, with the sewer mains,
manholes and the old closed tunnels showing through underneath. No text in the art; labels are HTML.
Coordinates are CSS px of the 572x896 map window, painted at 3x. Writes assets/soho-map.png."""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter
from scipy import ndimage

D = os.path.dirname(os.path.abspath(__file__))
S = 3
W, H = 572, 896
w, h = W * S, H * S
rng = np.random.default_rng(1984)

# street centre lines (css px) and half widths
VS = {'greene': (34, 11), 'mercer': (148, 11), 'broadway': (268, 17), 'crosby': (392, 11), 'lafayette': (510, 14)}
HS = {'houston': (150, 17), 'prince': (322, 11), 'spring': (490, 11), 'broome': (656, 11), 'grand': (822, 11)}
SHOP = ('crosby', 'spring')

def noise(octaves, base, seed):
    r = np.random.default_rng(seed); out = np.zeros((h, w)); amp = 1.0; tot = 0
    for o in range(octaves):
        n = base * 2 ** o
        g = r.standard_normal((int(n * h / w) + 2, n + 2))
        out += amp * np.asarray(Image.fromarray(g.astype(np.float32), mode='F').resize((w, h), Image.BICUBIC)); tot += amp; amp *= 0.5
    return out / tot

yy, xx = np.mgrid[0:h, 0:w] / S

# ---------- streets: wet cobbles at night ----------
asphalt = np.array([30, 52, 58], float)
img = np.ones((h, w, 3)) * asphalt
mott = noise(5, 4, 3)
img *= (1 + mott * 0.18)[..., None]
# cobble pattern: staggered small setts, darker joints
cx = (xx / 4.2 + (np.floor(yy / 2.6) % 2) * 0.5) % 1
cy = (yy / 2.6) % 1
joint = ((cx < 0.14) | (cy < 0.2)).astype(float)
img *= (1 - joint * 0.22)[..., None]
# lamp light pools on the wet street
for (sx, _), (sy, _) in [(VS[a], HS[b]) for a in VS for b in HS]:
    d2 = ((xx - sx) ** 2 + (yy - sy) ** 2) / (46 ** 2)
    img += np.exp(-d2)[..., None] * np.array([70, 64, 34])
# glints on the cobbles
gl = (noise(3, 60, 9) > 0.55) & (joint < 0.5)
img[gl] += np.array([40, 52, 52])

# ---------- the underground: sewer mains and old tunnels, painted first so blocks sit over them ----------
under = Image.new('RGBA', (w, h), (0, 0, 0, 0))
ud = ImageDraw.Draw(under)
GREEN = (126, 196, 64)
def P(x, y): return (x * S, y * S)
# old closed subway tunnels: two long bores with ties, running under the blocks
TUN = [[(-20, 236), (210, 236), (330, 410), (330, 930)], [(600, 600), (450, 600), (215, 760), (-20, 760)]]
for path in TUN:
    pts = [P(*p) for p in path]
    ud.line(pts, fill=(14, 40, 30, 255), width=30 * S, joint='curve')
    ud.line(pts, fill=(52, 92, 44, 255), width=24 * S, joint='curve')
    ud.line(pts, fill=(20, 48, 34, 255), width=16 * S, joint='curve')
    # ties and rails
    for (x0, y0), (x1, y1) in zip(path, path[1:]):
        L = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L
        for t in np.arange(0, L, 7):
            px, py = x0 + ux * t, y0 + uy * t
            ud.line([P(px - uy * 7, py + ux * 7), P(px + uy * 7, py - ux * 7)], fill=(74, 112, 58, 255), width=2 * S)
        for off in (-4, 4):
            ud.line([P(x0 - uy * off, y0 + ux * off), P(x1 - uy * off, y1 + ux * off)], fill=(150, 170, 140, 255), width=S)
# sewer mains under every street, a little off centre
for k, (x, hw) in VS.items():
    ud.line([P(x + 3, 0), P(x + 3, H)], fill=(40, 70, 40, 150), width=6 * S)
for k, (y, hw) in HS.items():
    ud.line([P(0, y + 3), P(W, y + 3)], fill=(40, 70, 40, 150), width=6 * S)
glow_src = under.split()[3].filter(ImageFilter.GaussianBlur(9 * S))
glow = Image.new('RGBA', (w, h), GREEN + (0,)); glow.putalpha(glow_src.point(lambda v: int(v * 0.32)))
for k, (x, hw) in VS.items():
    for y_ in range(0, H, 14):
        ud.line([P(x + 3, y_), P(x + 3, y_ + 8)], fill=GREEN + (210,), width=2 * S)
for k, (y, hw) in HS.items():
    for x_ in range(0, W, 14):
        ud.line([P(x_, y + 3), P(x_ + 8, y + 3)], fill=GREEN + (210,), width=2 * S)
# a slow trickle of green ooze along the tunnels
for path in TUN:
    ud.line([P(*p) for p in path], fill=(150, 214, 70, 200), width=3 * S, joint='curve')

base = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).convert('RGBA')
base.alpha_composite(glow)
base.alpha_composite(under)

# ---------- the blocks: cast iron lofts, roofs seen from above ----------
vx = sorted(VS.values()); hy = sorted(HS.values())
xs = [(-40, 0)] + vx + [(W + 40, 0)]
ys = [(-40, 0)] + hy + [(H + 40, 0)]
blocks = Image.new('RGBA', (w, h), (0, 0, 0, 0)); bd = ImageDraw.Draw(blocks)
shadow = Image.new('L', (w, h), 0); sd = ImageDraw.Draw(shadow)
xray = Image.new('L', (w, h), 0); xd = ImageDraw.Draw(xray)
shop_box = None
for i in range(len(xs) - 1):
    for j in range(len(ys) - 1):
        x0 = xs[i][0] + xs[i][1] + 5; x1 = xs[i + 1][0] - xs[i + 1][1] - 5
        y0 = ys[j][0] + ys[j][1] + 5; y1 = ys[j + 1][0] - ys[j + 1][1] - 5
        if x1 - x0 < 10 or y1 - y0 < 10:
            continue
        # sidewalk
        bd.rectangle([P(x0 - 5, y0 - 5), P(x1 + 5, y1 + 5)], fill=(74, 98, 100, 255))
        bd.rectangle([P(x0 - 5, y0 - 5), P(x1 + 5, y1 + 5)], outline=(104, 128, 126, 255), width=S)
        # lots: two rows split down the middle of the block, random frontages
        mid = (x0 + x1) / 2
        for (a, b) in ((x0, mid), (mid, x1)):
            y = y0
            while y < y1 - 4:
                d = float(rng.uniform(18, 46)); yb = min(y1, y + d)
                if y1 - yb < 12: yb = y1
                tone = rng.uniform(0.8, 1.15)
                c = tuple(int(v * tone) for v in (66, 96, 102))
                bd.rectangle([P(a, y), P(b, yb)], fill=c + (255,))
                bd.line([P(a, y), P(b, y)], fill=(118, 146, 146, 255), width=S)          # parapet lit from the north
                bd.line([P(a, y), P(a, yb)], fill=(108, 136, 138, 255), width=S)
                sd.rectangle([P(a + 4, y + 4), P(b + 4, yb + 4)], fill=200)
                # roof furniture: water tower, skylights, hatch
                r = rng.random()
                if r < 0.28 and (b - a) > 22 and (yb - y) > 20:
                    tx, ty = rng.uniform(a + 9, b - 9), rng.uniform(y + 9, yb - 9)
                    sd.ellipse([P(tx - 3, ty - 1), P(tx + 13, ty + 9)], fill=230)
                    bd.ellipse([P(tx - 6, ty - 6), P(tx + 6, ty + 6)], fill=(120, 92, 66, 255), outline=(60, 44, 34, 255), width=S)
                    bd.line([P(tx - 6, ty), P(tx + 6, ty)], fill=(80, 60, 44, 255), width=S)
                elif r < 0.6:
                    for k in range(int(rng.integers(1, 4))):
                        sx_ = rng.uniform(a + 4, max(a + 5, b - 14)); sy_ = rng.uniform(y + 3, max(y + 4, yb - 9))
                        bd.rectangle([P(sx_, sy_), P(sx_ + 10, sy_ + 6)], fill=(150, 176, 170, 255), outline=(44, 66, 70, 255), width=S)
                else:
                    hx, hy_ = rng.uniform(a + 4, max(a + 5, b - 8)), rng.uniform(y + 3, max(y + 4, yb - 8))
                    bd.rectangle([P(hx, hy_), P(hx + 6, hy_ + 6)], fill=(46, 66, 70, 255))
                if (b == mid) and abs(b - VS['crosby'][0] + VS['crosby'][1] + 5) < 1 and False:
                    pass
                y = yb
        # the shop: north east corner lot of the block west of Crosby, south of Spring
        if abs(xs[i + 1][0] - VS['crosby'][0]) < 1 and abs(ys[j][0] - HS['spring'][0]) < 1:
            shop_box = (mid, y0, x1, y0 + 34)
        xd.rectangle([P(x0, y0), P(x1, y1)], fill=255)

# cast shadows fall on the street only
sh_img = Image.new('RGBA', (w, h), (6, 16, 20, 0))
sh_img.putalpha(shadow.filter(ImageFilter.GaussianBlur(3 * S)).point(lambda v: int(v * 0.55)))
base.alpha_composite(sh_img)
# the blocks are drawn translucent where tunnels pass under them, so the bores show through
bl = np.asarray(blocks).astype(float)
und = np.asarray(under.split()[3]).astype(float) / 255
und = ndimage.gaussian_filter(und, 2 * S)
alpha = bl[..., 3] * (1 - 0.5 * und)
blocks = Image.fromarray(np.dstack([bl[..., :3], alpha]).clip(0, 255).astype(np.uint8))
base.alpha_composite(blocks)
# the shop, roof in safety orange with its sign glow
dr = ImageDraw.Draw(base, 'RGBA')
if shop_box:
    a, y0, b, y1 = shop_box
    gl = Image.new('L', (w, h), 0); ImageDraw.Draw(gl).rectangle([P(a - 4, y0 - 4), P(b + 4, y1 + 4)], fill=255)
    halo = Image.new('RGBA', (w, h), (242, 106, 31, 0)); halo.putalpha(gl.filter(ImageFilter.GaussianBlur(8 * S)).point(lambda v: int(v * 0.6)))
    base.alpha_composite(halo)
    dr = ImageDraw.Draw(base, 'RGBA')
    dr.rectangle([P(a, y0), P(b, y1)], fill=(236, 104, 34, 255), outline=(120, 44, 10, 255), width=S)
    dr.rectangle([P(a + 4, y0 + 5), P(b - 6, y0 + 12)], fill=(255, 196, 120, 255))
    # a pay phone booth on the corner
    px, py = VS['crosby'][0] - 16, HS['spring'][0] + 14
    dr.rectangle([P(px, py), P(px + 6, py + 6)], fill=(214, 224, 220, 255), outline=(40, 50, 54, 255), width=S)

# ---------- manholes: iron covers with an orange ring and green glow from below ----------
holes = [(x, y) for (x, _) in VS.values() for (y, _) in HS.values()]
holes += [(VS['crosby'][0], 570), (VS['mercer'][0], 410), (VS['broadway'][0], 240), (VS['lafayette'][0], 740), (VS['greene'][0], 580),
          (200, HS['spring'][0]), (460, HS['prince'][0]), (90, HS['broome'][0]), (330, HS['grand'][0])]
hl = Image.new('L', (w, h), 0); hd = ImageDraw.Draw(hl)
for x, y in holes:
    hd.ellipse([P(x - 9, y - 9), P(x + 9, y + 9)], fill=255)
halo = Image.new('RGBA', (w, h), GREEN + (0,)); halo.putalpha(hl.filter(ImageFilter.GaussianBlur(6 * S)).point(lambda v: int(v * 0.8)))
base.alpha_composite(halo)
cov = 7
tile = Image.new('RGBA', (2 * cov * S + 2, 2 * cov * S + 2), (0, 0, 0, 0)); td = ImageDraw.Draw(tile)
c0 = cov * S + 1
td.ellipse([1, 1, 2 * cov * S, 2 * cov * S], fill=(236, 104, 34, 255))
td.ellipse([1 + S, 1 + S, 2 * cov * S - S, 2 * cov * S - S], fill=(44, 46, 46, 255))
for k in range(-cov * S, cov * S, 4):
    td.line([(c0 + k, 0), (c0 + k, 2 * cov * S)], fill=(86, 88, 86, 255), width=1)
    td.line([(0, c0 + k), (2 * cov * S, c0 + k)], fill=(86, 88, 86, 255), width=1)
m = Image.new('L', tile.size, 0); ImageDraw.Draw(m).ellipse([1 + 2 * S, 1 + 2 * S, 2 * cov * S - 2 * S, 2 * cov * S - 2 * S], fill=255)
grid = tile.copy(); tile2 = Image.new('RGBA', tile.size, (0, 0, 0, 0))
ImageDraw.Draw(tile2).ellipse([1, 1, 2 * cov * S, 2 * cov * S], fill=(236, 104, 34, 255))
ImageDraw.Draw(tile2).ellipse([1 + S, 1 + S, 2 * cov * S - S, 2 * cov * S - S], fill=(44, 46, 46, 255))
tile2.paste(grid, (0, 0), m)
ImageDraw.Draw(tile2).arc([1 + S, 1 + S, 2 * cov * S - S, 2 * cov * S - S], 200, 300, fill=(150, 150, 140, 255), width=S)
for x, y in holes:
    base.alpha_composite(tile2, (int(x * S - c0), int(y * S - c0)))

# ---------- finish: soft painted mottle and an edge vignette ----------
arr = np.asarray(base).astype(float)
arr[..., :3] *= (1 + noise(5, 6, 77) * 0.10)[..., None]
arr[..., :3] = ndimage.gaussian_filter(arr[..., :3], (0.6 * S, 0.6 * S, 0))
d = np.minimum(np.minimum(xx, W - xx), np.minimum(yy, H - yy))
arr[..., :3] *= (0.78 + 0.22 * np.clip(d / 70, 0, 1))[..., None]
out = Image.fromarray(arr.clip(0, 255).astype(np.uint8)).convert('RGB')
out.save(os.path.join(D, 'assets', 'soho-map.png'), optimize=True)
print('map', out.size, 'shop', shop_box)

# ---------- the TMDB still of the corner (Spring and Crosby, the phone booth, the manhole), lifted for print ----------
from PIL import ImageEnhance
st0 = Image.open(os.path.join(D, 'assets', 'src-street.jpg')).convert('RGB').crop((480, 60, 1920, 60 + int(1440 * 190 / 318)))
st0 = st0.point([int(255 * ((i % 256) / 255) ** 0.62) for i in range(768)])
st0 = ImageEnhance.Brightness(ImageEnhance.Contrast(st0).enhance(1.1)).enhance(1.1)
st0.resize((636, 380), Image.LANCZOS).save(os.path.join(D, 'assets', 'still-corner.jpg'), quality=90)
