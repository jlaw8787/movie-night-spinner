/* Card ops (7 Nov 2026): apply text changes to one film's menu without hand-editing the big data files.
   Used by the unsure-line chase and the flat menu rework, so many agents can write changes in parallel and one run applies them.
     node scripts/card-ops.cjs apply audit/ops/*.json [--dry]
     node scripts/card-ops.cjs find "Film (Year)" "some text"     shows every file and place that text sits in for that film
   An ops file is {"id":"Film (Year)","ops":[...]} with these ops, applied in order:
     {"old":"exact text","new":"replacement"}   replaces the text everywhere it sits in that film's own data: its films.json entry,
        film-flavour and film-house entries, dish-names and dish-notes entries, data/recipes, data/recipes2 and data/diet files, and its
        block in formats.js (hand-built menus). A whole JSON string equal to "old" is replaced first; if none, any string containing it.
        Use it for dish renames (every copy changes together, so the card, recipes and shopping stay matched), notes, cues, winks, props.
     {"set":"flavour.<field>","value":...}       sets a film-flavour field (venue, sign, note, winks, prop, labels, number and the per-layout settings)
     {"set":"house.s"|"house.d","value":{"n":"...","note":"..."}}   sets a house line
     {"set":"cue"|"tagline"|"about","value":"..."}  sets films.json P, T or D
   An op that finds nothing is reported and skipped; the file gets "applied" with the date and a list of misses. Run build-data after. */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
