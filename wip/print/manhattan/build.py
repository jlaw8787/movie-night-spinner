"""Edie's, Second Avenue at 88th Street, New York, 1979.
The saloon where Manhattan opens: Isaac, Tracy, Yale and Emily at the back table, everyone talking at once.
The house's own two-sided table card (US Letter), black ink and one blue on bright white stock,
built on the house style lock. Front: sign, the bridge at dawn, the bar list and a guest check.
Back: brunch, late supper, desserts, a still of the back table, a matchbook and a note from a regular.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, BLUE, MUTE = '#f3f2ee', '#161618', '#2b4f9e', '#55565c'
FONTS = ('https://fonts.googleapis.com/css2?family=Poiret+One&family=Josefin+Sans:wght@600;700'
         '&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=Allura&display=swap')
DISP = "'Poiret One', sans-serif"; SANS = "'Josefin Sans', sans-serif"
BODY = "'Crimson Pro', serif"; SCRIPT = "'Allura', cursive"

def kicker(t, color=BLUE, extra=''):
    return (f'<div style="font-family: {SANS}; font-weight: 700; font-size: 18px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')

def band(t, size=44, side=''):
    """Section title: black band, deco hairline inset, Poiret One in paper white."""
    s = (f'<span style="font-family: {SANS}; font-weight: 600; font-size: 16px; letter-spacing: 0.16em; color: #b9c6e6; text-transform: uppercase">{side}</span>' if side else '')
    return (f'<div style="background: {DARK}; padding: 4px">'
            f'<div style="border: 1px solid #8d8f96; display: flex; justify-content: space-between; align-items: center; padding: 6px 16px 4px">'
            f'<span style="font-family: {DISP}; font-size: {size}px; line-height: 1.05; color: {PAPER}; letter-spacing: 0.08em; text-transform: uppercase; '
            f'-webkit-text-stroke: 0.6px {PAPER}">{t}</span>{s}</div></div>')

def item(name, price, desc, note='', gap=16, size=29, caps=True, dsize=21):
    n = (f'<div style="font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.3; color: {BLUE}; margin-top: 2px">{note}</div>' if note else '')
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px; font-family: {SANS}; font-weight: 700; '
            f'font-size: {size}px; line-height: 1.12; color: {DARK}; {"text-transform: uppercase; letter-spacing: 0.03em" if caps else "letter-spacing: 0.005em"}">'
            f'<span>{name}</span><span style="color: {BLUE}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: {dsize}px; line-height: 1.28; color: {DARK}; margin-top: 3px">{desc}</div>{n}</div>')

def page(inner, face):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.22">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 12px; background: {DARK}"></div>'
            f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; height: 3px; background: {BLUE}"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 12}px; width: {W}px; height: 12px; background: {DARK}"></div>'
            + inner +
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')

L, CW = 56, 704

def check(o, gx, gy):
    """Guest check prop: the opening night's table, stamped PAID."""
    lines = [('Davis, party of 4', None), ('3 Manhattan', '7.50'), ('1 ginger ale', '.75'), ('1 crostini', '2.75'), ('', None), ('', None), ('Total', '11.00')]
    rows = ''
    for i, (t, p) in enumerate(lines):
        rows += (f'<div style="position: absolute; left: 0; top: {56 + i * 27}px; width: 220px; height: 27px; border-bottom: 1px solid #b3bfd9"></div>'
                 f'<div style="position: absolute; left: 12px; top: {59 + i * 27}px; width: 196px; display: flex; justify-content: space-between; '
                 f'font-family: {BODY}; font-style: italic; font-size: 18px; line-height: 1.2; color: #1d2c5e"><span>{t}</span><span>{p or ""}</span></div>')
    o.append(f'<div style="position: absolute; left: {gx}px; top: {gy}px; width: 220px; height: 258px; background: #fcfcfa; '
             f'box-shadow: 0 2px 7px rgba(20,20,30,0.30); transform: rotate(-3deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 220px; height: 44px; border-bottom: 2px solid {DARK}; display: flex; '
             f'justify-content: space-between; align-items: center; padding: 3px 12px 0; box-sizing: border-box; font-family: {SANS}; font-weight: 700; '
             f'font-size: 15px; letter-spacing: 0.14em; color: {DARK}"><span>EDIE&rsquo;S</span><span style="color: {BLUE}">TABLE 4</span></div>'
             + rows +
             f'<div style="position: absolute; left: 30px; top: 170px; border: 3px solid {BLUE}; border-radius: 4px; padding: 5px 10px 1px; '
             f'font-family: {SANS}; font-weight: 700; font-size: 30px; line-height: 1; letter-spacing: 0.12em; color: {BLUE}; opacity: 0.8; transform: rotate(-9deg)">PAID</div>'
             '</div>')

