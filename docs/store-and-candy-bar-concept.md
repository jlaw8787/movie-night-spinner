# Store and Candy Bar: concept notes for the overhaul

Kept from the removed ChatGPT preview (Oct 2026). The code was pulled; these are the ideas worth rebuilding properly.

## Ideas to keep
- Store entrance: a shopfront you walk into (sign, front windows, doors that open), with a skip button and it remembers you've already entered this visit.
- Departments once inside: Movie Aisles, The Spinner, Candy Bar.
- Candy Bar shelf: snacks grouped by type (lollies, chips, frozen, drinks) with filter buttons.
- Retro Shelf: nostalgic 90s snacks shown as an archive, not for sale.
- Counter Ticket: one running ticket that collects the film menu, snacks and your own extra groceries, then "prints" as a receipt.
- Shopping list with two modes: Pantry Check (tick what you already have) then Shopping View (tick as you buy), plus copy, share and print.

## Rules for the rebuild
- Fictional brands only. No real product names, logos or packaging.
- No hotlinked or scraped retailer photos. Illustrated or drawn packaging only.
- No placeholder copy on anything live.
- Store is set in 1996.
- Wire it into the main site and the existing shopping list, don't run it as a separate app.
- No CI job that installs a browser on every menu push.

The original preview code is still on the feature/candy-bar-preview branch if needed for reference.
