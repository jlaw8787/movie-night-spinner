// Review 31: the fit table in data/film-flavour.json is well formed, and the menu data it guards stays complete.
//   currency is one the price pass can print; priceEra is a band it knows; world is "storybook" or absent; country is a two-letter code;
//   every signed note says whether it is a real quote or a note; no dish or house note is under four words;
//   a film set in the UK, Korea, Brazil and so on carries its money (the ones review 31 caught stay caught).
// The rendered side (money on the card, era bands, storybook coin, thin printed notes, signed quotes) is scripts/check-menu-fit.cjs.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'..'),rj=p=>JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const FL=rj('data/film-flavour.json'),F=rj('data/films.json'),H=rj('data/film-house.json'),app=fs.readFileSync(path.join(root,'app.js'),'utf8');
const BAND=Function("return "+app.match(/const PF_BAND=(\{[^;]*\});/)[1])();
const CUR=new Set(['$','£','£sd','€','F','L','₩','¥','R$','kr','RM','G','coin','Kč','roubles','piastres','Rs','฿','Rp','S/']);
const bad=[];
for(const [id,v] of Object.entries(FL)){
  if(v.currency!=null&&!CUR.has(v.currency))bad.push(`${id}: currency ${v.currency}`);
  if(v.priceEra!=null&&!BAND[v.priceEra])bad.push(`${id}: priceEra ${v.priceEra}`);
  if(v.currency==='coin'&&!v.coin)bad.push(`${id}: coin money with no coin name`);
  if(v.world!=null&&v.world!=='storybook')bad.push(`${id}: world ${v.world}`);
  if(v.country!=null&&!/^[A-Z]{2}$/.test(v.country))bad.push(`${id}: country ${v.country}`);
  if(v.note&&typeof v.note==='object'&&v.note.text&&!['quote','note'].includes(v.note.kind))bad.push(`${id}: signed note with no kind`);
}
const words=s=>String(s||'').replace(/[^\w' ]/g,' ').trim().split(/\s+/).filter(Boolean).length;
for(const f of F){const id=`${f.title} (${f.year})`;for(const k of 'SMWK')for(const r of f[k]||[])if(words(r[1])<4)bad.push(`${id}: note on ${r[0]} under four words`);
  const h=H[id]||{};for(const c of ['s','d'])if(h[c]&&h[c].n&&words(h[c].note)<4)bad.push(`${id}: house ${c} note under four words`)}
const must={'Shaun of the Dead (2004)':'£','Hot Fuzz (2007)':'£','Kingsman: The Secret Service (2014)':'£','Mary Poppins (1964)':'£sd','Paddington (2014)':'£','Train to Busan (2016)':'₩','The Incredible Hulk (2008)':'R$'};
for(const [id,c] of Object.entries(must))if((FL[id]||{}).currency!==c)bad.push(`${id}: should print ${c}`);
for(const id of ['Spider-Man: No Way Home (2021)','The Conjuring (2013)','The Cable Guy (1996)','Doctor Strange (2016)'])if((FL[id]||{}).world==='storybook')bad.push(`${id}: real-world film marked storybook`);
for(const [id,e] of Object.entries({'The Rocketeer (1991)':'1930s-40s','Red Dog (2011)':'1970s','Django Unchained (2012)':'1800s'}))if((FL[id]||{}).priceEra!==e)bad.push(`${id}: priceEra should be ${e}`);
assert.deepEqual(bad,[],bad.join('\n'));
const n=Object.values(FL).filter(v=>v.currency).length,s=Object.values(FL).filter(v=>v.world).length,e=Object.values(FL).filter(v=>v.priceEra).length;
console.log(`PASS: fit table well formed (${n} with their own money, ${e} with a price era, ${s} storybook), every note four words or more.`);
