# Menu sweep brief (team lead)

You are one of six team leads fixing the film menus on Movie Night Spinner. Your films are in `sweep/batch.json` in your worktree: each has the layout and the automatic check flags that put it on your list. The flags are a starting point, not the verdict. Open each menu, judge it like a chef-owner would, and fix what is really wrong. If a flag is a false alarm (a seafood film that should be mostly seafood, a kiosk that only ever sold one hot dish), leave it and note why.

## Read first
- `docs/HANDOFF.md` (how the repo works, the owner's rules).
- The worked example: commit `5c9d70b` ("Big Trouble in Little China menu rework"). `git show 5c9d70b --stat` and `git show 5c9d70b -- formats.js data/recipes2/ data/diet/ data/kit-flavour.json`. That is the standard: what changed and why.

## The owner's rules for menus (non-negotiable)
- Every menu is a real menu from a venue in the film's world (Wang Chi's Dragon of the Black Pool, not "Chinatown takeaway"). The venue on the printed menu and the table kit venue name the same place.
- Think like a chef-owner in the David Chang, Shook and Dotolo, Merivale, Roy Choi mould: modern, cool, fun. Every dish is a complete, exciting dish, never a pun or a plain item.
- Film first: nostalgia, Easter eggs and the film's own moments carry the menu. Dish notes and Easter eggs come before house lines.
- A balanced card: not one meat carrying the menu, a starch and some greens where the cuisine calls for it, sweets with sweets, drinks with drinks, mains priced above starters and sweets, spirits above soft drinks. Set deals (banquets, suppers) cost less than ordering the same food.
- Real brands are fine. Shared menus use period prices.
- Australian spelling (colour, centre, flavour, icing sugar, spring onion, coriander, prawns, chillies), proper names left as they are.
- No em dashes or en dashes anywhere. Plain, direct Australian English. No corporate or AI-sounding phrasing.
- Do not reshape menus around diets. Vegetarian and No alcohol versions come from `alt.veg` / `alt.af` / `alt.veg_af` on the recipe and from `data/diet/<slug>.json` text swaps.

## Where things live (edit only these)
- Card dishes for every film: `data/films.json` (one line, do not hand edit). Use the helper: `node scripts/sweep-films.cjs get "Title (Year)"` to read; write a JSON file with the keys you change (S, M, W, K, T, D, P) and run `SWEEP_TEAM=<your team> node scripts/sweep-films.cjs set "Title (Year)" thatfile.json`. Each card item is `[name, short note, method summary, ["item@Aisle", ...]]`. The helper also saves your change to `sweep/patches/<team>.json`, which is what gets merged.
- Tested 4-person recipes: `data/recipes2/<slug>.json` (dishes with n, course s/m/w/d, prep_min, cook_min, make_ahead, ingredients [{q,u,item,aisle}], steps [{text,min}], veg, af, alt). A card dish with no recipe here is shown but not cooked; add a recipe for any dish you add or rename. Match `n` exactly to the card name.
- Diet text swaps: `data/diet/<slug>.json`.
- Shared layouts: `data/film-flavour.json` (venue, sign, note, winks, prop, number), `data/film-house.json` (house table item and drink).
- Hand-built menus: the film's entry in `formats.js` (one entry per film), and its table kit in `data/kit-flavour.json`.
- Do NOT edit app.js, index.html, menu-formats/*.js, formats-core.js, tests or other scripts. If a fix needs code, write it in `sweep/NOTES.md` for the lead.

## Checking your work
- `node scripts/build-data.cjs` after changes (it regenerates files; that is fine locally).
- `NODE_PATH=$(npm root -g) node scripts/sweep-shot.cjs /tmp/sweep-<team>-shots "Title (Year)" ...` renders the Save PDF (printed menu plus Prep sheet), each page as PNG, the phone menu text and the table kit. Look at the PNGs with the Read tool. Check before and after for every film you change. No cut words, nothing overflowing, notes showing, prices in order.
- `node --check app.js` and every `tests/*.test.cjs` except dialogs.test.cjs must still pass.

## Review step
When your batch is done, spawn one reviewer agent (a fresh general-purpose agent) and give it your worktree path, this brief, and the list of films you changed, but not your reasoning. Ask it to check each changed film against the rules above using sweep-shot renders, and to report problems only. Fix what it finds that holds up.

## Committing
- Commit only: `sweep/`, `data/recipes2/`, `data/diet/`, `data/film-flavour.json`, `data/film-house.json`, `data/kit-flavour.json`, `formats.js`. Never commit `data/films.json` (your card changes travel in `sweep/patches/<team>.json`) or any generated file (films.js, data/film/, data/dish-names.json, data/dish-notes.json, formats/, formats-core.js, index.html, sw.js).
- `git -c user.name=Josh -c user.email=joshdl_87@hotmail.com commit` with these two lines at the end of the message:
  Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>
  Claude-Session: https://claude.ai/code/session_01W3UAnC9E6o7UN5L1rsb3io
- Commit as you go (every 10 or so films). Do not push. Do not merge.
- Write `sweep/REPORT.md`: one line per film (changed, or left and why), and any code issues for the lead.

## Your final reply
Films changed, films left as false alarms, anything that needs code, and the last commit hash. Keep it short.
