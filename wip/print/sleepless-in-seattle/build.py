"""Builds the Night Owl Dock Cafe paper placemat (Sleepless in Seattle, 1993).
One face, 14 x 10 in landscape (1344 x 960 CSS px), single sided, no fold. Writes placemat.html."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))
TEAL, TEAL_D, TEAL_T, RED, INK, PAPER = '#1d5858', '#123e40', '#5f8e8a', '#c4402c', '#1f2a2a', '#f3eee0'
FONTS = 'family=Jost:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Yellowtail'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
W, H = 1344, 960

# (section, [(name, description, note or None, price)])
MIDDLE = [
  ('From the dock', [
    ('Northwest salmon dip', 'Hot-smoked fish folded through cream cheese and crème fraîche with lemon, dill, capers and a little horseradish. Crisp bagel chips.', None, '4.95'),
    ('Clam chowder', 'Littlenecks, potato, onion and bacon in a creamy broth. Oyster crackers.', None, 'cup 2.50 &nbsp;bowl 3.75'),
    ('Late-show popcorn', 'Popped to order, tossed in nutty brown butter and flaky salt.', 'Radio on till the call-in show signs off.', '1.50')]),
  ('Supper', [
    ('Herb-crusted salmon', 'Fillet roasted under parsley, lemon zest and toasted crumbs. Steamed green beans, warm lemon butter spooned over.', 'Plain and gentle. Nothing to sneeze at.', '11.95')]),
  ('Deckhands, 10 and under', [
    ('Grilled cheese plate', 'American cheese on white, a cup of tomato soup, apple slices.', None, '2.95')]),
]
RIGHT = [
  ('Sweets', [
    ('Valentine hearts', 'Brown-butter sugar cookies cut by hand, iced in red and white.', 'February only.', '2 for 1.95'),
    ('Tiramisu', 'Espresso-soaked ladyfingers, mascarpone cream, cocoa.', 'What is it? You’ll see.', '3.50')]),
  ('Coffee bar', [
    ('Iced mocha', 'Strong coffee melted with dark chocolate, cold milk over ice, whipped cream and cocoa.', 'Yes, even in February.', '2.25'),
    ('Drip coffee', 'Dark roast, bottomless.', None, '.85'),
    ('Caffè latte', 'Double shot, steamed milk.', None, '1.95'),
    ('Hot cocoa', 'Whole milk, whipped cream.', None, '1.25')]),
]

def item(name, desc, note, price, first, gap=14):
    nt = f'<p style="margin: 3px 0 0; font-style: italic; font-size: 16px; line-height: 1.3; color: {RED}">{note}</p>' if note else ''
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <h3 style="margin: 0; font-weight: 600; font-size: 22px; line-height: 1.12; color: {TEAL_D}">{name}</h3>
        <span style="font-weight: 600; font-size: 19px; white-space: nowrap; color: {TEAL_D}">{price}</span></div>
      <p style="margin: 2px 0 0; font-size: 16px; line-height: 1.32; color: {INK}; text-wrap: pretty">{desc}</p>{nt}</div>'''

def head(t, first, gap=24):
    return f'''<div style="display: flex; align-items: center; gap: 10px; margin: {0 if first else gap}px 0 10px">
      <span style="font-weight: 700; font-size: 15px; letter-spacing: 0.22em; color: {RED}">{t.upper()}</span>
      <span style="flex: 1; height: 2px; background: {TEAL}"></span></div>'''

def column(groups, ig=14, hg=24):
    return ''.join(head(t, gi == 0, hg) + ''.join(item(*it, first=(i == 0), gap=ig) for i, it in enumerate(items))
                   for gi, (t, items) in enumerate(groups))

def dotted_rule(x, y, h):
    return ''.join(f'<div style="position: absolute; left: {x}px; top: {y + i * 10}px; width: 2px; height: 4px; background: {TEAL_T}"></div>' for i in range(h // 10))

body = f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; font-family: 'Jost', 'Futura', Arial, sans-serif; color: {INK}">
  <!-- printed frame, two rules in teal -->
  <div style="position: absolute; left: 24px; top: 24px; width: {W - 48}px; height: {H - 48}px; border: 3px solid {TEAL}; box-sizing: border-box"></div>
  <div style="position: absolute; left: 32px; top: 32px; width: {W - 64}px; height: {H - 64}px; border: 1px solid {TEAL}; box-sizing: border-box"></div>

  <!-- left column: name, art, late hours, drawing box -->
  <section style="position: absolute; left: 64px; top: 50px; width: 452px">
    <div style="font-family: 'Yellowtail', cursive; font-size: 104px; line-height: 1; color: {RED}; margin-left: -4px">Night Owl</div>
    <div style="display: flex; align-items: center; gap: 12px; margin-top: 22px">
      <span style="font-weight: 700; font-size: 24px; letter-spacing: 0.32em; color: {TEAL}">DOCK CAFÉ</span>
      <span style="flex: 1; height: 2px; background: {TEAL}"></span></div>
    <p style="margin: 6px 0 0; font-size: 16px; line-height: 1.32; color: {INK}">Coffee and supper on the houseboat docks, Seattle.</p>
    <img src="assets/dock-art.png" alt="" style="display: block; width: 452px; height: 300px; margin-top: 16px">
    <div style="margin-top: 16px; font-family: 'Yellowtail', cursive; font-size: 38px; line-height: 1.05; color: {RED}">Sleepless in Seattle? So are we.</div>
    <p style="margin: 6px 0 0; font-size: 16px; line-height: 1.32; color: {INK}; text-wrap: pretty">Open every night till 2 AM. The radio stays on for Dr. Marcia Fieldstone’s late call-in show.</p>
    <div style="margin-top: 18px; height: 150px; border: 2px dashed {TEAL_T}; box-sizing: border-box; padding: 12px 16px">
      <div style="font-weight: 700; font-size: 15px; letter-spacing: 0.18em; color: {TEAL}">DRAW YOUR HOUSEBOAT</div>
      <p style="margin: 2px 0 0; font-size: 16px; line-height: 1.3; color: {INK}">For deckhands 10 and under. Crayons at the counter.</p>
    </div>
  </section>

  {dotted_rule(540, 70, 820)}

  <section style="position: absolute; left: 564px; top: 70px; width: 364px">
    {column(MIDDLE, ig=20, hg=32)}
  </section>

  {dotted_rule(952, 70, 820)}

  <section style="position: absolute; left: 976px; top: 70px; width: 304px">
    {column(RIGHT, ig=18, hg=32)}
  </section>

  <!-- red rubber stamp, Valentine's week -->
  <div style="position: absolute; left: 1014px; top: 760px; width: 236px; padding: 10px 10px 9px; border: 3px solid {RED}; outline: 1px solid {RED}; outline-offset: 3px; transform: rotate(-5deg); text-align: center; color: {RED}; opacity: 0.86">
    <div style="font-weight: 700; font-size: 18px; letter-spacing: 0.14em; line-height: 1.15">VALENTINE’S DAY</div>
    <div style="font-weight: 600; font-size: 15px; letter-spacing: 0.1em; margin-top: 2px">SUNDAY, FEB. 14</div>
    <div style="font-weight: 500; font-size: 15px; margin-top: 4px; line-height: 1.25">A heart on every saucer.</div>
  </div>

  <p style="position: absolute; left: 564px; top: 868px; width: 364px; margin: 0; font-size: 13px; line-height: 1.35; color: {TEAL_D}">Pay at the counter. Cash or local check.</p>

  <!-- finish: placemat sheen, shared grain, coffee ring and edge wear -->
  <div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; background: linear-gradient(118deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.10) 44%, rgba(255,255,255,0) 58%)"></div>
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: 0.8">
  <img src="assets/wear-stain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">
</div>'''

open(os.path.join(D, 'placemat.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Night Owl Dock Cafe placemat</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')
print('built placemat.html')
