"""Builds the Last Stop bar menu (After Hours, 1985).
The take-one menu card from the corner bar in SoHo where Tom pours and Julie works the tables.
US Letter (8.5 x 11 in) cream card, quick-printed: a solid black flood on the front carrying a
painted photo of the window neon (assets/neon-sign.png, from neon.py); the back is the menu in
black and red on the bare card, with a ruled grill list, a chalk specials box, a typed notice
taped on, and a boxed bar list. Two sides, no fold.
Writes front.html / back.html (full pages), front.body.html / back.body.html, film.json and
sohoaftermidnight.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
CARD = '#efe6d2'
FLOOD = '#161412'
INK = '#1b1a17'
SOFT = '#4a4540'
RED = '#c0352a'
NEON = '#e0493a'
YEL = '#e9c64e'
CREAM = '#ece2cb'
FONTS = ('family=Barlow+Condensed:wght@400;600;700'
         '&family=Libre+Franklin:wght@400;600;700'
         '&family=Courier+Prime:wght@400;700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Barlow Condensed', 'Arial Narrow', sans-serif"
BODY = "'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
TYPE = "'Courier Prime', 'Courier New', monospace"

def esc(s): return s.replace('&', '&amp;')

def overlays(face, grain_op):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: {grain_op}; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')

def root(inner, face, bg, color, grain_op):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {bg}; '
            f'font-family: {BODY}; color: {color}">{inner}{overlays(face, grain_op)}</div>')

# ---------------- FRONT: black flood with the window sign ----------------
def info(head, col, text):
    return (f'<div><div style="font-family: {DISP}; font-weight: 700; font-size: 28px; line-height: 1; letter-spacing: 0.06em; color: {col}">{head}</div>'
            f'<div style="margin-top: 8px; font-size: 17px; line-height: 1.38; color: {CREAM}">{text}</div></div>')

front = f"""
<div style="position: absolute; left: 48px; top: 48px; width: 720px; display: flex; justify-content: space-between; align-items: baseline; font-family: {DISP}; font-weight: 600; font-size: 20px; letter-spacing: 0.3em; color: {YEL}">
  <span>BAR AND GRILL</span><span>SOHO, NEW YORK</span>
</div>
<img src="assets/neon-sign.png" alt="LAST STOP neon sign" style="position: absolute; left: 0; top: 84px; width: 816px; height: 600px; display: block">
<div style="position: absolute; left: 48px; top: 724px; width: 720px; text-align: center; font-family: {TYPE}; font-size: 19px; line-height: 1.3; color: {CREAM}">The fare went up at midnight. Ours did not.</div>
<div style="position: absolute; left: 48px; top: 776px; width: 720px; height: 1.5px; background: {NEON}"></div>
<div style="position: absolute; left: 48px; top: 806px; width: 720px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 36px">
  {info('OPEN NIGHTLY', YEL, '8 P.M. to 4 A.M.<br>Last call at a quarter to.')}
  {info('THE GRILL', NEON, 'Burgers, clubs, bagels and sweets. Hot till close.')}
  {info('BEHIND THE BAR', CREAM, 'Tom pours. Julie takes care of the tables.')}
</div>
<div style="position: absolute; left: 48px; top: 966px; width: 720px; border-top: 1.5px solid {YEL}; padding-top: 10px; display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-size: 16px; line-height: 1.3; color: {CREAM}">
  <span style="font-family: {DISP}; font-weight: 700; font-size: 20px; letter-spacing: 0.14em; color: {YEL}">HOUSE RULES</span>
  <span>Hold on to your twenty.</span><span>Exact change appreciated.</span><span>Cash only.</span>
