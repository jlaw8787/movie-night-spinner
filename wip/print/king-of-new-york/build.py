"""Builds the benefit journal menu for King of New York (1990).
The object: the souvenir journal from the dinner Frank White holds to raise the $16 million that keeps
the South Bronx hospital open. Printed by the benefit committee on a quick turnaround, saddle-stitched,
US Letter (8.5 x 11 in).
Cover: green stock, two inks (silver, white), the hospital as a line cut (linecut.py).
Page 3: white offset, black plus one green that sits a hair out of register. Program, press photo of the
host, the committee list, the dinner, a pledge thermometer, and the start of the Gold Pages: small paid
ads supplied camera-ready, so every one is set in a different face.
Run paint.py and linecut.py first. Writes front.html / back.html (full pages), the .body.html parts,
film.json and plazanight.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
COVER = '#1e4a3b'
SILVER = '#c4c9c2'
WHITE = '#f3f1e8'
PAPER = '#f7f4eb'
INK = '#1c1d1a'
SOFT = '#46473f'
GREEN = '#1f5a43'
FONTS = ('family=News+Cycle:wght@400;700'
         '&family=Libre+Bodoni:ital,wght@0,400;0,600;1,400;1,600'
         '&family=Cinzel:wght@400;700'
         '&family=Pinyon+Script'
         '&family=Courier+Prime:wght@400;700'
         '&family=Arvo:wght@400;700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
SANS = "'News Cycle', 'News Gothic', 'Franklin Gothic', sans-serif"
SERIF = "'Libre Bodoni', 'Bodoni 72', 'Didot', serif"
CINZEL = "'Cinzel', 'Trajan Pro', serif"
SCRIPT = "'Pinyon Script', cursive"
TYPE = "'Courier Prime', 'Courier New', monospace"
SLAB = "'Arvo', 'Rockwell', serif"
MIS = 'transform: translate(1.6px, 1.1px)'     # the green plate, a hair out of register with the black

def esc(s): return s.replace('&', '&amp;')

def overlays(face, grain_op):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: {grain_op}; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')

def root(inner, face, bg, color, grain_op):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {bg}; '
            f'font-family: {SANS}; color: {color}">{inner}{overlays(face, grain_op)}</div>')

# ---------------- DISHES (one source for print and phone) ----------------
DISH = {
  "Plaza suite champagne cocktails": {"n": "Champagne cocktails", "d": "A sugar cube soaked in bitters and a splash of cognac, topped up with chilled brut, lemon twist.", "note": "To the doors staying open."},
  "Chinatown dumplings": {"n": "Chinatown dumplings", "d": "Pork and chive, pan-fried until the bottoms go crisp. Black vinegar and chili oil, no MSG.", "note": "Sent up from downtown."},
  "Plaza Hotel prawn cocktail": {"n": "Shrimp cocktail", "d": "Jumbos poached and iced, hung on a glass of shredded iceberg. Red sauce sharp with horseradish, lemon wedge.", "note": "On ice when you sit down."},
  "Frank's Plaza steak dinner": {"n": "Rib eye au poivre", "d": "Seared and rested, cracked pepper sauce finished with brandy and cream. Pommes frites.", "note": "Medium rare unless you say."},
  "New York cheesecake": {"n": "New York cheesecake", "d": "Rich and dense, sour cream and lemon zest beaten through, baked slow in a water bath on a buttered crumb crust.", "note": "Baked in the Bronx."},
}

# ================= FRONT: the journal cover =================
L, R = 76, 752
AW = R - L
ART_TOP, ART_H = 346, round(AW * 880 / 1360)

def cinfo(head, body, big=False):
    b = (f'<div style="margin-top: 6px; font-family: {SERIF}; font-weight: 600; font-size: 32px; line-height: 1; color: {WHITE}">{body}</div>' if big else
         f'<div style="margin-top: 6px; font-family: {SERIF}; font-size: 20px; line-height: 1.25; color: {WHITE}">{body}</div>')
    return (f'<div><div style="font-family: {SANS}; font-weight: 700; font-size: 14px; line-height: 1; letter-spacing: 0.24em; color: {SILVER}">{head}</div>{b}</div>')

front = f"""
<div style="position: absolute; left: 52px; top: 40px; width: {FW - 52 - 40}px; height: {FH - 80}px; box-sizing: border-box; border: 2px solid {SILVER}"></div>
<div style="position: absolute; left: 58px; top: 46px; width: {FW - 58 - 46}px; height: {FH - 92}px; box-sizing: border-box; border: 1px solid {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: 74px; width: {AW}px; display: flex; justify-content: space-between; align-items: baseline; font-family: {SANS}; font-weight: 700; font-size: 15px; letter-spacing: 0.22em; color: {SILVER}">
  <span>THE COMMITTEE TO SAVE THE SOUTH BRONX HOSPITAL</span><span>1990</span>
