"""A Night for the South Bronx: the printed program for Frank White's black tie benefit dinner to keep a
South Bronx hospital open, New York, 1990. Gala program, two portrait faces 7 x 11 in (672 x 1056 px),
two inks (midnight navy, steel blue) on a cool pearl stock.
Cover: title, the signature photo (the South Bronx looking south to Manhattan, real 1973 public domain
photo printed as a two-ink halftone), the gala ticket, the host's welcome and the order of the evening.
Inside back: the dinner, a still of the host at the party, the pledge card.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 672, 1056
PAPER, NAVY, STEEL, ICE = '#e2e4df', '#142030', '#2b7da0', '#93c6dc'
FONTS = ('https://fonts.googleapis.com/css2?family=Italiana'
         '&family=Spectral:ital,wght@0,400;0,600;0,700;1,400;1,600&family=Mrs+Saint+Delafield&display=swap')
DISP = "'Italiana', serif"; BODY = "'Spectral', serif"; SCRIPT = "'Mrs Saint Delafield', cursive"
L, CW = 40, 592


def kicker(t, color=STEEL, extra=''):
    return (f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; letter-spacing: 0.22em; color: {color}; '
            f'text-transform: uppercase; line-height: 1.1;{extra}">{t}</div>')


def page(inner, wear):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.28">'
            + inner +
            f'<img src="assets/{wear}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            '</div>')


# ---------------- FRONT (cover) ----------------
def ticket(x, y):
    """Prop: the gala ticket, tucked into the program over the corner of the photo."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 258px; height: 126px; background: #f1f0ea; '
            f'box-shadow: 0 2px 7px rgba(10,20,30,0.35); transform: rotate(-4deg); display: flex">'
            f'<div style="width: 76px; height: 126px; background: {NAVY}; color: {PAPER}; border-right: 2px dashed {PAPER}; box-sizing: border-box; '
            f'display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: {BODY}">'
            f'<div style="font-size: 14px; letter-spacing: 0.2em; color: {ICE}">NO.</div>'
            f'<div style="font-size: 30px; font-weight: 700; line-height: 1">016</div>'
            f'<div style="font-size: 14px; letter-spacing: 0.04em; white-space: nowrap; color: {ICE}; margin-top: 4px">TABLE 1</div></div>'
            f'<div style="flex: 1; padding: 10px 12px 8px 14px; box-sizing: border-box; border: 2px solid {NAVY}; border-left: 0; position: relative">'
            f'<div style="position: absolute; left: 6px; top: 6px; right: 6px; bottom: 6px; border: 1px solid {STEEL}"></div>'
            f'<div style="font-family: {DISP}; font-size: 27px; line-height: 1; white-space: nowrap; color: {NAVY}; letter-spacing: 0.03em">ADMIT ONE</div>'
            f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.25; color: {NAVY}; margin-top: 6px">Guest of Mr. White</div>'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 6px; font-family: {BODY}; color: {STEEL}">'
            f'<span style="font-size: 14px; letter-spacing: 0.1em; font-weight: 600; white-space: nowrap">BLACK TIE</span>'
            f'<span style="font-size: 20px; font-weight: 700; color: {NAVY}">$1,000</span></div></div></div>')


def evening():
    rows = [('7:00', 'Champagne'), ('8:00', 'Dinner'), ('9:30', 'Our host'),
            ('10:00', 'Pledges'), ('12:00', 'Cars')]
    out = ''
    for t, w in rows:
        out += (f'<div style="display: flex; gap: 12px; align-items: baseline; padding: 3px 0 3px; border-bottom: 1px solid rgba(20,32,48,0.22)">'
                f'<span style="font-family: {BODY}; font-weight: 700; font-size: 19px; color: {STEEL}; width: 52px; flex: none">{t}</span>'
                f'<span style="font-family: {BODY}; font-size: 19px; color: {NAVY}; line-height: 1.2">{w}</span></div>')
    return out


