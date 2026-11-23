/* Review 38: every dish on a film page is a dish its card prints. Reads the built pages (menu/<slug>/index.html) against the card's
   own sources: the shared-layout menu in data/films.json, the poster edition in movie-menus.js, the hand-built spec and face in formats.js,
   and the alcohol-free version a kids, Christmas or wizard card prints in place of the drink. Exits 1 on a page dish the card never shows,
   or an alcoholic drink on a dry film's page.
     node scripts/check-pages.cjs ["Film (Year)" ...] */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
const rd=p=>fs.readFileSync(path.join(R,p),'utf8'),rj=p=>JSON.parse(rd(p));
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');/* review 44: page addresses fold accents */
const N=s=>String(s||'').toLowerCase().replace(/&amp;/g,'&').replace(/&#39;|&quot;|[’'"“”]/g,"'").replace(/[^a-z0-9à-ÿ']+/g,' ').trim();
const films=rj('data/films.json'),NAMED=process.argv.slice(2);
const E=(()=>{const s=rd('movie-menus.js'),pre='const MOVIE_MENU_EDITIONS = ';return JSON.parse(s.slice(s.indexOf(pre)+pre.length).replace(/;\s*$/,''))})();
const FMT=rd('formats.js');
const DRY=(()=>{const m=rd('app.js').match(/const DRY_THEMES=(\[[^\]]*\]);/);return m?JSON.parse(m[1]):[]})();const DRYF=(()=>{const m=rd('app.js').match(/const DRY_FILMS=(\[[^\]]*\]);/);return m?JSON.parse(m[1]):[]})();const isDry=f=>DRY.includes(f.theme)||DRYF.includes(f.title+' ('+f.year+')');
const BOOZE=/\b(wine|bordeaux|champagne|bourbon|whisk(e)?y|rum|vodka|gin|tequila|brandy|ale|beer|lager|stout|cider|sherry|highball|martini|margarita|mead|liqueur|schnapps|prosecco)\b/i;
const block=id=>{const i=FMT.indexOf(JSON.stringify(id)+':{');if(i<0)return '';const j=FMT.indexOf('\n  "',i+5);return FMT.slice(i,j<0?i+20000:j)};
let bad=[];const HB0=(()=>{try{return rj('data/card-print-hb.json')}catch(e){return {}}})(),CP0=(()=>{try{return rj('data/card-print.json')}catch(e){return {}}})(),HO0=(()=>{try{return rj('data/film-house.json')}catch(e){return {}}})();
for(const f of films){const id=f.title+' ('+f.year+')';if(NAMED.length&&!NAMED.includes(id))continue;const s=slug(id),p=path.join(R,'menu',s,'index.html');if(!fs.existsSync(p))continue;
  const page=fs.readFileSync(p,'utf8'),names=[...page.matchAll(/<h3>([^<]+)/g)].map(m=>m[1].trim());
  const src=[];for(const k of 'SMWK')for(const r of f[k]||[])src.push(r[0]);
  if(E[id]&&E[id].menu)for(const c of 'smwd')for(const it of E[id].menu[c]||[])src.push(it.n);
  try{const r2=rj('data/recipes2/'+s+'.json');for(const d of r2.dishes||[]){src.push(d.n);for(const a of Object.values(d.alt||{}))src.push(a.n)}}catch(e){}
  /* review 39: the page shows the card's house lines too; the printed list (data/card-print.json) and the house lines count as on the card */
  for(const r of (CP0[id]||[]))src.push(r[1]);for(const r of (HB0[id]||[]))if(r.printed)src.push(r.n);{const h=HO0[id]||{};for(const c of ['s','d'])if(h[c]&&h[c].n)src.push(h[c].n)}
  const hay=N(src.join(' | '))+' | '+N(block(id));const dry=isDry(f);
  for(const n of names){if(!hay.includes(N(n)))bad.push(`${id}: page lists "${n}", not on the card`);
    else if(dry&&BOOZE.test(n.replace(/ginger beer|root beer|spiced cider|apple cider|butterbeer/ig,''))&&!/\b(free|juice|zero|soda|cordial|pie|braised|bites|figs|cake|sauce|gravy|stew|glazed|battered)\b/i.test(n))bad.push(`${id}: dry card, page lists "${n}"`)}}
