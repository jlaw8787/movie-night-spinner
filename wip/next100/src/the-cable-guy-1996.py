# The Cable Guy (1996). Tavern layout, Medieval Times dinner and tournament.
# Sources: Wikipedia plot (The_Cable_Guy), Wikiquote (The_Cable_Guy), Medievalists.net on the Medieval Times menu
# (tomato bisque, roasted chicken, sweet buttered corn, herb-basted potatoes, pastry of the castle).
FILM = {"id": "The Cable Guy (1996)", "theme": "street",
        "T": "There's no such thing as a free dinner.",
        "D": "A lonely cable installer decides his newest customer is going to be his best friend, whether he likes it or not.",
        "P": "Bring out the chicken when Steven asks the serving wench for a fork."}
FORMAT = {"format": "tavern", "era": "1990s", "tone": "playful"}
PALETTE = {"dark": "#1d1b2e", "accent": "#d4a017"}
SERIES = []
FLAVOUR = {"venue": "Medieval Times", "sign": "Medieval Times Dinner and Tournament",
           "note": {"text": "Dude, I got a lot of tables.", "by": "Melinda, the serving wench", "kind": "quote"},
           "winks": ["Chip and Steven in the joust", "Chicken skin mask: Hello, Clarice", "Chip's karaoke at the apartment party", "The showdown on the satellite dish", "Chip's sitcom names, like Larry Tate"],
           "prop": {"kind": "ticket", "title": "Medieval Times", "lines": ["Blue knight section", "No utensils issued"]},
           "number": "50",
           "words": {}}
HOUSE = {"s": {"n": "Garlic bread, torn by hand", "note": "There were no utensils in medieval times.", "meat": False},
         "d": {"n": "A Pepsi, refilled", "note": "No utensils, but there was Pepsi.", "alc": False}}
