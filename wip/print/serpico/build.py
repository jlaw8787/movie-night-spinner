"""Garfein's Delicatessen & Appetizing, West 10th Street, Greenwich Village, 1967.
The deli's own two-sided counter menu card (US Letter), two inks on warm stock, built on the house
style lock (Jurassic system). Front: sign, painted storefront, the steam table. Back: appetizing,
bakery, fountain, the owner's note and a guest check stamped PAID.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, RED, MUTE = '#f3ead6', '#211d1b', '#b5262b', '#5d544c'
FONTS = ('https://fonts.googleapis.com/css2?family=Antonio:wght@600;700'
         '&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Patrick+Hand&family=Yellowtail&display=swap')
DISP = "'Antonio', sans-serif"; BODY = "'Libre Baskerville', serif"
SCRIPT = "'Yellowtail', cursive"; HAND = "'Patrick Hand', cursive"

def kicker(t, color=RED, extra=''):
    return f'<div style="font-family: {DISP}; font-weight: 700; font-size: 19px; letter-spacing: 0.24em; color: {color}; text-transform: uppercase; line-height: 1;{extra}">{t}</div>'

def bar(t, size=42):
    return (f'<div style="display: inline-block; background: {DARK}; color: {PAPER}; font-family: {DISP}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1; letter-spacing: 0.02em; padding: 8px 16px 9px; text-transform: uppercase">{t}</div>')

def item(name, price, desc, gap=18):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-family: {DISP}; font-weight: 700; '
            f'font-size: 29px; line-height: 1.12; color: {DARK}; text-transform: uppercase; letter-spacing: 0.01em">'
            f'<span>{name}</span><span style="color: {RED}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 19.5px; line-height: 1.4; color: {DARK}; margin-top: 3px">{desc}</div></div>')

def page(inner):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.30">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 14px; background: {RED}"></div>'
            f'<div style="position: absolute; left: 0; top: 14px; width: {W}px; height: 4px; background: {DARK}"></div>'
            + inner +
            f'<img src="assets/wear-PAGE.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

L, CW = 56, 704

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Greenwich Village, New York")}{kicker("Since 1938", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 4}px; top: 70px; font-family: {SCRIPT}; font-size: 104px; line-height: 1.15; color: {RED}">Garfein&rsquo;s</div>')
    o.append(f'<div style="position: absolute; left: {L + 300}px; top: 104px; width: {CW - 300}px; text-align: right; font-family: {DISP}; font-weight: 700; '
             f'font-size: 60px; line-height: 0.96; color: {DARK}; text-transform: uppercase; letter-spacing: 0.005em">Delicatessen<br>&amp; Appetizing</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 236px; width: {CW}px; height: 3px; background: {RED}"></div>')
    # hero: the painted storefront in a thin red frame
    o.append(f'<div style="position: absolute; left: {L}px; top: 256px; width: {CW}px; height: 300px; outline: 2px solid {RED}; outline-offset: 5px">'
             f'<img src="assets/storefront.png" alt="Line drawing of the Garfein\'s storefront, red striped awning, salamis in the window" '
             f'style="display: block; width: {CW}px; height: 300px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 572px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 16px; color: {MUTE}">'
             f'<span>Our store on West 10th Street, a few doors from the Sixth Precinct.</span><span>Open 7 to midnight</span></div>')
    # the steam table
    o.append(f'<div style="position: absolute; left: {L}px; top: 614px; width: {CW}px">'
             f'<div style="display: flex; align-items: flex-end; justify-content: space-between">{bar("Hot from the steam table")}'
             f'{kicker("On rye or a roll", RED, " margin-bottom: 6px")}</div>'
             + item('Hot pastrami on rye', '1.35', 'Steamed soft, sliced by hand and piled high. Brown mustard and a dill pickle.')
             + item('The Village hero', '1.73', 'Steamed pastrami, Swiss cheese, cole slaw and Russian dressing with horseradish, all on a long Italian roll.')
             + item('Hot corned beef on rye', '1.35', 'Brisket cured in our own brine, carved to order, with mustard and a sour pickle.')
             + item('Roast beef on a kaiser', '1.25', 'Rare top round, sliced thin while you wait. Ask for it lean.')
             + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 990px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 998px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 15px; color: {MUTE}">'
             f'<span>Any sandwich as a platter, with slaw, potato salad and pickle, 60&cent; more.</span><span>Over, please</span></div>')
    return page(''.join(o)).replace('PAGE', 'front')

# ---------------- BACK ----------------
COLW, GAP = 330, 44
X2 = L + COLW + GAP

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 50px">{kicker("Eat at the counter or take it home")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 80px">{bar("The menu", 64)}</div>')
    o.append(f'<div style="position: absolute; left: {L + 300}px; top: 76px; width: {CW - 300}px; text-align: right; font-family: {SCRIPT}; font-size: 66px; line-height: 1.15; color: {RED}">Garfein&rsquo;s</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 174px; width: {CW}px; height: 3px; background: {RED}"></div>')
    col = lambda x, inner: f'<div style="position: absolute; left: {x}px; top: 196px; width: {COLW}px">{inner}</div>'
    left = (bar('Appetizing', 40)
            + item('Nova on a bagel', '1.10', 'Toasted and spread thick with cream cheese, smoked salmon, capers, red onion and fresh dill.')
            + item('Chopped liver', '.95', 'Chicken livers with schmaltz, fried onion and egg, on rye.')
            + item('Potato knish', '.35', 'Baked golden, split and spread with brown mustard.')
            + f'<div style="height: 1px; background: {DARK}; opacity: 0.45; margin: 26px 0 24px"></div>'
            + bar('From our bakery', 40)
            + item('Black and white', '.25', 'Soft sour cream cake cookie, the flat side iced half vanilla, half chocolate.')
            + item('Cheesecake', '.45', 'Rich and dense, a thick slice baked here every morning.'))
    right = (bar('Fountain', 40)
             + item('Iced coffee float', '.45', 'Dark roast steeped overnight in the icebox, vanilla syrup, milk and a scoop of vanilla ice cream.')
             + item('Chocolate egg cream', '.20', 'Syrup, cold milk and seltzer from the siphon.')
             + item('Celery tonic', '.15', 'Ice cold, by the bottle.')
             + item('Coffee or tea', '.10', 'Hot all day. Tea comes in a glass.'))
    o.append(col(L, left)); o.append(col(X2, right))
    # the owner's note
    o.append(f'<div style="position: absolute; left: {X2}px; top: 690px; width: {COLW}px; height: 1px; background: {DARK}; opacity: 0.45"></div>')
    o.append(f'<div style="position: absolute; left: {X2}px; top: 708px; width: {COLW}px">{kicker("From the counter")}'
             f'<div style="font-family: {BODY}; font-size: 17px; line-height: 1.5; color: {DARK}; margin-top: 10px">Everybody pays at the register, the boys from the Sixth too. Saturday afternoons, the opera on the radio. Dogs wait outside, even the sheepdog.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 36px; line-height: 1.2; color: {RED}; margin-top: 4px">Morris Garfein</div></div>')
    # guest check prop, lower left, clear of all dish text
    gx, gy = L + 6, 768
    lines = [('Paco', None), ('1 pastrami rye', '1.35'), ('1 coffee', '.15'), ('', None), ('Total', '1.50')]
    rows = ''
    for i, (t, p) in enumerate(lines):
        rows += (f'<div style="position: absolute; left: 0; top: {58 + i * 27}px; width: 214px; height: 27px; border-bottom: 1px solid #9fbfa6"></div>'
                 f'<div style="position: absolute; left: 12px; top: {60 + i * 27}px; width: 194px; display: flex; justify-content: space-between; '
                 f'font-family: {HAND}; font-size: 20px; line-height: 1.2; color: #23336f"><span>{t}</span><span>{p or ""}</span></div>')
    o.append(f'<div style="position: absolute; left: {gx}px; top: {gy}px; width: 214px; height: 206px; background: #e4eedf; '
             f'box-shadow: 0 2px 6px rgba(40,30,20,0.28); transform: rotate(-3deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 214px; height: 46px; border-bottom: 2px solid #3f7d57; display: flex; '
             f'justify-content: space-between; align-items: center; padding: 0 12px; box-sizing: border-box; font-family: {DISP}; font-weight: 700; '
             f'font-size: 17px; letter-spacing: 0.12em; color: #3f7d57"><span>GUEST CHECK</span><span style="color: {RED}">No. 0619</span></div>'
             + rows +
             f'<div style="position: absolute; left: 96px; top: 104px; border: 3px solid {RED}; border-radius: 4px; padding: 2px 10px 3px; '
             f'font-family: {DISP}; font-weight: 700; font-size: 34px; line-height: 1; letter-spacing: 0.1em; color: {RED}; opacity: 0.82; transform: rotate(-14deg)">PAID</div>'
             '</div>')
    o.append(f'<div style="position: absolute; left: {L + 236}px; top: 838px; width: 96px; font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.4; color: {MUTE}">Pay the register on your way out.</div>')
    # footer
    o.append(f'<div style="position: absolute; left: {L}px; top: 990px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 998px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 15px; color: {MUTE}">'
             f'<span>West 10th Street, New York 10014. WAtkins 4-1967. We deliver. No charge accounts.</span><span>Prices subject to change</span></div>')
    return page(''.join(o)).replace('PAGE', 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Garfein\'s menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
