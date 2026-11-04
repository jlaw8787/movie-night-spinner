# Ninth independent review

**Overall: 7.9 out of 10**

Movie Night Spinner still looks like nothing else out there. The marquee, the brass wheel, the menus built as props from inside each film and the Galaxy Video store are all at launch standard. Review 7 and 8's fixes mostly hold: Psycho's logo prints, the place card grid is fixed, bake batches and time labels read right. This round opened 35 films no review had used, scanned 160 more by script and every family film in kids' mode, and found the same kinds of slip in new places. The biggest is a regression: frying oil scales with the guests again when the recipe just says "vegetable oil" (4.5 L for nine at Everything Everywhere All at Once). Next are cut words on printed menus ("yellow mustard and.", "in a flute and."), kids' mode swaps that read like a glitch ("for goodness' syrup", "root root beer"), prices out of order on four more layouts, and two phone layout faults in the week panel and after Director's cut. Against a 9.5 launch target it is close but not there.

Tested with Playwright and Chromium at 390x844 (iPhone 13, touch, 2x) and 1440x900 (desktop, 2x), on a local server at commit 429ef93 on wip/store-overhaul, with service workers blocked. Every finding below was checked against a screenshot, not just the DOM. Screenshots are docs/review-9-01.png to review-9-30.png.

## How it was tested

- First visit and spin on both sizes, by click and by touch (01, 02).
- 35 printed menus opened directly at desktop, none named in reviews 2 to 8, covering all 30 shared layouts plus hand-built ones: Casino, Get Shorty, Julie & Julia, Inside Man, The Pope of Greenwich Village, Chitty Chitty Bang Bang, Army of Darkness, Rocky V, Kingsman: The Secret Service, La La Land, Hunt for the Wilderpeople, Hairspray, Mean Girls, Dreamgirls, The Sixth Sense, Romancing the Stone, Solo: A Star Wars Story, What We Do in the Shadows, Billy Madison, My Best Friend's Wedding, It Follows, The Thing, Hot Tub Time Machine, Anchorman 2, Fast Times at Ridgemont High, The Other Guys, Footloose, Eurovision Song Contest, The Good, the Bad and the Ugly, Little Giants, Everything Everywhere All at Once, Harry Potter and the Prisoner of Azkaban, Mary Poppins, Ticket to Paradise, Inspector Gadget. Eras 1964 to 2022. Each checked by script for console errors, failed requests, broken images, clipped text, dashes and US spellings.
- A wider script pass over 162 films (five per layout plus a dozen hand-built) for cut words, dashes, doubled words and US spellings, then the hits opened and screenshotted (Hitch, 28).
- Save PDF (menu and prep sheet) and Print captured and rendered with pdftoppm for Get Shorty (hand-built), The Thing (lab), Hunt for the Wilderpeople (campfire), Hot Tub Time Machine (motel) and Everything Everywhere All at Once (takeaway) (10, 18).
- Prep sheet and shopping list for Romancing the Stone, Hunt for the Wilderpeople, Rocky V, Kingsman, Dreamgirls and Everything Everywhere at 2, 4 and 9 guests, and at 4 with Vegetarian and with No alcohol.
- Lock-in pop-up on the phone, both choices, and the week panel after it (20, 21).
- Kids' mode: all 200 films with a kids, fairytale, Christmas or wizard theme opened with kids' mode on, card and phone menu scanned for alcohol words and for swaps that read wrong (15, 16, 17).
- Galaxy Video on the phone end to end: walk-in, deal board, member card, aisles, hire case, rental slip (23). Calendar strip and seasonal shelves on 4 Nov 2026, 10 Nov 2026, 15 Dec 2026, 10 Jan 2027 and 27 Mar 2027 (22).
- Table kit for eight films with "Alexandra Fitzgerald-Hughes", "Bo", "Christopher Montgomery" and "Josh", the dialog on both sizes, and Save PDF rendered for Chitty Chitty Bang Bang (24, 25).
- Candy bar on the phone (26).
- Accessibility: names on every control, alt text, heading outline, tab order from the skip link, target sizes, contrast on the store's aisle buttons.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 7 |
| 4. Phone experience | 7 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 7 |
| 6. Galaxy Video store | 8 |
| 7. Table kit | 8 |
| 8. Polish and craft | 7 |
| 9. Accessibility basics | 8 |
| **Overall** | **7.9** |

