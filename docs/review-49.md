# Review 49

Independent score of what Reel Dinner prints, branch fix/review-49. I judged the cards, phone menus, prep sheets and film pages only. I did not open the handoff notes, the audit ops folder, earlier reviews or the git log.

## What I looked at

1. **Full dump of all 1,000 cards** with `scripts/dump-cards.cjs` (photos off), in two lanes of 500, run one after the other. No card failed to render. I swept every printed face, print list, phone menu and prep sheet with Python for:
   - em and en dashes, and spaced hyphens or double hyphens used as dashes
   - the length and shape of dish notes (6,967 notes on the 903 shared cards)
   - prices by layout, decade and currency
   - alcohol on kids, family, Christmas and wizard cards
   - period words checked against the year each card is set
   - card wording against phone wording
   - duplicate lines in the shopping lists, and American words in the recipes
   - plain bought drinks
   - stock layout lines that don't suit the venue
   - dish names that don't match their notes
2. **About 125 cards read dish by dish:**
   - two random draws (15 from the first half of the list and 30 from all 1,000)
   - 26 Australian cards
   - British cards (An American Werewolf in London, Shaun of the Dead, Hot Fuzz, Kingsman, Paddington, Paddington 2, Lock Stock, Goldfinger, Notting Hill)
   - kids and Christmas cards (Matilda, Madagascar, Inside Out, Monsters Inc, Scrooged, Christmas Vacation, Jingle All the Way, Arthur Christmas, A Christmas Story, Annie, Casper, Harry Potter)
   - prisons and messes (Shawshank, Tango & Cash, Face/Off, Green Mile, Aliens, Paddington 2)
   - the hand-built one-offs: The Godfather, Die Hard, Back to the Future, The Big Lebowski, Pulp Fiction, Lady and the Tramp, Rain Man, Home Alone, Elf, Ghostbusters, Anchorman
3. **Live site, 18 films at 1280x800 and 390x844:** The Godfather, Die Hard, Back to the Future, The Big Lebowski, Pulp Fiction, Lady and the Tramp, Rain Man, Kung Fu Panda 2, Roger Rabbit, Crocodile Dundee, Paddington, Harry Potter and the Philosopher's Stone, Shawshank, Elf, Storm Boy, Toy Story, The Castle and Hot Fuzz. For each one I checked the printed card in the column, the phone menu with the first method opened, and the Prep sheet at both sizes. I measured page overflow and the smallest print size on screen.
4. **Full size view at 1280x800 for one film per shared layout:** all 40 layouts in `data/film-format.json`, including the hospital (Rain Man), dim sum (Kung Fu Panda 2) and candy bar (Roger Rabbit). For each film I:
   - opened `openMenuZoom()`
   - stepped back to page 1 and turned every page
   - recorded which card text lands inside each page
   - listed any text that shows on no page
   - checked where the column view opens and how big the dishes print there
5. **40 random film pages** checked against their cards: venue line, dish names, notes, extra dishes, dashes.

Screenshots:
- review-49-01.png: hospital full size, page 1
- review-49-02.png: dim sum order sheet, page 2
- review-49-03.png: candy bar page 2, a poster-only page
- review-49-04.png: stadium page 4, the dishes
- review-49-05.png: cafe full size opening on the poster side
- review-49-06.png: Elf desktop column with the fine print
- review-49-07.png: Storm Boy phone method
- review-49-08.png: The Castle phone menu
- review-49-09.png: Rain Man phone Prep sheet
- review-49-10.png: Die Hard desktop Prep sheet

## Overall: 9.2 / 10

