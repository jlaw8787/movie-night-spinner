#!/usr/bin/env node
/* Builds data/search-index.json for the wider film search (search.js).
   Per film: TMDB genres, menu tone, story words (plot line, tagline, venue, sign, quote and who says it, winks, prop)
   and menu words (dish names from data/films.json and house lines). Words are normalised and trimmed of plurals the same way search.js does,
   so the page only has to compare strings. The term groups come from data/search-terms.json.
   Run after changing any of those files: node scripts/build-search.cjs */
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..'), D = p => JSON.parse(fs.readFileSync(path.join(ROOT, 'data', p), 'utf8'));
const S = require(path.join(ROOT, 'search.js'));

const films = D('films.json'), genres = D('film-genres.json'), fmt = D('film-format.json');
const flav = Object.assign({}, D('kit-flavour.json'), D('film-flavour.json')), house = D('film-house.json');
const terms = D('search-terms.json');
const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'in', 'at', 'on', 'to', 'for', 'with', 'is', 'his', 'her', 'their', 'from', 'by', 'as', 'it', 'its', 'into', 'who', 'that', 'this', 'when', 'after', 'but', 'up', 'out', 'be', 'are', 'was', 'has', 'have', 'one', 'or', 'all', 'they', 'he', 'she', 'them', 'him', 'you', 'your', 'not', 'no', 'so', 'than', 'then', 'there', 'what', 'where', 'while', 'over', 'off', 'just', 'like', 'get', 'gets', 'got', 'can', 'will']);
const words = txt => { const out = new Set(); for (const w of S.norm(txt).split(' ')) { if (!w || STOP.has(w)) continue; out.add(S.stem(w)) } return out };
const flat = v => v == null ? '' : typeof v === 'string' ? v : Array.isArray(v) ? v.map(flat).join(' ') : typeof v === 'object' ? Object.values(v).map(flat).join(' ') : String(v);

const tones = [...new Set(Object.values(fmt).map(x => x.tone).filter(Boolean))].sort();
const genreList = [...new Set(Object.values(genres).flat())].sort();
const out = { v: '', genres: genreList, tones, films: {}, groups: [] };
for (const f of films) {
  const id = `${f.title} (${f.year})`, slug = id.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let film = {}; try { film = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/film', slug + '.json'), 'utf8')) } catch (e) { }
  const fl = flav[id] || {};
  const story = words([film.D || f.D, film.T || f.T, fl.venue, fl.sign, fl.note && fl.note.text, fl.note && fl.note.by, flat(fl.winks), fl.prop && fl.prop.title, fl.prop && flat(fl.prop.lines), fl.sideLine, flat(fl.overheard)].map(flat).join(' '));
  const menu = words([['S', 'M', 'W', 'K'].flatMap(k => (f[k] || []).map(it => it[0])).join(' '), flat(house[id] && [house[id].s && house[id].s.n, house[id].d && house[id].d.n])].join(' '));
  for (const w of story) menu.delete(w);
  const g = (genres[id] || []).map(x => genreList.indexOf(x)), t = fmt[id] && fmt[id].tone ? tones.indexOf(fmt[id].tone) : -1;
  out.films[id] = [g.join(','), t, [...story].join(' '), [...menu].join(' ')];
  if (!film.D && !f.D) console.warn('no plot line:', id);
}
/* term groups: triggers and keywords pre-normalised; genres and tones as indexes */
for (const gr of terms.groups) {
  const o = { id: gr.id, l: gr.label, say: [...new Set(gr.say.map(S.key))] };
  if (gr.g) o.g = gr.g.map(x => genreList.indexOf(x)).filter(i => i >= 0);
  if (gr.with) o.with = gr.with.map(x => genreList.indexOf(x)).filter(i => i >= 0);
  if (gr.need) o.need = gr.need.map(x => genreList.indexOf(x)).filter(i => i >= 0);
  if (gr.not) o.not = gr.not.map(x => genreList.indexOf(x)).filter(i => i >= 0);
  if (gr.tone) o.tone = gr.tone.map(x => tones.indexOf(x)).filter(i => i >= 0);
  for (const k of ['th', 'ai', 'yr', 'season']) if (gr[k]) o[k] = gr[k];
  if (gr.text) o.text = [...new Set(gr.text.map(S.key))];
  for (const k of ['g', 'with', 'need', 'not', 'tone']) if (gr[k] && o[k].length !== gr[k].length) throw new Error(`${gr.id}: unknown ${k} in ${gr[k]}`);
  out.groups.push(o);
}
const body = JSON.stringify(out);
out.v = require('crypto').createHash('sha1').update(body).digest('hex').slice(0, 8);
fs.writeFileSync(path.join(ROOT, 'data/search-index.json'), JSON.stringify(out));
console.log(`search-index.json: ${films.length} films, ${out.groups.length} groups, ${(fs.statSync(path.join(ROOT, 'data/search-index.json')).size / 1024).toFixed(0)} KB, v ${out.v}`);
