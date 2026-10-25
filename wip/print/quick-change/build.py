"""Night Deposit Bar & Grill menu, Quick Change (1990).
Two-sided US Letter card from the Midtown bar and grill across the street from the bank Grimm robs
in a clown suit. House style lock (Jurassic system). Writes front.html, back.html, film.json and
getawaysupper.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
INK, RED, PAPER, MUTE, GOLD, GREEN = '#1c2645', '#c4262c', '#f3e6b9', '#5b5562', '#f2c230', '#2f8a4c'
FONTS = ('family=Hanken+Grotesk:wght@600;700;800;900'
         '&family=Lora:ital,wght@0,400;0,600;1,400'
         '&family=Dawning+of+a+New+Day')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
SANS = "font-family: 'Hanken Grotesk', 'Helvetica Neue', Arial, sans-serif"
SERIF = "font-family: 'Lora', Georgia, serif"
HAND = "font-family: 'Dawning of a New Day', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Clown nose cherry tomatoes": ("Stuffed Cherry Tomatoes", "A dozen, filled with feta beaten smooth with basil, olive oil and grated lemon peel.", "3.95",
                                 "A red nose for every guest."),
  "Airport bar chilli-lime wings": ("Dynamite Wings", "Oven-crisped, tossed in honey, butter, lime and sweet chili sauce, with hot pepper flakes and cilantro.", "5.95",
                                    "Not as dangerous as they look."),
  "Bodega sandwiches": ("Turkey & Swiss on a Kaiser", "Sliced roast breast, shredded iceberg, tomato, mayo and mustard. Wrapped tight to go.", "5.25",
                        "Wrapped to travel. You never know how long the trip takes."),
  "Clown cake": ("Clown Cake", "Jam sponge under white buttercream, with a piped face and a cherry nose.", "2.75",
                 "Every kid gets a balloon."),
  "Wheels-up bourbon smash": ("Bourbon Smash", "Kentucky bourbon shaken hard with fresh mint, lemon and sugar, poured over crushed ice.", "4.75",
                              "Last call 1:30 A.M."),
}
ADD = {
  'nachos': ("Nachos Grande", "Tortilla chips under melted Monterey Jack, pickled jalapeños, sour cream and salsa.", "4.75"),
  'burger': ("Cheeseburger Deluxe", "Half pound on a toasted bun, lettuce, tomato, onion, pickle and steak fries.", "5.95"),
  'cheesecake': ("New York Cheesecake", "Dense and creamy on a graham cracker crust.", "2.95"),
  'beer': ("Draft Beer", "Sixteen ounce glass. Ask what's on tap.", "2.50"),
  'coffee': ("Coffee", "The million dollar cup. Bottomless, with the morning paper.", "1.00"),
}


def item(n, d, p, note=None, top=20):
    nt = (f'<div style="{SERIF}; font-style: italic; font-size: 18px; line-height: 1.3; color: {RED}; margin-top: 3px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">
        <div style="{SANS}; font-weight: 800; font-size: 27px; line-height: 1.08; letter-spacing: -0.01em">{n}</div>
        <div style="{SANS}; font-weight: 800; font-size: 27px; white-space: nowrap">{p}</div></div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.34; margin-top: 4px; color: #2a2733; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=20, note=False):
    n, d, p, nt = SPEC[k]
    return item(n, d, p, nt if note else None, top)


def A(k, top=20):
    return item(*ADD[k], top=top)


def dots():
    return ''.join(f'<span style="display: inline-block; width: 14px; height: 14px; border-radius: 50%; background: {c}; margin-left: 8px; vertical-align: middle"></span>'
                   for c in (RED, GOLD, GREEN))


def bar(t, sub=None):
    s = f'<span style="{SANS}; font-weight: 700; font-size: 18px; letter-spacing: 0.14em; color: {GOLD}; margin-left: 16px; white-space: nowrap">{sub}</span>' if sub else ''
    return (f'<div style="display: flex; align-items: center"><div style="background: {INK}; color: {PAPER}; padding: 8px 22px 9px; border-left: 12px solid {RED}; {SANS}; font-weight: 900; '
            f'font-size: 42px; line-height: 1; letter-spacing: -0.005em; text-transform: uppercase; white-space: nowrap">{t}{s}</div>{dots()}</div>')


def kicker(t, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {RED}; {extra}">{t}</div>'


def face(inner):
    livery = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {RED}"></div>'
              f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; height: 6px; background: {INK}"></div>'
              f'<div style="position: absolute; left: 0; top: {H - 10}px; width: {W}px; height: 10px; background: {INK}"></div>')
    fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
            'background: radial-gradient(ellipse 78% 72% at 50% 48%, rgba(250,242,214,0.08) 0%, rgba(250,242,214,0.10) 55%, rgba(150,118,60,0.28) 100%)"></div>')
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
             f'height: {H}px; pointer-events: none; display: block; opacity: 0.85">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{inner}{livery}{fade}{grain}</div>')


L, CW = 56, 704

# guest check prop, built from divs so saved images keep it
def check_line(a, b, hand=True):
    f = f'{HAND}; font-size: 22px; color: #26338a' if hand else f'{SANS}; font-weight: 700; font-size: 14px; color: {GREEN}'
    return (f'<div style="display: flex; justify-content: space-between; border-bottom: 1px solid #9cc3a6; height: 30px; align-items: flex-end; padding: 0 2px 2px">'
            f'<span style="{f}; line-height: 1">{a}</span><span style="{f}; line-height: 1">{b}</span></div>')


CHECK = f'''<div style="position: absolute; left: 470px; top: 836px; width: 246px; background: #fbfaf2; padding: 10px 14px 12px; transform: rotate(3deg);
  box-shadow: 0 3px 8px rgba(60,40,10,0.25)">
  <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid {GREEN}; padding-bottom: 4px">
    <span style="{SANS}; font-weight: 800; font-size: 16px; letter-spacing: 0.12em; color: {GREEN}">GUEST CHECK</span>
    <span style="{SANS}; font-weight: 800; font-size: 16px; color: {RED}">No. 0713</span></div>
  {check_line('Curb, NYPD', 'Chief R.')}
  {check_line('40 coffee', '40.00')}
  {check_line('2 dynamite wings', '11.90')}
  {check_line('Total', '51.90')}
  <div style="position: absolute; left: 66px; top: 74px; border: 3px solid rgba(196,38,44,0.82); color: rgba(196,38,44,0.82); padding: 0 10px; {SANS}; font-weight: 900;
    font-size: 30px; letter-spacing: 0.08em; transform: rotate(-12deg); border-radius: 4px">PAID</div>
  <div style="position: absolute; left: 186px; top: -16px; width: 14px; height: 46px; border: 3px solid #9aa0a8; border-radius: 8px"></div></div>'''

front = face(f'''
<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Midtown Manhattan, across from the bank', 'white-space: nowrap; letter-spacing: 0.16em')}{kicker('7 A.M. to 2 A.M.', 'white-space: nowrap; letter-spacing: 0.16em; color: ' + MUTE)}</div>
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 8px">
    <div style="{SANS}; font-weight: 900; font-size: 76px; line-height: 0.9; letter-spacing: -0.035em; text-transform: uppercase; color: {INK}">Night<br><span style="color: {RED}">Deposit</span></div>
    <div style="text-align: right; padding-bottom: 4px">
      <div style="{SANS}; font-weight: 900; font-size: 40px; line-height: 1; letter-spacing: 0.06em; text-transform: uppercase">Bar &amp; Grill</div>
      <div style="{SERIF}; font-style: italic; font-size: 18px; color: {MUTE}; margin-top: 8px">Breakfast, lunch, dinner and a late bar</div></div></div>
  <div style="height: 4px; background: {INK}; margin-top: 14px"></div>
  <div style="margin-top: 16px; border: 3px solid {RED}; padding: 6px; background: #fdf8e6">
    <img src="assets/still-bank.jpg" alt="A clown and a bank guard in the bank lobby across the street" style="display: block; width: 686px; height: 360px"></div>
  <div style="{SANS}; font-weight: 600; font-size: 16px; letter-spacing: 0.03em; color: {MUTE}; margin-top: 7px">Across the street, the afternoon a clown walked into the bank. We kept the coffee coming.</div>
  <div style="margin-top: 20px">{bar('To Start', 'FROM 11 A.M.')}</div>
  {S('Clown nose cherry tomatoes', 14)}
  {S('Airport bar chilli-lime wings', 18)}
  <div style="width: 400px">{A('nachos', 18)}</div>
</div>
<div style="position: absolute; left: {L}px; top: 900px; width: 390px; border-top: 1px solid {INK}; padding-top: 10px">
  {kicker('A word from a regular', 'font-size: 15px')}
  <div style="{SERIF}; font-size: 18px; line-height: 1.32; margin-top: 4px">Forty cups out to the curb and not one came back short. Best coffee on the block.</div>
  <div style="display: flex; align-items: baseline; gap: 12px; margin-top: 2px">
    <div style="{HAND}; font-size: 34px; line-height: 1.1; color: #26338a; transform: rotate(-3deg)">Walt Rotzinger</div>
    <div style="{SANS}; font-weight: 600; font-size: 14px; color: {MUTE}">Chief, NYPD</div></div></div>
{CHECK}''')

COUPON = f'''<div style="margin-top: 18px; border: 2px dashed {RED}; background: #fbf3d6; padding: 10px 14px 12px; transform: rotate(-1.2deg)">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Coupon', 'font-size: 15px')}<span style="{SANS}; font-weight: 700; font-size: 14px; color: {MUTE}">Good thru 12/31/90</span></div>
  <div style="{SANS}; font-weight: 900; font-size: 26px; line-height: 1.05; margin-top: 4px; text-transform: uppercase">One free coffee</div>
  <div style="{SERIF}; font-size: 16px; line-height: 1.3; margin-top: 4px">Show us your bus transfer. Nobody here asks for exact change.</div></div>'''

MATCH = f'''<div style="position: absolute; left: 196px; top: 456px; width: 132px; height: 196px; background: {INK}; transform: rotate(7deg); box-shadow: 0 3px 8px rgba(40,30,10,0.3)">
  <div style="position: absolute; left: 0; top: 0; width: 132px; height: 6px; background: {RED}"></div>
  <div style="{SANS}; font-weight: 900; font-size: 22px; line-height: 0.92; text-transform: uppercase; color: {PAPER}; text-align: center; margin-top: 22px; letter-spacing: -0.02em">Night<br><span style="color: {GOLD}">Deposit</span></div>
  <div style="text-align: center; margin-top: 10px">{dots().replace('margin-left: 8px', 'margin: 0 3px')}</div>
  <div style="{SANS}; font-weight: 700; font-size: 14px; color: {PAPER}; text-align: center; margin-top: 10px">(212) 555-0713</div>
  <div style="position: absolute; left: 0; top: 150px; width: 132px; height: 46px; background: #b9a57a"></div>
  <div style="position: absolute; left: 0; top: 150px; width: 132px; height: 6px; background: #3b3527"></div></div>'''

back = face(f'''
<div style="position: absolute; left: {L}px; top: 54px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    {kicker('Night Deposit Bar &amp; Grill')}{kicker('Kitchen till midnight', 'color: ' + MUTE)}</div>
  <div style="margin-top: 14px">{bar('Sandwiches', 'WITH A PICKLE')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Bodega sandwiches', 14)}</div>
    <div>{A('burger', 14)}</div></div>
  <div style="height: 1px; background: {INK}; margin-top: 22px"></div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px; margin-top: 22px">
    <div>
      {bar('Desserts')}
      {S('Clown cake', 14, note=True)}{A('cheesecake')}
      <div style="height: 1px; background: {INK}; margin-top: 22px"></div>
      <div style="margin-top: 22px">{bar('The Bar', 'TILL 2 A.M.')}</div>
      {S('Wheels-up bourbon smash', 14)}{A('beer')}{A('coffee')}</div>
    <div style="position: relative">
      {kicker('Our block')}
      <div style="margin-top: 10px; border: 3px solid {RED}; padding: 5px; background: #fdf8e6"><img src="assets/still-lobby.jpg" alt="The bank lobby across the street, seen from above" style="display: block; width: 316px; height: 198px"></div>
      <div style="{SERIF}; font-size: 18px; line-height: 1.32; margin-top: 8px">The bank lobby across the street. Tellers eat here, and so do the cops.</div>
      {COUPON}
      <div style="margin-top: 20px; border: 3px double {INK}; padding: 12px 14px 12px; width: 160px">
        {kicker('To the airport', 'font-size: 15px; letter-spacing: 0.14em')}
        <div style="{SERIF}; font-size: 16px; line-height: 1.3; margin-top: 4px">BQE signs are down for construction in Brooklyn. Ask the bartender.</div></div>
      {MATCH}</div></div>
</div>
<div style="position: absolute; left: {L}px; top: 976px; width: {CW}px; border-top: 1px solid {INK}; padding-top: 10px; display: flex; justify-content: space-between; {SANS}; font-weight: 600; font-size: 16px; color: {MUTE}">
  <span>Prices subject to change. Party trays for 12 from 19.90</span><span>Form ND-713, 1990</span></div>''')

for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Night Deposit Bar &amp; Grill</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "getawaysupper", "fn": "fmtGetawaySupper", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Hanken Grotesk", "Lora", "Dawning of a New Day"],
           "phone": {"disp": "'Hanken Grotesk',sans-serif", "title": "'Hanken Grotesk',sans-serif", "name": "'Hanken Grotesk',sans-serif",
                     "body": "'Lora',serif", "price": "'Hanken Grotesk',sans-serif", "note": "'Lora',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Quick Change (1990)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'getawaysupper.labels.json'), 'w'), indent=1)
print('built')
