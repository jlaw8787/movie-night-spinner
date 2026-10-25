"""Paints the printed art and the soft wear layers for the Night Owl Dock Cafe placemat.

assets/skyline-halftone.png  TMDB still (Seattle skyline, moon and Needle) screened as a two-ink
                             offset halftone: teal plate at 45 deg, burgundy plate at 75 deg,
                             burgundy plate knocked 3px out of register, like a cheap placemat run.
assets/border-paper.png      the printed teal border (heavy rule, bead row, hairline), rough ink edges.
assets/wear-stain.png        soft mottling, edge wear, coffee ring, grease spots, gloss sheen.
assets/stamp-wear.png        soft paper-coloured gaps for the rubber stamp, so its ink sits unevenly.
All sizes are 2x the CSS size."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageChops

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
random.seed(1993)
rng = np.random.default_rng(214)

PAPER = np.array([240, 232, 212], float)
TEAL = np.array([23, 76, 87], float)
BURG = np.array([140, 34, 50], float)


def plate(cov, pitch, angle_deg, shape):
    """AM halftone: True where ink lands. cov is 0..1 coverage at full (supersampled) size."""
    h, w = shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    a = math.radians(angle_deg)
    u = xx * math.cos(a) + yy * math.sin(a)
    v = -xx * math.sin(a) + yy * math.cos(a)
    du = u - np.round(u / pitch) * pitch
    dv = v - np.round(v / pitch) * pitch
    d = np.sqrt(du * du + dv * dv)
    r = pitch * np.sqrt(np.clip(cov, 0, 1) / math.pi) * 1.08
    return d < r


def ink_over(base, mask, ink, strength=0.94):
    """Multiply an ink film over the sheet where mask (0..1) is set."""
    t = ink / 255.0
    m = mask[..., None] * strength
    return base * (1 - m + m * t)


# ---------- 1. halftone of the skyline still: 440 x 384 css -> 880 x 768 px
CW, CH = 440, 384
OW, OH = CW * 2, CH * 2
SS = 4
src = Image.open(os.path.join(D, 'src', 'still-skyline.jpg')).convert('RGB')
# left part of the poster still only: skyline, moon and Needle, no people
crop = src.crop((0, 760, 1600, 760 + int(1600 * CH / CW)))
big = crop.resize((OW * SS, OH * SS), Image.LANCZOS).filter(ImageFilter.GaussianBlur(SS * 0.8))
arr = np.asarray(big).astype(np.float32) / 255.0
lum = 0.3 * arr[..., 0] + 0.59 * arr[..., 1] + 0.11 * arr[..., 2]
# levels: open the shadows so the navy sky separates from the black buildings and water
lev = np.clip((lum - 0.015) / 0.24, 0, 1) ** 0.8
# burgundy plate: warm light only (moon, sodium lights, their reflections)
warm = np.clip((arr[..., 0] - arr[..., 2]) * 2.6 + (arr[..., 0] - 0.35) * 0.5, 0, 1)
cov_b = np.clip(warm * 0.62, 0, 0.62)
# teal plate: darkness, knocked out under the warm areas so the moon prints in burgundy alone
cov_t = np.clip(1 - lev * 0.62, 0, 1) * (1 - np.clip(warm * 1.4, 0, 0.92))
pitch = 4.4 * SS  # about 44 lines per inch at print size, coarse enough to read as a screen
mt = plate(cov_t, pitch, 45, cov_t.shape).astype(np.float32)
mb = plate(cov_b, pitch, 75, cov_b.shape).astype(np.float32)
mb = np.roll(mb, (-2 * SS, 3 * SS), axis=(0, 1))  # out of register
# soft, low-detail ink density variation (big gentle mottle)
mot = Image.fromarray((rng.random((12, 14)) * 255).astype(np.uint8)).resize((OW * SS, OH * SS), Image.BICUBIC)
mot = np.asarray(mot.filter(ImageFilter.GaussianBlur(60))).astype(np.float32) / 255.0
sheet = np.ones(mt.shape + (3,), np.float32) * PAPER
sheet = ink_over(sheet, mb, BURG, 0.9)
sheet = ink_over(sheet, mt * (0.88 + 0.1 * mot), TEAL, 1.0)
img = Image.fromarray(np.clip(sheet, 0, 255).astype(np.uint8)).resize((OW, OH), Image.LANCZOS)
img.save(os.path.join(A, 'skyline-halftone.png'))


# ---------- 2. printed border, 1344 x 960 css -> 2688 x 1920 px, transparent outside the ink
W, H = 1344 * 2, 960 * 2
S = 2
bw, bh = W * S, H * S
m = Image.new('L', (bw, bh), 0)
d = ImageDraw.Draw(m)
def R(x0, y0, x1, y1, width):
    d.rectangle([x0 * S * 2, y0 * S * 2, x1 * S * 2, y1 * S * 2], outline=255, width=int(width * S * 2))
# heavy rule at 20 css px, hairline at 36 css px, bead row between
R(20, 20, 1324, 940, 4)
R(36, 36, 1308, 924, 1.2)
step = 14
def beads(x0, y0, x1, y1):
    n = int(max(x1 - x0, y1 - y0) / step)
    for i in range(n + 1):
        x = x0 + (x1 - x0) * i / n
        y = y0 + (y1 - y0) * i / n
        r = 1.7
        d.ellipse([(x - r) * S * 2, (y - r) * S * 2, (x + r) * S * 2, (y + r) * S * 2], fill=255)
beads(28, 28, 1316, 28); beads(28, 932, 1316, 932)
beads(28, 28, 28, 932); beads(1316, 28, 1316, 932)
# roughen the ink edge: blur, add low noise, re-threshold
m = m.filter(ImageFilter.GaussianBlur(1.6 * S))
noise = Image.fromarray((rng.random((bh // 6, bw // 6)) * 255).astype(np.uint8)).resize((bw, bh), Image.BICUBIC)
na = np.asarray(m).astype(np.float32) + (np.asarray(noise).astype(np.float32) - 128) * 0.55
m = Image.fromarray(np.where(na > 120, 255, 0).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8)).resize((W, H), Image.LANCZOS)
ink = Image.new('RGBA', (W, H), (23, 76, 87, 0))
ink.putalpha(m.point(lambda v: int(v * 0.93)))
ink.save(os.path.join(A, 'border-paper.png'))


# ---------- 3. wear: 1344 x 960 css, painted at 1x then scaled (soft, low detail)
PW, PH = 1344, 960
def soft_noise(cells_w, cells_h, blur):
    n = Image.fromarray((rng.random((cells_h, cells_w)) * 255).astype(np.uint8))
    return n.resize((PW, PH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))

wear = Image.new('RGBA', (PW, PH), (0, 0, 0, 0))
tone = Image.new('RGBA', (PW, PH), (140, 116, 76, 0))
tone.putalpha(soft_noise(30, 22, 34).point(lambda v: int(v * 0.07)))
wear = Image.alpha_composite(wear, tone)

edge = Image.new('L', (PW, PH), 0)
ed = ImageDraw.Draw(edge)
for i in range(22):
    ed.rectangle([i, i, PW - 1 - i, PH - 1 - i], outline=int(70 * (1 - i / 22) ** 2))
# a softened, slightly thumbed lower right corner
ed.polygon([(PW, PH - 70), (PW, PH), (PW - 90, PH)], fill=40)
edge = edge.filter(ImageFilter.GaussianBlur(7))
et = Image.new('RGBA', (PW, PH), (120, 92, 56, 0)); et.putalpha(edge)
wear = Image.alpha_composite(wear, et)

def coffee_ring(cx, cy, r, a):
    """Dried mug ring: dark uneven rim, faint wash inside, a second partial ring where the mug slid."""
    rim = Image.new('L', (PW, PH), 0); rd = ImageDraw.Draw(rim)
    for k in range(90):
        t0 = k * 4
        w = 3 + 3 * (0.5 + 0.5 * math.sin(k * 0.37) * math.cos(k * 0.11))
        aa = int(a * (0.55 + 0.45 * abs(math.sin(k * 0.19 + 1))))
        rd.arc([cx - r, cy - r, cx + r, cy + r], t0, t0 + 5, fill=aa, width=int(w))
    rd.arc([cx - r + 14, cy - r - 9, cx + r + 14, cy + r - 9], 150, 290, fill=int(a * 0.55), width=3)
    rim = rim.filter(ImageFilter.GaussianBlur(1.6))
    wash = Image.new('L', (PW, PH), 0); wd = ImageDraw.Draw(wash)
    wd.ellipse([cx - r + 4, cy - r + 4, cx + r - 4, cy + r - 4], fill=int(a * 0.16))
    wash = wash.filter(ImageFilter.GaussianBlur(10))
    m = ImageChops.add(rim, wash)
    c = Image.new('RGBA', (PW, PH), (118, 72, 34, 0)); c.putalpha(m)
    return c
wear = Image.alpha_composite(wear, coffee_ring(1188, 640, 58, 120))

def grease(cx, cy, rx, ry, a):
    """Grease soaks the sheet: a darker, slightly olive translucent blot with a soft edge."""
    g = Image.new('L', (PW, PH), 0); gd = ImageDraw.Draw(g)
    for _ in range(7):
        ox, oy = random.uniform(-rx * 0.4, rx * 0.4), random.uniform(-ry * 0.4, ry * 0.4)
        s = random.uniform(0.45, 0.8)
        gd.ellipse([cx + ox - rx * s, cy + oy - ry * s, cx + ox + rx * s, cy + oy + ry * s], fill=a)
    g = g.filter(ImageFilter.GaussianBlur(9))
    c = Image.new('RGBA', (PW, PH), (150, 128, 70, 0)); c.putalpha(g)
    return c
wear = Image.alpha_composite(wear, grease(590, 900, 60, 34, 46))
wear = Image.alpha_composite(wear, grease(1250, 170, 38, 26, 36))

# grease-proof gloss: a broad diagonal lift of light across the coated sheet
gl = Image.new('L', (PW, PH), 0); gd = ImageDraw.Draw(gl)
gd.polygon([(380, 0), (620, 0), (300, PH), (60, PH)], fill=30)
gl = gl.filter(ImageFilter.GaussianBlur(70))
gc = Image.new('RGBA', (PW, PH), (255, 253, 244, 0)); gc.putalpha(gl)
wear = Image.alpha_composite(wear, gc)
wear.resize((PW * 2, PH * 2), Image.BICUBIC).save(os.path.join(A, 'wear-stain.png'))


# ---------- 4. stamp wear: 268 x 132 css, paper-coloured soft gaps so the stamp ink is uneven
SW, SH = 268 * 2, 132 * 2
n = Image.fromarray((rng.random((9, 16)) * 255).astype(np.uint8)).resize((SW, SH), Image.BICUBIC).filter(ImageFilter.GaussianBlur(6))
a = np.asarray(n).astype(np.float32)
alpha = np.clip((a - 150) * 2.2, 0, 150).astype(np.uint8)
st = Image.new('RGBA', (SW, SH), (240, 232, 212, 0)); st.putalpha(Image.fromarray(alpha))
st.save(os.path.join(A, 'stamp-wear.png'))
print('painted')
