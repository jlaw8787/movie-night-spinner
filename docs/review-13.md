# Thirteenth independent review

**Overall: 8.6 out of 10**

Every fix from review 12 holds. Singin' in the Rain reads "TALKIES SOON", The Santa Clause keeps "read the fine print.", Final Destination's "Premonition French 75" keeps its price on its own line, Batman Begins' logo sits on a dark plate, Shanghai Noon reads "REWARD $2000" and "Bill no. 2000", Finding Nemo's schnitzel is 11.00, and Jurassic Park, Shang-Chi and The Out-of-Towners read "egg centres", "Spring onion pancakes" and "thickened cream" (20). With kids' mode on, The Out-of-Towners, Shanghai Noon and Coneheads carry no drink names. The table kit fits long guest names (21). The store calendar uses one month spelling on every date tried. The new locked-in strip works on both sizes and from every view (04, 05). Every test and check script passes.

What holds this short of 9.5 is a new set of smaller faults rather than one big one. Save PDF still differs from the screen on three layouts the tone check does not sample: home prints its white recipe cards grey (Skyfall, True Grit, Annabelle fail the check by 11 to 20 levels, 07, 08), and tavern and lab print flat and light and lose their aged edges (07, 27). Vegetarian mode rewrites the dish but not its Make ahead line, so Independence Day's mushroom burgers say "Roll the beef into balls" and Dirty Work's haloumi says "Rub the chicken" (29). The phone text menu cuts off "Starters" on seven films (03). Director's cut prints "15 min + 12 hr, start the day before wait" (06). A few shopping lines and print frames are still off.

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit f56e741 on wip/store-overhaul, with service workers blocked and Australia/Brisbane time. Every finding below was checked against a screenshot or the rendered text, not just the DOM. Screenshots are docs/review-13-01.png to review-13-29.png.

## How it was tested

- First visit, welcome card and spin on both sizes, by tap and by click; spin landed on Casino and Idiocracy (phone) and Meet the Parents (desktop) (01, 02).
- Lock-in on both sizes with Director's cut (06), then the new locked-in strip: read on the box office, then Menu and Prep sheet tapped from Galaxy Video and from the Candy bar (04, 05, 23, 24).
- 66 films opened through Save PDF (Menu, plus Prep sheet, every page rendered by pdftoppm) and compared side by side with the screen. None of the 66 is named in reviews 2 to 12. Hand-built: Analyze This, Do the Right Thing, Things to Do in Denver When You're Dead, Spider-Man 2, Mickey Blue Eyes. Invite: An American Tail, Harry Potter and the Goblet of Fire. Truck: Dumb and Dumber, Boyz n the Hood, City Slickers. Kiosk: Turner & Hooch, The Lion King, Jaws 2. Galley: Gravity, Moana 2. Candy bar: Batman Forever, Minions. Canteen: Kindergarten Cop, School of Rock, Paddington 2. Club: Ocean's Eleven, The Batman. Precinct: 21 Jump Street, Alien 3. Campfire: Cliffhanger, A Quiet Place, The Empire Strikes Back. Lab: I Am Legend, The Fly. Diner: Dazed and Confused, Little Shop of Horrors. Bartab: An American Werewolf in London, The Fighter. Hotel: The Witches, Insidious. Bistro: The Little Mermaid, Ocean's Twelve. Placemat: Ace Ventura: Pet Detective, Mallrats. Stadium: Talladega Nights, Dodgeball. Prom: Old School, American Pie. Cafe: Barbershop, Unbreakable. Banquet: The Lord of the Rings: The Return of the King, Dune. Takeaway: John Wick: Chapter 4, Turning Red. Home: Skyfall, True Grit, Annabelle. Tavern: The Conjuring, Fantasia. Motel: Barbarian, No Time to Die. Tiki: Avatar, Enchanted. Airline: Prometheus, Mission: Impossible 2. Newspaper: Spider-Man 3, Anchorman 2. Tearoom: Tangled, The Princess Diaries. Dining car: The Matrix Revolutions. Eras 1940 to 2024.
- scripts/check-pdf-tone.cjs on its own sample, on `--per 2` (two films from every shared layout, stills loaded) and on the 11 films that looked off in the side by side.
- A script pass over all 900 films three times: kids' mode off, kids' mode on, and Vegetarian plus No alcohol. It read card, phone menu and Prep sheet text for dashes, US spellings, doubled words, "undefined", "NaN", "null", "00" numbers, odd shopping words, alcohol (kids and No alcohol) and meat (Vegetarian). Every hit was then read again in its raw text on a fresh page load before it went in this review.
- A phone pass over all 900 at 390 wide with the web fonts loaded: any phone menu button or line wider than its box, and any sideways scroll.
- Table kits with six guest names, including "Christopher" and "Maria-Jose", on West Side Story, Hocus Pocus 2, Ocean's Eleven, Dazed and Confused, Paddington 2 and Skyfall (21, 22).
- Galaxy Video on the phone from the walk-in (23). The calendar strip on 20 Dec 2026 and 10 Feb, 30 Mar, 20 Apr, 1 Jun, 4 Jul, 1 Sep and 28 Oct 2027.
- Rechecked every item under review 12's "Fixed after the review" (20).
- Node tests in tests/ (all 16 pass), scripts/check-browser.cjs (pass), check-store-taps.cjs (pass, 44 to 50px), check-cut-words.cjs (pass, two lines written that way in the data), check-prices.cjs (795 cards, pass), check-sweet-starters.cjs (20 kept, 0 to move), check-kids-cards.cjs (343 kid-safe films, pass), check-pdf-tone.cjs (pass on its own sample and on `--per 2`), check-prep-a4.cjs (see the note at the end).
- Console errors, page errors and failed requests watched on every run: none.

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
The welcome card still explains the site in three steps, and the box office reads at once (01). Spins land on a printed menu with swipe dots on the phone (02). The new locked-in strip is a good reminder: poster, "Coming up", the title, "Saturday 7 Nov, 7pm · in 2 days 3h" and two 44px buttons, Menu and Prep sheet (04). Tapped from Galaxy Video or the Candy bar it walks back to the box office and opens the right tab. Mark off: on desktop the strip and the "This week's film" panel sit one screen apart and say the same thing twice, with two countdowns and two sets of buttons that use different words ("Prep sheet" in the strip, "Shopping list" in the panel) (05).

