"""Edie's, Second Avenue at 88th Street, New York, 1979.
The saloon where Manhattan opens: Isaac, Tracy, Yale and Emily at the back table, everyone talking at once.
The house's folded table card (A4 folded to A5, two landscape faces 1123x794), black ink and one blue on
bright white stock. Outside: back panel (the room, house notes, matchbook, Isaac's cocktail napkin) and the
cover (a line engraving of the Queensboro Bridge at dawn with the bench). Inside: the menu spread.
Writes outside.body.html / inside.body.html and full pages outside.html / inside.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 1123, 794
FOLD = W / 2
PAPER, DARK, BLUE, MUTE = '#f3f2ee', '#161618', '#2b4f9e', '#55565c'
FONTS = ('https://fonts.googleapis.com/css2?family=Poiret+One&family=Josefin+Sans:wght@600;700'
         '&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Caveat:wght@500&display=swap')
DISP = "'Poiret One', sans-serif"; SANS = "'Josefin Sans', sans-serif"
BODY = "'Crimson Pro', serif"; HAND = "'Caveat', cursive"
STROKE = lambda px, c=DARK: f'-webkit-text-stroke: {px}px {c}'

def kicker(t, color=BLUE, extra=''):
    return (f'<div style="font-family: {SANS}; font-weight: 700; font-size: 18px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def chapter(num, title):
    """Section head: chapter kicker, Poiret One title, then a deco double hairline running to the edge."""
    return (kicker(f'Chapter {num}') +
            f'<div style="display: flex; align-items: center; gap: 16px; margin-top: 6px">'
            f'<span style="font-family: {DISP}; font-size: 44px; line-height: 1.05; color: {DARK}; {STROKE(0.9)}; letter-spacing: 0.04em; white-space: nowrap">{title}</span>'
            f'<span style="flex: 1; height: 7px; border-top: 2px solid {DARK}; border-bottom: 1px solid {BLUE}; margin-top: 6px"></span></div>')

def item(name, price, desc, note='', gap=13):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.25; color: {BLUE}; margin-top: 1px">{note}</div>' if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {SANS}; font-weight: 700; '
            f'font-size: 25px; line-height: 1.1; color: {DARK}; letter-spacing: 0.005em">'
            f'<span>{name}</span><span style="color: {BLUE}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.26; color: {DARK}; margin-top: 3px">{desc}</div>{n}</div>')

def page(inner, face):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            + inner +
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

PL, PW = 48, 466              # left panel content box
RL = round(FOLD) + 48         # right panel content left

def matchbook(o, x, y):
    """Prop: the house matchbook."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 100px; height: 146px; background: {DARK}; '
             f'box-shadow: 0 2px 7px rgba(20,20,30,0.38); transform: rotate(-8deg); overflow: hidden">'
             f'<div style="position: absolute; left: 6px; top: 6px; width: 86px; height: 98px; border: 1px solid #8d8f96"></div>'
             f'<div style="position: absolute; left: 0; top: 16px; width: 100px; text-align: center; font-family: {DISP}; font-size: 34px; line-height: 1.1; color: {PAPER}; {STROKE(0.5, PAPER)}">Edie&rsquo;s</div>'
             f'<div style="position: absolute; left: 22px; top: 60px; width: 56px; height: 2px; background: {BLUE}"></div>'
             f'<div style="position: absolute; left: 0; top: 68px; width: 100px; text-align: center; font-family: {SANS}; font-weight: 700; font-size: 14px; line-height: 1.3; letter-spacing: 0.08em; color: {PAPER}">2ND AVE<br>AT 88TH</div>'
             f'<div style="position: absolute; left: 0; top: 112px; width: 100px; height: 34px; background: {BLUE}"></div>'
             f'<div style="position: absolute; left: 0; top: 118px; width: 100px; height: 9px; background: repeating-linear-gradient(90deg, #7a6a5a 0 2px, #3a3029 2px 4px)"></div>'
             '</div>')

