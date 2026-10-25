# Rollout build instructions (owner-approved, locked)

You are rebuilding one film's menu to the locked house standard. Do not invent a new approach.

1. Read /home/claude/polish/wip/print/STYLE-LOCK.md (all 17 rules) and the "Rules" section of BRIEF-PRINT.md (brands, dashes, seafood, alcohol, recipe-true dishes, file outputs, film.json and labels format).
2. Look at the approved examples: serpico/, big/, pelham/, dog-day-afternoon/ (front.png and back.png). Match that quality and system. Jurassic (jurassic/outside.png, inside.png) is the top bar.
3. Look at your folder's current PNGs and any review notes (review-A.md to review-C.md) only to harvest Easter eggs, props and venue ideas. Delete or move old files you replace into _old/.
4. Choose the venue: where would the characters of this film eat? A real menu from that place (renamed if it is a real business).
5. Display face: use the face assigned in your prompt. If none is assigned, pick one not listed in /home/claude/polish/wip/print/FONTS.md and add your line there at once.
6. Build: two faces (US Letter 816x1056 unless the venue's real menu is another size), one painted art PNG at most plus TMDB stills (from data/film-stills.json, curl from https://image.tmdb.org/t/p/original<path>). Run build, render 2x PNGs, one trim PDF with Chromium.
7. One self-check at full size, one fix pass. Then stop.
8. Every printed dish from the recipe stays the same food. Write film.json and <fmt>.labels.json.
9. Report in under 120 words: venue, display face, props, number of winks, dish renames, honest grade.
10. Rule 25 is a hard ban: no flat vector or clip art. Every picture is a still, a real photo or a real period illustration; painted art only for a map or cutaway at Jurassic level.
PRIVACY: never put the owner's email address, name or any personal detail in a User-Agent header, URL or request to any site. If a site wants a contact in the User-Agent, use "MovieNightSpinner/1.0 (personal project)" and nothing else.
Budget: up to 4 web searches (owner wants research where it helps: the venue, period menus, and reference for the signature art), no more than one art redo.
Every film must be unique (owner): its own format, signature piece, palette, display face and props, all assigned in your prompt. Match the film's world and era.
