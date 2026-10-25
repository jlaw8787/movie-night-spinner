"""The Cafe at Fox Books, Fox & Sons Books, Broadway, Upper West Side, autumn 1998.
The chain superstore's two-sided table menu (US Letter) on bright coated stock in the store's own
colours: awning burgundy, sign gold, espresso brown. Front: the sign, the new store on Broadway,
the coffee bar. Back: kitchen, bakery case, book party platters, a note from Joe Fox, a story hour
coupon and a staff pick bookmark.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, RED, GOLD, MUTE = '#f8f4ec', '#2b1f1b', '#7e1f2d', '#b08a45', '#6a5a50'
FONTS = ('https://fonts.googleapis.com/css2?family=Gloock'
         '&family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Mrs+Saint+Delafield&display=swap')
DISP = "'Gloock', serif"; BODY = "'Lora', serif"; SIG = "'Mrs Saint Delafield', cursive"
L, CW = 56, 704

def kicker(t, color=RED, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def band(t, size=38, extra=''):
    """Section title: an awning-burgundy band over a gold valance rule."""
    return (f'<div style="border-bottom: 3px solid {GOLD}; padding-bottom: 4px;{extra}">'
            f'<div style="display: inline-block; background: {RED}; color: {PAPER}; font-family: {DISP}; font-size: {size}px; '
            f'line-height: 1; padding: 8px 18px 10px; letter-spacing: 0.005em">{t}</div></div>')

def item(name, price, desc, gap=18):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-family: {DISP}; '
            f'font-size: 28px; line-height: 1.15; color: {DARK}">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.38; color: {DARK}; margin-top: 3px">{desc}</div></div>')

def sign(size, plate):
    """The store sign: FOX, the small & SONS plate, BOOKS."""
    return (f'<div style="display: flex; align-items: center; gap: {int(size * 0.2)}px; font-family: {DISP}; font-size: {size}px; line-height: 1; color: {DARK}; letter-spacing: 0.03em">'
            f'<span>FOX</span><span style="font-family: {BODY}; font-weight: 700; font-size: {plate}px; letter-spacing: 0.12em; background: {DARK}; color: {PAPER}; '
            f'padding: {int(plate * 0.35)}px {int(plate * 0.55)}px; line-height: 1">&amp; SONS</span><span>BOOKS</span></div>')

def page(inner, name):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 14px; background: {RED}"></div>'
            f'<div style="position: absolute; left: 0; top: 17px; width: {W}px; height: 3px; background: {GOLD}"></div>'
            + inner +
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

# ---------------- props ----------------
def stamp(o, x, y):
    """Round rubber stamp, burgundy ink, struck over the corner of the photo."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 132px; height: 132px; border: 4px solid {RED}; border-radius: 50%; '
             f'box-sizing: border-box; transform: rotate(-12deg); opacity: 0.9; background: rgba(248,244,236,0.92)">'
             f'<div style="position: absolute; left: 6px; top: 6px; width: 112px; height: 112px; border: 1.5px solid {RED}; border-radius: 50%; box-sizing: border-box"></div>'
             f'<div style="position: absolute; left: 0; top: 24px; width: 124px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.16em; color: {RED}">FOX BOOKS</div>'
             f'<div style="position: absolute; left: 0; top: 44px; width: 124px; text-align: center; font-family: {DISP}; font-size: 30px; line-height: 1; color: {RED}">Now<br>Open</div>'
             f'<div style="position: absolute; left: 0; top: 108px; width: 124px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.16em; color: {RED}; margin-top: -16px">FALL 1998</div>'
             '</div>')

def coupon(x, y, w):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; box-sizing: border-box; border: 2px dashed {RED}; background: #fffdf8; padding: 12px 16px 12px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
            f'<span style="font-family: {DISP}; font-size: 30px; line-height: 1; color: {RED}">Free hot cocoa</span>'
            f'<span style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.18em; color: {MUTE}">CLIP</span></div>'
            f'<div style="font-family: {BODY}; font-size: 17px; line-height: 1.35; color: {DARK}; margin-top: 6px">With any picture book bought at Saturday story hour. Good through December 31, 1998.</div></div>')

