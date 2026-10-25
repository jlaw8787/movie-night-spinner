"""Builds the Silver Palm Coaches timetable and meal stop guide (Midnight Cowboy, 1969).
The free pocket timetable a rider takes from the rack at the ticket window of the midtown
bus terminal before the overnight coach to Miami. US Letter sheet (11 x 8.5 in) printed both
sides in black and one orange spot ink on cream timetable stock, folded in three.
Type is period gothic: League Gothic (an Alternate Gothic revival) for display, News Cycle
(a News Gothic revival) for reading copy, Archivo Narrow for times and prices. The orange
plate sits a hair off register against the black, as on a small offset press.
Outside: travel tips flap, the route strip map with fares from New York, the cover.
Inside: Table 1, southbound read down and northbound read up (light face A.M., dark face P.M.,
meal stops marked), then the two lunch counter menus.
Writes outside.html / inside.html (full pages), *.body.html, film.json and southbound.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 1056, 816
PAPER = '#f3eddd'
INK = '#232120'
SOFT = '#4b4642'
ORG = '#dd5e2b'
CREAMINK = '#fbf4e4'
FONTS = ('family=League+Gothic'
         '&family=News+Cycle:wght@400;700'
         '&family=Archivo+Narrow:ital,wght@0,400;0,600;0,700;1,400;1,600')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
GOTH = "'League Gothic', 'Alternate Gothic No1 D', 'Arial Narrow', sans-serif"
BODY = "'News Cycle', 'News Gothic MT', Arial, sans-serif"
NARROW = "'Archivo Narrow', 'Arial Narrow', sans-serif"
# off-register: the orange plate prints 2px right and 1.5px low of the black
REG = f'text-shadow: 2px 1.5px 0 {ORG}'

def esc(s): return s.replace('&', '&amp;')

def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {gw}px; height: {FH}px; opacity: 0.55; pointer-events: none; display: block">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {FW - gw}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.3; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')

def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {BODY}; color: {INK}">{inner}{overlays(face)}</div>')

def at(x, y, w, extra=''):
    return f'position: absolute; left: {x}px; top: {y}px; width: {w}px; {extra}'

def sq(size=10, col=ORG, mt=0):
    return f'<span style="display: inline-block; width: {size}px; height: {size}px; background: {col}; margin-top: {mt}px; flex: none"></span>'

def kicker(t, col=ORG, size=14, ls='0.16em'):
    return f'<div style="font-family: {NARROW}; font-weight: 700; font-size: {size}px; line-height: 1.1; letter-spacing: {ls}; color: {col}">{esc(t)}</div>'

def head(t, size=40, col=INK, reg=True):
    return (f'<div style="font-family: {GOTH}; font-size: {size}px; line-height: 0.95; letter-spacing: 0.01em; '
            f'text-transform: uppercase; color: {col}; {REG if reg else ""}">{t}</div>')

def double_rule(top=8):
    # black rules with the orange plate's hairline a touch off below them
    return (f'<div style="margin-top: {top}px; position: relative; height: 9px">'
            f'<div style="position: absolute; left: 0; top: 0; right: 0; height: 4px; background: {INK}"></div>'
            f'<div style="position: absolute; left: 0; top: 7px; right: 0; height: 1px; background: {INK}"></div>'
            f'<div style="position: absolute; left: 2px; top: 5px; right: -2px; height: 1.5px; background: {ORG}; opacity: 0.85"></div></div>')

# =====================================================================
# OUTSIDE: flap (0 to 352), back (352 to 704), cover (704 to 1056)
# =====================================================================
def tip(text, first=False):
    bt = '' if first else 'border-top: 1px solid rgba(35,33,32,0.35);'
    return (f'<div style="display: flex; gap: 10px; align-items: flex-start; padding: 6px 0 6px; {bt}">{sq(9, ORG, 6)}'
            f'<div style="font-size: 16px; line-height: 1.3; text-wrap: pretty">{text}</div></div>')

MEAL = f'<span style="display: inline-block; width: 9px; height: 9px; background: {INK}; margin: 0 2px 1px"></span>'

flap = f"""
<div style="{at(40, 40, 272)}">
  {kicker('BEFORE YOU GO')}
  <div style="margin-top: 5px">{head('Riding with<br>Silver Palm', 44)}</div>
  {double_rule(10)}
  <div style="margin-top: 4px">
    {tip('Radios played with an earphone only, please.', True)}
    {tip('Hats and parcels ride in the overhead rack.')}
    {tip('Smoking in the last four rows only.')}
    {tip(f'Rest stops about every two hours. Meal stops are marked {MEAL} in the timetable.')}
    {tip('Keep your ticket stub until Miami.')}
    {tip('Two bags checked free, up to 150 pounds.')}
  </div>
