"""Builds the MacMillan Toy Company party menu (Big, 1988), on the house STYLE-LOCK system.

Venue: the MacMillan company party, the night Josh wears the white tuxedo, eats the baby corn like a cob
and tries the caviar. This is the printed menu set at each place. Hosted by the company, so no prices.
Palette from the film: Big red, near-black, ivory. One painted art PNG (paint.py: the floor keyboard).
Props: Zoltar's card (front), Josh's new business card (back).
US Letter, 8.5 x 11 in (816 x 1056 px at 96 dpi), two faces.
"""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
FILM = 'Big (1988)'

FONTS = ('family=Limelight&family=Josefin+Sans:wght@600;700'
         '&family=Playfair+Display:ital,wght@0,700;0,800;0,900;1,400'
         '&family=Libre+Baskerville:ital,wght@0,400;1,400&family=Allura')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
LOGO = "'Limelight', serif"
CAPS = "'Josefin Sans', sans-serif"
DISP = "'Playfair Display', serif"
BODY = "'Libre Baskerville', serif"
SIGN = "'Allura', cursive"

PAPER = '#f5f0e4'
INK = '#1c1816'
RED = '#c4202c'
SOFT = '#5a4f47'

# (spec key or None if added, printed name, printed description, note for the phone view)
TRAYS = [
    ('Baby corn', 'Griddled baby corn', 'Charred in butter with crushed red pepper, lime zest and salt.', 'Best eaten like corn on the cob.'),
    ('Caviar on crackers', 'Red caviar canapés', 'Salmon roe, crème fraîche and chives on crisp water crackers.', 'An acquired taste.'),
    (None, 'Chicken satay', 'Garlic and soy marinated skewers, warm peanut sauce.', None),
]
CART = [
    ('Street cart hot dog', 'Corner cart hot dog', 'Steamed bun, mustard, sauerkraut and onions stewed in tomato.', 'Have two. Nobody is counting.'),
    (None, 'Hot soft pretzel', 'Twisted by hand, coarse salt, yellow mustard to dip.', None),
]
SWEETS = [
    ('Giant choc chip cookie', 'The giant cookie', 'Brown-butter chocolate chip, iced with piano keys, cut at the table.', 'Big enough for four hands.'),
    (None, 'Cotton candy', 'Spun to order, pink or blue, just like Sea Point Park.', None),
]
FOUNTAIN = [
    ('Chocolate egg cream', 'Chocolate egg cream', 'Syrup, cold milk and seltzer, stirred until the foam rises.', 'No egg, no cream. Never was.'),
    (None, 'Kiddie cocktail', 'Ginger ale, grenadine and a maraschino cherry.', None),
    (None, 'Fresh lemonade', 'Squeezed this afternoon, plenty of ice.', None),
]
ALL = TRAYS + CART + SWEETS + FOUNTAIN


