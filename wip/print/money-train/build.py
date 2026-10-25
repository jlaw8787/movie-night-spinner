"""El Ultimo Tren bakery bag (Money Train, 1995).
A flat kraft merchandise bag from a Spanish bakery and lunch counter at the top of the subway
stairs, the bag they hand you your pastelitos in. 8.5 x 11 in flat (US Letter), printed one colour
in dark green by flexo, front and back. Thumb notch on the front, glued seam and bottom flap on
the back. Writes front.body.html, back.body.html, front.html, back.html, film.json and the labels."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
KRAFT, INK = '#c49a6c', '#173a28'
FONTS = ('family=Yellowtail&family=Oswald:wght@500;700'
         '&family=Libre+Franklin:ital,wght@0,400;0,600;1,400;1,600')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
S = "font-family: 'Yellowtail', cursive"
O = "font-family: 'Oswald', 'Arial Narrow', sans-serif"
B = "font-family: 'Libre Franklin', Arial, sans-serif"

# spec key -> (printed name, description, price, note on the bag or None, phone note)
SPEC = {
  "Guava pastelitos": ("Pastelitos de guayaba",
      "Puff pastry sealed around guava paste and cream cheese, baked golden and brushed with syrup.",
      ".75", "Out of the oven every hour till close.", "Out of the oven every hour till close."),
  "Gold token cookies": ("Token cookies",
      "Butter shortbread cut the size of a subway fare, a hole punched through the middle and a brush of gold lustre.",
      "4 for 1.00", "Good for a cookie. Not a ride.", "Good for a cookie. Not a ride."),
  "Token booth honey roasted nuts": ("Honey roasted nuts",
      "Almonds, cashews and peanuts glazed with cinnamon sugar and a pinch of salt, turned in a hot oven until glossy. Sold warm in a paper cone.",
      "1.50", "Roasted here. Never torched.", "Roasted here. Never torched."),
  "Arroz con pollo": ("Arroz con pollo",
      "Thighs browned hard, then laid on long-grain rice cooked slow with onion, green pepper, garlic, cilantro, achiote, green olives and capers.",
      "4.95", "Big enough for two brothers.", "Big enough for two brothers."),
  "Money Train payday michelada": ("Payday michelada",
      "Cold lager over ice with lime, tomato juice, hot sauce and Worcestershire, in a glass rimmed with chili salt. To go, the bottle rides in a paper bag.",
      "2.75", "Friday is payday. Cash only.", "Friday is payday. Cash only."),
}
ADDED = {
  'pan': ("Pan de agua", "Crusty white loaf, soft inside, baked twice a day. Ask for it buttered and pressed on the grill.", "1.25", None),
  'cafe': ("Café con leche", "Strong dark roast poured into steamed milk, sugared the way you like it.", ".75", None),
  'malta': ("Malta", "Dark, sweet barley soda, ice cold in the bottle. No alcohol.", "1.00", None),
}


def item(it, first=False, gap=24, nsz=27):
    name, desc, price, note = it[:4]
    nt = (f'<div style="{B}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 1.3; margin-top: 5px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">
        <div style="{O}; font-weight: 700; font-size: {nsz}px; line-height: 1.08; text-transform: uppercase; letter-spacing: .01em">{name}</div>
        <div style="{O}; font-weight: 700; font-size: 23px; line-height: 1; white-space: nowrap">{price}</div></div>
      <div style="{B}; font-size: 16px; line-height: 1.4; margin-top: 6px; text-wrap: pretty">{desc}</div>{nt}</div>'''


def head(es, en, top=0):
    return (f'<div style="margin-top: {top}px; margin-bottom: 18px; display: flex; align-items: baseline; gap: 12px; '
            f'border-bottom: 3px solid {INK}; padding-bottom: 6px">'
            f'<span style="{S}; font-size: 44px; line-height: .9">{es}</span>'
            f'<span style="{O}; font-weight: 500; font-size: 15px; letter-spacing: .18em; text-transform: uppercase">{en}</span></div>')


def bar(x, y, w, text, h=44, fs=17):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: {INK}; '
            f'display: flex; align-items: center; justify-content: space-between; padding: 0 18px; box-sizing: border-box; '
            f'{O}; font-weight: 700; font-size: {fs}px; letter-spacing: .16em; color: {KRAFT}">{text}</div>')


DOT = '<span style="font-weight: 500">&bull;</span>'
L, R = 48, 768

# ---------------------------------------------------------------- front of the bag
front = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}">
  <div style="position: absolute; left: {L}px; top: 78px; {O}; font-weight: 700; font-size: 17px; letter-spacing: .3em">PANADER&Iacute;A Y CAFETER&Iacute;A</div>
  <div style="position: absolute; left: {L - 4}px; top: 134px; {S}; font-size: 104px; line-height: 1.02; letter-spacing: -.01em">El &Uacute;ltimo<br><span style="font-size: 132px; margin-left: 96px">Tren</span></div>
  <div style="position: absolute; left: 512px; top: 92px; width: 256px; height: 256px">
    <img src="assets/train-ink.png" alt="" style="position: absolute; left: 0; top: 0; width: 256px; height: 256px; display: block">
    <div style="position: absolute; left: 58px; top: 32px; width: 140px; height: 30px; display: flex; align-items: center; justify-content: center; {O}; font-weight: 700; font-size: 15px; letter-spacing: .12em">LAST TRAIN</div>
  </div>
  <div style="position: absolute; left: {L}px; top: 372px; width: {R - L}px; display: flex; justify-content: space-between; align-items: baseline">
    <span style="{O}; font-weight: 700; font-size: 24px; letter-spacing: .06em">ABIERTO HASTA EL &Uacute;LTIMO TREN</span>
    <span style="{B}; font-style: italic; font-weight: 600; font-size: 18px">Open till the last train, 7 days</span></div>
  {bar(L, 420, R - L, f'<span>SE ACEPTAN FICHAS</span>{DOT}<span>TOKENS ACCEPTED</span>{DOT}<span>PARA LLEVAR</span>')}

  <section style="position: absolute; left: {L}px; top: 500px; width: 428px">
    {head('Del horno', 'From the oven')}
    {item(SPEC['Guava pastelitos'], True)}
    {item(SPEC['Gold token cookies'])}
    {item(ADDED['pan'])}
  </section>

  <section style="position: absolute; left: 508px; top: 500px; width: 260px">
    {head('Al peso', 'By the bag')}
    {item(SPEC['Token booth honey roasted nuts'], True, nsz=22)}
    <div style="margin-top: 28px; border: 3px solid {INK}; padding: 14px 16px 16px">
      <div style="{O}; font-weight: 700; font-size: 21px; line-height: 1.1; letter-spacing: .04em">POR DOCENA</div>
      <div style="{B}; font-size: 16px; line-height: 1.4; margin-top: 6px">Pastelitos 8.00 the dozen. Token cookies 2.75. Call ahead and we box them.</div>
    </div>
  </section>

  <div style="position: absolute; left: {L}px; top: 948px; width: {R - L}px; height: 3px; background: {INK}"></div>
  <div style="position: absolute; left: {L}px; top: 964px; width: {R - L}px; display: flex; justify-content: space-between; align-items: baseline">
    <span style="{B}; font-size: 16px; line-height: 1.35">At the top of the subway stairs. Tel. 555-0195</span>
    <span style="{O}; font-weight: 700; font-size: 16px; letter-spacing: .12em">LUNCH Y BEBIDAS AL DORSO</span></div>
</div>'''

# ---------------------------------------------------------------- back of the bag
RB = 724   # glued seam sits at x 744, keep everything left of it
back = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}">
  <header style="position: absolute; left: {L}px; top: 52px; width: {RB - L}px; display: flex; justify-content: space-between; align-items: baseline">
    <span style="{S}; font-size: 64px; line-height: 1">El &Uacute;ltimo Tren</span>
    <span style="{O}; font-weight: 700; font-size: 16px; letter-spacing: .2em">CAFETER&Iacute;A</span></header>
  {bar(L, 144, RB - L, f'<span>ALMUERZO 11 A 3</span>{DOT}<span>LUNCH COUNTER</span>{DOT}<span>CENA HASTA TARDE</span>', fs=16)}

  <section style="position: absolute; left: {L}px; top: 224px; width: 380px">
    {head('Almuerzo', 'Hot plate')}
    {item(SPEC['Arroz con pollo'], True, nsz=30)}
    <div style="{B}; font-size: 16px; line-height: 1.4; margin-top: 14px; padding-top: 12px; border-top: 1px solid {INK}">Every plate comes with pan de agua and butter.</div>

    <div style="margin-top: 40px; background: {INK}; color: {KRAFT}; padding: 18px 20px 20px">
      <div style="{O}; font-weight: 700; font-size: 24px; line-height: 1.1; letter-spacing: .05em">ON THE MIDNIGHT TOUR?</div>
      <div style="{B}; font-size: 16px; line-height: 1.42; margin-top: 8px">Token clerks, motormen, conductors and transit cops working nights: coffee is on the house after twelve. Show your pass.</div>
      <div style="{B}; font-style: italic; font-weight: 600; font-size: 16px; line-height: 1.3; margin-top: 10px">No sleeping at the counter.</div>
    </div>
  </section>

  <section style="position: absolute; left: 468px; top: 224px; width: {RB - 468}px">
    {head('Bebidas', 'Clocking off')}
    {item(SPEC['Money Train payday michelada'], True, nsz=23)}
    {item(ADDED['malta'], nsz=23)}
    {item(ADDED['cafe'], nsz=23)}
  </section>

  <div style="position: absolute; left: {L}px; top: 722px; width: {RB - L}px; border-top: 3px solid {INK}; border-bottom: 3px solid {INK}; padding: 16px 0 18px; display: flex; gap: 28px; align-items: center">
    <div style="{S}; font-size: 50px; line-height: 1; white-space: nowrap">Pedidos</div>
    <div style="{B}; font-size: 16px; line-height: 1.42">Pastelitos, token cookies and pan de agua by the dozen for the station house, the depot or the block party. Call a day ahead and we have them warm.</div>
  </div>
  <div style="position: absolute; left: {L}px; top: 868px; width: {RB - L}px; height: 3px; background: {INK}"></div>
  <div style="position: absolute; left: {L}px; top: 884px; width: {RB - L}px; display: flex; justify-content: space-between; align-items: baseline">
    <span style="{O}; font-weight: 700; font-size: 18px; letter-spacing: .08em">5 A.M. TILL THE LAST TRAIN</span>
    <span style="{B}; font-size: 16px">Tel. 555-0195</span></div>
  <div style="position: absolute; left: {L}px; top: 918px; width: {RB - L}px; {B}; font-size: 13px; letter-spacing: .04em">PRECIOS SUJETOS A CAMBIO. PRICES GOOD THROUGH 1995. GRACIAS, VUELVA PRONTO.</div>
</div>'''


def face(body, name):
    grain = f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: .8">'
    wear = f'<img src="assets/bag-paper-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {KRAFT}">'
            f'{grain}{body}{wear}</div>')


for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width={W}">'
        f'<title>El Ultimo Tren bag, {name}</title>{LINK}<style>body{{margin:0}}</style></head><body>{face(body, name)}</body></html>')

# ---------------------------------------------------------------- site data
json.dump({"fmt": "lasttrain", "fn": "fmtLastTrain", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Yellowtail", "Oswald", "Libre Franklin"],
           "phone": {"disp": "'Yellowtail',cursive", "title": "'Yellowtail',cursive", "name": "'Oswald',sans-serif",
                     "body": "'Libre Franklin',sans-serif", "price": "'Oswald',sans-serif", "note": "'Libre Franklin',sans-serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
labels = {k: {"n": v[0], "d": v[1], "note": v[4]} for k, v in SPEC.items()}
json.dump({"Money Train (1995)": labels}, open(os.path.join(D, 'lasttrain.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
