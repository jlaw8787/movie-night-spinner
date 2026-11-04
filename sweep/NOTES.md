# Notes for the lead (hand-built-b)

## Needs code
- The Untouchables (1987), hb:casefile. fmtCase prints an evidence log ("Bureau of Prohibition", "Seized from the kitchen"), not a menu from a venue. The kit now names the Bureau of Prohibition so the two match, but a true venue menu (Capone's Lexington Hotel banquet, say) needs the renderer reworked. fmtCase hard codes "EVIDENCE", "FORM P-17 · SEIZED GOODS", "CASE CLOSED" and has no venue field, so it cannot be done from the film entry alone.

- Edition films (movie-menus.js, not on our edit list) lock the five cooked dishes: tests/era-menus.test.cjs checks the phone dishes against the edition. So:
  - Trading Places (1983): Frozen orange juice shots stay as a cooked starter even though it is a drink. The Heritage Club Caesar is on the card instead of the cheesesteak bites, with a recipe in recipes2, but is not cooked. To cook the Caesar in place of the shots, the edition in movie-menus.js needs the swap.
  - When Harry Met Sally... (1989): the showtime cue on the check comes from the edition and still reads "Serve mains when they stop at the diner on the drive east." It should now read something like "Serve the mains when Harry and Sally sit down at Katz's."
  - The Godfather Part II (1974): the edition's method text for Vito's tenement baked ziti still says sausage. The card, recipes2 (Prep sheet and phone) and printed menu say eggplant.

## Checker
- The kit venue check reads the printed menu line by line. Several printed names sit across two lines ("Southbound / LUNCH COUNTER", "The Prizzi / Wedding", "FOX / & SONS / BOOKS"), so it flags matches that are fine. Joining lines with a space before matching clears them.
