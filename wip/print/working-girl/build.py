"""The Whitehall Grill, at the South Ferry, New York, 1988 (Working Girl).
The grill's oversized single luncheon sheet, one portrait face 960 x 1344 px (10 x 14 in), burgundy and ferry
orange on warm ivory stock. The top half is the hero photo (photo.py, NARA 549900, May 1973): a ferry crossing toward lower
Manhattan in the haze, with the wordmark in the sky, a snapshot of the private room and the reserved card
tucked over the water, and the matchbook on the far corner. The lower half is the menu.
Writes sheet.body.html and the full page sheet.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 960, 1344
PAPER, DARK, ORANGE, INK, MUTE = '#f3ebe1', '#4a1823', '#d0571f', '#2b1d1e', '#6b5751'
FONTS = ('https://fonts.googleapis.com/css2?family=Prata'
         '&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;0,8..60,700;1,8..60,400'
         '&family=Caveat:wght@500;600&family=Mr+De+Haviland&display=swap')
DISP = "'Prata', serif"; BODY = "'Source Serif 4', serif"
HAND = "'Caveat', cursive"; SIGN = "'Mr De Haviland', cursive"
PENCIL = '#3d3f4a'
M = 56
LW, RW = 486, 330
RX = W - M - RW                # 574

def kicker(t, color=ORANGE, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def title(k, t, size=38):
    return (kicker(k) + f'<div style="font-family: {DISP}; font-size: {size}px; line-height: 1.05; color: {DARK}; margin-top: 6px">{t}</div>'
            f'<div style="width: 64px; height: 3px; background: {ORANGE}; margin-top: 8px"></div>')

def item(name, price, desc, gap=14):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 27px; line-height: 1.15; color: {DARK}"><span>{name}</span><span style="color: {ORANGE}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.34; color: {INK}; margin-top: 2px; text-wrap: pretty">{desc}</div></div>')

def box(x, y, w, inner):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px">{inner}</div>'

def matchbook(x, y):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 104px; height: 150px; background: {DARK}; '
            f'box-shadow: 0 3px 8px rgba(30,20,20,0.40); transform: rotate(8deg); overflow: hidden">'
            f'<div style="position: absolute; left: 0; top: 14px; width: 104px; text-align: center; font-family: {DISP}; font-size: 14px; line-height: 1.05; color: {ORANGE}; letter-spacing: 0.02em">WHITEHALL</div>'
            f'<div style="position: absolute; left: 0; top: 34px; width: 104px; text-align: center; font-family: {DISP}; font-size: 28px; line-height: 1.05; color: {PAPER}">Grill</div>'
            f'<div style="position: absolute; left: 14px; top: 74px; width: 76px; height: 1px; background: {ORANGE}"></div>'
            f'<div style="position: absolute; left: 0; top: 80px; width: 104px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; line-height: 1.2; color: {PAPER}">Steaks, chops<br>and the boat</div>'
            f'<div style="position: absolute; left: 0; top: 120px; width: 104px; height: 30px; background: {ORANGE}"></div>'
            f'<div style="position: absolute; left: 0; top: 127px; width: 104px; height: 9px; background: repeating-linear-gradient(90deg, #7a4a34 0 2px, #4b2d22 2px 4px)"></div>'
            '</div>')

def reserved(x, y):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 112px; background: #fcf8f1; border-top: 6px solid {ORANGE}; '
            f'box-shadow: 0 3px 8px rgba(30,20,20,0.35); transform: rotate(-5deg); text-align: center">'
            f'<div style="font-family: {DISP}; font-size: 25px; letter-spacing: 0.12em; color: {DARK}; margin-top: 10px; line-height: 1">RESERVED</div>'
            f'<div style="height: 1px; background: {DARK}; opacity: 0.4; margin: 7px 22px 4px"></div>'
            f'<div style="font-family: {HAND}; font-weight: 600; font-size: 22px; line-height: 1.12; color: {PENCIL}">Mr. Trask, party of 6<br>1:00, private room</div>'
            '</div>')

def snapshot(x, y):
    """A print of the private room, white border, caption on the border."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 270px; padding: 8px 8px 0; background: #fbf8f2; '
            f'box-shadow: 0 3px 8px rgba(30,20,20,0.38); transform: rotate(-2.5deg)">'
            f'<img src="assets/still-private-room.jpg" alt="Two diners at the long table in the private room upstairs" style="display: block; width: 270px; height: 150px">'
            f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.25; color: {MUTE}; padding: 7px 2px 9px">The private room upstairs. Deal lunches, 19.88 a head.</div></div>')

