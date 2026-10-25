"""The Madison Oyster Room, Madison Avenue, New York, 1984.
The restaurant's own two-sided dinner card (US Letter) on shell-pink stock, deep sea teal and lobster coral.
Front: sign, the main room still, the raw bar. Back: entrees, desserts, the bar, Cape still, coat check and matchbook.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, CORAL, MUTE, CARD = '#f3e3d9', '#123d43', '#c4513a', '#4f5c5c', '#fdf8f3'
FONTS = ('https://fonts.googleapis.com/css2?family=Gloock&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400'
         '&family=Tenor+Sans&family=Mrs+Saint+Delafield&display=swap')
DISP = "'Gloock', serif"; BODY = "'Crimson Pro', serif"; CAPS = "'Tenor Sans', sans-serif"; SIG = "'Mrs Saint Delafield', cursive"
L, CW = 56, 704

def kicker(t, color=CORAL, extra=''):
    return f'<div style="font-family: {CAPS}; font-size: 18px; letter-spacing: 0.2em; color: {color}; text-transform: uppercase; line-height: 1; white-space: nowrap;{extra}">{t}</div>'

def bar(t, size=40):
    return (f'<div style="background: {DARK}; color: {PAPER}; font-family: {DISP}; font-size: {size}px; line-height: 1; letter-spacing: 0.04em; '
            f'text-transform: uppercase; padding: 9px 16px 8px">{t}</div>'
            f'<div style="height: 3px; background: {CORAL}; margin-top: 3px"></div>')

def item(name, price, desc, note='', gap=18):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.3; color: {CORAL}; margin-top: 2px">{note}</div>' if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 28px; line-height: 1.12; color: {DARK}">'
            f'<span>{name}</span><span style="color: {CORAL}; white-space: nowrap">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.32; color: {DARK}; margin-top: 3px">{desc}</div>{n}</div>')

def page(inner, face):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.28">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 12px; background: {DARK}"></div>'
            f'<div style="position: absolute; left: 0; top: 15px; width: {W}px; height: 3px; background: {CORAL}"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 12}px; width: {W}px; height: 12px; background: {DARK}"></div>'
            + inner +
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- FRONT ----------------
def reservation(o, x, y):
    """Prop: the reservation card, Allen's table, with his pencilled note."""
    row = lambda k, v, t: (f'<div style="position: absolute; left: 14px; top: {t}px; width: 206px; height: 28px; border-bottom: 1px solid #d9b8a8; display: flex; '
                           f'align-items: baseline; gap: 10px"><span style="font-family: {CAPS}; font-size: 14px; letter-spacing: 0.14em; color: {MUTE}; width: 54px">{k}</span>'
                           f'<span style="font-family: {BODY}; font-style: italic; font-size: 21px; color: #1d2f6b">{v}</span></div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 234px; height: 226px; background: {CARD}; '
             f'box-shadow: 0 2px 7px rgba(40,20,10,0.32); transform: rotate(3.5deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 234px; height: 38px; background: {DARK}; color: {PAPER}; font-family: {CAPS}; '
             f'font-size: 14px; letter-spacing: 0.2em; display: flex; align-items: center; justify-content: center">RESERVED</div>'
             + row('Name', 'Mr. Bauer', 48) + row('Party', 'Two', 78) + row('Time', '8:00, Thursday', 108) +
             f'<div style="position: absolute; left: 14px; top: 144px; width: 206px; font-family: {BODY}; font-style: italic; font-size: 19px; line-height: 1.2; color: #1d2f6b">Whatever the lady orders.</div>'
             f'<div style="position: absolute; left: 22px; top: 164px; font-family: {SIG}; font-size: 44px; line-height: 1.2; color: #1d2f6b">Allen Bauer</div>'
             '</div>')

def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Madison Ave. at 61st St.")}{kicker("Dinner", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 3}px; top: 66px; font-family: {DISP}; font-size: 72px; line-height: 1.05; color: {DARK}">The Madison</div>')
    o.append(f'<div style="position: absolute; left: {L + 420}px; top: 88px; width: {CW - 420}px; text-align: right; white-space: nowrap; font-family: {DISP}; font-size: 30px; '
             f'line-height: 1; letter-spacing: 0.03em; color: {CORAL}; text-transform: uppercase">Oyster Room</div>')
    o.append(f'<div style="position: absolute; left: {L + 460}px; top: 128px; width: {CW - 460}px; text-align: right">{kicker("New York", MUTE, " font-size: 16px")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 166px; width: {CW}px; height: 3px; background: {CORAL}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 186px; width: {CW}px; height: 372px; outline: 2px solid {CORAL}; outline-offset: 5px; overflow: hidden">'
             f'<img src="assets/still-main-room.jpg" alt="A diner in the main room by candlelight, a lobster on her plate" '
             f'style="display: block; width: {CW}px; height: 372px"></div>')
    reservation(o, L + CW - 256, 204)
    o.append(f'<div style="position: absolute; left: {L}px; top: 574px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 18px; color: {MUTE}">'
             f'<span>The main room. Lobster is cracked at your table on request.</span><span>Jackets, please. Tails optional.</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 610px; width: {CW}px">'
             + kicker('Opened to order all evening', CORAL, ' margin-bottom: 10px')
             + bar('The raw bar', 44)
             + item('Cape Cod oysters', '7.50', 'On crushed ice, shallot and red wine vinegar mignonette, cracked pepper.', 'Half a dozen, with lemon. Up from the Cape daily.', 14)
             + item('Jumbo shrimp cocktail', '8.50', 'Five poached and chilled, on ice with horseradish sauce and lemon.', '', 14)
             + item('New England clam chowder', '3.50', 'Quahogs, salt pork, potato and onion in a creamy broth, oyster crackers.', '', 14)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 994px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; color: {MUTE}">'
             f'<span>Please, no high notes near the glassware.</span><span>Entrees, desserts and the bar over.</span></div>')
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
LW, RW, GAP = 384, 280, 40
X2 = L + LW + GAP

