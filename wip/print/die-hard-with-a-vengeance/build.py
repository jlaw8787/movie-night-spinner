"""Kids' riddle placemat, Heights Corner Coffee Shop, 138th Street at Amsterdam Avenue, Harlem. Summer 1995.
One landscape face, 14 x 10 in (1344 x 960 at 96 dpi), printed in black, taxi yellow and red on white placemat stock.
Signature: riddle panel (fountain jugs, St. Ives, a riddle slip from Zeus next door) plus the taxi race map.
Run paint.py first. Writes placemat.html, placemat.body.html, film.json and cityrun.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 1344, 960
INK, YEL, RED, PAPER, MUTE = '#1b1a17', '#f5c218', '#d6322a', '#fbf8f0', '#5b574e'
FONTS = 'family=Titan+One&family=Nunito+Sans:ital,wght@0,400;0,700;0,800;0,900;1,400&family=Reenie+Beanie'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
TITAN = "font-family: 'Titan One', 'Arial Black', sans-serif"
SANS = "font-family: 'Nunito Sans', Arial, sans-serif"
HAND = "font-family: 'Reenie Beanie', cursive"
LAY = json.load(open(os.path.join(D, 'map_layout.json')))

# spec key -> printed name, description, price, phone note (recipe food unchanged)
SPEC = {
  "Bacon egg and cheese on a roll": ("Bacon, Egg & Cheese", "Crisp strips, a fried yolk broken flat and melted American on a toasted, buttered kaiser roll.", "$1.95",
                                     "Ketchup on the side. Wrapped to go in a minute."),
  "Harlem chicken and waffles": ("Chicken & Waffles", "Buttermilk-soaked thighs fried crisp in seasoned flour, with butter and hot sauce honey.", "$5.55",
                                 "The house plate, served all day."),
  "Zeus's salted peanut caramel slab": ("Peanut Caramel Squares", "Chewy brown sugar caramel packed with roasted salted nuts, milk chocolate and coarse salt on top.", "85¢",
                                        "Cut fresh at the counter every morning."),
  "Crumb cake": ("Crumb Cake", "Buttery yellow batter under a thick brown sugar and cinnamon streusel, powdered sugar over.", "$1.38",
                 "Ask for the corner piece."),
  "Water jug lemonade": ("Fresh Lemonade", "Squeezed lemons, sugar syrup and cold water, poured over ice.", "$1.00",
                         "By the jug for parties, 3 or 5 gallons."),
}
ADD = {
  'patty': ("Jamaican Beef Patty", "Curried chuck and onion folded into golden turmeric pastry.", "$1.25"),
  'cheese': ("Raymond's Grilled Cheese", "American on white bread, griddled golden, with a pickle spear.", "$1.75"),
  'frank': ("Dexter's Hot Dog", "All-beef frank on a toasted bun, ketchup or mustard, potato chips.", "$1.50"),
}


def item(n, d, p, top=14):
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px">
        <div style="{SANS}; font-weight: 900; font-size: 26px; line-height: 1.08; color: {INK}; letter-spacing: -0.01em">{n}</div>
        <div style="{SANS}; font-weight: 900; font-size: 26px; white-space: nowrap; color: {RED}">{p}</div></div>
      <div style="{SANS}; font-size: 20px; line-height: 1.25; margin-top: 3px; color: #2c2a25; text-wrap: pretty">{d}</div></div>'''


def S(k, top=14):
    n, d, p, _ = SPEC[k]
    return item(n, d, p, top)


def A(k, top=14):
    return item(*ADD[k], top=top)


def head(kick, title, top=0):
    return f'''<div style="margin-top: {top}px">
      <div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.18em; text-transform: uppercase; color: {RED}">{kick}</div>
      <div style="display: flex; align-items: center; gap: 10px; margin-top: 1px">
        <div style="{TITAN}; font-size: 40px; line-height: 1; color: {INK}; white-space: nowrap">{title}</div>
        <div style="flex: 1; height: 10px; background: {YEL}; margin-top: 6px"></div></div></div>'''


TOP, BOT = 190, 876

# ---------- header band ----------
header = f'''
<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 172px; background: {INK}"></div>
<div style="position: absolute; left: 0; top: 172px; width: {W}px; height: 6px; background: {YEL}"></div>
<div style="position: absolute; left: 48px; top: 40px; width: 600px">
  <div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; color: {PAPER}">COFFEE SHOP, 138TH STREET AT AMSTERDAM</div>
  <div style="{TITAN}; font-size: 64px; line-height: 1; color: {YEL}; margin-top: 6px; white-space: nowrap; letter-spacing: 0.01em">HEIGHTS CORNER</div>
  <div style="{SANS}; font-weight: 700; font-size: 16px; letter-spacing: 0.08em; color: #d9d3c4; margin-top: 8px">OPEN 6 AM TO 9 PM, SEVEN DAYS. TAKEOUT 555-0138</div></div>
<div style="position: absolute; left: 676px; top: 44px; width: 270px">
  <div style="display: inline-block; background: {RED}; padding: 7px 14px 6px; transform: rotate(-3deg); border: 3px solid {PAPER}">
    <div style="{TITAN}; font-size: 24px; line-height: 1.05; color: {PAPER}; white-space: nowrap">KIDS' RIDDLE<br>PLACEMAT</div></div>
  <div style="{SANS}; font-size: 16px; line-height: 1.3; color: {PAPER}; margin-top: 12px">Solve all three, show your waitress, get a lollipop.</div></div>
<div style="position: absolute; left: 988px; top: 26px; width: 300px">
  <div style="border: 4px solid {YEL}; line-height: 0"><img src="assets/still-avenue.jpg" alt="Amsterdam Avenue traffic at midday" style="display: block; width: 300px; height: 106px"></div>
  <div style="{SANS}; font-weight: 700; font-size: 16px; color: {YEL}; margin-top: 5px; text-align: right; letter-spacing: 0.03em">Our avenue, lunch hour.</div></div>'''

# ---------- menu ----------
colA = f'''<div style="position: absolute; left: 48px; top: {TOP}px; width: 288px">
  {head('Served all day', 'GRIDDLE')}
  {S('Bacon egg and cheese on a roll', 10)}
  {S('Harlem chicken and waffles')}
  {A('patty')}
  {head('12 and under', "KIDS' PLATES", 20)}
  {A('cheese', 10)}
  {A('frank')}</div>'''

card = f'''<div style="width: 250px; height: 132px; background: {INK}; border-radius: 10px; transform: rotate(-3deg); position: relative; overflow: hidden">
  <div style="position: absolute; left: 0; top: 0; width: 250px; height: 40px; background: {YEL}"></div>
  <div style="position: absolute; left: 14px; top: 8px; {TITAN}; font-size: 22px; line-height: 1; color: {INK}">PHONE CARD</div>
  <div style="position: absolute; right: 12px; top: 10px; width: 30px; height: 20px; border-radius: 4px; border: 2px solid {INK}"></div>
  <div style="position: absolute; left: 14px; top: 50px; {TITAN}; font-size: 30px; line-height: 1; color: {YEL}">30 MINUTES</div>
  <div style="position: absolute; left: 14px; top: 88px; width: 222px; {SANS}; font-weight: 700; font-size: 15px; line-height: 1.2; color: {PAPER}">Any pay phone in the city. Dial the number on the back.</div></div>'''

colB = f'''<div style="position: absolute; left: 360px; top: {TOP}px; width: 288px">
  {head('From our oven', 'BAKE CASE')}
  {S("Zeus's salted peanut caramel slab", 10)}
  {S('Crumb cake')}
  {head('Cold and hot', 'FOUNTAIN', 20)}
  {S('Water jug lemonade', 10)}
  <div style="display: flex; justify-content: space-between; margin-top: 12px; {SANS}; font-weight: 800; font-size: 20px; color: {INK}">
    <span>Egg Cream <span style="color: {RED}">75¢</span></span><span>Coffee <span style="color: {RED}">72¢</span></span></div>
  <div style="display: flex; align-items: center; gap: 14px; margin-top: 18px">
    {card}</div>
  <div style="{SANS}; font-size: 16px; line-height: 1.3; color: {MUTE}; margin-top: 10px">Red star under your plate? The phone card is yours.</div></div>'''

# ---------- map ----------
MS = 280 / 296
mx, my = 680, TOP + 70
pins = ''
for i, (x, y) in enumerate(LAY['stops']):
    pins += (f'<div style="position: absolute; left: {mx + x * MS - 13:.1f}px; top: {my + y * MS - 13:.1f}px; width: 26px; height: 26px; '
             f'border-radius: 13px; background: {RED}; border: 2px solid {INK}; box-sizing: border-box; display: flex; align-items: center; '
             f'justify-content: center; {TITAN}; font-size: 15px; line-height: 1; color: {PAPER}">{i + 1}</div>')
nx, ny = LAY['north']


def lab(t, x, y, size=14):
    return (f'<div style="position: absolute; left: {mx + x * MS:.0f}px; top: {my + y * MS:.0f}px; background: {PAPER}; padding: 0 3px; '
            f'{SANS}; font-weight: 800; font-size: {size}px; letter-spacing: 0.14em; color: {INK}; white-space: nowrap">{t}</div>')


labels = (lab('NEW JERSEY', 2, 18) + lab('HARLEM', 112, 52) + lab('MANHATTAN', 40, 306) + lab('QUEENS', 228, 300)
          + lab('BROOKLYN', 176, 400) + lab('BRONX', 238, 4)
          + f'<div style="position: absolute; left: {mx + nx * MS - 5:.0f}px; top: {my + ny * MS + 14:.0f}px; {TITAN}; font-size: 15px; color: {INK}">N</div>')

stops = ["Our counter, 138th and Amsterdam", "Cut through Central Park", "72nd Street and Broadway",
         "Down to Wall Street", "Tompkins Square, by the fountain", "Up to the Stadium in the Bronx"]
legend = ''.join(f'''<div style="display: flex; align-items: center; gap: 8px; margin-top: 4px">
  <div style="flex: none; width: 20px; height: 20px; border-radius: 10px; background: {RED}; display: flex; align-items: center; justify-content: center; {TITAN}; font-size: 14px; color: {PAPER}">{i + 1}</div>
  <div style="{SANS}; font-weight: 700; font-size: 16px; line-height: 1.2; color: {INK}">{t}</div></div>''' for i, t in enumerate(stops))

colMap = f'''<div style="position: absolute; left: 672px; top: {TOP}px; width: 296px">
  {head('Trace the cab, stop by stop', 'TAXI RACE!')}
</div>
<div style="position: absolute; left: {mx - 2}px; top: {my - 2}px; width: 280px; height: {497 * MS:.0f}px; border: 2px solid {INK}; line-height: 0">
  <img src="assets/map-run.png" alt="Map of Manhattan with the taxi race route" style="display: block; width: 280px; height: {497 * MS:.0f}px"></div>
{pins}{labels}
<div style="position: absolute; left: 672px; top: {my + 497 * MS + 8:.0f}px; width: 296px">{legend}</div>'''

# ---------- riddle panel ----------
slip = f'''<div style="background: {PAPER}; border: 2px solid {INK}; padding: 10px 14px 6px; transform: rotate(-1.5deg); margin-top: 14px">
  <div style="{TITAN}; font-size: 20px; line-height: 1.1; color: {RED}">3. FROM NEXT DOOR</div>
  <div style="{SANS}; font-size: 19px; line-height: 1.25; color: {INK}; margin-top: 4px">What has a face and two hands, but no arms and no legs? Bring me one that quit ticking.</div>
  <div style="display: flex; align-items: baseline; gap: 10px">
    <div style="{HAND}; font-size: 38px; line-height: 1.05; color: #22327a">Zeus</div>
    <div style="{SANS}; font-weight: 700; font-size: 15px; color: {MUTE}">Carver Electrical, radios and clocks</div></div></div>'''

panel = f'''<div style="position: absolute; left: 992px; top: {TOP - 12}px; width: 320px; height: {BOT - TOP + 14}px; background: {YEL}"></div>
<div style="position: absolute; left: 1010px; top: {TOP}px; width: 284px">
  <div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.16em; color: {INK}">SIMON SAYS: NO PEEKING</div>
  <div style="{TITAN}; font-size: 44px; line-height: 1; color: {INK}; margin-top: 2px">RIDDLE ME THIS!</div>
  <div style="{TITAN}; font-size: 20px; line-height: 1.1; color: {RED}; margin-top: 12px">1. THE FOUNTAIN JUGS</div>
  <div style="line-height: 0; margin-top: 6px; border: 2px solid {INK}; background: {PAPER}"><img src="assets/jugs.png" alt="A 5 gallon and a 3 gallon jug" style="display: block; width: 280px; height: 138px"></div>
  <div style="{SANS}; font-size: 19px; line-height: 1.25; color: {INK}; margin-top: 6px">A 5-gallon jug, a 3-gallon jug and a fountain. Measure out exactly 4 gallons.</div>
  <div style="{TITAN}; font-size: 20px; line-height: 1.1; color: {RED}; margin-top: 12px">2. GOING TO ST. IVES</div>
  <div style="{SANS}; font-size: 19px; line-height: 1.22; color: {INK}; margin-top: 4px">As I was going to St. Ives, I met a man with seven wives. Each wife had seven sacks, each sack had seven cats, each cat had seven kits. Kits, cats, sacks and wives: how many were going to St. Ives?</div>
  {slip}</div>'''

# jug labels over the painted jugs
jl = (f'<div style="position: absolute; left: 1046px; top: 0px"></div>')

footer = f'''<div style="position: absolute; left: 48px; top: 892px; width: 1248px; display: flex; justify-content: space-between; {SANS}; font-size: 16px; color: {MUTE}">
  <span>Prices subject to change. Placemat No. 354. Printed in U.S.A. 1995.</span>
  <span>Answers: 1. Fill 5, pour into 3, dump 3, pour 2 into 3, fill 5, top off 3. 2. One. 3. A clock.</span></div>'''

fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
        'background: radial-gradient(ellipse 82% 78% at 50% 54%, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 60%, rgba(150,135,100,0.22) 100%)"></div>')
grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
         f'height: {H}px; pointer-events: none; display: block; opacity: 0.6">')
face = (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
        f'{header}{colA}{colB}{colMap}{panel}{footer}{fade}{grain}</div>')

open(os.path.join(D, 'placemat.body.html'), 'w').write(face)
open(os.path.join(D, 'placemat.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Heights Corner Placemat</title>{LINK}'
    f'<style>body{{margin:0}}</style></head><body>{face}</body></html>')

json.dump({"fmt": "cityrun", "fn": "fmtCityrun", "faces": ["placemat.html"], "names": ["Kids' placemat"],
           "mm": [355.6, 254], "fonts": FONTS, "fams": ["Titan One", "Nunito Sans", "Reenie Beanie"],
           "phone": {"disp": "'Titan One',sans-serif", "title": "'Titan One',sans-serif", "name": "'Nunito Sans',sans-serif",
                     "body": "'Nunito Sans',sans-serif", "price": "'Nunito Sans',sans-serif", "note": "'Nunito Sans',sans-serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Die Hard with a Vengeance (1995)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'cityrun.labels.json'), 'w'), indent=1)
print('built')