/* review 39: a shared-layout page prints every dish the card prints (house lines too) with the card's own note, and a dry page names no alcohol */
const CP=(()=>{try{return rj('data/card-print.json')}catch(e){return {}}})(),FF=rj('data/film-format.json');
const NOTEBOOZE=/\b(wine|bordeaux|champagne|bourbon|whisk(e)?y|rum|vodka|gin|tequila|brandy|lager|stout|cider|sherry|liqueur|schnapps|prosecco|sake|vermouth|beer|ale)\b/i;
const DE=t=>String(t).replace(/&amp;/g,'&').replace(/&#39;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
for(const f of films){const id=f.title+' ('+f.year+')';if(NAMED.length&&!NAMED.includes(id))continue;const s=slug(id),p=path.join(R,'menu',s,'index.html');if(!fs.existsSync(p))continue;
  const lib=!!(FF[id]&&FF[id].format)&&!block(id);const page=fs.readFileSync(p,'utf8');
  const arts=[...page.matchAll(/<h3>([^<]+)(?:<span[^>]*>[^<]*<\/span>)*<\/h3>\s*(?:<p>([^<]*)<\/p>)?/g)].map(m=>[N(DE(m[1])),DE(m[2]||'')]);
  if(lib){const cp=CP[id];if(!cp)bad.push(`${id}: no printed list in data/card-print.json (node scripts/render-previews.cjs "${id}")`);
    else for(const r of cp){const a=arts.find(x=>x[0]===N(r[1]));if(!a)bad.push(`${id}: card prints "${r[1]}", page leaves it out`);else if(N(a[1])!==N(r[2]))bad.push(`${id}: page note for "${r[1]}" differs from the card`)}}
  /* review 41: a shared-layout page lists only what the card prints (Turner & Hooch's page had a second main the card has no room for) */
  if(lib&&CP[id])for(const a of arts)if(!CP[id].some(r=>N(r[1])===a[0]))bad.push(`${id}: page lists "${a[0]}", the card does not print it`);
  /* review 41: a dry page names no alcohol anywhere, recipe lines and method too (Violent Night's alcohol-free stout, Miracle on 34th Street's red wine) */
  if(isDry(f)){const body=DE((page.match(/<main[\s\S]*<\/main>/)||[''])[0].replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ')).replace(/ginger beer|root beer|ginger ale|butterbeer|wine vinegar|rice wine vinegar|sherry vinegar|cider vinegar|malt vinegar|wine glass(es)?|rum essence|sake lees|beer garden|Big Whiskey/ig,'');
    const m=body.match(/[^.]{0,40}\b(wine|bordeaux|champagne|bourbon|whisk(e)?y|rum|vodka|gin|tequila|brandy|lager|stout|cider|sherry|liqueur|schnapps|prosecco|vermouth|beer|ale)\b[^.]{0,30}/i);if(m)bad.push(`${id}: dry page names alcohol: "${m[0].trim()}"`)}
  if(isDry(f))for(const a of arts){const t=a[1].replace(/ginger beer|root beer|ginger ale|butterbeer|apple cider|wine vinegar|rum essence|sherry vinegar|sake lees/ig,'');if(NOTEBOOZE.test(t)&&!/\b(alcohol-free|non-alcoholic|zero)\b/i.test(t))bad.push(`${id}: dry page note names alcohol: "${a[1].slice(0,80)}"`)}}
/* review 40: a hand-built page is the card: only dishes the card prints (data/card-print-hb.json, saved by render-previews), each with
   the card's words and the phone menu's shopping lines */
{const HB=(()=>{try{return rj('data/card-print-hb.json')}catch(e){return {}}})();
 for(const f of films){const id=f.title+' ('+f.year+')';if(NAMED.length&&!NAMED.includes(id))continue;if(!block(id))continue;const s=slug(id),p=path.join(R,'menu',s,'index.html');if(!fs.existsSync(p))continue;
  const hb=HB[id];if(!hb){bad.push(`${id}: no hand-built print list in data/card-print-hb.json (node scripts/render-previews.cjs "${id}")`);continue}
  const page=fs.readFileSync(p,'utf8'),arts=[...page.matchAll(/<article class="dish"[^>]*><h3>([^<]+)(?:<span[^>]*>[^<]*<\/span>)*<\/h3>\s*(?:<p>([^<]*)<\/p>)?([\s\S]*?)<\/article>/g)].map(m=>({n:N(DE(m[1])),note:DE(m[2]||''),ing:[...(m[3].match(/<ul>([\s\S]*?)<\/ul>/)||['',''])[1].matchAll(/<li>([^<]*)<\/li>/g)].map(x=>N(DE(x[1]).replace(/°/g,'')))}));
  const want=hb.filter(r=>r.printed);
  for(const a of arts)if(!want.some(r=>N(r.n)===a.n))bad.push(`${id}: page lists "${a.n}", the card does not print it`);
  for(const r of want){const a=arts.find(x=>x.n===N(r.n));if(!a){bad.push(`${id}: card prints "${r.n}", page leaves it out`);continue}
   if(N(a.note)!==N(r.note))bad.push(`${id}: page note for "${r.n}" differs from the card`);
   if((r.ing||[]).length&&a.ing.map(x=>x.replace(/°/g,'')).join('|')!==(r.ing||[]).map(x=>N(String(x).replace(/°/g,''))).join('|'))bad.push(`${id}: page recipe for "${r.n}" differs from the phone menu`)}}}
console.log(bad.join('\n'));console.log(`check-pages: ${bad.length} page dishes not on their card`);process.exit(bad.length?1:0);
