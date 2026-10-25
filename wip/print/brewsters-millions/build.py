"""Builds both faces of The Vandermeer in-suite dining card, Fifth Avenue, New York, 1985.
US letter (8.5 x 11 in, 816 x 1056 px), heavy gloss black board printed both sides, flat, no folds.
The look is a 1985 luxury hotel: black lacquer, brass gold and rose marble pink, a Didone
wordmark, Futura style capitals for the labels, dot leaders and lining figures on every price.
Writes front.html and back.html from front.body.html and back.body.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
BLACK, GOLD, GOLD_HI, ROSE, ROSE_D, BURG, INK, MUTED = (
    '#151216', '#b8913f', '#dcbd72', '#f0d9cf', '#e0bcae', '#7d1a34', '#23171b', '#5a4247')
FONTS = ('family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800'
         '&family=Jost:ital,wght@0,400;0,500;0,600;1,400&family=Nothing+You+Could+Do&family=Oswald:wght@500;700')
FONT_LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
BOD = "font-family: 'Bodoni Moda', 'Didot', serif"
JOS = "font-family: 'Jost', 'Futura', sans-serif"
NUM = "font-variant-numeric: lining-nums tabular-nums; font-feature-settings: 'lnum' 1, 'tnum' 1"

# (name, description, price)
BEGIN = [
    ('Jumbo shrimp cocktail', 'Poached, chilled and peeled, on shredded iceberg with a rosy tomato mayonnaise, lemon and a dusting of paprika.', '9.75'),
    ('Blini with red caviar', 'Warm buckwheat pancakes, crème fraîche, salmon roe and snipped chives.', '14.00'),
]
GRILL = [
    ('Surf and turf', 'An eight ounce filet mignon seared to your liking, a split lobster tail broiled in garlic butter, béarnaise on the side.', '30.00'),
    ('Club sandwich', 'Triple decker of roast turkey, crisp bacon, lettuce and tomato on toasted white bread, with a pickle spear.', '8.75'),
]
SIDES = [
    ('Shoestring potatoes', 'Fried thin and crisp, well salted.', '3.25'),
    ('Creamed spinach', 'With nutmeg and grated Parmesan.', '3.75'),
]
SWEETS = [
    ('Postage stamps', 'Butter shortbread cut with a pinked edge, each piped with icing. Six to a plate.', '4.50'),
    ('Hot fudge sundae', 'Vanilla ice cream, warm chocolate sauce, whipped cream, a cherry.', '4.75'),
]
BAR = [
    ('Champagne cocktail', 'A sugar cube soaked in bitters, a splash of orange liqueur, topped with chilled brut and a twist of peel.', '6.50'),
    ('House champagne', 'A bottle of French brut on ice, with two flutes.', '38.00'),
    ('Pot of coffee', 'Fresh brewed, regular or decaffeinated, cream and sugar. Serves two.', '3.25'),
    ('Orange juice', 'Squeezed to order. The large glass.', '2.75'),
]
BREAKFAST = [
    ('Eggs Benedict', 'Poached, on Canadian bacon and a toasted English muffin, hollandaise over the top.', '7.50'),
    ('Berries Romanoff', 'Strawberries steeped in orange liqueur, folded through softly whipped cream.', '5.25'),
]
SERVICES = [
    ('Postcards and stamps', 'At the front desk. Mail left with the bell captain goes out each afternoon.'),
    ('The concierge', 'Limousines and theater tickets.'),
    ('The Grand Ballroom', 'Private parties of twenty to two thousand.'),
]


def tab(label):
    """Section label: gold capitals on a black tab, a gold hairline running on."""
    return (f'<div style="display: flex; align-items: center">'
            f'<div style="background: {BLACK}; color: {GOLD_HI}; {JOS}; font-weight: 600; font-size: 13px; line-height: 1; '
            f'letter-spacing: 0.3em; padding: 6px 9px 5px 12px; white-space: nowrap">{label}</div>'
            f'<div style="flex: 1; height: 0; border-top: 1px solid {GOLD}"></div></div>')


def item(n, d, p, top=14, size=25, desc_right=56):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; align-items: baseline; gap: 8px">'
            f'<h3 style="margin: 0; flex: 0 1 auto; min-width: 0; {BOD}; font-weight: 600; font-size: {size}px; line-height: 1.1; color: {INK}">{n}</h3>'
            f'<div style="flex: 1; min-width: 12px; border-bottom: 2px dotted {GOLD}; transform: translateY(-5px)"></div>'
            f'<span style="{BOD}; {NUM}; font-weight: 600; font-size: 22px; color: {INK}; white-space: nowrap">{p}</span></div>'
            f'<p style="margin: 3px {desc_right}px 0 0; {JOS}; font-weight: 400; font-size: 16px; line-height: 1.4; color: {MUTED}; text-wrap: pretty">{d}</p></div>')


def section(label, items, top=22, size=25, desc_right=56, gap=13):
    return (f'<div style="margin-top: {top}px">{tab(label)}'
            + ''.join(item(*x, top=(10 if i == 0 else gap), size=size, desc_right=desc_right) for i, x in enumerate(items)) + '</div>')


def services():
    return ''.join(
        f'<div style="{"" if i == 0 else "margin-top: 6px"}"><div style="{JOS}; font-weight: 600; font-size: 13px; letter-spacing: 0.2em; color: {BURG}">{t.upper()}</div>'
        f'<p style="margin: 2px 0 0; {JOS}; font-weight: 400; font-size: 16px; line-height: 1.4; color: {INK}; text-wrap: pretty">{d}</p></div>'
        for i, (t, d) in enumerate(SERVICES))


def frame():
    """Gold double rule round the black board."""
    return (f'<div style="position: absolute; left: 20px; top: 20px; width: {W - 40}px; height: {H - 40}px; border: 2px solid {GOLD}; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 27px; top: 27px; width: {W - 54}px; height: {H - 54}px; border: 0.75px solid {GOLD}; box-sizing: border-box"></div>')


def panel(top, bottom, left=56, right=W - 56, notch=12):
    """Rose panel with stepped deco corners, built from two overlapping blocks, and a gold
    hairline that follows the steps."""
    w, h = right - left, bottom - top
    s = (f'<div style="position: absolute; left: {left + notch}px; top: {top}px; width: {w - 2 * notch}px; height: {h}px; background: {ROSE}"></div>'
         f'<div style="position: absolute; left: {left}px; top: {top + notch}px; width: {w}px; height: {h - 2 * notch}px; background: {ROSE}"></div>')
    # gold hairline: straight runs plus the little steps at each corner
    i = 6
    g = f'background: {GOLD}'
    runs = [
        (left + notch + i, top + i, w - 2 * notch - 2 * i, 1), (left + notch + i, bottom - i - 1, w - 2 * notch - 2 * i, 1),
        (left + i, top + notch + i, 1, h - 2 * notch - 2 * i), (right - i - 1, top + notch + i, 1, h - 2 * notch - 2 * i),
    ]
    for cx, cy, sx, sy in [(left, top, 1, 1), (right, top, -1, 1), (left, bottom, 1, -1), (right, bottom, -1, -1)]:
        # vertical step from the top run down to the side run's row, horizontal step across
        x_step = cx + sx * (notch + i) - (1 if sx < 0 else 0)
        y_side = cy + sy * (notch + i) - (1 if sy < 0 else 0)
        x_side = cx + sx * i - (1 if sx < 0 else 0)
        y_top = cy + sy * i - (1 if sy < 0 else 0)
        runs.append((x_step, min(y_top, y_side), 1, abs(y_side - y_top) + 1))
        runs.append((min(x_side, x_step), y_side, abs(x_step - x_side) + 1, 1))
    s += ''.join(f'<div style="position: absolute; left: {x}px; top: {y}px; width: {ww}px; height: {hh}px; {g}"></div>' for x, y, ww, hh in runs)
    return s


def facade():
    return ('<img src="assets/facade-gouache.png" alt="The Vandermeer at dusk: the limestone front, the burgundy canopy and red carpet, a limousine at the curb" '
            'style="position: absolute; left: 64px; top: 40px; width: 688px; height: 320px; display: block">')


def sticker():
    """A campaign sticker someone pressed onto the card. Red ring, white face, navy type."""
    return ('<div style="position: absolute; left: 628px; top: 34px; width: 128px; height: 128px; transform: rotate(9deg)">'
            '<div style="position: absolute; inset: 0; border-radius: 50%; background: #fbf8f1; border: 7px solid #b3262b; box-sizing: border-box; '
            'box-shadow: 0 1px 3px rgba(0,0,0,0.45)"></div>'
            '<div style="position: absolute; left: 12px; right: 12px; top: 12px; bottom: 12px; border-radius: 50%; border: 1.5px solid #233a72"></div>'
            '<div style="position: absolute; left: 0; right: 0; top: 27px; text-align: center; font-family: \'Oswald\', sans-serif; color: #233a72; line-height: 1">'
            '<div style="font-weight: 500; font-size: 13px; letter-spacing: 0.3em; padding-left: 0.3em">VOTE</div>'
            '<div style="font-weight: 700; font-size: 21px; letter-spacing: 0.02em; margin-top: 5px">NONE OF</div>'
            '<div style="font-weight: 700; font-size: 21px; letter-spacing: 0.02em; margin-top: 1px">THE ABOVE</div>'
            '<div style="width: 46px; height: 0; border-top: 2px solid #b3262b; margin: 6px auto 0"></div></div></div>')


def note():
    """Monty's pencilled note to Spike, left on the card in the suite."""
    return ('<div style="margin: 0 0 0 auto; width: 250px; padding-top: 30px; transform: rotate(-4deg); '
            'font-family: \'Nothing You Could Do\', cursive; font-size: 21px; line-height: 1.35; color: #4a4146">'
            'Spike, order anything<br>you want. Put it<br>on the suite.<div style="text-align: right; margin-right: 30px">Monty</div></div>')


