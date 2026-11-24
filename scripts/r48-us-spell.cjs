/* Review 48: American cards use American words. For every card the tests/us-words.test.cjs rule calls American, swap Australian
   words (kerb, mum, queue, coriander, trolley) in the printed
   copies only: dish names and notes, house lines, flavour, cue, tagline, diet notes, poster editions and hand-built blocks. Recipes'
   methods and shopping lists keep the Australian words for the cook here. Names change the same way in every file that keys on them.
     node scripts/r48-us-spell.cjs [--dry] */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');const dry=process.argv.includes('--dry');
const rj=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8'));
const t=fs.readFileSync(path.join(R,'tests/spelling.test.cjs'),'utf8');const NOTUS=new Set(eval(t.match(/const NOTUS=new Set\((\[[^\]]*\])\)/)[1]));
const SKIP=new Set(['Thor: The Dark World (2013)','Thor: Ragnarok (2017)','Cruella (2021)','Cars 2 (2011)','Arthur Christmas (2011)','Alien 3 (1992)','Avengers: Age of Ultron (2015)','Willy Wonka & the Chocolate Factory (1971)','The Fifth Element (1997)','Thor: Love and Thunder (2022)','Austin Powers: The Spy Who Shagged Me (1999)','Teenage Mutant Ninja Turtles III (1993)']);
/* review 48: only the words change. Spelling stays Australian across the site (review 19, tests/spelling.test.cjs): favourite, colour,
   honour, theatre and armour print on every card */
const MAP=[[/\bkerb\b/g,'curb'],[/\bmum(s)?\b/g,'mom$1'],[/\bMum(s)?\b/g,'Mom$1'],[/\bfor the queue\b/g,'for the line'],[/\bcoriander\b/g,'cilantro'],[/\bCoriander\b/g,'Cilantro'],[/\bcake trolley\b/g,'dessert cart'],[/\bthe trolley\b/g,'the cart'],[/\bTrolley\b/g,'Cart'],[/\bPink Ladies coconut ice\b/g,'Pink Ladies coconut candy']];
const sw=s=>{let o=s;for(const [a,b] of MAP)o=o.replace(a,b);return o};
const walk=v=>typeof v==='string'?sw(v):Array.isArray(v)?v.map(walk):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[sw(k),walk(x)])):v;
const FL=rj('data/film-flavour.json'),FILMS=rj('data/films.json'),HO=rj('data/film-house.json'),DN=rj('data/dish-names.json'),DNO=rj('data/dish-notes.json');
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const ME=fs.readFileSync(path.join(R,'movie-menus.js'),'utf8'),pre='const MOVIE_MENU_EDITIONS = ',mi=ME.indexOf(pre)+pre.length,EDS=JSON.parse(ME.slice(mi).replace(/;\s*$/,''));
let FMT=fs.readFileSync(path.join(R,'formats.js'),'utf8');const log=[];
const wj=(p,v)=>{const raw=fs.readFileSync(path.join(R,p),'utf8'),L=raw.split('\n'),ind=L.length<3?0:L[1].length-L[1].trimStart().length;fs.writeFileSync(path.join(R,p),JSON.stringify(v,null,ind||undefined)+(raw.endsWith('\n')?'\n':''))};
for(const f of FILMS){const id=f.title+' ('+f.year+')',fl=FL[id]||{};
  const us=f.theme!=='aussie'&&f.theme!=='galaxy'&&!NOTUS.has(id)&&!fl.currency&&fl.world!=='storybook'&&(!fl.country||fl.country==='US');
  if(!us||SKIP.has(id))continue;const before=JSON.stringify([f.S,f.M,f.W,f.K,f.P,f.T,FL[id],HO[id],DN[id],DNO[id]]);
  for(const k of ['S','M','W','K'])if(f[k])f[k]=f[k].map(d=>Array.isArray(d)?[sw(d[0]),sw(d[1]),...d.slice(2)]:d);
  for(const k of ['P','T'])if(typeof f[k]==='string')f[k]=sw(f[k]);
  if(FL[id])FL[id]=walk(FL[id]);if(HO[id])HO[id]=walk(HO[id]);if(DN[id])DN[id]=walk(DN[id]);if(DNO[id])DNO[id]=walk(DNO[id]);
  let ch=JSON.stringify([f.S,f.M,f.W,f.K,f.P,f.T,FL[id],HO[id],DN[id],DNO[id]])!==before;
  const s=slug(id);
  for(const d of ['recipes','recipes2','diet']){const p=`data/${d}/${s}.json`;if(!fs.existsSync(path.join(R,p)))continue;const v=rj(p),b=JSON.stringify(v);let o;
    if(d==='recipes'){o={};for(const [c,l] of Object.entries(v))o[c]=Array.isArray(l)?l.map(it=>it&&typeof it==='object'?{...it,n:sw(it.n||''),note:it.note!=null?sw(it.note):it.note}:it):l}
    else if(d==='recipes2'){o={...v,dishes:(v.dishes||[]).map(x=>({...x,n:sw(x.n),...(x.alt?{alt:Object.fromEntries(Object.entries(x.alt).map(([k,a])=>[k,{...a,n:sw(a.n||'')}]))}:{})}))}}
    else o=walk(v);
    if(JSON.stringify(o)!==b){ch=true;if(!dry)wj(p,o)}}
  if(EDS[id]){const b=JSON.stringify(EDS[id]);const e=EDS[id];if(e.menu)for(const k of ['s','m','w','d'])if(e.menu[k])e.menu[k]=e.menu[k].map(it=>({...it,n:sw(it.n||''),note:it.note!=null?sw(it.note):it.note}));if(typeof e.cue==='string')e.cue=sw(e.cue);if(JSON.stringify(e)!==b)ch=true}
  {const L=FMT.split('\n');const i=L.findIndex(l=>l.startsWith(`  ${JSON.stringify(id)}:{`));if(i>=0){let j=i+1;while(j<L.length&&!/^  "[^"]+ \(\d{4}\)":\{/.test(L[j])&&!/^\};?\s*$/.test(L[j]))j++;const blk=L.slice(i,j).join('\n'),nb=sw(blk);if(nb!==blk){ch=true;FMT=[...L.slice(0,i),nb,...L.slice(j)].join('\n')}}}
  if(ch)log.push(id)}
console.log(log.length,'American cards respelled:',log.join('; '));
if(!dry){fs.writeFileSync(path.join(R,'data/films.json'),JSON.stringify(FILMS));wj('data/film-flavour.json',FL);wj('data/film-house.json',HO);
  fs.writeFileSync(path.join(R,'data/dish-names.json'),JSON.stringify(DN));fs.writeFileSync(path.join(R,'data/dish-notes.json'),JSON.stringify(DNO));
  fs.writeFileSync(path.join(R,'formats.js'),FMT);fs.writeFileSync(path.join(R,'movie-menus.js'),ME.slice(0,mi)+JSON.stringify(EDS)+(/;\s*$/.test(ME)?';':'')+(ME.endsWith('\n')?'\n':''))}
