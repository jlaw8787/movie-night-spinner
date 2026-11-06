# Nineteenth independent review

**Overall: 9.25 out of 10**

Every item in review 18's fix list and its "Fixed after the review" notes holds when checked by hand. Club menus print "On stage tonight" in my Save PDF copy of Revenge of the Sith and John Wick 3 and on Popstar's real PDF (05, 06). The tiki woven band prints light and woven on Moana's real PDF and in my copies of Thunderball and Return of the Jedi (05). Money Train's caption ends clear of the footer rule on screen and paper (07). Psycho, Rocky IV, Tombstone and Midsommar, locked in at Fri 2:30pm for Sat 7pm, now take the too-late dish off the plan: unticked and greyed in the planner, off the method, off the shopping list except under "Too late to make, buy ready-made", and "Move to Sat 14 Nov" brings it back with its ingredients (01, 02). Scream's stamp and key, Role Models' badges and Mean Streets' IOU lines print (08). After showtime the bar has one next-week button (04). No page errors in any run, and all 19 node tests pass.

What holds it short of 9.5 is a set of paper faults that no review has named, all in shapes cut by a CSS mask: every hotel menu (31 films) prints its door hanger without the hole (11), the airline ticket prop prints with square ends where the screen has punched notches (10), and Coming to America's hand-built card prints its dark surround as red with white corners (09). None of these lose words, which is why check-print-text passes them. On the phone, the too-late row in the planner squeezes "Mother's pickled onions" into a narrow three-line column with a four-line tag beside it (03). A few small wording items are left ("Deviled Eggs" on nine films, "Hot apple sparkling apple juice").

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit 0c59a21 ("Handoff: review 18 fixed, deploy 6aee0522") on wip/store-overhaul, with service workers blocked and Australia/Brisbane time. The clock was fixed at Fri 6 Nov 2026, 2:30pm for the calendar checks, at Sat 7 Nov 5:30pm for the countdown and at Sat 7 Nov 9:30pm for after showtime. Web fonts and TMDB images came through the proxy; html2canvas 1.4.1 and jsPDF 2.5.1 were served from local copies. Every finding below was checked against a screenshot or the raw rendered text, not just the DOM. Where a fault looked old, I rendered the same film on the previous build (980f2c4) to check. Screenshots are docs/review-19-01.png to review-19-18.png.

## How it was tested

