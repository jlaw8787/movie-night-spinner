"""Builds the Corner Food Market weekly circular (Leon: The Professional, 1994).
The neighbourhood grocer's two-sided sale flyer that sits in a stack by the register, the store
Mathilda runs to for groceries and Leon's milk. US Letter, groundwood newsprint, printed web-offset
in two inks, black and one spot green, with halftone clip art and a little misregistration.
Front: dairy case (milk), lunch counter, bakery case, houseplants. Back: deli counter, a paid ad
from Tony's restaurant, clip coupons. One sheet, no fold.
Writes front.html / back.html, front.body.html / back.body.html, film.json and leon.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
PAPER = '#ebe5d2'
INK = '#1d1c1a'
SOFT = '#3d3a34'
GREEN = '#1e7a46'
TINT = '#cfe0cf'      # 20% screen of the green, printed as a flat tint
WHITE = '#f6f2e6'
FONTS = ('family=Anton'
         '&family=Archivo+Narrow:ital,wght@0,500;0,700;1,500;1,700'
         '&family=Archivo:wght@400;600;800'
         '&family=DM+Serif+Display:ital@0;1')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Anton', 'Impact', sans-serif"
NAME = "'Archivo Narrow', 'Arial Narrow', sans-serif"
BODY = "'Archivo', 'Helvetica Neue', Arial, sans-serif"
SERIF = "'DM Serif Display', Georgia, serif"


def esc(s):
    return s.replace('&', '&amp;')


def at(x, y, w, extra=''):
    return f'position: absolute; left: {x}px; top: {y}px; width: {w}px; {extra}'


def img(src, x, y, w, h, alt=''):
    a = f'alt="{alt}"' if alt else 'alt="" aria-hidden="true"'
    return f'<img src="assets/{src}" {a} style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; display: block">'


def price(d, c, unit='', size=64, col=INK, align='right'):
    """Circular price: big figures, cents raised, unit tucked under the cents."""
    if d:
        big = f'<span style="font-size: {size * .42:.0f}px; line-height: 1; vertical-align: top; position: relative; top: {size * .08:.0f}px">$</span>{d}'
        small = c
    else:
        big = c
        small = '&cent;'
    u = (f'<div style="font-family: {NAME}; font-weight: 700; font-size: {max(13, size * .2):.0f}px; line-height: 1; '
         f'letter-spacing: .04em; text-transform: uppercase; margin-top: {size * .06:.0f}px">{unit}</div>') if unit else ''
    return (f'<div style="display: inline-flex; align-items: flex-start; font-family: {DISP}; color: {col}; line-height: .9; '
            f'justify-content: {"flex-end" if align == "right" else "flex-start"}">'
            f'<span style="font-size: {size}px; line-height: .9">{big}</span>'
            f'<div style="margin-left: 2px; padding-top: {size * .05:.0f}px"><div style="font-size: {size * .46:.0f}px; line-height: .9; '
            f'border-bottom: {max(2, size * .04):.0f}px solid {col}; padding-bottom: 2px">{small}</div>{u}</div></div>')


def tag(text, bg=INK, col=WHITE, size=17):
    return (f'<div style="display: inline-block; background: {bg}; color: {col}; font-family: {DISP}; font-size: {size}px; '
            f'line-height: 1; letter-spacing: .08em; padding: 5px 9px 4px">{text}</div>')


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; '
            f'width: {gw}px; height: {FH}px; opacity: .55; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; '
            f'height: {FH}px; pointer-events: none; display: block">')


def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {BODY}; color: {INK}">{inner}{overlays(face)}</div>')


def box(x, y, w, h, border=2, extra=''):
    return f'<div style="{at(x, y, w, f"height: {h}px; box-sizing: border-box; border: {border}px solid {INK}; {extra}")}"></div>'


def tintbox(x, y, w, h, col=TINT, mis=(2, 1)):
    """A flat tint laid down by the green plate, a hair off register from the black rules."""
    return f'<div style="{at(x + mis[0], y + mis[1], w, f"height: {h}px; background: {col}")}"></div>'


DESC = f'font-family: {BODY}; font-size: 16px; line-height: 1.3; color: {SOFT}; text-wrap: pretty'
NOTE = f'font-family: {NAME}; font-style: italic; font-weight: 700; font-size: 18px; line-height: 1.15; color: {GREEN}'
NM = f'font-family: {NAME}; font-weight: 700; text-transform: uppercase; letter-spacing: .01em; line-height: 1; color: {INK}'

# ============================== FRONT ==============================
MILK_D = 'Grade A, homogenized, vitamin D added. In cold every morning before we open.'


def dairy_row(name, sub, p, top, last=False):
    rule = '' if last else f'border-bottom: 1.5px solid {INK};'
    return (f'<div style="{at(0, top, 234, f"height: {102 if last else 92}px; box-sizing: border-box; {rule} display: flex; justify-content: space-between; align-items: center; gap: 8px")}">'
            f'<div style="min-width: 0"><div style="{NM}; font-size: 25px">{name}</div>'
            f'<div style="{DESC}; font-size: 16px; margin-top: 4px">{sub}</div></div>'
            f'<div style="flex: none">{p}</div></div>')


def counter_cell(x, w, head, art, aw, ah, name, desc, note, p):
    return f"""
