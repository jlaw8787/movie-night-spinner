"""Builds the Pearl & Broad Pizzeria box lid (Inside Man, 2006).
The printed lid of the shop's 8 inch box: kraft corrugated board, two-colour flexo (red and black),
with the counter's order ticket taped on. One face, 8 x 8 in (768 px at 96 dpi).
Writes lid.body.html (face markup) and lid.html (full page)."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W = H = 768
KRAFT, RED, INK, TICKET, PEN = '#c49c69', '#a8231b', '#1d1916', '#f7f3ea', '#22305e'
FONTS = ('https://fonts.googleapis.com/css2?family=Yellowtail&family=Oswald:wght@500;600;700'
         '&family=Archivo+Narrow:ital,wght@0,400;0,500;0,700;1,400&family=Permanent+Marker&display=swap')
SCRIPT, CAPS, BODY, HAND = "'Yellowtail', cursive", "'Oswald', sans-serif", "'Archivo Narrow', sans-serif", "'Permanent Marker', cursive"

LEFT = [
  ('Pies and slices', [
    ('Cheese slice', None, '2.25'),
    ('Large cheese pie', None, '14.00'),
    ('Toppings, each', 'Pepperoni, sausage, mushroom, peppers, onion, anchovy.', '2.00'),
    ('Party pizzettes', 'Sixteen thin dough rounds, each with tomato, mozzarella and a slice of pepperoni, baked crisp underneath.', '9.00'),
  ]),
  ('From the counter', [
    ('Potato knishes', 'Mashed with onion cooked slow in butter and white pepper, rolled in puff pastry, baked golden. Hot mustard.', '2 for 3.92'),
    ('Garlic knots, six', None, '2.50'),
  ]),
]
RIGHT = [
  ('Heros', [
    ('Sirloin on ciabatta', 'Seared hard, rested and sliced thin, with onions cooked down jammy, arugula and horseradish cream. Bread toasted.', '8.95'),
  ]),
  ('Bakery case', [
    ('Rainbow cookies', 'Three almond layers, green, white and red, with apricot jam between and dark chocolate on top.', '1.00'),
  ]),
  ('Coffee bar', [
    ('Espresso fizz', 'A double shot floated over ice-cold tonic water and a slice of orange. Stir before you sip.', '3.50'),
    ('Espresso or cappuccino', None, '1.75 / 2.75'),
    ('Cans of soda', None, '1.25'),
  ]),
]

def at(x, y, w, extra=''):
    return f'position: absolute; left: {x}px; top: {y}px; width: {w}px; {extra}'

def head(t, first=False):
    return (f'<div style="display: flex; align-items: center; gap: 10px; margin: {0 if first else 15}px 0 7px">'
            f'<span style="font-family: {CAPS}; font-weight: 700; font-size: 17px; letter-spacing: 0.16em; text-transform: uppercase; color: {RED}; white-space: nowrap">{t}</span>'
            f'<span style="flex: 1; height: 2px; background: {RED}"></span></div>')

def item(n, d, p, first=False):
    big = d is not None and len(d) > 60
    return (f'<div style="margin-top: {0 if first else (9 if big else 5)}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
            f'<h3 style="margin: 0; font-family: {CAPS}; font-weight: {600 if big else 500}; font-size: {22 if big else 19}px; line-height: 1.1; text-transform: uppercase; letter-spacing: 0.01em; color: {INK}">{n}</h3>'
            f'<span style="font-family: {CAPS}; font-weight: 600; font-size: 19px; white-space: nowrap; color: {INK}">{p}</span></div>'
            + (f'<p style="margin: 2px 0 0; font-family: {BODY}; font-size: 16px; line-height: 1.28; color: {INK}; text-wrap: pretty">{d}</p>' if d else '')
            + '</div>')

def column(groups):
    out = ''
    for gi, (h, items) in enumerate(groups):
        out += head(h, gi == 0) + ''.join(item(*it, first=(i == 0)) for i, it in enumerate(items))
    return out

def layer(src, op=1):
    return (f'<img src="assets/{src}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; '
            f'object-fit: cover; pointer-events: none; display: block; opacity: {op}">')

def ticket():
    line = lambda lab, val, size=19, rot=-1: (
        f'<div style="display: flex; align-items: flex-end; gap: 6px; margin-top: 6px">'
        f'<span style="font-family: {BODY}; font-weight: 700; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: {RED}; white-space: nowrap; padding-bottom: 2px">{lab}</span>'
        f'<span style="position: relative; flex: 1; height: 22px; border-bottom: 1px solid #c9b9a6">'
        f'<span style="position: absolute; left: 3px; bottom: 0; font-family: {HAND}; font-size: {size}px; line-height: 1; color: {PEN}; white-space: nowrap; '
        f'transform: rotate({rot}deg); transform-origin: left bottom">{val}</span></span></div>')
    tape = (f'<div style="position: absolute; left: 62px; top: -11px; width: 74px; height: 22px; background: rgba(250,246,232,0.62); '
            f'border-left: 1px solid rgba(255,255,255,0.5); border-right: 1px solid rgba(255,255,255,0.5); transform: rotate(-3deg)"></div>')
    return (f'<div style="{at(542, 44, 184, "transform: rotate(3.2deg); transform-origin: center")}">'
            f'<div style="position: relative; background: {TICKET}; padding: 10px 12px 11px; box-shadow: 0 2px 5px rgba(40,24,8,0.35)">{tape}'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
            f'<span style="font-family: {CAPS}; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; color: {RED}">PEARL &amp; BROAD</span>'
            f'<span style="font-family: {BODY}; font-weight: 700; font-size: 12px; color: {RED}">No. 2214</span></div>'
            f'<div style="height: 1.5px; background: {RED}; margin-top: 3px"></div>'
            f'{line("For", "NYPD", 22, -2)}'
            f'{line("To", "bank, front door", 15, -1.5)}'
            f'{line("Order", "pies, assorted", 16, -1)}'
            f'{line("Taken by", "Stevie", 17, -2)}'
            f'<div style="margin-top: 7px; text-align: right; font-family: {HAND}; font-size: 20px; line-height: 1; color: {RED}; transform: rotate(-6deg)">PAID</div>'
            f'</div></div>')

def lid():
    frame = (f'<div style="position: absolute; left: 16px; top: 16px; width: {W - 32}px; height: {H - 32}px; box-sizing: border-box; border: 5px solid {RED}"></div>'
             f'<div style="position: absolute; left: 26px; top: 26px; width: {W - 52}px; height: {H - 52}px; box-sizing: border-box; border: 1.5px solid {INK}"></div>')
    mast = (f'<div style="{at(44, 40, 480)}">'
            f'<div style="font-family: {SCRIPT}; font-size: 78px; line-height: 1.12; color: {RED}; white-space: nowrap">Pearl &amp; Broad</div>'
            f'<div style="margin-top: -2px; font-family: {CAPS}; font-weight: 600; font-size: 17px; letter-spacing: 0.24em; color: {INK}">PIZZERIA &nbsp;·&nbsp; HEROS &nbsp;·&nbsp; BAKERY CASE</div>'
            f'<div style="margin-top: 3px; font-family: {BODY}; font-style: italic; font-size: 16px; color: {INK}">Pizza you can trust. Open 7 days, 10 am to 11 pm.</div></div>')
    band = (f'<div style="{at(27, 180, W - 54, f"height: 38px; background: {INK}; display: flex; align-items: center; justify-content: space-between; padding: 0 17px; box-sizing: border-box")}">'
            f'<span style="font-family: {CAPS}; font-weight: 600; font-size: 17px; letter-spacing: 0.1em; color: {KRAFT}">FREE DELIVERY &nbsp; (212) 555-0147</span>'
            f'</div>')
    cols = (f'<div style="{at(44, 236, 324)}">{column(LEFT)}</div>'
            f'<div style="position: absolute; left: 383px; top: 240px; width: 1.5px; height: 438px; background: {RED}; opacity: 0.8"></div>'
            f'<div style="{at(400, 236, 324)}">{column(RIGHT)}</div>')
    foot = (f'<div style="{at(44, 694, 680, "display: flex; justify-content: space-between; align-items: baseline")}">'
            f'<span style="font-family: {BODY}; font-weight: 500; font-size: 15px; color: {INK}">We&#8217;re always listening. Tell us how we did.</span>'
            f'<span style="font-family: {BODY}; font-weight: 500; font-size: 15px; color: {INK}">Italian and Albanian spoken.</span></div>')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {KRAFT}; color: {INK}">'
            f'{layer("kraft-paper.png")}{layer("paper-grain.png", 0.35)}'
            f'{frame}{mast}{band}{cols}{foot}'
            f'{layer("stain-grease.png")}{layer("wear-edges.png")}{ticket()}</div>')

FACES = {'lid': lid()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pearl &amp; Broad pizza box lid</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
