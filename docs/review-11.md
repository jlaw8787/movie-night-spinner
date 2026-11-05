# Eleventh independent review

**Overall: 8.1 out of 10**

This is a big step up from review 10. The two faults that dragged that round down are gone. The Candy bar has its look back on both sizes: the lit board, combos as cards with the film's names ("Loretta Castorini's order", "Moonstruck for two"), the glass case and the tray (21, 22). Grown-up films now cook what the card prints: Scarface buys white rum, Prizzi's Honor buys prosecco, Shaun of the Dead buys English ale and lager, Practical Magic buys tequila. Kids' mode bought nothing from the bottle shop on any of the 900 films. The Greatest Showman and Kick-Ass tickets print solid, Zoolander's stray lettering is gone, diner years and prices hold, and every test and script in the repo passes. Of the 48 new films opened, nearly all read like real places with menus that suit them.

What stops this from being a 9.5 is a smaller set of faults, but some of them are the kind a paying user would notice on the first night. Save PDF turns 18 canteen menus into a muddy brown sheet, so A Nightmare on Elm Street, Shawshank and Smile print as if through smoked glass (04, 06, 07). The 27 family, Christmas and wizard films with kids' mode off print a dry card and then buy the grog anyway: Christmas Vacation's card says "cooked custard eggnog" and its Prep sheet buys 80ml dark rum and says "Stir in the rum" (13). Kids' mode still leaves drinking cues in method lines ("Serve beside frozen vodka", 14) and doubles words in seven drink names ("Happy's lemon lemon squash pitchers", 15). The phone store's far signs are still about 12px tall to tap, though review 10 said they got 44px.

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit 1de81ff on wip/store-overhaul, with service workers blocked. Every finding below was checked against a screenshot, not just the DOM. Screenshots are docs/review-11-01.png to review-11-30.png.

## How it was tested

- First visit and spin on both sizes, by click and by tap, waiting for the countdown (01, 02, 03).
- 48 films opened through Save PDF (every page rendered with pdftoppm), phone text menu and table kit, none named in reviews 2 to 10: The Godfather Part II, Moonstruck, Saturday Night Fever (hand-built); My Cousin Vinny, The Blues Brothers, Waitress (diner); The Muppet Christmas Carol, Wedding Crashers (invite); Django Unchained, Short Circuit (truck); Love Actually (airline); Lethal Weapon, Toy Story 3 (placemat); The Karate Kid (kiosk); Spaceballs (galley); The Sandlot (placemat); Willy Wonka & the Chocolate Factory, True Romance (candy bar); Rain Man, A Nightmare on Elm Street (canteen); Bad Boys (precinct); Snow White and the Seven Dwarfs, Bridesmaids (tearoom); Moulin Rouge!, Fright Night (club); Gallipoli, Night of the Living Dead (campfire); Back to the Future Part III (saloon); The Breakfast Club (lab); Blade Runner, A Christmas Story (takeaway); Casino Royale (bistro); Mamma Mia! (tiki); Pretty Woman, The Exorcist (hotel); Juno (cafe); The Lord of the Rings: The Fellowship of the Ring, Pinocchio (tavern); Raiders of the Lost Ark (bar tab); Rocky IV (home); Bull Durham (stadium); Legally Blonde (prom); Flash Gordon (banquet); From Russia with Love (dining car); The Ring (motel); The Jungle Book (tiki); Oliver! (newspaper); Eurovision Song Contest: The Story of Fire Saga (pub). Plus Shutter Island, Halloween II, Jumanji, The Shawshank Redemption and Smile to chase the canteen fault. Eras 1937 to 2020.
- A script pass over all 900 films, card and phone menu text: dashes of any kind, US spellings, doubled words, "undefined", "NaN" and "null", clipped boxes and broken images. Then the hits opened and looked at.
- A Prep sheet pass over all 900 films twice, kids' mode off and on, reading every shopping line and method line for alcohol.
- Prep sheet and shopping at 2, 4 and 9 guests, with and without Vegetarian and No alcohol, on Casino Royale and Raiders of the Lost Ark. Lock-in and Director's cut on the phone (18).
- Rechecked every item in review 10's "Fixed after the review": The Greatest Showman, Kick-Ass and Zoolander PDFs, the dietDish fix, sweets in starters, prices, diner years (The Iron Giant, Stand by Me), doubled words, the Matrix and North by Northwest headers, the phone store photo and slip.
- Candy bar on both sizes with Moonstruck, adding a combo to the tray (21, 22).
- Galaxy Video on the phone end to end: walk in, shopfront, sign photo, aisle, hire case, rental slip (23, 24, 25). Desktop sign photo, Horror aisle, case and slip (26). Calendar strip on 9 Nov and 27 Dec 2026, and 26 Jan, 12 Feb, 25 Mar, 1 May, 15 Jun, 30 Aug and 20 Oct 2027.
- Table kit pages for all 48 films (27), and the phone kit dialog (28).
- Node tests in tests/ (all pass), scripts/check-prices.cjs (795 shared cards, pass), scripts/check-cut-words.cjs (pass), scripts/check-browser.cjs (pass at 390 and 1280), tests/dialogs.test.cjs (pass).
- Accessibility: names on controls, alt text, headings, duplicate ids and target sizes on the box office, Candy bar and store views.
- Console errors, page errors and failed requests watched on every run: none.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 8 |
| 4. Phone experience | 8 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 7 |
| 6. Candy bar | 8 |
| 7. Galaxy Video store | 8 |
| 8. Table kit | 8 |
| 9. Polish and craft | 8 |
| 10. Accessibility basics | 8 |
| **Overall** | **8.1** |

