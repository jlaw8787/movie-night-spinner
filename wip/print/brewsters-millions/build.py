"""Hackensack Bulls scorecard and bill of fare, Brewster's Millions (1985).
Scorecard fold: two landscape faces 1344x960, each two 672px panels folded at the centre. Outside is the
cover and the scorecard; inside is the painted ballpark plan with numbered stands and the bill of fare.
Handed out at the Bulls' exhibition night against New York, the game Monty pays for. Run paint.py first.
Writes outside.html, inside.html (plus .body.html), film.json and spenditall.labels.json."""
import os, json, html

D = os.path.dirname(os.path.abspath(__file__))
W, H, P = 1344, 960, 672
PAPER, GREEN, RED, MUTE, CARD, PENCIL = '#f3e3ad', '#123f2b', '#b3302a', '#3b4636', '#fbf3d6', '#4a4a52'
FONTS = ('family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,700'
         '&family=Libre+Franklin:ital,wght@0,400;0,600;0,800;1,400'
         '&family=Homemade+Apple')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
BOD = "font-family: 'Bodoni Moda', 'Didot', serif"
SANS = "font-family: 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
HAND = "font-family: 'Homemade Apple', cursive"
MARKS = json.load(open(os.path.join(D, 'assets', 'stands.json')))
CHAMP = "Monty's champagne cocktails for the bar"

# spec key -> printed name, description, price, phone note
SPEC = {
    "Prawn cocktail for the whole hotel": ("Shrimp Cocktail",
        "Six, poached and chilled, on shredded iceberg with rosy tomato mayonnaise, lemon and paprika.", "6.50",
        "Passed through the box seats all night."),
    "Caviar blini": ("Red Caviar Blini",
        "Buckwheat pancakes, cr&#232;me fra&#238;che, salmon roe, chives.", "9.00",
        "Made to order. Allow twenty minutes."),
    "Surf and turf": ("Surf and Turf",
        "An eight ounce filet mignon seared to order and a lobster tail broiled in garlic butter. B&#233;arnaise.", "30.00",
        "The most expensive thing on the card. Thirty even."),
    "Rare stamp shortbread": ("Postage Stamps",
        "Pinked butter shortbread, each iced like a stamp. Six.", "2.50",
        "Iced like the real thing. Do not mail."),
    "Monty's champagne cocktails for the bar": ("Champagne Cocktail",
        "A sugar cube soaked in bitters, orange liqueur, chilled brut to the brim and a twist of peel.", "4.50",
        "The whole bar, on Monty."),
}
ADD = {
    'chili': ("Spike&#8217;s Chili Dogs", "Two franks, beef chili, chopped onion and sharp cheddar.", "2.50"),
    'icecream': ("Ice Cream Cup", "Vanilla malted, frozen hard, with a wooden spoon.", "1.00"),
    'peanuts': ("Roasted Peanuts", "Hot in the shell from the vendor&#8217;s cart.", ".75"),
    'beer': ("Draft Beer", "Ice cold, poured to the line in a tall paper cup.", "1.75"),
    'lemonade': ("Fresh Lemonade", "Squeezed at the stand, over ice.", ".90"),
}



def item(n, d, p, top=12):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">'
            f'<div style="{BOD}; font-weight: 700; font-size: 27px; line-height: 1.1; color: {GREEN}; white-space: nowrap">{n}</div>'
            f'<div style="flex: 1; border-bottom: 2px dotted {GREEN}; opacity: 0.45; transform: translateY(-6px)"></div>'
            f'<div style="{BOD}; font-weight: 700; font-size: 27px; color: {RED}; white-space: nowrap">{p}</div></div>'
            f'<div style="{SANS}; font-size: 20px; line-height: 1.34; margin-top: 2px; color: {MUTE}; text-wrap: pretty">{d}</div></div>')


def S(k, top=9):
    n, d, p, _ = SPEC[k]
    return item(n, d, p, top)


def A(k, top=9):
    return item(*ADD[k], top=top)


def kicker(t, color=RED, size=18):
    return f'<div style="{SANS}; font-weight: 800; font-size: {size}px; letter-spacing: 0.2em; text-transform: uppercase; color: {color}; white-space: nowrap">{t}</div>'


def disc(n, size=42, fs=26):
    return (f'<div style="width: {size}px; height: {size}px; flex: none; border-radius: 50%; background: {RED}; color: {CARD}; border: 3px solid {CARD}; '
            f'box-shadow: 0 0 0 2px {RED}; box-sizing: border-box; display: flex; align-items: center; justify-content: center; '
            f'{BOD}; font-weight: 900; font-size: {fs}px; line-height: 1">{n}</div>')


