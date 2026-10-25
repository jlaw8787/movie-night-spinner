"""Pemrose Corporation Executive Dining Room table card (The Secret of My Success, 1987).

Format: slim table card, two faces 408 x 1056 px (4.25 x 11 in at 96 dpi).
Venue: the executive dining room upstairs at Pemrose, the floor Brantley talks his way onto as Carlton Whitfield.
Palette from the film's 1987 corporate world: dove grey stock, charcoal, boardroom burgundy.
Signature piece (paint.py): a tall engraved view of the Manhattan skyline through a Pemrose tower window,
running the height of the front, with the venue lettered on the transom glass. Prop: the routing slip.
"""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 408, 1056
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
    ('Pemrose boardroom canapés', 'Salmon blini', '19.87',
     'Smoked salmon and crème fraîche on warm buckwheat, dill.',
     'Boardroom trays, order a day ahead.'),
    ('Kansas corn fritters', 'Kansas corn fritters', '3.25',
     'Kernels and scallions in egg batter, fried crisp. Sour cream.',
     'A taste of home, straight off the farm.'),
    (None, 'Shrimp cocktail', '7.50', 'Five jumbo shrimp on cracked ice, horseradish red sauce.', None),
]
MAIN = [
    ('Executive rib eye', 'Executive rib eye', '16.50',
     'Seared in an iron pan, basted with butter, garlic and thyme.',
     'Charged to your department.'),
    ('Kansas farm fried chicken', 'Fried chicken', '8.75',
     'Buttermilk soaked, fried crisp. Mashed potatoes, gravy.',
     'Like Mom makes back home.'),
    ('Mailroom sandwich bites', 'Mail run sandwich', '2.75',
     'Ham, cheddar and pickle on buttered white, crusts off.',
     'Comes up on the mail cart at 11.'),
]
FINISH = [
    ('Kansas apple pie', 'Apple pie à la mode', '3.50',
     'Double crust, cinnamon apples, vanilla ice cream.',
     'To finish, with coffee by the pot.'),
    ('Martini', 'Gin martini', '4.75', 'Bar from 5:30. Stirred with dry vermouth, twist.',
     'Bar from 5:30 PM for those working late.'),
]
ALL = BEGIN + MAIN + FINISH


