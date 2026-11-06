# Sixteenth independent review

**Overall: 8.9 out of 10**

Every fix from review 15 that I could check holds. Crocodile Dundee II and Addams Family Values keep their campfire notes, Lady Bird keeps "cinnamon latte" on paper, Lethal Weapon 4's second galley sheet prints at the screen's size, Cloudy with a Chance of Meatballs and Man of Steel print on cream, BARTHOLOMEW fits whole on Skyfall's luggage tag, and The Godfather reads "with grape juice and shallots". The twelve films review 15 left open (The Martian, Mad Max 2, Furiosa, Jurassic World Dominion, Men in Black II, Deathly Hallows Part 2, Airplane!, Captain America: Civil War, The Jungle Book, The Wog Boy, Hook, Weekend at Bernie's) now show every dish name and note on screen and paper but one: Mad Max 2 still hides "Pappagallo's fair ration." under its cordial (13, 14). check-print-text misses it because the check runs without the poster photos, and with the photos the poster is taller.

The two new features are good. Any showtime works from the lock-in card and the bar, in 15-minute steps grouped Early hours to Night, and the strip, its countdown, the Prep sheet and the table kit all follow (02, 04, 05, 12). Add to calendar builds a clean, valid .ics on phone and desktop with the right start-cooking and day-before times for the dishes picked, and drops the day-before reminder when that dish is unticked. What holds it short: right after lock-in the Prep sheet does not show the showtime or start time (04) until you change the time or reload; a night whose showtime has already passed collapses the "Your movie night" bar into a narrow column with its label overprinted (10, 11); a dish that soaks for a week is called "The day before, from Sat 31 Oct" and "168 hr to soak"; and 64 films set the start-cooking alarm before noon because a same-day wait of up to nine and a half hours counts as cooking, so Chef wakes you at 7:40am for an 8:15pm movie.

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit 59d166a on wip/store-overhaul, with service workers blocked and Australia/Brisbane time. Web fonts and TMDB images came through the proxy. Every finding below was checked against a screenshot or the raw rendered text, not just the DOM. Screenshots are docs/review-16-01.png to review-16-28.png.

## How it was tested

