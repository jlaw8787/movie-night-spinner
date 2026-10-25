"""El Ultimo Tren bakery bag (Money Train, 1995).
A gusseted kraft bag (self-opening sack) from a Puerto Rican bakery and lunch counter at the top of
the subway stairs, the bag they hand you your pastelitos in. Face 8.5 x 11 in (US Letter), printed
one ink, dark green, by flexo from a line-cut plate, front and back. A violet rubber date stamp is
added at the counter. Construction: serrated top, thumb notch on the front, side folds, glued seam
and the folded bottom on the back.
Writes front.body.html, back.body.html, front.html, back.html, film.json and lasttrain.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
KRAFT, INK, VIOLET = '#c49a6c', '#183c2a', '#4c3a7a'
FONTS = ('family=Corben:wght@400;700&family=Oswald:wght@500;700'
         '&family=Arvo:ital,wght@0,400;0,700;1,400;1,700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
C = "font-family: 'Corben', 'Cooper Black', serif; font-weight: 700"
O = "font-family: 'Oswald', 'Arial Narrow', sans-serif"
B = "font-family: 'Arvo', 'Rockwell', serif"
SPREAD = 'text-shadow: 0 0 .7px rgba(24,60,42,.6)'

# spec key -> (printed name, description, price, note on the bag or None, phone note)
SPEC = {
  "Guava pastelitos": ("Pastelitos de guayaba",
      "Puff pastry sealed around guava paste and cream cheese, baked golden and brushed with sugar syrup.",
      "60¢", "Out of the oven every hour.", "Out of the oven every hour."),
  "Gold token cookies": ("Token cookies",
      "Butter shortbread rounds the size of a subway fare, the middle punched out, the tops brushed with gold.",
      "4 for $1", "Good for a cookie. Not a ride.", "Good for a cookie. Not a ride."),
  "Token booth honey roasted nuts": ("Honey roasted nuts",
      "Almonds, cashews and peanuts tossed in honey, sugar, cinnamon and a pinch of salt, baked and stirred till glossy. Sold warm in a paper cone.",
      "$1.50", "Made here. Never torched.", "Made here. Never torched."),
  "Arroz con pollo": ("Arroz con pollo",
      "Chicken thighs browned hard, then set on long-grain rice cooked slow with onion, green pepper, garlic, cilantro, achiote, green olives and capers.",
      "$4.95", "Big enough for two brothers.", "Big enough for two brothers."),
  "Money Train payday michelada": ("Payday cerveza",
      "Cold lager over ice with fresh lime, tomato juice, hot sauce and a dash of Worcestershire, in a glass rimmed with chili salt, slipped into a paper sack.",
      "$2.75", "Friday is payday. Cash only.", "Friday is payday. Cash only."),
}
ADDED = {
  'mallorca': ("Mallorca", "Soft, sweet spiral bun, split, pressed on the grill with butter and buried in powdered sugar.", "75¢", "Ask for it with ham and cheese."),
  'pan': ("Pan de agua", "Crusty white loaf, soft inside, baked twice a day. Every lunch plate comes with it, buttered.", "$1.25", "A loaf for a token."),
  'tostones': ("Tostones", "Green plantain fried, smashed flat and fried again till crisp, with garlic mojo for dipping.", "$1.50", None),
  'malta': ("Malta", "Dark, sweet barley soda, ice cold in the bottle. No alcohol.", "$1", None),
  'cafe': ("Café con leche", "Dark roast brewed strong and poured into steamed milk, sugared the way you take it.", "65¢", None),
  'negro': ("Café negro", "Small cup, black and strong, the way the night shift drinks it.", "50¢", None),
}


def item(it, first=False, gap=16, nsz=25, psz=22):
    name, desc, price, note = it[:4]
    nt = (f'<div style="{B}; font-style: italic; font-weight: 700; font-size: 16px; line-height: 1.3; margin-top: 4px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{O}; font-weight: 700; font-size: {nsz}px; line-height: 1.08; text-transform: uppercase; letter-spacing: .015em">{name}</div>
        <div style="{O}; font-weight: 700; font-size: {psz}px; line-height: 1; white-space: nowrap">{price}</div></div>
      <div style="{B}; font-size: 16px; line-height: 1.36; margin-top: 4px">{desc}</div>{nt}</div>'''


def head(es, en, top=0, sz=31):
    return (f'<div style="margin-top: {top}px; margin-bottom: 12px; display: flex; align-items: baseline; justify-content: space-between; '
            f'border-bottom: 3px solid {INK}; padding-bottom: 4px">'
            f'<span style="{C}; font-size: {sz}px; line-height: 1">{es}</span>'
            f'<span style="{O}; font-weight: 500; font-size: 14px; letter-spacing: .2em; text-transform: uppercase">{en}</span></div>')


def bar(x, y, w, parts, h=36, fs=16):
    inner = '<span style="font-size: 12px">&#9733;</span>'.join(f'<span>{p}</span>' for p in parts)
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; background: {INK}; '
            f'display: flex; align-items: center; justify-content: space-between; padding: 0 16px; box-sizing: border-box; '
            f'{O}; font-weight: 700; font-size: {fs}px; letter-spacing: .16em; color: {KRAFT}; text-shadow: none">{inner}</div>')


def rules(x, y, w):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: 3px; background: {INK}"></div>'
            f'<div style="position: absolute; left: {x}px; top: {y + 6}px; width: {w}px; height: 1px; background: {INK}"></div>')


def leader(label, price):
    return (f'<div style="display: flex; align-items: baseline; gap: 6px; {B}; font-size: 16px; line-height: 1.5">'
            f'<span style="white-space: nowrap">{label}</span>'
            f'<span style="flex: 1; border-bottom: 2px dotted {INK}; transform: translateY(-4px)"></span>'
            f'<span style="{O}; font-weight: 700; font-size: 17px; white-space: nowrap">{price}</span></div>')


L, R = 48, 768

# ---------------------------------------------------------------- front of the bag
front = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}; {SPREAD}">
  <div style="position: absolute; left: {L}px; top: 70px; {O}; font-weight: 700; font-size: 15px; letter-spacing: .26em">PANADER&Iacute;A &middot; REPOSTER&Iacute;A</div>
  <div style="position: absolute; right: {W - R}px; top: 70px; {O}; font-weight: 700; font-size: 15px; letter-spacing: .26em; text-align: right">CAFETER&Iacute;A &middot; ALMUERZO</div>
  {rules(L, 96, R - L)}
  <div style="position: absolute; left: {L}px; top: 118px; width: {R - L}px; text-align: center; {C}; font-size: 70px; line-height: 1; white-space: nowrap">El &Uacute;ltimo Tren</div>
  {rules(L, 200, R - L)}

  <aside style="position: absolute; left: {L}px; top: 222px; width: 194px">
    <div style="{O}; font-weight: 700; font-size: 35px; line-height: 1.08; letter-spacing: .01em">ABIERTO<br>HASTA EL<br>&Uacute;LTIMO TREN</div>
    <div style="{B}; font-style: italic; font-size: 16px; line-height: 1.32; margin-top: 9px; padding-top: 8px; border-top: 2px solid {INK}">Open till the last train, seven days a week.</div>
    <div style="margin-top: 9px; padding-top: 4px; border-top: 2px solid {INK}">
      {leader('Pan', '5 A.M.')}{leader('Almuerzo', '11 to 3')}{leader('Cena', 'till late')}</div>
  </aside>
  <img src="assets/car-ink.png" alt="" style="position: absolute; left: 266px; top: 214px; width: 284px; height: 317px; display: block">
  <aside style="position: absolute; left: 574px; top: 216px; width: 194px; text-align: center">
    <img src="assets/token-ink.png" alt="" style="display: block; width: 112px; height: 112px; margin: 0 auto">
    <div style="{O}; font-weight: 700; font-size: 19px; letter-spacing: .1em; margin-top: 6px; line-height: 1.1">SE ACEPTAN FICHAS</div>
    <div style="{B}; font-size: 16px; line-height: 1.3; margin-top: 4px">One token, $1.25, buys a caf&eacute; con leche and a pastelito.</div>
    <div style="{B}; font-style: italic; font-weight: 700; font-size: 16px; line-height: 1.3; margin-top: 4px">Here, tokens skip the money train.</div>
  </aside>

  {bar(L, 542, R - L, ['PASTELITOS', 'MALLORCAS', 'PAN DE AGUA', 'CAF&Eacute;', 'PARA LLEVAR'])}

  <section style="position: absolute; left: {L}px; top: 596px; width: 446px">
    {head('Del horno', 'From the oven')}
    {item(SPEC['Guava pastelitos'], True)}
    {item(SPEC['Gold token cookies'])}
    {item(ADDED['mallorca'])}
  </section>

  <section style="position: absolute; left: 524px; top: 596px; width: {R - 524}px">
    {head('Al peso', 'By the bag')}
    {item(SPEC['Token booth honey roasted nuts'], True, nsz=20, psz=20)}
    <div style="margin-top: 14px; border: 2px solid {INK}; padding: 6px 10px 6px">
      <div style="{O}; font-weight: 700; font-size: 17px; letter-spacing: .14em; text-align: center; border-bottom: 1px solid {INK}; padding-bottom: 3px; margin-bottom: 2px">POR DOCENA</div>
      {leader('Pastelitos', '6.50')}{leader('Mallorcas', '8.00')}{leader('Token cookies', '2.75')}</div>
  </section>

  {rules(L, 962, R - L)}
  <div style="position: absolute; left: {L}px; top: 978px; width: {R - L}px; display: flex; justify-content: space-between; align-items: baseline">
    <span style="{B}; font-size: 16px">At the top of the subway stairs. Tel. 555-0195</span>
    <span style="{O}; font-weight: 700; font-size: 16px; letter-spacing: .14em">LUNCH Y BEBIDAS AL DORSO</span></div>
</div>'''

# ---------------------------------------------------------------- back of the bag
RB = 736          # glued seam sits at x 766, keep the type left of it
FOLD = 904        # bottom folded up from here
back = f'''<div style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; color: {INK}; {SPREAD}">
  <header style="position: absolute; left: {L}px; top: 50px; width: {RB - L}px; display: flex; justify-content: space-between; align-items: flex-end">
    <span style="{C}; font-size: 52px; line-height: 1">El &Uacute;ltimo Tren</span>
    <span style="{O}; font-weight: 700; font-size: 15px; letter-spacing: .2em; text-align: right; line-height: 1.35">LUNCH COUNTER<br>Y CAFETER&Iacute;A</span></header>
  {rules(L, 118, RB - L)}
  {bar(L, 134, RB - L, ['ALMUERZO 11 A 3', 'CAF&Eacute; TODO EL D&Iacute;A', 'CENA HASTA TARDE'])}

  <section style="position: absolute; left: {L}px; top: 194px; width: 354px">
    {head('Almuerzo', 'Hot plate')}
    {item(SPEC['Arroz con pollo'], True, nsz=28)}
    {item(ADDED['pan'], gap=14, nsz=24, psz=22)}
    {item(ADDED['tostones'], gap=14, nsz=24, psz=22)}
  </section>

  <section style="position: absolute; left: 432px; top: 194px; width: {RB - 432}px">
    {head('Bebidas', 'Clocking off')}
    {item(SPEC['Money Train payday michelada'], True, nsz=23)}
    {item(ADDED['malta'], nsz=23, gap=12)}
    {item(ADDED['cafe'], nsz=23, gap=12)}
    {item(ADDED['negro'], nsz=23, gap=12)}
  </section>

  <div style="position: absolute; left: {L}px; top: 664px; width: 354px; box-sizing: border-box; background: {INK}; color: {KRAFT}; text-shadow: none; padding: 14px 18px 15px">
    <div style="{O}; font-weight: 700; font-size: 23px; line-height: 1.1; letter-spacing: .05em">ON THE MIDNIGHT TOUR?</div>
    <div style="{B}; font-size: 16px; line-height: 1.36; margin-top: 6px">Token clerks, motormen, conductors and transit cops working nights: coffee is on the house after twelve. Show your pass.</div>
    <div style="{B}; font-style: italic; font-weight: 700; font-size: 16px; line-height: 1.3; margin-top: 7px">Decoys too. We never saw you.</div>
  </div>

  <img src="assets/counter-ink.png" alt="" style="position: absolute; left: 434px; top: 664px; width: 302px; height: 216px; display: block">

  <section style="position: absolute; left: {L}px; top: 832px; width: 354px">
    <div style="{B}; font-size: 16px; line-height: 1.36"><span style="{O}; font-weight: 700; font-size: 17px; letter-spacing: .12em">PEDIDOS.</span> Pastelitos, mallorcas, token cookies and pan de agua by the dozen for the station house, the depot or the block party. Call a day ahead.</div>
  </section>

  <img src="assets/recycle-ink.png" alt="" style="position: absolute; left: 132px; top: 926px; width: 62px; height: 62px; display: block">
  <div style="position: absolute; left: 206px; top: 924px; width: 210px; {B}; font-size: 12px; line-height: 1.32">Hecha de papel reciclado.<br>Made from recycled paper.<br>Please use this bag again.</div>
  <div style="position: absolute; left: 428px; top: 920px; width: 256px; text-align: center">
    <div style="{C}; font-size: 30px; line-height: 1">Gracias</div>
    <div style="{O}; font-weight: 700; font-size: 15px; letter-spacing: .2em; margin-top: 6px">THANK YOU &middot; VUELVA PRONTO</div>
    <div style="{B}; font-size: 12px; margin-top: 5px">Prices good through 1995.</div>
  </div>
</div>'''


def stamp(x, y, rot, lines):
    """violet rubber stamp pressed by hand at the counter: uneven, a little crooked"""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; transform: rotate({rot}deg); color: {VIOLET}; text-shadow: 0 0 .8px rgba(76,58,122,.7); '
            f'border: 3px solid {VIOLET}; border-radius: 4px; padding: 4px 10px 5px; text-align: center; opacity: .86">'
            f'<div style="border-bottom: 1px solid {VIOLET}; {O}; font-weight: 700; font-size: 14px; letter-spacing: .18em; padding-bottom: 2px">{lines[0]}</div>'
            f'<div style="{O}; font-weight: 700; font-size: 22px; letter-spacing: .08em; line-height: 1.15; margin-top: 2px">{lines[1]}</div></div>')


FRONT_STAMP = stamp(600, 452, -6, ('HORNEADO HOY', 'NOV 17 1995'))


def face(body, name, extra=''):
    paper = f'<img src="assets/kraft-paper-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
    grain = f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block; opacity: .7">'
    inkw = f'<img src="assets/ink-wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    wear = f'<img src="assets/bag-paper-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {KRAFT}">'
            f'{paper}{grain}{body}{inkw}{extra}{wear}</div>')


if __name__ == '__main__':
    for name, body, extra in (('front', front, FRONT_STAMP), ('back', back, '')):
        open(os.path.join(D, name + '.body.html'), 'w').write(body + extra)
        open(os.path.join(D, name + '.html'), 'w').write(
            f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width={W}">'
            f'<title>El Ultimo Tren bag, {name}</title>{LINK}<style>body{{margin:0}}</style></head><body>{face(body, name, extra)}</body></html>')

    # ------------------------------------------------------------ site data
    json.dump({"fmt": "lasttrain", "fn": "fmtLastTrain", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
               "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Corben", "Oswald", "Arvo"],
               "phone": {"disp": "'Corben',serif", "title": "'Corben',serif", "name": "'Oswald',sans-serif",
                         "body": "'Arvo',serif", "price": "'Oswald',sans-serif", "note": "'Arvo',serif"}},
              open(os.path.join(D, 'film.json'), 'w'), indent=1)
    labels = {k: {"n": v[0], "d": v[1], "note": v[4]} for k, v in SPEC.items()}
    json.dump({"Money Train (1995)": labels}, open(os.path.join(D, 'lasttrain.labels.json'), 'w'), indent=1, ensure_ascii=False)
    print('built')
