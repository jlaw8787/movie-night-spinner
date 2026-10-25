"""Builds the savings deposit ticket for Dog Day Afternoon (Brooklyn, Tuesday August 22, 1972).
The object: a two-sided counter deposit ticket from the branch's own pad, printed in one green
spot ink on pale green safety paper, with an engraved vignette of the main office, a lathe-work
border and a red numbering-machine serial. Halfway through the afternoon the head teller has
rolled it into the branch typewriter and typed up the food order that goes out through the
barbershop across the street, then hit it with her date stamp out of habit.
Half letter, 5.5 x 8.5 in, portrait, two faces (front and reverse), no fold.
Writes front.html / back.html, front.body.html / back.body.html, film.json, brooklyn.labels.json."""
import os, json, random
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 528, 816
PAPER = '#e4ecdf'
GREEN = '#1f563e'
GREEN_SOFT = '#3d6b55'
RED = '#b1362b'
TYPE = '#141317'
STAMP = '#5a3f8e'
FONTS = 'family=Courier+Prime&family=Libre+Franklin:ital,wght@0,400;0,600;0,800;1,400&family=Old+Standard+TT:wght@700'
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
ENGR = "'Old Standard TT', 'Times New Roman', serif"
SANS = "'Libre Franklin', Arial, sans-serif"
MONO = "'Courier Prime', 'Courier New', monospace"
L, CW = 46, 436          # content left edge and width, everything 46px or more inside the trim
DOL, CEN = 44, 34        # amount columns


def esc(s):
    return s.replace('&', '&amp;').replace('<', '&lt;')


_rng = random.Random(822)


def typed(text, size=16, weight_jitter=True):
    """Typewriter impression: each letter struck a touch harder or softer, a hair off the line."""
    out = []
    for word in text.split(' '):
        chars = []
        for ch in word:
            op = 0.86 + 0.14 * _rng.random() if weight_jitter else 1
            dy = round(_rng.uniform(-0.35, 0.35), 2)
            chars.append(f'<span style="position: relative; top: {dy}px; opacity: {op:.2f}">{esc(ch)}</span>')
        out.append('<span style="white-space: nowrap">' + ''.join(chars) + '</span>')
    return ' '.join(out)


def label(t, extra=''):
    return (f'<div style="font-family: {SANS}; font-weight: 600; font-size: 12px; line-height: 1; letter-spacing: 0.1em; '
            f'color: {GREEN}; text-transform: uppercase{extra}">{t}</div>')


def amount_cells(d, c):
    cell = (f'width: {{w}}px; flex: none; border-left: 1.5px solid {GREEN}; box-sizing: border-box; '
            f'font-family: {MONO}; font-size: 18px; line-height: 1; color: {TYPE}; padding: 9px 5px 0 0; text-align: right')
    return (f'<div style="{cell.format(w=DOL)}">{typed(d) if d else ""}</div>'
            f'<div style="{cell.format(w=CEN)}">{typed(c) if c else ""}</div>')


def head_row(txt, num=None):
    n = (f'<span style="font-family: {SANS}; font-weight: 600; font-size: 12px; color: {GREEN}; display: inline-block; width: 18px">{num}</span>'
         if num else '')
    return (f'<div style="display: flex; border-bottom: 1px solid {GREEN_SOFT}">'
            f'<div style="flex: 1; padding: 10px 8px 6px 8px; font-family: {MONO}; font-size: 15px; line-height: 1; color: {TYPE}; letter-spacing: 0.04em">'
            f'<span style="border-bottom: 1.5px solid {TYPE}; padding-bottom: 2px">{typed(txt.upper(), 15)}</span></div>'
            f'{amount_cells("", "")}</div>')


def item_row(num, name, desc, note, d, c, per=None):
    p = (f'<div style="font-family: {MONO}; font-size: 12px; line-height: 1; color: {TYPE}; margin-top: 4px; text-align: right; padding-right: 4px; white-space: nowrap">{typed(per, 12)}</div>'
         if per else '')
    nt = (f'<div style="margin-top: 4px; font-family: {MONO}; font-size: 14px; line-height: 1.25; color: #3a3940">{typed("(" + note + ")", 14)}</div>'
          if note else '')
    ds = (f'<div style="margin-top: 4px; font-family: {MONO}; font-size: 16px; line-height: 1.27; color: {TYPE}">{typed(desc)}</div>'
          if desc else '')
    return (f'<div style="display: flex; border-bottom: 1px solid {GREEN_SOFT}">'
            f'<div style="flex: none; width: 22px; padding: 10px 0 0 7px; box-sizing: border-box; font-family: {SANS}; font-weight: 600; font-size: 12px; line-height: 1; color: {GREEN}">{num}</div>'
            f'<div style="flex: 1; padding: 8px 10px 8px 2px">'
            f'<div style="font-family: {MONO}; font-size: 19px; line-height: 1.1; color: {TYPE}; text-shadow: 0.35px 0 0 {TYPE}">{typed(name.upper(), 19)}</div>'
            f'{ds}{nt}</div>'
            f'<div style="display: flex; flex-direction: column; flex: none"><div style="display: flex; flex: none">{amount_cells(d, c)}</div>'
            f'<div style="flex: 1; display: flex; flex-direction: column; justify-content: flex-start">'
            f'<div style="width: {DOL + CEN}px; flex: 1; display: flex">'
            f'<div style="width: {DOL}px; border-left: 1.5px solid {GREEN}; box-sizing: border-box; position: relative"><div style="position: absolute; right: -{CEN}px; top: 0">{p}</div></div>'
            f'<div style="width: {CEN}px; border-left: 1.5px solid {GREEN}; box-sizing: border-box"></div></div></div></div></div>')


