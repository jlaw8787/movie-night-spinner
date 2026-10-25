"""Tangiers coffee shop, Las Vegas Strip, 1973. One landscape face, 1344x816, printed like a keno blank:
canary keno stock, Tangiers red and felt green inks, every dish has a keno spot number (two already marked
by a keno writer's brush). Signature: the Tangiers sign on the Strip (TMDB) plus a 1972 DOCUMERICA photo
of a Las Vegas casino sign (NARA, public domain). Props: a $25 Tangiers chip, a comp card signed by Ace.
Big gags: ten blueberries in every muffin (a real muffin photo, CC0, counted 1 to 10), the eye in the sky (type), Ace's rules.
Writes assets and front.body.html, front.html."""
import os, random, math
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
Image.MAX_IMAGE_PIXELS = None
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 1344, 816
PAPER, RED, GREEN, INK, MUTE, CARD = '#f6eed8', '#a3162a', '#1b100d', '#1d1510', '#5e4a30', '#fffaf0'
GOLD, GOLDL = '#b8892a', '#e8c06a'
GLOW = 'text-shadow: 0 0 5px rgba(255,214,140,0.85), 0 0 14px rgba(214,40,50,0.9), 0 0 30px rgba(214,40,50,0.55)'
FONTS = ('https://fonts.googleapis.com/css2?family=Gravitas+One&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;0,800;1,400'
         '&family=Herr+Von+Muellerhoff&display=swap')
DISP = "'Gravitas One', serif"; BODY = "'Libre Franklin', sans-serif"; SCRIPT = "'Herr Von Muellerhoff', cursive"

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

HE_W, HE_H = 406, 300
he = Image.open(S('16PhF3i6TL0jpPfpHGq1EJQZLYf.jpg')).convert('RGB')
he = ImageEnhance.Brightness(he).enhance(1.08)
fit(he, HE_W, HE_H, (700, 0, 3140, 1803)).save(A('ace-floor.jpg'), quality=90)

NA_W, NA_H = 236, 168
na = Image.open(S('nara-549015.tif')).convert('RGB')
na = ImageEnhance.Contrast(ImageEnhance.Brightness(na).enhance(1.18)).enhance(1.08)
r_, g_, b_ = na.split()
na = Image.merge('RGB', (r_, g_.point(lambda v: min(255, int(v * 1.03))), b_.point(lambda v: min(255, int(v * 1.1) + 4))))
fit(na, NA_W - 14, NA_H - 30, (60, 300, 2900, 1950)).save(A('neon-1972.jpg'), quality=90)

