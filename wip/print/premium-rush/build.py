"""Builds the Spoke & Chain delivery ticket (Premium Rush, Manhattan, 2012).
A messenger company's laser-filled delivery ticket on pre-printed red form stock, US Letter, two sides.
Front: the dispatch supper run, typed onto the ticket and ticked Premium Rush.
Back: the rates and conditions of carriage printed on the reverse of every ticket.
Writes front.body.html / back.body.html and full pages front.html / back.html."""
import os, random
D = os.path.dirname(os.path.abspath(__file__))
W, H = 816, 1056
PAPER, RED, TONER, SOFT, BLUE, PALE = '#f7f6f1', '#c22f22', '#1f2024', '#3c3d42', '#2b3f8c', '#f3d9d2'
FONTS = ('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800'
         '&family=IBM+Plex+Mono:wght@400;600&family=IBM+Plex+Sans:wght@400;500&family=Nothing+You+Could+Do&display=swap')
COND = "'Barlow Condensed', sans-serif"; MONO = "'IBM Plex Mono', monospace"
SANS = "'IBM Plex Sans', sans-serif"; HAND = "'Nothing You Could Do', cursive"

# (stop line, [(qty, name, description, for, amount)])
RUN = [
  ('STOP 1. HALAL CART, CORNER OF THE BLOCK', [
    ('3', 'Chicken over rice', 'Thighs in lemon, oregano, cumin and coriander, griddled and chopped. Yellow turmeric underneath, lettuce, white and hot sauce.', 'Wilee, Vanessa, Manny', '18.00')]),
  ('STOP 2. CHINATOWN BAKERY', [
    ('2', 'Char siu bao, bag of 3', 'Pork neck marinated overnight in hoisin, honey, soy and five spice, roasted sticky and chopped, in soft steamed buns.', 'Raj', '6.00')]),
  ('STOP 3. JUICE COUNTER', [
    ('1', 'Banana berry smoothie', 'Frozen berries, rolled oats, peanut butter and cold milk, blended thick. Shot of espresso on top, 75 cents.', 'Vanessa', '5.75'),
    ('4', 'Fuel bars', 'Rolled oats, chopped dates, peanuts and seeds, bound with honey, butter and brown sugar, baked and cut.', 'the bags', '5.00'),
    ('3', 'Coffee, large', 'Hot and black. Sugar and milk on the side.', 'Raj, Wilee, Manny', '3.75')]),
  ('STOP 4. DISPATCH, THE JAR ON THE COUNTER', [
    ('6', 'Chocolate chip cookies', 'Browned butter and brown sugar dough, rested overnight, baked soft in the middle, flaky salt on top. 50 cents each in the can.', 'the floor', '3.00')]),
]
TOTAL = '41.50'

def lab(t, size=12, color=RED, ls='0.12em', w=700):
    return f'<span style="font-family: {COND}; font-weight: {w}; font-size: {size}px; letter-spacing: {ls}; color: {color}; text-transform: uppercase">{t}</span>'

def barcode(width=232, height=30, seed=2012):
    random.seed(seed); x = 0; bars = ''
    while x < width - 6:
        w = random.choice((2, 2, 2, 4, 4, 6)); gap = random.choice((2, 2, 4))
        bars += f'<div style="position: absolute; left: {x}px; top: 0; width: {w}px; height: {height}px; background: {TONER}"></div>'
        x += w + gap
    return f'<div style="position: relative; width: {width}px; height: {height}px; margin-left: auto">{bars}</div>'

def box(checked=False):
    x = (f'<span style="position: absolute; left: -2px; top: -12px; font-family: {HAND}; font-size: 34px; line-height: 1; color: {BLUE}; '
         f'transform: rotate(-6deg)">X</span>' if checked else '')
    return f'<span style="position: relative; display: inline-block; width: 20px; height: 20px; border: 2px solid {RED}; background: {PAPER}; flex: none">{x}</span>'

