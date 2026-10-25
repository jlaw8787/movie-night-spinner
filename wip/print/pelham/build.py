"""Command Center lunch run sheet (The Taking of Pelham One Two Three, 1974).
The day tour's lunch order, typed and hand-lettered on a ditto master and run off in purple on the
office spirit duplicator, then pinned to the board for everyone to pencil in their order before 11:30.
One face, 8.5 x 14 in (US Legal, the usual ditto stock). Writes sheet.body.html, sheet.html,
film.json and shift.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1344
PAPER, INK, LEAD = '#f3f2ee', '#4b36a0', '#48484f'
FONTS = 'family=Architects+Daughter&family=Cutive+Mono&family=Reenie+Beanie'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
SPREAD = 'text-shadow: 0 0 1.4px rgba(75,54,160,.85), .6px .4px .4px rgba(75,54,160,.35)'
HL = f"font-family: 'Architects Daughter', 'Comic Sans MS', cursive; {SPREAD}"
TY = f"font-family: 'Cutive Mono', 'Courier New', monospace; {SPREAD}"
PN = f"font-family: 'Reenie Beanie', cursive; color: {LEAD}"

# spec key -> (printed name, description, price, phone note)
SPEC = {
  "Transit authority hero": ("Turkey &amp; Swiss hero",
      "Sliced breast, shredded iceberg, tomato and mayonnaise on a long roll, wrapped tight in deli paper.",
      "1.23", "Lt. Garber's order. 1.23 even."),
  "Cheese danish": ("Cheese danish",
      "Puff pastry corners folded in over a sweet, lemony filling, thin icing on top.",
      ".35", "Two for Correll, coffee black."),
  "Transit office jam doughnuts": ("Jelly doughnuts",
      "Warmed through and rolled in sugar the minute they come out, so it sticks.",
      ".20", "A dozen for the floor."),
  "Transit authority rugelach": ("Rugelach",
      "Cream cheese dough rolled up around apricot jam, walnuts and cinnamon sugar, baked crisp at the ends.",
      "6 for .90", "Six for .90. Something for later."),
  "Mr Green's honey lemon whisky toddy": ("Hot toddy",
      "Whisky, honey, lemon and fresh ginger, topped up with boiling water, a cinnamon stick to stir.",
      "1.25", "Flu going round. Gesundheit."),
}
ADDED = {
  'soup': ("Chicken noodle soup", "A whole bird simmered two hours with carrot, celery, onion and dill, then ladled out by the pint.", ".85"),
  'egg': ("Egg cream", "Chocolate syrup, cold milk and a hard shot of seltzer. No egg, no cream.", ".35"),
  'coffee': ("Coffee", "Regular, light or black, in a paper cup with a lid.", ".25"),
}


def p(s):
    return s.replace('&amp;', '&')


def item(it, first=False, nsz=25):
    name, desc, price = it[:3]
    return f'''<div style="margin-top: {0 if first else 20}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{HL}; font-size: {nsz}px; line-height: 1.1; text-transform: uppercase">{name}</div>
        <div style="{HL}; font-size: 23px; line-height: 1; white-space: nowrap">{price}</div></div>
      <div style="{TY}; font-size: 16px; line-height: 1.42; margin-top: 4px">{desc}</div></div>'''


def head(t, sub):
    return (f'<div style="display: flex; justify-content: space-between; align-items: baseline; '
            f'border-bottom: 2px solid {INK}; padding-bottom: 4px; margin-bottom: 16px">'
            f'<span style="{HL}; font-size: 32px; line-height: 1">{t}</span>'
            f'<span style="{TY}; font-size: 15px">{sub}</span></div>')


def rule(x, y, w, h=2):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: {INK}"></div>'


L, R = 56, 760
GX, GW = L, R - L
ROWS = [("Lt. Garber", "hero, coffee reg.", "1.48"),
        ("Lt. Patrone", "hero, egg cream", "1.58"),
        ("Correll", "2 cheese danish, coffee blk", ".95"),
        ("Insp. Daniels", "soup, coffee light", "1.10"),
        ("the floor", "doz. jelly", "2.00")]
C1, C2 = 200, 600     # column x positions inside the grid (absolute)
GT, RH = 1094, 27     # grid top, row height


def grid():
    out = [rule(GX, GT, GW, 2)]
    out.append(f'<div style="position: absolute; left: {GX}px; top: {GT + 6}px; width: {GW}px; height: 22px; {HL}; font-size: 17px; letter-spacing: .06em">'
               f'<span style="position: absolute; left: 6px">NAME</span><span style="position: absolute; left: {C1 - GX + 10}px">WHAT YOU WANT</span>'
               f'<span style="position: absolute; right: 6px">$</span></div>')
    y = GT + 32
    out.append(rule(GX, y, GW, 2))
    for n, o, c in ROWS:
        if n:
            out.append(f'<div style="position: absolute; left: {GX + 6}px; top: {y + 1}px; {PN}; font-size: 29px; line-height: 27px; white-space: nowrap">{n}</div>'
                       f'<div style="position: absolute; left: {C1 + 10}px; top: {y + 1}px; {PN}; font-size: 29px; line-height: 27px; white-space: nowrap">{o}</div>'
                       f'<div style="position: absolute; left: {C2}px; width: {R - C2 - 8}px; top: {y + 1}px; text-align: right; {PN}; font-size: 29px; line-height: 27px">{c}</div>')
        y += RH
        out.append(rule(GX, y, GW, 1))
    bottom = y
    for x in (C1, C2):
        out.append(f'<div style="position: absolute; left: {x}px; top: {GT}px; width: 1px; height: {bottom - GT}px; background: {INK}"></div>')
    out.append(f'<div style="position: absolute; left: {GX + 6}px; top: {bottom + 6}px; {TY}; font-size: 15px">Leave the money with the order. No IOUs.</div>')
    out.append(f'<div style="position: absolute; left: {C2 - 112}px; top: {bottom + 4}px; width: 104px; text-align: right; {HL}; font-size: 18px; letter-spacing: .06em">TOTAL</div>')
    out.append(f'<div style="position: absolute; left: {C2}px; width: {R - C2 - 8}px; top: {bottom - 2}px; text-align: right; {PN}; font-size: 32px; line-height: 32px">7.11</div>')
    out.append(f'<div style="position: absolute; left: {R - 70}px; top: {bottom + 27}px; width: 64px; height: 2px; background: {LEAD}; opacity: .75"></div>')
    out.append(f'<div style="position: absolute; left: {R - 70}px; top: {bottom + 31}px; width: 64px; height: 2px; background: {LEAD}; opacity: .75"></div>')
    return ''.join(out), bottom


G, GB = grid()

ALSO = [("Sour pickle", ".15"), ("Cole slaw", ".30"), ("Potato knish", ".45"),
        ("Tea with lemon", ".20"), ("Orange juice", ".35"), ("Seltzer", ".15")]


def also():
    cells = ''.join(f'<div style="display: flex; justify-content: space-between; {TY}; font-size: 16px; line-height: 1.5">'
                    f'<span>{n}</span><span>{p_}</span></div>' for n, p_ in ALSO)
    return (f'<div style="margin-top: 22px; border-top: 2px dashed {INK}; padding-top: 10px">'
            f'<div style="{HL}; font-size: 20px; line-height: 1.1; letter-spacing: .05em; margin-bottom: 6px">ALSO AT THE DELI</div>'
            f'<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 28px">{cells}</div></div>')


body = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}; transform: rotate(-.35deg); transform-origin: 50% 50%">
  <div style="position: absolute; left: {L}px; top: 62px; width: {GW}px; display: flex; justify-content: space-between; {TY}; font-size: 15px; letter-spacing: .12em">
    <span>COMMAND CENTER COFFEE CLUB</span><span>PIN IT BACK ON THE BOARD</span></div>
  <img src="assets/title-lunch-run.png" alt="LUNCH RUN" style="position: absolute; left: {L - 4}px; top: 88px; width: 470px; height: 100px; display: block">
  <div style="position: absolute; left: 548px; top: 92px; width: 212px; height: 88px; box-sizing: border-box; border: 2px solid {INK}; padding: 8px 12px">
    <div style="{HL}; font-size: 28px; line-height: 1">DAY TOUR</div>
    <div style="{TY}; font-size: 16px; line-height: 1.35; margin-top: 6px">Orders in by 11:30<br>Pay when it comes</div></div>
  {rule(L, 196, GW, 3)}
  <div style="position: absolute; left: {L}px; top: 208px; width: {GW}px; {TY}; font-size: 16px; line-height: 1.42">Write your order on the bottom of this sheet. One run, one trip, so get it down before 11:30. Exact change helps the man doing the run.</div>
  <div style="position: absolute; left: {L}px; top: 266px; width: {GW}px; height: 42px; box-sizing: border-box; border: 2px solid {INK}; display: flex; align-items: center; justify-content: center; {HL}; font-size: 22px; letter-spacing: .05em">TOKYO SUBWAY VISITORS TODAY. JACKETS ON.</div>

  <section style="position: absolute; left: {L}px; top: 332px; width: 392px">
    {head('FROM THE DELI', 'on the corner')}
    {item(SPEC['Transit authority hero'], True, 26)}
    {item(ADDED['soup'])}
    {item(ADDED['egg'])}
    {item(ADDED['coffee'])}
    {also()}
  </section>

  <section style="position: absolute; left: 488px; top: 332px; width: 272px">
    {head('BAKERY', 'next door')}
    {item(SPEC['Cheese danish'], True)}
    {item(SPEC['Transit office jam doughnuts'])}
    <div style="{PN}; font-size: 27px; line-height: 1; margin-top: 4px">doz. 2.00, one for the floor</div>
    {item(SPEC['Transit authority rugelach'])}
    <img src="assets/doodle-hero.png" alt="" style="display: block; width: 240px; height: 100px; margin: 20px 0 0 14px">
  </section>

  <div style="position: absolute; left: {L}px; top: 952px; width: {GW}px; box-sizing: border-box; border: 2px solid {INK}; padding: 8px 16px 6px">
    <div style="display: flex; justify-content: space-between; align-items: baseline">
      <div style="{HL}; font-size: 26px; line-height: 1">AFTER THE TOUR: HOT TODDY</div>
      <div style="{HL}; font-size: 23px; line-height: 1">1.25</div></div>
    <div style="{TY}; font-size: 16px; line-height: 1.42; margin-top: 4px">{SPEC["Mr Green's honey lemon whisky toddy"][1]} Across the street, after four.</div>
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 0">
      <div style="{HL}; font-size: 19px; line-height: 1.2; letter-spacing: .04em">FLU GOING ROUND. EVEN THE MAYOR.</div>
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
           "mm": [215.9, 355.6], "fonts": FONTS, "fams": ["Architects Daughter", "Cutive Mono", "Reenie Beanie"],
           "phone": {"disp": "'Architects Daughter',cursive", "title": "'Architects Daughter',cursive",
                     "name": "'Architects Daughter',cursive", "body": "'Cutive Mono',monospace",
                     "price": "'Architects Daughter',cursive", "note": "'Cutive Mono',monospace"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
labels = {k: {"n": p(v[0]), "d": v[1], "note": v[3]} for k, v in SPEC.items()}
json.dump({"The Taking of Pelham One Two Three (1974)": labels}, open(os.path.join(D, 'shift.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built, grid bottom', GB)
