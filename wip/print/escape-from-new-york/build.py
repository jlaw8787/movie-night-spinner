"""Builds the Liberty Island mess printout (Escape from New York, 1981, set in 1997).
The object: two pages of fanfold green-bar paper torn off the line printer at U.S. Police Force
Security Control on Liberty Island, the night watch mess menu run with the shift notices.
9.5 x 11 in continuous form (912 x 1056 px), half-inch tractor strips both sides, torn at the
perforations top and bottom. Every printed character is struck as 9-pin ribbon dots by printer.py
(10 characters to the inch, 4 lines to the inch here, emphasized and expanded modes), so the print
layer is a painted PNG per page. Over it: a red rubber stamp and ballpoint notes from the watch.
One side per page; the perforation is the page edge, so nothing sits on a fold.
Writes assets/print-p1.png, assets/print-p2.png, p1.html / p2.html, p1.body.html / p2.body.html,
film.json and escape.labels.json."""
import os, json, textwrap
from printer import Sheet, CELL

D = os.path.dirname(os.path.abspath(__file__))
A = os.path.join(D, 'assets')
FW, FH = 912, 1056
L, R = 92, 820            # print area inside the tractor strips (strips end at 48 and 864)
TOP, LH = 52, 24          # print rows
COLS = 75
PAPER = '#f6f4ec'
PEN = '#22408f'
FONTS = 'family=VT323&family=Reenie+Beanie'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
HAND = "'Reenie Beanie', 'Comic Sans MS', cursive"
MAP = json.load(open(os.path.join(D, 'map_layout.json')))
OFF1, OFF2 = 5, 9         # cap-top offset inside a 24 px row (single height) and a 48 px row (double)


def y(r): return TOP + r * LH


class Page:
    def __init__(self, seed):
        self.s = Sheet(FW, FH, seed)
        self.alt = []

    def t(self, x, r, s, sx=1, bold=False, right=None):
        """single-height text on row r at x (or right-aligned to `right`)"""
        if right is not None:
            x = right - len(s) * CELL * sx
        self.s.text(x, y(r) + OFF1, s, sx, 1, bold)
        self.alt.append(s)

    def lr(self, r, left, right, bold=False, x0=L, x1=R):
        self.t(x0, r, left, bold=bold)
        if right:
            self.t(0, r, right, right=x1)

    def rule(self, r, ch, x0=L, x1=R):
        n = int((x1 - x0) / CELL)
        self.s.text(x0, y(r) + OFF1, ch * n)

    def para(self, r, text, indent, width, x0=L):
        lines = textwrap.wrap(text, width)
        for i, ln in enumerate(lines):
            self.t(x0 + indent * CELL, r + i, ln)
        return r + len(lines)

    def item(self, r, no, name, price, desc, note, x0=L, x1=R):
        """dish: number, double-wide double-high emphasized name, dot leader, price; then the description"""
        top = y(r) + OFF2
        self.s.text(x0, y(r) + 14 + OFF2, no)
        nx = x0 + 5 * CELL
        end = self.s.text(nx, top, name, 2, 2, True)
        px = x1 - len(price) * CELL * 2
        self.s.text(px, top, price, 2, 2, True)
        nd = int((px - end - CELL * 1.5) / CELL)
        if nd > 0:
            self.s.text(px - nd * CELL - CELL * 0.75, top + 14, '.' * nd)
        self.alt.append(f'{name} {price}')
        width = int((x1 - x0) / CELL) - 5
        r = self.para(r + 2, desc, 5, width, x0)
        if note:
            self.t(x0 + 5 * CELL, r, '** ' + note)
            r += 1
        return r

    def small(self, r, no, name, price, desc=None, x0=L, x1=R):
        """side or drink: expanded (double-wide) emphasized name on one row"""
        top = y(r) + OFF1
        self.s.text(x0, top, no)
        end = self.s.text(x0 + 5 * CELL, top, name, 2, 1, True)
        px = x1 - len(price) * CELL * 2
        self.s.text(px, top, price, 2, 1, True)
        nd = int((px - end - CELL * 1.5) / CELL)
        if nd > 0:
            self.s.text(px - nd * CELL - CELL * 0.75, top, '.' * nd)
        self.alt.append(f'{name} {price}')
        r += 1
        if desc:
            r = self.para(r, desc, 5, int((x1 - x0) / CELL) - 5, x0)
        return r

    def section(self, r, letter, title, sub, x0=L, x1=R):
        self.lr(r, f'SECTION {letter}.  {title}', sub, True, x0, x1)
        self.rule(r + 1, '-', x0, x1)
        return r + 2

    def header(self, page):
        self.t(L, 0, 'USPF SECURITY CONTROL / LIBERTY IS.')
        mid = 'RUN 1997 WATCH 3'
        self.t(L + 44 * CELL, 0, mid)
        self.t(0, 0, f'PAGE {page:04d}', right=R)
        self.lr(1, 'JOB MESSNITE   FORM STD 9.5X11   LP2', 'COPY 1 OF 1')


