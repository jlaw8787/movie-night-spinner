#!/usr/bin/env python3
"""App-only copies of the Galaxy Video photos that show film posters.

galaxy-front*.webp has real posters pasted in the windows (TMDB), and aisles*.webp has
generated covers that imitate real posters. The app build cannot carry either
(docs/ARTWORK-RIGHTS.md), so this makes app copies:

- galaxy-front-app*.webp: every poster in the windows is covered by a plain shop flyer
  set in type (aisle names, store notices). The OPEN sign, hours card, street number,
  BE KIND REWIND and NEW RELEASES boards stay as they are.
- aisles-app*.webp: the shelves are thrown well out of focus, so no cover reads.
  The ceiling and the blank hanging signs stay sharp.
- latedoor-app.webp: the late show curtain. The tape shelves either side carry covers that
  imitate real posters, so they go well out of focus; the curtain, its door frame and the
  blank sign above it stay sharp.

Run from the repo root: python3 scripts/app-hero.py
Needs Pillow. The flyer type is Poppins Bold (SIL Open Font Licence).
"""
import os
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
HERO = os.path.join(ROOT, "assets", "hero")
OUT = os.path.join(ROOT, "assets", "app")
FONT_PATHS = [
    "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]
FONT = next(p for p in FONT_PATHS if os.path.exists(p))

# flyers over the posters, in the coordinates of the full 1774 x 1057 photo
CREAM, NAVY, GOLD, RED, DARK, TEAL = "#e6dcc2", "#2a2f6b", "#efc14a", "#8a1f2b", "#1b1b22", "#1f6b5c"
FLYERS = [
    ((296, 586, 386, 714), CREAM, NAVY, "MEMBERS\nWELCOME"),
    ((384, 650, 516, 760), NAVY, GOLD, "2 FOR 1\nTUESDAYS"),
    ((410, 572, 476, 652), DARK, "#e06a5a", "LATE\nSHOW"),
    ((556, 478, 606, 550), GOLD, DARK, "VHS"),
    ((554, 536, 714, 680), CREAM, RED, "CLASSICS\nAISLE 4"),
    ((554, 674, 712, 796), RED, CREAM, "CANDY BAR\nINSIDE"),
    ((936, 412, 1006, 548), CREAM, TEAL, "FAMILY\nNIGHT"),
    ((1004, 412, 1114, 548), DARK, CREAM, "HORROR\nWALL"),
    ((936, 544, 1030, 686), NAVY, GOLD, "ACTION"),
    ((1028, 544, 1126, 686), GOLD, NAVY, "COMEDY"),
    ((1124, 544, 1222, 686), RED, CREAM, "DRAMA"),
    ((1220, 544, 1304, 686), TEAL, CREAM, "KIDS"),
    ((936, 728, 1048, 796), DARK, GOLD, "OPEN\nLATE"),
]


def fit_font(draw, text, box_w, box_h):
    size = 60
    while size > 8:
        f = ImageFont.truetype(FONT, size)
        l, t, r, b = draw.multiline_textbbox((0, 0), text, font=f, spacing=size * 0.12, align="center")
        if r - l <= box_w * 0.82 and b - t <= box_h * 0.7:
            return f
        size -= 1
    return ImageFont.truetype(FONT, 8)


def flyer(size, bg, ink, text):
    w, h = size
    card = Image.new("RGB", size, bg)
    d = ImageDraw.Draw(card)
    d.rectangle((3, 3, w - 4, h - 4), outline=ink, width=2)
    f = fit_font(d, text, w, h)
    l, t, r, b = d.multiline_textbbox((0, 0), text, font=f, spacing=f.size * 0.12, align="center")
    d.multiline_text(((w - (r - l)) / 2 - l, (h - (b - t)) / 2 - t), text, font=f, fill=ink, spacing=f.size * 0.12, align="center")
    # night light through glass: dimmer, a touch soft, a little grain
    card = card.filter(ImageFilter.GaussianBlur(0.7))
    card = Image.blend(card, Image.new("RGB", size, "#0b0d14"), 0.4)
    noise = Image.effect_noise(size, 18).convert("RGB")
    return Image.blend(card, noise, 0.06)


def front():
    src = Image.open(os.path.join(HERO, "galaxy-front.webp")).convert("RGB")
    for (x0, y0, x1, y1), bg, ink, text in FLYERS:
        src.paste(flyer((x1 - x0, y1 - y0), bg, ink, text), (x0, y0))
    return src


def aisles():
    src = Image.open(os.path.join(HERO, "aisles.webp")).convert("RGB")
    w, h = src.size
    soft = src.filter(ImageFilter.GaussianBlur(16))
    soft = Image.blend(soft, Image.new("RGB", src.size, "#20160f"), 0.12)
    # sharp ceiling and signs, soft from the top of the shelves down, with a feathered edge
    mask = Image.new("L", src.size, 0)
    md = ImageDraw.Draw(mask)
    top = int(h * 0.2)
    md.rectangle((0, top, w, h), fill=255)
    # the wall of tapes on the right runs up to the ceiling
    md.polygon([(int(w * 0.84), int(h * 0.12)), (w, 0), (w, h), (int(w * 0.84), h)], fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(28))
    return Image.composite(soft, src, mask)


def latedoor():
    src = Image.open(os.path.join(HERO, "latedoor.webp")).convert("RGB")
    w, h = src.size
    soft = src.filter(ImageFilter.GaussianBlur(14))
    soft = Image.blend(soft, Image.new("RGB", src.size, "#20160f"), 0.12)
    # soft left of the door frame and right of it (the near shelf and the far aisle), sharp door and sign
    mask = Image.new("L", src.size, 0)
    md = ImageDraw.Draw(mask)
    md.rectangle((0, 0, int(w * 0.225), h), fill=255)
    md.rectangle((int(w * 0.8), 0, w, h), fill=255)
    mask = mask.filter(ImageFilter.GaussianBlur(10))
    return Image.composite(soft, src, mask)


def save(im, name, widths):
    os.makedirs(OUT, exist_ok=True)
    full_w = im.size[0]
    for wd in widths:
        out = im if wd == full_w else im.resize((wd, round(im.size[1] * wd / full_w)), Image.LANCZOS)
        suffix = "" if wd == full_w else "-%d" % wd
        p = os.path.join(OUT, "%s%s.webp" % (name, suffix))
        out.save(p, "WEBP", quality=80, method=6)
        print(os.path.relpath(p, ROOT), out.size, os.path.getsize(p) // 1024, "KB")


if __name__ == "__main__":
    save(front(), "galaxy-front-app", [1774, 1400, 1000])
    save(aisles(), "aisles-app", [1774, 1400, 1000])
    save(latedoor(), "latedoor-app", [700])
