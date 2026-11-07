# Flat menu rework: agent brief

Josh's call (7 Nov, 10:30pm): rework all 411 flat menus (vibe under 3.5). Apply the checkers' "ideas" and "missing" moments in batches. Vibe rework is approved, no per-film sign-off needed. Every new line still follows the fact rules. Re-score after. Give this brief to each agent with its list of slugs.

---

You are reworking flat movie-night menus for the Movie Night Spinner app (repo /home/claude/movie-night-spinner) so a fan of each film would grin. Read docs/AUDIT.md first (fact rules, quote rules, signed note rules, vibe rules). Then, for each slug in your list:

1. Read audit/results/<slug>.json (the vibe block: verdict, missing, ideas) and audit/cards/<slug>.json (what the menu prints now, face by face, and the layout). Look at audit/shots/<slug>-*.jpg if they exist.
2. Check the moments you want to use from the shell (no WebSearch needed):
   - `node scripts/audit-src.cjs grep "Film (Year)" word "phrase"` (transcript, Wikipedia and Wikiquote hits)
   - `node scripts/audit-src.cjs plot "Film (Year)"` and `quotes "Film (Year)"`
   Only use a moment, prop, food or line a source shows. A checker's idea can be wrong: verify it first.
3. Plan the changes. Aim for 4 to 8 per film, the ones that lift it most:
   - Dish names: rename to use the film's moments, props and running jokes, with wit. The recipe stays as it is, so the new name must honestly describe the same food (spaghetti stays spaghetti; a burger can become "Mental's burger, extra peppers" only if it is a burger). No new recipes.
   - Dish notes (the italic line under a dish): tie each to a specific scene, prop or line.
   - The cue ("Serve the mains when ..."): one of the film's best-known scenes.
   - House lines (data/film-house.json, a table item and a drink with a note).
   - Venue, sign, the signed note, winks (short lines that print as asides, honours or lessons depending on the layout), prop (title and two lines).
   - Campfire films only: `labels` can rename the camp headings to suit the world, e.g. {"s":"Forest Snacks","m":"From the Fire","w":"Sweet Things","d":"Gourds and Cups","t":"The Clan Table","n":"Spoken at Hometree","b":"Learned in the forest","call":"Clan call"}. Set only the keys you need. Other layouts ignore labels; if a fixed layout word clashes with the film, say so in your reply instead.
   Rules:
   - Fact rules apply to every new line. Real quotes only, in quote marks or signed as spoken, checked word for word in the transcript. Signed notes in a character's voice are fine if true to the plot. No song lyrics, ever (song titles are fine).
   - Smallest layout-safe length: a new line stays within about 10 per cent of the length of the line it replaces (count characters). Shorter is fine. Never add new dishes or new lines where none existed.
   - Josh's rules: plain, direct Australian tone, Australian spelling, no em dashes or en dashes (commas, full stops or "to"), no AI-sounding phrasing. Two brands never mix (the cinema is red and gold, the store is purple, but that is not your concern here). Film wins over the layout's habit.
   - Family films stay family friendly; don't add grog to a kids' film.
   - Keep anything the vibe block praised.
4. Write the changes to audit/rework-ops/<slug>.json (create it; append to "ops" if it exists):
   `{"id":"Film (Year)","ops":[{"old":"exact stored text","new":"new text"}, {"set":"flavour.winks","value":[...]}, {"set":"house.d","value":{"n":"...","note":"..."}}, {"set":"cue","value":"Serve the mains when ..."}]}`
   - `old` must be the text as stored. Check with `node scripts/card-ops.cjs find "Film (Year)" "text"` (headings print in capitals, the stored text may not be). A dish rename op changes the card, recipes and shopping together; if the cue or another note names the dish, add an op for that string too.
   - For `flavour.note` use {"text":"...","by":"Name","kind":"quote"|"note"} as docs/AUDIT.md shows.
   - `set` ops for flavour fields: venue, sign, note, winks, prop ({"kind":...,"title":...,"lines":[two lines]}), labels. Keep the same number of winks.
5. In audit/results/<slug>.json add to the vibe block: `"rework": "2026-11-08"` and `"changed": ["one short line per change"]`. Do not change the scores or set done (a re-score pass does that after the menus are rebuilt).
6. Do not edit any other file. Do not run build-data, card-ops apply, audit-report or the checks.

When done, reply with one line per film: slug, number of changes, and any layout word that clashes and needs code.
