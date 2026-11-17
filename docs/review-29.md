# Review 29: fresh whole-site review

Overall: 8.0 out of 10

What is strong: this is a genuinely charming, well built site. The cinema marquee opening, the brass wheel, the curtain reveal and the printed menus land the idea in seconds, and the menus themselves are the star: across 60 films and 40 layouts I saw no broken page, every Save PDF came out as clean A4, and most menus are full of real venues and sharp film detail (Louis' with the best veal in the city, the Continental Hyatt House, Zhu's wonton soup, the Orca galley, Busan casino wings for Black Panther). Match night with Final Cut, the daily quiz, the member card and its stat pages all worked end to end on a phone with no page errors, every existing test and browser check passed, and the generated film pages are tidy, consistent and free of em dashes.

What holds it back: the cinema and Galaxy Video worlds still bleed into each other in a few places the owner said must never mix (cinema dialogs sit on a purple Galaxy backdrop, Trivia spin is navy, and the Candy bar shows Galaxy hire tapes with "All copies out, wait by the returns chute"). The menu data has a layer of filler that weakens it: house add-on lines like a cup of peanuts or a side of sauce get printed as dishes and often cost more than the mains, the snack pairings are by genre rather than by film (Fairy bread with Ratatouille), and a handful of facts and spellings slip (a portrait of Jen beside "A word from Li Mu Bai", flathead in Arkansas, "Harbor"). Save PDF works but is slow, and a few tap targets on phone are well under 44px.

## How it was tested

