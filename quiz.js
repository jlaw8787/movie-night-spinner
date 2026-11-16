/* Quiz night: the third tab in the cinema (Spin it, Match it, Quiz it). Cinema red and gold, nothing pops up on its own.
   Ways to play:
   - Daily quiz: the same 10 for everyone each day (Brisbane date), one go a day, score, streak and a share line.
     Kids' mode gets its own daily from kid-safe films.
   - Pass the phone: 2 to 6 players at the table take turns on one phone, a question each per round, scoreboard at
     the end, and the winner spins the wheel.
   - Challenge a friend: play 10, send the link. The link carries the seed, the score and the name, so the friend
     plays the same 10 in the same order with no sign-in and no database. Results side by side, then send one back.
   - Win the film: the old Trivia spin (openTrivia in app.js), three questions, two right unlocks the film.
   Questions: the written three per film (data/trivia.json) plus rounds built from the site's own data
   (data/quiz.json, scripts/build-quiz.cjs): a real still (which film?), three dishes off the film's menu (which film?),
   and the year. Wrong answers in the film rounds come from films that share a genre, never from the same series.
   Every game is built from a seed, so the daily and a challenge come out the same on every phone.
   Loads after friends.js and uses app.js globals: FILMS, ESC, TMDB_IMG, ensureTrivia, openTrivia, isKidSafe,
   kidsMode, sfx, buzz, setView, member. */