def matchbook(o, x, y):
    """Prop: the house matchbook, tucked over the corner of the photograph."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 100px; height: 146px; background: {DARK}; '
             f'box-shadow: 0 2px 7px rgba(20,20,30,0.38); transform: rotate(-8deg); overflow: hidden">'
             f'<div style="position: absolute; left: 6px; top: 6px; width: 86px; height: 98px; border: 1px solid #8d8f96"></div>'
             f'<div style="position: absolute; left: 0; top: 16px; width: 100px; text-align: center; font-family: {DISP}; font-size: 34px; line-height: 1.1; color: {PAPER}; -webkit-text-stroke: 0.5px {PAPER}">Edie&rsquo;s</div>'
             f'<div style="position: absolute; left: 22px; top: 60px; width: 56px; height: 2px; background: {BLUE}"></div>'
             f'<div style="position: absolute; left: 0; top: 68px; width: 100px; text-align: center; font-family: {SANS}; font-weight: 700; font-size: 14px; line-height: 1.3; letter-spacing: 0.08em; color: {PAPER}">2ND AVE<br>AT 88TH</div>'
             f'<div style="position: absolute; left: 0; top: 112px; width: 100px; height: 34px; background: {BLUE}"></div>'
             f'<div style="position: absolute; left: 0; top: 118px; width: 100px; height: 9px; background: repeating-linear-gradient(90deg, #7a6a5a 0 2px, #3a3029 2px 4px)"></div>'
             '</div>')

# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Second Avenue at 88th Street")}{kicker("Dinner till two", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 4}px; top: 62px; font-family: {DISP}; font-size: 128px; line-height: 1.05; color: {DARK}; '
             f'-webkit-text-stroke: 1.6px {DARK}; letter-spacing: 0.01em">Edie&rsquo;s</div>')
    o.append(f'<div style="position: absolute; left: {L + 360}px; top: 84px; width: {CW - 360}px; text-align: right; font-family: {DISP}; font-size: 46px; '
             f'line-height: 1.04; color: {DARK}; -webkit-text-stroke: 0.9px {DARK}; text-transform: uppercase; letter-spacing: 0.06em">Restaurant<br>&amp; Saloon</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 204px; width: {CW}px; height: 3px; background: {DARK}"></div>'
             f'<div style="position: absolute; left: {L}px; top: 210px; width: {CW}px; height: 1px; background: {BLUE}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 230px; width: {CW}px; height: 350px; outline: 2px solid {BLUE}; outline-offset: 5px">'
             f'<img src="assets/still-bridge.jpg" alt="Two figures on a bench under the Queensboro Bridge at dawn" '
             f'style="display: block; width: {CW}px; height: 350px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 594px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 17px; color: {MUTE}">'
             f'<span>The bridge at first light. Our last tables often end up here.</span><span>Est. 1963</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 630px; width: {CW}px">'
             + kicker('Chapter one') + '<div style="height: 10px"></div>'
             + band('At the bar', 44, 'From six o&rsquo;clock')
             + item('Manhattan', '2.50', 'Rye, sweet vermouth and bitters, stirred cold, served up with a cherry.',
                    'The pitcher for your table, 17.00.', 14)
             + item('Crostini misti', '2.75', 'Little rounds of French bread, toasted. Ricotta with lemon peel and honey, or mushrooms, garlic and thyme under Parmesan.', '', 14)
             + item('Shrimp cocktail', '4.95', 'Jumbo shrimp, poached and well chilled, with a sharp horseradish sauce and lemon.', '', 14)
             + '</div>')
    check(o, L - 10, 318)
    return page(''.join(o), 'front')

# ---------------- BACK ----------------
LW, RW, GAP = 368, 296, 40
X2 = L + LW + GAP

def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Upper East Side, New York")}{kicker("Chapters two to four", DARK)}</div>')
    o.append(f'<div style="position: absolute; left: {L - 2}px; top: 64px; font-family: {DISP}; font-size: 76px; line-height: 1.05; color: {DARK}; -webkit-text-stroke: 1.1px {DARK}">Edie&rsquo;s</div>')
    o.append(f'<div style="position: absolute; left: {L + 300}px; top: 92px; width: {CW - 300}px; text-align: right; font-family: {BODY}; font-style: italic; '
             f'font-size: 21px; line-height: 1.35; color: {MUTE}">Brunch on Sundays from eleven.<br>Supper every night, late.</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 162px; width: {CW}px; height: 3px; background: {DARK}"></div>'
             f'<div style="position: absolute; left: {L}px; top: 168px; width: {CW}px; height: 1px; background: {BLUE}"></div>')
    it = lambda *a, **k: item(*a, size=25, caps=False, dsize=19, gap=k.pop('gap', 12), **k)
    left = (kicker('Chapter two') + '<div style="height: 10px"></div>' + band('Sunday brunch', 38)
            + it('Sutton Place platter', '5.50', 'Toasted bagels, cream cheese, sliced Nova, capers, red onion cut thin and fresh dill.',
                 note='Wrapped to go for the bench by the bridge.')
            + it('Belgian waffles', '3.50', 'Crisp squares with maple syrup, sweet butter and berries in season.',
                 note='Dachshunds welcome at brunch.')
            + f'<div style="height: 1px; background: {DARK}; opacity: 0.4; margin: 20px 0 18px"></div>'
            + kicker('Chapter three') + '<div style="height: 10px"></div>' + band('Late supper', 38)
            + it('Chicken Kung Pao', '7.25', 'Diced dark meat stir-fried hot with dried red peppers, soy, rice wine and black vinegar. Roasted peanuts, scallions and rice.',
                 note='Szechuan style. Packed to go for the late movie.')
            + it('Linguine, white clam', '7.75', 'Littlenecks opened in garlic, oil and white wine, with parsley and red pepper.')
            + it('Veal piccata', '9.50', 'Thin scallops saut&eacute;ed in butter with lemon, capers and dry vermouth.'))
    right = (f'<div style="border: 2px solid {BLUE}; padding: 4px; background: #fcfcfa">'
             f'<img src="assets/still-table.jpg" alt="Friends talking over wine at the back table" style="display: block; width: {RW - 12}px; height: {round((RW - 12) * 169 / 300)}px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.3; color: {MUTE}; margin-top: 6px">The back table, any night.</div>'
             + '<div style="height: 18px"></div>' + kicker('Chapter four') + '<div style="height: 10px"></div>' + band('Desserts', 38)
             + it('NY cheesecake', '2.50', 'Lemon and vanilla on a buttery crumb crust. Baked slow, chilled overnight.',
                  note='Worth living for, the regulars say.')
             + it('Pears in red wine', '2.25', 'Bosc halves poached with cinnamon and orange peel. Heavy cream.',
                  note='Our answer to C&eacute;zanne.')
             + f'<div style="height: 1px; background: {DARK}; opacity: 0.4; margin: 20px 0 16px"></div>'
             + kicker('From a regular') +
             f'<div style="font-family: {BODY}; font-size: 18px; line-height: 1.4; color: {DARK}; margin-top: 8px">Best room in New York to argue about Bergman until two. Get the cheesecake. It&rsquo;s on my list.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 40px; line-height: 1.1; color: {BLUE}; margin-top: 2px">Isaac Davis</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 190px; width: {LW}px">{left}</div>')
    o.append(f'<div style="position: absolute; left: {X2}px; top: 190px; width: {RW}px">{right}</div>')
    matchbook(o, X2 + RW - 108, 236)
    o.append(f'<div style="position: absolute; left: {L}px; top: 962px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 970px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 15px; line-height: 1.3; color: {MUTE}">'
             f'<span>Second Ave. at 88th St., N.Y. 10028. Book parties in the back room.<br>Tap water on request. It runs clear. Nothing here is overrated.</span>'
             f'<span style="text-align: right">Menu No. 79<br>Prices subject to change.</span></div>')
    return page(''.join(o), 'back')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Edie\'s menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
