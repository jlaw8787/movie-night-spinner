import math, json, sys, os
D = os.path.dirname(os.path.abspath(__file__))
mode = sys.argv[1] if len(sys.argv) > 1 else 'local'   # local | dc
IMG = json.load(open(os.path.join(D, 'img_' + mode + '.json')))
CUE = "Serve dessert when Hammond eats melting ice cream in the dark visitor centre."
COND = "font-family: 'Barlow Condensed', sans-serif"
INK = '#141612'

STOPS = [
  ('#1d6f80', 'Hatchery', 'Grab and go', "Hammond's hatchery egg cookies", "Brown butter cookies, chocolate egg centres, cocoa speckles.", "He's been there for every birth."),
  ('#c4610e', 'Visitor Centre Kitchen', 'Quick service', "Clever girl claw crisps", "Smoked paprika tortilla claws, lime guacamole.", "Muldoon never saw the second one."),
  ('#c42a1c', 'Visitor Centre Dining Room', 'Table service', "Could vs should lamb rack", "Pink lamb, pea and mint puree, crisp baby potatoes.", "Malcolm's lunch, with a side of ethics."),
  ('#6b4f12', 'Visitor Centre Rotunda', 'Dessert bar', "Power's out melting sundae", "Vanilla bean scoops, hot fudge, crushed honeycomb. Served soft.", "Hammond and Ellie, ice cream in the dark."),
  ('#2f7a26', 'T. rex Paddock', 'Tour car drinks', "Ripple in the cup iced tea", "Black tea, honey, lime and mint in a tall clear glass.", "Watch the water. Then don't move."),
]

def pin(n, c, s, fs):
    return (f'<div style="flex: none; width: {s}px; height: {s}px; border-radius: 50%; background: {c}; border: 3px solid #ffffff; '
            f'box-sizing: border-box; box-shadow: 0 0 0 1px {INK}; color: #ffffff; {COND}; font-weight: 800; font-size: {fs}px; '
            f'line-height: {s-6}px; text-align: center">{n}</div>')

def dishes():
    out = []
    for i, (c, place, svc, name, desc, note) in enumerate(STOPS):
        out.append(f'''<article style="display: flex; gap: 12px; padding: 11px 0 0; border-top: {'0' if i == 0 else '1px solid #d6caa6'}">
        {pin(i+1, c, 34, 18)}
        <div style="flex: 1; min-width: 0">
          <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px">
            <span style="{COND}; font-weight: 700; font-size: 13px; letter-spacing: 0.08em; text-transform: uppercase; color: {c}">{place}</span>
            <span style="{COND}; font-weight: 700; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; color: #4a4e45; white-space: nowrap">{svc}</span>
          </div>
          <h3 style="margin: 2px 0 0; {COND}; font-weight: 800; font-size: 23px; line-height: 1.02; text-transform: uppercase; text-wrap: balance">{name}</h3>
          <p style="margin: 4px 0 0; font-size: 15px; line-height: 1.38; text-wrap: pretty">{desc}</p>
          <p style="margin: 3px 0 0; font-size: 14px; line-height: 1.3; font-style: italic; color: #4a4e45">{note}</p>
        </div></article>''')
    return '\n'.join(out)

# ---------- map (all plain positioned boxes so it prints and exports cleanly) ----------
def box(x, y, w, h, style):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; {style}"></div>'

def blob(x, y, w, h, c, r='50%'):
    return box(x, y, w, h, f'background: {c}; border-radius: {r}')

def seg(x1, y1, x2, y2, w, c, extra=''):
    L = math.hypot(x2 - x1, y2 - y1); a = math.degrees(math.atan2(y2 - y1, x2 - x1))
    return (f'<div style="position: absolute; left: {x1}px; top: {y1 - w/2}px; width: {L:.1f}px; height: {w}px; background: {c}; '
            f'border-radius: {w/2}px; transform: rotate({a:.2f}deg); transform-origin: 0 {w/2}px; {extra}"></div>')

def path(pts, w, c, edge=None):
    s = ''
    if edge:
        for (a, b) in zip(pts, pts[1:]): s += seg(*a, *b, w + 4, edge)
    for (a, b) in zip(pts, pts[1:]): s += seg(*a, *b, w, c)
    for p in pts[1:-1]: s += box(p[0] - w/2, p[1] - w/2, w, w, f'background: {c}; border-radius: 50%')
    return s

def fence(x, y, w, h, r=14):
    return box(x, y, w, h, f'border: 3px dashed #f4b41a; border-radius: {r}px; box-sizing: border-box; background: rgba(20,22,18,0.08)')

def mountain(x, y, w, h, c='#56604a', snow='#8a917c'):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 0; height: 0; border-left: {w/2}px solid transparent; '
            f'border-right: {w/2}px solid transparent; border-bottom: {h}px solid {c}"></div>'
            f'<div style="position: absolute; left: {x + w*0.32}px; top: {y}px; width: 0; height: 0; border-left: {w*0.18}px solid transparent; '
            f'border-right: {w*0.18}px solid transparent; border-bottom: {h*0.36}px solid {snow}"></div>')

def trees(cx, cy, n, spread, size, seed):
    import random; r = random.Random(seed); s = ''
    for _ in range(n):
        x = cx + r.uniform(-spread, spread); y = cy + r.uniform(-spread * 0.6, spread * 0.6); d = size * r.uniform(0.75, 1.2)
        s += box(x, y, d, d, f'background: {r.choice(["#3f6e2c", "#4a7a33", "#355f26"])}; border-radius: 50%; box-shadow: 0 2px 0 rgba(0,0,0,0.18)')
    return s

