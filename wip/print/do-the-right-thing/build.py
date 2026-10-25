"""Sal's Famous Pizzeria, Stuyvesant Ave., Bed-Stuy, Brooklyn. The hottest day of the summer, 1989.
Pizzeria wall menu, one face 1056x1344 (11x14 in). Built from the film's own look: the red brick wall,
the zigzag triangle band of the title art, amber morning light inside Sal's, dark wood and the Wall of Fame.
Signature: the Wall of Fame as a row of empty frames (painted, no faces) plus a TMDB still of the block.
Props: a printed 98 degree tag, a typographic Love and Hate card, Mookie's delivery slip No. 42.
Writes front.body.html and front.html. Run paint.py first."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1056, 1344
M = 48
RED, ORANGE, YEL, BRICK, INK, CREAM, WOOD = '#d8321f', '#f2801e', '#ffd23a', '#8e2a1a', '#2a0f0a', '#fbf0d6', '#3a2014'
FONTS = ('https://fonts.googleapis.com/css2?family=Passion+One:wght@400;700;900'
         '&family=Libre+Franklin:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Reenie+Beanie&display=swap')
DISP = "'Passion One', sans-serif"; BODY = "'Libre Franklin', sans-serif"; SCRIPT = "'Reenie Beanie', cursive"

def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px;{extra}">{inner}</div>'

def kicker(t, color=RED, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 800; font-size: {size}px; letter-spacing: 0.18em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def bar(title, kick=None):
    k = (f'<span style="font-family: {BODY}; font-weight: 800; font-size: 16px; letter-spacing: 0.16em; color: {YEL}; '
         f'margin-left: 14px">{kick}</span>') if kick else ''
    return (f'<div style="background: {RED}; padding: 2px 14px 0; height: 44px; display: flex; align-items: center; '
            f'box-shadow: 4px 4px 0 {INK}">'
            f'<span style="font-family: {DISP}; font-weight: 700; font-size: 40px; line-height: 44px; color: {CREAM}; letter-spacing: 0.02em">{title}</span>{k}</div>')

def item(name, price, desc, top=8):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; font-family: {BODY}; font-weight: 800; '
            f'font-size: 27px; line-height: 1.12; color: {INK}"><span>{name}</span><span style="color: {BRICK}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.25; color: #5a2a18; margin-top: 1px">{desc}</div></div>')

def temp_tag(x, y):
    """Printed paper tag, type only: today's heat."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 150px; height: 196px; background: {CREAM}; transform: rotate(4deg); '
            f'box-shadow: 5px 8px 14px rgba(0,0,0,0.5); border-top: 8px solid {RED}; text-align: center">'
            f'<div style="width: 14px; height: 14px; border-radius: 50%; background: {WOOD}; margin: 10px auto 0; border: 2px solid #c9b48c"></div>'
            + kicker('Today', RED, 15, ' margin-top: 6px;')
            + f'<div style="font-family: {DISP}; font-weight: 900; font-size: 84px; line-height: 76px; color: {RED}; margin-top: 2px">98&deg;</div>'
            + kicker('In the shade', INK, 14, ' margin-top: 2px;')
            + f'<div style="font-family: {BODY}; font-weight: 600; font-style: italic; font-size: 15px; line-height: 1.2; color: {INK}; margin: 6px 4px 0">'
              'Hottest day of<br>the summer.</div></div>')

def ring_card(x, y):
    """Typographic card: the two four-finger rings, set as words."""
    word = lambda w: (f'<span style="font-family: {DISP}; font-weight: 900; font-size: 56px; line-height: 54px; color: #e8b84a; '
                      f'letter-spacing: 0.04em; text-shadow: 2px 2px 0 #6e4c12">{w}</span>')
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 318px; padding: 10px 14px 10px; box-sizing: border-box; background: {INK}; '
            f'border: 2px solid {YEL}; transform: rotate(-3deg); box-shadow: 5px 8px 14px rgba(0,0,0,0.55); text-align: center">'
            + kicker('Right hand, left hand', YEL, 14)
            + f'<div style="display: flex; justify-content: center; gap: 22px; margin-top: 4px">{word("LOVE")}{word("HATE")}</div>'
            + f'<div style="font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 1.2; color: {CREAM}; margin-top: 4px">'
              'The story of life, on eight fingers.</div></div>')

