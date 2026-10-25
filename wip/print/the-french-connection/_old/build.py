"""Builds the surveillance report menu for The French Connection (1971).
The printed object: copy 2 (the green manifold sheet for the bureau file) of a two-page Narcotics
Bureau surveillance report, typed through carbon by the detectives on the stakeout. Page 1 is the
inside of the glass: the restaurant's window menu card, copied down from the sidewalk opposite.
Page 2 is the outside: the log, the observer's own expenses (coffee, doughnuts, a slice), a
ballpoint diagram of the street, remarks, distribution and signatures.
US Letter, 8.5 x 11 in, two faces, no fold.
Writes p1.html / p2.html, p1.body.html / p2.body.html, film.json and acrossglass.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
PAPER = '#dbe5cf'      # green manifold copy
FORM = '#1f2c24'       # the one printed form ink
RULE = 'rgba(31,44,36,0.85)'
CARB = '#34377c'       # faded violet-blue carbon
CARB_SH = 'text-shadow: 0 0 0.6px rgba(52,55,124,0.55)'
PEN = '#25336f'        # ballpoint
GREASE = '#b13a2c'     # red grease pencil
STAMP = '#8c2f3b'
FONTS = 'family=Archivo+Narrow:wght@400;600;700&family=Special+Elite&family=Kalam:wght@400;700'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
PR = "'Archivo Narrow', 'Arial Narrow', sans-serif"
TY = "'Special Elite', 'Courier New', monospace"
HD = "'Kalam', 'Comic Sans MS', cursive"


def esc(s): return s.replace('&', '&amp;')


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.55; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {PR}; color: {FORM}">{inner}{overlays(face)}</div>')


# ---------- printed form parts ----------
def lab(t, extra=''):
    return f'<div style="font-family: {PR}; font-weight: 600; font-size: 12px; line-height: 1; letter-spacing: 0.08em; color: {FORM}; {extra}">{t}</div>'


def typed(t, size=17, extra=''):
    return f'<div style="font-family: {TY}; font-size: {size}px; line-height: 1.3; color: {CARB}; {CARB_SH}; {extra}">{esc(t)}</div>'


def cell(x, y, w, h, label, value, size=17, vtop=24):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; box-sizing: border-box; border: 1px solid {RULE}; margin: 0 -1px -1px 0">'
            f'<div style="position: absolute; left: 7px; top: 6px">{lab(label)}</div>'
            f'<div style="position: absolute; left: 10px; top: {vtop}px; right: 6px; transform: rotate(-0.25deg)">{typed(value, size)}</div></div>')


def band(x, y, w, text, right=''):
    r = f'<span style="font-weight: 400; letter-spacing: 0.06em; font-size: 12px">{right}</span>' if right else ''
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: 26px; box-sizing: border-box; padding: 0 10px; background: {FORM}; color: {PAPER}; '
            f'display: flex; justify-content: space-between; align-items: center; font-family: {PR}; font-weight: 700; font-size: 15px; letter-spacing: 0.14em">'
            f'<span>{text}</span>{r}</div>')


def header(title_size, sub=None):
    s = (f'<div style="margin-top: 6px; font-family: {PR}; font-weight: 600; font-size: 15px; letter-spacing: 0.22em">{sub}</div>' if sub else '')
    return f"""
<div style="position: absolute; left: 48px; top: 48px; width: 720px; display: flex; justify-content: space-between">
  {lab('FORM N-27 (REV. 6-70)')}{lab('TYPE ALL ENTRIES. PRESS HARD, 4 COPIES.')}
</div>
<div style="position: absolute; left: 48px; top: 72px">
  <div style="font-family: {PR}; font-weight: 600; font-size: 15px; line-height: 1; letter-spacing: 0.34em">NARCOTICS BUREAU</div>
  <div style="margin-top: 5px; font-family: {PR}; font-weight: 700; font-size: {title_size}px; line-height: 0.95; letter-spacing: 0.035em">SURVEILLANCE REPORT</div>{s}
