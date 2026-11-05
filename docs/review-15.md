# Fifteenth independent review

**Overall: 8.5 out of 10**

Every fix from review 14 holds. The Warriors' six station labels print (18), Cruella's chrome heading prints as lettering (19), Tron: Legacy's stage photo keeps its fade, Night at the Museum keeps "Easter Island watermelon and feta skewers", The Lost World prints on cream (20), and The Phantom Menace on light grey. Truck menus print the window line once ("Overheard at the window" over the note card). Big Night's phone menu reads "Stuffed roast pumpkin, whole" in Vegetarian mode, Shanghai Noon's Director's cut reads "Ginger and jasmine tea cooler (alcohol-free)" in kids' mode, and the store calendar on 15 May 2027 now shows Christmas in July "In 47 days". Every test and check script passes.

This review scores a little lower than review 14 because the count of hidden lines turned out larger than review 14 reported, not because anything regressed. Review 14 left "hidden notes on long campfire and canteen menus" open with three films named. A census of every film on the layouts with a fit pass found the problem on all 56 campfire menus (Addams Family Values, Tropic Thunder and Braveheart print dish names with no notes at all, 03, 04) and on all 60 canteen menus, where the showtime cue drops off the lunch ticket and one to four dish notes go (Red Heat, Madagascar, Paddington 2, 05). The tavern screen still cuts notes to "..." where the PDF prints them in full (Brave, 07), and the same mismatch is on canteen: Lady Bird's PDF loses "cinnamon latte" off the bottom of its drinks box (06). Galley prints its second sheet at a bigger size than the screen, so Lethal Weapon 4 and Red One lose their matched type on paper (08, 09). Save PDF's frame takes thin edge rules for the paper: Cloudy with a Chance of Meatballs and Man of Steel sit on heavy red and blue bands (10), Walk Hard on mauve (11), This Is the End on terracotta (12). Skyfall's table kit cuts long names to "CHRISTOPHE", "BARTHOLOM" and "ANASTASI" (17).

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit 8a23ae3 on wip/store-overhaul, with service workers blocked and Australia/Brisbane time. Every finding below was checked against a screenshot or the raw rendered text, not just the DOM. Screenshots are docs/review-15-01.png to review-15-26.png.

## How it was tested