def front():
    o = []
    # navy title flood
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 290px; background: {NAVY}"></div>'
             f'<div style="position: absolute; left: 0; top: 290px; width: {W}px; height: 5px; background: {STEEL}"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; justify-content: space-between">'
             + kicker('The South Bronx Hospital Fund', ICE) + kicker('1990', ICE) + '</div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 82px; width: {CW}px; text-align: center; font-family: {DISP}; color: {PAPER}">'
             f'<div style="font-size: 40px; line-height: 1; letter-spacing: 0.04em">A Night for the</div>'
             f'<div style="font-size: 82px; line-height: 1; letter-spacing: 0.02em; margin-top: 10px">SOUTH BRONX</div>'
             f'<div style="width: 120px; height: 1px; background: {ICE}; margin: 16px auto 0"></div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 21px; line-height: 1.3; margin-top: 12px; color: {PAPER}">'
             f'A black tie dinner to keep the hospital doors open</div></div>')
    # signature photo
    o.append(f'<div style="position: absolute; left: {L}px; top: 314px; width: {CW}px; height: 380px; border: 2px solid {STEEL}; box-sizing: border-box; padding: 4px; background: {PAPER}">'
             f'<img src="assets/hero-bronx-skyline.png" alt="The South Bronx looking south over the river to Manhattan" '
             f'style="display: block; width: 580px; height: 368px; object-fit: cover; object-position: center 40%"></div>')
    o.append(f'<div style="position: absolute; left: {L}px; top: 702px; width: 318px; font-family: {BODY}; font-style: italic; font-size: 17px; line-height: 1.3; color: {NAVY}">'
             f'The South Bronx, looking south over the river to Manhattan.</div>')
    o.append(ticket(370, 616))
    # host note
    o.append(f'<div style="position: absolute; left: {L}px; top: 758px; width: 318px">'
             + kicker('From our host') +
             f'<div style="font-family: {BODY}; font-size: 19px; line-height: 1.38; color: {NAVY}; margin-top: 8px">'
             f'Good evening, and welcome. It is good to be home. The city closed the books on this hospital. '
             f'Tonight we open them again, and every dollar stays in the South Bronx.</div>'
             f'<div style="font-family: {SCRIPT}; font-size: 50px; line-height: 0.9; color: {NAVY}; margin-top: 4px">Frank White</div>'
             f'<div style="font-family: {BODY}; font-size: 15px; letter-spacing: 0.14em; color: {STEEL}; margin-top: 0px">HOST AND CHAIRMAN</div></div>')
    # order of the evening and thanks
    o.append(f'<div style="position: absolute; left: 388px; top: 758px; width: 244px">'
             + kicker('The evening') + f'<div style="margin-top: 6px">{evening()}</div>'
             f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.32; color: {NAVY}; margin-top: 9px">'
             f'With thanks to Jimmy Jump, Test Tube and Jennifer.</div></div>')
    return page(''.join(o), 'wear-front.png')


# ---------------- BACK (the dinner) ----------------
def group(t, gap=20):
    return (f'<div style="display: flex; align-items: center; gap: 16px; margin-top: {gap}px">'
            f'<div style="flex: 1; height: 1px; background: {STEEL}"></div>'
            + kicker(t) +
            f'<div style="flex: 1; height: 1px; background: {STEEL}"></div></div>')


def dish(name, desc, gap=12):
    return (f'<div style="margin-top: {gap}px; text-align: center">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 28px; line-height: 1.12; color: {NAVY}">{name}</div>'
            f'<div style="font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {NAVY}; margin-top: 2px">{desc}</div></div>')


def side(name, desc, gap=12):
    return (f'<div style="margin-top: {gap}px; text-align: center; font-family: {BODY}; color: {NAVY}; line-height: 1.2">'
            f'<span style="font-weight: 700; font-size: 26px">{name}</span>'
            f'<span style="font-style: italic; font-size: 20px">&nbsp; {desc}</span></div>')


