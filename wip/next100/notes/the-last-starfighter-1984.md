# The Last Starfighter (1984)

Layout: kiosk (kept; "Bar and grill, since 1984" remapped to the venue name, "Sticky fingers welcome" to "Heard in the park", "Spot prize for the loudest cheer" to "Ask Alex about the high score"). Venue: Starlite Starbrite Trailer Court, "The park store and its Starfighter game" (the lead).

## Venue
Alex lives in a trailer park where the Starfighter machine stands at the small store; Centauri finds him there ("Store's closed, mister." "I'm not here for cigarettes or bubble gum").
- Wikiquote: https://en.wikiquote.org/wiki/The_Last_Starfighter
- Mental Floss: "They settled on the Starlite Starbrite Trailer Court". https://www.mentalfloss.com/entertainment/movies/last-starfighter-movie-facts
- 80s Film Locations: the small store, owned by Alex's mother, where he plays Starfighter. https://www.sites.google.com/site/80sfilmlocations/Film-List/the-last-starfighter-1984

## Facts and quotes used
Wikipedia (https://en.wikipedia.org/wiki/The_Last_Starfighter): Alex becomes the game's highest-scoring player (hot dogs, prop); Beta the android stand-in; Zando-Zan assassins; Grig; Death Blossom (pizza, cue); Louis takes up the game at the end (winks).
Wikiquote:
- Note, Louis Rogan: "Woohoo! All right; we're being invaded! This is great!!"
- Attract mode "Greetings Starfighter!" (T); Centauri: "flea-speck trailer park in the middle of tumbleweeds and tarantulas" (onion strings), game "supposed to be delivered to Vegas" (steak sandwich), "Centauri's got a little proposition for you" (float); Xur: "When the green moon of Galan is eclipsed, Ko-Dan Armada will invade!" (pie); Alex: "a gung-ho iguana" (wink); Enduran "Victory or death!" (wink).

## Unsure
- The Starlite Starbrite name is confirmed as the trailer court used for the film (Mental Floss), but I did not confirm the name is read out or signposted on screen.
- The kiosk header prints the logo cropped as "STARFIGHT" (logo asset, not changed).
- "Out front" weather strip (clear, 21 C, last orders 8:15) is the kiosk layout's stock.


## Fix (15 Nov)
Sources: Wikiquote raw (https://en.wikiquote.org/wiki/The_Last_Starfighter), Wikipedia raw (https://en.wikipedia.org/wiki/The_Last_Starfighter).
- Wink "Beta, the stand-in Alex" printed as "Beta, the stand in Alex" (dash stripped). Now "Beta, the robot Alex" (Alex: "you're a robot?"; Beta: "a beta unit... an exact duplicate of you").
- Bottom strip: the kiosk's stock land strip (Out front, Sky, Wind, Temp, Last orders 8:15, "Sunny with a chance of fun") is replaced by film lines: head "Greetings, Starfighter" (attract mode), "Last orders: Store's closed, mister" (Alex to Centauri), forecast "Clear, one Gunstar inbound" (the Gunstar lands in the trailer park, Grig's line context), spotted "Beta, the robot Alex". Uses new optional kiosk flavour keys `strip` and `forecast`.
- Title box: the typed title ran "Starfighter" to the box edge. New optional kiosk flavour key `titleMax` (30) caps the typed title size; it now sits inside the box.
- Key lime pie line now "When the green moon of Galan is eclipsed" (Xur, verbatim fragment, unquoted), food note shortened to "Sharp lime custard." so it prints.
- Root beer float line now "Centauri's got a little proposition for you" (Centauri, verbatim, unquoted), food note "Two scoops." so it prints beside the note card.
- House cola note changed to "Kept cold for the queue at the Starfighter game." so "Store's closed, mister" is not repeated. The bubble gum house note no longer prints (its room went to the pie and float).
- Layout change (shared file menu-formats/kiosk.js): three optional per-film flavour keys, `strip`, `forecast` (away from the beach only) and `titleMax`. Films without them render as before.

## Stills
No still-block or still-pick entries added.

## Fix (15 Nov, round 4)
- The still strip under the poster cropped a sliver of an alien face. still-pick now holds only wide stills that read in a thin strip, no faces. The render shows the Rylan launch pad.

## Stills
Added to data/still-pick.json "The Last Starfighter (1984)":
- /ovuyCUpUZlMKWFusppmbbR2HUyu.jpg (the trailer in a green viewfinder)
- /oez55ZGVrRjMYQt0TNfzCIRndqm.jpg (Gunstar firing red lasers)
- /3VckXnpkvVvtnc65n4D47FdvfhK.jpg (the Ko-Dan mothership)
- /AfcFbcV4BROcYAAQ7kFKWpc9QuZ.jpg (the Rylan launch pad at night)
