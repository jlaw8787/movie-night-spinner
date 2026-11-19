# Review 31: Reel Dinner

**Overall: 7.9 out of 10**

A fresh look at the whole site on 19 Nov 2026, branch fix/review-30, served locally. The look, the hand-built menus, Galaxy Video and the PDFs are close to finished. The menus built from the shared library layouts are what pull the score down. Many of them put the wrong money, the wrong era or a made-up quote on the card, and you see it as soon as you read a few in a row.

## What is strong

- The front door is a real cinema. The marquee changes to the film you spun, the gilt wheel with its bulbs looks great, and the red and gold carries through the box office, candy bar, Match night and Quiz night without slipping (review-31-01).
- The hand-built menus are excellent. Louis' for The Godfather, the Nakatomi party invite, the Isla Nublar dining guide with its map, the Belmore all-night cafeteria trip sheet, Little Nero's, the Corner Grate Pizza tab with the 1.84 garlic knots: they get the place, the period and the jokes right, and the prices add up (Harry and Sally's tab comes to $18.70, the Mos Eisley running tab to 21.20, the Ghostbusters work order to $45.00).
- The westerns on the saloon layout (Tombstone, Unforgiven, Blazing Saddles, Back to the Future Part III) read like real bills of fare, with period prices and real quotes.
- Save PDF is quick and clean. Menu only, prep only and both all downloaded in 0.8 to 3.1 seconds on desktop and phone. A4 pages, the right orientation per page, no clipped text.
- Galaxy Video feels like a different shop in the best way. The shopfront walk-in, the hanging aisle signs, the rate board, tape backs with a staff tip and tonight's menu, and the rental receipt ("$10 note, change $8.00") are all purple, gold, teal and pink and never borrow the cinema's red (review-31-16, -22).
- The candy bar knows the film. Ghostbusters gets 1984 prices, three named combos with real savings that add up, and what you add flows onto the prep sheet (5 dishes became 9) (review-31-17).
- Match night pass-the-phone works end to end: deal 20, hand over, reveal "Tonight's feature" and straight into the menu (review-31-18). The no-match path ("Meet in the middle") works as well.
- The daily quiz is well made: picture, year, menu and cast rounds, one go a day, a ticket-stub score row.
- The account panel takes on the brand of wherever you open it: Reel Dinner red from the box office, Galaxy Video purple from inside the store (review-31-12).
- Plain Australian English throughout (prawns, lollies, capsicum, rockmelon, potato gems, chicken salt). No em dashes anywhere in the site, the data or the 1,000 film pages.
- The film pages are tidy: one canonical each, unique descriptions all under 160 characters, valid JSON-LD on every page, all 1,000 in the sitemap, and the picture matches what the app prints.
- No page errors in any run on either size.

## What holds it back

- The tavern layout puts storybook money on films set in the real world. Spider-Man: No Way Home is priced in "crowns" with "Coin of the realm only" (review-31-03). The Conjuring, a 1971 Rhode Island farmhouse, is priced in "silver" (review-31-04). The Cable Guy gets "gp".
- Wrong currency for the place. English pubs, Mary Poppins' nursery and Paddington's kitchen are priced in dollars, and the English villages get Australian pub wording ("counter meals 12 to 2 and 6 to 8", "Licence 2007"). Train to Busan and The Incredible Hulk's Rio kiosk are in dollars too.
- Period prices are missed on some library menus: The Rocketeer's 1938 cafe charges 7.25 for a plate (review-31-06), Red Dog's 1970s Dampier pub charges $16 for a counter meal (review-31-07), and Django's 1858 wagon charges $9 for a rib eye.
- Made-up lines are put in characters' mouths as quotes. Rose on Titanic, Lady Jessica in Dune, Furiosa, Morgan Stark, Gramma Tala, Seok-woo and Sue Snell all "say" things they never say in the films. Stakeout's card runs a Jaws line (review-31-02).
- Thin or empty dish notes on the home, pub, precinct and kiosk layouts: "Beef chuck, onion.", "Pork sausages, bacon.", and dishes on Kingsman and Red Dog with no note at all (review-31-07, -08, -14).
- On a phone, the printed menu often opens on a cover with no food on it, and the wide cards are drawn about 360 by 256 pixels, too small to read (review-31-10).
- A handful of price and layout slips you can catch with a single read of the card (see the issues list).

## How it was tested

- Desktop 1440x900 and phone 390x844 at scale 3 with touch, in Chrome through Playwright, with service workers blocked and the welcome screen skipped.
- First load: 0.6 s desktop, 0.45 s phone on localhost. About 3 MB is downloaded uncompressed on first visit (app.js 625 KB, providers.js 400 KB, the page 345 KB, dish-names.json 243 KB).
- Spun the wheel on both sizes. It settled in 7.7 s (desktop) and 6.9 s (phone), the marquee and Now Showing updated, and focus moved to Now Showing. The wheel also spins from the keyboard with Enter.
- Opened 98 films directly with /?film= on desktop, covering 68 different menu layouts (28 hand-built, 40 library layouts). Each one was screenshotted and its printed text pulled out. Average 2.8 s per film including a fixed 1.8 s settle wait.
- Read about 95 of those menus in full (dish names, notes, prices, quotes, footers). That included 9 westerns or frontier films, 2 pirate films, 10 fantasy films and the rest modern, and 12 were looked at full size in the zoom view.
- Opened 12 films as a phone and measured every printed face, then checked the text menu below it.
- Save PDF: all three options on desktop (Tombstone) and phone (TMNT), six files rendered to PNG and checked page by page. Times 0.8 to 3.1 s.
- Candy bar with and without a film, combo add, single add, then checked the prep sheet count.
- Galaxy Video: walk-in (1.1 s animation), skip, search ("pizza" gave 92 tapes), aisles, Spin this aisle, a tape back on both sizes, Rent it, See the menu.
- Match night: two full pass-the-phone games of 20 cards each, one with no match and one that matched (about 11 s, 25 swipes).
- Quiz night: the daily quiz from start to finish on the phone (10 questions, 17 s) plus Double feature, Mystery night and Trivia spin.
- Members: seeded a signed-in member with a fake Supabase the way scripts/check-card-stats.cjs does, then opened all five tabs from the box office on both sizes and from inside Galaxy Video on the phone.
- Film pages: a script checked all 1,000 (title, description, canonical, JSON-LD, og:image, sitemap). Tombstone, Spider-Man: No Way Home and The Godfather pages were screenshotted on both sizes and compared with the app.
- Accessibility: a 40-step keyboard walk on desktop, a tap-target and accessible-name scan of the box office, candy bar and store on the phone, an alt text scan, and a contrast sample of the phone text menu on 4 films.

## Scores

| Area | Score |
|---|---|
| First impression and visual identity | 8.8 |
| Brand consistency (cinema vs Galaxy Video) | 8.4 |
| Core flow (spin, menu, recipes, prep sheet, lock in) | 8.6 |
| Printed menus and Save PDF | 8.4 |
| Menu content (fact and vibe, prices) | 6.5 |
| Phone experience | 7.5 |
| Candy bar | 8.6 |
| Galaxy Video store | 8.9 |
| Match night | 8.8 |
| Quiz night | 8.2 |
| Members | 8.3 |
| Film pages for Google | 8.0 |
| Polish and craft | 8.1 |
| Accessibility basics | 8.2 |

## Issues

### Quick fixes

1. **Kung Fu Panda list is numbered wrong**
   - Where: Mr Ping's Noodle Shop, the "Today's menu in plain words" box (review-31-09).
   - What: The dishes are numbered 1, 2, 3, 4, 5, 2, 2. The Chinese boards above are numbered 1 to 7 correctly. The note "noodle soup, no secret ingredient" also starts with a small letter.
   - Why it matters: It's a hand-built showpiece and the slip sits right in the middle of it.
   - Fix: Number the plain-words list from the same index as the boards, and give the note a capital.

2. **The Godfather's complete dinner is cheaper than the pasta**
   - Where: Louis', The Godfather (review-31-19).
   - What: "The family dinner .70: antipasto, rigatoni and gravy, the veal, cannoli, espresso" costs less than the rigatoni alone (.85). Bought separately it all comes to about 3.12.
   - Why it matters: It breaks the prices-make-sense rule on the flagship menu. The 1.72 veal is the Easter egg, so the .70 isn't.
   - Fix: Make it about 2.75.

3. **Film pages print cook times in thousands of minutes**
   - Where: /menu/tombstone-1993/ (review-31-13) and 113 film pages in all.
   - What: "Prep 10 min, cook 4343 min" for pickled eggs. The pickling or chilling time is counted as cooking, and it goes into the JSON-LD cookTime (PT4343M, and up to PT10095M on Smokey and the Bandit).
   - Why it matters: It looks broken to people, and Google shows recipes with cook times like "168 hours".
   - Fix: Keep resting, pickling and chilling out of cookTime (it already lives in "Make ahead"), and write long times in hours or days.

4. **Duplicate lines on the shopping list**
   - Where: TMNT prep sheet PDF, Deli section (review-31-15).
   - What: "80g sliced pepperoni" and "200g thin sliced pepperoni" are listed as two items.
   - Why it matters: It's a shopping list, so people buy twice.
   - Fix: Merge the same ingredient across recipes when the names match after taking out "thin" and "sliced".

5. **Save PDF dialog says two pages when there is one**
   - Where: Save PDF dialog, "Prep sheet only".
   - What: It says "two pages", but TMNT's prep sheet came out as one page (Tombstone's was two).
   - Why it matters: A small trust slip on a screen people use every night.
   - Fix: Say "one or two pages", or count the pages before showing the dialog.

