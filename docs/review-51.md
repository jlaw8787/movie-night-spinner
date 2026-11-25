# Review 51: what prints

## What I looked at

- A full dump of all 1,000 cards (layout, every printed face, phone menu text, Prep sheet text), run in two lanes of 500 with photos off. Swept in Python for dashes, note shape, prices by decade and currency, alcohol on dry cards, period words against the set year, footer labels against the venue and moment, doubled shopping lines, trade lines on home cards, dish names against notes, and American, British and Australian food words against where each film is set.
- About 110 cards read dish by dish: a random draw of 40, ten Australian, ten British, kids and Christmas, prison, mess and hospital, period clubs, the hand-built one-offs, and every named film on the brief (Shawshank, Terminator 2, The Fugitive, X-Men, Jerry Maguire, Casablanca, Anchorman, Crocodile Dundee, Paranormal Activity, Barbarian, Thor: The Dark World, Meet the Fockers, Easter Parade, Return of the King, Rocky III, Back to the Future, Toy Story, Home Alone, Unbreakable, Last Christmas, Office Christmas Party, Mary Poppins Returns, Man of Steel).
- Playwright at 1280x800 and 390x844 on 15 films: page overflow, smallest printed text in the menu column, the phone menu with the first method open, and the Prep sheet.
- The full size view at 1280x800 for one film in each of the 40 layouts in data/film-format.json: opened, stepped back to page 1, turned every page, and checked that every bit of card text lands on a page.
- All 1,000 film pages compared with the card (venue line, dish names, notes), plus link, image and structure checks, and 30 pages read by hand.

The Italian Job and The Silence of the Lambs were skipped. Josh's by-design calls (year Easter eggs, shop venues that don't cook, dishes from anywhere in the film, Australian spelling and shopper words, show all and cook 5, dry kids, Christmas, wizard and institutional cards) were not scored down.

## Overall: 8.2 / 10

| Area | Score | Why |
| --- | --- | --- |
| True to the film | 8.5 | Deep, specific, often very funny; a handful of plain errors and lines that point at food that is not on the card. |
| Dish notes | 8.0 | Concrete and well shaped across 7,500 dishes, but there are doubled words, a few garbled notes, and "crisp" in one note in twelve. |
| Prices | 9.0 | Right currency and right decade almost everywhere (francs, shillings, kronor, yen, cents). Only a couple of high outliers. |
| Template wording that suits the venue | 7.0 | The weakest area. Club, loyalty card, bar and diner lines land on homes, shops, offices and pre-TV settings, and some labels carry the wrong kind of moment. |
| Period-correct food | 8.0 | Mostly careful, but modern dishes and TV labels turn up in the 1920s to 1990s. |
| Words that fit where the film is set | 7.0 | Australian food words on American cards, and the phone menu rewrites American dishes on hand-built cards. Spelling slips against the Australian rule on about 70 cards. |
| Desktop readability | 8.5 | The full size view is excellent in all 40 layouts. A few hand-built cards still print flyer and receipt text under 10px in the column. |
| Phone menu | 9.0 | No overflow, methods at 16px, tabs at 12 to 13px, nothing under 11px. |
| Prep sheet and shopping list | 9.0 | 30,820 shopping lines with no doubled lines; clear method with timings. Text sits at 11 to 12px. |
| Film pages | 8.5 | Every dish name and note matches the card, no broken links, but 34 pages have no venue line and the page titles come in four formats. |

## What is strong