# ---------- banner letters, 7 x 9, each printed with its own letter the way banner pages were ----------
GLYPH = {
    'M': ['M.....M', 'MM...MM', 'M.M.M.M', 'M..M..M', 'M.....M', 'M.....M', 'M.....M', 'M.....M', 'M.....M'],
    'E': ['EEEEEEE', 'E......', 'E......', 'E......', 'EEEEEE.', 'E......', 'E......', 'E......', 'EEEEEEE'],
    'S': ['.SSSSS.', 'S.....S', 'S......', 'S......', '.SSSSS.', '......S', '......S', 'S.....S', '.SSSSS.'],
}


def banner(pg, word, x, y0, pitch=15.5):
    for ri in range(9):
        line = '  '.join(GLYPH[c][ri].replace('.', ' ') for c in word)
        pg.s.text(x, y0 + ri * pitch, line, 1, 1, True)


# ================= PAGE 1 =================
p1 = Page(1)
p1.header(1)
banner(p1, 'MESS', L, y(2) + 4)
TX = 468
p1.s.text(TX, y(2) + 12 + OFF2 - 9, "OFFICERS' MESS", 2, 2, True)
p1.s.text(TX, y(4) + 12 + OFF1, 'NIGHT WATCH MENU', 2, 1, True)
p1.s.text(TX, y(5) + 12 + OFF1, 'U.S. POLICE FORCE')
p1.s.text(TX, y(6) + 12 + OFF1, 'LIBERTY ISLAND SECURITY CONTROL')
p1.alt += ["OFFICERS' MESS, NIGHT WATCH MENU, U.S. POLICE FORCE, LIBERTY ISLAND SECURITY CONTROL"]
p1.rule(8, '=')
p1.rule(9, '*')
p1.t(L, 10, '*  THE RULES ARE SIMPLE.', bold=True)
p1.t(L, 11, '*  HOT LINE OPEN 2200 TO 0600. MUGS BACK TO THE RACK, PLEASE.')
p1.t(L, 12, '*  NO FOOD OR DRINK AT THE CONSOLES, THE PAD OR ON THE WALL.')
p1.rule(13, '*')
r = p1.section(14, 'A', 'TO START', 'FROM 2200')
r = p1.item(r, '0101', 'WALL WATCH JERKY', '1.25',
            'Top round cut thin across the grain, soaked overnight in soy, Worcestershire, brown sugar, smoked paprika, red pepper flakes and garlic, then dried low in the oven until leathery but still bendy.',
            'PACKS FLAT IN A VEST POCKET.')
r = p1.item(r + 1, '0102', 'TINS AND SALTINES', '.95',
            'Oil-packed sardines laid on crisp crackers with a squeeze of lemon, a drop of hot sauce and chopped parsley.',
            'EAT THEM OFF THE LID.')