def stand(n, t, sub, top=18):
    """Section title keyed to the numbered stands on the ballpark plan."""
    return (f'<div style="margin-top: {top}px; display: flex; align-items: center; gap: 14px; border-bottom: 3px solid {GREEN}; padding-bottom: 6px">'
            f'{disc(n, 38, 24)}<div style="{BOD}; font-weight: 900; font-size: 36px; line-height: 1; color: {GREEN}; white-space: nowrap">{t}</div>'
            f'<div style="margin-left: auto">{kicker(sub, MUTE, 15)}</div></div>')


def face(left, right, extra=''):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {GREEN}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {P}px; height: {H}px; display: block; opacity: 0.5">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {P}px; top: 0; width: {P}px; height: {H}px; display: block; opacity: 0.5">'
            f'<img src="assets/paper-wear.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 14px; background: {GREEN}"></div>'
            f'<div style="position: absolute; left: 0; top: 14px; width: {W}px; height: 4px; background: {RED}"></div>'
            f'<div style="position: absolute; left: 0; bottom: 0; width: {W}px; height: 14px; background: {GREEN}"></div>'
            f'<div style="position: absolute; left: 0; bottom: 14px; width: {W}px; height: 4px; background: {RED}"></div>'
            f'<section style="position: absolute; left: 56px; top: 50px; width: 560px; height: 860px; display: flex; flex-direction: column">{left}</section>'
            f'<section style="position: absolute; left: {P + 56}px; top: 50px; width: 560px; height: 860px; display: flex; flex-direction: column">{right}</section>'
            f'{extra}</div>')


# ---------- outside: back cover (scorecard) and front cover ----------
def cell(w, content='', bold=False, right=True, bg='transparent', color=GREEN, fs=16, font=SANS):
    return (f'<div style="width: {w}px; height: 30px; flex: none; box-sizing: border-box; border-right: {"1px solid " + GREEN if right else "0"}; background: {bg}; '
            f'display: flex; align-items: center; justify-content: center; {font}; font-size: {fs}px; font-weight: {800 if bold else 400}; color: {color}; white-space: nowrap">{content}</div>')


def diamond():
    return f'<div style="width: 11px; height: 11px; border: 1px solid {GREEN}; opacity: 0.55; transform: rotate(45deg)"></div>'


def scorecard():
    inn = ''.join(cell(36, str(i), True, bg=GREEN, color=PAPER) for i in range(1, 10))
    line_head = f'<div style="display: flex">{cell(128, "TEAM", True, bg=GREEN, color=PAPER)}{inn}{cell(32, "R", True, bg=GREEN, color=PAPER)}{cell(32, "H", True, bg=GREEN, color=PAPER)}{cell(44, "E", True, False, GREEN, PAPER)}</div>'
    line_rows = ''.join(f'<div style="display: flex; border-top: 1px solid {GREEN}">{cell(128, t, True)}{"".join(cell(36) for _ in range(9))}{cell(32)}{cell(32)}{cell(44, right=False)}</div>' for t in ('NEW YORK', 'BULLS'))
    line = f'<div style="margin-top: 16px; border: 2px solid {GREEN}">{line_head}{line_rows}</div>'
    pos = ['CF', '2B', 'SS', 'LF', 'C', '1B', 'RF', '3B', 'P']
    pencil = {4: 'Nolan', 8: 'Brewster'}
    ghead = (f'<div style="display: flex">{cell(30, "#", True, bg=GREEN, color=PAPER)}{cell(148, "BULLS BATTING", True, bg=GREEN, color=PAPER, fs=14)}'
             f'{cell(46, "POS", True, bg=GREEN, color=PAPER, fs=14)}{"".join(cell(37, str(i), True, bg=GREEN, color=PAPER) for i in range(1, 10))}</div>')
    rows = ''
    for i, p_ in enumerate(pos):
        nm = f'<span style="{HAND}; font-size: 15px; color: {PENCIL}; transform: translateY(2px)">{pencil[i]}</span>' if i in pencil else ''
        rows += (f'<div style="display: flex; border-top: 1px solid {GREEN}">{cell(30, str(i + 1), True)}'
                 f'<div style="width: 148px; height: 30px; flex: none; box-sizing: border-box; border-right: 1px solid {GREEN}; padding-left: 10px; display: flex; align-items: center; overflow: hidden">{nm}</div>'
                 f'{cell(46, p_, True)}{"".join(cell(37, diamond(), right=(k < 8)) for k in range(9))}</div>')
    grid = f'<div style="margin-top: 16px; border: 2px solid {GREEN}">{ghead}{rows}</div>'
    return (kicker('Keep score at your seat') +
            f'<div style="{BOD}; font-weight: 900; font-size: 44px; line-height: 1; margin-top: 8px; white-space: nowrap">BULLS <span style="font-style: italic; font-weight: 700; color: {RED}">vs</span> NEW YORK</div>'
            + line + grid +
            stand('4', 'THE BAR', 'Beer garden, left field', 24) + S(CHAMP, 10) + A('beer') + A('lemonade'))


