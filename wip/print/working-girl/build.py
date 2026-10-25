"""The Whitehall Grill, at the South Ferry, New York, 1988 (Working Girl).
The grill's own two-sided luncheon and bar card (US Letter), burgundy and ferry orange on warm ivory stock,
built on the house style lock. Front: wordmark, the ferry still, the grill list, matchbook and guest check.
Back: starters, pastry cart, the long bar, the private room still, Tess's note and a reserved card.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, ORANGE, INK, MUTE = '#f3ebe1', '#4a1823', '#d0571f', '#2b1d1e', '#6b5751'
FONTS = ('https://fonts.googleapis.com/css2?family=Prata'
         '&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400'
         '&family=Caveat:wght@500;600&family=Mr+De+Haviland&display=swap')
DISP = "'Prata', serif"; BODY = "'Source Serif 4', serif"
HAND = "'Caveat', cursive"; SIGN = "'Mr De Haviland', cursive"
PENCIL = '#3d3f4a'
L, CW = 56, 704

def kicker(t, color=ORANGE, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def bar(t, size=40, side=''):
    """Section title: an orange tab with paper lettering, a burgundy rule running on to the right."""
    s = (f'<span style="margin-left: 14px; font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.18em; color: {DARK}; '
         f'text-transform: uppercase; white-space: nowrap">{side}</span>' if side else '')
    return (f'<div style="display: flex; align-items: center">'
            f'<div style="background: {ORANGE}; color: {PAPER}; font-family: {DISP}; font-size: {size}px; line-height: 1; '
            f'letter-spacing: 0.03em; text-transform: uppercase; padding: 9px 16px 7px; white-space: nowrap">{t}</div>'
            f'<div style="flex: 1; height: 2px; background: {DARK}; margin-left: 10px"></div>{s}</div>')

def item(name, price, desc, gap=14):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 28px; line-height: 1.15; color: {DARK}"><span>{name}</span><span style="color: {ORANGE}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.36; color: {INK}; margin-top: 2px; text-wrap: pretty">{desc}</div></div>')

def page(inner, n):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.32">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {DARK}"></div>'
            f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; height: 5px; background: {ORANGE}"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 10}px; width: {W}px; height: 10px; background: {DARK}"></div>'
            + inner +
            f'<img src="assets/wear-{n}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def matchbook(o, x, y):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 104px; height: 150px; background: {DARK}; '
             f'box-shadow: 0 2px 6px rgba(40,20,20,0.35); transform: rotate(-6deg); overflow: hidden">'
             f'<div style="position: absolute; left: 0; top: 14px; width: 104px; text-align: center; font-family: {DISP}; font-size: 14px; line-height: 1.05; color: {ORANGE}; letter-spacing: 0.02em">WHITEHALL</div>'
             f'<div style="position: absolute; left: 0; top: 38px; width: 104px; text-align: center; font-family: {DISP}; font-size: 28px; line-height: 1.05; color: {PAPER}">Grill</div>'
             f'<div style="position: absolute; left: 14px; top: 76px; width: 76px; height: 1px; background: {ORANGE}"></div>'
             f'<div style="position: absolute; left: 0; top: 82px; width: 104px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; line-height: 1.2; color: {PAPER}">Steaks, chops<br>and the boat</div>'
             f'<div style="position: absolute; left: 0; top: 120px; width: 104px; height: 30px; background: {ORANGE}"></div>'
             f'<div style="position: absolute; left: 0; top: 127px; width: 104px; height: 9px; background: repeating-linear-gradient(90deg, #7a4a34 0 2px, #4b2d22 2px 4px)"></div>'
             '</div>')

def guest_check(o, x, y):
    lines = [('Tbl 7, K. Parker', ''), ('1 sirloin salad', '12.50'), ('1 Manhattan', '4.50'), ('', ''), ('Total', '17.00')]
    rows = ''
    for i, (t, p) in enumerate(lines):
        rows += (f'<div style="position: absolute; left: 0; top: {56 + i * 28}px; width: 220px; height: 28px; border-bottom: 1px solid #c9b6a4"></div>'
                 f'<div style="position: absolute; left: 12px; top: {57 + i * 28}px; width: 196px; display: flex; justify-content: space-between; '
                 f'font-family: {HAND}; font-weight: 600; font-size: 22px; line-height: 1.15; color: {PENCIL}"><span>{t}</span><span>{p}</span></div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 220px; height: 236px; background: #fcf8f1; '
             f'box-shadow: 0 2px 7px rgba(40,25,20,0.30); transform: rotate(3.5deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 220px; height: 44px; border-bottom: 2px solid {DARK}; display: flex; '
             f'justify-content: space-between; align-items: center; padding: 0 12px; box-sizing: border-box; font-family: {BODY}; font-weight: 700; '
             f'font-size: 14px; letter-spacing: 0.08em; color: {DARK}; white-space: nowrap"><span>GUEST CHECK</span><span style="color: {ORANGE}">No. 1988</span></div>'
             + rows +
             f'<div style="position: absolute; left: 12px; top: 200px; font-family: {HAND}; font-weight: 600; font-size: 21px; line-height: 1.1; color: {ORANGE}; transform: rotate(-2deg)">bill to Petty Marsh</div>'
             '</div>')

def reserved(o, x, y):
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 112px; background: #fcf8f1; border-top: 6px solid {ORANGE}; '
             f'box-shadow: 0 2px 6px rgba(40,25,20,0.30); transform: rotate(-4deg); text-align: center">'
             f'<div style="font-family: {DISP}; font-size: 25px; letter-spacing: 0.12em; color: {DARK}; margin-top: 10px; line-height: 1">RESERVED</div>'
             f'<div style="height: 1px; background: {DARK}; opacity: 0.4; margin: 7px 22px 4px"></div>'
             f'<div style="font-family: {HAND}; font-weight: 600; font-size: 22px; line-height: 1.12; color: {PENCIL}">Mr. Trask, party of 6<br>1:00, private room</div>'
             '</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("At the South Ferry, New York")}{kicker("Est. 1931", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 3}px; top: 76px; width: {CW + 6}px; font-family: {DISP}; font-size: 67px; line-height: 1; '
             f'color: {DARK}; letter-spacing: 0.01em; white-space: nowrap">WHITEHALL GRILL</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 160px; width: {CW}px; display: flex; justify-content: space-between; align-items: baseline">'
             f'<span style="font-family: {BODY}; font-style: italic; font-size: 21px; color: {INK}">Luncheon, dinner and the long bar</span>'
             f'<span style="font-family: {BODY}; font-style: italic; font-size: 21px; color: {ORANGE}">A head for business? Try the steak.</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 196px; width: {CW}px; height: 3px; background: {DARK}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 218px; width: {CW}px; height: 320px; outline: 2px solid {ORANGE}; outline-offset: 5px; background: #ddd">'
             f'<img src="assets/still-ferry.jpg" alt="A commuter at the ferry rail, the downtown towers across the harbor" '
             f'style="display: block; width: {CW}px; height: 320px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 553px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 16px; color: {MUTE}">'
             f'<span>The boat from St. George docks across the street.</span><span>Luncheon 11:30 to 3</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 590px; width: {CW}px">'
             + bar('From the grill', 40, 'Monday to Friday')
             + item('Sliced sirloin salad', '12.50', 'Seared hard and carved thin over romaine, cherry tomatoes, red onion and crumbled blue cheese. Red wine vinaigrette.', 14)
             + item('Crab cakes', '13.75', 'A pair, bound with egg, mayonnaise, Dijon, parsley and crumbs, browned in butter. Lemon and tartar sauce.', 14)
             + item('Filet of sole', '14.25', 'Broiled with lemon butter and paprika. Rice pilaf, green beans almondine.', 14)
             + item('Chopped steak', '9.75', 'Ten ounces of ground sirloin under fried onions, with steak fries.', 14)
             + '</div>')
    matchbook(o, L - 4, 236)
    guest_check(o, L + CW - 214, 290)
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
COLW, GAP = 330, 44
X2 = L + COLW + GAP

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px">{kicker("Lunch, dinner and the long bar")}</div>')
    o.append(f'<div style="position: absolute; left: {L - 2}px; top: 78px; font-family: {DISP}; font-size: 68px; line-height: 1; color: {DARK}">THE MENU</div>')
    o.append(f'<div style="position: absolute; left: {L + 360}px; top: 86px; width: {CW - 360}px; text-align: right">'
             f'<div style="font-family: {DISP}; font-size: 34px; line-height: 1; color: {ORANGE}">Whitehall Grill</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {MUTE}; margin-top: 8px">At the foot of Whitehall Street</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 168px; width: {CW}px; height: 3px; background: {DARK}"></div>')
    col = lambda x, inner: f'<div style="position: absolute; left: {x}px; top: 192px; width: {COLW}px">{inner}</div>'
    left = (bar('To begin', 30)
            + item('Shrimp canapés', '7.50', 'Poached and chilled on thick cucumber rounds with Russian dressing and dill. Six to an order.')
            + item('Clam chowder', '3.25', 'Cream, potatoes, salt pork and littlenecks, with oyster crackers.')
            + f'<div style="height: 22px"></div>'
            + bar('The pastry cart', 30)
            + item('Vanilla layer cake', '3.75', 'Butter sponge split and spread with raspberry jam under Swiss meringue buttercream. Cut tall.')
            + item('Cheesecake', '3.95', 'Dense and rich, baked here every morning, with strawberries.'))
    right = (bar('The long bar', 30)
             + item('Manhattan', '4.50', 'Bourbon stirred cold with sweet vermouth and bitters, served up with a cherry.')
             + item('Dry martini', '4.50', 'Gin or vodka, a whisper of vermouth, olive or a twist.')
             + item('House wine', '3.50', 'Chablis, rosé or burgundy by the glass.')
             + f'<div style="margin-top: 22px; outline: 2px solid {ORANGE}; outline-offset: 4px">'
             f'<img src="assets/still-private-room.jpg" alt="Two diners at the long table in the private room" style="display: block; width: {COLW}px; height: 172px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.35; color: {MUTE}; margin-top: 12px">The private room upstairs. Deal lunches for twelve, 19.88 a head.</div>')
    o.append(col(L, left)); o.append(col(X2, right))
    # character note band, full width, with the reserved card on the right
    o.append(f'<div style="position: absolute; left: {L}px; top: 832px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 848px; width: 500px">'
             + kicker('A word from a regular') +
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.4; color: {INK}; margin-top: 10px">I read the Post, the Journal and the society pages on the boat. Big ideas turn up anywhere.</div>'
             f'<div style="font-family: {SIGN}; font-size: 44px; line-height: 1; color: {DARK}; margin-top: 0">Tess McGill</div></div>')
    reserved(o, L + CW - 204, 852)
    o.append(f'<div style="position: absolute; left: {L}px; top: 980px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 988px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             f'<span>Whitehall St., N.Y. 10004. (212) 555-1988.</span>'
             f'<span style="text-align: right">Prices subject to change. Form PM-88.</span></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Whitehall Grill menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
