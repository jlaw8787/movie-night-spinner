# The Super Mario Bros. Movie (2023). Placemat layout, Punch-Out Pizzeria, Brooklyn. Family film: everything alcohol-free.
# Sources: Wikipedia plot (The_Super_Mario_Bros._Movie), Wikiquote (The_Super_Mario_Bros._Movie), Super Mario Wiki (Punch-Out_Pizzeria):
# the brothers watch their commercial at Punch-Out, Spike eats a slice and calls them failures, Giuseppe on the Jump Man cabinet.
FILM = {"id": "The Super Mario Bros. Movie (2023)", "theme": "kids",
        "T": "Two plumbers. One warp pipe.",
        "D": "Two Brooklyn plumbers get sucked down a warp pipe into the Mushroom Kingdom, where Bowser has Luigi and plans to marry Princess Peach.",
        "P": "Serve the cupcakes when Peach feeds Bowser the Mini Mushroom."}
FORMAT = {"format": "placemat", "era": "modern", "tone": "playful"}
PALETTE = {"dark": "#1c1f3a", "accent": "#e3262d"}
SERIES = []
FLAVOUR = {"venue": "Punch-Out Pizzeria", "sign": "Punch-Out Pizzeria, Brooklyn",
           "note": {"text": "Ha! He got the Blue Mushroom!", "by": "Donkey Kong", "kind": "quote"},
           "winks": ["The plumbing commercial on the pizzeria TV", "Cat Mario versus Donkey Kong", "Go-karts on Rainbow Road", "Toad's Ice Flower in the bouquet", "Luigi's manhole cover shield"],
           "prop": {"kind": "badge", "title": "Super Mario Brothers", "lines": ["Plumbing, Brooklyn", "Leaky faucets fixed"]},
           "number": "",
           "words": {}}
HOUSE = {"s": {"n": "Warp Pipe breadsticks", "note": "Brooklyn sewer to Mushroom Kingdom.", "meat": False},
         "d": {"n": "Rainbow Road soda", "note": "Mind the blue shells.", "alc": False}}
