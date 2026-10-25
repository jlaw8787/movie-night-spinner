"""Builds both faces of the Kessler & Lowe caterer's price folder, spring 1979.
US Letter landscape (11 x 8.5 in), offset in two inks (black and a cool grey) on white felt finish cover stock,
folded once to 5.5 x 8.5 in. outside.html: back panel (left) and cover (right). inside.html: the price list.
Type: Futura (Jost) for heads, names and prices, as phototypeset in 1979; Caslon (Libre Caslon Text) for reading copy.
Image paths are relative to this folder. Run paint.py first, then this, then shot.py."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H, FOLD = 1056, 816, 528
INK, GREYINK, PAPER = '#18191d', '#8a8d92', '#f1f0eb'
BODY = '#26272b'
FONTS = ('https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700'
         '&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap')
SANS, SERIF = "'Jost', 'Futura', sans-serif", "'Libre Caslon Text', Georgia, serif"
LX, RX, PW = 48, FOLD + 48, 432     # left panel x, right panel x, panel text width
# ink spread on uncoated stock: a hair of dot gain round every letter (inherited by all text)
GAIN = 'text-shadow: 0 0 0.6px rgba(24,25,29,0.55)'

# (section, intro, [(name, unit, price, description, note)])
LEFT = [
    ('Cocktail hour', 'Passed on trays, or set out on your sideboard.', [
        ('Italian toasts', 'the dozen', '9.00',
         'French bread rounds, oiled and baked crisp. Half spread with ricotta, lemon peel and honey, half heaped with mushrooms sautéed in garlic and thyme, under Parmesan.', ''),
        ('Shrimp cocktail', 'the dozen', '18.00',
         'Jumbo shrimp, poached and well chilled, with a sharp horseradish sauce and lemon.', ''),
        ('Rumaki', 'the dozen', '7.50',
         'Chicken livers and water chestnuts wrapped in bacon, broiled crisp.', ''),
        ('Manhattans by the pitcher', 'the pitcher', '18.00',
         'Rye, sweet vermouth and bitters, stirred with ice, poured straight up over a cherry. Serves eight.', ''),
    ]),
    ('Sunday brunch', 'Delivered from dawn. We set it out and slip away.', [
        ('Sutton Place platter', 'per guest', '6.50',
         'Toasted bagels, whipped cream cheese, sliced Nova, capers, red onion cut thin and fresh dill.', ''),
        ('Belgian waffles', 'per guest', '4.25',
         'Made at your stove by our cook. Maple syrup, sweet butter, berries in season.',
         'A favorite with dachshund owners.'),
    ]),
]
RIGHT = [
    ('Chinese supper', 'Collected on Mott Street, in the cartons by nine.', [
        ('Kung pao chicken', 'per guest', '7.50',
         'Diced dark meat stir-fried with dried red peppers, soy, rice wine and Chinese black vinegar, tossed with roasted peanuts and scallions. Steamed rice.',
         'Good in front of the late movie.'),
        ('Cold sesame noodles', 'per guest', '3.25',
         'Thin wheat noodles in sesame paste and hot oil, with shredded cucumber.', ''),
        ('Barbecued spareribs', 'the pound', '6.00',
         'Roasted red and glazed with honey, cut between the bones.', ''),
    ]),
    ('Desserts', 'Baked here, the morning of your party.', [
        ('New York cheesecake', 'whole', '14.00',
         'Rich and dense, lemon and vanilla, on a buttery crumb crust. Baked slow, chilled overnight. Serves ten.',
         'Worth living for, say our regulars.'),
        ('Pears in red wine', 'per guest', '2.25',
         'Bosc halves poached with cinnamon and orange peel, a pitcher of heavy cream alongside.',
         'Our answer to Cézanne.'),
        ('Coffee service', 'the urn', '6.00',
         'Thirty cups, fresh brewed, with cream and sugar.', ''),
    ]),
]


def tint(x, y, w, h, extra=''):
    """a screened box in the grey ink, printed 1.5 px out of register with the black keyline over it."""
    return (f'<div style="position: absolute; left: {x + 1.5}px; top: {y + 1}px; width: {w}px; height: {h}px; overflow: hidden{extra}">'
            f'<img src="assets/tint-grey.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 528px; height: 816px; display: block"></div>'
            f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w - 2}px; height: {h - 2}px; border: 1px solid {INK}"></div>')


def dots(n=90):
    return (f'<span style="flex: 1; min-width: 14px; overflow: hidden; font-family: {SANS}; font-size: 13px; '
            f'letter-spacing: 0.16em; color: {GREYINK}; line-height: 1; text-shadow: none">{". " * n}</span>')


def leader(name, unit, price):
    return f'''<div style="display: flex; align-items: baseline; gap: 7px; white-space: nowrap">
      <h3 style="margin: 0; font-family: {SANS}; font-weight: 600; font-size: 18px; line-height: 1.2; letter-spacing: 0.035em; text-transform: uppercase; color: {INK}">{name}</h3>
      {dots()}
      <span style="font-family: {SANS}; font-weight: 500; font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: {GREYINK}">{unit}</span>
      <span style="font-family: {SANS}; font-weight: 600; font-size: 18px; color: {INK}; min-width: 48px; text-align: right">{price}</span></div>'''


def item(n, u, p, d, note, first):
    nt = (f'<p style="margin: 2px 0 0; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.3; color: {INK}">{note}</p>' if note else '')
    return f'''<div style="margin-top: {0 if first else 11}px">{leader(n, u, p)}
      <p style="margin: 3px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.38; color: {BODY}; text-wrap: pretty">{d}</p>{nt}</div>'''


def head(title, size=26):
    return f'''<div style="border-top: 4px solid {INK}; padding-top: 7px">
      <div style="display: flex; align-items: baseline; justify-content: space-between">
        <div style="font-family: {SANS}; font-weight: 700; font-size: {size}px; line-height: 1; letter-spacing: 0.01em; text-transform: uppercase; color: {INK}">{title}</div>
        <div style="font-family: {SANS}; font-weight: 500; font-size: 12px; letter-spacing: 0.2em; color: {GREYINK}">KESSLER &amp; LOWE</div></div>
      <div style="margin-top: 7px; height: 1px; background: {INK}"></div></div>'''


def section(title, intro, items, first):
    rows = ''.join(item(*it, i == 0) for i, it in enumerate(items))
    return f'''<section style="margin-top: {0 if first else 22}px">{head(title)}
      <p style="margin: 6px 0 10px; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.3; color: {BODY}">{intro}</p>
      {rows}</section>'''


def column(x, top, secs):
    return (f'<div style="position: absolute; left: {x}px; top: {top}px; width: {PW}px">'
            + ''.join(section(*s, i == 0) for i, s in enumerate(secs)) + '</div>')


def layers(face, top):
    img = lambda f: (f'<img src="assets/{f}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; '
                     f'width: {W}px; height: {H}px; pointer-events: none; display: block">')
    if not top:
        return img(f'paper-stock-{face}.png')
    return img(f'wear-ink-{face}.png') + img('paper-grain.png') + img(f'wear-{face}.png')


def row(n, p, size=16, fam=None, weight=400, color=None):
    fam = fam or SERIF
    color = color or BODY
    return f'''<div style="display: flex; align-items: baseline; gap: 7px; white-space: nowrap; margin-top: 4px">
        <span style="font-family: {fam}; font-weight: {weight}; font-size: {size}px; color: {color}">{n}</span>{dots(70)}
        <span style="font-family: {SANS}; font-weight: 600; font-size: 16px; color: {INK}">{p}</span></div>'''


def outside():
    staff = [('Waiter, for the evening', '35.00'), ('Bartender, for the evening', '40.00'),
             ('Pianist, for the evening', '60.00')]
    rent = [('Glasses, the dozen', '3.00'), ('Linen, per table', '4.00'), ('Folding chairs, each', '.75')]
    also = ['Gallery openings and museum benefits', 'Book parties for publishers',
            'Rehearsal lunches for television', 'Picnic hampers for the park']
    al = ''.join(f'<div style="margin-top: {0 if i == 0 else 3}px; font-family: {SERIF}; font-size: 16px; line-height: 1.38; color: {BODY}">'
                 f'<span style="display: inline-block; width: 6px; height: 6px; background: {INK}; margin-right: 10px; position: relative; top: -3px"></span>{t}</div>'
                 for i, t in enumerate(also))
    back = f'''<div style="position: absolute; left: {LX}px; top: 48px; width: {PW}px">
      {head('How to order')}
      <p style="margin: 10px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.42; color: {BODY}; text-wrap: pretty">Telephone us by Wednesday for a weekend party, and by five o’clock the day before for brunch. We deliver from the Battery to 96th Street, early, late and in thunderstorms.</p>
      <p style="margin: 7px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.42; color: {BODY}; text-wrap: pretty">Parties of twelve or more. A deposit of one third holds your date.</p>
      <div style="margin-top: 20px">{head('Staff and rentals')}</div>
      <div style="position: relative; margin-top: 10px; height: 214px">
        {tint(0, 0, PW, 214)}
        <div style="position: absolute; left: 16px; top: 10px; width: {PW - 32}px">
          {''.join(row(n, p, 16, SANS, 500, INK) for n, p in staff)}
          <p style="margin: 3px 0 6px; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.3; color: {INK}">Our pianist takes requests. Gershwin a specialty.</p>
          <div style="height: 1px; background: {INK}; margin: 2px 0 4px"></div>
          {''.join(row(n, p, 16, SANS, 500, INK) for n, p in rent)}</div></div>
      <div style="margin-top: 20px">{head('We also do')}</div>
      <div style="margin-top: 10px">{al}</div>
      <p style="margin: 5px 0 0; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.3; color: {BODY}">Carriage and rowboat not included.</p>
    </div>
    <div style="position: absolute; left: {LX}px; top: 694px; width: {PW}px; border-top: 4px solid {INK}; padding-top: 9px; display: flex; justify-content: space-between; align-items: flex-start">
      <div>
        <div style="font-family: {SANS}; font-weight: 700; font-size: 22px; line-height: 1; letter-spacing: -0.01em; color: {INK}">KESSLER <span style="font-family: {SERIF}; font-style: italic; font-weight: 400">&amp;</span> LOWE</div>
        <div style="margin-top: 6px; font-family: {SANS}; font-weight: 500; font-size: 13px; letter-spacing: 0.06em; line-height: 1.35; color: {BODY}">EAST 58TH STREET, NEW YORK, N.Y. 10022</div></div>
      <div style="text-align: right">
        <div style="font-family: {SANS}; font-weight: 700; font-size: 22px; line-height: 1; color: {INK}">(212) 555-0179</div>
        <div style="margin-top: 6px; font-family: {SANS}; font-weight: 500; font-size: 13px; letter-spacing: 0.06em; color: {BODY}">TAX AND GRATUITY EXTRA</div></div></div>'''

    cover = f'''<img src="assets/bridge-halftone.png" alt="Dawn under the Queensboro Bridge, Sutton Place" style="position: absolute; left: {FOLD}px; top: 0; width: 528px; height: 528px; display: block">
    <div style="position: absolute; left: {FOLD}px; top: 536px; width: 528px; height: 280px; background: {INK}"></div>
    <div style="position: absolute; left: {RX}px; top: 566px; width: {PW}px; color: {PAPER}; text-shadow: 0 0 0.7px rgba(24,25,29,0.9)">
      <div style="display: flex; justify-content: space-between; font-family: {SANS}; font-weight: 500; font-size: 13px; letter-spacing: 0.34em">
        <span>CATERERS</span><span>EAST 58TH STREET</span></div>
      <div style="margin-top: 14px; font-family: {SANS}; font-weight: 700; font-size: 58px; line-height: 0.95; letter-spacing: -0.025em; white-space: nowrap">KESSLER <span style="font-family: {SERIF}; font-style: italic; font-weight: 400; font-size: 54px">&amp;</span> LOWE</div>
      <div style="margin-top: 16px; height: 3px; background: {GREYINK}; position: relative; left: 1.5px"></div>
      <p style="margin: 13px 0 0; font-family: {SERIF}; font-style: italic; font-size: 23px; line-height: 1.25">We adore New York City.</p>
      <p style="margin: 6px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.4; color: #d9d8d2">Cocktail parties, brunches, suppers and desserts, to your door.</p></div>
    <div style="position: absolute; left: {RX}px; top: 752px; width: {PW}px; display: flex; justify-content: space-between; font-family: {SANS}; font-weight: 500; font-size: 13px; letter-spacing: 0.3em; color: {GREYINK}; text-shadow: none">
      <span>PRICE LIST</span><span>SPRING 1979</span></div>'''
    return back + cover


def inside():
    party = [('Manhattans, two pitchers', '36.00'), ('Shrimp cocktail, two dozen', '36.00'),
             ('Italian toasts, two dozen', '18.00'), ('New York cheesecake', '14.00'),
             ('Coffee service', '6.00'), ('Waiter, for the evening', '35.00')]
    box_y = 0
    box = f'''<div style="position: absolute; left: {LX}px; top: 640px; width: {PW}px; height: 136px">
      {tint(0, 0, PW, 136)}
      <div style="position: absolute; left: 16px; top: 10px; width: {PW - 32}px">
        <div style="display: flex; justify-content: space-between; align-items: baseline">
          <span style="font-family: {SANS}; font-weight: 700; font-size: 15px; letter-spacing: 0.08em; color: {INK}">A COCKTAIL PARTY FOR TWELVE</span>
          <span style="font-family: {SANS}; font-weight: 700; font-size: 18px; color: {INK}">145.00</span></div>
        <div style="margin-top: 6px; display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px; row-gap: 1px">
          {''.join(f'<div style="display: flex; justify-content: space-between; font-family: {SERIF}; font-size: 14px; line-height: 1.45; color: {INK}"><span>{n.split(",")[0]}</span><span style="font-family: {SANS}; font-weight: 500">{p}</span></div>' for n, p in party)}</div>
        <p style="margin: 5px 0 0; font-family: {SERIF}; font-style: italic; font-size: 14px; line-height: 1.3; color: {INK}">Two pitchers, two dozen of each, one cake and one waiter.</p></div></div>'''
    foot = f'''<div style="position: absolute; left: {RX}px; top: 732px; width: {PW}px; border-top: 4px solid {INK}; padding-top: 9px; display: flex; justify-content: space-between; align-items: baseline">
      <span style="font-family: {SERIF}; font-style: italic; font-size: 16px; color: {INK}">Nothing here is overrated.</span>
      <span style="font-family: {SANS}; font-weight: 600; font-size: 13px; letter-spacing: 0.2em; color: {INK}">(212) 555-0179</span></div>'''
    return column(LX, 48, LEFT) + box + column(RX, 48, RIGHT) + foot


def page(face, body):
    root = (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}; {GAIN}">'
            f'{layers(face, False)}{body}{layers(face, True)}</div>')
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Kessler &amp; Lowe price list, {face}</title>'
            f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{root}</body></html>')


for face, fn in (('outside', outside), ('inside', inside)):
    open(os.path.join(D, face + '.html'), 'w').write(page(face, fn()))
print('built')
