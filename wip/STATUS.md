# Menu 9.5 polish: work in progress

Not live. Saved mid-way when the usage limit hit.

- Brief: wip/rework/POLISH.md (plus wip/rework/BRIEF.md for the base standard and creative direction).
- Renderers: wip/rework/<fmt>.js (one function each, spliced into formats.js by function name; list.json maps fmt to function name and films).
- Label overrides: wip/rework/<fmt>.labels.json (printed dish name n, description d, film note; keyed by film id then spec k).
- Touched in the polish pass (52): acrossglass annietable bippy boatdrinks bookshopcafe bowerybelow brooklyn carmine cityrun cornerside dorothysupper escape eventually fever flamingo gershwinfolio getawaysupper highhat jurassic lasttrain latenightcall leon loftsupper mailroomexecutive maytable messenger moodslime moonlit negotiation nightshift oceansupper ooze orangefutures paraiso perdition pizzatime plazanight powerlunch prizzis rooftop serpico shift shorty sixteen sohoaftermidnight southbound southie spenditall suite sullivansupper toystore unplanned
- Not yet touched (23): afterhours chocolaterie collection coney corleone corleone2 delancey gimbels kitchenfolio lair leftys maitland miami nakatomi newsroom palermo roadtrip sals sobelsupper tangiers tonys village whistle
- Touched does not mean finished or checked. Every one needs a preview, a look at the export and the spill check.

Tools (paths inside the scripts point at the old session scratchpad and need updating):
- wip/rework/preview.py: installs one renderer and labels into a repo copy's formats/<fmt>.js chunk, renders on a local server, saves the export jpg, reports SPILL (text out of its card).
- wip/rework/splice.py: splices renderers into formats.js. wip/rework/apply_labels.py: merges labels into formats.js specs.
- wip/tools/overflow2.py and sweep850.py: spill checks for era menus and all 850 menus (run one page at a time or wait 8s, otherwise fonts cause false alarms).
