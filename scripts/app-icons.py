#!/usr/bin/env python3
"""App icons and launch screens for the native projects, from assets/app/icon-512.png.

Writes over the Capacitor placeholders in ios/ and android/. Run from the repo root after
`npx cap add`: python3 scripts/app-icons.py

The 1024 px App Store icon is scaled up from the 512 px web icon. It works, but a 1024 px master
of the logo would be sharper; drop one in at assets/app/icon-1024.png and run this again.
"""
import os
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BG = (13, 5, 8)  # #0d0508, the site's background
src_path = os.path.join(ROOT, "assets/app/icon-1024.png")
if not os.path.exists(src_path):
    src_path = os.path.join(ROOT, "assets/app/icon-512.png")
SRC = Image.open(src_path).convert("RGBA")


def flat(size):
    """the icon on the dark background, no transparency (Apple refuses an icon with alpha)"""
    out = Image.new("RGB", (size, size), BG)
    ic = SRC.resize((size, size), Image.LANCZOS)
    out.paste(ic, (0, 0), ic)
    return out


def centred(w, h, logo):
    out = Image.new("RGB", (w, h), BG)
    ic = SRC.resize((logo, logo), Image.LANCZOS)
    out.paste(ic, ((w - logo) // 2, (h - logo) // 2), ic)
    return out


def save(im, rel):
    p = os.path.join(ROOT, rel)
    if not os.path.isdir(os.path.dirname(p)):
        return
    im.save(p)
    print(rel, im.size)


# iPhone: one 1024 icon (Xcode makes the rest) and the launch image
save(flat(1024), "ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png")
for n in ["splash-2732x2732.png", "splash-2732x2732-1.png", "splash-2732x2732-2.png"]:
    save(centred(2732, 2732, 900), "ios/App/App/Assets.xcassets/Splash.imageset/" + n)

# Android: launcher icons, the adaptive icon's foreground (logo inside the 66% safe zone), launch screens
dens = {"mdpi": 1, "hdpi": 1.5, "xhdpi": 2, "xxhdpi": 3, "xxxhdpi": 4}
for d, k in dens.items():
    save(flat(round(48 * k)), "android/app/src/main/res/mipmap-%s/ic_launcher.png" % d)
    round_icon = flat(round(48 * k))
    save(round_icon, "android/app/src/main/res/mipmap-%s/ic_launcher_round.png" % d)
    fg = Image.new("RGBA", (round(108 * k),) * 2, (0, 0, 0, 0))
    logo = round(108 * k * 0.66)
    ic = SRC.resize((logo, logo), Image.LANCZOS)
    fg.paste(ic, ((fg.size[0] - logo) // 2,) * 2, ic)
    save(fg, "android/app/src/main/res/mipmap-%s/ic_launcher_foreground.png" % d)
    for orient, (w, h) in {"port": (320, 480), "land": (480, 320)}.items():
        save(centred(round(w * k), round(h * k), round(min(w, h) * k * 0.55)), "android/app/src/main/res/drawable-%s-%s/splash.png" % (orient, d))
save(centred(480, 320, 180), "android/app/src/main/res/drawable/splash.png")
