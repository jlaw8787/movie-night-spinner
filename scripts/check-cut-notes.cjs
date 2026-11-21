/* Cut notes sweep (review 33, kept as a script in review 34). Reads audit/cards/<slug>.json (scripts/audit-extract.cjs writes them from the
   real printed card) and checks, for every shared-layout dish printed on the card:
     1. its note prints whole (the dish's note from films.json or data/recipes, as the card words it, up to its first full stop at least)
     2. every dish on the phone menu is on the printed card too (review 34: Kingsman's potted prawns were on the phone, not the card)
   Run audit-extract first (FORCE=1 for fresh text), then: node scripts/check-cut-notes.cjs [--list]   exits 1 on any hit */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');const LIST=process.argv.includes('--list');
const films=JSON.parse(fs.readFileSync(path.join(R,'data/films.json'),'utf8'));const HO=JSON.parse(fs.readFileSync(path.join(R,'data/film-house.json'),'utf8'));
const norm=s=>String(s||'').toLowerCase().replace(/[‘’]/g,"'").replace(/[^a-z0-9']+/g,' ').trim();
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const out=[];let n=0;
for(const f of films){const id=f.title+' ('+f.year+')',p=path.join(R,'audit/cards',slug(id)+'.json');if(!fs.existsSync(p))continue;const c=JSON.parse(fs.readFileSync(p,'utf8'));if(c.layout==='hand-built')continue;n++;
  const txt=norm((c.faces||[]).flat().join(' ')),ph=norm(c.phone||''),hits=[];
  let rec={};try{rec=JSON.parse(fs.readFileSync(path.join(R,'data/recipes',slug(id)+'.json'),'utf8'))}catch(e){}
  const notes=new Map();for(const k of 'SMWK')for(const d of f[k]||[])notes.set(d[0],[d[1]]);for(const k of 'smwd')for(const d of rec[k]||[])if(d&&d.n)(notes.get(d.n)||notes.set(d.n,[]).get(d.n)).push(d.note);
  const h=HO[id]||{};for(const x of ['s','d'])if(h[x])notes.set(h[x].n,[h[x].note]);
  for(const [name,ns] of notes){if(!txt.includes(norm(name)))continue;const ok=ns.filter(Boolean).some(nt=>{const first=norm(String(nt).split(/(?<=[.!?])\s/)[0]);return !first||txt.includes(first)});
    if(!ok)hits.push(`note cut: ${name}`)}
  for(const name of notes.keys())if(ph.includes(norm(name))&&!txt.includes(norm(name)))hits.push(`on the phone, not the card: ${name}`);
  if(hits.length)out.push(`${id}: ${hits.join(' | ')}`)}
for(const l of LIST?out:out.slice(0,40))console.log(l);console.log(`check-cut-notes: ${out.length} of ${n} shared cards with a cut note or a phone-only dish`);process.exit(out.length?1:0);
