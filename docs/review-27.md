# Review 27: re-grade of the four held layouts (12 Nov 2026, night)

Fresh reviewer each round, no sight of earlier reviews. Rounds r27 (all four), r27b (arcade, dimsum, skilodge), r27c and r27d (arcade).

---

<!-- r27 -->
## arcade layout review: Snatch (2000)

**Score: 8.6 out of 10**

A good-looking, fan-friendly card that mostly holds up. The venue is right (Turkish runs a slot machine arcade and promotes unlicensed fights with Tommy as his partner), the bet slip is spot on (Mickey was told to go down in the fourth and bet on himself), the winks all check out, the ringside still of Mickey fills the short column well, and prices follow every rule. What keeps it under 9 is the one line credited to a character: the Turkish line under the poster is a loose paraphrase of his closing narration with an invented ending ("Still squeaking.") and the shoe stripped of its joke. On a card a fan will read out loud, that is the line most likely to get picked apart. The rest are small polish items.

## Findings

1. **Turkish's line under the poster is not what he says.** Screen and PDF, page 1, bezel under the poster. [film] Rule 9. Cause: data/film-flavour.json, "Snatch (2000)".note.text. The real closing narration (Wikiquote) is "Tommy persuaded me to keep the dog; I eventually agreed, as long as he took it to a vet. The vet found a squeaky toy, an undigested shoe, and an eighty-six carat diamond lodged in the dog's stomach." The card says "Tommy kept the dog" (in the film Turkish agrees to keep it) and adds "Still squeaking.", which is made up and makes no sense once the vet has taken the toy out. Fix, use the real line (at 15 to 17px it fits the bezel, which already sizes down for it): "The vet found a squeaky toy, an undigested shoe, and an eighty-six carat diamond lodged in the dog's stomach." Keep by: "Turkish".

2. **The sign advertises fixed fights as "fair fights".** Screen and PDF, page 1, under the venue name. [film] Rule 10, minor. Cause: data/film-flavour.json, "Snatch (2000)".sign. The joke only works if you know the fights are bent, and a real slot arcade would never print illegal fights on its sign. Fix: "Fruit machines, slots and change" or, to keep a wink that is still a real arcade line, "Fruit machines. Pay out daily".

3. **Pie and mash sits in starters at 170 TIX, close to a main.** Screen and PDF, page 1, Quick Plays. [film] Minor. Cause: data/films.json, Snatch S[0]. In London pie and mash is the main event, and here it costs nearly as much as the fry-up (190). The note does describe smaller pies, so it is defensible. Fix if you want it tidier: rename to "Mini pie, mash and liquor" so the course makes sense to guests.

4. **The fry-up recipe has no amounts on the phone menu.** Phone, Mains. [layout] Cause: data/films.json, Snatch M[0] method ("Bacon, sausages, fried eggs, ...") with no quantities, under "Every recipe serves 4". It is a card extra that is not cooked tonight, but unlike the house lines it is not marked that way. Fix: give it the same tag as the house lines, "A card extra, not part of tonight's cook.", or add amounts: "8 rashers bacon, 8 pork sausages, 4 eggs, 1 tin baked beans, 4 slices black pudding, 200g mushrooms, 2 tomatoes, 8 slices toast."

5. **Phone and card list starters in a different order.** Phone, Starters. [layout] Minor. Cause: the phone menu uses data order (Diamond cut cheese, Caravan site sausages, Pie and mash, Jellied eels) while the card sorts by price (Pie and mash first). Fix: put the phone list in the card's price order so a guest moving between the two finds the same thing.

6. **Prep sheet time chip is hard to read.** PDF page 2, header chips. [layout] Minor. "LONGEST ON THE NIGHT 2 HR 45 MIN" plus "PLUS 2 HR 20 MIN WAITING" reads like two different totals, and the banoffee pie, the longest job, is marked "Make the day before", so it is not on the night at all. Fix: leave make-ahead jobs out of the on-the-night figure, print one total (for example "LONGEST ON THE NIGHT 1 HR 10 MIN", worked out from the steak and potatoes), and add a chip "MAKE AHEAD: BANOFFEE PIE".

