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
    ('Northwest salmon dip', 'Hot-smoked fish blended into cream cheese with dill, capers, lemon and a bite of horseradish. Toasted bagel chips.', None, '4.95'),
    ('Clam chowder', 'Puget Sound Manilas, potato, onion and bacon simmered in cream. Oyster crackers.', None, 'cup 2.25 &nbsp;bowl 3.50'),
    ('Late-show popcorn', 'Popped to order in coconut oil, tossed with browned butter and coarse sea salt.', 'Radio on till the call-in show signs off.', '1.50')]),
  ('Suppers', 'from 5 PM', [
    ('Baked salmon', 'Fillet under a crust of parsley, bread crumbs and grated lemon peel. Steamed green beans, warm butter spooned over.', 'Mild and gentle. Nothing to sneeze at.', '10.95'),
    ('Meat loaf', 'Thick slice with brown gravy, mashed potatoes and peas.', None, '6.95'),
    ('Fish and chips', 'Three pieces of Alaska cod fried crisp, fries, coleslaw, tartar sauce.', None, '7.25')]),
  ('Breakfast all night', None, [
    ('Two eggs any style', 'Hash browns, toast or a biscuit, bacon or link sausage.', None, '3.75'),
    ('Short stack', 'Three buttermilk hotcakes, creamery butter, warm syrup.', None, '2.50')]),
]
RIGHT = [
  ('Sweets', None, [
    ('Valentine hearts', 'Sugar cookies cut by hand, iced red and white.', 'Baked through February 14.', '2 for 2.14'),
    ('Tiramisu', 'Espresso-soaked ladyfingers layered with mascarpone and cocoa.', 'What is it? You’ll see.', '3.25'),
    ('Marionberry pie', 'Oregon berries under a lattice top, baked every morning.', 'À la mode, 75¢ more.', '2.75')]),
  ('Coffee bar', None, [
    ('Iced mocha', 'Strong drip coffee with dark chocolate melted in, cold milk, plenty of ice and whipped cream.', 'Yes, even in February.', '2.25'),
    ('Caffe latte', 'Double shot of espresso, steamed milk.', None, '1.75'),
    ('Drip coffee', 'Dark roast, bottomless cup.', None, '.75'),
    ('Hot cocoa', 'Whole milk, marshmallows.', None, '1.25')]),
]
KIDS = [('Grilled cheese', 'American on white bread, a cup of tomato soup, apple slices.', '2.95'),
        ('Silver dollar cakes', 'Five little hotcakes and a strip of bacon.', '1.95')]


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

kids_items = ''.join(f'''<div style="margin-top: {0 if i == 0 else 8}px">
  <div style="display: flex; align-items: baseline; gap: 6px; font-family: {COND}; color: {TEAL}">
    <span style="font-size: 21px; line-height: 1.12">{n}</span>
    <span style="flex: 1; border-bottom: 2px dotted {TEAL}; transform: translateY(-5px); min-width: 12px"></span>
    <span style="font-size: 19px">{p}</span></div>
  <div style="font-family: {SANS}; font-size: 16px; line-height: 1.28; color: {TEAL}">{d}</div></div>''' for i, (n, d, p) in enumerate(KIDS))

FACTS = ['Seattle gets less rain a year than New York City.',
         'The Space Needle went up for the 1962 World’s Fair.',
         'Hundreds of families live in floating homes on Lake Union.',
         'Our city takes its name from Chief Sealth.']
facts = ''.join(f'<div style="display: flex; gap: 8px; margin-top: {0 if i == 0 else 5}px"><span style="font-family: {COND}; font-size: 17px; color: {BURG}; line-height: 1.3">{i + 1}.</span><span style="font-family: {SANS}; font-size: 16px; line-height: 1.3; color: {TEAL}">{f}</span></div>' for i, f in enumerate(FACTS))

