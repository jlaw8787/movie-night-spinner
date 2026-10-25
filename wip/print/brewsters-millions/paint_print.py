"""Paints every print layer for The Vandermeer in-suite dining card (US letter, 1985).

The card is heavy ivory board, offset printed in black and a burgundy second ink, with a solid
black flood across the head of each face and gold foil stamped into that flood. The front carries
a line engraving of the hotel at dusk, stamped in foil: tone is made by engraved lines that swell
where the stone is lit, lit windows stamp solid, dark ones drop out to the black. The building is a
flat roofed limestone palazzo with a deep cornice, rusticated base and corner quoins, a roof loggia,
a long canopy to the curb. No mansard, no turrets, no green roof.

Writes (all at 2x):
  assets/flood-front.png   816 x 452  black flood, foil frame, foil engraving, foil wordmark
  assets/flood-back.png    816 x 128  black flood, foil frame, foil wordmark
  assets/paper-emboss-front.png / paper-emboss-back.png   blind embossed frame on the ivory
  assets/paper-ink-front.png / paper-ink-back.png          soft uneven ink take over the ivory
  assets/wear-front.png / wear-back.png                    rubbed corners, edge toning, handling
  assets/stain-ring.png                                    champagne flute ring
  assets/sticker-vote.png                                  vinyl campaign sticker, corner lifting
"""
import os, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
F = os.path.join(D, 'fonts')
S = 2                      # paint at 2x
W, H = 816, 1056
FLOOD_F, FLOOD_B = 452, 128
rng = np.random.default_rng(1985)


def lowfreq(h, w, cells, seed):
    r = np.random.default_rng(seed)
    g = r.standard_normal((cells, max(2, int(cells * w / h) + 1))).astype(np.float32)
    return np.asarray(Image.fromarray(g, mode='F').resize((w, h), Image.BICUBIC))


# ---------------------------------------------------------------- foil and flood
def foil(mask, seed):
    """Gold foil from a 0..1 mask: uneven sheen, a little emboss on the edges, small breaks."""
    h, w = mask.shape
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    sheen = 0.86 + 0.16 * np.sin((xx * 0.8 + yy) / 210.0 + 0.6) + 0.07 * lowfreq(h, w, 6, seed)
    sheen += rng.normal(0, 0.035, (h, w)).astype(np.float32)
    # emboss: light from top left
    mb = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.4))).astype(np.float32) / 255
    gy, gx = np.gradient(mb)
    shade = np.clip(-(gx + gy) * 2.2, -0.35, 0.45)
    f = np.clip(sheen + shade, 0.45, 1.35)
    base = np.array([190, 152, 78], np.float32)
    hi = np.array([246, 222, 160], np.float32)
    t = np.clip((f - 0.9) / 0.45, 0, 1)[..., None]
    col = base * np.minimum(f, 1.0)[..., None] * (1 - t) + hi * t
    # foil breaks: tiny pinholes where the foil did not lift cleanly
    holes = (rng.random((h, w)) < 0.0018).astype(np.float32)
    holes = np.asarray(Image.fromarray((holes * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.9))).astype(np.float32) / 255
    a = np.clip(mask * (1 - np.clip(holes * 3.0, 0, 0.85)), 0, 1)
    return col, a


def flood(h, w, seed):
    """Offset solid black on ivory board: never a perfect flat black."""
    m = lowfreq(h, w, 7, seed) * 3.2 + lowfreq(h, w, 18, seed + 1) * 1.6
    rgb = np.empty((h, w, 3), np.float32)
    rgb[...] = np.array([24, 21, 25], np.float32)
    rgb += m[..., None]
    rgb += rng.normal(0, 1.4, (h, w, 1)).astype(np.float32)
    return rgb


def comp(rgb, col, a):
    return rgb * (1 - a[..., None]) + col * a[..., None]


def text_mask(size, txt, font, px, track=0.0, anchor_xy=(0, 0), align='center', canvas=None):
    """Draws tracked text into a mask image (L) and returns it."""
    fnt = ImageFont.truetype(font, int(px * S))
    im = canvas if canvas is not None else Image.new('L', size, 0)
    d = ImageDraw.Draw(im)
    pre = [d.textlength(txt[:i], font=fnt) for i in range(len(txt) + 1)]
    total = pre[-1] + track * px * S * (len(txt) - 1)
    x, y = anchor_xy
    if align == 'center':
        x -= total / 2
    elif align == 'right':
        x -= total
    for i, c in enumerate(txt):
        kern = sum(-0.13 * px * S for j in range(i) if txt[j:j + 2] in ('VA', 'AV'))
        d.text((x + pre[i] + i * track * px * S + kern, y), c, font=fnt, fill=255, anchor='ls')
    return im