- The film knowledge. Father of the Bride's "George's eight-and-eight hot dogs", Pulp Fiction's "Douglas Sirk steak: Vincent's order. Bloody as hell.", Back to the Future's "Coffee, no sugar ... No Pepsi Free.", Paddington 2's pink Victoria sponge ("One red sock turned the whole prison pink"), Home Alone's "Fuller's cola: Big glass, lots of ice." These read like someone who has watched the films many times.
- The Australian and British cards are the best in the set. The Castle (moselle from the cask, rissoles, Bonnie Doon kabana), Storm Boy (Coorong pipis, billy tea), The Dish (Vegemite pinwheel scones), Ladies in Black (the 35 guinea poppy seed cake), Conjuring 2 (Maurice's fish and chips wrapped in newspaper), Snatch (pie, mash and liquor, jellied eels).
- Prices. Casablanca in francs, Goldfinger in shillings and pence, Klaus in kronor, Kill Bill in yen, Newsies in cents, Back to the Future at 1955 prices. My decade sweep flagged nothing that was really wrong, only the outliers listed below.
- The dry rule holds on kids, Christmas, wizard, hospital, school and prison cards I read (Shawshank's rooftop ginger beer, Paddington 2's "Soft drinks only", The Polar Express, Christmas Vacation's custard eggnog).
- The full size view. In all 40 layouts it opens on a dish page at 1.4x with notes at 16.7 to 24.5px. The only card text that landed on no page was one photo caption on Bad Santa ("Bad Santa, 2003. Film still."). No layout loses menu text.
- The shopping list. No doubled lines across 1,000 lists; aisles are sensible.
- The film pages carry the card's exact dish names and notes on all 7,714 dishes.
- No em or en dashes anywhere on any card, phone menu, Prep sheet or film page.

## What holds it back

1. **Footer and label lines that don't fit the venue or the moment.** This is the most visible kind of problem because these lines sit on the face of the card.
   - The club footer "Kitchen open till the last set. No discussing X at the tables." prints on 23 cards, including a record shop (Pretty in Pink, Trax Records), Megamind's Evil Lair, an office party (Office Christmas Party: "No discussing Clay's drawbridge jump at the tables"), an opera house (Revenge of the Sith) and Casablanca ("No discussing Sam at the piano at the tables"). Casablanca also prints "Members only. Watch the door" for Rick's, which was never members only.
   - The coffee loyalty card ("Ten stamps and your next cup is on us", "Ten small visits, one cup to share") prints on family homes (Juno's MacGuff Kitchen, Silver Linings' Solitano Family Kitchen, Encanto's Casa Madrigal Kitchen), a hardware store (Runaway Bride), a barbershop and Olive's webcam room (Easy A).
   - "Last call:" on all 22 bar tab cards carries the opening serving cue, for example Star Wars: "Last call: Serve the blue milk at the Lars homestead dinner table." and Road House: "Last call: Serve the snacks when Dalton gives the bouncers his three rules." Last call means the bar is closing.
   - "When the bell rings:" on 33 tavern cards reads as a dinner bell at a homestead, a hut and a study (The Witch, Miracle Max's Hut, Henry Jones's Study, the Perron farmhouse), and it doubles the "when" ("When the bell rings: Serve the mains when ...").
   - "On the big screen tonight:" at the 1976 Spectrum (Rocky), the 1943 Stark Expo (Captain America: The First Avenger), Phil's training camp in ancient Greece (Hercules) and two locker rooms (Space Jam, The Mighty Ducks). Rocky and Bloodsport also print "No refunds after the first whistle." Boxing and kumite use a bell.
   - Trade layouts left their lines on homes: Man of Steel's Kent Farm Kitchen and The Flash's Allen Family Kitchen print "THE MANAGEMENT", "ORDER UP WHEN" and "SERVED ALL DAY"; Ghost's Tribeca loft prints "The lights dim at closing. Do keep together."; Thor: The Dark World's "Jane's Flat, Greenwich" prints "The courses in procession" and "Covers laid for 4"; Grandma's Boy prints a bar tab at Grandma Lilly's House.
   - "Bar talk:" on places that are not bars: Weekend at Bernie's beach house, 50 First Dates' Hukilau Cafe, Ace Ventura 2's village hut.

2. **Australian food words on American cards, and the phone menu rewriting American dishes.**
   - Tater tots print as "crispy potato bites" on about a dozen American cards: Juno and The Mighty Ducks ("casserole under crisp crispy potato bites"), Fargo ("Potato bite hotdish bites"), Mean Girls, Close Encounters, Jingle All the Way, Can't Buy Me Love ("crunchy crispy potato bites"), Shazam! ("Crisp baked crispy potato bites"), Venom, Venom 2, Weapons.
   - On 27 hand-built cards the printed card is right and the phone menu swaps the words: Donnie Brasco's card says "Miami Garlic Shrimp", the phone says "Miami Garlic Prawns". The same happens with "scallion" to "spring onion" (Casino's Oysters Rockefeller, You've Got Mail's bagels), "breaded" to "crumbed" (Analyze This, Scarface, Mickey Blue Eyes), shrimp to prawns (Working Girl's canapés, Midnight Cowboy's coconut shrimp, Beetlejuice's "Shrimp cocktail: Chilled prawns"), and A Goofy Movie's s'mores, which go "between digestive biscuits" on the phone. The phone menu is menu copy, not the shopping list, so it should match the card.
   - Australian words in American card notes: A Nightmare on Elm Street's school coffee "brewed in a plunger", The Out-of-Towners' "jug of thickened cream", As Good as It Gets' "streaky bacon", The Graduate's "fillet steaks", Stakeout's "cod and chips" with malt vinegar in Seattle.

3. **Period slips.**
   - TV labels in pre-TV settings: It Happened One Night (1934) and Holiday Inn (1942) print "On the TV tonight:", The Rocketeer's 1938 Bulldog Cafe the same, Some Like It Hot's 1929 Seminole Ritz and The Water Diviner's 1919 Istanbul hotel print "On the TV in your room:".
   - Honey chilli, a 2010s trend, on 1980s and 1990s American cards: Scream's pizza "with pepperoni, mushrooms and honey chilli", Bull Durham's "Dugout honey chilli roasted peanuts $1.75", Major League, Jackie Brown's "honey chilli fried chicken", Mallrats, Dennis the Menace, The Muppet Movie.
   - Brioche where it did not belong yet: Elm Street's 1984 cafeteria "sloppy joes ... on toasted brioche", Shutter Island's 1954 lobster rolls "in toasted brioche", Reservoir Dogs' diner order "on brioche rolls", Con Air's 1997 burger "on brioche".
   - Others: Clueless (1995) "sushi bowls ... edamame", Once Upon a Time in America (1933) "Bagel crisps & schmear", The Sixth Sense (1999) "freeze-dried raspberries".

4. **Alcohol on workplace and prison cards.** Air's Nike canteen ("Every pair sold old fashioned: Bourbon stirred with bitters"), X-Men: Days of Future Past's Pentagon canteen ("Mystique blue margarita"), Tommy Boy's Callahan Auto Parts canteen (topped with "cold lager"), The Other Guys' precinct paperwork room ("Gator's whiskey sour"), Mission: Impossible Fallout's CIA breakroom ("White Widow's French 75") and Escape from New York's prison island ("White Lightning: Corn whiskey").

5. **Spelling slips against the Australian rule.** "yogurt" prints on 43 cards (The Big Lebowski, Inception, Zootopia, Ghostbusters II) while 138 print "yoghurt". "center" or "mold" prints on about 25 (Get Shorty's "creamy center", Christmas Vacation's "lime mold", Up's "small round molds"), and "chili" on 8 (Lethal Weapon 3, Beverly Hills Cop) against "chilli" on 449.

6. **Note slips and film errors.**
   - Hot Fuzz serves "Strawberry Cornetto cones". Strawberry is Shaun of the Dead's Cornetto (which the Shaun card gets right); Hot Fuzz is the blue original.
   - Klaus: "Pickled herring on rye crispbread: Vinegar-cured herring and dill on crisp ginger."
   - The Green Mile: "Top Hat peach cobbler: Spiced peaches under a graham cracker crust." A cobbler has a biscuit or batter topping, not a crumb crust.
   - Mary Poppins Returns' note promises "the scones are warm", and there are no scones on the card.
   - The Lego Movie's "Overpriced $37 hot chocolate". In the film it is Emmet's $37 coffee.
   - Notes that tell plot, not food: 22 Jump Street "MC State crab cakes: Crab cakes, then the golf cart ends up on the football field."; Barbarian "Welcome basket baked brie, honey walnuts: Housewarming basket, wine ribbon and nuts and all."
   - Thor: The Dark World's Frigga quote, "Eat first and quarrel after. I mean it, both of you, in front of the whole court.", is not a line I can place in the film.
   - Stock adjectives pile up: "crisp" is in 624 notes, "golden" in 249, "buttery" in 119, with doubles like Office Space's "Crisp skinned snapper ... crisp fries".

7. **Film pages.** 34 pages have no "The menu is set at" line (A Bronx Tale, Casino, Scarface, Back to the Future, Amélie, Sleepless in Seattle and the other hand-built cards). Mickey Blue Eyes names "Vito's" and Friday names "126th St. Market", but neither card prints that venue. Page titles come in four formats, and 35 of them drop the year (for example "Anchorman: The Legend of Ron Burgundy movie night menu").

8. **Desktop column on hand-built cards.** At 1280, Back to the Future's flyer and guest check print at 7.5px, with a fifth of its text under 10.1px. Toy Story and Anchorman go down to 9.7px. On Goldfinger the circled "2s 2d" price is clipped at the panel edge. The full size view fixes all of these, but the column is the first thing people see.

9. **Small price outliers.** Five westerns (Tombstone, True Grit, Unforgiven, The Good, the Bad and the Ugly, Shanghai Noon) print the same price set. Easter Parade's 1912 supper room charges $1.75 for roast lamb, which is high for 1912. Rocky's 1976 concession stand sells a $4.50 steak.

## To reach 9.5

1. Give each layout's footer and label lines a venue check. Turn off the club footer, the loyalty card, the diner "MANAGEMENT / ORDER UP" lines and the banquet procession lines when the venue is a home, shop, office or lair, and give those cards home wording. Rename "Last call:" and "Kitchen tip:" when they carry the opening cue. Drop "When the bell rings:" or give it a reason, use a bell (not a whistle) at fights, and only print "On the big screen" where a big screen fits.
2. Stop the phone menu rewording American dish names and notes on the 27 hand-built cards (shrimp, scallion, breaded, graham crackers). Print "tater tots" on American cards, and fix the listed American card notes (plunger, thickened cream, streaky bacon, fillet steaks, chips with malt vinegar).
3. Add a set-year gate for TV labels (no "On the TV" before about 1950) and for modern foods: honey chilli, brioche buns, poke bowls with edamame, bagel crisps, freeze-dried fruit.
4. Make workplace canteens, precinct breakrooms and prison settings print dry, as the institutional rule says (Air, X-Men: Days of Future Past, Tommy Boy, The Other Guys, Mission: Impossible Fallout, Escape from New York).
5. Run an Australian spelling pass on card text: yogurt to yoghurt, center to centre, mold to mould, chili to chilli, leaving film quotes as they are.
6. Fix the named note and film slips: Hot Fuzz's Cornetto, Klaus' herring, the Green Mile cobbler, the Mary Poppins Returns scones, the Lego coffee, the plot-only notes and the Thor quote. Thin out "crisp" and "golden" and catch doubles like "crisp crispy".
7. Add the venue line to the 34 hand-built film pages, make Mickey Blue Eyes and Friday name the card's venue, and use one title format with the year on every page.
8. Lift the smallest flyer and receipt text on Back to the Future, Toy Story and Anchorman to at least 10px in the desktop column, and keep Goldfinger's circled price inside its panel.
