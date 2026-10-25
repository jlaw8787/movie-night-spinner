"""Builds the Liberty Island mess printout (Escape from New York, 1981, set in 1997).
The object: two pages of fanfold green-bar paper torn off the line printer at U.S. Police Force
Security Control on Liberty Island, the night watch mess menu run with the shift notices.
9.5 x 11 in continuous form (912 x 1056 px), half-inch tractor strips both sides, printed in one
ribbon black with double-strike for emphasis, a block-letter banner, a dot-matrix plot of the island,
a red rubber stamp and a ballpoint note from the watch. One side per page, no fold on the page.
Writes p1.html / p2.html (full pages), p1.body.html / p2.body.html, film.json and escape.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 912, 1056
L, R = 92, 820            # print area inside the tractor strips (strips end at 48 and 864)
PAPER = '#f6f4ec'
INK = 'rgba(38,36,48,0.93)'
INK2 = 'rgba(38,36,48,0.80)'
RED = '#b3392e'
PEN = '#22408f'
FONTS = 'family=VT323&family=Black+Ops+One&family=Reenie+Beanie'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
MONO = "'VT323', 'Courier New', monospace"
STAMP = "'Black Ops One', Impact, sans-serif"
HAND = "'Reenie Beanie', 'Comic Sans MS', cursive"
BOLD = 'text-shadow: 0.7px 0 0 rgba(38,36,48,0.85)'   # double-strike, the printer's bold
LH = 24
MAP = json.load(open(os.path.join(D, 'map_layout.json')))


def esc(s): return s.replace('&', '&amp;')


def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {extra}">{inner}</div>'


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.55; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; font-family: {MONO}; color: {INK}">'
            f'<img src="assets/paper-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; display: block">'
            f'{inner}{overlays(face)}</div>')


# ---------- banner letters, 5 x 7, each printed with its own letter, the way banner pages were ----------
GLYPH = {
    'M': ['M...M', 'MM.MM', 'M.M.M', 'M.M.M', 'M...M', 'M...M', 'M...M'],
    'E': ['EEEEE', 'E....', 'E....', 'EEEE.', 'E....', 'E....', 'EEEEE'],
    'S': ['.SSS.', 'S...S', 'S....', '.SSS.', '....S', 'S...S', '.SSS.'],
}


def banner(word, size=22, lh=20):
    rows = []
    for r in range(7):
        rows.append('&nbsp;'.join(GLYPH[c][r].replace('.', '&nbsp;') for c in word))
    return (f'<div style="font-family: {MONO}; font-size: {size}px; line-height: {lh}px; letter-spacing: 0; white-space: nowrap; {BOLD}">'
            + '<br>'.join(rows) + '</div>')


def rule(ch='=', n=80, size=24):
    return f'<div style="font-size: {size}px; line-height: {LH}px; white-space: nowrap; overflow: hidden; width: {R - L}px">{ch * n}</div>'


def header(page):
    return at(L, 48, R - L, f"""
  <div style="display: flex; justify-content: space-between; font-size: 22px; line-height: {LH}px; white-space: nowrap">
    <span>USPF SECURITY CONTROL / LIBERTY IS.</span><span>RUN 1997 / WATCH 3</span><span>PAGE {page:04d}</span></div>
  <div style="display: flex; justify-content: space-between; font-size: 22px; line-height: {LH}px; white-space: nowrap; color: {INK2}">
    <span>JOB MESSNITE&nbsp;&nbsp;FORM STD 9.5X11</span><span>COPY 1 OF 1</span></div>""")


def item(no, name, price, desc, note=None, top=0):
    n = (f'<div style="margin-top: 0; font-size: 24px; line-height: {LH}px; padding-left: 58px">** {esc(note)}</div>') if note else ''
    return f"""<div style="margin-top: {top}px">
  <div style="display: flex; align-items: baseline; gap: 10px; white-space: nowrap; height: 48px">
    <span style="flex: none; width: 48px; font-size: 24px; line-height: 48px">{no}</span>
    <span style="flex: none; font-size: 46px; line-height: 48px; letter-spacing: 0.06em; {BOLD}">{esc(name)}</span>
    <span style="flex: 1; min-width: 20px; overflow: hidden; font-size: 24px; line-height: 48px; color: {INK2}">{'.' * 90}</span>
    <span style="flex: none; font-size: 40px; line-height: 48px; {BOLD}">{price}</span></div>
  <div style="font-size: 24px; line-height: {LH}px; padding-left: 58px; text-wrap: pretty">{esc(desc)}</div>
  {n}</div>"""


def small(no, name, price, desc, top=0):
    return f"""<div style="margin-top: {top}px">
  <div style="display: flex; align-items: baseline; gap: 10px; white-space: nowrap; height: 24px">
    <span style="flex: none; width: 48px; font-size: 24px; line-height: 24px">{no}</span>
    <span style="flex: none; font-size: 30px; line-height: 24px; letter-spacing: 0.04em; {BOLD}">{esc(name)}</span>
    <span style="flex: 1; min-width: 20px; overflow: hidden; font-size: 24px; line-height: 24px; color: {INK2}">{'.' * 90}</span>
    <span style="flex: none; font-size: 30px; line-height: 24px; {BOLD}">{price}</span></div>
  <div style="font-size: 24px; line-height: {LH}px; padding-left: 58px">{esc(desc)}</div></div>"""


def section(letter, title, sub):
    return (f'<div style="display: flex; justify-content: space-between; align-items: baseline; white-space: nowrap; font-size: 24px; line-height: {LH}px">'
            f'<span style="{BOLD}">SECTION {letter}.&nbsp;&nbsp;{title}</span><span>{sub}</span></div>'
            f'<div style="font-size: 24px; line-height: {LH}px; white-space: nowrap; overflow: hidden">{"-" * 90}</div>')


# ================= PAGE 1 =================
p1 = header(1) + at(L, 120, 300, banner('MESS')) + at(400, 120, R - 400, f"""
  <div style="font-size: 46px; line-height: 48px; letter-spacing: 0.06em; {BOLD}">OFFICERS' MESS</div>
  <div style="font-size: 30px; line-height: 24px; letter-spacing: 0.04em; margin-top: 0">NIGHT WATCH MENU</div>
  <div style="font-size: 24px; line-height: {LH}px; margin-top: 24px">U.S. POLICE FORCE</div>
  <div style="font-size: 24px; line-height: {LH}px">LIBERTY ISLAND SECURITY CONTROL</div>""") + at(L, 264, R - L, rule('=')) + at(L, 288, R - L, f"""
  <div style="font-size: 24px; line-height: {LH}px; white-space: pre">*************************************************************************</div>
  <div style="font-size: 24px; line-height: {LH}px; {BOLD}">*&nbsp;&nbsp;THE RULES ARE SIMPLE.</div>
  <div style="font-size: 24px; line-height: {LH}px">*&nbsp;&nbsp;HOT LINE OPEN 2200 TO 0600. MUGS BACK TO THE RACK.</div>
  <div style="font-size: 24px; line-height: {LH}px">*&nbsp;&nbsp;NO FOOD OR DRINK AT THE CONSOLES. NONE ON THE WALL.</div>
  <div style="font-size: 24px; line-height: {LH}px; white-space: pre">*************************************************************************</div>""") + at(L, 432, R - L, section('A', 'TO START', 'FROM 2200') + item(
    '0101', 'WALL WATCH JERKY', '1.25',
    'Top round cut thin across the grain, soaked overnight in soy, Worcestershire, brown sugar, smoked paprika, red pepper flakes and garlic, then dried low in the oven until leathery but still bendy.',
    'PACKS FLAT IN A VEST POCKET.', 0) + item(
    '0102', 'TINS AND SALTINES', '.95',
    'Oil-packed sardines laid on crisp crackers with a squeeze of lemon, a drop of hot sauce and chopped parsley.',
    'SERVED ON THE LID, YOUR TIN.', 24)) + at(L, 768, R - L, section('B', 'HOT LINE', 'TILL 0600') + item(
    '0201', 'A NUMBER ONE STEW', '2.40',
    'Smoked sausage browned in the pot with onion, carrot and potato, then white beans, crushed tomatoes, smoked paprika and chicken stock. Cabbage goes in at the end. Ladled into a mug.',
    None, 0) + small('0202', 'RYE AND BUTTER', '.35', 'Two slices for the mug.', 24)) + at(L, 1008 - 24, R - L, f"""
  <div style="display: flex; justify-content: space-between; font-size: 22px; line-height: {LH}px; white-space: nowrap; color: {INK2}">
    <span>COFFEE FROM THE URN, ALL WATCH .25</span><span>CONTINUED PAGE 0002</span></div>""") + at(560, 852, 250, 'Hold a bowl for Hauk. R.',
    f'font-family: {HAND}; font-size: 34px; line-height: 30px; color: {PEN}; transform: rotate(-4deg); transform-origin: left top; white-space: nowrap')

# ================= PAGE 2 =================
MX, MY = 486, 168     # plot box position
mp = MAP
lab = lambda x, y, txt, w=200, align='left': at(MX + x, MY + y, w, txt, f'font-size: 22px; line-height: 22px; text-align: {align}; white-space: nowrap')
p2 = header(2) + at(L, 120, R - L, f"""
  <div style="display: flex; justify-content: space-between; white-space: nowrap; font-size: 24px; line-height: {LH}px">
    <span style="{BOLD}">PLOT 1.&nbsp;&nbsp;MANHATTAN ISLAND MAXIMUM SECURITY PENITENTIARY</span><span>EST. 1988</span></div>
  {rule('=')}""") + at(MX, MY, mp['w'], f'<img src="assets/plot-map.png" alt="Dot plot of Manhattan island" style="display: block; width: {mp["w"]}px; height: {mp["h"]}px">') \
    + lab(mp['liberty'][0] + 22, mp['liberty'][1] - 30, 'X SECURITY CONTROL<br>&nbsp;&nbsp;(THIS SITE)') \
    + lab(mp['bridge'][0] + 30, mp['bridge'][1] + 2, '69TH ST BRIDGE<br>MINED', 120) \
    + lab(mp['wall_w'][0] - 236, mp['wall_w'][1] - 60, '<span style="font-size: 22px">CONTAINMENT WALL<br>50 FT, FAR SHORES ..</span>', 200, 'right') \
    + at(L, 168, 370, section('C', 'SWEET', 'ANY HOUR') + item(
    '0301', 'RATION BAR', '.75',
    'Rolled oats, butter, golden syrup and brown sugar pressed into a pan and baked golden, spread with dark chocolate and finished with flaky salt. Cut in squares.',
    'POCKET SIZE, FOR CHOPPER CREWS.', 0).replace('font-size: 46px', 'font-size: 40px')) \
    + at(L, 504, 370, section('D', 'OFF WATCH', 'AFTER 0600') + item(
    '0401', 'WHITE LIGHTNING', '2.50',
    'Corn whiskey shaken hard with fresh lemon and sugar, poured over ice in a jelly jar.',
    'REFINED IN HOUSE. NO GASOLINE.', 0).replace('font-size: 46px', 'font-size: 40px')
    + small('0402', 'LEMONADE', '.40', 'Squeezed fresh. On duty, this.', 24)) \
    + at(L, 768, R - L, f"""
  {rule('-')}
  <div style="font-size: 24px; line-height: {LH}px; {BOLD}">TRANSFERS DUE, PROCESSING DECK</div>
  <div style="font-size: 24px; line-height: {LH}px; white-space: pre">  PLISSKEN, S.   EX LT, SPECIAL FORCES   FED RESERVE DEPOSITORY</div>
  <div style="font-size: 24px; line-height: {LH}px; white-space: pre">  STATUS: LIFE.  ONCE IN, NOBODY COMES OUT.</div>
  {rule('-')}
  <div style="font-size: 24px; line-height: {LH}px; text-align: center; margin-top: 24px">*** END OF RUN ***</div>""") \
    + at(560, 860, 260, 'Heard he was dead?', f'font-family: {HAND}; font-size: 36px; line-height: 30px; color: {PEN}; transform: rotate(-3deg); white-space: nowrap') \
    + at(600, 940, 200, f'<div style="border: 4px solid {RED}; border-radius: 4px; padding: 6px 10px 4px; text-align: center; color: {RED}; opacity: 0.8">'
         f'<div style="font-family: {STAMP}; font-size: 28px; line-height: 28px; letter-spacing: 0.06em">FILE COPY</div>'
         f'<div style="font-family: {STAMP}; font-size: 14px; line-height: 16px; letter-spacing: 0.12em; margin-top: 4px">SECURITY CONTROL</div></div>',
         'transform: rotate(-7deg)')

TITLES = {'p1': 'Officers mess printout, page 1', 'p2': 'Officers mess printout, page 2'}
for face, inner in (('p1', p1), ('p2', p2)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "escape", "fn": "fmtEscape", "faces": ["p1.html", "p2.html"], "names": ["Page 1", "Page 2"],
        "mm": [241.3, 279.4], "fonts": FONTS, "fams": ["VT323", "Black Ops One", "Reenie Beanie"],
        "phone": {"disp": "'VT323',monospace", "title": "'VT323',monospace", "name": "'VT323',monospace",
                  "body": "'VT323',monospace", "price": "'VT323',monospace", "note": "'Reenie Beanie',cursive"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Escape from New York (1981)": {
  "Cabbie's smoky chilli beef jerky": {"n": "Wall watch jerky", "d": "Top round cut thin across the grain, soaked overnight in soy, Worcestershire, brown sugar, smoked paprika, red pepper flakes and garlic, then dried low in the oven until leathery but still bendy.", "note": "Packs flat in a vest pocket."},
  "Survival tin sardines": {"n": "Tins and saltines", "d": "Oil-packed sardines laid on crisp crackers with a squeeze of lemon, a drop of hot sauce and chopped parsley.", "note": "Served on the lid, your tin."},
  "Scavenger's hobo stew": {"n": "A Number One stew", "d": "Smoked sausage browned in the pot with onion, carrot and potato, then white beans, crushed tomatoes, smoked paprika and chicken stock. Cabbage goes in at the end. Ladled into a mug.", "note": "Hold a bowl for Hauk."},
  "Ration-pack chocolate oat slice": {"n": "Ration bar", "d": "Rolled oats, butter, golden syrup and brown sugar pressed into a pan and baked golden, spread with dark chocolate and finished with flaky salt. Cut in squares.", "note": "Pocket size, for chopper crews."},
  "Brain's bathtub moonshine sour": {"n": "White lightning", "d": "Corn whiskey shaken hard with fresh lemon and sugar, poured over ice in a jelly jar.", "note": "Refined in house. No gasoline."}
}}
open(os.path.join(D, 'escape.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
