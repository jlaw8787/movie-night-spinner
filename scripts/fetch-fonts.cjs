/* Downloads every web font the site uses into assets/fonts/ so nothing loads from Google Fonts.
     node scripts/fetch-fonts.cjs            fetch anything missing, rewrite assets/fonts/fonts.js and core.css
     node scripts/fetch-fonts.cjs --check    report any font request in the code that has no local copy, change nothing

   Where the list of fonts comes from:
     1. every "family=..." string in index.html, app.js, formats.js and menu-formats/*.js
     2. scripts/font-queries.json, the requests the site actually made when every film was opened
        (scripts/sweep-font-queries.cjs records it; rerun that after adding a menu that builds its font list from data)
     3. CORE below, the eight families the page itself uses

   For each family spec (for example "Oswald:wght@500;700") we ask Google for exactly that spec and keep what it
   sends back, so every menu gets the same files it got before: a single weight is a fixed cut, two or more weights
   come as one variable file, and an opsz request keeps its optical sizes. Latin and Latin Extended only
   (the extended set covers Maori, Czech and Polish names in a few dish lines; the browser fetches it only when needed).
   Chinese and Japanese families (Noto Serif TC, LXGW WenKai TC and the like) come in about a hundred slices from Google.
   Rather than ship all of them we ask Google for just the characters the site prints (every CJK character found in
   data/, the menus and app.js), so rerun this after adding dishes with new characters.

   Output:
     assets/fonts/files/<family>-<hash>.woff2   the font files, named by content so they never go stale
     assets/fonts/fonts.js                      the face list plus rdFontHref(query, display), which menus call
                                                instead of building a Google Fonts address
     assets/fonts/core.css                      @font-face rules for the eight core families, linked from index.html */