</div>
<div style="position: absolute; left: 584px; top: 72px; width: 184px; height: 66px; box-sizing: border-box; border: 2px solid {FORM}; padding: 6px 9px">
  <div style="font-family: {PR}; font-weight: 700; font-size: 22px; line-height: 1; letter-spacing: 0.06em">COPY 2</div>
  <div style="margin-top: 5px; font-family: {PR}; font-size: 12px; line-height: 1.2; letter-spacing: 0.04em">WHITE, ORIGINAL TO C.O.<br>GREEN, BUREAU FILE</div>
</div>
<div style="position: absolute; left: 48px; top: 150px; width: 720px; height: 4px; background: {FORM}"></div>
<div style="position: absolute; left: 48px; top: 157px; width: 720px; height: 1px; background: {FORM}"></div>
"""


DOTS = ' .' * 60


def entry(name, price, desc, note=None, top=16):
    n = (f'<div style="margin-top: 3px; font-family: {HD}; font-size: 18px; line-height: 1.15; color: {PEN}; transform: rotate(-0.6deg); transform-origin: left center">{esc(note)}</div>' if note else '')
    return f"""<div style="margin-top: {top}px">
  <div style="display: flex; align-items: baseline; gap: 4px">
    <span style="flex: none; font-family: {TY}; font-size: 22px; line-height: 1.1; color: {CARB}; {CARB_SH}; text-decoration: underline; text-decoration-thickness: 1.5px; text-underline-offset: 4px">{esc(name)}</span>
    <span style="flex: 1; min-width: 16px; overflow: hidden; white-space: nowrap; font-family: {TY}; font-size: 17px; color: {CARB}; opacity: 0.85">{DOTS}</span>
    <span style="flex: none; font-family: {TY}; font-size: 22px; color: {CARB}; {CARB_SH}">{price}</span></div>
  <div style="margin-top: 4px; font-family: {TY}; font-size: 17px; line-height: 1.36; color: {CARB}; {CARB_SH}; text-wrap: pretty">{esc(desc)}</div>{n}
</div>"""


def subhead(t, top=22):
    return f'<div style="margin-top: {top}px; font-family: {TY}; font-size: 17px; line-height: 1; letter-spacing: 0.32em; color: {CARB}; {CARB_SH}">{t}</div>'


# ================= PAGE 1: inside the glass =================
DISH = {
    'pate': ("PÂTÉ MAISON", "1.75", "Chicken livers seared pink and flamed with cognac, blended with soft butter, shallot and thyme, sealed under clarified butter. Cornichons and warm baguette."),
    'soup': ("SOUPE À L'OIGNON", "1.25", "Onions cooked down slowly to deep brown in beef broth, baked under a crouton and bubbling gruyère."),
    'steak': ("STEAK FRITES BÉARNAISE", "6.75", "Sirloin seared hard and rested. Warm tarragon and shallot butter sauce, hand-cut potatoes fried twice."),
    'creme': ("CRÈME CARAMEL", "1.25", "Vanilla custard baked slow in a water bath, chilled overnight and turned out under its own amber syrup."),
    'maur': ("MAURESQUE", "1.50", "Pastis and almond orgeat over ice, iced water poured in at the table until it clouds."),
    'vin': ("VIN ROUGE", "1.75 / 3.25", "Young Côtes du Rhône by the carafe, half or full."),
    'coffee': ("COFFEE AND CAKE DOUGHNUTS", ".35", "Drip, black, in a paper cup. Two warm rings rolled in cinnamon sugar."),
    'slice': ("SLICE, PLAIN", ".30", "Thin crust, tomato sauce, mozzarella, a shake of dried oregano. Folded and eaten standing."),
}

p1 = header(46) + f"""
<!-- grease pencil file number, top right -->
<div style="position: absolute; left: 404px; top: 48px; transform: rotate(-3deg); font-family: {HD}; font-weight: 700; font-size: 30px; line-height: 1; color: {GREASE}; opacity: 0.9">71-0114</div>

