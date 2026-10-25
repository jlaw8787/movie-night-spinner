"""Builds the MacMillan Toy Company party menu (Big, 1988).

The venue: the MacMillan company party, the night Josh turns up in his white tuxedo, eats the baby corn
like a cob and meets the caviar. This is the printed menu set at each place: a two-colour offset card
(black and lacquer red on ivory board), the kind a New York toy company would order from its printer for
its big night in 1988. Deco revival type (Limelight, Playfair Display, Josefin Sans), a painted floor
keyboard on the cover and a straight keyboard border down the back.
Prop bits: Zoltar's card tucked in the cover corner, a pencilled note in Josh's hand, his new business
card clipped on the back, and a coat check ticket.
US Letter, 8.5 x 11 in (816 x 1056 px at 96 dpi), two faces: front (cover and trays) and back (supper).
"""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
FILM = 'Big (1988)'

FONTS = ('family=Limelight&family=Josefin+Sans:wght@400;600;700'
         '&family=Playfair+Display:ital,wght@0,700;0,800;1,400;1,700'
         '&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Schoolbell')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DECO = "'Limelight', 'Broadway', serif"
CAPS = "'Josefin Sans', 'Futura', sans-serif"
NAME = "'Playfair Display', 'Bodoni 72', serif"
BODY = "'Libre Baskerville', 'Baskerville', serif"
HAND = "'Schoolbell', cursive"

PAPER = '#f5f0e4'
INK = '#1c1816'
RED = '#c4202c'
SOFT = '#5a4f47'
SPREAD = 'text-shadow: 0 0 0.6px rgba(28,24,22,0.55)'
RSPREAD = 'text-shadow: 0 0 0.6px rgba(196,32,44,0.5)'

# (spec key or None if added, printed name, description, note)
TRAYS = [
    ('Baby corn', 'Griddled baby corn',
     'Little ears blanched, then charred in butter on a hot flat-top. Crushed red pepper, lime zest and salt, with a wedge to squeeze.',
     'Best eaten like corn on the cob.'),
    ('Caviar on crackers', 'Red caviar canapés',
     'Salmon roe and snipped chives on crème fraîche over crisp water crackers, put together just before they go out.',
     'An acquired taste.'),
    (None, 'Chicken satay',
     'Thigh meat marinated in garlic and soy, grilled on bamboo skewers. Warm peanut sauce for dipping.',
     None),
]
CART = [
    ('Street cart hot dog', 'Corner cart hot dog',
     'Simmered, then blistered on the griddle until the skin snaps. Steamed bun, yellow mustard, sauerkraut and onions stewed down with tomato.',
     'Have two. Nobody is counting.'),
    (None, 'Hot soft pretzel',
     'Twisted by hand, baked deep brown and scattered with coarse salt. Mustard on the side.',
     None),
]
BIG = [
    ('Giant choc chip cookie', 'The giant cookie',
     'Brown-butter chocolate chip dough pressed into a pizza pan and baked soft in the middle. Piano keys piped across in white icing, cut at the table.',
     'Big enough for four hands.'),
    (None, 'Cotton candy',
     'Spun to order at the cart, pink or blue, on a paper cone.',
     'Just like Sea Point Park.'),
]
FOUNTAIN = [
    ('Chocolate egg cream', 'Chocolate egg cream',
     'Syrup and cold milk in a tall glass, then seltzer poured hard from up high and stirred with a long spoon until a white head rises.',
     'No egg, no cream. Never was.'),
    (None, 'Kiddie cocktail',
     'Ginger ale over ice with a splash of grenadine and a maraschino cherry.',
     None),
    (None, 'Fresh lemonade',
     'Squeezed this afternoon, sweetened just enough, plenty of ice.',
     None),
    (None, 'Coffee and tea',
     'Fresh-brewed regular and decaf, hot tea, cream and sugar.',
     None),
]
ALL = TRAYS + CART + BIG + FOUNTAIN


