"""Builds the Lester's Possum Park snack bar placemat (A Goofy Movie, 1995), on the house STYLE-LOCK system.

Venue: Lester's Possum Park, the roadside attraction Goofy drags Max to on day one of the trip.
Format: roadside attraction placemat, one landscape face 1344 x 960 px (14 x 10 in at 96 dpi).
Signature: a TMDB still (Goofy and Max with the road map) plus a public domain Tichnor linen postcard.
Props: a Possum Park admission ticket, the road west over a real 1950 LOC highway map (fork to Lake Destiny or L.A.), Dad's pencil note.
Palette from the film: Powerline purple, Max's orange-red, buff placemat stock.
"""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
W, H = 1344, 960
FILM = 'A Goofy Movie (1995)'

FONTS = 'family=Luckiest+Guy&family=Bitter:ital,wght@0,400;0,700;0,800;1,400&family=Caveat:wght@600'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Luckiest Guy', sans-serif"
BODY = "'Bitter', serif"
HAND = "'Caveat', cursive"

PAPER = '#ffd84f'
INK = '#3a1670'
ORANGE = '#ff5424'
CREAM = '#fff6dc'

# (spec key or None if added, printed name, price, printed description, phone note)
SNACK = [
    ('Perfect Cast fish fingers', 'Perfect Cast Fish Fingers', '3.95',
     'Panko-crusted white fish, lemon and a pickle and caper tartare.', 'Practice your Perfect Cast at the pond out back.'),
    ('Powerline concert nachos', 'Powerline Nachos', '4.25',
     'Corn chips, spiced beef, black beans, cheddar, guacamole, sour cream, salsa.', 'Powerline plays L.A. this summer. Take the south road at the fork.'),
    (None, 'Hand-Dipped Corn Dog', '1.95', 'Beef frank, cornmeal batter, mustard.', None),
]
GRILL = [
    ("Pete's RV barbecue sausages", 'The RV Park Plate', '4.50',
     'Chargrilled beef sausages in rolls, fried onions, mustard, ketchup, buttered corn.', 'Big rigs and RVs park out back.'),
]
SWEET = [
    ("Bigfoot campsite s'mores", 'Bigfoot S&rsquo;mores', '2.25',
     'Toasted marshmallow and milk chocolate between graham crackers.', 'Bigfoot country ahead. Lock your cooler.'),
    (None, 'Possum Pie', '2.50', 'Pecan crust, cream cheese, chocolate pudding, whipped cream.', None),
]
COOLER = [
    ('Concert night cherry slushie', 'Cherry Slush', '1.25',
     'Cherry syrup blended with crushed ice and a squeeze of lime.', 'In the Powerline tour cup, while they last.'),
    (None, 'Fresh Lemonade', '.95', 'Squeezed to order, shaken over ice.', None),
]
ALL = SNACK + GRILL + SWEET + COOLER


def ab(x, y, w, inner, style=''):
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {style}">{inner}</div>'


def kicker(t, col=ORANGE, size=18):
    return f'<div style="font-family: {BODY}; font-weight: 800; font-size: {size}px; letter-spacing: 0.2em; line-height: 22px; color: {col}">{t}</div>'


def bar(t):
    # an orange road-sign band with a purple keyline
    return (f'<div style="position: relative; height: 50px; background: {ORANGE}; border: 3px solid {INK}; border-radius: 10px; box-sizing: border-box">'
            f'<div style="position: absolute; left: 16px; top: 6px; font-family: {DISP}; font-size: 40px; line-height: 44px; letter-spacing: 0.02em; color: {CREAM}">{t}</div></div>')


def item(name, price, desc, first=False):
    return f'''<div style="margin-top: {0 if first else 13}px">
      <div style="display: flex; justify-content: space-between; align-items: baseline">
        <div style="font-family: {BODY}; font-weight: 800; font-size: 27px; line-height: 31px; color: {INK}">{name}</div>
        <div style="font-family: {BODY}; font-weight: 800; font-size: 27px; line-height: 31px; color: {ORANGE}">{price}</div></div>
      <div style="margin-top: 3px; font-family: {BODY}; font-size: 20px; line-height: 26px; color: {INK}; text-wrap: pretty">{desc}</div></div>'''


