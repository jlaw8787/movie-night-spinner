"""Command Center lunch run sheet (The Taking of Pelham One Two Three, 1974).
The day tour's lunch order, typed and lettered with a lettering guide on a ditto master, run off in
purple on the office spirit duplicator and pinned to the board for everyone to pencil in an order
before 11:30. One face, 8.5 x 14 in (US Legal, the usual ditto stock).
Run paint.py and letter.py first. Writes sheet.body.html, sheet.html, film.json and shift.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1344
PAPER, INK, LEAD = '#f3f2ee', '#4b36a0', '#48484f'
FONTS = 'family=Cutive+Mono&family=Reenie+Beanie'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
SPREAD = 'text-shadow: 0 0 1.4px rgba(75,54,160,.85), .6px .4px .4px rgba(75,54,160,.35)'
TY = f"font-family: 'Cutive Mono', 'Courier New', monospace; {SPREAD}"
PN = f"font-family: 'Reenie Beanie', cursive; color: {LEAD}"
LT = json.load(open(os.path.join(D, 'letters.json')))

# spec key -> (letter key, printed name, description, price, phone note)
SPEC = {
  "Transit authority hero": ('hero', "Turkey & Swiss hero",
      "Sliced breast, shredded iceberg, tomato and mayonnaise on a long roll, wrapped tight in deli paper.",
      "1.23", "Lt. Garber's order. 1.23 even."),
  "Cheese danish": ('danish', "Danish",
      "Puff pastry corners folded over sweet cream cheese and lemon, with thin icing.",
      ".35", "Two for Correll, coffee black."),
  "Transit office jam doughnuts": ('jelly', "Jelly doughnuts",
      "Fresh from the fryer, filled, then rolled in sugar while still warm so it sticks.",
      ".20", "A dozen for the floor."),
  "Transit authority rugelach": ('rugelach', "Rugelach",
      "Cream cheese dough rolled up around apricot jam, walnuts and cinnamon sugar, baked crisp at the ends.",
      "6 for .90", "Six for .90. Something for later."),
  "Mr Green's honey lemon whisky toddy": ('toddy', "Hot toddy",
      "Whisky, honey, lemon and fresh ginger, topped up with boiling water, a cinnamon stick to stir.",
      "1.25", "Flu going round. Gesundheit."),
}
ADDED = {
  'soup': ('soup', "Chicken soup", "A whole bird simmered two hours with carrot, celery, onion and dill, egg noodles stirred in. Sold by the pint.", ".85"),
  'egg': ('eggcream', "Egg cream", "Chocolate syrup, cold milk and a hard shot of seltzer. No egg, no cream.", ".35"),
  'coffee': ('coffee', "Coffee", "Regular, light or black, in a paper cup with a lid.", ".25"),
}
ALSO = [("Sour pickle", ".15"), ("Cole slaw", ".30"), ("Potato knish", ".45"),
        ("Tea with lemon", ".20"), ("Orange juice", ".35"), ("Seltzer", ".15")]


def lt(key, style=''):
    """A lettered piece, placed so its ink (not its padding) sits on the flow line."""
    g = LT[key]
    return (f'<img src="assets/letter-{key}.png" alt="{g["alt"]}" style="display: block; width: {g["w"]}px; height: {g["h"]}px; '
            f'margin: {-g["pad"]:.1f}px 0 {-g["pad"]:.1f}px {-g["pad"]:.1f}px; {style}">')


def item(it, first=False):
    key, name, desc, price = it[:4]
    return f'''<div style="margin-top: {0 if first else 20}px">
      <div style="display: flex; justify-content: space-between; align-items: center; gap: 10px">
        {lt(key)}
        <div style="{TY}; font-size: 19px; line-height: 1; white-space: nowrap">{price}</div></div>
      <div style="{TY}; font-size: 16px; line-height: 1.42; margin-top: 7px">{desc}</div></div>'''


def head(key, sub):
    return (f'<div style="display: flex; justify-content: space-between; align-items: flex-end; '
            f'border-bottom: 2px solid {INK}; padding-bottom: 6px; margin-bottom: 16px">'
            f'{lt(key)}<span style="{TY}; font-size: 15px; white-space: nowrap">{sub}</span></div>')


def rule(x, y, w, h=2):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: {INK}"></div>'


def at(key, x, y, extra=''):
    g = LT[key]
    return (f'<img src="assets/letter-{key}.png" alt="{g["alt"]}" style="position: absolute; left: {x - g["pad"]:.1f}px; '
            f'top: {y - g["pad"]:.1f}px; width: {g["w"]}px; height: {g["h"]}px; display: block; {extra}">')


L, R = 56, 760
GX, GW = L, R - L
ROWS = [("Lt. Garber", "hero, coffee reg.", "1.48"),
        ("Lt. Patrone", "hero, egg cream", "1.58"),
        ("Correll", "2 cheese danish, coffee blk", ".95"),
        ("Insp. Daniels", "soup, coffee light", "1.10"),
        ("the floor", "doz. jelly", "2.00")]
C1, C2 = 200, 600
GT, RH = 1094, 27


def grid():
    out = [rule(GX, GT, GW, 2), at('name', GX + 8, GT + 9), at('want', C1 + 10, GT + 9),
           f'<div style="position: absolute; left: {C2}px; width: {R - C2 - 8}px; top: {GT + 7}px; text-align: right; {TY}; font-size: 16px">$</div>']
    y = GT + 32
    out.append(rule(GX, y, GW, 2))
    for n, o, c in ROWS:
        out.append(f'<div style="position: absolute; left: {GX + 6}px; top: {y + 1}px; {PN}; font-size: 29px; line-height: 27px; white-space: nowrap">{n}</div>'
                   f'<div style="position: absolute; left: {C1 + 10}px; top: {y + 1}px; {PN}; font-size: 29px; line-height: 27px; white-space: nowrap">{o}</div>'
                   f'<div style="position: absolute; left: {C2}px; width: {R - C2 - 8}px; top: {y + 1}px; text-align: right; {PN}; font-size: 29px; line-height: 27px">{c}</div>')
        y += RH
        out.append(rule(GX, y, GW, 1))
    b = y
    for x in (C1, C2):
        out.append(f'<div style="position: absolute; left: {x}px; top: {GT}px; width: 1px; height: {b - GT}px; background: {INK}"></div>')
    out.append(f'<div style="position: absolute; left: {GX + 6}px; top: {b + 7}px; {TY}; font-size: 15px">Leave the money with the order.</div>')
    out.append(at('total', C2 - 8 - LT['total']['w'] + 2 * LT['total']['pad'], b + 10))
    out.append(f'<div style="position: absolute; left: {C2}px; width: {R - C2 - 8}px; top: {b - 2}px; text-align: right; {PN}; font-size: 32px; line-height: 32px">7.11</div>')
    for dy in (27, 31):
        out.append(f'<div style="position: absolute; left: {R - 70}px; top: {b + dy}px; width: 64px; height: 2px; background: {LEAD}; opacity: .75"></div>')
    return ''.join(out), b


G, GB = grid()

also = ''.join(f'<div style="display: flex; justify-content: space-between; {TY}; font-size: 16px; line-height: 1.5">'
               f'<span>{n}</span><span>{p}</span></div>' for n, p in ALSO)
tg = LT['tokyo']

body = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}; transform: rotate(-.35deg); transform-origin: 50% 50%">
  <div style="position: absolute; left: {L}px; top: 62px; width: {GW}px; display: flex; justify-content: space-between; {TY}; font-size: 15px; letter-spacing: .12em">
    <span>COMMAND CENTER COFFEE CLUB</span><span>PIN IT BACK ON THE BOARD</span></div>
  <img src="assets/title-lunch-run.png" alt="" aria-hidden="true" style="position: absolute; left: {L - 1}px; top: 90px; width: 470px; height: 100px; display: block; opacity: .16">
  <img src="assets/title-lunch-run.png" alt="LUNCH RUN" style="position: absolute; left: {L - 4}px; top: 88px; width: 470px; height: 100px; display: block">
  <div style="position: absolute; left: 548px; top: 92px; width: 212px; height: 88px; box-sizing: border-box; border: 2px solid {INK}; padding: 12px 12px 8px">
    {lt('daytour')}
    <div style="{TY}; font-size: 16px; line-height: 1.35; margin-top: 8px">Orders in by 11:30<br>Pay when it comes</div></div>
  {rule(L, 196, GW, 3)}
  <div style="position: absolute; left: {L}px; top: 208px; width: {GW}px; {TY}; font-size: 16px; line-height: 1.42">Order on the bottom of this sheet by 11:30. One run, one trip. Exact change helps. Deli 555-0174, bakery 555-0182.</div>
  <div style="position: absolute; left: {L}px; top: 266px; width: {GW}px; height: 42px; box-sizing: border-box; border: 2px solid {INK}"></div>
  {at('tokyo', L + (GW - (tg['w'] - 2 * tg['pad'])) / 2, 266 + (42 - 17) / 2)}

  <section style="position: absolute; left: {L}px; top: 332px; width: 392px">
    {head('deli', 'on the corner')}
    {item(SPEC['Transit authority hero'], True)}
    {item(ADDED['soup'])}
    {item(ADDED['egg'])}
    {item(ADDED['coffee'])}
    <div style="margin-top: 22px; border-top: 2px dashed {INK}; padding-top: 12px">
      <div style="margin-bottom: 8px">{lt('also')}</div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 28px">{also}</div></div>
  </section>

  <section style="position: absolute; left: 488px; top: 332px; width: 272px">
    {head('bakery', 'next door')}
    {item(SPEC['Cheese danish'], True)}
    {item(SPEC['Transit office jam doughnuts'])}
    <div style="{PN}; font-size: 27px; line-height: 1; margin-top: 4px">doz. 2.00, one for the floor</div>
    {item(SPEC['Transit authority rugelach'])}
    <div style="margin-top: 22px; border: 2px solid {INK}; padding: 12px 12px 10px">
      {lt('friday')}
      <div style="{TY}; font-size: 16px; line-height: 1.42; margin-top: 8px">Danish and rugelach by the dozen for the board. Names down by Thursday.</div>
      <div style="{PN}; font-size: 27px; line-height: 1; margin-top: 4px">Correll, Patrone, Garber</div>
    </div>
  </section>

  <div style="position: absolute; left: {L}px; top: 952px; width: {GW}px; box-sizing: border-box; border: 2px solid {INK}; padding: 12px 16px 6px">
    <div style="display: flex; justify-content: space-between; align-items: center">
      {lt('toddy')}
      <div style="{TY}; font-size: 19px; line-height: 1">1.25</div></div>
    <div style="{TY}; font-size: 16px; line-height: 1.42; margin-top: 7px">{SPEC["Mr Green's honey lemon whisky toddy"][2]} Across the street, after four.</div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px">
      {lt('flu')}
      <div style="{PN}; font-size: 32px; line-height: 1; transform: rotate(-4deg); margin-right: 6px">Gesundheit!</div></div>
  </div>
  {G}
</div>'''


def face(b):
    grain = f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: .7">'
    wear = f'<img src="assets/ditto-wear.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'{grain}{b}{wear}</div>')


open(os.path.join(D, 'sheet.body.html'), 'w').write(body)
open(os.path.join(D, 'sheet.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width={W}">'
    f'<title>Lunch run sheet</title>{LINK}<style>body{{margin:0}}</style></head><body>{face(body)}</body></html>')

json.dump({"fmt": "shift", "fn": "fmtShift", "faces": ["sheet.html"], "names": ["Lunch run"],
           "mm": [215.9, 355.6], "fonts": FONTS, "fams": ["Cutive Mono", "Reenie Beanie"],
           "phone": {"disp": "'Cutive Mono',monospace", "title": "'Cutive Mono',monospace",
                     "name": "'Cutive Mono',monospace", "body": "'Cutive Mono',monospace",
                     "price": "'Cutive Mono',monospace", "note": "'Reenie Beanie',cursive"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
labels = {k: {"n": v[1], "d": v[2], "note": v[4]} for k, v in SPEC.items()}
json.dump({"The Taking of Pelham One Two Three (1974)": labels}, open(os.path.join(D, 'shift.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built, grid bottom', GB)
