"""Builds the Autumn Moon take-out menu (Ghost Dog: The Way of the Samurai, 1999).
The fold-in-three take-out menu from the Chinese and Japanese take-out in Jersey City whose back
room Vargo's crew uses as a clubhouse. Legal size (8.5 x 14 in), pale green copier stock, printed
two colour (black and red) at a quick-print shop, the way the New Jersey take-out menus of the
1990s were: red key-fret panel frames, stacked Chinese characters, line-cut clip art, numbered
dishes with dot leaders, pint and quart columns, stars for hot dishes, a free-with-purchase table,
a coupon and an order form. Someone has been at it with a ballpoint.
Writes outside.html / inside.html (full pages), *.body.html, film.json and rooftop.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 1344, 816
PAPER = '#cfe3d6'
INK = '#1f1e1b'
RED = '#b5281f'
BALL = '#26418c'
FONTS = ('family=Tinos:ital,wght@0,400;0,700;1,400;1,700'
         '&family=Noto+Serif+TC:wght@900'
         '&family=Kaushan+Script'
         '&family=Reenie+Beanie')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
SERIF = "'Tinos', 'Times New Roman', serif"
ZH = "'Noto Serif TC', serif"
BRUSH = "'Kaushan Script', cursive"
PEN = "'Reenie Beanie', cursive"
DOTS = ' .' * 90


def esc(s): return s.replace('&', '&amp;')


def overlays(face):
    gw = FW; gh = round(FW * 1588 / 2246)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: {(FH - gh) // 2}px; width: {gw}px; height: {gh}px; opacity: 0.55; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {SERIF}; color: {INK}">{inner}{overlays(face)}</div>')


def panel(i, inner, pad_top=48):
    x = i * 448
    return (f'<img src="assets/art-frame.png" alt="" aria-hidden="true" style="position: absolute; left: {x + 22}px; top: 26px; width: 404px; height: 764px; display: block">'
            f'<div style="position: absolute; left: {x + 44}px; top: {pad_top}px; width: 360px; height: {770 - pad_top}px">{inner}</div>')


def head(en, zh, sub=None, top=0, size=25):
    s = f'<div style="margin-top: 3px; font-style: italic; font-size: 16px; line-height: 1.25; text-align: center">{esc(sub)}</div>' if sub else ''
    return (f'<div style="margin-top: {top}px; text-align: center">'
            f'<div style="display: flex; justify-content: center; align-items: baseline; gap: 9px; white-space: nowrap; color: {RED}">'
            f'<span style="font-family: {ZH}; font-weight: 900; font-size: {size - 3}px; line-height: 1">{zh}</span>'
            f'<span style="font-weight: 700; font-size: {size}px; line-height: 1; letter-spacing: 0.03em">{esc(en)}</span></div>'
            f'<div style="margin: 5px auto 0; width: 220px; height: 3px; border-top: 1px solid {RED}; border-bottom: 1px solid {RED}"></div>{s}</div>')


def star():
    return '<img src="assets/art-star.png" alt="hot" style="display: inline-block; width: 15px; height: 15px; margin-left: 6px; vertical-align: 0px">'


def row(num, name, price, desc=None, note=None, hot=False, top=6, nsize=18, prices=None):
    """One numbered dish with dot leaders. prices: tuple for pint and quart columns."""
    if prices:
        pc = ''.join(f'<span style="flex: none; width: 50px; text-align: right; font-weight: 700; font-size: 17px">{p}</span>' for p in prices)
    else:
        pc = f'<span style="flex: none; font-weight: 700; font-size: 17px">{price}</span>'
    d = f'<div style="margin: 2px 0 0 34px; font-style: italic; font-size: 16px; line-height: 1.26; text-wrap: pretty">{esc(desc)}</div>' if desc else ''
    n = f'<div style="margin: 3px 0 0 34px; font-style: italic; font-weight: 700; font-size: 16px; line-height: 1.2; color: {RED}">{esc(note)}</div>' if note else ''
    return (f'<div style="margin-top: {top}px"><div style="display: flex; align-items: baseline; gap: 4px">'
            f'<span style="flex: none; width: 30px; font-size: 16px">{num}</span>'
            f'<span style="flex: none; font-weight: 700; font-size: {nsize}px; line-height: 1.15">{esc(name)}{star() if hot else ""}</span>'
            f'<span style="flex: 1; min-width: 14px; overflow: hidden; white-space: nowrap; font-size: 15px; letter-spacing: 0.06em">{DOTS}</span>'
            f'{pc}</div>{d}{n}</div>')


def colhead(labels):
    return (f'<div style="display: flex; justify-content: flex-end; margin-top: 6px; font-weight: 700; font-size: 15px; color: {RED}">'
            + ''.join(f'<span style="width: 50px; text-align: right">{l}</span>' for l in labels) + '</div>')


# ======================= OUTSIDE =======================
# A: flap (left), luncheon specials
flap = (
    head('LUNCHEON SPECIALS', '午餐特價', 'Mon. to Sat., 11:30 A.M. to 3:00 P.M.', size=22)
    + f'<div style="margin-top: 8px; padding: 6px 8px; border: 1.5px solid {INK}; font-size: 16px; line-height: 1.28; text-align: center; text-wrap: balance">'
      'Served with Pork Fried Rice or White Rice, plus an Egg Roll or Wonton Soup</div>'
    + row('L 1.', 'Chicken Teriyaki', '5.25', top=12)
    + row('L 2.', "General Tso's Chicken", '4.95', hot=True, top=9)
    + row('L 3.', 'Sesame Chicken', '4.95', top=9)
    + row('L 4.', 'Chicken with Garlic Sauce', '4.95', hot=True, top=9)
    + row('L 5.', 'Beef with Broccoli', '4.95', top=9)
    + row('L 6.', 'Shrimp with Lobster Sauce', '5.25', top=9)
    + row('L 7.', 'Chicken Lo Mein', '4.50', top=9)
    + row('L 8.', 'Mixed Chinese Vegetables', '4.25', top=9)
    + row('L 9.', 'Beef Teriyaki', '5.75', top=9)
    + row('L10.', 'Pork Lo Mein', '4.50', top=9)
    + row('L11.', 'Sweet & Sour Chicken', '4.95', top=9)
    + f'<div style="margin-top: 16px; border: 2px solid {RED}; display: flex">'
      f'<div style="flex: none; width: 92px; background: {RED}; color: {PAPER}; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-weight: 700; font-size: 18px; line-height: 1.12; padding: 6px 4px">FREE<br>WITH<br>ORDERS<br>OVER</div>'
      f'<div style="flex: 1; padding: 6px 10px; font-size: 16px; line-height: 1.5">'
      + ''.join(f'<div style="display: flex; gap: 10px"><span style="flex: none; width: 58px; font-weight: 700">${a}</span><span>{b}</span></div>'
                for a, b in (('15.00', '2 Egg Rolls'), ('25.00', 'Qt. Wonton Soup'), ('35.00', 'Edamame and a Can Soda'), ('45.00', 'Fried Dumplings (8)')))
    + '</div></div>'
    + f'<div style="position: absolute; left: 0; bottom: 4px; width: 360px; display: flex; justify-content: space-between; align-items: center">'
      f'<div style="font-size: 16px; line-height: 1.3"><img src="assets/art-star.png" alt="" style="display: inline-block; width: 15px; height: 15px; vertical-align: 0px"> Hot and Spicy.<br>Any dish made mild on request.</div>'
      f'<div style="flex: none; width: 74px; height: 74px; border-radius: 50%; border: 2px solid {INK}; display: flex; align-items: center; justify-content: center; text-align: center; font-weight: 700; font-size: 16px; line-height: 1.05; transform: rotate(-8deg)">TAX<br>INCL.</div></div>'
)

# B: back cover, delivery, catering, coupon, order form
back = (
    f'<div style="background: {RED}; color: {PAPER}; text-align: center; padding: 8px 6px 7px">'
    f'<div style="font-weight: 700; font-size: 30px; line-height: 1; letter-spacing: 0.04em">FAST FREE DELIVERY</div>'
    f'<div style="margin-top: 4px; font-style: italic; font-size: 16px">Minimum order $10.00. Limited area.</div></div>'
    f'<div style="display: flex; align-items: flex-start; gap: 6px; margin-top: 10px">'
    f'<div style="flex: 1; font-size: 16px; line-height: 1.3"><b style="font-size: 19px">Party Orders</b><br>Trays for the office, the shop or the club.<br>'
    f'<b style="color: {RED}">Private room in back.</b><br>Ask at the counter.</div>'
    f'<img src="assets/art-bowl.png" alt="Rice bowl with chopsticks" style="flex: none; width: 170px; height: 129px; display: block; margin-top: 4px"></div>'
    f'<div style="position: relative; margin-top: 14px; border: 2px dashed {INK}; padding: 10px 12px 9px; text-align: center">'
    f'<div style="font-size: 16px; font-weight: 700; letter-spacing: 0.1em; color: {RED}">COUPON</div>'
    f'<div style="font-weight: 700; font-size: 34px; line-height: 1.05">$1.00 OFF</div>'
    f'<div style="font-size: 16px; line-height: 1.28">any order of $12.00 or more.<br>One coupon per order. Not valid on lunch specials.</div>'
    f'<div style="margin-top: 4px; font-style: italic; font-weight: 700; font-size: 16px; color: {RED}">Expires the first day of autumn.</div></div>'
    f'<div style="margin-top: 14px; font-weight: 700; font-size: 16px; letter-spacing: 0.08em">PHONE ORDER</div>'
    + ''.join(f'<div style="display: flex; align-items: flex-end; gap: 6px; margin-top: 9px; font-size: 16px"><span style="flex: none; font-weight: 700">{l}</span><span style="flex: 1; border-bottom: 1px solid {INK}; height: 16px"></span></div>'
              for l in ('NAME', 'TEL.', 'ADD.'))
    + f'<div style="display: flex; gap: 14px"><div style="flex: 1; display: flex; align-items: flex-end; gap: 6px; margin-top: 9px; font-size: 16px"><span style="font-weight: 700">TIME</span><span style="flex: 1; border-bottom: 1px solid {INK}; height: 16px"></span></div>'
      f'<div style="flex: 1; display: flex; align-items: flex-end; gap: 6px; margin-top: 9px; font-size: 16px"><span style="font-weight: 700">TOTAL $</span><span style="flex: 1; border-bottom: 1px solid {INK}; height: 16px"></span></div></div>'
    + f'<div style="margin-top: 16px; display: flex; gap: 10px; font-size: 16px; line-height: 1.28"><div style="flex: 1"><b>Delivery</b><br>5:00 P.M. to closing.<br>Allow 30 to 45 minutes.</div><div style="flex: 1"><b>Sorry,</b><br>no checks. Exact<br>change appreciated.</div></div>'
    + f'<div style="position: absolute; left: 0; bottom: 0; width: 360px; text-align: center; font-size: 12px; line-height: 1.3">Prices subject to change without notice.<br>Printed by Lucky Print Shop, Jersey City</div>'
)
# ballpoint in the margin of the back cover, next to the private room line, and a fortune slip
pen = (f'<div style="position: absolute; left: 624px; top: 247px; transform: rotate(-7deg); font-family: {PEN}; font-size: 27px; line-height: 1; white-space: nowrap; color: {BALL}">rent due!!</div>'
       f'<div style="position: absolute; left: 485px; top: 206px; width: 160px; height: 28px; border: 2px solid {BALL}; border-radius: 50%; transform: rotate(-3deg); opacity: 0.85"></div>')
fortune = (f'<div style="position: absolute; left: 520px; top: 652px; width: 300px; padding: 6px 10px 5px; box-sizing: border-box; background: #f7f5ee; transform: rotate(-3.5deg); box-shadow: 1px 2px 3px rgba(40,50,40,0.28); text-align: center; color: {RED}">'
           f'<div style="font-size: 15px; line-height: 1.2">A good retainer serves one master.</div>'
           f'<div style="margin-top: 2px; font-size: 12px; letter-spacing: 0.06em">LUCKY NUMBERS 8 12 23 31 38 44</div></div>')

# C: front cover
cover = (
    f'<div style="text-align: center; font-family: {BRUSH}; font-size: 25px; line-height: 1.1; color: {RED}">Chinese &amp; Japanese Restaurant</div>'
    f'<div style="margin-top: 4px; text-align: center; font-weight: 700; font-size: 68px; line-height: 0.92; letter-spacing: 0.03em; color: {RED}">AUTUMN<br>MOON</div>'
    f'<div style="display: flex; justify-content: center; align-items: center; gap: 14px; margin-top: 16px">'
    f'<img src="assets/art-moon.png" alt="The moon with three pigeons flying across it" style="flex: none; width: 252px; height: 252px; display: block">'
    f'<div style="font-family: {ZH}; font-weight: 900; font-size: 58px; line-height: 1.12; text-align: center">秋<br>月<br>樓</div></div>'
    f'<div style="display: flex; justify-content: space-between; align-items: center; margin-top: 16px">'
    f'<div style="font-weight: 700; font-size: 23px; line-height: 1.1">Eat In or<br>Take Out</div>'
    f'<div style="border: 2.5px solid {INK}; padding: 5px 10px 4px; font-weight: 700; font-size: 22px; letter-spacing: 0.04em">No M.S.G.</div>'
    f'<div style="font-weight: 700; font-size: 20px; line-height: 1.1; text-align: right; color: {RED}">FREE<br>DELIVERY</div></div>'
    f'<div style="margin-top: 14px; border-top: 1px solid {RED}; border-bottom: 1px solid {RED}; padding: 6px 0 5px; text-align: center; font-size: 16px; line-height: 1.3">'
    f'<b>Open 7 Days a Week</b><br>Mon. to Thurs. 11:30 A.M. to 10:30 P.M.<br>Fri. and Sat. 11:30 A.M. to 11:30 P.M.<br>Sun. 12 Noon to 10:00 P.M.</div>'
    f'<div style="margin-top: 12px; text-align: center; font-weight: 700; font-size: 30px; line-height: 1.05">Tel.: (201) 555-0188</div>'
    f'<div style="text-align: center; font-weight: 700; font-size: 22px; line-height: 1.15">555-0189</div>'
    f'<div style="margin-top: 10px; display: flex; justify-content: space-between; font-size: 16px"><span>Jersey City, N.J. 07302</span><span style="font-style: italic; color: {RED}">Est. 1991</span></div>'
)

outside = panel(0, flap) + panel(1, back) + panel(2, cover) + pen + fortune

# ======================= INSIDE =======================
p1 = (
    head('APPETIZERS', '小食')
    + row('1.', 'Egg Roll (1)', '1.10', top=10)
    + row('2.', 'Soy & Honey Roasted Nuts', '2.25', 'Cashews, almonds, peanuts and pumpkin seeds glazed with sesame, oven crisp, served cool in a paper cup.', 'Roasted fresh every afternoon.', top=9)
    + row('3.', 'Edamame', '2.95', 'Young green soybeans boiled in the pod, sea salt and a few drops of sesame oil.', 'We bring a bowl for the pods.', top=9)
    + row('4.', 'Fried Dumplings (8)', '4.25', 'Pork and cabbage, pan fried, ginger soy dip.', top=9)
    + row('5.', 'Spare Ribs (4)', '5.25', 'Barbecued, glazed red.', top=9)
    + head('SOUP', '湯類', 'With crispy noodles', top=18)
    + colhead(('Pt.', 'Qt.'))
    + row('6.', 'Wonton Soup', None, prices=('1.50', '2.75'), top=2)
    + row('7.', 'Egg Drop Soup', None, prices=('1.25', '2.25'))
    + row('8.', 'Hot & Sour Soup', None, hot=True, prices=('1.75', '3.25'))
    + row('9.', 'Chicken Corn Soup', None, prices=('1.75', '3.25'))
    + f'<div style="margin-top: 16px; border: 2px solid {RED}; padding: 8px 12px 9px">'
      f'<div style="display: flex; justify-content: space-between; align-items: baseline; color: {RED}"><span style="font-weight: 700; font-size: 21px; letter-spacing: 0.03em">DINNER FOR TWO</span><span style="font-weight: 700; font-size: 19px">18.95</span></div>'
      f'<div style="margin-top: 4px; font-size: 16px; line-height: 1.3">2 Wonton Soups, 2 Egg Rolls, a Chicken Teriyaki Bowl, Beef with Broccoli, Pork Fried Rice and Fortune Cookies.</div></div>'
)
p2 = (
    head('JAPANESE KITCHEN', '日本料理', 'Grilled to order. Please allow 15 minutes.', size=23)
    + f'<div style="position: relative; margin-top: 10px; border: 2px solid {RED}; padding: 4px 10px 10px">'
    + f'<div style="font-weight: 700; font-size: 15px; letter-spacing: 0.12em; color: {RED}; text-align: center; margin-bottom: 2px">CHEF\'S SPECIAL</div>'
    + row('10.', 'Chicken Teriyaki Bowl', '7.25', 'Boneless thigh seared crisp on the skin side, glazed with soy, mirin, sake and sugar, sliced over steamed short grain rice with pink pickled ginger and scallion.', 'Our number one seller.', top=0, nsize=21)
    + '</div>'
    + row('11.', 'Beef Teriyaki', '8.50', 'Sliced sirloin, same glaze, white rice.', top=9)
    + head("CHEF'S SPECIALTIES", '招牌菜', 'Served with white rice', top=16)
    + row('12.', "General Tso's Chicken", '7.95', 'Chunks fried crisp in a hot, sweet and tangy sauce with dried chilies.', hot=True, top=8)
    + row('13.', 'Sesame Chicken', '7.95', 'Fried crisp, honey glaze, toasted seeds.', top=7)
    + row('14.', 'Beef with Broccoli', '7.75', 'Flank steak in brown sauce.', top=7)
    + row('15.', 'Shrimp with Lobster Sauce', '8.50', 'Egg-white garlic sauce, black beans.', top=7)
    + row('15A.', 'Chicken with Garlic Sauce', '7.75', 'Water chestnuts, wood ears, hot garlic sauce.', hot=True, top=7)
    + row('15B.', 'Mixed Chinese Vegetables', '6.95', 'Bok choy, snow peas, broccoli, light white sauce.', top=7)
)
p3 = (
    head('FRIED RICE & LO MEIN', '炒飯撈麵', size=20)
    + colhead(('Pt.', 'Qt.'))
    + row('16.', 'Pork Fried Rice', None, prices=('2.95', '4.75'), top=2)
    + row('17.', 'Shrimp Fried Rice', None, prices=('3.50', '5.50'))
    + row('18.', 'Chicken Lo Mein', None, prices=('3.50', '5.50'))
    + row('19.', 'Vegetable Lo Mein', None, prices=('3.25', '5.25'))
    + head('DESSERT', '甜品', top=15)
    + row('20.', 'Toasted Coconut Ice Cream', '1.95', 'Churned in our kitchen, rich and smooth, with golden flakes stirred through and more on top.', 'Made here. One flavor only.', top=9)
    + row('21.', 'Almond Cookies (3)', '.75', top=7)
    + row('22.', 'Fortune Cookies', 'free', 'In every bag.', top=6)
    + head('BEVERAGES', '飲品', top=15)
    + row('23.', 'Iced Matcha Lemonade', '1.75', 'Fresh squeezed, sweetened with honey, poured over ice with frothy whisked green tea floated on top. Sprig of mint.', 'Made to order. Stir before drinking.', top=9)
    + row('24.', 'Hot Jasmine Tea (pot)', '.75', top=7)
    + row('25.', 'Can Soda', '.85', top=6)
    + row('26.', '2 Liter Soda', '2.25', top=6)
    + f'<div style="position: absolute; left: 0; bottom: 0; width: 360px; border-top: 1px solid {RED}; padding-top: 6px; text-align: center; font-size: 16px; line-height: 1.28">'
      f'<b>Please order by number.</b> Brown rice add .50.<br>We cook with 100% vegetable oil.</div>'
)
# ballpoint: someone circled No. 10 and wrote x2
pen_in = (f'<div style="position: absolute; left: 486px; top: 137px; width: 44px; height: 34px; border: 2px solid {BALL}; border-radius: 50%; transform: rotate(-6deg); opacity: 0.85"></div>'
          f'<div style="position: absolute; left: 702px; top: 243px; transform: rotate(-8deg); font-family: {PEN}; font-size: 28px; line-height: 1; color: {BALL}">x2</div>')

inside = panel(0, p1) + panel(1, p2) + panel(2, p3) + pen_in

TITLES = {'outside': 'Autumn Moon take-out menu, outside', 'inside': 'Autumn Moon take-out menu, inside'}
for face, inner in (('outside', outside), ('inside', inside)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "rooftop", "fn": "fmtRooftop", "faces": ["outside.html", "inside.html"], "names": ["Outside", "Inside"],
        "mm": [355.6, 215.9], "fonts": FONTS, "fams": ["Tinos", "Noto Serif TC", "Kaushan Script", "Reenie Beanie"],
        "phone": {"disp": "'Tinos',serif", "title": "'Tinos',serif", "name": "'Tinos',serif",
                  "body": "'Tinos',serif", "price": "'Tinos',serif", "note": "'Tinos',serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Ghost Dog: The Way of the Samurai (1999)": {
    "Rooftop mixed nuts": {"n": "Soy & Honey Roasted Nuts", "d": "Cashews, almonds, peanuts and pumpkin seeds glazed with sesame, oven crisp, served cool in a paper cup.", "note": "Roasted fresh every afternoon."},
    "Edamame": {"n": "Edamame", "d": "Young green soybeans boiled in the pod, sea salt and a few drops of sesame oil.", "note": "We bring a bowl for the pods."},
    "Teriyaki rice bowl": {"n": "Chicken Teriyaki Bowl", "d": "Boneless thigh seared crisp on the skin side, glazed with soy, mirin, sake and sugar, sliced over steamed short grain rice with pink pickled ginger and scallion.", "note": "Chef's special. Our number one seller."},
    "Coconut ice cream": {"n": "Toasted Coconut Ice Cream", "d": "Churned in our kitchen, rich and smooth, with golden flakes stirred through and more on top.", "note": "Made here. One flavor only."},
    "Rooftop iced matcha honey lemonade": {"n": "Iced Matcha Lemonade", "d": "Fresh squeezed, sweetened with honey, poured over ice with frothy whisked green tea floated on top. Sprig of mint.", "note": "Made to order. Stir before drinking."}
}}
open(os.path.join(D, 'rooftop.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
