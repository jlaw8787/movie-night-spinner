"""Builds the Southbound Lunch Counter card (Midnight Cowboy, 1969).

Venue: the all-night lunch counter on the upper level of the Eighth Avenue bus terminal,
where Joe and Ratso wait for the Florida bus. A small 5 x 7 in counter card, two faces
(480 x 672 px at 96 dpi), propped in a chrome holder by the napkins.
Palette: midnight navy, palm teal, Florida sunset pink stock.
Signature piece: a real 1940s linen postcard of Miami Beach palms (public domain, see CREDITS.md).
Still: Forty-Second Street from the film (TMDB). Props: bus ticket to Miami, Florida postcard.
"""
import os, json
from PIL import Image, ImageFilter, ImageDraw
import random

D = os.path.dirname(os.path.abspath(__file__))
W, H = 480, 672
FILM = 'Midnight Cowboy (1969)'

FONTS = ('family=Fascinate&family=Libre+Franklin:ital,wght@0,400;0,600;0,700;0,800;1,400'
         '&family=Gochi+Hand')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Fascinate', serif"
BODY = "'Libre Franklin', sans-serif"
HAND = "'Gochi Hand', cursive"

PAPER = '#f5d9c6'   # sunset pink stock
NAVY = '#1c2347'    # midnight
TEAL = '#0d6e66'    # palm teal
SOFT = '#4a4a62'
TICKET = '#f0e7b8'

# (spec key or None if added, printed name, price, description, phone note)
PACKED = [
    ('Automat sandwiches', 'Ham and Swiss quarters', '.45',
     'On white, mustard butter, crusts off.',
     'Cut in four and wrapped to take on board.'),
    ('Florida orange cake', 'Orange almond cake', '.30',
     'Whole Florida oranges, ground almonds.',
     'Baked fresh every morning. Keeps for the ride.'),
    ("Ratso's Florida coconut pineapple cooler", 'Pineapple coconut cooler', '.35',
     'Shaken frothy with lime, over ice.',
     'A taste of Florida before you get there.'),
]
GRILL = [
    (None, 'Texas hamburger', '.55',
     'Quarter pound, onions fried on the griddle.', None),
    ('Florida coconut prawns', 'Coconut fried shrimp', '1.69',
     'Butterflied, coconut and crumbs, fried golden. Sweet red pepper sauce and lime.',
     'Fried to order, tails on.'),
    ('Cinnamon doughnut holes, coffee custard', 'Cinnamon doughnut holes', '.25',
     'Cinnamon sugar, coffee custard to dunk.',
     'Hot all night.'),
]
URN = [
    (None, 'Coffee', '.10', 'Fresh every hour.', None),
    (None, 'Hot tea', '.15', 'Good for that cough.', None),
]


