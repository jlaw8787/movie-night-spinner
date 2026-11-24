# Reel Dinner, review 48

## What I looked at

- A full dump of what all 1,000 cards print (`scripts/dump-cards.cjs`, 0 to 500 and 500 to 500, photos off): layout, every card face, the print list, the phone menu text and the prep sheet text. All 1,000 loaded with no errors.
- Python sweeps over the dump: note length and shape (6,967 notes), dashes, prices by layout, decade and currency, Australian words on American cards, alcohol on kids, family, Christmas and wizard cards, release-year stamps in stock lines, anachronisms against the year the card says it is set, card against phone wording, shopping list duplicates, plain bought drinks.
- About 125 cards read dish by dish: all five Indiana Jones, all eight Harry Potter (Philosopher's Stone, Chamber, Azkaban, Goblet, Phoenix, Half-Blood Prince, both Hallows), all three Fantastic Beasts, John Wick: Chapter 4, Ocean's Eleven and Twelve, Walk the Line, Spider-Man: Far From Home, Little Shop of Horrors, Get Out, The Flash, Man of Steel, Onward, Iron Man 3, Scream, True Romance, two random draws of 30, eleven Australian cards, prisons and messes (Shawshank, Green Mile, Great Escape, Paddington 2, Tango & Cash, Suicide Squad, Stripes, Italian Job), British cards (Hot Fuzz, Shaun of the Dead, Notting Hill, Bridget Jones, Love Actually), kids and Christmas (Toy Story, Finding Nemo, Shrek, Polar Express, Elf, Home Alone, Home Alone 2) and hand-built one-offs (Godfather, Die Hard, Back to the Future, Big Lebowski, Pulp Fiction, Lady and the Tramp, Rain Man).
- The live site on a local server with Playwright at 1280x800 and 390x844 for 15 films: printed card, phone menu with a method open, Prep sheet. The full size view opened at 1280 on one film for each of the 39 shared layouts, every page turned, plus a second pass from page 1 for the ones that looked wrong.
- 40 random film pages under `menu/<slug>/index.html` checked against their cards (dish names and notes).

Screenshots: `review-48-01.png` (Pulp Fiction phone, broken "s" heading), `review-48-02.png` (Rain Man whole card), `review-48-03.png` (Rain Man full size view, left side only), `review-48-04.png` (Kung Fu Panda 2 first screen at 1280), `review-48-05.png` (Kung Fu Panda 2 full size page 2 of 4), `review-48-06.png` (Roger Rabbit whole card; the middle column never shows full size).

## Overall: 6.8 / 10

| Area | Score | Why |
|---|---|---|
| True to the film | 5.5 | The film knowledge is deep, but about three cards in four still pull dishes from other scenes and places onto the one venue. |
| Dish notes | 8.5 | 6,967 notes, all one or two sentences, average 68 characters, nearly all lead with the food; a handful lead with the film or describe nothing. |
| Prices | 8.5 | Currency and decade are right almost everywhere and homes, messes and prisons print none; a few magic or private venues still charge. |
| Template wording that suits the venue | 6.0 | 303 cards stamp the release year into a form or bill number, and layouts carry diner, bar, lab and cinema lines into homes, shops and castles. |
| Period-correct food | 8.0 | Mostly sound; a few real slips (Granny Smith in 1885 California, chocolate chips in 1910, espresso martini in 1969). |
| Words that fit the setting and no dashes | 8.5 | Zero dashes in 1,000 cards; American cards mostly use American words, with a few Australian words and species left in. |
| Desktop readability at 1280 | 6.5 | Most layouts read well, but hospital, dim sum and candy bar full size views never show parts of the card, and dim sum opens on a slice. |
| Phone menu at 390 | 8.5 | Clean tabs, methods open well, wording matches the card; two films lose their venue heading. |
| Prep sheet and shopping list | 8.5 | Clear, timed, well grouped; only a couple of near-duplicates and some bought drinks padding the plan. |
| Film pages | 9.0 | 40 of 40 pages match their cards dish for dish and note for note. |

## What is strong

- No dashes anywhere. Not one em or en dash in any face, phone menu or prep sheet across 1,000 cards.
- Notes have a settled, good shape. "Golden syrup and lemon tart in sweet shortcrust." "Cornmeal crusted green tomato slices fried golden, with a mayo dip." Short, food first, at most one touch of the film.
- Prices are handled with real care. Lou's Cafe 1955 prints "CHEESEBURGER 35¢", Nepal prints "Rs 1", Rio prints "R$ 7,75", Sweden "15 kr", 1960s Britain "1s 2d", Kung Fu Panda "5 coins". Prisons, messes, homes and camps print nothing.
- Kids, Christmas and wizard cards print no alcohol. Where a beer might go, the card says "alcohol-free stout" or swaps to juice.
- The hand-built one-offs are the best thing on the site. Die Hard's Nakatomi party sheet ("Air handling, thirtieth floor. Guests, please keep out of the ducts.") and Back to the Future's Lou's Cafe ("COFFEE, NO SUGAR 5¢ Black, nothing added. No Pepsi Free.") are exactly one venue on one night.
- Australian cards sound right. Crocodile Dundee's "Steak sandwich with the lot", Storm Boy's "Coorong garlic chilli pipis", The Castle's "Sal's rissoles".
- Phone menu and prep sheet are solid tools. Methods read cleanly at 390, the prep sheet groups the shopping by aisle and gives make-ahead notes.
- Film pages are faithful to the cards.

## What holds it back

1. **One venue, one night is still broken on most cards.** The card names a venue, then the dishes walk round the whole film. Examples:
   - True Romance, "Clarence's Comic Shop": "Ambassador Hotel club sandwich and fries", "Little Detroit Coney dogs", "Diner cherry pie ... a bite offered across the diner table", "Cancún beach margarita". A comic shop with a candy case and a bar.
   - Indiana Jones and the Temple of Doom, "Club Obi Wan, Shanghai's finest nightclub": "Maharaja's lamb curry", "Mayapore village thali", "Chilled mango brains". That is the Pankot Palace banquet, not Shanghai.
   - Raiders of the Lost Ark, "The Raven ... Patan, Nepal": "Not-bad dates" (Cairo) and "Golden idol gruyère cheese puffs" (Peru).
   - Man of Steel, "Kent Farm Kitchen": "Fishing trawler fish bites", "Roadside bar buffalo chicken tenders", "Daily Planet chicken club sandwich", "Cold bottle of beer ... best not poured over anyone".
   - The Incredible Hulk, "Rocinha Soda Factory": "Culver campus pepperoni and mushroom pizza ... to slip past the guard". Virginia, on a Rio card.
   - John Wick: Chapter 4, "The Osaka Continental": "Steak frites", "Croissant pudding", "Cognac sidecar", and the foot line names "The Marquis de Gramont. The long stairs to the final duel." That is Paris.
   - The Lord of the Rings: The Return of the King, "Minas Tirith Citadel": "Green Dragon chicken and leek pie ... for four hobbits home again", "Shire strawberries", "Sam's wedding cake".
   - Home Alone, "Little Nero's": "Mac and cheese dinner ... Heated up all by himself", "The giant sundae ... Built in front of Angels with Filthy Souls". That is the house, not the pizza shop.
   - Iron Man 3, "Harley's Garage": "Malibu mansion shrimp", "Pepper's giant Christmas bunny cake".
   - Blade Runner 2049, "Sapper's Protein Farm": "Joi's rib eye", "Deckard's Scotch and honey highball", "Snowfall panna cotta ... K's last scene".
   - Rain Man, "Wallbrook Cafeteria" patient meal order: "Vegas buffet shrimp", "$86,000 Caesars Palace sirloin".
   - Walk the Line, "Folsom State Prison": "John keeps snatching June's peanut".
   - The Shawshank Redemption, "Shawshank Prison Mess Hall": "Rooftop ginger beer shandy: Cold lager topped with ginger beer". Beer in a prison mess.
   - Australian cards too: The Dish, "Parkes Radio Telescope": "Country pub steak sandwich ... the country pub way", "Sweet sherry ... The ambassador's glass while the band plays Hawaii Five-0". Kenny, "Splashdown Depot": "Melbourne Cup marquee canapés", "Spicy fried chicken ... Southern style".
   In my two random draws, about 25 of the first 30 and 20 of the second 30 had at least one dish from another place or scene.

2. **The venue in the header does not match the card's own food.** Scream's venue is "Woodsboro Video Store", but the dishes are "Stu's party lasagne" and "Woodsboro house party punch". Little Shop of Horrors is "Mushnik's Skid Row Florist" with "Venus flytrap tacos" and "Audrey II meatballs" under "Open every day". A florist does not cook.

3. **Stock lines that do not suit the venue.**
   - 303 cards stamp the film's release year into a form or bill line, which reads as the venue's year: Walk the Line "Form CF-1968. 2005.", Kingdom of the Crystal Skull "Form CF-1957. 2008.", Fantastic Beasts "Shop sheet 1926, rev. 2016.", Prisoner of Azkaban "Bill No. 04, 2004.", Emperor's New Groove "Coin of the realm only. Bill No. 2000.", Road to Perdition "Form 2002. Printed in Illinois, 1931."
   - Diner lines in homes: Man of Steel "Kent Farm Kitchen ... Open every day ... Hot coffee, homemade pie, a seat at the table." The Flash "ALLEN FAMILY KITCHEN ... Open every day ... Made fresh every morning."
   - Lab lines in castles and magic rooms: Deathly Hallows Part 2, Room of Requirement, "Form LAB11, rev. 2011. Return tray to the hatch. Rations subject to supply." Young Frankenstein "Form LAB74, rev. 1974. Return tray to the hatch."
   - Bar lines in a house: I Love You, Man, "Sydney's Man Cave": "Laser printed in house. Tab No. 09. 2009."
   - Food truck lines on a houseboat: Oliver & Company, "Fagin's Houseboat": "Today's Board / Till the last plate goes."
   - Bistro "Carte no." on private homes: Get Out "Carte no. 2017.", Bridget Jones "Carte no. 2001." on Una Alconbury's turkey curry buffet.
   - Orient Express in 1963: "Write your order on the check." An American word on a European train.

4. **Full size view at 1280 hides parts of some layouts.** The desktop pages for these layouts only cover the dish block:
   - Hospital (8 films). Rain Man opens as "Left side" and "Right side" of the tick box only (558 by 574 px). The header "Wallbrook Cafeteria / Dr Bruner's patients · Meal order / PATIENT: RAYMOND BABBITT", the poster, "Scenes to watch for", the nurse's note, the showtime cue and the toothpick slip never appear. See `review-48-02.png` against `review-48-03.png`.
   - Dim sum (4 films). Kung Fu Panda 2's first screen at 1280 shows a slice reading only "ORDER SHEET / NO. DISH / SMALL PLATES / A1 Gongmen salt and pepper prawns / A2 Bean bun warrior buns" at poster size, with no notes, prices or tick boxes (`review-48-04.png`). The full size view opens on "PAGE 2 OF 4", and pages 2 to 4 are 384 px slivers cut off at the right edge, repeating names already on page 1 (`review-48-05.png`).
   - Candy bar (23 films). Roger Rabbit's middle column ("From the booth" note, "Toontown pass", "Tonight" cue) sits outside every page (`review-48-06.png`).

5. **A few prices where nobody pays.** The Polar Express prints "Polar Express turkey and cranberry rolls 30¢" and "Write your order on the check. Prices subject to change." The hot chocolate on that train is free in the film. Ocean's Twelve's private "Lake Como Villa Terrace" prints euros and "Service included." Rise of the Guardians, "North's Workshop", prints "3.65 c". Thor: Ragnarok prints dollars on Sakaar.

6. **Period slips.** Back to the Future Part III, Hill Valley 1885: "Double crust Granny Smith apple pie" (that apple did not reach the US for nearly a century). Lady and the Tramp, Tony's, dog licence 1910: "Cannoli ... chocolate chips" and "Garlic bread". Men in Black 3, 1969: "Black suit espresso martini". Little Shop of Horrors: "Vanilla Coke from the fountain". The Dish, 1969: "Cheese and yeast spread scrolls".

7. **Words that do not fit.** My Best Friend's Wedding (Chicago): "an eschalot and cracked pepper dressing". The Notebook (South Carolina): "Blue swimmer crab cakes". Goblet of Fire: "Snapper, mussels and prawns in saffron broth" for a Beauxbatons bouillabaisse. The Incredible Hulk (Rio, otherwise American wording): "coriander". After Hours (New York diner): "Chips alongside".

8. **Thin or mismatched dishes.** About 40 drinks are a bought thing poured: "Cold bottle of beer", "Neat shot of rye whiskey", "Bottomless fountain soda", "Coffee, black", "Cold whole milk with a straw". Home Alone's "Fuller's cola" is "Chill the cola in the fridge overnight", which drives the prep sheet's "start 3 hr 20 min earlier, for waiting". A Quiet Place's "Soft vanilla custard" note is "Pears poached in sugar syrup under a quiet spoonful of custard". Raiders' "Not-bad dates" note says "stuffed with almonds, wrapped in bacon", but the method uses goat's cheese and prosciutto. The Rock's "VX green pea arancini" note is "Goodspeed's little green glass beads, the ones nobody can drop." and says nothing about the food. Blade Runner 2049's "Roasted garlic bulbs with sourdough" note is just "Sapper's garlic, grown just for himself." Deathly Hallows Part 2: "Lamb and coffee stew over mash :: Lamb stewed with coffee, over mash."

9. **Two phone menus lose their venue heading.** Pulp Fiction's phone menu heading is a lone "s" above the script title (`review-48-01.png`), and Kung Fu Panda's is a lone "r".

10. **Same snacks everywhere.** Pretzels show up on 82 cards, popcorn on 80, devilled eggs on 41, blinis on 33, choux or gruyère cheese puffs on about 40. Deathly Hallows Part 1 has "Salmon blinis and cheese puffs ... packed for the road" in a tent on the run.

## To reach 9.5

1. Run a one-venue pass on every card: for each dish, ask "is this sold or served at the named venue on the named night?" Cut or rename every dish whose name or note points at another place (another city, house, school, bar, scene). Start with the worst: True Romance, Temple of Doom, Raiders, Man of Steel, Incredible Hulk, John Wick 4, Return of the King, Home Alone, Iron Man 3, Blade Runner 2049, Rain Man, Shawshank, The Dish, Kenny.
2. Where the film's food happens across many places, pick the one venue the food happens at and rename the card to it (Home Alone: the McCallister kitchen; Scream: Stu's house; Little Shop: the Skid Row diner or Mushnik's back room, not a florist that cooks).
3. Remove the release year from form, bill and tab numbers on any card set in another year, or use the setting year. 303 cards carry it.
4. Give each layout's stock lines a venue check: no "Open every day" or "Made fresh every morning" on homes, no "Return tray to the hatch" outside real canteens and labs, no "Tab No." in houses, no "Carte no." on private dinners, no "Today's Board" on boats and garages.
5. Fix the full size view for the hospital, dim sum and candy bar layouts so every part of the card appears on some page, and make the dim sum desktop preview open on the whole order sheet, not a slice.
6. Strip prices from the Polar Express, North's Workshop, the Lake Como villa and any other venue where nobody pays.
7. Fix the period slips listed in point 6 and the setting words in point 7.
8. Replace poured-from-the-bottle drinks with something made, or move them to the extras, and rewrite the notes that describe nothing or describe a different dish.
9. Fix the Pulp Fiction and Kung Fu Panda phone headings.
10. Thin out the repeat snacks (pretzels, popcorn, devilled eggs, blinis, gougères) so each card's starters feel like that venue's own.
