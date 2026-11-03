# Fifth independent review

**Overall: 8.1 out of 10**

Movie Night Spinner is still a properly made thing. The cinema front, the wheel, the hand-built menus and Galaxy Video are as good as anything in this space, and most of review 4's list really is fixed: Choose dishes now matches the card, the candy bar text is clean, spin lands on the tabs, sound starts off. What stops it going higher is two kinds of problem. First, the Prep sheet still has bugs a cook would trip over: the diet switches on the Prep sheet do not change the printed menu, method steps scale only half their numbers, and the extras group repeats things already on the list. Second, a handful of shared layouts drag their venue's furniture onto films where it makes no sense, like a surf report on The Nightmare Before Christmas. None of it is hard to fix.

Tested with Playwright and real Chrome at 390x844 (phone, touch, 2x) and 1440x900 (desktop). Every finding below was checked against a screenshot, not just the DOM. Screenshots are docs/review-5-01.png to review-5-24.png.

## How it was tested

- Spin flow by mouse, touch and keyboard on both sizes, plus Double feature, Mystery night, Trivia spin and the candy bar's Spin a combo.
- 39 printed menus opened directly with ?film= at desktop (2x for reading), covering 9 hand-built menus (The Godfather, Die Hard, Jurassic Park, Pulp Fiction, Back to the Future, Ratatouille, Elf, Coming to America, Taxi Driver) and all 30 shared layouts (Con Air, The Mask of Zorro, Top Gun: Maverick, Roman Holiday, Zootopia, Logan, Charlie and the Chocolate Factory, Rogue One, The Sapphires, The Rocketeer, Speed, Jaws, Animal Kingdom, Goldfinger, Four Weddings and a Funeral, The Nightmare Before Christmas, The Dish, It Happened One Night, Chinatown, Idiocracy, RoboCop, Weird Science, Red Dog, Three Amigos!, Phar Lap, The Avengers, Gladiator, Peter Rabbit, Return of the Jedi, Black Panther). Eras from 1934 to 2022.
- A further 90 films, picked at random, loaded and checked by script for console errors, failed requests, broken images and odd text; anything flagged was then looked at on screen.
- Phone: inline swipe preview, dots, full size viewer (Fit, zoom, page arrows, Escape), the big-type text menu and its How to make it drop-downs, on The Godfather, The Incredibles, Thor: Ragnarok and Jurassic Park.
- Prep sheet: Choose dishes, shopping list and method at 2, 4, 6, 8 and 13 guests, Vegetarian and No alcohol switched on from the Prep sheet and from Settings, and ticked "From the menu" extras.
- Galaxy Video: walk-in, member card signed by keyboard, price board, aisles, staff picks, hire case, rental slip, Escape back to the store.
- Keyboard and screen reader basics: skip link, Tab order before and after a spin, viewer focus, tab roles, names on buttons, links and images.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 8 |
| 4. Phone experience | 8 |
| 5. Core flow (spin, menu, shopping, cooking) | 7 |
| 6. Galaxy Video store | 9 |
| 7. Polish and craft | 7 |
| 8. Accessibility basics | 8 |
| **Overall** | **8.1** |

### 1. First impression and visual identity: 9
Unchanged and still strong (01, 02). Marquee photo with the film name on the letter board, brass wheel with bulbs, velvet curtain, and on phone the marquee, tab bar and top of the wheel all in the first screen. The marquee ticks through titles while the wheel turns (03). The welcome card is short and clear. Only nit: wheel wedges still cut long titles mid-word ("Close Encounters of t...", "Harry Potter and the P..." next to "Harry Potter and the...", so two wedges can still read as the same film).

### 2. Brand consistency: 9
Clean. Red, gold and deco type for the cinema and candy bar; purple, gold, teal and pink with chunky display type for Galaxy Video, including the tab bar and the dialogs (19, 20, 21). Nothing bleeds either way.