</div>
<div style="position: absolute; left: {L}px; top: 100px; width: {AW}px; height: 1px; background: {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: 116px; font-family: {SERIF}; font-style: italic; font-size: 32px; line-height: 1; color: {SILVER}">Souvenir Journal</div>
<div style="position: absolute; left: {L}px; top: 164px; width: {AW}px; font-family: {SANS}; font-weight: 700; font-size: 27px; line-height: 1; letter-spacing: 0.4em; color: {WHITE}; text-shadow: 0.6px 0.4px 0 rgba(243,241,232,0.35)">A NIGHT FOR THE</div>
<div style="position: absolute; left: {L - 5}px; top: 192px; width: {AW + 5}px; font-family: {SERIF}; font-weight: 600; font-size: 104px; line-height: 1; letter-spacing: -0.01em; color: {WHITE}; text-shadow: 0.8px 0.5px 0 rgba(243,241,232,0.35)">South Bronx</div>
<div style="position: absolute; left: {L}px; top: 300px; width: {AW}px; font-family: {SERIF}; font-style: italic; font-size: 25px; line-height: 1.2; color: {WHITE}">A benefit dinner to keep the hospital doors open.</div>
<img src="assets/hospital.png" alt="The hospital at night, with a limousine at the kerb" style="position: absolute; left: {L}px; top: {ART_TOP}px; width: {AW}px; height: {ART_H}px; display: block">
<div style="position: absolute; left: {L}px; top: {ART_TOP}px; width: {AW}px; height: {ART_H}px; box-sizing: border-box; border: 2px solid {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: {ART_TOP + ART_H + 22}px; width: {AW}px; display: grid; grid-template-columns: 1fr 1fr 1.05fr; gap: 28px">
  {cinfo('HOSTED BY', 'Mr. Frank White')}
  {cinfo('DINNER', 'Seven o&#8217;clock, black tie')}
  {cinfo('THE GOAL', '$16,000,000', True)}
</div>
<div style="position: absolute; left: {L}px; top: {ART_TOP + ART_H + 96}px; width: {AW}px; font-family: {SERIF}; font-style: italic; font-size: 19px; line-height: 1.3; color: {SILVER}">With the doctors, nurses and staff of the night shift, and every friend of the South Bronx.</div>
<div style="position: absolute; left: {L}px; top: 926px; width: {AW}px; height: 1px; background: {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: 940px; width: {AW}px; display: flex; justify-content: space-between; gap: 20px; font-family: {SANS}; font-size: 15px; line-height: 1.4; letter-spacing: 0.02em; color: {SILVER}">
  <span>The Grand Ballroom, Manhattan<br>Dinner $1,000 a plate. Tables of ten, $10,000.</span>
  <span style="text-align: right">Every dollar stays in the South Bronx.<br>Please keep this journal.</span>
