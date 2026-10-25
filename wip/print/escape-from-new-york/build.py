"""Watch mess tray card, Escape from New York (1981, set in 1997).
The object: the card that sits on the trays at the U.S. Police Force mess on Liberty Island, one floor
below Security Control. Two landscape faces, 10 x 7 in (960 x 672 px). The front carries the Security
Control plan of Manhattan Island Prison (paint_map.py) with Hauk's note to the watch and an officer's mess
pass; the back carries the night's hot line, a still of Security Control and a dog tag.
Run paint_map.py first. Writes front.html, back.html, *.body.html, film.json and escape.labels.json."""
import os, json

D = os.path.dirname(os.path.abspath(__file__))
FW, FH = 960, 672
INK, ORANGE, PAPER = '#1e242c', '#d05322', '#ded0a8'
SOFT = '#4a4f52'
FONTS = ('family=Black+Ops+One'
         '&family=Barlow+Semi+Condensed:ital,wght@0,400;0,500;0,600;0,700;1,400'
         '&family=Nothing+You+Could+Do')
LINK = f'<link rel="stylesheet" href="https://fonts.googleapis.com/css2?{FONTS}&display=block">'
MAP = json.load(open(os.path.join(D, 'map_layout.json')))
MX, MY, MW, MH = 40, 150, 880, 330

CSS = f"""
*{{box-sizing:border-box;margin:0;padding:0}}
body{{margin:0;background:#777}}
.face{{position:relative;width:{FW}px;height:{FH}px;overflow:hidden;background:{PAPER};color:{INK};
 font-family:'Barlow Semi Condensed','Arial Narrow',sans-serif}}
.abs{{position:absolute}}
.disp{{font-family:'Black Ops One','Impact',sans-serif;font-weight:400;text-transform:uppercase;line-height:1}}
.kick{{font-weight:700;font-size:18px;letter-spacing:.22em;text-transform:uppercase;color:{ORANGE};line-height:1}}
.lab{{position:absolute;font-weight:700;font-size:14px;letter-spacing:.12em;text-transform:uppercase;line-height:1.15;white-space:nowrap}}
.chip{{background:{PAPER};padding:3px 6px 2px;border:1px solid {INK}}}
.sec{{font-family:'Black Ops One','Impact',sans-serif;font-size:40px;line-height:1;text-transform:uppercase;color:{INK};
 padding-bottom:6px;border-bottom:3px solid {ORANGE};margin-bottom:12px}}
.item{{margin-bottom:10px}}
.row{{display:flex;justify-content:space-between;align-items:baseline;gap:10px}}
.nm{{font-weight:700;font-size:26px;letter-spacing:-.005em;line-height:1.1}}
.pr{{font-weight:700;font-size:26px;line-height:1.1;font-variant-numeric:tabular-nums}}
.ds{{font-size:20px;line-height:1.22;margin-top:2px;color:#2b3036}}
.fine{{font-size:16px;line-height:1.3;color:{SOFT}}}
.sig{{font-family:'Nothing You Could Do',cursive;color:#1f3a7a}}
"""


def page(body):
    return (f'<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width={FW}">'
            f'<title>Escape from New York watch mess card</title>{LINK}<style>{CSS}</style></head><body>{body}</body></html>')


def grain(n):
    return (f'<img src="assets/paper-{n}.png" alt="" style="position:absolute;left:0;top:0;width:{FW}px;height:{FH}px;display:block">'
            f'<img src="assets/paper-grain.png" alt="" aria-hidden="true" style="position:absolute;left:0;top:0;width:{FW}px;height:{FH}px;display:block;opacity:.7;pointer-events:none">')


def m(key, dx=0, dy=0):
    x, y = MAP[key]
    return MX + x + dx, MY + y + dy


# ------------------------------------------------------------------ FRONT
def lab(text, x, y, cls='', style=''):
    return f'<div class="lab {cls}" style="left:{x:.0f}px;top:{y:.0f}px;{style}">{text}</div>'


