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
