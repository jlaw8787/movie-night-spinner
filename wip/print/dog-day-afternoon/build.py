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
PAPER = '#f1d5c2'
INK = '#2c1a12'
SOFT = '#553628'
RED = '#b2301e'
ORANGE = '#e2741f'
GOLD = '#f4b43a'
GREEN = '#d9e6cf'
GREEN_INK = '#2f6a45'
PENCIL = '#2b2d3a'
FONTS = ('family=Shrikhand&family=Yellowtail&family=Sofia+Sans+Extra+Condensed:wght@800;900'
         '&family=Sofia+Sans+Condensed:wght@700;800&family=Sofia+Sans:ital,wght@0,400;0,600;0,800;1,400;1,600&family=Gochi+Hand')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
SCRIPT = "'Yellowtail', cursive"
DISP = "'Shrikhand', serif"
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
            f'<div style="display: inline-block; margin-top: 8px; border: 3px solid {RED}; outline: 1.5px solid {RED}; outline-offset: 3px; color: {RED}; font-family: {DISP}; font-size: 34px; line-height: 1; padding: 3px 14px 5px">{title}</div>'
            f'<div style="height: 2px; background: {INK}; margin: 12px 0 2px"></div>')


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
        f'<img src="assets/engraved-sun.png" alt="" style="position: absolute; left: 512px; top: 8px; width: 300px; height: 300px; display: block">'
        f'<div style="position: absolute; left: {L}px; top: 48px; font-family: {CD}; font-weight: 800; font-size: 18px; letter-spacing: 0.18em; color: {RED}; text-transform: uppercase">Pizza &nbsp;·&nbsp; Heroes &nbsp;·&nbsp; Italian ices</div>'
        f'<div style="position: absolute; left: {L}px; top: 92px; font-family: {XC}; font-weight: 900; font-size: 40px; line-height: 1; letter-spacing: 0.32em; color: {INK}">PIZZERIA</div>'
        f'<div style="position: absolute; left: {L - 4}px; top: 126px; font-family: {DISP}; font-size: 100px; line-height: 1.1; color: {RED}">Canicola</div>'
        f'<div style="position: absolute; left: {L}px; top: 244px; width: 470px; font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 20px; line-height: 1.3; color: {SOFT}">'
        f'On the avenue, two doors from the barber shop.</div>'
        f'<div style="position: absolute; left: {L}px; top: 276px; font-family: {DISP}; font-size: 22px; line-height: 1; color: {RED}">Air conditioned. Eat in, cool off.</div>'
        f'<div style="position: absolute; left: 0; top: 314px; width: {FW}px; height: 48px; background: {RED}"></div>'
        f'<div style="position: absolute; left: {L}px; top: 314px; width: {CW}px; height: 48px; display: flex; align-items: center; justify-content: space-between; '
        f'font-family: {CD}; font-weight: 800; font-size: 20px; letter-spacing: 0.1em; color: {PAPER}; text-transform: uppercase">'
        f'<span>We deliver</span><span>Call 555-0822</span><span>Open 11 A.M. to midnight</span></div>'
    )
    pies = (
        section('Pizza pies', 'Baked on the stone') +
        dish('Plain cheese pie', 'Our own tomato sauce, whole-milk mozzarella and romano.', '2.75') +
        dish('Pepperoni pie', 'Thin crust, crushed tomato, oregano, mozzarella and spicy cured sausage.', '3.25', star=True) +
        dish('Sicilian square pie', 'Thick and airy, risen in a black steel pan.', '3.25') +
        f'<div style="display: flex; align-items: baseline; justify-content: space-between; margin-top: 8px; padding: 9px 12px 7px; border: 2px solid {INK}">'
        f'<span style="font-family: {CD}; font-weight: 800; font-size: 26px; color: {INK}">By the slice</span>'
        f'<span style="font-family: {CD}; font-weight: 800; font-size: 26px; color: {RED}">.35</span></div>'
    )
    heroes = (
        section('Heroes', 'Hot, on Italian bread') +
        dish('Meatball parmigiana', 'Beef and pork meatballs, tomato sauce, melted mozzarella.', '1.25') +
        dish('Sausage and peppers', 'Sweet fennel links with green peppers and onions fried soft.', '1.25') +
        dish('Eggplant parmigiana', 'Fried crisp, baked under the sauce.', '1.10')
    )
    cols = (f'<div style="position: absolute; left: {L}px; top: 392px; width: 336px">{pies}</div>'
            f'<div style="position: absolute; left: {L + 368}px; top: 392px; width: {CW - 368}px">{heroes}</div>')
    coupon = (
        f'<div style="position: absolute; left: {L}px; top: 864px; width: {CW}px; height: 118px; display: flex; gap: 32px">'
        f'<div style="position: relative; width: 352px; height: 118px; box-sizing: border-box; border: 2.5px dashed {INK}; padding: 10px 18px 8px; background: rgba(255,250,240,0.45)">'
        f'<div style="position: absolute; right: 12px; top: -10px; background: {PAPER}; padding: 0 6px; font-family: {CD}; font-weight: 800; font-size: 14px; line-height: 1; letter-spacing: 0.14em; color: {RED}">CLIP AND SAVE</div>'
        f'<div style="font-family: {XC}; font-weight: 900; font-size: 40px; line-height: 0.95; color: {RED}">FREE LEMON ICE</div>'
        f'<div style="margin-top: 5px; font-family: {BODY}; font-weight: 600; font-size: 20px; line-height: 1.25; color: {INK}">With every large pie.</div>'
        f'<div style="margin-top: 3px; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.2; color: {SOFT}">Good through Labor Day 1972.</div></div>'
        f'</div>'
    )
    foot = (f'<div style="position: absolute; left: {L}px; top: 996px; width: {CW}px; display: flex; justify-content: space-between; '
            f'font-family: {BODY}; font-size: 16px; color: {SOFT}">'
            f'<span>Prices subject to change. Brooklyn, N.Y.</span><span style="font-family: {CD}; font-weight: 800; color: {RED}; letter-spacing: 0.14em">PLEASE TURN OVER</span></div>')
    still = (f'<div style="position: absolute; left: {L + 368}px; top: 762px; width: {CW - 368}px">'
             f'<div style="border: 3px solid {RED}; padding: 5px; background: {PAPER}">'
             f'<img src="assets/still-avenue.jpg" alt="" style="display: block; width: 100%; height: auto"></div>'
             f'<div style="margin-top: 7px; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.25; color: {SOFT}">Around the corner, the picture house.</div></div>')
    return page('front', top + cols + coupon + still + foot)


