# Artwork rights for the Reel Dinner app

Researched and fact checked 11 Nov 2026. A summary of what the sources say, not legal advice. Anything unclear goes to a lawyer before launch.

## Short answer

- TMDB lets you use its images free in a non-commercial project with attribution. TMDB also says it does not own the images, so its free terms or a paid licence probably do not include the studios' permission [1]. Confirm with TMDB and a lawyer.
- Apple and Google both require permission for third-party trademarks and copyright, and Google names movie marketing images as a common breach [6][11].
- Safest path for a free first version: ship the app with no studio artwork and none of the 124 generated posters. Clean up the website as well (see option E).

## What the risk actually is

**1. Rejection at review (most likely).** Guideline 5.2.1 says not to use trademarks or copyrighted works without permission. Guideline 5.2.2 says content from a third-party service must be permitted under its terms, and "authorisation must be provided upon request". Guideline 2.3.9 makes you responsible for rights in screenshots and previews [6]. One developer was asked to verify rights to TMDB images, sent TMDB's terms as Apple staff suggested, and was still rejected several times [7]; staff told another to check the provider's terms on images [8]. On TMDB's forum, some got through by arguing posters are promotional or by using public domain film shots, while a 2022 post reports a fresh rejection [3]. A Samsung store developer was rejected even after crediting TMDB [12]. In a 19 Feb 2014 post, TMDB staff said they have no document they can give developers to prove rights [3].

**2. Takedown after launch.** Apple passes rights complaints to the developer [9]. TV Time (30 million registered users) was off the App Store for weeks in late 2024 after a company claimed copyright in cover art and told Apple the claim was "unresolved". Apple removes an app if the parties don't resolve it [10]. Google responds to clear copyright notices and may ask for evidence of rights [11].

**3. A copyright claim.** Least likely, most expensive. In the TV Time case the claimant demanded a financial settlement, Whip Media refused to pay, and it says it later resolved the matter [10]. Australia has no general fair use; fair dealing covers set purposes such as criticism or review and parody or satire [21]. A dinner menu built around a poster is not obviously either. **Unclear: confirm with a lawyer.**

**4. Trademarks and actor likeness.** Film title logos are trademarks, which 5.2.1 names first [6]. Google may suspend an app that uses another party's trademark in a way likely to confuse people about its source [11]. The 124 generated posters copy title logos (the ® on The Godfather, the ™ and no-ghost logo on Ghostbusters) and show AI likenesses of real actors. Australia has no specific image right, but passing off and misleading conduct under the Australian Consumer Law can apply where a well-known person appears to endorse something [25]. **Confirm with a lawyer.**

Caching TMDB posters on first view keeps them out of the app file, but the app still displays them, so the rights question is the same.

## The options

### A. Keep TMDB images free, with attribution
- **Allows:** non-commercial use only, crediting TMDB with its logo and the line "This product uses the TMDB API but is not endorsed or certified by TMDB" in About or Credits [1]. Commercial use already needs a paid licence from TMDB sales [1].
- **Cost:** $0.
- **Risk:** covers TMDB's terms (5.2.2), probably not studio rights (5.2.1). Rejection is a real chance [7][12].
- **Menus:** unchanged.

### B. TMDB commercial licence
- **Allows:** use where the "primary purpose is to create revenue for the benefit of the owner" [1]. Pricing is through sales and not published [1][4].
- **Cost:** one third-party article says US$149 a month under US$1 million revenue [5]. **Unconfirmed.**
- **Risk:** TMDB's business page says the licence lets you use "our data and images" but does not say whether that includes studio copyright [4]. Ask sales to confirm in writing.
- **Menus:** unchanged.

### C. Posters only where licensed
- **Cost:** per studio, per use. Warner Bros takes written requests and sets fees "according to use" [20]. Agency stills are editorial only; commercial use needs the rights holder [19]. IMDb cannot sublicense its posters [17].
- **Effort:** not realistic for 900 films; maybe a few hero films.
- **Menus:** most films get no poster.

