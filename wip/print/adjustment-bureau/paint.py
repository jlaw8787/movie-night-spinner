"""Paints the assets for the Norris for Senate election night reception card (The Adjustment Bureau, 2006).
A two-spot-colour campaign job on white coated card: campaign red plus a near-black.
- assets/candidate.jpg : TMDB still of David at the podium, cropped to head and shoulders, run as a red/black duotone
- assets/wear-front.png, wear-back.png : soft edge handling and corner scuffs, big and gentle
- assets/stain-ring.png : faint champagne flute ring from the cash bar
"""
import os, random, shutil, subprocess
from PIL import Image, ImageFilter, ImageChops, ImageOps, ImageDraw

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
random.seed(2006)
W, H = 576, 864
S = 2

# paper grain shared across the kit
shutil.copy('/home/claude/polish/wip/print/jurassic/src/assets/paper-grain.png', os.path.join(A, 'paper-grain.png'))

# ---------- candidate photo ----------
SRC = os.path.join(A, 'podium-original.jpg')
if not os.path.exists(SRC):
    subprocess.run(['curl', '-s', '-o', SRC, 'https://image.tmdb.org/t/p/original/8q2UGgp8YSQWLrTtU9YJyA1u0Fd.jpg'], check=True)
im = Image.open(SRC).convert('L')
# head and shoulders, flag kept at the right edge
box = (830, 0, 1670, 1069)             # 840 x 1069, fills a 220 x 280 portrait box
crop = im.crop(box).resize((220 * S, 280 * S), Image.LANCZOS)
crop = ImageOps.autocontrast(crop, cutoff=1)
# lift the shadows so the face reads on press
crop = crop.point(lambda v: int(18 + v * 0.93))
RED = (196, 35, 47); BLACK = (34, 34, 38); PAPER = (247, 245, 240)
# duotone: black plate carries the shadows, red plate carries the mids
lut_r, lut_g, lut_b = [], [], []
for v in range(256):
    t = v / 255
    # black plate for the tones, a light red plate in the mids (classic two-colour duotone)
    base = [BLACK[i] + (PAPER[i] - BLACK[i]) * t for i in range(3)]
    k = 0.32 * (4 * t * (1 - t))
    c = [base[i] * (1 - k) + RED[i] * k for i in range(3)]
    lut_r.append(int(c[0])); lut_g.append(int(c[1])); lut_b.append(int(c[2]))
duo = Image.merge('RGB', (crop.point(lut_r), crop.point(lut_g), crop.point(lut_b)))
duo.save(os.path.join(A, 'candidate.jpg'), quality=90)

# ---------- soft wear ----------
def blob_field(w, h, n, rmin, rmax, amin, amax, seed):
    random.seed(seed)
    m = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(m)
    for _ in range(n):
        x, y = random.randint(0, w), random.randint(0, h)
        r = random.randint(rmin, rmax)
        d.ellipse([x - r, y - r, x + r, y + r], fill=random.randint(amin, amax))
    return m.filter(ImageFilter.GaussianBlur(rmax * 0.8))

def wear(seed, scuff_corner):
    w, h = W * S, H * S
    # edge darkening: handled card, slight warm toning near the edges
    edge = Image.new('L', (w, h), 0)
    d = ImageDraw.Draw(edge)
    for i in range(40):
        a = int(26 * (1 - i / 40) ** 2)
        d.rectangle([i, i, w - 1 - i, h - 1 - i], outline=a)
    edge = edge.filter(ImageFilter.GaussianBlur(10))
    mott = blob_field(w, h, 50, 60, 160, 0, 10, seed)
    alpha = ImageChops.add(edge, mott)
    # corner scuff where a thumb held it
    cx, cy = scuff_corner
    c = Image.new('L', (w, h), 0)
    ImageDraw.Draw(c).ellipse([cx * S - 90, cy * S - 90, cx * S + 90, cy * S + 90], fill=22)
    alpha = ImageChops.add(alpha, c.filter(ImageFilter.GaussianBlur(50)))
    out = Image.new('RGBA', (w, h), (120, 100, 70, 0))
    out.putalpha(alpha)
    return out

wear(11, (W, H)).save(os.path.join(A, 'wear-front.png'))
wear(23, (0, H)).save(os.path.join(A, 'wear-back.png'))

# ---------- champagne flute ring, faint ----------
R = 76 * S
sz = R * 2 + 40
ring = Image.new('L', (sz, sz), 0)
d = ImageDraw.Draw(ring)
c = sz // 2
d.ellipse([c - R, c - R, c + R, c + R], outline=46, width=5)
d.ellipse([c - R + 5, c - R + 5, c + R - 5, c + R - 5], outline=16, width=8)
# break the ring where the base lifted
gap = Image.new('L', (sz, sz), 255)
ImageDraw.Draw(gap).pieslice([0, 0, sz, sz], 200, 250, fill=40)
ring = ImageChops.multiply(ring, gap).filter(ImageFilter.GaussianBlur(2.2))
inner = Image.new('L', (sz, sz), 0)
ImageDraw.Draw(inner).ellipse([c - R + 10, c - R + 10, c + R - 10, c + R - 10], fill=6)
ring = ImageChops.add(ring, inner.filter(ImageFilter.GaussianBlur(14)))
st = Image.new('RGBA', (sz, sz), (150, 125, 70, 0)); st.putalpha(ring)
st.save(os.path.join(A, 'stain-ring.png'))
print('painted')
