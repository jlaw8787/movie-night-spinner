"""Builds the Liberty View Manor party menu (Working Girl, 1988).
A Staten Island catering hall's two-sided price sheet, US letter (8.5 x 11 in, 816 x 1056 CSS px), offset printed
in two inks (harbor navy and ferry orange) on pale blue card. The back carries a reservation coupon, filled in
pencil by Cyn for her engagement party.
Writes front.body.html / back.body.html (face markup) and front.html / back.html (full pages)."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, NAVY, ORANGE, SOFT, LEAD = '#dde4e5', '#1f2b4e', '#d6622c', '#3c4766', '#55575f'
FONTS = ('https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900'
         '&family=Tinos:ital,wght@0,400;0,700;1,400;1,700&family=Caveat:wght@500;600&display=swap')
DISP = "'Bodoni Moda', serif"; BODY = "'Tinos', serif"; HAND = "'Caveat', cursive"
INK = 'text-shadow: 0 0 0.6px rgba(31,43,78,.6)'  # offset ink spread on the heavy type
DOTS = '. ' * 80

def grain(): return f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.5">'
def wear(n): return f'<img src="assets/wear-{n}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
def tint(c): return f'background-image: url(assets/tint-{c}.png); background-size: 6px 6px; background-repeat: repeat'

def head(t, kick=None, size=34, mt=0):
    k = (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 13px; letter-spacing: 0.2em; color: {ORANGE}; margin-bottom: 2px">{kick}</div>' if kick else '')
    return (f'<div style="margin-top: {mt}px">{k}'
            f'<h2 style="margin: 0; font-family: {DISP}; font-style: italic; font-weight: 800; font-size: {size}px; line-height: 1.05; color: {NAVY}; {INK}">{t}</h2>'
            f'<div style="position: relative; height: 5px; margin-top: 6px"><div style="position: absolute; left: 1px; top: 1px; right: -1px; height: 2px; background: {ORANGE}"></div>'
            f'<div style="position: absolute; left: 0; top: 4px; right: 0; height: 1px; background: {NAVY}"></div></div></div>')

def item(n, d, p, unit='', mt=13):
    u = f'<span style="font-size: 13px; font-style: italic; margin-left: 3px">{unit}</span>' if unit else ''
    return (f'<div style="margin-top: {mt}px">'
            f'<div style="display: flex; align-items: baseline">'
            f'<h3 style="margin: 0; font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.03em; line-height: 1.2; color: {NAVY}; white-space: nowrap">{n.upper()}</h3>'
            f'<span style="flex: 1; overflow: hidden; white-space: nowrap; margin: 0 5px; font-family: {BODY}; font-size: 14px; color: {SOFT}">{DOTS}</span>'
            f'<span style="font-family: {BODY}; font-weight: 700; font-size: 18px; color: {NAVY}; white-space: nowrap">{p}{u}</span></div>'
            f'<p style="margin: 2px 0 0; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.3; color: {SOFT}; text-wrap: pretty">{d}</p></div>')

def leader(n, p, size=16, mt=5):
    return (f'<div style="display: flex; align-items: baseline; margin-top: {mt}px; font-family: {BODY}; font-size: {size}px; color: {NAVY}">'
            f'<span style="white-space: nowrap">{n}</span>'
            f'<span style="flex: 1; overflow: hidden; white-space: nowrap; margin: 0 5px; font-size: 14px; color: {SOFT}">{DOTS}</span>'
            f'<span style="white-space: nowrap; font-weight: 700">{p}</span></div>')

# ---------- FRONT ----------
COCKTAIL = [
    ('Cold shrimp canapés', 'Poached and chilled, set on thick cucumber rounds with a dab of Russian dressing and a sprig of dill.', '21.00', 'doz.'),
    ('Crab cakes', 'Backfin lumps bound with egg, Dijon mustard, parsley and bread crumbs, browned in butter. Lemon wedges, tartar sauce.', '27.00', 'doz.'),
    ('Baked clams oreganata', 'Littlenecks on the half shell under garlic crumbs, parsley and Romano, run under the broiler.', '9.00', 'doz.'),
    ('Stuffed mushrooms', 'Caps filled with sweet Italian sausage and Parmesan.', '7.50', 'doz.'),
    ('Franks in blankets', 'Little all-beef wieners baked in puff pastry, with spicy brown mustard on the side.', '6.00', 'doz.'),
]
LUNCH = [
    ('Sliced sirloin salad', 'Seared rare, cut thin and laid over romaine with cherry tomatoes, red onion and crumbled blue cheese. Red wine vinaigrette.', '12.95'),
    ('Chicken parmigiana', 'Breaded cutlet under marinara and melted mozzarella, with a side of buttered spaghetti.', '11.50'),
    ('Filet of sole', 'Broiled with lemon butter and paprika. Rice pilaf, green beans almondine.', '13.25'),
]

def front():
    mast = (f'<div style="position: absolute; left: 48px; top: 44px; width: 720px">'
            f'<div style="display: flex; justify-content: space-between; align-items: flex-end">'
            f'<div>'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 13px; letter-spacing: 0.24em; color: {ORANGE}">CATERING FOR EVERY OCCASION SINCE 1951</div>'
            f'<h1 style="margin: 4px 0 0 -3px; font-family: {DISP}; font-style: italic; font-weight: 800; font-size: 58px; line-height: 1; letter-spacing: -0.01em; white-space: nowrap; color: {NAVY}; {INK}">Liberty View Manor</h1></div>'
            f'<div style="text-align: right; padding-bottom: 4px">'
            f'<div style="font-family: {DISP}; font-weight: 700; font-size: 25px; line-height: 1; color: {NAVY}; white-space: nowrap">(718) 555-0130</div>'
            f'<div style="margin-top: 5px; font-family: {BODY}; font-size: 14px; line-height: 1.3; color: {SOFT}; white-space: nowrap">Richmond Terrace, St. George<br>Staten Island, N.Y. 10301</div></div></div>'
            f'<div style="height: 3px; background: {NAVY}; margin-top: 10px"></div>'
            f'<div style="display: flex; justify-content: space-between; margin-top: 7px; font-family: {BODY}; font-weight: 700; font-size: 13px; letter-spacing: 0.12em; color: {NAVY}; white-space: nowrap">'
            + ''.join(f'<span>{t}</span>' for t in ['WEDDINGS', 'ENGAGEMENTS', 'SHOWERS', 'COMMUNIONS', 'BIRTHDAYS', 'BON VOYAGE PARTIES']) +
            f'</div><div style="position: relative; height: 4px; margin-top: 7px"><div style="position: absolute; left: 1px; top: 1px; width: 720px; height: 2px; background: {ORANGE}"></div></div></div>')

    photo = (f'<div style="position: absolute; left: 48px; top: 190px; width: 228px">'
             f'<div style="position: relative; width: 228px; height: 430px; border: 1.5px solid {NAVY}; box-sizing: border-box; overflow: hidden">'
             f'<img src="assets/photo-skyline.png" alt="Downtown towers over the harbor, printed as a navy and orange halftone" style="display: block; width: 228px; height: 430px; margin: -1.5px 0 0 -1.5px">'
             f'</div>'
             f'<div style="position: absolute; left: 22px; top: 304px; width: 184px; height: 112px; border-radius: 50%; border: 2px solid {NAVY}; background: {PAPER}; box-sizing: border-box">'
             f'<div style="position: absolute; left: 4px; top: 4px; right: 4px; bottom: 4px; border-radius: 50%; {tint("orange-light")}"></div>'
             f'<div style="position: absolute; left: 0; top: 17px; width: 180px; text-align: center; font-family: {DISP}; font-style: italic; font-weight: 800; font-size: 22px; line-height: 1.05; color: {NAVY}">Party Menus<br>1988</div>'
             f'<div style="position: absolute; left: 0; top: 70px; width: 180px; text-align: center; font-family: {BODY}; font-weight: 700; font-size: 12px; letter-spacing: 0.12em; color: {NAVY}">PRICES AS MARKED</div></div>'
             f'<p style="margin: 9px 0 0; font-family: {BODY}; font-style: italic; font-size: 15px; line-height: 1.32; color: {SOFT}">Downtown from the harbor. Wall Street is one ferry ride away, and the boat is still a quarter.</p></div>')

    cock = ''.join(item(n, d, p, u, mt=(14 if i else 12)) for i, (n, d, p, u) in enumerate(COCKTAIL))
    right = (f'<div style="position: absolute; left: 304px; top: 186px; width: 464px">'
             f'{head("The Cocktail Hour", "SERVED ON SILVER TRAYS")}'
             f'<p style="margin: 10px 0 0; font-family: {BODY}; font-size: 16px; line-height: 1.32; color: {NAVY}">Butlered hot and cold for the first hour while your guests arrive. Any five for <b>8.95 per person</b>, or by the dozen for parties at home.</p>'
             f'{cock}'
             f'</div>')

    lunch = ''.join(
        f'<div style="width: 226px">'
        f'<h3 style="margin: 0; font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.03em; line-height: 1.2; color: {NAVY}">{n.upper()}</h3>'
        f'<div style="margin-top: 1px; font-family: {BODY}; font-weight: 700; font-size: 17px; color: {ORANGE}">{p} <span style="font-size: 13px; font-style: italic; font-weight: 400; color: {SOFT}">per person</span></div>'
        f'<p style="margin: 3px 0 0; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.3; color: {SOFT}; text-wrap: pretty">{d}</p></div>'
        for n, d, p in LUNCH)
    bottom = (f'<div style="position: absolute; left: 48px; top: 716px; width: 720px">'
              f'{head("Luncheons, Showers and Communions", "NOON TO FOUR, MONDAY TO SATURDAY", size=30)}'
              f'<div style="display: flex; justify-content: space-between; margin-top: 12px">{lunch}</div>'
              f'<p style="margin: 10px 0 0; font-family: {BODY}; font-size: 15px; line-height: 1.3; color: {NAVY}">Every luncheon includes tossed salad, Italian bread, coffee or tea, and a sheet cake with your inscription.</p></div>')

    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {NAVY}">{grain()}'
            f'{mast}{photo}{right}{bottom}{wear("front")}</div>')

# ---------- BACK ----------
PACKS = [
    ('The Liberty', '29.95', ['Cocktail hour, any five from the front', 'Fresh fruit cup', 'Penne alla vodka', 'Roast sirloin of beef or chicken francese', 'Our wedding cake', 'Four-hour open bar, house brands', 'Champagne toast']),
    ('The Narrows', '36.50', ['Cocktail hour with shrimp canapés and crab cakes', 'Antipasto display', 'Penne alla vodka', 'Prime rib, chicken francese or filet of sole', 'Our wedding cake and the Viennese table', 'Five-hour open bar, call brands', 'Champagne toast']),
    ('The Harbor', '44.00', ['Cocktail hour with a raw bar and carving board', 'Hot and cold antipasto', 'Two pasta courses', 'Filet mignon and lobster tail', 'Wedding cake, Viennese table and cordials', 'Five-hour open bar, premium brands', 'Limousine for the bride and groom']),
]

def pack(name, price, lines, ring=False):
    lis = ''.join(f'<div style="display: flex; gap: 7px; margin-top: 6px; font-family: {BODY}; font-size: 16px; line-height: 1.26; color: {NAVY}">'
                  f'<span style="color: {ORANGE}; font-weight: 700">&#8226;</span><span style="text-wrap: pretty">{l}</span></div>' for l in lines)
    r = (f'<img src="assets/pencil-ring.png" alt="" style="position: absolute; left: -14px; top: -14px; width: 214px; height: 64px; display: block">' if ring else '')
    return (f'<div style="position: relative; width: 228px; border: 1.5px solid {NAVY}; box-sizing: border-box">'
            f'<div style="position: relative; height: 66px; border-bottom: 1.5px solid {NAVY}">'
            f'<div style="position: absolute; left: 0; top: 0; right: 0; bottom: 0; {tint("orange-light")}"></div>'
            f'<div style="position: absolute; left: 12px; top: 6px; font-family: {DISP}; font-style: italic; font-weight: 800; font-size: 26px; color: {NAVY}">{name}</div>'
            f'<div style="position: absolute; left: 12px; top: 39px; font-family: {BODY}; font-weight: 700; font-size: 17px; color: {NAVY}">{price} <span style="font-weight: 400; font-style: italic; font-size: 14px">per person</span></div></div>'
            f'<div style="padding: 4px 12px 12px">{lis}</div>{r}</div>')

BAR = [('Highballs and cocktails', '2.75'), ('Domestic beer', '2.00'), ('Imported beer', '2.75'), ('House wine by the glass', '2.50'), ('Champagne toast', '2.00 pp'), ('Soda, juice and seltzer', '1.00')]

def field(label, value, flex='1', rot=-1.2, size=27):
    v = (f'<span style="position: absolute; left: 6px; bottom: -2px; font-family: {HAND}; font-weight: 600; font-size: {size}px; line-height: 1; color: {LEAD}; white-space: nowrap; '
         f'transform: rotate({rot}deg); transform-origin: left bottom">{value}</span>') if value else ''
    return (f'<div style="display: flex; align-items: flex-end; gap: 8px; flex: {flex}">'
            f'<span style="font-family: {BODY}; font-weight: 700; font-size: 13px; letter-spacing: 0.12em; color: {NAVY}; white-space: nowrap; padding-bottom: 3px">{label}</span>'
            f'<span style="position: relative; flex: 1; height: 28px; border-bottom: 1px solid {NAVY}">{v}</span></div>')

def back():
    top = (f'<div style="position: absolute; left: 48px; top: 44px; width: 720px">'
           f'<div style="display: flex; justify-content: space-between; align-items: flex-end">'
           f'<div><div style="font-family: {BODY}; font-weight: 700; font-size: 13px; letter-spacing: 0.24em; color: {ORANGE}">THE 1988 SEASON AT LIBERTY VIEW MANOR</div>'
           f'<h1 style="margin: 4px 0 0 -2px; font-family: {DISP}; font-style: italic; font-weight: 800; font-size: 42px; line-height: 1; white-space: nowrap; color: {NAVY}; {INK}">Weddings and Engagements</h1></div>'
           f'<div style="text-align: right; font-family: {BODY}; font-size: 14px; line-height: 1.3; white-space: nowrap; color: {SOFT}; padding-bottom: 3px">Saturday evening, add 3.00.<br>Tax and gratuity extra.</div></div>'
           f'<div style="height: 3px; background: {NAVY}; margin-top: 10px"></div></div>')
    packs = (f'<div style="position: absolute; left: 48px; top: 140px; width: 720px; display: flex; justify-content: space-between; align-items: stretch">'
             + ''.join(pack(n, p, l, ring=(i == 1)) for i, (n, p, l) in enumerate(PACKS)) + '</div>')

    cake = item('Our wedding cake', 'Vanilla butter sponge baked in our kitchen, split and layered with raspberry jam, frosted in Swiss meringue buttercream and cut tall. Tiered to your count.', '1.25', 'a slice', mt=12)
    vienna = item('The Viennese table', 'Cannoli, napoleons, rum cake, cheesecake and fresh fruit, with espresso and anisette. Wheeled out at midnight.', '6.95', 'pp', mt=13)
    left = (f'<div style="position: absolute; left: 48px; top: 530px; width: 346px">'
            f'{head("From Our Bakery", "THE SWEET END OF THE NIGHT", size=30)}{cake}{vienna}</div>'
            f'<div style="position: absolute; left: 300px; top: 778px; font-family: {HAND}; font-weight: 600; font-size: 26px; color: {LEAD}; transform: rotate(-6deg)">yes!!</div>')
    man = item('Manhattan', 'Bourbon stirred cold with sweet vermouth and a dash of bitters, served up with a cherry.', '3.25', mt=12)
    bars = ''.join(leader(n, p, mt=(10 if i == 0 else 4)) for i, (n, p) in enumerate(BAR))
    right = (f'<div style="position: absolute; left: 422px; top: 530px; width: 346px">'
             f'{head("From Our Bar", "CASH BAR PRICES", size=30)}{man}{bars}</div>')

    coupon = (f'<div style="position: absolute; left: 0; top: 818px; width: {W}px; height: 2px; '
              f'background-image: linear-gradient(90deg, {NAVY} 0 9px, transparent 9px 15px); background-size: 15px 2px; background-repeat: repeat-x"></div>'
              f'<img src="assets/scissors.png" alt="" style="position: absolute; left: 62px; top: 806px; width: 44px; height: 26px; display: block">'
              f'<div style="position: absolute; left: 48px; top: 840px; width: 720px">'
              f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
              f'<div style="font-family: {DISP}; font-style: italic; font-weight: 800; font-size: 24px; color: {NAVY}">Hold my date</div>'
              f'<div style="font-family: {BODY}; font-style: italic; font-size: 14px; color: {SOFT}">Return with a $100 deposit, or bring it by. We will call to confirm.</div></div>'
              f'<div style="display: flex; gap: 22px; margin-top: 4px">{field("NAME", "Cyn", "1.1", -2)}{field("PHONE", "", "1")}</div>'
              f'<div style="display: flex; gap: 22px; margin-top: 6px">{field("OCCASION", "engagement party!!", "1.6", -1.5)}{field("GUESTS", "80", "0.7", -1)}</div>'
              f'<div style="display: flex; gap: 22px; margin-top: 6px">{field("PACKAGE", "The Narrows", "1.2", -1.4)}{field("DATE WANTED", "a Saturday", "1.1", -1)}</div>'
              f'<div style="display: flex; justify-content: space-between; margin-top: 11px; font-family: {BODY}; font-size: 12px; letter-spacing: 0.04em; color: {SOFT}">'
              f'<span>HEAR OUR SPOTS ON METRO RADIO</span><span>FREE PARKING. TWO BALLROOMS, 25 TO 300.</span><span>PRINTED IN U.S.A. 1/88</span></div></div>')

    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {NAVY}">{grain()}'
            f'{top}{packs}{left}{right}{coupon}{wear("back")}</div>')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Liberty View Manor party menu, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