def slip(x, y):
    line = lambda lab, val, top: (f'<div style="position: absolute; left: 16px; top: {top}px; width: 238px; border-bottom: 1px solid #e3a49a; '
                                  f'font-family: {BODY}; font-size: 16px; line-height: 22px; color: {INK}">'
                                  f'<span style="color: {RED}; font-weight: 600">{lab}</span> <b>{val}</b></div>')
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 270px; height: 182px; background: #fdf6ee; transform: rotate(-4deg); '
            f'box-shadow: 5px 8px 14px rgba(0,0,0,0.55); border-top: 6px solid {RED}">'
            f'<div style="position: absolute; left: 16px; top: 10px; width: 238px; display: flex; justify-content: space-between; align-items: baseline">'
            f'<span style="font-family: {BODY}; font-weight: 800; font-size: 15px; letter-spacing: 0.14em; color: {RED}">DELIVERY</span>'
            f'<span style="font-family: {DISP}; font-weight: 700; font-size: 30px; line-height: 30px; color: {RED}">No. 042</span></div>'
            + line('To:', 'Tina, upstairs', 48) + line('Order:', '1 pie, extra cheese', 76) + line('Driver:', 'Mookie', 104)
            + f'<div style="position: absolute; left: 16px; top: 136px; width: 238px; font-family: {BODY}; font-weight: 800; font-size: 16px; line-height: 1.2; color: {RED}">'
              'Straight there, straight back.</div></div>')

