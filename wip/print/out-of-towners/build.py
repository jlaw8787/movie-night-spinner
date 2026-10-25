"""The Wendover, Park Avenue at 50th Street, New York, 1970.
The hotel's two-sided room service card (US Letter), brown and ochre on camel stock, built on the
house style lock. Front: the hotel's name, a photo of guests in Central Park, breakfast.
Back: luncheon and supper, the pastry cart, the bar, the airport limousine photo and a note on the tray.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, GOLD, MUTE, CARD = '#ecdfc4', '#3a2216', '#a26f17', '#6b5442', '#faf5ea'
FONTS = ('https://fonts.googleapis.com/css2?family=Rozha+One'
         '&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Mrs+Saint+Delafield&display=swap')
DISP = "'Rozha One', serif"; BODY = "'Crimson Pro', serif"; SCRIPT = "'Mrs Saint Delafield', cursive"
L, CW = 56, 704


def kicker(t, color=GOLD, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 19px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')


def bar(t, size=40, w=None):
    """Section title: a brown band with paper letters, ochre hairlines above and below."""
    wid = f'width: {w}px; ' if w else ''
    return (f'<div style="{wid}border-top: 2px solid {GOLD}; border-bottom: 2px solid {GOLD}; padding: 3px 0">'
            f'<div style="background: {DARK}; color: {PAPER}; font-family: {DISP}; font-size: {size}px; line-height: 1; '
            f'padding: 9px 16px 5px; text-transform: uppercase; letter-spacing: 0.03em">{t}</div></div>')


def item(name, price, desc, gap=16):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 28px; line-height: 1.12; color: {DARK}">'
            f'<span>{name}</span><span style="color: {GOLD}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.3; color: {DARK}; margin-top: 2px">{desc}</div></div>')


def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.30">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {DARK}"></div>'
            f'<div style="position: absolute; left: 0; top: 20px; width: {W}px; height: 3px; background: {GOLD}"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 16}px; width: {W}px; height: 16px; background: {DARK}"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 23}px; width: {W}px; height: 3px; background: {GOLD}"></div>'
            + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


def matchbook(o, x, y):
    """Prop: the hotel matchbook, tucked over the corner of the photo."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 100px; height: 142px; background: {DARK}; '
             f'box-shadow: 0 2px 6px rgba(30,20,10,0.4); transform: rotate(-7deg); overflow: hidden">'
             f'<div style="position: absolute; left: 7px; top: 7px; width: 82px; height: 86px; border: 1px solid {GOLD}"></div>'
             f'<div style="position: absolute; left: 0; top: 16px; width: 100px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.2em; color: {GOLD}">THE</div>'
             f'<div style="position: absolute; left: 0; top: 34px; width: 100px; text-align: center; font-family: {DISP}; font-size: 19px; line-height: 1; color: {PAPER}">WENDOVER</div>'
             f'<div style="position: absolute; left: 0; top: 62px; width: 100px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; line-height: 1.1; color: {PAPER}">MU 8-1970</div>'
             f'<div style="position: absolute; left: 0; top: 104px; width: 100px; height: 38px; background: {GOLD}"></div>'
             f'<div style="position: absolute; left: 0; top: 111px; width: 100px; height: 10px; background: repeating-linear-gradient(90deg, #6b4a2a 0 2px, #3a2216 2px 4px)"></div>'
             '</div>')


def message(o, x, y):
    """Prop: a front desk message slip waiting in the room."""
    row = lambda lab, val, top: (f'<div style="position: absolute; left: 12px; top: {top}px; width: 206px; border-bottom: 1px solid #c9b48a; '
                                 f'font-family: {BODY}; font-size: 15px; line-height: 1.25; color: {MUTE}">{lab} '
                                 f'<span style="font-style: italic; font-size: 17px; color: #22306a">{val}</span></div>')
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 230px; height: 196px; background: {CARD}; '
             f'box-shadow: 0 2px 7px rgba(40,25,10,0.32); transform: rotate(3.5deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 230px; height: 40px; background: {GOLD}; color: {CARD}; '
             f'font-family: {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.18em; text-align: center; line-height: 40px">WHILE YOU WERE OUT</div>'
             + row('For', 'Mr. G. Kellerman', 50)
             + row('Of', 'Twin Oaks, Ohio', 78)
             + row('Message', 'Your office called.', 106)
             + row('', 'Please call back in the morning.', 134)
             + f'<div style="position: absolute; left: 12px; top: 166px; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; color: {MUTE}">FRONT DESK &nbsp; 11:40 P.M.</div>'
             '</div>')


