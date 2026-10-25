"""Builds the Perlmutter's tab sheet (Serpico, Greenwich Village, March 1967).
One sheet off a pale green two-column columnar pad, US Letter, written on both sides and kept
under the register. Front: the owner's price list in blue ballpoint. Back: the cops' book,
what went out on the arm and what was paid, with the shop's red PAID stamp on Frank's lines.
Printed by the stationer: green rules, red money rules, line numbers, column boxes, header fields.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os, random
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER = '#e5edd9'
GRN, GRN_L, GRN_XL, RED_R = '#3f7d57', '#8fbb9b', '#b3d2b9', '#c65a4c'
BLUE, RED, BLACK = '#22357f', '#b0302a', '#2a2724'
FONTS = ('https://fonts.googleapis.com/css2?family=Kalam:wght@400;700'
         '&family=Libre+Franklin:wght@600;700&display=swap')
HAND = "'Kalam', cursive"; PRINT = "'Libre Franklin', sans-serif"

# sheet geometry (printed by the stationer)
L, CW = 48, 720
NUMW, WIDE, MON = 28, 472, 110          # line numbers, explanation column, two money columns
DOL = 70                                # dollars part of a money column, cents after the red rule
X_WIDE = L + NUMW
X_C1 = X_WIDE + WIDE
X_C2 = X_C1 + MON
TOP = 178                               # first ruled line
P = 26                                  # line pitch
N = 31                                  # ruled lines

def row_y(i): return TOP + i * P

def ptxt(t, size=12, w=600, color=GRN, ls='0.08em', extra=''):
    return f'<span style="font-family: {PRINT}; font-weight: {w}; font-size: {size}px; letter-spacing: {ls}; color: {color}; text-transform: uppercase;{extra}">{t}</span>'

def abs_div(x, y, w, h, style):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; {style}"></div>'

def sheet(date_txt):
    """Everything the stationer printed, identical on both sides."""
    o = []
    # header fields
    o.append(f'<div style="position: absolute; left: {L}px; top: 58px">{ptxt("Prepared by", 12)}</div>')
    o.append(abs_div(L + 100, 72, 300, 1, f'background: {GRN}'))
    o.append(f'<div style="position: absolute; left: {L}px; top: 104px">{ptxt("Approved by", 12)}</div>')
    o.append(abs_div(L + 100, 118, 300, 1, f'background: {GRN}'))
    bx = L + CW - 236
    o.append(abs_div(bx, 50, 236, 76, f'border: 1.5px solid {GRN}; box-sizing: border-box'))
    o.append(abs_div(bx + 92, 50, 1.5, 76, f'background: {GRN}'))
    o.append(abs_div(bx, 74, 236, 1.5, f'background: {GRN}'))
    o.append(f'<div style="position: absolute; left: {bx + 8}px; top: 55px">{ptxt("Initials", 12)}</div>')
    o.append(f'<div style="position: absolute; left: {bx + 100}px; top: 55px">{ptxt("Date", 12)}</div>')
    o.append(f'<div style="position: absolute; left: {bx}px; top: 132px; width: 236px; text-align: right">{ptxt("2 Columns", 12, 700, GRN, "0.16em")}</div>')
    # column number boxes
    hy = 146
    o.append(abs_div(L, hy, CW, 32, f'border: 1.5px solid {GRN}; border-bottom: none; box-sizing: border-box'))
    for i, x in enumerate((X_C1, X_C2)):
        o.append(abs_div(x, hy, 1.5, 32, f'background: {GRN}'))
        o.append(f'<div style="position: absolute; left: {x}px; top: {hy + 2}px; width: {MON}px; text-align: center">{ptxt(str(i + 1), 13, 700, GRN, "0")}</div>')
    o.append(abs_div(X_WIDE, hy, 1, 32, f'background: {GRN_L}'))
    # ruled lines: light every line, heavier every fifth, red double under the header
    for i in range(N + 1):
        y = row_y(i)
        if i == 0:
            o.append(abs_div(L, y - 1, CW, 1.5, f'background: {RED_R}'))
            o.append(abs_div(L, y + 2, CW, 1, f'background: {RED_R}'))
        else:
            c = GRN if i % 5 == 0 else GRN_L
            o.append(abs_div(L, y, CW, 1, f'background: {c}'))
    # verticals
    top, bot = TOP, row_y(N)
    o.append(abs_div(L, top, 1.5, bot - top, f'background: {GRN}'))
    o.append(abs_div(L + CW - 1.5, top, 1.5, bot - top, f'background: {GRN}'))
    o.append(abs_div(X_WIDE, top, 1, bot - top, f'background: {GRN_L}'))
    for x in (X_C1, X_C2):
        o.append(abs_div(x, top, 1.5, bot - top, f'background: {GRN}'))
        for k in (1, 2):                                   # faint thousands guides
            o.append(abs_div(x + k * DOL // 3, top, 1, bot - top, f'background: {GRN_XL}'))
        o.append(abs_div(x + DOL, top, 1, bot - top, f'background: {RED_R}'))
    # line numbers
    for i in range(N):
        o.append(f'<div style="position: absolute; left: {L}px; top: {row_y(i) + 7}px; width: {NUMW}px; text-align: center; '
                 f'font-family: {PRINT}; font-weight: 600; font-size: 12px; line-height: 1; color: {GRN}">{i + 1}</div>')
    # stationer's form line
    o.append(f'<div style="position: absolute; left: {L}px; top: {bot + 8}px; width: {CW}px; display: flex; justify-content: space-between">'
             f'{ptxt("Columnar sheet. Green tint, 2 col.", 12, 600)}{ptxt("Form 2C-31", 12, 600)}</div>')
    return ''.join(o)

random.seed(1967)
def jit(a=0.5): return round(random.uniform(-a, a), 2)

def hand(x, i, text, size=19, w=400, color=BLUE, dy=0, rot=None, width=None, align='left', fam=HAND, ls='0'):
    """Writing that sits on ruled line i (its baseline just above the rule under row i)."""
    r = jit(0.6) if rot is None else rot
    wd = f'width: {width}px; text-align: {align};' if width else ''
    top = row_y(i) + P - size * 1.22 + 1 + dy
    return (f'<div class="hw" style="position: absolute; left: {x + jit(1.5)}px; top: {top:.1f}px; {wd} white-space: nowrap; '
            f'font-family: {fam}; font-weight: {w}; font-size: {size}px; line-height: 1.22; letter-spacing: {ls}; color: {color}; '
            f'transform: rotate({r}deg); transform-origin: left bottom">{text}</div>')

def money(col, i, amt, color=BLUE, size=20):
    """Dollars right of the column's dollar area, cents after the red rule, as a bookkeeper writes them."""
    if amt is None: return ''
    d, c = f'{amt:.2f}'.split('.')
    x = X_C1 if col == 1 else X_C2
    o = ''
    if d != '0':
        o += hand(x, i, d, size, 400, color, width=DOL - 8, align='right', rot=jit(0.3))
    o += hand(x + DOL + 5, i, c, size, 400, color, rot=jit(0.3))
    return o