def ab(x, y, w, h, inner='', style=''):
    hh = f'height: {h}px; ' if h else ''
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {hh}{style}">{inner}</div>'


def item(name, desc, note, top=0, name_px=23):
    nt = (f'<p style="margin: 5px 0 0; font-family: {NAME}; font-style: italic; font-weight: 400; font-size: 17px; '
          f'line-height: 1.2; color: {RED}; {RSPREAD}">{note}</p>') if note else ''
    return f'''<div style="margin-top: {top}px">
      <h3 style="margin: 0; font-family: {NAME}; font-weight: 700; font-size: {name_px}px; line-height: 1.12; color: {INK}; {SPREAD}">{name}</h3>
      <p style="margin: 6px 0 0; font-family: {BODY}; font-size: 16px; line-height: 1.5; color: {INK}; text-wrap: pretty; {SPREAD}">{desc}</p>{nt}</div>'''


def head(t, w=None, align='left'):
    """Section head: red letterspaced caps over a black hairline with a short red bar, deco style."""
    return f'''<div style="text-align: {align}">
      <div style="font-family: {CAPS}; font-weight: 700; font-size: 15px; letter-spacing: 0.24em; line-height: 1; color: {RED}; {RSPREAD}">{t}</div>
      <div style="position: relative; height: 9px; margin-top: 8px">
        <div style="position: absolute; left: 0; right: 0; top: 4px; height: 1px; background: {INK}"></div>
        <div style="position: absolute; left: 0; top: 2px; width: 46px; height: 5px; background: {RED}"></div></div></div>'''


def border(x0, y0, x1, y1):
    return (ab(x0, y0, x1 - x0, y1 - y0, '', f'border: 2px solid {INK}; box-sizing: border-box')
            + ab(x0 + 7, y0 + 7, x1 - x0 - 14, y1 - y0 - 14, '', f'border: 1px solid {RED}; box-sizing: border-box'))


def finish(face):
    return f'''
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none; opacity: 0.30">
  <img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'''


def face(name, inner, props=''):
    # props sit above the paper finish: they are separate pieces of paper lying on the card
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">
  {inner}
  {finish(name)}
  {props}
</div>'''


# ---------------------------------------------------------------- front: cover and trays
cols = ''.join(f'<div style="flex: 1; min-width: 0">{item(n, d, t, name_px=23)}</div>' for _, n, d, t in TRAYS)
front_inner = f'''
  {border(26, 26, W - 26, H - 26)}
  {ab(60, 64, W - 120, 20, f'<div style="text-align: center; font-family: {CAPS}; font-weight: 600; font-size: 15px; letter-spacing: 0.36em; line-height: 20px; color: {INK}; {SPREAD}">MACMILLAN TOY COMPANY</div>')}
  {ab(60, 96, W - 120, 60, f'<div style="text-align: center; font-family: {DECO}; font-size: 50px; line-height: 60px; color: {INK}; {SPREAD}">The Company</div>')}
  {ab(40, 150, W - 80, 136, f'<div style="text-align: center; font-family: {DECO}; font-size: 132px; line-height: 136px; letter-spacing: 0.02em; color: {RED}; {RSPREAD}">PARTY</div>')}
  {ab(60, 292, W - 120, 26, f'<div style="text-align: center; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 26px; color: {INK}; {SPREAD}">Supper, sweets and the soda fountain. New York, 1988.</div>')}
  <img src="assets/cover-keys.png" alt="" style="position: absolute; left: 40px; top: 322px; width: 736px; height: 330px; display: block">
  {ab(60, 662, W - 120, 20, f'<div style="text-align: center; font-family: {CAPS}; font-weight: 600; font-size: 14px; letter-spacing: 0.26em; line-height: 20px; color: {INK}; {SPREAD}">BLACK TIE &nbsp;<span style="color: {RED}">&#9670;</span>&nbsp; WHITE TUXEDOS WELCOME</div>')}
  {ab(64, 708, W - 128, 0, head('PASSED ON TRAYS ALL EVENING'))}
  {ab(64, 746, W - 128, 0, f'<div style="display: flex; gap: 30px">{cols}</div>')}
  {ab(64, 950, 470, 0, f"""<p style="margin: 0; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.45; color: {INK}; {SPREAD}">Thank you all for a big year. Tonight, have fun. That is an order.</p>
    <p style="margin: 4px 0 0; font-family: {CAPS}; font-weight: 600; font-size: 13px; letter-spacing: 0.18em; line-height: 1.3; color: {RED}; {RSPREAD}">MR. MACMILLAN</p>""")}
