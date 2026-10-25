"""Builds the Fortuna Salumeria menu for Inside Man (Lower Manhattan, 2006).
The venue: a downtown Italian deli, espresso bar and office caterer around the corner from
Manhattan Trust, the kind of place that sends heroes, knishes and coffee to the police command post.
The object: a two-sided US Letter counter and catering menu (8.5 x 11 in, portrait, no fold), printed
in slate navy and brass on a cool stone stock, with two framed TMDB stills, a clipped catering ticket,
a DELIVERED stamp, a tear-off coupon and a note from Det. Frazier.
Writes front.html / back.html, front.body.html / back.body.html, film.json, negotiation.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))

FW, FH = 816, 1056
PAPER = '#ecebe4'
INK = '#1e2b3a'
SOFT = '#48525e'
BRASS = '#8e6a1c'
BRASS_LT = '#c9a75a'
TICKET = '#f6f1dc'
PENCIL = '#2a3550'
FONTS = ('family=Bebas+Neue&family=Work+Sans:ital,wght@0,400;0,500;0,700;0,800;1,400;1,500'
         '&family=Mrs+Saint+Delafield&family=Nanum+Pen+Script')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=swap">'
DISP = "'Bebas Neue', 'Arial Narrow', sans-serif"
BODY = "'Work Sans', Arial, sans-serif"
SCRIPT = "'Mrs Saint Delafield', cursive"
HAND = "'Nanum Pen Script', cursive"
L = 56
CW = FW - 2 * L


def paper(face):
    return (f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: -339px; top: 0; width: 1494px; height: 1056px; opacity: 0.3; pointer-events: none; display: block">'
            f'<img src="assets/paper-wear-{face}.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {FW}px; height: {FH}px; pointer-events: none; display: block">')


def section(title, kicker):
    """Kicker in brass spaced caps, then a slate band with paper caps and a brass hairline under it."""
    return (f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; line-height: 1; letter-spacing: 0.18em; color: {BRASS}; text-transform: uppercase">{kicker}</div>'
            f'<div style="margin-top: 8px; background: {INK}; color: {PAPER}; font-family: {DISP}; font-size: 42px; line-height: 1; letter-spacing: 0.06em; padding: 7px 14px 2px">{title}</div>'
            f'<div style="height: 2px; background: {BRASS}; margin: 3px 0 4px"></div>')


def dish(name, desc, price):
    ds = (f'<div style="margin-top: 4px; font-family: {BODY}; font-size: 20px; line-height: 1.3; color: {SOFT}; text-wrap: pretty">{desc}</div>' if desc else '')
    return (f'<div style="padding: 11px 0 7px">'
            f'<div style="display: flex; align-items: baseline; gap: 12px">'
            f'<div style="flex: 1; font-family: {BODY}; font-weight: 800; font-size: 26px; line-height: 1.05; color: {INK}">{name}</div>'
            f'<div style="font-family: {BODY}; font-weight: 800; font-size: 26px; line-height: 1; color: {INK}">{price}</div></div>'
            f'{ds}</div>')


def hair():
    return f'<div style="height: 1px; background: rgba(30,43,58,0.35); margin: 4px 0"></div>'


def page(face, inner):
    return (f'<div style="position: relative; width: {FW}px; height: {FH}px; overflow: hidden; background: {PAPER}; color: {INK}">'
            f'{paper(face)}{inner}</div>')


def framed(src, x, y, w, h, pos, caption):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px">'
            f'<div style="border: 2px solid {BRASS}; padding: 5px; background: {PAPER}">'
            f'<div style="width: {w - 14}px; height: {h}px; background: url(assets/{src}) {pos} / cover no-repeat"></div></div>'
            f'<div style="margin-top: 7px; font-family: {BODY}; font-style: italic; font-size: 16px; line-height: 1.25; color: {SOFT}">{caption}</div></div>')


# ---------------------------------------------------------------- front
def front():
    top = (
        f'<div style="position: absolute; left: {L}px; top: 46px; width: {CW}px; display: flex; justify-content: space-between; font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.18em; color: {BRASS}">'
        f'<span>SALUMERIA &nbsp;·&nbsp; ESPRESSO BAR &nbsp;·&nbsp; CATERING</span><span>DOWNTOWN</span></div>'
        f'<div style="position: absolute; left: {L - 3}px; top: 74px; font-family: {DISP}; font-size: 132px; line-height: 1; letter-spacing: 0.01em; color: {INK}">FORTUNA</div>'
        f'<div style="position: absolute; left: 470px; top: 88px; width: 300px; font-family: {BODY}; font-weight: 500; font-size: 20px; line-height: 1.32; color: {SOFT}">'
        f'Heroes cut to order. Coffee all day. Around the corner from the bank.</div>'
        f'<div style="position: absolute; left: 470px; top: 184px; width: 300px; font-family: {BODY}; font-style: italic; font-weight: 500; font-size: 18px; line-height: 1.3; color: {BRASS}">'
        f'We never repeat ourselves.</div>'
        f'<div style="position: absolute; left: 0; top: 232px; width: {FW}px; height: 46px; background: {INK}"></div>'
        f'<div style="position: absolute; left: 0; top: 280px; width: {FW}px; height: 2px; background: {BRASS}"></div>'
        f'<div style="position: absolute; left: {L}px; top: 232px; width: {CW}px; height: 46px; display: flex; align-items: center; justify-content: space-between; '
        f'font-family: {DISP}; font-size: 26px; letter-spacing: 0.08em; white-space: nowrap; color: {PAPER}; padding-top: 3px">'
        f'<span>Delivery below Canal</span><span style="color: {BRASS_LT}">212 555 0392</span><span>Weekdays 6 A.M. to 7 P.M.</span></div>'
    )
    still = framed('still-command.jpg', L, 304, CW, 262, '50% 36%',
                   'Lunch run to the command post out front. Heroes for twenty.')
    heroes = (
        section('Hero counter', 'On our own bread') +
        dish('Sirloin on ciabatta', 'Seared hard, sliced thin, jammy onions, arugula, horseradish cream, toasted bread.', '8.95') +
        hair() +
        dish('Italian combo', 'Genoa salami, capicola, ham, sharp provolone, oil, vinegar, hot peppers.', '7.25')
    )
    counter = (
        section('Hot counter', 'Out of the oven') +
        dish('Potato knishes', 'Potato, onion cooked slow in butter, white pepper, flaky dough, baked golden. Hot mustard.', '2.25') +
        hair() +
        dish('Party pizzettes', 'Sixteen thin rounds, tomato, mozzarella, pepperoni, crisp underneath.', '9.00')
    )
    cols = (f'<div style="position: absolute; left: {L}px; top: 628px; width: 340px">{heroes}</div>'
            f'<div style="position: absolute; left: {L + 368}px; top: 628px; width: {CW - 368}px">{counter}</div>')
    foot = (f'<div style="position: absolute; left: {L}px; top: 994px; width: {CW}px; display: flex; justify-content: space-between; '
            f'font-family: {BODY}; font-size: 16px; color: {SOFT}">'
            f'<span>Prices subject to change. New York, N.Y. 2006.</span><span style="font-weight: 700; color: {BRASS}; letter-spacing: 0.14em">PLEASE TURN OVER</span></div>')
    return page('front', top + still + cols + foot)


# ---------------------------------------------------------------- back
def ticket():
    """Catering ticket for the command post, taken by Steve-O, stamped DELIVERED."""
    line = 'border-bottom: 1px solid rgba(142,106,28,0.5); height: 30px; display: flex; align-items: flex-end'
    lab = f'font-family: {BODY}; font-weight: 700; font-size: 14px; letter-spacing: 0.06em; color: {BRASS}; width: 60px; flex: none; padding-bottom: 5px'
    hand = f'font-family: {HAND}; font-size: 26px; line-height: 1; color: {PENCIL}; padding-bottom: 1px; white-space: nowrap'
    rows = [('TO', 'Command post outside'), ('', 'of Manhattan Trust'), ('', '20 heroes, 24 knishes'),
            ('', '2 urns coffee, 4 trays'), ('BILL', 'NYPD, Det. Frazier'), ('TAKEN', 'Steve-O')]
    body = ''.join(f'<div style="{line}"><div style="{lab}">{a}</div><div style="{hand}">{b}</div></div>' for a, b in rows)
    return (
        f'<div style="position: absolute; left: 474px; top: 700px; width: 280px; height: 272px; transform: rotate(2.5deg); transform-origin: 50% 0">'
        f'<div style="position: absolute; left: 0; top: 0; width: 280px; height: 272px; background: {TICKET}; box-shadow: 0 2px 6px rgba(20,28,38,0.22)"></div>'
        f'<div style="position: absolute; left: 16px; top: 14px; width: 248px">'
        f'<div style="display: flex; justify-content: space-between; align-items: baseline; border-bottom: 2px solid {INK}; padding-bottom: 5px">'
        f'<span style="font-family: {DISP}; font-size: 24px; letter-spacing: 0.08em; color: {INK}">CATERING ORDER</span>'
        f'<span style="font-family: {BODY}; font-weight: 800; font-size: 16px; color: {BRASS}">No. 392</span></div>'
        f'{body}</div>'
        f'<div style="position: absolute; left: 112px; top: 226px; transform: rotate(-8deg); border: 3px solid rgba(160,38,42,0.82); padding: 3px 10px 0; '
        f'font-family: {DISP}; font-size: 34px; line-height: 1; letter-spacing: 0.08em; color: rgba(160,38,42,0.82)">DELIVERED</div>'
        f'<div style="position: absolute; left: 34px; top: -18px; width: 20px; height: 56px; border: 3px solid #8b8f96; border-radius: 10px; box-sizing: border-box"></div>'
        f'<div style="position: absolute; left: 39px; top: -10px; width: 11px; height: 40px; border: 3px solid #a3a7ad; border-radius: 6px; box-sizing: border-box"></div>'
        f'</div>')


def back():
    head = (
        f'<div style="position: absolute; left: {L}px; top: 44px; width: {CW}px; display: flex; align-items: flex-end; justify-content: space-between; border-bottom: 3px solid {INK}; padding-bottom: 8px">'
        f'<div style="font-family: {DISP}; font-size: 72px; line-height: 0.9; color: {INK}">FORTUNA</div>'
        f'<div style="text-align: right">'
        f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.16em; color: {BRASS}">ORDER AHEAD, CALL</div>'
        f'<div style="font-family: {DISP}; font-size: 46px; line-height: 0.95; color: {INK}">212 555 0392</div></div></div>'
    )
    left = (
        section('Coffee bar', 'Pulled all day') +
        dish('Iced espresso soda', 'A double shot over ice and tonic water, an orange slice. Stir before you sip.', '3.50') +
        hair() +
        dish('Espresso', 'Single or double, dark roast.', '1.75') +
        hair() +
        dish('Cappuccino', 'Steamed milk, a thick cap of foam, cocoa on request.', '3.25') +
        '<div style="height: 20px"></div>' +
        section('Bakery case', 'Baked here every night') +
        dish('Rainbow cookies', 'Three almond layers, green, white and red, apricot jam between, dark chocolate on top.', '1.00')
    )
    right = (
        section('Office trays', 'One day notice') +
        dish('Hero platter', 'Sirloin and Italian combo heroes, cut in thirds. Serves ten.', '65.00') +
        hair() +
        dish('Knish tray', 'Two dozen, with a crock of hot mustard.', '48.00')
    )
    cols = (f'<div style="position: absolute; left: {L}px; top: 146px; width: 340px">{left}</div>'
            f'<div style="position: absolute; left: {L + 368}px; top: 146px; width: {CW - 368}px">{right}</div>')
    still = framed('still-lobby.jpg', L + 368, 444, CW - 368, 170, '40% 45%',
                   'Coffee to go for the marble halls downtown.')
    note = (
        f'<div style="position: absolute; left: {L}px; top: 806px; width: 340px; box-sizing: border-box; border-top: 3px solid {INK}; padding-top: 10px">'
        f'<div style="font-family: {BODY}; font-weight: 700; font-size: 18px; letter-spacing: 0.16em; color: {BRASS}">BY THE REGISTER</div>'
        f'<div style="margin-top: 6px; font-family: {BODY}; font-style: italic; font-size: 20px; line-height: 1.3; color: {INK}">"Best sirloin below Canal. Keep the receipts, fellas."</div>'
        f'<div style="margin-top: 10px; font-family: {SCRIPT}; font-size: 46px; line-height: 1; color: {PENCIL}">Keith Frazier</div></div>'
    )
    foot = (f'<div style="position: absolute; left: {L}px; top: 994px; width: {CW}px; font-family: {BODY}; font-size: 16px; color: {SOFT}">'
            f'Prices subject to change. Painters and contractors, coffee half price before 8 A.M.</div>')
    return page('back', head + cols + still + note + ticket() + foot)


def wrap(body, title):
    return (f'<!doctype html><html><head><meta charset="utf-8"><title>{title}</title>{LINK}'
            f'<style>body{{margin:0}}*{{-webkit-font-smoothing:antialiased}}</style></head><body>{body}</body></html>')


LABELS = {
    'Inside Man (2006)': {
        'Hostage pizza bites': {'n': 'Party pizzettes', 'd': 'Sixteen thin rounds, tomato, mozzarella, pepperoni, crisp underneath.', 'note': 'From the hot counter, 9.00 a tray.'},
        'Brooklyn potato knishes': {'n': 'Potato knishes', 'd': 'Potato, onion cooked slow in butter, white pepper, flaky dough, baked golden. Hot mustard.', 'note': 'Out of the oven, 2.25 each.'},
        'Manhattan steak sandwich': {'n': 'Sirloin on ciabatta', 'd': 'Seared hard, sliced thin, jammy onions, arugula, horseradish cream, toasted bread.', 'note': 'Best sirloin below Canal. K. Frazier'},
        'Rainbow cookies': {'n': 'Rainbow cookies', 'd': 'Three almond layers, green, white and red, apricot jam between, dark chocolate on top.', 'note': 'From the bakery case, 1.00 each.'},
        "Negotiator's espresso orange tonic": {'n': 'Iced espresso soda', 'd': 'A double shot over ice and tonic water, an orange slice. Stir before you sip.', 'note': 'From the coffee bar, 3.50.'},
    }
}

FILM = {
    'fmt': 'negotiation', 'fn': 'fmtNegotiation',
    'faces': ['front.html', 'back.html'], 'names': ['Front', 'Back'],
    'mm': [215.9, 279.4],
    'fonts': FONTS,
    'fams': ['Bebas Neue', 'Work Sans', 'Mrs Saint Delafield', 'Nanum Pen Script'],
    'phone': {'disp': "'Bebas Neue',sans-serif", 'title': "'Bebas Neue',sans-serif",
              'name': "'Work Sans',sans-serif", 'body': "'Work Sans',sans-serif",
              'price': "'Work Sans',sans-serif", 'note': "'Work Sans',sans-serif"},
}

if __name__ == '__main__':
    for n, fn in (('front', front), ('back', back)):
        b = fn()
        open(os.path.join(D, n + '.body.html'), 'w').write(b)
        open(os.path.join(D, n + '.html'), 'w').write(wrap(b, 'Fortuna Salumeria, ' + n))
    json.dump(FILM, open(os.path.join(D, 'film.json'), 'w'), indent=1)
    json.dump(LABELS, open(os.path.join(D, 'negotiation.labels.json'), 'w'), indent=1, ensure_ascii=False)
    print('built')
