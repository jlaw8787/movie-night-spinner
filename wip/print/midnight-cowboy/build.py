"""Builds the Silver Palm Coaches timetable and meal stop guide (Midnight Cowboy, 1969).
The free pocket timetable a rider takes from the rack at the ticket window of the midtown
bus terminal before the overnight coach to Miami. US Letter sheet (11 x 8.5 in) printed both
sides in black and one orange spot ink on white timetable stock, folded in three.
Outside: travel tips flap, the route strip map, the cover. Inside: the southbound schedule
(light face A.M., dark face P.M., meal stops marked) and the two lunch counter menus.
Writes outside.html / inside.html (full pages), *.body.html, film.json and southbound.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 1056, 816
PAPER = '#f4efe2'
INK = '#232120'
SOFT = '#4b4642'
ORG = '#dd5e2b'
FONTS = ('family=Archivo:ital,wght@0,400;0,600;0,800;0,900;1,400'
         '&family=Archivo+Narrow:ital,wght@0,400;0,600;0,700;1,400;1,600'
         '&family=Yellowtail')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
SANS = "'Archivo', 'Franklin Gothic Medium', Arial, sans-serif"
NARROW = "'Archivo Narrow', 'Arial Narrow', sans-serif"
SCRIPT = "'Yellowtail', cursive"

def esc(s): return s.replace('&', '&amp;')

def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {gw}px; height: {FH}px; opacity: 0.55; pointer-events: none; display: block">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {FW - gw}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.3; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')

def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {SANS}; color: {INK}">{inner}{overlays(face)}</div>')

def at(x, y, w, extra=''):
    return f'position: absolute; left: {x}px; top: {y}px; width: {w}px; {extra}'

def sq(size=10, col=ORG, mt=0):
    return f'<span style="display: inline-block; width: {size}px; height: {size}px; background: {col}; margin-top: {mt}px; flex: none"></span>'

def kicker(t, col=ORG, size=13, ls='0.18em'):
    return f'<div style="font-family: {SANS}; font-weight: 800; font-size: {size}px; line-height: 1.1; letter-spacing: {ls}; color: {col}">{esc(t)}</div>'

# =====================================================================
# OUTSIDE: flap (0 to 352), back (352 to 704), cover (704 to 1056)
# =====================================================================
def tip(text, first=False):
    bt = '' if first else f'border-top: 1px solid rgba(35,33,32,0.35);'
    return (f'<div style="display: flex; gap: 10px; align-items: flex-start; padding: 7px 0 7px; {bt}">{sq(9, ORG, 6)}'
            f'<div style="font-size: 16px; line-height: 1.32; text-wrap: pretty">{text}</div></div>')

MEAL = f'<span style="display: inline-block; width: 9px; height: 9px; background: {INK}; margin: 0 2px 1px"></span>'

flap = f"""
<div style="{at(40, 40, 272)}">
  {kicker('BEFORE YOU GO')}
  <div style="margin-top: 6px; font-weight: 900; font-size: 27px; line-height: 1.02; letter-spacing: -0.005em">Riding with<br>Silver Palm</div>
  <div style="margin-top: 10px; height: 4px; background: {INK}"></div>
  <div style="margin-top: 2px; height: 1px; background: {INK}"></div>
  <div style="margin-top: 6px">
    {tip('Radios played with an earphone only, please.', True)}
    {tip('Hats and parcels ride in the overhead rack.')}
    {tip('Smoking in the last four rows only.')}
    {tip(f'Rest stops about every two hours. Meal stops are marked {MEAL} in the timetable.')}
    {tip('Keep your ticket stub until Miami.')}
    {tip('Two bags checked free, up to 150 pounds.')}
  </div>
</div>
<div style="{at(40, 486, 272, 'box-sizing: border-box; border: 2px solid ' + INK)}">
  <div style="background: {INK}; color: {PAPER}; padding: 6px 12px 5px; font-weight: 800; font-size: 13px; letter-spacing: 0.08em">AT THE NEW YORK TERMINAL</div>
  <div style="padding: 8px 12px 10px; font-size: 16px; line-height: 1.42">
    <div style="display: flex; justify-content: space-between"><span>Shoeshine stand</span><span style="font-family: {NARROW}; font-weight: 600">Lower level</span></div>
    <div style="display: flex; justify-content: space-between"><span>Coin lockers</span><span style="font-family: {NARROW}; font-weight: 600">25 cents a day</span></div>
    <div style="display: flex; justify-content: space-between"><span>Lunch counter</span><span style="font-family: {NARROW}; font-weight: 600">Open all night</span></div>
    <div style="display: flex; justify-content: space-between"><span>Ticket windows</span><span style="font-family: {NARROW}; font-weight: 600">Day and night</span></div>
  </div>
