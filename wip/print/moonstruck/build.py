"""Builds the St. Cecilia's Church Sunday bulletin (Moonstruck, 1987).
One 11 x 8.5 in sheet folded once to 5.5 x 8.5 in: outside.html (page 4 | page 1) and
inside.html (page 2 | page 3). Writes one full HTML file per face, paths relative to this folder."""
import os, random, html
D = os.path.dirname(os.path.abspath(__file__))
INK, OCHRE, OCHRE_TXT, PAPER = '#1d1b18', '#b8862c', '#9a6a1a', '#f1ebdc'
FONTS = ('family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400'
         '&family=Oswald:wght@500;600&family=UnifrakturMaguntia')
FW, FH = 1056, 816
rnd = random.Random(1987)

# ---------- type helpers ----------
def typed(text, size=16, lh=1.34, bold=False, extra=''):
    """Selectric copy: each word sits a hair off the line and takes a slightly different amount of ink."""
    out = []
    for word in text.split(' '):
        top = rnd.choice((0, 0, 0, 0.4, -0.4, 0.6))
        c = rnd.choice(('#1d1b18', '#1d1b18', '#24211d', '#2b2823', '#191714'))
        out.append(f'<span style="position: relative; top: {top}px; color: {c}">{word}</span>')
    w = 'font-weight: 700; ' if bold else ''
    return (f'<div style="font-family: \'Courier Prime\', \'Courier New\', monospace; {w}font-size: {size}px; '
            f'line-height: {lh}; {extra}">{" ".join(out)}</div>')

def typed_head(text, gap=11):
    """Typed caps, underscored with the typewriter's own underline."""
    return (f'<div style="margin-top: {gap}px; font-family: \'Courier Prime\', monospace; font-weight: 700; font-size: 16px; '
            f'line-height: 1.2; text-decoration: underline; text-underline-offset: 3px; text-decoration-thickness: 1.5px">{text}</div>')

def dish(name, desc, price='', size=19, gap=10, face="'Old Standard TT', serif"):
    p = (f'<span style="font-family: {face}; font-weight: 700; font-size: 17px; white-space: nowrap">{price}</span>' if price else '')
    return (f'<div style="margin-top: {gap}px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
            f'<span style="font-family: {face}; font-weight: 700; font-size: {size}px; line-height: 1.1">{name}</span>{p}</div>'
            f'<div style="font-family: {face}; font-size: 16px; line-height: 1.28; margin-top: 2px">{desc}</div></div>')

