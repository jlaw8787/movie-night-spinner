# Next 100 films: how to write and ship a menu (locked 15 Nov 2026)

Josh's plan doc: "Reel Dinner: next 100 films and Match night plan" (https://claude.ai/artifact/CLgBGTxk9QvUuQRwJ2taMi). All decisions are made. Do not re-ask them.
The 100 live in `wip/next100/plan.json` (id, group, menu lead, layout, era, tone, theme, venue lead). TMDB ids, posters, stills,
ratings, trailers, where to watch and TMDB genres are already merged for all 100. Layout picks are logged in Josh's sheet
"Reel Dinner film layouts" (https://claude.ai/artifact/CUZSJL6Gy92dKmd2DTNxz4), Films rows 902 to 1001, status "Maybe, needs venue check".
Pilot done: Good Will Hunting (1997), pub layout, L Street Tavern. Copy its source file's shape: `wip/next100/src/good-will-hunting-1997.py`.

## The standard (Josh's rules, all locked)
- A real menu from a venue in the film's world, Jurassic Park menu standard, aiming at 9.5 out of 10.
- True to the film. Iconic lines and scenes must be in. Quotes are real and verified on an opened page (Wikiquote raw, IMDb quotes);
  otherwise an unquoted note in the character's voice (`"kind": "note"`). A famous line used as a nod with no quote marks is fine if it is the real line.
- Every dish is complete and exciting, never a pun or a plain item. Chef-owner voice (David Chang, Shook and Dotolo, Merivale, Roy Choi).
- Real brands are fine (Josh loves marketing). Posters and stills come from TMDB, never drawn stand-ins.
- Plain Australian English, metric, Celsius. No em or en dashes anywhere. No AI-sounding copy. No song lyrics.
- Family films (theme kids or fairytale): every dish and drink alcohol-free.
- The plan's venue lead and layout are a starting point. If research shows a better real venue in the film, use it, keep the same
  layout unless it plainly does not fit, and update the sheet row (Live layout stays blank until deploy; set Status to "Approved" once audited).

## What the pilot taught (do these or the menu prints flat)
1. Research first: `curl -sS "https://en.wikipedia.org/w/index.php?title=<Title>&action=raw"` (plot section) and the same on en.wikiquote.org.
   WebSearch only to settle a venue or a scene the two pages don't cover. Never write a fact from memory alone.
2. The printed note is the film moment first, then the food (mk.py joins them: `line + ". " + note`). Most layouts print only the first
   sentence, so the `line` must carry the whole joke on its own and stay short: about 25 to 45 characters ("Sean gave up his Game 6 seat for a girl").
   Keep `note` (the food) short too, about 30 to 50 characters. Long notes get dropped from the board even when there is room.
3. Shared layouts carry stock lines in the layout's own voice (the pub is an Aussie country pub: "Come in out of the heat",
   "Kids and dogs welcome on the verandah", "Counter meals"). Remap the ones that don't fit the film's world with `FLAVOUR["words"]`
   ({"stock text": "film text"}, case-insensitive, longest first). Look at the first render and fix every line that reads wrong.
4. Prop lines are short (about 24 characters on the pub ticket). Check the render for cut lines.
5. Each vegetarian or alcohol-free swap needs its own `ahead` (tests/veg-ahead.test.cjs fails if it repeats the meat dish's make-ahead).
6. The pack checker flags ingredient words like "oyster crackers" and "hot dog buns" as meat. Name them "small salted crackers", "split-top bread rolls".
7. House lines (`HOUSE`, one table item, one drink) can be anything that suits the film, meat or alcohol included; flag `meat`/`alc`.
   Notes on house lines must be true to the film or a plain menu joke that claims nothing about the plot.

## Steps for each film
```
python3 wip/next100/mk.py wip/next100/src/<slug>.py          # writes wip/next100/packs/<slug>.json
python3 wip/newfilms/checkpack.py wip/next100/packs/<slug>.json # fix every ERROR
python3 wip/next100/pack.py put wip/next100/packs/<slug>.json   # into films.json, film-format, flavour, palette, house, recipes, recipes2, diet, rollout
python3 scripts/build-aisles.py && node scripts/build-data.cjs
NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/check-print-text.cjs "<Film (Year)>"
NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/sweep-shot.cjs /tmp/<slug> "<Film (Year)>"   # look at every page
NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome node scripts/audit-extract.cjs "<Film (Year)>"
```
Then write `audit/results/<audit-slug>.json` in the docs/AUDIT.md format (facts with verdicts and sources, vibe scores). The film joins
Match night decks automatically once it has no open fact lines and vibe 3.5 or better (`node scripts/build-match.cjs`, run by build-data).
Slugs: pack and recipe files use the id lower-cased with every run of other characters as "-" (apostrophes become "-").

## Per batch (10 films)
- Run all tests (`for t in tests/*.test.cjs`, skip dialogs; prices takes about 5 minutes, run it once per batch).
- An independent audit pass by someone who did not write the menus (fact and vibe, docs/AUDIT.md and docs/rescore-agent-prompt.md).
- Commit on `feature/match-night`, push, update docs/HANDOFF.md and the sheet rows. Do not deploy until Josh says deploy.
- Update the counts that say 900 (meta description, store listing, welcome copy) only when all 100 are in.
