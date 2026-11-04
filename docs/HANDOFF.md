# Handover: Movie Night Spinner

Read this first in a new chat. Last updated 4 Nov 2026.

## Where things are

- Repo: jlaw8787/movie-night-spinner
- Launch branch: wip/menu-polish (917768a22)
- Work branch: wip/store-overhaul, everything pushed. It sits on top of menu-polish. main has one extra commit (d30fb02ac) that merges in clean.
- Live on Netlify while GitHub is flagged: https://movie-night-spinner.netlify.app (Netlify project "movie-night-spinner"). Deployed 4 Nov from wip/store-overhaul (4def937). To redeploy, use the Netlify connector's deploy-site on that project and run the command it gives from the repo folder. Plain static site, no build step.
- GitHub account is still flagged, so Pages is down. When it clears:
  1. Merge wip/menu-polish into main
  2. Run the tests
  3. Push and check Pages
  4. Merge wip/store-overhaul on top

## The to-do

All 15 items in docs/review-2.md are done (3 Nov evening, notes against each item). Review 3 is worked through. Review 4 (8 out of 10, docs/review-4.md) is worked through on 4 Nov, notes against each item. Fifth review: 8.1 out of 10 (docs/review-5.md). Next: work down docs/review-5.md one item at a time, commit and push after each.

Left open from review 2, closed 4 Nov: sequel prices (checked: same-layout sequels already rise with the year; Crocodile Dundee II is a campfire out bush, cheaper than the Walkabout Creek pub on purpose); films with no good still (only Kenny has none and three have one, and posters cover all four, so no fallback needed); the missing assets/band.png (now a gingham strip on the Julie & Julia menu). Shopping lines now always read as one amount: spoons fold into weights or cups, counts round up, counted produce uses standard weights, herbs go by the bunch.

## Things added on 3 Nov (so they are not undone by accident)

- data/film-house.json: two house lines per shared-layout film (table item, drink) with a film note; `fit` lists which ones fit without hiding the film's own notes. Generic Fries, Bottomless coffee, Bread and butter, Tea or coffee are gone on purpose.
- app.js fitLines (shrinks one-line text to fit, never under 65%), foldClear (tiki rows off creases), nbRange (number ranges never split), libVary (per-venue wording of stock notices, never longer than the original line).
- Josh's rule: Easter eggs and the film's own dish notes come first. Only house lines drop when a layout runs out of room, never a dish.
- Phone printed menus: one page per screen with swipe and dots; the full size view opens at fit to width with pinch zoom.
- Fold menus (takeaway, tiki and the hand-built fold PDFs): no text on a crease, checked on all 42.
- Desktop: shorter marquee framed on the letter board; weekly strips, checklist and stubs in the right column.

## Rules Josh has set

- Two brands, never mixed. Cinema (Movie Night Spinner: box office, wheel, marquee, candy bar) is red and gold. Galaxy Video (the store) is purple, gold, teal and pink.
- No em dashes anywhere, in chat, code or files.
- Plain, direct Australian tone. No AI-sounding phrasing.
- Questions as tappable pop-ups, one at a time.
- Short need-to-know replies first.
- Lock a direction once set, no drift. Josh watches token spend.
- Spell it "Weeklys".
- Real brands and TMDB posters are in. Josh likes posters on the menus (turned back on 3 Nov, LIB_POSTER_ON in app.js). Do not remove them.
- Shared menus use period prices, not year-coded ones.
- Phones show the printed menu first, then the text menu.
- Menus: show all dishes, cook 5.
- Candy bar and aisle real photos are deferred until free real photos turn up.
- Printed extras (table kit and so on) parked.

## How to work in the repo

