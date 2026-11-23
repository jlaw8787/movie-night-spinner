/* Builds the static film pages Google can index, plus the sitemap and robots.txt.
     node scripts/build-seo.cjs        (also runs at the end of scripts/build-data.cjs)
   Sources: data/films.json (the lineup), data/film/<slug>.json (menu, recipes, venue),
            tmdb-posters.js (poster paths), data/film-genres.json, assets/menu-previews/<slug>.jpg
            (made by scripts/render-previews.cjs; a page without one simply shows no preview).
   Output:
     menu/<slug>/index.html         one page per film, e.g. /menu/the-godfather-1972/
     menu/index.html                every film A to Z, plus theme and genre lists
     menu/theme/<theme>/index.html  films by menu theme
     menu/genre/<genre>/index.html  films by genre
     sitemap.xml, robots.txt
   Pages that no longer match a film are removed, so this stays in step with data/films.json. */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..');
const SITE = 'https://reeldinner.com';
const rd = p => fs.readFileSync(path.join(ROOT, p), 'utf8');
const rj = p => { try { return JSON.parse(rd(p)); } catch (e) { return {}; } };
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
/* no em dashes anywhere on these pages: spaced dashes read as commas, number ranges as "to" */
const clean = s => String(s == null ? '' : s)
  .replace(/(\d)\s*[\u2013\u2014]\s*(\d)/g, '$1 to $2')
  .replace(/\s*\u2014\s*/g, ', ').replace(/\s+\u2013\s+/g, ', ').replace(/\u2013/g, '-');
const esc = s => clean(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const cut = (s, n) => { s = clean(s); if (s.length <= n) return s; const t = s.slice(0, n - 3); return t.slice(0, t.lastIndexOf(' ')).replace(/[,;:.]$/, '') + '...'; };
const write = (rel, txt) => { const p = path.join(ROOT, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); if (!fs.existsSync(p) || fs.readFileSync(p, 'utf8') !== txt) fs.writeFileSync(p, txt); };

const films = JSON.parse(rd('data/films.json'));
const POSTERS = (() => { const m = rd('tmdb-posters.js').match(/const TMDB_POSTERS=(\{[\s\S]*?\});/); return m ? JSON.parse(m[1]) : {}; })();
const GENRES = rj('data/film-genres.json');
/* theme names as the app shows them (the T table near the top of app.js) */
const THEMES = (() => { const m = rd('app.js').match(/const T=(\{[\s\S]*?\}\});/); return m ? JSON.parse(m[1]) : {}; })();
const COURSE = { s: 'Snacks', m: 'Mains', w: 'Sweets', d: 'Drinks' };
const DRY_THEMES = (() => { const m = rd('app.js').match(/const DRY_THEMES=(\[[^\]]*\]);/); return m ? JSON.parse(m[1]) : []; })();
const DRY_FILMS = (() => { const m = rd('app.js').match(/const DRY_FILMS=(\[[^\]]*\]);/); return m ? JSON.parse(m[1]) : []; })();
/* review 31: the page uses the app's own split of a recipe's time (dishTimes in app.js), so pickling, chilling and resting count as
   waiting, not cooking (Tombstone's pickled eggs read "cook 4343 min"). Long times read in hours or days. */
/* review 37: printed names on the hand-built menus (formats.js items carry the recipe key k and the printed name n) */
const CARD_PRINT = (() => { try { return rj('data/card-print.json'); } catch (e) { return {}; } })();
const HOUSE = (() => { try { return rj('data/film-house.json'); } catch (e) { return {}; } })();
/* review 40: hand-built one-offs, as their card and phone menu print them (render-previews saves it) */
const CARD_HB = (() => { try { return rj('data/card-print-hb.json'); } catch (e) { return {}; } })();
const HB_NAMES = (() => { const vm = require('vm'), ctx = { ESC: x => x }; vm.createContext(ctx); try { vm.runInContext(rd('formats.js') + ';this.F=FMT_FILMS;', ctx); } catch (e) { return {}; }
  const out = {}; for (const [id, spec] of Object.entries(ctx.F || {})) { const m = {}; const walk = v => { if (Array.isArray(v)) v.forEach(walk); else if (v && typeof v === 'object') { if (typeof v.k === 'string' && typeof v.n === 'string' && v.n.trim() && v.n !== v.k) m[v.k.toLowerCase()] = v.n; Object.values(v).forEach(walk); } }; walk(spec); if (Object.keys(m).length) out[id] = m; }
  return out; })();