- First visit, welcome card and spin on both sizes, by tap and by click; the spin landed on Sleeping Beauty (phone) and Ocean's Twelve (desktop) (01, 02). Lock-in with Director's cut (26), then the locked-in strip on the box office, Candy bar and Galaxy Video (22).
- 69 films opened through the real Save PDF button (Menu and prep sheet), every page rendered by pdftoppm and compared side by side with the screen. 53 are named in none of reviews 2 to 14. Hand-built: King of New York (25), Léon: The Professional, Premium Rush (24). Galley: Lethal Weapon 4, Red One. Candy bar: Beverly Hills Cop III. Canteen: Lady Bird, Spider-Man: Into the Spider-Verse, Gremlins 2: The New Batch, 10 Things I Hate About You. Kiosk: National Lampoon's Vacation, Aquaman, A Bug's Life, Finding Dory. Campfire: Addams Family Values, Shrek, Tropic Thunder, Braveheart. Diner: Cloudy with a Chance of Meatballs, Man of Steel. Banquet: John Wick: Chapter 2, Thor: The Dark World. Hotel: Shrek 2, Richie Rich. Lab: Despicable Me, Hellboy. Truck: Wallace & Gromit: The Curse of the Were-Rabbit, Iron Man 3. Home: Selena, The NeverEnding Story, Wallace & Gromit: Vengeance Most Fowl. Newspaper: Captain America: The Winter Soldier. Precinct: Ant-Man and the Wasp. Tearoom: Alice in Wonderland. Tavern: The Hunchback of Notre Dame, Treasure Planet. Bistro: The Princess and the Frog, Meet the Fockers. Takeaway: Raya and the Last Dragon, The Big Sick. Cafe: Toy Story 4, Notting Hill, Clerks III. Bartab: Onward, Beerfest. Placemat: Clerks II, My Big Fat Greek Wedding. Tiki: Glass Onion: A Knives Out Mystery. Prom: Barbie. Club: A Night at the Roxbury, Walk Hard: The Dewey Cox Story. Invite: This Is the End. Dining car: Mission: Impossible, Ghost Protocol. Plus 16 rechecks: Crocodile Dundee II, Cliffhanger, Red Heat, Brave, Maleficent, The Martian, Skyfall, The Warriors, Cruella, Tron: Legacy, Night at the Museum, The Lost World, Oliver & Company, Analyze This, Big Night, Shanghai Noon. Eras 1951 to 2025.
- Two films that looked different on paper were rendered again with an 8 second settle before going in here (Lethal Weapon 4, John Wick: Chapter 2). Lethal Weapon 4's difference held; John Wick's was my capture, not the app, and is not reported.
- A font-size comparison of the screen and the Save PDF copy, face by face, on one film from each of 22 shared layouts. Only galley differs.
- scripts/check-pdf-tone.cjs on its own sample and on `--per 2` with stills loaded (60 films, all within -3.0 to +4.6 levels).
- A script pass over all 900 films three times: kids' mode off, kids' mode on, and Vegetarian plus No alcohol. It read the card, phone menu, Director's cut list and Prep sheet text for dashes, spaced hyphens, leaked "undefined", "NaN" or "null", "00" numbers, doubled words, US spellings and kitchen words, alcohol (kids and No alcohol) and meat (Vegetarian). The scan replaces nothing: an allowed phrase clears a hit only where it covers that exact spot, and every hit was read in its raw text with 150 characters either side before it went in here.
- A census at 1440 wide with the web fonts loaded over the 423 films on the 15 layouts that have a fit pass (campfire, canteen, tavern, galley, lab, placemat, stadium, saloon, airline, tiki, dining car, truck, cafe, kiosk, candy bar): lines hidden after the fit settles.
- Table kits with six guest names ("Christopher", "Maria-Jose", "Bartholomew", "Anastasia", "Sam", "Jo") on Skyfall, Addams Family Values and Glass Onion (17, 23).
- Galaxy Video on both sizes (22). The calendar strip on 5 Nov and 20 Dec 2026, and 20 Jan, 10 Feb, 10 Mar, 30 Mar, 20 Apr, 15 May, 1 Jun, 20 Jun, 4 Jul, 15 Aug, 1 Sep, 25 Sep, 28 Oct and 27 Dec 2027.
- Rechecked every item under review 14's "Fixed after the review".
- Node tests in tests/ (all 17 pass, veg-ahead.test.cjs included), check-browser (pass), check-store-taps (pass), check-cut-words (pass), check-sweet-starters (pass), check-kids-cards (343 films, pass), check-phone-fit (900, pass), check-prices (795, pass), check-pdf-tone (pass on its sample and on `--per 2`), check-print-text (900, pass), check-prep-a4 (see the end).
- Console errors, page errors and failed local requests watched on every run: none.

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
| 8. Table kit | 8 |
| 9. Polish and craft | 8 |
| 10. Accessibility basics | 9 |
| **Overall** | **8.5** |

### 1. First impression and visual identity: 9
The welcome card explains the site in three steps, the spin lands on the printed menu with swipe dots on the phone, and the locked-in strip sits at the top of every view (01). Mark off, unchanged: on desktop the strip and the "This week's film" panel say the same thing one screen apart: poster, title, two countdowns, and buttons with different words ("Prep sheet" in the strip, "Shopping list" and "Open the menu" in the panel) (02).

### 2. Brand consistency: 9
Cinema red and gold from the box office to the Candy bar; Galaxy Video purple, gold, teal and pink in the store (22). Held at 9 for the same reason as before: the cinema strip is the one cinema piece inside the store.

### 3. Printed menus: 8
The new sample is strong on paper where nothing is hidden: King of New York's charity dinner (25), Premium Rush's map and halal cart (24), Léon's Tony's, Thor's and John Wick's Bills of Fare, Alice in Wonderland's Luncheon and Tea, Captain America's newspaper, Glass Onion's island chart, Barbie's prom card.

