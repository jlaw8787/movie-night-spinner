# Store listing drafts: App Store and Google Play

Drafted 11 Nov 2026 for Josh to edit. Everything here is based on how the site works today (app.js, index.html, privacy.html). The native features in the plan (offline build, share sheet, reminder notification, haptics, AirPrint) are not built yet, so the copy below does not claim them. Add them once they work in the app build.

Character counts are in brackets and were checked by script.

Links to use in both stores:
- Support URL: https://reeldinner.com/support
- Privacy policy URL: https://reeldinner.com/privacy
- Marketing URL (Apple, optional): https://reeldinner.com
- Contact email: privacy@reeldinner.com (the only address that exists)

Artwork rights: the posters and film stills shown in the app come from TMDB and belong to the studios. The rights question (Apple guideline 5.2.1) is parked, per APP-STORE-PLAN.md. That affects the screenshots too, see the shot list.

---

## 1. App name and subtitle

Apple: name max 30, subtitle max 30. Apple searches the name and subtitle already, so do not repeat their words in the keywords.
Google: app name max 30, short description max 80.

### Top three

1. Name `Reel Dinner` (11). Subtitle `Spin a film, get the dinner` (27)
2. Name `Reel Dinner` (11). Subtitle `Movie night menus, 900 films` (28)
3. Name `Reel Dinner: Movie Night` (24). Subtitle `Themed menus for 900 films` (26)

### Other subtitle options

- `Dinner and a movie, sorted` (26)
- `Movie night menus and recipes` (29)
- `A menu for every film you pick` (30)

### Google short description options

- `Spin a wheel of 900 films and get a themed dinner menu, recipes and shopping list.` (82, too long, use the next one)
- `Spin for a film and get a themed dinner menu, recipes and a shopping list.` (74)
- `Pick a film, get the dinner: themed menus, recipes and shopping lists.` (70)
- `900 films, each with its own dinner menu, prep sheet and shopping list.` (71)

---

## 2. Promotional text (Apple, max 170)

Can be changed any time without a new build.

```
Can't pick a film? Spin the wheel. Every one of the 900 films comes with its own dinner menu, recipes, timings and a shopping list. Free, with no account needed.
```
(161)

---

## 3. Full description

Same text works for both stores (Apple max 4000, Google max 4000). Google does not allow calls to action like "download now" or claims like "best", so none are used.

```
Reel Dinner plans dinner and a movie in one go. Spin the wheel, land on a film, and get a dinner menu made for it, with recipes, timings and a shopping list.

PICK A FILM
Spin the wheel at the box office, or choose which films go on it with Tonight's programme. Browse every film on the shelves at Galaxy Video, a 1990s video store with aisles, search and filters. Or start from food at the Candy bar: tap a treat and it finds films that serve it. There are 900 films, from family favourites to late-night horror.

GET THE MENU
Every film has its own menu with dishes drawn from the movie: snacks, a main, something sweet and a drink. Each menu has its own design, ready to print or save as a PDF for the table.

COOK IT
The Prep sheet has the recipes and a timeline that works back from showtime, so you know when to start. Change the number of guests from 1 to 60 and the recipes and shopping list scale with it. Choose which dishes to make, and switch on vegetarian or no alcohol. Easy cook mode cuts the menu back to two simple dishes.

PLAN THE WEEK
Lock in a film for the week, pick Friday, Saturday or Sunday and a showtime, and add it to your calendar with reminders for when to start cooking and any prep to do ahead. Tick off the shopping list as you go.

KIDS MODE
Kids mode shows only films rated G or PG, and every menu, prep sheet and shopping list switches to the alcohol-free versions.

MORE
- Double feature: two films, one menu and one shopping list
- Mystery night: cook the menu blind and open the envelope to find out the film
- Trivia spin, a Table kit with place cards and a door sign, and a story image to share
- Where to watch, by streaming service
- Favourites, star ratings, a watched list and your ticket stubs
- Request a movie if the one you want is missing

YOUR DATA STAYS WITH YOU
There is no account to make. Your picks are saved on your device. If you want them on another phone or computer, you can put your Galaxy Video member card online with a member number and a 4-digit PIN. No email or phone number is asked for, and you can delete the online card from inside the app at any time. No ads, no analytics, no tracking.

Film posters and photos come from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB. Where to watch data by JustWatch.
```
(2,306)

---

## 4. Keywords (Apple, max 100, comma separated, no spaces)

