# Twelfth independent review

**Overall: 8.4 out of 10**

Every fix from review 11 holds. Dry cards no longer buy grog: Christmas Vacation, The Fellowship of the Ring, Miracle on 34th Street and Krampus have no Bottle shop group, and Scarface still buys its rum. Kids' mode now cleans Prep sheets and phone menus: GoldenEye, Top Gun, Strange Brew and Batman come up dry with no doubled words. The canteen prints bright: A Nightmare on Elm Street and Shawshank match the screen (13). Wedding Crashers' invite lines are clear, Bad Boys' roster lands on price endings, and the far store signs on the phone take 44 to 50px of tap height. Vegetarian plus No alcohol came out clean on all 900 Prep sheets, with no meat and no alcohol in any shopping list. Every test and check script passes. The phone experience and Galaxy Video are close to finished.

What keeps this short of 9.5 is mostly Save PDF again. The canteen fix stopped one wash, but the same fault shows on other layouts. About 24 gritty and scrappy films on the airline, bistro, hotel, saloon and banquet layouts print under a flat tan or grey film: Die Hard 2's red headings and prices nearly vanish (09), and Bridget Jones, The Hangover, John Wick, Tombstone, Lock, Stock and Batman Begins go the same way (11, 14, 15, 24). The seven night diners print their background still sharp and bright, when the screen blurs and darkens it (18). Smaller faults sit on top of that. Kids' mode still prints a Manhattan on The Out-of-Towners (21). Three Prep sheets cut off their showtime cue on paper (06). Shopping lines read "1 packet banana leave" and "1 dried chilly" (12). A handful of cards cut their own words.

Tested with Playwright and Google Chrome at 390x844 (touch, 3x) and 1440x900, on a local server at commit 6a95847 on wip/store-overhaul, with service workers blocked. Every finding below was checked against a screenshot, not just the DOM. Screenshots are docs/review-12-01.png to review-12-33.png.

## How it was tested

- First visit and spin on both sizes, by tap and by click, through the welcome card and the countdown (01 to 04).
- 62 films opened through Save PDF with every page rendered by pdftoppm, plus phone text menu and table kit. 47 of them are named in none of reviews 2 to 11; the other 15 (the second film on airline, hotel, bistro, saloon, prom, pub and the like) were picked to chase the print fault across layouts. Hand-built: The Godfather Part III, A Bronx Tale, Midnight Cowboy, Lady and the Tramp, Ghostbusters II. Invite: Breakfast at Tiffany's, Midsommar, The Sound of Music. Truck: Aladdin, Once Upon a Time in Mexico, Nope. Airline: Die Hard 2, Jackie Brown, Con Air, Final Destination. Kiosk: Finding Nemo, The Lost Boys. Diner: The Birds, Shaft. Galley: Pirates of the Caribbean: The Curse of the Black Pearl. Candy bar: Who Framed Roger Rabbit, Chasing Amy, True Romance. Canteen: Armageddon, The Santa Clause, Singin' in the Rain. Tearoom: Cinderella. Club: Rush Hour, The Terminator, Desperado. Precinct: Saw II, The Naked Gun, Reservoir Dogs. Campfire: Butch Cassidy and the Sundance Kid. Lab: Hereditary, Inside Out. Hotel: Rosemary's Baby, The Hangover, John Wick, The Others. Cafe: The Babadook. Tavern: The Witch, The Sword in the Stone. Placemat: Poltergeist, Office Space. Bartab: The Crow. Bistro: One Hundred and One Dalmatians, Bridget Jones's Diary. Prom: West Side Story, Carrie. Banquet: My Fair Lady, Batman Begins. Takeaway: Blade Runner 2049. Dining car: Collateral. Saloon: Lock, Stock and Two Smoking Barrels, Tombstone. Home: Rear Window. Motel: Creed II. Tiki: Thunderball. Newspaper: Scream 2, Clerks. Pub: Hot Fuzz. Eras 1950 to 2022. Screen against PDF compared side by side on all dark-toned ones.
- Phone printed menu with swipe and tap to zoom (Thunderball, 20) and phone text menu (Rear Window, The Witch, Space Jam, Blade Runner 2049).
- A script pass over all 900 films three times: kids' mode off, kids' mode on, and Vegetarian plus No alcohol. It read card, phone and Prep sheet text for dashes, US spellings, doubled words, "undefined", "NaN" and "null", alcohol and meat. Every hit was then opened on a fresh page load and looked at, because the phone dry pass runs a tick after the card draws.
- A clipped-text pass over every card (boxes whose text is taller or wider than the box), then the hits opened. An A4 overflow pass over every Prep sheet page as Save PDF lays it out.
- Prep sheet and shopping at 2, 4 and 9 guests, kids' mode off and with Vegetarian plus No alcohol, on Some Like It Hot, Once Upon a Time in Mexico and The Santa Clause. Lock-in with Director's cut and The full feature on the phone.
- Rechecked every item under review 11's "Fixed after the review".
- Candy bar on both sizes with Some Like It Hot, adding a combo (27, 28).
- Galaxy Video on the phone end to end: walk in, shopfront, signs, Family aisle by tapping the sign, hire case, rental slip (07, 08). Desktop signs, Sci-fi aisle, case and slip (25). Calendar strip on 5 Nov and 20 Dec 2026, and 10 Feb, 20 Apr, 4 Jul, 1 Sep and 28 Oct 2027 (26).
- Table kit pages for the sample (29, 30), and a name-fit pass over 150 films.
- Node tests in tests/ (all 17 pass, dialogs included), scripts/check-browser.cjs (pass), scripts/check-store-taps.cjs (pass, 44 to 50px), scripts/check-cut-words.cjs (pass, two lines written that way in the data), scripts/check-prices.cjs (795 cards, pass), scripts/check-sweet-starters.cjs (20 kept, 0 to move).
- Accessibility: names on controls, alt text, headings, duplicate ids and tap height by elementFromPoint on the box office, Candy bar and store.
- Console errors, page errors and failed requests watched on every run: none.

