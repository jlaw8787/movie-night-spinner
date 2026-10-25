# Film-world print menus: the standard (set by Jurassic Park, Oct 2026)

The owner is a trade-qualified chef and former restaurateur. Target: an honest 9.2 to 9.3 out of 10 against the rules below.

## The one idea
Each menu is a printed object that genuinely exists inside that film's world, made the way that world would have made it, in that year. Jurassic Park became InGen's fold-out Visitor Center dining guide with a painted island map, worn and sun-faded like it has sat in a glovebox since 1993. Ask: what printed thing would a character in this film actually pick up, and who printed it? A diner placemat, a bakery bag and price card, a takeaway trifold, a mimeographed church bulletin, a hotel room service card. Only fold it if that object folds. Never a recoloured template. If two films' menus could swap logos, one is wrong.

## Reference
Read these first: /home/claude/polish/wip/print/jurassic/ (outside.png, inside.png, build.py, outside.body.html, inside.body.html, pdfs.py, paint_map.py). Open the PNGs with Read. That is the bar and the pipeline to copy.

## Rules (all non-negotiable)
- Only details definitely in the film. If unsure, leave it out. In-world copy only: a piece printed inside the film cannot know the plot's later events.
- No real brand names, no real restaurants or shops, no logos other than the film's own (film logo from TMDB is fine). Fictional in-film businesses are fine only if they are not also a real business. If a real place appears in the film, use a fictional or generic name.
- No song lyrics. No em dashes or en dashes anywhere (use commas, periods, or "to"). Plain English, no AI words (elevate, indulge, iconic, nod to, homage, curated, perfect for).
- Seafood dishes stay seafood. Kids and family films are alcohol-free.
- Food must read right to a chef: specific, appetising, no repeated words between a dish name and its description, no clashing flavour treatments, period-true wording for the film's year and place, sensible prices for that world and year (a famous number from the film as one price is welcome).
- Easter eggs: minor characters, props, places, numbers, short winks (six words max). Fans should spot them; nobody else should be confused by them.
- Print readiness: real sheet size for the object (A4, letter, or a smaller real-world size like a placemat or card; say which). Body text 12pt (16px at 96dpi) where it is reading copy; nothing under 9pt; dish names clearly larger. Keep text at least 40px inside the trim. Nothing important on a fold. Produce a trim PDF plus a printer PDF with 3mm bleed, crop marks, TrimBox and BleedBox, with fonts embedded as TrueType (instance variable Google fonts to static files with fontTools as jurassic/pdfs.py and the fonts folder show). Check the PDF in two renderers (pypdfium2 and pdftoppm).
- Saved-image safe (the site uses html2canvas): no SVG for important art, no clip-path, no CSS filters on text, no vertical text, no background-clip:text, no mix-blend-mode, no inset box-shadow. Build shapes from positioned divs or painted PNG assets (Python PIL), like the Jurassic map.
- Period finish: a light paper grain and wear that suits the object (a diner placemat gets grease-proof sheen and a coffee ring, a church bulletin gets mimeograph ink, a bakery bag gets kraft paper). Subtle; text must stay crisp and readable.
- Photos (film stills, poster) stay under about 40% of the page and come from TMDB only: list them in /home/claude/polish/data/film-stills.json for the film id, download with curl from https://image.tmdb.org/t/p/original<path>. Never put people from the film into something that could not contain them.

## Dishes
The film's current dishes are in /home/claude/polish/formats.js (search the film id, spec "groups", each item key k, description d, note) and the recipe file /home/claude/polish/data/recipes/<slug>.json if it exists. You may change the printed name, description and note, and add a few sensible menu items that suit the object (drinks, a kids' line, sides), but each existing dish must still be the same food so its recipe and shopping list stay true. List any added items separately in your report.

## Working folder and output
Work only in /home/claude/polish/wip/print/<slug>/ (create it). Do not touch formats.js, git, or other folders. Deliver: the source (body html, build.py), PNG renders at 2x of every face, <Film>-menu.pdf (trim) and <Film>-menu-print-bleed.pdf, and a short report: the object and why it belongs in the film, the sheet size, every Easter egg and the scene it comes from, any dishes renamed or added, and your honest grade with what would lift it.

## Self-check before you finish
Render, open every PNG with Read, and look closely: collisions, clipped text, one-word last lines, uneven gaps, anything near a fold or edge, anything that looks like a template. Then fix and look again. Run a dash check over the text.

## Kit rules (added after the first four went live)
- References: also look at /home/claude/polish/wip/print/chud/, youve-got-mail/, moonstruck/ (notice.png, front.png, back.png). Each is a different object. Yours must not look like any of them.
- Print files: web plus home PDF only. You do NOT need the 3mm bleed printer PDF or font instancing. One trim PDF made with Chromium is enough.
- Fonts: Google Fonts only, loaded with one css2 link. Note the exact css2 query in film.json.
- Every printed dish that comes from the film's recipe must match that recipe (same main ingredients and method). Change wording, not food. Added items (drinks, sides, kids' plates) are fine and need no recipe. Check the recipe in formats.js (the spec's d) and data/films.json or data/recipes/<slug>.json.
- Texture overlays (grain, wear, stains) must be soft and low-detail: big gentle mottling and edge wear, not pixel noise. A shared fine paper grain already exists, use it by placing <img src="assets/paper-grain.png"> where assets/paper-grain.png is a copy of /home/claude/polish/wip/print/jurassic/src/assets/paper-grain.png. Name texture files with grain, wear, stain or paper in the name.
- Each face must be one root div with inline width and height in px (for example 816x1056 for US Letter, 1123x794 for A4 landscape, 528x816 for half letter). All faces the same size. Portrait faces show side by side on the site, landscape faces stack.
- Build mode: your build.py must write one full HTML file per face (for example front.html, back.html) with image paths relative to your folder.
- Also write film.json in your folder: {"fmt":"<fmt>","fn":"<renderer function name>","faces":["front.html",...],"names":["Front",...],"mm":[W,H],"fonts":"family=...","fams":["Font A","Font B"],"phone":{"disp":"'Font A',serif","title":"'Font A',serif","name":"'Font B',serif","body":"'Font B',serif","price":"'Font B',serif","note":"'Font B',serif"}} using the fmt and function name you are given.
- Write <fmt>.labels.json in your folder: {"<Film id>": {"<spec item k>": {"n": "printed name", "d": "printed description", "note": "short in-world line"}, ...}} for every spec dish, so the phone view matches the print.
- Do not edit formats.js or anything outside your folder. I integrate onto the site.