labels = []
labels.append(lab('New Jersey', *m('nj', -40, -4), cls='chip'))
labels.append(lab('The wall, 50 ft', MX + 420, MY + 36, cls='chip', style=f'color:{ORANGE};border-color:{ORANGE}'))
labels.append(lab('G. Washington Br.<br><span style="color:' + ORANGE + '">Mined</span>', MX + 690, MY + 14, cls='chip'))
labels.append(f'<div class="abs disp" style="left:{MX+200}px;top:{MY+176}px;font-size:26px;color:{PAPER};letter-spacing:.08em">Manhattan Island</div>')
labels.append(lab('Maximum security prison', MX + 204, MY + 205, style=f'color:{PAPER};font-size:14px;letter-spacing:.1em'))
labels.append(lab('Harlem', *m('harlem', 0, -24), style=f'color:{PAPER}'))
labels.append(lab('Twin towers', *m('towers', 14, -8), style=f'color:{PAPER}'))
labels.append(lab('The park', *m('park', -34, -8), style=f'color:{PAPER}'))
labels.append(lab('East River', *m('east', -6, 6), style=f'font-style:italic;font-weight:600;color:{SOFT};letter-spacing:.2em'))
labels.append(lab('69th St Bridge<br><span style="color:' + ORANGE + '">Mined</span>', *m('b69', 20, 26), cls='chip'))
labels.append(lab('Brooklyn', *m('bklyn', 40, -6), cls='chip'))
labels.append(lab('Queens', MX + 610, MY + 286, cls='chip'))
labels.append(lab('Liberty Island<br><span style="color:' + ORANGE + '">Security Control</span><br>You are here', MX + 14, MY + 58, cls='chip', style=f'border:2px solid {ORANGE}'))
labels.append(lab('0', MX + 24, MY + 21))
labels.append(lab('2 miles', MX + 26 + 2 * MAP['mi_px'] - 62, MY + 21))
lx, ly = m('liberty')
labels.append(f'<div class="abs" style="left:{lx-11:.0f}px;top:{ly-11:.0f}px;width:22px;height:22px;border-radius:50%;border:2px solid {ORANGE}"></div>')

legend = f"""
<div class="abs" style="left:560px;top:46px;width:360px">
 <div class="kick" style="font-size:16px;margin-bottom:10px">Security Control plan, watch 3</div>
 <div style="display:grid;grid-template-columns:1fr 1fr;row-gap:9px;column-gap:16px;font-size:17px;font-weight:600;line-height:1.1">
  <div style="display:flex;align-items:center;gap:8px"><div style="width:30px;height:5px;background:{ORANGE}"></div>Containment wall</div>
  <div style="display:flex;align-items:center;gap:8px"><div style="width:30px;height:0;border-top:4px dashed {ORANGE}"></div>River patrol</div>
  <div style="display:flex;align-items:center;gap:8px"><div style="width:30px;text-align:center;color:{ORANGE};font-weight:700;font-size:20px;line-height:1">&#215;&#215;</div>Bridges mined</div>
  <div style="display:flex;align-items:center;gap:8px"><div style="width:30px;height:16px;background:{INK}"></div>Prison island</div>
 </div>
</div>"""

head_front = f"""
<div class="abs" style="left:40px;top:44px">
 <div class="kick">U.S. Police Force &#183; Liberty Island</div>
 <div class="disp" style="font-size:64px;margin-top:8px;letter-spacing:.01em">Watch Mess</div>
</div>
"""

map_html = f"""
<img src="assets/prison-map.png" alt="Security Control plan of Manhattan Island Prison" style="position:absolute;left:{MX}px;top:{MY}px;width:{MW}px;height:{MH}px;display:block">
{''.join(labels)}
<div class="abs" style="left:{MX}px;top:{MY+MH+8}px;width:{MW}px;display:flex;justify-content:space-between;align-items:baseline">
 <div class="disp" style="font-size:20px;color:{ORANGE};letter-spacing:.12em">Once you go in, you don't come out</div>
</div>"""

note = f"""
<div class="abs" style="left:40px;top:518px;width:560px">
 <div class="kick" style="font-size:16px;margin-bottom:8px">From the Commissioner</div>
 <div style="font-size:20px;line-height:1.3">Second watch eats first. The coffee runs all night, but nothing goes up to the consoles
 and nothing goes over the wall. Eat, then get back to it.</div>
 <div style="display:flex;align-items:baseline;gap:14px;margin-top:2px">
  <div class="sig" style="font-size:30px;line-height:1.1">Bob Hauk</div>
  <div class="fine">Police Commissioner, U.S. Police Force</div>
 </div>
</div>"""