def cell(label, value, w, hand=False, last=False):
    v = (f'<div style="margin-top: 4px; font-family: {HAND}; font-size: 25px; line-height: 1.1; color: {BLUE}; transform: rotate(-1.5deg); transform-origin: left center">{value}</div>' if hand else
         f'<div style="margin-top: 6px; font-family: {MONO}; font-weight: 600; font-size: 16px; line-height: 1.3; color: {TONER}">{value}</div>')
    return (f'<div style="width: {w}px; padding: 6px 10px 7px; box-sizing: border-box; {"" if last else f"border-right: 1.5px solid {RED};"}">'
            f'{lab(label)}{v}</div>')

def grain(): return f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block; opacity: 0.4">'
def wear(n): return f'<img src="assets/wear-{n}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'

def masthead(right):
    return (f'<div style="display: flex; justify-content: space-between; align-items: flex-start">'
            f'<div>'
            f'<div style="font-family: {COND}; font-weight: 800; font-size: 46px; line-height: 0.9; letter-spacing: 0.01em; color: {RED}">SPOKE &amp; CHAIN</div>'
            f'<div style="margin-top: 5px">{lab("Messenger Service, Inc.", 17, RED, "0.2em", 700)}</div>'
            f'<div style="margin-top: 5px; font-family: {COND}; font-weight: 500; font-size: 15px; letter-spacing: 0.04em; color: {RED}">'
            f'Manhattan, below 125th. Dispatch (212) 555-0187.</div></div>{right}</div>')

