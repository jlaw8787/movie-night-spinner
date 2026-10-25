"""Lucky 4 Pizza box lid, Teenage Mutant Ninja Turtles II: The Secret of the Ooze (1991).
The neighbourhood pizzeria that sends Keno out to April's apartment and, later, down to the new lair.
The menu is printed on the white corrugated lid in two inks, green and red, like a 1991 New York pie box.
Run prep.py first. Writes lid.html, lid.body.html, film.json and ooze.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))
S = 960
BOARD, GREEN, RED, INK, MUTE = '#f5f2e8', '#1f5a2f', '#c7352a', '#1c2a20', '#4d5a4f'
OOZE = '#86c93a'
FONTS = ('family=Bangers'
         '&family=Barlow+Condensed:ital,wght@0,500;0,600;0,700;1,500'
         '&family=Permanent+Marker')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Bangers', 'Impact', sans-serif"
BODY = "font-family: 'Barlow Condensed', 'Arial Narrow', sans-serif"
HAND = "font-family: 'Permanent Marker', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "TCRI ooze dip": ("Mean Green Dip", "Avocado mashed with lime, red onion, cilantro and red chili. Warm corn chips.", "2.95",
                    "Glows a little. Scooped to order."),
  "Sewer lair pizza bagels": ("Pizza Bagels", "Six split minis, red sauce, bubbling mozzarella, pepperoni.", "2.50",
                              "Nobody ever stops at one."),
  "Late-pizza pepperoni and pineapple pie": ("The Late Pie", "Thin crust, tomato, mozzarella, pepperoni, fresh pineapple, jalapeño.", "12.00",
                                             "Late? Never pay full price."),
  "Tokka and Rahzar mint choc shakes": ("Big Baby Shakes", "Two tall cups of mint chocolate chip ice cream and cold whole milk, blended thick.", "4.00",
                                        "Two big babies, one each."),
  "Ooze canister lime and kiwi slushie": ("Green Slush", "Fresh kiwi, lime and honey blitzed with ice, topped with lemonade.", "1.50",
                                          "A safe batch."),
}
ADD = {
  'plain': ("Plain Cheese Pie", "Red sauce, whole milk mozzarella. Slice 1.25.", "9.50"),
  'four': ("Four Brothers Special", "A topping per quarter: pepperoni, sausage, mushroom, peppers.", "13.50"),
  'family': ("Family Night", "Two large pies, any toppings, four sodas.", "19.91"),
  'zeppole': ("Zeppole", "Fried dough puffs shaken in powdered sugar, hot in a bag.", "1.99"),
  'soda': ("Canned Soda", "Cola, orange, root beer, ginger ale.", ".75"),
}


def item(n, d, p, top=14):
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">
        <div style="{BODY}; font-weight: 700; font-size: 28px; line-height: 1.05; color: {INK}; text-transform: uppercase; letter-spacing: 0.01em">{n}</div>
        <div style="{BODY}; font-weight: 700; font-size: 28px; line-height: 1.05; white-space: nowrap; color: {RED}">{p}</div></div>
      <div style="{BODY}; font-weight: 500; font-size: 20px; line-height: 1.22; margin-top: 2px; color: #2b362d">{d}</div></div>'''


def S_(k, **kw):
    n, d, p, _ = SPEC[k]
    return item(n, d, p, **kw)


def A_(k, **kw):
    return item(*ADD[k], **kw)


def bar(t, bg=GREEN, kick=None):
    k = (f'<div style="{BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.2em; color: {RED}; margin-bottom: 6px">{kick}</div>' if kick else '')
    return (k + f'<div style="position: relative; height: 46px">'
            f'<div style="position: absolute; left: 6px; right: 6px; top: 0; height: 46px; background: {bg}; transform: skewX(-12deg)"></div>'
            f'<div style="position: absolute; left: 20px; top: 3px; {DISP}; font-size: 42px; line-height: 44px; letter-spacing: 0.04em; color: {BOARD}">{t}</div></div>')


def box(x, y, w, inner, h=None, extra=''):
    hh = f'height: {h}px; ' if h else ''
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {hh}{extra}">{inner}</div>'


def photo(src, alt, x, y, w, h, frame=RED):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; border: 4px solid {frame}; background: {INK}; box-sizing: content-box">'
            f'<img src="{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px; object-fit: cover"></div>')


def tgri_label():
    stripes = ''.join(f'<div style="position: absolute; left: {i * 22 - 10}px; top: -10px; width: 11px; height: 40px; background: {INK}; transform: skewX(-35deg)"></div>' for i in range(13))
    return f'''<div style="position: absolute; left: 330px; top: 452px; width: 236px; height: 124px; background: #fbfbf6; border: 2px solid {INK}; transform: rotate(4deg); overflow: hidden; box-shadow: 1px 2px 3px rgba(40,40,20,0.25)">
      <div style="position: absolute; left: 0; top: 0; width: 236px; height: 30px; background: {OOZE}"></div>
      <div style="position: absolute; left: 10px; top: 2px; {BODY}; font-weight: 700; font-size: 24px; line-height: 26px; letter-spacing: 0.12em; color: {INK}">T.G.R.I.</div>
      <div style="position: absolute; right: 10px; top: 7px; {BODY}; font-weight: 700; font-size: 15px; line-height: 16px; color: {INK}">CANISTER 4 OF 4</div>
      <div style="position: absolute; left: 10px; top: 34px; {BODY}; font-weight: 600; font-size: 14px; line-height: 1.15; color: {INK}; letter-spacing: 0.04em">TECHNO GLOBAL RESEARCH INDUSTRIES</div>
      <div style="position: absolute; left: 10px; top: 52px; {BODY}; font-weight: 700; font-size: 20px; line-height: 1.05; color: {INK}">SAMPLE. DO NOT OPEN.</div>
      <div style="position: absolute; left: 10px; top: 75px; {BODY}; font-weight: 500; font-size: 15px; line-height: 1.1; color: {MUTE}">Dept. of Waste Research, Prof. J. Perry</div>
      <div style="position: absolute; left: 0; top: 98px; width: 236px; height: 26px; background: #f2d23a; overflow: hidden">{stripes}</div></div>'''


def lid():
    o = []
    # board grain and corrugation, two-ink border printed on the lid
    o.append(f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {S}px; height: {S}px; object-fit: cover; opacity: 0.4; display: block">')
    o.append(''.join(f'<div style="position: absolute; left: 0; top: {y}px; width: {S}px; height: 1px; background: rgba(120,110,80,0.05)"></div>' for y in range(6, S, 9)))
    o.append(f'<div style="position: absolute; left: 22px; top: 22px; width: 904px; height: 904px; border: 6px solid {GREEN}"></div>')
    o.append(f'<div style="position: absolute; left: 34px; top: 34px; width: 888px; height: 888px; border: 2px solid {RED}"></div>')

    # header: name, band, Keno's marker note, small still of April's place
    o.append(box(56, 52, 560, f'''
      <div style="{BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.24em; color: {RED}">BRICK OVEN · SLICES · FREE DELIVERY</div>
      <div style="{DISP}; font-size: 124px; line-height: 0.92; letter-spacing: 0.02em; color: {GREEN}; margin-top: 4px">LUCKY 4</div>'''))
    o.append(box(56, 190, 548, f'''<div style="position: relative; height: 44px">
      <div style="position: absolute; left: 6px; right: 6px; top: 0; height: 44px; background: {RED}; transform: skewX(-12deg)"></div>
      <div style="position: absolute; left: 22px; top: 3px; {DISP}; font-size: 33px; line-height: 40px; letter-spacing: 0.03em; color: {BOARD}; white-space: nowrap">PIZZERIA · EST. 1984 · (212) 555 1991</div></div>'''))
    o.append(f'''<div style="position: absolute; left: 418px; top: 66px; width: 196px; transform: rotate(-7deg); {HAND}; font-size: 21px; line-height: 1.22; color: #1f3d8a">
      April O., 3rd fl.<br>KNOCK 4 TIMES!<br>Pd. in full
      <div style="font-size: 26px; margin: 2px 0 0 70px">Keno</div></div>''')
    o.append(photo('assets/still-april.jpg', 'April O\'Neil with the Turtles in her apartment', 634, 54, 266, 156, GREEN))
    o.append(box(634, 218, 274, f'<div style="{BODY}; font-style: italic; font-weight: 500; font-size: 16px; line-height: 1.2; color: {MUTE}">Our best customer on the block. Big orders.</div>'))

    # hero still, the lair with a pie
    o.append(photo('assets/still-lair.jpg', 'The Turtles at home in their new lair with a pie from the shop', 56, 260, 488, 266))
    o.append(box(56, 540, 270, f'<div style="{BODY}; font-style: italic; font-weight: 500; font-size: 16px; line-height: 1.2; color: {MUTE}">We deliver anywhere. Even below street level.</div>'))
    o.append(tgri_label())

    # right column: pies, then cold
    o.append(box(584, 262, 320, bar('PIES', GREEN, 'OUT OF THE BRICK OVEN')
                 + A_('plain', top=10) + A_('four') + S_("Late-pizza pepperoni and pineapple pie") + A_('family')))
    o.append(box(584, 684, 320, bar('COLD', RED)
                 + S_("Ooze canister lime and kiwi slushie", top=10) + A_('soda')))

    # left bottom: starters and sweets
    o.append(box(56, 598, 244, bar('STARTERS', RED) + S_("TCRI ooze dip", top=10) + S_("Sewer lair pizza bagels")))
    o.append(box(312, 598, 244, bar('SWEETS', GREEN) + S_("Tokka and Rahzar mint choc shakes", top=10) + A_('zeppole')))

    # fine print
    o.append(box(56, 892, 520, f'<div style="{BODY}; font-weight: 500; font-size: 16px; line-height: 1.2; color: {MUTE}">Prices subject to change. As seen on Channel 3. Box no. 4-1991. New York, N.Y.</div>'))

    o.append(f'<img src="assets/wear-lid.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {S}px; height: {S}px; opacity: 0.7; pointer-events: none; display: block">')
    return (f'<div style="position: relative; width: {S}px; height: {S}px; overflow: hidden; background: {BOARD}; color: {INK}; {BODY}">'
            + ''.join(o) + '</div>')


body = lid()
open(os.path.join(D, 'lid.body.html'), 'w').write(body)
open(os.path.join(D, 'lid.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Lucky 4 Pizza</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "ooze", "fn": "fmtOoze", "faces": ["lid.html"], "names": ["Box lid"], "mm": [254, 254],
        "fonts": FONTS, "fams": ["Bangers", "Barlow Condensed", "Permanent Marker"],
        "phone": {"disp": "'Bangers',sans-serif", "title": "'Bangers',sans-serif", "name": "'Barlow Condensed',sans-serif",
                  "body": "'Barlow Condensed',sans-serif", "price": "'Barlow Condensed',sans-serif", "note": "'Barlow Condensed',sans-serif"}}
json.dump(film, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)
labels = {"Teenage Mutant Ninja Turtles II: The Secret of the Ooze (1991)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}}
json.dump(labels, open(os.path.join(D, 'ooze.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
