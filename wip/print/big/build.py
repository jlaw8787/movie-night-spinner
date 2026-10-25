"""Builds the MacMillan Toy Co. party pack menu (Big, 1988).

The object: the company party menu, printed by MacMillan's own packaging department on white box
board as the front and back panels of a toy carton, four-colour offset like every box on the line
that year. paint.py paints the printed board (logotypes, die-cut window art, panels, halftone photo,
UPC). This file sets the menu type over it and writes front.html and back.html (plus .body.html
copies for the PDF), film.json and toystore.labels.json.
US Letter, 8.5 x 11 in (816 x 1056 px at 96 dpi), two faces."""
import os, json
from layout import W, H, F, B, ink

D = os.path.dirname(os.path.abspath(__file__))

FONTS = 'family=Bowlby+One&family=League+Spartan:wght@500;600;700;800&family=Michroma'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Bowlby One', 'Arial Black', sans-serif"
SANS = "'League Spartan', 'Futura', 'Century Gothic', sans-serif"
TECH = "'Michroma', 'Eurostile', sans-serif"

RED = ink(m=100, y=100)
YEL = ink(m=8, y=100)
NAVY = ink(c=100, m=85, k=45)
BLK = ink(k=100)
BOARD = '#f7f3ea'
SPREAD = lambda c: f'text-shadow: 0 0 0.5px {c}'      # a touch of ink spread on board

FILM = 'Big (1988)'

# (spec key or None for added items, item no., printed name, description, note)
TRAYS = [
    ('Baby corn', '8801', 'Griddled baby corn',
     'Little ears blanched, then blistered in butter on a hot griddle. Crushed red pepper, lime zest, salt and a wedge to squeeze.',
     'Hold it like a cob.'),
    ('Caviar on crackers', '8802', 'Red caviar canapés',
     'Salmon roe and snipped chives over crème fraîche on crisp water crackers, put together just before they go out.',
     'An acquired taste.'),
    (None, '8803', 'Soft pretzels',
     'Twisted by hand, baked deep brown and scattered with coarse salt. Yellow mustard to dip.',
     'Warm from the oven all night.'),
]
CART = [
    ('Street cart hot dog', '8804', 'Corner cart hot dog',
     'Poached, then griddled until the skin snaps. Steamed bun, yellow mustard, sauerkraut and sweet onions stewed down in tomato.',
     'Have a second. Nobody is counting.'),
]
BIG = [
    ('Giant choc chip cookie', '8805', 'The giant cookie',
     'Browned-butter chocolate chip dough pressed out on a pizza pan and baked soft in the middle. White icing piano keys piped across, cut at the table.',
     'Big enough for a duet.'),
]
FOUNTAIN = [
    ('Chocolate egg cream', '8806', 'Chocolate egg cream',
     'Syrup and cold milk in a tall glass, then seltzer poured hard from up high and stirred with a long spoon until a white head rises.',
     'No egg, no cream. Never was.'),
    (None, '8807', 'Fresh lemonade', 'Squeezed this afternoon, sweetened just enough, plenty of ice.', None),
    (None, '8808', 'Vanilla malted', 'Ice cream, cold milk and malt powder spun thick. The rest comes in the steel cup.', None),
]
ALL = TRAYS + CART + BIG + FOUNTAIN


def ab(x0, y0, x1, y1, inner='', style=''):
    return f'<div style="position: absolute; left: {x0}px; top: {y0}px; width: {x1 - x0}px; height: {y1 - y0}px; {style}">{inner}</div>'


def item(no, name, desc, note, first, gap=16, name_px=22):
    nt = (f'<p style="margin: 3px 0 0; font-family: {SANS}; font-weight: 700; font-size: 16px; line-height: 1.22; color: {RED}; {SPREAD(RED)}">{note}</p>') if note else ''
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="font-family: {TECH}; font-size: 12px; letter-spacing: 0.04em; line-height: 1.2; color: {NAVY}">NO. {no}</div>
      <h3 style="margin: 3px 0 0; font-family: {SANS}; font-weight: 800; font-size: {name_px}px; line-height: 1.05; letter-spacing: -0.01em; color: {BLK}; {SPREAD(BLK)}">{name}</h3>
      <p style="margin: 3px 0 0; font-family: {SANS}; font-weight: 500; font-size: 16px; line-height: 1.24; color: {BLK}; {SPREAD(BLK)}">{desc}</p>{nt}</div>'''


def bar(t, first=True, gap=20):
    return f'''<div style="margin: {0 if first else gap}px 0 10px; background: {RED}; padding: 5px 10px 3px">
      <span style="font-family: {DISP}; font-size: 18px; line-height: 1.2; letter-spacing: 0.01em; color: {BOARD}">{t}</span></div>'''


def finish(face):
    return f'''
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none; opacity: 0.32">
  <img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'''


def face(name, inner):
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {NAVY}; font-family: {SANS}; color: {BLK}">
  <img src="assets/face-{name}.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">
  {inner}
  {finish(name)}
</div>'''