### 1. First impression and visual identity: 9
The cinema lobby, the brass wheel with its bulbs and the red and gold buttons land straight away (01). A spin on desktop lands on Casablanca with the printed menu, "Goes well with" snacks and the action row beside the wheel (02). On the phone the spin lands on the tabs with the printed menu first. Nothing new to mark off.

### 2. Brand consistency: 9
Clean. The lock-in pop-up, Save PDF picker and table kit dialog are red and gold (21). Galaxy Video stays purple, gold, teal and pink from the shopfront to the slip (23). The seasonal chips take their own colours (Movember brown, Christmas red, Summer teal) but sit inside the store's frame and type, which reads as shelf signage rather than a third brand (22). The candy bar is cinema (26).

### 3. Printed menus: 7
The best of this sample are excellent. Casino's Tangiers coffee shop with "10 blueberries, every muffin" and Ace's rules (03). Julie & Julia's two-city spread priced in old francs and then "Prices are the grocery bill" (04). The Thing's ration sheet with MacReady's access badge (07). Little Giants' scoreboard and section map (11). Eurovision's Husavik pub board with "Milk left out for the elves" (27). Everything Everywhere's takeaway with "Taxes Not Included" and a fortune card from the laundromat. Harry Potter's Three Broomsticks in crowns. Ticket to Paradise's island chart. Hunt for the Wilderpeople's bush hut with merit badges (12). Photos sit in proportion on screen and in the PDF (10, 18).

Marks off:
- **Cut words.** Dreamgirls: "Beef frankfurts in soft rolls under a fine, spiced beef chilli sauce with yellow mustard and." (06). Hitch: "topped with cold brut sparkling wine in a flute and." and the Keep This card "Results not guaranteed, effort is" (28). The script pass found these by the trailing "and." The owner's rule is no cut words.
- **Overlap on a hand-built menu.** Get Shorty's "Before the meeting" heading runs into the bottom of the black House Rule box over the Bloody Mary, on screen and in the PDF (05, 18).
- **Prices out of line on layouts the price check misses.** The Thing (lab): MacReady's Rob Roy $2.31, under a hot rum toddy at $5.95 and under the jelly at $4.75 (07). Solo (galley): the roast pork knuckle main is 12 cr, the cheapest thing on the card, under 36 cr nuts (08). Billy Madison (hotel): chilli cheese dogs are the dearest dish at 28.12 (14). Hot Tub Time Machine (motel): the vodka fizz 0.95 sits under 1.75 brownies (10). Mary Poppins mixes "75¢" and "$1.25" on one card (30). Review 7 asked for one price style per card.
- **Furniture that does not fit.** The bistro header "Dîner pour deux" sits over a London tailor (Kingsman, 09) and a New York date doctor (Hitch, 28). Mean Girls lists peppermint bark as a starter and puts the starters under the mains (13).

### 4. Phone experience: 7
The printed menu comes first with "Swipe to turn, tap to zoom" and dots, then the big-type text menu with Starters, Mains, Sweets and Drinks tabs and "How to make it" buttons (19). No sideways scroll anywhere. Marks off:
- **The week panel breaks on the phone.** After lock-in, "This week's film" squeezes the title into a one-letter column: D r e a m g i r l s ( 2 0 0 6 ) runs down the panel, and Eurovision's title runs the height of the screen (20). The three buttons take all the width. On desktop the same panel is fine.
- **Director's cut lands in the wrong place.** On the phone, choosing Director's cut scrolls to the middle of the shopping list (DAIRY, PANTRY), 1,250px below the dish ticks it asks you to use (21). Review 7's fix moved The full feature to the top of the Prep sheet; Director's cut needs the same, but to the ticks.

