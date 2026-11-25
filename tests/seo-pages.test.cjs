/* The Google film pages (scripts/build-seo.cjs) stay in step with data/films.json:
   one page per film, every page in the sitemap, real text, valid structured data, no em dashes. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const slug=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const films=JSON.parse(fs.readFileSync(path.join(root,'data/films.json'),'utf8'));
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const locs=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: https://reeldinner.com/sitemap.xml'),'robots.txt must point at the sitemap');
assert.ok(locs.has('https://reeldinner.com/')&&locs.has('https://reeldinner.com/menu/'),'sitemap needs the home page and the film index');
const index=fs.readFileSync(path.join(root,'menu/index.html'),'utf8');
/* review 33: a film swapped out keeps its old address as a redirect page (data/film-redirects.json), which is not a film page */
const REDIR=new Set(Object.keys(JSON.parse(fs.readFileSync(path.join(root,'data/film-redirects.json'),'utf8'))));
for(const r of REDIR)assert.ok(/http-equiv="refresh"/.test(fs.readFileSync(path.join(root,'menu',r,'index.html'),'utf8')),`menu/${r}/ should redirect`);
const pages=new Set(fs.readdirSync(path.join(root,'menu')).filter(n=>n!=='theme'&&n!=='genre'&&!REDIR.has(n)&&fs.statSync(path.join(root,'menu',n)).isDirectory()));
assert.equal(pages.size,films.length,'one film page per film (run node scripts/build-data.cjs)');
let recipes=0;
for(const f of films){
  const id=f.title+' ('+f.year+')',s=slug(id),p=path.join(root,'menu',s,'index.html');
  assert.ok(fs.existsSync(p),`${id}: no page at menu/${s}/`);
  const h=fs.readFileSync(p,'utf8');
  assert.ok(locs.has(`https://reeldinner.com/menu/${s}/`),`${id}: missing from sitemap.xml`);
  assert.ok(index.includes(`href="/menu/${s}/"`),`${id}: missing from the A to Z index`);
  assert.ok(h.includes(`<link rel="canonical" href="https://reeldinner.com/menu/${s}/">`),`${id}: canonical`);
  assert.ok(/<title>[^<]+ \(\d{4}\) movie night menu<\/title>/.test(h),`${id}: title (review 52: one format, with the year)`);
  const desc=((h.match(/<meta name="description" content="([^"]*)"/)||[])[1]||'').replace(/&(amp|quot|lt|gt);/g,'_');
  assert.ok(desc.length>50&&desc.length<=155,`${id}: description length ${desc.length}`);
  /* review 30: never cut mid-word ("Recipes for 4, a...") */
  assert.ok(/\.$/.test(desc)&&!/\.\.\.$/.test(desc),`${id}: description must end on a whole sentence: "${desc.slice(-30)}"`);
  assert.ok(h.includes('href="/?film='+encodeURIComponent(id)+'"'),`${id}: open-in-app button`);
  assert.ok((h.match(/<article class="dish" id="dish-[a-z0-9-]+">/g)||[]).length>=4,`${id}: dishes as text`);
  assert.ok(!/\u2014/.test(h),`${id}: em dash on the page`);
  /* review 28: "A The Big Lebowski", "Cook the The ...", "A Alien" */
  const words=h.replace(/<script[\s\S]*?<\/script>/g,'').replace(/<[^>]+>/g,' ')+' '+desc;
  const bad=words.match(/\b(A|a|the|The) (The|A|An) [A-Z]|\b[Aa] (?!Uni|Use|Usu|Uti|Ura|Eu|One|Once)[AEIOU][a-z]|\bfor a [A-Z][\w']* movie night/);
  assert.ok(!bad,`${id}: article bug "${bad&&bad[0]}"`);
  const ld=JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list=ld['@graph'].find(x=>x['@type']==='ItemList');
  assert.ok(list&&list.itemListElement.length,`${id}: ItemList`);
  const ids=list.itemListElement.map(it=>it.url);assert.equal(new Set(ids).size,ids.length,`${id}: two recipes share an anchor`);
  for(const it of list.itemListElement){const r=it.item;assert.ok(it.url&&it.url.startsWith(`https://reeldinner.com/menu/${s}/#dish-`)&&h.includes(`id="${it.url.split('#')[1]}"`),`${id}: ${r.name} anchor`);assert.equal(r['@type'],'Recipe');assert.ok(r.name&&r.image&&r.image.length&&r.recipeIngredient.length&&r.recipeInstructions.length,`${id}: ${r.name} recipe data`);recipes++}
}
/* review 31: cook times never count pickling or chilling (no "cook 4343 min"), and titles fit in Google's 60 characters where the film name allows */
{let long=0;
 for(const d of fs.readdirSync(path.join(root,'menu'))){const p=path.join(root,'menu',d,'index.html');if(!fs.existsSync(p)||d==='theme'||d==='genre')continue;const h=fs.readFileSync(p,'utf8');
  assert.ok(!/cook \d{4,} min/.test(h),`${d}: cook time in thousands of minutes`);
  for(const m of h.matchAll(/"cookTime":"PT(\d+)M"/g))assert.ok(+m[1]<=12*60,`${d}: cookTime ${m[1]} min`);
  const t=(h.match(/<title>([^<]*)<\/title>/)||[])[1]||'';if(t.replace(/&amp;/g,'&').length>60)long++}
 /* review 52: one title format with the year; only film names over 36 characters run past 60 */assert.ok(long<=50,`${long} film page titles over 60 characters`)}
for(const t of fs.readdirSync(path.join(root,'menu/theme'))){const h=fs.readFileSync(path.join(root,'menu/theme',t,'index.html'),'utf8');assert.ok(!/\b[Aa] [AEIOU][a-z]/.test(h.replace(/<[^>]+>/g,' ')),`theme ${t}: a before a vowel`)}
for(const f of ['menu/index.html','sitemap.xml','robots.txt'])assert.ok(!/\u2014/.test(fs.readFileSync(path.join(root,f),'utf8')),`${f}: em dash`);
console.log(`PASS: ${films.length} film pages, ${locs.size} sitemap URLs, ${recipes} recipes with structured data, no em dashes.`);
