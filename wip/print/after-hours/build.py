"""Last Stop, a SoHo bar and grill, 1985 (After Hours). The bar's own two-sided table card, US Letter.
Front: night-teal card stock with the bar's neon sign printed flat in red ink, a still of Julie at a table,
and the grill. Back: Julie-yellow card with the rest of the menu, the bar still, Tom's note and a guest check.
Crops the stills, writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
from PIL import Image, ImageEnhance
D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
W, H = 816, 1056
NIGHT, RED, YEL, CREAM = '#132b34', '#d23b2b', '#f1dd96', '#f6efd9'
INK = '#16262c'
FONTS = ('https://fonts.googleapis.com/css2?family=Monoton&family=Bebas+Neue'
         '&family=PT+Serif:ital,wght@0,400;0,700;1,400&family=Mrs+Saint+Delafield&family=Gloria+Hallelujah&display=swap')
SIGN = "'Monoton', sans-serif"; DISP = "'Bebas Neue', sans-serif"; BODY = "'PT Serif', serif"
SCRIPT = "'Mrs Saint Delafield', cursive"; HAND = "'Gloria Hallelujah', cursive"
L, CW = 56, 704


def crop(src, out, box, size, bright=1.0):
    im = Image.open(os.path.join(A, src)).convert('RGB').crop(box).resize(size, Image.LANCZOS)
    if bright != 1.0:
        im = ImageEnhance.Brightness(im).enhance(bright)
    im.save(os.path.join(A, out), quality=90)

# Julie at a table (no brands in frame). Bar shot cropped above the bottle label and below the beer sign.
crop('src-julie.jpg', 'still-julie.jpg', (0, 40, 1600, 900), (1384, 744), 1.08)
crop('src-bar.jpg', 'still-bar.jpg', (0, 230, 1880, 900), (956, 340), 1.12)


def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {DISP}; font-size: 22px; letter-spacing: 0.26em; color: {color}; '
            f'line-height: 1;{extra}">{t}</div>')


def bar(t, ink, ring, size=44):
    """Section title in a neon-tube style double outline box, printed flat."""
    return (f'<div style="display: inline-block; border: 3px solid {RED}; border-radius: 14px; '
            f'box-shadow: 0 0 0 4px {ring}, 0 0 0 6px {RED}; padding: 7px 18px 3px; font-family: {DISP}; '
            f'font-size: {size}px; line-height: 1; letter-spacing: 0.05em; color: {ink}">{t}</div>')


def item(name, price, desc, ink, note='', gap=20, nc=RED):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {nc}; margin-top: 3px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-family: {DISP}; '
            f'font-size: 32px; line-height: 1.05; color: {ink}; letter-spacing: 0.03em">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 19.5px; line-height: 1.38; color: {ink}; margin-top: 3px">{desc}</div>{n}</div>')


def page(bg, inner, wear, grain=0.3):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {bg}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: {grain}">'
            + inner +
            f'<img src="assets/{wear}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


def matchbook(o, x, y):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 100px; height: 146px; background: {RED}; '
             f'box-shadow: 0 2px 7px rgba(0,0,0,0.45); transform: rotate(-8deg); overflow: hidden">'
             f'<div style="position: absolute; left: 0; top: 12px; width: 100px; text-align: center; font-family: {DISP}; font-size: 34px; line-height: 0.9; letter-spacing: 0.04em; color: {CREAM}">LAST<br>STOP</div>'
             f'<div style="position: absolute; left: 10px; top: 80px; width: 80px; height: 2px; background: {YEL}"></div>'
             f'<div style="position: absolute; left: 0; top: 87px; width: 100px; text-align: center; font-family: {DISP}; font-size: 16px; line-height: 1.1; letter-spacing: 0.08em; color: {YEL}">SOHO<br>TILL 4 A.M.</div>'
             f'<div style="position: absolute; left: 0; top: 120px; width: 100px; height: 26px; background: {NIGHT}"></div>'
             f'<div style="position: absolute; left: 0; top: 126px; width: 100px; height: 9px; background: repeating-linear-gradient(90deg, #7a6a58 0 2px, #3b332c 2px 4px)"></div>'
             '</div>')


def token(o, x, y):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 104px; height: 104px; border-radius: 52px; '
             f'background: radial-gradient(circle at 38% 34%, #f3d98a 0%, #c99b3e 55%, #8f6a25 100%); box-shadow: 0 2px 6px rgba(0,0,0,0.5); transform: rotate(12deg)">'
             f'<div style="position: absolute; left: 7px; top: 7px; width: 86px; height: 86px; border-radius: 43px; border: 2px solid #8a6421"></div>'
             f'<div style="position: absolute; left: 0; top: 17px; width: 104px; text-align: center; font-family: {DISP}; font-size: 17px; letter-spacing: 0.12em; line-height: 1; color: #5c4214">GOOD FOR</div>'
             f'<div style="position: absolute; left: 39px; top: 38px; width: 26px; height: 26px; border-radius: 13px; background: {NIGHT}"></div>'
             f'<div style="position: absolute; left: 0; top: 71px; width: 104px; text-align: center; font-family: {DISP}; font-size: 17px; letter-spacing: 0.12em; line-height: 1; color: #5c4214">ONE FARE</div>'
             '</div>')


def check(o, gx, gy):
    lines = [('Table 4, Julie', None), ('1 burger', '4.75'), ('1 whiskey sour', '3.50'), ('1 coffee', '.90'), ('Total', '9.15')]
    rows = ''
    for i, (t, p) in enumerate(lines):
        rows += (f'<div style="position: absolute; left: 0; top: {54 + i * 27}px; width: 224px; height: 27px; border-bottom: 1px solid #a9c2b0"></div>'
                 f'<div style="position: absolute; left: 12px; top: {52 + i * 27}px; width: 200px; display: flex; justify-content: space-between; '
                 f'font-family: {HAND}; font-size: 16px; line-height: 1.6; color: #233a7a"><span>{t}</span><span>{p or ""}</span></div>')
    o.append(f'<div style="position: absolute; left: {gx}px; top: {gy}px; width: 224px; height: 202px; background: #fbf8ee; '
             f'box-shadow: 0 2px 6px rgba(40,30,20,0.3); transform: rotate(-4deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 224px; height: 44px; border-bottom: 2px solid #3d7a5c; display: flex; '
             f'justify-content: space-between; align-items: center; padding: 0 12px; box-sizing: border-box; font-family: {DISP}; '
             f'font-size: 20px; letter-spacing: 0.12em; color: #3d7a5c"><span>GUEST CHECK</span><span style="color: {RED}">No. 0150</span></div>'
             + rows +
             f'<div style="position: absolute; left: 104px; top: 88px; border: 3px solid {RED}; border-radius: 4px; padding: 4px 10px 0; '
             f'font-family: {DISP}; font-size: 38px; line-height: 1; letter-spacing: 0.1em; color: {RED}; opacity: 0.85; transform: rotate(-13deg)">PAID</div>'
             '</div>')


# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("SoHo, New York", YEL)}{kicker("Open 8 P.M. to 4 A.M.", YEL)}</div>')
    o.append(f'<div style="position: absolute; left: 0; top: 84px; width: {W}px; text-align: center; font-family: {SIGN}; font-size: 104px; '
             f'line-height: 1.1; color: {RED}; letter-spacing: 0.02em">LAST STOP</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 214px; width: {CW}px; display: flex; align-items: center; gap: 18px">'
             f'<div style="flex: 1; height: 2px; background: {YEL}"></div>'
             f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1; letter-spacing: 0.3em; color: {CREAM}; padding-left: 0.3em">BAR AND GRILL</div>'
             f'<div style="flex: 1; height: 2px; background: {YEL}"></div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 272px; width: {CW}px; height: 372px; background: {CREAM}; padding: 0; outline: 3px solid {YEL}; outline-offset: 5px">'
             f'<img src="assets/still-julie.jpg" alt="A regular at a table, the waitress leaning in to take his order" style="display: block; width: {CW}px; height: 372px; object-fit: cover"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 660px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 17px; color: {YEL}">'
             f'<span>Julie takes care of the tables. Tom pours.</span><span>The fare went up at midnight. Ours did not.</span></div>')
    o.append(f'<div style="position: absolute; left: {L + 6}px; top: 712px; width: {CW - 6}px">'
             f'<div style="display: flex; justify-content: space-between; align-items: center">{bar("From the grill", CREAM, NIGHT)}'
             f'{kicker("Hot till close", YEL)}</div>'
             + item('Last Stop burger', '4.75', 'Hand-formed chuck, salted right before the flat top, cooked medium under melted cheddar. Raw onion, dill pickles, toasted bun.', CREAM, gap=22)
             + item('Late night club', '4.95', 'Three decks of toast with roast chicken, crisp bacon, lettuce, tomato and mayo, pinned and cut in four. Chips alongside.', CREAM, gap=14)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 974px; width: {CW}px; height: 2px; background: {YEL}; opacity: 0.8"></div>'
             f'<div style="position: absolute; left: {L}px; top: 984px; width: {CW}px; display: flex; justify-content: space-between; align-items: baseline; '
             f'font-family: {BODY}; font-size: 17px; color: {CREAM}">'
             f'{kicker("House rules", RED)}<span>Cash only.</span><span>Hold on to your twenty.</span><span>Menu inside, turn over.</span></div>')
    matchbook(o, L - 4, 300)
    token(o, L + CW - 92, 584)
    return page(NIGHT, ''.join(o), 'wear-front.png', 0.22)


# ---------------- BACK ----------------
COLW, GAP = 330, 44
X2 = L + COLW + GAP


def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px">{kicker("Kitchen open till close")}</div>')
    o.append(f'<div style="position: absolute; left: {L + 6}px; top: 84px">{bar("The menu", INK, YEL, 60)}</div>')
    o.append(f'<div style="position: absolute; left: {L + 300}px; top: 64px; width: {CW - 300}px; text-align: right; font-family: {SIGN}; font-size: 58px; line-height: 1.15; color: {RED}">LAST STOP</div>')
    o.append(f'<div style="position: absolute; left: {L + 300}px; top: 136px; width: {CW - 300}px; text-align: right; font-family: {DISP}; font-size: 22px; letter-spacing: 0.26em; color: {INK}">BAR AND GRILL, SOHO</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 180px; width: {CW}px; height: 3px; background: {INK}"></div>')
    col = lambda x, inner: f'<div style="position: absolute; left: {x + 6}px; top: 210px; width: {COLW - 6}px">{inner}</div>'
    left = (bar('To start', INK, YEL, 40)
            + item('Bagel bites', '3.50', 'Toasted minis spread thick with chive and black pepper cream cheese, smoked salmon, capers, sesame, poppy seed and garlic.', INK, 'Softer than a paperweight.', 22)
            + item('French fries', '1.50', 'Hand cut, fried twice, plenty of salt.', INK, '', 16)
            + item('House chili', '2.25', 'Ground beef and kidney beans simmered all evening with cumin, ancho and tomato. Raw onion, saltines.', INK, '', 16)
            + f'<div style="height: 2px; background: {INK}; opacity: 0.5; margin: 26px 0 28px"></div>'
            + bar('Sweets', INK, YEL, 40)
            + item('Plaster of Paris cake', '2.50', 'Vanilla butter layers under thick seven-minute frosting, roughed up with a palette knife so it sets white and matte.', INK, 'For the sculptors on the block.', 22)
            + item('Dipped cone', '1.75', 'Vanilla soft serve piled high, dipped in dark chocolate that sets to a shell, then crushed peanuts or sprinkles.', INK, 'Better than the truck.', 16))
    right = (bar('Behind the bar', INK, YEL, 40)
             + item('Whiskey sour', '3.50', 'Bourbon, lemon, a little sugar and egg white shaken silky, bitters on the foam, a cherry.', INK, 'Tom shakes them hard.', 22)
             + item('Draft beer', '1.50', 'Cold, in a heavy mug.', INK, '', 16)
             + item('Shot and a beer', '2.75', 'Rye or bourbon with a draft back.', INK, '', 16)
             + item('Coffee', '.90', 'Fresh pot all night, refills free.', INK, '', 16)
             + f'<div style="margin-top: 24px; border: 3px solid {RED}; padding: 4px; background: {CREAM}">'
             f'<img src="assets/still-bar.jpg" alt="The bartender and a customer at the bar late at night" style="display: block; width: 312px; height: 111px; object-fit: cover"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.35; color: {INK}; margin-top: 6px">The bar, a quiet night after midnight.</div>')
    o.append(col(L, left)); o.append(col(X2, right))
    # Tom's note
    o.append(f'<div style="position: absolute; left: {X2 + 6}px; top: 760px; width: {COLW - 6}px">'
             + kicker('From behind the bar') +
             f'<div style="font-family: {BODY}; font-size: 17.5px; line-height: 1.42; color: {INK}; margin-top: 8px">Lock up when you leave, there have been burglaries on the block. Going on to Club Berlin? Eat first.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 54px; line-height: 1; color: {RED}; margin-top: -4px">Tom</div></div>')
    check(o, L + CW - 222, 906)
    o.append(f'<div style="position: absolute; left: {L}px; top: 990px; width: 420px; height: 1px; background: {INK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 996px; width: 420px; font-family: {BODY}; font-size: 15px; line-height: 1.3; color: {INK}">'
             f'Cash only. Prices subject to change. Form 1985.</div>')
    return page(YEL, ''.join(o), 'wear-back.png', 0.32)


FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Last Stop menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
