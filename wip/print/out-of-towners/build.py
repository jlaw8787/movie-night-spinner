"""Builds the Harbor & Hudson Lines dining car card for The Out-of-Towners (1970).

The table card on the Boston to New York shore line train George and Gwen chase by cab after
their flight is diverted to Boston. 8 x 11 in heavy card, printed both sides, no fold, the size
the New Haven road used for its own menus. Printed letterpress in three inks: black, a vermilion
second colour and a gold tint plate under the engraved cut. Front: dining car. Back: lounge car,
timetable and a tear-off meal check.
Writes front.html / back.html (full pages), the .body.html fragments, film.json and labels."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 768, 1056
PAPER = '#f2eadb'
INK = '#1f1a17'
SOFT = '#3d342e'
RED = '#b3392b'
GOLD = '#d6a846'
FONTS = 'family=Libre+Bodoni:ital,wght@0,400;0,600;0,700;1,400;1,700&family=Pathway+Gothic+One'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
GOTH = "'Pathway Gothic One', 'Arial Narrow', sans-serif"
BOD = "'Libre Bodoni', 'Bodoni 72', Georgia, serif"
# letterpress: ink spreads a hair past the letter edge
SQ = 'text-shadow: 0 0 0.75px rgba(31,26,23,0.62), 0.35px 0.25px 0 rgba(31,26,23,0.24)'
SQR = 'text-shadow: 0 0 0.75px rgba(179,57,43,0.6), 0.35px 0.25px 0 rgba(179,57,43,0.22)'
X0, CWID = 52, 664      # text block
COL, GUT = 316, 32


def esc(s): return s.replace('&', '&amp;')


def head(t, sub=None, top=0):
    s = (f'<div style="margin-top: {top}px">'
         f'<div style="font-family: {GOTH}; font-size: 22px; line-height: 1; letter-spacing: 0.09em; color: {RED}; {SQR}">{esc(t.upper())}</div>'
         f'<div style="margin-top: 5px; height: 2px; background: {INK}"></div>'
         f'<div style="margin-top: 2px; height: 0.75px; background: {INK}"></div>')
    if sub:
        s += f'<div style="margin-top: 6px; font-family: {BOD}; font-style: italic; font-size: 15px; line-height: 1.3; color: {SOFT}; {SQ}">{esc(sub)}</div>'
    return s + '</div>'


def strike(n):
    return (f'<img src="assets/pencil-{n}.png" alt="" aria-hidden="true" style="position: absolute; left: -6px; top: 50%; '
            f'width: calc(100% + 12px); height: 18px; margin-top: -9px; display: block; pointer-events: none">')


def item(name, desc, price, top=12, size=21, pencil=0):
    st = strike(pencil) if pencil else ''
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; align-items: baseline; gap: 6px">'
            f'<div style="position: relative; font-family: {BOD}; font-weight: 700; font-size: {size}px; line-height: 1.12; word-spacing: 0.08em; {SQ}">{esc(name)}{st}</div>'
            f'<div style="flex: 1; border-bottom: 1.5px dotted {INK}; opacity: 0.55; transform: translateY(-4px); min-width: 12px"></div>'
            f'<div style="font-family: {BOD}; font-weight: 600; font-size: 18px; line-height: 1.1; white-space: nowrap; {SQ}">{price}</div></div>'
            f'<div style="margin-top: 3px; font-family: {BOD}; font-size: 16px; line-height: 1.28; color: {SOFT}; text-wrap: pretty; {SQ}">{esc(desc)}</div></div>')


def line(name, price, top=6, pencil=0, size=17, italic_tail=None):
    st = strike(pencil) if pencil else ''
    tail = f' <span style="font-style: italic; font-weight: 400; font-size: 15px">{esc(italic_tail)}</span>' if italic_tail else ''
    return (f'<div style="margin-top: {top}px; display: flex; align-items: baseline; gap: 6px">'
            f'<div style="position: relative; font-family: {BOD}; font-size: {size}px; line-height: 1.2; {SQ}">{esc(name)}{tail}{st}</div>'
            f'<div style="flex: 1; border-bottom: 1.5px dotted {INK}; opacity: 0.5; transform: translateY(-4px); min-width: 12px"></div>'
            f'<div style="font-family: {BOD}; font-weight: 600; font-size: {size}px; line-height: 1.2; white-space: nowrap; {SQ}">{price}</div></div>')


def combo(no, text, price, top=10, pencil=0):
    st = strike(pencil) if pencil else ''
    return (f'<div style="margin-top: {top}px; display: flex; gap: 10px; align-items: baseline">'
            f'<div style="flex: none; width: 40px; font-family: {GOTH}; font-size: 19px; line-height: 1; color: {RED}; letter-spacing: 0.04em; {SQR}">No. {no}</div>'
            f'<div style="flex: 1; position: relative; font-family: {BOD}; font-size: 16px; line-height: 1.3; {SQ}">{esc(text)}{st}</div>'
            f'<div style="flex: none; font-family: {BOD}; font-weight: 600; font-size: 18px; line-height: 1.1; {SQ}">{price}</div></div>')


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/wear-ink-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.7; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def border():
    # printed rule border: heavy black outer, fine inner, with the red plate's rule a hair out of register
    return (f'<div style="position: absolute; left: 22px; top: 22px; width: {FW - 44}px; height: {FH - 44}px; border: 2.5px solid {INK}; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 29px; top: 29px; width: {FW - 58}px; height: {FH - 58}px; border: 0.75px solid {INK}; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 34px; top: 35px; width: {FW - 68}px; height: {FH - 69}px; border: 1px solid {RED}; opacity: 0.85; box-sizing: border-box"></div>')


def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {BOD}; color: {INK}">{border()}{inner}{overlays(face)}</div>')


def masthead(title, right_html):
    return (f'<div style="position: absolute; left: {X0}px; top: 52px; width: {CWID}px; display: flex; justify-content: space-between; align-items: flex-end">'
            f'<div><div style="font-family: {GOTH}; font-size: 20px; line-height: 1; letter-spacing: 0.22em; color: {RED}; {SQR}">HARBOR &amp; HUDSON LINES</div>'
            f'<div style="margin-top: 4px; font-family: {BOD}; font-weight: 700; font-style: italic; font-size: 64px; line-height: 1; letter-spacing: -0.01em; {SQ}">{title}</div></div>'
            f'<div style="text-align: right; font-family: {GOTH}; font-size: 17px; line-height: 1.3; letter-spacing: 0.08em; padding-bottom: 6px; {SQ}">{right_html}</div></div>'
            f'<div style="position: absolute; left: {X0}px; top: 140px; width: {CWID}px; height: 2px; background: {INK}"></div>')


# ---------------- FRONT: the dining car ----------------
front_left = ''.join([
    head('Table d\u2019hote breakfast', 'Complete, with coffee, tea or milk.'),
    combo(1, 'Chilled orange juice, two eggs any style, buttered toast', '1.35', 10),
    combo(2, 'Half grapefruit, griddle cakes, maple syrup, country sausage', '1.65', 8),
    combo(3, 'Tomato juice, codfish cakes, baked beans, corn muffin', '1.85', 8),
    head('From the broiler, at all hours', None, 14),
    item('Rib Eye Steak Breakfast', 'Seared to your order and rested, with two eggs fried, crisp hash brown potatoes and buttered toast.', '5.25', 10, 22),
    head('Sandwich board', None, 14),
    line('Baked Virginia ham on rye', '.95', 8),
    line('Chicken salad on white', '1.10', 5),
    line('Club sandwich, three decker', '1.75', 5, pencil=3),
    line('Grilled American cheese', '.80', 5),
])
front_right = ''.join([
    head('Complete dinners', 'With chowder or juice, potato, vegetable, rolls, dessert and coffee.'),
    line('Broiled Boston scrod', '3.75', 8, pencil=1),
    line('Roast young turkey, sage dressing', '3.95', 5, pencil=2),
    line('Yankee pot roast, brown gravy', '4.25', 5),
    line('Junior plate, under twelve', '1.10', 5),
    f'<div style="margin-top: 3px; font-family: {BOD}; font-style: italic; font-size: 15px; line-height: 1.3; color: {SOFT}; {SQ}">Beef patty, whipped potatoes, peas and milk.</div>',
    head('From the pantry', None, 14),
    item('New York Cheese Cake', 'Baked slowly in a water bath on a crumb crust, chilled overnight, under sliced fresh strawberries.', '.85', 10),
    item('Raspberry Jam Fingers', 'Butter shortbread baked pale and crisp, sandwiched in pairs, dusted with powdered sugar.', '.60', 10),
    line('Apple pie', '.45', 10, pencil=2, italic_tail='with Cheddar .60'),
    line('Indian pudding, vanilla ice cream', '.50', 5),
])
front_foot = (f'<div style="position: absolute; left: {X0}px; top: 972px; width: {CWID}px; border-top: 0.75px solid {INK}; padding-top: 8px; display: flex; justify-content: space-between; align-items: baseline; gap: 20px">'
              f'<div style="font-family: {BOD}; font-size: 15px; line-height: 1.3; {SQ}"><b>Seating is by call.</b> Please wait in your coach until the steward calls you.</div>'
              f'<div style="flex: none; font-family: {GOTH}; font-size: 14px; letter-spacing: 0.1em; {SQ}">FORM DC-70</div></div>')

front = f'''
{masthead("Dining Car", "THE HARBOR LIGHT<br>BOSTON &middot; PROVIDENCE<br>NEW HAVEN &middot; NEW YORK")}
<img src="assets/engraving.png" alt="" style="position: absolute; left: {X0 - 4}px; top: 158px; width: 672px; height: 262px; display: block">
<div style="position: absolute; left: {X0}px; top: 426px; width: {CWID}px; display: flex; justify-content: space-between; align-items: baseline">
  <div style="font-family: {BOD}; font-style: italic; font-size: 15px; {SQ}">The Harbor Light on the shore line, east of New Haven.</div>
  <div style="font-family: {GOTH}; font-size: 15px; letter-spacing: 0.12em; color: {RED}; {SQR}">FOG AT THE AIRPORTS? TAKE THE TRAIN.</div>
</div>
<div style="position: absolute; left: {X0}px; top: 460px; width: {COL}px">{front_left}</div>
<div style="position: absolute; left: {X0 + COL + GUT}px; top: 460px; width: {COL}px">{front_right}</div>
<div style="position: absolute; left: {X0 + COL + GUT // 2}px; top: 472px; width: 0.75px; height: 484px; background: {INK}; opacity: 0.6"></div>
{front_foot}
'''

# ---------------- BACK: the lounge car ----------------
back_left = ''.join([
    head('Cocktails'),
    item('Dry Martini', 'Gin stirred ice cold with a little French vermouth, strained into a chilled glass, one green olive.', '1.25', 10),
    line('Manhattan', '1.25', 12),
    line('Tom Collins', '1.10', 6),
    line('Whiskey sour', '1.10', 6),
    line('Old fashioned', '1.15', 6),
    head('Highballs and beer', None, 20),
    line('Rye or bourbon highball', '1.00', 10),
    line('Scotch and soda', '1.10', 6),
    line('Gin and tonic', '1.10', 6),
    line('Domestic beer', '.60', 6),
])
counter = ''.join([
    line('Peanut butter sandwich', '.55', 8),
    line('Green olives, a dish', '.35', 5),
    line('Soda crackers', '.15', 5),
    line('Tonic water', '.35', 5),
    line('Clam juice cocktail, chilled', '.45', 5),
    line('Coffee, by the pot', '.30', 5),
])
back_right = ''.join([
    head('From the grill'),
    item('Cocktail Franks', 'Glazed sticky in honey, mustard, brown sugar and Worcestershire, on picks with pickled pearl onions.', '1.10', 10),
    line('Frankfurter on a toasted roll', '.50', 12),
    line('Cheeseburger, sliced onion', '.95', 6),
    f'<div style="margin-top: 18px; position: relative">'
    f'<div style="position: absolute; left: 3px; top: 2px; right: -3px; bottom: -2px; background: {GOLD}; opacity: 0.38"></div>'
    f'<div style="position: relative; border: 1.5px solid {INK}; padding: 10px 14px 12px">'
    f'<div style="font-family: {GOTH}; font-size: 21px; line-height: 1; letter-spacing: 0.09em; color: {RED}; {SQR}">AT THE COUNTER</div>'
    f'{counter}</div></div>',
])

stations = [('Boston', 'Lv', '8:30 PM'), ('Back Bay', '', '8:36'), ('Route 128', '', '8:50'), ('Providence', '', '9:22'),
            ('Kingston', '', '9:45'), ('Westerly', '', '9:58'), ('New London', '', '10:20'),
            ('Old Saybrook', '', '10:42'), ('New Haven', '', '11:20'), ('Bridgeport', '', '11:45'), ('Stamford', '', '12:10 AM'),
            ('New Rochelle', '', '12:30'), ('125th Street', '', '12:48'), ('New York', 'Ar', '12:57 AM')]


def tt_col(rows):
    out = ''
    for i, (n, a, t) in enumerate(rows):
        bb = f'border-bottom: 0.75px solid rgba(31,26,23,0.45);' if i < len(rows) - 1 else ''
        w = 700 if a else 400
        out += (f'<div style="display: flex; align-items: baseline; padding: 3px 0; {bb}">'
                f'<div style="flex: 1; font-family: {BOD}; font-weight: {w}; font-size: 15px; line-height: 1.2; {SQ}">{esc(n)}</div>'
                f'<div style="width: 24px; font-family: {GOTH}; font-size: 15px; color: {RED}; {SQR}">{a}</div>'
                f'<div style="width: 66px; text-align: right; font-family: {BOD}; font-weight: {w}; font-size: 15px; line-height: 1.2; {SQ}">{t}</div></div>')
    return out


timetable = (f'<div style="position: absolute; left: {X0}px; top: 590px; width: {CWID}px">'
             f'{head("Train 175, The Harbor Light, daily", None)}'
             f'<div style="margin-top: 6px; display: flex; gap: 24px">'
             f'<div style="width: 205px">{tt_col(stations[:5])}</div>'
             f'<div style="width: 205px">{tt_col(stations[5:10])}</div>'
             f'<div style="width: 206px">{tt_col(stations[10:])}</div></div>'
             f'<div style="margin-top: 6px; font-family: {BOD}; font-style: italic; font-size: 14px; line-height: 1.3; color: {SOFT}; {SQ}">'
             f'When fog closes the airports, extra coaches are added at Boston.</div></div>')


def field(label, w):
    return (f'<div style="display: flex; align-items: baseline; gap: 6px; width: {w}px">'
            f'<div style="font-family: {GOTH}; font-size: 15px; letter-spacing: 0.06em; {SQ}">{label}</div>'
            f'<div style="flex: 1; border-bottom: 1px solid {INK}; height: 14px"></div></div>')


rows = ''.join(f'<div style="display: flex; height: 21px; border-bottom: 0.75px solid {INK}">'
               f'<div style="width: 44px; border-right: 0.75px solid {INK}"></div><div style="flex: 1"></div>'
               f'<div style="width: 84px; border-left: 0.75px solid {INK}"></div></div>' for _ in range(5))
check = f'''
<div style="position: absolute; left: 30px; top: 790px; width: {FW - 60}px; height: 0; border-top: 2px dashed {INK}; opacity: 0.7"></div>
<div style="position: absolute; left: {X0}px; top: 781px; width: {CWID}px; text-align: center">
  <span style="background: {PAPER}; padding: 0 10px; font-family: {GOTH}; font-size: 13px; letter-spacing: 0.14em; {SQ}">TEAR HERE AND HAND THE CHECK TO YOUR WAITER</span></div>
<div style="position: absolute; left: {X0}px; top: 808px; width: {CWID}px; display: flex; gap: 22px">
  <div style="width: 236px">
    <div style="display: flex; justify-content: space-between; align-items: baseline">
      <div style="font-family: {GOTH}; font-size: 24px; letter-spacing: 0.1em; color: {RED}; {SQR}">MEAL CHECK</div>
      <div style="font-family: {BOD}; font-weight: 700; font-size: 17px; color: {RED}; {SQR}">No. 07135</div></div>
    <div style="margin-top: 4px; font-family: {BOD}; font-size: 14px; line-height: 1.32; {SQ}">Passengers will please write each item on this check. Waiters are not permitted to take spoken orders.</div>
    <div style="margin-top: 8px; display: flex; flex-wrap: wrap; gap: 8px 12px">{field("TRAIN", 112)}{field("CAR", 112)}{field("WAITER", 112)}{field("DATE", 112)}</div>
    <div style="margin-top: 9px">{field("NAME OF EMPLOYEE", 236)}</div>
  </div>
  <div style="flex: 1; border: 1.5px solid {INK}; align-self: flex-start">
    <div style="display: flex; border-bottom: 1.5px solid {INK}; font-family: {GOTH}; font-size: 14px; letter-spacing: 0.08em; {SQ}">
      <div style="width: 44px; padding: 3px 0; text-align: center; border-right: 0.75px solid {INK}">QTY.</div>
      <div style="flex: 1; padding: 3px 8px">WRITE YOUR ORDER HERE</div>
      <div style="width: 84px; padding: 3px 0; text-align: center; border-left: 0.75px solid {INK}">AMOUNT</div></div>
    {rows}
    <div style="display: flex; height: 26px; align-items: center">
      <div style="flex: 1; padding-right: 10px; text-align: right; font-family: {GOTH}; font-size: 15px; letter-spacing: 0.1em; {SQ}">TOTAL</div>
      <div style="width: 84px; height: 26px; border-left: 0.75px solid {INK}; background: rgba(214,168,70,0.35)"></div></div>
  </div>
</div>
<div style="position: absolute; left: {X0}px; top: 990px; width: {CWID}px; display: flex; justify-content: space-between; font-family: {GOTH}; font-size: 13px; letter-spacing: 0.1em; {SQ}">
  <div>COMMENTS TO THE SUPERINTENDENT OF DINING SERVICE</div><div>PRICES INCLUDE TAXES &middot; PRINTED IN U.S.A.</div></div>
'''

back = f'''
{masthead("Lounge Car", "CLUB AND GRILL SERVICE<br>BAR OPEN FROM BOSTON<br>TO STAMFORD")}
<img src="assets/lantern.png" alt="" style="position: absolute; left: 432px; top: 42px; width: 84px; height: 108.5px; display: block">
<div style="position: absolute; left: {X0}px; top: 164px; width: {COL}px">{back_left}</div>
<div style="position: absolute; left: {X0 + COL + GUT}px; top: 164px; width: {COL}px">{back_right}</div>
<div style="position: absolute; left: {X0 + COL + GUT // 2}px; top: 170px; width: 0.75px; height: 392px; background: {INK}; opacity: 0.6"></div>
{timetable}
{check}
'''

TITLES = {'front': 'Harbor & Hudson dining car card, front', 'back': 'Harbor & Hudson dining car card, back'}
for face, inner in (('front', front), ('back', back)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "eventually", "fn": "fmtDinnerEventually", "faces": ["front.html", "back.html"], "names": ["Dining Car", "Lounge Car"],
        "mm": [203.2, 279.4], "fonts": FONTS, "fams": ["Libre Bodoni", "Pathway Gothic One"],
        "phone": {"disp": "'Libre Bodoni',serif", "title": "'Pathway Gothic One',sans-serif", "name": "'Libre Bodoni',serif",
                  "body": "'Libre Bodoni',serif", "price": "'Libre Bodoni',serif", "note": "'Libre Bodoni',serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"The Out-of-Towners (1970)": {
  "Handbag shortbread fingers with jam": {"n": "Raspberry Jam Fingers", "d": "Butter shortbread baked pale and crisp, sandwiched in pairs, dusted with powdered sugar.", "note": "From the pantry, with coffee or tea."},
  "Diverted flight cocktail franks": {"n": "Cocktail Franks", "d": "Glazed sticky in honey, mustard, brown sugar and Worcestershire, on picks with pickled pearl onions.", "note": "From the grill, lounge car."},
  "Hotel rib eye breakfast": {"n": "Rib Eye Steak Breakfast", "d": "Seared to your order and rested, with two eggs fried, crisp hash brown potatoes and buttered toast.", "note": "From the broiler, served at all hours."},
  "Waldorf cheesecake": {"n": "New York Cheese Cake", "d": "Baked slowly in a water bath on a crumb crust, chilled overnight, under sliced fresh strawberries.", "note": "From the pantry, cut to order."},
  "Hotel bar martini": {"n": "Dry Martini", "d": "Gin stirred ice cold with a little French vermouth, strained into a chilled glass, one green olive.", "note": "Fog at the airports? Take the train."}
}}
open(os.path.join(D, 'eventually.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