def pledge(x, y):
    """Prop: the tear-off pledge card collected at ten."""
    box = f'<span style="display: inline-block; width: 14px; height: 14px; border: 1.5px solid {NAVY}; margin-right: 6px; vertical-align: -1px"></span>'
    line = lambda w: f'<span style="display: inline-block; width: {w}px; border-bottom: 1px solid {NAVY}; margin-left: 6px"></span>'
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 268px; height: 238px; background: #eef0ec; border: 2px dashed {NAVY}; '
            f'box-sizing: border-box; padding: 10px 16px; transform: rotate(1.5deg); box-shadow: 0 1px 4px rgba(10,20,30,0.18)">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
            + kicker('Pledge card') + f'<span style="font-family: {BODY}; font-size: 14px; color: {NAVY}">No. 16</span></div>'
            f'<div style="font-family: {BODY}; font-weight: 600; font-size: 18px; line-height: 1.25; color: {NAVY}; margin-top: 6px">'
            f'Toward the $16,000,000 to keep the doors open.</div>'
            f'<div style="display: flex; flex-wrap: wrap; row-gap: 5px; margin-top: 8px; font-family: {BODY}; font-size: 18px; color: {NAVY}">'
            f'<span style="width: 50%">{box}$160</span><span style="width: 50%">{box}$1,600</span>'
            f'<span style="width: 50%">{box}$16,000</span><span style="width: 50%">{box}Other</span></div>'
            f'<div style="font-family: {BODY}; font-size: 15px; color: {NAVY}; margin-top: 9px; display: flex">Name{line(158)}</div>'
            f'<div style="font-family: {BODY}; font-size: 15px; color: {NAVY}; margin-top: 7px; display: flex">Table{line(48)}<span style="margin-left: 14px; font-style: italic; color: {STEEL}">Collected at ten</span></div></div>')


def back():
    o = []
    o.append(f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 10px; background: {NAVY}"></div>'
             f'<div style="position: absolute; left: 0; top: 10px; width: {W}px; height: 3px; background: {STEEL}"></div>')
    menu = (kicker('Served at eight in the Grand Ballroom', STEEL, ' text-align: center') +
            f'<div style="font-family: {DISP}; font-size: 64px; line-height: 1; color: {NAVY}; text-align: center; letter-spacing: 0.05em; margin-top: 10px">THE DINNER</div>'
            f'<div style="height: 2px; background: {NAVY}; margin-top: 14px"></div><div style="height: 1px; background: {NAVY}; margin-top: 3px"></div>'
            + group('The reception, passed', 16)
            + dish('Champagne cocktails', 'Sugar cube, bitters and cognac under chilled brut.')
            + dish('Chinatown dumplings', 'Pork and chive, fried crisp, black vinegar, soy and chili oil.')
            + group('At table')
            + dish('Shrimp cocktail', 'Iced jumbos on shredded iceberg, sharp horseradish red sauce.')
            + dish('Rib eye au poivre', 'Seared and rested, brandy cream pepper sauce, pommes frites.')
            + side('Creamed spinach', 'for the table')
            + side('Wines', 'a California red and white, poured through dinner')
            + group('Dessert')
            + dish('New York cheesecake', 'Cream cheese, sour cream and lemon on a buttered crumb crust.')
            + side('Coffee', 'regular or decaf, tea, a little cognac'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 40px; width: {CW}px">{menu}</div>')
    # still and caption
    o.append(f'<div style="position: absolute; left: {L}px; top: 766px; width: 292px; height: 194px; border: 2px solid {STEEL}; box-sizing: border-box; padding: 4px; background: {PAPER}">'
             f'<img src="assets/still-benefit-party.png" alt="Frank White greeting guests" style="display: block; width: 280px; height: 182px; object-fit: cover; object-position: center 30%"></div>'
             f'<div style="position: absolute; left: {L}px; top: 966px; width: 292px; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.25; color: {NAVY}">'
             f'Our host with friends of the hospital.'
             f'<div style="font-size: 14px; font-style: normal; margin-top: 4px">Menu subject to the market. Form SBH 1990.</div></div>')
    o.append(pledge(362, 760))
    return page(''.join(o), 'wear-back.png')


def full(body):
    return ('<!doctype html><html><head><meta charset="utf-8"><title>King of New York</title>'
            f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{body}</body></html>')


if __name__ == '__main__':
    for n, f in (('front', front), ('back', back)):
        b = f()
        open(os.path.join(D, n + '.body.html'), 'w').write(b)
        open(os.path.join(D, n + '.html'), 'w').write(full(b))
    print('built')
