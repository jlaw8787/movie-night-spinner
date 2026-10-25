"""Paints two more assets for the Harbor & Hudson Lines card (The Out-of-Towners, 1970).

lantern.png : a conductor's hand lantern, engraved in black line with the globe printed in the
              gold plate, the gold a hair out of register, same method as engraving.png.
wear-ink-front.png / wear-ink-back.png : uneven ink coverage. Paper-coloured, very soft mottling
              and faint roller bands laid over the type so the black reads as pressed ink that
              varies across the sheet, not flat screen black.
"""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
rng = np.random.default_rng(175)
INK = (28, 24, 22)
GOLD = (214, 168, 70)
PAPER = (242, 234, 219)

CW, CH, S = 96, 124, 4
W, H = CW * S, CH * S
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)


def P(pts): return [(x * S, y * S) for x, y in pts]


def mpoly(pts):
    m = Image.new('L', (W, H), 0); ImageDraw.Draw(m).polygon(P(pts), fill=255)
    return np.asarray(m, np.float32) / 255 > 0.5


def hatch(mask, tone, angle=0.0, sp=1.5):
    a = math.radians(angle)
    proj = -xx * math.sin(a) + yy * math.cos(a)
    d = np.abs((proj / (sp * S)) % 1.0 - 0.5) * 2
    return mask & (d < np.clip(tone, 0, 1))


def hgrad(x0, x1, t0, t1):
    t = np.clip((xx - x0 * S) / ((x1 - x0) * S), 0, 1); return t0 + (t1 - t0) * t


ink = np.zeros((H, W), bool)
lines = Image.new('L', (W, H), 0)
LD = ImageDraw.Draw(lines)


def put(layer, mask):
    global ink
    ink[mask] = False
    ink |= layer & mask


def stroke(pts, w=1.0):
    LD.line(P(pts), fill=255, width=max(1, int(round(w * S))), joint='curve')


CX = 48


def profile(y):
    """half width of the glass globe at height y (pear shape, widest low)"""
    t = (y - 40) / 44
    return 15 + 12 * math.sin(math.pi * min(max(t, 0), 1) ** 0.8)


GY0, GY1 = 40, 84
globe = [(CX - profile(y), y) for y in np.linspace(GY0, GY1, 40)] + [(CX + profile(y), y) for y in np.linspace(GY1, GY0, 40)]
gm = mpoly(globe)
# glass: fine vertical lines, dark on the shadow side, a clear highlight stripe at left
tone = hgrad(CX - 27, CX + 27, 0.10, 0.62)
hl = (xx > (CX - 15) * S) & (xx < (CX - 10) * S)
tone = np.where(hl, 0.0, tone)
put(hatch(gm, tone, 90, 1.25), gm)
# flame inside: kept clear, outlined
flame = [(CX, 56)] + [(CX + 4.2 * math.sin(t) * (1 - t / math.pi * 0.2), 64 - 8 * math.cos(t)) for t in np.linspace(0.3, math.pi, 10)] + \
        [(CX - 4.2 * math.sin(t), 64 - 8 * math.cos(t)) for t in np.linspace(math.pi, 0.3, 10)]
fm = mpoly(flame)
put(np.zeros_like(ink), fm)
stroke(flame + [flame[0]], 0.55)
stroke([(CX, 72), (CX, 69)], 1.2)   # wick
stroke(globe + [globe[0]], 0.9)
# guard wires over the globe
for f in (-0.86, -0.45, 0.0, 0.45, 0.86):
    pts = [(CX + f * profile(y), y) for y in np.linspace(GY0 - 1, GY1 + 1, 30)]
    stroke(pts, 1.1)
for ry in (52, 72):
    r = profile(ry)
    pts = [(CX + r * math.cos(t), ry + 2.4 * math.sin(t)) for t in np.linspace(0, math.pi, 24)]
    stroke(pts, 1.1)

# metal: top cap, vent, chimney, rims, fount
def metal(pts, t0=0.25, t1=0.85, ang=0, cross=True):
    m = mpoly(pts)
    xs = [p[0] for p in pts]
    t = hgrad(min(xs), max(xs), t0, t1)
    lay = hatch(m, t, ang, 1.3)
    if cross:
        lay |= hatch(m, np.clip(t - 0.5, 0, 1) * 1.8, ang + 70, 1.5)
    put(lay, m)
    stroke(pts + [pts[0]], 0.9)


metal([(CX - 22, GY0 + 1), (CX + 22, GY0 + 1), (CX + 21, GY0 - 4), (CX - 21, GY0 - 4)])                 # upper rim
dome = [(CX - 21, GY0 - 4)] + [(CX - 21 * math.cos(t), GY0 - 4 - 11 * math.sin(t)) for t in np.linspace(0, math.pi, 24)][1:]
metal(dome, 0.15, 0.8, 0)
for k in range(7):                                                                                        # vent holes
    vx = CX - 15 + k * 5
    LD.ellipse([(vx - 1.3) * S, (GY0 - 9.5) * S, (vx + 1.3) * S, (GY0 - 7) * S], fill=255)
