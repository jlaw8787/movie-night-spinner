"""Builds both faces of the Departure Lounge table card, 1990.
4.25 x 11 in (a tall two-sided table card, flat, no folds), 408 x 1056 px per face.
Writes front.html and back.html from front.body.html and back.body.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 408, 1056
NAVY, AMBER, INK, MUTED, RULE = '#1c2847', '#e0892b', '#1f2333', '#545a6b', '#b9b2a2'
FONTS = 'family=Archivo:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400&family=Archivo+Narrow:wght@600;700&family=Space+Mono:wght@700'
FONT_LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
NARROW = "'Archivo Narrow', sans-serif"

# split-flap board over the bar: (label, status)
BOARD = [('BAR', 'OPEN'), ('KITCHEN', 'TO 11PM'), ('LAST CALL', '11:30')]
KITCHEN = [
    ('Stuffed cherry tomatoes', 'A dozen, filled with whipped feta, fresh basil and lemon zest.', '3.95'),
    ('Honey-lime chicken wings', 'Roasted crisp, tossed in butter with sweet chili sauce, red pepper flakes and fresh cilantro.', '5.95'),
    ('Turkey and Swiss on a kaiser', 'Lettuce, tomato, mayo and mustard. Wrapped tight in paper so it travels.', '5.25'),
    ('Shrimp cocktail', 'Five jumbo shrimp on ice with horseradish red sauce and a lemon wedge.', '7.50'),
]
COCKTAILS = [
    ('Wheels Up bourbon smash', 'Fresh mint and lemon muddled with sugar, shaken hard and poured over crushed ice.', '4.75'),
    ('Screwdriver', 'Vodka and fresh orange juice over ice.', '4.25'),
]
SMALL = [('Draft beer', '16 oz glass', '3.25'), ('House wine', 'Red, white or blush', '3.75'),
         ('Coffee', 'Free refills', '1.00'), ('Sodas', 'Cola, ginger ale, lemon-lime', '1.25')]
KID_DRINK = ('Milk or orange juice', 'Small glass', '.95')
KIDS = [
    ('Clown cake', 'Jam sponge under white buttercream, a piped face and a cherry nose.', '2.25'),
    ('Grilled cheese', 'American cheese on white bread, with fries.', '3.50'),
]
NOTES = [
    ('Airport buses', 'Exact change only.'),
    ('Taxis', 'Agree the route with your driver.'),
    ('From Brooklyn', 'Expressway signs are down for roadwork. Allow extra time.'),
    ('Police and flight crews', 'Coffee is on us.'),
]

def head(label, right=''):
    r = f'<span style="font-family: {NARROW}; font-weight: 600; font-size: 13px; letter-spacing: 0.08em; color: {MUTED}">{right}</span>' if right else ''
    return (f'<div style="display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2px solid {NAVY}; padding-bottom: 5px">'
            f'<span style="font-family: {NARROW}; font-weight: 700; font-size: 15px; letter-spacing: 0.2em; color: {NAVY}">{label}</span>{r}</div>')

def item(n, d, p, top=12):
    return (f'<div style="margin-top: {top}px"><div style="display: flex; align-items: baseline; gap: 12px">'
            f'<h3 style="flex: 1; min-width: 0; margin: 0; font-weight: 700; font-size: 20px; line-height: 1.15; color: {INK}">{n}</h3>'
            f'<span style="font-family: \'Space Mono\', monospace; font-weight: 700; font-size: 17px; color: {NAVY}">{p}</span></div>'
            f'<p style="margin: 3px 0 0; font-size: 16px; line-height: 1.36; color: #3b4152; text-wrap: pretty">{d}</p></div>')

def flap(ch, amber):
    col = '#f2b04a' if amber else '#ece6d6'
    t = ch if ch != ' ' else '&nbsp;'
    return (f'<div style="position: relative; width: 17px; height: 26px; background: #2a2d36; border-radius: 2px; text-align: center; '
            f'font-family: \'Space Mono\', monospace; font-weight: 700; font-size: 17px; line-height: 26px; color: {col}">{t}'
            f'<div style="position: absolute; left: 0; top: 12.5px; width: 17px; height: 1px; background: #15171d"></div></div>')

def board():
    rows = ''
    for i, (a, b) in enumerate(BOARD):
        pad = 18 - len(a) - len(b)
        cells = ''.join(flap(c, False) for c in a) + ''.join(flap(' ', False) for _ in range(pad)) + ''.join(flap(c, True) for c in b)
        rows += f'<div style="display: flex; gap: 1px; {"" if i == 0 else "margin-top: 3px"}">{cells}</div>'
    return (f'<div style="margin-top: 20px; background: #16181f; padding: 8px 5px 9px; border-radius: 3px">'
            f'<div style="font-family: {NARROW}; font-weight: 700; font-size: 12px; letter-spacing: 0.24em; color: #f2b04a; margin: 0 0 6px 2px">NOW SERVING</div>{rows}</div>')

def kitchen():
    return '<div style="margin-top: 24px">' + head('LIGHT FARE', 'FROM 11 AM') + ''.join(item(*x) for x in KITCHEN) + '</div>'

def bar():
    s = head('COCKTAILS') + ''.join(item(*x) for x in COCKTAILS)
    rows = ''.join(
        f'<div style="display: flex; align-items: baseline; gap: 8px; margin-top: 7px"><span style="font-weight: 700; font-size: 18px; color: {INK}">{n}</span>'
        f'<span style="flex: 1; min-width: 0; font-size: 16px; color: #3b4152">{d}</span>'
        f'<span style="font-family: \'Space Mono\', monospace; font-weight: 700; font-size: 17px; color: {NAVY}">{p}</span></div>' for n, d, p in SMALL)
    return s + f'<div style="margin-top: 26px">{head("MORE TO DRINK")}<div style="margin-top: 4px">{rows}</div></div>'

def small(n, d, p):
    return (f'<div style="display: flex; align-items: baseline; gap: 8px; margin-top: 7px"><span style="font-weight: 700; font-size: 18px; color: {INK}">{n}</span>'
            f'<span style="flex: 1; min-width: 0; font-size: 16px; color: #3b4152">{d}</span>'
            f'<span style="font-family: \'Space Mono\', monospace; font-weight: 700; font-size: 17px; color: {NAVY}">{p}</span></div>')

def kids():
    return f'<div style="margin-top: 26px">{head("YOUNG TRAVELERS", "12 AND UNDER")}' + ''.join(item(*x) for x in KIDS) + f'<div style="margin-top: 5px">{small(*KID_DRINK)}</div></div>'

def notes():
    rows = ''.join(f'<p style="margin: {0 if i == 0 else 7}px 0 0; font-size: 16px; line-height: 1.35; color: {INK}; text-wrap: pretty"><b style="font-weight: 700">{t}.</b> {d}</p>' for i, (t, d) in enumerate(NOTES))
    return (f'<div style="margin-top: 28px; border: 2px solid {NAVY}; padding: 12px 14px 13px">'
            f'<div style="font-family: {NARROW}; font-weight: 700; font-size: 15px; letter-spacing: 0.2em; color: {AMBER}; margin-bottom: 7px">BEFORE YOU FLY</div>{rows}</div>')

def overlays(face):
    # shared fine grain at its own shape (no stretch), then soft wear, then the glass ring on the back
    s = f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: -540px; top: 0; width: 1494px; height: {H}px; pointer-events: none; display: block">'
    s += f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    if face == 'back':
        s += '<img src="assets/stain-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 292px; top: -96px; width: 210px; height: 210px; pointer-events: none; display: block">'
    return s

for face in ('front', 'back'):
    b = open(os.path.join(D, face + '.body.html')).read()
    b = (b.replace('{{GRAIN}}', '').replace('{{BOARD}}', board()).replace('{{KITCHEN}}', kitchen())
          .replace('{{BAR}}', bar()).replace('{{KIDS}}', kids()).replace('{{NOTES}}', notes()))
    i = b.rindex('</div>')
    b = b[:i] + overlays(face) + b[i:]
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Departure Lounge table card, {face}</title>{FONT_LINK}'
        f'<style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
