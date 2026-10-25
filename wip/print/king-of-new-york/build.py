"""Builds the benefit journal menu for King of New York (1990).
The object: the souvenir journal from the dinner Frank White holds to raise the $16 million that keeps
the South Bronx hospital open. Printed by the benefit committee on a quick turnaround, saddle-stitched,
US Letter (8.5 x 11 in). The cover is green stock printed in silver and white with a drawing of the
hospital at night; the page shown inside is plain white offset printed black plus one green, carrying
the program, the dinner, a word from the host with his press photo, a pledge thermometer and the
small paid ads every New York benefit journal fills its back pages with.
Run paint.py first for the assets. Writes front.html / back.html (full pages), the .body.html parts,
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
FONTS = ('family=Jost:wght@400;500;600;700'
         '&family=Libre+Bodoni:ital,wght@0,400;0,600;1,400;1,600')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
SANS = "'Jost', 'Futura', 'Century Gothic', sans-serif"
SERIF = "'Libre Bodoni', 'Bodoni 72', 'Didot', serif"

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
  "Chinatown dumplings": {"n": "Chinatown dumplings", "d": "Pork and chive, pan-fried until the bottoms crisp, with black vinegar and chili oil. No MSG.", "note": "Sent up from downtown."},
  "Plaza Hotel prawn cocktail": {"n": "Shrimp cocktail", "d": "Jumbo shrimp poached and iced, hung on a glass of shredded iceberg. Red sauce sharp with horseradish, lemon.", "note": "On ice when you sit down."},
  "Frank's Plaza steak dinner": {"n": "Rib eye au poivre", "d": "Seared and rested, cracked pepper sauce finished with brandy and cream. Pommes frites.", "note": "Medium rare unless you say."},
  "New York cheesecake": {"n": "New York cheesecake", "d": "Rich and dense, sour cream and lemon zest beaten through, baked slow in a water bath on a buttered crumb crust.", "note": "Baked in the Bronx."},
}

# ---------------- FRONT: the journal cover ----------------
# Green cover stock, two inks (silver, white). A ruled frame, the title set in phototype caps,
# and the line cut of the hospital at night (assets/hospital.png from linecut.py).
L, R = 76, 752
AW = R - L
ART_TOP, ART_H = 370, round(AW * 880 / 1360)

def cinfo(head, body, big=False):
    b = (f'<div style="margin-top: 7px; font-family: {SANS}; font-weight: 600; font-size: 30px; line-height: 1; color: {WHITE}">{body}</div>' if big else
         f'<div style="margin-top: 7px; font-family: {SERIF}; font-size: 19px; line-height: 1.28; color: {WHITE}">{body}</div>')
    return (f'<div><div style="font-family: {SANS}; font-weight: 600; font-size: 13px; line-height: 1; letter-spacing: 0.26em; color: {SILVER}">{head}</div>{b}</div>')

front = f"""
<div style="position: absolute; left: 52px; top: 40px; width: {FW - 52 - 40}px; height: {FH - 80}px; box-sizing: border-box; border: 2px solid {SILVER}"></div>
<div style="position: absolute; left: 58px; top: 46px; width: {FW - 58 - 46}px; height: {FH - 92}px; box-sizing: border-box; border: 1px solid {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: 76px; width: {AW}px; display: flex; justify-content: space-between; align-items: baseline; font-family: {SANS}; font-weight: 600; font-size: 14px; letter-spacing: 0.26em; color: {SILVER}">
  <span>THE COMMITTEE TO SAVE THE SOUTH BRONX HOSPITAL</span><span>1990</span>
