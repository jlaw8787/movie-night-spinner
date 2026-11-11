# Artwork rights for the Reel Dinner app

Researched 11 Nov 2026. This is a summary of what the sources say, not legal advice. Anything marked unclear should go to a lawyer before launch.

## Short answer

- TMDB lets you use its images free in a non-commercial project with attribution, but TMDB says it does not own the images. The studios do. So neither the free terms nor a paid TMDB licence gives you the studios' permission [1].
- Apple and Google both say you need permission for third-party copyright material, and Google names movie marketing images as a common breach [7][12].
- Safest path for a free first version: ship the app with no studio artwork at all (no posters, stills or title logos). Keep posters on the website for now with TMDB credit.

## What the risk actually is

**1. Rejection at review (most likely).** Guideline 5.2.1 says not to use copyrighted works without permission, and apps should come from whoever owns or licensed the rights. Guideline 5.2.2 says if you display content from a third-party service you must be permitted under its terms, and "authorisation must be provided upon request" [7]. Guideline 2.3.9 also makes you responsible for rights in screenshots and previews [7]. Developers using TMDB report rejections: one was asked to verify rights to TMDB images, sent TMDB's terms as Apple staff suggested, and was still rejected several times [8]. Others on TMDB's own forum got through by arguing posters are promotional, or by using public domain film shots in screenshots, while a 2022 post reports a fresh rejection [4]. When an app was rejected over images from a data provider, Apple staff pointed the developer back to that provider's terms on logos and images [9]. A Samsung store developer was rejected for copyright even after crediting TMDB [13]. Outcomes are inconsistent. TMDB staff have said they have no document they can give developers to prove rights [4].

**2. Takedown after launch.** Apple passes rights complaints to the developer through its content dispute process [10]. TV Time (30 million registered users) was pulled from the App Store for weeks in late 2024 after a company claimed copyright in cover art, told Apple the claim was "unresolved", and demanded money; Apple removes an app if the parties do not resolve it [11]. Google says it responds to clear copyright notices and may ask developers for evidence of their rights [12].

**3. A legal claim.** This is the least likely but the most expensive. In the TV Time case the claimant asked for a financial settlement and the company later settled [11]. Australia has no general fair use. Fair dealing covers set purposes such as criticism or review and parody or satire [22]. A themed dinner menu built around a poster is not obviously any of those. **Unclear: confirm with a lawyer.**

Note on the wrapper plan: loading posters online and caching them on first view keeps them out of the app file, but the app still displays them, so it does not change the rights question.

## The options

### A. Keep TMDB images free, with attribution
- **Allows:** non-commercial use only, crediting TMDB as the source of data and images, with the TMDB logo and the line "This product uses the TMDB API but is not endorsed or certified by TMDB" in About or Credits [1].
- **Cost:** $0.
- **Effort:** none beyond the credit, which the site already has.
- **Risk:** covers TMDB's terms (5.2.2) but not studio copyright (5.2.1). Rejection is a real chance [8][13]. TMDB has said it may charge for commercial keys in future [3].
- **Menus:** unchanged.

### B. TMDB commercial licence
- **Allows:** use of the API in a project whose "primary purpose is to create revenue" [1]. Pricing is through TMDB sales, not published [1][5].
- **Cost:** one third-party article says US$149 a month for companies under US$1 million revenue [6]. **Unconfirmed; ask TMDB.**
- **Effort:** an email and a contract.
- **Risk:** TMDB's business page does not mention image rights [5], and TMDB claims no ownership of the images [1]. On those sources it fixes the TMDB terms problem, not the studio one. **Ask TMDB sales to confirm in writing.**
- **Menus:** unchanged.

### C. Posters only where licensed
- **Allows:** exactly what each studio licence says.
- **Cost:** per studio, per use. Warner Bros, for example, takes written requests and sets fees "according to use" [21]. Agency stills (Alamy and similar) are licensed for editorial use; commercial use needs separate permission from the film's rights holder [20]. IMDb says it cannot sublicense its posters either [18].
- **Effort:** heavy. 900 films across dozens of rights holders is not realistic for one person. A handful of hero films might be.
- **Risk:** low for licensed films.
- **Menus:** most films would fall back to no poster anyway.

### D. Original illustrated art
- **Per film:** Australian Society of Authors rates for FY 2026/27 are A$247 for a small spot illustration and A$345 for a colour quarter page, before GST [23]. At 900 films that is roughly A$222,000 to A$310,000. US freelancers quote US$250 to US$400 for a standard spot, US$50 to US$100 for simple pieces [24].
- **Per layout or genre:** 20 to 40 pieces at the same rates is about A$5,000 to A$14,000, less as a set [24].
- **Allows:** whatever your written licence with the artist says. Get rights assigned or licensed for app, web and print.
- **Risk:** low, as long as the art does not copy poster compositions, characters or title lettering. Google warns that modified copyrighted content can still breach its policy [12].
- **Watch out:** the 124 older "film-inspired" posters in assets/menu-posters were briefed with "recognisable film typography" (ARTWORK_ROLLOUT.md). Treat those as derivative and keep them out of the app until a lawyer clears them.
- **Menus:** genre art replaces the poster.

### E. No images in the app, posters stay on the website
- **Allows:** the app uses titles, dishes, your writing and your own design only.
- **Cost:** $0.
- **Effort:** a build flag to hide posters, stills, logos and locally stored film frames (assets/menu-details holds one), plus a plain placeholder the offline plan already needs.
- **Risk:** lowest for review and takedown. The website keeps its current exposure under TMDB's free terms.
- **Menus:** type-led designs. Less wow on screen, still printable.

### F. Mixed (recommended)
E now, with a small commissioned set of genre or layout illustrations (D, per layout) added when budget allows, and licensed posters (C) only for any film where a studio partnership comes up.

