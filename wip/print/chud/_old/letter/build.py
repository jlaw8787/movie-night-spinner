"""Spring & Crosby Coffee Shop menu, C.H.U.D. (1984).
Two-sided US Letter card from the all-night SoHo coffee shop on the corner of Spring and Crosby,
where the night shift cops eat at the counter. House style lock (Jurassic system). Run paint.py first.
Writes front.html, back.html, film.json and bowerybelow.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
INK, RED, PAPER, MUTE = '#1c1b18', '#c02e1c', '#f1dc7a', '#4d4430'
FONTS = ('family=Staatliches'
         '&family=Barlow:wght@600;700;800'
         '&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400'
         '&family=Shadows+Into+Light')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Staatliches', 'Arial Narrow', sans-serif"
SANS = "font-family: 'Barlow', 'Helvetica Neue', Arial, sans-serif"
SERIF = "font-family: 'Source Serif 4', Georgia, serif"
HAND = "font-family: 'Shadows Into Light', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Soup kitchen cheddar and onion rolls": ("Cheddar & Onion Rolls", "A pull-apart pan, baked this morning with sharp cheese on top.", "1.25",
                                           "Good for dunking in the stew."),
  "Manhole cover mini pizzas": ("Manhole Cover Pizzas", "Little rounds of tomato sauce and mozzarella, pepperoni laid on in a crosshatch.", "2.50",
                                "Cut like the covers out front."),
  "The Reverend's soup kitchen stew": ("Beef Stew", "Chuck braised for hours with carrot, celery, onion and potato. Italian bread to mop up.", "4.25",
                                       "What's left goes to the Reverend's shelter."),
  "Greenwich Village cider doughnuts": ("Cider Doughnuts", "Boiled-down apple juice in the batter, fried and rolled in cinnamon sugar.", "2 for .96",
                                        "Seconds once everybody has had firsts."),
  "Glowing green cordial": ("Lime Cooler", "Lime cordial and tonic water, poured over a glass full of ice.", ".84",
                            "Glows green under the sign."),
}
ADD = {
  'burger': ("Cheeseburger Deluxe", "Six ounces off the griddle with American, lettuce, tomato, fries and slaw.", "3.95"),
  'omelette': ("Western Omelette", "Three eggs, ham, green pepper and onion. Home fries and rye toast.", "3.25"),
  'pudding': ("Rice Pudding", "Baked slow with milk and raisins, cinnamon on top.", "1.50"),
  'coffee': ("Coffee", "Bottomless at the counter, fresh every hour.", ".60"),
}


def item(n, d, p, note=None, top=20):
    nt = (f'<div style="{SERIF}; font-style: italic; font-size: 18px; line-height: 1.3; color: {RED}; margin-top: 3px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">
        <div style="{SANS}; font-weight: 800; font-size: 27px; line-height: 1.08">{n}</div>
        <div style="{SANS}; font-weight: 800; font-size: 27px; white-space: nowrap">{p}</div></div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.32; margin-top: 4px; color: #2a2620; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=20, note=False):
    n, d, p, nt = SPEC[k]
    return item(n, d, p, nt if note else None, top)


def A(k, top=20):
    return item(*ADD[k], top=top)


def hazard(w, h, step=26):
    """Black and yellow hazard stripes from skewed divs (no gradients, saved-image safe)."""
    bars = ''.join(f'<div style="position: absolute; left: {x}px; top: 0; width: {step // 2}px; height: {h}px; background: {INK}; transform: skewX(-38deg)"></div>'
                   for x in range(-step, w + step, step))
    return f'<div style="position: relative; width: {w}px; height: {h}px; overflow: hidden; background: #f0c419">{bars}</div>'


def bar(t, sub=None):
    s = f'<span style="{SANS}; font-weight: 700; font-size: 18px; letter-spacing: 0.14em; color: {PAPER}; margin-left: 16px; white-space: nowrap">{sub}</span>' if sub else ''
    return (f'<div style="display: inline-flex; align-items: stretch; white-space: nowrap">'
            f'<div style="width: 22px; background: {RED}"></div>'
            f'<div style="background: {INK}; color: #f6e79c; padding: 6px 22px 4px 18px; {DISP}; font-size: 44px; line-height: 1; letter-spacing: 0.03em">{t}{s}</div></div>')


def kicker(t, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {RED}; {extra}">{t}</div>'


def face(inner):
    livery = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 12px; background: {INK}"></div>'
              f'<div style="position: absolute; left: 0; top: 12px">{hazard(W, 10)}</div>')
    fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
            'background: radial-gradient(ellipse 78% 72% at 50% 48%, rgba(255,246,200,0.10) 0%, rgba(255,246,200,0.08) 55%, rgba(150,110,30,0.30) 100%)"></div>')
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
             f'height: {H}px; pointer-events: none; display: block; opacity: 0.8">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{inner}{livery}{fade}{grain}</div>')


L, CW = 56, 704
CHUD = ''.join(f'<span style="color: {RED}">{w[0]}</span>{w[1:]} ' for w in ('Clean.', 'Hot.', 'Unbeatable.', 'Delicious.')).strip()

front = face(f'''
<div style="position: absolute; left: {L}px; top: 48px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Corner of Spring and Crosby, SoHo', 'white-space: nowrap; letter-spacing: 0.15em')}{kicker('Open all night', 'white-space: nowrap; letter-spacing: 0.15em; color: ' + MUTE)}</div>
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4px">
    <div style="{DISP}; font-size: 90px; line-height: 0.95; letter-spacing: 0.01em; white-space: nowrap">Spring <span style="color: {RED}">&amp;</span> Crosby</div>
    <div style="text-align: right; padding-bottom: 6px">
      <div style="{DISP}; font-size: 40px; line-height: 0.95; letter-spacing: 0.06em">Coffee<br>Shop</div></div></div>
  <div style="height: 4px; background: {INK}; margin-top: 10px"></div>
  <div style="{SANS}; font-weight: 700; font-size: 20px; letter-spacing: 0.08em; text-transform: uppercase; margin-top: 8px">{CHUD}</div>
  <div style="margin-top: 12px; border: 3px solid {RED}; padding: 6px; background: #fbf6e2">
    <img src="assets/still-counter.jpg" alt="Two night shift patrolmen at the counter" style="display: block; width: {CW - 18}px; height: 378px"></div>
  <div style="{SANS}; font-weight: 600; font-size: 16px; letter-spacing: 0.03em; color: {MUTE}; margin-top: 7px">The night shift at our counter. Photo by G. Cooper, a regular.</div>
  <div style="margin-top: 22px">{bar('Off the Counter', 'ALL HOURS')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Soup kitchen cheddar and onion rolls', 12)}</div>
    <div>{S('Manhole cover mini pizzas', 12)}</div></div>
  <div style="display: flex; gap: 30px; margin-top: 18px; align-items: flex-start; border-top: 1px solid {INK}; padding-top: 14px">
    <div style="flex: 1">
      {kicker('A word from the precinct', 'font-size: 15px')}
      <div style="{SERIF}; font-size: 19px; line-height: 1.32; margin-top: 4px">My men eat here every night shift, and so do I. Best cup of coffee south of Houston Street.</div>
      <div style="display: flex; align-items: baseline; gap: 14px; margin-top: 2px">
        <div style="{HAND}; font-size: 36px; line-height: 1.1; color: #22306a; transform: rotate(-3deg)">Bosch</div>
        <div style="{SANS}; font-weight: 600; font-size: 14px; color: {MUTE}">Captain, N.Y.P.D.</div></div></div>
    <div style="flex: none; width: 300px; border: 2px dashed {RED}; background: #f8edb6; padding: 9px 14px 10px; transform: rotate(1.5deg)">
      <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Coupon', 'font-size: 15px')}<span style="{SANS}; font-weight: 700; font-size: 14px; color: {MUTE}">No. 1984</span></div>
      <div style="{DISP}; font-size: 30px; line-height: 1; margin-top: 4px">Night shift coffee, free</div>
      <div style="{SERIF}; font-size: 16px; line-height: 1.3; margin-top: 4px">Anyone in uniform, midnight to 6 A.M., with any plate. Good thru Aug. 31.</div></div></div>
</div>''')

stamp = (f'<div style="display: inline-block; border: 3px solid {RED}; border-radius: 6px; padding: 6px 12px 7px; color: {RED}; transform: rotate(-2.5deg); background: rgba(248,237,182,0.5)">'
         f'<div style="{DISP}; font-size: 26px; line-height: 1; letter-spacing: 0.04em">Leftovers to the shelter</div>'
         f'<div style="{SANS}; font-weight: 700; font-size: 15px; letter-spacing: 0.08em; margin-top: 3px">EVERY NIGHT. ASK THE REVEREND.</div></div>')

back = face(f'''
<div style="position: absolute; left: {L}px; top: 52px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    {kicker('Spring &amp; Crosby Coffee Shop')}{kicker('Hot plates all night', 'color: ' + MUTE)}</div>
  <div style="margin-top: 12px">{bar('Hot Plates')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S("The Reverend's soup kitchen stew", 14)}</div>
    <div>{A('burger', 14)}</div></div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{A('omelette')}</div><div style="display: flex; align-items: flex-end; justify-content: center; padding-top: 18px">{stamp}</div></div>
  <div style="height: 1px; background: {INK}; margin-top: 18px"></div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px; margin-top: 16px">
    <div>
      {bar('The Fountain')}
      {S('Greenwich Village cider doughnuts', 14)}{A('pudding', 16)}{S('Glowing green cordial', 16, note=True)}{A('coffee', 16)}</div>
    <div style="position: relative">
      {kicker('Our corner')}
      <div style="margin-top: 10px; border: 3px solid {RED}; padding: 4px; background: #fbf6e2"><img src="assets/still-corner.jpg" alt="Spring and Crosby at night, the phone booth and the manhole out front" style="display: block; width: 318px; height: 190px"></div>
      <div style="{SERIF}; font-size: 18px; line-height: 1.32; margin-top: 8px">Pay phone out front. Mind the manhole.</div>
      <img src="assets/guest-check.png" alt="A pencilled night shift guest check, marked paid" style="position: absolute; left: 74px; top: 282px; width: 220px; height: 280px; display: block"></div></div>
</div>
<div style="position: absolute; left: {L}px; top: 978px; width: {CW}px; border-top: 1px solid {INK}; padding-top: 10px; display: flex; justify-content: space-between; {SANS}; font-weight: 600; font-size: 15px; color: {MUTE}">
  <span>Prices subject to change. Minimum at tables after midnight, 1.25</span><span>96 Crosby St. WOrth 6-0831. 1984</span></div>''')

for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Spring &amp; Crosby Coffee Shop</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "bowerybelow", "fn": "fmtBoweryBelow", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Staatliches", "Barlow", "Source Serif 4", "Shadows Into Light"],
           "phone": {"disp": "'Staatliches',sans-serif", "title": "'Staatliches',sans-serif", "name": "'Barlow',sans-serif",
                     "body": "'Source Serif 4',serif", "price": "'Barlow',sans-serif", "note": "'Source Serif 4',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"C.H.U.D. (1984)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'bowerybelow.labels.json'), 'w'), indent=1)
print('built')