DISHES = [
 {"n": "Jump Man arcade garlic knots", "course": "s",
  "line": "Giuseppe on the Jump Man cabinet",
  "note": "Garlic butter knots and marinara.",
  "prep": 20, "cook": 15, "ahead": "Tie the knots up to 4 hours ahead and keep covered in the fridge; bake to serve",
  "ing": [(500, "g", "ready-made pizza dough", "Bakery"), (60, "g", "butter, melted", "Dairy"), (3, "", "garlic cloves, crushed", "Produce"), (2, "tbsp", "parsley, chopped", "Produce"), (40, "g", "parmesan, finely grated", "Dairy"), (250, "ml", "marinara sauce", "Pantry")],
  "steps": [("Roll the dough into 12 ropes and tie each one in a loose knot.", 15), ("Bake on a lined tray at 220C until golden.", 12), ("Stir the garlic and parsley into the melted butter and brush it over the hot knots.", 3), ("Scatter with parmesan and serve with the warmed marinara.", 5)]},
 {"n": "Fire Flower arancini", "course": "s",
  "line": "Peach's Fire Flower power-up",
  "note": "Mozzarella risotto balls and spicy tomato.",
  "prep": 30, "cook": 45, "ahead": "Roll and crumb the arancini up to a day ahead and chill; fry to serve",
  "ing": [(30, "g", "butter", "Dairy"), (1, "", "brown onion, finely diced", "Produce"), (300, "g", "arborio rice", "Pantry"), (1, "l", "vegetable stock", "Pantry"), (50, "g", "parmesan, grated", "Dairy"), (100, "g", "mozzarella, cut in small cubes", "Dairy"), (75, "g", "plain flour", "Pantry"), (2, "", "eggs, beaten", "Dairy"), (120, "g", "dried breadcrumbs", "Pantry"), (1, "l", "vegetable oil, for frying", "Pantry"), (250, "ml", "passata", "Pantry"), (0.5, "tsp", "chilli flakes", "Spices")],
  "steps": [("Soften the onion in the butter, stir in the rice, then add the hot stock a ladle at a time until creamy and tender.", 25), ("Stir in the parmesan, spread on a tray and cool completely.", 10), ("Roll into balls around a cube of mozzarella, then coat in flour, egg and breadcrumbs.", 15), ("Fry in oil at 180C until deep golden.", 10), ("Simmer the passata with the chilli and serve as a dip.", 10)]},
 {"n": "Red and green pepper Brooklyn pizza", "course": "m",
  "line": "The brothers' usual at Punch-Out",
  "note": "Red peppers one half and green the other.",
  "prep": 20, "cook": 15, "ahead": "Slice the peppers and grate the cheese up to a day ahead; stretch and bake to serve",
  "ing": [(2, "", "x 250g balls pizza dough", "Bakery"), (250, "ml", "pizza sauce", "Pantry"), (300, "g", "mozzarella, grated", "Dairy"), (1, "", "red capsicum, sliced", "Produce"), (1, "", "green capsicum, sliced", "Produce"), (1, "tsp", "dried oregano", "Spices"), (1, "cup", "basil leaves", "Produce"), (2, "tbsp", "olive oil", "Pantry")],
  "steps": [("Heat the oven as hot as it goes with a tray inside.", 10), ("Stretch the dough into 2 large rounds and spread with sauce.", 5), ("Scatter with mozzarella, then red capsicum on one half and green on the other, and the oregano.", 5), ("Bake on the hot tray until blistered and bubbling.", 12), ("Finish with basil and a drizzle of oil.", 3)]},
 {"n": "Foreman Spike's meatball heroes", "course": "m",
  "line": "Spike calls them Brooklyn's favourite failures",
  "note": "Meatballs, marinara and provolone.",
  "prep": 20, "cook": 30, "ahead": "Make the meatballs and sauce up to 2 days ahead; reheat and build to serve",
  "ing": [(500, "g", "beef mince", "Meat"), (60, "g", "fresh breadcrumbs", "Bakery"), (1, "", "egg", "Dairy"), (30, "g", "parmesan, grated", "Dairy"), (2, "", "garlic cloves, crushed", "Produce"), (700, "ml", "passata", "Pantry"), (1, "tsp", "dried oregano", "Spices"), (4, "", "long crusty rolls", "Bakery"), (8, "", "slices provolone", "Dairy"), (1, "cup", "basil leaves", "Produce")],
  "steps": [("Mix the mince, breadcrumbs, egg, parmesan and half the garlic and roll into 16 balls.", 10), ("Brown the meatballs in a hot pan, then add the passata, oregano and remaining garlic and simmer until cooked through.", 25), ("Split the rolls, pile in the meatballs and sauce and lay over the provolone.", 5), ("Grill until the cheese melts, then add basil and serve.", 5)],
  "alt": {"veg": {"n": "Foreman Spike's eggplant parmigiana heroes (vegetarian)", "note": "Crumbed eggplant, marinara and provolone.", "prep": 20, "cook": 30, "ahead": "Crumb and bake the eggplant up to a day ahead; reheat and build to serve",
                  "ing": [(1, "", "large eggplant, sliced into rounds", "Produce"), (75, "g", "plain flour", "Pantry"), (2, "", "eggs, beaten", "Dairy"), (120, "g", "panko breadcrumbs", "Pantry"), (3, "tbsp", "olive oil", "Pantry"), (500, "ml", "passata", "Pantry"), (4, "", "long crusty rolls", "Bakery"), (8, "", "slices provolone", "Dairy"), (1, "cup", "basil leaves", "Produce")],
                  "steps": [("Coat the eggplant in flour, egg and panko.", 10), ("Drizzle with oil and bake at 220C, turning once, until golden.", 25), ("Warm the passata, fill the rolls with eggplant and sauce and top with provolone.", 5), ("Grill until melted and add basil.", 5)]}}},
 {"n": "Blue Mini Mushroom cupcakes", "course": "w",
  "line": "Peach feeds Bowser the Mini Mushroom",
  "note": "Blue icing and white chocolate spots.",
  "prep": 25, "cook": 20, "ahead": "Bake up to 2 days ahead and keep in a tin; ice on the day",
  "ing": [(150, "g", "soft butter, plus 125g for the icing", "Dairy"), (150, "g", "caster sugar", "Pantry"), (3, "", "eggs", "Dairy"), (175, "g", "self-raising flour", "Pantry"), (60, "ml", "milk", "Dairy"), (1, "tsp", "vanilla extract", "Pantry"), (250, "g", "icing sugar", "Pantry"), (0.5, "tsp", "blue food colouring gel", "Pantry"), (50, "g", "white chocolate melts", "Pantry")],
  "steps": [("Beat 150g butter and the sugar until pale, then beat in the eggs one at a time.", 8), ("Fold in the flour, milk and vanilla and spoon into 12 lined cupcake cases.", 5), ("Bake at 180C until springy, then cool.", 20), ("Beat the rest of the butter with the icing sugar and blue colouring, then dome it on each cupcake.", 8), ("Press on white chocolate melts for the mushroom spots.", 4)]},
 {"n": "Bowser's Peaches iced tea", "course": "d",
  "line": "Bowser sings Peaches",
  "note": "Peach iced tea, lemon and mint.",
  "prep": 10, "cook": 5, "ahead": "Brew and chill the tea up to 2 days ahead; build to order",
  "ing": [(4, "", "black tea bags", "Pantry"), (1, "l", "boiling water", "Pantry"), (400, "ml", "peach nectar", "Drinks"), (2, "tbsp", "honey", "Pantry"), (1, "", "lemon, sliced", "Produce"), (0.5, "cup", "mint leaves", "Produce"), (2, "cup", "ice cubes", "Frozen")],
  "steps": [("Steep the tea bags in the boiling water, then stir in the honey and cool.", 5), ("Mix the cold tea with the peach nectar.", 5), ("Pour over ice with lemon slices and mint.", 5)]},
]