### 3. Printed menus: 8
The hand-built menus are the best work on the site. The Godfather, Jurassic Park's dining guide and island map, Taxi Driver's Hack Stand with the trip sheet, Back to the Future's Lou's Cafe ("Joey's cake: he didn't make parole"), Die Hard's Nakatomi party, Elf, Ratatouille. Several shared ones are just as good: Top Gun: Maverick's bar tab adds up both pages (108.25 carried, 147.00 running, and 66.00 when the vegetarian and alcohol-free version drops dishes) (24), Animal Kingdom (parma, vanilla slice with passionfruit icing, Jatz and cabana), Goldfinger's mint julep, Four Weddings' neeps and tatties, The Avengers' shawarma joint, Thor's L&P spider and afghan biscuits.

Marks off, all on shared layouts:
- **Layout furniture that does not fit the film.** The kiosk layout is a beach kiosk, so The Nightmare Before Christmas gets a "Surf report, swell 5 ft, wind light offshore" strip and "Lifeguard off duty from five" (07), and Let the Right One In, set in a snowed-in Stockholm estate, is a "Beach bar and grill" with the same surf report. Speed, a bus film, is on the dining car layout, so it reads "Dinner timetable, Train 2525", "Heard in the club car", "Dining car" (13). Phar Lap gets a baseball innings scoreboard ("Home 3 1 1 2 7, Guests 0 0 0 0 0") (14). Chinatown's newspaper sections are called "Origin snacks" and "Power-up" (10), which suits Superman, not Jake Gittes. Gladiator prices in "crowns" (12).
- **Year-coded prices still on shared cards**, which Josh has ruled out: The Rocketeer's special is 19.38 next to 1.25 to 6.75 items (09), and The Mask of Zorro's whole feast is 18.21 (11).
- **Lower-cased names on the club card**: "No discussing gail, Julie, Cynthia and Kay at the tables" (08). The same line also gives "andie's job" (Pretty in Pink) and "quick" (Harlem Nights).
- **Footer text hidden under the photo** on The Mask of Zorro's banquet page: "Poster and stills: TMDB" drops behind the still (11).
- **Missing paper texture** on every newspaper card: menu-formats/newspaper-newsprint.jpg returns 404, so the 15 newspaper menus print on flat colour (10).
- Smaller: dish notes that only name a place still turn up ("The local pub in Parkes", "The gladiator school in Zucchabar", "Bea's easel, left by the garden wall"); Red Dog's "cold pot of Swan Lager" would be a middy in WA; RoboCop offers "Old Detroit mini coney dogs" and "Detroit coney dog" on one card; Phar Lap's page two leaves half the page empty.

### 4. Phone experience: 8
Good. One page per screen, dots, "Swipe to turn, tap to zoom", and a full size viewer with Fit, zoom, labelled page arrows, the turn-sideways hint and focus back on close (04, 22). Wide single-page menus now fade the cut edge, which reads as a peek rather than a fault. The big-type text menu with Starters, Mains, Sweets and Drinks tabs is still the right answer. Marks off: the text menu always says "Every recipe serves four" and gives four-person amounts even when the Prep sheet is set to 8 guests, and its method wording differs from the Prep sheet's for the same dish, so a cook following the phone gets a second, different set of instructions. Landscape pages (Thor page two) still open small.