### D. Original illustrated art
- **Cost per film:** A$247 (black and white quarter page) to A$345 (colour quarter page), FY 2026/7 ASA book illustration rates, ex GST [22]. Publishing rates; app, web and print rights may cost more. At 900 films, roughly A$222,000 to A$310,000. US freelancers quote US$250 to US$400 a standard spot, US$50 to US$100 for simple pieces [23].
- **Per layout or genre:** 20 to 40 pieces is about A$5,000 to A$14,000, less as a set [23].
- **Risk:** low if it copies no posters, logos, characters or real faces; modified copyrighted content can still breach Google's policy [11].
- **The 124 generated posters:** they are the live fallback when TMDB fails to load (POSTER_WORKFLOW.md), they were briefed with "recognisable film typography" (ARTWORK_ROLLOUT.md), and they copy logos and actor likenesses (risk 4). Retire them. Don't plan on clearing them.
- **Menus:** genre art replaces the poster.

### E. No images in the app, website cleaned up
- **Allows:** titles, dishes, your writing and your own design only.
- **Cost:** $0. **Effort:** a build flag and a plain placeholder, which the offline plan needs anyway.
- **Website:** its TMDB posters fall under TMDB's free terms [1]. The 124 generated posters and the McDowell's frame do not. That frame was copied from a CinemaBlend image (assets/menu-details/SOURCES.md), so no licence covers it anywhere. Take both off the site too, or get legal advice.
- **Menus:** type-led designs, still printable.

### F. Public domain posters
Out-of-copyright posters can carry real art. TMDB forum developers used public domain film shots in screenshots that passed review [3]. Check each poster's status in Australia and the US with the lawyer. Few of the 900 films would qualify.

### G. Trade through a company
You are enrolling as an individual. Ask the lawyer whether a company would limit your personal exposure, and the cost.

### H. Mixed (recommended)
E now, a commissioned set of genre art (D) when budget allows, public domain posters (F) where they check out, licensed posters (C) only if a studio deal comes up.

## How comparable apps do it

- **Trakt** takes posters, stills and fanart from TMDB, plus logos from Fanart.tv [13].
- **Letterboxd** gets its metadata from TMDB and sells Pro and Patron tiers [14].
- **JustWatch** says its posters, descriptions and cast come "from TMDb and IMDb with permission" [26]. Its imprint carries the TMDB notice, says it "claims no rights or titles to the content", and credits a photo agency for actor images [27].
- **TV Time** owned TheTVDB from 2019 and shut down in July 2026 [15]. TheTVDB claims no ownership of its images [16]. User-uploaded art led to the 2024 removal [10].
- **TVmaze** asks developers to hotlink images so takedowns stay with it [18].
- **Guess the Movie** uses "minimalistic posters" and says all poster art is copyright of its owners [24].

None states a studio licence. Shipping posters looks like accepted risk, not cleared rights.

## Recommendation

**Free first version:** Option H. App build with no studio artwork and no generated posters, TMDB credit kept in About for film data, store screenshots showing only your own designs. Website keeps TMDB posters with credit, and drops the 124 generated posters and the CinemaBlend frame.

**If it earns money:** charging is likely commercial under TMDB's test; ads or affiliate links may be [1]. Ask TMDB, and if needed get the licence before launch, for app and website. Keep studio artwork out unless licensed (C), since the licence probably does not cover studio rights. Budget for the genre art then.

Titles, character names and short quotes are generally lower risk than artwork, but not risk free. **Confirm with a lawyer.**

## Next steps, in order

1. Read the TMDB API Terms of Use yourself before emailing TMDB [2]. The page could not be read automatically, so every TMDB point here rests on the FAQ and forums.
2. Email TMDB sales, giving your country [1]. Ask: is a free app with no ads non-commercial; would ads or affiliate links change that; the commercial price; does any licence include studio image rights. Get answers in writing.
3. Add an app build flag that drops all posters, stills, title logos, the CinemaBlend frame and the 124 generated posters, with a plain placeholder.
4. Remove the 124 generated posters and the CinemaBlend frame from the website; use the placeholder as the fallback.
5. Check the custom menus in formats.js without film imagery.
6. Get two or three illustrator quotes for 20 to 40 genre pieces, with a written licence for app, web and print.
7. Make store screenshots from the art-free build.
8. In App Review notes, say the app has no studio artwork and credits TMDB for film data.
9. Book an Australian IP lawyer: titles, names and quotes; website posters; the TMDB licence wording; public domain posters; individual versus company.
10. Then pay the Apple Developer fee (approval can take a day or two) and run the first TestFlight build.