</div>
<div style="{at(46, 668, 260, 'box-sizing: border-box; border: 1.5px dashed ' + INK + '; padding: 9px 12px 9px; transform: rotate(-0.6deg)')}">
  <div style="font-family: {NARROW}; font-weight: 700; font-size: 17px; letter-spacing: 0.12em; color: {ORG}">HELP WANTED</div>
  <div style="margin-top: 2px; font-size: 16px; line-height: 1.3">Dishwasher, nights. Steady work. Apply at the lunch counter.</div>
</div>
"""

STOPS = [  # name, state, miles, kind (big, small, fla)
    ('New York', 'N.Y.', '0', 'big'), ('Newark', 'N.J.', '10', 'small'), ('Philadelphia', 'Pa.', '92', 'big'),
    ('Wilmington', 'Del.', '120', 'small'), ('Baltimore', 'Md.', '190', 'small'), ('Washington', 'D.C.', '230', 'meal'),
    ('Richmond', 'Va.', '335', 'meal'), ('Rocky Mount', 'N.C.', '455', 'small'), ('Florence', 'S.C.', '605', 'meal'),
    ('Savannah', 'Ga.', '765', 'big'), ('Jacksonville', 'Fla.', '905', 'fmeal'), ('Daytona Beach', 'Fla.', '995', 'fla'),
    ('West Palm Beach', 'Fla.', '1,180', 'fmeal'), ('Fort Lauderdale', 'Fla.', '1,225', 'fla'), ('Miami', 'Fla.', '1,250', 'end'),
]
MX, MY0, STEP = 404, 204, 33
route = ''
# the line: black to Jacksonville, orange from there
jy = MY0 + 10 * STEP
route += f'<div style="{at(MX - 3, MY0, 6, f"height: {jy - MY0}px; background: {INK}")}"></div>'
route += f'<div style="{at(MX - 4, jy, 8, f"height: {14 * STEP - 10 * STEP}px; background: {ORG}")}"></div>'
for i, (n, st, mi, kind) in enumerate(STOPS):
    y = MY0 + i * STEP
    fla = kind in ('fla', 'fmeal', 'end')
    if kind in ('big', 'end'):
        dot = f'<div style="{at(MX - 9, y - 9, 18, f"height: 18px; border-radius: 50%; background: {PAPER}; border: 4px solid {ORG if fla else INK}; box-sizing: border-box")}"></div>'
    elif kind in ('meal', 'fmeal'):
        dot = f'<div style="{at(MX - 7, y - 7, 14, f"height: 14px; background: {INK}")}"></div>'
    else:
        dot = f'<div style="{at(MX - 6, y - 6, 12, f"height: 12px; border-radius: 50%; background: {ORG if fla else INK}")}"></div>'
    wt = 800 if kind in ('big', 'end') else 600
    route += dot
    route += (f'<div style="{at(MX + 20, y - 11, 664 - MX - 20, "display: flex; justify-content: space-between; align-items: baseline")}">'
              f'<span style="font-weight: {wt}; font-size: 16px; line-height: 1.3">{n}, <span style="font-weight: 400">{st}</span></span>'
              f'<span style="font-family: {NARROW}; font-weight: 600; font-size: 15px; color: {SOFT}">{mi}</span></div>')

back = f"""
<div style="{at(392, 40, 272)}">
  {kicker('THE COASTAL ROUTE')}
  <div style="margin-top: 6px; font-weight: 900; font-size: 27px; line-height: 1.02">New York to Miami</div>
  <div style="margin-top: 4px; font-family: {NARROW}; font-weight: 600; font-size: 16px">By the Atlantic shore, about 1,250 miles.</div>
  <div style="margin-top: 8px; height: 4px; background: {INK}"></div>
  <div style="margin-top: 2px; height: 1px; background: {INK}"></div>
  <div style="margin-top: 6px; display: flex; justify-content: space-between; font-family: {NARROW}; font-weight: 700; font-size: 13px; letter-spacing: 0.12em; color: {SOFT}"><span>STOP</span><span>MILES</span></div>
