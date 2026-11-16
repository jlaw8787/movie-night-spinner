/* Quiz night check: two phones. Phone A plays the daily, a pass-the-phone game and a challenge, and sends the link.
   Phone B opens the link and must get the same 10 questions in the same order, then sees both scores.
   Run: node scripts/check-quiz.cjs  (SHOTS=dir saves phone screenshots). */
const { chromium } = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const { spawn } = require('child_process'), path = require('path'), http = require('http'), fs = require('fs');
const REPO = path.resolve(__dirname, '..'), PORT = String(process.env.MNS_PORT || 4193), ORIGIN = 'http://127.0.0.1:' + PORT;
const SHOTS = process.env.SHOTS || '';
const server = spawn('python3', ['-m', 'http.server', PORT, '--bind', '127.0.0.1'], { cwd: REPO, stdio: 'ignore' });
process.on('exit', () => server.kill());
const ok = (c, m) => { if (!c) throw Error(m); console.log('ok ' + m) };
const ready = async () => { for (let i = 0; i < 60; i++) { const up = await new Promise(r => { const q = http.get(ORIGIN + '/index.html', s => { s.resume(); r(s.statusCode === 200) }); q.on('error', () => r(false)) }); if (up) return; await new Promise(r => setTimeout(r, 250)) } throw Error('server') };
let n = 0;
const shot = async (p, name) => { if (SHOTS) { fs.mkdirSync(SHOTS, { recursive: true }); await p.screenshot({ path: path.join(SHOTS, String(++n).padStart(2, '0') + '-' + name + '.png'), fullPage: false }) } };
async function phone(browser) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true });
  await ctx.addInitScript(() => { try { localStorage.setItem('mns-welcome', '1'); localStorage.setItem('mns-view', 'wheel'); localStorage.setItem('mns-sound', '0') } catch (e) { } window.__shared = []; navigator.share = async d => { window.__shared.push(d) } });
  const p = await ctx.newPage(); const errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  return { p, errs };
}
/* answer the current question: pick the right one when want is true, a wrong one otherwise */
async function answer(p, want) {
  await p.locator('.qz-opts button').first().waitFor();
  const i = await p.evaluate(want => { const s = JSON.parse(sessionStorage.getItem('rd-quiz-game')); const q = s.qs[s.i]; return want ? q.c : (q.c + 1) % q.o.length }, want);
  await p.locator('.qz-opts button').nth(i).click();
  await p.locator('#qzNext').click();
}
(async () => {
  await ready();
  const browser = await chromium.launch();
  const A = await phone(browser), pa = A.p;
  await pa.goto(ORIGIN + '/index.html'); await pa.waitForFunction(() => window.RDQuiz);
  ok(await pa.locator('#quizPanel').isHidden(), 'quiz stays closed until tapped');
  await pa.locator('#modeQuiz').click();
  await pa.locator('#qzDaily').waitFor(); await shot(pa, 'hub');
  ok(await pa.locator('.wheel-wrap').isHidden(), 'wheel hides while the quiz is open');
  /* the same seed always deals the same questions, every film once, a mix of rounds */
  const d1 = await pa.evaluate(() => RDQuiz.deal(12345, false, 10)), d2 = await pa.evaluate(() => RDQuiz.deal(12345, false, 10));
  ok(JSON.stringify(d1) === JSON.stringify(d2) && d1.length === 10, 'seeded deal repeats exactly');
  ok(new Set(d1.map(q => q.id)).size === 10, 'no film twice in a game');
  const big = await pa.evaluate(() => Promise.all([1, 2, 3, 4, 5, 6, 7, 8].map(s => RDQuiz.deal(s * 7919, false, 30))).then(a => a.flat()));
  ok(big.every(q => q.o.length === 4 && q.c >= 0 && q.c < 4 && new Set(q.o).size === 4), 'every question has four different options and one right answer');
  ok(['w', 'p', 'm', 'y'].every(t => big.some(q => q.t === t)), 'written, picture, menu and year rounds all deal');
  const kids = await pa.evaluate(() => RDQuiz.deal(99, true, 30).then(a => a.every(q => isKidSafe(FILMS.find(f => f.id === q.id)))));
  ok(kids, 'kids games only use kid-safe films');
  /* daily */
  await pa.locator('#qzDaily').click();
  for (let i = 0; i < 10; i++) { if (i === 0) await shot(pa, 'question'); const t = await pa.evaluate(() => { const s = JSON.parse(sessionStorage.getItem('rd-quiz-game')); return s.qs[s.i].t }); if (t === 'p' && !fs.existsSync(path.join(SHOTS || '/x', 'pic'))) { await shot(pa, 'picture'); SHOTS && fs.mkdirSync(path.join(SHOTS, 'pic'), { recursive: true }) } if (t === 'm' && SHOTS && !fs.existsSync(path.join(SHOTS, 'menu'))) { await shot(pa, 'menu-round'); fs.mkdirSync(path.join(SHOTS, 'menu')) } await answer(pa, i % 4 !== 3) }
  await pa.locator('.qz-end').waitFor(); await shot(pa, 'daily-result');
  ok((await pa.locator('.qz-big').first().textContent()).startsWith('8'), 'daily scores 8 of 10');
  await pa.locator('#qzShareDay').click();
  const sh = await pa.evaluate(() => window.__shared.at(-1).text);
  ok(/Daily quiz No\. \d+\n8\/10 /.test(sh) && sh.includes('?quiz=daily'), 'daily share line');
  await pa.locator('#qzHub').click();
  ok(await pa.locator('#qzDaily').count() === 0 && (await pa.locator('.qz-daily .qz-big').textContent()).startsWith('8'), 'daily is one go a day');
  /* pass the phone */
  await pa.locator('#qzPass').click();
  await pa.locator('#qzP0').fill('Josh'); await pa.locator('#qzP1').fill('Jayde'); await pa.locator('#qzAdd').click(); await pa.locator('#qzP2').fill('Harper');
  await pa.locator('[data-r="3"]').click(); await shot(pa, 'pass-setup');
  await pa.locator('#qzPassF button[type=submit]').click();
  for (let i = 0; i < 9; i++) { await pa.locator('#qzReady').waitFor(); if (i === 1) await shot(pa, 'handover'); await pa.locator('#qzReady').click(); await answer(pa, i % 3 === 0 || i === 4) }
  await pa.locator('.qz-board').waitFor(); await shot(pa, 'pass-result');
  ok((await pa.locator('.mn-t').textContent()).includes('Josh wins'), 'pass the phone names the winner');
  /* challenge */
  await pa.locator('#qzHub').click(); await pa.locator('#qzChal').click();
  await pa.locator('#qzName').fill('Josh'); await pa.locator('#qzNameF button').click(); await pa.locator('.qz-opts button').first().waitFor();
  const seedA = await pa.evaluate(() => JSON.parse(sessionStorage.getItem('rd-quiz-game')).qs.map(q => q.id + q.q + q.o.join()));
  for (let i = 0; i < 10; i++) await answer(pa, i < 8);
  await pa.locator('#qzSend').click();
  const link = await pa.evaluate(() => window.__shared.at(-1).text.split('\n')[1]);
  ok(/\?quiz=c-[0-9a-z]+-8-\d+-0&by=Josh$/.test(link), 'challenge link carries seed, score and name');
  ok(A.errs.length === 0, 'no page errors on phone A ' + A.errs.join(' | '));
  /* phone B opens the link */
  const B = await phone(browser), pb = B.p;
  await pb.goto(link.replace(/^https?:\/\/[^/]+\//, ORIGIN + '/index.html'));
  await pb.locator('#qzTake').waitFor(); await shot(pb, 'challenge-invite');
  ok((await pb.locator('.mn-t').textContent()).includes('Josh got 8/10'), 'friend sees who sent it and the score');
  ok(!(await pb.evaluate(() => location.search.includes('quiz'))), 'link tidied off the address bar');
  await pb.locator('#qzTake').click(); await pb.locator('.qz-opts button').first().waitFor();
  const seedB = await pb.evaluate(() => JSON.parse(sessionStorage.getItem('rd-quiz-game')).qs.map(q => q.id + q.q + q.o.join()));
  ok(JSON.stringify(seedA) === JSON.stringify(seedB), 'friend gets the same 10 questions in the same order');
  for (let i = 0; i < 10; i++) await answer(pb, i < 9);
  await pb.locator('.qz-vs').waitFor(); await shot(pb, 'challenge-result');
  ok((await pb.locator('.qz-verdict').textContent()).includes('You beat Josh'), 'friend sees who won');
  await pb.locator('.qz-review summary').click(); await shot(pb, 'review');
  /* switching tabs closes the quiz and brings the wheel back */
  await pb.locator('#modeSpin').click();
  ok(await pb.locator('#quizPanel').isHidden() && await pb.locator('.wheel-wrap').isVisible(), 'Spin it brings the wheel back');
  await pb.locator('#modeMatch').click(); await pb.locator('#modeQuiz').click();
  ok(await pb.locator('#matchPanel').isHidden() && await pb.locator('#quizPanel').isVisible(), 'Quiz it from Match it hides Match night');
  ok(B.errs.length === 0, 'no page errors on phone B ' + B.errs.join(' | '));
  await browser.close(); console.log('check-quiz: pass'); process.exit(0);
})().catch(e => { console.error('FAIL', e.message); process.exit(1) });