- Any showtime, phone and desktop, by tap and by click: Lock in for this week, the Showtime select on the lock-in card (96 times, grouped Early hours 24, Morning 24, Afternoon 20, Evening 16, Night 12, 7pm selected) (01), changed to 8:15pm, then Director's cut (The Mummy, phone) and The full feature (Psycho, desktop). Then the bar's select changed to 6:45pm (05). Read after each change: the strip text (02, 08), the strip countdown, localStorage, the Prep sheet chips (04, 09) and the table kit's door sign ("Doors at 6:45 pm", 12). Also 12:30am (21), a 2pm showtime chosen at 3pm on the day (10), and both paths again after a reload.
- Add to calendar from the strip and from the bar on both sizes, three downloads each: at 8:15pm, at 6:45pm, and at 6:45pm with the day-before dish unticked on the Prep sheet. Every file was parsed with icalendar 7.3.0 and its times read back in Brisbane time against the dishes on the Prep sheet. Films: The Mummy (falafel soaked 12 hours, the Book of the Dead pastries longest on the night), Psycho (pickled onions soaked 7 days), Chef (a 12 hour 35 minute same-day lead), Big Trouble in Little China in Vegetarian mode, and The Mummy plus Psycho as a double feature. The follow-up panel was read on both sizes (06, 07), and every Google link decoded.
- The calendar plan worked out for all 900 films at a Saturday 7pm showtime with the default picks: lead dish, start time, and any day-before reminder.
- 57 films opened through the real Save PDF button (Menu and prep sheet) at 1440 wide with web fonts and TMDB images, every page rendered by pdftoppm and set beside a screenshot of the screen (13, 15 to 20, 27, 28). 45 are named in none of reviews 2 to 15, one or two from every shared layout and five hand-built (Annie Hall, 16 Blocks, Big Trouble in Little China, Tootsie, When Harry Met Sally...). Plus all 12 of review 15's open films, and 8 rechecks through Save PDF (Cloudy with a Chance of Meatballs, Man of Steel, Walk Hard, This Is the End, Lady Bird, A Bug's Life, Lethal Weapon 4, Beverly Hills Cop III) (24, 25). No page errors, console errors or failed local requests in any of the 65.
- scripts/check-print-text.cjs run by me on those 47 films: pass. Then the same script with one change, TMDB photos let through and waited for, over all 423 films on the 15 fit-pass layouts (27 minutes): fails on Mad Max 2's note, and on 20 stadium films where the title lettering is swapped for the logo picture. Those 20 are the check reading the lettering's hidden twin as a dish name, not a hidden dish; I read Semi-Pro's card and it prints the logo (28).
- A clip census on the 57: text that sits outside a box that clips. Only Big Trouble in Little China's take-away panel footnotes ("mild", "hot", "No MSG on request", "Serves four") sit outside, and they print on neither screen nor paper (19); low.
- Table kit on Skyfall with "Christopher", "Maria-Jose", "Bartholomew", "Anastasia", "Sam", "Jo", read at 4x.
- Review 15's other fixes: vegetarian cues on Splash, The Fly, Big Trouble, Oliver & Company, Iron Man; The Godfather in Vegetarian plus No alcohol; the phone Candy bar's page height; the data for "skillet", "wax paper", "graham crackers", "candies", "Takeout", "counselors", "traveler".
- Node tests in tests/ (all 18 pass, calendar.test.cjs and merge-guards included), and scripts/check-browser.cjs (16 checks, pass), both run by me. I cite the logs from this same build in the scratchpad for check-print-text on all 900 (pass, without photos), check-store-taps, check-sweet-starters, check-cut-words, check-kids-cards (343), check-prices (795), check-pdf-tone (sample and `--per 2`), check-phone-fit (900) and check-prep-a4 (1,708 pages): all pass.

What I could not test: no real iPhone, Android phone, Mac or Windows machine. I could not open the .ics in Apple Calendar, Google Calendar or Outlook, so I cannot say how each app shows the two alarms, whether Outlook keeps only the first, whether iOS offers "Add All" from Safari's download, or what Android's Google Calendar app does with a downloaded .ics. What I could verify is that the file is valid RFC 5545 (CRLF, 75-byte folding on character boundaries, escaped commas and semicolons, UTC times, RELATED=START triggers) and that the Google links open the template page with the right text and UTC dates. Headless Chrome's download is not a phone's download sheet.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9.5 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 9 |
| 4. Phone experience | 9 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 8.5 |
| 6. Candy bar | 9 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 9 |
| 9. Polish and craft | 8.5 |
| 10. Accessibility basics | 9 |
| **Overall** | **8.9** |

### 1. First impression and visual identity: 9.5
The locked-in strip is the right reminder: poster, title, "Tomorrow 7 Nov, 8:15pm · in 1 day 10h" and three 44px buttons, Menu, Prep sheet and Add to calendar, on one row on desktop and two lines on the phone (02, 08). The "Your movie night" bar below no longer repeats it. Mark off: on the phone the strip is now two-thirds of a screen of buttons above the marquee, so the marquee drops to the middle (02). Small.

### 2. Brand consistency: 9
Cinema red and gold through the lock-in card, the calendar panel and the strip; the table kit keeps its purple room. Held at 9 for the same reason as review 15: the cinema strip is the one cinema piece inside Galaxy Video.

### 3. Printed menus: 9
The sample is strong, and screen and paper match on all 57. Kicking & Screaming's kiosk, Neighbors' prom card, Anchorman 2's newsroom, Big Trouble's trifold, When Harry Met Sally's guest check, Narnia's tearoom, Beneath Hill 60 and The Good Dinosaur's campfire all print what the screen shows (19, 20, 27, 28). The twelve open films from review 15 now show every note, Hook and Weekend at Bernie's included (17).