{cell(48, 170, 172, 54, 'CASE NO.', '71-0114')}
{cell(219, 170, 110, 54, 'YEAR', '1971')}
{cell(328, 170, 121, 54, 'TOUR', 'Day')}
{cell(448, 170, 121, 54, 'PAGE', '1 of 2')}
{cell(48, 223, 521, 78, 'SUBJECT(S)', 'CHARNIER, Alain. Code name FROG ONE. NICOLI, Pierre. Code name FROG TWO.', 17, 24)}
{cell(48, 300, 331, 54, 'OBSERVERS', 'Det. J. Doyle, Det. B. Russo')}
{cell(378, 300, 191, 54, 'WEATHER', 'Freezing')}
{cell(48, 353, 521, 54, 'LOCATION', 'Restaurant, East Side, Manhattan. Name on file.')}

<!-- photo box with the stapled print -->
<div style="position: absolute; left: 584px; top: 170px; width: 184px; height: 237px; box-sizing: border-box; border: 1px solid {RULE}">
  <div style="position: absolute; left: 7px; bottom: 8px">{lab('PHOTO ATTACHED')}</div>
</div>
<div style="position: absolute; left: 580px; top: 180px; width: 192px; height: 206px; transform: rotate(2.4deg); box-shadow: 1px 2px 3px rgba(30,40,30,0.35)">
  <img src="assets/photo-frogone.png" alt="Surveillance print of Frog One" style="position: absolute; left: 0; top: 0; width: 192px; height: 206px; display: block">
  <div style="position: absolute; left: 12px; top: 181px; font-family: {HD}; font-weight: 700; font-size: 17px; line-height: 1; color: {GREASE}; transform: rotate(-2deg)">FROG 1</div>
  <div style="position: absolute; left: 118px; top: 183px; font-family: {HD}; font-size: 14px; line-height: 1; color: {PEN}">shuttle</div>
</div>
<div style="position: absolute; left: 640px; top: 174px; width: 30px; height: 4px; background: #7d8580; border-radius: 1px; transform: rotate(-6deg); box-shadow: 0 1px 0 rgba(0,0,0,0.25)"></div>
<div style="position: absolute; left: 696px; top: 176px; width: 30px; height: 4px; background: #7d8580; border-radius: 1px; transform: rotate(-4deg); box-shadow: 0 1px 0 rgba(0,0,0,0.25)"></div>

{band(48, 424, 720, '1. PREMISES', 'ATTACH SKETCH ON PAGE 2')}

<div style="position: absolute; left: 50px; top: 462px; width: 716px; transform: rotate(-0.25deg); transform-origin: left top">
  {typed("Menu card posted in the front window. Copied down from the sidewalk opposite. Undersigned did not enter. Prices as posted:", 17, 'line-height: 1.36')}
  <div style="display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1fr); column-gap: 36px">
    <div>
      {subhead("HORS D'OEUVRE", 20)}
      {entry(*DISH['pate'])}
      {entry(*DISH['soup'])}
      {subhead("PLATS")}
      {entry(*DISH['steak'])}
    </div>
    <div>
      {subhead("DESSERT", 20)}
      {entry(*DISH['creme'])}
      {subhead("APÉRITIF ET VIN")}
      {entry(*DISH['maur'])}
      {entry(*DISH['vin'])}
      <div style="margin-top: 22px; font-family: {HD}; font-size: 21px; line-height: 1.15; color: {PEN}; transform: rotate(-2deg); transform-origin: left center">They had the works.<br>I had a slice. J.D.</div>
    </div>
  </div>
</div>

<div style="position: absolute; left: 48px; top: 988px; width: 720px; border-top: 1px solid {RULE}; padding-top: 6px; display: flex; justify-content: space-between; align-items: baseline">
  {lab('N-27. USE CONTINUATION SHEET AS NEEDED. DO NOT FOLD.', 'font-weight: 400')}
  {typed('(continued)', 16)}