<div style="{at(x, 594, w, 'height: 356px; box-sizing: border-box; border: 2px solid ' + INK)}">
  <div style="background: {INK}; color: {WHITE}; font-family: {DISP}; font-size: 19px; letter-spacing: .1em; line-height: 1; padding: 7px 10px 6px">{head}</div>
  <div style="padding: 10px 11px 0">
    <div style="{NM}; font-size: 27px">{name}</div>
    <div style="{DESC}; margin-top: 6px">{desc}</div>
    <div style="{NOTE}; margin-top: 7px">{note}</div>
  </div>
  {img(art, 8, 356 - 4 - ah - 8, aw, ah)}
  <div style="position: absolute; right: 10px; bottom: 10px">{p}</div>
</div>"""


front = f"""
<div style="{at(0, 0, FW, 'height: 198px; background: ' + GREEN)}"></div>
<div style="{at(48, 42, 720, f'display: flex; justify-content: space-between; font-family: {NAME}; font-weight: 700; font-size: 16px; letter-spacing: .16em; color: {WHITE}')}">
  <span>GROCERIES</span><span>DAIRY</span><span>DELI</span><span>LUNCH COUNTER</span><span>BAKERY</span><span>HOUSEPLANTS</span></div>
<div style="{at(44, 62, 730, f'font-family: {DISP}; font-style: italic; font-size: 84px; line-height: 1; letter-spacing: .005em; color: {WHITE}; white-space: nowrap')}">CORNER FOOD MARKET</div>
<div style="{at(48, 162, 720, f'display: flex; justify-content: space-between; font-family: {BODY}; font-weight: 600; font-size: 16px; color: {WHITE}')}">
  <span>Little Italy, New York</span><span>Open 7 days, 7 A.M. to 10 P.M.</span><span>We deliver on the block</span></div>
<div style="{at(0, 200, FW, 'height: 40px; background: ' + INK)}"></div>
<div style="{at(48, 208, 720, f'display: flex; justify-content: space-between; align-items: baseline; color: {WHITE}')}">
  <span style="font-family: {DISP}; font-size: 25px; letter-spacing: .1em; line-height: 1">THIS WEEK'S SPECIALS</span>
  <span style="font-family: {NAME}; font-weight: 700; font-size: 17px; letter-spacing: .06em">PRICES GOOD SUNDAY THRU SATURDAY</span></div>

{tintbox(48, 256, 470, 322, '#e3ecdf')}
{box(48, 256, 470, 322, 2.5)}
<div style="{at(60, 268, 200)}">{tag('DAIRY CASE', GREEN)}</div>
{img('carton.png', 58, 296, 206, 272, 'Quart carton of whole milk')}
<div style="{at(74, 430, 102, f'text-align: center; color: {GREEN}')}">
  <div style="font-family: {NAME}; font-weight: 700; font-size: 13px; letter-spacing: .12em; color: {INK}">GRADE A</div>
  <div style="font-family: {DISP}; font-size: 43px; line-height: 1; letter-spacing: .03em">MILK</div>
  <div style="font-family: {NAME}; font-weight: 700; font-size: 13px; line-height: 1.15; letter-spacing: .06em; color: {INK}">VITAMIN D<br>ONE QUART</div></div>