Marks off:
- **Campfire hides every dish note on long menus.** The fit pass shrinks the type, clamps notes to two lines, then one, then hides them one at a time from the bottom. On all 56 campfire films at least one line goes, 422 lines in all. Addams Family Values, Tropic Thunder and Braveheart print eight to ten dish names with no notes on screen or paper (03, 04). Crocodile Dundee II and Cliffhanger, named in review 14, still lose most of theirs (21).
- **Canteen hides the showtime cue and dish notes on every film.** The lunch ticket holds "Admit one to the line" and the cue in a fixed box, and the cue is the line marked to drop, so it goes on all 60 canteen menus. The tray then clamps notes to two lines and hides one to four of them (Red Heat, Madagascar, Paddington 2, Mean Girls; 145 lines over 60 films) (05).
- **The screen shows "..." where the paper prints in full.** html2canvas ignores line clamps. The tavern clamps notes to one line, so Brave and Maleficent show "Oatcakes with cream cheese, smoked..." on screen and the whole note on paper (07). On canteen the paper's extra line pushes the last note out of its box: Lady Bird's PDF ends "Café shift brown sugar" with "cinnamon latte" cut off the bottom (06). Lab clamps the same way.
- **Galley prints its second sheet bigger than the screen.** On screen both sheets share the smallest type either needed. Save PDF draws each sheet on its own, so sheet 2 refits alone: Lethal Weapon 4's sweets and drinks print at 30px where the screen has 20px, and the photo prints shorter (08). Red One the same (09). All 19 galley films.
- **The page frame takes a thin edge rule for the paper.** edgeColour reads the outermost 0.6 per cent of the page, which on some layouts is a 2 to 10px rule, not the paper. The diner's red top line floods Cloudy with a Chance of Meatballs' frame red (10) and Man of Steel's blue; Walk Hard's mauve edge gives a mauve frame (11), This Is the End's terracotta strip a terracotta one (12).
- **Small layout bits.** Beverly Hills Cop III's candy bar cuts its fine print mid-line, "Poster and stills: TMDB" half under the edge (13). A Bug's Life's kiosk prints "Fresh honeydew juice" under the note card on paper, where the screen has it clear (14).

In all, the census counted 910 hidden lines on 243 of the 423 films checked. Besides campfire and canteen: cafe 30 of 34 films (162 lines; Big Hero 6, Venom: Let There Be Carnage and Deadpool & Wolverine each lose four to six notes), tavern 27 of 27 (47), lab 16 of 33 (39), galley 19 of 19 (38), saloon 10 of 12 (25), stadium 12 of 20 (14), placemat 7 of 25 (9), airline 5 of 15 (8), tiki 1 of 17. Dining car, truck, kiosk and candy bar hide none.

### 4. Phone experience: 9
The printed menu first with swipe dots, tap to zoom, and the text menu below with big type. All 900 phone menus fit at 390 wide, tabs included, and no sideways scroll on any view. Held from 10: on hand-built cards the swipe view shows a whole page at about 60 per cent, so King of New York's dish lines are about 9px on screen (16). Tap to zoom and the text menu below are the readable way in.

### 5. Core flow: 8
Spin, lock-in, Director's cut and The full feature work on both sizes, and the Director's cut list shows times beside each dish (26). Vegetarian plus No alcohol rewrites cards, lists and methods well: West Side Story's "Maria's pernil-spiced cauliflower", Raging Bull's "Jake's cauliflower steak", Black Widow's "Pan fried veggie sausages with apples and onions".

Marks off:
- **Showtime cues still name the meat dish in Vegetarian mode**, on 43 films: "Serve the lobster when Madison eats it whole" (Splash), "Serve the steak when Seth teleports one" (The Fly), "Serve the hot dogs when Oliver and Dodger raid the hot dog cart", "Serve the ribs when Jack drives the Pork-Chop Express". The card's own dishes are vegetarian under them.
- **The Godfather, Vegetarian plus No alcohol**: the veal becomes "Funghi Marsala", and its note reads "Field mushrooms pan-fried in butter, with a cold drink grape juice and shallots". Two swaps ran over "with Marsala wine".
- A dish with no vegetarian version stays on the printed card with its meat note, by design, and comes off the cook list: The Breakfast Club's "Toasted triple-decker of ham, Swiss and cheddar", 21 Jump Street's "Thick tray pizza with pepperoni". Low.

