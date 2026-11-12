# Review 26: re-grade of the ten new layouts, three fix rounds (12 Nov 2026)

Independent reviewers per layout each round (fresh agents, no sight of earlier reviews), one fixer per layout in its own worktree, merged by replaying card-ops files. Round 1 reports with fix logs, then round 2, round 3 and the final six.

---

# review26

## Arcade layout review: Snatch (2000)
**Score: 6.0 out of 10**

The arcade look suits Snatch better than most films could, because Turkish really does run a slot machine shop (Wikipedia: "Unlicensed boxing promoter and slot machine shop owner Turkish"), so "Turkish and Tommy's Arcade" is true to the film and a fan will clock it straight away. The marquee, cabinet bezel, poster, ticket prices, high score table and the ring still all read like a real prize counter, and the Save PDF matches the screen with no grey boxes, black blocks or clipped words. But it is not ready for paying guests. Not one dish note prints on the menu, so guests get a list of names with no idea what "Diamond cut cheese" or "Caravan site sausages" actually is. The Bet Slip prop never prints, the starters are priced cheapest at the top, and the Prep sheet leaves out two of the dishes on the card. The Turkish note also borrows lines that belong to other characters.

## Findings

1. **No dish notes on the printed menu at all (screen and PDF).** [layout] Every dish shows a name and a ticket price, nothing else. That breaks rules 1 and 2. Cause: `fit()` in menu-formats/arcade.js line 102 works down `TIERS` (line 92) and only falls to the `nl:0` tiers (no notes) when nothing else fits. Here it does: nine items (four starters, two mains, a sweet, two drinks) can't fit in two columns of a 410px board (`BHd`, line 187) with notes on. Note that `nl:1` and `nl:2` behave the same, since line 99 and line 108 only check `tr.nl` is truthy, so the "one line" tiers buy nothing. The default still (line 204) then takes about 125px of the right column, and the left column has about 80px spare under the mains, so there was room the notes could have used. Fix: before any `nl:0` tier, drop card extras (items with `extra`, here East End pie and Avi's strip) one at a time and run the fit again. With both gone the board fits at the 16px notes-on tier (my estimate: right column about 385px against 410). Only fall back to the still once the notes are printing. This also fixes finding 4.

2. **Bet Slip prop is missing (screen and PDF).** [layout] film-flavour.json has `prop {kind:"slip", title:"Bet Slip", lines:["Fight: Mickey, round four","Odds: not good"]}`, but nothing on the card shows it. That breaks rule 5. Cause: arcade.js line 81 builds `F.prop`, but nothing in the file ever reads it. Fix: when `F.prop` exists, use the TOKENS box (lines 217 to 219, four plain numbered coins with nothing film-specific on them) as a slip. Put the label from prop.kind ("BET SLIP") at the top with the prop lines under it in the mono face.

3. **Starters priced cheapest first (screen, PDF).** [layout] Quick Plays reads 110, 140, 170, then the house eels at 100. So the dearest starter, the East End pie, sits at the bottom of the paid dishes. That breaks rule 8. Cause: `prices()` line 66 sets `v=BASE*mult*(1+i*.15)`, so the price climbs as you go down the list. Line 179 converts to tickets, and neither line 179 nor priceSense in app.js (line 25 onward) sorts the course. Fix: after line 185, sort each course's non-house prices from highest to lowest and keep the house line last, or use `(1+(n-1-i)*.15)` with n set to the number of non-house items. Mains (220, 190) and Refills (140, 80) are already right.

4. **Prep sheet is missing two printed dishes (PDF p-2).** [film] The sheet says "5 dishes" and covers cheese, sausages, fry-up, banoffee and the whiskey ginger. East End pie and Avi's New York strip are on the card but have no Prep entry and nothing on the shopping list. They only appear on the phone as "As written, serves 4". Cause: data/recipes/snatch-2000.json has no entries for them, even though films.json S[0] and M[1] hold full methods and shopping lists. Fix: add both to the recipes file from films.json, or (better, with finding 1) keep card extras off the printed card so the card and the Prep sheet line up.

