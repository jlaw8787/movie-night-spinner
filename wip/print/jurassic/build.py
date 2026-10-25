import json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
mode = sys.argv[1] if len(sys.argv) > 1 else 'local'   # local | dc
SPELL = os.environ.get('SPELL', 'us')                    # us: in-world American park | au: Australian
IMG = json.load(open(os.path.join(D, 'img_' + mode + '.json')))
INK, RED, GOLD, GREEN = '#16170f', '#b5241a', '#f2b21b', '#133a2a'
FONT_LINK = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:ital,wght@0,400;0,500;0,600;0,700;0,800;0,900;1,400'
             '&family=Caveat:wght@700&display=swap">')
CENTER = 'Visitor Center' if SPELL == 'us' else 'Visitor Centre'
FAV = 'favorite' if SPELL == 'us' else 'favourite'
CTR = 'center' if SPELL == 'us' else 'centre'

# outlet number, outlet, where and when, dishes: (name, description, note, price)
OUTLETS = [
  (1, f'{CENTER} Restaurant', 'Table service. Lunch 11:30 AM to 2:00 PM.', [
     ('Chilled shrimp cocktail', 'Lime, avocado and chili, served on crushed ice.', None, '8.50'),
     ('Coffee-rubbed rack of lamb', 'Coffee and chili rub, chimichurri, crisp potatoes.', None, '19.93'),
     ('Grilled mahi-mahi', 'Black beans, sweet plantain and lime butter.', None, '16.50'),
     ('Gallo pinto bowl', 'Rice, black beans, avocado and a fried egg.', None, '11.00'),
     ("The Founder's sundae", 'Vanilla bean, hot fudge, crushed honeycomb.', f"Mr. Hammond's {FAV}.", '6.50'),
     ('Junior explorer plate', 'Chicken tenders, corn and a fruit cup.', None, '5.95')]),
  (2, 'Gift Shop Counter', 'Grab and go, beside the main hall.', [
     ('Dino egg cookies', f'Brown butter with a soft dark chocolate {CTR}.', 'Speckled like the real thing in our hatchery.', '3.50'),
     ('Raptor claw crisps', 'Smoked paprika tortilla claws with guacamole.', None, '4.75')]),
  (3, 'Tour Departure Kiosk', 'Handed to you as you board.', [
     ('Tour car iced tea', 'Black tea shaken with honey, lime and mint.', None, '2.50'),
     ('Costa Rican coffee', 'Brewed from mainland beans, hot or iced.', None, '1.75')]),
]
INFO = [
  ('A', GOLD, INK, 'Tour cars', 'Electric and guided along the tour road, with interactive CD-ROM narration. Stay seated, hands inside.'),
  ('B', GOLD, INK, 'Electric fences', '10,000 volts. Please do not touch or lean on any fence.'),
  ('C', GOLD, INK, 'Night-vision goggles', 'Every tour car carries a pair for viewing after dark.'),
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
            nt = f'<p style="margin: 2px 0 0; font-size: 13px; line-height: 1.3; font-style: italic; color: #4b4e42">{note}</p>' if note else ''
            rows += f'''<div style="margin-top: 6px">
            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">
              <h3 style="margin: 0; font-weight: 800; font-size: 17px; line-height: 1.15">{dn}</h3>
              <span style="font-weight: 800; font-size: 16px; white-space: nowrap">${price}</span></div>
            <p style="margin: 1px 0 0; font-size: 13px; line-height: 1.32; text-wrap: pretty">{desc}</p>
            {nt}</div>'''
        out.append(f'''<div>
          <div style="display: flex; gap: 10px; align-items: center; border-bottom: 1px solid #16170f; padding-bottom: 6px">
            {pin(n, 30, 15)}
            <div><div style="font-weight: 900; font-size: 15px; letter-spacing: 0.04em; text-transform: uppercase">{name}</div>
            <div style="font-size: 12.5px; color: #4b4e42">{when}</div></div></div>
          {rows}</div>''')
    return '\n'.join(out)

def info():
    return '\n'.join(f'''<div style="display: flex; gap: 14px; align-items: flex-start">
        <div style="flex: none; width: 38px; height: 38px; border-radius: 50%; background: {bg}; color: {fg}; font-weight: 900; font-size: 17px; line-height: 38px; text-align: center">{k}</div>
        <div><div style="font-weight: 800; font-size: 16px; letter-spacing: 0.04em; text-transform: uppercase">{t}</div>
        <div style="font-size: 14px; line-height: 1.45; color: #d6dfd2; margin-top: 2px">{d}</div></div></div>''' for k, bg, fg, t, d in INFO)

def tag(x, y, text, kind='dark', size=11.5):
    bg, fg = {'dark': ('rgba(22,23,15,0.88)', '#ffffff'), 'gold': (GOLD, INK), 'paper': ('#f3ecd8', INK)}[kind]
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; font-weight: 800; font-size: {size}px; letter-spacing: 0.07em; '
            f'text-transform: uppercase; white-space: nowrap; background: {bg}; color: {fg}; padding: 2px 6px">{text}</div>')

def map_labels():
    s = ''
    s += tag(122, 64, 'Dilophosaurus') + tag(66, 194, 'Velociraptor pen') + tag(446, 112, 'Tyrannosaurus rex')
    s += tag(400, 320, 'Brachiosaurus', 'paper') + tag(422, 502, 'Triceratops') + tag(150, 444, 'Gallimimus', 'paper')
    s += tag(122, 380, CENTER, 'gold', 13) + tag(548, 340, 'Helipad') + tag(556, 452, 'East dock') + tag(488, 382, 'Main gate') + tag(590, 268, 'Falls', 'paper')
    for n, (x, y) in enumerate([(240, 318), (206, 326), (282, 400)], 1):
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
    grain = f'<img src="{IMG["grain"]}" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 1123px; height: 794px; pointer-events: none; display: block">'
    out[name] = b[:i] + livery(1123) + grain + b[i:]
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
