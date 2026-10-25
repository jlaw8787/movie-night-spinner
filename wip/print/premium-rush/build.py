"""Builds the Morningside Halal truck window sheet for Premium Rush (Manhattan, 2012).
The venue: a halal food truck parked on Broadway at 116th St, by the university gates where the
messengers pick up. The object: the legal-size sheet taped inside the order window (8.5 x 14 in,
portrait, one face), printed by a copy shop in cab yellow, black and Wilee red.
Signature piece: the painted strip map (map.py) of Manhattan with the run from 116th St to Chinatown.
Real images: a chicken platter photo (Wikimedia Commons, CC BY 2.0) and a TMDB still of Broadway.
Props: a messenger's delivery manifest tag and the truck's spoke card.
Writes window.html, window.body.html, film.json, messenger.labels.json."""
import os, json
import numpy as np
from PIL import Image, ImageFilter
D = os.path.dirname(os.path.abspath(__file__))
FW, FH = 816, 1344
YEL, BLK, RED, INK, MANILA = '#f5c431', '#161616', '#c1272d', '#262421', '#e6cf96'
PEN = '#24305e'
FONTS = 'family=Teko:wght@400;500;600;700&family=Source+Sans+3:wght@400;600;700&family=Nothing+You+Could+Do'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Teko', 'Arial Narrow', sans-serif"
BODY = "'Source Sans 3', Arial, sans-serif"
HAND = "'Nothing You Could Do', cursive"
LAY = json.load(open(os.path.join(D, 'map_layout.json')))

