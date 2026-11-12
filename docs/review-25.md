# Review 25: the ten new layouts, one film each (12 Nov 2026)

Ten independent reviewers, one per layout, judged the proof (screen, real Save PDF, phone) from wip/new-formats at d22deda. Ten fixers then worked to one set of locked rules (food notes, full notes, no gaps, no logo boxes, props under the right label, neutral headings, winks shown, price order). Each layout's review is followed by its fix log.

---

## Foodcourt layout review: Mallrats (1995)
**Score: 7.5 out of 10**

The idea is right and the screen card is close. The mall directory lightbox makes the poster the hero, whole and uncropped. The backlit stall fascia, the cut-out coupon and the logo on its dark panel all look like the real thing, and the Truth or Date coupon with Bob Summers as host is correct. What pulls it back: the striped tray liner border, which is the whole point of the layout, does not print, so the PDF gets a dull grey frame. The "overheard" Brodie quote is made up but printed in quote marks. Three dish notes are film lines or film winks where the food should be. The two menu columns are uneven, with a big empty gap under Snacks. Notes come out in two different type sizes and two of them get cut short.

## Findings

1. **Tray liner stripes vanish in the Save PDF, leaving a grey frame.** [layout] On screen the card has a blue and teal diagonal stripe band all round it. On PDF page 1 the band is gone and a flat greyish strip about 22px wide sits between the page margin and the content. It looks like the "grey box" fault and loses the tray liner look entirely. Cause: `menu-formats/foodcourt.js` line 134 draws the band with `border-image: repeating-linear-gradient(...)`, which the PDF renderer (html2canvas) does not paint. Fix: draw the band as four absolutely positioned divs (top, bottom, left, right, each B px thick) with `background: repeating-linear-gradient(45deg, ...)`. The other layouts' stripes bake fine that way (review 21, Elf's candy-cane border). Or use an inline SVG pattern. This hits every film on foodcourt.

2. **The "Overheard at table 95" quote is not a line from the film.** [film] Coupon, middle panel, screen and PDF: "The food court is downstairs. The cookie stand is upstairs." credited to Brodie Bruce, in quote marks. I can't find it in any quote source. The real scene is Brodie and T.S. at the cookie stand, arguing about Lois Lane and then about what counts as part of the food court. Printing an invented line as a quote breaks the rule that quotes are real or clearly unquoted. Fix in `data/film-flavour.json` > `mallrats-1995.note`. Use a real Brodie line such as "The Easter Bunny corner is down at the other end of the mall", or Jay's "Snootchie bootchies", checked word for word against the film.

3. **Film lines printed where the food description should be.** [film] Same fault as the Toy Story review.
   - Hot cinnamon sugar nuts: "Snootchie-bootchies, and watch the hot sugar." (Snacks, screen, PDF and phone.)
   - Frozen cherry cola slush: "It's a schooner, not a sailboat." (Drinks, all three.) Nothing on the card says what the drink is.
   - Food court pretzels: the note ends "Chocolate-covered pretzel?". That nods to the stink palm gag, where Brodie's pretzels make Svenning sick. As a dish note it reads as a question about the food, and anyone who knows the scene reads it as gross.
   
   Fix: in `data/film-flavour.json` > `mallrats-1995.house.s.note` and `.house.d.note`, describe the food ("Warm mixed nuts tossed in cinnamon sugar, in a paper cone"; "Cherry cola slushie, frozen till it crunches, in a big cup"). In `data/film/mallrats-1995.json` S[0] (and `recipe.s[0].note`), drop "Chocolate-covered pretzel?". The joke can live in the dish name if you want it.

4. **Big empty gap under Snacks, uneven columns.** [layout] Screen and PDF, menu block. The left column holds Snacks only and ends about a third of the way up from the cue rule. The right column (Combos, Sweet Stuff, Drinks) runs down to the rule. The result is roughly 180px of bare paper on the left. Cause: `fit()` picks the best split, but the spare height is shared out as `cgap` per course (line 177). The single-course column gets one gap's worth while the three-course column gets three, so the columns end up further apart, not closer. Fix: at line 178, spread each column's own spare height. For example, make each column `display:flex;flex-direction:column;justify-content:space-between` when it holds more than one dish, or add per-item padding computed per column. Then turn the shared cgap boost off.

5. **Dish notes print in two type sizes, and two notes are cut short.** [layout] Screen and PDF, both columns. The house lines ("Snootchie-bootchies...", "It's a schooner...") print at full note size. The real dishes' notes are visibly smaller (about 14px against 16px in the crop). Cause: `fit()` (line 175) estimates note width with `cw: .44` for Barlow Semi Condensed. That is too narrow, so the two-line notes overflow their clamp. `libUnclip` in app.js (lines 1721 to 1745) then shrinks them, and where shrinking is not enough it drops clauses. That is why the card reads "Thin bases, garlic tomato, mozzarella, salami and mushrooms." (data adds "blistered hot, cut in squares") and "Big warm chocolate chip cookies." (data adds "from the cookie stand upstairs", the one food court wink that was actually food). The space is there (see finding 4). Fix: raise `cw` for band 2 in `E[2]` (line 120) to about .5 so the fit is honest and nothing needs shrinking. A real counter menu uses one note size throughout.

6. **Pizza note says salami, the dish is pepperoni.** [film] Combos, screen and PDF: "Dive pizzeria pepperoni mushroom pizza", note "...mozzarella, salami and mushrooms". The recipe and shopping list use 120g pepperoni. Fix `data/film/mallrats-1995.json` M[1] note: "salami" to "pepperoni". "Dive pizzeria" also makes no sense inside a mall food court. The film's food court has a Sbarro, so "Food court pizza by the slice" or "Slice counter pepperoni and mushroom pizza" fits the world better.

7. **The venue name prints twice and is generic.** [layout] and [film] Screen and PDF. The fascia says "Mall Food Court, New Jersey" and the directory strip repeats it as "YOU ARE HERE: MALL FOOD COURT, NEW JERSEY". The last review flagged duplicated labels as a fault. The layout causes the repeat (line 147 uses `F.venue` for the "you are here" line; it hits every film). Fix: print "You are here: Food court, Level 1" or the sign line there instead. The name itself is weak too, a description rather than a stall. The mall is unnamed in the film, but a stall name fits a stall fascia far better, for example a cookie stand or pretzel counter. Fix in `film-flavour.json` > `venue`.

8. **Sign line reads like a pun, not a sign.** [film] Fascia subtitle: "THE MALL. NO SAILBOAT, JUST PRETZELS." That is a wink at the Magic Eye gag, but no stall would print it. It also sits next to the slush note's sailboat line and the Sailboat poster cookies, which makes three sailboat jokes on one card. Fix `film-flavour.json` > `sign`: something a counter would print ("Hot pretzels, cold drinks, open till close"). Keep one sailboat nod, the cookies.

9. **Dish names are repetitive and long.** [film] "Food court pretzels", "Food court pork egg rolls" and "Downstairs food court teriyaki chicken" put "food court" three times on a food court menu. The teriyaki name and the pizza name both wrap to two lines, which crowds the right column. Fix in `data/film/mallrats-1995.json`: "Hot soft pretzels", "Pork egg rolls", "Teriyaki chicken bowl". Also the vegetarian swap in `r2.dishes[2].alt.veg.n` is "Eden Prairie food court teriyaki tofu". Eden Prairie is the Minnesota mall where they filmed, not the New Jersey mall of the story, and it doesn't match the main dish's name. Rename it "Teriyaki tofu bowl".

10. **Directory shops are scene captions, and the best wink is left off.** [layout] Left panel, "you are here" strip: "Shop 10 The Easter Bunny gets accosted", "Shop 17 Jay says kneel before Zod", "Shop 24 Truth or Date game show". A mall directory lists shops, so the "Shop N" labels make scene descriptions read as shop names. Line 144 also takes only the first three winks, so "Stan Lee, True Believer", the film's most famous cameo, never shows. The box has room for a fourth row. Fix: label the rows as "Today in the mall" or "Stage" times (for example "2pm Truth or Date, centre stage") rather than "Shop N". Allow four rows when YH allows (line 144, line 148). The facts themselves check out: Jay does shout "Kneel before Zod" after hitting LaFours, and Jay and Silent Bob do attack the Easter Bunny.

11. **Small print differences.** [layout] PDF: the red "you are here" dot loses its soft ring (line 146, box-shadow spread). Everything else matches the screen: no clipped words, the logo panel prints dark and clean, and the poster glow holds.

## What I could not check

I worked from the pre-rendered images only, with no browser run. So I could not test kids', vegetarian or no-alcohol modes, the Prep sheet layout beyond a glance, or other films on this layout. The exact wording of the Magic Eye schooner and sailboat exchange, and the full cookie stand dialogue, could not be confirmed from a transcript. A few things on the phone are app-wide rather than this layout: the "Skip to the wheel" button covers the card's MALL DIRECTORY header, the phone title has a ghost copy of "Mallrats" under it, and the tabs read Starters, Mains, Sweets where the card says Snacks, Combos, Sweet Stuff. I have not graded those here.

### Fix log



Files: menu-formats/foodcourt.js, audit/ops/mallrats-1995-review-25.json (16 ops, all applied, 0 misses).

1. Tray liner stripes: border-image swapped for four painted strips with repeating-linear-gradient. They now print in the Save PDF on every foodcourt film.
2. Invented quote: replaced with Jay's real "Snootchie bootchies!" (flavour.note, kind quote). The layout now only uses quote marks and "Overheard at table NN" when note.kind is "quote". Any other note prints plain under "Pinned by the register".
3. Film lines in notes: house snack is now "Hot honey roasted nuts" (warm mixed nuts, honey, salt, paper cone). Slush note now describes the drink. "Chocolate-covered pretzel?" is gone. The pretzel note now describes the bites and dip, and recipes are untouched.
4. Uneven columns: each column is now a flex column with capped spacers (16px per dish, 22px per course), so each column spreads its own real spare height. A still box takes any leftover, but only shows at 100px or more (it uses a flex-wrap trick, so you never get a sliver). Below that it stays hidden. It holds a real TMDB still captioned "Mallrats, 1995. Film still." The old shared cgap boost is gone.
5. Note sizes and clipping: fit() and course() now give every note all its lines (nlMax 4), and the 12px course gap is counted in the budget. Width estimates were set to measured values: Barlow Semi Condensed cw .46, Lato .53, Barlow .5, DM Sans .53 / cwd .51. All notes print at one size. Two new notes were over 100 characters, and app.js libMenu's libTrim(note,100) was cutting them, so I shortened both to 94 and 92 characters.
6. Pizza: note now says pepperoni, and the dish is renamed "Pepperoni and mushroom pizza" (no more "Dive pizzeria").
7. Venue twice: the "you are here" line now reads "You are here: the food court" on every film. Mallrats venue is now "The Pretzel Counter".
8. Sign: now "Hot pretzels, cold drinks, open till close". The only sailboat nod left is the cookies.
9. Names: "Cinnamon pretzel bites" (the dish is cinnamon bites, so I used that over "Hot soft pretzels"), "Pork egg rolls", "Teriyaki chicken bowl". The veg and alcohol-free alts are now "Teriyaki tofu bowl" and "Teriyaki tofu bowl (alcohol-free)". Recipes, recipes2 and diet keys were renamed with them. I also tidied the egg roll note.
10. Directory rows: "Shop N" labels removed. The winks now sit under a "Spotted around the mall" label. Up to five show where they fit: long ones take a full row, short ones pair up, and any wink that would be cut is left out. Mallrats shows all five, including Stan Lee.
11. "You are here" dot: the box-shadow ring is now a nested circle, so it prints in the PDF.

Also done to meet the locked rules:
- Rule 4, logo: the dark logo box is gone. The logo sits straight on the coupon paper with a soft glow. A load-time check keeps it only if 60% or more of its pixels read on that paper (contrast 3+, or chroma 90+ with contrast 1.8+). Otherwise the film title and year print in the display type. Mallrats falls back to the title (its logo is also on the poster). Bad Santa and Jurassic World keep their logos.
- Rule 5, prop heading: the left coupon cell is now headed by the prop's kind ("Ticket", "Slip"), not a fixed "Coupon". The default is still Coupon / Free refill.
- Rule 8, prices: in the layout's prices(), dearer dishes (prawns, lobster, steak and so on) now take the top prices in their course, and no two dishes in a course share a price. This fixed Jurassic World's prawns at 7 (now 10) and Bad Santa's sweets at 4 and 4 (now 4 and 5).
- Rule 9: no em dashes in the file. The dash-strip regex now uses \u escapes.

For the lead (shared code):
- app.js libMenu cuts every venue note to 100 characters (libTrim) without telling anyone. Any note over 100 loses its last clause on every layout. Either raise the limit or flag over-length notes in check-print-text.
- On Mallrats, priceSense prices the pizza (a card extra) below the teriyaki (4.50 against 4.95). That's fine here, just noting it comes from priceSense.
- A <style> container query inside a face did not apply on the card, which is why I used the flex-wrap approach.

Owner decisions / other films' data (not changed, outside my ops file):
- Bad Santa: the nachos note "Willie told the kid to make sandwiches for dinner." and the tamales note "Christmas in Phoenix..." are film lines, not food. Its "Pinned by the register" note is signed by Willie although it isn't a quote (rule 1 wants a role or the venue). Venue "Phoenix Mall Food Court" is generic.
- Jurassic World: several notes are jokes ("Hamster ball, basically.", "Claire's itinerary...", "Dinosaurs are "wow" enough.", "Sponsored, like the Indominus rex.", "Carried out of Margaritaville..."). Claire's quote should be checked word for word (I believe the film line differs slightly).
- Mallrats venue name: "The Pretzel Counter" is my choice. Change it if you'd rather have another stall name.

Final check-print-text (Mallrats, Bad Santa, Jurassic World): PASS. No dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops.

---

## Bowling layout review: Kingpin

**Score: 7.5 out of 10**

The score sheet idea works. The frame strip, the pencil prices in the ball boxes, the handwritten course names and the lane notes all read as a bowling alley, and the Save PDF page matches the screen closely: no grey boxes, no lost or clipped text, no black blocks. The poster sits whole as the hero and the Roy Munson cow line is real. What pulls it back is mostly content. The second main, the pot roast, is on the printed menu but missing from the Prep sheet and the shopping list. Its note is a Big Ern line, not a description of food. The layout ignores the film's winks, so Big Ern, the rubber hand and "Munsoned" never show up. The prop tag prints "SHOE HIRE" over a tournament ticket and says "Reno Tournament" a second time. The logo sits on a cream box that repeats the logo already on the poster.

## Findings

