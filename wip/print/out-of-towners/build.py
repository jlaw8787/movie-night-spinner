"""Builds the Harbor & Hudson Railroad dining car card (The Out-of-Towners, 1970).
The card that sits on every dining car table on the Boston to New York run, the train
George and Gwen chase by cab after the flight is diverted to Boston. Heavy card stock,
7 x 11 in portrait, printed both sides, no fold. Front is the dining car, back the lounge car.
Writes front.html / back.html (full pages), the .body.html fragments, film.json and labels."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 672, 1056
PAPER = '#f4efe5'
INK = '#2b1d16'
SOFT = '#5a463a'
ORANGE = '#d2562a'
BROWN = '#4a2c1d'
CREAM = '#f6ecd9'
FONTS = 'family=Hanken+Grotesk:wght@400;500;600;700;800&family=Source+Serif+4:ital,wght@0,400;0,600;1,400'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
SANS = "'Hanken Grotesk', 'Helvetica Neue', Arial, sans-serif"
SERIF = "'Source Serif 4', Georgia, serif"


def esc(s): return s.replace('&', '&amp;')


def head(t, top=0, sub=None):
    s = (f'<div style="margin-top: {top}px; display: flex; align-items: center; gap: 12px">'
         f'<div style="width: 22px; height: 6px; background: {ORANGE}"></div>'
         f'<div style="font-family: {SANS}; font-weight: 700; font-size: 14px; letter-spacing: 0.2em; color: {ORANGE}; white-space: nowrap">{esc(t.upper())}</div>'
         f'<div style="flex: 1; height: 1.5px; background: {BROWN}; opacity: 0.55"></div></div>')
    if sub:
        s += f'<div style="margin-top: 6px; font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.3; color: {SOFT}">{esc(sub)}</div>'
    return s


def item(name, desc, price, top=16, big=False):
    fs = 28 if big else 24
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">'
            f'<div style="font-family: {SANS}; font-weight: 800; font-size: {fs}px; line-height: 1.1; letter-spacing: -0.01em">{esc(name)}</div>'
            f'<div style="font-family: {SANS}; font-weight: 700; font-size: 20px; line-height: 1.1; white-space: nowrap">{price}</div></div>'
            f'<div style="margin-top: 4px; font-family: {SERIF}; font-size: 16px; line-height: 1.38; color: {SOFT}; text-wrap: pretty">{esc(desc)}</div></div>')


def line(name, price, top=0, last=False):
    bb = '' if last else f'border-bottom: 1px dotted rgba(246,236,217,0.55);'
    return (f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; padding: 8px 0; {bb}">'
            f'<span style="font-family: {SANS}; font-weight: 600; font-size: 17px; line-height: 1.2">{esc(name)}</span>'
            f'<span style="font-family: {SANS}; font-weight: 700; font-size: 17px; line-height: 1.2">{price}</span></div>')


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.7; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {SERIF}; color: {INK}">{inner}{overlays(face)}</div>')


def mark(size, bg, fg):
    # the railroad's mark: an H built from two rails and a tie, in a rounded block
    b = round(size * 0.15); m = round(size * 0.22); h = size - 2 * m
    return (f'<div style="position: relative; width: {size}px; height: {size}px; background: {bg}; border-radius: 6px">'
            f'<div style="position: absolute; left: {m}px; top: {m}px; width: {b}px; height: {h}px; background: {fg}"></div>'
            f'<div style="position: absolute; left: {size - m - b}px; top: {m}px; width: {b}px; height: {h}px; background: {fg}"></div>'
            f'<div style="position: absolute; left: {m}px; top: {(size - b) // 2}px; width: {size - 2 * m}px; height: {b}px; background: {ORANGE}"></div>'
            f'</div>')


# ---------------- FRONT: the dining car ----------------
front = f'''
<div style="position: absolute; left: 0; top: 0; width: {FW}px; height: 176px; background: {ORANGE}"></div>
<div style="position: absolute; left: 0; top: 184px; width: {FW}px; height: 14px; background: {BROWN}"></div>
<div style="position: absolute; left: 48px; top: 48px; width: 576px; display: flex; justify-content: space-between; align-items: flex-start; color: {CREAM}">
  <div>
    <div style="font-family: {SANS}; font-weight: 700; font-size: 14px; letter-spacing: 0.26em">HARBOR &amp; HUDSON RAILROAD</div>
    <div style="margin-top: 8px; font-family: {SANS}; font-weight: 800; font-size: 72px; line-height: 0.95; letter-spacing: -0.03em">Dining Car</div>
  </div>
  {mark(78, BROWN, CREAM)}
</div>
<img src="assets/coast-train.png" alt="" style="position: absolute; left: 48px; top: 222px; width: 576px; height: 232px; display: block">
<div style="position: absolute; left: 48px; top: 468px; width: 576px; display: flex; justify-content: space-between; align-items: baseline; gap: 16px">
  <div style="font-family: {SERIF}; font-style: italic; font-size: 20px; line-height: 1.2">Fog at the airports? Take the train.</div>
  <div style="font-family: {SANS}; font-weight: 700; font-size: 13px; letter-spacing: 0.18em; white-space: nowrap">BOSTON TO NEW YORK</div>
</div>
<div style="position: absolute; left: 48px; top: 532px; width: 576px">
  {head("From the Grill", 0, "Served at all hours, breakfast through dinner.")}
  {item("Rib eye platter", "Seared to your liking and rested, two eggs fried as you like, crisp hash browns and buttered toast.", "5.25", 12, True)}
  {head("From the Pantry", 38)}
  {item("New York cheesecake", "Baked slow in a water bath, chilled overnight and topped with sliced strawberries.", ".85", 12)}
  {item("Shortbread fingers", "Baked pale and crisp, sandwiched in pairs with raspberry jam, powdered sugar over the top.", ".60", 20)}
</div>
<div style="position: absolute; left: 48px; top: 916px; width: 576px; border-top: 3px solid {BROWN}; padding-top: 12px; display: flex; gap: 28px; font-family: {SANS}; font-size: 15px; text-wrap: balance; line-height: 1.4; font-weight: 500">
  <div style="flex: 1"><span style="font-weight: 800">Seating is by call.</span> Please wait in your coach. Your name will be called in turn.</div>
  <div style="flex: 1"><span style="font-weight: 800">Please write your order</span> on the meal check. No spoken orders.</div>
</div>
'''

# ---------------- BACK: the lounge car ----------------
counter = [('Green olives, a dish', '.35'), ('Soda crackers', '.15'), ('Tonic water', '.35'), ('Clam juice cocktail', '.45'),
           ('Domestic beer', '.60'), ('Rye highball', '1.10'), ('Coffee, by the pot', '.30'), ('Hot tea', '.30'), ('Cold milk', '.30')]
clist = ''.join(line(n, p, last=(i == len(counter) - 1)) for i, (n, p) in enumerate(counter))

stations = ['Boston', 'Providence', 'New London', 'New Haven', 'Stamford', 'New York']
route = ''
n = len(stations)
for i, st in enumerate(stations):
    x = round(i * 576 / (n - 1))
    end = i in (0, n - 1)
    dot = 20 if end else 14
    route += (f'<div style="position: absolute; left: {x - dot // 2}px; top: {34 - dot // 2}px; width: {dot}px; height: {dot}px; border-radius: 50%; '
              f'background: {ORANGE if end else PAPER}; border: 3px solid {BROWN}; box-sizing: border-box"></div>')
    up = i % 2 == 1
    align = 'left' if i == 0 else ('right' if i == n - 1 else 'center')
    lx = 0 if i == 0 else (x - 140 if i == n - 1 else x - 70)
    lw = 140
    ty = 0 if up else 52
    if up:
        ty = -2
    route += (f'<div style="position: absolute; left: {lx}px; top: {ty if up else 52}px; width: {lw}px; text-align: {align}; '
              f'font-family: {SANS}; font-weight: {800 if end else 600}; font-size: {16 if end else 14}px; line-height: 1; letter-spacing: 0.04em">{esc(st)}</div>')
route_html = (f'<div style="position: relative; width: 576px; height: 76px">'
              f'<div style="position: absolute; left: 0; top: 31px; width: 576px; height: 6px; background: {BROWN}"></div>{route}</div>')

back = f'''
<div style="position: absolute; left: 0; top: 0; width: {FW}px; height: 128px; background: {BROWN}"></div>
<div style="position: absolute; left: 0; top: 136px; width: {FW}px; height: 10px; background: {ORANGE}"></div>
<div style="position: absolute; left: 48px; top: 44px; width: 576px; display: flex; justify-content: space-between; align-items: center; color: {CREAM}">
  <div style="font-family: {SANS}; font-weight: 800; font-size: 50px; line-height: 1; letter-spacing: -0.02em">Lounge Car</div>
  <div style="text-align: right; font-family: {SANS}; font-weight: 700; font-size: 13px; letter-spacing: 0.2em; line-height: 1.6">HARBOR &amp; HUDSON<br>RAILROAD</div>
</div>
<div style="position: absolute; left: 48px; top: 182px; width: 300px">
  {head("Snacks", 0)}
  {item("Cocktail franks", "Little franks glazed sticky with honey, mustard and brown sugar, on picks with pickled pearl onions.", "1.10", 12)}
  {item("Peanut butter sandwich", "Spread thick on white bread and cut corner to corner.", ".65", 20)}
  {head("From the Bar", 30)}
  {item("Martini", "Gin stirred very cold with dry vermouth, strained into a chilled glass, one green olive.", "1.25", 12)}
  {item("Tom Collins", "Gin, fresh lemon and sugar shaken, topped with soda over ice, an orange slice and a cherry.", "1.10", 20)}
</div>
<div style="position: absolute; left: 372px; top: 182px; width: 252px; background: {BROWN}; color: {CREAM}; box-sizing: border-box; padding: 20px 20px 12px">
  <div style="font-family: {SANS}; font-weight: 800; font-size: 24px; line-height: 1">At the Counter</div>
  <div style="margin-top: 6px; font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.3">Ask the attendant.</div>
  <div style="margin-top: 8px">{clist}</div>
</div>
<div style="position: absolute; left: 48px; top: 750px; width: 576px">
  {head("Your Route", 0)}
  <div style="margin-top: 18px">{route_html}</div>
</div>
<div style="position: absolute; left: 48px; top: 900px; width: 576px; border-top: 3px solid {BROWN}; padding-top: 12px; display: flex; gap: 28px; font-family: {SANS}; font-size: 15px; text-wrap: balance; line-height: 1.4; font-weight: 500">
  <div style="flex: 1"><span style="font-weight: 800">Special diets,</span> bland or salt free, are prepared on request. Ask the steward.</div>
  <div style="flex: 1"><span style="font-weight: 800">Comments welcome.</span> Please note your waiter&#39;s name and the car number.</div>
</div>
'''

TITLES = {'front': 'Harbor & Hudson dining car card, front', 'back': 'Harbor & Hudson dining car card, back'}
for face, inner in (('front', front), ('back', back)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "eventually", "fn": "fmtDinnerEventually", "faces": ["front.html", "back.html"], "names": ["Dining Car", "Lounge Car"],
        "mm": [177.8, 279.4], "fonts": FONTS, "fams": ["Hanken Grotesk", "Source Serif 4"],
        "phone": {"disp": "'Hanken Grotesk',sans-serif", "title": "'Hanken Grotesk',sans-serif", "name": "'Hanken Grotesk',sans-serif",
                  "body": "'Source Serif 4',serif", "price": "'Hanken Grotesk',sans-serif", "note": "'Source Serif 4',serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"The Out-of-Towners (1970)": {
  "Handbag shortbread fingers with jam": {"n": "Shortbread fingers", "d": "Baked pale and crisp, sandwiched in pairs with raspberry jam, powdered sugar over the top.", "note": "From the pantry, with coffee or tea."},
  "Diverted flight cocktail franks": {"n": "Cocktail franks", "d": "Little franks glazed sticky with honey, mustard and brown sugar, on picks with pickled pearl onions.", "note": "Lounge car snacks."},
  "Hotel rib eye breakfast": {"n": "Rib eye platter", "d": "Seared to your liking and rested, two eggs fried as you like, crisp hash browns and buttered toast.", "note": "From the grill, served at all hours."},
  "Waldorf cheesecake": {"n": "New York cheesecake", "d": "Baked slow in a water bath, chilled overnight and topped with sliced strawberries.", "note": "From the pantry, cut to order."},
  "Hotel bar martini": {"n": "Martini", "d": "Gin stirred very cold with dry vermouth, strained into a chilled glass, one green olive.", "note": "Fog at the airports? Take the train."}
}}
open(os.path.join(D, 'eventually.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