def napkin(o, x, y):
    """Prop: a cocktail napkin with an embossed border and a note from Isaac in pen."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 222px; height: 222px; background: #fdfdfb; '
             f'box-shadow: 0 2px 7px rgba(20,20,30,0.26); transform: rotate(4deg)">'
             f'<div style="position: absolute; left: 9px; top: 9px; width: 202px; height: 202px; border: 1px solid #d3d3d0"></div>'
             f'<div style="position: absolute; left: 13px; top: 13px; width: 194px; height: 194px; border: 1px solid #e2e2df"></div>'
             f'<div style="position: absolute; left: 0; top: 22px; width: 222px; text-align: center; font-family: {DISP}; font-size: 22px; line-height: 1; color: {BLUE}; {STROKE(0.3, BLUE)}">Edie&rsquo;s</div>'
             f'<div style="position: absolute; left: 24px; top: 52px; width: 176px; font-family: {HAND}; font-weight: 500; font-size: 22px; line-height: 1.05; color: #1c2647">'
             f'Best room in New York to argue about Bergman. Get the cheesecake. It&rsquo;s on my list.</div>'
             f'<div style="position: absolute; left: 118px; top: 166px; font-family: {HAND}; font-weight: 500; font-size: 30px; line-height: 1; color: #1c2647; transform: rotate(-4deg)">Ike</div>'
             '</div>')

# ---------------- OUTSIDE: back panel (left) and cover (right) ----------------
def outside():
    o = []
    # back panel
    o.append(f'<div style="position: absolute; left: {PL}px; top: 46px; width: {PW}px">{kicker("Upper East Side, New York")}</div>')
    o.append(f'<div style="position: absolute; left: {PL - 2}px; top: 76px; width: {PW}px; display: flex; justify-content: space-between; align-items: baseline">'
             f'<span style="font-family: {DISP}; font-size: 58px; line-height: 1; color: {DARK}; {STROKE(1.0)}">Edie&rsquo;s</span>'
             f'<span style="font-family: {BODY}; font-style: italic; font-size: 18px; color: {MUTE}">Est. 1963</span></div>')
    o.append(f'<div style="position: absolute; left: {PL}px; top: 146px; width: {PW}px; height: 2px; background: {DARK}"></div>'
             f'<div style="position: absolute; left: {PL}px; top: 151px; width: {PW}px; height: 1px; background: {BLUE}"></div>')
    o.append(f'<div style="position: absolute; left: {PL}px; top: 172px; width: {PW}px; height: 248px; outline: 1.5px solid {BLUE}; outline-offset: 4px">'
             f'<img src="assets/still-table.jpg" alt="Friends talking over wine at the back table" style="display: block; width: {PW}px; height: 248px"></div>')
    o.append(f'<div style="position: absolute; left: {PL}px; top: 430px; font-family: {BODY}; font-style: italic; font-size: 16px; color: {MUTE}">The back table, any night.</div>')
    notes = ['Brunch on Sundays from eleven.', 'Book parties in the back room.',
             'Tap water runs clear.', 'Nothing here is overrated.']
    o.append(f'<div style="position: absolute; left: {PL}px; top: 474px; width: 236px">' + kicker('House notes')
             + ''.join(f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.3; color: {DARK}; margin-top: 9px; '
                       f'padding-top: 8px; border-top: 1px solid rgba(22,22,24,0.25)">{t}</div>' for t in notes) + '</div>')
    napkin(o, PL + PW - 214, 478)
    matchbook(o, PL + PW - 74, 134)
    o.append(f'<div style="position: absolute; left: {PL}px; top: 702px; width: {PW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {PL}px; top: 710px; width: {PW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 15px; line-height: 1.3; color: {MUTE}">'
             f'<span>Second Ave. at 88th St., N.Y. 10028.<br>Menu No. 79.</span><span style="text-align: right">Dinner till two.<br>Prices subject to change.</span></div>')
    # cover: the engraving bleeds off the top and both panel edges, the name sits under it like a theatre bill
    cx, cw = round(FOLD), W - round(FOLD)
    o.append(f'<img src="assets/engraving-bridge.png" alt="Line engraving of the Queensboro Bridge at dawn, two people and a small dog on a bench" '
             f'style="position: absolute; left: {cx}px; top: 0; width: {cw}px; height: 540px; display: block">')
    o.append(f'<div style="position: absolute; left: {cx}px; top: 540px; width: {cw}px; height: 3px; background: {DARK}"></div>'
             f'<div style="position: absolute; left: {cx}px; top: 546px; width: {cw}px; height: 1px; background: {BLUE}"></div>')
    o.append(f'<div style="position: absolute; left: {RL}px; top: 566px; width: {PW}px; text-align: center">'
             f'{kicker("Second Avenue at 88th Street")}'
             f'<div style="font-family: {DISP}; font-size: 104px; line-height: 1.02; color: {DARK}; {STROKE(1.5)}; margin-top: 6px">Edie&rsquo;s</div>'
             f'<div style="font-family: {SANS}; font-weight: 700; font-size: 19px; letter-spacing: 0.34em; color: {DARK}; margin-top: 8px">RESTAURANT &amp; SALOON</div></div>')
    return page(''.join(o), 'outside')

# ---------------- INSIDE: the menu spread ----------------
def inside():
    o = []
    left = (chapter('one', 'At the bar')
            + item('Manhattan', '2.50', 'Rye, sweet vermouth and bitters, stirred cold, with a cherry.', 'The pitcher for your table, 17.00.')
            + item('Crostini misti', '2.75', 'Little rounds of French bread, toasted. Ricotta with lemon peel and honey, or mushrooms, garlic and thyme under Parmesan.')
            + item('Shrimp cocktail', '4.95', 'Jumbo shrimp, poached and well chilled, with a sharp horseradish sauce and lemon.')
            + '<div style="height: 20px"></div>' + chapter('two', 'Sunday brunch')
            + item('Sutton Place platter', '5.50', 'Toasted bagels, cream cheese, sliced Nova, capers, red onion cut thin and fresh dill.',
                   'Wrapped to go for the bench by the bridge.')
            + item('Belgian waffles', '3.50', 'Crisp squares, maple syrup, sweet butter, berries in season.', 'Dachshunds welcome at brunch.'))
    right = (chapter('three', 'Late supper')
             + item('Chicken Kung Pao', '7.25', 'Diced dark meat stir-fried hot with dried red peppers, soy, rice wine and black vinegar. Roasted peanuts, scallions and rice.',
                    'Szechuan style. Packed to go for the late movie.')
             + item('Linguine, white clam', '7.75', 'Littlenecks opened in garlic, oil and white wine, with parsley and red pepper.')
             + item('Veal piccata', '9.50', 'Thin scallops saut&eacute;ed in butter, lemon, capers and vermouth.')
             + '<div style="height: 20px"></div>' + chapter('four', 'Desserts')
             + item('NY cheesecake', '2.50', 'Lemon and vanilla on a buttery crumb crust. Baked slow, chilled overnight.', 'Worth living for, the regulars say.')
             + item('Pears in red wine', '2.25', 'Bosc halves poached with cinnamon and orange peel, with cream.', 'Our answer to C&eacute;zanne.'))
    o.append(f'<div style="position: absolute; left: {PL}px; top: 40px; width: {PW}px">{left}</div>')
    o.append(f'<div style="position: absolute; left: {RL}px; top: 40px; width: {PW}px">{right}</div>')
    return page(''.join(o), 'inside')

FACES = {'outside': outside(), 'inside': inside()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Edie\'s menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
