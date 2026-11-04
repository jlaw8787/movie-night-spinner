# Sixth independent review

**Overall: 8.0 out of 10**

Movie Night Spinner is still the best version of this idea I have seen. Review 5's list really has been worked through: the diet switches redraw the card, the phone text menu now says "Every recipe serves 9" and scales, the newsprint is back, Galaxy Video's prices agree, cook times no longer fall below the heat steps. The new Print button works on desktop and phone. The score drops a touch because of one new and serious fault and a set of Prep sheet slips a chef would catch. The fault: printing a bar tab menu (33 films) loses most of page one. The screen shows six dishes, the printout shows two, with "Carried over 92.00" under them. On the Prep sheet, the scaling engine still talks in the wrong numbers at 2 and 9 guests ("1 lemons", "3 cobs of loaf", "4 stubbies" for 9 people, "Stir the juice of three lemons" whatever the count), long setting and draining times are counted as hands-on time, and some menus are far too heavy for four people. A few shared layouts still clip a line or pick the wrong furniture. All fixable.

Tested with Playwright and real Chrome at 390x844 (phone, touch, 2x) and 1440x900 (desktop), on the server restarted after the container stop, so every check that had been running when it went down was run again. Every finding below was checked against a screenshot, not just the DOM. Screenshots are docs/review-6-01.png to review-6-23.png.

## How it was tested

- Spin flow by touch on phone and by keyboard on desktop (Tab to skip link, Enter to Spin, Enter to spin, then Tab through the result) (01, 02).
- 46 printed menus opened directly at desktop and screenshotted at full size, picked to avoid the films earlier reviews used: one or two from every shared layout (Caddyshack, Last Holiday, Red Heat, Stripes, Flubber, Young Frankenstein, Small Soldiers, Easter Parade, Kate & Leopold, Enter the Dragon, The Castle, Coneheads, Stakeout, Car Wash, Young Einstein, Storm Boy, Fletch, The Lighthorsemen, Encino Man, Leap Year, El Mariachi, Time Bandits, Running Scared, Under Siege, Dirty Work, The Wog Boy, Better Off Dead, The Five Heartbeats, Mouse Hunt, Screwed, Friendship, BASEketball, Ladies in Black, Holiday Inn, Strange Brew, Black Sheep, Shanghai Noon, 48 Hrs., Robin Hood) and hand-built ones (Big Night, Chef, Fried Green Tomatoes, Quick Change, C.H.U.D.). Eras 1942 to 2025.
- A further 110 films picked at random and checked by script for console errors, failed requests, broken images, clipped text and cut-off words; everything flagged was then looked at on screen.
- Print: the new Print button on desktop and phone, and the print output itself rendered to A4 PDF for The Castle, Leap Year, El Mariachi and Caddyshack.
- Prep sheet and shopping list for Big Night, The Castle, Caddyshack, Under Siege, Ladies in Black and Shanghai Noon at 2, 4 and 9 guests, and at 4 with Vegetarian and No alcohol on. Cook and prep times checked by script across all 4,517 dishes.
- Phone: swipe preview, dots, the big-type text menu and its How to make it at 9 guests.
- Candy bar, and Galaxy Video end to end: walk-in, member card signed by keyboard, price board, hire case, rental slip, Escape.
- Accessibility basics: names on every button and link, alt text, focus after a spin, tab order, target sizes.

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
Still strong (01, 02). The marquee ticks through titles while the wheel turns, then lands on the film; the phone opens on marquee, tab bar and the top of the wheel. Wheel wedge labels now cut at a word. Nothing new to mark off.

### 2. Brand consistency: 9
Clean. Cinema, candy bar and the new Print button are red and gold; Galaxy Video stays purple, gold, teal and pink, including its dialogs and the rental slip (18 to 20). No bleed either way.

### 3. Printed menus: 7
On screen the menus are as good as ever. Big Night's Paradise menu ("No side of spaghetti with the risotto. Primo will not budge.") (21), Fried Green Tomatoes' Whistle Stop bill of fare with the train times and the bee tree (22), C.H.U.D.'s Spring & Crosby coffee shop on a Soho street map with sewer mains and manhole covers (23), Chef's El Jefe chalkboard, The Castle's fridge door, The Lighthorsemen's billy tea and Anzac biscuits, Storm Boy's Coorong kiosk with Mr Percival on the surf report, Strange Brew's two four and butter tarts. The surf report now only shows where there is a beach (Young Einstein gets "Out front" instead), and The Wog Boy, Ladies in Black and Holiday Inn price on their own period scale.

