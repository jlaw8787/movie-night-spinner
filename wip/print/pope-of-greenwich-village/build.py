"""Benedetto's, a Village restaurant on Bleecker Street, 1984, where Charlie Moran is captain (maitre d').
Captain's reservation-book style menu, two faces 816x1056 (US Letter).
Front: book cover page, LoC Bleecker Street photo (signature), tonight's reservation book, reserved table card.
Back: the bill of fare on ledger-ruled stock, Charlie still and note, Paulie's betting slip.
Paper: pale ledger green. Inks: bottle green and oxblood."""
import os, random
from PIL import Image, ImageDraw, ImageFilter, ImageChops, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = lambda f: os.path.join(D, 'assets', f)
S = lambda f: os.path.join(D, 'src', f)
W, H = 816, 1056
PAPER, INK, RED, MUTE, RULE = '#eeeedd', '#1d3a2f', '#8a2230', '#4b5a50', 'rgba(29,58,47,0.22)'
FONTS = ('https://fonts.googleapis.com/css2?family=Prociono&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400'
         '&family=Nothing+You+Could+Do&display=swap')
DISP = "'Prociono', serif"; BODY = "'Libre Baskerville', serif"; HAND = "'Nothing You Could Do', cursive"
L, R = 84, 768
CW = R - L

# ---------------- photos ----------------
def fit(im, w, h, box=None):
    if box: im = im.crop(box)
    sw, sh = im.size; r = w / h
    cw, ch = (int(sh * r), sh) if sw / sh > r else (sw, int(sw / r))
    x, y = (sw - cw) // 2, (sh - ch) // 2
    return im.crop((x, y, x + cw, y + ch)).resize((w * 2, h * 2), Image.LANCZOS)

PH_W, PH_H = CW - 12, 372
st = Image.open(S('8d23898.tif')).convert('L')
st = ImageEnhance.Contrast(ImageEnhance.Brightness(st).enhance(1.1)).enhance(1.05)
fit(st, PH_W, PH_H, (333, 520, 4500, 2900)).convert('RGB').save(A('bleecker-1942.jpg'), quality=90)

ch = Image.open(S('kTwweg7r2XBU38CNjRt3KPmit3V.jpg')).convert('RGB')
ch = ImageEnhance.Brightness(ch).enhance(1.25)
fit(ch, 296, 226, (980, 60, 3300, 2160)).save(A('still-captain.jpg'), quality=90)