### 2. Brand consistency: 9
Cinema red and gold on the box office, lock-in, strip and Candy bar (04, 24). Galaxy Video purple, gold, teal and pink from the walk-in to the slip (23). The calendar strip now spells months one way on every date tried. Held at 9 because the strip borrows the cinema look while sitting above Galaxy Video on the store view. That is right for a cinema reminder, but it is the only cinema piece inside the store.

### 3. Printed menus: 8
Up from 7. Review 12's wash fault is gone: Die Hard 2, the night diners and the canteen still match, and `--per 2` passes across every shared layout. The new sample is strong on paper: Things to Do in Denver's Altitude lounge with its drink chit (09), Do the Right Thing's Sal's Famous with the 98 degree tag (15), Gravity's Shuttle Explorer cabin (16), Analyze This' Sobel supper (14), An American Werewolf's Slaughtered Lamb running tab, Dune's and The Return of the King's Bill of Fare (18), Ghostbusters II's party menu (26), The Matrix Revolutions' dining car timetable (19), John Wick 4's takeaway and Kindergarten Cop's lunchroom (18).

Marks off:
- **Home prints its white cards grey.** On screen Skyfall's recipe box, "Recipe No. 12" and "House rules" cards are white on a dark kitchen counter. In the PDF every card is tan-grey and the whole page drops (07). check-pdf-tone fails Skyfall by 20 levels, True Grit by 19 (contrast down 17 per cent, 08) and Annabelle by 11. Endgame, in the check's own `--per 2` run, is 8 levels darker and only passes because the limit is 10. The home layout has 50 films. Something on the card paper (a blend, filter or inset layer) is drawn as a flat grey wash by html2canvas, the same family as review 12's fault.
- **Tavern and lab print flat and light.** The Conjuring's parchment has burnt corners and an aged edge on screen; the PDF is flat yellow with the edges gone (07). Fantasia is the same. The Fly's lab sheet loses its grimy grey paper and dark corners and prints near white (07, 27). Measured +8 to +13 levels, inside the check's +20 limit, so nothing flags it. In `--per 2`, Doctor Strange and No Way Home (tavern) are +13.
- **Print frames that do not match.** Mallrats' blue and white checker border prints as a plain dark navy frame (11). Minions' candy bar is wider than A4, so the page is filled above and below with the edge colour, and the edge colour comes out white from the poster, so a brown menu sits on white bands (10). Batman Forever, on a dark poster, fills correctly. An American Tail's small logo plate is white on screen and black on paper (13).
- **Spider-Man 2 prints one line less than the screen.** "By the slice 2.00, Toppings 50 cents each" shows on the screen and is missing from the PDF, which reflows the Aziz's Pizza columns (12). It is a house line, so Josh's rule allows it to drop, but the screen and the paper should drop the same thing.
- **Small layout bits.** Analyze This' "CANNOLI, YOU'RE FINE" seal covers the end of "Like his mother made. We won't..." on screen and paper (14). Gravity's and The Matrix Revolutions' starters and mains have no description line while their sweets do, which leaves the first page thin (16, 19).

