"""Builds both faces of The Vandermeer in-suite dining card, New York, 1985.
US letter (8.5 x 11 in, 816 x 1056 px), heavy card printed both sides, flat, no folds.
Writes front.html and back.html from front.body.html and back.body.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
GREEN, GOLD, CREAM, INK, WINE, MUTED = '#1d3a2b', '#a5803a', '#f4ecd8', '#1c2a21', '#7b2b22', '#4f5a50'
FONTS = ('family=Cinzel:wght@400;600;700&family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600'
         '&family=Nothing+You+Could+Do&family=Oswald:wght@500;700')
FONT_LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
CIN = "font-family: 'Cinzel', serif"
COR = "font-family: 'Cormorant Garamond', serif"

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
    ('Postage stamp shortbread', 'Pinked-edge butter cookies, each piped with icing. Six to a plate.', '4.50'),
    ('Hot fudge sundae', 'Vanilla ice cream, warm chocolate sauce, whipped cream, a cherry.', '4.75'),
]
BAR = [
    ('Champagne cocktail', 'A sugar cube soaked in bitters, a splash of orange liqueur, topped with chilled brut and a twist of peel.', '6.50'),
    ('House champagne', 'A bottle of French brut on ice, with two flutes.', '38.00'),
    ('Pot of coffee', 'Fresh brewed, regular or decaffeinated, cream and sugar. Serves two.', '3.25'),
    ('Orange juice', 'Squeezed to order. The large glass.', '2.75'),
]
SERVICES = [
    ('Postcards and stamps', 'At the front desk. Mail left with the bell captain goes out each afternoon.'),
    ('The concierge', 'Limousines and theater tickets.'),
    ('The Grand Ballroom', 'Private parties of twenty to two thousand.'),
]


def head(label):
    return (f'<div style="display: flex; align-items: center; gap: 14px; margin-bottom: 4px">'
            f'<div style="{CIN}; font-weight: 700; font-size: 15px; letter-spacing: 0.24em; color: {GREEN}; white-space: nowrap">{label}</div>'
            f'<div style="flex: 1; height: 0; border-top: 1px solid {GOLD}"></div></div>')


def item(n, d, p, top=14, size=26):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; align-items: baseline; gap: 16px">'
            f'<h3 style="margin: 0; flex: 1; min-width: 0; {COR}; font-weight: 700; font-size: {size}px; line-height: 1.1; color: {INK}">{n}</h3>'
            f'<span style="{COR}; font-weight: 700; font-size: 23px; color: {INK}; white-space: nowrap">{p}</span></div>'
            f'<p style="margin: 3px 60px 0 0; {COR}; font-weight: 500; font-size: 19px; line-height: 1.3; color: {MUTED}; text-wrap: pretty">{d}</p></div>')


def section(label, items, top=30):
    return f'<div style="margin-top: {top}px">{head(label)}' + ''.join(item(*x, top=(10 if i == 0 else 16)) for i, x in enumerate(items)) + '</div>'


def sides():
    cells = ''.join(
        f'<div style="flex: 1; min-width: 0"><div style="display: flex; align-items: baseline; gap: 12px">'
        f'<h3 style="margin: 0; flex: 1; {COR}; font-weight: 700; font-size: 24px; line-height: 1.1; color: {INK}">{n}</h3>'
        f'<span style="{COR}; font-weight: 700; font-size: 22px; color: {INK}">{p}</span></div>'
        f'<p style="margin: 3px 0 0; {COR}; font-weight: 500; font-size: 19px; line-height: 1.3; color: {MUTED}">{d}</p></div>'
        for n, d, p in SIDES)
    return f'<div style="margin-top: 30px">{head("ALONGSIDE")}<div style="display: flex; gap: 40px; margin-top: 10px">{cells}</div></div>'


def crest(size):
    """The hotel's seal: a gold ring, a hairline ring inside, a V and two small diamonds."""
    i = round(size * 0.12)
    dia = round(size * 0.07)
    def diamond(x):
        return (f'<div style="position: absolute; left: {x - dia / 2}px; top: {size * 0.78 - dia / 2}px; width: {dia}px; height: {dia}px; '
                f'background: {GOLD}; transform: rotate(45deg)"></div>')
    return (f'<div style="position: relative; width: {size}px; height: {size}px; margin: 0 auto">'
            f'<div style="position: absolute; inset: 0; border: {max(2, round(size / 36))}px solid {GOLD}; border-radius: 50%"></div>'
            f'<div style="position: absolute; left: {i / 2}px; top: {i / 2}px; right: {i / 2}px; bottom: {i / 2}px; border: 1px solid {GOLD}; border-radius: 50%"></div>'
            f'<div style="position: absolute; left: 0; right: 0; top: {size * 0.17}px; text-align: center; {CIN}; font-weight: 600; font-size: {round(size * 0.5)}px; line-height: 1; color: {GREEN}">V</div>'
            + diamond(size * 0.36) + diamond(size * 0.64) + '</div>')


