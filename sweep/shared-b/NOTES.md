# shared-b notes for the lead

## Needs code or a file outside the sweep list

The printed menu's five cooked dishes come from `data/recipes/<slug>.json` (or the film's entry in `movie-menus.js`, for Planes, Trains and Automobiles), not from `data/recipes2/`. Renaming or moving a cooked dish in `films.json` and `recipes2` leaves the old name on the printed menu and adds the new one as an extra (tested on Cliffhanger, then put back). So the sweep could only change uncooked card dishes and add new ones. These cooked dishes still need fixing in `data/recipes/` (and recipes2, films.json, diet) together:

- Cliffhanger (1993): "Campfire steak" is a plain item. Suggest "Gabe's ranger hut rump steak with foil-baked potatoes".
- X-Men Origins: Wolverine (2009): "Pancakes, bacon and fried eggs" is a plain item. Suggest "The Hudsons' farmhouse pancakes, bacon and eggs" (the old couple who take Logan in).
- Sweets sitting in the starters (all cooked, so they could not be moved to sweets):
  - The Great Outdoors (1988): Lake cabin campfire s'mores
  - Wet Hot American Summer (2001): Camp Firewood salted caramel s'mores
  - The Lighthorsemen (1987): Light horse Anzac biscuits
  - Beneath Hill 60 (2010): Tunnellers' macadamia Anzac biscuits
  - Grease (1978): Pink Ladies coconut ice
  - The Iron Giant (1999): Diner pie bites and Beatnik coffee shop biscotti (both starters were sweets; the uncooked whoopie pies are gone and a savoury second main added, but the starters are still two sweets)
  - Rise of the Guardians (2012): Iced gingerbread yetis and elves, Sandy's golden dream honeycomb
- US spelling in cooked dish notes (fixed in films.json, still in data/recipes): Demolition Man "Three colors of layered jelly", Weekend at Bernie's "caramelized pineapple rings".

## Tooling
- `scripts/sweep-shot.cjs` times out at 180s waiting for the PDF download when six teams render at once (load average around 35 on 2 cores). A scratch copy with a 20 minute timeout worked.

## Seen in renders, not from this sweep
- Prom layout prices the added extra main above the cooked one regardless of the dish (Hocus Pocus 2: pumpkin mac and cheese 22.50 against the beef stew 16.00). Needs a look in the prom layout pricing.
- Holiday Inn (1942) prints in the no-alcohol wording by default, which makes "Connecticut inn hot spiced apple sparkling apple juice" with "dark syrup", and "syrup custard". The diet text swaps for that film need better wording, or it should not be dry by default.
- A Christmas Carol (2009): venue is "Scrooge and Marley Office" on a tavern layout ("Rooms above, stabling round the back"). Not a real eating venue; worth a rethink with the owner.

## Review step
No agent tool was available in this session, so the reviewer pass was done by hand: one render per layout (Great Outdoors, Waterboy, Rent, Iron Giant, Holiday Inn, A Christmas Carol, Thunderball, Hocus Pocus 2) plus a menu check of all 58 films (every card shows two mains, no recipe without a card dish).