# ---------------- front: the box front ----------------
px0, py0, px1, py1 = F['panel']
cols = ''.join(f'<div style="flex: 1; min-width: 0">{item(n, a, d, t, True)}</div>' for _, n, a, d, t in TRAYS)
front_inner = f'''
  {ab(48, F['tag_y'], 640, F['tag_y'] + 26, f'<span style="font-family: {SANS}; font-weight: 800; font-size: 21px; letter-spacing: 0.06em; line-height: 26px; color: {BOARD}">GROWN-UP FOOD FOR A KID AT HEART.</span>')}
  {ab(48, F['subline_y'], 768, F['subline_y'] + 20, f"""<div style="display: flex; justify-content: space-between; font-family: {SANS}; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; line-height: 20px; color: {BOARD}">
    <span>8 PIECES. NO BATTERIES NEEDED.</span><span style="color: {YEL}">CONTENTS MAY BE BIGGER THAN SHOWN.</span></div>""")}
  {ab(px0 + 22, py0 + 58, px1 - 22, py1 - 46, f'<div style="display: flex; gap: 24px">{cols}</div>')}
  {ab(px0 + 22, py1 - 32, px1 - 22, py1 - 14, f'<div style="font-family: {TECH}; font-size: 12px; letter-spacing: 0.02em; line-height: 18px; color: {NAVY}; text-align: center">THE CART, THE COOKIE AND THE FOUNTAIN ARE ON THE BACK OF THE BOX.</div>')}
'''

# ---------------- back: the box back ----------------
mx0, my0, mx1, my1 = B['menu']
mid = (mx0 + mx1) // 2
left = (bar('Off the corner cart') + ''.join(item(*t[1:], first=(i == 0)) for i, t in enumerate(CART))
        + bar('Something big', first=False) + ''.join(item(*t[1:], first=(i == 0)) for i, t in enumerate(BIG)))
right = bar('The soda fountain') + ''.join(item(*t[1:], first=(i == 0), gap=14) for i, t in enumerate(FOUNTAIN))

ph0x, ph0y, ph1x, ph1y = B['photo_panel']
phx0, phy0, phx1, phy1 = B['photo']
caption = (f'<p style="margin: 0; font-family: {SANS}; font-weight: 600; font-size: 14px; line-height: 1.25; color: {BLK}; {SPREAD(BLK)}">'
           f'Mr. MacMillan and our new V.P. of Product Development at the store, four hands on one keyboard.</p>')

pl0x, pl0y, pl1x, pl1y = B['play']
steps = ''.join(f'''<div style="display: flex; gap: 9px; align-items: baseline; margin-top: 6px">
      <span style="flex: none; width: 22px; height: 22px; background: {RED}; color: {BOARD}; font-family: {DISP}; font-size: 14px; line-height: 23px; text-align: center">{n}</span>
      <span style="font-family: {SANS}; font-weight: 700; font-size: 16px; line-height: 1.2; color: {BLK}; {SPREAD(BLK)}">{t}</span></div>'''
                for n, t in (('1', 'Catch a tray as it goes by.'), ('2', 'Try one of everything, even the caviar.'), ('3', 'Save room for the cookie.')))

tk0x, tk0y, tk1x, tk1y = B['token']
ck0x, ck0y, ck1x, ck1y = B['check']
checks = ''.join(f'''<div style="display: flex; align-items: center; gap: 7px; height: 21px">
      <span style="flex: none; width: 13px; height: 13px; border: 2px solid {BLK}; background: {BOARD}; box-sizing: border-box"></span>
      <span style="font-family: {SANS}; font-weight: 700; font-size: 14px; line-height: 1; color: {BLK}; white-space: nowrap">{n}</span></div>'''
                 for _, _, n, _, _ in ALL)