- Too late, clock at Fri 6 Nov 2:30pm, film locked in for Sat 7 Nov 7pm: Psycho, Rocky IV, Tombstone and Midsommar on desktop, Psycho on the phone. Read the planner, the Prep sheet text, the shopping list dialog, the calendar panel from the strip, the .ics (DESCRIPTION, TRIGGER), the Google links and the status line; pressed "Move to Sat 14 Nov", then reloaded and read the planner, Prep sheet and shopping list again (01 to 03).
- Folded alarms and "longest on the night" on Die Hard 2, Hot Fuzz and The Godfather. Countdown at 5:30pm Saturday. After showtime at 9:30pm Saturday: strip and bar buttons (04).
- Save PDF: 63 films, each card rendered on screen at full size beside renderCanvas(face,true) after loadExportTools(true), every .fx-face as its own full-size clone built the way Save PDF builds it. Each pair was looked at side by side and with a blurred difference map, then zoomed where they differed. Shared layouts, none named in reviews 2 to 18 where the layout had any left: airline (Hot Shots!, Jackie Brown), banquet (How the Grinch Stole Christmas, X-Men: First Class), bar tab (Pineapple Express, I Love You, Man), bistro (The Dark Knight Rises), cafe (The Devil Wears Prada, Amélie), campfire (Ice Age, Tarzan), candy bar (Us), canteen (Inside Out 2, X2), club (KPop Demon Hunters, Office Christmas Party), diner (Back to the Future Part II, Priscilla), dining car (Ghost Protocol), galley (The Marvels), home (Chamber of Secrets, Mary Poppins Returns), hotel (The Mummy Returns, Wicked: For Good), invite (Kill Bill: Vol. 2), kiosk (Say Anything..., Thor: Love and Thunder), lab (National Treasure, Thunderbolts*), motel (Barbarian, Elvis), newspaper (The Conjuring 2), placemat (Shazam!, Hancock), precinct (The Other Guys, 21 Jump Street), prom (Weird Science), pub (Eurovision Song Contest), saloon (Back to the Future Part III, Jumanji: The Next Level), stadium (Dodgeball), takeaway (Blue Beetle, Big Daddy), tavern (Gladiator II, Dead Man's Chest), tearoom (The Lion, the Witch and the Wardrobe), tiki (At World's End), truck (Venom, Can't Buy Me Love). Hand-built, 14: TMNT II, Home Alone 2, The Godfather Part III, A Bronx Tale, Bugsy, Things to Do in Denver When You're Dead, Serpico, The French Connection, Léon, 16 Blocks, Trading Places, Tootsie, Coming to America, Beetlejuice. Plus the review 18 rechecks: Revenge of the Sith, John Wick 3, Moana, Thunderball, Return of the Jedi, Scream (2022), Role Models, Mean Streets, Despicable Me 2, Nightmare 3, Money Train, Popstar.
- The real Save PDF button (Menu only) on Coming to America, Popstar, Moana and Wicked: For Good, pages read with pdftoppm and pdftotext.
- descRoom: screen renders of ten films (diner, cafe, dining car, lab, tearoom, precinct, bistro) on 980f2c4 against 0c59a21, pixel by pixel. The only changes are one-pixel bands at the edge of diner and lab heads. Nothing moved, no new lines, no overlaps.
- Layout clash: Jack Frost then Jingle All the Way, Newsies then Oppenheimer, Home Alone then The Incredibles, each compared with the same film opened fresh (16).
- Phone and desktop walks: box office, strip, "Your movie night" bar, planner with a too-late dish, Candy bar, Galaxy Video (shopfront and walk in). Sideways scroll, page errors and console errors read on each view; tap sizes measured on the phone (17).
- Node tests: `node --check app.js` and all 19 tests/*.test.cjs, dialogs included. All pass. scripts/check-print-text.cjs on Coming to America, Jackie Brown, Wicked: For Good, Beetlejuice, Home Alone 2, Popstar, Moana and Money Train: pass.
- A data search of films.json, dish-notes.json, film-house.json, film-flavour.json, recipes and formats.js for about 45 US spellings and terms, plus doubled words.

What I could not test: no real iPhone, Android phone, Mac or Windows machine, so I cannot say how Safari, Apple Calendar, Google Calendar or Outlook handle the file. I did not re-check the table kit or re-measure the swipe view's type; nothing since review 18 touches either. I did not run check-print-text, check-pdf-tone, check-phone-fit or check-prep-a4 over all 900.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9.5 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 9 |
| 4. Phone experience | 9 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 9.5 |
| 6. Candy bar | 9 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 9.5 |
| 9. Polish and craft | 9.5 |
| 10. Accessibility basics | 9.5 |
| **Overall** | **9.25** |

The straight average is 9.25. I have not rounded it.

### 1. First impression and visual identity: 9.5
Unchanged. The phone strip, marquee and desktop "Coming up" hold. Nothing to mark off.

### 2. Brand consistency: 9
Unchanged. Candy bar in cinema red and gold, Galaxy Video on its shopfront (17). Held at 9 for the cinema strip inside Galaxy Video, as before.

### 3. Printed menus: 9
Every review 18 paper fault is fixed. "On stage tonight" prints on Revenge of the Sith, John Wick 3 and Popstar's real PDF (05, 06). Moana's real PDF shows the light woven mat (05), and Thunderball and Return of the Jedi match. Money Train's caption sits well clear of the rule (07). Scream's stamp keeps its perforations and the key its stripe, Role Models' badges keep the dashed stitch, Mean Streets' IOU keeps its ruled lines (08). Despicable Me 2's header has no stray outline, and Nightmare 3's "Hospital" is whole.

The fresh sample is the best yet. No dish name, note, price or cue is lost on paper in any of the 63 films. The hand-built menus are near copies: The Godfather Part III (18), The French Connection, Léon, Trading Places, Tootsie, Bugsy, A Bronx Tale, Serpico, TMNT II and 16 Blocks. So are most shared layouts: Shazam!, Hancock, Venom, Dodgeball, Blue Beetle, the Narnia tearoom, the KPop and Office Christmas Party clubs, both saloons and At World's End. descRoom has no side effect I could see.

Marks off:
- **Hotel door hangers print with no hole.** The hanger on the front of every hotel menu is a die-cut card with a round hole near the top. On paper the hole is gone and the card is solid, in my copy and on Wicked: For Good's real PDF (11). Same on 980f2c4, so it is not new. Review 10's fix note said hangers were "unchanged", and no review since has named it. The hanger box holds text, so the export's mask rule (which only repaints empty masked shapes) leaves it alone.
- **Airline ticket props lose their punched notches.** Jackie Brown's "Admit one" ticket has a half-circle notch on each end on screen and square ends on paper (10). Same cause: the ticket shape in propPaper (airline, bistro and hotel) is a mask on a box that holds text. Same on 980f2c4.
- **Coming to America prints red to the edge with white corners.** On screen the rounded red card sits on a dark navy surround. Through Save PDF, real PDF included, the surround is red and the four corners are white (09). Same on 980f2c4.
- Low, and already on the handoff's open list: drop shadows do not print. The precinct "Surveillance" photo and the motel poster and still sit flat on paper (12). This is wider than the handoff's canteen trays and Scream's stamp; it affects most layouts with a lifted photo.

### 4. Phone experience: 9
No sideways scroll on any view, no page or console errors. The "Too late" note and the "Move to Sat 14 Nov" button read well at 390 wide (03).

Marks off:
- **The too-late dish row squeezes.** In the planner, "Mother's pickled onions" wraps to three lines in a narrow column, and the "too late for this night, buy ready-made" tag wraps to four lines under it, while "17 min + 7 days wait, start 7 days before" takes the rest of the row (03). On desktop the same row reads on one line (01).
- The planner's guest − and + buttons are 36x36px, and each dish row is 36px tall. The rows are full width, so this is easy to hit, but it is under the 44px the rest of the app keeps.
- Carried: small type in the swipe view of hand-built cards. Not re-measured.

### 5. Core flow: 9.5
Review 18's main fault is fixed, and it reads well:
- Psycho, Fri 2:30pm for Sat 7pm: planner "4 of 6 dishes picked", the pickled onions unticked and greyed with "too late for this night, buy ready-made" (01). Prep sheet: "Too late to make ahead for this night: Mother's pickled onions, 7 days to soak and rest. It's off the plan and on the shopping list to buy ready-made, or move movie night to Sat 14 Nov to make it." The recipe is gone from the method, and the shopping list has no pickling onions, malt vinegar or peppercorns, only "Mother's pickled onions" under "Too late to make, buy ready-made". The .ics has one alarm, start cooking at two hours (02).
- After "Move to Sat 14 Nov": "5 of 6 dishes picked", the onions ticked, "500g pickling onions" and "500ml malt vinegar" back on the list, the panel reading "Sat 7 Nov, 6pm. A week before: Mother's pickled onions", and alarms at two hours and at seven days one hour (02).
- Rocky IV (pickles), Tombstone (eggs, "3 days to pickle") and Midsommar (gravlax, "2 days to cure") behave the same.
- Folded alarms: "Start cooking with McClane's bourbon eggnog" (name kept), "with strawberry ice cream cones" and "with cannoli" (lower case). "Longest on the night: General Esperanza's snowbound chilli, 2 hr 28 min".

Marks off:
- Low: once Rocky IV moves to Sat 14 Nov, the vodka mule that was "The night before" joins the pickles in one "Four days before" reminder at Tue 10 Nov, 6pm. Freezing a drink four days early is harmless, but the night-before reminder it had is lost.

### 6. Candy bar: 9
Walked on phone and desktop: no sideways scroll, no errors (17). The photo credit links at the foot are 18px tall text links; that is normal for credits. Held at 9.

### 7. Galaxy Video store: 9
Walked on phone and desktop: the shopfront with Walk in and Skip, then the shelves (17). No errors. Held at 9 for the cinema strip inside the store.

### 8. Table kit: 9.5
Not re-checked; nothing since review 18 touches it. Held.

### 9. Polish and craft: 9.5
Every small item from review 18 is fixed: "Longest on the night: Shower cap swirled meringues, 1 hr 57 min"; lower case after "Start cooking with" unless the dish starts with a name; no "armor" left in the data, and "Muppet Theater" stays as a name; the strip counts down "in 1 hr 30 min" at 5:30pm; Tombstone's eggs are "3 days to pickle"; after showtime the bar shows Shopping list, Clear and Same film next week, and the strip shows "Add next week to calendar" (04).

Marks off:
- "Deviled" (US) on nine films where 35 others spell it "devilled": Things to Do in Denver (printed as "Deviled Eggs", 15), Pulp Fiction, Carrie, Annabelle, Hairspray, Harlem Nights, The Five Heartbeats, Clerks, Jurassic Park III, in films.json, formats.js and five recipe files.
- Home Alone 2: "Hot apple sparkling apple juice" says apple twice, and its long name pushes "4.50" past the right edge of the price column, on screen and paper (14).
- Beetlejuice: "Pressed lemons, cane sugar, soda water." sits flush on the top of the House Rule bar, with the descenders touching it, on screen and paper (13). Same on 980f2c4.
- "Longest on the night: Rigatoni, Sunday gravy, 2 hr" (The Godfather) reads as a list of three things. The dish's own comma is the cause.

### 10. Accessibility basics: 9.5
The calendar panel still opens with focus on Done, the status line announces the saved file, and the too-late note has role="note". Held short of 10 for the carried swipe-view type and the 36px planner controls (see area 4).

## Fix list

1. **Masked shapes that hold text.**
   Where: renderCanvas in app.js, the mask rule ("html2canvas cannot do CSS masks"), which only acts on masked boxes with no text; hotel.js door hanger; propPaper ticket in airline.js, bistro.js and hotel.js.
   Wrong: the hanger hole is gone on all 31 hotel menus (11); ticket props print square ends (10).
   Good looks like: the hole and the notches print as on screen. Bake the masked box's background to a picture with the mask applied (as pdfMaskDraw does for photos) and keep its text over it. A check-print-text rule: "mask left for html2canvas on a box with text".

2. **Coming to America's frame.**
   Where: the Coming to America hand-built menu (formats.js) and edgeColour in renderCanvas.
   Wrong: the dark navy surround prints red, with white corners (09).
   Good looks like: the surround prints the same navy as the screen and the corners are not white.

3. **The too-late row on the phone.**
   Where: the planner dish row (.pl-d with .pl-late) in index.html.
   Wrong: at 390 wide the dish name wraps to three lines and the tag to four, beside a long time (03).
   Good looks like: the name on one or two lines across the row, the tag under it on one line, the time under that or shortened ("7 days ahead").

4. **Planner tap sizes.**
   Where: .pl-b and .pl-d in index.html.
   Wrong: guest − and + are 36x36px, dish rows 36px tall.
   Good looks like: 44px, as the rest of the app.

5. **Small items.**
   "Deviled" to "devilled" on nine films and their recipe files (15); Home Alone 2's "Hot apple sparkling apple juice" name and its price past the column (14); Beetlejuice's lemonade note flush on the House Rule bar (13); Rocky IV's mule losing its night-before reminder after a move; "Rigatoni, Sunday gravy, 2 hr". Drop shadows under lifted photos (12) stay on the open list.

## Genuinely excellent, leave alone

- Too late, done properly: off the plan, off the method, one plain line on the shopping list, a greyed row that says why, a button that moves the night, and the dish coming back with its ingredients when it moves (01, 02).
- After showtime: one next-week button on the bar, "Add next week to calendar" on the strip (04).
- Save PDF across 63 films with no lost words at all, and hand-built menus that print as near copies (18).
- The paper fixes from review 18: club tag, tiki mat, Scream, Role Models, Mean Streets (05 to 08).
- descRoom: it fixed clipped letter tails without moving anything else on the cards I compared.
- Layouts no longer reset each other: Jingle All the Way after Jack Frost, Oppenheimer after Newsies and The Incredibles after Home Alone render pixel for pixel the same as when opened fresh (16).
- A clean run: 19 node tests pass, check-print-text passes the eight films I gave it, no page or console errors in any walk, no sideways scroll on phone or desktop.

## Fixed after the review (7 Nov, morning)

1. **Masked shapes that hold text.** Done. renderCanvas marks a masked box with words (data-pmaskt) and pdfMaskBox bakes it: the mask's gradient layers (radial holes and notches, straight fades, with their size, position and repeat) become an alpha picture (pdfMaskAlpha), the box's fill and its empty texture layers are drawn under it, and the words stay in the page over the picture. A drop-shadow on a wrapper round just that shape (the hanger) is drawn into the picture. Every hotel hanger prints its hole, airline, bistro and hotel tickets print their notches. Checked on Wicked: For Good's real PDF (both pages) and Jackie Brown.
   Also found while in there: html2canvas draws every outer box shadow at print scale with the shadow pushed off the page (canvas shadow offsets are not scaled), and skips drop-shadow filters. pdfLiftBake draws each outer shadow as a picture behind its box, turned with it; a drop-shadow on a plain box or a clip-path shape becomes the same, and on lettering a text shadow. Precinct and motel photos, canteen trays, stamps and section tabs now print lifted (the open item from review 18).
   New check-print-text rules: "mask left for html2canvas on a box with text", "outer shadow left for html2canvas", "drop-shadow filter left for html2canvas". All fail on e176cf8 (Wicked: For Good, Jackie Brown, The Dark Knight, Batman and most layouts) and pass on the new build.
2. **Coming to America's frame.** Done. A hand-built card whose outer corners are rounded (8px or more) keeps the surround the screen shows in the print copy instead of the white print border. Coming to America prints navy all round, no white corners (real PDF checked). Pulp Fiction and Chef had the same fault and print the same way now. New check-print-text rule: "rounded card prints on ..., not the screen's surround", fails on e176cf8 for all three.
3. **Too-late row on the phone.** Done. Planner dish rows wrap: the name runs across the row, the time drops under it when it does not fit, and on a phone the too-late tag sits on its own line. At 390 wide Psycho reads "Mother's pickled onions", then the tag, then "17 min + 7 days wait, start 7 days before".
4. **Planner tap sizes.** Done. Guest buttons 44x44, dish rows 44px minimum, diet toggles 44px.
5. **Small items.** Done.
   - "Deviled" to "devilled" everywhere (55 spots in data, recipes, formats and the generated files). New test: tests/spelling.test.cjs (deviled, armor, flavor, favorite, savory, jewelry, fiber, omelet, caramelize), fails on e176cf8.
   - Home Alone 2: the dry pass reads "Hot spiced apple juice" (hot, warm or mulled cider becomes spiced apple juice; apple or pear cider becomes sparkling apple or pear juice), and the price sits in its column. Cases in tests/dry-plan.test.cjs. New check-print-text rule: "price runs past its column", fails on e176cf8.
   - Beetlejuice: the cheese note is one word shorter ("Cheese houses, tomato and cornichon trees.") so it fits one line and the lemonade note clears the House Rule bar. New check-print-text rule: "a box covers Npx of ..." (a later filled box over a line's ink, with the box's turned shape, round corners and its parent's clip), fails on e176cf8 at 7px. The same rule found Midnight Cowboy's bus ticket over the end of "Miami Beach, one night south.": the ticket sits 8px higher.
   - Rocky IV: make-aheads due on different days keep their own reminders (calPlan before and before2): the pickles four days before, the mule the night before, two alarms, two Google links, two panel rows. Case in tests/calendar.test.cjs.
   - The Godfather: a dish with its own comma takes its time in brackets, "Longest on the night: Rigatoni, Sunday gravy (2 hr)" (calLong). Case in tests/calendar.test.cjs.
   - Drop shadows: see fix 1.