def sheet():
    o = []
    # hero: painting, wordmark in the sky
    o.append(f'<img src="assets/ferry-hero.jpg" alt="Photograph, May 1973: a Staten Island ferry crossing the upper bay toward the hazy lower Manhattan skyline and the twin towers" '
             f'style="position: absolute; left: 0; top: 0; width: {W}px; height: 600px; display: block">')
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 14px; background: {DARK}"></div>'
             f'<div style="position: absolute; left: 0; top: 14px; width: {W}px; height: 4px; background: {ORANGE}"></div>'
             f'<div style="position: absolute; left: 0; top: 597px; width: {W}px; height: 3px; background: {ORANGE}"></div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 52px; width: {W - 2 * M}px; display: flex; justify-content: space-between">'
             f'{kicker("At the South Ferry, New York")}{kicker("Est. 1931 &middot; (212) 555-1988", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {M - 4}px; top: 78px; width: {W - 2 * M + 8}px; font-family: {DISP}; font-size: 80px; line-height: 1; '
             f'color: {DARK}; white-space: nowrap; letter-spacing: 0.005em">WHITEHALL GRILL</div>')
    o.append(f'<div style="position: absolute; left: {M}px; top: 176px; width: {W - 2 * M}px; display: flex; justify-content: space-between; align-items: baseline">'
             f'<span style="font-family: {BODY}; font-style: italic; font-size: 22px; color: {INK}">Luncheon, dinner and the long bar</span>'
             f'<span style="font-family: {BODY}; font-style: italic; font-size: 22px; color: {ORANGE}">A head for business? Try the steak.</span></div>')
    o.append(snapshot(M + 4, 408))
    o.append(reserved(M + 96, 330))
    o.append(matchbook(W - M - 116, 452))
    # menu, lower half
    TOP = 630
    o.append(box(M, TOP, LW, title('Luncheon, 11:30 to 3', 'From the Grill')
                 + item('Sliced sirloin salad', '12.50', 'Seared hard, carved thin over romaine, cherry tomatoes, red onion and blue cheese. Red wine vinaigrette.')
                 + item('Crab cakes', '13.75', 'A pair, bound with egg, mayonnaise, Dijon and crumbs, browned in butter. Lemon, tartar sauce.')
                 + item('Filet of sole', '14.25', 'Broiled in lemon butter, with rice pilaf and green beans almondine.')
                 + '<div style="height: 20px"></div>'
                 + title('After five', 'The Long Bar')
                 + item('Manhattan', '4.50', 'Bourbon stirred cold with sweet vermouth and bitters, served up with a cherry.')
                 + item('Dry martini', '4.50', 'Gin or vodka, olive or a twist.')))
    o.append(box(RX, TOP, RW, title('Before the steak', 'To Begin')
                 + item('Shrimp canapés', '7.50', 'Chilled, on cucumber rounds with Russian dressing and dill.')
                 + item('Clam chowder', '3.25', 'Cream, potatoes, salt pork and littlenecks. Oyster crackers.')
                 + '<div style="height: 20px"></div>'
                 + title('From the cart', 'Pastry')
                 + item('Vanilla layer cake', '3.75', 'Butter sponge, raspberry jam, Swiss meringue buttercream.')
))
    o.append(f'<div style="position: absolute; left: {RX}px; top: 1124px; width: {RW}px; height: 1px; background: {DARK}; opacity: 0.45"></div>')
    o.append(box(RX, 1136, RW, kicker('A word from a regular', ORANGE, ' font-size: 16px')
                 + f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.36; color: {INK}; margin-top: 8px">I read the Post, the Journal and the society pages on the boat. Big ideas turn up anywhere.</div>'
                 f'<div style="font-family: {SIGN}; font-size: 40px; line-height: 1; color: {DARK}">Tess McGill</div>'))
    o.append(box(RX, 1276, RW, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">Prices subject to change. Form PM-88.</div>'))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            + ''.join(o[:1]) +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.30">'
            + ''.join(o[1:]) +
            f'<img src="assets/wear-sheet.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

b = sheet()
open(os.path.join(D, 'sheet.body.html'), 'w').write(b)
open(os.path.join(D, 'sheet.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Whitehall Grill luncheon sheet</title>'
    f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