def ornament(width=300):
    return (f'<div style="display: flex; align-items: center; justify-content: center; gap: 10px; margin: 0 auto; width: {width}px">'
            f'<div style="flex: 1; border-top: 1px solid {GOLD}"></div>'
            f'<div style="width: 7px; height: 7px; background: {GOLD}; transform: rotate(45deg)"></div>'
            f'<div style="width: 10px; height: 10px; border: 1px solid {GOLD}; transform: rotate(45deg)"></div>'
            f'<div style="width: 7px; height: 7px; background: {GOLD}; transform: rotate(45deg)"></div>'
            f'<div style="flex: 1; border-top: 1px solid {GOLD}"></div></div>')


def services():
    rows = ''.join(
        f'<div style="{"" if i == 0 else "margin-top: 10px"}"><div style="{CIN}; font-weight: 700; font-size: 13px; letter-spacing: 0.16em; color: {WINE}">{t}</div>'
        f'<p style="margin: 2px 0 0; {COR}; font-weight: 500; font-size: 19px; line-height: 1.3; color: {INK}; text-wrap: pretty">{d}</p></div>'
        for i, (t, d) in enumerate(SERVICES))
    return rows


def sticker():
    """A campaign sticker someone pressed onto the card. Red ring, white face, navy type."""
    return ('<div style="position: absolute; left: 612px; top: 44px; width: 130px; height: 130px; transform: rotate(9deg)">'
            '<div style="position: absolute; inset: 0; border-radius: 50%; background: #fbf8f1; border: 7px solid #b3262b; box-sizing: border-box; '
            'box-shadow: 0 1px 2px rgba(0,0,0,0.25)"></div>'
            '<div style="position: absolute; left: 12px; right: 12px; top: 12px; bottom: 12px; border-radius: 50%; border: 1.5px solid #233a72"></div>'
            '<div style="position: absolute; left: 0; right: 0; top: 27px; text-align: center; font-family: \'Oswald\', sans-serif; color: #233a72; line-height: 1">'
            '<div style="font-weight: 500; font-size: 13px; letter-spacing: 0.3em; padding-left: 0.3em">VOTE</div>'
            '<div style="font-weight: 700; font-size: 21px; letter-spacing: 0.02em; margin-top: 5px">NONE OF</div>'
            '<div style="font-weight: 700; font-size: 21px; letter-spacing: 0.02em; margin-top: 1px">THE ABOVE</div>'
            '<div style="width: 46px; height: 0; border-top: 2px solid #b3262b; margin: 6px auto 0"></div></div></div>')


def note():
    """Monty's pencilled note to Spike, left on the card in the suite."""
    return ('<div style="margin: 0 0 0 auto; width: 270px; padding-top: 52px; transform: rotate(-4deg); '
            'font-family: \'Nothing You Could Do\', cursive; font-size: 21px; line-height: 1.35; color: #4a4d52">'
            'Spike, order anything<br>you want. Put it<br>on the suite.<div style="text-align: right; margin-right: 30px">Monty</div></div>')


def frame():
    """Green card border with a gold double rule just inside the cream panel."""
    return (f'<div style="position: absolute; left: 30px; top: 30px; width: {W - 60}px; height: {H - 60}px; background: {CREAM}"></div>'
            f'<div style="position: absolute; left: 42px; top: 42px; width: {W - 84}px; height: {H - 84}px; border: 1.5px solid {GOLD}; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 48px; top: 48px; width: {W - 96}px; height: {H - 96}px; border: 0.75px solid {GOLD}; box-sizing: border-box"></div>')


def overlays(face):
    s = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: 0.85">'
         f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">')
    if face == 'back':
        s += '<img src="assets/stain-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 566px; top: 520px; width: 200px; height: 200px; pointer-events: none; display: block">'
    return s


for face in ('front', 'back'):
    b = open(os.path.join(D, face + '.body.html')).read()
    rep = {
        '{{FRAME}}': frame(), '{{CREST}}': crest(78), '{{CREST_SM}}': crest(52), '{{ORN}}': ornament(),
        '{{BEGIN}}': section('TO BEGIN', BEGIN, top=26), '{{GRILL}}': section('FROM THE GRILL', GRILL),
        '{{SIDES}}': sides(), '{{SWEETS}}': section('SWEETS', SWEETS, top=26), '{{BAR}}': section('THE BAR', BAR, top=26),
        '{{SERVICES}}': services(), '{{STICKER}}': sticker(), '{{NOTE}}': note(),
        '{{OVERLAYS}}': overlays(face),
    }
    for k, v in rep.items():
        b = b.replace(k, v)
    assert '{{' not in b, b[b.index('{{'):b.index('{{') + 40]
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Vandermeer in-suite dining card, {face}</title>{FONT_LINK}'
        f'<style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
