"""El Ultimo Tren cafeteria menu, Money Train (1995).
Two-sided US Letter table card from the Latin cafeteria at the top of the subway stairs,
where the transit cops of the night tour eat. House style lock (Jurassic system).
Writes front.html, back.html, film.json and lasttrain.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
INK, RED, PAPER, GOLD, MUTE = '#1d1b2c', '#c8371c', '#f5e6b0', '#b9852a', '#5a4f3c'
FONTS = ('family=Bungee'
         '&family=Bitter:ital,wght@0,400;0,600;0,800;1,400;1,600'
         '&family=Caveat+Brush')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Bungee', Impact, sans-serif"
TEXT = "font-family: 'Bitter', Georgia, serif"
HAND = "font-family: 'Caveat Brush', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Guava pastelitos": ("Pastelitos de guayaba", "Puff pastry sealed around guava paste and cream cheese, brushed with sugar syrup.", ".75",
                       "Out of the oven every hour till close."),
  "Gold token cookies": ("Token cookies", "Butter shortbread the size of a fare, punched through the middle, brushed with gold.", "4 for 1.25",
                         "Good for a cookie. Not a ride."),
  "Arroz con pollo": ("Arroz con pollo", "Thighs browned hard, then set on long-grain rice cooked slow with onion, green pepper, garlic, cilantro, achiote, green olives and capers.", "5.95",
                      "Big enough for two brothers."),
  "Token booth honey roasted nuts": ("Honey roasted nuts", "Almonds, cashews and peanuts baked with honey, sugar, cinnamon and salt, stirred till glossy. Warm in a paper cone.", "1.50",
                                     "Roasted here. Never torched."),
  "Money Train payday michelada": ("Payday michelada", "Cold lager over ice, fresh lime, tomato juice, hot sauce and Worcestershire, chili salt rim.", "3.50",
                                   "Friday is payday. Cash only."),
}
ADD = {
  'mallorca': ("Mallorca", "Soft, sweet spiral bun, split, pressed on the griddle with butter and buried in powdered sugar.", "1.10"),
  'cafe': ("Café con leche", "Dark roast pulled strong with scalded milk. Sugar on the counter.", ".85"),
  'pernil': ("Pernil asado", "Pork shoulder rubbed with garlic, oregano and sour orange, roasted overnight till the skin crackles. Rice and red beans.", "6.25"),
  'bistec': ("Bistec encebollado", "Thin top round simmered under a pile of onions with vinegar and garlic. White rice and tostones.", "6.95"),
  'cubano': ("Sandwich cubano", "Roast pork, ham, Swiss, pickles and mustard, pressed flat and hot.", "3.95"),
  'morir': ("Morir soñando", "Fresh orange juice whisked into cold sweet milk over crushed ice.", "1.75"),
}


def item(n, d, p, note=None, top=22):
    nt = (f'<div style="{TEXT}; font-style: italic; font-weight: 600; font-size: 18px; line-height: 1.3; color: {RED}; margin-top: 4px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">
        <div style="{TEXT}; font-weight: 800; font-size: 27px; line-height: 1.08">{n}</div>
        <div style="{TEXT}; font-weight: 800; font-size: 27px; white-space: nowrap">{p}</div></div>
      <div style="{TEXT}; font-size: 20px; line-height: 1.32; margin-top: 4px; color: #2e2a26; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=22, note=False):
    n, d, p, nt = SPEC[k]
    return item(n, d, p, nt if note else None, top)


def A(k, top=22):
    return item(*ADD[k], top=top)


def bar(t, sub=None, width=None):
    s = f'<span style="{TEXT}; font-weight: 800; font-size: 18px; letter-spacing: 0.16em; color: {PAPER}; margin-left: auto; padding-left: 16px; white-space: nowrap; opacity: 0.9">{sub}</span>' if sub else ''
    w = f'width: {width}px;' if width else ''
    token = (f'<div style="flex: none; width: 34px; height: 34px; border-radius: 50%; background: {GOLD}; border: 3px solid {PAPER}; margin-right: 16px; '
             f'position: relative"><div style="position: absolute; left: 11px; top: 11px; width: 12px; height: 12px; border-radius: 50%; background: {RED}"></div></div>')
    return (f'<div style="display: flex; align-items: center; {w} background: {RED}; color: {PAPER}; padding: 9px 20px 9px 14px; border-bottom: 5px solid {INK}">'
            f'{token}<span style="{DISP}; font-size: 40px; line-height: 1; white-space: nowrap">{t}</span>{s}</div>')


def kicker(t, extra=''):
    return f'<div style="{TEXT}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {RED}; {extra}">{t}</div>'


def face(inner):
    edge = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 10px; background: {INK}"></div>'
            f'<div style="position: absolute; left: 0; top: 10px; width: {W}px; height: 6px; background: {RED}"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 16}px; width: {W}px; height: 6px; background: {RED}"></div>'
            f'<div style="position: absolute; left: 0; top: {H - 10}px; width: {W}px; height: 10px; background: {INK}"></div>')
    fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
            'background: radial-gradient(ellipse 80% 74% at 50% 48%, rgba(255,246,214,0.10) 0%, rgba(255,246,214,0.08) 55%, rgba(150,110,40,0.24) 100%)"></div>')
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
             f'height: {H}px; pointer-events: none; display: block; opacity: 0.8">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{inner}{edge}{fade}{grain}</div>')


L, CW = 56, 704

TOKEN = f'''<div style="flex: none; width: 118px; height: 118px; border-radius: 50%; background: {GOLD}; border: 4px solid {INK}; position: relative; transform: rotate(-8deg)">
  <div style="position: absolute; left: 7px; top: 7px; width: 96px; height: 96px; border-radius: 50%; border: 2px dashed {PAPER}"></div>
  <div style="position: absolute; left: 0; top: 22px; width: 118px; text-align: center; {TEXT}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; color: {INK}">FICHAS</div>
  <div style="position: absolute; left: 0; top: 40px; width: 118px; text-align: center; {DISP}; font-size: 30px; line-height: 1; color: {PAPER}">1.25</div>
  <div style="position: absolute; left: 0; top: 76px; width: 118px; text-align: center; {TEXT}; font-weight: 800; font-size: 14px; letter-spacing: 0.1em; color: {INK}">ACEPTADAS</div></div>'''

front = face(f'''
<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Top of the subway stairs', 'white-space: nowrap')}{kicker('Open till the last train', 'white-space: nowrap; color: ' + MUTE)}</div>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px">
    <div>
      <div style="{DISP}; font-size: 60px; line-height: 1; color: {INK}; white-space: nowrap">El Último <span style="color: {RED}">Tren</span></div>
      <div style="{TEXT}; font-weight: 800; font-size: 20px; letter-spacing: 0.32em; text-transform: uppercase; color: {MUTE}; margin-top: 12px">Cafetería y Panadería</div></div>
    {TOKEN}</div>
  <div style="height: 5px; background: {INK}; margin-top: 14px"></div>
  <div style="margin-top: 16px; border: 3px solid {RED}; padding: 6px; background: #fff7dc">
    <img src="assets/still-regulars.jpg" alt="Three transit cops riding a subway car on the night tour" style="display: block; width: {CW - 18}px; height: 262px; object-fit: cover"></div>
  <div style="{TEXT}; font-style: italic; font-size: 17px; color: {MUTE}; margin-top: 7px">Our regulars from the night tour. The window table is theirs.</div>
  <div style="margin-top: 14px">{bar('Del Horno', 'FROM THE OVEN')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Guava pastelitos', 12)}{S('Gold token cookies', 16)}</div>
    <div>{A('mallorca', 12)}{A('cafe', 16)}</div></div>
  <div style="display: flex; gap: 24px; margin-top: 18px; align-items: flex-end; border-top: 1px solid {INK}; padding-top: 12px">
    <div style="flex: 1">
      {kicker('A word from a regular', 'font-size: 16px')}
      <div style="{TEXT}; font-size: 19px; line-height: 1.32; margin-top: 4px">Best pastelitos on the line, and the coffee is on when the night tour lets out. Put mine on John's tab.</div></div>
    <div style="flex: none; width: 200px">
      <div style="{HAND}; font-size: 46px; line-height: 1; color: #23336a; transform: rotate(-5deg)">Charlie</div>
      <div style="{TEXT}; font-weight: 600; font-size: 14px; color: {MUTE}; margin-top: 6px">Transit Police, Decoy Unit</div></div></div>
</div>
<div style="position: absolute; left: {L}px; top: 990px; width: {CW}px; display: flex; justify-content: space-between; {TEXT}; font-weight: 600; font-size: 15px; color: {MUTE}">
  <span>Para llevar, call 555-0125</span><span>Lunch and drinks on the back</span></div>''')

CHECK = f'''<div style="position: absolute; left: 0; top: 338px; width: 300px; height: 146px; background: #fbf8ee; border: 1px solid #b9b3a0; transform: rotate(-2.5deg); box-shadow: 2px 3px 6px rgba(60,40,10,0.25); padding: 10px 14px; box-sizing: border-box">
  <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #2f6b4f; padding-bottom: 3px">
    <span style="{TEXT}; font-weight: 800; font-size: 15px; letter-spacing: 0.12em; color: #2f6b4f">GUEST CHECK</span><span style="{TEXT}; font-weight: 800; font-size: 15px; color: {RED}">No. 1995</span></div>
  <div style="{HAND}; font-size: 21px; line-height: 1.38; color: #23336a; margin-top: 4px">
    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #c9d8cc"><span>2 arroz c/ pollo</span><span>11.90</span></div>
    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #c9d8cc"><span>1 café, Santiago</span><span>.85</span></div>
    <div style="display: flex; justify-content: space-between; border-bottom: 1px solid #c9d8cc"><span>Charlie: on the tab? <span style="color: {RED}">NO.</span></span><span></span></div>
    </div>
  <div style="position: absolute; left: 196px; top: 114px; border: 3px solid {RED}; color: {RED}; {DISP}; font-size: 15px; line-height: 1; padding: 4px 8px; white-space: nowrap; transform: rotate(-8deg); opacity: 0.85">PAID. JOHN</div></div>'''

back = face(f'''
<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    {kicker('El Último Tren')}{kicker('Almuerzo 11 to 3, cena till late', 'color: ' + MUTE)}</div>
  <div style="margin-top: 12px">{bar('Platos del Día', 'HOT PLATES')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Arroz con pollo', 14, note=True)}{A('cubano')}</div>
    <div>{A('pernil', 14)}{A('bistec')}</div></div>
  <div style="height: 1px; background: {INK}; margin-top: 20px"></div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px; margin-top: 20px">
    <div style="position: relative">
      {bar('Bebidas')}
      {S('Money Train payday michelada', 14, note=True)}{A('morir')}
      {CHECK}</div>
    <div style="position: relative">
      {bar('Al Peso')}
      {S('Token booth honey roasted nuts', 14, note=True)}
      <div style="margin-top: 18px; border: 3px solid {RED}; padding: 5px; background: #fff7dc"><img src="assets/still-payday.jpg" alt="Two transit cops beside the canvas fare bags" style="display: block; width: 316px; height: 150px; object-fit: cover"></div>
      <div style="{TEXT}; font-style: italic; font-size: 17px; line-height: 1.3; color: {MUTE}; margin-top: 7px">The money train runs right under us. Up here, cash only.</div></div></div>
</div>
<div style="position: absolute; left: {L}px; top: 976px; width: {CW}px; border-top: 1px solid {INK}; padding-top: 9px; display: flex; justify-content: space-between; {TEXT}; font-weight: 600; font-size: 15px; color: {MUTE}">
  <span>Prices subject to change. No tabs, that means you, Charlie.</span><span>Form 125, 1995</span></div>''')

for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>El Ultimo Tren</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "lasttrain", "fn": "fmtLastTrain", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Bungee", "Bitter", "Caveat Brush"],
           "phone": {"disp": "'Bungee',sans-serif", "title": "'Bungee',sans-serif", "name": "'Bitter',serif",
                     "body": "'Bitter',serif", "price": "'Bitter',serif", "note": "'Bitter',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Money Train (1995)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'lasttrain.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
