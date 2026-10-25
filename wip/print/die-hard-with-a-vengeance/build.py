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
  "Bacon egg and cheese on a roll": ("Bacon, Egg & Cheese", "Crisp strips, fried yolk, American, on a toasted buttered kaiser.", "$1.95",
                                     "Ketchup on the side. Wrapped to go in a minute."),
  "Harlem chicken and waffles": ("Chicken & Waffles", "Buttermilk thighs fried crisp, butter and hot sauce honey.", "$5.55",
                                 "The house plate, served all day."),
  "Zeus's salted peanut caramel slab": ("Caramel Squares", "Brown sugar caramel, salted peanuts, milk chocolate, coarse salt.", "85¢",
                                        "Cut fresh at the counter every morning."),
  "Crumb cake": ("Crumb Cake", "Butter batter under cinnamon streusel, powdered sugar.", "$1.38",
                 "Ask for the corner piece."),
  "Water jug lemonade": ("Fresh Lemonade", "Squeezed lemons, sugar syrup, cold water, over ice.", "$1.00",
                         "By the jug for parties, 3 or 5 gallons."),
}
ADD = {
  'patty': ("Beef Patty", "Curried chuck and onion in golden turmeric pastry.", "$1.25"),
  'cheese': ("Raymond's Grilled Cheese", "American on white, griddled golden, pickle spear.", "$1.75"),
  'frank': ("Dexter's Hot Dog", "All-beef frank, toasted bun, potato chips.", "$1.50"),
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


TOP, BOT = 166, 880

# ---------- header band ----------
header = f'''
<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 142px; background: {INK}"></div>
<div style="position: absolute; left: 0; top: 142px; width: {W}px; height: 6px; background: {YEL}"></div>
<div style="position: absolute; left: 48px; top: 40px; width: 600px">
  <div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; color: {PAPER}">COFFEE SHOP, 138TH STREET AT AMSTERDAM</div>
  <div style="{TITAN}; font-size: 58px; line-height: 1; color: {YEL}; margin-top: 6px; white-space: nowrap; letter-spacing: 0.01em">HEIGHTS CORNER</div>
</div>
<div style="position: absolute; left: 666px; top: 38px; width: 290px">
  <div style="display: inline-block; background: {RED}; padding: 5px 12px 4px; transform: rotate(-2deg); border: 3px solid {PAPER}">
    <div style="{TITAN}; font-size: 21px; line-height: 1.05; color: {PAPER}; white-space: nowrap">KIDS' RIDDLE PLACEMAT</div></div>
  <div style="{SANS}; font-size: 16px; line-height: 1.3; color: {PAPER}; margin-top: 10px">Solve all three, win a lollipop.<br>Takeout orders: 555-0138</div></div>
<div style="position: absolute; left: 1000px; top: 22px; width: 288px">
  <div style="border: 4px solid {YEL}; line-height: 0"><img src="assets/still-avenue.jpg" alt="Amsterdam Avenue traffic at midday" style="display: block; width: 280px; height: 85px"></div>
  <div style="{SANS}; font-weight: 700; font-size: 16px; color: {YEL}; margin-top: 3px; text-align: right; letter-spacing: 0.03em">Our avenue, lunch hour.</div></div>'''

# ---------- menu ----------
colA = f'''<div style="position: absolute; left: 48px; top: {TOP}px; width: 306px">
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

colB = f'''<div style="position: absolute; left: 374px; top: {TOP}px; width: 306px">
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
MS = 272 / 296
mx, my = 702, TOP + 86
pins = ''
for i, (x, y) in enumerate(LAY['stops']):
    pins += (f'<div style="position: absolute; left: {mx + x * MS - 13:.1f}px; top: {my + y * MS - 13:.1f}px; width: 26px; height: 26px; '
             f'border-radius: 13px; background: {RED}; border: 2px solid {INK}; box-sizing: border-box; display: flex; align-items: center; '
             f'justify-content: center; {TITAN}; font-size: 15px; line-height: 1; color: {PAPER}">{i + 1}</div>')
nx, ny = LAY['north']


def lab(t, x, y, size=14):
    return (f'<div style="position: absolute; left: {mx + x * MS:.0f}px; top: {my + y * MS:.0f}px; background: {PAPER}; padding: 0 3px; '
            f'{SANS}; font-weight: 800; font-size: {size}px; letter-spacing: 0.14em; color: {INK}; white-space: nowrap">{t}</div>')


labels = (lab('NEW JERSEY', 2, 18) + lab('HARLEM', 112, 52) + lab('MANHATTAN', 30, 262) + lab('QUEENS', 228, 300)
          + lab('BROOKLYN', 176, 400) + lab('BRONX', 196, 4)
          + f'<div style="position: absolute; left: {mx + nx * MS - 5:.0f}px; top: {my + ny * MS + 14:.0f}px; {TITAN}; font-size: 15px; color: {INK}">N</div>')

stops = ["Our counter, 138th Street", "Cut through Central Park", "72nd Street and Broadway",
         "Down to Wall Street", "Tompkins Square fountain", "Up to the Stadium in the Bronx"]
legend = ''.join(f'''<div style="display: flex; align-items: center; gap: 8px; margin-top: 4px">
  <div style="flex: none; width: 20px; height: 20px; border-radius: 10px; background: {RED}; display: flex; align-items: center; justify-content: center; {TITAN}; font-size: 14px; color: {PAPER}">{i + 1}</div>
  <div style="{SANS}; font-weight: 700; font-size: 16px; line-height: 1.2; color: {INK}">{t}</div></div>''' for i, t in enumerate(stops))

colMap = f'''<div style="position: absolute; left: 700px; top: {TOP}px; width: 276px">
  {head('Trace the cab', 'TAXI RACE!')}
</div>
<div style="position: absolute; left: {mx - 2}px; top: {my - 2}px; width: 272px; height: {497 * MS:.0f}px; border: 2px solid {INK}; line-height: 0">
  <img src="assets/map-run.png" alt="Map of Manhattan with the taxi race route" style="display: block; width: 272px; height: {497 * MS:.0f}px"></div>
{pins}{labels}
<div style="position: absolute; left: 700px; top: {my + 497 * MS + 8:.0f}px; width: 276px">{legend}</div>'''

# ---------- riddle panel ----------
slip = f'''<div style="background: {PAPER}; border: 2px solid {INK}; padding: 10px 14px 6px; transform: rotate(-1.5deg); margin-top: 12px">
  <div style="{TITAN}; font-size: 20px; line-height: 1.1; color: {RED}">3. FROM NEXT DOOR</div>
  <div style="{SANS}; font-size: 19px; line-height: 1.25; color: {INK}; margin-top: 4px">What has a face and two hands, but no arms or legs? Bring me one that quit.</div>
  <div style="display: flex; align-items: baseline; gap: 10px">
    <div style="{HAND}; font-size: 38px; line-height: 1.05; color: #22327a">Zeus</div>
    <div style="{SANS}; font-weight: 700; font-size: 15px; color: {MUTE}">Carver Electrical</div></div></div>'''

panel = f'''<div style="position: absolute; left: 996px; top: {TOP - 10}px; width: 316px; height: {BOT - TOP + 10}px; background: {YEL}"></div>
<div style="position: absolute; left: 1014px; top: {TOP}px; width: 282px">
  <div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.16em; color: {INK}">SIMON SAYS: SOLVE!</div>
  <div style="{TITAN}; font-size: 44px; line-height: 1; color: {INK}; margin-top: 2px">RIDDLE ME THIS!</div>
  <div style="{TITAN}; font-size: 20px; line-height: 1.1; color: {RED}; margin-top: 12px">1. THE FOUNTAIN JUGS</div>
  <div style="position: relative; line-height: 0; margin-top: 6px; border: 2px solid {INK}; background: {PAPER}; height: 116px; overflow: hidden"><img src="assets/jugs.png" alt="A 5 gallon and a 3 gallon jug" style="display: block; width: 252px; height: 124px; margin-left: 14px; margin-top: -6px">
    <div style="position: absolute; left: 50px; top: 48px; {TITAN}; font-size: 18px; line-height: 1; color: {RED}">5 GAL.</div>
    <div style="position: absolute; left: 171px; top: 77px; {TITAN}; font-size: 14px; line-height: 1; color: {RED}">3 GAL.</div></div>
  <div style="{SANS}; font-size: 19px; line-height: 1.25; color: {INK}; margin-top: 6px">A 5-gallon jug, a 3-gallon jug and a fountain. Measure out exactly 4 gallons.</div>
  <div style="{TITAN}; font-size: 20px; line-height: 1.1; color: {RED}; margin-top: 12px">2. GOING TO ST. IVES</div>
  <div style="{SANS}; font-size: 19px; line-height: 1.22; color: {INK}; margin-top: 4px">As I was going to St. Ives, I met a man with seven wives. Each wife had seven sacks, each sack had seven cats, each cat had seven kits. Kits, cats, sacks and wives: how many were going to St. Ives?</div>
  {slip}</div>'''

# jug labels over the painted jugs
jl = (f'<div style="position: absolute; left: 1046px; top: 0px"></div>')

footer = f'''<div style="position: absolute; left: 48px; top: 898px; width: 1248px; display: flex; justify-content: space-between; {SANS}; font-size: 16px; color: {MUTE}">
  <span>Prices subject to change. Placemat No. 354. Printed in U.S.A. 1995.</span>
  <span>Answers: 1. Fill 5, pour into 3, empty 3, pour 2 in, fill 5, top off 3. 2. One. 3. A clock.</span></div>'''

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
