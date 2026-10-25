"""Mandel's Delicatessen take-out menu (Annie Hall, 1977).
One flat sheet of goldenrod offset stock, US Letter portrait 8.5 x 11 in, printed both sides in
two inks (brown and red) by a neighbourhood job printer, no fold. Left in a pile by the register
and pushed under apartment doors on the Upper East Side. Since then it has picked up a purple
"prices effective" rubber stamp from the catering desk and somebody's ballpoint order.
Art and ink texture are painted by paint.py. Writes front/back .body.html and .html."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, INK, RED, PEN = '#ecbd5c', '#3a2012', '#b2301e', '#22347a'
FONTS = ('family=Caprasimo&family=Libre+Franklin:ital,wght@0,400;0,600;0,800;1,400;1,600'
         '&family=Covered+By+Your+Grace')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
C = "font-family: 'Caprasimo', 'Cooper Black', Georgia, serif; font-weight: 400"
F = "font-family: 'Libre Franklin', 'Franklin Gothic', Arial, sans-serif"
P = "font-family: 'Covered By Your Grace', cursive"
L, R = 48, 768
LW, RX, RW = 456, 536, 232

# ---------------------------------------------------------------- copy
# spec key -> (printed name, description, price, in-world note)
SPEC = {
  "Pastrami on white with mayo": ("Pastrami on white",
      "Steamed until it glistens, then piled high on soft Pullman slices with mayonnaise, iceberg lettuce and sliced tomato.",
      "3.25", "Yes, we make it. Max the counterman winces."),
  "Alvy's potato knishes": ("Potato knish",
      "Flaky pastry around a mash of boiled Idahos and onions fried slow in butter, egg-washed and baked golden.",
      ".75", None),
  "Lobster bites": ("Lobster canapés",
      "Sweet cooked meat folded with mayonnaise, lemon, diced celery and chives, piled on rounds of buttered, toasted egg bread.",
      "8.50 doz.", "Shelled. None behind the refrigerator."),
  "New York cheesecake": ("New York cheesecake",
      "Cream cheese, sour cream and lemon zest on a buttery crumb crust, baked slow in a water bath and chilled overnight.",
      "1.25", "Baked every morning. Never leaves Manhattan."),
  "Alvy's LA cucumber mint cooler": ("Garden rickey",
      "Lime juice and honey shaken with fresh cucumber and mint, strained over ice and topped with seltzer.",
      ".95", "Big in Los Angeles, we hear. We wouldn't know."),
}


def feat(num, it, gap=18, ring=False, tick=False):
    name, desc, price, note = it
    n = f'<span style="{F}; font-weight: 800; font-size: 13px; letter-spacing: .08em; color: {RED}; margin-right: 8px; position: relative; top: -3px">NO.&thinsp;{num}</span>' if num else ''
    ringimg = (f'<img src="assets/pen-ring.png" alt="" style="position: absolute; left: -26px; top: -13px; width: 96px; height: 50px">' if ring else '')
    tk = (f'<img src="assets/pen-tick.png" alt="" style="position: absolute; left: -42px; top: -2px; width: 36px; height: 30px">' if tick else '')
    nt = f'<div style="{F}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 1.3; color: {RED}; margin-top: 3px">{note}</div>' if note else ''
    return f'''<div style="margin-top: {gap}px; position: relative">{tk}
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{C}; font-size: 25px; line-height: 1.08; color: {INK}">{n}{name}</div>
        <div style="{C}; font-size: 23px; line-height: 1; color: {INK}; white-space: nowrap; position: relative">{price}{ringimg}</div></div>
      <div style="{F}; font-size: 16px; line-height: 1.32; color: {INK}; margin-top: 4px; text-wrap: pretty">{desc}</div>{nt}</div>'''


def row(num, name, desc, price, gap=9, tick=False, sz=20):
    n = f'<span style="{F}; font-weight: 800; font-size: 13px; letter-spacing: .06em; color: {RED}; display: inline-block; width: 26px">{num}</span>' if num else ''
    tk = (f'<img src="assets/pen-tick.png" alt="" style="position: absolute; left: -38px; top: -2px; width: 36px; height: 30px">' if tick else '')
    ds = f'<div style="{F}; font-size: 16px; line-height: 1.3; color: {INK}; margin-top: 1px; padding-left: {26 if num else 0}px">{desc}</div>' if desc else ''
    return f'''<div style="margin-top: {gap}px; position: relative">{tk}
      <div style="display: flex; align-items: baseline; gap: 6px">
        <div style="{C}; font-size: {sz}px; line-height: 1.1; color: {INK}; white-space: nowrap">{n}{name}</div>
        <div style="flex: 1; border-bottom: 2px dotted {INK}; opacity: .55; transform: translateY(-4px)"></div>
        <div style="{C}; font-size: {sz}px; line-height: 1; color: {INK}; white-space: nowrap">{price}</div></div>{ds}</div>'''


def bar(t, img, w, sub=None, top=0):
    s = f'<span style="{F}; font-weight: 600; font-style: italic; font-size: 15px; letter-spacing: .02em; text-transform: none; margin-left: 10px">{sub}</span>' if sub else ''
    return (f'<div style="position: relative; margin-top: {top}px; width: {w}px; height: 34px">'
            f'<img src="assets/{img}" alt="" style="position: absolute; left: 0; top: 0; width: {w}px; height: 34px">'
            f'<div style="position: absolute; left: 12px; top: 0; height: 34px; line-height: 35px; white-space: nowrap; {F}; font-weight: 800; font-size: 16px; letter-spacing: .16em; text-transform: uppercase; color: {PAPER}">{t}{s}</div></div>'
            f'<div style="width: {w}px; height: 3px; background: {RED}; margin-top: 3px; margin-left: 2px"></div>')


def rules(x, y, w, col=INK):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: 4px; background: {col}"></div>'
            f'<div style="position: absolute; left: {x}px; top: {y + 7}px; width: {w}px; height: 1px; background: {col}"></div>')


def head(t, size=22):
    return f'<div style="{C}; font-size: {size}px; line-height: 1.1; color: {INK}">{t}</div>'


def body(t, top=6, size=16):
    return f'<div style="{F}; font-size: {size}px; line-height: 1.36; color: {INK}; margin-top: {top}px; text-wrap: pretty">{t}</div>'


def kicker(t, col=RED):
    return f'<div style="{F}; font-weight: 800; font-size: 13px; letter-spacing: .2em; color: {col}">{t}</div>'


# ---------------------------------------------------------------- front
front = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}">
  <div style="position: absolute; left: {L}px; top: 44px; {F}; font-weight: 800; font-size: 15px; letter-spacing: .28em; color: {RED}">DELICATESSEN &middot; RESTAURANT &middot; CATERING</div>
  <img src="assets/mast-front.png" alt="Mandel's" style="position: absolute; left: {L - 8}px; top: 52px; width: 530px; height: 148px">
  <div style="position: absolute; left: {L}px; top: 186px; {F}; font-style: italic; font-weight: 600; font-size: 23px; color: {INK}">The food is good. And such big portions.</div>
  <img src="assets/burst-deliver.png" alt="We deliver" style="position: absolute; left: 598px; top: 38px; width: 170px; height: 170px">

  {rules(L, 226, R - L)}
  <div style="position: absolute; left: {L}px; top: 242px; width: {R - L}px; display: flex; justify-content: space-between; {F}; font-weight: 800; font-size: 15px; letter-spacing: .1em; text-transform: uppercase; color: {INK}">
    <span>Second Ave. at 77th St.</span><span>Open 7 days, 7 a.m. to 1 a.m.</span><span>Phone 555-0177</span></div>
  {rules(L, 270, R - L)}

  <section style="position: absolute; left: {L}px; top: 296px; width: {LW}px">
    {bar('Sandwiches', 'bar-front.png', LW, 'sliced by hand, to order')}
    {feat(1, ("Hot corned beef", "Garlic-cured brisket carved thin on rye, brown mustard.", "3.15", None), 12)}
    {feat(2, SPEC['Pastrami on white with mayo'], 16, ring=True)}
    {row(3, 'Rare roast beef', 'Top round, cooked pink, Russian dressing', '3.10', 14)}
    {row(4, 'Pickled tongue', None, '3.25')}
    {row(5, 'Chopped liver', 'Schmaltz, fried onion and hard-cooked egg', '2.25')}
    {row(6, 'Turkey breast, roasted here', None, '2.95')}
    <div style="{F}; font-size: 16px; line-height: 1.34; margin-top: 9px; padding-top: 6px; border-top: 1px solid {INK}">With a sour pickle and slaw. Rye, white or a club roll.</div>
    {bar('From the steam table', 'bar-fronts.png', LW, 'hot all day', 14)}
    {feat(None, SPEC["Alvy's potato knishes"], 12)}
    {row(None, 'Matzo ball soup', 'Golden chicken broth, carrot, dill, one big dumpling', '1.25', 14)}
    {row(None, 'Kasha varnishkes', None, '.95')}
  </section>

  <aside style="position: absolute; left: {RX}px; top: 296px; width: {RW}px">
    <div style="border: 2px solid {INK}; padding: 4px; width: {RW - 12}px">
      <img src="assets/linecut-coaster.png" alt="" style="display: block; width: {RW - 12}px; height: {round((RW - 12) * 168 / 232)}px"></div>
    <div style="position: relative; margin-top: 12px; width: {RW}px">
      <img src="assets/tint-history.png" alt="" style="position: absolute; left: 0; top: 0; width: {RW}px; height: 100%">
      <div style="position: relative; padding: 12px 14px 14px; border: 2px solid {INK}">
        {kicker('SINCE 1946')}
        {head('From Coney Island', 21)}
        {body('Our first counter sat under the coaster in Coney Island. The soup shook. We came uptown in 1959. Brooklyn wasn&rsquo;t expanding.', 6, 15.5)}
        <div style="{F}; font-style: italic; font-weight: 600; font-size: 15px; color: {RED}; margin-top: 6px">Sam and Ruth Mandel</div></div></div>
    <div style="margin-top: 14px; border-top: 4px solid {INK}; padding-top: 8px">
      {head('Seeing a picture?')}
      {body('Four-hour picture? Take sandwiches. Open past the last show.', 5)}</div>
    <div style="margin-top: 14px; border-top: 4px solid {INK}; padding-top: 8px">
      {head('Breakfast, 7 to 11')}
      {row(None, 'Eggs any style', None, '.95', 6, sz=18)}
      {row(None, 'Lox, eggs, onions', None, '2.75', 4, sz=18)}
      {row(None, 'Bagel, schmear', None, '.60', 4, sz=18)}
      <div style="{F}; font-style: italic; font-weight: 600; font-size: 16px; color: {RED}; margin-top: 5px">We need the eggs.</div></div>
  </aside>

  {rules(L, 974, R - L)}
  <div style="position: absolute; left: {L}px; top: 990px; width: {R - L}px; display: flex; justify-content: space-between; align-items: baseline">
    <span style="{F}; font-style: italic; font-weight: 600; font-size: 18px; color: {INK}">Party trays, the bake case and the fountain are over the page.</span>
    <span style="{F}; font-weight: 800; font-size: 14px; letter-spacing: .16em; color: {RED}">PLEASE TURN</span></div>
</div>'''

front_marks = ''

# ---------------------------------------------------------------- back
back = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}">
  <img src="assets/mast-back.png" alt="Mandel's" style="position: absolute; left: {L - 4}px; top: 40px; width: 280px; height: 75px">
  <div style="position: absolute; left: 342px; top: 60px; {F}; font-weight: 800; font-size: 14px; line-height: 1.6; letter-spacing: .2em; color: {RED}">PARTY TRAYS<br>BAKE CASE &middot; FOUNTAIN</div>
  {rules(L, 124, R - L)}

  <section style="position: absolute; left: {L}px; top: 152px; width: {LW}px">
    {bar('Platters and party trays', 'bar-back.png', LW)}
    {feat(None, SPEC['Lobster bites'], 12, tick=True)}
    {row(None, 'Deli platter', 'Corned beef, pastrami, turkey, tongue. Serves 10', '32.00', 14)}
    {row(None, 'Smoked fish platter', 'Nova, sable, whitefish, bagels. Per person', '4.75')}
    {row(None, 'Franks in blankets', 'Cocktail size in puff pastry, 50 pieces', '9.00')}
    {row(None, 'Sandwich tray', 'Twelve halves, pickles and slaw', '21.00')}
    <div style="position: relative; margin-top: 18px; width: {LW}px">
      <img src="assets/tint-beach.png" alt="" style="position: absolute; left: 0; top: 0; width: {LW}px; height: 100%">
      <div style="position: relative; padding: 12px 16px 14px; border: 2px solid {INK}">
        {head('Weekend at the beach?')}
        {body('Order by Thursday noon. Packed on ice for the drive out east, bread wrapped apart.', 5)}</div></div>
  </section>

  <section style="position: absolute; left: {RX}px; top: 152px; width: {RW}px">
    {bar('The fountain', 'bar-backr.png', RW)}
    {feat(None, SPEC["Alvy's LA cucumber mint cooler"], 12)}
    {feat(None, ("Egg cream", "Chocolate syrup and cold milk, hit hard with seltzer and stirred fast so it heads up.", ".60", "No egg, no cream. Don't ask."), 16)}
    {row(None, 'Celery tonic', None, '.45', 14)}
    {row(None, 'Orange juice', None, '.65', 6)}
    {row(None, 'Coffee', None, '.30', 6)}
    {row(None, 'Hot chocolate', None, '.40', 6)}
    {row(None, 'Hot tea, lemon', None, '.30', 6)}
  </section>

  <div style="position: absolute; left: {L}px; top: 682px">{bar('From the bake case', 'bar-wide.png', R - L, 'everything baked downstairs')}</div>
  <section style="position: absolute; left: {L}px; top: 734px; width: {LW}px">
    {feat(None, SPEC['New York cheesecake'], 0, tick=True)}
    <div style="{F}; font-size: 16px; line-height: 1.34; margin-top: 10px; padding-top: 8px; border-top: 1px solid {INK}">Whole cakes 9.50 with a day&rsquo;s notice. Plain only.</div>
  </section>
  <section style="position: absolute; left: {RX}px; top: 734px; width: {RW}px">
    {row(None, 'Rugelach', None, '.15 ea.', 0)}
    {row(None, 'Black and white', None, '.40', 5)}
    {row(None, 'Chocolate babka', None, '2.50', 5)}
    {row(None, 'Apple strudel', None, '.65', 5)}
    {row(None, 'Rice pudding', None, '.55', 5)}
    <div style="{F}; font-style: italic; font-weight: 600; font-size: 15px; color: {RED}; margin-top: 7px">No sneezing near the bake case.</div>
  </section>

  <div style="position: absolute; left: {L}px; top: 904px; width: {R - L}px; height: 84px">
    <img src="assets/tint-deliver.png" alt="" style="position: absolute; left: 0; top: 0; width: {R - L}px; height: 84px">
    <div style="position: absolute; left: 0; top: 0; width: {R - L - 4}px; height: 80px; border: 2px solid {INK}"></div>
    <div style="position: absolute; left: 16px; top: 9px; width: 500px">
      {head('We deliver, East 59th to East 96th', 22)}
      {body('Fifth Avenue to the river. Minimum order 5.00. Allow 30 minutes, longer when it rains. Cash only, no checks.', 4, 15.5)}</div>
    <div style="position: absolute; right: 18px; top: 10px; text-align: right">
      {kicker('CALL', INK)}
      <div style="{C}; font-size: 38px; line-height: 1.05; color: {RED}">555-0177</div></div>
  </div>
  <div style="position: absolute; left: {L}px; top: 996px; width: {R - L}px; display: flex; justify-content: space-between; {F}; font-size: 12px; letter-spacing: .08em; color: {INK}">
    <span>PRICES SUBJECT TO CHANGE WITHOUT NOTICE.</span><span>PRINTED IN N.Y.C.</span></div>
</div>'''

back_marks = f'''
  <img src="assets/stamp-prices.png" alt="" style="position: absolute; left: 372px; top: 826px; width: 150px; height: 66px">
  <div style="position: absolute; left: 584px; top: 48px; width: 184px; {P}; font-size: 23px; line-height: 1.0; color: {PEN}; transform: rotate(-4deg)">1 rye, mustard<br>1 white, mayo ?!<br><span style="font-size: 20px; margin-left: 64px">la-di-da</span></div>'''


def face(body, marks, name):
    img = lambda src: f'<img src="assets/{src}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'{img(f"paper-goldenrod-{name}.png")}{img("paper-grain.png")}{body}{img(f"wear-ink-{name}.png")}{marks}{img(f"wear-{name}.png")}</div>')


for name, b, m in (('front', front, front_marks), ('back', back, back_marks)):
    open(os.path.join(D, name + '.body.html'), 'w').write(b + m)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width={W}">'
        f'<title>Mandel\'s, {name}</title>{LINK}<style>body{{margin:0}}</style></head><body>{face(b, m, name)}</body></html>')

# ---------------------------------------------------------------- site data
json.dump({"fmt": "annietable", "fn": "fmtAnnieTable", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Caprasimo", "Libre Franklin", "Covered By Your Grace"],
           "phone": {"disp": "'Caprasimo',serif", "title": "'Caprasimo',serif", "name": "'Caprasimo',serif",
                     "body": "'Libre Franklin',sans-serif", "price": "'Caprasimo',serif", "note": "'Libre Franklin',sans-serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
labels = {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}
json.dump({"Annie Hall (1977)": labels}, open(os.path.join(D, 'annietable.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
