"""Paints the art and textures for the firehouse World Series supper window card (Frequency, 1969).
Two inks only, royal blue and orange, the way a Queens job printer ran a two-colour letterpress
card. Textures are soft and low-detail: sun fade from a shop window, tape at the corners."""
import os, math, random
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
BLUE = (31, 58, 138)
ORANGE = (232, 104, 34)
FW, FH = 1056, 1344
random.seed(1969)

def soft_noise(w, h, cells, blur, seed):
    r = random.Random(seed)
    small = Image.new('L', (cells, max(2, round(cells * h / w))))
    small.putdata([r.randint(0, 255) for _ in range(small.size[0] * small.size[1])])
    return small.resize((w, h), Image.BICUBIC).filter(ImageFilter.GaussianBlur(blur))

# ---------- baseball, drawn at 3x then reduced to 2x of 220 px ----------
S = 3
N = 440 * S
m_blue = Image.new('L', (N, N), 0)
m_or = Image.new('L', (N, N), 0)
db, do = ImageDraw.Draw(m_blue), ImageDraw.Draw(m_or)
c, R = N / 2, N * 0.46
db.ellipse([c - R, c - R, c + R, c + R], outline=255, width=7 * S)
# speed lines on the left, letterpress rule style
for i, dy in enumerate((-0.42, -0.2, 0.02, 0.24)):
    y = c + dy * R
    db.line([c - R - 0.0 * R, y, c - R * 0.98, y], fill=0)
# two seams: arcs of circles centred off the ball
def seam(cx, cy, rr, a0, a1):
    pts = []
    for k in range(200):
        a = math.radians(a0 + (a1 - a0) * k / 199)
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    return pts
for side in (-1, 1):
    cx = c + side * R * 1.32
    rr = R * 0.92
    a_mid = 180 if side == 1 else 0
    pts = seam(cx, c, rr, a_mid - 48, a_mid + 48)
    do.line(pts, fill=255, width=4 * S)
    # stitches: short ticks across the seam
    for k in range(6, 194, 13):
        x, y = pts[k]
        x2, y2 = pts[k + 1]
        ang = math.atan2(y2 - y, x2 - x)
        for t in (-1, 1):
            nx, ny = -math.sin(ang), math.cos(ang)
            a2 = ang + t * 0.55
            L = 15 * S
            do.line([x - nx * 2 * S, y - ny * 2 * S,
                     x + math.cos(a2 + math.pi / 2) * L * -side, y + math.sin(a2 + math.pi / 2) * L * -side],
                    fill=255, width=3 * S)
out = Image.new('RGBA', (N, N), (0, 0, 0, 0))
blue = Image.new('RGBA', (N, N), BLUE + (255,)); blue.putalpha(m_blue)
orng = Image.new('RGBA', (N, N), ORANGE + (255,)); orng.putalpha(m_or)
out = Image.alpha_composite(out, orng)
out = Image.alpha_composite(out, blue)
out.resize((440, 440), Image.LANCZOS).save(os.path.join(A, 'baseball.png'))

# ---------- masking tape strips, 2x ----------
def tape(name, w, h, rot, seed):
    r = random.Random(seed)
    W, H = w * 2, h * 2
    im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    m = Image.new('L', (W, H), 0)
    d = ImageDraw.Draw(m)
    # torn short ends
    top = [(0, 0)]
    pts = [(0, 0), (W, 0)]
    right = [(W - r.randint(0, 10), y) for y in range(0, H + 1, 8)]
    left = [(r.randint(0, 10), y) for y in range(H, -1, -8)]
    d.polygon([(0, 0), (W, 0)] + right + [(0, H)] + left, fill=215)
    col = Image.new('RGBA', (W, H), (222, 204, 152, 255))
    shade = soft_noise(W, H, 6, 10, seed)
    col = Image.composite(Image.new('RGBA', (W, H), (204, 182, 128, 255)), col, shade.point(lambda v: v // 2))
    col.putalpha(m)
    big = col.rotate(rot, resample=Image.BICUBIC, expand=True)
    big.save(os.path.join(A, name))
    print(name, big.size)
tape('wear-tape-a.png', 150, 44, 38, 1)
tape('wear-tape-b.png', 150, 44, -36, 2)
tape('wear-tape-c.png', 150, 44, -40, 3)
tape('wear-tape-d.png', 150, 44, 34, 4)

# ---------- sun fade and edge wear for the whole face, 1x is enough (soft) ----------
W, H = FW, FH
im = Image.new('RGBA', (W, H), (0, 0, 0, 0))
# sun yellowing strongest at the top, where the window light fell
y_grad = Image.linear_gradient('L').resize((W, H)).point(lambda v: int((255 - v) * 0.22))
mott = soft_noise(W, H, 7, 60, 11).point(lambda v: int(v * 0.35))
fade = Image.new('L', (W, H))
fade.putdata([min(255, a + b) for a, b in zip(y_grad.getdata(), mott.getdata())])
fade = fade.point(lambda v: int(v * 0.5))
im = Image.composite(Image.new('RGBA', (W, H), (214, 186, 120, 255)), im, fade)
im.putalpha(fade)
# grimy edges
edge = Image.new('L', (W, H), 0)
de = ImageDraw.Draw(edge)
for i in range(26):
    de.rectangle([i, i, W - 1 - i, H - 1 - i], outline=int(70 * (1 - i / 26) ** 2))
edge = edge.filter(ImageFilter.GaussianBlur(5))
edge_col = Image.new('RGBA', (W, H), (120, 98, 60, 255)); edge_col.putalpha(edge)
im = Image.alpha_composite(im, edge_col)
# one soft water mark low on the right, from condensation on the glass
wm = Image.new('L', (W, H), 0)
dw = ImageDraw.Draw(wm)
dw.ellipse([W - 300, H - 250, W - 30, H - 40], outline=34, width=10)
wm = wm.filter(ImageFilter.GaussianBlur(7))
wm_col = Image.new('RGBA', (W, H), (150, 120, 70, 255)); wm_col.putalpha(wm)
im = Image.alpha_composite(im, wm_col)
im.save(os.path.join(A, 'wear-sun.png'))
print('painted')
