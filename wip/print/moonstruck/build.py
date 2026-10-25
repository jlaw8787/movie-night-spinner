"""Il Gran Lunario, Ristorante Italiano, Thompson Street, Greenwich Village, 1987.
The kind of Village Italian room where Loretta, Johnny, Cosmo and Rose all end up eating.
Two-sided table card, US Letter, two inks (midnight navy and moon gold) on pale moonlight-blue stock.
Front: the sign, Cosmo's moon over the bridge, secondi and pasta. Back: antipasti, dolci,
late supper after the opera, the bar, the family on the wall, the baker's note and a matchbook.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, DARK, GOLD, MUTE, RED = '#e4e8ea', '#18233d', '#a3781c', '#4a5468', '#a8232f'
FONTS = ('https://fonts.googleapis.com/css2?family=Rozha+One'
         '&family=Crimson+Pro:ital,wght@0,400;0,600;0,700;1,400&family=Italianno&family=Mynerve&display=swap')
DISP = "'Rozha One', serif"; BODY = "'Crimson Pro', serif"
SCRIPT = "'Italianno', cursive"; HAND = "'Mynerve', cursive"


def kicker(t, color=GOLD, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 19px; letter-spacing: 0.26em; color: {color}; '
            f'text-transform: uppercase; line-height: 1;{extra}">{t}</div>')


def band(t, size=40):
    """Section title: a navy band with paper type and a gold hairline under it."""
    return (f'<div style="display: inline-block; background: {DARK}; color: {PAPER}; font-family: {DISP}; font-size: {size}px; '
            f'line-height: 1; letter-spacing: 0.03em; padding: 12px 20px 6px 18px; text-transform: uppercase; '
            f'border-bottom: 4px solid {GOLD}">{t}</div>')


def item(name, price, desc, gap=16):
    return (f'<div style="margin-top: {gap}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 16px; font-family: {BODY}; font-weight: 700; '
            f'font-size: 28px; line-height: 1.12; color: {DARK}">'
            f'<span>{name}</span><span style="color: {GOLD}">{price}</span></div>'
            f'<div style="font-family: {BODY}; font-size: 21px; line-height: 1.28; color: {DARK}; margin-top: 2px">{desc}</div></div>')


def moon(x, y, d):
    """The house mark: a full moon in gold with a pale face."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {d}px; height: {d}px; border-radius: 50%; '
            f'background: radial-gradient(circle at 38% 36%, #fbf6e4 0%, #f0e2b6 45%, #d9bd72 100%); border: 3px solid {GOLD}; box-sizing: border-box">'
            f'<div style="position: absolute; left: {d*0.52}px; top: {d*0.22}px; width: {d*0.16}px; height: {d*0.13}px; border-radius: 50%; background: #d6bf86; opacity: 0.7"></div>'
            f'<div style="position: absolute; left: {d*0.26}px; top: {d*0.55}px; width: {d*0.22}px; height: {d*0.17}px; border-radius: 50%; background: #d6bf86; opacity: 0.6"></div>'
            f'<div style="position: absolute; left: {d*0.6}px; top: {d*0.6}px; width: {d*0.1}px; height: {d*0.09}px; border-radius: 50%; background: #d6bf86; opacity: 0.6"></div>'
            '</div>')


def page(inner, face):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.26">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {DARK}"></div>'
            f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; height: 3px; background: {GOLD}"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 10}px; width: {W}px; height: 10px; background: {DARK}"></div>'
            + inner +
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


L, CW = 56, 704


def check(o, gx, gy):
    """Guest check prop: table 4, two covers, stamped PAID."""
    lines = [('Tbl 4 . 2 cov.', None), ('1 scaloppine', '12.50'), ('1 linguine clam', '10.75'), ('2 amaretto sour', '7.50'), ('Total', '30.75')]
    rows = ''
    for i, (t, p) in enumerate(lines):
        rows += (f'<div style="position: absolute; left: 0; top: {54 + i * 27}px; width: 214px; height: 27px; border-bottom: 1px solid #b7c3d6"></div>'
                 f'<div style="position: absolute; left: 12px; top: {57 + i * 27}px; width: 192px; display: flex; justify-content: space-between; '
                 f'font-family: {HAND}; font-size: 18px; line-height: 1.2; color: #23336f"><span>{t}</span><span>{p or ""}</span></div>')
    o.append(f'<div style="position: absolute; left: {gx}px; top: {gy}px; width: 214px; height: 200px; background: #fbfaf4; '
             f'box-shadow: 0 2px 7px rgba(10,20,40,0.35); transform: rotate(4deg)">'
             f'<div style="position: absolute; left: 0; top: 0; width: 214px; height: 44px; border-bottom: 2px solid {DARK}; display: flex; '
             f'justify-content: space-between; align-items: center; padding: 0 12px; box-sizing: border-box; font-family: {BODY}; font-weight: 700; '
             f'font-size: 16px; letter-spacing: 0.12em; color: {DARK}"><span>GUEST CHECK</span><span style="color: {RED}">No. 1987</span></div>'
             + rows +
             f'<div style="position: absolute; left: 92px; top: 96px; border: 3px solid {RED}; border-radius: 4px; padding: 4px 10px 1px; '
             f'font-family: {DISP}; font-size: 32px; line-height: 1; letter-spacing: 0.1em; color: {RED}; opacity: 0.8; transform: rotate(-14deg)">PAID</div>'
             '</div>')