def front():
    o = []
    WT = 548
    # sign band: the red wall
    o.append(f'<img src="assets/band.jpg" alt="Red brick wall across the street" style="position: absolute; left: 0; top: 0; width: {W}px; height: 150px">')
    o.append(at(M, 40, 760, kicker('Stuyvesant Ave., Bedford-Stuyvesant, Brooklyn', YEL, 18)
                + f'<div style="font-family: {DISP}; font-weight: 900; font-size: 86px; line-height: 80px; color: {CREAM}; letter-spacing: 0.01em; '
                  f'text-shadow: 4px 4px 0 {INK}; margin-top: 4px">SAL\'S FAMOUS</div>'))
    o.append(at(632, 84, 330, f'<div style="font-family: {DISP}; font-weight: 900; font-size: 58px; line-height: 56px; color: {YEL}; text-shadow: 3px 3px 0 {INK}">PIZZERIA</div>'))
    o.append(f'<img src="assets/triangles.png" alt="" style="position: absolute; left: 0; top: 150px; width: {W}px; height: 16px">')
    o.append(f'<img src="assets/wall.png" alt="The Wall of Fame, a row of empty frames on dark wood" style="position: absolute; left: 0; top: {WT}px; width: {W}px; height: {H - WT}px">')
    # hero: Sal's in the morning
    HY = 184
    o.append(f'<div style="position: absolute; left: {M}px; top: {HY}px; width: 960px; height: 350px; background: {YEL}; box-shadow: 0 8px 18px rgba(0,0,0,0.45)"></div>')
    o.append(f'<img src="assets/hero.jpg" alt="Sal and the regulars out on the block" style="position: absolute; left: {M + 4}px; top: {HY + 4}px; width: 952px; height: 342px">')
    o.append(temp_tag(850, 170))
    o.append(slip(30, 352))
    o.append(ring_card(700, 432))
    o.append(at(318, 470, 370, f'<div style="background: rgba(42,15,10,0.82); padding: 8px 14px 9px; text-align: center">'
                + kicker('Wake up! Open 8 a.m.', YEL, 16)
                + f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.25; color: {CREAM}; margin-top: 2px">'
                  'Sal and the regulars, out on the block.</div></div>'))
    # the wall: Wall of Fame and the menu board
    o.append(at(M, WT + 6, 960, f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
                f'<span style="font-family: {DISP}; font-weight: 900; font-size: 30px; line-height: 30px; letter-spacing: 0.3em; color: {YEL}">WALL OF FAME</span>'
                f'<span style="font-family: {BODY}; font-style: italic; font-size: 17px; color: {CREAM}">Sal\'s place. Sal\'s wall.</span></div>'))
    BY = 752; BH = 552
    o.append(f'<div style="position: absolute; left: {M + 6}px; top: {BY + 8}px; width: 960px; height: {BH}px; background: rgba(0,0,0,0.5)"></div>')
    o.append(f'<img src="assets/board.png" alt="" style="position: absolute; left: {M}px; top: {BY}px; width: 960px; height: {BH}px">')
    o.append(f'<div style="position: absolute; left: {M}px; top: {BY}px; width: 960px; height: {BH}px; border: 4px solid {INK}; box-sizing: border-box"></div>')
    CX, CW = M + 26, 432
    left = (bar('PIZZA', 'SINCE 1964')
            + item('Plain Slice', '.95', 'Thin crust, tomato, mozzarella, oregano.')
            + item('Pepperoni Slice', '1.08', 'Crushed tomato, mozzarella, oregano.')
            + item('Whole Pie, 18 in.', '8.00', 'Eight big slices. Pepperoni, add 1.50.')
            + f'<div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: center; background: {INK}; padding: 6px 12px 5px; transform: rotate(-1deg)">'
              f'<span style="font-family: {DISP}; font-weight: 700; font-size: 28px; line-height: 30px; color: {YEL}">EXTRA CHEESE COSTS EXTRA</span>'
              f'<span style="font-family: {BODY}; font-weight: 800; font-size: 26px; color: {YEL}">.50</span></div>'
            + f'<div style="height: 14px"></div>' + bar('ON THE SIDE')
            + item('Garlic Knots', '1.25', 'Six knots, melted butter, parsley, parmesan.')
            + item('Watermelon &amp; Feta Sticks', '1.50', 'Ice cold, with mint, lime and chili salt.'))
    o.append(at(CX, BY + 26, CW, left))
    o.append(f'<div style="position: absolute; left: {M + 480}px; top: {BY + 30}px; width: 2px; height: {BH - 104}px; background: {BRICK}; opacity: 0.45"></div>')
    RX = M + 506
    right = (bar('SOMETHING COLD')
             + item('Cherry Ice', '.75', 'Shaved fine, our own syrup, fresh lemon.')
             + item('Fresh Lemonade', '.75', 'Squeezed to order, plenty of ice.')
             + item('Beer &amp; Lemonade', '1.75', 'Ice-cold lager, half and half, lemon wheel.')
             + item('Cold Soda', '.60', 'Cans from the cooler, ask at the register.')
             + f'<div style="margin-top: 22px; border-top: 2px solid {BRICK}; padding-top: 10px; position: relative">'
               f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.3; color: {INK}; width: 320px">'
               'Twenty-five years on this block. The kids around here grew up on my pizza, and I\'m proud of that.</div>'
               f'<div style="position: absolute; left: 330px; top: 52px; font-family: {SCRIPT}; font-size: 54px; line-height: 50px; color: {RED}; transform: rotate(-6deg)">Sal</div></div>')
    o.append(at(RX, BY + 26, CW, right))
    o.append(at(M + 20, BY + BH - 36, 920, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 1.2; color: #6a3420; text-align: center">'
                'Prices subject to change. Free delivery on the block. Call 718 555 1989. Radios down, please. Sidewalk swept daily by Vito.</div>'))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {WOOD}">'
            + ''.join(o)
            + f'<img src="assets/heat.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px">'
            + f'<img src="assets/paper-grain.png" alt="" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; opacity: 0.18">'
            + '</div>')

b = front()
open(os.path.join(D, 'front.body.html'), 'w').write(b)
open(os.path.join(D, 'front.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Sal\'s Famous Pizzeria wall menu</title>'
    f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