- Vanilla JS single page: index.html (CSS and markup), app.js, films.js (generated), formats.js and formats-core.js (hand-built menus), menu-formats/*.js (30 shared layouts).
- Data sources: data/films.json, data/film-flavour.json (source of venue, sign and so on for shared menus), data/film-format.json. data/film/*.json is generated, never hand edit it.
- After any JS or data change run `node scripts/build-data.cjs`. It regenerates files and stamps ?v= cache hashes in index.html and sw.js.
- Tests: `node --check app.js`, then every tests/*.test.cjs except dialogs.test.cjs. Never write the text "app.js" in an index.html comment (a test checks script order).
- Local server: `python3 -m http.server 4190` from the repo.
- TMDB key lives at /home/claude/.tmdb_key. Pass it as TMDB_KEY env var. Never commit it.
- Commits: `git -c user.name=Josh -c user.email=joshdl_87@hotmail.com commit`.
- Logo sources: scripts/brand (flat vector SVG in HTML, render with render.py). Shop sign: scripts/compose-shopfront-real.py. Member card and sticker: scripts/compose-brand-extras.py.
- Photo credits: assets/hero/PHOTO-CREDITS.md and the site footer.

## Later

- Update the Design canvases with the new real photos and logo.
- Update og:image and URLs when the domain is bought.
- Accounts plan, app store apps, Box Office Bites social series: see Josh's notes.

## Added 4 Nov

- Sound starts off until the speaker is tapped (Josh's call). Stored as mns-sound "1".
- Untested extra dishes shop in their own last group, "For the extras, buy to suit".
- Phone half views of wide menus hide badly cut words and fade the cut edge (pvMask in app.js).
- Wheel redraws when its canvas resizes or the box office view returns.
- Review 5 fixes: diet switches redraw the card; step counts, packs, frying oil and hands-on time scale; layout wording fits the film (flavour beach, ride, sport, coin); film numbers only set the cents on period prices; extras merge into the shopping list; cook time from heat steps (tests/cook-times.test.cjs); bases like risotto and cooked rice shop as raw with a base step; water off the list; phone text menu uses the Prep sheet recipe; Galaxy Video new releases $4 for 3 nights.
- scripts/check-browser.cjs now builds one film per layout plus The Godfather and opens each Prep sheet. Keep it passing.
- 4 Nov afternoon: Print builds the finished PDF and prints that (printPdf in app.js), with 5mm margins and an ink-friendly prep sheet (inkSafe). Lock in asks "Director's cut" or "The full feature" (lockAsk). Table kit prints in its own colours. Kids' mode swaps whole drink names first (shared list at the top of each DRY). Canteen has army mess and prison days. House lines drop when their main noun matches a card dish. Tips for kids and non-drinkers sit under the method, untimed.

## 4 Nov, late afternoon
- Review 7's fix list is done (fixes 6 to 10), noted in docs/review-7.md, and deployed to Netlify (app.js?v=f3f14dd9).
- New shared helper: window.priceSense(menu,P) in app.js keeps card prices in order (mains over starters and sweets, spirits over plain drinks and sweets); used by truck, kiosk, lab, cafe and hotel.
- Shopping lines: PREP_TAIL strips prep words, STAPLE_RE lists salt and pepper with no amount, spoons round to halves, green and ripe fruit share one line.
- fullMenu: a card with one main shows the film's second main before a third starter.
- Table kit review done: docs/review-8.md (6.5 out of 10). All 8 fixes done 4 Nov, noted at the end of review-8.md, and deployed to Netlify (app.js?v=2e2f71ad).
- New kit helpers in app.js: kitFit (names shrink or go to two lines, departures cells fit) and kitReady (mounts kit pages offscreen, retries refused stills, runs kitFit and the dry pass). Kit Print now goes through printPdf like the menus.

## 4 Nov, evening
- Print and Save PDF draw cropped photos (object-fit) as cover or contain backgrounds in the export copy, since html2canvas ignores object-fit. Fixes squashed round frames and tent backs (Cars).
- Galaxy Video holiday calendar strip (On now, Coming up) turned back on in the store at Josh's call. The seasonal shelves themselves run in the app by date (SEASONS in app.js), no GitHub job needed. The only scheduled GitHub job is the monthly where-to-watch refresh, which is not running while GitHub is flagged.
- Movie days added 4 Nov (Josh picked the floating days and filling November, "suitable days only, don't overdo it"): Summer holidays (3 to 25 Jan), April Fools (29 Mar to 1 Apr, spoofs), Movember (all November, moustaches), Friday the 13th (Monday before each one, grown-up horror only, so nothing in kids' mode). Thanksgiving tried and dropped (dish matches pulled Christmas films). Remembrance Day skipped (two films).
- Christmas shelf runs 1 Nov to 26 Dec (Josh: the stores are into it from November).
- Store calendar strip only lists what is close: days marked big (Christmas, New Year's Eve, Easter, Halloween, Mother's Day, Father's Day) show a month out, everything else a week out, and the strip hides when nothing is due.

## Candy bar rebuild (4 Nov, night)
- The Candy bar is now a cinema counter (direction A from the mockup): a lit price board, Tonight's combos for the film on the wheel, the glass case (six picks for the film), Your tray (a docket of tonight's snacks with prices and a total) and the whole counter folded behind one button. The old hero photo is gone; the board does its job.
- Combos are worked out in app.js (snackCombos): one thing to eat, one cold, one sweet, from the theme's snacks (snackGoData plus snackPrefData). Names come from the film: the note author's order, "Film for two" with the venue sign, and a short "The ..." scene from the film's winks or a theme name (SNACK_THEME). Kids' mode, family films and no-alcohol nights skip anything with alcohol in the wording; vegetarian nights only get vegetarian snacks.
- Prices: each snack has a 1996 price in data/snacks.json ("price"), moved to the film's year by snackK. Combos come in about 12 per cent under the separate prices.
- The tray reads the same picks storage (mns-snacks-<film>). A combo shows as one line when all its snacks are in.
- The craving board sits folded under the counter (details#cbFold).

## 4 Nov, night: menu sweep and Candy bar (live, app.js?v=1a9eec96)
- Menu sweep merged: 306 flagged films split across six teams (branches sweep/hand-built-a, hand-built-b, shared-a, shared-b, shared-c, shared-d). Their notes and per-film patches are in sweep/<team>/. Card changes go through scripts/sweep-films.cjs; scripts/sweep-shot.cjs renders a film for checking.
- Cooked dishes live in data/recipes/<slug>.json (or movie-menus.js for editions). A card rename that skips those files prints the old dish beside the new one.
- Candy bar rebuilt as a cinema counter with combos for tonight's film (sweep/candy-bar, merged).
- 4 Nov, 8pm: everything merged and deployed (app.js?v=4e8a1bf3): review 9 code fixes and the menu teams' code items (sweep/code-r9, notes in docs/review-9.md), the cooked-dish follow-up (sweep/followup-data), and the last US spellings in film notes.
- Left open: The Untouchables still prints an evidence log, not a venue menu (layout rework); Get Shorty's Bloody Mary overlaps its "Before the meeting" heading (formats.js); bar tab page 1 too full on Blade and An American Werewolf even with notes off; kiosk leaves space under short menus; the tavern line "Rooms above, stabling round the back" shows on A Christmas Carol and Rise of the Guardians; the dry pass on Christmas-theme films swaps words instead of using the af recipe versions; "beef rounds of steaks" in shopping wording; sweets left on cards as extras now start unticked only where every cooked dish matches by name (hand-built menus keep all recipes ticked).
- Next: an independent review 10.
- Fixed: The Untouchables is now the Lexington Hotel banquet room menu (Bill of Fare, Mr Capone's pick, cold tea by the cup), same five cooked dishes; the case file lives on as Easter eggs (Treasury exhibit stamp, EVIDENCE photo, telegram cue). Table kit moved to the same venue.
- Fixed: Get Shorty's House Rule box and the "Before the meeting" section now sit in one column, so a longer drink line pushes the section down instead of overlapping it (also "creamy centre").
- Fixed: bar tab front sizes the poster or still from the height its dishes and notes need, so Blade and An American Werewolf show every name, price and note on page 1; short fronts keep the full-size poster.
- Fixed: kiosk uses the room. In one-column poster mode the note card floats into the menu area so dishes run down to the cue (cue gets the full width); header and cue are measured, not guessed; type can grow on short menus and spacing opens into what is left; notes that do not show come back one line then two, and with notes off the largest type that shows the most notes wins. Knocked Up shows 6 of 8 notes, Terminator 2 shows 5 of 8 with its cue back.
- Fixed: tavern footer prints "Rooms above, stabling round the back" only when the venue or sign names an inn, tavern, beds or rooms (Prancing Pony, Three Broomsticks, Benbow Inn); A Christmas Carol, Rise of the Guardians and the other kitchens, halls and workshops leave it off.
- Fixed: films that always print dry (kids, fairytale, Christmas, wizard themes) now take a dish's written alcohol-free version (alt.af: name, menu line, film copy from data/diet) on the printed and phone menus before the word pass, and the phone method uses that version's recipe; the plan, prep sheet and shopping keep the cook's own diet settings, and a drink with no af version still gets the word pass (dietMenuOnly, dietKeyF in app.js). The original name no longer comes back as a card extra.
- Fixed: shopping lines read cut names properly (planCont in app.js): round, square and disc join rib, ear and head as part of the food's name unless "of" follows, so "9 thin beef round steaks, about 1.4kg", "round dumpling wrappers", "3 round cob loaves", and one steak reads "1 rib eye steak". Cases added to tests/shop-lines.test.cjs. Kilos still round to one decimal (1.35kg shows as 1.4kg) as on every line.
- Fixed: hand-built menus cook five too. When a film's old recipe names do not match its recipe files, planFive (app.js) takes the printed menu's two starters, main, sweet and drink that have recipes (card order first), topped up to five; the rest start unticked. Ghostbusters, Pulp Fiction, Back to the Future and Ratatouille now tick five; menus that already matched by name are unchanged.
- 5 Nov, 5am: open items 1 to 8 merged (a666914), plus Ghostbusters' cue now serves the meatball subs it cooks. Netlify plan upgraded; deployed 5:35am (app.js?v=b80c7009). Next: review 10.
