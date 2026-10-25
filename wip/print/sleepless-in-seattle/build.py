"""Builds the Night Owl Dock Cafe paper placemat (Sleepless in Seattle, set February 1993).
One face, 14 x 10 in landscape (1344 x 960 CSS px), the standard diner placemat sheet, single
sided, no fold. Printed two-colour offset (teal and burgundy) on ecru grease-resistant stock,
with a rubber stamp added at the counter. Writes placemat.html."""
import os, random
D = os.path.dirname(os.path.abspath(__file__))
TEAL, BURG, PAPER = '#174c57', '#8c2232', '#f0e8d4'
FONTS = 'family=Damion&family=Fjalla+One&family=News+Cycle:wght@400;700'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
W, H = 1344, 960
SANS = "'News Cycle', 'News Gothic', Arial, sans-serif"
COND = "'Fjalla One', 'Franklin Gothic Medium Cond', sans-serif"
SCRIPT = "'Damion', 'Brush Script MT', cursive"

# (section, sub, [(name, description, note or None, price)])
MIDDLE = [
  ('From the dock', None, [
    ('Northwest salmon dip', 'Hot-smoked fish blended into cream cheese with dill, capers, lemon and a bite of horseradish. Toasted bagel chips.', 'We ship it anywhere, even Baltimore.', '4.95'),
    ('Clam chowder', 'Puget Sound Manilas, potato, onion and bacon simmered in cream. Oyster crackers.', None, 'cup 2.25 &nbsp;bowl 3.50'),
    ('Late show popcorn', 'Popped to order in coconut oil, tossed with browned butter and coarse sea salt.', 'Radio on till the call-in show signs off.', '1.50')]),
  ('Suppers', 'from 5 PM', [
    ('Baked salmon', 'Fillet under a crust of parsley, bread crumbs and grated lemon peel. Steamed green beans, warm butter spooned over.', 'Mild and gentle. Nothing to sneeze at.', '10.95'),
    ('Meat loaf', 'Thick slice, brown gravy, mashed potatoes and peas.', None, '6.95')]),
  ('Breakfast all night', None, [
    ('Two eggs any style', 'Hash browns, toast or a biscuit, bacon or link sausage.', None, '3.75')]),
  ('Deckhands’ plates', '10 and under', [
    ('Grilled cheese', 'American on white bread, a cup of tomato soup, apple slices.', None, '2.95')]),
]
RIGHT = [
  ('Sweets', None, [
    ('Valentine hearts', 'Sugar cookies cut by hand, iced red and white.', 'Baked through February 14.', '2 for 2.14'),
    ('Tiramisu', 'Espresso-soaked ladyfingers layered with mascarpone and cocoa.', 'What is it? You’ll see.', '3.25'),
    ('Marionberry pie', 'Oregon berries, lattice top, baked every morning.', 'À la mode, 75¢ more.', '2.75')]),
  ('Coffee bar', None, [
    ('Iced mocha', 'Strong drip coffee with dark chocolate melted in, cold milk, plenty of ice and whipped cream.', 'Yes, even in February.', '2.25'),
    ('Caffe latte', 'Double shot of espresso, steamed milk.', None, '1.75'),
    ('Drip coffee', 'Dark roast, bottomless cup.', None, '.75'),
    ('Hot cocoa', 'Whole milk, marshmallows.', None, '1.25')]),
]


