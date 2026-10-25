"""The Heritage Club, Walnut Street, Philadelphia, December 1983.
The club Dining Room's bill of fare: one heavy card, two faces (US Letter), laid out as a formal
club bill of fare with centred courses and engraved rules, oxblood and orange spot on buff stock.
Front: the engraved club crest (crossed oranges over the one dollar wager), the Opening Bell and the
Reserved card. Back: the front hall still with the Wager Book slip, the Main Position, the Closing
Bell, the Members' Bar and the House Committee note.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, ORANGE, MUTE, CARD = '#efe2c8', '#4a1519', '#d9661c', '#6e4a3c', '#fbf6ea'
FONTS = ('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900'
         '&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Mrs+Saint+Delafield&family=Caveat:wght@500&display=swap')
DISP = "'Cinzel Decorative', serif"; BODY = "'Crimson Pro', serif"
SIG = "'Mrs Saint Delafield', cursive"; HAND = "'Caveat', cursive"
L, CW = 56, 704


def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'


def kicker(t, color=ORANGE):
    return (f'<div style="text-align: center; font-family: {BODY}; font-weight: 700; font-size: 19px; letter-spacing: 0.28em; color: {color}; '
            f'text-transform: uppercase; line-height: 1; white-space: nowrap">{t}</div>')


def rules(flex=True):
    """Engraved thick and thin rule pair."""
    return (f'<div style="{"flex: 1; " if flex else ""}min-width: 20px">'
            f'<div style="height: 3px; background: {DARK}"></div><div style="height: 3px"></div>'
            f'<div style="height: 1px; background: {DARK}"></div></div>')


def diamond(size=9, color=ORANGE):
    return f'<div style="width: {size}px; height: {size}px; background: {color}; transform: rotate(45deg); flex: none"></div>'


def course(t, size=40, gap=16):
    return (f'<div style="display: flex; align-items: center; gap: {gap}px">{rules()}{diamond()}'
            f'<div style="font-family: {DISP}; font-weight: 900; font-size: {size}px; line-height: 1.1; color: {DARK}; white-space: nowrap">{t}</div>'
            f'{diamond()}{rules()}</div>')


def item(name, price, desc, gap=14, note=None, size=29):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {ORANGE}; margin-top: 1px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px; text-align: center">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; line-height: 1.1; color: {DARK}">{name}'
            f'<span style="color: {ORANGE}; margin-left: 16px">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.3; color: {DARK}; margin-top: 3px">{desc}</div>{n}</div>')


def page(inner, name):
    border = (f'<div style="position: absolute; left: 22px; top: 22px; width: {W - 44}px; height: {H - 44}px; border: 3px solid {DARK}; box-sizing: border-box"></div>'
              f'<div style="position: absolute; left: 30px; top: 30px; width: {W - 60}px; height: {H - 60}px; border: 1px solid {DARK}; box-sizing: border-box"></div>')
    for x, y in ((22, 22), (W - 22, 22), (22, H - 22), (W - 22, H - 22)):
        border += (f'<div style="position: absolute; left: {x - 9}px; top: {y - 9}px; width: 18px; height: 18px; background: {PAPER}; '
                   f'border: 2px solid {DARK}; box-sizing: border-box; transform: rotate(45deg)"></div>'
                   f'<div style="position: absolute; left: {x - 3}px; top: {y - 3}px; width: 6px; height: 6px; background: {ORANGE}; transform: rotate(45deg)"></div>')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            + border + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.32">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


# ---------------- FRONT ----------------
def reserved(o, x, y):
    """Prop: the table card held for the Dukes every day at one."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 176px; height: 100px; background: {CARD}; '
             f'box-shadow: 0 3px 8px rgba(40,20,10,0.35); transform: rotate(5deg)">'
             f'<div style="position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; border: 2px solid {DARK}"></div>'
             f'<div style="position: absolute; left: 0; top: 14px; width: 176px; text-align: center; font-family: {DISP}; font-weight: 900; font-size: 21px; color: {DARK}">Reserved</div>'
             f'<div style="position: absolute; left: 0; top: 44px; width: 176px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.25; color: {DARK}">Messrs. R. &amp; M. Duke<br><span style="color: {ORANGE}">Table One, daily at one</span></div>'
             '</div>')