const rj=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8'));
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const [cmd,...args]=process.argv.slice(2);const dry=args.includes('--dry');const files=args.filter(a=>a!=='--dry');
const films=rj('data/films.json'),FL=rj('data/film-flavour.json'),HO=rj('data/film-house.json'),DN=rj('data/dish-names.json'),DNo=rj('data/dish-notes.json');
let FMT=fs.readFileSync(path.join(R,'formats.js'),'utf8');
const touched=new Set();
const film=id=>films.find(f=>f.title+' ('+f.year+')'===id);
/* walk a JSON value, replacing strings (and object keys) */
function walk(v,fn){if(typeof v==='string')return fn(v);if(Array.isArray(v))return v.map(x=>walk(x,fn));if(v&&typeof v==='object'){const o={};for(const [k,x] of Object.entries(v))o[fn(k)]=walk(x,fn);return o}return v}
function count(v,pred){let n=0;walk(v,s=>{if(pred(s))n++;return s});return n}
const perFilm=id=>{const s=slug(id),o=[];for(const d of ['recipes','recipes2','diet']){const p=`data/${d}/${s}.json`;if(fs.existsSync(path.join(R,p)))o.push(p)}return o};
const cache={};const getF=p=>cache[p]||(cache[p]=rj(p));
function fmtBlock(id){const L=FMT.split('\n');const i=L.findIndex(l=>l.startsWith(`  ${JSON.stringify(id)}:{`));if(i<0)return null;let j=i+1;while(j<L.length&&!/^  "[^"]+ \(\d{4}\)":\{/.test(L[j])&&!/^\};?\s*$/.test(L[j]))j++;return {L,i,j}}
function replaceAll(id,old,nw){
  const f=film(id);const exact=s=>s===old,sub=s=>s.includes(old);let hits=[];
  const targets=[];/* [label,get,set] */
  if(f){for(const k of ['S','M','W','K','T','D','P'])if(f[k]!==undefined)targets.push(['films.json '+k,()=>f[k],v=>{f[k]=v}])}
  if(FL[id])targets.push(['film-flavour',()=>FL[id],v=>{FL[id]=v}]);if(HO[id])targets.push(['film-house',()=>HO[id],v=>{HO[id]=v}]);
  if(DN[id])targets.push(['dish-names',()=>DN[id],v=>{DN[id]=v}]);if(DNo[id])targets.push(['dish-notes',()=>DNo[id],v=>{DNo[id]=v}]);
  for(const p of perFilm(id))targets.push([p,()=>getF(p),v=>{cache[p]=v;touched.add(p)}]);
  let mode=targets.some(t=>count(t[1](),exact))?'exact':'sub';
  for(const [lab,get,set] of targets){const pred=mode==='exact'?exact:sub;const n=count(get(),pred);if(!n)continue;
    set(walk(get(),s=>mode==='exact'?(s===old?nw:s):s.split(old).join(nw)));hits.push(lab+' x'+n)}
  for(const b of [fmtBlock(id),fmtFn(id)].filter(Boolean)){const blk=b.L.slice(b.i,b.j).join('\n');
    /* the spec line is JSON, the face templates are HTML: try the text as written, then HTML escaped */
    const forms=[[old,b.html?htm(nw):JSON.stringify(nw).slice(1,-1)]];if(b.html)forms.push([htm(old),htm(nw)],[htm2(old),htm2(nw)]);
    for(const [o,n2] of forms){const n=blk.split(o).length-1;if(!n)continue;b.L.splice(b.i,b.j-b.i,...blk.split(o).join(n2).split('\n'));FMT=b.L.join('\n');hits.push((b.html?'formats.js template':'formats.js spec')+' x'+n);break}}
  return hits}
const htm=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
const htm2=s=>s.replace(/&/g,'&amp;').replace(/'/g,'&#x27;').replace(/"/g,'&quot;');
/* the face template function of a hand-built menu, only when no other film uses that template */
function fmtFn(id){const b=fmtBlock(id);if(!b)return null;const m=/"fmt":"([^"]+)"/.exec(b.L[b.i])||/fmt:"([^"]+)"/.exec(b.L[b.i]);if(!m)return null;
  const users=(FMT.match(new RegExp('"?fmt"?:"'+m[1].replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'"','g'))||[]).length;if(users!==1)return null;
  const L=FMT.split('\n'),want=('fmt'+m[1]).replace(/[^a-z0-9]/gi,'').toLowerCase();const i=L.findIndex(l=>{const k=/^function (fmt\w+)\(/.exec(l);return k&&k[1].toLowerCase()===want});if(i<0)return null;
  let j=i+1;while(j<L.length&&!/^function /.test(L[j]))j++;return {L,i,j,html:true}}
if(cmd==='find'){const [id,t]=files;const f=film(id);const show=(lab,v)=>walk(v,s=>{if(s.includes(t))console.log(lab+': '+s);return s});
  if(f)for(const k of ['S','M','W','K','T','D','P'])show('films.json '+k,f[k]);for(const [lab,o] of [['film-flavour',FL[id]],['film-house',HO[id]],['dish-names',DN[id]],['dish-notes',DNo[id]]])if(o)show(lab,o);
  for(const p of perFilm(id))show(p,getF(p));for(const b of [fmtBlock(id),fmtFn(id)].filter(Boolean))b.L.slice(b.i,b.j).forEach(l=>{for(const q of [t,htm(t),htm2(t)]){const k=l.indexOf(q);if(k>=0){console.log('formats.js'+(b.html?' template':' spec')+': ...'+l.slice(Math.max(0,k-60),k+q.length+60)+'...');break}}});process.exit(0)}
if(cmd!=='apply'){console.log('usage: apply <ops files> [--dry] | find "Film (Year)" "text"');process.exit(1)}
let nOps=0,nMiss=0;
for(const pf of files){const P=JSON.parse(fs.readFileSync(pf,'utf8'));if(P.applied&&!process.env.FORCE)continue;const id=P.id;const miss=[];
  if(!film(id)&&!FL[id]){console.log('no film',id);continue}
  for(const op of P.ops||[]){nOps++;
    if(op.old!==undefined){if(!op.old||op.old===op.new){miss.push('empty: '+op.old);continue}if(/[—–]/.test(op.new)){miss.push('dash in: '+op.new);continue}
      const h=replaceAll(id,op.old,op.new);if(!h.length)miss.push('not found: '+op.old)}
    else if(op.set){const [a,b]=op.set.split('.');
      if(a==='flavour'){if(!FL[id])FL[id]={};if(op.value===null)delete FL[id][b];else FL[id][b]=op.value}
      else if(a==='house'){HO[id]=HO[id]||{};HO[id][b]=op.value}
      else if(['cue','tagline','about'].includes(a)){const f=film(id);if(!f){miss.push('no films.json entry for '+a);continue}f[{cue:'P',tagline:'T',about:'D'}[a]]=op.value}
      else miss.push('unknown set: '+op.set)}
    else miss.push('unknown op: '+JSON.stringify(op).slice(0,80))}
  nMiss+=miss.length;if(miss.length)console.log(id+':\n  '+miss.join('\n  '));
  P.applied=new Date().toISOString().slice(0,10);P.misses=miss;if(!dry)fs.writeFileSync(pf,JSON.stringify(P,null,1))}
if(!dry){fs.writeFileSync(path.join(R,'data/films.json'),JSON.stringify(films));
  fs.writeFileSync(path.join(R,'data/film-flavour.json'),JSON.stringify(FL,null,1)+'\n');fs.writeFileSync(path.join(R,'data/film-house.json'),JSON.stringify(HO,null,1)+(fs.readFileSync(path.join(R,'data/film-house.json'),'utf8').endsWith('\n')?'\n':''));
  fs.writeFileSync(path.join(R,'data/dish-names.json'),JSON.stringify(DN));fs.writeFileSync(path.join(R,'data/dish-notes.json'),JSON.stringify(DNo));
  for(const p of touched){const raw=fs.readFileSync(path.join(R,p),'utf8');const ind=/^\{\n( +)/.exec(raw);fs.writeFileSync(path.join(R,p),ind?JSON.stringify(cache[p],null,ind[1].length)+(raw.endsWith('\n')?'\n':''):JSON.stringify(cache[p]))}
  fs.writeFileSync(path.join(R,'formats.js'),FMT)}
console.log(`${files.length} files, ${nOps} ops, ${nMiss} missed${dry?' (dry run)':''}`);