def group(title, items, top=0):
    return (f'<div style="margin-top: {top}px">{bar(title)}<div style="margin-top: 12px">'
            + ''.join(item(n, p, d, i == 0) for i, (_, n, p, d, _) in enumerate(items)) + '</div></div>')


def header():
    band = ab(0, 0, W, '', f'height: 206px; background: {INK}')
    stripe = ab(0, 206, W, '', f'height: 8px; background: {ORANGE}')
    # marquee bulbs along the sign
    bulbs = ''.join(ab(22 + i * 34, 190, 10, '', f'height: 10px; border-radius: 50%; background: {PAPER}; border: 2px solid {ORANGE}; box-sizing: border-box') for i in range(27))
    top = ab(40, 40, 880, f'''<div style="display: flex; align-items: baseline; gap: 22px">
        <div style="font-family: {DISP}; font-size: 46px; line-height: 46px; color: {ORANGE}">LESTER&rsquo;S</div>
        <div style="font-family: {BODY}; font-weight: 800; font-size: 18px; letter-spacing: 0.2em; color: {PAPER}">THE BEST STOP ON THE ROAD WEST</div></div>''')
    title = ab(40, 82, 900, f'<div style="font-family: {DISP}; font-size: 116px; line-height: 104px; color: {PAPER}; text-shadow: 6px 6px 0 {ORANGE}; white-space: nowrap">POSSUM PARK</div>')
    show = ab(920, 42, 384, f'''
      <div style="background: {ORANGE}; border: 4px solid {PAPER}; border-radius: 14px; padding: 10px 14px 12px; box-sizing: border-box; transform: rotate(-2.5deg); box-shadow: 4px 5px 0 rgba(0,0,0,0.35)">
        <div style="font-family: {DISP}; font-size: 38px; line-height: 40px; color: {PAPER}; text-align: center">SEE THE SINGING POSSUMS!</div>
        <div style="margin-top: 6px; font-family: {BODY}; font-weight: 800; font-size: 20px; line-height: 24px; color: {INK}; text-align: center">Live on stage* every hour, 10 to 6</div>
        <div style="margin-top: 2px; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 20px; color: {CREAM}; text-align: center">*Animatronic. They know every word.</div>
      </div>''')
    return band + stripe + bulbs + top + title + show


def menu():
    T = 230
    a = ab(40, T, 400, group('THE SNACK BAR', SNACK))
    note = ab(52, T + 330, 384, f'''<div style="transform: rotate(-1.5deg); font-family: {HAND}; font-weight: 600; font-size: 27px; line-height: 25px; color: #2c3f8f">Max, I know it&rsquo;s not the trip you wanted. But it&rsquo;s you and me, pal.<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Love you, kiddo. Dad</div>''')
    b2 = ab(472, T, 400, group('OFF THE GRILL', GRILL) + group('CAMPFIRE SWEETS', SWEET, 18))
    c = ab(904, T, 400, group('THE COOLER', COOLER))
    card = ab(912, T + 238, 290, f'''<div style="background: #fffaf0; padding: 7px; transform: rotate(-3deg); box-shadow: 3px 5px 8px rgba(58,22,112,0.35)">
        <img src="assets/postcard.jpg" alt="Vintage linen postcard, Greetings from Coeur d&rsquo;Alene, Idaho" style="display: block; width: 276px; height: 171px"></div>''')
    ticket = ab(1176, T + 262, 124, f'''<div style="transform: rotate(8deg); background: {ORANGE}; border: 2px dashed {CREAM}; outline: 3px solid {ORANGE}; padding: 8px 6px 9px; text-align: center; box-shadow: 2px 4px 6px rgba(58,22,112,0.35)">
        <div style="font-family: {BODY}; font-weight: 800; font-size: 14px; letter-spacing: 0.16em; line-height: 17px; color: {CREAM}">LESTER&rsquo;S</div>
        <div style="font-family: {DISP}; font-size: 23px; line-height: 25px; color: {INK}">POSSUM PARK</div>
        <div style="margin-top: 3px; font-family: {BODY}; font-weight: 800; font-size: 16px; line-height: 19px; color: {CREAM}">ADMIT ONE</div>
        <div style="font-family: {BODY}; font-size: 14px; line-height: 17px; color: {INK}">No. 1995 &nbsp;Adult</div></div>''')
    return a + note + b2 + c + card + ticket