</div>
<div style="{at(40, 480, 272, 'box-sizing: border-box; border: 2px solid ' + INK)}">
  <div style="background: {INK}; color: {CREAMINK}; padding: 6px 12px 3px; font-family: {GOTH}; font-size: 22px; line-height: 1; letter-spacing: 0.06em">AT THE NEW YORK TERMINAL</div>
  <div style="padding: 8px 12px 9px; font-size: 16px; line-height: 1.42">
    <div style="display: flex; justify-content: space-between"><span>Shoeshine stand</span><span style="font-family: {NARROW}; font-weight: 600">Lower level</span></div>
    <div style="display: flex; justify-content: space-between"><span>Coin lockers</span><span style="font-family: {NARROW}; font-weight: 600">25 cents a day</span></div>
    <div style="display: flex; justify-content: space-between"><span>Lunch counter</span><span style="font-family: {NARROW}; font-weight: 600">Open all night</span></div>
    <div style="display: flex; justify-content: space-between"><span>Ticket windows</span><span style="font-family: {NARROW}; font-weight: 600">Day and night</span></div>
  </div>
</div>
<div style="{at(46, 668, 260, 'box-sizing: border-box; border: 1.5px dashed ' + INK + '; padding: 8px 12px 9px; transform: rotate(-0.6deg)')}">
  <div style="font-family: {GOTH}; font-size: 24px; line-height: 1; letter-spacing: 0.08em; color: {ORG}">HELP WANTED</div>
  <div style="margin-top: 3px; font-size: 16px; line-height: 1.3">Dishwasher, nights. Steady work. Apply at the lunch counter.</div>
</div>
"""

# stop, state, miles, kind, one way, round trip (from New York)
def fare(mi):
    ow = round((1.20 + 0.0318 * mi) * 20) / 20
    rt = round(ow * 1.8 * 20) / 20
    return f'{ow:.2f}', f'{rt:.2f}'
STOPS = [('New York', 'N.Y.', 0, 'big'), ('Newark', 'N.J.', 10, 'small'), ('Philadelphia', 'Pa.', 92, 'big'),
         ('Wilmington', 'Del.', 120, 'small'), ('Baltimore', 'Md.', 190, 'small'), ('Washington', 'D.C.', 230, 'meal'),
         ('Richmond', 'Va.', 335, 'meal'), ('Rocky Mount', 'N.C.', 455, 'small'), ('Florence', 'S.C.', 605, 'meal'),
         ('Savannah', 'Ga.', 765, 'big'), ('Jacksonville', 'Fla.', 905, 'fmeal'), ('Daytona Beach', 'Fla.', 995, 'fla'),
         ('W. Palm Beach', 'Fla.', 1180, 'fmeal'), ('Ft. Lauderdale', 'Fla.', 1225, 'fla'), ('Miami', 'Fla.', 1250, 'end')]
MX, MY0, STEP = 404, 214, 32.5
OWR, RTR = 610, 664          # right edges of the fare columns
route = ''
jy = MY0 + 10 * STEP
route += f'<div style="{at(MX - 3, MY0, 6, f"height: {jy - MY0}px; background: {INK}")}"></div>'
route += f'<div style="{at(MX - 2, jy + 1.5, 8, f"height: {4 * STEP}px; background: {ORG}")}"></div>'
for i, (n, st, mi, kind) in enumerate(STOPS):
    y = MY0 + i * STEP
    fla = kind in ('fla', 'fmeal', 'end')
    if kind in ('big', 'end'):
        dot = f'<div style="{at(MX - 9, y - 9, 18, f"height: 18px; border-radius: 50%; background: {PAPER}; border: 4px solid {ORG if fla else INK}; box-sizing: border-box")}"></div>'
    elif kind in ('meal', 'fmeal'):
        dot = f'<div style="{at(MX - 7, y - 7, 14, f"height: 14px; background: {INK}")}"></div>'
    else:
        dot = f'<div style="{at(MX - 6, y - 6, 12, f"height: 12px; border-radius: 50%; background: {ORG if fla else INK}")}"></div>'
    wt = 700 if kind in ('big', 'end') else 400
    ow, rt = ('', '') if mi == 0 else fare(mi)
    if mi == 0:
        ow, rt = 'Lv', ''
    route += dot
    route += (f'<div style="{at(MX + 18, y - 11, 150, "white-space: nowrap")}">'
              f'<span style="font-weight: {wt}; font-size: 16px; line-height: 1.3">{n}, {st}</span></div>')
    pc = ORG if mi == 0 else INK
    route += (f'<div style="{at(OWR - 52, y - 11, 52, f"text-align: right; font-family: {NARROW}; font-weight: 600; font-size: 16px; line-height: 1.3; color: {pc}")}">{ow}</div>'
              f'<div style="{at(RTR - 54, y - 11, 54, f"text-align: right; font-family: {NARROW}; font-weight: 700; font-size: 16px; line-height: 1.3")}">{rt}</div>')

back = f"""
<div style="{at(392, 40, 272)}">
  {kicker('THE COASTAL ROUTE')}
  <div style="margin-top: 5px">{head('Fares from New York', 44)}</div>
  <div style="margin-top: 5px; font-size: 15px; line-height: 1.3">By the Atlantic shore to Miami, 1,250 miles. Children 5 to 11 ride half fare.</div>
  {double_rule(8)}
  <div style="margin-top: 5px; display: flex; justify-content: space-between; align-items: baseline; font-family: {NARROW}; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; color: {SOFT}">
    <span>STOP</span><span style="margin-left: auto; width: 64px; text-align: right">ONE WAY</span><span style="width: 66px; text-align: right">ROUND TRIP</span></div>
