# Fourteenth independent review

**Overall: 8.6 out of 10**

Every fix from review 13 holds. Skyfall's and True Grit's recipe cards print white (16), The Conjuring and Fantasia keep their burnt tavern edges on paper (17), The Fly keeps its grimy lab sheet, Mallrats prints its checker border (18), Minions sits on brown bands, and An American Tail's logo plate stays white. Vegetarian Make ahead notes name what they cook. The phone tabs fit on all 900 films. Director's cut reads "20 min + 12 hr wait, start the day before" (26). The Farewell lists "a 565g tin lychees", Iron Man 2 has "Giant sprinkle doughnuts", Jurassic Park says "theatre" and You've Got Mail "neighbour". The comma titles read right everywhere: "Star Wars: Episode I, The Phantom Menace" and "Mission: Impossible, Fallout" on the card, phone menu and Prep sheet, with no spaced hyphen left in any of the five titles. Every test and check script passes.

What holds this short of 9.5 is again a set of smaller faults, and most of them are things the tone check cannot see, because it measures brightness, not missing words. On paper, The Warriors' map prints its six station labels as solid black boxes (03, 04). The club layout (34 films) loses the soft fade under its stage photo, so the title sits on a hard photo edge (05), and Cruella's chrome heading prints as a blank silver bar (06). The fit pass that stops text overflowing hides whole lines instead: 887 lines on 200 films, among them a dish name on Night at the Museum (09) and most of the dish notes on The Martian, Brave and Maleficent (07, 08). The white frame Save PDF adds round each page takes its colour from too deep a strip, so The Lost World's newspaper gets a red frame and The Phantom Menace a black one (11, 12). With Vegetarian on, the phone menus on hand-built films keep the meat names over the vegetarian recipe ("Roast pork, whole-pig style" over a stuffed pumpkin, 15). In kids' mode, Director's cut still lists "Rye and jasmine tea highball (alcohol-free)" (14). The truck layout prints its window line twice (10).

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit 7e6c0a5 on wip/store-overhaul, with service workers blocked and Australia/Brisbane time. Every finding below was checked against a screenshot or the raw rendered text, not just the DOM. Screenshots are docs/review-14-01.png to review-14-27.png.

## How it was tested

