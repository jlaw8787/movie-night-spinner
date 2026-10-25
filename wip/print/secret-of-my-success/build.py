"""Pemrose Corporation interoffice memorandum, two sheets stapled (The Secret of My Success, 1987).
Food Services sends the new Executive Dining Room menu to all executive staff; page 2 is a
continuation sheet with the lower level Employee Cafeteria, boardroom catering and Office Services
reminders, plus the distribution list the mailroom ticks off as it delivers.

Made the way a 1987 New York head office made it: typed on a Selectric (Courier, a larger 10 pitch
element for the dish lines and a 12 pitch element for the rest), typed period leaders and
underscored headings, on a typeset one-ink letterhead, then run through the copier. One black ink.
The staple, the red RECEIVED stamp and the blue ballpoint go on after copying.

US Letter portrait, 8.5 x 11 in, two separate sheets, printed one side each, no fold.
Writes front.html and back.html (one root div each, 816 x 1056 px) with paths relative to this folder."""
import os
from PIL import Image
D = os.path.dirname(os.path.abspath(__file__))
INK, PAPER = '#1d1d1c', '#f6f6f3'
FONTS = 'family=Courier+Prime:wght@400;700&family=Libre+Bodoni:ital,wght@0,400;0,700;1,400'
LEAD = '.' * 90