const fs = require('fs'), path = require('path'), crypto = require('crypto'), https = require('https'), {execFileSync} = require('child_process');
const root = path.join(__dirname, '..');
const OUT = path.join(root, 'assets/fonts'), FILES = path.join(OUT, 'files');
const CHECK = process.argv.includes('--check');
const CORE = 'family=Bungee&family=Oswald:wght@500;700&family=Limelight&family=Jost:wght@400;500;600&family=Archivo:wght@400;600;800&family=Permanent+Marker&family=Mr+Dafoe&family=Yellowtail';
const KEEP = ['latin-ext', 'latin'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';

/* "Source+Serif+4:ital,opsz,wght@0,8..60,400" -> "Source Serif 4:ital,opsz,wght@0,8..60,400" */
const norm = s => decodeURIComponent(s.replace(/\+/g, ' ')).trim();
const specsOf = q => q.replace(/^.*?css2\?/, '').split('&').filter(p => p.startsWith('family=')).map(p => norm(p.slice(7)));

function collect() {
  const specs = new Set(specsOf(CORE));
  const src = ['index.html', 'app.js', 'formats.js', ...fs.readdirSync(path.join(root, 'menu-formats')).filter(n => n.endsWith('.js')).map(n => 'menu-formats/' + n)];
  for (const f of src) {
    const t = fs.readFileSync(path.join(root, f), 'utf8');
    /* a spec stops at &, a quote, a backtick or a template hole; anything cut short by a template is left to the sweep list */
    for (const m of t.matchAll(/family=([A-Za-z0-9+ ]+(?::[A-Za-z,]+@[0-9.,;]+)?)(?=[&"'`]|$)/g)) specs.add(norm(m[1]));
  }
  const qf = path.join(__dirname, 'font-queries.json');
  if (fs.existsSync(qf)) for (const q of JSON.parse(fs.readFileSync(qf, 'utf8'))) specsOf(q).forEach(s => specs.add(s));
  return [...specs].sort();
}

/* every Chinese or Japanese character the site can print */
function cjkChars() {
  const set = new Set(), walk = d => fs.readdirSync(d, {withFileTypes: true}).forEach(e => {
    const p = path.join(d, e.name);
    if (e.isDirectory()) walk(p); else if (/\.json$/.test(e.name)) scan(p);
  });
  const scan = p => { for (const c of fs.readFileSync(p, 'utf8').matchAll(/[\u2E80-\u9FFF\uF900-\uFAFF\uFF00-\uFFEF]/g)) set.add(c[0]); };
  walk(path.join(root, 'data'));
  for (const d of ['.', 'formats', 'menu-formats']) for (const n of fs.readdirSync(path.join(root, d))) if (n.endsWith('.js')) scan(path.join(root, d, n));
  return [...set].sort().join('');
}
const get = url => new Promise((res, rej) => {
  https.get(url, {headers: {'User-Agent': UA}}, r => {
    if (r.statusCode !== 200) { r.resume(); return rej(new Error(r.statusCode + ' ' + url)); }
    const b = []; r.on('data', d => b.push(d)); r.on('end', () => res(Buffer.concat(b)));
  }).on('error', rej);
});
/* node's https ignores the agent proxy, so fall back to curl, which honours HTTPS_PROXY */
const fetchBuf = async url => {
  if (process.env.HTTPS_PROXY) return execFileSync('curl', ['-sSfL', '--retry', '3', '-A', UA, url], {maxBuffer: 64 << 20});
  return get(url);
};

function parseCss(css) {
  const faces = [];
  for (const m of css.matchAll(/(?:\/\*\s*([\w\[\]-]+)\s*\*\/\s*)?@font-face\s*\{([^}]*)\}/g)) {
    const sub = m[1] || '', body = m[2], d = k => { const x = body.match(new RegExp(k + ':\\s*([^;]+);')); return x ? x[1].trim() : null; };
    faces.push({sub, family: d('font-family').replace(/^'|'$/g, ''), style: d('font-style') || 'normal', weight: d('font-weight') || '400',
      stretch: d('font-stretch'), url: (body.match(/url\(([^)]+)\)/) || [])[1], range: d('unicode-range')});
  }
  return faces;
}
/* docs/font-credits.md plus the licence texts beside the fonts: each family's copyright line comes from the
   licence file Google ships with it (OFL.txt, LICENSE.txt or UFL.txt) */
async function credits(families) {
  const rows = [], texts = {};
  for (const fam of families) {
    let lic = 'unknown', note = '';
    try {
      /* a few families were later merged under a shorter name (Big Shoulders Display is now Big Shoulders), so try that too */
      let j = null;
      for (const name of [fam, fam.replace(/ \S+$/, ''), fam.replace(/ \S+ \S+$/, '')]) {
        try { j = JSON.parse((await fetchBuf('https://fonts.google.com/download/list?family=' + encodeURIComponent(name))).toString().replace(/^\)\]\}'\s*/, '')); } catch (e) { j = null; }
        if (j && j.manifest) break;
      }
      const f = j.manifest.files.find(x => /^(OFL|LICENSE|UFL)\.txt$/.test(x.filename));
      if (f) {
        lic = {OFL: 'SIL Open Font License 1.1', LICENSE: 'Apache License 2.0', UFL: 'Ubuntu Font Licence 1.0'}[f.filename.split('.')[0]];
        const t = f.contents.replace(/\r/g, '');
        if (f.filename === 'OFL.txt') {
          note = t.split(/\n\s*This Font Software is licensed/)[0].split('\n').map(x => x.trim()).filter(Boolean).join(' ');
          texts['OFL.txt'] = texts['OFL.txt'] || t.slice(t.indexOf('-----------------------------------------------------------'));
        } else texts[f.filename === 'UFL.txt' ? 'UFL.txt' : 'LICENSE-Apache-2.0.txt'] = t;
      }
    } catch (e) { console.error('no licence info for', fam, e.message.slice(0, 80)); }
    rows.push(`| ${fam} | ${lic} | ${note.replace(/\|/g, '/').replace(/[\u2013\u2014]/g, '-')} |`);
  }
  for (const [n, t] of Object.entries(texts)) fs.writeFileSync(path.join(OUT, n), t);
  fs.writeFileSync(path.join(root, 'docs/font-credits.md'), `# Font credits

Every font on the site and in the app comes from the Google Fonts library and is open licence. We serve our own copies
from assets/fonts/ (fetched by scripts/fetch-fonts.cjs), unchanged apart from Google's Latin and Latin Extended
subsetting. The full licence texts sit beside the files: assets/fonts/${Object.keys(texts).sort().join(', assets/fonts/')}.
Generated by scripts/fetch-fonts.cjs, so rerun that rather than editing this list.

| Family | Licence | Copyright |
| --- | --- | --- |
${rows.join('\n')}
`);
}
/* Chinese, Japanese and Korean families by name. Google's css2 no longer labels their slices in a way we can spot
   (with our user agent it sends only the Latin and Cyrillic faces), so the name decides. "SC" alone means small caps
   (Alegreya SC, Spectral SC), so only the Noto Simplified Chinese families count for SC */
const isCJK = fam => /\b(TC|HK|JP|KR)$/.test(fam) || /^Noto (Sans|Serif) SC$/.test(fam) || /WenKai/.test(fam);
const famOf = spec => spec.split(':')[0].replace(/\+/g, ' ');
const slug = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

(async () => {
  const specs = collect();
  const cjk = cjkChars();
  const known = fs.existsSync(path.join(OUT, 'fonts.js')) ? fs.readFileSync(path.join(OUT, 'fonts.js'), 'utf8') : '';
  if (CHECK) {
    const miss = specs.filter(s => !known.includes(JSON.stringify(s) + ':'));
    console.log(miss.length ? 'no local copy for:\n  ' + miss.join('\n  ') : `all ${specs.length} font specs have local files`);
    /* a CJK family with only Latin faces prints its Chinese in a system font, so that is a miss too */
    let noCjk = [];
    if (known) { const w = {}; new Function('window', 'document', known)(w, {baseURI: 'http://x/'}); const D = w.RD_FONTS;
      noCjk = specs.filter(s => isCJK(famOf(s)) && D.specs[s] && !D.specs[s].some(r => r[5] >= 0 && !/^U\+0000-00FF|^U\+0100-/.test(D.ranges[r[5]]))); }
    if (noCjk.length) console.log('CJK family with no Chinese or Japanese face:\n  ' + noCjk.join('\n  '));
    process.exit(miss.length || noCjk.length ? 1 : 0);
  }
  fs.mkdirSync(FILES, {recursive: true});
  const ranges = [], rangeIx = r => { if (r == null) return -1; let i = ranges.indexOf(r); if (i < 0) { ranges.push(r); i = ranges.length - 1; } return i; };
  const files = [], fileIx = new Map(), byUrl = new Map();
  const table = {}, skipped = {};
  let n = 0;
  for (const spec of specs) {
    const url = 'https://fonts.googleapis.com/css2?family=' + encodeURIComponent(spec).replace(/%20/g, '+').replace(/%3A/g, ':').replace(/%40/g, '@').replace(/%2C/g, ',').replace(/%3B/g, ';') + '&display=swap';
    let css;
    try { css = (await fetchBuf(url)).toString(); }
    catch (e) {
      /* Google turns down a spec it can't serve (a weight the family doesn't have). The menu never got that face,
         so keep an empty entry: the page then falls back exactly as it always did */
      if (/returned error: 400|^400 /.test(e.message + String(e.stderr || ""))) { console.log('Google has no such font, kept empty:', spec); table[spec] = []; continue; }
      console.error('FAILED', spec, e.message.slice(0, 120)); process.exitCode = 1; continue;
    }
    const faces = parseCss(css);
    const keep = faces.filter(f => KEEP.includes(f.sub) || (!f.sub && !f.range));
    faces.filter(f => !keep.includes(f)).forEach(f => { skipped[f.sub] = (skipped[f.sub] || 0) + 1; });
    /* CJK families: one extra face per weight holding only the characters we print */
    if (cjk && (isCJK(famOf(spec)) || faces.some(f => /^\[\d+\]$/.test(f.sub)))) {
      const t = (await fetchBuf(url.replace('&display=swap', '&text=' + encodeURIComponent(cjk) + '&display=swap'))).toString();
      const range = [...cjk].map(c => 'U+' + c.codePointAt(0).toString(16).toUpperCase()).join(', ');
      for (const f of parseCss(t)) keep.push(Object.assign(f, {sub: 'cjk', range: f.range || range}));
      console.log('CJK subset for', spec);
    }
    if (!keep.length) { console.error('NO LATIN FACES', spec, faces.map(f => f.sub).join(',')); process.exitCode = 1; continue; }
    const rows = [];
    for (const f of keep) {
      if (!byUrl.has(f.url)) {
        const buf = await fetchBuf(f.url);
        const name = slug(f.family) + '-' + crypto.createHash('sha1').update(buf).digest('hex').slice(0, 10) + '.woff2';
        const p = path.join(FILES, name);
        if (!fs.existsSync(p)) fs.writeFileSync(p, buf);
        byUrl.set(f.url, name);
      }
      const name = byUrl.get(f.url);
      if (!fileIx.has(name)) { fileIx.set(name, files.length); files.push(name); }
      /* [family, style, weight, stretch, file index, unicode-range index] */
      rows.push([f.family, f.style, f.weight, f.stretch || 0, fileIx.get(name), rangeIx(f.range)]);
    }
    table[spec] = rows;
    if (++n % 25 === 0) console.log(n + '/' + specs.length);
  }
  /* drop font files nothing points at any more */
  const used = new Set(files);
  for (const f of fs.readdirSync(FILES)) if (!used.has(f)) fs.unlinkSync(path.join(FILES, f));

  const data = '/* Generated by scripts/fetch-fonts.cjs. Do not edit by hand; rerun the script instead. */\n' +
    'window.RD_FONTS={files:' + JSON.stringify(files) + ',\nranges:' + JSON.stringify(ranges) + ',\nspecs:{\n' +
    Object.entries(table).map(([k, v]) => JSON.stringify(k) + ':' + JSON.stringify(v)).join(',\n') + '}};\n';
  fs.writeFileSync(path.join(OUT, 'fonts.js'), data + fs.readFileSync(path.join(__dirname, 'fonts-runtime.js'), 'utf8'));

  /* core.css: the same rules the runtime would build for CORE, with paths relative to the css file */
  const rules = [];
  for (const spec of specsOf(CORE)) for (const [fam, st, w, sx, fi, ri] of table[spec] || [])
    rules.push(`@font-face{font-family:'${fam}';font-style:${st};font-weight:${w};${sx ? 'font-stretch:' + sx + ';' : ''}font-display:swap;src:url(files/${files[fi]}) format('woff2');${ri >= 0 ? 'unicode-range:' + ranges[ri] + ';' : ''}}`);
  fs.writeFileSync(path.join(OUT, 'core.css'), '/* Generated by scripts/fetch-fonts.cjs. The eight families the page itself uses. */\n' + rules.join('\n') + '\n');

  await credits([...new Set(Object.values(table).flat().map(r => r[0]))].sort());

  /* the list of font files for the offline worker, which drops saved fonts that are no longer in it */
  fs.writeFileSync(path.join(OUT, 'files.json'), JSON.stringify(files));
  const size = files.reduce((a, f) => a + fs.statSync(path.join(FILES, f)).size, 0);
  const fams = new Set(Object.values(table).flat().map(r => r[0]));
  console.log(`${specs.length} specs, ${fams.size} families, ${files.length} files, ${(size / 1048576).toFixed(1)} MB; skipped subsets`, skipped);
})().catch(e => { console.error(e); process.exit(1); });