</div>
"""

# ================= PAGE 2: outside the glass =================
def obs(letter, text, top=9):
    return (f'<div style="margin-top: {top}px; display: flex; gap: 12px">'
            f'<span style="flex: none; width: 24px; font-family: {TY}; font-size: 17px; line-height: 1.36; color: {CARB}; {CARB_SH}">{letter}.</span>'
            f'<span style="flex: 1; font-family: {TY}; font-size: 17px; line-height: 1.36; color: {CARB}; {CARB_SH}">{esc(text)}</span></div>')


p2 = header(36, 'CONTINUATION SHEET') + f"""
<div style="position: absolute; left: 404px; top: 48px; transform: rotate(-3deg); font-family: {HD}; font-weight: 700; font-size: 30px; line-height: 1; color: {GREASE}; opacity: 0.9">71-0114</div>
{cell(48, 170, 172, 54, 'CASE NO.', '71-0114')}
{cell(219, 170, 430, 54, 'SUBJECT(S)', 'FROG ONE, FROG TWO')}
{cell(648, 170, 121, 54, 'PAGE', '2 of 2')}

{band(48, 240, 720, '2. OBSERVATIONS')}
<div style="position: absolute; left: 50px; top: 270px; width: 716px; transform: rotate(-0.25deg); transform-origin: left top">
  {obs('a', 'Undersigned took up a position on the sidewalk opposite. Both subjects in plain view through the front window.', 2)}
  {obs('b', 'Subjects at table a long time, course after course.')}
  {obs('c', 'Undersigned ate standing up. Feet frozen.')}
  {obs('d', 'Later, FROG ONE on foot to the 42nd St. shuttle. Stepped on, stepped off, stepped back on.')}
  {obs('e', 'Subject waved from the shuttle. Contact lost.')}
  {obs('f', 'Surveillance to continue. Relief requested.')}
</div>

{band(48, 516, 404, '3. EXPENSES, OBSERVER')}
<div style="position: absolute; left: 50px; top: 544px; width: 396px; transform: rotate(-0.25deg); transform-origin: left top">
  {entry(*DISH['coffee'], top=10)}
  {entry(*DISH['slice'])}
  <div style="margin-top: 12px; border-top: 1px dashed {CARB}; padding-top: 6px; display: flex; justify-content: space-between; font-family: {TY}; font-size: 17px; color: {CARB}; {CARB_SH}">
    <span>TOTAL CLAIMED. No receipts.</span><span style="font-size: 22px">.65</span></div>
</div>

{band(468, 516, 300, '4. DIAGRAM', 'NOT TO SCALE')}
<div style="position: absolute; left: 468px; top: 541px; width: 300px; height: 275px; box-sizing: border-box; border: 1px solid {RULE}; border-top: none">
  <img src="assets/sketch.png" alt="Ballpoint sketch of the street" style="position: absolute; left: 0; top: 8px; width: 300px; height: 262px; display: block">
  <div style="position: absolute; left: 10px; top: 14px; font-family: {HD}; font-size: 15px; line-height: 1; color: {PEN}">restaurant</div>
  <div style="position: absolute; left: 132px; top: 14px; font-family: {HD}; font-size: 15px; line-height: 1; color: {PEN}">F1, F2</div>
  <div style="position: absolute; left: 100px; top: 84px; font-family: {HD}; font-size: 14px; line-height: 1; color: {PEN}">window</div>
  <div style="position: absolute; left: 104px; top: 124px; font-family: {HD}; font-size: 16px; line-height: 1; color: {PEN}">street</div>
  <div style="position: absolute; left: 34px; top: 196px; font-family: {HD}; font-size: 14px; line-height: 1; color: {PEN}">pizza</div>
  <div style="position: absolute; left: 176px; top: 196px; font-family: {HD}; font-size: 15px; line-height: 1; color: {PEN}">me</div>
  <div style="position: absolute; left: 248px; top: 228px; font-family: {HD}; font-size: 14px; line-height: 1; color: {PEN}">N</div>
</div>

{band(48, 834, 720, '5. REMARKS AND DISTRIBUTION')}
<div style="position: absolute; left: 50px; top: 866px; width: 420px; transform: rotate(-0.25deg); transform-origin: left top">
  {typed('Origin: S. Boca, big spender at the club.', 16, 'line-height: 1.32')}
  {typed('Records check, Poughkeepsie: nothing.', 16, 'line-height: 1.32; margin-top: 6px')}
</div>
<div style="position: absolute; left: 494px; top: 866px; width: 274px; transform: rotate(-0.25deg); transform-origin: left top">
  {typed('2 - Bureau file', 16, 'line-height: 1.32')}
  {typed('1 - W. Simonson', 16, 'line-height: 1.32')}
  {typed('1 - Fed. agents Mulderig, Klein', 16, 'line-height: 1.32')}