def wear():
    rnd = random.Random(73)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(36):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(70 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(16))
    mot = Image.new('L', (W // 24, H // 24), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 14))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(30))
    lay = Image.new('RGBA', (W, H), (120, 80, 30, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.45)))
    lay.save(A('wear-front.png'))
wear()

# ---------------- painted bits (PIL, 4x then down) ----------------
# the muffin: a real blueberry muffin photo (palewire on Flickr, CC0), cropped to the berry-studded top
MU_W, MU_H = 356, 92
mu = Image.open(S('flickr-palewire-3711698510.jpg')).convert('RGB')
mu = ImageEnhance.Contrast(ImageEnhance.Brightness(mu).enhance(1.06)).enhance(1.06)
fit(mu, MU_W - 4, MU_H, (140, 120, 900, 380)).save(A('blueberry-muffin.jpg'), quality=90)

def brush_x(name, seed, size=40):
    """A keno writer's brush mark, dark ink, slightly dry."""
    rnd = random.Random(seed); s = size * 4
    im = Image.new('RGBA', (s, s), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    for (x0, y0, x1, y1) in ((.16, .14, .86, .88), (.84, .12, .14, .86)):
        steps = 40
        for k in range(steps):
            t = k / steps
            x = (x0 + (x1 - x0) * t) * s + rnd.uniform(-1.5, 1.5); y = (y0 + (y1 - y0) * t) * s + rnd.uniform(-1.5, 1.5)
            w = s * (0.075 - 0.03 * abs(t - .35))
            d.ellipse([x - w, y - w, x + w, y + w], fill=(24, 22, 26, rnd.randint(205, 245)))
    im = im.filter(ImageFilter.GaussianBlur(1.2))
    im.resize((size * 2, size * 2), Image.LANCZOS).save(A(name))
brush_x('mark-a.png', 5); brush_x('mark-b.png', 9)

# ---------------- type pieces ----------------
def at(x, y, w, extra=''):
    return f'position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}'

def kicker(t, color=RED, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: {size}px; letter-spacing: 0.24em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def section(title, mark):
    """Keno-ticket section head: Gravitas title in red, right-hand 'MARK ANY n' tab in green, double rule."""
    return (f'<div style="position: relative; height: 56px; margin-top: 10px">'
            f'<div style="position: absolute; left: 0; top: 0; font-family: {DISP}; font-size: 34px; line-height: 40px; color: {RED}; white-space: nowrap">{title}</div>'
            f'<div style="position: absolute; left: 0; right: 0; top: 44px; border-top: 3px solid {GOLD}; border-bottom: 1px solid {GOLD}; height: 2px"></div>'
            f'<div style="position: absolute; right: 0; top: 33px; z-index: 2; background: {GREEN}; color: {GOLDL}; font-family: {BODY}; font-weight: 800; '
            f'font-size: 14px; letter-spacing: 0.16em; padding: 5px 8px 4px; line-height: 1">{mark}</div>' + '</div>')

def item(spot, name, price, desc, gap=14, mark=None):
    m = (f'<img src="assets/{mark}" alt="" aria-hidden="true" style="position: absolute; left: -4px; top: -6px; width: 44px; height: 44px">' if mark else '')
    return (f'<div style="position: relative; margin-top: {gap}px; padding-left: 52px">'
            f'<div style="position: absolute; left: 0; top: 0; width: 36px; height: 32px; border: 2px solid {RED}; box-sizing: border-box; '
            f'text-align: center; font-family: {BODY}; font-weight: 700; font-size: 17px; line-height: 28px; color: {RED}">{spot}{m}</div>'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-family: {BODY}; font-weight: 800; '
            f'font-size: 26px; line-height: 1.12; color: {INK}; text-transform: uppercase; letter-spacing: 0.01em">'
            f'<span>{name}</span><span style="color: {RED}; white-space: nowrap">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {INK}; margin-top: 3px">{desc}</div></div>')

def frame(img, alt, x, y, w, h, col=GOLD):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; border: 3px solid {col}; padding: 4px; background: {CARD}; '
            f'box-shadow: 0 2px 5px rgba(60,40,10,0.25)">'
            f'<img src="assets/{img}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')

# ---------------- props ----------------
def chip(x, y, rot=14):
    """A $25 Tangiers chip: felt green clay, six paper edge inserts, paper inlay with a red ring."""
    d = 120
    spots = ''.join(
        f'<div style="position: absolute; left: {d // 2 - 9}px; top: 0; width: 18px; height: {d}px; transform: rotate({a}deg)">'
        f'<div style="width: 18px; height: 12px; background: {CARD}"></div>'
        f'<div style="position: absolute; left: 0; bottom: 0; width: 18px; height: 12px; background: {CARD}"></div></div>'
        for a in (0, 60, 120))
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {d}px; height: {d}px; transform: rotate({rot}deg)">'
            f'<div style="position: absolute; left: 0; top: 0; width: {d}px; height: {d}px; border-radius: 50%; background: {RED}; '
            f'box-shadow: 0 4px 9px rgba(30,20,0,0.45); overflow: hidden">{spots}</div>'
            f'<div style="position: absolute; left: 7px; top: 7px; width: {d - 14}px; height: {d - 14}px; border-radius: 50%; box-sizing: border-box; border: 2px dashed rgba(255,251,234,0.55)"></div>'
            f'<div style="position: absolute; left: 20px; top: 20px; width: {d - 40}px; height: {d - 40}px; border-radius: 50%; background: {CARD}; '
            f'box-sizing: border-box; border: 3px solid {GOLD}; text-align: center">'
            f'<div style="font-family: {DISP}; font-size: 30px; line-height: 1; color: {RED}; margin-top: 14px">$25</div>'
            f'<div style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.06em; line-height: 1.1; color: {GREEN}; margin-top: 4px">TANGIERS</div>'
            f'</div></div>')

def comp_card(x, y, rot=-4):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 172px; height: 178px; transform: rotate({rot}deg); background: {CARD}; '
            f'box-shadow: 0 4px 10px rgba(40,25,0,0.35); box-sizing: border-box; border: 2px solid {GOLD}; padding: 10px 12px">'
            f'<div style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.18em; color: {GOLD}; line-height: 1.1">TANGIERS</div>'
            f'<div style="font-family: {DISP}; font-size: 22px; line-height: 1.05; color: {RED}; margin-top: 4px">COMP</div>'
            f'<div style="font-family: {BODY}; font-size: 15px; line-height: 1.25; color: {INK}; margin-top: 4px">Coffee shop, one guest, anything on the card.</div>'
            f'<div style="font-family: {SCRIPT}; font-size: 33px; line-height: 0.95; color: #1d2a6b; margin-top: 2px; white-space: nowrap">Sam Rothstein</div>'
            f'<div style="border-top: 1px solid {MUTE}; font-family: {BODY}; font-size: 14px; color: {MUTE}; line-height: 1.2; padding-top: 3px">No. 0010 &middot; Approved</div></div>')