def still():
    img = f'<img src="assets/still-map.jpg" alt="Goofy and Max in the car with the road map" style="display: block; width: 390px; height: 240px">'
    cap = f'<div style="position: absolute; left: 0; bottom: 0; width: 390px; background: rgba(58,22,112,0.88); padding: 4px 10px 5px; box-sizing: border-box; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 19px; color: {CREAM}">Road trip season. Keep the map handy, navigator.</div>'
    return ab(40, 652, 390, img + cap, f'height: 240px; border: 3px solid {ORANGE}; box-sizing: content-box; margin: -3px')


def route():
    lay = json.load(open(os.path.join(D, 'map_layout.json')))
    X, Y, MW, MH = 450, 652, 854, 246

    def at(key, dx, dy, w, inner, style=''):
        fx, fy = lay[key]
        return ab(round(X + fx * MW + dx), round(Y + fy * MH + dy), w, inner, style)

    def lab(t, size=16, col=INK, weight=800, sp='0.08em', align='left'):
        return f'<div style="font-family: {BODY}; font-weight: {weight}; font-size: {size}px; line-height: {size + 3}px; letter-spacing: {sp}; color: {col}; text-align: {align}">{t}</div>'

    def plate(inner, align='left'):
        return f'<div style="text-align: {align}"><div style="display: inline-block; background: rgba(255,246,220,0.92); border-radius: 4px; padding: 2px 6px 3px">{inner}</div></div>'

    def dot(key, r=7, col=INK):
        return at(key, -r, -r, 2 * r, '', f'height: {2 * r}px; border-radius: 50%; background: {col}; border: 2px solid {CREAM}; box-sizing: border-box')

    out = [ab(X, Y, MW, f'<img src="assets/route-map.jpg" alt="1950 United States highway map, cropped from the Pacific coast across to Ohio, with the road west drawn over it" style="display: block; width: {MW}px; height: {MH}px">',
              f'height: {MH}px; border: 3px solid {INK}; box-sizing: content-box; margin: -3px')]
    pts = lambda line: ' '.join(f'{fx * MW:.1f},{fy * MH:.1f}' for fx, fy in line)
    lines = ''.join(f'<polyline points="{pts(l)}" fill="none" stroke="{CREAM}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>' for l in lay['route'])
    lines += ''.join(f'<polyline points="{pts(l)}" fill="none" stroke="{ORANGE}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>' for l in lay['route'])
    out.append(ab(X, Y, MW, f'<svg width="{MW}" height="{MH}" viewBox="0 0 {MW} {MH}" aria-hidden="true" style="display: block">{lines}</svg>', f'height: {MH}px'))
    out.append(ab(X + MW - 186, Y + 10, 176, f'<div style="text-align: right"><div style="display: inline-block; background: {INK}; padding: 5px 12px 4px; border-radius: 6px; white-space: nowrap">{lab("THE ROAD WEST", 16, PAPER)}</div></div>'))
    out.append(dot('spoonerville'))
    out.append(at('spoonerville', 14, -28, 170, plate(lab('SPOONERVILLE') + lab('Home sweet home', 16, INK, 400, '0'))))
    out.append(at('possum', -18, -20, 36, f'<div style="font-family: {DISP}; font-size: 38px; line-height: 36px; color: {ORANGE}; text-align: center">&#9733;</div>'))
    out.append(at('possum', -100, -70, 200, plate(lab('YOU ARE HERE', 16, ORANGE, 800, '0.12em', 'center') + lab('Lester&rsquo;s Possum Park', 16, INK, 700, '0', 'center'), 'center')))
    out.append(dot('fork', 6))
    out.append(at('fork', -60, -66, 200, plate(lab('THE FORK', 16, INK, 800, '0.1em', 'center') + lab('Pick a road, any road', 16, INK, 400, '0', 'center'), 'center')))
    out.append(at('bigfoot', -200, -14, 180, plate(lab('BIGFOOT COUNTRY', 16, INK, 800, '0.04em', 'center') + lab('Lock your cooler', 16, INK, 400, '0', 'center'), 'center')))
    out.append(dot('lake', 7, ORANGE))
    out.append(at('lake', 14, -20, 200, plate(lab('LAKE DESTINY', 16, INK) + lab('Idaho. Big ones bite.', 16, INK, 400, '0'))))
    out.append(at('desert', 16, -16, 220, plate(lab('Fill up before the desert', 16, INK, 400, '0'))))
    out.append(dot('neptune', 5))
    out.append(at('neptune', 12, -8, 120, plate(lab('Neptune Inn', 16, INK, 700, '0'))))
    out.append(dot('la', 7, ORANGE))
    out.append(at('la', 336, -48, 240, f'''<div style="background: {INK}; border: 2px solid {ORANGE}; border-radius: 6px; padding: 4px 10px 5px; text-align: center">
        <div style="font-family: {DISP}; font-size: 20px; line-height: 22px; color: {ORANGE}">POWERLINE &middot; LIVE IN L.A.</div>
        <div style="font-family: {BODY}; font-weight: 700; font-size: 16px; line-height: 19px; color: {PAPER}">Final night of the world tour</div></div>'''))
    out.append(ab(X + MW - 50, Y + MH - 50, 40, f'''<div style="width: 40px; height: 40px; border-radius: 50%; background: {CREAM}; border: 2px solid {INK}; box-sizing: border-box; text-align: center">
        <div style="font-family: {DISP}; font-size: 18px; line-height: 38px; color: {INK}">N&#8593;</div></div>'''))
    return ''.join(out)