### 5. Core flow: 7
Spin, menu, Prep sheet and Choose dishes run smoothly, and Choose dishes now matches the printed card. The Prep sheet's bones (time chips, make-ahead notes, aisle-grouped list, live ticking) are good. A cook will still hit these:
- **Diet switches on the Prep sheet do not change the printed menu.** Turn on Vegetarian and No alcohol on Top Gun: Maverick's Prep sheet and the Prep sheet switches to haloumi and a lemon mint smash, but the printed card still shows bacon fries, grilled prawns and the bourbon smash, and the "Vegetarian menu" label stays blank (05). Reload the page and the card is right (06). The same switches in Settings work straight away.
- **Method steps scale only some of their numbers.** At 13 guests the arancini step reads "Cut the mozzarella into 8 cubes. Divide the cold risotto into 26 portions and wrap each around a cube" (16).
- **The extras group repeats what the main list already buys.** On The Dish with lamingtons and the steak sandwich ticked, the extras group asks for 125g butter, 150g caster sugar, 2 eggs, 225g self-raising flour, 125ml milk, 200ml thickened cream and 4 eggs, while the main list already has butter, caster sugar, 4 eggs, self-raising flour, milk and 600ml thickened cream (17). Review 4's notes say these merge; on screen they do not. Top Gun's list also has "2 tbsp pickled jalapeños" and "2 tbsp pickled jalapeño slices" as separate lines.
- **Cook times that subtract the chill from the cook.** Arancini shows "Prep 30 min, cook 2 min, then 20 min to chill" while its own fry step is 12 minutes (15). The data says cook 22 including the chill; the label takes the chill off the cook. Around 110 dishes come out with a cook time of 5 minutes or less this way (Stromberg's fregola with clams "cook 3 min", Rose's popcorn chicken "cook 5 min").
- **Scaling details a chef would notice.** "1 cups olive oil" at 13 guests (16); "1/2 bag ice" at 2; deep-frying oil scales with guests, so 2 guests get 250ml, not enough to fry at 170°C; hands-on time stays 1 hr 35 min whether you cook for 2 or 13.
- **Ingredients you cannot buy.** "400g cold cooked risotto, thick" sits in the Pantry aisle with no risotto recipe (15). Also "cooked rice" and "mashed potato" in two films each, and water ("200ml water", "2 tbsp hot water, for mint sauce") on shopping lists.

### 6. Galaxy Video store: 9
Still the most fun part of the site. Walk-in shopfront, member card you sign by typing (focus lands in the name field), price board, walk-in aisle photo with clickable signs, face-out tapes with ratings and "All copies out", staff pick cards, hire case with tagline, drop cap, staff tip, tonight's menu, trailer TV and Weekly sticker (20), and a rental slip with your name, due date a week out at 7pm, change from a $10 note and the blue hire case (21). Escape closes the slip and leaves you in the store, history intact. One slip: the shopfront window sign says "New releases 3 nights $4" (18) while the board inside says "$7 overnight" (19).

### 7. Polish and craft: 7
The level is high, so the slips show: "gail" and "andie's" on club cards, the Zorro footer under the photo, the 404 newsprint texture, "1 cups", the half-scaled method step, duplicate jalapeños, and two places on desktop still say "Tap" ("Tap Add and they go on tonight's film" on the candy bar, "Tap a tape to read the back" in Galaxy Video) where the rest of desktop says Click. No console errors or failed requests on 129 films apart from the newsprint file. No em or en dashes in anything that renders.

### 8. Accessibility basics: 8
Solid. Skip link first, Enter lands on Spin, Enter spins, focus moves to the "Now showing" live region which announces the film. Menu and Prep sheet are proper tabs with arrow keys. The preview is a named button ("Open the printed menu full size"); the viewer takes focus and returns it on Escape. The split-letter MOVIE NIGHT heading has an aria-label and hides the letters. Gold focus rings everywhere. Small things: after a spin, Tab goes from the live region to the preview, so reaching the Prep sheet tab needs Shift+Tab; footer links are about 19px tall, under the 24px target size.

## Fix list, ranked by impact

1. **Make the Prep sheet diet switches update the printed menu.**
   Where: Prep sheet, Vegetarian and No alcohol switches (Settings already works).
   Wrong: the Prep sheet and shopping list switch to the vegetarian or alcohol-free dishes, but the printed card, the phone text menu and the "Vegetarian menu" label stay on the meat and alcohol version until a reload (05, 06).
   Good looks like: flipping either switch re-renders the card, text menu and label straight away, exactly as the Settings switches do.

2. **Scale every number in a method step, and tidy scaled amounts.**
   Where: How to make it, any guest count other than 4; start with The Godfather arancini.
   Wrong: "8 cubes" stays at 8 while "26 portions" scales (16); "1 cups olive oil"; "1/2 bag ice"; frying oil drops to 250ml at 2 guests; hands-on time never changes.
   Good looks like: counts in a step all scale together (or the step is written without a count), units read right ("1 cup"), items sold whole round up (1 bag of ice), frying oil has a floor set by the pot (say 1 L), and hands-on time grows a little with batches.