### 1. First impression and visual identity: 9
The welcome card is short and clear over the marquee (01). A desktop spin opens The Great Mouse Detective's "Basil's Baker Street Digs" with a compass frame and prices in crowns (02). On the phone the spin lands on Joker's "Murray Franklin Green Room" with a neon frame and a VIP pass, printed menu first with swipe dots (03). Nothing to mark off here.

### 2. Brand consistency: 9
Up from 8 now the Candy bar is back in cinema red and gold with lamp-gold prices (21, 22). The lock-in pop-up and planner stay red and gold (18), Galaxy Video stays purple, gold, teal and pink from the walk-in to the slip (23, 25, 26). The two never mix on any view tried. Held back from 10 only by the Candy bar's photo credit list, which sits as plain small links under the counter.

### 3. Printed menus: 8
The sample is strong. The best of it: Moonstruck's Grand Ticino with a guest check and "Ronny, your baker" (08); Fright Night's studio lounge with a VIP card for Peter Vincent; From Russia with Love's Orient Express dinner menu with a sleeping car ticket punched at 3; Legally Blonde's Delta Nu spread with a photo booth strip (09); Moulin Rouge!'s Elephant Room; My Cousin Vinny's Wazoo Diner with "Southern for beginners" (grits, okra, sweet tea, biscuit); Night of the Living Dead's farmhouse chow line with "Stay indoors, board the windows" (10); Saturday Night Fever's 2001 Odyssey with the dance contest entry; Snow White's Dwarfs' Cottage luncheon in cents (11). Oliver!'s Fagin's Den newspaper, Rocky IV's recipe box, Flash Gordon's Mongo Palace feast and The Breakfast Club's library ration sheet are also very good. Review 10's PDF fixes hold: The Greatest Showman's "Museum Admission" and "Tonight" stubs and Kick-Ass's "Online costume order" print solid, and Zoolander's stray lettering is gone. Diner years hold (Rockwell Diner "Est. 1942", Castle Rock "Est. 1943", 29, 30).