idcard = f"""
<div class="abs" style="left:664px;top:500px;width:256px;height:136px;transform:rotate(-3deg);background:#eee8d8;border-radius:9px;
 box-shadow:0 2px 0 rgba(0,0,0,.18),0 6px 14px rgba(0,0,0,.28);overflow:hidden;border:1px solid #b8b09a">
 <div style="background:{INK};color:{PAPER};height:28px;padding:6px 10px 0;display:flex;justify-content:space-between">
  <span class="disp" style="font-size:16px;letter-spacing:.08em">U.S. Police Force</span>
  <span style="font-weight:700;font-size:14px;letter-spacing:.14em;color:{ORANGE}">USPF</span>
 </div>
 <img src="assets/id-photo.jpg" alt="" style="position:absolute;left:10px;top:36px;width:70px;height:88px;object-fit:cover;border:1px solid #888;display:block">
 <div style="position:absolute;left:90px;top:36px;right:8px;line-height:1.15">
  <div style="font-weight:700;font-size:22px;letter-spacing:.04em">REHME</div>
  <div style="font-weight:600;font-size:14px;letter-spacing:.06em">SECURITY CONTROL</div>
  <div style="font-weight:600;font-size:14px;letter-spacing:.06em;color:{ORANGE}">MESS PASS, WATCH 3</div>
  <div style="font-weight:600;font-size:14px;letter-spacing:.06em">NO. 1988-022</div>
 </div>
</div>"""

front = f'<div class="face">{grain("front")}{head_front}{legend}{map_html}{note}{idcard}</div>'

# ------------------------------------------------------------------ BACK
SPEC = {  # spec key: (printed name, printed description, price, phone note)
    "Cabbie's smoky chilli beef jerky": ("Wall Watch Jerky", "Top round soaked in soy and smoked paprika, dried in the oven.", "1.25",
                                         "Packs flat in a vest pocket."),
    "Survival tin sardines": ("Tins and Saltines", "Sardines in oil on crackers, lemon, hot sauce and parsley.", ".95",
                              "Eat them off the lid."),
    "Scavenger's hobo stew": ("A Number One Stew", "Smoked sausage, potato, white beans, tomato and cabbage.", "1.97",
                              "Ladled into a mug for the wall crews."),
    "Ration-pack chocolate oat slice": ("Ration Bar", "Buttery baked oats under dark chocolate and flaky salt.", ".75",
                                        "For the chopper crews."),
    "Brain's bathtub moonshine sour": ("White Lightning", "Corn whiskey, fresh lemon and sugar, shaken, in a jar.", "2.50",
                                       "Off watch only."),
}
ADD = {
    'meatloaf': ("Meatloaf Plate", "Two thick slices, mashed potatoes, brown gravy and peas.", "2.45"),
    'grilled': ("Grilled Cheese", "American on white, griddled, with a cup of tomato soup.", "1.85"),
    'cobbler': ("Peach Cobbler", "Sliced peaches baked under a biscuit crust, served warm.", ".90"),
    'coffee': ("Coffee", "Bottomless all night. Black or regular, hot.", ".69"),
    'cocoa': ("Hot Cocoa", "Made with whole milk, for the cold river patrol.", ".50"),
}


def item(key, dark=False):
    n, d, p = (SPEC[key][:3] if key in SPEC else ADD[key])
    col = f'color:{PAPER}' if dark else ''
    dcol = 'color:#c9c1a6' if dark else ''
    return (f'<div class="item"><div class="row"><div class="nm" style="{col}">{n}</div><div class="pr" style="{col}">{p}</div></div>'
            f'<div class="ds" style="{dcol}">{d}</div></div>')


def sec(t, dark=False):
    c = f'color:{PAPER}' if dark else ''
    return f'<div class="sec" style="{c}">{t}</div>'


