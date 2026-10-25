"""Builds the Docket Coffee Shop & Grill faxed specials sheet (16 Blocks, 2006).
A 24-hour coffee shop halfway between the precinct and the courts faxes its two-page menu
into the detective squad room every morning before the night tour goes home. The sergeant
has marked it up in red felt-tip and the squad has filled in the fax-back order form.
Two US Letter pages, portrait, single sided, no fold. Writes p1.html / p2.html (full pages),
p1.body.html / p2.body.html, film.json and sixteen.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
PAPER = '#f4f4f0'
INK = '#1a1a1a'
SOFT = '#3a3a3a'
RED = '#b8241c'
HIGH = 'rgba(246,232,60,0.62)'
FONTS = ('family=Archivo+Black&family=Arimo:ital,wght@0,400;0,700;1,400'
         '&family=Courier+Prime:wght@400;700&family=Kalam:wght@400;700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Archivo Black', 'Arial Black', sans-serif"
BODY = "'Arimo', Arial, sans-serif"
MONO = "'Courier Prime', 'Courier New', monospace"
HAND = "'Kalam', cursive"
PHONE_IN = '212 555 0116'
PHONE_FAX = '212 555 0117'

def esc(s): return s.replace('&', '&amp;')

def faxline(page):
    return (f'<div style="position: absolute; left: 48px; top: 42px; width: 720px; display: flex; justify-content: space-between; '
            f'font-family: {MONO}; font-size: 13px; line-height: 1; color: {SOFT}; white-space: nowrap">'
            f'<span>MAR-13-2006 07:42A</span><span>FROM:DOCKET COFFEE SHOP</span><span>{PHONE_IN.replace(" ", "")}</span>'
            f'<span>TO:{PHONE_FAX.replace(" ", "")}</span><span>P.0{page}/02</span></div>')

def head(t, sub=None, top=0):
    s = (f'<div style="margin-top: {top}px; background: {INK}; color: {PAPER}; padding: 7px 12px 6px; '
         f'font-family: {DISP}; font-size: 22px; line-height: 1.05; letter-spacing: 0.02em">{esc(t)}</div>')
    if sub:
        s += f'<div style="margin-top: 7px; font-style: italic; font-size: 16px; line-height: 1.3">{esc(sub)}</div>'
    return s

def item(name, desc, price, top=14, size=21, hl=False):
    nm = esc(name)
    if hl:
        nm = (f'<span style="position: relative; display: inline-block">'
              f'<span style="position: absolute; left: -6px; right: -8px; top: 3px; bottom: -2px; background: {HIGH}; transform: rotate(-0.8deg)"></span>'
              f'<span style="position: relative">{nm}</span></span>')
    d = f'<div style="margin-top: 4px; font-size: 16px; line-height: 1.34; color: {SOFT}; text-wrap: pretty">{esc(desc)}</div>' if desc else ''
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="font-weight: 700; font-size: {size}px; line-height: 1.15; text-transform: uppercase">{nm}</div>
        <div style="font-weight: 700; font-size: 19px; line-height: 1.1; white-space: nowrap">{price}</div></div>{d}</div>'''

def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.45; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')

def root(inner, face):
    # the whole transmission lands a hair off square, as faxes do
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {BODY}; color: {INK}">'
            f'<div style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; transform: rotate(0.18deg); transform-origin: 50% 0">{inner}</div>'
            f'{overlays(face)}</div>')

def hand(text, left, top, size=24, rot=-3, w=None, weight=700):
    ww = f' width: {w}px;' if w else ' white-space: nowrap;'
    return (f'<div style="position: absolute; left: {left}px; top: {top}px;{ww} font-family: {HAND}; font-weight: {weight}; '
            f'font-size: {size}px; line-height: 1.12; color: {RED}; transform: rotate({rot}deg); transform-origin: left top">{text}</div>')

# ---------------- PAGE 1 ----------------
p1 = f'''
{faxline(1)}
<div style="position: absolute; left: 48px; top: 70px; width: 520px">
  <div style="font-family: {DISP}; font-size: 104px; line-height: 0.92; letter-spacing: -0.01em">DOCKET</div>
  <div style="margin-top: 8px; font-weight: 700; font-size: 25px; line-height: 1; letter-spacing: 0.2em">COFFEE SHOP &amp; GRILL</div>
  <div style="margin-top: 12px; font-size: 17px; line-height: 1.32">Breakfast any time. Hot table, grill and fresh coffee, around the clock.</div>
</div>
<img src="assets/mug.png" alt="" style="position: absolute; left: 578px; top: 60px; width: 190px; height: 165px; display: block">
<div style="position: absolute; left: 48px; top: 246px; width: 720px; height: 46px; background: {INK}; color: {PAPER}; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box; padding: 0 18px; font-weight: 700; font-size: 17px; letter-spacing: 0.06em; white-space: nowrap">
  <span>OPEN 24 HOURS</span><span>FREE DELIVERY WITHIN 16 BLOCKS</span><span>{PHONE_IN}</span>
</div>

<div style="position: absolute; left: 48px; top: 314px; width: 720px; box-sizing: border-box; border: 3px dashed {INK}; padding: 18px 24px 22px">
  <div style="display: flex; align-items: baseline; justify-content: space-between">
    <div style="font-family: {DISP}; font-size: 34px; line-height: 1">TODAY&#39;S SPECIALS</div>
    <div style="font-weight: 700; font-size: 14px; letter-spacing: 0.14em">EAT IN, TAKE OUT, DELIVERED</div>
  </div>
  {item("Chopped Cheese Hero", "Ground beef and onions worked fine on the griddle, melted American folded through, then lettuce, tomato and mayo on a toasted roll.", "4.50", 16, 25, True)}
  <div style="display: flex; gap: 36px; margin-top: 4px">
    <div style="flex: 1">{item("Pan-Fried Pork Dumplings", "Crisp on the bottom, steamed on top. Soy, black vinegar and fresh ginger to dip. Six for 3.25, a dozen for 6.00.", "3.25", 16)}</div>
    <div style="flex: 1">{item("Salt & Vinegar Chicharrones", "Pork belly roasted slow, then blasted in a fierce oven until the skin shatters. Pickled onions and hot mustard. By the half pound.", "4.00", 16)}</div>
  </div>
</div>

<div style="position: absolute; left: 48px; top: 652px; width: 342px">
  {head("BREAKFAST", "Served all day and all night.")}
  {item("Bacon, Egg & Cheese", "Two eggs scrambled on the flat top with crisp strips and melted American, on a kaiser roll.", "2.75", 12)}
  {item("Buttered Roll", "Kaiser split and pressed on the flat top, crisp outside, soft in the middle.", "1.00")}
  {item("Two Eggs Any Style", "With home fries, toast and a cup of coffee.", "3.95")}
</div>
<div style="position: absolute; left: 426px; top: 652px; width: 342px">
  {head("FROM THE GRILL", "Ground fresh here every morning.")}
  {item("Cheeseburger Deluxe", "Six ounces of chuck, American, lettuce, tomato, pickle and fries.", "5.95", 12)}
  {item("Grilled Ham & Swiss", "On rye, pressed until it melts, with a cup of soup.", "4.25")}
</div>

<div style="position: absolute; left: 48px; top: 978px; width: 720px; border-top: 2px solid {INK}; padding-top: 9px; display: flex; justify-content: space-between; font-weight: 700; font-size: 13px; letter-spacing: 0.1em; white-space: nowrap">
  <span>SWEETS, DRINKS AND DELIVERY MAP ON PAGE 2</span><span>FAX ORDERS TO {PHONE_FAX}</span>
</div>
<img src="assets/hero.png" alt="" style="position: absolute; left: 430px; top: 893px; width: 150px; height: 70px; display: block">
{hand("Night tour, orders<br>in by 7:30!", 594, 880, 22, -3)}
{hand("Sarge", 694, 936, 21, -3)}
'''

# ---------------- PAGE 2 ----------------
X0, BW = 96, 32
MAP_L, MAP_T = 56, 722
nums = ''.join(
    f'<div style="position: absolute; left: {MAP_L + X0 + k * BW}px; top: {MAP_T + 190}px; width: {BW}px; text-align: center; '
    f'font-family: {MONO}; font-weight: 700; font-size: 13px; line-height: 1">{k + 1}</div>' for k in range(16))
here_x = MAP_L + X0 + 8 * BW
order_rows = [
    ('Nugent', '2 BEC on a roll, OJ', '7.50'),
    ('Mosley', 'large coffee, black (no Irish)', '1.00'),
    ('Desk', '12 dumplings, chicharrones', '10.00'),
    ('Bunker, holding', 'buttered roll, iced coffee', '2.75'),
]
rows = ''.join(
    f'<div style="display: flex; border-bottom: 1.5px solid {INK}; height: 50px; align-items: flex-end">'
    f'<div style="width: 104px; border-right: 1.5px solid {INK}; height: 100%; box-sizing: border-box; padding: 0 0 4px 6px; font-family: {HAND}; font-weight: 700; font-size: 19px; line-height: 1.1; color: {RED}; display: flex; align-items: flex-end">{esc(n)}</div>'
    f'<div style="flex: 1; border-right: 1.5px solid {INK}; height: 100%; box-sizing: border-box; padding: 0 0 4px 8px; font-family: {HAND}; font-size: 17px; line-height: 1.05; color: {RED}; display: flex; align-items: flex-end">{esc(o)}</div>'
    f'<div style="width: 56px; height: 100%; box-sizing: border-box; padding: 0 6px 4px 0; text-align: right; font-family: {HAND}; font-weight: 700; font-size: 19px; line-height: 1.1; color: {RED}; display: flex; align-items: flex-end; justify-content: flex-end">{a}</div></div>'
    for n, o, a in order_rows)

p2 = f'''
{faxline(2)}
<div style="position: absolute; left: 48px; top: 70px; width: 720px; display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 4px solid {INK}; padding-bottom: 10px">
  <div style="font-family: {DISP}; font-size: 40px; line-height: 1">DOCKET</div>
  <div style="font-weight: 700; font-size: 15px; letter-spacing: 0.12em; text-align: right; line-height: 1.35">COFFEE SHOP &amp; GRILL<br>OPEN 24 HOURS. {PHONE_IN}</div>
</div>

<div style="position: absolute; left: 48px; top: 148px; width: 384px">
  {head("SWEETS", "Baked here overnight, out by six.")}
  {item("Chocolate Birthday Cake", "Two rich cocoa layers, filled and frosted with dark buttercream.", "2.75", 12)}
  <div style="margin-top: 5px; display: flex; justify-content: space-between; font-weight: 700; font-size: 16px"><span>Whole 8 inch, serves ten</span><span>16.00</span></div>
  {item("Cheese Danish", "Flaky pastry folded round sweet farmer's curd.", "1.50")}
  {head("COFFEE & DRINKS", None, 26)}
  {item("Iced Coffee with Condensed Milk", "Brewed strong, poured over ice and a thick sweet spoonful from the can, stirred creamy. Pinch of cinnamon.", "1.75", 12)}
  {item("Coffee", "A fresh pot every hour, regular or black.", ".75 / 1.00")}
</div>

<div style="position: absolute; left: 464px; top: 148px; width: 304px">
  <div style="border: 3px solid {INK}; padding: 12px 16px 14px; display: flex; gap: 12px; align-items: center">
    <img src="assets/cake.png" alt="" style="width: 112px; height: 105px; display: block; flex: none">
    <div><div style="font-family: {DISP}; font-size: 19px; line-height: 1.08">BIRTHDAY CAKES TO ORDER</div>
    <div style="margin-top: 5px; font-size: 15px; line-height: 1.3">24 hours notice. Any name on top. Candles free.</div></div>
  </div>
  <div style="margin-top: 22px; font-family: {DISP}; font-size: 22px; line-height: 1">FAX-BACK ORDER</div>
  <div style="margin-top: 4px; font-size: 14px; line-height: 1.3">Fax by 7:30 A.M. for the 8 A.M. run.</div>
  <div style="margin-top: 8px; border: 1.5px solid {INK}; border-bottom: 0">
    <div style="display: flex; border-bottom: 1.5px solid {INK}; background: {INK}; color: {PAPER}; font-weight: 700; font-size: 12px; letter-spacing: 0.1em; line-height: 1">
      <div style="width: 104px; padding: 5px 6px; box-sizing: border-box">NAME</div><div style="flex: 1; padding: 5px 8px">ORDER</div><div style="width: 56px; padding: 5px 6px; box-sizing: border-box; text-align: right">$</div></div>
    {rows}
  </div>
  <div style="margin-top: 8px; display: flex; justify-content: flex-end; align-items: baseline; gap: 10px">
    <span style="font-weight: 700; font-size: 14px; letter-spacing: 0.1em">TOTAL</span>
    <span style="font-family: {HAND}; font-weight: 700; font-size: 22px; color: {RED}; border-bottom: 2px solid {RED}; line-height: 1.1">21.25</span>
  </div>
</div>

<div style="position: absolute; left: 48px; top: 664px; width: 720px">
  {head("WE DELIVER, PRECINCT TO THE COURTS")}
  <div style="margin-top: 7px; font-style: italic; font-size: 16px; line-height: 1.3">Hot at your door in ten minutes, anywhere on the avenue.</div>
</div>
<img src="assets/route-map.png" alt="" style="position: absolute; left: {MAP_L}px; top: {MAP_T}px; width: 704px; height: 232px; display: block">
<div style="position: absolute; left: {MAP_L + 8}px; top: {MAP_T + 216}px; width: 76px; text-align: center; font-weight: 700; font-size: 12px; letter-spacing: 0.08em">PRECINCT</div>
<div style="position: absolute; left: {MAP_L + 620}px; top: {MAP_T + 216}px; width: 76px; text-align: center; font-weight: 700; font-size: 12px; letter-spacing: 0.08em">COURTS</div>
{nums}
<div style="position: absolute; left: {here_x - 60}px; top: {MAP_T + 16}px; width: 120px; text-align: center">
  <div style="display: inline-block; background: {INK}; color: {PAPER}; font-weight: 700; font-size: 12px; letter-spacing: 0.08em; padding: 4px 8px; line-height: 1">WE ARE HERE</div>
</div>
<div style="position: absolute; left: {here_x - 9}px; top: {MAP_T + 109}px; width: 18px; height: 18px; border-radius: 50%; background: {INK}; border: 3px solid {PAPER}; box-sizing: border-box"></div>
<div style="position: absolute; left: {here_x - 1}px; top: {MAP_T + 34}px; width: 2px; height: 76px; background: {INK}"></div>
<img src="assets/route-pen.png" alt="" style="position: absolute; left: {MAP_L}px; top: {MAP_T}px; width: 704px; height: 232px; display: block">
{hand("8 A.M. run", MAP_L + 104, MAP_T + 18, 22, -4)}

<div style="position: absolute; left: 48px; top: 984px; width: 720px; border-top: 2px solid {INK}; padding-top: 9px; display: flex; justify-content: space-between; font-size: 13px; line-height: 1.35; font-weight: 700; letter-spacing: 0.04em; white-space: nowrap">
  <span>Sixteen blocks, door to door. Cash only, tax included.</span><span>Prices effective January 2006.</span>
</div>
'''

TITLES = {'p1': 'Docket Coffee Shop fax, page 1', 'p2': 'Docket Coffee Shop fax, page 2'}
for face, inner in (('p1', p1), ('p2', p2)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "sixteen", "fn": "fmtSixteen", "faces": ["p1.html", "p2.html"], "names": ["Page 1", "Page 2"],
        "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Archivo Black", "Arimo", "Courier Prime", "Kalam"],
        "phone": {"disp": "'Archivo Black',sans-serif", "title": "'Archivo Black',sans-serif", "name": "'Arimo',sans-serif",
                  "body": "'Arimo',sans-serif", "price": "'Arimo',sans-serif", "note": "'Arimo',sans-serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"16 Blocks (2006)": {
  "Salt and vinegar pork crackling": {"n": "Salt & Vinegar Chicharrones", "d": "Pork belly roasted slow, then blasted in a fierce oven until the skin puffs and shatters. Cut bite-size, with pickled onions and hot mustard.", "note": "From the hot table, per half pound."},
  "Chinatown dumplings": {"n": "Pan-Fried Pork Dumplings", "d": "Crisp on the bottom, steamed on top. Soy, black vinegar and fresh ginger to dip.", "note": "Six for 3.25, a dozen for 6.00."},
  "Chopped cheese": {"n": "Chopped Cheese Hero", "d": "Ground beef and onions worked fine on the griddle, melted American folded through, then lettuce, tomato and mayo on a toasted roll.", "note": "Today's special. Free delivery within 16 blocks."},
  "Eddie's birthday cake": {"n": "Chocolate Birthday Cake", "d": "Two rich cocoa layers, filled and frosted with dark buttercream.", "note": "Whole cakes, 24 hours notice. Candles free."},
  "Bodega iced coffee with condensed milk": {"n": "Iced Coffee with Condensed Milk", "d": "Brewed strong, poured over ice and a thick sweet spoonful from the can, stirred creamy. Pinch of cinnamon.", "note": "Fax by 7:30 for the 8 A.M. run."}
}}
open(os.path.join(D, 'sixteen.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
