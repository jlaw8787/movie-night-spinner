# Review 30: Reel Dinner

**Overall: 8.1 out of 10**

A fresh, independent review. I had not seen the site before and did not read earlier reviews.

## What is strong

- The cinema front is a real place. The marquee photo, gold wheel, red curtain and ticket stub buttons all feel like one building. It looks expensive.
- The printed menus are the best thing here. I looked at 48 films across every layout and nearly every one has its own venue, props, quotes and in-jokes. Ghostbusters as a firehouse work order, Kingpin as a bowling score sheet and Good Will Hunting as an L Street Tavern chalkboard are all excellent.
- Save PDF works every time. It gives clean A4 files with no clipped text, and the prep sheet is tidy and usable in a real kitchen.
- Galaxy Video has its own world: purple, teal and gold, a walk-in shopfront, tapes with backs, Weeklys and late fees. The two brands mostly stay apart.
- Match night, Quiz night, the member card and the candy bar all work start to finish with no page errors.
- No em dashes turned up anywhere in rendered menus, film pages or the app text.

## What holds it back

- Prices still break the "makes sense" test on a fair number of menus: cents for a 2021 diner, a $28 pizza slice next to $12 bagel bites, modern prices in an 1880 saloon, a hot dog dearer than a sirloin.
- Some menus are not true to the film's world: South African braai food for The Lion King, a takeaway delivery menu with a phone number for Mulan's imperial China, an airline layout for the Robinsons' home, hot honey and burrata in 1990 New York.
- On phones, the printed menu is cut into two halves with words chopped mid-word at the fold. It looks broken at first glance.
- The Google film pages show stale menu pictures, with prices that no longer match what the app shows.
- Members, Dinner Duels and quiz challenges, which belong to cinema features, live inside a purple Galaxy Video dialog opened from the cinema's top bar.

## How it was tested

- Served the repo locally on port 4801 with service workers blocked. Chrome (Playwright) as a phone (390x844, scale 3, touch) and a desktop (1440x900).
- Spun the wheel on both sizes and timed it (7.7 s phone, 11.4 s desktop from tap to menu, mostly the spin animation).
- Opened 48 films by link across 40 layouts (one per layout, plus 8 hand-built menus). Screenshotted every printed menu on desktop and checked several on phone, including swiping pages.
- Saved 11 PDFs (menu only, prep only, and both) on desktop and 8 on phone, timed each and rendered the pages to check them.
- Read in full 26 menus' dish names, notes and prices (Lion King, Die Hard, Muriel's Wedding, Pulp Fiction, Animal Kingdom, Big Lebowski, Meet the Robinsons, Fast and Furious, Austin Powers, Kingpin, Smile, TMNT, Ghostbusters, Good Will Hunting, Soul, Matilda, Happy Gilmore, Ghostbusters: Afterlife, Wicked: For Good, Me Myself and Irene, Unforgiven, Hot Tub Time Machine, Forgetting Sarah Marshall, Bridesmaids, Goodfellas, Bugsy) and skimmed prices on the other 22 sampled.
- Scanned all 1,000 film files for American food words.
- Candy bar with and without a film on, added a combo and checked it reached the prep sheet and shopping list.
- Galaxy Video: walk-in, shelves, aisles, a tape back, guest card.
- Match night: a full pass-the-phone game to a match.
- Quiz night: played the daily quiz through.
- Members: seeded a signed-in member the way scripts/check-card-stats.cjs does and opened every tab.
- Film pages under /menu/: title, description, canonical, structured data, sitemap, and screenshots on both sizes.
- Accessibility: keyboard walk through the first 30 stops, tap target sizes, button names, image alt text, a contrast sample.

## Scores

| # | Area | Score |
|---|------|------|
| 1 | First impression and visual identity | 8.5 |
| 2 | Brand consistency (cinema vs Galaxy Video) | 8.0 |
| 3 | Core flow (spin, menu, recipes, prep sheet, lock in) | 8.5 |
| 4 | Printed menus and Save PDF | 8.5 |
| 5 | Menu content (fact and vibe, prices) | 7.0 |
| 6 | Phone experience | 7.5 |
| 7 | Candy bar | 8.5 |
| 8 | Galaxy Video store | 8.5 |
| 9 | Match night | 8.5 |
| 10 | Quiz night | 8.5 |
| 11 | Members | 8.0 |
| 12 | Film pages for Google | 7.5 |
| 13 | Polish and craft | 8.0 |
| 14 | Accessibility basics | 8.0 |