const dishTimes = (() => { const vm = require('vm'), src = rd('app.js'); const line = k => { const i = src.indexOf(k); return src.slice(i, src.indexOf('\n', i)); };
  const a = src.indexOf('function dishTimes('), b = src.indexOf('\n/*', a);
  const ctx = {}; vm.createContext(ctx); vm.runInContext([line('const WAIT_RE='), line('const HEAT_RE='), line('const TIP_RE='), line('const stepParts='), line('const WAIT_LEAD='), (() => { const i = src.indexOf('const isWaitStep='); return src.slice(i, src.indexOf('};', i) + 2); })(), src.slice(a, b), ';globalThis.dishTimes=dishTimes;'].join('\n'), ctx); return ctx.dishTimes; })();
const span = m => { m = Math.round(m); if (m < 120) return m + ' min'; if (m < 48 * 60) { const h = Math.round(m / 30) / 2; return (h % 1 ? h.toFixed(1) : h) + ' hours'; } const d = Math.round(m / 1440); return d + (d === 1 ? ' day' : ' days'); };

const COURSE_CAT = { s: 'Appetizer', m: 'Main course', w: 'Dessert', d: 'Drink' };
const KEYS = { s: 'S', m: 'M', w: 'W', d: 'K' };
const frac = q => { if (q == null || q === '') return ''; const w = Math.floor(q), f = Math.round((q - w) * 100) / 100, F = { 0.25: '1/4', 0.33: '1/3', 0.5: '1/2', 0.67: '2/3', 0.75: '3/4' }[f]; return F ? (w ? w + ' ' : '') + F : String(+q.toFixed(2)); };
/* review 34: cups go plural over one (the app already said "3 cups"), and temperatures read "200°C" as they do in the app */
const degC = t => String(t == null ? '' : t).replace(/(\d)\s?C\b/g, '$1°C').replace(/(\d)\s?F\b/g, '$1°F');
/* review 35: metric amounts read as the app writes them: decimals, never fractions ("1.5 L", "375ml", "1.2kg"), litres with a capital L */
const ing = i => { let u = i.u || ''; const met = /^(g|kg|ml|l|L)$/.test(u); const q = met ? (i.q == null || i.q === '' ? '' : String(+(+i.q).toFixed(2))) : frac(i.q); if (u === 'cup' && (+i.q > 1)) u = 'cups'; if (u === 'l' || u === 'L') return clean(degC([q && q + ' L', i.item].filter(Boolean).join(' '))); const tight = met; return clean(degC([q && (tight ? q + u : q + (u ? ' ' + u : '')), i.item].filter(Boolean).join(' '))); };
const cap = t => { t = clean(t); return t.charAt(0).toUpperCase() + t.slice(1); };
/* width and height of a jpeg, read from its frame header */
/* previews are shot at 2x (scripts/render-previews.cjs), so pages show them at half their pixel size */
const jpgSize = f => { const b = fs.readFileSync(f); let i = 2; while (i < b.length) { const m = b[i + 1], L = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; i += 2 + L; } return { w: 600, h: 849 }; };
const iso = m => 'PT' + Math.max(0, Math.round(m || 0)) + 'M';

/* review 41: a kids, family, Christmas or wizard page runs the same dry pass the phone menu runs (dryText in app.js), so the page, card and
   phone say the same thing word for word (Violent Night's page bought alcohol-free stout, the phone pours ginger beer) */
const dryText = (() => { const vm = require('vm'), src = rd('app.js'); const grab = (k, end) => { const i = src.indexOf(k), j = src.indexOf(end, i); return src.slice(i, j + end.length); };
  const ctx = {}; vm.createContext(ctx); vm.runInContext([grab('const KDRY=', '})();'), grab('const KFIX=', '})();'), grab('const dryFold=', '\n'), grab('const KKEEP=', '\n'), grab('const dryKeep=', '\n'), grab('const dryText=', '\n'), grab('const dryText0=', '\n'), ';globalThis.dryText=dryText;'].join('\n'), ctx); return ctx.dryText; })();
const dryDish = y => { const D = t => typeof t === 'string' ? dryText(t, true) : t; return { ...y, n: D(y.n), note: D(y.note), how: D(y.how), make_ahead: D(y.make_ahead),
  ingredients: (y.ingredients || []).map(i => ({ ...i, item: D(i.item) })), steps: (y.steps || []).map(t => typeof t === 'string' ? D(t) : { ...t, text: D(t.text) }) }; };