Words already in the name and subtitle ("reel", "dinner", "spin", "film") are left out, Apple indexes those anyway. This list assumes subtitle option 1. Redo the keywords once the subtitle is picked: with option 2 or 3, "spin" and "film" become free to use and "movie night" would repeat the subtitle.

```
movie night,menu,recipes,shopping list,family,party,themed,cook,popcorn,snacks,printable,wheel
```
(94)

Google has no keyword field. It reads the title, short description and full description.

---

## 5. Categories

- Apple: primary Food & Drink, secondary Entertainment.
- Google: Food & Drink. Tags to pick in Play Console (from Google's list): recipes, meal planning, movies, if offered.

Food & Drink has less competition than Entertainment and matches what people actually do with the app (cook).

---

## 6. Age rating

### The main question: alcohol

In adult mode, about 640 of the 900 menus mention alcohol somewhere (a cocktail, wine, beer or a spirit in a recipe). Counted by script across data/film. Kids mode and the family, fairytale, Christmas and wizard films switch to alcohol-free versions.

Under Apple's current table, "Alcohol, Tobacco, or Drug Use or References" set to Infrequent gives 13+, and Frequent gives 18+.

Decided: the answer is Frequent, so the app is rated 18+ (recorded in docs/APP-STORE-PLAN.md on main).

Confirm the rating in App Store Connect's preview before saving. Apple reworked this table in 2025 and may change it again.

Devices on OS versions before 26 use Apple's older Global table instead, where Frequent gives 17+ and Infrequent gives 12+.

### Apple age rating questionnaire answers

Content descriptors

| Question | Answer | Reason |
|---|---|---|
| Alcohol, Tobacco, or Drug Use or References | Frequent | Drink recipes on most adult menus. A handful of tobacco and drug mentions in film descriptions |
| Horror/Fear Themes | Infrequent | 74 horror films out of 900. Posters and one-line descriptions can be unsettling. Kids mode hides them |
| Mature or Suggestive Themes | Infrequent | Some film descriptions (crime, war, R18+ films) touch on adult themes |
| Profanity or Crude Humour | Infrequent | Mild words ("damn", "crap") appear in a few menus |
| Cartoon or Fantasy Violence | Infrequent | Posters for animated and superhero films |
| Realistic Violence | Infrequent | Posters and stills for action, war and crime films may show weapons |
| Guns or Other Weapons | Infrequent | Film posters and stills show guns, swords and the like. Nothing in the app is about weapons |
| Prolonged Graphic or Sadistic Realistic Violence | None | |
| Sexual Content or Nudity | None | Check the posters for R18+ films before submitting |
| Graphic Sexual Content and Nudity | None | |
| Gambling | None | No real money |
| Simulated Gambling | None | The wheel picks a film. Nothing is staked or won |
| Contests | None | Trivia spin has no prizes |
| Loot Boxes | None | No purchases of any kind |
| Medical or Treatment Information | None | |
| Health or Wellness Topics | No | Vegetarian is a menu option, not health advice |

Capabilities and features

| Question | Answer | Reason |
|---|---|---|
| Unrestricted Web Access | No | Outside links (TMDB, JustWatch, streaming services) open in the browser. The trailer player only plays one set YouTube trailer |
| User-Generated Content | No | Nothing a user writes is shown to other users. The request form goes only to us |
| Social Media | No | |
| Messaging and Chat | No | No contact between users |
| Advertising | No | |
| Parental Controls | No | Kids mode is a content filter, not a locked parental control |
| Age Assurance | No | |
| In-app purchases | No | |

### Google Play content rating (IARC questionnaire)

Pick the category closest to "Utility, Productivity, Communication, or Other" (it is not a game, social app or news app). Then:

| Question | Answer | Reason |
|---|---|---|
| Violence | No depictions in app content. If asked about images, yes: some film posters show weapons or mild violence | Posters only, no violent content made by the app |
| Fear | Yes, mild: horror film posters and descriptions | 74 horror films |
| Sexuality | No | |
| Language | Yes, mild | "damn" and "crap" in a few menus |
| Controlled substances: references to alcohol | Yes | Drink recipes in adult menus |
| Controlled substances: tobacco or drugs | Yes, references only, rare | A few film descriptions |
| Does the app encourage or glamorise use by minors | No | Kids mode removes alcohol |
| Crude humour | No | |
| Gambling, simulated gambling | No | The wheel is a random film picker with no stake |
| Do users interact or exchange content | No | |
| Does the app share the user's location | No | The app never asks for location |
| Digital purchases | No | Free, no in-app purchases |
| Unrestricted internet access | No | |

Expect a rating around 12 to 16 depending on region (alcohol references drive it). The certificate shows the result for each region before you accept it.

---

## 7. Apple App Privacy ("nutrition label")

What the app actually sends anywhere, from app.js and privacy.html:

| Where | When | What |
|---|---|---|
| Supabase (our sync function, servers in Sydney) | Only if the user taps Put my card online, or Use my card from another device | Member number, a scrambled PIN, the optional name on the card, watched list, favourites, ratings, ticket stub history, weekly plan, rentals count, rentals per aisle and tapes out, the last 8 films spun, counter treats ticked when renting, kids mode and skip-watched settings |
| Netlify Forms (our host) | Only when the user sends Request a movie | Film title, year, optional name, optional note |
| TMDB image server | Every time a poster or still is shown | Normal image request (IP address, device details). No data from the app |
| YouTube (youtube-nocookie.com) | Only when the user presses play on a trailer | Normal video request |
| Outside links (JustWatch, TMDB, streaming services) | Only when tapped, opens the browser | Nothing from the app |

There are no analytics, ads, crash reporting or tracking SDKs anywhere in the code. Checked app.js, index.html and every script for gtag, Plausible, Sentry and similar: none.

Fonts and the Save PDF libraries are served from our own files (fix21-fonts, 12 Nov 2026), so Google Fonts and cdnjs are no longer contacted.

### Answers

**Do you or your third-party partners collect data from this app?** Yes (because of the optional member card and the request form).

**Data used to track you:** None.

**Data linked to you** (all for App Functionality only, none for analytics, advertising or personalisation by a third party):

| Apple data type | Why |
|---|---|
| Contact Info: Name | Optional name on the member card. Optional name on Request a movie |
| Identifiers: User ID | The member number, when the card is put online |
| User Content: Other User Content | Watched list, favourites, ratings, weekly plan and kids mode on the online card. Film title, year and note on a request |
| Usage Data: Product Interaction | Optional, only on an online card: rentals count, rentals per aisle and tapes out, the last 8 films spun and counter treats ticked when renting. Used to show the same card on another device. Linked to the member number. Not used for tracking or analytics |

**Data not linked to you:** None.

Notes:
- Optional disclosure: Apple lets you skip declaring a data type if it is optional, rare and clearly entered by the user (like a feedback form). The request form might qualify. Declaring it anyway is simpler and safer.
- The PIN is a sign-in credential, not a data type on Apple's list. privacy.html says it is stored scrambled; confirm that (see Open questions).
- Tick Usage Data: Product Interaction (above) only. Do not tick Diagnostics or any other Usage Data type: nothing like that is collected.
- You could stop syncing rentals per aisle, tapes out and counter treats. Even then, rentals and the last 8 spins still sync, so Product Interaction stays.
- Account deletion (guideline 5.1.1(v)): done. Galaxy Video, member card, Delete my online card.

---

## 8. Google Play Data safety form

**Does your app collect or share any of the required user data types?** Yes.

**Is all of the user data collected by your app encrypted in transit?** Yes. The sync function and Netlify Forms are HTTPS only.

**Do you provide a way for users to request that their data is deleted?** Yes. In the app (Delete my online card) and by email.

**Account creation:** Yes, optional. Method: username and password (the member number and 4-digit PIN). The app is fully usable without it.

**Delete account URL** (required for apps with accounts): https://reeldinner.com/support#delete-card

**Data collected** (none of it shared, all optional, all for App functionality, processed by our service providers Supabase and Netlify, which Google does not count as sharing):

| Google category | Data type | Collected | Optional | Purpose |
|---|---|---|---|---|
| Personal info | Name | Yes | Yes | App functionality (name on the card, name on a request) |
| Personal info | User IDs | Yes | Yes | App functionality (member number for sync) |
| App activity | Other user-generated content | Yes | Yes | App functionality (watched list, favourites, ratings, plan, request notes) |
| App activity | App interactions | Yes | Yes | App functionality only (online card only: rentals count, rentals per aisle and tapes out, the last 8 films spun and counter treats ticked when renting, so the card looks the same on another device). Linked to the member number. Not used for tracking or analytics |
| Location, Financial info, Health, Messages, Photos, Audio, Files, Calendar, Contacts, Web history, Device IDs, Crash logs, Diagnostics | | No | | |

Calendar note: Add to calendar saves a file and offers Google Calendar links. The app never reads the calendar, so Calendar is No.

**Data shared:** None.

**Security practices to tick:** data encrypted in transit; users can request deletion. Do not tick independent security review.

---

## 9. Screenshot shot list

Sizes: Apple needs 6.9 inch iPhone screenshots (1320 x 2868 or 1290 x 2796), plus 13 inch iPad (2064 x 2752) if the app runs on iPad. Google needs at least 2 phone screenshots (up to 8) and a 1024 x 500 feature graphic.

Shoot in this order (the first three show on the search results page):

1. **The wheel mid-spin** at the box office. Caption: "Spin for tonight's film"
2. **A finished menu** for a well known film, full screen. Caption: "Every film gets its own dinner menu"
3. **Prep sheet** with the guest count and timeline showing. Caption: "Recipes and timings, worked back from showtime"
4. **Shopping list** with a few items ticked. Caption: "One shopping list, scaled to your guests"
5. **Galaxy Video shelves.** Caption: "Browse 900 films in a 1990s video store"
6. **This week's film panel** with cook night, showtime and Add to calendar. Caption: "Lock it in and get reminders"
7. **Candy bar.** Caption: "Or start from what you're craving"
8. **Kids mode on**, a family film menu. Caption: "Kids mode: G and PG films, no alcohol"

Rights warning: every screen above shows TMDB posters or stills. Until the artwork decision is made, shoot screenshots on films where the menu design carries the screen and the poster is small, or use the plain placeholder the offline build shows. A screenshot full of studio posters invites a 5.2.1 rejection.

Keep the captions plain and short, same voice as the app. No device frames needed.

---

## 10. Notes for App Review

Paste into App Store Connect, App Review Information, Notes (and Google Play's app access instructions):

```
Reel Dinner works without signing in. Every feature can be tested as a guest.

What to try:
1. Box office tab: tap Spin in the middle of the wheel. A themed menu for the film opens.
2. Tap the Prep sheet and shopping list tab. Change guests with the plus and minus buttons, the recipes and list scale.
3. Under the menu, tap Save PDF, or Lock in for this week, then Add to calendar.
4. Settings: turn on Kids mode. Only G and PG films show and every drink becomes alcohol-free.

Optional member card (sync between devices):
Open the Galaxy Video tab and scroll to the member card. To test signing in on this device, tap "Use my card from another device" and enter:
Member number: [FILL IN 6-DIGIT TEST NUMBER]
PIN: [FILL IN 4-DIGIT TEST PIN]
Account deletion: on the member card, tap "Delete my online card", then tap again to confirm. The online copy is removed straight away. If you delete the test card, it can be recreated from a fresh install with "Put my card online", or email us and we will set up a new one.

Request a movie (Box office tab) sends the film title, year and an optional name and note to us by email. Nothing is shown to other users.

There are no in-app purchases, ads, analytics or user-to-user contact.

Film posters and stills are loaded from TMDB (The Movie Database) and credited in the app. Dish names, recipes and menu designs are our own work.

[FILL IN ONCE BUILT, DELETE ANY THAT ARE NOT: works offline for saved menus; share sheet for the menu image, PDF and shopping list; movie night reminder notification; haptics on the spin; AirPrint.]

Contact: privacy@reeldinner.com
```

Before submitting: create the test card on a spare device, write the number and PIN in above, and do not delete it.

---

## 11. Things to check before this goes in

- privacy.html kids mode line: already fixed on main, leave it alone on this branch.
- Once deployed, check https://reeldinner.com/support and https://reeldinner.com/privacy both return 200 (support is 404 until this branch goes live). Both stores check these links.
- Settle the artwork rights before the screenshots are shot.

---

## 12. Open questions for Josh

1. **Is the PIN hashed on the server?** The app sends the PIN over HTTPS on every sync, and the Supabase edge function code is not in this repo, so I cannot see whether it is stored hashed. privacy.html and the store answers say it is scrambled. Check the function before submitting. (The PIN is also kept as plain text in the device's own storage.)
2. **Deleting a card by email.** Support and privacy say email your member number and we will delete the card. A 6-digit number alone is weak proof: anyone who knows it could get a card deleted. Ask for something more, such as the PIN or a one-off code shown in the app.
3. **Reset everything leaves the online card.** It clears this device only. The online copy stays until Delete my online card is used. Say so in Settings or on the support page, or have Reset ask whether to delete the online card too.
4. **Links in the native app.** The request form posts to "/" and the footer links are /privacy and /support. Inside a bundled app those point at the app's own address, not the website. In the app build they must point at https://reeldinner.com (form posts to https://reeldinner.com/, links to https://reeldinner.com/privacy and https://reeldinner.com/support).