# soft sheet wear: sun fade at the top where the window gets the light, gentle edge darkening
def wear():
    W, H = FW * 2, FH * 2
    rng = np.random.default_rng(2012)
    big = np.asarray(Image.fromarray((rng.random((12, 8)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC).filter(ImageFilter.GaussianBlur(80)), float) / 255
    y, x = np.mgrid[0:H, 0:W]
    dx = np.minimum(x, W - 1 - x) / W; dy = np.minimum(y, H - 1 - y) / H
    edge = np.clip(1 - np.minimum(dx * 16, dy * 22), 0, 1) ** 2
    a = np.clip(big - 0.55, 0, 1) * 50 + edge * 70
    out = np.zeros((H, W, 4), 'uint8'); out[..., :3] = (92, 70, 30); out[..., 3] = np.clip(a, 0, 70)
    Image.fromarray(out, 'RGBA').save(os.path.join(D, 'assets', 'paper-wear-window.png'))
wear()

def kicker(t, color=RED, size=18):
    return f'<div style="font-family: {BODY}; font-weight: 700; font-size: {size}px; line-height: 1.1; letter-spacing: 0.16em; text-transform: uppercase; color: {color}">{t}</div>'

def heading(t, top=0):
    return (f'<div style="display: flex; align-items: center; gap: 12px; margin-top: {top}px">'
            f'<div style="font-family: {DISP}; font-weight: 600; font-size: 44px; line-height: 0.8; padding-top: 8px; color: {BLK}; white-space: nowrap">{t}</div>'
            f'<div style="flex: 1; height: 7px; background: {RED}"></div></div>')

def dish(name, price, desc, top=12):
    return (f'<div style="margin-top: {top}px">'
            f'<div style="display: flex; align-items: baseline; gap: 10px">'
            f'<div style="flex: 1; font-family: {DISP}; font-weight: 600; font-size: 33px; line-height: 0.9; color: {BLK}; text-transform: uppercase">{name}</div>'
            f'<div style="font-family: {DISP}; font-weight: 600; font-size: 33px; line-height: 0.9; color: {RED}">{price}</div></div>'
            + (f'<div style="margin-top: 2px; font-family: {BODY}; font-size: 20px; line-height: 1.22; color: {INK}; text-wrap: pretty">{desc}</div>' if desc else '') + '</div>')

# ---------- dishes (k = spec key) ----------
PLATTERS = [
  ('Wilee\'s halal cart chicken over rice', 'Chicken platter', '6.00',
   'Thighs in lemon, oregano, cumin and coriander, griddled and chopped. Turmeric rice, lettuce, white and hot sauce.'),
  (None, 'Lamb platter', '6.00', 'Gyro lamb off the cone, crisped. Roselli\'s usual.'),
  (None, 'Combo platter', '7.00', 'Half and half. Manny takes it extra hot.'),
  (None, 'Chicken or lamb in pita', '4.00', 'Wrapped tight with lettuce, tomato and white sauce. Can\'t stop? Eat it one-handed.'),
]
JAR = [
  ('Messenger fuel bars', 'Fuel bar', '2.00', 'Oats, dates, peanuts and seeds baked with honey, butter and brown sugar.'),
  ('Dispatch office cookies', 'Cookie', '1.00', 'Chocolate chip, browned butter dough rested overnight, flaky salt.'),
]
DRINKS = [
  ('No-brakes energy smoothie', 'No brakes', '4.50', 'Smoothie of banana, berries, oats, peanut butter and milk, blended thick. Espresso shot 75 cents.'),
  (None, 'Hot tea, soda, water', '1.00', ''),
]
BAO = ('Chinatown pork buns', 'Char siu bao', '3.00',
       'Pork neck marinated overnight in hoisin, honey, soy and five spice, roasted, in steamed buns.')

# ---------- map column ----------
def chip(x, y, text, num=None, side='r', w=None):
    """A route label: numbered red stop on the line, a paper chip beside it."""
    out = ''
    if num is not None:
        out += (f'<div style="position: absolute; left: {x - 13}px; top: {y - 13}px; width: 22px; height: 22px; border: 2px solid {BLK}; border-radius: 50%; '
                f'background: {RED}; color: {YEL}; text-align: center; font-family: {DISP}; font-weight: 600; font-size: 20px; line-height: 25px">{num}</div>')
    pos = f'left: {x + 14}px' if side == 'r' else f'right: {316 - x + 14}px'
    ww = f'width: {w}px;' if w else 'white-space: nowrap;'
    out += (f'<div style="position: absolute; {pos}; top: {y - 13}px; {ww} background: {YEL}; border: 2px solid {BLK}; padding: 3px 6px 0; '
            f'font-family: {DISP}; font-weight: 500; font-size: 19px; line-height: 0.95; color: {BLK}; text-transform: uppercase">{text}</div>')
    return out

def water(x, y, text, align='left'):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; background: {BLK}; padding: 4px 4px 1px; font-family: {DISP}; font-weight: 500; font-size: 16px; line-height: 0.95; '
            f'letter-spacing: 0.12em; color: {YEL}; text-align: {align}">{text}</div>')

def map_col():
    L = LAY
    sts = ''.join(f'<div style="position: absolute; left: 4px; top: {y - 8}px; font-family: {DISP}; font-weight: 500; font-size: 15px; line-height: 1; color: {YEL}">{n}</div>'
                  for n, (x, y) in [(k + (' ST' if k == '125' else ''), v) for k, v in L['st'].items()] if n in ('125 ST', '110', '96', '72', '59', '42', '34', '23', '14'))
    sx, sy = L['start']; px, py = L['park_in']; cx, cy = L['circle']; tx, ty = L['times']; ex, ey = L['end']
    return (f'<div style="position: absolute; left: 0; top: 0; width: 316px; height: 1000px; background: {BLK}">'
            f'<img src="assets/map.png" alt="Map of Manhattan with the bike route from 116th St to Chinatown" style="position: absolute; left: 0; top: 0; width: 316px; height: 1000px; display: block">'
            f'<div style="position: absolute; left: 36px; top: 40px; width: 262px">'
            f'{kicker("By bike, about 7 miles", YEL, 17)}'
            f'<div style="margin-top: 8px; font-family: {DISP}; font-weight: 600; font-size: 60px; line-height: 0.8; padding-top: 8px; color: {YEL}">UPTOWN TO<br>CHINATOWN</div>'
            f'</div>'
            f'{sts}'
            # north mark
            f'<div style="position: absolute; left: 282px; top: 44px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-bottom: 13px solid {YEL}"></div>'
            f'<div style="position: absolute; left: 280px; top: 59px; width: 20px; text-align: center; font-family: {DISP}; font-weight: 600; font-size: 16px; line-height: 1; color: {YEL}">N</div>'
            + chip(sx, sy, 'Our truck, 116 St', 1)
            + chip(px, py + 2, 'Into the park', 2)
            + chip(cx, cy, 'Columbus Circle', 3)
            + chip(tx, ty + 6, 'Times Sq.<br>Watch the cabs', 4, w=124)
            + chip(ex, ey, 'Chinatown', 5, side='l')
            + water(252, 430, 'EAST<br>RIVER')
            + water(4, 742, 'HUDSON<br>RIVER')
            + water(246, 900, 'BROOKLYN')
            + '</div>')

# ---------- props ----------
def manifest_tag(x, y):
    """A messenger's manila manifest tag, tied on by a rider, with Raj's note from dispatch."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 132px; height: 206px; transform: rotate(7deg); transform-origin: 50% 0">'
            f'<div style="position: absolute; left: 63px; top: -30px; width: 2px; height: 44px; background: #7d7466; transform: rotate(-14deg)"></div>'
            f'<div style="position: absolute; left: 0; top: 0; width: 132px; height: 206px; background: {MANILA}; border-radius: 3px; '
            f'box-shadow: 0 3px 8px rgba(0,0,0,0.30)">'
            f'<div style="position: absolute; left: 52px; top: 10px; width: 28px; height: 28px; border-radius: 50%; background: #d8bf80; border: 1px solid #b59c5f"></div>'
            f'<div style="position: absolute; left: 60px; top: 18px; width: 12px; height: 12px; border-radius: 50%; background: {BLK}"></div>'
            f'<div style="position: absolute; left: 10px; top: 46px; width: 112px">'
            f'<div style="font-family: {DISP}; font-weight: 600; font-size: 24px; line-height: 0.85; padding-top: 4px; color: {RED}; letter-spacing: 0.04em">MANIFEST</div>'
            f'<div style="margin-top: 3px; height: 2px; background: {RED}"></div>'
            f'<div style="margin-top: 4px; font-family: {BODY}; font-weight: 700; font-size: 14px; line-height: 1.2; color: {RED}; letter-spacing: 0.06em">FROM DISPATCH</div>'
            f'<div style="margin-top: 4px; font-family: {HAND}; font-size: 17px; line-height: 1.12; color: {PEN}">Riders eat on the tab. They pay Friday.</div>'
            f'<div style="margin-top: 2px; font-family: {HAND}; font-size: 24px; line-height: 1; color: {PEN}">Raj</div>'
            f'</div></div></div>')

def spoke_card(x, y):
    """The truck's laminated spoke card, the kind riders wedge in their wheels."""
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 170px; height: 116px; transform: rotate(-8deg); background: {RED}; border: 3px solid {YEL}; '
            f'border-radius: 6px; box-shadow: 0 3px 8px rgba(0,0,0,0.45)">'
            f'<div style="position: absolute; left: 8px; top: 8px; width: 12px; height: 12px; border-radius: 50%; background: {BLK}"></div>'
            f'<div style="position: absolute; left: 8px; top: 30px; width: 14px; height: 52px; border-radius: 7px; background: {BLK}"></div>'
            f'<div style="position: absolute; left: 32px; top: 8px; width: 130px">'
            f'<div style="font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.12em; line-height: 1; color: {YEL}">SPOKE CARD</div>'
            f'<div style="margin-top: 4px; font-family: {DISP}; font-weight: 600; font-size: 31px; line-height: 0.8; padding-top: 4px; color: {YEL}">FREE SODA</div>'
            f'<div style="margin-top: 3px; font-family: {BODY}; font-weight: 600; font-size: 14px; line-height: 1.15; color: {YEL}">with a platter. Fixed gear, no brakes, no problem.</div>'
            f'</div></div>')

