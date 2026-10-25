"""Builds the firehouse World Series supper window card (Frequency, 2000; set in Queens, October 1969).
A two-colour letterpress card from a neighbourhood job printer, the kind taped inside every shop
window on the block. 11 x 14 in window card, one face, portrait.
Writes card.html (full page) and card.body.html, plus film.json and sullivansupper.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 1056, 1344
PAPER = '#f5f1e6'
BLUE = '#1f3a8a'
ORANGE = '#e86822'
FONTS = ('family=Anton&family=Alfa+Slab+One&family=Old+Standard+TT:ital,wght@0,400;0,700;1,400&family=Rock+Salt')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
TALL = "'Anton', Impact, sans-serif"
SLAB = "'Alfa Slab One', Rockwell, serif"
BODY = "'Old Standard TT', 'Century Schoolbook', Georgia, serif"
HAND = "'Rock Salt', cursive"

def esc(s): return s.replace('&', '&amp;')

def head(t, top=0):
    return (f'<div style="margin-top: {top}px; background: {BLUE}; color: {PAPER}; padding: 9px 14px 8px; '
            f'font-family: {SLAB}; font-size: 22px; line-height: 1; letter-spacing: 0.06em">{esc(t)}</div>')

def item(name, desc, price, top=18):
    return f'''<div style="margin-top: {top}px">
      <div style="display: flex; align-items: baseline; gap: 10px">
        <div style="font-family: {SLAB}; font-size: 25px; line-height: 1.1; color: {BLUE}">{esc(name)}</div>
        <div style="flex: 1; border-bottom: 3px dotted {BLUE}; opacity: 0.55; transform: translateY(-5px)"></div>
        <div style="font-family: {SLAB}; font-size: 24px; line-height: 1.1; color: {ORANGE}; white-space: nowrap">{price}</div></div>
      <div style="margin-top: 4px; font-size: 17px; line-height: 1.36; color: #1d2340; text-wrap: pretty">{esc(desc)}</div></div>'''

C = '&cent;'

inner = f'''
<div style="position: absolute; left: 56px; top: 56px; width: 944px; height: 46px; background: {BLUE}; color: {PAPER}; display: flex; align-items: center; justify-content: center; font-family: {SLAB}; font-size: 19px; letter-spacing: 0.16em">YOUR NEIGHBORHOOD FIREHOUSE INVITES THE WHOLE BLOCK</div>

<div style="position: absolute; left: 56px; top: 116px; width: 944px; text-align: center; font-family: {TALL}; color: {ORANGE}; font-size: 158px; line-height: 1; letter-spacing: 0.01em; white-space: nowrap">WORLD SERIES</div>
<div style="position: absolute; left: 56px; top: 280px; width: 944px; text-align: center; font-family: {TALL}; color: {BLUE}; font-size: 122px; line-height: 1; letter-spacing: 0.1em; white-space: nowrap">SUPPER NIGHT</div>

<div style="position: absolute; left: 56px; top: 424px; width: 944px; height: 0; border-top: 4px solid {BLUE}"></div>
<div style="position: absolute; left: 56px; top: 434px; width: 944px; height: 0; border-top: 1.5px solid {BLUE}"></div>

<div style="position: absolute; left: 56px; top: 456px; width: 340px; text-align: center; color: {BLUE}">
  <div style="font-family: {SLAB}; font-size: 24px; letter-spacing: 0.22em; line-height: 1">SATURDAY</div>
  <div style="margin-top: 8px; font-family: {TALL}; font-size: 92px; line-height: 0.95; color: {ORANGE}">OCT. 11</div>
  <div style="margin-top: 8px; font-family: {SLAB}; font-size: 24px; letter-spacing: 0.3em; line-height: 1">1969</div>
</div>
<img src="assets/baseball.png" alt="" style="position: absolute; left: 448px; top: 450px; width: 160px; height: 160px; display: block">
<div style="position: absolute; left: 660px; top: 456px; width: 340px; text-align: center; color: {BLUE}">
  <div style="font-family: {SLAB}; font-size: 24px; letter-spacing: 0.22em; line-height: 1">GAME ONE</div>
  <div style="margin-top: 8px; font-family: {TALL}; font-size: 54px; line-height: 1; color: {ORANGE}">ON THE RADIO</div>
  <div style="margin-top: 10px; font-size: 19px; line-height: 1.3; font-weight: 700">Doors at noon. Supper from 4.</div>
</div>

<div style="position: absolute; left: 56px; top: 630px; width: 944px; text-align: center; font-style: italic; font-size: 21px; line-height: 1.35; color: #1d2340">Our boys are in the Series. Hear the first game with us on the apparatus floor,<br>then stay for supper with the men of the house. Bring the kids.</div>

<div style="position: absolute; left: 56px; top: 718px; width: 452px">
  {head("FROM THE KITCHEN")}
  {item("Firehouse chili cups", "Ground beef and kidney beans simmered with hot chili powder, spooned into baked wonton shells, sharp cheddar melted over in the oven.", f"3 for 35{C}", 14)}
  {item("Ballpark pretzels", "Dipped in a baking soda bath, baked glossy brown under coarse salt. Warm, with a whole-grain beer mustard sweetened with honey.", f"25{C}")}
  {item("Queens pizza pie", "Thin and crisp, crushed tomato, mozzarella and crumbled Italian sausage, baked hot on the steel.", f"20{C} &nbsp;/&nbsp; 1.69")}
  <div style="margin-top: 8px; font-size: 16px; line-height: 1.3; font-style: italic; color: {BLUE}">By the slice, or the whole thing boxed to take home.</div>
</div>

<div style="position: absolute; left: 548px; top: 718px; width: 452px">
  {head("PIE, PLATES AND DRINKS")}
  {item("Julia Sullivan's apple pie", "Granny Smiths with cinnamon and sugar under a double crust, brushed with egg and baked golden.", f"30{C}", 14)}
  {item("Firehouse shandy", "Cold lager topped with fresh-squeezed lemonade, a sprig of mint and a citrus wheel. Grown-ups only.", f"35{C}")}
  {item("Little Chief's plate", "A hot dog on a buttered bun, potato chips and a carton of cold milk.", f"35{C}")}
  {item("Lemonade or coffee", "Squeezed this morning and poured over ice, or black from the big percolator.", f"15{C} &nbsp;/&nbsp; 10{C}")}
</div>

<div style="position: absolute; left: 56px; top: 1146px; width: 452px; height: 118px; box-sizing: border-box; background: {ORANGE}; color: {PAPER}; padding: 14px 18px 0">
  <div style="font-family: {TALL}; font-size: 34px; line-height: 1; letter-spacing: 0.04em">RAFFLE: A TRANSISTOR RADIO</div>
  <div style="margin-top: 7px; font-size: 17px; line-height: 1.32; font-weight: 700">Hear the rest of the Series anywhere. Tickets 25{C}, five for $1. Drawn at supper by the Chief.</div>
</div>
<div style="position: absolute; left: 548px; top: 1146px; width: 452px; height: 118px; box-sizing: border-box; border: 3px solid {BLUE}; padding: 10px 16px 0; color: {BLUE}">
  <div style="font-family: {SLAB}; font-size: 15px; letter-spacing: 0.16em; line-height: 1">TICKETS AND INFORMATION</div>
  <div style="margin-top: 6px; font-family: {HAND}; font-size: 22px; line-height: 1.5; color: #22283f; transform: rotate(-1.5deg); transform-origin: left top">See Frank or Satch</div>
  <div style="position: absolute; left: 16px; right: 16px; top: 68px; border-top: 1px solid {BLUE}; opacity: 0.5"></div>
  <div style="position: absolute; left: 16px; right: 16px; top: 98px; border-top: 1px solid {BLUE}; opacity: 0.5"></div>
</div>

<div style="position: absolute; left: 56px; top: 1282px; width: 944px; display: flex; justify-content: space-between; font-size: 13px; line-height: 1.2; letter-spacing: 0.1em; color: {BLUE}; font-weight: 700">
  <span>ALL PROCEEDS TO THE WIDOWS AND ORPHANS FUND</span><span>PLEASE POST IN YOUR WINDOW. PRINTED IN QUEENS, N.Y.</span>
</div>
'''

def overlays():
    gw = round(FH * 2246 / 1588)
    tapes = ''.join(
        f'<img src="assets/wear-tape-{k}.png" alt="" aria-hidden="true" style="position: absolute; left: {x}px; top: {y}px; width: {w}px; height: {h}px; pointer-events: none; display: block">'
        for k, x, y, w, h in (('a', -50, -46, 146, 128), ('b', FW - 96, -44, 148, 124), ('c', -48, FH - 86, 144, 131), ('d', FW - 98, FH - 80, 149, 121)))
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.7; pointer-events: none; display: block">'
            f'<img src="assets/wear-sun.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">'
            + tapes)

body = (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; '
        f'font-family: {BODY}; color: {BLUE}">{inner}{overlays()}</div>')
open(os.path.join(D, 'card.body.html'), 'w').write(body)
open(os.path.join(D, 'card.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>World Series supper card</title>{LINK}'
    f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "sullivansupper", "fn": "fmtSullivanSupper", "faces": ["card.html"], "names": ["Window card"],
        "mm": [279.4, 355.6], "fonts": FONTS, "fams": ["Anton", "Alfa Slab One", "Old Standard TT", "Rock Salt"],
        "phone": {"disp": "'Anton',sans-serif", "title": "'Anton',sans-serif", "name": "'Alfa Slab One',serif",
                  "body": "'Old Standard TT',serif", "price": "'Alfa Slab One',serif", "note": "'Old Standard TT',serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Frequency (2000)": {
  "Firehouse chilli bites": {"n": "Firehouse chili cups", "d": "Ground beef and kidney beans simmered with hot chili powder, spooned into baked wonton shells, sharp cheddar melted over in the oven.", "note": "Three for 35 cents."},
  "Miracle Mets pretzels with beer mustard": {"n": "Ballpark pretzels", "d": "Dipped in a baking soda bath, baked glossy brown under coarse salt. Warm, with a whole-grain beer mustard sweetened with honey.", "note": "Game One on the radio."},
  "Queens pizza": {"n": "Queens pizza pie", "d": "Thin and crisp, crushed tomato, mozzarella and crumbled Italian sausage, baked hot on the steel.", "note": "By the slice or the whole pie, boxed to take home."},
  "Julia's apple pie": {"n": "Julia Sullivan's apple pie", "d": "Granny Smiths with cinnamon and sugar under a double crust, brushed with egg and baked golden.", "note": "Baked at home and carried down to the firehouse."},
  "Firehouse lemon shandy": {"n": "Firehouse shandy", "d": "Cold lager topped with fresh-squeezed lemonade, a sprig of mint and a citrus wheel. Grown-ups only.", "note": "Poured on the apparatus floor."}
}}
open(os.path.join(D, 'sullivansupper.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
