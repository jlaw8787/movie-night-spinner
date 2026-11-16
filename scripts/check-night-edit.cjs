/* Edit on the locked-in strip (app.js editNight): change the day to any of the next 14 days and the showtime, Watched it early,
   Remove. Guest phone at 390 wide, film locked in for Saturday 7pm. Checks the strip moves, the watched tick, the stars sheet,
   the night clearing, the pill sitting clear of the title, and no page errors.
   Run: node scripts/check-night-edit.cjs   (screens go to /tmp/ne-*.png) */
const { chromium } = require(require.resolve('playwright', { paths: [require('path').resolve(__dirname, '..'), require('child_process').execSync('npm root -g').toString().trim()] }));
const { spawn } = require('child_process');
const fs = require('fs'), path = require('path');
const REPO = path.resolve(__dirname, '..'), PORT = 4198, O = 'http://127.0.0.1:' + PORT;
const server = spawn('python3', ['-m', 'http.server', PORT, '--bind', '127.0.0.1'], { cwd: REPO, stdio: 'ignore' });
process.on('exit', () => server.kill());
const sleep = ms => new Promise(r => setTimeout(r, ms));
const ok = (c, m) => { if (!c) throw Error('FAIL: ' + m); console.log('PASS ' + m) };
const films = JSON.parse(fs.readFileSync(path.join(REPO, 'data/films.json'), 'utf8'));
const F = films.find(f => f.title.length > 18) || films[0], ID = `${F.title} (${F.year})`;
const key = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const sat = new Date(); sat.setDate(sat.getDate() + ((6 - sat.getDay() + 7) % 7 || 7));
const plus2 = new Date(); plus2.setDate(plus2.getDate() + 2);
(async () => {
  for (let i = 0; i < 40; i++) { try { await fetch(O + '/index.html'); break } catch (e) { await sleep(250) } }
  const browser = await chromium.launch();
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(([w]) => { try { if (!localStorage.getItem('ne-seeded')) { localStorage.setItem('ne-seeded', '1'); localStorage.setItem('mns-welcome', '1'); localStorage.setItem('mns-week', JSON.stringify(w)) } } catch (e) { } },
    [{ id: ID, day: 6, time: '19:00', date: key(sat), ticks: {} }]);
  await ctx.route(/image\.tmdb|zgo\.at|goatcounter|youtube|supabase\.co/, r => r.abort());
  const p = await ctx.newPage(), errs = [];
  p.on('pageerror', e => errs.push(String(e)));
  await p.goto(O + '/index.html'); await p.waitForSelector('#feature:not([hidden]) #featEdit', { timeout: 30000 }); await sleep(600);
  await p.screenshot({ path: '/tmp/ne-strip.png', clip: { x: 0, y: 0, width: 390, height: 200 } });
  const box = await p.evaluate(() => { const r = s => document.querySelector(s).getBoundingClientRect(); const e = r('#featEdit'), t = r('.feature .ft-t'), a = r('#featCal');
    const tt = document.querySelector('.feature .ft-t'), cs = getComputedStyle(tt);
    return { textRight: t.right - parseFloat(cs.paddingRight), editLeft: e.left, editBottom: e.bottom, actsTop: a.top, editRight: e.right } });
  ok(box.textRight <= box.editLeft + 1 && box.editBottom <= box.actsTop && box.editRight <= 390, 'Edit pill sits top right, clear of the title and the three buttons');
  await p.click('#featEdit'); await p.waitForSelector('dialog.nightedit[open]');
  const n = await p.$$eval('#neDay option', o => o.length); ok(n === 14, '14 days to pick from');
  await p.screenshot({ path: '/tmp/ne-dialog.png' });
  await p.selectOption('#neDay', key(plus2)); await p.selectOption('#neTime', '18:30'); await p.click('dialog.nightedit [data-save]'); await sleep(300);
  const st = await p.evaluate(() => JSON.parse(localStorage.getItem('mns-week')));
  ok(st.date === key(plus2) && st.time === '18:30' && st.day === plus2.getDay(), `saved: ${st.date} ${st.time} (any day, here a ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][plus2.getDay()]})`);
  ok(/6:30pm/.test(await p.textContent('.feature .ft-w')), 'strip shows the new time');
  await p.reload(); await p.waitForSelector('#feature:not([hidden])'); await sleep(400);
  ok(JSON.parse(await p.evaluate(() => localStorage.getItem('mns-week'))).date === key(plus2), 'weeknight date survives a reload');
  await p.click('#featEdit'); await p.waitForSelector('dialog.nightedit[open]'); await p.click('dialog.nightedit [data-remove]'); await sleep(300);
  ok(await p.evaluate(() => !localStorage.getItem('mns-week') && document.querySelector('#feature').hidden), 'Remove clears the night and hides the strip');
  ok(await p.evaluate(id => !JSON.parse(localStorage.getItem('mns-watched') || '[]').includes(id), ID), 'Remove ticks nothing off');
  await p.evaluate(w => { localStorage.setItem('mns-week', JSON.stringify(w)) }, { id: ID, day: 6, time: '19:00', date: key(sat), ticks: {} });
  await p.reload(); await p.waitForSelector('#feature:not([hidden]) #featEdit'); await sleep(400);
  await p.click('#featEdit'); await p.waitForSelector('dialog.nightedit[open]'); await p.click('dialog.nightedit [data-early]'); await sleep(800);
  ok(await p.evaluate(id => JSON.parse(localStorage.getItem('mns-watched') || '[]').includes(id) && !localStorage.getItem('mns-week'), ID), 'Watched it early ticks the film off and clears the night');
  ok(await p.evaluate(() => [...document.querySelectorAll('dialog[open]')].some(d => /star|rate/i.test(d.className + d.textContent))), 'stars sheet opens after Watched it early');
  await p.screenshot({ path: '/tmp/ne-rate.png' });
  ok(!errs.length, 'no page errors' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await browser.close(); process.exit(0);
})().catch(e => { console.error(e.message || e); process.exit(1) });
