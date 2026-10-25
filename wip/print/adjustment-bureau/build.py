"""Builds the Norris for Senate election night reception card (The Adjustment Bureau, 2006).
6 x 9 in card, 130 lb uncoated white cover, printed two sides in two spot inks
(campaign navy and campaign red) by a union campaign print shop. No fold.
Front: invitation, red halftone of the candidate, program, two numbered tear-off drink tickets.
Back: the passed bites and late supper, the cash bar, a county call-in tally for the
precinct captains, house notes and the printed "Paid for by" box with the union bug.
Writes front.body.html / back.body.html (face markup) and front.html / back.html (full pages)."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 576, 864
M = 40
CW = W - 2 * M
PAPER, NAVY, RED = '#f8f6f0', '#1d2a4e', '#c4222e'
FONTS = ('https://fonts.googleapis.com/css2?family=Antonio:wght@400;600;700'
         '&family=Crimson+Pro:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap')
GOTH = "'Antonio', sans-serif"
SERIF = "'Crimson Pro', serif"

def img(src, x, y, w, h, extra=''):
    return (f'<img src="assets/{src}" alt="" aria-hidden="true" style="position: absolute; left: {x}px; top: {y}px; '
            f'width: {w}px; height: {h}px; display: block{extra}">')

def grain(): return img('paper-grain.png', 0, 0, W, H, '; opacity: 0.30')
def wear(n): return img(f'wear-{n}.png', 0, 0, W, H)
def face(inner):
    return f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {NAVY}">{inner}</div>'

def box(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px{extra}">{inner}</div>'

# ---------------- FRONT ----------------
PROGRAM = [
    ('7 P.M.', 'Doors open. Passed bites and a cash bar.'),
    ('9 P.M.', 'Polls close. Returns on the ballroom screens.'),
    ('11 P.M.', 'Late supper in the ballroom foyer.'),
    ('The call', 'Remarks by Congressman David Norris.'),
]
TICKETS = ('0705', '0706')

def ticket(x, no):
    w = 236
    return (f'<div style="position: absolute; left: {x}px; top: 778px; width: {w}px; height: 52px; border: 1.5px solid {NAVY}; box-sizing: border-box">'
            f'<div style="position: absolute; left: 3px; top: 3px; right: 3px; bottom: 3px; border: 0.75px solid {NAVY}"></div>'
            f'<div style="position: absolute; left: 12px; top: 7px; font-family: {GOTH}; font-weight: 700; font-size: 22px; line-height: 1; letter-spacing: 0.05em; color: {NAVY}">ONE DRINK</div>'
            f'<div style="position: absolute; right: 12px; top: 9px; font-family: {GOTH}; font-weight: 600; font-size: 14px; line-height: 1; letter-spacing: 0.06em; color: {RED}">No. {no}</div>'
            f'<div style="position: absolute; left: 12px; top: 31px; font-family: {SERIF}; font-size: 13px; line-height: 1; color: {NAVY}">Good at the bar. Election night, Nov. 7, 2006</div></div>')

def front():
    panel = img('panel-front.png', 0, 0, W, 330)
    kicker = box(120, 41, 336, f'<div style="text-align: center; font-family: {GOTH}; font-weight: 600; font-size: 15px; line-height: 1; letter-spacing: 0.3em; color: {PAPER}">ELECTION NIGHT RECEPTION</div>')
    senate = box(M, 263, CW, f'<div style="text-align: center; font-family: {SERIF}; font-style: italic; font-weight: 500; font-size: 30px; line-height: 1; color: {PAPER}">for United States Senate</div>')
    # red halftone with a navy keyline that sits a hair off register
    photo = (img('photo-halftone.png', M, 350, 236, 288) +
             f'<div style="position: absolute; left: {M - 3}px; top: 346px; width: 242px; height: 294px; border: 1.5px solid {NAVY}; box-sizing: border-box"></div>' +
             box(M, 648, 236, f'<div style="font-family: {GOTH}; font-weight: 600; font-size: 14px; line-height: 1.2; letter-spacing: 0.08em; color: {NAVY}">CONGRESSMAN DAVID NORRIS</div>'
                 f'<div style="font-family: {SERIF}; font-style: italic; font-size: 14px; line-height: 1.3; color: {NAVY}">Brooklyn, New York</div>'))
    rows = ''.join(
        f'<div style="display: flex; align-items: baseline; margin-top: {0 if i == 0 else 8}px">'
        f'<div style="width: 64px; flex: none; font-family: {GOTH}; font-weight: 700; font-size: 17px; line-height: 1.15; letter-spacing: 0.02em; color: {RED}">{t.upper()}</div>'
        f'<div style="font-family: {SERIF}; font-size: 17px; line-height: 1.2; color: {NAVY}">{d}</div></div>'
        for i, (t, d) in enumerate(PROGRAM))
    right = box(296, 348, 240,
        f'<div style="font-family: {GOTH}; font-weight: 600; font-size: 15px; line-height: 1; letter-spacing: 0.22em; color: {RED}">TUESDAY</div>'
        f'<div style="margin-top: 5px; font-family: {GOTH}; font-weight: 700; font-size: 37px; line-height: 1; color: {NAVY}">November 7, 2006</div>'
        f'<div style="margin-top: 9px; font-family: {SERIF}; font-size: 18px; line-height: 1.25; color: {NAVY}">The Grand Ballroom, Mezzanine Level<br><b style="font-weight: 600">Doors open at 7 P.M.</b></div>'
        f'<div style="margin-top: 16px; height: 2px; background: {RED}"></div>'
        f'<div style="margin-top: 9px; margin-bottom: 9px; font-family: {GOTH}; font-weight: 700; font-size: 16px; line-height: 1; letter-spacing: 0.18em; color: {NAVY}">THE EVENING</div>'
        f'{rows}')
    thanks = box(M, 694, CW,
        f'<div style="text-align: center; font-family: {SERIF}; font-style: italic; font-size: 19px; line-height: 1.3; color: {NAVY}">'
        f'Thank you for every door you knocked on and every call you made.<br>Tonight we wait for the count together.</div>'
        f'<div style="margin-top: 6px; text-align: center; font-family: {GOTH}; font-weight: 600; font-size: 12px; line-height: 1; letter-spacing: 0.16em; color: {RED}">PLEASE SHOW THIS CARD AT THE BALLROOM DOORS</div>')
    tear = (img('perf-h.png', 0, 765, W, 6) + img('perf-v.png', W // 2 - 3, 768, 6, 96) +
            ticket(M, TICKETS[0]) + ticket(W - M - 236, TICKETS[1]))
    return face(grain() + panel + kicker + senate + photo + right + thanks + tear + wear('front'))

# ---------------- BACK ----------------
PASSED = [
    ('Warm roasted nuts', 'Almonds, cashews and pecans glazed with honey, butter, brown sugar and a pinch of cinnamon. In paper cones.'),
    ('Crostini with warm honey and thyme', 'Toasted baguette, whipped goat cheese, cracked black pepper.'),
    ('Smoked salmon on cucumber', 'Crème fraîche whipped with lemon, fresh dill, black pepper.'),
]
SUPPER = [
    ('Steak frites', 'Sirloin seared hard, rested and sliced, shallot and red wine butter melting over, double-fried potatoes.'),
    ('Molten chocolate cake', 'Baked to order. Set at the edges, soft in the center.'),
    ('Coffee and tea', 'Poured with supper. Mind your shirt.'),
]
BAR = [('Wine by the glass', 'red or white', '$11'), ('Bottled beer', 'domestic or imported', '$8'), ('Soft drinks', 'cola, ginger ale, club soda', '$4')]
COUNTIES = ['Kings', 'Queens', 'New York', 'Bronx', 'Richmond', 'Nassau', 'Suffolk', 'Westchester', 'Erie', 'Monroe']
NOTES = [
    'Hats and coats: the cloakroom by the main doors.',
    'A private wedding is in the hotel tonight. Please keep to the ballroom.',
    'No photographs at the bar, please.',
    'The volunteer bus back to Brooklyn leaves the side doors at 1 A.M.',
]

def head(t, sub=None, first=False):
    s = f'<div style="margin-top: 3px; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.2; color: {NAVY}">{sub}</div>' if sub else ''
    return (f'<div style="margin-top: {0 if first else 20}px; font-family: {GOTH}; font-weight: 700; font-size: 19px; line-height: 1; letter-spacing: 0.14em; color: {NAVY}">{t}</div>'
            f'<div style="height: 2px; background: {RED}; margin-top: 5px"></div>{s}<div style="height: 8px"></div>')

def item(n, d, first=False):
    return (f'<div style="margin-top: {0 if first else 10}px">'
            f'<h3 style="margin: 0; font-family: {GOTH}; font-weight: 600; font-size: 21px; line-height: 1.12; letter-spacing: 0.01em; color: {NAVY}">{n}</h3>'
            f'<p style="margin: 2px 0 0; font-family: {SERIF}; font-size: 17px; line-height: 1.2; color: {NAVY}; text-wrap: pretty">{d}</p></div>')

def tally():
    cols = [('COUNTY', 92, 'left'), ('PCTS. IN', 48, 'center'), ('NORRIS', 50, 'center'), ('OPP.', 46, 'center')]
    hdr = ''.join(f'<div style="width: {w}px; flex: none; box-sizing: border-box; padding: 0 4px; text-align: {a}; font-family: {GOTH}; font-weight: 700; font-size: 12px; line-height: 20px; letter-spacing: 0.06em; color: {PAPER}; border-left: {"0" if i == 0 else "1px solid " + PAPER}">{c}</div>'
                  for i, (c, w, a) in enumerate(cols))
    rows = ''
    for c in COUNTIES:
        cells = ''.join(f'<div style="width: {w}px; flex: none; height: 21px; box-sizing: border-box; border-left: {"0" if i == 0 else "1px solid " + NAVY}; padding: 0 5px; font-family: {SERIF}; font-size: 15px; line-height: 21px; color: {NAVY}">{c if i == 0 else ""}</div>'
                        for i, (_, w, a) in enumerate(cols))
        rows += f'<div style="display: flex; border-bottom: 1px solid {NAVY}">{cells}</div>'
    total = ''.join(f'<div style="width: {w}px; flex: none; height: 22px; box-sizing: border-box; border-left: {"0" if i == 0 else "1px solid " + NAVY}; padding: 0 5px; font-family: {GOTH}; font-weight: 700; font-size: 13px; line-height: 22px; letter-spacing: 0.06em; color: {RED}">{"STATEWIDE" if i == 0 else ""}</div>'
                    for i, (_, w, a) in enumerate(cols))
    return (f'<div style="border: 1.5px solid {NAVY}">'
            f'<div style="display: flex; background: {NAVY}">{hdr}</div>{rows}'
            f'<div style="display: flex; border-top: 1px solid {NAVY}">{total}</div></div>')

def back():
    panel = img('panel-back.png', 0, 0, W, 84)
    top = (box(M, 11, 300, f'<div style="font-family: {GOTH}; font-weight: 700; font-size: 34px; line-height: 1; letter-spacing: 0.04em; color: {PAPER}">NORRIS</div>') +
           box(W - M - 300, 33, 300, f'<div style="text-align: right; font-family: {GOTH}; font-weight: 600; font-size: 13px; line-height: 1; letter-spacing: 0.16em; color: {PAPER}">ELECTION NIGHT · NOVEMBER 7, 2006</div>'))
    passed = ''.join(item(n, d, i == 0) for i, (n, d) in enumerate(PASSED))
    supper = ''.join(item(n, d, i == 0) for i, (n, d) in enumerate(SUPPER))
    left = box(M, 104, 238, head('PASSED FROM 7 P.M.', 'With the campaign’s compliments', True) + passed +
               head('LATE SUPPER', 'In the ballroom foyer from 11 P.M.') + supper)
    bar_rows = ''.join(
        f'<div style="display: flex; align-items: baseline; margin-top: 7px">'
        f'<div style="flex: 1"><span style="font-family: {GOTH}; font-weight: 600; font-size: 19px; line-height: 1.1; color: {NAVY}">{n}</span>'
        f'<div style="font-family: {SERIF}; font-size: 15px; line-height: 1.15; color: {NAVY}">{d}</div></div>'
        f'<div style="font-family: {GOTH}; font-weight: 700; font-size: 19px; color: {RED}">{p}</div></div>' for n, d, p in BAR)
    bar = (head('THE BAR', 'Cash bar. Each ticket on the front of this card is good for one drink.', True) +
           f'<div style="display: flex; align-items: baseline"><h3 style="flex: 1; margin: 0; font-family: {GOTH}; font-weight: 600; font-size: 21px; line-height: 1.12; color: {NAVY}">French 75</h3>'
           f'<div style="font-family: {GOTH}; font-weight: 700; font-size: 19px; color: {RED}">$14</div></div>'
           f'<p style="margin: 2px 0 0; font-family: {SERIF}; font-size: 17px; line-height: 1.2; color: {NAVY}">Gin, fresh lemon and sugar, topped with brut champagne and a long twist.</p>'
           + bar_rows)
    calls = (head('CALL IN THE NUMBERS', 'Precinct captains: phone your counts to Charlie Traynor in the back office.') + tally())
    right = box(298, 104, 238, bar + calls)
    notes = ''.join(f'<div style="width: 228px; font-family: {SERIF}; font-size: 15px; line-height: 1.2; color: {NAVY}; margin-top: {0 if i < 2 else 6}px">{t}</div>'
                    for i, t in enumerate(NOTES))
    house = box(M, 704, CW,
        f'<div style="border-top: 2px solid {RED}; padding-top: 8px; display: flex; flex-wrap: wrap; justify-content: space-between">{notes}</div>')
    paid = (box(M, 792, 400, f'<div style="display: inline-block; border: 1px solid {NAVY}; padding: 5px 9px; font-family: {SERIF}; font-size: 13px; line-height: 1.15; color: {NAVY}">'
                f'Paid for by Norris for Senate. Contributions to Norris for Senate are not tax deductible.</div>') +
            img('union-bug.png', W - M - 64, 788, 64, 35))
    ring = img('stain-ring.png', 448, -60, 168, 168)
    return face(grain() + panel + top + left + right + house + paid + ring + wear('back'))

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Norris election night reception, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
