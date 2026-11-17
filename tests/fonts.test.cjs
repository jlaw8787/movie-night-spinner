/* Every font a layout asks for by name has a bundled copy (review 28: Kingpin, Caddyshack, Wedding Crashers, Ghostbusters: Afterlife
   and Better Off Dead printed in a stand-in face). Reads loadFonts([...]) lists and family= strings in the code and checks each spec
   against assets/fonts/fonts.js. Specs built from data at run time are caught by check-print-text instead.
   Fix a failure: add the query to scripts/font-queries.json and run node scripts/fetch-fonts.cjs. */
const assert=require('node:assert/strict');const fs=require('node:fs');const path=require('node:path');
const root=path.join(__dirname,'..');const window={};
eval(fs.readFileSync(path.join(root,'assets/fonts/fonts.js'),'utf8').split('(function(){')[0]);
const have=new Set(Object.keys(window.RD_FONTS.specs));const miss=[];
const files=['app.js','formats.js','formats-core.js',...fs.readdirSync(path.join(root,'menu-formats')).filter(f=>f.endsWith('.js')).map(f=>'menu-formats/'+f)];
const ok=s=>/^[A-Z][A-Za-z0-9 ]+(:[a-zA-Z,]+@[0-9.,;]+)?$/.test(s);
for(const f of files){const s=fs.readFileSync(path.join(root,f),'utf8');
  for(const m of s.matchAll(/loadFonts\(\s*\[([^\]]*)\]/g))for(const q of m[1].matchAll(/["']([^"']+)["']/g)){const spec=q[1].replace(/\+/g,' ').trim();if(ok(spec)&&!have.has(spec))miss.push(`${f}: ${spec}`)}
  for(const m of s.matchAll(/family=([^&"'`\s)]+)/g)){if(m[1].includes('$'))continue;const spec=decodeURIComponent(m[1]).replace(/\+/g,' ').trim();if(ok(spec)&&!have.has(spec))miss.push(`${f}: ${spec}`)}}
assert.deepEqual(miss,[],'fonts asked for but not bundled:\n'+miss.join('\n'));
console.log(`PASS: every named font spec in ${files.length} files is bundled.`);
