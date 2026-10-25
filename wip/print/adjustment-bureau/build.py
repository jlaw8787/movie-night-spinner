"""Builds the Norris for Senate election night reception card (The Adjustment Bureau, 2006).
6 x 9 in invitation card, printed two sides in two spot colours (campaign red and black)
on white coated card. No fold. Two tear-off drink tickets along the foot of the front.
Writes front.body.html / back.body.html (face markup) and front.html / back.html (full pages)."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 576, 864
TW = 232                    # drink ticket width
PAPER, RED, INK, GREY, RULE, PINK = '#f7f5f0', '#c4232f', '#222226', '#5d5f64', '#c9c6bf', '#f3dcdc'
FONTS = ('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800'
         '&family=Barlow:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap')
COND = "'Barlow Condensed', sans-serif"; SANS = "'Barlow', sans-serif"
M = 40                      # safe margin
CW = W - 2 * M              # 496

def grain(): return f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.35">'
def wear(n): return f'<img src="assets/wear-{n}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
def face(inner): return f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">{inner}</div>'

def dots_h(y, x0=0, x1=W, col='#a9a59c'):
    d = ''.join(f'<div style="position: absolute; left: {x}px; top: 0; width: 3px; height: 3px; border-radius: 50%; background: {col}"></div>'
                for x in range(x0 + 4, x1 - 4, 7))
    return f'<div style="position: absolute; left: 0; top: {y}px; width: {W}px; height: 3px">{d}</div>'

def dots_v(x, y0, y1, col='#a9a59c'):
    d = ''.join(f'<div style="position: absolute; left: 0; top: {y}px; width: 3px; height: 3px; border-radius: 50%; background: {col}"></div>'
                for y in range(0, y1 - y0, 7))
    return f'<div style="position: absolute; left: {x}px; top: {y0}px; width: 3px; height: {y1 - y0}px">{d}</div>'

# ---------------- FRONT ----------------
PROGRAM = [
    ('7:00 P.M.', 'Doors open. Cash bar and passed bites.'),
    ('9:00 P.M.', 'Election returns on the ballroom screens.'),
    ('11:00 P.M.', 'Late supper in the ballroom foyer.'),
    ('THE CALL', 'Remarks by Congressman David Norris.'),
]

def ticket(x):
    return (f'<div style="position: absolute; left: {x}px; top: 740px; width: {TW}px; height: 60px; border: 2px solid {RED}; box-sizing: border-box; text-align: center">'
            f'<div style="margin-top: 7px; font-family: {COND}; font-weight: 800; font-size: 27px; line-height: 1; letter-spacing: 0.08em; color: {RED}">ONE DRINK</div>'
            f'<div style="margin-top: 4px; font-family: {SANS}; font-weight: 500; font-size: 12px; letter-spacing: 0.03em; color: {INK}">AT THE CASH BAR, WITH OUR THANKS</div></div>')

def front():
    band = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 424px; background: {RED}"></div>'
            f'<div style="position: absolute; left: {M}px; top: 44px; width: {CW}px; color: #fff">'
            f'<div style="font-family: {COND}; font-weight: 700; font-size: 18px; letter-spacing: 0.26em">ELECTION NIGHT RECEPTION</div>'
            f'<div style="margin-top: 6px; font-family: {COND}; font-weight: 800; font-size: 164px; line-height: 0.86; letter-spacing: 0.01em; margin-left: -6px">NORRIS</div>'
            f'<div style="margin-top: 10px; font-family: {SANS}; font-weight: 500; font-style: italic; font-size: 27px; line-height: 1">for United States Senate</div></div>')
    photo = (f'<div style="position: absolute; left: {M}px; top: 276px; width: 200px; height: 254px; background: #fff; box-shadow: 0 3px 8px rgba(0,0,0,0.18)">'
             f'<img src="assets/candidate.jpg" alt="" style="position: absolute; left: 5px; top: 5px; width: 190px; height: 244px; display: block; object-fit: cover"></div>')
    when = (f'<div style="position: absolute; left: 268px; top: 282px; width: 268px; color: #fff">'
            f'<div style="font-family: {COND}; font-weight: 700; font-size: 28px; line-height: 1.05">Tuesday<br>November 7, 2006</div>'
            f'<div style="margin-top: 10px; font-family: {SANS}; font-size: 17px; line-height: 1.35">The Grand Ballroom, Mezzanine</div>'
            f'<div style="margin-top: 4px; font-family: {SANS}; font-weight: 600; font-size: 17px">Doors at 7 p.m.</div></div>')
    beside = (f'<div style="position: absolute; left: 268px; top: 442px; width: 268px; font-family: {SANS}; font-size: 16px; line-height: 1.38; color: {GREY}">'
              f'Thank you for every door you knocked on and every call you made. Tonight, we wait for the count together.</div>')
    rows = ''.join(
        f'<div style="display: flex; align-items: baseline; margin-top: {0 if i == 0 else 7}px">'
        f'<div style="width: 112px; flex: none; font-family: {COND}; font-weight: 700; font-size: 20px; letter-spacing: 0.04em; color: {RED}">{t}</div>'
        f'<div style="font-family: {SANS}; font-size: 17px; line-height: 1.3; color: {INK}">{d}</div></div>'
        for i, (t, d) in enumerate(PROGRAM))
    program = (f'<div style="position: absolute; left: {M}px; top: 550px; width: {CW}px">'
               f'<div style="font-family: {COND}; font-weight: 800; font-size: 22px; letter-spacing: 0.14em; color: {INK}">THE EVENING</div>'
               f'<div style="height: 3px; background: {RED}; margin: 5px 0 12px"></div>{rows}</div>')
    tear = (dots_h(728) + ticket(M) + ticket(W - M - TW) + dots_v(W // 2 - 1, 734, 804) +
            f'<div style="position: absolute; left: {M}px; top: 808px; width: {CW}px; text-align: center; font-family: {SANS}; font-size: 12px; letter-spacing: 0.04em; color: {GREY}">'
            f'Paid for by Norris for Senate</div>')
    return face(grain() + band + photo + when + beside + program + tear + wear('front'))

# ---------------- BACK ----------------
PASSED = [
    ('Honey-roasted nuts', 'Almonds, cashews and pecans glazed with butter, brown sugar and a pinch of cinnamon. Warm, in paper cones.'),
    ('Crostini with warm honey and thyme', 'Toasted baguette, whipped goat’s cheese, cracked black pepper.'),
    ('Smoked salmon on cucumber', 'Crème fraîche whipped with lemon, fresh dill, black pepper.'),
]
SUPPER = [
    ('Steak frites', 'Sirloin seared hard, rested and sliced, shallot and red wine butter melting over, double-fried potatoes.'),
    ('Molten chocolate cake', 'Baked to order. Set at the edges, soft in the centre.'),
]
BAR = [
    ('French 75', 'Gin, fresh lemon and sugar, topped with brut champagne.', '14.00'),
    ('Wine by the glass', 'Red or white.', '11.00'),
    ('Bottled beer', 'Domestic or imported.', '8.00'),
    ('Soft drinks', 'Cola, ginger ale, soda water.', '4.00'),
    ('Coffee and tea', 'With supper. Mind your shirt.', 'on us'),
]
NOTES = [
    'Hats, coats and umbrellas: cloakroom by the main doors.',
    'A private wedding is also in the hotel tonight. Please keep to the ballroom.',
    'No photographs at the bar, please.',
    'Questions on the night: Charlie Traynor.',
]

def head(t, sub, first=False):
    return (f'<div style="margin-top: {0 if first else 18}px; display: flex; justify-content: space-between; align-items: baseline">'
            f'<div style="font-family: {COND}; font-weight: 800; font-size: 22px; letter-spacing: 0.14em; color: {INK}">{t}</div>'
            f'<div style="font-family: {SANS}; font-style: italic; font-size: 14px; color: {GREY}">{sub}</div></div>'
            f'<div style="height: 3px; background: {RED}; margin: 4px 0 10px"></div>')

def item(n, d, p=None, first=False):
    pr = f'<span style="font-family: {COND}; font-weight: 700; font-size: 20px; color: {RED}; white-space: nowrap">{p}</span>' if p else ''
    return (f'<div style="margin-top: {0 if first else 9}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">'
            f'<h3 style="margin: 0; font-family: {COND}; font-weight: 700; font-size: 22px; line-height: 1.1; color: {INK}">{n}</h3>{pr}</div>'
            f'<p style="margin: 1px 0 0; font-family: {SANS}; font-size: 16px; line-height: 1.3; color: {GREY}; text-wrap: pretty">{d}</p></div>')

def bar_row(n, d, p, first=False):
    return (f'<div style="display: flex; align-items: baseline; gap: 10px; margin-top: {0 if first else 6}px">'
            f'<h3 style="margin: 0; flex: none; font-family: {COND}; font-weight: 700; font-size: 22px; line-height: 1.1; color: {INK}">{n}</h3>'
            f'<span style="flex: 1; font-family: {SANS}; font-size: 16px; color: {GREY}">{d}</span>'
            f'<span style="font-family: {COND}; font-weight: 700; font-size: 20px; color: {RED}">{p}</span></div>')

def cell(n, d, p):
    return (f'<div style="width: 232px; margin-top: 9px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
            f'<h3 style="margin: 0; font-family: {COND}; font-weight: 700; font-size: 21px; line-height: 1.1; color: {INK}">{n}</h3>'
            f'<span style="font-family: {COND}; font-weight: 700; font-size: 20px; color: {RED}; white-space: nowrap">{p}</span></div>'
            f'<div style="font-family: {SANS}; font-size: 15px; line-height: 1.3; color: {GREY}">{d}</div></div>')

def back():
    top = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 14px; background: {RED}"></div>'
           f'<div style="position: absolute; left: {M}px; top: 36px; width: {CW}px; display: flex; justify-content: space-between; align-items: flex-end">'
           f'<div style="font-family: {COND}; font-weight: 800; font-size: 50px; line-height: 0.85; color: {RED}">NORRIS</div>'
           f'<div style="text-align: right; font-family: {SANS}; font-size: 14px; line-height: 1.3; color: {GREY}">Election Night Reception<br>November 7, 2006</div></div>')
    fr = bar_row(*BAR[0][:1], BAR[0][1], BAR[0][2], first=True)
    passed = ''.join(item(n, d, first=(i == 0)) for i, (n, d) in enumerate(PASSED))
    supper = ''.join(item(n, d, first=(i == 0)) for i, (n, d) in enumerate(SUPPER))
    bar = item(*BAR[0], first=True) + '<div style="display: flex; flex-wrap: wrap; justify-content: space-between">' + ''.join(cell(n, d, p) for n, d, p in BAR[1:]) + '</div>'
    notes = ''.join(f'<div style="margin-top: {0 if i == 0 else 3}px; font-family: {SANS}; font-size: 14px; line-height: 1.3; color: {INK}">{t}</div>'
                    for i, t in enumerate(NOTES))
    body = (f'<div style="position: absolute; left: {M}px; top: 96px; width: {CW}px">'
            f'{head("PASSED ALL EVENING", "With the campaign’s compliments", True)}{passed}'
            f'{head("LATE SUPPER", "In the foyer from 11 p.m.")}{supper}'
            f'{head("CASH BAR", "Drink tickets welcome")}{bar}</div>')
    foot = (f'<div style="position: absolute; left: {M}px; bottom: 40px; width: {CW - 32}px; padding: 10px 16px; background: {PINK}">{notes}</div>')
    ring = f'<img src="assets/stain-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 418px; top: 380px; width: 172px; height: 172px; display: block">'
    return face(grain() + top + body + foot + ring + wear('back'))

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Norris election night reception, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
