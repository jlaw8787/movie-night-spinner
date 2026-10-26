# Format builder instructions (deadline: end of day, one build plus one fix per format)
PRIVACY (hard): never put the owner's email address, name or any personal detail in any User-Agent header, URL or request. If a site wants a contact, use exactly "MovieNightSpinner/1.0 (personal project)". If a site blocks you, stop using it.
Read, in order: wip/genre/FORMAT-LIBRARY.md (your formats' rows and the Look guideline), wip/genre/GENRE-BRIEF.md (all sections, especially Per-film lift and Owner tweaks), wip/print/STYLE-LOCK.md rules 4, 22 to 25. Look at wip/print/jurassic/outside.png and wip/genre/kids/proof-up-2009.png for the bar.
Build each format as wip/genre/formats/<id>.js registering window.MENU_FORMATS["<id>"] = ctx => ({w, h, faces:[...]}). The ctx contract is documented at the top of wip/genre/lib/harness.html. Inline styles only. Google Fonts may be loaded by injecting a <link> once into document.head from the format file (check a font is not already in wip/print/FONTS.md; add "fmt-<id>: Face" lines there).
Must:
- Era and tone change the look visibly (type pairing, paper, print process, border, photo treatment, wear). Test the same film in two different era/tone settings via ERA=.. TONE=.. env vars.
- Hero still at least 40 percent of the front; logo in its own colours on a panel that suits it (fallback set type); film palette for accents with a contrast check; flavour venue, sign, note with script signature, winks, prop (type only), number.
- Handle: 1 to 4 items per course, long titles (60 chars), missing logo, missing flavour (fall back to theme-neutral wording), missing stills (use poster).
- No drawn art of any kind (rule 25). No dashes. No brands. Family films alcohol-free in any added copy.
Test: python3 wip/genre/lib/shoot.py <id> "Film (Year)" ... on 4 films assigned to your format in data/film-format.json (if the file is missing or has none, pick 4 fitting films from data/film-flavour.json), plus one stress case. Zero spill and nothing under 14px. One self-check of the PNGs at full size, one fix pass.
Do not edit app.js, formats.js, other formats or git. Report under 120 words per format: look, faces, how era and tone change it, honest grade.
