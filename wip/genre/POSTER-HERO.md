# Poster as the main picture (owner, Oct 26, 17:51): "I don't like the hero image, I would prefer the movie poster there." Scope: every library menu.

Work in /home/claude/polish. Edit ONLY the format files you are given in menu-formats/<id>.js. Do not touch git, app.js, data, or any other file.

## The change
- The main (hero) picture on each format is the film's TMDB poster: `ctx.poster` (a TMDB path, use `ctx.img(ctx.poster,"w780")`). Stills (`ctx.stills`) stay for the secondary photos only. If a film has no poster, fall back to the first still.
- Show the whole poster: never crop its title, faces or credits block. Reshape the hero frame to the poster's 2:3 portrait ratio where the layout allows. Where the slot must stay landscape, put the whole poster (object-fit:contain) on a panel of the format's own material (paper, board, chalk, wood) or on a darkened, blurred copy of the same poster. Keep the format's frame, border and signature treatment around it.
- The poster already shows the title, so do not lay the title logo over the poster. Keep the logo in the masthead or title spot as now.
- Captions on the hero must not describe a scene. Use a plain line, such as "Now showing" or the venue line.
- Drop any still-only tricks on the hero (dark-still lifting, face-position cropping) that would crop or tint the poster. Light paper wear on top is fine. Do not grey out or recolour the poster.

## Must still hold (STYLE-LOCK and FORMAT-LIBRARY rules)
Readable sizes (nothing under 14px), no text spill or cut text, no flat art (rule 25), logos in colour, no dashes, family films alcohol-free. The format must still look like its real printed object.

## PDF export must match the app
The app exports with html2canvas, which cannot do mix-blend-mode, background-blend-mode, CSS masks or filters on backgrounds. It only refetches `<img>` tags for CORS.
- Use an `<img>` tag (crossorigin="anonymous") for every photo, never a CSS background-image.
- Do not rely on blend modes for the paper colour. Texture layers that use them are hidden in the export, so the paper must look right without them.

## Test (required, then one fix round)
The local server runs on port 8795 from the repo root. If `curl -s localhost:8795/` fails, start it with `cd /home/claude/polish && python3 -m http.server 8795` as a background process.
Get the test films: `python3 -c "import json;F=json.load(open('data/film-format.json'));print([k for k,v in F.items() if v['format']=='<id>'][:4])"`. Add "American Pie (1999)" if your format is prom.
1. `python3 wip/genre/lib/sweep.py <id> [<id>...]` must report 0 failures for your formats.
2. `python3 wip/genre/lib/pdfcheck.py "<film>" ...` for 3 films per format. Open every sheet it writes, which shows the app over the PDF, and confirm the PDF matches: poster present, paper colour the same, no blank photos.
3. Look at one app face per format yourself (the sweep thumbnails are in wip/genre/proofs/_sweep/).

Privacy: never put personal details in any request. Report in under 100 words: formats done, any film or format you could not make work, and why.
