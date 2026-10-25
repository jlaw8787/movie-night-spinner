"""Mandel's Delicatessen take-out menu (Annie Hall, 1977).
One flat sheet of goldenrod offset stock, US Letter portrait 8.5 x 11 in, printed both sides in
brown and red, no fold. The kind of menu left on the counter by the register or pushed under
an apartment door on the Upper East Side.
Writes front.body.html, back.body.html, then front.html and back.html (one root div each)."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, INK, RED, TINT = '#ecc163', '#3d2213', '#b4321f', '#e3b453'
FONTS = ('family=Fraunces:ital,wght@0,400;0,600;0,900;1,400;1,600;1,900'
         '&family=Archivo+Narrow:wght@400;600;700&family=Covered+By+Your+Grace')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
F = "font-family: 'Fraunces', Georgia, serif"
N = "font-family: 'Archivo Narrow', 'Arial Narrow', sans-serif"
P = "font-family: 'Covered By Your Grace', cursive"

# ---------------------------------------------------------------- copy
# spec key -> (printed name, description, price, in-world note)
SPEC = {
  "Pastrami on white with mayo": ("Pastrami on white",
      "Steamed until glossy and piled high on soft sandwich bread with mayonnaise, iceberg lettuce and sliced tomato.",
      "3.25", "Yes, we make it. Max the counterman winces."),
  "Alvy's potato knishes": ("Potato knish",
      "Flaky pastry around a mash of boiled Idahos and onions fried slow in butter, egg-washed and baked golden.",
      ".75", "Out of the oven every hour, all day."),
  "Lobster bites": ("Lobster canapés",
      "Sweet cooked meat folded with mayonnaise, lemon, diced celery and chives, piled on rounds of buttered, toasted brioche.",
      "8.50 doz.", "Cooked and shelled for you. No chasing them round the kitchen."),
  "New York cheesecake": ("New York cheesecake",
      "Cream cheese, sour cream and lemon zest on a buttery crumb crust, baked slow in a water bath and chilled overnight.",
      "1.25", "Baked every morning. Never leaves Manhattan."),
  "Alvy's LA cucumber mint cooler": ("California cooler",
      "Fresh cucumber, lime, mint and honey, strained and poured over ice, topped up with seltzer.",
      ".95", "Big in Los Angeles, we hear. We wouldn't know."),
}
ADDED = {
  'rye': ("Hot pastrami on rye", "Peppered and smoked beef navel, steamed until it shines and sliced thick by hand. Brown mustard on the side.", "3.25", None),
  'soup': ("Matzo ball soup", "Golden chicken broth with carrot, fresh dill and one big, light dumpling.", "1.25", None),
  'eggcream': ("Egg cream", "Chocolate syrup and cold milk, hit hard with seltzer and stirred fast so it heads up.", ".60", "No egg, no cream. Don't ask."),
  'celery': ("Celery tonic", "Celery seed soda, sweet and sharp, served ice cold in the bottle.", ".45", None),
  'coffee': ("Coffee", "A fresh pot every hour, and refills are free at the counter.", ".30", None),
}


def item(it, first=False, gap=20, nsz=27):
    name, desc, price, note = it
    nt = f'<div style="{F}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 1.3; color: {RED}; margin-top: 4px; text-wrap: pretty">{note}</div>' if note else ''
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">
        <div style="{F}; font-weight: 900; font-size: {nsz}px; line-height: 1.05; color: {INK}">{name}</div>
        <div style="{F}; font-weight: 900; font-size: 24px; line-height: 1; color: {INK}; white-space: nowrap">{price}</div></div>
      <div style="{N}; font-size: 17px; line-height: 1.34; color: {INK}; margin-top: 5px; text-wrap: pretty">{desc}</div>{nt}</div>'''


def bar(t, sub=None, top=0):
    s = f'<span style="{N}; font-weight: 400; font-size: 15px; letter-spacing: .04em; text-transform: none; margin-left: 10px; color: {PAPER}">{sub}</span>' if sub else ''
    return (f'<div style="margin-top: {top}px; margin-bottom: 16px; background: {INK}; padding: 7px 12px 6px; '
            f'{N}; font-weight: 700; font-size: 17px; line-height: 1.2; letter-spacing: .16em; text-transform: uppercase; color: {PAPER}">{t}{s}</div>')


def star(x, y, size, lines, rot=-10, fs=22):
    sq = round(size * 0.70)
    off = (size - sq) / 2
    sqs = ''.join(f'<div style="position: absolute; left: {off}px; top: {off}px; width: {sq}px; height: {sq}px; background: {RED}; transform: rotate({a}deg)"></div>' for a in (0, 30, 60))
    txt = '<br>'.join(lines)
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {size}px; height: {size}px; transform: rotate({rot}deg)">{sqs}'
            f'<div style="position: absolute; left: 0; top: 0; width: {size}px; height: {size}px; display: flex; align-items: center; justify-content: center; text-align: center; '
            f'{F}; font-weight: 900; font-size: {fs}px; line-height: 1.02; color: {PAPER}">{txt}</div></div>')


def rules(x, y, w):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: 4px; background: {INK}"></div>'
            f'<div style="position: absolute; left: {x}px; top: {y + 7}px; width: {w}px; height: 1px; background: {INK}"></div>')


# ---------------------------------------------------------------- front
L, R = 48, 768
front = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}">
  <header style="position: absolute; left: {L}px; top: 46px; width: 560px">
    <div style="{N}; font-weight: 700; font-size: 16px; letter-spacing: .3em; color: {RED}">DELICATESSEN &amp; APPETIZING</div>
    <div style="{F}; font-style: italic; font-weight: 900; font-size: 124px; line-height: .98; letter-spacing: -.02em; color: {INK}; margin-top: 4px">Mandel&rsquo;s</div>
    <div style="{F}; font-style: italic; font-weight: 600; font-size: 25px; line-height: 1.2; color: {RED}; margin-top: 6px">The food is good. And such big portions.</div>
  </header>
  {star(598, 44, 172, ['WE', 'DELIVER'], -9, 25)}
  {rules(L, 262, R - L)}
  <div style="position: absolute; left: {L}px; top: 280px; width: {R - L}px; display: flex; justify-content: space-between; {N}; font-weight: 700; font-size: 16px; letter-spacing: .1em; text-transform: uppercase; color: {INK}">
    <span>Upper East Side, New York</span><span>Open 7 days, 7 a.m. to 1 a.m.</span><span>Phone 555-0177</span></div>
  {rules(L, 312, R - L)}

  <section style="position: absolute; left: {L}px; top: 348px; width: 452px">
    {bar('From the carving board')}
    {item(ADDED['rye'], True)}
    {item(SPEC['Pastrami on white with mayo'], gap=22)}
    <div style="{N}; font-size: 16px; line-height: 1.34; color: {INK}; margin-top: 16px; padding-top: 12px; border-top: 1px solid {INK}">Every sandwich comes with a sour pickle and a scoop of coleslaw.</div>
    {bar('Hot from the steam table', None, 30)}
    {item(SPEC["Alvy's potato knishes"], True)}
    {item(ADDED['soup'], gap=22)}
  </section>

  <aside style="position: absolute; left: 532px; top: 348px; width: 236px">
    <div style="border: 3px solid {INK}; padding: 18px 18px 20px; background: {TINT}">
      <div style="{N}; font-weight: 700; font-size: 15px; letter-spacing: .2em; color: {RED}">SINCE 1946</div>
      <div style="{F}; font-weight: 900; font-size: 24px; line-height: 1.08; margin-top: 8px">From Coney Island to uptown</div>
      <div style="{N}; font-size: 16px; line-height: 1.38; margin-top: 10px">Our first counter sat right under the roller coaster. Every time the cars went over, the soup shook. We moved uptown in 1959. The recipes came with us.</div>
      <div style="{F}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 1.3; color: {RED}; margin-top: 10px">Sam and Ruth Mandel</div>
    </div>
    <div style="margin-top: 28px; border-top: 4px solid {INK}; padding-top: 14px">
      <div style="{F}; font-weight: 900; font-size: 24px; line-height: 1.1">Seeing a picture?</div>
      <div style="{N}; font-size: 16px; line-height: 1.38; margin-top: 8px">Four-hour picture? Take sandwiches. We wrap anything to go, and we are open after the last show lets out.</div>
    </div>
    <div style="margin-top: 28px; border-top: 4px solid {INK}; padding-top: 14px">
      <div style="{F}; font-weight: 900; font-size: 24px; line-height: 1.1">Breakfast, 7 to 11</div>
      <div style="{N}; font-size: 16px; line-height: 1.38; margin-top: 8px">Bagel with lox and a schmear, eggs any style, hot rolls and butter.</div>
    </div>
  </aside>

  {rules(L, 958, R - L)}
  <div style="position: absolute; left: {L}px; top: 978px; width: {R - L}px; display: flex; justify-content: space-between; align-items: baseline">
    <span style="{F}; font-style: italic; font-weight: 600; font-size: 19px; color: {INK}">Platters, cheesecake and the fountain are over the page.</span>
    <span style="{N}; font-weight: 700; font-size: 15px; letter-spacing: .14em; color: {RED}">PLEASE TURN</span></div>
</div>'''

# ---------------------------------------------------------------- back
back = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}">
  <header style="position: absolute; left: {L}px; top: 46px; width: {R - L}px; display: flex; align-items: baseline; gap: 18px">
    <span style="{F}; font-style: italic; font-weight: 900; font-size: 52px; line-height: 1; letter-spacing: -.02em">Mandel&rsquo;s</span>
    <span style="{N}; font-weight: 700; font-size: 16px; letter-spacing: .24em; color: {RED}">PLATTERS, BAKE CASE, FOUNTAIN</span></header>
  {rules(L, 124, R - L)}

  <section style="position: absolute; left: {L}px; top: 160px; width: 452px">
    {bar('Platters and party trays')}
    {item(SPEC['Lobster bites'], True)}
    <div style="margin-top: 22px; border: 3px solid {INK}; background: {TINT}; padding: 16px 18px 18px">
      <div style="{F}; font-weight: 900; font-size: 24px; line-height: 1.1">Weekend at the beach?</div>
      <div style="{N}; font-size: 16px; line-height: 1.38; margin-top: 8px">Order your platters by Thursday noon. We pack them on ice for the drive out, with the bread wrapped separately so nothing goes soggy.</div>
    </div>
    {bar('From the bake case', None, 44)}
    {item(SPEC['New York cheesecake'], True)}
    <div style="{N}; font-size: 16px; line-height: 1.34; margin-top: 16px; padding-top: 12px; border-top: 1px solid {INK}">Whole cakes 9.50 with a day's notice. Plain only, the way it should be.</div>
  </section>

  <section style="position: absolute; left: 532px; top: 160px; width: 236px">
    {bar('The fountain')}
    {item(SPEC["Alvy's LA cucumber mint cooler"], True, nsz=24)}
    {item(ADDED['eggcream'], gap=22, nsz=24)}
    {item(ADDED['celery'], gap=22, nsz=24)}
    {item(ADDED['coffee'], gap=22, nsz=24)}
  </section>
  <div style="position: absolute; left: 300px; top: 722px; width: 400px; {P}; font-size: 27px; line-height: 1.1; color: #4a4741; transform: rotate(-4deg)">1 rye, mustard<br>1 white, mayo ?!<span style="font-size: 22px; margin-left: 30px">la-di-da</span></div>

  {rules(L, 806, R - L)}
  <div style="position: absolute; left: {L}px; top: 836px; width: 520px">
    <div style="{F}; font-weight: 900; font-size: 26px; line-height: 1.1">We deliver, East 59th to East 96th</div>
    <div style="{N}; font-size: 16px; line-height: 1.38; margin-top: 8px">Fifth Avenue to the river. Minimum order 5.00. Allow 30 minutes, a little longer when it rains. Cash only, no checks.</div>
  </div>
  {star(616, 822, 142, ['555', '0177'], 8, 23)}
  <div style="position: absolute; left: {L}px; top: 976px; width: {R - L}px; {N}; font-size: 13px; letter-spacing: .06em; color: {INK}">PRICES EFFECTIVE SPRING 1977 AND SUBJECT TO CHANGE. PRINTED IN N.Y.C.</div>
</div>'''


def face(body, name):
    grain = f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    wear = f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'{grain}{body}{wear}</div>')


for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width={W}">'
        f'<title>Mandel\'s, {name}</title>{LINK}<style>body{{margin:0}}</style></head><body>{face(body, name)}</body></html>')

# ---------------------------------------------------------------- site data
json.dump({"fmt": "annietable", "fn": "fmtAnnieTable", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Fraunces", "Archivo Narrow", "Covered By Your Grace"],
           "phone": {"disp": "'Fraunces',serif", "title": "'Fraunces',serif", "name": "'Fraunces',serif",
                     "body": "'Archivo Narrow',sans-serif", "price": "'Fraunces',serif", "note": "'Fraunces',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
labels = {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}
json.dump({"Annie Hall (1977)": labels}, open(os.path.join(D, 'annietable.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
