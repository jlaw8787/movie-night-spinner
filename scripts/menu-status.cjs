// Read-only queue for the current HTML/CSS film-world menu rollout.
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const context={};
vm.createContext(context);
vm.runInContext(read('formats.js')+';this.formats=FMT_FILMS;',context);
const stills=JSON.parse(read('data/film-stills.json'));
const films=JSON.parse(read('data/films.json'));
const rows=films.map(f=>{
  const id=`${f.title} (${f.year})`;
  const slug=id.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
  const data=JSON.parse(read(`data/film/${slug}.json`));
  const menu=data.edition?.menu||data.recipe;
  return {id,status:context.formats[id]?'custom':'pending',format:context.formats[id]?.fmt||null,
    recipeReady:['s','m','w','d'].every(k=>menu?.[k]?.length),stillsReady:!!stills[id]?.length};
});
const pending=rows.filter(r=>r.status==='pending');
const report={total:rows.length,custom:rows.length-pending.length,pending:pending.length,
  next:[...pending.filter(r=>r.stillsReady),...pending.filter(r=>!r.stillsReady)],films:rows};
if(process.argv.includes('--json'))console.log(JSON.stringify(report,null,2));
else{
  console.log(`${report.custom}/${report.total} custom film-world menus; ${report.pending} pending.`);
  console.log('Next menus (available stills first):');
  for(const r of report.next.slice(0,12))console.log(`- ${r.id}${r.stillsReady?' [stills ready]':''}${r.recipeReady?'':' [recipe needed]'}`);
}
