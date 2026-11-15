# Me, Myself & Irene (2000)

Layout: motel (kept). Venue: Roadside Motel, between Massena and Rhode Island.

## Venue
On the run back to Rhode Island, Charlie, Irene and Whitey stop at a run-down motel; that is where Hank tricks Irene, and where they leave Whitey. No page I opened gives the motel a name, so it is called "Roadside Motel".
- Wikipedia: "While stopping at a motel, Hank convinces Irene..."; "Charlie and Irene leave Whitey at the motel and board a train to Rhode Island." https://en.wikipedia.org/wiki/Me,_Myself_%26_Irene
- What's After the Movie: "A pit stop at a run-down motel". https://www.whatsafterthemovie.com/summary/me-myself-irene

## Facts and quotes used
Wikipedia:
- Charlie Baileygates, Rhode Island state trooper; second personality Hank Evans; escorts Irene to Massena, New York (sign, chowder line, wink).
- Medication to keep Hank down (prop).
- Whitey, a waiter, kills Dickie with a lawn dart (wink). The triplets steal a police helicopter (wink).
- Charlie promoted to lieutenant (pie line). A fish eats Charlie's thumb (wink).
Wikiquote (https://en.wikiquote.org/wiki/Me,_Myself_%26_Irene):
- Note, Hank: "Charlie's like origami, he folds under pressure." (8 words).
- Narrator: "an 18 year veteran of ... The Rhode Island State Police" (number 18, chowder line).
- Hank: "I got no beef with you. This is between me and the kid." (nachos line).
- Boshane: "he put six bullets into a prize cow's head. Poor thing's lucky to be alive." (sirloin, cue, wink).
- Hank: "Free hot dogs here, all you can eat!" (wieners line, reworded as a nod).
- Hank: "Come on, I'll buy you a beer." (house drink note).
- Charlie: "I have to take a pill every six hours" (prop).

## Unsure
- Motel name is mine. Coffee milk, johnnycakes and hot wieners are Rhode Island foods, not foods shown in the film; their lines only claim Rhode Island.

## Round 1 fix (15 Nov)
- Wikiquote: Shonte Jr., "If I don't buckle down, I'm gonna get myself another B-plus." (coffee milk line); Hank, "Well looky here, it's a human Q-tip." (chowder line).
- Poster-art stills hidden in data/still-block.json so the front and the stamp show film stills.

## Fix (15 Nov)
Stamp postmark cut the venue to "WHERE THEY". menu-formats/motel.js builds the postmark from the last comma part of the sign if it fits 14 characters in whole words, else the first two words of the venue. The sign "Between Massena and Rhode Island" had no comma and ran long, so the venue's first two words printed.
- Sign now "Out of Massena, on the run", so the postmark prints whole: "ON THE RUN / 2000". The front reads "OUT OF MASSENA, ON THE RUN" on one line. Venue unchanged.
- Wikipedia: Charlie and Irene flee Massena and head back to Rhode Island, stopping at the motel on the way. https://en.wikipedia.org/wiki/Me,_Myself_%26_Irene
