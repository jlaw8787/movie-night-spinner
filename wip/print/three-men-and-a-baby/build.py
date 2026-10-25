"""Builds the loft supper sheet (Three Men and a Baby, 1987).
The object: one diazo blueline print of a drawing Peter, the architect, lettered on his
drafting table in the loft once the bassinet turned up at the front door. A plan of the
loft, a supper schedule, general notes and a title block with the revisions, run off on
the office print machine. ANSI B (tabloid) landscape, 11 x 17 in, single sided, no fold.
Writes sheet.html (full page), sheet.body.html, film.json and loftsupper.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 1632, 1056                       # 17 x 11 in at 96 dpi
PAPER = '#efeee6'
INK = '#2c3a8f'
INK2 = 'rgba(44,58,143,0.86)'
FONTS = 'family=Architects+Daughter&family=Barlow+Condensed:wght@500;600;700'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
HAND = "'Architects Daughter', 'Comic Sans MS', cursive"
PRE = "'Barlow Condensed', 'Arial Narrow', sans-serif"

def esc(s): return s.replace('&', '&amp;')

def at(x, y, html, w=None, align='left', extra=''):
    ww = f' width: {w}px;' if w else ''
    return f'<div style="position: absolute; left: {x}px; top: {y}px;{ww} text-align: {align}; {extra}">{html}</div>'

def bubble(cx, cy, txt, r=13, size=15, bg=PAPER):
    return (f'<div style="position: absolute; left: {cx - r}px; top: {cy - r}px; width: {2 * r}px; height: {2 * r}px; '
            f'border: 1.6px solid {INK}; border-radius: 50%; box-sizing: border-box; background: {bg}; display: flex; '
            f'align-items: center; justify-content: center; font-family: {HAND}; font-size: {size}px; line-height: 1">{txt}</div>')

def delta(x, y, n, s=24):
    """Revision triangle from CSS borders, number on top."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {s}px; height: {s}px">'
            f'<div style="position: absolute; left: 0; top: 0; width: 0; height: 0; border-left: {s // 2}px solid transparent; '
            f'border-right: {s // 2}px solid transparent; border-bottom: {s}px solid {INK}"></div>'
            f'<div style="position: absolute; left: 0; top: {s - 15}px; width: {s}px; text-align: center; font-family: {PRE}; font-weight: 700; '
            f'font-size: 12px; line-height: 13px; color: {PAPER}">{n}</div></div>')

