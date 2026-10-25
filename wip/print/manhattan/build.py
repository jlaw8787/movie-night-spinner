"""Builds both faces of the Kessler & Lowe caterer's price folder, spring 1979.
US Letter landscape (11 x 8.5 in), printed one colour black on white uncoated stock, folded once to 5.5 x 8.5 in.
outside.html: back panel (left) and cover (right). inside.html: the price list across both inner panels.
Image paths are relative to this folder."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H, FOLD = 1056, 816, 528
INK, GREY, PAPER = '#171718', '#55565a', '#f4f2ec'
FONTS = ('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600'
         '&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&display=swap')
SANS, SERIF = "'Jost', 'Futura', sans-serif", "'Libre Caslon Text', Georgia, serif"
LX, RX, PW = 48, FOLD + 44, 436     # left panel x, right panel x, panel text width

# (section, intro, [(name, unit, price, description, note)])
LEFT = [
    ('cocktails', 'Passed on trays, or laid out on your sideboard.', [
        ('Toasts, two ways', 'the dozen', '9.00',
         'Crisp baguette rounds. Whipped ricotta with lemon zest and honey, or mushrooms fried with thyme and garlic under shaved parmesan.', ''),
        ('Shrimp cocktail', 'the dozen', '18.00',
         'Jumbo, poached and well chilled, with a sharp horseradish sauce and lemon.', ''),
        ('Manhattans by the pitcher', 'the pitcher', '18.00',
         'Rye, sweet vermouth and bitters, stirred over ice, poured into chilled coupes with a cherry. Serves eight.', ''),
    ]),
    ('brunch', 'Delivered from dawn. We set it out and slip away.', [
        ('Sutton Place board', 'per guest', '6.50',
         'Toasted bagels, cream cheese whipped light, sliced Nova, capers, paper-thin red onion and dill.', ''),
        ('Belgian waffles', 'per guest', '4.25',
         'Cooked to order in your kitchen by our cook. Maple syrup, sweet butter, berries in season.', ''),
    ]),
]
RIGHT = [
    ('suppers', 'Hot, in the cartons, by nine o’clock.', [
        ('Kung pao chicken', 'per guest', '7.50',
         'Thigh meat tossed in a hot wok with dried red chilies and Szechuan peppercorns, glazed with black vinegar, soy and rice wine. Roasted peanuts, scallions and steamed rice.',
         'Good in front of the late movie.'),
        ('Cold sesame noodles', 'per guest', '3.25',
         'Thin wheat noodles in sesame paste and chili oil, with shredded cucumber.', ''),
    ]),
    ('desserts', 'Baked here, the morning of your party.', [
        ('New York cheesecake', 'whole', '14.00',
         'Dense and creamy, lemon and vanilla, on a buttery crumb crust. Baked low, chilled overnight. Serves ten.', ''),
        ('Pears in red wine', 'per guest', '2.25',
         'Bosc halves poached with cinnamon and orange peel, whipped cream alongside.', ''),
        ('Coffee service', 'the urn', '6.00',
         'Thirty cups, fresh brewed, with cream and sugar.', ''),
    ]),
]

def leader(name, unit, price):
    dots = '. ' * 80
    return f'''<div style="display: flex; align-items: baseline; gap: 8px; white-space: nowrap">
      <h3 style="margin: 0; font-family: {SANS}; font-weight: 500; font-size: 21px; line-height: 1.15; letter-spacing: 0.005em; color: {INK}">{name}</h3>
      <span style="flex: 1; min-width: 12px; overflow: hidden; font-family: {SANS}; font-size: 13px; letter-spacing: 0.12em; color: #8a8b8f; line-height: 1">{dots}</span>
      <span style="font-family: {SANS}; font-weight: 400; font-size: 12.5px; letter-spacing: 0.1em; text-transform: uppercase; color: {GREY}">{unit}</span>
      <span style="font-family: {SANS}; font-weight: 500; font-size: 19px; color: {INK}; min-width: 50px; text-align: right">{price}</span></div>'''

def item(n, u, p, d, note, first):
    nt = (f'<p style="margin: 3px 0 0; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.35; color: {INK}">{note}</p>' if note else '')
    return f'''<div style="margin-top: {0 if first else 12}px">{leader(n, u, p)}
      <p style="margin: 4px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.42; color: #2a2a2c; text-wrap: pretty">{d}</p>{nt}</div>'''

def section(title, intro, items, first):
    rows = ''.join(item(*it, i == 0) for i, it in enumerate(items))
    return f'''<section style="margin-top: {0 if first else 24}px">
      <div style="display: flex; align-items: baseline; justify-content: space-between; border-bottom: 2px solid {INK}; padding-bottom: 6px">
        <div style="font-family: {SANS}; font-weight: 300; font-size: 38px; line-height: 1; letter-spacing: -0.01em; color: {INK}">{title}</div></div>
      <p style="margin: 7px 0 11px; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.3; color: {GREY}">{intro}</p>
      {rows}</section>'''

def column(x, top, secs):
    return (f'<div style="position: absolute; left: {x}px; top: {top}px; width: {PW}px">'
            + ''.join(section(*s, i == 0) for i, s in enumerate(secs)) + '</div>')

def sq():
    return f'<span style="display: inline-block; width: 6px; height: 6px; background: {INK}; margin-right: 10px; position: relative; top: -3px"></span>'

def overlays(face):
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">')

def wordmark(size, light=300):
    return (f'<div style="font-family: {SANS}; font-weight: {light}; font-size: {size}px; line-height: 1; letter-spacing: -0.015em; color: {INK}">'
            f'Kessler <span style="font-family: {SERIF}; font-style: italic; font-weight: 400; font-size: {round(size*0.86)}px">&amp;</span> Lowe</div>')

def outside():
    services = [
        ('Waiter, for the evening', '35.00'),
        ('Bartender, for the evening', '40.00'),
        ('Pianist, for the evening', '60.00'),
    ]
    srv = ''.join(f'''<div style="display: flex; align-items: baseline; gap: 8px; white-space: nowrap; margin-top: {0 if i == 0 else 8}px">
        <span style="font-family: {SANS}; font-weight: 500; font-size: 18px; color: {INK}">{n}</span>
        <span style="flex: 1; min-width: 12px; overflow: hidden; font-family: {SANS}; font-size: 13px; letter-spacing: 0.12em; color: #8a8b8f">{'. ' * 60}</span>
        <span style="font-family: {SANS}; font-weight: 500; font-size: 18px; color: {INK}">{p}</span></div>''' for i, (n, p) in enumerate(services))
    also = [
        'Gallery openings and benefits',
        'Book parties for publishers',
        'Rehearsal lunches for television',
        'Picnic hampers for the park',
    ]
    al = ''.join(f'<div style="margin-top: {0 if i == 0 else 5}px; font-family: {SERIF}; font-size: 16px; line-height: 1.4; color: #2a2a2c">{sq()}{t}</div>' for i, t in enumerate(also))
    back = f'''<div style="position: absolute; left: {LX}px; top: 52px; width: {PW}px">
      <div style="font-family: {SANS}; font-weight: 300; font-size: 38px; line-height: 1; color: {INK}; border-bottom: 2px solid {INK}; padding-bottom: 6px">how to order</div>
      <p style="margin: 14px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.5; color: #2a2a2c; text-wrap: pretty">Telephone us by Wednesday for a weekend party, and by five o’clock the day before for brunch. We deliver from the Battery to 96th Street, and we start early.</p>
      <p style="margin: 10px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.5; color: #2a2a2c; text-wrap: pretty">Parties of twelve or more. Glasses, linen and folding chairs to rent; ask when you call.</p>

      <div style="margin-top: 24px; font-family: {SANS}; font-weight: 300; font-size: 36px; line-height: 1; color: {INK}; border-bottom: 2px solid {INK}; padding-bottom: 6px">we also do</div>
      <div style="margin-top: 14px">{al}</div>
      <p style="margin: 8px 0 0; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.35; color: {GREY}">Carriage and rowboat not included.</p>

      <div style="margin-top: 24px; font-family: {SANS}; font-weight: 300; font-size: 36px; line-height: 1; color: {INK}; border-bottom: 2px solid {INK}; padding-bottom: 6px">service</div>
      <div style="margin-top: 14px">{srv}</div>
      <p style="margin: 8px 0 0; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.35; color: {GREY}">Our pianist takes requests. Gershwin a specialty.</p>
    </div>
    <div style="position: absolute; left: {LX}px; top: 698px; width: {PW}px; display: flex; justify-content: space-between; align-items: flex-end; border-top: 1px solid {INK}; padding-top: 12px">
      <div>{wordmark(24, 400)}
        <div style="margin-top: 6px; font-family: {SANS}; font-weight: 400; font-size: 14px; line-height: 1.4; color: #2a2a2c">East 58th Street, New York 10022</div></div>
      <div style="text-align: right; font-family: {SANS}; font-size: 14px; line-height: 1.4; color: #2a2a2c">
        <div style="font-weight: 500; font-size: 18px; color: {INK}">(212) 555-0179</div>
        <div>Tax and gratuity extra.</div></div></div>'''
    cover = f'''<img src="assets/skyline.jpg" alt="The East Side skyline at dusk" style="position: absolute; left: {FOLD}px; top: 0; width: 528px; height: 470px; display: block">
    <div style="position: absolute; left: {RX}px; top: 508px; width: {PW}px">
      <div style="font-family: {SANS}; font-weight: 500; font-size: 13px; letter-spacing: 0.42em; color: {INK}">CATERERS</div>
      <div style="margin-top: 12px">{wordmark(62)}</div>
      <div style="margin-top: 18px; height: 2px; background: {INK}"></div>
      <p style="margin: 14px 0 0; font-family: {SERIF}; font-style: italic; font-size: 22px; line-height: 1.3; color: {INK}">We adore New York City.</p>
      <p style="margin: 6px 0 0; font-family: {SERIF}; font-size: 16px; line-height: 1.45; color: #2a2a2c">Cocktail parties, brunches, suppers and desserts, brought to your door.</p></div>
    <div style="position: absolute; left: {RX}px; top: 738px; width: {PW}px; display: flex; justify-content: space-between; font-family: {SANS}; font-weight: 500; font-size: 13px; letter-spacing: 0.24em; color: {INK}">
      <span>PRICE LIST</span><span>SPRING 1979</span></div>'''
    return back + cover

def inside():
    foot = f'''<div style="position: absolute; left: {RX}px; top: 726px; width: {PW}px; border-top: 1px solid {INK}; padding-top: 10px; display: flex; justify-content: space-between; align-items: baseline">
      <span style="font-family: {SERIF}; font-style: italic; font-size: 16px; color: {INK}">Nothing here is overrated.</span>
      <span style="font-family: {SANS}; font-weight: 500; font-size: 13px; letter-spacing: 0.22em; color: {INK}">KESSLER &amp; LOWE</span></div>'''
    return column(LX, 52, LEFT) + column(RX, 52, RIGHT) + foot

def page(face, body):
    root = (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{body}{overlays(face)}</div>')
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Kessler &amp; Lowe price list, {face}</title>'
            f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{root}</body></html>')

for face, fn in (('outside', outside), ('inside', inside)):
    open(os.path.join(D, face + '.html'), 'w').write(page(face, fn()))
print('built')