(function () {
  'use strict';
  const panel = $('quizPanel'), live = $('quizLive');
  const spinBtn = $('modeSpin'), matchBtn = $('modeMatch'), quizBtn = $('modeQuiz');
  if (!panel || !quizBtn) return;
  const deckEl = panel.closest('.deck');
  const byId = new Map(FILMS.map(f => [f.id, f]));
  const DAY0 = Math.floor(Date.UTC(2026, 10, 16) / 864e5);
  const today = () => Math.floor((Date.now() + 10 * 3600e3) / 864e5);
  const say = t => { if (live) { live.textContent = ''; setTimeout(() => { live.textContent = t }, 30) } };
  const count = (p, t) => { try { if (window.goatcounter && window.goatcounter.count) window.goatcounter.count({ path: 'quiz/' + p, title: t, event: true }) } catch (e) { } };
  const isKids = () => typeof kidsMode !== 'undefined' && !!kidsMode;
  const app = () => globalThis.REEL_NATIVE || !/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const siteURL = () => app() ? 'https://reeldinner.com/' : location.origin + '/';

  /* ---------- data ---------- */
  let QD = null, qdP = null;
  const loadData = () => qdP || (qdP = Promise.all([
    fetch('data/quiz.json' + (window.DATA_V && DATA_V.quiz ? '?v=' + DATA_V.quiz : '')).then(r => { if (!r.ok) throw 0; return r.json() }),
    typeof ensureTrivia === 'function' ? ensureTrivia() : Promise.resolve({})
  ]).then(([q, t]) => (QD = { q, t: t || {} })).catch(e => { qdP = null; throw e }));

  /* ---------- what this phone remembers: daily results, name, best score ---------- */
  let S = { days: {}, name: '', best: 0, played: 0 };
  try { S = Object.assign(S, JSON.parse(localStorage.getItem('rd-quiz') || '{}')) } catch (e) { }
  const saveS = () => { try { const d = today(); for (const k of Object.keys(S.days)) if (parseInt(k, 10) < d - 400) delete S.days[k]; localStorage.setItem('rd-quiz', JSON.stringify(S)) } catch (e) { } };
  const dayKey = k => today() + (k ? 'k' : '');
  function streak() {
    let d = today(), n = 0;
    if (!S.days[d] && !S.days[d + 'k']) d--;
    while (S.days[d] || S.days[d + 'k']) { n++; d-- }
    return n;
  }
  const myName = () => S.name || (typeof member !== 'undefined' && member && member.name) || '';

  /* ---------- seeded dealing ---------- */
  const rng = seed => { let a = seed >>> 0; return () => { a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 } };
  const sh = (a, r) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a };
  const newSeed = () => (Math.random() * 0x7fffffff) >>> 0 || 1;
  const BLOCK = ['w', 'w', 'w', 'w', 'w', 'p', 'p', 'p', 'm', 'y'];
  const ROUND = { w: '', p: 'Picture round', m: 'Menu round', y: 'Name the year' };

  function pool(kids) {
    let ids = [...byId.keys()].filter(id => QD.q[id]).sort();
    if (kids && typeof isKidSafe === 'function') ids = ids.filter(id => isKidSafe(byId.get(id)));
    return ids;
  }
  /* three wrong films that could pass for the right one: a shared genre, a nearby year, never the same series or title */
  function others(id, r, ids, k) {
    const f = byId.get(id), q = QD.q[id] || {}, g = q.g || [], y = +f.year;
    const head = t => t.toLowerCase().replace(/^(the|a|an) /, '').split(/[^a-z0-9]+/).filter(Boolean).slice(0, 2).join(' ');
    const fh = head(f.title);
    const ok = x => x !== id && byId.get(x).title !== f.title && !(q.sr && QD.q[x].sr === q.sr) && head(byId.get(x).title) !== fh;
    let c = ids.filter(x => ok(x) && (QD.q[x].g || []).some(n => g.includes(n)));
    if (c.length < 12) c = ids.filter(ok);
    c = c.map(x => [x, Math.abs(+byId.get(x).year - y) + r() * 14]).sort((a, b) => a[1] - b[1]).slice(0, 30).map(x => x[0]);
    return sh(c, r).slice(0, k);
  }
  function filmOpts(id, r, ids) {
    const o = sh([id, ...others(id, r, ids, 3)], r);
    const titles = o.map(x => byId.get(x).title);
    return { o: o.map((x, i) => titles.indexOf(titles[i]) !== titles.lastIndexOf(titles[i]) ? `${titles[i]} (${byId.get(x).year})` : titles[i]), c: o.indexOf(id) };
  }
  let NOPIC = false;
  function make(type, id, r, ids) {
    const f = byId.get(id), q = QD.q[id] || {};
    if (type === 'w') {
      const list = QD.t[id];
      if (!list || !list.length) return null;
      const w = list[Math.floor(r() * list.length)];
      const o = sh(w.a.map((t, i) => [t, i === w.c]), r);
      return { t: 'w', id, film: `${f.title} (${f.year})`, q: w.q, o: o.map(x => x[0]), c: o.findIndex(x => x[1]) };
    }
    if (type === 'p') {
      /* the app build shows no TMDB art (docs/ARTWORK-RIGHTS.md), so a written question takes the picture's place there */
      if (NOPIC) return make('w', id, r, ids);
      if (!q.s || !q.s.length) return null;
      return Object.assign({ t: 'p', id, q: 'Which film is this still from?', img: q.s[Math.floor(r() * q.s.length)] }, filmOpts(id, r, ids));
    }
    if (type === 'm') {
      if (!q.d || q.d.length < 3) return null;
      return Object.assign({ t: 'm', id, q: "Which film's menu serves all three?", dishes: q.d.slice(0, 3) }, filmOpts(id, r, ids));
    }
    if (type === 'y') {
      const y = +f.year, now = new Date().getFullYear(), set = new Set([y]);
      const steps = sh([-7, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 7], r);
      for (const s of steps) { if (set.size >= 4) break; if (y + s <= now && y + s > 1900) set.add(y + s) }
      if (set.size < 4) return null;
      const o = [...set].sort((a, b) => a - b);
      return { t: 'y', id, q: `What year did ${f.title} come out?`, o: o.map(String), c: o.indexOf(y) };
    }
    return null;
  }
  /* n questions from a seed: 5 written, 3 picture, 1 menu, 1 year in every 10, no film twice in a game */
  function deal(seed, kids, n, np) {
    NOPIC = !!(np || globalThis.REEL_APP);
    const r = rng(seed), ids = pool(kids), used = new Set(), out = [];
    let plan = [];
    while (plan.length < n) plan = plan.concat(sh(BLOCK, r));
    plan = plan.slice(0, n);
    if (plan[0] === 'y' || plan[0] === 'm') { const j = plan.findIndex(t => t === 'w' || t === 'p'); if (j > 0)[plan[0], plan[j]] = [plan[j], plan[0]] }
    for (const type of plan) {
      let q = null;
      for (let tries = 0; tries < 80 && !q; tries++) {
        const id = ids[Math.floor(r() * ids.length)];
        if (used.has(id)) continue;
        q = make(type, id, r, ids);
        if (q) used.add(id);
      }
      if (!q) for (let tries = 0; tries < 80 && !q; tries++) { const id = ids[Math.floor(r() * ids.length)]; if (!used.has(id)) { q = make('w', id, r, ids); if (q) used.add(id) } }
      if (q) out.push(q);
    }
    return out;
  }
  const dailySeed = k => ((today() * 2654435761) ^ (k ? 0x6b1d : 0x5eed)) >>> 0;

  /* ---------- the game ---------- */
  let G = null, view = 'hub', pend = null, adv = 0;
  try { const s = JSON.parse(sessionStorage.getItem('rd-quiz-game') || 'null'); if (s && s.qs && s.qs.length && s.i < s.qs.length && s.qs.every(q => byId.has(q.id))) { G = s; view = 'q' } } catch (e) { }
  const saveG = () => { try { if (G && G.i < G.qs.length) sessionStorage.setItem('rd-quiz-game', JSON.stringify(G)); else sessionStorage.removeItem('rd-quiz-game') } catch (e) { } };

  function start(kind, o) {
    o = o || {};
    const kids = o.kids != null ? o.kids : isKids();
    const players = kind === 'pass' ? o.players : [{ n: myName() || 'You', s: 0, r: '' }];
    const n = kind === 'pass' ? players.length * o.rounds : 10;
    const seed = kind === 'daily' ? dailySeed(kids) : o.seed || newSeed(), np = !!(o.np || globalThis.REEL_APP);
    G = { kind, seed, kids, np, day: today(), qs: deal(seed, kids, n, np), i: 0, players, ms: 0, t0: 0, ch: o.ch || null, rounds: o.rounds || 0 };
    if (!G.qs.length) { G = null; return hub() }
    count(kind, 'Quiz: ' + kind);
    view = kind === 'pass' && players.length > 1 ? 'hand' : 'q'; saveG(); render();
  }
  const who = () => G.players[G.i % G.players.length];

  /* ---------- screens ---------- */
  function render() {
    if (view === 'q' && G) return question();
    if (view === 'hand' && G) return handover();
    if (view === 'end' && G) return results();
    if (view === 'pass') return passSetup();
    if (view === 'name') return nameAsk();
    if (view === 'invite' && pend) return inviteScreen();
    hub();
  }
  function hub() {
    view = 'hub';
    const k = isKids(), d = S.days[dayKey(k)], st = streak(), no = today() - DAY0 + 1;
    const nextIn = () => { const ms = 864e5 - ((Date.now() + 10 * 3600e3) % 864e5), h = Math.floor(ms / 3600e3), m = Math.floor(ms % 3600e3 / 60e3); return h ? `${h}h ${m}m` : `${m}m` };
    panel.innerHTML = `<div class="mn-head"><p class="mn-tk">Quiz it</p><h2 class="mn-t">Quiz night</h2>
      <p class="mn-k">How well do you know your films? Stills, menus, quotes and cast from all ${byId.size.toLocaleString('en-AU')} films on the wheel.</p></div>
      <div class="qz-cards">
        <section class="qz-card qz-daily"><p class="qz-ck">${k ? "Kids' daily" : 'Daily quiz'} No. ${no}</p>
          ${d ? `<p class="qz-big">${d.s}<small>/10</small></p><p class="qz-grid" aria-label="${d.s} right out of 10">${grid(d.r)}</p>
            <p class="qz-cs">Done for today. New quiz in ${nextIn()}.${st > 1 ? ` <b>${st} day streak.</b>` : ''}</p>
            <div class="mn-actions"><button type="button" class="mn-ghost" id="qzShareDay">Share my score</button></div>`
          : `<p class="qz-cs">Ten questions, the same for everyone today. One go.${st ? ` <b>${st} day streak</b>, keep it going.` : ''}</p>
            <div class="mn-actions"><button type="button" class="mn-go" id="qzDaily">Play today's quiz</button></div>`}
        </section>
        <section class="qz-card"><p class="qz-ck">Pass the phone</p><p class="qz-cs">2 to 6 players at the table, a question each per round. Winner spins the wheel.</p>
          <div class="mn-actions"><button type="button" class="mn-go" id="qzPass">Set up players</button></div></section>
        <section class="qz-card"><p class="qz-ck">Challenge a friend</p><p class="qz-cs">Play 10, send the link. They get the same 10 and see if they can beat you. No sign-in needed.</p>
          <div class="mn-actions"><button type="button" class="mn-go" id="qzChal">Play and send</button></div></section>
        <section class="qz-card"><p class="qz-ck">Win the film</p><p class="qz-cs">The wheel hides a film. Get two of three right and it's tonight's feature.</p>
          <div class="mn-actions"><button type="button" class="mn-ghost" id="qzWin">Try your luck</button></div></section>
      </div>${S.played ? `<p class="qz-foot">Games played on this phone: ${S.played}. Best score: ${S.best}/10.</p>` : ''}`;
    const on = (id, fn) => { const b = $(id); if (b) b.onclick = fn };
    on('qzDaily', () => need(() => start('daily')));
    on('qzShareDay', e => shareDaily(e.currentTarget));
    on('qzPass', () => { view = 'pass'; render() });
    on('qzChal', () => { if (myName()) need(() => start('chal')); else { view = 'name'; render() } });
    on('qzWin', () => { if (typeof openTrivia === 'function') openTrivia() });
  }
  function need(fn) {
    if (QD) return fn();
    panel.innerHTML = `<p class="mn-k qz-wait">Shuffling the question cards...</p>`;
    loadData().then(fn, () => { panel.innerHTML = `<p class="mn-k">The quiz needs the question list. Check your connection and try again.</p><div class="mn-actions"><button type="button" class="mn-ghost" id="qzBack">Back</button></div>`; $('qzBack').onclick = hub });
  }
  function nameAsk(after) {
    view = 'name';
    panel.innerHTML = `<div class="mn-head"><p class="mn-tk">Challenge a friend</p><h2 class="mn-t">Who's playing?</h2><p class="mn-k">Your name goes on the challenge so they know who to beat.</p></div>
      <form class="qz-form" id="qzNameF"><label class="qz-lab" for="qzName">Your name</label><input id="qzName" maxlength="20" autocomplete="given-name" value="${ESC(myName())}" required>
      <div class="mn-actions"><button type="submit" class="mn-go">Start the 10</button></div></form><button type="button" class="mn-quit" id="qzBack">Back</button>`;
    $('qzName').focus();
    $('qzNameF').onsubmit = e => { e.preventDefault(); const v = $('qzName').value.trim().slice(0, 20); if (!v) return; S.name = v; saveS(); need(after || (() => start('chal'))) };
    $('qzBack').onclick = () => { pend = null; hub() };
  }
  let passP = null, passR = 5;
  function passSetup() {
    if (!passP) passP = [myName() || '', ''];
    panel.innerHTML = `<div class="mn-head"><p class="mn-tk">Pass the phone</p><h2 class="mn-t">Who's playing?</h2><p class="mn-k">Each player gets their own question, then hands the phone on. No peeking.</p></div>
      <form class="qz-form" id="qzPassF">${passP.map((n, i) => `<div class="qz-row"><label class="sr" for="qzP${i}">Player ${i + 1}</label><input id="qzP${i}" data-p="${i}" maxlength="16" placeholder="Player ${i + 1}" value="${ESC(n)}">${passP.length > 2 ? `<button type="button" class="mn-x" data-drop="${i}" aria-label="Remove player ${i + 1}"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>` : ''}</div>`).join('')}
      ${passP.length < 6 ? `<button type="button" class="mn-link qz-add" id="qzAdd">Add a player</button>` : ''}
      <fieldset class="mn-set"><legend>Rounds</legend><div class="mn-chips" role="radiogroup">${[3, 5, 10].map(n => `<button type="button" class="mn-chip" role="radio" aria-checked="${n === passR}" data-r="${n}">${n}<small>${n === 3 ? 'Quick' : n === 5 ? 'Standard' : 'Long'}</small></button>`).join('')}</div></fieldset>
      <div class="mn-actions"><button type="submit" class="mn-go">Start the quiz</button></div></form><button type="button" class="mn-quit" id="qzBack">Back</button>`;
    const grab = () => panel.querySelectorAll('[data-p]').forEach(x => { passP[+x.dataset.p] = x.value });
    panel.querySelectorAll('[data-drop]').forEach(b => b.onclick = () => { grab(); passP.splice(+b.dataset.drop, 1); passSetup() });
    const add = $('qzAdd'); if (add) add.onclick = () => { grab(); passP.push(''); passSetup(); const x = $('qzP' + (passP.length - 1)); x && x.focus() };
    panel.querySelectorAll('[data-r]').forEach(b => b.onclick = () => { grab(); passR = +b.dataset.r; passSetup() });
    $('qzPassF').onsubmit = e => {
      e.preventDefault(); grab();
      const players = passP.map((n, i) => ({ n: n.trim().slice(0, 16) || `Player ${i + 1}`, s: 0, r: '' }));
      need(() => start('pass', { players, rounds: passR }));
    };
    $('qzBack').onclick = hub;
  }
  function handover() {
    const p = who(), rd = Math.floor(G.i / G.players.length) + 1;
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">Round ${rd} of ${G.rounds}</p><p class="mn-k">Pass the phone to</p><p class="mn-big qz-who">${ESC(p.n)}</p>
      <div class="mn-actions"><button type="button" class="mn-go" id="qzReady">I'm ${ESC(p.n)}, show me</button></div>${scoreLine()}<button type="button" class="mn-quit" id="qzQuit">End the game</button></div>`;
    $('qzReady').onclick = () => { view = 'q'; render() };
    $('qzReady').focus();
    $('qzQuit').onclick = quit;
    say(`Pass the phone to ${p.n}`);
  }
  const scoreLine = () => G.players.length > 1 ? `<p class="qz-scores">${G.players.map(p => `<span>${ESC(p.n)} <b>${p.s}</b></span>`).join('')}</p>` : '';
  function question() {
    const q = G.qs[G.i], p = who(), solo = G.players.length === 1;
    const n = solo ? G.i + 1 : Math.floor(G.i / G.players.length) + 1, of = solo ? G.qs.length : G.rounds;
    const head = q.t === 'w' ? `<p class="qz-film">${ESC(q.film)}</p>` : `<p class="qz-round">${ROUND[q.t]}</p>`;
    const media = q.t === 'p' ? `<div class="qz-still"><img alt="A still from the film" src="${TMDB_IMG}w780${ESC(q.img)}" decoding="async"></div><p class="qz-clue" hidden>The picture didn't load. Clue: it came out in ${ESC(byId.get(q.id).year)}${QD.q[q.id] && QD.q[q.id].d ? ` and its menu serves ${ESC(QD.q[q.id].d[0])}` : ''}.</p>`
      : q.t === 'm' ? `<ul class="qz-dishes">${q.dishes.map(d => `<li>${ESC(d)}</li>`).join('')}</ul>` : '';
    panel.innerHTML = `<div class="qz-game"><div class="qz-top"><span>${solo ? '' : `${ESC(p.n)} · `}Question ${n} of ${of}</span><span>${solo ? `Score ${p.s}` : ''}</span></div>
      ${solo ? `<div class="qz-dots" aria-hidden="true">${G.qs.map((x, i) => `<i class="${i < G.i ? (p.r[i] === '1' ? 'ok' : 'no') : i === G.i ? 'now' : ''}"></i>`).join('')}</div>` : ''}
      ${head}<h3 class="qz-q" tabindex="-1">${ESC(q.q)}</h3>${media}
      <div class="qz-opts">${q.o.map((t, i) => `<button type="button" data-o="${i}">${ESC(t)}</button>`).join('')}</div>
      <p class="qz-after" aria-live="polite"></p><button type="button" class="mn-quit" id="qzQuit">${G.kind === 'daily' ? "Leave (this counts as today's go)" : 'End the game'}</button></div>`;
    G.t0 = Date.now();
    const im = panel.querySelector('.qz-still img');
    if (im) im.onerror = () => { im.parentNode.hidden = true; const c = panel.querySelector('.qz-clue'); if (c) c.hidden = false };
    const h = panel.querySelector('.qz-q'); h.focus({ preventScroll: true });
    panel.querySelectorAll('[data-o]').forEach(b => b.onclick = () => answer(+b.dataset.o));
    $('qzQuit').onclick = quit;
    /* the next picture loads while this one is answered */
    const nx = G.qs[G.i + 1]; if (nx && nx.t === 'p') { const im = new Image(); im.src = TMDB_IMG + 'w780' + nx.img }
  }
  function answer(k) {
    if (panel.querySelector('.qz-opts.done')) return;
    const q = G.qs[G.i], p = who(), ok = k === q.c;
    G.ms += Math.min(Date.now() - G.t0, 60000);
    panel.querySelector('.qz-opts').classList.add('done');
    panel.querySelectorAll('[data-o]').forEach((b, n) => { b.disabled = true; if (n === q.c) b.classList.add('ok'); else if (n === k) b.classList.add('no') });
    p.r += ok ? '1' : '0'; if (ok) p.s++;
    try { if (ok && sfx.beep) sfx.beep(); if (typeof buzz === 'function') buzz(ok ? 12 : [20, 40, 20]) } catch (e) { }
    const f = byId.get(q.id), tell = q.t === 'p' || q.t === 'm' || q.t === 'y' ? ` ${f.title} (${f.year}).` : '';
    const after = panel.querySelector('.qz-after');
    after.innerHTML = `${ok ? '<b class="qz-yes">Right.</b>' : '<b class="qz-nope">Not quite.</b>'}${ESC(tell)} <button type="button" class="mn-link" id="qzNext">${G.i + 1 >= G.qs.length ? 'See the scores' : 'Next'}</button>`;
    G.i++; saveG();
    const go = () => { clearTimeout(adv); next() };
    $('qzNext').onclick = go;
    $('qzNext').focus({ preventScroll: true });
    adv = setTimeout(go, ok ? (q.t === 'w' ? 1400 : 2200) : 3400);
  }
  function next() {
    if (!G) return;
    if (G.i >= G.qs.length) return finish();
    view = G.players.length > 1 ? 'hand' : 'q'; render();
  }
  function finish() {
    const me = G.players[0];
    if (G.kind === 'daily') { S.days[(G.day || today()) + (G.kids ? 'k' : '')] = { s: me.s, r: me.r.padEnd(10, '0').slice(0, 10) }; }
    if (G.players.length === 1 && G.qs.length === 10) { S.played = (S.played || 0) + 1; S.best = Math.max(S.best || 0, me.s) }
    saveS(); view = 'end'; saveG(); render();
    try { if (typeof fanfare === 'function' && me.s >= 8) fanfare() } catch (e) { }
  }
  function quit() {
    clearTimeout(adv);
    if (G && G.kind === 'daily' && G.i > 0 && !S.days[dayKey(G.kids)]) { const r = G.players[0].r; S.days[dayKey(G.kids)] = { s: G.players[0].s, r: r.padEnd(10, '0') }; saveS() }
    G = null; saveG(); hub();
  }
  const grid = r => String(r || '').split('').map(c => c === '1' ? '🟩' : '🟥').join('');
  function results() {
    const P = G.players, me = P[0], secs = Math.round(G.ms / 1000);
    let body = '';
    if (G.kind === 'pass') {
      const rank = P.slice().sort((a, b) => b.s - a.s), top = rank.filter(p => p.s === rank[0].s);
      body = `<p class="mn-tk">Final scores</p><h2 class="mn-t">${top.length > 1 ? `It's a tie: ${top.map(p => ESC(p.n)).join(' and ')}` : `${ESC(top[0].n)} wins`}</h2>
        <ol class="qz-board">${rank.map(p => `<li${p.s === rank[0].s ? ' class="qz-win"' : ''}><span>${ESC(p.n)}</span><b>${p.s}/${G.rounds}</b></li>`).join('')}</ol>
        <p class="mn-k">${top.length > 1 ? 'Tied at the top? The wheel settles it.' : `${ESC(top[0].n)} gets to spin for tonight's film.`}</p>
        <div class="mn-actions"><button type="button" class="mn-go" id="qzSpin">${top.length > 1 ? 'Spin the wheel' : `${ESC(top[0].n)} spins the wheel`}</button><button type="button" class="mn-ghost" id="qzAgain">Play again</button></div><button type="button" class="mn-quit" id="qzHub">Back to Quiz night</button>`;
    } else {
      const ch = G.ch, line = me.s >= 9 ? 'Projectionist level.' : me.s >= 7 ? 'You know your films.' : me.s >= 5 ? 'Solid night at the movies.' : me.s >= 3 ? 'Time for a rewatch.' : 'Grab the popcorn and start studying.';
      let vs = '';
      if (ch) { const w = me.s > ch.s || (me.s === ch.s && secs < ch.t) ? 1 : me.s === ch.s && secs === ch.t ? 0 : -1; vs = `<div class="qz-vs"><p><span>You</span><b>${me.s}</b><small>${secs}s</small></p><p><span>${ESC(ch.n)}</span><b>${ch.s}</b><small>${ch.t}s</small></p></div><p class="mn-k qz-verdict">${w > 0 ? `You beat ${ESC(ch.n)}.` : w < 0 ? `${ESC(ch.n)} wins this one.` : 'Dead heat.'}${me.s === ch.s && w ? ' Same score, so the quicker time takes it.' : ''}</p>` }
      body = `<p class="mn-tk">${G.kind === 'daily' ? `${G.kids ? "Kids' daily" : 'Daily quiz'} No. ${today() - DAY0 + 1}` : ch ? `${ESC(ch.n)}'s challenge` : 'Your score'}</p>
        <p class="qz-big">${me.s}<small>/${G.qs.length}</small></p><p class="qz-grid" aria-label="${me.s} right out of ${G.qs.length}">${grid(me.r)}</p>
        ${vs || `<p class="mn-k">${line}</p>`}
        <div class="mn-actions">${G.kind === 'daily' ? `<button type="button" class="mn-go" id="qzShareDay">Share my score</button>`
          : `<button type="button" class="mn-go" id="qzSend">${ch ? `Send it back to ${ESC(ch.n)}` : 'Send this challenge'}</button>`}
          <button type="button" class="mn-ghost" id="qzHub">Back to Quiz night</button></div>
        ${G.kind === 'chal' && !ch ? `<p class="qz-cs">Your friend gets these same 10 questions and sees your score at the end.</p>` : ''}`;
    }
    panel.innerHTML = `<div class="mn-hand qz-end">${body}</div><details class="qz-review"><summary>See the answers</summary><ol>${G.qs.map((q, i) => {
      const f = byId.get(q.id), r = G.players[i % P.length].r[Math.floor(i / P.length)] === '1';
      return `<li class="${r ? 'ok' : 'no'}"><span>${P.length > 1 ? ESC(G.players[i % P.length].n) + ': ' : ''}${ESC(q.t === 'w' ? q.film + ': ' + q.q : q.q)}</span><b>${ESC(q.o[q.c])}</b><button type="button" class="mn-link" data-film="${ESC(q.id)}">Open the ${ESC(f.title)} menu</button></li>`
    }).join('')}</ol></details>`;
    const on = (id, fn) => { const b = $(id); if (b) b.onclick = fn };
    on('qzShareDay', e => shareDaily(e.currentTarget));
    on('qzSend', e => shareChal(e.currentTarget));
    on('qzHub', () => { G = null; saveG(); hub() });
    on('qzAgain', () => { const players = G.players.map(p => ({ n: p.n, s: 0, r: '' })); need(() => start('pass', { players, rounds: G.rounds })) });
    on('qzSpin', () => { G = null; saveG(); spinBtn.click(); setTimeout(() => { const s = $('spin'); s && s.click() }, 350) });
    panel.querySelectorAll('[data-film]').forEach(b => b.onclick = () => { const f = byId.get(b.dataset.film); if (f && typeof show === 'function') { spinBtn.click(); show(f) } });
    const g = panel.querySelector('.mn-go'); g && g.focus();
    say(G.kind === 'pass' ? 'Final scores are in.' : `You got ${me.s} out of ${G.qs.length}.`);
  }

  /* ---------- sharing ---------- */
  async function send(text, url, b, title) {
    try { if (navigator.share) { await navigator.share({ title: title || 'Reel Dinner Quiz night', text }); return } } catch (e) { return }
    try { await navigator.clipboard.writeText(text); if (b) b.textContent = 'Copied, paste it in a text' } catch (e) { if (b) b.textContent = url }
  }
  function shareDaily(b) {
    const k = isKids(), d = S.days[dayKey(k)]; if (!d) return;
    const url = siteURL() + '?quiz=daily';
    send(`Reel Dinner ${k ? "Kids' daily" : 'Daily quiz'} No. ${today() - DAY0 + 1}\n${d.s}/10 ${grid(d.r)}${streak() > 1 ? `\n${streak()} day streak` : ''}\n${url}`, url, b);
    count('share-daily', 'Quiz: share daily');
  }
  function shareChal(b) {
    const me = G.players[0], secs = Math.round(G.ms / 1000);
    const url = `${siteURL()}?quiz=c-${G.seed.toString(36)}-${me.s}-${secs}-${(G.kids ? 1 : 0) + (G.np ? 2 : 0)}&by=${encodeURIComponent(me.n)}`;
    send(`I got ${me.s}/10 on the Reel Dinner film quiz. Same 10 questions, think you can beat me?\n${url}`, url, b);
    count('share-challenge', 'Quiz: send challenge');
  }

  /* ---------- a challenge link: who sent it, their score, then the same 10 ---------- */
  function inviteScreen() {
    view = 'invite';
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">Quiz night challenge</p><h2 class="mn-t">${ESC(pend.n)} got ${pend.s}/10</h2>
      <p class="mn-k">Same 10 film questions, same order. Beat the score, or match it quicker.${pend.kids ? ' Kid-safe films only.' : ''}</p>
      <div class="mn-actions"><button type="button" class="mn-go" id="qzTake">Take the challenge</button></div><button type="button" class="mn-quit" id="qzBack">Not now</button></div>`;
    $('qzTake').focus();
    $('qzTake').onclick = () => { const ch = { n: pend.n, s: pend.s, t: pend.t }, o = { seed: pend.seed, kids: pend.kids, np: pend.np, ch }; pend = null; need(() => start('chal', o)) };
    $('qzBack').onclick = () => { pend = null; hub() };
  }

  /* ---------- the tab: Spin it, Match it, Quiz it ---------- */
  let on = false;
  function open(v) {
    if (!on) { if (matchBtn.getAttribute('aria-selected') === 'true') spinBtn.click() }
    on = true;
    spinBtn.setAttribute('aria-selected', 'false'); matchBtn.setAttribute('aria-selected', 'false'); quizBtn.setAttribute('aria-selected', 'true');
    deckEl.classList.add('quizzing'); document.body.classList.add('quizzing'); panel.hidden = false;
    if (v) view = v;
    if (view === 'q' || view === 'hand' || view === 'end') need(render); else render();
  }
  function close() {
    if (!on) return; on = false; clearTimeout(adv);
    quizBtn.setAttribute('aria-selected', 'false');
    deckEl.classList.remove('quizzing'); document.body.classList.remove('quizzing'); panel.hidden = true;
    /* a game left mid-question picks up where it was when the tab comes back */
    if (G && view === 'q' && panel.querySelector('.qz-opts.done')) view = G.i >= G.qs.length ? 'end' : G.players.length > 1 ? 'hand' : 'q';
  }
  quizBtn.addEventListener('click', () => open());
  spinBtn.addEventListener('click', close);
  matchBtn.addEventListener('click', close);
  /* kids' mode switching while the hub is open swaps the daily over */
  document.addEventListener('change', () => { if (on && view === 'hub') setTimeout(hub, 0) });

  /* ?quiz=daily or ?quiz=c-SEED-SCORE-SECS-KIDS&by=NAME opens straight to it */
  const u = new URLSearchParams(location.search), qp = u.get('quiz'), by = u.get('by');
  if (qp) {
    try { u.delete('quiz'); u.delete('by'); history.replaceState(null, '', location.pathname + (u.toString() ? '?' + u : '')) } catch (e) { }
    const m = /^c-([0-9a-z]{1,8})-(\d{1,2})-(\d{1,5})-([0-3])$/.exec(qp);
    if (typeof setView === 'function') try { setView('wheel') } catch (e) { }
    if (m && parseInt(m[1], 36)) { pend = { seed: parseInt(m[1], 36), s: Math.min(10, +m[2]), t: +m[3], kids: !!(+m[4] & 1), np: !!(+m[4] & 2), n: String(by || '').trim().slice(0, 20) || 'A friend' }; G = null; saveG(); open('invite') }
    else if (qp === 'daily') { G = null; saveG(); open('hub') }
    count('link', 'Quiz: opened a link');
  }
  else if (G) { /* a game in progress survives a reload, but the tab only opens when the person taps it */ }
  window.RDQuiz = { open, deal: (seed, kids, n, np) => loadData().then(() => deal(seed, kids, n, np)) };
})();
