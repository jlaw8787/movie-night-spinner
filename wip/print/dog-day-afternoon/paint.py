"""Paints the printed safety tint and the soft wear for the savings deposit ticket
(Dog Day Afternoon, Brooklyn, August 22, 1972).
Bank forms of the period were printed on pale green safety paper: a fine wavy tint
that shows any erasure, plus a faint rosette. The wear is a sheet torn off a pad,
carried around a hot bank lobby all afternoon: padding gum on the top edge, soft
yellowing at the edges, a damp thumb mark. All at 2x page pixels (528 x 816 css px).
Writes assets/paper-safety-front.png, assets/paper-safety-back.png,
assets/wear-front.png, assets/wear-back.png, assets/stamp-wear.png."""
import os, math, shutil
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
os.makedirs(A, exist_ok=True)
W, H = 1056, 1632
rng = np.random.default_rng(1972)

BASE = np.array([228, 236, 223], float)   # pale green safety stock
LINE = np.array([206, 222, 203], float)   # tint line, low contrast so type stays crisp


def soft_noise(w, h, scale, seed):
    r = np.random.default_rng(seed)
    sw, sh = max(2, w // scale), max(2, h // scale)
    n = Image.fromarray((r.random((sh, sw)) * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC)
    n = n.filter(ImageFilter.GaussianBlur(scale / 2))
    a = np.asarray(n, float) / 255.0
    return (a - a.min()) / (a.max() - a.min() + 1e-9)


def safety(seed):
    y, x = np.mgrid[0:H, 0:W].astype(float)
    # two crossing families of fine waves, the classic check-paper weave
    w1 = np.sin((y + 7 * np.sin(x / 38.0)) / 4.2 * math.pi)
    w2 = np.sin((y - 9 * np.sin(x / 61.0 + 1.3)) / 5.6 * math.pi)
    t = np.clip((w1 > 0.86) * 0.65 + (w2 > 0.9) * 0.45, 0, 1)
    # faint rosette in the middle of the sheet
    cx, cy = W / 2, H * 0.52
    r = np.hypot(x - cx, y - cy)
    th = np.arctan2(y - cy, x - cx)
    ros = np.zeros_like(r)
    for k, (rad, lobes) in enumerate(((150, 18), (205, 24), (260, 30))):
        rr = rad + 14 * np.sin(lobes * th + k)
        ros = np.maximum(ros, np.clip(1 - np.abs(r - rr) / 1.6, 0, 1))
    t = np.clip(t * 0.8 + ros * 0.55, 0, 1)
    # printing never lays down perfectly even: big soft variation in tint density
    t *= 0.7 + 0.3 * soft_noise(W, H, 160, seed)
    img = BASE[None, None, :] * (1 - t[..., None]) + LINE[None, None, :] * t[..., None]
    return Image.fromarray(img.astype(np.uint8), 'RGB')


def wear(seed, thumb):
    a = np.zeros((H, W), float)
    col = np.zeros((H, W, 3), float)
    y, x = np.mgrid[0:H, 0:W].astype(float)
    # edge yellowing, soft and uneven
    d = np.minimum.reduce([x, y, W - 1 - x, H - 1 - y])
    edge = np.clip(1 - d / 70.0, 0, 1) ** 2 * (0.6 + 0.4 * soft_noise(W, H, 90, seed + 1))
    a += edge * 0.22
    col += np.array([150, 140, 90]) * 1.0
    # broad gentle mottling, like a sheet handled with damp hands on a hot day
    mot = soft_noise(W, H, 220, seed + 2)
    a += np.clip(mot - 0.55, 0, 1) * 0.12
    # damp thumb mark
    tx, ty, rx, ry = thumb
    th = np.clip(1 - np.hypot((x - tx) / rx, (y - ty) / ry), 0, 1) ** 1.6
    a += th * 0.10
    # padding gum along the top edge where the sheet tore off the pad
    edge_y = 9 + 3 * soft_noise(W, 1, 40, seed + 3)[0] * 2
    gum = (y < edge_y[None, :]).astype(float)
    gum = np.asarray(Image.fromarray((gum * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2)), float) / 255
    out = np.zeros((H, W, 4), float)
    out[..., :3] = col
    out[..., 3] = np.clip(a, 0, 0.4) * 255
    gcol = np.array([168, 92, 70], float)
    out[..., :3] = out[..., :3] * (1 - gum[..., None]) + gcol * gum[..., None]
    out[..., 3] = np.maximum(out[..., 3], gum * 0.5 * 255)
    return Image.fromarray(out.astype(np.uint8), 'RGBA')


def stamp_wear():
    # paper showing through a rubber stamp: soft blotches, not pixel noise
    w, h = 480, 220
    n = soft_noise(w, h, 14, 822)
    m = np.clip((n - 0.62) * 3.0, 0, 1)
    edge = soft_noise(w, h, 60, 823)
    m = np.clip(m + np.clip(edge - 0.7, 0, 1) * 1.5, 0, 0.85)
    out = np.zeros((h, w, 4), np.uint8)
    out[..., :3] = BASE.astype(np.uint8)
    out[..., 3] = (m * 255).astype(np.uint8)
    return Image.fromarray(out, 'RGBA').filter(ImageFilter.GaussianBlur(1.0))


safety(11).save(os.path.join(A, 'paper-safety-front.png'), optimize=True)
safety(12).save(os.path.join(A, 'paper-safety-back.png'), optimize=True)
wear(21, (860, 1460, 70, 90)).save(os.path.join(A, 'wear-front.png'), optimize=True)
wear(22, (170, 1480, 70, 90)).save(os.path.join(A, 'wear-back.png'), optimize=True)
stamp_wear().save(os.path.join(A, 'stamp-wear.png'), optimize=True)
shutil.copy(os.path.join(D, '..', 'jurassic', 'src', 'assets', 'paper-grain.png'), os.path.join(A, 'paper-grain.png'))
print('painted')


# ---------------- printed art, in the bank's green spot ink ----------------
GREEN = (31, 86, 62)


def engrave(tone, orient, pitch=3.4, outline=None):
    """tone 0..1 (1 = darkest) -> line-engraved ink mask. orient: 0 horizontal lines, 1 vertical.
    Line thickness swells with tone, the way a banknote or bank-form vignette is cut."""
    h, w = tone.shape
    y, x = np.mgrid[0:h, 0:w].astype(float)
    dh = np.abs(((y + 0.6 * np.sin(x / 23.0)) % pitch) - pitch / 2)
    dv = np.abs((x % pitch) - pitch / 2)
    dist = np.where(orient > 0.5, dv, dh)
    half = tone * pitch * 0.55
    ink = np.clip((half - dist) * 1.6 + 0.5, 0, 1) * (tone > 0.04)
    if outline is not None:
        ink = np.maximum(ink, outline)
    return ink


def vignette(wc, hc):
    """Engraved oval vignette of the bank's main office, a domed granite savings bank,
    drawn at 4x of the 2x page pixels then reduced."""
    S = 8  # px per css px in the working canvas
    w, h = wc * S, hc * S
    tone = Image.new('F', (w, h), 0.0)
    ori = Image.new('L', (w, h), 0)
    ol = Image.new('L', (w, h), 0)
    T = ImageDraw.Draw(tone); O = ImageDraw.Draw(ori); L = ImageDraw.Draw(ol)
    u = lambda *v: [int(round(a * S)) for a in v]
    cx = wc / 2
    # sky, darker toward the top like a cut sky
    arr = np.zeros((h, w), np.float32)
    yy = np.arange(h)[:, None] / h
    arr += np.clip(0.34 - yy * 0.9, 0, 0.34)
    tone = Image.fromarray(arr, 'F'); T = ImageDraw.Draw(tone)
    # trees left and right, dark soft masses
    tr = np.zeros((h, w), np.float32)
    n = soft_noise(w, h, 22 * S // 4, 77)
    for (tx, ty, rx, ry) in ((16, 70, 24, 30), (wc - 16, 72, 24, 30)):
        yy2, xx2 = np.mgrid[0:h, 0:w]
        dd = np.hypot((xx2 / S - tx) / rx, (yy2 / S - ty) / ry)
        tr = np.maximum(tr, np.clip((1.0 - dd) * 3 + (n - 0.5) * 1.6, 0, 1) * (0.55 + 0.3 * n))
    arr = np.maximum(np.asarray(tone), tr)
    tone = Image.fromarray(arr.astype(np.float32), 'F'); T = ImageDraw.Draw(tone)
    # dome and drum
    T.rectangle(u(cx - 22, 20, cx + 22, 34), fill=0.16)
    T.pieslice(u(cx - 22, 2, cx + 22, 40), 180, 360, fill=0.12)
    T.pieslice(u(cx + 2, 2, cx + 22, 40), 270, 360, fill=0.4)
    T.rectangle(u(cx - 3, -1, cx + 3, 4), fill=0.5)
    L.arc(u(cx - 22, 2, cx + 22, 40), 180, 360, fill=255, width=S)
    for k in range(-3, 4):
        T.line(u(cx + k * 6, 21, cx + k * 6, 34), fill=0.65, width=S)
    # main block behind the portico
    T.rectangle(u(cx - 62, 34, cx + 62, 100), fill=0.1)
    for cy_ in range(38, 100, 5):
        T.line(u(cx - 62, cy_, cx + 62, cy_), fill=0.45, width=max(1, S // 3))
    L.rectangle(u(cx - 62, 34, cx + 62, 100), outline=255, width=S)
    # side windows
    for wx in (cx - 54, cx - 44, cx + 38, cx + 48):
        T.rectangle(u(wx, 52, wx + 6, 76), fill=0.8)
    # pediment
    T.polygon(u(cx - 42, 44, cx, 28, cx + 42, 44), fill=0.2)
    T.polygon(u(cx - 34, 42, cx, 32, cx + 34, 42), fill=0.42)
    L.line(u(cx - 44, 44, cx, 27, cx + 44, 44), fill=255, width=S)
    # entablature
    T.rectangle(u(cx - 44, 44, cx + 44, 52), fill=0.08)
    T.rectangle(u(cx - 44, 51, cx + 44, 53), fill=0.85)
    # dark portico behind the columns
    T.rectangle(u(cx - 40, 53, cx + 40, 90), fill=0.86)
    # door
    T.rectangle(u(cx - 7, 66, cx + 7, 90), fill=1.0)
    # six columns, shaded like cylinders, cut with vertical lines
    cols = [cx - 36 + i * 14.4 for i in range(6)]
    carr = np.asarray(tone).copy()
    oarr = np.asarray(ori).copy()
    for c in cols:
        x0, x1 = int((c - 4) * S), int((c + 4) * S)
        y0, y1 = int(53 * S), int(90 * S)
        t = (np.arange(x0, x1) - x0) / (x1 - x0)
        prof = 0.12 + 0.55 * np.clip(np.abs(t - 0.32) * 1.6, 0, 1) ** 1.4
        carr[y0:y1, x0:x1] = prof[None, :]
        oarr[y0:y1, x0:x1] = 255
    tone = Image.fromarray(carr, 'F'); T = ImageDraw.Draw(tone)
    ori = Image.fromarray(oarr, 'L')
    for c in cols:
        L.line(u(c - 4, 53, c - 4, 90), fill=255, width=max(1, S // 2))
        L.line(u(c + 4, 53, c + 4, 90), fill=255, width=S)
        T.rectangle(u(c - 5, 51, c + 5, 54), fill=0.3)
        T.rectangle(u(c - 5, 89, c + 5, 91), fill=0.35)
    # steps
    for i, (yy0, inset) in enumerate(((90, 46), (94, 52), (98, 58))):
        T.rectangle(u(cx - inset, yy0, cx + inset, yy0 + 4), fill=0.18 + 0.12 * (i % 2))
        L.line(u(cx - inset, yy0 + 4, cx + inset, yy0 + 4), fill=255, width=max(1, S // 2))
    # pavement
    T.rectangle(u(0, 102, wc, hc), fill=0.3)
    tone_a = np.asarray(tone, float)
    ink = engrave(tone_a, np.asarray(ori, float) / 255.0, pitch=2.6 * S / 2, outline=np.asarray(ol, float) / 255.0)
    # oval vignette: lines thin out toward the oval edge
    yy, xx = np.mgrid[0:h, 0:w]
    dd = np.hypot((xx - w / 2) / (w / 2), (yy - h / 2) / (h / 2))
    fade = np.clip((1.0 - dd) / 0.12, 0, 1)
    ink *= fade
    m = Image.fromarray((np.clip(ink, 0, 1) * 255).astype(np.uint8)).resize((wc * 2, hc * 2), Image.LANCZOS)
    out = Image.new('RGBA', m.size, GREEN + (0,))
    out.putalpha(m)
    return out


def frame(wc, hc, seed):
    """Lathe-work border, the scalloped cycloid band on bank paper, plus a hairline inside it."""
    w, h = wc * 2, hc * 2
    m = np.zeros((h, w), float)
    y, x = np.mgrid[0:h, 0:w].astype(float)
    o0, o1 = 18 * 2, 30 * 2   # band from 18 to 30 css px inside the trim
    d = np.minimum.reduce([x, y, w - 1 - x, h - 1 - y])
    inband = (d >= o0) & (d <= o1)
    # coordinate running along the band
    s = np.where((d == y) | (d == h - 1 - y), x, y)
    t = (d - o0) / (o1 - o0)  # 0..1 across the band
    band = np.zeros_like(m)
    for k, ph in enumerate((0, 2.1, 4.2)):
        curve = 0.5 + 0.45 * np.sin(s / 9.0 + ph)
        band = np.maximum(band, np.clip(1 - np.abs(t - curve) * (o1 - o0) / 1.6, 0, 1))
    band = np.maximum(band, np.clip(1 - np.abs(d - o0) / 1.0, 0, 1))
    band = np.maximum(band, np.clip(1 - np.abs(d - o1) / 1.0, 0, 1))
    m = np.where((d >= o0 - 1) & (d <= o1 + 1), band, 0)
    # hairline rule inside
    m = np.maximum(m, np.clip(1 - np.abs(d - (o1 + 5)) / 0.8, 0, 1) * 0.9)
    # ink spread variation, soft
    m *= 0.8 + 0.2 * soft_noise(w, h, 120, seed)
    out = Image.new('RGBA', (w, h), GREEN + (0,))
    out.putalpha(Image.fromarray((np.clip(m, 0, 1) * 255).astype(np.uint8)))
    return out


vignette(160, 108).save(os.path.join(A, 'bank-vignette.png'), optimize=True)
frame(528, 816, 31).save(os.path.join(A, 'frame-front.png'), optimize=True)
frame(528, 816, 32).save(os.path.join(A, 'frame-back.png'), optimize=True)
print('art painted')
