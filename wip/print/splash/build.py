"""Builds the Cape Bay Excursion Line leaflet (Splash, 1984).
A two-colour (harbour blue and signal red) handout from the ticket window of a Cape Cod
sightseeing boat, the kind of boat young Allen goes over the rail of in 1964. Front: the
boat, departures and the rules on board. Back: the galley menu for every sailing and the
sunset lobster supper cruise.
6 x 9 in card (152.4 x 228.6 mm), printed both sides, no fold.
Writes front.html / back.html (full pages) and front.body.html / back.body.html."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 576, 864
PAPER, BLUE, RED = '#f7f3e9', '#1f4f9e', '#cf3b2a'
INK = '#1b2f52'
FONTS = 'family=Fraunces:ital,wght@0,600;0,800;1,500;1,600;1,800&family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;1,400'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Fraunces', Georgia, serif"
BODY = "'Libre Franklin', 'Franklin Gothic', Arial, sans-serif"
L, R = 44, 532          # text box, 44px inside the trim each side
TW = R - L

def esc(s): return s.replace('&', '&amp;')

def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.7; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')

def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {BODY}; color: {INK}">{inner}{overlays(face)}</div>')

def kicker(t, color=RED, size=13):
    return f'<div style="font-weight: 700; font-size: {size}px; letter-spacing: 0.2em; color: {color}">{esc(t)}</div>'

# ---------------- FRONT ----------------
DEPS = [
    ('Harbor and seal cruise', 'One hour round the bay. Look out for seals and the odd surprise.', '10:00, 12:00, 2:00, 4:00'),
    ('Sunset lobster supper cruise', 'Two hours. Supper from the galley, served on the top deck.', '6:30 nightly'),
]
deps = ''
for i, (n, sub, t) in enumerate(DEPS):
    deps += f'''<div style="padding: 9px 0; border-top: {'2px solid ' + BLUE if i == 0 else '1px solid rgba(31,79,158,0.45)'}">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">
        <div style="font-family: {DISP}; font-weight: 600; font-size: 21px; line-height: 1.12; color: {BLUE}">{esc(n)}</div>
        <div style="font-weight: 700; font-size: 16px; white-space: nowrap; color: {RED}">{esc(t)}</div></div>
      <div style="margin-top: 3px; font-size: 16px; line-height: 1.3">{esc(sub)}</div></div>'''

RULES = ['Hold on to hats, wallets and children.', 'Children stay behind the rail at all times.', 'No swimming from the boat.']
rules = ''.join(f'<div style="display: flex; gap: 10px; margin-top: {0 if i == 0 else 4}px"><span style="width: 8px; height: 8px; margin-top: 7px; flex: none; background: {RED}; display: block"></span><span>{esc(r)}</span></div>' for i, r in enumerate(RULES))

front = f'''
<div style="position: absolute; left: {L}px; top: 42px; width: {TW}px; display: flex; justify-content: space-between">
  {kicker('CAPE COD, MASS.')}{kicker('SEASON OF 1984')}</div>
<div style="position: absolute; left: {L}px; top: 64px; width: {TW}px; height: 3px; background: {BLUE}"></div>
<div style="position: absolute; left: {L}px; top: 76px; width: {TW}px">
  <div style="font-family: {DISP}; font-style: italic; font-weight: 800; font-size: 66px; line-height: 1; color: {BLUE}; letter-spacing: -0.01em">Cape Bay</div>
  <div style="display: flex; align-items: center; gap: 12px; margin-top: 6px">
    <div style="font-weight: 700; font-size: 18px; letter-spacing: 0.3em; color: {RED}">EXCURSION LINE</div>
    <div style="flex: 1; height: 2px; background: {RED}"></div></div>
</div>
<img src="assets/bay-art.png" alt="Excursion boat passing the lighthouse at sunset" style="position: absolute; left: {L}px; top: 186px; width: {TW}px; height: {round(TW * 268 / 496)}px; display: block">
<div style="position: absolute; left: {L}px; top: 456px; width: {TW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px">
    {kicker('DAILY FROM THE TOWN PIER', BLUE, 14)}
    <div style="font-weight: 600; font-size: 14px; letter-spacing: 0.04em; color: {BLUE}">June to September</div></div>
  {deps}
  <div style="border-top: 2px solid {BLUE}; padding-top: 9px; font-size: 16px; line-height: 1.35">
    <b style="font-weight: 700; color: {BLUE}">Fares</b>&nbsp; Adults 5.00, children under twelve 2.50. Supper is extra.</div>
</div>
<div style="position: absolute; left: {L}px; top: 678px; width: {TW}px; box-sizing: border-box; border: 2px solid {RED}; padding: 12px 16px 13px">
  <div style="position: absolute; left: 14px; top: -10px; background: {PAPER}; padding: 0 8px">{kicker('ON BOARD, PLEASE')}</div>
  <div style="font-size: 16px; line-height: 1.32; font-weight: 500">{rules}</div>
</div>
<div style="position: absolute; left: {L}px; top: 800px; width: {TW}px; display: flex; justify-content: space-between; align-items: baseline">
  <div style="font-family: {DISP}; font-style: italic; font-weight: 600; font-size: 18px; color: {BLUE}">Sailing the bay since 1964.</div>
  <div style="font-weight: 700; font-size: 13px; letter-spacing: 0.18em; color: {RED}">GALLEY MENU OVER</div></div>
'''

# ---------------- BACK ----------------
def item(name, desc, price, top=14, note=None):
    n = f'<div style="margin-top: 3px; font-style: italic; font-size: 15px; line-height: 1.3; color: {RED}">{esc(note)}</div>' if note else ''
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">
        <div style="font-family: {DISP}; font-weight: 600; font-size: 21px; line-height: 1.1; color: {BLUE}">{esc(name)}</div>
        <div style="font-weight: 700; font-size: 17px; line-height: 1.1; white-space: nowrap; color: {BLUE}">{esc(price)}</div></div>
      <div style="margin-top: 3px; font-size: 16px; line-height: 1.3; text-wrap: pretty">{esc(desc)}</div>{n}</div>'''

def head(t, top=0):
    return f'''<div style="margin-top: {top}px; display: flex; align-items: center; gap: 10px">
      {kicker(t, RED, 13)}<div style="flex: 1; height: 2px; background: {RED}"></div></div>'''

LEFT = (head('RAW BAR')
        + item('Cape oysters', 'Opened to order on crushed ice. Shallots in red wine vinegar, cracked pepper, lemon.', '6 for 6.50', 10)
        + item('Clam chowder', 'Chopped quahogs, salt pork, potato and onion in a creamy broth. Oyster crackers.', 'cup 1.95')
        + head('FROM THE FRYER', 20)
        + item('Fish and chips', 'White fillets in a cold lager batter, fried crisp. Twice-cooked fries, tartar sauce and lemon, in a paper cone.', '5.25', 10)
        + item('Corn on the cob', 'Boiled sweet, plenty of butter.', '1.25'))
RIGHT = (head('SWEETS')
         + item('Deep blue gelatin', 'Coconut cream set firm, a clear sea-coloured layer poured over, gummy fish on top.', '1.50', 10)
         + head('BAR AND FOUNTAIN', 20)
         + item('Blue lagoon', 'Vodka and curaçao over ice, topped with lemonade and a lemon wheel.', '3.25', 10, 'Sunset cruise only.')
         + item('Fresh lemonade', 'Squeezed in the galley with cane sugar, plenty of ice.', '.95')
         + item('Galley coffee', 'Hot from the urn. Cream and sugar on the counter.', '.60'))

back = f'''
<div style="position: absolute; left: 0; top: 0; width: {FW}px; height: 124px; background: {BLUE}"></div>
<div style="position: absolute; left: {L}px; top: 40px; width: {TW}px; color: {PAPER}">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    <div style="font-family: {DISP}; font-style: italic; font-weight: 800; font-size: 46px; line-height: 1">The Galley</div>
    <div style="font-weight: 700; font-size: 13px; letter-spacing: 0.2em">CAPE BAY EXCURSION LINE</div></div>
  <div style="margin-top: 8px; font-size: 16px; line-height: 1.3">Open on every sailing. Order at the counter, lower deck.</div>
</div>
<div style="position: absolute; left: 0; top: 124px; width: {FW}px; height: 6px; background: {RED}"></div>
<div style="position: absolute; left: {L}px; top: 156px; width: {TW}px; box-sizing: border-box; border: 2px solid {RED}; padding: 16px 18px 15px">
  <div style="position: absolute; left: 14px; top: -10px; background: {PAPER}; padding: 0 8px">{kicker('SUNSET SUPPER CRUISE, 6:30')}</div>
  <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
    <div style="font-family: {DISP}; font-weight: 800; font-size: 28px; line-height: 1.05; color: {BLUE}">Whole boiled lobster</div>
    <div style="font-weight: 700; font-size: 20px; white-space: nowrap; color: {BLUE}">12.95</div></div>
  <div style="margin-top: 5px; font-size: 16px; line-height: 1.32">About 1&frac14; lb, split and brushed with garlic butter, then finished under the broiler. A cup of drawn butter, lemon, crackers and a bib.</div>
  <div style="margin-top: 5px; font-style: italic; font-size: 15px; line-height: 1.3; color: {RED}">Most guests leave the shell.</div>
</div>
<div style="position: absolute; left: {L}px; top: 322px; width: 236px">{LEFT}</div>
<div style="position: absolute; left: {L + 252}px; top: 322px; width: 236px">{RIGHT}</div>
<div style="position: absolute; left: {L}px; top: 790px; width: {TW}px; border-top: 2px solid {BLUE}; padding-top: 8px; display: flex; justify-content: space-between; align-items: baseline">
  <div style="font-size: 14px; font-weight: 500">Cash only at the counter, please.</div>
  <div style="font-weight: 700; font-size: 13px; letter-spacing: 0.18em; color: {RED}">THANK YOU</div></div>
'''

FACES = {'front': front, 'back': back}
for name, inner in FACES.items():
    body = root(inner, name)
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>Cape Bay Excursion Line, {name}</title>{LINK}<style>body{{margin:0;background:{PAPER}}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "oceansupper", "fn": "fmtOceanSupper", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [152.4, 228.6], "fonts": FONTS, "fams": ["Fraunces", "Libre Franklin"],
           "phone": {"disp": "'Fraunces',serif", "title": "'Fraunces',serif", "name": "'Fraunces',serif",
                     "body": "'Libre Franklin',sans-serif", "price": "'Libre Franklin',sans-serif", "note": "'Libre Franklin',sans-serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)

LABELS = {"Splash (1984)": {
  "Oysters natural": {"n": "Cape oysters", "d": "Opened to order on crushed ice. Shallots in red wine vinegar, cracked pepper, lemon.", "note": "Six for 6.50 at the raw bar."},
  "Fish and chip cones": {"n": "Fish and chips", "d": "White fillets in a cold lager batter, fried crisp. Twice-cooked fries, tartar sauce and lemon, in a paper cone.", "note": "Hold on to the cone at the rail."},
  "Whole lobster": {"n": "Whole boiled lobster", "d": "About 1¼ lb, split and brushed with garlic butter, then finished under the broiler. A cup of drawn butter, lemon, crackers and a bib.", "note": "Most guests leave the shell."},
  "Ocean blue jelly cups": {"n": "Deep blue gelatin", "d": "Coconut cream set firm, a clear sea-coloured layer poured over, gummy fish on top.", "note": "From the galley on every sailing."},
  "Blue lagoon": {"n": "Blue lagoon", "d": "Vodka and curaçao over ice, topped with lemonade and a lemon wheel.", "note": "Sunset cruise only."}}}
json.dump(LABELS, open(os.path.join(D, 'oceansupper.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
