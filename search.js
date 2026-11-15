/* Reel Dinner wider film search. Finds films by what people mean, not only the title:
   term groups (data/search-terms.json: mafia also finds mob, gangster, crime family), genres, themes, aisles, eras,
   moods, holiday shelves, and words from each film's story, venue, quote, winks and dish names.
   Ranking: the title first (exact, starts with, word hits), then a strong group match (genre, theme, aisle, era, mood,
   holiday shelf), then keyword hits (story, then menu). Plurals and small typos still match ("gangsters", "mafai").
   Everything runs in the page from one file (data/search-index.json, saved for offline), no server calls.
   Used by app.js; also loads in node for scripts/build-search.cjs and tests/search.test.cjs. */
(function (root) {
  const norm = x => String(x == null ? '' : x).toLocaleLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’‘`]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
  /* plurals: gangsters, mobsters, zombies, witches, heroes */
  const stem = w => w.length > 4 && w.endsWith('ies') ? w.slice(0, -3) + 'y' : w.length > 4 && /(ch|sh|x|ss|zz|o)es$/.test(w) ? w.slice(0, -2) : w.length > 3 && w.endsWith('s') && !/(ss|us|is)$/.test(w) ? w.slice(0, -1) : w;
  const key = x => norm(x).split(' ').filter(Boolean).map(stem).join(' ');
  const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'in', 'at', 'on', 'to', 'for', 'with', 'movie', 'movies', 'film', 'films', 'flick', 'type', 'kind', 'some', 'something', 'show', 'me', 'any', 'good', 'best', 'like', 'about', 'set']);
  /* edit distance with swapped letters counting as one ("mafai" is one away from "mafia") */
  function dist(a, b, max) {
    if (Math.abs(a.length - b.length) > max) return max + 1;
    const m = a.length, n = b.length, d = [];
    for (let i = 0; i <= m; i++) { d[i] = [i]; }
    for (let j = 0; j <= n; j++) d[0][j] = j;
    for (let i = 1; i <= m; i++) {
      let best = 1e9;
      for (let j = 1; j <= n; j++) {
        const c = a[i - 1] === b[j - 1] ? 0 : 1;
        let v = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + c);
        if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) v = Math.min(v, d[i - 2][j - 2] + 1);
        d[i][j] = v; if (v < best) best = v;
      }
      if (best > max) return max + 1;
    }
    return d[m][n];
  }
  const slack = w => w.length >= 8 ? 2 : w.length >= 4 ? 1 : 0;

  let IX = null;
  /* index ready: per film sets, trigger map, vocabulary */
  function use(raw) {
    const films = {}, vocab = new Map(), trig = new Map(), groups = raw.groups.map(g => Object.assign({}, g));
    for (const [id, [g, t, s, m]] of Object.entries(raw.films)) {
      const story = new Set(s ? s.split(' ') : []), menu = new Set(m ? m.split(' ') : []);
      films[id] = { g: g ? g.split(',').map(Number) : [], t, story, menu };
      for (const w of story) vocab.set(w, (vocab.get(w) || 0) + 1);
      for (const w of menu) vocab.set(w, (vocab.get(w) || 0) + 1);
    }
    for (const g of groups) {
      g.keys = g.say.map(key); g.textKeys = (g.text || []).map(key).map(k => k.split(' '));
      g.keys.forEach((k, i) => { if (!trig.has(k)) trig.set(k, []); const a = trig.get(k); if (!a.some(x => x.g === g)) a.push({ g, say: g.say[i] }) });
    }
    IX = { v: raw.v, films, vocab, trig, groups, genres: raw.genres, tones: raw.tones, seasonSets: {} };
    return IX;
  }
  function load(url) {
    if (IX) return Promise.resolve(IX);
    if (!load.p) load.p = fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.json() }).then(use).catch(e => { load.p = null; throw e });
    return load.p;
  }

  /* split a query into units: a term group (longest phrase first) or a plain word */
  function parse(q, ctx) {
    const toks = norm(q).split(' ').filter(Boolean), stems = toks.map(stem), units = [];
    for (let i = 0; i < toks.length;) {
      let hit = null;
      for (let n = Math.min(5, toks.length - i); n >= 1 && !hit; n--) {
        const p = stems.slice(i, i + n).join(' ');
        if (IX.trig.has(p)) hit = { n, groups: IX.trig.get(p).map(x => x.g), word: toks.slice(i, i + n).join(' '), exact: true };
      }
      const w = toks[i], s = stems[i];
      if (!hit && STOP.has(w)) { i++; continue }
      /* a typo of a trigger, only when the word means nothing else (not in any story, menu or title) */
      if (!hit && slack(s) && !IX.vocab.has(s) && !(ctx && ctx.titleWord && ctx.titleWord(s))) {
        let best = null, bd = 9;
        for (const [k, arr] of IX.trig) { if (k.includes(' ')) continue; const d = Math.min(dist(s, k, slack(s)), dist(s, k + 's', slack(s))); if (d <= slack(s) && d < bd) { bd = d; best = { n: 1, groups: arr.map(x => x.g), word: w, fixed: arr[0].say } } }
        hit = best;
      }
      if (hit) { units.push(Object.assign({ kind: 'group' }, hit)); i += hit.n; continue }
      /* a plain word: exact, then as-you-type prefix, then a near spelling from the vocabulary */
      const forms = new Set([s]);
      if (!IX.vocab.has(s)) {
        if (s.length >= 4) for (const v of IX.vocab.keys()) if (v.startsWith(s)) forms.add(v);
        if (forms.size === 1 && slack(s)) for (const v of IX.vocab.keys()) if (dist(s, v, slack(s)) <= slack(s)) forms.add(v);
      }
      units.push({ kind: 'word', word: w, s, forms: [...forms] });
      i++;
    }
    return units;
  }
  function seasonSet(id, ctx) {
    if (!IX.seasonSets[id]) IX.seasonSets[id] = ctx && ctx.season ? ctx.season(id) : new Set();
    return IX.seasonSets[id];
  }
  const allIn = (words, set) => words.every(w => set.has(w));
  const wholeIn = (q, t) => (' ' + t + ' ').includes(' ' + q + ' ');
  /* how well one film meets one unit: 3 title word, 4 strong group match, 5 story keyword, 5.2 menu keyword */
  function unitTier(u, f, d, ctx) {
    const tw = u.kind === 'word' ? !!(ctx && ctx.titleHas && ctx.titleHas(f, u.word)) : wholeIn(key(u.word), key(f.title));
    if (u.kind === 'word') {
      if (tw) return [3, 0, ''];
      for (const w of u.forms) if (d.story.has(w)) return [5, 0, 'story'];
      for (const w of u.forms) if (d.menu.has(w)) return [5.2, 0, 'menu'];
      return null;
    }
    let best = null;
    for (const g of u.groups) {
      if (g.not && g.not.some(i => d.g.includes(i))) { if (tw) best = best || [3, 0, '']; continue }
      let strong = 0;
      if (g.g && g.g.some(i => d.g.includes(i))) strong++;
      if (g.th && ctx && g.th.includes(ctx.theme(f))) strong++;
      if (g.ai && ctx && g.ai.includes(ctx.aisle(f))) strong++;
      if (g.yr && +f.year >= g.yr[0] && +f.year <= g.yr[1]) strong += 2;
      if (g.tone && g.tone.includes(d.t)) strong++;
      if (g.season && g.season.some(s => seasonSet(s, ctx).has(f.id))) strong++;
      if (g.need && !g.need.some(i => d.g.includes(i))) strong = 0;
      let text = 0; for (const k of g.textKeys) if (allIn(k, d.story)) text++;
      /* a story hit in the right genre counts as strong (a heist in a crime film, aliens in a sci-fi film) */
      if (text && !strong && g.with && g.with.some(i => d.g.includes(i))) strong = 1;
      const r = tw ? [3, strong + text, g.l] : strong ? [4, strong * 3 + text, g.l] : text ? [5, text, g.l] : null;
      if (r && (!best || r[0] < best[0] || (r[0] === best[0] && r[1] > best[1]))) best = r;
    }
    return best;
  }
  /* rank films for a query. ctx: titleScore(q,f) (the old title search, -1 for no match), titleHas(f,word),
     titleWord(word), theme(f), aisle(f), season(id) -> Set of film ids */
  function search(q, list, ctx) {
    const out = [];
    if (!norm(q)) return out;
    const units = IX ? parse(q, ctx) : [], kq = key(q), exactGroup = units.some(u => u.kind === 'group' && u.exact), orig = {};
    for (const t of String(q).split(/\s+/)) { const n = norm(t); if (n && !orig[n]) orig[n] = t.replace(/^[^\w]+|[^\w]+$/g, '') }
    for (const f of list) {
      let ts = ctx.titleScore(q, f);
      /* plurals: "aliens" still finds Alien first */
      if (ts < 0 || ts >= 2) { const t2 = ctx.titleScore(kq, f); if (t2 >= 0 && t2 < 2) ts = t2 + 0.5 }
      /* a near-miss title ("Annie Hall" for halloween) goes below the films that really match the meaning */
      if (ts >= 2 && units.some(u => u.kind === 'group')) ts = 4.5;
      /* a known word only part of a title word ("mum" in The Mummy, "space" in Spaceballs) also goes below the real matches */
      else if (ts >= 0 && ts < 4 && exactGroup && !wholeIn(kq, key(f.title))) ts = 4.5;
      if (ts >= 0 && ts < 4) { out.push({ f, tier: ts, rank: 0, why: '' }); continue }
      const d = IX && units.length && IX.films[f.id];
      if (!d) { if (ts >= 0) out.push({ f, tier: ts, rank: 0, why: '' }); continue }
      let tier = 0, rank = 0, why = [], ok = true;
      for (const u of units) { const r = unitTier(u, f, d, ctx); if (!r) { ok = false; break } tier = Math.max(tier, r[0]); rank += r[1]; if (r[2] && r[0] > 3) why.push(r[2] === 'story' || r[2] === 'menu' ? (r[2] === 'menu' ? 'On the menu: ' : 'In the film: ') + (orig[u.word] || u.word) : r[2]) }
      if (ok && !(ts >= 0 && ts < tier)) out.push({ f, tier, rank, why: [...new Set(why)].join(', ') });
      else if (ts >= 0) out.push({ f, tier: ts, rank: 0, why: '' });
    }
    out.sort((a, b) => a.tier - b.tier || b.rank - a.rank || (a.tier < 4 ? (+a.f.year) - (+b.f.year) : 0) || a.f.title.replace(/^(The|A) /, '').localeCompare(b.f.title.replace(/^(The|A) /, '')));
    return out;
  }
  /* nothing found: the closest words people could try instead (term words, title words, story words that have films) */
  function suggest(q, ctx, max) {
    if (!IX) return [];
    const seen = new Set(), cand = [];
    for (const w of norm(q).split(' ').filter(x => x && !STOP.has(x))) {
      const s = stem(w), lim = Math.max(2, slack(s));
      for (const [k, arr] of IX.trig) { if (k.includes(' ')) continue; const d = dist(s, k, lim); if (d <= lim) cand.push([d, 0, arr[0].say]) }
      for (const t of (ctx && ctx.titleWords ? ctx.titleWords() : [])) { if (t.length < 4) continue; const d = dist(s, t, lim); if (d <= lim) cand.push([d + 0.3, 0, t]) }
      for (const [v, n] of IX.vocab) { if (v.length < 4) continue; const d = dist(s, v, lim); if (d <= lim) cand.push([d + 0.5, -n, v]) }
    }
    cand.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const out = [];
    for (const [, , w] of cand) { const k = key(w); if (seen.has(k) || k === key(q)) continue; seen.add(k); out.push(w); if (out.length >= (max || 5)) break }
    if (out.length < (max || 5)) for (const g of ['date night', 'family night', 'christmas', 'scary', 'funny', 'gangster', '80s']) { if (out.length >= (max || 5)) break; if (!seen.has(key(g))) { seen.add(key(g)); out.push(g) } }
    return out;
  }
  const api = { norm, stem, key, dist, use, load, parse, search, suggest, ready: () => !!IX, get index() { return IX } };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.RDSearch = api;
})(typeof window !== 'undefined' ? window : globalThis);
