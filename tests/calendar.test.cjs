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
const at=(...x)=>new Date(...x);
function unescNotes(ics){const u=ics.replace(/\r\n /g,'');const l=u.split('\r\n').find(x=>x.startsWith('DESCRIPTION:'));return l.slice(12).replace(/\\n/g,'\n').replace(/\\([,;\\])/g,'$1')}const hm=d=>`${d.getHours()}:${String(d.getMinutes()).padStart(2,'0')}`;const ymd=d=>`${d.getFullYear()}-${d.getMonth()+1}-${d.getDate()}`;

// Durations before the event.
for(const [m,want] of [[0,'-PT0M'],[5,'-PT5M'],[60,'-PT1H'],[110,'-PT1H50M'],[1440,'-P1D'],[1500,'-P1DT1H'],[1505,'-P1DT1H5M']])assert.equal(calBefore(m),want,`${m} minutes`);
assert.equal(calBefore(1441),'-P1DT1M');

// Start cooking: showtime less the longest thing left to do on the night (hands-on and cooking, plus a wait under 2 hours), on a 5-minute mark.
const show=at(2026,10,7,19,0);
let p=calPlan(show,[{n:'Lamb shoulder',active:110,wait:0},{n:'Salad',active:20,wait:30},{n:'Pavlova',active:40,wait:100}]);
assert.equal(p.dish,'Pavlova');assert.equal(p.lead,140);assert.equal(hm(p.start),'16:40');assert.equal(p.before,null,'No day-before reminder without a long wait');assert.equal(p.early,null);
p=calPlan(show,[{n:'Stew',active:107,wait:0}]);assert.equal(hm(p.start),'17:10','17:13 rounds down to 17:10');
p=calPlan(show,[]);assert.equal(p.lead,0);assert.equal(hm(p.start),'18:00','No timed dish: an hour before');
p=calPlan(at(2026,10,7,19,45),[{n:'Wings',active:50,wait:0}]);assert.equal(hm(p.start),'18:55','A quarter-hour showtime works the same');

// Review 16: a wait of 2 hours or more never pushes the start time. John Wick 2's tiramisu sets for 8 hours: it is made earlier that day
// (from 10:30am, the latest that still fits), and start cooking is set by the supplì, not the tiramisu.
p=calPlan(show,[{n:'Tiramisu',active:30,wait:480,night:0,words:'to set'},{n:'Supplì',active:90,wait:0,night:90}]);
assert.equal(p.dish,'Supplì');assert.equal(hm(p.start),'17:30');assert.equal(p.before,null);
assert.ok(p.early);assert.equal(ymd(p.early.at),'2026-11-7');assert.equal(hm(p.early.at),'10:30');assert.deepEqual(p.early.dishes.map(d=>d.n),['Tiramisu']);
// Chef: El Jefe Cubano marinates overnight, then roasts 4 hours. The roast (what is left on the night) sets the start, the marinade goes the night before.
p=calPlan(show,[{n:'El Jefe Cubano',active:275,wait:480,night:265,over:true,words:'to marinate'},{n:'Mojo',active:15,wait:0,night:15}]);
assert.equal(p.dish,'El Jefe Cubano');assert.equal(hm(p.start),'14:35','start cooking in the afternoon, not 6:25am');assert.equal(p.early,null);
assert.equal(ymd(p.before.at),'2026-11-6');assert.equal(hm(p.before.at),'18:00');
// A 3-hour chill with no overnight in the recipe fits the afternoon; one that would have to start before 8am goes the night before.
p=calPlan(show,[{n:'Jelly',active:20,wait:180,night:0},{n:'Pie',active:60,wait:0,night:60}]);assert.equal(hm(p.early.at),'15:30','3:40pm rounds down to 3:30pm');assert.equal(p.before,null);
p=calPlan(show,[{n:'Cuban pork',active:260,wait:490,night:250}]);assert.equal(p.early,null,'6:30am start moves to the night before');assert.equal(ymd(p.before.at),'2026-11-6');assert.equal(hm(p.before.at),'18:00');
// A long wait that still fits after the start time needs no reminder of its own.
p=calPlan(show,[{n:'Soak',active:10,wait:130,night:0},{n:'Roast',active:200,wait:0,night:200}]);assert.equal(p.early,null);assert.equal(p.before,null);assert.equal(hm(p.start),'15:40');
// With no night given, a long wait counts only its hands-on time.
assert.equal(hm(calPlan(show,[{n:'Brine',active:40,wait:300}]).start),'18:20');