6. **Dishes in the wrong section or set at the wrong price**
   - Where: Willow (truck layout), Better Off Dead (review-31-21), Superman (review-31-20), Kick-Ass.
   - What:
     - Willow lists "warm spiced apple punch" under Cold Drinks.
     - Better Off Dead puts "It's got raisins in it", a green jelly, under Mains at 2.95.
     - Superman has lobster thermidor at 5.25, cheaper than the fried chicken at 5.95, and a malted iced latte in 1978.
     - Kick-Ass has "Combo 10: one of each 16.50" when the items add up to 37.90.
   - Why it matters: Each one is the kind of thing a guest reads aloud at the table.
   - Fix: Move or reprice each one. Add a check that warm drinks don't sit under a "Cold" heading and that a combo isn't under 60% of what its items add up to.

7. **The banquet layout prints the year as the number of guests**
   - Where: Banquet layout. Titanic says "Covers laid for 1912", The Wizard of Oz "Covers laid for 39", Dune "21", John Wick 2 "17".
   - What: The number comes from the year. Dune, Mad Max: Fury Road and John Wick 2 also all have the same 85.50 per-cover price.
   - Why it matters: "Covers laid for 1912" reads as a mistake.
   - Fix: Use 4 (the menu serves 4) or a number from the film, and set the per-cover price from the dishes.