1. **Pot roast is missing from the Prep sheet and the shopping list.** [film] The card and the PDF page 1 list "Gravy Train Amish Pot Roast" at 4.50, and the phone shows its recipe. But the Prep sheet (PDF pages 2 and 3) says "5 dishes" and goes fries, pretzels, chicken, pie, milkshake. There is no beef chuck, beef stock, tomato paste, thyme or cornflour on the shopping list. Onions, carrots and potatoes are only counted for the other dishes (2 onions, 2 carrots, 1kg potatoes). Anyone shopping from the printout can't cook a dish printed on the menu. Cause: in data/film/kingpin-1996.json the pot roast is in `M` and `r2.dishes` but not in `recipe.m` (only "Amish chicken and noodles over mash") or `recipe.shopping`. Fix: add the pot roast to `recipe.m` with a `how` and `shop` list, and rebuild `recipe.shopping` so it covers all six dishes.

2. **A film line is printed where the food note should be.** [film] The pot roast note on screen, PDF and phone reads "Braised beef. Biscuit wheels extra." "You're on a gravy train with biscuit wheels" is Big Ern McCracken's line, and the recipe has no biscuits, so "Biscuit wheels extra" is a pun, not food. The name "Gravy train Amish pot roast" also sticks Big Ern's line onto an Amish dish. This is the same fault the Toy Story arcade review found. Fix in kingpin-1996.json `M[1]`: give it a food note, e.g. "Beef chuck braised slowly with onions, carrots and potatoes, gravy from the pot". If the gravy train nod stays, put it in the name only ("Gravy train pot roast"), not in the note.

3. **The layout never uses the film's winks, so most of the iconic film is missing.** [layout] `film()` builds `F.winks`, but bowling.js never reads it (grep finds no `F.winks`). 39 of the 42 layouts do use winks. For Kingpin that drops Roy's rubber hand, Big Ern and Ishmael's "extra large, lots of cream" coffee. The only film content left is one quote and the bull in the showtime cue, and Big Ern, the film's best-loved character, doesn't appear at all. Fix in `window.MENU_FORMATS.bowling`: print one or two winks as pencil scrawl in the empty bottom ruled lines of the LANE NOTES box (lines 184 to 186), or as a "High game" line on the shoe tag.

4. **The prop tag prints the wrong name and a duplicate label.** [layout] The tag heading "SHOE HIRE" is hard coded (line 153), but Kingpin's prop is `kind: "ticket"` titled "Reno Tournament". So the card has a shoe hire tag that says RENO TOURNAMENT / Prize: $1 million, which is not a shoe hire tag. It also repeats "Reno Tournament" from the header sign ("Reno Tournament Lanes"). Only `lines[0]` prints, so "Roy and Ishmael" is dropped. This matches the "prop printing the wrong name" fault from the last review. Fix: take the heading from `fl.prop.kind` (ENTRY TICKET for a ticket, SHOE HIRE only when there is no prop), and print `lines[1]` on the spare space of the tag. Also, an American alley says "shoe rental", not "shoe hire". For the film: change the prop title in film-flavour.json so it doesn't repeat the venue name, e.g. "Entry: Roy Munson / Ishmael Boorg".

5. **The logo sits on a cream box on the navy header and repeats the poster's logo.** [layout] Screen and PDF, header right. The Kingpin logo has a black outline, so the `SAMPLE` check (line 41) flips the panel to `data-light="#f4f2ea"`, and you get a pale box on the dark band. That's the same "logo on a grey box" fault the last review flagged. The poster just below already carries the same logo. Fix in the header (line 142): drop the panel background and let the logo sit straight on the band, with a soft white glow behind dark logos. Or, when a poster is shown, skip the header logo and use that space for the title or a still.

6. **Two dish notes just repeat the dish name.** [film] On screen and PDF, "Amish farm soft pretzels with apple butter" is followed by "Soft pretzels, apple butter", and "Amish chicken and noodles over mash" by "Chicken and noodles over mash". These are duplicated labels, not descriptions. The card takes them from `recipe.s[1].note` and `recipe.m[0].note`, while the better notes in `S[1]` and `M[0]` ("chewy twists, deep brown crust and flaky salt...", "thighs in peppery broth...") go unused. Fix: put a real food note in those two `recipe` notes, e.g. "Chewy salted twists with spiced apple butter and hot mustard" and "Shredded chicken and thick egg noodles in peppery broth over buttery mash".

7. **Broken and mismatched recipe text.** [film] Milkshake step 2 on the phone and PDF page 3 reads "Blend the cold full cream milk with the scoops vanilla ice cream". That's left over from stripping out "8 scoops". The quantities also disagree: the `K` method says 4 tbsp malt, the list says 5 tbsp; the method says 8 scoops, the list says 1 L. The phone's pot roast steps give no times ("Cover and cook at 160°C." then "cook until the beef falls apart"). Shoofly step 1 reads "with the sheet shortcrust pastry". Fix the step texts in `r2.dishes` ("the vanilla ice cream", "the pastry sheet") and give the pot roast times (e.g. 2.5 hours covered, then 45 minutes with the vegetables).

8. **The showtime cue is too small for print.** [layout] `cueLine(F,BF,e.soft,acc,15)` (line 180) sets the cue at 15px on a 1344px face, which is about 7pt on A4. On screen and PDF it's the smallest text on the card, squeezed against the bottom rule of the sheet, while the rows above have spare room. Fix: raise it to 18 or 19px and let `cueH` grow to match (line 165), or give the cue its own ruled row like a "Notes" line on a real score sheet.

9. **The footer credit wraps badly in the TOTAL box.** [layout] Screen and PDF, bottom right: "Prices subject to change. Images:" then "TMDB." alone on the next line. Fix (line 190): break after "change." or drop to 13px so it splits cleanly. Line 189 also always writes 200 plus the lane number, so every 1990s film on this layout scores in the 290s. That's harmless, but it would look better taken from `fl.number` or a fixed nod.

10. **The venue name is invented and generic, and the dishes lean on prefixes.** [film] The film's final was shot at the real National Bowling Stadium in Reno. "Reno Tournament Lanes" is a made-up name that also clashes with the prop (finding 4). Consider "National Bowling Stadium" with a sign like "Snack bar open all tournament". Separately, three of five dishes start with "Amish" and the other names lean on prefixes ("Bowling lane", "Gravy train", "Lots of cream"). A Reno stadium snack bar selling three Amish plates and shoofly pie reads more like Ishmael's farm kitchen than the venue. "Lots of cream vanilla malt milkshake" is a clumsy fit for Ishmael's coffee order. Suggest one Amish dish (the chicken and noodles or the shoofly pie) and plainer names for the rest.

## What I could not check

I didn't render this layout for other films, so I couldn't confirm the four-dish two-row split or the 1950s, 70s and 2000s looks. The phone capture only shows the box office, so I judged the phone menu from its text. I couldn't confirm the tournament's on-screen name or banner text. Two things I took from memory: the bull milking scene and the full cow line (the source for it was a forum thread title, not a script). I didn't confirm whether the app is meant to add the house items (chow chow board, fresh farm milk) to this card. They don't appear.

### Fix log



Files changed: menu-formats/bowling.js, audit/ops/kingpin-1996-review-25.json (20 ops, all applied, no misses).
Second proof: Kingpin is the only film on the bowling layout (data/film-format.json), so no other film could be proofed. I smoke-tested the layout in node with and without a poster (both render, no errors). The no-poster logo path and the still row have not been proofed in a browser.

1. Pot roast missing from Prep sheet and shopping: NOT FIXED IN DATA, card-ops cannot add recipe entries. Renamed it to "Gravy train pot roast" (recipes2 already holds its full steps under that name now). Lead: add this to data/recipes/kingpin-1996.json `m` (after the chicken entry):
   {"n":"Gravy train pot roast","note":"Beef chuck braised slowly with onions, carrots and potatoes, gravy from the pot","how":"Season 1.4kg beef chuck roast and sear on all sides in 2 tbsp oil in a heavy pot. Add 2 onions cut in wedges and 2 tbsp tomato paste, then 750ml beef stock and 3 sprigs thyme. Cover and cook at 160C for 2 hours. Add 4 carrots and 800g potatoes in chunks, cover again and cook for 1 hour more, until the beef falls apart. Lift out the beef and vegetables, thicken the pot juices with 1 tbsp cornflour mixed with water and simmer into gravy. Pull the beef into chunks and serve with the vegetables and gravy.","shop":["1.4kg beef chuck roast@Meat","2 tbsp vegetable oil@Pantry","2 onions@Produce","4 carrots@Produce","800g potatoes@Produce","2 tbsp tomato paste@Pantry","750ml beef stock@Pantry","3 sprigs thyme@Produce","1 tbsp cornflour@Pantry"]}
   and in `shopping`: "2 onions@Produce" to "4 onions@Produce", "2 carrots@Produce" to "6 carrots@Produce", "1kg potatoes@Produce" to "1.8kg potatoes@Produce", then add "1.4kg beef chuck roast@Meat","2 tbsp vegetable oil@Pantry","2 tbsp tomato paste@Pantry","750ml beef stock@Pantry","3 sprigs thyme@Produce","1 tbsp cornflour@Pantry". This also fixes the main prices: priceSense treats the pot roast as a card extra (no tested recipe) and holds it under the chicken (4.50 vs 4.95); once it has a recipe it should price as a cooked main.
2. Film line in the pot roast note: note is now "Beef chuck braised slowly with onions, carrots and potatoes, gravy from the pot"; the gravy train nod stays in the name only ("Gravy train pot roast", Amish dropped). Big Ern's line confirmed on Wikiquote.
3. Winks never shown: added a ruled "Watch for" row under the courses that prints up to five winks in pencil. Also swapped two unverified winks ("Tanqueray and Tab", "Rubber Man of Reno") for "Big Ern's comb-over" and "Getting Munsoned".
4. Prop: heading now comes from prop.kind (TICKET, TICKET STUB, CARD, RECEIPT, SLIP, BADGE, TAG); with no prop, or a kind not in that list, the tag falls back to "SHOE RENTAL" (US wording). Prints title plus up to two lines. Kingpin prop is now "$1 million tournament / Bowler: Ishmael Boorg / Manager: Roy Munson".
5. Logo box: box removed. When a poster is shown (it carries the logo) the header prints the title and year in the sign's display type. No poster: logo sits on the band with a soft glow, and a contrast check (WCAG ratio against the band, at least half the opaque pixels at 3:1) swaps it for the title if it cannot read.
6. Duplicate notes: recipe notes now "Chewy salted twists with spiced apple butter and hot mustard" and "Shredded chicken and thick egg noodles in peppery broth over buttery mash". The films.json chicken note also lost its "part of Roy's cover story" plot line.
7. Recipe text: "the scoops vanilla ice cream" to "the vanilla ice cream"; method now 1L ice cream and 5 tbsp malt to match the list; "with the sheet shortcrust pastry" to "with the shortcrust pastry sheet"; pot roast steps now say "for 2 hours" and "for 1 hour more".
8. Cue too small: cue moved to its own ruled "Notes" row at 19px (was 15px squeezed on the bottom rule).
9. Footer credit: breaks cleanly after "Prices subject to change." at 13px. TOTAL now shows 300 (a perfect game) unless the film sets a number, instead of 200 plus the year digits.
10. Venue and names: venue now "National Bowling Stadium" (the Nevada Film Office confirms the finale was shot there; sign kept). Names cut back: "Chilli cheese fries" (veg alt renamed to match), "Soft pretzels with apple butter", "Gravy train pot roast", "Vanilla malt milkshake". Amish chicken and noodles is the one Amish dish left; shoofly pie kept.

Layout fit (rule 2/3): fit now uses only tiers that print notes, notes are no longer capped at nl+1 lines, and the note width estimate is shared between budget and render (0.47). Row stretch capped at 40px; if more than 100px is still left, a captioned TMDB still row fills it.
Also: house lines (not on this card) now describe food: chow chow board "Sweet and sour pickled vegetable relish with farmhouse cheese and bread", farm milk "Cold full cream milk poured from the jug".
Quote checked: "I took the liberty of milking your cow for you." is word for word from Roy's line on Wikiquote.

Shared-code items for the lead: (a) the recipe entry above; (b) priceSense holding uncooked "extra" mains under cooked ones explains the 4.50 pot roast; it should clear once (a) is in.
Owner decision: none needed. Optional: say whether a real venue name (National Bowling Stadium) is fine on a printed menu.

check-print-text: PASS, no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops.

---

## Clubhouse layout review: Caddyshack

**Score: 8 out of 10**

The scorecard idea fits Bushwood well. Hole, dish and par columns, courses run as Front Nine, The Turn, Back Nine and 19th Hole, nine dishes for nine holes and a pencilled ring on one price all read as a real club card. The poster is whole and sharp in a gilt frame, the venue is right, the local rules are real scenes, and Carl's "So I got that goin' for me, which is nice" is a real line, signed in pencil. The Save PDF is a near copy of the screen with no grey boxes, lost text or black blocks. What pulls it back: the title is printed twice down the cover (logo plaque, then the poster's own title right under it), the Front Nine card has a big empty block at the bottom while the notes beside it are cut short (the chilli cheese dog loses its cheese), the two house lines carry film notes instead of food, and the prices tell the wrong story (surf and turf with eye fillet and prawns costs less than the prime rib).

## Findings

1. **Notes cut short while the card has room to spare.** Screen and PDF, Front Nine and Back Nine. "Caddy shack mini chilli cheese dogs" reads "Cocktail frankfurts in soft rolls, spiced beef." The cheddar and onion, the very thing that makes it a chilli cheese dog, are gone. The sundae loses its peanuts and cherry ("Vanilla ice cream with hot fudge, whipped cream."). Meanwhile the Front Nine card has about 145px of blank paper under hole 4. Cause: `fit()` picks a tier with `nl:2`, so every note is clamped to two lines in a narrow middle column (`colW-HOLE-PAR-30`, about 190px), and app.js `libUnclip` then drops clauses at the commas to make it fit. It never uses the spare height. Fix: in menu-formats/clubhouse.js, after `fit()` (around line 152), let a column with spare height raise its note clamp to 3 or 4 lines (use `R.spare` per column, not the tallest column), and trim the HOLE and PAR columns (66 and 96px) so the dish column is wider. [layout]

2. **Big empty gap at the foot of the Front Nine card.** Screen and PDF, left scorecard. The left card holds 4 rows, the right card holds 5 rows and 3 course bars, but both cards are drawn at the full `MH` height (line 167), so the left one ends in a white block about a quarter of its height. This is the "uneven columns, big empty gaps" fault from the last review. `pad` (line 157) is worked out from the fullest column and capped at 8px, so the short column never spreads. Fix: work out padding per column so rows fill their own card, or shrink the shorter card to its content and centre it, or move Back Nine to the left card when that balances the row count better. [layout]

