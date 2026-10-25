"""Builds the Cape Bay Excursion Line handout (Splash, 1984).
The rack card a family picks up at the ticket booth on a Cape Cod town pier: the same kind of
sightseeing boat eight-year-old Allen jumps from in 1964. Printed in 1984 the way small New England
boat lines did it: two spot inks (reflex blue and warm red) by offset on uncoated card, a pen-and-ink
drawing of the boat, a waterlined harbor chart, condensed gothic timetable type and a Century-style
text face, the red plate a hair out of register.
Front: the boat, daily sailings, fares, the chart, rules on board.
Back: the galley menu for every sailing and the sunset lobster supper cruise.
Sheet: 6 x 9 in rack card (152.4 x 228.6 mm), printed both sides, no fold.
Writes front.html / back.html (full pages), front.body.html / back.body.html, film.json and
oceansupper.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 576, 864
PAPER, BLUE, RED = '#f6f1e4', '#1e3a80', '#cd3a28'
INK = '#1e3a80'                                     # all text is on the blue plate
FONTS = 'family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Pathway+Gothic+One&family=Ultra'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Ultra', 'Clarendon', Georgia, serif"
BODY = "'Old Standard TT', 'Century Schoolbook', Georgia, serif"
GOTH = "'Pathway Gothic One', 'News Gothic Condensed', 'Arial Narrow', sans-serif"
L, R = 42, 534
TW = R - L
SPREAD_B = 'text-shadow: 0 0 0.6px rgba(30,58,128,0.55)'      # ink spread on uncoated stock
SPREAD_R = 'text-shadow: 0 0 0.6px rgba(205,58,40,0.55)'
SPREAD_P = 'text-shadow: 0 0 0.6px rgba(246,241,228,0.6)'


def esc(s): return s.replace('&', '&amp;')


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-ink-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.75; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def root(inner, face):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
            f'font-family: {BODY}; color: {INK}; {SPREAD_B}">{inner}{overlays(face)}</div>')


def kick(t, color=RED, size=17, ls=0.12, extra=''):
    sp = SPREAD_R if color == RED else SPREAD_B
    return f'<div style="font-family: {GOTH}; font-size: {size}px; line-height: 1.1; letter-spacing: {ls}em; color: {color}; {sp}; {extra}">{esc(t)}</div>'


def box(x, y, w, h, color, bw=1, extra=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; box-sizing: border-box; border: {bw}px solid {color}; {extra}"></div>'


def bar(x, y, w, h, color):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: {color}"></div>'


# ======================================================================== FRONT
CHX, CHY, CHW, CHH = 362, 461, 172, 224          # chart frame (image 220 x 286 scaled)

def chart_label(t, x, y, size=12, color=BLUE, italic=False, align='left'):
    st = 'font-style: italic; ' if italic else ''
    fam = BODY if italic else GOTH
    sp = SPREAD_R if color == RED else SPREAD_B
    tr = {'left': '', 'center': 'transform: translateX(-50%); ', 'right': 'transform: translateX(-100%); '}[align]
    return (f'<div style="position: absolute; left: {CHX + x}px; top: {CHY + y}px; {tr}white-space: nowrap; font-family: {fam}; {st}'
            f'font-size: {size}px; line-height: 1; letter-spacing: {0 if italic else 0.08}em; color: {color}; {sp}">{esc(t)}</div>')

k = CHW / 220   # chart px to css
chart = (box(CHX - 1, CHY - 1, CHW + 2, CHH + 2, BLUE, 1)
         + f'<img src="assets/chart.png" alt="Harbor chart with the cruise courses" style="position: absolute; left: {CHX}px; top: {CHY}px; width: {CHW}px; height: {CHH}px; display: block">'
         + chart_label('N', 28 * k, 58 * k, 12, BLUE, align='center')
         + chart_label('1 MILE', 85 * k, 28 * k, 12, BLUE, align='center')
         + chart_label('Gull Island', 70 * k, 124 * k, 13, BLUE, True, 'center')
         + chart_label('SEAL LEDGE', 136 * k, 132 * k, 12, BLUE)
         + chart_label('BELL BUOY', 112 * k, 160 * k, 12, RED)
         + chart_label('POINT LIGHT', 160 * k, 48 * k, 12, BLUE, align='right')
         + chart_label('Cape Bay', 92 * k, 186 * k, 15, BLUE, True, 'center')
         + chart_label('TOWN PIER', 96 * k, 234 * k, 12, RED)
         + chart_label('THE TOWN', 30 * k, 262 * k, 12, BLUE))

def sail_row(name, length, desc, times, first=False):
    cells = ''.join(f'<div style="flex: none; min-width: 46px; box-sizing: border-box; padding: 3px 6px 2px; border: 1px solid {RED}; margin-right: 4px; text-align: center; font-family: {GOTH}; font-size: 19px; line-height: 1.05; color: {RED}; {SPREAD_R}">{t}</div>' for t in times)
    return f'''<div style="padding: 8px 0 9px; border-top: {'2px' if first else '1px'} solid {BLUE}">
      <div style="display: flex; justify-content: space-between; align-items: baseline">
        <div style="font-weight: 700; font-size: 18px; line-height: 1.1">{esc(name)}</div>
        <div style="font-family: {GOTH}; font-size: 15px; letter-spacing: 0.06em">{esc(length)}</div></div>
      <div style="margin-top: 2px; font-size: 15px; line-height: 1.28">{esc(desc)}</div>
      <div style="display: flex; margin-top: 6px">{cells}</div></div>'''

FARES = [('Adults', '5.00'), ('Children 3 to 11', '2.50'), ('Under 3, on a lap', 'free'), ('Six-day pass', '18.00')]
def legend_dots(n=7, dash=False):
    if dash:
        return ''.join(f'<span style="display: inline-block; width: 6px; height: 2px; margin-right: 3px; background: {RED}; vertical-align: middle"></span>' for _ in range(4))
    return ''.join(f'<span style="display: inline-block; width: 3px; height: 3px; border-radius: 50%; margin-right: 2.5px; background: {RED}; vertical-align: middle"></span>' for _ in range(n))

LCW = 288
ART_Y, ART_H, CROP = 176, 222, 24          # cover drawing, top 24px of sky cropped by the frame
COL_Y = ART_Y + ART_H + 38
RULES = ['Children stay behind the rail.', 'No jumping from the upper deck.', 'Please don&#8217;t drop coins on deck.', 'Non-swimmers, tell a deckhand.']
rules = ''.join(f'<div style="display: flex; gap: 7px"><span style="flex: none; width: 5px; height: 5px; margin-top: 8px; background: {RED}"></span><span>{r}</span></div>' for r in RULES)
fares = ''.join(f'''<div style="display: flex; align-items: baseline; gap: 5px">
      <span style="white-space: nowrap">{esc(n)}</span><span style="flex: 1; border-bottom: 1px dotted {BLUE}; transform: translateY(-4px)"></span>
      <span style="white-space: nowrap">{p}</span></div>''' for n, p in FARES)
BAND_Y = 704
front = f'''
<div style="position: absolute; left: {L}px; top: 41px; width: {TW}px; display: flex; justify-content: space-between">
  {kick('CAPE COD, MASSACHUSETTS', RED, 16, 0.16)}{kick('SEASON OF 1984', RED, 16, 0.16)}</div>
{bar(L, 62, TW, 3, BLUE)}{bar(L, 68, TW, 1, BLUE)}
<div style="position: absolute; left: {L - 2}px; top: 78px; font-family: {DISP}; font-size: 58px; line-height: 1; letter-spacing: -0.01em; color: {BLUE}">Cape Bay</div>
<div style="position: absolute; left: {L}px; top: 141px; width: 382px; display: flex; align-items: center; gap: 10px">
  {kick('EXCURSION LINE', RED, 23, 0.3)}<div style="flex: 1; height: 2px; background: {RED}; margin-top: 2px"></div></div>
<div style="position: absolute; left: {R - 90}px; top: 74px; width: 90px; height: 90px; box-sizing: border-box; border: 2px solid {RED}; border-radius: 50%"></div>
<div style="position: absolute; left: {R - 84.5}px; top: 79.5px; width: 79px; height: 79px; box-sizing: border-box; border: 1px solid {RED}; border-radius: 50%"></div>
<div style="position: absolute; left: {R - 90}px; top: 91px; width: 90px; text-align: center; color: {RED}; {SPREAD_R}">
  <div style="font-family: {GOTH}; font-size: 14px; letter-spacing: 0.14em; line-height: 1">SAILING</div>
  <div style="font-family: {GOTH}; font-size: 14px; letter-spacing: 0.14em; line-height: 1; margin-top: 2px">SINCE</div>
  <div style="font-family: {DISP}; font-size: 23px; line-height: 1; margin-top: 3px">1964</div></div>
<div style="position: absolute; left: {L - 1}px; top: {ART_Y - 1}px; width: {TW + 2}px; height: {ART_H + 2}px; box-sizing: border-box; border: 1px solid {BLUE}; overflow: hidden">
  <img src="assets/boat-art.png" alt="The excursion boat leaving the town pier, drawn in pen and ink" style="position: absolute; left: 0; top: {-CROP}px; width: {TW}px; height: 252px; display: block"></div>
<div style="position: absolute; left: {L}px; top: {ART_Y + ART_H + 7}px; width: {TW}px; display: flex; justify-content: space-between; align-items: baseline">
  <div style="font-style: italic; font-size: 15px">The Cape Bay Queen leaving the Town Pier.</div>
  <div style="font-family: {GOTH}; font-size: 14px; letter-spacing: 0.08em">U.S.C.G. INSPECTED, 149 PASSENGERS</div></div>
<div style="position: absolute; left: {L}px; top: {COL_Y}px; width: {LCW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 5px">
    {kick('DAILY SAILINGS', RED, 18, 0.14)}<div style="font-style: italic; font-size: 15px">June 16 to Labor Day</div></div>
  {sail_row('Harbor and seal cruise', '1 HOUR', 'Round Seal Ledge and the bell buoy. Seals most days, mermaids never promised.', ['10:00', '12:00', '2:00', '4:00'], True)}
  {sail_row('Sunset supper cruise', '2 HOURS', 'Round Gull Island as the sun goes down, with supper from the galley.', ['6:30 P.M.'])}
  <div style="border-top: 2px solid {BLUE}; padding-top: 7px; font-style: italic; font-size: 15px; line-height: 1.3">Island runs by small boat, ask for Jack at the fuel dock.</div>
</div>
{kick('HARBOR CHART', RED, 18, 0.14, f'position: absolute; left: {CHX}px; top: {COL_Y}px')}
{chart}
<div style="position: absolute; left: {CHX + 6}px; top: {CHY + CHH - 44}px; box-sizing: border-box; padding: 4px 7px 3px; background: {PAPER}; border: 1px solid {BLUE}; font-family: {GOTH}; font-size: 13px; letter-spacing: 0.05em; line-height: 1.3">
  <div>{legend_dots(5)}&nbsp; SEAL CRUISE</div>
  <div>{legend_dots(dash=True)}&nbsp; SUPPER CRUISE</div></div>
<div style="position: absolute; left: {L}px; top: {BAND_Y}px; width: 222px; height: {808 - BAND_Y}px; box-sizing: border-box; border: 2px solid {BLUE}; padding: 14px 12px 0 13px; font-family: {GOTH}; font-size: 17px; line-height: 1.32; letter-spacing: 0.02em">
  <div style="position: absolute; left: 9px; top: -11px; background: {PAPER}; padding: 0 6px">{kick('FARES', RED, 18, 0.14)}</div>
  {fares}</div>
<div style="position: absolute; left: {L + 236}px; top: {BAND_Y}px; width: {TW - 236}px; height: {808 - BAND_Y}px; box-sizing: border-box; border: 2px solid {RED}; padding: 14px 12px 0 13px; font-family: {GOTH}; font-size: 17px; line-height: 1.32; letter-spacing: 0.02em">
  <div style="position: absolute; left: 9px; top: -11px; background: {PAPER}; padding: 0 6px">{kick('ON BOARD, PLEASE', RED, 18, 0.14)}</div>
  {rules}</div>
<div style="position: absolute; left: {L}px; top: 812px; width: {TW}px; display: flex; justify-content: space-between; align-items: baseline">
  <div style="font-family: {GOTH}; font-size: 12px; letter-spacing: 0.08em">TICKETS AT THE BOOTH ON THE TOWN PIER. SUPPER IS EXTRA.</div>
  {kick('GALLEY MENU OVER', RED, 12, 0.14)}</div>
'''

# ======================================================================== BACK
def item(name, desc, price, top=12, note=None, size=20):
    n = f'<div style="margin-top: 2px; font-style: italic; font-size: 15px; line-height: 1.3; color: {RED}; {SPREAD_R}">{esc(note)}</div>' if note else ''
    d = f'<div style="margin-top: 2px; font-size: 16px; line-height: 1.28">{esc(desc)}</div>' if desc else ''
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; align-items: baseline; gap: 6px">
        <div style="font-weight: 700; font-size: {size}px; line-height: 1.12">{esc(name)}</div>
        <div style="flex: 1; border-bottom: 1px dotted {BLUE}; transform: translateY(-5px); min-width: 8px"></div>
        <div style="font-family: {GOTH}; font-size: 20px; line-height: 1; white-space: nowrap">{esc(price)}</div></div>{d}{n}</div>'''

def head(t, top=0):
    return f'''<div style="margin-top: {top}px; display: flex; align-items: center; gap: 8px">
      {kick(t, RED, 18, 0.14)}<div style="flex: 1; height: 2px; background: {RED}"></div></div>'''

LEFT = (head('RAW BAR')
        + item('Cape oysters', 'Opened to order, on crushed ice. Shallots in red wine vinegar, cracked pepper and lemon.', '6 for 6.50', 7)
        + item('Clam chowder', 'Chopped quahogs, salt pork, potato and onion in a creamy broth.', 'cup 1.25', 11)
        + head('FROM THE FRYER', 15)
        + item('Fish and fries', 'White fish in a cold lager batter, cooked golden. Thick-cut potatoes done twice. Tartar sauce and lemon.', '5.25', 7, 'In a paper cone. Hold on at the rail.')
        + item('Fried clam strips', 'In cracker meal, tartar sauce.', '3.95', 11))

KIDS = f'''<div style="margin-top: 17px; position: relative; box-sizing: border-box; border: 1px solid {BLUE}; padding: 11px 10px 8px">
  <div style="position: absolute; left: 8px; top: -10px; background: {PAPER}; padding: 0 5px">{kick('DECKHANDS UNDER 12', RED, 16, 0.12)}</div>
  {item('Hot dog and chips', 'Grilled frank, toasted bun.', '1.75', 0, None, 18)}
  {item('Grilled cheese', 'American cheese on white.', '1.50', 6, None, 18)}
  <div style="margin-top: 4px; font-style: italic; font-size: 14px; line-height: 1.3; color: {RED}; {SPREAD_R}">Small lemonade or milk with either.</div></div>'''

def pair(a, pa, b, pb, top=8):
    one = lambda n, p_: f'''<div style="flex: 1; display: flex; align-items: baseline; gap: 5px"><div style="font-weight: 700; font-size: 17px; white-space: nowrap">{n}</div>
      <div style="flex: 1; border-bottom: 1px dotted {BLUE}; transform: translateY(-5px); min-width: 6px"></div><div style="font-family: {GOTH}; font-size: 19px">{p_}</div></div>'''
    return f'<div style="margin-top: {top}px; display: flex; gap: 14px">{one(a, pa)}{one(b, pb)}</div>'

RIGHT = (head('SWEETS')
         + item('Deep blue gelatin', 'Sweet coconut cream set firm, a clear sea-colored layer poured over, gummy fish on top.', '1.25', 7)
         + KIDS
         + head('BAR AND FOUNTAIN', 15)
         + item('Blue lagoon', 'Vodka and blue curaçao on ice, lemon-lime soda, a lemon wheel.', '3.25', 7, 'Sunset cruise only. Must be 20.')
         + pair('Lemonade', '.75', 'Coffee', '.50', 9))

TIDES = [('Sat 16', '10:41', '11:02'), ('Sun 17', '11:29', '11:51'), ('Mon 18', '12:16', '12:39'), ('Tue 19', '12:58', '1:24'), ('Wed 20', '1:41', '2:07'), ('Thu 21', '2:25', '2:52'), ('Fri 22', '3:11', '3:38')]
tide_cells = ''.join(f'''<div style="flex: 1; text-align: center; border-left: {'0' if i == 0 else '1px'} solid rgba(30,58,128,0.6); font-family: {GOTH}; font-size: 13px; line-height: 1.22; letter-spacing: 0.03em">
   <div style="color: {RED}; {SPREAD_R}">{d.upper()}</div><div>{a} / {p}</div></div>''' for i, (d, a, p) in enumerate(TIDES))

BOX_Y, BOX_H = 146, 160
COLS_Y = BOX_Y + BOX_H + 20
back = f'''
{bar(0, 0, FW, 120, BLUE)}
<div style="position: absolute; left: {L}px; top: 40px; width: {TW}px; color: {PAPER}; {SPREAD_P}">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    <div style="font-family: {DISP}; font-size: 44px; line-height: 1">The Galley</div>
    <div style="font-family: {GOTH}; font-size: 16px; letter-spacing: 0.16em">CAPE BAY EXCURSION LINE</div></div>
  <div style="margin-top: 8px; font-style: italic; font-size: 17px; line-height: 1.3">Open on every sailing. Order at the counter, lower deck aft.</div>
</div>
{bar(0, 120, FW, 5, RED)}
<div style="position: absolute; left: {L}px; top: {BOX_Y}px; width: {TW}px; height: {BOX_H}px; box-sizing: border-box; border: 2px solid {RED}"></div>
<div style="position: absolute; left: {L + 12}px; top: {BOX_Y - 11}px; background: {PAPER}; padding: 0 7px">{kick('SUNSET SUPPER CRUISE, 6:30 NIGHTLY', RED, 18, 0.14)}</div>
<img src="assets/lobster.png" alt="Lobster, drawn in two inks" style="position: absolute; left: {L + 4}px; top: {BOX_Y + 20}px; width: 184px; height: 125px; display: block">
<div style="position: absolute; left: {L + 192}px; top: {BOX_Y + 18}px; width: {TW - 206}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    <div style="font-family: {DISP}; font-size: 21px; line-height: 1.08">Whole boiled lobster</div>
    <div style="font-family: {GOTH}; font-size: 24px; line-height: 1">12.95</div></div>
  <div style="font-family: {GOTH}; font-size: 15px; letter-spacing: 0.08em; margin-top: 4px">ABOUT 1&frac34; LB, FROM THE TANK</div>
  <div style="margin-top: 3px; font-size: 16px; line-height: 1.28">Split, brushed with garlic butter and finished under the broiler. Drawn butter, lemon, a cracker, a pick and a bib.</div>
  <div style="margin-top: 3px; font-style: italic; font-size: 15px; line-height: 1.3; color: {RED}; {SPREAD_R}">Most guests leave the shell.</div>
</div>
<div style="position: absolute; left: {L}px; top: {COLS_Y}px; width: 236px">{LEFT}</div>
<div style="position: absolute; left: {L + 256}px; top: {COLS_Y}px; width: 236px">{RIGHT}</div>
<div style="position: absolute; left: {L}px; top: 748px; width: {TW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline; border-top: 2px solid {BLUE}; padding-top: 5px">
    {kick('HIGH WATER AT THE TOWN PIER, JUNE 16 TO 22', RED, 15, 0.1)}<div style="font-family: {GOTH}; font-size: 13px; letter-spacing: 0.06em">A.M. / P.M.</div></div>
  <div style="display: flex; margin-top: 4px">{tide_cells}</div>
</div>
<div style="position: absolute; left: {L}px; top: 803px; width: {TW}px; border-top: 1px solid {BLUE}; padding-top: 4px; display: flex; justify-content: space-between; align-items: baseline">
  <div style="font-size: 13px; font-style: italic; line-height: 1.2">Cash only at the counter. Lost wallets kept at the booth.</div>
  <div style="font-family: {GOTH}; font-size: 12px; letter-spacing: 0.06em; line-height: 1.2">PRINTED IN U.S.A. 25M 5/84</div></div>
'''

FACES = {'front': front, 'back': back}
for name, inner in FACES.items():
    body = root(inner, name)
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>Cape Bay Excursion Line, {name}</title>{LINK}<style>body{{margin:0;background:{PAPER}}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "oceansupper", "fn": "fmtOceanSupper", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [152.4, 228.6], "fonts": FONTS, "fams": ["Ultra", "Old Standard TT", "Pathway Gothic One"],
           "phone": {"disp": "'Ultra',serif", "title": "'Ultra',serif", "name": "'Old Standard TT',serif",
                     "body": "'Old Standard TT',serif", "price": "'Pathway Gothic One',sans-serif", "note": "'Old Standard TT',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)

LABELS = {"Splash (1984)": {
  "Oysters natural": {"n": "Cape oysters", "d": "Opened to order, on crushed ice. Shallots in red wine vinegar, cracked pepper and lemon.", "note": "Six for 6.50 at the raw bar."},
  "Fish and chip cones": {"n": "Fish and fries", "d": "White fish in a cold lager batter, cooked golden. Thick-cut potatoes done twice for crunch. Tartar sauce and lemon, in a paper cone.", "note": "Hold on to the cone at the rail."},
  "Whole lobster": {"n": "Whole boiled lobster", "d": "About 1¾ lb, split, brushed with garlic butter and finished under the broiler. Drawn butter, lemon, a cracker, a pick and a bib.", "note": "Most guests leave the shell."},
  "Ocean blue jelly cups": {"n": "Deep blue gelatin", "d": "Sweet coconut cream set firm, a clear sea-colored layer poured over, gummy fish on top.", "note": "From the galley on every sailing."},
  "Blue lagoon": {"n": "Blue lagoon", "d": "Vodka and blue curaçao over ice, topped with lemon-lime soda and a lemon wheel.", "note": "Sunset cruise only. Must be 20."}}}
json.dump(LABELS, open(os.path.join(D, 'oceansupper.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