## Scores

| Area | Score |
|---|---|
| 1. First impression and visual identity | 9 |
| 2. Brand consistency (cinema vs Galaxy Video) | 9 |
| 3. Printed menus | 7 |
| 4. Phone experience | 9 |
| 5. Core flow (spin, menu, lock-in, shopping, cooking) | 8 |
| 6. Candy bar | 8 |
| 7. Galaxy Video store | 9 |
| 8. Table kit | 8 |
| 9. Polish and craft | 8 |
| 10. Accessibility basics | 9 |
| **Overall** | **8.4** |

### 1. First impression and visual identity: 9
The welcome card says what the site does in three short steps over the marquee (01). Dismiss it and the box office reads at once (02). A desktop spin landed on The Matrix Reloaded with its menu in view (03). The phone spin landed on Spider-Man with the printed menu first and swipe dots under it (04). No sideways scroll on any view. Nothing to mark off.

### 2. Brand consistency: 9
Cinema red and gold on the box office, lock-in and Candy bar (27, 28). Galaxy Video purple, gold, teal and pink from the walk-in to the slip (07, 25). The two never mix. The Candy bar's photo credits now sit behind one "Snack photo credits" link, which fixes review 11's mark. Held at 9, not 10, only because the store's calendar strip spells months three ways: "Until 31 July", "Until 5 Sept" and "Until 30 Nov".

### 3. Printed menus: 7
Down from 8. The sample is still strong on screen. Highlights: Thunderball's Palmyra Terrace with a fold-out island map; Rosemary's Baby's Bramford Kitchen with the tannis root charm, which prints as it shows; Midsommar's Harga feast hall invite; Pet Sematary's recipe box; Breakfast at Tiffany's; Hereditary's and Inside Out's lab ration sheets; Hocus Pocus's Sanderson cottage priced in gold pieces; Weekend at Bernie's island map; Butch Cassidy's campfire with a vanilla tea sour. Review 11's canteen fix holds (13). Year-coded prices on hand-built menus (Midnight Cowboy 1.69 and so on) are Easter eggs and not marked off.

