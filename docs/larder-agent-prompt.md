# Review 34: widen the Australian larder (agent brief)

Review 34 found the Australian films drawing from one small larder: damper on 11 cards, sausage rolls, pavlova, lamingtons and party pies on 6, golden syrup dumplings on 5, billy tea on 5. Gallipoli, Wolf Creek, Mad Max 2 and Storm Boy all served golden syrup dumplings. For an Australian user that reads generic.

Josh's rule wins over any cap: the menu matches the movie. So a dish stays where it is the truest thing for that film, and goes where a food of that film's own place and time is truer. The swaps below are the plan; change a swap only if a source shows the planned food is wrong for the film, and say so.

## The swaps (dish on the card now -> what replaces it)

Do these. Each new dish is a real, exciting dish of that film's place and time, food first, cooked by a home cook for 4.

- Storm Boy (1976): the golden syrup dumplings and the billy tea -> Coorong food: Goolwa cockles (pipis) in garlic and white wine or butter, and a Coorong mullet dish (smoked or pan-fried mullet). Keep Hideaway Tom's fish and chips. The billy tea becomes a hot drink of the shack (strong tea in a tin mug is fine if named for the Coorong, or a lemon and honey cordial).
- Gallipoli (1981): the menu is now Mena Camp Mess, Egypt, 1915. "Uncle Jack's lamb roast" -> bully beef and onion hash (or bully beef rissoles) with army biscuits; golden syrup dumplings -> a Cairo bazaar sweet (basbousa or dates and halva); "billy tea" -> Mena camp brew (sweet black tea, condensed milk). The rum ration must not be sold: if it is priced, rename it to something the canteen sold (e.g. "Camp canteen lemonade") or a tot "issued, not sold" with the same recipe if no alcohol change is needed. Keep the Cairo market hummus. Anzac biscuits stay only if the card has room for them as true (they were sent from home).
- Wolf Creek (2005): golden syrup dumplings -> a roadhouse sweet of the Kimberley drive (e.g. a vanilla slice or a caramel slice from the roadhouse cabinet). Keep the damper (Mick's camp) and the barra (Broome).
- Mad Max 2 (1981): damper and golden syrup dumplings -> wasteland food from the film: the tin of Dinki-Di dog food is the film's own gag (do not serve dog food: "Dinki-Di beef stew from the tin" style, a real beef and onion stew), and the Gyro Captain's snake (a tin-cooked "snake" of rolled sausage is fine as a nod, it must be a real dish).
- Mad Max Beyond Thunderdome (1985): damper and lamingtons -> Bartertown food: pig-fat (methane pig farm) pork belly or crackling, and a Bartertown flatbread or "Crack in the Earth" kids' food of the tribe. Keep it real and good.
- The Adventures of Priscilla, Queen of the Desert (1994): damper, pavlova, sausage rolls -> food of the trip: Broken Hill (a Mario's Palace Hotel counter meal: chicken parmigiana), Coober Pedy (an underground dugout: a lamb and rosemary pie or yiros), Alice Springs / Kings Canyon (a bush tomato or wattleseed sweet, e.g. wattleseed pavlova is NOT allowed, use a wattleseed and macadamia slice). Keep any ABBA nods to names, no lyrics.
- The Sapphires (2012): damper -> Cummeragunja mission food (a johnny cake is damper again, so no): kangaroo tail stew or a corned beef and white sauce dinner of 1968. Lamingtons and party pies stay.
- Crocodile Dundee (1986): lamingtons and party pies -> the Walkabout Creek Hotel counter (a beef and Guinness pie is still a pie: use a steak sandwich with beetroot or a mixed grill) and New York (a hot dog from the street cart Mick buys, a real dish). Keep the barra.
- Crocodile Dundee II (1988): pavlova -> a Kakadu dessert (a mango and Kakadu plum fool, or a quandong crumble). Keep damper (Mick's bush camp) and barra.
- Red Dog (2011): lamingtons and sausage rolls -> Pilbara and Dampier food: Dampier prawns or a mud crab, a mine canteen steak sandwich or curried sausages from the Dampier pub. Keep the chicken salt only if it is on a chip line.
- Two Hands (1999): pavlova -> Kings Cross and Bondi 1999: a Bondi fish taco is too new; use a Kings Cross souvlaki/yiros or a Bondi Pavilion kiosk fried calamari, and a Harry's Cafe de Wheels pie with peas (a pie floater is fine: it is the Cross).
- The Dressmaker (2015): sausage rolls and party pies -> Dungatar 1951 country town: a CWA scone tray or a jellied chicken, a passionfruit sponge (Tilly's town fete).
- Phar Lap (1983): party pies -> 1930 racecourse food: a Flemington members' lawn cold lamb and mint sandwich or oysters. Keep the lamingtons.
- The Fall Guy (2024): party pies -> Sydney 2024 set catering: a Sydney rock oyster or a barbecued king prawn roll.
- Mad Max (1979): only if the card has a golden syrup or damper dish (check).

After the swaps: damper on no more than 5 cards, golden syrup dumplings on no more than 2, pavlova 3, lamingtons 3, sausage rolls 3, party pies 3, billy tea 3. Check with: `node -e "..."` over data/films.json for those words in dish names on the films with theme "aussie".

## How

1. Read the film's current card: `node scripts/card-ops.cjs find "Film (Year)" "dish name"` and the films.json entry. Read data/recipes2/<slug>.json for the shape of a recipe (ingredients with q, u, item, aisle; steps with text and min; prep_min, cook_min, make_ahead, veg, af, alt).
2. Check the film with `node scripts/audit-src.cjs plot "Film (Year)"` (slow, about 2 minutes) for any moment you name.
3. For each swap write `audit/swaps/<slug>-<n>.json` in the shape scripts/swap-dish.cjs documents at its top: {"id","old","dish":{n, note, how, shop, prep_min, cook_min, make_ahead, veg, af, ingredients, steps, alt?, vegNote?}}.
   - The note is food first, then one short film touch, under 100 characters, a capital start.
   - `how` is one paragraph for 4 people with amounts; `shop` lines "500g beef mince@Meat" with aisles Meat, Seafood, Produce, Dairy, Bakery, Pantry, Frozen, Drinks.
   - Steps carry minutes that add up to prep plus cook (plus any wait). Oven heat as "180C".
   - Meat dishes: give a vegetarian alternative in `alt.veg` (same shape, name ending " (vegetarian)") and a short `vegNote`. Alcohol: `af:false` and an `alt.af` version.
   - Keep the course (a starter replaces a starter).
   - Era: food of the film's time and place. Prices are not yours: the app prices them.
4. Rules: Australian English and spelling, no em or en dashes, no AI-sounding phrasing, family films stay family friendly, no new dishes beyond swaps. Do not run swap-dish, build-data or checks that write files. Do not edit any other file. Use /tmp/larder for scratch.

Reply with one line per swap: film, old dish -> new dish, and anything you changed from the plan and why.