</div>
<div style="{at(MX + 18, MY0 - 31, 200, f'font-family: {NARROW}; font-style: italic; font-weight: 600; font-size: 14px; line-height: 1.2; color: {ORG}')}">Connections from Texas and the West</div>
<div style="{at(MX - 1, MY0 - 28, 2, f'height: 20px; background: {INK}')}"></div>
<div style="{at(MX - 6, MY0 - 32, 12, f'height: 12px; border-left: 2px solid {INK}; border-top: 2px solid {INK}; transform: rotate(45deg); box-sizing: border-box')}"></div>
{route}
<div style="{at(392, 698, 272, f'border-top: 1.5px solid {INK}; padding-top: 7px; font-size: 14px; line-height: 1.36')}">
  <div><b>New York:</b> Midtown terminal, W. 42nd St.</div>
  <div><b>Miami:</b> Downtown terminal, near the bay.</div>
  <div style="margin-top: 3px; display: flex; justify-content: space-between; font-family: {NARROW}; font-size: 13px; color: {SOFT}"><span>Fares include federal tax. Printed in U.S.A.</span><span>Form 69-S</span></div>
</div>
"""

cover = f"""
<div style="{at(720, 0, 336, f'height: 150px; background: {INK}')}"></div>
<div style="{at(722, 152, 336, f'height: 9px; background: {ORG}')}"></div>
<div style="{at(744, 44, 272, f'color: {CREAMINK}')}">
  <div style="font-family: {NARROW}; font-weight: 700; font-size: 14px; letter-spacing: 0.32em; color: {ORG}">SILVER PALM</div>
  <div style="margin-top: 1px; font-family: {GOTH}; font-size: 60px; line-height: 0.92; letter-spacing: 0.04em">COACHES</div>
  <div style="margin-top: 6px; font-family: {NARROW}; font-weight: 600; font-size: 15px; letter-spacing: 0.06em">New York, the Carolinas, Florida</div>
</div>
<div style="{at(744, 172, 272, 'display: flex; align-items: flex-end; justify-content: space-between')}">
  <span style="font-family: {GOTH}; font-size: 82px; line-height: 0.86; letter-spacing: 0.02em; color: {ORG}; text-shadow: -2px -1.5px 0 {INK}">FLORIDA</span>
  <span style="font-family: {NARROW}; font-weight: 700; font-size: 16px; line-height: 1.12; text-align: right; padding-bottom: 2px">THROUGH<br>EXPRESS</span>
</div>
<div style="{at(744, 256, 272, f'height: 290px; box-sizing: border-box; border: 1.5px solid {INK}')}">
  <img src="assets/coach-art.png" alt="Coach on the causeway to Miami Beach" style="display: block; width: 269px; height: 287px">
