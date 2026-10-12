const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
const editionsSource=fs.readFileSync(path.join(root,'movie-menus.js'),'utf8');
const filmSource=html.match(/const FILMS=.*?;\n/)[0];
const menuCode=html.slice(html.indexOf('const movieEdition='),html.indexOf('const svg=s=>'));
const shopCode=html.slice(html.indexOf('const AISLES='),html.indexOf('/* ================= MENU DESIGN'));
const cardCode=html.slice(html.indexOf('function cardHTML('),html.indexOf('function prepHTML('));
const context=vm.createContext({JSON,console});
vm.runInContext(editionsSource+'\n'+filmSource+'\n'+`const shuffle=a=>a.slice().reverse();const ESC=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));\n`+menuCode+shopCode+cardCode,context);
const run=s=>vm.runInContext(s,context);
const ids=run('Object.keys(MOVIE_MENU_EDITIONS)');
assert.equal(ids.length,3);
for(const id of ids){
 context.testId=id;
 const edition=run('MOVIE_MENU_EDITIONS[testId]');
 assert.ok(run('FILMS.some(f=>f.id===testId)'));
 assert.equal(edition.servings,4);
 assert.deepEqual(Object.keys(edition.menu).sort(),['d','m','s','shopping','w']);
 for(const [key,count] of [['s',2],['m',1],['w',1],['d',1]]){
  assert.equal(edition.menu[key].length,count);
  for(const item of edition.menu[key]){
   assert.ok(item.n&&item.note&&item.how&&item.shop.length);
  }
 }
 assert.equal(run('JSON.stringify(makeMenu(FILMS.find(f=>f.id===testId),true))'),run('JSON.stringify(makeMenu(FILMS.find(f=>f.id===testId),false))'));
 run('makeMenu(FILMS.find(f=>f.id===testId),true).s[0].n="changed"');
 assert.notEqual(edition.menu.s[0].n,'changed'); // No accidental mutation of curated menu.
 const markup=run('cardHTML(FILMS.find(f=>f.id===testId),makeMenu(FILMS.find(f=>f.id===testId),true),"tag")');
 assert.ok(markup.includes(edition.poster));
 for(const key of ['s','m','w','d'])for(const item of edition.menu[key])assert.ok(markup.includes(run('ESC('+JSON.stringify(item.n)+')')));
 const image=fs.readFileSync(path.join(root,edition.poster));
 assert.equal(image.readUInt16BE(0),0xffd8); // Valid JPEG delivery asset.
 assert.ok(image.length>10000);
 const shopping=run('shopGroups(makeMenu(FILMS.find(f=>f.id===testId),true)).flatMap(([aisle,list])=>list)');
 assert.equal(shopping.length,edition.menu.shopping.length);
}
assert.ok(run('shopGroups(MOVIE_MENU_EDITIONS["Ghostbusters (1984)"].menu).flatMap(([a,l])=>l).includes("4 eggs")'));
assert.ok(run('shopGroups(MOVIE_MENU_EDITIONS["The Warriors (1979)"].menu).flatMap(([a,l])=>l).includes("2 limes")'));
const normal=run('FILMS.find(f=>!MOVIE_MENU_EDITIONS[f.id])');context.normalId=normal.id;
assert.ok(run('makeMenu(FILMS.find(f=>f.id===normalId),true).m.length>0'));
const rollout=JSON.parse(fs.readFileSync(path.join(root,'menu-artwork-rollout.json'),'utf8'));
assert.equal(rollout.films.length,708);
assert.equal(rollout.films.filter(f=>f.status==='complete').length,3);
assert.equal(new Set(rollout.films.map(f=>f.id)).size,708);
assert.ok(html.includes('img.decode()'));
console.log('PASS: artwork/menu matching, portions, consolidated shopping, A4 assets, accessible text, curated-menu stability, legacy fallback and 708-film rollout.');
