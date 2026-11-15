const {chromium}=require(require.resolve('playwright',{paths:[require('path').resolve(__dirname,'..')]}));
const {spawn}=require('child_process');
const REPO=require('path').resolve(__dirname,'..'),PORT=4199,O='http://127.0.0.1:'+PORT;
const server=spawn('python3',['-m','http.server',PORT,'--bind','127.0.0.1'],{cwd:REPO,stdio:'ignore'});
process.on('exit',()=>server.kill());
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const ok=(c,m)=>{if(!c)throw Error('FAIL: '+m);console.log('PASS '+m)};
(async()=>{
  await sleep(1200);
  const b=await chromium.launch();const ctx=await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2});
  await ctx.addInitScript(()=>{try{if(!localStorage.getItem('mns-welcome'))localStorage.setItem('mns-welcome','1')}catch(e){}});const page=await ctx.newPage();const errs=[];page.on('pageerror',e=>errs.push(e.message));
  const calls=[];let saved=null;
  const fake=(sub)=>{const h=Buffer.from('{"alg":"none"}').toString('base64url'),p=Buffer.from(JSON.stringify({sub,email:'josh@example.com',exp:Math.floor(Date.now()/1000)+3600})).toString('base64url');return h+'.'+p+'.x'};
  await ctx.route(/supabase\.co\/(auth|rest)\//,async r=>{const u=r.request().url();calls.push(u.replace(/^.*supabase\.co/,''));
    const j=x=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(x)});
    if(u.includes('/auth/v1/otp'))return j({});
    if(u.includes('/auth/v1/verify'))return j({access_token:fake('u1'),refresh_token:'r1',expires_in:3600,user:{id:'u1',email:'josh@example.com'}});
    if(u.includes('/auth/v1/logout'))return r.fulfill({status:204,headers:{'access-control-allow-origin':'*'}});
    if(u.includes('/rpc/member_load'))return j(saved?{status:'ok',no:saved.no,data:saved.data}:{status:'new'});
    if(u.includes('/rpc/member_save')){const a=JSON.parse(r.request().postData());saved={no:saved?saved.no:'424242',data:a.p_data};return j({status:'ok',no:saved.no})}
    if(u.includes('/rpc/member_delete'))return j({status:'deleted'});
    return r.continue()});
  await ctx.route(/image\.tmdb|goatcounter|zgo\.at|youtube/,r=>r.abort());
  await page.goto(O+'/index.html#shop');await page.waitForSelector('#memberCard .mc',{timeout:30000});
  ok(await page.locator('#memberCard .mc.guest .mc-guest').isVisible(),'guest pass shows on the card for a new visitor');
  await page.evaluate(()=>{localStorage.setItem('mns-watched',JSON.stringify([FILMS[0].id]));localStorage.setItem('rd-solo',JSON.stringify({seen:[FILMS[1].id],keep:[FILMS[2].id]}))});
  await page.reload();await page.waitForSelector('#memberCard .mc');
  await page.locator('#memberCard').scrollIntoViewIfNeeded();
  await page.locator('#memberCard').screenshot({path:'/tmp/m-guest.png'});
  await page.click('[data-sync="ajoin"]');await page.waitForSelector('.joinbox');
  await page.screenshot({path:'/tmp/m-join.png'});
  await page.fill('#jEmail','Josh@Example.com');await page.click('.joinbox .go');
  ok(/18 or over/.test(await page.textContent('#jErr')),'needs the 18+ tick first');
  await page.check('#j18');await page.click('.joinbox .go');await page.waitForSelector('#jCode');
  await page.screenshot({path:'/tmp/m-code.png'});
  await page.fill('#jCode','12345');await page.click('.joinbox .go');ok(/code/.test(await page.textContent('#jErr')),'short code rejected');
  await page.fill('#jCode','123456');await page.click('.joinbox .go');
  await page.waitForSelector('.joinbox',{state:'detached',timeout:10000});await sleep(500);
  ok(!(await page.locator('#memberCard .mc.guest').count()),'card flips to member card after sign-in');
  ok(saved&&saved.data.watched.includes(await page.evaluate(()=>FILMS[0].id)),'guest watched list carried into the account');
  ok(saved.data.solo&&saved.data.solo.keep.length===1,'Match night shortlist carried into the account');
  ok(/424 242/.test(await page.textContent('#memberCard .mc-no')),'member number from the account shows');
  ok(/Signed in as josh@example.com/.test(await page.textContent('#syncNote')),'signed-in note shows the email');
  await page.locator('#memberCard').screenshot({path:'/tmp/m-member.png'});
  /* reload keeps the session */
  await page.reload();await page.waitForSelector('#memberCard .mc');await sleep(800);
  ok(!(await page.locator('#memberCard .mc.guest').count()),'still signed in after reload');
  /* sign out wipes to guest */
  await page.click('[data-sync="aout"]');ok((await page.textContent('[data-sync="aout"]')).includes('Tap again'),'sign out asks twice');
  await Promise.all([page.waitForNavigation({timeout:15000}).catch(()=>{}),page.click('[data-sync="aout"]')]);
  await page.waitForSelector('#memberCard .mc',{timeout:30000});await sleep(500);
  ok(await page.locator('#memberCard .mc.guest').count()===1,'back to a guest pass after sign out');
  ok(await page.evaluate(()=>!localStorage.getItem('mns-watched')&&!localStorage.getItem('rd-solo')&&!localStorage.getItem('rd-auth')),'device wiped on sign out');
  /* sign in again: the account card comes back down */
  await page.click('[data-sync="ajoin"]');await page.check('#j18');await page.fill('#jEmail','josh@example.com');await page.click('.joinbox .go');await page.waitForSelector('#jCode');await page.fill('#jCode','123456');await page.click('.joinbox .go');await page.waitForSelector('.joinbox',{state:'detached'});await sleep(500);
  ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('mns-watched')||'[]').includes(FILMS[0].id)),'account card restores picks on a fresh device');
  /* delete */
  await page.click('[data-sync="adel"]');await Promise.all([page.waitForNavigation({timeout:15000}).catch(()=>{}),page.click('[data-sync="adel"]')]);
  await page.waitForSelector('#memberCard .mc');await sleep(400);
  ok(calls.some(c=>c.includes('member_delete'))&&await page.locator('#memberCard .mc.guest').count()===1,'delete account calls member_delete and goes back to guest');
  /* Google return */
  const tok=fake('u2');await page.goto('about:blank');await page.goto(O+'/index.html#access_token='+tok+'&refresh_token=r2&expires_in=3600&token_type=bearer');
  await page.waitForSelector('#memberCard .mc');await sleep(1200);
  ok(!(await page.locator('#memberCard .mc.guest').count())&&!(await page.evaluate(()=>location.hash.includes('access_token'))),'Google return signs in and cleans the address');
  ok(errs.length===0,'no page errors '+errs.join(' | '));
  await b.close();process.exit(0);
})().catch(e=>{console.error(e.message);process.exit(1)});