8. **Dishes with no note at all**
   - Where: Kingsman (review-31-14), Red Dog (review-31-07), Hot Fuzz, The Incredible Hulk.
   - What: Some dishes have a name and a price and nothing else: Eggsy's pub crackling, Mr Pickle's cheddar dog biscuits, Gin martini, Pilbara barra tacos, Red Dog lamingtons, Strawberry Cornetto cones, Rocinha brigadeiros.
   - Why it matters: The rule is that every dish is complete and appealing. A bare name looks unfinished.
   - Fix: Fill the notes in. Add a build check that fails when a note is empty or shorter than four words.

9. **Video store words on the cinema member card**
   - Where: Account panel opened from the box office, My card (review-31-12). Also the candy bar's green "MAKE IT" tags.
   - What: The Reel Dinner card says "3 rentals, 7 more rentals to Gold member" and "Rentals: usually in Comedy". Rentals belong to Galaxy Video. The candy bar's green tags are the only green in the cinema.
   - Why it matters: Two brands, never mixed.
   - Fix: On the cinema side, call them "films" or "nights" and use the cinema's tier names. Make the tags gold or cream.

10. **Stray numbers read out from decorations**
    - Where: Recipe box (home) layout: True Grit, The Castle, Avengers: Endgame, Rear Window.
    - What: The decorative tab digits come through as text, for example "1 | 4", "9 | 7", "3 | 0 | 0 | 0", and "'97 10 26" on The Castle.
    - Why it matters: Screen readers read them out, and so does the film page text.
    - Fix: Mark the decorative digits aria-hidden, or draw them as images.

