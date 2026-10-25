"""Builds the P.S. 128 breakfast and lunch menu for June 1995
(Die Hard with a Vengeance). Front: the cafeteria calendar the school sends home each month.
Back: the Parents Association news, with the Field Day lemonade and bake sale and a
permission slip that Zeus has filled in for Dexter. One US Letter sheet, two sides,
photocopied in black toner on pale green stock. No fold.
Writes front.html, back.html (full pages), front.body.html, back.body.html, film.json,
cityrun.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
PAPER = '#d9e6c6'
INK = '#1d211d'
PEN = '#25369a'
FONTS = ('family=Arimo:ital,wght@0,400;0,700;1,400'
         '&family=Tinos:ital,wght@0,400;0,700;1,400&family=Reenie+Beanie')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
SLAB = "'Tinos', 'Times New Roman', serif"  # Times Bold, as the 1995 office printed headlines
SANS = "'Arimo', Arial, sans-serif"
SERIF = "'Tinos', 'Times New Roman', serif"
HAND = "'Reenie Beanie', cursive"
OFFICE = '212 555 0142'


def esc(s):
    return s.replace('&', '&amp;')


def img(name, left, top, w, h):
    return (f'<img src="assets/{name}.png" alt="" style="position: absolute; left: {left}px; top: {top}px; '
            f'width: {w}px; height: {h}px; display: block">')


def box(left, top, w, h, inner, extra=''):
    return (f'<div style="position: absolute; left: {left}px; top: {top}px; width: {w}px; height: {h}px; '
            f'box-sizing: border-box; {extra}">{inner}</div>')


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.42; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def root(inner, face, rot):
    # the copier feeds each side a hair off square
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {SANS}; color: {INK}; text-wrap: pretty">'
            f'<div style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; transform: rotate({rot}deg); transform-origin: 50% 50%">{inner}</div>'
            f'{overlays(face)}</div>')


def hand(text, left, top, size=30, rot=-2):
    return (f'<div style="position: absolute; left: {left}px; top: {top}px; white-space: nowrap; font-family: {HAND}; '
            f'font-size: {size}px; line-height: 1; color: {PEN}; transform: rotate({rot}deg); transform-origin: left center">{text}</div>')


# ---------------- FRONT: the calendar ----------------
GX, GY, CW, RH, HH = 48, 244, 144, 84, 26
DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']


def cell(r, c, date, lines, span=1, star=None, art=None):
    x, y = GX + c * CW, GY + HH + r * RH
    body = ''.join(
        f'<div style="font-size: 12.5px; line-height: 1.24; {"font-weight: 700; text-transform: uppercase; letter-spacing: 0.02em;" if b else ""}">{esc(t)}</div>'
        for t, b in lines)
    dn = f'<div style="float: right; margin: -1px 0 0 6px; font-family: {SLAB}; font-weight: 700; font-size: 19px; line-height: 1">{date}</div>'
    st = (f'<div style="display: inline-block; margin-bottom: 3px; font-weight: 700; font-size: 12px; line-height: 1; '
          f'letter-spacing: 0.06em; background: {INK}; color: {PAPER}; padding: 3px 5px 2px">{star}</div>') if star else ''
    return box(x, y, CW * span + 1.5, RH + 1.5,
               f'<div style="position: absolute; left: 8px; top: 6px; right: 7px">{dn}{st}{body}</div>'
               + (img(art[0], CW - art[1] - 6, RH - art[2] - 4, art[1], art[2]) if art else ''),
               f'border: 1.5px solid {INK}')


B = True
cells = [  # first line sits beside the date, so keep it short
    cell(0, 3, 1, [('Pizza bagels', 0), ('Buttered corn', 0), ('Chilled pears', 0)]),
    cell(0, 4, 2, [('Fish sticks', 0), ('Tartar sauce', 0), ('Oven fries, coleslaw', 0)]),
    cell(1, 0, 5, [('Hamburger', 0), ('on a sesame bun', 0), ('Oven fries', 0), ('Red apple', 0)]),
    cell(1, 1, 6, [('Spaghetti', 0), ('with meat sauce', 0), ('Garlic bread', 0), ('Green beans', 0)]),
    cell(1, 2, 7, [('Roast turkey', 0), ('Gravy and stuffing', 0), ('Crumb cake', B)]),
    cell(1, 3, 8, [('Grilled cheese', 0), ('Tomato soup', 0), ('Orange smiles', 0)]),
    cell(1, 4, 9, [('Cheese pizza', 0), ('Tossed salad', 0), ('PA breakfast', B), ('tomorrow!', B)]),
    cell(2, 0, 12, [('Beef tacos', 0), ('Lettuce, cheese', 0), ('Spanish rice', 0)]),
    cell(2, 1, 13, [('Hot dog', 0), ('Baked beans', 0), ('Sliced peaches', 0)]),
    cell(2, 2, 14, [('Chicken nuggets', 0), ('Crumb cake', B)], star='SLIPS DUE'),
    cell(2, 3, 15, [('Sloppy joe', 0), ('Potato puffs', 0), ('Banana', 0)]),
    cell(2, 4, 16, [('Bag lunch', 0), ('Turkey on rye', 0), ('Lemonade at 25\u00a2', 0)], star='FIELD DAY'),
    cell(3, 0, 19, [('Baked ziti', 0), ('Stewed tomatoes', 0), ('Applesauce', 0)]),
    cell(3, 1, 20, [('Chow mein', 0), ('Steamed rice', 0), ('Almond cookie', 0)]),
    cell(3, 2, 21, [('Grades 1 to 3', 0)], star='ZOO TRIP', art=('elephant', 56, 41)),
    cell(3, 3, 22, [('Meatball hero', 0), ('Tossed salad', 0), ('Watermelon', 0)]),
    cell(3, 4, 23, [('Fish on a bun', 0), ('Corn on the cob', 0), ('Ice pop', 0)]),
    cell(4, 0, 26, [('Chicken patty', 0), ('on a bun', 0), ('Green peas', 0), ('Fruit cup', 0)]),
    cell(4, 1, 27, [('Picnic lunch', 0), ('Out at 11:30', 0)], star='LAST DAY'),
]

head_row = ''.join(
    box(GX + i * CW, GY, CW + 1.5, HH + 1.5,
        f'<div style="text-align: center; font-weight: 700; font-size: 13px; line-height: {HH}px; letter-spacing: 0.16em; color: {PAPER}">{d}</div>',
        f'background: {INK}') for i, d in enumerate(DAYS))

riddle = box(GX, GY + HH, CW * 3 + 1.5, RH + 1.5, f'''
  <div style="position: absolute; left: 12px; top: 9px; right: 12px">
    <div style="display: flex; align-items: baseline; justify-content: space-between">
      <div style="font-family: {SLAB}; font-weight: 700; font-size: 18px; line-height: 1; white-space: nowrap">Riddle of the Week</div>
      <div style="font-weight: 700; font-size: 12px; letter-spacing: 0.08em; white-space: nowrap">ANSWER MONDAY AT LUNCH</div></div>
    <div style="margin-top: 7px; font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.24">As I was going to St. Ives, I met a man with seven wives. How many were going to St. Ives? Count carefully!</div>
  </div>''', f'border: 1.5px solid {INK}')

summer = box(GX + 2 * CW, GY + HH + 4 * RH, CW * 3 + 1.5, RH + 1.5, f'''
  {img('beachball', 8, 10, 100, 69)}
  <div style="position: absolute; left: 118px; top: 12px; right: 10px">
    <div style="font-family: {SLAB}; font-weight: 700; font-size: 27px; line-height: 1">Have a safe summer!</div>
    <div style="margin-top: 6px; font-family: {SERIF}; font-size: 16px; line-height: 1.22">Free summer lunch at the park, weekdays at noon, July and August. No forms needed.</div>
  </div>''', f'border: 1.5px solid {INK}')


def feature(left, label, name, desc, art, aw, ah, price):
    return f'''<div style="position: absolute; left: {left}px; top: 722px; width: 224px">
  <div style="height: 74px; position: relative">{img(art, 0, 74 - ah, aw, ah)}</div>
  <div style="margin-top: 6px; border-top: 2px solid {INK}; padding-top: 6px; display: flex; justify-content: space-between; font-weight: 700; font-size: 12px; letter-spacing: 0.1em; white-space: nowrap"><span>{label}</span><span>{price}</span></div>
  <div style="margin-top: 5px; font-family: {SLAB}; font-weight: 700; font-size: 22px; line-height: 1.05">{esc(name)}</div>
  <div style="margin-top: 6px; font-family: {SERIF}; font-size: 16px; line-height: 1.28">{esc(desc)}</div>
</div>'''


front = f'''
<div style="position: absolute; left: 48px; top: 44px; width: 540px">
  <div style="font-weight: 700; font-size: 14px; letter-spacing: 0.14em; line-height: 1">PUBLIC SCHOOL 128, MANHATTAN</div>
  <div style="margin-top: 3px; font-size: 13px; line-height: 1.3">Office of School Food. A good breakfast starts a good day.</div>
  <div style="margin-top: 10px; font-family: {SLAB}; font-weight: 700; font-size: 52px; line-height: 0.92; letter-spacing: -0.01em; white-space: nowrap">Breakfast &amp; Lunch</div>
  <div style="margin-top: 8px; display: flex; align-items: center; gap: 14px">
    <div style="font-family: {SLAB}; font-weight: 700; font-size: 28px; line-height: 1; background: {INK}; color: {PAPER}; padding: 5px 12px 4px">JUNE 1995</div>
    <div style="font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.2">Please keep this menu<br>on the refrigerator.</div>
  </div>
</div>
{img('carton', 590, 38, 98, 125)}
<div style="position: absolute; left: 694px; top: 48px; width: 76px; font-family: {SLAB}; font-weight: 700; font-size: 17px; line-height: 1.06">June is Dairy Month</div>
<div style="position: absolute; left: 694px; top: 118px; width: 76px; font-size: 12px; line-height: 1.25; font-weight: 700">Milk with every meal.</div>

<div style="position: absolute; left: 48px; top: 190px; width: 720px; height: 40px; box-sizing: border-box; border: 2px solid {INK}; border-left-width: 8px; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; font-size: 14px; line-height: 1.2; white-space: nowrap">
  <span><b>BREAKFAST</b> free for every child, 7:30 to 8:00 A.M.</span>
  <span><b>LUNCH</b> $1.00. Reduced price 40&#162;.</span>
</div>

{head_row}
{riddle}
{''.join(cells)}
{summer}

<div style="position: absolute; left: 48px; top: 702px; width: 720px; display: flex; align-items: center; gap: 12px">
  <div style="font-family: {SLAB}; font-weight: 700; font-size: 15px; line-height: 1; white-space: nowrap">FROM OUR KITCHEN THIS MONTH</div>
  <div style="flex: 1; border-top: 1.5px dashed {INK}"></div></div>
{feature(48, 'EVERY SCHOOL DAY', 'Bacon, Egg & Cheese', 'Crisp strips and a fried yolk broken flat under melting American, on a butter-toasted kaiser roll. Ketchup on the side.', 'skillet', 120, 74, 'FREE')}
<div style="position: absolute; left: 290px; top: 716px; width: 236px">
  {img('tray', 4, 2, 224, 145)}
  <div style="position: absolute; left: 6px; top: 156px; width: 224px">
    <div style="border-top: 2px solid {INK}; padding-top: 6px; font-weight: 700; font-size: 12px; letter-spacing: 0.1em; white-space: nowrap">LUNCH LINE MANNERS</div>
    <div style="margin-top: 5px; font-family: {SERIF}; font-size: 16px; line-height: 1.28">Walk, wait your turn, take a milk, and always say thank you to the cooks on the line.</div>
  </div>
</div>
{feature(544, 'WEDNESDAYS', 'Crumb Cake', 'Buttery yellow batter baked under a thick layer of brown sugar and cinnamon streusel, dusted with powdered sugar.', 'crumb', 98, 74, 'WITH LUNCH')}

<div style="position: absolute; left: 48px; top: 990px; width: 720px; border-top: 2px solid {INK}; padding-top: 7px; display: flex; justify-content: space-between; font-size: 12px; line-height: 1.2; white-space: nowrap">
  <span><b>MENUS MAY CHANGE WITHOUT NOTICE.</b> Lunch tickets sold Mondays in the office.</span><span><b>OFFICE</b> {OFFICE}</span>
</div>
'''

# ---------------- BACK: Parents Association news ----------------


def head(t, top=0):
    return (f'<div style="margin-top: {top}px; display: flex; align-items: center; gap: 10px">'
            f'<div style="font-family: {SLAB}; font-weight: 700; font-size: 22px; line-height: 1.05; white-space: nowrap">{esc(t)}</div>'
            f'<div style="flex: 1; border-top: 3px double {INK}; height: 3px"></div></div>')


def sale(name, desc, price, top=12):
    d = f'<div style="margin-top: 3px; font-family: {SERIF}; font-size: 16px; line-height: 1.27">{esc(desc)}</div>' if desc else ''
    return (f'<div style="margin-top: {top}px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
            f'<div style="font-family: {SLAB}; font-weight: 700; font-size: 21px; line-height: 1.1">{esc(name)}</div>'
            f'<div style="font-family: {SLAB}; font-weight: 700; font-size: 19px; line-height: 1.1; white-space: nowrap">{price}</div></div>{d}</div>')


def small(name, price):
    return (f'<div style="display: flex; justify-content: space-between; align-items: baseline; font-size: 15px; line-height: 1.5; '
            f'border-bottom: 1px dotted {INK}"><span>{esc(name)}</span><b>{price}</b></div>')


def note(title, text, top=14):
    return (f'<div style="margin-top: {top}px"><div style="font-weight: 700; font-size: 13px; letter-spacing: 0.1em; line-height: 1.2">{title}</div>'
            f'<div style="margin-top: 3px; font-family: {SERIF}; font-size: 16px; line-height: 1.27">{esc(text)}</div></div>')


def field(label, value, width, size):
    w = f'width: {width}px;' if width else 'flex: 1;'
    v = (f'<div style="position: absolute; left: 12px; bottom: 1px; white-space: nowrap; font-family: {HAND}; font-size: {size}px; '
         f'line-height: 1; color: {PEN}; transform: rotate(-2deg); transform-origin: left bottom">{value}</div>')
    return (f'<div style="{w} display: flex; align-items: flex-end; gap: 8px"><span style="white-space: nowrap">{label}</span>'
            f'<div style="position: relative; flex: 1; border-bottom: 1.5px solid {INK}; height: 26px">{v}</div></div>')


def check(on, text):
    mark = f'<div style="position: absolute; left: 1px; top: -9px; font-family: {HAND}; font-size: 32px; line-height: 1; color: {PEN}">x</div>' if on else ''
    return (f'<div style="display: flex; align-items: center; gap: 9px; margin-top: 10px; font-size: 15px; line-height: 1.2">'
            f'<div style="position: relative; width: 15px; height: 15px; border: 1.5px solid {INK}; flex: none">{mark}</div><span>{text}</span></div>')


back = f'''
<div style="position: absolute; left: 48px; top: 44px; width: 720px; border-top: 6px solid {INK}; border-bottom: 2px solid {INK}; padding: 8px 0 8px; display: flex; justify-content: space-between; align-items: flex-end">
  <div>
    <div style="font-family: {SLAB}; font-weight: 700; font-size: 40px; line-height: 1; white-space: nowrap">Parents Association News</div>
    <div style="margin-top: 6px; font-weight: 700; font-size: 13px; letter-spacing: 0.12em">PUBLIC SCHOOL 128, MANHATTAN</div>
  </div>
  <div style="text-align: right; font-size: 13px; line-height: 1.35; white-space: nowrap"><b>JUNE 1995</b><br>Meetings first Tuesday<br>6 P.M., in the library</div>
</div>

<div style="position: absolute; left: 48px; top: 152px; width: 404px">
  {head('Field Day, Friday, June 16')}
  <div style="margin-top: 8px; font-family: {SERIF}; font-size: 16px; line-height: 1.3">All grades on the yard from 9:30. Sack race, three-legged race, tug of war, Simon Says and the water jug relay. Wear sneakers and a hat. Rain date Monday, June 19.</div>

  <div style="margin-top: 16px; position: relative; border: 2px solid {INK}; padding: 12px 16px 14px">
    <div style="position: absolute; right: 10px; top: -22px; width: 104px; height: 119px">{img('jug', 0, 0, 104, 119)}</div>
    <div style="font-family: {SLAB}; font-weight: 700; font-size: 26px; line-height: 1.02; width: 260px">Lemonade &amp;<br>Bake Sale</div>
    <div style="margin-top: 5px; font-size: 13px; line-height: 1.3; width: 270px">PA table by the yard gate, all day. Every penny goes to the library fund.</div>
    {sale('Fresh Lemonade', 'Squeezed lemons, sugar syrup and cold water, mixed by the jug and poured over ice.', '25&#162;', 14)}
    {sale('Peanut Caramel Squares', 'Brown sugar, butter and cream cooked to soft ball with roasted salted nuts, set in a pan and spread with milk chocolate and coarse salt.', '50&#162;')}
    <div style="margin-top: 12px">
      {small('Banana bread, by the slice', '35&#162;')}
      {small('Oatmeal raisin cookies', '2 for 25&#162;')}
      {small('Fudge brownies', '35&#162;')}
      {small('Ice pops, all flavors', '25&#162;')}
    </div>
    <div style="margin-top: 8px; font-size: 13px; line-height: 1.3"><b>Bakers wanted!</b> Drop off by 9 A.M. and please label anything made with nuts.</div>
  </div>
</div>

<div style="position: absolute; left: 480px; top: 152px; width: 288px">
  {head('Notes Home')}
  {note('FROM THE NURSE', 'Medicine needs a doctor\'s note. We cannot give out aspirin without one.', 8)}
  {note('FROM THE LIBRARY', 'Summer reading lists come home with report cards. Two books by September!')}
  {note('LUNCHROOM HELPERS', 'Raymond and Dexter, for wiping every table without being asked.')}
  {note('GOOD SAMARITAN AWARD', 'Class 2-3 collected 311 cans for the food drive. Well done!')}
  <div style="margin-top: 16px; position: relative; border: 2px solid {INK}; padding: 10px 14px 12px">
    {img('chickwaffle', 168, 6, 92, 66)}
    <div style="font-family: {SLAB}; font-weight: 700; font-size: 22px; line-height: 1.02; width: 160px">PA Breakfast</div>
    <div style="margin-top: 5px; width: 160px; font-size: 13px; line-height: 1.3"><b>Saturday, June 10</b><br>8 to 11 A.M., cafeteria</div>
    <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: baseline">
      <div style="font-family: {SLAB}; font-weight: 700; font-size: 19px; line-height: 1.1">Fried Chicken &amp; Waffles</div></div>
    <div style="margin-top: 3px; font-family: {SERIF}; font-size: 16px; line-height: 1.27">Thighs soaked in buttermilk, dredged in paprika flour, fried golden, on hot waffles with warm honey and a dash of pepper sauce.</div>
    <div style="margin-top: 6px; display: flex; justify-content: space-between; font-size: 13px; line-height: 1.3"><b>$3.00 a plate, kids $1.50</b><b>Coffee 50&#162;</b></div>
    <div style="margin-top: 3px; font-size: 13px; line-height: 1.3">Waffle irons lent by Mr. Carver's shop.</div>
  </div>
</div>

<div style="position: absolute; left: 30px; top: 762px; width: 756px; border-top: 2px dashed {INK}"></div>
{img('scissors', 52, 747, 54, 33)}
<div style="position: absolute; left: 116px; top: 768px; font-weight: 700; font-size: 12px; letter-spacing: 0.12em">CUT HERE AND RETURN</div>

<div style="position: absolute; left: 48px; top: 792px; width: 720px; height: 214px; box-sizing: border-box; border: 2px solid {INK}; padding: 14px 20px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    <div style="font-family: {SLAB}; font-weight: 700; font-size: 24px; line-height: 1">Field Day Permission Slip</div>
    <div style="font-size: 14px; line-height: 1"><b>Return by Wednesday, June 14</b></div></div>
  <div style="display: flex; gap: 24px; margin-top: 24px; font-size: 15px; line-height: 1">
    {field("Child's name", 'Dexter', None, 34)}{field('Class', '3-1', 170, 34)}
  </div>
  <div style="display: flex; gap: 34px; margin-top: 6px">
    <div>{check(True, 'My child may take part in Field Day.')}{check(False, 'I can help at the lemonade table.')}</div>
    <div>{check(True, 'I will send something for the bake sale.')}{check(False, 'My child has an allergy (please list).')}</div>
  </div>
  <div style="display: flex; gap: 24px; margin-top: 26px; font-size: 15px; line-height: 1">
    {field('Parent or guardian', 'Z. Carver (uncle)', None, 36)}{field('Daytime phone', 'call the shop', 260, 31)}
  </div>
</div>
'''

TITLES = {'front': 'Lunch menu, June 1995', 'back': 'Parents Association news'}
for face, inner, rot in (('front', front, 0.22), ('back', back, -0.18)):
    body = root(inner, face, rot)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "cityrun", "fn": "fmtCityrun", "faces": ["front.html", "back.html"], "names": ["Lunch menu", "Parents news"],
        "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Tinos", "Arimo", "Reenie Beanie"],
        "phone": {"disp": "'Tinos',serif", "title": "'Tinos',serif", "name": "'Tinos',serif",
                  "body": "'Tinos',serif", "price": "'Arimo',sans-serif", "note": "'Arimo',sans-serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Die Hard with a Vengeance (1995)": {
    "Zeus's salted peanut caramel slab": {"n": "Peanut Caramel Squares", "d": "Brown sugar, butter and cream cooked to soft ball with roasted salted nuts, set in a pan and spread with milk chocolate and coarse salt.", "note": "Parents Association bake sale, Field Day. 50 cents."},
    "Harlem chicken and waffles": {"n": "Fried Chicken & Waffles", "d": "Thighs soaked in buttermilk, dredged in paprika flour, fried golden, on hot waffles with warm honey and a dash of pepper sauce.", "note": "Parents Association breakfast, Saturday, June 10."},
    "Bacon egg and cheese on a roll": {"n": "Bacon, Egg & Cheese", "d": "Crisp strips and a fried yolk broken flat under melting American, on a butter-toasted kaiser roll. Ketchup on the side.", "note": "Free breakfast every school day, 7:30 to 8:00."},
    "Crumb cake": {"n": "Crumb Cake", "d": "Buttery yellow batter baked under a thick layer of brown sugar and cinnamon streusel, dusted with powdered sugar.", "note": "Every Wednesday with lunch."},
    "Water jug lemonade": {"n": "Fresh Lemonade", "d": "Squeezed lemons, sugar syrup and cold water, mixed by the jug and poured over ice.", "note": "Field Day lemonade table. 25 cents a cup."},
}}
open(os.path.join(D, 'cityrun.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
