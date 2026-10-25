"""Southwest General, daily call and rehearsal schedule, New York, 1982.
A pre-printed production office form on pink bond, US Letter (8.5 x 11 in), flat.
The form is offset printed in one red ink, with 65 line halftone tint bands. The day's details are typed
straight onto it on the office typewriter, with a rubber stamp, correction fluid, pencil and ballpoint on top.
Front: the day's call sheet. Back: the reverse of the form, with the tape day lunch typed on it.
Writes front.body.html, back.body.html, front.html and back.html."""
import os, random, html
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
FONTS = 'family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Libre+Franklin:wght@500;600;700;800;900&family=Nanum+Pen+Script'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
PAPER, RED, INK, PENCIL, BLUE = '#f3d7d3', '#b02a35', '#1d1b22', '#5b5662', '#26398c'
FR = "'Libre Franklin', 'Franklin Gothic', Arial, sans-serif"
TY = "'Courier Prime', 'Courier New', monospace"
HW = "'Nanum Pen Script', cursive"
RINK = 'text-shadow: 0 0 0.6px rgba(176,42,53,0.7)'          # offset ink spread on bond
TINK = 'text-shadow: 0 0 0.7px rgba(29,27,34,0.55)'          # ribbon ink spread

R = random.Random(1982)

def typed(text, size=16, bold=False, extra=''):
    """Typewriter text: each strike lands a touch differently, some letters lighter, some a hair off the line."""
    words = []
    for w in text.split(' '):
        cs = ''
        for ch in w:
            e = html.escape(ch, quote=False)
            op = R.choices([1, 0.92, 0.84, 0.74], [58, 22, 14, 6])[0]
            dy = R.choices([0, 0.4, -0.4, 0.8], [62, 16, 16, 6])[0]
            dx = R.choices([0, 0.3, -0.3], [80, 10, 10])[0]
            if op == 1 and dy == 0 and dx == 0:
                cs += e
            else:
                cs += f'<span style="position: relative; top: {dy}px; left: {dx}px; opacity: {op}">{e}</span>'
        words.append(f'<span style="white-space: nowrap">{cs}</span>')
    wt = 700 if bold else 400
    return f'<span style="font-family: {TY}; font-size: {size}px; font-weight: {wt}; color: {INK}; {TINK}; {extra}">{" ".join(words)}</span>'

def lab(t, extra=''):
    return f'<div style="font-family: {FR}; font-weight: 700; font-size: 12px; line-height: 1.2; letter-spacing: 0.1em; text-transform: uppercase; color: {RED}; {RINK}; {extra}">{t}</div>'

def band(t, right='', top=0):
    return (f'<div style="position: relative; flex: none; height: 25px; margin-top: {top}px; overflow: hidden; border-top: 1.5px solid {RED}; border-bottom: 1px solid {RED}">'
            f'<img src="assets/tint-red.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 720px; height: 34px; display: block">'
            f'<div style="position: relative; display: flex; justify-content: space-between; align-items: center; height: 25px; padding: 0 8px; font-family: {FR}; font-weight: 800; font-size: 13px; letter-spacing: 0.16em; text-transform: uppercase; color: {RED}; {RINK}">'
            f'<span>{t}</span><span style="font-weight: 600; letter-spacing: 0.08em">{right}</span></div></div>')

def head(cols):
    return ('<div style="flex: none; display: flex; padding: 5px 0 3px; border-bottom: 1px solid ' + RED + '">'
            + ''.join(f'<div style="width: {w}px; flex: none; padding-left: 6px; box-sizing: border-box">{lab(c, "font-size: 12px")}</div>' for c, w in cols) + '</div>')

def row(vals, cols, h=25, skew=0.0, last=False):
    cells = ''
    for i, (v, (c, w)) in enumerate(zip(vals, cols)):
        bl = f'border-left: 1px solid {RED};' if i else ''
        cells += f'<div style="width: {w}px; flex: none; padding-left: 6px; box-sizing: border-box; height: {h}px; {bl}"><div style="padding-top: 3px; transform: translateY({skew}px)">{v}</div></div>'
    return f'<div style="flex: none; display: flex; border-bottom: 1px solid {RED}">{cells}</div>'

