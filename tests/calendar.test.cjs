// Calendar reminder (review 16): the .ics file and its reminder times, run on the app's own code in three time zones.
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
const source=fs.readFileSync(path.join(__dirname,'../app.js'),'utf8');
const a=source.indexOf('/* calendar reminder:'),b=source.indexOf('/* end calendar reminder */');
assert.ok(a>0&&b>a,'calendar section found in app.js');
const ctx=vm.createContext({console});vm.runInContext(source.slice(a,b),ctx);
const run=(fn,...args)=>ctx[fn]?ctx[fn](...args):vm.runInContext(fn,ctx)(...args);
const fnOf=n=>vm.runInContext(n,ctx);
const calPlan=fnOf('calPlan'),calICS=fnOf('calICS'),calGoogle=fnOf('calGoogle'),calBefore=fnOf('calBefore'),calFold=fnOf('calFold');
const at=(...x)=>new Date(...x);const hm=d=>`${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;const ymd=d=>`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

// Durations before the event.
for(const [m,want] of [[0,'-PT0M'],[5,'-PT5M'],[60,'-PT1H'],[110,'-PT1H50M'],[1440,'-P1D'],[1500,'-P1DT1H'],[1505,'-P1DT1H5M']])assert.equal(calBefore(m),want,`${m} minutes`);
assert.equal(calBefore(1441),'-P1DT1M');

// Start cooking: showtime less the longest picked dish (hands-on and cooking, plus a short wait), on a 5-minute mark.
const show=at(2026,10,7,19,0);
let p=calPlan(show,[{n:'Lamb shoulder',active:110,wait:0},{n:'Salad',active:20,wait:30},{n:'Pavlova',active:40,wait:120}]);
assert.equal(p.dish,'Pavlova');assert.equal(p.lead,160);assert.equal(hm(p.start),'16:20');assert.equal(p.before,null,'No day-before reminder without a long wait');
p=calPlan(show,[{n:'Stew',active:107,wait:0}]);assert.equal(hm(p.start),'17:10','17:13 rounds down to 17:10');
p=calPlan(show,[]);assert.equal(p.lead,0);assert.equal(hm(p.start),'18:00','No timed dish: an hour before');
p=calPlan(at(2026,10,7,19,45),[{n:'Wings',active:50,wait:0}]);assert.equal(hm(p.start),'18:55','A quarter-hour showtime works the same');

// The day before: a 12-hour wait would start at 6:30am on the night, so it moves to 6pm the evening before; its hands-on time alone counts on the night.
p=calPlan(show,[{n:'Sorbet',active:30,wait:720,words:'in the freezer'},{n:'Ribs',active:90,wait:0}]);
assert.equal(p.dish,'Ribs');assert.equal(hm(p.start),'17:30');assert.ok(p.before);assert.equal(ymd(p.before.at),'2026-11-6');assert.equal(hm(p.before.at),'18:00');
assert.deepEqual(p.before.dishes.map(d=>d.n),['Sorbet']);
// A 33-hour wait starts by 10am the day before; a 40-hour one by 3am, which moves to 6pm the evening before that; two days' wait lands two days out.
assert.equal(hm(calPlan(show,[{n:'Brine',active:0,wait:1980}]).before.at),'10:00');
p=calPlan(show,[{n:'Cure',active:0,wait:2400}]);assert.equal(ymd(p.before.at),'2026-11-5');assert.equal(hm(p.before.at),'18:00');
p=calPlan(show,[{n:'Kimchi',active:20,wait:2880}]);assert.equal(ymd(p.before.at),'2026-11-5');assert.equal(hm(p.before.at),'18:30','Thu 6:40pm rounds down to 6:30pm');

