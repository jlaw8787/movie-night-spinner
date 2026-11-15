/* The Google film pages (scripts/build-seo.cjs) stay in step with data/films.json:
   one page per film, every page in the sitemap, real text, valid structured data, no em dashes. */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.join(__dirname,'..');
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const films=JSON.parse(fs.readFileSync(path.join(root,'data/films.json'),'utf8'));
const sitemap=fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
const locs=new Set([...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]));
assert.ok(fs.readFileSync(path.join(root,'robots.txt'),'utf8').includes('Sitemap: https://reeldinner.com/sitemap.xml'),'robots.txt must point at the sitemap');
assert.ok(locs.has('https://reeldinner.com/')&&locs.has('https://reeldinner.com/menu/'),'sitemap needs the home page and the film index');
const index=fs.readFileSync(path.join(root,'menu/index.html'),'utf8');
const pages=new Set(fs.readdirSync(path.join(root,'menu')).filter(n=>n!=='theme'&&n!=='genre'&&fs.statSync(path.join(root,'menu',n)).isDirectory()));
assert.equal(pages.size,films.length,'one film page per film (run node scripts/build-data.cjs)');
let recipes=0;
for(const f of films){
  const id=f.title+' ('+f.year+')',s=slug(id),p=path.join(root,'menu',s,'index.html');
  assert.ok(fs.existsSync(p),`${id}: no page at menu/${s}/`);
  const h=fs.readFileSync(p,'utf8');
  assert.ok(locs.has(`https://reeldinner.com/menu/${s}/`),`${id}: missing from sitemap.xml`);
  assert.ok(index.includes(`href="/menu/${s}/"`),`${id}: missing from the A to Z index`);
  assert.ok(h.includes(`<link rel="canonical" href="https://reeldinner.com/menu/${s}/">`),`${id}: canonical`);
  assert.ok(/<title>[^<]+ movie night dinner menu \| Reel Dinner<\/title>/.test(h),`${id}: title`);
  const desc=((h.match(/<meta name="description" content="([^"]*)"/)||[])[1]||'').replace(/&(amp|quot|lt|gt);/g,'_');
  assert.ok(desc.length>50&&desc.length<=160,`${id}: description length ${desc.length}`);
  assert.ok(h.includes('href="/?film='+encodeURIComponent(id)+'"'),`${id}: open-in-app button`);
  assert.ok((h.match(/<article class="dish">/g)||[]).length>=4,`${id}: dishes as text`);
  assert.ok(!/\u2014/.test(h),`${id}: em dash on the page`);
  const ld=JSON.parse(h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)[1]);
  const list=ld['@graph'].find(x=>x['@type']==='ItemList');
  assert.ok(list&&list.itemListElement.length,`${id}: ItemList`);
  for(const it of list.itemListElement){const r=it.item;assert.equal(r['@type'],'Recipe');assert.ok(r.name&&r.image&&r.image.length&&r.recipeIngredient.length&&r.recipeInstructions.length,`${id}: ${r.name} recipe data`);recipes++}
}
for(const f of ['menu/index.html','sitemap.xml','robots.txt'])assert.ok(!/\u2014/.test(fs.readFileSync(path.join(root,f),'utf8')),`${f}: em dash`);
console.log(`PASS: ${films.length} film pages, ${locs.size} sitemap URLs, ${recipes} recipes with structured data, no em dashes.`);