Marks off:
- **Printing a bar tab menu drops most of page one.** On screen Leap Year's page one lists four snacks and two plates; the printout lists soda bread and smoked salmon, then "Carried over 92.00" (03). El Mariachi prints two of six dishes and its "Border Town Cantina" heading runs off the top (04). The print copy shows the dish descriptions the screen version hides, so the list overflows and the bottom is cut. Bistro (Caddyshack) and home (The Castle) printed whole (04). All 33 bar tab films are at risk; I did not check every layout in print.
- **Lines still clipped on shared layouts.** 48 Hrs.: "Reggie Hammond let out of prison for two" stops mid-sentence (05). Easter Parade: "Manhattan with a cherry" is cut in half by the combo bar; Small Soldiers: "served in camping mugs" cut the same way (09). Red Heat: "Seared beef strips in a mushroom." (10). Ladies in Black hides its whole drinks section behind the still for about five seconds after it opens, then refits (11), so a quick Save PDF or Print can catch it.
- **Wrong furniture, still.** Stripes, an army film, gets a school timetable: "Period 2 Maths", "Period 4 Library" (06). 48 Hrs. lists "San Francisco sourdough, warm torn sourdough with roasted garlic butter" and "Sourdough with roasted garlic butter" on one card (05).
- **Kids' alcohol swap breaks dish names.** Mouse Hunt's drink reads "syrup Alexander" (07), and Monsters University serves "root beer battered onion rings". Young Frankenstein keeps "Frau Blücher's brandy milk punch" as the name but the description has no brandy (08).
- **Prices out of line on their own card.** 48 Hrs.: a bourbon boilermaker (a shot and a beer) at 1.08 next to the beer alone at 2.25, and peanuts and chocolate cake both 1.48 (05). Stripes: the main meatloaf at 0.50 under 1.10 starters (06). Leap Year: Irish lamb stew 29.00 next to beef and stout pie 19.50 (03). Dirty Work's rye highball 1.58 against a gin rickey at 2.75.
- **Year as a number.** Films from 2000 print "Reward $00" and "Bill no. 00" (Shanghai Noon), "Form TK 00" (Screwed).

### 4. Phone experience: 8
Review 5's big phone fault is fixed: at 9 guests the text menu header reads "Every recipe serves 9, scaled from the Prep sheet" and Sal's rissoles list 1.8kg mince, 3 eggs, 2.3kg potatoes (15). Swipe preview, dots and "Swipe to turn, tap to zoom" all work (16). Print sits next to Save PDF at a good size. Marks off: dishes without a tested recipe still give the card's fixed method under the "serves 9" header, so Kerrigan backyard barbie says "Marinate 8 lamb loin chops", "Boil 1kg potatoes", "Cook 8 thick beef sausages" for nine people, and its first numbered step is the dish description, not a step (15). The text menu card scrolls inside itself, so long methods get cut at the bottom edge until you scroll the inner box.

### 5. Core flow: 7
Spin, menu, Prep sheet and diet switches work together now. Flipping Vegetarian on Big Night's Prep sheet swaps the card to the roast stuffed pumpkin and sets "Vegetarian menu" straight away on both sizes. The vegetarian Big Night list is properly done: verjuice and water for the wine, vegetarian parmesan-style cheese, lentil and mushroom ragù in the timpano, vegetable stock across both risottos. Water no longer lands on the list. A cook will still hit these:
- **Counts and words that do not follow the guests.** At 2 guests The Castle buys "1 lemons", "1 brown onions", "1 limes" and "750ml Australian lager (4 stubbies of 375 ml)"; the method lists "1/2 egg" and "1/2 packet round butter crackers" while the list buys 1 packet (12). At 9, the lager is "3.4 L (4 stubbies of 375 ml)". Caddyshack at 9 buys "3 cobs of loaf" and the iced tea step still says "Stir the juice of three lemons" (13); at 2 it is "1 peaches", "1/2 cob loaf", "1/2 garlic clove". Rissoles say "one grated onion ... the other onion" at every count, and Big Night's omelette is still "cut into four" with 18 eggs at 9.
- **Waiting counted as hands-on.** Shanghai Noon's almond jelly reads "Prep 3 hr 9 min, cook 6 min" because "Set in a shallow dish for 3 hours" is not seen as waiting, so the sheet says hands-on 4 hr 12 min at 4 guests and 6 hr 50 min at 9 (14). By script, 215 dishes have a 20 minute or longer wait step counted as prep this way (drain the ricotta for 2 hours, rise until doubled, chill for 4 hours, churn or freeze for 4 hours). The other way round, 171 dishes show "Prep 0 min", like Rudi's chicken paprikash, which starts with browning thighs and slicing onions and capsicum.
- **Odd labels.** Caddyshack's prime rib reads "then 8 hr 20 min to rest": that is the overnight seasoning and the rest added together. Big Night's seafood risotto reads "cook 15 min" when its steps stir at the stove for 16 minutes after 10 minutes of softening and toasting. The poppy seed cake step says "Bake for 50 minutes" with a 1 hr 8 min chip. Ladies in Black's punch step reads "pour in a chilled the bottle of sparkling wine", and "For non-drinkers, use peach nectar" is a timed step.
- **Quantities a chef would question.** Big Night for four puts 350g carnaroli and 400g arborio into the two starters, about 190g raw rice a head before the timpano and a 1.5kg pork belly; a starter risotto is 60 to 80g. Under Siege makes a scratch birthday cake and buys a sponge for the cake bites as well, and lists "100g rouille" as something to buy. Tins scale by weight ("1.3kg tin lychees" at 9) rather than as tins, and grated ginger is bought by the tablespoon.

