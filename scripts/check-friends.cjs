/* Phase 2 browser check: two people (two browser contexts) against a fake Supabase that follows the rules in
   supabase/friends.sql. Josh signs in, invites Sam by link, Sam opens it as a guest, signs up and lands on
   Josh's friends list, Josh sends a Dinner Duel, Sam plays it from the inbox and they match on both phones.
   Also checks the panel tabs, a late fee line, settings, the guest panel and that no page errors fire.
   Run: node scripts/check-friends.cjs   (screens go to /tmp/f-*.png) */
const { chromium } = require(require.resolve('playwright', { paths: [require('path').resolve(__dirname, '..')] }));
const { spawn } = require('child_process');
const REPO = require('path').resolve(__dirname, '..'), PORT = 4198, O = 'http://127.0.0.1:' + PORT;
const server = spawn('python3', ['-m', 'http.server', PORT, '--bind', '127.0.0.1'], { cwd: REPO, stdio: 'ignore' });
process.on('exit', () => server.kill());
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ok = (c, m) => { if (!c) throw Error('FAIL: ' + m); console.log('PASS ' + m) };

/* ---------- the fake database ---------- */
const USERS = { 'josh@example.com': 'u1', 'sam@example.com': 'u2' }, EMAIL = { u1: 'josh@example.com', u2: 'sam@example.com' };
const cards = {}, friends = new Set(), invites = {}, duels = {}, inbox = [], prefs = {};
let seq = 1;
const fkey = (a, b) => a + '|' + b, areFriends = (a, b) => friends.has(fkey(a, b));
const who = u => u ? { id: u, no: cards[u] ? cards[u].no : null, name: cards[u] && cards[u].data.member && cards[u].data.member.name ? cards[u].data.member.name : cards[u] ? 'Member ' + cards[u].no.slice(0, 3) + ' ' + cards[u].no.slice(3) : 'A Galaxy Video member' } : null;
const notify = (to, kind, from, duel, film) => { if (!to || to === from) return; if (duel && inbox.some(i => i.user === to && i.kind === kind && i.duel === duel && !i.read)) return; inbox.push({ id: seq++, user: to, kind, from, duel, film, at: new Date().toISOString(), read: false }) };
function view(d, u) {
  if (!d || (d.from !== u && d.to !== u)) return { status: 'gone' };
  const them = d.from === u ? d.to : d.from, mine = d.swipes.filter(s => s.u === u), th = d.swipes.filter(s => s.u === them);
  const both = mine.filter(s => s.k && th.some(t => t.f === s.f && t.k)).map(s => s.f);
  return { status: 'ok', id: d.id, state: d.status, me: d.from === u ? 1 : 2, friend: who(them), vibe: d.vibe, deck: d.deck, mine: mine.map(s => ({ f: s.f, k: s.k })), their_n: th.length, both, theirs: ['nomatch', 'settled'].includes(d.status) ? th.filter(s => s.k).map(s => s.f) : null, match: d.match, code: Object.keys(invites).find(c => invites[c].duel === d.id) || null };
}
const code8 = () => Array.from({ length: 8 }, () => 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'[Math.floor(Math.random() * 31)]).join('');
const RPC = {
  member_load: (u) => cards[u] ? { status: 'ok', no: cards[u].no, data: cards[u].data } : { status: 'new' },
  member_save: (u, a) => { if (!cards[u]) cards[u] = { no: u === 'u1' ? '111111' : '222222' }; cards[u].data = a.p_data; return { status: 'ok', no: cards[u].no } },
  friend_invite: (u) => { let c = Object.keys(invites).find(k => invites[k].from === u && !invites[k].duel); if (!c) { c = code8(); invites[c] = { from: u } } return { status: 'ok', code: c } },
  invite_peek: (u, a) => { const i = invites[a.p_code]; if (!i) return { status: 'gone' }; const d = i.duel && duels[i.duel]; return { status: 'ok', from: who(i.from).name, duel: !!i.duel, vibe: d ? d.vibe : null, n: d ? d.deck.length : null, taken: !!(d && d.to) } },
  invite_accept: (u, a) => {
    const i = invites[a.p_code]; if (!i) return { status: 'gone' }; if (i.from === u) return { status: 'self', duel: i.duel || null };
    const fresh = !areFriends(u, i.from); friends.add(fkey(u, i.from)); friends.add(fkey(i.from, u)); if (fresh) notify(i.from, 'friend_joined', u);
    let dl = null; if (i.duel) { const d = duels[i.duel]; if (!d.to) { d.to = u; delete invites[a.p_code]; dl = d.id } }
    return { status: 'ok', friend: who(i.from), new: fresh, duel: dl, taken: false };
  },
  friends_list: (u) => ({ status: 'ok', friends: [...friends].filter(k => k.startsWith(u + '|')).map(k => Object.assign(who(k.split('|')[1]), { streak: 0 })), incoming: [], outgoing: [] }),
  inbox_unread: (u) => ({ status: 'ok', unread: inbox.filter(i => i.user === u && !i.read).length, turns: Object.values(duels).filter(d => (d.from === u || d.to === u) && d.to && d.status === 'open' && d.swipes.filter(s => s.u === u).length < d.deck.length).length }),
  inbox_list: (u) => ({ status: 'ok', items: inbox.filter(i => i.user === u).reverse().map(i => ({ id: i.id, kind: i.kind, from: who(i.from), duel: i.duel || null, film: i.film || null, at: i.at, read: i.read })) }),
  inbox_read: (u) => { inbox.forEach(i => { if (i.user === u) i.read = true }); return { status: 'ok' } },
  duels_list: (u) => ({ status: 'ok', duels: Object.values(duels).filter(d => d.from === u || d.to === u).map(d => { const v = view(d, u), m = v.mine.length; return { id: d.id, state: d.status, me: v.me, friend: v.friend, vibe: d.vibe, n: d.deck.length, mine: m, their_n: v.their_n, match: d.match, code: v.code, turn: ['matched', 'settled'].includes(d.status) ? 'done' : d.status === 'nomatch' ? 'decide' : m < d.deck.length ? 'you' : 'them', at: new Date().toISOString() } }) }),
  duel_create: (u, a) => { const id = 'd' + seq++; duels[id] = { id, from: u, to: a.p_friend, vibe: a.p_vibe, deck: a.p_deck, swipes: [], status: 'open', match: null }; if (!a.p_friend) invites[code8()] = { from: u, duel: id }; return view(duels[id], u) },
  duel_state: (u, a) => view(duels[a.p_id], u),
  duel_swipe: (u, a) => {
    const d = duels[a.p_id]; if (!d || (d.from !== u && d.to !== u)) return { status: 'gone' };
    d.swipes = d.swipes.filter(s => !(s.u === u && s.f === a.p_film)); d.swipes.push({ u, f: a.p_film, k: a.p_keep });
    const them = d.from === u ? d.to : d.from, n = d.swipes.filter(s => s.u === u).length;
    if (d.from === u && n === d.deck.length) notify(d.to, 'duel_new', u, d.id, d.deck[0]);
    if (a.p_keep && !d.match && d.swipes.some(s => s.u === them && s.f === a.p_film && s.k)) { d.status = 'matched'; d.match = a.p_film; notify(them, 'duel_match', u, d.id, a.p_film) }
    return view(d, u);
  },
  duel_unswipe: (u, a) => { const d = duels[a.p_id]; if (d.status === 'open') d.swipes = d.swipes.filter(s => !(s.u === u && s.f === a.p_film)); return view(d, u) },
  duel_close: (u, a) => { duels[a.p_id].status = 'closed'; return { status: 'ok' } },
  alert_prefs_get: (u) => Object.assign({ status: 'ok', email: true, digest: true, late_fees: true }, prefs[u] || {}),
  alert_prefs_set: (u, a) => { prefs[u] = { email: a.p_email, digest: a.p_digest, late_fees: a.p_late_fees }; return RPC.alert_prefs_get(u) }
};
const calls = [];
async function wire(ctx) {
  const fake = sub => { const h = Buffer.from('{"alg":"none"}').toString('base64url'), p = Buffer.from(JSON.stringify({ sub, email: EMAIL[sub], exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url'); return h + '.' + p + '.x' };
  await ctx.route(/supabase\.co\/(auth|rest)\//, async r => {
    const u = r.request().url(), j = x => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(x) });
    if (u.includes('/auth/v1/otp')) return j({});
    if (u.includes('/auth/v1/verify')) { const b = JSON.parse(r.request().postData()), sub = USERS[b.email]; return j({ access_token: fake(sub), refresh_token: 'r' + sub, expires_in: 3600, user: { id: sub, email: b.email } }) }
    if (u.includes('/auth/v1/logout')) return r.fulfill({ status: 204, headers: { 'access-control-allow-origin': '*' } });
    const m = u.match(/\/rpc\/(\w+)/);
    if (m && RPC[m[1]]) {
      const auth = r.request().headers().authorization || '', tok = auth.split(' ')[1] || '';
      let sub = null; try { sub = JSON.parse(Buffer.from(tok.split('.')[1], 'base64url').toString()).sub } catch (e) { }
      calls.push(m[1]);
      return j(RPC[m[1]](sub, JSON.parse(r.request().postData() || '{}')));
    }
    return r.continue();
  });
  await ctx.route(/image\.tmdb|goatcounter|zgo\.at|youtube/, r => r.abort());
  await ctx.addInitScript(() => { try { if (!localStorage.getItem('mns-welcome')) localStorage.setItem('mns-welcome', '1'); localStorage.setItem('mns-sound', '0') } catch (e) { } navigator.share = async d => { window.__shared = d } });
}
async function signIn(page, email) {
  await page.waitForSelector('.joinbox'); await page.check('#j18'); await page.fill('#jEmail', email); await page.click('.joinbox .go');
  await page.waitForSelector('#jCode'); await page.fill('#jCode', '123456'); await page.click('.joinbox .go');
  await page.waitForSelector('.joinbox', { state: 'detached', timeout: 15000 });
}
const swipeAll = async (page, keepFirst) => {
  for (let i = 0; i < 40; i++) {
    if (!(await page.locator('#mnKeep').count())) break;
    const id = await page.getAttribute('.mn-card.mn-top', 'data-id');
    await page.click(keepFirst(id, i) ? '#mnKeep' : '#mnSkip'); await sleep(340);
    if (await page.locator('.mn-reveal').count()) return id;
  }
  return null;
};

(async () => {
  await sleep(1200);
  const b = await chromium.launch();
  const opts = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 };
  const A = await b.newContext(opts), B = await b.newContext(opts);
  await wire(A); await wire(B);
  const pa = await A.newPage(), pb = await B.newPage(), errs = [];
  pa.on('pageerror', e => errs.push('A ' + e.message)); pb.on('pageerror', e => errs.push('B ' + e.message));

  /* guest panel */
  await pa.goto(O + '/index.html'); await pa.waitForSelector('#acctBtn');
  await pa.screenshot({ path: '/tmp/f-top.png', clip: { x: 0, y: 0, width: 390, height: 160 } });
  ok(/guest pass/i.test(await pa.getAttribute('#acctBtn', 'aria-label')), 'card button reads guest pass for a guest');
  await pa.click('#acctBtn'); await pa.waitForSelector('dialog.acct #acctJoin');
  await pa.screenshot({ path: '/tmp/f-guest.png' });
  await pa.click('#acctJoin'); await signIn(pa, 'josh@example.com'); await sleep(600);

  /* Josh: name, invite link */
  await pa.click('#acctBtn'); await pa.waitForSelector('dialog.acct [data-tab="settings"]');
  await pa.click('[data-tab="settings"]'); await pa.waitForSelector('#acctName');
  await pa.fill('#acctName', 'Josh'); await pa.click('#acctNameF button'); await sleep(300);
  await pa.waitForSelector('[data-pref="late_fees"]');
  await pa.screenshot({ path: '/tmp/f-settings.png' });
  ok((await pa.textContent('.acct-t')).trim() === 'Josh', 'name saves and shows in the panel');
  await pa.click('[data-pref="late_fees"]'); await sleep(300);
  ok(calls.includes('alert_prefs_set'), 'late fee switch saves');
  await pa.click('[data-tab="friends"]'); await pa.waitForSelector('#acctInvite');
  await pa.screenshot({ path: '/tmp/f-friends-empty.png' });
  await pa.click('#acctInvite'); await sleep(400);
  const shared = await pa.evaluate(() => window.__shared && window.__shared.text);
  const code = (shared || '').match(/invite=([A-Z2-9]{8})/);
  ok(code, 'invite link shared: ' + (shared || '').slice(0, 70));

  /* Sam: opens the link as a guest */
  await pb.goto(O + '/index.html?invite=' + code[1]);
  await pb.waitForSelector('dialog.counter .syncbox', { timeout: 20000 });
  ok(/Josh wants you on their friends list/.test(await pb.textContent('dialog.counter h3')), 'guest sees who sent the link');
  ok(!(await pb.evaluate(() => location.search.includes('invite'))), 'address bar tidied');
  await pb.screenshot({ path: '/tmp/f-invite-guest.png' });
  await pb.click('dialog.counter [data-a="join"]'); await signIn(pb, 'sam@example.com'); await sleep(1500);
  ok(await pb.locator('dialog.acct').count(), 'after sign-up the friends panel opens');
  ok(/Josh/.test(await pb.textContent('dialog.acct #acctBody')), 'Josh is on Sam\'s friends list');
  ok(!(await pb.evaluate(() => localStorage.getItem('rd-invite'))), 'invite code cleared once used');
  await pb.screenshot({ path: '/tmp/f-friends-b.png' });
  await pb.click('#acctNameGo'); await pb.waitForSelector('#acctName'); await pb.fill('#acctName', 'Sam'); await pb.click('#acctNameF button'); await sleep(1800);
  await pb.keyboard.press('Escape');

  /* Josh: badge, inbox, send a duel */
  await pa.keyboard.press('Escape'); await pa.evaluate(() => RDFriends.refresh()); await sleep(800);
  ok(await pa.isVisible('#acctDot'), 'Josh gets a badge when Sam joins');
  await pa.click('#acctBtn'); await pa.click('[data-tab="inbox"]'); await pa.waitForSelector('.acct-card');
  ok(/opened your invite/.test(await pa.textContent('dialog.acct #acctBody')), 'inbox says Sam joined');
  await pa.screenshot({ path: '/tmp/f-inbox-a.png' });
  await pa.click('[data-act="duelfriend"]'); await pa.waitForSelector('#mnDuelGo');
  ok(await pa.getAttribute('[data-to="u2"]', 'aria-checked') === 'true', 'duel start screen has Sam picked');
  await pa.locator('#matchPanel').screenshot({ path: '/tmp/f-duel-setup.png' });
  await pa.click('#mnDuelGo'); await pa.waitForSelector('.mn-card.mn-top');
  await pa.locator('#matchPanel').screenshot({ path: '/tmp/f-duel-swipe.png' });
  const kept = [];
  await swipeAll(pa, (id, i) => { if (i < 3) { kept.push(id); return true } return false });
  await pa.waitForSelector('#mnBoard'); await sleep(500);
  ok(/Over to Sam/.test(await pa.textContent('#matchPanel')), 'after 20 swipes: over to Sam');
  await pa.locator('#matchPanel').screenshot({ path: '/tmp/f-duel-sent.png' });

  /* Sam: inbox, play, match */
  await pb.evaluate(() => RDFriends.refresh()); await sleep(800);
  ok(await pb.isVisible('#acctDot'), 'Sam gets a badge for the duel');
  await pb.click('#acctBtn'); await pb.waitForSelector('dialog.acct');
  ok(await pb.getAttribute('[data-tab="duels"]', 'aria-selected') === 'true', 'panel opens on Duels when a turn is waiting');
  await pb.waitForSelector('[data-duel]'); await pb.screenshot({ path: '/tmp/f-board-b.png' });
  await pb.click('[data-tab="inbox"]'); await pb.waitForSelector('[data-act="duel"]');
  await pb.click('[data-act="duel"]'); await pb.waitForSelector('.mn-card.mn-top', { timeout: 15000 });
  ok(/Josh/.test(await pb.textContent('#mnThem')), 'Sam sees Josh\'s progress line');
  const hit = await swipeAll(pb, id => id === kept[1]);
  ok(hit === kept[1], 'Sam keeps a film Josh kept and the marquee shows');
  ok(/You and Josh both kept it/.test(await pb.textContent('.mn-reveal')), 'reveal names Josh');
  await pb.screenshot({ path: '/tmp/f-match-b.png' });
  /* Josh's phone picks it up on its next check */
  await pa.waitForSelector('.mn-reveal', { timeout: 15000 });
  ok(/You and Sam both kept it/.test(await pa.textContent('.mn-reveal')), 'the match pops up on Josh\'s phone too');

  /* late fee line */
  inbox.push({ id: seq++, user: 'u1', kind: 'late_fee', from: 'u2', duel: Object.keys(duels)[0], film: kept[0], at: new Date().toISOString(), read: false });
  await pa.keyboard.press('Escape'); await pa.click('#acctBtn'); await pa.click('[data-tab="inbox"]'); await pa.waitForSelector('.acct-fee');
  ok(/rewind and swipe/.test(await pa.textContent('dialog.acct #acctBody')), 'late fee notice reads right');
  await pa.screenshot({ path: '/tmp/f-inbox-fee.png' });
  await pa.click('[data-tab="duels"]'); await pa.waitForSelector('[data-duel]');
  ok(/Matched on/.test(await pa.textContent('dialog.acct #acctBody')), 'board shows the match');
  await pa.screenshot({ path: '/tmp/f-board-a.png' });

  ok(!errs.length, 'no page errors ' + errs.join(' | '));
  await b.close(); process.exit(0);
})().catch(e => { console.error(e); process.exit(1) });
