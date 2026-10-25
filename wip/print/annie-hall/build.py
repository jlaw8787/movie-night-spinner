"""Mandel's Delicatessen & Restaurant takeaway trifold, Annie Hall (1977).
Two landscape faces, 1344x816 (14 x 8.5 in), three 448px panels each, folded in thirds.
Outside: party trays flap | back panel (delivery, terrace still) | cover with the engraved Coney Island coaster.
Inside: the counter | the bake case | the fountain.
Run paint.py first (assets/coaster-engraving.png). Writes outside.html, inside.html, film.json, annietable.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H, P = 1344, 816, 448
INK, ACC, PAPER, MUTE = '#1c1915', '#7a2030', '#f0cf66', '#4d3f22'
FONTS = ('family=Caprasimo'
         '&family=Libre+Franklin:ital,wght@0,400;0,600;0,800;1,400;1,600'
         '&family=Covered+By+Your+Grace')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Caprasimo', Georgia, serif"
SANS = "font-family: 'Libre Franklin', 'Helvetica Neue', Arial, sans-serif"
HAND = "font-family: 'Covered By Your Grace', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Pastrami on white with mayo": ("Pastrami on white", "Steamed until glossy, piled high on soft white bread with mayonnaise, iceberg and tomato.", "3.25",
                                  "Yes, we make it. Max winces."),
  "Alvy's potato knishes": ("Potato knish", "Flaky pastry around Idahos mashed with slow fried onion, egg washed and baked golden.", ".75",
                            "Same recipe we baked under the coaster."),
  "Lobster bites": ("Lobster canapés", "Sweet meat folded with mayonnaise, lemon, celery and chives on toasted, buttered brioche. By the dozen.", "8.50",
                    "Shelled. None behind the refrigerator."),
  "New York cheesecake": ("Cheesecake", "Cream cheese, sour cream and lemon zest on a buttery crumb crust, baked slow in a water bath.", "1.25",
                          "Baked every morning. Never leaves Manhattan."),
  "Alvy's LA cucumber mint cooler": ("Garden rickey", "Cucumber, lime, mint and honey blended and strained, poured over ice and topped with seltzer.", ".95",
                                     "Big in Los Angeles, we hear."),
}
ADD = {
  'corned': ("Corned beef on rye", "Garlic cured brisket carved thin, with brown mustard.", "3.15"),
  'soup': ("Matzo ball soup", "Clear golden chicken broth, carrot and dill, one big light dumpling.", "1.25"),
  'platter': ("Deli platter", "Corned beef, pastrami, turkey and tongue, sliced thin. Serves ten.", "32.00"),
  'bw': ("Black and white", "Soft cake cookie, iced half vanilla, half chocolate.", ".40"),
  'rugelach': ("Rugelach", "Cream cheese dough rolled with apricot jam, walnuts and cinnamon sugar.", ".15 ea."),
  'egg': ("Egg cream", "Chocolate syrup and cold milk, hit hard with seltzer.", ".60"),
  'coffee': ("Coffee", "Bottomless at the counter. Tea comes in a glass.", ".35"),
}


def item(n, d, p, note=None, top=20, ring=False):
    nt = (f'<div style="{SANS}; font-style: italic; font-weight: 600; font-size: 18px; line-height: 1.3; color: {ACC}; margin-top: 5px">{note}</div>'
          if note else '')
    rg = ('<img src="assets/pen-ring.png" alt="" aria-hidden="true" style="position: absolute; right: -22px; top: -8px; width: 100px; height: 54px; display: block">'
          if ring else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{DISP}; font-size: 27px; line-height: 1.1">{n}</div>
        <div style="position: relative; {DISP}; font-size: 27px; line-height: 1.1; white-space: nowrap">{p}{rg}</div></div>
      <div style="{SANS}; font-size: 20px; line-height: 1.33; margin-top: 5px; color: #2a2318; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=20, note=False, ring=False):
    n, d, p, nt = SPEC[k]
    return item(n, d, p, nt if note else None, top, ring)


def A(k, top=20):
    return item(*ADD[k], top=top)


def kicker(t, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.18em; text-transform: uppercase; color: {ACC}; white-space: nowrap; {extra}">{t}</div>'


def head(k, t):
    """Panel head: accent kicker, big Caprasimo title, a heavy black rule with a short burgundy lead."""
    return (f'{kicker(k)}<div style="{DISP}; font-size: 40px; line-height: 1.12; margin-top: 4px; white-space: nowrap">{t}</div>'
            f'<div style="display: flex; height: 5px; margin-top: 8px"><div style="width: 56px; background: {ACC}"></div><div style="flex: 1; background: {INK}"></div></div>')


def framed(src, alt, w, h):
    return (f'<div style="border: 3px solid {ACC}; padding: 5px; background: #fbf3d6; width: {w - 16}px">'
            f'<img src="{src}" alt="{alt}" style="display: block; width: {w - 16}px; height: {h}px"></div>')


def cap(t, extra=''):
    return f'<div style="{SANS}; font-style: italic; font-size: 16px; line-height: 1.35; color: {MUTE}; margin-top: 7px; {extra}">{t}</div>'


def panel(i, inner, top=50):
    return f'<div style="position: absolute; left: {i * P + 40}px; top: {top}px; width: {P - 80}px">{inner}</div>'


def face(inner):
    livery = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {INK}"></div>'
              f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; height: 5px; background: {ACC}"></div>'
              f'<div style="position: absolute; left: 0; top: {H - 10}px; width: {W}px; height: 10px; background: {INK}"></div>')
    folds = ''.join(f'<div aria-hidden="true" style="position: absolute; left: {x}px; top: 21px; width: 0; height: {H - 31}px; '
                    f'border-left: 1px dashed rgba(28,25,21,0.28)"></div>' for x in (P, 2 * P))
    fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
            'background: radial-gradient(ellipse 82% 78% at 50% 48%, rgba(255,240,190,0.10) 0%, rgba(255,240,190,0.05) 55%, rgba(150,100,30,0.28) 100%)"></div>')
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
             f'height: {H}px; pointer-events: none; display: block; opacity: 0.8; object-fit: cover">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{inner}{folds}{livery}{fade}{grain}</div>')


# ---------------------------------------------------------------- outside: flap | back | cover
flap = panel(0, f'''
  {head('Call a day ahead', 'Party Trays')}
  {S('Lobster bites', 16, note=True)}{A('platter')}
  <div style="margin-top: 22px">{framed('assets/still-beach.jpg', 'Two regulars on the beach out east', 368, 200)}</div>
  {cap('Out east for the weekend? Trays packed on ice, bread wrapped apart.')}''')

back = panel(1, f'''
  {framed('assets/still-terrace.jpg', 'Two regulars talking on a rooftop terrace up the block', 368, 169)}
  {cap('Two regulars, on a terrace up the block.')}
  <div style="margin-top: 24px">{head('Columbus Circle to 96th', 'We Deliver')}</div>
  <div style="{SANS}; font-size: 20px; line-height: 1.38; margin-top: 14px">Central Park to the river. Minimum order 5.00. Allow 30 minutes, longer when it rains. Cash only.</div>
  <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 18px; border-top: 1px solid {INK}; padding-top: 12px">
    {kicker('Call', 'color: ' + MUTE)}<div style="{DISP}; font-size: 48px; line-height: 1; color: {ACC}">TR 7-1977</div></div>
  <div style="{SANS}; font-weight: 600; font-size: 18px; line-height: 1.4; margin-top: 16px">Broadway at 63rd St., N.Y. 10023<br>Open seven days, 7 A.M. to 1 A.M.</div>''')

cover = panel(2, f'''
  {kicker('Across from Lincoln Center', 'letter-spacing: 0.13em')}
  <div style="{DISP}; font-size: 82px; line-height: 1.05; color: {ACC}; white-space: nowrap; margin-top: 2px">Mandel’s</div>
  <div style="{DISP}; font-size: 19px; line-height: 1.1; text-transform: uppercase; letter-spacing: 0.02em; white-space: nowrap">Delicatessen &amp; Restaurant</div>
  <div style="{SANS}; font-style: italic; font-weight: 600; font-size: 18px; margin-top: 10px">The food is good. And such big portions.</div>
  <img src="assets/coaster-engraving.png" alt="Engraving of the wooden roller coaster at Coney Island with a frame house underneath it" style="display: block; width: 368px; height: 470px; margin-top: 14px">
  {cap('Our first counter, under the coaster at Coney Island, 1946. We came uptown in 1959.')}''', top=46)

outside = face(flap + back + cover)

# ---------------------------------------------------------------- inside: counter | bake case | fountain
counter = panel(0, f'''
  {head('Sliced by hand, to order', 'From the Counter')}
  {S('Pastrami on white with mayo', 16, note=True, ring=True)}{A('corned')}{S("Alvy's potato knishes")}{A('soup')}
  <div style="{SANS}; font-size: 17px; line-height: 1.35; color: {MUTE}; margin-top: 18px; border-top: 1px solid {INK}; padding-top: 10px">With a sour pickle and slaw. Rye, white or a club roll.</div>''')

bake = panel(1, f'''
  {head('Baked downstairs daily', 'The Bake Case')}
  {S('New York cheesecake', 16, note=True)}{A('bw')}{A('rugelach')}''')

note = f'''<div style="position: absolute; left: {P + 40}px; top: 628px; width: 368px; border-top: 1px solid {INK}; padding-top: 12px">
  {kicker('A word from a regular', 'font-size: 15px')}
  <div style="{SANS}; font-size: 18px; line-height: 1.32; margin-top: 4px">Best knish in Manhattan, and I grew up under a roller coaster. Ask for Max.</div>
  <div style="{HAND}; font-size: 38px; line-height: 1; color: #233163; transform: rotate(-4deg); margin-top: 6px; text-align: right">Alvy Singer</div></div>'''

fountain = panel(2, f'''
  {head('Hot and cold', 'The Fountain')}
  {S("Alvy's LA cucumber mint cooler", 16, note=True)}{A('egg')}{A('coffee')}
  <div style="{SANS}; font-style: italic; font-weight: 600; font-size: 18px; color: {ACC}; margin-top: 18px">No alfalfa sprouts. No mashed yeast.</div>''')

foot = f'''<div style="position: absolute; left: {2 * P + 40}px; top: 648px; width: 368px">
  <img src="assets/stamp-prices.png" alt="Rubber stamp: effective May 1, 1977" style="display: block; width: 170px; height: 75px; transform: rotate(-6deg); margin-left: 190px">
  <div style="border-top: 1px solid {INK}; margin-top: 4px; padding-top: 8px; display: flex; justify-content: space-between; {SANS}; font-weight: 600; font-size: 14px; color: {MUTE}">
    <span>Prices subject to change.<br>No sneezing near the bake case.</span><span style="text-align: right">Form 15<br>1977</span></div></div>'''

inside = face(counter + bake + note + fountain + foot)

for name, body in (('outside', outside), ('inside', inside)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Mandel\'s Delicatessen</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "annietable", "fn": "fmtAnnieTable", "faces": ["outside.html", "inside.html"], "names": ["Outside", "Inside"],
           "mm": [355.6, 215.9], "fonts": FONTS, "fams": ["Caprasimo", "Libre Franklin", "Covered By Your Grace"],
           "phone": {"disp": "'Caprasimo',serif", "title": "'Caprasimo',serif", "name": "'Caprasimo',serif",
                     "body": "'Libre Franklin',sans-serif", "price": "'Caprasimo',serif", "note": "'Libre Franklin',sans-serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Annie Hall (1977)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'annietable.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