3. **Title printed twice on the cover.** Screen and PDF, left panel. The "Caddyshack" logo sits in a plaque at the top and the poster directly under it ends in the same yellow "Caddyshack" logo. It wastes 126px that the poster could use and looks like a mistake. The plaque is also a darker box (`rgba(0,0,0,.25)`, line 140), which is the same family as "logo on a grey box", though here it prints the same as screen. Fix: when there is a poster, drop the logo plaque and put the club name or a small crest there, and give the height to the poster (`lgH`, line 134). Keep the plaque only when there is no poster. [layout]

4. **House lines carry film lines, not food.** Screen and PDF, holes 4 and 9. "Crab-stuffed mushrooms: Smails's yacht christening, before Al's boat arrives." and "Club gin and tonic with lime: Judge Smails's pour for christening the Flying Wasp." Neither note says anything about the food, which breaks the "described as food" rule. The gin note is also not in the film: Smails christens the Flying Wasp and Al's boat rams it and sinks it, but no gin and tonic is poured, and no food is served at the christening. Fix in data/film-house.json, "Caddyshack (1980)": for example "Button mushrooms filled with crab, cream cheese and spring onion, baked golden" and "Gin over ice with tonic and a squeeze of fresh lime". [film]

5. **Prices make no sense against each other.** Screen and PDF. Al Czervik's surf and turf (eye fillet and garlic prawns) is 2.95 while Judge Smails's prime rib is 3.50, and the surf and turf costs only 0.45 more than a cocktail frank. A snobby 1980 country club charging 3.50 for prime rib is also very cheap. The raw formula in `prices()` (clubhouse.js line 61 to 66) would give 3.50 and 3.95; something in the shared `window.priceSense` pulls the second main down. Fix: make the surf and turf the dearest main (it is the showy Al dish), and consider a higher era base for club venues. Likely shared code, so check other layouts. [layout]

6. **Course labels confuse the read.** Screen and PDF. Each card has a header "At the 19th" above Front Nine, then a course further down is also called "19th Hole". The Showtime line says "Serve the mains when Al Czervik starts making noise in the club dining room", but no course is called Mains: the mains are under "The Turn". A guest has to work out the code. Fix in clubhouse.js line 119 to 122 and line 166: rename the column header to "Dish" or "Menu", and add a small plain word under each course bar ("The Turn, mains") or reword the cue to the course name. [layout]

7. **Sign line repeats the venue.** Screen and PDF, cover. "Bushwood Country Club" then "Bushwood, Members Only" right under it. Fix: "Members and guests" or "Members only. Caddies use the rear entrance." in data/film-flavour.json. [film]

8. **An iconic wink is dropped and the best film tie on a dish is trimmed off.** Local rules show only 3 of the 4 winks (`F.winks.slice(0,3)`, line 172), so "Carl's Dalai Lama story, gunga galunga" never prints, while the box has room for a fourth line above the credit. The Cinderella story and Noonan are not anywhere on the card. Fix: allow 4 rules when they fit on one line each. [layout] and [film]

9. **Thin empty strip under hole 9.** Screen and PDF, right card. The card box is `MH+HDR+5` tall (line 167) while the rows fill `MH`, leaving a sliver of an empty row below the last rule. Small, but it reads as a cut-off row. Fix: size the card to `MH+HDR` plus borders, or drop the last row's bottom border. [layout]

10. **Empty band at the foot of the cover.** Screen and PDF, left panel, roughly the bottom 100px under "Members Only" is plain green. Once the logo plaque goes (finding 3) the poster can grow and close this. [layout]

## What I could not check

I did not open a browser, so I could not see the menu under kids' mode, Vegetarian or No alcohol (the gin and tonic house line should drop), or other films on this layout to confirm how often findings 1, 2 and 6 bite. I did not trace `window.priceSense` to the exact line. On the phone shot the "Skip to the wheel" button sits over the card's logo; that looks like the app's skip link caught in focus, not this layout, but I could not confirm it.

### Fix log



1. Notes cut short: clubhouse.js now runs its own fit. Each tier is tried with every note's full line count (no nl clamp, no clamp on notes), so notes get their lines before any gap. HOLE and PAR trimmed from 66/96 to 52/82 to widen the dish column. All 9 Caddyshack notes print in full (chilli dog keeps cheddar and onion, sundae keeps peanuts and cherry).
2. Front Nine gap: spare height is now per column. Course gaps take it first (capped 18px), rows share the rest by flex (capped about 16px a row). If more than 100px is still left, that card ends at its content and a real TMDB still sits under it with a short caption ("On the clubhouse wall: Title, Year"). Caddyshack now fits one full-width card with no gap. Happy Gilmore shows a still under its Front Nine card.
3. Title twice: with a poster, the logo plaque is gone. Title and year print small in the club's type, with no box (per locked rule 4, like arcade noLogo). With no poster, the logo shows with no box and a soft glow. An onload check judges it by contrast or chroma against the club colour and falls back to the title in type.
4. House lines: ops file sets the mushroom note to "Button mushrooms filled with crab, cream cheese and spring onion, baked golden" and the G&T note to "Gin over ice with tonic and a squeeze of fresh lime". Also cleaned the film tags off the chilli dog note ("for Danny's break") and the surf and turf note ("check for jockey marks").
5. Prices: new clubPrices() in clubhouse.js runs after priceSense. Mains base raised (x1.3). In each course the dearer dish gets the higher price (surf and turf over prime rib over the rest). Prices in a course never repeat, house lines stay at the foot of their course, every main sits above every starter, and dessert sits below the mains. Caddyshack now reads: starters 1.95/2.50/2.95/3.50, prime rib 3.95, surf and turf 4.50, sundae 1.50, drinks 0.95/2.50.
6. Labels: column header "At the 19th" is now "Dish". Each course bar now has a plain word on the right (Starters, Mains, Dessert, Drinks), so the cue "serve the mains" lines up.
7. Sign: ops sets it to "Members only. Caddies use the rear entrance."
8. Winks: Local Rules prints up to five winks at the biggest size (15, 14 or 13px) that fits all of them. Caddyshack prints all 4, including the gunga galunga line, and Happy Gilmore and Goldfinger print 5. A small "scenes to watch for" tag is added so they read as scenes, not rules.
9. Sliver under hole 9: the card height is now its inner height plus borders, the rows flex to fill, and the last row has no bottom rule.
10. Cover band: the cover is now a flex stack spread evenly (title, poster, venue and sign), so there is no plain band at the foot.

Also: Marker's Note only adds quote marks when the note kind is "quote". The quote is checked as real: Carl, "So I got that goin' for me, which is nice." Em dash in the clean() regex changed to \u escapes.

