"""The Heritage Club, Walnut Street, Philadelphia, December 1983.
The club Dining Room's two-sided bill of fare (US Letter) on buff club stock, oxblood and an orange
spot ink, built on the house style lock. Front: the club's name, the front hall still, the Opening
Bell. Back: the Main Position, the Closing Bell, the Members' Bar, the founder's portrait, the
House Committee's note, a Wager Book slip and a bar chit.
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


def kicker(t, color=ORANGE, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 19px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1; white-space: nowrap;{extra}">{t}</div>')


def band(t, width, size=40):
    """Section title: an oxblood band with an orange hairline inside, paper lettering."""
    return (f'<div style="position: relative; width: {width}px; height: {size + 26}px; background: {DARK}">'
            f'<div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border: 1px solid {ORANGE}"></div>'
            f'<div style="position: absolute; left: 20px; top: 0; height: {size + 26}px; display: flex; align-items: center; font-family: {DISP}; '
            f'font-weight: 900; font-size: {size}px; line-height: 1; color: {PAPER}; letter-spacing: 0.01em; white-space: nowrap">{t}</div></div>')


def item(name, price, desc, gap=20, note=None):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {ORANGE}; margin-top: 2px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 29px; line-height: 1.1; color: {DARK}"><span>{name}</span><span>{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.3; color: {DARK}; margin-top: 3px">{desc}</div>{n}</div>')


def rule(m='22px 0'):
    return f'<div style="height: 1px; background: {DARK}; opacity: 0.45; margin: {m}"></div>'


def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            + inner +
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.32">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


def frame(src, alt, w, h):
    return (f'<div style="background: {CARD}; border: 2px solid {ORANGE}; padding: 5px; width: {w}px">'
            f'<img src="{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')


# ---------------- FRONT ----------------
def reserved(o, x, y):
    """Prop: the brass-edged table card held for the Dukes every day at one."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 184px; height: 100px; background: {CARD}; '
             f'box-shadow: 0 3px 8px rgba(40,20,10,0.35); transform: rotate(-3deg)">'
             f'<div style="position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; border: 2px solid {DARK}"></div>'
             f'<div style="position: absolute; left: 0; top: 14px; width: 184px; text-align: center; font-family: {DISP}; font-weight: 900; font-size: 21px; color: {DARK}; letter-spacing: 0.04em">Reserved</div>'
             f'<div style="position: absolute; left: 0; top: 44px; width: 184px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.25; color: {DARK}">Messrs. R. &amp; M. Duke<br><span style="color: {ORANGE}">Table One, daily at one</span></div>'
             '</div>')


def front():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 300px; background: {DARK}"></div>')
    o.append(f'<div style="position: absolute; left: 0; top: 292px; width: {W}px; height: 3px; background: {ORANGE}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Walnut Street, Philadelphia")}{kicker("Members since 1874", PAPER)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 4}px; top: 84px; width: {CW + 8}px; text-align: center; font-family: {DISP}; font-weight: 900; '
             f'font-size: 58px; line-height: 1.05; color: {PAPER}; letter-spacing: 0.005em; white-space: nowrap">The Heritage Club</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 166px; width: {CW}px; display: flex; align-items: center; gap: 18px">'
             f'<div style="flex: 1; height: 2px; background: {ORANGE}"></div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 30px; color: {ORANGE}; line-height: 1">Bill of Fare</div>'
             f'<div style="flex: 1; height: 2px; background: {ORANGE}"></div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 214px; width: {CW}px; text-align: center; font-family: {BODY}; font-style: italic; '
             f'font-size: 21px; color: {PAPER}; opacity: 0.9">The Dining Room, Christmas week, 1983. Luncheon from noon, dinner from six.</div>')
    o.append(f'<div style="position: absolute; left: {L - 2}px; top: 262px">'
             + frame('assets/still-hall.jpg', 'Members and a guest in the club front hall, under the founder\'s portrait', 692, 330) + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 612px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 17px; color: {MUTE}">'
             f'<span>The front hall. Every guest is signed in by a member.</span><span>Jackets in the Dining Room</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 650px; width: {CW}px">'
             + band('The Opening Bell', CW, 38)
             + item('Devils on horseback', '4.50', 'Prunes stuffed with a whole almond, rolled in Lancaster bacon and baked crisp.', 16)
             + item('Snapper soup', '3.25', 'Philadelphia&rsquo;s own, dark and peppery, with sherry poured at the table.', 16)
             + item('Shrimp cocktail', '7.50', 'Six jumbo Gulf shrimp chilled on cracked ice, sharp red sauce and lemon.', 16)
             + item('Caesar salad', '3.75', 'Romaine, coddled egg, anchovy and Parmesan, dressed at your table.', 16)
             + '</div>')
    reserved(o, L + 14, 492)
    return page(''.join(o), 'front')