def total_row(t, typed_val=None, strong=False):
    bg = f'background: rgba(31,86,62,0.10);' if strong else ''
    return (f'<div style="display: flex; border-bottom: 1px solid {GREEN_SOFT}; {bg}">'
            f'<div style="flex: 1; padding: 9px 10px 7px 30px; text-align: right">{label(t)}</div>'
            f'{amount_cells(*(typed_val or ("", "")))}</div>')


def ledger_head(t):
    return (f'<div style="display: flex; background: {GREEN}; color: {PAPER}; font-family: {SANS}; font-weight: 600; font-size: 12px; '
            f'letter-spacing: 0.1em; line-height: 1">'
            f'<div style="flex: 1; padding: 6px 8px 5px">{t}</div>'
            f'<div style="width: {DOL + CEN}px; padding: 6px 0 5px; text-align: center; border-left: 1.5px solid {PAPER}; box-sizing: border-box">AMOUNT</div></div>')


def field(lab, val, w=None, size=17):
    ww = f'width: {w}px; flex: none;' if w else 'flex: 1;'
    return (f'<div style="{ww} padding: 6px 8px 7px; box-sizing: border-box">{label(lab)}'
            f'<div style="margin-top: 6px; font-family: {MONO}; font-size: {size}px; line-height: 1; color: {TYPE}; white-space: nowrap">{typed(val, size)}</div></div>')


def stamp(left, top, rot):
    """Rubber date stamp. Struck once, and the rubber rocked a hair so a faint second strike
    sits just off the first. Uneven ink comes from the painted wear laid over both."""
    def face(op, dx, dy):
        return (f'<div style="position: absolute; left: {dx}px; top: {dy}px; width: 150px; opacity: {op}">'
                f'<div style="border: 2.5px solid {STAMP}; border-radius: 6px; padding: 3px">'
                f'<div style="border: 1px solid {STAMP}; border-radius: 3px; padding: 5px 0 6px; text-align: center; color: {STAMP}; font-family: {SANS}">'
                f'<div style="font-weight: 600; font-size: 12px; line-height: 1; letter-spacing: 0.18em">RECEIVED</div>'
                f'<div style="margin-top: 4px; font-weight: 800; font-size: 18px; line-height: 1; letter-spacing: 0.03em; white-space: nowrap">AUG 22 1972</div>'
                f'<div style="margin-top: 4px; font-weight: 600; font-size: 12px; line-height: 1; letter-spacing: 0.18em">HEAD TELLER</div>'
                f'</div></div></div>')
    return (f'<div style="position: absolute; left: {left}px; top: {top}px; width: 154px; height: 68px; transform: rotate({rot}deg); transform-origin: 50% 50%">'
            f'{face(0.26, 2.2, 1.6)}{face(0.84, 0, 0)}'
            f'<img src="assets/stamp-wear.png" alt="" aria-hidden="true" style="position: absolute; left: -1px; top: -1px; width: 154px; height: 68px; display: block">'
            f'</div>')


def overlays(face):
    gw = round(FH * 2246 / 1588)
    return (f'<img src="assets/frame-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 1px; top: 0; width: {FW}px; height: {FH}px; display: block; transform: rotate(0.08deg)">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: {(FW - gw) // 2}px; top: 0; width: {gw}px; height: {FH}px; opacity: 0.4; pointer-events: none; display: block">'
            f'<img src="assets/wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def root(inner, face):
    # the safety tint is printed a pass before the green form, so it sits a hair out of register
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; font-family: {SANS}; color: {GREEN}">'
            f'<img src="assets/paper-safety-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: -2px; top: 1px; width: {FW + 2}px; height: {FH}px; display: block">'
            f'{inner}{overlays(face)}</div>')


