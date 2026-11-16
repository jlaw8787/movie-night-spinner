/* Final Cut browser check (match.js). Plays real nights in Chromium:
   1. Pass the phone: round one (with an undo), a shortlist round, a round that knocks out everything, then head to
      head on one phone and the marquee reveal.
   2. Room code: two phones against a fake room database that follows supabase/final-cut.sql. Round one, a round
      that cuts nothing, then secret head to head picks with a split (player one's call) and both phones landing on
      the same film.
   3. Dinner Duel: two signed-in phones against a fake duel database that follows supabase/final-cut.sql (it runs
      the page's own RDFinalCut.replay): their swipes stay hidden mid round, rounds open for both, head to head,
      and the match lands on both phones.
   4. Normal Match night still reveals on the first shared keep with the switch off.
   Run: node scripts/check-final-cut.cjs   (screens go to /tmp/fc-*.png) */
const { chromium } = require(require.resolve('playwright', { paths: [require('path').resolve(__dirname, '..'), require('child_process').execSync('npm root -g').toString().trim()] }));
const { spawn } = require('child_process');
const REPO = require('path').resolve(__dirname, '..'), PORT = 4199, O = 'http://127.0.0.1:' + PORT;
const server = spawn('python3', ['-m', 'http.server', PORT, '--bind', '127.0.0.1'], { cwd: REPO, stdio: 'ignore' });
process.on('exit', () => server.kill());
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ok = (c, m) => { if (!c) throw Error('FAIL: ' + m); console.log('PASS ' + m) };

