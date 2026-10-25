import json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
mode = sys.argv[1] if len(sys.argv) > 1 else 'local'   # local | dc
SPELL = os.environ.get('SPELL', 'us')                    # us: in-world American park | au: Australian
IMG = json.load(open(os.path.join(D, 'img_' + mode + '.json')))
INK, RED, GOLD, GREEN = '#16170f', '#b5241a', '#f2b21b', '#133a2a'
FONT_LINK_WEB = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400'
             '&family=Caveat:wght@700&family=Homemade+Apple&display=swap">')
FONT_LINK = '<link rel="stylesheet" href="fonts/fonts.css">' if mode == 'local' else FONT_LINK_WEB
CENTER = 'Visitor Center' if SPELL == 'us' else 'Visitor Centre'
FAV = 'favorite' if SPELL == 'us' else 'favourite'
CTR = 'center' if SPELL == 'us' else 'centre'

# outlet number, outlet, where and when, dishes: (name, description, note, price)
OUTLETS = [
  (1, f'{CENTER} Restaurant', 'Table service. Lunch 11:30 AM to 2:00 PM.', [
     ('Chilled shrimp cocktail', 'House cocktail sauce, lemon wedge.', None, '8.50'),
     ('Rosemary rack of lamb', 'Minted pea puree, roast baby potatoes.', None, '19.93'),
     ('Grilled mahi-mahi', 'Coconut rice, pineapple salsa.', None, '16.50'),
     ('Casado plate', 'Vegetarian. Rice, beans, plantain, fried egg, slaw.', None, '11.00'),
     ('Junior explorer plate', 'Chicken tenders, corn, fruit cup.', None, '5.95'),
     ("The Founder’s sundae", 'Vanilla bean, hot fudge, honeycomb candy.', None, '4.95'),
     ('Fresh-squeezed lemonade', 'Cane sugar, lemon peel, over ice.', None, '1.95'),
     ('Hot Tarrazú coffee', 'Bottomless, by the pot.', None, '1.25')]),
  (2, 'Gift Shop Counter', 'Grab and go, beside the main hall.', [
     ('Dino egg cookies (2)', 'Brown butter, chocolate egg centers.', None, '3.50'),
     ('Raptor claw chips', 'Claw-cut tortilla chips, lime guacamole.', None, '4.75')]),
  (3, 'Tour Departure Kiosk', 'Cold drinks to take on your tour car.', [
     ('Tour car iced tea', 'Black tea, honey, fresh mint.', None, '1.75'),
     ('Iced Costa Rican coffee', 'Brewed strong, poured over ice.', None, '2.50')]),
]
INFO = [
  ('Tour cars', 'Electric cars guided along the tour road, with touch-screen narration. Please stay seated with hands inside.'),
  ('Electric fences', '10,000 volts. Please do not touch or lean on the fences.'),
  ('Night-vision goggles', 'Every tour car carries a pair for low light.'),
]

def pin(n, s, fs):
    return (f'<div style="flex: none; width: {s}px; height: {s}px; border-radius: 50%; background: {RED}; border: 3px solid #ffffff; box-sizing: border-box; '
            f'box-shadow: 0 0 0 1px {INK}, 0 2px 4px rgba(0,0,0,0.3); color: #ffffff; font-family: \'Libre Franklin\', sans-serif; font-weight: 900; '
            f'font-size: {fs}px; line-height: {s-6}px; text-align: center">{n}</div>')

def outlets():
    out = []
    for n, name, when, items in OUTLETS:
        rows = ''
        for (dn, desc, note, price) in items:
            nt = f'<p style="margin: 2px 0 0; font-size: 13px; line-height: 1.3; text-wrap: pretty; font-style: italic; color: #4b4e42">{note}</p>' if note else ''
            rows += f'''<div style="margin-top: 5px">
            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">
              <h3 style="margin: 0; font-weight: 800; font-size: 17px; line-height: 1.02">{dn}</h3>
              <span style="font-weight: 800; font-size: 16px; white-space: nowrap">${price}</span></div>
            <p style="margin: 0; font-size: 13px; line-height: 1.25; text-wrap: pretty">{desc}</p>
            {nt}</div>'''
        out.append(f'''<div style="{'' if n == 1 else 'margin-top: 12px'}">
          <div style="display: flex; gap: 10px; align-items: center; border-bottom: 1px solid #16170f; padding-bottom: 6px">
            {pin(n, 30, 15)}
            <div><div style="font-weight: 900; font-size: 15px; letter-spacing: 0.04em; text-transform: uppercase">{name}</div>
            <div style="font-size: 12.5px; color: #4b4e42">{when}</div></div></div>
          {rows}</div>''')
    return '\n'.join(out)

