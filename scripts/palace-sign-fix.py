# Hero sign clean-up, 12 Nov 2026 (Josh's iPhone screenshot): the bulb border along the top of the REEL DINNER board was missing
# between the crest and the right scroll, leaving the black board cut off in a hard straight line, and the letters read as soft,
# pasted-on glow. This redraws the letters as separate bulbs like the crest's and carries the bulb rail across the gap.
# Works on the current assets/hero/palace.webp. Run from the repo root: python3 scripts/palace-sign-fix.py [source.webp]
# Rewrites assets/hero/palace.webp, palace-1400.webp and palace-1000.webp.
import sys, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from skimage.morphology import skeletonize

SRC = sys.argv[1] if len(sys.argv) > 1 else 'assets/hero/palace.webp'
I = cv2.cvtColor(np.array(Image.open(SRC).convert('RGB')), cv2.COLOR_RGB2BGR).astype(np.float32)
H, W = I.shape[:2]
rng = np.random.default_rng(7)

# 1. take the current letters and their glow out of the board
board = np.float32([(632, 112), (1133, 196), (1133, 288), (632, 202)])
bm = np.zeros((H, W), np.uint8); cv2.fillPoly(bm, [board.astype(np.int32)], 255)
right = np.float32([(1133, 206), (1172, 212), (1172, 284), (1133, 284)])
cv2.fillPoly(bm, [right.astype(np.int32)], 255)
lum = cv2.cvtColor(I.astype(np.uint8), cv2.COLOR_BGR2GRAY)
ring = cv2.dilate(bm, np.ones((15, 15), np.uint8)) & ~bm
bgc = np.median(I[(ring > 0) & (lum < 40)], axis=0)
glowy = ((lum.astype(np.float32) > bgc.mean() + 8) & (bm > 0)).astype(np.uint8) * 255
glowy = cv2.dilate(glowy, np.ones((5, 5), np.uint8)) & bm
inp = cv2.inpaint(I.astype(np.uint8), glowy, 9, cv2.INPAINT_TELEA).astype(np.float32)
cm = cv2.GaussianBlur(glowy.astype(np.float32) / 255, (0, 0), 2)[..., None]
# board texture: its colour plus fine grain and a faint left-to-right fall-off like the lit photo
xx = np.linspace(1.08, 0.92, W)[None, :, None]
patch = (inp * 0.25 + bgc * 0.75) * xx + rng.normal(0, 2.2, (H, W, 1))
out = I * (1 - cm) + patch * cm

# 2. new letters as separate bulbs along each stroke's centre line
quad = np.float32([(657, 128), (1158, 221), (1151, 266), (660, 183)])
font = ImageFont.truetype('/usr/share/texmf/fonts/opentype/public/tex-gyre/texgyreadventor-bold.otf', 220)
txt = 'REEL DINNER'
flat = Image.new('L', (int(font.getlength(txt)) + 40, 260), 0)
ImageDraw.Draw(flat).text((20, 10), txt, font=font, fill=255)
fa = np.array(flat) > 127
ys, xs = np.nonzero(fa); fa = fa[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
ch, cw = fa.shape
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [cw, 0], [cw, ch], [0, ch]]), quad)
wk = cv2.warpPerspective(fa.astype(np.uint8) * 255, M, (W, H)) > 127
sk = skeletonize(wk); ys, xs = np.nonzero(sk)
# walk each stroke from an end, so bulbs fall at even steps along it
S = set(zip(xs.tolist(), ys.tolist()))
nb = lambda q: [(q[0] + i, q[1] + j) for i in (-1, 0, 1) for j in (-1, 0, 1) if (i or j) and (q[0] + i, q[1] + j) in S]
seen = set(); pts = []
for q0 in sorted(S, key=lambda q: (len(nb(q)) != 1, q[0], q[1])):
    if q0 in seen: continue
    stack = [q0]
    while stack:
        q = stack.pop()
        if q in seen: continue
        seen.add(q); pts.append(q)
        stack.extend(sorted((n for n in nb(q) if n not in seen), key=lambda n: abs(n[0] - q[0]) + abs(n[1] - q[1]), reverse=True))
