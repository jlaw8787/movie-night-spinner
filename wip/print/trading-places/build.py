"""Builds the Heritage Club bill of fare (Trading Places, 1983): a two-sided card on heavy cream
stock, US Legal portrait (8.5 x 14 in, 816 x 1344 CSS px), printed both sides, no fold.
Front: the Dining Room. Back: the Members' Bar, the Wager Book and the house rules, with the
Head Steward's typed notice clipped on. Writes front.body.html, back.body.html, front.html, back.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1344
GREEN, OX, INK, SOFT, PAPER, RULE = '#1d3a2e', '#7a2f2a', '#26231e', '#4d473d', '#f2ead6', '#1d3a2e'
FONTS = ('family=Cormorant+Garamond:ital,wght@0,500;0,600;0,700;1,500;1,600'
         '&family=Libre+Caslon+Text:ital,wght@0,400;0,700;1,400&family=Courier+Prime:wght@400;700')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
CG, LC, CP = "'Cormorant Garamond',serif", "'Libre Caslon Text',serif", "'Courier Prime',monospace"

# ---------- copy ----------
FRONT = [
  ('To begin', [
    ('Devils on horseback', 'Prunes stuffed with a whole almond, wrapped in thin bacon and baked until crisp. Served warm.', '3.25', None),
    ('Snapper soup', 'Turtle simmered dark and thick with tomato and chopped egg. Dry sherry poured at the table.', '3.50', None),
    ('Shrimp cocktail', 'Six Gulf shrimp, poached and served ice cold with a sharp red sauce and a wedge of lemon.', '6.95', None)]),
  ('From the carving cart', [
    ('Prime rib of beef, au jus', 'Slow roasted on the bone and carved at your table. Horseradish cream, crisp roast potatoes.', '15.50', None)]),
  ('The Grill Room', [
    ('Bacon, lettuce and tomato', 'Thick-cut and crisp, iceberg leaf, ripe beefsteak slices and mayonnaise on toasted white.', '4.25', None),
    ('Smoked salmon', 'Sliced thin from the side. Warm buckwheat blini, sour cream, capers, red onion and dill.', '7.25', 'Kindly enjoy it at the table.')]),
  ('Desserts', [
    ('Orange butter cake', 'Fresh zest beaten through the batter, brushed while warm with frozen juice concentrate boiled to a syrup.', '2.75', None)]),
]
BAR_L = [
  ('Cocktails', [
    ('Mimosa', 'Fresh-squeezed juice and chilled champagne, half and half, in a flute.', '3.25'),
    ('Frozen orange frappé', 'Juice blended with shaved ice and a splash of vodka, in a small glass.', '2.75'),
    ('Dry martini', 'Gin or vodka, stirred until very cold, with an olive or a lemon twist.', '3.50'),
    ('Manhattan', 'Rye whiskey, sweet vermouth and a dash of bitters, with a cherry.', '3.50')]),
]
BAR_R = [
  ('Wine and port', [
    ('Club claret', 'Our own Bordeaux. Glass or bottle.', '2.50 / 12.00'),
    ('Champagne, brut', 'Kept on ice behind the bar.', '3.75 / 26.00'),
    ('Vintage port', 'Decanted each evening at six.', '3.50')]),
  ('After dinner', [
    ('Coffee', 'A fresh pot to every table.', '1.00')]),
]
RULES = [
  'Jackets and ties in all club rooms.',
  'Guests remain with the member who signed them in.',
  'No cash is taken. All charges are signed to the member’s account.',
  'Business papers are not to be shown in the Dining Room.',
]

# ---------- pieces ----------
def frame():
    return (f'<div style="position: absolute; left: 28px; top: 28px; width: {W - 60}px; height: {H - 60}px; border: 2px solid {RULE}"></div>'
            f'<div style="position: absolute; left: 37px; top: 37px; width: {W - 76}px; height: {H - 76}px; border: 1px solid {RULE}"></div>'
            + ''.join(f'<div style="position: absolute; left: {x - 5}px; top: {y - 5}px; width: 10px; height: 10px; background: {PAPER}; '
                      f'border: 1px solid {RULE}; transform: rotate(45deg)"></div>' for x, y in ((33, 33), (W - 33, 33), (33, H - 33), (W - 33, H - 33))))

def medallion(size=104):
    f = round(size * 0.44)
    return (f'<div style="position: relative; width: {size}px; height: {size}px; margin: 0 auto; border-radius: 50%; border: 2px solid {GREEN}; box-sizing: border-box">'
            f'<div style="position: absolute; left: 5px; top: 5px; right: 5px; bottom: 5px; border-radius: 50%; border: 1px solid {GREEN}"></div>'
            f'<div style="position: absolute; left: 0; top: 0; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; '
            f'font-family: {CG}; font-style: italic; font-weight: 700; font-size: {f}px; color: {GREEN}; line-height: 1">'
            f'<span>H</span><span style="margin-left: -{round(f * 0.08)}px; color: {OX}">C</span></div></div>')

def ornament(w=150):
    return (f'<div style="display: flex; align-items: center; justify-content: center; gap: 12px">'
            f'<span style="width: {w}px; height: 1px; background: {GREEN}"></span>'
            f'<span style="width: 7px; height: 7px; background: {OX}; transform: rotate(45deg)"></span>'
            f'<span style="width: {w}px; height: 1px; background: {GREEN}"></span></div>')

def head(t, gap, w=54, center=True):
    return (f'<div style="display: flex; align-items: center; justify-content: {"center" if center else "flex-start"}; gap: 14px; margin: {gap}px 0 8px">'
            + (f'<span style="width: {w}px; height: 1px; background: {OX}"></span>' if center else '')
            + f'<span style="font-family: {CG}; font-weight: 700; font-size: 17px; letter-spacing: 0.3em; color: {OX}; padding-left: 0.3em">{t.upper()}</span>'
            f'<span style="{"width: %dpx" % w if center else "flex: 1"}; height: 1px; background: {OX}"></span></div>')

def dish(n, d, p, note, gap):
    s = (f'<div style="text-align: center; margin-top: {gap}px">'
         f'<h3 style="margin: 0; font-family: {CG}; font-weight: 700; font-size: 28px; line-height: 1.1; color: {GREEN}">{n}'
         f'<span style="font-family: {LC}; font-weight: 400; font-size: 17px; color: {OX}; margin-left: 14px">{p}</span></h3>'
         f'<p style="margin: 4px auto 0; max-width: 540px; font-family: {LC}; font-style: italic; font-size: 16px; line-height: 1.42; color: {INK}; text-wrap: balance">{d}</p>')
    if note:
        s += f'<p style="margin: 3px 0 0; font-family: {CG}; font-weight: 600; font-size: 16px; letter-spacing: 0.06em; color: {OX}">{note}</p>'
    return s + '</div>'

def bar_item(n, d, p, first):
    return (f'<div style="margin-top: {0 if first else 18}px">'
            f'<div style="display: flex; align-items: baseline; gap: 8px">'
            f'<h3 style="margin: 0; font-family: {CG}; font-weight: 700; font-size: 25px; line-height: 1.1; color: {GREEN}; white-space: nowrap">{n}</h3>'
            f'<span style="flex: 1; border-bottom: 2px dotted {SOFT}; opacity: 0.55; transform: translateY(-5px)"></span>'
            f'<span style="font-family: {LC}; font-size: 16px; color: {OX}; white-space: nowrap">{p}</span></div>'
            f'<p style="margin: 2px 0 0; font-family: {LC}; font-style: italic; font-size: 16px; line-height: 1.4; color: {INK}; text-wrap: pretty">{d}</p></div>')

def bar_col(groups):
    s = ''
    for gi, (t, items) in enumerate(groups):
        s += head(t, 0 if gi == 0 else 26, center=False) + ''.join(bar_item(*it, first=(i == 0)) for i, it in enumerate(items))
    return s

def grain(name):
    # shared A4-landscape grain turned on its side to cover the portrait card, then this face's wear
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(W - H) // 2}px; top: {(H - W) // 2}px; '
            f'width: {H}px; height: {W}px; transform: rotate(90deg); pointer-events: none; display: block">'
            f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">')

# ---------- faces ----------
def front():
    secs = ''
    for gi, (t, items) in enumerate(FRONT):
        secs += head(t, 0 if gi == 0 else 26) + ''.join(dish(*it, gap=(4 if i == 0 else 14)) for i, it in enumerate(items))
    return f'''{frame()}
<div style="position: absolute; left: 76px; top: 72px; width: {W - 152}px; text-align: center">
  {medallion(88)}
  <h1 style="margin: 14px 0 0; font-family: {CG}; font-weight: 700; font-size: 50px; line-height: 1; letter-spacing: 0.12em; padding-left: 0.12em; color: {GREEN}">THE HERITAGE CLUB</h1>
  <div style="margin: 9px 0 16px; font-family: {LC}; font-size: 13px; letter-spacing: 0.42em; padding-left: 0.42em; color: {SOFT}">PHILADELPHIA</div>
  {ornament()}
  <div style="margin-top: 12px; font-family: {CG}; font-style: italic; font-weight: 600; font-size: 34px; line-height: 1.1; color: {OX}">The Dining Room</div>
  <div style="margin-top: 4px; font-family: {LC}; font-size: 16px; color: {SOFT}">Bill of fare for December</div>
  <div style="margin-top: 24px">{secs}</div>
</div>
<div style="position: absolute; left: 76px; top: {H - 120}px; width: {W - 152}px; text-align: center">
  {ornament(110)}
  <p style="margin: 12px 0 0; font-family: {LC}; font-size: 16px; line-height: 1.45; color: {SOFT}">Luncheon from noon to half past two. Dinner from six until ten.<br>The Members’ Bar and the Wager Book are overleaf.</p>
</div>
{grain('front')}'''

def back():
    rules = ''.join(f'<p style="margin: {0 if i == 0 else 9}px 0 0; font-family: {LC}; font-size: 16px; line-height: 1.4; color: {INK}; text-wrap: pretty">{r}</p>' for i, r in enumerate(RULES))
    clip = (f'<div style="position: absolute; left: 252px; top: -24px; width: 18px; height: 54px; border: 2px solid #8a8d8f; border-radius: 9px; box-sizing: border-box"></div>'
            f'<div style="position: absolute; left: 256px; top: -16px; width: 10px; height: 38px; border: 2px solid #9a9da0; border-radius: 5px; box-sizing: border-box"></div>')
    slip = f'''<div style="position: absolute; left: 432px; top: 952px; width: 300px; padding: 22px 22px 20px; box-sizing: border-box; background: #fbf7ec;
      box-shadow: 0 1px 2px rgba(60,45,20,0.18), 0 6px 14px rgba(60,45,20,0.10); transform: rotate(1.6deg); font-family: {CP}; font-size: 16px; line-height: 1.35; color: #2c2a28">
      {clip}
      <div style="font-weight: 700; letter-spacing: 0.04em">HEAD STEWARD’S NOTICE</div>
      <div style="margin-top: 10px">The Dining Room closes at 4 P.M. on Christmas Eve and New Year’s Eve.</div>
      <div style="margin-top: 10px">Closing prices from the exchanges are posted in the Library at 5 P.M. Pork bellies and orange juice added at members’ request.</div>
    </div>'''
    return f'''{frame()}
<div style="position: absolute; left: 76px; top: 72px; width: {W - 152}px; text-align: center">
  {medallion(76)}
  <h1 style="margin: 14px 0 0; font-family: {CG}; font-weight: 700; font-size: 42px; line-height: 1; letter-spacing: 0.12em; padding-left: 0.12em; color: {GREEN}">THE MEMBERS’ BAR</h1>
  <div style="margin: 10px 0 16px; font-family: {LC}; font-style: italic; font-size: 16px; color: {SOFT}">Open from eleven in the morning until midnight</div>
  {ornament()}
</div>
<div style="position: absolute; left: 76px; top: 300px; width: {W - 152}px; display: flex; gap: 44px">
  <div style="flex: 1">{bar_col(BAR_L)}</div>
  <div style="width: 1px; background: {GREEN}; opacity: 0.4"></div>
  <div style="flex: 1">{bar_col(BAR_R)}</div>
</div>
<div style="position: absolute; left: 76px; top: 726px; width: {W - 152}px; box-sizing: border-box; border: 2px solid {GREEN}; padding: 4px">
  <div style="border: 1px solid {GREEN}; padding: 18px 34px 20px; text-align: center">
    <div style="font-family: {CG}; font-weight: 700; font-size: 30px; letter-spacing: 0.14em; padding-left: 0.14em; color: {GREEN}">THE WAGER BOOK</div>
    <p style="margin: 8px 0 0; font-family: {LC}; font-size: 16px; line-height: 1.45; color: {INK}; text-wrap: balance">Wagers between members are entered in the book kept behind the bar, signed by both parties and settled on the day agreed.</p>
    <p style="margin: 8px 0 0; font-family: {CG}; font-style: italic; font-weight: 600; font-size: 24px; color: {OX}">The customary stake is one dollar.</p>
  </div>
</div>
<div style="position: absolute; left: 76px; top: 966px; width: 320px">
  {head('House rules', 0, center=False)}
  {rules}
</div>
<img src="assets/stain-port.png" alt="" aria-hidden="true" style="position: absolute; left: 572px; top: 580px; width: 200px; height: 200px; pointer-events: none; display: block">
{slip}
<div style="position: absolute; left: 76px; top: {H - 112}px; width: {W - 152}px; text-align: center">
  {ornament(110)}
  <p style="margin: 12px 0 0; font-family: {LC}; font-size: 16px; color: {SOFT}">Members’ accounts are rendered on the first of each month.</p>
</div>
{grain('back')}'''

FACES = {'front': front(), 'back': back()}
for name, body in FACES.items():
    root = f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}">{body}</div>'
    open(os.path.join(D, name + '.body.html'), 'w').write(root)
    open(os.path.join(D, name + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>The Heritage Club, {name}</title>{LINK}'
        f'<style>body{{margin:0}}h1,h3,p{{font-weight:inherit}}</style></head><body>{root}</body></html>')
print('built')
