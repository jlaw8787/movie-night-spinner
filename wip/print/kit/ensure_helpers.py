"""Adds the real-sheet helpers to formats.js once (safe to run again)."""
REPO = '/home/claude/polish'
p = REPO + '/formats.js'
s = open(p, encoding='utf-8').read()
if 'function fmtSheet(' not in s:
    anchor = "const FMT_FOLDS={takeaway:1,diner:1};"
    assert s.count(anchor) == 1
    s = s.replace(anchor, anchor + """
/* real printed objects: a renderer can carry its own sheet size and number of faces, e.g.
   myRenderer.sheet={w:1123,h:794,faces:["Outside","Inside"],mm:[297,210]}
   faces stack top to bottom on screen; each face is its own page in the PDF and print. */
const FMT_GAP=28;
function fmtSheet(spec){const r=spec&&FMT_RENDER[spec.fmt];return r&&r.sheet||null}
function fmtFaces(list,sheet){const row=sheet.h>sheet.w;return `<div style="display:flex;flex-direction:${row?"row":"column"};gap:${FMT_GAP}px">`+list.map((h,i)=>`<div class="fx-face" data-face="${i}" style="position:relative;flex:none;width:${sheet.w}px;height:${sheet.h}px;overflow:hidden">${h}</div>`).join("")+`</div>`}
function fmtSheetSize(sheet){const n=Array.isArray(sheet.faces)?sheet.faces.length:(sheet.faces||1),row=sheet.h>sheet.w;return row?{w:sheet.w*n+FMT_GAP*(n-1),h:sheet.h,n}:{w:sheet.w,h:sheet.h*n+FMT_GAP*(n-1),n}}""")
    open(p, 'w', encoding='utf-8').write(s)
    print('helpers added')
else:
    import re
    block = re.search(r"const FMT_GAP=28;\n.*?\nfunction fmtSheetSize\(sheet\)\{.*?\}\}", s, re.S)
    want = re.search(r'const FMT_GAP=28;\n.*?\}\}(?=\"\"\")', open(__file__).read(), re.S).group(0)
    if block and block.group(0) != want:
        s = s.replace(block.group(0), want); open(p, 'w', encoding='utf-8').write(s); print('helpers updated')
    else:
        print('helpers present')