/* every film's page facts, built once */
const ALL = films.map((f, i) => {
  const id = f.title + ' (' + f.year + ')', s = slug(id), d = rj('data/film/' + s + '.json');
  const shown = f.title.replace(/ - /g, ', ');
  const fl = ((d.kit || d.lib || {}).flavour) || {};
  const notes = {};
  for (const k of 'SMWK') for (const r of (d[k] || f[k] || [])) notes[String(r[0]).toLowerCase()] = r[1];
  /* review 38: kids, family, Christmas and wizard menus print the alcohol-free version of a dish (DRY_THEMES in app.js): so does the page
     (The Fellowship of the Ring's card serves hot buttered apple, the page listed hot buttered ale) */
  const dry = DRY_THEMES.includes(f.theme) || DRY_FILMS.includes(id);
  const dishes = ((d.r2 && d.r2.dishes) || []).map(x0 => { const af = dry && x0.alt && x0.alt.af; const x = af ? { ...x0, ...af, n: String(af.n || x0.n).replace(/\s*\((alcohol|booze)[- ]free\)$/i, ''), alt: undefined, af: true, n0: x0.n } : x0;/* review 39: the card prints the name without "(alcohol-free)" */ return { ...x, note: notes[String(x.n).toLowerCase()] || notes[String(x0.n).toLowerCase()] || '' }; });
  if (!dishes.length) for (const c of 'smwd') for (const r of (d[KEYS[c]] || f[KEYS[c]] || [])) dishes.push({ n: r[0], course: c, note: r[1], how: r[2], ingredients: [], steps: [] });
  /* review 32: every dish printed on the menu is on the page. The ones without a full recipe card (the menu cooks five) follow in their
     course, marked "On the printed menu", with how it is made; they stay out of the Recipe list in the JSON-LD */
  { const have = new Set(dishes.flatMap(y => [String(y.n).toLowerCase(), String(y.n0 || '').toLowerCase()]));
    for (const c of 'smwd') for (const r of (d[KEYS[c]] || f[KEYS[c]] || [])) if (r && r[0] && !have.has(String(r[0]).toLowerCase()) && !(dry && c === 'd' && /\b(wine|bordeaux|champagne|bourbon|whisk(e)?y|rum|vodka|gin|tequila|brandy|ale|beer|lager|stout|cider|sherry|port|highball|martini|margarita|mead|cocktail|liqueur|schnapps|prosecco|spritz)\b/i.test(String(r[0]) + ' ' + String(r[1] || '')))) {/* review 38: a dry card never prints the alcoholic drink, so its page does not list it (Ratatouille's Bordeaux) */ have.add(String(r[0]).toLowerCase()); dishes.push({ n: r[0], course: c, note: r[1], how: r[2], ingredients: (r[3] || []).map(x => ({ item: String(x).split('@')[0] })), steps: [], extra: true }); } }
  /* review 37: a hand-built menu prints its own short name for a dish ("Buddy Holly chicken", not "Buddy Holly's chicken basket"): the page uses it */
  { const nm = HB_NAMES[id]; if (nm) for (const y of dishes) { const v = nm[String(y.n).toLowerCase()]; if (v) y.n = v; } }
  /* review 39: a shared-layout page reads the card as printed (data/card-print.json, saved by render-previews with each preview): every note
     is the card's note, alcohol-free on a dry card, and the house starter and drink the card prints are on the page too */
  { const cp = CARD_PRINT[id]; if (cp && cp.length) { const L = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim(), by = new Map(cp.map(r => [L(r[1]), r]));
    const used = new Set();
    for (const y of dishes) { const r = by.get(L(y.n)) || by.get(L(y.n0)) || (dry ? by.get(L(dryText(y.n, true))) : null); if (r) { y.note = r[2]; used.add(r); if (dry) y.cardN = r[1]; } }
    for (const r of cp) if (!used.has(r) && !dishes.some(y => L(y.n) === L(r[1]))) { const hs = HOUSE[id] && HOUSE[id][r[0] === 'd' ? 'd' : 's']; dishes.push({ n: r[1], course: r[0], note: r[2], ingredients: [], steps: [], extra: true, house: !!r[3], veg: hs ? !hs.meat : false }); }
    /* review 41: the card is the list. A recipe the shared layout has no room to print is not on the page either (Turner & Hooch's
       beer-battered fish and chips, 133 dishes on 130 pages) */
    for (let i = dishes.length - 1; i >= 0; i--) if (!cp.some(r => L(r[1]) === L(dishes[i].n) || L(r[1]) === L(dishes[i].n0) || (dry && L(r[1]) === L(dryText(dishes[i].n, true))))) dishes.splice(i, 1);
    const ord = { s: 0, m: 1, w: 2, d: 3 }; dishes.sort((a, b) => ord[a.course] - ord[b.course]); } }
  /* review 40: a hand-built page lists only what the card prints, with the card's words and the phone menu's recipe (The Godfather page
     had films.json notes and Goodfellas listed four dishes the card never prints) */
  { const hb = CARD_HB[id]; if (hb && hb.length) { const L = t => String(t || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const keep = hb.filter(r => r.printed).map(r => { const was = dishes.find(y => L(y.n) === L(r.n) || L(y.n0) === L(r.n)) || {};
      return { n: r.n, course: r.c, note: r.note, ingredients: (r.ing || []).map(t => ({ item: t })), steps: (r.steps || []).map(t => ({ text: t })), extra: !(r.ing || []).length,
        prep_min: (r.ing || []).length ? was.prep_min : undefined, cook_min: (r.ing || []).length ? was.cook_min : undefined, wait_min: was.wait_min, veg: !!was.veg, af: !!was.af, _T: (r.ing || []).length && (was.prep_min || was.cook_min) ? dishTimes(was, 1) : null }; });
    if (keep.length) { dishes.length = 0; dishes.push(...keep); } } }
  if (dry) for (let i = 0; i < dishes.length; i++) dishes[i] = dryDish(dishes[i]);
  return { i, id, s, f, d, shown, venue: fl.venue || '', theme: f.theme, genres: GENRES[id] || [], poster: POSTERS[id] || '', dishes,
    preview: fs.existsSync(path.join(ROOT, 'assets/menu-previews', s + '.jpg')) ? jpgSize(path.join(ROOT, 'assets/menu-previews', s + '.jpg')) : null };
});
const BY_THEME = {}; for (const x of ALL) (BY_THEME[x.theme] = BY_THEME[x.theme] || []).push(x);
const BY_GENRE = {}; for (const x of ALL) for (const g of x.genres) (BY_GENRE[g] = BY_GENRE[g] || []).push(x);
const themeName = t => (THEMES[t] && THEMES[t].name) || t;
const az = (a, b) => a.shown.replace(/^(The|A|An) /, '').localeCompare(b.shown.replace(/^(The|A|An) /, ''), 'en', { numeric: true }) || a.f.year - b.f.year;

const CSS = `:root{--ink:#120608;--panel:#1f0b0f;--hair:rgba(232,190,110,.2);--acc:#e2b04f;--text:#f3e9da;--muted:#c9b8a3;--red:#b3261e}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--ink);color:var(--text);font:17px/1.55 "Jost","Futura","Century Gothic","Helvetica Neue",Arial,sans-serif}
a{color:var(--acc)}img{max-width:100%;height:auto;display:block}
.top{display:flex;align-items:center;gap:10px;padding:12px 18px;border-bottom:1px solid var(--hair);background:#5a0f1f}
.top a{display:flex;align-items:center;gap:10px;color:var(--text);text-decoration:none;font:400 22px/1 "Limelight",Georgia,serif}
.top img{width:36px;height:36px;border-radius:8px}.top .nav{margin-left:auto}.top .nav a{font:500 15px/1 "Oswald","Jost",sans-serif;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;color:var(--acc)}
main{max-width:1000px;margin:0 auto;padding:22px 18px 40px}
h1{font:400 clamp(28px,5vw,44px)/1.12 "Limelight",Georgia,serif;margin:6px 0 8px;color:#fff}
h2{font:500 22px/1.2 "Oswald","Jost",sans-serif;letter-spacing:.05em;text-transform:uppercase;color:var(--acc);margin:34px 0 12px;border-bottom:1px solid var(--hair);padding-bottom:6px}
h3{font:600 19px/1.3 "Jost",sans-serif;margin:0 0 4px;color:#fff}
.crumbs{font-size:14px;color:var(--muted)}.crumbs a{color:var(--muted)}
.lead{font-size:19px;color:var(--muted);margin:0 0 6px}
.hero{display:grid;grid-template-columns:180px 1fr;grid-template-rows:auto 1fr;column-gap:22px;align-items:start;margin-top:14px}
.hero>img{grid-row:1/3;border-radius:6px;box-shadow:0 6px 18px rgba(0,0,0,.5)}
@media(max-width:600px){.hero{grid-template-columns:96px 1fr;column-gap:14px}.hero>img{grid-row:1}.hero .hi{grid-column:1/3;margin-top:12px}.lead{font-size:17px}.btn{display:block;text-align:center}.top a{font-size:19px}}
.btn{display:inline-block;margin:14px 0 6px;padding:15px 26px;border-radius:999px;background:var(--red);color:#fff;text-decoration:none;font:500 20px/1 "Oswald","Jost",sans-serif;letter-spacing:.05em;text-transform:uppercase;box-shadow:0 4px 0 #6d1510}
.btn:hover{background:#c9302a}.small{font-size:14px;color:var(--muted)}
.preview{margin:8px 0 0;background:var(--panel);border:1px solid var(--hair);border-radius:8px;padding:10px}
.preview img{margin:0 auto;border-radius:3px}.preview figcaption{text-align:center;font-size:14px;color:var(--muted);margin-top:8px}
.dish{background:var(--panel);border:1px solid var(--hair);border-radius:8px;padding:14px 16px;margin:0 0 12px}
.dish p{margin:0 0 6px;color:var(--muted)}.meta{font-size:14px;color:var(--muted)}
.tag{display:inline-block;font-size:12px;border:1px solid var(--hair);border-radius:999px;padding:1px 8px;margin-left:6px;vertical-align:2px;color:var(--acc)}
details{margin-top:8px}summary{cursor:pointer;color:var(--acc);font-weight:600}
details ul,details ol{margin:8px 0 4px;padding-left:22px}details li{margin:2px 0}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:14px;list-style:none;padding:0;margin:0}
.cards a{text-decoration:none;color:var(--text);font-size:14px;line-height:1.3}.cards img{border-radius:5px;margin-bottom:6px;aspect-ratio:2/3;object-fit:cover;background:var(--panel)}
.cols{columns:3 220px;column-gap:24px;padding:0;margin:0;list-style:none}.cols li{break-inside:avoid;margin:0 0 4px}
.chips{display:flex;flex-wrap:wrap;gap:8px;list-style:none;padding:0;margin:0}.chips a{display:block;padding:6px 12px;border:1px solid var(--hair);border-radius:999px;text-decoration:none;font-size:15px}
.letter{font:500 18px/1 "Oswald",sans-serif;color:var(--acc);margin:18px 0 6px}
footer{border-top:1px solid var(--hair);padding:18px;text-align:center;font-size:13px;color:var(--muted)}footer p{margin:4px 0}`;

const page = ({ title, desc, canon, body, image, ld, ogType }) => `<!DOCTYPE html>
<html lang="en-AU">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${canon}">
<meta name="theme-color" content="#5a0f1f">
<meta property="og:type" content="${ogType || 'website'}">
<meta property="og:site_name" content="Reel Dinner">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${canon}">
<meta property="og:image" content="${image || SITE + '/assets/app/share.jpg'}">
<meta property="og:locale" content="en_AU">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/app/favicon-48.png" sizes="48x48">
<link rel="apple-touch-icon" href="/assets/app/apple-touch-icon.png">
<link rel="stylesheet" href="/assets/fonts/core.css">
<style>${CSS}</style>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n` : ''}</head>
<body>
<header class="top"><a href="/"><img src="/assets/app/icon-72.webp" width="36" height="36" alt="">Reel Dinner</a><span class="nav"><a href="/menu/">All film menus</a></span></header>
<main>
${body}
</main>
<footer><p><a href="/">Spin the wheel at Reel Dinner</a> · <a href="/menu/">All 1,000 film menus</a> · <a href="/privacy">Privacy</a></p>
<p>Film posters from TMDB. This product uses the TMDB API but is not endorsed or certified by TMDB.</p></footer>
</body>
</html>
`;
const posterUrl = (p, w) => p ? 'https://image.tmdb.org/t/p/' + (w || 'w342') + p : '';
const card = x => `<li><a href="/menu/${x.s}/"><img src="${posterUrl(x.poster, 'w185')}" width="185" height="278" loading="lazy" alt="${esc(x.shown)} poster">${esc(x.shown)} (${x.f.year})</a></li>`;

/* each dish has an anchor so the Recipe entries in the JSON-LD point at their own spot on the page (all-in-one recipe list) */
const dishId = y => 'dish-' + slug(clean(y.n)).slice(0, 60);
function filmPage(x) {
  const { f, d, s, shown, id } = x, canon = `${SITE}/menu/${s}/`, open = '/?film=' + encodeURIComponent(id);
  const names = x.dishes.map(y => clean(y.n));
  const taken = new Map(), used = new Set();
  for (const y of x.dishes) { const b0 = dishId(y); let k = b0, n = 2; while (used.has(k)) k = b0 + '-' + n++; used.add(k); taken.set(y, k); }
  const did = y => taken.get(y);
  /* review 31: Google cuts titles past about 60 characters, so the brand drops first, then "dinner" */
  const title = [`${shown} (${f.year}) movie night dinner menu | Reel Dinner`, `${shown} (${f.year}) movie night dinner menu`, `${shown} (${f.year}) movie night menu`, `${shown} movie night menu`, `${shown} (${f.year}) menu`].find(t => t.length <= 60) || `${shown} (${f.year}) menu`;
  const listed = names.length > 3 ? names.slice(0, 3).join(', ') + ' and more' : names.join(', ').replace(/, ([^,]*)$/, ' and $1');
  /* review 30: the description always ends on a whole sentence, never cut mid-word. Longest version that fits in 155 */
  const two = names.length > 2 ? names.slice(0, 2).join(' and ') + ' and more' : listed;
  const head = `${shown} (${f.year}): a movie night menu`, from = x.venue ? ' from ' + clean(x.venue) : '';
  const desc = [
    `${head}${from}. ${listed}. Recipes for 4, a shopping list and a printable menu.`,
    `${head}${from}. ${listed}. Recipes for 4 and a printable menu.`,
    `${head}${from}. ${two}. Recipes for 4 and a printable menu.`,
    `${head}. ${listed}. Recipes for 4 and a printable menu.`,
    `${head}. ${two}. Recipes for 4 and a printable menu.`,
    `${head}${from}. Recipes for 4 and a printable menu.`,
    `${head}. Recipes for 4, a shopping list and a printable menu.`
  ].map(clean).find(t => t.length <= 155) || clean(`${head}. Recipes for 4 and a printable menu.`);
  const img = x.preview ? `${SITE}/assets/menu-previews/${s}.jpg` : (x.poster ? posterUrl(x.poster, 'w500') : '');
  const lede = [d.D, d.T].filter(Boolean).map(esc);
  const courses = [...'smwd'].map(c => {
    const ds = x.dishes.filter(y => y.course === c); if (!ds.length) return '';
    return `<h2>${COURSE[c]}</h2>\n` + ds.map(y => {
      const T = y._T || ((y.prep_min || y.cook_min) ? dishTimes(y, 1) : null);
      const meta = [T ? `Prep ${span(T.prep)}${T.cook ? ', cook ' + span(T.cook) : ''}${T.wait >= 30 ? ', then ' + span(T.wait) + ' to rest or set' : ''}` : '', y.make_ahead ? 'Make ahead: ' + esc(degC(y.make_ahead)) : ''].filter(Boolean).join(' · ');
      const ingr = (y.ingredients || []).map(i => `<li>${esc(ing(i))}</li>`).join('');
      const steps = (y.steps || []).map(st => `<li>${esc(degC(st.text))}</li>`).join('') || (y.how ? `<li>${esc(degC(y.how))}</li>` : '');
      return `<article class="dish" id="${did(y)}"><h3>${esc(y.n)}${y.veg && c !== 'd' ? '<span class="tag">Vegetarian</span>' : ''}${c === 'd' && y.af ? '<span class="tag">No alcohol</span>' : ''}${y.house ? '<span class="tag">House</span>' : ''}</h3>