DISH = {
    "Attica chips and onion dip": ("Attica chips and dip", "Ridged and salty, with onions cooked slow till brown in sour cream, cream cheese and chives.", "One big bowl for the counter"),
    "Deli hero wedges": ("Deli heroes, cut six ways", "Ham, salami, provolone, iceberg and tomato, oil, vinegar, oregano, on long rolls. Pressed.", "Two at 1.40. Plenty for everybody"),
    "Hostage pizza": ("Pepperoni pies, large", "Thin crust, crushed tomato and oregano, plenty of mozzarella, baked fast in a very hot oven.", "Two at 3.10. Pay the kid at the door"),
    "Italian ice": ("Lemon ice", "Fresh juice and zest, sugar and water, frozen and scraped fluffy.", "A dozen cups. Not for Mr. Mulvaney"),
    "Heatwave lager with lime and chilli salt": ("Cold beer with lime", "Lager over ice with a fresh squeeze, the glass dipped in salt and chili powder.", "A six-pack. For after closing"),
}

# ---------------- FRONT ----------------
front = f'''
<img src="assets/bank-vignette.png" alt="" style="position: absolute; left: {L - 4}px; top: 44px; width: 160px; height: 108px; display: block">
<div style="position: absolute; right: {FW - L - CW}px; top: 44px; font-family: {MONO}; font-size: 16px; line-height: 1; color: {RED}; letter-spacing: 0.04em; transform: translate(1px, -1px)">No.&nbsp;08221</div>
<div style="position: absolute; left: 214px; top: 62px; width: 268px">
  <div style="font-family: {ENGR}; font-weight: 700; font-size: 21px; line-height: 1.02; letter-spacing: 0.035em; color: {GREEN}; white-space: nowrap">HARBOR HILL<br>SAVINGS BANK</div>
  <div style="margin-top: 6px; font-family: {SANS}; font-weight: 600; font-size: 12px; line-height: 1; letter-spacing: 0.2em; color: {GREEN}">BROOKLYN, NEW YORK</div>
  <div style="margin-top: 9px; border-top: 2px solid {GREEN}; border-bottom: 0.8px solid {GREEN}; height: 2px"></div>
  <div style="margin-top: 8px; font-family: {SANS}; font-weight: 800; font-size: 25px; line-height: 1; letter-spacing: 0.06em; color: {GREEN}; white-space: nowrap">SAVINGS DEPOSIT</div>
</div>

<div style="position: absolute; left: {L}px; top: 178px; width: {CW}px; border: 1.5px solid {GREEN}; box-sizing: border-box">
  <div style="display: flex; border-bottom: 1px solid {GREEN_SOFT}">
    {field("Date", "Aug. 22, 1972", 152)}
    <div style="border-left: 1px solid {GREEN_SOFT}"></div>
    {field("Account number", "Petty cash", 150)}
    <div style="border-left: 1px solid {GREEN_SOFT}"></div>
    {field("Teller", "Sylvia")}
  </div>
  {field("Name", "Lunch order, all staff")}
</div>

<div style="position: absolute; left: {L}px; top: 278px; width: {CW}px; border: 1.5px solid {GREEN}; border-bottom: 0; box-sizing: border-box">
  {ledger_head("CURRENCY, COIN AND ITEMS, LIST SINGLY")}

  {item_row(1, *DISH["Attica chips and onion dip"], "1", "29")}
  {item_row(2, *DISH["Deli hero wedges"], "2", "80")}

  {item_row(3, *DISH["Hostage pizza"], "6", "20")}
  {total_row("Total from other side", ("6", "84"))}
  {total_row("Total", ("17", "13"), True)}
</div>
<div style="position: absolute; left: {L}px; top: 754px; width: {CW}px; display: flex; justify-content: space-between; font-family: {SANS}; font-size: 12px; line-height: 1; color: {GREEN}; white-space: nowrap">
  <span style="font-style: italic">Deposits insured up to $20,000.</span><span>Form S-822 (7/72)</span>
</div>
{stamp(58, 674, -6)}
'''

# ---------------- BACK ----------------
notes = [
    "Call it in to the barbershop.",
    "Front door only. The back is blocked.",
    "The air conditioning is off in here.",
    "Sonny is paying, cash.",
    "Destination, per Sal: Wyoming.",
    "Jenny, your husband called again.",
]
note_html = ''.join(
    f'<div style="display: flex; gap: 8px; margin-top: 4px"><div style="flex: none; width: 22px; font-family: {MONO}; font-size: 16px; line-height: 1.27; color: {TYPE}">{i}.</div>'
    f'<div style="flex: 1; font-family: {MONO}; font-size: 16px; line-height: 1.27; color: {TYPE}">{typed(n)}</div></div>'
    for i, n in enumerate(notes, 1))

