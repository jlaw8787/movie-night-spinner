"""Builds the Lume di Luna dinner card (Moonstruck, 1987): front.html and back.html at trim size,
plus the bleed bodies pdfs.py uses. US Letter portrait, 8.5 x 11 in, printed both sides, no fold."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))
B = 11.34                      # 3mm bleed in CSS px
NAVY, RED, INK, SOFT, PAPER = '#1c2642', '#8e2a28', '#2b2622', '#4a4339', '#f4ecd9'
IMG = {'art': 'assets/moon-bridge.jpg', 'mark': 'assets/moon-mark.png'}

# (section, [(name, description, price)])
FRONT_LEFT = [
  ('Antipasti', [
    ('Rosemary focaccia', 'Baked this afternoon in Brooklyn, dimpled with olive oil and flaky salt, served warm.', '2.75'),
    ('Fried calamari', 'Tender rings and tentacles in a light, crisp coating, marinara and lemon on the side.', '6.50'),
    ('Escarole and beans', 'Cannellini in a light broth with garlic, a thread of olive oil, grated pecorino.', '4.25')]),
  ('Pasta', [
    ('Linguine with clams', 'Littlenecks opened in garlic, olive oil and white wine, chopped parsley.', '10.95'),
    ('Penne alla vodka', 'Tomato, heavy cream, sweet onion, Parmigiano.', '9.50')]),
]
FRONT_RIGHT = [
  ('Secondi', [
    ('Chicken scaloppine piccata', 'Breast pounded thin and sautéed, lemon, white wine, capers and butter, chopped parsley.', '12.75'),
    ('Sirloin steak', 'Sixteen ounces, charred in a hot iron pan, sea salt and cracked pepper. Served with the big knife.', '17.50')]),
  ('Contorni', [
    ('Broccoli rabe', 'Sautéed with garlic, finished with lemon.', '3.75'),
    ('Roast potatoes', 'Crisp in the pan with onion and oregano.', '3.25')]),
]
NOTE_FRONT_RIGHT = 'Secondi come with a green salad.'
BACK_LEFT = [
  ('Dolci', [
    ('Cannoli (2)', 'Fresh ricotta and orange zest in chocolate-dipped shells, filled to order.', '3.50'),
    ('Tiramisù', 'Espresso-soaked ladyfingers, mascarpone, cocoa.', '4.25'),
    ('Spumoni', 'Pistachio, cherry and chocolate, in layers.', '2.75')]),
  ('Caffè', [
    ('Espresso', 'Pulled short and strong. Snap out of it.', '1.25'),
    ('Cappuccino', 'Steamed milk, a dusting of cinnamon.', '2.00'),
    ('Sambuca', 'With three coffee beans, for luck.', '3.75')]),
]
BACK_RIGHT = [
  ('Dal bar', [
    ('Amaretto sour', 'Lemon and egg white shaken frothy, over ice with a cherry.', '4.00'),
    ('House wine', 'Red or white, by the glass or the carafe.', '3.00 / 10.00'),
    ('Chianti Classico', 'Tuscany. By the bottle.', '15.00'),
    ('Barolo', 'Piedmont. By the bottle, for a big night.', '28.00'),
    ('Asti Spumante', 'Sweet and sparkling. Alla famiglia.', '16.00')]),
]
NOTE_BACK_RIGHT = 'Full moon tonight? Your second sour is on us.'
LATE = [
  ('Eggs in the hole', 'Thick white toast fried in butter, a ring of sweet red pepper, the yolk left soft.', '4.50'),
  ('Spaghetti aglio e olio', 'Parsley and hot pepper flakes, the way the kitchen eats after service.', '6.50'),
]

def item(name, desc, price, first=False, dark=False, gap=13):
    nc, dc, pc = (PAPER, '#e6dcc4', PAPER) if dark else (NAVY, INK, NAVY)
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <h3 style="margin: 0; font-weight: 600; font-size: 22px; line-height: 1.12; color: {nc}">{name}</h3>
        <span style="font-weight: 600; font-size: 19px; white-space: nowrap; color: {pc}">{price}</span></div>
      <p style="margin: 2px 0 0; font-size: 16px; line-height: 1.32; color: {dc}; text-wrap: pretty">{desc}</p></div>'''

def head(t, first, gap=26):
    return f'''<div style="display: flex; align-items: center; gap: 12px; margin: {0 if first else gap}px 0 10px">
      <span style="font-weight: 600; font-size: 16px; letter-spacing: 0.3em; color: {RED}">{t.upper()}</span>
      <span style="flex: 1; height: 1px; background: {RED}"></span></div>'''

def column(groups, note=None, ig=13, hg=26):
    s = ''
    for gi, (t, items) in enumerate(groups):
        s += head(t, gi == 0, hg) + ''.join(item(*it, first=(i == 0), gap=ig) for i, it in enumerate(items))
    if note:
        s += f'<p style="margin: 16px 0 0; font-style: italic; font-size: 16px; line-height: 1.32; color: {RED}">{note}</p>'
    return s

LATE_TOP, FOOT_TOP = 724, 922
DIV_H = 470
late = ''.join(f'<div style="flex: 1">{item(*it, first=True, dark=True)}</div>' for it in LATE)

FACES = {}
for name in ('front', 'back'):
    b = open(os.path.join(D, name + '.body.html')).read()
    b = (b.replace('{{IMG_ART}}', IMG['art']).replace('{{IMG_MARK}}', IMG['mark'])
          .replace('{{FRONT_LEFT}}', column(FRONT_LEFT)).replace('{{FRONT_RIGHT}}', column(FRONT_RIGHT, NOTE_FRONT_RIGHT))
          .replace('{{BACK_LEFT}}', column(BACK_LEFT, None, 19, 36)).replace('{{BACK_RIGHT}}', column(BACK_RIGHT, NOTE_BACK_RIGHT, 19, 36))
          .replace('{{LATE}}', late).replace('{{LATE_TOP}}', str(LATE_TOP)).replace('{{FOOT_TOP}}', str(FOOT_TOP)).replace('{{DIV_H}}', str(DIV_H)))
    FACES[name] = b

FONT = '<link rel="stylesheet" href="fonts/fonts.css">'
def wear(name, x, y):
    return (f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: {x}px; top: {y}px; '
            f'width: {816 + 2 * B}px; height: {1056 + 2 * B}px; pointer-events: none; display: block">')

def trim_body(name):
    return (f'<div style="position: relative; width: 816px; height: 1056px; overflow: hidden; background: {PAPER}">'
            f'{FACES[name]}{wear(name, -B, -B)}</div>')

def bleed_body(name):
    W, H = 816 + 2 * B, 1056 + 2 * B
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">'
            f'<div style="position: absolute; left: {B}px; top: {B}px; width: 816px; height: 1056px">{FACES[name]}</div>'
            f'{wear(name, 0, 0)}</div>')

for name in FACES:
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Lume di Luna, {name}</title>{FONT}'
        f'<style>body{{margin:0}}</style></head><body>{trim_body(name)}</body></html>')
    open(os.path.join(D, name + '.bleed.html'), 'w').write(bleed_body(name))
print('built')