Marks off:
- **Save PDF darkens the canteen layout.** A Nightmare on Elm Street prints its whole page through a brown wash: poster, menu trays and notes all go murky (04), while the same card on screen is bright (05). Shutter Island, Halloween II and Jumanji print the same way (06), and so do The Shawshank Redemption and Smile (07). Rain Man and other soft-toned canteens print fine. The faulty films are the canteen tones with a strong vignette: eerie (vig .5), gritty (.45) and tense (.4), 18 films in all. The vignette in menu-formats/canteen.js (line 139, `radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 60%,rgba(60,40,20,${t.vig}) 100%)`) is the only full-page layer left on those cards once the export copy hides the multiply tint, so html2canvas is very likely painting it flat across the page.
- **Wedding Crashers' invite cuts its own lines.** "to an evening of dinner and a film at" is half hidden under the poster, and the line under "THE CLEARY WEDDING, SEATING CHART" is cut through by the rule, on screen and in the PDF (12). Taken and other invites are fine; this poster is taller.
- **Odd prices on the layouts the price check skips.** Bad Boys' duty roster prices its dishes 2.12, 3.29, 3.37 and 2.72 (29); review 10 left precinct alone for its evidence tags, but these are menu prices. Hand-built menus are not checked either: Moonstruck's Champagne is 19.87 beside a card of 1.25 to 13.75 (08), Saturday Night Fever's Disco fizz 2.01.
- **Stand by Me's diner** still runs over three pages, but pages two and three now hold a fair amount each (30). Not counted as a fault this round.

### 4. Phone experience: 8
Printed menu first with dots (03), then the big-type text menu with "How to make it" under each dish (20). No sideways scroll on any view (scrollWidth 390 everywhere). Director's cut lands on "Choose dishes" with focus on the first tick (18). The Prep sheet reads well at phone size (19). The Candy bar combos are proper cards with 44px "Add combo" buttons (22). The store photo now shows on the phone with "Swipe the shop. Tap a sign to walk to that aisle" (23), and the rental slip opens at the top with member number, date, due back and cover in view (25). Marks off:
- **The far store signs are tiny to tap.** Horror is 47x13, Sci-fi 42x11, Drama 39x11 and Family 66x18 on the phone, and a tap test finds only 12 to 14px of height that hits each one (24). Review 10's fix note says these got a 44px tall tap area; on this commit they have not.

### 5. Core flow: 7
Lock-in is clear and Director's cut works (18). Review 10's dietDish fix holds: across 900 Prep sheets with No alcohol off, no grown-up film cooks an alcohol-free swap it did not ask for, and Scarface, Prizzi's Honor, Shaun of the Dead and Practical Magic all buy what their cards print. Shopping scales cleanly. Casino Royale at 2, 4 and 9: lamb chops 600g, 1.2kg, 2.7kg; figs 3, 6, 14; fennel 1, 1, 3 bulbs; the Vesper's gin 120ml, 240ml, 540ml. Vegetarian swaps prosciutto for chargrilled eggplant and haloumi on the card, list and method. No alcohol moves the Vesper to non-alcoholic gin and verjuice and drops the Bottle shop group. Raiders does the same with its prosciutto dates. Marks off:
- **Dry films buy alcohol when kids' mode is off.** 27 family, Christmas and wizard films print a dry card and then cook the boozy recipe. Christmas Vacation's card reads "Eggnog in moose mugs, cooked custard eggnog with fresh nutmeg, chilled overnight", while its Prep sheet lists "80ml dark rum" in You need and says "Stir in the rum and grate fresh nutmeg on top" (13). The Fellowship of the Ring buys 375ml dark ale and four bottles of brown ale for a card that shows none. Miracle on 34th Street buys red wine and brandy, Bad Santa brandy and bourbon, Krampus lager and red wine; the others are the Harry Potter, Fantastic Beasts and Hobbit films, Scrooged, Batman Returns, The Holiday, White Christmas and more. This is what the 0879840 change set out to do ("the plan, prep sheet and shopping keep the cook's own diet settings", dietMenuOnly in app.js), but the result is a card that promises one drink and a shopping list for another. The brief for this round is that dry themes never buy alcohol.
- **Kids' mode leaves drinking lines in the method.** No kids' mode Prep sheet buys alcohol, but GoldenEye's blini method ends "Serve beside frozen vodka" (14), Red Heat's showtime cue says "Pour the vodka when Danko orders his first drink", Django Unchained's says "Serve the beer when Dr Schultz pours two", Interstellar's "sit on the porch with a beer", Pirates of the Caribbean: Dead Men Tell No Tales "trades his compass for a bottle of rum", and Moulin Rouge!'s card footer still says "when Toulouse brings out the green absinthe" (17). The kids' word pass in app.js (KDRY, around line 1375) does not reach method steps or the showtime cue.
- **Small shopping oddities.** Casino Royale lists both "salt and pepper" and "salt" under Pantry. Raiders' frying oil is 2 L at 2 and 4 guests and 2.1 L at 9.

