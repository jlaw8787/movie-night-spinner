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
const COURSE_CAT = { s: 'Appetizer', m: 'Main course', w: 'Dessert', d: 'Drink' };
const KEYS = { s: 'S', m: 'M', w: 'W', d: 'K' };
const frac = q => { if (q == null || q === '') return ''; const w = Math.floor(q), f = Math.round((q - w) * 100) / 100, F = { 0.25: '1/4', 0.33: '1/3', 0.5: '1/2', 0.67: '2/3', 0.75: '3/4' }[f]; return F ? (w ? w + ' ' : '') + F : String(+q.toFixed(2)); };
const ing = i => { const q = frac(i.q), u = i.u || ''; const tight = /^(g|kg|ml|l)$/.test(u); return clean([q && (tight ? q + u : q + (u ? ' ' + u : '')), i.item].filter(Boolean).join(' ')); };
const cap = t => { t = clean(t); return t.charAt(0).toUpperCase() + t.slice(1); };
/* width and height of a jpeg, read from its frame header */
const jpgSize = f => { const b = fs.readFileSync(f); let i = 2; while (i < b.length) { const m = b[i + 1], L = b.readUInt16BE(i + 2); if (m >= 0xc0 && m <= 0xcf && m !== 0xc4 && m !== 0xc8 && m !== 0xcc) return { h: b.readUInt16BE(i + 5), w: b.readUInt16BE(i + 7) }; i += 2 + L; } return { w: 600, h: 849 }; };
const iso = m => 'PT' + Math.max(0, Math.round(m || 0)) + 'M';