### 6. Galaxy Video store: 9
Still the most fun part of the site. Walk-in shopfront with "New releases 3 nights $4" in the window (18), the board inside now saying the same, member card that takes focus in the name field, "Click a tape to read the back" on desktop, a hire case with tagline, drop cap, staff tip and tonight's menu (19), and a rental slip with your name, due back Sat 7 Nov at 7pm, $4.00 and change from a $10 note (20). Escape closes the slip and leaves you in the store. Nothing to mark off.

### 7. Polish and craft: 7
No console errors, failed requests or broken images on 156 films. No em or en dashes in anything that rendered. The slips this time: the bar tab print loss, the clipped lines on 48 Hrs., Easter Parade, Small Soldiers and Red Heat, "syrup Alexander", "1 lemons", "3 cobs of loaf", "a chilled the bottle", and the duplicate sourdough. The candy bar (17) reads well; its two photo gaps (Honey Joys, Chocolate malt milkshakes) are the deferred photos, not a fault.

### 8. Accessibility basics: 8
Solid. Every visible button and link has a name and every image has alt text. Skip link first, Enter lands on Spin, Enter spins, focus goes to the "Now showing" heading which announces the film, and the next Tab now goes straight to the Menu and Prep sheet tabs. Small things: "How it works" (20px) and "All options and prices" (19px) are still under the 24px target; the text menu's inner scroll box is easy to miss with a screen reader since the page keeps going below it.

## Fix list, ranked by impact

1. **Make printing match the screen on the bar tab layout.**
   Where: Print and Save PDF on any bar tab film (33), seen on Leap Year and El Mariachi; fillPrint in app.js copies each face into the print area.
   Wrong: the print copy shows dish descriptions the screen hides, so page one overflows and drops four of six dishes while still printing the "Carried over" total, and El Mariachi's heading runs off the top (03, 04).
   Good looks like: the printed page is the same layout as the screen face (or is refitted before printing), and a check that prints one film per layout and compares the dish count on paper with the dish count on screen.

2. **Fix the count words and pack sizes when guests change.**
   Where: shopping list and How to make it at any guest count other than 4; The Castle at 2, Caddyshack at 2 and 9.
   Wrong: "1 lemons", "1 brown onions", "3 cobs of loaf", "1/2 egg", "1/2 packet" in the method against 1 packet on the list, "750ml lager (4 stubbies)" and "3.4 L (4 stubbies)", "juice of three lemons" and "cut into four" at every count (12, 13).
   Good looks like: singular under 1.01 everywhere, "cob loaves", method amounts rounded the same way the list is, pack notes rebuilt from the scaled amount ("2 stubbies", "9 stubbies"), and words for counts in steps ("three lemons", "four tall glasses", "cut into four") scaled or replaced with "the lemons", "each glass".

3. **Count setting, draining and rising as waiting.**
   Where: dishTimes and WAIT_RE in app.js; Shanghai Noon's almond jelly, the ricotta dishes, bread doughs.
   Wrong: "Set in a shallow dish for 3 hours" is read as hands-on, so Shanghai Noon says hands-on 4 hr 12 min (14); 215 dishes like it. 171 dishes show "Prep 0 min".
   Good looks like: set, drain, rise, churn, freeze and "until doubled" count as waiting; prep is never 0 when there is chopping or browning; "to rest" only used for resting, with overnight seasoning shown as "start the day before". Add both to tests/cook-times.test.cjs.

4. **Stop shared layouts clipping lines.**
   Where: precinct case file (48 Hrs. "On file"), candy bar layout last drink above the combo bar (Easter Parade, Small Soldiers), canteen notes (Red Heat), tearoom page two refit (Ladies in Black).
   Wrong: text cut mid-sentence or hidden behind the combo bar or still (05, 09, 10, 11).
   Good looks like: the last line always fits, or the note drops whole, and the tearoom refit runs before the card is shown and before Print or Save PDF.