def info():
    return '\n'.join(f'''<div style="{'' if t == INFO[0][0] else 'border-top: 1px solid #3c5a4a; padding-top: 12px'}">
        <div style="font-weight: 800; font-size: 15px; letter-spacing: 0.06em; text-transform: uppercase; color: #f2b21b">{t}</div>
        <div style="font-size: 14px; line-height: 1.45; color: #e3e9df; margin-top: 3px; text-wrap: pretty">{d}</div></div>''' for t, d in INFO)

def tag(x, y, text, kind='dark', size=11.5):
    bg, fg = {'dark': ('rgba(22,23,15,0.88)', '#ffffff'), 'gold': (GOLD, INK), 'paper': ('#f3ecd8', INK)}[kind]
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; font-weight: 800; font-size: {size}px; letter-spacing: 0.07em; '
            f'text-transform: uppercase; white-space: nowrap; background: {bg}; color: {fg}; padding: 2px 6px">{text}</div>')

def map_labels():
    s = ''
    s += tag(124, 122, 'Tyrannosaurus rex') + tag(94, 246, 'Raptor pen') + tag(378, 144, 'Dilophosaurus')
    s += tag(206, 202, 'Brachiosaurus', 'paper', 11) + tag(202, 476, 'Triceratops') + tag(212, 515, 'Gallimimus', 'paper', 11)
    s += tag(158, 338, CENTER, 'gold', 13) + tag(458, 280, 'Helipad') + tag(482, 410, 'East dock') + tag(364, 384, 'Main gate') + tag(468, 236, 'Falls')
    for n, (x, y) in enumerate([(288, 282), (244, 296), (312, 330)], 1):
        s += f'<div style="position: absolute; left: {x - 14}px; top: {y - 14}px">{pin(n, 28, 14)}</div>'
    # compass rose with needle
    s += ('<div style="position: absolute; left: 596px; top: 12px; width: 52px; height: 52px; border-radius: 50%; background: #f3ecd8; border: 3px solid #16170f; box-sizing: border-box"></div>'
          '<div style="position: absolute; left: 616px; top: 20px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 18px solid #b5241a"></div>'
          '<div style="position: absolute; left: 616px; top: 38px; width: 0; height: 0; border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 18px solid #16170f"></div>'
          '<div style="position: absolute; left: 610px; top: 64px; width: 24px; text-align: center; font-weight: 900; font-size: 13px; color: #ffffff; background: rgba(22,23,15,0.88)">N</div>')
    return s

def livery(w):
    return (f'<div style="position: absolute; left: 0; top: 0; width: {w}px; height: 12px; background: {GOLD}"></div>'
            f'<div style="position: absolute; left: 0; top: 12px; width: {w}px; height: 6px; background: {RED}"></div>')

out = {}
for name in ('outside', 'inside'):
    b = open(os.path.join(D, name + '.body.html')).read()
    b = (b.replace('{{IMG_BRACHIO}}', IMG['brachio']).replace('{{IMG_GATE}}', IMG['gate']).replace('{{IMG_LOGO}}', IMG['logo']).replace('{{IMG_MAP}}', IMG['map'])
          .replace('{{OUTLETS}}', outlets()).replace('{{INFO}}', info()).replace('{{MAP_LABELS}}', map_labels())
          .replace('{{CENTER_L}}', CENTER).replace('{{CENTER}}', CENTER))
    i = b.rindex('</div>')
    fade = ('<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 1123px; height: 794px; pointer-events: none; '
            'background: radial-gradient(ellipse 75% 70% at 50% 48%, rgba(246,238,218,0.12) 0%, rgba(246,238,218,0.16) 55%, rgba(205,178,124,0.26) 100%)"></div>')
    grain = f'<img src="{IMG["grain"]}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 1123px; height: 794px; pointer-events: none; display: block">'
    weather = f'<img src="{IMG["weather_" + name]}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 1123px; height: 794px; pointer-events: none; display: block">'
    out[name] = b[:i] + livery(1123) + fade + grain + weather + b[i:]
if mode == 'local':
    for name, b in out.items():
        open(os.path.join(D, name + '.html'), 'w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8">{FONT_LINK}<style>body{{margin:0}}</style></head><body>{b}</body></html>')
else:
    titles = {'outside': 'Jurassic Park dining guide, outside', 'inside': 'Jurassic Park dining guide, inside'}
    for name, b in out.items():
        open(os.path.join(D, 'board_' + name + '.dc.html'), 'w').write(f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{titles[name]}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{FONT_LINK}
<style>
body{{margin:0}}
a{{color:#666}}a:hover{{color:#333}}
</style>
</helmet>
{b}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{{"$preview":{{"width":1123,"height":794}}}}'>
class Component extends DCLogic {{
renderVals() {{
return {{}};
}}
}}
</script>
</body>
</html>
''')
print('built', mode, SPELL)
