// Review 34, ported in review 36: food-first notes on all 1,000 films must pass, and no card may repeat a film touch beyond audit/touch-baseline.json (scripts/check-touch.cjs, scripts/check-food-first.cjs).
const {execFileSync}=require('child_process'),path=require('path');
for(const s of ['check-touch','check-food-first']){try{execFileSync('node',[path.join(__dirname,'..','scripts',s+'.cjs')],{stdio:'pipe'})}catch(e){console.log(String(e.stdout));console.log('FAIL: '+s);process.exit(1)}}
console.log('PASS: no new film-touch repeats beyond the baseline, every note leads with the food.');