## Sources

1. TMDB developer FAQ: https://developer.themoviedb.org/docs/faq
2. TMDB API Terms of Use (could not be read automatically on 11 Nov 2026; read it yourself): https://www.themoviedb.org/api-terms-of-use
3. TMDB support thread, rights documents and App Store experiences: https://www.themoviedb.org/talk/530525ae9251413488038dc4
4. TMDB API for Business: https://tmdb.org/api-for-business
5. api.market, Best Movie APIs in 2026: https://api.market/blog/sleeyax/entertainment/best-movie-apis
6. Apple App Review Guidelines (2.3.9, 5.2, 5.2.1, 5.2.2): https://developer.apple.com/app-store/review/guidelines/ and https://developer.apple.com/support/downloads/terms/app-review-guidelines/App-Review-Guidelines-English-UK.pdf
7. Apple Developer Forums, TMDB app rejected for copyright: https://developer.apple.com/forums/thread/649351
8. Apple Developer Forums, 5.2.1 rejection over API logos: https://developer.apple.com/forums/thread/718427
9. Apple App Store content dispute form: https://www.apple.com/legal/intellectual-property/dispute-forms/app-store/app-store-dispute.html
10. TechCrunch, TV Time removed from App Store (20 Nov 2024): https://techcrunch.com/2024/11/20/tv-time-points-to-apples-significant-power-over-developers-after-being-removed-from-app-store
11. Google Play intellectual property policy (copyright and trademark): https://support.google.com/googleplay/android-developer/answer/9888072
12. Samsung Developers forum, TMDB app rejected: https://forum.developer.samsung.com/t/movie-list-app-copyright-tmdb-api/19608
13. Trakt support, metadata sources: https://support.trakt.tv/support/solutions/articles/70000260936-how-does-movie-tv-show-information-metadata-get-updated-how-can-i-refresh-or-sync-trakt-to-tmdb-
14. Wikipedia, Letterboxd: https://en.wikipedia.org/wiki/Letterboxd
15. Wikipedia, TV Time: https://en.wikipedia.org/wiki/TV_Time
16. TheTVDB FAQ: https://support.thetvdb.com/kb/faq.php?id=77
17. IMDb help, using photos from IMDb: https://help.imdb.com/article/imdb/general-information/can-i-use-a-photo-from-your-site-for-my-web-site-or-publication/G7V6PHXKDLLK7AS6
18. TVmaze forum, posters on a commercial website: https://www.tvmaze.com/threads/6552/using-posters-and-data-from-tvmaze-api-on-a-commercial-website
19. Alamy, third-party rights and clearance: https://www.alamy.com/blog/a-guide-to-third-party-rights-in-images-and-rights-clearance
20. Warner Bros clip and still licensing: https://www.warnerbros.com/studio/services/clip-and-still-licensing
21. Queensland Law Handbook, exceptions to copyright infringement: https://queenslandlawhandbook.org.au/the-queensland-law-handbook/your-rights-and-responsibilities/copyright-and-moral-rights/exceptions-to-copyright-infringement/
22. Australian Society of Authors, rates of pay: https://www.asauthors.org.au/rates-of-pay
23. ManyPixels, custom illustration cost 2026: https://www.manypixels.co/blog/illustrations/custom-illustration-cost
24. Guess the Movie, App Store listing: https://apps.apple.com/au/app/guess-the-movie/id375276782
25. Arts Law Centre of Australia, unauthorised use of your image: https://www.artslaw.com.au/?p=11578
26. JustWatch, streaming service integration docs: https://apis.justwatch.com/docs/streaming_service
27. JustWatch imprint: https://www.justwatch.com/kw/imprint