def field(lb, val, w, first=False):
    bl = '' if first else f'border-left: 1px solid {RED};'
    return (f'<div style="width: {w}px; flex: none; {bl} padding: 3px 0 0 7px; height: 44px; box-sizing: border-box">{lab(lb, "font-size: 12px")}'
            f'<div style="margin-top: 4px; margin-left: {R.choice([0, 2, 4])}px">{typed(val)}</div></div>')

def overlays(face):
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 1494px; height: 1056px; pointer-events: none; display: block; opacity: 0.75">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">')

def hand(t, size, color, extra=''):
    return f'<div style="font-family: {HW}; font-size: {size}px; line-height: 1; color: {color}; white-space: nowrap; {extra}">{t}</div>'

# ---------- FRONT: the day's call sheet ----------
DAY = [('7:00 AM', 'Makeup and hair', '3rd floor'),
       ('8:00 AM', 'Dry rehearsal', 'Rehearsal Hall'),
       ('10:00 AM', 'Camera blocking', 'Studio 2'),
       ('12:30 PM', 'LUNCH (see back)', 'Rehearsal Hall'),
       ('1:30 PM', 'Dress rehearsal', 'Studio 2'),
       ('2:30 PM', 'Notes', 'Rehearsal Hall'),
       ('3:00 PM', 'TAPE', 'Studio 2')]
SCENES = [('1', "Nurses' station", '1-4', '3, 4, 5'),
          ('2', "Emily Kimberly's office", '5-9', '1, 2'),
          ('3', 'Corridor, 3 West', '10-12', '2, 3, 5'),
          ('4', "Emily Kimberly's office", '13-16', '1')]
CAST = [('1', 'DOROTHY MICHAELS', 'Emily Kimberly', '7:00', '9:30', ''),
        ('2', 'JOHN VAN HORN', 'Dr. Brewster', '7:30', '9:30', ''),
        ('3', 'JULIE NICHOLS', '(as cast)', '7:15', '8:00', ''),
        ('4', 'APRIL PAGE', '(as cast)', '7:45', '8:00', ''),
        ('5', 'DAY PLAYERS (3)', 'Orderlies', '9:00', '10:00', 'Hospital whites')]
NOTES = ["Please tape the lines as written. R.C.",
         "Closed set during tape. No visitors.",
         "No coffee cups on the nurses' station set.",
         "Red jacket back to wardrobe after sc. 4."]