5. **Fix the kids' alcohol swap so names still read.**
   Where: the DRY lists in menu-formats/*.js (hotel, lab and others).
   Wrong: "syrup Alexander" (07), "root beer battered onion rings", and a brandy milk punch with no brandy in it (08).
   Good looks like: swap whole drink names to a named mocktail ("Brandy Alexander" to "Vanilla nutmeg milk"), leave cooking uses like beer batter to the plain version ("crisp battered onion rings"), and keep names and descriptions agreeing.

6. **Scale or rewrite the card methods on the phone text menu.**
   Where: How to make it for dishes with no tested recipe, seen on The Castle's backyard barbie.
   Wrong: "8 lamb loin chops", "1kg potatoes" under "Every recipe serves 9", and the description shown as step 1 (15).
   Good looks like: these methods say "Serves 4" next to them, or their numbers scale like the rest; the description sits above the steps, not as one.

7. **Bring prices into line on their own card.**
   Where: precinct (48 Hrs., Dirty Work), canteen (Stripes), bar tab (Leap Year).
   Wrong: a boilermaker cheaper than the beer in it, the main cheaper than every starter, a lamb stew 10 dollars over the pie (03, 05, 06).
   Good looks like: drinks with spirits above beer, mains above starters and sweets on every card, the film number still setting only the cents.

8. **Right-size the heavy menus.**
   Where: Big Night (two starter risottos at 750g rice for four), Under Siege (scratch cake plus bought sponge, bought rouille).
   Good looks like: starter risotto at 60 to 80g raw rice a head, one cake per menu, rouille made in the bouillabaisse method from garlic, saffron, yolk and oil, tins bought as tins, ginger as a knob.

9. **Swap the school timetable and duplicate dishes out of the wrong films.**
   Where: canteen layout on Stripes (and any other non-school film on canteen); 48 Hrs.' two sourdoughs.
   Good looks like: the timetable strip reads as a duty roster or mess times for army, prison and police films, and a house line never repeats a dish already on the card.

10. **Small craft and access nits.**
    "00" for 2000 films (use "2000" or "No. 1"). "a chilled the bottle". Non-drinker note as an untimed tip, not a step. Cook time on Big Night's seafood risotto to match its steps. "How it works" and "All options and prices" to 24px tall.

## Genuinely excellent, leave alone

- The marquee and brass wheel, and the spin landing you on the tabs with focus on "Now showing".
- The hand-built menus: Big Night, Fried Green Tomatoes, C.H.U.D.'s Soho map, Chef's chalkboard, plus the ones earlier reviews named.
- The best shared menus from this sample: The Castle, Storm Boy, The Lighthorsemen, Strange Brew, Holiday Inn, The Wog Boy, Shanghai Noon, Time Bandits once settled.
- Diet switches that now redraw everything at once, and the vegetarian Big Night list.
- The phone text menu following the guest count for every tested recipe.
- The new Print button, placed and sized right on both screens.
- Galaxy Video end to end, with prices that agree from window to slip.
- No console errors, failed requests or broken images across 156 films.

## Fixed after the review

- Fix 1, bar tab printing (4 Nov): already fixed by the same day's print change. Print now builds the finished PDF and prints that, so Leap Year prints all six dishes on page one, carried over to page two, then the prep sheet. No browser web address, date or page numbers on any page, even 5mm margins, and the prep sheet prints on light paper.
- Fix 2, count words and packs (4 Nov): one of anything reads singular ("1 lemon", "1 brown onion") while food after a pack word stays plural ("1 packet round butter crackers"); cob loaves pluralise properly; pack notes rebuild from the scaled amount ("750ml lager (2 stubbies of 375 ml)" for 2, "(9 stubbies...)" for 9); eggs, loaves, packs and pinches round up to whole in the method as on the list; counts of lemons, limes, oranges, onions, potatoes, tomatoes, apples, bananas, avocados and cloves written as words in a step now scale ("the juice of seven lemons", "nine tall glasses" at 9). "Cut into four" stays, as it is per piece.
- Fix 3, waiting time (4 Nov): setting, draining, rising, chilling, freezing and "until doubled" count as waiting wherever they sit in a step ("Drain the ricotta for 2 hours", "Strain and chill", "chill 1 hour", "an hour ahead", "Rise again"), so Shanghai Noon's almond jelly is 15 minutes hands-on and 3 hours to set, not 4 hours 12 hands-on. Prep is never shown as 0 (171 dishes fixed). Long braises and roasts stay as cooking. tests/cook-times.test.cjs now fails on Prep 0 or a long wait counted as hands-on.