def bookmark(x, y, w):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: 96px; background: {DARK}; transform: rotate(-2.5deg); '
            f'box-shadow: 0 2px 6px rgba(40,25,20,0.3)">'
            f'<div style="position: absolute; left: 8px; top: 8px; width: {w - 16}px; height: 80px; border: 1px solid {GOLD}; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 22px; top: 18px; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.2em; color: {GOLD}">STAFF PICK</div>'
            f'<div style="position: absolute; left: 22px; top: 38px; font-family: {DISP}; font-size: 26px; line-height: 1; color: {PAPER}">Pride and Prejudice</div>'
            f'<div style="position: absolute; left: 22px; top: 66px; font-family: {BODY}; font-style: italic; font-size: 15px; color: #e3d6c0">Jane Austen. Paperback, 5.95</div>'
            f'<div style="position: absolute; left: {w - 46}px; top: 22px; width: 18px; height: 52px; background: {RED}"></div>'
            '</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Upper West Side, New York")}{kicker("Open 7 a.m. to 11 p.m.", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 74px; width: {CW}px; display: flex; justify-content: center">{sign(88, 24)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 176px; width: {CW}px; display: flex; align-items: center; gap: 18px">'
             f'<div style="flex: 1; height: 2px; background: {GOLD}"></div>'
             f'<div style="font-family: {DISP}; font-size: 40px; line-height: 1; color: {RED}">The Cafe</div>'
             f'<div style="flex: 1; height: 2px; background: {GOLD}"></div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 238px; width: {CW}px; height: 332px; outline: 2px solid {RED}; outline-offset: 5px; background: #ddd">'
             f'<img src="assets/still-facade.jpg" alt="The Fox and Sons Books store on Broadway, gold sign letters over burgundy awnings" '
             f'style="display: block; width: {CW}px; height: 332px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 584px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 16px; color: {MUTE}">'
             f'<span>Our new store on Broadway. Bring any book to your table.</span><span>Story hour Saturdays at 11</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 624px; width: {CW}px">'
             + kicker('Short, tall, light, dark, caf, decaf', RED, ' margin-bottom: 10px')
             + band('The coffee bar', 42)
             + item('Tall decaf cappuccino', '2.95', 'Two shots of decaf espresso, steamed milk and a deep crown of foam.', 14)
             + item('Caff&egrave; latte', '2.75', 'Espresso with plenty of steamed milk under a thin layer of foam.', 12)
             + item('Coffee of the day', '1.52', 'Our house roast, brewed fresh every hour. Refills are free.', 12)
             + item('Hot cocoa', '1.95', 'Dark chocolate melted into hot milk, with whipped cream.', 12)
             + '</div>')
    stamp(o, L + CW - 120, 214)
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
COLW, GAP = 330, 44
X2 = L + COLW + GAP

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px">{kicker("Order at the counter, we bring it to you")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 78px; font-family: {DISP}; font-size: 66px; line-height: 1; color: {DARK}">The Menu</div>')
    o.append(f'<div style="position: absolute; left: {L + 330}px; top: 92px; width: {CW - 330}px; display: flex; justify-content: flex-end">{sign(40, 13)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 166px; width: {CW}px; height: 2px; background: {GOLD}"></div>')
    col = lambda x, inner: f'<div style="position: absolute; left: {x}px; top: 188px; width: {COLW}px">{inner}</div>'
    left = (band('From the kitchen')
            + item('Toasted mini bagels', '3.25', 'Three to an order, spread with cream cheese whipped with scallion and cracked pepper.')
            + item('Pressed turkey and brie', '6.50', 'Cranberry sauce on buttered sourdough, griddled until the cheese runs.')
            + item('Chicken noodle soup', '3.50', 'Simmered all morning with carrot, celery and dill. With a roll.')
            + f'<div style="height: 22px"></div>'
            + band('The bakery case')
            + item('New York cheesecake', '3.95', 'Baked rich and dense, chilled overnight, with sugared strawberries.')
            + item('Chocolate chip cookie', '1.25', 'Big and chewy, out of the oven every morning.'))
    right = (band('Book party platters')
             + item('Smoked salmon on cucumber', '24.00', 'Two dozen, with dill cream cheese, capers and cracked pepper. Order two days ahead.')
             + f'<div style="margin-top: 18px; border: 2px solid {RED}; padding: 4px; background: #fffdf8">'
             f'<img src="assets/still-platter.jpg" alt="A book party spread with salmon roe, sliced ham and crudites" style="display: block; width: 318px; height: 191px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.35; color: {MUTE}; margin-top: 6px">From a book party spread. The roe is a garnish.</div>'
             f'<div style="height: 2px; background: {GOLD}; margin: 14px 0 14px"></div>'
             + kicker('Welcome to the neighborhood') +
             f'<div style="font-family: {BODY}; font-size: 17px; line-height: 1.45; color: {DARK}; margin-top: 8px">Take any book off the shelf, bring it to your table and stay as long as you like. We will keep the coffee coming. Dogs wait outside, except Brinkley.</div>'
             f'<div style="font-family: {SIG}; font-size: 50px; line-height: 1; color: {DARK}; margin-top: 2px">Joe Fox</div>')
    o.append(col(L, left)); o.append(col(X2, right))
    o.append(coupon(L, 866, COLW))
    o.append(bookmark(X2 + 4, 872, COLW - 8))
    o.append(f'<div style="position: absolute; left: {L}px; top: 984px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.45"></div>'
             f'<div style="position: absolute; left: {L}px; top: 992px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 15px; color: {MUTE}">'
             f'<span>Fox &amp; Sons Books, Broadway. School supplies on the lower level.</span><span>Prices subject to change. FB-152</span></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Cafe at Fox Books, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
