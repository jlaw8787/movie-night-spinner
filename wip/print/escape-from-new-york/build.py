"""Builds the Liberty Island mess printout (Escape from New York, 1981, set in 1997).
The object: two pages of fanfold green-bar paper torn off the line printer at U.S. Police Force
Security Control on Liberty Island, the night watch mess menu run with the shift notices.
9.5 x 11 in continuous form (912 x 1056 px), half-inch tractor strips both sides, printed in one
ribbon black on a 6 lines-to-the-inch style grid (24 px rows), double-strike for emphasis, wobbly
hammer impression per character, a block-letter banner, a dot-matrix plot of the island, a red
rubber stamp and ballpoint notes from the watch. One side per page; the fanfold perforation is the
page edge, so nothing sits on a fold.
Writes p1.html / p2.html (full pages), p1.body.html / p2.body.html, film.json and escape.labels.json."""
import os, json, random
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 912, 1056
L, R = 92, 820            # print area inside the tractor strips (strips end at 48 and 864)
TOP = 52
PAPER = '#f6f4ec'
INK = 'rgba(38,36,48,0.93)'
RED = '#b3392e'
PEN = '#22408f'
FONTS = 'family=VT323&family=Reenie+Beanie'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
MONO = "'VT323', 'Courier New', monospace"
HAND = "'Reenie Beanie', 'Comic Sans MS', cursive"
BOLD = 'text-shadow: 0.75px 0 0 rgba(38,36,48,0.8)'   # double-strike, the printer's bold
LH = 24
MAP = json.load(open(os.path.join(D, 'map_layout.json')))
rnd = random.Random(1997)


def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;')


def lp(text):
    """Line-printer impression: each hammer strikes a hair high or low and a little light or dark."""
    out = []
    for ch in text:
        if ch == ' ':
            out.append(' ')
            continue
        dy = rnd.choice((0, 0, 0, 0.5, -0.5, 0.8, -0.4))
        op = rnd.choice((1, 1, 1, 0.9, 0.82, 0.95))
        out.append(f'<span style="position: relative; top: {dy}px; opacity: {op}">{esc(ch)}</span>')
    return ''.join(out)


def at(x, y, w, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {extra}">{inner}</div>'


def row(y):
    return TOP + y * LH


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.55; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; font-family: {MONO}; color: {INK}">'
            f'<img src="assets/paper-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; display: block">'
            f'{inner}{overlays(face)}</div>')


def line(text, size=24, extra='', bold=False):
    b = BOLD if bold else ''
    return f'<div style="font-size: {size}px; line-height: {LH}px; white-space: pre; {b} {extra}">{lp(text)}</div>'


def para(text, indent=58, size=24):
    return f'<div style="font-size: {size}px; line-height: {LH}px; padding-left: {indent}px">{lp(text)}</div>'


def chars(ch, w):
    return f'<div style="font-size: 24px; line-height: {LH}px; white-space: nowrap; overflow: hidden; width: {w}px">{ch * 120}</div>'


# ---------- banner letters, 7 x 9, each printed with its own letter the way banner pages were ----------
GLYPH = {
    'M': ['M.....M', 'MM...MM', 'M.M.M.M', 'M..M..M', 'M.....M', 'M.....M', 'M.....M', 'M.....M', 'M.....M'],
    'E': ['EEEEEEE', 'E......', 'E......', 'E......', 'EEEEEE.', 'E......', 'E......', 'E......', 'EEEEEEE'],
    'S': ['.SSSSS.', 'S.....S', 'S......', 'S......', '.SSSSS.', '......S', '......S', 'S.....S', '.SSSSS.'],
}


def banner(word, size=24, lh=16):
    rows = []
    for r in range(9):
        rows.append(lp('  '.join(GLYPH[c][r].replace('.', ' ') for c in word)))
    return (f'<div style="font-family: {MONO}; font-size: {size}px; line-height: {lh}px; white-space: pre; {BOLD}">'
            + '<br>'.join(rows) + '</div>')


def header(page):
    return at(L, row(0), R - L, f"""
  <div style="display: flex; justify-content: space-between; font-size: 24px; line-height: {LH}px; white-space: pre">
    <span>{lp('USPF SECURITY CONTROL / LIBERTY IS.')}</span><span>{lp('RUN 1997 WATCH 3')}</span><span>{lp('PAGE %04d' % page)}</span></div>
  <div style="display: flex; justify-content: space-between; font-size: 24px; line-height: {LH}px; white-space: pre">
    <span>{lp('JOB MESSNITE   FORM STD 9.5X11   LP2')}</span><span>{lp('COPY 1 OF 1')}</span></div>""")


def item(no, name, price, desc, note=None, nsize=46, psize=40):
    n = para('** ' + note) if note else ''
    return f"""<div>
  <div style="display: flex; align-items: baseline; gap: 10px; white-space: pre; height: 48px">
    <span style="flex: none; width: 48px; font-size: 24px; line-height: 48px">{lp(no)}</span>
    <span style="flex: none; font-size: {nsize}px; line-height: 48px; letter-spacing: 0.06em; {BOLD}">{lp(name)}</span>
    <span style="flex: 1; min-width: 16px; overflow: hidden; font-size: 24px; line-height: 48px">{'.' * 90}</span>
    <span style="flex: none; font-size: {psize}px; line-height: 48px; {BOLD}">{lp(price)}</span></div>
  {para(desc)}{n}</div>"""