## Issues

### Quick fixes

**1. Bloodstream listed for Beauty and the Beast**
- Where: Box office, "Stream on" under Beauty and the Beast (1991). Screenshot review-30-16.png.
- What: Bloodstream, a horror streaming service, is listed next to Disney+. The streaming data almost certainly matched the wrong film.
- Why it matters: it makes the where-to-watch box look careless on one of the most popular films.
- Fix: drop Bloodstream from this film in providers.js. Add a check that flags genre-locked services (Bloodstream, Shudder and the like) on Family or Animation films.

**2. Prep sheet PDF says "One page" but makes two**
- Where: Save PDF picker, "Prep sheet only". Screenshot review-30-12.png (Good Will Hunting).
- What: the option says "One page, single-sided". The file has two pages: the shopping list on one, the method on the other.
- Why it matters: people printing for the kitchen get a surprise second page.
- Fix: change the line to "Shopping list and method, two pages." Or make it say the real page count for the film.

**3. Meta descriptions end mid-word with "a..."**
- Where: every /menu/ film page, meta description and og:description (e.g. "Recipes for 4, a...").
- What: the text is cut at a set length, mid-phrase.
- Why it matters: it is the snippet people see in Google and when a link is shared. It reads as sloppy.
- Fix: cut at the last full sentence under about 155 characters, or write a fixed short ending such as "Recipes for 4, prep sheet and shopping list."

**4. Account tabs cut off on a phone**
- Where: member dialog on a 390 wide phone. Screenshot review-30-05.png.
- What: the last tab reads "SETTING" with the S cut off. The row scrolls, but nothing shows it does.
- Why it matters: it looks like a layout bug, and Settings is where Sign out and Delete account live.
- Fix: shrink the tab letter spacing or font a touch so all five fit at 390, or add a fade at the right edge so it reads as scrollable.

**5. US food words still on menus**
- Where: Meet the Robinsons "peanut butter and jelly bites" and "Cheesy tater tots" (review-30-08.png), Venom and Weapons "tater tots", four "shrimp" dishes (Princess and the Frog, The Notebook, Raya, Men in Black 3), Me Myself and Irene "hot wieners", Soul "hard candy lollipops", My Best Friend's Wedding "Jell-O".
- What: Australian words are the rule. Jelly means jam, tater tots are potato gems, shrimp are prawns, candy is lollies.
- Why it matters: an Aussie reader trips on them, and "jelly" means something else here.
- Fix: peanut butter and jam, potato gems, prawns, frankfurts, lollies, jelly (for Jell-O). Add these to tests/spelling.test.cjs so they cannot come back.

**6. Dish notes that are jokes, not food**
- Where: Ghostbusters "Fridge devilled eggs: Open the fridge slowly. Zuul lives in there" and "Firehouse Chinese: Out of the boxes, while business is slow" (review-30-15.png); Pulp Fiction "Mamie Van Doren devilled eggs: Mamie Van Doren works the other side of the room"; Lion King "Biltong and droëwors: Strictly beef. Pumbaa checked twice" and sosaties "Lamb skewers, no lunch lost to Zazu".
- What: the note says nothing about the dish. "Firehouse Chinese" is not a dish at all.
- Why it matters: the owner's rule is that every dish is complete and appealing. A diner should know what they are getting.
- Fix: keep the joke but lead with the food, e.g. "Firehouse sweet and sour pork from the takeaway boxes", "Devilled eggs with paprika and crisp shallots. Zuul lives in the fridge."

**7. Goodfellas dish named as an instruction**
- Where: Goodfellas printed menu and prep sheet. Screenshot review-30-13.png.
- What: the first dish is "Slice the garlic, razor thin". The prep sheet heading reads "Slice the garlic, razor thinSNACK". "Red wine, opened early" is also just a drink with no dish.
- Why it matters: it reads like a step, not a dish, and the run-on with SNACK looks like a bug.
- Fix: name it "Razor-thin garlic and tomato bruschetta" and keep the jail-scene line as the note.

**8. Match night uses dating-app colours**
- Where: Match night swipe buttons. Screenshot review-30-06.png.
- What: Skip is coral pink and Keep is mint green with a heart.
- Why it matters: Match night is a cinema feature and the cinema is red and gold. Pink and green pull it toward the store's palette and a dating app.
- Fix: Keep in gold with a ticket or star mark, Skip in muted cream or deep red.

### Medium

