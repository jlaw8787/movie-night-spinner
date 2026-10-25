"""Raymond's ice cream truck board, Ghost Dog: The Way of the Samurai (1999).
The square menu board hung beside the serving window of Raymond's green and red ice cream truck
in the park. Raymond speaks only French, so the board is French first with English under it,
like the flavour board on the real truck in the film. Run prep.py first.
Writes board.html, board.body.html, film.json and rooftop.labels.json."""
import os, json
D = os.path.dirname(os.path.abspath(__file__))
S = 960
GREEN, RED, YEL, INK, CREAM, MUTE = '#2f9473', '#cf3e25', '#f2c033', '#16302a', '#f8f1df', '#4c5a52'
FONTS = ('family=Sniglet:wght@400;800'
         '&family=Nunito:ital,wght@0,400;0,700;0,800;1,400;1,700'
         '&family=Caveat:wght@600')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
DISP = "font-family: 'Sniglet', 'Arial Rounded MT Bold', sans-serif"
BODY = "font-family: 'Nunito', 'Helvetica Neue', Arial, sans-serif"
HAND = "font-family: 'Caveat', cursive"

# spec key -> printed name, description, price, phone note
SPEC = {
  "Coconut ice cream": ("Coconut Ice Cream", "Churned on the truck from coconut cream, with toasted coconut flakes stirred through and more on top. Cup 1.99.", "1.50",
                        "Glace coco. Raymond's own, cone or cup."),
  "Rooftop mixed nuts": ("Soy Honey Nuts", "Mixed nuts and pumpkin seeds roasted with soy, honey and sesame.", "1.25",
                         "The pigeons get the crumbs."),
  "Edamame": ("Salted Soybeans", "Edamame boiled in the pod, sea salt and a drop of sesame oil.", "1.50",
              "A paper cup for the empty pods."),
  "Teriyaki rice bowl": ("Teriyaki Bowl", "Seared chicken thigh glazed with soy, mirin and sake, sliced on short grain rice, pink ginger and scallion.", "3.99",
                         "Le plat chaud. Hot from the window at noon."),
  "Rooftop iced matcha honey lemonade": ("Green Tea Lemonade", "Fresh lemons and honey poured over ice, whisked green tea floated on top, mint.", "1.75",
                                         "Stir it before you drink it."),
}
ADD = {
  'flavors': ("Flavors of the Day", "Fraise, chocolat, pistache or vanille. Choose within seven breaths.", "1.50"),
  'fresko': ("Fresko", "Shaved ice packed in a paper cup, cherry or grenadine syrup poured over.", "1.00"),
  'tablet': ("Tablèt Pistach", "Haitian peanut brittle, cane sugar, a little ginger.", ".75"),
}


def item(n, d, p, fr=None, top=12, w=None):
    f = (f'<div style="{BODY}; font-style: italic; font-weight: 700; font-size: 16px; line-height: 1; color: {RED}; margin-bottom: 3px">{fr}</div>' if fr else '')
    return f'''<div style="margin-top: {top}px">{f}
      <div style="display: flex; justify-content: space-between; align-items: baseline; gap: 10px">
        <div style="{BODY}; font-weight: 800; font-size: 25px; line-height: 1.1; letter-spacing: -0.01em; color: {INK}">{n}</div>
        <div style="{BODY}; font-weight: 800; font-size: 25px; line-height: 1.1; white-space: nowrap; color: {INK}">{p}</div></div>
      <div style="{BODY}; font-size: 18px; line-height: 1.28; margin-top: 3px; color: #2a2f2b">{d}</div></div>'''


def S_(k, **kw):
    n, d, p, _ = SPEC[k]
    return item(n, d, p, **kw)


def A_(k, **kw):
    return item(*ADD[k], **kw)


def tab(fr, en, bg=RED):
    return (f'<div style="display: inline-flex; align-items: baseline; gap: 10px; background: {bg}; color: {CREAM}; border-radius: 22px; padding: 6px 18px 7px">'
            f'<span style="{DISP}; font-weight: 800; font-size: 26px; line-height: 1">{fr}</span>'
            f'<span style="{BODY}; font-weight: 700; font-size: 15px; letter-spacing: 0.16em; text-transform: uppercase; line-height: 1">{en}</span></div>')


def box(x, y, w, inner, h=None):
    hh = f'height: {h}px; ' if h else ''
    return f'<div style="position: absolute; left: {x}px; top: {y}px; width: {w}px; {hh}">{inner}</div>'


def rivet(x, y):
    return (f'<div style="position: absolute; left: {x}px; top: {y}px; width: 10px; height: 10px; border-radius: 5px; '
            f'background: #d9dcd2; border: 1px solid #1d5a46"></div>')