def rule_mask(im, x0, y0, x1, y1, wpx):
    d = ImageDraw.Draw(im)
    d.rectangle([x0 * S, y0 * S, x1 * S, y1 * S], outline=255, width=int(round(wpx * S)))


def diamond(im, cx, cy, r):
    ImageDraw.Draw(im).polygon([(cx * S, (cy - r) * S), ((cx + r) * S, cy * S), (cx * S, (cy + r) * S), ((cx - r) * S, cy * S)], fill=255)


# ---------------------------------------------------------------- the engraving
AX, AY, AW, AH = 64, 44, 688, 276            # art box inside the front flood, CSS px


def engraving():
    """Returns a 0..1 mask (2x) of the engraved facade, art box size."""
    w, h = AW * S, AH * S
    tone = Image.new('F', (w, h), 0.0)
    orient = Image.new('L', (w, h), 0)        # 0 horizontal lines, 1 vertical, 2 diagonal
    line = Image.new('L', (w, h), 0)          # contour strokes
    T, O, L = ImageDraw.Draw(tone), ImageDraw.Draw(orient), ImageDraw.Draw(line)
    r = np.random.default_rng(7)

    def R(x0, y0, x1, y1, t, o=0):
        T.rectangle([x0 * S, y0 * S, x1 * S - 1, y1 * S - 1], fill=float(t))
        O.rectangle([x0 * S, y0 * S, x1 * S - 1, y1 * S - 1], fill=o)

    def ln(pts, wd=1.0):
        L.line([(x * S, y * S) for x, y in pts], fill=255, width=max(1, int(round(wd * S))))

    # sky: a faint dusk glow low behind the roofs
    for y in range(0, 236, 2):
        g = max(0.0, (y - 40) / 200) ** 1.6 * 0.20
        T.rectangle([0, y * S, w, (y + 2) * S], fill=g)

    # ---- left neighbour: older, lower, darker brick
    R(0, 88, 120, 236, 0.24)
    R(0, 82, 124, 88, 0.85)                    # its cornice lip
    R(0, 88, 124, 92, 0.10)
    for fy in range(98, 220, 16):
        for fx in range(8, 116, 22):
            lit = r.random() < 0.35
            R(fx, fy, fx + 11, fy + 10, 1.0 if lit else 0.0)
    # ---- right neighbour: taller prewar office block, setback crown
    R(552, 50, 688, 236, 0.22, 0)
    R(590, 30, 688, 50, 0.22, 0)
    R(548, 46, 688, 50, 0.85); R(586, 26, 688, 30, 0.85)
    for fy in range(58, 226, 13):
        for fx in range(560, 684, 15):
            if fy < 50:
                continue
            lit = r.random() < 0.28
            R(fx, fy, fx + 8, fy + 8, 1.0 if lit else 0.0)
    for fy in range(36, 48, 12):
        for fx in range(596, 684, 15):
            R(fx, fy, fx + 8, fy + 7, 1.0 if r.random() < 0.4 else 0.0)

    # ---- the hotel
    bx0, bx1 = 132, 548
    # roof loggia: a colonnaded penthouse in the centre, with a flagpole
    R(272, 6, 408, 22, 0.62)
    R(268, 2, 412, 6, 0.95)
    for cx in range(278, 404, 12):
        R(cx, 8, cx + 7, 21, 1.0 if r.random() < 0.6 else 0.15)
        R(cx + 7, 8, cx + 12, 21, 0.75, 1)       # little columns
    ln([(340, 2), (340, -13)], 0.8)
    T.polygon([(341 * S, -13 * S), (356 * S, -10 * S), (341 * S, -6 * S)], fill=0.9)

    # main shaft wall
    R(bx0, 22, bx1, 236, 0.31)
    # cornice: lit top, dentils, deep soffit shadow
    R(bx0 - 8, 22, bx1 + 8, 27, 1.0)
    for dx in range(bx0 - 8, bx1 + 8, 5):
        R(dx, 27, dx + 3, 31, 0.95); R(dx + 3, 27, dx + 5, 31, 0.15)
    R(bx0 - 4, 31, bx1 + 4, 37, 0.12)
    # attic storey with small square windows between paired brackets
    R(bx0, 37, bx1, 52, 0.30)
    bays = 13
    bw = (bx1 - bx0) / bays
    for i in range(bays):
        x = bx0 + i * bw + bw / 2
        R(x - 4, 40, x + 4, 49, 1.0 if r.random() < 0.5 else 0.0)
        R(bx0 + i * bw - 1, 37, bx0 + i * bw + 2, 52, 0.95, 1)
    R(bx0, 52, bx1, 55, 0.95)                    # band under the attic
    # seven guest floors
    floors = [56 + k * 13.5 for k in range(7)]
    for k, fy in enumerate(floors):
        for i in range(bays):
            x = bx0 + i * bw + bw / 2
            wx0, wx1 = x - 7.5, x + 7.5
            wy0, wy1 = fy + 3, fy + 11.5
            roll = r.random()
            if roll < 0.46:                      # lit, curtains open
                R(wx0, wy0, wx1, wy1, 1.0)
                R(x - 0.5, wy0, x + 0.5, wy1, 0.0); R(wx0, wy0 + 3.6, wx1, wy0 + 4.4, 0.0)
            elif roll < 0.64:                    # lit with the shade half drawn
                R(wx0, wy0, wx1, wy1, 1.0)
                R(wx0, wy0, wx1, wy0 + (2.5 + r.random() * 4), 0.30)
                R(x - 0.5, wy0, x + 0.5, wy1, 0.0)
            elif roll < 0.74:                    # curtains drawn, warm glow through
                R(wx0, wy0, wx1, wy1, 0.55, 1)
            else:                                # dark
                R(wx0, wy0, wx1, wy1, 0.0)
            R(wx0 - 1, wy1, wx1 + 1, wy1 + 1.3, 0.98)   # sill
            if k in (0, 3):                      # pediment caps on two floors
                R(wx0 - 1, wy0 - 2.2, wx1 + 1, wy0 - 0.8, 0.98)
    # balcony course with balustrade over the base
    R(bx0 - 4, 152, bx1 + 4, 157, 1.0)
    R(bx0, 157, bx1, 163, 0.12)
    for dx in np.arange(bx0 + 2, bx1 - 2, 4.0):
        R(dx, 157.5, dx + 2.2, 162.5, 0.92, 1)
    R(bx0 - 4, 163, bx1 + 4, 165, 0.95)
    # corner quoins, alternating long and short blocks
    for qx in (bx0, bx1 - 12):
        y = 37
        n = 0
        while y < 152:
            ww = 12 if n % 2 == 0 else 8
            xs = qx if qx == bx0 else bx1 - ww
            R(xs, y, xs + ww, y + 6.5, 0.92, 1)
            R(xs, y + 6.5, xs + ww, y + 7.6, 0.10)
            y += 7.6; n += 1
    # rusticated base, two storeys
    R(bx0, 165, bx1, 236, 0.52)
    for jy in np.arange(170, 236, 6.0):
        R(bx0, jy, bx1, jy + 1.1, 0.08)
    # arched windows: six each side of the door
    def arch(x0, x1, y0, y1, t):
        T.rectangle([x0 * S, (y0 + (x1 - x0) / 2) * S, x1 * S - 1, y1 * S - 1], fill=t)
        T.pieslice([x0 * S, y0 * S, x1 * S - 1, (y0 + (x1 - x0)) * S], 180, 360, fill=t)
        O.rectangle([x0 * S, y0 * S, x1 * S, y1 * S], fill=0)
    ax = [148, 176, 204, 232, 260, 288, 372, 400, 428, 456, 484, 512]
    for x in ax:
        arch(x - 2, x + 18, 176, 230, 0.08)              # reveal
        arch(x, x + 16, 178, 229, 1.0)
        R(x + 7.5, 186, x + 8.5, 229, 0.0); R(x, 200, x + 16, 201, 0.0); R(x, 214, x + 16, 215, 0.0)
        R(x + 6, 174, x + 10, 179, 0.98, 1)              # keystone
    # the entrance: tall double doors under a lit fanlight
    arch(318, 362, 172, 236, 0.06)
    arch(322, 358, 176, 236, 1.0)
    R(339.5, 196, 340.5, 236, 0.0)
    for gy in (206, 220):
        R(322, gy, 358, gy + 1, 0.0)
    # canopy to the curb, seen side on: lit top edge, diagonal stripes, scalloped valance
    R(304, 190, 376, 200, 0.55, 2)
    R(302, 188, 378, 190.5, 1.0)
    for sx in range(304, 376, 6):
        T.pieslice([sx * S, 197 * S, (sx + 6) * S, 205 * S], 0, 180, fill=0.85)
    for px in (306, 374):
        R(px - 0.8, 200, px + 0.8, 236, 0.98, 1)
    # carriage lamps on the base piers
    for lx in (302, 380):
        R(lx - 2, 182, lx + 2, 188, 1.0)
    # sidewalk and curb
    R(0, 236, AW, 240, 0.42)
    R(0, 240, AW, 242.5, 0.98)                           # curb edge catches the light
    R(0, 242.5, AW, AH, 0.14)
    # light spill on the pavement under the canopy
    for i in range(10):
        T.ellipse([(300 - i * 4) * S, (237 + i * 0.3) * S, (380 + i * 4) * S, (241 + i * 0.6) * S], fill=0.42 + 0.05 * (10 - i))

    # ---- bishop's crook street lamps
    for lx, flip in ((96, 1), (584, -1)):
        R(lx - 1.4, 112, lx + 1.4, 240, 0.98, 1)
        R(lx - 4, 232, lx + 4, 240, 0.95, 1)
        L.arc([(lx - (0 if flip > 0 else 22)) * S, 102 * S, (lx + (22 if flip > 0 else 0)) * S, 124 * S],
              180, 360, fill=255, width=int(2.4 * S))
        hx = lx + 11 * flip + (11 * flip)
        R(hx - 4, 113, hx + 4, 122, 1.0)
        ln([(hx - 5, 113), (hx + 5, 113)], 1.2)

    # ---- the limousine at the curb: boxy 1980s stretch sedan, side elevation
    cx0, cx1, cy = 150, 312, 244
    body = [(cx0, cy - 4), (cx0 + 2, cy - 15), (cx0 + 30, cy - 17), (cx1 - 22, cy - 17), (cx1 - 1, cy - 14), (cx1, cy - 4)]
    T.polygon([(x * S, y * S) for x, y in body] + [(cx1 * S, (cy - 2) * S), (cx0 * S, (cy - 2) * S)], fill=0.07)
    L.line([(x * S, y * S) for x, y in body] + [(cx1 * S, (cy - 2) * S), (cx0 * S, (cy - 2) * S), (cx0 * S, (cy - 4) * S)], fill=255, width=int(1.1 * S))
    T.polygon([((cx0 + 40) * S, (cy - 17) * S), ((cx0 + 50) * S, (cy - 27) * S), ((cx1 - 54) * S, (cy - 27) * S),
               ((cx1 - 40) * S, (cy - 17) * S)], fill=0.04)
    for wx in range(cx0 + 52, cx1 - 58, 18):            # long run of side glass
        R(wx, cy - 25, wx + 15, cy - 19, 0.0)
        R(wx + 2, cy - 24, wx + 5, cy - 20, 0.7, 2)
    ln([(cx0 + 2, cy - 15), (cx0 + 30, cy - 17), (cx1 - 22, cy - 17), (cx1 - 1, cy - 14)], 1.0)   # beltline glint
    ln([(cx0 + 40, cy - 17), (cx0 + 50, cy - 27), (cx1 - 54, cy - 27), (cx1 - 40, cy - 17)], 0.9)
    ln([(cx0, cy - 6), (cx0 + 10, cy - 6)], 1.6); ln([(cx1 - 10, cy - 6), (cx1, cy - 6)], 1.6)      # chrome bumpers
    ln([(cx0 + 2, cy - 11), (cx0 + 6, cy - 11)], 2.0)  # headlamp
    for wx in (cx0 + 22, cx1 - 26):
        T.ellipse([(wx - 7) * S, (cy - 8) * S, (wx + 7) * S, (cy + 6) * S], fill=0.03)
        L.ellipse([(wx - 7) * S, (cy - 8) * S, (wx + 7) * S, (cy + 6) * S], outline=255, width=S)
        L.ellipse([(wx - 3) * S, (cy - 4) * S, (wx + 3) * S, (cy + 2) * S], outline=255, width=S)

    # ---- a checker cab pulling away on the right: rounded roof, roof light
    kx0, kx1 = 432, 510
    T.polygon([(x * S, y * S) for x, y in [(kx0, cy - 3), (kx0 + 1, cy - 13), (kx0 + 16, cy - 15), (kx1 - 6, cy - 15), (kx1, cy - 11), (kx1, cy - 3)]], fill=0.55)
    T.rounded_rectangle([(kx0 + 18) * S, (cy - 27) * S, (kx1 - 12) * S, (cy - 15) * S], radius=5 * S, fill=0.5)
    O.rectangle([kx0 * S, (cy - 30) * S, kx1 * S, cy * S], fill=1)
    R(kx0 + 22, cy - 25, kx0 + 37, cy - 17, 0.05); R(kx0 + 40, cy - 25, kx1 - 16, cy - 17, 0.05)
    R(kx0 + 34, cy - 31, kx0 + 46, cy - 27, 1.0)
    ln([(kx0 + 1, cy - 13), (kx0 + 16, cy - 15), (kx1 - 6, cy - 15), (kx1, cy - 11)], 1.0)
    for wx in (kx0 + 14, kx1 - 14):
        T.ellipse([(wx - 6) * S, (cy - 7) * S, (wx + 6) * S, (cy + 5) * S], fill=0.03)
        L.ellipse([(wx - 6) * S, (cy - 7) * S, (wx + 6) * S, (cy + 5) * S], outline=255, width=S)

    # building silhouette contours
    ln([(bx0 - 8, 22), (bx1 + 8, 22)], 1.0)
    ln([(bx0, 37), (bx0, 236)], 0.9); ln([(bx1, 37), (bx1, 236)], 0.9)

    # ---- lines from tone
    t = np.asarray(tone, np.float32).clip(0, 1)
    o = np.asarray(orient)
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    P = 5.2                                                  # line pitch at 2x, about 37 lines per inch
    wob = 0.30 * np.sin(xx / 41.0 + yy / 90.0) + 0.18 * np.sin(xx / 13.0 + yy / 57.0)
    ch = (yy + wob) % P; cv = (xx + 0.5 * np.sin(yy / 23.0)) % P; cd = ((xx + yy) / 1.414) % P
    c = np.where(o == 1, cv, np.where(o == 2, cd, ch))
    d = np.abs(c - P / 2)
    half = (t ** 0.85) * P / 2 * 1.04
    m = np.clip(half - d + 0.5, 0, 1)
    m = np.where(t > 0.97, 1.0, m)                           # lit glass stamps solid
    m = np.where(t < 0.03, 0.0, m)
    m = np.maximum(m, np.asarray(line, np.float32) / 255)
    return m