- Served the repo with `python3 -m http.server 4601` and drove it with Playwright Chromium through the sandbox proxy so TMDB images loaded. Phone 390x844 at 3x with touch, desktop 1440x900, service workers blocked.
- First impression with the first-run dialog on phone and desktop, then the full home page scrolled on both.
- Core flow on phone: spin (countdown, curtain, auto scroll to the menu), the phone menu sections and recipes, the zoom dialog (page turn, zoom buttons), Prep sheet and shopping list, Lock in for this week (Director's cut or full feature, showtime), the locked-in strip and its Edit dialog (day, showtime, Watched it early, Remove), More options (Table kit, Start the show, Share to story).
- Save PDF (Menu only) for 60 films covering every shared layout plus 8 film-world menus. Every PDF opened, was rasterised with pdftoppm and looked at on two contact sheets, with several pages viewed at full size. Timed exports.
- Menu content read in full for 31 films from the printed card text (Superman 2025, Austin Powers 2, Labyrinth, Se7en, Thelma and Louise, Walk the Line, Good Burger, Toy Story 3, Twisters, Wallace and Gromit, X-Men DOFP, Mighty Ducks, Ghostbusters 2016, Megamind, Luca, Mulan, Almost Famous, Con Air, First Blood, Goldfinger, Crouching Tiger, Jaws, Ratatouille, The 'Burbs, The Godfather and others), with web checks on doubtful lines.
- Candy bar: the board, The whole counter, food chips and the film grid. Galaxy Video: walk-in, board, member card, aisle signs, aisles, a tape back, the hire slip, search.
- Match night pass the phone with Final Cut through two rounds and head to head to a winner. Quiz night daily quiz to the score card and answers.
- Members with a seeded signed-in member (routed Supabase calls, as in scripts/check-card-stats.cjs): My card, all 8 stat pages, Duels, Inbox, Friends, Settings.
- Film pages: looked at three on phone and desktop (title, description, canonical, headings, structured data) and scanned all 1,000 generated pages for dashes, stray tokens, doubled words and US food words.
- Tab order on desktop, unnamed controls and unlabelled fields, phone tap target sweeps, console and page errors throughout (none seen).
- Ran every tests/*.test.cjs except dialogs (all pass), scripts/check-ripple.cjs, and copies of check-card-stats, check-friends, check-final-cut, check-quiz, check-members and check-night-edit moved to ports 4693 to 4699 (all pass).

## Scores

| Area | Score |
|---|---|
| 1 First impression and visual identity | 8.5 |
| 2 Brand consistency (cinema vs Galaxy Video) | 7.0 |
| 3 Core flow | 8.5 |
| 4 Printed menus and Save PDF | 8.0 |
| 5 Menu content (fact and vibe) | 7.5 |
| 6 Phone experience | 8.0 |
| 7 Candy bar | 7.5 |
| 8 Galaxy Video store | 8.0 |
| 9 Match night | 8.5 |
| 10 Quiz night | 8.5 |
| 11 Members | 8.5 |
| 12 Film pages for Google | 8.5 |
| 13 Polish and craft | 8.0 |
| 14 Accessibility basics | 8.0 |
| Overall | 8.0 |

## Fix list

1. [quick] Cinema dialogs open on a Galaxy Video purple backdrop, and Trivia spin is navy blue. Screenshot: review-29-01.png
   - Where: Box office, Mystery night, Trivia spin, More options then Table kit (also the stars sheet and the stub wall, which share the class).
   - What you see: the red and gold Mystery night and Table kit boxes float on a purple glow; the Trivia spin box is navy with blue borders, so a cinema feature looks like neither brand.
   - Cause: index.html:2848 sets every `.counter` dialog to `radial-gradient(... rgba(91,42,158,.55) ... #1b0f30)`. Only `dialog.counter.pdfpick` is overridden back to red. index.html:2750 gives `.trivia .tv-box` `#0f1426` with a `#3a4a8a` border.
   - Fix: make the base `.counter` backdrop the cinema red (the pdfpick gradient) and add a `.counter.galaxy` (or scope the purple to dialogs opened from `#viewShop` and the account) for the Galaxy ones. Restyle `.tv-box` in the cinema maroon and gold like `.kit-box`.

2. [medium] The Candy bar (cinema) shows Galaxy Video hire tapes. Screenshot: review-29-02.png
   - Where: Candy bar, open the board, tap a food such as Wings.
   - What you see: VHS cases with Galaxy rating stickers, "All copies out, wait by the returns chute" on Captain America: Brave New World, and Staff pick stickers with staff talk, inside the red and gold candy bar.
   - Cause: app.js:3270 builds the crave grid with `tapeHTML(f)`, the Galaxy shelf tape from app.js:2983 to 2990, including the `out-card`, stickers and talker.
   - Fix: give the candy bar its own poster tile (poster, title, year, dish line), or call `tapeHTML` with a flag that drops `out`, stickers, price and talker and uses a cinema frame. A film should never be "out" at the cinema.

3. [quick] Galaxy Video contradicts its own prices. Screenshot: review-29-03.png
   - Where: Galaxy Video, the window board and the New release wall.
   - What you see: the board and the tape stickers say new releases are $4 for 3 nights; the wall note underneath says "Overnight $7. Back by 7pm tomorrow."
   - Cause: app.js:3034 hard codes the wall note; app.js:2567 (`priceOf`) and app.js:2994 (the board) use $4 for 3 nights.
   - Fix: change the note to read from the same rule, for example "New releases $4 for 3 nights. Back by 7pm." (keep the $2 Tuesday branch).

4. [medium] Galaxy aisle signs are tiny tap targets on phone, and the phone chip row is switched off. Screenshot: review-29-04.png
   - Where: Galaxy Video on phone, the shop photo ("Swipe the shop. Tap a sign to walk to that aisle").
   - What you see: measured sign buttons: Horror 47x13, Sci-fi 42x11, Drama 39x11, Family 66x18. There is no other way to jump straight to those aisles on a phone.
   - Cause: the signs are absolutely placed percentages over the photo (index.html:3334, `.sv-hang`). A phone fallback row exists (`.sv-jump`, shown at max-width 700px by index.html:1933) but index.html:1643 `#viewShop .sv-jump{display:none!important}` hides it.
   - Fix: drop the `!important` rule at 1643 (or move it to desktop only) so the chip row shows on phones, or give each `.sv-hang` an invisible hit area of at least 44x44 with a pseudo element.

5. [medium] The tavern seal shows the wrong face next to "A word from". Screenshot: review-29-05.png
   - Where: printed menu, tavern layout (29 films), for example Crouching Tiger, Hidden Dragon.
   - What you see: "A word from Li Mu Bai: I have always loved you." with a round portrait of Jen (Zhang Ziyi) right beside it, which reads as the speaker. The footer also says "Bill No. 2000, 2000."
   - Cause: menu-formats/tavern.js:106 takes `stills[1]` for the seal with no link to the speaker. tavern.js:102 falls back to the year for `num`, and tavern.js:171 prints `Bill No. ${num}, ${year}`, so the year appears twice.
   - Fix: let flavour name a seal still (`fl.seal`) and set it for films whose second still is not the speaker, or use the poster crop by default. In the footer, skip the year when it equals `num`.

6. [medium] Add-on "house" lines are not complete dishes and are priced above the mains. Screenshot: review-29-06.png
   - Where: shared layouts with a house line, for example Se7en, Good Burger, Twisters, Con Air, Megamind.
   - What you see: Se7en "Salted peanuts in a paper cup" 8.25 above tacos 7.50 and burgers 6.50; Good Burger "Extra Ed's sauce on the side" 5.25 above the fries 4.75, plus "Bottomless fountain soda" with no description; Twisters peanuts 9 above the burgers 8; Con Air orange soda in a can 5.50 above the bourbon smash 3.75; Megamind cheddar crackers 12.00 above the quesadillas 9.00. A side of sauce or a cup of peanuts is not a complete dish.
   - Cause: app.js:1944 to 1946 appends the film's house lines from data/film-house.json (28 are peanuts, 20 crackers, 56 sodas) into the snack and drink slots, and the layout then prices them by slot, not by what they are.
   - Fix: price house lines from a small table by type (nuts and crackers under the cheapest starter, a soda under the cheapest drink), and drop or rewrite lines that are a side or a garnish ("Extra Ed's sauce on the side") into a full dish. Give every house line a note.

7. [quick] US ratings show on an Australian site. Screenshot: review-29-07.png
   - Where: Galaxy Video tapes, tape backs and the Candy bar grid.
   - What you see: 27 films carry US ratings: R on Mystic Pizza, Rosemary's Baby, Manhattan, Shaft, Bugsy and others, PG-13 on Krampus, Waitress, Fried Green Tomatoes and others. Everything else shows G, PG, M, MA15+ or R18+.
   - Cause: ratings.js line 1 says "Australian where known, else US". The bare "R" also matches the Late Show test in app.js:2982.
   - Fix: map the leftovers to Australian classes (look up the 27 on the Classification Board site) or show no sticker when there is no Australian rating, and remove plain `R` from the Late Show regex.

8. [quick] Two Candy bar snacks have no photo. Screenshot: review-29-08.png
   - Where: Candy bar, The whole counter, Honey joys and Chocolate malt milkshakes.
   - What you see: a red and white stripe block where the photo should be, between real food photos.
   - Cause: data/snacks.json has no `img` for `honey-joys` and `milkshakes`, so app.js:4818 falls back to `.sc-noimg`.
   - Fix: add photos (with credits, as for the others) for both.

9. [quick] Snack pairings are by genre, not by film.
   - Where: under every menu, "Goes well with".
   - What you see: Crouching Tiger, Hidden Dragon gets Frozen cola slushies and Sour straps; Ratatouille gets Fairy bread and Chocolate crackles.
   - Cause: app.js:4882 to 4888 (`snackGoes`) takes `G.only[f.id]` if present, else rotates the genre pool `G.go[f.theme]`.
   - Fix: add `only` entries for the films where the genre pick clashes (start with world cinema and French, Italian and Asian set films), or weight the pool by the menu's cuisine words.

10. [quick] Small content slips found in the 31-film read.
   - Luca: venue "Portorosso Harbor Cafe" (US spelling) on the card, the film page and its meta description, while the same menu says "Harbour zucchini fritters". Fix the venue in the Luca flavour data.
   - Thelma and Louise: "Cornmeal-crusted flathead" at an Arkansas diner. Flathead is an Australian fish; use catfish.
   - Wallace and Gromit: The Curse of the Were-Rabbit credits "I'm just crackers about cheese" to Wallace and cues "when Wallace says, Don't forget the crackers". Wikiquote lists both lines under Hutch in this film. Credit Hutch, or reword the cue.
   - "Cotton candy" appears in recipes on several film pages (Inside Out, Beverly Hills Cop III). Australian English is fairy floss.
   - Jaws prep sheet: calamari reads "Prep 12 min, cook 8 min, then 20 min to soak", but the soak comes before frying. The wait phrase should go in step order.
   - Could not confirm, worth a check: Superman (2025) "Krypto! Get the toy." credited to Superman; Walk the Line "Do you think they forgot?" credited to Johnny Cash; Twisters "you can always trust a guy who puts his face on a t-shirt" credited to Kate; The Godfather Part II venue "Isla Verde" supper club (Match night also shows it under the poster).

11. [medium] Save PDF is slow.
   - Where: Save PDF, Menu only, any film.
   - What you see: in a batch on desktop Chromium the 60 exports took 23 to 91 seconds each; Con Air took 44 seconds alone; Luca, Mulan and Almost Famous took 116 to 157 seconds when re-run one at a time. The button does show "Page 1 of 2" progress, which helps.
   - Cause: each export renders every face through html2canvas and fetches the TMDB stills again (9 image requests during the Con Air export), app.js:3964 to 3990. The sandbox proxy adds some of this time, so real users will be faster, but not by enough to make two minutes acceptable.
   - Fix: keep the already loaded images as same-origin blobs and reuse them for the canvas, render faces at a lower scale where the A4 output does not need it, and tell people up front "This takes about 30 seconds" in the Save PDF dialog.

12. [quick] Tap targets under 44px on phone. Screenshot: review-29-09.png
   - Quiz score card: each "Open the ... menu" link is 23px tall and "See the answers" is 38px (quiz.js:350 uses `.mn-link`, index.html:3063, and index.html:2743). The answer list also shows the right answer in red when you missed it, without your pick, which reads as if the right answer was wrong.
   - Match night: "Start over" (`#mnQuit`) is 75x36 (index.html:3063).
   - Members: Duels "Close", "Play", "Open the menu", Friends "Quiz", "More", "Send a duel" and Inbox "Clear all" are 40px tall (`.acct-go.sm`, `.acct-ghost.sm`), and the account tabs use 11px text.
   - Fix: give `.mn-link` and these `.sm` buttons `min-height:44px` with inline-flex centring, and in the quiz answers show "You said X" for misses.

13. [quick] Desktop Box office buttons are spread unevenly. Screenshot: review-29-10.png
   - Where: desktop, under Tonight's programme.
   - What you see: Double feature, Mystery night and Trivia spin are pushed to the far left, middle and right; Request a movie and Settings sit at opposite ends of a second row with a big gap.
   - Cause: index.html:567 `.controls{... justify-content:space-between}`.
   - Fix: use `justify-content:flex-start` with the 10px gap, or a three column grid at desktop widths.

14. [quick] The phone footer credit has very tall line spacing. Screenshot: review-29-11.png
   - Where: bottom of every main page on phone.
   - What you see: each line of the TMDB and photo credit sits about 44px apart, so a short credit takes most of a screen.
   - Cause: index.html:2908 makes every inline credit link `inline-flex` with `min-height:44px`, which forces every line of the paragraph to 44px.
   - Fix: give the links vertical padding with a negative margin (hit area without line height), or turn the credit into a short list where each link is its own 44px row.

15. [quick] Number style is mixed on the same screen.
   - Where: home and Galaxy Video.
   - What you see: "Everything (1000 films)", "1000 films in tonight's programme", "0 / 1000 watched", "1000 of 1000 titles on the shelves", next to "All 1,000 film menus" and "all 1,000 films" in Quiz night.
   - Fix: format counts with `toLocaleString('en-AU')` everywhere (app.js theme select label, count line, watch summary and shop count).

## What I could not test

- Real Supabase: sign up, Google sign in, email alerts, room code and Dinner Duel between two real phones. Member screens were tested with routed fake responses only.
- Real printing, the share sheet, Share to story output and Add to calendar on a device; the app builds (iOS and Android).
- Safari and WebKit; all browser work was Chromium.
- Every quote in 1,000 menus. I read 31 menus closely and web checked a few doubtful lines; several could not be confirmed either way and are listed in item 10.
- Real-world PDF speed without the sandbox proxy, which slows TMDB image loads.
- check-print-text, render-previews and build-data, which I was asked not to run.
