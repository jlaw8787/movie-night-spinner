# Tenth independent review

**Overall: 7.1 out of 10**

The cinema still lands on first look. The marquee, the brass wheel and a spin that drops you straight onto a printed menu from inside the film are as good as ever (01, 02). Most of review 9's fixes hold: the phone week panel, Director's cut landing on the ticks, frying oil, pack notes, the kit departures board, The Untouchables, Get Shorty, Blade and Knocked Up. The big menu sweep shows. Of the 38 new films opened, most read like real places with sensible menus.

Two regressions pull the score down hard. First, the Candy bar rebuild lost all its styling when it was merged. On the live site and this commit the counter shows as a bare web page: bullet lists, default buttons, photos stacked down the left (09, 10, 11). Second, the "dry films print the written alcohol-free versions" change reaches far past dry films. For 393 of the 695 grown-up films the Prep sheet and shopping list now cook the alcohol-free version of at least one dish, usually the drink, even with No alcohol switched off. Scarface prints a Babylon Club mojito and cooks a "mint crush" with white grape juice (05). Shaun of the Dead's pub pie braises in alcohol-free dark ale (07). Kids' mode has the opposite leak on two films: Christmas Vacation's eggnog still buys 80ml of dark rum (16). Against a 9.5 launch target this round is further away than review 9, but the two biggest faults are a lost block of CSS and a one-line bug (the same bug causes the kids' mode leak), not a rebuild.

Tested with Playwright and Chromium at 390x844 (iPhone 13, touch, 3x) and 1440x900 (desktop), on a local server at commit 73e1524 on wip/store-overhaul, with service workers blocked. The live Netlify copy was checked for the same Candy bar fault (same app.js?v=b80c7009, same missing styles). Every finding below was checked against a screenshot, not just the DOM. Screenshots are docs/review-10-01.png to review-10-27.png.

## How it was tested

- First visit and spin on both sizes, by click and by touch, waiting for the leader countdown (01, 02, 03).
- 38 films opened through Save PDF (menu pages and Prep sheet rendered with pdftoppm), phone text menu and table kit, none named in reviews 2 to 9: Scarface, Donnie Brasco, Prizzi's Honor (hand-built); Sixteen Candles, Big Fish (invite); Tremors (truck); Zoolander (cafe); Encanto, Hot Shots! (airline); Mrs. Doubtfire, Office Space (placemat); The Lost Boys (kiosk); Stand by Me, The Iron Giant (diner); Aliens (galley); The Greatest Showman (candy bar); Napoleon Dynamite (canteen); The Silence of the Lambs (precinct); Crouching Tiger, Hidden Dragon (tearoom); The Rocky Horror Picture Show (club); Face/Off (lab); Honey, I Shrunk the Kids (campfire); Unforgiven (saloon); Kung Fu Hustle (takeaway); Meet the Parents (bistro); Superbad (prom); Dirty Dancing, Lost in Translation (hotel); Labyrinth (tavern); Road House (bartab); Practical Magic (home); Hook (tiki); Mad Max: Fury Road (banquet); The Mighty Ducks (stadium); The Polar Express (dining car); Elvis (motel); Clerks (newspaper); Shaun of the Dead (pub). Plus Kick-Ass, Serendipity and Mystic Pizza. Eras 1975 to 2022.
- A script pass over all 900 films: printed card and phone menu text for dashes, US spellings, doubled words, cut endings, odd-cent prices, "undefined" style leaks, clipped text and broken images; then the hits opened.
- A second pass over all 695 grown-up films for what the planner cooks with No alcohol off.
- Prep sheet and shopping at 2, 4 and 9 guests, with Vegetarian and with No alcohol, on Prizzi's Honor; lock-in pop-up and Director's cut on the phone (06, 18).
- Kids' mode: all 200 kids, fairytale, Christmas and wizard films opened with kids' mode on, card, phone menu and Prep sheet scanned for alcohol words and doubled words (16).
- Rechecked review 9's left-open items: The Untouchables, Get Shorty, Blade, Knocked Up, the tavern line.
- Candy bar on both sizes with Dirty Dancing and Hook (09, 10, 11).
- Galaxy Video on the phone end to end: shopfront, deal board, member card, Musicals aisle, hire case, rental slip (19, 21, 22, 23). Aisle signs on the shop photo on desktop. Calendar strip on 5 Nov, 10 Nov and 20 Dec 2026, and 10 Jan, 10 Feb, 27 Mar, 20 Apr, 3 May, 28 Aug and 25 Oct 2027 (20, 24).
- Table kit pages for all 38 films (25).
- Print button run on desktop (no errors; the browser print dialog itself cannot be seen headless).
- Accessibility: names on controls, alt text, headings, duplicate ids, target sizes, per view.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 8 |
| 3. Printed menus | 7 |
| 4. Phone experience | 7 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 6 |
| 6. Candy bar | 3 |
| 7. Galaxy Video store | 8 |
| 8. Table kit | 8 |
| 9. Polish and craft | 7 |
| 10. Accessibility basics | 8 |
| **Overall** | **7.1** |

