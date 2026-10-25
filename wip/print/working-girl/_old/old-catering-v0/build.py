"""Builds the Petty Marsh partners' dining room luncheon card (Working Girl, 1988).
4.25 x 11 in (US letter slit lengthwise), printed both sides, no fold.
Writes front.body.html / back.body.html (face markup) and front.html / back.html (full pages)."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 408, 1056
PAPER, GREEN, INK, SOFT, RULE, LEAD = '#f2eee2', '#1d4433', '#23271f', '#4a5047', '#9aa592', '#4f5157'
FONTS = ('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700'
         '&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Caveat:wght@500;600&display=swap')
SERIF = "'Libre Caslon Text', serif"; CAPS = "'Cinzel', serif"; HAND = "'Caveat', cursive"

# (section, [(name, description, price, ticked)])
FRONT = [
  ('To begin', [
    ('Manhattan clam chowder', 'Tomato broth with littlenecks, potato, celery and thyme. A cup is 2.25.', '3.00', False),
    ('Cold shrimp canapés', 'Poached, chilled and set on thick cucumber rounds with rosy cocktail mayonnaise and dill. Six pieces.', '5.75', False),
    ('Crab cakes', 'A pair, bound with mayonnaise, egg, Dijon, parsley and crumbs, browned in butter. Lemon, tartar sauce.', '7.50', True)]),
  ('Luncheon plates', [
    ('Sliced sirloin salad', 'Seared hard and cut thin over romaine, cherry tomatoes, red onion and blue cheese. Red wine vinaigrette.', '11.25', True),
    ('Chicken paillard', 'Pounded thin and grilled, with lemon, arugula and shaved Parmesan.', '9.75', False)]),
  ('From the pastry kitchen', [
    ('Vanilla layer cake', 'Butter sponge split and spread with raspberry jam, covered in Swiss meringue buttercream. Cut tall.', '3.25', False)]),
]
BAR = [
  ('Manhattan', 'Bourbon stirred cold with sweet vermouth and bitters, served up with a cherry.', '4.50'),
  ('Dry martini', 'Gin or vodka, an olive or a twist.', '4.50'),
  ('White wine spritzer', 'Chablis and club soda over ice.', '3.00'),
  ('Wine by the glass', 'Red Burgundy or white Chablis.', '3.75'),
  ('Sparkling water', 'Over ice, with a wedge of lime.', '1.25'),
  ('Coffee or tea', 'Regular or decaffeinated, refilled at the table.', '.85'),
]
NOTES = [
  'Luncheon is served from noon until half past two. Tables are held fifteen minutes.',
  'Secretaries may telephone orders for their principals before eleven.',
  'Jackets for gentlemen, please.',
  'Ski club sign-up closes Friday.',
  'Ferry times posted in the lobby.',
]

def seal(size=50):
    return (f'<div style="position: relative; width: {size}px; height: {size}px; margin: 0 auto; border: 1.5px solid {GREEN}; border-radius: 50%">'
            f'<div style="position: absolute; left: 3px; top: 3px; right: 3px; bottom: 3px; border: 0.75px solid {GREEN}; border-radius: 50%"></div>'
            f'<div style="position: absolute; left: 0; top: 0; width: {size}px; height: {size}px; line-height: {size}px; text-align: center; '
            f'font-family: {CAPS}; font-weight: 600; font-size: {round(size * 0.36)}px; letter-spacing: 0.02em; color: {GREEN}">PM</div></div>')

def rules(gap=3):
    return (f'<div style="height: 1.5px; background: {GREEN}"></div><div style="height: {gap}px"></div>'
            f'<div style="height: 0.75px; background: {GREEN}"></div>')

def head(t, first=False):
    return (f'<div style="margin: {0 if first else 20}px 0 9px; text-align: center">'
            f'<div style="font-family: {CAPS}; font-weight: 600; font-size: 13px; letter-spacing: 0.24em; color: {GREEN}">{t.upper()}</div>'
            f'<div style="width: 36px; height: 1px; background: {GREEN}; margin: 6px auto 0"></div></div>')

def item(n, d, p, tick=False, first=False, gap=13):
    t = (f'<img src="assets/pencil-tick.png" alt="" style="position: absolute; left: -34px; top: -2px; width: 30px; height: 25px; display: block">' if tick else '')
    return (f'<div style="position: relative; margin-top: {0 if first else gap}px">{t}'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
            f'<h3 style="margin: 0; font-family: {SERIF}; font-weight: 700; font-size: 19px; line-height: 1.15; color: {INK}">{n}</h3>'
            f'<span style="font-family: {SERIF}; font-size: 16px; white-space: nowrap; color: {GREEN}">{p}</span></div>'
            f'<p style="margin: 3px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.34; color: {SOFT}; text-wrap: pretty">{d}</p></div>')

def masthead(sub):
    return (f'{seal()}'
            f'<div style="margin-top: 10px; text-align: center; font-family: {CAPS}; font-weight: 700; font-size: 30px; letter-spacing: 0.16em; color: {GREEN}; line-height: 1">PETTY MARSH</div>'
            f'<div style="margin: 12px 0 0">{rules()}</div>'
            f'<div style="margin-top: 9px; text-align: center; font-family: {SERIF}; font-style: italic; font-size: 17px; color: {INK}">{sub}</div>')

def grain(): return f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: 0.55">'
def wear(n): return f'<img src="assets/wear-{n}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'

def front():
    body = ''
    for gi, (h, items) in enumerate(FRONT):
        body += head(h, gi == 0) + ''.join(item(*it, first=(i == 0)) for i, it in enumerate(items))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">{grain()}'
            f'<div style="position: absolute; left: 48px; top: 46px; width: 312px">'
            f'{masthead("The Partners’ Dining Room")}'
            f'<div style="margin-top: 16px; text-align: center; font-family: {CAPS}; font-weight: 600; font-size: 21px; letter-spacing: 0.3em; color: {INK}">LUNCHEON</div>'
            f'<div style="margin: 0 0 18px; text-align: center; font-family: {SERIF}; font-style: italic; font-size: 16px; color: {SOFT}">Served from noon</div>'
            f'{body}</div>'
            f'<div style="position: absolute; left: 48px; bottom: 44px; width: 312px">{rules(2)}'
            f'<p style="margin: 9px 0 0; text-align: center; font-family: {SERIF}; font-style: italic; font-size: 14px; line-height: 1.35; color: {SOFT}">'
            f'Members may sign. Guest checks are charged to the department.</p></div>'
            f'{wear("front")}</div>')

def field(label, value, w=None, rot=-1.5):
    return (f'<div style="display: flex; align-items: flex-end; gap: 8px; margin-top: 12px; {"width: %dpx" % w if w else "flex: 1"}">'
            f'<span style="font-family: {CAPS}; font-weight: 600; font-size: 12px; letter-spacing: 0.12em; color: {GREEN}; white-space: nowrap; padding-bottom: 3px">{label}</span>'
            f'<span style="position: relative; flex: 1; height: 26px; border-bottom: 0.75px solid {RULE}">'
            f'<span style="position: absolute; left: 4px; bottom: -1px; font-family: {HAND}; font-weight: 500; font-size: 23px; line-height: 1; color: {LEAD}; '
            f'white-space: nowrap; transform: rotate({rot}deg); transform-origin: left bottom">{value}</span></span></div>')

def back():
    bar = ''.join(item(n, d, p, first=(i == 0), gap=11) for i, (n, d, p) in enumerate(BAR))
    notes = ''.join(f'<p style="margin: {0 if i == 0 else 7}px 0 0; font-family: {SERIF}; font-size: 15px; line-height: 1.34; color: {SOFT}; text-wrap: pretty">{t}</p>'
                    for i, t in enumerate(NOTES))
    perf = ''.join(f'<div style="position: absolute; left: {x}px; top: 0; width: 3px; height: 3px; border-radius: 50%; background: #b9b29e"></div>'
                   for x in range(10, W - 10, 8))
    slip = (f'<div style="position: absolute; left: 0; top: 770px; width: {W}px; height: 3px">{perf}</div>'
            f'<div style="position: absolute; left: 0; top: 777px; width: {W}px; text-align: center; font-family: {SERIF}; font-style: italic; font-size: 12px; color: {SOFT}">'
            f'Detach and hand to your captain</div>'
            f'<div style="position: absolute; left: 48px; top: 804px; width: 312px">'
            f'<div style="text-align: center; font-family: {CAPS}; font-weight: 700; font-size: 15px; letter-spacing: 0.22em; color: {GREEN}">LUNCHEON ORDER</div>'
            f'{field("Member", "K. Parker", rot=-1.2)}'
            f'{field("Department", "Mergers &amp; Acq.", rot=-0.8)}'
            f'<div style="display: flex; gap: 18px">{field("Party of", "2", 140, 0)}{field("Time", "1:00", None, 0)}</div>'
            f'{field("Order", "sirloin salad, crab cakes", rot=-0.6)}'
            f'<div style="margin-top: 12px; display: flex; justify-content: space-between; font-family: {SERIF}; font-size: 12px; color: {SOFT}">'
            f'<span>Office Services</span><span>Form DR-4, Rev. 1/88</span></div></div>')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">{grain()}'
            f'<img src="assets/stain-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 236px; top: -64px; width: 210px; height: 210px; display: block">'
            f'<div style="position: absolute; left: 48px; top: 46px; width: 312px">'
            f'<div style="text-align: center; font-family: {CAPS}; font-weight: 700; font-size: 17px; letter-spacing: 0.2em; color: {GREEN}">PETTY MARSH</div>'
            f'<div style="margin: 8px 0 20px">{rules(2)}</div>'
            f'{head("From the bar", True)}{bar}'
            f'{head("Dining room notes")}{notes}</div>'
            f'{slip}{wear("back")}</div>')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Petty Marsh luncheon, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
