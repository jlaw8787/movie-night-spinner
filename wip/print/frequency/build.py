"""Firehouse World Series Supper window card, Frequency (2000). Queens, Saturday October 11, 1969.
One 11 x 14 inch card the neighborhood firehouse posts in windows up and down the block: the radio
goes on the apparatus floor, the men cook, Julia Sullivan's pie comes down from the house.
Signature piece: painted firehouse at dusk under the northern lights (paint.py). Run prep.py and
paint.py first. Writes card.html, film.json and sullivansupper.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 1056, 1344
NAVY, ORANGE, PAPER, MUTE, PEACH = '#1b2a55', '#dd5a22', '#e2e8e8', '#4a5670', '#f4a259'
FONTS = ('family=Alfa+Slab+One&family=Oswald:wght@500;600'
         '&family=Lora:ital,wght@0,400;0,600;1,400&family=Homemade+Apple')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
SLAB = "font-family: 'Alfa Slab One', Rockwell, serif"
COND = "font-family: 'Oswald', 'Arial Narrow', sans-serif"
SERIF = "font-family: 'Lora', Georgia, serif"
HAND = "font-family: 'Homemade Apple', cursive"

# spec key -> printed name, description, price, phone note (recipe food unchanged)
SPEC = {
  "Firehouse chilli bites": ("Chili Cups", "Beef and kidney bean chili in baked wonton cups, cheddar melted over.", "3 for 35¢",
                             "Ladled out the minute the anthem ends."),
  "Miracle Mets pretzels with beer mustard": ("Soft Pretzels", "Baking soda dip, coarse salt, baked glossy. Honey beer mustard.", "15¢",
                                              "Game One on the radio. Yahoo!"),
  "Queens pizza": ("Queens Pizza Pie", "Thin crust, crushed tomato, mozzarella and crumbled Italian sausage.", "20¢",
                   "By the slice. Whole pie $1.69, boxed."),
  "Julia's apple pie": ("Julia's Apple Pie", "Tart green apples, cinnamon and sugar, a double crust brushed with egg.", "25¢",
                        "Baked by Julia between hospital shifts."),
  "Firehouse lemon shandy": ("Firehouse Shandy", "Cold lager and fresh lemonade, mint sprig, lemon wheel. Grown-ups only.", "35¢",
                             "Poured on the apparatus floor."),
}
ADD = {
  'hero': ("Meatball Hero", "Meatballs in Sunday gravy on a long roll, provolone melted over.", "60¢"),
  'chief': ("Little Chief's Plate", "A frank on a buttered bun, potato chips, cold milk. Under seven only.", "35¢"),
  'lemonade': ("Lemonade", "Squeezed by the pitcher, over ice.", "10¢"),
  'coffee': ("Coffee", "From the big percolator, all game long.", "10¢"),
  'cocoa': ("Hot Cocoa", "Whole milk and a marshmallow, for the cold walk home.", "15¢"),
}


def item(n, d, p, note=None, top=22):
    nt = (f'<div style="{SERIF}; font-style: italic; font-size: 18px; line-height: 1.3; color: {ORANGE}; margin-top: 3px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">
        <div style="{SLAB}; font-size: 26px; line-height: 1.1; color: {NAVY}; white-space: nowrap">{n}</div>
        <div style="{SLAB}; font-size: 26px; white-space: nowrap; color: {ORANGE}">{p}</div></div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.34; margin-top: 4px; color: #262b38; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=22, note=False):
    n, d, p, nt = SPEC[k]
    return item(n, d, p, nt if note else None, top)


def A(k, top=22):
    return item(*ADD[k], top=top)


def section(kick, title, body):
    return f'''<div>
      <div style="{COND}; font-weight: 600; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {ORANGE}">{kick}</div>
      <div style="{SLAB}; font-size: 44px; line-height: 1; text-transform: uppercase; color: {NAVY}; margin-top: 2px">{title}</div>
      <div style="height: 5px; background: {ORANGE}; margin-top: 8px"></div>
      <div style="height: 1px; background: {NAVY}; margin-top: 3px"></div>{body}</div>'''


ticket = f'''<div style="width: 262px; background: #f6d9b4; border: 2px solid {ORANGE}; transform: rotate(-3deg); display: flex">
  <div style="flex: 1; padding: 9px 12px 9px">
    <div style="{COND}; font-weight: 600; font-size: 15px; letter-spacing: 0.18em; color: {ORANGE}">RAFFLE, 25¢ OR 5 FOR $1</div>
    <div style="{SLAB}; font-size: 22px; line-height: 1.05; color: {NAVY}; margin-top: 3px">Transistor Radio</div>
    <div style="{SERIF}; font-size: 15px; line-height: 1.3; color: #3a3a3a; margin-top: 4px">Drawn at supper. Tickets from Frank or Satch.</div></div>
  <div style="width: 0; border-left: 2px dashed {ORANGE}"></div>
  <div style="width: 58px; display: flex; flex-direction: column; align-items: center; justify-content: center">
    <div style="{COND}; font-weight: 500; font-size: 14px; letter-spacing: 0.1em; color: {MUTE}">NO.</div>
    <div style="{SLAB}; font-size: 19px; color: {ORANGE}">1012</div></div></div>'''

L, CW = 56, 944
PH = 530   # visible height of the painting

inner = f'''
<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {PH}px; overflow: hidden; background: {NAVY}">
  <img src="assets/firehouse-dusk.jpg" alt="Painting of the Queens firehouse at dusk, northern lights over the block and a ham radio aerial on the roof" style="display: block; width: {W}px; height: 560px"></div>
<div style="position: absolute; left: {L}px; top: 54px; width: 560px">
  <div style="{COND}; font-weight: 600; font-size: 19px; letter-spacing: 0.22em; text-transform: uppercase; color: {PEACH}">The firehouse invites the whole block</div>
  <div style="{SLAB}; font-size: 92px; line-height: 0.98; text-transform: uppercase; color: {PAPER}; margin-top: 10px; white-space: nowrap">World Series</div>
  <div style="{SLAB}; font-size: 92px; line-height: 0.98; text-transform: uppercase; color: {PEACH}; white-space: nowrap">Supper</div></div>
<div style="position: absolute; left: 0; top: {PH}px; width: {W}px; height: 6px; background: {ORANGE}"></div>
<div style="position: absolute; left: 0; top: {PH + 6}px; width: {W}px; height: 54px; background: {NAVY}"></div>
<div style="position: absolute; left: {L}px; top: {PH + 6}px; width: {CW}px; height: 54px; display: flex; justify-content: space-between; align-items: center; {COND}; font-weight: 500; font-size: 20px; letter-spacing: 0.14em; text-transform: uppercase; color: {PAPER}">
  <span>Saturday, Oct. 11, 1969</span><span style="color: {PEACH}">Game One on the radio at noon</span><span>Supper from four</span></div>
<div style="position: absolute; left: {L}px; top: {PH + 84}px; width: {CW}px; display: grid; grid-template-columns: 300px 300px 300px; column-gap: 22px">
  {section('Cooked by the men', 'Kitchen', S('Firehouse chilli bites', 16) + S('Miracle Mets pretzels with beer mustard') + S('Queens pizza', note=True))}
  {section('Supper plates', 'Table', A('hero', 16) + S("Julia's apple pie", note=True) + A('chief'))}
  {section('Hot and cold', 'Cooler', S('Firehouse lemon shandy', 16) + A('lemonade') + A('coffee') + A('cocoa'))}
</div>
<div style="position: absolute; left: {L}px; top: 1150px; width: {CW}px; display: flex; align-items: center; gap: 22px; border-top: 1px solid {NAVY}; padding-top: 16px">
  <div style="flex: none; border: 3px solid {ORANGE}; padding: 3px; background: #f3f5f2"><img src="assets/spot-radio.jpg" alt="Frank Sullivan at his ham radio set" style="display: block; width: 150px; height: 112px"></div>
  <div style="flex: 1">
    <div style="{SERIF}; font-size: 20px; line-height: 1.34; color: #262b38; text-wrap: pretty">Our boys are in the Series and the block is family tonight. If the bell rings we roll, but the chili stays hot. Over and out.</div>
    <div style="display: flex; align-items: baseline; gap: 14px; margin-top: 2px">
      <div style="{HAND}; font-size: 24px; line-height: 1.7; color: #23336e; white-space: nowrap; transform: rotate(-2deg)">Frank Sullivan</div>
      <div style="{COND}; font-weight: 500; font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; color: {MUTE}; white-space: nowrap">for the men of the house</div></div></div>
  <div style="flex: none">{ticket}</div></div>
<div style="position: absolute; left: {L}px; top: 1278px; width: {CW}px; display: flex; justify-content: space-between; {SERIF}; font-size: 16px; color: {MUTE}">
  <span>Prices subject to change. Proceeds to the Widows and Orphans Fund. Please post in your window.</span><span>Form 10-12-69</span></div>'''

fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
        'background: radial-gradient(ellipse 80% 74% at 50% 52%, rgba(240,244,244,0.06) 0%, rgba(240,244,244,0.04) 55%, rgba(150,140,110,0.28) 100%)"></div>')
grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
         f'height: {H}px; pointer-events: none; display: block; opacity: 0.75">')
stripes = (f'<div style="position: absolute; left: 0; top: {H - 22}px; width: {W}px; height: 6px; background: {ORANGE}"></div>'
           f'<div style="position: absolute; left: 0; top: {H - 16}px; width: {W}px; height: 16px; background: {NAVY}"></div>')
card = (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {NAVY}">'
        f'{inner}{stripes}{fade}{grain}</div>')

open(os.path.join(D, 'card.body.html'), 'w').write(card)
open(os.path.join(D, 'card.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>World Series Supper</title>{LINK}<style>body{{margin:0}}</style></head><body>{card}</body></html>')

json.dump({"fmt": "sullivansupper", "fn": "fmtSullivanSupper", "faces": ["card.html"], "names": ["Window card"],
           "mm": [279.4, 355.6], "fonts": FONTS, "fams": ["Alfa Slab One", "Oswald", "Lora", "Homemade Apple"],
           "phone": {"disp": "'Alfa Slab One',serif", "title": "'Alfa Slab One',serif", "name": "'Alfa Slab One',serif",
                     "body": "'Lora',serif", "price": "'Alfa Slab One',serif", "note": "'Lora',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Frequency (2000)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'sullivansupper.labels.json'), 'w'), indent=1)
print('built')