</div>
<div style="position: absolute; left: {L}px; top: 104px; width: {AW}px; height: 1px; background: {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: 122px; font-family: {SERIF}; font-style: italic; font-size: 32px; line-height: 1; color: {SILVER}">Souvenir Journal</div>
<div style="position: absolute; left: {L}px; top: 176px; width: {AW}px; font-family: {SANS}; font-weight: 600; font-size: 26px; line-height: 1; letter-spacing: 0.42em; color: {WHITE}; text-shadow: 0.6px 0.4px 0 rgba(243,241,232,0.35)">A NIGHT FOR THE</div>
<div style="position: absolute; left: {L - 5}px; top: 206px; width: {AW + 5}px; font-family: {SERIF}; font-weight: 600; font-size: 104px; line-height: 1; letter-spacing: -0.01em; color: {WHITE}; text-shadow: 0.8px 0.5px 0 rgba(243,241,232,0.35)">South Bronx</div>
<div style="position: absolute; left: {L}px; top: 318px; width: {AW}px; font-family: {SERIF}; font-style: italic; font-size: 24px; line-height: 1.2; color: {WHITE}">A benefit dinner to keep the hospital doors open.</div>
<img src="assets/hospital.png" alt="The hospital at night, with a limousine at the kerb" style="position: absolute; left: {L}px; top: {ART_TOP}px; width: {AW}px; height: {ART_H}px; display: block">
<div style="position: absolute; left: {L}px; top: {ART_TOP}px; width: {AW}px; height: {ART_H}px; box-sizing: border-box; border: 2px solid {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: {ART_TOP + ART_H + 22}px; width: {AW}px; display: grid; grid-template-columns: 1fr 1fr 1.05fr; gap: 28px">
  {cinfo('HOSTED BY', 'Mr. Frank White')}
  {cinfo('DINNER', 'Seven o&#8217;clock, black tie')}
  {cinfo('THE GOAL', '$16,000,000', True)}
</div>
<div style="position: absolute; left: {L}px; top: 920px; width: {AW}px; height: 1px; background: {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: 934px; width: {AW}px; display: flex; justify-content: space-between; gap: 20px; font-family: {SANS}; font-size: 14px; line-height: 1.45; letter-spacing: 0.03em; color: {SILVER}">
  <span>The Grand Ballroom, Manhattan<br>Dinner $1,000 a plate. Tables of ten, $10,000.</span>
  <span style="text-align: right">Every dollar stays in the South Bronx.<br>Please keep this journal.</span>