def small(no, name, price, desc=None):
    d = para(desc) if desc else ''
    return f"""<div>
  <div style="display: flex; align-items: baseline; gap: 10px; white-space: pre; height: 24px">
    <span style="flex: none; width: 48px; font-size: 24px; line-height: 24px">{lp(no)}</span>
    <span style="flex: none; font-size: 30px; line-height: 24px; letter-spacing: 0.04em; {BOLD}">{lp(name)}</span>
    <span style="flex: 1; min-width: 16px; overflow: hidden; font-size: 24px; line-height: 24px">{'.' * 90}</span>
    <span style="flex: none; font-size: 30px; line-height: 24px; {BOLD}">{lp(price)}</span></div>
  {d}</div>"""


def section(letter, title, sub, w):
    return (f'<div style="display: flex; justify-content: space-between; align-items: baseline; white-space: pre; font-size: 24px; line-height: {LH}px">'
            f'<span style="{BOLD}">{lp("SECTION " + letter + ".  " + title)}</span><span>{lp(sub)}</span></div>' + chars('-', w))


BLANK = f'<div style="height: {LH}px"></div>'


def pen_row(x, text, size=34, rot=-3):
    return (f'<div style="position: relative; height: {LH}px"><div style="position: absolute; left: {x}px; top: -4px; '
            f'font-family: {HAND}; font-size: {size}px; line-height: 30px; color: {PEN}; transform: rotate({rot}deg); white-space: nowrap">{esc(text)}</div></div>')


def pen(x, y, text, size=34, rot=-4):
    return at(x, y, 400, esc(text), f'font-family: {HAND}; font-size: {size}px; line-height: 30px; color: {PEN}; transform: rotate({rot}deg); transform-origin: left center; white-space: nowrap')


# ================= PAGE 1 =================
W = R - L
p1 = header(1) \
    + at(L, row(2), 360, banner('MESS')) \
    + at(468, row(2) + 12, R - 468, f"""
  <div style="font-size: 46px; line-height: 48px; letter-spacing: 0.05em; white-space: pre; {BOLD}">{lp("OFFICERS' MESS")}</div>
  {line('NIGHT WATCH MENU', 30, 'letter-spacing: 0.04em', True)}
  {line('U.S. POLICE FORCE')}
  {line('LIBERTY ISLAND SECURITY CONTROL')}""") \
    + at(L, row(8), W, chars('=', W) + f"""
  {line('*' * 76)}
  {line('*  THE RULES ARE SIMPLE.', bold=True)}
  {line('*  HOT LINE OPEN 2200 TO 0600. MUGS BACK TO THE RACK, PLEASE.')}
  {line('*  NO FOOD OR DRINK AT THE CONSOLES, THE PAD OR ON THE WALL.')}
  {line('*' * 76)}""") \
    + at(L, row(14), W, section('A', 'TO START', 'FROM 2200', W)
         + item('0101', 'WALL WATCH JERKY', '1.25',
                'Top round cut thin across the grain, soaked overnight in soy, Worcestershire, brown sugar, smoked paprika, red pepper flakes and garlic, then dried low in the oven until leathery but still bendy.',
                'PACKS FLAT IN A VEST POCKET.')
         + BLANK
         + item('0102', 'TINS AND SALTINES', '.95',
                'Oil-packed sardines laid on crisp crackers with a squeeze of lemon, a drop of hot sauce and chopped parsley.',
                'EAT THEM OFF THE LID.')
         + BLANK
         + section('B', 'HOT LINE', 'TILL 0600', W)
         + item('0201', 'A NUMBER ONE STEW', '2.40',
                'Smoked sausage browned in the pot with onion, carrot and potato, then white beans, crushed tomatoes, smoked paprika and chicken stock. Cabbage goes in at the end. Ladled into a mug.')
         + pen_row(330, 'Hold a bowl for Hauk. R.')
         + small('0202', 'RYE AND BUTTER', '.35', 'Two thick slices, for the mug.')
         + f'<div style="display: flex; justify-content: space-between; white-space: pre; font-size: 24px; line-height: {LH}px">'
           f'<span>{lp("COFFEE AND TEA: SEE PAGE 0002")}</span><span>{lp("CONTINUED PAGE 0002")}</span></div>') \

# ================= PAGE 2 =================
MX, MY = 486, row(4) + 8
CW = 380                  # left column width
mp = MAP


def lab(x, y, txt, w=200, align='left'):
    return at(MX + x, MY + y, w, txt, f'font-size: 22px; line-height: 22px; text-align: {align}; white-space: pre')


