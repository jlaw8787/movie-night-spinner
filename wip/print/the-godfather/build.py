"""Louis' Italian-American Restaurant, the Bronx, 1946.
Single heavy card, two faces 816x1056 (US Letter). Olive oil paper, espresso ink, orange.
Signature: a real 1940 Bronx pushcart market photo (Library of Congress, no known restrictions) across the front,
plus the TMDB still of the fruit stand with the spilled oranges on the back.
Props: a bakery cannoli box tied with string (Nazorine's), a wedding favour card from Connie's wedding.
Big gags: "try the veal, best in the city", leave the tip take the cannoli, the oranges.
Writes photo crops, painted props and wear, front/back .body.html and .html."""
import os, random, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056
PAPER, INK, ORANGE, MID, CARD = '#e7e1bf', '#2b1b13', '#c4561b', '#57463a', '#f7f2e4'
FONTS = ('https://fonts.googleapis.com/css2?family=IM+Fell+English+SC'
         '&family=Spectral:ital,wght@0,400;0,600;0,700;1,400&family=Mrs+Saint+Delafield&display=swap')
DISP = "'IM Fell English SC', serif"; BODY = "'Spectral', serif"; SCRIPT = "'Mrs Saint Delafield', cursive"
M = 40

# ---------------- photos ----------------
def fit(im, w, h):
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

# Front: 1940 Arthur Avenue pushcart market. Crop under the beer billboard, blur the two shop-name signs.
PH = 300
st = Image.open(S('loc-12707-3000.jpg')).convert('L')
X0, Y0, K = 88, 879, 2.03          # preview-to-source mapping used when choosing the crop
def box(x0, y0, x1, y1):
    return tuple(int(v) for v in (X0 + x0 * K, Y0 + y0 * K, X0 + x1 * K, Y0 + y1 * K))
for b in [box(400, 0, 578, 70), box(808, 0, 875, 68), box(1190, 130, 1245, 180)]:
    reg = st.crop(b).filter(ImageFilter.GaussianBlur(9)); st.paste(reg, b[:2])
st = st.crop(box(0, 0, 1400, 583))
st = ImageOps.autocontrast(st, cutoff=0.4)
st = ImageEnhance.Brightness(st).enhance(1.06)
st = ImageOps.colorize(st, black='#22150f', white='#f3ecd2', mid='#8a7458')
fit(st, W, PH).save(A('market-1940.jpg'), quality=90)

# Back: TMDB fruit stand still, the basket of oranges spilled on the street. Lifted out of the night, warmed.
fr = Image.open(S('c4y3FQ0cCVuhJCvJrV9a8KeBuvq.jpg')).convert('RGB').crop((1560, 0, 3200, 1260))
a = np.asarray(fr).astype(float) / 255
a = a ** 0.55
a[..., 0] *= 1.06; a[..., 1] *= 0.98; a[..., 2] *= 0.9
fr = Image.fromarray((a.clip(0, 1) * 255).astype('uint8'))
fr = ImageEnhance.Contrast(fr).enhance(1.15); fr = ImageEnhance.Color(fr).enhance(1.12)
FW, FH = 372, 286
fit(fr, FW, FH).save(A('fruit-stand.jpg'), quality=90)

# ---------------- painted wear ----------------
def wear(name, seed):
    """Soft aged vignette toward the edges, a few big gentle mottles. Low detail, nothing over the text."""
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(46):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(92 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(18))
    mot = Image.new('L', (W, H), 0); dd = ImageDraw.Draw(mot)
    for i in range(14):
        x = rnd.choice([rnd.randint(-60, 140), rnd.randint(W - 140, W + 60)]); y = rnd.randint(-60, H + 60)
        r = rnd.randint(80, 190)
        dd.ellipse([x - r, y - r, x + r, y + r], fill=rnd.randint(8, 18))
    mot = mot.filter(ImageFilter.GaussianBlur(60))
    m = Image.fromarray(np.minimum(255, np.asarray(m, int) + np.asarray(mot, int)).astype('uint8'))
    lay = Image.new('RGBA', (W, H), (96, 70, 30, 0)); lay.putalpha(m)
    lay.save(A(f'wear-paper-{name}.png'))
