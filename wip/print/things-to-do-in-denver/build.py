"""The Altitude cocktail card, Things to Do in Denver When You're Dead (1995).
A square two-sided table card from a fictional East Colfax diner and cocktail lounge where Joe Heff
holds the booth and Jimmy the Saint buys the crew boat drinks. Front: the bar list under a real
Denver skyline with the Front Range. Back: the kitchen list, the counter, and Jimmy's drink chit.
Run prep.py first. Writes front.html, back.html, their .body.html, film.json, boatdrinks.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))
S = 816
NAVY, CORAL, SEA, INK, MUTE, WHITE = '#12333a', '#d6432d', '#dcece6', '#13262b', '#4d6460', '#fbfaf4'
FONTS = ('family=Kavoon'
         '&family=Barlow:ital,wght@0,400;0,600;0,700;0,800;1,400;1,600'
         '&family=Caveat:wght@600')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Kavoon', 'Cooper Black', serif"
BODY = "font-family: 'Barlow', 'Helvetica Neue', Arial, sans-serif"
HAND = "font-family: 'Caveat', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Boat drink piña coladas": ("Boat Drinks Colada", "White rum, pineapple, coconut cream, blended thick. Coconut rim, umbrella.", "4.75",
                              "Say it with the crew: boat drinks."),
  "Afterlife Advice deviled eggs": ("Deviled Eggs", "Six halves, yolks whipped with Dijon and pickle juice, smoked paprika, chives.", "1.95",
                                    "Bar snack of the house since the booths went in."),
  "Green chile queso": ("Green Chile Queso", "Melted white cheese, roasted green chiles, garlic, cumin. Corn chips to dunk.", "3.25",
                        "Joe Heff's booth gets first scoop."),
  "Patty melt": ("Patty Melt", "Thin beef patty, Swiss and slow onions on rye, griddled crisp in butter.", "4.95",
                 "The booth where the plan gets made."),
  "Mile-high sopapillas": ("Sopapillas", "Puffed fried pastry pillows, warm honey, a dust of cinnamon.", "2.25",
                           "Give it a name. Call it dessert."),
}
DRINKS = [
  ("Boat drink piña coladas", None),
  (None, ("Mai Tai", "Light and dark rum, orange curaçao, almond syrup, fresh lime.", "4.50")),
  (None, ("Blue Hawaiian", "Rum, blue curaçao, pineapple, cream of coconut, on ice.", "4.50")),
  (None, ("Zombie", "Three rums, lime, grapefruit and cinnamon syrup. Limit two a night.", "5.50")),
  (None, ("Give It a Name", "Tell the bartender how the day went. He pours to match.", "4.00")),
  (None, ("Virgin Colada", "All the pineapple and coconut, none of the rum.", "2.25")),
]
FOOD = [
  ("Afterlife Advice deviled eggs", None),
  ("Green chile queso", None),
  ("Patty melt", None),
  (None, ("Denver Omelette", "Three eggs folded over diced ham, green pepper, onion and cheddar.", "4.25")),
  ("Mile-high sopapillas", None),
  (None, ("Bottomless Coffee", "Fresh pot all night. Booths get topped up first.", ".95")),
]


def item(n, d, p, top=0):
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{BODY}; font-weight: 800; font-size: 27px; line-height: 1.1; color: {NAVY}">{n}</div>
        <div style="{BODY}; font-weight: 800; font-size: 27px; line-height: 1.1; color: {CORAL}; white-space: nowrap">{p}</div></div>
      <div style="{BODY}; font-size: 20px; line-height: 1.22; margin-top: 3px; color: {INK}">{d}</div></div>'''


def pick(row):
    k, extra = row
    if k:
        n, d, p, _ = SPEC[k]
        return n, d, p
    return extra


def box(x, y, w, inner, h=None, extra=''):
    hh = f'height: {h}px; ' if h else ''
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {hh}{extra}">{inner}</div>'


def kicker(s, c=CORAL):
    return f'<div style="{BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.22em; text-transform: uppercase; color: {c}; line-height: 1.1">{s}</div>'


def paper(o):
    o.insert(0, f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {S}px; height: {S}px; opacity: 0.4; display: block">')
    o.append(f'<img src="assets/paper-wear.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {S}px; height: {S}px; display: block; pointer-events: none">')
    return (f'<div style="position: relative; width: {S}px; height: {S}px; overflow: hidden; background: {SEA}; color: {INK}; {BODY}">'
            + ''.join(o) + '</div>')


def stripe(y):
    # the lounge's three-line awning stripe, navy coral navy
    return (f'<div style="position: absolute; left: 0; top: {y}px; width: {S}px; height: 4px; background: {NAVY}"></div>'
            f'<div style="position: absolute; left: 0; top: {y + 7}px; width: {S}px; height: 4px; background: {CORAL}"></div>')


def front():
    o = []
    # masthead
    o.append(box(40, 42, 500, kicker('East Colfax &middot; Denver &middot; Open till 2')
                 + f'<div style="{DISP}; font-size: 66px; line-height: 1; color: {NAVY}; margin-top: 6px; white-space: nowrap">The Altitude</div>'))
    o.append(box(530, 58, 246, f'''<div style="text-align: right">
      <div style="{BODY}; font-weight: 700; font-size: 22px; line-height: 1.15; color: {NAVY}">Diner &amp; Cocktail Lounge</div>
      <div style="{BODY}; font-style: italic; font-size: 20px; line-height: 1.2; color: {MUTE}; margin-top: 6px">One mile above the sea, give or take a barstool.</div></div>'''))
    # signature: real skyline strip, full bleed
    o.append(stripe(140))
    o.append(f'<div style="position: absolute; left: 0; top: 154px; width: {S}px; height: 240px; background: {NAVY}">'
             f'<img src="assets/skyline.jpg" alt="Downtown Denver and the Front Range from City Park" style="display: block; width: {S}px; height: 240px; object-fit: cover; object-position: center 0"></div>')
    o.append(stripe(397))
    o.append(f'''<div style="position: absolute; left: 40px; top: 352px; background: {WHITE}; padding: 5px 12px 6px; {BODY}; font-size: 16px; line-height: 1.2; color: {MUTE}; white-space: nowrap">
      <b style="color: {NAVY}">Our view west.</b> City Park to the mountains, five minutes up Colfax.</div>''')
    # section ribbon
    o.append(f'''<div style="position: absolute; left: 40px; top: 420px; display: flex; align-items: center; gap: 14px">
      <div style="background: {CORAL}; color: {WHITE}; {DISP}; font-size: 30px; line-height: 1; padding: 6px 18px 8px; border-radius: 4px; white-space: nowrap">Boat Drinks</div>
      {kicker('Poured 4 p.m. to last call', NAVY)}</div>''')
    # drinks, two columns of three
    L = ''.join(item(*pick(r), top=(0 if i == 0 else 10)) for i, r in enumerate(DRINKS[:3]))
    R = ''.join(item(*pick(r), top=(0 if i == 0 else 10)) for i, r in enumerate(DRINKS[3:]))
    o.append(box(40, 478, 350, L))
    o.append(box(426, 478, 350, R))
    o.append(f'<div style="position: absolute; left: 407px; top: 482px; width: 2px; height: 256px; background: #b9cfc8"></div>')
    o.append(box(40, 756, 736, f'<div style="{BODY}; font-size: 16px; line-height: 1.2; color: {MUTE}">Prices subject to change. Colorado draft by the pitcher. Kitchen on the back. Denver, 1995.</div>'))

    # prop 1: Afterlife Advice business card, tucked over the treeline corner of the photo
    o.append(f'''<div style="position: absolute; left: 524px; top: 236px; width: 252px; height: 140px; background: {WHITE}; border: 1px solid #c8c6bb; transform: rotate(-4deg); box-shadow: 0 3px 8px rgba(0,0,0,0.28)">
      <div style="position: absolute; left: 14px; top: 12px; width: 12px; height: 12px; border-radius: 6px; background: {CORAL}"></div>
      <div style="position: absolute; left: 32px; top: 9px; {BODY}; font-weight: 800; font-size: 17px; letter-spacing: 0.16em; color: {NAVY}">AFTERLIFE ADVICE</div>
      <div style="position: absolute; left: 14px; top: 34px; width: 224px; {BODY}; font-style: italic; font-size: 15px; line-height: 1.2; color: {MUTE}">Say it on tape for the ones you leave behind.</div>
      <div style="position: absolute; left: 14px; top: 0; width: 224px; height: 1px; top: 76px; background: #d9d6ca"></div>
      <div style="position: absolute; left: 14px; top: 84px; {BODY}; font-weight: 700; font-size: 18px; color: {INK}">Jimmy Tosnia</div>
      <div style="position: absolute; right: 14px; top: 87px; {BODY}; font-weight: 700; font-size: 15px; color: {NAVY}">303 555 0195</div>
      <div style="position: absolute; left: 14px; top: 110px; {BODY}; font-size: 15px; color: {MUTE}">Videotaped messages &middot; House calls</div></div>''')
    return paper(o)


def back():
    o = []
    # left: kitchen list
    o.append(box(40, 42, 350, kicker('From the grill &middot; all night')
                 + f'<div style="{DISP}; font-size: 46px; line-height: 1.02; color: {NAVY}; margin-top: 6px">The Kitchen</div>'
                 + f'<div style="width: 350px; height: 4px; background: {NAVY}; margin-top: 10px"></div>'
                 + f'<div style="width: 350px; height: 4px; background: {CORAL}; margin-top: 3px"></div>'))
    o.append(box(40, 160, 350, ''.join(item(*pick(r), top=(0 if i == 0 else 13)) for i, r in enumerate(FOOD))))

    # right: the counter still in a coral frame
    o.append(f'<div style="position: absolute; left: 420px; top: 40px; width: 356px; height: 248px; border: 5px solid {CORAL}; background: {NAVY}">'
             f'<img src="assets/still-counter.jpg" alt="A regular at the lunch counter" style="display: block; width: 356px; height: 248px; object-fit: cover"></div>')
    o.append(box(420, 302, 366, f'<div style="{BODY}; font-size: 18px; line-height: 1.25; color: {MUTE}"><b style="color: {NAVY}">The counter.</b> Sugar on every stool, pie under glass. Joe Heff keeps the corner booth.</div>'))

    # prop 2: drink chit with Jimmy's note (the character voice)
    o.append(f'''<div style="position: absolute; left: 432px; top: 380px; width: 336px; height: 258px; background: {WHITE}; border: 1px solid #c8c6bb; transform: rotate(2.5deg); box-shadow: 0 3px 8px rgba(0,0,0,0.22)">
      <div style="position: absolute; left: 0; top: 0; width: 336px; height: 38px; background: {NAVY}"></div>
      <div style="position: absolute; left: 14px; top: 8px; {DISP}; font-size: 20px; line-height: 1.1; color: {WHITE}">The Altitude</div>
      <div style="position: absolute; right: 14px; top: 11px; {BODY}; font-weight: 700; font-size: 16px; letter-spacing: 0.14em; color: #f2b8ac">DRINK CHIT</div>
      <div style="position: absolute; left: 14px; top: 48px; {BODY}; font-weight: 700; font-size: 16px; color: {MUTE}">BOOTH 5 &nbsp;&middot;&nbsp; GUESTS 5</div>
      <div style="position: absolute; right: 14px; top: 48px; {BODY}; font-weight: 700; font-size: 16px; color: {CORAL}">No. 0417</div>
      <div style="position: absolute; left: 14px; top: 72px; width: 308px; height: 1px; background: #d9d6ca"></div>
      <div style="position: absolute; left: 14px; top: 80px; {BODY}; font-weight: 800; font-size: 20px; color: {INK}">5 &times; Boat Drinks</div>
      <div style="position: absolute; right: 14px; top: 80px; {BODY}; font-weight: 800; font-size: 20px; color: {INK}">23.75</div>
      <div style="position: absolute; left: 14px; top: 108px; width: 308px; {BODY}; font-size: 16px; line-height: 1.25; color: {MUTE}">Critical Bill, Pieces, Franchise, Easy Wind</div>
      <div style="position: absolute; left: 14px; top: 136px; width: 308px; height: 1px; background: #d9d6ca"></div>
      <div style="position: absolute; left: 14px; top: 140px; width: 308px; {HAND}; font-weight: 600; font-size: 29px; line-height: 1.05; color: #23407e">On my tab, all night. Whatever the boys want.</div>
      <div style="position: absolute; right: 18px; top: 206px; {HAND}; font-weight: 600; font-size: 38px; line-height: 1; color: #23407e; transform: rotate(-4deg)">Jimmy</div>
      <div style="position: absolute; left: 14px; top: 222px; {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.12em; color: {CORAL}">BOAT DRINKS!</div></div>''')

    # footer, right column
    o.append(box(420, 676, 356, f'''<div style="{BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}">
      The Altitude, 1995 E. Colfax Ave., Denver. Form AA-95. Prices subject to change. No buckwheats on the premises.</div>'''))
    return paper(o)


def page(title, body):
    return (f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>{LINK}'
            f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')


for name, fn in (('front', front), ('back', back)):
    b = fn()
    open(os.path.join(D, f'{name}.body.html'), 'w').write(b)
    open(os.path.join(D, f'{name}.html'), 'w').write(page('The Altitude', b))

film = {"fmt": "boatdrinks", "fn": "fmtBoatdrinks", "faces": ["front.html", "back.html"], "names": ["Bar", "Kitchen"],
        "mm": [216, 216], "fonts": FONTS, "fams": ["Kavoon", "Barlow", "Caveat"],
        "phone": {"disp": "'Kavoon',serif", "title": "'Kavoon',serif", "name": "'Barlow',sans-serif",
                  "body": "'Barlow',sans-serif", "price": "'Barlow',sans-serif", "note": "'Barlow',sans-serif"}}
json.dump(film, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)
labels = {"Things to Do in Denver When You're Dead (1995)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}}
json.dump(labels, open(os.path.join(D, 'boatdrinks.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
