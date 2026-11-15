// Loads the wider search the way the page does, for tests/search.test.cjs and the before-and-after list.
// Runs the real title search, aisles and holiday shelves from app.js in a sandbox, with search.js and data/search-index.json.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),rd=p=>fs.readFileSync(path.join(root,p),'utf8');
const app=rd('app.js'),cut=(a,b)=>{const i=app.indexOf(a),j=app.indexOf(b,i);if(i<0||j<0)throw new Error('app.js changed: '+a);return app.slice(i,j)};
const films=JSON.parse(rd('data/films.json')).map(({title,year,theme})=>({title,year,theme,id:`${title} (${year})`}));
const ctx=vm.createContext({FILMS:films,console,kidsMode:false});
vm.runInContext(rd('aisles.js')+'\n'+cut('const SHOP_AISLES=','const TMDB_IMG_SHOP')+cut('const HALLOWEEN_SOFT=','const isXmasSeason')+cut('const dAt=','const dayStart')+'\n'+cut('function searchNorm','/* ================= ease of use')+'\nthis.X={aisleOf,SEASONS,halloweenRows,filmScore,searchNorm,wordHit};',ctx);
const X=ctx.X,S=require(path.join(root,'search.js'));
S.use(JSON.parse(rd('data/search-index.json')));
const titleWords=new Set(films.flatMap(f=>X.searchNorm(f.title).split(' ')));
const sctx={
  titleScore:(q,f)=>X.filmScore(q,f),
  titleHas:(f,w)=>{const t=X.searchNorm(f.title).split(' ');return S.norm(w).split(' ').every(x=>X.wordHit(x,t)===1)},
  titleWord:w=>titleWords.has(w),titleWords:()=>[...titleWords],
  theme:f=>f.theme,aisle:f=>X.aisleOf(f),
  season:id=>{const s=X.SEASONS.find(x=>x.id===id);if(!s)return new Set();const l=s.rows?s.rows(films).flatMap(r=>r[1]):films.filter(f=>{try{return s.has(f)}catch(e){return false}});return new Set(l.map(f=>f.id))}
};
module.exports={films,X,S,sctx,
  before:q=>films.map(f=>[X.filmScore(q,f),f]).filter(x=>x[0]>=0).sort((a,b)=>a[0]-b[0]||(+a[1].year)-(+b[1].year)).map(x=>x[1]),
  after:q=>S.search(q,films,sctx)};