def flood_front():
    w, h = W * S, FLOOD_F * S
    rgb = flood(h, w, 11)
    mask = Image.new('L', (w, h), 0)
    rule_mask(mask, 22, 22, W - 22, FLOOD_F - 14, 1.6)
    rule_mask(mask, 28, 28, W - 28, FLOOD_F - 20, 0.7)
    for cx, cy in ((22, 22), (W - 22, 22), (22, FLOOD_F - 14), (W - 22, FLOOD_F - 14)):
        diamond(mask, cx, cy, 5)
    # wordmark and address line
    text_mask(None, 'THE VANDERMEER', os.path.join(F, 'BodoniModa-96-600.ttf'), 52, track=0.16,
              anchor_xy=(W / 2 * S, 381 * S), canvas=mask)
    text_mask(None, 'EAST SIXTY-FIRST STREET, NEW YORK', os.path.join(F, 'BodoniModa-11-500.ttf'), 13.5, track=0.32,
              anchor_xy=(W / 2 * S, 410 * S), canvas=mask)
    ImageDraw.Draw(mask).rectangle([150 * S, 393 * S, 666 * S, 393 * S + 1], fill=255)
    for x in (140, 676):
        diamond(mask, x, 393.5, 3.2)
    mk = np.asarray(mask, np.float32) / 255
    eng = engraving()
    mk[AY * S:(AY + AH) * S, AX * S:(AX + AW) * S] = np.maximum(mk[AY * S:(AY + AH) * S, AX * S:(AX + AW) * S], eng)
    col, a = foil(mk, 21)
    out = comp(rgb, col, a)
    # flood edge: the offset black stops a hair unevenly on the board
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGB').convert('RGBA')
    al = np.full((h, w), 255, np.uint8)
    xs = np.arange(w, dtype=np.float32)
    wav = 0.8 + 0.6 * np.sin(xs / 173.0) + 0.4 * np.sin(xs / 61.0 + 1.3)      # 0 to 1.8 px, smooth
    yy = np.arange(h, dtype=np.float32)[:, None]
    al = (np.clip((h - wav[None, :]) - yy, 0, 1) * 255).astype(np.uint8)
    img.putalpha(Image.fromarray(al))
    img.save(os.path.join(A, 'flood-front.png'), optimize=True)