def ab(x, y, w, inner, style=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {style}">{inner}</div>'


def kicker(t, col=TEAL, align='left', size=18):
    return (f'<div style="text-align: {align}; font-family: {BODY}; font-weight: 700; font-size: {size}px; '
            f'letter-spacing: 0.2em; line-height: 22px; color: {col}">{t}</div>')


def title(t):
    """Section title: Fascinate in navy over a deco triple rule in teal."""
    return (f'<div style="font-family: {DISP}; font-size: 40px; line-height: 44px; color: {NAVY}; letter-spacing: 0.01em">{t}</div>'
            f'<div style="margin-top: 4px; height: 3px; background: {TEAL}"></div>'
            f'<div style="margin-top: 3px; height: 1px; background: {TEAL}"></div>'
            f'<div style="margin-top: 3px; width: 46%; height: 1px; background: {TEAL}"></div>')


def item(name, price, desc, gap=12, desc_size=20):
    return f'''<div style="margin-top: {gap}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; font-family: {BODY}; font-weight: 800; font-size: 26px; line-height: 30px; color: {NAVY}">
        <span>{name}</span><span style="font-weight: 800; padding-left: 10px">{price}</span></div>
      <div style="margin-top: 3px; font-family: {BODY}; font-size: {desc_size}px; line-height: 25px; color: {SOFT}; text-wrap: pretty">{desc}</div></div>'''


def finish(face):
    return f'''
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none; opacity: 0.32">
  <img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'''


def face(name, inner, props=''):
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {NAVY}">
  {inner}
  {finish(name)}
  {props}
</div>'''


# ---------------------------------------------------------------- props
def ticket():
    """Bus ticket to Miami, tucked against the postcard. Ticket stock, red serial, punched hole."""
    lab = f'font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.12em; line-height: 17px'
    return f'''<div style="position: absolute; left: 246px; top: 318px; width: 192px; height: 86px; transform: rotate(5deg);
      background: {TICKET}; border: 1px solid #b9ab73; box-shadow: 0 3px 8px rgba(28,35,71,0.35)">
      <div style="position: absolute; left: 8px; top: 6px; width: 150px; {lab}; letter-spacing: 0.08em; white-space: nowrap; color: {TEAL}">ONE WAY &middot; COACH</div>
      <div style="position: absolute; left: 8px; top: 25px; width: 168px; font-family: {BODY}; font-weight: 800; font-size: 17px; line-height: 19px; color: {NAVY}">NEW YORK, N.Y.<br>to MIAMI, FLA.</div>
      <div style="position: absolute; left: 8px; top: 66px; width: 176px; {lab}; font-size: 14px; letter-spacing: 0.02em; white-space: nowrap; color: #b0322a">No. 1969 &nbsp; LV MIDNIGHT</div>
      <div style="position: absolute; left: 168px; top: 8px; width: 14px; height: 14px; border-radius: 7px; background: {PAPER}; border: 1px solid #b9ab73"></div>
    </div>'''


def postcard_prop():
    """Florida postcard, message side, with Ratso's note. Stamp built from divs."""
    return f'''<div style="position: absolute; left: 252px; top: 84px; width: 186px; height: 126px; transform: rotate(4deg);
      background: #fbf6ea; box-shadow: 0 3px 9px rgba(28,35,71,0.35)">
      <div style="position: absolute; left: 150px; top: 8px; width: 36px; height: 42px; background: {TEAL}; border: 2px dotted #fbf6ea; box-sizing: border-box"></div>
      <div style="position: absolute; left: 157px; top: 15px; width: 22px; font-family: {BODY}; font-weight: 800; font-size: 14px; line-height: 14px; color: #fbf6ea; text-align: center">6&#162;</div>
      <div style="position: absolute; left: 10px; top: 8px; width: 134px; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; line-height: 16px; color: {TEAL}">POST CARD</div>
      <div style="position: absolute; left: 10px; top: 28px; width: 176px; font-family: {HAND}; font-size: 19px; line-height: 21px; color: #23306b">Joe. Florida! Sun, coconuts, no coat. Two seats on the bus.</div>
      <div style="position: absolute; left: 96px; top: 96px; width: 90px; text-align: right; font-family: {HAND}; font-size: 28px; line-height: 30px; color: #23306b">Rico</div>
    </div>'''


# ---------------------------------------------------------------- front
front_inner = f'''
  {ab(0, 0, W, '', f'height: 190px; background: {NAVY}')}
  {ab(40, 40, W - 80, kicker('EIGHTH AVENUE BUS TERMINAL', PAPER, 'center', 16))}
  {ab(20, 60, W - 40, f'<div style="text-align: center; font-family: {DISP}; font-size: 58px; line-height: 64px; color: {PAPER}">Southbound</div>')}
  {ab(40, 122, W - 80, f'<div style="text-align: center; font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.32em; line-height: 22px; color: #e7a98c">LUNCH COUNTER</div>')}
  <div style="position: absolute; left: 40px; top: 156px; width: 400px; height: 230px; transform: rotate(-1.5deg); background: #fbf6ea; box-shadow: 0 4px 12px rgba(28,35,71,0.45)">
    <img src="assets/postcard-miami.jpg" alt="Miami Beach, palms along the shore, from a linen postcard" style="position: absolute; left: 9px; top: 9px; width: 382px; height: 212px; object-fit: cover; display: block">
  </div>
  {ab(40, 390, 260, f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 20px; color: {SOFT}">Miami Beach, one night south.</div>')}
  {ab(40, 418, W - 80, kicker('PACKED FOR THE BUS'))}
  {ab(40, 434, W - 80, ''.join(item(n, p, d, 4 if i == 0 else 8, 18) for i, (_, n, p, d, _) in enumerate(PACKED)))}
'''

# ---------------------------------------------------------------- back
back_inner = f'''
  <div style="position: absolute; left: 40px; top: 36px; width: 400px; height: 134px; border: 3px solid {TEAL}; box-sizing: border-box; background: {NAVY}; overflow: hidden">
    <img src="assets/still-42nd-crop.jpg" alt="Forty-Second Street, a yellow cab and shoppers on the sidewalk" style="position: absolute; left: 0; top: 0; width: 394px; height: 128px; object-fit: cover; display: block">
  </div>
  {ab(40, 176, 210, f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 20px; color: {SOFT}">Forty-Second Street, right outside our doors.</div>')}
  {ab(40, 226, W - 80, title('Off the Grill') + ''.join(item(n, p, d, 8 if i == 0 else 10, 18) for i, (_, n, p, d, _) in enumerate(GRILL)))}
  {ab(40, 532, W - 80, f'<div style="height: 1px; background: {TEAL}; opacity: 0.7"></div><div style="display: flex; gap: 24px; margin-top: 8px">' + ''.join(f'<div style="flex: 1"><div style="display: flex; justify-content: space-between; font-family: {BODY}; font-weight: 800; font-size: 22px; line-height: 26px; color: {NAVY}"><span>{n}</span><span>{p}</span></div><div style="font-family: {BODY}; font-size: 16px; line-height: 19px; color: {SOFT}">{d}</div></div>' for _, n, p, d, _ in URN) + '</div>')}
  {ab(40, 642, W - 80, '', '')}
'''

FINE = (f'<div style="font-family: {BODY}; font-size: 14px; line-height: 17px; color: {SOFT}">'
        'Open all night. Radios with earphone only. Dishwasher wanted, nights. '
        'Prices subject to change. Form 69-MC, 1969.</div>')


def wear(name):
    """Soft aged vignette and big gentle mottling, low detail."""
    random.seed(69 if name == 'front' else 70)
    S = 2
    im = Image.new('RGBA', (W * S, H * S), (0, 0, 0, 0))
    m = Image.new('L', (W * S, H * S), 0)
    d = ImageDraw.Draw(m)
    for i in range(60):
        inset = i * 3
        d.rectangle([inset, inset, W * S - inset, H * S - inset], outline=int(max(0, 120 - i * 2)), width=3)
    for _ in range(14):
        x, y, r = random.randint(0, W * S), random.randint(0, H * S), random.randint(60, 200)
        d.ellipse([x - r, y - r, x + r, y + r], fill=random.randint(8, 22))
    m = m.filter(ImageFilter.GaussianBlur(40))
    tint = Image.new('RGBA', (W * S, H * S), (120, 70, 40, 0))
    tint.putalpha(m.point(lambda v: int(v * 0.55)))
    im.alpha_composite(tint)
    im.save(os.path.join(D, 'assets', f'wear-{name}.png'))


def page(body):
    return (f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width={W}">'
            f'{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')


def main():
    for n in ('front', 'back'):
        wear(n)
    faces = {
        'front': face('front', front_inner, ticket()),
        'back': face('back', back_inner.replace(ab(40, 642, W - 80, '', ''), ab(40, 597, W - 80, FINE)), postcard_prop()),
    }
    for n, body in faces.items():
        open(os.path.join(D, f'{n}.body.html'), 'w').write(body)
        open(os.path.join(D, f'{n}.html'), 'w').write(page(body))

    fams = ['Fascinate', 'Libre Franklin', 'Gochi Hand']
    film = {'fmt': 'southbound', 'fn': 'fmtSouthbound', 'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
            'mm': [127.0, 177.8], 'fonts': FONTS, 'fams': fams,
            'phone': {'disp': "'Fascinate',serif", 'title': "'Fascinate',serif", 'name': "'Libre Franklin',sans-serif",
                      'body': "'Libre Franklin',sans-serif", 'price': "'Libre Franklin',sans-serif", 'note': "'Libre Franklin',sans-serif"}}
    json.dump(film, open(os.path.join(D, 'film.json'), 'w'), indent=1)
    labels = {FILM: {k: {'n': n, 'd': d, 'note': note} for k, n, p, d, note in PACKED + GRILL + URN if k}}
    json.dump(labels, open(os.path.join(D, 'southbound.labels.json'), 'w'), indent=1)
    print('built')


if __name__ == '__main__':
    main()