${y.note ? `<p>${esc(cap(y.note))}</p>` : ''}${meta ? `<div class="meta">${meta}</div>` : ''}
${ingr || steps ? `<details><summary>${y.extra ? 'How it is made' : 'Recipe for 4'}</summary>${ingr ? `<ul>${ingr}</ul>` : ''}${steps ? `<ol>${steps}</ol>` : ''}</details>` : ''}</article>`;
    }).join('\n');
  }).join('\n');
  /* the crumb and the More block go by the film's main genre (always true to the film), not the wheel theme,
     which can name a place the menu is not set in (review 28: Lebowski under Roadside Diner) */
  const g0 = x.genres[0], pool = g0 ? BY_GENRE[g0] : (BY_THEME[x.theme] || []), at = pool.indexOf(x);
  const near = pool.filter(y => y !== x).sort((a, b) => (b.theme === x.theme) - (a.theme === x.theme) || Math.abs(pool.indexOf(a) - at) - Math.abs(pool.indexOf(b) - at)).slice(0, 8);
  const crumbName = g0 || themeName(x.theme), crumbHref = g0 ? `/menu/genre/${slug(g0)}/` : `/menu/theme/${x.theme}/`;
  const body = `<p class="crumbs"><a href="/menu/">Film menus</a> › <a href="${crumbHref}">${esc(crumbName)}</a></p>
