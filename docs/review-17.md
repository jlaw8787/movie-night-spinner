# Seventeenth independent review

**Overall: 9.0 out of 10**

Every fix listed under "Fixed after the review" in review 16 holds when checked by hand. The Prep sheet carries "Showtime 8:15pm / start cooking 6:45pm / prep ahead Fri 6 Nov 6pm" the moment Director's cut or The full feature is tapped, on phone and desktop (01, 02). The bar keeps its shape once showtime has gone, with the message under the buttons and a "Same film next week" button that works (04, 05). The start-cooking rule is sound now: across all 900 films at a Saturday 7pm showtime only Old School (9:30am, an 8.5 hour brisket) starts before noon and only Carlito's Way (12:55pm, pernil) before 1pm. Psycho reads "A week before, from Sat 31 Oct 6pm: Mother's pickled onions, 7 days to soak." Mad Max 2 prints "Pappagallo's fair ration." (16), A Bug's Life's honeydew juice prints clear of the note card (17), Walk Hard prints on its dark wall (19), Big Trouble's key line prints (18), the table kit reads "Doors at 6:45pm", The Out-of-Towners' kids' drink is "Ginger, cherry syrup and orange", and the leftover US words are gone from the data.

What holds it short of 9.5 is a new set of smaller faults, mostly ones the existing checks cannot see. Ghost Dog's printed menu loses all four section headings on paper: the coloured pills print empty (09, 10). The Big Lebowski's score sheet cuts the end of its showtime cue and the third house rule on screen and on paper (11, 12). The Heat prints its black side panels as charcoal, and the team's own tone check fails it once the photos load (13). Every canteen tray prints with square, stepped corners where the screen has a soft rounded tray (14, 15). On the calendar side, a make-ahead time that has already gone is offered without a word: lock in Psycho today for tomorrow night and the Prep sheet, the panel and the .ics all say "prep ahead Sat 31 Oct 6pm", six days ago (02, 03). Nine films do this for a Saturday night planned today. The Prep sheet's "longest" chip and the calendar's "takes longest" also give two different numbers for the same night (01).

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit 13c3282 on wip/store-overhaul, with service workers blocked and Australia/Brisbane time, on Friday 6 Nov 2026 in the afternoon. Web fonts and TMDB images came through the proxy. Every finding below was checked against a screenshot or the raw rendered text, not just the DOM. Screenshots are docs/review-17-01.png to review-17-22.png.

## How it was tested

