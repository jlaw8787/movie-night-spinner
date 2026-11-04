# Seventh independent review

**Overall: 8.0 out of 10**

Movie Night Spinner is still a properly made thing, and review 6's list has held: bar tab menus print whole, pack notes and count words follow the guests, setting and draining count as waiting, the army and prison canteens get their own strips. What keeps it at 8 is a new crop of the same kinds of slip, found on films nobody had opened before. The biggest is kids' mode: a family film can still put gin, champagne and "Must be 19 to order" on the menu. Next is the Prep sheet maths a chef would catch straight away: deep-frying oil scales with the guests (6.8 L of oil for nine at Fargo), and a cake for nine goes into the same two 20cm tins for the same 35 minutes. Psycho's Prep sheet reads "Hands-on 7 days ahead", and its printed menu loses the logo. On the printed menus, several layouts hide every dish note while a quarter of the panel sits empty, and the shared furniture still lands on the wrong films (school periods filled with character names, a "Spring fling, class of 1992" on Strictly Ballroom). None of it is hard to fix.

Tested with Playwright and real Chrome at 390x844 (phone, touch, 2x) and 1440x900 (desktop), on the server as restarted mid-review, with the Print and Save PDF output captured again after the full-coverage change. Every finding below was checked against a screenshot, not just the DOM. Screenshots are docs/review-7-01.png to review-7-24.png.

## How it was tested

- Spin flow by touch on phone and by keyboard on desktop (Tab order from the skip link, Enter to spin, focus after the spin, next Tabs) (01).
- The lock-in pop-up on phone: Director's cut and The full feature, focus on open, what the Prep sheet does after (02).
- 40 printed menus opened directly at desktop at 2x, none used by reviews 2 to 6, covering all 30 shared layouts plus hand-built ones: Airplane!, Titanic, The Addams Family, Fargo, Bad Santa, Ferris Bueller's Day Off, Muriel's Wedding, Predator, Scream, Police Academy, Clueless, Kill Bill: Vol. 1, Bill & Ted's Excellent Adventure, North by Northwest, Galaxy Quest, National Lampoon's Christmas Vacation, Soul Food, The Shining, Annie, Step Brothers, Point Break, Total Recall, Psycho, It's a Wonderful Life, The Goonies, Reservoir Dogs, Strictly Ballroom, Top End Wedding, Blazing Saddles, Dodgeball, Gremlins, The Princess Bride, Paddington, Moana, Smokey and the Bandit, Goodfellas, Ghostbusters, Sinners, Toy Story 2 and Wall-E. Eras 1946 to 2025. Each was also checked by script for console errors, failed requests, broken images and clipped text.
- Print: the Print button with the PDF captured and rendered, for bar tab (Fargo), motel (Psycho), takeaway (Gremlins), diner trifold (Bill & Ted), hotel (Annie), hand-built (Goodfellas), and on the phone (Soul Food).
- Prep sheet and shopping list for Fargo, Muriel's Wedding, Titanic, Soul Food, The Shining, Top End Wedding, Smokey and the Bandit and Paddington at 2, 4 and 9 guests, and at 4 with Vegetarian and No alcohol. Prep sheet headers checked by script across 450 films.
- Kids' mode: 70 G and PG films scanned for alcohol by script with kids' mode off, then 14 opened with kids' mode on.
- Phone: swipe preview, the big-type text menu at 9 guests with methods open.
- Candy bar, and Galaxy Video end to end: walk-in, aisles, hire case, rental slip, Escape.
- Accessibility basics: names on every control, alt text, tab order, target sizes.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 7 |
| 4. Phone experience | 8 |
| 5. Core flow (spin, menu, shopping, cooking) | 7 |
| 6. Galaxy Video store | 9 |
| 7. Polish and craft | 7 |
| 8. Accessibility basics | 8 |
| **Overall** | **8.0** |