def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Park Avenue at 50th Street")}{kicker("New York", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 3}px; top: 82px; font-family: {DISP}; font-size: 64px; line-height: 1; color: {DARK}; letter-spacing: 0.01em">THE WENDOVER</div>')
    o.append(f'<div style="position: absolute; left: {L + 510}px; top: 86px; width: {CW - 510}px; text-align: right; font-family: {BODY}; font-weight: 700; '
             f'font-size: 25px; line-height: 1.12; color: {GOLD}; letter-spacing: 0.12em; text-transform: uppercase">Room Service<br>'
             f'<span style="color: {DARK}">Dial 4</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 168px; width: {CW}px; height: 3px; background: {DARK}"></div>'
             f'<div style="position: absolute; left: {L}px; top: 174px; width: {CW}px; height: 1px; background: {GOLD}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 192px; width: {CW}px; height: 365px; border: 2px solid {GOLD}; background: {CARD}; box-sizing: border-box; padding: 4px">'
             f'<img src="assets/still-park.jpg" alt="Two hotel guests sit on stone steps in Central Park with a snack" '
             f'style="display: block; width: 692px; height: 353px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 564px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 17px; color: {MUTE}">'
             f'<span>Guests take the morning air in Central Park, a short walk up Fifth.</span><span>Box lunches on request</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 598px; width: {CW}px">'
             f'<div style="display: flex; align-items: flex-end; justify-content: space-between; gap: 20px">{bar("Breakfast", 42)}'
             f'{kicker("In your room, 6 A.M. to noon", GOLD, " margin-bottom: 16px")}</div>'
             + item('Rib Eye Steak and Eggs', '5.25', 'Seared to order and rested, two eggs fried, hash browns and buttered toast.', 12)
             + item('The Continental', '1.70', 'Chilled orange juice, a warm croissant, sweet butter, preserves and a pot of coffee.', 10)
             + item('Buttermilk Griddle Cakes', '1.85', 'A tall stack with whipped butter, warm maple syrup and country sausage.', 10)
             + item('Eggs Benedict', '2.95', 'Poached eggs and Canadian bacon on a toasted English muffin, hollandaise.', 10)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 998px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-size: 16px; color: {MUTE}">'
             f'<span>Our kitchen never runs out. Taxis scarce? Ask the doorman.</span><span>Form RS-1970</span></div>')
    matchbook(o, L - 6, 206)
    message(o, L + CW - 222, 352)
    return page(''.join(o), 'front')


COLW, GAP = 330, 44
X2 = L + COLW + GAP


def note(o, x, y):
    """Prop: Gwen's note, left on the room service tray."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 250px; height: 112px; background: {CARD}; '
             f'box-shadow: 0 2px 6px rgba(40,25,10,0.3); transform: rotate(-3deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 250px; height: 6px; background: {GOLD}"></div>'
             f'<div style="position: absolute; left: 14px; top: 14px; width: 222px; font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: #22306a">'
             f'George, sit down and order the steak. You have earned it.</div>'
             f'<div style="position: absolute; left: 120px; top: 62px; font-family: {SCRIPT}; font-size: 46px; line-height: 1; color: #22306a">Gwen</div>'
             '</div>')


def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px">{kicker("Served in your room until 2 A.M.")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 80px">{bar("Luncheon and supper", 44)}</div>')
    o.append(f'<div style="position: absolute; left: {L + 540}px; top: 76px; width: {CW - 540}px; text-align: right; font-family: {DISP}; font-size: 30px; line-height: 1.05; color: {DARK}">THE<br>WENDOVER</div>')
    col = lambda x, top, inner: f'<div style="position: absolute; left: {x}px; top: {top}px; width: {COLW}px">{inner}</div>'
    left = (kicker('From the kitchen')
            + item('Waldorf Salad', '1.95', 'Crisp apple, celery, green grapes and toasted walnuts in a lemon mayonnaise, on butter lettuce.', 14)
            + item('Club Sandwich', '2.25', 'Three decker, sliced turkey, bacon, lettuce and tomato on toast.')
            + item('Cocktail Franks', '1.10', 'Glazed sticky with honey, mustard, brown sugar and Worcestershire, on picks with pearl onions.')
            + f'<div style="height: 1px; background: {DARK}; opacity: 0.45; margin: 22px 0 20px"></div>'
            + bar('The pastry cart', 34)
            + item('New York Cheesecake', '.95', 'Baked slowly in a water bath on a crumb crust, chilled overnight, crowned with sliced strawberries.', 14)
            + item('Raspberry Jam Fingers', '.60', 'Butter shortbread baked pale, sandwiched with raspberry jam, dusted with sugar. Boxed for the handbag.'))
    right = (bar('From the bar', 34)
             + item('Dry Martini', '1.25', 'Gin and dry vermouth stirred ice cold, strained into a frosted glass, one green olive.', 14)
             + item('Manhattan', '1.25', 'Rye, sweet vermouth and bitters, stirred, with a cherry.')
             + item('Coffee, by the pot', '.70', 'Fresh brewed, with cream. Serves two.')
             + f'<div style="margin-top: 20px; border: 2px solid {GOLD}; padding: 4px; background: {CARD}">'
             f'<img src="assets/still-flight.jpg" alt="A husband and wife in their seats on a jet" style="display: block; width: 318px; height: 179px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.3; color: {MUTE}; margin-top: 6px">'
             f'Our limousine meets every flight, fog or no fog.</div>')
    o.append(col(L, 200, left)); o.append(col(X2, 200, right))
    note(o, X2 + 50, 846)
    o.append(f'<div style="position: absolute; left: {L}px; top: 976px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 984px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; color: {MUTE}">'
             f'<span>Rooms held until 6 P.M. unless guaranteed. Please do not cross the park after dark.</span><span>Prices subject to change.</span></div>')
    return page(''.join(o), 'back')


FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Wendover room service, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