def grain(): return f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.32">'
def wear(n): return f'<img src="assets/wear-{n}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'

def head(i, t, right=''):
    return (hand(X_WIDE + 10, i, t, 19, 700, BLUE, ls='0.06em')
            + abs_div(X_WIDE + 10, row_y(i) + P - 3, len(t) * 13, 1.6, f'background: {BLUE}; opacity: 0.85; transform: rotate({jit(0.5)}deg)')
            + right)

# ---------------- FRONT: the price list ----------------
# (row, kind, text, sandwich price, platter price)
FRONT = [
  (2, 'head', 'APPETIZING'),
  (3, 'name', 'Bagel and lox', 1.10, None),
  (4, 'desc', 'Toasted, cream cheese spread thick, smoked salmon,'),
  (5, 'desc', 'capers, sliced red onion and sprigs of fresh dill.'),
  (6, 'head', 'HOT MEATS'),
  (7, 'name', 'Hot pastrami on rye', 1.35, 1.95),
  (8, 'desc', 'Steamed soft, sliced and piled high on the bread.'),
  (9, 'desc', 'Brown deli mustard and a sour pickle alongside.'),
  (10, 'name', 'The Village hero', 1.65, None),
  (11, 'desc', 'Steamed pastrami in a long roll with Swiss cheese,'),
  (12, 'desc', 'slaw and Russian dressing, horseradish and pickle.'),
  (13, 'name', 'Roast beef on a roll', 1.15, 1.75),
  (14, 'desc', 'Rare, sliced thin while you wait.'),
  (15, 'desc', 'Platters come with slaw, potato salad and a pickle.'),
  (16, 'head', 'ON THE SIDE'),
  (17, 'item', 'Potato knish, hot off the grill', 0.35, None),
  (18, 'item', 'Cole slaw or potato salad', 0.25, None),
  (19, 'item', 'Sour or half sour pickle', 0.10, None),
  (20, 'head', 'SWEETS'),
  (21, 'name', 'Black and white', 0.25, None),
  (22, 'desc', 'Soft sour cream cake cookie, the flat side iced'),
  (23, 'desc', 'half in vanilla fondant and half in chocolate.'),
  (24, 'head', 'FOUNTAIN'),
  (25, 'name', 'Iced coffee float', 0.45, None),
  (26, 'desc', 'Steeped overnight in the icebox, vanilla syrup,'),
  (27, 'desc', 'milk and ice, a ball of ice cream floating on top.'),
  (28, 'item', 'Egg cream <span style="font-weight: 400; font-size: 17px">chocolate syrup, milk, seltzer</span>', 0.20, None),
  (29, 'item', 'Celery tonic', 0.15, None),
  (30, 'item', 'Coffee, hot, all day', 0.15, None),
]