### Medium

11. **Storybook money on real-world films**
    - Where: Tavern layout. Spider-Man: No Way Home (review-31-03), The Conjuring (review-31-04), The Cable Guy, Doctor Strange, and any other modern film on this layout.
    - What: Prices in crowns, silver or gp, "Coin of the realm only", and a compass rose round the poster, at Doctor Strange's Sanctum in 2021 Queens and a 1971 farmhouse.
    - Why it matters: The rule is dishes and prices right for the film's place and time. This is the most obvious content miss on the site.
    - Fix: Only use storybook currency when the film's world is a made-up one (the Shire, Camelot, Florin). Otherwise use the local currency and drop the compass and "realm" lines.

12. **Dollars and Aussie pub wording in English, Korean and Brazilian settings**
    - Where:
      - Pub layout: Shaun of the Dead (review-31-05), Hot Fuzz, Kingsman.
      - Tearoom layout: Mary Poppins, Paddington.
      - Dining car: Train to Busan.
      - Kiosk: The Incredible Hulk.
    - What:
      - $ prices in London and Sandford, with "counter meals 12 to 2 and 6 to 8" and "Licence 2004" on English pubs.
      - Edwardian London at $0.20.
      - Busan and Rio in dollars.
      - The Winchester's pub nuts cost $7.95 when a pint is $3.95.
    - Why it matters: Wrong place, and the snack price fails the rule on its own card.
    - Fix: Pick the currency from where the film is set (£ and pence or shillings, ₩, R$). Give the pub layout an English wording when the pub is in England. Keep snacks below drinks and mains.

13. **Modern prices on period cards**
    - Where: The Rocketeer, 1938 (review-31-06); Red Dog, 1970s (review-31-07); Django Unchained, 1858; The Man from Snowy River (£ reward but .10 decimal prices).
    - What:
      - Bulldog Cafe plates at 6.75 to 7.25 with 3.50 starters.
      - Dampier counter meals at $16 and barra tacos.
      - Whole-dollar prices of 8 and 9 on the 1858 wagon.
    - Why it matters: Period prices for period settings is one of your rules, and the saloon menus show the site can do it.
    - Fix: Scale prices by era on every layout, not only the saloon and the hand-built ones. A price band per decade, checked at build time, would catch all of these.

14. **Thin notes and generic filler on the library layouts**
    - Where: Recipe box (home) layout: True Grit (review-31-08), The Hobbit, The Castle, Rear Window, Endgame. Also the precinct and kiosk layouts.
    - What:
      - Notes cut down to a couple of ingredients ("Beef chuck, onion.", "Pork sausages, bacon.", "Shortcrust bites of bacon.").
      - A "Before you sit down" list of scenes that has nothing to do with dinner.
      - "Stuck on the fridge" in Bag End and "Serves everyone on the couch" in 1870s Arkansas.
    - Why it matters: Next to the hand-built menus these feel unfinished, and the fridge and couch break the film's world.
    - Fix: Show the full note, and swap the fridge and couch wording for the film's own (a slate, a parchment, a ledger) when the era is before about 1950 or the world is made up.

15. **Made-up quotes put in characters' mouths**
    - Where: "From the host" and "A word from" blocks. Titanic (Rose), Dune (Lady Jessica), Mad Max: Fury Road (Furiosa), Avengers: Endgame (Morgan), Moana (Gramma Tala), Train to Busan (Seok-woo), Carrie (Sue Snell), The Conjuring (April Perron).
    - What: The lines are in quote style with a character's name but aren't in the film. On top of that, Stakeout has "Not a boating accident cod and chips", a Jaws line (review-31-02).
    - Why it matters: The rule is real quotes. Film fans notice.
    - Fix: Use a real line, or style these as notes ("Left on the table by...") rather than signed quotes. Check every signed line against the film's quote list.