- First visit, welcome card and spin on both sizes, by tap and by click; the spin landed on Gravity (phone) and Spider-Man 2 (desktop) (01). Lock-in with Director's cut, then the locked-in strip read on the box office, Galaxy Video and the Candy bar, and Prep sheet tapped from the store (02, 20, 22).
- 74 films opened through the real Save PDF button (Menu and prep sheet), every page rendered by pdftoppm and compared side by side with the screen. 61 of them are named in none of reviews 2 to 13. Hand-built: The Warriors, Dog Day Afternoon, Escape from New York, The Taking of Pelham One Two Three. Truck: Oliver & Company, Klaus, Willow, The Phantom Menace. Kiosk: Lethal Weapon 2, Lilo & Stitch, Free Willy. Galley: Captain Marvel, Eternals. Candy bar: Hop, The Fall Guy. Club: Rush Hour 2, Cruella, Tron: Legacy. Precinct: The Naked Gun. Campfire: E.T., Close Encounters of the Third Kind, Cool Runnings. Lab: Watchmen, The Martian. Canteen: Nacho Libre, Sister Act, Heathers. Diner: The Adventures of Priscilla, The Emperor's New Groove. Bistro: Monsters, Inc., Luca. Hotel: Casper, Inception. Invite: The Wedding Singer, Anyone But You. Stadium: Blades of Glory, Next Goal Wins. Cafe: Easy A, Night at the Museum. Banquet: Wonder Woman, Harry Potter and the Philosopher's Stone. Home: Signs, La Bamba, Cinderella Man. Tearoom: Frozen, Noelle. Placemat: Jingle All the Way, Dennis the Menace. Prom: House Party, 13 Going on 30. Airline: Four Christmases, Meet the Robinsons. Tiki: 50 First Dates, George of the Jungle. Bartab: Fight Club, Sweet Home Alabama. Tavern: Brave, Maleficent. Newspaper: The Lost World: Jurassic Park. Takeaway: Elemental, Crazy Rich Asians. Motel: Final Destination 2. Plus 13 rechecks from review 13: Skyfall, True Grit, Annabelle, The Conjuring, Fantasia, The Fly, Mallrats, Minions, An American Tail, Spider-Man 2, Analyze This, Casino and The Phantom Menace. Eras 1940 to 2025.
- scripts/check-pdf-tone.cjs on its own sample and on `--per 2` with stills loaded (60 films, all within -3.0 to +4.6 levels).
- A script pass over all 900 films three times: kids' mode off, kids' mode on, and Vegetarian plus No alcohol. It read the card, phone menu, planner (Director's cut list) and Prep sheet text for dashes, spaced hyphens, US spellings and kitchen words, doubled words, "undefined", "NaN", "null", "00" numbers, odd shopping words, alcohol (kids and No alcohol) and meat (Vegetarian). The scan replaces nothing: an allowed phrase only clears a hit when it covers that exact spot, and every hit was then read in its raw text with 150 characters either side before it went in here.
- A census over all 900 printed menus at 1440 wide with the web fonts loaded: text cut with an ellipsis, lines hidden by the fit pass, clip-text headings, masked photos, and inline-blocks holding text blocks (the shape that broke The Warriors).
- Table kits with six guest names ("Christopher", "Maria-Jose", "Bartholomew", "Anastasia") on The Warriors, Brave, Crazy Rich Asians and Tron: Legacy (19).
- Galaxy Video on both sizes from the walk-in (22). The calendar strip on 5 Nov and 20 Dec 2026, and 20 Jan, 10 Feb, 30 Mar, 20 Apr, 15 May, 1 Jun, 4 Jul, 15 Aug, 1 Sep, 28 Oct and 27 Dec 2027.
- Rechecked every item under review 13's "Fixed after the review", plus the comma titles.
- Node tests in tests/ (all 17 pass, veg-ahead.test.cjs included), scripts/check-browser.cjs (pass), check-store-taps.cjs (pass, 44 to 50px), check-cut-words.cjs (pass, two lines written that way in the data), check-prices.cjs (795 cards, pass), check-sweet-starters.cjs (20 kept, 0 to move), check-kids-cards.cjs (343 kid-safe films, pass), check-phone-fit.cjs (900, pass), check-pdf-tone.cjs (pass on its sample and on `--per 2`), check-prep-a4.cjs (see the end).
- Console errors, page errors and failed requests watched on every run: none, apart from the external images the text passes block on purpose.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 8 |
| 4. Phone experience | 9 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 8 |
| 6. Candy bar | 8 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 9 |
| 9. Polish and craft | 8 |
| 10. Accessibility basics | 9 |
| **Overall** | **8.6** |

### 1. First impression and visual identity: 9
The welcome card explains the site in three steps, the spin lands on a printed menu with swipe dots on the phone, and the locked-in strip sits at the top of every view (01, 02). Mark off, unchanged from review 13: on desktop the strip and the "This week's film" panel sit one screen apart and say the same thing twice, with two countdowns and buttons that use different words ("Prep sheet" in the strip, "Shopping list" in the panel), and the "Menu of the week" card sits just under them (20).

### 2. Brand consistency: 9
Cinema red and gold on the box office, lock-in, strip and Candy bar. Galaxy Video purple, gold, teal and pink from the walk-in to the shelves (22). Held at 9 for the same reason as before: the cinema strip is the only cinema piece inside the store.

### 3. Printed menus: 8
Review 13's paper faults are gone, and the new sample is strong on paper: Escape from New York's Watch Mess map (25), Casper's Whipstaff Manor room service (24), Frozen's Luncheon and Tea (23), Close Encounters' campfire cards, Wonder Woman's and Harry Potter's Bills of Fare, Crazy Rich Asians' takeaway, Free Willy's kiosk with its surf report, Heathers' and Sister Act's lunchroom.

Marks off:
- **The Warriors' map prints black boxes.** On screen the six station labels read "WOODLAWN, Over the wall to the el.", "TREMONT", "96 ST" and so on in cream on black. In the PDF each is a solid black box with no words (03, 04). Each label is an inline-block with a dark background holding two block lines, and html2canvas paints the background over the text in that shape. Changing the label to a table in the export copy prints it correctly (tried). The census finds the same shape on 7 hand-built menus, 34 kiosk and 9 stadium menus; on the kiosk and stadium menus checked here the boxes have no fill of their own and print fine, so the fault needs a filled box.
- **Club layout: the stage photo loses its fade.** On screen the photo at the top of the club's right-hand page fades into the dark page under the venue name. On paper the photo stops at a hard edge and the name sits half on it (Tron: Legacy, Rush Hour 2, 05). The fade is a CSS mask, which html2canvas skips. All 34 club films.
- **Cruella's chrome heading prints blank.** "HOUSE OF THE BARONESS" is chrome lettering (a gradient clipped to the text) on both pages; on paper both become a plain silver bar with no words (06). Three club films use the chrome style.
- **The fit pass hides lines instead of keeping them.** libUnclip in app.js hides any clamped line that will not fit after it has shrunk and trimmed it. That is meant for fine print, but it also takes dish names and dish notes. Night at the Museum's card shows "5.25, Chilled watermelon and feta cubes threaded with mint on short skewers." with no dish name above it; the phone menu calls it "Easter island watermelon and feta skewers" (09). The Martian prints notes for three of eight dishes (07), Brave and Maleficent for about half (08), and they flash "Baked potato skins with cheddar and..." on screen for a moment before they go. Josh's rule is that only house lines drop. The census at 1440 wide with the web fonts loaded counted 887 hidden lines on 200 films: campfire 56 films, canteen 50, galley 19, stadium 16, placemat 14, lab 11, saloon 9, airline 7, tavern 7, dining car 5, truck 3, tiki 2, cafe 1. They are dish notes and film notes alike ("The worms live on coffee and doughnuts." and "Comes back to you, like Kay's memory." on Men in Black II), and one dish name.
- **The page frame takes the wrong colour.** Save PDF lays each menu inside a small even margin filled with the menu's edge colour. edgeColour in app.js reads a strip 5 per cent of the page deep, which reaches past the real edge into the artwork: The Lost World's newspaper is cream to the edge but its paper gets a red frame from the masthead (11), The Phantom Menace's light grey truck menu gets a black one from the poster and board (12), and Annabelle's brown counter sits on a white band down one side (27).
- **Small layout bits.** Analyze This' "With sambuca, 4.00." sits on top of "Prices subject to change." on screen and paper (13). Final Destination 2's motel front prints on white, where the screen has its grey wall.

### 4. Phone experience: 9
The printed menu first with swipe dots, tap to zoom, and the text menu below. All 900 phone menus fit at 390 wide with the web fonts loaded, tabs included, and no sideways scroll on any of the 74 films. Held from 10 because the small swipe-view type on hand-built cards, left open since review 12, is unchanged, and because of the Vegetarian phone menu under section 5.

### 5. Core flow: 8
Spin, lock-in, Director's cut and The full feature work on both sizes; the shopping list follows the ticked dishes, and the wait wording is fixed (26). Vegetarian plus No alcohol rewrites the shared-layout cards, planner and Prep sheet well: The Godfather reads "Clemenza's Sunday sauce with mushroom meatballs".

Marks off:
- **Vegetarian leaves meat names on hand-built phone menus.** The hand-built printed card swaps its words from the film's own list (data/film/*.json, diet.text), and the recipe underneath swaps too, but the phone text menu shows the original name and line. Big Night shows "Seafood risotto" and "Roast pork, whole-pig style, Carried in on a board at the feast" over a recipe for a stuffed butternut pumpkin (15). Mickey Blue Eyes keeps "smoked salmon with cream cheese" on its tea sandwiches, Goodfellas "serve with the sauce and meatballs", The Pope of Greenwich Village "Order the veal", Get Shorty "Chili's steak frites". About 17 hand-built films. The swap list is written in whole lines ("Roast pork, whole-pig style. Carried in on a board at the feast"), and the phone splits each line into a name and a note, so no swap matches.
- **Kids' mode: Director's cut shows grown-up names.** The card, phone menu and Prep sheet all go through the kids' word pass; the planner list does not. With kids' mode on, Shanghai Noon lists "Rye and jasmine tea highball (alcohol-free)" (14) where the card says "Ginger and jasmine tea cooler"; Three Amigos! "El Guapo's margaritas (alcohol-free)", Brewster's Millions "Monty's sparkling cocktails for the bar", The Greatest Showman "Barnum's sparkling apple cocktails", Breakfast at Tiffany's "Holly's sparkling grape cocktails", Top Gun "Beer-battered onion rings", Home Alone 2 "Hot apple cider". About a dozen kid-safe films.
- Showtime cues still name the meat dish in Vegetarian mode on about 30 films ("Serve the prawns when the dinner party breaks into song" on Beetlejuice, "Serve the lobster when Madison eats it whole" on Splash). Most of those dishes have a vegetarian version, so it reads as the film's moment more than a wrong dish. Low.

### 6. Candy bar: 8
Board, combos, glass case and tray hold on both sizes with era prices (2004 prices for Spider-Man 2). Held at 8 because the phone page is still about 3,350px for one film (21).

### 7. Galaxy Video store: 9
Walk in, shopfront, signs and shelves as before (22). The calendar is right on every date tried: Movember and Christmas on 5 Nov, New Year's Eve with Summer holidays coming on 27 Dec, Australia Day on 20 Jan, Christmas in July on 4 Jul, Father's Day "In 21 days" on 15 Aug, Halloween and Melbourne Cup with Movember "In 4 days" on 28 Oct. Mark off: on 15 May the strip is empty. Mother's Day has passed and Christmas in July is seven weeks off, past the six-week window, so nothing shows for that fortnight.

### 8. Table kit: 9
Long names sit clear: "CHRISTOPHER", "BARTHOLOMEW", "MARIA-JOSE" and "ANASTASIA" on The Warriors' subway token fares (19), Brave's clan gathering cards, Crazy Rich Asians' boarding passes and Tron: Legacy's identity discs. Small mark, unchanged: Skyfall's intermission card repeats the door sign's sticky note.

### 9. Polish and craft: 8
No "undefined", "NaN", "null" or "00" numbers in any of the three 900-film passes, no em or en dashes, and no spaced hyphens. Every US spelling hit is a proper name (Visitor Center, Muppet Theater, Pearl Harbor, Labor Day 1972, My Neighbor Totoro). Marks off:
- **The truck layout prints its window line twice.** truck.js uses the same line as the board's kicker and the note card's kicker, so Oliver & Company reads "TILL THE LAST PLATE GOES." on the board and again over Dodger's note (10), Klaus "COOKED FRESH AT THE WINDOW." twice, Willow "HOT THROUGH THE WINDOW." twice. All 38 truck films.
- US kitchen words: "baking soda" (Frequency's pretzels, Ferris Bueller's pretzel method; Australian kitchens say bicarb soda), "romaine" (Working Girl, Trading Places; cos), "Skid Row takeout" (Little Shop of Horrors; takeaway). "Skillet" is still on about 20 films.
- The repeated content under sections 1 and 8.

### 10. Accessibility basics: 9
No change. The strip's buttons are 44px tall and named, the store sign taps are 44 to 50px, no sideways scroll, no duplicate ids. Held from 10 for the small swipe-view type on hand-built cards.

## Fix list, ranked by impact

1. **Lines that do not fit are kept, not hidden.**
   Where: libUnclip in app.js, and the fit passes in menu-formats (campfire, saloon, tiki, galley, placemat, lab, tavern, airline), which hide every note in a box at once the moment one line will not fit.
   Wrong: 887 hidden lines on 200 films, dish notes and film notes alike; Night at the Museum's dish name (09); most of The Martian's, Brave's and Maleficent's notes (07, 08).
   Good looks like: a dish name never hides, it wraps. A note gets a second line when its box has room. When a box is over, notes go one at a time from the bottom, not all at once. Screen and paper show the same lines. A check that fails on a hidden dish name.

2. **Save PDF keeps every word.**
   Where: the export copy in renderCanvas (app.js).
   Wrong: The Warriors' station labels print as black boxes (03, 04); Cruella's chrome heading prints as a silver bar (06).
   Good looks like: a filled inline-block that holds lines of text prints as a shrink-to-fit block, kept left, centre or right where its line put it; clip-text lettering prints as solid text in the gradient's middle colour. A check that fails when the export copy still holds either shape.

3. **Club photos keep their fade on paper.**
   Where: the mask handling in renderCanvas; menu-formats/club.js `fade`.
   Wrong: hard photo edge under the venue name on all 34 club films (05).
   Good looks like: the masked box drawn into a picture with the mask's fade applied, the way the vignettes are baked.

4. **Vegetarian on the hand-built phone menus.**
   Where: phoneView in app.js, fmtPhoneHTML in formats.js, the film's diet.text list.
   Wrong: Big Night "Roast pork, whole-pig style" over a pumpkin recipe (15), Mickey Blue Eyes, Goodfellas, The Pope of Greenwich Village, Get Shorty and others.
   Good looks like: the phone menu runs the same swap list as the card, also sentence by sentence, so the name and note match the recipe under them.

5. **Kids' mode in Director's cut.**
   Where: planHTML in app.js.
   Wrong: "Rye and jasmine tea highball (alcohol-free)" (14), "El Guapo's margaritas (alcohol-free)", "Beer-battered onion rings".
   Good looks like: the planner goes through the same kids' word pass as the card and Prep sheet. check-kids-cards.cjs reads the planner too.

6. **The page frame takes the colour of the real edge.**
   Where: edgeColour in app.js.
   Wrong: red frame on The Lost World (11), black on The Phantom Menace (12), a white band on Annabelle (27).
   Good looks like: the colour read from the outermost few pixels of the page, not a strip 5 per cent deep.

7. **Small items.**
   The truck layout's window line twice on all 38 truck films (10); "baking soda", "romaine", "Skid Row takeout"; Analyze This' "With sambuca" on top of "Prices subject to change" (13); the empty calendar strip in mid-May; the desktop strip and "This week's film" panel saying the same thing (20); Skyfall's repeated kit note; the long phone Candy bar page.

## Genuinely excellent, leave alone

- Every review 13 fix (16, 17, 18, 26), the Save PDF baking in renderCanvas, and the `--per 2` tone pass across every shared layout.
- The locked-in strip on both sizes and from every view (02).
- Kids' mode across all 343 kid-safe cards and phone menus, and the vegetarian swaps on shared-layout cards, lists and methods.
- Hand-built menus in this sample: Escape from New York, Dog Day Afternoon, The Taking of Pelham One Two Three (25).
- Shared layouts at their best: Casper's hotel (24), Frozen's tearoom (23), Close Encounters' and E.T.'s campfire, Wonder Woman's and Harry Potter's banquet, Crazy Rich Asians' takeaway, Free Willy's and Lilo & Stitch's kiosk.
- Table kits with long names (19), Galaxy Video and its calendar (22).
- A clean run: no console errors, failed requests, broken images or leaked "undefined", and every test and check passing.

## Note on check-prep-a4

Run on its own after the browser passes: 900 Prep sheets, 1,708 A4 pages at 4 guests, pass (21 minutes on this machine).

## Fixed after the review

1. **Lines are kept.** libUnclip (app.js) never hides a dish name: a line with a price beside it wraps instead (Night at the Museum's "Easter Island watermelon and feta skewers" is back). A clamped note gets one more line when its box still holds everything. Campfire, saloon, tiki, galley, placemat, lab, tavern and airline hid every note in a box at once when one would not fit; they now drop one note at a time from the bottom. On a 36-film sample across those layouts, hidden lines fell from 129 to 59. The Martian keeps its notes on screen and paper.
2. **Save PDF keeps every word.** In the export copy, a filled inline-block holding lines of text prints as a shrink-to-fit block (The Warriors' six station labels print), and clip-text lettering prints as solid text in the gradient's middle colour (Cruella, The Rocky Horror Picture Show, Rocketman).
3. **Club photos keep their fade.** A masked photo is drawn into a picture of its box (pdfMaskDraw, with its fit, position, filter and blend) and the mask's gradient is applied to it (pdfMaskApply). All 34 club films.
4. **Vegetarian phone menus on hand-built films.** dietPhone runs the card's swap list over the phone text menu, also sentence by sentence and with either apostrophe, so Big Night reads "Stuffed roast pumpkin, whole, Carried in on a board at the feast" and Get Shorty "Chili's portobello". New swaps for Mickey Blue Eyes, The Departed and Anchorman's phone lines in data/diet.
5. **Kids' mode in Director's cut.** planHTML goes through the same kids' word pass as the card and Prep sheet: Shanghai Noon lists "Ginger and jasmine tea cooler (alcohol-free)". check-kids-cards.cjs now reads the planner too.
6. **Page frame colour.** edgeColour reads the outermost 0.6 per cent of the page instead of 5 per cent: The Lost World prints on cream, The Phantom Menace on light grey.
7. **Small items.** Truck's note card kicker reads "Overheard at the window", so the board line no longer prints twice (38 films). "Bicarb soda", "cos" and "Skid Row takeaway" in the data. Analyze This' fine print moved clear of "With sambuca, 4.00." The calendar's quiet-stretch window is ten weeks, so mid-May shows Christmas in July.

New check: scripts/check-print-text.cjs fails on a hidden dish name, and on a filled inline-block with text, clip-text lettering or a masked photo left in the Save PDF copy. It fails on the old code (The Warriors, Cruella, Tron: Legacy, Night at the Museum) and passes on the new.

Left open: tavern's screen still cuts some notes with "..." where the PDF now shows them in full (Brave); other hidden notes on long campfire and canteen menus (Crocodile Dundee II, Cliffhanger, Red Heat) that only a shorter note or a looser layout would fix; Showtime cues naming the meat dish in Vegetarian mode; the desktop strip repeating the "This week's film" panel; Skyfall's repeated kit note; the long phone Candy bar page; small swipe-view type on hand-built cards.
