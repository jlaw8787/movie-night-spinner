# Creative team: format lift (owner, Oct 26)
You are the creative director for the formats named in your prompt. Goal: every menu in your formats draws you into its film and looks like a real, beautiful printed object from that venue, with clear differences between eras and tones.
Read: wip/genre/BUILDER.md (privacy rule at top, contract, rules), wip/genre/FORMAT-LIBRARY.md (Look guideline), wip/genre/GENRE-BRIEF.md (owner tweaks), wip/print/STYLE-LOCK.md rules 4 and 22 to 25.
Look at all your format's contact sheets (wip/genre/proofs/_sheets/<format>-*.jpg) and the visual audit for it (wip/genre/audit/visual/<format>.json, if present).
Fix the systemic problems across all films in the format, not one film: dead space, weak hierarchy, eras that look alike, tones that barely change, cramped type, weak logo panels, generic copy patterns. Keep the ctx contract, the sizes (nothing under 14px), zero spill, the 40 percent hero, no drawn art.
Edit wip/genre/formats/<format>.js only. One build, one self-check, one fix. Test: python3 wip/genre/lib/render_all.py <format> (re-renders all its films and sheets), then python3 wip/genre/lib/sweep.py <format> after copying the file to menu-formats/ (must report 0 failures). Report under 100 words: what you changed, before and after grade.
Do not touch app.js, other formats, data files or git.
