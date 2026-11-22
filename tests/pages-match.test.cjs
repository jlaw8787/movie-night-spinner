/* Review 38: every dish on a film page is one its card prints (scripts/check-pages.cjs) */
const {execFileSync}=require('child_process');const path=require('path');
try{const o=execFileSync('node',[path.join(__dirname,'../scripts/check-pages.cjs')],{encoding:'utf8'});console.log('PASS: '+o.trim().split('\n').pop())}
catch(e){console.log(String(e.stdout||e));console.log('FAIL: film page dishes not on their card');process.exit(1)}
