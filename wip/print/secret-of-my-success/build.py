"""Pemrose Corporation interoffice memorandum, two sheets stapled (The Secret of My Success, 1987).
Food Services sends the new Executive Dining Room menu to all executive staff; page 2 carries the
lower level Employee Cafeteria, boardroom catering and Office Services reminders.
US Letter portrait, 8.5 x 11 in, two separate sheets, printed one side each, no fold.
Writes front.html and back.html (one root div each, 816 x 1056 px) with paths relative to this folder."""
import os
D = os.path.dirname(os.path.abspath(__file__))
INK, NAVY, RED, SOFT, PAPER, STAMP, PEN = '#22242e', '#1d2c4c', '#a3262a', '#5d5a55', '#fbf8f0', '#5a3f8a', '#27408f'
FONTS = 'family=Archivo:wght@500;600;700;800&family=Courier+Prime:ital,wght@0,400;0,700;1,400'
SANS = "font-family: 'Archivo', sans-serif"

def item(name, desc, price, first=False):
    return f'''<div style="margin-top: {0 if first else 16}px">
      <div style="display: flex; align-items: baseline; gap: 6px">
        <span style="font-weight: 700; font-size: 20px; line-height: 1.15">{name}</span>
        <span style="flex: 1; border-bottom: 2px dotted rgba(34,36,46,0.55); transform: translateY(-5px)"></span>
        <span style="font-weight: 700; font-size: 18px; white-space: nowrap">{price}</span></div>
      <p style="margin: 3px 0 0; font-size: 16px; line-height: 1.38">{desc}</p></div>'''

def sub(t, first=False):
    return (f'<div style="margin: {0 if first else 26}px 0 10px; font-weight: 700; font-size: 16px; letter-spacing: 0.08em">'
            f'<span style="border-bottom: 2px solid {INK}; padding-bottom: 1px">{t}</span></div>')

def col(groups):
    s = ''
    for gi, (t, items) in enumerate(groups):
        s += sub(t, gi == 0) + ''.join(item(*it, first=(i == 0)) for i, it in enumerate(items))
    return s

def head(t, right):
    return (f'<div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid {NAVY}; padding-bottom: 6px">'
            f'<span style="font-weight: 700; font-size: 24px; letter-spacing: 0.04em; color: {INK}">{t}</span>'
            f'<span style="font-size: 16px">{right}</span></div>')

def fields(rows):
    s = ''
    for lab, val in rows:
        s += (f'<div style="display: flex; align-items: baseline; height: 33px; border-bottom: 1px solid rgba(29,44,76,0.55)">'
              f'<span style="width: 104px; {SANS}; font-weight: 700; font-size: 12px; letter-spacing: 0.16em; color: {RED}">{lab}</span>'
              f'<span style="font-size: 18px; line-height: 33px">{val}</span></div>')
    return s

STAMP_HTML = f'''<div style="position: absolute; left: 548px; top: 160px; width: 196px; transform: rotate(-6deg); opacity: 0.78; color: {STAMP}; {SANS}; text-align: center">
    <div style="border: 3px solid {STAMP}; padding: 3px">
      <div style="border: 1px solid {STAMP}; padding: 6px 4px 7px">
        <div style="font-weight: 800; font-size: 14px; letter-spacing: 0.34em; padding-left: 0.34em">RECEIVED</div>
        <div style="font-weight: 800; font-size: 26px; letter-spacing: 0.06em; line-height: 1.1; margin: 3px 0 2px">MAR 3 1987</div>
        <div style="font-weight: 700; font-size: 13px; letter-spacing: 0.3em; padding-left: 0.3em">MAILROOM</div>
      </div></div></div>'''

def foot(page):
    return (f'<div style="position: absolute; left: 64px; top: 986px; width: 688px; height: 1px; background: rgba(29,44,76,0.5)"></div>'
            f'<div style="position: absolute; left: 64px; top: 994px; width: 688px; display: flex; justify-content: space-between; {SANS}; font-weight: 500; font-size: 12px; letter-spacing: 0.04em; color: {SOFT}">'
            f'<span>Form OS-114 (Rev. 1/87). Printed in U.S.A.</span><span>Page {page} of 2</span></div>')

STAPLE = ('<div style="position: absolute; left: 30px; top: 27px; width: 36px; height: 5px; border-radius: 2px; transform: rotate(-24deg); '
          'background: linear-gradient(#e2e3e6, #8d9096 55%, #6a6d73); border: 1px solid #5c5f66"></div>')

# ---------- page 1: the memo and the Executive Dining Room ----------
FIELDS = fields([('TO', 'All Executive Staff'), ('FROM', 'Food Services'), ('DATE', 'March 2, 1987'),
                 ('SUBJECT', 'Executive Dining Room menu'), ('CC', 'H. Prescott')])
BODY = ('<p style="margin: 0">Starting Monday, March 9, the Executive Dining Room will serve the menu below. '
        'Lunch is from 12 noon to 2:30 PM. Bar service starts at 5:30 PM for anyone working late.</p>'
        '<p style="margin: 14px 0 0">In line with the current cost review, all charges now go to your department. '
        'Book tables of four or more on extension 4110.</p>')
