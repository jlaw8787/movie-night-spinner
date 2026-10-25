"""The Hotel Carrow, Park Avenue, election night, Tuesday November 7, 2006.
The hotel's printed ballroom menu for the Norris for Senate election night party: a two-sided US Letter card
on pale blue-grey stock, navy and lounge brass inks, built on the house style lock.
Front: hotel sign, headline, the gentlemen's lounge still, small plates from 7 P.M., campaign button.
Back: late supper, the ballroom bar, podium still, Charlie Traynor's note, hat check and drink ticket.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, NAVY, BRASS, MUTE, CARD = '#dde3e3', '#1b2841', '#a26f26', '#4d5866', '#f3f4ef'
FONTS = ('https://fonts.googleapis.com/css2?family=Fraunces:wght@600'
         '&family=Spectral:ital,wght@0,400;0,500;0,600;1,400&family=Mrs+Saint+Delafield&display=swap')
DISP = "'Fraunces', serif"; BODY = "'Spectral', serif"; SIG = "'Mrs Saint Delafield', cursive"

def kicker(t, color=BRASS, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; letter-spacing: 0.2em; color: {color}; '
            f'text-transform: uppercase; line-height: 1; white-space: nowrap;{extra}">{t}</div>')

def door(t, size=40):
    """Section title in a navy door frame, with a brass knob."""
    return (f'<div style="position: relative; display: inline-block; border: 3px solid {NAVY}; padding: 9px 46px 7px 16px; '
            f'font-family: {DISP}; font-weight: 600; font-size: {size}px; line-height: 1; color: {NAVY}; text-transform: uppercase; letter-spacing: 0.01em; white-space: nowrap">{t}'
            f'<div style="position: absolute; right: 15px; top: 50%; width: 12px; height: 12px; margin-top: -6px; border-radius: 50%; background: {BRASS}"></div></div>')

def item(name, price, desc, gap=20):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {DISP}; font-weight: 600; '
            f'font-size: 27px; line-height: 1.12; color: {NAVY}">'
            f'<span>{name}</span><span style="font-family: {BODY}; font-weight: 600; font-size: 26px; color: {BRASS}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.36; color: {NAVY}; margin-top: 4px">{desc}</div></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.30">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {NAVY}"></div>'
            f'<div style="position: absolute; left: 0; top: 20px; width: {W}px; height: 2px; background: {BRASS}"></div>'
            + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

L, CW = 56, 704

def sign(x, y, w, size=19, color=BRASS):
    """The hotel's own sign line: name between two brass rules."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; display: flex; align-items: center; gap: 14px">'
            f'<div style="flex: 1; height: 1px; background: {color}"></div>'
            f'<div style="font-family: {DISP}; font-weight: 600; font-size: {size}px; letter-spacing: 0.3em; color: {color}; line-height: 1">THE HOTEL CARROW</div>'
            f'<div style="flex: 1; height: 1px; background: {color}"></div></div>')

