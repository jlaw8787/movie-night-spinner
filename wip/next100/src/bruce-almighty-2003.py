# Bruce Almighty (2003). Diner layout, the Buffalo diner where Bruce parts his tomato soup.
# Sources: Wikipedia plot (Bruce_Almighty), Wikiquote (Bruce_Almighty), TV Tropes (diner, soup never eaten, coffee, Grace's grilled cheese, the moon).
# Round 1 fix 15 Nov: prime rib out; the soup is now a main with Grace's grilled cheese; half-moon pierogi for the moon date; God's note is from the white room.
FILM = {"id": "Bruce Almighty (2003)", "theme": "diner",
        "T": "Soup's on. Parting is extra.",
        "D": "A Buffalo TV reporter who blames God for his bad luck is handed God's powers for a while, and learns the job is harder than it looks.",
        "P": "Serve the tomato soup when Bruce parts his own bowl at the diner."}
FORMAT = {"format": "diner", "era": "2000s", "tone": "playful"}
PALETTE = {"dark": "#1a1d2b", "accent": "#d9412b"}
SERIES = []
FLAVOUR = {"venue": "The Buffalo Diner", "sign": "Buffalo, New York",
           "note": {"text": "Parting your soup is not a miracle, Bruce, it's a magic trick.", "by": "God", "kind": "quote"},
           "winks": ["Smite me, O mighty smiter", "Every prayer answered Yes", "Jimmy Hoffa, found on the news", "The Sabres win the Stanley Cup", "Evan's cha-cha"],
           "prop": {"kind": "receipt", "title": "Diner Check", "lines": ["One tomato soup, parted", "Not one spoonful eaten"]},
           "caption": "Bruce Almighty, trying out the powers.",
           "number": "",
           "words": {"Pie so good it ought to be a crime.": "Tomato soup worth parting.", "Left on the counter": "Overheard while mopping", "Overheard at the counter": "On the TV over the counter", "baked today": "scooped to order"}}
HOUSE = {"s": {"n": "A jar of dill pickles on the counter", "note": "Bruce never touched his soup. Have a pickle.", "meat": False},
         "d": {"n": "Bottomless drip coffee", "note": "Refills on the house. No prayer needed.", "alc": False}}