wear('front', 11); wear('back', 46)

# ---------------- painted props ----------------
def twine(dr, p0, p1, w=7):
    """Red and white twisted bakery string."""
    (x0, y0), (x1, y1) = p0, p1
    L = math.hypot(x1 - x0, y1 - y0); ux, uy = (x1 - x0) / L, (y1 - y0) / L; nx, ny = -uy, ux
    dr.line([p0, p1], fill=(250, 246, 238, 255), width=w)
    s = 0.0
    while s < L:
        ax, ay = x0 + ux * s + nx * w / 2, y0 + uy * s + ny * w / 2
        bx, by = x0 + ux * (s + 6) - nx * w / 2, y0 + uy * (s + 6) - ny * w / 2
        dr.line([(ax, ay), (bx, by)], fill=(176, 36, 32, 255), width=3)
        s += 9
    dr.line([(x0 + nx * w / 2, y0 + ny * w / 2), (x1 + nx * w / 2, y1 + ny * w / 2)], fill=(120, 30, 26, 110), width=1)

def cannoli_box():
    """Top-down white pastry box, tied with string, a soft shadow. 330x210 css px painted at 2x."""
    cw, ch = 660, 420
    im = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    sh = Image.new('L', (cw, ch), 0); ImageDraw.Draw(sh).rectangle([30, 34, 640, 404], fill=120)
    sh = sh.filter(ImageFilter.GaussianBlur(12))
    shadow = Image.new('RGBA', (cw, ch), (40, 26, 14, 0)); shadow.putalpha(sh)
    im = Image.alpha_composite(im, shadow)
    lid = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); ld = ImageDraw.Draw(lid)
    ld.rectangle([16, 14, 626, 348], fill=(246, 242, 232, 255))
    ld.rectangle([16, 348, 626, 392], fill=(222, 215, 199, 255))     # front wall of the box
    ld.line([(16, 348), (626, 348)], fill=(190, 180, 160, 255), width=2)
    g = np.zeros((ch, cw), float)
    yy, xx = np.mgrid[0:ch, 0:cw]
    g += 14 * (xx / cw) + 10 * (yy / ch)
    rnd = np.random.default_rng(3)
    blot = Image.fromarray((rnd.random((ch // 20, cw // 20)) * 255).astype('uint8')).resize((cw, ch), Image.BICUBIC)
    g += (np.asarray(blot, float) - 128) / 128 * 4
    arr = np.asarray(lid).astype(float)
    mask = arr[..., 3] > 0
    for c in range(3): arr[..., c][mask] -= g[mask]
    lid = Image.fromarray(arr.clip(0, 255).astype('uint8'))
    ld = ImageDraw.Draw(lid)
    ld.rectangle([16, 14, 626, 392], outline=(176, 166, 146, 255), width=2)
    im = Image.alpha_composite(im, lid)
    dr = ImageDraw.Draw(im)
    kx, ky = 470, 300
    twine(dr, (kx, 6), (kx, 400)); twine(dr, (8, ky), (634, ky))
    for ang, rx, ry in [(-30, 46, 22), (205, 46, 22)]:          # the bow loops
        loop = Image.new('RGBA', (cw, ch), (0, 0, 0, 0)); lo = ImageDraw.Draw(loop)
        lo.ellipse([kx - rx, ky - ry, kx + rx, ky + ry], outline=(250, 246, 238, 255), width=7)
        lo.ellipse([kx - rx, ky - ry, kx + rx, ky + ry], outline=(176, 36, 32, 200), width=2)
        loop = loop.rotate(ang, center=(kx, ky)).transform(loop.size, Image.AFFINE, (1, 0, -math.cos(math.radians(ang)) * rx, 0, 1, math.sin(math.radians(ang)) * rx))
        im = Image.alpha_composite(im, loop)
    dr = ImageDraw.Draw(im)
    twine(dr, (kx, ky), (kx + 40, ky + 70)); twine(dr, (kx, ky), (kx - 34, ky + 74))
    dr.ellipse([kx - 9, ky - 9, kx + 9, ky + 9], fill=(232, 222, 206, 255), outline=(150, 34, 30, 255), width=3)
    im.save(A('cannoli-box.png'))
cannoli_box()

def almonds():
    """Five white sugared almonds for a wedding favour. 230x64 css px at 2x."""
    cw, ch = 460, 128
    im = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    rnd = random.Random(5)
    tints = [(250, 248, 243), (247, 240, 236), (250, 248, 243), (244, 238, 230), (250, 248, 243)]
    for i in range(5):
        cx, cy = 52 + i * 89, 64 + (8 if i % 2 else -6); rx, ry = 42, 28
        ang = rnd.uniform(-25, 25)
        sh = Image.new('L', (cw, ch), 0); ImageDraw.Draw(sh).ellipse([cx - rx + 4, cy - ry + 8, cx + rx + 4, cy + ry + 8], fill=110)
        sh = sh.filter(ImageFilter.GaussianBlur(6)).rotate(ang, center=(cx, cy))
        shadow = Image.new('RGBA', (cw, ch), (60, 40, 20, 0)); shadow.putalpha(sh)
        im = Image.alpha_composite(im, shadow)
        yy, xx = np.mgrid[0:ch, 0:cw].astype(float)
        dx, dy = (xx - cx) / rx, (yy - cy) / ry
        r2 = dx * dx + dy * dy
        inside = r2 <= 1
        shade = 1 - 0.22 * np.clip(dx * 0.4 + dy * 0.8 + 0.3, 0, 1.5) + 0.12 * np.exp(-((dx + 0.35) ** 2 + (dy + 0.45) ** 2) * 6)
        arr = np.zeros((ch, cw, 4))
        for c in range(3): arr[..., c] = tints[i][c] * shade
        arr[..., 3] = np.where(inside, 255, 0)
        al = Image.fromarray(arr.clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.6)).rotate(ang, center=(cx, cy))
        im = Image.alpha_composite(im, al)
    im.save(A('almonds.png'))
almonds()

# ---------------- type pieces ----------------
def kicker(t, color=ORANGE, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 22px;{extra}">{t}</div>')

def head(kick, title, top=0):
    """Kicker, then an engraved small-caps title with a thick and thin orange rule beneath."""
    return (f'<div style="margin-top: {top}px">{kicker(kick)}'
            f'<div style="font-family: {DISP}; font-size: 42px; line-height: 44px; color: {INK}; margin-top: 2px">{title}</div>'
            f'<div style="height: 4px; background: {ORANGE}; margin-top: 4px"></div>'
            f'<div style="height: 1px; background: {ORANGE}; margin-top: 2px"></div></div>')

def item(name, price, desc, top=14, note=None, size=27):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.25; color: {ORANGE}; margin-top: 2px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.15; color: {INK}"><span>{name}</span><span>{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {MID}; margin-top: 3px">{desc}</div>{n}</div>')

def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'

def page(name, inner):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; opacity: 0.55">'
            f'{inner}'
            f'<img src="assets/wear-paper-{name}.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px">'
            f'</div>')

# ---------------- front ----------------
def front():
    o = []
    o.append(f'<img src="assets/market-1940.jpg" alt="Pushcart market on Arthur Avenue, the Bronx, 1940" '
             f'style="position: absolute; left: 0; top: 0; width: {W}px; height: {PH}px">')
    o.append(f'<div style="position: absolute; left: 0; top: {PH}px; width: {W}px; height: 4px; background: {ORANGE}"></div>')
    # name plate
    o.append(f'<div style="position: absolute; left: 0; top: {PH + 4}px; width: {W}px; height: 112px; background: {INK}"></div>')
    o.append(at(M, PH + 16, 540, kicker('Ristorante, the Bronx, N.Y.', ORANGE, 18)
                + f'<div style="font-family: {DISP}; font-size: 72px; line-height: 72px; color: {CARD}; margin-top: 2px">Louis\'</div>'))
    o.append(at(266, PH + 44, 300, f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: #d8ccb0">'
                'The pushcart market round our corner, where we buy every tomato.</div>'))
    # big gag 1: the veal seal
    o.append(f'<div style="position: absolute; left: 592px; top: 214px; width: 196px; height: 196px; border-radius: 50%; background: {ORANGE}; '
             f'transform: rotate(-6deg); box-shadow: 0 3px 8px rgba(30,15,5,0.35)">'
             f'<div style="position: absolute; left: 9px; top: 9px; width: 174px; height: 174px; border-radius: 50%; border: 2px solid {CARD}; box-sizing: border-box"></div>'
             f'<div style="position: absolute; left: 0; top: 36px; width: 196px; text-align: center; color: {CARD}">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.2em; line-height: 22px">THE BEST</div>'
             f'<div style="font-family: {DISP}; font-size: 66px; line-height: 62px">Veal</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.14em; line-height: 20px">IN THE CITY</div>'
             f'</div></div>')
    TOP = PH + 4 + 112 + 26
    left = (head('To start', 'Antipasti')
            + item('Antipasto, wedding style', '.65', 'Salami, aged provolone, olives and roasted peppers, at room temperature.')
            + item('Arancini', '.40', 'Crisp fried risotto balls with a melting mozzarella center.')
            + head('By hand, every morning', 'Pasta', 26)
            + item('Rigatoni, Sunday gravy', '.85', 'Pork and beef meatballs, fennel sausage, slow-cooked tomato. Pecorino at the table.')
            + f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MID}; margin-top: 18px">'
              'We cook with Genco Pura olive oil. Prices subject to change. OLinville 2-1972. Form L-46.</div>')
    o.append(at(M, TOP, 366, left))
    o.append(f'<div style="position: absolute; left: 427px; top: {TOP + 4}px; width: 1px; height: 520px; background: {INK}; opacity: 0.35"></div>')
    RX = 448; RW = W - M - RX
    right = (head('Specialità della casa', 'The Veal')
             + item('Veal scaloppine', '1.72', 'Thin cutlets pounded to order, pan-fried in butter, Marsala wine sauce, mushrooms.', 14,
                    'Pounded to order. Allow a few minutes.', 28))
    o.append(at(RX, TOP, RW, right))
    # big gag: the offer box
    o.append(at(RX, TOP + 240, RW,
                f'<div style="border: 3px solid {ORANGE}; padding: 12px 16px 14px; box-sizing: border-box; background: rgba(247,242,228,0.55)">'
                + kicker('Complete dinner', ORANGE, 16)
                + f'<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 4px">'
                  f'<div style="font-family: {DISP}; font-size: 30px; line-height: 32px; color: {INK}">The family dinner</div>'
                  f'<div style="font-family: {BODY}; font-weight: 700; font-size: 28px; color: {INK}">2.50</div></div>'
                + f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {MID}; margin-top: 6px">'
                  'Antipasto, rigatoni with gravy, the veal, a cannoli and espresso.</div></div>'))
    # prop: wedding favour card
    o.append(f'<div style="position: absolute; left: {RX + 22}px; top: {TOP + 416}px; width: 300px; height: 140px; background: {CARD}; '
             f'transform: rotate(3.5deg); box-shadow: 0 3px 7px rgba(40,25,10,0.3); border: 1px solid #cfc3a6">'
             f'<div style="position: absolute; left: 22px; top: 0; width: 16px; height: 140px; background: #ead2c9"></div>'
             f'<div style="position: absolute; left: 22px; top: 0; width: 2px; height: 140px; background: #d9b9ad"></div>'
             f'<div style="position: absolute; left: 36px; top: 0; width: 2px; height: 140px; background: #d9b9ad"></div>'
             f'<div style="position: absolute; left: 54px; top: 12px; width: 234px; text-align: center">'
             + kicker('Bomboniera', ORANGE, 16)
             + f'<div style="font-family: {DISP}; font-size: 28px; line-height: 30px; color: {INK}">Connie &amp; Carlo</div>'
               f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 20px; color: {MID}">Long Beach, 1945</div></div>'
             f'<img src="assets/almonds.png" alt="" style="position: absolute; left: 62px; top: 74px; width: 218px; height: 61px">'
             f'</div>')
    return page('front', ''.join(o))

# ---------------- back ----------------
def back():
    o = []
    # Dolci and the cannoli box
    o.append(at(M, M, 380, head('From the pastry shop', 'Dolci')
                + item('Cannoli', '.25', 'Crisp shells, orange-scented ricotta, dark chocolate, crushed pistachio.')
                + item('Spumoni', '.20', 'Cherry, pistachio and chocolate layers with candied fruit.')))
    o.append(f'<img src="assets/cannoli-box.png" alt="" style="position: absolute; left: 448px; top: 38px; width: 330px; height: 210px">')
    o.append(f'<div style="position: absolute; left: 470px; top: 66px; width: 196px; height: 112px; border-radius: 50%; border: 3px solid {ORANGE}; '
             f'box-sizing: border-box; text-align: center; padding-top: 18px">'
             f'<div style="font-family: {DISP}; font-size: 30px; line-height: 30px; color: {INK}">Nazorine</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.18em; line-height: 20px; color: {ORANGE}">PASTRY SHOP</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 20px; color: {MID}">wedding cakes</div></div>')
    # big gag 2
    o.append(at(448, 258, W - M - 448, f'<div style="font-family: {DISP}; font-size: 40px; line-height: 42px; color: {ORANGE}; text-align: center">'
                'Take the cannoli.</div>'
                f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {MID}; text-align: center; margin-top: 4px">'
                'Boxed and tied with string for the ride.</div>'))
    # signature still: the fruit stand and the oranges
    PY = 358
    o.append(f'<div style="position: absolute; left: {M}px; top: {PY}px; width: {FW + 8}px; height: {FH + 8}px; background: {ORANGE}"></div>')
    o.append(f'<img src="assets/fruit-stand.jpg" alt="The fruit stand with oranges on the street" '
             f'style="position: absolute; left: {M + 4}px; top: {PY + 4}px; width: {FW}px; height: {FH}px">')
    o.append(at(M, PY + FH + 18, FW + 8, f'<div style="font-family: {DISP}; font-size: 30px; line-height: 32px; color: {INK}">An orange on every table</div>'
                f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MID}; margin-top: 2px">'
                'Bought every morning at the fruit stand by the olive oil company.</div>'))
    # cafe and bar
    BX = 448; BW = W - M - BX
    o.append(at(BX, PY - 4, BW, head('After dinner', 'Caffè &amp; Bar')
                + item('Espresso', '.10', 'Dark roast, a curl of lemon peel.', 10)
                + item('Blood orange soda', '.15', 'Ruby citrus syrup, cold seltzer, a twist of fresh peel.', 10)
                + item('Chianti', '.35', 'By the glass, from the straw bottle.', 10)
                + item('Anisette', '.30', 'Sweet cordial, two coffee beans.', 10)))
    # character voice: Clemenza
    NY = PY + FH + 112
    o.append(at(M, NY, FW + 8, f'<div style="border-left: 4px solid {ORANGE}; padding-left: 14px">'
                + kicker('A friend of the kitchen', ORANGE, 16)
                + f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.32; color: {INK}; margin-top: 4px">'
                  'A little oil, fry the garlic, in go the tomatoes, then sausage and meatballs. '
                  'A splash of wine, a pinch of sugar. My trick.</div>'
                + f'<div style="font-family: {SCRIPT}; font-size: 44px; line-height: 44px; color: {INK}; margin-top: 2px">Pete Clemenza</div></div>'))
    # house rules
    rules = ['Business stays off the table.',
             'The washroom is at the rear. Old-fashioned plumbing.',
             'Police officers dine with us often.',
             'Never take sides against the family.']
    rl = ''.join(f'<div style="display: flex; gap: 10px; margin-top: 6px"><div style="width: 8px; height: 8px; background: {ORANGE}; margin-top: 9px; flex: none"></div>'
                 f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {INK}">{r}</div></div>' for r in rules)
    o.append(at(BX, 766, BW, f'<div style="background: {INK}; padding: 8px 16px 8px">'
                f'<div style="font-family: {DISP}; font-size: 30px; line-height: 32px; color: {CARD}">House customs</div></div>'
                f'<div style="border: 2px solid {INK}; border-top: none; padding: 4px 14px 12px">{rl}</div>'))
    o.append(at(M, 966, FW + 8, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MID}">'
                'Louis\', the Bronx, N.Y. Cannoli fresh daily from Nazorine\'s. No checks cashed. Printed 1946.</div>'))
    return page('back', ''.join(o))

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Louis\' restaurant card</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