### 6. Candy bar: 8
Up from 3. The counter looks like a counter again on both sizes: the lit board with lamp-gold prices, "Tonight's combos for Moonstruck" as three cards with round snack photos and savings ("5.60, saves 80c"), the glass case in a grid, and the tray docket that reads "Nothing on the tray yet" and fills when a combo is added (21, 22). The merge guard in tests/merge-guards.test.cjs passes. Marks off: on the phone the page runs to about 3,200px for one film, so the tray sits a long way below the combos; and the snack photo credits are 33 links at 18px tall with no context in their names ("Capvi", "msgohan").

### 7. Galaxy Video store: 8
Still the most fun part of the site. Walk-in, shopfront, member card and deal board on the phone (23); the shop photo with aisle signs on both sizes, and clicking Horror walks to the aisle (26); the hire case and the slip with "Weekly $2.00", "Due back Thu, 12 Nov, 7pm", "$10 note, change $8.00" and "Be kind, please rewind" (25). The calendar strip does the right thing on every date tried: Movember, Friday the 13th and Christmas on 9 Nov; New Year's Eve with Summer holidays "In 7 days" on 27 Dec; Australia Day on 26 Jan; Lunar New Year and Valentine's Day on 12 Feb; Easter with April Fools on 25 Mar; Star Wars Day with Mother's Day on 1 May; nothing on 15 Jun (the strip hides, as set); Father's Day with Finals season on 30 Aug; Back to the Future Day with Halloween on 20 Oct. Marks off: the far signs on the phone are too small to tap (section 4, 24), and the shop's "Unwatched" and "Kids" toggles are 48x28.

### 8. Table kit: 8
Good pages again across the sample (27, 28): Gallipoli's signpost "Anzac Cove Mess" door sign and "Troopship pass" place cards, Moonstruck's, The Exorcist's and Casino Royale's kits all fit the venue. Place cards fold and the departures fix holds. Nothing new broken, nothing moved on since review 9.

### 9. Polish and craft: 8
No dashes of any kind in 900 cards and phone menus. No "undefined", "NaN" or "null" anywhere. No broken images, console errors, page errors or failed requests. Review 10's doubled words ("rich rich gravy", "SODA SODA") are gone with kids' mode off. All 795 shared cards pass the price check. Marks off:
- **Kids' mode doubles words in seven drink names.** "Happy's lemon lemon squash pitchers" (Happy Gilmore, 15), "Iceman's frozen lemon lemon squash slushie" (Top Gun), "Callahan lemon lemon squash" (Tommy Boy), "Mass quantities lemon lemon squash jug" (Coneheads), "Donald's porch lemon lemon squash" (Interstellar), "Elsinore maple lemon lemon squash" (Strange Brew), and "VIRGIN STRAWBERRY STRAWBERRY SLUSHIE" (Taken, 16). The shandy and lager swaps land next to an existing "lemon", and the fold list on app.js line 1401 has no "lemon" or "strawberry" in it.
- **US spellings in recipe lines.** scallion or scallions (Casino, Ghost Dog, Three Men and a Baby, The Secret of My Success, Manhattan, You've Got Mail, The Last Dragon, Shang-Chi); arugula (Inside Man, Die Hard); broiled (The Departed, Splash, Working Girl, Brewster's Millions, Sleepless in Seattle); ground beef (Road to Perdition, Mean Girls, Car Wash); molds (Up, Indiana Jones and the Temple of Doom, Romancing the Stone, Flubber, Honey I Shrunk the Kids, Rogue One); "chocolate egg centers" (Jurassic Park). About 30 lines.
- **Style slips.** Django Unchained's truck mixes "Dr. Schultz's Dentist Wagon" and "DR. KING SCHULTZ" with "Dr Schultz's lemon wheat beer" on the same card.