</div>
<div style="{at(MX + 20, MY0 - 30, 240, f'font-family: {NARROW}; font-style: italic; font-weight: 600; font-size: 14px; line-height: 1.2; color: {ORG}')}">Connections from Texas and the West</div>
<div style="{at(MX - 1, MY0 - 30, 2, f'height: 22px; background: {INK}')}"></div><div style="{at(MX - 6, MY0 - 34, 12, f'height: 12px; border-left: 2px solid {INK}; border-top: 2px solid {INK}; transform: rotate(45deg); box-sizing: border-box')}"></div>
{route}
<div style="{at(392, 696, 272, f'border-top: 1.5px solid {INK}; padding-top: 8px; font-size: 14px; line-height: 1.38')}">
  <div><b style="font-weight: 800">New York:</b> Midtown terminal, W. 42nd St.</div>
  <div><b style="font-weight: 800">Miami:</b> Downtown terminal, near the bay.</div>
  <div style="margin-top: 4px; display: flex; justify-content: space-between; font-family: {NARROW}; font-size: 13px; color: {SOFT}"><span>Printed in U.S.A.</span><span>Form 69-S</span></div>
</div>
"""

cover = f"""
<div style="{at(720, 0, 336, f'height: 150px; background: {INK}')}"></div>
<div style="{at(720, 152, 336, f'height: 9px; background: {ORG}')}"></div>
<div style="{at(744, 46, 272, f'color: {PAPER}')}">
  <div style="font-family: {NARROW}; font-weight: 700; font-size: 14px; letter-spacing: 0.3em; color: {ORG}">SILVER PALM</div>
  <div style="margin-top: 2px; font-weight: 900; font-size: 39px; line-height: 0.96; letter-spacing: -0.01em">COACHES</div>
  <div style="margin-top: 9px; font-family: {NARROW}; font-weight: 600; font-size: 15px; letter-spacing: 0.06em">New York, the Carolinas, Florida</div>
</div>
<div style="{at(744, 170, 272, 'display: flex; align-items: baseline; justify-content: space-between')}">
  <span style="font-family: {SCRIPT}; font-size: 64px; line-height: 1.05; color: {ORG}">Florida</span>
  <span style="font-family: {NARROW}; font-weight: 700; font-size: 16px; line-height: 1.15; text-align: right">THROUGH<br>EXPRESS</span>
</div>
<div style="{at(744, 252, 272, f'height: 290px; box-sizing: border-box; border: 1.5px solid {INK}')}">
  <img src="assets/coach-art.png" alt="Coach on the causeway to Miami Beach" style="display: block; width: 269px; height: 287px">
</div>
<div style="{at(744, 556, 272)}">
  <div style="font-weight: 900; font-size: 25px; line-height: 1.04">TIMETABLE AND<br>MEAL STOP GUIDE</div>
  <div style="margin-top: 10px; background: {ORG}; color: #fff8ec; padding: 8px 12px 7px; font-weight: 800; font-size: 16px; line-height: 1.25">Leaves New York every night at midnight. No change of buses.</div>
  <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: baseline; font-family: {NARROW}; font-size: 15px">
    <span style="font-weight: 700">Effective April 27, 1969</span><span style="color: {SOFT}">Free. Take one.</span></div>
  <div style="margin-top: 6px; height: 1.5px; background: {INK}"></div>
  <div style="margin-top: 5px; font-family: {NARROW}; font-size: 15px; line-height: 1.3; color: {SOFT}">Tickets and seats at any Silver Palm window. Times are local and subject to change.</div>
