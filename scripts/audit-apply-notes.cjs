/* Fact and vibe audit: writes each fix_note from audit/results into data/film-flavour.json (the signed note on shared menus, see docs/AUDIT.md)
   and marks that fact done. Run node scripts/build-data.cjs afterwards.
     node scripts/audit-apply-notes.cjs [--dry] */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..'),RES=path.join(R,'audit/results'),FP=path.join(R,'data/film-flavour.json');
const dry=process.argv.includes('--dry');const F=JSON.parse(fs.readFileSync(FP,'utf8'));let n=0,skip=[];
for(const fn of fs.readdirSync(RES).filter(f=>f.endsWith('.json'))){const p=path.join(RES,fn),r=JSON.parse(fs.readFileSync(p,'utf8'));let ch=false;
 for(const x of r.facts||[]){const fx=x.fix_note;if(!fx||x.done)continue;
  if(!F[r.id]){skip.push(r.id+': no flavour entry');continue}
  const t=String(fx.text||'').replace(/^["“]|["”]$/g,'').trim();if(!t||!fx.by||!/^(quote|note)$/.test(fx.kind)||/[—–]/.test(t)){skip.push(r.id+': bad fix_note');continue}
  F[r.id].note={text:t,by:String(fx.by).trim(),kind:fx.kind};x.done=true;x.applied=new Date().toISOString().slice(0,10);ch=true;n++}
 if(ch&&!dry)fs.writeFileSync(p,JSON.stringify(r,null,1))}
if(!dry)fs.writeFileSync(FP,JSON.stringify(F,null,1)+'\n');
console.log(`${n} notes ${dry?'would be ':''}written`);if(skip.length)console.log('skipped:\n '+skip.join('\n '));