def front():
    o = [sheet('3/1/67')]
    # header fill: shop stamp over "Prepared by", owner's initials and date
    o.append(f'<img src="assets/stamp-shop.png" alt="Perlmutter\'s Delicatessen and Appetizing, Greenwich Village" style="position: absolute; left: 132px; top: 42px; width: 262px; height: 104px; display: block; transform: rotate(-2.4deg)">')
    bx = L + CW - 236
    o.append(f'<div style="position: absolute; left: {bx + 22}px; top: 80px; font-family: {HAND}; font-weight: 700; font-size: 30px; line-height: 1; color: {BLUE}; transform: rotate(-3deg)">M.P.</div>')
    o.append(f'<div style="position: absolute; left: {bx + 104}px; top: 82px; font-family: {HAND}; font-size: 27px; line-height: 1; color: {BLUE}; transform: rotate(-1.5deg)">3/1/67</div>')
    o.append(f'<div style="position: absolute; left: {L + 112}px; top: 92px; font-family: {HAND}; font-size: 22px; line-height: 1; color: {BLUE}; transform: rotate(-1deg)"></div>')
    # title across the first two lines, column heads
    o.append(hand(X_WIDE + 8, 1, 'PRICES', 42, 700, BLUE, dy=4, rot=-1.2, ls='0.04em'))
    o.append(hand(X_WIDE + 192, 1, 'from March 1st, 1967', 18, 400, BLUE, rot=-0.8))
    o.append(hand(X_C1, 0, 'sandw.', 18, 700, BLUE, width=MON, align='center', rot=-1))
    o.append(hand(X_C2, 0, 'platter', 18, 700, BLUE, width=MON, align='center', rot=-1))
    for r in FRONT:
        i, kind, t = r[0], r[1], r[2]
        if kind == 'head':
            o.append(head(i, t))
        elif kind == 'name':
            o.append(hand(X_WIDE + 10, i, t, 25, 700, BLUE, dy=2))
        elif kind == 'item':
            o.append(hand(X_WIDE + 10, i, t, 20, 700, BLUE))
        else:
            o.append(hand(X_WIDE + 26, i, t, 19, 400, BLUE))
        if len(r) > 3:
            o.append(money(1, i, r[3]))
            o.append(money(2, i, r[4]) if r[4] else '')
    # the lean, the cash rule and the dog, added later in red grease pencil
    o.append(hand(X_WIDE + 292, 14, 'Lean is 10¢ extra.', 20, 700, RED, rot=-1.5))
    o.append(abs_div(X_WIDE + 292, row_y(14) + P - 1, 160, 2, f'background: {RED}; opacity: 0.8; transform: rotate(-1.5deg)'))
    o.append(hand(X_WIDE + 228, 2, 'CASH ONLY. NO TABS.', 22, 700, RED, rot=-1.8, ls='0.03em'))
    o.append(hand(X_WIDE + 196, 16, 'Tie the sheepdog outside!', 21, 700, RED, rot=-1.6))
    o.append(hand(X_WIDE + 216, 20, 'fresh Tues. and Fri.', 18, 400, BLUE, rot=-1))
    o.append(hand(X_WIDE + 210, 6, 'all steamed to order', 18, 400, BLUE, rot=-1))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {BLUE}">{grain()}'
            + ''.join(o) + wear('front') + '</div>')