def ticket(o, x, y):
    """Prop: an opera ticket stub tucked in the corner of the picture."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 190px; height: 104px; background: #f6efdc; '
             f'box-shadow: 0 2px 7px rgba(10,20,40,0.4); transform: rotate(-6deg); border-left: 2px dashed {MUTE}">'
             f'<div style="position: absolute; left: 6px; top: 6px; width: 172px; height: 88px; border: 2px solid {RED}"></div>'
             f'<div style="position: absolute; left: 0; top: 14px; width: 190px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.18em; color: {RED}">THE OPERA HOUSE</div>'
             f'<div style="position: absolute; left: 0; top: 32px; width: 190px; text-align: center; font-family: {DISP}; font-size: 30px; line-height: 1.1; color: {DARK}">La Boh&egrave;me</div>'
             f'<div style="position: absolute; left: 0; top: 70px; width: 190px; text-align: center; font-family: {BODY}; font-weight: 600; font-size: 14px; letter-spacing: 0.08em; color: {DARK}">ORCH. &nbsp;ROW K &nbsp;SEAT 2</div>'
             '</div>')


def matchbook(o, x, y):
    """Prop: the house matchbook."""
    o.append(f'<div style="position: absolute; left: {x}px; top: {y}px; width: 104px; height: 150px; background: {DARK}; '
             f'box-shadow: 0 2px 7px rgba(10,20,40,0.4); transform: rotate(-8deg); overflow: hidden">'
             + moon(30, 12, 44) +
             f'<div style="position: absolute; left: 0; top: 60px; width: 104px; text-align: center; font-family: {DISP}; font-size: 17px; line-height: 1.05; color: {PAPER}">IL GRAN<br>LUNARIO</div>'
             f'<div style="position: absolute; left: 0; top: 98px; width: 104px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.06em; color: #e6c873">THOMPSON ST.</div>'
             f'<div style="position: absolute; left: 0; top: 122px; width: 104px; height: 28px; background: #f0e2b6"></div>'
             f'<div style="position: absolute; left: 0; top: 128px; width: 104px; height: 9px; background: repeating-linear-gradient(90deg, #8e6c3a 0 2px, #4b3a24 2px 4px)"></div>'
             '</div>')


# ---------------- FRONT ----------------
def front():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{kicker("Thompson Street, Greenwich Village")}{kicker("Dinner and late supper", DARK)}</div>')
    o.append(moon(L, 80, 108))
    o.append(f'<div style="position: absolute; left: {L + 130}px; top: 78px; font-family: {DISP}; font-size: 72px; line-height: 1.1; '
             f'color: {DARK}; text-transform: uppercase; letter-spacing: 0.01em">Il Gran Lunario</div>')
    o.append(f'<div style="position: absolute; left: {L + 134}px; top: 162px; width: {CW - 134}px; display: flex; justify-content: space-between; align-items: center">'
             f'{kicker("Ristorante Italiano", GOLD)}'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 20px; color: {MUTE}">La bella luna, every night.</div></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 204px; width: {CW}px; height: 3px; background: {GOLD}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 226px; width: {CW}px; height: 372px; outline: 2px solid {GOLD}; outline-offset: 5px; background: {DARK}">'
             f'<img src="assets/still-moon-bridge.jpg" alt="A full moon over the Brooklyn Bridge at night" '
             f'style="display: block; width: {CW}px; height: 372px"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 612px; width: {CW}px; display: flex; justify-content: space-between; '
             f'font-family: {BODY}; font-style: italic; font-size: 17px; color: {MUTE}">'
             f'<span>Cosmo&rsquo;s moon, over the bridge to Brooklyn.</span><span>Secondi served with a green salad</span></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 648px; width: {CW}px">'
             + band('Secondi e pasta')
             + item('Chicken scaloppine piccata', '12.50', 'Breast pounded thin, floured and saut&eacute;ed, finished with lemon, white wine, capers and butter.', 14)
             + item('Veal parmigiana', '13.75', 'Breaded cutlet under marinara and melted mozzarella, a side of ziti.', 12)
             + item('Linguine with white clam sauce', '10.75', 'Littlenecks opened in garlic, olive oil and white wine, with parsley.', 12)
             + item('Rigatoni with sausage', '9.50', 'Sweet fennel sausage and peppers in a slow tomato gravy.', 12)
             + '</div>')
    ticket(o, L - 14, 246)
    check(o, L + CW - 200, 380)
    return page(''.join(o), 'front')


# ---------------- BACK ----------------
COLW, GAP = 330, 44
X2 = L + COLW + GAP


def back():
    o = []
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px">{kicker("Dinner from five. Late supper after the opera.")}</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 72px">{band("Il menu", 62)}</div>')
    o.append(moon(L + CW - 94, 62, 94))
    o.append(f'<div style="position: absolute; left: {L + 300}px; top: 82px; width: {CW - 410}px; text-align: right; font-family: {DISP}; font-size: 34px; '
             f'line-height: 1.05; color: {DARK}; text-transform: uppercase">Il Gran<br>Lunario</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 174px; width: {CW}px; height: 3px; background: {GOLD}"></div>')
    col = lambda x, inner: f'<div style="position: absolute; left: {x}px; top: 194px; width: {COLW}px">{inner}</div>'
    left = (band('Antipasti')
            + item('Rosemary focaccia', '2.50', 'From a Brooklyn baker, dimpled with olive oil and coarse salt. Cut by hand.')
            + item('Mozzarella in carrozza', '4.75', 'Fried golden in an egg batter, anchovy and caper sauce.')
            + item('Stuffed artichoke', '5.25', 'Breadcrumbs, pecorino and garlic, steamed tender.')
            + f'<div style="height: 1px; background: {DARK}; opacity: 0.4; margin: 22px 0 20px"></div>'
            + band('Dolci')
            + item('Cannoli, two', '3.50', 'Ricotta beaten with sugar and orange zest, shells dipped in chocolate. Filled to order.')
            + item('Espresso', '1.25', 'Short and black, lemon peel on the side. Snap out of it.'))
    right = (band('Late supper')
             + item('Eggs in the hole', '4.25', 'Thick white toast fried in butter, a ring of red pepper, the egg set in the middle, yolk soft.')
             + f'<div style="height: 1px; background: {DARK}; opacity: 0.4; margin: 20px 0 18px"></div>'
             + band('Dal bar')
             + item('Amaretto sour', '3.75', 'Shaken frothy with lemon and egg white, over ice, a cherry on top.')
             + item('Champagne', '19.87', 'The bottle, for a toast to la famiglia.')
             + f'<div style="margin-top: 18px; border: 2px solid {GOLD}; padding: 4px; background: #f7f5ee">'
             f'<img src="assets/still-family.jpg" alt="A big family gathered in a parlor for a photograph" style="display: block; width: 318px; height: 150px"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.3; color: {MUTE}; margin-top: 6px">Regulars. The whole family, on our wall.</div>')
    o.append(col(L, left)); o.append(col(X2, right))
    # baker's note across the foot of the left column
    o.append(f'<div style="position: absolute; left: {L + 118}px; top: 826px; width: {CW - 118}px">'
             + kicker('From the ovens') +
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.35; color: {DARK}; margin-top: 8px">The bread on your table comes over the bridge from my ovens every afternoon. Eat it warm. I&rsquo;ll be at the opera.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 50px; line-height: 0.9; color: {RED}; margin-top: 2px">Ronny, your baker</div></div>')
    matchbook(o, L - 4, 836)
    o.append(f'<div style="position: absolute; left: {L}px; top: 990px; width: {CW}px; height: 1px; background: {DARK}; opacity: 0.5"></div>'
             f'<div style="position: absolute; left: {L}px; top: 997px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 16px; color: {MUTE}">'
             f'<span>Thompson St., N.Y. 10012. (212) 555-1987. Proposals taken on one knee.</span><span>Prices subject to change.</span></div>')
    return page(''.join(o), 'back')


FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Il Gran Lunario menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