Checked and fine: venue (Turkish's slot arcade, Tommy his partner), bet slip lines, Showtime cue (Mickey knocks out Gorgeous George with one punch at the camp), winks (86 carat diamond is the film's figure, Franky Four Fingers, Brick Top's pigs, Bullet Tooth Tony, the dog and the squeaky toy), header in type beside the logo poster, BET SLIP label, WATCH FOR box, prices (dearest first, house lines at the foot, no repeats, dessert 110 under the cheapest main 190), no gap over 100px, every note printed in full at one size. "Builder's tea, three sugars" reads as a nice flip on Brick Top's "I'm sweet enough".

## What I could not check

I could not open Wikipedia directly (fetch blocked), so I worked from a Wikipedia mirror summary, TV Tropes and Wikiquote. Wikipedia's summary gives the diamond as 84 carats, but Turkish's narration on Wikiquote says eighty-six, so I accepted 86. I could not confirm the arcade's on-screen name, so "Turkish and Tommy's Arcade" is taken as a fair house name, not a sign seen in the film. I did not check the Now Playing still frame by frame beyond seeing it is Mickey ringside.

---

<!-- r27 -->
## dimsum layout review: Men in Black 3 (2012)
**Score: 8.2 out of 10**
The card looks good and the layout holds every locked rule I could test: the header prints the title and year in type beside the MIB3 logo poster, notes print in full at one size, prices run dearest first with house lines at the foot and dessert under the cheapest main, the ticket prop sits under a "Ticket" label, and there is no dead space. Where it falls short is the film side. The overheard quote has an extra sentence I can't find in any source, the sign line can't be confirmed, and the menu reads like two venues stapled together: a Chinatown restaurant that also sells Coney Island hot dogs, cheeseburgers with crinkle fries and diner pie. French champagne priced as the cheapest thing on the card also doesn't make sense. Fix the quote and the house drink and it's close to 9.

## Findings
1. **The quote doesn't match the film's wording.** Screen, kit Intermission card. [film] The card prints "Earth people get Earth fish. Real Earth fish." credited to Agent J. The sources I could reach give J's line to Wu as "Wu, we had a deal. Earth people get Earth fish!" (TV Tropes quotes page). I found no source for "Real Earth fish". Cause: data/film-flavour.json line 13784, key "Men in Black 3 (2012)", note.text. Fix: `"Wu, we had a deal. Earth people get Earth fish!"`, still by Agent J. That breaks rule 9 as printed.

2. **The house drink price doesn't make sense.** Screen, Drinks: "Champagne in a coupe" is priced 5, under the espresso martini (6), the hot dogs (7) and the crab rangoon (6), so French champagne is the cheapest line on the card. [film] The layout behaves correctly here: house lines go to the foot and price under the dish above (menu-formats/dimsum.js lines 85 to 90). The data is the problem. Cause: data/film-house.json line 4691, d. Fix: swap it for a drink a Chinatown kitchen would sell cheaply, e.g. n `"Jasmine tea by the pot"`, note `"Hot jasmine green tea, poured at the table for the whole party"`, alc false. Or keep a beer: `"Tsingtao lager"`, `"Cold Chinese pale lager served straight from the bottle"`.

3. **The menu mixes two venues.** Screen. [film] The venue is Wu's Chinese restaurant, but the card also lists Coney Island hot dogs, Launch day cheeseburgers with crinkle fries and Diner apple pie. The hot dogs and the pie point at real scenes (Coney Island on July 15, 1969 and the diner pie stop), but a guest reading a Wu's order sheet gets a burger joint and a diner as well. Rule 10 is only half met. "Launch day cheeseburgers" points at nothing in the film. Cause: data/films.json, Men in Black 3 entry, S[0] and M[0]. Fix: keep the pie, since the Showtime cue hangs on it. Replace the burger with a Wu's main, e.g. `"Wu's salt and pepper squid"`, note `"Squid tossed in cornflour and fried crisp with chilli, garlic and spring onion"`. Replace the hot dogs with `"Prawn crackers"`, note `"Puffed prawn crackers straight from the wok, still crackling hot"`.

4. **The sign line can't be confirmed.** Screen header and kit door card: "Shrimp and bok choy. Earth fish only, very traditional." [film] I found no source with "shrimp and bok choy" or "very traditional" in the Wu's scene. If it isn't dialogue it reads as a made-up quote. Cause: data/film-flavour.json line 13784, sign. Fix, built only from checkable facts: `"Chinatown. Earth fish for Earth people, every night."` The venue name is fine. Sources call it "Wu's" (Scouting NY), and the official tie-in viral site used "Wu's Diamond Garden Chinese Restaurant". That fuller name would make a sharper sign if the owner wants it.

5. **A main-sized dish sits in Small Plates.** Screen. [film] "Agent K's shrimp and bok choy" is in Small Plates at 9, but the recipe is 500g prawns over 300g rice for four, a full main, and the Prep sheet tags it SNACK. Cause: data/films.json S[2] and data/recipes2/men-in-black-3-2012.json course "s". Fix: move it to M, and with finding 3 move the dumplings and a new starter into Small Plates. Or cut the recipe to 250g prawns with no rice.

6. **"Lunar Max" is spelt wrong.** Screen, Scenes to watch for. [film] The prison in the film is "LunarMax", one word. Cause: data/film-flavour.json line 13784, winks[0]. Fix: `"Boris the Animal breaking out of LunarMax"`.

7. **The phone menu doesn't match the card.** Phone text. [layout] The tagline is "1969. Same suit. Better pie." while the card sign says something else. The course labels are Starters/Mains/Sweets while the card says Small Plates/Kitchen Specials/Sweet. The starters run dumplings then shrimp, the opposite of the card's price order. The burger recipe prints its summary line and then the same method again under "As written, serves 4", and the hot dogs have no quantities. Cause: the phone renderer reads films.json T and the raw S/M order, not the card's settled order. Fix: print the card's course names and row order on the phone. Drop the duplicate summary on the burger (films.json M[0] third field, cut the first sentence), and give the hot dogs a quantity line: `"8 franks, 8 soft buns, mustard and 1 jar sauerkraut, grilled and wrapped."`

8. **Minor: the stamp isn't from the film.** Screen. [layout] "TROLLEY CHECKED" is a fixed dim sum stamp and Wu's is never shown as a yum cha trolley house. It's neutral enough to pass rule 6, but on a film venue that isn't a tea house it reads a bit off. Cause: menu-formats/dimsum.js line 237. Fix: make it `"KITCHEN CHECKED"` when the venue name doesn't contain "Tea House" or "Yum Cha".

Checked and fine: July 15, 1969 is the date J jumps to. The Chrysler Building jump, Griffin's futures, Apollo 11, young K arresting J at Coney Island and the diner pie stop (Relish Diner, Williamsburg) are all real. The Prep sheet ticks match the five cooked dishes, shopping quantities add up (650g prawns = 150 + 500), and "TABLE 69" is the owner's call.

## What I could not check
- Wikiquote, Wikipedia and IMDb quote pages were blocked or stripped in this session. The quote and sign checks rest on TV Tropes, Movie Locations, Scouting NY and the movieviral tie-in write-up. The film itself, or a subtitle file, would settle whether "Real Earth fish" or "shrimp and bok choy" are spoken.
- The restaurant's on-screen sign text.
- Whether the poster image is the official TMDB one for this film (it looks right).

---

<!-- r27 -->
## foodcourt layout review: Jurassic World (2015)
**Score: 9.0 out of 10**

A clean, good-looking card that reads like a park eatery board and would sit fine in front of paying guests. Every layout rule holds: notes are food, all print in full at one size, no column gaps, the poster carries the logo so the title and year print in type in the ticket strip, the prop sits under a "Ticket" label with its lines, four winks sit in a labelled box, and the prices step down properly with house lines at the foot and the mousse ($5) under the cheapest main ($12). The film checks out: the Claire quote is real and correctly credited, Hoskins' seven bucks a soda, Lowery's $150 eBay shirt, the Fallon gyrosphere video, the aviary escape and Claire freeing the T. rex are all on screen, and ferry then monorail is how guests arrive. Main Street is the park's real promenade, and the Frozen margarita is a quiet nod to Margaritaville. It holds back from higher because one main is named for a character with no food link, the venue is a made-up generic food court rather than a named outlet, and the phone menu does not match the card's course label and order.

## Findings
1. **Main named for Owen with no film link** (screen, PDF, phone) [film]. "Owen's smoky beef short ribs": Owen never eats or cooks anything like this in the film, so a fan can't check the nod. Cause: dish name in data/recipes2/jurassic-world-2015.json line 273, plus the matching entries in data/films.json and data/dish-names.json for "Jurassic World (2015)". Fix: rename to "Winston's smoky beef short ribs" (Winston's Steakhouse is one of the named Main Street restaurants in the park), or "Paddock smoky beef short ribs" if you want something seen plainly on screen.

2. **Venue is a generic food court, not a named park outlet** (screen, PDF, kit) [film]. "Main Street Food Court" is believable since Main Street holds about 20 restaurants, but nothing called a food court is named in the film. Not a break, just softer than the card could be. Cause: data/film-flavour.json "Jurassic World (2015)".venue (line 15206) and .here. Fix: keep it if the food court frame is locked; otherwise, a lighter tweak is sign "Isla Nublar, open daily" changed to "Main Street, Isla Nublar, 20,000 guests a day" to tie it to the film's park numbers. Only make that change if you can confirm the guest figure on screen.

3. **Phone menu says "Starters" and swaps the order** (phone) [layout]. The card heads the first course "Snacks" with pretzels ($8) above cheese balls ($7). The phone heads it "Starters" and lists cheese balls before pretzels. A guest flicking between the two sees two different menus. Cause: app.js line 1013 LIB_COURSE hard-codes "Starters", and the phone list follows recipe file order, not the card's price order. Fix: have the phone take the course labels from the layout's cols for this card ("Snacks", "Mains", "Sweets", "Drinks") and sort each course the same way the card does.

4. **Prep sheet page 3 carries a single dish** (PDF page 3) [layout]. The frozen lemonade runs onto its own page, leaving about 80 percent of the page blank above the Showtime cue. This is the prep sheet, not the card, so it is minor. Fix: tighten the page 2 spacing a touch, or let the shopping list column take the overflow, so the five dishes fit on one page.

5. **Shopping list rounds cabbage up** (PDF page 2) [film/data]. The list says "1 cabbage" but the only cooked dish using it (short ribs slaw) needs 1/2 cabbage. Fix: list "1/2 cabbage".

## What I could not check
- Whether the Winston's Steakhouse sign is actually readable on screen in the 2015 film. I confirmed it only from a fan wiki (Jurassic-pedia), and Wikiquote does not mention it.
- The exact timing of the mosasaur feeding show for the Showtime cue. From memory it comes early in the first act, which fits "serve the snacks", but I did not time it against a cut.
- The table card kit (place cards and tickets) was only looked at, not graded line by line.

---

<!-- r27 -->
## skilodge layout review: Better Off Dead (1985)
**Score: 8.6 out of 10**
A clean, good-looking card that a fan will enjoy. The trail marker headings suit a film about the K-12, the type title sits beside a poster that carries the logo, every note prints in full at one size, the prices step down properly and the dessert sits under the cheapest main. The quote, the five winks, the Pig Burgers dish and the Showtime cue all check out against Wikipedia and TV Tropes. It falls short of 9 on film truth in the small print: the bill carries an invented line, and the menu skips the film's one famous food gag (Mom's French dinner) while two dishes carry names with no tie to the film. Fix those and this is a 9.

