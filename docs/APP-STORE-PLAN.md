# App Store and Google Play plan

Started 5 Nov 2026. Josh wants Movie Night Spinner out to the world as a real app. Claude builds, Josh approves along the way.

## Decisions so far
- Money: not decided. Plan for a free app first, keep paid or subscription open. Anything that earns money needs a TMDB commercial licence.
- Developer accounts: none yet (Apple and Google both to set up).

## Blockers to clear before submitting
1. Rights to film content (Apple guideline 5.2.1). Real posters, stills and logos come from TMDB and belong to the studios. Film titles, character names and our own dishes and writing are fine to use in context; artwork is the risk. Options: our own illustrated artwork in the app build, posters only where licensed, or a TMDB commercial licence if the app earns money. TMDB attribution stays either way.
2. Minimum functionality (guideline 4.2). A website in a frame gets rejected. The app needs native features: menus and shopping lists offline, the share sheet, a movie night reminder notification, haptics on the spin, native print.
3. Sign in with Apple (guideline 4.8). Offering Google sign-in means Sign in with Apple must be offered too, at the same time.
4. Store basics: privacy policy page, support page, account deletion inside the app, age rating (about 12+ for horror films and alcohol mentions), screenshots and store text.

## Order of work
1. Finish the review fixes and reach 9 or better across the board.
2. Settle the rights approach and free or paid.
3. Buy the custom domain, then switch on accounts (Apple, Google and email code; one account per household).
4. Wrap the site with Capacitor and add the native features above.
5. TestFlight (iPhone) and internal testing (Android).
6. Submit to both stores.

## Josh to set up
- Apple Developer Program, about US$99 a year. Enrol as an individual (fastest, your name shows as the seller) or as an organisation (needs a registered business and a D-U-N-S number, the business name shows).
- Google Play Console, a one-off US$25.
- The custom domain.
