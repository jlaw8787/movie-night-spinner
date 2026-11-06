/* Fact and vibe audit: the films still to check, most likely to hold errors first (see docs/AUDIT.md).
   Films that print quotes or signed notes come first, then hand-built menus, then the rest. Films with a result file are left out.
     node scripts/audit-queue.cjs [N]   prints the next N slugs (all if no N) */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..'),C=path.join(R,'audit/cards'),RES=path.join(R,'audit/results');
const done=new Set(fs.existsSync(RES)?fs.readdirSync(RES).map(f=>f.replace(/\.json$/,'')):[]);
const rows=fs.readdirSync(C).filter(f=>f.endsWith('.json')).map(f=>JSON.parse(fs.readFileSync(path.join(C,f),'utf8'))).filter(c=>!done.has(c.slug));
const score=c=>{const t=c.faces.flat().join('\n');return (/[“”"]/.test(t)?4:0)+(c.venue&&c.venue.note&&c.venue.note.by?2:0)+(c.layout==='hand-built'?1:0)};
rows.sort((a,b)=>score(b)-score(a)||a.slug.localeCompare(b.slug));
const N=+process.argv[2]||rows.length;console.log(rows.slice(0,N).map(c=>c.slug).join('\n'));
