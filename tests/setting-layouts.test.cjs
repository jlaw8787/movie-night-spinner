/* Review 30 (item 20): a menu layout that cannot exist in the film's world. A film set before 1900 (flavour.priceEra "1800s": westerns,
   pirates, fairy tales, Middle-earth, ancient Rome) never prints on a modern venue: no takeaway with a phone number, no airline, food truck,
   food court, drive-in, motel, arcade, kiosk, lab, hospital, prom, diner, bowling alley or placemat. A fantasy world with no phones
   (Raya's Kumandra) is listed here too. Add a film to NO_PHONES when its world has no delivery or phones. */
const fs=require('node:fs'),path=require('node:path');const R=path.join(__dirname,'..');
const fm=JSON.parse(fs.readFileSync(path.join(R,'data/film-format.json'),'utf8')),fl=JSON.parse(fs.readFileSync(path.join(R,'data/film-flavour.json'),'utf8'));
const MODERN=new Set(['takeaway','airline','truck','foodcourt','drivein','motel','arcade','kiosk','lab','hospital','prom','diner','bowling','placemat']);
const NO_PHONES=['Raya and the Last Dragon (2021)','Mulan (1998)','Moana (2016)','Moana 2 (2024)','Frozen (2013)','Frozen II (2019)','Brave (2012)','Tangled (2010)'];
const bad=[];
for(const [id,v] of Object.entries(fm)){const pe=fl[id]&&fl[id].priceEra;
  if((pe==='1800s'||NO_PHONES.includes(id))&&MODERN.has(v.format))bad.push(`${id}: ${v.format} layout in a world ${pe==='1800s'?'set before 1900':'with no phones or delivery'}`)}
/* review 30: these were the clashes found; they stay fixed */
const want={'Mulan (1998)':'banquet','Meet the Robinsons (2007)':'home','Raya and the Last Dragon (2021)':'dimsum'};
for(const [id,f] of Object.entries(want))if(!fm[id]||fm[id].format!==f)bad.push(`${id}: expected the ${f} layout`);
if(bad.length){console.log('FAIL:\n  '+bad.join('\n  '));process.exit(1)}
console.log('PASS: no film set before 1900 or without phones on a modern venue layout');
