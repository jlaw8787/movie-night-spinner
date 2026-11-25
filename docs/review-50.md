# Review 50

Branch fix/review-50, served locally on port 4190. Judged only on what prints: the printed card, the phone menu, the Prep sheet and the public film page. Josh's by-design calls (year Easter eggs, shop venues with brought-in food, dishes from anywhere in the film's world, Australian spelling, the five-dish cook with extra printed dishes, dry cards) were not marked down. The Italian Job and The Silence of the Lambs were skipped.

## What I looked at

- **Full dump of all 1,000 cards** with scripts/dump-cards.cjs in two lanes of 500, run one after the other. Every face, print list, phone menu and Prep sheet was swept with Python for:
  - em and en dashes
  - dish note length and shape
  - prices by layout, decade and currency
  - alcohol on dry and family cards
  - period words against the set year
  - card wording against phone wording
  - duplicate shopping lines
  - stock layout lines against the venue
  - dish names against their notes
  - US, British and Australian words against the country each film is set in
- **About 115 cards read dish by dish:**
  - a random draw of 40 (The Silence of the Lambs swapped for Superbad)
  - Australian cards (The Castle, Muriel's Wedding, Priscilla, Mad Max, Babe, Strictly Ballroom, Gallipoli, The Dish, Kenny, Lion, Australia, Red Dog, Phar Lap, The Man from Snowy River, Wolf Creek, Storm Boy, Crocodile Dundee, Young Einstein, Ladies in Black)
  - British cards (Notting Hill, Love Actually, Bridget Jones, Shaun of the Dead, Snatch, Wallace & Gromit, Kingsman, An American Werewolf in London, Hot Fuzz, Four Weddings, Goldfinger)
  - kids and Christmas cards (Toy Story, Elf, Grinch, Polar Express, Frozen, Shrek, Muppet Christmas Carol, Nativity!, The Holdovers, Christmas Vacation, Home Alone 2, Annie)
  - prisons and messes (Shawshank, The Green Mile, Stripes, Con Air, Danger Close, The Great Escape, Paddington 2, Chicken Run, Singin' in the Rain)
  - period clubs (Casablanca, Dick Tracy, Harlem Nights, Moulin Rouge!)
  - the hand-built one-offs (The Godfather, Die Hard, Back to the Future, The Big Lebowski, Pulp Fiction, Rain Man, Home Alone, Anchorman, Elf)
  - the named list (Rocky III, Goldfinger, Meet the Parents, Paranormal Activity, Psycho, Wolf Creek, Friday the 13th, The Return of the King, Wall Street, Annie, Storm Boy)
- **Browser checks of 18 films at 1280x800 and 390x844:** Storm Boy, The Godfather, Die Hard, Back to the Future, The Big Lebowski, Pulp Fiction, Rain Man, Home Alone, Anchorman, Casablanca, Goldfinger, Wolf Creek, Hot Fuzz, Paranormal Activity, Toy Story, Shawshank, Rocky III and Moulin Rouge!. For each film I checked the printed card, the phone menu with the first method opened, and the Prep sheet. I measured page overflow, elements running off screen, and the smallest print size on screen.
- **The full size view at 1280x800 for one film in each of the 40 layouts** in data/film-format.json. For each one I:
  - called openMenuZoom() and stepped back to page 1
  - turned every page and recorded which card text lands on a page
  - noted which page it opens on, the zoom level and the size of the dish notes
- **All 1,000 film pages compared with their cards** for venue line, dish names and notes. I also hand-checked 40 random pages for extra dishes and dashes.

## Overall: 8.7 / 10

| Area | Score | Why |
|---|---|---|
| True to the film | 8.9 | Cards are dense with real film detail (Phar Lap's six o'clock bar, Lebowski's In-N-Out order and Ralphs half-and-half, Goldfinger's scorecard that adds up in shillings, Slughorn's crystallised pineapple, Delmar's number 5). A few centrepieces are thin: Casablanca has one drink, mint tea, at Rick's. |
| Dish notes | 8.7 | All 6,967 notes run 5 to 19 words (mean 11) and end cleanly, and none repeat across cards more than three times. A handful don't match their dish names, and some hand-built cards use plot quips in place of a description. |
| Prices | 8.8 | Decades and currencies are sound everywhere: pence and shillings, francs, yen, sous, credits. Goldfinger's totals are correct. A few cards rank items oddly against each other (see below). |
| Template wording that suits the venue | 7.8 | The weakest area. About 275 cards print a footer label followed by a film moment that doesn't fit the label ("Lost and found: Elijah's brittle bones."). Some homes wear motel or banquet stock lines. Four institutional cards pour alcohol on a meal order or in a prison mess. |
| Period-correct food | 8.6 | Mostly right. A short list of clear slips: The Fly's brown sugar iced latte in 1986, Rocky III's bruschetta and street tacos in 1982, a michelada in 1976 Texas, a Cosmopolitan sold as a Cape Codder in 1975. |
| Words that fit the setting, no dashes | 8.4 | No em or en dashes anywhere in 1,000 cards, phone menus, Prep sheets or film pages. Australian words still leak onto American cards: ice cream "spiders" on seven US cards, self-saucing pudding in 1975 San Diego, "takeaway" in New York. |
| Desktop readability at 1280 | 8.9 | No page overflow on any of the 18 films. In the column view, dish notes read at 11.5 to 23px. The full size view opens on the menu page at 1.4x with notes at 17 to 26px, and every card's text lands on a page in all 40 layouts. Smallest text: Back to the Future's "Guest check" at 7.1px, Toy Story's "TIX" at 9.3px. Shawshank's canteen panels look soft. |
| Phone menu at 390 | 9.2 | No overflow. The smallest phone menu text is 12px. The first method opens cleanly with ingredients and numbered steps (Storm Boy, shot 01). The card preview above it is tiny (Back to the Future at 3.4px, Storm Boy at 6.6px), but tap to zoom and the phone menu cover it. |
| Prep sheet and shopping list | 8.6 | No overflow, smallest text 11.2px on desktop and 12px on phone. Australian shopping words are used throughout (no cilantro, shrimp or ground beef in any list). About 40 sheets list the same item twice. |
| Film pages | 9.6 | All 1,000 pages match their cards exactly: venue line, every dish name and every note, with no dashes. Extra dishes appear with their method. |

## What is strong

- **No dashes anywhere.** Across 1,000 printed cards, phone menus, Prep sheets and film pages there is not one em or en dash. The only spaced hyphen is Beetlejuice's letter-spaced "BIO-EXORCIST".
- **Words match across all four places.** The card, phone menu, Prep sheet and film page agree word for word on every dish name, note and venue. I found no drift between them.
- **Dry cards are clean.** No alcohol on any of the 280 kids, family, Christmas, wizard and dry-list cards, including in the recipes (eggnog is custard, the Grinch spritz is soda, butterbeer is cream soda).
- **The Australian and British cards are the best in the set.** The Castle (Bonnie Doon kabana, moselle from the cask), Phar Lap (pence prices, "Bar shuts at six"), Ladies in Black (2/11 shilling prices, kabana), Wolf Creek (servo dim sims, Bundy and dry), Gallipoli (Egyptian Stella), Hot Fuzz (Cornetto, cranberry juice with no ice), An American Werewolf in London (45p pint of bitter) all read like real places.
- **The hand-built one-offs are excellent.** The Godfather (Louis' in the Bronx, "Leave the gun"), Die Hard (Nakatomi directory, "make fists with your toes"), Back to the Future (Saturday November 5 1955 is right, "No Pepsi Free"), Elf, Home Alone (11.80 for the large cheese, paid $12) and The Big Lebowski all hold up line by line.
- **Prices fit their decade and currency.** Prices sit in their era: 1950s cents, 1980s diner dollars, francs at Rick's, yen in Tokyo, sous in Villeneuve, pieces of eight on the Dying Gull.
- **The full size view works in every layout.** Every layout opens on the menu page at a reading size. Paging reaches every face, and no card text is lost (the only text on no page was two hidden still captions, on Wonder Woman 1984 and Shutter Island).
- **The phone menu and Prep sheet are tidy at 390.** No overflow, 12px minimum, a clear method with timed steps, and a shopping list grouped by aisle.

## What holds it back

1. **Footer labels followed by fragments that don't fit them.** About 275 cards end with a label then a film moment, and the label often doesn't fit the moment:
   - "Overheard at the counter: Mickey's passing." (Rocky III)
   - "Overheard at the counter: Baby Muppets in Piggy's daydream." (The Muppets Take Manhattan)
   - "Lost and found: Elijah's brittle bones." (Unbreakable)
   - "Lost and found: Tom, who told her to look up." (Last Christmas)
   - "Ask the band about Clay's drawbridge jump." (Office Christmas Party)
   - "Overheard at the counter: Ice sculpture at the party." (Groundhog Day)
   - Crocodile Dundee's footer reads "Kids and dogs welcome on the verandah. Sue Charlton, the reporter from New York. Prices subject to change."

   A real menu would never print these.
2. **Stock lines from the layout land on homes and private rooms:**
   - Paranormal Activity (motel layout, shot 06): Katie and Micah's kitchen prints "Last stop before", "Blue Plates" and "Pie and Sweets" with no pie. Barbarian's rental gets the same "Last stop before".
   - Thor: The Dark World: Jane's Greenwich flat prints "By command of the house", an "Order of toasts" ("I. Loki, as Captain America.") and the sentence "Hang your hammer on the hook." twice in a row.
   - Meet the Fockers prints "Dinner for two" for a two-family dinner. Get Out, The Aristocats and The Little Mermaid carry the same "for two" line.
   - Easter Parade puts roast lamb, chicken à la King and a Manhattan under "Snack Bar / Hot Counter / Candy Case" with "Admit one" and a seat number.
   - The Return of the King's "Order of toasts" toasts "Shelob's lair at Cirith Ungol".
   - E.T.'s closet hideout gets the campfire layout.
3. **Drinks that don't suit the venue.** By your dry rule these institutional cards should be alcohol-free, but four pour alcohol:
   - The Shawshank Redemption pours "Rooftop ginger beer shandy, cold lager" in a prison mess, with the cue "Pour the beers".
   - Terminator 2's "Pescadero State Hospital, for the criminally insane, Meal order" serves a frozen margarita and Mexican lager.
   - The Fugitive's Cook County Hospital meal order serves Goose Island pale ale.
   - X-Men's "Xavier School Kitchen" serves a rye old fashioned.

   Other cards promise a drink they don't serve:
   - Casablanca promises "the champagne is on the house" but the bar has only mint tea.
   - Anchorman says "drink like gentlemen" and "Scotch, neat. Ron's." with no liquor on the card.
   - Crocodile Dundee's cue says "Pour a beer" but the bar lists only rum and ginger beer.
4. **Australian words on American and fantasy cards** (different words, not just spelling):
   - "Spider" floats on Poltergeist ("Cuesta Verde orange spider"), Batman Forever, Bill & Ted, Good Burger, Newsies, Blazing Saddles and The Flintstones
   - Anchorman's "Butter SCOTCH pudding, self-saucing sponge"
   - Hot Shots! "Dead Meat's last chips" for fries
   - Die Hard with a Vengeance "Takeaway orders"
   - Psycho's "self-raising dumplings" and malt vinegar onions
   - Rain Man's "Fish finger rolls" whose note says "fish sticks"
   - Halloween's pumpkin pie with "mixed spice"
   - The Great Escape's "jam drops"
   - Strange Brew's poutine of "Chips, curds and gravy"
   - My Cousin Vinny's "Biscuit: A soft scone"
   - Dragnet's vanilla slice
   - Mary Poppins Returns prints "Stuck on the icebox" in a London house.
   - Pavlova turns up on 16 cards, including Bambi, Frozen II, Elemental, Atlantis, Jurassic Park III and The Rise of Skywalker.
5. **Period slips:**
   - The Fly (1986): "Brundle's brown sugar iced latte"
   - Rocky III (1982): bruschetta and "street tacos" on a diner
   - Dazed and Confused (1976): "Wooderson's michelada"
   - The Rocky Horror Picture Show (1975): "Cape Codder" that is really a Cosmopolitan (orange liqueur, flamed peel)
   - Beauty and the Beast (2017): "Mrs Potts's coronation chicken sandwiches"
   - Lady and the Tramp (1909): bruschetta at Tony's
   - Killer Klowns (1988): popcorn chicken
   - Dick Tracy (1938): "torched meringue"
   - Moulin Rouge! (1899): "dry-brined sirloin"
   - 10 Things I Hate About You (1999): panko fish on brioche with arugula
6. **Dish names that don't match their notes:**
   - Scream (2022): "Mindy's movie rules pepperoni pizza" has no pepperoni in the note.
   - The Holdovers: "flaming cherries jubilee" is not flamed.
   - Independence Day: "berry lemonade" is "smoky tea and fresh lemonade".
   - The Ring: "Seattle clam chowder" made with "fresh vongole".
   - Unforgiven: "pickled pink in beets vinegar".
   - Dead Poets Society: "We are food for worms lads" is missing its comma.
   - Pulp Fiction ("Your waiter brings it to the car." for Buddy Holly chicken) and Three Men and a Baby ("Peter builds skyscrapers. Diapers are harder." for a steak sandwich) use plot quips in place of saying what the dish is.
7. **Duplicate lines on about 40 Prep sheets:**
   - Mayonnaise and whole egg mayonnaise: Red Dog, Hot Rod, The Waterboy, The Great Outdoors, Final Destination 2
   - Olive oil and extra virgin olive oil: The Spy Who Loved Me, Liar Liar, Casablanca, The Cable Guy, Mission: Impossible 2, Elm Street 3
   - Mission: Impossible 2: "800g small potatoes" and "800g baby potatoes"
   - A Star Is Born: passata twice
   - The Grand Budapest Hotel: beef stock twice
   - The Matrix Reloaded: nutmeg and ground nutmeg
   - Beerfest: one can of lager and four cans of lager
   - Rush Hour: "80g egg" and "2 eggs"
   - Wayne's World: pepperoni twice
   - Dr. No: coconut milk twice
   - The Waterboy: dill pickles and chopped dill pickles
   - Skyfall: a bottle of whisky and 40ml peated whisky
   - Elf: candy canes twice
   - Kill Bill: sake twice
   - Batman: purple food colouring twice
8. **Prices that sit oddly next to each other on the same card:**
   - Home Alone: malt shake 0.75 under cola 1.25
   - Rocky III: protein shake 60¢ under lemonade 90¢
   - Batman Forever: "Wayne Manor tenderloin" $4.95 under noodles $5.95, at a circus concession
   - Jerry Maguire: a lunchroom margarita at $2.25
   - Crocodile Dundee: a 1986 pub rum and ginger beer at $3.75, the same as garlic prawns
9. **Desktop details:**
   - Back to the Future prints "Guest check" at 7.1px in the column view (shot 05).
   - Toy Story's "TIX" prints at 9.3px and Goldfinger's "Front Nine" at 10.3px.
   - Shawshank's canteen column at 1.45x shows the Starters and Desserts panels soft and blurred, and puts the mains ("Hot line") above the starters (shot 07). The blur was seen in headless Chrome, so check it on a real screen.
   - Full size pages 3 and up on diner cards open on a full-screen still with the dishes below the fold (The Rocketeer, shot 08).

## To reach 9.5

1. Rewrite the footer label lines so each moment fits its label ("Overheard: ..." should be something someone said; "Lost and found: ..." an object). Otherwise drop the label and print the moment as a plain wink line. This one change lifts about 275 cards.
2. Give homes and private rooms their own stock lines when they use a commercial layout. No "Last stop before", "Blue Plates", "Order of toasts" or "Dinner for two" on a kitchen, flat or family table. Fix Thor: The Dark World's doubled sentence.
3. Make the drinks fit the venue: dry drinks on Shawshank, T2, The Fugitive and X-Men. Put a champagne cocktail at Rick's, a whisky on Anchorman and a cold beer on Crocodile Dundee to match their own lines.
4. Run one word pass on non-Australian cards for "spider", "self-saucing", "self-raising", "chips" for fries, "takeaway", "fish finger", "mixed spice", "jam drops", "icebox" in London, and pavlova outside Australia and New Zealand.
5. Fix the ten period slips and six name/note mismatches listed above. Give the Pulp Fiction and Three Men and a Baby dishes a short line saying what the food is before the quip.
6. Merge doubled shopping lines (one oil, one mayonnaise, one potato, one stock) on the roughly 40 affected Prep sheets.
7. Lift Back to the Future's "Guest check" and Toy Story's "TIX" to at least 9px in the column view. Check Shawshank's canteen panels for blur on a real screen.

## Screenshots

- docs/review-50-01.png: Storm Boy phone menu at 390, first method open
- docs/review-50-02.png: Storm Boy Prep sheet at 390
- docs/review-50-03.png: Storm Boy printed card at 1280
- docs/review-50-04.png: Rocky III Prep sheet at 1280
- docs/review-50-05.png: Back to the Future card at 1280 ("Guest check" at 7.1px)
- docs/review-50-06.png: Paranormal Activity, motel layout on a house kitchen ("Blue Plates", "Pie and Sweets")
- docs/review-50-07.png: Shawshank canteen at 1280: soft panels, lager on a prison card
- docs/review-50-08.png: The Rocketeer full size view, page 3 opening on the still
- docs/review-50-09.png: Rain Man card at 1280 ("Fish finger rolls", note says fish sticks)
- docs/review-50-10.png: Back to the Future card preview at 390