</div>
"""

# ---------------- BACK: page 3 of the journal, the evening and the dinner ----------------
BL, BR = 80, 760
BW = BR - BL

def head(t, top=0):
    return (f'<div style="margin-top: {top}px; display: flex; align-items: center; gap: 10px">'
            f'<span style="flex: none; font-family: {SANS}; font-weight: 600; font-size: 14px; letter-spacing: 0.28em; color: {GREEN}">{t}</span>'
            f'<span style="flex: 1; height: 1px; background: {GREEN}"></span></div>')

def dish(key, top=12):
    x = DISH[key]
    return (f'<div style="margin-top: {top}px">'
            f'<div style="font-family: {SANS}; font-weight: 600; font-size: 23px; line-height: 1.1; color: {INK}">{esc(x["n"])}</div>'
            f'<div style="margin-top: 2px; font-family: {SERIF}; font-size: 16px; line-height: 1.32; color: {SOFT}; text-wrap: pretty">{esc(x["d"])}</div>'
            f'<div style="margin-top: 2px; font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.25; color: {GREEN}">{esc(x["note"])}</div></div>')

def extra(name, desc, top=10):
    return (f'<div style="margin-top: {top}px; font-family: {SERIF}; font-size: 16px; line-height: 1.32; color: {SOFT}">'
            f'<span style="font-family: {SANS}; font-weight: 600; font-size: 19px; color: {INK}">{name}</span>&nbsp; {desc}</div>')

def prog(time, what):
    return (f'<div style="display: flex; gap: 10px; padding: 4px 0; border-bottom: 1px solid rgba(28,29,26,0.3)">'
            f'<span style="flex: none; width: 50px; font-family: {SANS}; font-weight: 600; font-size: 15px; line-height: 1.4; color: {GREEN}">{time}</span>'
            f'<span style="font-family: {SERIF}; font-size: 16px; line-height: 1.32; color: {INK}">{what}</span></div>')

FILL = 0.70      # $11.2 million pledged when the journal went to press
def thermo():
    bw = 430
    fw = round(bw * FILL)
    ticks = ''
    for i, lab in enumerate(['', '$4 million', '$8 million', '$12 million', '$16 million']):
        x = 26 + round(bw * i / 4)
        ticks += f'<div style="position: absolute; left: {x - 1}px; top: 28px; width: 2px; height: 8px; background: {INK}"></div>'
        if lab:
            ticks += f'<div style="position: absolute; left: {x - 60}px; top: 38px; width: 120px; text-align: center; font-family: {SANS}; font-weight: 500; font-size: 13px; line-height: 1.2; color: {INK}">{lab}</div>'
    return f"""<div style="position: relative; width: {bw + 40}px; height: 56px">
      <div style="position: absolute; left: 20px; top: 6px; width: {bw + 12}px; height: 22px; box-sizing: border-box; border: 2px solid {INK}; border-left: none; border-radius: 0 11px 11px 0; background: {PAPER}"></div>
      <div style="position: absolute; left: 22px; top: 10px; width: {fw}px; height: 14px; background: {GREEN}"></div>
      <div style="position: absolute; left: 0; top: 0; width: 34px; height: 34px; box-sizing: border-box; border-radius: 50%; border: 2px solid {INK}; background: {GREEN}"></div>
      <div style="position: absolute; left: {22 + fw - 1}px; top: -2px; width: 2px; height: 30px; background: {GREEN}"></div>
      {ticks}
    </div>"""

def ad(inner, style):
    return f'<div style="box-sizing: border-box; height: 100px; {style}">{inner}</div>'

ads = (
  ad(f'<div style="font-family: {SERIF}; font-style: italic; font-size: 23px; line-height: 1.1; text-align: center">Compliments<br>of a Friend</div>',
     f'border: 4px double {INK}; display: flex; align-items: center; justify-content: center; padding: 8px'),
  ad(f'<div style="font-family: {SANS}; font-weight: 700; font-size: 21px; line-height: 1.02; color: {WHITE}">Next stop,<br>City Hall.</div>'
     f'<div style="margin-top: 7px; font-family: {SERIF}; font-style: italic; font-size: 14px; line-height: 1.2; color: #dfe6dc">Friends downtown</div>',
     f'background: {GREEN}; padding: 14px 12px 8px'),
  ad(f'<div style="font-family: {SANS}; font-weight: 600; font-size: 12px; letter-spacing: 0.05em; color: {GREEN}; white-space: nowrap">WELCOME HOME, FRANK</div>'
     f'<div style="margin-top: 6px; font-family: {SANS}; font-weight: 500; font-size: 16px; line-height: 1.22; color: {INK}">Jimmy Jump, Test Tube and the crew</div>',
     f'border: 2px solid {INK}; padding: 12px 12px 8px'),
  ad(f'<div style="font-family: {SERIF}; font-size: 16px; line-height: 1.28; color: {INK}">With thanks from the nurses and doctors of the night shift.</div>'
     f'<div style="margin-top: 5px; font-family: {SANS}; font-weight: 600; font-size: 12px; letter-spacing: 0.2em; color: {GREEN}">EMERGENCY ROOM</div>',
     f'border-top: 3px solid {INK}; border-bottom: 1px solid {INK}; padding: 9px 2px 6px'),
)

back = f"""
<div style="position: absolute; left: {BL}px; top: 52px; width: {BW}px; display: flex; justify-content: space-between; align-items: baseline">
  <span style="font-family: {SANS}; font-weight: 600; font-size: 13px; letter-spacing: 0.28em; color: {GREEN}">PAGE 3</span>
  <span style="font-family: {SERIF}; font-style: italic; font-size: 16px; color: {SOFT}">A Night for the South Bronx</span>
</div>
<div style="position: absolute; left: {BL}px; top: 76px; width: {BW}px; height: 3px; background: {INK}"></div>

<div style="position: absolute; left: {BL}px; top: 94px; width: 240px">
  <div style="font-family: {SANS}; font-weight: 700; font-size: 31px; line-height: 1; color: {INK}">The Evening</div>
  <div style="margin-top: 10px; border-top: 1px solid rgba(28,29,26,0.3)">
    {prog('7:00', 'Champagne reception')}
    {prog('8:00', 'Dinner is served')}
    {prog('9:30', 'A word from our host')}
    {prog('10:00', 'Pledges and coffee')}
  </div>
</div>
<div style="position: absolute; left: 342px; top: 96px; width: 184px">
  <div style="position: relative; width: 172px; height: 164px; border: 1px solid {INK}; padding: 5px; background: {PAPER}">
    <img src="assets/host-halftone.png" alt="Frank White" style="position: absolute; left: 5px; top: 5px; width: 172px; height: 164px; display: block">
  </div>
  <div style="margin-top: 6px; font-family: {SERIF}; font-style: italic; font-size: 15px; line-height: 1.2; color: {SOFT}">Our host, Frank White</div>