## For the lead (shared code)
- priceSense in app.js (card extra rule, line ~37) pulls a main marked extra below the cooked mains. That clashes with locked rule 8 when the extra is the dearer dish (Al's surf and turf). Clubhouse now re-ranks after priceSense, but other layouts will hit the same thing.
- Phone: the "Skip to the wheel" link sits over the card's cover on the phone shot. That is app.js, not this layout.
- Other films' house notes on this layout still carry film lines. I did not touch them because they are outside my ops file. Happy Gilmore: "Not what Shooter eats for breakfast.", "From Grandma's kitchen, no IRS letters attached." Goldfinger: "Oddjob takes your hat. Keep the biscuit.", "Below 38 degrees or don't bother, says Bond." Goldfinger's prawn toast note also ends "for the Slazenger 7 swap". Their owners need ops files.

## Owner decision
- Caddyshack now fits one full-width scorecard rather than two side-by-side cards. Type is a little smaller, but every note prints in full on one line and there is no gap. Films with more text still fold into two cards.

## Final check
check-print-text on Caddyshack, Happy Gilmore and Goldfinger: PASS (no dish name or note hidden, Save PDF has no shapes html2canvas drops).

---

## Reception layout review: The Wedding Singer (1998)
**Score: 7.5 out of 10**

The table setting is a good idea and it looks the part. The poster on its easel is a proper hero, the cream menu card with script headings reads like a real reception menu, the logo sits on a clean white card, and the Save PDF page is a near copy of the screen with no grey boxes, black blocks or lost text. What pulls it back: the place card's fold line runs straight through the guest name, the menu loses the food half of three notes while film lines and jokes stay, the seating plan reads as a scene list rather than tables, and on a phone the centre menu card is never shown whole. The film data also gets some names wrong (Rosie is not Robbie's grandma, Glenn has two n's, George is in the band, not "at the hotel").

## Findings

1. **Dish notes keep the film line and lose the food.** Screen and PDF, centre menu card. "Grandma Rosie's meatballs" reads only "Rosie pays Robbie in meatballs." (the data has "Beef and pork, parmesan, tomato." after it). The chicken loses "potatoes and beans" and the cake loses "iced white with buttercream". "Cob loaf spinach dip" says "Julia Gulia? Say it out loud. Then dip." and "Fuzzy navel" says "Robbie drank heavily that night. Pour another." Neither tells you anything about the food. This is the same fault the Toy Story arcade review flagged: a film line where the food description should be. Two causes:
   - [layout] menu-formats/reception.js lines 151 to 155: `gap` takes the estimated spare height and spends it on section margins and divider margins first. When the app's libUnclip (app.js about line 1735) then tries to give a note its second line, the menu body has no room left, so it falls through to dropping whole sentences, and the last sentence is always the food. Fix: fit notes first. Budget two note lines in `fit()` (or take `nl=tr.nl` with no estimate cap), and only put leftover height into the gaps. Also line 150 estimates with `e.cw*1.05` but line 153 counts lines with `e.cw`, so the fit and the render don't agree on how many lines a note needs. Use the same width factor in both.
   - [film] data/film/the-wedding-singer-1998.json `M[0][1]` and `M[1][1]`, and the `house` notes in data/film-flavour.json: put the food first ("Beef and pork meatballs with parmesan, simmered in tomato, over spaghetti"), and rewrite the two house notes as food ("Warm spinach and sour cream dip baked in a hollowed cob loaf"; "Peach schnapps and orange juice over ice"). Cut "before Somebody Kill Me" from the chicken note.

2. **The place card's fold line strikes through the name.** [layout] Screen and PDF, top right. The dashed fold at `top:44%` (reception.js line 169) lands right on the baseline of the script name, so "Robbie Hart Band" looks crossed out. This will hit every film, because the name always sits in that band. Fix: move the fold to the true centre of a tent card and keep the name fully above it (for example fold at 50% and cap the name block at about 40% of the card), or drop the line and use a soft crease shadow behind the text.

3. **On a phone the menu card is never shown whole.** [layout] Phone, the card preview. The app splits one wide page into two views, 0 to 753 px and 591 to 1344 px (app.js `cardFaces`, lines 846 to 847). The menu card sits at 480 to 950 px (reception.js line 147, `MX`, `MW`), so view 1 cuts it on the right and view 2 cuts it on the left. The signature panel of this layout is the one thing a phone user can't read without zooming. Fix: lay the face out so the menu card sits fully inside one view (for example move it to the left half next to a smaller poster, with the right column holding the place card, seating and toast), or have the layout give the app its own two view rectangles.

4. **"Grandma Rosie" is wrong, and so are two other names.** [film] Screen and PDF, menu card, seating plan and showtime cue. Rosie is Robbie's elderly neighbour, who he gives singing lessons to and who pays him in meatballs. She is not his grandma. The card says "Grandma Rosie" three times. Julia's fiancé is Glenn, not "Glen". George is the Boy George lookalike keyboardist and singer in Robbie's own band, so "A Boy George lookalike at the hotel" names a scene that is not in the film. Fix in data/film/the-wedding-singer-1998.json (`S`/`M` names, `P`) and data/film-flavour.json winks: "Rosie's meatballs", "Serve the mains when Rosie pays Robbie in meatballs", "Julia and her fiancé Glenn", "George and his Boy George act".

5. **The seating plan reads as a scene list, not tables.** [layout] Screen and PDF, right column. Tables are named straight from the winks ("TABLE 1 Robbie getting left at the altar by Linda"), which are written as scene notes, so it doesn't read like a seating plan. It also takes only the first four winks (line 173, `slice(0,4)`), so this film loses "Robbie and Billy Idol on the plane", one of its most loved scenes. Fix: let the layout take short table names from the data (a `tables` list in flavour, such as "The Billy Idol Table", "Linda's Empty Seat", "Rosie's Table") and fall back to winks only when they are short. If a film has five winks, show five rows or pick the strongest four in the data.

6. **A band's business card prints as a guest's place card.** [layout] Screen and PDF, top right. The prop is `kind: "card"` (a business card: "Robbie Hart Band, Weddings and Bar Mitzvahs, Ridgefield, New Jersey"), but lines 167 to 172 print any prop's title in script as the guest at the table, with the business lines as a subtitle. Nobody's place card says "Weddings and Bar Mitzvahs". Same kind of fault as the arcade review's prop printing the wrong name. Fix: only use the prop on the place card when it is a person or a guest name, otherwise put a character's name there ("Julia Sullivan" or "Robbie Hart") and use the prop elsewhere. The two prop lines are also joined with ". " and wrap so "Jersey" sits alone on the second line. Balance the wrap (`text-wrap:balance`) or put each line on its own row.

7. **"TABLE 85" doesn't match anything.** [layout] Place card. Line 170 prints `F.num.slice(-2)`, which here is 85 from "1985". Next to a seating plan with tables 1 to 4, it reads like a mistake rather than a wink. Fix: use a table number from the seating plan, or a seated-at line like "Head Table".

8. **"From the Toasts" labels a line that isn't a toast.** [layout] Toast panel, line 179. Every film's quote gets this heading. Here it is Robbie heckling from the microphone, which is not a toast. Fix: choose the label from the note's `kind` ("Overheard at the reception" for a quote, "From the toasts" only when the data marks it as a toast).

9. **Header wording is fixed for every film.** [layout] Menu card, line 159. "THE WEDDING BREAKFAST" is a British term, and it prints on a 1985 New Jersey hall's evening menu. Fine for an English film, odd here. Fix: pick the heading by era or setting ("Dinner Menu", "Reception Dinner") or let flavour set it. Small point, but it's the first line on the menu.

10. **Small polish.** [layout] The toast panel uses `justify-content:space-between`, so short quotes leave a big empty band between the quote and the name (right column, both screen and PDF). Centre the quote block with fixed spacing. [film] "Cob loaf" is an Australian party dish, not 1980s New Jersey; a "Spinach dip in a bread bowl" would fit the hall better.

## What I could not check
I couldn't find a source for the exact wording of "Sir, one more outburst and I will strangle you with my microphone wire". I believe Robbie says a line close to this at a reception, but it may be a paraphrase, so it should be checked against the film or a script before it prints in quote marks. I didn't run a browser, so the cause of the note cutting in finding 1 comes from reading the code and the rendered text, not from stepping through it. The phone screenshot shows the "Skip to the wheel" link sitting over the welcome sign. That looks like a focus state from the capture and comes from index.html, not this layout. Prep sheet pages (pdf-2, pdf-3) were not reviewed.

### Fix log



Files: menu-formats/reception.js, audit/ops/the-wedding-singer-1998-review-25.json (12 ops, all applied, no misses).

1. Notes: fit() takes a new fullNotes option (only note-printing tiers count, each note gets every line it needs before any gap) and the render uses the same width factor as the estimate, with no line clamp on notes, so libUnclip has nothing to cut. Spare height goes into course gaps (capped at 30) and the body is centred. Data: meatball and chicken notes rewritten as food ("before Somebody Kill Me" gone), house lines now "Spinach dip in a bread bowl / Warm spinach and sour cream dip baked in a hollowed bread loaf" and "Fuzzy navel / Peach schnapps and orange juice over ice".
2. Place card: the dashed fold through the name is gone; a soft crease shade sits along the top edge and the text is centred below it.
3. Phone views: page re-laid out so the menu card sits at x 30 to 558, wholly inside phone view 1 (0 to 753); the small-card column (596 to 914) and the poster easel (944 to 1314) sit wholly inside view 2 (591 to 1344). Checked on the phone proof. No app.js change.
4. Names: "Grandma Rosie" now "Rosie" everywhere (dish name, vegetarian alt, diet key, recipe text, cue "Serve the mains when Rosie pays Robbie in meatballs."), winks fixed to Glenn, "George and his Boy George act", "Rosie's rap at her anniversary party".
5. Seating plan: new flavour.reception.tables (up to five) prints as TABLE 1 to 5. Wedding Singer gets "Linda's Empty Seat, Rosie's Rap Table, The Julia Gulia Table, The Boy George Table, The Billy Idol Table" (all five scene nods incl. Billy Idol). Films with no tables list now show their winks (up to five) under "Watch For" with no table numbers, so they never read as table names.
6. Prop: the place card now shows a guest (flavour.reception.guest, else "Our Guest") and the prop prints on its own card hung on the easel legs under a label from its kind (Wedding Singer prop kind set to "business card"), one line per row.
7. "TABLE 85" gone: the place card top line comes from flavour.reception.table ("Head Table" here), else "Table One".
8. Toast label now follows note kind: "Overheard" for a quote, "From the Toasts" for a toast, house wording otherwise; quote marks only for kind quote or a real toast. The unverified microphone-wire line is replaced with Robbie's verified "Once again, things that could've been brought to my attention yesterday!"
9. Menu heading from flavour.reception.heading, default "Dinner Menu" (no more "The Wedding Breakfast" on every film).
10. Toast panel centres its block with fixed 14px spacing, no space-between band. Cob loaf replaced (see 1).
Extra (rule 3/4): the small-card column spreads spare height into capped gaps; if 150px or more is still free it adds a real TMDB still with a short caption. Logo now prints with no box straight on the linen (soft glow), checked on load by contrast or chroma against the linen (80% of pixels must read), else the title and year print in script. Wedding Singer sets noLogo since the poster beside it carries the same logo; its still is captioned with title and year.

For the lead / owners:
- Four Weddings and Doctor Strange (same layout, proofed fine) still carry film lines in their own dish notes ("for the kilted guests", "Pizza Poppa always gets paid", "before Stephen bolts", "for Billy and Tommy"). Their fixers or data owners should clean those; I only touched Wedding Singer data.
- Short menus (Four Weddings, Doctor Strange) leave about 70 to 90px top and bottom inside the menu card after the capped gaps. Under the 100px line, but the owner may want a bigger cap.
- Other reception films have no flavour.reception yet, so they show "Our Guest / Table One" on the place card and winks under "Watch For". Worth adding guest, table and tables per film.
- No prices on this layout, so rule 8 does not apply. No app.js items needed.

check-print-text (Wedding Singer, Four Weddings, Doctor Strange): PASS, no dish name or note hidden, Save PDF copy has none of the shapes html2canvas drops.

---

## Skilodge layout review: Hot Tub Time Machine (2010)
**Score: 7.5 out of 10**

The bones are good. The poster is whole and clearly the hero, the trail-marker course headings (green circle, blue square, black diamond, double black) are a smart idea that reads at a glance, Kodiak Valley is the right venue, the logo sits clean on the card with no grey box, and the Save PDF page is a near copy of the screen with nothing clipped, lost or blacked out. The quote is real and correctly given to Nick, and Chernobly, Blaine, Phil's arm, the fork and the great white buffalo are all accurate. What pulls it back: half the dish notes are film jokes rather than food, the menu card has big uneven gaps under both columns, the 1980s "timber" is a flat grey-violet that does not read as a ski lodge, the snow report panel is 40 percent empty, and the same words repeat across the face ("Kodiak Valley" five times, "1986" twice on one small ticket, "Lift ticket" over "Ski pass").

## Findings

1. **Dish notes that are film lines, not food.** Screen, PDF and phone, menu card. Three of the eight notes say nothing about the food: Loaded potato skins "Fuel for the Poison concert, 1986 style.", Peppermint schnapps hot chocolate "Drink it slow. The repairman is watching.", and the brownie note is half a joke ("Watch the fork, Adam"). Three more tack a film line on after two words of food: fondue "My fondue's getting cold" (I could not find this as a line in the film, yet it reads as a quote), schnitzel "Crumbed chicken. Blaine pummels Lou like it's his job" (a beating is not appetising on a food line), fizz "Russian Red Bull". This is exactly the fault the house rules and the last review call out. Fix: rewrite as food, for example "Twice-baked potato skins, bacon, cheddar and sour cream", "Hot chocolate with peppermint schnapps and whipped cream", "Crumbed chicken breast, warm potato salad, dill cucumbers", "Gruyère and emmental with bread and boiled potatoes for dunking". Keep the jokes in the snow report where they belong. [film] data/film/hot-tub-time-machine-2010.json (S, M, W, D notes) and data/film-house.json around lines 3398 and 3403 (the two house standards).

2. **Uneven columns and big empty gaps on the menu card.** Screen and PDF, menu card. The left column (Green, Blue) ends about 60px above the Showtime rule; the right column (Black, Double Black) ends halfway down, leaving roughly a third of the card blank. fit() picks the tier and split, then the spare height is only spread as extra course margin (o.cgap) and nothing balances the short column. Fix: in the card builder, make each column a flex column with justify-content:space-between (or spread R.spare per column, not per course), and let fit() try the next tier up with dmax allowing two-line names when spare is large. With only eight dishes on this film, a fuller sweets list would also help. [layout] menu-formats/skilodge.js, the card builder around lines 161 to 170, and fit() lines 91 to 99. [film] only one sweet in the data.

3. **The "timber" is not timber in the 80s and 90s band.** Screen and PDF, the background and the poster frame. E[2] sets wood "#3f3a46" and wood2 "#34303a", a cold grey-violet, so the wall reads as grey siding and the "timber frame" round the poster is a flat grey box. A ski lodge needs warm wood; this is the one cue that says lodge. Every film from 1980 to 1999 on this layout gets it. Fix: give band 2 a real wood (say #5b3b24 and #4b301c, darker than band 0 if you want it to feel different) and keep the 80s feel in the card type and accent. [layout] menu-formats/skilodge.js line 121.

4. **Snow report panel is 40 percent empty, and its labels mean nothing.** Screen and PDF, foot left. Only three winks are used (rep=F.winks.slice(0,3)) in a 196px panel, so the bottom of the dark board is a blank slab. "Base / Top / Lifts" sit beside "The hot tub sending them to 1986" and "The one-armed bellhop", which do not answer those labels. This film has five winks, so "Adam's fork in the eye" and "The great white buffalo" are dropped. Fix: show up to five lines with snow-report labels that can take any wink (for example Base, Summit, Lifts, Runs, Tonight), or keep three and centre them in the panel with larger type. [layout] menu-formats/skilodge.js lines 175 to 178.

5. **Duplicated labels on the lift ticket.** Screen, PDF and phone, lift ticket. The header says "LIFT TICKET" then the title says "SKI PASS", which is the same thing twice. Then "Valid 1986" sits right above "No. 1986". Fix: for this film use a prop title like "Winterfest '86" or "Kodiak Valley, Day Pass" and a number that is not the year (or drop the year from the lines when it equals the number). On the layout side, skip the number row when it repeats text already on the ticket. [film] data/film-flavour.json, "Hot Tub Time Machine (2010)" prop and number. [layout] menu-formats/skilodge.js lines 150 to 153.

6. **"Kodiak Valley" five times on one face.** Screen and PDF. Venue "Kodiak Valley Resort", sign "Kodiak Valley Ski Lodge", "Kodiak Valley gruyère fondue", "Kodiak Valley lodge chicken schnitzel", and the ticket's "Kodiak Valley". The venue and sign say the same thing. Fix: sign becomes something a lodge would print, like "Après ski, fireside, till late" or "Winterfest weekend menu", and drop "Kodiak Valley" from the dish names ("Alpine gruyère fondue", "Lodge chicken schnitzel"). [film] data/film-flavour.json venue/sign, data/film/hot-tub-time-machine-2010.json dish names.

7. **"Ski Patrol Says" over a quote from Nick.** Screen and PDF, foot right. The heading is fixed in the layout, so every film's overheard quote is pinned on the ski patrol. In this film the ski patrol is Blaine's gang, the bullies, so it reads as if they said Nick's line. Fix: a neutral heading such as "Overheard at the lodge" or "Heard on the chairlift", keeping the speaker line below. [layout] menu-formats/skilodge.js line 181.

8. **Notes punctuated inconsistently.** Screen and PDF. Two notes end with a full stop ("1986 style.", "watching.") and the rest do not. Small, but it shows on a printed menu. Fix with the rewrite in finding 1, and strip or add a trailing stop consistently in course(). [film] data, and optionally [layout] course() line 107.

## What I could not check
I did not run a browser or any scripts, so I judged only the supplied renders; I did not check the Prep sheet pages, kids' mode, or other films on this layout (findings 2, 3, 4 and 7 should be confirmed on one or two more). I could not confirm whether "My fondue's getting cold" is a real line from the film; I found no source for it. The hidden-price easter egg (sweets ending in .86) did not show, which may be priceSense overriding it on purpose.

Sources checked: [TV Tropes, Hot Tub Time Machine](https://tvtropes.org/pmwiki/pmwiki.php/Film/HotTubTimeMachine) (quote and speaker, Chernobly, Blaine, the fork, great white buffalo).

### Fix log



Files changed: menu-formats/skilodge.js, audit/ops/hot-tub-time-machine-2010-review-25.json (applied, all 11 ops done, 0 misses).

1. Film-line notes: all eight notes now describe the food (ops). Fondue "Gruyère and emmental melted with white wine, bread and boiled potatoes for dunking", schnitzel "Crumbed chicken breast, warm potato salad, dill cucumbers and lemon", brownies "Dark chocolate fudge brownies under thick icing sugar, vanilla ice cream", fizz "Fresh ginger syrup, lemon and lime topped with soda, vodka optional", house skins "Twice-baked potato skins, bacon, cheddar and sour cream", house hot chocolate "Hot chocolate with peppermint schnapps and whipped cream". The unsourced "My fondue's getting cold" is gone. Quote "It must be some kind of hot tub time machine." kept as Nick's (the reviewer confirmed it on TV Tropes). Layout: notes print in full with no clamp.
2. Gaps and uneven columns: fit() now uses only tiers that print notes, gives every note all the lines it needs (cw estimate x1.08) and counts the course gap before any spare. Each column is a flex column: its own spare goes into its course gaps (capped at 30px), then up to 8px into dish gaps; a column still more than about 120px short gets a real TMDB still (ctx.stills) with the caption "From the film, Title (Year)". HTTM's right column now carries the hot tub still; left column ends under 100px short. The single sweet is a film data matter, left as is.
3. Timber: band 2 (80s and 90s) wood is now #5b3b24 / #4b301c, warm brown like the other bands.
4. Snow report: shows up to five winks (as many as fit by estimate; HTTM and Better Off Dead both show all five), spread evenly down the board, marked with the run signs and labelled "Scenes to watch for tonight" instead of Base/Top/Lifts. Logo (rule 4): the dark box is gone in every case; the logo shows bare on the card when it reads on it (contrast or chroma check on its pixels), otherwise the title prints in the layout's display type.
5. Lift ticket: HTTM prop is now "Kodiak Valley / Day pass. All lifts, all weekend / No. 1986" (no year repeat, no ticket-over-pass). Layout: header reads LIFT TICKET for ticket kinds, LIFT PASS for pass, ADMIT ONE if the title already says lift/ski pass; non-ticket props (receipts, cards, bills) fall back to the panel default; the number row drops when its digits already show on the ticket; ticket body centred.
6. "Kodiak Valley" repeats: sign is now "Après ski by the fire, till late"; dish names "Alpine gruyère fondue", "Lodge chicken schnitzel" and the veg alt "Lodge eggplant schnitzel" (recipes, recipes2, diet all renamed together). Venue and ticket keep Kodiak Valley (twice on the face).
7. Fixed heading: "Ski Patrol Says" replaced by "OVERHEARD AT THE LODGE" for real quotes; non-quote notes print unquoted under "FROM THE LODGE". Default note is signed "The lodge", not Ski Patrol.
8. Punctuation: course() strips trailing full stops from every note, and the new notes have none.

Prices (rule 8): added tidyPrices() after priceSense in the layout: dearer dishes lifted to or above the plainer ones in their course, no shared price inside a course, sweets kept under the cheapest main. HTTM now 1.95 / 2.50 / 2.95, 3.50 / 2.95, 1.95, 2.50 / 2.95. No priceSense change needed.

For the lead / shared code:
- None required for this layout. The hidden .86 sweets egg still does not show; priceSense or priceTidy in app.js appears to override it. Owner to decide if it matters.

Owner decisions:
- Better Off Dead's prop is a receipt ("Paper Route Bill"), which does not suit the lift ticket, so it now prints the panel default ("All Mountain, Valid today only, No. 2"). Give it a ticket-kind prop if you want a film line there.
- Better Off Dead's data (not touched, other film): notes "Mum's recipe. Check it isn't moving", "Paid for with the paperboy's two dollars", "from next door", "from the shift at Pig Burgers" are film lines in food notes; and the quote "Didn't ask for a dime. Two dollars." looks paraphrased (the known line is "I want my two dollars!"). Needs its own ops pass.
- The white "OFF" in the Better Off Dead logo is faint on the cream card; the logo still reads overall (red), so it stays.

Final check-print-text (Hot Tub Time Machine, Better Off Dead): PASS, no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops.

---

## Arcade layout review: Wreck-It Ralph

**Score: 7 out of 10**

The arcade frame suits this film better than almost any other. The poster sits whole in the cabinet bezel and leads the page. Tapper's and the root beer are real parts of the film's world, and the high score table using the 30th anniversary number (WRA, 0118094) is a nice touch. "I'm gonna wreck it!" is in, and the Save PDF matches the screen closely: no lost text, no black blocks, no clipped dish names. What pulls it back is the same set of faults the Toy Story review found, still there on a plain film. The logo sits on a light grey slab. The prize counter has a big dead gap under Quick Plays. Three of the nine dish notes are film lines or game trivia, not food. The Top Shelf credit runs into the last prize. And the "prizes" are scene descriptions, not things you could win.

## Findings

1. **Logo on a light grey box, and the title shown twice.** Screen and PDF, marquee top right. The red Wreck-It Ralph logo sits on a #f2f2f2 slab that looks like a pasted-in sticker on the dark neon marquee. The poster right below already carries the same logo, so the title appears twice within 300px. Cause: the sampler in `SAMPLE` (arcade.js line 41) counts any pixel with luminance under 95 as "dark". Saturated red (about 220,30,40) scores around 70, so a bright red logo flips the panel to `data-light` (line 149). This will hit every film with a red, blue or purple logo. Fix: judge the logo by its contrast against black (or by chroma), not raw luminance, so coloured logos stay on the dark panel. Better still, default to the `noLogo` branch (title and year in the marquee) whenever a poster is present, since the poster always carries the title. [layout]

2. **Big empty gap in the prize counter's left column.** Screen and PDF, prize counter. Quick Plays ends about a third of the way down the board, and there is roughly 170px of bare panel above the Showtime line, while the right column is full. The fill-in card (`pan`, lines 169 to 176) only appears when the film has `arcade.panel` flavour, so every plain film gets the gap. `fit()` cannot balance it, because four starters against four other items under three headings is always lopsided. Fix: give `pan` a default, for example a real TMDB still from `ctx.stills[1]` with a short caption, or the film note card, whenever `R.spare` leaves more than about 100px in the shorter column. For this film, the gap is a natural home for the Bad-Anon affirmation, quoted properly (see 3). [layout]

3. **Film lines and trivia printed where food should be.** Screen, PDF and phone, prize counter.
   - Hero's Duty loaded nachos: "Hero's Duty, home of the Cy-Bugs" (data/film/wreck-it-ralph-2012.json, `S[2][1]`). That's game trivia, not a dish.
   - Buffalo wings with blue cheese: "I'm bad, and that's good. Wings help." (data/film-flavour.json, wreck-it-ralph `house.s.note`). This is a joke on the Bad-Anon affirmation, and it cuts the real line short.
   - Root beer from the tap: "Slide it down the bar, Tapper." (`house.d.note`). It describes no drink.
   - Niceland chicken and leek pot pie: the note ends "while Ralph sleeps on the dump" (`M[0][1]`). That's a plot jab tacked onto the food, and the note drops the leek the title promises.

   These break the rule that every dish is described as food, and they're the exact fault the Toy Story review flagged. Suggested fixes: nachos, "Corn chips under spiced beef, black beans, melted cheddar and jalapeño, with salsa, guacamole and sour cream". Wings, "Hot buffalo wings with celery and a blue cheese dip". Root beer, "Ice-cold root beer drawn from the tap in a frosted mug". Pot pie, "Chicken thighs, leek and mushroom in creamy thyme sauce under golden puff pastry". [film]

4. **Credit line runs into the last Top Shelf prize.** Screen and PDF, Top Shelf panel. "Vanellope von Schweetz glitching" wraps to two lines, and "Prizes subject to change. No alcohol served. Images: TMDB." starts straight under it with no gap. The credit also wraps to two lines even though it is clamped to one. Cause: the credit is absolutely positioned at `bottom:8px` (line 200), and the prize rows (line 199) reserve no room for it. Three two-line prizes fill the panel. Fix: make the shelf a flex column with the credit in normal flow and `margin-top:auto`, cap each prize at one line, or shorten the credit to "Images: TMDB." [layout]

5. **The "prizes" are scenes, not prizes.** Top Shelf. "The Sugar Rush candy kart race" and "Vanellope von Schweetz glitching" for 10000 and 15000 tickets read oddly. Nobody wins a race or a glitch at a prize counter. The shelf just takes the first three `winks` (line 196), and winks are written as scene cues for other layouts. The film's own Medal Receipt prop goes unused, even though the medal is the whole plot. Fix in the layout: read an `arcade.shelf` list when there is one, and fall back to `F.prop.title` before winks. For this film, use real objects: "Hero's Duty Medal of Heroes", "Felix's golden hammer", "Vanellope's candy kart". [layout] plus [film]

6. **Ticket prices that don't make sense.** Prize counter. Plain root beer (110) costs more than the cola float with ice cream (70). Bark and pretzel rods both cost 140, and nachos and wings both cost 180. Cause: line 164 rescales money prices that ramp by position (`1+i*.15` in `prices()`), and the house drink is appended second, so it picks up the higher multiplier. Then rounding to 10 makes pairs collide. Fix: price house standards at the bottom of their course's range, and nudge any duplicate up or down by 10 so every price in a course is different. [layout]

7. **Marquee and bezel have dead space.** Screen and PDF. "Tapper's" is set at 32px in the pixel font (line 143 caps pixel-era venues at 32 even when the name is only 8 characters). It fills about a quarter of the marquee, and the middle 500px is empty. Under the poster, the bezel has about 100px holding only the coin slot and INSERT TOKEN, because the quote line (line 157) needs `arcade.quote`. Fix: raise the pixel-font cap to about 44px for names of 10 characters or fewer, and when there is no `arcade.quote`, move the film note (here "I'm gonna wreck it!") into the bezel so the high score panel isn't the only place it appears. [layout]

8. **Venue and sign are slightly off for a prize counter.** Marquee. Tapper's is real (the root beer bar game where Ralph drinks and meets the Hero's Duty soldier), but it's a bar, not a redemption arcade. The sign also puts it inside Game Central Station, when in the film it is a separate game you reach through the station. The arcade with a real prize counter is Litwak's Family Fun Center. Either rename the venue to Litwak's Family Fun Center, or keep Tapper's with a sign that doesn't claim it is in the station, such as "Root beer on tap since 1983". Low priority, because Tapper's does read well. [film]

9. **The dessert doesn't match the Showtime cue, and an iconic line is missing.** Prize counter. The cue says to serve dessert "when the Nicelanders bring out the cake at the anniversary party". The cue itself is accurate, but the dessert is an apple pie called "Felix's anniversary pie", which mixes up the party cake with the pies the Nicelanders give Felix in his game. Rename it "Nicelander window pie" (Felix's reward pie), or reword the cue to match. The Bad-Anon affirmation ("I'm bad, and that's good. I will never be good, and that's not bad. There's no one I'd rather be than me.") is the film's best-known line. It only appears in mangled form as a wing note. Quote it properly in the panel from finding 2. [film]

## What I could not check

I didn't open a browser, so I couldn't check hover or font-loading timing. In the phone capture, the site's "Skip to the wheel" pill sits over the marquee venue name. That looks like a focus-state capture artefact of the page, not this layout, but someone should confirm it. Prep sheet pages (pdf-2, pdf-3) were not reviewed in detail. I didn't web-search the film facts, because the venue, the Cy-Bugs, the 30th anniversary party and its cake, and the Bad-Anon affirmation are well known.

### Fix log



Files: menu-formats/arcade.js, audit/ops/wreck-it-ralph-2012-review-25.json. Baseline for Toy Story taken before any change: /tmp/rv/arcade-baseline/.

1. Logo box: the grey/black logo box is gone. With a poster, the marquee now prints the title and year (the same noLogo look Toy Story has), because the poster already carries the logo; arcade.logo: true brings the logo back. With no poster, the logo sits straight on the panel with a soft glow. The sampler now judges each pixel by relative luminance against the dark panel (saturated reds and yellows pass), and a logo that cannot read is swapped for the title in the layout's type.
2. Empty gap in the prize counter: fit() now returns per-column heights. The shorter column's spare height (after the even course gaps) goes into its own item gaps, capped at 16px. If more than 100px is left, a real TMDB still fills it, captioned with the title and year, or the film's quote card if there is no still. Ralph has arcade.panel set to the Bad-Anon affirmation (ops), so that is what fills his gap. The quote card sizes itself to the space (19 to 15px).
3. Notes (ops): nachos "Corn chips with spiced beef, black beans, cheddar, jalapeño, salsa and guacamole"; wings (house.s) "Hot buffalo wings with celery and a blue cheese dip"; root beer (house.d) "Ice-cold root beer drawn from the tap in a frosted mug"; pot pie "Chicken thighs, leek and mushroom in creamy thyme sauce under golden puff pastry".
4. Shelf credit: the shelf is now a flex column and the credit sits in the flow (margin-top:auto), so nothing can run into it. No clamps on the prize lines.
5. Prizes that were scenes: the shelf reads arcade.prizes (real objects with tickets) first. If a film names its own shelf (arcade.shelf, as Toy Story does), it keeps its winks as prizes, since those were written as prizes. Otherwise the panel becomes "WATCH FOR" and lists up to five winks with no prices, so scene nods never read as prizes (rule 7). Ralph's winks were shortened to scene nods (ops). The Medal Receipt prop is a slip, which does not suit a prize shelf, so per rule 5 it stays off.
6. Prices: ticket prices are now post-processed per course. House lines sit at the bottom of their course's range, no two items in a course share a price, and dessert scales under the cheapest main. Ralph is now 140/150/180/130 for snacks, 260/220 for mains, 100 for the pie, and 70/60 for drinks.
7. Dead space: the pixel-font venue cap goes up to 44px for names of 10 characters or fewer ("Tapper's"). With no arcade.quote, the film note moves into the bezel under the poster (sized 18 to 15px to fit) and leaves the high score table.
8. Venue and sign: kept Tapper's and changed the sign to "Root beer on tap since 1983" (ops), so it no longer claims to be inside Game Central Station.
9. Dessert and cue: renamed to "Nicelander window pie" (Nicelanders leave pies out the window for Felix in his game; checked on the Disney wiki), carried through recipes. The cue is now "Serve dessert when the Nicelanders throw Felix's 30th anniversary party." The Bad-Anon affirmation is quoted word for word in the board panel (checked) and signed "The Bad-Anon group".

Found while fixing (rule 2): every arcade film was landing on an nl:1 tier, so all notes were clamped to one line and relied on libUnclip. Two-line notes only showed because libUnclip opened them, and the long nachos note was cut to its first clauses. Fixes: notes now get the lines their estimate needs (up to 3); cw is .40 and cwd .44 (measured on Oswald, was .46/.50); the course heading estimate now matches the drawn size (pixel font at .62) and includes the 12px base course gap, which used to be left out (Snatch's right column overflowed by about 25px without it); and two extra 17px and 16px tiers sit ahead of the tiers that drop notes.

Toy Story vs baseline: same tier (19px names / 14px notes), same panels, course gaps within 0.4px. The only difference is the two house-line prices from rule 8: mozzarella sticks 190 to 110, cherry slushie 100 to 60. Owner call: if Toy Story's prices must stay frozen, the house-price rule needs an opt-out flag.
Snatch: now prints the title and year in place of the black logo box, a real still in the left gap, the note in the bezel, winks under WATCH FOR, and a 16px name tier (its notes got longer in another fixer's ops, so the board needed it).

For the lead (shared code / other films):
- libUnclip clause-dropping looks like it can fire before Oswald loads (the fallback font wraps wider). The layout no longer relies on it, but it is worth a look in app.js.
- Snatch dish notes still carry film lines ("Do you like dags? Have an eel.", "Avi, who can't wait to get out of London", "Turkish's cuppa, while the dog digests a diamond."). That is film data for the Snatch fixer.
- Phone capture: the "Skip to the wheel" pill still sits over the marquee in the phone view (app.js/index.html).

Final check-print-text (Wreck-It Ralph, Toy Story, Snatch): PASS, no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops.

---

## Drivein layout review: Ghostbusters: Afterlife

**Score: 8 out of 10**

The bones are good. The poster is shown whole on the drive-in screen and is clearly the hero. The venue is right: Spinners Roller Hop, the carhop drive-in where Trevor gets his summer job, is named on gbfans' film page. The Grooberson line over the speaker is a real quote. The showtime cue (Mini-Pufts loose in the supermarket) is a real scene. The Save PDF page matches the screen almost pixel for pixel, with no grey boxes, lost text or clipping. What pulls it back: three dish notes describe the film instead of the food. The film logo sits in a visible black box in the header. The right column stops well short of the left and leaves a white hole. The bay prop prints a bare title, "Ghost Trap Slip", that means nothing to a reader. The film's most famous moments barely show up.

## Findings

1. **Notes that do not describe the food.** Screen, PDF and phone, menu panel. "Muncher's corn fritters with jalapeño ranch" reads "Trevor's first shift, Lucky pretending not to notice." "Root beer in a frosted mug" reads "Phoebe's order, plus one bad science joke." "Oklahoma chicken fried steak with gravy" reads "Dinner in the small Oklahoma town". The cornbread note starts as food and then trails off into "for the dirt farm Callie inherits". This is the same fault the Toy Story review found: a film line printed where the food should be. On a real diner card it reads as filler. Fix: rewrite them as food, for example "Sweet corn fritters fried golden, jalapeño ranch for dipping", "Ice-cold root beer poured into a frosted glass mug" and "Tenderised steak fried crisp, peppery white gravy, mash and green beans" (that one is already in the recipe text). End the cornbread note at "flaky salt". [film] data/film/ghostbusters-afterlife-2021.json: lib.flavour.house.s.note, lib.flavour.house.d.note, M[1][1], S[1][1].

2. **Logo on a dark box.** Screen and PDF, header, top right. The logo panel always paints rgba(0,0,0,.35) behind the logo, even on the already dark navy header. The result is a hard black rectangle that looks like a pasted image. It is the same class of fault as the "logo on a grey box" from the last review, and it will show on every film on this layout whose logo takes the dark panel. Fix: in menu-formats/drivein.js line 157, make the dark-panel state transparent (data-dark="transparent" and background:transparent), since the header is already dark. Keep the light #f4f1ea panel only for dark logos. Also worth asking whether the logo is needed at all, given the poster right beside it carries the same title treatment. [layout]

3. **Uneven columns, empty block bottom right.** Screen and PDF, menu panel. The left column (Starters, Grill) runs to the bottom of the menu area. The right column (Sweets, Drinks) stops about 90px higher, which leaves a white hole above the showtime line. The fit() split picks the best of only one possible 2 and 2 split. The spare height goes into course gaps (cgap, line 150) evenly across both columns, so it never evens up the short column. Fix: after fit(), add the height difference to the short column's course gaps, or spread its items with justify-content:space-between on a flex column (lines 148 to 158). [layout]

4. **Bay prop prints a meaningless label.** Screen, PDF and phone, order slip, under the bay number. The slip shows "BAY 21" and then "Ghost Trap Slip". The prop's lines ("Summerville, Oklahoma", "Contents: the Keymaster") are thrown away, so a reader sees a title for something that is not there. It reads like the name of the bay, which is wrong. Fix: in drivein.js line 164, print the first of F.prop.lines (for example "Contents: the Keymaster") instead of the title, or leave the prop out and use the default "Flash your lights for service", which suits a carhop bay. [layout]

5. **Iconic moments barely there.** All views. The layout ignores F.winks and F.stills completely (film() builds them, but drivein.js never reads them). So Muncher's chase in the Ecto-1, Egon's farm and ghost traps, and Podcast do not appear anywhere. The only film touches are the quote, the cue, and three names (Keymaster, Ecto-1, marshmallow men). "Keymaster fried okra" has nothing to do with the Keymaster. The ending ("Who you gonna call", Phoebe's "No, I'm twelve. Are you?") is missing. Fix: use one wink as a short line in the header strip or slip, or add a small real TMDB still on the tray (the data has 8 stills with focus points). [layout] drivein.js, window.MENU_FORMATS factory. Also [film]: give the okra a name that fits, or tie it to a real scene.

6. **"Toasted marshmallow pie" is described as meringue.** Screen, PDF, Sweets. The name promises marshmallow, but the note says "topped with toasted meringue". A diner would read that as a mismatch. The recipe text calls it a "marshmallow meringue". Fix: change the note to "topped with a tall marshmallow meringue, torched". [film] W[0][1].

7. **Two "roller diner" names on one card.** Screen, PDF. "Ecto-1 roller diner burgers" and "Roller diner chocolate malt shakes" repeat the same filler phrase, which also echoes the venue name above them. It reads as generated. Fix: "Ecto-1 double smash burgers" and "Chocolate malt shakes". [film] M[0][0], K[0][0].

8. **Dot leaders shrink to a stub on two-line names.** Screen and PDF. On wrapped names ("Farmhouse pan cornbread, honey butter", "Roller diner chocolate malt shakes", "Oklahoma chicken fried steak with gravy") the leader is a 16px stub floating beside the first line. The price sits up there too, away from the end of the name. It looks broken next to the full leaders on one-line names. Fix: in course() (drivein.js lines 104 to 106), use align-items:flex-end so the leader and price sit on the last line of the name, or drop the leader when the name wraps. [layout]

9. **The era look does not fit the venue.** All views. The film is set as "modern", so the card gets band 3: a plain white card in DM Sans. Spinners Roller Hop is a retro 1950s-style carhop, and the 1950s band (cream card, Yellowtail and Arvo, "From the Grill", "Shakes and Sodas") would look far more like the real venue. Fix: let flavour set a look band for the venue, separate from the film's era, or set this film's drivein era to 1950s in data/film-format.json. [film], with a [layout] hook in drivein.js line 128 (E[F.b]).

10. **Showtime line missing from the phone peek.** Phone, the card preview above "Swipe to turn". The menu half of the card shows a blank band between the Grill section and the order slip, where the screen and PDF show the Showtime line. The cue does appear as text further down the phone page, so nothing is lost. But the card preview differs from the print. I could not find the cause in drivein.js. Fix: check how the phone preview handles the cue's -webkit-box clamp element (drivein.js line 111, cueLine). [layout], unconfirmed.

## What I could not check

Whether the house dishes (corn fritters, root beer) come from shared app code or only from this film's flavour data. I did not read the Prep sheet pages or kids' mode. I could not confirm what Phoebe orders at Spinners (no transcript loaded), so I am treating "Phoebe's order" as unverified. I did not find the cause of finding 10.

### Fix log



Files: menu-formats/drivein.js, audit/ops/ghostbusters-afterlife-2021-review-25.json. Only film on drivein, so only it was proofed.

1. Notes: house fritters now "Sweet corn fritters fried golden, jalapeño ranch for dipping.", root beer "Ice-cold root beer poured into a frosted glass mug.", steak "Tenderised steak fried crisp, peppery white gravy, mash and green beans", cornbread ends at "flaky salt". All via ops.
2. Logo: the poster beside it already carries the same logo, so the header now prints the title and year in the layout's body type, no box. With no poster, the logo shows unboxed with a soft glow and a contrast/chroma check against the header; if under half its pixels read, it gives way to the title. Old dark/light box and luminance SAMPLE no longer used here.
3. Columns: each column now spends its own spare height on its own gaps (course gap capped at +44px, item gaps at +10px), no gap after the last course. Any hole over 100px left after that takes a real TMDB still (ctx.stills, poster excluded) with a short "From Film (Year)" caption. On this film the right column gets an Ecto-1 still.
4. Prop: prints under its own title as a small label ("Ghost trap slip") plus its lines, skipping lines the sign already says; kinds that do not suit a carhop bay (anything not slip, ticket, receipt, card, order, stub, voucher, coupon, tag) fall back to "Flash your lights for service". Prop line changed from the unverified "Contents: the Keymaster" to "Contents: Muncher" (Muncher is the ghost trapped after the Ecto-1 chase).
5. Winks: all five now print on a marquee board on the screen posts, labelled "Scenes to watch for" (replaces the crossbar; films without winks keep the crossbar). Still added per item 3. "Keymaster fried okra" renamed "Summerville fried okra".
6. Pie note now "Chocolate ganache in a cookie crust, topped with a tall marshmallow meringue, torched".
7. "Ecto-1 roller diner burgers" to "Ecto-1 double smash burgers" (veg alt "Mushroom and haloumi smash burgers"), "Roller diner chocolate malt shakes" to "Chocolate malt shakes". Recipes, recipes2 and diet files follow.
8. Leaders: a name the estimate says will wrap drops its dot leader, and rows align flex-end so the price sits on the name's last line.
9. Owner decision, not changed: the film is set "modern" in data/film-format.json, so drivein gives it band 3 (white card, DM Sans). Spinners is a retro carhop, and the 1950s band (cream card, Yellowtail/Arvo, "From the Grill", "Shakes and Sodas") would suit the venue better. Options: set this film's era to 1950s in film-format.json (simplest), or add a flavour "look" field the layout reads instead of the film era. drivein.js picks the band at E[F.b], so a hook is one line if the owner wants the second option.
10. Phone peek blank cue: not found in drivein.js (cue is a plain 2-line clamp in a fixed-height box, prints fine on screen and PDF). Likely the phone peek scaling or libUnclip/fitLines in app.js handling the clamped element. For the lead.

Also fixed (rule 2 and 8):
- Notes print whole: fit() now budgets every line a note needs (up to 4, cw raised 10% to match real DM Sans wrap), only uses tiers that show notes (added smaller nl tiers down to 15/12px), and notes have no clamp, so nothing relies on libUnclip.
- Prices: new tidyPrices() after window.priceSense. Steak, lobster, prawns, prime rib and similar never cost less than a plainer dish in the course (chicken fried steak was 11 under burgers 12, now 13); no duplicate prices in a course (drinks were 4 and 4, now 4 and 5); sweets kept below the cheapest main.

Shared-code items for the lead:
- window.priceSense (app.js) priced the chicken fried steak below the burgers and gave both drinks the same price; worked round in drivein's tidyPrices, but the shared pass is the cause.
- Phone peek cue (finding 10).

Final check-print-text: PASS: no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops.

---

## Deli layout review: Rumble in the Bronx (1995)
**Score: 7.4 out of 10**

The deli board is a strong idea and mostly well made. The dark slatted board in a timber frame, the red NOW SERVING sign with its glowing number, the taped poster and the paper receipt all read as one place, and the Save PDF page matches the screen almost pixel for pixel: no grey boxes, no black blocks, no clipped words, the ticket notches and the receipt print clean. The poster is whole and is clearly the hero. What pulls it back is space and labelling. A big empty patch of board sits under the poster, the "Signed on the wall" box is a third empty, and a second copy of the title logo takes the room the dish notes needed, so one note gets cut to a stub. The fixed course labels put sweet and sour pork and lobster noodles under "SANDWICHES", and the take-a-number ticket prints "SUPERMARKET RECEIPT" right above a real receipt panel. Three of the ten notes are film jokes, not food.

## Findings

1. **Big empty gap under the poster.** Screen and PDF, left panel. The poster ends about 190px (of 960) above the bottom frame, and nothing fills it, while the centre and right columns run to the bottom. It is the most visible fault on the card and the same kind of "big empty gap" the last review flagged. Cause: `posterFit(LW-20, H-PY-M-10)` in menu-formats/deli.js (line 149) caps the width at 380px, so a 2:3 poster is only 570px tall in a 748px area. It will hit every film on this layout. Fix: widen the left column so the poster can use the full height (about 500px wide), or keep the width and put a still, a small "Since 19xx" sign or the logo panel (see 3) under the poster. [layout]

2. **"SANDWICHES" holds no sandwiches.** Screen and PDF, centre board. "Hovercraft sweet and sour pork" and "Ginger and spring onion lobster noodles" sit under a "SANDWICHES" heading. On a printed menu that reads as a mistake. Cause: the labels are fixed in `sections(ctx,F,["Starters","Sandwiches","From the Case","Drinks"])` (line 181), whatever the mains are. Most films on this layout will not have sandwich mains. Fix: only say "Sandwiches" when every main matches the `BREAD` test (line 127) on its name or shopping list; otherwise use "Hot Plates" or "From the Kitchen". [layout]

3. **Duplicate logo box takes the room the notes need, and a note gets cut to a stub.** Screen and PDF, bottom of centre board. The title logo prints a second time in a 96px dark box with a grey border (line 187), right beside the poster that already carries the same logo. That box plus its gap (`LGH=96`, `-26` in line 180) squeezes the menu so the fit picks one-line notes, and app.js `libUnclip` then trims "Soft steamed buns stuffed with chicken, mushroom, spring onion and ginger in sticky oyster sauce" down to "Soft steamed buns stuffed with chicken, mushroom." which reads as broken (the phone shows the full note). Fix: drop the logo box when a poster is shown (or move it under the poster, finding 1) and give that height back to `MH`, so notes get two lines. [layout]

4. **The take-a-number ticket prints the wrong name, and repeats the receipt.** Screen and PDF, top right. The ticket says "TAKE A NUMBER 96" then "SUPERMARKET RECEIPT / Cereal, rice, one very tall visitor". A ticket is not a receipt, and there is already a real receipt panel two boxes down ("HEARD AT THE COUNTER"), so the card has two receipts. The second prop line, "Total: ask Uncle Bill", is dropped. Cause: the ticket uses `pr2.title` and `pr2.lines[0]` whatever `prop.kind` is (lines 159 to 160). Fix: on deli, print the prop on the ticket only when its kind is a ticket, slip or order; for a receipt kind, print its lines inside the receipt panel above the credit and keep the ticket as "NEXT IN LINE / Please wait to be called". Same fault class as "a prop printing the wrong name" last review. [layout]

5. **Three notes are film jokes, not food.** Screen, PDF and phone. "Jamaican beef patties: Tony's gang trashed aisle three. Grab one anyway." and "Hong Kong lemon iced tea: Keung earned this after the big leap." (both from data/film-house.json, Rumble entry) describe nothing about the food. "Hovercraft sweet and sour pork: ...Sword sold separately." (data/film/rumble-in-the-bronx-1995.json, M[1]) ends on a gag; the sword is real in the film (Keung bolts a museum sword to a Lamborghini to wreck the hovercraft) but it is still not food. Fix: "Flaky golden pastry filled with spiced, curried beef"; "Strong black tea over ice with fresh lemon slices and sugar syrup"; cut the sword line. [film]

6. **"Heard at the counter" puts made-up words in Keung's mouth.** Receipt panel, all views. "I came for a wedding, and now I'm fighting bikers in the aisles. Please keep my receipt." signed "Keung" is not a line from the film, and it is set out as a quote with a speaker. It also reads like a written gag, not something said. The layout adds quote marks in code (line 175) but they do not show on screen, so the line is at least unquoted, yet the credit still makes it read as heard. Fix: sign it "The Counter" or use a real line. Note this is the venue panel, so a counter note in the house voice ("Ask about Uncle Bill's wedding tea. Bikers wait outside.") fits better. [film]

7. **"Signed on the wall" box is a third empty and is not signed photos.** Screen and PDF, right column. Four italic lines fill about 170px of a 280px box (`SH=280`, line 164), leaving an uneven gap. The heading promises signed photos, but these are plot notes ("Diamonds in Danny's wheelchair cushion"), which nobody signs. Fix: size the box to its content and give the spare to the receipt, or rename it "Overheard in aisle three" / "Store notices"; show the fifth wink when room allows (`slice(0,4)`, line 171). [layout]

8. **Prices put lobster below pork.** Centre board. Lobster noodles 4.50, sweet and sour pork 4.95; lobster tails for $4.50 is not believable on any 1995 New York board. Order and values come from `prices()` and `window.priceSense` (lines 63 to 67), not this film alone. Fix: priceSense should rank shellfish, lobster and steak at the top of their course. [layout]

9. **The "felt letter board" look is not really there.** Centre board. The comment at the top of deli.js promises white push-in letters; what prints is clean Oswald text on faint stripes, with headings as white tabs and red type (line 183). It looks tidy but generic, closer to a digital screen. Fix: a felt letter board has evenly spaced capitals in one size with visible groove rows behind them; align the row height to the 12px stripe and drop the white heading tabs for red push-in letters. [layout]

10. **Small: ticket and receipt spacing.** Top right ticket has about 35px of dead red space under its one line of text; the receipt's quote floats with uneven space above and below it (`justify-content:space-between`, line 173). Fix: let the ticket height follow content, and anchor the quote under its heading. [layout]

11. **Venue fit (one line, as asked).** A supermarket with a take-a-number deli counter works for this film; the board name could be Elaine's, since she owns the store for most of the film. [film]

Film facts checked: White Tiger's men do hijack the hovercraft, the diamonds do end up in the cushion on Danny's wheelchair, Elaine buys the store, and Keung drives the hovercraft onto the golf course, so the showtime cue and the wall lines are right ([Wikiwand: Rumble in the Bronx](https://wikiwand.com/en/articles/Rumble_in_the_Bronx)).

## What I could not check
Live behaviour (refit on font load, tap to zoom, other eras' deli looks) as I did not run a browser. The stacking chart branch never fires here (first main has no bread), so it is untested. Phone view is mostly app chrome; the card preview there is cropped by the carousel and partly covered by the "Skip to the wheel" button, which I take to be app wide, not deli.

### Fix log



Files changed: menu-formats/deli.js, audit/ops/rumble-in-the-bronx-1995-review-25.json (all 5 ops applied, 0 misses).

1. Gap under poster: left column widened to 500px (right column 280px), so the 2:3 poster is 480x720 and fills the left side; no empty board under it for any film.
2. "Sandwiches": the mains heading only says Sandwiches when every main has bread (BREAD test on name or shopping list); otherwise "Hot Plates". Rumble now prints Hot Plates.
3. Duplicate logo box removed when a poster shows; the height goes back to the menu. With no poster the logo sits on the board with no box (soft glow) and an onload check (dark and low chroma pixels) swaps it for the title in board letters. Notes print in full: fit() now counts every line a note needs (up to 4), drops the tiers that hide notes, adds smaller note tiers, and uses per-font widths (Lora .52, Barlow .48, Inter Tight .50; names .44). Bao note prints whole, no libUnclip trim.
4. Ticket: a prop prints on the ticket only when its kind is ticket/slip/order/stub/pass (label follows the kind). Receipt props print their title and all lines at the top of the receipt panel; anything else falls back to "Take a number / Next in line / Please wait to be called". Rumble: ticket is Next in line, receipt panel shows "Supermarket Receipt" with both lines, including "Total: ask Uncle Bill".
5. Notes rewritten through ops: beef patties "Flaky golden pastry filled with spiced, curried beef"; lemon tea "Strong black tea over ice with fresh lemon slices and sugar syrup"; sweet and sour pork "Crispy battered pork with pineapple and red capsicum in sweet and sour sauce, over jasmine rice" (matches its recipe).
6. Counter line replaced with a house note signed "The Counter": "Ask about the wedding tea. Bikes stay out of the aisles." Quote marks now print only when the note kind is quote; panel heading reads "From the counter" for notes, "Heard at the counter" for quotes.
7. "Signed on the wall" renamed "Scenes to spot", shows up to five winks, and the box is sized to its lines; it gives up winks only if the receipt would not fit. All five Rumble winks print. Stacking chart is also sized to its content.
8. Prices: deli prices() now dedupes each course first, then gives dear dishes (lobster, steak, prawns, crab etc.) the top prices of their course. Lobster noodles 4.95 over pork 4.50.
9. Letter board: white heading tabs dropped; headings are red push-in capitals with a slight press shadow straight on the board. Kept the existing type otherwise (no full felt letter redesign).
10. Ticket height follows its content (notches centred); receipt content is anchored under its heading with the credit at the bottom, and the note size steps up to use the paper's room.
11. Venue left as Uncle Bill's Supermarket. Owner decision: rename to Elaine's (she owns the store for most of the film), which would then need the dish "Elaine's supermarket Reuben bites" and the wedding tea reviewed together.

Rule 3 still fill: if the menu column still has more than about 110px spare after capped course gaps (26px each), a real TMDB still prints under the menu with a title and year caption. It does not fire for Rumble (the gap left is about 55px).

Shared code for the lead:
- app.js libMenu cuts every note to 100 characters (libTrim). My first pork note (104 chars) lost its last clause; I shortened it. Worth a check across all films for notes over 100 chars.
- window.priceSense does not rank dear dishes (lobster, steak, prawns) above plain ones in a course or stop shared prices; deli works around it locally, every other layout still relies on it.

Rule 10: Rumble is the only film on deli (data/film-format.json), so no other film could be proofed in the browser. I ran the layout in node with a sandwich menu (stack branch, ticket-kind prop, quote note) and with no poster (logo with title fallback): both render, Sandwiches and the stack print, lobster roll takes the top main price.

Final check-print-text: PASS (no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops).

---

## Dimsum layout review: Rush Hour (1998)
**Score: 6.5 out of 10**

The bones are good. The poster is a proper hero in its lacquer frame, the tick sheet reads like a real yum cha order sheet (numbered rows, price and qty columns, pen ticks, table number in pen, a rubber stamp), the type is clear, and the Save PDF page is a near copy of the screen with no grey boxes, black blocks or clipped words. What pulls it back is the words. Six of the ten "From the kitchen" notes are film lines or plot notes, not food, and one quote is printed twice. Two Southern soul food plates sit on a Chinatown dim sum sheet. The footer tag is headed "Tea for the table" but holds a plane ticket. The logo sits on its own pale box, and the ticks mark the first row of each section rather than tonight's dishes.

## Findings

1. **Film lines printed where food should be, and one quote printed twice.** Screen, PDF and phone, tick sheet "From the kitchen" column. A2 "Carter's order, extra hot", A4 "Do you understand the words that are coming out of my mouth?", B1 "The Chinatown restaurant where it all kicks off" and D2 "Lee's order. Say 'y'all' with it." say nothing about the food. A3 starts as food and then trails off into "chilli oil, do you understand the words", which repeats A4's line on the same card. This is the same fault the Toy Story arcade review flagged, and it breaks the house rule that every dish is described as food. Fix: rewrite the notes as food, for example A2 "Wings baked crisp, tossed in butter and hot sauce, ranch dip", A3 ending at "steamed, chilli oil and black vinegar", A4 "Lightly floured squid tossed with salt, white pepper, chilli and spring onion", B1 "Wide rice noodles wok-fried with beef, bean sprouts and spring onion", D2 "Chrysanthemum flowers steeped and chilled, sweetened with rock sugar". If the "words coming out of my mouth" line is wanted, put it in the trolley quote panel once. [film] data/film/rush-hour-1998.json (S[0] and S[2] notes, M[0] note) and data/film-flavour.json lib.flavour.house (s and d notes).

2. **B2 note is wrong and names someone who is not in the film.** Tick sheet, B2: "Fried chicken and greens. Chen: no soul food". The dish is a fried chicken and mac plate, but the note leaves out the mac. There is no Chen in Rush Hour either (cast: Lee, Carter, Griffin/Juntao, Consul Han, Sang, Johnson, Russ, Clive Cod, Captain Diel, Soo Yung). Fix: "Buttermilk fried chicken, smoky braised greens and baked mac and cheese". [film] rush-hour-1998.json M[1] note.

3. **Soul food on a yum cha sheet.** Tick sheet, A2 hot wings and B2 fried chicken and mac plate. The venue is the Foo Chow, a real Chinatown Cantonese restaurant. Wings and a soul food plate don't belong on its dim sum order sheet, so the "real menu from a venue in the film's world" rule fails. The Carter joke also leans on a stereotype. Fix: swap them for Foo Chow dishes (char siu bao, har gow, sticky rice in lotus leaf, salt and pepper pork). Keep any Carter nod in the trolley line. [film] rush-hour-1998.json S[2], M[1].

4. **The prop prints under the wrong label.** Screen and PDF, footer gold tag. The heading is always "TEA FOR THE TABLE", but this film's prop is a flight ticket ("Hong Kong to Los Angeles / Inspector Lee. Seat 1A, no talking"), so a plane ticket reads as a tea. It is the same kind of fault as the prop printing the wrong name on arcade. The title also breaks badly as "Hong Kong to Los / Angeles", and "Inspector Lee" doesn't match "Chief Inspector Lee" in the next panel. Fix: only use the tea tag heading when the prop is a tea. For other prop kinds (ticket and so on), use a label that fits, such as "ON THE TABLE" or the prop kind, or fall back to the default jasmine tag. Add a balanced break or smaller type for titles over about 18 characters. [layout] menu-formats/dimsum.js lines 180 to 182 (foot). [film] for "Inspector Lee" in film-flavour.json prop.lines.

5. **Logo on its own pale box, and it repeats the poster title.** Screen and PDF, header card. The red logo is judged "dark" by SAMPLE (line 40), so the panel switches to data-light, mix(paper,white,.5). That paints a visibly whiter rectangle on the cream card (pixel 254,252,248 against 253,249,241, easy to see when zoomed), which is the "logo on a grey box" fault again. The same RUSH HOUR logo also sits about 2 cm above the same words on the poster. Fix: when the light panel would apply, leave the panel transparent so the logo sits straight on the card paper. Better still, drop the logo from the header when a poster is shown and give the space to the venue and sign. [layout] dimsum.js line 141 (head) and SAMPLE line 40.

6. **Ticks don't mark tonight's dishes.** Tick sheet, QTY column. A pen tick goes on row i===0 of every section, so A1, B1, C1 and D1 are ticked. A2 wings and A3 dumplings are part of tonight's cook (they have recipes on the phone) but are unticked, while the house standards (A4, D2, "not part of tonight's cook") look the same as cooked dishes. The header comment says "tonight's dishes ticked off in pen". Fix: tick every row that is not a house item, using whatever flag the app sets for house items. [layout] dimsum.js line 164.

7. **Section headings don't match their dishes.** Tick sheet. "Steamed and Fried" holds beef chow fun and a fried chicken plate. Nothing in it is steamed, and the only steamed dish (A3 dumplings) sits under "Small Plates". The fixed labels will mislead on most films. Fix: call the mains "Kitchen Specials" or "Rice and Noodles", or choose "Steamed and Fried" only when the mains really are. [layout] dimsum.js line 149.

8. **Sign alludes to the slur scene, and at the wrong venue.** Header card, sign line: "Chinatown, Los Angeles. Mind who you greet." The greeting gag is Lee repeating Carter's racial slur in a bar, not at the Foo Chow, so it is wrong for this venue and in poor taste on a dinner menu. Fix: something true to the Foo Chow, for example "959 North Hill Street, Chinatown. Dim sum daily." [film] film-flavour.json "Rush Hour (1998)".sign.

9. **The iconic scenes never reach the page.** The film's winks are in the data (Soo Yung, the ransom by accident, the Beach Boys and Carter's radio, the vase caught in mid air) but dimsum.js never prints F.winks. Apart from the misused "words coming out of my mouth" line, nothing on the card nods to War, the radio or the vase. The house rule asks for iconic lines and scenes. Fix: give the winks a home, such as a small "Specials on the trolley" strip under the showtime line or the stamp column, or make the trolley quote a real line. [layout] dimsum.js, film() returns winks (line 78) but the face never uses them.

10. **Trolley quote is signed by the wrong person.** Footer, "From the trolley". An invented line ("Please do not touch the dumplings... Detective Carter, I mean you.") is signed "Chief Inspector Lee" under a heading that suggests the trolley lady. It is printed without quote marks so it doesn't pass as a real quote, but Lee would never sound like a waiter. Fix: sign it "The Trolley Lady", or use a real line from the film with Lee or Carter named. Note that dimsum.js line 185 wraps the note in quote marks, yet the render shows none. Check which is intended, because with the marks it would pass as a real quote. [film] film-flavour.json note; [layout] line 185.

11. **Showtime cue is slightly off.** Sheet foot: "Serve the mains when Lee walks into the Foo Chow restaurant." In the film Carter goes to the Foo Chow alone, finds the tape of Juntao, gets jumped, and Lee arrives to rescue him. Fix: "Serve the mains when Carter walks into the Foo Chow alone." [film] rush-hour-1998.json P.

12. **Small copy points.** D1 "for the consul's farewell": there is no farewell in the film, so drop the clause. "Foo Chow" appears four times on one card (venue, A3, B1, cue), so rename A3 "Prawn and bamboo shoot dumplings". [film].

13. **Phone: a "Skip to the wheel" pill covers the menu's header card.** Phone, first page of the menu carousel. It hides the venue name and half the logo. It looks like an app-level skip link left visible, not the layout. Worth checking it hides when not focused. [app, not layout] index.html or app.js skip link.

## What I could not check
I didn't run a browser, check scripts or tests (per the brief), so this rests on the supplied renders. I didn't check the Prep sheet PDF pages closely, or how the layout handles a film with no logo, four dishes per section or a different era. I couldn't confirm from the code why the trolley quote prints without the quote marks the code adds.

### Fix log



Files: menu-formats/dimsum.js, audit/ops/rush-hour-1998-review-25.json (51 ops, all applied, 0 misses).

1. Notes now describe food: A2 (now five spice wings), A3 ends at "chilli oil and black vinegar soy", A4 squid (house.s), B1 "wide rice noodles wok-fried with beef, bean sprouts and spring onion", D2 chrysanthemum (house.d). The "words coming out of my mouth" line moved to the quote panel once, in quote marks (checked word for word: ACMI, Carter to Lee).
2. B2 replaced (see 3). The made-up "Chen" is gone.
3. Soul food swapped for Cantonese dishes. Carter's hot wings became Five spice chicken wings, with name, note, recipe, steps, shopping, make-ahead, the vegetarian alt (Five spice cauliflower) and the diet note all rewritten together. Carter's fried chicken and mac plate became Lemon chicken, with a full recipe and 13 shopping lines matched. Foo Chow noodles became Beef chow fun (veg alt "Tofu chow fun"). D1 lost "for the consul's farewell".
4. Tag heading now follows prop.kind: "TEA FOR THE TABLE" only for tea or no prop, otherwise the kind itself ("TICKET", "TICKET STUB" for stub). Titles over 18 characters drop to 21px (19px over 26) with text-wrap:balance, so it now breaks "Hong Kong / to Los Angeles". Prop line changed to "Chief Inspector Lee".
5. Logo box removed. With a poster beside it, the header prints the title and year in the layout's type. Without a poster, the logo sits straight on the card paper with a soft glow and is kept only when 55% of its pixels read on the paper (contrast 2.2 or more, or strong chroma). Otherwise it falls back to the title. The no-poster branch did not come up in this proof, since both films have posters.
6. Ticks now go on every row except house lines (it.house).
7. Mains heading is now the neutral "Kitchen Specials".
8. Sign is now "949 North Hill Street, Chinatown, Los Angeles". The review's 959 was wrong: The Infatuation lists 949 N Hill St. I left out "Dim sum daily" because I could not confirm it.
9. Winks now print in a "SCENES TO WATCH FOR" card under the poster (up to five, lined up with the foot). The poster shrinks to make room only when the film has winks.
10. The quote panel prints quote marks only when note.kind is "quote", under the heading "OVERHEARD". Anything else prints plain under "FROM THE TROLLEY". Rush Hour now uses the real Carter line (kind quote).
11. Cue is now "Serve the mains when Carter walks into the Foo Chow alone." (Wikipedia plot: Carter goes in alone, Lee arrives and rescues him).
12. A3 is now "Prawn and bamboo shoot dumplings", and B1 no longer carries "Foo Chow". The consul farewell clause is gone.
13. App-level, not changed: the phone "Skip to the wheel" pill covers the menu header card. It needs to stay hidden until focused (index.html or app.js skip link).

Rule 2 (fit): notes are never clamped now. NLMAX is gone and the note div has no line clamp. cw was recalibrated against the render (names e.cwd, notes e.cw*.92), and the margin is 1.04. The fit tries every tier size (the tier's nl does not apply here), each at note-column widths .40 then .34, then with padding cut to 4, and adds two small steps (16/13, 15/12). To give the grid height, foot went from 170 to 150 and the sheet top bar from 74 to 66. Spare row padding is capped at 12. If more than 110px is still empty under the grid, a TMDB still with a caption fills it.
Rule 8 (prices): a tidyPrices() pass runs after priceSense. Dear dishes (lobster, steak, prawn and so on) take the top non-house prices of their course, repeated prices move up to the next price ending, and sweets drop below the cheapest main. This fixed MIB3, which had 0.95 three times in starters and 1.95 twice in mains.

FOR THE LEAD (shared code):
- IMPORTANT: Rush Hour's printed card takes tonight's five dishes from its poster edition in movie-menus.js, which card-ops does not touch. Run `node scripts/edition-sync.cjs` (then build-data). Until then the card shows stale "Carter's hot wings", "Foo Chow noodles", the old wings note and the old D1 note next to the new rows. My ops file includes edition-only ops (the full wings "how" text, "80g sour cream@Dairy", "1 tbsp chives@Produce", the edition cue). I dry-ran the sync in memory for this film and it comes out clean: Five spice chicken wings, Beef chow fun, new notes, new cue.
- priceSense prices the card extras (dumplings, lemon chicken) under the cooked mains. That is fine here, but my tidy pass can lift an extra when a price repeats.
- 13: the skip link (app-level).

Owner decisions: none required. Men in Black 3 film data (not mine, and not changed) still breaks rule 1. Its notes carry jokes ("Wu's special. The fish has opinions.", "Andy Warhol approved", "From Warhol's Factory party, Agent W pouring."), and its trolley line is an invented one signed "Agent J". It now prints plain, without quote marks, but should be signed by a role, or replaced with a real quote.

Final check-print-text (Rush Hour + Men in Black 3): PASS, no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops. (One later tweak after that run: the spare-padding cap went from 9 to 12. The module loads, but that change has not been proofed.)

---

## Hospital layout review: Halloween II (1981)
**Score: 7.5 out of 10**

The idea lands. A meal order card on a clipboard at Haddonfield Memorial is exactly the right venue for this film, the poster sits whole and big on the clipboard, the wristband with Laurie Strode's name is a good touch, the pen ticks read well, and the Save PDF page matches the screen almost pixel for pixel (no grey boxes, no lost text, no black blocks). What pulls it back: the title panel shows "Halloween II" as plain text broken over two lines even though the film has a real TMDB logo, one starter carries a film line where its food description should be, the drink's description is cut short while there is empty room on the form, the header says "Haddonfield Memorial" twice with a stray " . ", the form asks for a 10 a.m. return on a night shift menu, and the film itself barely shows up beyond two character names. None of the iconic scenes or lines are on the card.

## Findings

1. **Real logo dropped, title text breaks badly in the panel.** [layout] Screen and PDF, top right black panel. The film has a TMDB logo in its data (`lib.logo`, 791x109), but `logoImg()` (hospital.js line 42) rejects any logo that would come out under 34px tall. The panel is 210px wide (line 142, `logoOr(ctx,F,210,HH-22,...)`), so any logo wider than about 6:1 is thrown away. The fallback then sets "Halloween II" at 41px in a 210px box, which wraps to "Halloween / II" with the numeral alone on its own line. It looks like a placeholder, not a hospital sign. This will hit every film with a wide logo or a title of about 10 or more characters. Fix: let wide logos through by lowering the minimum height (or making the panel wider, say 300px, since the header has room), and size the text fallback by measured width so a short title stays on one line.

2. **A starter whose note is a film line, not food.** [film] Screen and PDF, Starters, "Devilled ham on toast": the line under it reads "Mrs Alves runs the night shift. Eat fast." That is exactly the fault the house rules ban (and the one the Toy Story review flagged): it tells you nothing about the dish. The prep sheet then says "A house standard, not part of tonight's cook." Fix in data/film/halloween-ii-1981.json, `lib.flavour.house.s.note`: describe the food, for example "Spiced devilled ham spread thick on hot buttered toast, cut in triangles." The unused house drink (`house.d`, "served before Budd's hot tub") has the same problem and should be fixed before it ever shows.

3. **Drink description cut short while the form has room.** [layout] Screen and PDF, Drinks: "Cloudy apple juice mulled with cinnamon, cloves." The data says "...cinnamon, cloves, star anise, ginger and orange" (the phone shows it in full). Cause: `fit()` estimates the note fits on one line, so `course()` clamps it to one line (line 104/108), and then the right column's section gaps are padded out with all the spare height (`cgap:12+Math.min(28,R.spare/...)`, line 163). With the column already stretched to fill, app.js `libUnclip()` cannot give the note a second line, so it drops list items at the commas. The menu ends up with a truncated description and a full stop sitting after "cloves". Fix: reserve room for one extra note line before spreading spare height into gaps, or measure note width with a less optimistic `cw` for this font (E[1] uses .52).

4. **Header repeats the venue and has a stray separator.** [layout] and [film] Screen and PDF, header. Line 1: "Haddonfield Memorial Hospital Cafeteria". Line 2: "HADDONFIELD MEMORIAL, NIGHT SHIFT . MEAL ORDER". The hospital name is printed twice in two lines, and " . " (space, full stop, space) reads like a typo. Line 141 hard codes `" . Meal order"`; use a proper separator such as a middle dot or a slash, or drop it. In the film data, change `lib.flavour.sign` to something that does not repeat the venue, for example "Ward E, Night Shift".

5. **Fixed form text contradicts the film.** [layout] Screen and PDF, top of the form: "Return to the ward kitchen by 10 a.m." is hard coded (line 165). Halloween II takes place over one night, and the nurse's note on the same card says "Night shift eats at midnight". On a night shift order card it reads wrong. Fix: let flavour set this line (for example `fl.returnBy`), and default to something time neutral like "Hand to the duty nurse".

6. **Uneven columns with a large empty patch under Starters.** [layout] Screen and PDF, form left column. Starters ends at "Devilled ham on toast" about 110px (screen pixels) above where the right column ends, leaving a big blank space above the Showtime line, while the right column is stretched and short of room (see 3). On the phone preview, where only the left column shows, the blank is even more obvious. Fix: when the split is lopsided, split the spare height per column instead of padding all sections by the same amount, or allow `fit()` to move the drinks section under Starters when that balances better.

7. **The film's iconic scenes and lines are missing.** [layout] and [film] Whole card. Apart from Mrs Alves, Mr Garrett and the ambulance cue, nothing on the card says Halloween II: no therapy pool, no razor blade apple, no "Samhain", no Loomis line such as "You don't know what death is" or "It's time, Michael", no operating room ending. The data has five good winks (`lib.flavour.winks`, including the candy apple with a nasty surprise and Budd and Karen in the therapy pool) and eight real TMDB stills, and the layout uses neither (`F.winks` and `F.stillSrc` are read in `film()` but never placed). Fix: give the form a small "Ward notes" or "Visitors" strip that prints one or two winks, and use the empty space under Starters (finding 6) or the stamp box for one still pinned to the clipboard. In the data, the candy apple dessert could nod to the razor blade scene in its note without turning the dish into a pun.

8. **Prices on a patient meal order card, and odd ones.** [layout] Screen and PDF, every dish. Hospital patients do not pay per item, so prices on a "Please tick your choices" card break the realism the rest of the layout builds. The numbers are also off: Haddonfield candy apples cost 1.95, the same as the chicken pot pie, and devilled ham on toast costs more than the other starters. Fix: either drop prices on this layout and use a portion or diet code column ("Full / Small", "Soft diet"), or rename the venue to the staff cafeteria and keep prices but cap dessert below the main.

9. **Venue and card type do not agree.** [film] Header says "Hospital Cafeteria" but the card is a patient meal order for Laurie Strode, and "Mr Garrett's meatball subs ... for the front desk" is a staff meal on a patient's tray. Minor, but it is the kind of thing a fan notices. Fix: venue "Haddonfield Memorial Hospital" (kitchen or patient meal service), and reword the subs note so it describes the sub and drops "for the front desk", or keep the cafeteria and drop the patient wristband for staff films.

10. **Nurse's note is invented but presented as the film's voice.** [film] Screen and PDF, Nurse's Note, signed "Mrs Alves". The line is not from the film. It is not in quote marks on the rendered card, so it reads as house copy, which is acceptable, but the layout code wraps the note in quote marks (line 171, `"${esc(n.text)}"`), and the comment calls it "the overheard quote". If a later build shows those marks, this becomes a fake quote. Fix: drop the quote marks in the layout, or put a real line here (Loomis's Samhain speech would fit a nurse's note well enough to be fun).

## What I could not check
I did not run the app, Playwright or the check scripts (as instructed), so the reason the rendered note shows no quote marks despite line 171 is inferred, not traced. I did not check other films on this layout, so the [layout] tags are based on the code paths, not on seeing the faults repeat. Pages 2 and 3 of the PDF (the prep sheet) were not reviewed in detail. Film facts (Mrs Alves as the nurse, Mr Garrett the security guard, Laurie brought in by ambulance, the therapy pool, the razor blade boy, Loomis's lines) were checked against the Halloween fan wiki, not the film itself.

### Fix log



Files changed: menu-formats/hospital.js, audit/ops/halloween-ii-1981-review-25.json. Proofed: Halloween II, Terminator 2: Judgment Day, Shutter Island.

1. Logo / title panel: dropped the dark box completely (rule 4). The top right now shows the logo straight on the form paper when it reads there. The sampler checks each pixel's contrast against the paper, not raw brightness, and if it fails, the title and year show instead. Logos can now come out as short as 22px (was 34px) and the area is 300px wide, so wide logos get through. The title fallback is sized to its length so short titles stay on one line, with the year under it. Halloween II's poster carries the same HALLOWEEN II logo right beside it, so I set flavour.hospital.noLogo for this film. It prints "Halloween II / 1981" in the layout's type. T2's silver logo fails on the paper, so it falls back to text on one line. Shutter Island's red logo reads and shows with no box.
2. Devilled ham note: now "Spiced devilled ham spread thick on hot buttered toast, cut into triangles." The unused house drink is rewritten as food too: "Hot water with honey, fresh lemon juice and a slice of ginger."
3. Clipped notes: fit() and course() now count every line a note needs (up to 4), not the tier's 1 or 2 line cap. The clamp gets one spare line, and smaller tiers that still have notes come before any tier that drops them. I measured the cw/cwd glyph widths off the proofs and set them per font: Libre .47/.5, Plex Condensed .4/.43, Inter Tight .47/.5. The old values were too high and left big blanks. The mulled apple juice note now prints in full.
4. Header: the stray " . " is now a middle dot, and the layout drops a sign line that repeats the venue (Shutter's "Ashecliffe Hospital" now falls back to "Patient meal service"). Halloween II's sign is now "Night shift, October 31".
5. "Return to the ward kitchen by 10 a.m." is gone. It now uses flavour.hospital.returnBy, or "Hand to the duty nurse" by default. I also took the default note's "Lights out at ten" out of the code.
6. Uneven columns: each column puts its own spare height into its own item gaps (cap 10px) and gaps between courses (cap 28px), with 30px held back for estimate error. Nothing goes into the blank after the last course. If more than about 100px is still empty, a real TMDB still goes in with a caption ("Halloween II (1981), film still"). Halloween II's starters column and T2's drinks column both get one now.
7. Film presence: a "Scenes to watch for" slip under the poster prints the film's winks (up to five). The poster shrinks to make room. The still from 6 shows too. The foot box now holds Loomis's real line from the operating room, "It's time, Michael." (checked against the Halloween fan wiki), under "Overheard on the ward". I left the candy apple note as food (rule 1). The razor blade nod stays in the winks.
8. Prices (OWNER DECISION: keep prices on the patient card, fix only the order). The layout's own prices() now does this: dearer dishes (lobster, steak, prime rib, prawns and the like) sit higher in their course, no two dishes in a course share a price, dessert stays under the cheapest main, and list order is untouched so house lines stay at the bottom. The hidden film number is only used when it keeps those rules. Halloween II: starters 0.95 / 1.25 / 1.50, mains 2.00 / 1.75, dessert 0.75, drink 0.50 (was 0.95 / 0.95 / 1.50, 1.95 / 1.95, 1.95, 0.50).
9. Venue is now "Haddonfield Memorial Hospital", and "for the front desk" is gone from the meatball subs note. The wristband no longer falls back to the prop title. A film with no patient gets a blank name line (rule 5).
10. Quote marks only print for a note whose kind is "quote" (real lines). House copy prints plain under "Nurse's note".

## For the lead (shared code / other films' data)
- app.js window.priceSense: its "card extra never prices above tonight's cooked mains" rule can squash a dearer extra (a lobster roll) down level with or under a plain cooked main. It can also land two mains on one price. hospital.js works around this by ranking extras under cooked dishes of the same level and moving duplicates apart after priceSense runs, but the rule itself can still put a dear extra under a plain main. Needs a look in app.js.
- scripts/card-ops.cjs: a "set" op added to an ops file that already has "applied" gets marked done without running (the line `if(P.applied&&!op.done&&op.set!==undefined...)`), even though the header says added ops still run. I worked around it by taking "applied" out of my file.
- Other films on hospital still have film lines as house-line notes: T2 "Sarah asks Enrique for clothes, food and a truck." and "Hasta la vista, baby. Then another."; Shutter Island "Boston Harbor catch, before the storm hits." and "Teddy asks Cawley for soda and ice." Shutter's red logo also repeats the logo on its poster, so it may want flavour.hospital.noLogo. I didn't touch these because they're outside my ops file.
- The phone card view (app.js) was not changed.

## Owner decision
- Finding 8: prices stay on the patient meal order card (owner call). Only the order and duplicates are fixed.

## Final check-print-text
PASS: no dish name or note hidden, and the Save PDF copy has none of the shapes html2canvas drops (Halloween II, Terminator 2, Shutter Island).