def label(cx, y, txt, size=14, w=160):
    return at(cx - w // 2, y, esc(txt), w, 'center', f'font-size: {size}px; line-height: 1.15; letter-spacing: 0.04em')

# ------------------------------------------------------------------ plan
PX0, PY0 = 56, 60                         # plan image origin on the sheet
def pl(x, y): return PX0 + x, PY0 + y

plan = [f'<img src="assets/plan.png" alt="" style="position: absolute; left: {PX0}px; top: {PY0}px; width: 660px; height: 600px; display: block">']
for gx, g in ((40, 'A'), (240, 'B'), (440, 'C'), (640, 'D')):
    plan.append(bubble(*pl(gx, 14), g))
for gy, g in ((50, '1'), (305, '2'), (560, '3')):
    plan.append(bubble(*pl(10, gy), g))
# rooms
for x, y, t, s in ((380, 104, 'KITCHEN', 15), (220, 240, 'TABLE FOR 8', 14), (180, 360, 'LIVING', 15),
                   (372, 432, 'STUDIO', 15), (332, 485, 'PETER', 12), (412, 485, 'MICHAEL', 12),
                   (515, 116, 'PETER', 14), (515, 286, 'MICHAEL', 14), (515, 438, 'JACK', 14),
                   (408, 186, 'MARY', 15)):
    plan.append(label(*pl(x, y), t, s))
plan.append(label(*pl(515, 456), '(IN TURKEY)', 12, 90))
plan.append(label(*pl(180, 532), 'FRONT DOOR', 12, 100))
plan.append(label(*pl(380, 582), 'HALL', 12, 60))
plan.append(delta(*pl(436, 184), 1, 22))
plan.append(delta(*pl(298, 570), 1, 20))
# dish marks keyed to the schedule
TAGS = (('S1', 172, 142), ('S2', 238, 142), ('M1', 180, 110), ('D1', 112, 116), ('N1', 70, 168), ('N2', 408, 312))
for t, x, y in TAGS:
    plan.append(bubble(*pl(x, y), t, 15, 12))

title = f'''
{bubble(84, 712, '1', 22, 20)}
<div style="position: absolute; left: 62px; top: 711px; width: 44px; border-top: 1.4px solid {INK}"></div>
<div style="position: absolute; left: 70px; top: 714px; width: 30px; text-align: center; font-family: {HAND}; font-size: 12px">A-1</div>
<div style="position: absolute; left: 120px; top: 688px; width: 520px; border-bottom: 2.4px solid {INK}; padding-bottom: 4px; font-size: 28px; line-height: 1; letter-spacing: 0.04em">LOFT PLAN, SUPPER SET UP</div>
<div style="position: absolute; left: 120px; top: 728px; font-size: 14px; letter-spacing: 0.06em">SCALE: 1/8 IN = 1 FT</div>
<div style="position: absolute; left: 300px; top: 732px; width: 192px; height: 8px; display: flex">
  <div style="width: 48px; height: 8px; background: {INK}"></div><div style="width: 46px; height: 6px; border: 1px solid {INK}"></div>
  <div style="width: 48px; height: 8px; background: {INK}"></div><div style="width: 46px; height: 6px; border: 1px solid {INK}"></div></div>
<div style="position: absolute; left: 296px; top: 744px; font-size: 12px">0</div>
<div style="position: absolute; left: 393px; top: 744px; font-size: 12px">8</div>
<div style="position: absolute; left: 486px; top: 744px; font-size: 12px">16 FT</div>
<img src="assets/north.png" alt="" style="position: absolute; left: 640px; top: 690px; width: 64px; height: 64px; display: block">
<div style="position: absolute; left: 640px; top: 754px; width: 64px; text-align: center; font-size: 12px; letter-spacing: 0.1em">NORTH</div>
'''

NOTES = [
    'Quiet in the loft after 8 P.M. She is asleep.',
    'Supper stays in the kitchen and at the table. Nothing hot near the bassinet.',
    'Bedtime story: last night\'s fight results. Soft voice.',
    'Keep Jack a plate. He is still in Turkey.',
    'Johnny Cool is still due. Michael works after supper.',
    'Coffee on all night. Whoever cooks skips the 2 A.M. feed.',
]
notes = f'''<div style="position: absolute; left: 62px; top: 792px; width: 650px">
  <div style="font-size: 22px; line-height: 1; letter-spacing: 0.05em; display: inline-block; border-bottom: 2px solid {INK}; padding-bottom: 3px">GENERAL NOTES</div>
  <div style="margin-top: 10px; column-count: 2; column-gap: 30px">''' + ''.join(
    f'<div style="display: flex; gap: 8px; break-inside: avoid; margin-bottom: 7px; font-size: 16px; line-height: 1.32; letter-spacing: 0.02em">'
    f'<span style="width: 18px; flex: none">{i}.</span><span style="text-transform: uppercase">{esc(n)}</span></div>'
    for i, n in enumerate(NOTES, 1)) + '</div></div>'

# ------------------------------------------------------------------ schedule
DISH = {
 'S1': ('Shrimp toast', 'Ground with egg white, ginger and scallion, spread on white bread, sesame pressed on, fried golden and cut in triangles. Sweet chili sauce to dip.', '6 P.M.'),
 'S2': ('Bagel chips and schmear', 'Day-old rounds sliced thin, brushed with olive oil and baked crisp. Cream cheese beaten with chives and lemon zest.', '6 P.M.'),
 'M1': ('Steak sandwiches', 'Sirloin seared hard, rested and sliced thin. Onions cooked down slow in butter, horseradish mayo, Swiss melted on top, toasted sourdough.', '8 P.M.'),
 'D1': ('Vanilla bean custard', 'Hot milk whisked into yolks and sugar, stirred over low heat until thick and smooth. Warm, or chilled with the skin kept off.', '9 P.M.'),
 'N1': ('Night-feed milk', 'Whole and cold, shaken hard over ice with vanilla, honey and a little sugar syrup until frothy. Nutmeg grated on top.', '2 A.M.'),
 'N2': ('Mary\'s bottle', 'Powdered formula and warm water, shaken well. A drop on the wrist first.', '2 A.M.<br>6 A.M.'),
}
def row(k, hl=False):
    n, d, t = DISH[k]
    tt = (f'<span style="background: rgba(246,226,64,0.62); padding: 1px 3px; box-decoration-break: clone; -webkit-box-decoration-break: clone">{t}</span>' if hl else t)
    return f'''<div style="display: flex; border-bottom: 1.4px solid {INK}">
    <div style="width: 58px; flex: none; border-right: 1.4px solid {INK}; position: relative">{bubble(29, 26, k, 15, 12, 'transparent')}</div>
    <div style="flex: 1; padding: 9px 14px 10px; border-right: 1.4px solid {INK}">
      <div style="font-size: 22px; line-height: 1.1; letter-spacing: 0.03em; text-transform: uppercase">{esc(n)}</div>
      <div style="margin-top: 4px; font-size: 16px; line-height: 1.3; color: {INK2}; text-wrap: pretty">{esc(d)}</div></div>
    <div style="width: 92px; flex: none; padding: 12px 0 0; text-align: center; font-size: 17px; line-height: 1.4">{tt}</div></div>'''

sched = f'''<div style="position: absolute; left: 760px; top: 56px; width: 556px">
  <div style="display: flex; align-items: flex-end; justify-content: space-between">
    <div style="font-size: 30px; line-height: 1; letter-spacing: 0.05em; border-bottom: 2.4px solid {INK}; padding-bottom: 4px; white-space: nowrap">SUPPER SCHEDULE</div>
    </div>
  <div style="margin-top: 8px; font-size: 13px; letter-spacing: 0.06em; line-height: 1.3">S STARTERS, M MAIN, D DESSERT, N NIGHT FEEDS. MARKS AS ON PLAN.</div>
  <div style="margin-top: 14px; border: 2px solid {INK}; border-bottom: none">
    <div style="display: flex; border-bottom: 2px solid {INK}; font-size: 14px; letter-spacing: 0.1em; line-height: 1">
      <div style="width: 58px; padding: 7px 0; text-align: center; border-right: 1.4px solid {INK}">MARK</div>
      <div style="flex: 1; padding: 7px 14px; border-right: 1.4px solid {INK}">ITEM</div>
      <div style="width: 92px; padding: 7px 0; text-align: center">SERVED</div></div>
    {row('S1')}{row('S2')}{row('M1')}{row('D1')}{row('N1')}{row('N2', True)}
  </div>
  <div style="margin-top: 22px; border: 2px solid {INK}; padding: 12px 16px 12px">
    <div style="display: flex; align-items: center; gap: 12px">
      <div style="font-size: 20px; line-height: 1.05; letter-spacing: 0.04em">SHOPPING LIST</div>
      {delta(0, 0, 2, 22).replace('position: absolute; left: 0px; top: 0px;', 'position: relative;')}
      <div style="font-size: 14px; letter-spacing: 0.04em">SEE REV. 2</div></div>
    <div style="margin-top: 8px; font-size: 16px; line-height: 1.4; letter-spacing: 0.02em; text-transform: uppercase; column-count: 2; column-gap: 20px">
      <div>Diapers, disposable</div><div>Powdered milk, 2 cans</div><div>Whole milk, 1/2 gal.</div><div>Vanilla beans</div>
      <div>Sirloin, 1 1/2 lb.</div><div>Shrimp, 3/4 lb.</div><div>Sourdough, Swiss</div><div>Bagels, day-old OK</div></div>
  </div>
</div>'''

# ------------------------------------------------------------------ title block
TB = 1340
def field(lbl, val, size=19, top=0, h=None):
    hh = f' min-height: {h}px;' if h else ''
    return (f'<div style="border-bottom: 1.4px solid {INK}; padding: 7px 12px 8px;{hh}">'
            f'<div style="font-family: {PRE}; font-weight: 600; font-size: 12px; letter-spacing: 0.14em; line-height: 1">{lbl}</div>'
            f'<div style="margin-top: 5px; font-size: {size}px; line-height: 1.18; letter-spacing: 0.03em">{val}</div></div>')
def pair(a, b):
    return (f'<div style="display: flex; border-bottom: 1.4px solid {INK}">'
            f'<div style="flex: 1; border-right: 1.4px solid {INK}">{a.replace(f"border-bottom: 1.4px solid {INK}; ", "")}</div>'
            f'<div style="flex: 1">{b.replace(f"border-bottom: 1.4px solid {INK}; ", "")}</div></div>')

REVS = [(1, 'Bassinet at the front door, note to Jack. One more for supper.'),
        (2, 'Diapers and powdered milk added to shopping.')]
revs = ''.join(
    f'<div style="display: flex; gap: 10px; padding: 8px 12px; border-bottom: 1.4px solid {INK}">'
    f'<div style="flex: none; width: 22px; height: 22px; position: relative">{delta(0, 0, n, 22)}</div>'
    f'<div style="font-size: 15px; line-height: 1.28; letter-spacing: 0.02em; text-transform: uppercase">{esc(t)}</div></div>'
    for n, t in REVS)

tblock = f'''<div style="position: absolute; left: {TB}px; top: 28px; width: {FW - 28 - TB}px; height: {FH - 56}px; border-left: 2.4px solid {INK}; box-sizing: border-box; display: flex; flex-direction: column">
  <div style="padding: 16px 12px 12px; border-bottom: 2.4px solid {INK}">
    <div style="font-family: {PRE}; font-weight: 700; font-size: 17px; letter-spacing: 0.2em; line-height: 1.1">ARCHITECTURE</div>
    <div style="font-family: {PRE}; font-weight: 500; font-size: 13px; letter-spacing: 0.16em; line-height: 1.4">PLANNING AND INTERIORS<br>NEW YORK, N.Y.</div></div>
  {field('PROJECT', 'LOFT SUPPER', 24)}
  {field('CLIENT', 'MARY', 24)}
  {field('LOCATION', 'THE LOFT, MANHATTAN')}
  {field('SHEET TITLE', 'PLAN, SUPPER SCHEDULE AND NOTES', 18)}
  {pair(field('DRAWN', 'PETER', 18), field('CHECKED', 'MICHAEL', 18))}
  {pair(field('APPROVED', 'JACK (AWAY)', 16), field('DATE', '1987', 18))}
  {pair(field('SCALE', 'AS NOTED', 18), field('JOB NO.', '87-01', 18))}
  <div style="padding: 7px 12px 6px; border-bottom: 1.4px solid {INK}; font-family: {PRE}; font-weight: 600; font-size: 12px; letter-spacing: 0.14em; line-height: 1">REVISIONS</div>
  {revs}
  <div style="flex: 1"></div>
  <div style="margin: 0 12px 16px; border: 2.4px solid {INK}; padding: 8px 6px; text-align: center; font-family: {PRE}; font-weight: 700; font-size: 17px; letter-spacing: 0.14em; line-height: 1.15">FOR SUPPER ONLY<br>NOT FOR CONSTRUCTION</div>
  <div style="border-top: 2.4px solid {INK}; display: flex; align-items: center; padding: 10px 12px 14px">
    <div style="flex: 1"><div style="font-family: {PRE}; font-weight: 600; font-size: 12px; letter-spacing: 0.14em">SHEET</div>
      <div style="margin-top: 6px; font-family: {PRE}; font-weight: 600; font-size: 13px; letter-spacing: 0.1em">1 OF 1</div></div>
    <div style="font-family: {PRE}; font-weight: 700; font-size: 64px; line-height: 0.9; letter-spacing: 0.02em">A-1</div></div>
</div>'''

border = (f'<div style="position: absolute; left: 28px; top: 28px; width: {FW - 56}px; height: {FH - 56}px; border: 2.4px solid {INK}; box-sizing: border-box"></div>'
          f'<div style="position: absolute; left: 20px; top: 20px; width: {FW - 40}px; height: {FH - 40}px; border: 0.8px solid {INK}; box-sizing: border-box; opacity: 0.6"></div>')

def overlays():
    gh = round(FW * 1588 / 2246)
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: {(FH - gh) // 2}px; width: {FW}px; height: {gh}px; opacity: 0.7; pointer-events: none; display: block">'
            f'<img src="assets/wear-sheet.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')

inner = border + ''.join(plan) + title + notes + sched + tblock
body = (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
        f'font-family: {HAND}; color: {INK}">{inner}{overlays()}</div>')
open(os.path.join(D, 'sheet.body.html'), 'w').write(body)
open(os.path.join(D, 'sheet.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Loft Supper Sheet</title>{LINK}'
    f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "loftsupper", "fn": "fmtLoftSupper", "faces": ["sheet.html"], "names": ["Sheet A-1"],
        "mm": [431.8, 279.4], "fonts": FONTS, "fams": ["Architects Daughter", "Barlow Condensed"],
        "phone": {"disp": "'Architects Daughter',cursive", "title": "'Architects Daughter',cursive",
                  "name": "'Architects Daughter',cursive", "body": "'Architects Daughter',cursive",
                  "price": "'Barlow Condensed',sans-serif", "note": "'Barlow Condensed',sans-serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

def L(k, note): n, d, _ = DISH[k]; return {"n": n, "d": d, "note": note}
labels = {"Three Men and a Baby (1987)": {
  "Doorstep basket prawn toast": L('S1', 'On the island by 6 P.M.'),
  "Bagel chips and schmear": L('S2', 'Day-old bagels, nothing wasted.'),
  "Peter's loft steak sandwich": L('M1', 'Drawn by Peter, cooked by Peter.'),
  "Baby Mary's bedtime vanilla custard": L('D1', 'Once she is down for the night.'),
  "Night-feed bourbon milk punch": L('N1', 'For whoever is up at 2 A.M.'),
}}
open(os.path.join(D, 'loftsupper.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