def label(x, y, text, kind='dark', size=13):
    bg, fg = {'dark': ('#141612', '#ffffff'), 'gold': ('#f4b41a', '#141612'), 'red': ('#c42a1c', '#ffffff'), 'paper': ('#f6f0de', '#141612')}[kind]
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; {COND}; font-weight: 700; font-size: {size}px; letter-spacing: 0.06em; '
            f'text-transform: uppercase; white-space: nowrap; background: {bg}; color: {fg}; padding: 2px 7px">{text}</div>')

def mpin(n, x, y):
    c = STOPS[n - 1][0]
    return (f'<div style="position: absolute; left: {x - 17}px; top: {y - 17}px">{pin(n, c, 34, 18)}</div>')

def build_map():
    s = ''
    # ocean texture: a few soft swell lines
    for i in range(9):
        s += box(-20, 30 + i * 66, 720, 2, 'background: rgba(255,255,255,0.10)')
    # island with beach rim
    s += box(36, 34, 590, 520, 'background: #e6d6a2; border-radius: 46% 54% 44% 56% / 40% 42% 58% 60%')
    s += box(46, 44, 570, 500, 'background: #7aa457; border-radius: 46% 54% 44% 56% / 40% 42% 58% 60%')
    # open plains
    s += blob(330, 250, 210, 150, '#93b86a')
    s += blob(150, 400, 190, 110, '#8db263')
    # mountains along the north
    for (x, y, w, h) in [(250, 70, 110, 74), (320, 58, 130, 92), (410, 78, 100, 66)]:
        s += mountain(x, y, w, h)
    # river from the mountains to the west coast
    s += path([(330, 150), (290, 210), (240, 250), (190, 330), (120, 400), (70, 470)], 12, '#4f9bb4', '#3a7f96')
    # jungle
    s += trees(140, 150, 16, 60, 26, 1) + trees(470, 430, 14, 60, 26, 2) + trees(520, 160, 10, 40, 24, 3) + trees(240, 470, 8, 40, 22, 4)
    # tour road
    road = [(118, 488), (210, 410), (300, 352), (360, 300), (420, 238), (470, 170)]
    s += path(road, 9, '#d9c58f', '#a8925a')
    s += path([(300, 352), (380, 410), (450, 470)], 9, '#d9c58f', '#a8925a')
    # paddocks
    s += fence(92, 96, 130, 92) + label(98, 70, 'Dilophosaurus')
    s += fence(80, 220, 110, 86) + label(86, 312, 'Raptor pen', 'red')
    s += fence(440, 112, 140, 112) + label(476, 86, 'T. rex')
    s += label(360, 266, 'Brachiosaurus', 'paper')
    s += fence(400, 440, 140, 80) + label(420, 524, 'Triceratops')
    s += label(176, 446, 'Gallimimus', 'paper', 12)
    # visitor centre
    s += box(268, 318, 70, 56, 'background: #f6f0de; border: 3px solid #141612; border-radius: 14px 14px 4px 4px; box-sizing: border-box')
    s += box(282, 304, 42, 18, 'background: #c42a1c; border: 3px solid #141612; border-radius: 10px 10px 0 0; box-sizing: border-box')
    s += label(196, 380, 'Visitor Centre', 'gold', 14)
    # helipad and east dock
    s += box(560, 300, 38, 38, 'background: #f6f0de; border: 3px solid #141612; border-radius: 50%; box-sizing: border-box')
    s += f'<div style="position: absolute; left: 560px; top: 300px; width: 38px; line-height: 32px; text-align: center; {COND}; font-weight: 800; font-size: 18px">H</div>'
    s += label(548, 342, 'Helipad', 'dark', 12)
    s += box(598, 420, 40, 10, 'background: #8a6a3a; border: 2px solid #141612')
    s += label(570, 438, 'East dock', 'dark', 12)
    # dining pins
    for n, (x, y) in enumerate([(150, 470), (250, 300), (312, 346), (378, 420), (492, 196)], 1):
        s += mpin(n, x, y)
    # compass
    s += box(588, 38, 46, 46, 'background: #f6f0de; border: 3px solid #141612; border-radius: 50%; box-sizing: border-box')
    s += f'<div style="position: absolute; left: 588px; top: 41px; width: 46px; text-align: center; {COND}; font-weight: 800; font-size: 20px; line-height: 38px">N</div>'
    return s

def page(body, title, fonts=True):
    link = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800'
            '&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=Caveat:wght@700&display=swap">')
    return body, link

out = {}
for name in ('outside', 'inside'):
    b = open(os.path.join(D, name + '.body.html')).read()
    b = (b.replace('{{IMG_EGGS}}', IMG['eggs']).replace('{{IMG_GATE}}', IMG['gate']).replace('{{IMG_LOGO}}', IMG['logo'])
          .replace('{{CUE}}', CUE).replace('{{DISHES}}', dishes()).replace('{{MAP}}', build_map()))
    out[name] = b
link = ('<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800'
        '&family=Barlow:ital,wght@0,400;0,500;0,600;1,400&family=Caveat:wght@700&display=swap">')
if mode == 'local':
    for name, b in out.items():
        open(os.path.join(D, name + '.html'), 'w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8">{link}<style>body{{margin:0}}</style></head><body>{b}</body></html>')
else:
    titles = {'outside': 'Jurassic Park dining guide, outside', 'inside': 'Jurassic Park dining guide, inside'}
    for name, b in out.items():
        dc = f'''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{titles[name]}</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
{link}
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
'''
        open(os.path.join(D, 'board_' + name + '.dc.html'), 'w').write(dc)
print('built', mode)