**9. Phone printed menu splits words at the fold**
- Where: every landscape printed menu on a phone (Lion King, Ghostbusters, most layouts). Screenshot review-30-01.png.
- What: the menu is cut into two swipe pages. Page one ends mid-word ("Grubs, Bu", "Hakuna Matata chaka", "Clear ski") under a dark shadow. Page two repeats the cut words.
- Why it matters: this is the first thing a phone user sees after a spin, and it looks like the page failed to load. The owner rule is phones show the printed menu first, so it has to look right.
- Fix: show the whole landscape page scaled to the screen width first, as the /menu/ film pages already do (review-30-04.png), with tap to zoom. Keep swipe pages only for menus that really have two pages.

**10. Ghostbusters: Afterlife priced in cents**
- Where: Spinners Roller Hop, 2021. Screenshot review-30-02.png.
- What: chicken fried steak 70 cents, smash burgers 65 cents, root beer 10 cents. The film is set in 2021.
- Why it matters: the period-price rule is meant for venues of that period. This is a modern diner in a modern film, so the prices read as a mistake.
- Fix: price it as a 2021 Oklahoma diner (burgers $12 to $14, shakes $6 to $7), or have priceSense use the film's year when the venue is from that year. Then check the other two drive-in films.

**11. Prices that do not add up**
- Where and what:
  - Soul (review-30-03.png): New York pizza slice $28, more than double the $12 bagel bites; hard candy lollipops $14 cost more than a starter.
  - Forgetting Sarah Marshall (review-30-14.png): beetroot dip $8.25 against garlic prawns $4.50; fish tacos $18 above kalua pork $15.50; a resort mai tai at $4.
  - Me Myself and Irene: foot-long hot dogs $10.50, dearer than the sirloin at $8.95.
  - Good Will Hunting: Fenway franks $10.50, nearly the same as corned beef and cabbage.
  - Bridesmaids (review-30-18.png): one cupcake $8.75, dearer than either starter.
  - Wicked: For Good: shortbread cookies $16, dearer than the raspberry tarts and cheese tarts.
  - Major League: roasted peanuts $5.25, dearer than the pierogi.
  - Scream 2: buckeyes $6.25, more than twice the loaded nachos.
  - TMNT: garlic knots $1.84 (an odd price when everything else ends in .25 or .50).
- Why it matters: the owner asked for prices that make sense. A sweet or snack that costs more than a main breaks the illusion of a real venue.
- Fix: extend scripts/check-prices.cjs. Flag a single snack or sweet priced above the cheapest main, a slice or hot dog above a steak, and odd endings outside .00, .25, .50, .75, .95. Then fix the flagged films by hand.

**12. Unforgiven and other old-West or period menus at modern prices**
- Where: Greely's Beer Garden, 1880s Wyoming. Screenshot review-30-11.png.
- What: beef and bean stew $11, pork chops $12.50, whiskey coffee $5.75. Hot Tub Time Machine goes the other way: schnitzel $2.95, cheaper than the chilli.
- Why it matters: Bugsy and Dog Day Afternoon get period prices right, so the gaps stand out.
- Fix: period prices for saloon, chuckwagon and western layouts (cents to a dollar or two), and a check that mains are always above starters within a menu.

**13. Menus not true to the film's world**
- Where and what:
  - The Lion King (review-30-01.png): chakalaka, sosaties, bobotie, biltong, droëwors and peri peri are Southern African. The Pride Lands are East African (Swahili names, Kenyan and Tanzanian savanna). Only the mandazi fits.
  - Mulan (review-30-09.png): a takeaway layout with "We deliver", a phone number and "free delivery over $25" in imperial China.
  - Meet the Robinsons (review-30-08.png): "Flight 149, now boarding" airline layout for the Robinson family home.
  - TMNT (1990) (review-30-10.png): hot honey, chilli crisp butter, burrata and cup-and-char pepperoni are 2010s trends, not 1990 New York.
  - Black Sheep (1996): "Seattle cold brew with maple cream". Cold brew was not a menu item in 1996.
  - Die Hard: "barefoot beer-battered flathead tacos". Flathead is an Aussie fish and there are no tacos at the Nakatomi party.
  - Wall-E: "Wall-E's pressed cob loaf". Wall-E does not eat.
- Why it matters: "true to the film" is a core rule, and these are the ones a fan spots straight away.
- Fix: Lion King to East African food (nyama choma skewers, pilau, sukuma wiki, chapati, mandazi). Mulan to a teahouse or banquet layout with no delivery. Robinsons to the home or kitchen layout. Swap the anachronistic dishes for ones of the film's year. Add an era word list (hot honey, burrata, cold brew, poke, chilli crisp) that fails the check for films before 2010.