metal([(CX - 7, GY0 - 14), (CX + 7, GY0 - 14), (CX + 7, GY0 - 22), (CX - 7, GY0 - 22)], 0.2, 0.85, 0, False)  # chimney
metal([(CX - 10, GY0 - 22), (CX + 10, GY0 - 22), (CX + 8, GY0 - 25), (CX - 8, GY0 - 25)], 0.3, 0.9)
metal([(CX - 21, GY1 - 1), (CX + 21, GY1 - 1), (CX + 22, GY1 + 4), (CX - 22, GY1 + 4)])                 # lower rim
fount = [(CX - 20, GY1 + 4), (CX + 20, GY1 + 4), (CX + 20, GY1 + 20), (CX + 24, GY1 + 26), (CX - 24, GY1 + 26), (CX - 20, GY1 + 20)]
metal(fount, 0.1, 0.8, 0)
stroke([(CX - 20, GY1 + 12), (CX + 20, GY1 + 12)], 0.8)
stroke([(CX - 20, GY1 + 20), (CX + 20, GY1 + 20)], 0.8)
# wick key on the side
LD.ellipse([(CX + 20) * S, (GY1 + 6) * S, (CX + 25) * S, (GY1 + 11) * S], outline=255, width=int(0.9 * S))
# bail handle: heavy wire hoop
pts = [(CX - 22, GY0 - 2)] + [(CX - 22 * math.cos(t) * 1.02, GY0 - 2 - 34 * math.sin(t)) for t in np.linspace(0, math.pi, 40)][1:]
stroke(pts, 1.8)
stroke([(CX - 24, GY0 - 2), (CX - 20, GY0 - 2)], 1.6); stroke([(CX + 20, GY0 - 2), (CX + 24, GY0 - 2)], 1.6)
# grip on top of the bail
grip = [(CX - 9, 2.5), (CX + 9, 2.5), (CX + 9, 7.5), (CX - 9, 7.5)]
put(hatch(mpoly(grip), hgrad(CX - 9, CX + 9, 0.2, 0.9), 0, 1.0), mpoly(grip))
stroke(grip + [grip[0]], 0.8)
# small cast shadow under the base, engraved
for k in range(4):
    y = GY1 + 28 + k * 1.5
    w = 30 - k * 5
    stroke([(CX - w + 6, y), (CX + w + 6, y)], 0.45)

# merge and squash like the train cut
art = np.maximum(ink.astype(np.float32), np.asarray(lines, np.float32) / 255)
img = Image.fromarray((art * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))
a = np.asarray(img, np.float32) / 255
cov = np.asarray(Image.fromarray((rng.random((H // 40 + 2, W // 40 + 2)) * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32) / 255
th = 0.42 + (cov - 0.5) * 0.08 + (rng.random((H, W)).astype(np.float32) - 0.5) * 0.06
a = np.clip((a - th) * 6 + 0.5, 0, 1)
ow, oh = CW * 2, CH * 2
black = Image.fromarray((a * 255).astype(np.uint8)).resize((ow, oh), Image.LANCZOS)
# gold plate: the globe and the light it throws, printed 3px right / 2px down of the key
gold = Image.new('L', (W, H), 0)
gd = ImageDraw.Draw(gold)
gd.polygon(P([(x + 0.9, y + 0.6) for x, y in globe]), fill=225)
gd.ellipse([(CX - 26 + 0.9) * S, (GY1 + 2 + 0.6) * S, (CX + 26 + 0.9) * S, (GY1 + 30 + 0.6) * S], fill=0)
gold = gold.resize((ow, oh), Image.LANCZOS)
res = Image.new('RGBA', (ow, oh), (0, 0, 0, 0))
res.paste(Image.new('RGBA', (ow, oh), GOLD + (255,)), (0, 0), gold)
res = Image.alpha_composite(res, Image.merge('RGBA', [Image.new('L', (ow, oh), c) for c in INK] + [black]))
res.save(os.path.join(A, 'lantern.png'))


# ---------------- uneven ink coverage over the type ----------------
def ink_wear(face, seed):
    r = np.random.default_rng(seed)
    w, h, s = 768, 1056, 2
    Wd, Hd = w * s, h * s
    big = Image.fromarray((r.random((h // 70 + 2, w // 70 + 2)) * 255).astype(np.uint8)).resize((Wd, Hd), Image.BICUBIC).filter(ImageFilter.GaussianBlur(40))
    mid = Image.fromarray((r.random((h // 26 + 2, w // 26 + 2)) * 255).astype(np.uint8)).resize((Wd, Hd), Image.BICUBIC).filter(ImageFilter.GaussianBlur(14))
    b = np.asarray(big, np.float32) / 255
    m = np.asarray(mid, np.float32) / 255
    # roller bands: the inking roller starves a little in soft horizontal bands
    yv = np.arange(Hd, dtype=np.float32)[:, None] / s
    band = 0.5 + 0.5 * np.sin(yv / 37.0 + 1.3) * np.sin(yv / 113.0)
    alpha = np.clip((b - 0.45) * 70, 0, 38) + np.clip((m - 0.55) * 60, 0, 18) + band * 10
    alpha = np.clip(alpha, 0, 52).astype(np.uint8)
    out = Image.new('RGBA', (Wd, Hd), PAPER + (0,))
    out.putalpha(Image.fromarray(alpha))
    out.save(os.path.join(A, f'wear-ink-{face}.png'))


ink_wear('front', 11)
ink_wear('back', 12)
print('lantern and ink wear painted')
