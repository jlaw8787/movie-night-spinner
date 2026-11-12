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

## Update, 11 Nov 2026

Done: privacy page, in-app delete of the online member card, sync fix, privacy@reeldinner.com. Artwork rights decision is parked. Josh wants the site better first, then the app.

### Decisions
- First version keeps the Member Card sync (member number and PIN), guest by default. No Google login, so Sign in with Apple is not needed yet.
- Josh has no Mac. iPhone builds run on a cloud Mac service (not chosen or priced yet). Apple only takes uploads built with Xcode 26 or later.
- Enrol as an individual (no D-U-N-S number, his legal name shows as the seller). He has the Apple Developer app installed and is signed in. He stopped before paying. Tell him a couple of days before the first TestFlight build so he can pay then (approval can take a day or two).

### Wrapper plan
1. Capacitor 8.5 on branch app/ios-wrapper, bundle ID com.reeldinner.app. The whole site ships inside the app, it does not load reeldinner.com.
2. All 900 film files, layouts, jsPDF and html2canvas bundled (the last two load from cdnjs today).
3. Posters and stills stay online and are saved on first view, so no studio artwork sits in the app file.
4. Fonts: 8 core families plus roughly 230 menu families come from Google Fonts. All open licence. Script the download to local woff2, one local font list, remove the Google links. Use the same local fonts on the website.

### Features for guideline 4.2
1. Offline: spin, every menu, prep sheet and shopping list with no signal, plain placeholder where a poster is not saved.
2. Save: menu PDF to Files, menu image to Photos, favourites, history and ticks in app storage.
3. Share: native share sheet for the menu image, PDF and shopping list (three navigator.share calls in app.js to swap).
4. AirPrint, a movie night reminder notification, haptics on the spin.

### Still needed before submitting
- Support page at reeldinner.com/support (404 today).
- App Store Connect: free apps agreement, app record, API key for cloud builds.
- Privacy answers, age rating answers, a test member number and PIN for the reviewer, screenshots, icon, store text.

## Decisions, 11 Nov 2026, afternoon
- Age rating: answer honestly. About 640 of the 900 menus mention alcohol, so "frequent" on Apple's form, which gives 18+.
- Artwork rights get settled before the first TestFlight build, so the store screenshots and the app are safe from the start.
- Store listing drafts are in docs/STORE-LISTING.md; the support page is at /support.
