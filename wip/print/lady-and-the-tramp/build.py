"""Tony's, the back alley table. Lady and the Tramp (1955), set 1909 to 1910.
Single heavy card, two faces 816x1056 (US Letter) with a red and white checked tablecloth border.
Front is the night: deep alley blue, candle amber light, the TMDB spaghetti still large.
Back is the day: cream stock, a real 1905 tree-lined avenue (Library of Congress, no known restrictions).
Props: a brass dog licence tag, a "back door, by the barrels" reservation card for two.
Writes painted assets, front/back .body.html and .html."""
import os, random, math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps

D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056
B = 40                      # checked border width
NIGHT, NIGHT2, AMBER, CANDLE, RED, CREAM, PAPER, INK, DIM = (
    '#18223f', '#22305a', '#f0b04a', '#ffd98a', '#c3302a', '#f6ecd4', '#f5ead2', '#1c2645', '#b9bfd3')
FONTS = ('https://fonts.googleapis.com/css2?family=Corben:wght@400;700'
         '&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Allura&display=swap')
DISP = "'Corben', serif"; BODY = "'Crimson Pro', serif"; SCRIPT = "'Allura', cursive"
os.makedirs(os.path.join(D, 'assets'), exist_ok=True)


def fit(im, w, h, fx=0.5, fy=0.5):
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = int((sw - cw) * fx), int((sh - ch) * fy)
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)


# ---------------- photos ----------------
# Front hero: the TMDB spaghetti still, the shared strand and the candle. Lifted a touch, no tint.
HW, HH = 704, 360
st = Image.open(S('xJbWJK3NAMCzknfCFdMUYekNezS.jpg')).convert('RGB')
st = ImageEnhance.Brightness(st).enhance(1.06)
st = ImageEnhance.Contrast(st).enhance(1.04)
fit(st, HW, HH).save(A('still-spaghetti.jpg'), quality=92)

# Back: 1905 upper Genesee Street, Utica. Warm sepia duotone, cropped to the shaded walk and porches.
PW, PH = 704, 250
ph = Image.open(S('loc-4a12358.jpg')).convert('L')
w0, h0 = ph.size
ph = ph.crop((int(w0 * 0.03), int(h0 * 0.18), int(w0 * 0.97), int(h0 * 0.86)))   # lose the plate border and caption
ph = ImageOps.autocontrast(ph, cutoff=0.6)
ph = ImageOps.colorize(ph, black='#1c2238', mid='#7d6a52', white='#f8ecd2')
fit(ph, PW, PH, fy=0.6).save(A('avenue-1905.jpg'), quality=90)


