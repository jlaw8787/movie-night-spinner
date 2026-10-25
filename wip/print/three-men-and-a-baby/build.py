"""Moonlight Coffee Shop & Deli menu, Three Men and a Baby (1987).
Single heavy card, one face, US Letter: the all-night delivery menu from the coffee shop on the ground floor
of the loft building. Signature piece: the building front at night with the bassinet on the doorstep (paint.py).
Props: grocery delivery coupon and a "Shh, baby sleeping" door sign.
Writes menu.html, film.json and loftsupper.labels.json. Run paint.py first."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
INK, ROSE, SKY, PAPER, MUTE, NIGHT = '#22305a', '#cf4f72', '#6fa3d2', '#f6edcf', '#5a6280', '#121a3a'
FONTS = ('family=Righteous&family=Figtree:wght@600;800'
         '&family=Literata:ital,opsz,wght@0,7..72,400;1,7..72,400&family=Caveat:wght@500;700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Righteous', 'Arial Rounded MT Bold', sans-serif"
SANS = "font-family: 'Figtree', 'Helvetica Neue', Arial, sans-serif"
SERIF = "font-family: 'Literata', Georgia, serif"
HAND = "font-family: 'Caveat', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Doorstep basket prawn toast": ("Shrimp Toast", "Ginger and scallion on white bread, sesame, fried. Chili dip.", "3.95",
                                  "Six triangles to the order."),
  "Bagel chips and schmear": ("Chips & Schmear", "Day-old bagels, baked crisp. Chive and lemon cream cheese.", "2.25",
                              "Yesterday's bagels, nothing wasted."),
  "Peter's loft steak sandwich": ("Steak Sandwich", "Seared sirloin, butter onions, horseradish mayo and Swiss on sourdough.", "6.95",
                                  "The architect upstairs orders it every time."),
  "Baby Mary's bedtime vanilla custard": ("Vanilla Bean Custard", "Yolks, sugar and hot milk, stirred thick. Warm or cold.", "1.95",
                                          "Soft enough for the smallest regular."),
  "Night-feed bourbon milk punch": ("Shaken Vanilla Milk", "Whole milk, vanilla, honey, shaken on ice. Nutmeg.", "1.87",
                                    "For whoever is up at 2 A.M."),
}
ADD = {
  'rings': ("Onion Rings", "Thick cut, buttermilk battered, fried crisp. A basket for the table.", "1.95"),
  'club': ("Turkey Club", "Roast breast, bacon, lettuce, tomato, three decks of toast.", "4.95"),
  'deluxe': ("Burger Deluxe", "Half pound, melted American, lettuce, tomato, pickle and fries.", "4.50"),
}


def item(n, d, p, note=None, top=11):
    nt = (f'<div style="{SERIF}; font-style: italic; font-size: 18px; line-height: 1.25; color: {ROSE}; margin-top: 2px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{SANS}; font-weight: 800; font-size: 27px; line-height: 1.08; letter-spacing: -0.01em">{n}</div>
        <div style="{SANS}; font-weight: 800; font-size: 27px; white-space: nowrap; color: {ROSE}">{p}</div></div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.28; margin-top: 3px; color: #2a2b33; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=11, note=None):
    n, d, p, _ = SPEC[k]
    return item(n, d, p, note, top)


def A(k, top=11, note=None):
    return item(*ADD[k], note=note, top=top)


def head(t, sub, top=0):
    """Section head: a big rounded word, a small moon, a hairline running out to the column edge. No bars."""
    return f'''<div style="display: flex; align-items: center; gap: 10px; margin-top: {top}px">
      <div style="{DISP}; font-size: 40px; line-height: 1; color: {ROSE}; white-space: nowrap; text-transform: uppercase">{t}</div>
      <div style="flex: 1; height: 2px; background: {INK}; margin-top: 6px"></div>
      <div style="{SANS}; font-weight: 800; font-size: 15px; letter-spacing: 0.16em; color: {MUTE}; white-space: nowrap; margin-top: 6px">{sub}</div></div>'''


def kicker(t, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {ROSE}; {extra}">{t}</div>'


PH = 322  # painting height on the card
painting = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {PH}px; overflow: hidden; background: {NIGHT}">
  <img src="assets/loft-night.png" alt="The loft building at night: the coffee shop lit under a striped awning, a bassinet with a note on the top step under the door lamp" style="position: absolute; left: 0; top: -40px; width: {W}px; height: 420px; display: block"></div>
<div style="position: absolute; left: 0; top: {PH}px; width: {W}px; height: 6px; background: {ROSE}"></div>
<div style="position: absolute; left: 0; top: {PH + 6}px; width: {W}px; height: 4px; background: {SKY}"></div>
<div style="position: absolute; left: 44px; top: 40px; width: 300px">
  <div style="{SANS}; font-weight: 800; font-size: 15px; letter-spacing: 0.2em; text-transform: uppercase; color: #a9c6ea; white-space: nowrap">Downstairs from the lofts</div>
  <div style="{DISP}; font-size: 66px; line-height: 1; color: #f2789a; margin-top: 2px">Moonlight</div>
  <div style="{DISP}; font-size: 22px; line-height: 1; letter-spacing: 0.08em; color: {PAPER}; margin-top: 4px; text-transform: uppercase">Coffee Shop &amp; Deli</div>
  <div style="{SANS}; font-weight: 600; font-size: 16px; color: #d7dcf0; margin-top: 6px">We deliver, all night, every night</div></div>'''

# door sign, hung on a nail over the left of the painting, clear of the bassinet
sign = f'''<div style="position: absolute; left: 48px; top: 196px; width: 206px; transform: rotate(-4deg)">
  <div style="position: absolute; left: 100px; top: -26px; width: 8px; height: 8px; border-radius: 4px; background: #c9ccd8"></div>
  <div style="position: absolute; left: 44px; top: -22px; width: 64px; height: 2px; background: #c9ccd8; transform: rotate(-21deg); transform-origin: 100% 0"></div>
  <div style="position: absolute; left: 104px; top: -22px; width: 64px; height: 2px; background: #c9ccd8; transform: rotate(21deg); transform-origin: 0 0"></div>
  <div style="position: absolute; left: 6px; top: 7px; width: 206px; height: 100%; background: rgba(0,0,0,0.35)"></div>
  <div style="position: relative; background: #fbf3dc; border: 3px solid {ROSE}; padding: 10px 12px 11px; text-align: center">
    <div style="{DISP}; font-size: 34px; line-height: 1; color: {INK}">Shh!</div>
    <div style="{DISP}; font-size: 21px; line-height: 1.1; color: {ROSE}; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px">Baby sleeping</div>
    <div style="{HAND}; font-weight: 700; font-size: 21px; line-height: 1.05; color: #2b3a78; margin-top: 3px">Deliveries, knock softly.<br>Peter M.</div></div></div>'''

coupon = f'''<div style="margin-top: 18px; border: 2px dashed {INK}; background: #fbf5df; padding: 10px 14px 11px; transform: rotate(-1.2deg)">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Grocery run', 'font-size: 15px')}<span style="{SANS}; font-weight: 800; font-size: 14px; color: {MUTE}">No. 87</span></div>
  <div style="{DISP}; font-size: 28px; line-height: 1.05; margin-top: 4px; text-transform: uppercase; color: {INK}">Free delivery</div>
  <div style="{SERIF}; font-size: 16px; line-height: 1.3; margin-top: 4px">Diapers, formula, powdered milk by the can. Sent up with any order.</div></div>'''

note = f'''<div style="margin-top: 18px; display: flex; align-items: flex-end; gap: 10px">
  <div style="flex: 1">
    {kicker('A word from upstairs', 'font-size: 15px')}
    <div style="{SERIF}; font-size: 18px; line-height: 1.3; margin-top: 3px">Supper at midnight, milk at 2 A.M., and they knock softly.</div></div>
  <div style="flex: none; width: 110px; text-align: right">
    <div style="{HAND}; font-weight: 700; font-size: 36px; line-height: 1; color: {INK}; transform: rotate(-5deg)">Peter M.</div>
    <div style="{SANS}; font-weight: 600; font-size: 14px; color: {MUTE}; margin-top: 4px">Top floor</div></div></div>'''

L, CW, TOPM = 56, 704, PH + 26
menu = f'''<div style="position: absolute; left: {L}px; top: {TOPM}px; width: {CW}px; display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 36px">
  <div>
    {head('Starters', 'ANY HOUR')}
    {S('Doorstep basket prawn toast')}{S('Bagel chips and schmear')}{A('rings')}
    {head('Late', '2 A.M. TOO', 16)}
    {S("Baby Mary's bedtime vanilla custard")}{S('Night-feed bourbon milk punch')}</div>
  <div>
    {head('Supper', 'HOT')}
    {S("Peter's loft steak sandwich")}{A('deluxe')}{A('club', note='One kept hot for Jack. He is in Turkey.')}
    {coupon}</div></div>'''

footer = f'''<div style="position: absolute; left: {L}px; top: 964px; width: {CW}px; border-top: 1px solid {INK}; padding-top: 7px; {SANS}; font-weight: 600; font-size: 15px; color: {MUTE}; line-height: 1.38">
  <div style="display: flex; justify-content: space-between"><span>Prices subject to change. We do not hold packages. Elevator out? We walk it up.</span><span>Form 11-25, 1987</span></div>
  <div style="display: flex; justify-content: space-between"><span>Coffee for the car parked outside, on the house. Accounts, see Mrs. Hathaway.</span><span>Call 555-0187</span></div></div>'''

fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
        'background: radial-gradient(ellipse 82% 76% at 50% 50%, rgba(250,244,224,0) 0%, rgba(250,244,224,0) 60%, rgba(150,120,70,0.22) 100%)"></div>')
grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
         f'height: {H}px; pointer-events: none; display: block; opacity: 0.7">')
body = (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
        f'{painting}{menu}{footer}{sign}{fade}{grain}</div>')

open(os.path.join(D, 'menu.body.html'), 'w').write(body)
open(os.path.join(D, 'menu.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moonlight Coffee Shop</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "loftsupper", "fn": "fmtLoftSupper", "faces": ["menu.html"], "names": ["Menu"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Righteous", "Figtree", "Literata", "Caveat"],
           "phone": {"disp": "'Righteous',sans-serif", "title": "'Righteous',sans-serif", "name": "'Figtree',sans-serif",
                     "body": "'Literata',serif", "price": "'Figtree',sans-serif", "note": "'Literata',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Three Men and a Baby (1987)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'loftsupper.labels.json'), 'w'), indent=1)
print('built')