bulbs = []
for x, y in pts:
    sp = 8.0 - 1.6 * (x - 657) / 500  # bulbs a little closer together as the board recedes
    if all((x - bx) ** 2 + (y - by) ** 2 > sp ** 2 for bx, by in bulbs): bulbs.append((x, y))
core = np.zeros((H, W), np.float32); hotm = np.zeros((H, W), np.float32)
for x, y in bulbs:
    r = 3.0 - 0.8 * (x - 657) / 500; v = rng.uniform(.82, 1.0)
    cv2.circle(core, (int(x), int(y)), max(1, int(round(r))), float(v), -1, cv2.LINE_AA)
    cv2.circle(hotm, (int(x), int(y)), max(1, int(round(r * .55))), float(v), -1, cv2.LINE_AA)
warm = np.float32([80, 170, 238]); hot = np.float32([200, 238, 255])
halo = cv2.GaussianBlur(core, (0, 0), 2.6) * 2.1 + cv2.GaussianBlur(core, (0, 0), 7) * 1.0
out = out + warm * np.clip(halo, 0, 1.3)[..., None] * 0.75
bulb = np.clip(cv2.GaussianBlur(core, (0, 0), 0.7), 0, 1)[..., None]
out = out * (1 - bulb) + (warm * 0.35 + hot * 0.65) * bulb
hc = np.clip(cv2.GaussianBlur(hotm, (0, 0), 0.6), 0, 1)[..., None]
out = out * (1 - hc) + np.float32([235, 250, 255]) * hc

# 3. carry the bulb rail across the gap: two copies of a three-bulb run of the rail where it starts again at the right scroll
P0, P1 = np.float32([1141, 186]), np.float32([1192, 201])     # rail centre line, three bulbs apart
Q0, Qe = np.float32([1024, 139]), np.float32([1143, 187])     # crest's last bulb to where the rail starts again
def nrm(a, b):
    d = (b - a) / np.linalg.norm(b - a); return np.float32([-d[1], d[0]])
src = out.copy(); hh = 9.0
for k in range(2):
    a = Q0 + (Qe - Q0) * k / 2; b = Q0 + (Qe - Q0) * (k + 1) / 2
    A = cv2.getAffineTransform(np.float32([P0, P1, P0 + nrm(P0, P1) * hh]), np.float32([a, b, a + nrm(a, b) * hh]))
    wp = cv2.warpAffine(src, A, (W, H), flags=cv2.INTER_LINEAR, borderMode=cv2.BORDER_REFLECT)
    n = nrm(a, b); d = (b - a) / np.linalg.norm(b - a)
    poly = np.float32([a - d * 2 + n * 11, b + d * 2 + n * 11, b + d * 2 - n * 11, a - d * 2 - n * 11])
    m = np.zeros((H, W), np.float32); cv2.fillPoly(m, [poly.astype(np.int32)], 1.0)
    m = cv2.GaussianBlur(m, (0, 0), 1.6)[..., None]
    out = out * (1 - m) + wp * m

# match the photo's softness and grain over everything touched
touched = cv2.dilate(bm, np.ones((9, 9), np.uint8)).astype(np.float32) / 255
cv2.fillPoly(touched, [np.int32([(1015, 120), (1150, 172), (1150, 205), (1015, 158)])], 1.0)
tk = cv2.GaussianBlur(touched, (0, 0), 3)[..., None]
soft = cv2.GaussianBlur(out, (0, 0), 0.6)
out = out * (1 - tk) + soft * tk + rng.normal(0, 1.4, (H, W, 1)) * tk
res = Image.fromarray(cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_BGR2RGB))
res.save('assets/hero/palace.webp', quality=88, method=6)
for w in (1400, 1000):
    res.resize((w, round(H * w / W)), Image.LANCZOS).save(f'assets/hero/palace-{w}.webp', quality=86, method=6)
print('bulbs', len(bulbs))