def item(name, desc, note, price, first, gap):
    nt = f'<div style="margin-top: 2px; font-weight: 700; font-size: 16px; line-height: 1.25; color: {BURG}">{note}</div>' if note else ''
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="display: flex; align-items: baseline; gap: 6px; font-family: {COND}; color: {TEAL}">
        <span style="font-size: 23px; line-height: 1.12; letter-spacing: 0.01em">{name}</span>
        <span style="flex: 1; border-bottom: 2px dotted {TEAL}; transform: translateY(-5px); min-width: 16px"></span>
        <span style="font-size: 20px; white-space: nowrap">{price}</span></div>
      <div style="margin-top: 1px; font-family: {SANS}; font-size: 16px; line-height: 1.3; color: {TEAL}; text-wrap: pretty">{desc}</div>{nt}</div>'''


def head(t, sub, first, gap):
    s = f'<span style="font-family: {SANS}; font-weight: 700; font-size: 15px; letter-spacing: 0.04em; color: {TEAL}">{sub}</span>' if sub else ''
    return f'''<div style="display: flex; align-items: baseline; gap: 10px; margin: {0 if first else gap}px 0 8px; padding: 3px 0 4px; border-top: 3px solid {BURG}; border-bottom: 1px solid {BURG}">
      <span style="font-family: {COND}; font-size: 19px; letter-spacing: 0.16em; color: {BURG}">{t.upper()}</span>{s}</div>'''


def column(groups, ig, hg):
    return ''.join(head(t, sub, gi == 0, hg) + ''.join(item(*it, first=(i == 0), gap=ig) for i, it in enumerate(items))
                   for gi, (t, sub, items) in enumerate(groups))


# ---- kids word search, 11 x 8. Listed words plus two hidden bonus names.
GW, GH = 11, 8
words = [('HOUSEBOAT', 0, 1, 'h'), ('FERRY', 1, 0, 'v'), ('NEEDLE', 1, 10, 'v'), ('MOCHA', 3, 2, 'h'),
         ('SALMON', 7, 3, 'h'), ('RAIN', 2, 5, 'h'), ('KAYAK', 1, 1, 'v'),
         ('JONAH', 5, 4, 'h'), ('MAGIC', 2, 9, 'v')]
grid = [[None] * GW for _ in range(GH)]
for w, r, c, dr in words:
    for i, ch in enumerate(w):
        rr, cc = (r, c + i) if dr == 'h' else (r + i, c)
        assert grid[rr][cc] in (None, ch), (w, rr, cc, grid[rr][cc])
        grid[rr][cc] = ch
random.seed(1993)
filler = 'BDEFGLPRSTUWBCEHLMNPRT'
for r in range(GH):
    for c in range(GW):
        if grid[r][c] is None:
            grid[r][c] = random.choice(filler)
cell = 24
cells = ''.join(f'<div style="position: absolute; left: {c * cell}px; top: {r * cell}px; width: {cell}px; height: {cell}px; text-align: center; line-height: {cell}px; font-family: {SANS}; font-weight: 700; font-size: 17px; color: {TEAL}">{grid[r][c]}</div>'
                for r in range(GH) for c in range(GW))
rows_txt = [''.join(row) for row in grid]
print('\n'.join(rows_txt))

FACTS = ['Seattle gets less rain in a year than New York.',
         'The Space Needle opened for the 1962 World’s Fair.',
         'The city is named for Chief Sealth.']
facts = ''.join(f'<div style="display: flex; gap: 8px; margin-top: {0 if i == 0 else 3}px"><span style="font-family: {COND}; font-size: 17px; color: {BURG}; line-height: 1.3">{i + 1}.</span><span style="font-family: {SANS}; font-size: 16px; line-height: 1.3; color: {TEAL}">{f}</span></div>' for i, f in enumerate(FACTS))

SEC = lambda t: f'<div style="padding: 3px 0 4px; border-top: 3px solid {BURG}; border-bottom: 1px solid {BURG}; font-family: {COND}; font-size: 19px; letter-spacing: 0.16em; color: {BURG}">{t}</div>'

body = f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; font-family: {SANS}; color: {TEAL}; text-shadow: 0 0 0.9px rgba(23,76,87,0.6)">
  <img src="assets/border-paper.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">

  <!-- left column: masthead, halftone, hours, kids corner -->
  <section style="position: absolute; left: 60px; top: 50px; width: 440px">
    <div style="font-family: {SCRIPT}; font-size: 98px; line-height: 0.95; color: {BURG}; text-shadow: 3px 3px 0 {TEAL}; margin-left: -2px">Night Owl</div>
    <div style="display: flex; align-items: center; gap: 10px; margin-top: 2px">
      <span style="font-family: {COND}; font-size: 25px; letter-spacing: 0.34em; color: {TEAL}">DOCK CAFE</span>
      <span style="flex: 1; height: 3px; background: {TEAL}"></span>
      <span style="font-family: {COND}; font-size: 21px; letter-spacing: 0.06em; color: {BURG}">OPEN TILL 2 AM</span></div>
    <div style="margin-top: 3px; font-size: 16px; line-height: 1.3; font-weight: 700">On the houseboat docks, Lake Union &nbsp;·&nbsp; (206) 555-0193</div>
    <div style="margin-top: 10px; border: 2px solid {TEAL}; padding: 3px; background: {PAPER}">
      <img src="assets/skyline-halftone.png" alt="" style="display: block; width: 430px; height: 268px; object-fit: cover; object-position: 50% 35%"></div>
    <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 13px; line-height: 1.3; font-weight: 700; letter-spacing: 0.04em">
      <span>THE VIEW FROM OUR BACK DECK</span><span>PHOTO BY A REGULAR</span></div>
    <div style="margin-top: 8px; font-family: {SCRIPT}; font-size: 37px; line-height: 1; color: {BURG}">Sleepless in Seattle? So are we.</div>
    <div style="margin-top: 4px; font-size: 16px; line-height: 1.3; text-wrap: pretty">The grill stays hot all night, and Dr. Marcia Fieldstone’s call-in show stays on the radio.</div>

    <div style="margin-top: 10px; border: 2px solid {BURG}; padding: 7px 10px 9px">
      <div style="display: flex; align-items: baseline; justify-content: space-between">
        <span style="font-family: {COND}; font-size: 19px; letter-spacing: 0.12em; color: {BURG}">DECKHANDS’ WORD SEARCH</span>
        <span style="font-size: 13px; font-weight: 700">CRAYONS AT THE COUNTER</span></div>
      <div style="display: flex; gap: 14px; margin-top: 6px">
        <div style="position: relative; flex: none; width: {GW * cell}px; height: {GH * cell}px; border: 1px solid {TEAL}">{cells}</div>
        <div style="flex: 1; font-size: 16px; line-height: 1.24">
          <div style="font-family: {COND}; font-size: 17px; color: {BURG}; letter-spacing: 0.06em">FIND THESE</div>
          <div style="font-weight: 700; margin-top: 2px">HOUSEBOAT<br>FERRY &nbsp;KAYAK<br>NEEDLE<br>MOCHA &nbsp;RAIN<br>SALMON</div>
          <div style="margin-top: 4px">Two names are hiding too.</div></div>
      </div>
    </div>
  </section>

  <div style="position: absolute; left: 522px; top: 58px; width: 1px; height: 844px; border-left: 2px dotted {TEAL}"></div>

  <section style="position: absolute; left: 544px; top: 58px; width: 352px">
    {column(MIDDLE, ig=10, hg=16)}
  </section>

  <div style="position: absolute; left: 918px; top: 58px; width: 1px; height: 844px; border-left: 2px dotted {TEAL}"></div>

  <section style="position: absolute; left: 940px; top: 58px; width: 344px">
    {column(RIGHT, ig=9, hg=14)}
    <div style="margin-top: 14px">{SEC('DID YOU KNOW?')}</div>
    <div style="margin-top: 7px">{facts}</div>
  </section>

  <!-- February run: Valentine's notice printed in the burgundy plate -->
  <div id="valbox" style="position: absolute; left: 940px; bottom: 50px; width: 344px; box-sizing: border-box; border: 3px double {BURG}; padding: 6px 10px 7px; text-align: center; color: {BURG}">
    <div style="font-family: {SCRIPT}; font-size: 31px; line-height: 1">Valentine’s Day</div>
    <div style="font-family: {COND}; font-size: 17px; letter-spacing: 0.12em; margin-top: 2px">SUNDAY, FEBRUARY 14 &nbsp;·&nbsp; OPEN LATE</div>
    <div style="font-weight: 700; font-size: 16px; margin-top: 1px; line-height: 1.25">A heart on every saucer.</div>
  </div>

  <div style="position: absolute; left: 60px; bottom: 54px; width: 836px; display: flex; justify-content: space-between; font-size: 13px; line-height: 1.3; font-weight: 700; letter-spacing: 0.03em; color: {TEAL}">
    <span>PRINTED ON RECYCLED PAPER. PLEASE RECYCLE.</span><span>PAY AT THE COUNTER. CASH OR LOCAL CHECKS, PLEASE.</span></div>

  <img src="assets/ink-wear.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">
  <!-- finish: shared grain and the soft wear layer (coffee ring, grease, gloss, edges) -->
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: 0.75">
  <img src="assets/wear-stain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">
</div>'''

import re
# ink spread on the burgundy plate too: give burgundy type its own slight gain
body = re.sub(r'(color: #8c2232)(?![^"]*text-shadow)', r'\1; text-shadow: 0 0 0.9px rgba(140,34,50,0.6)', body)
open(os.path.join(D, 'placemat.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Night Owl Dock Cafe placemat</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')
print('built placemat.html')