def footer():
    l = ab(40, 903, 640, f'<div style="font-family: {BODY}; font-size: 16px; line-height: 17px; color: {INK}">Prices subject to change. Placemat No. 95. Printed in U.S.A. 1995.</div>')
    r = ab(744, 903, 560, f'<div style="font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 17px; color: {INK}; text-align: right">Please do not feed the possums. They are robots.</div>')
    return l + r


def finish():
    return f'''
  <img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none; opacity: 0.30">
  <img src="assets/wear-front.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; pointer-events: none">'''


body = f'''<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {INK}">
  {header()}
  {menu()}
  {still()}
  {route()}
  {footer()}
  {finish()}
</div>'''

open(os.path.join(D, 'front.body.html'), 'w').write(body)
open(os.path.join(D, 'front.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Lester&rsquo;s Possum Park placemat</title>{LINK}'
    f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

json.dump({
    'fmt': 'roadtrip', 'fn': 'fmtRoadtrip', 'faces': ['front.html'], 'names': ['Placemat'],
    'mm': [355.6, 254.0], 'fonts': FONTS,
    'fams': ['Luckiest Guy', 'Bitter', 'Caveat'],
    'phone': {'disp': "'Luckiest Guy',sans-serif", 'title': "'Luckiest Guy',sans-serif", 'name': "'Bitter',serif",
              'body': "'Bitter',serif", 'price': "'Bitter',serif", 'note': "'Bitter',serif"},
}, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)

labels = {FILM: {k: {'n': n.replace('&rsquo;', '\u2019'), 'd': d, 'note': t} for k, n, p, d, t in ALL if k}}
json.dump(labels, open(os.path.join(D, 'roadtrip.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
