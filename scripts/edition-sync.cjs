/* Sync applied card ops (audit/ops) into the poster editions in movie-menus.js, scoped to each film. Run after card-ops apply: node scripts/edition-sync.cjs */
// sync applied text ops into poster editions (movie-menus.js), scoped to each film's edition
const fs=require('fs');const p='movie-menus.js';const src=fs.readFileSync(p,'utf8');
const pre='const MOVIE_MENU_EDITIONS = ';const i=src.indexOf(pre)+pre.length;const tail=src.slice(i).match(/;\s*$/)?';':'';
const body=src.slice(i).replace(/;\s*$/,'');const E=JSON.parse(body);
const walk=(v,fn)=>typeof v==='string'?fn(v):Array.isArray(v)?v.map(x=>walk(x,fn)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[fn(k),walk(x,fn)])):v;
let n=0;const ops=[];for(const f of fs.readdirSync('audit/ops')){const d=JSON.parse(fs.readFileSync('audit/ops/'+f,'utf8'));if(!E[d.id])continue;for(const o of d.ops)if(o.old&&o.old.length>=8)ops.push([d.id,o.old,o.new])}
ops.sort((a,b)=>b[1].length-a[1].length);
for(const [id,o,nw] of ops){const before=JSON.stringify(E[id]);E[id]=walk(E[id],s=>s.includes(o)?s.split(o).join(nw):s);if(JSON.stringify(E[id])!==before){n++;console.log(id,'|',o.slice(0,50))}}
fs.writeFileSync(p,src.slice(0,i)+JSON.stringify(E)+tail+(src.endsWith('\n')?'\n':''));console.log(n,'edition ops synced');