K = list(SPEC)
panel = f"""
<div class="abs" style="left:0;top:0;width:310px;height:{FH}px;background:{INK}"></div>
<div class="abs" style="left:40px;top:44px;width:234px;height:142px;border:2px solid {ORANGE};padding:3px;background:{INK}">
 <img src="assets/still-control.jpg" alt="Security Control" style="width:100%;height:100%;object-fit:cover;object-position:60% 30%;display:block">
</div>
<div class="abs fine" style="left:40px;top:194px;width:234px;color:#b9b29a">Security Control, one floor up. Trays stay down here.</div>
<div class="abs" style="left:40px;top:256px;width:234px">
 {sec('Drinks', True)}
 {item('coffee', True)}{item('cocoa', True)}{item(K[4], True)}
 <div class="fine" style="color:{ORANGE};margin-top:-4px;font-weight:600">White Lightning off watch only.</div>
</div>"""

head_back = f"""
<div class="abs" style="left:338px;top:44px;width:582px;display:flex;justify-content:space-between;align-items:flex-end">
 <div>
  <div class="kick">Tonight on the hot line</div>
  <div class="disp" style="font-size:56px;margin-top:6px">The Menu</div>
 </div>
 <div style="text-align:right;font-size:17px;font-weight:600;line-height:1.25;padding-bottom:4px">Watch 3<br><span style="color:{ORANGE}">2200 to 0600</span></div>
</div>
<div class="abs" style="left:338px;top:122px;width:582px;height:2px;background:{INK}"></div>"""

cols = f"""
<div class="abs" style="left:338px;top:136px;width:272px">
 {sec('To start')}{item(K[0])}{item(K[1])}
 {sec('Rations')}{item(K[3])}{item('cobbler')}
</div>
<div class="abs" style="left:634px;top:136px;width:286px">
 {sec('Hot line')}{item(K[2])}{item('meatloaf')}{item('grilled')}
</div>"""

dogtag = f"""
<div class="abs" style="left:660px;top:470px;width:90px;height:0;border-top:4px dotted #8d8f8c;transform:rotate(14deg);transform-origin:0 0"></div>
<div class="abs" style="left:742px;top:476px;width:176px;height:92px;transform:rotate(4deg);border-radius:14px 30px 30px 14px;
 background:linear-gradient(160deg,#d9dbd8 0%,#a9adab 55%,#c5c8c6 100%);border:2px solid #8a8e8c;box-shadow:0 4px 10px rgba(0,0,0,.3)">
 <div style="position:absolute;left:10px;top:38px;width:13px;height:13px;border-radius:50%;background:{PAPER};border:2px solid #7c807e"></div>
 <div style="position:absolute;left:34px;top:9px;font-weight:700;font-size:15px;line-height:1.2;letter-spacing:.1em;color:#3b3f40">
  PLISSKEN<br>S D<br>SPEC FORCES<br>BLACK LIGHT</div>
</div>"""

fine_back = f"""
<div class="abs fine" style="left:634px;top:586px;width:286px">
 Prices subject to change. Trays to the rack.<br>
 USPF Form LI-1988. Liberty Island, N.Y. 1997.
</div>"""

back = f'<div class="face">{grain("back")}{panel}{head_back}{cols}{dogtag}{fine_back}</div>'

for n, body in (('front', front), ('back', back)):
    open(os.path.join(D, n + '.body.html'), 'w').write(body)
    open(os.path.join(D, n + '.html'), 'w').write(page(body))

film = {"fmt": "escape", "fn": "fmtEscape", "faces": ["front.html", "back.html"], "names": ["Front", "Back"],
        "mm": [254.0, 177.8], "fonts": FONTS,
        "fams": ["Black Ops One", "Barlow Semi Condensed", "Nothing You Could Do"],
        "phone": {"disp": "'Black Ops One',sans-serif", "title": "'Black Ops One',sans-serif",
                  "name": "'Barlow Semi Condensed',sans-serif", "body": "'Barlow Semi Condensed',sans-serif",
                  "price": "'Barlow Semi Condensed',sans-serif", "note": "'Barlow Semi Condensed',sans-serif"}}
json.dump(film, open(os.path.join(D, 'film.json'), 'w'), indent=1)
labels_out = {"Escape from New York (1981)": {k: {"n": v[0], "d": v[1], "note": v[3]} for k, v in SPEC.items()}}
json.dump(labels_out, open(os.path.join(D, 'escape.labels.json'), 'w'), indent=1, ensure_ascii=False)
print('built')