### 1. First impression and visual identity: 9
The lobby, marquee and brass wheel land straight away (01). A desktop spin counts down on the curtain, then opens Spider-Man: Homecoming's Midtown School cafeteria with periods across the top and a lunch ticket (02). On the phone the spin lands on Train to Busan's Seoul to Busan snack cart, printed menu first (03). Nothing new to mark off.

### 2. Brand consistency: 8
The cinema and Galaxy Video still never mix. The lock-in pop-up and planner are red and gold (06), Galaxy Video is purple, gold, teal and pink from shopfront to slip (19, 22, 23), and the seasonal chips sit inside the store's frame (20, 24). The mark off is the Candy bar: with its styles gone the counter is black text on cream paper with grey system buttons, which reads as neither brand (09, 11).

### 3. Printed menus: 7
The best of this sample are as good as anything in earlier rounds. Prizzi's Honor's wedding supper with Our Lady, Sunset Park in an arch and a "Who Sits Where" seating plan (04). Scarface's neon Babylon Club with a V.I.P. card for Mr. Antonio Montana (05). Unforgiven's Greely's Beer Garden with "Wanted for supper, reward $92" and a Saloon Rules slip (26). Kung Fu Hustle's Pig Sty Alley takeaway with a fortune that says "Kung fu: not accepted as payment" (27). Dirty Dancing's Kellerman's room service card. Meet the Parents' Byrnes House table with a lie detector in the footer. Clerks' Quick Stop Gazette. Aliens' Sulaco mess hall in credits. Superbad's party spread with a photo booth strip. Photos sit in proportion on screen and in the PDF.