/* fake room database: same shape as match_state, rounds and head to head picks included */
const rooms = {};
const ROOM = {
  match_create: a => { const c = 'FCUT'; rooms[c] = { deck: a.p_deck, vibe: a.p_vibe, final: !!a.p_final, players: 1, picks: {}, swipes: [] }; return c },
  match_join: a => { const r = rooms[a.p_code]; if (!r) return null; r.players = 2; return { vibe: r.vibe, deck: r.deck, final: r.final } },
  match_swipe: a => { const r = rooms[a.p_code], rd = a.p_round || 1; r.swipes = r.swipes.filter(s => !(s.p === a.p_player && s.r === rd && (s.f === a.p_film || rd > 100))); r.swipes.push({ p: a.p_player, f: a.p_film, k: a.p_keep, r: rd }); return true },
  match_unswipe: a => { const r = rooms[a.p_code]; r.swipes = r.swipes.filter(s => !(s.p === a.p_player && s.f === a.p_film && s.r === (a.p_round || 1))); return true },
  match_pick: a => { rooms[a.p_code].picks[a.p_player] = a.p_film; return true },
  match_state: a => { const r = rooms[a.p_code]; return r ? { players: r.players, picks: r.picks, final: r.final, swipes: r.swipes } : null }
};
/* fake duel database: the same rules as supabase/final-cut.sql, using the page's engine */
const engSrc = require('fs').readFileSync(require('path').join(REPO, 'match.js'), 'utf8');
const ENG = {}; require('vm').runInNewContext(engSrc.slice(engSrc.indexOf('/* FINAL-CUT-ENGINE start'), engSrc.indexOf('/* FINAL-CUT-ENGINE end')), { globalThis: ENG });
const replay = ENG.RDFinalCut.replay, duels = {};
const rows = (S, p, keepIf) => { const o = []; for (const r of Object.keys(S[p] || {})) for (const [f, k] of Object.entries(S[p][r])) if (!keepIf || keepIf(+r)) o.push({ f, k, r: +r }); return o };
function dview(d, u) {
  if (d.to === null && u !== d.from) d.to = u;   /* opening the link */
  const me = u === d.from ? 1 : 2, them = me === 1 ? 2 : 1, st = replay(d.deck, d.S);
  if (st.phase === 'win' && d.status === 'open') { d.status = 'matched'; d.match = st.film }
  if (st.phase === 'none' && d.status === 'open') d.status = 'nomatch';
  const vis = r => st.phase === 'win' || st.phase === 'none' || (st.phase === 'swipe' && r < st.round) || (st.phase === 'h2h' && (r < 100 || r < 100 + st.step));
  const td = st.phase === 'swipe' ? st.done[them] : st.phase === 'h2h' ? st.picked[them] : true;
  return { status: 'ok', id: d.id, state: d.status, me, friend: d.to ? { id: me === 1 ? d.to : d.from, name: me === 1 ? 'Sam' : 'Josh' } : null, vibe: 'comedy', deck: d.deck,
    mine: rows(d.S, me), their_n: 0, both: [], theirs: null, match: d.match, code: d.to ? null : 'LINKCODE', final: true, tsw: rows(d.S, them, vis),
    fc: { phase: st.phase, round: st.round, step: st.step || null, their_done: !!td } };
}
const DUEL = {
  duel_create: (u, a) => { const id = 'd1'; duels[id] = { id, from: u, to: null, deck: a.p_deck, final: !!a.p_final, S: { 1: {}, 2: {} }, status: 'open', match: null }; return dview(duels[id], u) },
  duel_state: (u, a) => dview(duels[a.p_id], u),
  duel_swipe: (u, a) => {
    const d = duels[a.p_id], me = u === d.from ? 1 : 2, rd = a.p_round || 1, st = replay(d.deck, d.S);
    if (d.status === 'open') {
      if (st.phase === 'swipe' && rd === st.round && st.deck.includes(a.p_film)) (d.S[me][rd] || (d.S[me][rd] = {}))[a.p_film] = !!a.p_keep;
      else if (st.phase === 'h2h' && rd === 100 + st.step && st.pair.includes(a.p_film) && !d.S[me][rd]) d.S[me][rd] = { [a.p_film]: true };
    }
    return dview(d, u);
  },
  duel_unswipe: (u, a) => { const d = duels[a.p_id], me = u === d.from ? 1 : 2, st = replay(d.deck, d.S); if (st.phase === 'swipe' && (a.p_round || 1) === st.round && d.S[me][st.round]) delete d.S[me][st.round][a.p_film]; return dview(d, u) },
  friends_list: () => ({ status: 'ok', friends: [], incoming: [], outgoing: [] }),
  inbox_unread: () => ({ status: 'ok', unread: 0, turns: 0 }),
  inbox_list: () => ({ status: 'ok', items: [] }), duels_list: () => ({ status: 'ok', duels: [] }), quiz_list: () => ({ status: 'ok', quizzes: [] }),
  member_load: () => ({ status: 'new' }), member_save: () => ({ status: 'ok', no: '111111' }), alert_prefs_get: () => ({ status: 'ok', email: true, digest: true, late_fees: true })
};
async function signedIn(ctx, sub) {
  const tok = Buffer.from('{"alg":"none"}').toString('base64url') + '.' + Buffer.from(JSON.stringify({ sub, exp: Math.floor(Date.now() / 1000) + 3600 })).toString('base64url') + '.x';
  await ctx.addInitScript(([t, s]) => { try { if (!localStorage.getItem('rd-auth')) localStorage.setItem('rd-auth', JSON.stringify({ access_token: t, refresh_token: 'r' + s, expires_at: Math.floor(Date.now() / 1000) + 3600, user: { id: s, email: s + '@example.com' } })) } catch (e) { } }, [tok, sub]);
  await ctx.route(/supabase\.co\/rest\/v1\/rpc\/(?!match_)(\w+)/, async r => {
    const fn = r.request().url().match(/rpc\/(\w+)/)[1], body = JSON.parse(r.request().postData() || '{}');
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(DUEL[fn] ? DUEL[fn](sub, body) : { status: 'ok' }) });
  });
  await ctx.route(/supabase\.co\/auth\//, r => r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: '{}' }));
}
async function wire(ctx) {
  await ctx.addInitScript(() => { try { localStorage.setItem('mns-welcome', '1') } catch (e) { } });
  await ctx.route(/supabase\.co\/rest\/v1\/rpc\/(match_\w+)/, async r => {
    const fn = r.request().url().match(/rpc\/(match_\w+)/)[1], body = JSON.parse(r.request().postData() || '{}');
    r.fulfill({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(ROOM[fn](body)) });
  });
  await ctx.route(/image\.tmdb\.org|gc\.zgo\.at/, r => r.abort());
}
const errs = [];
async function phone(browser, url, sub) {
  const ctx = await browser.newContext({ viewport: { width: 400, height: 860 } });
  await wire(ctx); if (sub) await signedIn(ctx, sub);
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto(O + (url || '/index.html'));
  await p.waitForSelector('#modeMatch');
  return p;
}
const topId = p => p.$eval('.mn-card.mn-top', c => c.dataset.id);
const tap = async (p, sel) => { await p.click(sel); await sleep(380) };
/* swipe the whole round on this phone; keep(id) says keep or cut. Returns the ids kept */
async function round(p, keep) {
  const kept = [];
  for (let i = 0; i < 40; i++) {
    if (!await p.$('.mn-card.mn-top')) break;
    const id = await topId(p), k = keep(id);
    if (k) kept.push(id);
    await tap(p, k ? '#mnKeep' : '#mnSkip');
  }
  return kept;
}
async function start(p, style, fc) {
  await p.click('#modeMatch'); await p.waitForSelector('[data-vibe="comedy"]');
  await p.click('[data-vibe="comedy"]'); await p.click(`[data-style="${style}"]`);
  const on = await p.$eval('#mnFc', b => b.getAttribute('aria-checked') === 'true');
  if (on !== fc) await p.click('#mnFc');
}

