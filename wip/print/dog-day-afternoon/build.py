"""Builds the Pizzeria Canicola take-out menu for Dog Day Afternoon (Brooklyn, summer 1972).
The venue: the neighbourhood pizzeria on the bank's avenue, two doors from the barber shop the
police take over, the place the pies come from on Tuesday, August 22, 1972. "Canicola" is the
Italian word for the dog days of summer.
The object: a two-sided US Letter take-out menu (8.5 x 11 in, portrait, no fold), offset printed in
warm black plus two spot inks (sun orange and tomato red) on a soft white stock, with a halftone
sun badge, a clip-out coupon and, on the back, the police order ticket from that afternoon clipped on.
Writes front.html / back.html, front.body.html / back.body.html, film.json, brooklyn.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
PAPER = '#f7f0e3'
INK = '#261c18'
SOFT = '#4a3d36'
RED = '#c3341f'
ORANGE = '#e2741f'
GOLD = '#f4b43a'
GREEN = '#d9e6cf'
GREEN_INK = '#2f6a45'
PENCIL = '#2b2d3a'
FONTS = ('family=Yellowtail&family=Sofia+Sans+Extra+Condensed:wght@800;900'
         '&family=Sofia+Sans+Condensed:wght@700;800&family=Sofia+Sans:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Gochi+Hand')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
SCRIPT = "'Yellowtail', cursive"
XC = "'Sofia Sans Extra Condensed', 'Arial Narrow', sans-serif"
CD = "'Sofia Sans Condensed', 'Arial Narrow', sans-serif"
BODY = "'Sofia Sans', Arial, sans-serif"
HAND = "'Gochi Hand', cursive"
L = 56                      # outer text margin, at least 40px inside the trim
CW = FW - 2 * L


def paper(face):
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: -339px; top: 0; width: 1494px; height: 1056px; opacity: 0.34; pointer-events: none; display: block">'
            f'<img src="assets/paper-wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def section(title, kicker):
    """Jurassic system: spaced-caps kicker in the accent, then a dark label bar with paper-coloured caps."""
    return (f'<div style="font-family: {CD}; font-weight: 800; font-size: 18px; line-height: 1; letter-spacing: 0.16em; color: {RED}; text-transform: uppercase">{kicker}</div>'
            f'<div style="display: inline-block; margin-top: 7px; background: {INK}; color: {PAPER}; font-family: {XC}; font-weight: 900; font-size: 44px; line-height: 1; letter-spacing: 0.02em; padding: 6px 14px 3px; text-transform: uppercase">{title}</div>'
            f'<div style="height: 2px; background: {INK}; margin: 8px 0 2px"></div>')


def dish(name, desc, price, star=False):
    ds = (f'<div style="margin-top: 3px; font-family: {BODY}; font-size: 20px; line-height: 1.28; color: {SOFT}; text-wrap: pretty">{desc}</div>' if desc else '')
    return (f'<div style="padding: 10px 0 8px">'
            f'<div style="display: flex; align-items: baseline; gap: 12px">'
            f'<div style="flex: 1; font-family: {CD}; font-weight: 800; font-size: 28px; line-height: 1.02; color: {RED if star else INK}">{name}</div>'
            f'<div style="font-family: {CD}; font-weight: 800; font-size: 28px; line-height: 1; color: {INK}">{price}</div></div>'
            f'{ds}</div>')


def page(face, inner):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{paper(face)}{inner}</div>')


# ---------------------------------------------------------------- front
def front():
    top = (
        # sun badge, top right
        f'<img src="assets/sun-badge.png" alt="" style="position: absolute; left: 520px; top: 14px; width: 292px; height: 292px; display: block">'
        f'<div style="position: absolute; left: 576px; top: 112px; width: 180px; text-align: center; color: {INK}">'
        f'<div style="font-family: {XC}; font-weight: 900; font-size: 36px; line-height: 0.9; letter-spacing: 0.02em">AIR<br>CONDITIONED</div>'
        f'<div style="margin-top: 6px; font-family: {BODY}; font-weight: 800; font-size: 13px; line-height: 1.15; letter-spacing: 0.06em; text-transform: uppercase">Eat in. Cool off.</div></div>'
        # masthead
        f'<div style="position: absolute; left: {L}px; top: 50px; font-family: {CD}; font-weight: 800; font-size: 15px; letter-spacing: 0.2em; color: {RED}; text-transform: uppercase">Pizza &nbsp;·&nbsp; Heroes &nbsp;·&nbsp; Dinners &nbsp;·&nbsp; Italian ices</div>'
        f'<div style="position: absolute; left: {L - 2}px; top: 70px; font-family: {SCRIPT}; font-size: 64px; line-height: 1; color: {RED}">Pizzeria</div>'
        f'<div style="position: absolute; left: {L - 6}px; top: 118px; font-family: {XC}; font-weight: 900; font-size: 168px; line-height: 0.86; letter-spacing: 0.005em; color: {INK}">CANICOLA</div>'
        f'<div style="position: absolute; left: {L}px; top: 268px; width: 470px; font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 17px; line-height: 1.3; color: {SOFT}">'
        f'On the avenue since 1952, two doors from the barber shop.</div>'
        # info band
        f'<div style="position: absolute; left: 0; top: 314px; width: {FW}px; height: 46px; background: {INK}"></div>'
        f'<div style="position: absolute; left: {L}px; top: 314px; width: {CW}px; height: 46px; display: flex; align-items: center; justify-content: space-between; '
        f'font-family: {CD}; font-weight: 800; font-size: 19px; letter-spacing: 0.1em; color: {PAPER}; text-transform: uppercase">'
        f'<span>We deliver</span><span style="color: {GOLD}">Call 555-0822</span><span>Open 11 A.M. to midnight, 7 days</span></div>'
    )
    pies = (
        section('Pizza pies', 'baked on the stone', ['Small', 'Large']) +
        dish('Plain cheese pie', 'Our own tomato sauce, whole-milk mozzarella, grated romano and a ribbon of olive oil.', ['2.10', '2.75']) +
        dish('Pepperoni pie', 'Thin crust, crushed tomato and oregano, plenty of mozzarella and coins of spicy cured sausage, baked fast in a blazing oven.', ['2.50', '3.25'], 'The one the whole block orders.', star=True) +
        dish('Sicilian square pie', 'Thick, airy dough risen in a black steel pan, cheese under the sauce. Twelve squares.', ['', '3.25']) +
        dish('Extra toppings, each', 'Sausage, mushrooms, green peppers, onions, meatballs, anchovies or extra cheese.', ['.35', '.50']) +
        f'<div style="display: flex; align-items: baseline; justify-content: space-between; margin-top: 12px; padding: 9px 12px 8px; border: 2px solid {INK}">'
        f'<span style="font-family: {CD}; font-weight: 800; font-size: 22px; color: {INK}">By the slice, at the counter</span>'
        f'<span style="font-family: {CD}; font-weight: 800; font-size: 22px; color: {RED}">.35</span></div>'
    )
    heroes = (
        section('Heroes', 'hot, on Italian bread', ['']) +
        dish('Meatball parmigiana', 'Beef and pork meatballs in tomato sauce under melted mozzarella.', '1.25') +
        dish('Sausage and peppers', 'Sweet fennel links with green peppers and onions fried soft.', '1.25') +
        dish('Chicken cutlet parmigiana', 'Breaded, fried golden, then baked with sauce and cheese.', '1.50') +
        dish('Eggplant parmigiana', 'Thin slices fried crisp and layered with tomato and romano.', '1.10') +
        dish('Pepper and egg', 'Green peppers scrambled soft with eggs. A Friday favorite.', '.95')
    )
    cols = (f'<div style="position: absolute; left: {L}px; top: 384px; width: 344px">{pies}</div>'
            f'<div style="position: absolute; left: {L + 372}px; top: 384px; width: {CW - 372}px">{heroes}</div>')
    coupon = (
        f'<div style="position: absolute; left: {L}px; top: 880px; width: {CW}px; height: 118px; display: flex; gap: 22px">'
        # clip-out coupon
        f'<div style="position: relative; width: 420px; box-sizing: border-box; border: 2.5px dashed {INK}; padding: 12px 16px 10px; background: rgba(244,180,58,0.20)">'
        f'<div style="position: absolute; right: 12px; top: -11px; background: {PAPER}; padding: 0 6px; font-family: {CD}; font-weight: 800; font-size: 12px; letter-spacing: 0.14em; color: {RED}">CLIP AND SAVE</div>'
        f'<div style="font-family: {XC}; font-weight: 900; font-size: 34px; line-height: 0.95; color: {RED}">FREE LEMON ICE</div>'
        f'<div style="margin-top: 4px; font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.3; color: {INK}">With every large pie. Bring this coupon.</div>'
        f'<div style="margin-top: 3px; font-family: {BODY}; font-style: italic; font-size: 14px; line-height: 1.2; color: {SOFT}">Good through Labor Day, Monday, Sept. 4, 1972.</div></div>'
        # office lunches
        f'<div style="flex: 1; padding-top: 4px">'
        f'<div style="font-family: {CD}; font-weight: 800; font-size: 22px; line-height: 1.05; color: {INK}">Bank and office lunches</div>'
        f'<div style="margin-top: 5px; font-family: {BODY}; font-size: 16px; line-height: 1.32; color: {SOFT}">Call by eleven and the whole staff eats at noon. Party orders and dinners over the page.</div></div>'
        f'</div>'
    )
    foot = (f'<div style="position: absolute; left: {L}px; top: 1012px; width: {CW}px; display: flex; justify-content: space-between; '
            f'font-family: {BODY}; font-size: 12px; letter-spacing: 0.04em; color: {SOFT}">'
            f'<span>Pizzeria Canicola, Brooklyn, N.Y.</span><span style="font-weight: 800; color: {RED}; letter-spacing: 0.14em">PLEASE TURN OVER</span></div>')
    return page('front', top + cols + coupon + foot)


# ---------------------------------------------------------------- back
def ticket():
    """The police order from that afternoon: a green guest check clipped to the menu."""
    line = f'border-bottom: 1px solid rgba(47,106,69,0.55); height: 27px; display: flex; align-items: flex-end'
    lab = f'font-family: {CD}; font-weight: 700; font-size: 12px; letter-spacing: 0.08em; color: {GREEN_INK}; width: 40px; flex: none; padding-bottom: 4px'
    hand = f'font-family: {HAND}; font-size: 19px; line-height: 1; color: {PENCIL}; padding-bottom: 2px; white-space: nowrap'
    rows = [('DATE', 'Tues. 8/22/72'), ('TO', 'The bank, across the st.'), ('', 'Front door only!'),
            ('', 'Pies, plain + pepperoni'), ('', 'Sodas, cold'), ('BY', 'Police, from the barber shop')]
    body = ''.join(f'<div style="{line}"><div style="{lab}">{a}</div><div style="{hand}">{b}</div></div>' for a, b in rows)
    return (
        f'<div style="position: absolute; left: 520px; top: 742px; width: 250px; height: 262px; transform: rotate(2.2deg); transform-origin: 50% 0">'
        f'<div style="position: absolute; left: 0; top: 0; width: 250px; height: 262px; background: {GREEN}; box-shadow: 0 2px 5px rgba(38,28,24,0.22)"></div>'
        f'<div style="position: absolute; left: 14px; top: 12px; width: 222px">'
        f'<div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid {GREEN_INK}; padding-bottom: 4px">'
        f'<span style="font-family: {CD}; font-weight: 800; font-size: 15px; letter-spacing: 0.1em; color: {GREEN_INK}">GUEST CHECK</span>'
        f'<span style="font-family: {CD}; font-weight: 800; font-size: 15px; color: {RED}">No. 0822</span></div>'
        f'{body}'
        f'<div style="margin-top: 8px; font-family: {HAND}; font-size: 19px; line-height: 1; color: {RED}; transform: rotate(-3deg)">Kid says he\'s a star!</div>'
        f'</div>'
        # paper clip, wire drawn with rounded borders
        f'<div style="position: absolute; left: 172px; top: -18px; width: 20px; height: 56px; border: 3px solid #8b8f96; border-radius: 10px; box-sizing: border-box"></div>'
        f'<div style="position: absolute; left: 177px; top: -10px; width: 11px; height: 40px; border: 3px solid #a3a7ad; border-radius: 6px; box-sizing: border-box"></div>'
        f'</div>')


def back():
    head = (
        f'<div style="position: absolute; left: 0; top: 0; width: {FW}px; height: 8px; background: {RED}"></div>'
        f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 3px solid {INK}; padding-bottom: 10px">'
        f'<div style="display: flex; align-items: baseline; gap: 10px">'
        f'<span style="font-family: {SCRIPT}; font-size: 40px; line-height: 1; color: {RED}">Pizzeria</span>'
        f'<span style="font-family: {XC}; font-weight: 900; font-size: 64px; line-height: 0.85; color: {INK}">CANICOLA</span></div>'
        f'<div style="text-align: right">'
        f'<div style="font-family: {CD}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; color: {RED}">WE DELIVER, CALL</div>'
        f'<div style="font-family: {XC}; font-weight: 900; font-size: 44px; line-height: 0.9; color: {INK}">555-0822</div></div></div>'
    )
    left = (
        section('Dinners', 'with bread and butter') +
        dish('Spaghetti and meatballs', 'Three big meatballs in a slow Sunday sauce with grated romano.', '1.95') +
        dish('Baked ziti', 'Tubes of macaroni with ricotta and mozzarella, baked bubbling in the sauce.', '1.75') +
        dish('Lasagna', 'Wide noodles layered with ground beef, ricotta and mozzarella.', '2.25') +
        dish('Veal parmigiana', 'Cutlet pounded thin, breaded, baked under sauce and cheese, with spaghetti.', '2.95') +
        f'<div style="height: 22px"></div>' +
        section('For a crowd', 'call a day ahead') +
        dish('Party hero, three foot', 'Ham, salami and provolone with shredded iceberg and ripe tomato, dressed with oil, vinegar and oregano, pressed and cut in wedges. Feeds twelve.', '11.00', star=True) +
        dish('Chips and dip, party bowl', 'Ridged potato chips with our own dip: onions cooked slow until deep brown, stirred into sour cream and cream cheese with chives.', '1.25')
    )
    right = (
        section('Italian ices', 'made here every morning', ['Small', 'Large']) +
        dish('Lemon ice', 'Fresh-squeezed juice and grated zest in sugar syrup, frozen and scraped by hand until fluffy. Served in paper cups.', ['.15', '.25'], 'The coldest thing on the avenue.', star=True) +
        dish('Cherry, chocolate or rainbow', '', ['.15', '.25']) +
        f'<div style="height: 22px"></div>' +
        section('Cold drinks', 'from the ice chest', ['']) +
        dish('Cold beer with lime', 'Lager poured over two ice cubes and a fresh squeeze, the glass rimmed with salt, grated zest and a pinch of chili powder.', '.60') +
        dish('Bottle beer, to go', '', '.45') +
        dish('Soda by the bottle', 'Cola, orange, cream, root beer or ginger ale.', '.20') +
        dish('Coffee, hot or iced', '', '.15')
    )
    cols = (f'<div style="position: absolute; left: {L}px; top: 146px; width: 344px">{left}</div>'
            f'<div style="position: absolute; left: {L + 372}px; top: 146px; width: {CW - 372}px">{right}</div>')
    deliver = (
        f'<div style="position: absolute; left: {L}px; top: 862px; width: 420px; box-sizing: border-box; border-top: 3px solid {INK}; padding-top: 10px">'
        f'<div style="font-family: {XC}; font-weight: 900; font-size: 30px; line-height: 1; color: {RED}">FREE DELIVERY ON THE BLOCK</div>'
        f'<div style="margin-top: 6px; font-family: {BODY}; font-size: 16px; line-height: 1.34; color: {SOFT}">The avenue and the side streets, 11 A.M. to midnight. Our boys ride bicycles. We don\'t take the car.</div>'
        f'<div style="margin-top: 5px; font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 15px; line-height: 1.25; color: {RED}">Sorry, no delivery to Wyoming.</div></div>'
    )
    foot = (f'<div style="position: absolute; left: {L}px; top: 1012px; width: 420px; font-family: {BODY}; font-size: 12px; letter-spacing: 0.04em; color: {SOFT}">'
            f'Prices effective June 1972. Pizzeria Canicola, Brooklyn, N.Y.</div>')
    return page('back', head + cols + deliver + foot + ticket())


def wrap(body, title):
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title>{LINK}'
            f'<style>body{{margin:0}}*{{-webkit-font-smoothing:antialiased}}</style></head><body>{body}</body></html>')


LABELS = {
    'Dog Day Afternoon (1975)': {
        'Attica chips and onion dip': {'n': 'Chips and dip, party bowl', 'd': 'Ridged potato chips with our own dip: onions cooked slow until deep brown, stirred into sour cream and cream cheese with chives.', 'note': 'For a crowd. Call a day ahead.'},
        'Deli hero wedges': {'n': 'Party hero, three foot', 'd': 'Ham, salami and provolone with shredded iceberg and ripe tomato, dressed with oil, vinegar and oregano, pressed and cut in wedges.', 'note': 'Feeds twelve. 11.00.'},
        'Hostage pizza': {'n': 'Pepperoni pie', 'd': 'Thin crust, crushed tomato and oregano, plenty of mozzarella and coins of spicy cured sausage, baked fast in a blazing oven.', 'note': 'The one the whole block orders.'},
        'Italian ice': {'n': 'Lemon ice', 'd': 'Fresh-squeezed juice and grated zest in sugar syrup, frozen and scraped by hand until fluffy. Served in paper cups.', 'note': 'The coldest thing on the avenue.'},
        'Heatwave lager with lime and chilli salt': {'n': 'Cold beer with lime', 'd': 'Lager poured over two ice cubes and a fresh squeeze, the glass rimmed with salt, grated zest and a pinch of chili powder.', 'note': 'From the ice chest. Air conditioned inside.'},
    }
}

FILM = {
    'fmt': 'brooklyn', 'fn': 'fmtBrooklyn',
    'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
    'mm': [215.9, 279.4],
    'fonts': FONTS,
    'fams': ['Sofia Sans Extra Condensed', 'Sofia Sans Condensed', 'Sofia Sans', 'Yellowtail', 'Gochi Hand'],
    'phone': {'disp': "'Sofia Sans Extra Condensed',sans-serif", 'title': "'Yellowtail',cursive",
              'name': "'Sofia Sans Condensed',sans-serif", 'body': "'Sofia Sans',sans-serif",
              'price': "'Sofia Sans Condensed',sans-serif", 'note': "'Sofia Sans',sans-serif"},
}

if __name__ == '__main__':
    for n, fn in (('front', front), ('back', back)):
        b = fn()
        open(os.path.join(D, n + '.body.html'), 'w').write(b)
        open(os.path.join(D, n + '.html'), 'w').write(wrap(b, 'Pizzeria Canicola, ' + n))
    json.dump(FILM, open(os.path.join(D, 'film.json'), 'w'), indent=1)
    json.dump(LABELS, open(os.path.join(D, 'brooklyn.labels.json'), 'w'), indent=1, ensure_ascii=False)
    print('built')