Marks off:
- **Save PDF washes out gritty and scrappy films on five layouts.** Die Hard 2 (airline, gritty) prints its whole page under a tan film. The red "TO BEGIN", "MAIN COURSE" and "DESSERT" headings and every price fade almost to nothing, while the screen is crisp (09). Con Air does the same (11). On hotel, The Hangover and John Wick print grey-brown over cream (11). On bistro, Bridget Jones's Diary goes from cream to mud (14). On saloon, Tombstone (15) and Lock, Stock (24) drop contrast by about a quarter. On banquet, Batman Begins prints Wayne Manor under a grey film (24). Measured: page brightness falls 15 to 30 per cent and contrast up to 45 per cent from screen to PDF. About 24 films are exposed (gritty and scrappy tones on airline, bistro, hotel, saloon and banquet). The likely cause is the same as review 11's canteen fault. html2canvas paints a big blurred inset shadow or a radial vignette as a flat wash. Those layers are paperLayers in menu-formats/airline.js line 116, bistro.js and hotel.js line 80 (`box-shadow:inset 0 0 ${40+w*120}px`), saloon.js line 247 and the radial vignette in banquet.js line 123. The export loop in app.js (around line 2557) only skips `data-vig`, and these layers do not carry it. Dark-paper tones (Final Destination, The Others, Rosemary's Baby) and placemat, kiosk, motel and prom print fine.
- **Night diners print their backdrop sharp.** On screen The Birds and Shaft sit on a blurred, darkened still. In the PDF the still prints sharp and bright behind the whole front: Tippi Hedren's face fills the margins, the "Bodega Bay, mind the gulls" line is lost, and "A San Francisco socialite follows a man..." is hard to read (18). menu-formats/diner.js line 112 uses `filter:blur(18px) brightness(.34)`, which html2canvas ignores. Seven films: Halloween (1978), The Birds, The Blues Brothers, Lethal Weapon 3, Shaft, Rocky III and Million Dollar Baby.
- **Cards that cut their own words.** Singin' in the Rain's kicker reads "MONUMENTAL PICTURES: TALKIES SOO" on screen and on paper (32). Lady and the Tramp's "Breadsticks, Long and salted, in a crock on every table." loses "table." under the bottom border, on screen and in the PDF (05). The Santa Clause's canteen card ends "Found in the Santa suit," and drops its second line, "read the fine print." (19).
- **Batman Begins' logo is unreadable.** The white-lettered logo sits on a cream plate, so it reads "AN BE" between two bat wings, on screen and in print (23).
- **Odd layout bits.** Final Destination's trolley drink "Premonition French 75" wraps so "75" sits under the price "4.50" and reads like a second price (16). Shanghai Noon prints "REWARD $00" and "Bill no. 00" because a year-2000 film with no film number falls back to "00" (31, saloon.js line 97). X-Men and Chicken Run print "No. 00" on their canteen chits for the same reason (canteen.js line 122). Finding Nemo's kiosk prices "42 Wallaby Way chicken schnitzel" at 42.00 beside tacos at 12.50 and snacks at 5.25 to 7.75 (17). That is a film-number price on a shared layout, which the house rules say use period prices (kiosk.js line 343, numPrice).

### 4. Phone experience: 9
Up from 8. The far store signs are fixed: Horror, Sci-fi, Drama and Family all take 44 to 50px of tap height, and a tap above the Horror sign walks to the aisle. The printed menu shows first with dots and "Tap the menu to read it full size". Tap to zoom opens a paged viewer with Fit, plus, minus and "Page 1 of 2". The text menu below has big type and tabs for Starters, Mains, Sweets and Drinks (20). Lock-in asks Director's cut or The full feature, and Director's cut lands on the dish picker with times beside each dish. Prep sheet reads well at phone size (12). No sideways scroll. Held from 10 only because small hand-built cards like The Witch's homestead are very small in the swipe view (prices about 4px tall at 390 wide). Zoom fixes it, but the first look is a postage stamp (20).

### 5. Core flow: 8
Review 11's two flow faults are fixed. With kids' mode off, no dry-theme Prep sheet has a Bottle shop group, and grown-up films still buy their drinks (Scarface's rum). With kids' mode on, no kid-safe film's Prep sheet or phone menu mentions a drink a kid cannot have, checked on a fresh load of each film the scan flagged. Vegetarian plus No alcohol came out clean on all 900: no meat line and no Bottle shop on any list. Shopping scales: Some Like It Hot at 2, 4 and 9 gives lobster tails 2, 4, 9; bourbon 120ml, 240ml, 540ml; prawns 250g, 500g, 1.1kg. Vegetarian swaps the prawns for king oyster mushrooms and the pancetta for crispy eschalots in list, method and title.

Marks off:
- **Kids' mode misses hand-built drink names.** The Out-of-Towners is kid-safe, and with kids' mode on its Waldorf card still lists "Manhattan 1.25, Rye, sweet bitter orange and bitters, stirred, with a cherry" beside an alcohol-free Olive Twist (21). Shanghai Noon's saloon keeps "Rye and jasmine tea highball" under "AT THE BAR" and "NOODLES, ROOMS AND RYE" over the sign (31). The drink itself is tea, so this is the name. The KDRY word list in app.js has no "Manhattan" or "Rye", and Dr. No's "BAR TAB" prop also stays. Coneheads' kids' version is "A jug of alcohol-free lager and lemonade", which is beer for kids in all but name.
- **Shopping lines that read wrong.** Once Upon a Time in Mexico at 2 guests: "1 packet banana leave", "1 dried chilly" (12); at 9, "3 chipotle in adobos". Vegetarian adds "1 565g can young green jackfruit in brine" and, at 4, "2 565g cans". "chipotle in adobos" shows on about ten films (Toy Story 2, Deadpool, Arrival, Megamind, Halloween 2018 and more), and Moana has "1 handful mint leave". The Sound of Music at 4 lists "4 1/3 tbsp mustard", "2 tbsp chives" and "1 bunch chives", "2 tbsp parsley", and salt three ways ("salt", "salt flakes", "pinch of salt"). Some Like It Hot's "aromatic bitters, 8 dashes" stays at 8 for 2, 4 and 9, while the ice goes to "13 1/2 cups". The singular pass (planPlural and planOne in app.js) turns "leaves" into "leave" and "chillies" into "chilly", and pluralises the wrong word in "chipotle in adobo".
- **Three Prep sheets lose their cue on paper.** When the shopping list is long, page 1 of the Save PDF Prep sheet runs past A4 and the showtime cue is cut through: The Sound of Music by 22px (06), Idiocracy by 64px, Knocked Up by 19px. prepParts in app.js (line 786) splits pages by method steps only, so page 1 still carries the full list.

### 6. Candy bar: 8
The counter holds its look on both sizes: the lit board in 1959 prices ("POPCORN SM 45C"), "Tonight's combos for Some Like It Hot" with "Jerry's order" and "Some Like It Hot for two" carrying the venue line "Florida Season. Orchestra Nightly.", the glass case and the tray (27, 28). Adding a combo marks it "In your tray" and fills the docket. The credits are tidied behind one link. Marks off: the phone page is still about 3,240px for one film, so the tray is a long way below the combos (28). The combo cards price in dollars ("1.10, Saves 20c") under a board priced in cents ("45C"). That reads as two price styles on one counter.

### 7. Galaxy Video store: 9
Up from 8. On the phone: walk-in, shopfront, member card, the shop photo with signs, a tap on Family walks to the Family aisle, the hire case, and the slip with "Weekly $2.00", "Due back Thu, 12 Nov, 7pm", "$10 note, change $8.00" and "Be kind, please rewind" (07, 08). On desktop: signs on the photo, the Sci-fi aisle, case and slip (25). The calendar strip is right on every date tried. 5 Nov shows Movember and Christmas. 20 Dec shows Christmas with New Year's Eve "In 11 days". 10 Feb shows Lunar New Year and Valentine's Day. 20 Apr shows ANZAC Day with Mother's Day "In 19 days". 4 Jul shows Christmas in July. 1 Sep shows Father's Day with Finals season. 28 Oct shows Halloween and Melbourne Cup with Movember "In 4 days" (26). The aisles reorder to match. The shop toggles now take 49px of tap height. Only the month spellings in the strip hold it back (section 2).

### 8. Table kit: 8
Good pages across the sample (29): West Side Story's "Dance at the Gym" marquee and red gym-dance tickets; The Witch's "1630" goat tags for Black Phillip; Die Hard 2's departures and arrivals boards; The Santa Clause's card-style place cards; Shaft's detective cards and intermission card that match the menu. Mark off: on the West Side Story ticket the guest name "SAM" sits on top of the line under it, so the tops of "SATURDAY NIGHT" touch the name and "JORDAN" loses its lower edge (30). A pass over 150 films found the same squeeze on Hocus Pocus 2 (name box 30px for 40px type). kitFit in app.js sizes the name but leaves the line height too tight for capitals.

### 9. Polish and craft: 8
No dashes of any kind, and no "undefined", "NaN" or "null", across 900 cards, phone menus and Prep sheets in all three modes. No broken images, console errors, page errors or failed requests. Doubled words from the kids' swap are gone (Happy Gilmore, Top Gun, Tommy Boy, Coneheads, Strange Brew all clean). Marks off:
- **US spellings left after review 11's fix.** "Brown butter, chocolate egg centers." on Jurassic Park's dino egg cookies, which review 11 named (33, formats/jurassic.js). "Scallion pancakes" on Shang-Chi's card (22) and The Last Dragon's, from the house lines in data/film-house.json (lines 6247 and 7660), which the recipe-line fix did not reach. "a jug of heavy cream" on The Out-of-Towners (21, formats.js). Names like "Visitor Center" and "Command Center" are proper nouns and fine.
- The cut words and dangling comma listed under section 3.

### 10. Accessibility basics: 9
Up from 8. lang is set, no duplicate ids on any view, every image has alt (tape covers use empty alt with the title in the button), headings run in order (h1 marquee, h2 view, h3 sections, h4 dishes, store aisles read "Horror, 30 tapes"). Tap height by elementFromPoint: store signs 44 to 50px, store switches 49px, watched ticks 44px through their row label, Candy bar controls all 44px or more. Nothing new to mark off; held from 10 because the hand-built cards' tiny swipe-view type (section 4) leans on zoom for anyone with low vision.

## Fix list, ranked by impact

1. **Save PDF matches the screen on gritty and scrappy films.**
   Where: paperLayers in menu-formats/airline.js (line 116), bistro.js, hotel.js (line 80); saloon.js line 247; banquet.js line 123; the export loop in app.js near line 2557.
   Wrong: Die Hard 2's headings and prices fade into a tan wash (09); Con Air, The Hangover, John Wick (11), Bridget Jones's Diary (14), Tombstone (15), Lock, Stock and Batman Begins (24) all print a grey-brown film over the page. About 24 films.
   Good looks like: tag every full-page inset shadow and vignette layer (data-vig or a shared class) so the export copy drops it, as canteen now does. Add one gritty film per shared layout to a PDF brightness check that compares the rendered page to the screen.

2. **Night diners print their backdrop blurred and dark.**
   Where: menu-formats/diner.js line 112 (the night backdrop img).
   Wrong: The Birds and Shaft print a sharp, bright still behind the front page, losing the top line and the blurb (18). Seven films.
   Good looks like: in the export copy, swap the filtered img for a pre-darkened copy (draw it to a canvas with the filter first) or drop it for the plain night colour.

3. **Kids' mode catches hand-built drink names.**
   Where: the KDRY word list in app.js; formats.js (The Out-of-Towners); data for Shanghai Noon.
   Wrong: "Manhattan 1.25, Rye, sweet bitter orange and bitters" on The Out-of-Towners with kids' mode on (21); "Rye and jasmine tea highball" and "NOODLES, ROOMS AND RYE" on Shanghai Noon (31); "alcohol-free lager" for Coneheads' kids.
   Good looks like: no cocktail name, spirit or beer on any kid-safe card in kids' mode. Add "Manhattan", "rye" as a drink, "highball" and "bar tab" to the pass, and run the kids' browser check over hand-built cards, not just shared ones.

4. **Shopping lines read as real words.**
   Where: planPlural and planOne in app.js; tests/shop-lines.test.cjs.
   Wrong: "1 packet banana leave", "1 dried chilly" (12), "3 chipotle in adobos", "1 565g can young green jackfruit", "1 handful mint leave"; The Sound of Music's "4 1/3 tbsp mustard", chives listed twice, salt three ways; bitters stuck at "8 dashes" at 9 guests.
   Good looks like: an irregular-words list for the singular pass (leaves, chillies), plural on the head noun ("chipotles in adobo"), "a 565g can" not "1 565g can", thirds rounded to a half, and same-item lines merged across units. Add these cases to the shop-lines test.

5. **Prep sheet page 1 fits on A4.**
   Where: prepParts in app.js (line 786).
   Wrong: The Sound of Music's showtime cue is cut through on paper (06); Idiocracy runs 64px over, Knocked Up 19px.
   Good looks like: when page 1 is too tall with the full shopping list, move the list's second half or the first method step to page 2. Add the A4 overflow check over all 900 films to the scripts.

6. **Cards keep their own words.**
   Where: canteen.js kicker (Singin' in the Rain), formats.js (Lady and the Tramp), canteen.js prop card (The Santa Clause), airline.js trolley column (Final Destination), banquet.js logo plate (Batman Begins).
   Wrong: "TALKIES SOO" (32); "table." lost under the border (05); "Found in the Santa suit," with no second line (19); "French / 75" under the price (16); "AN BE" logo (23).
   Good looks like: kicker lines shrink to fit, as fitLines does elsewhere; the prop card shows both lines; drink names keep the price on their own line; light logos get the dark plate, as other layouts already do.

7. **No "00" numbers and no film-number prices on shared layouts.**
   Where: saloon.js line 97, canteen.js line 122, kiosk.js line 343.
   Wrong: Shanghai Noon "REWARD $00" and "Bill no. 00" (31); X-Men and Chicken Run "No. 00"; Finding Nemo's schnitzel at 42.00 beside 12.50 tacos (17).
   Good looks like: year 2000 falls back to the full year or a venue number; film numbers only set the cents on shared cards, as the house rules say.

8. **Small items.**
   "chocolate egg centers" on Jurassic Park (33), "Scallion pancakes" in film-house.json (22), "heavy cream" on The Out-of-Towners; guest names squeezed on West Side Story and Hocus Pocus 2 kit tickets (30); calendar months as "July", "Sept" and "Nov" in one strip; Candy bar combos in dollars under a board in cents; the long phone Candy bar page.

## Genuinely excellent, leave alone

- The marquee, wheel, countdown and the spin landing on a printed menu on both sizes (01 to 04).
- The dry plan and the kids' word pass on Prep sheets and phone menus: clean across all 900 films, with grown-up films still cooking what they print.
- Vegetarian plus No alcohol across the whole library, with swaps that rewrite title, list and method.
- The phone printed menu, paged zoom and text menu (20), and Director's cut.
- Galaxy Video end to end, the fixed sign taps and the holiday calendar on every date tried (07, 08, 25, 26).
- Hand-built menus and the best shared ones in this sample: Thunderball, Rosemary's Baby, Midsommar, Hocus Pocus, Weekend at Bernie's, Hereditary, Inside Out, Pet Sematary.
- The canteen print fix (13) and Bad Boys' roster prices.
- Table kit door signs and place cards that match each venue (29).
- A clean run: no console errors, failed requests, broken images, dashes or leaked "undefined", and every test and check script passing.
