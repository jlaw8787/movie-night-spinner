# Review 33: Reel Dinner

**Overall: 7.5 out of 10**

I read the printed menu (`.mcard`) text for 131 films, chosen to cover 38 of the 40 library layouts plus 20 of the hand-built formats: 25 Australian and New Zealand films, 16 British films, about 30 period films and 30 kids' and family films. I checked the full-size view, the phone view, the prep sheet and shopping list, a film page in `menu/<slug>/`, the cinema front and Galaxy Video, at 1280 wide and at 390 x 844. Outside images were blocked as asked, so the grey still and poster frames in the screenshots come from that block and are not counted as faults.

The app falls into two halves. The roughly 100 hand-built formats (The Godfather, Goodfellas, The Big Lebowski, Planes, Trains and Automobiles, Jurassic Park, Fried Green Tomatoes, Home Alone 2, Lady and the Tramp and more) are close to 9.5 already: the venues, quotes, prices and jokes are right and the wording reads as if someone wrote it for that one film. The other 900 films use about 40 shared layouts, and that is where most of the faults are. Template wording doesn't suit the venue, the price ladders are wrong, notes open with the film touch and only then say what the dish is, and the prices sometimes belong to the wrong era. The prep sheet, shopping list, phone view and front end are strong. The shared-layout menus hold the score down.

## What is strong

- **The hand-built formats are excellent.** The Godfather's Louis' menu (review-33-11) has 1940s prices, Genco Pura olive oil, "Police officers dine here often" and a family dinner at $2.50. The Big Lebowski (review-33-12) has the Shabbos coffee brisket, Larry's homework cookies at 0.99 and "Careful, man, there's a beverage here!" Home Alone 2 carries the real $967.43 room bill. Goldfinger's golf card adds up both ways (1305 yards, £1 11s 4d). Back to the Future has Saturday 5 November 1955, which is correct.
- **Money and era are mostly right.** Pre-decimal pence for The Man from Snowy River, Gallipoli, Phar Lap and The Dressmaker. "2/11" style for Ladies in Black. Shillings for Oliver!, Mary Poppins and The Italian Job. Francs for Casablanca, yen for Spirited Away, soles for Paddington in Peru, kronur for Eurovision, galleons for Harry Potter, credits for Star Wars.
- **Running totals add up.** Two Hands ($47.25 then $60.75), Top Gun ($37.00 then $45.75), Star Wars (53 then 70 credits), Raiders (Rs 8 then Rs 11) and Goldfinger all check out.
- **The prep sheet and shopping list are first rate** (review-33-14). Quantities roll up correctly across dishes: Muriel's Wedding shows 420g butter (20g plus 400g) and 3 lemons (2 plus 1). Every step has a time, every dish has a make-ahead line, grog goes in its own "Bottle shop" aisle, and there is a tip to make each cocktail alcohol free. Gallipoli's Anzac biscuits and golden syrup dumplings are proper recipes.
- **The phone view opens on food you can read** (review-33-13). It shows the venue, a tagline, section tabs, then large dish names and notes with "How to make it" under each one.
- **Australian food is handled with real care.** Musk sticks and Cheerios with tomato sauce as pairings, chicken salt, potato scallops, Bundy and dry, lamingtons, billy tea, hundreds and thousands, lollies.
- **No em dashes** turned up in any rendered menu, prep sheet or film page I read. The only ones in the code are inside the regexes that strip them out (`menu-formats/*.js`), plus two `wip/*/tmdb.json` files that are never served.
- **Galaxy Video** (review-33-15) and the cinema front look polished and hold together on both screen sizes, and no script errors came up anywhere.

## What holds it back

1. **Template wording that doesn't suit the venue.** This is the biggest single fault, because it repeats across hundreds of films.
   - The pub layout prints "EST." plus the film's release year: The Black Prince in Kingsman says "EST. 2014" (review-33-09), the Winchester in Shaun of the Dead "EST. 2004", the Crown in Hot Fuzz "EST. 2007", the Walkabout Creek Hotel in Crocodile Dundee "EST. 1986", the Husavik Harbour Pub "EST. 2020". The diner layout does the same with 1943: Flo's V8 Cafe in Cars and the Frosty Palace in Grease are both "Est. 1943". Halloween (1978) prints "Est. 1978".
   - The kiosk layout's weather strip shows "TEMP 27 C, Sunny with a chance of fun" for Happy Feet, which is set in Antarctica (review-33-02).
   - The tearoom layout turns the Snuggly Duckling, Tangled's pub full of thugs, into "The Tea Room, top floor. Open 10 till 5. Afternoon tea from 3. Children's tea served with a wink" (review-33-08). Up's Fredricksen house gets "Morning tea from 10. Luncheon at 12."
   - The diner layout's "ASK ABOUT PIE" box offers the pepperberry kangaroo in Priscilla and a burger in Grease, and Grease then says "Ask about today's pie" when the pie case holds a sundae and coconut ice. Uncle Buck prints "a slice from The griddle", with a stray capital.
   - The bistro layout gives Pamela's turkey curry buffet in Bridget Jones "RESERVED, Table 2, for two, 8:00 pm". The café layout puts a "TANIA" stamp on Muriel's loyalty card and "HIROS / FREDS / HONEY" stamps on Big Hero 6's.

