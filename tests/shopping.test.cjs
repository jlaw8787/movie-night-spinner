// Execute actual shopping code with a small dialog DOM; no browser dependency.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const source=fs.readFileSync(process.argv[2]||path.join(__dirname,'..','app.js'),'utf8');
const listSource=source.slice(source.indexOf('function listText(f,groups)'),source.indexOf('async function openTrolley(f,menuOverride,label)'));
const trolleySource=source.slice(source.indexOf('async function openTrolley(f,menuOverride,label)'),source.indexOf('\n$("weekSet")'));
const groupsSource=source.slice(source.indexOf('const AISLES='),source.indexOf('/* ================= MENU DESIGN v2'));
class Dialog {
  constructor(){this.listeners={};this.nodes={};this.inputs=[];this.style={};this.dataset={};this.attributes={};}
  setAttribute(k,v){this.attributes[k]=v;}
  set innerHTML(html){this.html=html;this.inputs=[...html.matchAll(/data-k="([^"]+)"( checked)?/g)].map(m=>({dataset:{k:m[1]},checked:!!m[2],focus(){}}));}
  querySelector(s){if(s==='input,button')return this.inputs[0]||{focus(){}};return this.nodes[s]||=( {textContent:'',style:{},insertAdjacentHTML(){},focus(){}} );}
  querySelectorAll(s){assert.equal(s,'input');return this.inputs;}
  addEventListener(k,fn){this.listeners[k]=fn;}
  remove(){this.removed=true;}
  change(k,value){const input=this.inputs.find(i=>i.dataset.k===k);assert.ok(input,'Missing checkbox '+k);input.checked=value;return this.listeners.change({target:input});}
  async click(a){await this.listeners.click({target:{dataset:{a}}});}
  get progress(){return this.querySelector('#tProg').textContent;}
  get width(){return this.querySelector('#tBar').style.width;}
  get message(){return this.querySelector('#tMsg').textContent;}
}
function boot(locked=null,{native=false}={}){
 const dialogs=[],sent=[],saved=[];
 const base={s:[],m:[],w:[],d:[],shopping:['2 apples@Produce','1 loaf bread@Bakery']};
 const context=vm.createContext({console,document:{createElement(){return new Dialog();},body:{appendChild(o){dialogs.push(o);}},addEventListener(){},removeEventListener(){}},
 navigator:native?{share:async payload=>sent.push(payload.text)}:{clipboard:{writeText:async text=>sent.push(text)}},
 mountModal:(o,initial)=>{dialogs.push(o);o.querySelector(initial).focus();},dismissModal:o=>o.remove(),
 ESC:x=>String(x),ensureExact:async()=>{},makeMenu:()=>({...base,shopping:base.shopping.slice()}),counterShop:()=>['1 box popcorn@Pantry'],saveWeek:()=>saved.push(JSON.parse(vm.runInContext('JSON.stringify(week)',context)))});
 vm.runInContext('let week='+JSON.stringify(locked)+';'+groupsSource+listSource+trolleySource,context);
 const run=code=>vm.runInContext(code,context);
 const open=async(id='A',override=null,label=null)=>{context.f={id,title:'Film '+id,year:1988};context.override=override;context.label=label;await run('openTrolley(f,override,label)');return dialogs.at(-1);};
 return {run,open,sent,saved,base};
}
(async()=>{
 let app=boot();let o=await app.open();
 assert.equal(o.inputs.length,3,'Exact list plus counter extra retained');
 assert.match(o.progress,/0 of 3/);assert.equal(o.width,'0%');
 o.change('2 apples',true);assert.match(o.progress,/1 of 3/);assert.equal(app.saved.length,0,'Unlocked ticks must not write week');
 await o.click('share');assert.equal(app.sent.length,1);assert.doesNotMatch(app.sent[0],/2 apples/);assert.match(app.sent[0],/Bakery\n- 1 loaf bread/);assert.match(app.sent[0],/Pantry\n- 1 box popcorn/);
 await o.click('done');o=await app.open();assert.equal(o.inputs.find(i=>i.dataset.k==='2 apples').checked,true,'Unlocked ticks survive closing/reopening this visit');assert.match(o.progress,/1 of 3/);
 let other=await app.open('B');assert.match(other.progress,/0 of 3/,'Film checklists are separate');
 o=await app.open('A');o.change('1 loaf bread',true);o.change('1 box popcorn',true);assert.equal(o.width,'100%');await o.click('share');assert.equal(app.sent.length,1,'All-checked must never resend the full list');assert.match(o.message,/Nothing left to send/);
 await o.click('reset');assert.equal(o.inputs.some(i=>i.checked),false);assert.match(o.progress,/0 of 3/);assert.equal(o.message,'');assert.equal(o.width,'0%');
 o=await app.open();assert.equal(o.inputs.some(i=>i.checked),false,'Reset remains reset after reopening');
 app=boot({id:'A',ticks:{'2 apples':true,'old deleted ingredient':true}},{native:true});o=await app.open();assert.match(o.progress,/1 of 3/,'Stale persisted ingredients cannot inflate progress');
 o.change('1 loaf bread',true);assert.equal(app.saved.length,1);assert.equal(app.saved[0].ticks['1 loaf bread'],true);await o.click('share');assert.equal(app.sent.length,1);assert.match(app.sent[0],/1 box popcorn/);assert.doesNotMatch(app.sent[0],/2 apples|1 loaf bread|old deleted/);
 o=await app.open();assert.match(o.progress,/2 of 3/,'Locked ticks reopen from week state');await o.click('reset');assert.equal(app.run('Object.keys(week.ticks).length'),1,'Reset preserves keys outside the current list');assert.equal(app.run('week.ticks["old deleted ingredient"]'),true);assert.equal(app.saved.length,2);assert.match(o.progress,/0 of 3/);
 app=boot({id:'B',ticks:{'2 apples':true}});o=await app.open('A');o.change('1 loaf bread',true);assert.equal(app.saved.length,0);assert.equal(app.run('week.ticks["2 apples"]'),true,'Another locked film is untouched');
 app=boot({id:'A'});o=await app.open();o.change('2 apples',true);assert.equal(app.saved[0].ticks['2 apples'],true,'Missing legacy ticks recover safely');
 const combined={s:[],m:[],w:[],d:[],shopping:['3 tomatoes@Produce','2 pizzas@Frozen'],counter:['1 cola@Drinks']};
 app=boot();o=await app.open('A',combined,'Film A + Film B');assert.deepEqual(o.inputs.map(i=>i.dataset.k),['3 tomatoes','2 pizzas','1 cola']);assert.match(o.html,/Film A \+ Film B/);o.change('3 tomatoes',true);await o.click('share');assert.doesNotMatch(app.sent[0],/3 tomatoes|1 loaf bread|1 box popcorn/);assert.match(app.sent[0],/2 pizzas/);assert.match(app.sent[0],/1 cola/);
 other=await app.open('A');assert.match(other.progress,/0 of 3/,'Double-feature session ticks do not leak into single-film context');o=await app.open('A',combined,'Film A + Film B');assert.match(o.progress,/1 of 3/);
 app=boot({id:'A',double:'B',ticks:{'2 apples':true,'3 tomatoes':true}});o=await app.open('A');assert.match(o.progress,/1 of 3/,'Hidden double-feature ticks do not inflate single-film progress');await o.click('reset');assert.equal(app.run('week.ticks["2 apples"]'),undefined);assert.equal(app.run('week.ticks["3 tomatoes"]'),true,'Single-film reset must preserve shopping for the second film');o=await app.open('A',combined,'Film A + Film B');assert.match(o.progress,/1 of 3/,'Second-film shopping remains checked after single-film reset');await o.click('reset');assert.equal(app.run('week.ticks["3 tomatoes"]'),undefined,'Double-list reset clears its visible items');
 app=boot({id:'A',double:'B',ticks:{'3 tomatoes':true}});o=await app.open('A',combined,'Film A + Film B');assert.match(o.progress,/1 of 3/);o.change('2 pizzas',true);assert.equal(app.saved[0].double,'B','Double feature stays locked');
 app=boot();o=await app.open('A',{s:[],m:[],w:[],d:[],shopping:[]},'Empty');assert.equal(o.width,'0%');assert.match(o.progress,/0 of 0/);await o.click('share');assert.equal(app.sent.length,0);assert.match(o.message,/empty/);
 // The memory cache is visit-local, not persisted into another boot.
 app=boot();o=await app.open();assert.equal(o.inputs.some(i=>i.checked),false);
 console.log('PASS: unlocked visit-local ticks, locked persistence, progress, remaining-only copy/share, all-checked, reset, stale keys, counter extras, double-feature isolation and empty lists.');
})().catch(err=>{console.error(err);process.exitCode=1;});
