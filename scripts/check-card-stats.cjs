/* My card stat pages (friends.js statPage): every tile on the stats board opens its own page and Back returns.
   One signed-in phone against a fake Supabase, with a member card seeded with rentals, stars, seen films, an
   overdue tape and a duel history. Checks each page's content, Return on a late tape, the seen-film search,
   opening a film's menu and no page errors.
   Run: node scripts/check-card-stats.cjs   (screens go to /tmp/cs-*.png) */
const { chromium } = require(require.resolve('playwright', { paths: [require('path').resolve(__dirname, '..'), require('child_process').execSync('npm root -g').toString().trim()] }));
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const REPO = path.resolve(__dirname, '..'), PORT = 4197, O = 'http://127.0.0.1:' + PORT;
const server = spawn('python3', ['-m', 'http.server', PORT, '--bind', '127.0.0.1'], { cwd: REPO, stdio: 'ignore' });
process.on('exit', () => server.kill());
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ok = (c, m) => { if (!c) throw Error('FAIL: ' + m); console.log('PASS ' + m) };
const films = JSON.parse(fs.readFileSync(path.join(REPO, 'data/films.json'), 'utf8')).map(f => `${f.title} (${f.year})`);
const F = films.slice(0, 12), now = Date.now(), DAY = 864e5;
const MEMBER = { no: '139282', name: 'Josh', since: now - 30 * DAY, rentals: 3, aisles: { Comedy: 2, Horror: 1 },
  stars: { [F[0]]: 5, [F[1]]: 4, [F[2]]: 2 }, out: [{ id: F[5], due: now - 3 * DAY }, { id: F[6], due: now + 2 * DAY }],
  log: [{ id: F[5], at: now - 6 * DAY }, { id: F[6], at: now - DAY }], stamps: {} };
const SEEN = [F[0], F[1], F[2], ...F.slice(7, 12)];
const DUELS = [
  { id: 'd1', state: 'matched', turn: 'done', me: 1, friend: { id: 'u2', name: 'Sam' }, vibe: 'comedy', n: 20, mine: 20, their_n: 20, match: F[3], at: new Date(now - DAY).toISOString() },
  { id: 'd2', state: 'settled', turn: 'done', me: 1, friend: { id: 'u2', name: 'Sam' }, vibe: 'any', n: 20, mine: 20, their_n: 20, match: F[4], at: new Date(now - 2 * DAY).toISOString() },
  { id: 'd3', state: 'open', turn: 'you', me: 2, friend: { id: 'u3', name: 'Mal' }, vibe: 'horror', n: 20, mine: 0, their_n: 20, match: null, at: new Date().toISOString() }];