def flood_back():
    w, h = W * S, FLOOD_B * S
    rgb = flood(h, w, 41)
    mask = Image.new('L', (w, h), 0)
    rule_mask(mask, 22, 22, W - 22, FLOOD_B - 14, 1.6)
    rule_mask(mask, 28, 28, W - 28, FLOOD_B - 20, 0.7)
    for cx, cy in ((22, 22), (W - 22, 22), (22, FLOOD_B - 14), (W - 22, FLOOD_B - 14)):
        diamond(mask, cx, cy, 5)
    text_mask(None, 'THE VANDERMEER', os.path.join(F, 'BodoniModa-96-600.ttf'), 34, track=0.14,
              anchor_xy=(64 * S, 80 * S), align='left', canvas=mask)
    text_mask(None, 'In-Suite Dining, continued', os.path.join(F, 'BodoniModa-96-500i.ttf'), 25, track=0.0,
              anchor_xy=((W - 64) * S, 78 * S), align='right', canvas=mask)
    mk = np.asarray(mask, np.float32) / 255
    col, a = foil(mk, 23)
    out = comp(rgb, col, a)
    img = Image.fromarray(np.clip(out, 0, 255).astype(np.uint8), 'RGB').convert('RGBA')
    img.save(os.path.join(A, 'flood-back.png'), optimize=True)


