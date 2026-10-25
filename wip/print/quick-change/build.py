"""Builds both faces of the Runway Lounge table card, 1990.
A tall two-sided laminated table card that stands in a clear acrylic holder on the bar:
4.25 x 11 in, flat, no folds, 408 x 1056 px per face.
Printed in two spot inks (brown key and orange, with a rust stripe) on oatmeal cover stock.
Writes front.html and back.html from front.body.html and back.body.html."""
import os
D = os.path.dirname(os.path.abspath(__file__))
W, H = 408, 1056
BROWN, ORANGE, RUST, BODY, PAPER = '#42281a', '#e06e22', '#b0401e', '#4a3326', '#ebe3d2'
FONTS = 'family=Michroma&family=Saira+Semi+Condensed:wght@500;600;700&family=Tinos:ital,wght@0,400;0,700;1,400'
FONT_LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
SAIRA = "'Saira Semi Condensed', sans-serif"
TINOS = "'Tinos', serif"

HOURS = [('Coffee', 'From 6 AM'), ('Kitchen', '11 AM to 11 PM'),
         ('Bar', '11 AM to 11:30 PM'), ('Lounge closes', 'Midnight')]
FARE = [
    ('Stuffed cherry tomatoes', 'A dozen, filled with feta cheese beaten smooth with fresh basil and grated lemon peel.', '3.95'),
    ('Thai-style chicken wings', 'Oven-crisped, glazed with honey, butter, lime and sweet chili sauce, under hot pepper flakes and fresh coriander.', '5.95'),
    ('Nachos', 'Tortilla chips under melted Monterey Jack, pickled jalape&ntilde;os, sour cream and salsa.', '4.75'),
    ('Shrimp cocktail', 'Five jumbo shrimp on cracked ice, horseradish red sauce, a wedge of lemon.', '7.50'),
    ('Turkey and Swiss on a kaiser', 'Roast breast, iceberg, tomato, mayo and mustard. Wrapped in deli paper to carry on board.', '5.25'),
]
JULEP = ('Kentucky julep', 'Bourbon shaken with fresh mint, lemon and sugar, poured over crushed ice.', '4.75')
COCKTAILS = [('Bloody Mary', 'With a celery stalk', '4.50'), ('Screwdriver', 'Fresh orange juice', '4.25')]
DRINKS = [('Draft beer', '16 oz glass', '3.25'), ('Imported beer', 'By the bottle', '3.75'),
          ('House wine', 'Chablis or blush', '3.75'), ('Sodas', 'Cola or ginger ale', '1.25'),
          ('Coffee', 'Bottomless cup', '1.00')]
KIDS = [
    ('Clown cake', 'Jam sponge under white buttercream, with a piped face and a cherry nose.', '2.25', 'The crying-on-the-inside kind.'),
    ('Grilled cheese', 'American singles griddled on white bread, with a side of fries.', '3.50', ''),
]
KID_DRINK = ('Milk or orange juice', 'Small glass', '.95')
NOTES = [
    ('City buses', 'Drivers take exact fare only. Our cashier will make change.'),
    ('Driving from Brooklyn', 'Expressway signs are down for construction. Allow extra time.'),
    ('Bound for Fiji', 'Pacific flights board 45 minutes before departure.'),
    ('Police and flight crews', 'Coffee is on the house.'),
]

def head(label, right='', top=0):
    r = (f'<span style="font-family: {SAIRA}; font-weight: 600; font-size: 13px; letter-spacing: 0.1em; color: {RUST}">{right}</span>' if right else '')
    return (f'<div style="position: relative; margin-top: {top}px; height: 26px">'
            # the orange bar sits a hair out of register with the brown rule above it
            f'<div style="position: absolute; left: 1px; right: -1px; bottom: 0; height: 5px; background: {ORANGE}"></div>'
            f'<div style="position: absolute; left: 0; right: 0; bottom: 6px; height: 1px; background: {BROWN}"></div>'
            f'<div style="position: absolute; left: 0; right: 0; top: 0; display: flex; justify-content: space-between; align-items: baseline">'
            f'<span style="font-family: {SAIRA}; font-weight: 700; font-size: 16px; letter-spacing: 0.16em; color: {BROWN}">{label}</span>{r}</div></div>')

def leader(n, p, size=20, weight=700):
    return (f'<div style="display: flex; align-items: baseline; gap: 6px">'
            f'<span style="font-family: {SAIRA}; font-weight: {weight}; font-size: {size}px; line-height: 1.1; color: {BROWN}">{n}</span>'
            f'<span style="flex: 1; min-width: 10px; border-bottom: 2px dotted #9a7c63; transform: translateY(-4px)"></span>'
            f'<span style="font-family: {SAIRA}; font-weight: 700; font-size: {size - 1}px; color: {BROWN}">{p}</span></div>')