def wear(name, seed):
    rnd = random.Random(seed)
    m = Image.new('L', (W, H), 0); md = ImageDraw.Draw(m)
    for i in range(34):
        md.rectangle([i, i, W - 1 - i, H - 1 - i], outline=max(0, int(64 - i * 2)))
    m = m.filter(ImageFilter.GaussianBlur(14))
    mot = Image.new('L', (W // 18, H // 18), 0)
    for x in range(mot.width):
        for y in range(mot.height):
            mot.putpixel((x, y), rnd.randint(0, 12))
    mot = mot.resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(28))
    lay = Image.new('RGBA', (W, H), (80, 74, 40, 0)); lay.putalpha(ImageChops.add(m, mot).point(lambda v: int(v * 0.5)))
    lay.save(A(f'wear-{name}.png'))
wear('front', 19); wear('back', 84)

# ---------------- pieces ----------------
def kicker(t, color=RED, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def spine():
    """Cloth spine of the captain's book, with a stitched line and two ribbon bookmarks."""
    return (f'<div style="position: absolute; left: 0; top: 0; width: 44px; height: {H}px; background: {INK}"></div>'
            f'<div style="position: absolute; left: 34px; top: 0; width: 0; height: {H}px; border-left: 2px dashed rgba(238,238,221,0.55)"></div>'
            f'<div style="position: absolute; left: 44px; top: 0; width: 6px; height: {H}px; background: linear-gradient(90deg, rgba(0,0,0,0.28), rgba(0,0,0,0))"></div>'
            # ledger margin: double red rule
            f'<div style="position: absolute; left: 66px; top: 0; width: 0; height: {H}px; border-left: 1.5px solid rgba(138,34,48,0.55)"></div>'
            f'<div style="position: absolute; left: 70px; top: 0; width: 0; height: {H}px; border-left: 1.5px solid rgba(138,34,48,0.55)"></div>')

def item(name, price, desc, gap=14):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 26px; line-height: 1.15; color: {INK}"><span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.32; color: {INK}; margin-top: 4px">{desc}</div></div>')

def section(sub, title):
    return (f'<div style="margin-top: 26px">{kicker(sub, size=17)}'
            f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1.05; color: {INK}; margin-top: 4px; '
            f'border-bottom: 3px double {INK}; padding-bottom: 6px">{title}</div></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            + spine() + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def reserved(o, x, y):
    """Tented table card, the captain's own, filled in in Charlie's hand."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 232px; height: 132px; background: #fbfaf2; '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.45); transform: rotate(-4deg); border-top: 10px solid {RED}; box-sizing: border-box; text-align: center">'
             f'<div style="font-family: {DISP}; font-size: 38px; line-height: 1; color: {INK}; letter-spacing: 0.14em; margin-top: 12px">RESERVED</div>'
             f'<div style="width: 150px; margin: 8px auto 0; border-top: 1px solid {RED}"></div>'
             f'<div style="font-family: {HAND}; font-size: 22px; line-height: 1.2; color: #23356a; margin-top: 8px">Moran, party of 2.<br>Charlie\'s, opening soon</div></div>')

def slip(o, x, y):
    """Paulie's win ticket on his racehorse, pencilled on the back."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 250px; height: 124px; background: #f4e7cf; '
             f'box-shadow: 0 4px 10px rgba(0,0,0,0.42); transform: rotate(-3deg); box-sizing: border-box; padding: 10px 14px 0; '
             f'border-left: 2px dashed #b9a684">'
             f'<div style="display: flex; justify-content: space-between; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.16em; color: {RED}; line-height: 1">'
             f'<span>WIN TICKET</span><span>RACE 7</span></div>'
             f'<div style="display: flex; align-items: baseline; gap: 12px; margin-top: 10px">'
             f'<div style="font-family: {DISP}; font-size: 44px; line-height: 0.9; color: {INK}">$20</div>'
             f'<div style="font-family: {BODY}; font-weight: 700; font-size: 15px; line-height: 1.25; color: {INK}">TO WIN<br>HORSE No. 4</div></div>'
             f'<div style="border-top: 1px solid #b9a684; margin-top: 7px; padding-top: 4px; font-family: {HAND}; font-size: 20px; line-height: 1.15; color: #4a4a4a">'
             'Our horse. Can\'t lose. P.</div></div>')

# ---------------- FRONT: the captain's book ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("The captain&#39;s book &nbsp;&middot;&nbsp; Friday")}{kicker("Page 84", color=MUTE)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 3}px; top: 70px; width: {CW}px; font-family: {DISP}; font-size: 92px; '
             f'line-height: 1.05; color: {INK}; white-space: nowrap">Benedetto&#39;s</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 172px; width: {CW}px; display: flex; justify-content: space-between; align-items: baseline; '
             f'border-top: 3px double {INK}; padding-top: 10px; font-family: {BODY}; font-size: 20px; color: {INK}; line-height: 1.2">'
             f'<span>Bleecker Street &middot; Dinner from five</span><span style="font-style: italic">Charlie Moran, captain</span></div>')

    o.append(f'<div style="position: absolute; left: {L}px; top: 222px; width: {PH_W}px; height: {PH_H}px; border: 2px solid {INK}; '
             f'outline: 1.5px solid {RED}; outline-offset: 3px">'
             f'<img src="assets/bleecker-1942.jpg" alt="Five neighbourhood boys in plaid coats blowing tin horns on Bleecker Street, brick tenements and a fire escape behind them" '
             f'style="display: block; width: {PH_W}px; height: {PH_H}px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 610px; width: 420px; font-family: {BODY}; font-style: italic; font-size: 18px; '
             f'line-height: 1.35; color: {MUTE}">Bleecker Street, New Year&#39;s Eve. This block has always blown its own horn.</div>')
    reserved(o, 528, 520)

    rows = [('7:00', 'Mr. Grant', '6', '1', 'His table. Nobody else sits there.'),
            ('7:30', 'Barney', '2', '9', 'Back booth, facing the door.'),
            ('8:00', 'Diane', '2', '4', 'Charlie&#39;s guest. Best candle.'),
            ('8:15', 'Det. Ritter', '1', 'Bar', 'Not eating. Just collecting.'),
            ('8:45', 'Paulie', '1', 'Back', 'Staff. Stop seating him.'),
            ('10:30', 'Bed-Stuy party', '3', '12', 'Paulie&#39;s friends. Cash up front.')]
    cols = 'display: grid; grid-template-columns: 62px 196px 40px 52px 1fr; column-gap: 10px; align-items: baseline'
    body = ''
    for t, n, p, tb, note in rows:
        body += (f'<div style="{cols}; border-bottom: 1px solid {RULE}; padding: 8px 8px 7px; font-family: {BODY}; color: {INK}">'
                 f'<div style="font-weight: 700; font-size: 18px; color: {RED}">{t}</div>'
                 f'<div style="font-weight: 700; font-size: 18px; white-space: nowrap">{n}</div>'
                 f'<div style="font-size: 18px; text-align: center">{p}</div>'
                 f'<div style="font-size: 18px; text-align: center">{tb}</div>'
                 f'<div style="font-style: italic; font-size: 17px; line-height: 1.25">{note}</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 666px; width: {CW}px">'
             f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
             f'<div style="font-family: {DISP}; font-size: 42px; line-height: 1; color: {INK}">Tonight&#39;s Book</div>'
             f'{kicker("Seated by the captain", size=16)}</div>'
             f'<div style="{cols}; background: {INK}; color: {PAPER}; padding: 7px 8px; margin-top: 10px; font-family: {BODY}; font-weight: 700; '
             f'font-size: 14px; letter-spacing: 0.14em">'
             f'<div>TIME</div><div>PARTY</div><div style="text-align: center">NO.</div><div style="text-align: center">TBL.</div><div>CAPTAIN&#39;S NOTE</div></div>'
             f'{body}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 990px; width: {CW}px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             'Parties of six or more, see the captain. The menu is inside.</div>')
    return page(''.join(o), 'front')

# ---------------- BACK: the bill of fare ----------------
def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Benedetto&#39;s &nbsp;&middot;&nbsp; Bill of fare")}{kicker("Page 85", color=MUTE)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 78px; width: 296px; height: 226px; border: 2px solid {INK}; outline: 1.5px solid {RED}; outline-offset: 3px">'
             f'<img src="assets/still-captain.jpg" alt="Charlie in a grey suit and tie with Diane among the tables of the dining room" '
             f'style="display: block; width: 296px; height: 226px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 314px; width: 310px; font-family: {BODY}; font-style: italic; font-size: 16px; '
             f'line-height: 1.3; color: {MUTE}">Your captain on the floor, Friday night.</div>')
    o.append(f'<div style="position: absolute; left: 412px; top: 74px; width: {R - 412}px">'
             f'{kicker("A word from the captain", size=16)}'
             f'<div style="font-family: {DISP}; font-size: 38px; line-height: 1.06; color: {INK}; margin-top: 8px">Everybody here eats like the Pope.</div>'
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.4; color: {INK}; margin-top: 10px">'
             'Order the veal. Ask for the zabaglione and I&#39;ll whisk it at your table. '
             'Some day I&#39;ll have my own place. Till then, this one&#39;s yours.</div>'
             f'<div style="font-family: {HAND}; font-size: 32px; line-height: 1; color: {RED}; margin-top: 6px">Charlie</div></div>')

    left = (section('To begin', 'Antipasti')
            + item('Clams oreganata', '4.50', 'On the half shell under garlic, oregano and parmesan crumbs.')
            + item('Prosciutto e melone', '5.25', 'Ripe cantaloupe, sliced ham, bocconcini in basil oil.')
            + section('From the bar', 'With a flourish')
            + item('Americano', '4.00', 'Red aperitivo, sweet vermouth, soda and orange. Paulie&#39;s tab.'))
    right = (section('The main course', 'Secondi')
             + item('Veal marsala', '15.00', 'Escalopes seared in butter, button mushrooms, glossy wine sauce.')
             + item('Linguine vongole', '11.50', 'White clam sauce: littlenecks, garlic, parsley, olive oil.')
             + section('Something sweet', 'Dolci')
             + item('Zabaglione', '6.50', 'Marsala custard whisked warm at your table, over strawberries.')
             + item('Cannoli', '2.75', 'Sweet ricotta, candied orange, chocolate chips.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 334px; width: 326px">{left}</div>')
    o.append(f'<div style="position: absolute; left: 442px; top: 334px; width: {R - 442}px">{right}</div>')
    slip(o, 110, 866)
    o.append(f'<div style="position: absolute; left: 442px; top: 966px; width: {R - 442}px; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             'Espresso 1.25. Prices subject to change. 84 Bleecker St. Form 1984.</div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Benedetto\'s menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