# ---------------- BACK ----------------
def wager(o, x, y):
    """Prop: a torn slip from the club Wager Book."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 300px; height: 124px; background: {CARD}; '
             f'box-shadow: 0 3px 8px rgba(40,20,10,0.32); transform: rotate(-3deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 300px; height: 34px; border-bottom: 2px solid {DARK}; display: flex; justify-content: space-between; '
             f'align-items: center; padding: 0 12px; box-sizing: border-box; font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.16em; color: {DARK}">'
             f'<span>WAGER BOOK</span><span style="color: {ORANGE}">No. 1983</span></div>'
             + ''.join(f'<div style="position: absolute; left: 10px; right: 10px; top: {60 + i * 26}px; height: 1px; background: #c9b79a"></div>' for i in range(3))
             + f'<div style="position: absolute; left: 14px; top: 38px; width: 276px; font-family: {HAND}; font-weight: 500; font-size: 20px; line-height: 26px; color: #22305e">'
             f'R. Duke bets M. Duke<br>nature against nurture.<br>Stake: one dollar.</div>'
             f'<div style="position: absolute; left: 190px; top: 74px; border: 3px solid {ORANGE}; padding: 2px 8px; font-family: {BODY}; font-weight: 700; '
             f'font-size: 19px; letter-spacing: 0.12em; color: {ORANGE}; opacity: 0.85; transform: rotate(-10deg)">ENTERED</div>'
             '</div>')


def chit(o, x, y):
    """Prop: a member's bar chit, signed to the account."""
    rows = [('2 Mimosa', '7.50'), ('1 Shrimp cocktail', '7.50')]
    r = ''.join(f'<div style="display: flex; justify-content: space-between; font-family: {HAND}; font-weight: 500; font-size: 19px; line-height: 26px; color: #22305e; '
                f'border-bottom: 1px solid #c9b79a"><span>{a}</span><span>{b}</span></div>' for a, b in rows)
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 210px; background: {CARD}; padding: 0 10px 6px; box-sizing: border-box; '
             f'box-shadow: 0 3px 8px rgba(40,20,10,0.32); transform: rotate(4deg)">'
             f'<div style="margin: 0 -10px 4px; height: 30px; background: {DARK}; color: {PAPER}; display: flex; align-items: center; justify-content: space-between; '
             f'padding: 0 10px; font-family: {BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.14em"><span>MEMBERS&rsquo; BAR</span><span style="color: {ORANGE}">23</span></div>'
             + r +
             f'<div style="font-family: {SIG}; font-size: 30px; line-height: 1; white-space: nowrap; color: #22305e">L. Winthrope III</div>'
             '</div>')


COLW, GAP = 330, 44
X2 = L + COLW + GAP


def back():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 14px; background: {DARK}"></div>'
             f'<div style="position: absolute; left: 0; top: 14px; width: {W}px; height: 3px; background: {ORANGE}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 48px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Dinner from six")}{kicker("The Heritage Club", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 80px; width: 456px">'
             + band('The Main Position', 456, 36)
             + item('Roast prime rib of beef', '19.83', 'Standing rib, salted a day ahead, roasted slow and carved to order. Natural juices, horseradish cream, browned potatoes.', 16,
                    'Ask for the end cut early.')
             + item('Crab cakes', '12.50', 'Lump blue crab, barely bound, browned in butter. Tartar sauce and lemon.', 16)
             + item('Dover sole', '16.75', 'Whole, browned in butter and boned at the table. Parsley potatoes.', 16)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {L + CW - 198}px; top: 84px">'
             + frame('assets/still-portrait.jpg', 'The founder\'s portrait in its gilt frame in the front hall', 186, 250) + '</div>')
    o.append(f'<div style="position: absolute; left: {L + CW - 198}px; top: 358px; width: 198px; font-family: {BODY}; font-style: italic; font-size: 17px; '
             f'line-height: 1.3; color: {MUTE}; text-align: center">Our founder, who still watches the front hall.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 574px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.45"></div>')
    left = (band('Closing Bell', COLW, 30)
            + item('Orange butter cake', '3.50', 'Grated rind and juice in the batter, brushed warm with thick orange syrup.', 14)
            + item('Rice pudding', '2.75', 'Baked slow with vanilla bean, nutmeg on top.', 14))
    right = (band('Members&rsquo; Bar', COLW, 30)
             + item('Mimosa', '3.75', 'Fresh-squeezed juice and chilled champagne, half and half.', 14)
             + item('Frozen screwdriver', '3.25', 'Vodka and orange juice, whirled with ice.', 14,
                    'Fresh juice only, never concentrate.'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 594px; width: {COLW}px">{left}</div>')
    o.append(f'<div style="position: absolute; left: {X2}px; top: 594px; width: {COLW}px">{right}</div>')
    # House Committee note, left column under the sweets
    o.append(f'<div style="position: absolute; left: {L}px; top: 866px; width: {COLW}px">'
             + kicker('The House Committee', ORANGE)
             + f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.35; color: {DARK}; margin-top: 8px">Members may wager on any subject they please, provided it is entered in the Book.</div>'
             f'<div style="font-family: {SIG}; font-size: 42px; line-height: 1; color: {DARK}; margin-top: 0">Randolph Duke</div></div>')
    wager(o, X2 + 16, 862)
    chit(o, L + CW - 206, 424)
    o.append(f'<div style="position: absolute; left: {L}px; top: 996px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-size: 16px; color: {MUTE}">'
             f'<span>Prices subject to change. Private parties in the Harvard Room. Form HC-23, 1983.</span></div>')
    return page(''.join(o), 'back')


FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Heritage Club bill of fare, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