2. **Notes that start with the film touch or leave out the dish.** The house rule is dish first, then the film touch. Several layouts break it on almost every line:
   - American Graffiti (review-33-07): "Vic offers Toad a knuckle sandwich. Pulled ham hock on soft rolls..." and "Toad lost his ID in a flood. Kentucky bourbon and Coca-Cola."
   - Gone with the Wind: "Scarlett swears she'll never go hungry. Crisp radishes..." Spirited Away: "Haku gives Chihiro rice balls. Salted rice balls..." The Dressmaker: "Tilly's red dress at the footy final. Beef and black pepper pies..." The same happens in Monty Python and the Holy Grail, The Italian Job, Collateral, The Fast and the Furious, Hancock and Straight Outta Compton ("We N.W.A. They Ruthless. Chilli, cheddar.").
   - Many notes never say what the dish is: Kenny "Spicy fried chicken with pickles: Nashville, home of the Sushi Cowboy". Monsters, Inc. "Monstropolis miso ramen: Dinner after a shift on the scare floor". Skyfall "Fifty year old single malt: Silva pours it. Don't stand near the glass." Kingsman "Round table rib roast and Yorkshires: Dinner with Arthur and the knights of the agency". Others: Boy's hot chips, Finding Nemo's scrolls, Raiders' "Hot from the fire. Ask Toht's hand.", Screwed's gizzards, Blade Runner's yakitori, Danger Close's caramel pork and satay.
   - Some notes only repeat the dish name: Muriel's "Fairy bread triangles: Fairy bread, buttered with hundreds and thousands". The Wog Boy "Get tzatziki with it...: Tzatziki and taramasalata with warm pita. Get tzatziki with it." Better Off Dead "It's got raisins in it: ...It's got raisins in it".
   - Some film touches get used twice on one card: "how's the serenity" twice in The Castle, "Waterloo" twice in Muriel's Wedding, "Bobby won't eat without Tommy" twice in Phar Lap, and Rico's paso doble twice in Strictly Ballroom.

3. **Prices out of order and out of era.**
   - Snacks cost as much as meals: The Other Guys spinach dip $2.25 against bagel bites $7.75, with pineapple juice at $8.75, dearer than any sweet (review-33-06). Happy Feet parmesan puffs $7.50 against calamari $3.00. Monsters, Inc. snow cone $5.75, dearer than the sushi. Kingsman cheddar dog biscuits £7.25 and a London gin martini at £2.75, the cheapest thing on the card. Crocodile Dundee lamingtons $3.50 against rum and ginger beer $1.25. Goldfinger vintage champagne 2s 5d against a mint julep at 5s 5d. Home Alone mac and cheese $14.25, dearer than a large pizza at $11.80.
   - Wrong era: Up prices a roast sirloin dinner at 85¢ in a film set in 2009 (review-33-04). Cars has 30¢ curly fries in 2006. American Graffiti mixes 35¢ onion rings with $2.95 chilli dogs in 1962. Jumanji is numbered "1969" but uses 1995 prices. Dumb and Dumber prints lobster surf and turf at $5.50. Caddyshack prints prime rib at $3.95 at a 1980 country club.
   - Wrong money: Matilda (1996) is set in America, but the Crunchem Hall canteen charges in pounds (review-33-05). Raya prices congee at 35¢. Lock, Stock prints "Bacon's full English £6.25" with a note saying "One price, ten pound" (review-33-03), and the IOU reads "500000" with no £ sign or commas.
   - The "movie night for two" deals in the takeaway layout don't add up: Blade Runner's $13.50 bag covers dishes worth about $24 each way, and Screwed's $24.50 covers about $44. Caddyshack's yards column stops matching its prices at hole 4 (135 yards against $3.25) and at 19B (65 against $1.75).