16. **Phone printed menu often opens on a page with no food**
    - Where: Phone, the printed menu above the text menu (review-31-10).
    - What: Die Hard, The Dark Knight, School of Rock and Casablanca open on a cover page. Psycho opens on a postcard. Jurassic Park and Wall-E are drawn at about 362x256, where the text is about 3 pixels high.
    - Why it matters: The phone rule is printed menu first. If the first thing people see is a cover or an unreadable strip, the printed menu isn't doing its job on the phone.
    - Fix: On phones, open multi-page cards on the page with the dishes, and show wide cards one panel at a time at full width (or turned to portrait). The text menu can stay where it is.

17. **Quiz answers below the fold on the phone**
    - Where: Quiz night, daily quiz, question 1 on the phone (review-31-11).
    - What: The marquee and tabs stay on screen. Only the top of the first answer shows and the other three are below the fold.
    - Why it matters: You can't see the choices without scrolling, on the screen people play on most.
    - Fix: Scroll the question to the top of the screen when the quiz starts, and keep the still to about 40% of the screen height.

18. **Film page titles and recipe images**
    - Where: /menu/ pages.
    - What: 384 of the 1,000 titles are over 60 characters ("... movie night dinner menu | Reel Dinner"), so Google cuts them off. Every Recipe in the JSON-LD uses the whole printed menu as its image.
    - Why it matters: Shorter titles and real dish pictures are what earn the recipe results.
    - Fix: Drop "| Reel Dinner" when the title is long, and give each recipe its own image (or at least a crop).

### Large

19. **Check all 903 library menus for currency, era and place**
    - Where: Every menu that uses a library layout. That's 903 of the 1,000, against 97 hand-built.
    - What: Issues 11 to 15 all come from layouts being given to films without checking that the money, the era, the place and the wording fit. The samples read here show it on a large share of the non-American, period and fantasy films.
    - Why it matters: Menu content is the core of the product and the lowest score here. The hand-built menus show the standard. The library menus are where most spins land.
    - Fix: Add a fit table per film (country, currency, decade, real world or made-up world) and have the build:
      - check the currency symbol against the country
      - check prices against a price band for the decade
      - refuse storybook coin for real-world films
      - fail on notes under four words
      - fail on any signed quote that isn't on the film's quote list

      Then fix whatever it flags. Start with the tavern, pub, tearoom, home and banquet layouts.

20. **A proper phone version of the printed menu**
    - Where: Phone, all multi-page and wide layouts.
    - What: Issue 16 at scale: phone users get either a cover or a strip too small to read on about a third of the films sampled (4 of 12 opened on a page with no food, 2 more were too small to read).
    - Why it matters: The printed menu is the product's signature, and most people will meet it on a phone.
    - Fix: Give every layout a phone version (one panel per screen, dishes first, swipe for the rest), and add a check that fails when the first panel has no dish or its text is drawn under about 9 pixels.

## Notes for the owner

- The best of this site is very good. Galaxy Video, Match night and the hand-built menus would hold up next to paid apps. What's left is mostly menu content, not new features.
- If you only do one thing, do issue 19. The checks are mechanical and will catch most of what a film fan would laugh at, without you having to read 903 menus.
- The saloon layout proves period prices work. Copy how it does them to the pub, diner, kiosk, truck and tavern layouts.
- Keep the Easter eggs. Every one I found (1.84, 19.93, .76, 1.72, 19.83, 1.94) reads as a deliberate price and none of them clashed with the card.
- Small checks worth adding to the build: no empty notes, no two shopping lines for the same ingredient, combo price within reason, and no number from a decoration showing up in the readable text.
- On the phone, the checklist tick boxes are 22 pixels and the store's hanging aisle signs are 11 to 18 pixels tall. They're fine as extras because there are bigger ways to do the same thing, but making them a bit bigger would help thumbs.
- The Cabin Sketch font on Stakeout's phone text menu passes contrast (8.6 to 1) but its hollow strokes are hard to read at 21 pixels. A solid font for dish names on chalk themes would read better.
