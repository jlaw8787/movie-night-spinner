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
  "Plaza suite champagne cocktails": {"n": "Champagne cocktails", "d": "A sugar cube soaked in bitters, a splash of cognac, topped with chilled brut and a twist of lemon.", "note": "To the doors staying open."},
  "Chinatown dumplings": {"n": "Chinatown dumplings", "d": "Pork and chive, pan-fried until the bottoms crisp. Black vinegar and chili oil for dipping. No MSG.", "note": "Sent up from downtown."},
  "Plaza Hotel prawn cocktail": {"n": "Shrimp cocktail", "d": "Jumbo shrimp poached and iced, hung on a glass of shredded iceberg. Red sauce sharp with horseradish, lemon.", "note": "On ice when you sit down."},
  "Frank's Plaza steak dinner": {"n": "Rib eye au poivre", "d": "Seared and rested, cracked pepper sauce finished with brandy and cream. Pommes frites.", "note": "Medium rare unless you say."},
  "New York cheesecake": {"n": "New York cheesecake", "d": "Rich and dense, sour cream and lemon zest beaten through, baked slow in a water bath on a buttered crumb crust.", "note": "Baked in the Bronx."},
}

# ---------------- FRONT: the journal cover ----------------
L, R = 72, 760          # left margin clears the spine and staples
AW = R - L
ART_TOP = 486
ART_H = round(AW * 640 / 1440)
k = AW / 1440
canopy = (L + round(590 * k), ART_TOP + round(488 * k), round(260 * k), round(32 * k))

def cinfo(head, body, big=False):
    b = (f'<div style="margin-top: 8px; font-family: {SANS}; font-weight: 600; font-size: 30px; line-height: 1; letter-spacing: 0.02em; color: {WHITE}">{body}</div>' if big else
         f'<div style="margin-top: 8px; font-family: {SERIF}; font-size: 19px; line-height: 1.3; color: {WHITE}">{body}</div>')
    return (f'<div><div style="font-family: {SANS}; font-weight: 600; font-size: 14px; line-height: 1; letter-spacing: 0.28em; color: {SILVER}">{head}</div>{b}</div>')

front = f"""
<div style="position: absolute; left: {L}px; top: 60px; width: {AW}px; display: flex; justify-content: space-between; align-items: baseline; font-family: {SANS}; font-weight: 600; font-size: 15px; letter-spacing: 0.32em; color: {SILVER}">
  <span>SOUVENIR JOURNAL</span><span>1990</span>
</div>
<div style="position: absolute; left: {L}px; top: 90px; width: {AW}px; height: 2px; background: {SILVER}"></div>
<div style="position: absolute; left: {L - 5}px; top: 132px; width: {AW + 5}px; font-family: {SANS}; font-weight: 700; font-size: 100px; line-height: 0.9; letter-spacing: -0.005em; color: {WHITE}">A NIGHT<br>FOR THE<br><span style="color: {SILVER}">SOUTH BRONX</span></div>
<div style="position: absolute; left: {L}px; top: 420px; width: {AW}px; font-family: {SERIF}; font-style: italic; font-size: 27px; line-height: 1.2; color: {WHITE}">A benefit dinner to keep the hospital open.</div>
<img src="assets/hospital.png" alt="The hospital at night" style="position: absolute; left: {L}px; top: {ART_TOP}px; width: {AW}px; height: {ART_H}px; display: block">
<div style="position: absolute; left: {canopy[0]}px; top: {canopy[1]}px; width: {canopy[2]}px; height: {canopy[3]}px; display: flex; align-items: center; justify-content: center; font-family: {SANS}; font-weight: 700; font-size: 12px; line-height: 1; letter-spacing: 0.22em; color: {COVER}">HOSPITAL</div>
<div style="position: absolute; left: {L}px; top: {ART_TOP + ART_H + 34}px; width: {AW}px; display: grid; grid-template-columns: 1.05fr 1fr 1.05fr; gap: 30px">
  {cinfo('HOSTED BY', 'Mr. Frank White')}
  {cinfo('DINNER', 'Seven o&#8217;clock<br>Black tie')}
  {cinfo('THE GOAL', '$16,000,000', True)}
</div>
<div style="position: absolute; left: {L}px; top: 948px; width: {AW}px; height: 1px; background: {SILVER}"></div>
<div style="position: absolute; left: {L}px; top: 962px; width: 560px; font-family: {SANS}; font-size: 14px; line-height: 1.4; letter-spacing: 0.04em; color: {SILVER}">The Committee to Save the South Bronx Hospital.<br>Every dollar goes to keeping the doors open.</div>
"""