3. **Stop shared layouts printing venue details that do not fit the film.**
   Where: kiosk (surf report and lifeguard line on The Nightmare Before Christmas, Let the Right One In and other inland films), dining car on Speed, the stadium scoreboard on Phar Lap, newspaper section names on Chinatown, "crowns" on Gladiator.
   Wrong: the beach, train, baseball and comic-book furniture is fixed per layout, so it lands on films where it reads as a mistake (07, 10, 12, 13, 14).
   Good looks like: these strips and labels come from the film's flavour data, or drop when the film has no beach, train or ballpark. A quick audit list of every film on kiosk, diningcar, stadium, newspaper and tavern would catch the rest.

4. **Merge the extras group with the main shopping list properly.**
   Where: Prep sheet, "For the extras, buy to suit", seen on The Dish; Top Gun's jalapeños.
   Wrong: eggs, butter, caster sugar, self-raising flour, milk and thickened cream appear in both groups (17); near-identical lines are not merged.
   Good looks like: one line per item across both groups, with the extras amount added in, and a simple name normaliser (butter / cold butter, milk / full cream milk, jalapeños / jalapeño slices).

5. **Show cook time as cook time.**
   Where: dish headers on the Prep sheet; dishTimes in app.js.
   Wrong: chill, soak and marinate minutes are taken off the cook figure, giving "cook 2 min" for arancini that fry for 12 (15), and about 110 dishes like it.
   Good looks like: the waiting is taken from where it was counted, so the label reads "Prep 30 min, cook 12 min, then 20 min to chill". Add a check that flags any dish whose shown cook time is shorter than its longest heat step.

6. **Remove year-coded prices from shared cards.**
   Where: diner layout (The Rocketeer 19.38) and banquet layout (The Mask of Zorro 18.21); check placemat, takeaway and candybar, which use the same film-number trick.
   Wrong: a price built from the year sits among period prices (09, 11), which Josh has ruled out.
   Good looks like: every shared card priced on one period scale. Keep year codes only on the hand-built cards where they are a deliberate joke (Godfather 1.72, Jurassic Park 19.93).

7. **Keep capital letters on names in the club card's house rules.**
   Where: menu-formats/club.js line 170, the "No discussing ..." line.
   Wrong: the first letter of the wink is lower-cased, giving "gail", "andie's", "quick" (08).
   Good looks like: only lower-case the first letter when the wink starts with "The", "A" or similar, or leave it as written.

8. **Fix the banquet footer that runs under the photo.**
   Where: The Mask of Zorro page two, the line under "The whole feast, per cover". Check all 33 banquet films.
   Wrong: "Poster and stills: TMDB" is hidden behind the still (11).
   Good looks like: the footer line sits fully above the photo or is shortened to fit.

9. **Restore the newsprint texture.**
   Where: menu-formats/newspaper.js asks for newspaper-newsprint.jpg, which is not in the repo.
   Wrong: 404 on all 15 newspaper menus; they print on flat colour (10).
   Good looks like: the file added at the path the layout expects (or the path corrected), and a build check that every asset a layout references exists.

10. **Make the shopping list buyable.**
    Where: The Godfather arancini ("400g cold cooked risotto, thick"), two films with "cooked rice", two with "mashed potato", and water lines on several lists.
    Good looks like: either a short base recipe (arborio, stock, parmesan) folded into the dish, or a plain swap the shop sells; water left off the list.

11. **Make the phone text menu follow the guest count.**
    Where: the big-type text menu under the printed card on phones.
    Wrong: "Every recipe serves four" and four-person amounts while the Prep sheet is on 8; method wording differs from the Prep sheet.
    Good looks like: "Serves 8" and scaled amounts when guests are changed, using the same method text as the Prep sheet.