## Findings
1. **Bill prop line is made up.** Screen and PDF, bill under the poster. [film] "Four weeks, twenty papers" is not in the film, so a fan can't check it. Johnny only ever says the Meyers owe him two dollars. Cause: data/film-flavour.json, "Better Off Dead (1985)".prop.lines[0]. Fix: replace with a checkable line, "Lane Meyer, Greendale" (Greendale, California is the film's town per Wikipedia). Keep "Amount due: two dollars".

2. **Misses the film's real food joke.** Screen, PDF and phone. [film] Lane's mum puts on a "French" dinner for Monique: French fries, French dressing, French bread, and Perrier. That's the best-known food line in the film, and it's not on the card. "Paperboy's paper cone fries" doesn't connect to anything, because Johnny never goes near fries. Cause: data/films.json, Better Off Dead, S[0][0]. Fix: rename to "Mom's French dinner fries" and keep the note as it is. Optional: change the Showtime-free tagline T to "Two dollars. French fries. Grab a burger." if you want the gag on the phone too.

3. **The house starter has no film tie.** Screen, PDF, phone, Green Runs foot. [film] "Meatballs in grape jelly sauce" doesn't come from the film. The mum dinner gag that does exist is "It's got raisins in it. You like raisins." Cause: data/film-house.json, "Better Off Dead (1985)".s. Fix: n "Mom's meatballs, raisins and all", note "Beef meatballs and raisins simmered in a sticky grape jelly and chilli sauce".

