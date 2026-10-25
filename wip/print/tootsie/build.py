"""Southwest General, daily rehearsal and tape schedule, New York, 1982.
A pre-printed two-sided production office form on pink bond, US Letter (8.5 x 11 in), flat, three-hole punched.
Front: the day's schedule, typed in on the office typewriter. Back: the standing cast and crew lunch menu.
Writes front.body.html, back.body.html, front.html and back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
FONTS = 'family=Archivo:wdth,wght@62..125,100..900&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Nanum+Pen+Script'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
PAPER, RED, INK, SOFT, PENCIL, BLUE = '#f4dcd5', '#ae2330', '#1e1b21', '#4a3f44', '#6a6470', '#24398f'
AR = "'Archivo', 'Helvetica Neue', Arial, sans-serif"
TY = "'Courier Prime', 'Courier New', monospace"
HW = "'Nanum Pen Script', cursive"

def masthead(big):
    s = 1 if big else 0.62
    bar, arm = round(12 * s), round(38 * s)
    cross = (f'<div style="position: relative; width: {arm}px; height: {arm}px; flex: none">'
             f'<div style="position: absolute; left: {(arm-bar)//2}px; top: 0; width: {bar}px; height: {arm}px; background: {RED}"></div>'
             f'<div style="position: absolute; left: 0; top: {(arm-bar)//2}px; width: {arm}px; height: {bar}px; background: {RED}"></div></div>')
    return (f'<div style="display: flex; align-items: center; gap: {round(14*s)}px">{cross}'
            f'<div style="font-family: {AR}; font-stretch: 72%; font-weight: 900; font-size: {round(50*s)}px; line-height: 0.9; letter-spacing: 0.01em; color: {RED}; text-transform: uppercase">Southwest General</div></div>')

def label(t, extra=''):
    return f'<div style="font-family: {AR}; font-stretch: 85%; font-weight: 700; font-size: 12px; letter-spacing: 0.14em; text-transform: uppercase; color: {RED}; {extra}">{t}</div>'

def band(t, right=''):
    return (f'<div style="display: flex; justify-content: space-between; align-items: center; background: {RED}; color: {PAPER}; padding: 5px 10px 4px; '
            f'font-family: {AR}; font-stretch: 85%; font-weight: 800; font-size: 14px; letter-spacing: 0.16em; text-transform: uppercase"><span>{t}</span><span>{right}</span></div>')

def typed(t, size=16, extra=''):
    return f'<span style="font-family: {TY}; font-size: {size}px; color: {INK}; {extra}">{t}</span>'

def field(lab, val, w):
    return (f'<div style="width: {w}px; flex: none; border-left: 1px solid {RED}; padding: 4px 0 6px 8px; box-sizing: border-box">{label(lab)}'
            f'<div style="margin-top: 3px; line-height: 1.1">{typed(val)}</div></div>')

def holes(side):
    x = 18 if side == 'left' else W - 18 - 30
    return ''.join(f'<div style="position: absolute; left: {x}px; top: {y - 15}px; width: 30px; height: 30px; border-radius: 50%; '
                   f'background: radial-gradient(circle at 50% 42%, #ece7e2 0%, #e2dcd6 62%, #c9b8b2 86%, #b9a29b 100%)"></div>' for y in (120, 528, 936))

def overlays(face):
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 1494px; height: 1056px; pointer-events: none; display: block; opacity: 0.8">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">')

# ---------- FRONT: the day's schedule ----------
DAY = [('7:00 AM', 'Makeup and hair, 3rd floor'),
       ('8:00 AM', 'Dry rehearsal, Rehearsal Hall'),
       ('10:30 AM', 'Camera blocking, Studio 2'),
       ('12:30 PM', '<b>Lunch</b>, Rehearsal Hall. Menu on back.'),
       ('1:30 PM', 'Dress rehearsal, Studio 2'),
       ('3:00 PM', '<b>Tape</b>')]
CAST = [('DOROTHY MICHAELS', 'Emily Kimberly', '7:00', '2, 4'),
        ('JOHN VAN HORN', 'Dr. Brewster', '7:30', '2, 3'),
        ('JULIE NICHOLS', '', '7:15', '1, 3'),
        ('DAY PLAYERS (3)', 'Orderlies', '9:30', '1')]
SETS = [('1', 'Nurses&#8217; station'), ('2', 'Emily Kimberly&#8217;s office'), ('3', 'Corridor, 3 West'), ('4', 'Emily Kimberly&#8217;s office')]
NOTES = ['Please tape the lines as written. R.C.',
         'Closed set during tape. No visitors on the floor.',
         'No coffee cups on the nurses&#8217; station set.',
         'Wardrobe: red jacket back on the rack after sc. 4.']

def front():
    L = 76; R = 52; CW = W - L - R
    day = ''.join(f'<div style="display: flex; align-items: baseline; padding: 5px 0; border-bottom: 1px dotted {RED}">'
                  f'<div style="width: 118px; flex: none">{typed(t)}</div><div style="flex: 1">{typed(v)}</div></div>' for t, v in DAY)
    sets = ''.join(f'<div style="display: flex; align-items: baseline; padding: 5px 0; border-bottom: 1px dotted {RED}">'
                   f'<div style="width: 46px; flex: none">{typed(n)}</div><div style="flex: 1">{typed(v)}</div></div>' for n, v in SETS)
    cols = [('Cast', 206), ('Role', 160), ('Makeup', 78), ('Scenes', 64)]
    head = ''.join(f'<div style="width: {w}px; flex: none">{label(c)}</div>' for c, w in cols)
    rows = ''
    for i, (n, r, mk, sc) in enumerate(CAST):
        vals = [n, r, mk, sc]
        rows += (f'<div style="position: relative; display: flex; align-items: baseline; padding: 7px 0 6px; border-bottom: 1px solid {RED}">'
                 + ''.join(f'<div style="width: {w}px; flex: none">{typed(v)}</div>' for v, (c, w) in zip(vals, cols)) + '</div>')
    notes = ''.join(f'<div style="display: flex; gap: 10px; padding: 3px 0">{typed("&#8226;")}{typed(t)}</div>' for t in NOTES)
    tootsie = (f'<div style="position: absolute; left: 616px; top: 674px; transform: rotate(-5deg)">'
               f'<div style="position: relative; display: inline-block; font-family: {HW}; font-size: 28px; line-height: 1; color: {PENCIL}">Tootsie'
               f'<div style="position: absolute; left: -4px; right: -6px; top: 13px; height: 2px; background: {BLUE}; transform: rotate(-3deg)"></div></div>'
               f'<div style="font-family: {HW}; font-size: 30px; line-height: 1; color: {BLUE}; margin: 2px 0 0 14px">It&#8217;s Dorothy.</div></div>')
    pol = (f'<div style="position: absolute; left: 548px; top: 392px; width: 196px; transform: rotate(3deg)">'
           f'<div style="background: #f7f5ef; padding: 12px 12px 40px; box-shadow: 0 2px 6px rgba(60,30,30,0.28)">'
           f'<img src="assets/polaroid.jpg" alt="Wardrobe Polaroid of Emily Kimberly on set" style="display: block; width: 172px; height: 172px">'
           f'<div style="margin-top: 8px; text-align: center; font-family: {HW}; font-size: 24px; line-height: 1; color: {INK}">Emily, red jacket</div></div>'
           f'<img src="assets/paperclip.png" alt="" style="position: absolute; left: 136px; top: -42px; width: 46px; height: 150px; display: block"></div>')
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}; font-family: {AR}">
{overlays('front')}{holes('left')}
<section style="position: absolute; left: {L}px; top: 46px; width: {CW}px; height: {H - 92}px; display: flex; flex-direction: column">
  <div style="display: flex; justify-content: space-between; align-items: flex-end">
    {masthead(True)}
    <div style="text-align: right">{label('Production office', 'line-height: 1.5')}{label('4th floor, ext. 412', 'line-height: 1.5')}</div>
  </div>
  <div style="margin-top: 12px; border-top: 3px solid {RED}; border-bottom: 1px solid {RED}; height: 3px"></div>
  <div style="margin-top: 10px; display: flex; justify-content: space-between; align-items: baseline">
    <div style="font-family: {AR}; font-stretch: 80%; font-weight: 800; font-size: 26px; letter-spacing: 0.03em; text-transform: uppercase; color: {RED}">Daily rehearsal and tape schedule</div>
    <div style="border: 2px solid {RED}; padding: 2px 8px 1px; transform: rotate(-2deg); font-family: {AR}; font-stretch: 80%; font-weight: 800; font-size: 15px; letter-spacing: 0.2em; color: {RED}">REVISED</div>
  </div>
  <div style="margin-top: 14px; display: flex; border-top: 1px solid {RED}; border-bottom: 1px solid {RED}">
    {field('Tape day', 'THURSDAY', 150)}{field('Studio', '2', 92)}{field('Director', 'RON CARLISLE', 172)}{field('Producer', 'RITA MARSHALL', CW - 414)}
  </div>
  <div style="margin-top: 22px">{band('The day', 'All times are on the studio clock')}<div style="padding: 2px 4px 0">{day}</div></div>
  <div style="margin-top: 20px; width: 430px">{band('Scenes')}<div style="padding: 2px 4px 0">{sets}</div></div>
  <div style="margin-top: 34px">{band('Cast called')}<div style="display: flex; padding: 8px 4px 4px; border-bottom: 1px solid {RED}">{head}</div><div style="padding: 0 4px">{rows}</div></div>
  <div style="margin-top: 20px">{band('Production notes')}<div style="padding: 6px 4px 0">{notes}</div></div>
  <div style="margin-top: auto; display: flex; justify-content: space-between; border-top: 1px solid {RED}; padding-top: 6px">
    {label('Revisions are issued on pink. Toss the white.', 'letter-spacing: 0.08em')}{label('Form PO-7', 'letter-spacing: 0.08em')}
  </div>
</section>
{pol}{tootsie}
</div>'''

# ---------- BACK: the standing lunch menu ----------
MENU = [
    ('On the table from 7 AM', [
        ('Finger sandwiches', 'Egg salad with cress, and cucumber with cream cheese, on soft white bread. Crusts off, cut in triangles.'),
        ('Roasted red pepper and feta dip', 'Charred under the broiler, peeled, then blended smooth with feta, thick yogurt, garlic, chili flakes and olive oil. Seeded crackers.'),
        ('Coffee', 'Regular and decaf in the urn, refilled all day. Half-and-half alongside.')]),
    ('Hot lunch at 12:30', [
        ('Farmhouse roast chicken', 'Salted the night before, with lemon zest, thyme and butter under the skin. Carved, with potatoes cooked in the pan.'),
        ('Green salad', 'Butter lettuce and radish, mustard vinaigrette.')]),
    ('Something sweet', [
        ('Strawberry shortcake', 'Cream biscuits baked this morning, split and filled with sugared berries and soft whipped cream.')]),
    ('To drink', [
        ('Tea, the Russian way', 'Brewed strong and black, poured into glasses, with sliced lemon and cherry preserves to stir in.')]),
]

def back():
    L = 52; R = 76; CW = W - L - R
    secs = ''
    for i, (h, items) in enumerate(MENU):
        rows = ''.join(f'''<div style="margin-top: 11px">
          <div style="font-family: {AR}; font-stretch: 80%; font-weight: 800; font-size: 25px; line-height: 1.1; color: {INK}">{n}</div>
          <div style="margin-top: 3px; font-family: {AR}; font-stretch: 100%; font-weight: 400; font-size: 16px; line-height: 1.4; color: {SOFT}; text-wrap: pretty">{d}</div></div>''' for n, d in items)
        secs += f'<div style="margin-top: {0 if i == 0 else 20}px">{band(h)}<div style="padding: 0 4px">{rows}</div></div>'
    lip = '<img src="assets/lipstick-stain.png" alt="" aria-hidden="true" style="position: absolute; left: 596px; top: 600px; width: 120px; height: 78px; transform: rotate(-12deg); display: block">'
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}; font-family: {AR}">
{overlays('back')}{holes('right')}
<section style="position: absolute; left: {L}px; top: 46px; width: {CW}px; height: {H - 92}px; display: flex; flex-direction: column">
  <div style="display: flex; justify-content: space-between; align-items: center">
    {masthead(False)}
    {label('Tape days only', 'letter-spacing: 0.16em')}
  </div>
  <div style="margin-top: 10px; font-family: {AR}; font-stretch: 68%; font-weight: 900; font-size: 70px; line-height: 0.95; white-space: nowrap; letter-spacing: 0.005em; text-transform: uppercase; color: {RED}">Cast and crew lunch</div>
  <div style="margin-top: 10px; border-top: 3px solid {RED}; border-bottom: 1px solid {RED}; height: 3px"></div>
  <div style="margin-top: 10px; font-family: {AR}; font-weight: 500; font-size: 17px; line-height: 1.4; color: {INK}">Served in the Rehearsal Hall from the fourth floor kitchen.</div>
  <div style="margin-top: 18px">{secs}</div>
  <div style="margin-top: auto; display: flex; gap: 0; border-top: 1px solid {RED}; border-bottom: 1px solid {RED}">
    <div style="flex: 1; padding: 9px 14px 10px 4px; border-right: 1px solid {RED}">{label('Who eats')}
      <div style="margin-top: 4px; font-size: 15px; line-height: 1.4">Cast and crew, no charge. Guests of the company, <b>$3.50</b> a plate, paid at the production office before noon.</div></div>
    <div style="flex: 1; padding: 9px 4px 10px 14px">{label('House rules')}
      <div style="margin-top: 4px; font-size: 15px; line-height: 1.4">Food stays in the hall. Nothing on the studio floor, nothing in wardrobe. Kept on set past one? We hold a plate.</div></div>
  </div>
</section>
{lip}
</div>'''

for face, fn in (('front', front), ('back', back)):
    body = fn()
    open(os.path.join(D, face + '.body.html'), 'w').write(body + '\n')
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Southwest General schedule, {face}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')
print('built')
