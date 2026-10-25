"""Motorman Coffee Shop menu, The Taking of Pelham One Two Three (1974).
Two-sided US Letter card from the coffee shop across from Transit Headquarters, where the
Command Center sends out for lunch. House style lock (Jurassic system). Run paint.py first.
Writes front.html, back.html, film.json and shift.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
INK, ORANGE, PAPER, MUTE = '#16302a', '#c4361f', '#e7ece2', '#45554d'
FONTS = ('family=Inter+Tight:wght@600;800;900'
         '&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400'
         '&family=Shadows+Into+Light&family=Lobster')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
SANS = "font-family: 'Inter Tight', 'Helvetica Neue', Arial, sans-serif"
SERIF = "font-family: 'Source Serif 4', Georgia, serif"
HAND = "font-family: 'Shadows Into Light', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Cheese danish": ("Cheese Danish", "Puff pastry corners folded over a sweet, lemony filling, then iced.", ".40",
                    "Correll takes two, with coffee black."),
  "Transit office jam doughnuts": ("Jelly Doughnut", "Jam filled, rolled in sugar while still warm.", ".20",
                                   "A dozen for the Command Center floor."),
  "Transit authority rugelach": ("Rugelach", "Cream cheese dough, apricot jam, walnuts and cinnamon sugar.", "6 for .90",
                                 "Something sweet for later."),
  "Transit authority hero": ("Turkey & Swiss Hero", "Sliced breast, shredded iceberg, tomato and mayonnaise on a long roll, wrapped tight.", "1.23",
                             "Lt. Garber's usual. 1.23 even."),
  "Mr Green's honey lemon whisky toddy": ("Hot Toddy", "Whisky, honey, lemon and fresh ginger, topped with boiling water. Cinnamon stick.", "1.25",
                                          "Flu season special. Gesundheit!"),
}
ADD = {
  'coffee': ("Coffee", "Regular, light or black. Refills at the counter.", ".25"),
  'pastrami': ("Hot Pastrami on Rye", "Hand sliced and steamed, with brown mustard and a sour pickle.", "1.95"),
  'soup': ("Chicken Noodle Soup", "Simmered from a whole bird with carrot and celery. Saltines on the side.", ".55"),
  'grilled': ("Grilled Cheese", "American on white, buttered and griddled golden, with sliced tomato.", ".85"),
  'egg': ("Egg Cream", "Chocolate syrup, cold milk and a hard shot of seltzer.", ".35"),
  'malted': ("Chocolate Malted", "Vanilla ice cream, malt and fudge syrup, spun thick.", ".65"),
}


def item(n, d, p, note=None, top=22):
    nt = (f'<div style="{SERIF}; font-style: italic; font-size: 18px; line-height: 1.3; color: {ORANGE}; margin-top: 4px">{note}</div>'
          if note else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 14px">
        <div style="{SANS}; font-weight: 800; font-size: 27px; line-height: 1.08; letter-spacing: -0.01em">{n}</div>
        <div style="{SANS}; font-weight: 800; font-size: 27px; white-space: nowrap">{p}</div></div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.32; margin-top: 4px; color: #2b2722; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=22, note=False):
    n, d, p, nt = SPEC[k]
    return item(n, d, p, nt if note else None, top)


def A(k, top=22):
    return item(*ADD[k], top=top)


def bar(t, sub=None):
    s = f'<span style="{SANS}; font-weight: 600; font-size: 18px; letter-spacing: 0.12em; color: #f2b13a; margin-left: 14px; white-space: nowrap">{sub}</span>' if sub else ''
    return (f'<div style="display: inline-block; background: {INK}; color: {PAPER}; padding: 7px 26px 8px; border-radius: 30px; {SANS}; font-weight: 900; '
            f'font-size: 40px; line-height: 1; letter-spacing: 0.01em; text-transform: uppercase; white-space: nowrap">{t}{s}</div>')


def kicker(t, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {ORANGE}; {extra}">{t}</div>'


def face(inner):
    livery = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 14px; background: {ORANGE}"></div>'
              f'<div style="position: absolute; left: 0; top: 14px; width: {W}px; height: 7px; background: #f2b13a"></div>')
    fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
            'background: radial-gradient(ellipse 78% 72% at 50% 48%, rgba(240,244,236,0.10) 0%, rgba(240,244,236,0.12) 55%, rgba(120,140,120,0.26) 100%)"></div>')
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
             f'height: {H}px; pointer-events: none; display: block; opacity: 0.85">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{inner}{livery}{fade}{grain}</div>')


L, CW = 56, 704

front = face(f'''
<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Across from Transit Headquarters', 'white-space: nowrap; letter-spacing: 0.16em')}{kicker('6 A.M. to 9 P.M.', 'white-space: nowrap; letter-spacing: 0.16em; color: ' + MUTE)}</div>
  <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 2px">
    <div style="font-family: 'Lobster', cursive; font-size: 104px; line-height: 1.12; color: {ORANGE}; white-space: nowrap; transform: rotate(-3deg); transform-origin: 0 60%">Motorman</div>
    <div style="text-align: right; padding-top: 10px">
      <div style="{SANS}; font-weight: 900; font-size: 40px; line-height: 1; letter-spacing: 0.12em; text-transform: uppercase">Coffee Shop</div>
      <div style="{SANS}; font-weight: 600; font-size: 16px; letter-spacing: 0.06em; color: {MUTE}; margin-top: 8px">Over a million cups poured</div></div></div>
  <div style="height: 4px; background: {INK}; margin-top: 6px"></div>
  <div style="margin-top: 14px; border: 3px solid {ORANGE}; padding: 6px; background: #fbfcf8">
    <img src="assets/still-platform.jpg" alt="A Lexington Avenue local pulling into a station" style="display: block; width: {CW - 18}px; height: 330px"></div>
  <div style="{SANS}; font-weight: 600; font-size: 16px; letter-spacing: 0.04em; color: {MUTE}; margin-top: 7px">Downstairs, the Lexington local. Upstairs, the coffee is on.</div>
  <div style="margin-top: 16px">{bar('The Bakery Case', 'ALL DAY')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Cheese danish', 12)}{S('Transit authority rugelach', 16)}</div>
    <div>{S('Transit office jam doughnuts', 12)}
      <div style="margin-top: 18px; border: 2px dashed {ORANGE}; background: #f5f8f1; padding: 10px 14px 10px; transform: rotate(1.5deg)">
        <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Coupon', 'font-size: 15px')}<span style="{SANS}; font-weight: 700; font-size: 14px; color: {MUTE}">No. 123</span></div>
        <div style="{SANS}; font-weight: 900; font-size: 26px; line-height: 1.05; margin-top: 4px; text-transform: uppercase">One free coffee</div>
        <div style="{SERIF}; font-size: 16px; line-height: 1.3; margin-top: 4px">With any hero. Regular, light or black. Good thru Dec. 31, 1974.</div></div></div></div>
  <div style="display: flex; gap: 24px; margin-top: 18px; align-items: flex-end; border-top: 1px solid {INK}; padding-top: 12px">
    <div style="flex: 1">
      {kicker('A word from a regular', 'font-size: 15px')}
      <div style="{SERIF}; font-size: 19px; line-height: 1.32; margin-top: 4px">Best hero in the building, and it reaches the Command Center inside the hour. Tell them Garber sent you.</div></div>
    <div style="flex: none; width: 200px">
      <div style="{HAND}; font-size: 38px; line-height: 1; color: #24305e; transform: rotate(-4deg)">Z. Garber</div>
      <div style="{SANS}; font-weight: 600; font-size: 14px; color: {MUTE}; margin-top: 6px">Lieutenant, Transit Police</div></div></div>
</div>''')

back = face(f'''
<div style="position: absolute; left: {L}px; top: 54px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">
    {kicker('The Motorman Coffee Shop')}{kicker('Lunch from 11 A.M.', 'color: ' + MUTE)}</div>
  <div style="margin-top: 12px">{bar('The Lunch Counter')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Transit authority hero', 14)}{A('soup')}</div>
    <div>{A('pastrami', 14)}{A('grilled')}</div></div>
  <div style="height: 1px; background: {INK}; margin-top: 20px"></div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px; margin-top: 20px">
    <div>
      {bar('The Fountain')}
      {A('egg', 14)}{A('malted')}
      <div style="height: 1px; background: {INK}; margin-top: 20px"></div>
      <div style="margin-top: 20px">{bar('The Bar', 'AFTER 4 P.M.')}</div>
      {S('Mr Green\'s honey lemon whisky toddy', 14, note=True)}</div>
    <div style="position: relative">
      {kicker('We deliver, all floors')}
      <div style="margin-top: 10px; border: 3px solid {ORANGE}; padding: 4px; background: #f6f8f2"><img src="assets/still-board.jpg" alt="The Command Center board, 23rd and 28th Street" style="display: block; width: 318px; height: 140px"></div>
      <div style="{SERIF}; font-size: 18px; line-height: 1.32; margin-top: 8px">Call KLondike 5-0123. Command Center orders up inside the hour.</div>
      <img src="assets/guest-check.png" alt="A pencilled guest check for the Command Center lunch run, marked paid" style="position: absolute; left: 56px; top: 252px; width: 228px; height: 290px; display: block"></div></div>
</div>
<div style="position: absolute; left: {L}px; top: 978px; width: {CW}px; border-top: 1px solid {INK}; padding-top: 10px; display: flex; justify-content: space-between; {SANS}; font-weight: 600; font-size: 15px; color: {MUTE}">
  <span>Prices subject to change. Minimum at tables, lunch hours, .75</span><span>Form 123, 1974</span></div>''')

for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Motorman Coffee Shop</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "shift", "fn": "fmtShift", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Lobster", "Inter Tight", "Source Serif 4", "Shadows Into Light"],
           "phone": {"disp": "'Lobster',cursive", "title": "'Inter Tight',sans-serif", "name": "'Inter Tight',sans-serif",
                     "body": "'Source Serif 4',serif", "price": "'Inter Tight',sans-serif", "note": "'Source Serif 4',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"The Taking of Pelham One Two Three (1974)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'shift.labels.json'), 'w'), indent=1)
print('built')