### 10. Accessibility basics: 8
lang is set, no duplicate ids on any view, every image has alt text (tape covers use empty alt with the title in the button text, which is right), the skip link comes first, controls have names and the store's aisle headings read "Movember, 11 tapes". Marks off: the far store signs (24); the watched ticks are still 22x22; the Candy bar credit links are 18px tall; "All options and prices" under where to watch is 24px tall, "How it works" 71x24.

## Fix list, ranked by impact

1. **Save PDF keeps the canteen bright.**
   Where: menu-formats/canteen.js line 139 (`vign`), and the export copy in app.js (the loop near line 2539 that already hides blend layers).
   Wrong: 18 canteen films with eerie, gritty or tense tone print under a brown wash: A Nightmare on Elm Street (04, 05), Shutter Island, Halloween II, Jumanji (06), The Shawshank Redemption, Smile (07).
   Good looks like: the PDF page matches the screen. Drop the vignette layer in the export copy or swap it for a plain inset shadow, and add the canteen eerie films to the PDF check.

2. **A dry card never buys grog.**
   Where: dietMenuOnly and planAll in app.js; data/recipes for the 27 films.
   Wrong: Christmas Vacation prints an alcohol-free eggnog and the Prep sheet buys 80ml dark rum and says "Stir in the rum" (13); The Fellowship of the Ring buys dark and brown ale; Miracle on 34th Street, Bad Santa, Krampus and 22 more buy alcohol for a dry card.
   Good looks like: for kids, fairytale, Christmas and wizard films the planner cooks the same alcohol-free versions the card prints, or the card prints what the planner cooks. Pick one. A test that fails if a dry-theme Prep sheet has a Bottle shop group.

3. **Kids' mode cleans method lines and cues too.**
   Where: the KDRY word pass in app.js (around line 1375) and where showtime cues and method steps are built.
   Wrong: "Serve beside frozen vodka" (GoldenEye, 14), "Pour the vodka" (Red Heat), "Serve the beer" (Django Unchained), "with a beer" (Interstellar), "a bottle of rum" (Dead Men Tell No Tales), "the green absinthe" (Moulin Rouge!, 17).
   Good looks like: with kids' mode on, no card, method, tip or cue mentions a drink a kid cannot have. Extend the kids' mode browser check to scan the Prep sheet text, not just the card.

4. **Fold the doubled kids' drink names.**
   Where: the fold list on app.js line 1401.
   Wrong: "lemon lemon squash" on Happy Gilmore (15), Top Gun, Tommy Boy, Coneheads, Interstellar and Strange Brew; "STRAWBERRY STRAWBERRY SLUSHIE" on Taken (16).
   Good looks like: any word doubled by a swap folds to one, not just the words on the list. A general `\b(\w+) \1\b` fold after the pass, with a short allow list (huli huli, peri peri, Nai Nai, Far Far Away), would catch these and the next ones.

5. **Make the far store signs tappable.**
   Where: the phone rules for `.sv-aisles` buttons in index.html.
   Wrong: Horror, Sci-fi and Drama take only 11 to 14px of tap height and Family 18px (24), despite review 10's note.
   Good looks like: every sign has a 44px tall hit area on the phone, checked with elementFromPoint, not just the box size. Add it to scripts/check-browser.cjs.

6. **Invite layout keeps its intro lines clear of a tall poster.**
   Where: menu-formats/invite.js, the cover column under the poster.
   Wrong: Wedding Crashers' "to an evening of dinner and a film at" is half covered and the line under "SEATING CHART" is cut (12).
   Good looks like: the poster box sizes to what is left after the venue name and lines, as the bar tab front now does.

7. **Prices on the skipped layouts.**
   Where: menu-formats/precinct.js and the hand-built menus in formats.js.
   Wrong: Bad Boys' roster at 2.12, 3.29, 3.37, 2.72 (29); Moonstruck's Champagne 19.87 (08); Saturday Night Fever's Disco fizz 2.01.
   Good looks like: evidence tags keep their cents, menu prices follow priceEnd. Run check-prices over hand-built menus too and list the year-coded ones for a person to judge.