# ---------------- the face ----------------
o = []
# column 1: sign, Strip photo, 1972 neon, comp card, chip
bulbs = lambda y: ''.join(f'<div style="position: absolute; left: {14 + k * 19.6:.1f}px; top: {y}px; width: 7px; height: 7px; border-radius: 50%; background: #ffe7a8; box-shadow: 0 0 5px 2px rgba(255,190,90,0.7)"></div>' for k in range(20))
o.append(f'<div style="{at(40, 40, 420, f"height: 134px; background: {GREEN}; box-shadow: 0 3px 8px rgba(30,10,0,0.35)")}">'
         f'<div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border: 2px solid {GOLD}"></div>'
         + bulbs(12) + bulbs(115) +
         f'<div style="position: absolute; left: 0; top: 26px; width: 420px; text-align: center; font-family: {DISP}; font-size: 52px; line-height: 1; color: #ffd98a; letter-spacing: 0.01em; white-space: nowrap; {GLOW}">TANGIERS</div>'
         f'<div style="position: absolute; left: 22px; right: 22px; top: 88px; display: flex; justify-content: space-between; align-items: baseline">'
         f'<span style="font-family: {DISP}; font-size: 18px; line-height: 1; color: {PAPER}; letter-spacing: 0.04em; white-space: nowrap">COFFEE SHOP</span>'
         f'<span style="font-family: {BODY}; font-weight: 800; font-size: 16px; letter-spacing: 0.16em; color: {GOLDL}; white-space: nowrap">ALL NIGHT</span></div></div>')
o.append(frame('ace-floor.jpg', 'Ace in a black silk suit, arms folded, on the Tangiers casino floor under a ceiling of gold lights', 40, 186, HE_W, HE_H))
o.append(f'<div style="{at(40, 510, 300)}font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.3; color: {MUTE}">Mr. Rothstein on the floor. Nothing gets past him.</div>')
o.append(chip(350, 440))
o.append(frame('neon-1972.jpg', 'A Las Vegas casino sign in thousands of orange bulbs spelling CASINO, 1972', 40, 568, NA_W - 14, NA_H - 30))
o.append(f'<div style="{at(40, 722, 236)}font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.25; color: {MUTE}">Fremont Street, last year. We burn brighter.</div>')
o.append(comp_card(290, 566))

# column 2: oyster bar, around the clock, eye in the sky
c2 = (section('OYSTER BAR', 'MARK ANY 2')
      + item(3, 'Clams casino', '2.25', 'Garlic butter, red pepper, crumbs and crisp bacon.')
      + item(21, 'Oysters Rockefeller', '2.95', 'On rock salt, spinach and scallion butter, a dash of anise.')
      + section('ALL NIGHT', 'MARK ANY 3')
      + item(73, 'Tangiers rib eye', '7.73', 'Basted in thyme and garlic butter, creamed spinach.')
      + item(24, 'Steak and eggs', '2.49', 'Two eggs any style, hash browns.')
      + item(7, 'Short stack', '.95', 'Whipped butter, warm syrup.'))