def ticket():
    return (f'<div style="position: absolute; left: {P + 26}px; top: 318px; width: 214px; transform: rotate(-6deg); display: flex; background: {CARD}; '
            f'border: 2px solid {RED}; box-shadow: 0 3px 8px rgba(40,30,10,0.35)">'
            f'<div style="flex: 1; padding: 9px 10px 9px 14px; border-right: 2px dashed {RED}">'
            f'<div style="{SANS}; font-weight: 800; font-size: 14px; letter-spacing: 0.2em; color: {RED}">ADMIT ONE</div>'
            f'<div style="{BOD}; font-weight: 900; font-size: 22px; line-height: 1.1; color: {GREEN}; margin-top: 2px">EXHIBITION</div>'
            f'<div style="{SANS}; font-weight: 600; font-size: 14px; color: {MUTE}; margin-top: 3px">Will call: A. Drake</div></div>'
            f'<div style="width: 46px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: {RED}; color: {CARD}">'
            f'<div style="{SANS}; font-weight: 800; font-size: 14px; letter-spacing: 0.1em">GATE</div>'
            f'<div style="{BOD}; font-weight: 900; font-size: 26px; line-height: 1">30</div></div></div>')


def button():
    return (f'<div style="position: absolute; left: {P + 506}px; top: 548px; width: 132px; height: 132px; border-radius: 50%; transform: rotate(8deg); '
            f'background: radial-gradient(circle at 38% 30%, #ffffff 0%, #f6f1e6 55%, #dcd4c2 100%); border: 9px solid {RED}; box-sizing: border-box; '
            f'box-shadow: 0 4px 9px rgba(30,20,10,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center">'
            f'<div style="{SANS}; font-weight: 800; font-size: 14px; letter-spacing: 0.3em; color: {RED}; margin-left: 0.3em">VOTE</div>'
            f'<div style="{SANS}; font-weight: 800; font-size: 16px; line-height: 1.05; color: #1d2f6b; margin-top: 2px">NONE OF<br>THE ABOVE</div>'
            f'<div style="{SANS}; font-size: 14px; color: {RED}; margin-top: 1px">&#9733; &#9733; &#9733;</div></div>')


def stamp():
    return (f'<div style="position: absolute; left: {P + 300}px; top: 738px; transform: rotate(-8deg); border: 3px solid {RED}; padding: 5px 12px 4px; opacity: 0.85; text-align: center">'
            f'<div style="{SANS}; font-weight: 800; font-size: 22px; letter-spacing: 0.12em; color: {RED}; line-height: 1">PAID IN FULL</div>'
            f'<div style="{SANS}; font-weight: 600; font-size: 14px; letter-spacing: 0.2em; color: {RED}; margin-top: 3px; border-top: 1.5px solid {RED}; padding-top: 3px">ACCOUNT M.B.</div></div>')


def cover():
    return (f'<div style="display: flex; justify-content: space-between">{kicker("Hackensack, New Jersey")}{kicker("1985", GREEN)}</div>'
            f'<div style="{BOD}; font-weight: 900; font-size: 68px; line-height: 0.95; letter-spacing: -0.01em; margin-top: 10px">HACKENSACK<br>BULLS</div>'
            f'<div style="margin-top: 12px; padding-top: 10px; border-top: 4px solid {RED}">{kicker("Official scorecard and bill of fare", GREEN, 18)}</div>'
            f'<div style="margin-top: 22px; border: 3px solid {RED}; padding: 7px; background: {CARD}">'
            f'<img src="assets/still-battery.jpg" alt="Monty Brewster and Spike Nolan in Bulls uniforms at home plate, the crowd behind them" style="display: block; width: 540px; height: 314px"></div>'
            f'<div style="{SANS}; font-style: italic; font-size: 16px; color: {MUTE}; margin-top: 7px">Our battery, Brewster and Nolan, at home plate.</div>'
            f'<div style="{BOD}; font-style: italic; font-weight: 700; font-size: 30px; line-height: 1.2; margin-top: 26px">Exhibition Night. Bulls vs New York.<br><span style="color: {RED}">Everything in the park is on Monty.</span></div>'
            f'<div style="margin-top: auto; border-top: 2px solid {GREEN}; padding-top: 8px; {SANS}; font-size: 16px; line-height: 1.45; color: {MUTE}">'
            f'Prices subject to change. Please, no souvenirs. Box 1 held for Granville &amp; Baxter.<br>Form HB-300M. &#169; 1985 Hackensack Bulls Baseball Club.</div>')


