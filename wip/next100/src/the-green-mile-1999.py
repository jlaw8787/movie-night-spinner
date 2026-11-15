# The Green Mile (1999). Canteen layout, Cold Mountain Penitentiary, the death row block, 1935.
# Sources: Wikipedia plot (The_Green_Mile_(film)), Wikiquote (The_Green_Mile_(film)), TV Tropes Prisoner's Last Meal (John Coffey's last meal in the film:
# meatloaf, mashed potatoes with gravy, okra, and cornbread from Mrs Edgecomb).
FILM = {"id": "The Green Mile (1999)", "theme": "soul",
        "T": "Miracles happen in the most unexpected places.",
        "D": "A death row guard in 1935 comes to believe the gentle giant on his block can heal, and that he never committed the crime he is set to die for.",
        "P": "Serve the meatloaf when John Coffey gets his last meal."}
FORMAT = {"format": "canteen", "era": "1930s-40s", "tone": "tender"}
PALETTE = {"dark": "#17201a", "accent": "#8fae6b"}
SERIES = []
FLAVOUR = {"venue": "Cold Mountain Penitentiary", "sign": "Cold Mountain Penitentiary, Louisiana, 1935",
           "note": {"text": "I'm tired, boss.", "by": "John Coffey", "kind": "quote"},
           "winks": ["Old Sparky", "Mr Jingles and Mouseville", "Dead man walking", "Briar Ridge for Percy", "Melinda Moores, made well"],
           "prop": {"kind": "slip", "title": "Last Meal", "lines": ["Meatloaf, mash and gravy", "Okra and cornbread"]},
           "number": "1935",
           "words": {}}
HOUSE = {"s": {"n": "Salted peanuts for the night shift", "note": "For whoever's sitting the desk on the Mile.", "meat": False},
         "d": {"n": "Coffee, black", "note": "Like the drink, only not spelled the same.", "alc": False}}