BANK = [("Proof", "S."), ("Entered", ""), ("Checked", "")]
bank_html = ''.join(
    f'<div style="flex: 1; border-left: 1px solid {GREEN_SOFT}; padding: 0 6px; display: flex; align-items: center; gap: 6px">{label(l)}'
    f'<div style="font-family: {MONO}; font-size: 16px; line-height: 1; color: {TYPE}">{typed(v) if v else ""}</div></div>'
    for l, v in BANK)
back = f'''
<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px; display: flex; justify-content: space-between; align-items: flex-end">
  <div>
    <div style="font-family: {ENGR}; font-weight: 700; font-size: 17px; line-height: 1; letter-spacing: 0.05em; color: {GREEN}">HARBOR HILL SAVINGS BANK</div>
    <div style="margin-top: 6px; font-family: {SANS}; font-weight: 600; font-size: 12px; line-height: 1; letter-spacing: 0.16em; color: {GREEN}">SAVINGS DEPOSIT, REVERSE</div>
  </div>
  <div style="font-family: {MONO}; font-size: 16px; line-height: 1; color: {RED}; letter-spacing: 0.05em">No. 08221</div>
</div>
<div style="position: absolute; left: {L}px; top: 90px; width: {CW}px; border-top: 2px solid {GREEN}; border-bottom: 0.8px solid {GREEN}; height: 2px"></div>


<div style="position: absolute; left: {L}px; top: 106px; width: {CW}px">
<div style="border: 1.5px solid {GREEN}; border-bottom: 0; box-sizing: border-box">
  {ledger_head("ADDITIONAL ITEMS")}

  {item_row(4, *DISH["Italian ice"], "2", "40")}
  {item_row(5, *DISH["Heatwave lager with lime and chilli salt"], "1", "69")}
  {item_row(6, "Sodas, one case", "Twenty-four bottles, orange, cream and cola, with a diet one for Mr. Mulvaney.", None, "2", "75")}

  {total_row("Total, carry to other side", ("6", "84"), True)}
</div>
<div style="margin-top: 16px">
  <div style="font-family: {MONO}; font-size: 15px; line-height: 1; color: {TYPE}; letter-spacing: 0.04em"><span style="border-bottom: 1.5px solid {TYPE}; padding-bottom: 2px">{typed("FOR THE DELIVERY", 15)}</span></div>
  {note_html}
  <div style="margin-top: 8px; display: flex; justify-content: space-between; font-family: {MONO}; font-size: 16px; line-height: 1.27; color: {TYPE}"><span>{typed("P.S. Get well, Howard.")}</span><span>{typed("S., head teller")}</span></div>
  <div style="margin-top: 9px; border: 1.5px solid {GREEN}; display: flex; height: 30px; box-sizing: border-box">
    <div style="flex: none; background: {GREEN}; color: {PAPER}; font-family: {SANS}; font-weight: 600; font-size: 12px; line-height: 1.05; letter-spacing: 0.1em; padding: 0 8px; display: flex; align-items: center">BANK USE ONLY</div>
    {bank_html}
  </div>
</div></div>
<div style="position: absolute; left: {L}px; top: 758px; width: {CW}px; display: flex; justify-content: space-between; font-family: {SANS}; font-size: 12px; line-height: 1; color: {GREEN}; white-space: nowrap"><span>This bank acts only as the depositor&#39;s collecting agent.</span><span>Form S-822 (7/72)</span></div>
'''

TITLES = {'front': 'Savings deposit ticket, front', 'back': 'Savings deposit ticket, reverse'}
for face, inner in (('front', front), ('back', back)):
    body = root(inner, face)
    open(os.path.join(D, face + '.body.html'), 'w').write(body)
    open(os.path.join(D, face + '.html'), 'w').write(
        f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>{esc(TITLES[face])}</title>{LINK}'
        f'<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "brooklyn", "fn": "fmtBrooklyn", "faces": ["front.html", "back.html"], "names": ["Front", "Reverse"],
        "mm": [139.7, 215.9], "fonts": FONTS, "fams": ["Old Standard TT", "Courier Prime", "Libre Franklin"],
        "phone": {"disp": "'Old Standard TT',serif", "title": "'Old Standard TT',serif", "name": "'Courier Prime',monospace",
                  "body": "'Courier Prime',monospace", "price": "'Courier Prime',monospace", "note": "'Libre Franklin',sans-serif"}}
open(os.path.join(D, 'film.json'), 'w').write(json.dumps(film, indent=1))

labels = {"Dog Day Afternoon (1975)": {k: {"n": n, "d": d, "note": t + "."} for k, (n, d, t) in DISH.items()}}
open(os.path.join(D, 'brooklyn.labels.json'), 'w').write(json.dumps(labels, indent=1, ensure_ascii=False))
print('built')