p2 = header(2) + at(L, row(2), W, f"""
  <div style="display: flex; justify-content: space-between; white-space: pre; font-size: 24px; line-height: {LH}px">
    <span style="{BOLD}">{lp('MANHATTAN ISLAND MAXIMUM SECURITY PENITENTIARY')}</span><span>{lp('EST. 1988')}</span></div>
  {chars('=', W)}""") \
    + at(MX, MY, mp['w'], f'<img src="assets/plot-map.png" alt="Dot plot of Manhattan island" style="display: block; width: {mp["w"]}px; height: {mp["h"]}px">') \
    + lab(14, 4, lp('PLOT 1 OF 1') + '<br>' + lp('NOT TO SCALE')) \
    + lab(4, 206, lp('CONTAINMENT') + '<br>' + lp('WALL, 50 FT') + '<br>' + lp('----------->'), 130) \
    + lab(mp['bridge'][0] + 34, mp['bridge'][1] - 6, lp('69TH ST') + '<br>' + lp('BRIDGE') + '<br>' + lp('MINED'), 100) \
    + lab(mp['liberty'][0] + 26, mp['liberty'][1] - 12, lp('<-- SECURITY CONTROL'), 240) \
    + lab(206, 404, lp('ALL BRIDGES') + '<br>' + lp('AND WATERWAYS') + '<br>' + lp('MINED'), 124) \
    + at(L, row(4), CW, section('C', 'SWEET', 'ANY HOUR', CW)
         + item('0301', 'RATION BAR', '.75',
                'Rolled oats, butter, golden syrup and brown sugar pressed into a pan and baked, then spread with dark chocolate and flaky salt.',
                'FOR THE CHOPPER CREWS.', 40, 36)
         + BLANK
         + section('D', 'OFF WATCH', 'AFTER 0600', CW)
         + item('0401', 'WHITE LIGHTNING', '2.50',
                'Corn whiskey shaken hard with fresh lemon and sugar, poured over ice in a jelly jar.',
                'REFINED IN HOUSE. NO GASOLINE.', 32, 32)
         + BLANK
         + small('0402', 'LEMONADE', '.40')
         + small('0403', 'COFFEE, URN', '.25')
         + small('0404', 'HOT TEA', '.25')) \
    + at(L, row(27), W, chars('-', W)
         + line('TRANSFERS DUE, PROCESSING DECK', bold=True)
         + line('  PLISSKEN, S.    EX LT, SPECIAL FORCES    FEDERAL RESERVE DEPOSITORY')
         + line('  SENTENCE: LIFE, MANHATTAN.   ONCE IN, NOBODY COMES OUT.')
         + pen_row(380, 'Heard he was dead?', 36, -3)
         + chars('-', W)
         + line('REPORT ANY CRAFT ON THE WATER TO THE DUTY OFFICER AT ONCE.')
         + BLANK
         + line('*** END OF RUN ***')
         + line('LINES 0079   FORMS 0002   LP2 READY')) \
    + at(588, row(34) + 6, 232, '<img src="assets/stamp-file-copy.png" alt="FILE COPY, SECURITY CONTROL stamp" style="display: block; width: 232px; height: 100px">')

TITLES = {'p1': 'Officers mess printout, page 1', 'p2': 'Officers mess printout, page 2'}
for face, inner in (('p1', p1), ('p2', p2)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "escape", "fn": "fmtEscape", "faces": ["p1.html", "p2.html"], "names": ["Page 1", "Page 2"],
        "mm": [241.3, 279.4], "fonts": FONTS, "fams": ["VT323", "Reenie Beanie"],
        "phone": {"disp": "'VT323',monospace", "title": "'VT323',monospace", "name": "'VT323',monospace",
                  "body": "'VT323',monospace", "price": "'VT323',monospace", "note": "'VT323',monospace"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Escape from New York (1981)": {
  "Cabbie's smoky chilli beef jerky": {"n": "Wall watch jerky", "d": "Top round cut thin across the grain, soaked overnight in soy, Worcestershire, brown sugar, smoked paprika, red pepper flakes and garlic, then dried low in the oven until leathery but still bendy.", "note": "Packs flat in a vest pocket."},
  "Survival tin sardines": {"n": "Tins and saltines", "d": "Oil-packed sardines laid on crisp crackers with a squeeze of lemon, a drop of hot sauce and chopped parsley.", "note": "Eat them off the lid."},
  "Scavenger's hobo stew": {"n": "A Number One stew", "d": "Smoked sausage browned in the pot with onion, carrot and potato, then white beans, crushed tomatoes, smoked paprika and chicken stock. Cabbage goes in at the end. Ladled into a mug.", "note": "Hold a bowl for Hauk."},
  "Ration-pack chocolate oat slice": {"n": "Ration bar", "d": "Rolled oats, butter, golden syrup and brown sugar pressed into a pan and baked until golden, spread with dark chocolate, finished with flaky salt. Cut in squares.", "note": "Pocket size, for chopper crews."},
  "Brain's bathtub moonshine sour": {"n": "White lightning", "d": "Corn whiskey shaken hard with fresh lemon and sugar, poured over ice in a jelly jar.", "note": "Refined in house. No gasoline."}
}}
open(os.path.join(D, 'escape.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