(async () => {
  for (let i = 0; i < 40; i++) { try { await fetch(O + '/index.html'); break } catch (e) { await sleep(250) } }
  const browser = await chromium.launch();

  /* ---------- 1. Pass the phone ---------- */
  const a = await phone(browser);
  await start(a, 'pass', true);
  ok(await a.$eval('#mnFc', b => b.getAttribute('aria-checked')) === 'true', 'Final Cut switch turns on');
  ok(!!(await a.$('#mnFc')) && (await a.$eval('#mnFc', b => b.textContent)).includes('one film is left'), 'switch says what it does');
  await a.click('[data-style="solo"]'); ok(!(await a.$('#mnFc')), 'no switch for Just me'); await a.click('[data-style="pass"]');
  await a.click('#mnDeal'); await a.waitForSelector('.mn-card.mn-top');
  ok((await a.textContent('.mn-fcb')).includes('round 1'), 'round one label');
  /* undo: keep one, take it back */
  const first = await topId(a); await tap(a, '#mnKeep'); await tap(a, '#mnUndo');
  ok(await topId(a) === first, 'undo brings the card back');
  let n = 0; const k1 = await round(a, () => n++ < 5);
  ok(k1.length === 5, 'player one kept 5');
  await a.waitForSelector('#mnP2'); ok((await a.textContent('.mn-hand')).includes('round 1'), 'pass the phone after round one');
  await a.click('#mnP2'); await a.waitForSelector('.mn-card.mn-top');
  const k2 = await round(a, id => k1.includes(id) && k1.indexOf(id) < 4);
  ok(k2.length === 4, 'player two kept 4 of them');
  await a.waitForSelector('.mn-shelf'); await a.screenshot({ path: '/tmp/fc-cut.png' });
  ok((await a.textContent('.mn-t')).includes('4 made the cut'), 'shortlist of 4 shown');
  ok(await a.$$eval('.mn-shelf li', l => l.length) === 4, 'shelf shows the 4');
  await a.click('#mnRound'); await a.waitForSelector('.mn-card.mn-top');
  ok((await a.textContent('.mn-fcb')).includes('round 2'), 'round two label');
  const r2 = []; n = 0; r2.push(...await round(a, () => n++ < 2));
  await a.click('#mnP2'); await a.waitForSelector('.mn-card.mn-top');
  await round(a, () => true);
  await a.waitForSelector('#mnRound'); ok((await a.textContent('.mn-t')).includes('2 made the cut'), 'round two leaves 2');
  await a.click('#mnRound'); await a.waitForSelector('.mn-card.mn-top');
  await round(a, () => false); await a.click('#mnP2'); await a.waitForSelector('.mn-card.mn-top'); await round(a, () => false);
  await a.waitForSelector('#mnHH');
  ok((await a.textContent('.mn-hand')).includes('knocked out every film'), 'wiped round goes head to head');
  await a.click('#mnHH'); await a.waitForSelector('.mn-vt');
  await a.screenshot({ path: '/tmp/fc-h2h.png' });
  ok(await a.$$eval('.mn-vt', t => t.length) === 2, 'this or that shows two films');
  ok((await a.textContent('#mnThem')).includes('Talk it out'), 'one phone: pick together');
  const pickA = await a.$eval('.mn-vt', b => b.dataset.vs);
  ok(r2.includes(pickA), 'head to head films are the last shortlist');
  await a.click('.mn-vt'); await a.waitForSelector('.mn-reveal');
  ok((await a.textContent('.mn-rw')).includes('Final Cut'), 'marquee says Final Cut');
  await a.screenshot({ path: '/tmp/fc-reveal.png' });
  await a.keyboard.press('Escape');
  ok((await a.textContent('.mn-hand .mn-t')).length > 0, 'done screen after the reveal');
  /* reload mid night keeps it */
  await a.click('#mnAgain'); await a.click('#mnDeal'); await a.waitForSelector('.mn-card.mn-top');
  await tap(a, '#mnKeep'); const id2 = await topId(a);
  await a.reload(); await a.waitForSelector('.mn-card.mn-top');
  ok(await topId(a) === id2, 'a reload keeps the Final Cut night');

  /* ---------- 2. Room code ---------- */
  const A = await phone(browser), B = await phone(browser);
  await start(A, 'room', true); await A.click('#mnStart'); await A.waitForSelector('.mn-big');
  ok(rooms.FCUT && rooms.FCUT.final, 'room opened as Final Cut');
  ok((await A.textContent('.mn-hand')).includes('Final Cut is on'), 'lobby says Final Cut is on');
  await B.goto(O + '/index.html?match=FCUT'); await B.waitForSelector('.mn-card.mn-top');
  ok((await B.textContent('.mn-fcb')).includes('round 1'), 'joiner is in Final Cut round one');
  await A.click('#mnGo'); await A.waitForSelector('.mn-card.mn-top');
  n = 0; const ka = await round(A, () => n++ < 3);
  await A.waitForSelector('.mn-hand'); ok((await A.textContent('.mn-hand')).includes('Over to them'), 'A waits for B');
  await round(B, id => ka.includes(id));
  await sleep(2600);
  for (const P of [A, B]) { await P.waitForSelector('#mnRound', { timeout: 8000 }); ok((await P.textContent('.mn-t')).includes('3 made the cut'), 'both phones see 3 made the cut') }
  await A.click('#mnRound'); await B.click('#mnRound');
  await A.waitForSelector('.mn-card.mn-top'); await round(A, () => true); await B.waitForSelector('.mn-card.mn-top'); await round(B, () => true);
  await sleep(2600);
  for (const P of [A, B]) { await P.waitForSelector('#mnHH', { timeout: 8000 }); ok((await P.textContent('.mn-hand')).includes('Nothing got cut'), 'round that cuts nothing goes head to head') }
  await A.click('#mnHH'); await B.click('#mnHH');
  await A.waitForSelector('.mn-vt'); await B.waitForSelector('.mn-vt');
  ok((await A.textContent('#mnThem')).includes('your call'), 'A has the first split call');
  const pair = await A.$$eval('.mn-vt', t => t.map(b => b.dataset.vs));
  await A.click(`.mn-vt[data-vs="${pair[0]}"]`); await B.click(`.mn-vt[data-vs="${pair[1]}"]`);
  await sleep(2600);
  await A.waitForSelector('.mn-vsl', { timeout: 8000 });
  ok((await A.textContent('.mn-vsl')).includes('Split. Your call'), 'split goes to player one');
  ok((await B.textContent('.mn-vsl')).includes('Split. Their call'), 'B sees it was their call');
  const p2 = await A.$$eval('.mn-vt', t => t.map(b => b.dataset.vs));
  ok(p2[0] === pair[0], 'player one pick stays on');
  await A.click(`.mn-vt[data-vs="${p2[1]}"]`); await B.click(`.mn-vt[data-vs="${p2[1]}"]`);
  await sleep(2600);
  for (const P of [A, B]) await P.waitForSelector('.mn-reveal', { timeout: 8000 });
  const ta = await A.textContent('.mn-rt'), tb = await B.textContent('.mn-rt');
  ok(ta === tb, `both phones land on the same film (${ta})`);
  await A.screenshot({ path: '/tmp/fc-room.png' });

  /* ---------- 3. Dinner Duel ---------- */
  const J = await phone(browser, null, 'u1'), Sm = await phone(browser, null, 'u2');
  await start(J, 'duel', true); await J.waitForSelector('[data-to="link"]'); await J.click('[data-to="link"]'); await J.click('#mnDuelGo');
  await J.waitForSelector('.mn-card.mn-top');
  ok(duels.d1 && duels.d1.final, 'duel created as Final Cut');
  ok((await J.textContent('.mn-fcb')).includes('round 1'), 'duel round one label');
  n = 0; const kj = await round(J, () => n++ < 4);
  await J.waitForSelector('#mnDShare'); ok((await J.textContent('.mn-hand')).includes('Now send it'), 'link duel asks to send it');
  await Sm.evaluate(() => window.RDMatch.openDuel('d1')); await Sm.waitForSelector('.mn-card.mn-top');
  ok(!(await Sm.textContent('#mnThem')).includes('hasn'), 'Sam sees Josh is done: ' + await Sm.textContent('#mnThem'));
  await round(Sm, id => kj.slice(0, 3).includes(id));
  await Sm.waitForSelector('#mnRound', { timeout: 8000 }); ok((await Sm.textContent('.mn-t')).includes('3 made the cut'), 'Sam goes straight to round two');
  await Sm.click('#mnRound'); await Sm.waitForSelector('.mn-card.mn-top');
  await round(Sm, () => true);
  await Sm.waitForSelector('.mn-hand'); ok((await Sm.textContent('.mn-hand')).includes('Over to Josh'), 'Sam waits on Josh in round two');
  await J.waitForSelector('#mnRound', { timeout: 10000 }); ok((await J.textContent('.mn-t')).includes('3 made the cut'), 'Josh sees round two open');
  await J.click('#mnRound'); await J.waitForSelector('.mn-card.mn-top');
  n = 0; await round(J, () => n++ < 1);
  await J.waitForSelector('.mn-reveal', { timeout: 10000 });
  const fj = await J.textContent('.mn-rt');
  await Sm.waitForSelector('.mn-reveal', { timeout: 12000 });
  ok(fj === await Sm.textContent('.mn-rt'), `duel lands on the same film on both phones (${fj})`);

  /* ---------- 4. switch off: the normal night ---------- */
  const C = await phone(browser);
  await start(C, 'pass', false); await C.click('#mnDeal'); await C.waitForSelector('.mn-card.mn-top');
  ok(!(await C.$('.mn-fcb')), 'no Final Cut label when off');
  const kc = await round(C, () => true);
  await C.click('#mnP2'); await C.waitForSelector('.mn-card.mn-top');
  await tap(C, '#mnKeep'); await C.waitForSelector('.mn-reveal');
  ok(!(await C.textContent('.mn-rw')).includes('Final Cut'), 'normal reveal on first shared keep');

  ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await browser.close(); server.kill(); process.exit(0);
})().catch(e => { console.error(e.message || e); server.kill(); process.exit(1) });