</div>
"""
outside = flap + back + cover

# =====================================================================
# INSIDE: schedule (0 to 352), New York counter (352 to 704), Florida counters (704 to 1056)
# =====================================================================
ROWS = [  # stop, trip 1 time, pm?, meal?, trip 3 time, pm?, meal?
    ('New York, N.Y.', 'Lv', '12:00', 'mid', False, '9:30', False, False),
    ('Newark, N.J.', '', '12:40', False, False, '10:10', False, False),
    ('Philadelphia, Pa.', '', '2:15', False, False, '11:45', False, False),
    ('Wilmington, Del.', '', '3:05', False, False, '12:35', True, False),
    ('Baltimore, Md.', '', '4:40', False, False, '2:10', True, False),
    ('Washington, D.C.', '', '6:05', False, True, '3:35', True, False),
    ('Richmond, Va.', '', '8:50', False, False, '6:20', True, True),
    ('Rocky Mount, N.C.', '', '11:15', False, False, '8:45', True, False),
    ('Florence, S.C.', '', '2:40', True, True, '12:10', False, False),
    ('Savannah, Ga.', '', '6:30', True, False, '4:00', False, False),
    ('Jacksonville, Fla.', '', '9:15', True, True, '6:45', False, True),
    ('Daytona Beach, Fla.', '', '11:20', True, False, '8:50', False, False),
    ('West Palm Beach, Fla.', '', '2:35', False, False, '12:05', True, True),
    ('Fort Lauderdale, Fla.', '', '3:40', False, False, '1:10', True, False),
    ('Miami, Fla.', 'Ar', '4:30', False, False, '2:00', True, False),
]
TX0, TY0, RH = 40, 196, 29
C1, C2 = 240, 308     # right edges of time columns (relative to page)
def tcell(t, pm, meal, right):
    if pm == 'mid':
        return (f'<div style="{at(right - 82, 4, 82, "text-align: right; white-space: nowrap")}"><span style="font-family: {NARROW}; font-weight: 400; font-size: 16px">{t}</span>'
                f'<span style="font-family: {NARROW}; font-weight: 700; font-size: 13px; letter-spacing: 0.04em"> MID</span></div>')
    m = f'<span style="display: inline-block; width: 8px; height: 8px; background: {INK}; margin-right: 4px; vertical-align: 1px"></span>' if meal else ''
    return (f'<div style="{at(right - 70, 4, 70, "text-align: right; white-space: nowrap")}">{m}<span style="font-family: {NARROW}; font-weight: {700 if pm else 400}; font-size: 17px">{t}</span></div>')

rows = ''
for i, (stop, lvar, t1, p1, m1, t2, p2, m2) in enumerate(ROWS):
    y = TY0 + i * RH
    shade = 'background: rgba(221,94,43,0.10);' if i % 2 == 0 else ''
    fla = 'Fla.' in stop
    rows += (f'<div style="{at(TX0 - 6, y, 284, f"height: {RH}px; {shade}")}">'
             f'<div style="{at(6, 4, 150, "white-space: nowrap")}"><span style="font-family: {NARROW}; font-weight: {700 if lvar else 600}; font-size: 17px; color: {INK}">{stop}</span>'
             f'<span style="font-family: {NARROW}; font-weight: 700; font-size: 13px; color: {ORG}">{"&nbsp;&nbsp;" + lvar if lvar else ""}</span></div>'
             f'{tcell(t1, p1, m1, C1 - TX0 + 6)}{tcell(t2, p2, m2, C2 - TX0 + 6)}</div>')

sched = f"""
<div style="{at(0, 0, 336, f'height: 128px; background: {INK}')}"></div>
<div style="{at(1, 129.5, 336, f'height: 6px; background: {ORG}')}"></div>
<div style="{at(40, 42, 272, f'color: {PAPER}')}">
  <div style="font-family: {NARROW}; font-weight: 700; font-size: 14px; letter-spacing: 0.3em; color: {ORG}">TABLE 1</div>
  <div style="margin-top: 2px; font-weight: 900; font-size: 34px; line-height: 0.98">SOUTHBOUND</div>
  <div style="margin-top: 5px; font-family: {NARROW}; font-weight: 600; font-size: 15px">New York to Miami. Read down.</div>
</div>
<div style="{at(TX0, 146, 272, f'height: 44px; border-bottom: 2px solid {INK}')}">
  <div style="{at(0, 22, 120, f'font-family: {NARROW}; font-weight: 700; font-size: 13px; letter-spacing: 0.1em; color: {SOFT}')}">STOP</div>
  <div style="{at(C1 - TX0 - 64, 2, 64, 'text-align: right')}"><div style="font-weight: 900; font-size: 16px">Trip 1</div><div style="font-family: {NARROW}; font-size: 13px; color: {SOFT}">Daily</div></div>
  <div style="{at(C2 - TX0 - 56, 2, 56, 'text-align: right')}"><div style="font-weight: 900; font-size: 16px">Trip 3</div><div style="font-family: {NARROW}; font-size: 13px; color: {SOFT}">Daily</div></div>