'''

# Zoltar's card, tucked into the cover's bottom corner (the card the machine gives Josh)
zoltar = f'''<div style="position: absolute; left: 574px; top: 908px; width: 188px; height: 112px; transform: rotate(-5deg); transform-origin: 50% 50%;
    background: #efe3c4; box-shadow: 1px 2px 4px rgba(60,40,20,0.28); box-sizing: border-box; padding: 9px 10px">
    <div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border: 1px solid #8a2a1e"></div>
    <div style="position: relative; text-align: center; font-family: {CAPS}; font-weight: 700; font-size: 12px; letter-spacing: 0.3em; line-height: 16px; color: #8a2a1e; padding-top: 6px">ZOLTAR SPEAKS</div>
    <div style="position: relative; text-align: center; font-family: {NAME}; font-style: italic; font-weight: 400; font-size: 21px; line-height: 26px; color: #2a1d14; margin-top: 10px">Your wish is granted</div>
  </div>'''

# Josh's pencilled note on his own menu, next to the caviar
pencil = f'''<div style="position: absolute; left: 330px; top: 900px; width: 200px; transform: rotate(-4deg);
    font-family: {HAND}; font-size: 19px; line-height: 1.1; color: #5d6168">Do NOT try the caviar.</div>'''

# ---------------------------------------------------------------- back: supper
KX = 104                     # the keyboard border width
cx0 = 152
colw = 296
gap = 28
left = (head('FROM THE CORNER CART') + item(*CART[0][1:], top=14) + item(*CART[1][1:], top=20)
        + f'<div style="height: 30px"></div>' + head('SOMETHING BIG') + item(*BIG[0][1:], top=14) + item(*BIG[1][1:], top=20))
right = (head('THE SODA FOUNTAIN') + item(*FOUNTAIN[0][1:], top=14) + ''.join(item(*f[1:], top=18, name_px=21) for f in FOUNTAIN[1:]))

times = ''.join(f'''<div style="display: flex; gap: 14px; align-items: baseline; margin-top: 7px">
      <span style="flex: none; width: 46px; font-family: {CAPS}; font-weight: 700; font-size: 15px; letter-spacing: 0.04em; color: {RED}; {RSPREAD}">{t}</span>
      <span style="font-family: {BODY}; font-size: 16px; line-height: 1.35; color: {INK}; {SPREAD}">{x}</span></div>'''
                for t, x in (('7:30', 'Doors open, trays go round'), ('8:00', 'The cart and the fountain open'), ('9:30', 'The giant cookie is cut')))

back_inner = f'''
  <img src="assets/strip-keys.png" alt="" style="position: absolute; left: 0; top: 0; width: {KX}px; height: {H}px; display: block">
  {border(124, 26, W - 26, H - 26)}
  {ab(cx0, 62, W - cx0 - 40, 20, f'<div style="font-family: {CAPS}; font-weight: 600; font-size: 14px; letter-spacing: 0.3em; line-height: 20px; color: {RED}; {RSPREAD}">MACMILLAN TOY COMPANY &nbsp;&#9670;&nbsp; THE COMPANY PARTY</div>')}
  {ab(cx0, 90, W - cx0 - 40, 64, f'<div style="font-family: {DECO}; font-size: 58px; line-height: 64px; color: {INK}; {SPREAD}">Supper <span style="color: {RED}">&amp;</span> Sweets</div>')}
  {ab(cx0, 162, W - cx0 - 40, 26, f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 26px; color: {INK}; {SPREAD}">From eight o&rsquo;clock. Help yourself, and come back as often as you like.</div>')}
  {ab(cx0, 214, colw, 0, left)}
  {ab(cx0 + colw + gap, 214, colw, 0, right)}
  {ab(cx0 + colw + gap, 0, colw, 0, '', 'display: none')}
'''