<div style="{at(278, 270, 228)}">
  <div style="font-family: {DISP}; font-size: 47px; line-height: 1; letter-spacing: .01em; white-space: nowrap">WHOLE MILK</div>
  <div style="{DESC}; margin-top: 8px">{MILK_D}</div>
  <div style="{NOTE}; font-size: 21px; margin-top: 8px">Two quarts, every day.</div>
</div>
{img('burst.png', 280, 432, 142, 142)}
<div style="{at(280, 463, 142, 'display: flex; justify-content: center')}">{price('', '79', 'quart', 62, WHITE)}</div>
<div style="{at(428, 498, 80, f'font-family: {NAME}; font-weight: 700; font-size: 15px; line-height: 1.15; color: {INK}')}">Limit four<br>with a $5<br>purchase</div>

<div style="{at(534, 256, 234)}">
  <div style="font-family: {DISP}; font-size: 25px; line-height: 1; letter-spacing: .06em; border-bottom: 3px solid {INK}; padding-bottom: 6px">FROM THE COOLER</div></div>
<div style="{at(534, 292, 234, 'height: 286px')}">
  <div style="position: relative; height: 286px">
    {dairy_row('Large eggs', 'Grade A, the dozen.', price('', '99', 'doz', 46), 0)}
    {dairy_row('Sweet butter', 'Unsalted, the pound.', price('1', '89', 'lb', 46), 92)}
    {dairy_row('Fresh mozzarella', 'Made in back daily.', price('3', '99', 'lb', 46), 184, True)}
  </div>
</div>

{counter_cell(48, 232, 'LUNCH COUNTER', 'shake.png', 70, 113, 'Thick vanilla shake',
    'Cold whole milk blended with ice cream, malted milk powder and a spoon of honey, poured into a glass frosted in the freezer.',
    'Made to order.', price('1', '95', 'glass', 46))}
{counter_cell(292, 232, 'BAKERY CASE', 'dirtcup.png', 82, 87, 'Flowerpot dirt cups',
    'Dark chocolate mousse layered with crushed chocolate cookie crumbs in a little terracotta tumbler, a sprig of fresh mint planted on top.',
    'By the register.', price('1', '29', 'each', 46))}
{counter_cell(536, 232, 'HOUSEPLANTS', 'plant.png', 124, 140, 'Chinese evergreen',
    'Six-inch pot. Give it a window every morning and a drink twice a week. Hard to kill.',
    'Always happy. No questions.', price('5', '99', 'pot', 46))}

<div style="{at(48, 962, 720, f'height: 42px; box-sizing: border-box; border-top: 3px solid {INK}; border-bottom: 1.5px solid {INK}; display: flex; align-items: center; justify-content: space-between; font-family: {NAME}; font-weight: 700; font-size: 17px; letter-spacing: .03em')}">
  <span>SEMOLINA BREAD <span style="font-family: {DISP}; font-weight: 400; font-size: 21px; color: {GREEN}">99&cent;</span> loaf</span>
  <span>BANANAS <span style="font-family: {DISP}; font-weight: 400; font-size: 21px; color: {GREEN}">39&cent;</span> lb</span>
  <span>HOT COFFEE <span style="font-family: {DISP}; font-weight: 400; font-size: 21px; color: {GREEN}">50&cent;</span> cup</span>
  <span>PLUM TOMATOES <span style="font-family: {DISP}; font-weight: 400; font-size: 21px; color: {GREEN}">69&cent;</span> lb</span></div>
<div style="{at(48, 1004, 720, f'display: flex; justify-content: space-between; font-family: {BODY}; font-size: 12px; line-height: 1; color: {SOFT}')}">
  <span>We reserve the right to limit quantities. Not responsible for typographical errors.</span><span>Deli and coupons on back</span></div>
