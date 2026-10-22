// Film-world menus must keep their recipe links and phone sections intact.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const rd=p=>fs.readFileSync(path.join(root,p),'utf8');
const ctx=vm.createContext({});
vm.runInContext(`
const ESC=s=>String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const TMDB_IMG='https://image.tmdb.org/t/p/';
const movieEdition=f=>f.edition||null;
const exactMenu=f=>f.edition?f.edition.menu:f.recipe;
const toItem=([n,note,how,shop])=>({n,note,how,shop});
const lobbyPoster=f=>TMDB_POSTERS[f.id]||null;
`+rd('tmdb-posters.js')+rd('formats.js')+`;this.specs=FMT_FILMS;this.renderers=FMT_RENDER;this.palettes=FMT_PHONE;this.menu=fmtMenu;this.phone=fmtPhoneHTML;`,ctx);
const identityText=s=>s.replace(/<[^>]*>/g,' ').replace(/&amp;/g,'&').replace(/&nbsp;/g,' ').replace(/[’‘]/g,"'").replace(/\s+/g,' ').toLowerCase();
const batch=['Anchorman: The Legend of Ron Burgundy (2004)',...Object.entries(ctx.specs).filter(([,spec])=>spec.art).map(([id])=>id)];
let dishes=0;
for(const[id,spec]of Object.entries(ctx.specs)){
 const slug=id.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
 const f={...JSON.parse(rd('data/film/'+slug+'.json')),id,title:id.replace(/ \(\d+\)$/,''),year:id.slice(-5,-1)};
 assert.equal(typeof ctx.renderers[spec.fmt],'function',id);
 assert.ok(ctx.palettes[spec.fmt],id+' phone palette');
 const menu=ctx.menu(f,spec);
 for(const it of menu.all){assert.ok(it.how&&it.shop.length,id+' / '+it.n);dishes++;}
 if(!batch.includes(id))continue;
 const exact=f.edition?f.edition.menu:f.recipe;
 assert.equal([menu.s.length,menu.m.length,menu.w.length,menu.d.length].join(','),'2,1,1,1',id);
 assert.equal(menu.all.length,5,id);
 for(const it of menu.all){
  const original=['s','m','w','d'].flatMap(k=>exact[k]).find(x=>x.n===it.n);
  assert.ok(original,id+' exact recipe: '+it.n);
  assert.equal(it.how,original.how,id+' method: '+it.n);
  assert.equal(JSON.stringify(it.shop),JSON.stringify(original.shop),id+' shopping: '+it.n);
 }
 const html=ctx.renderers[spec.fmt](f,spec,menu,'/poster.jpg');
 assert.ok(html.includes('fx-poster')&&html.includes('fx-wall'),id+' printable artwork');
 assert.ok(!/undefined|NaN/.test(html),id+' complete markup');
 assert.ok(html.includes(ESCForTest(f.edition?.cue||f.P)),id+' serving cue included');
 if(spec.art){
  const imageSources=[...html.matchAll(/<img[^>]+src="([^"]+)"/g)].map(m=>m[1]);
  assert.ok(imageSources.every(src=>src.startsWith('https://image.tmdb.org/t/p/')||src==='assets/hero/paper.webp'||(id==='Coming to America (1988)'&&src==='assets/menu-details/mcdowells-film-source.jpg')),id+' imagery uses authentic film assets and paper texture');
  const used=Object.entries(spec.art).filter(([,path])=>html.includes(path));
  for(const [role,path] of used){
   assert.match(path,/^\/[A-Za-z0-9]+\.(?:jpg|png|svg)$/,id+' valid '+role+' image path');
  }
  assert.ok(used.some(([role])=>['logo','poster','identity'].includes(role))||[spec.phoneTitle,f.title].some(title=>identityText(html).includes(identityText(ESCForTest(title)))),id+' film identity included');
  /* print readability caps photos at about 40% of the page, so one strong film image is the floor */
  assert.ok(new Set(used.map(([,path])=>path)).size>=1,id+' film imagery');
  assert.ok(!/api_key=|access_token=|api\.themoviedb/.test(html),id+' no credentials or API requests in browser markup');
 }

 const phone=ctx.phone(f,spec,menu);
 assert.equal((phone.match(/class="fp-dish"/g)||[]).length,5,id+' phone dishes');
 assert.equal((phone.match(/role="tab"/g)||[]).length,4,id+' phone courses');
 assert.ok(phone.includes(ESCForTest(spec.phoneTitle)),id+' short phone title');
}
function ESCForTest(s){return String(s).replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));}
console.log(`PASS: ${Object.keys(ctx.specs).length} film-world formats and ${dishes} dish links; ${batch.length} recent editions retain exact recipes, printable markup and complete phone sections.`);