def board():
    o = []
    # enamel board and cream panel
    o.append(f'<div style="position: absolute; left: 22px; top: 22px; width: 916px; height: 916px; border-radius: 20px; background: {CREAM}; overflow: hidden">'
             f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: 916px; height: 916px; opacity: 0.45; display: block"></div>')
    for x, y in ((6, 6), (944, 6), (6, 944), (944, 944), (475, 6), (475, 944), (6, 475), (944, 475)):
        o.append(rivet(x, y))

    # header, left column
    o.append(box(56, 52, 350, f'''
      <div style="{BODY}; font-weight: 800; font-size: 17px; letter-spacing: 0.2em; color: {GREEN}">ICI ON PARLE FRANÇAIS</div>
      <div style="{DISP}; font-weight: 800; font-size: 76px; line-height: 0.95; color: {RED}; margin-top: 6px; letter-spacing: -0.01em">Raymond's</div>
      <div style="display: flex; align-items: baseline; gap: 12px; margin-top: 6px">
        <span style="{DISP}; font-size: 30px; line-height: 1; color: {INK}">Glaces</span>
        <span style="width: 9px; height: 9px; border-radius: 5px; background: {YEL}; display: inline-block; position: relative; top: -4px"></span>
        <span style="{DISP}; font-size: 30px; line-height: 1; color: {INK}">Ice Cream</span></div>'''))

    # ice cream section
    o.append(box(56, 196, 344, tab('Glaces', 'Ice cream')
                 + S_("Coconut ice cream", fr='Glace coco, faite ici', top=14)
                 + A_('flavors', fr='Les parfums', top=14)
                 + A_('fresko', fr='Fresko à la glace pilée', top=14)))

    # signature photo: the coop on the roof at dusk
    o.append(f'<div style="position: absolute; left: 420px; top: 52px; width: 476px; height: 247px; border: 4px solid {YEL}; background: {INK}">'
             f'<img src="assets/still-coop.jpg" alt="The wooden pigeon coop on the rooftop at dusk" style="display: block; width: 476px; height: 247px; object-fit: cover"></div>')
    o.append(box(420, 312, 484, f'''<div style="{BODY}; font-size: 17px; line-height: 1.3; color: {MUTE}">
      <b style="color: {INK}">Sur le toit, le soir.</b> The coop on the roof across the park. At dusk every bird comes home.</div>'''))

    # Raymond's note
    o.append(box(420, 378, 484, f'''
      <div style="border-top: 3px solid {GREEN}; padding-top: 12px">
      <div style="{BODY}; font-weight: 800; font-size: 16px; letter-spacing: 0.2em; color: {RED}">UN MOT DE RAYMOND</div>
      <div style="{BODY}; font-style: italic; font-size: 20px; line-height: 1.3; color: {INK}; margin-top: 6px">Mon meilleur ami ne parle pas un mot de français. Moi, je ne parle pas anglais. Et pourtant, on se comprend.</div>
      <div style="{BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}; margin-top: 6px; width: 330px">My best friend speaks no French. I speak no English. And still, we understand each other.</div>
      <div style="position: absolute; right: 6px; bottom: -6px; text-align: right">
        <div style="{HAND}; font-weight: 600; font-size: 40px; line-height: 1; color: #23407e; transform: rotate(-4deg)">Raymond</div>
        <div style="{BODY}; font-size: 14px; color: {MUTE}; margin-top: 2px">à la fenêtre, tous les jours</div></div></div>''', h=170))

    # divider
    o.append(f'<div style="position: absolute; left: 56px; top: 566px; width: 848px; height: 3px; background: {GREEN}"></div>')

    # row B
    o.append(box(56, 584, 270, tab('À grignoter', 'Snacks', GREEN)
                 + S_("Rooftop mixed nuts") + S_("Edamame") + A_('tablet')))
    o.append(box(346, 584, 306, tab('Le plat chaud', 'Hot', RED)
                 + S_("Teriyaki rice bowl")
                 + '<div style="height: 14px"></div>' + tab('Boissons', 'Cold', GREEN)
                 + S_("Rooftop iced matcha honey lemonade")))

    # truck still with caption
    o.append(f'<div style="position: absolute; left: 672px; top: 588px; width: 224px; height: 183px; border: 4px solid {RED}; background: {INK}">'
             f'<img src="assets/still-truck.jpg" alt="Raymond at the serving window of his truck" style="display: block; width: 224px; height: 183px; object-fit: cover"></div>')
    o.append(box(672, 786, 232, f'<div style="{BODY}; font-size: 16px; line-height: 1.3; color: {MUTE}"><b style="color: {INK}">La fenêtre.</b> Chess on the counter. Ask about the boat on the roof.</div>'))

    # prop 1: pigeon message scroll, pinned on the photo corner
    o.append(f'''<div style="position: absolute; left: 432px; top: 236px; width: 214px; height: 46px; transform: rotate(-5deg)">
      <div style="position: absolute; left: 0; top: 5px; width: 14px; height: 36px; border-radius: 7px; background: #d8cdb0; border: 1px solid #a8987a"></div>
      <div style="position: absolute; left: 7px; top: 3px; width: 200px; height: 40px; background: #f4eedc; border-top: 1px solid #c9bc9c; border-bottom: 1px solid #c9bc9c"></div>
      <div style="position: absolute; right: 0; top: 5px; width: 14px; height: 36px; border-radius: 7px; background: #e2d8bd; border: 1px solid #a8987a"></div>
      <div style="position: absolute; left: 20px; top: 6px; width: 180px; {HAND}; font-weight: 600; font-size: 24px; line-height: 34px; color: #23407e; text-align: center; white-space: nowrap">Two coco. One for the girl.</div></div>''')

    # prop 2: library book card
    o.append(f'''<div style="position: absolute; left: 718px; top: 838px; width: 182px; height: 74px; background: #f3e7c4; border: 1px solid #b9a77c; transform: rotate(3deg); overflow: hidden">
      <div style="position: absolute; left: 8px; top: 5px; {BODY}; font-weight: 800; font-size: 14px; line-height: 1.1; color: {INK}; letter-spacing: 0.04em">RASHOMON</div>
      <div style="position: absolute; right: 8px; top: 6px; {BODY}; font-size: 14px; line-height: 1.1; color: {MUTE}">Akutagawa</div>
      <div style="position: absolute; left: 0; top: 24px; width: 182px; height: 1px; background: #b9a77c"></div>
      <div style="position: absolute; left: 62px; top: 24px; width: 1px; height: 50px; background: #d29a8a"></div>
      <div style="position: absolute; left: 0; top: 48px; width: 182px; height: 1px; background: #cdbd94"></div>
      <div style="position: absolute; left: 6px; top: 29px; {BODY}; font-weight: 700; font-size: 14px; color: #6a3f8c">OCT 7</div>
      <div style="position: absolute; left: 70px; top: 22px; {HAND}; font-weight: 600; font-size: 24px; color: #23407e">Pearline</div>
      <div style="position: absolute; left: 6px; top: 53px; {BODY}; font-weight: 700; font-size: 14px; color: #6a3f8c">OCT 21</div>
      <div style="position: absolute; left: 70px; top: 47px; {HAND}; font-weight: 600; font-size: 24px; color: #23407e">Ghost Dog</div></div>''')

    # fine print
    o.append(box(56, 892, 650, f'<div style="{BODY}; font-size: 15px; line-height: 1.25; color: {MUTE}">Prices subject to change. Vendor permit No. 7. Orders by pigeon welcome. Season accounts settled the first day of autumn. 1999.</div>'))

    o.append(f'<img src="assets/wear-board.png" alt="" aria-hidden="true" style="position: absolute; left: 0; top: 0; width: {S}px; height: {S}px; opacity: 0.55; pointer-events: none; display: block">')
    return (f'<div style="position: relative; width: {S}px; height: {S}px; overflow: hidden; background: {GREEN}; color: {INK}; {BODY}">'
            + ''.join(o) + '</div>')


body = board()
open(os.path.join(D, 'board.body.html'), 'w').write(body)
open(os.path.join(D, 'board.html'), 'w').write(
    f'<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Raymond\'s Ice Cream</title>{LINK}<style>body{{margin:0}}</style></head><body>{body}</body></html>')

film = {"fmt": "rooftop", "fn": "fmtRooftop", "faces": ["board.html"], "names": ["Truck board"], "mm": [254, 254],
        "fonts": FONTS, "fams": ["Sniglet", "Nunito", "Caveat"],
        "phone": {"disp": "'Sniglet',sans-serif", "title": "'Sniglet',sans-serif", "name": "'Nunito',sans-serif",
                  "body": "'Nunito',sans-serif", "price": "'Nunito',sans-serif", "note": "'Nunito',sans-serif"}}
json.dump(film, open(os.path.join(D, 'film.json'), 'w'), indent=1, ensure_ascii=False)
labels = {"Ghost Dog: The Way of the Samurai (1999)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}}
json.dump(labels, open(os.path.join(D, 'rooftop.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
