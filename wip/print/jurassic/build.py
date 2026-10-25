import json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
mode = sys.argv[1] if len(sys.argv) > 1 else 'local'   # local | dc
IMG = json.load(open(os.path.join(D, 'img_' + mode + '.json')))
INK, RED, GOLD, GREEN = '#15170f', '#b8261a', '#f2b21b', '#123628'
FONT_LINK = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,400..900;1,62..125,400..900'
             '&family=Caveat:wght@700&display=swap">')

# place, service, name, description, note, price, pin colour
STOPS = [
  ('Hatchery', 'Grab and go', 'Hatchery egg cookies', 'Brown butter cookies, chocolate egg centres, cocoa speckles.', 'Baked in the shape of our newest arrivals.', '3.50', '#1d6f80'),
  ('Kitchen', 'Quick service', 'Raptor claw crisps', 'Smoked paprika tortilla claws, lime guacamole to dip.', 'Our raptors are fed by crane. You are not.', '4.75', '#c4610e'),
  ('Dining Room', 'Table service', 'Herb-crusted lamb rack', 'Pink lamb, pea and mint puree, crisp baby potatoes.', 'Served on return from the tour.', '19.93', RED),
  ('Rotunda', 'Dessert bar', 'Spared no expense sundae', 'Vanilla bean scoops, hot fudge, crushed honeycomb.', "Mr. Hammond's own favourite.", '6.50', '#6b4f12'),
  ('Tour Road', 'Tour car drinks', 'Tour car iced tea', 'Black tea, honey, lime and mint in a tall clear cup.', 'Sized for the cup holder in every tour car.', '2.50', '#2f7a26'),
]
INFO = [
  ('A', GOLD, INK, 'Tour cars', 'Fully electric and guided along the tour road. No driver needed.'),
  ('B', RED, '#ffffff', 'Electric fences', '10,000 volts. Please do not touch or lean on any fence.'),
  ('C', '#f4eedb', GREEN, 'Tour car safety', 'Stay seated with hands inside. Objects in mirror are closer than they appear.'),
]

def pin(n, c, s, fs):
    return (f'<div style="flex: none; width: {s}px; height: {s}px; border-radius: 50%; background: {c}; border: 3px solid #ffffff; box-sizing: border-box; '
            f'box-shadow: 0 0 0 1px {INK}, 0 2px 4px rgba(0,0,0,0.3); color: #ffffff; font-family: \'Archivo\', sans-serif; font-weight: 900; font-stretch: 75%; '
            f'font-size: {fs}px; line-height: {s-6}px; text-align: center">{n}</div>')

def dishes():
    out = []
    for i, (place, svc, name, desc, note, price, c) in enumerate(STOPS):
        out.append(f'''<article style="display: flex; gap: 12px; padding-top: 9px; border-top: {'0' if i == 0 else '1px solid #d4c79f'}">
        {pin(i+1, c, 34, 18)}
        <div style="flex: 1; min-width: 0">
          <div style="display: flex; justify-content: space-between; gap: 8px; font-weight: 700; font-stretch: 75%; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase">
            <span style="color: {c}">{place}</span><span style="color: #4b4f43; white-space: nowrap">{svc}</span></div>
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px; margin-top: 2px">
            <h3 style="margin: 0; font-weight: 900; font-stretch: 66%; font-size: 23px; line-height: 1; text-transform: uppercase">{name}</h3>
            <span style="font-weight: 800; font-stretch: 75%; font-size: 19px; white-space: nowrap">${price}</span></div>
          <p style="margin: 4px 0 0; font-size: 14px; line-height: 1.36; text-wrap: pretty">{desc}</p>
          <p style="margin: 2px 0 0; font-size: 13px; line-height: 1.3; font-style: italic; color: #4b4f43">{note}</p>
        </div></article>''')
    return '\n'.join(out)

def info():
    return '\n'.join(f'''<div style="display: flex; gap: 14px; align-items: flex-start">
        <div style="flex: none; width: 40px; height: 40px; border-radius: 50%; background: {bg}; color: {fg}; font-weight: 900; font-stretch: 75%; font-size: 20px; line-height: 40px; text-align: center">{k}</div>
        <div><div style="font-weight: 800; font-stretch: 75%; font-size: 19px; letter-spacing: 0.04em; text-transform: uppercase">{t}</div>
        <div style="font-size: 14.5px; line-height: 1.45; color: #d6dfd2; margin-top: 1px">{d}</div></div></div>''' for k, bg, fg, t, d in INFO)

def tag(x, y, text, kind='dark', size=12.5):
    bg, fg = {'dark': ('rgba(21,23,15,0.9)', '#ffffff'), 'gold': (GOLD, INK), 'red': (RED, '#ffffff'), 'paper': ('#f4eedb', INK)}[kind]
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; font-weight: 800; font-stretch: 75%; font-size: {size}px; letter-spacing: 0.07em; '
            f'text-transform: uppercase; white-space: nowrap; background: {bg}; color: {fg}; padding: 2px 7px">{text}</div>')

def map_labels():
    s = ''
    s += tag(112, 72, 'Dilophosaurus') + tag(92, 306, 'Velociraptor pen', 'red') + tag(448, 146, 'Tyrannosaurus rex') + tag(392, 250, 'Brachiosaurus', 'paper')
    s += tag(418, 500, 'Triceratops') + tag(196, 428, 'Gallimimus', 'paper') + tag(228, 368, 'Visitor Centre', 'gold', 14)
    s += tag(112, 486, 'Hatchery') + tag(334, 404, 'Maintenance shed', 'dark', 11.5) + tag(548, 320, 'Helipad', 'dark', 11.5)
    s += tag(562, 450, 'East dock', 'dark', 11.5) + tag(500, 382, 'Main gate', 'dark', 11.5) + tag(574, 258, 'Falls', 'paper', 11.5)
    for n, (x, y) in enumerate([(150, 448), (266, 324), (300, 318), (334, 322), (444, 212)], 1):
        s += f'<div style="position: absolute; left: {x - 15}px; top: {y - 15}px">{pin(n, STOPS[n-1][6], 30, 16)}</div>'
    s += ('<div style="position: absolute; left: 600px; top: 14px; width: 46px; height: 46px; border-radius: 50%; background: #f4eedb; border: 3px solid #15170f; '
          'box-sizing: border-box; text-align: center; font-weight: 900; font-stretch: 75%; font-size: 20px; line-height: 40px">N</div>')
    return s

def livery(w):
    return (f'<div style="position: absolute; left: 0; top: 0; width: {w}px; height: 12px; background: {GOLD}"></div>'
            f'<div style="position: absolute; left: 0; top: 12px; width: {w}px; height: 6px; background: {RED}"></div>')

out = {}
for name in ('outside', 'inside'):
    b = open(os.path.join(D, name + '.body.html')).read()
    for k in ('LIVERY_FLAP', 'LIVERY_BACK', 'LIVERY_COVER', 'LIVERY_MENU', 'LIVERY_MAP'):
        b = b.replace('{{' + k + '}}', '')
    b = (b.replace('{{IMG_EGGS}}', IMG['eggs']).replace('{{IMG_GATE}}', IMG['gate']).replace('{{IMG_LOGO}}', IMG['logo']).replace('{{IMG_MAP}}', IMG['map'])
          .replace('{{DISHES}}', dishes()).replace('{{INFO}}', info()).replace('{{MAP_LABELS}}', map_labels()))
    i = b.rindex('</div>')
    b = b[:i] + livery(1123) + b[i:]
    out[name] = b
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
print('built', mode)