</div>
<div style="{at(744, 558, 272)}">
  {head('Timetable and<br>meal stop guide', 38)}
  <div style="margin-top: 9px; background: {ORG}; color: {CREAMINK}; padding: 7px 12px 7px; font-weight: 700; font-size: 16px; line-height: 1.25">Leaves New York every night at midnight. No change of buses.</div>
  <div style="margin-top: 9px; display: flex; justify-content: space-between; align-items: baseline; font-family: {NARROW}; font-size: 15px">
    <span style="font-weight: 700">Effective April 27, 1969</span><span style="color: {SOFT}">Free. Take one.</span></div>
  <div style="margin-top: 5px; height: 1.5px; background: {INK}"></div>
  <div style="margin-top: 5px; font-family: {NARROW}; font-size: 15px; line-height: 1.3; color: {SOFT}">Tickets and seats at any Silver Palm window. Times are local and subject to change.</div>
</div>
"""
outside = flap + back + cover

# =====================================================================
# INSIDE: Table 1 (0 to 352), New York counter (352 to 704), Florida counters (704 to 1056)
# =====================================================================
# stop, lv/ar south, trip1 (time, pm, meal), trip3, trip2 northbound (read up)
ROWS = [
    ('New York, N.Y.', ('12:00', 'mid', False), ('9:30', False, False), ('12:30', False, False)),
    ('Newark, N.J.', ('12:40', False, False), ('10:10', False, False), ('11:55', True, False)),
    ('Philadelphia, Pa.', ('2:15', False, False), ('11:45', False, False), ('10:15', True, False)),
    ('Wilmington, Del.', ('3:05', False, False), ('12:35', True, False), ('9:20', True, False)),
    ('Baltimore, Md.', ('4:40', False, False), ('2:10', True, False), ('7:55', True, False)),
    ('Washington, D.C.', ('6:05', False, True), ('3:35', True, False), ('6:40', True, True)),
    ('Richmond, Va.', ('8:50', False, False), ('6:20', True, True), ('3:50', True, False)),
    ('Rocky Mount, N.C.', ('11:15', False, False), ('8:45', True, False), ('1:30', True, True)),
    ('Florence, S.C.', ('2:40', True, True), ('12:10', False, False), ('10:00', False, False)),
    ('Savannah, Ga.', ('6:30', True, False), ('4:00', False, False), ('6:15', False, True)),
    ('Jacksonville, Fla.', ('9:15', True, True), ('6:45', False, True), ('3:30', False, False)),
    ('Daytona Bch., Fla.', ('11:20', True, False), ('8:50', False, False), ('1:15', False, False)),
    ('W. Palm Bch., Fla.', ('2:35', False, False), ('12:05', True, True), ('10:00', True, True)),
    ('Ft. Lauderdale, Fla.', ('3:40', False, False), ('1:10', True, False), ('8:50', True, False)),
    ('Miami, Fla.', ('4:30', False, False), ('2:00', True, False), ('8:00', True, False)),
]
TX0, TY0, RH = 40, 214, 28
C1, C2, C3 = 222, 268, 312      # right edges of the three time columns
def tcell(t, pm, meal, right, w=48):
    if pm == 'mid':
        return (f'<div style="{at(right - 64, 3, 64, "text-align: right; white-space: nowrap")}"><span style="font-family: {NARROW}; font-weight: 400; font-size: 16px">{t}</span>'
                f'<span style="font-family: {NARROW}; font-weight: 700; font-size: 12px"> MID</span></div>')
    m = f'<span style="display: inline-block; width: 7px; height: 7px; background: {INK}; margin-right: 3px; vertical-align: 1px"></span>' if meal else ''
    return (f'<div style="{at(right - w, 3, w, "text-align: right; white-space: nowrap")}">{m}<span style="font-family: {NARROW}; font-weight: {700 if pm else 400}; font-size: 16px">{t}</span></div>')

rows = ''
for i, (stop, a, b, c) in enumerate(ROWS):
    y = TY0 + i * RH
    shade = 'background: rgba(221,94,43,0.11);' if i % 2 == 0 else ''
    end = i in (0, len(ROWS) - 1)
    rows += (f'<div style="{at(TX0 - 6, y, 284, f"height: {RH}px; {shade}")}">'
             f'<div style="{at(6, 3, 120, "white-space: nowrap")}"><span style="font-family: {NARROW}; font-weight: {700 if end else 600}; font-size: 15.5px; color: {INK}">{stop}</span></div>'
             f'{tcell(*a, C1 - TX0 + 6)}{tcell(*b, C2 - TX0 + 6)}{tcell(*c, C3 - TX0 + 6, 46)}</div>')
# the northbound column gets a thin rule to its left, like a real "read up" column
rows += f'<div style="{at(C2 + 4, TY0, 1.5, f"height: {15 * RH}px; background: {INK}")}"></div>'

def colhead(right, w, trip, sub, arrow):
    return (f'<div style="{at(right - w, 0, w, "text-align: right")}">'
            f'<div style="font-family: {GOTH}; font-size: 22px; line-height: 1; letter-spacing: 0.03em">{trip}</div>'
            f'<div style="font-family: {NARROW}; font-weight: 600; font-size: 12px; line-height: 1.2; color: {SOFT}">{sub}</div>'
            f'<div style="font-family: {NARROW}; font-weight: 700; font-size: 12px; line-height: 1.2; color: {ORG}">{arrow}</div></div>')

sched = f"""
<div style="{at(0, 0, 336, f'height: 128px; background: {INK}')}"></div>
<div style="{at(2, 130, 336, f'height: 6px; background: {ORG}')}"></div>
<div style="{at(40, 40, 272, f'color: {CREAMINK}')}">
  <div style="font-family: {NARROW}; font-weight: 700; font-size: 14px; letter-spacing: 0.32em; color: {ORG}">TABLE 1</div>
  <div style="margin-top: 2px; font-family: {GOTH}; font-size: 50px; line-height: 0.92; letter-spacing: 0.03em">NEW YORK and MIAMI</div>
  <div style="margin-top: 4px; font-family: {NARROW}; font-weight: 600; font-size: 15px">Southbound read down. Northbound read up.</div>