def front():
    o = []
    o.append(at(L, 56, CW, kicker('Walnut Street, Philadelphia')))
    o.append(at(188, 74, 440, '<img src="assets/crest.png" alt="Engraved club crest: two orange sprigs crossed over a one dollar bill, on a scroll reading Mutatis Mutandis" '
                'style="display: block; width: 440px; height: 440px">'))
    o.append(at(L, 508, CW, f'<div style="text-align: center; font-family: {DISP}; font-weight: 900; font-size: 58px; line-height: 1.05; color: {DARK}; white-space: nowrap">The Heritage Club</div>'))
    o.append(at(L + 90, 578, CW - 180, f'<div style="display: flex; align-items: center; gap: 16px">{rules()}'
                f'<div style="font-family: {DISP}; font-weight: 700; font-size: 26px; line-height: 1; color: {ORANGE}; white-space: nowrap">Bill of Fare</div>{rules()}</div>'))
    o.append(at(L, 614, CW, f'<div style="text-align: center; font-family: {BODY}; font-style: italic; font-size: 20px; color: {MUTE}">'
                'The Dining Room, Christmas week, 1983. Luncheon from noon, dinner from six.</div>'))
    o.append(at(L, 658, CW, course('The Opening Bell')
                + item('Devils on horseback', '4.50', 'Prunes stuffed with a whole almond, rolled in Lancaster bacon and baked crisp.', 14)
                + item('Snapper soup', '3.25', 'Philadelphia&rsquo;s own, dark and peppery, with sherry poured at the table.', 12)
                + item('Shrimp cocktail', '7.50', 'Six jumbo Gulf shrimp chilled on cracked ice, sharp red sauce and lemon.', 12)
                + item('Caesar salad', '3.75', 'Romaine, coddled egg, anchovy and Parmesan, dressed at your table.', 12)))
    reserved(o, 588, 330)
    return page(''.join(o), 'front')


# ---------------- BACK ----------------
def wager(o, x, y):
    """Prop: a torn slip from the club Wager Book."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 290px; height: 124px; background: {CARD}; '
             f'box-shadow: 0 3px 8px rgba(40,20,10,0.32); transform: rotate(-4deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 290px; height: 34px; border-bottom: 2px solid {DARK}; display: flex; justify-content: space-between; '
             f'align-items: center; padding: 0 12px; box-sizing: border-box; font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.16em; color: {DARK}">'
             f'<span>WAGER BOOK</span><span style="color: {ORANGE}">No. 1983</span></div>'
             + ''.join(f'<div style="position: absolute; left: 10px; right: 10px; top: {60 + i * 26}px; height: 1px; background: #c9b79a"></div>' for i in range(3))
             + f'<div style="position: absolute; left: 14px; top: 38px; width: 266px; font-family: {HAND}; font-weight: 500; font-size: 20px; line-height: 26px; color: #22305e">'
             f'R. Duke bets M. Duke<br>nature against nurture.<br>Stake: one dollar.</div>'
             f'<div style="position: absolute; left: 176px; top: 74px; border: 3px solid {ORANGE}; padding: 2px 8px; font-family: {BODY}; font-weight: 700; '
             f'font-size: 19px; letter-spacing: 0.12em; color: {ORANGE}; opacity: 0.85; transform: rotate(-10deg)">ENTERED</div>'
             '</div>')


def back():
    o = []
    o.append(at(L, 56, CW, kicker('The Heritage Club, dinner from six')))
    o.append(at(L, 82, CW, f'<div style="background: {CARD}; border: 2px solid {ORANGE}; padding: 5px">'
                '<img src="assets/still-hall.jpg" alt="Members and a guest in the club front hall" style="display: block; width: 690px; height: 214px"></div>'))
    o.append(at(L, 318, 420, f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {MUTE}">The front hall. Every guest is signed in by a member.</div>'))
    wager(o, 470, 232)
    o.append(at(L + 32, 384, CW - 64, course('The Main Position')
                + item('Roast prime rib of beef', '19.83', 'Standing rib, salted a day ahead, roasted slow and carved to order.<br>Natural juices, horseradish cream, browned potatoes.', 12,
                       'Ask for the end cut early.')
                + item('Crab cakes', '12.50', 'Lump blue crab, barely bound, browned in butter. Tartar sauce, lemon.', 12)
                + item('Dover sole', '16.75', 'Whole, browned in butter and boned at the table. Parsley potatoes.', 12)))
    half = 330
    o.append(at(L, 708, half, course('Closing Bell', 27, 8)
                + item('Orange butter cake', '3.50', 'Grated rind and juice in the batter, brushed warm with orange syrup.', 10, size=27)
                + item('Rice pudding', '2.75', 'Baked slow, vanilla bean, nutmeg.', 10, size=27)))
    o.append(at(L + CW // 2 - 1, 712, 2, '', f' height: 196px; background: {DARK}; opacity: 0.5'))
    o.append(at(L + CW - half, 708, half, course('Members&rsquo; Bar', 27, 8)
                + item('Mimosa', '3.75', 'Fresh-squeezed juice and chilled champagne, half and half.', 10, size=27)
                + item('Frozen screwdriver', '3.25', 'Vodka and orange juice whirled with ice. Never concentrate.', 10, size=27)))
    o.append(at(L, 940, CW, f'<div style="display: flex; align-items: center; justify-content: center; gap: 18px">'
                f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {DARK}; text-align: right; width: 400px">'
                f'<span style="color: {ORANGE}; font-weight: 700; letter-spacing: 0.16em; font-size: 16px">THE HOUSE COMMITTEE.</span> Members may wager on any subject, provided it is entered in the Book.</div>'
                f'<div style="font-family: {SIG}; font-size: 44px; line-height: 1; color: {DARK}; white-space: nowrap">Randolph Duke</div></div>'))
    o.append(at(L, 996, CW, f'<div style="text-align: center; font-family: {BODY}; font-size: 16px; color: {MUTE}">'
                'Prices subject to change. Private parties in the Harvard Room. Form HC-23, 1983.</div>'))
    return page(''.join(o), 'back')


FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Heritage Club bill of fare, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
