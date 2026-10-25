"""Spring & Crosby Coffee Shop placemat, C.H.U.D. (1984).
One landscape diner placemat (14 x 10 in, 1344x960) from the all-night SoHo coffee shop on the corner of
Spring and Crosby. Signature piece: plate 24 of Perris & Browne's 1884 Insurance Maps of the City of New York
(Library of Congress), with the sewer mains, manholes and an old tunnel drawn over it as plain lines. Writes placemat.html, film.json, labels."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 1344, 960
BG, INK, ORANGE, GREEN, MUTE, CARD = '#0f2e35', '#efe8d4', '#f26a1f', '#8cc04a', '#a9bdb6', '#f3ecd8'
FONTS = ('family=Staatliches'
         '&family=Barlow:wght@600;700;800'
         '&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;1,8..60,400'
         '&family=Shadows+Into+Light')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Staatliches', 'Arial Narrow', sans-serif"
SANS = "font-family: 'Barlow', 'Helvetica Neue', Arial, sans-serif"
SERIF = "font-family: 'Source Serif 4', Georgia, serif"
HAND = "font-family: 'Shadows Into Light', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Soup kitchen cheddar and onion rolls": ("Cheddar & Onion Rolls", "A pull-apart pan, baked this morning with sharp cheese on top.", "1.25",
                                           "Good for dunking in the stew."),
  "Manhole cover mini pizzas": ("Manhole Cover Pizzas", "Little rounds of tomato sauce and mozzarella, pepperoni in a crosshatch.", "2.50",
                                "Cut like the covers out front."),
  "The Reverend's soup kitchen stew": ("Beef Stew", "Chuck braised for hours with carrot, celery, onion and potato. Italian bread.", "4.25",
                                       "What's left goes to the Reverend's shelter."),
  "Greenwich Village cider doughnuts": ("Cider Doughnuts", "Boiled-down apple juice in the batter, rolled in cinnamon sugar.", "2 for .96",
                                        "Seconds once everybody has had firsts."),
  "Glowing green cordial": ("Lime Cooler", "Lime cordial and tonic water over a glass full of ice.", ".84",
                            "Glows green under the sign."),
}
ADD = {
  'burger': ("Cheeseburger Deluxe", "Six ounces off the griddle with American, fries and slaw.", "3.95"),
  'omelette': ("Western Omelette", "Three eggs, ham, green pepper and onion, home fries.", "3.25"),
  'pudding': ("Rice Pudding", "Baked slow with milk and raisins, cinnamon on top.", "1.50"),
  'coffee': ("Coffee", "Bottomless at the counter, fresh every hour.", ".60"),
}


def item(n, d, p, note=None, top=16):
    nt = (f'<div style="{SERIF}; font-style: italic; font-size: 18px; line-height: 1.25; color: {GREEN}; margin-top: 2px">{note}</div>' if note else '')
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 12px">
        <div style="{SANS}; font-weight: 800; font-size: 26px; line-height: 1.08">{n}</div>
        <div style="{SANS}; font-weight: 800; font-size: 26px; white-space: nowrap; color: {ORANGE}">{p}</div></div>
      <div style="{SERIF}; font-size: 20px; line-height: 1.26; margin-top: 3px; color: #d9d6c6; text-wrap: pretty">{d}</div>{nt}</div>'''


def S(k, top=16, note=False):
    n, d, p, nt = SPEC[k]
    return item(n, d, p, nt if note else None, top)


def A(k, top=16):
    return item(*ADD[k], top=top)


def head(t, sub=''):
    s = f'<span style="{SANS}; font-weight: 700; font-size: 16px; letter-spacing: 0.16em; color: {MUTE}; white-space: nowrap">{sub}</span>' if sub else ''
    return (f'<div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid {GREEN}; padding-bottom: 4px">'
            f'<div style="{DISP}; font-size: 42px; line-height: 1; color: {ORANGE}; letter-spacing: 0.02em">{t}</div>{s}</div>')


def kicker(t, color=GREEN, extra=''):
    return f'<div style="{SANS}; font-weight: 800; font-size: 18px; letter-spacing: 0.18em; text-transform: uppercase; color: {color}; {extra}">{t}</div>'


# ---------- map overlays (css px inside the 572x896 map window) ----------
MX, MY, MW, MH = 386, 32, 572, 896
TAG = f"position: absolute; {SANS}; font-weight: 700; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase; color: {INK}; background: rgba(10,30,34,0.86); padding: 2px 7px; white-space: nowrap"
# street tags placed on the 1884 Perris & Browne plate 24 (north up, Broadway at left)
HS = {'Houston St.': (400, 14), 'Prince St.': (300, 279), 'Spring St.': (330, 510)}
VS = {'Broadway': 52, 'Crosby': 145, 'Lafayette': 252, 'Mulberry': 407, 'Mott': 505}
labels = ''.join(f'<div style="{TAG}; left: {x}px; top: {y}px">{n}</div>' for n, (x, y) in HS.items())
labels += ''.join(f'<div style="{TAG}; left: {x}px; top: 630px; transform: translateX(-50%)">{n}</div>' for n, x in VS.items())
# what runs underneath, as plain lines over the real map
def sline(x0, y0, x1, y1):
    return f'<line x1="{x0}" y1="{y0}" x2="{x1}" y2="{y1}" stroke="{GREEN}" stroke-width="3" stroke-dasharray="7 7" opacity="0.95"/>'
mains = [(145, 0, 145, 896), (22, 0, 22, 896), (0, 312, 572, 266), (0, 560, 572, 501), (0, 791, 572, 754)]
holes = [(145, 300), (145, 781), (22, 310), (22, 558), (22, 793), (250, 534), (232, 292), (400, 519), (385, 281), (490, 509)]
under = (f'<svg width="{MW}" height="{MH}" viewBox="0 0 {MW} {MH}" style="position: absolute; left: 0; top: 0" aria-hidden="true">'
         '<path d="M 600 360 L 470 420 L 330 650 L 330 910" fill="none" stroke="#1a3a24" stroke-width="7" opacity="0.8"/>'
         '<path d="M 600 360 L 470 420 L 330 650 L 330 910" fill="none" stroke="#5f9a46" stroke-width="2.5" opacity="0.95"/>'
         + ''.join(sline(*m) for m in mains)
         + ''.join(f'<circle cx="{x}" cy="{y}" r="6" fill="#2c2e2e" stroke="{ORANGE}" stroke-width="3"/>' for x, y in holes)
         + f'<rect x="137" y="537" width="17" height="13" fill="{ORANGE}" stroke="#7a2c08" stroke-width="1.5"/></svg>')

legend_row = lambda sw, t: f'<div style="display: flex; align-items: center; gap: 10px; margin-top: 6px">{sw}<span style="{SANS}; font-weight: 600; font-size: 15px; color: {INK}">{t}</span></div>'
sw_us = f'<div style="width: 22px; height: 14px; background: {ORANGE}; border: 1px solid #7a2c08"></div>'
sw_mh = f'<div style="width: 14px; height: 14px; border-radius: 50%; background: #2c2e2e; border: 3px solid {ORANGE}; margin: 0 2px"></div>'
sw_sw = f'<div style="display: flex; gap: 4px; width: 22px">' + ''.join(f'<div style="width: 6px; height: 3px; background: {GREEN}"></div>' for _ in range(3)) + '</div>'
sw_tn = f'<div style="width: 22px; height: 10px; background: #34602e; border-top: 2px solid #1a3a24; border-bottom: 2px solid #1a3a24"></div>'

mapbox = f'''
<div style="position: absolute; left: {MX - 4}px; top: {MY - 4}px; width: {MW + 2}px; height: {MH + 2}px; border: 3px solid {ORANGE}"></div>
<div style="position: absolute; left: {MX}px; top: {MY}px; width: {MW}px; height: {MH}px; overflow: hidden">
  <img src="assets/soho-map.jpg" alt="1884 Perris and Browne fire insurance map of the blocks from Houston to Broome, Broadway to the Bowery, with the sewer mains, manholes and an old tunnel marked over it" style="position: absolute; left: 0; top: 0; width: {MW}px; height: {MH}px; display: block">
  {under}{labels}
  <div style="position: absolute; left: 14px; top: 14px; width: 290px; background: rgba(10,30,34,0.9); border-left: 6px solid {ORANGE}; padding: 12px 16px 13px">
    {kicker('How to find us', GREEN, 'font-size: 16px')}
    <div style="{DISP}; font-size: 36px; line-height: 0.95; color: {INK}; margin-top: 4px">SoHo, above and below</div>
    <div style="{SERIF}; font-size: 16px; line-height: 1.3; color: #d9d6c6; margin-top: 6px">Every block from Houston to Grand, and what runs under the street.</div></div>
  <div style="position: absolute; left: 172px; top: 528px; display: flex; align-items: center">
    <div style="width: 26px; height: 3px; background: {ORANGE}; margin-left: -24px"></div>
    <div style="background: {ORANGE}; color: #1b0f08; {SANS}; font-weight: 800; font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 9px; line-height: 1.15">We are here<br><span style="font-weight: 600; letter-spacing: 0.04em">Open all night</span></div></div>
  <div style="position: absolute; left: 14px; top: 690px; width: 262px; background: {CARD}; padding: 6px 6px 7px; transform: rotate(-1.5deg)">
    <img src="assets/still-corner.jpg" alt="Spring and Crosby at night, the phone booth and the manhole out front" style="display: block; width: 250px; height: 149px">
    <div style="{SANS}; font-weight: 600; font-size: 14px; line-height: 1.25; color: #2b2a26; margin-top: 5px">After the rain. Photo by G. Cooper.</div></div>
  <div style="position: absolute; right: 14px; bottom: 14px; width: 180px; background: rgba(10,30,34,0.9); padding: 9px 14px 11px">
    {kicker('Key', MUTE, 'font-size: 14px')}
    {legend_row(sw_us, 'Spring &amp; Crosby')}{legend_row(sw_mh, 'Manhole cover')}{legend_row(sw_sw, 'Sewer main')}{legend_row(sw_tn, 'Old tunnel, keep out')}</div>
</div>'''

CHUD = ''.join(f'<span style="color: {ORANGE}">{w[0]}</span>{w[1:]} ' for w in ('Clean.', 'Hot.', 'Unbeatable.', 'Delicious.')).strip()

left = f'''
<div style="position: absolute; left: 42px; top: 40px; width: 318px">
  {kicker('SoHo, open all night', ORANGE, 'font-size: 16px; letter-spacing: 0.14em')}
  <div style="{DISP}; font-size: 54px; line-height: 0.95; margin-top: 6px; white-space: nowrap">Spring <span style="color: {ORANGE}">&amp;</span> Crosby</div>
  <div style="{DISP}; font-size: 30px; line-height: 1; letter-spacing: 0.14em; color: {GREEN}; margin-top: 4px">Coffee Shop</div>
  <div style="{SANS}; font-weight: 700; font-size: 15px; letter-spacing: 0.03em; white-space: nowrap; text-transform: uppercase; margin-top: 10px; color: {INK}">{CHUD}</div>
  <div style="margin-top: 20px">{head('Off the Counter')}</div>
  {S('Soup kitchen cheddar and onion rolls', 10)}{S('Manhole cover mini pizzas')}
  <div style="margin-top: 20px">{head('Hot Plates')}</div>
  {S("The Reverend's soup kitchen stew", 10)}{A('burger')}{A('omelette')}
</div>'''

right = f'''
<div style="position: absolute; left: 980px; top: 40px; width: 322px">
  <div style="padding-top: 6px">{head('The Fountain')}</div>
  {S('Greenwich Village cider doughnuts', 10)}{A('pudding')}{S('Glowing green cordial', 16, note=True)}{A('coffee')}
  <div style="margin-top: 22px; background: {CARD}; color: #22211d; padding: 12px 16px 10px; transform: rotate(1.2deg)">
    {kicker('A word from the precinct', '#b4470f', 'font-size: 14px')}
    <div style="{SERIF}; font-size: 18px; line-height: 1.3; margin-top: 4px">My men eat here every night shift, and so do I. Best cup of coffee south of Houston Street.</div>
    <div style="display: flex; align-items: baseline; gap: 12px">
      <div style="{HAND}; font-size: 34px; line-height: 1.1; color: #22306a; transform: rotate(-3deg)">Bosch</div>
      <div style="{SANS}; font-weight: 600; font-size: 14px; color: #5a564c">Captain, N.Y.P.D.</div></div></div>
  <div style="margin-top: 16px; border: 2px dashed {GREEN}; padding: 10px 14px 11px; transform: rotate(-1deg)">
    <div style="display: flex; justify-content: space-between; align-items: baseline">{kicker("The Reverend's shelter", GREEN, 'font-size: 14px; letter-spacing: 0.12em')}<span style="{SANS}; font-weight: 700; font-size: 14px; color: {MUTE}">No. 1984</span></div>
    <div style="{DISP}; font-size: 30px; line-height: 1; margin-top: 4px; color: {ORANGE}">One hot supper, on us</div>
    <div style="{SERIF}; font-size: 16px; line-height: 1.3; margin-top: 4px; color: #d9d6c6">Tear off and give it to anyone who needs a meal. Good at the counter any night.</div></div>
</div>
<div style="position: absolute; left: 980px; top: 862px; width: 322px; {SANS}; font-weight: 600; font-size: 14px; line-height: 1.35; color: {MUTE}">
  Prices subject to change. Minimum at tables after midnight, 1.25.<br>96 Crosby St. WOrth 6-0831. 1984</div>'''

fade = (f'<div aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; '
        'background: radial-gradient(ellipse 80% 75% at 50% 50%, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 60%, rgba(0,10,12,0.35) 100%)"></div>')
grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; '
         f'height: {H}px; pointer-events: none; display: block; opacity: 0.5">')
body = (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {BG}; color: {INK}">'
        f'{left}{mapbox}{right}{fade}{grain}</div>')

open(os.path.join(D, 'placemat.body.html'), 'w').write(body)
open(os.path.join(D, 'placemat.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Spring &amp; Crosby Placemat</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({"fmt": "bowerybelow", "fn": "fmtBoweryBelow", "faces": ["placemat.html"], "names": ["Placemat"],
           "mm": [355.6, 254], "fonts": FONTS, "fams": ["Staatliches", "Barlow", "Source Serif 4", "Shadows Into Light"],
           "phone": {"disp": "'Staatliches',sans-serif", "title": "'Staatliches',sans-serif", "name": "'Barlow',sans-serif",
                     "body": "'Source Serif 4',serif", "price": "'Barlow',sans-serif", "note": "'Source Serif 4',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
json.dump({"C.H.U.D. (1984)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}},
          open(os.path.join(D, 'bowerybelow.labels.json'), 'w'), indent=1)
print('built')
