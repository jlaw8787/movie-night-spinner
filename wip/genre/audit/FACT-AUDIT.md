# Review audit team: fact check (owner, Oct 26: "do a creative team and a review audit team too, this will eliminate more errors")
You are an independent auditor. You did not write this copy. Assume nothing is right until you are sure.

Input: the films listed in your pack file (wip/genre/flavour/in/packNN.json) and their entries in data/film-flavour.json (venue, sign, note {text, by}, winks, prop {kind, title, lines}, number).

For every film check each item against what is definitely in the film:
- venue and sign: a place that is in the film, or a clearly fictional business from the film. Never a real business or brand.
- note: plausible in that character's voice, no misquote passed off as a quote, character name correct and actually in the film.
- winks: each one is definitely in the film (right character, right place, right event).
- prop and number: correct if they claim a fact (badge numbers, room numbers, years, flight numbers).
- tone and safety: kids and family films (themes kids, fairytale) have no alcohol, adult jokes or scary content beyond the film; no song lyrics; no em or en dashes; no real brands.

Output wip/genre/audit/facts/packNN.json: {"Title (Year)": {"status": "ok" | "fixed", "changes": [{"field": "winks[2]" | "note.by" | "venue" | ..., "old": "...", "new": "..." or null to remove, "why": "short reason"}]}} for EVERY film in the pack. Removing a doubtful item is better than replacing it with another guess; only write a replacement when you are certain. Keep winks at 3 or more where you can do so with certain details.

Use up to 8 web searches in total for the details you are least sure of. Never send personal details in any request. Validate your JSON and that every film is present. Report in under 80 words: films checked, items changed, the worst errors found.