o.append(f'<div style="{at(490, 26, 400)}">{c2}</div>')
o.append(f'<div style="{at(490, 634, 400, f"height: 90px; box-sizing: border-box; border: 3px solid {RED}; outline: 1px solid {GOLD}; outline-offset: 3px; background: {CARD}")}">'
         f'<div style="position: absolute; left: 6px; top: 6px; width: 94px; height: 72px; box-sizing: border-box; background: {RED}; '
         f'display: flex; flex-direction: column; justify-content: center; text-align: center">'
         f'<div style="position: absolute; left: 3px; top: 3px; right: 3px; bottom: 3px; border: 1px solid {GOLDL}"></div>'
         f'<div style="position: relative; font-family: {BODY}; font-weight: 800; font-size: 14px; line-height: 1.12; letter-spacing: 0.12em; color: {CARD}">THE EYE<br>IN THE</div>'
         f'<div style="position: relative; font-family: {DISP}; font-size: 24px; line-height: 1.05; color: #ffd98a">SKY</div></div>'
         f'<div style="position: absolute; left: 112px; top: 10px; width: 276px">'
         f'<div style="font-family: {DISP}; font-size: 22px; line-height: 1.05; color: {RED}">WE SEE ALL.</div>'
         f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; line-height: 1.25; color: {INK}; margin-top: 4px">The eye in the sky never blinks. Every table, every muffin.</div></div></div>')

# column 3: the muffin, at the table, Ace's rules
berries = (f'<div style="position: relative; margin-top: 12px; border: 2px solid {GOLD}; line-height: 0">'
           f'<img src="assets/blueberry-muffin.jpg" alt="A real blueberry muffin, close up, berries showing through the golden top" style="display: block; width: {MU_W - 4}px; height: {MU_H}px"></div>'
           f'<div style="position: relative; display: flex; justify-content: space-between; margin-top: 4px; padding: 0 6px">'
           + ''.join(f'<div style="font-family: {BODY}; font-weight: 800; font-size: 14px; line-height: 1.2; color: {GOLDL}">{i + 1}</div>' for i in range(10))
           + '</div>')
muffin = (f'<div style="position: relative; box-sizing: border-box; background: {GREEN}; padding: 14px 14px 12px; box-shadow: 0 3px 8px rgba(30,10,0,0.35)">'
          f'<div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border: 2px solid {GOLD}"></div>'
          f'<div style="position: relative; display: flex; align-items: center; gap: 14px">'
          f'<div style="font-family: {DISP}; font-size: 70px; line-height: 0.9; color: #ffd98a; {GLOW}">10</div>'
          f'<div><div style="font-family: {BODY}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; color: {GOLDL}; line-height: 1.2">ACE&rsquo;S STANDARD</div>'
          f'<div style="font-family: {DISP}; font-size: 21px; line-height: 1.15; color: {PAPER}; margin-top: 2px">BLUEBERRIES.<br>EVERY MUFFIN.</div></div></div>'
          f'{berries}'
          f'<div style="position: relative; display: flex; justify-content: space-between; align-items: baseline; margin-top: 12px; font-family: {BODY}; font-weight: 800; font-size: 26px; line-height: 1.12; color: {PAPER}; text-transform: uppercase">'
          f'<span>Blueberry muffin</span><span style="color: {GOLDL}">.50</span></div>'
          f'<div style="position: relative; font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {PAPER}; margin-top: 3px">Buttermilk batter. Count them. We did.</div></div>')
c3 = (muffin
      + section('TO DRINK', 'MARK ANY 2')
      + item(25, 'Dry martini', '1.25', 'Gin, dry vermouth, a green olive.', gap=12)
      + item(1, 'Hot coffee', '.25', 'Refills on the house.', gap=12, mark='mark-b.png'))
c3_rules = True
rules = ['Same number of blueberries in every muffin. No exceptions.',
         'Three jackpots in twenty minutes? Somebody gets fired.',
         'Comps are signed by me. Period.',
         'Cheats leave by the back door.']
rl = ''.join(f'<div style="position: relative; display: flex; gap: 10px; margin-top: 7px"><span style="font-family: {DISP}; font-size: 18px; color: {GOLDL}; line-height: 1.3">{n}.</span>'
             f'<span style="font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {PAPER}">{t}</span></div>' for n, t in enumerate(rules, 1))
o.append(f'<div style="{at(920, 40, 384)}">{c3}<div style="margin-top: 16px; box-sizing: border-box; background: {RED}; padding: 14px 18px 16px; position: relative; box-shadow: 0 3px 8px rgba(30,10,0,0.35)">'
         f'<div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border: 2px solid {GOLD}"></div>'
         f'<div style="position: relative; display: flex; justify-content: space-between; align-items: baseline">'
         f'<span style="font-family: {DISP}; font-size: 28px; line-height: 1; color: #ffd98a">ACE&rsquo;S RULES</span>'
         f'<span style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; color: {GOLDL}">S.R.</span></div>{rl}</div></div>')

# fine print, column 2 foot
o.append(f'<div style="{at(490, 734, 400)}font-family: {BODY}; font-size: 16px; line-height: 1.25; color: {MUTE}">'
         f'Prices subject to change. Tangiers Hotel, Las Vegas. Philip Green, Chairman. &copy; 1973</div>')

def page(inner):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/wear-front.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            f'<div style="position: absolute; left: 14px; top: 14px; width: {W - 28}px; height: {H - 28}px; box-sizing: border-box; border: 3px solid {GOLD}"></div>'
            f'<div style="position: absolute; left: 20px; top: 20px; width: {W - 40}px; height: {H - 40}px; box-sizing: border-box; border: 1px solid {RED}"></div>'
            f'<div style="position: absolute; left: 475px; top: 40px; width: 0; height: 736px; border-left: 1px dashed {GOLD}"></div>'
            f'<div style="position: absolute; left: 905px; top: 40px; width: 0; height: 736px; border-left: 1px dashed {GOLD}"></div>'
            + inner + '</div>')

body = page(''.join(o))
open(os.path.join(D, 'front.body.html'), 'w').write(body)
open(os.path.join(D, 'front.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Tangiers coffee shop menu</title>'
    f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{body}</body></html>')
print('built')
