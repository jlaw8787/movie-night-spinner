"""Builds the Pearl & Broad pizza box lid (Inside Man, 2006).
The printed lid of the shop's 8 inch box: kraft B-flute corrugate, two-ink flexo (red and black),
a stock-style steaming pie and skyline cut, with the counter's order ticket taped on.
One face, 8 x 8 in (768 px at 96 dpi). Writes lid.body.html (face markup) and lid.html (full page).
Run paint_assets.py first."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W = H = 768
KRAFT, RED, INK, TICKET, PEN = '#c29a66', '#b0241b', '#211b17', '#f6f2e8', '#24346a'
FONTS = ('https://fonts.googleapis.com/css2?family=Oleo+Script:wght@700&family=Rokkitt:wght@500;700;800'
         '&family=PT+Sans+Narrow:wght@400;700&family=Just+Another+Hand&display=swap')
SCRIPT, SLAB, BODY, HAND = "'Oleo Script', cursive", "'Rokkitt', serif", "'PT Sans Narrow', sans-serif", "'Just Another Hand', cursive"
SPREAD_R = 'text-shadow: 0 0 0.8px rgba(176,36,27,0.75)'
SPREAD_K = 'text-shadow: 0 0 0.7px rgba(33,27,23,0.7)'

LEFT = [
  ('Pies and slices', [
    ('Cheese slice', None, '2.25'),
    ('Sicilian square slice', None, '2.75'),
    ('Large cheese pie, 18 inch', None, '14.00'),
    ('Toppings, each', 'Pepperoni, sausage, mushroom, peppers, onion, anchovy.', '2.00'),
    ('Party pizzettes', 'Sixteen thin dough rounds with tomato, mozzarella and pepperoni, baked crisp underneath.', '9.00'),
  ]),
  ('From the counter', [
    ('Potato knishes', 'Onion slow-cooked in butter, white pepper, wrapped in flaky dough and baked. Hot mustard.', '2.25'),
    ('Garlic knots, six', None, '2.50'),
  ]),
]
RIGHT = [
  ('Heros', [
    ('Sirloin on ciabatta', 'Seared hard, sliced thin, with slow-cooked onions, arugula and horseradish cream on toasted bread.', '8.95'),
  ]),
  ('Bakery case', [
    ('Rainbow cookies', 'Three almond layers, green, white and red, apricot jam between, dark chocolate on top.', '1.00'),
  ]),
  ('Coffee bar', [
    ('Iced espresso soda', 'A double shot over ice, tonic water and an orange slice. Stir before you sip.', '3.50'),
    ('Espresso, cappuccino', None, '1.75, 2.75'),
    ('Cans of soda', None, '1.25'),
  ]),
]

def at(x, y, w, extra=''):
    return f'position: absolute; left: {x}px; top: {y}px; width: {w}px; {extra}'

def head(t, first=False):
    return (f'<div style="display: flex; align-items: center; gap: 9px; margin: {0 if first else 13}px 0 4px">'
            f'<span style="font-family: {SLAB}; font-weight: 800; font-size: 19px; line-height: 1.2; letter-spacing: 0.1em; text-transform: uppercase; color: {RED}; white-space: nowrap; {SPREAD_R}">{t}</span>'
            f'<span style="flex: 1; height: 3px; background: {RED}"></span></div>')

def item(n, d, p, first=False):
    big = d is not None and len(d) > 60
    return (f'<div style="margin-top: {0 if first else (6 if big else 3)}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
            f'<h3 style="margin: 0; font-family: {SLAB}; font-weight: {800 if big else 700}; font-size: {22 if big else 19}px; line-height: 1.12; text-transform: uppercase; color: {INK}; {SPREAD_K}">{n}</h3>'
            f'<span style="font-family: {SLAB}; font-weight: 800; font-size: {21 if big else 19}px; white-space: nowrap; color: {INK}; {SPREAD_K}">{p}</span></div>'
            + (f'<p style="margin: 1px 0 0; font-family: {BODY}; font-size: 16px; line-height: 1.24; color: {INK}; {SPREAD_K}">{d}</p>' if d else '')
            + '</div>')

def column(groups):
    out = ''
    for gi, (h, items) in enumerate(groups):
        out += head(h, gi == 0) + ''.join(item(*it, first=(i == 0)) for i, it in enumerate(items))
    return out

def layer(src, op=1):
    return (f'<img src="assets/{src}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; '
            f'pointer-events: none; display: block; opacity: {op}">')

def ticket():
    line = lambda lab, val, size=25, rot=-1: (
        f'<div style="display: flex; align-items: flex-end; gap: 6px; margin-top: 5px">'
        f'<span style="font-family: {BODY}; font-weight: 700; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: {RED}; white-space: nowrap; padding-bottom: 2px">{lab}</span>'
        f'<span style="position: relative; flex: 1; height: 22px; border-bottom: 1px solid #c9b9a6">'
        f'<span style="position: absolute; left: 3px; bottom: -3px; font-family: {HAND}; font-size: {size}px; line-height: 1; color: {PEN}; white-space: nowrap; '
        f'transform: rotate({rot}deg); transform-origin: left bottom">{val}</span></span></div>')
    tape = (f'<div style="position: absolute; left: 50px; top: -12px; width: 70px; height: 23px; background: rgba(250,246,232,0.6); '
            f'border-left: 1px solid rgba(255,255,255,0.5); border-right: 1px solid rgba(255,255,255,0.5); transform: rotate(-4deg)"></div>')
    return (f'<div style="{at(574, 42, 158, "transform: rotate(3.5deg); transform-origin: center")}">'
            f'<div style="position: relative; background: {TICKET}; padding: 9px 11px 9px; box-shadow: 0 2px 5px rgba(40,24,8,0.38)">{tape}'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
            f'<span style="font-family: {SLAB}; font-weight: 800; font-size: 13px; letter-spacing: 0.02em; color: {RED}; white-space: nowrap">GUEST CHECK</span>'
            f'<span style="font-family: {SLAB}; font-weight: 700; font-size: 13px; color: {RED}; white-space: nowrap">No. 392</span></div>'
            f'<div style="height: 1.5px; background: {RED}; margin-top: 2px"></div>'
            f'{line("For", "NYPD", 30, -2)}'
            f'{line("To", "bank, front door", 23, -1.5)}'
            f'{line("Order", "pies, assorted", 23, -1)}'
            f'{line("Taken by", "Stevie", 26, -2)}'
            f'<div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 6px">'
            f'<span style="font-family: {BODY}; font-size: 12px; color: {RED}">Pearl &amp; Broad</span>'
            f'<span style="font-family: {HAND}; font-size: 30px; line-height: 0.8; color: {RED}; transform: rotate(-7deg); display: inline-block">PAID</span></div>'
            f'</div></div>')

def lid():
    mast = (f'<div style="{at(46, 38, 260)}">'
            f'<div style="font-family: {SCRIPT}; font-weight: 700; font-size: 74px; line-height: 0.92; color: {RED}; white-space: nowrap; {SPREAD_R}">Pearl &amp;<br><span style="padding-left: 52px">Broad</span></div></div>'
            f'<div style="{at(46, 186, 330)}">'
            f'<div style="font-family: {SLAB}; font-weight: 800; font-size: 19px; letter-spacing: 0.16em; color: {INK}; white-space: nowrap; {SPREAD_K}">PIZZERIA &middot; HEROS &middot; BAKERY</div>'
            f'<div style="margin-top: 1px; font-family: {BODY}; font-weight: 700; font-size: 16px; color: {INK}; white-space: nowrap; {SPREAD_K}">Pizza you can trust. We&#8217;re always listening.</div></div>')
    hot = (f'<div style="{at(326, 50, 70, f"font-family: {SLAB}; font-weight: 800; font-size: 22px; letter-spacing: 0.08em; color: {RED}; {SPREAD_R}")}">HOT</div>'
           f'<div style="{at(486, 50, 90, f"font-family: {SLAB}; font-weight: 800; font-size: 22px; letter-spacing: 0.08em; color: {RED}; {SPREAD_R}")}">FRESH</div>'
           f'<div style="{at(320, 204, 240, f"text-align: center; font-family: {SCRIPT}; font-weight: 700; font-size: 20px; color: {RED}; {SPREAD_R}")}">Oven fresh to your door</div>')
    band = (f'<div style="{at(32, 292, W - 64, f"height: 28px; display: flex; align-items: center; justify-content: center; gap: 14px")}">'
            + ''.join(f'<span style="font-family: {SLAB}; font-weight: 800; font-size: 17px; letter-spacing: 0.08em; color: {KRAFT}; white-space: nowrap">{t}</span>'
                      for t in ('FREE DELIVERY', '&#9733;', '(212) 555-0147', '&#9733;', 'OPEN 7 DAYS, 10 AM TO 11 PM'))
            + '</div>')
    cols = (f'<div style="{at(46, 336, 322)}">{column(LEFT)}</div>'
            f'<div style="position: absolute; left: 383px; top: 340px; width: 2px; height: 346px; background: {RED}; opacity: 0.85"></div>'
            f'<div style="{at(400, 336, 322)}">{column(RIGHT)}</div>')
    foot = (f'<div style="{at(46, 697, 676, "display: flex; justify-content: space-between; align-items: baseline")}">'
            f'<span style="font-family: {BODY}; font-weight: 700; font-size: 15px; color: {INK}; {SPREAD_K}">Feeding a busload? Call ahead.</span>'
            f'<span style="font-family: {SLAB}; font-weight: 800; font-size: 16px; letter-spacing: 0.12em; color: {RED}; {SPREAD_R}">THANK YOU</span>'
            f'<span style="font-family: {BODY}; font-weight: 700; font-size: 15px; color: {INK}; {SPREAD_K}">Italian and Albanian spoken.</span></div>')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {KRAFT}; color: {INK}">'
            f'{layer("kraft-paper.png")}{layer("paper-grain.png", 0.3)}'
            f'{layer("flexo-black.png")}{layer("flexo-red.png")}'
            f'{mast}{hot}{band}{cols}{foot}'
            f'{layer("paper-washboard.png")}{layer("stain-grease.png")}{layer("wear-edges.png")}{ticket()}</div>')

FACES = {'lid': lid()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Pearl &amp; Broad pizza box lid</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