"""

# ============================== BACK ==============================
BAG_D = ('Crusty French loaf spread thick with cultured butter, layered with shaved leg ham and sliced cornichons, '
         'pressed and cut in twelve. Dijon mustard on the side.')
OLIVE_D = 'Mixed olives warmed in olive oil with orange peel, thyme and crushed garlic, packed with cornichons and pickled onions.'
TONY_D = ('San Marzano tomatoes crushed by hand, garlic cooked gently in olive oil, simmered twenty-five minutes, '
          'finished with basil and a knob of butter. Grated parmesan on the side.')

DOTS = ' .' * 60


def lb_row(name, p, last=False):
    rule = '' if last else f'border-bottom: 1px solid {INK};'
    return (f'<div style="display: flex; align-items: baseline; gap: 6px; padding: 9px 0 8px; {rule}">'
            f'<span style="flex: none; {NM}; font-size: 21px">{name}</span>'
            f'<span style="flex: 1; min-width: 16px; overflow: hidden; white-space: nowrap; font-family: {BODY}; font-size: 14px; color: {SOFT}">{DOTS}</span>'
            f'<span style="flex: none; font-family: {DISP}; font-size: 26px; line-height: 1">{p}</span>'
            f'<span style="flex: none; font-family: {NAME}; font-weight: 700; font-size: 14px; width: 18px">LB</span></div>')


def coupon(x, w, big, line1, line2, small):
    return f"""
<div style="{at(x, 906, w, f'height: 88px; box-sizing: border-box; border: 2.5px dashed {INK}; padding: 9px 12px; display: flex; align-items: center; gap: 12px')}">
  <div style="flex: none; font-family: {DISP}; font-size: 46px; line-height: 1; color: {GREEN}">{big}</div>
  <div style="min-width: 0"><div style="{NM}; font-size: 21px">{line1}</div>
    <div style="font-family: {BODY}; font-size: 15px; line-height: 1.2; margin-top: 2px">{line2}</div>
    <div style="font-family: {BODY}; font-size: 12px; line-height: 1.2; margin-top: 3px; color: {SOFT}">{small}</div></div>
</div>"""


back = f"""
<div style="{at(0, 0, FW, 'height: 122px; background: ' + GREEN)}"></div>
<div style="{at(46, 44, 470, f'font-family: {DISP}; font-style: italic; font-size: 64px; line-height: 1; color: {WHITE}; white-space: nowrap')}">DELI COUNTER</div>
<div style="{at(520, 44, 248, f'text-align: right; font-family: {BODY}; font-weight: 600; font-size: 16px; line-height: 1.3; color: {WHITE}')}">Sliced to order while you wait. Party trays on one day's notice.</div>
<div style="{at(0, 124, FW, 'height: 8px; background: ' + INK)}"></div>

{tintbox(48, 150, 720, 276, '#e3ecdf')}
{box(48, 150, 720, 276, 2.5)}
<div style="{at(62, 164, 300)}">{tag('PARTY TRAYS', GREEN)}</div>
{img('baguette.png', 56, 196, 566, 104, 'Baguette sliced on a party tray')}
{img('burst.png', 626, 164, 136, 136)}
<div style="{at(626, 200, 136, 'display: flex; justify-content: center')}">{price('7', '99', 'tray', 56, WHITE)}</div>
<div style="{at(64, 320, 688)}">
  <div style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px">
    <div style="font-family: {DISP}; font-size: 40px; line-height: 1; letter-spacing: .01em">BAGUETTE PARTY TRAY</div>
    <div style="{NOTE}">Twelve pieces. Order a day ahead.</div></div>
  <div style="{DESC}; font-size: 17px; margin-top: 6px">{BAG_D}</div>
</div>

{box(48, 442, 344, 220, 2.5)}
<div style="{at(62, 455, 316)}">
  {tag('FROM THE DELI CASE')}
  <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-top: 10px; gap: 8px">
    <div style="{NM}; font-size: 30px">Antipasto<br>pint</div>{price('3', '49', 'pint', 50)}</div>
  <div style="{DESC}; margin-top: 8px">{OLIVE_D}</div>
  <div style="{NOTE}; margin-top: 6px">We'll warm it while you wait.</div>