</div>
<div style="position: absolute; left: 546px; top: 94px; width: 214px">
  <div style="font-family: {SANS}; font-weight: 600; font-size: 13px; letter-spacing: 0.26em; color: {GREEN}">FROM THE HOST</div>
  <div style="margin-top: 8px; font-family: {SERIF}; font-size: 16px; line-height: 1.38; color: {INK}">The city cut our hospital out of its budget. Tonight we put it back. Every dollar you pledge stays right here in the South Bronx.</div>
  <div style="margin-top: 6px; font-family: {SERIF}; font-style: italic; font-size: 19px; color: {INK}">F.W.</div>
</div>

<div style="position: absolute; left: {BL}px; top: 316px; width: {BW}px; height: 38px; background: {GREEN}; display: flex; align-items: center; justify-content: space-between; padding: 0 14px; box-sizing: border-box">
  <span style="font-family: {SANS}; font-weight: 700; font-size: 19px; letter-spacing: 0.3em; color: {WHITE}">THE DINNER</span>
  <span style="font-family: {SERIF}; font-style: italic; font-size: 16px; color: #e3e9e0">Served at eight in the Grand Ballroom</span>
</div>
<div style="position: absolute; left: {BL}px; top: 368px; width: 326px">
  {head('THE RECEPTION')}
  {dish("Plaza suite champagne cocktails", 8)}
  {dish("Chinatown dumplings")}
  {head('DESSERT', 20)}
  {dish("New York cheesecake", 8)}
</div>
<div style="position: absolute; left: 434px; top: 368px; width: 326px">
  {head('AT TABLE')}
  {dish("Plaza Hotel prawn cocktail", 8)}
  {dish("Frank's Plaza steak dinner")}
  {extra('Creamed spinach', 'for the table.', 10)}
  {head('AFTER DINNER', 20)}
  {extra('Coffee', 'regular or decaf, and tea.', 8)}
  {extra('Cognac', 'from the bar.', 6)}
  {extra('Open bar', 'from seven o&#8217;clock.', 6)}
</div>

<div style="position: absolute; left: {BL}px; top: 822px; width: {BW}px; display: flex; align-items: flex-start; gap: 18px">
  <div style="flex: none; width: 150px; padding-top: 2px">
    <div style="font-family: {SANS}; font-weight: 600; font-size: 13px; letter-spacing: 0.26em; color: {GREEN}">THE GOAL</div>
    <div style="margin-top: 4px; font-family: {SANS}; font-weight: 700; font-size: 22px; line-height: 1; color: {INK}">$16,000,000</div>
  </div>
  {thermo()}
</div>
<div style="position: absolute; left: 726px; top: 828px; width: 34px; font-family: {SERIF}; font-style: italic; font-size: 13px; line-height: 1.15; color: {GREEN}; text-align: right"></div>

<div style="position: absolute; left: {BL}px; top: 888px; width: {BW}px; display: grid; grid-template-columns: 0.88fr 1.02fr 1.28fr 1.2fr; gap: 12px">
  {''.join(ads)}
</div>
<div style="position: absolute; left: {BL}px; top: 996px; width: {BW}px; display: flex; justify-content: space-between; font-family: {SANS}; font-size: 13px; line-height: 1.2; color: {SOFT}">
  <span>Pledged at press time: $11,200,000.</span><span>Pledge cards at every table.</span>
</div>
"""

TITLES = {'front': 'South Bronx benefit journal, cover', 'back': 'South Bronx benefit journal, dinner page'}
faces = (('front', front, COVER, WHITE, 0.30), ('back', back, PAPER, INK, 0.7))
for face, inner, bg, col, gop in faces:
    body = root(inner, face, bg, col, gop)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "plazanight", "fn": "fmtPlazaNight", "faces": ["front.html", "back.html"], "names": ["Cover", "Dinner page"],
        "mm": [215.9, 279.4], "fonts": FONTS, "fams": ["Jost", "Libre Bodoni"],
        "phone": {"disp": "'Jost',sans-serif", "title": "'Jost',sans-serif", "name": "'Jost',sans-serif",
                  "body": "'Libre Bodoni',serif", "price": "'Jost',sans-serif", "note": "'Libre Bodoni',serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))
open(os.path.join(D, 'plazanight.labels.json'), 'w').write(json.dumps({"King of New York (1990)": DISH}, indent=1, ensure_ascii=False))
print('built')
