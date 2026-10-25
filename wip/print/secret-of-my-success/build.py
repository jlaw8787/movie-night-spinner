"""Pemrose Corporation Executive Dining Room luncheon card (The Secret of My Success, 1987), on the house STYLE-LOCK system.

Venue: the executive dining room upstairs at Pemrose, the floor Brantley talks his way onto as Carlton Whitfield.
Palette from the film's 1987 corporate world: dove grey stock, charcoal, boardroom burgundy.
Art: two TMDB stills (front hero, back framed). No painted PNG. Props: routing slip (front), charge slip and stamp (back).
US Letter, 8.5 x 11 in (816 x 1056 px at 96 dpi), two faces.
"""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
FILM = 'The Secret of My Success (1987)'

FONTS = ('family=Archivo+Black&family=Archivo:wght@500;700;800'
         '&family=Source+Serif+4:ital,wght@0,400;0,600;1,400&family=Herr+Von+Muellerhoff')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Archivo Black', sans-serif"
CAPS = "'Archivo', sans-serif"
BODY = "'Source Serif 4', serif"
SIGN = "'Herr Von Muellerhoff', cursive"

PAPER = '#e7e4dd'
INK = '#25272c'
RED = '#8b1d2c'
SOFT = '#55575c'
SLIP = '#f6f2e6'

# (spec key or None if added, printed name, price, printed description, note for the phone view)
BEGIN = [
    ('Pemrose boardroom canapés', 'Smoked salmon blini', '19.87',
     'Warm buckwheat pancakes, crème fraîche, dill and cracked pepper. By the dozen.',
     'Boardroom trays, order a day ahead.'),
    ('Kansas corn fritters', 'Kansas corn fritters', '3.25',
     'Kernels and scallions in a light egg batter, fried by the spoonful. Sour cream to dip.',
     'A taste of home, straight off the farm.'),
    (None, 'Shrimp cocktail', '7.50', 'Five jumbo shrimp on cracked ice, horseradish red sauce.', None),
]
CART = [
    ('Mailroom sandwich bites', 'Mail run sandwich', '2.75',
     'Ham, cheddar and pickle on buttered white bread, crusts off, in wax paper.',
     'Comes down on the mail cart at 11.'),
]
MAIN = [
    ('Executive rib eye', 'Executive rib eye', '16.50',
     'Seared in a hot iron pan, basted with butter, garlic and thyme, sliced.',
     'Charged to your department.'),
    ('Kansas farm fried chicken', 'Buttermilk fried chicken', '8.75',
     'Soaked overnight, floured and fried crisp. Mashed potatoes, pan gravy.',
     'Like Mom makes back home.'),
]
FINISH = [
    ('Kansas apple pie', 'Apple pie à la mode', '3.50',
     'Double crust, cinnamon apples, sugared top, vanilla ice cream.',
     'To finish, with coffee by the pot.'),
]
BAR = [
    ('Martini', 'Gin martini', '4.75', 'Stirred with dry vermouth, up in a frozen glass, lemon twist.',
     'Bar from 5:30 PM for those working late.'),
]
ALL = BEGIN + CART + MAIN + FINISH + BAR