DISHES = [
 {"n": "Pulled-closer half-moon pierogi", "course": "s",
  "line": "Bruce pulls the moon closer for Grace",
  "note": "Potato and cheddar pierogi, browned onion butter.",
  "prep": 60, "cook": 38, "ahead": "Fill and shape the pierogi up to a day ahead and chill on a floured tray, or freeze; boil and fry to serve",
  "ing": [(300, "g", "plain flour, plus extra for rolling", "Pantry"), (1, "", "egg", "Dairy"), (150, "g", "sour cream, plus extra to serve", "Dairy"), (100, "g", "butter", "Dairy"), (500, "g", "floury potatoes, peeled and chopped", "Produce"), (120, "g", "vintage cheddar, grated", "Dairy"), (2, "", "brown onions, 1 finely diced, 1 thinly sliced", "Produce"), (1, "tbsp", "chives, snipped", "Produce")],
  "steps": [("Mix the flour, egg, 3 tbsp sour cream, 30g melted butter and half a teaspoon of salt into a soft dough, knead 3 minutes and rest under a bowl.", 30), ("Boil the potatoes until soft, mash with the cheddar, fry the diced onion in a little butter and stir it through. Season hard and cool.", 25), ("Roll the dough 2mm thick, cut 8cm rounds, fill each with a teaspoon of potato, fold into half moons and pinch the edges shut.", 25), ("Boil the pierogi in salted water until they float, then 1 minute more, and lift out.", 8), ("Fry the sliced onion in the rest of the butter until golden, add the pierogi and fry until crisp at the edges. Serve with sour cream and chives.", 10)]},
 {"n": "Stanley Cup Buffalo wings", "course": "s",
  "line": "Bruce makes the Sabres win the Cup",
  "note": "Hot sauce wings, blue cheese dip, celery.",
  "prep": 15, "cook": 45, "ahead": "Make the blue cheese dip up to 2 days ahead; bake the wings to serve",
  "ing": [(1.2, "kg", "chicken wings, tips off, split", "Meat"), (1, "tbsp", "baking powder", "Pantry"), (125, "ml", "Frank's RedHot sauce", "Pantry"), (60, "g", "butter", "Dairy"), (100, "g", "blue cheese, crumbled", "Dairy"), (125, "g", "sour cream", "Dairy"), (2, "tbsp", "whole-egg mayonnaise", "Pantry"), (1, "", "lemon", "Produce"), (4, "", "celery sticks, cut in batons", "Produce")],
  "steps": [("Pat the wings dry and toss with the baking powder and a teaspoon of salt.", 5), ("Bake on a rack at 220C, turning once, until crisp and golden.", 45), ("Mash the blue cheese into the sour cream, mayo and a squeeze of lemon.", 5), ("Melt the butter into the hot sauce and toss the wings through it.", 5)],
  "alt": {"veg": {"n": "Stanley Cup Buffalo cauliflower (vegetarian)", "note": "Hot sauce cauliflower, blue cheese dip, celery.", "prep": 15, "cook": 35, "ahead": "Make the dip and cut the cauliflower up to 2 days ahead; roast and toss to serve",
                  "ing": [(1, "", "cauliflower, cut in florets", "Produce"), (75, "g", "plain flour", "Pantry"), (125, "ml", "milk", "Dairy"), (125, "ml", "Frank's RedHot sauce", "Pantry"), (60, "g", "butter", "Dairy"), (100, "g", "blue cheese, crumbled", "Dairy"), (125, "g", "sour cream", "Dairy"), (4, "", "celery sticks, cut in batons", "Produce")],
                  "steps": [("Whisk the flour and milk into a batter, coat the florets and roast at 220C until crisp.", 30), ("Mix the blue cheese dip.", 5), ("Toss the cauliflower in the melted butter and hot sauce and serve with celery.", 10)]}}},
 {"n": "Red Sea tomato soup and Grace's grilled cheese", "course": "m",
  "line": "Bruce parts his tomato soup",
  "note": "Roast tomato soup, cheddar toastie on sourdough.",
  "prep": 15, "cook": 45, "ahead": "Make the soup up to 3 days ahead and reheat; toast the sandwiches to serve",
  "ing": [(1.6, "kg", "ripe tomatoes, halved", "Produce"), (1, "", "brown onion, quartered", "Produce"), (5, "", "garlic cloves", "Produce"), (3, "tbsp", "olive oil", "Pantry"), (700, "ml", "vegetable stock", "Pantry"), (1, "tsp", "brown sugar", "Pantry"), (125, "ml", "thickened cream", "Dairy"), (1, "", "small bunch basil", "Produce"), (8, "", "thick slices sourdough", "Bakery"), (200, "g", "vintage cheddar, grated", "Dairy"), (100, "g", "mozzarella, grated", "Dairy"), (50, "g", "soft butter", "Dairy")],
  "steps": [("Toss the tomatoes, onion and garlic with the oil and salt and roast at 200C until soft and blistered.", 35), ("Blend with the stock, sugar and half the basil, then simmer, stir in the cream and season.", 10), ("Fill the bread with both cheeses, butter the outsides and toast in a pan over medium heat until golden and melting.", 10), ("Ladle the soup into wide bowls, tear over the rest of the basil and serve each with a whole grilled cheese, cut corner to corner, for parting or dunking.", 5)]},
 {"n": "Every prayer answered Yes sundae", "course": "w",
  "line": "Bruce answers every prayer Yes",
  "note": "Every topping at once, under hot fudge.",
  "prep": 20, "cook": 10, "ahead": "Make the hot fudge up to a week ahead and rewarm; build the sundaes to serve",
  "ing": [(1, "l", "vanilla ice cream", "Frozen"), (150, "g", "dark chocolate, chopped", "Pantry"), (150, "ml", "thickened cream", "Dairy"), (2, "tbsp", "golden syrup", "Pantry"), (2, "", "bananas, sliced", "Produce"), (250, "g", "strawberries, halved", "Produce"), (60, "g", "salted peanuts, chopped", "Pantry"), (300, "ml", "whipped cream", "Dairy"), (4, "", "maraschino cherries", "Pantry"), (2, "tbsp", "rainbow sprinkles", "Pantry")],
  "steps": [("Heat the cream and golden syrup, pour over the chocolate and stir into a glossy fudge.", 10), ("Layer banana, strawberries and scoops of ice cream in 4 tall glasses.", 10), ("Pour over the hot fudge, then add the cream, peanuts, sprinkles and a cherry each.", 10)]},
 {"n": "Juan Valdez iced coffee", "course": "d",
  "line": "Bruce manifests himself some coffee",
  "note": "Colombian cold brew, condensed milk, ice.",
  "prep": 10, "cook": 0, "ahead": "Steep the cold brew overnight in the fridge; pour to order",
  "ing": [(80, "g", "Colombian coffee, coarsely ground", "Pantry"), (800, "ml", "cold water", "Pantry"), (120, "ml", "sweetened condensed milk", "Pantry"), (200, "ml", "milk", "Dairy"), (2, "cup", "ice cubes", "Frozen")],
  "steps": [("Stir the coffee into the cold water and leave in the fridge for 12 hours, then strain.", 4), ("Spoon condensed milk into 4 glasses and fill with ice.", 3), ("Pour over the cold brew and top with milk, then stir.", 3)]},
]