# ---------- inside: ballpark plan and bill of fare ----------
def plan():
    k = 540 / 576
    pins = ''
    for key, lab in (('1', ''), ('2', ''), ('3', ''), ('4', '')):
        x, y = MARKS[key]
        pins += f'<div style="position: absolute; left: {round(x * k) - 19}px; top: {round(y * k) - 19}px">{disc(key, 38, 22)}</div>'
    gx, gy = MARKS['gate']
    pins += (f'<div style="position: absolute; left: {round(gx * k) - 50}px; top: {round(gy * k) - 26}px; width: 100px; text-align: center; {SANS}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; color: {RED}">GATE 30</div>')
    bx, by = MARKS['board']
    pins += (f'<div style="position: absolute; left: {round(bx * k) - 60}px; top: {round(by * k) - 15}px; width: 120px; text-align: center; {BOD}; font-weight: 900; font-size: 15px; letter-spacing: 0.24em; color: #e7c35a">BULLS</div>')
    return (f'<div style="position: relative; width: 540px; height: 548px; margin: 10px auto 0">'
            f'<img src="assets/ballpark-plan.png" alt="Painted plan of the Bulls ballpark from above: the diamond and outfield, the grandstand behind home plate, the scoreboard in centre field, the beer garden in left and Gate 30 in right, with the food stands numbered 1 to 4" style="display: block; width: 540px; height: 548px">'
            f'{pins}</div>')


def inside_left():
    return (kicker('Where to eat tonight') +
            f'<div style="{BOD}; font-weight: 900; font-size: 44px; line-height: 1; margin-top: 8px">FIND YOUR STAND</div>'
            + plan() +
            f'<div style="margin-top: auto; display: flex; gap: 18px; align-items: flex-end">'
            f'<div style="flex: 1; {SANS}; font-size: 19px; line-height: 1.42; color: {GREEN}">Every frank, shrimp and glass of champagne in this park is on me tonight. '
            f'Order the most expensive thing on the card. Then order it again.</div>'
            f'<div style="width: 200px; flex: none; text-align: right"><div style="{HAND}; font-size: 24px; line-height: 1.2; color: #1d2f6b; transform: rotate(-4deg)">Monty Brewster</div>'
            f'<div style="{SANS}; font-size: 15px; color: {MUTE}; margin-top: 10px">Starting pitcher</div></div></div>')


def inside_right():
    return (kicker('Served all nine innings') +
            f'<div style="{BOD}; font-weight: 900; font-size: 52px; line-height: 1; margin-top: 8px">BILL OF FARE</div>'
            + stand('1', 'BOX SEATS', 'Behind home plate', 6) + S('Prawn cocktail for the whole hotel', 10) + S('Caviar blini')
            + stand('2', 'THE GRILL', 'First base side') + S('Surf and turf', 10) + A('chili')
            + stand('3', 'SWEETS', 'Third base side') + S('Rare stamp shortbread', 10) + A('icecream') + A('peanuts'))


faces = {'outside': face(scorecard(), cover(), ticket() + button() + stamp()),
         'inside': face(inside_left(), inside_right())}
for name, b in faces.items():
    open(os.path.join(D, name + '.body.html'), 'w').write(b + '\n')
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Hackensack Bulls scorecard, {name}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{b}</body></html>')

json.dump({"fmt": "spenditall", "fn": "fmtSpendItAll", "faces": ["outside.html", "inside.html"], "names": ["Outside", "Inside"],
           "mm": [355.6, 254], "fonts": FONTS, "fams": ["Bodoni Moda", "Libre Franklin", "Homemade Apple"],
           "phone": {"disp": "'Bodoni Moda',serif", "title": "'Bodoni Moda',serif", "name": "'Bodoni Moda',serif",
                     "body": "'Libre Franklin',sans-serif", "price": "'Bodoni Moda',serif", "note": "'Libre Franklin',sans-serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Brewster's Millions (1985)": {k: {"n": html.unescape(v[0]), "d": html.unescape(v[1]), "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'spenditall.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