</div>
<div style="{at(TX0, 150, 272, f'height: 58px; border-bottom: 2px solid {INK}')}">
  <div style="{at(0, 38, 110, f'font-family: {NARROW}; font-weight: 700; font-size: 13px; letter-spacing: 0.1em; color: {SOFT}')}">STOP</div>
  {colhead(C1 - TX0, 52, 'Trip 1', 'Daily', 'READ DOWN')}
  {colhead(C2 - TX0, 44, 'Trip 3', 'Daily', 'DOWN')}
  {colhead(C3 - TX0, 40, 'Trip 2', 'Daily', 'READ UP')}
</div>
{rows}
<img src="assets/pencil-ring.png" alt="" aria-hidden="true" style="{at(C1 - 82, TY0 - 8, 96, 'height: 42px; display: block; pointer-events: none')}">
<div style="{at(TX0, TY0 + 15 * RH + 6, 272, f'border-top: 2px solid {INK}; padding-top: 6px; font-size: 14px; line-height: 1.36')}">
  <div style="display: flex; justify-content: space-between"><span>Light face type <span style="font-family: {NARROW}">A.M.</span></span><span>Dark face type <b style="font-family: {NARROW}; font-weight: 700">P.M.</b></span></div>
  <div style="display: flex; gap: 6px; align-items: baseline"><span style="display: inline-block; width: 8px; height: 8px; background: {INK}; flex: none"></span><span>Meal stop, 30 minutes.</span></div>
  <div><b>Through coaches.</b> Running time 28 hours 30 minutes.</div>
</div>
"""

def dish(name, desc, price, note=None, top=15):
    n = f'<div style="margin-top: 3px; font-family: {NARROW}; font-style: italic; font-weight: 600; font-size: 15px; line-height: 1.2; color: {ORG}">{esc(note)}</div>' if note else ''
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; align-items: baseline; gap: 6px">'
            f'<span style="flex: none; font-family: {GOTH}; font-size: 30px; line-height: 1; letter-spacing: 0.015em">{esc(name)}</span>'
            f'<span style="flex: 1; min-width: 12px; border-bottom: 2px dotted {SOFT}; transform: translateY(-5px)"></span>'
            f'<span style="flex: none; font-family: {NARROW}; font-weight: 700; font-size: 20px">{price}</span></div>'
            f'<div style="margin-top: 3px; font-size: 16px; line-height: 1.32; color: {SOFT}; text-wrap: pretty">{esc(desc)}</div>{n}</div>')

def drink_grid(items):
    cells = ''.join(f'<div style="display: flex; justify-content: space-between; align-items: baseline; padding: 3px 0; border-bottom: 1px solid rgba(35,33,32,0.35)">'
                    f'<span style="font-weight: 700; font-size: 16px">{n}</span><span style="font-family: {NARROW}; font-weight: 700; font-size: 17px">{p}</span></div>' for n, p in items)
    return f'<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px">{cells}</div>'

def boxed(name, price, text, top=12):
    return (f'<div style="margin-top: {top}px; box-sizing: border-box; border: 2px solid {INK}; padding: 7px 12px 8px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline"><span style="font-family: {GOTH}; font-size: 25px; line-height: 1; letter-spacing: 0.015em">{name}</span>'
            f'<span style="font-family: {NARROW}; font-weight: 700; font-size: 20px">{price}</span></div>'
            f'<div style="margin-top: 3px; font-size: 16px; line-height: 1.3; color: {SOFT}; text-wrap: pretty">{text}</div></div>')

def panel_head(x, kick, title, sub):
    return f"""
