/* Menu sweep helper: read or change one film's card in data/films.json without hand-editing the one-line file.
     node scripts/sweep-films.cjs get "Title (Year)"            prints the film's entry, pretty
     node scripts/sweep-films.cjs set "Title (Year)" file.json  replaces the listed keys (S, M, W, K, T, D, P) from file.json
     node scripts/sweep-films.cjs apply sweep/patches/*.json    applies saved patches: each file is {"Title (Year)":{...keys...}}
   Every change is also saved to sweep/patches/<team>.json when SWEEP_TEAM is set, so the lead can re-apply it on the main branch. */
const fs=require('fs'),path=require('path');
const R=path.join(__dirname,'..'),FP=path.join(R,'data/films.json');
const films=JSON.parse(fs.readFileSync(FP,'utf8'));
const find=id=>films.find(f=>f.title+' ('+f.year+')'===id);
const KEYS=['S','M','W','K','T','D','P'];
const save=()=>fs.writeFileSync(FP,JSON.stringify(films));
function setOne(id,patch){const f=find(id);if(!f)throw Error('No film '+id);for(const k of Object.keys(patch)){if(!KEYS.includes(k))throw Error('Key '+k+' not allowed');f[k]=patch[k]}}
const [cmd,...args]=process.argv.slice(2);
if(cmd==='get'){const f=find(args[0]);if(!f)throw Error('No film '+args[0]);const o={};for(const k of KEYS)if(f[k]!==undefined)o[k]=f[k];console.log(JSON.stringify(o,null,1))}
else if(cmd==='set'){const patch=JSON.parse(fs.readFileSync(args[1],'utf8'));setOne(args[0],patch);save();
  if(process.env.SWEEP_TEAM){const pf=path.join(R,'sweep/patches',process.env.SWEEP_TEAM+'.json');fs.mkdirSync(path.dirname(pf),{recursive:true});const all=fs.existsSync(pf)?JSON.parse(fs.readFileSync(pf,'utf8')):{};all[args[0]]=Object.assign(all[args[0]]||{},patch);fs.writeFileSync(pf,JSON.stringify(all,null,1))}
  console.log('set',args[0],Object.keys(patch).join(','))}
else if(cmd==='apply'){for(const pf of args){const all=JSON.parse(fs.readFileSync(pf,'utf8'));for(const [id,p] of Object.entries(all))setOne(id,p);console.log('applied',pf,Object.keys(all).length)}save()}
else console.log('usage: get | set | apply');