def front():
    right = (f'<div style="text-align: right">'
             f'<div style="font-family: {COND}; font-weight: 800; font-size: 28px; line-height: 1; letter-spacing: 0.06em; color: {RED}">DELIVERY TICKET</div>'
             f'<div style="margin-top: 6px; display: flex; justify-content: flex-end; align-items: baseline; gap: 8px">{lab("No.", 15)}'
             f'<span style="font-family: {MONO}; font-weight: 600; font-size: 22px; color: {RED}; letter-spacing: 0.04em">0412 8836</span></div>'
             f'<div style="margin-top: 7px">{barcode()}</div></div>')
    svc = ''.join(
        f'<div style="display: flex; align-items: center; gap: 9px">{box(c)}<div style="line-height: 1">{lab(t, 18, RED, "0.08em", 800)}'
        f'<div style="margin-top: 3px; font-family: {COND}; font-weight: 500; font-size: 13px; color: {RED}">{s}</div></div></div>'
        for t, s, c in (('Regular', 'Within 2 hours', False), ('Rush', 'Within 1 hour', False), ('Premium Rush', 'Picked up now, straight through', True)))
    rows = ''
    for si, (stop, items) in enumerate(RUN):
        rows += (f'<div style="margin: {2 if si == 0 else 7}px 0 3px 64px; font-family: {MONO}; font-weight: 600; font-size: 13px; letter-spacing: 0.04em; color: {SOFT}">{stop}</div>')
        for q, n, d, who, amt in items:
            rows += (f'<div style="display: flex; align-items: flex-start; padding: 1px 0 7px">'
                     f'<div style="width: 64px; font-family: {MONO}; font-weight: 600; font-size: 20px; line-height: 1.2; text-align: center; color: {TONER}">{q}</div>'
                     f'<div style="flex: 1; padding-right: 18px">'
                     f'<div style="display: flex; align-items: baseline; gap: 12px; flex-wrap: wrap"><span style="font-family: {MONO}; font-weight: 600; font-size: 20px; line-height: 1.2; color: {TONER}">{n.upper()}</span>'
                     f'<span style="font-family: {MONO}; font-size: 13px; color: {SOFT}">FOR {who.upper()}</span></div>'
                     f'<div style="margin-top: 3px; font-family: {SANS}; font-size: 16px; line-height: 1.3; color: {SOFT}; text-wrap: pretty">{d}</div></div>'
                     f'<div style="width: 96px; font-family: {MONO}; font-weight: 600; font-size: 18px; line-height: 1.3; text-align: right; color: {TONER}">{amt}</div></div>')
    table = (f'<div style="margin-top: 12px; border: 1.5px solid {RED}">'
             f'<div style="display: flex; background: {RED}; padding: 5px 0 4px">'
             f'<div style="width: 64px; text-align: center">{lab("Qty", 13, PAPER)}</div>'
             f'<div style="flex: 1">{lab("Contents", 13, PAPER)}</div>'
             f'<div style="width: 96px; text-align: right; padding-right: 10px; box-sizing: border-box">{lab("Amount", 13, PAPER)}</div></div>'
             f'<div style="padding: 6px 10px 2px 0">{rows}</div></div>')
    totals = (f'<div style="width: 250px; border: 1.5px solid {RED}">'
              + ''.join(f'<div style="display: flex; justify-content: space-between; align-items: baseline; padding: 4px 10px; {"border-top: 1.5px solid " + RED + ";" if i else ""}{" background: " + PALE + ";" if i == 2 else ""}">'
                        f'{lab(k, 13)}<span style="font-family: {MONO}; font-weight: 600; font-size: {20 if i == 2 else 16}px; color: {TONER}">{v}</span></div>'
                        for i, (k, v) in enumerate((('Contents', TOTAL), ('Premium Rush charge', 'NO CHG'), ('Total due', TOTAL))))
              + '</div>')
    sign = (f'<div style="flex: 1; margin-right: 22px">'
            f'<div style="display: flex; gap: 20px">'
            f'<div style="flex: 1"><div style="position: relative; height: 40px; border-bottom: 1.5px solid {RED}">'
            f'<span style="position: absolute; left: 10px; bottom: 0; font-family: {HAND}; font-size: 34px; line-height: 1; color: {BLUE}; transform: rotate(-4deg); transform-origin: left bottom">Raj</span></div>'
            f'<div style="margin-top: 4px">{lab("Received by, signature", 12)}</div></div>'
            f'<div style="width: 110px"><div style="position: relative; height: 40px; border-bottom: 1.5px solid {RED}">'
            f'<span style="position: absolute; left: 8px; bottom: 2px; font-family: {HAND}; font-size: 25px; line-height: 1; color: {BLUE}">5:58</span></div>'
            f'<div style="margin-top: 4px">{lab("Time in", 12)}</div></div></div>'
            f'<div style="margin-top: 8px; font-family: {COND}; font-weight: 500; font-size: 14px; line-height: 1.3; color: {RED}">'
            f'Unsigned tickets are not paid. Rates and conditions on reverse.</div></div>')
    cells = (f'<div style="margin-top: 12px; display: flex; border: 1.5px solid {RED}">'
             f'{cell("Pick up", "4 stops, see below", 196)}'
             f'{cell("Deliver to", "Dispatch. Attn: Raj", 214)}'
             f'{cell("Rider", "Wilee", 150, hand=True)}'
             f'{cell("Time out", "4:41 PM", 157, last=True)}</div>')
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {TONER}">{grain()}'
            f'<img src="assets/stain-carbon-pink.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {W}px; height: {H}px; display: block">'
            f'<img src="assets/stain-chainring.png" alt="" aria-hidden="true" style="position: absolute; left: 560px; top: 820px; width: 350px; height: 350px; display: block; opacity: 0.6">'
            f'<div style="position: absolute; left: 48px; top: 44px; width: 720px">'
            f'{masthead(right)}'
            f'<div style="margin-top: 12px; height: 3px; background: {RED}"></div>'
            f'<div style="margin-top: 10px; display: flex; align-items: center; gap: 30px">{lab("Service", 14, RED, "0.16em", 700)}{svc}</div>'
            f'{cells}{table}'
            f'<div style="margin-top: 12px; display: flex; align-items: flex-start">{sign}{totals}</div></div>'
            f'<div style="position: absolute; left: 48px; bottom: 42px; width: 720px; display: flex; justify-content: space-between">'
            f'{lab("White: dispatch&nbsp;&nbsp; Yellow: rider&nbsp;&nbsp; Pink: client", 12, RED, "0.1em", 600)}{lab("Form DT-3", 12, RED, "0.1em", 600)}</div>'
            f'{wear("front")}</div>')

