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
function fmtFaces(list,sheet){return list.map((h,i)=>`<div class="fx-face" data-face="${i}" style="position:relative;width:${sheet.w}px;height:${sheet.h}px;overflow:hidden;${i?`margin-top:${FMT_GAP}px;`:""}">${h}</div>`).join("")}
function fmtSheetSize(sheet){const n=Array.isArray(sheet.faces)?sheet.faces.length:(sheet.faces||1);return {w:sheet.w,h:sheet.h*n+FMT_GAP*(n-1),n}}""")
    open(p, 'w', encoding='utf-8').write(s)
    print('helpers added')
else:
    print('helpers present')