# ---------------- gingham: woven red and white check ----------------
def gingham(w, h, period=20, seed=1):
    """Return an RGB array of woven gingham at 2x, period in css px."""
    p = period * 2
    yy, xx = np.mgrid[0:h, 0:w]
    vx = (xx % p) < p // 2
    hy = (yy % p) < p // 2
    rnd = np.random.default_rng(seed)
    white = np.array([250, 245, 234.]); half = np.array([228, 150, 140.]); full = np.array([190, 40, 36.])
    out = np.where((vx & hy)[..., None], full, np.where((vx | hy)[..., None], half, white))
    # thread weave: fine alternating over/under lines, very soft
    weave = ((xx + yy) % 4 < 2).astype(float) * 6 - 3
    thread = (rnd.random((h, w)) - 0.5) * 10
    slub = np.asarray(Image.fromarray((rnd.random((h // 6 + 1, w // 40 + 1)) * 255).astype('uint8'))
                      .resize((w, h), Image.BICUBIC)).astype(float)
    slub = (slub - 128) / 128 * 5
    out = out + (weave + thread + slub)[..., None]
    img = Image.fromarray(out.clip(0, 255).astype('uint8')).filter(ImageFilter.GaussianBlur(0.7))
    return np.asarray(img).astype(float)


def border(name, edge):
    """Checked tablecloth border, transparent centre, a hairline and soft shadow on the card edge."""
    w, h = W * 2, H * 2
    g = gingham(w, h, seed=3 if name == 'front' else 5)
    yy, xx = np.mgrid[0:h, 0:w]
    d = np.minimum(np.minimum(xx, w - 1 - xx), np.minimum(yy, h - 1 - yy))
    inside = d >= B * 2
    a = np.where(inside, 0, 255).astype(float)
    # gentle fold shading at the outer edge of the cloth
    shade = np.clip(1 - (d / (B * 2)), 0, 1) ** 2 * 26
    g = g - shade[..., None]
    # soft shadow the cloth casts onto the card
    sh = np.clip(1 - (d - B * 2) / 18, 0, 1) * inside
    rgba = np.zeros((h, w, 4))
    rgba[..., :3] = np.where(inside[..., None], 0, g)
    rgba[..., 3] = np.maximum(a, sh * 120)
    im = Image.fromarray(rgba.clip(0, 255).astype('uint8'), 'RGBA')
    dr = ImageDraw.Draw(im)
    e = tuple(int(edge[i:i + 2], 16) for i in (1, 3, 5)) + (255,)
    dr.rectangle([B * 2 + 8, B * 2 + 8, w - B * 2 - 9, h - B * 2 - 9], outline=e, width=3)
    im.resize((W * 2, H * 2)).save(A(f'border-{name}.png'))


def strip(wcss=330, hcss=10):
    g = gingham(wcss * 2, hcss * 2, period=10, seed=9)
    Image.fromarray(g.clip(0, 255).astype('uint8')).save(A('check-strip.png'))


# ---------------- light and paper ----------------
def light_front():
    """Candle pool on the alley blue: warm under the still and the menu, deep at the corners."""
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    lay = np.zeros((H, W, 4))
    lay[..., 0], lay[..., 1], lay[..., 2] = 240, 168, 74
    g = np.exp(-(((xx - 300) / 360) ** 2 + ((yy - 430) / 300) ** 2) * 1.4) * 40
    g += np.exp(-(((xx - 408) / 520) ** 2 + ((yy - 860) / 260) ** 2) * 1.6) * 22
    lay[..., 3] = g
    edge = np.minimum(np.minimum(xx, W - xx), np.minimum(yy, H - yy))
    k = np.zeros((H, W, 4)); k[..., 0], k[..., 1], k[..., 2] = 6, 9, 22
    k[..., 3] = (np.clip(1 - (edge - B) / 120, 0, 1) ** 2) * 150
    im = Image.alpha_composite(Image.fromarray(lay.astype('uint8'), 'RGBA'), Image.fromarray(k.clip(0, 255).astype('uint8'), 'RGBA'))
    # a few faint stars over the alley roofline, painted as soft dots
    dr = ImageDraw.Draw(im); rnd = random.Random(4)
    for _ in range(26):
        x, y = rnd.randint(60, W - 60), rnd.randint(52, 200)
        if 150 < x < 670 and 70 < y < 200: continue
        r = rnd.choice([0.8, 1, 1.2])
        dr.ellipse([x - r, y - r, x + r, y + r], fill=(255, 236, 190, rnd.randint(90, 170)))
    im.save(A('light-front.png'))


def wear_back():
    """Aged cream stock: soft warm mottling and a tea-coloured edge."""
    rnd = np.random.default_rng(11)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    m = np.asarray(Image.fromarray((rnd.random((14, 11)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC)).astype(float)
    m = (m - 128) / 128
    edge = np.minimum(np.minimum(xx, W - xx), np.minimum(yy, H - yy))
    e = np.clip(1 - (edge - B) / 150, 0, 1) ** 2
    lay = np.zeros((H, W, 4))
    lay[..., 0], lay[..., 1], lay[..., 2] = 150, 104, 52
    lay[..., 3] = (e * 70 + np.clip(m, 0, 1) * 14)
    Image.fromarray(lay.clip(0, 255).astype('uint8'), 'RGBA').save(A('wear-back.png'))


# ---------------- prop: brass dog licence tag ----------------
def licence_tag():
    """Round brass tag on a split ring, top-lit, stamped rim. 150x176 css px at 2x."""
    cw, ch = 300, 352
    im = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    cx, cy, r = 150, 200, 128
    sh = Image.new('L', (cw, ch), 0); ImageDraw.Draw(sh).ellipse([cx - r + 8, cy - r + 14, cx + r + 8, cy + r + 14], fill=150)
    sh = sh.filter(ImageFilter.GaussianBlur(10))
    s = Image.new('RGBA', (cw, ch), (40, 24, 10, 0)); s.putalpha(sh); im = Image.alpha_composite(im, s)
    yy, xx = np.mgrid[0:ch, 0:cw].astype(float)
    nx, ny = (xx - cx) / r, (yy - cy) / r
    rr = np.sqrt(nx * nx + ny * ny)
    disc = rr <= 1
    base = np.array([196, 150, 64.]); hi = np.array([250, 222, 150.]); lo = np.array([120, 84, 30.])
    t = np.clip(0.55 - 0.45 * (nx * -0.5 + ny * -0.7), 0, 1)
    col = lo + (hi - lo) * t[..., None]
    col = col * 0.6 + base * 0.4
    rim = (rr > 0.86) & (rr <= 1)
    col = np.where(rim[..., None], col * 0.82 + np.array([255, 230, 170.]) * 0.18 * (ny < 0)[..., None], col)
    groove = np.abs(rr - 0.84) < 0.012
    col = np.where(groove[..., None], col * 0.7, col)
    rnd = np.random.default_rng(2)
    col = col + (rnd.random((ch, cw)) - 0.5)[..., None] * 10       # brushed metal
    hole = np.sqrt((xx - cx) ** 2 + (yy - (cy - r + 22)) ** 2) < 11
    a = np.where(disc & ~hole, 255, 0)
    rgba = np.dstack([col.clip(0, 255), a]).astype('uint8')
    im = Image.alpha_composite(im, Image.fromarray(rgba, 'RGBA').filter(ImageFilter.GaussianBlur(0.5)))
    dr = ImageDraw.Draw(im)
    # split ring through the hole
    for wdt, c in [(9, (110, 110, 112, 255)), (4, (205, 205, 210, 255))]:
        dr.arc([cx - 34, cy - r - 58, cx + 34, cy - r + 26], 0, 360, fill=c, width=wdt)
    im.save(A('licence-tag.png'))


border('front', AMBER); border('back', RED); strip(); light_front(); wear_back(); licence_tag()


# ---------------- type pieces ----------------
def kicker(t, color, size=18, align='left', extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 22px; text-align: {align};{extra}">{t}</div>')


def head(kick, title, kc, tc, w=330, top=0):
    return (f'<div style="margin-top: {top}px">{kicker(kick, kc, 16)}'
            f'<div style="font-family: {DISP}; font-weight: 700; font-size: 40px; line-height: 46px; color: {tc}; margin-top: 2px">{title}</div>'
            f'<img src="assets/check-strip.png" alt="" style="display: block; width: {w}px; height: 10px; margin-top: 4px"></div>')


def item(name, price, desc, nc, dc, top=14, note=None, notec=None, size=27):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.25; color: {notec}; margin-top: 2px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.12; color: {nc}"><span>{name}</span><span style="white-space: nowrap">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.28; color: {dc}; margin-top: 2px">{desc}</div>{n}</div>')


def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'


def page(bg, layers, inner, top_layers):
    imgs = ''.join(f'<img src="assets/{f}" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; opacity: {o}">' for f, o in layers)
    tops = ''.join(f'<img src="assets/{f}" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; opacity: {o}">' for f, o in top_layers)
    return f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">{imgs}{inner}{tops}</div>'


# ---------------- front: the night out back ----------------
def front():
    o = []
    o.append(at(B, 58, W - 2 * B, kicker('Ristorante italiano, supper till late', AMBER, 18, 'center')))
    o.append(at(B, 78, W - 2 * B, f'<div style="font-family: {DISP}; font-weight: 700; font-size: 84px; line-height: 84px; color: {CANDLE}; '
                f'text-align: center; letter-spacing: 0.02em; text-shadow: 0 0 18px rgba(240,176,74,0.45)">Tony\'s</div>'))
    o.append(at(B, 184, W - 2 * B, f'<div style="font-family: {BODY}; font-style: italic; font-size: 21px; line-height: 1.2; color: {CREAM}; text-align: center">'
                'Spaghetti every night. The best table is out back.</div>'))
    # the hero still in a thin amber frame
    X, Y = 56, 226
    o.append(f'<div style="position: absolute; left: {X - 5}px; top: {Y - 5}px; width: {HW + 10}px; height: {HH + 10}px; border: 2px solid {AMBER}; box-sizing: border-box"></div>')
    o.append(f'<img src="assets/still-spaghetti.jpg" alt="One strand of spaghetti shared by candlelight behind Tony\'s" '
             f'style="position: absolute; left: {X}px; top: {Y}px; width: {HW}px; height: {HH}px; box-shadow: 0 8px 22px rgba(0,0,0,0.5)">')
    o.append(at(X, Y + HH + 12, HW, f'<div style="display: flex; justify-content: space-between; font-family: {BODY}; font-style: italic; font-size: 19px; color: {DIM}">'
                f'<span>Out back, by the barrels. One plate, one candle.</span><span style="color: {AMBER}">Regulars at the back door eat free</span></div>'))
    TOP = 644
    left = (head('Joe\'s kitchen', 'To Begin', AMBER, CREAM)
            + item('Garlic bread', '.10', 'Italian loaf, parsley butter, parmesan, baked crisp at the edges.', CREAM, DIM)
            + item('Antipasto for two', '.40', 'Salami, provolone, olives, artichoke hearts, roasted red peppers, torn bread.', CREAM, DIM))
    o.append(at(56, TOP, 330, left))
    o.append(f'<div style="position: absolute; left: 408px; top: {TOP + 6}px; width: 1px; height: 300px; background: {AMBER}; opacity: 0.35"></div>')
    right = (head('Every night', 'Specialty', AMBER, CREAM)
             + item('Spaghetti &amp; meatballs', '.35', 'Beef and pork meatballs, slow tomato and basil. Save the last meatball for your sweetheart.',
                    CANDLE, DIM, 14, 'For two, on one plate, .55', AMBER, 29))
    o.append(at(430, TOP, 330, right))
    # prop: the reservation card for two
    o.append(f'<div style="position: absolute; left: 448px; top: 896px; width: 300px; height: 98px; background: {PAPER}; '
             f'transform: rotate(-1.5deg); box-shadow: 0 6px 14px rgba(0,0,0,0.55)">'
             f'<img src="assets/check-strip.png" alt="" style="position: absolute; left: 0; top: 0; width: 300px; height: 12px">'
             f'<div style="position: absolute; left: 16px; top: 16px; width: 268px">'
             f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 24px; line-height: 26px; color: {RED}">Reserved</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.16em; color: {INK}">PARTY OF 2</div></div>'
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.2; color: {INK}; margin-top: 4px">Back door, by the barrels. Candle lit.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 30px; line-height: 30px; color: {NIGHT2}; margin-top: 2px">Butch and the lady</div></div></div>')
    return page(NIGHT, [('light-front.png', 1), ('paper-grain.png', 0.16)], ''.join(o), [('border-front.png', 1)])


# ---------------- back: the town by day ----------------
def back():
    o = []
    o.append(at(56, 58, 704, f'<div style="display: flex; justify-content: space-between">{kicker("Before supper, a stroll", RED, 18)}'
                f'{kicker("Est. 1901", RED, 18)}</div>'))
    o.append(at(56, 80, 704, f'<div style="font-family: {DISP}; font-weight: 700; font-size: 58px; line-height: 64px; color: {INK}">Up the Hill</div>'))
    X, Y = 56, 154
    o.append(f'<div style="position: absolute; left: {X - 5}px; top: {Y - 5}px; width: {PW + 10}px; height: {PH + 10}px; border: 2px solid {RED}; box-sizing: border-box"></div>')
    o.append(f'<img src="assets/avenue-1905.jpg" alt="Shaded walk and porches on a tree-lined avenue, about 1905" '
             f'style="position: absolute; left: {X}px; top: {Y}px; width: {PW}px; height: {PH}px">')
    o.append(at(X, Y + PH + 10, 520, f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.25; color: #4a4f66">'
                'The fine houses up the hill. Every one has a dog that knows our back door.</div>'))
    # prop: dog licence tag, hanging off the photo corner
    o.append(f'<div style="position: absolute; left: 622px; top: {Y - 38}px; width: 150px; height: 176px; transform: rotate(8deg)">'
             f'<img src="assets/licence-tag.png" alt="" style="position: absolute; left: 0; top: 0; width: 150px; height: 176px">'
             f'<div style="position: absolute; left: 0; top: 74px; width: 150px; text-align: center; color: #4a2f0c">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; line-height: 16px">DOG LICENSE</div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 30px; line-height: 34px">1910</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.08em; line-height: 16px">No. 55</div></div></div>')
    TOP = 444
    left = (head('From Joe\'s stove', 'Supper', RED, INK, 340)
            + item('Minestrone', '.15', 'Beans, greens, little pasta, tomato broth.', INK, '#3c4260', 12)
            + item('Chicken cacciatore', '.45', 'Braised with peppers, mushrooms, tomato.', INK, '#3c4260', 12)
            + head('Something sweet', 'Dolci', RED, INK, 340, 20)
            + item('Cannoli', '.10', 'Orange ricotta, chocolate chips, pistachio.', INK, '#3c4260', 12)
            + item('Spumoni', '.10', 'Cherry, pistachio and chocolate ice cream.', INK, '#3c4260', 12))
    o.append(at(56, TOP, 340, left))
    o.append(f'<div style="position: absolute; left: 418px; top: {TOP + 6}px; width: 1px; height: 420px; background: {RED}; opacity: 0.4"></div>')
    right = (head('No wine, all fizz', 'To Drink', RED, INK, 320)
             + item('Blood orange soda', '.05', 'Rosemary syrup, lemon, soda water.', INK, '#3c4260', 12, 'Red as the checked cloth.', RED)
             + item('Lemonade', '.05', 'Pressed lemons, cold from the ice box.', INK, '#3c4260', 10)
             + item('Espresso', '.05', 'Dark roast, a twist of peel.', INK, '#3c4260', 10)
             + item('Cold milk', '.03', 'A tall glass, or a saucer.', INK, '#3c4260', 10))
    o.append(at(440, TOP, 320, right))
    # Tony's note
    o.append(at(440, 828, 320, f'<div style="border-top: 2px solid {RED}; padding-top: 8px">'
                f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.28; color: {INK}">'
                'Every night my friend comes round the back for his supper. Tonight he brings a lady. Joe, the candle!</div>'
                f'<div style="font-family: {SCRIPT}; font-size: 40px; line-height: 40px; color: {RED}; margin-top: 2px; padding-left: 150px">Tony</div></div>'))
    o.append(at(56, 982, 704, f'<div style="display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: #4a4f66">'
                '<span>Prices subject to change. Telephone Main 1909. Form T-55.</span>'
                '<span>No muzzles out back. No cats, not even two.</span></div>'))
    return page(PAPER, [('wear-back.png', 1), ('paper-grain.png', 0.3)], ''.join(o), [('border-back.png', 1)])


FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tony\'s menu card</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