def ab(x, y, w, inner, style=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {style}">{inner}</div>'


def kicker(t, col=RED, align='left'):
    return f'<div style="text-align: {align}; font-family: {CAPS}; font-weight: 700; font-size: 18px; letter-spacing: 0.22em; line-height: 22px; color: {col}">{t}</div>'


def bar(t):
    return f'<div style="display: inline-block; background: {INK}; padding: 6px 16px 4px; font-family: {DISP}; font-weight: 900; font-size: 40px; line-height: 46px; color: {PAPER}">{t}</div>'


def item(name, desc, first=False):
    return f'''<div style="margin-top: {0 if first else 18}px">
      <div style="font-family: {DISP}; font-weight: 800; font-size: 27px; line-height: 1.12; color: {INK}">{name}</div>
      <div style="margin-top: 5px; font-family: {BODY}; font-size: 20px; line-height: 1.4; color: {INK}; text-wrap: pretty">{desc}</div></div>'''


def group(title, items, top=0):
    rule = f'<div style="height: 1px; background: {INK}; opacity: 0.55; margin: 0 0 22px"></div>' if top else ''
    return (f'<div style="margin-top: {top}px">{rule}{bar(title)}<div style="margin-top: 16px">'
            + ''.join(item(n, d, i == 0) for i, (_, n, d, _) in enumerate(items)) + '</div></div>')


def border():
    return (ab(26, 26, W - 52, '', f'height: {H - 52}px; border: 2px solid {INK}; box-sizing: border-box')
            + ab(33, 33, W - 66, '', f'height: {H - 66}px; border: 1px solid {RED}; box-sizing: border-box'))


def finish(face):
    return f'''
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none; opacity: 0.30">
  <img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'''


def face(name, inner, props):
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">
  {border()}
  {inner}
  {finish(name)}
  {props}
</div>'''


def keys(x, y, n=28, kw=24, kh=46):
    """A piano-key band built from divs: white keys with black keys in the 2 and 3 pattern."""
    out = [ab(x, y, n * kw, '', f'height: {kh}px; background: {PAPER}; border: 2px solid {INK}; box-sizing: border-box')]
    for i in range(1, n):
        out.append(ab(x + i * kw - 1, y, 2, '', f'height: {kh}px; background: {INK}'))
    for i in range(n):
        if i % 7 in (0, 1, 3, 4, 5):
            out.append(ab(x + (i + 1) * kw - 8, y, 16, '', f'height: {int(kh * 0.6)}px; background: {INK}'))
    return ''.join(out)


# ---------------------------------------------------------------- front: cover
welcome = f'''{kicker('A WORD FROM THE BOSS')}
  <p style="margin: 12px 0 0; font-family: {BODY}; font-size: 20px; line-height: 1.5; color: {INK}">Thank you all for a big year. Tonight there are no meetings and no sales figures. Eat well, try something new, and have fun. That is an order.</p>
  <div style="margin-top: 6px; font-family: {SIGN}; font-size: 46px; line-height: 1.1; color: #22305e">Mr. MacMillan</div>
  <div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {SOFT}">President, MacMillan Toy Company</div>'''

evening = f'''{kicker('THIS EVENING')}''' + ''.join(f'''<div style="margin-top: 12px">
    <div style="font-family: {DISP}; font-weight: 800; font-size: 26px; line-height: 1.1; color: {RED}">{t}</div>
    <div style="font-family: {BODY}; font-size: 20px; line-height: 1.35; color: {INK}">{x}</div></div>'''
    for t, x in (('7:30', 'Doors open'), ('8:00', 'Supper is served'), ('9:30', 'The cookie is cut')))

front_inner = f'''
  {ab(60, 58, W - 120, f'<div style="text-align: center; font-family: {LOGO}; font-size: 64px; line-height: 70px; color: {RED}">MacMillan</div>')}
  {ab(60, 130, W - 120, kicker('TOY COMPANY &nbsp;&#9670;&nbsp; NEW YORK, N.Y.', INK, 'center'))}
  {ab(60, 182, W - 120, f'<div style="text-align: center; font-family: {DISP}; font-weight: 900; font-size: 62px; line-height: 66px; letter-spacing: -0.005em; color: {INK}">THE COMPANY PARTY</div>')}
  {ab(60, 254, W - 120, kicker('SUPPER, SWEETS AND THE SODA FOUNTAIN', RED, 'center'))}
  <div style="position: absolute; left: 64px; top: 298px; width: 688px; height: 316px; border: 2px solid {RED}; box-sizing: border-box; overflow: hidden">
    <img src="assets/cover-keys.png" alt="" style="position: absolute; left: -26px; top: -10px; width: 736px; height: 330px; display: block"></div>
  {ab(64, 622, 688, f'<div style="text-align: center; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 22px; color: {SOFT}">Four hands, one keyboard. Black tie, and white tuxedos welcome.</div>')}
  {ab(64, 680, 400, welcome)}
  <div style="position: absolute; left: 494px; top: 680px; width: 1px; height: 250px; background: {INK}; opacity: 0.55"></div>
  {ab(522, 680, 230, evening)}
  {ab(522, 966, 230, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 21px; color: {SOFT}">Form 187. Printed in U.S.A. &copy; 1988.</div>')}
'''
zoltar = f'''<div style="position: absolute; left: 272px; top: 918px; width: 196px; height: 92px; transform: rotate(-4deg);
    background: #efe3c4; box-shadow: 1px 2px 4px rgba(60,40,20,0.28); box-sizing: border-box">
    <div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border: 1px solid #8a2a1e"></div>
    <div style="position: relative; text-align: center; font-family: {CAPS}; font-weight: 700; font-size: 14px; letter-spacing: 0.28em; line-height: 16px; color: #8a2a1e; padding-top: 16px">ZOLTAR SPEAKS</div>
    <div style="position: relative; text-align: center; font-family: {DISP}; font-style: italic; font-weight: 400; font-size: 22px; line-height: 26px; color: #2a1d14; margin-top: 8px">Your wish is granted</div></div>'''

# ---------------------------------------------------------------- back: the menu
L, C, G = 64, 330, 28
back_inner = f'''
  {ab(L, 58, 688, kicker('COMPLIMENTS OF THE COMPANY'))}
  {ab(L, 86, 688, f'<div style="font-family: {DISP}; font-weight: 900; font-size: 68px; line-height: 74px; color: {INK}">THE MENU</div>')}
  {ab(L, 182, 688, '', f'height: 2px; background: {INK}')}
  {ab(L, 206, C, group('TRAYS', TRAYS) + group('THE CART', CART, 24))}
  {ab(L + C + G, 206, C, group('SWEETS', SWEETS) + group('FOUNTAIN', FOUNTAIN, 24))}
  {ab(L, 974, 400, f"""<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 21px; color: {INK}">Please, no toy pitches at the table.</div>
    <div style="font-family: {BODY}; font-size: 16px; line-height: 21px; color: {SOFT}">MacMillan Toy Company, New York, 1988.</div>""")}
'''
card = f'''<div style="position: absolute; left: 506px; top: 44px; width: 240px; height: 128px; transform: rotate(3deg);
    background: #fbf9f3; box-shadow: 1px 2px 5px rgba(50,40,30,0.26); box-sizing: border-box; padding: 12px 18px">
    <div style="font-family: {LOGO}; font-size: 20px; line-height: 22px; color: {RED}">MacMillan</div>
    <div style="margin-top: 14px; font-family: {DISP}; font-weight: 800; font-size: 22px; line-height: 24px; color: {INK}">Josh Baskin</div>
    <div style="margin-top: 4px; font-family: {CAPS}; font-weight: 600; font-size: 14px; line-height: 17px; color: {INK}">Vice President,<br>Product Development</div></div>'''

FRONT = face('front', front_inner, zoltar)
BACK = face('back', back_inner, card)

for name, body, title in (('front', FRONT, 'MacMillan party menu, front'), ('back', BACK, 'MacMillan party menu, back')):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({
    'fmt': 'toystore', 'fn': 'fmtToyStore', 'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
    'mm': [215.9, 279.4], 'fonts': FONTS,
    'fams': ['Limelight', 'Josefin Sans', 'Playfair Display', 'Libre Baskerville', 'Allura'],
    'phone': {'disp': "'Limelight',serif", 'title': "'Playfair Display',serif", 'name': "'Playfair Display',serif",
              'body': "'Libre Baskerville',serif", 'price': "'Playfair Display',serif", 'note': "'Libre Baskerville',serif"},
}, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)

labels = {FILM: {k: {'n': n, 'd': d, 'note': t} for k, n, d, t in ALL if k}}
json.dump(labels, open(os.path.join(D, 'toystore.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
