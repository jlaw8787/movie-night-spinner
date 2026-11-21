# Ripple checklist

Every change has knock-on effects. Before building anything, list what it touches using this page, and plan for every item. Nothing goes live until every box is ticked or Josh has said to skip it.

The auto check backs this up: `node scripts/check-ripple.cjs` runs in the tests and as the first step of Publish site, so a film with a missing piece blocks the deploy. Known old gaps live in `data/ripple-baseline.json`. Only rewrite that file (`--baseline`) with Josh's OK.

## 1. Adding a film

Plan first (Josh's rule: all planning before builds).

1. Title and year exactly as TMDB has them. Add to `wip/newfilms/films-new.txt`, run the New films workflow for TMDB data.
2. Poster (`tmdb-posters.js`), rating (`ratings.js`), trailer (`trailers.js`), where to watch (`providers.js`), TMDB id (`data/tmdb-ids.json`).
3. Stills (`data/film-stills.json`) and title logo (`data/film-logos.json`). Real TMDB stills only, no drawn stand-ins.
4. Genres (`data/film-genres.json`) and Galaxy Video aisle (`aisles.js`, via `scripts/build-aisles.py`). Check seasonal shelves (Christmas from 1 Nov, holidays) and Musicals.
5. Menu in `data/films.json`: a real venue from the film's world, every dish a complete dish, iconic lines and scenes in, facts true to the film, real quotes or unquoted notes in the character's voice.
6. Menu layout: `data/film-format.json`, and `data/film-flavour.json` if it is on a shared layout. Update the layout tracker spreadsheet. The layout has to be able to exist in the film's world (no takeaway or airline before 1900 or where there are no phones; tests/setting-layouts.test.cjs).
   Set in another time than its release (a western, pirates, Middle-earth, 1910s London): add `priceEra` to its flavour ("1800s", "1930s-40s" and so on) so the card prints prices of that time whatever its look. Dishes must be of the film's time too (tests/era-words.test.cjs).
   Review 32 adds to the fit table: `currency` may also be "G" (wizarding Galleons and Sickles), "Kč", "roubles", "piastres", "Rs", "฿", "Rp", "S/", or "coin" with `coin` naming the made-up money ("credits", "solari", "pieces of eight", "silver pennies"; `coinMid` sets how many a middle main costs, default 6). A saloon card takes `reward` (a sum of money, never the year). A pub set earlier than its release prints an Est. year from its priceEra (or `est`). Template words that do not fit the venue are swapped per film with `words`. Dollar cards print "$" or "¢" on every price (pfMark), and any total on a card is added up again from the printed prices (sumFix: mark it `data-sum`, its prices `data-sum-in`; a price repeated in a sentence is `data-echo`).
   Notes (review 32): every shared-layout dish note, in data/films.json and in the printed card's data/recipes file, is six words or more and names some food: the dish first, then the film touch (tests/menu-fit.test.cjs). Layouts make room for the whole note (photos give way, type steps down to a 12 to 14px floor) before any note is cut. The house starter and drink in data/film-house.json follow the same rule and never open by repeating the dish name. Dollar "$" marks go on shared layouts only; a hand-built menu keeps the prices it was drawn with.
   Fit table (review 31), also in its flavour: `currency` when it is not set in a dollar country ("£", "£sd" for pre-1971 UK and pre-1966 Australia, "€", "F", "L", "₩", "¥", "R$", "kr", "RM"), `world: "storybook"` only for a made-up or old-world setting (the only films that may print crowns, silver, gp, a compass or "realm"), and `country` for a pub outside Australia ("GB", "US" and so on). priceFix holds the card's middle main to the decade band (PF_BAND in app.js) and prints the local money. Check with `node scripts/check-menu-fit.cjs "Film (Year)"` (money, era band, storybook coin, notes under four words, signed quotes against data/quote-list.json, wrong-country words). A real quote added to a card goes on data/quote-list.json; anything else is a note (kind "note").
7. Menu colours (`data/film-palette.json`), house lines (`data/film-house.json`, one table item and one drink).
8. Dish names and notes (`data/dish-names.json`, `data/dish-notes.json`), recipes (`data/recipes2/`), and a veg / no alcohol version (`data/diet/`) if any dish has meat or alcohol.
9. Quiz: 3 written questions (`data/trivia.json`); auto rounds come from `scripts/build-quiz.cjs`.
10. Match night deck: passes the audit queue, lands in the right vibe (`scripts/build-match.cjs`).
11. Series: if it is part of a series, add it to `data/series.json` (sequel prompt and marathon planner).
12. Search terms (`scripts/build-search.cjs`), kids mode flag if it is family friendly.
13. Run `node scripts/build-data.cjs`: builds `data/film/`, the Google film page (`menu/<slug>/`), sitemap and cache stamps.
14. Printed menu preview picture (`scripts/render-previews.cjs`, `assets/menu-previews/`). Any menu, price or layout change makes the film's preview stale: run `node scripts/render-previews.cjs --stale`. The ripple check fails on a stale preview (fingerprints in `data/preview-stamps.json`).
15. Fact audit and vibe audit for the film (`docs/AUDIT.md`).
16. Check it on the wheel, Galaxy Video shelf, Candy bar combos, Match night, Quiz night, My card stats, film page, print, phone and desktop.
17. Phone: a hand-built menu with no fixed sheet opens on its `.fx-panel`; a page can mark its readable blocks `data-pvzoom="x,y,w,h"` or `data-pvzoom="self"` (the element where it sits: hospital form columns, canteen tray, a tight kiosk board's columns, dimsum order sheet, Senior Prom panel), and those become its phone views ahead of gutter panels; a sign that must stay over a panel is `data-pvsign`. `node scripts/check-phone-panels.cjs "Film (Year)"` (opens on a view with a dish, wide pages split into panels along clear gutters, nothing drawn under 6px).
18. Prices: `node scripts/check-price-sense.cjs "Film (Year)"` (mains above starters and sweets, cheap bites never dearer than real dishes, clean endings). Run tests (includes the ripple check). Add a HANDOFF.md line. Hold for Josh's deploy go.

## 2. Changing or removing a film

1. Same list as above: change the piece everywhere it lives, not just the menu.
2. Removing: also clear it from series, Match deck, sitemap, layout tracker, and check saved member data (watched, ratings, duel decks) still loads without it.
3. Renaming, fixing the year or swapping a film out changes the slug: add the old slug to data/film-redirects.json (old slug to new slug) and build-seo keeps the old address as a redirect page.

## 3. Adding or changing a feature

Answer each one before building. Write the answers in the HANDOFF.md entry.

1. **Where it shows:** Box office, Candy bar, Galaxy Video, Match night, Quiz night, My card, film pages, printed menus. Cinema stays red and gold, Galaxy Video stays purple, gold, teal and pink. Never mixed.
2. **Who sees it:** guest and signed-in member. Guest must still work. Kids mode on and off.
3. **Menu toggles:** Vegetarian and No alcohol still give a right menu.
4. **Screens:** iPhone Safari (test on Josh's phone, Safari draws things Chrome does not), small phone, desktop, print.
5. **Data:** does it save anything? Device only, or Supabase (migration, row security, free plan limits). If it collects anything new, update `privacy.html` and the App Store privacy answers.
6. **Email and alerts:** inbox, email (Resend), daily limits (one "your turn" email a day).
7. **The app:** works offline in the iPhone and Android wrapper (`scripts/build-app.cjs`), fonts bundled, no web-only bits that break in the app.
8. **Speed and cache:** run `node scripts/build-data.cjs` so `?v=` stamps in `index.html` and `sw.js` change and phones get the new version.
9. **Words:** plain Australian tone, no em dashes, "Weeklys" spelling. Update How it works if the feature is something people need to find.
10. **Every film:** if the feature needs something per film (like quiz questions did), add that source to `scripts/check-ripple.cjs` so new films can never miss it.
11. **Google and stats:** film pages and sitemap still right, GoatCounter still counting.
12. **Tests:** add or update a test, run them all, then a HANDOFF.md entry. Hold for Josh's deploy go.

## Known gaps

None (cleared 17 Nov 2026). Notes for next time:

- TMDB sometimes files an English-title logo under another language (La Bamba, Major League). Look at every language before calling a logo missing.
- If no logo exists anywhere (The Wog Boy), add the film to `data/logo-block.json` so the menu letters the title itself.
