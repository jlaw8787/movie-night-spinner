"""Julie's dinner party menu, Long Island City, Queens, 2002, cooked from Julia's book.
Folded card, two landscape faces 1123x794 (A4 landscape, folds to a 148x210 card).
Outside: Paris, 1949 (Julia). Back cover = Julia's table; front cover = title and the 1949 Left Bank watercolor.
Inside: Queens, 2002 (Julie). Left = the kitchen table still, Julie's note, day counter, blog comment card; right = the dinner.
Palette: Paris blue, butter yellow, tomato red, on butter cream stock. Display: Cherry Swash.
Writes image crops, painted paper, band and butter wrapper, outside/inside .body.html and .html."""
import os, math, random
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageOps
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
Image.MAX_IMAGE_PIXELS = None
W, H = 1123, 794
FOLD = 561.5
M = 40
PAPER, BLUE, NAVY, BUTTER, TOMATO, MUTED = '#f8eccb', '#2c5c8f', '#1d3049', '#f3d36b', '#cf3f2a', '#4f5a68'
FONTS = ('https://fonts.googleapis.com/css2?family=Cherry+Swash:wght@400;700'
         '&family=EB+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Nothing+You+Could+Do&display=swap')
DISP = "'Cherry Swash', serif"; BODY = "'EB Garamond', serif"; SCRIPT = "'Nothing You Could Do', cursive"
LX, PW = M, 481                    # left panel
RX = 602                           # right panel x (481 wide, ends 1083)


def fit(im, w, h, cx=0.5, cy=0.5):
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = int((sw - cw) * cx), int((sh - ch) * cy)
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)


def lift(im, gamma=0.9, warm=1.0, sat=1.0, con=1.0):
    a = np.asarray(im.convert('RGB')).astype(float) / 255
    a = a ** gamma
    a[..., 0] *= warm; a[..., 2] /= warm
    im = Image.fromarray((a.clip(0, 1) * 255).astype('uint8'))
    im = ImageEnhance.Color(im).enhance(sat)
    return ImageEnhance.Contrast(im).enhance(con)


# ---------------- pictures ----------------
# Paris: Victor A. Lundy, Place St. Andre des Arts, 1949 (LoC, no known restrictions). Sketchbook spiral cropped off.
WC_W, WC_H = 322, 424
wc = Image.open(S('lundy-49824.jpg')).convert('RGB').crop((210, 600, 5470, 7540))
wc = lift(wc, 0.78, 1.04, 1.1, 1.04)
fit(wc, WC_W, WC_H, 0.5, 0.45).save(A('paris-1949.jpg'), quality=90)

# Julia at the fish market (TMDB still), bright, the chalk price board kept in.
JM_W, JM_H = PW - 6, 190
jm = Image.open(S('1fQgpbNHwgNh6rAL6xch8y0XwQI.jpg')).convert('RGB')
fit(lift(jm, 0.95, 1.01, 1.02, 1.03), JM_W, JM_H, 0.5, 0.62).save(A('julia-market.jpg'), quality=90)

# Julie and Eric at the kitchen table with the Reine de Saba (TMDB still), lifted out of the shadows.
JT_W, JT_H = PW - 6, 252
jt = Image.open(S('l9BFVhzBaB2w7lJ0UjtK00ooHgI.jpg')).convert('RGB')
fit(lift(jt, 0.74, 1.02, 1.04, 1.02), JT_W, JT_H, 0.5, 0.35).save(A('julie-table.jpg'), quality=90)