// Ahead of the night: a 12-hour wait would start at 6:30am on the night, so it moves to 6pm the evening before; its night share alone counts on the night.
p=calPlan(show,[{n:'Sorbet',active:30,wait:720,night:0,words:'in the freezer'},{n:'Ribs',active:90,wait:0}]);
assert.equal(p.dish,'Ribs');assert.equal(hm(p.start),'17:30');assert.ok(p.before);assert.equal(ymd(p.before.at),'2026-11-6');assert.equal(hm(p.before.at),'18:00');
assert.deepEqual(p.before.dishes.map(d=>d.n),['Sorbet']);
// A 33-hour wait starts by 10am the day before; a 40-hour one by 3am, which moves to 6pm the evening before that; two days' wait lands two days out at 6pm.
assert.equal(hm(calPlan(show,[{n:'Brine',active:0,wait:1980}]).before.at),'10:00');
p=calPlan(show,[{n:'Cure',active:0,wait:2400}]);assert.equal(ymd(p.before.at),'2026-11-5');assert.equal(hm(p.before.at),'18:00');
p=calPlan(show,[{n:'Kimchi',active:20,wait:2880}]);assert.equal(ymd(p.before.at),'2026-11-5');assert.equal(hm(p.before.at),'18:00','Thu 6:40pm moves to 6pm');
// Psycho: a week-long pickle lands on the right day, 6pm a week before, and says so in days.
p=calPlan(show,[{n:"Mother's pickled onions",active:30,wait:10080,night:0,words:'to soak'},{n:'Meringues',active:117,wait:0}]);
assert.equal(ymd(p.before.at),'2026-10-31');assert.equal(hm(p.before.at),'18:00');
{const n=unescNotes(calICS({title:'Psycho',show,plan:p,url:'u',uid:'x@y',now:at(2026,10,1)}));
  assert.match(n,/A week before, from Sat 31 Oct 6pm: Mother's pickled onions, 7 days to soak\./);assert.doesNotMatch(n,/168 hr|The day before/)}
// review 19: Rocky IV moved a week on: pickles four days ahead and a vodka mule frozen the night before keep two reminders, each on its own day.
p=calPlan(show,[{n:'Drago pickles',active:20,wait:5760,night:0,words:'to pickle'},{n:'Vodka mule',active:5,wait:720,night:5,over:true},{n:'Steak',active:40,wait:0}]);
assert.deepEqual(p.before.dishes.map(d=>d.n),['Drago pickles']);assert.ok(p.before2,'second prep-ahead reminder');assert.deepEqual(p.before2.dishes.map(d=>d.n),['Vodka mule']);
assert.equal(ymd(p.before2.at),'2026-11-6');assert.equal(hm(p.before2.at),'18:00');assert.notEqual(ymd(p.before.at),ymd(p.before2.at));
{const ics=calICS({title:'Rocky IV',show,plan:p,url:'u',uid:'x@y',now:at(2026,10,1)}),n=unescNotes(ics);assert.equal((ics.match(/BEGIN:VALARM/g)||[]).length,3,'start cooking and two prep-ahead alarms');
  assert.match(n,/The night before, from Fri 6 Nov 6pm: Vodka mule/);assert.match(n,/days before, from .*: Drago pickles/)}
assert.equal(calGoogle({title:'Rocky IV',show,plan:p,url:'u'}).length,4);
// review 19: The Godfather's dish has a comma of its own, so its time goes in brackets.
{const q=calPlan(show,[{n:'Rigatoni, Sunday gravy',active:120,wait:0}]),t=unescNotes(calICS({title:'The Godfather',show,plan:q,url:'u',uid:'x@y',now:at(2026,10,1)}));
  assert.match(t,/longest on the night: Rigatoni, Sunday gravy \(2 hr\)/);assert.doesNotMatch(t,/gravy, 2 hr/)}
// Two make-aheads due the same day stay one reminder.
p=calPlan(show,[{n:'Brine',active:0,wait:1980},{n:'Jelly',active:10,wait:720,over:true}]);assert.equal(p.before2,null);assert.equal(p.before.dishes.length,2);
{const calAhead=fnOf('calAhead');const d=(y,m,dd,h)=>calAhead(show,at(y,m,dd,h));
  assert.equal(d(2026,10,6,18),'The night before');assert.equal(d(2026,10,6,10),'The day before');assert.equal(d(2026,10,5,18),'Two days before');
  assert.equal(d(2026,10,3,18),'Four days before');assert.equal(d(2026,9,31,18),'A week before')}
assert.equal(fnOf('calDur')(2880),'2 days');assert.equal(fnOf('calDur')(2879),'47 hr 59 min');assert.equal(fnOf('calDur')(720),'12 hr');

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
assert.match(notes,/^Showtime 7pm\. Start cooking at 5:25pm \(longest on the night: Pork buns, 1 hr 35 min\)\./);
assert.match(notes,/The night before, from Fri 6 Nov 6pm: Red bean soup; sweet, 12 hr to soak\./);
assert.ok(notes.endsWith('Menu and Prep sheet: '+url),'Menu link in the notes');assert.equal(prop(ics,'URL')[0],url);
// Two reminders, start cooking first (Outlook keeps only the first), both relative to the start.
const trig=prop(ics,'TRIGGER');assert.deepEqual(trig,['-PT1H35M','-P1DT1H']);
assert.match(ics,/TRIGGER;RELATED=START:-PT1H35M/);assert.equal((ics.match(/BEGIN:VALARM/g)||[]).length,2);
const alarms=prop(ics,'DESCRIPTION').slice(1).map(unesc);
assert.equal(alarms[0],'Start cooking for Crouching Tiger, Hidden Dragon. Showtime is 7pm. Longest on the night: Pork buns, 1 hr 35 min. Made ahead: Red bean soup; sweet.');
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

// Three reminders when a dish is made ahead that day and another the night before: start cooking first, then today, then the night before.
{const q=calPlan(show,[{n:'Tiramisu',active:30,wait:480,night:0,words:'to set'},{n:'Falafel',active:20,wait:720,night:20,words:'to soak'},{n:'Supplì',active:90,wait:0}]);
  const t=calICS({title:'Rome',show,plan:q,url,uid:'x@y',now});assert.deepEqual(prop(t,'TRIGGER'),['-PT1H30M','-PT8H30M','-P1DT1H']);
  const al=prop(t,'DESCRIPTION').slice(1).map(unesc);assert.equal(al[1],'Make ahead today for Rome: Tiramisu, 8 hr to set.');
  assert.match(unesc(prop(t,'DESCRIPTION')[0]),/Earlier that day, from 10:30am: Tiramisu, 8 hr to set\.\nThe night before, from Fri 6 Nov 6pm: Falafel, 12 hr to soak\./);
  assert.deepEqual([...calGoogle({title:'Rome',show,plan:q,url,uid:'x@y',now})].map(x=>x[0]),['the night','start cooking','make ahead today','prep ahead'])}

// Review 17: a make-ahead time already gone. Psycho locked in on Friday afternoon for Saturday: the week-long pickle cannot be done,
// so it is listed as too late with the first week it fits (Sat 14 Nov) and gets no alarm or Google link. A wait that still fits starts now.
{const now=at(2026,10,6,14,30);
  const q=calPlan(show,[{n:"Mother's pickled onions",active:30,wait:10080,night:0,words:'to soak'},{n:'Meringues',active:117,wait:0}],now);
  assert.equal(q.before,null);assert.equal(q.late.dishes.length,1);assert.equal(ymd(q.late.next),'2026-11-14');
  const t=calICS({title:'Psycho',show,plan:q,url,uid:'x@y',now});assert.equal(prop(t,'TRIGGER').length,1,'start cooking only');
  assert.match(unescNotes(t),/Too late to make ahead for this night: Mother's pickled onions, 7 days to soak\. Buy it ready-made, or move movie night to Sat 14 Nov\./);
  assert.deepEqual([...calGoogle({title:'Psycho',show,plan:q,url,uid:'x@y',now})].map(x=>x[0]),['the night','start cooking']);
  /* review 18: a too-late dish is bought ready-made, so its time on the night does not set start cooking */
  {const z=calPlan(show,[{n:'Pickles',active:200,wait:2000,night:200},{n:'Burgers',active:40,wait:0}],now);assert.equal(z.late.dishes[0].n,'Pickles');assert.equal(z.dish,'Burgers');assert.equal(z.lead,40)}
  const r=calPlan(show,[{n:'Gravlax',active:20,wait:1680,night:0,words:'to cure'},{n:'Pie',active:60,wait:0}],at(2026,10,6,14,35));
  assert.equal(r.late,null);assert.ok(r.before.now,'a cure that must start by 2:40pm Friday, planned at 2:35pm: start now');assert.equal(hm(r.before.at),'14:35');
  assert.equal(hm(calPlan(show,[{n:'Gravlax',active:20,wait:1440,night:0}],now).before.at),'18:00','6pm Friday has not gone yet');
  assert.equal(prop(calICS({title:'X',show,plan:r,url,uid:'x@y',now}),'TRIGGER').length,1,'no alarm for a start that is now');
  /* start cooking already gone on the night itself */
  const s=calPlan(show,[{n:'Roast',active:150,wait:0}],at(2026,10,7,17,0));assert.ok(s.startNow);
  assert.equal(prop(calICS({title:'X',show,plan:s,url,uid:'x@y',now}),'TRIGGER').length,0)}

// Review 17: a make-ahead within 45 minutes of start cooking folds into it, naming that dish first (Die Hard 2 had 4:15pm then 4:30pm).
{const q=calPlan(show,[{n:'Pretzel dough',active:30,wait:135,night:15},{n:'Wings',active:150,wait:0,night:150}]);
  assert.equal(q.early,null);assert.equal(hm(q.start),'16:15');assert.equal(q.first,'Pretzel dough');
  const al=prop(calICS({title:'Die Hard 2',show,plan:q,url,uid:'x@y',now}),'DESCRIPTION').slice(1).map(unesc);
  assert.equal(al.length,1);assert.match(al[0],/^Start cooking for Die Hard 2 with pretzel dough\. Showtime is 7pm\. Longest on the night: Wings, 2 hr 30 min\./)}

// The section never uses en or em dashes in what it writes.
assert.ok(!/[–—]/.test(source.slice(a,b)));
console.log(`PASS calendar: start-cooking and day-before reminder times, .ics format and folding, Google links (${process.env.TZ}).`);