### 1. First impression and visual identity: 9
Unchanged and still strong. The phone spin lands on the tabs with the printed menu and the text menu straight under them (01). Nothing new to mark off.

### 2. Brand consistency: 9
Clean. The lock-in pop-up is red and gold (02), the candy bar is cinema, Galaxy Video stays purple, gold, teal and pink through the hire case and rental slip (22, 23). No bleed either way.

### 3. Printed menus: 7
The best of this sample are as good as anything on the site: Goodfellas' prison notepad with "Bad pasta, no sauce" crossed out (21), North by Northwest's Twentieth Century dining car with the brook trout, It's a Wonderful Life's Bailey Building and Loan newspaper, Bill & Ted's Circle K trifold, Predator's chow line, Soul Food's recipe box, Scream's Woodsboro video store. Bar tab totals add up on both pages (Bad Santa 80.00 carried, 105.00 running).

Marks off:
- **Dish notes hidden while the panel sits empty.** Muriel's Wedding (cafe) shows names only, with a big blank band under the logo and under the starters, while the film's own notes ("the alternate drop at every Aussie wedding reception", "The island holiday with Rhonda") exist and show on the phone (03). Point Break (kiosk) hides every note with 200px of empty board above the showtime cue (04). The Goonies, Strictly Ballroom and Christmas Vacation's mains do the same on a smaller scale. The owner's rule is that film notes come first and only drop when space runs out; here they drop with space to spare.
- **Wrong furniture.** Police Academy and Clueless fill the school timetable periods with character names: "Period 1 Jones", "Period 2 Tackleberry", "Period 4 Dionne Davenport, best friend", "Period 5 Josh" (05). Strictly Ballroom is headed "Spring fling, class of 1992" (16). Paddington's house is "The Tea Room, top floor" with "Morning tea from 10" (17). Point Break, in California, gets "Rips running, swim between the flags" (04). Top End Wedding's invitation is headed "Meat tray raffle, Friday"; Muriel's loyalty card is titled "Wedding Invitation". Airline menus open with "Flight 209 · Home to 1980" and "Flight 700 · Home to 2008" (20).
- **Psycho prints without its logo.** On screen the Psycho logo sits in a dark box. In the Print PDF the box is empty and the white logo is invisible against the paper (11).
- **Prices out of line on their own card.** Review 6 fixed precinct, canteen and bar tab; other layouts still put the spirit drink at the bottom. Smokey and the Bandit: bourbon peach sweet tea 0.50 under a Coors at 0.95 (18). Point Break: tequila margaritas 1.25 under a banana split at 2.25. Total Recall: blood orange martini 2.25 under a cherry ginger beer at 2.65. Muriel's Wedding: piña colada 1.95, the cheapest thing on the card, with fairy bread the dearest starter at 4.25 (03). Annie prints "100¢" next to "1.00" on the same card (19).
- **Menus a chef would rebalance.** Ferris Bueller: Chicago dogs, hot sausages, deep dish sausage pie and mini deep dish pizzas on one card. Airplane!: "Airline peanuts 3.75" and "Airline salted peanuts and almonds 2.75" (20). Blazing Saddles: the only kitchen dish is baked beans, under a "Free lunch counter" that charges 1.50. Galaxy Quest serves marshmallows as a starter. Paddington lists Dundee cake under "Sandwiches and savouries" (17). Titanic does boiled potatoes with the ham sandwiches and pommes Anna with the fillet, 1.4kg of potato for four.

### 4. Phone experience: 8
The swipe preview, the big-type text menu and "Every recipe serves 9" all work, and untested card methods now say "As written, serves 4" as decided (24). Marks off: the text menu still scrolls inside its own box, so at 9 guests the open method is cut at the box edge after two lines and the page carries on below it (24). Single-page menus say "Click the menu to read it full size" on the phone. After The full feature on the phone, the page lands in the middle of the shopping list (pantry), not at the top of the Prep sheet.