# zone, streets, place, band centre y, number circle centre x (map px, see paint.py)
ZONES = [('5', '110th to 125th St', 'Morningside Heights', 45, 62), ('4', '59th to 110th St', 'The park', 128, 74),
         ('3', '14th to 59th St', 'Midtown', 238, 53), ('2', 'Canal to 14th St', 'The Village', 327, 58),
         ('1', 'Below Canal St', 'Chinatown, Financial', 395, 64)]
RATES = [('Same zone', '9.00', '14.00', '22.00'), ('Next zone', '12.00', '18.00', '28.00'),
         ('2 to 3 zones', '15.00', '22.00', '35.00'), ('4 zones', '18.00', '27.00', '45.00')]
TERMS = [
  'Regular is delivered within two hours of the call, Rush within one. Premium Rush goes at once and straight through, no other stops, <span style="position: relative; white-space: nowrap">unless dispatch says otherwise.<span style="position: absolute; left: -2px; right: 0; bottom: -2px; height: 2px; background: #2b3f8c; transform: rotate(-0.8deg); border-radius: 1px"></span></span>',
  'Envelopes and small parcels only. Nothing over 20 pounds, no cash, no live animals.',
  'Every ticket is signed at delivery. No signature, no pay.',
  'Riders wait ten minutes at a pick up. After that, waiting time is billed by the quarter hour.',
  'Liability is limited to $100 per ticket unless a declared value is written on the front.',
  'Riders are paid by the ticket. Hand your tickets to dispatch before 7 PM.',
  'Sidewalk tickets from bike cops are paid by the rider.',
  'Brakes are the rider’s own business.',
  'Supper run: orders on the board by 4:30. One rider goes, everyone chips in.',
]

