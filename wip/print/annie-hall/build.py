"""Mandel's Delicatessen & Restaurant menu, Annie Hall (1977).
Two-sided US Letter card from the deli across from Lincoln Center, where Alvy and Annie have
their last lunch. House style lock (Jurassic system). Art: two TMDB stills plus one engraved
coaster spot (assets/linecut-coaster.png). Writes front.html, back.html, film.json, annietable.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
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
  'bw': ("Black and white", "Soft cake cookie, iced half vanilla, half chocolate.", ".40"),
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


def bar(t, sub=None):
    """Black ribbon with a swallowtail end, built from borders (html2canvas safe)."""
    s = (f'<span style="{SANS}; font-weight: 600; font-style: italic; font-size: 18px; color: {PAPER}; opacity: 0.9; margin-left: 16px; white-space: nowrap">{sub}</span>'
         if sub else '')
    return (f'<div style="display: flex; align-items: stretch; height: 58px">'
            f'<div style="width: 8px; background: {ACC}"></div>'
            f'<div style="display: flex; align-items: center; background: {INK}; color: {PAPER}; padding: 0 18px 0 18px; white-space: nowrap">'
            f'<span style="{DISP}; font-size: 40px; line-height: 1; text-transform: uppercase; letter-spacing: 0.01em; position: relative; top: 1px">{t}</span>{s}</div>'
            f'<div style="width: 0; height: 0; border-top: 29px solid {INK}; border-bottom: 29px solid {INK}; border-right: 22px solid transparent"></div></div>')


def kicker(t, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; text-transform: uppercase; color: {ACC}; white-space: nowrap; {extra}">{t}</div>'


def framed(src, alt, w, h):
    return (f'<div style="border: 3px solid {ACC}; padding: 5px; background: #fbf3d6; width: {w}px">'
            f'<img src="{src}" alt="{alt}" style="display: block; width: {w}px; height: {h}px"></div>')


def face(inner):
    livery = (f'<div style="position: absolute; left: 0; top: 0; width: {W}px; height: 16px; background: {INK}"></div>'
              f'<div style="position: absolute; left: 0; top: 16px; width: {W}px; height: 5px; background: {ACC}"></div>'
              f'<div style="position: absolute; left: 0; top: {H - 10}px; width: {W}px; height: 10px; background: {INK}"></div>')
    fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
            'background: radial-gradient(ellipse 80% 74% at 50% 46%, rgba(255,240,190,0.10) 0%, rgba(255,240,190,0.06) 55%, rgba(150,100,30,0.30) 100%)"></div>')
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
             f'height: {H}px; pointer-events: none; display: block; opacity: 0.8">')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{inner}{livery}{fade}{grain}</div>')


L, CW = 56, 704

front = face(f'''
<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Across from Lincoln Center')}{kicker('Open 7 A.M. to 1 A.M.', 'color: ' + MUTE + '; letter-spacing: 0.14em')}</div>
  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-top: 4px">
    <div style="{DISP}; font-size: 96px; line-height: 1.08; color: {ACC}; white-space: nowrap">Mandel’s</div>
    <div style="text-align: right; padding-bottom: 14px">
      <div style="{DISP}; font-size: 28px; line-height: 1.1; text-transform: uppercase; white-space: nowrap">Delicatessen</div>
      <div style="{DISP}; font-size: 28px; line-height: 1.1; text-transform: uppercase; white-space: nowrap">&amp; Restaurant</div></div></div>
  <div style="{SANS}; font-style: italic; font-weight: 600; font-size: 22px; margin-top: 2px">The food is good. And such big portions.</div>
  <div style="height: 4px; background: {INK}; margin-top: 12px"></div>
  <div style="margin-top: 16px">{framed('assets/still-terrace.jpg', 'Two regulars talking on a rooftop terrace up the block', 682, 300)}</div>
  <div style="display: flex; justify-content: space-between; {SANS}; font-style: italic; font-size: 16px; color: {MUTE}; margin-top: 7px">
    <span>Two regulars, on a terrace up the block.</span><span>Est. Coney Island, 1946</span></div>
  <div style="margin-top: 16px">{bar('From the counter', 'sliced by hand, to order')}</div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px">
    <div>{S('Pastrami on white with mayo', 14, note=True, ring=True)}</div>
    <div>{S("Alvy's potato knishes", 14)}{A('corned')}</div></div>
</div>
<div style="position: absolute; left: {L}px; top: 920px; width: {CW}px; border-top: 1px solid {INK}; padding-top: 12px; display: flex; gap: 22px; align-items: flex-end">
  <div style="flex: 1">
    {kicker('A word from a regular', 'font-size: 15px')}
    <div style="{SANS}; font-size: 18px; line-height: 1.32; margin-top: 4px">Best knish in Manhattan, and I grew up under a roller coaster. Ask for Max.</div></div>
  <div style="flex: none; width: 190px; text-align: right">
    <div style="{HAND}; font-size: 40px; line-height: 1; color: #233163; transform: rotate(-4deg)">Alvy Singer</div>
    <div style="{SANS}; font-weight: 600; font-size: 14px; color: {MUTE}; margin-top: 6px">Since 1946, more or less</div></div></div>''')

check_line = lambda t, p='': (f'<div style="display: flex; justify-content: space-between; border-bottom: 1px solid #9cb7a4; height: 30px; align-items: flex-end; padding-bottom: 2px">'
                              f'<span style="{HAND}; font-size: 22px; color: #233163; line-height: 1">{t}</span><span style="{HAND}; font-size: 22px; color: #233163; line-height: 1">{p}</span></div>')
guest = f'''<div style="position: absolute; left: 40px; top: 26px; width: 236px; background: #f7f3e6; padding: 10px 14px 12px; transform: rotate(-3deg); box-shadow: 0 3px 8px rgba(60,40,10,0.28)">
  <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid #2f6b47; padding-bottom: 4px">
    <span style="{SANS}; font-weight: 800; font-size: 14px; letter-spacing: 0.14em; color: #2f6b47">GUEST CHECK</span>
    <span style="{SANS}; font-weight: 800; font-size: 14px; color: {ACC}">No. 1977</span></div>
  {check_line('1 pastrami, white, mayo', '3.25')}{check_line('1 corned beef, rye', '3.15')}{check_line('2 knish', '1.50')}
  <div style="{HAND}; font-size: 24px; color: {ACC}; margin-top: 4px; transform: rotate(-2deg)">la-di-da!</div></div>'''

back = face(f'''
<div style="position: absolute; left: {L}px; top: 50px; width: {CW}px">
  <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker('Mandel’s, Broadway at 63rd')}{kicker('Pay the cashier', 'color: ' + MUTE + '; letter-spacing: 0.14em')}</div>
  <div style="display: flex; justify-content: space-between; align-items: flex-end">
    <div style="{DISP}; font-size: 64px; line-height: 1.1; white-space: nowrap">Take It Home</div>
    <img src="assets/stamp-prices.png" alt="Rubber stamp: effective May 1, 1977" style="display: block; width: 170px; height: 75px; transform: rotate(-6deg); margin-bottom: 6px"></div>
  <div style="height: 4px; background: {INK}; margin-top: 8px"></div>
  <div style="display: grid; grid-template-columns: minmax(0,1fr) minmax(0,1fr); column-gap: 40px; margin-top: 20px">
    <div>
      {bar('Party trays')}
      {S('Lobster bites', 14, note=True)}
      <div style="margin-top: 18px">{framed('assets/still-beach.jpg', 'Two regulars on the beach out east', 318, 176)}</div>
      <div style="{SANS}; font-style: italic; font-size: 16px; color: {MUTE}; margin-top: 7px">Out east for the weekend? Packed on ice.</div>
      <div style="margin-top: 20px">{bar('Bake case')}</div>
      {S('New York cheesecake', 14, note=True)}</div>
    <div style="position: relative">
      {bar('Fountain')}
      {S("Alvy's LA cucumber mint cooler", 14, note=True)}{A('egg')}{A('coffee')}{A('bw')}
      <div style="position: relative; height: 200px">{guest}</div>
      </div></div>
</div>
<div style="position: absolute; left: {L}px; top: 982px; width: {CW}px; border-top: 1px solid {INK}; padding-top: 8px; display: flex; justify-content: space-between; {SANS}; font-weight: 600; font-size: 15px; color: {MUTE}">
  <span>Prices subject to change. No sneezing near the bake case.</span><span>Form 15, 1977</span></div>''')

for name, body in (('front', front), ('back', back)):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Mandel\'s Delicatessen</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "annietable", "fn": "fmtAnnieTable", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
           "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Caprasimo", "Libre Franklin", "Covered By Your Grace"],
           "phone": {"disp": "'Caprasimo',serif", "title": "'Caprasimo',serif", "name": "'Caprasimo',serif",
                     "body": "'Libre Franklin',sans-serif", "price": "'Caprasimo',serif", "note": "'Libre Franklin',sans-serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"Annie Hall (1977)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'annietable.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
