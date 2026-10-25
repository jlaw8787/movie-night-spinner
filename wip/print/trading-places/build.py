"""Builds the Duke & Duke Market Letter, Christmas issue (Trading Places, 1983).
The firm's weekly letter to clients and staff: one sheet of white offset stock, US Letter portrait
(8.5 x 11 in, 816 x 1056 CSS px), printed both sides in black and one orange spot ink, folded in
thirds for the envelope and later punched for a binder. The front leads with the partners'
Christmas buffet; the back carries the market table, the bar list and the mailing panel.
Writes front.body.html, back.body.html, front.html, back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
INK, OR, PAPER, GREY = '#1c1917', '#e2702a', '#f6f4ee', '#4a4540'
FONTS = ('family=Arimo:ital,wght@0,400;0,700;1,400&family=Bodoni+Moda:opsz,wght@96,900'
         '&family=DotGothic16&family=Herr+Von+Muellerhoff&family=Tinos:ital,wght@0,400;0,700;1,400;1,700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
TI, AR, BO, DOT, SIG = "'Tinos',serif", "'Arimo',sans-serif", "'Bodoni Moda',serif", "'DotGothic16',monospace", "'Herr Von Muellerhoff',cursive"
L, R = 84, 60            # left margin clears the binder holes on the front; mirrored on the back
CW = W - L - R           # 672

# offset press ink: a hair of spread on every glyph, no filters
SPREAD = f'text-shadow: 0 0 0.7px {INK}'
SPREAD_OR = f'text-shadow: 0 0 0.6px {OR}'

# ---------- copy ----------
LEAD = ('<b style="font-family: %s; font-size: 14px; letter-spacing: 0.04em">THE PARTNERS INVITE</b> all staff, '
        'with husbands and wives, to the Christmas party on Friday. The buffet opens on the floor at three, sent over '
        'by the Heritage Club kitchen with a carver for the roast, and the bar stays open until six. Please clear your '
        'desks and lock your drawers before you leave them.') % AR
WELCOME = ('<b style="font-family: %s; font-size: 14px; letter-spacing: 0.04em">WELCOME.</b> Mr. William Ray Valentine '
           'has joined the firm and takes the desk lately held by Mr. Louis Winthorpe III, who has left us.') % AR
CAPTION = ('Mr. Mortimer Duke, left, and Mr. Randolph Duke take Mr. Valentine through the business over breakfast: '
           'coffee, wheat, pork bellies and orange juice.')

BUFFET_L = ('Passed and on the sideboard', [
    ('Devils on horseback', 'Prunes stuffed with a whole almond, wrapped in bacon and baked until crisp.', 'Passed hot on trays from three.'),
    ('Shrimp cocktail', 'Six Gulf shrimp, poached and chilled on cracked ice. Sharp red sauce, lemon.', None),
    ('Smoked salmon', 'Nova, sliced thin, with pumpernickel, cream cheese, capers and red onion.', 'A whole side on the board.'),
])
BUFFET_R = ('From the carving board', [
    ('Roast prime rib of beef', 'Standing rib, salted a day ahead, roasted slow and carved to order. Natural juices, horseradish cream, browned potatoes.', 'Carved by the Heritage Club man.'),
    ('Swedish meatballs', 'Beef and pork in a sour cream gravy, kept hot in the chafing dish.', None),
], 'Sweets', [
    ('Orange butter cake', 'Grated rind and juice in the batter, brushed warm with a thick citrus syrup.', None),
])

BAR = [
    ('Mimosa', 'Fresh-squeezed orange juice and chilled champagne, half and half, in a tall flute.', None),
    ('Scotch and soda', 'Over plenty of ice, in a tall glass.', None),
    ('Frozen screwdriver', 'Vodka and orange juice whirled in the blender with crushed ice, in small glasses.', 'Plain orange for the drivers.'),
    ('Eggnog', 'Cream, nutmeg and a little brandy.', None),
    ('Coffee and cookies', 'Spritz, sugar stars and pecan crescents.', None),
]

MARKETS = [
    ('Frozen concentrated orange juice', 'Jan', 'cents per lb.', '146.20', '+2.35', '115.80'),
    ('Pork bellies', 'Feb', 'cents per lb.', '61.45', '−1.10', '78.20'),
    ('Live hogs', 'Feb', 'cents per lb.', '47.10', '−0.40', '56.30'),
    ('Live cattle', 'Feb', 'cents per lb.', '66.35', '+0.25', '60.10'),
    ('Wheat', 'Mar', 'cents per bu.', '352.50', '+3.00', '352.00'),
    ('Corn', 'Mar', 'cents per bu.', '339.25', '+1.75', '245.00'),
    ('Soybeans', 'Jan', 'cents per bu.', '812.50', '−6.00', '563.00'),
    ('Coffee', 'Mar', 'cents per lb.', '140.10', '+0.85', '128.40'),
    ('Cocoa', 'Mar', 'dollars per metric ton', '2,465', '+38', '1,610'),
    ('Sugar, world', 'Mar', 'cents per lb.', '8.42', '−0.11', '6.90'),
    ('Gold', 'Feb', 'dollars per troy oz.', '388.40', '+4.20', '452.00'),
    ('Silver', 'Mar', 'cents per troy oz.', '915.00', '+12.50', '1,055.00'),
]
NOTES = [
    ('ORANGE JUICE.', 'Frozen concentrate firmed on talk of a cold Florida winter. The trade now waits on the Agriculture Department’s orange crop estimate, due in January.'),
    ('PORK BELLIES.', 'Bacon, as in the BLT. Bellies drifted lower on heavy cold storage stocks.'),
    ('HOLIDAY TRADING.', 'The exchanges are closed Monday, December 26, and Monday, January 2.'),
    ('BOWL POOL.', 'One dollar a square. Sign up at the front desk.'),
]


# ---------- pieces ----------
def kicker(t, color=OR):
    return (f'<div style="font-family: {AR}; font-weight: 700; font-size: 13px; letter-spacing: 0.14em; color: {color}; '
            f'{SPREAD_OR if color == OR else SPREAD}">{t.upper()}</div>')


def dish(n, d, note, top):
    s = (f'<div style="margin-top: {top}px">'
         f'<div style="font-family: {TI}; font-weight: 700; font-size: 22px; line-height: 1.12; color: {INK}; {SPREAD}">{n}</div>'
         f'<div style="margin-top: 3px; font-family: {TI}; font-size: 16px; line-height: 1.32; color: {INK}; text-wrap: pretty; {SPREAD}">{d}</div>')
    if note:
        s += f'<div style="margin-top: 3px; font-family: {TI}; font-style: italic; font-size: 15px; line-height: 1.25; color: {OR}; {SPREAD_OR}">{note}</div>'
    return s + '</div>'


def dish_group(title, items, top=0):
    return (f'<div style="margin-top: {top}px">{kicker(title)}'
            f'<div style="height: 1px; background: {INK}; margin: 5px 0 0"></div>'
            + ''.join(dish(*it, top=(10 if i == 0 else 15)) for i, it in enumerate(items)) + '</div>')


def para(html, top=0, size=16, align='justify'):
    return (f'<p style="margin: {top}px 0 0; font-family: {TI}; font-size: {size}px; line-height: 1.36; color: {INK}; '
            f'text-align: {align}; hyphens: auto; {SPREAD}">{html}</p>')


def wear(name):
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(W - H) // 2}px; top: {(H - W) // 2}px; '
            f'width: {H}px; height: {W}px; transform: rotate(90deg); pointer-events: none; display: block">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; '
            f'width: {W}px; height: {H}px; pointer-events: none; display: block">')


def masthead():
    # two-colour masthead: the orange plate prints a heavy drop under the black, a hair off register
    word = 'DUKE &amp; DUKE'
    common = f'font-family: {BO}; font-weight: 900; font-size: 68px; line-height: 1; letter-spacing: 0; white-space: nowrap'
    return f'''
<div style="position: absolute; left: {L}px; top: 40px; width: {CW}px; display: flex; justify-content: space-between;
     font-family: {AR}; font-weight: 700; font-size: 12px; letter-spacing: 0.16em; color: {INK}; {SPREAD}">
  <span>FOR THE CLIENTS AND STAFF OF THE FIRM</span><span>PHILADELPHIA, PENNSYLVANIA</span></div>
<div style="position: absolute; left: {L}px; top: 58px; width: {CW}px; height: 8px; background: {INK}"></div>
<div style="position: absolute; left: {L + 4}px; top: 86px; {common}; color: {OR}">{word}</div>
<div style="position: absolute; left: {L}px; top: 82px; {common}; color: {INK}; {SPREAD}">{word}</div>
<div style="position: absolute; left: {L + 520}px; top: 86px; width: {CW - 520}px; text-align: right">
  <div style="font-family: {AR}; font-weight: 700; font-size: 25px; line-height: 1.02; letter-spacing: 0.06em; color: {OR}; {SPREAD_OR}">MARKET<br>LETTER</div>
  <div style="margin-top: 6px; font-family: {TI}; font-style: italic; font-size: 15px; line-height: 1.2; color: {INK}; {SPREAD}">Commodity brokers</div>
</div>
<div style="position: absolute; left: {L}px; top: 176px; width: {CW}px; height: 3px; background: {INK}"></div>
<div style="position: absolute; left: {L}px; top: 182px; width: {CW}px; height: 2px; background: {OR}"></div>
<div style="position: absolute; left: {L}px; top: 190px; width: {CW}px; height: 30px; box-sizing: border-box; display: flex;
     align-items: center; font-family: {AR}; font-size: 14px; color: {INK}; {SPREAD}">
  <span style="flex: 1">Week of December 19, 1983</span>
  <span style="font-weight: 700; letter-spacing: 0.12em; color: {OR}; {SPREAD_OR}">CHRISTMAS ISSUE</span>
  <span style="flex: 1; text-align: right">Number 50</span></div>
<div style="position: absolute; left: {L}px; top: 222px; width: {CW}px; height: 1px; background: {INK}"></div>'''


# ---------- faces ----------
def front():
    lc = 292
    t, items = BUFFET_L
    rt, ritems, st, sitems = BUFFET_R
    return masthead() + f'''
<div style="position: absolute; left: {L}px; top: 238px; width: {CW}px; height: {H - 44 - 238}px; display: flex; flex-direction: column">
  <div style="display: flex; gap: 20px">
    <div style="width: {lc}px">
      {kicker('In the office')}
      <h1 style="margin: 5px 0 0; font-family: {TI}; font-weight: 700; font-size: 30px; line-height: 1.06; color: {INK}; {SPREAD}">Christmas on the floor, Friday at three</h1>
      {para(LEAD, 9)}
      <div style="height: 1px; background: {INK}; margin: 12px 0 0"></div>
      {para(WELCOME, 9)}
    </div>
    <div style="width: 360px">
      <img src="assets/still-halftone.png" alt="" style="display: block; width: 360px; height: 259px">
      <p style="margin: 6px 0 0; font-family: {TI}; font-style: italic; font-size: 15px; line-height: 1.3; color: {INK}; {SPREAD}">{CAPTION}</p>
    </div>
  </div>
  <div style="flex: 1; margin-top: 8px; position: relative; box-sizing: border-box; border: 3px solid {INK}; padding: 10px 20px 14px">
    <div style="position: absolute; left: 3px; top: 3px; right: 3px; bottom: 3px; border: 1px solid {OR}"></div>
    <div style="position: relative; display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; padding-bottom: 6px; border-bottom: 2px solid {INK}">
      <div style="font-family: {TI}; font-weight: 700; font-size: 30px; line-height: 1; color: {INK}; {SPREAD}">The Christmas Buffet</div>
      <div style="font-family: {AR}; font-size: 14px; line-height: 1.25; color: {INK}; text-align: right; {SPREAD}">Friday, December 23, from 3 P.M.<br>With the compliments of the partners</div>
    </div>
    <div style="position: relative; display: flex; gap: 0; margin-top: 8px">
      <div style="width: 300px; padding-right: 16px; border-right: 1px solid rgba(28,25,23,0.5)">{dish_group(t, items)}</div>
      <div style="flex: 1; padding-left: 16px">{dish_group(rt, ritems)}{dish_group(st, sitems, 16)}</div>
    </div>
  </div>
</div>
{wear('front')}'''


def back():
    td = 'padding: 2px 6px; background-image: url(assets/tint-screen.png); background-size: 120px 120px'
    rows = ''
    for i, (c, m, u, s, ch, y) in enumerate(MARKETS):
        bg = td if i % 2 == 0 else 'padding: 2px 6px'
        rows += (f'<tr><td style="{bg}; text-align: left">{c}</td><td style="{bg}">{m}</td>'
                 f'<td style="{bg}; text-align: left; font-style: italic">{u}</td>'
                 f'<td style="{bg}; text-align: right; font-weight: 700">{s}</td>'
                 f'<td style="{bg}; text-align: right">{ch}</td><td style="{bg}; text-align: right">{y}</td></tr>')
    th = f'font-family: {AR}; font-weight: 700; font-size: 12px; letter-spacing: 0.06em; padding: 0 6px 4px; border-bottom: 1px solid {INK}'
    table = f'''
<table style="width: 100%; border-collapse: collapse; margin-top: 8px; font-family: {TI}; font-size: 15px; line-height: 1.2; color: {INK};
       font-variant-numeric: tabular-nums; border-bottom: 1px solid {INK}; {SPREAD}">
  <tr><th style="{th}; text-align: left">COMMODITY</th><th style="{th}">MONTH</th><th style="{th}; text-align: left">UNIT</th>
      <th style="{th}; text-align: right">SETTLE</th><th style="{th}; text-align: right">WEEK</th><th style="{th}; text-align: right">YEAR AGO</th></tr>
  {rows}
</table>'''
    notes = ''.join(para(f'<b style="font-family: {AR}; font-size: 14px; letter-spacing: 0.04em">{h}</b> {b}', 0 if i == 0 else 8)
                    for i, (h, b) in enumerate(NOTES))
    bar = ''.join(dish(*b, top=(8 if i == 0 else 12)) for i, b in enumerate(BAR))
    bl, br = R, L     # holes now on the right
    cw = W - bl - br
    return f'''
<div style="position: absolute; left: {bl}px; top: 40px; width: {cw}px; display: flex; justify-content: space-between; align-items: baseline;
     font-family: {AR}; font-size: 13px; color: {INK}; {SPREAD}">
  <span style="font-weight: 700; letter-spacing: 0.14em">DUKE &amp; DUKE MARKET LETTER</span><span>Week of December 19, 1983&nbsp;&nbsp;&nbsp;<b>2</b></span></div>
<div style="position: absolute; left: {bl}px; top: 60px; width: {cw}px; height: 3px; background: {INK}"></div>
<div style="position: absolute; left: {bl}px; top: 66px; width: {cw}px; height: 2px; background: {OR}"></div>
<div style="position: absolute; left: {bl}px; top: 80px; width: {cw}px; height: {900 - 80}px; display: flex; flex-direction: column">
  {kicker('The week in the markets')}
  <div style="margin-top: 3px; font-family: {TI}; font-weight: 700; font-size: 26px; line-height: 1.1; color: {INK}; {SPREAD}">Nearby futures, Friday’s settlement</div>
  {table}
  <div style="flex: 1; display: flex; gap: 22px; margin-top: 16px">
    <div style="width: 330px; display: flex; flex-direction: column">
      {notes}
      <div style="height: 1px; background: {INK}; margin: 18px 0 18px"></div>
      {kicker('From the partners')}
      {para('Our thanks to all of you for a good year. A merry Christmas and a prosperous New Year to you and your families.', 4, 16, 'left')}
      <div style="position: relative; height: 72px; margin-top: 2px">
        <div style="position: absolute; left: 4px; top: 0; font-family: {SIG}; font-size: 38px; white-space: nowrap; line-height: 1; color: #1f2a52; transform: rotate(-3deg)">Randolph Duke</div>
        <div style="position: absolute; left: 128px; top: 28px; font-family: {SIG}; font-size: 38px; white-space: nowrap; line-height: 1; color: #1f2a52; transform: rotate(-2deg)">Mortimer Duke</div>
      </div>
    </div>
    <div style="flex: 1; box-sizing: border-box; padding: 14px 18px 16px; border-top: 4px solid {INK};
         background-image: url(assets/tint-screen.png); background-size: 120px 120px">
      <div style="font-family: {TI}; font-weight: 700; font-size: 26px; line-height: 1.05; color: {INK}; {SPREAD}">Friday at the bar</div>
      <div style="margin-top: 2px; font-family: {AR}; font-size: 13px; letter-spacing: 0.1em; color: {INK}; {SPREAD}">OPEN FROM THREE UNTIL SIX</div>
      {bar}
    </div>
  </div>
</div>
<div style="position: absolute; left: {bl}px; top: 908px; width: {cw}px; height: {H - 40 - 908}px; border-top: 2px dashed {INK}; box-sizing: border-box">
  <div style="position: absolute; left: 0; top: 12px; font-family: {TI}; font-size: 15px; line-height: 1.3; color: {INK}; {SPREAD}">
    <b style="font-family: {AR}; letter-spacing: 0.06em">DUKE &amp; DUKE</b><br>Commodity Brokers<br>Philadelphia, Pennsylvania<br>
    <span style="font-family: {AR}; font-size: 12px; letter-spacing: 0.08em">ADDRESS CORRECTION REQUESTED</span></div>
  <div style="position: absolute; right: 0; top: 12px; width: 128px; box-sizing: border-box; border: 2px solid {INK}; padding: 5px 4px;
       font-family: {AR}; font-weight: 700; font-size: 12px; line-height: 1.22; text-align: center; color: {INK}; {SPREAD}">
    FIRST CLASS MAIL<br>U.S. POSTAGE<br>PAID<br>PHILADELPHIA, PA<br>PERMIT NO. 50</div>
  <div style="position: absolute; left: 270px; top: 10px; width: 262px; box-sizing: border-box; padding: 7px 12px 6px; background: #fbfaf6;
       transform: rotate(-0.8deg); box-shadow: 0 1px 1px rgba(40,30,20,0.25), 0 2px 5px rgba(40,30,20,0.12);
       font-family: {DOT}; font-size: 15px; line-height: 1.28; letter-spacing: 0.04em; color: #2c2b33">
    *DD 1983-12 ** 0001<br>THE HERITAGE CLUB<br>ATTN THE LIBRARY<br>PHILADELPHIA PA</div>
</div>
{wear('back')}'''


FACES = {'front': front(), 'back': back()}
for name, body in FACES.items():
    root = f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">{body}</div>'
    open(os.path.join(D, name + '.body.html'), 'w').write(root)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Duke &amp; Duke Market Letter, {name}</title>{LINK}'
        f'<style>body{{margin:0}}h1,p{{font-weight:inherit}}h1{{font-weight:700}}</style></head><body>{root}</body></html>')
print('built')
