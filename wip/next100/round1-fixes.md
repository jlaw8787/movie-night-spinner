# Round 1 fixes (from the independent checkers, 15 Nov)

Full detail per film is in audit/results/<audit-slug>.json (facts with fix, vibe ideas). Fix in wip/next100/src/<slug>.py,
then mk.py, checkpack, pack.py put, build-aisles, build-data, check-print-text, sweep-shot (look at it), audit-extract.
Then tick each fact in the result file (done true, applied 2026-11-15) and have the vibe rescored by someone who did not make the change.

## Checker 1 (21 films): wrong or unsure lines
| Film | Printed text | Fix |
|---|---|---|
| Bruce Almighty | OVERHEARD AT THE BOOTH (over God's soup line) | OVERHEARD WHILE MOPPING. God says it at the end in the white room, not at the diner |
| Bruce Almighty | Overheard at the counter: Evan's teleprompter cha-cha. | On the TV over the counter: Evan's cha-cha. |
| Bruce Almighty | The booth where Bruce parts his tomato soup. (caption under a shirtless sky still) | Bruce Almighty, trying out the powers. |
| Hot Shots! Part Deux | I. Saddam and his dog, refrozen as one. | I. Saddam and his dog, thawed out as one. |
| Revenge of the Nerds (unsure) | Scoreboard shows the Alpha Betas scoring 0 in every round | Relabel rows STALL / PIES SOLD / KISSING BOOTH so it doesn't read as a game score |
| Robin Hood: Men in Tights | FROM THE HOST (signed Robin of Loxley) | FROM THE GATECRASHER. Prince John hosts; Robin barges in |
| The Nutty Professor (unsure) | Sherman's blue formula (drink name also says blue) | Sherman's weight-loss formula. No source gives the colour |
| Twins | The window booth at Roadside Cafe. (caption under the poster art) | Julius and Vincent, matching suits. |
| Twins | Overheard at the counter: the fuel injector in the Cadillac boot. | In the stolen Cadillac's boot: one fuel injector. |
The diner layout's stock wording made the two "Overheard at the counter" lines and the booth captions; check every diner film for the same.

## Under 3.5 vibe: the one change that lifts each most
- Twins (3.0): Roadside Cafe is only a filming location, no scene happens there. Use a place the film shows.
- Bruce Almighty (3.2): swap Evan's prime rib for Grace's grilled cheese with the tomato soup; fix house pickles printing 5.95 under "Free with every miracle".
- Me, Myself & Irene (3.2): Charlie's three sons (Jamaal, Lee Harvey, Shonte Jr.) on the board, replacing the coffee milk filler note.
- Bring It On (3.4): the East Compton Clovers in the words (a Clovers drink, or scoreboard Toros v Clovers).
- There's Something About Mary (3.4): swap "Miami Cuban sliders" for a prom-night dish (Miami is 13 years after the 1985 prom).

## Other notes (not fact errors)
- Food lines cut to stubs ("Corn chips.", "Sardines.", "Slow beef.") on Scary Movie and The 'Burbs: make the food part a sentence that stands alone.
- Dirty Harry footer stray full stop: "do ya, punk?."
- Robin Hood and Twins print the same poster art twice.
