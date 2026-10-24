# Dish overhaul brief

You are improving the dishes on a movie-night menu site. Each film has a menu for four people: snacks (s), mains (m), dessert (w) and a drink (d). Every dish should come from a real food moment, setting or character in the film. The owner is a trade-qualified chef and ran restaurants for 15 years, so he can spot weak food straight away.

## The problem
Too many dishes are vague or are a pun rather than food. Examples: "Rug crackers", "Half and half dip", "Milk and cookies", "Bowling alley nachos" with nothing special about them. Each one should read as a complete, exciting dish or snack: something you would be pumped to serve on movie night, with nostalgia, fun and some pop.

## What a good dish looks like
- **name**: a film reference is welcome as long as it's obvious what the food is.
  - Good: "Royale with cheese sliders", "Rug-pattern paprika lavash crackers", "Big Kahuna teriyaki pineapple burger".
  - Bad: "Rug crackers", "Snacks", "Movie treat".
  - Keep the name under about 42 characters.
- **note**: one short line tying it to the moment in the film, e.g. "It really tied the room together". It must be true to the film. Don't invent scenes.
- **desc**: one menu-style sentence of 12 to 28 words. Say what's in it, how it's cooked and what it comes with, including the sauce, dip, crunch or garnish that gives it pop. It should read like a good restaurant menu line.
- **how4**: the exact method for four people, with real quantities, temperatures and times, in clear steps written as sentences. Use metric and Australian ingredient names (capsicum, coriander, caster sugar, plain flour, mince, prawns). It has to actually work. Keep it 40 to 120 words.
- **shop4**: the shopping list for how4. Each entry is "quantity item@Aisle". Aisle must be one of: Meat, Seafood, Deli, Produce, Dairy, Bakery, Frozen, Pantry, Drinks, Bottle shop.

## Rules
1. Review every dish of every film in your batch files.
2. Rewrite a dish when its name is vague, a pun without food, a plain grocery item (e.g. "Black coffee", "Milk and cookies", "Popcorn"), or something too basic to be exciting.
3. Leave a dish alone when it's already a complete, appealing dish with a proper method. Don't churn good work.
4. Keep the dish's link to the film. You can swap a dish for a better one from the same film moment or setting.
5. Keep the course. Keep each film to its current number of dishes.
6. The drink (d) can be a cocktail, mocktail, shake, punch or proper brew. Make it special.
7. Kids and family films (theme kids, fairytale, or obviously family films) must stay alcohol-free.
8. Keep seafood dishes as seafood.
9. Never use em dashes or en dashes. Use commas or "to".
10. No song lyrics. No real brand names like McDonald's, KFC, Coca-Cola or Pepsi. Fictional film brands are fine.
11. Plain Australian English. No marketing fluff and no AI-sounding phrasing ("elevate", "indulge", "perfect for", "delight").
12. If a film has `"edition": true`, its dishes are already detailed. Only fix clear weak spots.

## Output
For each batch file you are given, write one JSON Lines file next to it named `out_XX.jsonl` (same number as the batch). Write one line per film that you changed. Skip films you didn't change.

```
{"film":"The Big Lebowski (1998)","dishes":[{"course":"s","old":"Rug crackers","name":"...","note":"...","desc":"...","how4":"...","shop4":["120g lavash@Bakery", "..."]}]}
```

- `old` must be the exact current dish name from the batch file.
- Include only the dishes you changed. Every changed dish needs all six fields: course, old, name, note, desc, how4, shop4.
- New names must be unique within the film.
- Append each film's line as you finish it, so your progress is saved if you're interrupted.

When you finish, run this check and fix anything it reports:

```
python3 /tmp/claude-0/-home-claude/6d06a22c-2024-50a8-a2d1-a12880d59711/scratchpad/dishwork/check.py out_XX.jsonl
```

Finish with a short summary: films reviewed, dishes changed, and three before and after examples.

## Creative direction (from the owner, applies to everything)
Think like a chef-owner with the energy of modern cool, fun food culture: Momofuku-style big flavour and playful twists on classics, Animal-style unapologetic comfort food, Merivale-style venue vibes and theatre, Kogi-style street food mash-ups.
- **Big hits of flavour:** sauces, crunch, char, pickles, chilli, umami. Use high-low mash-ups, like a classic film dish done the way a cool modern venue would serve it.
- **The secret sauce:** strong movie ties and nostalgia. Each dish should feel like it walked out of that film. That's what ties the whole room together.
- **Easter eggs are huge.** Hide details fans will spot, for example:
  - a price that is a famous number from the film, like a year, a room number, a licence plate or a score;
  - a dish named after a minor character;
  - a note that winks at a famous line without quoting more than a few words;
  - a prop or location tucked into a description;
  - an order number, table number or phone number from the film.
- **Use TMDB for support:** character names, taglines, release year, locations and the film stills already listed in data/film-stills.json.
- **Never name real chefs or real restaurants** on the menus. They are inspiration only.
- **Keep it accurate.** Don't invent scenes, and keep any quoted line short.