Marks off:
- **Mad Max 2 hides one note on screen and paper.** "Pomegranate and lime cordial" prints with no note under it; the data has "Pappagallo's fair ration." and the fit pass sets it to display none (13, 14). The check that is meant to catch this passes, because it blocks the TMDB photos and the poster is shorter without them. Run with the photos it fails on this note.
- **A Bug's Life's last drink runs under the note card on paper.** On screen "Fresh honeydew juice 2.95" sits clear above the "Sticky fingers welcome" card (23); in the PDF the card covers the bottom of the line and its price (22). Review 15 fixed this with 10px spare on kiosk columns; with photos and web fonts loaded it is back.
- **Walk Hard's frame is mauve.** The PDF pages sit on a flat pinky grey (191, 171, 166) round a black menu with a thin mauve and black edge rule (26). Review 15 said it should print on its dark wall. Cloudy, Man of Steel and This Is the End print on light grey and cream as they should.
- Big Trouble in Little China's take-away panel has four footnotes ("mild", "hot", "No MSG on request", "Serves four") placed outside the panel, so they print on neither screen nor paper. Low.

### 4. Phone experience: 9
Both new selects are 44px tall and open the phone's own wheel, landing on 7pm in the Evening group (01). The calendar panel reads well at 390 wide with each reminder in its own box (06). No sideways scroll on any view. Held at 9: the small swipe-view type on hand-built cards from review 15 is unchanged, and the bar collapses after showtime (section 5).

### 5. Core flow: 8.5
Locking in now asks the time first, and every place that shows it follows: the strip, its countdown, the bar, the Prep sheet's "Showtime 6:45pm" and "start cooking 5:15pm" chips, and the table kit's door sign (04, 05, 09, 12). A time already gone tonight moves the night to next week from the lock-in card ("Saturday 14 Nov, 2pm · in 6 days 23h"), which is right.

Add to calendar is well built. Every file parses, lines are CRLF and folded at 75 bytes, the times are UTC so any phone shows its own zone, and the two alarms hang off the event start. Checked against the Prep sheet:
- The Mummy, 8:15pm, Director's cut: event 8:15pm to 10:45pm Saturday; "Start cooking" alarm 6:45pm (the walnut honey pastries take longest, 1 hr 30 min); "Prep ahead" alarm Friday 6pm for the falafel, 12 hours to soak. Changed to 6:45pm on the bar: 5:15pm and Friday 6pm. Falafel unticked: one alarm, no prep-ahead line (06).
- Psycho, The full feature: start cooking 6:15pm (the meringues, 1 hr 57 min); prep ahead Saturday 31 Oct 7:45pm for the pickled onions, a week ahead, and the Prep sheet says "start 7 days ahead" (07, 09).
- Double feature (The Mummy plus Psycho): one five-hour event and both make-ahead dishes in one reminder. Vegetarian Big Trouble: the dish is named "Pork-Chop Express char siu mushroom ribs" in the reminder, as on the card.
- Wording in the notes: "Showtime 6:45pm. Start cooking at 5:15pm (Book of the Dead walnut honey pastries takes longest, 1 hr 30 min). The day before, from Fri 6 Nov 6pm: Cairo bazaar falafel, 12 hr to soak. Menu and Prep sheet: (link)". Plain and useful.