</div>
"""

# ---------------- BACK: the menu on bare card ----------------
DOTS = ' .' * 80
def lead(name, price, size=26, weight=700, col=INK, pcol=INK):
    return (f'<div style="display: flex; align-items: baseline; gap: 6px">'
            f'<span style="flex: none; font-family: {DISP}; font-weight: {weight}; font-size: {size}px; line-height: 1.05; letter-spacing: 0.02em; text-transform: uppercase; color: {col}">{esc(name)}</span>'
            f'<span style="flex: 1; min-width: 20px; overflow: hidden; white-space: nowrap; font-family: {TYPE}; font-size: 16px; color: {SOFT}">{DOTS}</span>'
            f'<span style="flex: none; font-family: {TYPE}; font-weight: 700; font-size: 20px; color: {pcol}">{price}</span></div>')

def item(name, desc, price, note=None, top=17):
    n = f'<div style="margin-top: 4px; font-family: {TYPE}; font-size: 15px; line-height: 1.2; color: {RED}">{esc(note)}</div>' if note else ''
    d = f'<div style="margin-top: 3px; font-size: 16px; line-height: 1.32; color: {SOFT}; text-wrap: pretty">{esc(desc)}</div>' if desc else ''
    return f'<div style="margin-top: {top}px">{lead(name, price)}{d}{n}</div>'

CHALK = '#ebe7dc'
CHALKY = '#e6d27a'
def chalk_item(name, desc, price, note, top):
    return f"""<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-family: {DISP}; font-weight: 600; font-size: 25px; line-height: 1.02; color: {CHALK}; text-shadow: 0 0 1px rgba(235,231,220,0.7)">
        <span style="white-space: nowrap">{esc(name)}</span><span style="font-size: 24px">{price}</span></div>
      <div style="margin-top: 5px; font-size: 16px; line-height: 1.34; color: #d9d6cc; text-wrap: pretty">{esc(desc)}</div>
      <div style="margin-top: 6px; font-family: {DISP}; font-weight: 600; font-size: 19px; line-height: 1.15; letter-spacing: 0.02em; color: {CHALKY}">{esc(note)}</div></div>"""

def bar_row(name, price, sub=None):
    s = f'<div style="font-size: 15px; line-height: 1.25; color: {SOFT}">{esc(sub)}</div>' if sub else ''
    return (f'<div style="padding: 6px 0 4px; border-bottom: 1px solid rgba(27,26,23,0.55)">{lead(name, price, 22, 600)}{s}</div>')

back = f"""
<div style="position: absolute; left: 48px; top: 54px; width: 720px; display: flex; justify-content: space-between; align-items: flex-end">
  <div style="font-family: {DISP}; font-weight: 700; font-size: 72px; line-height: 0.88; letter-spacing: 0.01em">LAST <span style="color: {RED}">STOP</span></div>
  <div style="font-family: {TYPE}; font-size: 16px; line-height: 1.3; text-align: right">Bar and grill, SoHo<br>Open 8 P.M. to 4 A.M.</div>
</div>
<div style="position: absolute; left: 48px; top: 128px; width: 720px; height: 4px; background: {INK}"></div>
<div style="position: absolute; left: 48px; top: 135px; width: 720px; height: 1px; background: {INK}"></div>

<div style="position: absolute; left: 48px; top: 154px; width: 404px">
  <div style="display: flex; align-items: baseline; gap: 10px; border-bottom: 2px solid {RED}; padding-bottom: 4px">
    <span style="font-family: {DISP}; font-weight: 700; font-size: 30px; line-height: 1; letter-spacing: 0.12em; color: {RED}">FROM THE GRILL</span>
    <span style="font-family: {TYPE}; font-size: 15px; color: {RED}">hot till close</span></div>
  {item("Paperweight bagels", "Toasted minis spread thick with chive and black pepper cream cheese, smoked salmon, capers, sesame, poppy seed and garlic.", "3.50", "Not the plaster kind.", 14)}
  {item("The Last Stop burger", "Hand-formed chuck, salted right before it hits the flat top, cooked medium under melted cheddar. Raw onion, dill pickles, toasted bun.", "4.75")}
  {item("Late club", "Three decks of toast with roast chicken, crisp bacon, lettuce, tomato and mayo, pinned and cut corner to corner. Chips alongside.", "4.95", "Julie brings it over.")}
  {item("House chili", "Ground chuck and kidney beans simmered all evening with cumin, ancho and tomato. Raw onion, sharp cheddar, saltines.", "2.25")}
  {item("French fries", "Hand cut, fried twice, plenty of salt.", "1.50")}
</div>

<div style="position: absolute; left: 480px; top: 152px; width: 288px; height: 404px; transform: rotate(0.8deg); box-shadow: 1px 2px 0 rgba(27,26,23,0.25)">
  <img src="assets/slate-wear.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 288px; height: 404px; display: block">
  <div style="position: absolute; left: 17px; top: 18px; width: 254px">
    <div style="font-family: {DISP}; font-weight: 700; font-size: 34px; line-height: 1; letter-spacing: 0.08em; color: {CHALK}; text-shadow: 0 0 1px rgba(235,231,220,0.7); transform: rotate(-1.6deg); transform-origin: left center">SWEETS TONIGHT</div>
    <div style="margin-top: 8px; width: 150px; height: 3px; background: rgba(235,231,220,0.75); transform: rotate(-1.2deg)"></div>
    {chalk_item("Plaster of Paris cake", "Vanilla butter layers under a thick coat of seven-minute frosting, roughed up with a palette knife so it sets white and matte.", "2.50", "For the sculptors on the block.", 14)}
    {chalk_item("Dipped cones", "Vanilla piped high in a crisp cone, dipped in dark chocolate that sets to a shell, then crushed peanuts or sprinkles.", "1.75", "Beats chasing the ice cream truck.", 18)}
  </div>
</div>

