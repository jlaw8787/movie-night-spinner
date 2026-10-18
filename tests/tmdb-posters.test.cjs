const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const root=path.join(__dirname,'..');
const {html}=require('./page.cjs');
const src=fs.readFileSync(path.join(root,'tmdb-posters.js'),'utf8');
const ctx=vm.createContext({});
vm.runInContext(src+'\n'+html.match(/const FILMS=.*?;\n/)[0]+'\nthis.P=TMDB_POSTERS;this.F=FILMS;',ctx);
for(const f of ctx.F)assert.match(ctx.P[f.id]||'',/^\/[A-Za-z0-9_-]+\.(jpg|png)$/,f.id);
assert.ok(!/api_key|eyJ/.test(src)); // No TMDB key or token in the public site.
assert.ok(require('./page.cjs').indexHTML.indexOf('tmdb-posters.js')<require('./page.cjs').indexHTML.indexOf('app.js'));
assert.ok(html.includes('not endorsed or certified by TMDB'));
console.log('PASS: every film has a TMDB poster path, no key in the site, attribution present.');
