# Rollout build instructions (owner-approved, locked)

You are rebuilding one film's menu to the locked house standard. Do not invent a new approach.

1. Read /home/claude/polish/wip/print/STYLE-LOCK.md (all 17 rules) and the "Rules" section of BRIEF-PRINT.md (brands, dashes, seafood, alcohol, recipe-true dishes, file outputs, film.json and labels format).
2. Look at the approved examples: serpico/, big/, pelham/, dog-day-afternoon/ (front.png and back.png). Match that quality and system. Jurassic (jurassic/outside.png, inside.png) is the top bar.
3. Look at your folder's current PNGs and any review notes (review-A.md to review-C.md) only to harvest Easter eggs, props and venue ideas. Delete or move old files you replace into _old/.
4. Choose the venue: where would the characters of this film eat? A real menu from that place (renamed if it is a real business).
5. Display face: check the other folders' film.json "fams" and use a display face no other film uses.
6. Build: two faces (US Letter 816x1056 unless the venue's real menu is another size), one painted art PNG at most plus TMDB stills (from data/film-stills.json, curl from https://image.tmdb.org/t/p/original<path>). Run build, render 2x PNGs, one trim PDF with Chromium.
7. One self-check at full size, one fix pass. Then stop.
8. Every printed dish from the recipe stays the same food. Write film.json and <fmt>.labels.json.
9. Report in under 120 words: venue, display face, props, number of winks, dish renames, honest grade.
Budget: at most 2 web searches, no more than one art redo.
