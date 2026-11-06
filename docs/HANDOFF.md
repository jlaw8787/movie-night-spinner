# Handover: Movie Night Spinner

Read this first in a new chat. Last updated 6 Nov 2026. Start with "6 Nov, afternoon" at the bottom.

## Where things are

- Repo: jlaw8787/movie-night-spinner
- Launch branch: wip/menu-polish (917768a22)
- Work branch: wip/store-overhaul, everything pushed. It sits on top of menu-polish. main has one extra commit (d30fb02ac) that merges in clean.
- Live on Netlify while GitHub is flagged: https://movie-night-spinner.netlify.app (Netlify project "movie-night-spinner", site id b641e7a7-b7d1-44cc-95e1-79f0bc20acf6). Deployed 6 Nov afternoon from wip/store-overhaul (deploy 6aed572e, app.js?v=b83e2b4b). To redeploy, use the Netlify connector's deploy-site on that project and run the command it gives from the repo folder. Plain static site, no build step. If the upload returns a 500, ask the connector for a fresh command and run it once more (6 Nov: the second try went through).
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

## 5 Nov, morning: review 10 fixed and live (app.js?v=79a2b9f8, merge 37e94cd)

- Review 10 (docs/review-10.md) scored 7.1. All 9 fix items are done and live on Netlify. Notes are under "Fixed after the review" at the end of review-10.md.
- New guards: tests/merge-guards.test.cjs (Candy bar styles, dietDish map), tests/sweet-starters.test.cjs with scripts/check-sweet-starters.cjs (kept sweet starters each have a reason), tests/prices.test.cjs with scripts/check-prices.cjs (full scan of 795 shared cards, about 5 minutes).
- Left open:
  1. Six poster editions (E.T., Groundhog Day, Mad Max 2, Men in Black II, Pretty in Pink, Under Siege) still cook a sweet as a starter, because editions cook exactly two starters, main, sweet, drink.
  2. Stand by Me's thin three-page diner needs the diner page fill reworked.
  3. Some films lost the film-number cents (Iron Giant's "57") under the new price rule.
  4. Older notes from the menu sweep teams are in sweep/*/NOTES (bar tab notes vanish, takeaway has no drinks panel, kiosk drops notes early, Holiday Inn dry wording, A Christmas Carol venue).
- Next: review 11, a fresh independent scored review, then fix rounds to 9.5.
- App Store work is planned in docs/APP-STORE-PLAN.md. Josh is setting up Apple Developer and Google Play accounts. The next question for him is how posters and stills are handled in the app (5.2.1 rights).
- Background agents sometimes stall on their commit call. Check their transcript time and run the commit yourself if it has not moved for 15 minutes.

## 5 Nov, afternoon: review 11 fixed and live

- Review 11 (docs/review-11.md) scored 8.1. All 8 fix items are done, pushed to wip/store-overhaul and deployed to Netlify (deploy 6aebd040). Notes are under "Fixed after the review" at the end of review-11.md.
- Review 10 leftovers also done: Iron Giant style "Plate No." on diner specials; the six poster editions cook a savoury second starter (Under Siege's cake bites no longer fit on the galley card, the birthday cake stays).
- New checks: tests/dry-plan.test.cjs (dry cards never buy grog, kids word pass), scripts/check-store-taps.cjs (phone sign taps, needs a browser).
- Josh decided (5 Nov): hand-built menus keep their year-coded prices (Moonstruck 19.87, Saturday Night Fever 2.01) as Easter eggs. Reviewers should not mark these off.
- Next: review 12 to confirm 9.5.
- Pushing from a Claude session works again.

## 5 Nov, midday: review 12 scored 8.4 (start here next)
Review 12 (docs/review-12.md, shots review-12-01 to 33) scored 8.4, up from 8.1. Target is 9.5. Work its fix list in order:
1. Save PDF matches the screen on gritty and scrappy films (about 24 films on airline, bistro, hotel, saloon and banquet; Die Hard 2 is worst). Same html2canvas limits as the canteen fix: find the blend, mask or blurred shadow layers and patch them in the app.js export copy loop.
2. Night diners print their backdrop blurred and dark (7 films, including The Birds and Shaft).
3. Kids' mode catches hand-built drink names (The Out-of-Towners' Manhattan, Shanghai Noon's rye highball). Extend KDRY and add cases to tests/dry-plan.test.cjs.
4. Shopping lines read as real words ("banana leave", "dried chilly", "chipotle in adobos", "4 1/3 tbsp mustard"). Fix the singular/plural and fraction rounding in shopLines, add cases to tests/shop-lines.test.cjs.
5. Prep sheet page 1 fits on A4 (The Sound of Music, Idiocracy, Knocked Up lose the showtime cue).
6. Cards keep their own words ("TALKIES SOO", Lady and the Tramp "table.", The Santa Clause dangling comma, "French 75" wrap, Batman Begins logo).
7. No "00" numbers and no film-number prices on shared layouts ("REWARD $00", Finding Nemo 42.00).
8. Small items, plus two US spellings fix 8 missed (see the review).
After the fixes: run all tests, redeploy to Netlify, add a "Fixed after the review" note to review-12.md, then run review 13.

## 5 Nov, late afternoon: review 12 fixed and live (deploy 6aebfea5)

- All 8 review 12 fix items done, pushed to wip/store-overhaul and live on Netlify. Notes under "Fixed after the review" at the end of review-12.md.
- Save PDF now bakes what html2canvas cannot draw (soft inset shadows, vignettes, filtered photos, outer rings, outlines, straight stripes, SVG textures) into pictures in the export copy in renderCanvas. Do not undo this by hiding layers again.
- New checks: scripts/check-pdf-tone.cjs (screen against PDF, `--per N`, MNS_NET=1 and MNS_LIBDIR for local html2canvas), scripts/check-kids-cards.cjs, scripts/check-prep-a4.cjs (`--guests 9`). shop-lines.test.cjs sweeps every film at 2, 4 and 9 guests.
- Logo plates on banquet, candy bar and takeaway share window.__fmtLogo2 (versioned): the old __fmtLogo global was defined by whichever layout loaded first.
- Josh asked (5 Nov) for the locked-in film at the top as a reminder. Built: a slim strip (#feature, renderFeature in app.js) at the very top of every view with poster, title, cook night, showtime, countdown, Menu and Prep sheet. Also suggested, not built yet: any showtime instead of 5pm to 9pm, and a calendar entry with a start-cooking reminder.
- Left open: the long phone Candy bar page, small swipe-view type on hand-built cards.
- Next: review 13, a fresh independent scored review, target 9.5.

## 5 Nov, evening: review 13 scored 8.6, fixed and live (deploy 6aec33c6)

- Review 13 (docs/review-13.md, shots review-13-01 to 29) scored 8.6, up from 8.4. All 7 fix items done, pushed to wip/store-overhaul and live on Netlify. Notes under "Fixed after the review" at the end of review-13.md.
- Save PDF: every blurred inset shadow is baked to a picture; a multiply grain drops only its own layers (home, tavern, lab printed wrong because of this); tagged vignettes are baked, not hidden; conic gradients (checker borders) are drawn as tiles; filtered images keep transparency (logos with a drop shadow printed on a black plate); non-A4 menus fill their bands from the touching edges. check-pdf-tone limits are now 6 levels either way. Do not loosen them.
- Vegetarian Make ahead notes rewritten in data/recipes2 (55 dishes). Run node scripts/build-data.cjs after any recipe edit. New test: tests/veg-ahead.test.cjs.
- formats-core.js is generated from formats.js by build-formats (run by build-data). Edit formats.js, never formats-core.js.
- Phone tabs fit (fmtTabsFit in formats.js). New check: scripts/check-phone-fit.cjs (loads web fonts, needs the network).
- Wait wording: planMin is the length only, planWhen adds ", start the day before".
- Josh chose commas for spaced-hyphen titles: display title changed at load in app.js, ids unchanged.
- Left open: desktop strip repeats the "This week's film" panel; Skyfall's repeated kit note; long phone Candy bar page; small swipe-view type on hand-built cards. Suggested earlier and not built: any showtime instead of 5pm to 9pm, a calendar entry with a start-cooking reminder.
- Next: review 14, a fresh independent scored review, target 9.5.

## 5 Nov, night: review 14 scored 8.6, fixed and live (deploy 6aec5cec)

- Review 14 (docs/review-14.md, shots review-14-01 to 27) scored 8.6, same as review 13: every review 13 fix held, and a new set of faults turned up that the tone check cannot see because it measures brightness, not missing words. All 7 fix items done, pushed to wip/store-overhaul and live on Netlify. Notes under "Fixed after the review" at the end of review-14.md.
- Josh's rule (only house lines drop) is now enforced in code: libUnclip never hides a dish name, and the eight layouts with their own fit pass drop notes one at a time from the bottom, not all at once. Do not go back to hiding every note in a box.
- Save PDF: filled inline-blocks holding text print as tables, clip-text prints as solid text, masked photos are drawn by pdfMaskDraw and faded by pdfMaskApply. The page frame colour reads only the outermost 0.6 per cent of the page.
- Vegetarian on hand-built phone menus: dietPhone runs the film's diet.text list sentence by sentence. A phone line with meat left in it needs a pair added to data/diet/<slug>.json (whole sentence, as the phone shows it), then node scripts/build-data.cjs.
- Kids' mode now covers the Director's cut list (planHTML wraps planHTML0 in kidsDryDom).
- New check: scripts/check-print-text.cjs (about half an hour for all 900). check-kids-cards.cjs reads the planner too.
- Left open: tavern's screen still cuts some notes with "..." where the PDF shows them in full; hidden notes on long campfire and canteen menus; Showtime cues naming the meat dish in Vegetarian mode; desktop strip repeats the "This week's film" panel; Skyfall's repeated kit note; long phone Candy bar page; small swipe-view type on hand-built cards. Suggested earlier and not built: any showtime instead of 5pm to 9pm, a calendar entry with a start-cooking reminder.
- Next: review 15, a fresh independent scored review, target 9.5. Start it in a new chat.

## 6 Nov, early: review 15 scored 8.5, fixed to 9.1 and live (deploy 6aec97b1)

- Review 15 (docs/review-15.md, shots review-15-01 to 26) scored 8.5. Nothing regressed; a census showed the hidden notes left open in review 14 were far wider: 910 lines on 243 of 423 films (every campfire, canteen, tavern and galley film, and 30 of 34 cafe films). Fixes and the after-score (9.1) are under "Fixed after the review" at the end of review-15.md. Pushed to wip/store-overhaul.
- Josh's rule (only house lines drop) now reaches dish notes. Before a note goes, the layout makes room: campfire takes photo height then runs two columns, canteen takes poster width, tavern narrows the poster plate, cafe and galley take poster height. Then window.__fmtShort / __fmtTrim (app.js) shorten a note at a natural break, and only then hide it. No layout clamps a note to "..." any more. Do not go back to clamping notes.
- Save PDF: html2canvas ignores line clamps, so renderCanvas sets any clamp that really cuts text to the words the screen shows. Galley stores the shared sheet size on each box (data-gk) so a sheet printed alone keeps it. Canteen trays keep 20px and kiosk columns 10px spare for html2canvas. edgeColour reads inside the outer 2 per cent, past thin edge rules.
- Vegetarian showtime cues go through dietCue (app.js, and fmtCue in formats.js): the thing served is named by its course. A cue whose moment needs the dish gets a hand-written pair in data/diet/<slug>.json text.veg (Splash, The Fly, Iron Man, Poltergeist, Christmas Vacation, Chinatown). Diet files use the repo's slug (apostrophes become "-": national-lampoon-s-...).
- With the locked-in strip showing, the week panel is a slim "Your movie night" bar (week-slim). Phone Candy bar combos and glass case scroll sideways. Tag place cards have a smaller number; fridge and comic intermissions use the film's tagline.
- scripts/check-print-text.cjs now also fails on a hidden dish note and on a clamp in the Save PDF copy that still cuts text. It currently fails on the 56 notes left (below); every other check passes.
- Left open: 56 hidden notes on 23 films (lab 9, saloon 8, airline 2, tiki 2, The Wog Boy, My Big Fat Greek Wedding). A lab poster trade was tried and reverted: it shortens the column beside the poster. These want shorter notes in the data or a new lab strip and saloon columns. Also open: small swipe-view type on hand-built cards; The Out-of-Towners' bitters in kids' mode. Suggested earlier and not built: any showtime instead of 5pm to 9pm, a calendar entry with a start-cooking reminder.
- Checks take long on this 2-core machine: check-print-text about 55 minutes with other jobs running, prep-a4 20 minutes. Background jobs stop at two hours, so run prep-a4 on its own.
- Next: clear the 56 hidden notes, then review 16, a fresh independent scored review, target 9.5. Start it in a new chat.

## 6 Nov, morning: hidden notes down to 29 on 12 films, live (deploy 6aece027)

- Saloon: a heavy menu takes height from the poster (cutS in saloon.js), all 12 saloon films clear. Lab: a section can move from the column beside the poster (data-side) to the strip under it (data-foot) when that hides fewer notes. About 80 long notes shortened in the data across films.json, dish-notes.json, recipes and diet files.
- check-print-text fails only on 29 hidden notes on 12 films: lab (The Martian, Mad Max 2, Furiosa, Jurassic World Dominion, Men in Black II, Harry Potter and the Deathly Hallows: Part 2), Airplane! and Captain America: Civil War (airline), The Jungle Book (tiki), The Wog Boy (cafe), Hook, Weekend at Bernie's. Airplane! varies between 3 and 8 from run to run with machine load. Every other test and check passes on this build.
- Lab needs a new layout: the strip under the poster is about 150px tall and the column beside it narrow. Shrinking the poster was tried twice and made it worse. Do not try that again.
- Next: a lab layout with more menu room, the airline Airplane! card, then review 16 in a new chat.


## 6 Nov, late morning: no hidden notes on any of the 900, any showtime, Add to calendar (deploy 6aed0160)

- check-print-text passes on all 900: no dish name or note hidden. Every test and check passes (list at the end of review-16.md).
- Lab (menu-formats/lab.js): new strip under the poster. The menu runs from the column beside the poster into the strip dish by dish, not section by section; a split section repeats its head in the strip with "continued". Every split is tried after the fonts load, and the one that hides fewest notes, then shortens fewest, then keeps the biggest type, stays. The strip is 16px deeper (slimmer footer). If a film is still short, the generic stamp and then the "Plate A" tab give way (data-spare). The poster is untouched. Do not shrink it.
- Airline (menu-formats/airline.js): has its own fitter, window.__fmtAir. It used to share window.__fmtBHA with bistro and hotel, so whichever layout loaded first ran for all three; that, and passes that never undid a hidden note, is why Airplane! varied from run to run. Every pass now starts from the built page. On the meal page the still gives up height (16px steps, to 55 per cent) before a meal note is shortened or hidden; the ticket and stripes move with it.
- Tiki (menu-formats/tiki.js): on the back, the island map gives up height (16px steps, up to 150px off the main isle) before a kitchen note goes.
- Cafe (menu-formats/cafe.js): window.__fmtCafeBal2 tries every split of the sections across the two columns once fonts are in (first section always top left) and keeps the one with no clamped dish name, fewest hidden notes, fewest shortened, biggest type. The fitter now clears its name clamp (--dl) on every pass; it used to stick.
- Data trimmed: Mad Max 2 (several notes, and the vegetarian and alcohol-free versions to match), Weekend at Bernie's mai tai (and its alcohol-free version), Civil War's house drink is now "Apfelschorle", Mad Max 2's house cordial note "Pappagallo's fair ration".
- Any showtime: weekTime takes any HH:MM on a quarter hour, 7pm default. SHOWTIMES is all 96; showOpts groups them (Early hours, Morning, Afternoon, Evening, Night). Pickers on the lock-in card (lockAsk, #lockTime: a new plan whose time has already gone tonight moves to next week) and the "Your movie night" bar, which now keeps its pickers once a film is open. Changing the time redraws the strip and the Prep sheet.
- Add to calendar (app.js, "calendar reminder" block after listText, outside the week section on purpose: tests/week.test.cjs still forbids start-cooking wording in the countdown). Buttons #featCal (strip) and #weekCal (bar). calPlan: start cooking = showtime less the longest picked dish (dishTimes active, plus any wait under 10 hours), down to a 5-minute mark; no timed dish means an hour before. A wait of 10 hours or more gets a day-before reminder at 6pm, earlier if the wait needs it, moved to 6pm the evening before if it would land before 8am. calICS: one VEVENT, UTC times, menu link in the notes and URL, two VALARMs relative to the start (start cooking first, because Outlook keeps one). The panel after the download lists the times and gives Google links that add the night and each reminder as separate events (Google drops VALARMs from imported files and its Android app cannot open .ics). The Prep sheet of the locked-in film shows "Showtime" and "start cooking" chips from the same calPlan.
- New test: tests/calendar.test.cjs (Brisbane, New York, UTC, across the US clock change). week.test.cjs covers any showtime.
- Not tested on real devices: the .ics was checked with the Python icalendar parser and in Chrome; opening it in Apple Calendar, Outlook and Google on a phone and a desktop wants a quick try by hand.
- Pushed to wip/store-overhaul. The session's access check said pushes would be refused, but the push went through.
- All tests and checks pass on this build: 18 node tests, dialogs, check-browser, check-store-taps, check-sweet-starters, check-cut-words, check-kids-cards (343), check-prices, check-pdf-tone (sample and --per 2), check-phone-fit (900), check-print-text (900) and check-prep-a4 (900 Prep sheets, 1,708 A4 pages; also on locked-in films at 9 guests, with the showtime chips).
- Review 16 (docs/review-16.md, shots review-16-01 to 28) scored 8.9 by an independent reviewer. Its fix list: Prep sheet misses the showtime chips right after lock-in until a refresh; the "Your movie night" bar falls apart once showtime has passed; the start-cooking reminder counts waits under 10 hours as cooking, so 64 films start before noon at 7pm (Chef 6:25am); long make-aheads read "The day before" and "168 hr" (Psycho); Mad Max 2 still hides its house cordial note with photos loaded (check-print-text blocks photos, so it misses it); A Bug's Life and Walk Hard print differently from the screen; the calendar panel should tell a phone what to tap; small items.
- Next: work down review 16's fix list in a new chat, then review 17. Consider letting check-print-text load photos (with a fix for its stadium title false alarms).

## 6 Nov, afternoon: review 16 fixed and live (deploy 6aed572e)

- All 8 review 16 fix items done, pushed to wip/store-overhaul and live on Netlify. Notes under "Fixed after the review" at the end of review-16.md.
- Start-cooking rule (Josh, 6 Nov: waits under 10 hours should not push the start time): calNight in app.js works out what is left to do on the night after a dish's last long wait (2 hours or more, or a step that says overnight). Only that sets "start cooking". A long-wait dish is a "Make ahead today" reminder (latest time that fits, after 8am) or goes the night before at 6pm (overnight in the recipe, 10 hours or more, or a start before 8am). Days for 48 hours or more, and the right day in words (calAhead). The .ics can now carry three alarms: start cooking first (Outlook keeps one), make ahead today, prep ahead. At 7pm only Old School (8 hr brisket) and Carlito's Way (5 hr pernil) start before 1pm. tests/calendar.test.cjs covers it.
- "Your movie night" bar after showtime: the line sits under the buttons with a "Same film next week" button.
- check-print-text now loads the TMDB photos and waits for them (MNS_PHOTOS=0 to skip), and skips stadium's title in type while the logo shows. Passes on all 900 with photos (about 80 minutes on this machine).
- Lab: the film's logo shrinks to 60 per cent as the last give-way (data-squash), never hidden. The poster is untouched.
- Kiosk columns keep 24px spare for html2canvas. edgeColour skips a striped pair of sides (Walk Hard).
- Calendar panel words by device (calHow): iPhone, Android, computer. Still not tried on real phones: worth a quick test by hand.
- Phone strip is 112px (no kicker, thumbnail poster, buttons on one row; wraps under 360px).
- Kids' mode: sweet vermouth and bitters becomes "cherry syrup and orange"; bitters alone "orange zest"; "lemon, lime and bitters" left alone.
- All tests and checks pass on this build: 17 node tests, dialogs, check-browser, check-store-taps, check-sweet-starters, check-cut-words, check-kids-cards (343), check-prices (795), check-pdf-tone (sample and --per 2), check-phone-fit (900), check-print-text (900, with photos) and check-prep-a4 (900, 1,708 pages).
- Left open: small swipe-view type on hand-built cards; a vegetarian card still prints a dish with no vegetarian version (by design).
- Review 17 (docs/review-17.md, shots review-17-01 to 22) scored 9.0 by an independent reviewer, up from 8.9. Every review 16 fix held. Its fix list: Ghost Dog's section heads print as empty bars; The Big Lebowski's cue and third house rule cut off; prep-ahead times already in the past offered with no warning (Psycho locked in today); Add to calendar after showtime still downloads the past night; Prep sheet "longest" and the calendar's lead disagree; make-ahead and start-cooking alarms 15 to 30 minutes apart; The Heat prints charcoal and canteen trays print square corners; small items.
- Next: work down review 17's fix list, then review 18. Start in a new chat.