4. **Guests can't tell which course is which.** Screen and PDF, right column. [layout] "Black Runs" and "Double Black" don't tell a guest that one is dessert and the other is drinks, and putting lemonade and hot chocolate on the double black run reads oddly. Cause: menu-formats/skilodge.js line 217, the section names array. Fix: add a small grey course word under each marker heading (Starters, Mains, Sweets, Drinks) at about 11px, or rename "Double Black" to "Lodge Bar". The ski grades can stay.

5. **The venue is plausible but not named in the film.** Screen and PDF header. [film] The K-12 is the town's highest peak and the race course, and the film shows a ski shop and a chairlift, but no "K-12 Ski Lodge" by name. It fits the world, so this is a small point. Cause: data/film-flavour.json venue. Fix: if you'd rather it be strictly true, use "K-12 Ski Shop & Grill". Otherwise leave it.

6. **Mum's main is generic.** Screen and PDF, Blue Runs. [film] "Mom's chicken and mushroom rice bake" leans on the "creepy (and creeping)" dinners, but only the recipe text says "Nothing moves", and that text isn't on the card. Cause: data/films.json, Better Off Dead, M[1]. Fix: keep the note and rename to "Mom's rice bake (it stays put)" so the joke reads on the card.

No layout rule breaks found apart from item 4. No column gap over 100px: the left column ends about 50px above the Showtime rule, and the TMDB still fills the right. There's no logo on a box, the prop sits under the kind label "BILL", the winks are in the labelled Snow Report box, and there are no repeated prices in any course.

