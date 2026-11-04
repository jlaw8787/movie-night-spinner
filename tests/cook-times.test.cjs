// The cook time shown on the Prep sheet is never shorter than the dish's longest heat step (review 5, fix 5).
// Arancini once read "cook 2 min" because the chilling was taken off the frying.
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..'),src=fs.readFileSync(path.join(root,'app.js'),'utf8');
const line=start=>{const i=src.indexOf(start);assert.ok(i>=0,'missing '+start);return src.slice(i,src.indexOf('\n',i))};
const fnStart=src.indexOf('function dishTimes(');const fnEnd=src.indexOf('\n/*',fnStart);
const code=[line('const WAIT_RE='),line('const HEAT_RE='),line('const TIP_RE='),line('const stepParts='),src.slice(fnStart,fnEnd)].join('\n')+'\n;globalThis.dishTimes=dishTimes;globalThis.WAIT_RE=WAIT_RE;globalThis.HEAT_RE=HEAT_RE;';
const ctx={};vm.createContext(ctx);vm.runInContext(code,ctx);
let n=0;const bad=[];
for(const f of fs.readdirSync(path.join(root,'data/film'))){const d=JSON.parse(fs.readFileSync(path.join(root,'data/film',f),'utf8'));
  for(const x of (d.r2&&d.r2.dishes)||[]){n++;const T=ctx.dishTimes(x,1),st=x.steps||[];
    const heat=Math.max(0,...st.filter(t=>ctx.HEAT_RE.test(t.text)&&!((t.min||0)>=10&&ctx.WAIT_RE.test(String(t.text).trim()))).map(t=>t.min||0));
    if(T.cook<heat)bad.push(`${f}: ${x.n} shows cook ${T.cook} min, a heat step takes ${heat}`);
    if(T.prep<0||T.cook<0||T.wait<0)bad.push(`${f}: ${x.n} has a negative time`);
    /* review 6: prep is never 0, and long setting, draining, rising and chilling steps count as waiting, not hands-on */
    if(st.length&&T.prep<=0)bad.push(`${f}: ${x.n} shows Prep 0 min`);
    for(const t of st)if((t.min||0)>=60&&!ctx.HEAT_RE.test(t.text)&&/\b(set|drain|rise|chill|refrigerat\w*|freez(?!e-dried)\w*|overnight|doubled)\b/i.test(t.text)&&!ctx.WAIT_RE.test(String(t.text).trim()))bad.push(`${f}: ${x.n} counts "${t.text.slice(0,50)}" as hands-on`)}}
assert.ok(n>4000,'dishes found');
assert.deepEqual(bad,[],bad.join('\n'));
console.log(`PASS: ${n} dishes, none shows a cook time shorter than its longest heat step, none shows Prep 0, long waits count as waiting.`);