def ab(x, y, w, inner, style=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {style}">{inner}</div>'


def kicker(t, col=RED, align='left', size=18):
    return f'<div style="text-align: {align}; font-family: {CAPS}; font-weight: 700; font-size: {size}px; letter-spacing: 0.24em; line-height: 22px; color: {col}">{t}</div>'


def bar(t):
    """Charcoal band across the column with a burgundy tab on the left."""
    return f'''<div style="position: relative; height: 52px; background: {INK}">
      <div style="position: absolute; left: 0; top: 0; width: 12px; height: 52px; background: {RED}"></div>
      <div style="position: absolute; left: 24px; top: 0; white-space: nowrap; font-family: {DISP}; font-size: 40px; line-height: 54px; letter-spacing: 0; color: {PAPER}">{t}</div></div>'''


def item(name, price, desc, first=False):
    return f'''<div style="margin-top: {0 if first else 16}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <span style="font-family: {CAPS}; font-weight: 800; font-size: 26px; line-height: 1.1; letter-spacing: -0.01em; color: {INK}">{name}</span>
        <span style="font-family: {CAPS}; font-weight: 800; font-size: 26px; line-height: 1.1; color: {RED}">{price}</span></div>
      <div style="margin-top: 4px; font-family: {BODY}; font-size: 20px; line-height: 1.32; color: {INK}; text-wrap: pretty">{desc}</div></div>'''


def group(title, items, top=0):
    rule = f'<div style="height: 1px; background: {INK}; opacity: 0.5; margin: 0 0 20px"></div>' if top else ''
    return (f'<div style="margin-top: {top}px">{rule}{bar(title)}<div style="margin-top: 14px">'
            + ''.join(item(n, p, d, i == 0) for i, (_, n, p, d, _) in enumerate(items)) + '</div></div>')


def frame():
    return (ab(0, 0, W, '', f'height: 14px; background: {INK}')
            + ab(0, 14, W, '', f'height: 5px; background: {RED}')
            + ab(0, H - 14, W, '', f'height: 14px; background: {INK}'))


def finish(face):
    return f'''
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none; opacity: 0.32">
  <img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'''


def face(name, inner, props):
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">
  {frame()}
  {inner}
  {finish(name)}
  {props}
</div>'''


# ---------------------------------------------------------------- front: cover
masthead = f'''<div style="display: flex; justify-content: space-between; align-items: baseline">
    <span style="font-family: {DISP}; font-size: 34px; line-height: 40px; letter-spacing: 0.2em; color: {INK}">PEMROSE</span>
    <span style="font-family: {CAPS}; font-weight: 700; font-size: 16px; letter-spacing: 0.24em; line-height: 20px; color: {SOFT}">CORPORATION &nbsp;&#9670;&nbsp; NEW YORK</span></div>
  <div style="margin-top: 10px; height: 3px; background: {INK}"></div>
  <div style="margin-top: 3px; height: 1px; background: {RED}"></div>'''

note = f'''{kicker('FROM THE PRESIDENT')}
  <p style="margin: 12px 0 0; font-family: {BODY}; font-size: 20px; line-height: 1.45; color: {INK}">Lean times call for clear heads and a proper lunch. Charges now go to your department, so order as if it were your own money.</p>
  <div style="margin-top: 2px; font-family: {SIGN}; font-size: 58px; line-height: 1.0; color: #23305a">Howard Prescott</div>
  <div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {SOFT}">President and Chief Executive Officer</div>'''

front_inner = f'''
  {ab(64, 52, 688, masthead)}
  {ab(64, 134, 688, kicker('LUNCHEON 12 NOON TO 2:30 &nbsp;&#9670;&nbsp; BAR FROM 5:30', RED, 'center'))}
  {ab(40, 166, 736, f'<div style="text-align: center; font-family: {DISP}; font-size: 66px; line-height: 68px; letter-spacing: -0.01em; color: {INK}">THE EXECUTIVE<br>DINING ROOM</div>')}
  <div style="position: absolute; left: 64px; top: 320px; width: 688px; height: 395px; border: 2px solid {RED}; box-sizing: border-box; background: #fbfaf6; padding: 5px">
    <img src="assets/still-view.jpg" alt="" style="display: block; width: 674px; height: 381px"></div>
  {ab(64, 723, 688, f'<div style="text-align: right; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 22px; color: {SOFT}">Window tables upstairs, by request. Empty offices need a work order.</div>')}
  {ab(64, 772, 410, note)}
  {ab(64, 988, 688, f'''<div style="display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; line-height: 20px; color: {SOFT}">
    <span>Food Services, ext. 4110. Form EDR-87.</span><span>Prices subject to change. 1987.</span></div>''')}
'''


def box(on):
    mark = f'<div style="position: absolute; left: 3px; top: -3px; font-family: {DISP}; font-size: 17px; line-height: 20px; color: {RED}">x</div>' if on else ''
    return f'<div style="position: relative; flex: none; width: 16px; height: 16px; border: 1.5px solid {INK}; box-sizing: border-box; margin-top: 3px">{mark}</div>'


def row(n, name, on, strike=False):
    st = 'text-decoration: line-through; text-decoration-color: ' + RED + '; text-decoration-thickness: 2px;' if strike else ''
    return f'''<div style="display: flex; gap: 10px; margin-top: 7px; font-family: {BODY}; font-size: 17px; line-height: 22px; white-space: nowrap; color: {INK}">
      {box(on)}<span style="width: 18px">{n}.</span><span style="{st}">{name}</span></div>'''


routing = f'''<div style="position: absolute; left: 488px; top: 778px; width: 262px; height: 190px; transform: rotate(3deg);
    background: {SLIP}; box-shadow: 1px 2px 5px rgba(40,30,25,0.28); box-sizing: border-box; padding: 12px 16px">
    <div style="font-family: {CAPS}; font-weight: 800; font-size: 14px; letter-spacing: 0.2em; line-height: 17px; color: {RED}">ROUTING SLIP</div>
    <div style="margin-top: 4px; height: 1px; background: {INK}"></div>
    {row(1, 'H. Prescott', True)}{row(2, 'C. Wills, Finance', True)}{row(3, 'B. Foster', False, True)}{row(4, 'C. Whitfield', True)}{row(5, 'F. Melrose, Mailroom', False)}
  </div>'''

# ---------------------------------------------------------------- back: the menu
L, C, G = 64, 336, 16
back_inner = f'''
  {ab(L, 60, 440, kicker('CHARGED TO YOUR DEPT.'))}
  {ab(L, 88, 440, f'<div style="white-space: nowrap; font-family: {DISP}; font-size: 70px; line-height: 76px; color: {INK}">THE MENU</div>')}
  {ab(L, 176, 380, f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 24px; color: {INK}">Jackets and ties, please. Elevators are not changing rooms.</div>')}
  <div style="position: absolute; left: 492px; top: 44px; width: 260px; height: 196px; border: 2px solid {RED}; box-sizing: border-box; background: #fbfaf6; padding: 5px">
    <img src="assets/still-hall.jpg" alt="" style="display: block; width: 246px; height: 182px"></div>
  {ab(400, 246, 352, f'<div style="text-align: right; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 20px; color: {SOFT}">The executive floor. Mr. Whitfield, settling in.</div>')}
  {ab(L, 284, C, group('TO BEGIN', BEGIN) + group('TO FINISH', FINISH, 18))}
  {ab(L + C + G, 284, C, group('ENTRÉES', MAIN) + group('MAIL CART', CART, 18) + group('AFTER 5:30', BAR, 18))}
  {ab(L, 988, 688, f'''<div style="display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; line-height: 20px; color: {SOFT}">
    <span>Tables of four, call ext. 4110 by 11 AM.</span><span>Coffee by the pot. Prices subject to change. 1987.</span></div>''')}
'''
charge = f'''<div style="position: absolute; left: 72px; top: 820px; width: 318px; height: 136px; transform: rotate(-2.5deg);
    background: {SLIP}; box-shadow: 1px 2px 5px rgba(40,30,25,0.28); box-sizing: border-box; padding: 11px 16px">
    <div style="display: flex; justify-content: space-between; white-space: nowrap; font-family: {CAPS}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; line-height: 17px; color: {RED}"><span>DINING ROOM CHARGE</span><span>No. 1987</span></div>
    <div style="margin-top: 5px; height: 1px; background: {INK}"></div>
    <div style="margin-top: 8px; font-family: {BODY}; font-size: 17px; line-height: 24px; color: {INK}">Name: <b>C. Whitfield</b><br>Dept.: <b>Executive, see H.P.</b><br>Covers: <b>2</b> &nbsp; Table: <b>window</b></div>
  </div>
  <div style="position: absolute; left: 262px; top: 870px; width: 112px; height: 46px; transform: rotate(-9deg); border: 3px solid {RED}; box-sizing: border-box; opacity: 0.82;
    text-align: center; font-family: {DISP}; font-size: 22px; line-height: 40px; letter-spacing: 0.12em; color: {RED}">PAID</div>'''

FRONT = face('front', front_inner, routing)
BACK = face('back', back_inner, charge)

for name, body, title in (('front', FRONT, 'Pemrose dining room menu, front'), ('back', BACK, 'Pemrose dining room menu, back')):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({
    'fmt': 'mailroomexecutive', 'fn': 'fmtMailroomExecutive', 'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
    'mm': [215.9, 279.4], 'fonts': FONTS,
    'fams': ['Archivo Black', 'Archivo', 'Source Serif 4', 'Herr Von Muellerhoff'],
    'phone': {'disp': "'Archivo Black',sans-serif", 'title': "'Archivo Black',sans-serif", 'name': "'Archivo',sans-serif",
              'body': "'Source Serif 4',serif", 'price': "'Archivo',sans-serif", 'note': "'Source Serif 4',serif"},
}, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)

labels = {FILM: {k: {'n': n, 'd': d, 'note': t} for k, n, _, d, t in ALL if k}}
json.dump(labels, open(os.path.join(D, 'mailroomexecutive.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