def front():
    L, CW = 60, 696
    LW = 466
    dcols = [('Time', 96), ('Call', 214), ('Where', LW - 310)]
    day = head(dcols) + ''.join(row([typed(t), typed(c, bold=c.isupper() or c.startswith('LUNCH')), typed(w)], dcols, 23, R.choice([-1, 0, 0, 1])) for t, c, w in DAY)
    scols = [('Sc.', 40), ('Set', 232), ('Pages', 90), ('Cast no.', LW - 362)]
    sc = head(scols) + ''.join(row([typed(n), typed(s), typed(p), typed(c)], scols, 23, R.choice([-1, 0, 1])) for n, s, p, c in SCENES)
    ccols = [('No.', 40), ('Artist', 196), ('Character', 156), ('Makeup', 76), ('On set', 76), ('Remarks', CW - 544)]
    cast = head(ccols)
    for i, (n, a, ch, mk, on, rm) in enumerate(CAST):
        if i == 1:   # correction fluid over the old on-set time, the new one typed on top
            onv = ('<div style="position: relative; width: 60px; height: 18px">'
                   f'<div style="position: absolute; left: 0; top: 0; opacity: 0.35">{typed("10:00")}</div>'
                   '<img src="assets/liquid-paper.png" alt="" aria-hidden="true" style="position: absolute; left: -9px; top: -4px; width: 64px; height: 30px; display: block">'
                   f'<div style="position: absolute; left: 1px; top: -1px">{typed(on)}</div></div>')
        else:
            onv = typed(on)
        cast += row([typed(n), typed(a), typed(ch), typed(mk), onv, typed(rm, 15) if rm else ''], ccols, 26, R.choice([-1, 0, 1]))
    notes = ''.join(f'<div style="display: flex; gap: 9px; padding: 2px 0">{typed("-")}<div style="flex: 1">{typed(t)}</div></div>' for t in NOTES)
    adv = (f'<div style="padding: 5px 2px 0 6px; line-height: 1.45">{typed("FRIDAY, STUDIO 2", bold=True)}<br>'
           f'{typed("8:00 AM  Rehearsal")}<br>{typed("10:00 AM Blocking")}<br>{typed("Pink replaces blue.")}</div>')
    calls = [('Office', 'Ext. 412'), ('Makeup, hair', '3rd floor'), ('Wardrobe', '3rd floor'), ('Stage door', 'Ext. 400')]
    callbox = ''.join(f'<div style="display: flex; justify-content: space-between; align-items: baseline; padding: 4px 0 3px; border-bottom: 1px solid {RED}">{lab(a, "font-size: 12px; letter-spacing: 0.06em")}{typed(b)}</div>' for a, b in calls)
    pol = (f'<div style="position: absolute; left: 556px; top: 252px; width: 196px; height: 238px; transform: rotate(2.5deg)">'
           f'<img src="assets/polaroid.png" alt="Wardrobe Polaroid of Emily Kimberly on the set" style="display: block; width: 196px; height: 238px; box-shadow: 0 1px 3px rgba(70,30,30,0.35), 0 4px 10px rgba(70,30,30,0.12)">'
           f'<div style="position: absolute; left: 0; right: 0; top: 196px; text-align: center; transform: rotate(-1.5deg)">{hand("Emily, red jacket", 24, INK)}</div>'
           f'<img src="assets/tape.png" alt="" aria-hidden="true" style="position: absolute; left: 52px; top: -14px; width: 96px; height: 30px; display: block; transform: rotate(-4deg)"></div>')
    scrawl = (f'<div style="position: absolute; left: 616px; top: 688px; transform: rotate(-6deg)">'
              f'<div style="position: relative; display: inline-block">{hand("Tootsie", 28, PENCIL, "opacity: 0.9")}'
              f'<div style="position: absolute; left: -5px; right: -7px; top: 15px; height: 1.6px; background: {BLUE}; transform: rotate(-4deg)"></div>'
              f'<div style="position: absolute; left: -3px; right: -5px; top: 18px; height: 1.2px; background: {BLUE}; transform: rotate(3deg)"></div></div>'
              f'{hand("It&#8217;s Dorothy.", 28, BLUE, "margin: 1px 0 0 10px")}</div>')
    stamp = '<img src="assets/stamp-revised.png" alt="" aria-hidden="true" style="position: absolute; left: 452px; top: 84px; width: 117px; height: 45px; display: block">'
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}; font-family: {FR}">
{overlays('front')}
<section style="position: absolute; left: {L}px; top: 48px; width: {CW}px; height: {H - 96}px; display: flex; flex-direction: column">
  <div style="flex: none; display: flex; justify-content: space-between; align-items: flex-end">
    <div>
      <div style="font-family: {FR}; font-weight: 800; font-size: 34px; line-height: 1; letter-spacing: 0.015em; text-transform: uppercase; color: {RED}; {RINK}">Southwest General</div>
      <div style="margin-top: 5px; font-family: {FR}; font-weight: 600; font-size: 14px; letter-spacing: 0.18em; text-transform: uppercase; color: {RED}; {RINK}">Daily call and rehearsal schedule</div>
    </div>
    <div style="text-align: right">{lab('Production office', 'line-height: 1.45')}{lab('4th floor, ext. 412', 'line-height: 1.45; font-weight: 600')}</div>
  </div>
  <div style="flex: none; margin-top: 9px; border-top: 2px solid {RED}; border-bottom: 0.75px solid {RED}; height: 2px"></div>
  <div style="flex: none; margin-top: 10px; border-top: 1px solid {RED}">
    <div style="display: flex; border-bottom: 1px solid {RED}">{field('Day', 'THURSDAY', 150, True)}{field('Studio', '2', 90)}{field('Director', 'RON CARLISLE', 214)}{field('Producer', 'RITA MARSHALL', 242)}</div>
    <div style="display: flex; border-bottom: 1px solid {RED}">{field('Crew call', '7:00 AM', 150, True)}{field('Lunch', '12:30 PM', 130)}{field('Tape', '3:00 PM', 174)}{field('Script', 'Pink pages, pp. 1 to 16', 242)}</div>
  </div>
  <div style="flex: none; margin-top: 16px; display: flex; justify-content: space-between">
    <div style="width: {LW}px">
      {band('The day', 'Studio clock')}{day}
      {band('Scenes', 'In tape order', 12)}{sc}
    </div>
    <div style="width: 208px; display: flex; flex-direction: column">
      <div style="height: 266px"></div>
      <div style="margin-top: auto">{lab('Running late? Call', 'border-bottom: 1.5px solid ' + RED + '; padding-bottom: 4px')}{callbox}</div>
    </div>
  </div>
  {band('Cast', 'Makeup times are in the chair', 16)}{cast}
  <div style="flex: none; margin-top: 16px; display: flex; justify-content: space-between">
    <div style="width: 452px">{band('Production notes')}<div style="padding: 5px 2px 0 6px">{notes}</div></div>
    <div style="width: 222px">{band('Advance')}{adv}</div>
  </div>
  <div style="margin-top: auto; display: flex; justify-content: space-between; align-items: baseline; border-top: 1px solid {RED}; padding-top: 5px">
    {lab('Revised schedules are issued on pink. Discard earlier copies.', 'letter-spacing: 0.06em; font-weight: 600')}{lab('Form PO-7 (Rev. 3/81)', 'letter-spacing: 0.06em; font-weight: 600')}
  </div>