const RPC = {
  duels_list: () => ({ status: 'ok', duels: DUELS }), quiz_list: () => ({ status: 'ok', quizzes: [] }),
  friends_list: () => ({ status: 'ok', friends: [{ id: 'u2', name: 'Sam', streak: 3 }, { id: 'u3', name: 'Mal', streak: 0 }], incoming: [], outgoing: [] }),
  inbox_unread: () => ({ status: 'ok', unread: 0, turns: 0 }), inbox_list: () => ({ status: 'ok', items: [] }),
  member_load: () => ({ status: 'ok', no: MEMBER.no, data: { v: 1, member: MEMBER, watched: SEEN } }), member_save: () => ({ status: 'ok', no: MEMBER.no }),
  alert_prefs_get: () => ({ status: 'ok', email: true, digest: true, late_fees: true })
};
(async () => {
  for (let i = 0; i < 40; i++) { try { await fetch(O + '/index.html'); break } catch (e) { await sleep(250) } }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const tok = Buffer.from('{"alg":"none"}').toString('base64url') + '.' + Buffer.from(JSON.stringify({ sub: 'u1', exp: Math.floor(now / 1000) + 3600 })).toString('base64url') + '.x';
  await ctx.addInitScript(([t, m, seen]) => { try {
    if (!localStorage.getItem('cs-seeded')) {
      localStorage.setItem('cs-seeded', '1'); localStorage.setItem('mns-welcome', '1');
      localStorage.setItem('rd-auth', JSON.stringify({ access_token: t, refresh_token: 'r1', expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: 'u1', email: 'josh@example.com' } }));
      localStorage.setItem('mns-member', JSON.stringify(m)); localStorage.setItem('mns-watched', JSON.stringify(seen));
    } } catch (e) { } }, [tok, MEMBER, SEEN]);
  await ctx.route(/supabase\.co\/rest\/v1\/rpc\/(\w+)/, r => { const fn = r.request().url().match(/rpc\/(\w+)/)[1]; r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(RPC[fn] ? RPC[fn]() : { status: 'ok' }) }) });
  await ctx.route(/supabase\.co\/auth\//, r => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' }));
  await ctx.route(/image\.tmdb|zgo\.at|goatcounter|youtube/, r => r.abort());
  const p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(e.message));
  await p.goto(O + '/index.html'); await p.waitForSelector('#acctBtn'); await sleep(800);
  const open = async () => { if (!await p.$('dialog.acct[open]')) await p.click('#acctBtn'); await p.waitForSelector('dialog.acct [data-tab="card"]'); await p.click('[data-tab="card"]'); await p.waitForSelector('[data-stat="rentals"]'); await sleep(500) };
  const page = async key => { await p.click(`[data-stat="${key}"]`); await p.waitForSelector('#acctBack'); await sleep(150); return p.textContent('.acct-statpage') };
  const back = async key => { await p.click('#acctBack'); await p.waitForSelector(`[data-stat="${key}"]`); ok(await p.evaluate(k => document.activeElement && document.activeElement.dataset.stat === k, key), `Back returns to the board, focus on ${key}`) };
  /* review 31: at the cinema the card counts films seen on the cinema's tiers, with no rentals, late fees or stamps */
  { await p.click('#acctBtn'); await p.waitForSelector('dialog.acct [data-tab="card"]'); await p.click('[data-tab="card"]'); await p.waitForSelector('[data-stat="seen"]'); await sleep(400);
    const ct = await p.textContent('dialog.acct'); ok(!/rental|late fee/i.test(ct.replace(/card and rentals live inside the store/i, '')) && /films? seen/i.test(ct) && /Matinee member|Gold Class|Front Row Club|Premiere Club/.test(ct), 'cinema card: films seen, cinema tiers, no rentals (review 31)');
    await p.keyboard.press('Escape'); await sleep(300); }
  /* the rest is the Galaxy Video card, opened from inside the store */
  await p.evaluate(() => document.body.classList.add('in-shop'));
  await open();
  ok(await p.$$eval('button.acct-stat', b => b.length) === 8, 'all 8 tiles are buttons');
  await p.screenshot({ path: '/tmp/cs-board.png' });
  const tabs = await p.$eval('#acctTabs', el => { const r = el.getBoundingClientRect(), last = el.lastElementChild.getBoundingClientRect(), cs = getComputedStyle(el); return { fits: last.right <= r.right + 1, scroll: el.scrollWidth > el.clientWidth && /auto|scroll/.test(cs.overflowX) } });
  ok(tabs.fits, 'all five account tabs fit at 390, Settings not clipped (review 30)');

  let t = await page('rentals'); await p.screenshot({ path: '/tmp/cs-rentals.png', fullPage: false });
  ok(await p.$eval('#acctBack', el => parseFloat(getComputedStyle(el).borderTopLeftRadius) > 0), 'stat page stylesheet loaded (Back button is a pill)');
  ok(/3 rentals/.test(t) && t.includes('Out on rental') && t.includes('Recent rentals') && t.includes('Your aisles') && t.includes('Comedy'), 'Rentals: count, out on rental, recent rentals, aisles');
  ok(await p.$$eval('.acct-statpage .acct-bars li', l => l.length) === 2, 'Rentals: a bar per aisle');
  await back('rentals');

  t = await page('seen'); await p.screenshot({ path: '/tmp/cs-seen.png' });
  ok(await p.$eval('#acctList', el => { const r = el.querySelector('.acct-fr'), th = el.querySelector('.acct-th'); return getComputedStyle(r).display === 'flex' && (!th || Math.round(th.getBoundingClientRect().width) === 36) }), 'stat page stylesheet loaded (film rows in a line, poster thumbs 36px wide)');
  ok(await p.$eval('.acct-frs', el => getComputedStyle(el).listStyleType === 'none'), 'stat page lists have no bullet dots');
  ok(t.includes(`${SEEN.length} films seen`), 'Films seen: count');
  ok(await p.$$eval('#acctList .acct-fr', l => l.length) === SEEN.length, 'Films seen: every film listed');
  ok(await p.$$eval('#acctList .acct-stars', l => l.length) === 3, 'Films seen: stars on the rated ones');
  const want = F[9].replace(/ \(\d{4}\)$/, '');
  await p.fill('#acctFind', want.slice(0, 6)); await sleep(100);
  ok(await p.$$eval('#acctList .acct-fr:not([hidden])', (l, w) => l.some(x => x.textContent.includes(w)), want), 'Films seen: search finds a film');
  await back('seen');

  t = await page('top'); await p.screenshot({ path: '/tmp/cs-top.png' });
  ok(t.includes('2 films on 4 or 5 stars, 3 rated'), 'Top shelf: counts');
  ok(await p.$$eval('.acct-statpage .acct-h4', h => h.length) === 3, 'Top shelf: grouped by stars');
  await back('top');

  t = await page('friends'); await p.screenshot({ path: '/tmp/cs-friends.png' });
  ok(t.includes('2 friends') && t.includes('Sam') && t.includes('2 matches on the board') === false && t.includes('1 match on the board'), 'Friends: list with matches together');
  await back('friends');

  t = await page('rate');
  ok(t.includes('Match rate: 50%') && t.includes('Matched on') && t.includes('The wheel picked'), 'Match rate: finished duels listed');
  await back('rate');

  t = await page('streak');
  ok(t.includes('Best streak: 3') && t.indexOf('Sam') < t.indexOf('Mal'), 'Best streak: friends by streak');
  await back('streak');

  t = await page('late'); await p.screenshot({ path: '/tmp/cs-late.png' });
  ok(/Late fees: \$4\.00/.test(t) && t.includes('4 days late'), 'Late fees: overdue tape and fee (3 days and a bit counts as 4)');
  await p.click('[data-return]'); await sleep(300);
  ok((await p.textContent('.acct-statpage')).includes('No late fees'), 'Return clears the fee');
  await back('late');

  await p.click('[data-stat="duels"]'); await p.waitForSelector('#acctNewDuel');
  ok(await p.getAttribute('[data-tab="duels"]', 'aria-selected') === 'true', 'Duels tile opens the Duels board');

  await p.click('[data-tab="card"]'); await p.waitForSelector('[data-stat="seen"]'); await sleep(300);
  await p.click('[data-stat="seen"]'); await p.waitForSelector('[data-film]');
  await p.click('[data-film]'); await sleep(1500);
  ok(!(await p.$('dialog.acct[open]')), 'Menu button closes the panel and opens the film');

  ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await browser.close(); server.kill(); process.exit(0);
})().catch(e => { console.error(e.message || e); server.kill(); process.exit(1) });