# ---------------- BACK: the dinner page inside the journal ----------------
BL, BR = 80, 760
BW = BR - BL
def head(t, top=0):
    return (f'<div style="margin-top: {top}px; display: flex; align-items: center; gap: 12px">'
            f'<span style="flex: none; font-family: {SANS}; font-weight: 600; font-size: 15px; letter-spacing: 0.3em; color: {GREEN}">{t}</span>'
            f'<span style="flex: 1; height: 1px; background: {GREEN}"></span></div>')

def dish(key, top=14):
    x = DISH[key]
    return (f'<div style="margin-top: {top}px">'
            f'<div style="font-family: {SANS}; font-weight: 600; font-size: 25px; line-height: 1.1; color: {INK}">{esc(x["n"])}</div>'
            f'<div style="margin-top: 3px; font-family: {SERIF}; font-size: 17px; line-height: 1.34; color: {SOFT}; text-wrap: pretty">{esc(x["d"])}</div>'
            f'<div style="margin-top: 3px; font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.25; color: {GREEN}">{esc(x["note"])}</div></div>')

def extra(name, desc, top=12):
    return (f'<div style="margin-top: {top}px; font-family: {SERIF}; font-size: 17px; line-height: 1.34; color: {SOFT}">'
            f'<span style="font-family: {SANS}; font-weight: 600; font-size: 19px; color: {INK}">{name}</span>&nbsp;&nbsp;{desc}</div>')

def prog(time, what):
    return (f'<div style="display: flex; gap: 14px; padding: 5px 0; border-bottom: 1px solid rgba(28,29,26,0.28)">'
            f'<span style="flex: none; width: 128px; font-family: {SANS}; font-weight: 600; font-size: 15px; line-height: 1.45; letter-spacing: 0.08em; color: {GREEN}">{time}</span>'
            f'<span style="font-family: {SERIF}; font-size: 17px; line-height: 1.35; color: {INK}">{what}</span></div>')

# pledge thermometer, built from divs
TH_TOP, TH_H = 0, 236
FILL = 0.70                 # $11.2 million pledged when the journal went to press
def thermo():
    ticks = ''
    for i, lab in enumerate(['$16 million', '$12 million', '$8 million', '$4 million']):
        y = round(TH_H * i / 4)
        ticks += (f'<div style="position: absolute; left: 34px; top: {y}px; width: 12px; height: 2px; background: {INK}"></div>'
                  f'<div style="position: absolute; left: 54px; top: {y - 10}px; font-family: {SANS}; font-weight: {600 if i == 0 else 500}; font-size: 15px; line-height: 1.3; color: {INK}; white-space: nowrap">{lab}</div>')
    fh = round(TH_H * FILL)
    return f"""<div style="position: relative; width: 236px; height: {TH_H + 44}px">
      <div style="position: absolute; left: 6px; top: 0; width: 22px; height: {TH_H}px; box-sizing: border-box; border: 2px solid {INK}; border-bottom: none; border-radius: 11px 11px 0 0; background: {PAPER}"></div>
      <div style="position: absolute; left: 10px; top: {TH_H - fh}px; width: 14px; height: {fh + 6}px; background: {GREEN}"></div>
      <div style="position: absolute; left: 0; top: {TH_H - 6}px; width: 34px; height: 34px; box-sizing: border-box; border-radius: 50%; border: 2px solid {INK}; background: {GREEN}"></div>
      <div style="position: absolute; left: 34px; top: {TH_H - fh}px; width: 12px; height: 2px; background: {GREEN}"></div>
      <div style="position: absolute; left: 54px; top: {TH_H - fh - 10}px; font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.25; color: {GREEN}; white-space: nowrap">Pledged at press time</div>
      {ticks}
    </div>"""

def ad(inner, style):
    return f'<div style="box-sizing: border-box; height: 132px; {style}">{inner}</div>'