DISHES = [
 {"n": "Roast tomato bisque, drunk from the bowl", "course": "s",
  "line": "No utensils at Medieval Times",
  "note": "Roast tomato, cream and basil oil.",
  "prep": 15, "cook": 45, "ahead": "Make the soup up to 3 days ahead and reheat; make the basil oil on the day",
  "ing": [(1.2, "kg", "ripe tomatoes, halved", "Produce"), (1, "", "brown onion, quartered", "Produce"), (4, "", "garlic cloves, unpeeled", "Produce"), (3, "tbsp", "olive oil", "Pantry"), (500, "ml", "vegetable stock", "Pantry"), (1, "tsp", "caster sugar", "Pantry"), (150, "ml", "thickened cream", "Dairy"), (1, "cup", "basil leaves", "Produce"), (60, "ml", "extra virgin olive oil", "Pantry")],
  "steps": [("Toss the tomatoes, onion and garlic with the olive oil and salt and roast at 220C until soft and charred at the edges.", 35), ("Squeeze the garlic from its skins and blend everything with the stock and sugar until smooth.", 6), ("Warm through, stir in the cream and season.", 6), ("Blitz the basil with the extra virgin oil and a pinch of salt, and swirl over the soup in mugs.", 8), ("Hand it over in mugs or bowls you can drink from. No spoons.", 5)]},
 {"n": "Hello Clarice chicken skin crackling", "course": "s",
  "line": "Chip asks Steven for his chicken skin",
  "note": "Crisp chicken skin, hot honey, lemon salt.",
  "prep": 10, "cook": 25, "ahead": "Bake the crackling up to a day ahead and keep airtight; warm and drizzle to serve",
  "ing": [(400, "g", "chicken skin, from the butcher", "Meat"), (1, "tsp", "sea salt flakes", "Pantry"), (1, "", "lemon, zested", "Produce"), (3, "tbsp", "honey", "Pantry"), (1, "tsp", "chilli flakes", "Spices"), (1, "tsp", "smoked paprika", "Spices")],
  "steps": [("Scrape any fat from the skin, lay it flat between 2 sheets of baking paper on a tray and weigh it down with a second tray.", 8), ("Bake at 200C until golden and crisp right through, then drain on paper towel.", 22), ("Rub the salt with the lemon zest and paprika, and warm the honey with the chilli.", 3), ("Break into shards, drizzle with hot honey and sprinkle with the lemon salt.", 2)],
  "alt": {"veg": {"n": "Hello Clarice rice paper crackling (vegetarian)", "note": "Puffed rice paper, hot honey, lemon salt.", "prep": 10, "cook": 10, "ahead": "Fry up to a day ahead and keep airtight",
                  "ing": [(12, "", "rice paper sheets, quartered", "Pantry"), (500, "ml", "vegetable oil", "Pantry"), (1, "tsp", "sea salt flakes", "Pantry"), (1, "", "lemon, zested", "Produce"), (3, "tbsp", "honey", "Pantry"), (1, "tsp", "chilli flakes", "Spices")],
                  "steps": [("Heat the oil to 180C and fry the rice paper a few pieces at a time until puffed, a few seconds each.", 10), ("Rub the salt with the lemon zest and warm the honey with the chilli.", 4), ("Drizzle and sprinkle to serve.", 3)]}}},
 {"n": "Tournament roast chicken with buttered corn", "course": "m",
  "line": "Steven asks for a knife or fork",
  "note": "Herb-basted chicken, potatoes and sweet corn.",
  "prep": 20, "cook": 70, "ahead": "Rub the chicken with the herb butter up to a day ahead and chill uncovered; roast to serve",
  "ing": [(1, "", "whole chicken, about 1.8kg", "Meat"), (80, "g", "butter, softened", "Dairy"), (3, "", "garlic cloves, crushed", "Produce"), (2, "tbsp", "thyme and rosemary, chopped", "Produce"), (1, "", "lemon", "Produce"), (800, "g", "small potatoes, halved", "Produce"), (2, "tbsp", "olive oil", "Pantry"), (4, "", "corn cobs, halved", "Produce"), (1, "tsp", "smoked paprika", "Spices")],
  "steps": [("Mash 50g butter with the garlic, herbs and lemon zest and push it under and over the chicken skin. Put the halved lemon inside.", 12), ("Toss the potatoes with the oil and salt around the chicken in a big roasting tin.", 5), ("Roast at 200C, basting with the pan juices twice, until the juices run clear and the potatoes are golden.", 65), ("Boil the corn for 6 minutes, then roll in the rest of the butter with the paprika and salt.", 8)],
  "alt": {"veg": {"n": "Tournament roast cauliflower with buttered corn (vegetarian)", "note": "Herb-basted whole cauliflower, potatoes, corn.", "prep": 15, "cook": 60, "ahead": "Make the herb butter up to 3 days ahead; roast on the day",
                  "ing": [(1, "", "whole cauliflower, leaves trimmed", "Produce"), (80, "g", "butter, softened", "Dairy"), (3, "", "garlic cloves, crushed", "Produce"), (2, "tbsp", "thyme and rosemary, chopped", "Produce"), (1, "", "lemon", "Produce"), (800, "g", "small potatoes, halved", "Produce"), (2, "tbsp", "olive oil", "Pantry"), (4, "", "corn cobs, halved", "Produce"), (1, "tsp", "smoked paprika", "Spices")],
                  "steps": [("Boil the whole cauliflower for 8 minutes and drain well.", 12), ("Spread with 50g herb, garlic and lemon butter and roast at 200C with the oiled potatoes, basting twice, until deep golden.", 50), ("Boil the corn and roll in the rest of the butter with paprika.", 8)]}}},
 {"n": "Pastry of the castle", "course": "w",
  "line": "Chip gave all the knights free cable",
  "note": "Apple turnovers, cinnamon sugar, cream.",
  "prep": 20, "cook": 25, "ahead": "Cook the apple filling up to 2 days ahead; fill and bake to serve",
  "ing": [(3, "", "Granny Smith apples, peeled and diced", "Produce"), (40, "g", "butter", "Dairy"), (60, "g", "brown sugar", "Pantry"), (1, "tsp", "ground cinnamon", "Spices"), (1, "", "lemon, juiced", "Produce"), (2, "", "sheets frozen puff pastry, thawed", "Frozen"), (1, "", "egg, beaten", "Dairy"), (2, "tbsp", "raw sugar", "Pantry"), (200, "ml", "thickened cream", "Dairy")],
  "steps": [("Cook the apples in the butter with the brown sugar, half the cinnamon and the lemon juice until soft and sticky, then cool.", 12), ("Cut each pastry sheet into 4 squares, spoon apple onto each, fold into triangles and press the edges with a fork.", 8), ("Brush with egg, sprinkle with raw sugar and the rest of the cinnamon and bake at 200C until puffed and golden.", 20), ("Whip the cream softly and serve with the warm turnovers.", 5)]},
 {"n": "A mug of ale for me and me mate", "course": "d",
  "line": "Chip orders ale for him and his mate",
  "note": "Pale ale, cloudy apple, honey and lemon.",
  "prep": 10, "cook": 0, "ahead": "Make the honey syrup up to a week ahead; chill the ale and juice well",
  "ing": [(4, "", "x 375ml cans pale ale", "Bottle shop"), (250, "ml", "cloudy apple juice", "Drinks"), (3, "tbsp", "honey", "Pantry"), (2, "tbsp", "hot water", "Pantry"), (1, "", "lemon, cut in wedges", "Produce")],
  "steps": [("Stir the honey into the hot water and let it cool.", 4), ("Divide the apple juice and honey syrup between 4 big mugs or tankards.", 2), ("Top slowly with the cold ale and squeeze in a lemon wedge.", 4)],
  "alt": {"af": {"n": "A mug of ale for me and me mate (alcohol-free)", "note": "Alcohol-free ale, cloudy apple, honey and lemon.", "prep": 10, "cook": 0, "ahead": "Make the honey syrup ahead; chill the alcohol-free ale well",
                 "ing": [(4, "", "x 330ml bottles alcohol-free pale ale", "Drinks"), (250, "ml", "cloudy apple juice", "Drinks"), (3, "tbsp", "honey", "Pantry"), (2, "tbsp", "hot water", "Pantry"), (1, "", "lemon, cut in wedges", "Produce")],
                 "steps": [("Dissolve the honey in the hot water and cool.", 4), ("Divide the juice and syrup between 4 mugs.", 2), ("Top with the alcohol-free ale and a squeeze of lemon.", 4)]}}},
]