- Lock-in with showtime, by tap and by click: Lock in for this week on The Mummy (phone, Director's cut) and Psycho (desktop, The full feature). The lock-in card's select had 96 times in five groups (Early hours 24, Morning 24, Afternoon 20, Evening 16, Night 12) with 7pm selected; changed to 8:15pm before the choice. Read straight after: the Prep sheet chips (01, 02), the strip, localStorage. Then the bar's select changed to 6:45pm and everything read again.
- Add to calendar from the strip (8:15pm) and from the bar (6:45pm) on both sizes. The four .ics files were parsed with Python icalendar and read back in Brisbane time: CRLF throughout, no line over 75 bytes, one VEVENT, a stable UID per film and date, alarms relative to the start. The Google links were decoded. The panel was read with an iPhone Safari user agent, an Android Chrome one and the desktop default (07, 08).
- The calendar plan checked against the Prep sheet for The Mummy, Psycho, Chef, John Wick: Chapter 2, Big Trouble in Little China and Midsommar, each locked in for Saturday 7pm, using calDishes and calPlan in the page.
- The calendar plan for all 900 films at Saturday 7 Nov, 7pm, default picks: start time, lead dish, any make-ahead-today and prep-ahead reminders, and their wording.
- The bar after showtime: mns-week set to The Mummy, Friday 6 Nov, 12:15am, on phone and desktop (04, 05, 21). Add to calendar pressed on that passed night (06). "Same film next week" pressed.
- Save PDF: 45 films, the card on screen at full size beside renderCanvas(card,true) after loadExportTools(true), with web fonts and photos allowed. 38 are named in none of reviews 2 to 16: one or two from every shared layout (banquet, bar tab, bistro, cafe, campfire, candy bar, canteen, club, diner, dining car, galley, home, hotel, invite, kiosk, lab, newspaper, placemat, precinct, prom, stadium, takeaway, tavern, tearoom, tiki, truck, airline, saloon, motel, pub) and six hand-built (Ghost Dog, Home Alone 2, Teenage Mutant Ninja Turtles II, Anchorman, The Big Lebowski, Kung Fu Panda). Plus two more canteen films, and rechecks of A Bug's Life, Walk Hard, Mad Max 2, Big Trouble in Little China and Semi-Pro. Every pair was looked at, with a pixel difference score to find the worst. Walk Hard, Ghost Dog, The Heat and Semi-Pro were also saved through the real Save PDF button and the pages rendered with pdftoppm (09, 19, 20).
- A census of all 90 hand-built menus for filled inline-flex boxes holding text (the shape that prints empty on Ghost Dog).
- scripts/check-print-text.cjs run by me on the 45 sample films: pass. scripts/check-pdf-tone.cjs with MNS_NET=1 on The Heat, Indiana Jones and the Kingdom of the Crystal Skull, Ghost Dog and Popstar: fails on The Heat (+9.3 levels lighter, limit 6).
- Phone strip height, the table kit's door sign on The Mummy at 6:45pm, kids' mode on The Out-of-Towners (menu and Prep sheet), and a data search for "popping candies", "Takeout", "takeout", "travelers".
- Node tests: `node --check app.js` and all 17 tests/*.test.cjs except dialogs.test.cjs, all pass. scripts/check-browser.cjs: 16 checks, all pass. I did not run check-print-text, check-prep-a4 or check-phone-fit across all 900 (run separately, as asked).

What I could not test: no real iPhone, Android phone, Mac or Windows machine, so I cannot say whether Safari really asks "Allow" and then shows Add to Calendar, or what Outlook and Samsung Calendar do with the file on Android. The device wording was checked by user agent only. I could not open the .ics in Apple Calendar, Google Calendar or Outlook, so I cannot say how each shows an alarm whose time has already passed. I did not re-measure the Candy bar or walk the Galaxy Video store; nothing in the commits since review 16 touches them.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9.5 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 8.5 |
| 4. Phone experience | 9 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 9 |
| 6. Candy bar | 9 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 9.5 |
| 9. Polish and craft | 9 |
| 10. Accessibility basics | 9 |
| **Overall** | **9.0** |

The straight average is 9.05; like review 16, I round down.

### 1. First impression and visual identity: 9.5
The phone strip is now 112px with the poster as a thumbnail and Menu, Prep sheet and Add to calendar on one row, all 44px (21). The marquee sits higher than in review 16. Desktop keeps "Coming up" over the title. Nothing to mark off beyond what review 16 held.

### 2. Brand consistency: 9
Unchanged. Held at 9 for the cinema strip inside Galaxy Video, as before.

### 3. Printed menus: 8.5
Review 16's paper faults are all fixed: Mad Max 2's cordial note prints (16), A Bug's Life's last drink is clear of the note card (17), Walk Hard's PDF pages are dark grey (31, 31, 31) not mauve (19), Big Trouble's "mild, hot, No MSG on request, Serves four" line prints (18), and Semi-Pro prints its logo (20). Most of the 38 new films match screen and paper closely: The Hobbit's Bill of Fare, Popstar's club, Three Amigos' cantina, Thunderbolts' lab, Nativity's prom, Dodgeball's stadium, Paddington in Peru's hotel, Batman Returns' tearoom, the Conjuring 2 newspaper, Home Alone 2's suite and Anchorman's rundown.

Marks off:
- **Ghost Dog prints four empty headings.** On screen the section pills read "Glaces ICE CREAM", "À grignoter SNACKS", "Le plat chaud HOT" and "Boissons COLD". Through the real Save PDF button they print as plain red and green bars with no words (09, 10). Same without web fonts. The pills are inline-flex boxes with a fill; the census found this shape on no other hand-built menu. check-print-text passes the film because it looks for filled inline-blocks, not inline-flex.
- **The Big Lebowski cuts its own words, on screen and paper.** The showtime cue "Showtime: Serve a White Russian every time the Dude makes one." runs off the bottom of the score sheet, so "Dude makes one." sits faintly under the rug band. The House Rules box shows "LEAGUE NIGHT. HOUSE RULES." with the third line cut in half (11, 12). Not caught because the check reads dish names and notes, not cues or panels.
- **The Heat prints charcoal where the screen is black.** The two side panels read about (29, 25, 24) on screen and (50, 43, 38) on paper, with a grain showing (13). check-pdf-tone with photos loaded fails it: brightness +9.3 levels against a limit of 6.
- **Canteen trays lose their rounded corners on paper.** The screen tray is a soft green or grey rounded tray with a shadow. On paper the bottom becomes a flat band with square notched corners, and pale ledges show between compartments (14, 15). Seen on Indiana Jones and the Kingdom of the Crystal Skull, Deadpool 2 and Shutter Island; canteen has 60 films. The tone check cannot see it (Crystal Skull +0.4 levels).
- Small: Kung Fu Panda's poster scroll has red edge bands on screen that are missing on paper (22); Popstar's VIP pass is near black on screen and silver grey on paper; Anchorman's "Ice cold milk" strike prints as a thin black line where the screen has a thick red one.

### 4. Phone experience: 9
The calendar panel reads well at 390 wide (07), and now speaks to the device: "iPhone or iPad: tap Allow if Safari asks, then Add to Calendar. The reminders come with it." and, on Android, "the Google Calendar app cannot open this file, so use the Google links below. Outlook or Samsung Calendar can open it from Downloads." (08). After Director's cut the phone lands on the Choose dishes list, and the Prep sheet below it carries the showtime chips (01). No sideways scroll anywhere I looked.

Marks off:
- "Same film next week" is 36px tall on the phone, where every other button in the bar is 44px (05).
- The Google links in the calendar panel are inline text links 20px tall ("the night", "start cooking"), close together on one line (07).
- Carried: small type in the swipe view of hand-built cards.

### 5. Core flow: 9
All four calendar faults from review 16 are fixed, and the plan is now what a cook would do. Checked against the Prep sheet at Saturday 7pm:
- The Mummy: start cooking 5:30pm (pastries, 1 hr 30 min), falafel soaked from Fri 6 Nov 6pm. At 8:15pm the .ics alarm is 6:45pm, at 6:45pm it is 5:15pm, both matching the Prep sheet chips.
- Psycho: start 5pm (meringues, 1 hr 57 min), pickled onions "A week before, from Sat 31 Oct 6pm".
- Chef: start 2:35pm for the El Jefe Cubano roast (4 hr 25 min on the night), marinade the night before.
- John Wick: Chapter 2: start 5:30pm (supplì), tiramisu the night before, 8 hr to set.
- Big Trouble in Little China: start 4:55pm, ribs marinated the night before.
- Midsommar: start 5:30pm, gravlax "Two days before, from Thu 5 Nov 6pm".

Across all 900: 1 film starts before noon (Old School 9:30am, an 8 hr 30 min brisket), 2 before 1pm (Carlito's Way 12:55pm), 18 before 2pm, every one a real slow roast or barbecue (Aladdin's lamb, The Good Dinosaur's ribs, Fury Road's lamb shoulder, The Wog Boy's spit lamb). 205 films get a "Make ahead today" reminder, 165 a prep-ahead one, 156 of those at 6pm Friday. That is the right result for the reason the team gave: only time spent on the night sets the start.

Marks off:
- **A prep-ahead time that has already gone is offered as if it were fine.** Lock in Psycho on Friday afternoon for Saturday and the Prep sheet says "prep ahead Sat 31 Oct 6pm" (02), the panel lists "Sat 31 Oct, 6pm: A week before" (03), and the .ics carries an alarm six days in the past. For a Saturday night planned now, nine films do this: Psycho, Mad Max, Smokey and the Bandit, The Ring and Road House (Sat 31 Oct), Rocky IV (Tue 3 Nov), Tombstone and Unforgiven (Wed 4 Nov), Midsommar (Thu 5 Nov). The five week-long pickles are already too late by Monday. Nothing says "too late" or offers a way round it.
- **Add to calendar still works on a night that has passed.** With showtime gone, the bar's button downloads an event for "Fri 6 Nov, 12:15am" with "Start cooking 10:45pm" and a prep-ahead alarm for Thursday, and the status line says "Calendar file saved" (06). It should point to next week instead.
- **Two "longest" numbers on one night.** The Prep sheet chip is the longest cook time; the calendar's is the longest time on the night including short waits. The Mummy: chip "longest 1 hr 25 min", calendar "pastries take longest, 1 hr 30 min" (01). Psycho 1 hr 10 min against 1 hr 57 min, Chef 4 hr 35 min against 4 hr 25 min, Midsommar 35 min against 1 hr 30 min. Same word, different sums.
- **A make-ahead alarm 15 minutes before start cooking.** Ten films set "Make ahead today" within half an hour of "Start cooking": Die Hard 2 4:15pm then 4:30pm, Hot Fuzz 2:45pm then 3pm, Blade 4:45pm then 5pm, The Godfather 4:30pm then 5pm, and Smokey and the Bandit, The Man from Snowy River, Paddington 2, Shanghai Noon, Arthur Christmas, Snow White. Two alarms that close are one alarm.
- Worth a look, not marked off: 42 films tick six or seven dishes by default (Paddington 2 "6 of 7", The Wizard of Oz "7 of 9", Hot Fuzz "6 of 7"), where the handover's rule says "Menus: show all dishes, cook 5". It may be a deliberate exception for hand-built menus; I could not find it written down.

### 6. Candy bar: 9
Not re-measured; nothing in the review 16 fix commit touches it. Held at 9.

### 7. Galaxy Video store: 9
Not walked this time; untouched since review 16. Held at 9 for the cinema strip inside the store.

### 8. Table kit: 9.5
The one mark review 16 took off is fixed: The Mummy's door sign reads "Doors at 6:45pm", the same spelling as the strip, bar, Prep sheet and calendar. Nothing else changed and nothing else to mark off.

### 9. Polish and craft: 9
The leftover words are gone: no "popping candies", "Takeout" or "travelers" in the data; "Takeaway all day", "takeaway downstairs" and "Two travellers to Lisbon" are in. The Out-of-Towners' kids' cherry cola reads "Ginger, cherry syrup and orange, stirred, with a cherry." The new calendar copy is plain: "A week before", "The night before", "Made ahead: Cairo bazaar falafel."

Marks off:
- **"Waiting" says nothing.** 36 prep-ahead dishes read "N hr waiting" or "N days waiting": "Frank the Tank's wings, 12 hr waiting" (Old School), "Ninety-year feast dill gravlax, 2 days waiting" (Midsommar), "Log cabin pickles, 4 days waiting" (Rocky IV), "Cypher's steak, 24 hr waiting" (The Matrix). The others say what is happening ("to soak", "to marinate", "to set").
- The panel's start-cooking row shows a time with no day even when it falls on the day before: a 12:15am showtime lists "10:45pm" under "Fri 6 Nov, 12:15am" (06). The status line says "start cooking 10:45pm" too.
- An early-hours showtime reads "Tonight 6 Nov, 12:15am · showtime passed" in the strip at 2:30pm the same day (21). It was this morning, not tonight. Low.

### 10. Accessibility basics: 9
The bar after showtime now keeps its labels, selects and buttons in order, and its message reads as one line of text (04, 05). The calendar panel opens with focus on Done; the status line announces the saved file. Held at 9 for the 36px "Same film next week" button, the 20px Google links, and the carried small swipe-view type.

## Fix list

1. **Ghost Dog's section headings on paper.**
   Where: renderCanvas in app.js, the pass that turns filled inline-blocks holding text into tables; scripts/check-print-text.cjs.
   Wrong: the four pills ("Glaces", "À grignoter", "Le plat chaud", "Boissons") are filled inline-flex boxes and print empty (09, 10). check-print-text passes the film.
   Good looks like: the pills print their words; the pass and the check treat inline-flex like inline-block.

2. **The Big Lebowski's score sheet keeps its cue and rules.**
   Where: the lanes format in formats.js.
   Wrong: "Dude makes one." falls under the rug band and the third House Rules line is cut, on screen and paper (11, 12).
   Good looks like: the cue and all three rules sit inside the sheet with room to spare, with web fonts loaded. A check that reads cues and side panels, not only dish names and notes, would catch the next one.

3. **Say when a prep-ahead time has gone.**
   Where: calPlan, prepWhen and calAdd in app.js.
   Wrong: Psycho locked in today for tomorrow reads "prep ahead Sat 31 Oct 6pm" on the Prep sheet, panel and .ics (02, 03); nine films do this for a Saturday night planned today.
   Good looks like: when the time has passed, the chip and panel say so in plain words ("Too late for the week's pickle: buy a jar, or move the night to Sat 14 Nov"), and the .ics and Google links leave out an alarm in the past.

4. **No calendar file for a night that has passed.**
   Where: calAdd, and the bar's Add to calendar button in renderWeek.
   Wrong: after showtime the button downloads the old night with a start-cooking time the evening before (06).
   Good looks like: after showtime the button is hidden or reads "Add next week to calendar" and uses next week's date, matching "Same film next week".

5. **One meaning of "longest".**
   Where: the Prep sheet's "longest" chip (prepHTML2) and calText.
   Wrong: The Mummy's chip says 1 hr 25 min and the calendar 1 hr 30 min; Midsommar 35 min against 1 hr 30 min (01).
   Good looks like: one number for the same night, or two different words ("longest cook 1 hr 25 min", "start 1 hr 30 min before").

6. **Fold close alarms into start cooking.**
   Where: calPlan.
   Wrong: ten films set "Make ahead today" 15 to 30 minutes before "Start cooking" (Die Hard 2 4:15pm and 4:30pm).
   Good looks like: when the make-ahead time is within about 45 minutes of start cooking, start cooking moves to it and names the dish first.

7. **Paper matches the screen on The Heat and the canteen trays.**
   Where: takeaway's side panels and canteen's tray in the renderCanvas export copy.
   Wrong: The Heat prints charcoal (+9.3 levels, the team's own check fails) (13); canteen trays print square with notched corners and ledges (14, 15).
   Good looks like: The Heat's panels print near black; trays print rounded as on screen, on all 60 canteen films. Run check-pdf-tone with MNS_NET=1 as part of the routine.

8. **Small items.**
   "N hr waiting" on 36 dishes (say to cure, to brine, to rest); a day on the start-cooking row when it is not the show day (06); "Tonight" for an early-hours show already past (21); "Same film next week" at 44px on the phone (05); bigger tap areas for the Google links (07); Kung Fu Panda's scroll edges (22), Popstar's VIP pass and Anchorman's red strike on paper; confirm whether 42 films ticking six or seven dishes by default is meant.

## Genuinely excellent, leave alone

- The start-cooking rule. Across 900 films at 7pm only one starts before noon, and that one is a real eight and a half hour brisket. Long marinades and soaks go to the night before, short sets go earlier the same day, and the reminder names what was made ahead.
- "How far ahead" wording: "The night before", "Two days before", "A week before", in days once it passes 48 hours (03).
- The bar after showtime: same layout, message under the buttons, and "Same film next week" moves the date on seven days and says "Moved to Friday 13 Nov, 12:15am." (04, 05).
- The .ics: valid on every download, CRLF, folded at 75 bytes, UTC times, a stable UID per film and night, alarms relative to the start in the right order.
- The device-aware panel copy for iPhone and Android (07, 08).
- Review 16's paper fixes: Mad Max 2's note, A Bug's Life's spare room, Walk Hard's dark wall, Big Trouble's key line, all holding with photos and web fonts (16 to 19).
- The table kit's time spelling, the kids' Out-of-Towners drink, and a clean data search for the US words.
- A clean run: 17 node tests, check-browser's 16 checks and check-print-text on 45 films pass, with no page errors in any run.