ads = (
  ad(f'<div style="font-family: {SERIF}; font-style: italic; font-size: 26px; line-height: 1.1; text-align: center">Compliments<br>of a Friend</div>',
     f'border: 4px double {INK}; display: flex; align-items: center; justify-content: center; padding: 12px'),
  ad(f'<div style="font-family: {SANS}; font-weight: 700; font-size: 25px; line-height: 1.05; color: {WHITE}">Next stop,<br>City Hall.</div>'
     f'<div style="margin-top: 10px; font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.2; color: #dfe6dc">Your friends downtown</div>',
     f'background: {GREEN}; padding: 18px 18px 14px'),
  ad(f'<div style="font-family: {SANS}; font-weight: 600; font-size: 13px; letter-spacing: 0.24em; color: {GREEN}">WELCOME HOME, FRANK</div>'
     f'<div style="margin-top: 8px; font-family: {SANS}; font-weight: 500; font-size: 19px; line-height: 1.22; color: {INK}">Jimmy Jump, Test Tube and the crew</div>',
     f'border: 2px solid {INK}; padding: 16px 16px 12px'),
  ad(f'<div style="font-family: {SERIF}; font-size: 18px; line-height: 1.3; color: {INK}">With thanks from the nurses and doctors of the night shift.</div>'
     f'<div style="margin-top: 8px; font-family: {SANS}; font-weight: 600; font-size: 13px; letter-spacing: 0.2em; color: {GREEN}">EMERGENCY ROOM</div>',
     f'border-top: 3px solid {INK}; border-bottom: 1px solid {INK}; padding: 14px 4px 10px'),
)

back = f"""
<div style="position: absolute; left: {BL}px; top: 54px; width: {BW}px; display: flex; justify-content: space-between; align-items: baseline">
  <span style="font-family: {SANS}; font-weight: 600; font-size: 14px; letter-spacing: 0.3em; color: {GREEN}">PAGE 3</span>
  <span style="font-family: {SERIF}; font-style: italic; font-size: 16px; color: {SOFT}">A Night for the South Bronx</span>
</div>
<div style="position: absolute; left: {BL}px; top: 80px; width: {BW}px; height: 3px; background: {INK}"></div>

<div style="position: absolute; left: {BL}px; top: 100px; width: 420px">
  <div style="font-family: {SANS}; font-weight: 700; font-size: 44px; line-height: 1; color: {INK}">The Evening</div>
  <div style="margin-top: 12px; border-top: 1px solid rgba(28,29,26,0.28)">
    {prog('7:00', 'Champagne reception')}
    {prog('8:00', 'Dinner is served')}
    {prog('9:30', 'A word from our host')}
    {prog('10:00', 'Pledges, coffee and dancing')}
  </div>
  {head('THE RECEPTION', 26)}
  {dish("Plaza suite champagne cocktails", 10)}
  {dish("Chinatown dumplings")}
  {head('DINNER', 24)}
  {dish("Plaza Hotel prawn cocktail", 10)}
  {dish("Frank's Plaza steak dinner")}
  {extra('Creamed spinach', 'for the table.', 10)}
  {head('DESSERT', 24)}
  {dish("New York cheesecake", 10)}
  {extra('Coffee', 'regular or decaf, and tea.', 10)}
</div>

<div style="position: absolute; left: 528px; top: 104px; width: 232px">
  <div style="position: relative; width: 220px; height: 210px; border: 1px solid {INK}; padding: 5px; background: {PAPER}">
    <img src="assets/host-halftone.png" alt="Frank White" style="position: absolute; left: 5px; top: 5px; width: 220px; height: 210px; display: block">
  </div>
  <div style="margin-top: 8px; font-family: {SERIF}; font-style: italic; font-size: 16px; line-height: 1.25; color: {SOFT}">Our host, Frank White</div>
  <div style="margin-top: 20px; font-family: {SANS}; font-weight: 600; font-size: 14px; letter-spacing: 0.26em; color: {GREEN}">FROM THE HOST</div>
  <div style="margin-top: 8px; font-family: {SERIF}; font-size: 17px; line-height: 1.38; color: {INK}">This year the city cut our hospital from the budget. Tonight we put it back. Sixteen million dollars keeps the doors open in the South Bronx, and every dollar you pledge stays there.</div>
  <div style="margin-top: 8px; font-family: {SERIF}; font-style: italic; font-size: 18px; color: {INK}">F.W.</div>
  <div style="margin-top: 22px; font-family: {SANS}; font-weight: 600; font-size: 14px; letter-spacing: 0.26em; color: {GREEN}">THE GOAL</div>
  <div style="margin-top: 14px">{thermo()}</div>
</div>

<div style="position: absolute; left: {BL}px; top: 0; width: {BW}px; height: 0" id="adsanchor"></div>
<div style="position: absolute; left: {BL}px; top: 846px; width: {BW}px; display: grid; grid-template-columns: 1fr 1fr 1.15fr 1.25fr; gap: 14px">
  {''.join(ads)}
</div>
<div style="position: absolute; left: {BL}px; top: 992px; width: {BW}px; border-top: 1px solid {INK}; padding-top: 8px; display: flex; justify-content: space-between; font-family: {SANS}; font-size: 13px; line-height: 1.3; color: {SOFT}">
  <span>Dinner $1,000 a plate. Tables of ten, $10,000.</span><span>Pledge cards at every table.</span>
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
