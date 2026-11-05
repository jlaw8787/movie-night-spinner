// Date/state regression: run the actual app section in separate local timezones.
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
if(!process.argv.includes('--zone')){
  for(const TZ of ['Australia/Brisbane','America/New_York','UTC']){
    const r=require('node:child_process').spawnSync(process.execPath,[__filename,'--zone'],{env:{...process.env,TZ},encoding:'utf8'});
    if(r.status!==0){process.stderr.write(r.stdout+r.stderr);process.exit(r.status||1)}
    process.stdout.write(r.stdout);
  }
  process.exit(0);
}
const source=fs.readFileSync(process.env.WEEK_TEST_SOURCE||path.join(__dirname,'../app.js'),'utf8');
const section=source.slice(source.indexOf('/* this week\'s film:'),source.indexOf('function listText('));
const remote=source.slice(source.indexOf('function applyRemote('),source.indexOf('function queueSync('));
function boot(stored,initial=[2026,9,19,12,0],blocked=false){
  let now=new Date(...initial).getTime(),writes=0;
  class Clock extends Date{constructor(...a){super(...(a.length?a:[now]))}static now(){return now}}
  const elements={},storage={};if(stored!==undefined)storage['mns-week']=typeof stored==='string'?stored:JSON.stringify(stored);
  const $=id=>elements[id]||=( {innerHTML:'',textContent:'',hidden:true,listeners:{},addEventListener(k,f){this.listeners[k]=f},scrollIntoView(){}} );
  const context=vm.createContext({Date:Clock,console,$,ESC:String,setTimeout:()=>1,clearTimeout(){},
    FILMS:[{id:'film',title:'First',year:1988},{id:'other',title:'Second',year:1989}],
    localStorage:{getItem:k=>storage[k]??null,setItem(k,v){if(blocked)throw Error('blocked');storage[k]=v;writes++},removeItem(k){delete storage[k]}},
    queueSync(){},updateWatchButton(){},document:{},setKidsUI(){},renderHist(){},setList(){},renderShop(){}});
  vm.runInContext(`let member={pin:'1234',no:'123456'},watched=new Set(),hist=[],counter={},kidsMode=false,spinning=false;`+section+remote,context);
  const run=s=>vm.runInContext(s,context),state=()=>JSON.parse(run('JSON.stringify(week)'));
  return {run,state,storage,$,writes:()=>writes,now:(...a)=>{now=new Date(...a).getTime()}};
}
const legacy={id:'film',double:'other',day:5,time:'19:30',ticks:{milk:true}};
let a=boot(legacy);
assert.equal(a.state().date,'2026-10-23');assert.equal(a.state().double,'other');assert.equal(a.state().ticks.milk,true);
assert.equal(a.writes(),1,'Legacy date is persisted immediately');
a.now(2026,9,26,12);assert.equal(a.run('cookDate()[1]'),-3);a.run('renderWeek()');
assert.match(a.$('weekPanel').innerHTML,/23 Oct · <b>3 days ago/);
assert.match(a.$('weekCount').innerHTML,/Scheduled showtime has passed/);
assert.equal(a.state().date,'2026-10-23','Rendering never rolls a past plan into the next week');
a=boot(JSON.parse(a.storage['mns-week']),[2026,10,10,12]);
assert.equal(a.state().date,'2026-10-23');assert.equal(a.writes(),0,'Reloading does not migrate again');
a.run('renderWeek()');a.$('weekDay').listeners.change({target:{value:'0'}});
assert.equal(a.state().date,'2026-11-15');assert.equal(a.state().day,0);assert.equal(a.state().ticks.milk,true);
a.run('setWeek(FILMS[0])');assert.equal(a.state().date,'2026-11-15');assert.deepEqual(a.state().ticks,{});
assert.equal(a.state().double,undefined,'New single-film plan drops the old double feature');
a.run('week=newWeekPlan("film","other");saveWeek()');assert.equal(a.state().double,'other');assert.equal(a.state().time,'19:30');
// New plans choose tonight before showtime, and next week after it; existing plans never move.
a=boot({...legacy,date:'2026-10-16'},[2026,9,23,18]);a.run('setWeek(FILMS[0])');assert.equal(a.state().date,'2026-10-23');
a.now(2026,9,23,20);a.run('setWeek(FILMS[0])');assert.equal(a.state().date,'2026-10-30');
a.run('week.date="2026-10-23";renderWeek()');a.$('weekTime').listeners.change({target:{value:'20:30'}});
assert.equal(a.state().date,'2026-10-23','Time edits keep the chosen calendar night');
a.now(2026,9,23,20,0);a.run('tickShowtime()');assert.match(a.$('weekCount').innerHTML,/Showtime in 30 min/);
assert.match(a.$('weekCount').innerHTML,/Check each recipe.*make-ahead/);
assert.doesNotMatch(a.$('weekCount').innerHTML,/Get cooking|Start cooking|wrap/);
a.now(2026,9,23,20,29,50);a.run('tickShowtime()');assert.match(a.$('weekCount').innerHTML,/Showtime in 1 min/);
a.now(2026,9,23,20,30);a.run('tickShowtime()');assert.match(a.$('weekCount').innerHTML,/^Showtime\./);
a.now(2026,9,23,20,31);a.run('tickShowtime()');assert.match(a.$('weekCount').innerHTML,/has passed/);
// Calendar differences cross both US DST transitions without 23/25-hour arithmetic errors.
for(const [today,date] of [[[2026,2,6,23],'2026-03-08'],[[2026,9,30,23],'2026-11-01']]){
  a=boot({...legacy,day:0,date},today);assert.equal(a.run('cookDate()[1]'),2);assert.equal(a.run('weekDateKey(cookDate()[0])'),date);
}
// Import a legacy plan once and retain its anchor on repeated legacy pulls.
a=boot({...legacy,date:'2026-10-16'},[2026,9,19,12]);
a.run(`applyRemote({member:{no:'123456'},week:${JSON.stringify(legacy)}})`);
assert.equal(a.state().date,'2026-10-16');assert.equal(JSON.parse(a.storage['mns-week']).date,'2026-10-16');
a.run('week=null');a.run(`applyRemote({member:{no:'123456'},week:${JSON.stringify(legacy)}})`);assert.equal(a.state().date,'2026-10-23');
a.now(2026,10,9,12);a.run(`applyRemote({member:{no:'123456'},week:${JSON.stringify(legacy)}})`);assert.equal(a.state().date,'2026-10-23');
a.run(`applyRemote({member:{no:'123456'},week:${JSON.stringify({...legacy,date:'2026-11-13'})}})`);assert.equal(a.state().date,'2026-11-13','An explicit remote date wins');
// Absent fields from old backups preserve local state; explicit null synchronises clearing.
a.run('applyRemote({member:{no:"123456"}})');assert.equal(a.state().date,'2026-11-13');
assert.equal(JSON.parse(a.storage['mns-week']).date,'2026-11-13');
a.run('applyRemote({member:{no:"123456"},week:null})');assert.equal(a.state(),null);
assert.equal(a.storage['mns-week'],undefined,'A remote clear removes the persisted plan as well');
a=boot({...legacy,time:1900,ticks:null});assert.equal(a.state().time,'19:00');assert.deepEqual(a.state().ticks,{});
a.run(`applyRemote({member:{no:'123456'},week:${JSON.stringify({...legacy,time:1930,ticks:null})}})`);
assert.equal(a.state().time,'19:00');assert.deepEqual(a.state().ticks,{});
a=boot(legacy,[2026,9,19,12],true);assert.equal(a.state().date,'2026-10-23','Blocked storage does not discard the in-memory plan');
for(const invalid of ['{broken','[]','false','null','{}'])assert.equal(boot(invalid).state(),null);
a=boot({...legacy,date:'2026-02-30'});assert.equal(a.state().date,'2026-10-23','Impossible calendar dates cannot poison countdowns');
assert.doesNotMatch(section,/prepMins|cookAt|Get cooking now|Start cooking at/);
assert.match(source,/if\(k==="lock"\)\{week=newWeekPlan\(a.id,b.id\)/,'Double-feature lock uses the date-owning plan path');
// Review 16: any showtime of the day in 15-minute steps, 7pm by default, and the strip, countdown and table kit follow it.
a=boot(undefined,[2026,10,6,9]);
assert.equal(a.run('SHOWTIMES.length'),96);assert.equal(a.run('SHOWTIMES[0]'),'00:00');assert.equal(a.run('SHOWTIMES[95]'),'23:45');
for(const ok of ['00:00','06:15','12:30','19:45','23:45'])assert.equal(a.run(`weekTime(${JSON.stringify(ok)})`),ok);
for(const bad of ['19:10','24:00','7:00','19:00:00','7pm',1900,null])assert.equal(a.run(`weekTime(${JSON.stringify(bad)})`),'19:00',`${bad} falls back to 7pm`);
assert.equal(a.run('clock("00:15")'),'12:15am');assert.equal(a.run('clock("12:00")'),'12pm');assert.equal(a.run('clock("21:45")'),'9:45pm');
a.run('setWeek(FILMS[0])');assert.equal(a.state().time,'19:00','A new plan starts at 7pm');assert.equal(a.state().date,'2026-11-07');
a.run('renderWeek()');{const h=a.$('weekPanel').innerHTML;
  assert.equal((h.slice(h.indexOf('id="weekTime"')).match(/<option /g)||[]).length,96,'The showtime picker offers all 96 times');
  assert.match(h,/<option value="19:00" selected>7pm<\/option>/);assert.match(h,/<optgroup label="Morning">/);assert.match(h,/<option value="06:45">6:45am<\/option>/)}
a.$('weekTime').listeners.change({target:{value:'21:45'}});assert.equal(a.state().time,'21:45');assert.equal(a.state().date,'2026-11-07');
assert.match(a.$('feature').innerHTML,/Tomorrow 7 Nov, 9:45pm/,'The strip shows the new time at once');
a.now(2026,10,7,21,0);a.run('tickShowtime()');assert.match(a.$('featCount').textContent,/in 45 min/);
a.now(2026,10,7,21,45);a.run('tickShowtime()');assert.match(a.$('weekCount').innerHTML,/^Showtime\./);
a.$('weekTime').listeners.change({target:{value:'19:10'}});assert.equal(a.state().time,'19:00','An off-grid value from a tampered page falls back to 7pm');
// A morning matinee: locking in at 10am on a Saturday with a 9am showtime moves to next Saturday; a 2:15pm one stays today.
a=boot(undefined,[2026,10,7,10]);a.run('week={id:"film",day:6,time:"09:00",ticks:{}};week=newWeekPlan("film")');assert.equal(a.state().date,'2026-11-14');
a.run('week.time="14:15";week.date=nextWeekDate(week.day,week.time)');assert.equal(a.state().date,'2026-11-07');
// Saved plans and synced plans keep a quarter-hour time; the old half-hour grid still loads.
a=boot({...legacy,time:'06:15'});assert.equal(a.state().time,'06:15');a=boot({...legacy,time:'17:30'});assert.equal(a.state().time,'17:30');
// The table kit's door time reads the plan's time.
assert.match(source,/kitTime\(week\.time\)/);
console.log(`PASS weekly plans: persistent calendar date, legacy/sync migration, explicit rescheduling, recipe guidance, any showtime in 15-minute steps and DST (${process.env.TZ}).`);