### 4. Phone experience: 9
The printed menu shows first with swipe dots, tap to zoom, and the text menu with Starters, Mains, Sweets and Drinks below (02). No sideways scroll on any of the 900 phone menus. Mark off: on seven films the first tab cuts "Starters" off at the right edge in the wide display font: Casino (03), Donnie Brasco, Analyze This, Miller's Crossing, Get Shorty, Teenage Mutant Ninja Turtles and After Hours (text 79 to 94px in a 76px button). Held from 10 also because the small swipe-view type on hand-built cards, left open in review 12, is unchanged.

### 5. Core flow: 8
Spin, lock-in, Director's cut and The full feature work on both sizes. The shopping list follows the ticked dishes (06). Kids' mode is clean on every kid-safe card, phone menu and Prep sheet. Vegetarian plus No alcohol rewrites dish names, lists and methods well: The Godfather's list reads "3 vegetarian Italian-style sausages" and "60g vegetarian parmesan-style cheese" (25), Casino cuts cauliflower steaks.

Marks off:
- **Vegetarian misses the Make ahead line.** The dish is swapped, the Make ahead note is not. Independence Day's "Captain Hiller's cookout mushroom burgers" says "Roll the beef into balls"; Dirty Work's "Sam's barbecue haloumi" says "Rub the chicken" (29). Blade's skewers say "Thread the prawns", Ghost's pasta "Make the sausage and cream sauce". About 20 films. The same pass leaves Teenage Mutant Ninja Turtles' method with "one with pepperoni, mushroom and capsicum" after "plant-based pepperoni" a line earlier.
- **Wait times read oddly.** Director's cut shows "Tangiers rib eye 15 min + 12 hr, start the day before wait" (06). Any wait of 10 hours or more does this, and the Prep sheet's "then 12 hr, start the day before to marinate" reads the same way. planMin in app.js (line 1311) folds the advice into the number.
- **Shopping lines.** The Farewell lists "1 lychee (565g tin)" from "1 tin lychees (565g)". The Little Mermaid lists "1 bag fish" for gummy fish. Iron Man 2's sweet is named "Giant doughnut doughnuts" on card, phone and Prep sheet (data/films.json).

### 6. Candy bar: 8
The board, combos, glass case and tray hold up on both sizes (24), with the 2000-era prices for Meet the Parents. Combo cards carry the dollar sign now. Held at 8 because the phone page is still about 3,370px for one film, so the tray sits a long way below the combos.

### 7. Galaxy Video store: 9
Walk in, shopfront, member card and signs on the phone (23), aisles and the hire case as before. The calendar is right on every date tried: Christmas with New Year's Eve "In 11 days" on 20 Dec, Lunar New Year and Valentine's Day on 10 Feb, April Fools on 30 Mar, ANZAC Day with Mother's Day on 20 Apr, Christmas in July, Father's Day and Finals season, Halloween and Melbourne Cup with Movember "In 4 days". Mark off: on 1 June the strip is empty, with no "Coming up" either, when Christmas in July is a month away.

### 8. Table kit: 9
Up from 8. The squeeze is fixed: "SAM", "CHRISTOPHER" and "MARIA-JOSE" sit clear of both edges on West Side Story's gym dance tickets (21) and Hocus Pocus 2's festival passes. Ocean's Eleven's crew passes, Dazed and Confused's arcade door sign, Paddington 2's canteen slips and Skyfall's fridge notes all match their menus (22). Small mark: Skyfall's intermission card repeats the door sign's sticky note word for word.

### 9. Polish and craft: 8
No "undefined", "NaN", "null" or "00" numbers in any of the three 900-film passes, and no em or en dashes. Marks off:
- **US spellings.** "In the theater, Mr. DNA shows you..." on Jurassic Park; "Stromboli's puppet theater" on Pinocchio; "Welcome, neighbor" on You've Got Mail. "Skillet" appears on about 20 films (Blazing Saddles, Fried Green Tomatoes, City Slickers, How to Train Your Dragon, 22 Jump Street). It is a dish word more than a spelling, but "cast-iron pan" is the Australian kitchen word in method steps.
- **Spaced hyphens in printed titles.** "Star Wars: Episode I - The Phantom Menace", the other two prequels, "Mission: Impossible - Fallout" and "Ghost Protocol" print a spaced hyphen on the phone menu and Prep sheet, which reads as a dash.
- **A cocktail name in kids' mode.** North by Northwest is kid-safe, and its drink is "Verjuice Gibson with cocktail onion". The drink is alcohol-free; the name is a gin cocktail, like the Manhattan fixed in review 12.
- The repeated content and thin pages under sections 3 and 8.