</div>

<div style="position: absolute; left: 48px; top: 960px; width: 720px; display: flex; gap: 24px">
  <div style="flex: 1; position: relative; border-top: 1px solid {FORM}; padding-top: 5px">{lab('REPORTING OFFICER')}
    <div style="position: absolute; left: 80px; top: -34px; font-family: {HD}; font-size: 26px; line-height: 1; white-space: nowrap; color: {PEN}; transform: rotate(-3deg)">J. Doyle</div></div>
  <div style="flex: 1; position: relative; border-top: 1px solid {FORM}; padding-top: 5px">{lab('SECOND OBSERVER')}
    <div style="position: absolute; left: 80px; top: -32px; font-family: {HD}; font-size: 24px; line-height: 1; white-space: nowrap; color: {PEN}; transform: rotate(-2deg)">B. Russo</div></div>
  <div style="flex: 1; position: relative; border-top: 1px solid {FORM}; padding-top: 5px">{lab('APPROVED, C.O.')}
    <div style="position: absolute; left: 140px; top: -32px; font-family: {HD}; font-weight: 700; font-size: 24px; line-height: 1; color: {PEN}; transform: rotate(-4deg)">W.S.</div></div>
</div>

<!-- rubber stamp -->
<div style="position: absolute; left: 604px; top: 322px; width: 150px; box-sizing: border-box; border: 2.5px solid {STAMP}; padding: 5px 8px; transform: rotate(-7deg); opacity: 0.72; color: {STAMP}; font-family: {PR}; font-weight: 700; text-align: left">
  <div style="font-size: 18px; letter-spacing: 0.2em; line-height: 1">INDEXED</div>
  <div style="margin-top: 4px; border-top: 1.5px solid {STAMP}; padding-top: 4px; font-size: 13px; letter-spacing: 0.12em; line-height: 1.25">FILED &nbsp;BY ____</div>
</div>

<!-- the lieutenant's note in the margin -->
<div style="position: absolute; left: 64px; top: 768px; width: 380px; transform: rotate(-2.5deg); font-family: {HD}; font-size: 21px; line-height: 1.15; color: {PEN}">Doyle, return the Santa suit. W.S.</div>
<div style="position: absolute; left: 48px; top: 992px; width: 720px; border-top: 1px solid {RULE}; padding-top: 6px; display: flex; justify-content: space-between">
  {lab('N-27. CONTINUATION. FILE WITH PAGE 1.', 'font-weight: 400')}{lab('END OF REPORT', 'font-weight: 400')}
</div>
"""

TITLES = {'p1': 'Surveillance report, page 1', 'p2': 'Surveillance report, page 2'}
for face, inner in (('p1', p1), ('p2', p2)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{TITLES[face]}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "acrossglass", "fn": "fmtAcrossGlass", "faces": ["p1.html", "p2.html"], "names": ["Page 1", "Page 2"],
        "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Archivo Narrow", "Special Elite", "Kalam"],
        "phone": {"disp": "'Archivo Narrow',sans-serif", "title": "'Archivo Narrow',sans-serif", "name": "'Special Elite',monospace",
                  "body": "'Special Elite',monospace", "price": "'Special Elite',monospace", "note": "'Kalam',cursive"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"The French Connection (1971)": {
    "Frog One's bistro pâté": {"n": "Pâté maison", "d": DISH['pate'][2], "note": "Copied off the window card."},
    "Stakeout coffee and doughnuts": {"n": "Coffee and cake doughnuts", "d": DISH['coffee'][2], "note": "Claimed on expenses, 35 cents."},
    "Charnier's steak frites": {"n": "Steak frites béarnaise", "d": DISH['steak'][2], "note": "Seen through the front window."},
    "Crème caramel": {"n": "Crème caramel", "d": DISH['creme'][2], "note": "They stayed for dessert."},
    "Marseille mauresque": {"n": "Mauresque", "d": DISH['maur'][2], "note": "Goes cloudy with the water."},
}}
open(os.path.join(D, 'acrossglass.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
