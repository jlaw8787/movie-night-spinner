/* Swap one dish for a new one, recipe and all (review 34: Australian films sharing one larder). card-ops only renames; this replaces the
   food itself everywhere it lives so the card, phone menu, prep sheet, shopping list and diet swaps stay matched.
     node scripts/swap-dish.cjs audit/swaps/*.json [--dry]
   A swap file: {"id":"Film (Year)","old":"Old dish name","dish":{
       "n":"New name","note":"Short printed note, food first","how":"One paragraph method for 4 (films.json and data/recipes)",
       "shop":["500g beef mince@Meat","1 onion@Produce", ...],
       "prep_min":20,"cook_min":30,"make_ahead":"...","veg":false,"af":true,
       "ingredients":[{"q":500,"u":"g","item":"beef mince","aisle":"Meat"}, ...],
       "steps":[{"text":"...","min":10}, ...],
       "alt":{"veg":{...same dish shape...}},      optional: the vegetarian or alcohol-free version, as data/recipes2 keeps it
       "vegNote":"Short note for the vegetarian card"   optional: data/diet notes.veg }}
   Steps: the old name and old note are replaced in every place card-ops knows (cue, other notes, flavour, house, formats.js blocks),
   then the dish's full entry is rewritten in data/films.json, data/recipes, data/recipes2 and data/diet. Run build-data after. */
const fs=require('fs'),path=require('path'),{execFileSync}=require('child_process');const R=path.join(__dirname,'..');
const args=process.argv.slice(2),dry=args.includes('--dry'),files=args.filter(a=>a!=='--dry');
const rj=p=>JSON.parse(fs.readFileSync(path.join(R,p),'utf8')),wj=(p,v)=>{if(dry)return;const fp=path.join(R,p),raw=fs.existsSync(fp)?fs.readFileSync(fp,'utf8'):'';/* keep the file's own layout (one line, or indented) so diffs stay small */
  const m=/^[\[{]\n( +)/.exec(raw);fs.writeFileSync(fp,JSON.stringify(v,null,m?m[1].length:0)+(raw.endsWith('\n')?'\n':''))};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const K={S:'s',M:'m',W:'w',K:'d'};let done=0,miss=[];
for(const file of files){const sw=JSON.parse(fs.readFileSync(file,'utf8'));const {id,old,dish:d}=sw;
  const films=rj('data/films.json');const f=films.find(x=>x.title+' ('+x.year+')'===id);if(!f){miss.push(`${file}: no film ${id}`);continue}
  let key=null,idx=-1;for(const k of 'SMWK'){const i=(f[k]||[]).findIndex(x=>x[0]===old);if(i>=0){key=k;idx=i;break}}
  if(!key){miss.push(`${file}: no dish "${old}" on ${id}`);continue}
  const oldNote=f[key][idx][1];
  /* 1. the words: every other place that names the old dish or prints its note (card-ops knows them all, formats.js included) */
  const ops=[{old,new:d.n}];if(oldNote&&d.note&&oldNote!==d.note)ops.push({old:oldNote,new:d.note});
  const tmp=path.join(require('os').tmpdir(),'swap-'+slug(id)+'.json');fs.writeFileSync(tmp,JSON.stringify({id,ops}));
  if(!dry)execFileSync('node',[path.join(R,'scripts/card-ops.cjs'),'apply',tmp],{stdio:'ignore'});
  /* 2. the dish itself */
  const F2=rj('data/films.json'),f2=F2.find(x=>x.title+' ('+x.year+')'===id);const i2=f2[key].findIndex(x=>x[0]===d.n);
  f2[key][i2>=0?i2:idx]=[d.n,d.note,d.how,d.shop];wj('data/films.json',F2);
  const s=slug(id),c=K[key];
  const rp=`data/recipes/${s}.json`;if(fs.existsSync(path.join(R,rp))){const r=rj(rp);const L=r[c]||[];const j=L.findIndex(x=>x.n===d.n||x.n===old);const v={n:d.n,note:d.note,how:d.how,shop:d.shop};if(j>=0)L[j]=v;else L.push(v);r[c]=L;wj(rp,r)}
  const r2p=`data/recipes2/${s}.json`;if(fs.existsSync(path.join(R,r2p))){const r=rj(r2p);const j=r.dishes.findIndex(x=>x.n===d.n||x.n===old);
    const v={n:d.n,course:c,prep_min:d.prep_min,cook_min:d.cook_min,make_ahead:d.make_ahead||'',ingredients:d.ingredients,steps:d.steps,veg:!!d.veg,af:d.af!==false};if(d.alt)v.alt=d.alt;
    if(j>=0)r.dishes[j]=v;else r.dishes.push(v);wj(r2p,r)}
  const dp=`data/diet/${s}.json`;if(fs.existsSync(path.join(R,dp))){const r=rj(dp);r.notes=r.notes||{};const prev=r.notes[d.n]||r.notes[old];delete r.notes[old];
    if(d.vegNote)r.notes[d.n]={...(prev||{}),veg:d.vegNote};else if(prev&&!d.veg&&!d.alt)delete r.notes[d.n];else if(prev)r.notes[d.n]=prev;wj(dp,r)}
  done++}
for(const m of miss)console.log('MISS',m);console.log(`swap-dish: ${done} swapped, ${miss.length} missed${dry?' (dry run)':''}`);process.exit(miss.length?1:0);