DISHES = [
 {"n": "Mrs Edgecomb's cornbread with honey butter", "course": "s",
  "line": "Wild Bill only wanted a little corn bread",
  "note": "Skillet cornbread, whipped honey butter.",
  "prep": 15, "cook": 25, "ahead": "Bake up to a day ahead and warm in the oven; beat the honey butter up to a week ahead",
  "ing": [(150, "g", "fine cornmeal (polenta)", "Pantry"), (125, "g", "plain flour", "Pantry"), (2, "tbsp", "caster sugar", "Pantry"), (2, "tsp", "baking powder", "Pantry"), (0.5, "tsp", "bicarb soda", "Pantry"), (300, "ml", "buttermilk", "Dairy"), (2, "", "eggs", "Dairy"), (120, "g", "butter, plus 80g soft butter for the honey butter", "Dairy"), (2, "tbsp", "honey", "Pantry"), (0.5, "tsp", "sea salt flakes", "Pantry")],
  "steps": [("Heat a 23cm cast iron pan in a 220C oven with 20g of the butter in it.", 5), ("Whisk the dry ingredients with a good pinch of salt, then whisk in the buttermilk, eggs and 100g melted butter.", 5), ("Pour into the hot pan and bake until golden and a skewer comes out clean.", 22), ("Beat the soft butter with the honey and salt flakes and serve with the warm cornbread.", 5)]},
 {"n": "Cornmeal fried okra with comeback sauce", "course": "s",
  "line": "John Coffey's last meal had okra",
  "note": "Crisp cornmeal okra, spicy comeback sauce.",
  "prep": 15, "cook": 15, "ahead": "Mix the comeback sauce up to 3 days ahead; fry the okra to serve",
  "ing": [(400, "g", "fresh okra, sliced thickly", "Produce"), (250, "ml", "buttermilk", "Dairy"), (100, "g", "fine cornmeal (polenta)", "Pantry"), (50, "g", "plain flour", "Pantry"), (1, "tsp", "smoked paprika", "Spices"), (750, "ml", "vegetable oil, for frying", "Pantry"), (125, "g", "whole-egg mayonnaise", "Pantry"), (2, "tbsp", "tomato sauce", "Pantry"), (1, "tsp", "hot sauce", "Pantry"), (1, "", "lemon", "Produce")],
  "steps": [("Stir the mayonnaise, tomato sauce, hot sauce and a squeeze of lemon into a comeback sauce.", 3), ("Soak the okra in the buttermilk while you mix the cornmeal, flour, paprika and salt.", 5), ("Toss the okra in the cornmeal mix to coat well.", 5), ("Fry in batches in oil at 180C until crisp and golden, then drain and salt.", 12), ("Serve hot with the sauce.", 2)]},
 {"n": "Mr Jingles' pimento cheese and crackers", "course": "s",
  "line": "Mr Jingles is somehow still alive",
  "note": "Sharp cheddar, roast capsicum, crackers.",
  "prep": 15, "cook": 0, "ahead": "Make up to 3 days ahead and keep covered in the fridge",
  "ing": [(250, "g", "vintage cheddar, grated", "Dairy"), (100, "g", "cream cheese, softened", "Dairy"), (80, "g", "whole-egg mayonnaise", "Pantry"), (100, "g", "roasted red capsicum, finely chopped", "Pantry"), (0.5, "tsp", "smoked paprika", "Spices"), (1, "tsp", "hot sauce", "Pantry"), (1, "", "box small salted crackers", "Pantry"), (2, "", "celery sticks, cut in batons", "Produce")],
  "steps": [("Beat the cream cheese and mayonnaise until smooth.", 4), ("Fold in the cheddar, capsicum, paprika and hot sauce and season with pepper.", 6), ("Pile into a bowl and serve with the crackers and celery.", 5)]},
 {"n": "Last meal meatloaf with mash and gravy", "course": "m",
  "line": "The meal before John walks the Mile",
  "note": "Glazed meatloaf, buttery mash, onion gravy.",
  "prep": 25, "cook": 90, "ahead": "Shape the meatloaf up to a day ahead and chill; bake and make the mash to serve",
  "ing": [(800, "g", "beef and pork mince", "Meat"), (1, "", "brown onion, grated, plus 1 sliced for the gravy", "Produce"), (60, "g", "fresh breadcrumbs", "Bakery"), (125, "ml", "milk", "Dairy"), (1, "", "egg", "Dairy"), (2, "tsp", "dried thyme", "Spices"), (125, "ml", "tomato sauce", "Pantry"), (2, "tbsp", "brown sugar", "Pantry"), (1, "tbsp", "apple cider vinegar", "Pantry"), (1, "kg", "floury potatoes", "Produce"), (80, "g", "butter", "Dairy"), (2, "tbsp", "plain flour", "Pantry"), (500, "ml", "beef stock", "Pantry"), (1, "", "bunch silverbeet, shredded", "Produce")],
  "steps": [("Soak the breadcrumbs in the milk, then mix with the mince, grated onion, egg, thyme and plenty of salt and pepper.", 10), ("Shape into a loaf on a lined tray, stir the tomato sauce, sugar and vinegar together and brush half over.", 5), ("Bake at 180C for 1 hour, brushing on the rest of the glaze halfway, then rest it.", 60), ("Boil the potatoes until tender, then mash with half the butter and a splash of the milk.", 25), ("Fry the sliced onion in the rest of the butter until brown, stir in the flour, then whisk in the stock and simmer into gravy.", 12), ("Wilt the silverbeet in a hot pan, slice the meatloaf thickly and serve with the mash, gravy and greens.", 5)],
  "alt": {"veg": {"n": "Last meal lentil and mushroom loaf with mash and gravy (vegetarian)", "note": "Glazed lentil loaf, buttery mash, onion gravy.", "prep": 25, "cook": 60, "ahead": "Shape the loaf up to a day ahead and chill; bake and make the mash to serve",
                  "ing": [(2, "", "x 400g tins brown lentils, drained", "Pantry"), (250, "g", "mushrooms, finely chopped", "Produce"), (1, "", "brown onion, grated, plus 1 sliced for the gravy", "Produce"), (80, "g", "fresh breadcrumbs", "Bakery"), (2, "", "eggs", "Dairy"), (100, "g", "cheddar, grated", "Dairy"), (125, "ml", "tomato sauce", "Pantry"), (2, "tbsp", "brown sugar", "Pantry"), (1, "kg", "floury potatoes", "Produce"), (80, "g", "butter", "Dairy"), (2, "tbsp", "plain flour", "Pantry"), (500, "ml", "vegetable stock", "Pantry")],
                  "steps": [("Fry the mushrooms and grated onion until dry, then mash half the lentils and mix everything with the crumbs, eggs and cheese.", 15), ("Pack into a lined loaf tin, glaze with the tomato sauce and sugar and bake at 180C until firm.", 45), ("Make the mash and the onion gravy as the loaf bakes.", 20), ("Slice and serve with the mash and gravy.", 5)]}}},
 {"n": "Top Hat peach cobbler with vanilla ice cream", "course": "w",
  "line": "John's first picture show is Top Hat",
  "note": "Bubbling spiced peaches, buttermilk biscuit crust.",
  "prep": 20, "cook": 40, "ahead": "Mix the dry topping up to 2 days ahead; assemble and bake to serve",
  "ing": [(2, "", "x 825g tins sliced peaches, drained", "Pantry"), (100, "g", "brown sugar", "Pantry"), (1, "tsp", "ground cinnamon", "Spices"), (1, "tbsp", "cornflour", "Pantry"), (1, "", "lemon, juiced", "Produce"), (200, "g", "self-raising flour", "Pantry"), (60, "g", "caster sugar", "Pantry"), (90, "g", "cold butter, cubed", "Dairy"), (180, "ml", "buttermilk", "Dairy"), (1, "l", "vanilla ice cream", "Frozen")],
  "steps": [("Toss the peaches with the brown sugar, cinnamon, cornflour and lemon juice in a baking dish.", 5), ("Rub the butter into the flour and caster sugar, then stir in the buttermilk to a soft dough.", 8), ("Drop spoonfuls of dough over the peaches, leaving gaps for the juice to bubble through.", 5), ("Bake at 190C until the topping is golden and the fruit is bubbling.", 38), ("Rest for 5 minutes and serve warm with the ice cream.", 5)]},
 {"n": "Faded limes cooler", "course": "d",
  "line": "A floor the colour of faded limes",
  "note": "Lime, mint, raw sugar and soda.",
  "prep": 10, "cook": 0, "ahead": "Make the lime syrup up to 3 days ahead; build to order",
  "ing": [(6, "", "limes", "Produce"), (100, "g", "raw sugar", "Pantry"), (100, "ml", "water", "Pantry"), (1, "cup", "mint leaves", "Produce"), (750, "ml", "soda water, chilled", "Drinks"), (2, "cup", "ice cubes", "Frozen")],
  "steps": [("Heat the sugar and water with strips of lime peel until dissolved, then cool and strain.", 5), ("Squeeze the limes and stir the juice into the syrup.", 2), ("Pour over ice and mint in 4 glasses and top with soda.", 3)]},
]
