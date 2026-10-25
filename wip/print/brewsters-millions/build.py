"""Builds both faces of The Vandermeer in-suite dining card, New York, 1985.

US letter (8.5 x 11 in, 816 x 1056 px), one heavy ivory board printed both sides, flat, no folds.
Made the way a 1985 luxury hotel card was made: a solid black offset flood across the head of
each face with gold foil stamped into it (a line engraving of the hotel on the front), the menu
offset printed below in black with a burgundy second ink, English courses with French headings,
dot leaders, and a blind embossed frame pressed into the board. Art layers come from paint_print.py.

Writes front.body.html, back.body.html, front.html and back.html.
"""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
IVORY, INK, GREY, BURG, PENCIL = '#f2ead9', '#1c1618', '#463a3c', '#7a1d2f', '#57525a'
FONTS = ('family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..800;1,6..96,400..800'
         '&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Nothing+You+Could+Do')
FONT_LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
BOD = "font-family: 'Bodoni Moda', 'Didot', serif"
GAR = "font-family: 'EB Garamond', 'Garamond', serif"
HAND = "font-family: 'Nothing You Could Do', cursive"
NUM = "font-variant-numeric: lining-nums tabular-nums; font-feature-settings: 'lnum' 1, 'tnum' 1"

# (name, description, price)
BEGIN = [
    ('Jumbo shrimp cocktail', 'Six, poached and chilled, on shredded iceberg with a rosy tomato mayonnaise and lemon. Paprika.', '11.50'),
    ('Blini with red caviar', 'Warm buckwheat pancakes, crème fraîche, salmon roe and chopped chives.', '16.00'),
    ('Onion soup gratinée', 'Rich beef broth and sweet cooked onions under a crouton and bubbling Gruyère.', '5.50'),
]
GRILL = [
    ('Surf and turf', 'An eight ounce filet mignon cooked to your liking and a lobster tail, split and broiled in garlic butter. Béarnaise on the side.', '30.00'),
    ('Club sandwich', 'Roast turkey, bacon, lettuce and tomato, three decks high on toast, with a pickle.', '9.75'),
]
SIDES = [
    ('Shoestring potatoes', 'Cut thin, fried crisp and well salted.', '3.50'),
    ('Creamed spinach', 'A little nutmeg and grated Parmesan.', '3.75'),
]
SWEETS = [
    ('Postage stamps', 'Butter shortbread with a pinked edge, each piped with an iced stamp. Six to a plate.', '4.50'),
    ('Hot fudge sundae', 'Vanilla ice cream, warm chocolate sauce, toasted almonds and a cherry.', '5.25'),
]
BAR = [
    ('Champagne cocktail', 'A sugar cube soaked in bitters, a dash of orange liqueur, filled with chilled brut and a twist of peel.', '7.00'),
    ('House champagne', 'French brut by the bottle, sent up on ice with two glasses.', '45.00'),
    ('Pot of coffee', 'Fresh brewed, regular or decaffeinated, with cream. Serves two.', '3.75'),
    ('Orange juice', 'Squeezed to order and served in the large glass.', '3.25'),
]
BREAKFAST = [
    ('Eggs Benedict', 'Two poached eggs on Canadian bacon and a toasted English muffin, hollandaise.', '9.50'),
    ('Ham and eggs', 'Two eggs any style with a ham steak, home fried potatoes and buttered toast.', '7.25'),
    ('Berries Romanoff', 'Strawberries steeped in Curaçao and folded into whipped cream.', '6.50'),
]
SERVICES = [
    ('Postcards and stamps', 'At the front desk. Mail left with the bell captain goes out each afternoon.'),
    ('The concierge', 'Limousines, theater tickets and dinner reservations.'),
    ('The Grand Ballroom', 'Private parties for twenty to two thousand.'),
]


def head(en, fr, top=0):
    """Course heading: burgundy spaced capitals, the French in italic, a fine rule running on."""
    return (f'<div style="margin-top: {top}px; display: flex; align-items: baseline; gap: 12px">'
            f'<div style="{BOD}; font-weight: 600; font-size: 14px; letter-spacing: 0.26em; color: {BURG}; white-space: nowrap">{en}</div>'
            f'<div style="{GAR}; font-style: italic; font-size: 17px; color: {GREY}; white-space: nowrap">{fr}</div>'
            f'<div style="flex: 1; height: 0; border-top: 1px solid {BURG}; transform: translateY(-4px)"></div></div>')


def item(n, d, p, top=10, size=23, desc_right=64, extra=''):
    return (f'<div style="position: relative; margin-top: {top}px">'
            f'<div style="display: flex; align-items: baseline; gap: 8px">'
            f'<h3 style="margin: 0; flex: 0 1 auto; min-width: 0; {BOD}; font-weight: 600; font-size: {size}px; line-height: 1.12; color: {INK}">{n}</h3>'
            f'<div style="flex: 1; min-width: 8px; border-bottom: 1.5px dotted {INK}; transform: translateY(-5px); opacity: 0.75"></div>'
            f'<span style="{BOD}; {NUM}; font-weight: 600; font-size: {size - 2}px; color: {INK}; white-space: nowrap">{p}</span></div>'
            f'<p style="margin: 2px {desc_right}px 0 0; {GAR}; font-size: 17px; line-height: 1.32; color: {GREY}; text-wrap: pretty">{d}</p>{extra}</div>')


def items(lst, size=23, desc_right=64, first=9, gap=11):
    return ''.join(item(*x, top=(first if i == 0 else gap), size=size, desc_right=desc_right) for i, x in enumerate(lst))


