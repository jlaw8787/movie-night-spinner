"""Hackensack Bulls ballpark bill of fare, Brewster's Millions (1985).
Two-sided US Letter card handed out at the Bulls' exhibition night against New York, the game Monty
pays for, with everything in the park on him. Locked house style (Jurassic system). Run paint.py first.
Writes front.html, back.html (plus .body.html), film.json and spenditall.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, GREEN, RED, MUTE, CARD = '#f3e3ad', '#123f2b', '#b3302a', '#3b4636', '#fbf3d6'
FONTS = ('family=Bodoni+Moda:opsz,wght@6..96,700;6..96,900'
         '&family=Libre+Franklin:ital,wght@0,400;0,600;0,800;1,400'
         '&family=Homemade+Apple')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
BOD = "font-family: 'Bodoni Moda', 'Didot', serif"
SANS = "font-family: 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
HAND = "font-family: 'Homemade Apple', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
    "Prawn cocktail for the whole hotel": ("Jumbo Shrimp Cocktail",
        "Six, poached and chilled, on shredded iceberg with rosy tomato mayonnaise, lemon and paprika.", "6.50",
        "Passed through the box seats all night."),
    "Caviar blini": ("Blini with Red Caviar",
        "Warm buckwheat pancakes with cr&#232;me fra&#238;che, salmon roe and chives.", "9.00",
        "Made to order. Allow twenty minutes."),
    "Surf and turf": ("Surf and Turf",
        "An eight ounce filet mignon seared to order and a lobster tail broiled in garlic butter. B&#233;arnaise.", "30.00",
        "The most expensive thing on the card. Thirty even."),
    "Rare stamp shortbread": ("Postage Stamps",
        "Butter shortbread cut with a pinked edge, each piped with an iced stamp. Six to a plate.", "2.50",
        "Iced like the real thing. Do not mail."),
    "Monty's champagne cocktails for the bar": ("Champagne Cocktail",
        "A sugar cube soaked in bitters, orange liqueur, chilled brut to the brim and a twist of peel.", "4.50",
        "The whole bar, on Monty."),
}
ADD = {
    'chili': ("Spike&#8217;s Chili Dogs", "Two franks under beef chili, chopped onion and sharp cheddar, on toasted buns.", "2.50"),
    'icecream': ("Ice Cream Cup", "Vanilla malted, frozen hard, eaten with a flat wooden spoon.", "1.00"),
    'peanuts': ("Roasted Peanuts", "Hot in the shell from the vendor&#8217;s cart. Toss the shells.", ".75"),
    'beer': ("Draft Beer", "Ice cold, poured to the line in a tall paper cup.", "1.75"),
    'lemonade': ("Fresh Lemonade", "Squeezed at the stand, plenty of ice.", ".90"),
}


def item(n, d, p, top=18):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">'
            f'<div style="{BOD}; font-weight: 700; font-size: 27px; line-height: 1.1; color: {GREEN}">{n}</div>'
            f'<div style="{BOD}; font-weight: 700; font-size: 27px; color: {RED}; white-space: nowrap">{p}</div></div>'
            f'<div style="{SANS}; font-size: 20px; line-height: 1.36; margin-top: 4px; color: {MUTE}; text-wrap: pretty">{d}</div></div>')


def S(k, top=18):
    n, d, p, _ = SPEC[k]
    return item(n, d, p, top)


def A(k, top=18):
    return item(*ADD[k], top=top)


def kicker(t, color=RED, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {color}; white-space: nowrap; {extra}">{t}</div>'


def pennant(t, kick):
    """Section title on a green swallowtail pennant, kicker above in red spaced caps."""
    return (f'{kicker(kick, extra="font-size: 16px; letter-spacing: 0.18em")}'
            f'<div style="display: flex; margin-top: 8px">'
            f'<div style="background: {GREEN}; color: {PAPER}; height: 58px; padding: 0 16px 0 20px; {BOD}; font-weight: 900; font-size: 40px; line-height: 60px; letter-spacing: 0.01em; white-space: nowrap">{t}</div>'
            f'<div style="width: 0; height: 0; border-top: 29px solid {GREEN}; border-bottom: 29px solid {GREEN}; border-right: 24px solid transparent"></div></div>')


def footer(left, right):
    return (f'<div style="margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; border-top: 2px solid {GREEN}; padding-top: 8px">'
            f'<div style="{SANS}; font-size: 16px; color: {MUTE}">{left}</div>'
            f'<div style="{SANS}; font-weight: 600; font-size: 16px; color: {MUTE}; white-space: nowrap">{right}</div></div>')


def shell(inner, extra=''):
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {GREEN}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.5">'
            f'<img src="assets/paper-wear.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {GREEN}"></div>'
            f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; height: 4px; background: {RED}"></div>'
            f'<div style="position: absolute; left: 0; bottom: 0; width: {W}px; height: 16px; background: {GREEN}"></div>'
            f'<div style="position: absolute; left: 0; bottom: 16px; width: {W}px; height: 4px; background: {RED}"></div>'
            f'<section style="position: absolute; left: 64px; top: 52px; width: 688px; height: 952px; display: flex; flex-direction: column">{inner}</section>{extra}</div>')


def ticket():
    return (f'<div style="position: absolute; left: 34px; top: 238px; width: 214px; transform: rotate(-6deg); display: flex; background: {CARD}; '
            f'border: 2px solid {RED}; box-shadow: 0 3px 8px rgba(40,30,10,0.35)">'
            f'<div style="flex: 1; padding: 9px 10px 9px 14px; border-right: 2px dashed {RED}">'
            f'<div style="{SANS}; font-weight: 800; font-size: 14px; letter-spacing: 0.2em; color: {RED}">ADMIT ONE</div>'
            f'<div style="{BOD}; font-weight: 900; font-size: 22px; line-height: 1.1; color: {GREEN}; margin-top: 2px">EXHIBITION</div>'
            f'<div style="{SANS}; font-weight: 600; font-size: 14px; color: {MUTE}; margin-top: 3px">Will call: A. Drake</div></div>'
            f'<div style="width: 46px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: {RED}; color: {CARD}">'
            f'<div style="{SANS}; font-weight: 800; font-size: 14px; letter-spacing: 0.1em">GATE</div>'
            f'<div style="{BOD}; font-weight: 900; font-size: 26px; line-height: 1">30</div></div></div>')


def button():
    return (f'<div style="position: absolute; left: 632px; top: 470px; width: 132px; height: 132px; border-radius: 50%; transform: rotate(8deg); '
            f'background: radial-gradient(circle at 38% 30%, #ffffff 0%, #f6f1e6 55%, #dcd4c2 100%); border: 9px solid {RED}; box-sizing: border-box; '
            f'box-shadow: 0 4px 9px rgba(30,20,10,0.4); display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center">'
            f'<div style="{SANS}; font-weight: 800; font-size: 14px; letter-spacing: 0.3em; color: {RED}; margin-left: 0.3em">VOTE</div>'
            f'<div style="{SANS}; font-weight: 800; font-size: 16px; line-height: 1.05; color: #1d2f6b; margin-top: 2px">NONE OF<br>THE ABOVE</div>'
            f'<div style="{SANS}; font-size: 14px; color: {RED}; margin-top: 1px">&#9733; &#9733; &#9733;</div></div>')


def front():
    head = (f'<div style="display: flex; justify-content: space-between; align-items: baseline">'
            f'{kicker("Hackensack, New Jersey")}{kicker("Exhibition Night", GREEN)}</div>'
            f'<div style="{BOD}; font-weight: 900; font-size: 66px; line-height: 1; letter-spacing: -0.01em; margin-top: 10px; white-space: nowrap">HACKENSACK BULLS</div>'
            f'<div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 8px">'
            f'<div style="{SANS}; font-weight: 800; font-size: 22px; letter-spacing: 0.24em; color: {GREEN}">BALLPARK BILL OF FARE</div>'
            f'<div style="{SANS}; font-style: italic; font-size: 18px; color: {MUTE}">Served in the stands, all nine innings</div></div>'
            f'<div style="height: 4px; background: {RED}; margin-top: 12px"></div>')
    hero = (f'<div style="margin-top: 18px; border: 3px solid {RED}; padding: 7px; background: {CARD}">'
            f'<img src="assets/still-battery.jpg" alt="Monty Brewster and Spike Nolan in Bulls uniforms at home plate, the crowd behind them" style="display: block; width: 668px; height: 312px"></div>'
            f'<div style="display: flex; justify-content: space-between; margin-top: 7px; {SANS}; font-size: 16px; color: {MUTE}">'
            f'<div style="font-style: italic">Our battery, Brewster and Nolan, at home plate.</div><div>Gates open at six</div></div>')
    cols = (f'<div style="display: flex; justify-content: space-between; margin-top: 26px">'
            f'<div style="width: 324px">{pennant("BOX SEATS", "Passed in the stands")}'
            f'{S("Prawn cocktail for the whole hotel", 14)}{S("Caviar blini")}</div>'
            f'<div style="width: 324px">{pennant("HOME PLATE", "Hot off the grill")}'
            f'{S("Surf and turf", 14)}{A("chili")}</div></div>')
    foot = footer('Prices subject to change. Please, no souvenirs.', 'Form HB-300M')
    return shell(head + hero + cols + foot, ticket() + button())


def stamp():
    return (f'<div style="position: absolute; left: 286px; top: 548px; transform: rotate(-9deg); border: 3px solid {RED}; padding: 5px 12px 4px; opacity: 0.85; text-align: center">'
            f'<div style="{SANS}; font-weight: 800; font-size: 24px; letter-spacing: 0.12em; color: {RED}; line-height: 1">PAID IN FULL</div>'
            f'<div style="{SANS}; font-weight: 600; font-size: 14px; letter-spacing: 0.2em; color: {RED}; margin-top: 3px; border-top: 1.5px solid {RED}; padding-top: 3px">ACCOUNT M.B.</div></div>')


def back():
    CHAMP = "Monty's champagne cocktails for the bar"
    head = (kicker("A word from tonight&#8217;s host") +
            f'<div style="{BOD}; font-weight: 900; font-size: 64px; line-height: 1; letter-spacing: -0.01em; margin-top: 10px">IT&#8217;S ALL ON MONTY.</div>'
            f'<div style="height: 4px; background: {RED}; margin-top: 14px; width: 688px"></div>')
    note = (f'<div style="display: flex; justify-content: space-between; margin-top: 22px">'
            f'<div style="width: 392px">'
            f'<div style="{SANS}; font-size: 21px; line-height: 1.5; color: {GREEN}">Tonight the Bulls take on New York, and every frank, every shrimp and every glass of champagne in this park is on me.</div>'
            f'<div style="{SANS}; font-size: 21px; line-height: 1.5; color: {GREEN}; margin-top: 12px">Order the most expensive thing on the card. Then order it again.</div>'
            f'<div style="{HAND}; font-size: 30px; line-height: 1; color: #1d2f6b; margin-top: 26px; transform: rotate(-3deg); transform-origin: left">Monty Brewster</div>'
            f'<div style="{SANS}; font-size: 16px; color: {MUTE}; margin-top: 20px">Starting pitcher, Hackensack Bulls</div></div>'
            f'<div style="width: 262px">'
            f'<div style="border: 3px solid {RED}; padding: 7px; background: {CARD}">'
            f'<img src="assets/still-pitcher.jpg" alt="Monty Brewster in his pinstriped Bulls uniform and cap" style="display: block; width: 242px; height: 302px"></div>'
            f'<div style="{SANS}; font-style: italic; font-size: 16px; color: {MUTE}; margin-top: 7px">Tonight&#8217;s starter, warming up.</div></div></div>')
    cols = (f'<div style="display: flex; justify-content: space-between; margin-top: 30px">'
            f'<div style="width: 324px">{pennant("SWEETS", "Seventh inning stretch")}'
            f'{S("Rare stamp shortbread", 14)}{A("icecream")}{A("peanuts")}</div>'
            f'<div style="width: 324px">{pennant("THE BAR", "Poured at the stand")}'
            f'{S(CHAMP, 14)}{A("beer")}{A("lemonade")}</div></div>')
    foot = footer('Box 1 held for Granville &amp; Baxter.', '&#169; 1985 Hackensack Bulls')
    return shell(head + note + cols + foot, stamp())


faces = {'front': front(), 'back': back()}
for face, b in faces.items():
    open(os.path.join(D, face + '.body.html'), 'w').write(b + '\n')
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Hackensack Bulls bill of fare, {face}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{b}</body></html>')

json.dump({"fmt": "spenditall", "fn": "fmtSpendItAll", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Bodoni Moda", "Libre Franklin", "Homemade Apple"],
           "phone": {"disp": "'Bodoni Moda',serif", "title": "'Bodoni Moda',serif", "name": "'Bodoni Moda',serif",
                     "body": "'Libre Franklin',sans-serif", "price": "'Bodoni Moda',serif", "note": "'Libre Franklin',sans-serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)


def plain(s):
    import html
    return html.unescape(s)


json.dump({"Brewster's Millions (1985)": {k: {"n": plain(v[0]), "d": plain(v[1]), "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'spenditall.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