# ---------------- paper: soft warm vignette, gentle mottling, fold shading ----------------
def paper(name, seed):
    rnd = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    edge = np.minimum(np.minimum(xx, W - xx), np.minimum(yy, H - yy))
    vig = (np.clip(1 - edge / 120, 0, 1) ** 2) * 70
    blot = Image.fromarray((rnd.random((H // 60, W // 60)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC)
    blot = blot.filter(ImageFilter.GaussianBlur(40))
    vig += (np.asarray(blot, float) / 255) * 16
    fold = np.exp(-((xx - FOLD) / 5) ** 2) * 30 + np.exp(-((xx - FOLD - 7) / 10) ** 2) * -10
    lay = np.zeros((H, W, 4))
    lay[..., 0], lay[..., 1], lay[..., 2] = 150, 104, 40
    lay[..., 3] = np.clip(vig + np.clip(fold, 0, None), 0, 255)
    Image.fromarray(lay.astype('uint8'), 'RGBA').save(A(f'paper-{name}.png'))
paper('outside', 4); paper('inside', 11)


# ---------------- band: the red-and-cream rosette repeat from the book's cover cloth ----------------
def band():
    s = 4; tw, th = 32 * s, 16 * s
    im = Image.new('RGBA', (tw, th), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    red = (207, 63, 42, 255)
    def rosette(cx, cy, r):
        for k in range(4):
            a = k * math.pi / 2
            px, py = cx + math.cos(a) * r * 0.55, cy + math.sin(a) * r * 0.55
            d.ellipse([px - r * 0.5, py - r * 0.5, px + r * 0.5, py + r * 0.5], fill=red)
        d.ellipse([cx - r * 0.22, cy - r * 0.22, cx + r * 0.22, cy + r * 0.22], fill=(248, 236, 203, 255))
    rosette(8 * s, 8 * s, 6.2 * s)
    d.ellipse([24 * s - 1.6 * s, 8 * s - 1.6 * s, 24 * s + 1.6 * s, 8 * s + 1.6 * s], fill=red)
    im = im.resize((64, 32), Image.LANCZOS)
    im.save(A('band.png'))
band()


# ---------------- butter wrapper: waxed paper, folded ends, soft creases ----------------
def butter():
    cw, ch = 440, 240
    rnd = np.random.default_rng(8)
    im = Image.new('RGBA', (cw, ch), (0, 0, 0, 0))
    sh = Image.new('L', (cw, ch), 0); ImageDraw.Draw(sh).rectangle([14, 18, cw - 8, ch - 6], fill=110)
    sh = sh.filter(ImageFilter.GaussianBlur(9))
    shadow = Image.new('RGBA', (cw, ch), (90, 60, 20, 0)); shadow.putalpha(sh)
    im = Image.alpha_composite(im, shadow)
    yy, xx = np.mgrid[0:ch, 0:cw].astype(float)
    base = np.zeros((ch, cw, 4))
    base[..., 0], base[..., 1], base[..., 2] = 251, 245, 222
    cre = Image.fromarray((rnd.random((ch // 24, cw // 24)) * 255).astype('uint8')).resize((cw, ch), Image.BICUBIC)
    g = (np.asarray(cre, float) - 128) / 128 * 7
    for x0, amp in [(70, 9), (370, 9), (215, 4)]:
        g -= np.exp(-((xx - x0) / 3) ** 2) * amp
        g += np.exp(-((xx - x0 - 5) / 6) ** 2) * amp * 0.5
    g += 6 * np.sin(yy / 31 + xx / 57)
    for c in range(3): base[..., c] += g
    inside = (xx > 6) & (xx < cw - 6) & (yy > 6) & (yy < ch - 12)
    base[..., 3] = np.where(inside, 246, 0)
    lay = Image.fromarray(base.clip(0, 255).astype('uint8'), 'RGBA')
    im = Image.alpha_composite(im, lay)
    d = ImageDraw.Draw(im)
    for x0 in (70, 370):        # folded end flaps, a touch darker
        pass
    d.rectangle([6, 6, 70, ch - 12], fill=(240, 230, 200, 70))
    d.rectangle([370, 6, cw - 6, ch - 12], fill=(240, 230, 200, 70))
    im.save(A('butter.png'))
butter()

# shared grain
import shutil
shutil.copy(os.path.join(D, '..', 'jurassic', 'src', 'assets', 'paper-grain.png'), A('paper-grain.png'))


# ---------------- type pieces ----------------
def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'

def kicker(t, color=TOMATO, size=18, align='left', ls='0.2em'):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: {ls}; color: {color}; '
            f'text-transform: uppercase; line-height: 22px; text-align: {align}">{t}</div>')

def bar(t, bg, right='', fg=BUTTER):
    r = (f'<span style="font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.18em; text-transform: uppercase; color: {fg}">{right}</span>'
         if right else '')
    return (f'<div style="position: relative; height: 46px; background: {bg}; display: flex; justify-content: space-between; align-items: center; '
            f'padding: 0 18px 0 20px; box-sizing: border-box">'
            f'<div style="position: absolute; left: 0; top: 0; width: 6px; height: 46px; background: {PAPER}; opacity: 0.0"></div>'
            f'<span style="font-family: {DISP}; font-weight: 700; font-size: 40px; line-height: 46px; color: {fg}">{t}</span>{r}</div>')

def item(name, price, desc, top=8, note=None, ncol=TOMATO):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 22px; color: {ncol}; margin-top: 2px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 27px; line-height: 31px; color: {NAVY}"><span>{name}</span><span style="color: {BLUE}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 25px; color: {NAVY}; margin-top: 1px">{desc}</div>{n}</div>')

def photo(src, alt, x, y, w, h, frame, extra=''):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w + 6}px; height: {h + 6}px; background: {frame};{extra}">'
            f'<img src="assets/{src}" alt="{alt}" style="position: absolute; left: 3px; top: 3px; width: {w}px; height: {h}px; display: block"></div>')

def page(name, inner):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; opacity: 0.32">'
            f'<img src="assets/paper-{name}.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px">'
            f'<div style="position: absolute; left: 0; top: 10px; width: {W}px; height: 16px; background-image: url(assets/band.png); background-size: 32px 16px; background-repeat: repeat-x; opacity: 0.9"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 26}px; width: {W}px; height: 16px; background-image: url(assets/band.png); background-size: 32px 16px; background-repeat: repeat-x; opacity: 0.9"></div>'
            f'{inner}</div>')


# ---------------- outside: Paris, 1949 ----------------
def outside():
    o = []
    # back cover: Julia's table
    o.append(at(LX, 40, PW, kicker("81, rue de l'Universit&eacute;, Paris")))
    o.append(at(LX, 62, PW, f'<div style="font-family: {DISP}; font-weight: 700; font-size: 64px; line-height: 68px; color: {BLUE}">Paris, 1949</div>'))
    o.append(at(LX, 134, PW, f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 25px; color: {NAVY}">'
                'Where it all began: a lunch in Rouen, a cooking class full of men in white, and a mountain of onions.</div>'))
    o.append(photo('julia-market.jpg', 'Julia at a Paris fish market', LX, 194, JM_W, JM_H, BLUE))
    o.append(at(LX, 394, PW, f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 22px; color: {MUTED}">'
                'Julia at the fish market. The sole, 70 francs the kilo.</div>'))
    menu = (bar("Julia's table", BLUE, 'In old francs')
            + item('Sole meuni&egrave;re', '70 fr', 'Whole sole dusted in flour, browned in butter, lemon, parsley.', 8,
                   'Rouen, the first lunch. Paul ordered.')
            + item("Soupe &agrave; l'oignon", '45 fr', 'Onions cooked slow, beef broth, toast, melted cheese.', 8,
                   'A mountain of onions, chopped by hand.')
            + item('Goug&egrave;res', '30 fr', 'Warm Gruy&egrave;re choux puffs, a grating of nutmeg.', 8))
    o.append(at(LX, 426, PW, menu))

    # front cover
    o.append(at(RX, 40, PW, kicker('A dinner from the book', TOMATO, 18, 'center')))
    o.append(at(RX, 58, PW, f'<div style="font-family: {DISP}; font-weight: 700; font-size: 72px; line-height: 80px; color: {BLUE}; text-align: center">'
                f'Julie <span style="color: {TOMATO}">&amp;</span> Julia</div>'))
    o.append(at(RX, 138, PW, f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 24px; color: {NAVY}; text-align: center">'
                'Paris, 1949 &nbsp;and&nbsp; Queens, 2002</div>'))
    wx = RX + (PW - WC_W - 6) // 2 + 34
    o.append(photo('paris-1949.jpg', 'Watercolor of a Left Bank street, Paris, 1949', wx, 176, WC_W, WC_H, BLUE,
                   ' box-shadow: 0 3px 10px rgba(60,40,10,0.25)'))
    # butter wrapper prop, over the watercolor's lower left corner
    o.append(f'<div style="position: absolute; left: {RX - 4}px; top: 488px; width: 220px; height: 120px; transform: rotate(-7deg)">'
             f'<img src="assets/butter.png" alt="" style="position: absolute; left: 0; top: 0; width: 220px; height: 120px">'
             f'<div style="position: absolute; left: 36px; top: 12px; width: 150px; text-align: center">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.24em; color: {BLUE}; line-height: 18px">BEURRE DOUX</div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 34px; line-height: 36px; color: {BLUE}">Butter</div>'
             f'<div style="height: 2px; background: {TOMATO}; margin: 2px 18px 3px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 18px; color: {TOMATO}">You can never have<br>too much.</div>'
             f'</div></div>')
    o.append(at(RX + 20, 616, PW - 40, f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 22px; color: {MUTED}; text-align: center">'
                'The Left Bank, painted in 1949, the year Julia went to cooking school.</div>'))
    o.append(at(RX, 668, PW, f'<div style="font-family: {DISP}; font-weight: 700; font-size: 28px; line-height: 32px; color: {TOMATO}; text-align: center">'
                '365 days. 524 recipes.</div>'
                f'<div style="font-family: {BODY}; font-size: 18px; line-height: 22px; color: {NAVY}; text-align: center; margin-top: 2px">'
                'One tiny kitchen in Queens. Bon app&eacute;tit!</div>'))
    o.append(at(RX, 730, PW, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 20px; color: {MUTED}; text-align: center">'
                "L'&Eacute;cole des Trois Gourmandes. Watercolor, V. A. Lundy.</div>"))
    return page('outside', ''.join(o))


# ---------------- inside: Queens, 2002 ----------------
def inside():
    o = []
    o.append(at(LX, 40, PW, kicker('Long Island City, Queens, N.Y.')))
    o.append(at(LX, 62, PW, f'<div style="font-family: {DISP}; font-weight: 700; font-size: 64px; line-height: 68px; color: {BLUE}">Queens, 2002</div>'))
    o.append(photo('julie-table.jpg', 'Julie and Eric at the kitchen table with the chocolate almond cake', LX, 140, JT_W, JT_H, TOMATO))
    o.append(at(LX, 404, PW, f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 22px; color: {MUTED}">'
                'Our kitchen table, and the Queen of Sheba, going fast.</div>'))
    o.append(at(LX, 440, PW, f'<div style="font-family: {BODY}; font-size: 20px; line-height: 26px; color: {NAVY}">'
                'Welcome, everybody. Everything tonight comes out of Julia\'s book, cooked in a kitchen the size of a closet. '
                'The beef is attempt number two. I fell asleep on attempt one. Please do not look in the trash.</div>'))
    o.append(at(LX + 250, 556, 220, f'<div style="font-family: {SCRIPT}; font-size: 38px; line-height: 42px; color: {BLUE}">Julie</div>'))
    # prop: blog comment card
    o.append(f'<div style="position: absolute; left: {LX + 6}px; top: 616px; width: 292px; height: 128px; background: #fffdf6; transform: rotate(-2.5deg); '
             f'box-shadow: 0 3px 9px rgba(70,50,20,0.28); border-top: 6px solid {BLUE}; box-sizing: border-box; padding: 9px 14px 0">'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.16em; color: {BLUE}; line-height: 18px">COMMENTS (17)</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 21px; color: {NAVY}; margin-top: 4px">'
             'Did the lobsters make it? I check this blog before I check my email.</div>'
             f'<div style="font-family: {BODY}; font-size: 14px; line-height: 18px; color: {MUTED}; margin-top: 5px">posted by a reader, 11:42 P.M.</div></div>')
    # prop: the day counter, a tear-off block
    o.append(f'<div style="position: absolute; left: {LX + 326}px; top: 600px; width: 148px; height: 150px; background: #fffdf6; transform: rotate(3deg); '
             f'box-shadow: 0 3px 9px rgba(70,50,20,0.3); text-align: center">'
             f'<div style="height: 30px; background: {TOMATO}; font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.2em; color: {BUTTER}; line-height: 30px">DAY</div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 64px; line-height: 64px; color: {NAVY}; margin-top: 2px">1</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 16px; line-height: 19px; color: {NAVY}">of 365</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 19px; color: {TOMATO}">524 recipes</div>'
             f'<div style="position: absolute; left: 0; top: 30px; width: 148px; height: 2px; background: repeating-linear-gradient(90deg, #d9cfb4 0 4px, transparent 4px 8px)"></div></div>')

    # the dinner
    o.append(at(RX, 40, PW, kicker("At Julie's, above the pizza place")))
    o.append(at(RX, 62, PW, f'<div style="font-family: {DISP}; font-weight: 700; font-size: 64px; line-height: 68px; color: {BLUE}">The Dinner</div>'))
    menu = (bar('To start', TOMATO, 'Priced at cost')
            + item('Kir', '$3.65', 'Dry white Burgundy poured over cr&egrave;me de cassis, a blackberry.', 8)
            + item("Julie's bruschetta", '$5.24', 'Toasted ciabatta rubbed with garlic, ripe tomato, basil, olive oil.', 8)
            + '<div style="height: 8px"></div>'
            + bar('The main event', TOMATO)
            + item('Lobster, melted butter', '$26.00', 'Two live lobsters, boiled, lemon and drawn butter.', 8,
                   'Bought live. There was screaming.')
            + item('Boeuf bourguignon', '$31.50', 'Beef in red Burgundy, bacon, carrots, pearl onions, mushrooms.', 8,
                   'Attempt number two. Nobody fell asleep.')
            + item('P&acirc;t&eacute; de canard en cro&ucirc;te', '$20.02', 'Whole duck, boned, stuffed with pork and veal, in pastry.', 8,
                   'Boned by hand. It took a while.')
            + f'<div style="height: 2px; background: {BLUE}; margin-top: 14px"></div>'
            + item('Reine de Saba', '$8.15', 'Chocolate almond cake, soft middle, dark chocolate glaze.', 8))
    o.append(at(RX, 136, PW, menu))
    o.append(at(RX, 734, PW, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 20px; color: {MUTED}; text-align: right">'
                'Prices are the grocery bill. No Cobb salad.</div>'))
    return page('inside', ''.join(o))


FACES = {'outside': outside(), 'inside': inside()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Julie &amp; Julia dinner card</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
