/* Review 38: every dish on a film page is a dish its card prints. Reads the built pages (menu/<slug>/index.html) against the card's
   own sources: the shared-layout menu in data/films.json, the poster edition in movie-menus.js, the hand-built spec and face in formats.js,
   and the alcohol-free version a kids, Christmas or wizard card prints in place of the drink. Exits 1 on a page dish the card never shows,
   or an alcoholic drink on a dry film's page.
     node scripts/check-pages.cjs ["Film (Year)" ...] */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
const rd=p=>fs.readFileSync(path.join(R,p),'utf8'),rj=p=>JSON.parse(rd(p));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const N=s=>String(s||'').toLowerCase().replace(/&amp;/g,'&').replace(/&#39;|&quot;|[’'"“”]/g,"'").replace(/[^a-z0-9à-ÿ']+/g,' ').trim();
const films=rj('data/films.json'),NAMED=process.argv.slice(2);
const E=(()=>{const s=rd('movie-menus.js'),pre='const MOVIE_MENU_EDITIONS = ';return JSON.parse(s.slice(s.indexOf(pre)+pre.length).replace(/;\s*$/,''))})();
const FMT=rd('formats.js');
const DRY=(()=>{const m=rd('app.js').match(/const DRY_THEMES=(\[[^\]]*\]);/);return m?JSON.parse(m[1]):[]})();
const BOOZE=/\b(wine|bordeaux|champagne|bourbon|whisk(e)?y|rum|vodka|gin|tequila|brandy|ale|beer|lager|stout|cider|sherry|highball|martini|margarita|mead|liqueur|schnapps|prosecco)\b/i;
const block=id=>{const i=FMT.indexOf(JSON.stringify(id)+':{');if(i<0)return '';const j=FMT.indexOf('\n  "',i+5);return FMT.slice(i,j<0?i+20000:j)};
let bad=[];
for(const f of films){const id=f.title+' ('+f.year+')';if(NAMED.length&&!NAMED.includes(id))continue;const s=slug(id),p=path.join(R,'menu',s,'index.html');if(!fs.existsSync(p))continue;
  const page=fs.readFileSync(p,'utf8'),names=[...page.matchAll(/<h3>([^<]+)/g)].map(m=>m[1].trim());
  const src=[];for(const k of 'SMWK')for(const r of f[k]||[])src.push(r[0]);
  if(E[id]&&E[id].menu)for(const c of 'smwd')for(const it of E[id].menu[c]||[])src.push(it.n);
  try{const r2=rj('data/recipes2/'+s+'.json');for(const d of r2.dishes||[]){src.push(d.n);for(const a of Object.values(d.alt||{}))src.push(a.n)}}catch(e){}
  const hay=N(src.join(' | '))+' | '+N(block(id));const dry=DRY.includes(f.theme);
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
  if(DRY.includes(f.theme))for(const a of arts){const t=a[1].replace(/ginger beer|root beer|ginger ale|butterbeer|apple cider|wine vinegar|rum essence|sherry vinegar|sake lees/ig,'');if(NOTEBOOZE.test(t)&&!/\b(alcohol-free|non-alcoholic|zero)\b/i.test(t))bad.push(`${id}: dry page note names alcohol: "${a[1].slice(0,80)}"`)}}
console.log(bad.join('\n'));console.log(`check-pages: ${bad.length} page dishes not on their card`);process.exit(bad.length?1:0);