### 5. Core flow: 7
The lock-in pop-up is clear and both choices work (02); The full feature puts all seven dishes on the list and says so. Vegetarian swaps are good: Muriel's prawn cocktail becomes a haloumi cocktail with fried haloumi and the method follows, sweet and sour pork becomes cauliflower, the Shining board grills eggplant for the salami. No alcohol rebuilds the piña colada with vanilla and more pineapple juice. Counts and pack notes now read right at 2 and 9. A cook will still hit these:
- **Frying oil and cakes scale like everything else.** Fargo at 9 buys 6.8 L of vegetable oil, because the cheese curds (1 L) and the fish fry (2 L) each count their own pot and both scale (13). Soul Food at 9 buys 4.5 L, Muriel's sweet and sour pork 2.3 L. You need one pot of oil whatever the guest count. Muriel's wedding cake at 9 is 675g flour and 9 eggs, still "Divide between two lined 20cm tins and bake at 165°C" for 35 minutes (14).
- **Timing labels that do not make sense.** Psycho's Prep sheet header reads "Hands-on 7 days ahead, Longest 7 days ahead" (12). Another 48 Hrs. reads "Hands-on 5 hr 9 min" because 4 hours drying jerky in the oven and 45 minutes part-freezing the beef count as hands-on. Top End Wedding's pavlova reads "Takes 14 min, then 2 hr 37 min to cool" for a 90 minute bake. Titanic's fillet reads "Prep 5 min, cook 2 hr" when the steaks cook while the pommes Anna bakes, and slicing 800g of potato is more than 5 minutes. 44 films read "Plus 12 hr, start the day before waiting", which is not a sentence.
- **Method and list that disagree.** Top End Wedding's daiquiri tip says "add the coconut water", which is on no list; its barramundi tosses "shredded green mango" while the list buys ripe ones, and the list carries "mangoes" and "ripe mangoes" as separate lines (19 mangoes at 9). Muriel's piña colada still has "Swap the rum for extra pineapple juice to make it alcohol-free" inside a timed step; review 6's tip rule misses this wording. Paper umbrellas are on the alcohol-free list only. Smokey's bourbon steps have no time chips while the alcohol-free version does.
- **Odd lines.** "2 iceberg lettuce" at 9. "1 cabbage, shredded", "1 lemon, juiced", "salt and pepper, to taste" and "1/4 tsp salt" on the shopping list. "4 eye fillets of steaks". "1 1/3 tbsp soy sauce" on the vegetarian Muriel list. Fargo's method steps have no full stops while every other film's do. The vegetarian Shining main buys two 1.2kg butternut pumpkins for four.

### 6. Galaxy Video store: 9
Still the most fun part of the site: shopfront with "New releases 3 nights $4" in the window, aisles with tape counts, a hire case with tagline, staff tip and tonight's menu (22), a rental slip with due date, $4.00 and change from a $10 note, and Escape back to the store (23). One small line: the slip for a 2025 new release says "The cover's been in that sleeve since the shop opened."

### 7. Polish and craft: 7
No console errors, failed requests or broken images across the 40 menus, the 70 kids' films and the store. No em or en dashes in anything that rendered. The slips this time: Christmas Vacation's fridge magnets read "2500" where the recipe box is No. 25000, and its note is headed "Read me before the fridge" (06). Fargo's script title overlaps the "Hands-on" chip on the Prep sheet (13). Reservoir Dogs' Mr Pink note card is 60% blank (15). US spellings on a few cards ("flavored", "wobbly center"), and "Stu's party lasagne" described as "Beef lasagna". The lock-in pop-up mixes voices: "I'll pick the dishes. The shopping list follows what you tick."

### 8. Accessibility basics: 8
Solid. Every visible control has a name and every image has alt text. Skip link first, then the three views, sound, Spin; a keyboard spin moves focus to "Now showing: Evil Dead II (1987)" and the next Tabs go Menu, Prep sheet, the printed menu, the series link. The 22px checklist ticks sit inside larger labels. The phone text menu's inner scroll box is still easy to miss with a screen reader.