# ---------------- BACK: the book ----------------
# (date, who, order, on the arm, paid)
BOOK = [
  ('3/1', 'Sector car', '2 heroes', 3.30, None),
  ('3/1', 'Frank', 'pastrami on rye, coffee', None, 1.50),
  ('3/2', 'Desk sgt.', 'roast beef, celery tonic', 1.30, None),
  ('3/2', 'Frank', 'bagel and lox, coffee', None, 1.25),
  ('3/3', 'Plainclothes', '4 heroes to go', 6.60, None),
  ('3/3', 'Frank + Leslie', '2 floats, 2 black and whites', None, 1.40),
  ('3/6', 'Keough', 'hero, egg cream', 1.85, None),
  ('3/6', 'Sector car', '2 pastrami on rye, 2 coffees', 3.00, None),
  ('3/7', 'New kid', 'roast beef. Wants it lean!', 1.25, None),
  ('3/7', 'Frank', 'hero, celery tonic', None, 1.80),
  ('3/8', 'Mr. Blair', '2 pastrami on rye. City Hall', None, 2.70),
  ('3/8', 'Desk sgt.', '2 knish, coffee', 0.85, None),
  ('3/9', 'Frank', '2 coffees to go. Spanish class', None, 0.30),
  ('3/9', 'Plainclothes', '3 heroes, 3 egg creams', 5.55, None),
  ('3/10', 'Sector car', '2 roast beef, 2 coffees', 2.60, None),
  ('3/10', 'Frank', 'bagel and lox, float', None, 1.55),
  ('3/13', 'Keough', 'pastrami platter, coffee', 2.10, None),
  ('3/13', 'Frank + Leslie', '2 pastrami platters', None, 3.90),
  ('3/14', 'Sector car', '2 heroes', 3.30, None),
  ('3/14', 'Frank', 'egg cream, black and white', None, 0.45),
  ('3/15', 'Plainclothes', '2 roast beef platters, 2 tonics', 3.80, None),
  ('3/15', 'Frank', 'knish, slaw, coffee', None, 0.75),
  ('3/16', 'Desk sgt.', 'pastrami on rye, pickle', 1.45, None),
  ('3/16', 'Keough', '2 heroes to go', 3.30, None),
  ('3/17', 'Frank', 'pastrami on rye, egg cream', None, 1.55),
]
ARM = round(sum(b[3] or 0 for b in BOOK), 2); PAID = round(sum(b[4] or 0 for b in BOOK), 2)