### 5. Core flow: 7
Lock-in is clear: "Roll credits on the menu", two plain choices, focus on the first, and a status line that says what happened (21). Vegetarian swaps are good and rewrite the list: Rocky V's pork neck becomes portobellos and cauliflower steaks, Everything Everywhere's dumplings go tofu and shiitake, Dreamgirls' Coney dogs go vegetarian frankfurts with a lentil chilli. No alcohol swaps Dreamgirls' champagne cocktail to alcohol-free sparkling wine and moves it from Bottle shop to Drinks. Bake batches and the "start the day before" chip from review 7 hold. A cook will still hit these:
- **Frying oil scales again.** Everything Everywhere's sesame balls fry in "vegetable oil": 1 L at 2, 2 L at 4, 4.5 L at 9 (29). Review 7's fix only catches oil written "for frying": Romancing the Stone and Rocky V, which say it, hold at 1 L at every count.
- **Pack notes that don't follow the guests.** "565ml fresh lime juice (about 10 limes)" at 9 and "125ml (about 10 limes)" at 2, both Romancing the Stone. "9 thin beef rounds of steaks, about 600g" at 9 (Rocky V). "1.6 L full cream milk, 80ml for the mash, 125ml for the coating, 500ml for the gravy" at 9, where the split still adds to 705ml.
- **Odd lines.** "3 green chillis" (Australian is chillies). "beef rounds of steaks". "1 2/3 tbsp caster sugar" and "3/4 tbsp caster sugar" on Rocky V, after review 7 said spoons round to halves. "1 can brown lentils (400 g)" on one list and "400g tin brown lentils" on another.
- **Kids' mode is dry but some swaps read wrong.** No alcohol word got through on any of the 200 family films. But the word swap hits phrases that aren't drinks: Mulan's grandmother says "for goodness' syrup, do not spill the tea" (sake, 15). E.T. serves "Fridge raid root root beer floats" (16). The Holiday's rarebit is "a melted alcohol-free root beer and mustard cheddar sauce" (17). Roger Rabbit has "glazed mocktail franks" and Home Alone "4 mocktail cherries". Ratatouille's phone method says "Pour into grape juice glasses".

### 6. Galaxy Video store: 8
Still the most fun part of the site. The walk-in, the deal board with "$2 Tuesday, On tonight", the member card with "Late fees: none. Good member.", aisles with tape counts, a hire case with staff tip and tonight's menu, and a slip with due date, "$10 note, change $8.00" and a counter add-on that goes on the shopping list (23). The calendar strip does what the owner set: on 4 Nov it shows Movember and Christmas, on 10 Nov it adds Friday the 13th, on 15 Dec Christmas with New Year's Eve "In 16 days, 31 Dec", on 10 Jan Summer holidays alone, on 27 Mar Easter with April Fools "In 5 days, 1 Apr" (22). The shelves follow the strip. Marks off:
- Every "On now" chip repeats "On the shelves now" under its name, two or three times in a row under a label that already says On now (22).
- The "Spin this aisle" buttons take the shelf colour as text on the dark purple: Movember's #8a5a2b at 13px is about 3 to 1, and Friday the 13th's red is no better (23).
- A weekly hire of Anchorman 2 still says "The cover's been in that sleeve since the shop opened." For a 2013 film on the Weeklys that is a stretch.

### 7. Table kit: 8
Review 8's fixes hold. The place card grid stays two equal columns with "Alexandra Fitzgerald-Hughes" and "Bo" on the same page, and long names go to a smaller size instead of widening the column (25). Place card pages print on white. The dialog counts right: "3 pages: the door sign, 6 place cards, 3 left blank to write in, and the intermission card." The phone dialog shows real thumbnails. Strong pages: Hunt for the Wilderpeople's signpost and haiku pages, Chitty's boarding passes, Solo's Kessel Run pass, The Good, the Bad and the Ugly's trading post card. Marks off:
- **The departures board still cuts a word.** Chitty Chitty Bang Bang's door sign reads "POTTS FAMILY FLYING MOTOR C" in the Gate cell, on screen and in the saved PDF (24). Review 8's fix wrapped the intermission board; the door sign's first row was missed. The intermission board fits the long dessert by dropping it to tiny type instead.
- The Good, the Bad and the Ugly's intermission still says "The saloon will close for fifteen minutes" over a trading post. Probably fine for a western, but the venue is not a saloon.