BACK_LOW = f'''
  {ab(cx0, 0, 0, 0, '', 'display:none')}
'''

FRONT = face('front', front_inner, pencil + zoltar)


def back_face(timeline_top, card_top, foot_top):
    inner = back_inner + f'''
  {ab(cx0 + colw + gap, timeline_top, colw, 0, f'<div style="padding: 14px 16px 14px; border: 1px solid {INK}; outline: 0">{head("THIS EVENING")}{times}</div>')}
  {ab(cx0, foot_top, W - cx0 - 40, 0, f"""<div style="font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.4; color: {INK}; {SPREAD}">Please, no toy pitches at the table.</div>
    <div style="margin-top: 4px; font-family: {CAPS}; font-weight: 600; font-size: 12px; letter-spacing: 0.16em; line-height: 1.4; color: {SOFT}">MACMILLAN TOY COMPANY, NEW YORK, N.Y. &nbsp; PRINTED IN U.S.A.</div>""")}
'''
    card = f'''<div style="position: absolute; left: {cx0 + colw + gap + 40}px; top: {card_top}px; width: 248px; height: 142px; transform: rotate(-3deg);
    background: #fbf9f3; box-shadow: 1px 2px 5px rgba(50,40,30,0.26); box-sizing: border-box; padding: 16px 18px">
    <div style="font-family: {CAPS}; font-weight: 700; font-size: 12px; letter-spacing: 0.28em; line-height: 16px; color: {RED}">MACMILLAN TOY CO.</div>
    <div style="margin-top: 22px; font-family: {NAME}; font-weight: 700; font-size: 21px; line-height: 24px; color: {INK}">Josh Baskin</div>
    <div style="margin-top: 3px; font-family: {CAPS}; font-weight: 600; font-size: 12px; letter-spacing: 0.06em; line-height: 16px; color: {INK}">Vice President, Product Development</div>
    <div style="margin-top: 2px; font-family: {CAPS}; font-weight: 400; font-size: 12px; letter-spacing: 0.06em; line-height: 16px; color: {SOFT}">New York, N.Y.</div>
    <img src="assets/clip.png" alt="" style="position: absolute; left: 196px; top: -22px; width: 26px; height: 78px; display: block">
  </div>'''
    ticket = f'''<div style="position: absolute; left: {cx0 + colw + gap - 8}px; top: {card_top + 10}px; width: 0; height: 0"></div>'''
    return face('back', inner, card + ticket)


BACK = back_face(744, 884, 990)

for name, body, title in (('front', FRONT, 'MacMillan party menu, front'), ('back', BACK, 'MacMillan party menu, back')):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({
    'fmt': 'toystore', 'fn': 'fmtToyStore', 'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
    'mm': [215.9, 279.4], 'fonts': FONTS,
    'fams': ['Limelight', 'Josefin Sans', 'Playfair Display', 'Libre Baskerville', 'Schoolbell'],
    'phone': {'disp': "'Limelight',serif", 'title': "'Limelight',serif", 'name': "'Playfair Display',serif",
              'body': "'Libre Baskerville',serif", 'price': "'Josefin Sans',sans-serif", 'note': "'Playfair Display',serif"},
}, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)

labels = {FILM: {k: {'n': n, 'd': d, 'note': t} for k, n, d, t in ALL if k}}
json.dump(labels, open(os.path.join(D, 'toystore.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built front.html, back.html, film.json, toystore.labels.json')