<div class="hero">
${x.poster ? `<img src="${posterUrl(x.poster)}" width="342" height="513" alt="${esc(shown)} (${f.year}) poster" fetchpriority="high">` : '<span></span>'}
<h1>${esc(shown)} (${f.year}) movie night dinner menu</h1>
<div class="hi">
${lede.length ? `<p class="lead">${lede.join(' ')}</p>` : ''}
${x.venue ? `<p>The menu is set at <strong>${esc(x.venue)}</strong>, from the world of the film.</p>` : ''}
<a class="btn" href="${open}">Open this menu in Reel Dinner</a>
<p class="small">Print the menu, get the shopping list and plan the night, free.</p>
</div>
</div>
${x.preview ? `<h2>The printed menu</h2>
<figure class="preview"><img src="/assets/menu-previews/${s}.jpg" width="${Math.round(x.preview.w / 2)}" height="${Math.round(x.preview.h / 2)}" alt="Printed movie night menu for ${esc(shown)} (${f.year})" loading="lazy"><figcaption>Open it in Reel Dinner to print it full size.</figcaption></figure>` : ''}
${courses}
${d.P ? `<h2>When to serve</h2>\n<p>${esc(d.P)}</p>` : ''}
<p><a class="btn" href="${open}">Cook this menu</a></p>
${near.length ? `<h2>More ${esc(crumbName)} film menus</h2>\n<ul class="cards">${near.map(card).join('')}</ul>` : ''}
${x.genres.length ? `<p class="small">Genres: ${x.genres.map(g => `<a href="/menu/genre/${slug(g)}/">${esc(g)}</a>`).join(', ')}</p>` : ''}`;
  const recipe = y => ({
    '@type': 'Recipe', name: clean(y.n), description: cap(y.note || `${COURSE[y.course]} for a movie night of ${shown}`),
    image: img ? [img] : undefined, author: { '@type': 'Organization', name: 'Reel Dinner', url: SITE + '/' },
    recipeCategory: COURSE_CAT[y.course] || 'Main course', recipeYield: '4 servings',
    keywords: clean(`${shown}, movie night, ${f.year}, film menu`),
    ...((T => T ? { prepTime: iso(T.prep), cookTime: T.cook ? iso(T.cook) : undefined, totalTime: iso(T.prep + T.cook + T.wait) } : {})(y._T || ((y.prep_min || y.cook_min) ? dishTimes(y, 1) : null))),
    suitableForDiet: y.veg ? 'https://schema.org/VegetarianDiet' : undefined,
    recipeIngredient: (y.ingredients || []).map(ing),
    recipeInstructions: (y.steps || []).length ? y.steps.map(st => ({ '@type': 'HowToStep', text: clean(degC(st.text)) })) : (y.how ? [{ '@type': 'HowToStep', text: clean(degC(y.how)) }] : undefined)
  });
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': canon, url: canon, name: title, description: desc, inLanguage: 'en-AU', isPartOf: { '@type': 'WebSite', name: 'Reel Dinner', url: SITE + '/' },
      about: { '@type': 'Movie', name: shown, dateCreated: String(f.year), image: x.poster ? posterUrl(x.poster, 'w500') : undefined },
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Film menus', item: SITE + '/menu/' },
        { '@type': 'ListItem', position: 2, name: crumbName, item: SITE + crumbHref },
        { '@type': 'ListItem', position: 3, name: shown + ' (' + f.year + ')', item: canon }] } },
    { '@type': 'ItemList', name: `${shown} (${f.year}) movie night menu`, numberOfItems: x.dishes.filter(y => !y.extra).length,
      itemListElement: x.dishes.filter(y => !y.extra).map((y, n) => ({ '@type': 'ListItem', position: n + 1, url: canon + '#' + did(y), item: { ...recipe(y), '@id': canon + '#' + did(y), url: canon + '#' + did(y) } })) }] };
  return page({ title, desc, canon, body, image: img, ld, ogType: 'article' });
}

function listPage(rel, h1, intro, list, crumbs) {
  const canon = SITE + '/' + rel;
  const body = `<p class="crumbs"><a href="/menu/">Film menus</a>${crumbs ? ' › ' + crumbs : ''}</p>
