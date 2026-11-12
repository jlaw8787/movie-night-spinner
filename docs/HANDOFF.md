# Handover: Movie Night Spinner

Read this first in a new chat. Last updated 7 Nov 2026. Start with "7 Nov, audit" at the bottom.

## Where things are

- Repo: jlaw8787/movie-night-spinner
- Launch branch: wip/menu-polish (917768a22)
- Work branch: wip/store-overhaul, everything pushed (7 Nov evening). It sits on top of menu-polish. main has one extra commit (d30fb02ac) that merges in clean.
- Live on Netlify while GitHub is flagged: https://movie-night-spinner.netlify.app (Netlify project "movie-night-spinner", site id b641e7a7-b7d1-44cc-95e1-79f0bc20acf6). Deployed 7 Nov evening from wip/store-overhaul at e158604 (deploy 6aef1529, app.js?v=d0ead51b), all 900 audited and check-print-text passed. Deploy from a trimmed copy: `git archive HEAD | tar -x -C /tmp/deploy`, delete audit, docs, sweep, wip, tests and scripts, copy .netlify in, and run the connector command there (the full folder now gets 500s from Netlify). To redeploy, use the Netlify connector's deploy-site on that project and run the command it gives from the repo folder. Plain static site, no build step. If the upload returns a 500, ask the connector for a fresh command and run it once more (6 Nov: the second try went through).
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

## 6 Nov, night: review 17 fixed, layouts stop clashing, review 18