# ---------------------------------------------------------------- ivory board layers
def emboss(top, name):
    """Blind embossed double frame on the ivory: a raised ridge, lit top left, shaded bottom right."""
    w, h = W * S, H * S
    hi = Image.new('L', (w, h), 0); sh = Image.new('L', (w, h), 0)
    dh, ds = ImageDraw.Draw(hi), ImageDraw.Draw(sh)
    for inset, wd in ((30, 2.2), (37, 1.2)):
        x0, y0, x1, y1 = inset * S, (top + inset - 12) * S, (W - inset) * S, (H - inset) * S
        k = int(wd * S)
        dh.line([(x0, y1), (x0, y0), (x1, y0)], fill=255, width=k)
        ds.line([(x0, y1), (x1, y1), (x1, y0)], fill=255, width=k)
        # inner edge of the ridge: the reverse
        o = k
        ds.line([(x0 + o, y1 - o), (x0 + o, y0 + o), (x1 - o, y0 + o)], fill=150, width=max(1, k // 2))
        dh.line([(x0 + o, y1 - o), (x1 - o, y1 - o), (x1 - o, y0 + o)], fill=150, width=max(1, k // 2))
    hi = np.asarray(hi.filter(ImageFilter.GaussianBlur(1.1)), np.float32) / 255
    sh = np.asarray(sh.filter(ImageFilter.GaussianBlur(1.3)), np.float32) / 255
    rgba = np.zeros((h, w, 4), np.float32)
    a_hi = hi * 150; a_sh = sh * 70
    a = np.clip(a_hi + a_sh, 0, 255)
    with np.errstate(invalid='ignore', divide='ignore'):
        fh = np.where(a > 0, a_hi / np.maximum(a, 1e-3), 0)
    rgba[..., :3] = (np.array([255, 253, 246], np.float32) * fh[..., None]
                     + np.array([110, 92, 70], np.float32) * (1 - fh[..., None]))
    rgba[..., 3] = a
    Image.fromarray(rgba.astype(np.uint8), 'RGBA').save(os.path.join(A, f'paper-emboss-{name}.png'), optimize=True)


def ink_take(name, seed, flood_h):
    """Uneven offset ink take: soft ivory blotches that lighten the printing here and there,
    plus a faint grey lift in the solids. Big, gentle shapes only."""
    h, w = H, W
    m = lowfreq(h, w, 9, seed) * 0.6 + lowfreq(h, w, 24, seed + 1) * 0.4
    a = np.clip((m - 0.15) * 22, 0, 26)
    rgba = np.zeros((h, w, 4), np.float32)
    rgba[..., :3] = np.array([244, 238, 224], np.float32)
    a[:flood_h] = 0
    rgba[..., 3] = a
    Image.fromarray(rgba.astype(np.uint8), 'RGBA').save(os.path.join(A, f'paper-ink-{name}.png'), optimize=True)


def wear(name, seed, flood_h):
    """Rubbed corners and edges (the black flood scuffs grey, the ivory tones), a handling smudge."""
    h, w = H, W
    yy, xx = np.mgrid[0:h, 0:w].astype(np.float32)
    rgba = np.zeros((h, w, 4), np.float32)
    # ivory toning toward the edges
    e = np.minimum.reduce([xx, yy, w - xx, h - yy])
    mott = lowfreq(h, w, 6, seed)
    tone_a = np.clip(1 - (e + mott * 6) / 26, 0, 1) ** 1.8 * 50 + np.clip(mott, 0, None) * 6
    col = np.empty((h, w, 3), np.float32); col[...] = np.array([170, 138, 92], np.float32)
    # on the flood, rubbing reads as pale grey board showing through
    on_flood = yy < flood_h
    rub = np.clip(1 - (e + lowfreq(h, w, 14, seed + 2) * 2.5) / 4, 0, 1) ** 1.6 * 70
    cx = np.minimum(xx, w - xx); cy = np.minimum(yy, h - yy)
    corner = np.clip(1 - np.sqrt(cx ** 2 + cy ** 2) / 30, 0, 1) ** 1.5 * 120
    a = np.where(on_flood, np.maximum(rub, corner), np.maximum(tone_a, corner * 0.7))
    col[on_flood] = np.array([150, 142, 136], np.float32)
    rgba[..., :3] = col; rgba[..., 3] = np.clip(a, 0, 170)
    img = Image.fromarray(rgba.astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(0.8))
    # a soft thumb smudge where the card gets picked up
    st = Image.new('RGBA', (w, h), (0, 0, 0, 0)); sd = ImageDraw.Draw(st)
    if name == 'front':
        sd.ellipse([(718, 930), (812, 1046)], fill=(120, 98, 66, 26))
    else:
        sd.ellipse([(6, 940), (96, 1050)], fill=(120, 98, 66, 22))
    img = Image.alpha_composite(img, st.filter(ImageFilter.GaussianBlur(16)))
    img.save(os.path.join(A, f'wear-{name}.png'), optimize=True)


def ring():
    """The pale ring left by the foot of a champagne flute. Thin, uneven, broken on one side."""
    s = 240; c = s / 2
    y, x = np.mgrid[0:s, 0:s].astype(np.float32)
    r = np.sqrt((x - c) ** 2 + (y - c) ** 2)
    ang = np.arctan2(y - c, x - c)
    rad = 92 + np.sin(ang * 3 + 0.7) * 1.6
    band = np.exp(-((r - rad) / 2.4) ** 2)
    inner = np.clip(1 - r / rad, 0, 1) * 0.12
    strength = 0.5 + 0.5 * np.cos(ang - 2.2)
    a = (band * strength + inner * (0.6 + 0.4 * strength)) * 80
    im = np.zeros((s, s, 4), np.float32); im[..., :3] = np.array([172, 136, 70], np.float32); im[..., 3] = np.clip(a, 0, 255)
    Image.fromarray(im.astype(np.uint8), 'RGBA').filter(ImageFilter.GaussianBlur(1.2)).save(os.path.join(A, 'stain-ring.png'), optimize=True)


# ---------------------------------------------------------------- the sticker
def star(d, cx, cy, ro, fill):
    pts = []
    for i in range(10):
        rr = ro if i % 2 == 0 else ro * 0.42
        a = -math.pi / 2 + i * math.pi / 5
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    d.polygon(pts, fill=fill)


def sticker():
    """A screen printed vinyl campaign sticker pressed onto the card, the bottom right corner
    lifting off with its paper-white back showing. Red and navy inks, slightly out of register."""
    sw, sh = 214 * S, 118 * S
    pad = 24 * S
    cw, chh = sw + 2 * pad, sh + 2 * pad
    face = Image.new('RGBA', (cw, chh), (0, 0, 0, 0))
    shape = Image.new('L', (cw, chh), 0)
    ImageDraw.Draw(shape).rounded_rectangle([pad, pad, pad + sw, pad + sh], radius=7 * S, fill=255)
    # vinyl white with a faint gloss band
    base = np.zeros((chh, cw, 4), np.float32)
    yy, xx = np.mgrid[0:chh, 0:cw].astype(np.float32)
    gloss = np.exp(-(((xx - yy * 1.6) - cw * 0.25) / (cw * 0.12)) ** 2) * 10
    base[..., :3] = np.array([243, 241, 233], np.float32) + gloss[..., None]
    base[..., 3] = 255
    face = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8), 'RGBA')
    red, navy = (182, 36, 44, 255), (32, 50, 108, 255)
    # red layer, nudged out of register
    rl = Image.new('RGBA', (cw, chh), (0, 0, 0, 0)); rd = ImageDraw.Draw(rl)
    ox, oy = int(1.6 * S), int(-1.0 * S)
    rd.rounded_rectangle([pad + 6 * S + ox, pad + 6 * S + oy, pad + sw - 6 * S + ox, pad + sh - 6 * S + oy], radius=4 * S, outline=red, width=int(4 * S))
    rd.rectangle([pad + 50 * S + ox, pad + 92 * S + oy, pad + sw - 50 * S + ox, pad + 95 * S + oy], fill=red)
    for sx in (pad + 62 * S, pad + sw - 62 * S):
        star(rd, sx + ox, pad + 25 * S + oy, 6.5 * S, red)
    face = Image.alpha_composite(face, rl)
    nl = Image.new('RGBA', (cw, chh), (0, 0, 0, 0)); nd = ImageDraw.Draw(nl)
    f1 = ImageFont.truetype(os.path.join(F, 'Oswald-500.ttf'), int(15 * S))
    f2 = ImageFont.truetype(os.path.join(F, 'Oswald-700.ttf'), int(29 * S))
    def tracked(d, y, txt, fnt, track):
        ws = [d.textlength(c, font=fnt) for c in txt]
        tot = sum(ws) + track * (len(txt) - 1)
        x = cw / 2 - tot / 2
        for c, ww in zip(txt, ws):
            d.text((x, y), c, font=fnt, fill=navy, anchor='ls'); x += ww + track
    tracked(nd, pad + 31 * S, 'VOTE', f1, 4.5 * S)
    tracked(nd, pad + 59 * S, 'NONE OF', f2, 0.6 * S)
    tracked(nd, pad + 87 * S, 'THE ABOVE', f2, 0.6 * S)
    face = Image.alpha_composite(face, nl)
    # ink texture: screen print is never perfectly flat
    arr = np.asarray(face).astype(np.float32)
    arr[..., :3] += rng.normal(0, 3.0, arr[..., :3].shape).astype(np.float32)
    face = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), 'RGBA')
    face.putalpha(shape)
    # the lifting corner: cut the face along a diagonal, fold the flap back over itself
    k = 34 * S
    cx1, cy1 = pad + sw, pad + sh
    cut = Image.new('L', (cw, chh), 255)
    ImageDraw.Draw(cut).polygon([(cx1 - k, cy1 + 2), (cx1 + 2, cy1 - k), (cx1 + 2, cy1 + 2)], fill=0)
    fa = np.minimum(np.asarray(face.getchannel('A')), np.asarray(cut))
    face.putalpha(Image.fromarray(fa))
    # shadow layer: a tight contact shadow round the stuck part, a wider one under the lifted flap
    shadow = Image.new('RGBA', (cw, chh), (0, 0, 0, 0))
    sa = Image.fromarray(fa).filter(ImageFilter.GaussianBlur(1.4 * S))
    shadow.paste((40, 30, 24, 255), (int(0.6 * S), int(1.0 * S)), sa.point(lambda v: int(v * 0.32)))
    flap_pts = [(cx1 - k, cy1), (cx1, cy1 - k), (cx1 - k * 0.92, cy1 - k * 0.92)]
    fs = Image.new('L', (cw, chh), 0)
    ImageDraw.Draw(fs).polygon([(x + 3 * S, y + 5 * S) for x, y in flap_pts], fill=110)
    shadow.paste((40, 30, 24, 255), (0, 0), fs.filter(ImageFilter.GaussianBlur(4 * S)))
    out = Image.alpha_composite(shadow, face)
    # the flap: the sticker's paper-white backing, shaded across the fold
    flap = Image.new('RGBA', (cw, chh), (0, 0, 0, 0)); fd = ImageDraw.Draw(flap)
    fd.polygon(flap_pts, fill=(226, 222, 212, 255))
    fd.line([flap_pts[0], flap_pts[1]], fill=(170, 164, 152, 255), width=int(1.2 * S))
    fl = np.asarray(flap).astype(np.float32)
    g = np.clip((xx + yy - (cx1 + cy1 - k)) / k, 0, 1)     # darker toward the fold line
    fl[..., :3] *= (0.86 + 0.14 * (1 - g))[..., None] * 0 + (0.9 + 0.1 * g)[..., None]
    flap = Image.fromarray(np.clip(fl, 0, 255).astype(np.uint8), 'RGBA')
    out = Image.alpha_composite(out, flap)
    out = out.rotate(-7, resample=Image.BICUBIC, expand=True)
    out.save(os.path.join(A, 'sticker-vote.png'), optimize=True)
    return out.size


if __name__ == '__main__':
    os.makedirs(A, exist_ok=True)
    flood_front(); flood_back()
    emboss(FLOOD_F, 'front'); emboss(FLOOD_B, 'back')
    ink_take('front', 5, FLOOD_F); ink_take('back', 9, FLOOD_B)
    wear('front', 31, FLOOD_F); wear('back', 47, FLOOD_B)
    ring()
    print('sticker size (2x px):', sticker())
    print('painted')