def button(o, x, y):
    """Prop: a Norris for Senate lapel button pinned to the photo corner."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 118px; height: 118px; border-radius: 50%; background: {CARD}; '
             f'box-shadow: 0 3px 7px rgba(20,25,35,0.35); transform: rotate(-8deg)">'
             f'<div style="position: absolute; left: 6px; top: 6px; width: 106px; height: 106px; border-radius: 50%; background: {NAVY}"></div>'
             f'<div style="position: absolute; left: 0; top: 22px; width: 118px; text-align: center; font-family: {BODY}; font-size: 14px; letter-spacing: 0.5em; color: {BRASS}">&#9733;&#9733;&#9733;</div>'
             f'<div style="position: absolute; left: 0; top: 44px; width: 118px; text-align: center; font-family: {DISP}; font-weight: 600; font-size: 23px; line-height: 1; color: {CARD}">NORRIS</div>'
             f'<div style="position: absolute; left: 22px; top: 75px; width: 74px; height: 2px; background: #b8323a"></div>'
             f'<div style="position: absolute; left: 0; top: 81px; width: 118px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.12em; color: {CARD}">SENATE</div>'
             '</div>')

def front():
    o = []
    o.append(sign(L, 46, CW, 19))
    o.append(f'<div style="position: absolute; left: {L}px; top: 78px; width: {CW}px; font-family: {DISP}; font-weight: 600; font-size: 72px; line-height: 1; '
             f'color: {NAVY}; text-transform: uppercase; letter-spacing: -0.005em; white-space: nowrap">Election night</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 158px">{kicker("The Grand Ballroom, Park Avenue")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 184px; width: {CW - 130}px; font-family: {BODY}; font-style: italic; font-size: 20px; color: {MUTE}">'
             f'Tuesday, November 7, 2006. A reception for Norris for Senate.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 232px; width: {CW}px; height: 372px; outline: 2px solid {BRASS}; outline-offset: 5px">'
             f'<img src="assets/still-lounge.jpg" alt="The wood-paneled gentlemen\'s lounge with brass sconces and gilt mirrors" '
             f'style="display: block; width: {CW}px; height: 372px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 618px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 16px; color: {MUTE}">'
             f'<span>The gentlemen&rsquo;s lounge off the ballroom, our quietest room.</span><span>Mezzanine level</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 660px; width: {CW}px">'
             f'<div style="display: flex; align-items: center; justify-content: space-between">{door("From the bar")}'
             f'{kicker("Doors open at 7 P.M.", BRASS)}</div>'
             + item('Warm roasted nuts', '6.00', 'Almonds, cashews and pecans glazed with honey, butter and cinnamon.', 18)
             + item('Goat cheese crostini', '9.00', 'Toasted baguette, whipped chèvre, warm honey, thyme and cracked pepper.', 18)
             + item('Smoked salmon on cucumber', '12.00', 'Thick cucumber rounds, crème fraîche whipped with lemon, fresh dill.', 18)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 976px; width: {CW}px; height: 1px; background: {NAVY}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 986px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             f'<span>Nuts served warm in paper cones. Late supper and the bar overleaf.</span><span>Form 1107</span></div>')
    button(o, L + CW - 118, 168)
    return page(''.join(o), 'front')

COLW, GAP = 334, 36
X2 = L + COLW + GAP

def hatcheck(o, x, y):
    """Prop: the cloakroom's hat check, numbered."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 150px; height: 92px; background: #e9c86a; '
             f'box-shadow: 0 2px 5px rgba(20,25,35,0.3); transform: rotate(-6deg)">'
             f'<div style="position: absolute; left: 6px; top: 6px; width: 134px; height: 76px; border: 1.5px solid {NAVY}"></div>'
             f'<div style="position: absolute; left: 0; top: 14px; width: 150px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.2em; color: {NAVY}">HAT CHECK</div>'
             f'<div style="position: absolute; left: 0; top: 34px; width: 150px; text-align: center; font-family: {DISP}; font-weight: 600; font-size: 34px; line-height: 1; color: #8e2a2a">No. 47</div>'
             f'<div style="position: absolute; left: 0; top: 68px; width: 150px; text-align: center; font-family: {BODY}; font-size: 14px; color: {NAVY}">Hats and umbrellas</div>'
             '</div>')