**14. Film pages for Google show stale menu pictures**
- Where: /menu/the-lion-king-1994/ and very likely all 1,000. Screenshot review-30-04.png against review-30-01.png.
- What: the page image shows Biltong and droëwors at $5.25 and the smoothie at $2.50. The live app shows $2.50 and $1.50. The previews in assets/menu-previews were made on 18 Nov. The price changes in app.js came on 19 Nov.
- Why it matters: Google visitors and anyone who gets a shared link see one price, then open the app and see another. og:image uses the same picture.
- Fix: rerun scripts/render-previews.cjs after every price or menu change, and have check-ripple.cjs fail the deploy when a preview is older than its film's data or the price code.

**15. No Recipe structured data on film pages**
- Where: every /menu/ page. Only WebPage and ItemList are in the JSON-LD.
- What: each page lists recipes with prep and cook times and ingredients, but Google is not told they are recipes.
- Why it matters: recipe rich results (photo, time, rating) are the main way recipe pages get clicks.
- Fix: add a Recipe entry per dish (name, recipeIngredient, recipeInstructions, prepTime, cookTime, recipeYield 4, image), or at least for the main.

**16. Cinema features live inside the Galaxy Video dialog**
- Where: the account button in the cinema's top bar opens a purple Galaxy Video member dialog. Dinner Duels (Match night) and quiz challenges (Quiz night) sit in its tabs. Screenshot review-30-05.png and review-30-07.png (store card thumbnail in the cinema bar).
- What: Match and Quiz are cinema rooms in red and gold, but their history and invites are in the store's purple.
- Why it matters: the two brands are meant never to mix. This is the one place they clearly do.
- Fix: either give the cinema its own red and gold "My tickets" panel for duels, quiz and friends, and keep the purple card for rentals and late fees only, or make the account dialog take on the colours of whichever room opened it.

**17. Phone home: the Spin button sits at the very bottom edge**
- Where: phone first load. Screenshot review-30-07.png.
- What: the marquee photo takes about 45 percent of the screen. The nav, the Spin/Match/Quiz switch and the top of the wheel follow, with the Spin button cut off at the bottom.
- Why it matters: the one action the site is built on is half hidden on first look.
- Fix: trim the marquee to about 30 percent of the height on phones, or pull the wheel up so the whole Spin button shows without scrolling.

**18. Small tap targets**
- Where: Galaxy Video aisle signs on the shopfront (Horror 47x13, Sci-fi 42x11, Drama 39x11, Family 66x18). Movie checklist ticks (22x22). Store filter toggles (48x28).
- What: well under the 44x44 guide.
- Why it matters: easy to miss with a thumb, and these are things people tap a lot.
- Fix: pad the hit area to at least 44 tall (an invisible larger box is fine) and space the aisle signs out.

### Large

**19. A full price pass across all 1,000 menus**
- Where: site wide (see issues 10 to 12).
- What: in my sample of 48, about one in five had at least one price that did not make sense.
- Why it matters: the target is 9.5, and price sense is one of the owner's stated rules. At this rate around 200 menus have a visible price problem.
- Fix: write firm rules into check-prices.cjs (course order, snack never above the cheapest main, drinks within a sane band of food, era bands by setting not release year, clean endings), run it across all 1,000, fix by hand what it flags, then re-render previews.

**20. A "true to the film" pass on layouts and dishes**
- Where: site wide (see issue 13).
- What: the layout chooser sometimes picks a venue type that cannot exist in the film's world (delivery in imperial China, airline for a house), and some dishes are the wrong region or era.
- Why it matters: this is the heart of the product. Each miss is something a fan will screenshot.
- Fix: for each film record the setting (place, era, venue kind). Block layouts that clash with it (takeaway or airline before 1900 or outside cities, and so on). Run the era word list from issue 13. Review the flagged films by hand.

## Notes for the owner

- Save PDF timings: desktop 4.3 to 13.2 s (first one slower while the tools load, others mostly 5 to 9 s); phone 1.5 to 4.0 s. All files were A4 and clean.
- No page errors on any screen I opened.
- The 8 hand-built menus I sampled (Goodfellas, Scarface, Bugsy, TMNT, Dog Day Afternoon, Pope of Greenwich Village, Quick Change, Wall-E) are the strongest layouts on the site.
