"""Moonlight Coffee Shop & Deli menu, Three Men and a Baby (1987).
Two-sided US Letter delivery menu from the all-night coffee shop downstairs from the lofts,
the place that brings supper, coffee and a can of powdered milk up at 2 A.M.
House style lock (Jurassic system). Writes front.html, back.html, film.json and loftsupper.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
INK, ROSE, SKY, PAPER, MUTE = '#22305a', '#cf4f72', '#6fa3d2', '#f6edcf', '#5a6280'
FONTS = ('family=Righteous&family=Figtree:wght@600;800'
         '&family=Literata:ital,opsz,wght@0,7..72,400;1,7..72,400&family=Caveat:wght@500;700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Righteous', 'Arial Rounded MT Bold', sans-serif"
SANS = "font-family: 'Figtree', 'Helvetica Neue', Arial, sans-serif"
SERIF = "font-family: 'Literata', Georgia, serif"
HAND = "font-family: 'Caveat', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Doorstep basket prawn toast": ("Shrimp Toast", "Ground with egg white, ginger and scallion on white bread, sesame pressed on, fried golden. Chili dip.", "3.95",
                                  "Six triangles to the order."),
  "Bagel chips and schmear": ("Chips & Schmear", "Day-old bagel rounds sliced thin, oiled and baked crisp. Cream cheese beaten with chives and lemon zest.", "2.25",
                              "Yesterday's bagels, nothing wasted."),
  "Peter's loft steak sandwich": ("Steak Sandwich", "Sirloin seared hard, sliced thin, butter onions, horseradish mayo and Swiss on sourdough.", "6.95",
                                  "The architect upstairs orders it every time."),
  "Baby Mary's bedtime vanilla custard": ("Vanilla Bean Custard", "Yolks, sugar and hot milk, stirred low until thick. Warm or chilled.", "1.95",
                                          "Soft enough for the smallest regular."),
  "Night-feed bourbon milk punch": ("Shaken Vanilla Milk", "Whole milk, vanilla and honey, shaken frothy on ice. Nutmeg.", "1.87",
                                    "For whoever is up at 2 A.M."),
}
ADD = {
  'rings': ("Onion Rings", "Thick cut, buttermilk battered, fried crisp. A basket for the table.", "1.95"),
  'club': ("Turkey Club", "Roast breast, bacon, lettuce, tomato, three decks of toast.", "4.95"),
  'deluxe': ("Burger Deluxe", "Half pound on a toasted bun, melted American, lettuce, tomato, pickle and fries.", "4.50"),
  'soup': ("Chicken Soup", "Whole bird, carrot, celery and dill. Egg noodles.", "1.75"),
  'cheesecake': ("Cheesecake", "Baked dense on a graham crust, sour cream on top. A tall slice.", "2.50"),
  'coffee': ("Coffee", "Fresh pot every hour, all night. Regular, light or black.", ".65"),
}


def item(n, d, p, note=None, top=20):
    nt = (f'<div style="{SERIF}; font-style: italic; font-size: 18px; line-height: 1.3; color: {ROSE}; margin-top: 4px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{SANS}; font-weight: 800; font-size: 27px; line-height: 1.08; letter-spacing: -0.01em">{n}</div>
        <div style="{SANS}; font-weight: 800; font-size: 27px; white-space: nowrap; color: {ROSE}">{p}</div></div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.32; margin-top: 4px; color: #2a2b33; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=20, note=None):
    n, d, p, _ = SPEC[k]
    return item(n, d, p, note, top)


def A(k, top=20, note=None):
    return item(*ADD[k], note=note, top=top)


def bar(t, sub=None):
    """Rose band with a sky-blue offset block behind it, square cut, like a coffee shop awning stripe."""
    s = (f'<span style="{SANS}; font-weight: 800; font-size: 17px; letter-spacing: 0.16em; color: {INK}; margin-left: 16px; '
         f'white-space: nowrap; vertical-align: middle">{sub}</span>') if sub else ''
    return (f'<div style="position: relative; display: inline-block; margin-right: 8px">'
            f'<div style="position: absolute; left: 7px; top: 7px; right: -7px; bottom: -7px; background: {SKY}"></div>'
            f'<div style="position: relative; background: {ROSE}; color: {PAPER}; padding: 8px 22px 7px; {DISP}; font-size: 40px; line-height: 1; '
            f'letter-spacing: 0.02em; text-transform: uppercase; white-space: nowrap">{t}{s}</div></div>')


def kicker(t, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {ROSE}; {extra}">{t}</div>'


def face(inner):
    stripes = ''.join(f'<div style="position: absolute; left: 0; top: {i * 8}px; width: {W}px; height: 8px; background: {c}"></div>'
                      for i, c in enumerate((INK, ROSE, SKY)))
    fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
            'background: radial-gradient(ellipse 80% 74% at 50% 48%, rgba(250,244,224,0) 0%, rgba(250,244,224,0.05) 58%, rgba(160,128,70,0.24) 100%)"></div>')
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
             f'height: {H}px; pointer-events: none; display: block; opacity: 0.8">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{inner}{stripes}{fade}{grain}</div>')


L, CW = 56, 704

coupon = f'''<div style="margin-top: 20px; border: 2px dashed {INK}; background: #fbf5df; padding: 11px 14px 12px; transform: rotate(-1.5deg)">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Grocery run', 'font-size: 15px')}<span style="{SANS}; font-weight: 800; font-size: 14px; color: {MUTE}">No. 87</span></div>
  <div style="{DISP}; font-size: 28px; line-height: 1.05; margin-top: 5px; text-transform: uppercase; color: {INK}">Free delivery</div>
  <div style="{SERIF}; font-size: 16px; line-height: 1.32; margin-top: 5px">Diapers, formula, powdered milk by the can. Sent up with any order.</div></div>'''

front = face(f'''
<div style="position: absolute; left: {L}px; top: 54px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Downstairs from the lofts', 'white-space: nowrap')}{kicker('Open all night', 'white-space: nowrap; color: ' + MUTE)}</div>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px">
    <div style="{DISP}; font-size: 92px; line-height: 1.02; color: {ROSE}; white-space: nowrap; letter-spacing: 0.01em">Moonlight</div>
    <div style="text-align: right">
      <div style="{DISP}; font-size: 34px; line-height: 1.04; letter-spacing: 0.05em; text-transform: uppercase; white-space: nowrap">Coffee Shop<br>&amp; Deli</div>
      <div style="{SANS}; font-weight: 600; font-size: 16px; letter-spacing: 0.04em; color: {MUTE}; margin-top: 6px">We deliver, 7 nights a week</div></div></div>
  <div style="height: 4px; background: {INK}; margin-top: 8px"></div>
  <div style="margin-top: 16px; border: 3px solid {ROSE}; padding: 6px; background: #fffbef">
    <img src="assets/still-kitchen.jpg" alt="Two men mixing formula from a can of powdered milk in a loft kitchen, the baby on one arm" style="display: block; width: {CW - 18}px; height: 280px"></div>
  <div style="{SANS}; font-weight: 600; font-size: 16px; letter-spacing: 0.03em; color: {MUTE}; margin-top: 7px">Our regulars upstairs. The milk came from us, by the can.</div>
  <div style="margin-top: 16px">{bar('To Start', 'ANY HOUR')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Doorstep basket prawn toast', 16)}{A('rings', 16)}</div>
    <div>{S('Bagel chips and schmear', 16)}{coupon}</div></div>
  <div style="display: flex; gap: 24px; margin-top: 18px; align-items: flex-end; border-top: 1px solid {INK}; padding-top: 12px">
    <div style="flex: 1">
      {kicker('A word from upstairs', 'font-size: 15px')}
      <div style="{SERIF}; font-size: 19px; line-height: 1.32; margin-top: 4px">Hot supper at midnight and a can of milk at 2 A.M., and they knock softly. She slept right through it.</div></div>
    <div style="flex: none; width: 196px">
      <div style="{HAND}; font-weight: 700; font-size: 44px; line-height: 1; color: {INK}; transform: rotate(-4deg)">Peter M.</div>
      <div style="{SANS}; font-weight: 600; font-size: 14px; color: {MUTE}; margin-top: 6px">Architect, top floor</div></div></div>
</div>''')

check_lines = [("2", "Steak sand.", "13.90"), ("1", "Shrimp toast", "3.95"), ("1", "Powdered milk, can", "2.29"), ("1", "Diapers, box", "6.49"), ("2", "Coffee, car outside", "1.30")]
rows = ''.join(f'''<div style="display: flex; border-bottom: 1px solid #b9c9a8; height: 25px; align-items: flex-end">
  <div style="width: 24px; {HAND}; font-size: 21px; color: #2b3a78">{q}</div>
  <div style="flex: 1; {HAND}; font-size: 21px; color: #2b3a78; white-space: nowrap">{t}</div>
  <div style="width: 50px; text-align: right; {HAND}; font-size: 21px; color: #2b3a78; border-left: 1px solid #b9c9a8; padding-right: 2px">{a}</div></div>'''
               for q, t, a in check_lines)
check = f'''<div style="position: absolute; left: 40px; top: 268px; width: 262px; transform: rotate(-3deg)">
  <div style="position: absolute; left: 5px; top: 6px; width: 262px; height: 100%; background: rgba(60,50,30,0.16)"></div>
  <div style="position: relative; background: #fbfaf0; border: 1px solid #c9d3b8; padding: 9px 12px 10px">
    <div style="display: flex; justify-content: space-between; align-items: baseline; {SANS}; font-weight: 800; color: #3f6b46">
      <span style="font-size: 16px; letter-spacing: 0.06em">GUEST CHECK</span><span style="font-size: 15px; color: {ROSE}">No 1125</span></div>
    <div style="display: flex; justify-content: space-between; {SANS}; font-weight: 600; font-size: 14px; color: #3f6b46; margin-top: 3px; border-bottom: 1px solid #b9c9a8; padding-bottom: 2px">
      <span>DELIVER TO</span><span style="{HAND}; font-size: 20px; color: #2b3a78; line-height: 0.9">Top floor, 3 men</span></div>
    {rows}
    <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 2px">
      <span style="{SANS}; font-weight: 600; font-size: 14px; color: #3f6b46">TOTAL</span><span style="{HAND}; font-weight: 700; font-size: 22px; color: #2b3a78">27.93</span></div>
    <div style="position: absolute; left: 74px; top: 178px; border: 3px solid {ROSE}; color: {ROSE}; {DISP}; font-size: 22px; padding: 0 10px; transform: rotate(-12deg); opacity: 0.82; letter-spacing: 0.08em">PAID</div>
  </div></div>'''

back = face(f'''
<div style="position: absolute; left: {L}px; top: 54px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    {kicker('Moonlight Coffee Shop &amp; Deli')}{kicker('Grill open all night', 'color: ' + MUTE)}</div>
  <div style="margin-top: 14px">{bar('From the Grill')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S("Peter's loft steak sandwich", 18)}{A('soup')}</div>
    <div>{A('deluxe', 18)}{A('club', note='Keep one hot for Jack. He is in Turkey.')}</div></div>
  <div style="height: 1px; background: {INK}; margin-top: 18px"></div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px; margin-top: 16px">
    <div>
      {bar('Sweets')}
      {S("Baby Mary's bedtime vanilla custard", 16)}{A('cheesecake', 16)}
      <div style="height: 1px; background: {INK}; margin-top: 16px"></div>
      <div style="margin-top: 16px">{bar('Fountain', '2 A.M. TOO')}</div>
      {S('Night-feed bourbon milk punch', 16)}</div>
    <div style="position: relative">
      {kicker('Quiet please after 8 P.M.')}
      <div style="margin-top: 10px; border: 3px solid {ROSE}; padding: 4px; background: #fffbef"><img src="assets/still-bassinet.jpg" alt="Three men hushing each other over a bassinet in the loft" style="display: block; width: 318px; height: 150px"></div>
      <div style="{SERIF}; font-size: 18px; line-height: 1.32; margin-top: 8px">Our drivers knock softly. Nothing is ever left on the doorstep.</div>
      {check}</div></div>
</div>
<div style="position: absolute; left: {L}px; top: 960px; width: {CW}px; border-top: 1px solid {INK}; padding-top: 9px; {SANS}; font-weight: 600; font-size: 15px; color: {MUTE}; line-height: 1.4">
  <div style="display: flex; justify-content: space-between"><span>Prices subject to change. We do not hold packages for anybody.</span><span>Form 11-25, 1987</span></div>
  <div style="display: flex; justify-content: space-between"><span>Elevator out? We walk it up. House accounts, ask for Mrs. Hathaway's terms.</span><span>Call 555-0187</span></div></div>''')

for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Moonlight Coffee Shop</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "loftsupper", "fn": "fmtLoftSupper", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Righteous", "Figtree", "Literata", "Caveat"],
           "phone": {"disp": "'Righteous',sans-serif", "title": "'Righteous',sans-serif", "name": "'Figtree',sans-serif",
                     "body": "'Literata',serif", "price": "'Figtree',sans-serif", "note": "'Literata',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Three Men and a Baby (1987)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'loftsupper.labels.json'), 'w'), indent=1)
print('built')