def drop():
    """Stop 5 on the map: the Chinatown drop. A bakery tip, not sold at the truck."""
    return (f'<div style="position: absolute; left: 318px; top: 1018px; width: 216px; height: 262px; box-sizing: border-box; border: 3px dashed {BLK}; padding: 12px 12px 0">'
            f'<div style="display: flex; align-items: center; gap: 8px">'
            f'<div style="width: 24px; height: 24px; flex: none; border: 2px solid {BLK}; border-radius: 50%; background: {RED}; color: {YEL}; text-align: center; font-family: {DISP}; font-weight: 600; font-size: 20px; line-height: 27px">5</div>'
            f'{kicker("Last stop, Chinatown", RED, 16)}</div>'
            f'<div style="margin-top: 8px; font-family: {DISP}; font-weight: 600; font-size: 31px; line-height: 0.9; color: {BLK}; text-transform: uppercase">{BAO[1]}</div>'
            f'<div style="margin-top: 3px; font-family: {BODY}; font-size: 20px; line-height: 1.22; color: {INK}">{BAO[3]}</div>'
            f'<div style="margin-top: 6px; font-family: {BODY}; font-weight: 700; font-size: 16px; line-height: 1.22; color: {RED}">Bakery on Mott, three for 3.00. Not sold at this truck.</div></div>')

