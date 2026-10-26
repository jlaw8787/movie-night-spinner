# Front-page layout pass (owner, Oct 26, 20:10). ONE style per person. Change only what is listed here.

The owner wants the film poster to be THE main picture on every library menu. A quality review found the poster too small (12 to 26 percent of the front face), sitting in oversized frames with empty or blurred filler around it, and sometimes under the title logo.

## Your one job, in menu-formats/<id>.js only
1. On the FRONT face (the first face), make the poster the biggest thing: at least 35 percent of the face area, aiming for about 40. Show it whole at its own 2:3 shape, with no cropping.
2. The poster's frame must hug the poster. No empty side panels, no plain colour blocks, no blurred copy of the poster as filler.
3. Nothing laid over the poster: no title logo, tag, ticket, stamp or card may overlap it.
4. Reflow the other front-face pieces (logo, venue name, quote, ticket, small photo) around the bigger poster. Shrink or drop a small photo or decoration if needed. Keep the style's look: same paper, fonts, colours and signature pieces.
5. Do not touch the back face, the menu text, the fitters, the fonts or any other file.

## Rules that still apply
No text under 14px. No text spilling or cut off. No flat or clip art. Logo readable in its own colours. No dashes in any text you add.

## Check before you report
The local server runs on port 8795. Test films for your style:
`python3 -c "import json;F=json.load(open('data/film-format.json'));print([k for k,v in F.items() if v['format']=='<id>'][:3])"`
1. `python3 wip/genre/lib/posterpct.py "<film>" "<film>" "<film>"` prints the poster share, a text check and the screenshot path. You need 35 percent or more and "text ok" for all three.
2. Read each screenshot it writes and look at it properly: poster whole and big, nothing over it, no empty panels.
3. `python3 wip/genre/lib/pdfcheck.py "<one film>"`, then Read the sheet it writes: the PDF must match the app.
Do not run sweep.py. Never put personal details in any request.

Report in under 60 words: poster share before and after, and anything you could not fix.