def item(name, price, desc, first=False, gap=13):
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="display: flex; align-items: baseline; font-size: 18px; line-height: 23px; font-weight: 700">
        <span style="white-space: nowrap">{name}</span>
        <span style="flex: 1 1 0; min-width: 0; overflow: hidden; white-space: nowrap; font-weight: 400; font-size: 16px; padding: 0 6px; letter-spacing: 0.04em">{LEAD}</span>
        <span style="white-space: nowrap">{price}</span></div>
      <div style="font-size: 16px; line-height: 22px; margin-top: 2px">{desc}</div></div>'''

def sub(t, first=False, gap=24):
    return (f'<div style="margin: {0 if first else gap}px 0 9px; font-size: 16px; line-height: 20px; font-weight: 700">'
            f'<span style="text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1.5px">{t}</span></div>')

def col(groups, gap=13, sgap=24):
    s = ''
    for gi, (t, items) in enumerate(groups):
        s += sub(t, gi == 0, sgap) + ''.join(item(*it, first=(i == 0), gap=gap) for i, it in enumerate(items))
    return s

def head(t, right):
    return (f'<div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 20px; line-height: 26px">'
            f'<span style="font-weight: 700; letter-spacing: 0.06em; text-decoration: underline; text-decoration-style: double; text-underline-offset: 4px">{t}</span>'
            f'<span style="font-size: 16px">{right}</span></div>')

def fields(rows):
    return ''.join(f'<div style="display: flex"><span style="width: 120px; flex: none">{lab}</span><span>{val}</span></div>' for lab, val in rows)

def foot(form, right):
    return (f'<div style="position: absolute; left: 64px; top: 988px; width: 688px; display: flex; justify-content: space-between; align-items: baseline">'
            f'<span style="font-family: \'Libre Bodoni\', serif; font-size: 12px; letter-spacing: 0.06em">{form}</span>'
            f'<span style="font-size: 16px">{right}</span></div>')

def img(src, left, top, extra=''):
    im = Image.open(os.path.join(D, 'assets', src))
    return (f'<img src="assets/{src}" alt="" aria-hidden="true" style="position: absolute; left: {left}px; top: {top}px; '
            f'width: {im.width / 2:g}px; height: {im.height / 2:g}px; display: block; pointer-events: none{extra}">')

# ---------- page 1: the memo and the Executive Dining Room ----------
FIELDS = fields([('TO:', 'All Executive Staff'), ('FROM:', 'Food Services, ext. 4110'), ('DATE:', 'March 2, 1987'),
                 ('SUBJECT:', 'New Executive Dining Room menu'), ('CC:', 'H. Prescott')])
BODY = ('<p style="margin: 0">Starting Monday, March 9, the Executive Dining Room will serve the menu below. '
        'Luncheon is from 12 noon to 2:30 PM. Bar service starts at 5:30 PM for anyone working late.</p>'
        '<p style="margin: 12px 0 0">In line with the current cost review, all charges now go to your department '
        'and appear on the monthly statement. Tables of four or more, please call by 11 AM.</p>')
EXEC_LEFT = col([('LUNCHEON', [
    ('SHRIMP COCKTAIL', '6.50', 'Five jumbo shrimp on cracked ice with horseradish red sauce.'),
    ('EXECUTIVE RIB EYE', '15.75', 'Seared in a hot iron pan, basted with butter, garlic and fresh thyme, then sliced.'),
    ('FILET OF SOLE', '12.50', 'Broiled with lemon and parsley, buttered new potatoes.')])])
EXEC_RIGHT = col([
    ('TO FINISH', [
        ('APPLE PIE A LA MODE', '2.75', 'Double crust, cinnamon apples and a sugared top, vanilla ice cream.'),
        ('COFFEE OR TEA', '.75', 'Regular or decaf, by the pot.')]),
    ('AFTER 5:30 PM', [
        ('GIN MARTINI', '3.75', 'Stirred with dry vermouth, served up in a frozen glass, twist.'),
        ('SCOTCH AND SODA', '3.25', 'Tall, over ice.')])])

def specials(rows):
    cells = ''
    for day, dish, price in rows:
        cells += (f'<div style="display: flex; align-items: baseline; font-size: 16px; line-height: 23px">'
                  f'<span style="width: 48px; flex: none; font-weight: 700">{day}</span><span style="white-space: nowrap">{dish}</span>'
                  f'<span style="flex: 1 1 0; min-width: 0; overflow: hidden; white-space: nowrap; padding: 0 5px; letter-spacing: 0.04em">{LEAD}</span><span>{price}</span></div>')
    return (f'<div style="border: 1.5px solid {INK}; padding: 10px 16px 11px">'
            f'<div style="display: flex; justify-content: space-between; font-size: 16px; line-height: 22px; margin-bottom: 6px">'
            f'<span style="font-weight: 700; text-decoration: underline; text-underline-offset: 3px">THIS WEEK\'S SPECIALS</span><span>Week of March 9</span></div>'
            f'<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 32px">{cells}</div></div>')
SPECIALS = specials([('MON', 'Manhattan clam chowder', '1.95'), ('THU', 'Yankee pot roast', '9.25'),
                     ('TUE', 'Chicken pot pie', '7.25'), ('FRI', 'Broiled swordfish', '13.75'),
                     ('WED', 'Veal piccata, noodles', '11.50'), ('', 'Soup and half sandwich', '4.25')])

# ---------- page 2: cafeteria, catering, reminders ----------
CAF_INTRO = ('<p style="margin: 0 0 22px">The Employee Cafeteria on the lower level, next to the mailroom, is open '
             'from 7:30 AM to 3:30 PM. Cash only. Executive staff are always welcome.</p>')
CAF_LEFT = col([('AT THE COUNTER', [
    ('EGG ON A ROLL', '.85', 'Fried egg and American cheese on a kaiser roll, until 10:30.'),
    ('MAIL RUN SANDWICH', '1.75', 'Ham, cheddar and pickle on buttered white bread, crusts off, cut in fingers and wrapped in wax paper.'),
    ('KANSAS CORN FRITTERS', '1.10', 'Sweet corn and scallions in an egg batter, dropped by the spoonful and fried golden. Sour cream for dipping.')])])
CAF_RIGHT = col([('HOT PLATE', [
    ('BUTTERMILK FRIED CHICKEN', '3.95', 'Soaked overnight, rolled in seasoned flour and cooked crisp. Mashed potatoes, pan gravy.'),
    ('SOUP OF THE DAY', '.90', 'Cup, with oyster crackers.'),
    ('CHEESE DANISH', '.75', 'From the bakery cart, every morning.'),
    ('COFFEE', '.40', 'Black or regular. Free refills.')])])
REMIND = (sub('BOARDROOM CATERING', True)
          + item('SMOKED SALMON BLINI', '16.00', 'Warm buckwheat pancakes with sour cream, dill and cracked pepper. By the dozen.', True)
          + item('CHEESE AND FRUIT TRAY', '22.00', 'Serves ten. Order a day ahead.')
          + sub('OFFICE SERVICES REMINDERS', gap=22)
          + ''.join(f'<div style="display: flex; gap: 10px; margin-top: {0 if i == 0 else 3}px; font-size: 16px; line-height: 22px"><span>-</span><span>{t}</span></div>'
                    for i, t in enumerate(['Mail runs at 9, 11, 2 and 4.', 'Elevators are not changing rooms.', 'Empty offices need a work order.'])))

ROW_H = 36
ROUTE_NAMES = [('H. Prescott', 0), ('C. Wills', 1), ('C. Whitfield', 2), ('Executive floors', 3), ('Mailroom, F. Melrose', None)]
def route():
    rows = ''
    for n, _ in ROUTE_NAMES:
        rows += (f'<div style="display: flex; align-items: center; gap: 12px; height: {ROW_H - 1}px; border-bottom: 1px solid {INK}">'
                 f'<span style="width: 15px; height: 15px; border: 1.5px solid {INK}; flex: none"></span>'
                 f'<span style="font-size: 16px; flex: 1">{n}</span></div>')
    return (f'<div style="border: 1.5px solid {INK}; padding: 10px 14px 10px">'
            f'<div style="font-weight: 700; font-size: 16px; line-height: 20px; margin-bottom: 4px; text-decoration: underline; text-underline-offset: 3px">DISTRIBUTION</div>'
            f'{rows}<div style="font-size: 14px; margin-top: 8px; line-height: 19px">Mailroom: tick and initial each copy as delivered.</div></div>')
ROUTE = route()

T = dict(INK=INK)
def fill(name, extra):
    b = open(os.path.join(D, name + '.body.html')).read()
    for k, v in {**T, **extra}.items(): b = b.replace('{{' + k + '}}', str(v))
    assert '{{' not in b, name
    return b

MENU_TOP, SPEC_TOP = 474, 862
LOW_TOP = 668
# distribution box geometry, for the pen marks laid on top after copying
RX, RY = 64 + 688 - 300, LOW_TOP
ROW0 = RY + 1.5 + 10 + 24          # border + padding + title
pen = ''
for i, (n, t) in enumerate(ROUTE_NAMES):
    if t is None: continue
    y = ROW0 + i * ROW_H
    pen += img(f'pen-tick-{t}.png', RX + 14, y - 2)
    if i < 3: pen += img(f'pen-initials-{i}.png', RX + 238, y - 4)

FRONT_POST = img('staple.png', 36 - 35, 34 - 20) + img('stamp-received.png', 520, 154)
BACK_POST = pen

FACES = {
  'front': (fill('front', dict(FIELDS=FIELDS, RULE='_' * 80, BODY=BODY, MENU_TOP=MENU_TOP, SPEC_TOP=SPEC_TOP,
                               MENU_HEAD=head('EXECUTIVE DINING ROOM', 'Charged to your department'),
                               EXEC_LEFT=EXEC_LEFT, EXEC_RIGHT=EXEC_RIGHT, SPECIALS=SPECIALS,
                               FOOT=foot('Form OS-114 (Rev. 1/87)', '(continued)'))), FRONT_POST),
  'back': (fill('back', dict(CAF_TOP=158, CAF_INTRO=CAF_INTRO, CAF_HEAD=head('EMPLOYEE CAFETERIA', 'Lower level'),
                             CAF_LEFT=CAF_LEFT, CAF_RIGHT=CAF_RIGHT, LOW_TOP=LOW_TOP, REMIND=REMIND, ROUTE=ROUTE,
                             FOOT=foot('Form OS-114A (Rev. 1/87)', '- 2 -'))), BACK_POST),
}
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
FULL = 'position: absolute; left: 0; top: 0; width: 816px; height: 1056px; pointer-events: none; display: block'
for name, (inner, post) in FACES.items():
    page = (f'<div style="position: relative; width: 816px; height: 1056px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="{FULL}; opacity: 0.45">'
            f'{inner}'
            f'<img src="assets/wear-fade-{name}.png" alt="" aria-hidden="true" style="{FULL}">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="{FULL}">'
            f'{post}</div>')
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pemrose memorandum, {name}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{page}</body></html>')
print('built')