5. **The Turkish note borrows other characters' lines (bezel, screen and PDF).** [film] "No more bets, boys. The dog ate the squeaky toy and the diamond, and I need a cup of tea." The dog part is true: Turkish's closing narration has the vet finding "a squeaky toy, an undigested shoe, and an eighty-six carat diamond". But Turkish never takes bets ("All bets are off" is the female bookie's line), and the cup of tea is Brick Top's ("Get us a cup of tea, will you, Errol?", Wikiquote). Rule 9 says a kind "note" line has to be true to the plot, and this pins two other characters' habits on Turkish. It's also printed in italics with his name tacked on, so it reads as a quote even though the quote marks are stripped (app.js `libNoteKind`, line 1542). data/film-flavour.json "Snatch (2000)" note.text, same length (89 characters): `Tommy kept the dog. The vet found a squeaky toy, a shoe and the diamond. Still squeaking.`

6. **High score initials read "TAA" (screen and PDF).** [layout] arcade.js line 220 takes the first letter of each word in note.by and pads it with "AAA", so a one-word name like "Turkish" comes out as TAA, which looks random. Fix: when note.by is one word, use its first three letters (`TUR`). Better still, add an optional `arcade.scores` list in film-flavour so a film can carry its own (for example BRK, TOM, YOU).

7. **Fry-up priced above sirloin steak (screen, PDF).** [layout] Turkish's full English is 220 TIX and Avi's New York strip is 190. A guest will find a fry-up costing more than a steak odd. Cause: priceSense in app.js (the block starting "a card extra never prices above the mains that are cooked tonight") pushes the extra below the cooked main. Fix: this goes away if card extras stay off the card (finding 1). If they stay, let a premium extra sit at the top of the course.

8. **Hard-edged lighter box behind the marquee title (screen only).** [layout] On screen, a visible rectangle sits behind "Turkish and Tommy's Arcade". The PDF is clean. Cause: arcade.js line 156 gives the venue div `overflow:hidden` along with a glow up to 28px (`glow(neon,14)`), so the glow gets cut off at the edge of the box. Fix: drop `overflow:hidden` and fit the text by font size alone, or add padding of about 30px inside the clipped box and a matching negative margin.

9. **Jokes in the recipe methods (Prep sheet and phone).** [film] The cheese method ends "Don't swallow any of the diamonds." and the sausages end "Do you like dags?" The real line is Mickey's "D'ya like dags?". Putting it on a sausage recipe suggests dog sausages, which some guests won't like. data/recipes/snatch-2000.json, sausages "how": replace `Spear on toothpicks and serve hot. Do you like dags?` with `Spear on toothpicks and serve hot with extra mustard.` The cheese joke is harmless and can stay.

10. **About 80px bare under Main Games in the left column (screen, PDF).** [layout] That's under the 100px trigger in rule 3, but it's visible next to the still opposite. Cause: line 196 and line 207 only spread spare height in the shorter column, and here the left column is the taller one but still ends short of the board. Fix: once notes print (finding 1) this space fills itself. Otherwise, let the taller column spread its own remainder under the same cap.

Checked and fine: venue (Turkish's slot machine shop), the five winks (Franky Four-Fingers, Brick Top and his pigs, Bullet Tooth Tony and the squeaky toy dog all confirmed on Wikipedia and Wikiquote), the cue (Wikipedia: "The dog subsequently swallows the diamond for real and runs away out a window"), no logo on a box (the marquee prints "SNATCH, 2000" because the poster already carries the logo), neutral fixed headings, house lines at the foot of their courses, dessert priced under the mains, and no repeated prices within a course.

## What I could not check

- **The diamond's carat weight.** "The 86 carat diamond" wink and flavour number 86: the sources disagree. Wikipedia's plot says 84 carat. Wikiquote's intro and Turkish's closing narration say eighty-six. A Wikipedia talk page comment says it's 86 for the whole film, with 84 only in the final narration. I can't settle it without the film, so I've left the wink alone.
- **The prop line "Fight: Mickey, round four".** Wikipedia only says Brick Top demands Mickey throw the fight, and Wikiquote doesn't name the round, so this is unconfirmed. It doesn't print anyway (finding 2).
- **The sign "Turkish and Tommy, Fair Fights".** It's made up but plausible for an unlicensed boxing promoter. Given Brick Top fixes the fights, it reads as irony. No source to check against.
- I didn't watch the film for timing, so I can't say how long guests wait between starters and the mains cue.

### Fix log
Branch fix26/arcade, commit a7592691. Renders before: /tmp/fix26-arcade-before, after: /tmp/fix26-arcade.
1. Notes now print on every film. arcade.js: if the fit only works with notes off, card extras come off one at a time (drinks, sweets, mains, then starters, last dish first, never a course's only dish) and the fit runs again. Snatch now prints every note at a notes-on tier.
2. Bet Slip prints. The tokens box now holds the film's prop as a paper slip under a label taken from prop.kind (or the title when it already names the object: BET SLIP, MEDAL RECEIPT, PIZZA PLANET TOKEN; Dazed shows TICKET over MOON TOWER PARTY). Lines are in Share Tech Mono, with a row of three small tokens under it when there's room (Toy Story keeps its planet coins). Snatch prop line "Fight: Mickey, round four" changed to "Fight: Mickey, fixed to lose", because the round could not be confirmed and Wikipedia confirms the fixed fight.
3. Dearest dish first. After the ticket prices are set, each course is reordered by price, high to low, with house lines last. The dishes move with their own prices, so priceSense's rule that an extra stays under the cooked main still holds. This fixed starters on all four films (Toy Story 170/140/120/110, Ralph 180/150/140/130, Dazed 220/150/140/130, Snatch 140/110/100).
4. Card and Prep sheet now match on Snatch. New flavour switch arcade.extras:false keeps card extras off the board, set for Snatch, so East End pie and Avi's strip are gone and the board lists the same five dishes as the Prep sheet plus the two house lines. Recipes not added, since planFive would leave a sixth dish off anyway.
5. Snatch note replaced with "Tommy kept the dog. The vet found a squeaky toy, a shoe and the diamond. Still squeaking." by Turkish, kind note. Checked against Turkish's closing narration on Wikiquote ("Tommy persuaded me to keep the dog... The vet found a squeaky toy, an undigested shoe, and an eighty-six carat diamond... Still didn't shut it up").
6. High score initials: three or more words give initials, otherwise the first three letters of the last word (Snatch TUR, Ralph RAL, Dazed WOO). Added an optional arcade.scores ["AAA","BBB","CCC"] so a film can name its own players.
7. Fry-up above the steak is gone, because Avi's strip is off the Snatch card (item 4). On other films an extra can still price under the cooked main, and the reorder in item 3 keeps the dearest dish at the top either way.
8. Marquee glow: the venue div keeps overflow:hidden, now with 30px padding and a matching -30px margin, so the 28px glow is no longer clipped into a box. Layout position is unchanged.
9. Sausage method now ends "Spear on toothpicks and serve hot with extra mustard." in data/recipes/snatch-2000.json (by hand) and data/recipes2/snatch-2000.json (ops). The cheese joke stays, as the review allows.
10. Left column gap: fills itself now that notes print. The bare space under any column on Snatch is about 50px at most.
11. Extra, rule 1 on Dazed and Confused (same layout): four notes were film lines, not food. Replaced through ops: Moon tower chips "Thick-cut potato chips with a cold onion and chive dip", beer nuts "...roasted with spiced butter, chilli and brown sugar", Frito pie (house) "Corn chips under beef and bean chilli, melted cheddar and onion", Lone Star (house) "Texas lager served ice cold from the bucket".
12. Extra: the dash characters in arcade.js's clean() regex are now written as  to ,  escapes, so the file has no literal dashes.

Shared code items for the lead
- Every arcade film (and the app generally) prints one card-extra starter and one card-extra main that the Prep sheet never covers (Toy Story garlic knots and toastie, Ralph nachos and pot pie, Dazed beer nuts and brisket). Only Snatch has them switched off here. If the Prep sheet should match the card, either the Prep sheet lists extras with their films.json method and shopping, or layouts drop extras across the board. That's an app.js call (planFive/planCard), beyond the five-dish cap.
- fit() in arcade.js treats nl:1 and nl:2 tiers the same (only checks tr.nl is truthy). Harmless, left alone.

Owner decisions
- None needed. The arcade.extras:false switch on Snatch is reversible in film-flavour if Josh wants the pie and steak back (notes still print, because the auto-drop would remove only the steak).

Checks
- check-print-text on Toy Story, Wreck-It Ralph, Dazed and Confused and Snatch: PASS, no dish name or note hidden and no html2canvas-dropped shapes.
- npm test: exit 0, no failures.
- Toy Story before and after: the same apart from the Launch Pad order (now dearest first) and the tokens box, which now shows the Pizza Planet Token slip over three planet coins. Still looks right.

## Bowling layout review: Kingpin (1996)
**Score: 7.8 out of 10**

The card itself is good. It reads like a real score sheet: frame strip 1 to 10, the course names pencilled in the Bowler column, prices in the little ball boxes, a pencilled lane number, a TOTAL box with 300 in it, and the poster and $1 million tournament ticket on the left. The Save PDF matches the screen with no grey boxes, black blocks, lost borders or clipped words. Every note prints in full at one size, there are no big gaps, and the venue, cue and quote all check out (the final really was shot at the National Bowling Stadium, and "I took the liberty of milking your cow for you" is Roy's real line). "Gravy train pot roast" nods to Big Ern's "gravy train with biscuit wheels", and fans will grin at that. What keeps it under 9 is the Prep sheet: the card prints six dishes, but the Prep sheet and shopping list only cover five. Gravy train pot roast, one of the two mains, has no method and nothing on the list. A host who cooks from this sheet will find a printed main they never shopped for. Smaller points: the winks run together with nothing between them, the lane number is 96 in a 78-lane stadium, and one wink is filler.

## Findings

1. **Printed main missing from the Prep sheet and shopping list.** [film]
   Where: PDF pages 2 and 3 say "5 DISHES" and give methods for chilli cheese fries, pretzels, Amish chicken and noodles, shoofly pie and malt milkshake. The printed menu (PDF page 1, screen) also sells Gravy train pot roast at 5.50. The shopping list has no beef chuck, tomato paste, beef stock, thyme or cornflour. The phone menu does carry the pot roast recipe, so phone and Prep sheet disagree.
   Cause: data/film/kingpin-1996.json r2 (and data/recipes2/kingpin-1996.json) has six tested dishes. app.js line 1142 runs `planFive` once r2 has more than five dishes, and line 1161 (`planOn`) leaves the leftover "spare" dish unticked, so the Prep sheet cooks five. The card still prints all six because it builds from the full menu (fullMenu, app.js 1763).
   Fix (pick one): (a) in app.js line 1142, keep every r2 dish the printed card shows as a cooked dish, not a spare, so the Prep sheet covers whatever the card prints. (b) For this film only, drop Gravy train pot roast from the printed board so the card and Prep sheet both show five. (a) is better. The pot roast is the better fan dish, and the recipe is already written and tested (20 min prep, 3 hours in the oven, 2-day make-ahead note).

2. **Winks run together with no separator.** [layout]
   Where: "Watch for" row on screen and PDF. It reads "Roy's rubber hand   Big Ern's comb-over / Ishmael's coffee: extra large, lots of cream / Claudia on the road trip   Getting Munsoned". The only break between winks is a 22px gap, and one wink has its own colon and comma inside it, so the eye can't tell where one wink ends ("Claudia on the road trip Getting Munsoned" reads as one phrase).
   Cause: menu-formats/bowling.js line 198, `margin-right:22px` spans joined with a space.
   Fix: put a pencilled divider between winks, for example join with `<span style="color:${acc};margin:0 10px">/</span>` or a tick-box mark before each one, the way a scorer jots notes.

3. **Weak wink.** [film]
   Where: "Claudia on the road trip" (data/film-flavour.json, "Kingpin (1996)" winks[3]). It just describes the plot, so no fan will grin at it.
   Fix, near the same length: "The 1979 Odor-Eaters final" (Wikiquote has McCracken calling Roy's roll for "the 1979 Odor-Eaters Champion").

4. **Lane 96 does not exist at the venue.** [film]
   Where: LANE box in the header, screen and PDF. The National Bowling Stadium has 78 lanes (Wikipedia, National Bowling Stadium). A bowler will notice.
   Cause: data/film-flavour.json "Kingpin (1996)" has `"number": ""`, so bowling.js line 74 (film()) falls back to the year's last two digits.
   Fix: set `"number": "17"` (or any lane from 1 to 78). Note that this also changes the TOTAL box from 300 to 217 (bowling.js line 210 prints 200 plus the number), so if you'd rather keep the perfect game, change line 210 to print 300 whatever the lane number is.

5. **No dear-dish price pass in this layout (latent, not visible on Kingpin).** [layout]
   Where: menu-formats/bowling.js lines 63 to 68 (`prices`). Prices go up with list position and then only go through the shared priceSense. Unlike deli.js lines 69 to 83, hospital.js, drivein.js and skilodge.js, it has no step that gives the dearer dish (steak, lobster, prawns) the top price in its course and stops two dishes in a course sharing a price. On Kingpin it comes out fine (pot roast 5.50 over chicken 4.95, snacks 2.50 and 2.95, pie 2.50 under the mains, shake 1.50). A film that lists steak first and a salad second would print the steak cheaper.
   Fix: copy the review 25 DEAR pass from deli.js lines 69 to 83 into bowling.js `prices`.

6. **"Grill" heading over two braises.** [layout] (minor)
   Where: the second course row label reads "Grill" over chicken and noodles and pot roast, neither of which is grilled. It is a stock snack bar word, so most guests won't care.
   Cause: bowling.js line 123, era band 2 cols `["Snacks","Grill","Sweets","Drinks"]`.
   Fix: use "Hot Plates" (already used for band 0) for band 2 as well, or let flavour.words override the column labels.

7. **Chilli cheese fries note is thin.** [film] (minor)
   Where: "Chips under chilli and cheddar". It is accurate but leaves out the sour cream, jalapeños and spring onion that are in the recipe, and the frame has spare room.
   Fix (data/recipes/kingpin-1996.json s[0].note): "Chips under beef chilli, cheddar and jalapeños".

## What I could not check
- The exact phrase "Getting Munsoned". Wikipedia says Roy's surname "has become synonymous with failure", but I could not find the spoken line word for word on Wikiquote, so it is unsure, though very likely fine.
- "Big Ern's comb-over": confirmed only by a secondary article (GamesRadar, "Somewhere between a comb-over and an overgrown mess"), not by Wikipedia or IMDb.
- The sign "Snack bar open all tournament" is invented. It fits the film's world, but no source says so either way.
- I did not open the on-screen app live or test the planner tick box. The finding about the Prep sheet comes from the proofs and the code in app.js.
- The PDF has image pages only, so I could not compare the PDF text to the screen text. I compared them by eye.

### Fix log
1. Prep sheet missing Gravy train pot roast: not fixed, out of scope per the fixer brief (planFive/planAll in app.js cooks five dishes only). Left for the lead, see below. The pot roast recipe in recipes2 is complete, so the fix is app.js only.
2. Winks run together: bowling.js now puts a pencilled accent "/" (the spare mark) after every wink but the last, inside each wink's nowrap span, so lines end on a divider and never start with one. Wink row height estimate updated to match.
3. Weak wink: "Claudia on the road trip" replaced with "The 1979 Odor-Eaters final" (Wikiquote: McCracken, "he's the 1979 Odor-Eaters Champion"). Via audit/ops/kingpin-1996-review-26.json.
4. Lane 96: flavour.number set to "17" (in range 1 to 78, and a nod to "Seventeen years later" in the Wikipedia plot). bowling.js TOTAL box now always prints 300. Side effect: the hidden-number sweet price moves, pie now 2.25, still under the mains, no repeats.
5. No dear-dish price pass: copied the review 25 DEAR pass from deli.js into bowling.js prices (dear dishes take the top prices of their course, no shared price in a course).
6. "Grill" over braises: bands 1 and 2 now use "Hot Plates". bowling.js also reads film-flavour "labels" {s,m,w,d} to override course labels where a film sets them (same shape campfire uses).
7. Thin fries note: now "Chips under beef chilli, cheddar and jalapeños" (card, recipes, phone all updated via ops).

Not changed: "Big Ern's comb-over" and "Getting Munsoned" kept (Wikipedia supports Munson as a byword for failure; no source found against either, and the brief bars changing facts from memory).

Shared code items for the lead
- app.js planFive (about line 1142) and planOn (about line 1161): when r2 has more than five dishes the Prep sheet leaves one unticked as a spare, but the printed card (fullMenu, about line 1763) prints all of them. For Kingpin the Prep sheet drops Gravy train pot roast, a printed main. Fix: treat every dish the printed card shows as cooked, or have the card print only the planned five. This is the one item still holding the card under 9.

Owner decisions
- None needed. If the lead will not change app.js, the fallback is dropping the pot roast from Kingpin's printed board (owner call, as it is the better fan dish).

Checks
- check-print-text "Kingpin (1996)": PASS (no dish name or note hidden, no html2canvas-dropped shapes).
- npm test: exit 0, 23 PASS lines, no failures.
- Rendered and viewed /tmp/fix26-bowling/kingpin-1996-p-1.png (Kingpin is the only film on bowling).

## Clubhouse layout review: Happy Gilmore (1996)
**Score: 6.6 out of 10**

The scorecard idea is a good fit for this film and the card looks tidy. Hole, Dish and Par columns, a pencil ring on one price and a signed Marker's Note all read like a golf card, every note prints in full at one size, there are no empty gaps, and the printed PDF matches the screen with no grey boxes or clipped words. It still breaks two locked rules. Prices climb down each course, so the dearest dish sits at the bottom instead of the top (rule 8), and the film's prop (the Tour Qualifier badge) never prints (rule 5). The Prep sheet leaves out two of the seven cooked dishes on the card. A golfer will spot hole 7 filed under "Back Nine", the cover is cinema black rather than club colours, and one wink gets the gold jacket wrong while another just repeats the gator. Fans will grin at "It's all in the hips" and the Bob Barker wink, but it is not ready for paying guests.

## Findings

1. **Prices run cheapest at the top in every course (rule 8).** PDF and screen: Front Nine reads 2.95, 3.50, 3.95, then the house muffins at 4.50. The Turn reads Grandma's meatloaf 4.95 above the sponsor's footlong 5.95. [layout] Cause: menu-formats/clubhouse.js lines 137 to 139. `vals` is sorted low to high and handed out in card order (after `dearOf`, which ties here because "chuck" in the sliders and "chicken" vs "beef and pork" give no gap), so the top row always gets the lowest price. Fix: hand out `vals` high to low (`vals.sort((a,b)=>b-a)`) and sort `order` by `dearOf` descending, so the dearest dish takes the top price and prices fall down the course. Also add `chuck|mince|burger|patt` to the tier 1 regex on line 129 so the sliders rank as beef.

2. **The prop does not print (rule 5).** The film has prop kind "badge", title "Tour Qualifier", lines "Happy Gilmore" and "Slap shot approved". Nothing on screen, PDF or phone shows it. [layout] Cause: clubhouse.js line 78 builds `F.prop` (and drops `kind`), but nothing between lines 160 and 237 uses it. Fix: keep `kind` in `film()`, then print it as a bag tag on the cover between the poster and the venue, or as a strip at the top of the Marker's Note box: label "Badge" (from prop.kind) over "Tour Qualifier", then "Happy Gilmore · Slap shot approved" (use a comma, not a dot, if the font lacks it).

3. **Prep sheet misses two printed dishes.** PDF pages 2 and 3 say "5 DISHES": cheese balls, biscuits, meatloaf, lemon bars, shandy. The card also prints Slap shot cheeseburger sliders and Sponsor's sweet onion chicken footlong, and neither has a recipe or shopping on the Prep sheet. The phone text has both. [film] (app-wide cause) app.js lines 1140 to 1142: `planAll` trims the recipes2 dishes to "tonight's five" and the footlong is the one dropped; the sliders are not in data/recipes2/happy-gilmore-1996.json at all. Fix: add a sliders entry to recipes2 (the method in films.json already has full quantities), and either print every cooked card dish on the Prep sheet or have the card print only the five that get cooked. The two house lines (muffins, chocolate milk) also have no Prep entry, which is fine if that is the house rule, but the phone says "A house standard, not part of tonight's cook" and the Prep sheet says nothing.

4. **Hole numbers break golf logic.** Screen and PDF: holes 1 to 4 sit under Front Nine, 5 and 6 under The Turn, hole 7 under Back Nine, 8 and 9 under 19th Hole. The back nine is holes 10 to 18 and the 19th hole is the bar, so any golfer will notice hole 7 on the back nine and holes 8 and 9 at the bar. [layout] Cause: clubhouse.js lines 205 to 207, one running `hole++` across every course. Fix: number Front Nine from 1, The Turn rows as 9 and 10, Back Nine from 10 upward (or 11 when The Turn used 10), and mark every 19th Hole row "19".

5. **Wink 4 gets the gold jacket wrong.** "Shooter McGavin's gold jacket": the gold jacket goes to the Tour Championship winner. Happy wins it and Shooter steals it and runs ("He stole my jacket!"), per Wikipedia's plot and Wikiquote. It was never Shooter's. [film] data/film-flavour.json and data/film/happy-gilmore-1996.json (lib.flavour.winks[3]). Replace with: "Shooter nicks the gold jacket" (29 characters, same as now).

6. **Winks 2 and 3 repeat the same gator.** "Chubbs and the gator that took his hand" then "The alligator on the course". Both are true (Wikipedia: Chubbs lost a hand to an alligator, Happy later runs into it at a tournament), but it spends one of only five local rules on the same joke. [film] same files, winks[2]. Replace with: "The tower on the last green" (27 characters, same as now; the TV tower Happy putts through on the final hole).

7. **Sign repeats the venue.** Cover reads "Tour Championship Grill" over "Tour Championship Clubhouse". It is true to the film (the Tour Championship is the final event) but the second line adds nothing. [film] film-flavour.json and film/happy-gilmore-1996.json, sign. Replace with: "Winner gets the gold jacket" (27 characters, same as now; Chubbs: "Get that gold jacket that I never got").

8. **Cover is black, not club colours.** Screen and PDF: the whole left panel is black with gold rules, which reads as a cinema poster frame, not a golf club card. [layout] Cause: clubhouse.js line 155 takes `F.pal.dark` (#000000 for this film) whenever it is darker than 0.08 luminance. Fix: only use the film's dark when it has some colour in it (for example a channel spread over 20), otherwise keep the era's club green `e.club` (#173b33 for the 90s).

9. **Prices feel off for the era and the item.** A pitcher of lemon shandy at 3.50 costs the same as one biscuit plate, and a 1996 tour clubhouse meatloaf at 4.95 is cheap. [layout] Cause: clubhouse.js line 135, drinks multiplier .3 applied to a whole pitcher. Fix: lift the drinks multiplier to about .5 when the drink name says "pitcher" or "jug", and lift mains to about 1.6 for the 1990s band. Minor.

10. **Scorecard detail is thin.** It reads as a menu in a table more than a real scorecard: no yardage or handicap column, no Out/In totals, no Player and Marker signature pair (only the Marker). [layout] Fix: add a slim "Yds" column fed by the price (for example price x 100, so the joke carries), and an "Out" row at the foot of each column showing the hole count. Optional.

11. **Shopping doubles up on lemons.** Lemon bars list both 150ml lemon juice and 4 lemons, and the shopping list ends up with 8 lemons plus 150ml juice. Four lemons give roughly that much juice. [film] data/recipes2/happy-gilmore-1996.json, lemon bars ingredients. Fix: drop the bottled juice and say "juice and zest of 4 lemons". Minor.

Checked and fine: every dish note describes the food (rule 1), all notes print whole at one size (rule 2), no gap over about 100px (rule 3), the poster carries the logo so the cover prints title and year in club type (rule 4), headings are neutral (rule 6), five winks in a labelled Local Rules box (rule 7), dessert 2.50 sits under the cheapest main and house lines sit at the foot (rule 8, apart from finding 1), the quote "It's all in the hips." is Chubbs's real line (moviemistakes.com quotes page; not on Wikiquote), "Sponsor's" footlong matches Happy's Subway deal (Wikipedia), Bob Barker and the slap shot winks match the plot.

## What I could not check
- The showtime cue "when Happy goes looking for his happy place on the green": the happy place is real and comes from Chubbs (Golf Monthly), but I could not confirm that he goes there on a putting green rather than somewhere else on the course. Unsure.
- The phone text file is flattened with no line breaks, so I could not judge its on-phone layout, only its content. Cook times from the method (12 minutes, 20 minutes, an hour) are missing from the phone steps; they may live in timers I could not see.
- I did not render a second film in this layout, so I cannot say how it copes with a long title, a film with no poster, or a full four-item course.

### Fix log
1. Prices: rows in each course now sort dearest first (tier from `dearOf`, a pitcher or jug above glasses, film order on a tie, house lines last) and prices are handed out high to low with no repeats, walking up from the foot. Added `chuck|mince|burger|patt` to tier 1. Desserts that land above the cheapest main scale down together and still fall. HG now: 3.95, 3.50, 2.95, house 4.50 / 7.50, 6.50 / 2.50 / 5.95, house 1.95.
2. Prop: `film()` keeps `prop.kind`; the cover prints a gilt bag tag between poster and venue: "Badge" label, "Tour Qualifier", then "Happy Gilmore · Slap shot approved" (lines joined with a middle dot, wraps to two lines when long). Poster shrinks to make room. Shows on all three films.
3. Prep sheet: added "Slap shot cheeseburger sliders" to data/recipes2/happy-gilmore-1996.json (quantities from films.json method). It is offered unticked on the Prep sheet; the five-dish cook (planFive/planAll) is out of scope, so the sliders and footlong still sit outside tonight's five.
4. Hole numbers: Front Nine 1 up, The Turn 9 up, Back Nine 10 up (11 when The Turn used 10), every 19th Hole row prints 19.
5. Wink 4 now "Shooter nicks the gold jacket" (Wikipedia plot, Wikiquote "He stole my jacket!").
6. Wink 3 now "The tower on the last green" (Wikipedia: the TV tower falls onto the green and Happy putts through it).
7. Sign now "Winner gets the gold jacket" (Wikiquote, Chubbs: "Get that gold jacket that I never got").
8. Cover: the film's dark is used only when it has a channel spread over 20; black or grey falls back to the era's club green. All three films now print club green.
9. Prices: a pitcher or jug drink prices at 5/3 of the glass rate (about .5 of a main); 1990s mains multiplier lifted to 1.6. HG shandy pitcher 5.95, meatloaf 7.50.
10. Scorecard: slim Yds column (price x 100) and an Out / In (or Tot) line under each card column with holes played and total yards. When a card is too full the Out line drops first, then Yds, so nothing overflows (Caddyshack keeps Yds, drops the Out line). Fit estimate also runs on 95% of the dish width so narrow two column cards never clip.
11. Lemon bars: dropped the 150ml bottled lemon juice, now "4 lemons, juiced and zested" with the step saying juice and zest of the 4 lemons.
Also: the unconfirmed cue "happy place on the green" replaced with "Serve the beer when Happy starts hustling golfers at the driving range." (Wikipedia plot).

Shared code items for the lead
- planAll/planFive still cook five dishes only, so HG's sliders and footlong (and Caddyshack's chilli dogs and surf and turf, Goldfinger's prawn toasts and fried chicken, which have no recipes2 entry at all) are not on the Prep sheet cook. Out of scope per brief.
- Goldfinger's hidden number (007) in the dessert price is lost upstream (priceSense gives 1.25), so the pencil ring sits on a plain price. Harmless, but the egg no longer shows.
- build-data rewrote films.js, index.html (films.js cache key) and sw.js (VERSION); committed as generated output.

Owner decisions
- None.

Checks
- node scripts/check-print-text.cjs "Happy Gilmore (1996)" "Caddyshack (1980)" "Goldfinger (1964)": PASS
- npm test: pass (exit 0)

## Deli layout review: Rumble in the Bronx (1995)
**Score: 7.6 out of 10**

The deli board is a very good match for this film. A Bronx supermarket with a deli counter is exactly where a "now serving" sign, a take-a-number ticket and a till receipt belong, and "95" on the sign with "96" on the ticket is a neat nod to the year. The poster fills the left side with no gap and no second logo. The felt board reads cleanly, every dish note prints in full at one size, the five winks sit in a labelled box, and the receipt prop sits under its own label. The PDF page is clean: no grey boxes, no black blocks, borders intact, nothing clipped. What keeps it under 9 is one locked rule break and a handful of things a guest would notice. The lobster noodles carry the top price in Hot Plates but print second, under the pork (rule 8). The header says Uncle Bill's Supermarket while a starter calls it Elaine's. One receipt line ("one very tall visitor") is a joke with nothing in the film behind it. The note is signed by "The Counter", which is not a person. The cue serves mains very late. And two of the seven dishes on the board (the bao and the lobster noodles) have no recipe on the Prep sheet.

## Findings

1. **Dear dish prints under a plainer one (locked rule 8).** PDF page 1, Hot Plates: Hovercraft sweet and sour pork 4.50 sits on top, Ginger and spring onion lobster noodles 4.95 sits under it. [layout] The lobster dish is an extra that `fullMenu` adds after tonight's five (app.js lines 1763 to 1784, appended at line 1782), so it arrives last in the course. deli.js `prices()` (lines 69 to 83) hands the dear dish the top price but never moves it, and `itemsOf` (line 130) keeps the incoming order. Fix: in deli.js, after `itemsOf(ctx)` at line 225, move DEAR dishes (not house lines) to the front of each course before pricing, for example `for(const k of ["s","m","w","d"]){const a=items[k];items[k]=[...a.filter(it=>!it.house&&DEAR.test(it.n||"")),...a.filter(it=>it.house||!DEAR.test(it.n||""))]}` (lift `DEAR` out of `prices()` to file scope so both can use it). With that, prices() puts the 4.95 on the top line.

2. **Two printed dishes have no Prep sheet recipe.** PDF pages 2 and 3 cook five dishes. Danny's chicken and shiitake bao (3.50) and the lobster noodles (4.95) are on the board with prices but are not on the Prep sheet or in the shopping list (no lobster, egg noodles or Shaoxing). The phone menu does give recipes for both, so the phone and the Prep sheet disagree. The phone also prints the lobster recipe as "As written, serves 4" followed by the description repeated as the first step. [film / app] By design the Prep sheet cooks only the five in data/recipes/rumble-in-the-bronx-1995.json (app.js comment at lines 1759 to 1761). The house lines get "A house standard, not part of tonight's cook" on the phone; the two film extras get no such label anywhere. Fix: either add the bao and lobster noodles to the recipe file so the Prep sheet covers every priced dish, or have deli print film extras the way it treats house lines and have the phone say "Not part of tonight's cook" for them too. A host who reads "lobster" on the board will look for it on the Prep sheet.

3. **Venue contradicts the menu.** PDF page 1 header: "UNCLE BILL'S SUPERMARKET". First starter: "Elaine's supermarket Reuben bites". Wikipedia's plot says Bill has sold the supermarket to Elaine at the very start, and the rest of the film calls it Elaine's store (winks also say "Elaine taking over the store"). [film] data/film-flavour.json line 18053. Fix: `"venue": "Elaine's Supermarket"`. If you want to keep Bill in it, the receipt line "Total: ask Uncle Bill" already does that job, but that line could become "Total: ask Elaine" to match (Bill is off on his honeymoon for most of the film).

4. **Receipt joke with nothing behind it.** PDF page 1 receipt: "Cereal, rice, one very tall visitor". Keung is not shown as tall and the film makes no point of it; a fan will not get it. [film] data/film-flavour.json line 18071. Fix (same length, ties to the wedding held at the store): `"Cereal, rice, one wedding cake order"`.

5. **Note signed by a thing, not a person (rule 9 kind "note").** Receipt: "Ask about the wedding tea. Bikes stay out of the aisles." signed "The Counter". A kind "note" should be in a character's voice. The line itself fits Elaine: she runs the store the bikers trash. [film] data/film-flavour.json line 18057. Fix: `"by": "Elaine"`. I could not confirm the gang ride bikes inside the store; Wikipedia only says they "trash Elaine's supermarket", so if you want a line that is certainly true: `"Ask about the wedding tea. No bikers past the counter."` is safe either way.

6. **Cue lands very late for mains.** PDF page 1 and Prep sheet: "Serve the mains when White Tiger's men hijack the hovercraft." True to the plot (Wikipedia: "White Tiger's men hijack a hovercraft"), but it is the last act, so mains would hit the table with ten minutes or so left. [film] data/films.json, Rumble entry, field P. Fix (similar length, mid film, confirmed in Wikipedia): `"Serve the mains when the bikers trash Elaine's supermarket."`

7. **Wink wording slightly off.** "Keung's hovercraft on the golf course". The hovercraft belongs to nobody in particular; White Tiger's men hijack it and Keung later drives the repaired one onto the golf course to run White Tiger down. Close enough that most fans will read it as intended. [film] data/film-flavour.json line 18061. Fix: `"Keung's hovercraft hits the golf course"` or `"Hovercraft run-down on the golf course"`.

8. **Prices read too cheap for lobster.** PDF page 1: lobster noodles at 4.95, the whole board running 1.50 to 4.95. For a 1995 New York counter that is fine for tea and dumplings but a guest will smirk at lobster for under five dollars. [layout] deli.js line 49, `BASE` gives 4.5 for the 1990s and the mains multiplier is 1 (line 65). Fix: give deli its own main multiplier (for example `m:1.6`) or a premium bump for DEAR dishes in `prices()` so a lobster dish lands nearer 7.95 to 9.95.

9. **Small spare space, under the limit.** PDF page 1: about 75 board pixels of empty board between the last drink and the Showtime line, and about 65 inside the receipt above the credit line. Both sit under the 100px rule and the still correctly stays off (deli.js lines 230 to 234), so not a rule break, but the centre column looks a touch short. [layout] Fix if wanted: let `add` at deli.js line 230 go to 30 when there are only four courses.

## Fit and what deli suits

As a test case Rumble shows the layout at its best: the shop counter world, the queue ticket and the receipt all belong to the film's real setting, and the red, white and black board sits well beside the yellow and black poster. "Hot Plates" and "From the Case" are neutral and fit a supermarket deli. Deli suits films set in a real city neighbourhood with a shop, counter or diner at the centre, especially New York or other American cities from the 1950s on: corner store, bodega, deli or supermarket stories, working-class comedies and street-level crime films (think Do the Right Thing, Clerks, Moonstruck, When Harry Met Sally, Smoke). It suits less well period films before take-a-number counters, rural or fantasy settings, and films with no shop or food counter in them, where the ticket and receipt become props with nothing to hang on.

## What I could not check
- The film's in-store signage, so I cannot say whether the store is ever shown named "Uncle Bill's" on screen (unsure).
- Whether the bikers ride their motorbikes inside the supermarket (Wikipedia only says they trash it; unsure).
- The on-screen card (no screen capture for deli), so screen to PDF match is judged from the PDF alone.
- Wikiquote was not needed: no quote lines print on this card (the note is kind "note").

### Fix log
Commit a25c516e on fix26/deli. Proofed with Rumble set to deli, then put back on truck and rebuilt before the commit (data/film-format.json unchanged).
1. Rule 8: deli.js now moves dear dishes (not house lines) to the front of each course before pricing. DEAR is lifted to file scope. Lobster noodles now print first in Hot Plates.
2. Added "Ginger and spring onion lobster noodles" to data/recipes2/rumble-in-the-bronx-1995.json (ingredients, five steps, alcohol-free version without the Shaoxing). The phone now prints a real recipe, no "As written" line or repeated description. The bao already had one. The Prep sheet still cooks five only (planFive, out of scope).
3. Venue NOT changed (rule). Written up for the lead below. Receipt line changed to "Total: ask Elaine" (Wikipedia: Bill sold the store to Elaine).
4. Receipt line now "Cereal, rice, one wedding cake order".
5. Note now signed "Elaine", text "Ask about the wedding tea. No bikers past the counter." (the safe line; Wikipedia only says the bikers trash the store).
6. Cue now "Serve the mains when the bikers trash Elaine's supermarket." (Wikipedia plot, mid film). Prints on truck too, checked.
7. Wink now "Keung's hovercraft hits the golf course" (Wikipedia: Keung drives the repaired hovercraft to the golf course).
8. deli.js prices(): a dear dish gets a premium floor for its era (mains BASE x 1.75, starters x 1.5, the first dear dish highest), only when that sits above every plain dish so no price repeats. Lobster noodles now 7.95, pork 4.95.
9. Course gap cap raised from 26 to 30. Rendered: spare board under the drinks is smaller, still stays off.

All text ops: audit/ops/rumble-in-the-bronx-1995-review-26.json (5 ops, 0 missed).

Shared code items for the lead
- Phone menu (app.js line 1016): film extras get no "not part of tonight's cook" label the way house lines do. With the lobster recipe added this no longer shows for Rumble, but other films with extras and no recipes2 entry will still print "As written" plus the description as step one.
- Truck layout (live) prints Rumble's lobster noodles 4.50 under the pork 4.95 in Off the Grill: the same rule 8 break deli had. Needs the same dear-first sort in truck.js.

Owner decisions
- Venue: data/film-flavour.json has "Uncle Bill's Supermarket". Wikipedia plot (Rumble_in_the_Bronx, Plot): Bill's "supermarket, which he has sold to a young woman named Elaine", and the rest of the plot calls it "Elaine's supermarket" / "Elaine's store". Production notes: in the New Line edit Elaine buys the store on first meeting Bill. Suggest "Elaine's Supermarket" (also matches the starter "Elaine's supermarket Reuben bites" and the wink "Elaine taking over the store"). Affects truck too. Not changed, per the rule.

Checks
- check-print-text "Rumble in the Bronx (1995)": PASS on deli (proof) and PASS on truck after the revert.
- npm test: pass (exit 0, no FAIL lines).

## Dimsum layout review: Men in Black 3 (2012)
**Score: 7.3 out of 10**

The yum cha order sheet is a good fit for this film. Wu's restaurant is a real MIB3 location, and the sign line about the fish lands for anyone who remembers the Spiky Bulba scene. The sheet itself looks like the real thing: numbered rows, tick boxes, a table number in pen and a rubber stamp. The Save PDF matches the screen closely, with no grey boxes, lost borders or clipped words, and every note prints in full at one size. Three things keep it under 9. First, prices climb down each course (0.50, 0.95, 1.25 in Small Plates, and 1.95 then 2.25 in Kitchen Specials), which breaks rule 8. Second, the cheese ball and the cheeseburgers are ticked in pen as if they're tonight's order, but neither is on the Prep sheet or the shopping list. Third, the trolley line is signed "Agent J" but it isn't anything he says in the film, and it has no kind set. The winks, prop date, cue and venue all check out against Wikipedia and Wikiquote.

## Findings

1. **Prices rise down each course instead of falling (screen, PDF).** Small Plates prints A1 0.50, A2 0.95, A3 1.25. Kitchen Specials prints B1 Agency meatloaf 1.95, then B2 cheeseburgers 2.25. Rule 8 wants the dearest dish at the top of its course. [layout] There are two causes in menu-formats/dimsum.js. Line 66 builds every price as `BASE*mult*(1+i*.15)`, so each later row costs more. Then the repeat pass at line 85 always pushes a clashing price *up*. That pass is also what puts the uncooked cheeseburger above the cooked meatloaf: priceSense (app.js line 39) had already lowered it to 1.95, under the meatloaf, and the clash with 1.95 bumped it to 2.25. Fix: in tidyPrices, after the repeat pass, reassign the non-house prices of each course in descending row order (DEAR dishes first), and move a repeated price *down* rather than up. For example, after line 85: `const ord=idx.map(i=>val(pr[i])).sort((a,b)=>b-a);idx.forEach((i,j)=>pr[i]=fmt(ord[j]));`. House rows keep the last slot. This fault will show on every dimsum card, not only this one.

2. **Uncooked extras are ticked as ordered, and the Prep sheet doesn't cover them (screen, PDF, Prep sheet).** A3 "Sixties party walnut cheese ball" and B2 "Launch day cheeseburgers and crinkle fries" carry pen ticks. The Prep sheet (p-2, p-3) says "5 DISHES" and has only hot dogs, dumplings, meatloaf, pie and martini. The cheese ball and burgers are also missing from the shopping list. The phone menu does carry both "As written". So a guest sees seven ticked dishes and the cook has recipes for five. [layout] The cause is dimsum.js line 210, which ticks every row except house lines: `${it.house?"":"&#10003;"}`. Extras (`it.extra`) are meant to start unticked; app.js lines 1141 and 1161 treat them as off by default. Fix: `${it.house||it.extra?"":"&#10003;"}`. The precinct layout already does this. If the brief really wants every printed dish on the Prep sheet, a second fix is needed in app.js: planOn (line 1161) should turn printed extras on by default so their methods and shopping (both in films.json) print.

3. **The trolley line is set out as Agent J's words, but it's invented and has no kind (screen, PDF).** It prints "K, I jumped back to 1969 for you. Now pass the food and tell me about the arc." with "Agent J" under it. It isn't on Wikiquote's MIB3 page, and in the film the device is called the "Arc Net", not "the arc". film-flavour.json has no `kind` on this note, so it prints plain under "FROM THE TROLLEY", signed by a character. Rule 9 needs either real words or kind "note" with true-to-plot content. [film] data/film-flavour.json, "Men in Black 3 (2012)".note. Fix, either:
   - Use a real line, which the layout will put in quote marks under OVERHEARD: `{"text":"Earth people get Earth fish. Real Earth fish.","by":"Agent J","kind":"quote"}`. Wikiquote has this line at Wu's restaurant, the same venue as the card.
   - Keep a note of the same length: `{"text":"K, I jumped off the Chrysler Building for you. Order the pie, it helps you think.","by":"Agent J","kind":"note"}`.

4. **The Prep sheet has empty steps (Prep sheet p-2, p-3).** Meatloaf step 5 just says "Cook. 20 min", right after "Bake at 180°C. 1 hr". Apple pie step 3 and martini step 3 each say just "Cool." A cook can't act on these. [film] data/recipes2/men-in-black-3-2012.json lines 352, 528, 601. Fix: line 352 "Rest the loaf 10 minutes, then slice." (and drop min to 10). Line 528 "Cool the filling for 20 minutes." Line 601 "Cool the coffee for 5 minutes." Or delete these steps, since the step before already covers cooling for the pie.

5. **Gap under the last row (screen, PDF).** About 95px of blank ruled paper sits between D2 and the Showtime line. That's just under the 110px still threshold (dimsum.js line 201), and row padding is capped at +12px (line 198), so nothing fills it. It's within rule 3, but on a dense tick sheet it reads as a half-empty card. [layout] Fix: lower the still threshold at line 201 to `left>90`, or raise the padding cap from 12 to 16 so short sheets spread further.

6. **Ticket lines run together and wrap badly (screen, PDF).** The prop prints "Destination: July 15, 1969. One way, then back", with "back" alone on its own line. The two lines get joined with ". " (dimsum.js line 234), so they don't print as separate ticket lines. "One way, then back" also contradicts itself on a ticket. [layout] and [film] Fix: print each prop line in its own div (`pr2.lines.slice(0,2).map(l=>`<div>${esc(l)}</div>`).join("")`). In film-flavour.json, change the second line to "Return: July 2012 only" (same length).

7. **Small voice mismatches (screen, PDF).** The note box heading says "FROM THE TROLLEY" but is signed "Agent J", and J isn't pushing a trolley. The "Prices subject to change. Images: TMDB." credit sits on the same line as his name. [layout] dimsum.js lines 236 to 238. Fix: when a note has a `by` that isn't the default trolley lady, head it "OVERHEARD" (or "AT THE NEXT TABLE"), and move the credit to the foot of the order sheet.

8. **Anachronism to consider (screen, PDF).** The "Black suit espresso martini" is on a card styled for 1969. The espresso martini dates from the 1980s, which I know from memory and did not check against a source. This doesn't break a locked rule, and the 2012 frame makes it defensible, but a sharp guest may notice. [film] films.json K. Optional fix: "Black suit coffee Black Russian" with note "Vodka and coffee liqueur stirred over ice, a late sixties bar classic" (I'm unsure of that date too, so check it before using).

## Checked and true
- Venue "Wu's Chinese Restaurant": Mr. Wu, an alien who owns a Chinese restaurant (Wikipedia cast list). J and K visit and seize the Spiky Bulba fish (Wikiquote). The sign "Ask about the fish, not the kitchen" fits that scene.
- Winks: Boris escaping Lunar Max, Griffin seeing all possible outcomes, the Apollo 11 launch, and young K arresting J are all in the Wikipedia plot and on Wikiquote. "The time jump off the building" is consistent with J arriving in the Chrysler Building elevator (Wikiquote), but the jump itself is not described in either source.
- Prop "Destination: July 15, 1969": the elevator man tells J "Tuesday. The 15th. July. 1969." (Wikiquote).
- Cue "young K and J stop for pie": "We need pie... Pie, it's good." (Wikiquote).
- Rule 4: the poster carries the MIB3 logo, and the header prints the title and year in type. Passes.
- Rules 1 and 2: every dish note describes food and prints in full at one size. Pass.
- Rule 6: headings are neutral (Small Plates, Kitchen Specials, Sweet, Tea and Drinks, From the Kitchen). Pass.
- Rule 8, partly: house lines are at the foot, there are no repeats, and the sweet (1.75) sits under the cheapest main (1.95).
- Save PDF against screen: same layout, borders, ticks and stamp. Nothing clipped.

## What I could not check
- Whether "Chinatown" is right for Wu's restaurant. Neither Wikipedia nor Wikiquote names the neighbourhood. I believe it is, but I'm unsure.
- That J actually jumps off the Chrysler Building. The sources only place his arrival there.
- I made no web searches. All fact checks used the raw Wikipedia and Wikiquote pages.
- How "TABLE 69" (from the flavour number 1969) lands with guests. It's harmless for the year, but some may smirk.

### Fix log
1. Prices: tidyPrices in menu-formats/dimsum.js now sets each course in price order (ties go to a DEAR dish, then a cooked dish over a card extra, then menu order) and walks it so every price sits under the one above. A repeat steps down, never up (the old up() helper is gone). House lines keep the foot and price under the cheapest dish above them. The layout prints rows in that order. The sweet rebuild now runs dearest first too. MIB3 now reads Small Plates 0.95 / 0.85 / 0.50 / house 0.40, Kitchen Specials meatloaf 1.95 then cheeseburgers 1.75, sweet 1.50, drinks 2.95 / house 2.25. Rush Hour is also strictly descending in every course (its house squid at 3.95 used to print under 2.50, now 2.25).
2. Ticks: extras start unticked (`it.house||it.extra`), so the cheese ball and cheeseburgers (MIB3) and the prawn dumplings and lemon chicken (Rush Hour) show empty boxes, matching the five-dish Prep sheet.
3. Trolley line: MIB3 note is now Wikiquote's line at Wu's, "Earth people get Earth fish. Real Earth fish.", by Agent J, kind quote. It prints in quote marks under OVERHEARD. Op file audit/ops/men-in-black-3-2012-review-26.json.
4. Empty Prep steps: data/recipes2/men-in-black-3-2012.json. Meatloaf "Cook." became "Rest the loaf 10 minutes, then slice." (10 min, cook_min 80 to 70). Pie: step 2 no longer says "then cool", step 3 is "Cool the filling for 20 minutes." Martini: step 2 no longer says "and cool", step 3 is "Cool the coffee for 5 minutes." Checked on the p-2 render.
5. Gap: when no still takes the spare, the grid is now a flex column and each dish row grows into what is left, capped at its estimated height plus 28px. The still threshold is now 100px (was 110) and the pad cap 16 (was 12). Both films now fill down to the Showtime line.
6. Ticket: each prop line prints in its own div. MIB3 second line is now "Return: present day" (I left out "July 2012" because no source gives the month).
7. Voice: a note signed by a character that isn't a quote now heads "AT THE NEXT TABLE" (quotes stay OVERHEARD, the default trolley lady stays FROM THE TROLLEY). The "Prices subject to change. Images: TMDB." credit has moved off the name line to its own small line at the foot of the order sheet.
8. Espresso martini: not changed. See Owner decisions.
Extra: the MIB3 sign said "Chinatown", which neither Wikipedia nor Wikiquote confirms. It now reads "Shrimp and bok choy. Ask about the fish, not the kitchen." (K orders "Shrimp and Bok Choy" at Wu's, per Wikiquote). The venue is unchanged. The en/em dashes in the dimsum.js clean() regex are now written as  to ,  escapes, so the file holds no dash characters.

Shared code items for the lead
- None needed. As the brief says, the Prep sheet cooks five dishes only (planFive), so printed extras get no recipe. That is now consistent because extras print unticked.

Owner decisions
- MIB3 "Black suit espresso martini" on a 1969-styled card: Wikipedia credits the espresso martini to Dick Bradsell (1980s), and the Black Russian (vodka and coffee liqueur) to 1949. Swapping it would mean reworking films.json K, recipes, recipes2 (including the veg alt) and shopping. The film is set in 2012 as well, so I left it. Owner's call.

Checks
- check-print-text "Men in Black 3 (2012)" "Rush Hour (1998)": PASS
- npm test: exit 0, all PASS
- Rendered and checked p-1 for both dimsum films, and p-2 for MIB3 (/tmp/fix26-dimsum)
- Commit 3ad70748 on fix26/dimsum

## Drivein layout review: Ghostbusters: Afterlife (2021)
**Score: 7.8 out of 10**

This is a good-looking card and it reads like the real thing: poster up on the screen with its posts, a marquee board of scenes underneath, and a carhop menu clipped to a steel window tray with a bay number and a speaker line. The film checks out where it counts. Spinners Roller Hop is the real name of the town's drive-in in the film, the Grooberson quote is word for word and his, and every scene in the box below the poster happens. The Save PDF matches the screen with no grey boxes, black blocks, lost borders or clipped words. It still falls short of print-ready because of the prices. Every course gets dearer as you read down, so the chicken fried steak sits at the bottom of the mains, the house fritters are the dearest starter, a root beer costs more than a malt shake and three marshmallows on a stick cost more than a slice of pie. That breaks locked rule 8, and a guest will spot it. The Prep sheet also leaves out two printed dishes that have full recipes in the data.

## Findings

1. **Prices climb down every course, so the dearer dish is at the bottom (rule 8).** Seen on the screen, the PDF and in the faces text: Starters .30 / .35 / .40, Grill .55 burgers then .60 steak, Treats .25 pie then .30 marshmallow men, Drinks .15 malt shake then .20 root beer. The house fritters (.40) are the dearest starter even though they sit at the foot as the house line, and the root beer house line is dearer than the shake. [layout] Cause: `menu-formats/drivein.js` line 63, `v=BASE[ei]*mult[k]*(1+i*.15)`, makes every price go up with its position. `tidyPrices` (lines 70 to 86) only lifts DEAR-matched dishes and moves duplicates up a step. It never puts the dearest dish first, and it never keeps house lines (`it.house`) below the cooked dishes. Fix: in `prices()`, count down for cooked dishes and put house lines below them, for example `const its=menu[k]||[],cooked=its.filter(x=>!x.house).length; let r=it.house?-1:(cooked-1-i); v=BASE[ei]*mult[k]*(1+Math.max(-.5,r)*.15)`. Then in `tidyPrices`, after the DEAR lift, sort the cooked prices in each course from dearest to cheapest. With that change this card would read Starters .35 / .30 / .25, Grill .60 steak / .55 burgers, Treats .30 pie / .25 men, Drinks .20 shake / .15 root beer.

2. **The Prep sheet leaves out two printed dishes that have full recipes.** The printed menu lists 8 dishes. Prep pages 2 and 3 cover 5 (marshmallow men, okra, burgers, pie, shakes). Farmhouse pan cornbread and Oklahoma chicken fried steak are printed and priced, and both carry full methods and shopping lines in `data/films.json`, but they are not on the Prep sheet or in the shopping list. The phone menu shows their methods as "As written, serves 4", so phone and Prep disagree. The two house lines are correctly marked as house standards on the phone. [layout/shared, not drivein.js] Cause: the cook set (`cooked` in `audit/cards/ghostbusters-afterlife-2021.json`) is capped at 5 by the shared Prep builder in `app.js`. Fix: either add every printed non-house dish to the Prep sheet (page 3 is three-quarters empty, so there is room), or print a line on the Prep sheet such as "Also on the card, method on your phone: Farmhouse pan cornbread, Oklahoma chicken fried steak."

3. **The Showtime cue says "snacks" but the dish it plays off is a sweet.** "Serve the snacks when the tiny marshmallow men get loose in the supermarket." The scene is real: Grooberson meets the Mini-Pufts in a grocery store (confirmed by the Slashfilm clip write-up). But the Mini marshmallow men are under Fountain Treats, so "snacks" points the host at the wrong course. I could not pin down how far into the film the scene falls. [film] `data/films.json`, Ghostbusters: Afterlife entry, field `P`. Replacement, same length: "Serve the sweets when the tiny marshmallow men get loose in the supermarket."

4. **Wink spelling: "Mini Pufts" should be hyphenated.** The film and its credits use "Mini-Pufts" (Wikipedia cast and production sections). Seen in the Scenes to watch for box on the screen and PDF. [film] `data/film-flavour.json` line 13483. Replacement: "Mini-Pufts on the loose".

5. **Wink reads as if the class belongs to Podcast and Grooberson.** "Podcast and Gary Grooberson's summer science class". Wikipedia says Phoebe enrols in Grooberson's summer science class and meets Podcast there. As written, it reads as a class run by both of them. [film] `data/film-flavour.json`, winks for this film, line 13484. Replacement, about the same length: "Phoebe in Gary Grooberson's summer science class".

6. **Fixed course headings don't fit two of the dishes.** "From the Grill" sits over a chicken fried steak, which is fried, and "Fountain Treats" sits over a pie and marshmallow skewers, neither of which comes from a soda fountain. It's a small thing, but a careful reader will notice it. [layout] `menu-formats/drivein.js` line 142, `cols:["Starters","From the Grill","Fountain Treats","Shakes and Sodas"]`. Fix: use "From the Kitchen" and "Sweets" for the 1950s look, or let `fl.drinksHeading`-style flavour override the main and sweet headings per film.

7. **House line notes end with a full stop when no other note does.** "Sweet corn fritters fried golden, jalapeño ranch for dipping." and "Ice-cold root beer poured into a frosted glass mug." both end with a full stop, while the other six notes don't. You can see it on the card. [film] `data/film-house.json` lines 2817 to 2826. Replacements: "Sweet corn fritters fried golden, jalapeño ranch for dipping" and "Ice-cold root beer poured into a frosted glass mug".

8. **Small spare-height gaps above the second course in each column.** There is about 60px of open card above "From the Grill" and above "Shakes and Sodas". That's within the capped spread in rule 3, not a fault, but it makes the menu look slightly loose. Each column could take a slightly bigger type tier instead. [layout] `menu-formats/drivein.js` lines 188 to 189 (cg cap 44). No change needed for print.

Checked and fine: venue "Spinners Roller Hop" (named on Wikipedia as the place outside which the flaming phantasms chase pedestrians), sign "Summerville, Oklahoma" (Wikipedia plot), the quote "Science is giving yourself the plague and gambling on the cure." said by Gary (Wikiquote, word for word), the winks "Ecto-1 chasing Muncher through town", "Egon's ghost with the proton pack" and "Egon's field of buried ghost traps" (all in the Wikipedia plot), and the prop "Ghost trap slip / Contents: Muncher" (Muncher is caught in a trap after the Ecto-1 chase). The prop's first line is correctly left off because it repeats the sign. No logo on a box: the poster carries the logo, so the header prints the title and year. All notes describe the food and print in full at one size. The still fills the right column's spare height, with a caption. The 1950s cent prices are intended by the owner.

## What I could not check
- Whether the Spinners Roller Hop carhops wear roller skates in the film (the "Carhops on skates" part of the sign). The name suggests it, but I found no source in my search.
- How far into the film the supermarket Mini-Pufts scene comes, so I can't say whether the cue's timing suits a sweet course.
- The proof PNG is only 936 x 662, so I re-rendered page 1 of the PDF at 150 dpi to check for clipping. I did not check a full 300 dpi print.

### Fix log
1. Prices (rule 8): `menu-formats/drivein.js` `prices()` now counts down (first cooked dish dearest, house lines priced under the cooked ones), and `tidyPrices` puts each course in print order after the DEAR lift: cooked dishes dearest first, house lines last, every line cheaper than the one above, no repeats. The dishes are reordered to match the prices, so the steak leads the mains. The sweets scale-down now rounds to the right step and keeps order with no repeats (it used to round cents to .50). Ghostbusters: Afterlife now reads Starters .35 / .30 / .25 (house fritters last), Kitchen .70 steak / .65 burgers, Sweets .30 pie / .25 men, Drinks .15 shake / .10 root beer. Checked the logic on test menus for every era band.
2. Prep sheet missing cornbread and chicken fried steak: shared code (planFive in app.js caps the cook at five), out of scope per the brief. Written up below for the lead.
3. Cue changed to "Serve the sweets when the tiny marshmallow men get loose in the supermarket." (card-ops set cue).
4. Wink now "Mini-Pufts on the loose" (Wikipedia spelling confirmed).
5. Wink now "Phoebe in Gary Grooberson's summer science class" (Wikipedia plot: Phoebe enrols in a summer science class taught by Gary Grooberson).
6. 1950s look headings now "Starters / From the Kitchen / Sweets / Shakes and Sodas" (drinks still take fl.drinksHeading). Other eras already used Grill/Sweets/Drinks; left as is.
7. Full stops dropped from both house line notes (film-house via card-ops).
8. Spare-height gap above the second course: within the rule 3 cap, reviewer said no change needed. Left as is.

Shared code items for the lead
- Prep sheet cooks five dishes only (planFive/planAll in app.js), so Farmhouse pan cornbread and Oklahoma chicken fried steak print and are priced but are not on the Prep sheet or shopping list. Suggest adding every printed non-house dish, or a line on the Prep sheet: "Also on the card, method on your phone: ...".

Owner decisions
- None new. 1950s look and cent prices kept per the owner's call.

Checks
- Only film on drivein: Ghostbusters: Afterlife (2021). Rendered and viewed p-1.
- check-print-text "Ghostbusters: Afterlife (2021)": PASS.
- npm test: pass (exit 0, no FAIL lines).
- Commit 9c69dd3d on fix26/drivein.

## Foodcourt layout review: Jurassic World (2015)
**Score: 7.0 out of 10**

The idea suits this film well. Jurassic World is a theme park with a Main Street, so a food court tray liner with a mall directory, a backlit stall sign and a cut-out coupon is a fun, believable object, and the film lines all check out. The poster in the directory lightbox looks great and the fascia reads like a real stall sign. Two locked rules are broken on the printed page, though. The Jurassic World logo prints twice on the same face (poster and coupon), and the Sides column has about 170px of blank paper under the last dish with no still filling it. On top of that, only three of the five winks print, the red and navy diagonal border reads as an airmail envelope rather than a tray liner, the mousse note describes a different dessert from the recipe, and two printed dishes (pretzels and short ribs) have no recipe on the Prep sheet. A fan would grin at the eBay shirt and the Claire quote, but a guest would notice the double logo and the hole in the menu. Not ready for paying guests yet.

## Findings

1. **Logo printed twice on one face (rule 4).** [layout] Screen and PDF, coupon at bottom right: the full Jurassic World logo sits in the coupon's right cell while the same logo is already on the poster in the directory lightbox beside it. Cause: menu-formats/foodcourt.js lines 175 to 180. `logoCell` shows the logo whenever `logoImg()` returns one and the contrast check passes; it never checks whether a poster is showing. Clubhouse already does this properly (menu-formats/clubhouse.js line 163, `if(F.posSrc)` prints title and year). Fix: at line 177 use `const lg=F.posSrc?null:logoImg(ctx,196,120)` so the coupon prints "Jurassic World / 2015" in the display type whenever the poster is on the card. That also gets rid of the white drop-shadow halo around the logo.

2. **Big empty gap in the Sides column, no still (rule 3).** [layout] Screen and PDF: under "Popcorn chicken with ranch" there is blank paper from about y 542 to y 717 on the 1344 by 960 card (measured on the screen capture, about 175px) down to the Showtime rule. The film has stills (data/film-stills.json and data/still-block.json both hold several) and the still HTML is on the card (the audit faces list "Jurassic World, 2015. Film still."), but it is pushed off the card. Cause: lines 202 to 209. The still box only shows when its own share is at least 100px (line 206, `flex:1 0 100px`), but the column's spare height is first split with the dish spacers (16px each), the course spacer `spC` (22px) and the fixed 12px `cgap` after the last course. That eats about 40px of the gap, so the still box ends up just under 100px and wraps off, while the gap a guest sees is well over 100px. Fix: when `stillBox` is present, leave out the trailing `cgap` div and `spC` of the column's last course (or drop the inner minimum to 80px), so a visible gap over about 100px always gets the still.

3. **Only three of five winks print, though all five could fit better (rule 7).** [layout] Screen and PDF, "Spotted around the mall" box: "Owen's raptor squad" and "Claire lets the T. rex out of its paddock" are dropped. Cause: line 154. The width guess `e.cw*1.05` (0.556 per character for DM Sans at 14px) is about 7% too wide. "The Mosasaurus feeding show" measures about 197px on the card, which fits the 206px half column, yet the code marks it as a full-width row, so three long rows fill the box and the short "Owen's raptor squad" has nowhere to pair. Fix: use `e.cw` (no 1.05) for the half-width test so short winks pair up, and shorten one film wink so four fit. Exact replacement in data/film-flavour.json: "Gyrosphere ride in the valley" to "Gyrospheres in the valley" (25 characters, fits half width).

4. **Border reads as an airmail envelope.** [layout] Screen and PDF, all four edges: 45 degree red, white, navy, white stripes. With this film's palette accent (#b22222) and the modern band's navy (#2c3e50) it is exactly the par avion envelope pattern, not a food court tray liner, which pulls against the whole concept. Cause: lines 141 to 142, the `repeating-linear-gradient(45deg, acc, paper, acc2, paper)` band. Fix: print a one-colour band in the accent with a thin inner rule, or a small checker or wavy pattern in one colour, so it no longer alternates two colours at 45 degrees.

5. **Mousse note describes the wrong dessert (rule 1, accuracy).** [film] Screen, PDF and phone: "Dark chocolate mousse set in speckled egg cups, with whipped cream". The recipe (Prep sheet step 3 and 4, data/recipes/jurassic-world-2015.json `w[0].how`) spoons the mousse into glasses, folds the cream through, and tops it with crushed biscuits and one speckled chocolate egg. There are no egg cups and no whipped cream on top. Cause: data/recipes/jurassic-world-2015.json and data/film/jurassic-world-2015.json (note written in audit/ops/jurassic-world-2015-notes-26.json). Fix, same length: "Dark chocolate mousse in glasses, biscuit soil, speckled choc egg on top".

6. **Prep sheet is missing two printed dishes.** [film] Printed menu shows "Main Street cinnamon sugar pretzels" and "Owen's smoky beef short ribs", and the phone menu gives their methods ("As written, serves 4"), but the Prep sheet (p-2, p-3) covers only five dishes and its shopping list has no flour, yeast, bicarb, cinnamon, caramel, short ribs, corn or barbecue sauce. A host who wants to cook what the card offers has no plan for those two. Cause: data/recipes/jurassic-world-2015.json has no entry for either dish, so the Prep sheet skips them. Fix: add both to the recipes file (the methods already exist in data/films.json), or swap them off the printed card for house standards.

7. **Fish tacos priced above beef short ribs.** [layout] Screen and PDF, Mains: Isla Nublar fish tacos 12 over Owen's smoky beef short ribs 11. Rule 8 order is kept (dearer at the top), but slow-cooked short ribs reading as the cheap main looks odd to a guest. Cause: app.js line 25 onwards, `priceSense` caps a card extra (no tested recipe) below the cooked mains. Fix: once finding 6 is done the ribs become a cooked dish, the cap no longer applies, and the ribs can take the top price.

8. **Small prop wording point.** [film] Coupon: "Park Admission / Isla Nublar, Gyrosphere Valley / Admit one". Gyrosphere Valley is a real area in the park, but a park admission ticket would name the park entry, not one ride area. Fix, same length: "Isla Nublar, Gyrosphere Valley" to "Isla Nublar, ferry and monorail".

Checked and fine: venue "Main Street Food Court" and sign "Isla Nublar, open daily" (Main Street is the park's real strip); quote "We needed something scary and easy to pronounce." is Claire's real line (Wikiquote); Lowery's $150 eBay shirt (Wikiquote: "I got off of eBay. Cost me $150"); mosasaur leaping for the shark at the feeding show and the cue (Filmsite plot); Gyrosphere Valley (Filmsite); Owen's raptor squad and Claire releasing the T. rex from its paddock (Wikipedia plot). All notes print in full at one size, prop prints under "TICKET" with its lines, headings are neutral, house lines sit at the foot of Sides and Drinks, dessert sits under Mains, no repeated prices in a course. The Save PDF matches the screen: no grey boxes, black blocks, lost borders or clipped words.

## What I could not check
- I did not render the card myself, so the still box share in finding 2 is worked out from the code and from pixel measurements of the screen capture, not from a live DOM read.
- I did not confirm there is a place actually called a "food court" in the film; I treated the venue as a fair invention on the real Main Street.
- Whether the speckled chocolate eggs in the shopping list are easy to buy outside Easter in Australia.

### Fix log
Commit fd8e65f4 on fix26/foodcourt. All six foodcourt films rendered and checked (Jurassic World, Wonder Woman 1984, Mallrats, Jingle All the Way, Bad Santa, Fast Times at Ridgemont High).
1. Logo twice: the coupon now uses `F.posSrc?null:logoImg(...)`, so with a poster on the card it prints the title and year in the display type. This also fixed Bad Santa, which printed its logo twice as well. The white halo is gone with it.
2. Sides gap: the cause was flex maths. The still box grew at .5, and once the capped spacers stopped, a grow under 1 only takes half the space left, so half the gap stayed blank. The still now grows at 1. A column with a still also drops its last course gap and spacer and uses tighter spacer caps (12px and 14px). Measured in the live DOM: the Jurassic World Sides still now gets about 136px and shows. Every column on the six films with a gap over 100px now has a still, and none is left with a blank over 100px.
3. Winks: the half-width test now uses `e.cw` with no 1.05. "Gyrosphere ride in the valley" became "Gyrospheres in the valley" and "Claire lets the T. rex out of its paddock" became "Claire frees the T. rex" (Wikipedia: "Claire releases ... Tyrannosaurus rex"), so all five print. On the other films: Bad Santa "Marcus the elf and Sue at the bar" became "Marcus the elf" (4 of 4 print), Fast Times "Spicoli wanting tasty waves and a cool buzz" became "Spicoli's tasty waves" (5 of 5), Jingle "Ted Maltin, the neighbour next door" became "Ted Maltin next door" (5 of 5).
4. Border: now a solid band in the accent colour with a thin paper pinstripe inside it, one colour only, no 45 degree two-colour stripes. The pinstripe sits inside the band so it never runs through the footer credit.
5. Mousse note is now "Dark chocolate mousse in glasses, biscuit soil, speckled choc egg on top" in recipes, dish-notes and the films.json card note. The phone method line was reworded to match the recipe (biscuit soil and a speckled chocolate egg).
6. Pretzels and short ribs: added to data/recipes and data/recipes2 (structured ingredients and steps) using the methods already in data/films.json, and added their items to the shopping list. Both are now tested recipes. Note: the Prep sheet still cooks five (planFive). It now picks prawns, cheese balls, short ribs, mousse and lemonade, so tacos and pretzels are left unticked. Out of scope as the brief says.
7. Prices: short ribs now count as a dear dish (local DEAR regex: short ribs, beef ribs, brisket). The layout also sorts each course dearest first, with house lines kept at the foot. The old code printed ascending prices inside a course (JW Sides 10, 7, 8, Mallrats Snacks 2.50, 2.95, 3.50). JW Mains is now ribs 14, then tacos 12.
8. Ticket line is now "Isla Nublar, monorail entry". I used monorail and not ferry because Wikipedia confirms the park's monorail (Brad Bird voices the monorail announcer) but does not mention a ferry.
Also fixed (rule 1 and the prop):
9. Jingle All the Way: popcorn note "White chocolate popcorn. Dementor jumps the parade float." is now a food note. Ted's cookies note had a film quote in it and is now a food note. House pretzel ("Put that cookie down...") and house orange whip ("It's Turbo time...") are now food notes.
10. Jingle All the Way: wink "Jingle bells, Batman smells, the Santa password" could not be confirmed (not in the Wikipedia plot, Wikiquote blocked, one search found nothing). Replaced with "Fake Santas' warehouse" (Wikipedia plot: counterfeit ring run by con artists in Santa suits, warehouse fight).
11. Fast Times: Captain Hook flathead note ("Brad's job at the fish and chips shop...") and house Orange Julius ("Aloha, Mr. Hand...") are now food notes. House calzone note (not printed today) is now a food note too.
12. Wonder Woman 1984: falafel note lost its plot tail ("for the desert convoy"). House Orange Julius ("Barbara wished to be Diana...") and house egg rolls ("Steve discovers fanny packs...") are now food notes.
13. Prop lines no longer print a doubled stop ("It's Turbo Time!. Dementor..." is now "It's Turbo Time! Dementor...").

Shared code items for the lead
- planFive cooks five. Jurassic World now has seven tested dishes, so tacos and pretzels print with recipes but are left unticked on the Prep sheet.
- The Wikiquote raw endpoint returned a Wikimedia error page from this box, so quotes were not re-checked there this round.

Owner decisions
- Bad Santa and Fast Times stills: the TMDB first stills are a suggestive Santa scene and a poolside shot. They fit the films, but the owner may want different stills for a dinner card.
- Bad Santa prints the house nachos (6) at the foot of Sides, dearer than the dishes above. This follows rule 8 (house lines last). Flagging it only in case it reads oddly.

Checks
- check-print-text, all six foodcourt films: PASS (6 printed menus read, no dish name or note hidden).
- npm test: exit 0, no FAIL lines.

## Hospital layout review: Terminator 2: Judgment Day (1991)
**Score: 7.6 out of 10**

This is a strong match of film and object. Pescadero State Hospital is the right place, Sarah Connor on the wristband is the right patient, and "Come with me if you want to live." under "Overheard on the ward" is the real line, said by the Terminator in that hospital. Fans will grin at that. The five winks are all true, the dish names hook into real places in the film (Enrique Salceda's desert camp, the Galleria, the liquid nitrogen truck), every note describes the food, and the ticked boxes line up with the five dishes on the Prep sheet. The Save PDF matches the screen with no grey boxes, black blocks, lost borders or clipped words. Two locked rules break, though. The film's prop ("Ward Rules" card) never prints anywhere, and the right column of the order form leaves about 150px of blank paper under Drinks with no still in it. The header also drops the film's sign, and the showtime cue sends mains out in the opening minutes. Fix the prop and the gap and this is close to a 9.

## Findings

1. **Prop never prints (rule 5).** Screen, PDF and the faces in audit/cards all have no "Ward Rules" card and no "Maximum security wing" or "Dr Silberman's patient" lines. [layout] menu-formats/hospital.js line 106 builds `F.prop` in the shared `film()` helper, but nothing in the face (lines 162 to 231) ever uses it. Fix: print the prop as a small pinned card under a label taken from prop.kind ("CARD", or a hospital word for it) with its title "Ward Rules" and both lines. The obvious place is the blank patch in the right column of the form (finding 2). The "WARD KITCHEN 1991" stamp box (line 228 to 230) is a second option, since right now it holds only a stamp and the TMDB credit.

2. **Big blank under Drinks, no still (rule 3).** Screen and PDF: the right column (Dessert, Drinks) ends at about y 560 on the 1344x960 face, and the cue rule sits at about y 710, so roughly 150px of empty form. Rule 3 wants a real TMDB still in any gap over about 100px, and this film has stills (data/film-stills.json). [layout] hospital.js lines 211 to 214: the column's spare height comes from `fit()`'s estimate (`R.hs`), which runs high for IBM Plex Sans Condensed (`cw:.44, cwd:.46`, line 156). It works out `left` at about 44px when the real leftover is about 120px, so `left+30>100` never fires. Then the 28px course gap cap and 10px item gap cap stop the spreading. Fix: measure the column after render, or bring the 1990s band's `cw`/`cwd` down to about .40/.42, or drop the still threshold to `left+30>60`. Or fill this patch with the prop card from finding 1.

3. **Sign dropped from the header.** Screen and PDF print "PATIENT MEAL SERVICE · MEAL ORDER" instead of the film's sign "Pescadero, California. Maximum security wing". [layout] hospital.js line 177: the check that stops the venue repeating sees "pescadero" (first comma piece of the sign) inside the venue name and throws the whole sign away, "Maximum security wing" included. Fix (layout): drop only the first comma piece when it matches the venue and keep the rest. Fix (film, data/film-flavour.json sign): replace "Pescadero, California. Maximum security wing" with "Maximum security wing, criminally insane" (same length), so the header reads "MAXIMUM SECURITY WING, CRIMINALLY INSANE · MEAL ORDER". I could not confirm "maximum security" from my sources (see below). If you want to be safe, "Patient meal service, Dr Silberman's ward" is true to the film, since Silberman is her doctor there per Wikipedia.

4. **Showtime cue comes too early.** Screen, PDF, Prep sheet and phone: "Serve the mains when the Terminator asks the biker for his clothes, boots and motorcycle." The line is real (Wikiquote: "I need your clothes, your boots, and your motorcycle."), but the biker bar is one of the opening scenes, before the mall. Guests would have to eat starters before the film starts and mains within its first few minutes. [film] data/films.json P. Fix, same length and tied to the "Desert camp tacos" main: "Serve the mains when John and the Terminator pull into Enrique Salceda's desert camp." (Filmsite confirms Salceda's desert camp with the weapons cache.)

5. **Bed number loses the Model 101 nod.** Screen and PDF: wristband reads "WARD F" and "BED 01". The film number is "101" (the Terminator's model number, confirmed on Wikiquote: "Cyberdyne Systems Model 101"), but the bed shows only the last two digits, and the ward letter is just 101 mod 6. [layout] hospital.js lines 186 to 187 (`F.num.slice(-2)`). Fix: print the full number when it has three digits ("BED 101"), which is the grin the data set up for.

6. **Phone menu gives a recipe for a dish nobody cooks.** Phone: "Galleria food court double smash burger" shows "How to make it / As written, serves 4" and a method. Printed card leaves it unticked, and the Prep sheet (5 dishes) has no recipe or shopping for it. [film] data/recipes2/terminator-2-judgment-day-1991.json has no burger, so the phone falls back to the films.json method (formats-core.js line 56). Small, and the method is usable, but the phone and print disagree on what's cooked tonight. Fix: phone should print "A card extra, not part of tonight's cook." like it does for the house lines, or add the burger to recipes2.

7. **Minor, no change needed.** Dessert prints at the top of the right column beside Starters, not straight under Main Meal. It follows Main Meal in column order, and real hospital order forms are laid out this way, so I don't count it against rule 8. No prices, as the owner intended. The header shows title and year text rather than the logo, which is right because the poster already carries the T2 logo (rule 4 met).

## Checked and true
- Venue Pescadero State Hospital, Sarah held there (Wikipedia plot).
- Quote "Come with me if you want to live." by the Terminator to Sarah (Wikiquote; Filmsite places it at the hospital).
- Winks: dirt bike chase in the flood control channel (Wikipedia production, Filmsite); T-1000 taking the shape of the tiled floor (Filmsite); NO FATE carved into a table (Wikiquote); thumbs up as the T-800 sinks into the steel (Wikipedia plot); steel mill and vat of molten steel (Wikipedia plot).
- Galleria mall (Filmsite), Enrique Salceda as Sarah's friend (Wikipedia cast), Mexico plan behind "Border run" (Wikipedia plot).
- Prep sheet covers all five ticked dishes, and the shopping list totals add up (7 limes, 4 eggs, 2 onions).

## What I could not check
- Whether Sarah is held in a "maximum security wing" (prop line and sign). Not in Wikipedia's plot or on Wikiquote. Unsure.
- The exact running time of the biker bar scene. I only confirmed it comes early in the film (Wikipedia production notes, plot order).
- Ward F is made up by the layout. I found no ward letter in the film.
- I did not watch the film. Fact checks rest on Wikipedia, Wikiquote and Filmsite only.

### Fix log
1. Prop never prints: hospital.js now prints the prop as a pinned white card in the foot box on the right (widened 200 to 230px), with prop.kind as the label (CARD, BADGE, SLIP), the title and its lines. Sizes step down if the lines would not fit. The WARD KITCHEN stamp moved onto the form's top bar so the box is free. Done for all 7 films. For T2 the prop is now "Patient Card": "High-security wing" (Filmsite: "the high-security wing") and "Dr Silberman's patient" (Wikipedia cast). "Maximum security" could not be confirmed, so it is gone.
2. Big blank under Drinks: each form column is now a wrapping flex box the height of the form. Headings, dishes and gaps are its flex items, so the real height on paper counts, not the estimate. Gaps grow into the leftover (capped at 10px per dish and 40px per course). A film still follows the last dish, at least 100px tall, and takes the leftover when it fits; if under about 106px is left it wraps into a hidden second line and the gaps spread instead. The column with more room gets the first still, the other one the second still. Also fixed course()'s cgap:0 falling back to 12. T2 now prints a 164px still under Drinks. Rain Man, Shutter Island and Smile no longer print a thin strip still.
3. Sign dropped from header: the layout now drops only the sign's first comma piece when it repeats the venue and keeps the rest. T2 sign set to "Criminally disordered retention facility", the words on the fence sign (Filmsite: "PESCADERO STATE HOSPITAL - State of California - A Criminally Disordered Retention Facility"). Header reads "CRIMINALLY DISORDERED RETENTION FACILITY · MEAL ORDER". The new layout rule would have shown two unchecked signs, so they changed too: Rain Man "Wallbrook, Dr Bruner's patients" (Wikipedia: Dr Gerald Bruner is Raymond's doctor), Nightmare 3 "Westin Hills, Dr Gordon's patients" (Wikipedia plot).
4. Showtime cue too early: T2 cue is now "Serve the mains when Sarah, John and the Terminator reach Enrique Salceda's desert camp." Sarah is in the scene (Filmsite: "Sarah: Enrique? You here?"), so she is named.
5. Bed number: the wristband prints the full film number when it has four digits or fewer: T2 "BED 101", Rain Man "BED 246", Nightmare 3 "BED 1428", Halloween II "BED 1978". Films with no number keep the two-digit year.
6. Phone recipe for the burger: added "Galleria food court double smash burger" to data/recipes2 with the same method, as proper ingredients and steps (800g mince, 8 cheese slices, 4 buns, sauce, lettuce, pickles). The phone now shows its own recipe, the same as the empanadas, which is also unticked. The Prep sheet still cooks the five ticked dishes.
7. No change needed (dessert placement, no prices, title text in place of logo).
Also fixed, other films on this layout (rule 1, notes must describe food), through card-ops ops files:
- Smile: slider, ramen and cookie notes plus both house lines were jokes. All rewritten as food from their methods.
- Rain Man: toothpick cubes, cheese balls and sirloin notes plus both house lines rewritten.
- The Silence of the Lambs: both house lines (Chianti printed "The good doctor's pick. Chilton never gets one.") rewritten.
- A Nightmare on Elm Street 3: both house lines (malted milk printed "Skip it on Hypnocil nights") rewritten.

Shared code items for the lead
- The phone menu still shows "As written, serves 4" (films.json fallback) for unticked dishes with no recipes2 entry on other hospital films: Shutter Island (lobster roll sliders, roast beef), Smile (pulled pork sliders, miso ramen), Rain Man (cheese balls, sirloin), Silence of the Lambs (crab cakes, fried chicken). Either add recipes2 entries or have formats-core.js print "A card extra, not part of tonight's cook." for unticked dishes.
- Not chased: the Prep sheet cooks five dishes only (planFive), as the brief says.

Owner decisions
- Unchecked flavour lines left as they are, no source found either way: Silence of the Lambs sign "Baltimore, Cell Block Only", Halloween II prop "Haddonfield Memorial, Ward 3", and the ward letter, which the layout makes up from the number.

Results
- check-print-text, all 7 hospital films: PASS ("7 printed menus read").
- npm test: pass (exit 0, 23 PASS lines, no failures).
- Rendered and checked by eye: Shutter Island, Smile, Rain Man, Terminator 2, The Silence of the Lambs, A Nightmare on Elm Street 3, Halloween II (Save PDF page 1; T2 Prep sheet and phone text too).
- Commit 222f4715 on fix26/hospital.

## Reception layout review: Four Weddings and a Funeral (1994)

**Score: 7.6 out of 10**

This one looks and reads like a real reception table: letterpress menu card in a double rule, a tented place card, a Watch For card, Gareth's toast, a TMDB still of Charles and Carrie, and the poster up on a red easel with the invitation hung off its legs. The Save PDF matches the screen closely (shadows, borders, the easel and the dotted foot rule all survive, no grey boxes or clipped words). Every dish note describes food and prints in full at one size. The film lines check out against Wikipedia, Wikiquote and IMDb, apart from one wink that gets the roles the wrong way round. It is held under 9 by three things a host or guest would notice. The menu card has two bands of empty card, about 95px and 106px. The two house lines are switched off even though there is room for them. And the Prep sheet only covers 5 of the 7 printed dishes, so nothing on it tells the host how to make or shop for the lamb or the ploughman's board. Smaller misses: "Welcome to Marquee Reception Tent" has no article, the toast is labelled OVERHEARD rather than as a toast, the invitation lines are made up and a bit flat, and the canapé recipe has a stray "Blanch." step.

## Findings

1. **Prep sheet does not cover every printed dish.** PDF page 1 prints 7 dishes. Pages 2 and 3 say "5 DISHES" and give methods only for the canapés, oatcakes, roast beef, cake and fizz. The Lucky Boatman ploughman's board and the Highland braised lamb have no prep entry, and the shopping list has none of their ingredients (lamb shoulder, swede, pearl barley, cheddar, ham, pickled onions, loaf and so on). The phone menu does carry "As written, serves 4" methods for both, so the gap is on the printed Prep sheet only. [film] Cause: data/recipes2/four-weddings-and-a-funeral-1994.json lists only the five cook dishes, and app.js lines 1759 to 1761 (fullMenu) add the film's other dishes to the card on purpose without adding them to the prep. Fix: add the ploughman's board and the lamb to recipes2 for this film using the methods already in data/films.json, or have the Prep sheet print an "Also on the card" block with the as-written method and shopping list for any extra dish.

2. **Empty bands on the menu card.** Screen and PDF both show a gap of about 95px (print scale) between "Bride's Side. Groom's Side. Bar." and "To Begin", and about 106px between the drink note and the Showtime line. That is right at the 100px limit in rule 3, and it reads as if something is missing from the card. [layout] Cause: menu-formats/reception.js line 147 caps the gap between courses at 30px, and line 157 centres whatever is left over, so the spare height ends up in two bands at the top and bottom. Fix: once the cap is reached, push the leftover into the space between dishes (tr.g) as well as between courses, or take it up with the house lines (finding 3). Either way, no band should be over about 40px.

3. **House lines are off even though there is room for them.** Neither the Coronation chicken vol-au-vents nor the Gin and tonic with cucumber prints, on screen, in the PDF or on the phone. Rule 8 wants house lines at the foot of their course, and the card has around 200px spare. [film] Cause: data/film-house.json line 2601, `"fit": []`, tells fullMenu (app.js line 1777) that no house line fits this layout. Fix: change it to `"fit": ["s","d"]`. That gives four starters (itemsOf allows 4), adds the vol-au-vents (a very English wedding canapé, good for the film) at the foot of To Begin and the G&T at the foot of To Toast, and fills most of the gap in finding 2.

4. **Welcome sign has no article.** Screen and PDF, top right: "Welcome to / Marquee Reception Tent". It reads like a venue name, and it is not. The film's first reception is Angus and Laura's (Wikipedia plot), and a real welcome sign would name the couple. Wikipedia does not say whether the reception was in a marquee. [film] Cause: data/film-flavour.json line 6398. Fix: replace "Marquee Reception Tent" with "Angus and Laura's Wedding" (25 characters; vS on reception.js line 163 sizes the line to its length, so it still fits on one line).

5. **Gareth's toast is labelled OVERHEARD.** Centre column. The quote is real and his ("A toast before we go into battle. True love... May we all in our dotage be proud to say, 'I was adored once too.'", Wikiquote). The layout has a "FROM THE TOASTS" label for exactly this case, and it would land well with fans. [film] Cause: data/film-flavour.json line 6403, `"kind": "quote"`, which picks OVERHEARD at reception.js line 212. Fix: change it to `"kind": "toast"`. Quote marks still print, because line 190 keeps them for a toast that has a note.

6. **Wink gets the roles the wrong way round.** Watch For card: "David signing for Charles". Wikipedia: "David interrupts it, using sign language, with Charles as his interpreter". David signs and Charles speaks for him, so "signing for Charles" reads backwards. [film] Cause: data/film-flavour.json line 6408. Fix: "David signing at the altar" (26 characters). The other four winks are confirmed: Funeral Blues at the funeral (Wikipedia), Father Gerald's slips such as "Holy Goat" and "awful wedded wife" (IMDb character quotes), the pair barely making the first wedding (Wikipedia), and "the person standing opposite me now... in the rain" (Wikiquote).

7. **Invitation lines are made up and a bit flat.** Easel card: "CARD / Wedding Invitation / You are invited, again / RSVP to Charles, please". Charles is a guest at three weddings, so an RSVP to him does not fit. In the film he gets an actual invitation to Carrie and Hamish's wedding (Wikipedia). [film] Cause: data/film-flavour.json lines 6416 to 6417. Fix: "You are invited, again" to "Carrie and Hamish invite" (24), and "RSVP to Charles, please" to "the pleasure of Charles" (23). The CARD label meets rule 5 and can stay.

8. **Duplicate step in the canapé method.** Prep sheet page 2, Charles's running late canapés, steps 1 and 2: "Trim the asparagus and blanch for a minute." then "Blanch." with its own 1 minute timer. The phone menu repeats it. [film] Cause: data/recipes2/four-weddings-and-a-funeral-1994.json line 54. Fix: delete the step `{"text": "Blanch.", "min": 1}` and set step 1 to 4 min.

9. **Courses run in cook order, not dearest first.** To Begin reads canapés, oatcakes, then the ploughman's board, which is clearly the biggest and dearest plate. The Main Event puts roast beef above the 3 hour braised lamb. No prices print on this layout, so a guest is unlikely to notice. [layout] Cause: reception.js line 143 takes ctx.menu as fullMenu built it (the five cook dishes, then extras appended). Fix: sort each course by the same weight priceSense uses before building menuBody, so the board and the house line sit where rule 8 expects.

10. **Stale header comment.** reception.js lines 1 to 5 describe the easel on the left, the menu in the centre, a seating plan named for the winks, and a logo on a cake table card. The code now puts the menu on the left, the cards in the centre and the easel on the right, and the poster stands in for the logo. Nothing prints wrong, but it will mislead the next person who edits the file. [layout] Fix: rewrite the comment to match lines 141 to 181.

Checked and fine: the cue ("first wedding reception", Wikipedia); the Lucky Boatman as the inn where Charles and Carrie go after the first reception (movie-locations.com); Gareth's waistcoats (Matthew's eulogy, Wikiquote); Carrie's wedding in Scotland, which suits the Highland lamb and oatcakes (Hamish is Scottish, and Wikipedia files the film under films set in Scotland); dessert under mains; no logo boxed (the poster carries the title, and the still caption gives title and year); headings neutral; winks in a labelled box.

## What I could not check

- Whether Angus and Laura's reception was in a marquee. Wikipedia and movie-locations name the house (Goldington's, Hertfordshire) but do not say what it was held in. I could not confirm or rule it out.
- Charles and Scarlett "oversleeping". Wikipedia says they "barely make it in time". The oversleeping detail is the well-known opening but I did not confirm it from a source.
- The phone proof is a flat text dump, so I could not judge the phone's visual layout, only its content and order.
- I did not open the full multi-page PDF beyond the three page PNGs, and I did not test other eras or tones for this layout.

### Fix log
Branch fix26/reception, commit cfc9eee5. All 12 reception films rendered and checked before and after (/tmp/fix26-reception/base, v1, v2).

1. Prep sheet covers 5 of 7 dishes: not fixed, out of scope for this round (planFive/planAll in app.js cook five only). The two extras still show on the phone menu with full as-written methods, and are offered unticked in the planner.
2. Empty bands on the menu card: reception.js now builds the menu as flex spacers. Each gap starts at the old margin, grows to a cap (between courses most, between dishes a little, top and bottom bands at most 40px) and shrinks if the card is tight. Only what is left past every cap centres. Four Weddings now fills the card with no band over about 20px; every other film spreads the same way.
3. House lines off: film-house fit set to ["s","d"] for Four Weddings (vol-au-vents at the foot of To Begin, G&T at the foot of To Toast). Did the same for Doctor Strange, which had the same empty card and food-only house notes.
4. Welcome sign with no article: venue name left alone. The layout now prints "Welcome to the" unless the venue already starts with The/A or is a possessive (so "Lily and Gede's Wedding" still reads "Welcome to"). Venue change written up below for the lead.
5. Toast labelled OVERHEARD: setting kind "toast" lost the quote marks, because the shared libNoteKind (app.js 1542) strips marks from anything that is not kind "quote". So the note stays kind "quote" with the reviewer's longer real line ("A toast before we go into battle. True love... May we all in our dotage be proud to say, 'I was adored once too.'", Wikiquote), and a new flavour.reception.toast flag makes the layout label it FROM THE TOASTS. Prints in quote marks.
6. Wink backwards: "David signing for Charles" changed to "David signing at the altar". Also "Charles and Scarlett oversleeping the first wedding" changed to "Charles and Scarlett, late for the first wedding", which is what Wikipedia says ("barely make it in time").
7. Invitation lines: changed to "Carrie and Hamish request" / "the pleasure of Charles's company" (Wikipedia: Charles gets an invitation to Carrie and Hamish's wedding).
8. Duplicate Blanch step: removed from recipes2, its minute added to step 1 (now 4 min). Prep and phone both read cleanly now.
9. Courses in cook order: each course now sorts dearest first (lobster/prime rib, then steak, fillet, cutlets, crab, oysters, board, barramundi, snapper, then prawns, salmon, lamb, beef, fish). If two dishes rank the same, the cooked dish goes first and the card extra after it, matching priceSense, which never prices an extra above a cooked main. The house line is always last. Four Weddings: ploughman's board leads To Begin. Roast beef stays above the lamb because they rank the same and the beef is the cooked main.
10. Stale header comment: rewritten to match the code (menu left, cards centre, easel right, note kinds, no logo box).

Also fixed on the other films (rule 1 and rule 9, found in the full render):
- A note with no kind now counts as a note in the character's voice: no quote marks and no OVERHEARD (Palm Springs, Anyone But You, Top End Wedding, Father of the Bride, The Farewell and Greek Wedding were all printing made-up lines as quotes). The label is now FROM THE HEAD TABLE, which fits on one line (it used to wrap).
- Non-food dish notes rewritten as food: Greek Wedding (all five cooked-dish notes plus the lamb), The Farewell (dumpling note had a quote in it, steamed fish), Palm Springs (stuffed chicken), Ticket to Paradise (snapper), Wedding Crashers (meatloaf), Father of the Bride (beef fillet), My Best Friend's Wedding (wings, pizza, crème brûlée).
- House line notes that were jokes rewritten as food on Palm Springs, Greek Wedding, The Farewell, Anyone But You, Ticket to Paradise, Top End Wedding, Wedding Crashers, Father of the Bride and My Best Friend's Wedding. The meat and alc flags are kept.
- Checked on Wikiquote: Doctor Strange "How long have you had that one in the barrel?" (Strange, at Christine's reception) and The Wedding Singer "things that could've been brought to my attention yesterday" (Robbie). Both are real, so both stay as quotes.

Shared code items for the lead
- Prep sheet covers five dishes only (finding 1). Two ways to fix it: have planAll/planFive in app.js print an "Also on the card" block with the as-written method and shopping for each card extra, or tick card extras by default on reception.
- app.js libNoteKind (line 1542) strips quote marks from every note kind except "quote", so a real "toast" kind prints without marks. A toast with a real quote has to stay kind "quote" for now, labelled through flavour.reception.toast. Suggest libNoteKind also keep marks for kind "toast".

Owner decisions
- Venue, Four Weddings: "Marquee Reception Tent" is not a name from the film. Wikipedia's plot says the first wedding is Angus and Laura's, in Somerset, with Charles as best man, and it does not mention a marquee. Suggest the venue "Angus and Laura's Wedding" (25 characters, fits the sign on one line, and the layout drops "the" for a possessive). Not changed, as briefed.
- Other generic venues worth a look: Doctor Strange "Wedding Reception Hall" (the reception is Christine's, per Wikiquote's scene heading) and Palm Springs "Wedding Reception Pool". Not changed.

Results
- node scripts/check-print-text.cjs on all 12 reception films: 12 printed menus read. PASS: no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops.
- npm test: exit 0, all PASS.

## Skilodge layout review: Better Off Dead (1985)
**Score: 7.3 out of 10**

The ski lodge idea suits this film really well. The K-12, run markers for courses, a snow report board and a lift ticket on a wire all read like a real lodge menu, and the Save PDF matches the screen with no grey boxes, black blocks or clipped words. Every dish note describes the food and prints in full at one size. The quote, venue, sign and winks all check out against Wikipedia and Wikiquote. It is held under 9 by two locked-rule breaks in the layout code. The film logo prints a second time beside a poster that already carries the title, and half of it ("OFF", in white) all but disappears on the cream card. The film's prop, the paper route bill, never prints at all because the lift ticket throws away any prop that is not a ticket. On top of that, the Prep sheet only covers 5 of the 9 printed dishes, and the house starter is priced the same as the dearest main. Fix the logo and the prop and this gets close to ready. A fan would already grin at "I want my two dollars!" and the snow report.

## Findings

1. **Logo printed again beside a poster that already shows the title, and "OFF" is nearly invisible.** Screen and PDF, top right of the menu card. The red "BETTER OFF DEAD" logo sits bare on the card while the poster on the left already prints "BETTER OFF DEAD" in big red letters. In the logo, "OFF" is white on the near-white card and can barely be read (checked on a 150 dpi render of the PDF). Breaks rule 4. [layout] Cause: menu-formats/skilodge.js line 216 always calls `logoBare(...)`. That function's contrast check (lines 141 to 145) passes because most logo pixels are strong red, so the white word gets through. The layout never asks whether the poster beside it already carries the logo. Fix: this layout always has the poster on the left, so when `F.posSrc` is set, print the title and year in the display face instead of the logo, e.g. `${F.posSrc?`<div style="font:${e.dw} 26px/1.05 ${DF};color:${acc};text-align:center">${esc(F.title)}<div style="font:700 14px/1 ${BF};letter-spacing:.2em;color:${e.soft};margin-top:4px">${esc(F.year)}</div></div>`:logoBare(ctx,F,200,HH-52,DF,acc,e.dw,e.card)}`.

2. **The film's prop never prints.** Screen and PDF, lift ticket under the poster. The ticket shows the stock "ALL MOUNTAIN / Valid today only / No. 2". The film's prop (kind "receipt", "Paper Route Bill", "Amount due: two dollars", "Collector: the paperboy") is dropped. It is the best fan joke in the data and it is missing. "No. 2" on its own means nothing to a guest. Breaks rule 5. [layout] Cause: skilodge.js line 180, `pr2=F.prop&&/ticket|pass|stub|admission/.test(pk)?F.prop:null`, then lines 181 to 182 fall back to the stock title, lines and "LIFT TICKET" heading. Fix: always use `F.prop` when there is one, and take the heading from the kind when it is not a ticket: `const pr2=F.prop||null;` and `const tHead=pr2&&pk&&!/ticket|pass|stub|admission/.test(pk)?pk.toUpperCase():/lift|ski pass/i.test(tTitle)?"ADMIT ONE":pk==="pass"&&pr2?"LIFT PASS":"LIFT TICKET";`. The card then prints RECEIPT / PAPER ROUTE BILL / Amount due: two dollars. Collector: the paperboy. The number row already hides itself once "two dollars" carries the joke. Optional film data line that is truer to the scene (Wikiquote: "Four weeks, twenty papers, that's two dollars. Plus tip."): replace "Collector: the paperboy" (23) with "Four weeks, twenty papers" (25).

3. **Prep sheet misses 4 of the 9 printed dishes.** PDF pages 2 and 3 list 5 dishes (fries, fondue, rice bake, crêpes, citron pressé). The printed menu also sells Monique's mini croque monsieurs and the Burger joint double cheeseburger (the film's other dishes), plus the two house lines, Meatballs in grape jelly sauce and Ski lodge hot chocolate. None of these has a method or shopping on the Prep sheet. The phone menu does give the croque and burger methods ("As written, serves 4"), so the phone and the Prep sheet disagree. The house lines only say "A house standard, not part of tonight's cook". A host who wants to serve what the card sells has no ham, gruyère for the croques, chuck mince or buns on the list. [layout, shared app.js] Cause: app.js `fullMenu` (lines 1759 to 1784) adds extras and house lines to the printed card, while the comment there says "The prep sheet still cooks only the five". Fix: either add a short "Also on the card" block to the Prep sheet with the extras' methods and shopping (they already exist in films.json and on the phone), or give each house line a two-line method. Otherwise, mark extras on the printed card ("ask the kitchen") so a guest is not ordering something nobody cooked.

4. **The house starter costs as much as the dearest main, and prices climb down the starters.** Screen and PDF. Meatballs in grape jelly sauce is 3.50, the same as Mum's chicken and mushroom rice bake at 3.50. Monique's croques at 2.95 match the burger at 2.95. Starters run 1.95, 2.50, 2.95, 3.50 from top to bottom, so the cheapest dish sits at the top and a snack-size meatball dish is priced as a meal. A guest reading the card would notice. Partly against rule 8. [layout] Cause: skilodge.js line 63 prices every course on a rising ramp `(1+i*.15)`, so whatever lands last (the house line) is dearest. `tidyPrices` (lines 70 to 89) caps dessert under the mains but never caps starters under the cheapest main. Fix: in `tidyPrices`, after the dessert pass, push every starter below `Math.min(...V.m)` the same way (`while(V.s[i]>=minM)V.s[i]=down(V.s[i])`), and price a house line no higher than the dearest cooked dish in its own course.

5. **Mum or Mom on the same card.** Screen and PDF. The main reads "Mum's chicken and mushroom rice bake" while the snow report reads "Mom's strange dinners". This is an American film and the character is Lane's mother Jenny. [film] Cause: data/films.json, Better Off Dead M entry. Fix: "Mum's chicken and mushroom rice bake" to "Mom's chicken and mushroom rice bake" (same length).

6. **Two winks are characters, not scenes, under a heading that says "Scenes to watch for tonight".** Screen and PDF, snow report. "Roy Stalin, the rival skier" and "Monique, the French exchange student" are true (Wikipedia) but describe people, not moments. Better-known moments are missing. [film] Cause: data/film-flavour.json, Better Off Dead winks. Fix, both confirmed on Wikiquote or Wikipedia: "Roy Stalin, the rival skier" (26) to "Charles snorting the snow" (25), and "Monique, the French exchange student" (36) to "Monique faking she speaks no English" (36).

7. **Showtime cue not confirmed as worded.** Screen, PDF, Prep sheet and phone. "Serve the mains when Lane starts his shift at the burger joint." Wikipedia confirms Lane works at, and is fired from, a fast food job at Pig Burgers in front of Roy and Beth, who are there on a date. I could not confirm a scene of him starting a shift. [film] Cause: data/films.json, Better Off Dead "P". Fix with a confirmed moment that also names the place: "Serve the mains when Roy and Beth walk into Pig Burgers." (56 against 62). To match, the main could become "Pig Burgers double cheeseburger" (31 against 32) for the fan grin.

8. **Small spelling drift in the notes.** Screen and PDF. The fondue note says "Gruyere" and the croque note says "gruyère". The sweet is named "French crêpes" but its note says "Thin crepes". [film] Cause: data/films.json S and W notes. Fix: "Gruyere and Swiss melted in white wine..." to "Gruyère and Swiss melted in white wine..." and "Thin crepes with lemon..." to "Thin crêpes with lemon..." (same length).

9. **Run markers do double duty on the snow report.** Screen and PDF. The winks are bulleted with the green circle, blue square and diamonds that mean Starters, Mains, Sweets and Drinks on the card beside them, so it looks like each scene goes with a course. Minor, but a careful guest may look for a link. [layout] Cause: skilodge.js line 223 `MK=["s","m","w","d","d"]` and line 228. Fix: use one neutral marker (a small snowflake or plain white dot) for every report line.

## What I could not check
- Whether there is an on-screen moment of Lane starting a shift at Pig Burgers (Wikipedia only covers him being fired). Marked unsure, not wrong.
- Whether the paperboy actually chases Lane on his bike during the film. Wikipedia says Johnny "persistently hounds Lane" and is shown "bicycling towards them" at the end, which is close enough to call true, but I did not confirm a chase on a bike mid-film.
- The TMDB still (Lane and Monique on the Camaro at Dodger Stadium) matches the Wikipedia ending as far as I can tell from the image. I did not check its source.
- I did not open review-25 or the handoff notes, so I cannot say which of these were already raised.
- I did not trace why priceSense lands the burger on 2.95 rather than the 3.95 the layout's own ramp would give. The finding above stands on what prints.

### Fix log
Commit 6b10be06 on fix26/skilodge (worktree /home/claude/wt/skilodge).
1. Logo: when a poster is set (always, on this layout's left side), the header prints the film title in the display face with the year under it, sized down from 26px until it fits the box, so nothing is clipped. logoBare only runs when there is no poster. Checked on both films.
2. Prop: the film's prop always prints on the wire. The heading comes from prop.kind when it is not a ticket or pass (Better Off Dead prints RECEIPT / PAPER ROUTE BILL), and each prop line prints on its own row. The "No." row shows only on a ticket or pass. Better Off Dead prop lines now "Four weeks, twenty papers" / "Amount due: two dollars" (Wikiquote: Johnny, "Four weeks, twenty papers, that's two dollars").
3. Prep sheet covers five dishes only: not in scope per brief (planFive/planAll and fullMenu in app.js). Left for the lead.
4. Prices: tidyPrices now pushes every starter under the cheapest main, every house line under the cheapest cooked dish in its own course, then removes repeats. The layout then prints each course dearest first with house lines at the foot. Better Off Dead now reads starters 2.50, 1.95, 1.50, 0.95 (meatballs last), mains 3.50, 2.95, sweet 1.25, drinks 0.95, 0.50.
5. "Mum's" to "Mom's" on the rice bake and its vegetarian version (films, dish names, recipes, recipes2, diet).
6. Winks: "Roy Stalin, the rival skier" to "Charles snorting the snow"; "Monique, the French exchange student" to "Monique faking she speaks no English" (both Wikiquote/Wikipedia). Also "The paperboy chasing Lane on his bike" to "The paperboy chasing his two dollars" (Wikipedia: Johnny "persistently hounds Lane"), since a bike chase was not confirmed. The board heading is now "Watch for tonight" so it is neutral for character winks on other films (Hot Tub Time Machine has "Lou, Nick, Adam and nephew Jacob").
7. Cue now "Serve the mains when Roy and Beth walk into Pig Burgers." (Wikipedia: Lane fired at Pig Burgers in front of Roy and Beth on a date). Main renamed "Pig Burgers double cheeseburger" everywhere it sits.
8. Fondue note "Gruyère", crêpes note "Thin crêpes", and the crêpe method step in recipes and recipes2 now "Cook thin crêpes".
9. Snow report lines use one plain white dot, not the run markers.
Also: the two dash characters in the clean() regex in skilodge.js are now written as  to ,  so the file has no dash characters.

Shared code items for the lead
- Prep sheet cooks only five of the up to nine dishes on the card (finding 3), app.js fullMenu/planFive. Phone menu gives methods for extras, Prep sheet does not.
- Hot Tub Time Machine wink "The one-armed bellhop" is not on Wikipedia or Wikiquote (Crispin Glover is listed as Phil only). Not changed, as I could not confirm it either way. "The great white buffalo" is on Wikiquote, "Adam's fork in the eye" on Wikipedia.
- Gruyere without the accent still sits in Better Off Dead shopping lines (recipe ingredients), not on the printed card.

Owner decisions
- None.

Checks
- check-print-text "Better Off Dead (1985)" "Hot Tub Time Machine (2010)": PASS, 2 printed menus read.
- npm test: exit 0, all PASS.
- Rendered and viewed both films: /tmp/fix26-skilodge/*-p-1.png.

---

# review26b

## Arcade layout review: Snatch (2000)
**Score: 8.4 out of 10**

A good, clean card. The prize counter idea suits Turkish, who runs a slot machine shop in the film, and the sign "Fair Fights" is a nice dig given every fight in the film is fixed. The signed note under the poster is a close, accurate paraphrase of Turkish's closing narration (squeaky toy, undigested shoe, 86 carat diamond, still squeaking), and it prints with no quote marks, as a kind "note" should. Winks, the bet slip and the venue all check out. Prices obey rule 8, the logo is not boxed (the marquee prints SNATCH, 2000 because the poster carries the logo), and the Save PDF matches the screen with no grey boxes or lost borders. What holds it under 9: the printed card drops two of the film's seven dishes (East End pie and Avi's New York strip) while the phone menu still lists both with recipes, so the card a guest holds and the text on their phone disagree, and the mains course on the board is down to one dish. The right column also ends with a bare strip of about 94px above the Showtime line, just under the still threshold, and the high score table uses generic CPU and YOU where a fan touch was easy.

## Findings
1. **Two dishes missing from the printed card but present on the phone.** PDF and screen show 3 Quick Plays (sausages, cheese, eels), 1 Main Game (fry-up), 1 Bonus Round, 2 Refills. The phone text lists East End pie, mash and parsley liquor under Starters and Avi's New York strip and creamed spinach under Mains, each with a full method. Guests reading the phone will look for dishes the card does not have, and Main Games on the board looks thin with one item. [film] Cause: data/film-flavour.json line 11275, `"arcade": {"extras": false}` for Snatch, which triggers menu-formats/arcade.js line 184 to strip every card extra. This goes against the owner's "show all dishes, cook 5" rule. Fix: delete the `"arcade": {"extras": false}` block (lines about 11274 to 11276) so the extras print and the line 186 to 187 loop drops them only if notes would not fit. Re-render and check that the left column still prints every note in full; if it does not fit, the right column has room for the pie under Bonus Round's column split. If the owner wants the arcade to stay cooked-only on purpose, the phone menu (app.js phone builder) should then hide the same extras so the two match.

2. **Bare strip at the foot of the right column.** Screen: the tea note ends at about y=556 and the Showtime rule sits at about y=650, so roughly 94px of empty board under Refills (PDF same, scaled). The left column ends about 38px above the rule. Under the 100px still threshold so not a rule break, but it is the one spot on the card that looks unfinished. [layout] Cause: menu-formats/arcade.js lines 209 and 216 to 220. scSpare lands just under 100 so no still is placed, and scAdd caps the spread at 16px per gap, so most of the spare sits at the foot. Fix: either drop the still threshold on line 217 from `scSpare<=100` to `scSpare<=80` with dH min of 80, or raise the scAdd cap on line 220 from 16 to 24 so a short column spreads closer to its full spare height. Fixing finding 1 may also close this gap on its own.

3. **Builder's tea name wraps with a stub leader.** Screen and PDF: "Builder's tea, milk and three / sugars" breaks onto two lines and the dotted leader shrinks to three or four dots beside the 80 TIX, which reads as a misprint next to the tidy rows above. [film] Cause: data/film-house.json line 6459 onward, `d.n` is 36 characters, too long for the half-width column at this tier. Fix: replace `"Builder's tea, milk and three sugars"` with `"Builder's tea, three sugars"` (the note already says milk), or `"Builder's tea, milk, 3 sugars"` if the milk must stay in the name.

4. **High score table misses an easy fan grin.** Foot: 1. TUR, 2. CPU, 3. YOU. TUR is right (from the note's "by"), but CPU and YOU are the generic fallback. [film] Cause: menu-formats/arcade.js line 253 falls back when the film has no `arcade.scores`. Fix: add `"scores": ["TUR", "TOM", "MIK"]` to the Snatch `arcade` object in data/film-flavour.json (Turkish, Tommy, Mickey). The scores already hide 86 in the digits, which is a nice touch to keep.

5. **Showtime cue lands very late.** "Serve the mains when the dog swallows the diamond." The dog swallowing the diamond for real happens after Avi's shootout at the pawn shop, which Wikipedia places near the end of the plot, just before the final fight. Mains would go out with only the ending left. It also risks confusion with the earlier squeaky toy and Vinny's false claim that the dog swallowed it. [film] Cause: data/films.json, Snatch entry, field P. Fix (similar length): "Serve the mains when Mickey flattens Gorgeous George." I could not confirm the exact timestamps, so treat this as a judgement call.

6. **Prep sheet files cheese and black pudding under Dairy.** p-2 shopping list puts red Leicester, Wensleydale, vintage cheddar and 4 slices of black pudding under DAIRY, while data/recipes/snatch-2000.json tags them @Deli. Black pudding under Dairy will send a shopper to the wrong fridge. [app, not layout] Cause: the Prep sheet appears to fold the Deli aisle into Dairy; I could not find the mapping in app.js. Fix: keep a Deli heading on the shopping list, or map Deli to Meat for black pudding.

Checked and fine: note true to plot (Turkish's closing narration on Wikiquote: "The vet found a squeaky toy, an undigested shoe, and an eighty-six carat diamond lodged in the dog's stomach ... Still didn't shut it up"); 86 carats (the film's own line per Wikiquote; Wikipedia's plot says 84, so the card follows the film); venue (Turkish is a slot machine shop owner per Wikipedia); bet slip (Brick Top demands Mickey throw the fight); winks (Franky Four Fingers, Brick Top's pigs, Bullet Tooth Tony, the squeaky toy dog all confirmed); prop under BET SLIP label; winks in a WATCH FOR box; prices dearest first, house lines at the foot, no repeats, dessert 110 under main 220; all dish notes describe food at one size, nothing clipped; every ticked dish (cheese, sausages, fry-up, banoffee, whiskey ginger) is on the Prep sheet with its shopping, and butter totals 160g correctly.

## What I could not check
- Whether the card still fits every note in full once the two extras come back (finding 1); I did not re-render.
- Exact film timestamps for the cue in finding 5.
- Where app.js folds the Deli aisle into Dairy on the Prep sheet.
- Whether the poster used is the one TMDB serves live; I judged from the proof only.

### Fix log
1. Missing dishes: removed Snatch's arcade.extras:false (ops file), so the pie and Avi's steak print again. To fit all seven at full notes, renamed "East End pie, mash and parsley liquor" to "Pie, mash and parsley liquor" and "Avi's New York strip and creamed spinach" to "Avi's New York strip steak" (names change in films.json and dish-names together), and shortened the steak, fry-up and banoffee notes to one line each (all still describe the food). Card now shows 4 Quick Plays, 2 Main Games, 1 Bonus Round, 2 Refills, matching the phone. Layout: when extras must come off for notes to fit, arcade.js now takes them from the course with the most dishes first (ties last course first), so a course is never left thin while another keeps four. No arcade film drops any today.
2. Bare strip: arcade.js default still now starts at the estimated spare (90px minimum) and grows with flex into the column's real spare height, capped at 240px, and shows whenever the estimate passes 100px. The line estimate runs long, so the old fixed height left real gaps. Snatch now gets a boxing still at the foot of Quick Plays; right column ends about 25px above the Showtime rule. Dazed and Confused's still now fills its column too. Toy Story and Wreck-It Ralph use arcade.panel and are unchanged (Toy Story checked before and after, identical).
3. Tea wrap: house drink renamed to "Builder's tea, three sugars", note "Strong tea brewed in the pot, milk and three sugars". One line, full leader.
4. High scores: Snatch arcade.scores ["TUR","TOM","MIK"]; table now reads TUR, TOM, MIK with the 86 digits kept.
5. Cue: now "Serve the mains when Mickey knocks out Gorgeous George." (Wikipedia plot: George is knocked out by Mickey early, when Tommy goes to buy the caravan.)
6. Deli folded into Dairy on the shopping list: app.js, not touched. See below.

Shared code items for the lead
- Prep sheet shopping list folds @Deli items (red Leicester, Wensleydale, black pudding) under DAIRY. Keep a Deli heading, or map black pudding to Meat. In app.js shopping list aisle mapping.

Owner decisions
- None new. Five-dish Prep rule unchanged; ticked dishes are the same five.

Checks
- check-print-text, all four arcade films (Snatch, Toy Story, Wreck-It Ralph, Dazed and Confused): PASS, no dish name or note hidden, Save PDF clean.
- npm test: PASS.
- Files: menu-formats/arcade.js, audit/ops/snatch-2000-review-26b.json, plus data rebuilt by card-ops/build-data (films.json, film-flavour.json, film-house.json, dish-names.json, dish-notes.json, recipes/snatch-2000.json, data/film/snatch-2000.json, films.js, index.html, sw.js).

## Bowling layout review: Kingpin (1996)

**Score: 8.6 out of 10**

This is a strong card. It reads as a bowling score sheet: a BOWLER column with the courses pencilled in, a 1 to 10 frame strip, each price in its own little ball box, LANE 17 in the corner box (seventeen years on, which is a nice touch), and a TOTAL of 300. Every fact I could check holds up. The National Bowling Stadium in Reno is where the film's final was shot. "I took the liberty of milking your cow for you" is Roy's real line. The 1979 Odor-Eaters final, the rubber hand, Big Ern's comb-over and "Munsoned" all come from the film. The ticket prop prints under TICKET with both lines. Every dish note describes the food and prints in full at one size. The poster carries the logo, so the header prints KINGPIN and 1996 instead, which is right. The menu food fits the film: Amish chicken and noodles, shoofly pie, a milkshake for the milk gag, and a "gravy train" roast that nods to Big Ern. Four things hold it under 9. The Save PDF prints a heavy navy frame round the card that the screen doesn't have. The lane note and the showtime cue tell the same milking joke twice. Every course runs cheapest first, against the "dearer at the top" rule. And there is some loose dead space in the Watch for row and the lane notes box.

## Findings

1. **The Save PDF puts a navy frame round the card that the screen doesn't show (PDF).** [layout] On p-1 the cream score sheet sits inside a navy border about 6 mm wide on the left, right and bottom. On screen the paper runs to the edge on those three sides. It looks like a different design and uses a lot of ink. Cause: the header band is a solid navy block that runs the full width along the top edge (menu-formats/bowling.js line 159, `left:0;top:0;width:${W}px`). The export picks the most common edge colour (app.js line 3569, `edgeColour`). The solid navy strip outvotes the grainy, vignetted cream on the other edges, so app.js lines 3603 to 3604 flood the whole A4 bleed in navy. Fix: inset the band so all four edges of the face are paper, for example `left:${M-10}px;top:10px;width:${W-2*(M-10)}px;height:${HH-10}px` with the header contents shifted 10px down. Or have the export prefer the left and right edge colour when the top edge is a single solid band.

2. **The lane note and the showtime cue tell the same joke (screen, PDF, phone).** [film] LANE NOTES quotes "I took the liberty of milking your cow for you." and the Notes row says "Serve the mains when Roy milks what turns out to be a bull." It's the same gag twice on one card, and the note gives away the set-up the cue is building to. Both lines are accurate (Wikiquote: Roy says the line, Mr Boorg answers "We don't have a cow. We have a bull."). Cause: data/film-flavour.json, "Kingpin (1996)" note. Fix: keep the cue and swap the note for Big Ern's real line, which also lands the "Gravy train pot roast" name: text "You're on a gravy train with biscuit wheels." by "Ernie McCracken", kind "quote" (44 characters against 47; source: Wikiquote, Ernie McCracken section).

3. **Every course prints cheapest first (screen, PDF).** [layout] Snacks run 2.50 then 2.95, and Hot Plates run 4.95 (chicken and noodles) then 5.50 (pot roast). Read strictly, rule 8 wants the dearer dish at the top of its course, which here means the first frame. Cause: menu-formats/bowling.js line 65 prices each dish `BASE*mult*(1+i*.15)`, so price always climbs with position. The fix-up on lines 69 to 79 only moves dishes on the DEAR list (lobster, steak, prawns and so on), and none are on this card. Fix: at the end of `prices()`, before `return ps`, sort each course's prices high to low against the dish order (`P.sort((a,b)=>val(b)-val(a))`). Or list the dearer dish first in the menu. If the owner reads rule 8 as being about luxury dishes only, this finding drops.

4. **Dead space in the Watch for row and the lane notes box (screen, PDF).** [layout] The Watch for row allows about 40px more than its three handwritten lines need. The LANE NOTES box shows two empty ruled lines (about 60px) under a two-line quote. The Chilli cheese fries frame also has a blank lower half. None of these passes the 100px still rule, but together they make the lower half look under-filled. Cause: bowling.js line 194 sizes the winks row at 15px per character for 30px Reenie Beanie, and Reenie Beanie is narrower than that. NH is fixed at 150 (line 184) whatever the note length. Fix: estimate the winks row at about 12.5px per character (`*12.5/(GW-LBL-24)`). Set NH from the note's line count (for example `NH=Math.max(104, 40+lines*nS*1.05)`) so the sheet takes the height back.

5. **The shopping list is missing white pepper (Prep sheet).** [film] Step 4 of Amish chicken and noodles says "Season well with salt and plenty of white pepper", but white pepper isn't on the shopping list, and it's not a pantry staple in most Australian kitchens. Cause: data/recipes/kingpin-1996.json and data/films.json, the shopping list for that main. Fix: add "white pepper@Pantry" to that dish's shopping list.

Checked and fine: all five ticked dishes (fries, pretzels, chicken and noodles, shoofly pie, milkshake) are on the Prep sheet and the shopping list, and the quantities add up (brown sugar 160g, butter 120g, milk 700ml, cream 350ml, bicarb 65g, 2 eggs). Gravy train pot roast is printed but not cooked, which follows the owner's rule. Sweets sit under Hot Plates. No price repeats inside a course. Fixed headings (BOWLER, Watch for, Notes, LANE NOTES, TOTAL) are neutral. Five winks print in a labelled row. No clipped words, grey boxes or black blocks apart from finding 1. The phone menu matches the card's dishes and notes.

## What I could not check

- No house lines print on this film because film-house.json has `"fit": []`. So I couldn't judge rule 8's "house lines at the foot" on this layout. A chow chow board in the Snacks row would make three frames and squeeze the notes, so leaving it off looks deliberate.
- I couldn't confirm that the 1996 snack bar prices (milkshake 1.50, pot roast 5.50) match real National Bowling Stadium prices. They look believable for the era.
- "Lane 17" comes from film-flavour "number". I took it as a nod to "seventeen years later" (Wikipedia plot) but couldn't confirm the intent.
- The on-screen capture is half size, so I compared it with the PDF for layout and colour only, not fine type.

### Fix log
1. Navy PDF frame: the header band is now a rounded panel inset 26px (M) from the top and both sides (menu-formats/bowling.js), so the outer ring the export samples (about 19 to 25px in) is paper on all four sides. The Save PDF now bleeds in the paper colour, no navy frame. Header contents moved inside the band, sheet and poster start 2px lower. app.js untouched.
2. Repeated milking joke: lane note swapped to "You're on a gravy train with biscuit wheels." by Ernie McCracken, kind quote (checked on Wikiquote, Kingpin_(1996_film), Ernie McCracken section). Ops file audit/ops/kingpin-1996-review-26b.json. The by-line no longer splits across lines (nowrap). Cue kept.
3. Prices cheapest first: bowling.js now moves any luxury (DEAR) dish to the front of its course, then sorts each course's prices high to low. Kingpin prints Snacks 2.95 then 2.50, Hot Plates 5.50 then 4.95, Sweets 2.25, Drinks 1.50. No repeats, dessert under mains.
4. Dead space: winks row estimated at 12.5px a character (was 15), so it now holds its three lines with no spare band. Lane notes height comes from the quote's line count, with a floor of 124 for the total box (300 dropped from 64px to 56px to fit). The sheet takes back about 26px. The fries frame still has some blank space beside the taller pretzels frame (same row height), under the 100px rule.
5. White pepper: added "1 tsp white pepper" (Pantry) to Amish chicken and noodles in data/recipes2/kingpin-1996.json and data/recipes/kingpin-1996.json. It now shows in the Prep sheet's YOU NEED list and the shopping list (Pantry), and in the phone recipe.

Shared code items for the lead
- data/films.json M[0] shop list for Kingpin still lacks white pepper (card-ops cannot add a list item and films.json is shared). The Prep sheet and phone read the recipe files, which now have it.
- The PDF bleed now takes the vignetted paper edge, which is a touch greyer than the paper centre. A light grey, not a frame; fine to leave.

Owner decisions: none.

check-print-text "Kingpin (1996)": PASS. npm test: pass (exit 0).

## Clubhouse layout review: Happy Gilmore (1996)
**Score: 8.4 out of 10**

This is a good match of layout and film. A golf scorecard menu for Happy Gilmore is the obvious right call, and it reads like the real thing: Hole, Dish, Yds and Par columns, Front Nine, The Turn, Back Nine and 19th Hole bands, a Tot line with yards walked, a pencil ring on a par, and a Marker's Note signed "Chubbs" in pencil. Every dish note describes the food and prints in full at one size. There are no empty gaps, no logo box (the cover prints the title and year in club type over the poster), the badge prop sits under its kind label, and all five winks are in a labelled box. Every film line I checked is true to the film, and "It's all in the hips." is Chubbs's real line. The Save PDF page matches the screen, with no grey boxes, black blocks, lost borders or clipped words. One thing keeps it under 9: the house starter, Bacon and egg breakfast muffins, sits at the foot of the Front Nine at 4.50, which makes it the dearest starter on the card, sitting under a 3.95, a 3.50 and a 2.95. A guest reading down the par column will see prices fall and then jump back up at the bottom. That breaks rule 8. The rest are small polish items.

## Findings

1. **House starter is the dearest starter but prints at the foot (rule 8).** [layout] Screen, PDF and the audit faces all show Front Nine pars 3.95, 3.50, 2.95, then 4.50 for the house muffins on hole 4. Cause: in `clubPrices`, menu-formats/clubhouse.js line 153, a house line only gets moved off a price that's already taken, and it always moves upward with `bump`. The muffins start at 3.95, clash with the sliders' 3.95, and get bumped to 4.50. Desserts get a cap against the cheapest main (line 165), but nothing caps a house line against its own course. Fix: in the house-line pass on line 153, before the clash loop, cap the value under the cheapest priced non-house row in the same course, then step it *down* off any taken price, e.g. `const lo=Math.min(...order.map(i=>pval(p[i])));if(order.length&&v>=lo)v=rnd(lo*.85,p[i]);` and use a downward step (`v=Math.max(.05,v-.45)` then `rnd`) inside the `while`. For this film the muffins would print at about 2.50, under the 2.95 biscuits.

2. **Two holes both numbered 19.** [layout] Screen and PDF, 19th Hole band: both the shandy pitchers and the chocolate milk show hole "19". No real scorecard repeats a hole number, and it reads like a mistake rather than a joke. Cause: `holeOf` at line 237 returns 19 for every drink (`:19`). Fix: number the bar as 19, then 19A, 19B and so on, or 19 then 20 ("the 20th hole" is a known golf joke too): `k==="d"?(i?"19"+String.fromCharCode(64+i):19)`, or simply `19+i`.

3. **Showtime cue says "beer" but the card pours a shandy.** [film] Screen and PDF cue line, Prep sheet foot on both pages, phone. The only grown-up drink on the card is "Happy place lemon shandy pitchers", so "Serve the beer" points at a drink the guest can't find on the menu. The scene itself checks out: Wikipedia has Happy hustling golfers at a driving range, where he meets Chubbs. Cause: data/films.json entry 267, field P. Fix (near same length): "Pour the shandy when Happy starts hustling golfers at the driving range."

4. **Tot line leaves the Par cell blank.** [layout] Screen and PDF, foot of the scorecard: "TOT | 9 holes played | 3930 | (blank)". A real card totals par as well as yardage, and the blank cell looks unfinished next to the yards total. Cause: `outRow` line 248 draws an empty Par cell. Fix: either print the summed par (39.30 for this film) in the Par cell to go with the yards joke, or merge the cell into the Yds total so there's no empty box.

5. **Phone menu lists the starters in a different order to the printed card.** [layout] Phone text: Chubbs's cheese balls, Grandma's biscuits, Slap shot sliders, muffins. Printed card: sliders first (dearest first, from `clubOrder` line 133). The phone also calls the course "Sweets" where the card says Dessert. A guest flicking between the phone and the printed card will notice the order doesn't match. Cause: `clubOrder` only reorders inside the layout (line 208). The phone menu is built from the film's raw order in shared code. Fix: export the card order (`items` after `clubOrder`) on the returned object, or apply the same dearest-first, house-last sort when the phone menu is built, so all three outputs agree.

6. **Scrappy tone hardly shows.** [layout] Screen and PDF. film-format.json sets tone "scrappy" (wear .55, tilt -3), but the card prints clean and square. `t.tilt` is never used in clubhouse.js and wear only drives grain opacity (lines 196 and 255). For Happy Gilmore a touch of rough handling would make fans grin more: a slight tilt on the pencil ring or the Marker's Note box, or a scuffed edge. This is a nice-to-have, not a fault.

7. **Prep sheet page 2 is mostly empty.** [layout, shared Prep sheet] /tmp/proof/happy-gilmore-1996-p-3.png carries only the shandy recipe in the top third, and the rest of the page is blank. That's not clubhouse.js code, but it prints with this card. Fix: let the fifth recipe flow into the spare space on page 1, or set page 2's single recipe across the full width with the shopping list.

Checked and fine:
- Prep sheet: all five ticked dishes (cheese balls, biscuits, meatloaf, lemon bars, shandy) are cooked, and every ingredient is on the shopping list with the totals adding up (flour 540g = 300 + 240, eggs 5 = 1 + 4, lemons 8 = 4 + 4).
- Sliders and footlong sitting unticked is the owner's rule.
- Mains are above all starters, dessert is under the mains, and there are no repeat prices within a course.

Film lines:
- Venue "Tour Championship Grill" and sign "Winner gets the gold jacket": true. Chubbs says "maybe you'll win the Tour Championship. Get that gold jacket that I never got" (Wikiquote).
- Quote "It's all in the hips." by Chubbs: real, said by Chubbs (moviemistakes.com quotes page).
- Winks: Bob Barker and "The price is wrong" (Wikiquote and Wikipedia), Chubbs's hand taken by an alligator (Wikipedia), the TV tower falling onto the final green (Wikipedia), Shooter stealing the gold jacket and being caught by the crowd (Wikipedia, Wikiquote), the hockey slap shot swing (Wikipedia). All true.
- Prop "Tour Qualifier": true to the plot, since winning the Waterbury Open earns an automatic tour spot (Wikipedia). "Slap shot approved" is an invented badge line, harmless.
- "Sponsor's" footlong: true, Happy becomes a Subway spokesman (Wikipedia).

## What I could not check
- Whether the line behind "Happy place" in the shandy's name ("go to your happy place") is spoken in those exact words. It's only a dish name, not a quote, so it isn't marked down.
- Whether Grandma bakes biscuits or meatloaf in the film. Neither is a claim line, they're just named for her.
- That the Sweet Onion Chicken Teriyaki sub existed in 1996 (it probably came later). It's a dish name, not a claim, and a guest is unlikely to mind.
- Whether the web fonts (Cormorant SC, Libre Franklin, Nothing You Could Do) are embedded in the PDF. The PDF font list shows only base fonts, so the face page looks like it's printed as an image. It matches the screen.

### Fix log
1. House starter priced at the foot: clubPrices now caps every house line under the cheapest non-house dish in its course (85% of it, then a new `down` step that walks one printed price lower off any taken price). Happy Gilmore muffins now 2.50 under the 2.95 biscuits; Caddyshack and Goldfinger still fall down every course.
2. Repeated hole 19: holeOf numbers the bar 19A, 19B and so on when it pours more than one drink, plain 19 for one.
3. Showtime cue: ops file audit/ops/happy-gilmore-1996-review-26b.json sets it to "Pour the shandy when Happy starts hustling golfers at the driving range." (card, Prep sheet and phone all pick it up).
4. Blank Par cell on the Tot line: outRow now prints the column's par total (the prices added up, in the card's price format), 37.30 for Happy Gilmore, 14.15 for Goldfinger.
5. Phone order and "Sweets" label: shared code (the phone menu is built from the film's raw order in app.js). Not edited. Written up below.
6. Scrappy tone: t.tilt now tilts the Marker's Note box (tilt x .3, so -0.9 degrees on scrappy, with a pencil-shadow edge) and adds to the pencil ring's rotation. Clean tones (glossy, grand, eerie, tense) stay square.
7. Prep sheet page 2 mostly empty: shared Prep sheet code. Not edited. Written up below.

Shared code items for the lead
- Phone menu order: clubhouse sorts each course dearest first, house last (clubOrder). The phone text menu in app.js uses the film's raw order and calls the course "Sweets". Suggest the layout return its card order (e.g. `order:{s:[names],...}` on the returned object) and the phone builder use it when present, plus label the course from the card (Dessert) not a fixed "Sweets".
- Prep sheet: when page 2 carries one recipe only, let it flow onto page 1's spare space or set it full width beside the shopping list.

Owner decisions
- None new. Sliders and footlong unticked stays the five-dish rule.

Checks
- check-print-text, Happy Gilmore, Caddyshack, Goldfinger: PASS (3 printed menus read, nothing hidden, no html2canvas-dropped shapes).
- npm test: PASS.
- Rendered and looked at the Save PDF page of all three clubhouse films.

## Deli layout review: Rumble in the Bronx (1995)
**Score: 8.7 out of 10**

This is a good fit. A take-a-number deli counter inside "Elaine's Supermarket" is the right object for a film whose fights keep wrecking that shop, and the board reads like the real thing: red NOW SERVING sign showing 95, a torn red ticket showing 96, push-in capitals with dotted leaders, the poster taped up full height, and a till receipt for the prop. Every claim on the card checks out against the Wikipedia plot, including the cue, the venue, all five winks and the note. All dish notes describe food and print in full at one size. The PDF is clean, with no grey boxes, lost borders or clipped words. Every ticked dish is on the Prep sheet and the shopping list, and the quantities add up. It stays under 9 because of small things a sharp guest would spot: lobster at $7.95 looks cheap even for 1995, there is a band of dead board above the Showtime line and blank paper on the receipt, the ticket only carries generic filler, and the almond jelly recipe has one wrong instruction.

## Findings

1. **Lobster priced like a takeaway special.** PDF, centre board: GINGER AND SPRING ONION LOBSTER NOODLES 7.95, only $3 above sweet and sour pork at 4.95. The order is right (dear dish at the top of Hot Plates, house lines at the foot, no repeated prices, dessert under the mains). But a Bronx Chinese restaurant in 1995 would charge well over that for lobster with ginger and shallot, often "market price". I am unsure of the exact 1995 figure. [layout] Cause: menu-formats/deli.js line 65, `DEARX={s:1.5,m:1.75}`, applied at lines 89 to 90 on the 1990s base of 4.5 (line 49). Fix: raise the main premium to about 2.6 for the 1980s era on (`DEARX={s:1.5,m:ei>=4?2.6:1.75}`, worked out inside `prices`). That gives roughly 11.95 here and still keeps it top of its course.

2. **Dead board above the Showtime line, blank paper on the receipt.** PDF: about 75px of empty board between the last drink note (Hong Kong lemon iced tea) and the "Showtime:" line, and about 60px of blank receipt between "Elaine" and "Prices subject to change". Both are under the 100px rule, so this is not a rule break, but together they make the bottom third look unfinished. [layout] Cause: deli.js line 248 pins the cue to the bottom of the menu box (`top:${MY+MH+6}px`), and line 241 caps the spread at 30px per course, so whatever is left over sits above the cue. The receipt's note size is picked from a short list that tops out at 20px (line 217). Fix: put the cue straight under the last course inside the menu box and hand the leftover height to the course gaps (raise the cap at line 241 to 40). Let the receipt note step up to 22px when there is room (`[22,21,20,19,18,17,16,15]`).

3. **Ticket carries only generic filler.** PDF, top right: "TAKE A NUMBER / NEXT IN LINE / Please wait to be called". Because the prop is a receipt, it goes to the receipt, and the most prominent red box on the board says nothing about the film. [layout] Cause: deli.js line 187, the fallback `tTitle="Next in line"` and `tLines=["Please wait to be called"]`. Fix: when the prop is not ticket-like, use the film's tagline (`F.f.T`, here "New York welcome. Hong Kong kicks.") as the ticket line in place of "Please wait to be called", and keep NEXT IN LINE as the title.

4. **Almond jelly recipe step is wrong.** Prep sheet, page 3, step 5: "Serve in bowls with lychees and mandarin segments in their syrup." The mandarins are fresh (shopping list "2 mandarins"), so they have no syrup. [film] Cause: data/recipes/rumble-in-the-bronx-1995.json, the jelly "how" text "Serve in bowls with a tin of lychees and mandarin segments in their syrup." Fix, same length: "Serve in bowls with lychees in their syrup and fresh mandarin segments."

5. **Shopping list aisle and pickle lines.** Prep page 2: sauerkraut is listed under PANTRY even though the data tags it @Deli. Dill pickle appears twice ("1 dill pickle" and "4 slices of dill pickle, to garnish") when you only need to buy one jar. [layout, shared Prep builder in app.js, not deli.js] Fix: honour the @Deli tag in the shopping grouping, and merge ingredient lines that share a base item into "1 jar dill pickles".

6. **Phone menu order does not match the printed card.** Phone text lists Hovercraft sweet and sour pork before the lobster noodles, while the printed board puts lobster first. Minor, and it comes from shared code, not deli.js. [layout] Fix: apply the same dear-first ordering (deli.js line 235) in the shared phone menu builder.

Checked and fine: venue "Elaine's Supermarket" (Bill sells the supermarket to Elaine). The cue (the bikers trash Elaine's supermarket after spotting Keung with Nancy). Winks: the hovercraft on the golf course where White Tiger is playing, fights in the supermarket, Elaine buying the store, diamonds in the cushion used for Danny's wheelchair, Tony as the bikers' leader. Note kind "note" in Elaine's voice, true to the plot. Prop under its own SUPERMARKET RECEIPT label with its lines. Winks shown in a labelled SCENES TO SPOT box (five). No logo box, since the poster carries the logo. Headings are neutral (Starters, Hot Plates, From the Case, Drinks).

## What I could not check
- What lobster actually cost in a Bronx Chinese restaurant in 1995 (finding 1 is judgement, not sourced).
- The on-screen card, since there is no screen capture for deli. I judged only the Save PDF and the p-1 proof, so screen against PDF parity is unchecked.
- Whether the phone text's run-together lines are how it really shows on a phone or just how the capture was saved.

### Fix log
1. Lobster price: menu-formats/deli.js now uses `dearX(ei)`, mains premium 2.6 from the 1980s on (1.75 before). Lobster noodles print 11.95, still top of Hot Plates, house lines last, no repeats, dessert under mains.
2. Dead board and blank receipt: the Showtime cue now sits inside the menu box straight under the last course (no longer pinned to the foot), course gap cap raised from 30 to 40, receipt note sizes now step up to 24px ([24..15]). Proof: cue ends level with the poster foot, receipt gap under "Elaine" about 35px.
3. Ticket filler: when the prop is not ticket-like, the ticket line is the film's tagline (F.f.T, dry for family films), falling back to "Please wait to be called". Rumble prints "New York welcome. Hong Kong kicks." under NEXT IN LINE.
4. Almond jelly step: fixed in data/recipes2 (both the main and the vegetarian versions) to "Serve in bowls with lychees in their syrup and fresh mandarin segments." and the matching "how" text in data/recipes.
5. Shopping list: fixed in data/recipes2 for this film: sauerkraut aisle set to Deli, and the two pickle lines merged into one "1 jar dill pickles, some chopped, some sliced" (Deli), main and vegetarian. Prep page 2 now lists both under DELI. The general merge-by-base-item rule is shared code, written up below.
6. Phone order: shared code, written up below, app.js not touched.

Shared code items for the lead
- Phone menu builder (app.js phoneView path) should apply the same dear-first order as deli.js line 235 (dear dishes first in each course, house lines last), so the phone text matches the printed card.
- Prep shopping list could merge lines that share a base item (for example "dill pickle, chopped" and "slices dill pickle") into one buy line. Fixed by data for Rumble only.
- Not in scope, noted: a film with a very short quote would leave blank receipt paper on deli (seen when stress testing Superman and The Mask on deli temporarily). No film is on deli today, so nothing prints this way.

Owner decisions
- Venue kept as "Elaine's Supermarket". Rumble stays on truck in data/film-format.json (proofed on deli temporarily, put back before commit).

Checks
- check-print-text "Rumble in the Bronx (1995)": PASS on deli (temporary) and PASS on truck after putting it back.
- npm test: pass (exit 0, no FAIL lines).
- Commit 81c2d2d2 on fix26/deli.

## Dimsum layout review: Men in Black 3 (2012)
**Score: 8.6 out of 10**

This is a good card. Wu's Chinese Restaurant is the right venue: it's the opening scene, Mr Wu is a real character (Keone Young), and the sign borrows K's real order ("Shrimp and bok choy") plus a nod to the spiky alien fish. The quote is J's real line from that same scene, word for word (Wikiquote), so a fan gets three Wu's jokes on one card. The tick sheet reads like a real yum cha order sheet: lettered row numbers, pen ticks, a table number in pen and a trolley stamp. Every note prints in full at one size. Prices step down within each course, house lines sit at the foot and the sweet sits under the mains. The Save PDF matches the screen exactly, with no grey boxes, lost borders or clipped words. Every ticked dish is on the Prep sheet and the shopping list. All five winks, the ticket date (J lands on Tuesday 15 July 1969), Coney Island and the pie cue check out. Four things keep it under 9. "Table 69" is printed in big blue pen. A "Tea and Drinks" heading sits over a list with no tea. The dishes are mostly American 1969 diner food on a dim sum sheet, with only the dumplings and the house crab rangoon reading as Wu's. The prop label says "ticket" twice.

## Findings

1. **"TABLE 69" in big pen at the top right of the order sheet (screen, PDF).** [layout] The number comes from film-flavour `number: "1969"` (menu-formats/dimsum.js line 104), and line 229 prints `F.num.slice(-2)`. A good share of adult guests will snigger at a 44px handwritten "69" before they read anything else, and a family table will get the giggles. It's a cheap laugh the film never makes, and it costs the card its polish. Fix: on line 229, print the whole number when it is four digits or fewer (`F.num.length<=4?F.num:F.num.slice(-2)`). "1969" in Caveat fits the 70px underline with a small width bump, and it reads as the year J jumps to, which is a better nod. If the two-digit look must stay, add a guard so a number ending in 69 prints in full.

2. **"Tea and Drinks" heading over a martini and champagne (screen, PDF).** [layout] This is a fixed label at dimsum.js line 195, and it's only replaced by `fl.drinksHeading` (line 113). Neither drink here is tea, so the heading promises something the card doesn't serve. That's a small rule 6 slip, since a fixed heading should be neutral. Fix: in the layout, use "Tea and Drinks" only when a drink name or note matches `/\btea\b/i`, else plain "Drinks". For this film you could also set film-flavour `drinksHeading: "Tea and Drinks"` to `"Bar Drinks"`.

3. **The menu reads as a 1969 American diner on a Wu's yum cha sheet (screen, PDF).** [film] Hot dogs, a walnut cheese ball, meatloaf, cheeseburgers and apple pie fill "Small Plates" and "Kitchen Specials". Only the dumplings and the house crab rangoon belong to Wu's. The A1 name is also generic and wastes the venue joke. Fix (films.json, S, "Chinese restaurant dumplings", 28 characters): `Mr Wu's pork prawn dumplings` (28 characters). The note already says pork, prawn and ginger, so the recipe still matches. Optional for later: swap one starter for K's real order, shrimp and bok choy.

4. **The ticket box says "TICKET" over "Time Jump Ticket" (screen, PDF).** [film] The label comes from prop.kind (rule 5, correct), so the title repeats the word. It reads a bit flat next to the rest of the card. Fix (film-flavour prop.title, "Time Jump Ticket", 16 characters): `Jump Back to '69` (16 characters). The lines "Destination: July 15, 1969" and "Return: present day" stay as they are. July 15 is confirmed: the elevator man tells J "The 15th... July... 1969".

5. **1969 prices (0.40 to 2.95) on a restaurant the film shows in 2012 (screen, PDF).** [layout] The era is set to 1960s in film-format, so the paper and prices follow 1969 while Wu's scene is present day, and the title block prints "2012" right above it. Most guests will take it as the time-travel joke, so I only marked this down lightly. No fix needed unless the owner wants Wu's to price in 2012 money.

6. **Small Prep sheet and drinks nits (PDF p-2, p-3).** [layout] "salt" has no quantity in the shopping list (Pantry). An espresso martini (a 1980s drink) sits next to "a wide sixties coupe" on a card that leans on 1969. Neither is a guest-facing fault on the menu itself. Fix: give salt a quantity ("1 tsp salt" to match the method). Leave the martini, since "Black suit" sells it.

## Checked and right
- Venue: Mr Wu, "an alien who owns a Chinese restaurant" (Wikipedia cast list). The Wu's scene and K's "Shrimp and Bok Choy" order are on Wikiquote.
- Quote: "Earth people get Earth fish. Real Earth fish." is said by J to Wu (Wikiquote), and the card credits Agent J. Correct.
- Winks: Boris escapes "Lunar Max" prison on the Moon. Griffin "can view all possible outcomes". The Apollo 11 launch. The jump off the Chrysler Building. Young K arrests J on arrival (Wikipedia and Wikiquote). All right.
- Cue and dish names: young K's "We need pie" scene with J is on Wikiquote. Young K tazes J at Coney Island (Wikiquote), so "Coney Island hot dogs" is earned.
- Logo rule: the poster carries the MIB3 logo, so the header prints the title and year in type. Correct.
- Prices: dearest first in each course, house lines last, no repeats, sweet 1.50 under the cheapest main 1.75.
- Gaps: the grid fills the sheet, and only about 15px sits above the Showtime line. No still needed.
- Prep: the ticked dishes (A1 dumplings, A3 hot dogs, B1 meatloaf, C1 pie, D1 martini) are exactly the five cooked dishes. Every ingredient is in the shopping list. The cheese ball and cheeseburgers sit unticked, as the owner's rule intends.
- Phone text: complete. House lines are marked "A house standard, not part of tonight's cook". The cue matches.

## What I could not check
- Whether the pie scene takes place in a "diner" exactly. Wikiquote has the pie dialogue and Griffin at the next seat, but it doesn't name the place. I'm fairly sure, but unconfirmed, so I left the cue alone.
- How the Caveat "1969" fits the table underline (finding 1). I didn't render it because the repo is read-only for this review.
- Colour accuracy on a real printer. I judged from the PNG proofs only.

### Fix log
1. TABLE 69: left exactly as it prints, by owner decision (coordinator message). The table number code and the film's number are unchanged.
2. Drinks heading: menu-formats/dimsum.js now prints "Tea and Drinks" only when a drink name or note on the card says tea, else "Drinks". MIB3 now reads "Drinks"; Rush Hour (jasmine tea martini, chrysanthemum tea) keeps "Tea and Drinks".
3. Wu's menu: A1 renamed "Mr Wu's pork prawn dumplings" (card, recipes, recipes2, diet all follow). The walnut cheese ball (unticked extra) is replaced by "Agent K's shrimp and bok choy", K's real order at Wu's ("Shrimp and Bok Choy", Wikiquote), with a new note, method and nine-item shopping list. Starters are now dumplings, shrimp and bok choy, hot dogs (Coney Island, earned) and the house crab rangoon. Ticks unchanged: A1, A3, B1, C1, D1 match the five Prep sheet dishes.
4. Ticket: prop title is now "Jump Back to '69" (label TICKET, lines unchanged). Also flows to the kit tickets.
5. 1969 prices on a 2012 scene: no change, as the review asked.
6. Salt: recipes2 already holds "1 tsp salt" for the meatloaf and the Prep method prints "1 tsp salt"; the shopping list drops the quantity in shared code (see below). Espresso martini left, as the review asked.
7. Extra (Rush Hour, rendered and checked): the two house notes lost their stray full stops so they match the other notes.

Shared code items for the lead
- Shopping list (app.js) prints "salt" with no quantity even though recipes2 gives q 1, u tsp. Looks like salt is treated as a staple and its amount dropped. Same will hit Rush Hour's salt.
- Prep sheet cooks five dishes only (owner's rule), so the cheeseburgers and shrimp and bok choy stay off it, as intended.

Owner decisions
- Keep "TABLE 69" on Men in Black 3 exactly as it prints now.

Checks
- check-print-text "Men in Black 3 (2012)" "Rush Hour (1998)": PASS (2 printed menus read, nothing hidden, no dropped shapes).
- npm test: exit 0, no FAIL.
- Rendered and looked at p-1 for both films, plus MIB3 p-2, p-3 and kit: no clipping, prices dearest first (MIB3 starters 0.95, 0.85, 0.50, house 0.40), sweet under mains.

## Drivein layout review: Ghostbusters: Afterlife (2021)
**Score: 8.7 out of 10**

This is a strong card and it reads like the real object: a carhop tray card clipped to a window tray beside the screen, with neon script for the venue, dot leaders, an order slip with the bay number, and the line "over the speaker". Every film claim I could test held up. Spinners Roller Hop is the film's real diner (named on Wikipedia). The Gary Grooberson quote is word for word on Wikiquote. All five winks match the plot, and the cue (Mini-Pufts loose in the grocery store) is right. The Save PDF matches the screen with no grey boxes, black blocks, lost borders or clipped words. Every note prints in full at one size, and the prices step down the right way in each course with the house lines at the foot. The one thing holding it under 9 is the prop: the slip prints only one of its two lines, because the layout drops any prop line already in the sign, and its label comes from prop.title, not prop.kind. The rest are small polish points. A fan would grin at Bay 21, the Muncher trap slip and the marshmallow men.

## Findings

1. **Prop slip prints one line of two (screen and PDF, bottom left of the card).** [layout] The Ghost trap slip shows only "Contents: Muncher". The data has two lines, "Summerville, Oklahoma" and "Contents: Muncher" (data/film-flavour.json, Ghostbusters: Afterlife (2021), prop.lines). menu-formats/drivein.js line 203 filters out any prop line that the sign or venue already contains, and the sign is "Summerville, Oklahoma. Carhops on skates", so the first line goes. Rule 5 says props print with their lines, so this breaks it, even though the slip still reads fine. Fix, either one:
   - Film data (simplest): change prop line 1 from "Summerville, Oklahoma" to "Held by Summerville PD". That is true to the plot: the kids are arrested after the Muncher chase, their gear is seized, and they later free Muncher to get it back (Wikipedia plot).
   - Layout: drop the sign/venue filter on line 203, or only apply it when the prop has three or more lines, so a two-line prop always prints whole.

2. **Prop label comes from prop.title, not prop.kind.** [layout] drivein.js line 204 prints `F.prop.title` ("GHOST TRAP SLIP") as the label. prop.kind ("slip") is only used to gate the block through the PK regex on line 202. Here the title happens to contain the kind, so nothing looks wrong to a guest. On a film whose title does not name the object, though, the label would not come from kind as rule 5 asks. Fix: print the title as the label but fall back to a kind-based label ("Order slip", "Ticket" and so on) when the title does not contain the kind word, or print the kind word as a small heading above the title.

3. **Egon wink wording is loose (screen and PDF, Scenes to watch for box).** [film] "Egon's ghost with the proton pack": the Wikipedia plot says "Supported by Egon's now-manifested ghost, Phoebe uses his proton pack". So it is Phoebe's hands on the pack with Egon's ghost beside her. I could not confirm whether the ghost holds the thrower himself, so I am marking this unsure rather than wrong. Safer line of about the same length: "Egon's ghost at Phoebe's side" (data/film-flavour.json, winks[3]).

4. **Phone menu mains are in a different order from the print.** [layout/shared] The print lists the chicken fried steak first (.70), then the burgers (.65), because tidyPrices in drivein.js lines 71 to 86 lifts "steak" as a dearer dish. The phone text lists the burgers first, in films.json order. The phone has no prices, so rule 8 is not broken, but a guest holding both sees two orders. Fix: build the phone menu from the same `items` order that prices() returns.

5. **Column spare height sits mostly in one gap above the second heading (screen and PDF).** [layout] In the left column, the space between the corn fritters and FROM THE KITCHEN is about 56px. The space above SHAKES AND SODAS on the right is about the same, while the item gaps stay tight. That is under the 100px still threshold and within the cap (drivein.js line 198, `cg` up to 44 plus a base of 12), so it is not a rule break. It reads slightly loose next to the tight item spacing. Fix: lower the course-gap cap to about 30 and let the item gaps take more (raise the `ig` cap from 10 to about 14).

6. **The screen half implies a drive-in cinema; Spinners is a carhop diner.** [layout] The left half is a movie screen on posts with the poster as the feature. Spinners Roller Hop in the film is a roller-skate carhop restaurant, not a picture theatre. The menu card itself (Bay, Over the speaker, carhops on skates) fits Spinners well. The screen is the layout's fixed frame and the 1950s look is an owner decision, so I am not marking this down. It is just worth knowing that a sharp fan might notice.

7. **Latent risk: winks and venue can be cut with no warning.** [layout] drivein.js line 171 sets each wink to `white-space:nowrap;overflow:hidden;text-overflow:ellipsis`, and line 216 sets the venue to `white-space:nowrap;overflow:hidden`. Nothing is cut on this film: the longest wink, "Phoebe in Gary Grooberson's summer science class", fits with room. A longer wink or venue on another film would be clipped silently, though. Fix: let winks wrap to two lines, or step the font size down to fit, and step the venue size on measured width, not character count.

Checked and fine: the venue, sign, quote and speaker, cue, all five winks (with the wording caveat in finding 3), and the title printed as text because the poster already carries the logo. The headings (Starters, From the Kitchen, Sweets, Shakes and Sodas, Scenes to watch for, Over the speaker) are neutral or in keeping with the setting. The dish notes describe food only. There are no repeat prices in a course and sweets cost less than mains. The TMDB still fills the right column's spare height with a caption. The Prep sheet cooks the five ticked dishes (mini marshmallow men, okra, burgers, pie, shakes), each with its own method and with every ingredient on the shopping list. The shopping list's single 2 L of frying oil covers both the okra and the chips by design (app.js line 1271, one frying pot reused), so I did not count it as a fault.

## What I could not check
- Whether Egon's ghost physically holds the proton thrower in the final fight (finding 3). The plot summary only says he supports Phoebe.
- That Spinners' carhops are on roller skates. "Roller Hop" in the name and the carhop role are confirmed (Wikipedia), but I did not find a source that says skates outright.
- The store in the Mini-Puft scene is confirmed as a grocery store (TheWrap clip writeup). I did not confirm the brand name, and the card does not name one.
- The phone text proof is a flattened text dump with no line breaks. I took that as a capture artefact and did not judge the phone layout itself.
- I did not cook-test the recipes' quantities or times.

### Fix log
1. Prop slip: drivein.js now prints a prop with one or two lines whole; the sign/venue filter only applies to props with three or more lines. Film line 1 also changed from "Summerville, Oklahoma" (repeated the sign) to "Seized by police" (Wikipedia plot: the kids are arrested and their equipment is seized). "Held by Summerville PD" was tried first but wrapped to a third line in the 190px slip. The slip now shows "Seized by police" / "Contents: Muncher".
2. Prop label: the label now comes from prop.kind. It prints the title when the title names the kind ("Ghost trap slip"), otherwise a kind label (Order slip, Ticket, Receipt, Card, Order, Stub, Voucher, Coupon, Tag).
3. Egon wink changed to "Egon's ghost at Phoebe's side" (ops file). Wikipedia supports it: "Supported by Egon's now-manifested ghost, Phoebe uses his proton pack".
4. Phone order: not fixed, it needs shared code (see below).
5. Column gaps: the course-gap cap dropped from 44 to 30 (with 50% of spare, was 60%) and the item-gap cap rose from 10 to 14. The second headings no longer float in a big gap.
6. Screen half: the owner's frame, no change.
7. Winks no longer use nowrap/ellipsis. The layout picks the biggest size (17 down to 12) where every wink fits the board, and a long wink wraps to two lines rather than being cut. The venue size now comes from estimated width (466px beside the title, about 0.5em a letter, 30 to 56px) instead of character-count steps. app.js fitLines still shrinks the venue on measured width as a backstop.

Shared code items for the lead
- Phone text menu (app.js phoneView/libPhoneView) lists dishes in films.json order. The drivein layout's prices() returns `items` in print order (dearest first, so the chicken fried steak goes above the burgers). The phone should take that same order from the layout, for example a layout-returned `order` alongside faces.

Owner decisions
- None new. The 1950s look and prices stay as the owner set them.

Checks
- check-print-text "Ghostbusters: Afterlife (2021)": PASS (no dish name or note hidden, no html2canvas-dropped shapes).
- npm test: all PASS, 0 failures.
- Rendered and checked p-1 for the only film on the layout (Ghostbusters: Afterlife (2021)).
- Commit 27413c13 on fix26/drivein.

## Foodcourt layout review: Jurassic World (2015)
**Score: 8.3 out of 10**

A good fit on paper. Jurassic World really does have a Main Street full of food stalls, so a tray liner from the park's food court is a natural idea. The poster sits whole in the lightbox, all five winks print, the dish notes describe food, every note prints in full at one size, the still fills the spare height in the Sides column, and the Save PDF matches the screen with no grey boxes, black blocks or lost borders. Every claim line I checked is true: Claire's quote is word for word and hers, Lowery did pay $150 for the shirt on eBay, Claire does free the T. rex, and the ferry, monorail, Mosasaurus show and Main Street are all in the film. What holds it under 9 is mostly the layout. The display face never loads, so the fascia, course headings, ticket title and coupon title all print in a plain fallback sans that looks like Arial. On top of that, the left panel keeps saying "mall" (MALL DIRECTORY, LEVEL 1, SPOTTED AROUND THE MALL) over a list of things like the Mosasaurus show and the T. rex, so a fan reads it as a shopping centre rather than the park.

## Findings

1. **The display font never loads, so the headline type prints as a generic fallback sans.** Screen and PDF: "Main Street Food Court" on the fascia, the Sides / Mains / Sweets / Drinks headings, "Park Admission" and the "Jurassic World" title on the coupon all render in what looks like Arial Bold, not Bricolage Grotesque. [layout] Cause: menu-formats/foodcourt.js line 130 asks for `Bricolage+Grotesque:wght@700`, and line 128 sets `dw:"700"` for the modern band. The local font set only has `Bricolage Grotesque:opsz,wght@12..96,800` (assets/fonts/fonts.js line 81). `guess()` in fonts.js (around line 463) finds no 700 cut, logs "No local font", and outputs no @font-face, so the browser falls back to its default sans. Fix: on line 130 request `Bricolage+Grotesque:opsz,wght@12..96,800` and set `dw:"800"` on line 128, or add the 700 cut to scripts/fetch-fonts.cjs and rebuild fonts.js. Side note for other films: band 2 asks for Barlow Semi Condensed italic 500 (line 130), which is also not in the local set, so 80s and 90s films will get a faked italic on the cue and still caption.

2. **"Mall" framing is wrong for this film's world.** Screen and PDF, left column: "MALL DIRECTORY", "LEVEL 1", "YOU ARE HERE: THE FOOD COURT", "SPOTTED AROUND THE MALL" sitting above "The Mosasaurus feeding show" and "Claire frees the T. rex". Jurassic World is a theme park, not a mall, and none of those things happen in a shopping centre. [layout] Cause: hardcoded strings in menu-formats/foodcourt.js lines 148, 158 and 159. Under rule 6 these are meant to be neutral or come from flavour, and "mall" is not neutral here. Fix: read optional flavour keys with the current text as the fallback, for example `fl.directory` ("PARK DIRECTORY"), `fl.level` ("MAIN STREET"), `fl.here` ("You are here: Main Street") and `fl.spotted` ("Spotted around the park"), and set those four in data/film-flavour.json for Jurassic World (2015).

3. **The ticket lines run together and leave "one" on a line by itself.** Screen and PDF, coupon: "Isla Nublar, monorail entry. Admit / one". [layout] Cause: line 186 joins `prop.lines` into one 2-line clamped paragraph with ". ", so the second line ends without a full stop and wraps badly. Fix: print each prop line on its own line (rule 5 says props print "with their lines"), for example map the lines to separate divs, the second one in small caps like "ADMIT ONE".

4. **The starter course is called "Sides" on the card but "Starters" on the phone menu.** Screen and PDF show "Sides"; the phone text shows "Starters". A prawn platter and pretzels read as starters, not sides. [layout] Cause: line 128, `cols:["Sides","Mains","Sweets","Drinks"]` for the 2000s-on band. Fix: change it to `cols:["Snacks","Mains","Sweets","Drinks"]`. That suits a food court counter and still sits close enough to the phone's wording.

5. **The Sides prices read 10, 8, 7, 9 down the column.** Screen and PDF. This follows rule 8 (the house popcorn chicken sits at the foot) and the owner's rule, so I'm not marking it down. Still, a $9 line under a $7 line looks odd on a counter board. [layout] Cause: the sort on line 198 puts house lines last whatever their price. Fix (optional): have `priceSense` or `prices()` cap a house line at or below the cheapest non-house price in its course, so the column steps down cleanly.

6. **The Mosasaurus shows up three times.** It's in a dish name ("Mosasaur feeding prawns"), a wink ("The Mosasaurus feeding show") and the Showtime cue. [film] Fix: swap the wink for another real moment of the same length, for example "Jimmy Fallon's Gyrosphere video" replacing "The Mosasaurus feeding show" (Fallon's Gyrosphere instruction video is on Wikiquote). Note that "Gyrospheres in the valley" would then need to change too, for example to "Pteranodons over Main Street".

7. **A fan grin was missed on drink price.** Hoskins's line about a park that will "charge seven bucks a soda" is real (Wikiquote), but the frozen lemonade prints at 4. [film] Not a fault, just a missed chance. The pricing is automatic, so the only clean fix is a note or wink, for example a wink "Seven bucks a soda" in place of "Owen's raptor squad" (Owen's raptors are already on the poster).

8. **The Prep sheet's last page holds one short recipe and is otherwise blank.** PDF page 3: Theme park frozen lemonade, then about 75% empty paper before the cue. [layout, shared Prep sheet, not foodcourt.js] Fix: let the last recipe flow into page 2's right-hand space, or shrink page 2 spacing so five dishes fit on one page when they nearly do.

9. **The mousse uses raw eggs with no note.** PDF page 2, Dino egg chocolate mousse, step 2 folds raw yolks and whites. [film] Fix in data/recipes/jurassic-world-2015.json: add a make-ahead or tip line such as "Use very fresh eggs; skip for pregnant guests."

Prep sheet check: all five ticked dishes (prawns, cheese balls, short ribs, mousse, lemonade) are cooked on the Prep sheet, and every ingredient is on the shopping list with the quantities added up correctly (butter 110g = 60 + 50, smoked paprika 3 tbsp = 1 + 2). The pretzels and fish tacos are printed but left off the cook, which is the owner's rule.

Fact check summary: the quote "We needed something scary and easy to pronounce." is Claire's, exact (Wikiquote). The $150 eBay Jurassic Park shirt is Lowery's (Wikiquote). Claire releasing the T. rex is in the Wikipedia plot. Owen's raptor squad is in the Wikipedia plot. Gyrospheres are in the film (Wikiquote, Fallon's video). Main Street and the Mosasaurus feeding show sets are on Wikipedia. Ferry then monorail to the main gate, and the Mosasaurus lunging from the water to take a shark, are confirmed on Filmsite's plot summary. The venue (Main Street Food Court) and sign (Isla Nublar, open daily) are true to the park's world, though the film never names a "food court" as such.

## What I could not check
- IMDb directly for the monorail detail (I used Filmsite's plot write-up instead).
- Whether Bricolage Grotesque loads on the live reeldinner.com build. My finding comes from the local fonts.js lookup and the proof renders, both of which show the fallback.
- What the screen looks like at full size (the screen capture is half size). The PDF proof was checked at its rendered size only.

### Fix log
1. Display font: menu-formats/foodcourt.js now requests the exact local spec `Bricolage+Grotesque:opsz,wght@12..96,800` with dw "800" for the 2000s-on band, so the fascia, course headings, ticket title and coupon title print in Bricolage. Body fonts changed to specs the local set holds with the cuts the card draws (Barlow 400/700/italic 400, Barlow Semi Condensed with italic 400), so 70s to 90s films get real italics on the cue and still caption.
2. Mall framing: the directory head, level tag, "you are here" line and winks label now read optional flavour keys (directory, level, here, spotted), falling back to the mall wording (right for the other five films, all set in malls). Jurassic World set by card-ops to "Park directory", "Main Street", "You are here: Main Street", "Spotted around the park".
3. Ticket lines: each prop line prints on its own row, the second in small caps with no full stop ("ADMIT ONE"). Checked on all six films.
4. 2000s-on band course heading changed from "Sides" to "Snacks".
5. House line price: a house line at the foot is now dropped to one step under the cheapest dish above it in its course (no repeats), so columns step down. Jurassic World Snacks now read 10, 8, 7, 6; Fast Times drinks 0.95 then 0.45.
6. Mosasaurus repeat: winks now "Fallon's Gyrosphere video" (Wikiquote) and "Pterosaurs flee the aviary" (Wikipedia plot) in place of the Mosasaurus show and the Gyrosphere valley. Shortened so all five winks fit.
7. "Seven bucks a soda" (Hoskins, Wikiquote) replaces "Owen's raptor squad". All five winks print.
8. Prep sheet last page spacing: shared Prep sheet code, not foodcourt.js. Left for the lead.
9. Raw eggs: mousse make_ahead in data/recipes2 and the method in data/recipes now say the eggs stay raw, use very fresh ones and skip for pregnant guests.

Shared code items for the lead
- Prep sheet (app.js): a short last recipe sits alone on page 3 with about 75% blank paper. Let it flow into page 2's spare space or tighten page 2 when five dishes nearly fit.
- The phone menu calls the first course "Starters" while foodcourt prints "Snacks". Fine as is, noting it in case you want phone headings to follow the layout.

Owner decisions
- None new.

Checks: check-print-text PASS for all six foodcourt films (Jurassic World, Wonder Woman 1984, Mallrats, Jingle All the Way, Bad Santa, Fast Times at Ridgemont High). npm test passes (exit 0, no failures). All six rendered and checked by eye. Commit 7cde62b1 on fix26/foodcourt.

## Hospital layout review: Terminator 2: Judgment Day (1991)
**Score: 8.4 out of 10**

This is a strong card. Pescadero State Hospital, a wristband reading SARAH CONNOR, BED 101 (a quiet nod to the Model 101), Dr Silberman on the patient card and "Come with me if you want to live" under "Overheard on the ward" all land, and the line really was said inside that hospital, so fans will grin. The Save PDF matches the screen: no grey boxes, no lost borders, no clipped words. Both columns of the order form finish level, with a real TMDB still taking up the spare room under Drinks. Every note prints in full at one size. The Prep sheet and shopping list cover every ticked dish. Two things keep it under 9. First, the header sign "Criminally disordered retention facility" is made up. It is not the film's wording and reads like nothing a 1995 state hospital would print, which breaks rule 10. Second, the pen ticks just tick the first dish in each course, so the empanadas are cooked on the Prep sheet but sit unticked on the card. A guest holding both pages will notice the order and the cook don't match.

## Findings

1. **Header sign is invented, not the film's world (rule 10). [film]**
   Where: header second line on the screen and PDF, "CRIMINALLY DISORDERED RETENTION FACILITY · MEAL ORDER".
   Cause: data/film-flavour.json line 13087, `"sign": "Criminally disordered retention facility"`. The film's hospital is the Pescadero State Hospital for the Criminally Insane: the Terminator fandom wiki gives that name, Wikipedia's Sarah Connor article calls it "a prison hospital of the criminally insane", and Sarah is held in its maximum security wing. "Criminally disordered" and "retention facility" come from nowhere.
   Fix (39 characters against 40 now): `"sign": "For the criminally insane, max security"`. The first comma piece does not match the venue, so hospital.js line 181 keeps the whole sign, and the header reads "Pescadero State Hospital / FOR THE CRIMINALLY INSANE, MAX SECURITY · MEAL ORDER".

2. **Pen ticks don't follow tonight's cook. [layout]**
   Where: order form on the screen and PDF. Ticked: quesadillas, tacos, churros, margarita (four). The Prep sheet cooks five: those four plus the Border run chicken empanadas, which prints with an empty box. Meanwhile the smash burger (a card extra with no cook) and the house elote and lager are correctly left unticked, but only by luck of their position.
   Cause: menu-formats/hospital.js line 211, the tick is drawn on `i===0`, the first dish of each course, whatever is actually cooked. On a film where a card extra or a house line comes first in its course, this would tick a dish that isn't on the Prep sheet, which is the one thing the owner rule forbids.
   Fix: pass the item into `pre` and tick when the dish is cooked: `${!it.extra&&!it.house?"&#10003;":""}`. Line 224 already has `it` in scope, so call `pre(k,i,tr,it)` there and accept a fourth argument at line 211.

3. **Kitchen stamp says 1991, the story is 1995. [layout]**
   Where: "WARD KITCHEN 1991" stamp on the form's top bar, screen and PDF.
   Cause: hospital.js line 232 prints `F.year` (the release year). Wikipedia sets the film in 1995 Los Angeles. On an in-world hospital form, a fan reads the stamp as a date, and 1991 is before Sarah's 1995 stay.
   Fix: let the stamp take an optional in-world year from flavour (for example `hospital.stampYear`, set to "1995" for T2) and fall back to `F.year`. Or drop the year from the stamp and print "WARD KITCHEN" alone.

4. **Prop label reads twice: "CARD" over "Patient Card". [film]**
   Where: pinned card at the bottom right, screen and PDF.
   Cause: data/film-flavour.json, prop `kind: "card"` and title "Patient Card" (line 13102). Rule 5 is met, but the doubled word looks lazy on an otherwise sharp card.
   Fix (same length, 12 characters): change the title to `"Case notes 1"`, or better, keep the title and change the kind to `"chart"` so it reads "CHART / Patient Card".

5. **Nurse's note box is mostly blank lines. [layout]**
   Where: "Overheard on the ward" box, screen and PDF. One line of handwriting, then about 85px (of 960) of empty ruled lines.
   Cause: hospital.js line 248 sizes the quote font by text length (30px for short lines) in a fixed 150px box. The gap is under the 100px still threshold so rule 3 is not broken, but the box looks unfilled next to the busy form.
   Fix: for short quotes, step the pen size up (for example 38px under 40 characters), or put the quote's scene on a second, smaller pen line ("Sarah's corridor, Pescadero") so the note looks written on.

6. **Missing the usual hospital meal card fields. [layout]**
   Where: whole card. A real patient meal order carries a meal (Breakfast, Lunch, Dinner), a date and a diet code (Full ward diet, Soft, Diabetic). This card has the wristband, ward and bed, but nothing that says which meal it is.
   Fix: add a small field row under "Please tick your choices": `MEAL: DINNER   DIET: FULL WARD   DATE: ____`. This is fixed neutral copy, so rule 6 is fine.

Checked and true: venue (Pescadero State Hospital), patient Sarah Connor, Dr Silberman's patient, high or maximum security wing, the quote and its speaker (Wikiquote, under The Terminator, offering his hand to Sarah), all five winks (canal dirt bike chase in the flood control channel, the T-1000 flattening into and rising out of the hospital floor, NO FATE carved into the table, the thumbs up in the molten steel, the steel mill finale), the cue (Enrique Salceda's desert ranch, where they camp before the run to Mexico) and the Galleria mall name used in the film. Dish notes all describe food. The Prep sheet and shopping list cover all five cooked dishes, with quantities that add up (7 limes, 4 eggs, 2 onions, 2 tsp cumin). The phone menu is complete and marks the house lines as house standards.

## What I could not check
- Whether the words "for the Criminally Insane" actually appear on screen in the film. I confirmed the name through the Terminator fandom wiki and Wikipedia's Sarah Connor article only, not from the film itself.
- The exact frame of the "T-1000 flowing out of the floor" wink. The fandom wiki confirms it flattens itself to the hospital floor to take on the guard Lewis, but the Wikipedia plot does not describe it.
- Whether the logo was hidden by the contrast sampler or `noLogo`. Either way, title and year print in its place as rule 4 wants.
- I did not open the PDF at full resolution beyond the rendered p-1 to p-3 PNGs.

### Fix log
1. Header sign: T2 sign set to "For the criminally insane" (Wikipedia: Sarah is held at Pescadero State Hospital, "a prison hospital of the criminally insane"). It now prints "FOR THE CRIMINALLY INSANE · MEAL ORDER". I left out "max security" because I could only source "high security" (the prop already says that). The same check on The Silence of the Lambs: its sign "Baltimore, Cell Block Only" is now "Baltimore, for the criminally insane" (Wikipedia: Baltimore State Hospital for the Criminally Insane).
2. Pen ticks: hospital.js ticks a dish only when it is tonight's cook. It reads the shared planner's default cook (planAll, read only: not spare, blocked or extra), with a fallback of recipe dishes, two starters, a main, a sweet and a drink, capped at five. Card extras and house lines are never ticked. I checked in the browser that card ticks and the Prep sheet's five match exactly on all 7 films (T2 now ticks the empanadas).
3. Kitchen stamp: new hospital.stampYear flavour setting, falling back to the release year. T2 prints 1995, Shutter Island 1954 and Halloween II 1978 (Wikipedia: "Films set in 1995", "In 1954", "October 31, 1978"). The other four are set in their release years.
4. Prop label: T2 prop kind changed from card to chart, so it reads "CHART / Patient Card".
5. Note box: the pen size is now the biggest that fits the box (44px down to 24px, up to 3 lines). A quote that fits on one line puts the signature on its own line, right aligned, like a signed note. T2, Halloween II and Elm Street 3 now fill the ruled box.
6. Meal card fields: new fixed row under "Please tick your choices": MEAL: DINNER, DIET: FULL WARD (or the diet in use, from the shared dietLabel, e.g. VEGETARIAN), DATE: ____ line. The dish area moves down 24px and the fit handles the rest.
Also: the Halloween II prop "Meal Ticket" said "Haddonfield Memorial, Ward 3", which clashed with WARD E on the wristband and repeated the sign. Its lines are now "Laurie Strode / One hot dinner".

Rendered and looked at all 7 films (T2, Shutter Island, Smile, Rain Man, Silence of the Lambs, Elm Street 3, Halloween II): no clipping, the stamp sits clear of the new field row, columns are filled or carry a still.

Shared code items for the lead: none. Note: build-data rewrites index.html and sw.js (version stamp), so both are in the commit. I did not edit them by hand.
Owner decisions: none.

check-print-text, all 7 hospital films: PASS (7 printed menus read, no dish name or note hidden, no html2canvas problems).
npm test: PASS (exit 0, no failures).
Commit b036e0c1 on fix26/hospital.

## Reception layout review: Four Weddings and a Funeral (1994)
**Score: 8.5 out of 10**

This is a good fit and it looks like a real wedding table: a letterpress menu card in a double rule, the welcome sign, the poster on a red easel with the invitation hung off its legs, a Watch For card and Gareth's real toast under "From the toasts". The Save PDF matches the screen (no grey boxes, black blocks, lost borders or clipped words), every note prints whole at one size, there is no logo box, the still carries the title and year, and the Prep sheet and shopping list cover all five ticked dishes. Every fact line I checked is true to the film. What keeps it under 9: the place card, the first thing your eye lands on in the centre, is the generic fallback ("Table One, Our Guest, Please find your seat") with nothing from the film on it. Two of the three cooked starters are near-identical smoked salmon and dill bites printed one under the other. And the prop prints under a weak "CARD" label. None of these are hard to fix, and all of them are data, not code.

## Findings

1. **Place card is the generic fallback.** Screen and PDF, centre top: "TABLE ONE / Our Guest / Please find your seat". [film] Cause: data/film-flavour.json line 6421, `reception` only sets `toast: true` and has no `guest`, `table` or `seat`, so menu-formats/reception.js line 199 falls back to the defaults. On a wedding table the place card is the one thing that names someone, and a fan gets nothing here. Fix: add to the `reception` block `"guest": "Charles", "table": "Top Table", "seat": "Best man. Please try not to be late."` (Wikipedia confirms Charles is best man at Angus and Laura's wedding and that he and Scarlett barely make it in time.)

2. **Two smoked salmon starters in a row.** Screen and PDF, To Begin, dishes 2 and 3: "Smoked salmon oatcakes" (cream cheese, smoked salmon, dill, lemon) sits straight above "Charles's running late canapés" (blinis, crème fraîche, smoked salmon, dill). Both are ticked to cook, so the host makes the same bite twice and buys 400g of salmon. A guest reads it as a repeat in the course (rule 8 spirit). [film] Cause: data/films.json, Four Weddings entry, S[2]. Fix, same length and it keeps the Scottish wedding link and adds a vegetarian starter: name "Smoked salmon oatcakes" to "Goat's cheese oatcakes"; note "Oatcakes with cream cheese, smoked salmon, dill and lemon" to "Oatcakes with goat's cheese, roast beetroot, thyme and honey". Update the method, shopping list and data/recipes/four-weddings-and-a-funeral-1994.json (and data/recipes2) to match.

3. **Prop label reads "CARD".** Screen and PDF, right, on the easel legs: "CARD / Wedding Invitation". Rule 5 is met on paper, but "Card" over "Wedding Invitation" is flat and slightly redundant. [film] Cause: data/film-flavour.json line 6413, `"kind": "card"`; reception.js line 183 already maps `invitation` to "Invitation". Fix: `"kind": "invitation"` and title "Wedding Invitation" to "Glenthrist Castle" (the setting of Carrie and Hamish's wedding, per movie-locations.com), so it reads "INVITATION / Glenthrist Castle / Carrie and Hamish request / the pleasure of Charles's company".

4. **Starter order puts the ploughman's above the salmon and prosciutto canapés.** Screen and PDF, To Begin. The order is ploughman's board, oatcakes, canapés, house vol-au-vents. On a wedding menu the smoked salmon blinis with prosciutto-wrapped asparagus read as the dearer plate. [layout] Cause: menu-formats/reception.js lines 149 to 151. `dear()` only reads the dish name, so "board" scores 2, "Smoked salmon oatcakes" scores 1 and "Charles's running late canapés" scores 0 even though its note is all salmon and prosciutto. No prices are printed, so most guests won't notice, but rule 8 asks for dearest first. Fix: score `it.n+" "+it.note` in `dear()` (line 150), or drop "board" and "platter" from tier 2 so a ploughman's doesn't outrank seafood.

5. **The phone menu lists starters in a different order from the printed card.** Phone: canapés, oatcakes, ploughman's, vol-au-vents. Print: ploughman's, oatcakes, canapés, vol-au-vents. [layout] Cause: the dearest-first sort at reception.js line 151 only applies to the printed face. The phone text is built from the card's own order in shared code. Fix: apply the same sort where the phone text is built, or export the sorted order from the layout so both match.

6. **The toast is cut with an ellipsis.** Screen and PDF, "From the toasts": "A toast before we go into battle. True love... May we all in our dotage...". Wikiquote has Gareth's real words as "True love. In whatever shape or form it may come. May we all...". The cut is marked, so rule 9 holds, and the attribution and the "From the toasts" label are right. Fans know the "whatever shape or form" line well, though, and the toast card has room for it. [film] Cause: data/film-flavour.json line 6401. Optional fix: print the full line, "A toast before we go into battle. True love. In whatever shape or form it may come. May we all in our dotage be proud to say, 'I was adored once too.'" At 150 characters the layout drops it to 15px (reception.js line 207), and it still fits.

7. **The menu subtitle is a pew sign rather than a menu line.** Under DINNER MENU: "Bride's Side. Groom's Side. Bar." It is a decent joke and true to the world, but a real reception menu carries the couple and date at that spot. [layout/film] Cause: reception.js line 170 prints `F.sign` as the menu card's subtitle. Not a fault, just a note. If you want it more real, keep the sign and set `reception.heading` to "Angus and Laura" so the card heads up with the couple.

Checked and fine: the venue (Angus and Laura's wedding, the first wedding, in Somerset); the cue (snacks as guests pour into the first reception); all five winks (Matthew reads "Funeral Blues" at Gareth's funeral; Father Gerald, Rowan Atkinson, garbles the names and liturgy with "Holy Spigot"; Charles and Scarlett late for the first wedding; David interrupting the altar in sign language; Carrie's "Is it still raining? I hadn't noticed."); the prop (Charles does receive the invitation to Carrie and Hamish's wedding); "Lucky Boatman" (the pub where Charles and Carrie get together after the first reception); Gareth's waistcoats (Matthew's eulogy); and the Highland wedding (Glenthrist Castle, Perthshire). The house lines sit last in their courses and the dessert sits under the mains. The Prep sheet covers all five ticked dishes, the shopping list adds up (400g salmon, 7 eggs, 3 lemons) and the unticked lamb and ploughman's are left off by the owner's rule. Gaps are even and capped in all three columns. The phone split views (0 to 753, 591 to 1344) keep the menu card and the centre and right cards whole.

## What I could not check
- Which wedding Gareth's toast is given at. Wikiquote has the words and the speaker but not the scene. It doesn't change the score.
- The exact on-screen wording of the invitation. "Carrie and Hamish request the pleasure of Charles's company" is a reasonable reading of the plot, but I could not see the prop itself.
- The doorstep detail on the last wink. The rain line is confirmed, but I could not confirm the exact spot outside Charles's flat.
- I did not open the full PDF page by page beyond the three page images, and I did not check fonts at print resolution.

### Fix log
1. Place card: set flavour.reception guest "Charles", table "Top Table", seat "Best man. Please try not to be late." (Wikipedia: Charles is best man at Angus and Laura's wedding and he and Scarlett barely make it). Layout fix too: with no place card set, reception.js now names the character on the toast card (note.by) instead of "Our Guest", so all 11 other films get a real name (Stephen Strange, Julianne Potter, Nyles, Bea, Georgia Cotton, Lauren, Jeremy Grey, George Banks, Nai Nai, Gus Portokalos). The Wedding Singer keeps its own.
2. Second salmon starter: "Smoked salmon oatcakes" is now "Goat's cheese oatcakes", note "Oatcakes with goat's cheese, roast beetroot, thyme and honey" (card-ops, so films.json, dish-names, dish-notes and diet all match). data/recipes (method and shopping) and data/recipes2 rewritten by hand: roast beetroot, goat's cheese, thyme, honey, veg true, old veg alt removed. The Prep sheet now buys 200g salmon, not 400g.
3. Prop: kind "invitation", title "Glenthrist Castle" (the invitations name "The Chapel of Glenthrist Castle, Perthshire", per offscreentourist.com / almostginger.com locations page). Prints "INVITATION / Glenthrist Castle / Carrie and Hamish request / the pleasure of Charles's company".
4. Starter order: dropped board and platter from the dear tier, the dish name ranks first and the note breaks a tie (score = name x10 + note), and snack words (crackers, chips, crisps, popcorn) count as 0. Four Weddings now reads canapés, oatcakes, ploughman's, house vol-au-vents. On Ticket to Paradise the satay now sits above the prawn crackers.
5. Phone order: on Four Weddings the phone and print now match (canapés, oatcakes, ploughman's, vol-au-vents). The general fix is shared code, see below.
6. Toast: full Wikiquote line, "A toast before we go into battle. True love. In whatever shape or form it may come. May we all in our dotage be proud to say, 'I was adored once too.'" (150 characters, prints at 15px, all of it shows).
7. Heading: reception.heading "Angus and Laura", so the card heads "ANGUS AND LAURA" over the pew sign.

Shared code items for the lead
- Phone order (app.js libPhoneView/fullMenu): the phone builds from the card's own order, but reception sorts dearest first on the printed face only. Fix: have libPhoneView read the dish order from the rendered card (it already gets `root`), or let a layout return an `order` with its faces. On the current 12 films the orders now match, but nothing makes sure they stay that way.
- data/films.json Four Weddings S[2] shopping still lists "200g smoked salmon@Deli", "1 bunch dill@Produce", "1 lemon@Produce" (card-ops can't pick those out because the same strings sit in other dishes in that film). It only matters as a fallback: the Prep sheet and shopping list read recipes2, which is right. Someone with films.json access should change them to "2 beetroot@Produce", "1 bunch thyme@Produce", "1 jar honey@Pantry".

Owner decisions
- None new. Top End Wedding's place card now names Lauren (the bride) at "Table One". That's true to the film, but the owner may want a custom reception block for it.

Results
- check-print-text, all 12 reception films: PASS (no dish name or note hidden, no dropped shapes in the Save PDF).
- npm test: exit 0, all PASS.
- All 12 films rendered and checked by eye in /tmp/fix26-reception.

## Skilodge layout review: Better Off Dead (1985)
**Score: 8.8 out of 10**

This is a strong card and close to ready. Every claim line I checked is true to the film. The cue, all five winks, the quote and who says it, and the paper route bill all match Wikipedia and Wikiquote. The prop is even word for word from the film ("Four weeks, twenty papers, that's two dollars"). The still is the ending (Lane and Monique with the Camaro at Dodger Stadium), which suits it nicely. The trail-sign course headings, the timber, the snow report board and the poster in a frame all read as a real lodge menu board. Prices follow rule 8, every note prints in full at one size, the gaps are small and the right column's spare room goes to a real still. The Save PDF matches the screen with no grey boxes, black blocks, lost borders or clipped words. The Prep sheet cooks five dishes, and every ticked dish and every ingredient is on the shopping list. It misses 9 because of small things a fan would notice. The "two dollars" gag prints three times. The paper route bill hangs off a ski lift wicket as if it were a lift ticket. The quote box says the line was overheard at the lodge, but Johnny yells it at Lane's house. Two dish notes read clumsily. None of these breaks a locked rule.

## Findings
1. **The two dollars gag prints three times.** It is on the receipt, in the first snow report wink and in the quote box (screen, PDF). The joke loses its punch by the third time, and it uses up a wink that could show off another bit of the film. [film] Cause: data/film-flavour.json line 10315, "The paperboy chasing his two dollars". Fix: swap in a line Wikipedia supports, "The drag racer who talks like Cosell" (37 characters against 36). Another option is "Badger's space shuttle through the roof".

2. **The receipt hangs on the lift ticket wire.** The left side shows a card with a brown band that says RECEIPT. It is the lift ticket shape, hanging off the poster frame on a ski wicket wire (screen, PDF). The label follows prop.kind as rule 5 asks, but nobody hangs a paper route bill on a wicket. It reads like a name badge, not a receipt. There is also a lot of empty white space inside it. [layout] Cause: menu-formats/skilodge.js lines 186 to 196, where every non-ticket prop still gets the ticket body, the wire (line 190) and the coloured header band. Fix: when isTk is false, drop the wire and pin the slip to the timber with a tack instead. Give it a torn zigzag bottom edge, mono or typewriter type, a dashed rule above the "Amount due" line, and a little less height so the box is not half empty.

3. **"OVERHEARD AT THE LODGE" puts the quote in the wrong place.** Johnny yells "I want my two dollars!" at Lane around the house and the street, not at a lodge. The fixed heading suggests a setting the film does not have. [layout] Cause: menu-formats/skilodge.js line 243, where the heading is hard coded as "OVERHEARD AT THE LODGE" for every quote. Fix: use a neutral "OVERHEARD" or "HEARD AROUND TOWN". You could also use "OVERHEARD ON THE SLOPES" only where the flavour data marks the quote as said on the mountain.

4. **Two dish notes read clumsily.** On screen and in the PDF, the rice bake note reads "baked over rice in thyme cream stock", and the croque note reads "grilled bubbling, cut in squares". Both describe the food, so no rule is broken, but they read like a shopping list rather than a menu. [film] Cause: data/films.json, Better Off Dead entry, M[1][1] and S[1][1]. Fix, close to the same length:
   - Rice bake: "Chicken thighs and mushrooms baked on rice in a thyme cream stock"
   - Croque: "Ham and gruyère with Dijon and nutmeg béchamel, grilled till bubbling, in squares"

5. **The cue dish is not one of the five cooked.** This is not marked down, because it is the owner's rule. The Showtime cue hangs on Pig Burgers, but the Prep sheet cooks the rice bake and leaves the Pig Burgers double cheeseburger unticked. A host following the cue has a burger on the card and no recipe for it on the Prep sheet. The phone menu does carry the full burger recipe. [film] Cause: data/recipes/better-off-dead-1985.json "m" holds only the rice bake. Fix: tick the burger as the cooked main in place of the rice bake. The burger's method and shopping are already in data/films.json M[0].

6. **The recipe JSON shop lists are behind the printed list.** No guest sees this. The printed Prep sheet shopping list is complete: it has the apples, the dark chocolate and the 125g of caster sugar. But data/recipes/better-off-dead-1985.json has no apples in the fondue "shop", and no dark chocolate or caster sugar in the crêpes "shop" or the top-level "shopping". [film] Fix: add "2 apples@Produce" to the fondue shop, and add "50g dark chocolate@Pantry" and "2 tbsp caster sugar@Pantry" to the crêpes shop. Then the data agrees with what prints if the Prep sheet builder ever reads those lists directly.

7. **Small polish on the Prep sheet.** The rice bake method says "Cover and bake at 180°C until golden on top" (Prep page 1). A covered dish will not brown. [film] Fix: "Bake covered 40 minutes, then uncovered 10 until golden on top."

## What I could not check
- Whether a ski lodge on the K-12 appears in the film. Wikipedia only calls the K-12 "the highest peak in town". The venue is a fair invention that fits the film's world, but I could not confirm it as a real location in the film.
- Whether the still is exactly the Dodger Stadium ending. It shows the black Camaro and stadium seats, which matches the Wikipedia ending, but I did not confirm the frame against a source.
- Whether 1985 lodge prices (hot chocolate 50 cents, fondue $2.50) feel right to a US viewer. They look a little cheap for a ski lodge, but I had no source for this, so I have not marked it down.
- I used no web searches. Fact checks came from the Wikipedia raw plot (Better Off Dead (1985 film)) and the Wikiquote raw page (Better Off Dead (film)).

### Fix log
1. Two dollars gag: wink "The paperboy chasing his two dollars" swapped for "The drag racer who talks like Cosell" (checked on the Wikipedia raw plot), via audit/ops/better-off-dead-1985-review-26b.json.
2. Receipt on the wicket: menu-formats/skilodge.js now hangs only ticket or pass props on the wire. Any other prop is an off-white paper slip tacked to the timber with a pin, typewriter type (Courier Prime), the kind as its heading, a dashed rule under it, a dashed rule above any "Amount due / Total / Balance" line, a torn zigzag foot, and a height sized to its lines so it is not half empty. The zigzag is drawn with small turned squares, not clip-path, because the PDF export cannot draw clip-path (checked in the Save PDF render). Hot Tub's lift ticket is unchanged.
3. Quote heading: "OVERHEARD AT THE LODGE" is now "OVERHEARD" for every quote (skilodge.js).
4. Clumsy notes: rice bake note is now "Chicken thighs and mushrooms baked on rice in a thyme cream stock"; croque note is now "Ham and gruyère with Dijon and nutmeg béchamel, grilled till bubbling, in squares" (ops file, under 100 characters).
5. Cue dish not cooked: data/recipes/better-off-dead-1985.json "m" now holds the Pig Burgers double cheeseburger, and data/recipes2 has a full burger dish (quantities, steps, make ahead, veg alternative). The Prep sheet now cooks the burger in place of the rice bake, so the Showtime cue has its dish. The rice bake stays printed and in the planner unticked. Skilodge prints no ticks on the card, so nothing to match there.
6. Recipe JSON shop lists: added "2 apples@Produce" to the fondue shop, "50g dark chocolate@Pantry" and "2 tbsp caster sugar@Pantry" to the crêpes shop, and rebuilt the top-level shopping (burger items in, rice bake items out, apples, dark chocolate, 125g caster sugar).
7. Rice bake method: recipes2 step now reads "Bake covered at 180C for 40 minutes, then uncovered for 10 until golden on top."

Shared code items for the lead: none.
Owner decisions: none.

Checks: check-print-text PASS for Better Off Dead (1985) and Hot Tub Time Machine (2010) (no dish name or note hidden, no shapes html2canvas drops). npm test passes (exit 0, no failures). Both films rendered and looked at (menu page and Prep sheet).

---

# review26c

## Arcade layout review: Snatch (2000)
**Score: 8.8 out of 10**

This is a strong card. It reads like a real prize counter. Tickets work as the money, the cabinet bezel holds the whole poster, and the high score table, bet slip and token row all feel like part of a games room. The Save PDF matches the screen exactly: the neon glow survives, nothing is clipped, there are no grey or black blocks and every border prints. Every dish note describes the food and prints in full at one size. The prices follow rule 8. The poster carries the logo, so the marquee prints the title and year instead. The Bet Slip prop sits under its own label, and the five winks sit in a labelled WATCH FOR box. The film lines hold up. The bezel note is a close paraphrase of Turkish's closing voiceover (squeaky toy, shoe, 86 carat diamond, still squeaking), which fans will grin at. The cue, the winks and the arcade venue all check out against Wikipedia and Wikiquote. I found no broken locked rule. What keeps it off 9 is craft: the sign repeats the venue's two names straight underneath, the high score table misses an easy joke, and the bet slip's second line is flat.

## Findings

1. **Sign repeats the venue.** On screen and in the PDF, the marquee reads "Turkish and Tommy's Arcade" with "TURKISH AND TOMMY, FAIR FIGHTS" right under it. The same two names print twice in the one panel, and a guest notices that first. [film] Cause: data/film-flavour.json, "Snatch (2000)".sign. The film backs both parts of a better line: Wikipedia calls Turkish an "unlicensed boxing promoter and slot machine shop owner". Fix, same length (30 characters): `"sign": "Fruit Machines and Fair Fights"`. "Fair Fights" keeps the joke, since every fight in the film is fixed.

2. **The high score table misses the joke.** Screen and PDF show 1. TUR, 2. TOM, 3. MIK. Mickey is the unbeaten bare-knuckle champion who flattens Gorgeous George and then wins the fixed fight, so he should top the table. Turkish and Tommy lose every round to him. [film] Cause: data/film-flavour.json, "Snatch (2000)".arcade.scores; the order is used as given (menu-formats/arcade.js line 256). Fix: `"scores": ["MIK", "TUR", "TOM"]`.

3. **The bet slip's second line says nothing.** Screen and PDF show "Odds: not good". Line one is good. Line two wastes the film's best twist: Wikipedia says Mickey went into the fixed fight "having secretly bet on himself". [film] Cause: data/film-flavour.json, "Snatch (2000)".prop.lines[1]. Fix, near the same length: `"Bet: on himself"`.

4. **The title prints three times.** The poster carries the Snatch logo, the marquee prints "SNATCH, 2000" on the right, and the still in the Quick Plays column carries a "Snatch, 2000" tag. That tag is the only mixed-case label on the board. It is not a rule break, but it is one repeat too many. [layout] Cause: menu-formats/arcade.js line 220 always labels the gap-filling still with title and year. Fix: label the default still with a neutral arcade tag such as "NOW PLAYING" (already the fallback text on line 263), or with arcade.panel.head when the film supplies one.

5. **"Caravan" appears in two dish names.** "Caravan site sausages" and "Mickey's caravan whiskey ginger" both use it, so the word loses its punch. [film] Cause: data/films.json, Snatch K[0][0]. Fix, near the same length: "Mickey's bare-knuckle whiskey" (29) in place of "Mickey's caravan whiskey ginger" (31). The note already names the ginger beer.

6. **Note wording, minor.** The bezel reads "Tommy kept the dog." In the film's voiceover, Tommy talks Turkish into keeping the dog. The paraphrase is close enough to stay true to the plot, and kind is "note" with no quote marks printed, so this is not a fault. Optional tighter wording, same length (19): "Tommy got his dog." I am not changing my score for this.

7. **Layout note: quote marks are stripped later, not by the layout.** menu-formats/arcade.js lines 172, 215, 260 and 264 wrap the signed note in quote marks whatever note.kind says. The print is only right because app.js libNoteKind (lines 1542 to 1545) strips them afterwards for kind "note". Snatch prints correctly with no quote marks. The fix belongs in the layout, so it does not rely on a regex: pass kind through film() at line 80 and only add the quote marks when kind is "quote". [layout]

Checked and fine: prices (Pie 170, Sausages 140, Cheese 110, house Jellied eels 100 at the foot. Mains 220 and 190. Banoffee 110 sits under the mains. Whiskey 140, house tea 80 at the foot. No repeats within a course). Gaps: the shorter column's gap is filled by a real TMDB still of Mickey at the ropes, and the only other spare space is about 40px at the foot of WATCH FOR, under the 100px limit. The Prep sheet covers the five ticked dishes (Diamond cut cheese, Caravan site sausages, Turkish's fry-up, banoffee pie, whiskey ginger), with matching shopping lines (butter totals 160g, 40g plus 120g). The phone text menu is complete, and its "Don't swallow any of the diamonds" line is a nice touch.

Fact checks: the 86 carat diamond is right as the film says it (Turkish's voiceover on Wikiquote says "eighty-six carat"; Wikipedia's plot says 84, but the film's own line rules). Vet, squeaky toy, undigested shoe and "still didn't shut it up": confirmed on Wikiquote. Mickey knocking out Gorgeous George: confirmed on Wikipedia. Turkish as a slot machine shop owner, so the arcade venue is true: confirmed on Wikipedia. Franky Four Fingers, Bullet Tooth Tony and Brick Top's pigs: confirmed. The fixed fight and Mickey betting on himself: confirmed on Wikipedia.

## What I could not check
- How the card looks on paper (I only saw the rendered PNG and PDF).
- Whether the planner shows the unticked dishes (pie, steak, house lines). The proof PDF has only two pages, so I could not see the planner.
- The round Mickey was meant to go down in. I did not use it in any fix because I could not confirm it.
- No web searches used; all checks were by Wikipedia and Wikiquote raw fetch.

## Bowling layout review: Kingpin (1996)
**Score: 9.0 out of 10**

This one is ready to print. It reads as a league score sheet: navy lanes sign across the top, a BOWLER column, frames 1 to 10, prices pencilled into the little ball boxes, a TOTAL box reading 300 and a lane number box. Lane 17 quietly nods to "seventeen years later", and fans will catch that. Every claim line I checked holds up. The venue is the real National Bowling Stadium in Reno, where the finale was set. The quote is Big Ern's real line. The bull-milking cue, the coffee order, the 1979 Odor-Eaters title and the rubber hand are all in the film. The food suits it well: Pennsylvania Dutch shoofly pie, Amish chicken and noodles over mash, and soft pretzels beside snack bar chilli fries and a malt. Every note describes the food, prints in full at one size and sits at the same size on screen and in the Save PDF. The PDF matches the screen, with no grey boxes, black blocks or clipped words. The Prep sheet covers all five ticked dishes, and the shopping list is complete. I found no locked-rule breaches. What's left are small finish items a sharp-eyed guest might notice, which is why it doesn't score higher.

## Findings

1. **Lane notes handwriting floats off its ruled lines** (screen and PDF, foot of the sheet) [layout]. The ruled lines are drawn 32px apart from the top of the box (bowling.js line 230, `repeating-linear-gradient(... 31px, ... 31px 32px)`). But the box has 8px top padding, a 14px LANE NOTES label and a 4px gap, and the quote runs at 34px x 1.05 = 35.7px per line (line 232). So the first rule runs right under the label, and each line of writing drifts further off its rule. It looks like someone wrote across the lines, not on them. Fix: set the quote's line-height to exactly 32px, and offset the ruling to match the label, e.g. `background-position:0 ${8+14+4-6}px` on the box. Or add `padding-top` to the quote so its first baseline lands on the second rule.

2. **Two rows called "Notes"** (screen and PDF) [layout]. The showtime row's label is "Notes" (line 225, `lab("Notes",28)`), and the box straight under it is "LANE NOTES" (line 231). The two read as a repeat. The bold "Showtime:" inside the row already says what it is. Fix: change the row label to `lab("Cue",28)` or `lab("Serve",28)`.

3. **Uncooked main priced below the cooked one** (screen and PDF, Hot Plates row) [layout, not scored]. Amish chicken and noodles is $5.50 and Gravy train pot roast is $4.95. Beef chuck pot roast is usually the dearer plate. The cause is lines 197 to 198. The prices are sorted high to low and handed out by position, and priceSense keeps a card extra (the pot roast isn't on tonight's cook) under the cooked mains. So this is the shared rule working as written, not a bug. I'm noting it only because a diner might raise an eyebrow. If the owner wants the beef dearer, the cleanest fix is to swap the M order in data/films.json for Kingpin so the pot roast is cooked and the chicken is the extra. That changes the Prep sheet, so it's the owner's call.

4. **Ticket names Ishmael as the bowler** (screen and PDF, ticket under the poster) [film, minor]. data/film-flavour.json "Kingpin (1996)" prop.lines reads "Bowler: Ishmael Boorg / Manager: Roy Munson". That is true to the entry they set out to make. But in Reno, Ishmael breaks his hand and Roy bowls in his place (Wikipedia plot), so a fan could read it either way. It's fine as an entry ticket. If you want the twist instead, use the same length: "Bowler: Roy Munson (sub)" / "Manager: I. Boorg".

5. **Some blank space in the shorter cells** (screen and PDF) [layout, minor]. Chilli cheese fries and Gravy train pot roast each have about two lines of empty space under their notes, because each row takes the height of its taller neighbour (cellH, line 206, then `add`, line 209). That's well under the 100px gap rule and reads naturally on a score sheet. No change needed.

6. **No house lines on this card** [film, not a fault]. data/film-house.json "Kingpin (1996)" has `"fit": []`, so the Chow chow pickle and farm cheese board and the Fresh farm milk don't print. The sheet has no spare height, so leaving them off is correct here. Rule 8 is still met: dearer dish first in each course, no repeated prices, sweets under mains.

Checked and true (no change):
- Venue "National Bowling Stadium": the finale is set and was shot there (Wikipedia National Bowling Stadium article; Nevada Film Office).
- Quote "You're on a gravy train with biscuit wheels." by Ernie McCracken: on Wikiquote under Ernie McCracken.
- Cue "Roy milks what turns out to be a bull": Wikiquote dialogue ("We don't have a cow. We have a bull.").
- "Ishmael's coffee: extra large, lots of cream": Wikiquote ("extra large, two sugars, lots of cream"). It's a short paraphrase, not set out as a quote.
- "The 1979 Odor-Eaters final": Wikiquote ("he's the 1979 Odor-Eaters Champion").
- "Roy's rubber hand": Wikipedia plot.
- "$1 million tournament": Wikipedia plot.
- Lane 17 matches "Seventeen years later" in the Wikipedia plot.
- Rule 4: the poster carries the logo, so the header prints KINGPIN 1996 as text.
- Rule 5: the prop prints under TICKET, from prop.kind, with both lines.
- Rule 7: five winks in a labelled "Watch for" row.
- Prep sheet: all five ticked dishes (fries, pretzels, Amish chicken, shoofly pie, malt) have recipes, and every ingredient is on the shopping list, with butter, milk, cream, egg, onion and brown sugar correctly summed.

## What I could not check
- "Getting Munsoned": Wikipedia confirms the Munson name became a byword for failure, but I could not confirm the exact word "Munsoned" in a written source. Unsure, though very likely right.
- "Big Ern's comb-over": search results list his hair among famous movie haircuts, but I did not open a source that says "comb-over" outright. Unsure, though very likely right.
- Whether the film shows the stadium's name on screen. Sources say the finale is set and shot there, not whether a sign shows it.
- I did not see the on-screen card at full size (the capture is half size), and I did not test other films on this layout, e.g. a three-dish row that would split away from the frame strip.

Sources used: Wikipedia (Kingpin (1996 film), National Bowling Stadium), Wikiquote (Kingpin (1996 film)), [Nevada Film Office, Scene In Nevada: Kingpin](https://nevadafilm.com/?p=8076), [GamesRadar, 20 weird movie haircuts](https://www.gamesradar.com/20-weird-movie-haircuts).

## Clubhouse layout review: Happy Gilmore (1996)
**Score: 9.0 out of 10**

This reads like a real golf scorecard and it suits the film well. Hole, Dish, Yds and Par columns, Front Nine to 19th Hole bars, a pencil ring on one par, a TOT line where the yards (3730) and par (37.30) both add up correctly, and a Marker's Note signed "Chubbs". The film lines all check out against Wikipedia and quote sources: the driving range hustle cue, the alligator, the TV tower on the last green, Shooter stealing the gold jacket, Bob Barker, "It's all in the hips" (Chubbs), the Waterbury Open qualifier, and the Tour Championship gold jacket. Dish names land for fans (Subway sponsor footlong, happy place pitchers, gold jacket lemon bars). Prices follow every rule. The Save PDF matches the screen, with no grey boxes, lost borders or clipped words. Every note prints in full at one size and there are no dead gaps. I found no locked-rule break. What I did find is a handful of small things a sharp guest or cook might notice: the hole numbers skip 5 to 8, the bar drinks are given yardage, the biscuits prep has no butter left to serve with, and the credit line sits inside the Local Rules box. None of them stops it printing, so it sits right on the line at 9.0.

## Findings

1. **Biscuits prep leaves no butter to serve with** (Prep sheet p-2, phone). [film] The note promises "served warm with butter and honey", and the method ends "Serve warm with butter and honey". But YOU NEED lists "140g butter" and step 1 says "Rub the cold butter into the flour", so the cook rubs all 140g in and has none left for the table. The source recipe (data/recipes/happy-gilmore-1996.json line 1) says 100g goes in, so the extra 40g was meant for serving, but the structured recipe lost that split. Cause: data/recipes2/happy-gilmore-1996.json lines 202 to 207 (single 140g butter line) and line 241. Fix: make the ingredient "100g butter" plus a new line "40g butter, to serve" (Dairy), and change step 1 to "Rub 100g cold butter into the flour, baking powder and salt." The shopping total (290g butter in all) stays the same.

2. **Hole numbers jump from 4 to 9** (screen, PDF). [layout] The card prints holes 1, 2, 3, 4, then 9, 10, 11, 19A, 19B, while the TOT line says "9 holes played". The code comment explains the logic (The Turn from 9, Back Nine after), but a golfer reads it as four missing holes, not as a design choice. Cause: menu-formats/clubhouse.js line 242 (holeOf). Fix: number The Turn straight on from the Front Nine (here 5, 6), then the Back Nine (7), so holes run 1 to 7 and then 19A/19B. Or keep 9/10 only when the Front Nine actually fills 8 holes.

3. **The 19th hole is given yardage** (screen, PDF). [layout] 19A shows 595 yds and 19B shows 195 yds. The 19th hole is the bar, it has no length, and that part of the joke breaks right where golfers know it best. Those two rows also push the TOT yards to 3730. Cause: clubhouse.js line 252 (yds printed for every course) and line 256 (outRow sums every course). Fix: print "bar" or leave the Yds cell blank for k==="d", and sum yards over s, m, w only (TOT would read 2940).

4. **Credit line sits inside the Local Rules box** (screen, PDF). [layout] "Prices subject to change. Images: TMDB." prints at the foot of the Local Rules box, right under rule 5, so it reads like a sixth rule. Cause: clubhouse.js line 275. Fix: move the credit under the Showtime line, or into small print under the foot boxes, outside the bordered box.

5. **The breakfast muffin house starter is an odd fit for a dinner card** (screen, PDF, phone). [film] "Bacon and egg breakfast muffins" is the house starter on a night-time Tour Championship Grill menu. Clubhouses do serve breakfast, but it reads like filler next to sliders and cheese balls. Cause: data/film-house.json line 3074 ("s"). Fix, same length: n "Beer battered onion rings and dip", note "Thick onion rings fried in a lager batter with a smoky ranch dip". Or keep the muffins if the owner likes the early tee-time feel.

6. **Scrappy tone barely shows** (screen, PDF). [layout] film-format sets tone "scrappy". You get the grain and a slight tilt on the Marker's Note, and that's it. The card reads clean and country-club, which suits Shooter more than Happy. This is a judgement call, not a fault. Possible fix: in clubhouse.js line 276, let scrappy also tilt the pencil ring a little more and add a grass or mud scuff to the scorecard border, so it looks like Happy's card rather than Shooter's.

## What I could not check
- That Virginia holds pitchers of beer in Happy's happy place (the name behind "Happy place lemon shandy pitchers"). It's not in the Wikipedia plot or on Wikiquote, so it's unsure, though it's a dish name, not a claim line.
- That "Tour Qualifier / Slap shot approved" is a real object in the film. I treated it as an invented prop that fits the plot (winning the Waterbury Open gets Happy his tour spot, which Wikipedia confirms).
- The menu PDF only through the rendered PNG pages, not by opening the PDF itself.
- Live screen behaviour at other sizes. I judged from the half-size capture only.

## Deli layout review: Rumble in the Bronx (1995)
**Score: 8.6 out of 10**

This is a good fit. A New York deli counter board inside Elaine's supermarket suits the film well. The red NOW SERVING 95 sign with TAKE A NUMBER 96 under it is a neat use of the year, and the taped poster fills the left column top to bottom with no second logo. The felt letter board reads cleanly. Every dish note describes the food and prints in full at one size. The lobster noodles sit at the top of Hot Plates at a premium price, house lines sit at the foot, and pudding comes after the mains. The five winks are all true to the plot and sit in a labelled box. The receipt prop prints under its own label. The Save PDF is clean: no grey boxes, no black blocks, borders intact, nothing clipped. The Prep sheet cooks five dishes and every ticked dish is on both the recipe pages and the shopping list. What keeps it under 9 is a run of small things a sharp guest would notice. The counter note is set in big type that makes the receipt look like a sign. The two "house standard" items are the dearest things in their courses. One receipt line can't be confirmed against the film. And the top starter repeats the venue name that sits right above it.

## Findings

1. **The counter note is huge on the receipt (PDF, right column, bottom).** "Ask about the wedding tea. No bikers past the counter." prints in 24px Courier, while the receipt's own lines print at 14px. That makes the paper read as a handwritten sign stuck on a receipt, not a till receipt. [layout] Cause: menu-formats/deli.js line 220 picks the biggest note size from 24 down to 15 that fills the receipt height (`nS=[24,23,...,15].find(...)`). Fix: cap the note at 17px, and fill any leftover receipt height with till furniture in the 14px receipt type (a dashed rule, "THANK YOU, CALL AGAIN", a short row of bars as a barcode) so the column still reaches the foot.

2. **House standards cost more than the signature dishes (PDF, Starters and Drinks).** Jamaican beef patties are the dearest starter at 3.95, above all three film dishes. Hong Kong lemon iced tea at 1.95 costs more than Uncle Bill's wedding iced jasmine tea at 1.50. A plain patty from a Bronx counter would be the cheapest thing on the board, and the special should never cost less than the house tea. [layout] Cause: deli.js line 71 prices each item by its place in the course (`BASE*mult*(1+i*.15)`), so the house line, always last, always gets the top price. Fix: in `prices()`, after the dear-dish pass, give any `it.house` item the lowest price in its course (or one ending below the cheapest plain dish), but keep it printed at the foot.

3. **Receipt line can't be confirmed (PDF, receipt).** "Cereal, rice, one wedding cake order": the Wikipedia plot has Uncle Bill's wedding and the supermarket, but no wedding cake order and no cereal. [film] Cause: data/film-flavour.json, "Rumble in the Bronx (1995)" prop.lines[0]. Fix: swap it for a line built only on confirmed plot, the same length: "Rice, soy sauce, one wheelchair cushion" (39 characters against 36; the cushion that hides Angelo's diamonds is in the plot).

4. **The venue name is repeated (PDF, top of the board).** ELAINE'S SUPERMARKET is the board heading, then the first dish directly below it is "ELAINE'S SUPERMARKET REUBEN BITES". On a real board the shop name would not be on the first item, and it pushes the longest name onto the top line. [film] Cause: data/films.json and data/recipes/rumble-in-the-bronx-1995.json, S[0] name. Fix: "Bronx corner-store Reuben bites" (31 characters against 33). Change both files and the recipe "n" so the Prep sheet matches.

5. **"Golf course almond jelly" is a weak link (PDF, From the Case).** The golf course is the finale (Keung drives the repaired hovercraft over it to run down White Tiger), but nothing about almond jelly says golf, so most guests won't get it. The name is true, just flat. [film] Cause: data/films.json W[0] and the recipe file. Optional fix that keeps the scene and suits the dish: "White Tiger's golf course jelly" (31 characters against 24). Only do this if it still fits on one line at the board's type size.

6. **The ticket tagline is a bit thin (PDF, red ticket).** "NEXT IN LINE / New York welcome. Hong Kong kicks." works and is not a fault, but it sits small and pale (15px, pink on red) under a big heading and is the weakest text on the board. [layout] Cause: deli.js lines 190 and 196. Fix: when the ticket carries the tagline instead of a prop, set the tagline at 17px in white at 90% so the box earns its space.

## What I could not check
- No screen capture exists for deli, so I could not compare the Save PDF against the on-screen card. I judged the PDF page and its PNG only, and ignored audit/cards (it holds the truck version).
- The note "Ask about the wedding tea. No bikers past the counter." (kind "note", by Elaine) fits the plot: the bikers trash her store. Whether Elaine has any part in Uncle Bill's wedding I could not confirm from the Wikipedia plot, so I can't say whether the "wedding tea" angle is hers. Unsure.
- The prop's "wedding cake order" and "Cereal" lines: unsure, see finding 3.
- Confirmed against Wikipedia: venue (Bill sells his supermarket to Elaine), cue (the bikers trash Elaine's supermarket), and all five winks (the hovercraft on the golf course, the fights at the store, Elaine taking over, the diamonds in Danny's wheelchair cushion, Tony's motorbike gang). I made no web searches.
- In the Prep sheet's Reuben step 1 the timer reads 8 min where the recipe says toast for 4 minutes (it may include the cutting). That is shared Prep code, not this layout.

## Dimsum layout review: Men in Black 3 (2012)
**Score: 8.7 out of 10**

This is a clean, well built card and the Save PDF matches the screen line for line: no grey boxes, no black blocks, borders intact, nothing clipped. Every film line I could check holds up. The overheard quote is J's real line to Wu, "Shrimp and bok choy" is K's real order at Wu's, the ticket date of July 15, 1969 is the day J lands, and all five winks are real scenes. Prices obey rule 8, notes all describe food and print in full, the title box prints title and year beside a poster that carries the logo, and the five ticked dishes are exactly the five on the Prep sheet and shopping list. What keeps it under 9 is how it reads as an object. It is a Chinese yum cha tick sheet headed Wu's Chinese Restaurant, but six of its nine rows are American diner food (hot dogs, meatloaf, cheeseburgers, apple pie, espresso martini, champagne), so a guest sees a diner menu printed on a dim sum form. A fan will get the time travel joke, but the "real object" feel slips. Smaller points: a cocktail dearer than any main on a 1969 price card, an espresso martini on a 1960s styled card, and a rice plate sitting in Small Plates.

## Findings

1. **Diner menu on a yum cha sheet** (screen and PDF, order sheet). [film] Only the dumplings, shrimp and bok choy and the house crab rangoon belong on a Wu's dim sum order sheet. "Kitchen Specials" at a Chinese restaurant prints Agency meatloaf and Launch day cheeseburgers, and "Sweet" is a diner apple pie. The film's own split is real (Wu's in 2012, Coney Island, the pie diner and Apollo in 1969), but the dimsum layout sells one venue. Cause: data/film-format.json "Men in Black 3 (2012)" sets format "dimsum" over a menu in data/films.json that is mostly American. Fix, either: (a) keep dimsum and swap the house main feel by renaming one main toward Wu's, e.g. "Agency meatloaf" to "Wu's char siu pork" (note "Honey roast pork sliced thin over rice with greens"), recipe to match; or (b) give this film a 1969 diner layout and keep Wu's for the sign and quote only. Option (a) is the cheaper one.

2. **Drink dearer than every main** (screen and PDF). [layout] Black suit espresso martini is 2.95 and champagne 2.25, while the dearest main is 1.95. On a 1969 card a cocktail at half again the price of meatloaf looks wrong to anyone who reads prices. Cause: menu-formats/dimsum.js line 64 to 68, the drinks multiplier .3 is overridden upward by window.priceSense, and tidyPrices (line 73 to 97) only caps sweets under mains, not drinks. Fix: in tidyPrices, after the sweets pass, cap drinks at or under the dearest main the same way (step down from max main), or at least under it for era index 2 and earlier.

3. **Espresso martini on a 1960s card** (all faces). [film] The drink was created in the 1980s, so on a card set in 1969 with 1969 prices it is an anachronism a cocktail fan may spot. The card does mix 2012 Wu's with 1969, so this is minor. Fix in data/films.json K[0] and data/dish-names.json: "Black suit espresso martini" to "Black suit vodka martini", note "Vodka and dry vermouth stirred ice cold with a twist" (recipe and shopping to match), or keep it and accept it as a 2012 Wu's drink.

4. **Rice plate in Small Plates** (screen, PDF, row A2). [film] "Agent K's shrimp and bok choy" is a full stir-fry "on rice" with 500g prawns and 300g rice, priced 0.85 as a small plate. It is K's real order so it earns its place, but it reads as a main. Fix: drop the rice from the note so it reads as a shared plate, "green prawns and baby bok choy wok-tossed with garlic, ginger and oyster sauce" (and move the rice to "serve with" in the recipe), or move it into mains.

5. **Latent clipping in the frame text** (not hit by this film). [layout] Several fixed lines can still be cut for other films, which would break rule 2 in spirit: sign clamp(1) at dimsum.js line 180, venue white-space:nowrap with overflow:hidden at line 179, title ellipsis at line 173, prop title clamp(2) at line 250, overheard quote clamp(3) at line 254, cue clamp(2) via cueLine line 143, dish name clamp(3) at line 221. Here everything fits. Fix: step the font down until it fits (as winks do at line 185) rather than clamping.

6. **Price style for 1969** (screen and PDF, price column). [layout] Under a dollar prints as "0.95", "0.40". A 1960s card would print ".95" or "95¢". Cause: money() at dimsum.js line 63 only uses the ".95" form when era index is under 2; 1960s is index 2. Fix: change the test to ei<=2. Cosmetic.

## What I could not check
- Whether the pie scene is in a diner specifically (cue: "young K and J stop for pie at the diner"). Wikiquote confirms the pie scene and K's "We need pie", but neither source names the venue. Unsure, likely fine.
- "Ask about the fish, not the kitchen" in the sign is a wink at the alien fish scene at Wu's, which is confirmed; the phrase itself is invented house copy, not a claim.
- I did not render the layout myself; I judged from the supplied proofs in /tmp/proof/ and the code on branch wip/new-formats.
- Sources used: en.wikipedia.org Men_in_Black_3 (plot, cast incl. Mr. Wu), en.wikiquote.org Men_in_Black_3 (Earth fish line by J, "Shrimp and Bok Choy" by K, "Target vector: July 16, 1969", Chrysler Building arrival dated July 15 1969, Lunar Max, Coney Island, pie scene). No web searches used.

## Drivein layout review: Ghostbusters: Afterlife (2021)
**Score: 9.0 out of 10**

This is a clean, confident card and it suits the film. Spinners Roller Hop is the real carhop diner in Summerville where Lucky works on skates. The Grooberson line is his actual dialogue. Every wink and the cue match the plot, and the menu itself (okra, cornbread, chicken fried steak, smash burgers, malts, root beer) is exactly what that Oklahoma diner would serve. The Save PDF matches the screen with no grey boxes, lost borders or clipped words. The neon venue glow survives, the poster sits whole on the screen with its logo, and the header carries the title as text, as rule 4 asks. All notes describe food and print in full at one size. Prices step down in each course, house lines sit at the foot and sweets cost less than mains. The Prep sheet covers all five ticked dishes, and their shopping is on the list. Nothing breaks a locked rule. What is left is finish work: straight quote marks on the overheard line, wrapped dish names that lose their dot leaders, and a prop slip that reads a little oddly under a bay number. A fan would grin at the Muncher fritters, the Ecto-1 burgers and the Mini-Puft cue.

## Findings

1. **Wrapped dish names lose their dot leader, so prices float.** On screen and in the PDF, three of the five left-column dishes wrap ("Farmhouse pan cornbread, honey butter", "Muncher's corn fritters with jalapeño ranch", "Oklahoma chicken fried steak with gravy"). Each one drops its dotted leader, and the price hangs alone at the far right of the second line. The right column keeps leaders on every line, so the two columns look like they come from different menus. [layout] Cause: menu-formats/drivein.js line 135 to 136 (`wraps` turns `lead` off whenever a name runs to two lines). Fix: keep the leader on wrapped names by drawing it after the last line of the name, for example by putting the name in an inline span and the leader in a flex row on its last line. Or allow a name to run a little under the price column before wrapping.

2. **The overheard quote prints with straight typewriter quotes.** The PDF and screen both show `"Science is giving yourself the plague and gambling on the cure."` with straight marks, which looks cheap next to the Yellowtail and Arvo type. [layout] Cause: menu-formats/drivein.js line 236 (literal `"` around `${esc(n.text)}`). Fix: use curly quotes, `&ldquo;${esc(n.text)}&rdquo;`.

3. **The prop slip under the bay number reads a bit oddly.** "BAY 21 / GHOST TRAP SLIP / Seized by police / Contents: Muncher" sits where a carhop's order slip goes. It can read as if bay 21's order was seized. The facts are right: Wikipedia confirms the kids catch Muncher and are arrested, and their equipment is seized. But "slip" is not what a police item would be called. [film] Cause: data/film-flavour.json, Ghostbusters: Afterlife (2021) prop. Fix (optional, same length): kind "tag", title "Evidence tag" in place of "Ghost trap slip", lines kept as "Seized by police" / "Contents: Muncher". The label then reads EVIDENCE TAG, which matches the sheriff's office scene.

4. **The spread gaps are slightly airy (minor, within the cap).** There is about 50px of air between the corn fritters note and FROM THE KITCHEN on the left, and about 45px between Mini marshmallow men and SHAKES AND SODAS on the right. Both stay under the cap and the still fills the real hole, so this passes rule 3. It is noted only because the card would look tighter at one tier larger type. [layout] Cause: menu-formats/drivein.js line 201 to 202 (spare split into course and item gaps). No change needed unless the tier picker gains a step between {d:20} and {d:19}.

## What I could not check
- I confirmed the venue name "Spinners Roller Hop" and its carhops on skates on the Ghostbusters fan wiki (Summerville and Lucky Domingo pages, plus the casting call for "a local American Graffiti style carhop on roller skates"). Wikipedia's plot does not name it, and I could not open a transcript (it was blocked by Cloudflare).
- I confirmed the Mini-Pufts supermarket scene (the Walmart aisle) on the fan wiki and in Wikipedia's production notes, not in its plot section.
- I confirmed the quote, said by Gary to Phoebe, on Wikiquote. I did not cross-check it against IMDb quotes.
- I did not test the PDF in a real printer, only at 200 dpi from the Save PDF. I did not check the screen at full size (the capture is half size).
- The shopping list shows one "2 L vegetable oil" for both the okra (1 L) and the fries (2 L). app.js line 1349 shows this is on purpose (one shared frying pot), so I have not marked it down.

## Foodcourt layout review: Jurassic World (2015)
**Score: 8.8 out of 10**

This is a good fit and close to ready. A theme park food court tray liner is exactly where Jurassic World guests would eat, and the card reads like one. The "Park directory" lightbox carries the whole poster, the red stall fascia reads "Main Street Food Court", and the dashed coupon strip holds a park admission ticket and a real Claire line. Every flavour line checks out against Wikipedia, Wikiquote or a plot source: the venue, the sign, the cue, the quote with its speaker, all five winks and the ticket. Dish notes all describe the food. Nothing is clipped or shrunk, there are no gaps, the logo rule holds (the poster has the logo, so the coupon prints title and year), and the Save PDF matches the screen with no grey boxes or lost borders. The Prep sheet covers all five ticked dishes and the shopping list adds up. What keeps it just under 9 is the drinks pricing: a $3 frozen margarita under a $4 lemonade is something a guest would pause at. Add the missing dollar signs and one untidy leader and it reads slightly less like the real board. No locked rule is broken.

## Findings
1. **House cocktail priced under the soft drink.** Seen on screen, PDF and phone. Under Drinks, "Theme park frozen lemonade 4" sits above "Frozen margarita 3". No food court sells a frozen margarita for less than a lemonade, and the card's own wink "Seven bucks a soda" makes the cheap drinks stand out even more. [layout] Cause: menu-formats/foodcourt.js lines 202 to 204. The house-line clamp forces any house line below the cheapest dish above it. With a single drinks dish at the 0.3 drinks multiplier (line 61, `mult` d:.3, modern BASE 12, so about 4), the margarita lands at 3. Fix: when the house drink is `alc`, raise the drinks course base before the clamp so the column still steps down at real prices. For example, multiply `mult.d` by 1.75 when `ctx.menu.d` holds an alc house line, which gives roughly lemonade 7 and margarita 6. A 7 on the lemonade would also echo "seven bucks a soda" for fans.
2. **Prices print as bare numbers (10, 8, 14, 3).** Seen on screen and PDF. A modern food court board prints "$10" or "10.00". Bare numbers look more like an item count than a price on a 2000s-on liner. [layout] Cause: foodcourt.js line 59, `money()` returns `String(Math.round(v))` for era 6 and up, and `course()` at line 111 takes no `price` formatter from foodcourt's `o` (line ~208). Fix: pass `o.price=(p)=>"$"+p` for band 3 (modern) in foodcourt only, or print `.00`-free "$10".
3. **Leader stub on a wrapped dish name.** Seen on screen and PDF. "Main Street cinnamon sugar pretzels" wraps to two lines, and its dotted leader shrinks to a five-dot stub floating beside line one, with "8" hanging off it. Every other leader is a full run, so this one looks like a glitch. [layout] Cause: foodcourt.js line 110, the leader is `flex:1;min-width:16px` beside a two-line name. Fix: when `wrapLines` says the name takes more than one line, drop the leader for that row (or align price and leader to the last line with `align-items:flex-end`).
4. **Prep sheet last page mostly empty.** Page 3 holds only the frozen lemonade. Known shared item, not marked down.

All flavour lines confirmed, no film fixes needed:
- Quote: "We needed something scary and easy to pronounce." Claire says it to Owen about the Indominus name (Wikiquote).
- Seven bucks a soda: Hoskins, "places like this, charge seven bucks a soda" (Wikiquote).
- Lowery's $150 eBay shirt (Wikiquote). Fallon's Gyrosphere video (Wikiquote, Wikipedia cast).
- Pterosaurs flee the aviary, and Claire frees the T. rex (Wikipedia plot).
- Main Street, the monorail into the main gate, and the Mosasaurus feeding show where it bursts up and grabs the dangling shark (Filmsite plot). These back the venue, the level, the ticket line and the cue.
- Owner rule check: the five ticked dishes (prawns, cheese balls, short ribs, mousse, lemonade) are all on the Prep sheet and in the shopping list. Pretzels and fish tacos are printed but unticked, as intended.

## What I could not check
- The film still on the menu (Owen and Claire beside the wrecked Gyrosphere and a jeep) looks like the right film, but I did not match it to an exact scene.
- I did not confirm that the Main Street area in the film has a food court by that name. Main Street itself is confirmed, and a food court there fits the park.
- I did not test the on-screen card in a live browser. I compared the half-size screen capture with a 200 dpi render of the Save PDF.
- Sources: Wikipedia and Wikiquote raw pages for Jurassic World; [Filmsite plot](https://Filmsite.org/series-jurassicpark4.html). One web search used.

## Hospital layout review: Terminator 2: Judgment Day (1991)
**Score: 8.9 out of 10**

This is a strong card and very close to ready. It reads as a real patient meal order on a clipboard: wristband strip with barcode, "PATIENT: SARAH CONNOR", BED 101 (a nice nod to the Cyberdyne Systems Model 101), a meal and diet row, pen ticks, and a 1995 kitchen stamp that matches the year the story is set. The Save PDF page matches the screen exactly, with no grey boxes, black blocks, lost borders or clipped words. Every note prints in full at one size, the house lines sit at the foot of their courses, the film still fills the spare height in the right column, and the poster carries the logo so the header shows the title and year. All five ticked dishes are on the Prep sheet and shopping list. The quote, winks, prop, cue and venue all check out. What keeps it just under 9 is small stuff a sharp guest would spot: the lager's note just repeats its name, three dish names lean on Enrique's camp, the quote's by-line sits awkwardly, and the margarita's name promises liquid nitrogen that the recipe doesn't use.

## Findings

1. **Lager note repeats its own name** (screen, PDF, phone). Name "Ice cold Mexican lager with lime", note "Ice cold Mexican lager with a wedge of lime in the neck". It technically describes the drink but adds nothing, and it reads lazy next to the other notes. [film] data/film-house.json, "Terminator 2: Judgment Day (1991)" d.note. Fix (55 characters, same length): "Crisp pale lager served by the bottle with a lime wedge".

2. **Three dish names lean on Enrique's camp** (screen, PDF, phone). "Enrique's bean and cheese quesadillas", "Desert camp tacos" and "Enrique's camp churros" all point at the same scene, two of them with the same "Enrique's" opener, while big set pieces like the biker bar get no dish at all. Fans notice the repeat. [film] data/films.json, T2 S[0] name (also the "n" in data/recipes/terminator-2-judgment-day-1991.json). Fix (37 characters, same length): "Biker bar bean and cheese quesadillas". The Corral biker bar scene where the T-800 takes the clothes, boots and motorcycle is confirmed on Wikipedia's cast and filming notes.

3. **Quote by-line reads like a second line of the quote** (screen, PDF). "The Terminator" sits flush left under the quote in the same 44px pen, so it doesn't read as a sign-off. The code wants a short quote's by-line set right-aligned on its own line (byOwn), but its width guess for Caveat (.42 per character) says this 33-character quote needs two lines, when in practice it fits on one, so byOwn stays false. [layout] menu-formats/hospital.js lines 263 to 268 (nS loop, byOwn, the by-line span). Fix: measure Caveat at about .36, or right-align the by-line whenever it wraps onto its own line, and print it a step smaller than the quote (for example 0.7 of nS) with a leading dash, so it reads "- The Terminator".

4. **Margarita name promises liquid nitrogen** (screen, PDF, phone, Prep sheet). "Liquid nitrogen frozen margarita" is a good wink at the T-1000 freezing scene, but the drink is a plain blender slush. A guest may expect smoke and nitrogen, and a home cook might try it, which isn't safe without proper kit. [film] data/films.json T2 K[0] name. Fix (32 characters, same length): "T-1000 frozen margarita, on ice" works if you want to keep the wink without the promise. Or keep the name and add "(no nitrogen, just ice)" to the Prep sheet's make ahead line.

5. **Small gap in the prop box** (screen, PDF). The pinned Patient Card leaves about 30px of plain box above "Images: TMDB." It's not a rule breach (under 100px) but it's the only spot on the card that looks unfinished. [layout] menu-formats/hospital.js line 269 (justify-content:space-between in the prop box). Fix: put the credit straight under the card with a small top margin and centre the pair vertically, or step the prop type up one size when there are only two lines.

6. **Unused recipe text holds an unconfirmed film claim** (not printed). The films.json recipe text for the empanadas ends "The kind Enrique packs for the run to the border." Nothing in the sources says Enrique packs food. The printed Prep sheet and phone use data/recipes/terminator-2-judgment-day-1991.json, which doesn't have that line, so no guest sees it. [film] data/films.json T2 S[1] recipe field. Fix: drop the sentence, or replace it with a plain cooking line such as "Rest five minutes before serving so the filling sets."

## Checks that passed
- Quote: "Come with me if you want to live." is said by the Terminator to Sarah as he offers his hand at Pescadero (Wikiquote). Printing it under "Overheard on the ward" fits the scene.
- Venue: the Pescadero State Hospital where Sarah is held (Wikipedia plot).
- Winks: the T-1000 rising out of the hospital floor, John's dirt bike in the flood control channel (movie-locations.com, Wikipedia filming notes on the Bull Creek spillway), NO FATE carved into a table (Wikiquote), the thumbs up as it's lowered into the vat (Wikipedia plot), and the steel mill and molten steel vat (Wikipedia plot). "Model 101" is the film's own term (Wikiquote: "Cyberdyne Systems Model 101").
- Prop: Dr Silberman is Sarah's psychiatrist (Wikiquote cast list and scenes). It prints under CHART with its lines.
- Cue: Enrique Salceda's desert camp (filmsite.org, Wikiquote cast list, movie-locations.com desert compound).
- Stamp 1995 and the story's year: Wikipedia says "In 1995 Los Angeles".
- Galleria food court burger: the mall is called the Galleria on filmsite.org.
- Prep sheet: quesadillas, empanadas, tacos, churros and margarita are ticked on the card, and all five appear in How to make it with every ingredient in the shopping list (limes 2 plus 5, eggs 3 plus 1, onions 1 plus 1 all add up). The elote and lager house lines are unticked and not cooked, as the owner intends.
- Phone menu: full and correct. Its dish order and course names are shared code, already logged.

## What I could not check
- "For the criminally insane" as part of the hospital's name. It's widely used and fits the film, but Wikipedia, Wikiquote, filmsite.org and movie-locations.com don't print it, so I'm unsure.
- Ward F. The ward letter comes from the film number (menu-formats/hospital.js line 190), not from the film. It isn't a claim, but I couldn't confirm any ward letter for Sarah.
- "Canal" for the flood control channel: the term fits the scene, but the sources say "flood control channel".
- I couldn't check font rendering on a real printer. I judged from the 1x proof PNG and the half-size screen capture.

## Reception layout review: Four Weddings and a Funeral (1994)
**Score: 9.0 out of 10**

This looks like a real wedding table: a letterpress menu card in a double rule, a top table place card for Charles as best man with "Please try not to be late", a Watch For card, the toast card, a still, and the poster on a red easel with the Glenthrist Castle invitation hung on its legs. Every claim line I checked holds up. Gareth's toast is word for word against Wikiquote. Angus and Laura, Charles as best man, Charles and Scarlett running late, Father Gerald, David signing at the altar, Matthew's poem, Glenthrist Castle and the Lucky Boatman all match Wikipedia or the film's locations record. All notes print in full at one size and describe the food. No logo box, no clipped words, and the Save PDF matches the screen. All five ticked dishes are on the Prep sheet and the shopping list. What is left is small: one wink with a detail I could not confirm, a debatable order in the starters, and the Showtime line sitting on what is otherwise a guest's menu card. A fan would grin at this.

## Findings

1. **Wink "Carrie and the rain on the doorstep" may not match the scene** (screen, PDF: Watch For card, last row) [film]. The rain scene is real. Movie-locations puts it "at Charles's flat: 22 Highbury Terrace", and in Wikiquote Charles talks to her "in the rain". But nothing I found puts it on a doorstep, and as I remember it they talk in the street (memory only, so unsure). Cause: data/film-flavour.json line 6413. Fix with a line that is safe either way and about the same length: "Charles and Carrie kissing in the rain" (38 characters against 35).

2. **Starters: the ploughman's board prints below the goat's cheese oatcakes** (screen, PDF, phone) [layout]. A ploughman's board with cheddar, thick ham, eggs, bread and apple is the bigger and dearer plate. Neither dish matches anything in the DEAR list, so it comes down to the tie-break, which puts dishes cooked tonight ahead of card extras (menu-formats/reception.js line 154, DEAR at line 151). No prices print, so a guest will not notice. Still, rule 8 asks for the dearer dish first. Fix: add a low tier for boards that carry cured meat, for example `[/\b(ham|charcuterie|cold cuts?)\b/i,1]` checked on the note only, so a ploughman's beats a vegetarian oatcake but never beats salmon (the 26b ruling on boards still stands).

3. **"Showtime:" prints inside the guest menu card** (screen, PDF: foot of the menu card) [layout]. A real wedding menu would not carry a serving cue for the cook, so this is the one line that breaks the illusion. Cause: menu-formats/reception.js line 175. Fix: move the cue onto the linen under the menu card, in the same small italic as the "Images: TMDB." credit, or onto the back of the place card. If it has to stay on the card, label it "From the Kitchen:" so it reads as a note from the caterer.

4. **Invitation reads venue first** (screen, PDF: prop card on the easel) [film]. "GLENTHRIST CASTLE / Carrie and Hamish request / the pleasure of Charles's company" is correct (movie-locations has the third wedding at "Glenthrist Castle, Perthshire"), but a real invitation puts the couple's request first and the venue last. Minor. Cause: data/film-flavour.json lines 6417 to 6420. Fix: keep the title and change the lines to "Carrie and Hamish request Charles's" / "company at the castle chapel" (same number of lines, about the same length).

5. **Things that fit on this film but could clip on others** (code only, nothing visible here) [layout]. The prop title and prop lines use nowrap with an ellipsis (reception.js lines 197 to 198). The place card name (line 229) and the venue on the welcome sign (line 185) use nowrap with overflow hidden. The toast is capped at five lines (line 240). With these words everything prints whole, so this is not a fault on this card. It is a risk to rule 2 on films with longer lines. Fix: shrink the font to fit before cutting, the way vS already does for the venue.

## What I could not check
- Whether the final rain scene happens on a doorstep or in the street (finding 1). Wikipedia and Wikiquote only say Charles's flat, in the rain.
- Which scene Gareth's toast is from. Wikiquote gives the words and the speaker but not the scene. The line opens "A toast", so the "From the Toasts" label holds either way.
- The film shows the inn as "The Lucky Boatman", but movie-locations' photo captions also call it the "Jolly Boatman". I went with "Lucky", which is what the page's own text says.
- Which scene the TMDB still comes from. The caption is just the title and year, so nothing needs checking.
- I used 2 web searches and 1 page fetch.

## Skilodge layout review: Better Off Dead (1985)

**Score: 8.8 out of 10**

This is a strong card and very close to ready. The ski lodge setting suits a film built around the K-12. The trail markers as course headings, the snow report board and the timber wall all read like a real lodge menu board. The fact checking holds up well: Johnny's "I want my two dollars!" is his real line. The receipt reads "Four weeks, twenty papers", which is Johnny's own dialogue (Wikiquote). Pig Burgers, the Cosell-voiced drag racer, Charles snorting snow, Monique pretending she cannot speak English and Mom's creeping dinners are all confirmed by the Wikipedia plot or Wikiquote. Every note describes the food and prints in full at one size. Prices step down in each course with the house lines at the foot, and the sweet sits under the cheapest main. The logo is left to the poster and the header prints the title and year. The Save PDF matches the screen with no grey boxes, black blocks or clipped words. All five ticked dishes are on the Prep sheet and the shopping list. Nothing breaks a locked rule. What keeps it under 9 is polish: one wink just repeats the main plot, the Overheard box is mostly empty around a short quote, "Mom's" main misses the film's best food joke, and the sign line crowds the header rule.

## Findings

1. **Wink 2 is the main plot, not a wink, and it echoes the sign line.** Screen and PDF, Snow Report: "Lane's plan to ski the K-12 slope". The sign directly above the menu already says "Race day on the K-12", and the K-12 run is the film's whole spine, so a fan gets no "I spotted it" moment. [film] Cause: data/film-flavour.json line 10323. Fix (34 characters for 33): `"The ski pole swordfight with Ricky"`. The Wikipedia plot confirms Lane beats Ricky in a ski-pole swordfight.

2. **The Overheard box is mostly empty.** Screen and PDF, foot right: a one-line quote sits in a 196px box, with about 50px of blank card above and below it. It reads as a gap next to the full Snow Report. [layout] Cause: menu-formats/skilodge.js line 256 sizes the quote at 30px for anything under 90 characters, so short quotes never grow. Fix: add a size step for short quotes, e.g. `nS=n.text.length>140?24:n.text.length>90?27:n.text.length>40?30:40`. The clamp of 3 lines stays.

3. **"Mom's" main misses the film's food joke.** Screen and PDF, Blue Runs: "Mom's chicken and mushroom rice bake" is a plain, sensible bake. In the film Jenny's dinners are creepy, crawling messes, and her famous line is "It's got raisins in it. You like raisins." (Wikiquote). Fans will expect that gag and the dish name does not land it. [film] Cause: data/films.json (Better Off Dead M entry) and data/recipes/better-off-dead-1985.json. Fix, if the owner is happy for the recipe to change: name `"Mom's chicken rice bake, with raisins"`, note `"Chicken thighs and mushrooms baked on rice with raisins, thyme cream"`. Add 60g raisins to the recipe and shop list. The note still describes the food. This is optional. The current dish breaks no rule.

4. **The sign line crowds the header rule.** Screen and PDF, card header: "RACE DAY ON THE K-12" sits about 2 to 3px above the double rule, while every other block on the card has room to breathe. The screen capture shows it almost touching. [layout] Cause: menu-formats/skilodge.js lines 240 to 242. The header row is `HH-26` high with `align-items:center`, and the 44px venue at line-height 1.2 plus the 15px sign fills it. Fix: give the header row `padding-bottom:8px;box-sizing:border-box`, or drop the venue line-height to 1.05.

5. **The tagline spelling does not match the menu.** Phone text menu: "Paper boy's coming. Grab a burger." The printed menu spells it "Paperboy's" (fries). It is small, but a guest reading both will see the mismatch. [film] Cause: data/films.json, Better Off Dead `T`. Fix (same length less one): `"Paperboy's coming. Grab a burger."`.

6. **Bare timber under the receipt.** Screen and PDF, bottom left: roughly 120px of empty wood below the receipt slip and to its left, beside the Snow Report. It is backdrop, not a content gap, so it is not a rule 3 fault. Still, the left side looks unfinished next to the busy right side. [layout] Cause: menu-formats/skilodge.js line 194 caps the slip at its content height and line 189 places it at a fixed `TY`. Fix: centre the slip in the space between the frame bottom and the page foot (`TY=36+PA.h+40+Math.round((H-36-(36+PA.h+40)-slipH)/2)`), or tilt and drop it 30px so it lines up with the foot boards.

## What I could not check

- The cue "when Roy and Beth walk into Pig Burgers". Wikipedia confirms Lane is fired at Pig Burgers in front of Roy and Beth "who are there on a date". I could not confirm that they are shown walking in, so that wording is unsure. A safe line of about the same length: "Serve the mains when Lane gets fired at Pig Burgers."
- The TMDB still (Lane and Monique on a black car in a stadium with red seats). It looks like the closing Dodger Stadium scene with the Camaro, but I could not confirm the frame.
- The venue name "K-12 Ski Lodge" is invented. It is true to the film's world (the K-12 is the town's top run), but no lodge by that name is confirmed.
- The phone menu and Prep sheet were checked only against what is printed. I did not cook-test the recipe quantities.

---

# review26d

## Arcade layout review: Snatch (2000)
**Score: 8.6 out of 10**

A strong card. The prize counter board reads well, every note prints in full at one size, the real TMDB still of Mickey in the ring fills the short column, the marquee prints "SNATCH, 2000" instead of repeating the poster's logo, and the Save PDF matches the screen with no grey boxes, lost borders or clipped words. The film lines check out: Turkish's note is a close, plot-true take on his real closing narration (squeaky toy, undigested shoe, 86 carat diamond), "fair fights" echoes his own boast that nobody takes a dive in his fights, and the builder's tea is a nice nod to Brick Top's "Get us a cup of tea, will you, Errol?". The Prep sheet covers all five ticked dishes and the shopping list is complete. What keeps it under 9: a sirloin steak priced below a breakfast fry-up, a bet slip that reads like a caption rather than a slip, a steak note that says "rare" when the recipe cooks it medium rare, and a neon video-game look (high scores, prize tickets) that suits a family fun park more than Turkish's grubby London fruit machine shop.

## Findings

1. **Steak priced under the fry-up.** Screen and PDF, Main Games: "Turkish's full English fry-up 220 TIX" sits above "Avi's New York strip steak 190 TIX". Any guest will notice a sirloin with creamed spinach costing less than bacon and eggs. [layout] Cause: arcade prices are positional (menu-formats/arcade.js lines 189 to 191, `1+i*.15` from the shared `prices()` at line 66), and app.js line 37 then caps a card extra (the steak, which has no tested recipe) below the cooked main (the fry-up). The order rule (line 200 to 202) then puts the dearer fry-up on top, which is correct for rule 8 but wrong for sense. Fix: in the arcade ticket step, weight a main's tickets by its likely cost (steak, sirloin, lobster, roast over breakfast, burger) before the extra cap, or let an extra keep its own price when its name is a premium cut and drop the cooked main to the foot instead. Film-side alternative: make the steak tonight's cooked main in data/recipes/snatch-2000.json so it carries the top price.

2. **Bet slip reads like a caption, not a slip.** PDF and screen, Bet Slip box: "Fight: Mickey, fixed to lose / Bet: on himself". A real slip names the selection and the stake, and "on himself" has no subject on a slip. It also wraps to leave "to lose" alone on its own line. [film] Plot is right (Wikipedia: Mickey "knocks out his opponent, having secretly bet on himself"), the wording is not. Cause: data/film-flavour.json lines 11276 to 11277. Fix: "Fixed: Mickey to go down" and "Stake: Mickey to win" (both fit one line on the slip).

3. **Steak note says rare, recipe cooks it medium rare, and the potatoes are baked.** Screen, PDF and phone: "Sirloin seared rare, creamed spinach and buttered potatoes". The as-written recipe sears to 54C (medium rare) and serves a split baked potato with horseradish cream. Rule 1 asks the note to describe the food; this one describes slightly different food. [film] Cause: data/films.json, Snatch M[1] short note. Fix: "Sirloin seared medium rare, creamed spinach, baked potato" (same length band, one line).

4. **The look is a neon video arcade, the film's place is a fruit machine shop.** Whole card. Turkish runs a slot machine shop (Wikipedia: "slot machine shop owner"), and the sign rightly says "Fruit machines". But the board borrows ticket-redemption and high-score furniture (TIX prices, HIGH SCORES, INSERT TOKEN, gold TOKEN coins) and a clean Audiowide neon style. Fruit machines pay out cash, not tickets, and the "gritty" tone barely shows. Fans will still grin at MIK, TUR and TOM on the high score table, so this is a fit note, not a fault. [layout] Cause: menu-formats/arcade.js line 127 (era band 3 palette) and the fixed labels at lines 171, 222 and 256. Fix: let `arcade` flavour set the insert and shelf labels for this film (for example `"insert": "INSERT 20P"` and `"counter": "CASH DESK"` in data/film-flavour.json under Snatch "arcade"), and raise the wear on the gritty tone so the panel looks used.

5. **Showtime cue lands early.** All three outputs: "Serve the mains when Mickey knocks out Gorgeous George." True to the plot (Wikipedia: George "is knocked out by bare-knuckle boxing champion Mickey O'Neil"), but it happens in the first act, so guests would barely be through starters. [film] Cause: data/films.json Snatch "P". I could not confirm the exact minute; if it is under about 25 minutes in, a mid-film moment would serve the table better, for example "Serve the mains when Mickey takes his first dive in the ring." only if checked against the film, otherwise leave as is.

6. **Small one: the 86 carat diamond.** Watch For box, "The 86 carat diamond". The film's own line (Wikiquote, Turkish's closing narration: "an eighty-six carat diamond") backs this, though the Wikipedia plot says 84. Not a fault; noting it so nobody "fixes" it to 84 later. [film]

## What I could not check

- The exact running time at which Mickey knocks out Gorgeous George (finding 5).
- Whether Turkish is ever shown eating a fry-up, or Tony a banoffee pie. These are just attributions with no claim, so I did not mark them down.
- The TMDB still and poster are assumed to be the real Snatch images (they look right: Brad Pitt as Mickey in the ring, the theatrical poster).
- Proofs only, no live render of my own. arcade.js line 172 wraps the bezel note in quote marks, but the PDF, screen and audit faces all print it with none, so something upstream strips them; I judged what prints.

## Deli layout review: Rumble in the Bronx (1995)

**Score: 8.4 out of 10**

This is a good card and it reads as the real thing: a black felt letter board over a deli counter, red push-in headings, a glowing NOW SERVING 95 sign, a take-a-number ticket and a till receipt taped up beside the poster. Every claim line checks out against the Wikipedia plot (the hovercraft run onto the golf course, the diamonds in Danny's wheelchair cushion, Elaine buying the store, Tony's bikers, the bikers trashing Elaine's supermarket for the cue). All nine dish notes describe food, print in full at one size, nothing is clipped, and the Save PDF page is clean with no grey boxes or lost borders. It misses 9 for three reasons. The price ladder runs upward by position, so the house filler lines are the dearest items in their courses (a Jamaican beef patty dearer than the bao). The receipt prints its counter note at a jumbo 24px that no till would print. And the receipt's own lines and Elaine's note are weak, so the receipt doesn't earn the grin the rest of the board does.

## Findings

1. **House lines are the dearest items in their course.** PDF, centre board: Jamaican beef patties (house line) are 3.95, the dearest starter, above Danny's bao at 3.50. Hong Kong lemon iced tea (house line) is 1.95, above the signature Uncle Bill's iced jasmine tea at 1.50. Every course with no lobster-style dish runs cheapest at the top and dearest at the foot, which is the reverse of how a board is read, and a Bronx patty for nearly four 1995 dollars is the item a guest would query. [layout] Cause: menu-formats/deli.js line 71 prices by position (`BASE[ei]*mult[k]*(1+i*.15)`), and house lines always come last (line 238 keeps them there), so they always take the top price. The re-rank at lines 83 to 87 only runs when a course has a DEAR dish. Fix: in `prices()`, after the dedupe at line 81, sort each course's prices high to low for the non-house dishes in menu order, then give each house line the lowest price in its course minus one ending step (for example 1.95 then 2.50 then 2.95 becomes 2.95, 2.50, 1.95 for the film dishes, with the patty at 1.50). That puts the dearer dish at the top and the filler at the foot, which is what rule 8 asks for.

2. **The receipt's note is set far too big for a till receipt.** PDF, right column: "Ask about the wedding tea. No bikers past the counter." prints at 24px Courier, nearly twice the 14px of the receipt lines above it, and still leaves about 40px of dead paper between "Elaine" and the footer. A thermal receipt prints one size throughout. [layout] Cause: deli.js line 220 picks the biggest size from 24 down that fills the receipt's height, so a short note on a tall receipt balloons. Fix: cap the note at receipt size plus a little (`[17,16,15].find(...)`), and push the spare height into the scenes box (it can show both lines of each wink at 16px) or the gaps between the receipt's blocks, so it still fills without looking like a sign.

3. **"Total: ask Elaine" is not a receipt line.** PDF, receipt: a receipt with no total isn't a receipt, and the line isn't a joke a fan would get. [film] Cause: data/film-flavour.json, "Rumble in the Bronx (1995)" prop.lines[1]. Fix (same length): `Total: 12.95 cash`

4. **Elaine's note is a menu plug and leans on a link that isn't in the plot.** PDF, receipt: "Ask about the wedding tea." pushes a menu drink and ties Elaine to Uncle Bill's wedding. The plot summary doesn't put her in the wedding scenes (unsure, see below). The second sentence is good and true to the film. [film] Cause: data/film-flavour.json, note.text (kind "note", by "Elaine"). Fix (same length, true to plot since Elaine buys the store from Bill and the bikers keep wrecking it): `I bought this store fair and square. No bikers inside.`

5. **The almond jelly note says "almond milk" but the recipe uses cow's milk.** PDF, From the Case, and Prep sheet p-3: the note reads "Chilled almond milk jelly cubes", but the recipe is 500ml full cream milk with almond extract. A guest with a dairy or nut question would be misled. [film] Cause: data/films.json, Rumble in the Bronx W[0] note. Fix (same length): `Almond-scented milk jelly cubes with lychees and mandarin segments`

Checked and fine: no logo box (the poster carries the title, so none prints, rule 4). The prop prints on the receipt under its own title, routed by kind "receipt" (rule 5). The headings Starters, Hot Plates, From the Case, Drinks, Scenes to Spot and From the Counter are neutral (rule 6). Five winks sit in a labelled box (rule 7). Lobster noodles are at the top of Hot Plates at 11.95, nothing repeats in a course, and dessert sits under the mains (rule 8). The venue and the sign "Fresh Deliveries Daily" are true to the film's world (rule 10). The board has about 65px of empty space under the Showtime line, which is under the 100px limit. The Prep sheet cooks five dishes (Reuben bites, dumplings, sweet and sour pork, almond jelly, jasmine tea) and each one has a full recipe and every ingredient on the shopping list. The bao and lobster noodles sit unticked by the owner's rule.

## What I could not check

- How it looks on screen. Deli has no screen capture, so I judged only the PDF page and the 150dpi re-render of it.
- Whether Elaine attends Uncle Bill's wedding in the film. The Wikipedia plot doesn't say. I didn't use web search.
- Whether the film's supermarket has a deli counter or a sign with a name on it. "Elaine's Supermarket" matches how the Wikipedia plot names it.
- The ticket line "New York welcome. Hong Kong kicks." is the app's own tagline, not the film's poster tagline. It isn't presented as a quote, so I didn't mark it down.

## Dimsum layout review: Men in Black 3 (2012)

**Score: 8.6 out of 10**

A clean, tidy card that prints exactly as it shows on screen. The order sheet reads like a real restaurant tick sheet: numbered rows, price and QTY boxes, pen ticks, a table number written in, a stamp in the top margin. Every locked rule holds. Notes describe the food and print in full at one size, prices run dearest first with the house lines at the foot, dessert and drinks sit under the cheapest main, the header prints title and year beside a poster that carries the MIB3 logo, the ticket prop sits under a TICKET label, and five winks sit in a labelled box. The Overheard quote is the film's real line, said by J. What holds it under 9 is fit, not faults. A 2012 Chinese restaurant is priced and dated 1969, the sheet lists meatloaf, cheeseburgers and apple pie as if Wu's cooks them, and the one dish a fan will look for (K's own order of shrimp and bok choy, which the sign also calls out) sits unticked while hot dogs get the tick. The sign's second sentence also gets the scene backwards. All small, all fixable in data.

## Findings

1. **K's actual order is printed but left unticked.** Screen and PDF, row A2 "Agent K's shrimp and bok choy" has an empty QTY box, while A3 "Coney Island hot dogs" is ticked. In the film K's line at Wu's is "Shrimp and Bok Choy. We're gonna be here for a while", and the card's own sign leads with it, so a fan reads the empty box as a miss. [film] Cause: the ticks come from what is cooked; data/recipes/men-in-black-3-2012.json cooks only dumplings and hot dogs in "s", so app.js line 1769 adds the shrimp as an extra (unticked, menu-formats/dimsum.js line 226). The five-dish cook rule is the owner's call and is not marked down here; the issue is which starter got cooked. Fix: in the recipe file swap the "Coney Island hot dogs" entry for "Agent K's shrimp and bok choy" (the method already exists in films.json), so the shrimp is ticked and on the Prep sheet and the hot dogs become the unticked extra.

2. **Wu's is dated and priced 1969, but Wu's is a 2012 scene.** Screen, PDF and phone: the venue "Wu's Chinese Restaurant" and the sign come from the present-day 2012 scene (Wikiquote: J and K at Wu's before Boris attacks), yet data/film-format.json sets era "1960s", so prices print at 1969 levels (.40 to 1.95) and the tagline says "1969". The film never shows Wu's in 1969 (unsure, not confirmed either way). Most guests will not catch it; a fan might. [film] Fix, either: keep the 1969 look and drop "Chinese" so it reads as an older Wu's ("Wu's Restaurant, Est. 1969" is not in the film, so I would not add it), or set era to "2000s"/"modern" so the card is the 2012 Wu's. The simplest true fix is era "modern" in data/film-format.json, accepting that the 1969 pie and launch nods then sit as dishes, not prices.

3. **The sign's second sentence gets the joke backwards.** Header, line 2: "Shrimp and bok choy. Ask about the fish, not the kitchen." In the film the trouble is in the kitchen (the alien fish is out the back) and J's deal with Wu is "Earth people get Earth fish. Real Earth fish." Telling guests to ask about the fish and not the kitchen is the opposite of the scene and does not parse as a restaurant sign. [film] data/film-flavour.json, "Men in Black 3 (2012)".sign. Fix (55 characters against 57): "Shrimp and bok choy. Earth fish only, very traditional." (echoes Wu's "That is an Earth fish, very traditional in China").

4. **A yum cha tick sheet listing diner food.** Screen and PDF: under Small Plates and Kitchen Specials sit Coney Island hot dogs, Agency meatloaf, Launch day cheeseburgers and crinkle fries, and Diner apple pie, on a Chinese restaurant's order sheet with "Kitchen Specials" over them. As an object it reads half Wu's, half 1969 diner. [film] Cause: films.json "Men in Black 3" S, M, W are mostly American diner dishes while data/film-format.json picks dimsum. Not a rule break, but it is the main reason the card does not feel like one real object. Fix, lowest cost: rename "Agency meatloaf" to a Wu's dish in films.json M, e.g. "Wu's sweet and sour pork" with a food note, so at least one main belongs at Wu's.

5. **Espresso martini on a 1969 card.** D1 "Black suit espresso martini". The drink is generally dated to the 1980s, which would make it a period slip on a 1969 order sheet. I could not confirm this from Wikipedia or Wikiquote within this check, so treat it as unsure. [film] Fix if confirmed: films.json K, "Black suit vodka martini" with note "Vodka and dry vermouth stirred ice cold, olive or a twist" and the recipe file updated to match.

6. **"Pork prawn" reads like a typo.** A1 "Mr Wu's pork prawn dumplings". [film] films.json S and data/recipes/men-in-black-3-2012.json. Fix: "Mr Wu's pork and prawn dumplings" (four characters longer; the name already wraps to two lines, so the row height does not change).

7. **Overheard box is mostly air.** Bottom right, screen and PDF: the 20px quote sits in a box about 600px wide and 150px tall with large empty bands above and below. Not over the 100px gap rule, but it looks underfilled next to the busy order sheet. [layout] menu-formats/dimsum.js line 240, nS steps 16/18/20 by length only. Fix: let short quotes go to 24px (n.text.length<60?24:...).

8. **Minor price sense.** B2 cheeseburgers with fries at 1.75 sit under the meatloaf at 1.95, and A2 a full wok plate of prawns over rice sits under four dumplings. Within rule 8 (both A1 and A2 match the dear list), so not a fault, just a little odd. [layout] tidyPrices, dimsum.js lines 73 to 100. No change needed.

Checked and fine: quote "Earth people get Earth fish. Real Earth fish." by J (Wikiquote, Wu's scene); prop date July 15, 1969 (Wikiquote, Chrysler Building elevator: "The 15th... July... 1969"; Wikipedia plot); winks Boris breaking out of Lunar Max (Wikiquote "Lunar Max Prison"), Griffin seeing all possible futures (Wikipedia), Apollo 11 launch (Wikipedia), young K meeting J (Wikipedia: young K arrests J); cue, the pie scene with young K ("We need pie", Wikiquote). Save PDF matches the screen: no grey boxes, borders intact, nothing clipped. Prep sheet covers all five ticked dishes with full shopping list. TABLE 69 is the owner's call.

## What I could not check

- Whether the pie scene is set in a diner as such (the cue and dish say "diner"; Wikiquote has the pie dialogue but no setting).
- Whether Wu's restaurant appears in 1969 at all, and the restaurant's on-screen name (Wikiquote says "Wu's restaurant"; "Wu's Chinese Restaurant" is plausible but not confirmed).
- "The time jump off the building": Wikiquote confirms J arrives in the Chrysler Building but not the jump itself.
- The espresso martini's date (finding 5).
- I used no web searches; sources were the Wikipedia and Wikiquote raw pages only.

## Foodcourt layout review: Jurassic World (2015)
**Score: 8.6 out of 10**

A strong, clean card that suits the film. Jurassic World is a theme park with a real Main Street, so a park directory lightbox, a backlit stall sign and a dashed ticket coupon all make sense, and the glossy modern look matches the film. The Save PDF matches the screen with no grey boxes, lost borders or clipped words. Every dish note describes the food and prints in full at one size, the poster carries the logo so the coupon rightly prints title and year, the ticket prop sits under its "Ticket" label, all five winks show in a labelled box, and the Claire Dearing quote is word for word. The Prep sheet covers all five ticked dishes and the shopping list is complete for them. What keeps it under 9 is the drinks pricing: a $3 frozen margarita and a $4 lemonade on a card that also prints "Seven bucks a soda" as a wink. Any fan will catch that, and it undercuts the joke the card is making. The rest are small polish points: the place names repeat too often, and the "table 15" framing sits a little loose.

## Findings

1. **Drinks priced at $4 and $3 while the card's own wink says "Seven bucks a soda".** Screen and PDF, Drinks column: Theme park frozen lemonade 4, Frozen margarita 3. The cheapest thing on the card is a cocktail, at a theme park, under a wink about $7 sodas (Hoskins' line, confirmed on Wikiquote). A fan grins at the wink and then frowns at the price. [layout] Cause: menu-formats/foodcourt.js line 61, the default drinks multiplier `d:.3` gives 12 x .3 = $3.60, rounded to 4. Then lines 203 to 205 force the house line below the cheapest dish above it (lo 4, step 1) to 3. Fix: at line 198, pass a modern-era multiplier with dearer drinks, for example `prices(items,F.ei,F.egg,F.ei>=6?{s:.55,m:1,w:.45,d:.6}:undefined)`. That gives lemonade 7 and margarita 6 here, which also lands on the "seven bucks a soda" joke. Or let a house drink with `alc:true` sit at the dish price plus one instead of below it.

2. **"Main Street" prints four times and "Isla Nublar" three times on one face.** Screen and PDF: directory header "MAIN STREET", "YOU ARE HERE: MAIN STREET", fascia "Main Street Food Court", dish "Main Street cinnamon sugar pretzels". Then fascia sign "ISLA NUBLAR, OPEN DAILY", dish "Isla Nublar fish tacos", ticket line "Isla Nublar, monorail entry". It reads as filler. [film] Cause: data/film-flavour.json, "Jurassic World (2015)" keys `here` and `prop.lines[0]`. Fix (same length):
   - `here`: "You are here: Main Street" to "You are here: food court"
   - `prop.lines[0]`: "Isla Nublar, monorail entry" to "Ferry, then monorail entry"

3. **"OVERHEARD AT TABLE 15" frames Claire's line as if it were said at a food court table.** Screen and PDF, coupon middle panel. The quote is real and correctly credited, but in the film Claire says it to Owen about the Indominus rex, nowhere near a table. The "15" is just the year's last two digits. It's a playful conceit and not a rule break, but it's a fixed heading that doesn't come from flavour. [layout] Cause: foodcourt.js line 191, `OVERHEARD AT TABLE ${F.num.slice(-2)}`. Fix: let flavour override the heading (for example `F.fl.overheard`). For this film, set it to "OVERHEARD ON MAIN STREET" or, if finding 2 is taken up, "OVERHEARD IN CONTROL" (unsure where the line is spoken, so stay generic: "OVERHEARD IN THE PARK").

4. **Wink "Seven bucks a soda" sits under "Spotted around the park" but it's a spoken line, not something seen.** Screen and PDF, you-are-here box. It's a true wink (Hoskins says "charge seven bucks a soda"), it just doesn't fit the "spotted" label as well as the other four. [film] Fix in data/film-flavour.json winks[3] (similar length): "Seven bucks a soda" to "Hoskins' seven buck soda", which credits the line to its speaker so it reads as a nod rather than a sign.

5. **Small blank under the Drinks column.** Screen and PDF: about 40 to 45px between "on the rim" and the Showtime rule, while the Snacks column is filled by the still. That's under the 100px threshold and within the rules, so it's noted only. [layout] No change needed. If the drinks get dearer per finding 1, nothing changes here.

## What I could not check
- Whether the film ever calls any spot on Main Street a "food court". Main Street itself is confirmed (Wikipedia production section), so the venue is plausible, but I'm unsure about "food court".
- Fallon's Gyrosphere video: confirmed only through a news headline from a web search (Gizmodo, "Jurassic World ride narrated by a Jimmy..."), not Wikipedia or IMDb.
- The mosasaur feeding show behind the Showtime cue: Wikipedia confirms the feeding show set and the Mosasaurus, but the plot section doesn't describe the shark-feeding moment. I'm treating it as likely right but unconfirmed in text.
- That the film still really comes from Jurassic World (2015): it visually shows Owen and Claire beside a Jeep, which fits, but I couldn't check its TMDB source.
- How the printed colours come out on a home printer (red border density).

## Hospital layout review: Terminator 2: Judgment Day (1991)
**Score: 9.0 out of 10**

This one works. It reads as a real patient meal order card on a clipboard: wristband strip with barcode, "PATIENT: SARAH CONNOR", "BED 101" (a neat nod to the Model 101), a MEAL / DIET / DATE row, tick boxes ticked in pen for tonight's five cooks, a kitchen stamp dated 1995 (the year the film is set), and the real line "Come with me if you want to live." under "Overheard on the ward", which is where the Terminator actually says it. Every note describes the food and prints in full at one size. The columns are balanced and the right column's spare height goes to a real still of John and the Terminator on the bike in the flood channel, which matches the first wink. The Save PDF matches the screen with no grey boxes, black blocks, lost borders or clipped words. The Prep sheet covers all five ticked dishes and the shopping totals add up. I found nothing a guest would notice. What's left is one hidden risk (the header logo is only kept off by the contrast sampler, not by a setting) and some small polish items. It's ready for paying guests, but only just.

## Findings

1. **Header logo is kept off by luck of the sampler, not by a setting.** [film] Screen and PDF both print "Terminator 2: Judgment Day / 1991" as text at the top right, which is correct under rule 4 because the poster beside it already carries the T2 logo. But `data/film-logos.json` has a T2 logo (`/tMfwlEvwqKUgM9gTt7rATnB78Eh.png`, 4312x517). `logoImg` in `menu-formats/hospital.js` line 47 sizes it to about 300x36, which clears the 22px floor, so the image does load. It only hides because the `SAMPLE` script (line 45) finds that less than half of it reads against the pale form. If the canvas read fails (a CORS taint throws into the empty `catch`) or TMDB swaps in a darker logo, the logo would print and repeat the poster. Fix: in `data/film-flavour.json` line 13096, change `"hospital": {"stampYear": "1995"}` to `"hospital": {"stampYear": "1995", "noLogo": true}`.

2. **The jalapeños spelling differs between the card and the Prep sheet and phone.** [film] The card note reads "jalapeños". The Prep sheet ("1 jar pickled jalapenos", method step 1) and the phone recipe read "jalapenos". The cause is `data/recipes2/terminator-2-judgment-day-1991.json` lines 194 and 212, while `data/recipes/` has the ñ. Fix: line 194 `"jar pickled jalapeños, sliced"`, line 212 `"...scatter with cheddar and jalapeños and fold over."`.

3. **The prop card is a bit flat and its label says the same thing as its title.** [film] Foot right reads "CHART / Patient Card / High-security wing / Dr Silberman's patient". Rule 5 is met, but "Chart" over "Patient Card" says the same thing twice, and the lines are true but won't get a grin. Data at `data/film-flavour.json` line 13096 (`prop`). Suggested same-length swap: title "Patient Card" to "Case notes", lines "High-security wing" to "Escape risk: high" and "Dr Silberman's patient" to "Dr Silberman's case". (Sarah's escape attempts are in the Sarah Connor Wikipedia article: "Several times at the hospital, she has tried to...".)

4. **The pen signature doesn't sit on the ruled lines.** [layout] In the "Overheard on the ward" box the pen text is 44px on 48px lines over 30px rules (`hospital.js` lines 263 and 266), so "The Terminator" floats between rules and a bare rule is left under it. A guest won't mind, but a real card would have the writing sitting on the lines. Fix: set the pen line-height to a multiple of the rule pitch (for example `line-height:60px` for the 44px size, and the rule gradient at 30px) so each line lands on a rule.

5. **"WARD F" is made up, not taken from the film.** [layout] Line 190 builds the ward letter as `65+(num%6)`, so 101 gives F. It's harmless and nothing in the film contradicts it, but it means nothing. Optional: allow a `hospital.ward` flavour value and fall back to the formula.

## What I could not check
- Whether the mall in the film is called "the Galleria" (used in the unticked dish "Galleria food court double smash burger"). Wikipedia names only the filming locations (Santa Monica Place and Northridge Fashion Center), and one web search didn't settle it. Unsure.
- "The T-1000 flowing out of the floor": it isn't in the Wikipedia plot. A fan wiki (Terminator Wiki, T-1000 page) says it "flattens himself to the floor" in the hospital. That backs the wink in part only.
- Confirmed: the quote and who says it (Wikiquote, "[offers his hand to Sarah Connor] Come with me if you want to live." under The Terminator), Pescadero State Hospital and the 1995 setting, Dr Silberman as Sarah's doctor, the hospital being for the criminally insane (Wikipedia, Sarah Connor article), Enrique Salceda, NO FATE carved into a table (Wikiquote), the steel mill vat, the thumbs-up, the flood channel bike chase, and Model 101 (Wikiquote dialogue).
- I didn't check the phone menu beyond reading the text file. The course names and order there are a known shared item.

## Skilodge layout review: Better Off Dead (1985)
**Score: 8.9 out of 10**

This is a strong card and very close to ready. The ski lodge menu with courses graded as green, blue, black and double black runs is a smart fit for a film whose whole climax is racing the K-12. The poster sits whole in a timber frame, the header prints title and year as text (no logo on a box), every dish note describes the food and prints in full at one size, prices run dearest first with the house lines at the foot, and the Save PDF matches the screen with no grey boxes, black blocks or clipped words. The film lines check out: "I want my two dollars!" is Johnny the paperboy's line, the five winks are all real, and the prop copies Johnny's own words. What keeps it just under 9 is the prop: it is labelled RECEIPT but reads as an unpaid bill ("Amount due"), which a fan holding the card will notice because the whole joke is that Johnny never gets paid. One smaller French slip in a dish name, and some loose space between courses, round it out.

## Findings

1. **Prop label contradicts its own content (screen and PDF, bottom left slip).** [film] The slip prints "RECEIPT / PAPER ROUTE BILL / Four weeks, twenty papers / Amount due: two dollars". A receipt is proof of payment; "Amount due" says it is unpaid, and the title says "Bill". The running gag is that the Meyers never pay Johnny, so a receipt is the wrong object. The layout is doing what rule 5 asks (label from prop.kind, menu-formats/skilodge.js lines 186 to 188 and 204), so the fault is the data. Cause: data/film-flavour.json, "Better Off Dead (1985)".prop, `"kind": "receipt"` with `"title": "Paper Route Bill"`. Fix: set `"kind": "bill"` and change the title so the label and title do not both say bill: `"title": "Johnny's Paper Route"` (the slip header then reads BILL, title JOHNNY'S PAPER ROUTE). Keep both lines as they are; "Four weeks, twenty papers, that's two dollars" is Johnny's real line (Wikiquote). Optional fan touch: second line `"Two dollars. Plus tip."` in place of `"Amount due: two dollars"`, though that loses the layout's dashed amount rule (line 207 only fires on lines starting amount/total/balance), so keep the current line unless you also want that change.

2. **French plural in a dish name (screen, PDF, phone).** [film] "Monique's mini croque monsieurs". In French the name does not take a plural on monsieur; the usual forms are "croque-monsieur" (invariable) or "croques-monsieur". On a card for a film where the joke is a French exchange student, it reads as a slip. Cause: data/films.json, Better Off Dead S[1][0]. Fix (same length, 31 characters): `Monique's mini croques-monsieur`. Check the recipe key in data/recipes/better-off-dead-1985.json still matches if names are used to join (this dish is not on tonight's cook, so the Prep sheet is unaffected).

3. **Loose space between courses (screen and PDF, menu card).** [layout] The gap between the last starter note and the BLUE RUNS heading, between Mom's rice bake and the Showtime rule, and between French crêpes and DOUBLE BLACK each run around 50 to 60px on the 1344px face, while the gaps between dishes inside a course are about 10px. Nothing breaks rule 3 (all under the 100px still threshold, spacers capped by GAPMAX), but the card looks slightly airy in the middle rather than evenly set. Cause: menu-formats/skilodge.js lines 229 to 236, where the capped flex spacer (GAPMAX=30) plus the course bottom margin (cgap 12) and the dish bottom margin stack up, and the extra dish gap `xg` only applies to a column with no still. Fix: when a column takes its spare height in spacers, also let it give up to 4px a dish to the dish gaps (apply `xg` with a smaller cap even when there is no still), or lower GAPMAX to about 22 so the spread is shared more evenly between course gaps and dish gaps.

4. **"Images: TMDB." sits inside the quote box (screen and PDF, OVERHEARD card).** [layout] The credit shares the footer row with "Johnny the paperboy", so the attribution and the image credit read as one line. It looks like the credit belongs to the quote. Cause: menu-formats/skilodge.js line 257 (credit placed in the patrol card footer). Fix: move the credit to a small line on the timber under the snow report or under the poster frame, and leave the quote card footer for the speaker only.

5. **Sweets sit top right, level with the starters.** [layout] Reading across the card, BLACK RUNS (French crêpes) is the second heading you meet, before BLUE RUNS. Prices obey the rule (crêpes 1.25 under the cheapest main at 2.95), and the run grading keeps the order clear, so this is not a fault, just worth knowing: a guest scanning left to right sees dessert before mains. Cause: fit() picks the shortest column split (skilodge.js line 225, shared fit lines 120 to 129). No change needed unless the owner wants mains top right on films with a short starter list.

Checked and fine:
- Rule 1 and 2: every printed note describes the food and prints whole at one size.
- Rule 3: right column gap is filled by a real TMDB still (Lane and Monique on the Camaro at the stadium, which is the ending); left column spreads its own spare height.
- Rule 4: poster carries the logo, header prints "Better Off Dead / 1985" in the display face.
- Rule 5: prop prints under a label from prop.kind with both lines (see finding 1 for the data problem).
- Rule 6: fixed headings are ski run grades, SNOW REPORT, Watch for tonight, OVERHEARD, Showtime. All neutral or in the lodge theme.
- Rule 7: all five winks show in the labelled Snow Report box.
- Rule 8: starters 2.50, 1.95, 1.50, house 0.95 at foot; mains 3.50, 2.95; sweet 1.25; drinks 0.95, house 0.50 at foot. No repeats, dessert and starters under the cheapest main. 1985 prices look right for the era.
- Rule 9: "I want my two dollars!" by Johnny the paperboy is confirmed (Wikipedia plot says Johnny hounds Lane "yelling 'I want my two dollars!'"; Wikiquote lists it and gives Johnny's "Four weeks, twenty papers, that's two dollars. Plus tip.").
- Rule 10: K-12 is the town's highest peak and the race run (Wikipedia). "K-12 Ski Lodge" is invented but sits naturally in that world; "Race day on the K-12" is true.
- Winks: drag racer who learned English from Howard Cosell, ski-pole swordfight with Ricky at the finish, Charles inhaling snow, Monique pretending she cannot speak English to dodge the Smiths, Jenny's creepy meals. All confirmed on Wikipedia.
- Cue: Lane is fired from Pig Burgers in front of Roy and Beth, who are there on a date (Wikipedia). Good spot for mains.
- Prep sheet: the five ticked dishes (fries, fondue, double cheeseburger, crêpes, citron pressé) all have full recipes, and every ingredient is on the shopping list with sensible combined amounts (8 lemons = 6 + 2, 125g caster sugar, 115ml tomato sauce).
- PDF page 1 matches the screen: torn zigzag foot on the slip prints, borders and the dark snow report board hold, no clipping.
- Look of the real object: reads as a lodge menu board on a timber wall. Fans will grin at the paper route bill, Pig Burgers, Monique's croques and Mom's bake.

## What I could not check
- The exact staging of the cue ("walk into Pig Burgers"): Wikipedia confirms Roy and Beth are at Pig Burgers on a date when Lane is fired, but not whether they are seen walking in. Unsure on the wording, sure on the scene.
- Whether the still is Dodger Stadium or a different scene; it matches the ending as described but I did not confirm the frame.
- pdftotext returned no text for the PDF, so the PDF check was visual from the page renders only.
- No web searches used; facts from Wikipedia and Wikiquote raw pages only.