def back():
    o = [sheet('3/17/67')]
    o.append(f'<img src="assets/stamp-shop.png" alt="" aria-hidden="true" style="position: absolute; left: 140px; top: 46px; width: 262px; height: 104px; display: block; transform: rotate(1.6deg); opacity: 0.9">')
    bx = L + CW - 236
    o.append(f'<div style="position: absolute; left: {bx + 22}px; top: 80px; font-family: {HAND}; font-weight: 700; font-size: 30px; line-height: 1; color: {BLUE}; transform: rotate(-3deg)">M.P.</div>')
    o.append(f'<div style="position: absolute; left: {bx + 100}px; top: 82px; font-family: {HAND}; font-size: 27px; line-height: 1; color: {BLUE}; transform: rotate(-1.5deg)">3/17/67</div>')
    o.append(hand(X_WIDE + 8, 1, 'THE COPS', 40, 700, BLUE, dy=4, rot=-1.2, ls='0.04em'))
    o.append(hand(X_WIDE + 226, 1, 'March. Keep under the register.', 18, 400, BLUE, rot=-0.8))
    o.append(hand(X_C1, 0, 'on the arm', 18, 700, RED, width=MON, align='center', rot=-1.5))
    o.append(hand(X_C2, 0, 'paid', 19, 700, BLUE, width=MON, align='center', rot=-1))
    stamp = 0
    for k, (dt, who, what, arm, paid) in enumerate(BOOK):
        i = k + 2
        col = BLUE
        o.append(hand(X_WIDE + 6, i, dt, 18, 400, col, rot=jit(0.4)))
        o.append(hand(X_WIDE + 52, i, f'{who}<span style="font-weight: 400; font-size: 18px; margin-left: 12px">{what}</span>', 19, 700, col))
        if arm is not None:
            o.append(money(1, i, arm, RED))
        if paid is not None:
            o.append(money(2, i, paid, BLUE))
            o.append(f'<img src="assets/stamp-paid-{stamp % 8}.png" alt="Paid" style="position: absolute; left: {X_C1 + 22 + random.randint(-5, 5)}px; '
                     f'top: {row_y(i) + random.randint(-2, 2)}px; width: 64px; height: 26px; display: block; transform: rotate({jit(5)}deg)">')
            stamp += 1
    t = len(BOOK) + 2
    # totals: a single rule over, double under, as the stationer's sheets teach
    for x, color in ((X_C1, RED), (X_C2, BLUE)):
        o.append(abs_div(x + 8, row_y(t) + 1, MON - 16, 1.6, f'background: {color}; transform: rotate(-0.6deg)'))
        o.append(abs_div(x + 8, row_y(t + 1) - 3, MON - 16, 1.6, f'background: {color}; transform: rotate(-0.4deg)'))
        o.append(abs_div(x + 8, row_y(t + 1), MON - 16, 1.6, f'background: {color}; transform: rotate(-0.4deg)'))
    o.append(hand(X_WIDE + 50, t, 'Two and a half weeks', 20, 700, BLUE, rot=-0.6))
    o.append(money(1, t, ARM, RED, 22))
    o.append(money(2, t, PAID, BLUE, 22))
    o.append(hand(X_WIDE + 10, t + 1, 'Frank pays. Don\'t put him on the arm.', 21, 700, RED, rot=-1.4))
    o.append(hand(X_WIDE + 10, t + 2, 'No mice in the store, Frank!', 21, 700, RED, rot=-1))
    o.append(hand(X_WIDE + 10, t + 3, 'He sings opera at the counter. Let him.', 19, 400, BLUE, rot=-0.6))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {BLUE}">{grain()}'
            + ''.join(x for x in o if x) + wear('back') + '</div>')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Perlmutter\'s tab sheet, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built', 'arm', ARM, 'paid', PAID, 'rows', len(BOOK) + 3)