</div>
"""

# ================= BACK: page 3 of the journal =================
BL, BR = 80, 760
BW = BR - BL

def head(t, top=0):
    return (f'<div style="margin-top: {top}px; display: flex; align-items: center; gap: 10px">'
            f'<span style="flex: none; font-family: {SANS}; font-weight: 700; font-size: 14px; letter-spacing: 0.24em; color: {GREEN}; {MIS}">{t}</span>'
            f'<span style="flex: 1; height: 1px; background: {GREEN}; {MIS}"></span></div>')

def dish(key, top=10):
    x = DISH[key]
    return (f'<div style="margin-top: {top}px">'
            f'<div style="font-family: {SERIF}; font-weight: 600; font-size: 23px; line-height: 1.1; color: {INK}">{esc(x["n"])}</div>'
            f'<div style="margin-top: 2px; font-family: {SERIF}; font-size: 16px; line-height: 1.3; color: {SOFT}; text-wrap: pretty">{esc(x["d"])} '
            f'<span style="font-style: italic; color: {GREEN}">{esc(x["note"])}</span></div></div>')

def extra(name, desc, top=8):
    return (f'<div style="margin-top: {top}px; font-family: {SERIF}; font-size: 16px; line-height: 1.3; color: {SOFT}">'
            f'<span style="font-weight: 600; font-size: 19px; color: {INK}">{name}</span>&nbsp; {desc}</div>')

def prog(time, what):
    return (f'<div style="display: flex; gap: 8px; padding: 3px 0; border-bottom: 1px solid rgba(28,29,26,0.3)">'
            f'<span style="flex: none; width: 46px; font-family: {SANS}; font-weight: 700; font-size: 15px; line-height: 1.4; color: {GREEN}">{time}</span>'
            f'<span style="font-family: {SERIF}; font-size: 16px; line-height: 1.32; color: {INK}">{what}</span></div>')

FILL = 0.70      # $11.2 million pledged when the journal went to press
def thermo(bw=176):
    fw = round(bw * FILL)
    ticks = ''
    for i, lab in enumerate(['', '4', '8', '12', '16']):
        x = 26 + round(bw * i / 4)
        ticks += f'<div style="position: absolute; left: {x - 1}px; top: 26px; width: 2px; height: 6px; background: {INK}"></div>'
        if lab:
            ticks += f'<div style="position: absolute; left: {x - 20}px; top: 33px; width: 40px; text-align: center; font-family: {SANS}; font-size: 13px; line-height: 1.1; color: {INK}">{lab}</div>'
    return f"""<div style="position: relative; width: {bw + 40}px; height: 50px">
      <div style="position: absolute; left: 20px; top: 6px; width: {bw + 12}px; height: 20px; box-sizing: border-box; border: 2px solid {INK}; border-left: none; border-radius: 0 10px 10px 0; background: {PAPER}"></div>
      <div style="position: absolute; left: 22px; top: 10px; width: {fw}px; height: 12px; background: {GREEN}; {MIS}"></div>
      <div style="position: absolute; left: 0; top: 0; width: 32px; height: 32px; box-sizing: border-box; border-radius: 50%; background: {GREEN}; {MIS}"></div>
      <div style="position: absolute; left: 0; top: 0; width: 32px; height: 32px; box-sizing: border-box; border-radius: 50%; border: 2px solid {INK}"></div>
      {ticks}
    </div>"""

# the Gold Pages: each ad came in camera-ready from whoever bought it
def ad(inner, style, span=1):
    return f'<div style="grid-column: span {span}; position: relative; box-sizing: border-box; height: 92px; {style}">{inner}</div>'

ads_row1 = (
  ad(f'<div style="font-family: {SCRIPT}; font-size: 30px; line-height: 1.05; text-align: center; color: {INK}">Compliments<br>of a Friend</div>',
     f'border: 4px double {INK}; display: flex; align-items: center; justify-content: center; padding: 4px'),
  ad(f'<div style="position: absolute; inset: 0; background: {GREEN}; {MIS}"></div>'
     f'<div style="position: absolute; inset: 0; border: 1px solid {INK}"></div>'
     f'<div style="position: relative; padding: 11px 12px 0; {MIS}"><div style="font-family: {SANS}; font-weight: 700; font-size: 23px; line-height: 1.02; color: {WHITE}">Next stop,<br>City Hall.</div>'
     f'<div style="margin-top: 5px; font-family: {SANS}; font-size: 13px; letter-spacing: 0.08em; color: #e3e9e0">FRIENDS DOWNTOWN</div></div>', ''),
  ad(f'<div style="font-family: {SLAB}; font-weight: 700; font-size: 14px; letter-spacing: 0.03em; color: {INK}">WELCOME HOME, FRANK!</div>'
     f'<div style="margin-top: 6px; font-family: {SLAB}; font-size: 16px; line-height: 1.22; color: {INK}">Jimmy Jump, Test Tube and the crew</div>',
     f'border: 3px solid {INK}; padding: 9px 10px 6px'),
  ad(f'<div style="font-family: {SERIF}; font-size: 16px; line-height: 1.25; color: {INK}">With thanks from the nurses and doctors of the night shift.</div>'
     f'<div style="margin-top: 4px; font-family: {SANS}; font-weight: 700; font-size: 13px; letter-spacing: 0.2em; color: {GREEN}; {MIS}">EMERGENCY ROOM</div>',
     f'border-top: 3px solid {INK}; border-bottom: 1px solid {INK}; padding: 7px 2px 4px'),
)
ads_row2 = (
  ad(f'<div style="font-family: {TYPE}; font-weight: 700; font-size: 15px; line-height: 1.15; color: {INK}">HOT FRIED CHICKEN</div>'
     f'<div style="margin-top: 4px; font-family: {TYPE}; font-size: 14px; line-height: 1.25; color: {INK}">Eat in. Take out.<br>Open late. Good luck!</div>',
     f'border: 1px dashed {INK}; padding: 9px 10px 4px'),
  ad(f'<div style="height: 1px; background: {INK}"></div><div style="height: 3px"></div><div style="height: 1px; background: {INK}"></div>'
     f'<div style="margin-top: 12px; text-align: center; font-family: {CINZEL}; font-weight: 400; font-size: 13px; letter-spacing: 0.24em; color: {INK}">WITH THE COMPLIMENTS OF</div>'
     f'<div style="margin-top: 5px; text-align: center; font-family: {CINZEL}; font-weight: 700; font-size: 24px; line-height: 1; letter-spacing: 0.08em; color: {INK}">COUNSEL TO THE COMMITTEE</div>'
     f'<div style="margin-top: 12px; height: 1px; background: {INK}"></div><div style="height: 3px"></div><div style="height: 1px; background: {INK}"></div>',
     'padding: 4px 6px 0', 2),
  ad(f'<div style="font-family: {SERIF}; font-style: italic; font-size: 17px; line-height: 1.22; color: {INK}">Tonight&#8217;s cheesecakes were baked in the Bronx.</div>'
     f'<div style="margin-top: 5px; font-family: {SANS}; font-size: 13px; letter-spacing: 0.06em; color: {SOFT}">A NEIGHBORHOOD BAKERY</div>',
     f'border-left: 4px solid {GREEN}; padding: 6px 4px 4px 12px'),
)

COMMITTEE = ('<b>Mr. Frank White</b>, Honorary Chairman &#183; Mrs. Dolores Rivera, Chairwoman &#183; Rev. Calvin Brooks &#183; '
             'Dr. Miriam Katz &#183; Mr. and Mrs. Hector Morales &#183; Ms. Angela Price &#183; Mr. Leon Feldman &#183; '
             'Mrs. Rose Washington &#183; Mr. and Mrs. Tommy Ng &#183; The Nurses&#8217; Auxiliary &#183; The Tenants of Fox Street')

back = f"""
<div style="position: absolute; left: {BL}px; top: 50px; width: {BW}px; display: flex; justify-content: space-between; align-items: baseline">
  <span style="font-family: {SANS}; font-weight: 700; font-size: 14px; letter-spacing: 0.24em; color: {GREEN}; {MIS}">PAGE 3</span>
  <span style="font-family: {SERIF}; font-style: italic; font-size: 16px; color: {SOFT}">A Night for the South Bronx</span>