def layers(face):
    flood_h = 452 if face == 'front' else 128
    alt = ('Gold foil engraving of The Vandermeer at dusk: a flat roofed limestone hotel with a deep cornice, '
           'a canopy to the curb, a limousine and a checker cab outside') if face == 'front' else 'The Vandermeer'
    under = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.55">'
             f'<img src="assets/flood-{face}.png" alt="{alt}" style="position: absolute; left: 0; top: 0; width: {W}px; height: {flood_h}px; display: block">'
             f'<img src="assets/paper-emboss-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">')
    over = (f'<img src="assets/paper-ink-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">')
    return under, over


def footer(left, right):
    return (f'<div style="margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid {INK}; padding-top: 7px">'
            f'<div style="{GAR}; font-style: italic; font-size: 16px; color: {GREY}; {NUM}">{left}</div>'
            f'<div style="{BOD}; font-weight: 600; font-size: 12px; letter-spacing: 0.2em; color: {BURG}; white-space: nowrap; {NUM}">{right}</div></div>')


def front():
    under, over = layers('front')
    pencil = (f'<div style="position: absolute; left: 300px; top: -14px; transform: rotate(-4deg); {HAND}; font-size: 21px; line-height: 1; color: {PENCIL}; white-space: nowrap">'
              f'For the whole hotel!</div>')
    begin = (item(*BEGIN[0], top=8, desc_right=0, extra=pencil) + items(BEGIN[1:], first=9, gap=9, desc_right=0))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {IVORY}; {GAR}; color: {INK}">'
            f'{under}'
            f'<section style="position: absolute; left: 84px; top: 478px; width: 648px; height: 536px; display: flex; flex-direction: column">'
            f'<div style="{BOD}; font-style: italic; font-weight: 500; font-size: 37px; line-height: 1; font-variation-settings: \'opsz\' 20; color: {BURG}">Room Service</div>'
            f'<div style="margin-top: 7px; font-size: 17px; line-height: 1.3; color: {GREY}">Served at any hour. Dial <b style="font-weight: 600; color: {INK}; {NUM}">30</b> from your suite.</div>'
            f'{head("TO BEGIN", "Hors-d&#8217;&#339;uvre", top=12)}{begin}'
            f'{head("FROM THE GRILL", "Grillades", top=14)}{items(GRILL, first=8, gap=9, desc_right=0)}'
            f'{footer("A $1.50 room service charge per person and a 15% gratuity are added.", "PLEASE TURN OVER")}'
            f'</section>'
            f'<img src="assets/sticker-vote.png" alt="A Vote None of the Above campaign sticker pressed onto the card, one corner lifting" '
            f'style="position: absolute; left: 524px; top: 392px; width: 281px; height: 197px; display: block">'
            f'{over}</div>')


def back():
    under, over = layers('back')
    services = ''.join(
        f'<div style="{"" if i == 0 else "margin-top: 7px"}"><div style="{BOD}; font-weight: 600; font-size: 13px; letter-spacing: 0.2em; color: {BURG}">{t.upper()}</div>'
        f'<p style="margin: 1px 0 0; font-size: 17px; line-height: 1.3; color: {INK}; text-wrap: pretty">{d}</p></div>'
        for i, (t, d) in enumerate(SERVICES))
    note = (f'<div style="position: relative; width: 250px; flex: none; padding-top: 22px">'
            f'<img src="assets/stain-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 44px; top: 0; width: 196px; height: 196px; display: block">'
            f'<div style="position: relative; transform: rotate(-4deg); {HAND}; font-size: 22px; line-height: 1.38; color: {PENCIL}">'
            f'Spike, order anything<br>you want. Put it<br>on the suite.<div style="text-align: right; margin-right: 26px">Monty</div></div></div>')
    bfast = ''.join(f'<div style="width: {bw}px; flex: none">{item(*x, top=8, size=19, desc_right=0)}</div>' for x, bw in zip(BREAKFAST, (200, 190, 242)))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {IVORY}; {GAR}; color: {INK}">'
            f'{under}'
            f'<section style="position: absolute; left: 84px; top: 156px; width: 648px; height: 858px; display: flex; flex-direction: column">'
            f'<div style="display: flex; gap: 24px">'
            f'<div style="width: 312px; flex: none">{head("ALONGSIDE", "Garnitures")}{items(SIDES, size=22, desc_right=0)}'
            f'{head("SWEETS", "Desserts", top=20)}{items(SWEETS, size=22, desc_right=0)}</div>'
            f'<div style="width: 312px; flex: none">{head("THE BAR", "Le bar")}{items(BAR, size=22, desc_right=0)}</div></div>'
            f'{head("BREAKFAST IN THE SUITE", "Le petit d&#233;jeuner", top=22)}'
            f'<div style="display: flex; gap: 8px">{bfast}</div>'
            f'<div style="margin-top: 7px; font-style: italic; font-size: 17px; color: {GREY}">Hang the breakfast card on your door before 3 a.m.</div>'
            f'{head("AT YOUR SERVICE", "Les services", top=20)}'
            f'<div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: flex-start"><div style="width: 360px">{services}</div>{note}</div>'
            f'{footer("Please allow thirty minutes. Trays are collected on request.", "FORM RS-30 4/85")}'
            f'</section>{over}</div>')


for face, fn in (('front', front), ('back', back)):
    b = fn()
    open(os.path.join(D, face + '.body.html'), 'w').write(b + '\n')
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Vandermeer in-suite dining card, {face}</title>{FONT_LINK}'
        f'<style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
