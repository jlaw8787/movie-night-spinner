// The page is split across index.html (markup and styles), films.js, formats.js and app.js.
// Tests read them as one source, with the full film data from data/films.json in place of the light index.
const fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..');
const rd=p=>fs.readFileSync(path.join(root,p),'utf8');
const full=rd('data/films.json');
module.exports={root,rd,
  html:rd('index.html')+'\n'+`const FILMS=${full}.map(e=>Object.assign(e,{id:e.title+" ("+e.year+")"}));\n`+rd('app.js')+'\n'+rd('formats.js'),
  indexHTML:rd('index.html')};