</div>
{rows}
<img src="assets/pencil-ring.png" alt="" aria-hidden="true" style="{at(C1 - 94, TY0 - 8, 112, 'height: 43px; display: block; pointer-events: none')}">
<div style="{at(TX0, TY0 + 15 * RH + 6, 272, f'border-top: 2px solid {INK}; padding-top: 7px; font-size: 14px; line-height: 1.36')}">
  <div style="display: flex; justify-content: space-between"><span>Light face type <span style="font-family: {NARROW}">A.M.</span></span><span>Dark face type <b style="font-family: {NARROW}; font-weight: 700">P.M.</b></span></div>
  <div style="display: flex; gap: 6px; align-items: baseline"><span style="display: inline-block; width: 8px; height: 8px; background: {INK}; flex: none"></span><span>Meal stop, 30 minutes.</span></div>
  <div><b style="font-weight: 800">Through coach.</b> No change of buses.</div>
  <div>Running time 28 hours 30 minutes.</div>
</div>
"""

def dish(name, desc, price, note=None, top=16):
    n = f'<div style="margin-top: 3px; font-family: {NARROW}; font-style: italic; font-weight: 600; font-size: 15px; line-height: 1.2; color: {ORG}">{esc(note)}</div>' if note else ''
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; align-items: baseline; gap: 6px">'
            f'<span style="flex: none; font-family: {NARROW}; font-weight: 700; font-size: 23px; line-height: 1.1">{esc(name)}</span>'
            f'<span style="flex: 1; min-width: 12px; border-bottom: 2px dotted {SOFT}; transform: translateY(-4px)"></span>'
            f'<span style="flex: none; font-family: {NARROW}; font-weight: 700; font-size: 20px">{price}</span></div>'
            f'<div style="margin-top: 3px; font-size: 16px; line-height: 1.34; color: {SOFT}; text-wrap: pretty">{esc(desc)}</div>{n}</div>')

def drink_grid(items):
    cells = ''.join(f'<div style="display: flex; justify-content: space-between; align-items: baseline; padding: 4px 0; border-bottom: 1px solid rgba(35,33,32,0.35)">'
                    f'<span style="font-weight: 600; font-size: 16px">{n}</span><span style="font-family: {NARROW}; font-weight: 700; font-size: 17px">{p}</span></div>' for n, p in items)
    return f'<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px">{cells}</div>'

def panel_head(x, kick, title, sub):
    return f"""
<div style="{at(x - 24, 0, 320, f'height: 128px; background: {ORG}')}"></div>
<div style="{at(x - 24, 128, 320, f'height: 6px; background: {INK}')}"></div>
<div style="{at(x, 42, 272, 'color: #fff8ec')}">
  <div style="font-family: {NARROW}; font-weight: 700; font-size: 14px; letter-spacing: 0.3em; color: {INK}">{kick}</div>
  <div style="margin-top: 2px; font-weight: 900; font-size: 30px; line-height: 1">{title}</div>
  <div style="margin-top: 6px; font-family: {NARROW}; font-weight: 600; font-size: 15px">{sub}</div>
</div>"""

ny = panel_head(392, 'MEAL STOP', 'New York', 'Terminal lunch counter. Open all night.') + f"""
<div style="{at(392, 140, 272)}">
  {dish('Ham and Swiss quarters', 'Leg ham and Swiss cheese on white bread spread with mustard butter, crusts off, cut in four and wrapped in wax paper.', '.65', 'Packed to take on board.', 6)}
  {dish('Cinnamon doughnut holes', 'Fried to order and rolled warm in spiced sugar, with a little pot of coffee custard for dunking.', '.40', 'Hot all night.')}
  {dish('Franks and beans', 'Sliced franks browned with onion, simmered in baked beans with molasses and mustard. Buttered toast.', '.85')}
  <div style="margin-top: 16px; display: flex; align-items: center; gap: 8px">{kicker('FROM THE URN', INK, 13)}<div style="flex: 1; height: 1.5px; background: {INK}"></div></div>
  <div style="margin-top: 2px">{drink_grid([('Coffee', '.15'), ('Hot tea', '.15'), ('Milk', '.20'), ('Cocoa', '.20')])}</div>
  <div style="margin-top: 14px; box-sizing: border-box; border: 2px solid {INK}; padding: 8px 12px 9px">
    <div style="display: flex; justify-content: space-between; align-items: baseline"><span style="font-family: {NARROW}; font-weight: 700; font-size: 20px">Box lunch for the ride</span><span style="font-family: {NARROW}; font-weight: 700; font-size: 20px">.95</span></div>
    <div style="margin-top: 2px; font-size: 16px; line-height: 1.32; color: {SOFT}; text-wrap: pretty">Two ham and Swiss quarters, an apple and a cookie, sacked to carry on board.</div>
  </div>