body = f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; font-family: {SANS}; color: {TEAL}">
  <img src="assets/border-paper.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">

  <!-- left column: masthead, halftone, hours, kids corner -->
  <section style="position: absolute; left: 60px; top: 50px; width: 440px">
    <div style="display: flex; align-items: flex-end; justify-content: space-between">
      <div style="font-family: {SCRIPT}; font-size: 96px; line-height: 0.95; color: {BURG}; text-shadow: 3px 3px 0 {TEAL}; margin-left: -2px">Night Owl</div>
      <div style="text-align: right; font-family: {COND}; font-size: 17px; line-height: 1.25; color: {TEAL}; padding-bottom: 8px">OPEN TILL<br><span style="font-size: 34px; line-height: 1; color: {BURG}">2 AM</span></div>
    </div>
    <div style="display: flex; align-items: center; gap: 10px; margin-top: 4px">
      <span style="font-family: {COND}; font-size: 25px; letter-spacing: 0.34em; color: {TEAL}">DOCK CAFE</span>
      <span style="flex: 1; height: 3px; background: {TEAL}"></span></div>
    <div style="margin-top: 3px; font-size: 16px; line-height: 1.3; font-weight: 700">On the houseboat docks, Lake Union &nbsp;·&nbsp; (206) 555-0193</div>
    <div style="margin-top: 12px; border: 2px solid {TEAL}; padding: 3px; background: {PAPER}">
      <img src="assets/skyline-halftone.png" alt="" style="display: block; width: 430px; height: 300px; object-fit: cover; object-position: 50% 40%"></div>
    <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 13px; line-height: 1.3; font-weight: 700; letter-spacing: 0.04em">
      <span>THE VIEW FROM OUR BACK DECK</span><span>PHOTO: A REGULAR</span></div>
    <div style="margin-top: 10px; font-family: {SCRIPT}; font-size: 37px; line-height: 1; color: {BURG}">Sleepless in Seattle? So are we.</div>
    <div style="margin-top: 5px; font-size: 16px; line-height: 1.3; text-wrap: pretty">Hot food every night till 2 AM, and the radio stays on for Dr. Marcia Fieldstone’s call-in show. Booths by the window go first.</div>

    <div style="margin-top: 12px; border: 2px solid {BURG}; padding: 8px 10px 10px">
      <div style="display: flex; align-items: baseline; justify-content: space-between">
        <span style="font-family: {COND}; font-size: 19px; letter-spacing: 0.12em; color: {BURG}">DECKHANDS, 10 AND UNDER</span>
        <span style="font-size: 13px; font-weight: 700">CRAYONS AT THE COUNTER</span></div>
      <div style="display: flex; gap: 14px; margin-top: 6px">
        <div style="position: relative; flex: none; width: {GW * cell}px; height: {GH * cell}px; border: 1px solid {TEAL}">{cells}</div>
        <div style="flex: 1; font-size: 16px; line-height: 1.24">
          <div style="font-family: {COND}; font-size: 17px; color: {BURG}; letter-spacing: 0.06em">FIND THESE WORDS</div>
          <div style="font-weight: 700; margin-top: 2px">HOUSEBOAT<br>FERRY &nbsp;KAYAK<br>NEEDLE<br>MOCHA &nbsp;RAIN<br>SALMON</div>
          <div style="margin-top: 4px">Two names are hiding too. Can you find them?</div></div>
      </div>
    </div>
  </section>

  <div style="position: absolute; left: 522px; top: 58px; width: 1px; height: 844px; border-left: 2px dotted {TEAL}"></div>

  <section style="position: absolute; left: 544px; top: 58px; width: 352px">
    {column(MIDDLE, ig=11, hg=18)}
  </section>

  <div style="position: absolute; left: 918px; top: 58px; width: 1px; height: 844px; border-left: 2px dotted {TEAL}"></div>

  <section style="position: absolute; left: 940px; top: 58px; width: 344px">
    {column(RIGHT, ig=11, hg=18)}
    <div style="margin-top: 18px; padding: 3px 0 4px; border-top: 3px solid {BURG}; border-bottom: 1px solid {BURG}; font-family: {COND}; font-size: 19px; letter-spacing: 0.16em; color: {BURG}">DID YOU KNOW?</div>
    <div style="margin-top: 8px">{facts}</div>
  </section>

  <!-- bottom of middle column: kids plates and the counter line -->
  <section id="kidsmenu" style="position: absolute; left: 544px; top: 0; width: 352px">
  </section>

  <!-- rubber stamp, added at the counter in Valentine's week -->
  <div style="position: absolute; left: 1004px; top: 448px; width: 248px; transform: rotate(-6deg); opacity: 0.84">
    <div style="position: relative; padding: 8px 8px 7px; border: 3px solid {BURG}; outline: 1px solid {BURG}; outline-offset: 3px; text-align: center; color: {BURG}; background: rgba(240,232,212,0.55)">
      <div style="font-family: {COND}; font-size: 21px; letter-spacing: 0.14em; line-height: 1.1">VALENTINE’S DAY</div>
      <div style="font-family: {COND}; font-size: 17px; letter-spacing: 0.12em; margin-top: 1px">SUNDAY, FEB. 14</div>
      <div style="font-weight: 700; font-size: 16px; margin-top: 2px; line-height: 1.2">A heart on every saucer.</div>
      <img src="assets/stamp-wear.png" alt="" style="position: absolute; left: -6px; top: -6px; width: 268px; height: 106px; display: block">
    </div>
  </div>

  <!-- finish: shared grain and the soft wear layer (coffee ring, grease, gloss, edges) -->
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: 0.75">
  <img src="assets/wear-stain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">
</div>'''

# kids plates and the footer sit at the bottom of the middle column
kids_block = f'''<div style="padding: 3px 0 4px; border-top: 3px solid {BURG}; border-bottom: 1px solid {BURG}; font-family: {COND}; font-size: 19px; letter-spacing: 0.16em; color: {BURG}">DECKHANDS’ PLATES</div>
    <div style="margin-top: 8px">{kids_items}</div>'''
body = body.replace('<section id="kidsmenu" style="position: absolute; left: 544px; top: 0; width: 352px">\n  </section>',
                    f'<section id="kidsmenu" style="position: absolute; left: 544px; bottom: 112px; width: 352px">{kids_block}</section>')

foot = f'''<div style="position: absolute; left: 60px; bottom: 54px; width: 1224px; display: flex; justify-content: space-between; align-items: baseline; font-size: 13px; line-height: 1.3; font-weight: 700; letter-spacing: 0.03em; color: {TEAL}">
    <span>PAY AT THE COUNTER. CASH OR LOCAL CHECKS. WE SHIP SMOKED SALMON ANYWHERE, EVEN BALTIMORE.</span>
    <span>PRINTED ON RECYCLED PAPER</span></div>'''
body = body.replace('  <!-- finish:', foot + '\n  <!-- finish:')

open(os.path.join(D, 'placemat.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Night Owl Dock Cafe placemat</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')
print('built placemat.html')