/* every film's page facts, built once */
const ALL = films.map((f, i) => {
  const id = f.title + ' (' + f.year + ')', s = slug(id), d = rj('data/film/' + s + '.json');
  const shown = f.title.replace(/ - /g, ', ');
  const fl = ((d.kit || d.lib || {}).flavour) || {};
  const notes = {};
  for (const k of 'SMWK') for (const r of (d[k] || f[k] || [])) notes[String(r[0]).toLowerCase()] = r[1];
  const dishes = ((d.r2 && d.r2.dishes) || []).map(x => ({ ...x, note: notes[String(x.n).toLowerCase()] || '' }));
  if (!dishes.length) for (const c of 'smwd') for (const r of (d[KEYS[c]] || f[KEYS[c]] || [])) dishes.push({ n: r[0], course: c, note: r[1], how: r[2], ingredients: [], steps: [] });
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

function filmPage(x) {
  const { f, d, s, shown, id } = x, canon = `${SITE}/menu/${s}/`, open = '/?film=' + encodeURIComponent(id);
  const names = x.dishes.map(y => clean(y.n));
  const title = `${shown} (${f.year}) movie night dinner menu | Reel Dinner`;
  const listed = names.length > 3 ? names.slice(0, 3).join(', ') + ' and more' : names.join(', ').replace(/, ([^,]*)$/, ' and $1');
  const desc = cut(`A ${shown} (${f.year}) movie night menu${x.venue ? ' from ' + x.venue : ''}: ${listed}. Recipes for 4, a shopping list and a printable menu.`, 160);
  const img = x.preview ? `${SITE}/assets/menu-previews/${s}.jpg` : (x.poster ? posterUrl(x.poster, 'w500') : '');
  const lede = [d.D, d.T].filter(Boolean).map(esc);
  const courses = [...'smwd'].map(c => {
    const ds = x.dishes.filter(y => y.course === c); if (!ds.length) return '';
    return `<h2>${COURSE[c]}</h2>\n` + ds.map(y => {
      const t = (y.prep_min || 0) + (y.cook_min || 0);
      const meta = [t ? `Prep ${y.prep_min || 0} min, cook ${y.cook_min || 0} min` : '', y.make_ahead ? 'Make ahead: ' + esc(y.make_ahead) : ''].filter(Boolean).join(' · ');
      const ingr = (y.ingredients || []).map(i => `<li>${esc(ing(i))}</li>`).join('');
      const steps = (y.steps || []).map(st => `<li>${esc(st.text)}</li>`).join('') || (y.how ? `<li>${esc(y.how)}</li>` : '');
      return `<article class="dish"><h3>${esc(y.n)}${y.veg ? '<span class="tag">Vegetarian</span>' : ''}${c === 'd' && y.af ? '<span class="tag">No alcohol</span>' : ''}</h3>
${y.note ? `<p>${esc(cap(y.note))}</p>` : ''}${meta ? `<div class="meta">${meta}</div>` : ''}
${ingr || steps ? `<details><summary>Recipe for 4</summary>${ingr ? `<ul>${ingr}</ul>` : ''}${steps ? `<ol>${steps}</ol>` : ''}</details>` : ''}</article>`;
    }).join('\n');
  }).join('\n');
  const theme = BY_THEME[x.theme] || [], at = theme.indexOf(x);
  const near = theme.filter(y => y !== x).sort((a, b) => Math.abs(theme.indexOf(a) - at) - Math.abs(theme.indexOf(b) - at)).slice(0, 8);
  const body = `<p class="crumbs"><a href="/menu/">Film menus</a> › <a href="/menu/theme/${x.theme}/">${esc(themeName(x.theme))}</a></p>
<div class="hero">
${x.poster ? `<img src="${posterUrl(x.poster)}" width="342" height="513" alt="${esc(shown)} (${f.year}) poster" fetchpriority="high">` : '<span></span>'}
<h1>${esc(shown)} (${f.year}) movie night dinner menu</h1>
<div class="hi">
${lede.length ? `<p class="lead">${lede.join(' ')}</p>` : ''}
${x.venue ? `<p>The menu comes from <strong>${esc(x.venue)}</strong>, straight out of the film.</p>` : ''}
<a class="btn" href="${open}">Open this menu in Reel Dinner</a>
<p class="small">Print the menu, get the shopping list and plan the night, free.</p>
</div>
</div>
${x.preview ? `<h2>The printed menu</h2>
<figure class="preview"><img src="/assets/menu-previews/${s}.jpg" width="${x.preview.w}" height="${x.preview.h}" alt="Printed movie night menu for ${esc(shown)} (${f.year})" loading="lazy"><figcaption>Open it in Reel Dinner to print it full size.</figcaption></figure>` : ''}
${courses}
${d.P ? `<h2>When to serve</h2>\n<p>${esc(d.P)}</p>` : ''}
<p><a class="btn" href="${open}">Cook the ${esc(shown)} menu</a></p>
${near.length ? `<h2>More ${esc(themeName(x.theme))} menus</h2>\n<ul class="cards">${near.map(card).join('')}</ul>` : ''}
${x.genres.length ? `<p class="small">Genres: ${x.genres.map(g => `<a href="/menu/genre/${slug(g)}/">${esc(g)}</a>`).join(', ')}</p>` : ''}`;
  const recipe = y => ({
    '@type': 'Recipe', name: clean(y.n), description: cap(y.note || `${COURSE[y.course]} for a ${shown} movie night`),
    image: img ? [img] : undefined, author: { '@type': 'Organization', name: 'Reel Dinner', url: SITE + '/' },
    recipeCategory: COURSE_CAT[y.course] || 'Main course', recipeYield: '4 servings',
    keywords: clean(`${shown}, movie night, ${f.year}, film menu`),
    prepTime: y.prep_min != null ? iso(y.prep_min) : undefined, cookTime: y.cook_min != null ? iso(y.cook_min) : undefined,
    totalTime: y.prep_min != null ? iso((y.prep_min || 0) + (y.cook_min || 0)) : undefined,
    suitableForDiet: y.veg ? 'https://schema.org/VegetarianDiet' : undefined,
    recipeIngredient: (y.ingredients || []).map(ing),
    recipeInstructions: (y.steps || []).length ? y.steps.map(st => ({ '@type': 'HowToStep', text: clean(st.text) })) : (y.how ? [{ '@type': 'HowToStep', text: clean(y.how) }] : undefined)
  });
  const ld = { '@context': 'https://schema.org', '@graph': [
    { '@type': 'WebPage', '@id': canon, url: canon, name: title, description: desc, inLanguage: 'en-AU', isPartOf: { '@type': 'WebSite', name: 'Reel Dinner', url: SITE + '/' },
      about: { '@type': 'Movie', name: shown, dateCreated: String(f.year), image: x.poster ? posterUrl(x.poster, 'w500') : undefined },
      breadcrumb: { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Film menus', item: SITE + '/menu/' },
        { '@type': 'ListItem', position: 2, name: themeName(x.theme), item: `${SITE}/menu/theme/${x.theme}/` },
        { '@type': 'ListItem', position: 3, name: shown + ' (' + f.year + ')', item: canon }] } },
    { '@type': 'ItemList', name: `${shown} (${f.year}) movie night menu`, numberOfItems: x.dishes.length,
      itemListElement: x.dishes.map((y, n) => ({ '@type': 'ListItem', position: n + 1, item: recipe(y) })) }] };
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
  write(`menu/theme/${t}/index.html`, listPage(`menu/theme/${t}/`, `${themeName(t)} movie night menus`, `${BY_THEME[t].length} films with a ${themeName(t)} dinner menu. Pick one to see the dishes and recipes, then open it in Reel Dinner to print the menu.`, BY_THEME[t], esc(themeName(t))));
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