EXEC_LEFT = col([('LUNCHEON', [
    ('Shrimp cocktail', 'Chilled on cracked ice, five to a glass, horseradish red sauce and lemon.', '6.50'),
    ('Executive rib eye', 'Dry-brined, seared hard and basted in butter with thyme and garlic, rested, then sliced.', '15.75'),
    ('Filet of sole', 'Broiled with lemon butter and parsley, boiled new potatoes.', '12.50')])])
EXEC_RIGHT = col([
    ('TO FINISH', [
        ('Farmhouse apple pie', 'Cinnamon and sugar under a double crust, served with vanilla ice cream.', '2.75'),
        ('Coffee or tea', 'Regular or decaf, by the pot.', '.75')]),
    ('AFTER 5:30 PM', [
        ('Gin martini', 'Stirred over ice with dry vermouth, strained into a frozen glass, lemon twist.', '3.75')])])

# ---------- page 2: cafeteria, catering, reminders ----------
CAF_INTRO = ('<p style="margin: 0 0 24px">The Employee Cafeteria on the lower level, next to the mailroom, is open '
             'from 7:30 AM to 3:30 PM. Cash only, and executive staff are always welcome.</p>')
CAF_LEFT = col([('AT THE COUNTER', [
    ('Mail run sandwich', 'Ham, cheddar and pickle on buttered white bread, crusts off, cut in fingers and wrapped in wax paper.', '1.75'),
    ('Kansas corn fritters', 'Sweet kernels and spring onion in a light batter, fried golden. Sour cream on the side.', '1.10')])])
CAF_RIGHT = col([('HOT PLATE', [
    ('Buttermilk chicken', 'Brined overnight, dredged in seasoned flour and fried crisp. Mashed potatoes and gravy.', '3.95'),
    ('Cheese Danish', 'Sweet cheese, baked daily.', '.75'),
    ('Coffee', 'Black or regular, in a paper cup. Free refills.', '.40')])])
REMIND = (sub('BOARDROOM CATERING', True)
          + item('Smoked salmon blini', 'Warm buckwheat pancakes, cr&egrave;me fra&icirc;che, dill and cracked pepper. Sold by the dozen.', '16.00')
          + sub('OFFICE SERVICES REMINDERS')
          + ''.join(f'<div style="display: flex; gap: 10px; margin-top: {0 if i == 0 else 6}px; font-size: 16px; line-height: 1.38"><span>-</span><span>{t}</span></div>'
                    for i, t in enumerate(['Mail runs at 9, 11, 2 and 4.', 'Elevators are not changing rooms.', 'Empty offices need a work order.'])))

def tick():
    return (f'<span style="position: absolute; left: 3px; top: -3px; width: 14px; height: 20px; box-sizing: border-box; '
            f'border-right: 3px solid {PEN}; border-bottom: 3px solid {PEN}; transform: rotate(38deg); opacity: 0.85"></span>')

def route(names):
    rows = ''
    for n, t in names:
        rows += (f'<div style="display: flex; align-items: center; gap: 12px; height: 34px; border-bottom: 1px solid rgba(29,44,76,0.35)">'
                 f'<span style="position: relative; width: 16px; height: 16px; border: 1.5px solid {NAVY}; flex: none">{tick() if t else ""}</span>'
                 f'<span style="font-size: 17px">{n}</span></div>')
    return (f'<div style="border: 2px solid {NAVY}; padding: 12px 16px 10px">'
            f'<div style="{SANS}; font-weight: 700; font-size: 12px; letter-spacing: 0.2em; color: {RED}; margin-bottom: 4px">DISTRIBUTION</div>'
            f'{rows}<div style="{SANS}; font-weight: 500; font-size: 12px; color: {SOFT}; margin-top: 8px; line-height: 1.35">Mailroom: tick each copy as delivered.</div></div>')
ROUTE = route([('H. Prescott', True), ('C. Wills', True), ('C. Whitfield', True), ('Executive floors', True), ('Mailroom, F. Melrose', False)])

T = dict(INK=INK, NAVY=NAVY, RED=RED, SOFT=SOFT)
def fill(name, extra):
    b = open(os.path.join(D, name + '.body.html')).read()
    for k, v in {**T, **extra}.items(): b = b.replace('{{' + k + '}}', str(v))
    assert '{{' not in b, name
    return b

FACES = {
  'front': fill('front', dict(FIELDS=FIELDS, STAMP=STAMP_HTML, BODY=BODY, BODY_TOP=352, MENU_TOP=516,
                              MENU_HEAD=head('EXECUTIVE DINING ROOM', 'Charged to your department'),
                              EXEC_LEFT=EXEC_LEFT, EXEC_RIGHT=EXEC_RIGHT, FOOT=foot(1))),
  'back': fill('back', dict(CAF_TOP=222, CAF_INTRO=CAF_INTRO, CAF_HEAD=head('EMPLOYEE CAFETERIA', 'Lower level'),
                            CAF_LEFT=CAF_LEFT, CAF_RIGHT=CAF_RIGHT, LOW_TOP=692, REMIND=REMIND, ROUTE=ROUTE, FOOT=foot(2))),
}
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
for name, inner in FACES.items():
    page = (f'<div style="position: relative; width: 816px; height: 1056px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 816px; height: 1056px; pointer-events: none; display: block; opacity: 0.8">'
            f'{STAPLE}{inner}'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 816px; height: 1056px; pointer-events: none; display: block">'
            f'</div>')
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pemrose memorandum, {name}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{page}</body></html>')
print('built')