## What I could not check
- Whether the right column still (Lane with a saxophone on the Camaro in a stadium) is a frame from the film or a publicity shot. The caption says "From the film".
- Wikiquote was blocked, so I confirmed "I want my two dollars!" and the French dinner and raisins lines through TV Tropes and Wikipedia only. TV Tropes credits the French dinner to Jenny Meyer (Lane's mum). Check that against the film before using item 2.
- The fondue, fries and croques nods (ski lodge food and Monique being French) are flavour, not film scenes, and I didn't mark them down.

---

<!-- r27b -->
## arcade layout review: Snatch (2000)
**Score: 8.7 out of 10**
A good-looking, readable card that a Snatch fan will get. Every note prints in full, prices follow the rules, the header prints title and year in type beside the logo poster, and the big checkable lines are right: the vet quote is real and is Turkish's narration (Wikiquote), the Showtime cue (Mickey knocking out Gorgeous George at the campsite) happens on screen, and Turkish really does run a slot machine shop (Wikipedia plot). What keeps it under 9 is fan value rather than breakage: two of the five winks repeat what the quote already says, the arcade chrome reads as a kids' ticket arcade not a London fruit machine shop, and a few dish names miss real hooks the film hands you (Sausage Charlie, Errol's cup of tea).

## Findings
1. **Winks repeat the quote.** [film] Screen/PDF, WATCH FOR box. "The 86 carat diamond" and "The dog that swallowed the squeaky toy" are both already in the High Scores quote two inches away ("a squeaky toy ... an eighty-six carat diamond"), so 40% of the winks are spent twice. Cause: data/film-flavour.json "Snatch (2000)".winks[0] and [4]. Fix: replace with checkable lines not on the card: "Do you like dags?" (Mickey to Tommy, Wikiquote has Tommy's reply "Oh, dogs. Sure, I like dags") and "Boris the Blade" (Wikipedia plot). New list: "Do you like dags?", "Franky Four Fingers", "Brick Top and his pigs", "Bullet Tooth Tony", "Boris the Blade".
2. **Prize counter chrome does not fit Turkish's shop.** [layout] Screen/PDF, right board and price tags. The sign says "Fruit machines. Pay out daily" but the board says "PRIZE COUNTER / REDEEM TICKETS HERE" and every price is in "TIX". Fruit machines pay cash, not redemption tickets, so the card argues with its own sign. Cause: data/film-flavour.json "Snatch (2000)" has no "arcade" counter/redeem keys, so menu-formats/arcade.js line 227 falls back to the defaults; the "TIX" unit is hardwired at arcade.js line 205 with no per-film override. Fix: add to the Snatch flavour `"arcade":{"scores":["MIK","TUR","TOM"],"counter":"PAYOUT BOARD","redeem":"CASH AT THE COUNTER"}`. If the price unit can take a per-film value later, use "QUID" or plain "£" for this film; until then leave TIX.
3. **Weak dish nods where the film has real ones.** [film] Screen/PDF/phone. "Caravan site sausages" is fine, but the film gives you better: Turkish at the shop asks "What's happening with them sausages, Charlie?" and Sausage Charlie answers "Five minutes, Turkish" (Wikiquote). Brick Top's "Get us a cup of tea, will you, Errol?" is a real line that fits the house tea. "Turkish's full English" and "Bullet Tooth Tony's banoffee pie" are not tied to anything checkable. Cause: data/films.json Snatch S[2] name, data/film-house.json "Snatch (2000)".d. Fix: rename "Caravan site sausages" to "Sausage Charlie's chipolatas" (same note), and the house drink "Builder's tea, three sugars" to "Errol's cup of tea, three sugars" (same note). Optional: "Turkish's full English fry-up" to "Sausage Charlie's full English" clashes with the starter, so leave it.
4. **Carat count disagrees with Wikipedia.** [film] Screen/PDF, wink and quote. The card says 86 carats, which matches the film's dialogue as given on Wikiquote, but the Wikipedia plot section currently says 84 carats. A fan checking against Wikipedia will see a mismatch. No change to the quote (it is verbatim). If finding 1 is applied the wink goes and only the quote carries 86, which is the safe place for it.
5. **High score table means nothing.** [layout] Screen/PDF. MIK 0174094, TUR 0137644, TOM 0087434 are numbers built from the "86" seed plus a fixed offset; there is no high score in the film and a fruit machine has none. Harmless, but it is the one panel with no fan payoff. Cause: arcade.js line 255 with data/film-flavour.json "Snatch (2000)".number "86". Fix: nothing needed for 9.0; if the layout ever supports a still in that box (A.still), a frame of the bare-knuckle fight would earn the space better.

Checked and fine: no film lines in dish notes (rule 1); all notes print in full at one size (rule 2); no column gap over about 100px, the Prize Counter left column is filled by the TMDB "Now playing" still (rule 3); no logo on a box, poster carries the logo and the marquee prints "SNATCH, 2000" (rule 4); prop prints as BET SLIP with its two lines (rule 5); fixed headings are neutral arcade terms (rule 6); five winks in a labelled WATCH FOR box (rule 7); prices 170/140/110/100 with jellied eels house line at the foot, mains 220/190, dessert 110 under the 190 main, drinks 140 then house tea 80, no repeats (rule 8); quote real and credited to Turkish (rule 9); venue matches "slot machine shop owner Turkish" with partner Tommy (rule 10). Prep sheet lists all dishes and cooks five, per owner's call. Phone text matches the card.

## What I could not check
- "Fixed: down in 4th" on the bet slip. Wikipedia confirms Brick Top demands Mickey throw the fight and that Mickey secretly bet on himself ("Bet: Mickey to win" is right), but I could not find a source quoting the fourth round. I believe Brick Top's line names the fourth, but did not confirm it from a transcript.
- That the shop is ever called an "arcade" on screen; Wikipedia only says slot machine shop. The name is a fair invention, not a quote.
- Print colour and legibility of the small Oswald notes on the dark panel on real paper; judged from the 935px PNG only.

---

<!-- r27b -->
## dimsum layout review: Men in Black 3 (2012)
**Score: 9.1 out of 10**
This is a strong card and close to ready for paying guests. The tick sheet reads like a real Chinatown order pad, the poster carries the MIB3 logo so the header correctly prints title and year in type, and every column fills with no gaps. The prices follow the rules: dearer dishes on top, house lines at the foot, no repeats, and dessert well under the cheapest main. The film checks out well. The Wu quote is real and credited to the right character, "Wu's real Earth fish" and "Agent K's shrimp and bok choy" are both lifted from lines in the Wu scene, the ticket date of July 15, 1969 matches the film, all five winks happen on screen, and the Showtime cue matches the diner pie scene. What holds it back from a higher score is small stuff. The header sign repeats the quote printed in the Overheard box, so "Earth fish" turns up three times on one card. The venue uses a generic name when the studio's own name for it is available. Prawn crackers are priced oddly high. And "Mr Wu" is punctuated two different ways.

## Findings
1. **The sign repeats the Overheard quote.** On screen, PDF and the kit, the sign under the venue reads "Chinatown. Earth fish, very traditional." The Overheard box then prints "That is an Earth fish. Very traditional in China." and the special is "Wu's real Earth fish". The same joke appears three times on one card, and the sign spends the quote before the guest gets to it. [film] Cause: data/film-flavour.json, "Men in Black 3 (2012)".sign. Fix: "Chinatown, New York. Live seafood, fresh from the tank."
2. **The venue name is generic when the film's own name is available.** The header prints "Wu's Chinese Restaurant". Sony's 2012 viral site for the film named the place "Wu's Diamond Garden Chinese Restaurant", with Keone Young as Mr. Wu. Location sources just call it "Wu's" (it was a set at Kaufman Astoria Studios). The fuller name is checkable and more fun for a fan. [film] Cause: data/film-flavour.json, "Men in Black 3 (2012)".venue. Fix: "Wu's Diamond Garden" (if that is too long for the header at the current size, keep "Wu's Chinese Restaurant" and use the sign line from finding 1).
3. **Prawn crackers are priced too high.** They are $7, $1 under the dumplings and $1 over the crab rangoon. On a real Chinatown menu, crackers are the cheapest thing on the card, so the order sheet loses some believability. [layout] Cause: menu-formats/dimsum.js prices()/tidyPrices() lines 64 to 95, via the shared priceSense pass. The crackers take the third slot because they are a card extra, not a cheap line. Fix: let a dish marked as a cheap snack price under the house line, or flag Prawn crackers as cheap in data/films.json so they price at about $4 and print last, above the rangoon.
4. **"Mr Wu" is punctuated two ways.** The dish reads "Mr Wu's pork and prawn dumplings" and the Overheard credit reads "Mr. Wu". On screen, PDF and kit, the same man gets two spellings on one card. [film] Cause: data/film-flavour.json, "Men in Black 3 (2012)".note.by. Fix: "Mr Wu", to match the dish names and the Australian style used across the card.
5. **The dish name says shrimp and the note says prawns.** The dish is "Agent K's shrimp and bok choy" but its note reads "Green prawns and baby bok choy". The name is a real line from the film ("Shrimp and bok choy."), so keep it, but the mix reads like a mistake. [film] Cause: data/films.json, Men in Black 3, S[1] note. Fix the note to: "Green shrimp and baby bok choy wok-tossed with garlic, ginger and oyster sauce".

No breaks found against the locked layout rules 1, 2, 4, 5, 6, 7, 8 or 9. The notes all describe food and print in full at one size. The header prints in type beside the logo poster. The ticket prints under a "TICKET" label with its lines. The headings are neutral. The five winks sit in a labelled box. Rule 3 holds too, since every column fills.

## What I could not check
- Who says "Shrimp and bok choy." in the Wu scene. The script line exists, but I could not confirm the speaker is K, so the "Agent K's" credit on the dish is unconfirmed.
- What kind of pie the diner serves. One fan recipe post links apple pie with cheddar to the film, but no script or plot source names the flavour, so "Diner apple pie" is plausible but unconfirmed.
- Whether the sign in the film reads "Wu's Diamond Garden". That name comes from Sony's 2012 promo site, not a frame grab.
- Wikiquote and Wikipedia were blocked. I checked the quote against the clip.cafe clip transcript (Mr. Wu, at 00:12:34) and the script text on scripts.com. LunarMax ("Lunar-Max") and July 15, 1969 also come from that script page.
- I only looked at the phone text menu as text, not as rendered on a phone.

---

<!-- r27b -->
## skilodge layout review: Better Off Dead (1985)
**Score: 9.1 out of 10**
A strong card that a fan would enjoy. The ski run headings (Green Runs, Blue Runs, Black Runs, Double Black) suit a lodge on the K-12, every note describes food and prints in full, prices follow the rules, the header prints the title in type because the poster carries the logo, and the quote, winks and bill all check out against Wikipedia and TV Tropes ("I want my two dollars!" is Johnny the paperboy's line, one Ree brother talks like Howard Cosell, Charles snorts snow, Monique fakes having no English, Lane beats Ricky in a ski pole swordfight, Lane is fired from Pig Burgers in front of Roy and Beth). What holds it back from higher: the venue is a fair guess, not a place we see in the film, one price reads wrong, one wink is clumsy, and the phone menu lists starters in a different order to the card.

## Findings
1. **Venue not shown in the film** [film]. Screen/PDF header and kit sign say "K-12 Ski Lodge". The K-12 is real (the town's highest peak and the race course), and Charles calls Greendale "a rest-stop on the way to a ski resort", but no source I could reach shows a lodge on screen. Plausible, not checkable. Cause: data/film-flavour.json line 10314, "venue". Fix: keep it if the owner accepts a plausible venue; the safer, checkable option is a place we do see, for example "venue": "Pig Burgers" with sign "Greendale's home of the pig hat". The ski run headings would then need to change too, so I would leave the lodge and accept the small risk.
2. **Croque priced under the fries** [layout]. Screen/PDF Green Runs: "Monique's mini croques-monsieur 1.50" sits under "Mom's French dinner fries 1.95". Ham, gruyère and béchamel toasties costing less than a cone of fries does not make sense to a guest. Cause: menu-formats/skilodge.js line 61 to 92 (prices then tidyPrices) ranks by the films.json order, not by what the dish is. Fix: swap the two so the croque reads 1.95 and the fries 1.50 (card order becomes fondue, croques, fries, French bread), or move the croque ahead of the fries in data/films.json "S" for Better Off Dead.
3. **Clumsy wink wording** [film]. Screen/PDF Snow Report, line 4: "Monique faking she speaks no English" reads awkwardly. Cause: data/film-flavour.json line 10325. Fix: "Monique pretending she has no English".
4. **Phone menu order does not match the card** [layout]. Phone text lists starters as fries, fondue, croques, French bread; the card prints fondue, fries, croques, French bread. A guest flipping between phone and card sees two different menus. Cause: the phone build uses the raw data/films.json "S" order while the card sorts by price. Fix: sort the phone list with the same price order the card uses, or reorder "S" in data/films.json to fondue, croques, fries so both agree.
5. **"Mom's strange dinners" undersells the gag** [film, minor]. True to the film, but the famous bit is the dinner that crawls off the plate. Cause: data/film-flavour.json line 10326. Fix: "Mom's dinner that crawls away".
6. **Overheard box is light** [layout, minor]. The quote box has a lot of empty card around one short line. Not a rule break (no column gap over 100px), just looks thin next to the busy Snow Report. No change needed unless a second short line is wanted, for example the credit "Johnny the paperboy, chasing the Meyers".

Checked and fine: rule 1 (all notes are food), rule 2 (nothing clipped, one size), rule 3 (left column ends about 45px above the Showtime rule, right column filled by the TMDB still), rule 4 (title and year in type, no logo on a box), rule 5 (prop under a BILL label with its lines), rule 6 (headings from the ski world), rule 7 (five winks in the labelled Snow Report box), rule 8 (fondue 2.50 tops starters, French bread house line at the foot at 0.95, mains 3.50 then 2.95, crêpes 1.25 under the cheapest main, hot chocolate house line at the foot of drinks, no repeats), rule 9 (quote real and correctly credited). The French bread and French dressing house line and "Mom's French dinner fries" nod to Jenny's "Frahnch" dinner for Monique, which is real. The Showtime cue matches the Pig Burgers firing scene. Prep sheet (pages 2 and 3) is clean and readable.

## What I could not check
Wikipedia and Wikiquote were not reachable directly, so I used the Wikipedia article through search plus TV Tropes. I could not confirm a ski lodge appears on screen, the exact moment Roy and Beth arrive at Pig Burgers (the cue assumes they walk in rather than are already seated), or which scene the Camaro still and the kit's "Tonight" polaroid come from. I did not watch the film.

---

<!-- r27c -->
## arcade layout review: Snatch (2000)
**Score: 8.8 out of 10**
A strong card. The venue is real to the film (Turkish runs a slot machine arcade, Tommy is his partner), the header prints SNATCH, 2000 in type because the poster carries the logo, every note prints in full at one size, prices step down properly in every course with house lines at the foot, and the bet slip, high scores and winks all land for a fan. Sausage Charlie is a genuine character ("What's happening with them sausages, Charlie?"), which is the best nod on the card. It falls just short of 9 on two film lines that don't hold up to checking (the three sugars and the "dags" wording) and one small chrome clash between credits and cash. Fix those three and it clears 9.

## Findings
1. **Errol's tea "three sugars" isn't from the film and runs against it.** Screen/PDF (Refills, foot) and phone. [film] The only sugar beat in Snatch is Turkish asking "You take sugar?" and Brick Top answering "No, thank you, Turkish; I'm sweet enough." Nobody asks for three sugars. Cause: data/film-house.json line 6464 to 6465 (Snatch house drink). Fix: name "Brick Top's tea, no sugar", note "Strong tea brewed in the pot with milk, no sugar at all". Same length, and it's a line fans know.
2. **Wink "Do you like dags?" isn't how the line goes.** Screen/PDF (Watch For box). [film] Wikiquote has Mickey saying "D'ya like dags?" and "Ya like dags?". Swapping the dialect "dags" into standard "Do you" reads like a misquote. Cause: data/film-flavour.json line 11267. Fix: "D'ya like dags?"
3. **Credits and cash don't match.** Screen/PDF (Payout Board header). [layout] Prices are in CR (credits) but the right-hand tag says CASH AT THE COUNTER. Fruit machines pay cash, so pick one. Cause: data/film-flavour.json lines 11289 to 11290 ("redeem", "unit"). Fix: keep CR and change redeem to "CREDITS AT THE COUNTER", or set unit to "£" style "QUID" and keep the cash line. I'd keep CR and change the redeem wording.
4. **Full English priced barely above a starter.** Screen/PDF. [layout] Turkish's full English (bacon, sausage, eggs, black pudding, beans, tomato, toast) is 190 CR, only 20 above a mini pie starter at 170. Order within courses is right, but the gap looks odd to a paying guest. Fix in the price data: mini pie to 150 so starters run 150, 140, 110, 100, or lift the fry-up to 200 (still under the steak at 220, dessert 110 stays under it).
5. **Prep sheet timing pills read oddly.** PDF page 2. [layout] "LONGEST ON THE NIGHT 2 HR 45 MIN" then a second row "PLUS 2 HR 20 MIN WAITING", while the banoffee (the long chill) is marked "Make the day before". A host can't tell whether 2 hr 45 already includes the chill. Minor, owner may already accept this format. Fix: drop the day-before dish's chill from the on-the-night figure, or label it "2 HR 45 MIN ON THE NIGHT, CHILLING DONE THE DAY BEFORE".

Checked and fine: Showtime cue (Mickey does knock Gorgeous George out with one punch at the Travellers' camp); bet slip lines (Brick Top's plan was for Mickey to go down in the fourth, and Mickey secretly bet on himself); quote is verbatim on Wikiquote and is Turkish's narration, so the credit is right; Franky Four Fingers, Brick Top and his pigs, Bullet Tooth Tony, Boris the Blade are all real; Avi is the New York diamond dealer; no column gap over about 100px (left column filled by the TMDB still); no repeated prices in a course; dessert 110 under cheapest main 190; notes all describe food.

## What I could not check
- Wikiquote itself was blocked; I used the Wikiwand mirror of the Wikiquote page and of the Wikipedia article.
- Whether Sausage Charlie cooks inside Turkish's arcade (I believe the scene is in Turkish's shop, which would make him a perfect fit, but I could not confirm the location).
- The vet quote is unlabelled on Wikiquote; I credit it to Turkish because he narrates the film in first person ("Tommy persuaded me to keep the dog"), not from a labelled source.
- "Pay out daily" on the sign is house flavour, not a film line. Harmless for a fruit machine arcade.

---

<!-- r27d -->
## arcade layout review: Snatch (2000)
**Score: 9.0 out of 10**
A strong card. Turkish and Tommy's slot machine business as a neon fruit machine arcade is a fair and fun read of the film's world, the "Now playing" still is the Mickey fight, and the East End food (pie, mash and liquor, jellied eels, Sausage Charlie's sausages, Brick Top's tea with no sugar) is full of real nods a fan will catch. Every note is food, prints in full at one size, prices run in order, house lines sit at the foot, and dessert (110) sits under the cheapest main (190). The quote is real and correctly given to Turkish's closing narration, the header prints the venue with "SNATCH, 2000" in type because the poster carries the logo, and no box has a dead gap. What keeps it at 9 rather than higher: the dessert's name nod has nothing behind it and repeats a wink, and the quote credit runs straight into the closing quote mark.

## Findings
1. **Dessert name nod is empty and doubles up a wink** (screen, PDF, phone) [film]. "Bullet Tooth Tony's banoffee pie" has no tie to Tony in the film, and "Bullet Tooth Tony" is also the fourth wink, so the same name prints twice on the card. Cause: dessert name in the Snatch recipe in data/recipes/ or data/recipes2/ (the card's sweet). Fix: rename to a dish with a real hook, for example "Doug the Head's baked cheesecake" with the note "Creamy baked cheesecake on a biscuit base with a sour cream top". If you keep the banoffee, swap the wink instead: change "Bullet Tooth Tony" in data/film-flavour.json "Snatch (2000)".winks to "The caravan for Mickey's ma".
2. **Quote credit touches the quote** (screen, PDF) [layout]. It reads `stomach."Turkish` with no visible gap, because a single space in the condensed italic face is almost nothing. Cause: menu-formats/arcade.js line 261 (and the still variant on line 265), `"${esc(n.text)}" <span ...>`. Fix: give the credit span `margin-left:6px` so the name sits clearly apart.
3. **"Fixed: down in 4th" could not be confirmed from the sources I could reach** (screen, PDF, kit bet slips) [film]. Wikipedia and Wikiquote confirm the fight was fixed and that Mickey secretly bet on himself, but neither names the round. My memory of the film says Brick Top wants Mickey down in the fourth, so this is likely right; worth a check against the script. Cause: data/film-flavour.json "Snatch (2000)".prop.lines. If it cannot be confirmed, use "Fixed: Mickey goes down" at the same length.
4. **Venue wording is a light stretch** (screen, PDF, kit) [film], not marked down. Wikipedia calls Turkish a "slot machine shop owner"; "Arcade" and "Fruit machines. Pay out daily" are a fair British reading of that, and Sausage Charlie cooks on the premises, so the venue holds up. No change needed.
5. **Showtime cue comes early** (screen, PDF, Prep sheet) [film], minor. Mickey knocks out Gorgeous George in the first half hour, so starters have to be finished fast. It is true to the film, so no mark down; if you want a later cue, "Serve the mains when Mickey stays up in the fourth" (if item 3 is confirmed) lands about an hour in.

## What I could not check
- The exact round in the fixed fight (item 3); no script or Wikiquote line names it.
- That the arcade is called an "arcade" in dialogue; Wikiquote shows no line with that word, and Wikipedia says slot machine shop.
- The phone view as a styled screen; the sweep only gives a flat text dump with no spacing, so I read it for content only (it matches the card).
- Print colour on paper: the card is dark with neon type, which reads well on screen; on a home printer the dark ground may come out muddy.

Sources: en.wikipedia.org/wiki/Snatch_(film), Wikiquote Snatch (film) via wikiwand.com/en/quotes/Snatch_(film).
