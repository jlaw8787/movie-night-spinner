"""The Whitehall Grill, at the South Ferry, New York, 1988 (Working Girl).
The grill's folded luncheon card, A4 landscape folded once (two faces, 1123 x 794 px each), burgundy and
ferry orange on warm ivory stock. Outside: back panel (the long bar, the private room, reserved card, fine
print) and the cover (wordmark over a painted ferry crossing toward the downtown towers). Inside: the menu
spread (the grill on the left with Tess's note and the matchbook; starters and the pastry cart on the right).
Writes outside.body.html / inside.body.html and full pages outside.html / inside.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1123, 794
P = 561                     # fold
PAPER, DARK, ORANGE, INK, MUTE = '#f3ebe1', '#4a1823', '#d0571f', '#2b1d1e', '#6b5751'
FONTS = ('https://fonts.googleapis.com/css2?family=Prata'
         '&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400'
         '&family=Caveat:wght@500;600&family=Mr+De+Haviland&display=swap')
DISP = "'Prata', serif"; BODY = "'Source Serif 4', serif"
HAND = "'Caveat', cursive"; SIGN = "'Mr De Haviland', cursive"
PENCIL = '#3d3f4a'
M = 48                      # margin inside each panel
CW = P - 2 * M              # 465

def kicker(t, color=ORANGE, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def title(k, t, size=44):
    """Section head: spaced kicker, a Prata title, a short orange stroke."""
    return (kicker(k) + f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1.05; color: {DARK}; margin-top: 8px">{t}</div>'
            f'<div style="width: 64px; height: 3px; background: {ORANGE}; margin-top: 10px"></div>')

def item(name, price, desc, gap=16):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 27px; line-height: 1.15; color: {DARK}"><span>{name}</span><span style="color: {ORANGE}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.36; color: {INK}; margin-top: 2px; text-wrap: pretty">{desc}</div></div>')

def page(inner, n):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.32">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 12px; background: {DARK}"></div>'
            f'<div style="position: absolute; left: 0; top: 12px; width: {W}px; height: 4px; background: {ORANGE}"></div>'
            + inner +
            f'<img src="assets/wear-{n}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            # soft fold
            f'<div style="position: absolute; left: {P - 6}px; top: 0; width: 12px; height: {H}px; '
            f'background: linear-gradient(90deg, rgba(90,60,40,0) 0%, rgba(90,60,40,0.10) 45%, rgba(255,250,240,0.22) 55%, rgba(90,60,40,0) 100%)"></div>'
            '</div>')

def box(x, y, w, inner):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px">{inner}</div>'

# ---------------- props ----------------
def matchbook(x, y):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 104px; height: 150px; background: {DARK}; '
            f'box-shadow: 0 2px 6px rgba(40,20,20,0.35); transform: rotate(7deg); overflow: hidden">'
            f'<div style="position: absolute; left: 0; top: 14px; width: 104px; text-align: center; font-family: {DISP}; font-size: 14px; line-height: 1.05; color: {ORANGE}; letter-spacing: 0.02em">WHITEHALL</div>'
            f'<div style="position: absolute; left: 0; top: 34px; width: 104px; text-align: center; font-family: {DISP}; font-size: 28px; line-height: 1.05; color: {PAPER}">Grill</div>'
            f'<div style="position: absolute; left: 14px; top: 74px; width: 76px; height: 1px; background: {ORANGE}"></div>'
            f'<div style="position: absolute; left: 0; top: 80px; width: 104px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; line-height: 1.2; color: {PAPER}">Steaks, chops<br>and the boat</div>'
            f'<div style="position: absolute; left: 0; top: 120px; width: 104px; height: 30px; background: {ORANGE}"></div>'
            f'<div style="position: absolute; left: 0; top: 127px; width: 104px; height: 9px; background: repeating-linear-gradient(90deg, #7a4a34 0 2px, #4b2d22 2px 4px)"></div>'
            '</div>')

def reserved(x, y):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 112px; background: #fcf8f1; border-top: 6px solid {ORANGE}; '
            f'box-shadow: 0 2px 6px rgba(40,25,20,0.30); transform: rotate(-4deg); text-align: center">'
            f'<div style="font-family: {DISP}; font-size: 25px; letter-spacing: 0.12em; color: {DARK}; margin-top: 10px; line-height: 1">RESERVED</div>'
            f'<div style="height: 1px; background: {DARK}; opacity: 0.4; margin: 7px 22px 4px"></div>'
            f'<div style="font-family: {HAND}; font-weight: 600; font-size: 22px; line-height: 1.12; color: {PENCIL}">Mr. Trask, party of 6<br>1:00, private room</div>'
            '</div>')

# ---------------- OUTSIDE: back panel | cover ----------------
def outside():
    o = []
    # back panel: the long bar
    o.append(box(M, 48, CW, title('After five, Monday to Friday', 'The Long Bar')
                 + item('Manhattan', '4.50', 'Bourbon stirred cold with sweet vermouth and bitters, served up with a cherry.', 14)
                 + item('Dry martini', '4.50', 'Gin or vodka, a whisper of vermouth, olive or a twist.', 14)
                 + item('House wine', '3.50', 'Chablis, rosé or burgundy by the glass.', 14)))
    o.append(f'<div style="position: absolute; left: {M}px; top: 452px; width: {CW}px; height: 186px; outline: 2px solid {ORANGE}; outline-offset: 4px; overflow: hidden">'
             f'<img src="assets/still-private-room.jpg" alt="Two diners at the long table in the private room" style="display: block; width: {CW}px; height: 200px; margin-top: -7px"></div>')
    o.append(box(M, 650, CW, f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.35; color: {MUTE}">'
                 'The private room upstairs. Deal lunches for twelve, 19.88 a head.</div>'))
    o.append(f'<div style="position: absolute; left: {M}px; top: 690px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.45"></div>')
    o.append(box(M, 702, CW, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.35; color: {MUTE}">'
                 'Whitehall St., N.Y. 10004. (212) 555-1988.<br>Prices subject to change. Form PM-88. Printed in U.S.A.</div>'))
    o.append(reserved(M + CW - 170, 506))
    # cover: wordmark over the painted harbor
    o.append(f'<img src="assets/ferry-cover.png" alt="Painting of an orange ferry crossing the bay toward the downtown towers on a hazy morning" '
             f'style="position: absolute; left: {P + 1}px; top: 250px; width: {W - P - 1}px; height: 544px; display: block">')
    o.append(f'<div style="position: absolute; left: {P}px; top: 46px; width: {W - P}px; text-align: center">'
             + kicker('At the South Ferry &middot; Est. 1931', ORANGE, ' font-size: 17px') +
             f'<div style="font-family: {DISP}; font-size: 68px; line-height: 0.98; color: {DARK}; margin-top: 20px; letter-spacing: 0.01em">WHITEHALL</div>'
             f'<div style="font-family: {DISP}; font-size: 68px; line-height: 1.02; color: {DARK}; letter-spacing: 0.22em; margin-left: 0.22em">GRILL</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 21px; color: {INK}; margin-top: 14px">Luncheon, dinner and the long bar</div>'
             '</div>')
    return page(''.join(o), 'outside')

# ---------------- INSIDE: the menu spread ----------------
def inside():
    o = []
    X2 = P + M
    o.append(box(M, 48, CW, title('Luncheon, 11:30 to 3', 'From the Grill')
                 + item('Sliced sirloin salad', '12.50', 'Seared hard and carved thin over romaine, cherry tomatoes, red onion and crumbled blue cheese. Red wine vinaigrette.', 14)
                 + item('Crab cakes', '13.75', 'A pair, bound with egg, mayonnaise, Dijon, parsley and crumbs, browned in butter. Lemon and tartar sauce.', 14)
                 + item('Filet of sole', '14.25', 'Broiled with lemon butter and paprika. Rice pilaf, green beans almondine.', 14)
                 + item('Chopped steak', '9.75', 'Ten ounces of ground sirloin under fried onions, with steak fries.', 14)))
    o.append(box(M, 604, 330, kicker('A word from a regular', ORANGE, ' font-size: 16px')
                 + f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.38; color: {INK}; margin-top: 8px">I read the Post, the Journal and the society pages on the boat. Big ideas turn up anywhere.</div>'
                 f'<div style="font-family: {SIGN}; font-size: 40px; line-height: 1; color: {DARK}; margin-top: 0">Tess McGill</div>'))
    o.append(matchbook(M + CW - 112, 596))
    o.append(box(X2, 48, CW, title('Six to an order, or a cup', 'To Begin')
                 + item('Shrimp canapés', '7.50', 'Poached and chilled on thick cucumber rounds with Russian dressing and dill. Six to an order.', 14)
                 + item('Clam chowder', '3.25', 'Cream, potatoes, salt pork and littlenecks, with oyster crackers.', 14)
                 + '<div style="height: 30px"></div>'
                 + title('Wheeled to your table', 'The Pastry Cart')
                 + item('Vanilla layer cake', '3.75', 'Butter sponge split and spread with raspberry jam under Swiss meringue buttercream. Cut tall.', 14)
                 + item('Cheesecake', '3.95', 'Dense and rich, baked here every morning, with strawberries.', 14)))
    o.append(box(X2, 690, CW, f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {ORANGE}">A head for business? Try the steak.</div>'))
    return page(''.join(o), 'inside')

FACES = {'outside': outside(), 'inside': inside()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Whitehall Grill menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