def ticket():
    """The order from that afternoon, on a green guest check clipped to the menu, okayed by Moretti."""
    line = 'border-bottom: 1px solid rgba(47,106,69,0.55); height: 29px; display: flex; align-items: flex-end'
    lab = f'font-family: {CD}; font-weight: 800; font-size: 14px; letter-spacing: 0.06em; color: {GREEN_INK}; width: 44px; flex: none; padding-bottom: 4px'
    hand = f'font-family: {HAND}; font-size: 20px; line-height: 1; color: {PENCIL}; padding-bottom: 2px; white-space: nowrap'
    rows = [('DATE', 'Tues. 8/22/72'), ('TO', 'The bank, across the st.'), ('', 'Front door only!'),
            ('', 'Pies, plain + pepperoni')]
    body = ''.join(f'<div style="{line}"><div style="{lab}">{a}</div><div style="{hand}">{b}</div></div>' for a, b in rows)
    return (
        f'<div style="position: absolute; left: 500px; top: 752px; width: 262px; height: 250px; transform: rotate(2deg); transform-origin: 50% 0">'
        f'<div style="position: absolute; left: 0; top: 0; width: 262px; height: 250px; background: {GREEN}; box-shadow: 0 2px 5px rgba(38,28,24,0.22)"></div>'
        f'<div style="position: absolute; left: 14px; top: 12px; width: 234px">'
        f'<div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid {GREEN_INK}; padding-bottom: 4px">'
        f'<span style="font-family: {CD}; font-weight: 800; font-size: 16px; letter-spacing: 0.1em; color: {GREEN_INK}">GUEST CHECK</span>'
        f'<span style="font-family: {CD}; font-weight: 800; font-size: 16px; color: {RED}">No. 0822</span></div>'
        f'{body}'
        f'<div style="margin-top: 6px; font-family: {HAND}; font-size: 20px; line-height: 1; color: {RED}; transform: rotate(-3deg)">Kid says he\'s a star!</div>'
        f'<div style="margin-top: 4px; display: flex; align-items: baseline; gap: 8px"><span style="{lab}; width: auto">OK</span>'
        f'<span style="font-family: {SCRIPT}; font-size: 30px; line-height: 1; color: {PENCIL}">Sgt. Moretti</span></div>'
        f'</div>'
        f'<div style="position: absolute; left: 150px; top: -18px; width: 20px; height: 56px; border: 3px solid #8b8f96; border-radius: 10px; box-sizing: border-box"></div>'
        f'<div style="position: absolute; left: 155px; top: -10px; width: 11px; height: 40px; border: 3px solid #a3a7ad; border-radius: 6px; box-sizing: border-box"></div>'
        f'</div>')