Marks off:
- **Save PDF drops parts of the candy bar and cafe layouts.** The Greatest Showman prints its "Museum Admission" ticket and "Tonight" seat stub as near-invisible ghosts, though both show clearly on screen (12). Kick-Ass does the same to its "Online costume order" card. Zoolander's cafe PDF has a stray "ZOOLANDER" lettering cut off along the top edge, sitting behind the card (13).
- **Sweets in the starters.** Practical Magic lists lavender shortbread under To Start (08). Stand by Me starts with campfire marshmallows and cherry gummies (15). Polar Express has golden ticket shortbread under Relishes, Shaun of the Dead strawberry ripple ice cream cones under Starters. A data scan finds about 90 films with a biscuit, cake, doughnut, cookie or ice cream as a starter. Some fit the scene (stakeout doughnuts), most do not.
- **Prices that jump styles or land on odd cents.** Stand by Me: "Castle Rock sarsaparilla float 12¢" beside "Cola in the glass bottle 1.95" on the same page (15). The Iron Giant's diner meatloaf is 8.57, Road House's ribs 8.22. About 40 odd-cent prices are left on diner, bartab, tearoom, bistro, banquet and tavern cards (precinct's evidence-tag prices look deliberate and are not counted).
- **The diner's "Est." year is the release year.** The Iron Giant's 1957 Rockwell Diner says "Est. 1999" (14). Same on Stand by Me (1986), Grease (1978), Cars (2006), The Rocketeer (1991), Men in Black 3 (2012) and four more diner films set decades earlier.
- **Stand by Me's diner splits thin over three pages.** Page 2 holds four starters and half a page of blank, page 3 the rest (15).

### 4. Phone experience: 7
Printed menu first with "Swipe to turn, tap to zoom" and dots, then the big-type text menu with tabs and "How to make it" (17). No sideways scroll on any view. Review 9's two phone faults are fixed: the week panel keeps the title full width and wraps the buttons under it (18), and Director's cut lands on "Choose dishes" with focus on the first tick (06). Marks off:
- **Candy bar is unstyled on the phone too** (10): a bulleted price list, a combo with its photos floating above a bullet, and grey "Add combo" buttons about 21px tall.
- **The aisle signs on the shop photo are hidden on the phone.** A `display:none` in the under 700px block hides the whole photo, so phone users never see the signs (19).
- **The rental slip opens part way down.** Tapping "Rent it" puts focus on "Roll the film" and scrolls the slip 450px in, so the member number, date and due back sit above the fold; you land on the cover's lower half, "Be kind, please rewind" and the counter add-ons (23).
- The Menu of the week strip cuts "Prizzi's Honor" to "Prizzi's Honor..." on the phone (03).

### 5. Core flow: 6
Lock-in is still clear and the planner reads well: guests, Vegetarian, No alcohol, then ticks with times (06). Shopping scales properly. Prizzi's Honor at 2, 4 and 9: zucchini "1 zucchini, about 200g", "2 zucchinis, about 400g", "5 zucchinis, about 900g"; frying oil stays at 500ml at every count; parsley and spoons round to halves. Vegetarian rewrites the list and the printed card: the antipasto swaps salami for chargrilled eggplant and the ziti goes to a fennel mushroom sugo. Marks off:
- **Grown-up films cook the alcohol-free drink by default.** With No alcohol off, the planner, Prep sheet, shopping list and phone method still pick the alcohol-free version for 393 of 695 grown-up films. Scarface's card says "Babylon Club mojito, white rum, lime and mint" and the Prep sheet cooks a "Babylon Club mint crush" with white grape juice (05). Prizzi's Honor's Bellini becomes a "white peach sparkler" tagged "alcohol-free version" with the No alcohol box empty (06). Shaun of the Dead's Winchester pub braises its pie in "alcohol-free dark ale" and serves "Pint at the Winchester (alcohol-free)" (07). Practical Magic prints Midnight margaritas with tequila and cooks them dry (08). Donnie Brasco's Rob Roy, Casino's oysters Rockefeller and The Untouchables' rye all go the same way. The cause is in app.js: 0879840 ("Dry films print the written alcohol-free versions") gave dietDish a second argument, `dietDish(d,af=dietAF())`, but planAll still calls `.map(dietDish)`, so map passes the array index as `af`. Every dish after the first is planned as if No alcohol were on; the first dish (index 0) never is.
- **Kids' mode leaks alcohol on two films.** Christmas Vacation's eggnog lists "80ml dark rum" in You need, in the shopping list under Bottle shop, and says "Stir in the rum" in the method, under an "ALCOHOL-FREE" chip (16). Krampus buys "2 tbsp lager" for the obatzda. In both, the dish with alcohol is the film's first recipe, and the same `.map(dietDish)` index bug passes `af=0` for it, so kids' mode is ignored for that one dish.

### 6. Candy bar: 3
The work is in the code: app.js builds the lit price board, three combos for tonight's film with names from the film ("Baby Houseman's order", "Dirty Dancing for two", "The staff dance late at night"), prices moved to the film's year, the glass case, the tray and the whole counter fold. The combos and wording are good. But none of the counter's styles are in index.html. Commit ef5a436 added about 128 lines of CSS (.sc, .scb, .scc and the rest); the merge 4aff1af dropped every one of them, and no later commit put them back. The live site has the same fault. What people see on both sizes is the old hero photo, then a cream panel with an H2 "Candy Bar", a bulleted list "Popcorn sm2.20" with no space before the price, combo photos stacked above bullets, and default grey buttons (09, 10, 11). On desktop each glass case item takes a whole row with a 160px photo, so six snacks run four screens down. The tray reads "Nothing on the tray yet" correctly, and adding a combo works, but the counter does not look like a counter.

### 7. Galaxy Video store: 8
Still the most fun part of the site. The shopfront at night with the Galaxy sign (19), the deal board with "$2 Tuesday, every new release" and the double bill button, the member card with "Late fees: none. Good member." On desktop the shop photo carries real aisle signs (Action, Superheroes, Romance, Crime, Fantasy, Westerns, Musicals, World, Late Show) and clicking one walks to the aisle (20, 24). The Musicals aisle holds 36 tapes from Annie to The Phantom of the Opera (21). The hire case for Annie: "From the orphanage to the mansion, with dessert", staff tip "save room for Mansion sundaes", tonight's menu and where to rent (22). The slip: member number, due back "Thu, 12 Nov, 7pm", "$10 note, change $8.00", "Be kind, please rewind" and counter add-ons that go on the shopping list (23). The calendar does what the owner set on every date tried: Movember and Christmas on 5 Nov; Friday the 13th added on 10 Nov; Christmas with New Year's Eve "In 11 days" on 20 Dec (24); Summer holidays alone on 10 Jan; Lunar New Year and Valentine's Day on 10 Feb; Easter with April Fools "In 5 days" on 27 Mar; ANZAC Day with Mother's Day "In 19 days" on 20 Apr; Finals season and Father's Day coming up on 28 Aug; Halloween split into "all ages" and "late show" with Movember coming up on 25 Oct (20). Review 9's chip and contrast fixes hold. Marks off: the aisle sign photo is missing on the phone and the slip opens part way down (section 4).

### 8. Table kit: 8
Strong pages again: Labyrinth's "Once upon a time, at Goblin City Market" door card and an intermission quoting Hoggle, Road House's Wanted poster with "Reward: supper at the Double Deuce", Polar Express golden tickets "Punched by the Conductor", Hook's "Lost Boys Feast Table" on bamboo torches, Clerks' "Fifteen minute break declared" Gazette (25). Place cards hold two columns with names. Review 9's departures fix holds on every kit opened. Marks off: nothing new is broken, but nothing has moved on since review 9 either. Unforgiven's place cards are "Saloon Rules Slip" cards for a beer garden, a small fit slip like review 9's saloon line.

### 9. Polish and craft: 7
No console errors, page errors, failed requests or broken images on any view or film. No em or en dashes rendered anywhere in 900 cards and phone menus. Marks off:
- **Doubled words from the dry pass still get through.** The Lord of the Rings: The Two Towers phone method: "a rich rich gravy" (the original was "rich red wine gravy"). How the Grinch Stole Christmas: "SPARKLING CRANBERRY SODA SODA SPRITZ". Review 9 fix 3 said doubled swap words fold back to one.
- **US spellings in rendered text.** "Supper in honor of" and "The old man's favorite" (Prizzi's Honor, 04); "favorite" (Die Hard); "powdered sugar" (Mean Streets, Raging Bull, Money Train, Die Hard with a Vengeance, Teenage Mutant Ninja Turtles II); "soft in the center" (The Adjustment Bureau); "neighborhood" (Once Upon a Time in America, Carlito's Way, The Freshman); "guest of honor" (The Freshman); "best behavior" (Beauty and the Beast); "parlor" (Psycho); "flat tire" (Rocky Horror). Proper names and American settings aside, these are recipe lines and house notes.
- **Clipped text.** The Matrix galley header "NEBUCHADNEZZAR MESS DECK" and North by Northwest's "Roger Thornhill" run past their boxes.

### 10. Accessibility basics: 8
lang is set, every image has alt text, there are no duplicate ids, the skip link comes first and the main controls have names. Marks off: the Candy bar's "Add combo" buttons are 83x21 and its credit links 18px tall now the styles are gone; the shop's "Every aisle" view has 14 H3 headings with no text; the watched ticks are still 22x22.

## Fix list, ranked by impact

1. **Put the Candy bar's styles back.**
   Where: index.html. The CSS block from ef5a436 (".sc{--sc-bg:#170809..." through the tray and fold rules) that the merge 4aff1af dropped.
   Wrong: the counter renders as a plain list with grey buttons on both sizes and on the live site (09, 10, 11).
   Good looks like: the lit board with bulbs and lamp-gold prices, combos as cards, a glass case grid and the tray docket, as built in ef5a436. Add a check to tests that fails if `.scb-list` has no rule in index.html.

2. **Only dry films and the No alcohol switch cook the alcohol-free drink.**
   Where: `.map(dietDish)` in planAll (and anywhere else dietDish is passed straight to map) in app.js. Call it as `.map(d=>dietDish(d))`.
   Wrong: 393 of 695 grown-up films plan, shop and cook the alcohol-free version with No alcohol off: Scarface (05), Prizzi's Honor (06), Shaun of the Dead (07), Practical Magic (08).
   Good looks like: with No alcohol off and kids' mode off, a grown-up film cooks what its card prints. The dry rule (dietMenuOnly) only for kids, fairytale, Christmas and wizard films. A test that opens Scarface and fails if the Prep sheet has no rum.

3. **Kids' mode never buys alcohol.**
   Where: the same `.map(dietDish)` index bug as fix 2 (the first dish gets `af=0`).
   Wrong: Christmas Vacation's eggnog buys 80ml dark rum under an "Alcohol-free" chip (16); Krampus buys 2 tbsp lager.
   Good looks like: fix 2 sends kids' mode through for the first dish too, so it takes its af version or is left off. Add both films to the kids' mode check, and scan the Prep sheet and shopping list as well as the card.

4. **Save PDF keeps what the screen shows.**
   Where: the candy bar and cafe layouts' export path.
   Wrong: The Greatest Showman's and Kick-Ass's tickets print as faint ghosts (12); Zoolander prints a cut-off "ZOOLANDER" along the top (13).
   Good looks like: the PDF page matches the on-screen card, with no extra or faded parts.

5. **Phone fixes in the store.**
   Where: the under 700px media block (`#viewShop .sv-aisles{display:none}`), and the slip dialog's open.
   Wrong: no aisle sign photo on the phone (19); the slip opens 450px down with focus on "Roll the film" (23).
   Good looks like: the photo shows on the phone with signs big enough to tap, or a sign strip in its place; the slip opens at the top with the cover in view.

6. **Sweets with sweets.**
   Where: data/films.json S lists; about 90 films.
   Wrong: lavender shortbread to start (08), campfire marshmallows and cherry gummies to start (15), golden ticket shortbread under Relishes, ice cream cones under Starters.
   Good looks like: a biscuit, cake, lolly or ice cream sits under the sweets heading unless the scene makes it a snack (stakeout doughnuts). A data check that lists them for a person to judge.

7. **Prices: one style per card and no odd cents on shared layouts.**
   Where: priceSense and the layouts it skips (diner, bartab, tearoom, bistro, banquet, tavern).
   Wrong: "12¢" beside "1.95" (15); 8.57 meatloaf (14); 8.22 ribs; about 40 more.
   Good looks like: review 9's rule on every shared layout. Bar tab totals already add up and must keep doing so after a price moves.

8. **Diner "Est." year from the setting, not the release.**
   Where: diner layout header.
   Wrong: "Est. 1999" over a 1957 diner (14), and nine more.
   Good looks like: the year from the film's era (Est. 1949 for a 1950s diner), or leave "Est." off.

9. **Small items.**
   Doubled words after the dry pass ("rich rich gravy", "SODA SODA"); US spellings in recipe lines and house notes (honor, favorite, powdered sugar, center, neighborhood, behavior, parlor, tire); Stand by Me's diner split over three thin pages; the clipped Matrix and North by Northwest headers; "Prizzi's Honor..." cut on the phone week strip; names for the empty aisle H3s.

## Genuinely excellent, leave alone

- The marquee, brass wheel, leader countdown and the spin landing on the menu (01, 02, 03).
- Hand-built menus: Prizzi's Honor's wedding supper (04), Scarface's Babylon Club (05), and The Untouchables' Lexington banquet room now it is a real menu.
- The best shared menus from this sample: Unforgiven (26), Kung Fu Hustle (27), Dirty Dancing, Meet the Parents, Clerks, Aliens, Superbad, Lost in Translation, Napoleon Dynamite, Mad Max: Fury Road.
- The lock-in pop-up, the phone week panel and Director's cut landing on the ticks (06, 18).
- Shopping lines that scale cleanly at 2, 4 and 9, with the frying pot held still.
- Vegetarian swaps that rewrite the card, the list and the method.
- The Candy bar's combo logic and names (once it has its look back).
- Galaxy Video end to end and the holiday calendar on every date tried (19 to 24).
- Table kit door signs, tickets and intermission cards (25).
- No console errors, failed requests, broken images or dashes anywhere.