def back():
    zones = ''
    for z, rng_, place, cy, cx in ZONES:
        zones += (f'<div style="position: absolute; left: {cx - 14}px; top: {cy - 14}px; width: 24px; height: 24px; border: 2px solid {RED}; border-radius: 50%; background: {PAPER}; '
                  f'text-align: center; font-family: {COND}; font-weight: 800; font-size: 19px; line-height: 24px; color: {RED}">{z}</div>'
                  f'<div style="position: absolute; left: 130px; top: {cy - 19}px; width: 120px; line-height: 1.2">{lab(rng_, 15, RED, "0.05em", 700)}'
                  f'<div style="margin-top: 1px; font-family: {COND}; font-weight: 500; font-size: 14px; color: {RED}">{place}</div></div>')
    zone_map = (f'<div style="width: 250px">'
                f'<div style="margin-bottom: 8px">{lab("Zones, north to south", 14, RED, "0.14em")}</div>'
                f'<div style="position: relative; width: 250px; height: 440px"><img src="assets/zone-map.png" alt="" style="position: absolute; left: 0; top: 0; width: 250px; height: 440px; display: block">'
                f'<div style="position: absolute; right: 18px; top: 0; font-family: {COND}; font-weight: 800; font-size: 13px; line-height: 1; color: {RED}">N</div>{zones}</div>'
                f'<div style="margin-top: 8px; font-family: {COND}; font-weight: 500; font-size: 14px; line-height: 1.3; color: {RED}">'
                f'Count every zone line you cross. Above 125th St and the boroughs by quote.</div>'
                f'<div style="margin-top: 16px; border: 1.5px solid {RED}; padding: 10px 12px 12px">'
                f'{lab("Calling in a pick up", 14, RED, "0.14em")}'
                + ''.join(f'<div style="margin-top: 7px; font-family: {SANS}; font-size: 16px; line-height: 1.3; color: {RED}">{t}</div>' for t in ('Street address and floor', 'Name to ask for', 'Where it goes', 'Regular, Rush or Premium'))
                + '</div></div>')
    rh = ''.join(f'<div style="width: 92px; text-align: right">{lab(t, 14, PAPER, "0.08em")}</div>' for t in ('Regular', 'Rush', 'Premium'))
    rates = ''.join(
        f'<div style="display: flex; align-items: baseline; padding: 7px 10px; {"border-top: 1px solid " + RED + ";" if i else ""}">'
        f'<div style="flex: 1">{lab(k, 16, RED, "0.06em", 700)}</div>'
        + ''.join(f'<div style="width: 92px; text-align: right; font-family: {MONO}; font-weight: 600; font-size: 16px; color: {RED}">{v}</div>' for v in vals)
        + '</div>' for i, (k, *vals) in enumerate(RATES))
    terms = ''.join(
        f'<div style="display: flex; gap: 10px; margin-top: {0 if i == 0 else 9}px">'
        f'<div style="width: 22px; flex: none; font-family: {COND}; font-weight: 800; font-size: 17px; line-height: 1.25; color: {RED}">{i + 1}.</div>'
        f'<div style="font-family: {SANS}; font-size: 16px; line-height: 1.34; color: {RED}; text-wrap: pretty">{t}</div></div>'
        for i, t in enumerate(TERMS))
    return (f'<div style="position: relative; width: {W}px; height: {H}px; overflow: hidden; background: {PAPER}; color: {RED}">{grain()}'
            f'<div style="position: absolute; left: 48px; top: 44px; width: 720px">'
            f'<div style="display: flex; justify-content: space-between; align-items: flex-end">'
            f'<div style="font-family: {COND}; font-weight: 800; font-size: 34px; line-height: 1; letter-spacing: 0.01em; color: {RED}">RATES AND CONDITIONS OF CARRIAGE</div>'
            f'{lab("Effective Jan. 2012", 14, RED, "0.12em", 600)}</div>'
            f'<div style="margin-top: 12px; height: 3px; background: {RED}"></div>'
            f'<div style="margin-top: 22px; display: flex; gap: 28px; align-items: flex-start">{zone_map}'
            f'<div style="flex: 1">'
            f'<div style="margin-bottom: 8px">{lab("Rates per ticket, Manhattan", 14, RED, "0.14em")}</div>'
            f'<div style="border: 1.5px solid {RED}"><div style="display: flex; background: {RED}; padding: 6px 10px 5px"><div style="flex: 1"></div>{rh}</div>{rates}</div>'
            f'<div style="margin-top: 7px; font-family: {COND}; font-weight: 500; font-size: 14px; color: {RED}">Round trips and returns are billed as two tickets.</div>'
            f'<div style="margin-top: 22px; margin-bottom: 10px">{lab("Conditions", 14, RED, "0.14em")}</div>{terms}</div></div></div>'
            f'<div style="position: absolute; left: 48px; bottom: 42px; width: 720px; padding-top: 10px; border-top: 1.5px solid {RED}; display: flex; justify-content: space-between">'
            f'{lab("Spoke &amp; Chain Messenger Service, Inc.", 13, RED, "0.12em", 700)}{lab("Pads of 50 sets. Reorder from dispatch.", 13, RED, "0.08em", 500)}</div>'
            f'<div style="position: absolute; left: 48px; top: 846px; width: 720px">{lab("Dispatch notes", 14, RED, "0.14em")}'
            + ''.join(f'<div style="height: 32px; border-bottom: 1px solid {RED}"></div>' for _ in range(3)) + '</div>'
            f'<div style="position: absolute; left: 70px; top: 870px; font-family: {HAND}; font-size: 25px; line-height: 1; color: {BLUE}; transform: rotate(-2deg)">Manny owes 6.00. Ask him Friday.</div>'
            f'<div style="position: absolute; left: 76px; top: 903px; font-family: {HAND}; font-size: 25px; line-height: 1; color: {BLUE}; transform: rotate(-1.5deg)">Supper run goes Premium. Dispatch says otherwise. R.</div>'
            f'{wear("back")}</div>')

FACES = {'front': front(), 'back': back()}
for n, b in FACES.items():
    open(os.path.join(D, n + '.body.html'), 'w').write(b)
    open(os.path.join(D, n + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Spoke and Chain delivery ticket, {n}</title>'
        f'<link rel="stylesheet" href="{FONTS}"><style>body{{margin:0}}</style></head><body>{b}</body></html>')
print('built')