# ---------- the sheet ----------
def sheet():
    pl = ''.join(dish(n, p, d, 10 if i else 6) for i, (_, n, p, d) in enumerate(PLATTERS))
    jar = ''.join(dish(n, p, d, 10 if i else 6) for i, (_, n, p, d) in enumerate(JAR))
    dr = ''.join(dish(n, p, d, 10 if i else 6) for i, (_, n, p, d) in enumerate(DRINKS))
    right = (f'<div style="position: absolute; left: 342px; top: 40px; width: 434px">'
             f'{kicker("Truck 116 &middot; Broadway at 116th St")}'
             f'<div style="margin-top: 6px; font-family: {DISP}; font-weight: 700; font-size: 88px; line-height: 0.78; padding-top: 12px; color: {BLK}">MORNINGSIDE</div>'
             f'<div style="font-family: {DISP}; font-weight: 700; font-size: 88px; line-height: 0.78; padding-top: 8px; color: {RED}">HALAL FOOD</div>'
             f'<div style="position: relative; margin-top: 14px; width: 428px; height: 150px; border: 3px solid {RED}">'
             f'<img src="assets/photo-platter.jpg" alt="Chicken platter in a foil tray" style="position: absolute; left: 0; top: 0; width: 428px; height: 150px; object-fit: cover; object-position: 50% 50%; display: block">'
             f'<div style="position: absolute; left: -10px; bottom: -14px; width: 92px; height: 92px; border-radius: 50%; background: {RED}; border: 3px solid {YEL}; text-align: center">'
             f'<div style="margin-top: 14px; font-family: {DISP}; font-weight: 600; font-size: 50px; line-height: 0.8; color: {YEL}">$6</div>'
             f'<div style="margin-top: 2px; font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.08em; color: {YEL}">PLATTER</div></div></div>'
             f'<div style="margin-top: 8px; padding-left: 92px; width: 250px; font-family: {BODY}; font-size: 16px; line-height: 1.25; color: {INK}">Our chicken platter.</div>'
             f'{heading("PLATTERS", 10)}{pl}'
             f'{heading("DRINKS", 14)}{dr}</div>')
    band = (f'<div style="position: absolute; left: 0; top: 1000px; width: {FW}px; height: 6px; background: {BLK}"></div>'
            f'<div style="position: absolute; left: 40px; top: 1016px; width: 262px">{heading("THE JAR")}{jar}</div>'
            f'{drop()}'
            f'<div style="position: absolute; left: 556px; top: 1020px; width: 220px">'
            f'<div style="width: 214px; height: 142px; border: 3px solid {RED}; overflow: hidden">'
            f'<img src="assets/still-broadway.jpg" alt="A messenger riding Broadway between cabs" style="width: 214px; height: 142px; object-fit: cover; object-position: 40% 30%; display: block"></div>'
            f'<div style="margin-top: 5px; font-family: {BODY}; font-size: 16px; line-height: 1.22; color: {INK}">Broadway at 5. Our riders don\'t slow down.</div>'
            f'<div style="margin-top: 8px; font-family: {BODY}; font-size: 16px; line-height: 1.22; color: {INK}">'
            f'<b>Cash only.</b> We don\'t cash tickets. Law students 10% off, bar exam not required.</div></div>'
            f'<div style="position: absolute; left: 40px; top: 1292px; width: 736px; display: flex; justify-content: space-between; font-family: {BODY}; font-size: 14px; line-height: 1; color: {INK}">'
            f'<span>Open 10 AM to 10 PM. Mondays, we\'re off. Prices subject to change.</span><span>NYC mobile food permit MV 2012-0116</span></div>')
    finish = ''
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {YEL}; color: {BLK}">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: -400px; top: 0; width: 1901px; height: 1344px; opacity: 0.3; display: block">'
            f'{map_col()}{right}{band}{finish}'
            f'{manifest_tag(650, 254)}{spoke_card(16, 864)}'
            f'<img src="assets/paper-wear-window.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; display: block">'
            f'</div>')

body = sheet()
open(os.path.join(D, 'window.body.html'), 'w').write(body)
open(os.path.join(D, 'window.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Morningside Halal window sheet</title>{LINK}'
    f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "messenger", "fn": "fmtMessenger", "faces": ["window.html"], "names": ["Window"], "mm": [215.9, 355.6],
        "fonts": FONTS, "fams": ["Teko", "Source Sans 3", "Nothing You Could Do"],
        "phone": {"disp": "'Teko',sans-serif", "title": "'Teko',sans-serif", "name": "'Teko',sans-serif",
                  "body": "'Source Sans 3',sans-serif", "price": "'Teko',sans-serif", "note": "'Source Sans 3',sans-serif"}}
json.dump(film, open(os.path.join(D, 'film.json'), 'w'), indent=1)
NOTES = {'Wilee\'s halal cart chicken over rice': 'Truck 116, Broadway at 116th St. Six dollars.',
         'Messenger fuel bars': 'From the jar by the window. Goes in the bag.',
         'Dispatch office cookies': 'From the jar. A dollar.',
         'No-brakes energy smoothie': 'Espresso shot 75 cents extra.',
         'Chinatown pork buns': 'Last stop, Chinatown: from the bakery on Mott, three for 3.00. Not sold at the truck.'}
labels = {}
for k, n, p, d in PLATTERS + JAR + DRINKS + [BAO]:
    if k: labels[k] = {'n': n, 'd': d, 'note': NOTES[k]}
json.dump({"Premium Rush (2012)": labels}, open(os.path.join(D, 'messenger.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