def coatcheck(o, x, y):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 112px; height: 150px; background: {CORAL}; '
             f'box-shadow: 0 2px 6px rgba(40,20,10,0.3); transform: rotate(-6deg)">'
             f'<div style="position: absolute; left: 46px; top: 10px; width: 20px; height: 20px; border-radius: 10px; background: {PAPER}"></div>'
             f'<div style="position: absolute; left: 0; top: 40px; width: 112px; text-align: center; font-family: {CAPS}; font-size: 14px; letter-spacing: 0.18em; color: {CARD}">COAT<br>CHECK</div>'
             f'<div style="position: absolute; left: 10px; top: 84px; width: 92px; height: 1px; background: {CARD}; opacity: 0.7"></div>'
             f'<div style="position: absolute; left: 0; top: 92px; width: 112px; text-align: center; font-family: {DISP}; font-size: 38px; line-height: 1.1; color: {CARD}">1964</div>'
             f'<div style="position: absolute; left: 0; top: 128px; width: 112px; text-align: center; font-family: {CAPS}; font-size: 14px; letter-spacing: 0.06em; color: {CARD}">MADISON</div>'
             '</div>')

def matchbook(o, x, y):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 132px; height: 166px; background: {DARK}; '
             f'box-shadow: 0 2px 6px rgba(20,20,20,0.35); transform: rotate(5deg); overflow: hidden">'
             f'<div style="position: absolute; left: 8px; top: 8px; width: 112px; height: 124px; border: 2px solid {CORAL}"></div>'
             f'<div style="position: absolute; left: 0; top: 22px; width: 132px; text-align: center; font-family: {DISP}; font-size: 26px; line-height: 1.1; color: {PAPER}">The<br>Madison</div>'
             f'<div style="position: absolute; left: 0; top: 94px; width: 132px; text-align: center; font-family: {CAPS}; font-size: 14px; letter-spacing: 0.08em; color: {CORAL}">PLaza 8-1984</div>'
             f'<div style="position: absolute; left: 0; top: 142px; width: 132px; height: 44px; background: {PAPER}"></div>'
             f'<div style="position: absolute; left: 0; top: 150px; width: 132px; height: 12px; background: repeating-linear-gradient(90deg, #b9876e 0 3px, #8b5a46 3px 6px)"></div>'
             '</div>')

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("From 5:30 nightly")}{kicker("The Madison Oyster Room", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 2}px; top: 68px; font-family: {DISP}; font-size: 64px; line-height: 1.05; color: {DARK}; letter-spacing: 0.01em">THE MAIN ROOM</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 150px; width: {CW}px; height: 3px; background: {CORAL}"></div>')
    left = (bar('Entrees')
            + item('Whole boiled lobster', '19.84', 'About 1&frac34; lb from our tank, split, brushed with garlic butter and finished under the broiler. Drawn butter and lemon.', 'Most guests leave the shell.', 16)
            + item('Fish and chips', '11.50', 'Cod in a cold lager batter, thick potatoes done twice. Tartar sauce and lemon.', 'Served in a paper cone at the oyster bar.')
            + item('Broiled Boston scrod', '16.75', 'Young cod under buttered crumbs, with a baked potato and creamed spinach.')
            + '<div style="height: 22px"></div>'
            + bar('Desserts')
            + item('Blue sea gelatin', '3.25', 'Coconut cream set firm under a clear sea-blue layer, gummy fish on top.', '', 16)
            + item('Boston cream pie', '3.75', 'Sponge, vanilla custard, dark chocolate glaze.'))
    right = (f'<div style="outline: 2px solid {CORAL}; outline-offset: 4px; margin-top: 6px"><img src="assets/still-uptown.jpg" alt="A couple in evening clothes, the Midtown skyline behind them" '
             f'style="display: block; width: {RW}px; height: 176px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {MUTE}; margin-top: 12px">Two regulars, Midtown behind them.</div>'
             f'<div style="height: 22px"></div>'
             + bar('The bar')
             + item('Blue lagoon', '4.75', 'Vodka and blue cura&ccedil;ao over ice, topped with lemon-lime soda and a lemon wheel.', 'Must be 19 to order.', 16)
             + item('Champagne', '5.50', 'Dry French, by the glass.')
             + item('Coffee or espresso', '1.50', 'Cream on the side.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 172px; width: {LW}px">{left}</div>')
    o.append(f'<div style="position: absolute; left: {X2}px; top: 172px; width: {RW}px">{right}</div>')
    coatcheck(o, X2 + 6, 818)
    matchbook(o, X2 + 146, 806)
    o.append(f'<div style="position: absolute; left: {L}px; top: 990px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 998px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; color: {MUTE}">'
             f'<span>Fresh fish six days a week. 610 Madison Ave., N.Y. 10022. PLaza 8-1984.</span><span>Prices subject to change. 6/84</span></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Madison Oyster Room menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
