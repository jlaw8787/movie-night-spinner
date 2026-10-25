"""The Evening Star Room, a sixty-fifth floor supper club in Midtown Manhattan, Valentine's night 1993.
Where Annie takes Walter to dinner and sees the Empire State Building light a heart.
Two-sided US Letter supper card, blush stock, midnight and heart-red inks, on the house style lock.
Front: wordmark, the heart from the window tables, starters. Back: kitchen, sweets, the lounge,
a window-table still and Walter's reservation card.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, RED, MUTE, CARD = '#f3e1da', '#1f2245', '#c22a3f', '#5a4e5e', '#fbf3ee'
FONTS = ('https://fonts.googleapis.com/css2?family=Yeseva+One'
         '&family=Lora:ital,wght@0,400;0,700;1,400&family=Great+Vibes&display=swap')
DISP = "'Yeseva One', serif"; BODY = "'Lora', serif"; SIG = "'Great Vibes', cursive"
L, CW = 56, 704

def kicker(t, color=RED, size=18, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.2;{extra}">{t}</div>')

def diamond(color=RED, s=9):
    return f'<div style="width: {s}px; height: {s}px; background: {color}; transform: rotate(45deg); flex: none"></div>'

def ornament(w, color=RED):
    """Deco rule: line, diamond, line."""
    return (f'<div style="display: flex; align-items: center; gap: 12px; width: {w}px">'
            f'<div style="flex: 1; height: 1px; background: {color}"></div>{diamond(color)}'
            f'<div style="flex: 1; height: 1px; background: {color}"></div></div>')

def bar(t, w, size=40):
    """Midnight band with paper type and a heart-red underline."""
    return (f'<div style="width: {w}px">'
            f'<div style="background: {DARK}; color: {PAPER}; font-family: {DISP}; font-size: {size}px; line-height: 1; '
            f'letter-spacing: 0.04em; text-transform: uppercase; padding: 9px 16px 11px; display: flex; align-items: center; gap: 14px">'
            f'{diamond(RED, 10)}<span>{t}</span></div>'
            f'<div style="height: 3px; background: {RED}; margin-top: 3px"></div></div>')

def item(name, price, desc, note=None, gap=16):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.3; color: {RED}; margin-top: 3px">{note}</div>'
         if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {DISP}; '
            f'font-size: 27px; line-height: 1.15; color: {DARK}"><span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.36; color: {DARK}; margin-top: 3px">{desc}</div>{n}</div>')

def page(inner, top):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.28">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 52px; background: {DARK}"></div>'
            f'<div style="position: absolute; left: 0; top: 52px; width: {W}px; height: 4px; background: {RED}"></div>'
            f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; display: flex; justify-content: center">{kicker(top, PAPER, 17)}</div>'
            f'<div style="position: absolute; left: 0; top: {H - 10}px; width: {W}px; height: 10px; background: {DARK}"></div>'
            + inner +
            f'<img src="assets/wear-PAGE.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

def matchbook(o, x, y):
    """Prop: the room's matchbook, tucked over the corner of the picture."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 104px; height: 146px; background: {DARK}; '
             f'box-shadow: 0 2px 7px rgba(30,20,40,0.4); transform: rotate(-8deg); overflow: hidden">'
             f'<div style="position: absolute; left: 0; top: 12px; width: 104px; display: flex; justify-content: center">{diamond(RED, 10)}</div>'
             f'<div style="position: absolute; left: 0; top: 30px; width: 104px; text-align: center; font-family: {DISP}; font-size: 19px; line-height: 1.05; color: {PAPER}">Evening<br>Star Room</div>'
             f'<div style="position: absolute; left: 14px; top: 76px; width: 76px; height: 1px; background: {RED}"></div>'
             f'<div style="position: absolute; left: 0; top: 83px; width: 104px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; line-height: 1.25; letter-spacing: 0.08em; color: {PAPER}">DANCING<br>555-0214</div>'
             f'<div style="position: absolute; left: 0; top: 122px; width: 104px; height: 24px; background: {RED}"></div>'
             f'<div style="position: absolute; left: 0; top: 128px; width: 104px; height: 8px; background: repeating-linear-gradient(90deg, #6a4a4e 0 2px, #3a2a30 2px 4px)"></div>'
             '</div>')

