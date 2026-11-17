const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const {html}=require('./page.cjs');
const ctx=vm.createContext({});
vm.runInContext(html.match(/const FILMS=.*?;\n/)[0]+html.match(/const SHOP_AISLES=.*?;\n/)[0]+'this.F=FILMS;this.A=SHOP_AISLES;',ctx);
const themes=new Set(ctx.F.map(f=>f.theme));
const mapped=ctx.A.flatMap(([,ts])=>ts);
for(const t of themes)assert.ok(mapped.includes(t),`theme ${t} has no aisle in the video store`);
assert.equal(new Set(mapped).size,mapped.length,'a theme sits in two aisles');
for(const id of ['viewShop','viewShopBtn','viewWheelBtn','shopSearch','shopDecade','shopUnwatched','shopAisles'])assert.ok(html.includes(`id="${id}"`),`missing #${id}`);
for(const fn of ['function renderShop(','function openCase(','function setView('])assert.ok(html.includes(fn),`missing ${fn}`);
assert.ok(html.includes('class="rent"'),'back of the box needs a Rent it button');
console.log(`PASS: video store shelves all ${ctx.F.length} films across ${ctx.A.length} aisles, with search, decade, unseen filter and rent.`);
// review 29: Australian classifications only, never US ones (R, PG-13, NC-17)
{const rs=fs.readFileSync(path.join(root,'ratings.js'),'utf8');const R=JSON.parse(rs.match(/const RATINGS=(\{.*?\});/s)[1]);
 const bad=Object.entries(R).filter(([,v])=>v&&!['G','PG','M','MA15+','R18+'].includes(v));
 assert.equal(bad.length,0,'non-Australian ratings in ratings.js: '+bad.slice(0,5).map(x=>x.join(' = ')).join('; '));
 const app=fs.readFileSync(path.join(root,'app.js'),'utf8');assert.ok(!/R18\\\+\|R\)/.test(app),'plain R still matches a Late Show test');
 console.log('PASS: every rating is Australian.')}