r = p1.section(r + 1, 'B', 'HOT LINE', 'TILL 0600')
r = p1.item(r, '0201', 'A NUMBER ONE STEW', '2.40',
            'Smoked sausage browned in the pot with onion, carrot and potato, then white beans, crushed tomatoes, smoked paprika and chicken stock. Cabbage goes in at the end. Ladled into a mug.',
            None)
PEN1 = y(r)
r = p1.small(r + 1, '0202', 'RYE AND BUTTER', '.35', 'Two thick slices, for the mug.')
p1.lr(39, 'COFFEE AND TEA: SEE PAGE 0002', 'CONTINUED PAGE 0002')
assert r <= 39, r
p1.s.save(os.path.join(A, 'print-p1.png'))

# ================= PAGE 2 =================
p2 = Page(2)
p2.header(2)
p2.lr(2, 'MANHATTAN ISLAND MAXIMUM SECURITY PENITENTIARY', 'EST. 1988', True)
p2.rule(3, '=')
MX, MY = 524, y(4) + 8
CR = L + 46 * CELL        # left column right edge
r = p2.section(4, 'C', 'SWEET', 'ANY HOUR', L, CR)
r = p2.item(r, '0301', 'RATION BAR', '.75',
            'Rolled oats, butter, golden syrup and brown sugar pressed into a pan and baked, then spread with dark chocolate and flaky salt.',
            'FOR THE CHOPPER CREWS.', L, CR)
r = p2.section(r + 1, 'D', 'OFF WATCH', 'AFTER 0600', L, CR)
r = p2.item(r, '0401', 'WHITE LIGHTNING', '2.50',
            'Corn whiskey shaken hard with fresh lemon and sugar, poured over ice in a jelly jar.',
            'REFINED IN HOUSE. NO GASOLINE.', L, CR)
r = p2.small(r + 1, '0402', 'LEMONADE', '.40', None, L, CR)
r = p2.small(r, '0403', 'COFFEE, URN', '.25', None, L, CR)
r = p2.small(r, '0404', 'HOT TEA', '.25', None, L, CR)
assert r <= 26, r
# map labels, struck by the same printer
mp = MAP
def lab(mx, my, lines):
    for i, s in enumerate(lines):
        p2.s.text(MX + mx, MY + my + i * 22, s)
    p2.alt.append(' '.join(lines))
lab(46, 8, ['CONTAINMENT', 'WALL, 50 FT ->'])
lab(mp['bridge'][0] + 30, mp['bridge'][1] - 4, ['69TH ST', 'BRIDGE', 'MINED'])
lab(mp['liberty'][0] + 24, mp['liberty'][1] - 2, ['<-- SECURITY CONTROL'])
p2.rule(26, '-')
p2.t(L, 27, 'TRANSFERS DUE, PROCESSING DECK', bold=True)
p2.t(L, 28, '  PLISSKEN, S.    EX LT, SPECIAL FORCES    FEDERAL RESERVE DEPOSITORY')
p2.t(L, 29, '  SENTENCE: LIFE, MANHATTAN.   ONCE IN, NOBODY COMES OUT.')
PEN2 = y(30)
p2.rule(31, '-')
p2.t(L, 32, 'PERIMETER: ALL BRIDGES AND WATERWAYS MINED. REPORT ANY CRAFT AT ONCE.')
p2.t(L, 34, 'GALLEY STOCK, END OF WATCH 2', bold=True)
p2.t(L, 35, '  S-11  SARDINES, TINS ............ 48')
p2.t(L, 36, '  S-12  SALTINES, CASES ............ 6')
p2.t(L, 37, '  S-20  TOP ROUND, LB ............. 30')
p2.t(L, 38, '  S-31  CORN WHISKEY, QT ... 4 LOCKED')
p2.t(L, 39, '*** END OF RUN ***   LINES 0090   FORMS 0002')
p2.s.save(os.path.join(A, 'print-p2.png'))