### 10. Accessibility basics: 9
No change from review 12. The strip's buttons are 44px tall and named; the strip is an aside labelled "Your locked-in film". No sideways scroll, no duplicate ids. Held from 10 for the same reason as before: small swipe-view type on hand-built cards leans on zoom.

## Fix list, ranked by impact

1. **Home, tavern and lab print like the screen.**
   Where: menu-formats/home.js (card paper layers), tavern.js and lab.js (edge ageing and grime layers); the export copy in renderCanvas in app.js.
   Wrong: Skyfall, True Grit and Annabelle print white cards tan-grey, 11 to 20 levels darker (07, 08). The Conjuring, Fantasia, The Fly and I Am Legend lose their aged or grimy edges and print 8 to 13 levels lighter (07, 27).
   Good looks like: the layers html2canvas cannot draw on these three layouts baked into pictures the way review 12 did for the other layouts. Add one film per layout to SAMPLE in check-pdf-tone.cjs, and tighten DARKER and LIGHTER so a lost vignette (+10) fails.

2. **Vegetarian rewrites the Make ahead line.**
   Where: the dish swap in app.js that rewrites name, list and method; it skips make_ahead.
   Wrong: "Roll the beef into balls" on Independence Day's mushroom burgers, "Rub the chicken" on Dirty Work's haloumi (29); Blade's prawns, Ghost's sausage sauce; TMNT's second "pepperoni". About 20 films.
   Good looks like: the same swap applied to make_ahead and every method line. Add a vegetarian check to tests/dry-plan.test.cjs or a new test that reads make_ahead too.

3. **The phone tabs fit their words.**
   Where: .fp-tab in formats-core.js and its CSS.
   Wrong: "Starters" cut off on Casino (03), Donnie Brasco, Analyze This, Miller's Crossing, Get Shorty, TMNT, After Hours.
   Good looks like: tab labels shrink or tighten to fit (as fitLines does elsewhere). Add the 900-film phone fit pass to the scripts.

4. **Wait times read as English.**
   Where: planMin in app.js (line 1311), the Director's cut row (line 1319) and the Prep sheet time line (line 1342).
   Wrong: "15 min + 12 hr, start the day before wait" (06); "then 12 hr, start the day before to marinate".
   Good looks like: "15 min + 12 hr wait, start the day before" and "then 12 hr to marinate, start the day before".

5. **Print frames match the screen.**
   Where: edgeColour and the export copy in app.js; menu-formats/placemat.js border; the candy bar page fill; the invite logo plate.
   Wrong: Mallrats' checker border prints navy (11); Minions sits on white bands (10); An American Tail's logo plate flips white to black (13); Spider-Man 2 drops "By the slice" on paper only (12).
   Good looks like: patterned borders baked like the stripes; the page fill taken from the menu's frame, not the poster; logo plate picked once and reused in the export; the hand-built fit run at the same size on screen and paper.

6. **Shopping lines and dish names.**
   Where: shopLines in app.js; data/films.json.
   Wrong: "1 lychee (565g tin)" (The Farewell), "1 bag fish" (The Little Mermaid), "Giant doughnut doughnuts" (Iron Man 2).
   Good looks like: "1 x 565g tin lychees", "1 bag gummy fish", a real dish name. Add the first two to tests/shop-lines.test.cjs.