<div style="position: absolute; left: 488px; top: 582px; width: 276px; transform: rotate(-1.8deg); background: #f8f5ec; color: {INK}; padding: 16px 16px 12px; box-sizing: border-box; box-shadow: 1px 3px 5px rgba(60,45,25,0.28)">
  <div style="position: absolute; left: 92px; top: -12px; width: 78px; height: 24px; background: rgba(225,216,186,0.78); transform: rotate(3deg)"></div>
  <div style="font-family: {TYPE}; font-weight: 700; font-size: 16px; letter-spacing: 0.14em">NOTICE</div>
  <div style="margin-top: 6px; font-family: {TYPE}; font-size: 16px; line-height: 1.28">There have been burglaries on the block. Lock up when you leave, and if you see anything, tell Tom.</div>
</div>

<div style="position: absolute; left: 48px; top: 786px; width: 720px; height: 186px; box-sizing: border-box; border: 3px double {INK}; display: flex">
  <div style="width: 392px; box-sizing: border-box; padding: 14px 18px; background: rgba(192,53,42,0.08); border-right: 1px solid {INK}">
    <div style="font-family: {TYPE}; font-weight: 700; font-size: 14px; letter-spacing: 0.16em; color: {RED}">BEHIND THE BAR</div>
    <div style="margin-top: 8px; display: flex; justify-content: space-between; align-items: baseline">
      <span style="font-family: {DISP}; font-weight: 700; font-size: 32px; line-height: 1; letter-spacing: 0.02em">WHISKEY SOUR</span>
      <span style="font-family: {TYPE}; font-weight: 700; font-size: 20px">3.50</span></div>
    <div style="margin-top: 5px; font-size: 16px; line-height: 1.32; color: {SOFT}">Bourbon, lemon, a little sugar and egg white shaken silky, bitters on the foam, a cherry.</div>
    <div style="margin-top: 4px; font-family: {TYPE}; font-size: 15px; color: {RED}">Tom shakes them hard.</div>
  </div>
  <div style="flex: 1; min-width: 0; padding: 8px 18px 0">
    {bar_row("Draft beer", "1.50")}
    {bar_row("Shot and a beer", "2.75")}
    {bar_row("Seltzer with lime", ".75")}
    <div style="padding: 6px 0 0">{lead("Coffee", ".60", 22, 600)}<div style="font-size: 15px; line-height: 1.25; color: {SOFT}">Fresh pot, all night.</div></div>
  </div>
</div>

<div style="position: absolute; left: 48px; top: 984px; width: 720px; border-top: 1.5px solid {INK}; padding-top: 8px; display: flex; justify-content: space-between; font-family: {TYPE}; font-size: 14px; line-height: 1.3">
  <span>Cash only. Lost and found at the register.</span><span>Prices effective 1985.</span>
</div>
"""

TITLES = {'front': 'Last Stop menu, front', 'back': 'Last Stop menu, back'}
faces = (('front', front, FLOOD, CREAM, 0.35), ('back', back, CARD, INK, 0.8))
for face, inner, bg, col, gop in faces:
    body = root(inner, face, bg, col, gop)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "sohoaftermidnight", "fn": "fmtSohoAfterMidnight", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
        "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Barlow Condensed", "Libre Franklin", "Courier Prime"],
        "phone": {"disp": "'Barlow Condensed',sans-serif", "title": "'Barlow Condensed',sans-serif", "name": "'Barlow Condensed',sans-serif",
                  "body": "'Libre Franklin',sans-serif", "price": "'Courier Prime',monospace", "note": "'Courier Prime',monospace"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"After Hours (1985)": {
  "Bagel paperweight bites with chive schmear": {"n": "Paperweight bagels", "d": "Toasted minis spread thick with chive and black pepper cream cheese, smoked salmon, capers, sesame, poppy seed and garlic.", "note": "Not the plaster kind."},
  "Mob truck choc-dipped sundae cones": {"n": "Dipped cones", "d": "Vanilla piped high in a crisp cone, dipped in dark chocolate that sets to a shell, then crushed peanuts or sprinkles.", "note": "Beats chasing the ice cream truck."},
  "Terminal Bar burger": {"n": "The Last Stop burger", "d": "Hand-formed chuck, salted right before it hits the flat top, cooked medium under melted cheddar. Raw onion, dill pickles, toasted bun.", "note": "Hot off the grill till close."},
  "White frosted plaster cake": {"n": "Plaster of Paris cake", "d": "Vanilla butter layers under a thick coat of seven-minute frosting, roughed up with a palette knife so it sets white and matte.", "note": "For the sculptors on the block."},
  "Terminal Bar whiskey sour": {"n": "Whiskey sour", "d": "Bourbon, lemon, a little sugar and egg white shaken silky, bitters on the foam, a cherry.", "note": "Tom shakes them hard."}
}}
open(os.path.join(D, 'sohoaftermidnight.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