nt0x, nt0y, nt1x, nt1y = B['note']

back_inner = f'''
  {ab(mx0 + 22, my0 + 20, mid - 20, my1 - 40, left)}
  {ab(mid + 20, my0 + 20, mx1 - 22, my1 - 40, right)}
  {ab(mx0 + 22, my1 - 30, mx1 - 22, my1 - 12, f'<div style="font-family: {SANS}; font-weight: 600; font-size: 12px; letter-spacing: 0.02em; line-height: 18px; color: {NAVY}; text-align: center">© 1988 MacMillan Toy Co., New York, N.Y. Party pack, not for resale. Printed in U.S.A.</div>')}
  {ab(phx0, phy1 + 8, phx1, ph1y - 8, caption)}
  {ab(pl0x + 16, pl0y + 12, pl1x - 14, pl1y - 8, f'<div style="font-family: {DISP}; font-size: 20px; line-height: 1.1; color: {RED}">HOW TO PLAY</div>{steps}')}
  {ab(tk0x + 20, tk0y + 16, tk1x - 16, tk1y - 10, f"""<div style="font-family: {DISP}; font-size: 18px; line-height: 1.1; color: {NAVY}">PARTY TRAY TOKEN</div>
    <p style="margin: 4px 0 0; font-family: {SANS}; font-weight: 600; font-size: 15px; line-height: 1.22; color: {BLK}; {SPREAD(BLK)}">Good for one more corner cart hot dog. Hand it to any waiter.</p>
    <div style="margin-top: 10px; display: flex; justify-content: space-between; font-family: {TECH}; font-size: 12px; line-height: 1.3; color: {RED}"><span>NO CASH VALUE.</span><span>NO. 00417</span></div>""")}
  {ab(ck0x + 16, ck0y + 10, ck1x - 14, ck1y - 8, f"""<div style="display: flex; justify-content: space-between; align-items: baseline">
      <span style="font-family: {DISP}; font-size: 21px; line-height: 1.1; color: {RED}">COLLECT ALL 8!</span>
      <span style="font-family: {SANS}; font-weight: 700; font-size: 13px; color: {NAVY}">Check each one off.</span></div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 10px; margin-top: 8px">{checks}</div>""")}
  {ab(nt0x + 3, nt0y + 3, nt1x - 3, nt0y + 29, f'<div style="background: {BLK}; height: 26px; padding: 0 12px; font-family: {DISP}; font-size: 16px; line-height: 27px; letter-spacing: 0.04em; color: {YEL}">CAUTION</div>')}
  {ab(nt0x + 14, nt0y + 38, B['upc'][0] - 8, nt1y - 8, f"""<p style="margin: 0; font-family: {SANS}; font-weight: 700; font-size: 15px; line-height: 1.22; color: {BLK}; {SPREAD(BLK)}">Building does not turn<br>into a robot.</p>
    <p style="margin: 6px 0 0; font-family: {SANS}; font-weight: 600; font-size: 15px; line-height: 1.22; color: {BLK}; {SPREAD(BLK)}">Tuxedos welcome,<br>any color.</p>
    <p style="margin: 6px 0 0; font-family: {TECH}; font-size: 12px; line-height: 1.3; color: {NAVY}">LOT 0488 NY</p>""")}
'''

FRONT = face('front', front_inner)
BACK = face('back', back_inner)

for name, body, title in (('front', FRONT, 'MacMillan party pack, front'), ('back', BACK, 'MacMillan party pack, back')):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({
    'fmt': 'toystore', 'fn': 'fmtToyStore', 'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
    'mm': [215.9, 279.4], 'fonts': FONTS, 'fams': ['Bowlby One', 'League Spartan', 'Michroma'],
    'phone': {'disp': "'Bowlby One',sans-serif", 'title': "'Bowlby One',sans-serif", 'name': "'League Spartan',sans-serif",
              'body': "'League Spartan',sans-serif", 'price': "'Michroma',sans-serif", 'note': "'League Spartan',sans-serif"},
}, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)

labels = {FILM: {k: {'n': n, 'd': d, 'note': t} for k, _, n, d, t in ALL if k}}
json.dump(labels, open(os.path.join(D, 'toystore.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built front.html, back.html, film.json, toystore.labels.json')
