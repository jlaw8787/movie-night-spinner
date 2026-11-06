/* Fact and vibe audit, step 3: gathers audit/results/*.json into docs/audit-report.md (see docs/AUDIT.md).
   Each wrong or unsure line is found in the data by its exact text, so the report says which file (and for films.json which field) to edit.
     node scripts/audit-report.cjs */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..'),RES=path.join(R,'audit/results');
const rd=f=>{try{return fs.readFileSync(path.join(R,f),'utf8')}catch(e){return ''}};
const FILMS=JSON.parse(rd('data/films.json')||'[]');
const BIG=['data/dish-notes.json','data/film-flavour.json','data/film-house.json','formats.js','movie-menus.js','data/dish-names.json'].map(f=>[f,rd(f)]);
const norm=t=>String(t).replace(/[‘’]/g,"'").replace(/[“”]/g,'"').replace(/\s+/g,' ').trim();
/* the most specific place a line lives: a field in the film's films.json entry, then its recipe and diet files, then the shared files */
function locate(id,slug,text){const t=norm(text).replace(/^"|"$/g,'');if(t.length<4)return [];const out=[];
  const f=FILMS.find(x=>`${x.title} (${x.year})`===id);
  if(f){const walk=(v,p)=>{if(typeof v==='string'){if(norm(v).includes(t))out.push(`data/films.json ${id} ${p}`)}else if(Array.isArray(v))v.forEach((x,i)=>walk(x,`${p}[${i}]`));else if(v&&typeof v==='object')for(const k of Object.keys(v))walk(v[k],p?`${p}.${k}`:k)};
    const NAMES={S:'starters',M:'mains',W:'sweets',K:'drinks',P:'cue',T:'tagline',D:'about'};for(const k of Object.keys(f))walk(f[k],NAMES[k]?`${k} (${NAMES[k]})`:k)}
  for(const d of ['data/recipes2','data/recipes','data/diet']){const s=rd(`${d}/${slug}.json`);if(s&&norm(s).includes(t))out.push(`${d}/${slug}.json`)}
  for(const [f,s] of BIG)if(s&&norm(s).includes(t)){const i=norm(s).indexOf(t);out.push(f.endsWith('.js')?`${f} (search "${t.slice(0,40)}")`:f)}
  return [...new Set(out)]}
const files=fs.existsSync(RES)?fs.readdirSync(RES).filter(f=>f.endsWith('.json')):[];const all=[];
for(const fn of files){try{const r=JSON.parse(fs.readFileSync(path.join(RES,fn),'utf8'));r.slug=fn.replace(/\.json$/,'');all.push(r)}catch(e){console.log('bad json',fn,e.message)}}
const bad=[],flat=[];let okN=0;
for(const r of all){okN+=r.checked_ok||0;for(const x of r.facts||[])if(x.verdict!=='ok')bad.push({r,x,loc:[...new Set([...locate(r.id,r.slug,x.text),...(x.full?locate(r.id,r.slug,x.full):[])])]});if(r.vibe&&(r.vibe.flat||r.vibe.overall<3.5))flat.push(r)}
const esc=s=>String(s==null?'':s).replace(/\|/g,'\\|').replace(/\n/g,' ');
const open=bad.filter(b=>!b.x.done),wrong=open.filter(b=>b.x.verdict==='wrong'),unsure=open.filter(b=>b.x.verdict==='unsure');
const vib=all.filter(r=>r.vibe&&typeof r.vibe.overall==='number');const avg=vib.length?(vib.reduce((a,r)=>a+r.vibe.overall,0)/vib.length).toFixed(2):'-';
let md=`# Audit report\n\nMade by scripts/audit-report.cjs from audit/results. Rules and file format: docs/AUDIT.md.\n\n`;
md+=`- Films checked: ${all.length} of 900\n- Lines checked and right: ${okN}\n- Wrong lines still open: ${wrong.length} (fixed: ${bad.filter(b=>b.x.done&&b.x.verdict==='wrong').length})\n- Unsure lines still open: ${unsure.length}\n- Average vibe: ${avg} out of 5\n- Flat menus (vibe under 3.5) waiting for Josh's call: ${flat.filter(r=>!r.vibe.done).length}\n\n`;
md+=`## Wrong lines\n\n| Film | Where | Printed now | Why | Suggested | Lives in |\n|---|---|---|---|---|---|\n`;
for(const b of wrong.sort((a,c)=>a.r.id.localeCompare(c.r.id)))md+=`| ${esc(b.r.id)}${b.x.printed===false?' (not printed)':''} | ${esc(b.x.where)} | ${esc(b.x.full||b.x.text)} | ${esc(b.x.why)} [source](${b.x.source||''}) | ${esc(b.x.fix)} | ${esc(b.loc.join('; ')||'not found, search the card')} |\n`;
md+=`\n## Unsure lines\n\n| Film | Where | Printed now | What is unclear | Lives in |\n|---|---|---|---|---|\n`;
for(const b of unsure)md+=`| ${esc(b.r.id)} | ${esc(b.x.where)} | ${esc(b.x.text)} | ${esc(b.x.why)} | ${esc(b.loc.join('; '))} |\n`;
md+=`\n## Vibe, lowest first\n\n| Film | Layout | World | Moments | Food | Tone | Look | Overall | Verdict | Missing | Ideas |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;
for(const r of vib.sort((a,b)=>a.vibe.overall-b.vibe.overall)){const v=r.vibe,c=(()=>{try{return JSON.parse(rd(`audit/cards/${r.slug}.json`)).layout}catch(e){return ''}})();
  md+=`| ${esc(r.id)}${v.done?' (done)':''} | ${esc(c)} | ${v.world} | ${v.moments} | ${v.food} | ${v.tone} | ${v.look} | ${v.overall} | ${esc(v.verdict)} | ${esc((v.missing||[]).join('; '))} | ${esc((v.ideas||[]).join('; '))} |\n`}
fs.writeFileSync(path.join(R,'docs/audit-report.md'),md);
console.log(`${all.length} films, ${wrong.length} wrong lines open, ${unsure.length} unsure, ${flat.length} flat, average vibe ${avg}`);