def overlays(face):
    s = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: 0.7">'
         f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">')
    if face == 'back':
        s += '<img src="assets/stain-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 556px; top: 790px; width: 190px; height: 190px; pointer-events: none; display: block">'
    return s


def bar_col():
    return section('THE BAR', BAR, top=0, size=23, desc_right=0, gap=12)


def left_col():
    return section('ALONGSIDE', SIDES, top=0, size=23, desc_right=0, gap=12) + section('SWEETS', SWEETS, top=20, size=23, desc_right=0, gap=12)


for face in ('front', 'back'):
    b = open(os.path.join(D, face + '.body.html')).read()
    rep = {
        '{{FRAME}}': frame(), '{{FACADE}}': facade(),
        '{{PANEL_FRONT}}': panel(462, 1006), '{{PANEL_BACK}}': panel(142, 1006),
        '{{BEGIN}}': section('TO BEGIN', BEGIN, top=14, gap=11), '{{GRILL}}': section('FROM THE GRILL', GRILL, top=18, gap=11),
        '{{LEFT}}': left_col(), '{{BAR}}': bar_col(), '{{BFAST_L}}': item(*BREAKFAST[0], top=10, size=23, desc_right=0), '{{BFAST_R}}': item(*BREAKFAST[1], top=10, size=23, desc_right=0), '{{TAB_BFAST}}': tab('BREAKFAST IN THE SUITE'),
        '{{SERVICES}}': services(), '{{STICKER}}': sticker(), '{{NOTE}}': note(),
        '{{TAB_SERVICE}}': tab('AT YOUR SERVICE'),
        '{{OVERLAYS}}': overlays(face), '{{NUM}}': NUM,
    }
    for k, v in rep.items():
        b = b.replace(k, v)
    assert '{{' not in b, b[b.index('{{'):b.index('{{') + 40]
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Vandermeer in-suite dining card, {face}</title>{FONT_LINK}'
        f'<style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
