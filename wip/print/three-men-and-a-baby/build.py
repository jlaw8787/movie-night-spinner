"""Builds the Lowenthal & Daughter delivery menu (Three Men and a Baby, 1987).
A one-colour flyer on canary stock from a Manhattan gourmet deli, the kind slid under
every loft door in the neighbourhood. US Letter portrait, printed both sides, no fold.
Writes front.html / back.html (full pages) and front.body.html / back.body.html."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
PAPER = '#f2dd98'
INK = '#96221a'
INK_SOFT = 'rgba(150,34,26,0.82)'
FONTS = ('family=Caprasimo&family=Archivo+Narrow:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Caprasimo', 'Cooper Black', Georgia, serif"
BODY = "'Archivo Narrow', 'Helvetica Neue', Arial, sans-serif"

def esc(s): return s.replace('&', '&amp;')

def head(t, sub=None, top=0, cols=None):
    c = ''
    if cols:
        c = ('<div style="display: flex; gap: 0; font-weight: 700; font-size: 12px; letter-spacing: 0.14em">'
             + ''.join(f'<span style="width: 52px; text-align: right">{x}</span>' for x in cols) + '</div>')
    s = f'''<div style="margin-top: {top}px; border-bottom: 3px solid {INK}; padding-bottom: 6px; display: flex; align-items: flex-end; justify-content: space-between; gap: 12px">
      <div style="font-family: {DISP}; font-size: 30px; line-height: 1.02">{esc(t)}</div>{c}</div>'''
    if sub:
        s += f'<div style="margin-top: 7px; font-style: italic; font-size: 16px; line-height: 1.3">{esc(sub)}</div>'
    return s

def item(name, desc, prices, top=14):
    if isinstance(prices, str): prices = [prices]
    pr = ''.join(f'<span style="width: 52px; text-align: right">{p}</span>' for p in prices)
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">
        <div style="font-weight: 700; font-size: 22px; line-height: 1.1; letter-spacing: 0.005em; text-transform: uppercase">{esc(name)}</div>
        <div style="display: flex; font-weight: 700; font-size: 20px; line-height: 1.1; white-space: nowrap">{pr}</div></div>
      <div style="margin-top: 3px; font-size: 16px; line-height: 1.32; color: {INK_SOFT}; text-wrap: pretty">{esc(desc)}</div></div>'''

def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.8; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')

def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {BODY}; color: {INK}">{inner}{overlays(face)}</div>')

# ---------------- FRONT ----------------
front = f'''
<div style="position: absolute; left: 48px; top: 44px; width: 720px; text-align: center">
  <div style="font-weight: 700; font-size: 14px; letter-spacing: 0.32em">GOURMET DELICATESSEN, EST. 1952</div>
  <div style="margin-top: 6px; font-family: {DISP}; font-size: 58px; line-height: 1; white-space: nowrap">Lowenthal <span style="font-size: 42px">&amp;</span> Daughter</div>
  <div style="margin-top: 8px; font-size: 18px; line-height: 1.3; font-weight: 500">Party trays, hot sandwiches and groceries. Open seven days, 7 A.M. to 3 A.M.</div>
</div>
<img src="assets/storefront.png" alt="" style="position: absolute; left: 68px; top: 168px; width: 680px; height: 277px; display: block">
<div style="position: absolute; left: 48px; top: 458px; width: 720px; height: 68px; background: {INK}; color: {PAPER}; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 0 22px">
  <div style="font-family: {DISP}; font-size: 34px; line-height: 1">We Deliver</div>
  <div style="font-weight: 700; font-size: 34px; line-height: 1; letter-spacing: 0.03em">(212) 555-0187</div>
  <div style="font-size: 16px; line-height: 1.2; text-align: right; font-weight: 500">Free over $10.<br>Lofts and walk-ups.</div>
</div>
<div style="position: absolute; left: 48px; top: 550px; width: 384px">
  {head("Party Trays", None, 0, ["ORDER", "TRAY"])}
  {item("Shrimp toast", "Ginger and scallion blended in, sesame pressed on, fried golden and cut in triangles. Sweet chili sauce to dip.", ["4.50", "16.00"], 12)}
  {item("Bagel chips and schmear", "Yesterday's batch sliced thin and baked crisp, with cream cheese whipped up with chives and lemon zest.", ["3.25", "12.00"])}
  <div style="margin-top: 10px; font-style: italic; font-size: 16px; line-height: 1.3">Trays serve twelve. Call by noon for tonight.</div>
  {head("For the Little Ones", None, 26)}
  {item("Grilled cheese and soup", "American on white, griddled in butter and cut in four, with a cup of chicken noodle.", "2.75", 12)}
</div>
<div style="position: absolute; left: 464px; top: 550px; width: 304px">
  {head("Hot Sandwiches", "Named for our regulars. Each comes with a pickle and coleslaw.", 0)}
  {item("The Architect", "Seared sirloin sliced thin, slow-cooked onions, melted Swiss and horseradish mayo on toasted sourdough.", "6.95", 12)}
  {item("The Leading Man", "Hot pastrami piled high on seeded rye, spicy brown mustard, sliced to order.", "5.95")}
  {item("The Cartoonist", "Roast turkey, crisp bacon, lettuce and tomato, three decks high on white toast.", "5.75")}
</div>
<div style="position: absolute; left: 48px; top: 984px; width: 720px; border-top: 1.5px solid {INK}; padding-top: 8px; display: flex; justify-content: space-between; font-size: 13px; letter-spacing: 0.12em; font-weight: 600">
  <span>SWEETS, THE FOUNTAIN AND GROCERIES ON THE BACK</span><span>PLEASE TURN OVER</span>
</div>
'''

# ---------------- BACK ----------------
groceries = [
    ('Milk, eggs and sweet butter', False),
    ('Bagels and rolls by the dozen', False),
    ('Baby formula and jars', False),
    ('Diapers, all sizes', True),
    ('Morning papers, fight results inside', False),
    ('Dried Turkish apricots', False),
    ('Fresh flowers, Fridays', False),
]
glist = ''.join(
    f'<div style="position: relative; padding: 9px 0; border-bottom: 1px dotted {INK}; font-size: 18px; line-height: 1.25; font-weight: 500">{esc(g)}'
    + (f'<img src="assets/pen-ring.png" alt="" style="position: absolute; left: -16px; top: -8px; width: 200px; height: 48px; display: block">' if ring else '')
    + '</div>' for g, ring in groceries)

back = f'''
<div style="position: absolute; left: 48px; top: 44px; width: 720px; display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid {INK}; padding-bottom: 10px">
  <div style="font-family: {DISP}; font-size: 44px; line-height: 1">Lowenthal <span style="font-size: 32px">&amp;</span> Daughter</div>
  <div style="text-align: right; font-weight: 700; font-size: 24px; line-height: 1.1">(212) 555-0187<div style="font-weight: 500; font-size: 14px; letter-spacing: 0.12em; margin-top: 3px">DELIVERY UNTIL 3 A.M.</div></div>
</div>
<div style="position: absolute; left: 48px; top: 146px; width: 384px">
  {head("Sweets", None, 0)}
  {item("Vanilla bean custard", "Stirred slow on the stove until thick and smooth. Warm or chilled, by the cup.", "2.25", 12)}
  {item("Rice pudding", "Baked with raisins and cinnamon, a skin on top if you ask.", "1.75")}
  {item("Black and white cookie", "Soft cake round, half lemon fondant, half chocolate.", ".85")}
  {head("From the Fountain", None, 30)}
  {item("Midnight milk punch", "Cold whole milk shaken frothy with vanilla and a spoon of honey, nutmeg grated over.", "1.75", 12)}
  {item("Egg cream", "Chocolate syrup, cold milk and a hard shot of seltzer. No egg, never was.", "1.00")}
  {item("Fresh orange juice", "Squeezed to order.", "1.25")}
  {item("Coffee", "A fresh pot every hour, regular or black.", ".60")}
  <div style="margin-top: 34px; border-top: 3px double {INK}; border-bottom: 3px double {INK}; padding: 14px 0 14px">
    <div style="font-family: {DISP}; font-size: 24px; line-height: 1.05">Night Owls</div>
    <div style="margin-top: 6px; font-size: 16px; line-height: 1.35">After midnight the counter keeps a short list: hot sandwiches, custard, milk punch and coffee. Ring the side bell after hours.</div>
  </div>
</div>
<div style="position: absolute; left: 464px; top: 146px; width: 304px">
  <div style="border: 3px solid {INK}; padding: 18px 20px 16px">
    <div style="font-family: {DISP}; font-size: 30px; line-height: 1.02">We Also Deliver</div>
    <div style="margin-top: 6px; font-style: italic; font-size: 16px; line-height: 1.3">Phone it in with your order.</div>
    <div style="margin-top: 8px">{glist}</div>
  </div>
  <div style="margin-top: 28px; background: {INK}; color: {PAPER}; padding: 16px 20px">
    <div style="font-family: {DISP}; font-size: 24px; line-height: 1.05">Gift Baskets</div>
    <div style="margin-top: 6px; font-size: 16px; line-height: 1.32">Fruit, cheese and cookies in a wicker basket, wrapped and tied. Baskets delivered right to your door.</div>
    <div style="margin-top: 6px; font-weight: 700; font-size: 20px">From 15.00</div>
  </div>
  <div style="margin-top: 28px; border: 2px dashed {INK}; padding: 14px 18px; text-align: center">
    <div style="font-weight: 700; font-size: 13px; letter-spacing: 0.22em">CLIP AND SAVE</div>
    <div style="margin-top: 4px; font-family: {DISP}; font-size: 28px; line-height: 1">10% off</div>
    <div style="margin-top: 5px; font-size: 16px; line-height: 1.3">any party tray. One per order. Good through December 31, 1987.</div>
  </div>
</div>
<div style="position: absolute; left: 48px; top: 944px; width: 720px; border-top: 1.5px solid {INK}; padding-top: 10px; display: flex; justify-content: space-between; gap: 24px; font-size: 14px; line-height: 1.4; font-weight: 500">
  <div>Packages held at the counter.<br>Checks with ID. Charge accounts for regulars.</div>
  <div style="text-align: right">Prices effective September 1987. Sales tax added.<br>Menu subject to change. Printed in U.S.A.</div>
</div>
'''

TITLES = {'front': 'Lowenthal & Daughter menu, front', 'back': 'Lowenthal & Daughter menu, back'}
for face, inner in (('front', front), ('back', back)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "loftsupper", "fn": "fmtLoftSupper", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
        "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Caprasimo", "Archivo Narrow"],
        "phone": {"disp": "'Caprasimo',serif", "title": "'Caprasimo',serif", "name": "'Archivo Narrow',sans-serif",
                  "body": "'Archivo Narrow',sans-serif", "price": "'Archivo Narrow',sans-serif", "note": "'Archivo Narrow',sans-serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Three Men and a Baby (1987)": {
  "Doorstep basket prawn toast": {"n": "Shrimp toast", "d": "Ginger and scallion blended in, sesame pressed on, fried golden and cut in triangles. Sweet chili sauce to dip.", "note": "Party tray, two dozen for 16.00."},
  "Bagel chips and schmear": {"n": "Bagel chips and schmear", "d": "Yesterday's batch sliced thin and baked crisp, with cream cheese whipped up with chives and lemon zest.", "note": "Trays serve twelve. Call by noon."},
  "Peter's loft steak sandwich": {"n": "The Architect", "d": "Seared sirloin sliced thin, slow-cooked onions, melted Swiss and horseradish mayo on toasted sourdough.", "note": "Named for one of our regulars."},
  "Baby Mary's bedtime vanilla custard": {"n": "Vanilla bean custard", "d": "Stirred slow on the stove until thick and smooth. Warm or chilled, by the cup.", "note": "Delivery until 3 A.M."},
  "Night-feed bourbon milk punch": {"n": "Midnight milk punch", "d": "Cold whole milk shaken frothy with vanilla and a spoon of honey, nutmeg grated over.", "note": "The night owl favourite."}
}}
open(os.path.join(D, 'loftsupper.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
