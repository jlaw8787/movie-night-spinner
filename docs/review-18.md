# Eighteenth independent review

**Overall: 9.2 out of 10**

Every item in review 17's fix list and its "Fixed after the review" notes holds when checked by hand. Ghost Dog prints all four section pills (05). The Big Lebowski's cue and all three house rules sit inside the score sheet on screen and paper (06). Psycho locked in on Friday afternoon for Saturday says "Too late to make ahead for this night: Mother's pickled onions, 7 days to soak and rest. Buy it ready-made, or move movie night to Sat 14 Nov." on the Prep sheet, in a red row in the panel and in the .ics notes, with no alarm in the past (01, 02), and "Move to Sat 14 Nov" does what it says (03). Add to calendar after showtime reads "Add next week to calendar" and saves Fri 13 Nov (04). The Heat prints black (07), canteen trays print rounded (08), Die Hard 2 has one alarm, and all 900 films tick five dishes. The new tiki photo island is in on Return of the Jedi, Moana and Thunderball, and Running Scared keeps a plain cream card (09, 10). Jingle All the Way after Jack Frost and Oppenheimer after Newsies both show their last dish (11, 12).

What holds it short of 9.5 is a fresh set of paper faults across two whole layouts, plus one gap in the new "Too late" logic. Every club menu (34 films) loses its "On stage tonight" tag on paper (15, 16). Every tiki menu (17 films) prints its woven bamboo band as a flat dark brown bar (17). Money Train's photo caption runs into the footer rule and the footer line on screen and on paper (18). And when a make-ahead dish is too late, the Prep sheet tells you to buy it ready-made but still ticks it, lists its recipe and puts "500g pickling onions" on the shopping list (01). None of these trip the team's checks: check-print-text passes Popstar, Money Train, Scream, Role Models and Oppenheimer.

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit 980f2c4 ("Handoff: deploy 6aeda7ee") on wip/store-overhaul, with service workers blocked and Australia/Brisbane time, on Friday 6 Nov 2026. Web fonts and TMDB images came through the proxy. Every finding below was checked against a screenshot or the raw rendered text, not just the DOM. Screenshots are docs/review-18-01.png to review-18-27.png.

## How it was tested