<h1>${esc(h1)}</h1>
<p class="lead">${esc(intro)}</p>
<ul class="cards">${list.slice().sort(az).map(card).join('')}</ul>`;
  return page({ title: h1 + ' | Reel Dinner', desc: cut(intro, 160), canon, body });
}

/* write the film pages and drop any for films no longer in the lineup */
const keep = new Set(ALL.map(x => x.s));
for (const x of ALL) write(`menu/${x.s}/index.html`, filmPage(x));
const urls = [SITE + '/', SITE + '/menu/'];
for (const x of ALL) urls.push(`${SITE}/menu/${x.s}/`);
const themes = Object.keys(BY_THEME).sort((a, b) => themeName(a).localeCompare(themeName(b)));
const genres = Object.keys(BY_GENRE).sort();
for (const t of themes) {
  write(`menu/theme/${t}/index.html`, listPage(`menu/theme/${t}/`, `${themeName(t)} movie night menus`, `${BY_THEME[t].length} films in the ${themeName(t)} theme, each with its own dinner menu. Pick one to see the dishes and recipes, then open it in Reel Dinner to print the menu.`, BY_THEME[t], esc(themeName(t))));
  urls.push(`${SITE}/menu/theme/${t}/`); keep.add('theme');
}
for (const g of genres) {
  write(`menu/genre/${slug(g)}/index.html`, listPage(`menu/genre/${slug(g)}/`, `${g} movie night dinner menus`, `${BY_GENRE[g].length} ${g.toLowerCase()} films, each with its own themed dinner menu and recipes for 4.`, BY_GENRE[g], esc(g)));
  urls.push(`${SITE}/menu/genre/${slug(g)}/`); keep.add('genre');
}
/* the A to Z index */
{
  const sorted = ALL.slice().sort(az), groups = {};
  for (const x of sorted) { const c = x.shown.replace(/^(The|A|An) /, '').charAt(0).toUpperCase(); (groups[/[A-Z]/.test(c) ? c : '#'] = groups[/[A-Z]/.test(c) ? c : '#'] || []).push(x); }
  const body = `<h1>Movie night dinner menus for ${ALL.length.toLocaleString('en-AU')} films</h1>