// The .ics file.
const unfold=t=>t.replace(/\r\n /g,'');
const prop=(t,k)=>{const m=unfold(t).split('\r\n').filter(l=>l.startsWith(k+':')||l.startsWith(k+';'));return m.map(l=>l.slice(l.indexOf(':')+1))};
const unesc=v=>v.replace(/\\n/g,'\n').replace(/\\([,;\\])/g,'$1');
const url='https://movie-night-spinner.netlify.app/?film='+encodeURIComponent('Crouching Tiger, Hidden Dragon (2000)');
p=calPlan(show,[{n:'Pork buns',active:95,wait:0},{n:'Red bean soup; sweet',active:30,wait:720,words:'to soak'}]);
const now=at(2026,10,6,8,0);
let ics=calICS({title:'Crouching Tiger, Hidden Dragon',show,plan:p,url,uid:'crouching-tiger-2026-11-07@movie-night-spinner',now});
assert.ok(ics.endsWith('\r\n'));assert.ok(!/[^\r]\n/.test(ics),'Every line ends in CRLF');
for(const l of ics.split('\r\n'))assert.ok(Buffer.byteLength(l)<=75,`Folded at 75 bytes: ${l}`);
assert.ok(!/[–—]/.test(ics),'No en or em dashes');
for(const k of ['VERSION','PRODID','CALSCALE','METHOD'])assert.equal(prop(ics,k).length,1,k);
assert.equal((ics.match(/BEGIN:VEVENT/g)||[]).length,1);assert.equal((ics.match(/END:VEVENT/g)||[]).length,1);
assert.equal(prop(ics,'DTSTART')[0],show.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''));
if(process.env.TZ==='Australia/Brisbane'){assert.equal(prop(ics,'DTSTART')[0],'20261107T090000Z');assert.equal(prop(ics,'DTEND')[0],'20261107T113000Z')}
assert.equal(prop(ics,'DTSTAMP')[0],now.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''));
assert.equal(prop(ics,'UID')[0],'crouching-tiger-2026-11-07@movie-night-spinner');
assert.equal(unesc(prop(ics,'SUMMARY')[0]),'Movie night: Crouching Tiger, Hidden Dragon');assert.match(prop(ics,'SUMMARY')[0],/Tiger\\, Hidden/);
assert.match(prop(ics,'DESCRIPTION')[0],/Red bean soup\\; sweet/,'Semicolons are escaped');
const notes=unesc(prop(ics,'DESCRIPTION')[0]);
assert.match(notes,/^Showtime 7pm\. Start cooking at 5:25pm \(Pork buns takes longest, 1 hr 35 min\)\./);
assert.match(notes,/The day before, from Fri 6 Nov 6pm: Red bean soup; sweet, 12 hr to soak\./);
assert.ok(notes.endsWith('Menu and Prep sheet: '+url),'Menu link in the notes');assert.equal(prop(ics,'URL')[0],url);
// Two reminders, start cooking first (Outlook keeps only the first), both relative to the start.
const trig=prop(ics,'TRIGGER');assert.deepEqual(trig,['-PT1H35M','-P1DT1H']);
assert.match(ics,/TRIGGER;RELATED=START:-PT1H35M/);assert.equal((ics.match(/BEGIN:VALARM/g)||[]).length,2);
const alarms=prop(ics,'DESCRIPTION').slice(1).map(unesc);
assert.equal(alarms[0],'Start cooking for Crouching Tiger, Hidden Dragon. Showtime is 7pm. Pork buns takes longest, 1 hr 35 min.');
assert.equal(alarms[1],'Prep ahead for Crouching Tiger, Hidden Dragon: Red bean soup; sweet, 12 hr to soak.');
// Each trigger lands on the planned clock time, whatever the time zone does in between.
const dur=s=>{const m=/^-P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?)?$/.exec(s);return ((+m[1]||0)*1440+(+m[2]||0)*60+(+m[3]||0))*6e4};
assert.equal(show-dur(trig[0]),p.start.getTime());assert.equal(show-dur(trig[1]),p.before.at.getTime());
// No long wait: one reminder only.
ics=calICS({title:'Paddington',show,plan:calPlan(show,[{n:'Marmalade sandwiches',active:15,wait:0}]),url,uid:'x@y',now});
assert.equal((ics.match(/BEGIN:VALARM/g)||[]).length,1);assert.deepEqual(prop(ics,'TRIGGER'),['-PT15M']);
// A double feature runs five hours.
ics=calICS({title:'Alien + Aliens',show,plan:calPlan(show,[]),url,uid:'x@y',now,span:300});
assert.equal(new Date(prop(ics,'DTEND')[0].replace(/^(\d{4})(\d\d)(\d\d)T(\d\d)(\d\d)(\d\d)Z$/,'$1-$2-$3T$4:$5:$6Z'))-show,300*6e4);
// Long lines fold on character boundaries, never through a multi-byte letter.
const long='DESCRIPTION:'+'Crème brûlée '.repeat(12);const f=calFold(long);
for(const l of f.split('\r\n'))assert.ok(Buffer.byteLength(l)<=75);assert.equal(f.replace(/\r\n /g,''),long);

// Google links: one per event, the reminders as their own events.
const g=calGoogle({title:'Crouching Tiger, Hidden Dragon',show,plan:p,url,uid:'x@y',now});
assert.deepEqual([...g].map(x=>x[0]),['the night','start cooking','prep ahead']);
for(const [,u] of g){const q=new URL(u);assert.equal(q.hostname,'calendar.google.com');assert.equal(q.searchParams.get('action'),'TEMPLATE');assert.match(q.searchParams.get('dates'),/^\d{8}T\d{6}Z\/\d{8}T\d{6}Z$/)}
assert.equal(new URL(g[1][1]).searchParams.get('text'),'Start cooking: Crouching Tiger, Hidden Dragon');
assert.equal(new URL(g[1][1]).searchParams.get('dates').slice(0,16),p.start.toISOString().replace(/[-:]/g,'').replace(/\.\d{3}/,''));
assert.equal(calGoogle({title:'Paddington',show,plan:calPlan(show,[]),url,uid:'x@y',now}).length,2);

// Across the US clock change (1 Nov 2026), a Sunday night with a day-before dish still lands at 6pm Saturday.
if(process.env.TZ==='America/New_York'){const s2=at(2026,10,1,19,0),q=calPlan(s2,[{n:'Brisket rub',active:20,wait:720}]);
  assert.equal(ymd(q.before.at),'2026-10-31');assert.equal(hm(q.before.at),'18:00');
  const t2=prop(calICS({title:'Halloween',show:s2,plan:q,url,uid:'x@y',now}),'TRIGGER');assert.equal(t2[1],'-P1DT2H','26 real hours across the change');}

// The section never uses en or em dashes in what it writes.
assert.ok(!/[–—]/.test(source.slice(a,b)));
console.log(`PASS calendar: start-cooking and day-before reminder times, .ics format and folding, Google links (${process.env.TZ}).`);
