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
  (1, f'{CENTER} Restaurant', 'Table service. Lunch before your tour.', [
     ('Rack of lamb', 'Herb-crusted, medium rare, minted pea puree, crisp potatoes.', None, '19.93'),
     ("The Founder's sundae", 'Vanilla bean ice cream, hot fudge and crushed honeycomb.', f"Mr. Hammond's {FAV}.", '6.50')]),
  (2, 'Gift Shop Counter', 'Grab and go, beside the main hall.', [
     ('Dino egg cookies', f'Brown butter, soft dark chocolate {CTR}, speckled shell.', 'Baked in the shape of our newest arrivals.', '3.50'),
     ('Raptor claw crisps', 'Smoked paprika tortilla claws, guacamole, fresh lime.', 'Our raptors are fed by crane. You are not.', '4.75'),
     ('Island fruit cup', 'Pineapple, papaya and mango, lime and chili salt.', None, '3.25')]),
  (3, 'Tour Car Garage', 'Loaded into your tour car before departure.', [
     ('Tour car iced tea', 'Black tea shaken with honey, lime and mint.', None, '2.50'),
     ('Costa Rican coffee', 'Fresh brewed from the mainland, hot or iced.', None, '1.75')]),
]
INFO = [
  ('A', GOLD, INK, 'Tour cars', 'Electric and guided along the tour road, with interactive CD-ROM narration. Stay seated, hands inside.'),
  ('B', RED, '#ffffff', 'Electric fences', '10,000 volts. Please do not touch or lean on any fence.'),
  ('C', '#f3ecd8', GREEN, 'Night-vision goggles', 'Every tour car carries a pair for viewing after dark.'),
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
            rows += f'''<div style="margin-top: 7px">
            <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">
              <h3 style="margin: 0; font-weight: 800; font-size: 17.5px; line-height: 1.15">{dn}</h3>
              <span style="font-weight: 800; font-size: 16px; white-space: nowrap">${price}</span></div>
            <p style="margin: 2px 0 0; font-size: 13.5px; line-height: 1.38; text-wrap: pretty">{desc}</p>
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
    s += tag(122, 104, 'Dilophosaurus') + tag(100, 228, 'Velociraptor pen') + tag(446, 150, 'Tyrannosaurus rex')
    s += tag(400, 320, 'Brachiosaurus', 'paper') + tag(422, 454, 'Triceratops') + tag(150, 444, 'Gallimimus', 'paper')
    s += tag(122, 380, CENTER, 'gold', 13) + tag(236, 412, 'Garage', 'dark') + tag(330, 400, 'Maintenance shed')
    s += tag(552, 322, 'Helipad') + tag(556, 450, 'East dock') + tag(488, 380, 'Main gate') + tag(540, 262, 'Falls', 'paper')
    for n, (x, y) in enumerate([(240, 318), (206, 326), (308, 392)], 1):
        s += f'<div style="position: absolute; left: {x - 14}px; top: {y - 14}px">{pin(n, 28, 14)}</div>'
    s += ('<div style="position: absolute; left: 602px; top: 14px; width: 44px; height: 44px; border-radius: 50%; background: #f3ecd8; border: 3px solid #16170f; '
          'box-sizing: border-box; text-align: center; font-weight: 900; font-size: 18px; line-height: 38px">N</div>')
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
    out[name] = b[:i] + livery(1123) + b[i:]
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