## Fix list, ranked by impact

1. **Close the alcohol leaks in kids' mode and on family films.**
   Where: kids' mode on The Fifth Element (airline), Splash (hand-built oceansupper), Top Gun (bar tab); Christmas Vacation (home) and Gremlins (takeaway) with kids' mode off.
   Wrong: "Multipass dirty verjuice" described as "Gin, verjuice and olive brine" (08); Splash keeps "Champagne, dry French, by the glass" and "Must be 19 to order" (10); Top Gun keeps "Beer-battered onion rings" (09); Christmas Vacation lists "Ice cold lager in a can" over a footer saying "Every drink alcohol free", because the house drink's alc flag is not counted (06); Gremlins serves "Hot buttered syrup with nutmeg", a half-swapped hot buttered rum (07).
   Good looks like: the swap runs on names and descriptions together on every layout and on hand-built menus; house lines with alc go through the swap or drop; the alcohol-free footer only prints when every line on the card is dry; whole-name swaps for warm drinks ("Hot buttered rum" to "Hot spiced apple"). A test that opens every kid-safe film in kids' mode and fails on any alcohol word.

2. **Stop frying oil and bakes scaling with the guests.**
   Where: shopping list and method at any count, Fargo, Soul Food, Muriel's Wedding.
   Wrong: 6.8 L of oil for nine at Fargo, two pots counted separately (13); a 9-egg cake into the same two 20cm tins for 35 minutes (14).
   Good looks like: deep-frying oil is a fixed pot (2 to 3 L) shared across the dishes on the sheet and does not scale; bakes over about 1.5x say "make two" or move to a bigger tin with a longer time.

3. **Fix the Prep sheet time labels.**
   Where: dishTimes and the header chips in app.js; Psycho, Another 48 Hrs., Top End Wedding, Titanic.
   Wrong: "Hands-on 7 days ahead" (12); oven drying and part-freezing counted as hands-on; "2 hr 37 min to cool" for a 90 minute bake; "cook 2 hr" for steps that overlap; "Plus 12 hr, start the day before waiting" on 44 films.
   Good looks like: hands-on is always minutes and hours; oven drying, freezing and part-freezing are waiting; steps that run alongside each other are not added; the long-wait chip reads "Start the day before" on its own.

