# Swap the bulb lettering on the hero cinema sign from MOVIE NIGHT to REEL DINNER (8 Nov 2026).
# Works on the finished palace.webp (the orph.jpg source for compose-cinema-real.py is not in the repo).
# Run from the repo root: python3 scripts/reel-dinner-sign.py [source.webp]
# Rewrites assets/hero/palace.webp, palace-1400.webp and palace-1000.webp.
import sys, numpy as np, cv2
from PIL import Image, ImageDraw, ImageFont
from skimage.morphology import skeletonize

SRC = sys.argv[1] if len(sys.argv) > 1 else 'assets/hero/palace.webp'
I = cv2.cvtColor(np.array(Image.open(SRC).convert('RGB')), cv2.COLOR_RGB2BGR).astype(np.float32)
H, W = I.shape[:2]

# letter box on the sign, in photo pixels: top-left, top-right, bottom-right, bottom-left
quad = np.float32([(657, 128), (1158, 221), (1151, 266), (660, 183)])  # matches the old lettering: shrinks to the right with the board

# 1. take the old letters out: bright pixels inside the letter box, grown a little, painted over from the dark board
area = np.zeros((H, W), np.uint8)
grow = np.float32([(640, 112), (1175, 205), (1172, 285), (640, 196)])
cv2.fillPoly(area, [grow.astype(np.int32)], 255)
lum = cv2.cvtColor(I.astype(np.uint8), cv2.COLOR_BGR2GRAY)
bright = ((lum > 60) & (area > 0)).astype(np.uint8) * 255
bright = cv2.dilate(bright, np.ones((9, 9), np.uint8))
# keep the gold bulb strips outside the board: only clear inside the board quad
board = np.float32([(630, 108), (1135, 192), (1135, 290), (630, 200)])
bm = np.zeros((H, W), np.uint8); cv2.fillPoly(bm, [board.astype(np.int32)], 255)
right = np.float32([(1135, 205), (1175, 210), (1175, 285), (1135, 285)])
cv2.fillPoly(bm, [right.astype(np.int32)], 255)
clear = cv2.bitwise_and(bright, bm)
ring = cv2.dilate(bm, np.ones((3, 3), np.uint8))
dark = I[(ring > 0) & (lum < 45)]
bgc = np.median(dark, axis=0) if len(dark) else np.float32([20, 18, 18])
out = I.copy()
inp = cv2.inpaint(I.astype(np.uint8), clear, 7, cv2.INPAINT_TELEA).astype(np.float32)
# pull the inpainted patch toward the board colour so no smeared glow is left behind
cm = cv2.GaussianBlur(clear.astype(np.float32) / 255, (0, 0), 2.5)[..., None]
patch = inp * 0.35 + bgc * 0.65 + np.random.default_rng(1).normal(0, 2.5, (H, W, 1))
out = out * (1 - cm) + patch * cm

# 2. new letters: geometric bold sans like the old ones, bulbs along each stroke's centre line
font = ImageFont.truetype('/usr/share/texmf/fonts/opentype/public/tex-gyre/texgyreadventor-bold.otf', 220)
txt = 'REEL DINNER'
tw = int(font.getlength(txt)) + 40; th = 260
flat = Image.new('L', (tw, th), 0)
ImageDraw.Draw(flat).text((20, 10), txt, font=font, fill=255)
fa = np.array(flat) > 127
ys, xs = np.nonzero(fa); fa = fa[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
ch, cw = fa.shape
M = cv2.getPerspectiveTransform(np.float32([[0, 0], [cw, 0], [cw, ch], [0, ch]]), quad)
wk = cv2.warpPerspective(fa.astype(np.uint8) * 255, M, (W, H)) > 127
sk = skeletonize(wk); ys, xs = np.nonzero(sk)
order = np.lexsort((ys, xs)); pts = list(zip(xs[order], ys[order]))
bulbs = []
for x, y in pts:
    if all((x - bx) ** 2 + (y - by) ** 2 > 9.0 ** 2 for bx, by in bulbs[-80:]): bulbs.append((x, y))
core = np.zeros((H, W), np.float32)
rb = np.random.default_rng(42); lvl = rb.uniform(.8, 1.0, len(bulbs))
for (x, y), v in zip(bulbs, lvl): cv2.circle(core, (int(x), int(y)), 3, float(v), -1)
face = cv2.GaussianBlur(wk.astype(np.float32), (0, 0), 3.5)
glow = cv2.GaussianBlur(core, (0, 0), 7) * 2.6 + cv2.GaussianBlur(core, (0, 0), 2.2) * 1.4 + face * 0.55
warm = np.float32([95, 175, 235])
out = out + warm * np.clip(glow, 0, 1.6)[..., None] * 0.8
cc = cv2.GaussianBlur(core, (0, 0), 0.9); hot = np.float32([190, 232, 255])
out = out * (1 - np.clip(cc, 0, 1)[..., None]) + hot * np.clip(cc, 0, 1)[..., None]
# match the photo's softness and grain over the new sign
soft = cv2.GaussianBlur(out, (0, 0), 0.8)
mk = cv2.GaussianBlur(bm.astype(np.float32) / 255, (0, 0), 4)[..., None]
out = out * (1 - mk) + soft * mk + np.random.default_rng(5).normal(0, 1.5, (H, W, 1)) * mk
res = Image.fromarray(cv2.cvtColor(np.clip(out, 0, 255).astype(np.uint8), cv2.COLOR_BGR2RGB))
res.save('assets/hero/palace.webp', quality=84, method=6)
for w in (1400, 1000):
    res.resize((w, round(H * w / W)), Image.LANCZOS).save(f'assets/hero/palace-{w}.webp', quality=82, method=6)
print('bulbs', len(bulbs))
