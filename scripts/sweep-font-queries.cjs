/* Opens every film (adult and kids mode) and records every font list the menus ask rdFontHref for,
   then writes scripts/font-queries.json for scripts/fetch-fonts.cjs. Run it after adding a menu whose fonts
   come from data rather than a fixed "family=..." string, then run fetch-fonts.
     PLAYWRIGHT_MODULE=/path/to/playwright node scripts/sweep-font-queries.cjs [browser path]
   Also fails if anything still asks Google Fonts or cdnjs for a file. */
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
const {spawn} = require('child_process'), fs = require('fs'), path = require('path');
const root = path.join(__dirname, '..'), exe = process.argv[2] || process.env.MNS_BROWSER;
const port = 4300 + Math.floor(Math.random() * 1500);
const server = spawn('python3', ['-m', 'http.server', String(port), '--bind', '127.0.0.1'], {cwd: root, stdio: 'ignore'});
process.on('exit', () => server.kill());
(async () => {
  await new Promise(r => setTimeout(r, 1200));
  const args = ['--no-sandbox', '--proxy-bypass-list=<-loopback>'];
  if (process.env.HTTPS_PROXY) args.push('--proxy-server=https=' + process.env.HTTPS_PROXY.replace('http://', ''));
  const b = await chromium.launch({executablePath: exe, args});
  const found = new Set(), outside = new Set();
  for (const kids of [false, true]) {
    const ctx = await b.newContext({viewport: {width: 1440, height: 900}, serviceWorkers: 'block'});
    await ctx.addInitScript(k => {
      localStorage.setItem('mns-welcome', '1'); localStorage.setItem('mns-sound', '0'); if (k) localStorage.setItem('mns-kids', '1');
      window.__fontQ = new Set(); let f;
      Object.defineProperty(window, 'rdFontHref', {configurable: true, get: () => f, set: v => { f = (q, d) => { window.__fontQ.add(String(q)); return v(q, d); }; }});
    }, kids);
    await ctx.route('**/*', r => {
      const u = new URL(r.request().url());
      if (u.hostname === '127.0.0.1' || u.protocol === 'data:' || u.protocol === 'blob:') return r.continue();
      if (/fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(u.hostname)) outside.add(u.href);
      return r.abort();
    });
    const page = await ctx.newPage();
    await page.goto(`http://127.0.0.1:${port}/`, {waitUntil: 'domcontentloaded'});
    await page.waitForFunction(() => typeof FILMS !== 'undefined' && typeof kitFonts === 'function');
    const ids = await page.evaluate(() => FILMS.map(f => f.id));
    await page.evaluate(() => kitFonts());
    const grab = async p => (await p.evaluate(() => [...window.__fontQ])).forEach(q => found.add(q));
    await grab(page); await page.close();
    let i = 0;
    const worker = async () => {
      const p = await ctx.newPage();
      while (i < ids.length) {
        const id = ids[i++];
        try {
          await p.goto(`http://127.0.0.1:${port}/?film=` + encodeURIComponent(id), {waitUntil: 'domcontentloaded'});
          await p.waitForFunction(id => typeof current !== 'undefined' && current && current.id === id && !document.body.classList.contains('staged'), id, {timeout: 30000});
          await p.waitForTimeout(700); await grab(p);
        } catch (e) { console.log('skipped', id, e.message.slice(0, 80)); }
      }
      await p.close();
    };
    await Promise.all([worker(), worker(), worker()]);
    console.log(kids ? 'kids' : 'adult', ids.length, 'films,', found.size, 'font lists so far');
    await ctx.close();
  }
  await b.close();
  fs.writeFileSync(path.join(__dirname, 'font-queries.json'), JSON.stringify([...found].sort(), null, 1) + '\n');
  if (outside.size) { console.log('still asking outside servers for:\n  ' + [...outside].join('\n  ')); process.exit(1); }
  process.exit(0);
})().catch(e => { console.error(e); process.exit(1); });