## How comparable apps do it

- **Trakt** takes posters, stills and fanart from TMDB, plus logos from Fanart.tv [14].
- **Letterboxd** gets its film metadata from TMDB and sells Pro and Patron tiers [15]. Whether it holds studio licences is not public.
- **TV Time** used TheTVDB [16], which says it claims no ownership of its images [17]. That user-uploaded art is what led to its removal [11].
- **TVmaze** tells developers to hotlink its images so takedowns are handled on its side; self-hosting moves that responsibility to you [19].
- **Guess the Movie**, a quiz app, uses "minimalistic posters" and says all poster art is copyright of its owners [25].

So many apps ship with posters, but that looks like accepted risk, not cleared rights. Bigger players can absorb a dispute. A sole trader enrolled as an individual carries it personally.

## Recommendation

**Free first version:** Option F. App build with no studio artwork, TMDB credit kept in About for the film data, store screenshots showing only your own designs. Website keeps posters with credit while it earns nothing.

**If it charges (or adds ads or affiliate links):** it becomes commercial under TMDB's definition [1], so get the TMDB commercial licence before launch, for the app and the website. Still keep studio artwork out unless licensed (C), because the licence does not appear to cover studio rights. Budget for the genre art set at that point.

Film titles, character names and short quotes are generally lower risk than artwork, but they are not risk free. **Confirm with a lawyer.**

## Next steps, in order

1. Email TMDB sales (give your country, as the FAQ asks [1]). Ask: is a free app with no ads non-commercial; what is the commercial price; does any licence include image rights.
2. Add an app build flag that drops all posters, stills, title logos, local film frames and the 124 film-inspired posters, with a plain placeholder.
3. Check every custom menu in formats.js still reads well without film imagery; adjust layouts.
4. Get two or three illustrator quotes for 20 to 40 genre or layout pieces, with a written licence covering app, web and print.
5. Make store screenshots from the art-free build.
6. In App Review notes, say the app contains no studio artwork and uses TMDB for film data under its terms with attribution.
7. Book a short session with an Australian IP lawyer: titles, character names and quotes in the app; poster use on the website; the TMDB licence wording.
8. Then pay the Apple Developer fee (approval can take a day or two) and run the first TestFlight build.

## Sources

1. TMDB developer FAQ: https://developer.themoviedb.org/docs/faq
2. TMDB API Terms of Use (blocked to automated reading on 11 Nov 2026; read it yourself before signing anything): https://www.themoviedb.org/api-terms-of-use
3. TMDB support thread, commercial key and sales: https://www.themoviedb.org/talk/5d29d886be4b36756aa16a8a
4. TMDB support thread, rights documents and App Store experiences: https://www.themoviedb.org/talk/530525ae9251413488038dc4
5. TMDB API for Business: https://tmdb.org/api-for-business
6. api.market, Best Movie APIs in 2026: https://api.market/blog/sleeyax/entertainment/best-movie-apis
7. Apple App Review Guidelines (2.3.9, 5.2, 5.2.1, 5.2.2): https://developer.apple.com/support/downloads/terms/app-review-guidelines/App-Review-Guidelines-English-UK.pdf and https://developer.apple.com/app-store/review/guidelines/
8. Apple Developer Forums, TMDB app rejected for copyright: https://developer.apple.com/forums/thread/649351
9. Apple Developer Forums, 5.2.1 rejection over API logos: https://developer.apple.com/forums/thread/718427
10. Apple App Store content dispute form: https://www.apple.com/legal/intellectual-property/dispute-forms/app-store/app-store-dispute.html
11. TechCrunch, TV Time removed from App Store (20 Nov 2024): https://techcrunch.com/2024/11/20/tv-time-points-to-apples-significant-power-over-developers-after-being-removed-from-app-store
12. Google Play intellectual property policy: https://support.google.com/googleplay/android-developer/answer/9888072
13. Samsung Developers forum, TMDB app rejected: https://forum.developer.samsung.com/t/movie-list-app-copyright-tmdb-api/19608
14. Trakt support, metadata sources: https://support.trakt.tv/support/solutions/articles/70000260936-how-does-movie-tv-show-information-metadata-get-updated-how-can-i-refresh-or-sync-trakt-to-tmdb-
15. Wikipedia, Letterboxd: https://en.wikipedia.org/wiki/Letterboxd
16. Wikipedia, TV Time: https://en.wikipedia.org/wiki/TV_Time
17. TheTVDB FAQ: https://support.thetvdb.com/kb/faq.php?id=77
18. IMDb help, using photos from IMDb: https://help.imdb.com/article/imdb/general-information/can-i-use-a-photo-from-your-site-for-my-web-site-or-publication/G7V6PHXKDLLK7AS6
19. TVmaze forum, posters on a commercial website: https://www.tvmaze.com/threads/6552/using-posters-and-data-from-tvmaze-api-on-a-commercial-website
20. Alamy, third-party rights and clearance: https://www.alamy.com/blog/a-guide-to-third-party-rights-in-images-and-rights-clearance
21. Warner Bros clip and still licensing: https://www.warnerbros.com/studio/services/clip-and-still-licensing
22. Queensland Law Handbook, exceptions to copyright infringement: https://queenslandlawhandbook.org.au/the-queensland-law-handbook/your-rights-and-responsibilities/copyright-and-moral-rights/exceptions-to-copyright-infringement/
23. Australian Society of Authors, rates of pay: https://www.asauthors.org.au/rates-of-pay
24. ManyPixels, custom illustration cost 2026: https://www.manypixels.co/blog/illustrations/custom-illustration-cost
25. Guess the Movie, App Store listing: https://apps.apple.com/au/app/guess-the-movie/id375276782
