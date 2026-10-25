import json, os
D = os.path.dirname(os.path.abspath(__file__))
IMG = {'paper': 'assets/paper.png', 'wear': 'assets/wear.png', 'tack': 'assets/tack.png', 'photo': 'assets/photo.jpg'}
FONT_LINK = '<link rel="stylesheet" href="fonts/fonts.css">'

# name, description. Everything is free; coffee asks for a quarter if you have one.
MENU = [
  ('BEEF STEW', 'Chuck braised for hours with carrot, celery, onion and potato. Italian bread to mop it up.'),
  ('CHEDDAR AND ONION ROLLS', 'A pull-apart batch, baked this morning with sharp cheese on top. Good for dunking.'),
  ('MANHOLE COVER PIZZAS', 'Little rounds of tomato sauce and mozzarella, pepperoni laid on in a crosshatch.'),
  ('CIDER DOUGHNUTS', 'Cake rings made with apple juice boiled down thick, fried and rolled in cinnamon sugar.'),
  ('LIME COOLER', 'Lime cordial and tonic water, poured over a glass full of ice.'),
  ('HOT COFFEE', 'Black, all day. Milk and sugar on the counter. 25&nbsp;cents in the jar if you can spare it.'),
]

def menu():
    out = []
    for i, (n, d) in enumerate(MENU):
        out.append(f'''<div style="margin-top: {0 if i == 0 else 19}px">
        <h3 style="margin: 0; font-weight: 400; font-size: 21px; line-height: 1.15; letter-spacing: 0.03em">{n}</h3>
        <p style="margin: 3px 0 0; font-size: 16px; line-height: 1.38">{d}</p></div>''')
    return '\n'.join(out)

b = open(os.path.join(D, 'notice.body.html')).read()
b = b.replace('{{MENU}}', menu()).replace('{{IMG_PAPER}}', IMG['paper']).replace('{{IMG_PHOTO}}', IMG['photo'])
i = b.rindex('</div>')
tack = f'<img src="{IMG["tack"]}" alt="" aria-hidden="true" style="position: absolute; left: 380px; top: 4px; width: 64px; height: 64px; display: block">'
wear = f'<img src="{IMG["wear"]}" alt="" aria-hidden="true" style="position: absolute; left: -12px; top: -12px; width: 840px; height: 1080px; pointer-events: none; display: block">'
b = b[:i] + wear + tack + b[i:]
open(os.path.join(D, 'notice.html'), 'w').write(f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Soup kitchen notice</title>{FONT_LINK}<style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