</div>
<div style="position: absolute; left: {BL}px; top: 74px; width: {BW}px; height: 3px; background: {INK}"></div>

<div style="position: absolute; left: {BL}px; top: 88px; width: 222px">
  <div style="font-family: {SERIF}; font-weight: 600; font-size: 29px; line-height: 1; color: {INK}">The Evening</div>
  <div style="margin-top: 8px; border-top: 1px solid rgba(28,29,26,0.3)">
    {prog('7:00', 'Champagne reception')}
    {prog('8:00', 'Dinner is served')}
    {prog('9:30', 'A word from our host')}
    {prog('10:00', 'Pledges and coffee')}
  </div>
  <div style="margin-top: 12px; display: flex; justify-content: space-between; align-items: baseline">
    <span style="font-family: {SANS}; font-weight: 700; font-size: 14px; letter-spacing: 0.2em; color: {GREEN}; {MIS}">THE GOAL</span>
    <span style="font-family: {SERIF}; font-weight: 600; font-size: 19px; color: {INK}">$16,000,000</span>
  </div>
  <div style="margin-top: 6px">{thermo()}</div>
  <div style="margin-top: 0; font-family: {SERIF}; font-style: italic; font-size: 14px; line-height: 1.2; color: {SOFT}">Millions. Pledged at press time, $11,200,000.</div>
</div>
<div style="position: absolute; left: 320px; top: 90px; width: 186px">
  <div style="position: relative; width: 176px; height: 200px; border: 1px solid {INK}; padding: 4px; background: {PAPER}">
    <img src="assets/host-halftone.png" alt="Frank White" style="position: absolute; left: 4px; top: 4px; width: 176px; height: 200px; display: block">
  </div>
  <div style="margin-top: 5px; font-family: {SERIF}; font-style: italic; font-size: 14px; line-height: 1.2; color: {SOFT}">Our host, Frank White</div>