# ================= HTML =================
def esc(s): return s.replace('&', '&amp;').replace('<', '&lt;').replace('"', '&quot;')


def at(x, yy, inner, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {yy}px; {extra}">{inner}</div>'


def pen(x, yy, text, size=34, rot=-3):
    return at(x, yy, esc(text), f'font-family: {HAND}; font-size: {size}px; line-height: 30px; color: {PEN}; transform: rotate({rot}deg); white-space: nowrap')


def root(face, inner, alt):
    gw = round(FH * 2246 / 1588)
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; color: #24222e">'
            f'<img src="assets/paper-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; display: block">'
            f'<img src="assets/print-{face}.png" alt="{esc(alt)}" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; display: block">'
            f'{inner}'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.55; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block"></div>')


faces = {
    'p1': root('p1', pen(520, PEN1 - 4, 'Hold a bowl for Hauk. R.'), '. '.join(p1.alt)),
    'p2': root('p2', at(MX, MY, f'<img src="assets/plot-map.png" alt="Dot plot of Manhattan island, the wall, the 69th Street bridge and Liberty Island" style="display: block; width: {MAP["w"]}px; height: {MAP["h"]}px">')
               + pen(470, PEN2 - 4, 'Heard he was dead?', 36, -3)
               + at(566, y(34) - 4, '<img src="assets/stamp-file-copy.png" alt="FILE COPY, SECURITY CONTROL stamp" style="display: block; width: 250px; height: 120px">'),
               '. '.join(p2.alt)),
}
TITLES = {'p1': 'Officers mess printout, page 1', 'p2': 'Officers mess printout, page 2'}
for face, body in faces.items():
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{TITLES[face]}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "escape", "fn": "fmtEscape", "faces": ["p1.html", "p2.html"], "names": ["Page 1", "Page 2"],
        "mm": [241.3, 279.4], "fonts": FONTS, "fams": ["VT323", "Reenie Beanie"],
        "phone": {"disp": "'VT323',monospace", "title": "'VT323',monospace", "name": "'VT323',monospace",
                  "body": "'VT323',monospace", "price": "'VT323',monospace", "note": "'VT323',monospace"},
        "note": "Printed text on the faces is painted 9-pin dot-matrix type (printer.py) in assets/print-*.png; VT323 is for the phone view only, Reenie Beanie for the ballpoint notes."}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Escape from New York (1981)": {
  "Cabbie's smoky chilli beef jerky": {"n": "Wall watch jerky", "d": "Top round cut thin across the grain, soaked overnight in soy, Worcestershire, brown sugar, smoked paprika, red pepper flakes and garlic, then dried low in the oven until leathery but still bendy.", "note": "Packs flat in a vest pocket."},
  "Survival tin sardines": {"n": "Tins and saltines", "d": "Oil-packed sardines laid on crisp crackers with a squeeze of lemon, a drop of hot sauce and chopped parsley.", "note": "Eat them off the lid."},
  "Scavenger's hobo stew": {"n": "A Number One stew", "d": "Smoked sausage browned in the pot with onion, carrot and potato, then white beans, crushed tomatoes, smoked paprika and chicken stock. Cabbage goes in at the end. Ladled into a mug.", "note": "Hold a bowl for Hauk."},
  "Ration-pack chocolate oat slice": {"n": "Ration bar", "d": "Rolled oats, butter, golden syrup and brown sugar pressed into a pan and baked, then spread with dark chocolate and flaky salt.", "note": "For the chopper crews."},
  "Brain's bathtub moonshine sour": {"n": "White lightning", "d": "Corn whiskey shaken hard with fresh lemon and sugar, poured over ice in a jelly jar.", "note": "Refined in house. No gasoline."}
}}
open(os.path.join(D, 'escape.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built', r)