def item(n, d, p, top=11, note=''):
    nt = (f'<p style="margin: 2px 0 0; font-family: {SAIRA}; font-weight: 600; font-size: 14px; letter-spacing: 0.04em; color: {ORANGE}">{note}</p>' if note else '')
    return (f'<div style="margin-top: {top}px">{leader(n, p)}'
            f'<p style="margin: 2px 0 0; font-family: {TINOS}; font-size: 16px; line-height: 1.3; color: {BODY}; text-wrap: pretty">{d}</p>{nt}</div>')

def small(n, d, p, top=5):
    return (f'<div style="margin-top: {top}px; display: flex; align-items: baseline; gap: 6px; white-space: nowrap">'
            f'<span style="font-family: {SAIRA}; font-weight: 700; font-size: 18px; color: {BROWN}">{n}</span>'
            f'<span style="font-family: {TINOS}; font-style: italic; font-size: 15px; color: {BODY}">{d}</span>'
            f'<span style="flex: 1; min-width: 8px; border-bottom: 2px dotted #9a7c63; transform: translateY(-4px)"></span>'
            f'<span style="font-family: {SAIRA}; font-weight: 700; font-size: 17px; color: {BROWN}">{p}</span></div>')

def hours():
    cells = ''.join(
        f'<div style="padding: {"0 10px 0 0" if i % 2 == 0 else "0 0 0 12px"}; {"border-left: 1px solid " + BROWN + ";" if i % 2 else ""} {"margin-top: 7px;" if i > 1 else ""}">'
        f'<div style="font-family: {SAIRA}; font-weight: 600; font-size: 12px; letter-spacing: 0.16em; color: {RUST}">{a.upper()}</div>'
        f'<div style="font-family: {SAIRA}; font-weight: 700; font-size: 17px; line-height: 1.15; color: {BROWN}">{b}</div></div>' for i, (a, b) in enumerate(HOURS))
    return (f'<div style="margin-top: 14px; border: 2px solid {BROWN}; padding: 3px">'
            f'<div style="border: 1px solid {BROWN}; padding: 8px 12px 9px">'
            f'<div style="display: grid; grid-template-columns: 1fr 1fr">{cells}</div></div></div>')

def fare():
    return head('LIGHT FARE', 'AT THE BAR OR YOUR TABLE', 16) + ''.join(item(*x, top=11) for x in FARE)

def bar():
    s = head('COCKTAILS', 'LAST CALL 11:30 PM') + item(*JULEP, top=8) + ''.join(small(*x) for x in COCKTAILS)
    s += head('MORE TO DRINK', 'COFFEE FROM 6 AM', 16) + '<div style="margin-top: 2px">' + ''.join(small(*x) for x in DRINKS) + '</div>'
    return s

def kids():
    s = head('YOUNG TRAVELERS', '12 AND UNDER', 16)
    s += ''.join(item(n, d, p, top=8, note=nt) for n, d, p, nt in KIDS)
    s += small(*KID_DRINK, top=6)
    s += f'<p style="margin: 6px 0 0; font-family: {TINOS}; font-style: italic; font-size: 15px; color: {BODY}">Every young traveler gets a balloon.</p>'
    return s

def notes():
    rows = ''.join(f'<p style="margin: {0 if i == 0 else 5}px 0 0; font-family: {TINOS}; font-size: 15px; line-height: 1.3; color: {BODY}; text-wrap: pretty">'
                   f'<b style="font-family: {SAIRA}; font-weight: 700; font-size: 15px; color: {BROWN}">{t}.</b> {d}</p>' for i, (t, d) in enumerate(NOTES))
    return (f'<div style="margin-top: 16px; border: 2px solid {BROWN}; padding: 3px"><div style="border: 1px solid {BROWN}; padding: 8px 12px 9px">'
            f'<div style="font-family: {SAIRA}; font-weight: 700; font-size: 13px; letter-spacing: 0.22em; color: {RUST}; margin-bottom: 5px">BEFORE YOU FLY</div>{rows}</div></div>')

def overlays(face):
    # shared fine grain at its own shape (no stretch), then soft wear and laminate sheen, then the glass ring
    s = f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: -540px; top: 0; width: 1494px; height: {H}px; pointer-events: none; display: block; opacity: 0.8">'
    s += f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; pointer-events: none; display: block">'
    if face == 'back':
        s += '<img src="assets/stain-ring.png" alt="" aria-hidden="true" style="position: absolute; left: 230px; top: 300px; width: 200px; height: 200px; pointer-events: none; display: block">'
    return s

for face in ('front', 'back'):
    b = open(os.path.join(D, face + '.body.html')).read()
    for k, v in (('{{HOURS}}', hours), ('{{FARE}}', fare), ('{{BAR}}', bar), ('{{KIDS}}', kids), ('{{NOTES}}', notes)):
        if k in b: b = b.replace(k, v())
    b = b.replace('{{BROWN}}', BROWN).replace('{{ORANGE}}', ORANGE).replace('{{RUST}}', RUST).replace('{{BODY}}', BODY).replace('{{PAPER}}', PAPER)
    i = b.rindex('</div>')
    b = b[:i] + overlays(face) + b[i:]
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Runway Lounge table card, {face}</title>{FONT_LINK}'
        f'<style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