</div>
"""

fl = panel_head(744, 'MEAL STOPS', 'Florida', 'Jacksonville and West Palm Beach.') + f"""
<div style="{at(744, 140, 272)}">
  {dish('Coconut fried shrimp', 'Butterflied with the tails on, dipped in egg, pressed into shredded coconut and crisp crumbs, then fried golden. Sweet red pepper sauce and lime.', '1.95', 'Fried to order.', 6)}
  {dish('Florida orange cake', 'Whole fruit simmered soft and ground, peel and all, then baked with eggs, sugar and ground almonds. Moist, and no flour.', '.35', 'Baked fresh each morning.')}
  {dish('Sunshine cooler', 'Coconut water, pineapple and fresh lime shaken frothy with a spoon of coconut cream, over ice with a pineapple wedge.', '.45', 'White rum on the side, .60. Riders 21 and over.')}
  <div style="margin-top: 16px; display: flex; align-items: center; gap: 8px">{kicker('FRESH SQUEEZED', INK, 13)}<div style="flex: 1; height: 1.5px; background: {INK}"></div></div>
  <div style="margin-top: 2px">{drink_grid([('Orange juice', '.25'), ('Grapefruit', '.25')])}</div>
  <div style="margin-top: 14px; box-sizing: border-box; border: 2px solid {INK}; padding: 7px 12px 8px">
    <div style="display: flex; justify-content: space-between; align-items: baseline"><span style="font-family: {NARROW}; font-weight: 700; font-size: 20px">Gift fruit shipped home</span><span style="font-family: {NARROW}; font-weight: 700; font-size: 20px">4.50</span></div>
    <div style="margin-top: 2px; font-size: 16px; line-height: 1.3; color: {SOFT}; text-wrap: pretty">Half bushel of oranges and grapefruit, boxed and sent to your door.</div>
  </div>
</div>
"""
inside = sched + ny + fl

TITLES = {'outside': 'Silver Palm timetable, outside', 'inside': 'Silver Palm timetable, inside'}
for face, inner in (('outside', outside), ('inside', inside)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "southbound", "fn": "fmtSouthbound", "faces": ["outside.html", "inside.html"], "names": ["Outside", "Inside"],
        "mm": [279.4, 215.9], "fonts": FONTS, "fams": ["Archivo", "Archivo Narrow", "Yellowtail"],
        "phone": {"disp": "'Yellowtail',cursive", "title": "'Archivo',sans-serif", "name": "'Archivo',sans-serif",
                  "body": "'Archivo',sans-serif", "price": "'Archivo Narrow',sans-serif", "note": "'Archivo Narrow',sans-serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Midnight Cowboy (1969)": {
  "Automat sandwiches": {"n": "Ham and Swiss quarters", "d": "Leg ham and Swiss cheese on white bread spread with mustard butter, crusts off, cut in four and wrapped in wax paper.", "note": "Packed to take on board."},
  "Cinnamon doughnut holes, coffee custard": {"n": "Cinnamon doughnut holes", "d": "Fried to order and rolled warm in spiced sugar, with a little pot of coffee custard for dunking.", "note": "Hot all night."},
  "Florida coconut prawns": {"n": "Coconut fried shrimp", "d": "Butterflied with the tails on, dipped in egg, pressed into shredded coconut and crisp crumbs, then fried golden. Sweet red pepper sauce and lime.", "note": "Fried to order."},
  "Florida orange cake": {"n": "Florida orange cake", "d": "Whole fruit simmered soft and ground, peel and all, then baked with eggs, sugar and ground almonds. Moist, and no flour.", "note": "Baked fresh each morning."},
  "Ratso's Florida coconut pineapple cooler": {"n": "Sunshine cooler", "d": "Coconut water, pineapple and fresh lime shaken frothy with a spoon of coconut cream, over ice with a pineapple wedge.", "note": "White rum on the side, .60. Riders 21 and over."}
}}
open(os.path.join(D, 'southbound.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
