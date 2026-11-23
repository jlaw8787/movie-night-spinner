/* Review 40: a film TMDB files under Family prints alcohol-free like the kids, fairy tale, Christmas and wizard cards (DRY_FILMS in app.js).
   A new family film added to the lineup has to go on that list, or this fails. */
const fs=require('node:fs'),path=require('node:path');const R=path.join(__dirname,'..');
const app=fs.readFileSync(path.join(R,'app.js'),'utf8');
const themes=JSON.parse(app.match(/const DRY_THEMES=(\[[^\]]*\]);/)[1]),list=JSON.parse(app.match(/const DRY_FILMS=(\[[^\]]*\]);/)[1]);
const films=JSON.parse(fs.readFileSync(path.join(R,'data/films.json'),'utf8')),G=JSON.parse(fs.readFileSync(path.join(R,'data/film-genres.json'),'utf8'));
const miss=[];for(const f of films){const id=`${f.title} (${f.year})`;if(!themes.includes(f.theme)&&(G[id]||[]).includes('Family')&&!list.includes(id))miss.push(id)}
const gone=list.filter(id=>!films.some(f=>`${f.title} (${f.year})`===id));
if(miss.length||gone.length){console.log('FAIL: family films not on DRY_FILMS: '+miss.join(', ')+(gone.length?'\n  not in the lineup: '+gone.join(', '):''));process.exit(1)}
console.log(`PASS: ${list.length} family films off the dry themes print alcohol-free`);