- All 8 review 17 fix items done. Notes under "Fixed after the review" at the end of review-17.md.
- Calendar (app.js): calPlan(show,dishes,now) takes the time the plan is made. A make-ahead that no longer fits is "Too late" with the first week it fits (plan.late, calLate), no alarm, no Google link, and a "Move to <date>" button in the panel; one still in time reads "Start now" (.now on before/early) and gets no alarm; plan.startNow when start cooking has gone. A make-ahead within 45 minutes of start cooking folds into it (plan.first). calLead is the one "longest on the night" sum for the Prep sheet chip and the calendar. After showtime the buttons read "Add next week to calendar" (calLabel, refreshed by tickShowtime) and pressing it moves the night on a week first. showToday: "This morning" / "This afternoon" / "Tonight". prepNight gives the Prep sheet the same dish list as the calendar.
- Josh, 6 Nov: cook 5 on every film. planTrim (app.js) takes five from a menu whose cooked list names six or seven. 0 of 900 tick more than five.
- Josh, 6 Nov: no dashed ticket box on tiki maps. A fourth photo island uses the first still not already on the map, tagged with the prop title (Return of the Jedi: the Star Destroyer over Endor). A film with under 3 stills (Running Scared) keeps a plain cream card and drops the empty right island. More stills for those films need the TMDB key.
- Save PDF (renderCanvas): filled inline-flex boxes print like inline-blocks; a grain blended onto a plain paper is baked on a canvas (pdfBlendBake); a hard inset edge with an offset is baked (canteen trays round); one outer ring on a box in the flow becomes a border with a negative margin; a strike-through over 1.5px prints as a bar.
- Layouts no longer reset each other's type. window.__fmtFit (banquet, candy bar, takeaway) only takes bare [data-fit=""] boxes; M.fitAll (home, invite, precinct) only numeric data-fit inside a lib-home, lib-invite or lib-precinct card. Before, opening one of those films and then a placemat or lab film cut that menu's last lines (Jingle All the Way, The Incredibles, Oppenheimer). fitLines takes its base size again when a layout's own fit changed the type. placemat's fit waits for layout and reruns as pictures arrive.
- check-print-text now also fails on text that runs more than 4px below its .fx-panel or is cut by a box that hides its overflow (allowing for a tight line's empty ascent), and re-measures after 2 seconds so a settling fit pass is not reported. It catches cues, side panels, tickets and footers, not only dish names and notes. Run it over all 900 in one go: the clash faults only show in a long run.
- Also fixed from that sweep: Big Lebowski sheet, Friday's market footer, Phar Lap (stadium course gaps come out of the room left; a lone still fills the map instead of a black poster tile), prom tickets (closing line only when it fits, prop lines step to 14px), banquet boxes may shrink to 14px past their own floor, club venue names take two lines on the poster-first page with the note moved down.
- Left open: the drop shadow under canteen trays is not on paper; Running Scared and Phar Lap have one or two stills only; small swipe-view type on hand-built cards.
- All checks pass on the deployed build (980f2c4): 17 node tests, dialogs, check-browser 16/16, store taps, sweet starters, cut words, kids cards (343), prices (795), PDF tone with photos, phone fit (900), check-print-text (900, with the new cut-text rule), check-prep-a4 (900, 1,734 pages).
- Review 18 (docs/review-18.md, shots review-18-01 to 27) scored 9.2 by an independent reviewer, up from 9.0. Every review 17 fix and the new items held. Its fix list: club "On stage tonight" tag missing on paper (all 34 club films); tiki woven band under the poster prints as a flat dark bar (all 17 tiki films); Money Train caption runs onto the footer; a too-late dish is still ticked, cooked and shopped (Psycho's pickled onions, Rocky IV, Tombstone, Midsommar); small items (Scream, Role Models, Mean Streets paper details, Nightmare 3 badge, "meringues takes longest", capital after "with", US "armor" and "theater", "1h 0m", Tombstone eggs "to chill", two next-week buttons after showtime).
- Next: work down review 18's fix list in a new chat, then review 19.

## 7 Nov, early: review 18 fixed, paper checks that catch what review 18 caught

- All 5 review 18 fix items done. Notes under "Fixed after the review" at the end of review-18.md.
- Save PDF (renderCanvas): text on a masked photo stays over the baked picture (club tag); stripe stops with a bare 0 parse; inset shadows bake on any box size and stripes and small dot tiles (pdfDots, px or % stops) on boxes 120px or less; outlines on boxes in the flow print as a frame inside the box; an inset ring frame sits on its own box (the copy is not in the page when that runs, so its computed position reads empty); tinted radial glows bake.
- descRoom (app.js, end of fitLines): a box that hides its overflow and cuts a letter's tail, a tall accent or a script swash gets just that room, taken back with a negative margin. Nothing else moves. A box hiding a whole line is left alone. Diner heads and kickers and the bistro board also got room in their own files.
- Too late (app.js planLate): a picked make-ahead that cannot be done before the locked-in showtime is off the plan, method and shopping, listed under "Too late to make, buy ready-made", greyed in the planner with a "Move to <date>" button. The pick is kept, so moving the night brings it back. calPlan does not count its time on the night. calDishes (calendar) still sees every pick.
- Wording: "Longest on the night: <dish>, <time>"; calMid lowers a dish's capital after "with" unless the first word is a name (needs dish-names.json loaded, it rebuilds its word list until then); countdown "1 hr 30 min"; armour, theatre; Tombstone eggs to pickle. After showtime the bar hides its calendar button and keeps "Same film next week".
- Money Train (formats.js): photo 118px, caption clear of the footer.
- check-print-text new rules: text missing from the Save PDF copy, text running into other text (display type 24px and up measured at 0.7), blurred inset shadow or straight stripes left for html2canvas, outline left, small radial tile left, export frame on the wrong box. The clip rule now checks a text box's own overflow and measures real ink with canvas measureText (1.5px limit; sideways both advance and ink must spill). Every review 18 paper fault fails on the old build (980f2c4). Run it over all 900 in one go.
- Tools used this session, not in the repo: html2canvas 1.4.1 and jsPDF 2.5.1 saved locally for MNS_LIBDIR; playwright from `npm root -g`.
- All checks pass on the deployed build (deploy 6aee0522, app.js?v=ceb0ad88): 18 node tests (dialogs included), check-browser, store taps, sweet starters, cut words, kids cards (343), prices (795), PDF tone with photos (sample and --per 2), phone fit (900), check-print-text (900 in one run, with the new rules), check-prep-a4 (900, 1,734 pages).
- Left open: the soft drop shadow under canteen trays and under Scream's stamp is not on paper; Running Scared and Phar Lap have one or two stills (need the TMDB key); small swipe-view type on hand-built cards; the .ics still wants a try on real phones.
- Review 19 (docs/review-19.md, shots review-19-01 to 18) scored 9.25 by an independent reviewer, up from 9.2. Every review 18 fix held; descRoom showed no side effects. Its fix list: hotel door hangers and airline ticket notches print solid (the mask rule only redraws cut-out shapes with no text, all 31 hotel films); Coming to America's navy frame prints red; the too-late planner row squeezes to three lines at 390 wide; planner guest buttons and dish rows are 36px, not 44; small items ("Deviled" on nine films, Home Alone 2's apple drink, Beetlejuice's note on the House Rule bar, Rocky IV's vodka mule reminder after a move, The Godfather's "Rigatoni, Sunday gravy" lead line, drop shadows on precinct and motel photos).
- Next: work down review 19's fix list in a new chat, then review 20.

## 7 Nov, morning: review 19 fixed, live (deploy 6aee5226, app.js?v=e5194505)

- All 5 review 19 fix items done, plus 5 more faults the full sweep found. Notes under "Fixed after the review" at the end of review-19.md. Pushed to wip/store-overhaul.
- Save PDF (renderCanvas):
  - Masked boxes holding words (hotel door hanger, airline/bistro/hotel ticket) are baked by pdfMaskBox: pdfMaskAlpha draws the mask's radial and linear layers (size, position, repeat) as an alpha picture, the box's fill and empty texture layers go under it, the words stay in the page. A drop-shadow on a wrapper round just that shape goes into the picture.
  - html2canvas loses every outer box shadow at print scale (canvas shadow offsets are not scaled) and skips drop-shadow filters. pdfLiftBake (runs last, after pdfBlendBake) draws each outer shadow as a picture behind its box, turned with it. Drop-shadow on a plain box or a clip-path shape becomes the same; on lettering, a text shadow. Do not go back to dropping shadows. The shape is drawn in place and cut out (Chrome skips the shadow of a shape drawn off the canvas).
  - A grain mask (url) on lettering is dropped in the copy: the words print plain.
  - A hand-built landscape card whose outer corners are rounded (8px or more) keeps the screen surround in the print copy (Coming to America, Pulp Fiction, Chef print on navy).
- fitLines: a nowrap dish name in a flex row that runs past its edge steps down, never under 65% (Pulp Fiction prices).
- Planner: dish rows wrap (time under the name when it does not fit), too-late tag on its own line on a phone, guest buttons, dish rows and diet toggles 44px.
- Calendar: make-aheads due on different days keep their own reminders (calPlan before and before2: alarms, Google links, panel rows, Prep sheet chips). calLong puts the time in brackets when the dish name has its own comma.
- Kids' word pass: hot, warm or mulled cider is "spiced apple juice", apple or pear cider "sparkling apple/pear juice".
- Data: devilled everywhere. Beetlejuice cheese note one word shorter. Small nudges on Midnight Cowboy (ticket), Three Men and a Baby (sign nail) and Money Train (drink block gap).
- New checks. tests/spelling.test.cjs. check-print-text now also fails on: a mask left on a box with text, an outer shadow or drop-shadow filter left for html2canvas, a rounded hand-built card printing on a surround that is not the screen's, a price past its column, and a later filled box covering part of a line's ink (turned shape, round corners and parent clip allowed for; 3px limit). Every one fails on the old build (e176cf8) and passes now.
- Checks on this build: 20 node tests (dialogs included), check-browser, store taps, sweet starters, cut words, kids cards (343), prices (795), PDF tone with photos (sample and --per 2), phone fit (900), check-print-text (900 in one run, all new rules), check-prep-a4 (900, 1,734 pages).
- Tools used this session, not in the repo: html2canvas 1.4.1 and jsPDF 2.5.1 in /home/claude/libs for MNS_LIBDIR; playwright from `npm root -g`.
- Left open: Running Scared and Phar Lap have one or two stills (need the TMDB key); small swipe-view type on hand-built cards; the .ics still wants a try on real phones.

## 7 Nov, late morning: review 20 (9.2), its regressions fixed, fact and vibe audit started

- Review 20 (docs/review-20.md, shots review-20-01 to 18) scored 9.2: the review 19 fixes held, but the new shadow baking printed spread shadows as black rings and laid some shadow pictures in the wrong place. Fixed (563ccd1): each shadow layer is filled in its own colour, blurred and offset (canvas filter), corners are elliptical per corner (pdfRadii gives [rx, ry]), and a shadow is only laid against a positioned parent (a static parent is made relative, a turned one always). New check-print-text rule: "shadow picture laid against an unpositioned box" (fails on the review 20 build).
- Ratatouille: Colette's crème brûlée added to the Gusteau's card ("Le dessert", left column) and to data/recipes2; it cooks soup, mushroom and cheese, ratatouille, crème brûlée and Ego's spritz (Josh's call). Two starter notes shortened to fit.
- Kids' mode: place names kept (KKEEP: Big Whiskey, "X's Beer Garden"), "alcohol-free lager battered" reads "crisp battered", Bloody Mary becomes Virgin Mary.
- Dumb and Dumber: the hot peppers go in Mental's burger, not Sea Bass's (cue, dish note, method tip, house line).
- pdfStripesBox draws diagonal repeating stripes for Save PDF (Elf, A Christmas Story); check-print-text now flags any repeating stripes left. Not yet looked at on paper.
- Not deployed yet: commits after a134410 need a full check-print-text run (all 900, one go), then deploy and review 21. Still open from review 20: canteen meal voucher paper prints square (Chicken Run, Matilda); Time Bandits' frame rule.
- TMDB key saved at /home/claude/.tmdb_key (this machine only, never commit).

## 7 Nov, audit

Josh asked for a fact audit (is every line true to the film, are quotes real) and a vibe audit (is the menu cool, does it fit the world, use the iconic moments, look right) of all 900 menus. Everything is in docs/AUDIT.md (rules, sources, file format), docs/audit-agent-prompt.md (the brief for each audit agent), scripts/audit-extract.cjs (audit/cards and audit/shots), scripts/audit-queue.cjs (next films, quote-heavy first), scripts/audit-report.cjs (docs/audit-report.md, with the file each wrong line lives in).
- Pilot (5 films) found made-up quotes on Dumb and Dumber, The Godfather (Clemenza) and Get Shorty, and a wrong Goodfellas caption. Rules tightened after it.
- Runs in waves of about 100 films, 5 agents of 20 on Sonnet, results saved per film so any chat can resume: `node scripts/audit-queue.cjs 100`, split into 5, give each agent docs/audit-agent-prompt.md and its slugs. Wave 1 started 7 Nov.
- Fact fixes are corrections and can go in directly. Vibe rework (new dishes, lines or look) is a design change: Josh approves it first.
- Josh's plan limit is unknown to Claude: send a short report after each wave so he can pause.

- 7 Nov midday: check-print-text passed on all 900 at 8d1afdf (with the Ferris and note changes) and that build is live (deploy 6aee857b). Ferris Bueller: bistro layout takes party, meal and time from film-flavour (party 3, lunch, 1:00 pm). Josh: where a layout's habit clashes with the film, the film wins.
- Audit status: 261 films have results (waves 1 to 3). Wave 3 hit the shared search limit; 31 memory-only results were deleted and go back in the queue. Next: `node scripts/audit-queue.cjs 60`, 3 agents of 20, in a new turn each time. Then apply notes (scripts/audit-apply-notes.cjs), fix open wrong lines (report section "Wrong lines"), full check-print-text, deploy.
- Layout issues the audit raised for Josh's call (vibe): Return of the Jedi, Wakanda Forever, Avatar and Enchanted on tiki; Wayne's World on prom; Spider-Verse, Rogue One, School of Rock and Infinity War in canteen; Crouching Tiger on tearoom; Finding Dory and Aquaman on the beach kiosk; Pocahontas has a stranded "Mess Hall Mains" heading; Pinocchio, Dead Man's Chest, Doctor Strange and No Way Home posters sit in black bars.
- 7 Nov afternoon: Josh says GitHub has lifted the flag on his account. Hosting (Netlify, GitHub Pages or both, and merging to main) is to be talked through with him before changing anything.

## 7 Nov, 4:30pm: where the next chat starts

- Live: 6bde9d5 (deploy 6aeec424, app.js?v=b969cb17). check-print-text passed on all 900 at 960d05e apart from Annie's hotel note (2px), fixed in the hotel layout and re-checked on all 31 hotel films.
- After the deploy: audit wave 7 notes applied (not live). Before the next deploy, run the wave 7 fixer (open "Wrong lines" in docs/audit-report.md), then check-print-text on all 900 in one go, then deploy from the trimmed copy.
- Audit: 501 of 900 films have results. Next waves: `node scripts/audit-queue.cjs 60`, 3 Sonnet agents of 20 per turn with docs/audit-agent-prompt.md, then `node scripts/audit-apply-notes.cjs`, a fixer agent on open wrong lines (the fixer brief is the same each time: smallest change, film wins over the layout's habit, rename dishes everywhere, mark done), build-data, tests.
- Layout fixes made from audit finds today: campfire holds a heading with its first dish; hotel front desk note has room at its foot; bistro (party, meal, time), prom (classOf), saloon (currency) take per-film settings from film-flavour; scotch guard in campfire, saloon and tiki; zero-width spaces stripped in dryText.
- Checkers sometimes get it wrong (The Matrix noodles, Miracle on 34th Street's Thanksgiving): fixers check suspect calls against Wikipedia and reverse them.
- Some wave 7 checkers passed signed notes framed as written ("Left on the counter") even when the words are invented. That follows the rule; Josh may want it stricter.
- Waiting on Josh: 250 or so flat menus and the films on the wrong layout (list above), review 21, hosting (Netlify or GitHub Pages).

## 7 Nov, evening: audit finished (all 900)

- Wave 7's 25 wrong lines fixed (Fight Club's car park beer reversed: the checker was wrong). check-print-text passed on all 900 at 31ef90b, deployed (deploy 6aeee555).
- Waves 8 to 14 ran in this chat: 60 films a wave, 3 Sonnet agents of 20 (13 for the last 39), then audit-apply-notes, then one Sonnet fixer per wave with the usual brief. All 900 films now have results.
- Report: 716 wrong lines fixed, 3 open, 990 unsure, 411 flat, average vibe 3.55.
- Open for Josh: Ladies in Black prints decimal prices in 1959 Sydney (tearoom builds prices by era, no per-film currency); Mad Max 2's badge says GYRO CAPTAIN over a still of Max (lab layout); Trading Places' crest reads 18 74 but the Heritage Club is 207 years old (1776). The year is baked into crest-6b76d3.webp; a quick redraw came out broken and was reverted, so it needs a proper art edit.
- Reversed checker calls worth knowing: Taken's pony (stays), True Romance's purple Cadillac (stays), Waitress's "I Hate My Husband pie" (real).
- New optional per-film settings in data/film-flavour.json, each read by one layout and used only where set: precinct `dept` (Mad Max), stadium `score` (Next Goal Wins), diner `caption` (Shaft) and `lastSeenAt` (The Birds), truck `drinksHeading` (Rent). app.js KFIX guards kids mode turning "Martinis' new house" into "Mocktail' new house".
- Unapplied fix_notes on unsure lines (fixer judged the current notes fine): Pelham One Two Three, Working Girl, Sleepless in Seattle, The Adjustment Bureau, The Secret of My Success, After Hours, Die Hard, Ghost Dog. Hand-built menus have no film-flavour entry, so the notes script skips them.
- Layout and look issues the checkers raised (vibe, Josh's call): posters in black bars (Gladiator II, Great Mouse Detective, Rise of the Guardians, Sword in the Stone, Muppet Treasure Island), Rocky V header cut off, Phar Lap and Nativity on the wrong layout, Selena's '97 date stamp on a 1995 still.
- Waiting on Josh: the 411 flat menus and the layout list above, review 21, hosting (Netlify or GitHub Pages).

## 7 Nov, 10pm: the three open wrong lines fixed

- Ladies in Black: tearoom takes a per-film `coin: "lsd"` in film-flavour and prints shillings and pence (2/6, 7/9). Only this film uses it.
- Mad Max 2: the lab badge prints the note's name under Max's still, so the note is now Max's own (kind note: he takes the Dinki Di and drives the tanker out).
- Trading Places: crest redrawn as 17 76 (crest-6cdcfe.webp), reusing the original 1 and 7 glyphs with a matching 6. Checked on cream and on the rendered card.
- Audit report: 0 wrong lines open, 990 unsure, 411 flat.

- Live: 911f5f3 (deploy 6aef17bc). Branch pushed.

## 7 Nov, 10:30pm: Josh's decisions 

1. Hosting: decide later. Keep deploying to Netlify from the trimmed copy; don't merge to main yet.
2. Flat menus (411): rework all, Josh approves. Apply the checkers' "ideas" and "missing" moments in batches (vibe rework is approved, no per-film sign-off needed). Every new line still follows the fact rules: real quotes only in quote marks, no song lyrics, smallest layout-safe length. Re-score after.
3. Wrong layouts: move them, Claude's pick. Return of the Jedi, Wakanda Forever, Avatar, Enchanted (tiki); Wayne's World, Nativity (prom); Spider-Verse, Rogue One, School of Rock, Infinity War (canteen); Crouching Tiger (tearoom); Finding Dory, Aquaman (beach kiosk); Phar Lap (stadium). Pick the best-fitting layout for each.
4. Signed notes: keep the current rule (in-voice notes true to the plot are fine; quotes must be real).
5. Unsure lines: chase all 990. Settle each as ok or wrong with a source, fix the wrong ones.
6. Look bugs to fix alongside (no call needed): posters in black bars (Gladiator II, Great Mouse Detective, Rise of the Guardians, Sword in the Stone, Muppet Treasure Island, Pinocchio, Dead Man's Chest, Doctor Strange, No Way Home), Rocky V header cut off, Pocahontas stranded "Mess Hall Mains" heading, Selena's '97 date stamp on a 1995 still.
7. Review 21: after all the rework is done.
Then full check-print-text (all 900, one go), tests, deploy, status updates to Josh as it goes.

## 8 Nov, 1:30am: decisions 1, 3, 4, 5, 6 done (start here in the next chat)

Done and pushed (not deployed yet; live is still 911f5f3):
- Look bugs (6): tavern posters keep their shape as the plate narrows (no black bars, 9 films); Rocky V sign shortened; home stamps a story year within 5 years (Selena '95); Pocahontas heading already held with its dishes.
- Layout moves (3), Claude's picks: Return of the Jedi and Wakanda Forever to banquet; Rogue One and Infinity War to galley; Avatar to campfire; Enchanted to invite; Wayne's World to diner; Nativity! to canteen; Spider-Verse to newspaper; School of Rock to club; Crouching Tiger to tavern (coin "taels"); Finding Dory to placemat; Aquaman to home; Phar Lap to pub (est. 1870).
- New per-film settings in film-flavour: campfire `labels` (s, m, w, d, t, n, b, call: headings for non-camp worlds); airline `flight` (Con Air "Jailbird"); diner `est` (Wreck-It Ralph 1983); bistro `time` may be words (Batman "parade night"); pub est year comes from a period story year.
- Airplane!: Dr Rumack's note is his real line, "I am serious. And don't call me Shirley." (Josh, 7 Nov 11pm).
- Unsure chase (5): all 990 settled with sources. Report: 0 wrong open, 0 unsure. Briefs: docs/unsure-agent-prompt.md.

Tools added (use them, they save hours):
- scripts/card-ops.cjs: `apply audit/ops/*.json` applies text ops across a film's whole data (films.json, flavour, house, dish names and notes, recipes, recipes2, diet, its formats.js spec and template). Each op is marked done; matches lower-case stored notes. `find "Film (Year)" "text"` shows where a line lives.
- scripts/edition-sync.cjs: copies applied ops into the poster editions in movie-menus.js. Run after card-ops apply; editions hold their own copy of the text and recipes (tests/era-menus checks recipe names match).
- scripts/audit-src.cjs: `plot`, `quotes`, `script`, `grep "Film (Year)" words` from Wikipedia, Wikiquote and springfieldspringfield transcripts through the proxy, no WebSearch needed. Never caches rate-limit pages (fixed 8 Nov; 600 bad cached pages were cleared).
- /tmp is wiped between machines: the apply loop is `node scripts/card-ops.cjs apply audit/ops/*.json && node scripts/edition-sync.cjs && node scripts/audit-apply-notes.cjs && node scripts/build-data.cjs`.

Lesson from the chase: agents cut real visual scenes when a search came back empty (Gremlins stair lift, Palm Springs pizza float, Practical Magic midnight margaritas dance, all put back). An empty search is not evidence.

Josh, 7 Nov 11pm: "I don't want movies to miss iconic lines or scenes." So every film (all 900) gets an iconic check, not only the 411 flat ones.

Next, in order:
1. Iconic check and rework (decision 2 plus the iconic rule): docs/rework-agent-prompt.md. Batches: 410 flat films in lists of 8 (full rework), 490 others in lists of 15 (iconic check only). Make the lists with the snippet in this section's commit or regenerate: flat = vibe.flat true. Agents write audit/rework-ops/<slug>.json; apply with card-ops apply audit/rework-ops/*.json, then edition-sync, build-data, tests.
2. Re-extract cards and shots for changed films (audit-extract FORCE=1) and re-score vibe (a light agent pass reading the new shots).
3. Review 21, then check-print-text on all 900 in one go, all tests, deploy from the trimmed copy (see top of this file).

## 8 Nov, morning: rework running (start here in the next chat)

- Batch lists in audit/rework-lists (F01 to F52 flat, 8 each; I01 to I33 iconic only, 15 each). A film is done when its result file's vibe block has `rework`. Find what's left: films without `vibe.rework`, then run their batches with docs/rework-agent-prompt.md (Sonnet, 8 agents at a time worked fine; agents must never pkill).
- Layout clashes and checks the agents raised: audit/rework-clashes.md. Fix in one code round after the rework (stadium baseball words on non-sport films, tiki on non-island films, galley on Captain Marvel, tavern on Doctor Strange, etc.). Alice in Wonderland's "unbirthday" house line is a song lyric: change it.
- Josh, 8 Nov: Grandma's Boy keeps "My grandma drank all my pot." Questions to Josh as pop-ups, one at a time.
- GitHub pushes work again from Claude sessions (8 Nov).
- Dry run of all ops so far: 0 missed.
- 8 Nov, 10:20am: 537 of 900 done (F01 to F24, I01 to I23). Left: F25 to F52 and I24 to I33 (38 batches). Dry run of all 466 ops files: 1504 ops, 0 missed. Agent prompt used: brief plus "Reply in under 150 words", "never pkill", "don't invent jokes about scenes that don't exist". Append each batch's clash notes to audit/rework-clashes.md, commit and push after each round.

## 8 Nov, 12:30pm: rework, clashes and re-score done (start here in the next chat)

Done and pushed (not deployed; live is still 911f5f3):
- Rework finished: all 900 films (410 full rework, 490 iconic check), 2,691 ops applied from audit/rework-ops, editions synced (edition-sync now reads audit/rework-ops too).
- Clash list: per-film layout word swaps, film-flavour "words" {"Old":"New"} applied by libWords() in app.js (text only, any case, capitals kept), on about 50 films. Free Willy beach:false. Lyric house lines fixed (Alice, Hobbit 1, Rocky Horror). Analyze This is The Waldorf. libStops() stops doubled full stops after quotes.
- Re-score of the 410 reworked menus (docs/rescore-agent-prompt.md): average 3.26 to 3.48, 207 at 3.5 or better, 203 still under. Old scores kept in vibe.before.
- Cards and shots re-extracted for all 900 on 8 Nov.

Josh's calls waiting (ask as pop-ups, one at a time):
1. Layouts that never print dish notes or the cue (truck, chalkboard, lab, some canteen, stadium, banquet faces). Most of the remaining flat scores come from this: the rework is in slots those layouts drop. Options: let those layouts print a short note line, or move the worst films to a layout that does.
2. Night of the Living Dead prints a colour poster on a black and white film.
3. Josh bought the domain "reeldinner" (TLD not confirmed) and thinks Reel Dinner will be the main name. No rename done. Point the domain at Netlify when he confirms.

Left to do, in order:
1. check-print-text on all 900 was running in chunks of 50 (/tmp/run-cpt.sh, log /tmp/cpt2.log; /tmp may be wiped). Chunks 00 to 04 passed apart from After Hours, fixed by reverting "Terminal Bar burger" to "Last Stop burger". Rerun from chunk 05 (films sorted by id, 50 a chunk) or all of it.
2. Review 21 was started and stopped to save usage (Josh, 12:20pm: keep usage back for the deploy). Not written. Run it later.
3. Deploy from the trimmed copy (top of this file).
Small items the re-score noted: Crocodile Dundee II prints snags, barra and pavlova twice (older fault); Hitch Keep This tag cut ("effort is"); Goonies Sloth note cut; Mickey Blue Eyes lot note cut; Silver Linings signature clipped; Top Gun doubled logo; Wall Street, Wish, Clerks III, Despicable Me 2 empty gaps; Great Mouse Detective, Proposal, Sword in the Stone posters as white blocks.

## 8 Nov, 1:25pm: deployed to Netlify

- Live on Netlify from 0741870 (deploy 6aefeab7). main now holds everything (wip/store-overhaul merged, same commit).
- GitHub Pages: account still can't run Actions or Pages builds (no runs start, even by hand, after Actions were set to "Allow all"). Josh to ask GitHub Support. Pages source is set to "GitHub Actions" with .github/workflows/pages.yml (publishes site files only); once Actions work, a push to main publishes.
- .netlify/state.json is not in git: recreate it in /tmp/deploy with the site id before running the connector command.

## 8 Nov, 1:50pm: domain

- reeldinner.com bought at VentraIP (auto-renew was off: remind Josh). Added in Netlify as primary domain, www as alias, external DNS.
- VentraIP DNS Hosting: A reeldinner.com 75.2.60.5, CNAME www movie-night-spinner.netlify.app, parking A records (103.42.108.46) deleted, NS left alone. Waiting on caches (about an hour) and then Netlify's automatic HTTPS. If it hasn't turned green: Netlify Domain management, Verify DNS configuration, Provision certificate.
- No rename to Reel Dinner done in the app yet; that's a brand change for Josh to lock first.

## 8 Nov, 2:10pm: Josh's three calls, rename, note lines

Josh's calls (8 Nov, 2pm): 1. layouts that dropped notes or the cue get them back; 2. Night of the Living Dead prints its photos in black and white; 3. rename to Reel Dinner, his badge logo (red marquee over a plate) used everywhere.
- reeldinner.com: DNS right, HTTPS live (checked 2:08pm), www redirects to the bare domain. Auto-renew at VentraIP was off: remind Josh.
- Rename: title, share tags, manifest, ICS PRODID, sw comment, canonical and og:url now https://reeldinner.com/. Icons, favicon (assets/app/favicon-48.png), share.jpg and assets/app/reel-dinner-logo*.webp all from Josh's badge. Badge sits in the top bar on desktop (.brand-badge, left, mirrors the mute button) and over the hero's top left on phones (.palace-badge, 820px and under).
- Hero sign: MOVIE NIGHT bulbs repainted as REEL DINNER on palace*.webp by scripts/reel-dinner-sign.py (works from the old palace.webp in git history: `git show 5c57e33:assets/hero/palace.webp > /tmp/palace-orig.webp`). Letter box matches the old lettering's perspective (Josh asked for it straightened, 1:58pm). The .blade overlay letters now read REEL DINNER too.
- NOTLD: flavour mono:true; libPhotoPass step 6 greys every photo on the card when flavour.mono is set (the Save PDF copy bakes CSS filters in already). Add mono:true to any other black and white film that should print the same way.
- Note lines: truck got one-line-note tiers before the no-note tiers, and a "Showtime:" cue line along the foot of the board. Lab: cue above the side column (outside data-side, which its fit pass rebuilds), the stamp gives way first. Banquet: cue under the courses on the back. Canteen and stadium already print notes and cue; chalkboard is truck's chalk board era.
- check-print-text: all 900 done (chunks 05 to 17 on 8 Nov afternoon, then every truck, lab and banquet film again after the note-line changes). Fixed on the way: Mickey Blue Eyes "La Trattoria" heading (92px, was 150px and ran under the Lesson one panel), Spider-Man 2 "&amp;middot;" in its header, banquet cue moved to the front under the toasts (the back was too full on Santa Clause 2 and Violent Night), lab cue is data-spare 4 so it gives way before a dish note (Mad Max 2).
- Pulp Fiction (Josh liked a Grok redraw of it, 2:32pm): its five lines are in (Bloody as hell, No bourbon on the $5 star, "The next best thing to a time machine", Ed Sullivan as host, the Holland and Paris fries line) and its Jack Rabbit Slim's sign, cut from Josh's Grok image, is assets/era/slims/slims-sign.webp (spec.sign and spec.motto on the slims format). Josh's view: AI images are fine as a source of copy and art, the menus stay HTML.
- Pushes from this session are refused (the Claude GitHub App has no access to the repo). Commits are local until access is fixed or Josh pushes.

## 8 Nov, 2:55pm: deployed (start here in the next chat)

- Live on reeldinner.com from 35316aa (deploy 6aefff03), HTTPS on, app.js?v=ab343b23.
- Next: Review 21 (not started; skipped this chat to keep usage down). Then the small items under "8 Nov, 12:30pm" (Crocodile Dundee II doubles, Hitch tag, Goonies note and so on).
- GitHub Pages still waiting on GitHub Support. When it works, the workflow publishes on a push to main; point reeldinner.com there only if Josh wants to leave Netlify.

## 8 Nov, 6pm: E.T. (Josh checked it on his iPhone)

- iPhone fix: Safari drew CSS-filtered photos inside the scaled card as a blurry zoomed corner (E.T.'s back still). libPhotoPass step 7: on iPhone and iPad, every filtered .fx-face photo is baked into a plain picture at 2x (pdfFiltered, the Save PDF baker) and the filter comes off. Affects every menu with tinted photos, not just E.T. Not yet tried on a real phone: ask Josh to recheck E.T. page 2.
- E.T. front: flavour stillStrip:true. Badges are now three film stills (stills 4 to 6) with the badge lines as captions, the pillow note sits in the right column, signed with the top line of the E.T. title logo. Josh wants all 56 campfire menus done the same way later, each placed a little differently so they don't all look alike. Kept to E.T. for now to save usage.
- Still open from the E.T. check: 121 of 124 editions print their older plain notes over the reworked film notes (522 notes). Josh hasn't picked the fix yet; "film notes win" was the recommendation.

## 11 Nov, 10:40am: caught up from live, doubled dishes, App Store plan (start here in the next chat)

- GitHub pushes work from Claude sessions again (11 Nov). main and app/ios-wrapper both sit at the commit that is live on reeldinner.com.
- Three commits from 9 to 11 Nov (privacy page, delete my online card, sync fix, request a movie form) never reached GitHub. Their app files were pulled back from the live site. Any change they made to scripts, tests or docs is lost. If a script looks out of step with app.js, that is why.
- Never copy index.html or privacy.html down from the live site again without cleaning them: Netlify strips data-netlify and netlify-honeypot from the form and injects a /.netlify/scripts/hud script tag. The source form tag must read `<form id="reqForm" name="movie-request" method="POST" action="/" data-netlify="true" netlify-honeypot="bot-field">`.
- Commit email: use jlaw8787@users.noreply.github.com (the session blocks commands that carry Josh's own address).
- Old edition notes: done and live. Every edition dish whose name matches a card dish prints the card's note.
- Doubled dishes on shared layouts: done and live (audit/dedupe-ops, 10 films, 14 dishes). Cause: fullMenu() adds every card dish whose name is not in the edition's five, so a card dish with a plainer name printed beside the cooked one. Fix: the card dish took the edition's name and note. Crocodile Dundee II's pavlova went the other way ("I am home pavlova"). edition-sync skips names under 8 characters, which is how "Pavlova" was missed.
- Next job (Josh picked it): the last five, all hand-built menus in formats.js: The Warriors (4 dishes), Ghostbusters (5), The Godfather (4), When Harry Met Sally (1), After Hours (1). Their specs map an edition dish ("k") to a printed name ("n"), so check what each menu prints and what the Prep sheet cooks before renaming anything. Ghostbusters looks worst: the card says slime dip, devilled eggs, meatball sub, s'mores and Ectoplasm slushie while the edition cooks green dip, wings, sesame chicken, a brownie pan and a citrus slush. List them with the snippet idea in audit/dedupe-ops (compare edition menu names against films.json S, M, W, K). Airplane!'s airline peanuts is a real extra dish, leave it.
- After that, Josh's open menu jobs: known glitches (Hitch tag, Goonies note, Mickey Blue Eyes note, Silver Linings signature, Top Gun doubled logo, empty gaps on Wall Street, Wish, Clerks III, Despicable Me 2, white poster blocks on Great Mouse Detective, Proposal, Sword in the Stone), the E.T. stills treatment for the other 55 campfire menus, Review 21.
- Ask Josh to check on his iPhone: Crocodile Dundee II shows snags, barra and pavlova once each, and one test movie request goes through.
- App Store: see docs/APP-STORE-PLAN.md, updated 11 Nov. Josh is holding off paying Apple until the first TestFlight build is close.

## 11 Nov, 11:30am: the last five mismatched menus fixed (start here in the next chat)

- Done with scripts/dedupe-handbuilt.cjs (one-off, safe to run twice), then build-data. Rule: the printed menu and the Prep sheet are the truth. Same food under two names takes the film's own name. A cooked dish the film's list never had is added to the front of its course. Nothing removed. Printed text on all five is unchanged.
- After Hours: edition and spec key "Terminal Bar burger" now "Last Stop burger".
- When Harry Met Sally: edition now holds what the check prints (fried pickles, chef salad, pastrami, apple pie, egg cream). The chef salad sits in the edition's starter slot because editions must be 2 starters, 1 main (poster-menus test); the menu still treats it as a main.
- The Godfather: recipes renamed to "Connie's wedding antipasto" and "Clemenza's cannoli" (edition, recipes2, spec key). Golden arancini and Blood orange Italian soda added to films.json.
- The Warriors: pretzel bites, street-cart corn, ice-cream sandwiches and cherry cola added to films.json.
- Ghostbusters: edition rebuilt as the five the Prep sheet cooks (slime dip, devilled eggs, meatball sub, s'mores, slushie) from recipes2. poster-menus test now expects "7 eggs".
- Left on purpose (Josh, 11 Nov: deploy as is): card dishes those menus never print. Warriors: crinkle fries, clam strips, knishes, steak heroes, toffee apples, chocolate malted. Godfather: orange and fennel salad, calamari, veal scaloppine, Chianti sangria. Harry Met Sally: potato knish. Cutting them is a separate job if Josh asks.
- Live on reeldinner.com from 21a3d30 (deploy 6af3bd3a), pushed to main. Not yet checked on a real phone.
- Next: Josh's open menu jobs listed under "11 Nov, 10:40am".

## 11 Nov: unprinted card dishes cut from three hand-built menus (branch fix21-dishes, not deployed)

- Josh asked for the card dishes left on purpose above to go. Cut from data/films.json, then build-data. Warriors: Coney Island crinkle fries, Boardwalk clam strips, Hot potato knishes, Late-night chopped steak heroes, Fairy floss and toffee apples, Chocolate malted. Godfather: Sicilian orange and fennel salad, Fried calamari, Straw-bottle Chianti sangria with oranges. Harry Met Sally: Potato knish.
- Kept: Louis' veal scaloppine. The Godfather's printed front prints it ("The Veal", Veal scaloppine 1.72, and "the veal" in the family dinner), so it was never an unprinted dish. It is still not on the phone menu, Prep sheet or picker, which read the formats.js groups. Josh to say if he wants it cooked.
- The phone menu, Director's cut picker, Prep sheet and shopping list never showed these dishes (they read formats.js groups and recipes2). What changes is dish-names.json and dish-notes.json, so the Candy bar search and seasonal shelves no longer find these films by the cut dishes.
- No recipes, recipes2, diet or edition entries named the cut dishes. audit/cards for the three films now list the current card dishes. poster-briefs.json and the sweep patches still name them; both are closed records the page never reads.
- Printed PDFs pixel identical before and after; phone menu and Prep sheet text identical.

## 11 Nov, noon: known menu glitches fixed (start here in the next chat)

Live on reeldinner.com from ab66182 (deploy 6af3cc50, app.js?v=8b7eb073), pushed to main (Josh, 11 Nov 11:51am: deploy). Before and after shots went to Josh in chat. Not yet checked on a real phone.
- Hitch: the Keep This tag read as cut off but was printing in full. Line is now "Results not guaranteed. Effort is." (film-flavour).
- The Goonies: Sloth's note printed `Sloth: "Ruth, Ruth`. Cause was in app.js, not the film: __fmtShort cut inside the quote and __fmtTrim kept the cut even though it freed no line. Now __fmtShort never cuts inside a quote, and __fmtTrim puts the full note back when a cut does not make the note shorter on the page. Applies to every layout that uses __fmtTrim.
- Mickey Blue Eyes: the Lot 1 sticker sat on the lot note. Note is 126px wide (was 140), sticker moved 8px right (formats.js template).
- Silver Linings Playbook: the last letter of the signature was clipped. Cafe signatures have 12px of room on the right now (all cafe menus).
- Top Gun: logo printed twice (on the poster and on the panel right under it). New per-film flavour `logoPanel:false` for bartab: the panel under a poster reads "Now showing, year". Only Top Gun has it. The other 32 bartab menus are unchanged.
- Wall Street: empty column beside the poster. New per-film flavour `sideStill` for bistro (a TMDB still path, or true for the third still): a still sits under the logo. Only Wall Street has it. The same column is empty on the other 27 bistro menus; Josh has not said whether to roll it out.
- Wish, Clerks III, Despicable Me 2 (cafe, all cafe menus with a poster): the venue name box no longer holds two lines of height for a one-line name; the side column shares its spare height between its blocks; a board column that ends short spreads the spare between its dishes (--xg, 12px a gap at most, set after the fit and the column balance).
- Posters: The Great Mouse Detective and The Proposal changed in tmdb-posters.js. Every official Proposal poster is on white, so that one is a closer crop, not a coloured one. The Sword in the Stone already printed a full colour poster, nothing changed.
- No TMDB key on this machine. Other posters for a film can be read from www.themoviedb.org/movie/<id>/images/posters through the proxy.
- Tests pass. Checked with sweep-shot on the 12 films.
- All 900 scanned before and after for shortened or hidden notes: 23 films changed, none hides a note. 21 print more of their notes in full (Toy Story, Toy Story 3, Mean Girls, Flubber, Con Air, Zoolander, Total Recall and others). Watchmen and Spy shorten different notes than before.
- Next, in order: the E.T. stills treatment for the other 55 campfire menus (see "8 Nov, 6pm"; The Proposal is one of them), then Review 21. Open question for Josh: put a still in the empty bistro column on the other 27 bistro menus, as on Wall Street?

## 11 Nov, 1:40pm: E.T. still strip on all 56 campfire menus (start here in the next chat)

Live on reeldinner.com from f4f4e23 (deploy 6af3e9bc, Josh, 11 Nov: deploy now), pushed to main. Not yet checked on a real phone.
- Every campfire menu now has E.T.'s front: three film stills with the badge lines as captions, the pillow note beside the poster, signed with the film's logo. E.T. itself prints pixel for pixel the same.
- Four strip styles so they don't all look alike (menu-formats/campfire.js stillStrip()): row (E.T.'s), stagger (taped photos, paper tag captions), film (dark film strip with sprocket holes), album (instant photos, caption written in the white margin). About 14 films each.
- data/film-flavour.json stillStrip is true (E.T.) or {v, s, flip, sig}: v the style, s the three still numbers (never still 1, it prints on the back), flip swaps the pillow note and the Now showing ticket, sig "full" signs with the whole logo and "name" with the handwritten name. Set by scripts/campfire-strips.cjs, which now leaves films already set alone.
- Hand picks: sig "name" for Encino Man, Tropic Thunder, The Parent Trap, Role Models, Jumanji: Welcome to the Jungle, Wet Hot American Summer (their logos print as a black block). sig "full" for Brother Bear, The Empire Strikes Back, Night of the Living Dead, Sleeping Beauty, Honey, I Shrunk the Kids (the top line crop cut them). Peter Pan stills 2, 4, 7 (still 6 is a washed out frame).
- Beneath Hill 60 and Seabiscuit have only 3 stills, so they get a two photo strip. The Lighthorsemen uses stills 0, 2, 3.
- Tests pass, check-print-text passes on all 56, all 56 fronts looked over in shots.
- Eerie tone strip heading ("Stay with the group for", written for the old badge list) replaced per film in film-flavour labels.b (Josh, 11 Nov): The Jungle Book "Learned from the pack", Star Wars: The Last Jedi "Lessons on Ahch-To", Friday the 13th "Last seen at Crystal Lake". Avatar already had its own. Live from 32e9f4f (deploy 6af3eaba).
- Next: Review 21. 

## 11 Nov, 2:40pm: side still and one liner on all 28 bistro menus (start here in the next chat)

Live on reeldinner.com from 7ea6747 (deploy 6af3ef19, Josh, 11 Nov: deploy now). Not yet checked on a real phone.
- Josh, 11 Nov: every bistro menu gets a still in the empty column under the logo (as Wall Street had) plus a short line under it. New per-film flavour sideLine (menu-formats/bistro.js, printed under the still, italic, two lines at most). sideStill now holds a hand-picked TMDB path on all 28: scene or place stills, never still 1 (the menu prints it elsewhere).
- Lines are Claude's, not film quotes, and none repeat the From the house note. Kids mode runs them through dry().
- The Princess and the Frog's still prints black and white because the menu is 1920s; that is the era look, not a fault.
- Tests pass, check-print-text passes on all 28, all 28 looked over in shots.
- Next: Review 21.

## 11 Nov, 4pm: Review 21 written (start here in the next chat)

- docs/review-21.md, scored 9.1 (review 20 was 9.2). Screenshots review-21-01.png to 18. Tested at 7cb7451.
- Review 20's shadow, stripe and kids' items are fixed. Still open from it: canteen voucher, Time Bandits' frame rule, and Ratatouille's stray shadow (now a white bar at the bottom, also on Ghostbusters and When Harry Met Sally).
- New: After Hours' TERMINAL BAR logo wraps behind "BAR AND GRILL" (since 7e8598f3); the request button breaks Galaxy Video's phone tool row and covers two aisle signs (check-store-taps fails, since 919fd90f); campfire captions often don't match their stills; campfire page 1 takes its A4 margin from the strip photos; Ferris and Hitch side lines get the film wrong; Luca and Kingsman side lines repeat a dish note.
- check-browser fails kids' mode on Bugsy's "scotch fillet" (false positive).
- Next: Josh picks from the review 21 fix list.

## 11 Nov, 5:50pm: iPhone photo hotfix live
- Live on reeldinner.com from hotfix-iphone 0a84e903 (7cb7451 plus the iosBakeFilters change only; deploy 6af41d1b, app.js?v=2e8495c0). The rest of today's work is on main, not live.
- iPhone Safari drew cropped stills (Logan's strip and hero) as blurry zoomed corners. Every cropped photo on a card is now baked to its frame on iPhone, the CORS copy is fetched fresh (?cors=1), and if baking fails the filter comes off. Josh checked on his iPhone, 11 Nov 5:49pm: photos sharp now.
- 6:45pm: second hotfix live (deploy 6af42932, from hotfix-iphone). Real cause of the zoomed photos found in WebKit (Playwright webkit, iPhone 15 profile, spin path on Role Models): the shared __fmtLift.trim in airline, cafe, bistro, campfire and motel sampled photos before Safari had decoded them, read the blank sample as black bars and blew the photo up to its middle. Trim now waits for a decoded picture and never crops over half; the iPhone bake waits for the trim and frees its canvases. __fmtLift is now v:3.

## 11 Nov, 7pm: end of the Review 21 chat (start here in the next chat)

Live on reeldinner.com: deploy 6af42932 from branch hotfix-iphone (7cb7451 plus the two iPhone photo fixes only). Josh checked on his iPhone: photos fine now.

### Open fault Josh just saw (fix first)
- E.T. campfire front on iPhone: the signature under "Left on your pillow" prints as a solid black box (the top line of the E.T. title logo). Likely cause, not yet proved: pdfFiltered's no-canvas-filter path (older iPhone Safari) darkens by filling the whole rectangle with black for brightness(<1), so the logo's see-through parts go black. Fix: draw those fills with globalCompositeOperation "source-atop" (same for the saturation wash), then check in Playwright WebKit with the iPhone 15 profile and on Josh's phone. Other films signed with the logo (sig "full") likely have it too.

### On main, reviewed and passed, not live
Review 21 fixes 2, 3, 5, 8 and the Nativity swipe view and drink note; support page and store listing (docs/STORE-LISTING.md); privacy page fixes; docs/ARTWORK-RIGHTS.md (fact-checked); unprinted card dishes cut (Warriors, Godfather, Harry Met Sally); canteen still under a narrowed poster (not yet reviewed); the iPhone photo fixes.
### On main, redone after review, re-review was lost in a session restart
Fix 1 request line on desktop, Ferris line "Lunch, then the Cubs, then the art.", TERMINAL BAR word gap, check-browser reload settle. Re-review these before deploying.

### Branches with finished work waiting for review (not merged)
- fix21-voucher 81270ad5: canteen voucher turns with its card on paper (pdfTurnLike). Author checked 6 canteen and 10 other films.
- fix21-captions cc044511: all 56 campfire captions match their stills. Side effects: about 17 snack combo names change, about 25 old lines dropped.
- fix21-offline 9954bbf5: offline mode (every film, layout and dish list saved after first visit, plain frame for unsaved photos, calm offline notes).

### Branches stopped part way by the restart (WIP commits, not reviewed)
- fix21-posters: 124 original type posters replacing the AI posters that copy title logos, plus removing the McDowell's CinemaBlend frame.
- fix21-fonts: Google Fonts and the cdnjs PDF libraries moved to local files (assets/fonts about 23 MB so far).
- fix21-app: Capacitor app groundwork and app mode with no studio artwork.
- fix21-marquee: front page marquee rebuilt from the original Commons photo (bulbs, slat joins, wording in the rows).
- fix21-checks 275bd561: three unrun checks (phone fit, PDF tone, Prep A4) with harness tweaks; findings not written up.
- The 900-film print sweep produced no findings file before it stopped.

### Machine notes
- Chrome here sends local http through the proxy unless launched with '--proxy-server=https=127.0.0.1:<port>' (no bypass works). Use that flag in every harness.
- Never run more than two browser jobs at once. Twelve parallel helpers overloaded the machine and the session restarted, killing all of them.
- Playwright WebKit with devices['iPhone 15'] reproduces iPhone Safari faults; it found the photo trim bug.
- Deploy: the trimmed copy (git archive, then remove audit docs sweep wip tests scripts .github .netlify, and now android ios package.json package-lock.json capacitor.config.json) via the Netlify MCP deploy command run inside that copy. Get a fresh proxy token each time.

### Josh's wishes queued
1. Instagram Reel: smooth video of a spin landing on Jurassic Park (1993), menu, lock in, marquee showing the film. No sound (he adds music in Instagram). Use the virtual-time frame capture in /home/claude/ig/rec3.cjs approach (Emulation.setVirtualTimePolicy, 30 fps), not Playwright recordVideo, which stutters. Rig the spin with window.spinPool=()=>[FILMS.find(x=>x.id==="Jurassic Park (1993)")].
2. A 3D video of the printed menu lifting off the page, turning 360 degrees and showing its folds.

## 11 Nov, 9pm: Review 22 chat, everything merged on main (start here in the next chat)

Not live yet: live is still deploy 6af42932 (hotfix-iphone). Main holds all of the below. GitHub push was refused from this session (Claude GitHub App not linked to the repo), so check origin/main is up to date before starting; if not, the work only exists if it was pushed later.

### Merged on main, each reviewed by a separate reviewer
- iPhone signature black box (E.T. and every campfire film signed with a logo): pdfFiltered's no-canvas-filter path darkened the whole rectangle. Darkening now draws source-atop, the saturation wash is cut back to the picture's outline. Proved in Playwright WebKit (iPhone 15 profile, no canvas filters there): all 50 logo-signed films bake as lettering only. Harness: /home/claude/harness/sig.cjs (gone with the session; easy to rebuild).
- Round 2 fixes re-reviewed and passed: request line on desktop, Ferris line, TERMINAL BAR, check-browser reload (3 clean runs).
- fix21-voucher: canteen voucher turns with its card on paper; also fixed Man of Steel, A Bronx Tale, Monsters University.
- fix21-captions plus four review rounds: all 56 captions match their stills; the 5 repeats, 4 near-repeats and about 20 repeats carried from main cleared; dropped lines restored to the back where they do not repeat (some do not fit and are dropped by the back's fit); film combo names back (Gallipoli "The race against a horse", Empire "The asteroid field chase", Wet Hot "The white water rafting trip" are new).
- fix21-offline plus follow-ups: storage-full safety, 600 photo cap enforced on start and activate (TMDB photos trimmed first), export libraries warmed so Save PDF works offline on first use, sync goes up when back online. First visit downloads about 5 MB and about 1000 requests in the background.
- fin-posters: 124 original type posters (scripts/make-type-posters.cjs) replace the AI posters; McDowell's CinemaBlend frame replaced by a drawn sign; ARTWORK-RIGHTS.md has a dated note.
- fin-marquee: palace hero rebuilt from the Commons photo; title 90px, colon split preferred.

### Still open
- ARTWORK_ROLLOUT.md lines 8 and 25 still ask for recognisable film typography; contradicts the posters change.
- Two faint marks in palace.webp, darkest right column near the bottom rail (barely visible on desktop).
- Branches not touched this session: fix21-fonts, fix21-app, fix21-checks, the 900-film print sweep.
- Next job (Josh, 11 Nov): dish notes sweep. About 240 notes across the 900 say where a dish is from instead of what is in it, often echoing the dish name (Con Air jerky "Lerner Airfield in the desert", cheeseburger "the stop at the abandoned airfield"). Rewrite the weak ones to describe the food, keep the ones that work, with a separate reviewer.
- Josh's queued wishes (Instagram Reel, 3D menu video) unchanged.
- Tests at ce1978d0: all 19 tests, check-browser (16), check-store-taps, check-print-text on all 900 (six chunks of 150), WebKit iPhone signature check: all pass.

## 12 Nov, 8:45am: Review 23 chat, everything merged on main (start here in the next chat)

Live: deploy 6af4fc29 (main df81c41a), 12 Nov 9am, files checked against the live site. GitHub push is still refused from these sessions (Claude GitHub App not linked), so origin/main on GitHub is behind: push main from a session that can.

### Merged on main, each reviewed by a separate reviewer
- Campfire signatures (Josh's iPhone: E.T. lettering clipped at the bottom): stillStrip.sh is a per-film crop height. E.T. sh 60, Evil Dead II sh 58, IT and The Last Jedi sign with the full logo. scripts/sig-crops.py checks every logo-signed strip film. WebKit iPhone check: all 50 bake as lettering, none opaque.
- Dish notes sweep: 1504 notes that said where a dish was from now describe the food from its recipe, most with a short film nod (Josh's call), 3 kept. Three review rounds. Same wording copied into the 249 matching poster-edition dishes in movie-menus.js. Full log with old and new text: audit/dish-notes-sweep-2026-11-12.json.
- ARTWORK_ROLLOUT.md lines 8 and 25 match the type posters (no recognisable film typography or imitated logos). Still stale, not touched: line 35 "All generated artwork is original film-inspired artwork".
- palace.webp: the two faint marks cleaned (scripts/palace-marks.py, one-off).
- Hero sign (Josh's iPhone, 8:26am): bulb rail carried across the gap between the crest and the right scroll, REEL DINNER letters redrawn as separate bulbs (scripts/palace-sign-fix.py, works on the current palace.webp). The earlier marquee commit e7f0a5bc was marked WIP, not reviewed.

### Tests on main (before the hero sign merge, which only changed the three hero images)
All 19 tests, check-browser (3 clean runs), check-store-taps, check-print-text on all 900 (six chunks of 150; one flake on The Avengers "We deliver" footer when two chunks ran at once, passed 3 of 3 alone and on the chunk rerun), sig-crops, WebKit signature check: all pass.
- Josh, 12 Nov 10:11am: the Instagram Reel (spin landing on Jurassic Park) and the 3D menu video were made in separate chats and are complete. Drop both from the queued wishes.
- GitHub: the Claude GitHub App permissions were accepted 12 Nov 10:10am (all repositories); pushes from these sessions work. GitHub Pages still isn't building (last run 25 Oct); the site is on Netlify, so this only matters if Josh leaves Netlify.

### Next (Josh, 12 Nov): the old branches, in this order
1. fix21-checks (4 commits, harness tweaks for check-phone-fit, check-pdf-tone, check-prep-a4): separate reviewer, merge, then run the three checks on all 900 and report findings.
2. fix21-fonts (WIP, never reviewed, 955 files, about 23 MB of local fonts plus local PDF libraries): report the first-visit download cost and options (for example only the fonts each menu uses) before finishing it.
3. fix21-app (WIP, never reviewed, Capacitor app groundwork and app mode): ask Josh before starting.

## 12 Nov, ten new shared layouts (branch wip/new-formats, not live)

- Josh asked for more menu layouts. Ten new files in menu-formats/: foodcourt (mall tray liner), bowling (score sheet), clubhouse (golf scorecard), reception (wedding table), skilodge (lodge menu and lift ticket), arcade (prize counter, prices in tickets), drivein (carhop tray card), deli (letter board, take a number, stacking chart from the first main's shopping list), dimsum (yum cha tick sheet), hospital (patient meal order card). All 1344x960, one face, four looks by era, poster whole as the hero, real images only.
- Built from /tmp sources by a small assembler (shared helpers from truck.js plus a kit: film(), fit(), course(), prices()). The files in menu-formats/ are self-contained; edit them directly from here on.
- Pilot films moved onto them in data/film-format.json, side branch only, for proofs: Mallrats, Fast Times, Jingle All the Way (foodcourt); Kingpin, Dazed and Confused (bowling); Caddyshack, Happy Gilmore (clubhouse); Four Weddings, The Wedding Singer, Wedding Crashers (reception); Hot Tub Time Machine, Better Off Dead (skilodge); Wreck-It Ralph, Snatch (arcade); Grease, Ghostbusters: Afterlife (drivein); Rumble in the Bronx (deli); Rush Hour, Men in Black 3 (dimsum); Halloween II, A Nightmare on Elm Street 3 (hospital).
- Kingpin, Dazed and Rumble in the Bronx are layout tests only: their flavour venues (Ishmael's Barn, The Emporium, Uncle Bill's Supermarket) do not match bowling or deli. Before going live, each film moved onto a new layout needs its venue and sign checked against the film (fact audit rules).
- Checks: check-print-text passes on all 21 pilots at their own era and with every pilot forced to 1950s, 1970s and modern; all tests pass; check-browser passes. KIT_SIGN in app.js has the ten new ids. fetch-fonts run (all 448 specs local).
- Waiting on Josh: approve the looks, then pick which films move to each layout.
- 12 Nov afternoon, Josh's swap calls via pop-ups: moved Goldfinger to clubhouse (venue Royal St. Marks Golf Club), Better Off Dead to skilodge (K-12 Ski Lodge), Bad Santa to foodcourt (Phoenix Mall Food Court), Top End Wedding to reception (Top End Wedding Reception), Dazed and Confused to arcade (The Emporium). Kept: Grease (diner), Kung Fu Panda 2 (takeaway), Dumb and Dumber (truck), Iron Man 2 (stadium). Better Off Dead, Grease and Rumble in the Bronx were taken back off their pilot layouts first.
- Tracking sheet: "Reel Dinner film layouts" (Claude Sheets artifact https://claude.ai/artifact/CUZSJL6Gy92dKmd2DTNxz4). Films tab: live layout, side branch layout, Recommended and Status dropdowns, venue, notes. Layouts tab counts by COUNTIF. Keep it in step with data/film-format.json.
- Next job (Josh picked it): check all 810 shared-layout films against all 40 layouts for better fits. Only suggest a move when the film's own venue or a key scene fits the new layout; a move that needs a new venue line must stay true to the film. Bring them to Josh as pop-ups, one at a time, with a recommendation on each. Apply approved ones on wip/new-formats, print-check them, and update the sheet.

## 12 Nov, 4pm: layout fit check on all 810 shared films (branch wip/new-formats, not live)

- Checked all 810 for a better layout, only where the film's own venue or a key scene fits. 15 put to Josh by pop-up.
- Moved (Josh approved): The Naked Gun to stadium, Reservoir Dogs to diner, Jurassic World to foodcourt, Father of the Bride to reception (Banks Home Reception), My Big Fat Greek Wedding to reception (Portokalos Wedding Reception), Terminator 2 to hospital (Pescadero State Hospital), Stand by Me to campfire (Camp by the Tracks, Labor Day weekend 1959; strip film 4,5,6), Rain Man to hospital, Kingsman to pub (The Black Prince, bistro side still/line removed), Forgetting Sarah Marshall to tiki (Turtle Bay Resort Bar), Ticket to Paradise to reception (Lily and Gede's Wedding), Toy Story to arcade.
- Kept: Mamma Mia! (bistro), Muriel's Wedding (cafe).
- Toy Story (Josh: make Pizza Planet stand out and tie into the film): new per-film flavour "arcade" in arcade.js: space (starfield, ringed planet beside the venue and on the tokens), counter, redeem, sections[4], tokens, insert, shelf, still {i, title} (a real TMDB film still replaces the high score table; the drawn claw machine was tried first and Josh rejected it). Nothing copies the Pizza Planet logo or draws the aliens. SVGs are CSS background data URLs: html2canvas drops inline <svg> and <img> data URLs in the Save PDF copy.
- Hospital fix for every hospital film: the wristband printed the prop title as the patient ("PATIENT: U.S. MARSHAL", "FBI TRAINEE", "MEAL TICKET"). New flavour "patient": Rachel Solando (Shutter Island, no spoiler), Laura Weaver, Raymond Babbitt, Sarah Connor, Hannibal Lecter, Kristen Parker, Laurie Strode. Sign's trailing full stop no longer doubles before ". Meal order".
- scripts/campfire-strips.cjs reset E.T.'s hand-set strip (sh 60) to true; restored and the script now skips E.T.
- Checks: check-print-text passes on the 12 moved films and all 7 hospital films; all tests pass; fronts looked over in shots.
- Tracking sheet updated for all 12 (side branch, recommended, status, venue) and Wall-E (Own menu, Approved).

### Standing rule (Josh, 12 Nov 3:21pm), locked
Every new or custom menu gets the movie poster and real TMDB stills treatment. No drawn stand-ins for scenes or props (the SVG claw machine on Toy Story was rejected as janky and replaced by a still). Drawn decoration (stars, rules, planet glyph) is fine only as trim, never in place of a picture.

### Next chat: Wall-E custom layout (start here)
- Josh will give a TMDB API key in that chat. Use it to pull Wall-E's full backdrops/stills set (and Toy Story's, to look for a Pizza Planet frame to swap in for still 2).
- Build a one-off layout for Wall-E (currently airline, venue Axiom Food Court) built around the poster and real stills, per the rule above. Then print-check, shots, sheet row, deploy only when Josh says.

## 12 Nov, 4:10pm: Wall-E own menu and Toy Story Pizza Planet still (branch wip/new-formats, not live)

- Toy Story arcade: still 2 is now the Pizza Planet night exterior with the rocket (/dMcle4LNLkFAd8XWamn1eAKn5h2.jpg), set through data/still-pick.json (Toy Story's 8 stills with slot 2 swapped). Label "Parked out front" (was "Falling with style"). Josh asked for the exterior over the claw machine frame (/xUU287dd4KIeFlZAqI2gGIdRS9v.jpg).
- Wall-E has its own menu: fmtAxiom in formats.js (generated formats/axiom.js), spec in FMT_FILMS. Axiom Food Court, one 1344x960 face: the Axiom in deep space as the wall (still 44 of the TMDB set), poster in a white Axiom bezel, his cockroach still, the Axiom Pass card with McCrea's line, the menu panel (Today's finds, Sweet, In a cup, Grown on Earth) with the Hello, Dolly! still beside the showtime cue, and three stills down the right (Eve and Wall-E on the Axiom, the plant in the boot, Define dancing). No prices: meals come with the Axiom Pass. Nothing drawn in place of a picture.
- Wall-E taken out of data/film-format.json (no other own menu is listed there). Veg pair for the cob loaf line added to data/diet/wall-e-2008.json.
- Fonts reuse specs already shipped (Michroma, Nunito 0,400;0,700;0,800;1,400;1,700, Caveat 500), so no new font files. Running fetch-fonts without --check re-downloads and renames about 17 unrelated files because Google now serves different bytes; avoid it unless a new spec is needed.
- Checks: check-print-text passes on Wall-E and Toy Story, all tests pass, both fronts looked over in shots. Not yet checked in WebKit iPhone or on a real phone.
- Next: Josh to look over the Wall-E proof, then deploy only when he says.

## 12 Nov, 4:40pm: Toy Story review 24 fixes (branch wip/new-formats, not live)

- Independent review of Toy Story's arcade menu: 7.5 out of 10. Josh picked fixes 1 to 9 (10, prep sheet missing the knots and grilled cheese, is by design: cook 5).
- Done through card-ops (audit/ops/toy-story-1995-review-24*.json): grilled cheese and garlic knots lines describe the food; house lines (mozzarella sticks, cherry slushie) describe the food; "Space-themed pizza" renamed "Moon crater pepperoni pizza" everywhere; quote under the still is the aliens' "The claw chooses who will go and who will stay."; cue "Serve the pizza when Woody and Buzz hitch a ride on the Pizza Planet truck."; counter label "TO INFINITY AND BEYOND!" (was a second "Out of this world").
- arcade.js: flavour arcade.logoDark keeps the logo on the dark panel (the sampler read Toy Story's logo as dark and put it on light grey). A column holding one course now spreads its dishes down the board (headings stay with their dishes), so a long first course no longer leaves a gap. Checked on all four arcade films.
- Warning: scripts/edition-sync.cjs replays old audit ops and broke After Hours (burger renamed) and Oliver & Company (note repeated three times). Reverted. Only run it when the film has a poster edition, and check the movie-menus.js diff after.
- Checks: check-print-text passes on all four arcade films, all tests pass.

## 12 Nov, 5:10pm: Toy Story re-review (8.5) fixes (branch wip/new-formats, not live)

- Re-grade after the first fixes: 8.5. Josh: do all remaining.
- arcade.js: the column spread from 4:40pm is taken back out (the reviewer read it as stretched; Wreck-It Ralph and Snatch are back to before). New flavour arcade.panel {head, text, by}: a quote card at the foot of the shorter column. New arcade.noLogo drops the marquee logo panel (the poster carries the logo).
- Toy Story: panel "Pull the string", "Reach for the sky!", Woody; noLogo; full claw line "The claw is our master. The claw chooses who will go and who will stay."; house notes lose their full stops to match the other lines; "Moving day grilled cheese and tomato soup" renamed "Moving day toastie and tomato soup"; vegetarian pizza alt renamed too (card-ops replaces whole-string matches first, so "Space-themed pizza (vegetarian)" was missed the first time; check alt names after a rename).
- Checks: check-print-text passes on all four arcade films, all tests pass.
- 5:20pm: Josh asked for a Pizza Planet logo, box, rocket or truck. Not drawn (Pixar's design, and the real-stills rule), so the left column card now holds the real claw machine still (/xUU287dd4KIeFlZAqI2gGIdRS9v.jpg, label THE CLAW) instead of the Woody quote. arcade.panel.img takes a TMDB path, with h and pos; keep text off, the board clips a caption.
- 5:35pm: re-grade 9/10. Last fixes (Josh: all three): arcade.noLogo now prints the film title and year on the right of the marquee; new arcade.quote {text, by} prints a line in the cabinet above the coin slot (Toy Story: "Reach for the sky!" Woody); punch line drops "on sticks", top shelf wink is "The Claw and the aliens". Checks pass on all four arcade films, all tests pass.
## 12 Nov, afternoon: old branches done, fonts live (start here in the next chat)

Live: deploy 6af53819 (main c6c9c600), 12 Nov afternoon. Live files checked against the deploy copy (index.html differs only by Netlify's form and toolbar edits). Live phone check: Kung Fu Panda, Die Hard 2, E.T., Tombstone, Save PDF libraries load, no errors, only outside host is image.tmdb.org. GitHub push works from these sessions; main is pushed.

### Merged on main, each reviewed by a separate reviewer
- fix21-checks (two review rounds): scaled tone runs (MNS_TONE_SCALE other than 2.5) end with exit 2, not a sign-off; bad MNS_SHARD or a mistyped film fails; skipped films are listed and give exit 2; per-film and per-batch timeouts; tone check reopens a crashed page; proxy host parsed with new URL.
- fix21-checks-tdz: start-up wait (appReady) waits 60 s, reloads once, logs page errors. Same old wait still in check-browser, audit-extract, check-prices, check-print-text, check-kids-cards, check-cut-words (not changed yet).
- fix21-fonts (two review rounds): every font local in assets/fonts (scripts/fetch-fonts.cjs, 448 specs, 288 families, 905 files, about 20 MB on Netlify, visitors only download what a menu uses; first visit about 21 KB more than Google, for fonts.js). Save PDF libraries in assets/lib. No Google Fonts or cdnjs calls. CJK families (LXGW WenKai TC, Noto Serif TC) get a face holding only the characters the menus print; fetch-fonts --check fails a CJK family with Latin only. sw.js keeps fonts in mns-static and drops files no longer in assets/fonts/files.json on update. Rerun scripts/sweep-font-queries.cjs then fetch-fonts after adding a menu that picks fonts from data. Not done: LOOK arrays (unused airline and bistro looks) in the sweep's collect(); scripts/brand/*.html and make-type-posters.cjs still use Google (offline tools).

### Findings, all 900 (main a53ff40f, before fonts)
- Phone fit 900/900 pass. Prep A4 900/900 pass (1738 pages at 4 guests).
- PDF tone 885/900. 13 false alarms on hand-built cards (Goodfellas, The Untouchables, Big Night, Ratatouille, Kung Fu Panda, My Cousin Vinny, Ghostbusters, When Harry Met Sally, Big Trouble in Little China, Back to the Future, The Big Lebowski, Home Alone, Friday): the check compares the dark page round the card with white paper round the print. Card only, Home Alone is 0.2 levels; Back to the Future 7.0 (borderline). Fix the check to measure the card only.
- Real: Sixteen Candles and The Wedding Singer (invite) print about 9 levels darker and 12 to 14% flatter than the screen; the pearl paper sheen comes out greyer. Kill Bill Vol. 2 (invite) passes. Fix next.
- On the fonts branch before merge: 19 tests, check-browser, store taps, phone fit 900/900, print text 900/900 (six chunks of 150) all pass.

### fix21-app: assessed, not merged (Josh chose assess first)
App mode (?app=1) shows no film artwork and made zero TMDB requests across 7 films and the shop; website unchanged with it off. Before merging: 3 tests fail (week, poster-menus, shopping: no window or REEL stub in the test harness); REEL used unguarded at calendar, share list, Save image, share link (app.js ~2178, 2237, 3551, 3756); stamps not rebuilt (app-mode.js?v=0); app mode misses assets/hero/latedoor.webp and shopfront*.webp (poster lookalikes); YouTube trailers still play in app mode (Josh to decide); docs/APP-BUILD.md never written; Android needs POST_NOTIFICATIONS and SCHEDULE_EXACT_ALARM; service worker should be skipped in app mode. Then Android debug build (works on Linux), iPhone needs a cloud Mac with Xcode plus Apple Developer (US$99) and Play Console (US$25). Size medium; main risk Apple guideline 4.2.

### Machine notes (new)
- Run long checks from their own worktree (git worktree add --detach /tmp/wt-run <commit>), never the folder you are editing. Switching branches mid-run tested the wrong code this session.
- check-print-text on all 900 in one page gives no progress and risks memory; run six chunks of 150 by name.
- tests/dialogs.test.cjs opens a browser: count it against the two-browser limit.

### Next (suggested)
1. Fix Sixteen Candles and The Wedding Singer print tone, and make the tone check measure the card only.
2. fix21-app fixes listed above, if Josh wants to go ahead.

## 12 Nov, late afternoon: invite tone, card-only tone check, fix21-app merged (start here in the next chat)

Live: deploy 6af5443b (main 77061873), 12 Nov late afternoon, Josh said deploy. Live files match the deploy copy; live phone check (Sixteen Candles, Home Alone, Die Hard 2) no errors, only outside host image.tmdb.org. Each item below had a separate reviewer before merge.

### Merged on main
- fix21-invite-tone (19a690f): the 1980s pearl paper sheen and the gloss glare faded from white to CSS `transparent`, which html2canvas reads as clear black, so the sheen printed grey. Now fades to rgba(255,255,255,0). Sixteen Candles -10.1 to -1.5 levels, The Wedding Singer -0.2; all 28 invite films within about 2 levels. The same white-to-`transparent` pattern is in pub, prom, kiosk, home, campfire, diningcar, truck, newspaper and stadium; they pass the tone check today, left alone. The invite paper vignette (to rgba(70,50,20,a)) could use the same treatment, tiny effect.
- fix21-tone-card (c4edd74): check-pdf-tone measures the card only, cropping both images to inside the card's padding (the 26px surround on landscape .fmt cards: dark page on screen, white paper in print). fx-paper and portrait cards have no padding, so their numbers are unchanged. Still catches a real fault (old Sixteen Candles fails at -10.1). Rerun with MNS_NET=1: the 13 hand-built cards all pass (worst Friday -3.2, Goodfellas +2.0, Back to the Future +0.2), all 28 invites pass.
- fix21-app (313b401e, rebased on main): tests guarded (globalThis.REEL_APP, typeof REEL checks), stamps rebuilt, assets/app/latedoor-app.webp (shelves blurred) swapped in app mode, shopfront*.webp never copied into www/, no service worker in app mode, Android POST_NOTIFICATIONS and SCHEDULE_EXACT_ALARM, docs/APP-BUILD.md. All 19 tests, check-browser, dialogs pass. ?app=1 over 7 films and the shop: 0 TMDB requests, no poster photos; website unchanged.

### fix21-app reviewer's low items (not done)
1. Trailers may not play on iPhone (no referrer from capacitor://localhost, YouTube error 153); test on a device before Josh decides on trailers.
2. Calendar share cancelled on the phone still says "Calendar file saved"; blob URL made and never freed there.
3. Locking in a film asks for notification permission straight away (setWeek calls appRemind(true)); asking from the calendar button would be gentler.
4. After sharing a menu image natively it says "Saved. Check your Photos." even if shared to a chat.
5. SCHEDULE_EXACT_ALARM is off by default on Android 14+, so reminders are inexact there; APP-BUILD.md says "on the minute".
6. Phone reminders cover start cooking and showtime only, not day-before steps.
7. app-mode.js (about 30 KB) blocks first paint on the website; a small inline check that loads it only in app mode would remove that.
8. app-art.js loaded without ?v (only affects ?app=1 in a browser); iPhone Save PDF cancel reports "saved" even if the Documents copy failed.

### Next (suggested)
1. The low items above, then an Android debug build (needs JDK 21 and the Android SDK installed on this machine).

## 12 Nov, evening: fix21-app low items 2 to 8 merged (start here in the next chat)

Live: deploy 6af55461 (main 176899e), 12 Nov 3:50pm, Josh said deploy. Live phone check (home, Home Alone, Die Hard 2): switch present, app-mode.js not loaded, no errors, only outside host image.tmdb.org. Josh has no Android phone, so the APK is untested on a device; test on the first iPhone build. Each branch had a separate reviewer before merge. All 19 tests, check-browser and dialogs pass on merged main.

### Merged on main
- fix22-reminders (ef94249, 93a454f): the calendar share on the phone reports sent, not shared or could not be shared (the website still says "Calendar file saved"), and no blob address is made in the app. Locking in only moves reminders already allowed (saveWeek(true) in setWeek, one schedule per lock-in); until notifications are allowed it suggests Add to calendar, which asks. Phone reminders now cover make-ahead and prep-ahead steps (ids 4103 to 4105, same words as the .ics alarms). Android 12+ with Alarms and reminders off: plugin 8.3.1 opened that Settings screen on every exact schedule; app-mode.js now checks checkExactNotificationSetting first and schedules inexact (isExactNotification false), and the calendar dialog says how to turn it on. APP-BUILD.md corrected.
- fix22-boot (one commit plus 82a0b0f): index.html has a small inline `<script id="reel-boot">` switch; the website loads neither app-mode.js nor app-art.js (window.REEL undefined there, app.js already guards it). App mode (native, ?app=1, www/ build) loads app-art.js and app-mode.js, both ?v stamped. build-app.cjs puts REEL_APP_BUILD before the switch and fails if the switch is missing. Native menu image share says "Menu image shared." iPhone Save PDF cancel reports saved only if the Documents copy was written.

### Left from the reviewers (low, no action)
- When the calendar button moves a passed night to next week, reminders are scheduled twice (same ids, no doubles).
- If checkExactNotificationSetting itself throws, exact is assumed on.

### Still open
1. Trailers in app mode on iPhone (no referrer from capacitor://localhost, YouTube error 153). Josh to decide.
2. Android debug build: see below.

### Android debug build (12 Nov evening)
- Built from main 13260d0 and sent to Josh: com.reeldinner.app, API 24 to 36, 53 MB, debug signed. JDK 21 was already installed. Android SDK at /home/claude/android-sdk (platform 36, build-tools 36). This machine only, not in the repo.
- Gradle's first run failed with 429 from repo.maven.apache.org through the session proxy. Fixed on this machine with ~/.gradle/init.d/mirror.gradle, which points Maven Central at https://maven-central.storage-download.googleapis.com/maven2/. After that: npm install, build-data, build:app, cap sync, assembleDebug all clean (about 3 min the first time, 1 min after).

### Trailers in app mode
- Josh chose: test first, change nothing. Try trailers in the Android APK now, and on the first iPhone test build, then decide.

### Next (Josh, 12 Nov 4:15pm)
Review 24: a fresh independent review of the live site, written up like docs/review-21.md, then fix what it finds. iPhone build, store prep and the small tidy-ups are on hold.

## 12 Nov, 4:45pm: Wall-E and Toy Story live, new layouts still on the side branch (start here in the next chat)

Live: deploy 6af55cb9 from main 05dbb9a (Josh, 12 Nov: deploy Wall-E and Toy Story only). Files checked against reeldinner.com (index.html differs only by Netlify's form rewrite and HUD script). Not yet checked on a real phone.

### What is where
- main (05dbb9a, live): everything from the app chats plus Wall-E's own Axiom Food Court menu, Toy Story on the arcade layout (Pizza Planet), and all ten new layout files. Only Wall-E and Toy Story use the new work; every other film is on its old live layout and venue.
- wip/new-formats (81cdbfc plus this note): main merged in, plus the other 42 films moved onto new layouts. Do not merge it into main as it is: that would put the 42 live unchecked. To ship more films, repeat the deploy cut: branch from wip/new-formats, put film-format.json and film-flavour.json entries back to main's for every film not being shipped, build-data, tests, check-browser, print-check, then fast-forward main (see commit 05dbb9a for the script shape).
- deploy/wall-e-toy-story: the cut that became main. Can be deleted.
- Tracking sheet "Reel Dinner film layouts" (https://claude.ai/artifact/CUZSJL6Gy92dKmd2DTNxz4): Toy Story and Wall-E rows Approved, live layout set. The 42 others read "Moved on side branch".
- Toy Story grades: 7.5, 8.5, 9, then the last three fixes (not re-graded). Wall-E: Josh "pretty good", no formal review.

### The other 42 films on wip/new-formats: not ready, why
1. None approved in the sheet for live.
2. The ten new layouts have only had check-print-text, never an independent review. Toy Story's review found film lines printed where food should be, a logo on a grey box, uneven columns. Expect the same kind of faults on the others.
3. The 21 pilot films were moved for proofs. Their venue and sign were never checked against the film (fact audit rule). Kingpin was flagged a layout test only (venue now "Reno Tournament Lanes").
4. By layout: foodcourt Mallrats, Fast Times, Jingle All the Way, Bad Santa, Jurassic World, Wonder Woman 1984; bowling Kingpin; clubhouse Caddyshack, Happy Gilmore, Goldfinger; reception Four Weddings, The Wedding Singer, Wedding Crashers, Top End Wedding, Father of the Bride, My Big Fat Greek Wedding, Ticket to Paradise, Anyone But You, Doctor Strange in the Multiverse of Madness, My Best Friend's Wedding, Palm Springs, The Farewell; skilodge Hot Tub Time Machine, Better Off Dead; arcade Wreck-It Ralph, Snatch, Dazed and Confused; drivein Ghostbusters: Afterlife; dimsum Rush Hour, Men in Black 3; hospital Halloween II, A Nightmare on Elm Street 3, Terminator 2, Rain Man, Shutter Island, Smile, The Silence of the Lambs. Also moved to old layouts: The Naked Gun (stadium), Reservoir Dogs (diner), Stand by Me (campfire), Kingsman (pub), Forgetting Sarah Marshall (tiki). Deli wall board has no film on it.
5. Suggested order: one independent review per new layout on its best film (like Toy Story), fix, then a venue and sign fact check for each film, mark Approved in the sheet, then a deploy cut.

### Also queued (from the other chat on main)
- Review 24: fresh independent review of the live site (Josh, 12 Nov 4:15pm). Now it will include Wall-E and Toy Story.
- Trailers in app mode: test on the APK and the first iPhone build, then decide.

### Machine notes from this chat
- TMDB key: Josh gave it in chat; it is not in the repo. Put it in /home/claude/.tmdb_key on a new machine if needed (ask Josh).
- Do not run scripts/fetch-fonts.cjs without --check unless a new spec is needed: Google now serves different bytes and it renames about 17 unrelated font files. Reuse specs already shipped.
- Do not run scripts/edition-sync.cjs for a film without a poster edition: it replays old ops and broke After Hours and Oliver & Company (reverted).
- card-ops renames whole-string matches first; check alt names such as "(vegetarian)" after a rename.
- arcade.js now has flavour options logoDark, noLogo (title and year in the marquee), panel {head,text,by} or panel {img,head,h,pos}, quote {text,by}.

## 12 Nov, 6:30pm: review 25, the ten new layouts reviewed and fixed (branch wip/new-formats, not live; start here in the next chat)

- One independent reviewer per layout on one film, then one fixer per layout. Write-up and fix logs: docs/review-25.md. Scores before fixes: clubhouse (Caddyshack) 8, drivein (Ghostbusters: Afterlife) 8, foodcourt (Mallrats) 7.5, bowling (Kingpin) 7.5, reception (The Wedding Singer) 7.5, skilodge (Hot Tub Time Machine) 7.5, hospital (Halloween II) 7.5, deli (Rumble in the Bronx, layout test only) 7.4, arcade (Wreck-It Ralph) 7, dimsum (Rush Hour) 6.5. Not re-graded after fixes.
- Locked rules all ten layouts now follow: notes describe food; every note prints in full at one size (fit budgets note lines before gaps, no reliance on libUnclip); the short column spreads its own spare height, capped, and a real TMDB still fills any gap over about 100px; no logo on a box (a logo the poster beside already carries prints as title and year instead); props print under a label from prop.kind with their lines; fixed headings neutral or from flavour; winks shown (up to five) in a labelled box; prices: dearer dishes top of their course, house lines at the foot, no repeats in a course, dessert under mains (each layout has its own tidy pass after priceSense).
- Film text for the ten films through card-ops: audit/ops/<slug>-review-25.json. Kingpin's pot roast recipe added to data/recipes/kingpin-1996.json by hand. Rush Hour's poster edition synced from its ops only (edition-sync run, then every other edition put back; it would have broken After Hours and Oliver & Company again).
- Rumble in the Bronx was put on deli for the proof only and is back on truck. Its notes were fixed (they show on truck too). Deli still has no film.
- Toy Story (live on main) on this branch: house line prices now 110 and 60 tickets (were 190 and 100) from the price rule; nothing else changed against a before shot.
- Checks: check-print-text passes on all 40 films on the new layouts plus Rumble and Wall-E; all tests pass; check-browser passes.
- New layout options (flavour): reception {guest, table, seat, heading, tables[], noLogo, still, stillCaption}; bowling prop heading from prop.kind; see each file's header comment and docs/review-25.md for the rest.

### Shared code items found (not done, app.js)
1. libMenu cuts every venue note to 100 characters (libTrim) without a warning; any longer note loses its end on every layout. Raise the limit or flag it in check-print-text.
2. window.priceSense: its card-extra rule holds a dearer extra (lobster roll, surf and turf) under a plain cooked main and can repeat prices. The new layouts work round it; old layouts still rely on it.
3. Phone: the "Skip to the wheel" pill shows over the top of the menu card in the phone view (seen on dimsum, arcade, clubhouse).
4. Drive-in phone peek leaves the Showtime line blank (prints fine). Cause not found in drivein.js.
5. scripts/card-ops.cjs: a set op added to an ops file already marked applied is marked done without running (line 63). Take "applied" out of the file, or fix the line.
6. libUnclip may run before the web font loads (the fallback font wraps wider).

### Other films on the new layouts still carrying film lines in notes (next, with the venue and sign fact check)
Bad Santa, Jurassic World (foodcourt); Happy Gilmore, Goldfinger (clubhouse); Four Weddings, Doctor Strange (reception); Better Off Dead (skilodge; quote looks paraphrased, known line is "I want my two dollars!"); Snatch (arcade); Men in Black 3 (dimsum; trolley line signed "Agent J" is invented); Terminator 2, Shutter Island (hospital).

### Waiting on Josh
- Drive-in: done, Josh chose the 1950s look for Ghostbusters: Afterlife (era 1950s in film-format.json). Side effect: prices follow the era, so the card prints 1950s prices (.15 to .60).
- Hospital: done, Josh chose no prices on the patient meal card (no price column or leader, no "Prices subject to change" in the footer). All 7 hospital films print-checked.
- Then: venue and sign fact check and note clean-up for every film on the new layouts, mark Approved in the sheet, then a deploy cut.

## 12 Nov, 9:45pm: review 26 done, deploy cut on main (pushed, not deployed; start here in the next chat)

### What is where
- main (4459196e plus this note, pushed to GitHub, NOT deployed to Netlify): deploy cut. 29 films go live: reception 12 (Four Weddings, Wedding Singer, Wedding Crashers, Top End Wedding, Father of the Bride, Greek Wedding, Ticket to Paradise, Anyone But You, Doctor Strange MoM, My Best Friend's Wedding, Palm Springs, The Farewell), hospital 7 (Halloween II, Elm Street 3, T2, Rain Man, Shutter Island, Smile, Silence of the Lambs), clubhouse 3 (Caddyshack, Happy Gilmore, Goldfinger), bowling (Kingpin), drivein (Ghostbusters: Afterlife), plus Naked Gun (stadium), Reservoir Dogs (diner), Stand by Me (campfire), Kingsman (pub), Forgetting Sarah Marshall (tiki). Rumble in the Bronx fact fixes on truck (venue now Elaine's Supermarket).
- Held back (Josh: approve only layouts at 9.0): the 13 on foodcourt, skilodge, arcade, dimsum (Mallrats, Fast Times, Jingle, Bad Santa, Jurassic World, Wonder Woman 1984, Hot Tub, Better Off Dead, Wreck-It Ralph, Snatch, Dazed, Rush Hour, Men in Black 3). On main they are byte for byte as live (film data, recipes, stills, Rush Hour's edition in movie-menus.js); arcade.js on main is main's, so Toy Story is unchanged.
- wip/new-formats: all review 26 work on every film, including the held 13. Next cut for those: same script as the review 26 cut, minus the hold list.
- Pushed from this session. Deploy main to Netlify only when Josh says.
- Sheet "Reel Dinner film layouts": the 29 rows are Approved; Live layout column left until the deploy.

### Grades (independent, fresh reviewer each round; docs/review-26.md)
Round 1 / 2 / 3 / final: foodcourt 7.0/8.3/8.8/8.6, bowling 7.8/8.6/9.0, clubhouse 6.6/8.4/9.0, reception 7.6/8.5/9.0, skilodge 7.3/8.8/8.8/8.9, arcade 6.0/8.4/8.8/8.6, drivein 7.8/8.7/9.0, dimsum 7.3/8.6/8.7/8.6, hospital 7.6/8.4/8.9/9.0, deli 7.6/8.7/8.6/8.4 (no film on deli). Graders vary by about 0.3; late findings are polish.

### Josh's calls this chat
- Venues: Goldfinger "St. Mark's Golf Club" (film's name), Four Weddings "Angus and Laura's Wedding", Rumble "Elaine's Supermarket".
- Keep "TABLE 69" on Men in Black 3 (dimsum).
- The Prep sheet cooking five is his rule ("show all dishes, cook 5"); reviewers told so.

### Shared code items found (not done, app.js and friends)
1. Phone menu lists dishes in the film's raw order and stock course names; layouts now sort dearest first and some rename courses (Snacks, Hot Plates). Have the layout hand its order and labels back.
2. Prep sheet: the last recipe can sit alone on a mostly empty page.
3. Shopping list: aisle tags from recipe files are ignored for some items (cheese, sauerkraut under Dairy or Pantry); duplicate lines are not merged; salt loses its amount.
4. libNoteKind strips quote marks for any kind but "quote" (reception wanted kind "toast"; it uses a flavour flag instead).
5. Unticked extras with no recipe show "As written, serves 4" on the phone (Shutter Island, Smile, Rain Man, Silence of the Lambs).
6. Still open from review 25: libTrim cuts notes at 100 chars silently; priceSense holds uncooked extras under cooked mains; Skip to the wheel pill over the phone card; card-ops set ops on applied files.

### Polish left on the held layouts (from the last grades)
- foodcourt: "Main Street" and "Isla Nublar" repeat on Jurassic World; OVERHEARD AT TABLE NN heading fixed; dot leader stub on wrapped names.
- arcade: Snatch steak priced under the fry-up (priceSense); bet slip wording; neon arcade vs Turkish's fruit machine shop look.
- dimsum: Men in Black 3 is mostly diner food on a yum cha sheet; cook the shrimp and bok choy instead of the hot dogs; short quote box mostly empty.
- skilodge: gaps between courses look airy; TMDB credit inside the quote box.
- deli: house lines priced dearest in their course; counter note too big on the receipt.

### Machine notes (this chat)
- Chrome here must proxy only https (scripts now pass --proxy-server=https=...), or the local page gets a 405 from the proxy. sweep-shot.cjs now takes PLAYWRIGHT_MODULE, MNS_BROWSER and the proxy too.
- Env for the browser scripts: NODE_PATH=$(npm root -g) MNS_BROWSER=/usr/bin/google-chrome PLAYWRIGHT_MODULE=$(npm root -g)/@playwright/mcp/node_modules/playwright
- audit-extract skips films that already have a card file; use FORCE=1 to redo.
- Stills: data/still-pick.json wins over still-block; the card's still box takes the second pick (the first is used elsewhere), so put the wanted still second.

## 12 Nov, evening: The Big Lebowski own menu (branch fix24-lebowski, not live)

- Josh chose a full one-off rebuild. fmtStarLanes in formats.js (generated formats/starlanes.js), spec in FMT_FILMS. Hollywood Star Lanes, one 1344x960 face like Wall-E: navy sign with the name in Yellowtail and drawn Googie starbursts (trim only), lane-arrow strips, poster, and six real TMDB stills from the stored set in data/film-stills.json (Mark it zero, tai chi on the rug, league night at the bar, the Jesus, the Stranger, half-and-half at Ralphs on the showtime cue). Fonts reuse shipped specs (Yellowtail, Barlow Condensed, Libre Franklin), so no new font files.
- Nine dishes, each name the same on card, recipe and edition: Persian rug flatbread, Jesus Quintana's chorizo taquitos, Over the line gochujang wings, In-N-Out double-double animal style, Shomer shabbos coffee brisket on challah, Nihilist lingonberry Dutch baby, Larry's homework cookies, White Russian, The Stranger's sarsaparilla float. Recipes in data/recipes2 (vegetarian versions for the four meat dishes); the night cooks five (poster edition in movie-menus.js). The old "Drive-thru burger" over a chilli dog recipe is gone.
- Kids and No alcohol: the White Russian becomes the Little Dude vanilla malt (milk, vanilla ice cream, malted milk, nutmeg) on card, cue, phone and recipe, through data/diet text pairs.
- Table kit venue is now Hollywood Star Lanes. The fallback type poster was remade with make-type-posters for this film only. The old lanes renderer is kept but no film uses it.
- No TMDB key on this machine: stills are stored paths only.

## 12 Nov, night: Review 24 done, fixes and The Big Lebowski merged on main (start here in the next chat)

Live: deploy 6af591c0 (main cc6be7a2), 12 Nov night, Josh said deploy. Holds everything below plus the other chat's review 26 deploy cut (29 films), merged in 48d8a7db. Live files match the deploy copy; no Netlify badge script; live phone walk (Big Lebowski, Back to the Future, Kingpin) no errors, only outside host image.tmdb.org. Each branch had a separate reviewer before merge.

### Review 24
docs/review-24.md, 9.0 out of 10, screenshots review-24-01 to 18. All Review 23 fixes held. Josh chose to fix all 8 items.

### Done
- Item 1, Netlify badge: Josh turned off Project configuration, General, Powered by Netlify badge (12 Nov 5:23pm). Live HTML no longer carries the hud script. Not a repo change.
- fix24-print (3d4caf6): Back to the Future white bar (Lou's left column 43px too tall: poster 160x240, clock tower 100px), Goodfellas notepad shadow in a turned column trimmed, diner pages take their margin from their own paper, E.T. signature faint box gone, 1px blended edge trimmed on landscape PDFs, Galaxy Video photo signs 44px taps on the phone. New scripts/check-white-bar.cjs (91 of 91 clean, --rescan needs no browser).
- fix24-words (bf0427f, 8e74f57): kids' swap now reaches shopping lists and Copy text; plain beer and alcohol-free beer, lager, ale read ginger beer (was root beer), alcohol-free sparkling wine reads sparkling apple juice, non-alcoholic gin cucumber juice, margarita "lime crush", Rudy sticky onions; wine names swap to grape juice; check-kids-cards flags them and sommelier. Ratatouille (always alcohol-free) cellar now grape juice in every mode. 36 hand-built dish notes rewritten food first. Luca stew in fish stock. Shopping units: "1 bunch tarragon", "6 slices provolone" (377 lines).
- fix24-lebowski (337bf83, bff92f1): The Big Lebowski's own Hollywood Star Lanes menu (see the section above). Reviewer fixed the Stranger caption.

### Tests on merged main (48d8a7db, from /tmp/wt-final)
All 18 node tests, check-browser, dialogs, check-white-bar 91 of 91, check-kids-cards (343), check-print-text on the 21 review 26 films plus Lebowski, Goodfellas, Back to the Future: all pass. check-store-taps passed on bff92f1.

### Left, low (from the reviewers)
- Kids' shopping wording: The Castle "4 ginger beer of 375 ml", Blade Runner "4 ginger beer (375ml)", Shaun "1 L ginger beer" twice, Mean Streets "Ginger & ginger", Old School "alcohol free ginger beer", Fantastic Beasts "cucumber juice, for the grown-ups".
- About 145 hand-built Copy-text notes (never printed) still say where the dish is in the film; other shared house notes untouched.
- Phone store focus ring now draws round the bigger tap area. Diner PDF page copies not freed (memory on iPhone). Men in Black cover margin 227 vs 250 inside.
- Lebowski: the tai chi caption pairs "This aggression will not stand" with the rug scene (said at the mansion); gap above Sweets about 60px; cue leaves "one." alone; fallback poster still says White Russian in kids' mode. The old lanes renderer is unused.
- Not tested: WebKit is not installed here, so no iPhone Safari run this round.

### Next
The 13 held side-branch films (review 26 section) or the iPhone build, Josh to choose.

## 12 Nov, late night: review 27, the 13 held films cut on top of live main (branch cut/review-27, NOT deployed; start here in the next chat)

### What is where
- Live: still deploy 6af591c0 (main 347fbf48 content), deployed by the Review 24 chat at 8:15pm. Live files checked against main file by file (78 files plus index.html, which differs only by Netlify's form rewrite).
- cut/review-27: main 347fbf48, then a revert of 4459196e (the review 26 hold-back), then the review 27 work merged in. All 13 held films go live on it: foodcourt (Mallrats, Fast Times, Jingle All the Way, Bad Santa, Jurassic World, Wonder Woman 1984), skilodge (Hot Tub Time Machine, Better Off Dead), arcade (Wreck-It Ralph, Snatch, Dazed and Confused), dimsum (Rush Hour, Men in Black 3). Only the 13 films' data plus the four layout files differ from main.
- Toy Story (live, arcade) changes on the cut: prices dearest first, house lines at the foot, the token box shows its prop slip. Josh told.
- wip/new-formats: the review 27 work before the merge. The cut supersedes it.
- Deploy only when Josh says: trimmed copy of cut/review-27 (see the 11 Nov deploy note), Netlify site b641e7a7-b7d1-44cc-95e1-79f0bc20acf6. Then fast-forward main to the cut, check live files, set Live layout for the 13 rows in the sheet.
- Sheet "Reel Dinner film layouts": Live layout set for the 29 review 26 rows (now live). The 13 rows marked Approved, Live layout left until the deploy. Bad Santa and Jingle venues updated.
- GitHub: cut/review-27 and wip/new-formats pushed from this session (pushes work despite the flag). main not touched.

### Grades (fresh reviewer each round, docs/review-27.md)
foodcourt (Jurassic World) 9.0; skilodge (Better Off Dead) 8.6 then 9.1; dimsum (Men in Black 3) 8.2 then 9.1; arcade (Snatch) 8.6, 8.7, 8.8, 9.0 (then the quote credit spaced off the closing quote mark, also on Toy Story).

### Josh's calls this chat
- Venues: Bad Santa "Saguaro Square Food Court" (the film's mall), Jingle All the Way "Mall of America Food Court", sign "Bloomington, Christmas Eve". Men in Black 3 keeps "Wu's Chinese Restaurant" (not the promo site's Wu's Diamond Garden).
- Better Off Dead gag extra "It's got raisins in it" (Mom's line), not cooked, priced lowest in mains.

### Code changes
- foodcourt: Overheard heading from flavour (overheard), default "Overheard"; no dot leader beside a wrapped dish name; still keeps 16:9 (narrows rather than cut to a strip).
- arcade: arcade.unit renames the TIX price tag (Snatch: CR); counter and redeem labels from flavour.
- dimsum: short quotes print at 24px; stamp reads KITCHEN CHECKED unless the venue is a tea house or yum cha; prawn crackers are not a dear dish.
- skilodge: GAPMAX 22, dish gaps take up to 10px; plain course word (Starters, Mains, Sweets, Drinks) at the right of each run heading; image credit on the timber under the foot.

### Left (from the reviewers, low)
- Phone menu order and course names still raw (shared item). Prep sheet time chips confusing with make-ahead dishes. Better Off Dead croques price under the fries (priceSense holds card extras under cooked dishes).
- Snatch: mini pie 170 sits close to the 190 fry-up.