def paste(inner, x, y, w, pad='14px 16px', border=f'1.5px solid {INK}', extra=''):
    """A flyer pasted onto the board: its own rule, plus the faint shadow line of the cut paper edge."""
    return (f'<div style="position: absolute; left: {x - 7}px; top: {y - 6}px; width: {w + 14}px; height: calc(100% - {y - 6}px); pointer-events: none"></div>'
            f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; box-sizing: border-box; border: {border}; padding: {pad}; {extra}">{inner}</div>')

# ---------- page 1: the parish's imprint on the cover ----------
COVER_L = (typed_head('MASSES', 0) +
    typed('Saturday vigil 5:30 PM') +
    typed('Sunday 7:30, 9, 10:30 (Italian) and noon', extra='margin-top: 6px') +
    typed('Weekdays 7 and 8 AM', extra='margin-top: 6px') +
    typed_head('CONFESSIONS', 12) +
    typed('Saturday 3:30 to 5 PM, or by appointment.'))
COVER_R = (typed_head('RECTORY', 0) +
    typed('Msgr. Amato, Pastor') +
    typed('Rev. Peter Kelleher', extra='margin-top: 6px') +
    typed('Office open 9 to 5 for baptisms, weddings and sick calls.', extra='margin-top: 6px') +
    typed('Tel. 555-0119', extra='margin-top: 6px'))
COVER_B = (typed_head('THIS WEEK', 0) +
    typed('Monday 7:30 PM, novena to St. Cecilia, patroness of musicians. The choir sings.'))

# ---------- page 4: the advertisers ----------
def ad(name, body, foot, face="'Old Standard TT', serif", nsize=19, nstyle='font-weight: 700', cut=None, center=False):
    al = 'text-align: center; ' if center else ''
    c = ''
    if cut:
        src, cw, ch = cut
        c = f'<img src="assets/{src}" alt="" style="display: block; width: {cw}px; height: {ch}px; margin: 0 auto 4px">'
    return (f'<div style="box-sizing: border-box; border: 1.5px solid {INK}; padding: 9px 11px 8px; display: flex; flex-direction: column; justify-content: space-between; {al}">'
            f'<div>{c}<div style="font-family: {face}; {nstyle}; font-size: {nsize}px; line-height: 1.05">{name}</div>'
            f'<div style="font-family: \'Old Standard TT\', serif; font-size: 13.5px; line-height: 1.24; margin-top: 4px">{body}</div></div>'
            f'<div style="font-family: \'Old Standard TT\', serif; font-weight: 700; font-size: 13px; line-height: 1.2; margin-top: 3px">{foot}</div></div>')

OSW = "'Oswald', sans-serif"
ADS = ''.join([
    ad('THE BROTHERS&#8217; BAKERY', 'Bread, rolls, focaccia and cannoli. The ovens are downstairs. Sliced to order, carefully.',
       'Open 6 AM. Tel. 555-0163', face=OSW, nstyle='font-weight: 600; letter-spacing: 0.04em', nsize=18),
    ad('C. Castorini', '<b>Plumbing and Heating.</b> Boilers, baths and kitchens. Copper pipe? Ask us why.',
       'Licensed. Tel. 555-0137', face="'UnifrakturMaguntia', serif", nstyle='font-weight: 400', nsize=24),
    ad('Kings Travel', 'Flights to Palermo, Rome and all of Italy. Passports arranged.',
       'Ask for Angela. 555-0148', face=OSW, nstyle='font-weight: 600; letter-spacing: 0.06em', nsize=19, cut=('ad-plane-linecut.png', 96, 37), center=True),
    ad('DeMarco Jewelers', 'Engagement rings, wedding bands, watch repair.',
       'No ring? See us first.', nstyle='font-weight: 700; font-style: italic', nsize=20, cut=('ad-ring-linecut.png', 34, 34), center=True),
    ad('Carmela&#8217;s Salon', 'Cut, set and color. We cover gray. Manicures on Saturday. Walk-ins Tuesday to Saturday.',
       'Tel. 555-0172', nstyle='font-weight: 400; font-style: italic', nsize=21),
    ad('GOWNS BY ADELE', 'Evening dresses and coats, and shoes to match. Alterations ready by Friday.',
       'Tel. 555-0126', nstyle='font-weight: 700; letter-spacing: 0.08em', nsize=17),
    ad('Formal Wear', '<b>Tuxedo rental</b> for weddings, proms and the opera. Shoes and studs included.',
       'Fittings nightly. 555-0181', face=OSW, nstyle='font-weight: 500; letter-spacing: 0.04em', nsize=20),
    ad('PUGLIESE PORK STORE', 'Veal and chicken cutlets pounded while you wait. Sweet and hot sausage made daily.',
       'Tel. 555-0155', face=OSW, nstyle='font-weight: 600', nsize=18),
    ad('Corner Wines &amp; Liquors', 'Asti Spumante by the case for engagements. We deliver.',
       'Tel. 555-0114', nstyle='font-weight: 700', nsize=18),
    ad('Tedeschi Funeral Home', 'Family owned since 1921. Chapel and private parking.',
       'Day or night. 555-0102', nstyle='font-weight: 400; font-variant: small-caps; letter-spacing: 0.02em', nsize=16, center=True),
])

# ---------- page 2: typed parish notes ----------
P2 = (
    f'<div style="display: flex; justify-content: space-between; font-family: \'Courier Prime\', monospace; font-size: 13px; line-height: 1">'
    f'<span>ST. CECILIA&#8217;S CHURCH</span><span>FROM THE RECTORY</span></div>'
    f'<div style="margin-top: 6px; height: 1.5px; background: {INK}"></div>'
    + typed_head('BANNS OF MARRIAGE', 12)
    + typed('Loretta Castorini and John Cammareri, both of this parish. First time of asking.')
    + typed('Anthony Ferraro and Donna Lisi, second time.', extra='margin-top: 5px')
    + typed('Objections? Please see the pastor.', extra='margin-top: 5px; font-style: italic')
    + typed_head('PLEASE PRAY FOR THE SICK')
    + typed('Mrs. Cammareri (in Palermo), Frank Spina, Ann Marie Doyle and our homebound.')
    + typed_head('ON THE FRONT STEPS')
    + typed('Dog walkers, please keep the steps clear before the 9 o&#8217;clock Mass. This means the gentleman with all the dogs.')
    + typed_head('BINGO') + typed('Every Tuesday, 7:30 PM, school hall.')
    + '{{COLLECTION}}'
    + '{{BREAKFAST}}'
)
COLLECTION = (
    '<div style="display: flex; gap: 14px; align-items: flex-start">'
    '<div style="flex: 1">' + typed_head("LAST SUNDAY&#8217;S COLLECTION") +
    typed('Envelopes and loose $3,418.50') + typed('Roof fund $612.00') +
    typed('The roof fund now stands at $27,200 of $40,000. Thank you.', extra='margin-top: 4px') +
    '</div>'
    '<div style="position: relative; width: 70px; height: 124px; margin-top: 14px">'
    '<img src="assets/roof-fund-thermometer.png" alt="Roof fund thermometer" style="position: absolute; left: 0; top: 0; width: 32px; height: 124px; display: block">'
    '<div style="position: absolute; left: 34px; top: 2px; width: 36px; font-family: \'Courier Prime\', monospace; font-size: 12px; line-height: 1">40,000</div>'
    '<div style="position: absolute; left: 34px; top: 50px; width: 36px; font-family: \'Courier Prime\', monospace; font-size: 12px; line-height: 1">20,000</div>'
    '</div></div>')

BREAKFAST_ITEMS = [
    ('Eggs in the hole', 'Thick white toast fried in butter with a ring of sweet red pepper, the yolk left soft in the middle.'),
    ('Sausage and home fries', 'Sweet links from the pork store, potatoes crisped with onion.'),
]
BREAKFAST = (
    '<div style="margin-top: 14px; position: relative">'
    '<div style="position: absolute; left: -7px; top: -6px; right: -7px; bottom: -6px; border: 1px solid rgba(60,52,40,0.10)"></div>'
    f'<div style="border: 1.5px solid {INK}; padding: 10px 14px 12px">'
    '<div style="display: flex; justify-content: space-between; align-items: baseline">'
    "<span style=\"font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 17px; letter-spacing: 0.06em; line-height: 1.1\">HOLY NAME SOCIETY</span>"
    "<span style=\"font-family: 'Old Standard TT', serif; font-weight: 700; font-size: 16px\">$5.00</span></div>"
    "<div style=\"font-family: 'Old Standard TT', serif; font-style: italic; font-size: 16px; line-height: 1.28\">Communion breakfast after the 9 o&#8217;clock Mass, school cafeteria. Juice and coffee included. Children $3.00.</div>"
    + ''.join(dish(n, d, gap=7, size=18) for n, d in BREAKFAST_ITEMS) +
    '</div></div>')

# ---------- page 3: the dinner dance flyer and the bake sale ----------
DINNER = [
    ('Antipasto', 'Salami, provolone, roasted peppers and olives.'),
    ('Escarole soup', 'Tiny meatballs, grated cheese.'),
    ('Baked ziti', 'Ricotta and mozzarella in Sunday gravy.'),
    ('Chicken scaloppine', 'Cutlets pounded thin, floured and sautéed with lemon, white wine, capers and butter.'),
    ('Sheet cake', 'Coffee and anisette to finish.'),
]
BAR = [
    ('Amaretto sour', 'Shaken frothy with lemon and egg white, over ice, with a cherry.', '2.50'),
    ('Highballs', 'Rye and ginger ale, scotch and soda.', '2.50'),
    ('House wine', 'Red or white.', '2.00'),
    ('Beer', 'Cold, by the bottle.', '1.50'),
    ('Soda', 'For the children.', '.75'),
]
BAKE = [
    ('Rosemary focaccia', 'Olive oil bread from sheet pans, dimpled, with coarse salt. Slices .75', '4.00'),
    ('Cannoli', 'Sweet ricotta and grated orange peel, ends dipped in chocolate. Filled to order.', '1.00'),
]

def col_head(t):
    return (f'<div style="font-family: \'Oswald\', sans-serif; font-weight: 600; font-size: 16px; letter-spacing: 0.14em; line-height: 1; '
            f'padding-bottom: 5px; border-bottom: 1.5px solid {INK}">{t}</div>')

def bake_item(n, d, p):
    return (f'<div style="margin-top: 8px"><div style="display: flex; justify-content: space-between; align-items: baseline; gap: 8px">'
            f"<span style=\"font-family: 'Old Standard TT', serif; font-weight: 700; font-size: 18px; line-height: 1.1\">{n}</span>"
            f"<span style=\"font-family: 'Old Standard TT', serif; font-weight: 700; font-size: 15px; line-height: 1.1; text-align: right; white-space: nowrap\">{p}</span></div>"
            f"<div style=\"font-family: 'Old Standard TT', serif; font-size: 16px; line-height: 1.26; margin-top: 2px\">{d}</div></div>")

FLYER = (
    f'<div style="border: 4px double {INK}; padding: 12px 16px 14px">'
    '<div style="display: flex; gap: 14px; align-items: center">'
    '<img src="assets/dance-moon-linecut.png" alt="A full moon" style="display: block; width: 92px; height: 92px; flex: none">'
    '<div style="flex: 1; text-align: center">'
    "<div style=\"font-family: 'Old Standard TT', serif; font-style: italic; font-size: 16px; line-height: 1.2\">The Parish Council invites you to the</div>"
    "<div style=\"font-family: 'Old Standard TT', serif; font-style: italic; font-weight: 700; font-size: 46px; line-height: 1; margin-top: 2px\">Bella Luna</div>"
    "<div style=\"font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 22px; letter-spacing: 0.22em; padding-left: 0.22em; line-height: 1.1; margin-top: 4px\">DINNER DANCE</div>"
    '</div></div>'
    "<div style=\"margin-top: 10px; text-align: center; font-family: 'Old Standard TT', serif; font-size: 16px; line-height: 1.3\">"
    'Saturday at 7 PM, school hall. Music by the Sal Esposito Trio. <b>$22.50 a person</b>, tickets at the rectory.</div>'
    '<div style="display: flex; gap: 18px; margin-top: 10px">'
    '<div style="flex: 1.4">' + col_head('DINNER') + ''.join(dish(n, d, gap=6, size=18) for n, d in DINNER) + '</div>'
    '<div style="flex: 1">' + col_head('CASH BAR') + ''.join(dish(n, d, p, gap=6, size=18) for n, d, p in BAR) + '</div>'
    '</div>'
    '</div>')

BAKESALE = (
    '<div style="border: 1.5px solid ' + INK + '; padding: 10px 14px 12px">'
    '<div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">'
    "<span style=\"font-family: 'Oswald', sans-serif; font-weight: 600; font-size: 17px; letter-spacing: 0.06em; line-height: 1.1\">ROSARY SOCIETY BAKE SALE</span>"
    "<span style=\"font-family: 'Old Standard TT', serif; font-style: italic; font-size: 15px\">after every Mass</span></div>"
    '<div style="display: grid; grid-template-columns: 1fr 1fr; column-gap: 18px">'
    + ''.join(bake_item(*b) for b in BAKE) +
    '</div>'
    "<div style=\"margin-top: 8px; font-family: 'Old Standard TT', serif; font-size: 16px; line-height: 1.26\">Also pignoli and rainbow cookies by the pound.</div>"
    '</div>')

P3 = (
    '<div style="position: relative">'
    '<div style="position: absolute; left: -7px; top: -6px; right: -7px; bottom: -6px; border: 1px solid rgba(60,52,40,0.10)"></div>'
    + FLYER + '</div>'
    '<div style="position: relative; margin-top: {{GAP3}}px">'
    '<div style="position: absolute; left: -6px; top: -5px; right: -8px; bottom: -6px; border: 1px solid rgba(60,52,40,0.10)"></div>'
    + BAKESALE + '</div>'
)

LAYOUT = {'MAST': 44, 'GAP3': 16}

def fill(s):
    for k, v in {'INK': INK, 'OCHRE': OCHRE, 'OCHRE_TXT': OCHRE_TXT, 'ADS': ADS, 'COVER_L': COVER_L, 'COVER_R': COVER_R, 'COVER_B': COVER_B,
                 'P2': P2, 'P3': P3, 'COLLECTION': COLLECTION, 'BREAKFAST': BREAKFAST}.items():
        s = s.replace('{{' + k + '}}', v)
    for k, v in LAYOUT.items():
        s = s.replace('{{' + k + '}}', str(v))
    return s

def face(name):
    body = fill(fill(open(os.path.join(D, name + '.body.html')).read()))
    grain = (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; '
             f'height: {FH}px; opacity: 0.32; pointer-events: none; display: block">')
    wear = (f'<img src="assets/wear-{name}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; '
            f'height: {FH}px; pointer-events: none; display: block">')
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}">'
            f'{grain}{body}{wear}</div>')

for n in ('outside', 'inside'):
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>St. Cecilia&#8217;s bulletin, {n}</title>'
        f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
        f'<style>body{{margin:0}}</style></head><body>{face(n)}</body></html>')
print('built')