<p class="lead">Every film on the Reel Dinner wheel has its own dinner menu, written for the world of the film, with recipes for 4 and a printable menu. Browse by theme, genre or title.</p>
<p><a class="btn" href="/">Spin the wheel</a></p>
<h2>By menu theme</h2>
<ul class="chips">${themes.map(t => `<li><a href="/menu/theme/${t}/">${esc(themeName(t))} (${BY_THEME[t].length})</a></li>`).join('')}</ul>
<h2>By genre</h2>
<ul class="chips">${genres.map(g => `<li><a href="/menu/genre/${slug(g)}/">${esc(g)} (${BY_GENRE[g].length})</a></li>`).join('')}</ul>
<h2>All films A to Z</h2>
<p class="small">${Object.keys(groups).map(k => `<a href="#l-${k === '#' ? 'num' : k}">${k}</a>`).join(' ')}</p>
${Object.entries(groups).map(([k, xs]) => `<p class="letter" id="l-${k === '#' ? 'num' : k}">${k}</p>\n<ul class="cols">${xs.map(x => `<li><a href="/menu/${x.s}/">${esc(x.shown)} (${x.f.year})</a></li>`).join('')}</ul>`).join('\n')}`;
  write('menu/index.html', page({ title: `Movie night dinner menus for ${ALL.length.toLocaleString('en-AU')} films | Reel Dinner`, desc: `Themed dinner menus for ${ALL.length.toLocaleString('en-AU')} films, from The Godfather to The Big Lebowski. Recipes for 4, shopping lists and printable menus.`, canon: SITE + '/menu/', body }));
}
/* review 33: a film swapped out of the lineup keeps its old address as a redirect to the film that took its place (data/film-redirects.json),
   so Google and old links land on a live page (Kicking & Screaming to Hall Pass) */
{let RD={};try{RD=JSON.parse(fs.readFileSync(path.join(ROOT,'data/film-redirects.json'),'utf8'))}catch(e){}
 for(const [from,to] of Object.entries(RD)){keep.add(from);const url=`https://reeldinner.com/menu/${to}/`;
  write(`menu/${from}/index.html`,`<!DOCTYPE html>\n<html lang="en-AU"><head><meta charset="utf-8"><title>Moved | Reel Dinner</title><meta name="robots" content="noindex"><link rel="canonical" href="${url}"><meta http-equiv="refresh" content="0; url=/menu/${to}/"></head><body><p>This menu has moved: <a href="/menu/${to}/">/menu/${to}/</a></p></body></html>\n`)}}
/* tidy pages for films, themes or genres that have gone */
const menuDir = path.join(ROOT, 'menu');
for (const n of fs.readdirSync(menuDir)) {
  const p = path.join(menuDir, n);
  if (!fs.statSync(p).isDirectory()) continue;
  if (n === 'theme' || n === 'genre') {
    const ok = new Set(n === 'theme' ? themes : genres.map(slug));
    for (const m of fs.readdirSync(p)) if (!ok.has(m)) fs.rmSync(path.join(p, m), { recursive: true, force: true });
  } else if (!keep.has(n)) fs.rmSync(p, { recursive: true, force: true });
}
write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `<url><loc>${u}</loc></url>`).join('\n')}
</urlset>
`);
write('robots.txt', `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);
console.log(`SEO pages: ${ALL.length} films, ${themes.length} themes, ${genres.length} genres, ${urls.length} URLs in sitemap.xml (${ALL.filter(x => x.preview).length} with a menu preview)`);
