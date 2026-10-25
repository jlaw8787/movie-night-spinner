"""Firehouse World Series Supper menu, Frequency (2000). Queens, Saturday October 11, 1969.
Two-sided US Letter card the neighborhood firehouse prints for the block's Game One supper:
the radio goes on the apparatus floor, the men cook, Julia Sullivan's pie comes down from the house.
House style lock (Jurassic system). Run prep.py first. Writes front.html, back.html, film.json and
sullivansupper.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
NAVY, ORANGE, PAPER, MUTE = '#1b2a55', '#dd5a22', '#e2e8e8', '#4a5670'
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
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{SLAB}; font-size: 26px; line-height: 1.1; color: {NAVY}">{n}</div>
        <div style="{SLAB}; font-size: 26px; white-space: nowrap; color: {ORANGE}">{p}</div></div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.34; margin-top: 4px; color: #262b38; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=22, note=False):
    n, d, p, nt = SPEC[k]
    return item(n, d, p, nt if note else None, top)


def A(k, top=22):
    return item(*ADD[k], top=top)


def pennant(t, sub=None):
    """Navy swallowtail pennant: a flat bar plus two border triangles cut into the right end."""
    s = (f'<span style="{COND}; font-weight: 500; font-size: 18px; letter-spacing: 0.16em; color: #f4a259; margin-left: 16px; '
         f'white-space: nowrap; position: relative; top: -6px">{sub}</span>') if sub else ''
    return (f'<div style="display: inline-flex; align-items: stretch; height: 58px">'
            f'<div style="background: {NAVY}; color: {PAPER}; padding: 0 18px 0 22px; display: flex; align-items: center; {SLAB}; '
            f'font-size: 40px; line-height: 1; letter-spacing: 0.01em; text-transform: uppercase; white-space: nowrap">{t}{s}</div>'
            f'<div style="width: 0; height: 0; border-top: 29px solid {NAVY}; border-bottom: 29px solid {NAVY}; border-right: 26px solid transparent"></div></div>')


def kicker(t, extra=''):
    return (f'<div style="{COND}; font-weight: 600; font-size: 19px; letter-spacing: 0.22em; text-transform: uppercase; '
            f'color: {ORANGE}; {extra}">{t}</div>')


def face(inner):
    stripes = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {NAVY}"></div>'
               f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; height: 6px; background: {ORANGE}"></div>'
               f'<div style="position: absolute; left: 0; top: {H - 22}px; width: {W}px; height: 6px; background: {ORANGE}"></div>'
               f'<div style="position: absolute; left: 0; top: {H - 16}px; width: {W}px; height: 16px; background: {NAVY}"></div>')
    fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
            'background: radial-gradient(ellipse 80% 74% at 50% 48%, rgba(240,244,244,0.10) 0%, rgba(240,244,244,0.06) 55%, rgba(150,140,110,0.30) 100%)"></div>')
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
             f'height: {H}px; pointer-events: none; display: block; opacity: 0.8">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {NAVY}">'
            f'{inner}{stripes}{fade}{grain}</div>')


L, CW = 56, 704

front = face(f'''
<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('The firehouse invites the whole block')}{kicker('Queens, N.Y.', 'color: ' + MUTE)}</div>
  <div style="{SLAB}; font-size: 72px; line-height: 1; text-transform: uppercase; white-space: nowrap; margin-top: 8px">World Series</div>
  <div style="display: flex; justify-content: space-between; align-items: flex-end">
    <div style="{SLAB}; font-size: 72px; line-height: 1; text-transform: uppercase; color: {ORANGE}">Supper</div>
    <div style="text-align: right; padding-bottom: 4px; white-space: nowrap">
      <div style="{COND}; font-weight: 600; font-size: 22px; letter-spacing: 0.12em; text-transform: uppercase">Saturday, Oct. 11, 1969</div>
      <div style="{SERIF}; font-size: 19px; line-height: 1.35; color: {MUTE}; margin-top: 4px">Game One on the radio at noon.<br>Supper from four. Bring the kids.</div></div></div>
  <div style="height: 4px; background: {NAVY}; margin-top: 12px"></div>
  <div style="margin-top: 16px; border: 3px solid {ORANGE}; padding: 3px; background: #f3f5f2">
    <img src="assets/hero-batting.jpg" alt="Frank Sullivan teaching his son to bat in front of the house" style="display: block; width: 692px; height: 272px"></div>
  <div style="{SERIF}; font-style: italic; font-size: 17px; color: {MUTE}; margin-top: 7px">Batting practice out front. Little Chief is ready for the big leagues.</div>
  <div style="margin-top: 20px">{pennant('From the Kitchen', 'FROM 4 P.M.')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Firehouse chilli bites', 14)}{S('Miracle Mets pretzels with beer mustard', 26)}</div>
    <div>{S('Queens pizza', 14, note=True)}{A('hero', 26)}</div></div>
</div>
<div style="position: absolute; left: {L}px; top: 972px; width: {CW}px; border-top: 1px solid {NAVY}; padding-top: 10px; display: flex; justify-content: space-between; {COND}; font-weight: 500; font-size: 16px; letter-spacing: 0.08em; text-transform: uppercase; color: {MUTE}">
  <span>Tickets and tables: see Frank or Satch</span><span>Northern lights forecast tonight</span></div>''')

ticket = f'''<div style="position: relative; width: 276px; background: #f6d9b4; border: 2px solid {ORANGE}; transform: rotate(-2.5deg); display: flex">
  <div style="flex: 1; padding: 10px 14px 8px">
    <div style="{COND}; font-weight: 600; font-size: 15px; letter-spacing: 0.18em; color: {ORANGE}">RAFFLE</div>
    <div style="{SLAB}; font-size: 22px; line-height: 1.05; color: {NAVY}; margin-top: 2px">Transistor Radio</div>
    <div style="{SERIF}; font-size: 15px; line-height: 1.3; color: #3a3a3a; margin-top: 4px">25¢ each, five for $1.<br>Drawn by the Chief.</div></div>
  <div style="width: 0; border-left: 2px dashed {ORANGE}"></div>
  <div style="width: 66px; display: flex; flex-direction: column; align-items: center; justify-content: center">
    <div style="{COND}; font-weight: 500; font-size: 14px; letter-spacing: 0.1em; color: {MUTE}">NO.</div>
    <div style="{SLAB}; font-size: 22px; color: {ORANGE}">1012</div></div></div>'''

stamp = f'''<div style="width: 100px; height: 100px; border-radius: 50%; border: 3px solid rgba(221,90,34,0.82); display: flex; align-items: center; justify-content: center; transform: rotate(12deg); opacity: 0.9">
  <div style="width: 86px; height: 86px; border-radius: 50%; border: 1.5px solid rgba(221,90,34,0.82); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center">
    <div style="{COND}; font-weight: 600; font-size: 14px; letter-spacing: 0.1em; color: rgba(221,90,34,0.9)">SUPPER</div>
    <div style="{SLAB}; font-size: 21px; line-height: 1; color: rgba(221,90,34,0.9); margin: 2px 0">PAID</div>
    <div style="{COND}; font-weight: 600; font-size: 14px; letter-spacing: 0.06em; color: rgba(221,90,34,0.9)">10.11.69</div></div></div>'''

back = face(f'''
<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('World Series Supper')}{kicker('Saturday, Oct. 11, 1969', 'color: ' + MUTE)}</div>
  <div style="display: grid; grid-template-columns: 392px 284px; column-gap: 28px; margin-top: 14px">
    <div>
      {pennant('The Table')}
      {S("Julia's apple pie", 14, note=True)}{A('chief', 24)}
      <div style="height: 1px; background: {NAVY}; margin-top: 22px"></div>
      <div style="margin-top: 22px">{pennant('The Cooler')}</div>
      {S('Firehouse lemon shandy', 14)}{A('lemonade', 22)}{A('coffee', 22)}{A('cocoa', 22)}</div>
    <div style="position: relative">
      <div style="border: 3px solid {ORANGE}; padding: 3px; background: #f3f5f2; margin-top: 4px">
        <img src="assets/spot-radio.jpg" alt="Frank Sullivan at his ham radio set at home" style="display: block; width: 272px; height: 202px"></div>
      <div style="{SERIF}; font-style: italic; font-size: 17px; line-height: 1.3; color: {MUTE}; margin-top: 7px">Frank Sullivan on his ham set. If the big radio quits, his gets the game.</div>
      <div style="margin-top: 20px">{kicker('A word from the house', 'font-size: 18px')}</div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.38; margin-top: 6px; color: #262b38">Our boys are in the Series, and the block is family tonight. If the bell rings, we roll, but the chili stays hot and we'll be back for pie. Over and out.</div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px">
        <div><div style="{HAND}; font-size: 26px; line-height: 1.6; color: #23336e; white-space: nowrap; transform: rotate(-3deg); transform-origin: 0 50%">Frank Sullivan</div>
        <div style="{COND}; font-weight: 500; font-size: 15px; letter-spacing: 0.06em; text-transform: uppercase; white-space: nowrap; color: {MUTE}">for the men of the house</div></div>
        {stamp}</div>
      <div style="margin-top: 18px; margin-left: 2px">{ticket}</div>
      </div></div>
</div>
<div style="position: absolute; left: {L}px; top: 960px; width: {CW}px; border-top: 1px solid {NAVY}; padding-top: 10px; display: flex; justify-content: space-between; {SERIF}; font-size: 16px; color: {MUTE}">
  <span>Prices subject to change. Proceeds to the Widows and Orphans Fund.</span><span>Form 10-12-69</span></div>''')

for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>World Series Supper</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "sullivansupper", "fn": "fmtSullivanSupper", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Alfa Slab One", "Oswald", "Lora", "Homemade Apple"],
           "phone": {"disp": "'Alfa Slab One',serif", "title": "'Alfa Slab One',serif", "name": "'Alfa Slab One',serif",
                     "body": "'Lora',serif", "price": "'Alfa Slab One',serif", "note": "'Lora',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Frequency (2000)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'sullivansupper.labels.json'), 'w'), indent=1)
print('built')