4. **Show dish notes where there is room.**
   Where: cafe (Muriel's Wedding), kiosk (Point Break), placemat (The Goonies), prom (Strictly Ballroom), home mains (Christmas Vacation).
   Wrong: every note hidden with a quarter of the panel empty (03, 04).
   Good looks like: the fitter shows the film's notes first and only drops them, from the bottom, when the panel is actually full, the same shrink-then-drop rule the canteen and candy bar now use.

5. **Make print match the screen on the motel layout.**
   Where: Print and Save PDF on Psycho (motel cover).
   Wrong: the logo box prints empty, the white logo lost on the paper (11).
   Good looks like: the logo panel's dark fill survives into the PDF; a check that compares logo pixels on screen and in the PDF for one film per layout.

6. **Keep shared furniture to films it fits.**
   Where: canteen timetable (Police Academy, Clueless), prom header (Strictly Ballroom), tearoom footer (Paddington), kiosk surf report (Point Break), pub prop (Top End Wedding), cafe card (Muriel's Wedding), airline header.
   Wrong: periods filled with people (05), "Spring fling, class of 1992" (16), "The Tea Room, top floor" on a house (17), "swim between the flags" in California, "Meat tray raffle, Friday" over a wedding invitation, "Home to 1980".
   Good looks like: timetable slots are lessons or duties, never names; the prom header reads as a dance comp for dance films; tearoom lines swap to home lines for a house; flags only for Australian beaches; the airline line reads "Now boarding" or the route.

7. **Bring prices into line on the remaining layouts.**
   Where: truck (Smokey), kiosk (Point Break), lab (Total Recall), cafe (Muriel's Wedding), hotel (Annie).
   Wrong: spirit drinks priced under soft drinks and beer, a cocktail the cheapest line on the card (18, 03); "100¢" beside "1.00" (19).
   Good looks like: the precinct, canteen and bar tab rule (mains over starters and sweets, spirits over beer and soft drinks) on every layout; one price style per card.

8. **Make method and list agree, and tidy the odd lines.**
   Where: Top End Wedding, Muriel's Wedding, Smokey, Fargo, Titanic.
   Wrong: coconut water in a tip and on no list; green mango in the method, ripe on the list, and mangoes on two lines; a non-drinker sentence inside a timed step; umbrellas only on the dry list; no time chips on Smokey's bourbon steps; "2 iceberg lettuce", "1 cabbage, shredded", "salt and pepper, to taste", "4 eye fillets of steaks".
   Good looks like: every ingredient a step or tip names is on the list; one line per item with its state ("2 mangoes, 1 green"); prep words stay in the method; the tip rule catches "to make it alcohol-free"; lettuces pluralise.

9. **Rebalance the menus a chef would send back.**
   Where: Ferris Bueller, Airplane!, Blazing Saddles, Galaxy Quest, Paddington, Titanic, vegetarian Shining.
   Good looks like: no more than one sausage and one deep dish per card; one peanut line; a proper main beside the beans; starters that are savoury; Dundee cake under the cake trolley; one potato dish per menu; one butternut for four.

10. **Small craft items.**
    Christmas Vacation magnets "2500" (show the full number or drop to "No. 25000") and "Read me before the fridge" (06). Fargo's title overlapping the Prep sheet chip (13). Reservoir Dogs' blank note card (15). "Click" to "Tap" on phone hints. The full feature on phone to land at the top of the Prep sheet. "flavored", "center", "lasagna" to Australian spelling. Lock-in copy in one voice ("Pick the dishes"). The new release slip line about the old sleeve.

## Genuinely excellent, leave alone

- The marquee, brass wheel and the spin landing you on the tabs with focus on "Now showing".
- The lock-in pop-up: two plain choices, cinema colours, focus on the first, and a status line that says what happened.
- Hand-built menus: Goodfellas' notepad, plus the ones earlier reviews named.
- The best shared menus from this sample: North by Northwest, It's a Wonderful Life, Bill & Ted, Predator, Soul Food, Scream, Kill Bill, The Shining, Total Recall, Gremlins, Bad Santa's tab that adds up.
- Vegetarian swaps that rewrite the method, not just the name (haloumi cocktail, mushroom and leek vol-au-vents, cauliflower sweet and sour).
- Count words and pack notes at 2 and 9 guests, fixed and holding.
- Print PDFs with no browser furniture, full-colour pages and a light prep sheet.
- Galaxy Video end to end.
- No console errors, failed requests or broken images in anything opened.

## Fixed after the review

- Print, full coverage (4 Nov, before this list was worked): Save PDF and Print fill every page edge to edge with the menu's own paper colour (white print padding trimmed), the menu sits 4mm in, and each PDF carries its print settings: actual size, and two-sided with the right flip for folded and two-sided menus. Audited all 120 layouts through the real Print button.
- Fix 1, alcohol leaks (4 Nov): one alcohol-free pass now runs over the finished card and the phone menu whenever kids' mode or alcohol-free is on, or the film is a family film, on every shared layout and hand-built menu (Splash's champagne and "Must be 19 to order" go; The Fifth Element's gin, Top Gun's beer batter and Gremlins' hot buttered rum are swapped). Whole drink names swap first, cooking phrases lose just the alcohol word, vinegars and root, ginger and butter beer stay, and "by the pint" stays a measure. House lines with alcohol drop on dry cards, so Christmas Vacation's "Every drink alcohol free" is true. New browser check opens one film per layout in kids' mode and fails on any alcohol word.