</div>
<div style="position: absolute; left: 524px; top: 88px; width: 236px">
  <div style="font-family: {SANS}; font-weight: 700; font-size: 14px; letter-spacing: 0.24em; color: {GREEN}; {MIS}">FROM THE HOST</div>
  <div style="margin-top: 6px; font-family: {SERIF}; font-size: 16px; line-height: 1.36; color: {INK}">The city cut our hospital out of its budget. Tonight we put it back. Every dollar you pledge stays right here in the South Bronx, with the people who need it.</div>
  <div style="margin-top: 4px; font-family: {SERIF}; font-style: italic; font-size: 19px; color: {INK}">F.W.</div>
</div>

<div style="position: absolute; left: {BL}px; top: 324px; width: {BW}px; box-sizing: border-box; border-top: 1px solid {INK}; border-bottom: 1px solid {INK}; padding: 7px 0 8px">
  <div style="font-family: {SANS}; font-weight: 700; font-size: 13px; letter-spacing: 0.26em; color: {INK}; text-align: center">THE BENEFIT COMMITTEE</div>
  <div style="margin-top: 4px; font-family: {SERIF}; font-size: 14px; line-height: 1.38; color: {INK}; text-align: center; text-wrap: balance">{COMMITTEE}</div>
</div>

<div style="position: absolute; left: {BL}px; top: 412px; width: {BW}px; height: 34px">
  <div style="position: absolute; inset: 0; background: {GREEN}; {MIS}"></div>
  <div style="position: absolute; inset: 0; border: 1px solid {INK}"></div>
  <div style="position: absolute; left: 14px; right: 14px; top: 0; height: 34px; display: flex; align-items: center; justify-content: space-between; {MIS}">
    <span style="font-family: {SANS}; font-weight: 700; font-size: 18px; letter-spacing: 0.3em; color: {WHITE}">THE DINNER</span>
    <span style="font-family: {SERIF}; font-style: italic; font-size: 16px; color: #e3e9e0">Served at eight in the Grand Ballroom</span>
  </div>
</div>
<div style="position: absolute; left: {BL}px; top: 458px; width: 326px">
  {head('THE RECEPTION')}
  {dish("Plaza suite champagne cocktails", 6)}
  {dish("Chinatown dumplings")}
  {head('DESSERT', 16)}
  {dish("New York cheesecake", 6)}
</div>
<div style="position: absolute; left: 434px; top: 458px; width: 326px">
  {head('AT TABLE')}
  {dish("Plaza Hotel prawn cocktail", 6)}
  {dish("Frank's Plaza steak dinner")}
  {extra('Creamed spinach', 'for the table.')}
  {head('AFTER DINNER', 16)}
  {extra('Coffee', 'regular or decaf, and tea.', 6)}
  {extra('Cognac', 'from the bar. Open bar from seven.', 4)}
</div>

<div style="position: absolute; left: {BL}px; top: 800px; width: {BW}px; display: flex; align-items: center; gap: 10px">
  <span style="flex: none; font-family: {SANS}; font-weight: 700; font-size: 13px; letter-spacing: 0.3em; color: {INK}; border: 1px solid {INK}; padding: 1px 6px 0">GOLD PAGE</span>
  <span style="flex: 1; height: 3px; background: {INK}"></span>
  <span style="flex: none; font-family: {SERIF}; font-style: italic; font-size: 14px; color: {SOFT}">Our thanks to every advertiser</span>
</div>
<div style="position: absolute; left: {BL}px; top: 822px; width: {BW}px; display: grid; grid-template-columns: 0.9fr 1fr 1.2fr 1.2fr; gap: 9px 10px">
  {''.join(ads_row1)}
  {''.join(ads_row2)}
</div>
"""

TITLES = {'front': 'South Bronx benefit journal, cover', 'back': 'South Bronx benefit journal, page 3'}
faces = (('front', front, COVER, WHITE, 0.30), ('back', back, PAPER, INK, 0.7))
for face, inner, bg, col, gop in faces:
    body = root(inner, face, bg, col, gop)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "plazanight", "fn": "fmtPlazaNight", "faces": ["front.html", "back.html"], "names": ["Cover", "Page 3"],
        "mm": [215.9, 279.4], "fonts": FONTS,
        "fams": ["News Cycle", "Libre Bodoni", "Cinzel", "Pinyon Script", "Courier Prime", "Arvo"],
        "phone": {"disp": "'Libre Bodoni',serif", "title": "'Libre Bodoni',serif", "name": "'Libre Bodoni',serif",
                  "body": "'Libre Bodoni',serif", "price": "'News Cycle',sans-serif", "note": "'Libre Bodoni',serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))
open(os.path.join(D, 'plazanight.labels.json'), 'w').write(json.dumps({"King of New York (1990)": DISH}, indent=1, ensure_ascii=False))
print('built')
