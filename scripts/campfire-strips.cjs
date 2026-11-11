/* One-off, 11 Nov (Josh): give every campfire menu E.T.'s still strip, each placed a little differently.
   Writes data/film-flavour.json stillStrip = {v, s, flip} for each campfire film except E.T. (kept as true, Josh checked it).
   v cycles album, stagger, film, row; s is three stills from 2 up (still 1 prints on the back); flip swaps the right column. Films already set are left alone (hand picks: sig full or name on 11 logos, Peter Pan's stills).
   Safe to run twice. Then: node scripts/build-data.cjs */
const fs=require('fs'),path=require('path');const R=path.join(__dirname,'..');
const FF=path.join(R,'data/film-flavour.json'),fl=JSON.parse(fs.readFileSync(FF,'utf8'));
const slug=s=>s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const V=['album','stagger','film','row'];let i=0;const out=[];
for(const key of Object.keys(fl).sort()){
  const f=path.join(R,'data/film',slug(key)+'.json');if(!fs.existsSync(f))continue;
  const j=JSON.parse(fs.readFileSync(f,'utf8'));if((j.lib||{}).fmt!=='campfire')continue;
  if(/^E\.T\./.test(key)){fl[key].stillStrip=true;continue}
  const n=(j.lib.stills||[]).length,pool=n>=5?[...Array(n).keys()].filter(k=>k>=2):[...Array(n).keys()].filter(k=>k!==1);
  const at=Math.min(i%3,Math.max(0,pool.length-3));
  if(fl[key].stillStrip&&typeof fl[key].stillStrip==='object'){i++;continue}/* set already, maybe by hand */
  fl[key].stillStrip={v:V[i%4],s:pool.slice(at,at+3),flip:i%2?1:0};out.push(key+' '+JSON.stringify(fl[key].stillStrip));i++;
}
fs.writeFileSync(FF,JSON.stringify(fl,null,1)+'\n');console.log(out.join('\n'));console.log(i,'films');