7. **Small items.**
   "theater" (Jurassic Park, Pinocchio), "neighbor" (You've Got Mail); spaced hyphens in Star Wars and Mission: Impossible titles; "Verjuice Gibson" in kids' mode; Analyze This' seal over "We won't"; the June calendar strip with nothing on it; the desktop strip and "This week's film" panel saying the same thing; Skyfall's repeated kit note; the long phone Candy bar page.

## Genuinely excellent, leave alone

- Every review 12 fix (20), the Save PDF baking in renderCanvas, and the `--per 2` tone pass across all shared layouts.
- The locked-in strip: clear, small, and it walks back to the right tab from any view (04).
- Kids' mode across all 343 kid-safe films, and the vegetarian swaps in shopping lists and methods (25).
- Hand-built menus in this sample: Things to Do in Denver, Do the Right Thing, Analyze This, Mickey Blue Eyes (09, 14, 15).
- Shared layouts at their best: Gravity's galley (16), Dune and The Return of the King's banquet (18), The Matrix Revolutions' dining car (19), Ghostbusters II (26), Dazed and Confused's diner (28).
- Table kits with long names (21, 22), Galaxy Video and its calendar (23).
- A clean run: no console errors, failed requests, broken images or leaked "undefined", and every test and check passing.

## Note on check-prep-a4

It timed out during the review while four browser passes shared the machine. Run again on its own after the fixes: 900 Prep sheets, 1,708 A4 pages at 4 guests, pass.

## Fixed after the review

1. **Home, tavern and lab print like the screen.** Two causes in the export copy in renderCanvas (app.js). Inset shadows under 16px blur were left for html2canvas, which smears them across the whole card: every blurred inset is now drawn as a picture (home's white recipe cards). A grain layer set to multiply wiped every background layer on its element, so tavern's burnt edge and lab's grime went with it: now only the multiply layers drop and the edge vignette is baked as before. Tagged vignettes (data-vig, canteen) are baked too instead of hidden. Skyfall went from 20 levels darker to 0.7, True Grit from 19 to +1.2, The Conjuring and The Fly from +13 and +8 to under +1.1, A Nightmare on Elm Street from +9.4 to -0.2. check-pdf-tone.cjs now fails anything over 6 levels either way (was 10 darker, 20 lighter) and samples Skyfall, True Grit, The Conjuring and The Fly. `--per 2` across every shared layout: all 60 within -3 to +4.6.
2. **Vegetarian Make ahead.** 55 vegetarian versions in data/recipes2 copied their meat original's Make ahead note. Each now names what it cooks ("Chop the mushrooms for the burgers...", "Rub the haloumi...", "Marinate the tofu..."), plus Iron Giant's chowder and egg rolls and Thunderball's mushrooms. New tests/veg-ahead.test.cjs reads every vegetarian Make ahead note and method step for meat or fish the shopping list does not already name as the vegetarian thing.
3. **Phone tabs.** fmtTabsFit in formats.js steps all four tabs down together (letter spacing first, never under 9px) until each word has clear room, after fonts load and on resize. Casino's tabs sit at 10.5px. New scripts/check-phone-fit.cjs: all 900 phone menus at 390 wide, pass.
4. **Wait wording.** planMin gives the length and planWhen the advice: "15 min + 12 hr wait, start the day before" in Director's cut, "then 12 hr to rest, start the day before" on the Prep sheet.
5. **Print frames.** Conic gradients (Mallrats' checker border) are drawn as a tile (pdfConic). A menu that is not A4 shaped fills its bands with the colour of the edges they touch, and white only wins an edge when it holds more than 60 per cent of it (Minions prints on brown). Filtered images keep their see-through parts as PNG, so a logo with a drop shadow no longer prints on a black plate: this was An American Tail's plate and likely every invite logo. Spider-Man 2 printed "By the slice" on a later run with the fonts loaded; it matches the screen now.
6. **Shopping lines.** A tin, can or jar sized in brackets reads "a 565g tin lychees" in the shopping list and in each dish's You need (The Farewell). Case added to tests/shop-lines.test.cjs. Iron Man 2's sweet is "Giant sprinkle doughnuts". Correction: The Little Mermaid's "1 bag fish" was an error in the review's own text pass, which stripped "gummy"; the list reads "1 bag gummy fish".
7. **Small items.** "theatre" on Jurassic Park and Pinocchio, "neighbour" on You've Got Mail. Kids' mode reads North by Northwest's drink as "Verjuice sour". Analyze This' seal sits clear of "We won't go there." The calendar strip was hidden by design on 1 June; it now shows the next day within six weeks ("Christmas in July, In 30 days").

Left open: spaced hyphens in the Star Wars prequel and Mission: Impossible titles (needs Josh's call on how to write them), the desktop strip repeating the "This week's film" panel, Skyfall's repeated kit note, the long phone Candy bar page, small swipe-view type on hand-built cards.

All 17 node tests pass; check-browser, check-store-taps, check-cut-words, check-prices, check-sweet-starters, check-kids-cards (343), check-prep-a4 (1,708 pages), check-phone-fit (900) and check-pdf-tone (named sample and `--per 2`) pass. Deployed to Netlify (deploy 6aec2e0e).