def back():
    head = (
        f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 3px solid {INK}; padding-bottom: 10px">'
        f'<div style="display: flex; align-items: baseline; gap: 10px">'
        f'<span style="font-family: {XC}; font-weight: 900; font-size: 30px; line-height: 1; letter-spacing: 0.28em; color: {INK}">PIZZERIA</span>'
        f'<span style="font-family: {DISP}; font-size: 60px; line-height: 1; color: {RED}">Canicola</span></div>'
        f'<div style="text-align: right">'
        f'<div style="font-family: {CD}; font-weight: 800; font-size: 18px; letter-spacing: 0.14em; color: {RED}">WE DELIVER, CALL</div>'
        f'<div style="font-family: {XC}; font-weight: 900; font-size: 48px; line-height: 0.9; color: {INK}">555-0822</div></div></div>'
    )
    left = (
        section('Dinners', 'With bread and butter') +
        dish('Spaghetti and meatballs', 'Three big meatballs in a slow Sunday sauce.', '1.95') +
        dish('Baked ziti', 'Ricotta and mozzarella, baked bubbling in the sauce.', '1.75') +
        '<div style="height: 22px"></div>' +
        section('For a crowd', 'Call a day ahead') +
        dish('Party hero, three foot', 'Ham, salami, provolone, iceberg, tomato, oil, vinegar and oregano. Pressed, cut in wedges.', '11.00', star=True) +
        dish('Chips and dip, party bowl', 'Ridged chips, slow-browned onions in sour cream, cream cheese and chives.', '1.25')
    )
    right = (
        section('Italian ices', 'Made here every morning') +
        dish('Lemon ice', 'Fresh juice and zest, frozen and scraped fluffy. Paper cups.', '.25', star=True) +
        '<div style="height: 22px"></div>' +
        section('Cold drinks', 'From the ice chest') +
        dish('Cold lager with lime', 'Over two cubes, a fresh squeeze, glass rimmed with chili salt and zest.', '.60') +
        dish('Soda by the bottle', 'Cola, orange, cream, root beer or ginger ale.', '.20')
    )
    cols = (f'<div style="position: absolute; left: {L}px; top: 150px; width: 336px">{left}</div>'
            f'<div style="position: absolute; left: {L + 368}px; top: 150px; width: {CW - 368}px">{right}</div>')
    deliver = (
        f'<div style="position: absolute; left: {L}px; top: 800px; width: 410px; box-sizing: border-box; border-top: 3px solid {INK}; padding-top: 12px">'
        f'<div style="font-family: {CD}; font-weight: 800; font-size: 18px; letter-spacing: 0.16em; color: {RED}">FREE DELIVERY ON THE BLOCK</div>'
        f'<div style="margin-top: 7px; font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {SOFT}">Bank and office lunches by noon. Our boys ride bicycles. We don\'t take the car.</div>'
        f'<div style="margin-top: 6px; font-family: {BODY}; font-style: italic; font-weight: 600; font-size: 20px; line-height: 1.25; color: {RED}">Sorry, no delivery to Wyoming.</div></div>'
    )
    foot = (f'<div style="position: absolute; left: {L}px; top: 996px; width: 420px; font-family: {BODY}; font-size: 16px; color: {SOFT}">'
            f'Prices subject to change. Form 1100, 6/72.</div>')
    pie = f'<img src="assets/engraved-pie.png" alt="" style="position: absolute; left: 566px; top: 622px; width: 192px; height: 192px; display: block">'
    return page('back', head + cols + pie + deliver + foot + ticket())


def wrap(body, title):
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title>{LINK}'
            f'<style>body{{margin:0}}*{{-webkit-font-smoothing:antialiased}}</style></head><body>{body}</body></html>')


LABELS = {
    'Dog Day Afternoon (1975)': {
        'Attica chips and onion dip': {'n': 'Chips and dip, party bowl', 'd': 'Ridged chips, slow-browned onions in sour cream, cream cheese and chives.', 'note': 'For a crowd. Call a day ahead.'},
        'Deli hero wedges': {'n': 'Party hero, three foot', 'd': 'Ham, salami, provolone, iceberg, tomato, oil, vinegar and oregano. Pressed, cut in wedges.', 'note': 'Feeds twelve. 11.00.'},
        'Hostage pizza': {'n': 'Pepperoni pie', 'd': 'Thin crust, crushed tomato, oregano, mozzarella and spicy cured sausage.', 'note': 'The one the whole block orders.'},
        'Italian ice': {'n': 'Lemon ice', 'd': 'Fresh juice and zest, frozen and scraped fluffy. Paper cups.', 'note': 'The coldest thing on the avenue.'},
        'Heatwave lager with lime and chilli salt': {'n': 'Cold lager with lime', 'd': 'Over two cubes, a fresh squeeze, glass rimmed with chili salt and zest.', 'note': 'From the ice chest. Air conditioned inside.'},
    }
}

FILM = {
    'fmt': 'brooklyn', 'fn': 'fmtBrooklyn',
    'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
    'mm': [215.9, 279.4],
    'fonts': FONTS,
    'fams': ['Shrikhand', 'Sofia Sans Extra Condensed', 'Sofia Sans Condensed', 'Sofia Sans', 'Yellowtail', 'Gochi Hand'],
    'phone': {'disp': "'Shrikhand',serif", 'title': "'Shrikhand',serif",
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