Marks off:
- **The Prep sheet misses the showtime right after lock-in.** Lock in, pick Director's cut or The full feature, and the Prep sheet the app opens on reads "Serves 4 / 5 dishes / hands-on 1 hr 4 min / longest 1 hr 25 min / start the day before" with no showtime and no start time (04). They appear only after the time is changed on the bar or the page is reloaded (05, 09). Desktop the same. This is the first Prep sheet anyone sees after locking in.
- **The bar falls apart once showtime has passed.** With the night's showtime gone, "Scheduled showtime has passed. Open your menu or lock in a new movie night." takes the bar's first row, the "Your movie night" label is squeezed to a word a line and printed over by the message, and Cook night, the date, Showtime, both selects (shown empty) and all three buttons stack in a narrow column. On desktop (10) and phone (11). Anyone who opens the app after the movie sees this.
- **Long same-day waits push the start-cooking alarm into the morning.** A wait under 10 hours counts as part of cooking, so 64 of 900 films start before noon at a 7pm showtime, 12 before 9am: Chef 6:25am (El Jefe Cubano, 12 hr 35 min), Ace Ventura 6:30am, Scrooged and The Muppet Christmas Carol 6:35am (the pudding), Bad Boys 7:10am, Big Trouble 8:40am for ribs that marinate 8 hours. The reminder then says "El Jefe Cubano takes longest, 12 hr 35 min", which hides that most of it is the meat sitting in the fridge. A tiramisu that sets for 8 hours (John Wick: Chapter 2, Ocean's Twelve) starts at 10:30am, where a cook would make it the night before or first thing.
- **A week-long soak reads as "the day before" and "168 hr".** Psycho's notes say "The day before, from Sat 31 Oct 7:45pm: Mother's pickled onions, 168 hr to soak." Eight films soak or pickle for three to seven days (Psycho, Mad Max, Smokey and the Bandit, The Ring, Road House, Rocky IV, Tombstone, Unforgiven) and Midsommar's gravlax for two. The panel and Prep sheet get the date right; the words do not.
- Carried from review 15: a vegetarian card still prints a dish with no vegetarian version (by design, low).

### 6. Candy bar: 9
The phone page for one film is 2,630px with a film locked in (2,484px without), as review 15's fix said. Combos and the glass case slide sideways. Held at 9.

### 7. Galaxy Video store: 9
Unchanged and right. Held at 9 for the cinema strip inside the store.

### 8. Table kit: 9
"BARTHOLOMEW", "CHRISTOPHER" and "ANASTASIA" print whole on Skyfall's luggage tags, and the intermission card carries its own line. The Mummy's door sign reads "Doors at 6:45 pm" after the bar changed the time (12). Mark off: the kit writes "6:45 pm" with a space where the strip, the bar, the Prep sheet and the calendar all write "6:45pm". Small, but it is the same time in two spellings on one night.

### 9. Polish and craft: 8.5
The new copy is plain and good: "Start cooking. Book of the Dead walnut honey pastries takes longest, 1 hr 30 min", "Google Calendar drops reminders from a file, so add each one here: the night, start cooking, prep ahead". No dashes, no "undefined", no errors in any run. "skillet", "wax paper", "graham crackers" and "counselors" are gone from the data.

Marks off:
- The calendar wording in section 5: "The day before" for a week, "168 hr", and a 12 hr 35 min "longest dish" that is mostly marinating.
- The panel says the file "is downloading. Open it to add the night and its reminders to Apple Calendar or Outlook." What a phone does with the file differs (Safari on an iPhone usually asks first; Google Calendar's Android app does not import a downloaded .ics). I could not test either on a device; the words do not say what to tap.
- Left over in the data: "popping candies" on five shopping lists (Dude, Where's My Car?, Fantastic Four, Guardians of the Galaxy Vol. 2 among them; "popping candy" in Australia), "Takeout all day" on Die Hard with a Vengeance's kit sign, "takeout downstairs" in Ghostbusters (2016), and "Two travelers to Lisbon" on Casablanca's letters of transit.
- Kids' mode: The Out-of-Towners' cherry cola still reads "Ginger, sweet bitter orange and bitters". Low, carried.

### 10. Accessibility basics: 9
Both showtime selects have labels ("Showtime"), the calendar panel opens with focus on Done, and its rows are real text. The status line announces "Calendar file saved: movie night Sat 7 Nov 6:45pm, start cooking 5:15pm." Held at 9 for the collapsed bar after showtime and the small swipe-view type on hand-built cards.

## Fix list

1. **Prep sheet shows the showtime from the moment you lock in.**
   Where: lockAsk in app.js (the lock-in card's two buttons) and prepWhen.
   Wrong: after lock-in the Prep sheet has no "Showtime" or "start cooking" chip until the time is changed or the page reloads (04).
   Good looks like: the first Prep sheet after Director's cut or The full feature reads "Showtime 8:15pm / start cooking 6:45pm / Serves 4 ..." on phone and desktop.

2. **The bar after showtime.**
   Where: renderWeek and tickShowtime in app.js, .week-slim styles in index.html.
   Wrong: once showtime passes, the message takes the bar's grid row, the label is printed over and everything else stacks in a narrow column with empty selects (10, 11).
   Good looks like: the bar keeps its layout; the "showtime has passed" line sits under the buttons at full width, with a clear way to pick next week's night.

3. **Start cooking at a sensible time.**
   Where: calPlan in app.js, and the Prep sheet's "longest" chip.
   Wrong: 64 films start before noon at a 7pm showtime, 12 before 9am, because waits of up to 9 hr 59 min count as cooking (Chef 6:25am, Scrooged 6:35am, John Wick 2's tiramisu 10:30am).
   Good looks like: a wait of about 4 hours or more becomes a "Prep ahead" reminder with its own time (the night before, or the morning at a decent hour), and start cooking is set by the longest hands-on and oven time. The text names the wait: "El Jefe Cubano: marinate from 9am, cook from 4:20pm".

4. **Say how far ahead.**
   Where: calText and the panel rows in calAdd.
   Wrong: "The day before, from Sat 31 Oct 7:45pm: Mother's pickled onions, 168 hr to soak."
   Good looks like: "A week before, from Sat 31 Oct: Mother's pickled onions, 7 days to soak." Days for anything over 48 hours, "the day before" only when it is.

5. **Mad Max 2's note, and a check that loads the photos.**
   Where: the lab fit pass in menu-formats/lab.js; scripts/check-print-text.cjs.
   Wrong: "Pappagallo's fair ration." hidden on screen and paper (13, 14); the check blocks image.tmdb.org, so it passes.
   Good looks like: the note prints; check-print-text lets the photos load (or fixes their size) and fails on this film. Its stadium title-lettering twin should not count as a dish name.

6. **Paper matches the screen, again.**
   Where: kiosk spacing; edgeColour for club.
   Wrong: A Bug's Life's "Fresh honeydew juice" runs under the note card in the PDF (22, 23); Walk Hard prints on mauve (26).
   Good looks like: kiosk keeps its spare room with the photos loaded; Walk Hard's frame is its dark wall.

7. **The calendar panel tells each phone what to do.**
   Where: the .cal-how lines in calAdd.
   Wrong: "is downloading. Open it" fits a desktop, not a phone's download sheet.
   Good looks like: one line per platform, worked out from the device: "iPhone: tap Allow, then Add All", "Android: use the Google links below". Checked on real devices before the words go in.

8. **Small items.**
   "6:45 pm" on the table kit where the rest of the app says "6:45pm" (12); "popping candies", "Takeout all day", "takeout downstairs", "travelers"; Big Trouble's four panel footnotes placed outside the panel (19); the phone strip's height above the marquee (02); The Out-of-Towners' bitters in kids' mode.

## Genuinely excellent, leave alone

- The .ics itself: valid on every download, UTC times, folded on character boundaries, two alarms relative to the start, a stable UID per film and night so a second download updates rather than duplicates, and the reminders follow exactly what is ticked on the Prep sheet (06, 07).
- The showtime picker: 96 times in five named groups, 7pm by default, the same control on the lock-in card and the bar, and the strip, countdown, Prep sheet and table kit all following it (01, 05, 12).
- Review 15's long-menu work: every note shows on the twelve films it left open but one, and on all 45 new films in this sample (15 to 20, 27, 28).
- Save PDF across 65 films with photos and web fonts: screen and paper match on all but A Bug's Life, with no errors.
- Skyfall's tags with long names, The Godfather's grape juice, the vegetarian showtime cues ("Serve the mains when Madison eats a whole lobster at the restaurant").
- A clean run: 18 node tests and check-browser pass, and no console errors, page errors or failed local requests anywhere.

## Fixed after the review (6 Nov, afternoon)

1. **Prep sheet at lock-in.** setWeek and both lock-in buttons redraw the Prep sheet once the week holds the film (refreshPrepTime), and so does the lock-in card's showtime picker. The first Prep sheet after Director's cut or The full feature reads "Showtime 8:15pm / start cooking 6:45pm / ..." on phone and desktop.
2. **The bar after showtime.** The showtime line now sits under the buttons at full width (it was opening a second grid column in the one-column slim bar). It reads "Scheduled showtime has passed. Run it again next week, or lock in a new movie night from any menu." with a "Same film next week" button that moves the night on seven days.
3. **Start cooking.** A wait no longer pushes the start time. calNight (app.js) works out what is left to do on the night after a dish's last long wait (2 hours or more, or one the recipe puts overnight), from the recipe's own steps; the longest of those sets start cooking, so a long braise still can. A dish with a long wait is made ahead: earlier that day from the latest time that still fits (new "Make ahead today" reminder, its own alarm and Google link) when that is after 8am and before start cooking; the night before at 6pm when the recipe says overnight, the wait is 10 hours or more, or it would have to start before 8am. The start-cooking alarm names the made-ahead dishes. At a 7pm Saturday showtime across all 900: Chef 2:35pm (the 4 hour roast) with the marinade the night before, Scrooged's pudding the same, John Wick 2's tiramisu the night before (the recipe says overnight), Big Trouble 4:55pm with the ribs marinated the night before. Two films start before 1pm, both for real slow cooking: Old School 9:30am (8 hour brisket) and Carlito's Way 12:55pm (5 hour pernil). The Prep sheet of the locked-in film shows "make ahead from ..." and "prep ahead ..." chips in place of the generic wait chip.
4. **How far ahead.** Durations of 48 hours or more read in days, and the reminder says the right day: "A week before, from Sat 31 Oct 6pm: Mother's pickled onions, 7 days to soak." (calAhead: The night before, The day before, Two days before, A week before). A multi-day wait lands at 6pm on the latest day that fits.
5. **Mad Max 2.** The lab layout's last give-way is the film's logo at 60 per cent of its size (data-squash), never hidden; "Pappagallo's fair ration." prints, and every Mad Max 2 note is back at full length. check-print-text now loads the TMDB photos and waits for them (MNS_PHOTOS=0 for a quick run without), and skips stadium's title in type ([data-ltype]) while the logo picture shows.
6. **Paper matches the screen.** Kiosk columns keep 24px spare (was 10px): A Bug's Life's honeydew juice prints clear of the note card. edgeColour skips a pair of sides that are a striped border (four colour changes in their first 6 per cent) so Walk Hard's pages print on the dark wall, not mauve.
7. **Calendar panel by device.** iPhone or iPad: "tap Allow if Safari asks, then Add to Calendar." Android: "the Google Calendar app cannot open this file, so use the Google links below. Outlook or Samsung Calendar can open it from Downloads." A computer keeps the download line. Not checked on real phones yet.
8. **Small items.** Table kit times read "6:45pm" (kitTime). "popping candy", "Takeaway all day", "takeaway downstairs", "Two travellers to Lisbon". Big Trouble's first panel has tighter gaps so its key prints. Phone strip is 112px (was 132px): no kicker, thumbnail poster, three 44px buttons on one row. Kids' mode reads The Out-of-Towners' cherry cola as "Ginger, cherry syrup and orange" (sweet vermouth and bitters swap together; bitters alone become orange zest, lemon lime and bitters left alone).