def ticket(o, x, y):
    """Prop: an observatory ticket for the same night."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 196px; height: 104px; background: {CARD}; '
             f'box-shadow: 0 2px 7px rgba(30,20,40,0.35); transform: rotate(5deg)">'
             f'<div style="position: absolute; left: 6px; top: 6px; width: 184px; height: 92px; border: 2px solid {RED}; box-sizing: border-box"></div>'
             f'<div style="position: absolute; left: 150px; top: 6px; width: 0; height: 92px; border-left: 2px dashed {RED}"></div>'
             f'<div style="position: absolute; left: 14px; top: 13px; width: 132px; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.16em; color: {RED}; line-height: 1.2">OBSERVATORY</div>'
             f'<div style="position: absolute; left: 14px; top: 32px; width: 132px; font-family: {DISP}; font-size: 25px; color: {DARK}; line-height: 1.1">86th Floor</div>'
             f'<div style="position: absolute; left: 14px; top: 64px; width: 132px; font-family: {BODY}; font-size: 14px; color: {DARK}; line-height: 1.25">Admit one<br>Feb. 14, 1993</div>'
             f'<div style="position: absolute; left: 152px; top: 52px; width: 40px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; color: {RED}; transform: rotate(-90deg)">0214</div>'
             '</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 84px; width: {CW}px; display: flex; justify-content: center">{kicker("Midtown Manhattan &nbsp;&middot;&nbsp; Sixty-fifth floor")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 110px; width: {CW}px; text-align: center; font-family: {DISP}; font-size: 66px; '
             f'line-height: 1.05; color: {DARK}; text-transform: uppercase; letter-spacing: 0.01em">Evening Star Room</div>')
    o.append(f'<div style="position: absolute; left: {L + 92}px; top: 196px">{ornament(CW - 184)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 212px; width: {CW}px; display: flex; justify-content: center">'
             f'{kicker("Valentine&rsquo;s night &nbsp;&middot;&nbsp; Sunday, February 14, 1993", DARK, 18)}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 256px; width: {CW}px; height: 340px; outline: 2px solid {RED}; outline-offset: 5px; background: {DARK}">'
             f'<img src="assets/still-heart.jpg" alt="The Empire State Building lit with a red heart over the Manhattan night skyline" '
             f'style="display: block; width: {CW}px; height: 340px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 610px; width: {CW}px; display: flex; justify-content: space-between; gap: 20px; '
             f'font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.3; color: {MUTE}">'
             f'<span>The view from our window tables on Valentine&rsquo;s night.</span><span>Ask for a window.</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 650px; width: {CW}px">'
             + bar('To begin', CW, 40)
             + item('Northwest salmon spread', '9.50', 'Hot-smoked fish worked into cream cheese and cr&egrave;me fra&icirc;che with dill, capers, lemon and horseradish. Toasted bagel chips.', 'Flown in overnight from Seattle.', 14)
             + item('Baltimore crab cake', '12.50', 'Maryland lump meat, barely bound and pan browned, with remoulade.', None, 14)
             + item('Jumbo shrimp cocktail', '14.00', 'Five on crushed ice with cocktail sauce and a wedge of lemon.', None, 14)
             + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 1006px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-size: 15px; color: {MUTE}">'
             f'<span>Dinner from six. Dancing until one.</span><span>Reservations (212) 555-0214</span></div>')
    matchbook(o, L - 14, 240)
    ticket(o, L + CW - 178, 520)
    return page(''.join(o), 'Dinner and dancing nightly').replace('PAGE', 'front')

# ---------------- BACK ----------------
COLW, GAP = 340, 24
X2 = L + COLW + GAP

def reservation(o, x, y):
    """Prop and character note: Walter's reservation card, signed."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {COLW - 10}px; background: {CARD}; '
             f'box-shadow: 0 2px 7px rgba(30,20,40,0.32); transform: rotate(-2deg); padding: 12px 16px 8px; box-sizing: border-box">'
             f'<div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid {RED}; padding-bottom: 6px">'
             f'{kicker("Reserved", RED, 16)}<span style="font-family: {DISP}; font-size: 18px; color: {DARK}">Table 14</span></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.4; color: {DARK}; margin-top: 8px">'
             f'Two at eight, by the window. Please let the kitchen know about my allergies. Something mild.</div>'
             f'<div style="font-family: {SIG}; font-size: 36px; line-height: 1.1; color: {DARK}; margin-top: 2px">Walter Jackson</div>'
             '</div>')

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 82px">{kicker("Supper is served from six")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 104px; font-family: {DISP}; font-size: 64px; line-height: 1.05; color: {DARK}; text-transform: uppercase">The Menu</div>')
    o.append(f'<div style="position: absolute; left: {L + 360}px; top: 112px; width: {CW - 360}px; text-align: right; font-family: {DISP}; font-size: 30px; line-height: 1.1; color: {RED}">Evening Star Room</div>'
             f'<div style="position: absolute; left: {L + 360}px; top: 150px; width: {CW - 360}px; text-align: right; font-family: {BODY}; font-style: italic; font-size: 16px; color: {MUTE}">Sixty-fifth floor</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 186px">{ornament(CW)}</div>')
    col = lambda x, inner: f'<div style="position: absolute; left: {x}px; top: 208px; width: {COLW}px">{inner}</div>'
    left = (bar('The kitchen', COLW, 34)
            + item('Baked salmon', '26.00', 'Fillet roasted under parsley, grated lemon peel and bread crumbs. Steamed green beans, warm butter spooned over.', 'Mild. Nothing to sneeze at.', 12)
            + item('Filet mignon', '34.00', 'Ten ounces, broiled to order, with b&eacute;arnaise and potatoes Anna.', None, 14)
            + item('Roast half chicken', '24.00', 'Rosemary and garlic, pan juices, wild rice.', None, 14)
            + '<div style="height: 22px"></div>'
            + bar('Sweets', COLW, 34)
            + item('Valentine hearts', '2.14', 'Sugar cookies made with browned butter, cut by hand, iced red and white.', 'A pair on every saucer tonight.', 12)
            + item('Souffl&eacute; for two', '14.00', 'Dark chocolate, baked to order, warm sauce poured at the table.', None, 14))
    right = (bar('The lounge', COLW, 34)
             + item('Iced mocha', '4.50', 'Strong coffee with dark chocolate melted through, cold milk over ice, whipped cream and cocoa.', 'The way they take it in Seattle.', 12)
             + item('Late show popcorn', '3.50', 'Popped in coconut oil, tossed with browned butter and sea salt.', 'Bar radio stays on the call-in show.', 14)
             + item('Espresso', '2.50', 'Pulled at the bar, with a twist of lemon peel.', None, 14)
             + f'<div style="margin-top: 20px; border: 2px solid {RED}; padding: 4px; background: {CARD}; width: {COLW - 12}px; box-sizing: content-box">'
             f'<img src="assets/still-window-table.jpg" alt="A couple at a candlelit table set with red and white flowers" style="display: block; width: {COLW - 12}px; height: 200px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.3; color: {MUTE}; margin-top: 6px">Candles and roses on every table, February 14.</div>')
    o.append(col(L, left)); o.append(col(X2, right))
    o.append(f'<div style="position: absolute; left: {L}px; top: 988px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.45"></div>'
             f'<div style="position: absolute; left: {L}px; top: 996px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 15px; color: {MUTE}">'
             f'<span>Form 0214. Printed in U.S.A. &copy; 1993.</span><span>Prices subject to change.</span></div>')
    reservation(o, X2 + 4, 830)
    return page(''.join(o), 'Dinner and dancing nightly').replace('PAGE', 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Evening Star Room menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
