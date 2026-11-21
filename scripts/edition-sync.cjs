/* Sync applied card ops (audit/ops and audit/rework-ops) into the poster editions in movie-menus.js, scoped to each film. Run after card-ops apply: node scripts/edition-sync.cjs */
// sync applied text ops into poster editions (movie-menus.js), scoped to each film's edition
const fs=require('fs');const p='movie-menus.js';const src=fs.readFileSync(p,'utf8');
const pre='const MOVIE_MENU_EDITIONS = ';const i=src.indexOf(pre)+pre.length;const tail=src.slice(i).match(/;\s*$/)?';':'';
const body=src.slice(i).replace(/;\s*$/,'');const E=JSON.parse(body);
const walk=(v,fn)=>typeof v==='string'?fn(v):Array.isArray(v)?v.map(x=>walk(x,fn)):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[fn(k),walk(x,fn)])):v;
let n=0;const ops=[];/* review 34: walk sub-folders (audit/ops/r31) and skip an op whose new text holds the old (it would grow on every run) */
const files=dir=>fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?files(dir+'/'+e.name):/\.json$/.test(e.name)?[dir+'/'+e.name]:[]);
for(const dir of ['audit/ops','audit/rework-ops'])for(const f of files(dir)){const d=JSON.parse(fs.readFileSync(f,'utf8'));if(!d||!d.ops||!E[d.id])continue;for(const o of d.ops)if(o.old&&o.old.length>=8&&typeof o.new==='string'&&!o.new.includes(o.old))ops.push([d.id,o.old,o.new])}
/* an op undone by a later op on the same film (Last Stop to Terminal Bar and back) is skipped both ways */
{const key=o=>o.join('\u0001'),have=new Set(ops.map(key));for(let k=ops.length-1;k>=0;k--)if(have.has(key([ops[k][0],ops[k][2],ops[k][1]])))ops.splice(k,1)}
ops.sort((a,b)=>b[1].length-a[1].length);
for(const [id,o,nw] of ops){const before=JSON.stringify(E[id]);E[id]=walk(E[id],s=>s.includes(o)?s.split(o).join(nw):s);if(JSON.stringify(E[id])!==before){n++;console.log(id,'|',o.slice(0,50))}}
fs.writeFileSync(p,src.slice(0,i)+JSON.stringify(E)+tail+(src.endsWith('\n')?'\n':''));console.log(n,'edition ops synced');
