"""Galaxy Video member card and hire-case sticker, built from the master logo.

Run from the repo root:  python3 scripts/compose-brand-extras.py
Needs the master logo export (gv-master.png, 1536x1024) and the @fontsource
woff files in SP. Writes assets/brand/member-card.webp and case-sticker.webp.
Personal details (name, member number, stock number) are overlaid in HTML.
"""
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

SP = 'scratchpad/'  # folder holding gv-master.png and logo/node_modules/@fontsource
REPO = ''
rng = np.random.default_rng(11)
FONTS = SP + 'logo/node_modules/@fontsource/'
def font(name, size):
    import glob
    f = [p for p in glob.glob(FONTS + name + '/files/*latin-400-normal.woff') if 'ext' not in p][0]
    return ImageFont.truetype(f, size)

def arr(im): return np.asarray(im).astype(np.float32) / 255
def img(a): return Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
def blur(a, r): return arr(img(a).filter(ImageFilter.GaussianBlur(r)))
def smooth_noise(h, w, scale, seed):
    r = np.random.default_rng(seed)
    small = r.random((max(2, h // scale), max(2, w // scale))).astype(np.float32)
    return arr(Image.fromarray((small * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC))

master = Image.open(SP + 'gv-master.png').convert('RGB')
M = arr(master)
BG_IN = M[300:700, 40:120].mean((0, 1))     # the purple behind the logo
BG_OUT = M[0:40].mean((0, 1))

def logo_cut(tagline=True):
    """the logo with its own background feathered away, so it sits on any dark purple"""
    y1 = 960 if tagline else 845
    crop = M[20:y1, 130:1406]
    lum = crop.max(2)
    bgl = np.array([BG_IN.max(), BG_OUT.max()]).max()
    a = np.clip((lum - bgl - 0.03) / 0.10, 0, 1)
    a = arr(img(a).filter(ImageFilter.MaxFilter(9)))          # keep outlines and extrude
    a = blur(a, 4)
    return crop, a

def text_mask(W, H, xy, s, f, anchor='la', skew=0.0):
    m = Image.new('L', (W, H), 0)
    ImageDraw.Draw(m).text(xy, s, font=f, fill=255, anchor=anchor)
    if skew:
        m = m.transform(m.size, Image.AFFINE, (1, skew, -skew * xy[1], 0, 1, 0), Image.BICUBIC)
    return arr(m)

def paint(canvas, mask, col, alpha=1.0):
    m = mask[..., None] * alpha
    return canvas * (1 - m) + np.array(col, np.float32) * m

def stripes(canvas, x0, x1, y, h, gap, taper=True):
    W = canvas.shape[1]
    for i, c in enumerate(([1.0, 0.55, 0.12], [1.0, 0.24, 0.55], [0.10, 0.71, 0.68])):
        m = np.zeros(canvas.shape[:2], np.float32)
        yy = y + i * (h + gap)
        m[yy:yy + h, x0:x1] = 1
        if taper:
            fade = np.clip((np.arange(W) - x0) / 120, 0, 1)
            m *= fade[None, :]
        canvas = paint(canvas, m, c)
    return canvas

def round_alpha(W, H, r, ss=4):
    m = Image.new('L', (W * ss, H * ss), 0)
    ImageDraw.Draw(m).rounded_rectangle((0, 0, W * ss - 1, H * ss - 1), r * ss, fill=255)
    return arr(m.resize((W, H), Image.LANCZOS))

def scratches(H, W, n, seed, strength):
    r = np.random.default_rng(seed)
    s = Image.new('L', (W, H), 0); d = ImageDraw.Draw(s)
    for _ in range(n):
        x, y = r.uniform(0, W), r.uniform(0, H)
        ang = r.uniform(-0.6, 0.6) + (np.pi / 2 if r.random() < 0.3 else 0)
        L = r.uniform(8, 70)
        d.line((x, y, x + L * np.cos(ang), y + L * np.sin(ang)), fill=int(r.uniform(60, 255)), width=1)
    return arr(s) * strength

# ---------------------------------------------------------------- member card
W, H = 1012, 638
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
d = np.sqrt(((xx - 300) / W) ** 2 + ((yy - 200) / H) ** 2)
card = BG_IN * (1 - np.clip(d / 0.9, 0, 1))[..., None] + BG_OUT * np.clip(d / 0.9, 0, 1)[..., None]
card = card * 1.15
# a few printed stars, the way the 90s cards did space
st = Image.new('L', (W, H), 0); sd = ImageDraw.Draw(st)
for _ in range(70):
    x, y, s = rng.uniform(0, W), rng.uniform(0, H), rng.choice([1, 1, 1, 2, 3])
    sd.ellipse((x, y, x + s, y + s), fill=int(rng.uniform(90, 230)))
card = paint(card, blur(arr(st), 0.5), [0.95, 0.90, 1.0], 0.55)

crop, a = logo_cut(tagline=True)
lw = 520; lh = int(crop.shape[0] * lw / crop.shape[1])
lc = arr(img(crop).resize((lw, lh), Image.LANCZOS)); la = arr(img(a).resize((lw, lh), Image.LANCZOS))
LX, LY = 22, 18
card[LY:LY + lh, LX:LX + lw] = card[LY:LY + lh, LX:LX + lw] * (1 - la[..., None]) + lc * la[..., None]

cream = [1.0, 0.95, 0.84]
card = stripes(card, 560, W, 70, 9, 7)
card = paint(card, text_mask(W, H, (968, 112), 'MEMBER', font('russo-one', 74), 'ra', skew=0.18), cream)
card = paint(card, text_mask(W, H, (968, 196), 'C A R D', font('russo-one', 30), 'ra', skew=0.18), [1.0, 0.82, 0.25])
card = paint(card, text_mask(W, H, (968, 246), 'Rent it. Watch it. Rewind it.', font('archivo-black', 21), 'ra'), cream, 0.75)
card = stripes(card, 0, W, 392, 4, 5, taper=False)

# barcode panel bottom right
BX, BY, BW, BH = 676, 470, 300, 124
panel = np.zeros((H, W), np.float32); panel[BY:BY + BH, BX:BX + BW] = 1
card = paint(card, panel, [0.95, 0.93, 0.88])
# the bars themselves are drawn in HTML from the member number
card = paint(card, text_mask(W, H, (BX + BW / 2, BY + BH - 10), 'GALAXY VIDEO MEMBER', font('archivo-black', 15), 'ms'), [0.1, 0.1, 0.12])
card = paint(card, text_mask(W, H, (40, 618), 'Card remains the property of Galaxy Video. Show it every time you hire.', font('archivo-black', 14), 'ls'), cream, 0.45)

# signature strip: off-white panel with a faint security pattern
SX, SY, SW, SH = 600, 296, 376, 62
sp_ = np.zeros((H, W), np.float32); sp_[SY:SY + SH, SX:SX + SW] = 1
card = paint(card, sp_, [0.93, 0.91, 0.86])
pat = ((((xx - yy) % 14) < 2) | (((xx + yy) % 14) < 1)).astype(np.float32) * sp_
card = paint(card, pat, [0.80, 0.70, 0.86], 0.45)
card = paint(card, text_mask(W, H, (SX + 8, SY + SH - 7), 'AUTHORISED SIGNATURE', font('archivo-black', 11), 'ls'), [0.45, 0.35, 0.5], 0.8)
# wear: worn print, rubbed edges, fine scratches, gloss sheen, grain
card *= (0.94 + 0.10 * smooth_noise(H, W, 30, 1))[..., None]
edge = np.minimum.reduce([xx, W - 1 - xx, yy, H - 1 - yy])
rub = np.clip(1 - edge / 10, 0, 1) * (0.5 + 0.5 * smooth_noise(H, W, 6, 2))
card = card + rub[..., None] * 0.08
card = card + scratches(H, W, 120, 3, 0.055)[..., None]
card = card + (np.clip(1 - np.abs((xx / W) * 0.7 + (yy / H) - 0.55) * 5, 0, 1) * 0.06)[..., None]
card = blur(card, 0.45) + rng.normal(0, 1.6 / 255, card.shape)
alpha = round_alpha(W, H, 36)
out = np.dstack([np.clip(card, 0, 1), alpha])
Image.fromarray((out * 255).astype(np.uint8), 'RGBA').save(REPO + 'assets/brand/member-card.webp', 'WEBP', quality=86)
Image.fromarray((out * 255).astype(np.uint8), 'RGBA').save(SP + 'member-card.png')

# ---------------------------------------------------------------- hire case sticker
W, H = 600, 420
yy, xx = np.mgrid[0:H, 0:W].astype(np.float32)
paper = np.array([0.95, 0.92, 0.83], np.float32) * np.ones((H, W, 3), np.float32)
paper *= (0.96 + 0.06 * smooth_noise(H, W, 3, 7))[..., None]
BAND = 214
band = np.zeros((H, W), np.float32); band[0:BAND] = 1
paper = paint(paper, band, BG_IN * 1.2)
crop, a = logo_cut(tagline=False)
lh = BAND - 16; lw = int(crop.shape[1] * lh / crop.shape[0])
lc = arr(img(crop).resize((lw, lh), Image.LANCZOS)); la = arr(img(a).resize((lw, lh), Image.LANCZOS))
LX = (W - lw) // 2
paper[8:8 + lh, LX:LX + lw] = paper[8:8 + lh, LX:LX + lw] * (1 - la[..., None]) + lc * la[..., None]
paper = stripes(paper, 0, W, BAND, 7, 0, taper=False)
red = [0.78, 0.07, 0.17]; ink = [0.16, 0.12, 0.2]
paper = paint(paper, text_mask(W, H, (W / 2, 286), 'PLEASE BE KIND, REWIND', font('archivo-black', 38), 'ms'), red)
paper = paint(paper, text_mask(W, H, (W / 2, 322), 'Late fee $1 a day. No drop box after 10pm.', font('archivo-black', 17), 'ms'), ink, 0.85)
paper = paint(paper, text_mask(W, H, (34, 392), 'STOCK No.', font('archivo-black', 22), 'ls'), ink)
line = np.zeros((H, W), np.float32); line[394:397, 178:566] = 1
paper = paint(paper, line, ink, 0.7)
# wear: faded ink, dirty edges, scuffs, a corner lifting
paper *= (0.93 + 0.09 * smooth_noise(H, W, 25, 8))[..., None]
edge = np.minimum.reduce([xx, W - 1 - xx, yy, H - 1 - yy])
dirt = np.clip(1 - edge / 18, 0, 1) * (0.4 + 0.6 * smooth_noise(H, W, 5, 9))
paper = paper * (1 - dirt[..., None] * np.array([0.22, 0.26, 0.34]))
paper = paper + scratches(H, W, 40, 10, 0.05)[..., None]
lift = np.clip(1 - ((W - xx) + yy) / 70, 0, 1)                      # top right corner peeling up
paper = paper * (1 - lift[..., None] * 0.25) + lift[..., None] * np.array([0.22, 0.2, 0.17])
paper = blur(paper, 0.5) + rng.normal(0, 1.8 / 255, paper.shape)
alpha = round_alpha(W, H, 12)
cut = ((W - xx) + yy) < 26                                         # the very tip has torn off
alpha[cut] = 0
out = np.dstack([np.clip(paper, 0, 1), alpha])
Image.fromarray((out * 255).astype(np.uint8), 'RGBA').save(REPO + 'assets/brand/case-sticker.webp', 'WEBP', quality=86)
Image.fromarray((out * 255).astype(np.uint8), 'RGBA').save(SP + 'case-sticker.png')
print('done')