</div>
<div style="{at(412, 442, 356)}">
  <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 3px solid {INK}; padding-bottom: 5px">
    <span style="font-family: {DISP}; font-size: 25px; letter-spacing: .06em; line-height: 1">BY THE POUND</span>
    <span style="font-family: {NAME}; font-weight: 700; font-size: 15px; color: {GREEN}">SLICED THIN OR THICK</span></div>
  {lb_row('Boiled ham', '3.99')}
  {lb_row('Genoa salami', '4.49')}
  {lb_row('Sharp provolone', '3.99')}
  {lb_row('Imported prosciutto', '8.99', True)}
</div>

<div style="{at(48, 678, 720, f'height: 214px; box-sizing: border-box; border: 5px double {INK}; background: {WHITE}')}"></div>
{img('spaghetti.png', 62, 724, 206, 124, 'A plate of spaghetti')}
<div style="{at(284, 692, 470)}">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    <span style="font-family: {SERIF}; font-size: 44px; line-height: 1">Tony's</span>
    <span style="font-family: {SERIF}; font-style: italic; font-size: 18px; color: {SOFT}">Restaurant, Little Italy</span></div>
  <div style="display: flex; justify-content: space-between; align-items: flex-end; gap: 10px; margin-top: 6px; border-top: 1px solid {INK}; padding-top: 6px">
    <div style="font-family: {SERIF}; font-size: 25px; line-height: 1.05">Tony's spaghetti, by the quart</div>
    <div style="flex: none">{price('6', '50', 'quart', 42)}</div></div>
  <div style="{DESC}; margin-top: 5px">{TONY_D}</div>
  <div style="font-family: {SERIF}; font-style: italic; font-size: 18px; line-height: 1.2; margin-top: 5px; color: {GREEN}">Ask for Tony. Private room in the back.</div>
</div>

{coupon(48, 352, '20&cent;', 'Off a quart of milk', 'With this coupon.', 'One per family. Good thru Saturday.')}
{coupon(416, 352, 'FREE', 'Cup of hot coffee', 'With any party tray order.', 'One per order. Good thru Saturday.')}
<div style="{at(48, 1004, 720, f'display: flex; justify-content: space-between; font-family: {BODY}; font-size: 12px; line-height: 1; color: {SOFT}')}">
  <span>Clip and bring to the register. No cash value.</span><span>Corner Food Market, Little Italy. Printed in U.S.A. 1994</span></div>
"""

TITLES = {'front': 'Corner Food Market circular, front', 'back': 'Corner Food Market circular, back'}
for face, inner in (('front', front), ('back', back)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "leon", "fn": "fmtLeon", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
        "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Anton", "Archivo Narrow", "Archivo", "DM Serif Display"],
        "phone": {"disp": "'Anton',sans-serif", "title": "'Anton',sans-serif", "name": "'Archivo Narrow',sans-serif",
                  "body": "'Archivo',sans-serif", "price": "'Anton',sans-serif", "note": "'Archivo Narrow',sans-serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Léon: The Professional (1994)": {
    "Jambon-beurre baguette bites": {"n": "Baguette party tray", "d": BAG_D, "note": "Twelve pieces. Order a day ahead."},
    "Olives and cornichons": {"n": "Antipasto pint", "d": OLIVE_D, "note": "We'll warm it while you wait."},
    "Tony's spaghetti": {"n": "Tony's spaghetti, by the quart", "d": TONY_D, "note": "Ask for Tony. Private room in the back."},
    "Potted plant dirt cups": {"n": "Flowerpot dirt cups", "d": "Dark chocolate mousse layered with crushed chocolate cookie crumbs in a little terracotta tumbler, a sprig of fresh mint planted on top.", "note": "From the bakery case, by the register."},
    "Léon's malted vanilla milkshake": {"n": "Thick vanilla shake", "d": "Cold whole milk blended with ice cream, malted milk powder and a spoon of honey, poured into a glass frosted in the freezer.", "note": "Made to order at the lunch counter."},
}}
open(os.path.join(D, 'leon.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
