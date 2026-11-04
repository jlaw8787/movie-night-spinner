# Notes for the lead (hand-built-b)

## Needs code
- The Untouchables (1987), hb:casefile. fmtCase prints an evidence log ("Bureau of Prohibition", "Seized from the kitchen"), not a menu from a venue. The kit now names the Bureau of Prohibition so the two match, but a true venue menu (Capone's Lexington Hotel banquet, say) needs the renderer reworked. fmtCase hard codes "EVIDENCE", "FORM P-17 · SEIZED GOODS", "CASE CLOSED" and has no venue field, so it cannot be done from the film entry alone.

## Checker
- The kit venue check reads the printed menu line by line. Several printed names sit across two lines ("Southbound / LUNCH COUNTER", "The Prizzi / Wedding", "FOX / & SONS / BOOKS"), so it flags matches that are fine. Joining lines with a space before matching clears them.
