"""Builds both faces of the Fox & Sons Books cafe card: 5.5 x 8.5 in (US half letter),
two sided, flat, four colour process on gloss coated card, fall 1998.
Writes front.html and back.html from the .body.html files, and the phone labels."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))
W, H = 528, 816
FLOOD, CREAM, INK, BODY, TAUPE, TINT = '#6a1824', '#f3e9d5', '#231a17', '#3e322c', '#5a4844', '#f1e8d8'
CSS2 = 'family=Bodoni+Moda:wght@700&family=Cinzel:wght@600;700&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400'
FONT_LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{CSS2}&display=swap">'
FILM = "You've Got Mail (1998)"

# The espresso bar: (spec key or None, name, description, short, tall, grande)
BAR = [
    (None, 'Coffee of the day', 'A different roast each morning, brewed by the hour.', '1.25', '1.45', '1.65'),
    (None, 'Caffe latte', 'Espresso and steamed milk under a thin layer of foam.', '2.45', '2.95', '3.35'),
    ('Tall decaf cappuccino', 'Cappuccino', 'Double espresso and steamed milk, topped high with foam.', '2.45', '2.95', '3.35'),
    (None, 'Caffe mocha', 'Espresso, dark chocolate and milk, with whipped cream.', '2.75', '3.25', '3.60'),
    (None, 'Hot cocoa', 'Bittersweet chocolate melted into whole milk.', '1.75', '2.10', '2.40'),
    (None, 'Hot apple cider', 'Mulled with cinnamon and clove all through the fall.', '1.75', '2.10', '2.40'),
]
# The kitchen: (section, [(spec key or None, name, description, price)], note)
FOOD = [
    ('The bakery case', [
        ('Cafe cheesecake', 'New York cheesecake', 'Rich and dense, with sugared fresh strawberries.', '3.95'),
        (None, 'Lemon poppy seed muffin', 'Made each morning, under a sharp lemon glaze.', '1.75'),
        (None, 'Almond biscotti', 'Twice baked and crisp. Good with an espresso.', '1.25')], None),
    ('Soup, bagels and sandwiches', [
        (None, 'Chicken noodle soup', 'Egg noodles, carrot, celery and dill. By the cup or bowl.', '2.25 / 3.25'),
        ('Upper West Side bagels', 'Toasted mini bagels', 'Three to an order, with scallion cream cheese and cracked pepper.', '3.25'),
        ('Fox Books cafe sandwiches', 'Pressed turkey and brie', 'On sourdough with cranberry sauce, grilled until the cheese runs.', '6.50')], None),
    ('Book party platters', [
        ('Publishing party salmon cucumber bites', 'Smoked salmon on cucumber', 'Two dozen, with dill cream cheese, capers and black pepper.', '32.00')],
        'For signings and reading groups. Two days\u2019 notice, please.'),
]
STORE = [
    [('Reading group', 'Thursdays at 7 in the cafe. This month, <i>Pride and Prejudice</i>.'),
     ('Storytime', 'Saturdays at 11, children’s department. This fall, the Shoe books.')],
    [('Store hours', 'Every day, 9 AM to 11 PM. The cafe closes at 10:30.'),
     ('Back to school', 'Notebooks, planners and bouquets of sharpened pencils by the door.')],
]
LABELS = {
    'Publishing party salmon cucumber bites': {'n': 'Smoked salmon on cucumber', 'd': 'Two dozen, with dill cream cheese, capers and black pepper.', 'note': 'Book party platter. Order two days ahead.'},
    'Upper West Side bagels': {'n': 'Toasted mini bagels', 'd': 'Three to an order, with scallion cream cheese and cracked pepper.', 'note': 'Soup, bagels and sandwiches.'},
    'Fox Books cafe sandwiches': {'n': 'Pressed turkey and brie', 'd': 'On sourdough with cranberry sauce, grilled until the cheese runs.', 'note': 'From the cafe kitchen, 6.50.'},
    'Cafe cheesecake': {'n': 'New York cheesecake', 'd': 'Rich and dense, with sugared fresh strawberries.', 'note': 'From the bakery case, 3.95.'},
    'Tall decaf cappuccino': {'n': 'Cappuccino', 'd': 'Double decaf espresso and steamed milk, topped high with foam.', 'note': 'Tall. Decaf. Cappuccino. 2.95'},
}
MIS = 'text-shadow: 0 -0.6px 0 rgba(214, 160, 60, 0.45)'      # yellow plate a hair high on burgundy type


def lockup(size, on_flood):
    fg = CREAM if on_flood else FLOOD
    plate_bg, plate_fg = (TAUPE, CREAM)
    box = max(12, round(size * 0.33))
    sh = 'text-shadow: -0.6px 0 0 rgba(175, 40, 72, 0.75)' if on_flood else MIS
    return (f'<div style="display: flex; align-items: center; justify-content: center; gap: {round(size * 0.2)}px; color: {fg}; '
            f'font-family: \'Bodoni Moda\', serif; font-weight: 700; font-size: {size}px; line-height: 1; letter-spacing: 0.03em; {sh}">'
            f'<span>FOX</span><span style="font-family: \'EB Garamond\', serif; font-weight: 500; font-size: {box}px; letter-spacing: 0.04em; text-shadow: none; '
            f'background: {plate_bg}; color: {plate_fg}; padding: {round(box * 0.24)}px {round(box * 0.42)}px {round(box * 0.2)}px; line-height: 1; border: 1px solid {"#8d7670" if on_flood else TAUPE}">&amp; SONS</span><span>BOOKS</span></div>')


def bar():
    col = 'width: 64px; text-align: center'
    head = (f'<div style="display: flex; align-items: flex-end; border-bottom: 2px solid {INK}; padding-bottom: 5px">'
            f'<div style="flex: 1; font-family: \'Cinzel\', serif; font-weight: 700; font-size: 17px; letter-spacing: 0.12em; color: {FLOOD}; {MIS}">The Espresso Bar</div>'
            + ''.join(f'<span style="{col}; font-family: \'Cinzel\', serif; font-weight: 700; font-size: 12px; letter-spacing: 0.03em; color: {BODY}">{c}</span>' for c in ('SHORT', 'TALL', 'GRANDE'))
            + '</div>')
    rows = ''
    for i, (_, n, d, s, t, g) in enumerate(BAR):
        bg = f'background: {TINT}; ' if i % 2 == 1 else ''
        rows += f'''<div style="{bg}padding: 3px 6px 4px; margin: 0 -6px">
          <div style="display: flex; align-items: baseline">
            <h3 style="flex: 1; margin: 0; font-weight: 600; font-size: 20px; line-height: 1.1">{n}</h3>
            {''.join(f'<span style="{col}; font-weight: 500; font-size: 18px; font-variant-numeric: lining-nums">{p}</span>' for p in (s, t, g))}</div>
          <p style="margin: 0; font-size: 16px; line-height: 1.2; color: {BODY}">{d}</p></div>'''
    return head + f'<div style="margin-top: 4px">{rows}</div>'


def food():
    out = ''
    for i, (sec, items, note) in enumerate(FOOD):
        rows = ''
        for _, n, d, p in items:
            rows += f'''<div style="display: flex; align-items: baseline; gap: 14px; margin-top: 6px">
              <div style="flex: 1; min-width: 0">
                <h3 style="margin: 0; font-weight: 600; font-size: 20px; line-height: 1.05">{n}</h3>
                <p style="margin: 1px 0 0; font-size: 16px; line-height: 1.2; color: {BODY}">{d}</p></div>
              <span style="font-weight: 500; font-size: 18px; white-space: nowrap; font-variant-numeric: lining-nums">{p}</span></div>'''
        nt = (f'<p style="margin: 5px 0 0; font-style: italic; font-size: 16px; line-height: 1.25; color: {FLOOD}">{note}</p>' if note else '')
        out += (f'<div style="{"" if i == 0 else "margin-top: 14px"}"><div style="border-bottom: 1px solid {FLOOD}; padding-bottom: 3px; '
                f'font-family: \'Cinzel\', serif; font-weight: 700; font-size: 14px; letter-spacing: 0.14em; color: {FLOOD}; {MIS}">{sec}</div>{rows}{nt}</div>')
    return out


def store():
    cols = ''
    for c in STORE:
        cell = ''
        for j, (t, d) in enumerate(c):
            cell += (f'<div style="{"" if j == 0 else "margin-top: 7px"}"><div style="font-family: \'Cinzel\', serif; font-weight: 700; font-size: 12px; letter-spacing: 0.14em; color: {FLOOD}">{t.upper()}</div>'
                     f'<p style="margin: 1px 0 0; font-size: 16px; line-height: 1.22; text-wrap: pretty">{d}</p></div>')
        cols += f'<div style="flex: 1; min-width: 0">{cell}</div>'
    return cols


def overlays(face):
    s = ''
    if face == 'front':
        s += f'<img src="assets/wear-front.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    else:
        s += f'<img src="assets/stain-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 250px; top: 590px; width: 200px; height: 200px; pointer-events: none; display: block; opacity: 0.55">'
        s += f'<img src="assets/wear-back.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    s += f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: -313px; top: 0; width: 1154px; height: {H}px; opacity: 0.35; pointer-events: none; display: block">'
    s += f'<img src="assets/paper-gloss.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    return s


for face in ('front', 'back'):
    b = open(os.path.join(D, face + '.body.html')).read()
    b = (b.replace('{{LOCKUP}}', lockup(48, True)).replace('{{LOCKUP_SM}}', '<div style="flex-shrink: 0">' + lockup(22, False) + '</div>')
          .replace('{{BAR}}', bar()).replace('{{FOOD}}', food()).replace('{{STORE}}', store()))
    i = b.rindex('</div>')
    b = b[:i] + overlays(face) + b[i:]
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">'
        f'<title>Fox &amp; Sons Books cafe card, {face}</title>{FONT_LINK}'
        f'<style>body{{margin:0;background:#faf7f0}}</style></head><body>{b}</body></html>')

json.dump({FILM: LABELS}, open(os.path.join(D, 'bookshopcafe.labels.json'), 'w'), indent=1, ensure_ascii=False)
json.dump({'fmt': 'bookshopcafe', 'fn': 'fmtBookshopCafe', 'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
           'mm': [139.7, 215.9], 'fonts': CSS2, 'fams': ['Bodoni Moda', 'Cinzel', 'EB Garamond'],
           'phone': {'disp': "'Bodoni Moda',serif", 'title': "'Cinzel',serif", 'name': "'EB Garamond',serif",
                     'body': "'EB Garamond',serif", 'price': "'EB Garamond',serif", 'note': "'EB Garamond',serif"}},
          open(os.path.join(D, 'film.json'), 'w'), indent=1)
print('built')