def ab(x, y, w, inner, style=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {style}">{inner}</div>'


def kicker(t, col=RED, align='left', size=18, sp='0.2em'):
    return f'<div style="text-align: {align}; white-space: nowrap; font-family: {CAPS}; font-weight: 700; font-size: {size}px; letter-spacing: {sp}; line-height: 22px; color: {col}">{t}</div>'


def head(t):
    return f'''<div style="font-family: {DISP}; font-size: 40px; line-height: 42px; color: {INK}; white-space: nowrap">{t}</div>
      <div style="margin-top: 4px; height: 2px; background: {RED}"></div>'''


def item(name, price, desc, first=False):
    return f'''<div style="margin-top: {10 if first else 8}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px; white-space: nowrap">
        <span style="font-family: {CAPS}; font-weight: 800; font-size: 26px; line-height: 29px; letter-spacing: -0.01em; color: {INK}">{name}</span>
        <span style="font-family: {CAPS}; font-weight: 800; font-size: 26px; line-height: 29px; color: {RED}">{price}</span></div>
      <div style="margin-top: 3px; font-family: {BODY}; font-size: 20px; line-height: 25px; color: {INK}; text-wrap: pretty">{desc}</div></div>'''


def group(title, items, top=0):
    return (f'<div style="margin-top: {top}px">{head(title)}'
            + ''.join(item(n, p, d, i == 0) for i, (_, n, p, d, _) in enumerate(items)) + '</div>')


def finish(face):
    return f'''
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none; opacity: 0.32">
  <img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'''


def face(name, inner, props=''):
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">
  {inner}
  {finish(name)}
  {props}
</div>'''


# ---------------------------------------------------------------- front: the window
transom = f'''
  {ab(40, 42, 328, f'<div style="text-align: center; font-family: {DISP}; font-size: 36px; line-height: 40px; letter-spacing: 0.2em; padding-left: 0.2em; color: {INK}">PEMROSE</div>')}
  {ab(40, 86, 328, kicker('CORPORATION', SOFT, 'center', 18, '0.3em'))}
  {ab(64, 118, 280, '', f'height: 1px; background: {INK}')}
  {ab(40, 130, 328, kicker('THE EXECUTIVE', RED, 'center', 20, '0.24em'))}
  {ab(30, 156, 348, f'<div style="text-align: center; font-family: {DISP}; font-size: 64px; line-height: 64px; letter-spacing: -0.01em; color: {INK}">DINING<br>ROOM</div>')}
  {ab(40, 296, 328, kicker('LUNCHEON 12 TO 2:30', RED, 'center', 18, '0.2em'))}'''

note = f'''<div style="position: absolute; left: 40px; top: 776px; width: 328px; height: 228px; background: {SLIP}; box-sizing: border-box;
    border: 1px solid {RED}; box-shadow: 1px 2px 5px rgba(40,30,25,0.25); padding: 14px 18px">
    {kicker('FROM THE PRESIDENT', RED, 'left', 18, '0.2em')}
    <p style="margin: 8px 0 0; font-family: {BODY}; font-size: 20px; line-height: 26px; color: {INK}; text-wrap: pretty">Lean times call for a proper lunch. Charges go to your department. Elevators are not changing rooms.</p>
    <div style="margin-top: 6px; font-family: {SIGN}; font-size: 48px; line-height: 46px; color: #23305a">Howard Prescott</div>
    <div style="font-family: {BODY}; font-size: 16px; line-height: 20px; color: {SOFT}">President and Chief Executive Officer</div></div>'''


def box(on):
    mark = f'<div style="position: absolute; left: 3px; top: -3px; font-family: {DISP}; font-size: 17px; line-height: 20px; color: {RED}">x</div>' if on else ''
    return f'<div style="position: relative; flex: none; width: 16px; height: 16px; border: 1.5px solid {INK}; box-sizing: border-box; margin-top: 3px">{mark}</div>'


def row(n, name, on, strike=False):
    st = f'text-decoration: line-through; text-decoration-color: {RED}; text-decoration-thickness: 2px;' if strike else ''
    return f'''<div style="display: flex; gap: 8px; margin-top: 6px; white-space: nowrap; font-family: {BODY}; font-size: 17px; line-height: 22px; color: {INK}">
      {box(on)}<span style="width: 16px">{n}.</span><span style="{st}">{name}</span></div>'''


routing = f'''<div style="position: absolute; left: 132px; top: 566px; width: 236px; height: 186px; transform: rotate(3deg);
    background: {SLIP}; box-shadow: 1px 2px 5px rgba(40,30,25,0.30); box-sizing: border-box; padding: 11px 14px">
    <div style="font-family: {CAPS}; font-weight: 800; font-size: 14px; letter-spacing: 0.2em; line-height: 17px; color: {RED}">ROUTING SLIP</div>
    <div style="margin-top: 4px; height: 1px; background: {INK}"></div>
    {row(1, 'H. Prescott', True)}{row(2, 'C. Wills, Finance', True)}{row(3, 'B. Foster', False, True)}{row(4, 'C. Whitfield', True)}{row(5, 'F. Melrose, Mailroom', False)}
  </div>'''

front_inner = f'''
  <img src="assets/skyline-engraving.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">
  {transom}
  {note}'''

# ---------------------------------------------------------------- back: the menu, inside the same burgundy window frame
frame = (ab(18, 18, 6, '', f'height: {H - 36}px; background: {RED}') + ab(W - 24, 18, 6, '', f'height: {H - 36}px; background: {RED}')
         + ab(18, 18, W - 36, '', f'height: 6px; background: {RED}') + ab(18, H - 24, W - 36, '', f'height: 6px; background: {RED}'))
back_inner = f'''
  {frame}
  {ab(40, 42, 328, kicker('CHARGED TO YOUR DEPT.', RED, 'center', 18, '0.2em'))}
  {ab(40, 76, 328, group('TO BEGIN', BEGIN) + group('ENTRÉES', MAIN, 16) + group('TO FINISH', FINISH, 16))}
  {ab(40, 994, 328, f'<div style="text-align: center; font-family: {BODY}; font-size: 16px; line-height: 20px; color: {SOFT}">Form EDR-87. Prices subject to change.</div>')}
'''

FRONT = face('front', front_inner, routing)
BACK = face('back', back_inner)

for name, body, title in (('front', FRONT, 'Pemrose table card, front'), ('back', BACK, 'Pemrose table card, back')):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({
    'fmt': 'mailroomexecutive', 'fn': 'fmtMailroomExecutive', 'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
    'mm': [107.95, 279.4], 'fonts': FONTS,
    'fams': ['Archivo Black', 'Archivo', 'Source Serif 4', 'Herr Von Muellerhoff'],
    'phone': {'disp': "'Archivo Black',sans-serif", 'title': "'Archivo Black',sans-serif", 'name': "'Archivo',sans-serif",
              'body': "'Source Serif 4',serif", 'price': "'Archivo',sans-serif", 'note': "'Source Serif 4',serif"},
}, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)

labels = {FILM: {k: {'n': n, 'd': d, 'note': t} for k, n, _, d, t in ALL if k}}
json.dump(labels, open(os.path.join(D, 'mailroomexecutive.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