8. **Small items.**
   US spellings in recipe lines (scallion, arugula, broiled, ground beef, molds, centers); Django's "Dr." beside "Dr"; Casino Royale's "salt and pepper" beside "salt"; Raiders' oil stepping to 2.1 L; watched ticks 22x22; Candy bar credit links 18px; store toggles 48x28.

## Genuinely excellent, leave alone

- The marquee, brass wheel, countdown and the spin landing on a printed menu (01, 02, 03).
- The Candy bar now it has its look back: combo names and prices from the film (21, 22).
- The grown-up alcohol fix: every grown-up card cooks what it prints, and No alcohol swaps cleanly.
- Hand-built menus: Moonstruck's Grand Ticino (08), Saturday Night Fever's 2001 Odyssey (11), The Godfather Part II.
- The best shared menus from this sample: From Russia with Love, Fright Night, Legally Blonde (09), My Cousin Vinny, Night of the Living Dead, Moulin Rouge! (10), Snow White, Oliver!, Flash Gordon, Rocky IV, The Breakfast Club.
- Shopping lines that scale cleanly at 2, 4 and 9, and Vegetarian swaps that rewrite card, list and method.
- Lock-in, Director's cut and the phone planner (18).
- Galaxy Video end to end and the holiday calendar on every date tried (23, 25, 26).
- Table kit door signs and place cards (27, 28).
- A clean run: no console errors, failed requests, broken images, dashes or leaked "undefined" anywhere, and every test and check script passing.

## Fixed after the review

- Fix 1, canteen PDF (5 Nov): the export copy leaves out the canteen's vignette layer (data-vig), which html2canvas painted as a brown wash, and prints the tray wells with a plain edge instead of a blurred inset shadow (data-well). A Nightmare on Elm Street and Shawshank print as they show.
- Fix 2, dry cards (5 Nov): kids, fairytale, Christmas and wizard films now cook and shop the alcohol-free versions the card prints (planDish in app.js), with No alcohol off. Christmas Vacation and The Fellowship of the Ring buy nothing from the bottle shop; Scarface still buys rum. tests/dry-plan.test.cjs checks all 205 dry-theme films and 392 grown-up ones.
- Fix 3, kids' mode cues (5 Nov): the Prep sheet and table kit get the same dry pass as the card. Drinking phrases are reworded as a whole ("Serve beside a cold drink", "Pour the drinks", "a bottle of lemonade", "the green cordial") before single words are swapped.
- Fix 4, doubled words (5 Nov): any word a swap doubles folds to one, keeping the source spelling ("lemon squash", "VIRGIN STRAWBERRY SLUSHIE"); doubles the film wrote itself (Huli huli, Nai Nai) stay.
- Fix 5, store signs (5 Nov): on the phone each aisle sign on the shop photo has a clear tap pad at least 44px tall behind it (a big near sign grows upward only, so it never covers the far signs). scripts/check-store-taps.cjs measures every sign with elementFromPoint and taps above Horror to check it walks to the aisle. Measured: 44 to 50px.
- Fix 6, invite (5 Nov): the cover lines under a poster never clip their first line, and the tagline steps aside when a long venue name needs two lines (Wedding Crashers).
- Fix 7, prices (5 Nov): precinct menu prices land on price endings (Bad Boys 2.12 now 2.25); evidence tags keep their own cents. Not changed yet: the hand-built menus' year-coded prices (Moonstruck's Champagne 19.87, Saturday Night Fever's Disco fizz 2.01, about 30 more), which are film-year winks; left for Josh to decide.
- Fix 8, small items (5 Nov): Australian spelling in recipe lines (spring onion, rocket, grilled, beef mince, moulds, capsicum, cling wrap); Dr without a stop except in film titles (Dr. No, Dr. Strangelove); the frying pot covers a splash of the same oil (Raiders reads 2 L at 2, 4 and 9); "salt and pepper" covers a plain salt line (Casino Royale); store switches, aisle chips and footer credit links are 44px or more to tap on the phone.
- Also this round (review 10 leftovers): diner films whose number cannot sit in the cents print "Plate No. 57." on the special (Iron Giant and six more); the six poster editions now cook a savoury second starter and serve their sweet with the sweets.