</section>
{stamp}{pol}{scrawl}
</div>'''

# ---------- BACK: reverse of the form, lunch typed on ----------
MAJOR = {
 'table': [('FINGER SANDWICHES', 'Egg salad with watercress, and cucumber with cream cheese, on soft white bread. Crusts off, cut in triangles.'),
           ('GREEK RED PEPPER AND FETA SPREAD', 'Broiled black, peeled, whipped smooth with feta, plain yogurt, garlic, hot chili flakes and olive oil. Sesame crackers.')],
 'hot':   [('ROAST CHICKEN AND PAN POTATOES', 'Butter, grated lemon peel and thyme under the skin. Carved to order. The spuds go underneath to brown in the drippings.')],
 'sweet': [('STRAWBERRY SHORTCAKE', 'Biscuits baked here today, split and piled with sugared berries and soft whipped cream.')],
 'drink': [('TEA, THE RUSSIAN WAY', 'Brewed strong and black, poured into glasses. Sliced lemon and cherry preserves on the side, to stir in.')],
}
MINOR = {
 'hot':   [('Cole slaw', 'Cabbage and carrot, mayonnaise dressing.'), ('Tossed salad', 'Boston lettuce, radishes, oil and vinegar.')],
 'drink': [('Coffee', 'Regular and decaf in the urn, all day.'), ('Sodas and seltzer', 'In the cooler by the door.')],
}

def back():
    L, CW = 60, 696
    IND = 38
    def sec(title, key, top):
        out = f'<div style="margin-top: {top}px">{typed(title, bold=True, extra="text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1.5px")}</div>'
        for n, d in MAJOR.get(key, []):
            out += (f'<div style="margin-top: 8px; line-height: 1.1">{typed(n, 21, bold=True, extra="letter-spacing: 0.02em")}</div>'
                    f'<div style="margin: 3px 0 0 {IND}px; line-height: 1.38">{typed(d)}</div>')
        for n, d in MINOR.get(key, []):
            out += f'<div style="margin: 4px 0 0 {IND}px; line-height: 1.38">{typed(n.upper() + ".", bold=True)} {typed(d)}</div>'
        return out
    tally = lambda lb, v: (f'<div style="display: flex; align-items: flex-end; justify-content: space-between; height: 30px; border-bottom: 1px solid {RED}">'
                           f'{lab(lb, "font-size: 12px; padding-bottom: 4px")}{hand(v, 28, PENCIL, "padding: 0 6px 1px 0; opacity: 0.9")}</div>')
    title = 'C A S T   A N D   C R E W   L U N C H'
    return f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}; font-family: {FR}">
{overlays('back')}
<img src="assets/coffee-stain.png" alt="" aria-hidden="true" style="position: absolute; left: 600px; top: 86px; width: 170px; height: 170px; display: block; opacity: 0.8">
<section style="position: absolute; left: {L}px; top: 48px; width: {CW}px; height: {H - 96}px; display: flex; flex-direction: column">
  <div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 1.5px solid {RED}; padding-bottom: 5px">
    <div style="font-family: {FR}; font-weight: 800; font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; color: {RED}; {RINK}">Southwest General</div>
    {lab('Form PO-7, reverse. Meals and notices', 'letter-spacing: 0.08em; font-weight: 600')}
  </div>
  <div style="margin-top: 20px; text-align: center; white-space: pre; line-height: 1.1">{typed(title, 21, bold=True)}</div>
  <div style="text-align: center; white-space: pre; line-height: 1; margin-top: 1px">{typed("=" * 48)}</div>
  <div style="margin-top: 8px; text-align: center; line-height: 1.4">{typed("Thursday, tape day. Rehearsal Hall, 12:30 PM.")}<br>{typed("From the 4th floor kitchen. Please read before you line up.")}</div>
  <div style="transform: rotate(0.25deg); transform-origin: left top">
    {sec('ON THE TABLE FROM 7 AM', 'table', 18)}
    {sec('HOT LUNCH AT 12:30', 'hot', 18)}
    {sec('SOMETHING SWEET', 'sweet', 18)}
    {sec('TO DRINK', 'drink', 18)}
  </div>
  <div style="margin-top: auto; border-top: 1.5px solid {RED}; display: flex">
    <div style="width: 246px; padding: 7px 14px 8px 0; box-sizing: border-box">{lab('Who eats')}
      <div style="margin-top: 5px; font-family: {FR}; font-weight: 500; font-size: 15px; line-height: 1.38; color: {RED}; {RINK}">Cast and crew, no charge. Guests of the company <b>$3.50</b> a plate, paid at the production office before noon.</div></div>
    <div style="width: 246px; padding: 7px 14px 8px 14px; box-sizing: border-box; border-left: 1px solid {RED}">{lab('House rules')}
      <div style="margin-top: 5px; font-family: {FR}; font-weight: 500; font-size: 15px; line-height: 1.38; color: {RED}; {RINK}">Food stays in the hall. Nothing on the studio floor or in wardrobe. Kept on set past one? We hold a plate.</div></div>
    <div style="flex: 1; padding: 7px 0 8px 14px; border-left: 1px solid {RED}">{lab('Plates today')}
      {tally('Cast', '14')}{tally('Crew', '31')}{tally('Guests', '2')}</div>
  </div>
</section>
<img src="assets/lipstick-stain.png" alt="" aria-hidden="true" style="position: absolute; left: 612px; top: 676px; width: 112px; height: 73px; transform: rotate(-12deg); display: block; opacity: 0.9">
</div>'''

for face, fn in (('front', front), ('back', back)):
    body = fn()
    open(os.path.join(D, face + '.body.html'), 'w').write(body + '\n')
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Southwest General call sheet, {face}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')
print('built')