4. **Wrong facts and made-up quotes.**
   - Muriel's Wedding prints "Mariel's wedding cake" on the menu, the prep sheet and in `data/films.json` (review-33-01).
   - Jumanji: The Next Level gives Fridge the cake weakness ("I am not blowing up again"). In that film it belongs to Mouse, as the jelly note on the same card says.
   - Many lines in quote marks are invented and then credited to a character, for example Muriel's "I'm done being a loser", Dory's "I made dinner, I think", Rose's note in Titanic, the Prime Minister's line in Love Actually, Captain Renault's in Casablanca and Spicoli's in Fast Times. They read as if they were real quotes. If they stay, they need to be clearly labelled as notes, not quotes.
   - Wrong-place food: flathead in a California mall (Fast Times) and at a medieval moat (The Sword in the Stone), chipotle barra tacos and jalapeño chips in 1970s Dampier (Red Dog), a tequila paloma in a 1930 Randwick pub (Phar Lap), an espresso martini in 1980 (Airplane!), and Turkish bread in a 1986 outback pub (Crocodile Dundee). Raiders puts Cairo dates and koshari in a Nepal bar.

5. **US spellings and kids' film words.**
   - "Crisp oat and coconut cookies" for Anzac biscuits in Gallipoli (review-33-10) is the worst one.
   - Also: "mom" in Hairspray ("Edna Turnblad, mom in the laundry") and three times in Better Off Dead, "gelatin" in Better Off Dead and in two dish names in the data, "DOG LICENSE" in Lady and the Tramp, "gray" in narration lines (Matrix porridge, "Not gray water" lemonade). "Cookies" also turns up where "biscuits" would read better (Blade Runner, Thunderbolts, Screwed), and Dumb and Dumber has "snowflake cookies" described as "sugar biscuits" on the same line.
   - Kids' films are mostly clean, but Wreck-It Ralph prints "beer" three times ("Root beer on tap since 1983", "Root beer from the tap"), and the "No alcohol served" footers on kids' cards contain the word alcohol themselves. If the rule is strict, change these to plain wording such as "Soft drinks only".

6. **Visual polish on the shared layouts.**
   - On a 1280 screen the menu card is about 590 px wide and dish notes come out at about 7 px (review-33-02, review-33-08). The full-size view is better but still small until you press plus (review-33-01).
   - The overlap checker flagged layered text on 40 of 131 cards. Most of it is stamps and tickets laid over text on purpose. Real crowding shows on The Dish header (title, subhead and ration line pressed together and partly clipped by the frame), on the "Chow Line" title in the campfire layout (Wolf Creek, Shrek, Prince Caspian) and on the tavern titles (The Prancing Pony, Camelot, Sir Ector's).
   - On the phone, the café layout's pale italic script (Muriel's Wedding) is low contrast against white.

7. **Small slips on the film pages.** `menu/the-castle-1997/` files The Castle under "Drama" and lists "More drama film menus", but it is a comedy (review-33-16). Otherwise the page is clean and useful, with the menu preview, recipes for 4, make-ahead notes and a serve cue.

## What it would take to reach 9.5

1. **Go through every shared layout's fixed wording** and make each line either neutral or driven by the film. Remove "EST. <release year>" and "Est. 1943". Gate the kiosk weather strip and the tearoom opening hours on the setting. Rewrite the diner's "Ask about pie" box so it only appears when there is pie. I would call this the most valuable single fix.
2. **Run a pass on every note that opens with a character or plot line, or that has no ingredients in it,** and rewrite it as dish first, then film touch. A simple check (the first clause names a character from the cast list, or the note has no food word) would find most of them in the 900 shared-layout films.
3. **Add a price sanity rule per menu:** snacks below mains, sweets below mains, ordinary drinks below mains, and a price level set from the setting year, not the release year. Matilda, Up, Cars, American Graffiti, Jumanji, Dumb and Dumber, Caddyshack, The Other Guys and Kingsman are good test cases. Make the "for two" bundles a real discount on the actual sum.
4. **Fix the clear errors:** Mariel, the Lock, Stock "ten pound" note and IOU, Fridge and the cake, and the anachronistic or wrong-place dishes listed above.
5. **Mark invented lines as notes, not quotes,** or swap them for real lines from the film.
6. **Run an Australian English pass** over printed text (cookies to biscuits where it isn't an American setting, mom, gelatin, license, gray), and decide on the root beer and "No alcohol served" wording for kids' films.
7. **Make the desktop menu card larger or raise the minimum note size,** and clear the header crowding on the lab, campfire and tavern layouts.

The hand-built menus show the standard is there. If the shared layouts reach the same level, the app would hit 9.5.