| Area | Score | Why |
|---|---|---|
| True to the film | 9.5 | The film details are spot on almost everywhere: Lou's Cafe on Saturday November 5 1955 with "No Pepsi Free", Star Lanes at 5227 Santa Monica Blvd, the toothpick count of 246, "Keep the change, you filthy animal" on a $11.80 order, the rock hammer rocky road. |
| Dish notes | 9.1 | Notes are tight and even, 28 to 99 characters on every one of 6,967. A handful describe a different dish from the name, which is why it isn't higher. |
| Prices | 9.5 | Every outlier in the sweep was a deliberate one: a reward, a tab total, $1,250 a head at The Menu, the $86,000 sirloin. Pence, cents, coins, credits, gold pieces and lei all sit in the right worlds. |
| Template wording that suits the venue | 8.7 | Most layouts now bend to the venue (Man of Steel's diner card reads "Dinner at six, Seconds on the stove"). The club layout's "Small Plates" heading and a few stock lines still land in the wrong places. |
| Period-correct food | 9.2 | Clean on most cards. The remaining slips are mostly the club heading plus a few modern menu terms on old cards. |
| Words that fit the setting and no dashes | 9.4 | No em or en dash on any of the 1,000 cards, phone menus or prep sheets. A few cards print "alcohol-free beer" or "alcohol-free stout", which reads like a label rather than a menu. |
| Desktop readability at 1280 | 9.0 | All 40 layouts show every part of the card on some page of the full size view, and the hospital, dim sum and candy bar now open on dishes at 21 to 28px. A few smaller gaps remain (item 7). |
| Phone menu at 390 | 9.0 | No sideways overflow on any of 18 films, and every method opens with times, ingredients and numbered steps. Storm Boy's display font is close to unreadable. |
| Prep sheet and shopping list | 9.4 | Australian shopping words throughout (capsicum, eggplant, caster sugar, thickened cream), clear make-ahead lines and timings. Three shopping lists still double up an item. |
| Film pages | 9.6 | All 40 pages match their cards: venue line, every dish name, every note, no extra dishes, no dashes. The one drift is the Return of the King drink, which comes from the card itself. |

## What is strong

- **The hand-built one-offs are the best thing on the site.**
  - Die Hard: the Nakatomi Christmas party is laid out as a floor directory with Argyle's limo number.
  - Pulp Fiction: the $5 Martin & Lewis shake, "No bourbon", and the Douglas Sirk steak "Bloody as hell".
  - Anchorman: a TV rundown with "Milk was a bad choice".
  - Rain Man: a tick-box meal order with "Hand to the duty nurse".

  Every one of these reads like a real object from the film.
- **Australian cards sound right without leaning on slang.** The Castle's Bonnie Doon kabana and pool room prawns, Mad Max's dim sims "milk bar style", Two Hands' potato scallops with chicken salt, Wolf Creek's servo dim sims and Bundy and dry, Top End Wedding's Mindil Beach laksa cups and NT Draught.
- **Kids, Christmas and wizard cards are clean on alcohol.**
  - Eggnog is cooked custard.
  - Scrooged's pudding is soaked in orange juice.
  - Harry Potter has pumpkin juice.
  - Kids cards print "Soft drinks only".

  The only alcohol words left on a wizard card are the two Lord of the Rings lines in item 1.
- **Every layout is complete in the full size view.** All 40 shared layouts show every part of the card on some page (only the 37-character still caption on the food court misses out), so the header, poster, notes, cue and fine print are all reachable. The column views open on dishes at 14 to 28px for 37 of the 40 layouts.
- **The phone menu is solid.** Every method opens in place. Extras say "On the menu, not in tonight's five. Tick it on the Prep sheet to cook it too." Recipes use Australian words even under American dish names.
- **The film pages are a faithful copy of the cards,** with the venue line, notes and recipes all matching.

## What holds it back

1. **The printed card and the phone menu disagree on the drink.** On these cards the dish was made alcohol-free in the recipe, but the printed card kept the old wording:

   | Film | Printed card says | Phone and recipe say |
   |---|---|---|
   | The Return of the King | "Pale ale over honey ginger syrup and lemon" | "Pale ginger beer" |
   | The Two Towers | "Rabbit or chicken stewed with alcohol-free beer" | ginger beer |
   | The Hobbit: Battle of the Five Armies | "Bag End hot spiced apple cider" | "apple juice" |
   | Miracle on 34th Street | "Hot spiced cider" | "Hot spiced apple juice" |
   | Friday the 13th | "Counsellors' cabin shandy... alcohol-free lager" | "Counsellors' cabin lemon squash... Ginger beer" |
   | Violent Night | "Cold alcohol-free stout" | "Ginger beer" |
   | Muppet Treasure Island | "ginger beer grog" | "ginger beer fruit punch" |
   | Project Hail Mary | "infrared spritz" | "infrared soda spritz" |

   The Return of the King page on the site copies the ginger beer version, so the card is the odd one out.
2. **Some dish names don't match their notes.**
   - Rocky III: "Thunderlips charity cannoli: Coffee-dipped ladyfingers layered with mascarpone cream" is tiramisu.
   - Rocky III: "Venice beach fried clams: Beer-battered fried cod with cabbage and lime sour cream in corn tortillas" is fish tacos.
   - Goldfinger: "Clubhouse ham sandwiches with mustard: Buttermilk biscuits split and filled with country ham and honey butter".
   - Goldfinger: "Clubhouse prawn toasts: Sesame prawn triangles with hot mustard, smoked salmon on rye" tacks a second dish on the end.
   - Smaller ones: Free Willy's "clam chowder cups" note has no clams. Heat's "Diner coffee and pie" describes only the pie. Dumb and Dumber's "Hot pepper beef taquitos: Extra hot, the way Harry and Lloyd fix Mental's burger" doesn't describe the dish at all.
3. **The club layout prints a "Small Plates" heading on every club card,** including Casablanca (1942), Sinners (1932), Dick Tracy (1938), Temple of Doom (1935), Harlem Nights (1938), Dreamgirls and Walk Hard (1965), The Sapphires (1968) and Rocky Horror (1975). "Small plates" is a 2000s restaurant term, so it reads wrong on every period card in that layout.
4. **Stock lines that don't suit the venue:**
   - Meet the Parents (bistro layout, Byrnes family home) prints "Late service, quiet tables", "Dinner for two · 7:30 pm" and "Byrnes Family Dinner, 7 PM" on the same card: a family dinner for two at two different times.
   - Paranormal Activity (motel layout, Katie and Micah's kitchen) prints "Note from the desk" and "POST CARD", and puts espresso martinis under "Coffee and Pop".
   - Psycho's Bates Motel parlour prints "Coffee shop, open all night". The motel in the film has no restaurant; Norman sends Marion to a diner up the road.
   - The campfire layout prints "Table no." at Wolf Creek Crater Camp, Braveheart's Lanark village and the Night of the Living Dead farmhouse.
   - The hotel layout's "A tray charge applies to every order" sits on Inception's dream-level hotel bar and Lost in Translation's New York Bar.
   - The bartab layout's "Ring the bell, buy the room a round" sits on Onward, a kids card.
5. **Period slips on single cards:**
   - Wall Street (1987): "Bluestar iced coffee: Espresso over tonic water and ice". Espresso tonic is a 2010s drink.
   - Anchorman (set 1975): "Carne asada fries", a 1990s San Diego invention.
   - Three Amigos! (set 1916): "Santa Poco street corn".
   - Short Circuit (1986): "Food truck double burger".
   - Animal House (set 1962): "feta in oil and warm pita wedges".
   - Lady and the Tramp (set 1909): "Rosemary lemon soda".
   - A Christmas Story (set 1940): "loaded mashed potato bites".
   - Annie (set 1933): the header line "At home, 1982" reads as the date of the dinner. This isn't a price, form, bill or tab line, so it isn't covered by the release-year Easter egg.
6. **Storm Boy's phone menu is hard to read.** The display font for the dish names fills in the letter holes at phone size: "Coorong garlic chilli pipis" reads as a blur (review-49-07.png). The phone is meant to be the easy read, so this font needs swapping on the phone menu.
7. **Small desktop gaps:**
   - Fine print in the column: Elf's red footer prints at about 6px and Back to the Future's clock tower flyer at about 7px (review-49-06.png). Toy Story's smallest print is about 9px. Both views are a click away from full size, but at a glance the fine print is unreadable.
   - Cafe layout (Runaway Bride): the column and the full size view open on the "Left side" panel, which is a full-height poster, with the dishes below the fold (review-49-05.png).
   - Stadium layout (Rocky): the full size view has three photo and section-map pages before the dishes on page 4 of 4.
   - Candy bar layout (Roger Rabbit): page 2 of the full size view is a poster on its own (review-49-03.png).
   - Food court (Jingle All the Way): the still caption "Jingle All the Way, 1996. Film still." is the only text across all 40 layouts that shows on no page.
8. **Three shopping lists double up an item:**
   - Rush Hour: "80g egg" and "2 eggs"
   - Wayne's World: "16 slices of pepperoni (100g)" and "100g pepperoni"
   - Dr. No: "400ml tin coconut milk" and "250ml coconut milk"
9. **Plain bought house drinks that aren't the film's own drink:** "Orange soda in the can" (Con Air), "Ice-cold root beer" (The Mighty Ducks), "Root beer in a frosted mug" (Ghostbusters: Afterlife), "Gas station root beer" (Logan), "Black cherry cola" (Insidious), "Cold vanilla cream soda" (Jumanji). Drinks like Lone Star in Dazed and Confused, Vernors in Beverly Hills Cop, Big Red in Selena and Lucky Lager in La Bamba are the films' own drinks, so they're fine.
10. **On the phone, "How to make it" sometimes opens to nothing.** For a house standard with no recipe it opens to "A house standard, not part of tonight's cook." (Miracle on 34th Street's cocoa, Project Hail Mary's water). The button promises a method that isn't there.

## To reach 9.5

1. **Fix the printed card text** for the eight drinks in item 1 so the card says what the phone, the page and the recipe say. Drop the words "alcohol-free beer" and "alcohol-free stout" from printed notes and name the real drink (ginger beer, apple juice).
2. **Rewrite the six name and note mismatches** in item 2. Then run a name-against-note check across all 6,967 notes and read every hit.
3. **Swap the club layout's "Small Plates" heading** for something that suits the period on cards set before about 2000 ("From the Kitchen", "Supper", "Bites").
4. **Make the stock lines follow the venue** on the six layouts in item 4: no table numbers at camps, no front desk at homes, no coffee shop at the Bates Motel, one dinner time on Meet the Parents.
5. **Fix the single-card period slips** in item 5, and use the setting year rather than the release year in Annie's "At home" line.
6. **Give Storm Boy's phone menu a plainer dish font.**
7. **Open the cafe layout on the dish side,** and fold the candy bar's poster-only page into a page with words.
8. **Clear the three shopping list doubles,** and hide "How to make it" on house standards that have no method.
