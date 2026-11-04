# Menu sweep report: shared-d

Data note for the lead: on the shared layouts the printed base menu comes from data/recipes/<slug>.json, not data/recipes2. Renamed or swapped dishes showed next to their old selves until that file matched, so data/recipes/ is committed for every film changed here (rebuilt from recipes2 and the card, keeping the old method text for plain renames). Other teams will hit the same thing.

## Changed
- An American Werewolf in London (1981): pork 3 of 5. Ploughman's (ham, pork pie) swapped for East Proctor beer-battered haddock with mushy peas. Scotch eggs and shepherd's pie named for the pub and the moors.
- Blade (1998): beef 3 of 5. Beef skewers now Silver stake garlic prawn skewers.
- Beerfest (2006): "honor" to "honour" in the note. Main flag left (see below).
- Terminator 2 (1991): beef 3 of 4. Border run empanadas now chicken. The note promised nachos that aren't on the menu, now the quesadillas.
- Free Willy (1993): seafood 4 of 5. Night run fish tacos swapped for Jesse's park kiosk chilli cheese dogs.
- Young Einstein (1988): no veg. Cider pork chops come with buttered beans; apple pie and pork named for the farm.
- Knocked Up (2007): 1 main. Added Roommates' pepperoni and hot honey pizza (the note promises pizza). House snack now potato skins so it doesn't repeat the pizza.
- The Lion King (1994): no veg, mousse in starters. Mousse moved to sweets, Hakuna Matata chakalaka added, Bobotie and Mandazi named, icing sugar. Showtime cue now serves the grub mousse.
- Mulan (1998): pork 4 of 5. Vegetable spring rolls, Imperial City red-braised chicken with bok choy for the pork belly, mooncakes named. Honour, spring onion pancakes.
- Blue Beetle (2023): pork 3 of 5. Chicharrones (a 9 hour cook) swapped for Milagro's chunky guacamole and totopos. Armoured. House queso fundido now poblano, not chorizo.
- Blade Runner 2049 (2017): pork 3 of 5. Gyoza now mushroom and tofu.
- Screwed (2000): 1 main, and the Chicken Hole had no chicken. Added Rusty's Chicken Hole fried chicken with slaw.
- Beverly Hills Cop II (1987): plain "Pierogi" now Axel's Detroit pierogi. Pork flag left (see below).
- Dirty Work (1998): 1 main, no veg. Added Sam's barbecue chicken with corn and slaw (the note has Sam on the barbecue).
- Ghostbusters (2016): pork 4 of 5. Vegetable spring rolls, sweet and sour now chicken from Zhu's downstairs, fortune cookies named, shrimp to prawn.
- Independence Day (1996): 1 main. Added Captain Hiller's cookout cheeseburgers.
- Mary Poppins (1964): beef 3 of 5. Pie and mash swapped for Mr Banks's chicken and leek pie. Granita named.
- Tangled (2010): no veg, two sweets in starters. Apple crisps now Maximus's crisp apple and fennel salad, cupcakes to sweets, hazelnut soup named for Mother Gothel.
- Miracle on 34th Street (1994): both starters were sweets. Donut holes swapped for Dorey's New York Waldorf salad, gingerbread to sweets, "Kriss" to "Kris", Mom to Mum.
- Noelle (2019): candy cane bark to sweets; starter tacos now prawn so it isn't all chicken. Main flag left (family roast).
- Hot Fuzz (2007): pork 3 of 5. Pork and apple rolls swapped for Greater good cheddar and leek rarebit. House snack was a second pork pie (the ploughman's has one), now crisps and pickled onions.
- Idiocracy (2006): 1 main. Added Camacho's monster meatball subs.
- Mother's Day (2016): 1 main. Added Atlanta fried chicken and waffles; notes shortened so the placemat keeps them. Mum.
- My Big Fat Greek Wedding (2002): 1 main. Added Nick's chicken souvlaki and village salad, priced under the lamb.
- Eurovision (2020): Harbor to Harbour. Main flag left (harbour pub, one hot plate).
- Raya and the Last Dragon (2021): seafood is right for Boun's Shrimp Boat (venue name kept). Shrimp to prawn in sign, note, prop and congee.
- Two Hands, National Lampoon's Vacation, Big Daddy: spelling only (spring onion, fairy floss, icing sugar). Flags are false alarms.

## Left as false alarms
- Two Hands: "seafood" counts potato scallops. Two seafood dishes.
- Grandma's Boy, Horrible Bosses, A Star Is Born, Dr. No, Friday the 13th Part 2, Les Misérables, Rocky V, I Love You Man, Pineapple Express, Major League, Beerfest (bartab, 1 main): bars and an inn with one hot plate. The bartab layout also hides every note on page 1 once a fourth line goes on (tried on Beerfest, all notes vanished). Needs the NOTES.md fix first.
- Aquaman, Point Break, Jurassic World Rebirth (seafood): lighthouse kitchen, beach shack, sea-sample expedition. Each has meat too.
- National Lampoon's Vacation, Wayne's World 2, Kicking & Screaming (1 main): theme park snack bar, festival stand, sideline stand.
- About Time, The Heat, Big Daddy, Noelle (1 main): home dinners built round one main.
- Storm Boy (1 main): Coorong shack, fish and chips is the meal.
- The Avengers (1 main): the Shawarma Joint sells shawarma, that's the joke.
- Beverly Hills Cop II (pork): two dishes carry a little bacon; beef main, veg on the card.
- The Silence of the Lambs (chicken): the liver pâté is the film's liver gag; lamb carries the main.
- The Other Guys, Mission: Impossible Fallout, Saw II, Alien 3 (1 main): desk lunch, the curry the note promises, the night-shift pot, the one cottage pie the T line is about.
- Nightmare on Elm Street 3, Alien: Resurrection, Austin Powers, Spy (1 main): ward tray, the crew stew the note talks about, one sixties steak Diane, basement cafe pasta.
- Peter Rabbit (1 main): McGregor's veg patch, a vegetable pie is right.
- Strange Brew (1 main): brewery pub, poutine is the plate.

## Code issues
See sweep/NOTES.md.

## Review step
No agent-spawning tool in this session, so no separate reviewer was run. Every changed film was rendered before and after with sweep-shot and checked by hand; fixes from that pass are in the last two commits.
