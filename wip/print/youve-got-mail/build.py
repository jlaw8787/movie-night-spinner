"""Builds both faces of the Fox & Sons Books cafe card (5.5 x 8.5 in, two sided, flat).
Writes front.html and back.html from front.body.html and back.body.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H, B = 528, 816, 11.34
INK, WINE, MUTED, CREAM, RULE = '#241a16', '#7a1f2b', '#5e5047', '#f5efe1', '#bba98f'
FONT_LINK = '<link rel="stylesheet" href="fonts/fonts.css">'

# The espresso bar: (name, description, short, tall)
BAR = [
    ('Coffee of the day', 'Brewed fresh every hour. Ask which roast is on.', '1.25', '1.50'),
    ('Caffe latte', 'Double espresso, steamed milk, a thin layer of foam.', '2.45', '2.95'),
    ('Decaf cappuccino', 'Double shot, steamed milk, a deep cap of foam.', '2.45', '2.95'),
    ('Hot cocoa', 'Dark chocolate, whole milk, whipped cream.', '1.75', '2.25'),
    ('Hot apple cider', 'Mulled with cinnamon and clove, all through the fall.', '1.75', '2.25'),
]
# The kitchen: (section, [(name, description, price)], note)
FOOD = [
    ('From the bakery case', [
        ('New York cheesecake', 'Baked rich and dense, with sugared strawberries.', '3.95'),
        ('Almond biscotti', 'Twice cooked and crisp, made for dunking.', '1.25')], None),
    ('Bagels and sandwiches', [
        ('Toasted mini bagels', 'Three to an order. Scallion cream cheese, cracked pepper.', '3.25'),
        ('Pressed turkey and brie', 'On sourdough with cranberry sauce, hot off the grill.', '6.50')], None),
    ('Book party platters', [
        ('Smoked salmon on cucumber', 'Two dozen, with dill cream cheese, capers and pepper.', '32.00')],
        'For signings and reading groups. Order two days ahead.'),
]
NOTES = [
    ('Reading group', 'Thursdays in the cafe. This month: <i>Pride and Prejudice</i>.'),
    ('Storytime', 'Saturday mornings in the children’s department. Ask us about the Shoe books.'),
    ('Stay a while', 'Take any book to your table. Read as long as you like.'),
]

def wordmark(size):
    box = round(size * 0.36)
    return (f'<div style="display: flex; align-items: center; justify-content: center; gap: {round(size*0.22)}px; color: {WINE}; '
            f'font-family: \'Bodoni Moda\', serif; font-weight: 700; font-size: {size}px; line-height: 1; letter-spacing: 0.02em">'
            f'<span>FOX</span><span style="font-family: \'Libre Franklin\', sans-serif; font-weight: 600; font-size: {box}px; letter-spacing: 0.08em; '
            f'background: #3b3431; color: #f5efe1; padding: {round(box*0.32)}px {round(box*0.45)}px {round(box*0.26)}px; line-height: 1">&amp; SONS</span><span>BOOKS</span></div>')

def head(label, right=''):
    return (f'<div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 1.5px solid {INK}; padding-bottom: 5px">'
            f'<div style="font-family: \'Libre Franklin\', sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.18em; text-transform: uppercase; color: {WINE}">{label}</div>{right}</div>')

def bar():
    cols = ('<div style="display: flex; gap: 0; font-family: \'Libre Franklin\', sans-serif; font-weight: 700; font-size: 12px; letter-spacing: 0.12em; color: #5e5047">'
            '<span style="width: 52px; text-align: right">SHORT</span><span style="width: 52px; text-align: right">TALL</span></div>')
    rows = ''
    for n, d, s, t in BAR:
        rows += f'''<div style="display: flex; align-items: baseline; margin-top: 9px">
          <div style="flex: 1; min-width: 0">
            <h3 style="margin: 0; font-family: 'Bodoni Moda', serif; font-weight: 700; font-size: 20px; line-height: 1.1">{n}</h3>
            <p style="margin: 2px 0 0; font-size: 14px; line-height: 1.3; color: {MUTED}; text-wrap: pretty">{d}</p></div>
          <span style="width: 52px; text-align: right; font-family: 'Bodoni Moda', serif; font-weight: 500; font-size: 18px">{s}</span>
          <span style="width: 52px; text-align: right; font-family: 'Bodoni Moda', serif; font-weight: 500; font-size: 18px">{t}</span></div>'''
    return head('The espresso bar', cols) + rows

def food():
    out = ''
    for i, (sec, items, note) in enumerate(FOOD):
        rows = ''
        for n, d, p in items:
            rows += f'''<div style="display: flex; align-items: baseline; gap: 14px; margin-top: 9px">
              <div style="flex: 1; min-width: 0">
                <h3 style="margin: 0; font-family: 'Bodoni Moda', serif; font-weight: 700; font-size: 20px; line-height: 1.1">{n}</h3>
                <p style="margin: 2px 0 0; font-size: 14px; line-height: 1.3; color: {MUTED}; text-wrap: pretty">{d}</p></div>
              <span style="font-family: 'Bodoni Moda', serif; font-weight: 500; font-size: 18px; white-space: nowrap">{p}</span></div>'''
        nt = (f'<p style="margin: 7px 0 0; font-family: \'Bodoni Moda\', serif; font-style: italic; font-size: 15px; line-height: 1.35; color: {INK}; text-wrap: pretty">{note}</p>' if note else '')
        out += f'<div style="{"" if i == 0 else "margin-top: 20px"}">{head(sec)}{rows}{nt}</div>'
    return out

def notes():
    return ''.join(f'''<div style="{'' if i == 0 else 'margin-top: 8px'}"><span style="font-family: 'Libre Franklin', sans-serif; font-weight: 700; font-size: 12.5px; letter-spacing: 0.12em; text-transform: uppercase; color: {WINE}">{t}</span>
        <p style="margin: 1px 0 0; font-size: 14.5px; line-height: 1.35; text-wrap: pretty">{d}</p></div>''' for i, (t, d) in enumerate(NOTES))

def overlays(face):
    s = f'<img src="assets/grain-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: -{B}px; top: -{B}px; width: {W + 2*B}px; height: {H + 2*B}px; pointer-events: none; display: block">'
    if face == 'back':
        s += '<img src="assets/coffee-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 330px; top: -108px; width: 240px; height: 240px; pointer-events: none; display: block">'
    return s

for face in ('front', 'back'):
    b = open(os.path.join(D, face + '.body.html')).read()
    b = (b.replace('{{WORDMARK}}', wordmark(44)).replace('{{WORDMARK_SM}}', wordmark(19)).replace('{{BAR}}', bar())
          .replace('{{FOOD}}', food()).replace('{{NOTES}}', notes()))
    i = b.rindex('</div>')
    b = b[:i] + overlays(face) + b[i:]
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Fox &amp; Sons Books cafe card, {face}</title>{FONT_LINK}'
        f'<style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
