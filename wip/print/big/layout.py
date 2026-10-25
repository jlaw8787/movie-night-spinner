"""Shared layout for the MacMillan party pack (Big, 1988). CSS px on a US Letter face (816 x 1056).
paint.py paints the printed background of each face at 2x from these boxes, build.py sets the type on top."""
W, H = 816, 1056

# Process ink model used by paint.py and for the HTML type colours.
# Each ink is a transmittance filter (r, g, b); overprints multiply.
PAPER = (247, 243, 234)
INKS = {
    'c': (0.15, 0.66, 0.92),
    'm': (0.93, 0.20, 0.55),
    'y': (1.00, 0.93, 0.12),
    'k': (0.13, 0.12, 0.13),
}


def ink(c=0, m=0, y=0, k=0):
    """Solid colour of an overprint of process percentages (0 to 100), as hex."""
    out = []
    for i in range(3):
        v = PAPER[i]
        for name, amt in (('c', c), ('m', m), ('y', y), ('k', k)):
            v *= 1 - (amt / 100) * (1 - INKS[name][i])
        out.append(int(round(v)))
    return '#%02x%02x%02x' % tuple(out)


# front
F = dict(
    banner=(0, 0, W, 124),           # solid red band, bleeds
    flag=(500, 136, W, 184),         # yellow ribbon, bleeds right
    company=(46, 140),               # "THE COMPANY" logotype origin
    party=(40, 168),                 # "PARTY" logotype origin
    age=(632, 206, 776, 334),        # age box
    tag_y=350,
    window=(48, 394, 768, 680),      # die-cut window
    subline_y=690,
    panel=(40, 720, 776, 1016),      # white board panel, passed trays
)

# back
B = dict(
    banner=(0, 0, W, 120),
    menu=(40, 138, 776, 566),
    photo_panel=(40, 582, 420, 852),
    photo=(54, 596, 406, 794),
    play=(436, 582, 776, 706),
    token=(436, 720, 776, 852),
    check=(40, 868, 420, 1016),
    note=(436, 868, 776, 1016),
    upc=(636, 906),                  # top-left of the barcode block
)
