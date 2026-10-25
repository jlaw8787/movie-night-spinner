"""Builds the MacMillan Toy Company party menu (Big, 1988).
The object: a two-sided US Letter card the toy company's own packaging studio printed for the
company party, laid out like the front and back of one of its toy boxes, with item numbers,
an age box, a collect-them-all checklist and a barcode. Writes front.html and back.html
(plus .body.html copies used for the PDF)."""
import os
D = os.path.dirname(os.path.abspath(__file__))

BLUE, NAVY, RED, YEL, CREAM, INK, SOFT = '#1f4ea6', '#122d66', '#cf2a2f', '#f8c41e', '#fff8e8', '#1b2233', '#4a5266'
FONTS = ('family=Titan+One&family=Barlow:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500'
         '&family=Barlow+Condensed:wght@500;600;700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
W, H = 816, 1056
TITAN = "'Titan One', 'Arial Black', sans-serif"
BAR = "'Barlow', Arial, sans-serif"
COND = "'Barlow Condensed', 'Arial Narrow', sans-serif"

# (item no., name, description, note)
TRAYS = [
    ('8801', 'Griddled baby corn',
     'Little ears blanched, then blistered in butter on a hot griddle. Chilli flakes, lime zest, salt and a wedge to squeeze.',
     'Hold it like a cob.'),
    ('8802', 'Red caviar on crackers',
     'Salmon roe and snipped chives over crème fraîche on crisp water biscuits, spooned up just before they go out.',
     'An acquired taste. Napkins close by.'),
    ('8803', 'Soft pretzels',
     'Twisted by hand, baked deep brown and scattered with coarse salt. Yellow mustard to dip.',
     'Warm from the oven all night.'),
]
CART = [
    ('8804', 'Corner cart hot dog',
     'Poached, then griddled until the skin snaps. Steamed bun, yellow mustard, sauerkraut and red onion sauce cooked down slow.',
     'Have a second. Nobody is counting.'),
]
BIG = [
    ('8805', 'The giant cookie',
     'Brown-butter chocolate chip dough pressed into one wide round and baked soft in the middle. White icing piano keys piped across, cut at the table.',
     'For the boss’s floor-piano duet.'),
]
FOUNTAIN = [
    ('8806', 'Chocolate egg cream',
     'Syrup and cold milk in a tall glass, then seltzer poured hard from up high and stirred with a long spoon until a white head rises.',
     'No egg, no cream. Never was.'),
    ('8807', 'Fresh lemonade', 'Squeezed this afternoon, sweetened just enough, plenty of ice.', None),
    ('8808', 'Vanilla malted', 'Ice cream, cold milk and malt powder spun thick. The rest comes in the steel cup.', None),
]
ALL = TRAYS + CART + BIG + FOUNTAIN


def item(no, name, desc, note, first, gap=22, name_px=24):
    nt = (f'<p style="margin: 4px 0 0; font-family: {BAR}; font-style: italic; font-weight: 500; font-size: 16px; '
          f'line-height: 1.3; color: {RED}">{note}</p>') if note else ''
    return f'''<div style="margin-top: {0 if first else gap}px">
      <div style="font-family: {COND}; font-weight: 600; font-size: 14px; letter-spacing: 0.14em; color: {BLUE}">NO. {no}</div>
      <h3 style="margin: 1px 0 0; font-family: {BAR}; font-weight: 700; font-size: {name_px}px; line-height: 1.12; color: {NAVY}">{name}</h3>
      <p style="margin: 4px 0 0; font-family: {BAR}; font-size: 16px; line-height: 1.36; color: {INK}; text-wrap: pretty">{desc}</p>{nt}</div>'''


def head(t, first=True, gap=30):
    return f'''<div style="display: flex; align-items: center; gap: 10px; margin: {0 if first else gap}px 0 12px">
      <span style="font-family: {TITAN}; font-size: 22px; letter-spacing: 0.02em; color: {RED}">{t}</span>
      <span style="flex: 1; height: 3px; background: {YEL}"></span></div>'''


def burst(x, y, size, color, lines, rot=-12):
    sq = ''.join(f'<div style="position: absolute; left: 0; top: 0; width: {size}px; height: {size}px; background: {color}; '
                 f'transform: rotate({a}deg)"></div>' for a in (0, 22.5, 45, 67.5))
    txt = ''.join(f'<div style="font-family: {TITAN}; font-size: {px}px; line-height: 1.02; color: {c}">{t}</div>' for t, px, c in lines)
    return f'''<div style="position: absolute; left: {x}px; top: {y}px; width: {size}px; height: {size}px">{sq}
      <div style="position: absolute; left: 0; top: 0; width: {size}px; height: {size}px; display: flex; flex-direction: column;
        align-items: center; justify-content: center; text-align: center; transform: rotate({rot}deg)">{txt}</div></div>'''


def checker(x, y, w, cell=10, rows=2):
    out = []
    for r in range(rows):
        for c in range(w // cell):
            if (r + c) % 2 == 0:
                out.append(f'<div style="position: absolute; left: {x + c * cell}px; top: {y + r * cell}px; width: {cell}px; height: {cell}px; background: {CREAM}"></div>')
    return ''.join(out)


def barcode(x, y):
    widths = [3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 2, 1, 1, 3, 1, 2, 1, 1, 2, 1, 3, 1, 2, 2, 1, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1, 3, 1, 2, 1, 1, 2, 3, 1]
    bars, cx = [], 0
    for i, w in enumerate(widths):
        if i % 2 == 0:
            tall = 8 if i in (0, 2, 46, 24, 22) else 0
            bars.append(f'<div style="position: absolute; left: {cx}px; top: 0; width: {w * 2}px; height: {40 + tall}px; background: {INK}"></div>')
        cx += w * 2
    return f'''<div style="position: absolute; left: {x}px; top: {y}px; width: {cx + 16}px; height: 76px; background: #fff; padding: 8px; box-sizing: border-box">
      <div style="position: relative; width: {cx}px; height: 48px">{''.join(bars)}</div>
      <div style="font-family: {COND}; font-weight: 600; font-size: 14px; letter-spacing: 0.32em; color: {INK}; text-align: center; margin-top: 1px">0 19880 08800 1</div></div>'''


FINISH = lambda face: f'''
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none; opacity: 0.55">
  <img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'''

FRAME = f'''<div style="position: absolute; left: 18px; top: 18px; width: {W - 36}px; height: {H - 36}px; border: 3px solid {YEL}; border-radius: 22px; box-sizing: border-box"></div>'''

# ---------------- front: the box front ----------------
front = f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {BLUE}; font-family: {BAR}; color: {INK}">
  {FRAME}
  <!-- company band -->
  <div style="position: absolute; left: 40px; top: 44px; width: {W - 80}px; height: 92px; background: {RED}; border-radius: 14px"></div>
  {checker(40, 118, W - 80, cell=9, rows=2)}
  <div style="position: absolute; left: 64px; top: 50px; font-family: {TITAN}; font-size: 58px; line-height: 1; color: {CREAM}; text-shadow: 4px 4px 0 {NAVY}">MacMillan</div>
  <div style="position: absolute; left: 418px; top: 60px; font-family: {COND}; font-weight: 700; font-size: 20px; letter-spacing: 0.2em; line-height: 1.25; color: {CREAM}">TOY COMPANY<br><span style="font-weight: 500; font-size: 16px; letter-spacing: 0.16em; color: {YEL}">NEW YORK, N.Y.</span></div>

  {burst(594, 148, 162, YEL, [('NEW', 30, RED), ('FOR', 20, NAVY), ('1988!', 30, RED)])}

  <!-- title -->
  <div style="position: absolute; left: 56px; top: 166px; width: 540px">
    <div style="font-family: {COND}; font-weight: 700; font-size: 18px; letter-spacing: 0.26em; color: {YEL}">TONIGHT ONLY</div>
    <div style="margin-top: 6px; font-family: {TITAN}; font-size: 66px; line-height: 0.98; color: {CREAM}; text-shadow: 5px 5px 0 {NAVY}">The Company<br><span style="color: {YEL}">Party</span></div>
    <p style="margin: 14px 0 0; font-family: {BAR}; font-weight: 500; font-style: italic; font-size: 21px; line-height: 1.3; color: {CREAM}">Grown-up food for a kid at heart.</p>
  </div>

  <!-- product art -->
  <img src="assets/toy-art.png" alt="" style="position: absolute; left: 320px; top: 372px; width: 456px; height: 289px; display: block">
  <div style="position: absolute; left: 330px; top: 662px; width: 446px; text-align: right; font-family: {COND}; font-weight: 500; font-size: 14px; letter-spacing: 0.06em; color: {CREAM}; opacity: 0.9">Contents may be bigger than shown.</div>

  <!-- age and contents boxes -->
  <div style="position: absolute; left: 56px; top: 404px; width: 236px; background: {CREAM}; border: 3px solid {NAVY}; border-radius: 12px; box-sizing: border-box; padding: 10px 14px 12px">
    <div style="font-family: {COND}; font-weight: 700; font-size: 16px; letter-spacing: 0.2em; color: {BLUE}">AGES</div>
    <div style="font-family: {TITAN}; font-size: 30px; line-height: 1.05; color: {RED}">GROWN-UP</div>
    <div style="margin-top: 4px; font-family: {BAR}; font-size: 16px; line-height: 1.3; color: {INK}">Some exceptions apply.</div>
  </div>
  <div style="position: absolute; left: 56px; top: 540px; width: 236px; background: {YEL}; border: 3px solid {NAVY}; border-radius: 12px; box-sizing: border-box; padding: 10px 14px 12px">
    <div style="font-family: {COND}; font-weight: 700; font-size: 16px; letter-spacing: 0.2em; color: {NAVY}">CONTENTS</div>
    <div style="font-family: {TITAN}; font-size: 30px; line-height: 1.05; color: {NAVY}">8 PIECES</div>
    <div style="margin-top: 4px; font-family: {BAR}; font-size: 16px; line-height: 1.3; color: {INK}">No batteries needed.</div>
  </div>

  <!-- white window panel: passed on trays -->
  <div style="position: absolute; left: 40px; top: 694px; width: {W - 80}px; height: 322px; background: #fffdf6; border: 4px solid {NAVY}; border-radius: 16px; box-sizing: border-box; padding: 18px 24px 0">
    {head('Passed on trays')}
    <div style="display: flex; gap: 24px">
      {''.join(f'<div style="flex: 1">{item(*t, first=True, name_px=22)}</div>' for t in TRAYS)}
    </div>
  </div>
  <div style="position: absolute; left: 64px; top: 978px; width: {W - 128}px; text-align: right; font-family: {COND}; font-weight: 600; font-size: 15px; letter-spacing: 0.16em; color: {BLUE}">THE CART, THE COOKIE AND THE FOUNTAIN ARE ON THE BACK</div>
  {FINISH('front')}
</div>'''

# ---------------- back: the box back ----------------
checklist = ''.join(
    f'''<div style="display: flex; align-items: center; gap: 9px; height: 34px">
      <span style="width: 18px; height: 18px; border: 2px solid {NAVY}; background: #fffdf6; box-sizing: border-box; flex: none"></span>
      <span style="font-family: {BAR}; font-weight: 600; font-size: 16px; color: {NAVY}; white-space: nowrap">{n}</span></div>'''
    for _, n, _, _ in ALL)

back = f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {BLUE}; font-family: {BAR}; color: {INK}">
  {FRAME}
  <!-- heading band -->
  <div style="position: absolute; left: 40px; top: 44px; width: {W - 80}px; height: 84px; background: {YEL}; border-radius: 14px"></div>
  <div style="position: absolute; left: 64px; top: 56px; font-family: {TITAN}; font-size: 46px; line-height: 1.1; color: {RED}; text-shadow: 3px 3px 0 {NAVY}">What’s in the box</div>
  <div style="position: absolute; left: 540px; top: 60px; width: 212px; text-align: right; font-family: {COND}; font-weight: 600; font-size: 16px; line-height: 1.25; letter-spacing: 0.06em; color: {NAVY}">SUGGESTED RETAIL<br><span style="font-family: {BAR}; font-weight: 500; font-style: italic; letter-spacing: 0; font-size: 16px">Compliments of Mr. MacMillan</span></div>

  <!-- main white panel, two columns -->
  <div style="position: absolute; left: 40px; top: 148px; width: {W - 80}px; height: 452px; background: #fffdf6; border: 4px solid {NAVY}; border-radius: 16px; box-sizing: border-box; padding: 22px 26px 0; display: flex; gap: 30px">
    <div style="flex: 1">
      {head('Off the corner cart')}
      {''.join(item(*t, first=(i == 0)) for i, t in enumerate(CART))}
      {head('Something big', first=False, gap=30)}
      {''.join(item(*t, first=(i == 0)) for i, t in enumerate(BIG))}
    </div>
    <div style="width: 3px; background: {YEL}; margin-bottom: 26px"></div>
    <div style="flex: 1">
      {head('The soda fountain')}
      {''.join(item(*t, first=(i == 0), gap=20) for i, t in enumerate(FOUNTAIN))}
    </div>
  </div>

  <!-- how to play, printed straight on the blue -->
  <div style="position: absolute; left: 40px; top: 640px; width: {W - 80}px">
    <div style="display: flex; align-items: center; gap: 12px">
      <span style="font-family: {TITAN}; font-size: 26px; color: {YEL}; text-shadow: 2px 2px 0 {NAVY}">How to play</span>
      <span style="flex: 1; height: 3px; background: {YEL}"></span></div>
    <div style="display: flex; gap: 22px; margin-top: 12px">
      {''.join(f"""<div style="flex: 1; display: flex; gap: 10px; align-items: flex-start">
        <span style="flex: none; width: 34px; height: 34px; border-radius: 50%; background: {YEL}; border: 3px solid {NAVY}; box-sizing: border-box; font-family: {TITAN}; font-size: 18px; line-height: 28px; text-align: center; color: {RED}">{n}</span>
        <span style="font-family: {BAR}; font-weight: 500; font-size: 16px; line-height: 1.32; color: {CREAM}">{t}</span></div>""" for n, t in (
        ('1', 'Catch a tray as it goes by.'), ('2', 'Try one of everything, even the caviar.'), ('3', 'Save room for the cookie.')))}
    </div>
  </div>

  <!-- collect all 8 -->
  <div style="position: absolute; left: 40px; top: 760px; width: 404px; height: 256px; background: {YEL}; border: 4px solid {NAVY}; border-radius: 16px; box-sizing: border-box; padding: 16px 22px 0">
    <div style="font-family: {TITAN}; font-size: 30px; line-height: 1.05; color: {RED}">Collect all 8!</div>
    <div style="margin: 4px 0 10px; font-family: {BAR}; font-size: 16px; line-height: 1.3; color: {INK}">Tick each one off as it comes round.</div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 12px">{checklist}</div>
  </div>

  <!-- fine print panel -->
  <div style="position: absolute; left: 464px; top: 760px; width: 312px; height: 256px; background: {CREAM}; border: 4px solid {NAVY}; border-radius: 16px; box-sizing: border-box; padding: 16px 20px 0">
    <div style="font-family: {COND}; font-weight: 700; font-size: 17px; letter-spacing: 0.2em; color: {RED}">PLEASE NOTE</div>
    <p style="margin: 6px 0 0; font-family: {BAR}; font-size: 16px; line-height: 1.36; color: {INK}">Building does not turn into a robot.<br>Tuxedos welcome, any color.</p>
    <p style="margin: 10px 0 0; font-family: {BAR}; font-size: 13px; line-height: 1.35; color: {SOFT}">Party pack. Not for resale.<br>© 1988 MacMillan Toy Co., New York, N.Y.<br>Printed in U.S.A.</p>
  </div>
  {barcode(580, 932)}
  {FINISH('back')}
</div>'''

for name, body, title in (('front', front, 'MacMillan party menu, front'), ('back', back, 'MacMillan party menu, back')):
    open(os.path.join(D, name + '.body.html'), 'w').write(body)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{title}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')
print('built front.html, back.html')
