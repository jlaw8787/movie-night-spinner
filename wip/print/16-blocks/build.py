"""16 Blocks (2006). The printed wall menu board of the Docket Coffee Shop & Grill,
the 24-hour counter halfway along the walk from the precinct to the courts.
One landscape face, 1344x816. Signature piece: the shop's delivery map, a real 1884 Perris & Browne
index sheet of lower Manhattan (Library of Congress) with the sixteen blocks overlaid as type and lines. Writes board.html,
board.body.html, film.json and sixteen.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 1344, 816
NAVY = '#14243f'
NAVY2 = '#0e1a30'
YEL = '#f2b630'
CREAM = '#f2e9d4'
SOFT = '#c9cfd9'
FONTS = 'family=Big+Shoulders+Display:wght@600;800;900&family=Archivo+Narrow:wght@400;600;700&family=Homemade+Apple'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Big Shoulders Display', 'Arial Narrow', sans-serif"
BODY = "'Archivo Narrow', 'Arial Narrow', sans-serif"
SIGN = "'Homemade Apple', cursive"

def esc(s): return s.replace('&', '&amp;')

def section(title, aside, top):
    return (f'<div style="margin-top: {top}px; display: flex; justify-content: space-between; align-items: baseline; '
            f'border-bottom: 4px solid {YEL}; padding-bottom: 5px">'
            f'<div style="font-family: {DISP}; font-weight: 900; font-size: 40px; line-height: 0.95; letter-spacing: 0.02em; color: {CREAM}">{esc(title)}</div>'
            f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; line-height: 1; letter-spacing: 0.12em; color: {YEL}; text-transform: uppercase">{esc(aside)}</div></div>')

def item(name, price, desc, top=13):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">'
            f'<div style="font-family: {DISP}; font-weight: 800; font-size: 29px; line-height: 1.05; letter-spacing: 0.025em; color: {CREAM}; text-transform: uppercase">{esc(name)}</div>'
            f'<div style="font-family: {DISP}; font-weight: 800; font-size: 29px; line-height: 1.05; color: {YEL}; white-space: nowrap">{price}</div></div>'
            f'<div style="margin-top: 3px; font-family: {BODY}; font-size: 20px; line-height: 1.26; color: {SOFT}; text-wrap: pretty">{esc(desc)}</div></div>')

# dishes: (name, price, description); spec keys noted for the labels file
BREAKFAST = [
    ('Bacon, Egg & Cheese', '2.75', 'Scrambled on the flat top, on a kaiser.'),
    ('Buttered Roll', '1.00', 'Kaiser pressed on the grill, crisp outside.'),
]
GRILL = [
    ('Chopped Beef & Cheese', '4.50', 'Ground chuck and onions worked fine on the griddle, melted American, lettuce, tomato, mayo, toasted hero.'),
    ('Cheeseburger Deluxe', '5.95', 'Six ounces of chuck, lettuce, tomato, fries.'),
]
BAKERY = [
    ('Chocolate Birthday Cake', '2.75', 'By the slice, two cocoa layers, dark buttercream. Whole cake 16.00, any name on top.'),
]
HOT = [
    ('Chicharrones', '4.00', 'Pork belly roasted till the skin shatters, salt and malt vinegar, pickled onions, hot mustard.'),
    ('Pan-Fried Pork Dumplings', '3.25', 'Six, crisp underneath, with soy, black vinegar and ginger to dip.'),
]
COFFEE = [
    ('Sweet Iced Coffee', '1.75', 'Seattle-style dark roast over ice, condensed milk from the can, pinch of cinnamon.'),
]

def col(*parts): return ''.join(parts)

mid = col(section('BREAKFAST', 'Served any hour', 0), *[item(*x) for x in BREAKFAST],
          section('THE GRILL', 'Ground fresh daily', 18), *[item(*x) for x in GRILL],
          section('BAKERY', 'Cakes to order', 18), *[item(*x) for x in BAKERY])
right = col(section('HOT TABLE', 'Per half pound', 0), *[item(*x) for x in HOT],
            section('COFFEE', 'Hot cup 1.00, bottomless', 18), *[item(*x) for x in COFFEE])

# props
court_pass = f'''<div style="position: absolute; left: 16px; top: 552px; width: 168px; height: 106px; background: #fbfaf6; border-radius: 6px;
  box-shadow: 0 3px 8px rgba(0,0,0,0.35); transform: rotate(-5deg); overflow: hidden; font-family: {BODY}; color: {NAVY}">
  <div style="position: absolute; left: 69px; top: 6px; width: 30px; height: 7px; border-radius: 4px; background: #9aa3b2"></div>
  <div style="position: absolute; left: 0; top: 17px; width: 168px; height: 30px; background: {NAVY}; color: {YEL}; text-align: center;
    font-family: {DISP}; font-weight: 900; font-size: 24px; line-height: 30px; letter-spacing: 0.14em">COURT PASS</div>
  <div style="position: absolute; left: 11px; top: 52px; width: 150px; font-size: 14px; line-height: 1.22; font-weight: 600">
    GRAND JURY, PART 16<br>WITNESS, ESCORTED<br><span style="font-weight: 700">REPORT BY 10:00 A.M.</span></div>
</div>'''

hours = ''.join(
    f'<div style="width: 30px; height: 22px; border: 1px solid {NAVY}; margin: 0 0 -1px -1px; display: flex; align-items: center; justify-content: center; '
    f'font-family: {DISP}; font-weight: 800; font-size: 16px; position: relative">{h}'
    + (f'<div style="position: absolute; left: 6px; top: 2px; width: 17px; height: 17px; border-radius: 50%; background: {NAVY2}"></div>' if h == 8 else '')
    + '</div>' for h in (6, 7, 8, 9, 10, 11))
transfer = f'''<div style="position: absolute; left: 296px; top: -6px; width: 98px; height: 216px; background: #fbfaf6; box-shadow: 0 3px 8px rgba(0,0,0,0.35);
  transform: rotate(4deg); font-family: {BODY}; color: {NAVY}; text-align: center">
  <div style="height: 8px; background: {YEL}"></div>
  <div style="margin-top: 6px; font-size: 14px; font-weight: 700; letter-spacing: 0.1em">CITY BUS</div>
  <div style="font-family: {DISP}; font-weight: 900; font-size: 24px; line-height: 1; letter-spacing: 0.04em">TRANSFER</div>
  <div style="margin-top: 4px; font-size: 14px; font-weight: 600">No. 8420</div>
  <div style="margin: 7px 0 0 19px; width: 62px; display: flex; flex-wrap: wrap">{hours}</div>
  <div style="margin-top: 6px; font-size: 14px; font-weight: 700; letter-spacing: 0.06em">A.M. ONLY</div>
  <div style="font-size: 14px; line-height: 1.1">Good 2 hours</div>
</div>'''

note = f'''<div style="position: absolute; left: 272px; top: 12px; width: 168px; height: 66px; background: #fffdf3; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
  transform: rotate(2.5deg); padding: 7px 10px 0; box-sizing: border-box; color: {NAVY}">
  <div style="position: absolute; left: 70px; top: -9px; width: 56px; height: 17px; background: rgba(242,182,48,0.75); transform: rotate(-4deg)"></div>
  <div style="font-family: {BODY}; font-size: 16px; line-height: 1.15">Best cup on the walk.</div>
  <div style="font-family: {SIGN}; font-size: 16px; line-height: 1.6; margin-top: 0; text-align: right; color: #233b72">Jack Mosley</div>
</div>'''

# ---------- route overlay on the 1884 Perris & Browne index sheet (css px of the 432x548 map box) ----------
import math as _m
ROUTE = [(118, 14), (122, 345), (318, 377), (322, 495), (216, 503), (214, 462)]
def _along(pts, n):
    seg = [(_m.dist(a, b), a, b) for a, b in zip(pts, pts[1:])]
    tot = sum(s_[0] for s_ in seg); out = []
    for i in range(n):
        t = tot * i / (n - 1)
        for L, a, b in seg:
            if t <= L + 1e-6:
                out.append((a[0] + (b[0] - a[0]) * t / L, a[1] + (b[1] - a[1]) * t / L)); break
            t -= L
    return out
# block 8 sits on the Canal corner: first half evenly down Broadway, second half evenly to the courts
PINS = _along(ROUTE[:2], 8) + _along(ROUTE[1:], 9)[1:]
_pts = ' '.join(f'{x},{y}' for x, y in ROUTE)
route_svg = (f'<svg width="432" height="548" viewBox="0 0 432 548" style="position: absolute; left: 0; top: 0" aria-hidden="true">'
             f'<polyline points="{_pts}" fill="none" stroke="{NAVY}" stroke-width="9" stroke-linejoin="round" stroke-linecap="round" opacity="0.9"/>'
             f'<polyline points="{_pts}" fill="none" stroke="{YEL}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>'
             f'<path d="M {ROUTE[-1][0] - 7} {ROUTE[-1][1] + 9} L {ROUTE[-1][0]} {ROUTE[-1][1] - 4} L {ROUTE[-1][0] + 7} {ROUTE[-1][1] + 9} Z" fill="{NAVY}"/></svg>')
def _pin(i, x, y):
    if i == 8:
        return (f'<div style="position: absolute; left: {x - 13}px; top: {y - 13}px; width: 26px; height: 26px; border-radius: 50%; background: {YEL}; '
                f'border: 3px solid {NAVY}; box-sizing: border-box"></div>')
    return (f'<div style="position: absolute; left: {x - 11}px; top: {y - 11}px; width: 22px; height: 22px; border-radius: 50%; background: {NAVY}; '
            f'color: {CREAM}; font-family: {BODY}; font-weight: 700; font-size: 14px; line-height: 22px; text-align: center">{i}</div>')
pins = ''.join(_pin(i + 1, x, y) for i, (x, y) in enumerate(PINS))
MT = f"position: absolute; font-family: {BODY}; font-weight: 700; letter-spacing: 0.12em; color: {NAVY}; background: rgba(242,233,212,0.92); white-space: nowrap; line-height: 1"
map_layer = f'''<div style="position: absolute; left: 10px; top: 104px; width: 432px; height: 548px; overflow: hidden; border: 2px solid {NAVY}; box-sizing: border-box">
  <img src="assets/map16-perris.jpg" alt="Perris and Browne 1884 index map of lower Manhattan, with the sixteen blocks marked from the precinct down Broadway and along Canal Street through Chinatown to the courts." style="position: absolute; left: -2px; top: -2px; width: 432px; height: 548px; display: block">
  {route_svg}{pins}
  <div style="{MT}; left: 134px; top: 6px; font-size: 14px; padding: 4px 7px; border: 1.5px solid {NAVY}">THE PRECINCT</div>
  <div style="{MT}; left: 126px; top: 236px; font-size: 14px; padding: 3px 6px; transform: rotate(-90deg); transform-origin: left top">BROADWAY</div>
  <div style="{MT}; left: 172px; top: 330px; font-size: 14px; padding: 3px 6px; transform: rotate(9deg)">CANAL ST</div>
  <div style="{MT}; left: 330px; top: 418px; font-size: 14px; padding: 4px 6px; letter-spacing: 0.06em; border: 1.5px solid {NAVY}">CHINATOWN</div>
  <div style="{MT}; left: 236px; top: 390px; font-size: 14px; padding: 3px 5px; background: {NAVY}; color: {CREAM}">BUS</div>
  <div style="{MT}; left: 150px; top: 416px; font-size: 15px; padding: 5px 8px; background: {NAVY}; color: {CREAM}; letter-spacing: 0.1em">THE COURTS</div>
  <div style="{MT}; left: 398px; top: 10px; width: 22px; font-size: 14px; padding: 4px 0 3px; text-align: center; border: 1.5px solid {NAVY}">N<div style="margin: 3px auto 0; width: 2px; height: 14px; background: {NAVY}"></div></div>
  <div style="position: absolute; left: 8px; top: 360px; background: {NAVY}; padding: 7px 10px 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.3)">
    <div style="font-family: {DISP}; font-weight: 800; font-size: 18px; line-height: 1; letter-spacing: 0.06em; color: {CREAM}">DOCKET, WE ARE HERE</div>
    <div style="margin-top: 4px; font-family: {BODY}; font-weight: 700; font-size: 14px; line-height: 1; letter-spacing: 0.14em; color: {YEL}">HALFWAY, BLOCK 8</div></div>
</div>'''

body = f'''<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {NAVY}; font-family: {BODY}; color: {CREAM}">
<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; opacity: 0.22; display: block; pointer-events: none">
<div style="position: absolute; left: 12px; top: 12px; width: {FW - 24}px; height: {FH - 24}px; border: 2px solid {YEL}; box-sizing: border-box"></div>

<div style="position: absolute; left: 40px; top: 26px; width: 860px">
  <div style="font-family: {BODY}; font-weight: 700; font-size: 18px; line-height: 1; letter-spacing: 0.24em; color: {YEL}">HALFWAY BETWEEN THE PRECINCT AND THE COURTS</div>
  <div style="margin-top: 4px; display: flex; align-items: baseline; gap: 18px; white-space: nowrap">
    <div style="font-family: {DISP}; font-weight: 900; font-size: 72px; line-height: 0.95; letter-spacing: 0.03em; color: {CREAM}">DOCKET</div>
    <div style="font-family: {DISP}; font-weight: 800; font-size: 40px; line-height: 1; letter-spacing: 0.08em; color: {YEL}">COFFEE SHOP &amp; GRILL</div>
  </div>
</div>
<div style="position: absolute; right: 40px; top: 26px; text-align: right">
  <div style="font-family: {DISP}; font-weight: 900; font-size: 50px; line-height: 0.95; letter-spacing: 0.04em; color: {CREAM}">OPEN 24 HOURS</div>
  <div style="margin-top: 7px; font-family: {BODY}; font-weight: 700; font-size: 19px; line-height: 1; letter-spacing: 0.14em; color: {YEL}">FREE DELIVERY WITHIN 16 BLOCKS. 212 555 0116</div>
</div>

<div style="position: absolute; left: 32px; top: 120px; width: 452px; height: 666px; background: {CREAM}; box-shadow: 0 2px 0 {NAVY2}">
  <div style="position: absolute; left: 14px; top: 14px; font-family: {BODY}; font-weight: 700; font-size: 18px; line-height: 1; letter-spacing: 0.2em; color: #b07a10">WE DELIVER</div>
  <div style="position: absolute; left: 13px; top: 36px; font-family: {DISP}; font-weight: 900; font-size: 46px; line-height: 0.95; color: {NAVY}">THE 16 BLOCKS</div>
  {note}
  {map_layer}
  {court_pass}
</div>

<div style="position: absolute; left: 510px; top: 122px; width: 374px">{mid}</div>

<div style="position: absolute; left: 910px; top: 122px; width: 400px">
  <div style="position: relative; height: 198px">
    <div style="position: absolute; left: 0; top: 0; width: 276px; height: 155px; border: 3px solid {YEL}; overflow: hidden; background: {NAVY2}">
      <img src="assets/still-bus.jpg" alt="City bus 8420 at the corner stop" style="position: absolute; left: -10px; top: -4px; width: 292px; height: 164px; display: block"></div>
    <div style="position: absolute; left: 0; top: 166px; width: 290px; font-family: {BODY}; font-size: 17px; line-height: 1.22; color: {SOFT}">Bus 8420 stops at our corner.</div>
    {transfer}
  </div>
  {right}
</div>

<div style="position: absolute; left: 510px; top: 764px; width: 800px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; line-height: 1; color: {SOFT}; white-space: nowrap">
  <span>Prices subject to change. So are people. No liquor sold.</span><span>Board No. 16-8420. New York, 2006.</span></div>
<img src="assets/wear-board.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; display: block; pointer-events: none">
</div>'''

html = (f'<!doctype html><html><head><meta charset="utf-8"><title>Docket Coffee Shop board</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')
open(os.path.join(D, 'board.body.html'), 'w').write(body)
open(os.path.join(D, 'board.html'), 'w').write(html)

film = {"fmt": "sixteen", "fn": "fmtSixteen", "faces": ["board.html"], "names": ["Wall board"], "mm": [355.6, 215.9],
        "fonts": FONTS, "fams": ["Big Shoulders Display", "Archivo Narrow", "Homemade Apple"],
        "phone": {"disp": "'Big Shoulders Display',sans-serif", "title": "'Big Shoulders Display',sans-serif",
                  "name": "'Big Shoulders Display',sans-serif", "body": "'Archivo Narrow',sans-serif",
                  "price": "'Big Shoulders Display',sans-serif", "note": "'Archivo Narrow',sans-serif"}}
json.dump(film, open(os.path.join(D, 'film.json'), 'w'), indent=1)

labels = {"16 Blocks (2006)": {
    "Salt and vinegar pork crackling": {"n": "Chicharrones", "d": HOT[0][2], "note": "From the hot table, 4.00 per half pound."},
    "Chinatown dumplings": {"n": "Pan-Fried Pork Dumplings", "d": HOT[1][2], "note": "Six for 3.25. Chinatown is blocks 13 to 15."},
    "Chopped cheese": {"n": "Chopped Beef & Cheese", "d": GRILL[0][2], "note": "Free delivery within 16 blocks."},
    "Eddie's birthday cake": {"n": "Chocolate Birthday Cake", "d": BAKERY[0][2], "note": "Whole cake 16.00, 24 hours notice. Candles free."},
    "Bodega iced coffee with condensed milk": {"n": "Sweet Iced Coffee", "d": COFFEE[0][2], "note": "For the long walk to court."},
}}
json.dump(labels, open(os.path.join(D, 'sixteen.labels.json'), 'w'), indent=1)
print('built')