<div style="{at(x - 24, 0, 320, f'height: 128px; background: {ORG}')}"></div>
<div style="{at(x - 26, 130, 320, f'height: 6px; background: {INK}')}"></div>
<div style="{at(x, 40, 272, f'color: {CREAMINK}')}">
  <div style="font-family: {NARROW}; font-weight: 700; font-size: 14px; letter-spacing: 0.32em; color: {INK}">{kick}</div>
  <div style="margin-top: 2px; font-family: {GOTH}; font-size: 50px; line-height: 0.92; letter-spacing: 0.03em; text-shadow: -2px -1.5px 0 rgba(35,33,32,0.55)">{title}</div>
  <div style="margin-top: 4px; font-family: {NARROW}; font-weight: 600; font-size: 15px">{sub}</div>
</div>"""

def urn(label, top=14):
    return (f'<div style="margin-top: {top}px; display: flex; align-items: center; gap: 8px">{kicker(label, INK, 13)}'
            f'<div style="flex: 1; height: 1.5px; background: {INK}"></div></div>')

ny = panel_head(392, 'MEAL STOP', 'NEW YORK', 'Terminal lunch counter. Open all night.') + f"""
<div style="{at(392, 142, 272)}">
  {dish('Ham and Swiss quarters', 'Leg ham and Swiss cheese on white bread spread with mustard butter, crusts off, cut in four and wrapped in wax paper.', '.65', 'Packed to take on board.', 6)}
  {dish('Cinnamon doughnut holes', 'Fried to order and rolled warm in spiced sugar, with a little pot of coffee custard for dunking.', '.40', 'Hot all night.')}
  {dish('Franks and beans', 'Sliced franks browned with onion, simmered in baked beans with molasses and mustard. Buttered toast.', '.85')}
  {urn('FROM THE URN')}
  <div style="margin-top: 2px">{drink_grid([('Coffee', '.15'), ('Hot tea', '.15'), ('Milk', '.20'), ('Cocoa', '.20')])}</div>
  {boxed('Box lunch for the ride', '.95', 'Two ham and Swiss quarters, an apple and a cookie, sacked to carry on board.')}
</div>
"""

fl = panel_head(744, 'MEAL STOPS', 'FLORIDA', 'Jacksonville and West Palm Beach.') + f"""
<div style="{at(744, 142, 272)}">
  {dish('Coconut fried shrimp', 'Butterflied with the tails on, dipped in egg, pressed into shredded coconut and crisp crumbs, then fried golden. Sweet red pepper sauce and lime.', '1.95', 'Fried to order.', 6)}
  {dish('Florida orange cake', 'Whole fruit simmered soft and ground, peel and all, then baked with eggs, sugar and ground almonds. Moist, and no flour.', '.35', 'Baked fresh each morning.')}
  {dish('Sunshine cooler', 'Coconut water, pineapple and fresh lime shaken frothy with a spoon of coconut cream, over ice with a pineapple wedge.', '.45', 'White rum on the side, .60. Riders 21 and over.')}
  {urn('FRESH SQUEEZED')}
  <div style="margin-top: 2px">{drink_grid([('Orange juice', '.25'), ('Grapefruit', '.25')])}</div>
  {boxed('Gift fruit shipped home', '4.50', 'Half bushel of oranges and grapefruit, boxed and sent to your door.')}
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
        "mm": [279.4, 215.9], "fonts": FONTS, "fams": ["League Gothic", "News Cycle", "Archivo Narrow"],
        "phone": {"disp": "'League Gothic',sans-serif", "title": "'League Gothic',sans-serif", "name": "'League Gothic',sans-serif",
                  "body": "'News Cycle',sans-serif", "price": "'Archivo Narrow',sans-serif", "note": "'Archivo Narrow',sans-serif"}}
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
