/* Shared layout notes print in full (13 Nov, Josh: rewrite long notes to fit). app.js libMenu cuts any dish note over 100 characters
   on a shared layout (libTrim), so a longer note would lose its end on the card. This fails on any note a shared layout could print
   over that limit: the card note, the poster edition's note, and the vegetarian and alcohol-free notes in data/diet.
   Run node scripts/build-data.cjs first (it reads data/film). */
const fs=require('node:fs'),path=require('node:path');const R=path.join(__dirname,'..'),MAX=100;
const dir=path.join(R,'data/film'),bad=[];let n=0,films=0;
const chk=(f,where,t)=>{if(typeof t!=='string')return;n++;const s=t.trim();if(s.length>MAX)bad.push(`${f} ${where} (${s.length}): ${s}`)};
for(const file of fs.readdirSync(dir).filter(x=>x.endsWith('.json'))){
  const d=JSON.parse(fs.readFileSync(path.join(dir,file),'utf8'));if(!d.lib)continue;films++;
  for(const k of ['S','M','W','K'])for(const it of d[k]||[])chk(file,`${k} ${Array.isArray(it)?it[0]:it.n}`,Array.isArray(it)?it[1]:it&&it.note);
  const em=d.edition&&d.edition.menu||{};for(const k of ['s','m','w','d'])for(const it of em[k]||[])chk(file,`edition ${it.n}`,it.note);
  const dn=d.diet&&d.diet.notes||{};for(const [dish,v] of Object.entries(dn))for(const [kind,t] of Object.entries(v||{}))chk(file,`${kind} ${dish}`,t);
}
if(bad.length){console.log(`FAIL: ${bad.length} shared layout notes over ${MAX} characters (the card would cut them):\n  `+bad.slice(0,40).join('\n  '));process.exit(1)}
console.log(`PASS: all ${n} notes on the ${films} shared layout films fit in ${MAX} characters.`);