12. **Galaxy Video and desktop wording.**
    Make the shopfront "New releases 3 nights $4" sign match the board ($7 overnight), or change the board (18, 19). Use Click on desktop for "Tap Add and they go on tonight's film" and "Tap a tape to read the back".

13. **Small craft and access nits.**
    Show the year or subtitle on wedges that still read the same ("Harry Potter and the..."), and cut wedge titles at a word. Replace place-only dish notes with what the dish is. "Pot" to "middy" for WA films (Red Dog). Give RoboCop's two coney dogs different dishes. After a spin, let Tab reach the Menu and Prep sheet tabs (or put the live region before them). Footer links to at least 24px tall.

## Genuinely excellent, leave alone

- The marquee and the brass wheel, including the letters ticking through titles during a spin.
- The hand-built menus: The Godfather, Jurassic Park's guide and map, Taxi Driver's Hack Stand, Back to the Future's Lou's Cafe, Die Hard's Nakatomi party, Elf, Ratatouille, Pulp Fiction.
- Bar tab maths that holds up across both pages and through the diet swaps (Top Gun: Maverick).
- The best shared menus: Animal Kingdom, Four Weddings and a Funeral, Goldfinger, The Avengers, Thor: Ragnarok, Return of the Jedi, It Happened One Night, Weird Science. Real Australian food where the film is Australian.
- Choose dishes matching the card, with house lines shown but not ticked.
- The full size viewer and the phone swipe preview with the faded cut edge.
- Galaxy Video end to end: shopfront, signed member card, aisles, staff picks, hire case, rental slip with the blue case.
- Candy bar craving board with live film counts, and Spin a combo landing on a film that serves it (Burgers to Planes, Trains and Automobiles' diner cheeseburger) (23).
- Skip link, focus rings, proper tabs and the "Now showing" live region.

## Fixed after the review

- Fix 1, Prep sheet diet switches (4 Nov): flipping Vegetarian or No alcohol on the Prep sheet now redraws the printed card, phone text menu and label straight away, the same as Settings. You stay on the Prep sheet, the dish list stays open and focus stays on the switch. Checked on The Godfather (card swaps to mushroom meatballs and Funghi Marsala; the "best veal in the city" sign is the film's line and stays).
- Fix 2, scaling (4 Nov): method steps now scale cubes, chunks, strips, rounds, discs, logs and eggs along with portions, so the arancini read "4 cubes ... 4 portions" for 2 guests and "16 ... 16" for 8. Cups read right after rounding ("1 cup", not "1 cups"). Bags, jars, tins, packets and other whole packs round up on the shopping list (half a bag of ice is 1 bag). Frying oil never drops below the recipe's own amount, since the pot sets it. Hands-on time grows by half for each extra batch (arancini 30 min for 4, 45 min for 8); cooking and waiting stay the same. Cook times themselves are fix 5.
- Fix 3, layout furniture (4 Nov): the kiosk only prints its surf report, swell, lifeguard and board hire where the film has a beach (read from the venue, or flavour beach); everywhere else it is a plain kiosk with an "Out front" strip (sky, wind, temp, last orders) and land wording. The dining car reads as a bus, cab or bus stop bench when that is the venue ("BUS 2525" on Speed, a bench for Forrest Gump). The stadium board suits the event: race card for Phar Lap, Cars 2 and Talladega, fight for Rocky, Bloodsport, Hercules and Ragnarok, golf for Happy Gilmore, expo halls for Iron Man 2 and The First Avenger, a set list for Bohemian Rhapsody; team sports keep Home and Guests (the R for runs is now T). Newspaper section names are comic-book only on superhero films (Chinatown gets Early edition, Front page). Gladiator prices in denarii. All 107 films on these five layouts rendered with no errors.
- Found while checking fix 3: the fix 2 hands-on time change used the guest ratio before it was set, which broke the Prep sheet build. Fixed, and a new browser check builds one film per layout plus The Godfather and opens each Prep sheet, so a broken layout or Prep sheet now fails the checks.