def ticket(o, x, y):
    """Prop: a campaign drink ticket, good at the ballroom bar."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 190px; height: 80px; background: {CARD}; '
             f'box-shadow: 0 2px 5px rgba(20,25,35,0.3); transform: rotate(5deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 34px; height: 80px; background: {NAVY}"></div>'
             f'<div style="position: absolute; left: 34px; top: 0; width: 0; height: 80px; border-left: 2px dotted {CARD}"></div>'
             f'<div style="position: absolute; left: 0; top: 29px; width: 34px; text-align: center; font-family: {BODY}; font-size: 15px; color: {BRASS}">&#9733;</div>'
             f'<div style="position: absolute; left: 46px; top: 10px; font-family: {DISP}; font-weight: 600; font-size: 20px; line-height: 1; color: {NAVY}; white-space: nowrap">ONE DRINK</div>'
             f'<div style="position: absolute; left: 46px; top: 40px; font-family: {BODY}; font-size: 14px; line-height: 1.2; color: {NAVY}">Ballroom bar<br>'
             f'<span style="color: #8e2a2a; font-weight: 600">No. 0705</span></div>'
             '</div>')

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 48px">{kicker("Norris for Senate")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 78px; font-family: {DISP}; font-weight: 600; font-size: 64px; line-height: 1; color: {NAVY}; text-transform: uppercase">The menu</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 160px; width: {CW}px; height: 3px; background: {NAVY}"></div>')
    col = lambda x, inner: f'<div style="position: absolute; left: {x}px; top: 186px; width: {COLW}px">{inner}</div>'
    left = (door('Late supper', 38)
            + f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {MUTE}; margin-top: 10px">In the ballroom foyer from 11 P.M.</div>'
            + item('Steak frites', '32.00', 'Seared sirloin, shallot and red wine butter, double-fried potatoes.', 12)
            + item('Lobster linguine', '36.00', 'Split tails, garlic, chili, cherry tomatoes and white wine.', 16)
            + item('Chairman&rsquo;s cake', '11.00', 'Dark chocolate, baked to order, set at the edges, soft in the center.', 16)
            + item('Coffee or tea', '7.05', 'Poured at the table. Mind your shirt.', 16))
    right = (door('The bar', 38)
             + f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {MUTE}; margin-top: 10px">Cash bar. Drink tickets welcome.</div>'
             + item('French 75', '14.00', 'Gin, lemon and sugar, shaken, topped with brut champagne.', 12)
             + item('Champagne', '16.00', 'Brut, by the glass.', 16)
             + item('Wine by the glass', '11.00', 'House red or white.', 16)
             + item('Beer', '8.00', 'Domestic or imported.', 16)
             + item('Soft drinks', '4.00', 'Cola, ginger ale, club soda.', 16))
    o.append(col(L, left)); o.append(col(X2, right))
    # lower band: podium still and Charlie's note
    o.append(f'<div style="position: absolute; left: {L}px; top: 704px; width: {CW}px; height: 1px; background: {NAVY}; opacity: 0.5"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 728px; width: 340px; height: 190px; outline: 2px solid {BRASS}; outline-offset: 5px">'
             f'<img src="assets/still-podium.jpg" alt="The Congressman at the podium in front of the flag" style="display: block; width: 340px; height: 190px"></div>'
             f'<div style="position: absolute; left: {L}px; top: 928px; width: 340px; font-family: {BODY}; font-style: italic; font-size: 16px; color: {MUTE}">'
             f'Congressman David Norris of Brooklyn.</div>')
    o.append(f'<div style="position: absolute; left: {X2 + 4}px; top: 724px; width: {COLW - 4}px">'
             + kicker('From the campaign') +
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.42; color: {NAVY}; margin-top: 9px">Whatever the count says, thank you. '
             f'Eat something, the returns run late. Hats to the cloakroom, and no photographs at the bar. The bus back to Brooklyn leaves the side doors at 1 A.M.</div>'
             f'<div style="font-family: {SIG}; font-size: 50px; line-height: 1; color: {NAVY}; margin-top: 2px">Charlie Traynor</div></div>')
    hatcheck(o, L + CW - 150, 40)
    ticket(o, L + 372, 62)
    o.append(f'<div style="position: absolute; left: {L}px; top: 960px; width: {CW}px; height: 1px; background: {NAVY}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 967px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             f'<span>A private wedding is also with us tonight. Kindly keep to the ballroom.<br>Service doors are for staff only. The Hotel Carrow.</span>'
             f'<span style="text-align: right">Prices subject to change.<br>Banquet order 1107, 2006</span></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Hotel Carrow menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