### 8. Polish and craft: 7
No console errors, failed requests or broken images across the 35 menus, the 162 film scan, 200 kids' films, the store on five dates and the kit. No em or en dashes in anything rendered or in the data. The slips are the cut words above, plus:
- US spellings still in rendered text: "neighborhood" (Once Upon a Time in America, Carlito's Way), "theater" (Newsies, Last Action Hero's "Pandora Theater"), "colors" and "colored" (Demolition Man, Get Out, Animal House), "powdered sugar" (Mean Streets, Happy Gilmore), "scallion" (Casino, The Last Dragon), "creamy center" (Get Shorty, 05), "guest of honor" (Weekend at Bernie's), "11:42 P.M." (Julie & Julia, 04). The data files hold about 230 "cookies" and 130 "candy". Some are American settings and fair; "powdered sugar", "scallion" and "center" in a recipe line are not.
- Doubled words from swaps: "root root beer" (16).

### 9. Accessibility basics: 8
Solid. Every visible control has a name and every image has alt text. The page has lang, a skip link first, then Box office, Candy bar, Galaxy Video, sound, Spin, programme, find a film. The H1 reads "Movie Night" from its label. No duplicate ids. Marks off: the aisle "Spin this aisle" buttons are low contrast (above). The watched ticks are 22x22 inside their rows, fine on a mouse, tight on a phone. The kit's departures board drops long items to about 6pt type to fit (24).

## Fix list, ranked by impact

1. **Stop frying oil scaling, whatever the recipe calls it.**
   Where: the oil rule in planShopping and the method scaling in app.js; Everything Everywhere All at Once.
   Wrong: "vegetable oil" without "for frying" scales: 4.5 L for nine (29), 2 L for four, 1 L for two.
   Good looks like: any oil line in a dish with a deep-fry step (fry at 160 to 190°C, deep-fry, "fry in the vegetable oil") is one pot that does not scale and is shared across the sheet. Add Everything Everywhere at 9 to the shopping test.

2. **No cut words on printed menus.**
   Where: the club, bistro and hand-built fitters; Dreamgirls, Hitch, Get Shorty.
   Wrong: "yellow mustard and." (06), "in a flute and." and "effort is" (28), "Before the meeting" over the Bloody Mary box (05).
   Good looks like: a note shortens at a full phrase or drops whole, never mid-clause. A script check that fails on a note or line ending in and, with, of, in, the, a, or is. Get Shorty's section heading clears the box above.

3. **Kids' mode swaps that read wrong.**
   Where: KDRY in app.js.
   Wrong: "for goodness' syrup" (15), "root root beer" (16), "alcohol-free root beer and mustard cheddar sauce" (17), "mocktail franks", "mocktail cherries", "grape juice glasses".
   Good looks like: "for goodness' sake" left alone; "root beer" and "alcohol-free" words skipped by the beer swap; cocktail franks, cocktail cherries, cocktail sauce and wine glasses on the leave-alone list. Add a check for doubled words and for "alcohol-free root" after the dry pass.

4. **Put prices in order on lab, galley, hotel and motel, and one price style per card.**
   Where: priceSense in app.js and the layouts it does not cover; The Thing, Solo, Billy Madison, Hot Tub Time Machine, Mary Poppins.
   Wrong: a $2.31 Rob Roy under jelly (07); a 12 cr main the cheapest dish (08); chilli dogs the dearest dish at 28.12 (14); a vodka fizz under brownies (10); "75¢" next to "$1.25" (30).
   Good looks like: the same rule as review 7 on every layout; a raised price lands on a sensible ending (.25, .50, .95), not .12 or .31; cents or dollars per card, not both.

5. **Fix the phone week panel and where Director's cut lands.**
   Where: the week panel layout and lockAsk's scroll.
   Wrong: the film title one letter per line (20); Director's cut lands mid shopping list, 1,250px below the ticks (21).
   Good looks like: on narrow screens the title takes the full width under the poster and the three buttons wrap below it; Director's cut scrolls to the "Choose dishes" list with focus on the first tick.

6. **Make pack notes follow the guests.**
   Where: the pack note scaling in planShopping.
   Wrong: "(about 10 limes)" at 2 and at 9; "9 thin beef rounds of steaks, about 600g"; a milk split that adds to 705ml on a 1.6 L line.
   Good looks like: "(about 22 limes)" at 9; "9 thin beef round steaks, about 1.35kg"; split notes either scale or move to the method.

7. **Finish the departures board on the kit door sign.**
   Where: kit departures, door sign Gate cell.
   Wrong: "POTTS FAMILY FLYING MOTOR C" (24); long intermission items shrink to about 6pt.
   Good looks like: the same wrap and size rule as the intermission board, with a floor that stays readable when printed, and the venue in Destination when it is long.

8. **Australian spelling and tidy shopping lines.**
   Where: data/films.json, data/film-flavour.json, the shopping list formatter.
   Wrong: "neighborhood", "theater", "colors", "powdered sugar", "scallion", "creamy center", "P.M.", "3 green chillis", "beef rounds of steaks", "1 2/3 tbsp", "(400 g)".
   Good looks like: Australian spelling in descriptions and recipe text (icing sugar, spring onion, centre, colours), proper names left alone; chillies; spoons to halves; one tin style.

9. **Small items.**
   "Dîner pour deux" only for French or date-night venues, not a tailor (09). Mean Girls: peppermint bark under pudding and starters above mains (13). Galaxy Video: drop the repeated "On the shelves now" under On now (22); give "Spin this aisle" a contrast of at least 4.5 to 1 (23); the old sleeve line only for older new releases. The kit's saloon line only for real saloons.

## Genuinely excellent, leave alone

- The marquee, brass wheel and the spin landing on the menu (01, 02).
- The lock-in pop-up: two plain choices in cinema colours, focus on the first.
- Hand-built menus: Casino's Tangiers coffee shop (03), Julie & Julia's two cities (04), and the ones earlier reviews named.
- The best shared menus from this sample: The Thing (07), Little Giants (11), Hunt for the Wilderpeople (12), Eurovision (27), Everything Everywhere All at Once, Harry Potter and the Prisoner of Azkaban, Ticket to Paradise, Footloose, It Follows, Anchorman 2.
- Vegetarian swaps that rewrite the list and method, and the no alcohol swap that moves a drink from Bottle shop to Drinks.
- Galaxy Video end to end, and the holiday calendar strip that shows only what is close (22, 23).
- The table kit's place card grid with long and short names on one page (25).
- Print and Save PDF: full colour menu pages, light prep sheet, photos in proportion (10, 18).
- No console errors, failed requests, broken images or dashes in anything opened.

## Fixed after the review

- Fix 1, frying oil (4 Nov): half a litre or more of plain oil is the frying pot whatever the recipe calls it, so it never scales and dishes on one sheet share it. Everything Everywhere's sesame balls keep 2 L of vegetable oil at 2, 4 and 9 guests, on the list and under You need. Spoon oils (sesame, chilli) still scale. New tests/shop-lines.test.cjs runs the real shopping code at 2, 4 and 9.
- Fix 2, cut words (4 Nov): a note shortened to fit never ends on a joining word. The shared note trim (every shared layout goes through it) and the kiosk, prom and pub trims take off a trailing "and", "with", "of", "in", "the", "a", "is" and the like, so Dreamgirls reads "with yellow mustard." and Hitch "in a flute." New scripts/check-cut-words.cjs renders three films per shared layout plus Dreamgirls and Hitch and fails on any printed or phone line cut on one of those words (it failed on both before the fix; after it, 10 films per layout pass). Lines written that way in the data are listed as a warning, not a failure: Hitch's Keep This card "Results not guaranteed, effort is" is the film's own line in data/film-flavour.json, left for the data pass. Not done here: Get Shorty's "Before the meeting" over the House Rule box is in the hand-built formats.js, which another team is editing.
- Fix 3, kids' mode swaps (4 Nov): phrases that aren't drinks are left alone and put back if a layout's own swap got to them first: "for goodness' sake" (Mulan), cocktail franks, cherries, sauce and sticks (Roger Rabbit, Home Alone), wine glasses (Ratatouille). The beer swap skips "root beer" and anything already "alcohol-free", so E.T. serves "Fridge raid root beer floats" and The Holiday's rarebit is "a melted alcohol-free beer and mustard cheddar sauce". Doubled swap words fold back to one. The repair runs on every card, since layouts dry PG films too. The kids' mode browser check now also fails on doubled words, "alcohol-free root", "goodness' syrup", "mocktail franks" and "grape juice glass", and always includes those six films.
- Fix 4, prices (4 Nov): the shared price check now also runs on galley and motel, and knows more spirit drinks (Rob Roy, sazerac, sidecar, gimlet, mai tai, grog, sake and others). A raised price keeps its cents only when they read like a price, otherwise it lands on .25, .50 or .95, and any price left with odd cents (a film number like 28.12) goes up to the next of those. Credits and "45c" style prices keep their own style when raised. The Thing's Rob Roy is 6.50 over the 5.95 toddy and the 4.75 jelly, Solo's pork knuckle 48 cr over the 41 cr dumplings, Billy Madison's chilli dogs 28.25, Hot Tub Time Machine's vodka fizz 2.25 over 1.75 brownies. The 1960s tearoom prints every price in dollars ("$0.75" beside "$1.25"), so Mary Poppins has one style.