### 6. Candy bar: 8
Board, combos, glass case and tray hold on both sizes with era prices (1959 prices for Sleeping Beauty, 2004 for Ocean's Twelve). Held at 8: the phone page is still 3,315px for one film, with the tray under three full-width combo cards and eight glass case cards (15).

### 7. Galaxy Video store: 9
Walk-in, shopfront, signs and shelves as before (22). The calendar is right on every date tried, and the mid-May gap is fixed: Christmas in July "In 47 days" on 15 May, "In 30 days" on 1 June. Easter shows "In 18 days" on 10 March. Held at 9 for the cinema strip inside the store.

### 8. Table kit: 8
Long names sit clear on Addams Family Values' camp IDs and Glass Onion's Disruptors invites (23). Marks off:
- **Skyfall's luggage tags cut long names**: "CHRISTOPHE", "MARIA-JOSI", "BARTHOLOM", "ANASTASIA" with the last letter clipped. The tag gives a four-figure year ("2012") 70px at 54px type, which leaves the name too little room (17). Every film with the tag place card and a long name.
- **Skyfall's intermission card repeats the door sign's sticky note**, unchanged since review 13 (17). The same happens on the comic style.

### 9. Polish and craft: 8
No "undefined", "NaN" or "null" in any of the three 900-film passes, no em or en dashes, no spaced hyphens, and every "00" is "00 flour" or a form number ("Form No. 13-00"). Every doubled word is the film's own ("Nai Nai", "Bidi bidi bom bom", "Fa ra ra ra ra", "Chitty Chitty Bang Bang"). Proper names read and cleared: Lincoln Center, Visitor Center, Muppet Theater, Amity Harbor, Stan Mikita's Donuts, Cozy Cone, Prizzi's Honor, and Knives Out's donut holes (Benoit Blanc's word). Marks off:
- US kitchen words: "skillet" on 22 films (Ant-Man and the Wasp, 22 Jump Street, City Slickers, Blazing Saddles), "wax paper" on 9 (Stand By Me, Men in Black 3, Midnight Cowboy), "graham crackers" (A Goofy Movie, Quick Change), "candies" (The Waterboy's pecan pralines), "Takeout" (Set It Up's "Corner Office Takeout", Die Hard with a Vengeance's placemat).
- US spellings in the film notes: "counselors" (Addams Family Values, Wet Hot American Summer), "traveler" (Raya and the Last Dragon).
- Kids' mode: The Out-of-Towners' cherry cola is "Ginger, sweet bitter orange and bitters". Bitters are about 45 per cent alcohol. Low.
- The repeated content under sections 1 and 8.

### 10. Accessibility basics: 9
The strip's buttons are 44px tall and named, the store sign taps are 44 to 50px, no sideways scroll, no duplicate ids. Held from 10 for the small swipe-view type on hand-built cards (section 4).

## Fix list, ranked by impact

1. **No line hidden or cut on the long shared menus.**
   Where: the fit passes in menu-formats (campfire, canteen, cafe, tavern, lab, saloon, tiki, placemat, airline, galley) and libUnclip in app.js.
   Wrong: 910 hidden lines on 243 films; every campfire and canteen film hides lines (03, 04, 05); tavern and lab clamp notes to "...".
   Good looks like: before a note is clamped or hidden, the menu takes room from the photo or poster beside it, or runs in two columns; a note too long for any room is shortened at a natural break; the canteen cue stays and "Admit one to the line" gives way. No note is clamped to "..." on screen. A census over these layouts that counts what is still hidden.

2. **Paper matches the screen.**
   Where: renderCanvas in app.js; galley's fitAll; canteen and kiosk spacing.
   Wrong: clamped notes print in full (07), Lady Bird's last line falls out of its box (06), galley's sheet 2 prints bigger (08, 09), A Bug's Life's drinks run under the note (14).
   Good looks like: anything still clamped prints with the same words and ellipsis as the screen; each galley sheet prints at the size the screen gave it; boxes that fill to the pixel keep a few pixels spare for html2canvas.

3. **Frame colour from the paper, not a thin rule.**
   Where: edgeColour in app.js.
   Wrong: red, blue, mauve and terracotta bands round Cloudy, Man of Steel, Walk Hard and This Is the End (10, 11, 12).
   Good looks like: the colour read just inside the outermost rule. The Lost World stays cream, The Phantom Menace light grey, Annabelle brown.

4. **Vegetarian showtime cues.**
   Where: the cue on the card, phone, Prep sheet and Director's cut (app.js, formats.js fmtCue).
   Wrong: 43 cues name the meat dish ("Serve the lobster when Madison eats it whole").
   Good looks like: the thing served is named by its course ("Serve the mains when..."), with a hand-written cue where the moment needs the dish to make sense (Splash, The Fly, Iron Man, Poltergeist, Christmas Vacation, Chinatown).

5. **Table kit.**
   Where: kitProp and .kp-tag in index.html; the fridge and comic intermission cards.
   Wrong: Skyfall's tags cut long names; the intermission repeats the door sign's note (17).
   Good looks like: "BARTHOLOMEW" whole on a tag; the intermission card carries something the door sign does not.

6. **One reminder at the top of the box office.**
   Where: renderWeek in app.js.
   Wrong: the strip and the "This week's film" panel repeat each other (02).
   Good looks like: the panel keeps only what the strip cannot do (cook night, showtime, shopping list, clear), and its countdown speaks up only when showtime comes or passes.

7. **The phone Candy bar page.**
   Where: the Candy bar's phone styles in index.html.
   Wrong: 3,315px for one film (15).
   Good looks like: combos and the glass case slide sideways a card at a time, so the tray is a short scroll under the board.

8. **Small items.**
   The Godfather's "with a cold drink grape juice"; Beverly Hills Cop III's cut fine print (13); "skillet", "wax paper", "graham crackers", "candies", "Takeout", "counselors", "traveler"; small swipe-view type on hand-built cards (16).

## Genuinely excellent, leave alone

- Every review 14 fix (18, 19, 20), and the Save PDF baking in renderCanvas: html2canvas now prints clip-text, masked photos and filled inline-blocks correctly.
- Hand-built menus in this sample: King of New York (25), Premium Rush (24), Léon.
- Shared layouts at their best: John Wick's and Thor's Bills of Fare, Alice in Wonderland's tearoom, Captain America's newspaper, Glass Onion's tiki chart, Barbie's prom card, Raya's and The Big Sick's takeaway.
- Kids' mode across all 343 kid-safe films: the only drink word left is the bitters in one cherry cola.
- Galaxy Video and its calendar (22), and the table kits' long names on every style but the tag (23).
- A clean run: no console errors, page errors, failed local requests or leaked "undefined", and every test and check passing.

## Note on check-prep-a4

Run on its own after the browser passes: 900 Prep sheets, 1,708 A4 pages at 4 guests, pass (24 minutes on this machine). A first run inside the batch of checks was stopped by the two-hour limit on background jobs and was run again on its own.

## Fixed after the review

1. **Lines are kept.** Before a note is clamped or hidden, the long shared menus now make room. Campfire: the menu takes height from the photo above it, then runs in two columns (Crocodile Dundee II and Addams Family Values show every dish note). Canteen: the tray takes width from the poster beside it, and on the lunch ticket the showtime cue stays while "Admit one to the line" gives way. Tavern: the poster plate gives up width to the menu column. Cafe: a long menu takes height from the poster panel. Galley: a full sheet 1 takes height from the poster and the side column narrows with it. Anything still too long is shortened at a natural break (a sentence, a comma, "with", "until"), never down to an unfinished phrase like "Choux puffs filled", and only then hidden. No layout clamps a note to "..." any more. Across all 900 printed menus, hidden notes fell from 910 lines on 243 films to 56 lines on 23 films: every campfire, canteen, tavern and galley film now shows all its notes, and cafe 33 of 34.
2. **Paper matches the screen.** Each galley sheet prints at the size the screen gave it (sheet 2 no longer refits on its own). In the Save PDF copy any clamp that still cuts text is set to the words the screen shows, with the ellipsis. Canteen trays keep 20px and kiosk columns 10px spare, because html2canvas sets type a touch lower than Chrome (Lady Bird keeps "cinnamon latte", A Bug's Life's drinks sit clear of the note).
3. **Frame colour.** edgeColour reads just inside the outermost 2 per cent of the page, past thin edge rules: Cloudy with a Chance of Meatballs and Man of Steel print on cream, Walk Hard on its dark wall, This Is the End on its pale paper. The Lost World stays cream, Annabelle brown.
4. **Vegetarian showtime cues.** On a vegetarian night the thing served is named by its course ("Serve the mains when Jack drives the Pork-Chop Express into Chinatown", "Serve the snacks when Tommy talks the diner waitress into reopening the kitchen"). Six cues where the moment leans on the dish are written by hand in data/diet: Splash, The Fly, Iron Man, Poltergeist, National Lampoon's Christmas Vacation, Chinatown. Card, phone, Prep sheet and Director's cut all use dietCue.
5. **Table kit.** The tag place card's number is smaller, so "BARTHOLOMEW" and "ANASTASIA" print whole on Skyfall's tags. The fridge and comic intermission cards carry the film's tagline instead of repeating the door sign's note.
6. **One reminder at the top.** When the locked-in strip shows, the "This week's film" panel drops its poster, title and Open the menu button and becomes "Your movie night": cook night, showtime, Shopping list and Clear. Its countdown speaks up only when showtime comes or passes.
7. **Phone Candy bar.** Tonight's combos and the glass case slide sideways a card and a peek at a time. The page for one film is about 2,630px, from 3,315px.
8. **Small items.** The Godfather's note reads "with grape juice and shallots". Beverly Hills Cop III's candy bar fine print has room, and its extra teasers drop before the credit. "Pan" for skillet, "baking paper" for wax paper, "digestive biscuits" for graham crackers, "pralines" for the pecan candies, "Takeaway" for Takeout, "counsellors", "traveller".

New in scripts/check-print-text.cjs: it fails on a hidden dish note, and on a line clamp in the Save PDF copy that still cuts text.

Later on 6 Nov: saloon takes height from the poster on a heavy menu (all 12 saloon films clear), lab can move a section from the column beside the poster to the strip under it, and about 80 long notes were shortened in the data ("Beef and ale pie, chips, peas", "Fudge sundae with a cream rocket"). Left open: 29 hidden notes on 12 films: lab (The Martian, Mad Max 2, Furiosa, Jurassic World Dominion, Men in Black II, Harry Potter and the Deathly Hallows: Part 2), Airplane! and Captain America: Civil War on airline, The Jungle Book, The Wog Boy, Hook and Weekend at Bernie's. The lab strip under the poster is about 150px tall, so lab needs a new layout rather than shorter notes. A poster trade on lab was tried twice and reverted: it shortens the column beside the poster. Also open: small swipe-view type on hand-built cards; a vegetarian card still prints a dish that has no vegetarian version (by design, low); The Out-of-Towners' bitters in kids' mode.

All 17 node tests pass; check-browser, dialogs, check-store-taps, check-cut-words (two lines written that way in the data), check-sweet-starters, check-kids-cards (343), check-phone-fit (900), check-prices (795), check-pdf-tone (named sample and `--per 2`, all 60 within -3.0 to +4.6) and check-prep-a4 (1,708 pages) pass. check-print-text reads all 900 and fails only on the 29 hidden notes listed above; no dish name is hidden and no clamp or shape is left in the Save PDF copy that html2canvas would misprint.

## Score after the fixes

| Area | Before | After |
|---|---|---|
| 1. First impression and visual identity | 9 | 9.5 |
| 2. Brand consistency | 9 | 9 |
| 3. Printed menus | 8 | 9 |
| 4. Phone experience | 9 | 9 |
| 5. Core flow | 8 | 9 |
| 6. Candy bar | 8 | 9 |
| 7. Galaxy Video store | 9 | 9 |
| 8. Table kit | 8 | 9 |
| 9. Polish and craft | 8 | 9 |
| 10. Accessibility basics | 9 | 9 |
| **Overall** | **8.5** | **9.1** |

Short of 9.5 for the 29 hidden notes, the swipe-view type on hand-built cards, and the cinema strip as the one cinema piece inside Galaxy Video.