- Calendar with the clock fixed at Fri 6 Nov 2026, 2:30pm: Psycho locked in for Sat 7 Nov, 7pm, on phone and desktop. Read the Prep sheet chips and late note, opened Add to calendar from the strip, read the panel, the .ics (DESCRIPTION, VALARM triggers) and the decoded Google links, then pressed "Move to Sat 14 Nov" and read the new file, panel and status line (01 to 03).
- The Mummy with a 12:15am Friday showtime, at 2:30pm Friday: the strip, the bar, both button labels, and the file the bar's button saves (04). Also The Mummy planned Fri 7:10pm for Sat 7pm (falafel soak due at 6pm Friday) and planned Sat 6pm (start cooking already gone).
- "Longest on the night" on the Prep sheet against the calendar for The Mummy, Midsommar, Chef, Psycho, Die Hard 2, Hot Fuzz, The Godfather, Blade, Rocky IV, Tombstone, Old School, Paddington 2 and The Wizard of Oz.
- Cook 5: planAll and planOn over all 900 films in one page. Every film ticks exactly five.
- Save PDF: 56 films, each rendered once, the card on screen at full size beside renderCanvas(card,true) after loadExportTools(true), every .fx-face as its own full-size clone. 41 are named in none of reviews 2 to 17: one or two from every shared layout (airline, banquet, bar tab, bistro, cafe, campfire, candy bar, canteen, club, diner, dining car, galley, home, hotel, invite, kiosk, lab, motel, newspaper, placemat, precinct, prom, pub, saloon, stadium, takeaway, tavern, tearoom, tiki, truck) and ten hand-built (Prizzi's Honor, Money Train, Quick Change, Frequency, Mean Streets, Road to Perdition, Splash, Fried Green Tomatoes, A Goofy Movie, Escape from New York). Plus the named rechecks: Ghost Dog, The Big Lebowski, The Heat, Crystal Skull, Kung Fu Panda, Popstar, Anchorman, Phar Lap, and the four tiki films. Every pair was looked at. Moana, The Heat, Popstar and Thunderball also went through the real Save PDF button, with the pages rendered by pdftoppm and read with pdftotext.
- Layout clash: in one page, Jack Frost then Jingle All the Way, Newsies then Oppenheimer, Home Alone then The Incredibles, Ghost Dog then The Big Lebowski then The Heat, each read for its last dish and for text cut by a clipping box (11, 12).
- My own clip probe over all 33 lab films; scripts/check-print-text.cjs on Popstar, Money Train, Scream, Role Models and Oppenheimer (pass).
- Candy bar and Galaxy Video walked briefly on phone and desktop: no sideways scroll, no page errors (24, 25).
- A data search for US spellings beyond the words review 17 searched.
- Node tests: `node --check app.js` and all 17 tests/*.test.cjs except dialogs.test.cjs, all pass. I did not run check-print-text, check-prep-a4, check-phone-fit, check-pdf-tone or check-browser across all 900 (run separately, as asked).

What I could not test: no real iPhone, Android phone, Mac or Windows machine, so I cannot say how Safari, Apple Calendar, Google Calendar or Outlook handle the file or the "Too late" notes. I did not re-check the table kit; nothing in the commits since review 17 touches it. I did not measure the swipe view's type again. Phar Lap and Running Scared still have one or two stills; more need the TMDB key.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9.5 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 9 |
| 4. Phone experience | 9.5 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 9 |
| 6. Candy bar | 9 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 9.5 |
| 9. Polish and craft | 9 |
| 10. Accessibility basics | 9.5 |
| **Overall** | **9.2** |

The straight average is 9.2 exactly, so no rounding was needed.

### 1. First impression and visual identity: 9.5
Unchanged since review 17. The phone strip, marquee and desktop "Coming up" all hold. Nothing to mark off.

### 2. Brand consistency: 9
Unchanged. The candy bar is cinema red and gold, Galaxy Video opens on its shopfront with Walk in and Skip (24, 25). Held at 9 for the cinema strip inside Galaxy Video, as before.

### 3. Printed menus: 9
Review 17's paper faults are all fixed. Ghost Dog's pills print "Glaces ICE CREAM", "À grignoter SNACKS", "Le plat chaud HOT" and "Boissons COLD" (05). Lebowski's cue reads "Showtime: Serve a White Russian every time the Dude makes one." and the House Rules box shows all three lines, on screen and paper (06). The Heat's real PDF is black, not charcoal (07). Crystal Skull's trays print rounded with no ledges (08); the soft drop shadow under them is still missing, as the handoff says. Kung Fu Panda's scroll and Anchorman's thick red strike print (26, 27). Phar Lap's lone still fills the section map (13), Nativity's prom ticket prints in full (14), and the club venue names fit on two lines on the poster page (15).

The new tiki island works: Return of the Jedi gets "Endor celebration", Moana "Voyager tag", Thunderball "Casino card", Wakanda Forever "Dora Milaje badge", and Running Scared a plain "Key West savings" card with no empty island (09, 10). The 41 new films match screen and paper closely: Prizzi's Honor, Fried Green Tomatoes, Escape from New York, Road to Perdition, Prometheus, the Dawn Treader galley, Peter Rabbit's tearoom, Incredibles 2's suite, Shanghai Noon, Talladega Nights and The Naked Gun are near copies.

Marks off:
- **Club menus lose "On stage tonight" on paper.** The white tag sits top right of the stage photo on screen. Through Save PDF it is gone, on Revenge of the Sith, John Wick 3 and Popstar in my copy, and on Popstar's real PDF page too (15, 16). The tag is in club.js, so all 34 club films. check-print-text passes Popstar.
- **Tiki menus print the woven band as a flat brown bar.** Under the poster the screen has a light woven bamboo mat behind the film logo, about (170, 149, 123). On paper it is a plain dark band, about (95, 86, 74), on all four tiki films I rendered and on Moana's real PDF (17). That is the two crossed repeating stripes in tiki.js; the stripe baker handles one straight stripe, not this pair.
- **Money Train's caption hits the footer.** "The money train runs right under us. Up here, cash only." wraps to a second line that sits on the footer rule and over the space where "Prices subject to change. No tabs, that means you, Charlie." runs, on screen and on paper (18). Not caught because the caption is not inside a panel the check reads.
- Small: Scream's postage stamp loses its perforated edge and the room key loses its mag stripe on paper (19). Role Models' campfire badges lose their dashed stitch border (20). Mean Streets' IOU note loses its ruled lines (21). Nightmare 3's lab badge cuts the descender of "Hospital" on screen and paper (22). Despicable Me 2's cafe header gains a faint box outline on paper that is not on screen (23).

### 4. Phone experience: 9.5
Both marks from review 17 are fixed: "Same film next week" is 44px (04), and the Google links in the calendar panel are 44px pills, "the night" and "start cooking", with room between them (02). The "Too late" row reads well at 390 wide and "Move to Sat 14 Nov" is a full-width button (02). No sideways scroll in the candy bar or Galaxy Video.

Marks off:
- Carried: small type in the swipe view of hand-built cards. Not re-measured.

### 5. Core flow: 9
All four calendar faults from review 17 are fixed and the plan reads like a cook wrote it:
- Psycho, planned Fri 2:30pm for Sat 7pm: start 5pm, the pickled onions "Too late", the .ics has one alarm (start cooking, two hours before) and no prep-ahead alarm; the Google panel offers only "the night" and "start cooking" (01, 02). After "Move to Sat 14 Nov": "Sat 7 Nov, 6pm. A week before: Mother's pickled onions", alarms at two hours and at seven days one hour, status "Calendar file saved: movie night Sat 14 Nov 7pm, start cooking 5pm." (03).
- The Mummy planned Fri 7:10pm: "Now. Start now, it still fits: Cairo bazaar falafel, 12 hr to soak and drain", with no alarm for it. Planned Sat 6pm: "Now. Start cooking now", the falafel too late, no alarms at all.
- After showtime: "Add next week to calendar" on the strip and the bar, saving Fri 13 Nov 12:15am, with "Thu 12 Nov, 10:45pm" on the start-cooking row (04).
- One "longest on the night" number on both: The Mummy 1 hr 30 min, Midsommar 1 hr 30 min, Chef 4 hr 25 min, Psycho 1 hr 57 min, Old School 9 hr 30 min.
- Folded alarms: Die Hard 2 "Start cooking with McClane's bourbon eggnog" at 4:15pm, Hot Fuzz 2:45pm, The Godfather 4:30pm, Blade 4:45pm, Paddington 2 4:45pm, each one alarm.
- Cook 5: 900 of 900 films tick exactly five dishes (Psycho 5 of 6, The Wizard of Oz 5 of 9, Paddington 2 5 of 7).

Marks off:
- **A dish that is too late stays on the plan.** Psycho's Prep sheet says buy the pickled onions ready-made, but they are still one of the five ticked dishes, the 7-day recipe is still on the sheet, and the shopping list still has "500g pickling onions" (01). The same goes for Rocky IV's pickles, Tombstone's pickled eggs and Midsommar's gravlax. Either swap the dish for a "jar of pickled onions" line on the list, or untick it and pick the next one.
- Low: after showtime the bar has "Add next week to calendar" and "Same film next week" side by side, and both move the night on a week (04). One is enough.

### 6. Candy bar: 9
Walked on phone and desktop: the menu board, "No film on yet" prompt, "Go to the Box office" and the whole counter list with Make it and Add buttons (24). No errors, no sideways scroll. Not re-measured in detail. Held at 9.

### 7. Galaxy Video store: 9
Walked on phone and desktop: the shopfront with Walk in and Skip, then the shelves, filters and decade and service pickers (25). No errors. Held at 9 for the cinema strip inside the store.

### 8. Table kit: 9.5
Not re-checked; nothing since review 17 touches it. Held.

### 9. Polish and craft: 9
Review 17's small items are fixed: no dish reads "waiting" (Old School "12 hr to dry", Rocky IV "8 hr to freeze", Midsommar "2 days to cure"), a start-cooking time on another day carries its day ("Thu 12 Nov, 10:45pm"), and an early show already past reads "This morning 6 Nov, 12:15am · showtime passed" (04).

Marks off:
- **Plural dishes take a singular verb.** "Shower cap swirled meringues takes longest on the night", "Knuckles's marmalade sandwiches takes longest", on the Prep sheet, panel, alarm and .ics. "Rigatoni, Sunday gravy takes" reads oddly too.
- Folded alarms keep the dish's capital mid-sentence: "Start cooking with Strawberry ice cream cones", "Start cooking with Cannoli".
- US spellings left in the data: "armor" in five cue and overheard lines ("Riri Williams in her armor", "Pepper in the armor", "Rhodey and the silver armor", "Rhodey in the War Machine armor", "The Batsuit armor") and "the old theater" (The Muppets). Proper names like Lincoln Center are fine.
- The strip counts down "in 1h 0m" while everything else says "1 hr 30 min".
- Tombstone's "Oriental Saloon pickled eggs, 3 days to chill" should be "to pickle", as Rocky IV's are.

### 10. Accessibility basics: 9.5
Review 17's two tap-size marks are fixed (02, 04). The calendar panel still opens with focus on Done and the status line still announces the saved file. Held short of 10 for the carried small swipe-view type.

## Fix list

1. **Club tag on paper.**
   Where: club.js, the "On stage tonight" tag over the stage photo; renderCanvas.
   Wrong: the tag is on screen and missing in the Save PDF copy and the real PDF, on all 34 club films (15, 16). check-print-text passes.
   Good looks like: the tag prints where it sits on screen; the check fails any text box on the card that does not reach the Save PDF canvas.

2. **Tiki woven band on paper.**
   Where: tiki.js, the band under the poster (two crossed repeating-linear-gradients, 90deg and 0deg); pdfStripes in app.js.
   Wrong: the light woven mat prints as a flat dark brown bar on all 17 tiki films (17).
   Good looks like: the band prints light and woven as on screen, within the tone check's limit.

3. **Money Train's caption.**
   Where: the Money Train hand-built menu, the caption under the right-hand photo on the second page.
   Wrong: "The money train runs right under us. Up here, cash only." wraps onto the footer rule and over the footer line, on screen and paper (18).
   Good looks like: the caption ends clear of the rule with room to spare, with web fonts loaded. A check for text overlapping other text, not only text leaving its panel, would catch the next one.

4. **A too-late dish leaves the plan.**
   Where: prepNight, planTrim and the shopping list builder in app.js.
   Wrong: Psycho says "Buy it ready-made" but still ticks the pickled onions, prints the 7-day recipe and lists "500g pickling onions" (01). Same for Rocky IV, Tombstone, Midsommar.
   Good looks like: the too-late dish becomes a shop-bought line ("1 jar pickled onions") with no recipe, or is unticked and the next pick takes its place; moving the night brings it back.

5. **Small items.**
   Scream's stamp perforations and key stripe (19), Role Models' dashed badges (20), Mean Streets' IOU lines (21), Nightmare 3's "Hospital" descender (22), Despicable Me 2's stray outline (23); "takes" with plural dish names; the capital after "Start cooking with"; "armor" and "theater" in six lines; "in 1h 0m" against "1 hr 30 min"; Tombstone's eggs "to pickle"; one button, not two, for next week after showtime (04).

## Genuinely excellent, leave alone

- The "Too late" handling: plain words, the first week it fits, a button that moves the night and saves the new file, and no alarm or Google link in the past (01 to 03). "Start now, it still fits" is exactly right.
- After showtime: "Add next week to calendar" does what it says, and the start-cooking row carries its day (04).
- One "longest on the night" number everywhere, and folded alarms that read as one job ("Start cooking with McClane's bourbon eggnog").
- Cook 5 on all 900 films.
- The tiki fourth island, picking a still not already on the map and naming it after the prop (09); Running Scared's plain card instead of an empty island (10).
- Layouts no longer reset each other's type: Jingle All the Way and Oppenheimer show their last dish after Jack Frost and Newsies (11, 12).
- Review 17's paper fixes: Ghost Dog's pills, Lebowski's sheet, The Heat's black, rounded trays, Kung Fu Panda's scroll, Anchorman's strike (05 to 08, 26, 27).
- A clean run: 17 node tests pass, check-print-text passes the five films I gave it, and no page errors in any run.

## Fixed after the review

1. **Club tag on paper.** The stage photo is masked, and the export baked the masked box into one picture with `innerHTML=""`, which wiped the tag. Words sitting on a masked photo now stay, laid over the picture (renderCanvas, the data-pmask loop). Popstar, Revenge of the Sith and John Wick 3 print "On stage tonight". New rule in check-print-text: every visible run of text on a face must still be visible in the copy html2canvas is handed ("text missing from the Save PDF copy"). It fails Popstar on the old build.
2. **Tiki woven band on paper.** Two causes. pdfStripes refused stops written "rgba(...) 0 2px" (a bare 0), so neither stripe was baked; and the band's blurred inset shadow was only baked on boxes over 120px, so html2canvas smeared it dark across the 75px band. Stops with a bare 0 now parse, inset shadows are baked on a box of any size, and straight stripes are baked on small boxes too. Moana's band measures 161 on paper against 159 on screen. New rules: "blurred inset shadow left for the PDF" and "straight stripes left for html2canvas"; both fail Moana on the old build.
3. **Money Train's caption.** The photo above it is 118px tall (was 150) and two gaps are tighter; the caption's words are unchanged and end 19px clear of the footer rule. New rule: "text runs into other text", comparing each line's ink with every other element's (display type 24px and up is measured at 0.7 of its size, so stacked headings set tight on purpose pass). Fails Money Train on the old build.
4. **A too-late dish leaves the plan.** planLate (app.js) finds a picked make-ahead dish that no longer fits before the locked-in showtime. planDishes leaves it out, so it is off the method and off the shopping list; it goes on the list under a last group, "Too late to make, buy ready-made". The planner shows it unticked and greyed with "too late for this night, buy ready-made", and a note with a "Move to <date>" button that moves the night and brings the dish back. The pick itself is kept. calPlan no longer counts a late dish's time on the night. The calendar still names it as too late. Psycho, Rocky IV, Tombstone and Midsommar checked at Fri 2:30pm for Sat 7pm. New case in tests/calendar.test.cjs.
5. **Small items.** Scream (2022): stamp perforations (pdfDots draws small radial tiles) and key stripe (small-box stripes) print. Role Models: outlines on boxes in the flow print as a frame inside the box. Mean Streets' IOU lines print (small-box stripes). Despicable Me 2: an inset ring frame was laid on the whole column because the copy's computed position read empty before it was in the page; it now sits on the logo plate. Tinted radial glows are baked too. Nightmare 3: the badge's venue box is 37px. "Longest on the night: <dish>, <time>" replaces "<dish> takes longest". calMid lowers a dish's capital after "with" unless the first word is a name (possessive, inner capital, or never written lower case in any dish name). "armour" (five lines and "Armour Mark 42") and "the old theatre"; the Muppet Theater and Pandora Theater stay as names; "SPIKED ARMOUR" on the hand-built card. Countdown reads "1 hr 30 min". Tombstone's eggs "to pickle" (recipe step now says pickle). After showtime the bar hides its calendar button and keeps "Same film next week".

New checks for the paper items: "outline left for html2canvas", "small radial tile left for html2canvas", "export frame laid on the wrong box", and the clip rule now checks a text box's own overflow and measures where the letters' ink really is (canvas measureText), with a 1.5px limit. That tighter rule found clipped tails of g, y and p (and a clipped tilde on "piña") on films across diner, cafe, dining car, precinct, tearoom and lab, which no review had named. descRoom (app.js, run at the end of fitLines) gives such a box just the room its letters spill, taken back with a negative margin so nothing else moves; a box hiding a whole line is left alone. Diner section heads and kickers also got the room in diner.js.
