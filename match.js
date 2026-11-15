/* Match night: the second way to pick a film in the cinema (Spin it or Match it).
   Two people swipe the same 20-card deck. Tap a card to flip from the poster to a menu teaser (venue, three
   headline dishes, the house drink, in the film's menu colours). Right keeps, left skips. The first film both
   people keep is tonight's feature, revealed on the marquee.
   Pass the phone (default): player one swipes all 20, hands over, player two gets the same 20 in another order. Works offline.
   Room code: one person starts a room and texts the 4-letter code; both swipe on their own phones, matches show on both.
   Rooms live in the Reel Dinner Supabase project behind five functions (match_create, match_join, match_swipe,
   match_unswipe, match_state, plus match_pick for the decider). Rooms wipe themselves after 12 hours. No sign-ins.
   No match after 20: both lists side by side, each person picks one from the other's list, and a two-slot spin
   on the wheel decides.
   Decks only use films whose menus passed the fact and vibe audits (data/match-deck.json, scripts/build-match.cjs).
   Loads after app.js and uses its globals: FILMS, TMDB_POSTERS, TMDB_IMG, show, spin, ESC, shuffle, pick, buzz, fanfare. */
(function () {
  'use strict';
  const RPC = 'https://zpcgxupmclkxbzikdnfb.supabase.co/rest/v1/rpc/', KEY = 'sb_publishable_xKYQtgzsYWRLh843SrO9bQ_CfWc30ME';
  const VIBES = [['comedy', 'Comedy'], ['horror', 'Horror'], ['family', 'Family'], ['date', 'Date night'], ['action', 'Action'], ['any', 'Surprise me']];
  const DECK = 20, POLL = 2000;
  const byId = new Map(FILMS.map(f => [f.id, f]));
  const panel = $('matchPanel'), live = $('matchLive');
  if (!panel) return;
  let DATA = null, dataP = null;
  const loadDeck = () => dataP || (dataP = fetch('data/match-deck.json' + (window.DATA_V && DATA_V.match ? '?v=' + DATA_V.match : '')).then(r => { if (!r.ok) throw 0; return r.json() }).then(d => (DATA = d)).catch(e => { dataP = null; throw e }));

  /* the night: who is swiping, the deck, each player's order, keeps and skips */
  let M = null;
  const fresh = () => ({ step: 'setup', vibe: 'any', style: 'pass', deck: [], order: {}, at: { 1: 0, 2: 0 }, keep: { 1: [], 2: [] }, hist: { 1: [], 2: [] }, p: 1, match: null, backups: [], picks: {}, room: null, flipped: false });
  M = fresh();
  try { const s = JSON.parse(sessionStorage.getItem('rd-match') || 'null'); if (s && s.room && s.room.code) M = Object.assign(fresh(), s) } catch (e) { }
  const save = () => { try { if (M.room) sessionStorage.setItem('rd-match', JSON.stringify(M)); else sessionStorage.removeItem('rd-match') } catch (e) { } };
  const say = t => { if (live) { live.textContent = ''; setTimeout(() => { live.textContent = t }, 30) } };
  const film = id => byId.get(id);
  const vibeName = k => (VIBES.find(v => v[0] === k) || VIBES[5])[1];
  const who = p => M.room ? (p === M.room.me ? 'You' : 'Them') : p === 1 ? 'Player one' : 'Player two';
  const other = p => p === 1 ? 2 : 1;
  const poster = id => typeof TMDB_POSTERS !== 'undefined' && TMDB_POSTERS[id] ? TMDB_IMG + 'w500' + TMDB_POSTERS[id] : '';
  const rpc = (fn, body) => fetch(RPC + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error(r.status); return r.json() });

  /* ---------- Spin it or Match it ---------- */
  const spinBtn = $('modeSpin'), matchBtn = $('modeMatch'), deckEl = panel.closest('.deck');
  function mode(m) {
    const on = m === 'match';
    spinBtn.setAttribute('aria-selected', String(!on)); matchBtn.setAttribute('aria-selected', String(on));
    deckEl.classList.toggle('matching', on); document.body.classList.toggle('matching', on); panel.hidden = !on;
    if (on) { loadDeck().then(render, () => { panel.innerHTML = `<p class="mn-k">Match night needs the film list. Check your connection and try again.</p>` }); render() }
    else stopPoll();
  }
  spinBtn.addEventListener('click', () => mode('spin'));
  matchBtn.addEventListener('click', () => mode('match'));

  /* ---------- dealing ---------- */
  function pool(vibe) {
    let ids = Object.keys(DATA.films).filter(id => byId.has(id));
    if (vibe !== 'any') ids = ids.filter(id => DATA.films[id].vb.includes(vibe));
    if (typeof kidsMode !== 'undefined' && kidsMode && typeof isKidSafe === 'function') ids = ids.filter(id => isKidSafe(film(id)));
    /* offline, only films whose menus are saved on this device */
    if (navigator.onLine === false && typeof SAVED !== 'undefined' && typeof filmPath === 'function') { const s = ids.filter(id => SAVED.has(filmPath(film(id)))); if (s.length) ids = s }
    return ids;
  }
  function deal() {
    const ids = shuffle(pool(M.vibe)).slice(0, DECK);
    M.deck = ids; M.order = { 1: ids.slice(), 2: shuffle(ids) };
    /* person two gets the same films in a different order: no peeking at what the first card was */
    if (ids.length > 2) while (M.order[2][0] === M.order[1][0]) M.order[2] = shuffle(ids);
    M.at = { 1: 0, 2: 0 }; M.keep = { 1: [], 2: [] }; M.hist = { 1: [], 2: [] }; M.p = 1; M.match = null; M.backups = []; M.picks = {}; M.flipped = false;
  }

  /* ---------- screens ---------- */
  function render() {
    if (panel.hidden) return;
    if (!DATA) { panel.innerHTML = `<p class="mn-k">Shuffling the deck</p>`; return }
    const s = M.step;
    if (s === 'setup') return setup();
    if (s === 'lobby') return lobby();
    if (s === 'swipe') return swipe();
    if (s === 'hand') return handover();
    if (s === 'wait') return waiting();
    if (s === 'nomatch') return noMatch();
    if (s === 'done') return done();
  }

  function setup() {
    panel.innerHTML = `<div class="mn-head"><h2 class="mn-t">Match night</h2><p class="mn-k">Two of you swipe the same 20 films. The first one you both keep is tonight's feature, menu and all.</p></div>
      <fieldset class="mn-set"><legend>Pick a vibe</legend><div class="mn-chips" role="radiogroup" aria-label="Vibe">${VIBES.map(([k, l]) => `<button type="button" role="radio" class="mn-chip" data-vibe="${k}" aria-checked="${M.vibe === k}">${l}<small>${k === 'any' ? Object.keys(DATA.films).length : pool(k).length}</small></button>`).join('')}</div></fieldset>
      <fieldset class="mn-set"><legend>How you're playing</legend><div class="mn-chips" role="radiogroup" aria-label="How you're playing">
        <button type="button" role="radio" class="mn-chip wide" data-style="pass" aria-checked="${M.style === 'pass'}">Pass the phone<small>One phone, take turns</small></button>
        <button type="button" role="radio" class="mn-chip wide" data-style="room" aria-checked="${M.style === 'room'}">Room code<small>A phone each, swipe together</small></button></div></fieldset>
      ${M.style === 'room' ? `<div class="mn-actions"><button type="button" class="mn-go" id="mnStart">Start a room</button></div>
        <form class="mn-join" id="mnJoin"><label for="mnCode">Got a code?</label><input id="mnCode" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="TACO" inputmode="text"><button type="submit" class="mn-ghost">Join</button></form>`
        : `<div class="mn-actions"><button type="button" class="mn-go" id="mnDeal">Deal 20 films</button></div>`}
      <p class="mn-err" id="mnErr" role="alert"></p>`;
    panel.querySelectorAll('[data-vibe]').forEach(b => b.onclick = () => { M.vibe = b.dataset.vibe; setup() });
    panel.querySelectorAll('[data-style]').forEach(b => b.onclick = () => { M.style = b.dataset.style; setup() });
    const d = $('mnDeal'); if (d) d.onclick = () => { deal(); if (!M.deck.length) return err('No films for that vibe right now. Try another.'); M.step = 'swipe'; say(`20 films dealt. ${who(1)} first.`); render() };
    const st = $('mnStart'); if (st) st.onclick = startRoom;
    const j = $('mnJoin'); if (j) j.onsubmit = e => { e.preventDefault(); joinRoom($('mnCode').value) };
  }
  const err = t => { const e = $('mnErr'); if (e) e.textContent = t };

  /* the card: poster on the front, the menu teaser on the back in the film's colours */
  function cardHTML(id, top) {
    const f = film(id), d = DATA.films[id] || {}, [dark, acc] = d.c || ['#2a0d0d', '#c9a227'], src = poster(id);
    const af = typeof dietAF === 'function' && dietAF();
    const drink = d.k && !(af && d.k.a) ? d.k.n : '';
    return `<div class="mn-card${top ? ' mn-top' : ''}${top && M.flipped ? ' flip' : ''}" data-id="${ESC(id)}" ${top ? `tabindex="0" role="button" aria-label="${ESC(f.title)} (${f.year}). Tap to ${M.flipped ? 'see the poster' : 'see the menu'}"` : 'aria-hidden="true"'} style="--mn-dark:${dark};--mn-acc:${acc}">
      <div class="mn-face mn-front">${src ? `<img src="${src}" alt="" loading="${top ? 'eager' : 'lazy'}" crossorigin="anonymous" onerror="this.remove()">` : ''}<div class="mn-fb"><b>${ESC(f.title)}</b><span>${f.year}</span></div><div class="mn-cap"><b>${ESC(f.title)}</b> <span>${f.year}</span></div><i class="mn-stamp keep">Keep</i><i class="mn-stamp skip">Skip</i></div>
      <div class="mn-face mn-back"><p class="mn-tk">Tonight at</p><p class="mn-ve">${ESC(d.ve || f.title)}</p><p class="mn-fl">${ESC(f.title)} <span>${f.year}</span></p>
        <p class="mn-tk">On the menu</p><ul class="mn-dish">${(d.d || []).map(n => `<li>${ESC(n)}</li>`).join('')}</ul>
        ${drink ? `<p class="mn-tk">House drink</p><p class="mn-dr">${ESC(drink)}</p>` : ''}<p class="mn-flipk">Tap for the poster</p><i class="mn-stamp keep">Keep</i><i class="mn-stamp skip">Skip</i></div></div>`;
  }

  function swipe() {
    const p = M.p, ord = M.order[p], i = M.at[p];
    if (i >= ord.length) return finish(p);
    const next = ord[i + 1];
    panel.innerHTML = `<div class="mn-bar"><span class="mn-who">${who(p)}</span><span class="mn-n">${i + 1} of ${ord.length}</span>${M.room ? `<span class="mn-code" title="Room code">Room ${M.room.code}</span>` : ''}<span class="mn-vb">${vibeName(M.vibe)}</span></div>
      ${M.room ? `<p class="mn-them" id="mnThem">${themLine()}</p>` : ''}
      <div class="mn-stack">${next ? cardHTML(next, false) : ''}${cardHTML(ord[i], true)}</div>
      <p class="mn-hint">Tap the card for the menu. Swipe right to keep, left to skip.</p>
      <div class="mn-btns"><button type="button" class="mn-b skip" id="mnSkip" aria-label="Skip">${ICON.x}<span>Skip</span></button><button type="button" class="mn-b undo" id="mnUndo" aria-label="Undo" ${M.hist[p].length ? '' : 'disabled'}>${ICON.undo}<span>Undo</span></button><button type="button" class="mn-b keep" id="mnKeep" aria-label="Keep">${ICON.heart}<span>Keep</span></button></div>
      ${M.backups.length || M.match ? `<p class="mn-bk">Tonight's feature: <b>${ESC(film(M.match).title)}</b>${M.backups.length ? `. Backups: ${M.backups.map(id => ESC(film(id).title)).join(', ')}` : ''}</p>` : ''}
      <button type="button" class="mn-quit" id="mnQuit">Start over</button>`;
    $('mnSkip').onclick = () => decide(false);
    $('mnKeep').onclick = () => decide(true);
    $('mnUndo').onclick = undo;
    $('mnQuit').onclick = quit;
    drag(panel.querySelector('.mn-card.mn-top'));
  }
  const ICON = {
    x: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    heart: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>',
    undo: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 7L4 12l5 5"/><path d="M4 12h10a6 6 0 0 1 0 12h-2" transform="translate(0 -6)"/></svg>'
  };

  /* drag to swipe, tap to flip; arrow keys and space do the same */
  function drag(card) {
    if (!card) return;
    let x0 = 0, y0 = 0, dx = 0, down = false, moved = false, id = null;
    const set = () => { card.style.transform = `translateX(${dx}px) rotate(${dx / 18}deg)`; card.style.setProperty('--k', Math.min(1, Math.abs(dx) / 90)); card.classList.toggle('to-keep', dx > 20); card.classList.toggle('to-skip', dx < -20) };
    card.addEventListener('pointerdown', e => { if (e.button > 0) return; down = true; moved = false; dx = 0; x0 = e.clientX; y0 = e.clientY; id = e.pointerId; card.classList.add('dragging') });
    card.addEventListener('pointermove', e => {
      if (!down || e.pointerId !== id) return;
      const mx = e.clientX - x0, my = e.clientY - y0;
      if (!moved && Math.abs(mx) > 8 && Math.abs(mx) > Math.abs(my)) { moved = true; try { card.setPointerCapture(id) } catch (er) { } }
      if (moved) { dx = mx; set(); e.preventDefault() }
    });
    const up = e => {
      if (!down || (e && e.pointerId !== id)) return; down = false; card.classList.remove('dragging');
      if (!moved) { flip(card); return }
      if (Math.abs(dx) > 90) { decide(dx > 0, dx); return }
      dx = 0; card.style.transform = ''; card.classList.remove('to-keep', 'to-skip');
    };
    card.addEventListener('pointerup', up); card.addEventListener('pointercancel', () => { down = false; dx = 0; card.style.transform = ''; card.classList.remove('dragging', 'to-keep', 'to-skip') });
    card.addEventListener('keydown', e => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); flip(card) } });
  }
  function flip(card) { M.flipped = !M.flipped; card.classList.toggle('flip', M.flipped); card.setAttribute('aria-label', card.getAttribute('aria-label').replace(/Tap to .*$/, 'Tap to ' + (M.flipped ? 'see the poster' : 'see the menu'))); if (M.flipped) say('Menu: ' + (DATA.films[card.dataset.id].d || []).join(', ')) }
  addEventListener('keydown', e => {
    if (panel.hidden || M.step !== 'swipe' || e.altKey || e.ctrlKey || e.metaKey) return;
    if (/input|select|textarea/i.test((e.target && e.target.tagName) || '')) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); decide(true) } else if (e.key === 'ArrowLeft') { e.preventDefault(); decide(false) }
    else if ((e.key === 'z' || e.key === 'Backspace') && M.hist[M.p].length) { e.preventDefault(); undo() }
  });

  let busy = false;
  function decide(keep, dx) {
    if (busy || M.step !== 'swipe') return;
    const p = M.p, id = M.order[p][M.at[p]]; if (!id) return;
    busy = true;
    const card = panel.querySelector('.mn-card.mn-top');
    if (card) { card.classList.add(keep ? 'to-keep' : 'to-skip', 'gone'); card.style.setProperty('--k', 1); card.style.transform = `translateX(${(keep ? 1 : -1) * (reduce ? 20 : 140)}%) rotate(${keep ? 18 : -18}deg)` }
    buzz(keep ? [20, 30, 20] : 12);
    M.hist[p].push(id); M.at[p]++; if (keep) M.keep[p].push(id); M.flipped = false;
    if (M.room) rpc('match_swipe', { p_code: M.room.code, p_player: p, p_film: id, p_keep: keep }).catch(() => { M.room.offline = 1 });
    save();
    setTimeout(() => {
      busy = false;
      /* pass the phone: player two keeping a film player one kept is a match */
      if (keep && !M.room && p === 2 && M.keep[1].includes(id)) { if (!M.match) { M.match = id; render(); return reveal(id, true) } M.backups.push(id); say(`Backup: ${film(id).title}`) }
      if (M.room) checkRoom();
      render();
    }, reduce ? 60 : 260);
  }
  function undo() {
    const p = M.p, id = M.hist[p].pop(); if (!id) return;
    M.at[p]--; M.keep[p] = M.keep[p].filter(x => x !== id); M.backups = M.backups.filter(x => x !== id);
    if (M.match === id) M.match = null;
    M.flipped = false;
    if (M.room) rpc('match_unswipe', { p_code: M.room.code, p_player: p, p_film: id }).catch(() => { });
    save(); say('Back one card'); render();
  }
  function finish(p) {
    if (M.room) { M.step = 'wait'; save(); checkRoom(); return render() }
    if (p === 1) { M.step = 'hand'; return render() }
    M.step = M.match ? 'done' : 'nomatch'; render();
  }

  function handover() {
    const n = M.keep[1].length;
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">Player one is done</p><h2 class="mn-t">Pass the phone</h2><p class="mn-k">${n ? `${n} kept, and no peeking.` : 'Nothing kept yet, so it is all on player two.'} Player two gets the same 20 films in a different order.</p>
      <div class="mn-actions"><button type="button" class="mn-go" id="mnP2">I'm player two, deal me in</button></div><button type="button" class="mn-quit" id="mnBack">Back to my cards</button></div>`;
    $('mnP2').onclick = () => { M.p = 2; M.step = 'swipe'; say('Player two, your turn'); render() };
    $('mnBack').onclick = () => { M.step = 'swipe'; undo() };
  }

  /* ---------- the marquee reveal ---------- */
  function reveal(id, more, fromSpin) {
    const f = film(id), d = DATA.films[id] || {}, src = poster(id);
    const left = M.order[M.p] && M.at[M.p] < M.order[M.p].length && M.step === 'swipe';
    const box = document.createElement('div');
    box.className = 'mn-reveal'; box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', "Tonight's feature");
    box.innerHTML = `<div class="mn-rv"><div class="mn-bulbs" aria-hidden="true"></div><p class="mn-rk">Tonight's feature</p>
      ${src ? `<img class="mn-rp" src="${src}" alt="${ESC(f.title)} poster" crossorigin="anonymous" onerror="this.remove()">` : ''}
      <h2 class="mn-rt">${ESC(f.title)}</h2><p class="mn-ry">${f.year}${d.ve ? ` · dinner at ${ESC(d.ve)}` : ''}</p>
      <p class="mn-rw">${fromSpin ? 'The wheel has spoken.' : 'You both kept it.'}</p>
      <div class="mn-actions"><button type="button" class="mn-go" id="mnOpen">Open the menu</button>${more && left ? `<button type="button" class="mn-ghost" id="mnMore">Keep swiping for a backup</button>` : ''}</div></div>`;
    document.body.appendChild(box);
    try { fanfare() } catch (e) { } buzz([30, 50, 90]);
    say(`Tonight's feature: ${f.title}`);
    const close = () => { box.remove(); document.removeEventListener('keydown', esc) };
    const esc = e => {
      if (e.key === 'Escape') return close();
      /* keep Tab inside the reveal */
      if (e.key === 'Tab') { const b = [...box.querySelectorAll('button')]; if (!b.length) return; const i = b.indexOf(document.activeElement); if (e.shiftKey && i <= 0) { e.preventDefault(); b[b.length - 1].focus() } else if (!e.shiftKey && i === b.length - 1) { e.preventDefault(); b[0].focus() } else if (i < 0) { e.preventDefault(); b[0].focus() } }
    };
    document.addEventListener('keydown', esc);
    $('mnOpen').onclick = () => { close(); openMenu(id, fromSpin) };
    const mo = $('mnMore'); if (mo) mo.onclick = () => { close(); render() };
    setTimeout(() => $('mnOpen').focus(), 50);
  }
  function openMenu(id, already) {
    const f = film(id);
    stopPoll(); M.step = 'done'; save();
    mode('spin');
    const go = () => { const t = $('theatre'); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' }) };
    if (already) return go();
    try { $('now').textContent = f.title } catch (e) { }
    Promise.resolve(show(f, true)).then(() => { try { openCurtains(); addHistory(f); announceFilm(f) } catch (e) { } go() }, go);
  }

  function done() {
    const id = M.match;
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">Tonight's feature</p><h2 class="mn-t">${ESC(film(id).title)}</h2>${M.backups.length ? `<p class="mn-k">Backups if it's not streaming anywhere: ${M.backups.map(b => `<button type="button" class="mn-link" data-open="${ESC(b)}">${ESC(film(b).title)}</button>`).join(', ')}</p>` : ''}
      <div class="mn-actions"><button type="button" class="mn-go" id="mnOpen2">Open the menu</button><button type="button" class="mn-ghost" id="mnAgain">New Match night</button></div></div>`;
    $('mnOpen2').onclick = () => openMenu(id);
    $('mnAgain').onclick = quit;
    panel.querySelectorAll('[data-open]').forEach(b => b.onclick = () => openMenu(b.dataset.open));
  }

  /* ---------- no match: pick one from each other's list, then a two-slot spin ---------- */
  function noMatch() {
    const k1 = M.keep[1], k2 = M.keep[2];
    if (!k1.length && !k2.length) {
      panel.innerHTML = `<div class="mn-hand"><h2 class="mn-t">Tough crowd</h2><p class="mn-k">Neither of you kept a single film. Try another vibe.</p><div class="mn-actions"><button type="button" class="mn-go" id="mnAgain">New deck</button></div></div>`;
      $('mnAgain').onclick = quit; return;
    }
    /* whose turn to pick: each person picks from the other person's keeps. If one list is empty, the person
       with nothing kept picks from the other list, and that pick wins (the other person already said yes to it) */
    const need = [1, 2].filter(p => M.keep[other(p)].length && !M.picks[p]);
    const mine = M.room ? M.room.me : need[0];
    const lists = [1, 2].map(p => `<div class="mn-col"><p class="mn-tk">${who(p)} kept ${M.keep[p].length}</p><ul>${M.keep[p].map(id => {
      const can = mine && other(mine) === p && !M.picks[mine];
      const chosen = M.picks[other(p)] === id;
      return `<li>${can ? `<button type="button" class="mn-pick" data-pick="${ESC(id)}">${ESC(film(id).title)} <span>${film(id).year}</span></button>` : `<span class="mn-li${chosen ? ' on' : ''}">${ESC(film(id).title)} <span>${film(id).year}</span>${chosen ? ' <b>picked</b>' : ''}</span>`}</li>`
    }).join('') || '<li class="mn-none">Nothing</li>'}</ul></div>`).join('');
    const ready = [1, 2].every(p => !M.keep[other(p)].length || M.picks[p]);
    const picks = [M.picks[1], M.picks[2]].filter(Boolean);
    let line;
    if (ready) line = picks.length === 2 && picks[0] !== picks[1] ? 'Both picked. Spin the wheel to settle it.' : `Settled: ${film(picks[0]).title}.`;
    else if (M.room && !need.includes(M.room.me)) line = 'Waiting for them to pick from your list.';
    else line = `${who(mine)}, pick one from ${M.room ? 'their' : who(other(mine)).toLowerCase() + "'s"} list.`;
    panel.innerHTML = `<div class="mn-nm"><p class="mn-tk">No match in 20</p><h2 class="mn-t">Meet in the middle</h2><p class="mn-k" aria-live="polite">${line}</p><div class="mn-cols">${lists}</div>
      ${ready ? `<div class="mn-actions"><button type="button" class="mn-go" id="mnDecide">${picks.length === 2 && picks[0] !== picks[1] ? 'Spin for it' : 'Open the menu'}</button></div>` : ''}<button type="button" class="mn-quit" id="mnQuit">Start over</button></div>`;
    panel.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => {
      M.picks[mine] = b.dataset.pick; save();
      if (M.room) rpc('match_pick', { p_code: M.room.code, p_player: mine, p_film: b.dataset.pick }).catch(() => { });
      render();
    });
    const dc = $('mnDecide'); if (dc) dc.onclick = () => picks.length === 2 && picks[0] !== picks[1] ? decider(picks) : (M.match = picks[0], openMenu(picks[0]));
    $('mnQuit').onclick = quit;
  }
  /* the two-slot spin: the real wheel with the two picks on alternate wedges. In a room both phones land on
     the same film: the winner comes from the room code and the two picks, not from chance on each phone */
  function decider(pair) {
    let win;
    if (M.room) { let h = 0; for (const ch of M.room.code + pair.slice().sort().join('|')) h = (h * 31 + ch.charCodeAt(0)) >>> 0; win = pair.slice().sort()[h % 2] }
    else win = pick(pair);
    M.match = win; save();
    mode('spin');
    const t = document.querySelector('.wheel-wrap'); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    window.spinForce = { pair: pair.map(film), win: film(win), done: () => reveal(win, false, true) };
    setTimeout(() => spin(), reduce ? 0 : 500);
  }

  function quit() { stopPoll(); const keepVibe = M.vibe, keepStyle = M.style; M = fresh(); M.vibe = keepVibe; M.style = keepStyle; save(); render() }

  /* ---------- room codes ---------- */
  async function startRoom() {
    err(''); const b = $('mnStart'); b.disabled = true; b.textContent = 'Opening the room';
    deal(); if (!M.deck.length) { b.disabled = false; b.textContent = 'Start a room'; return err('No films for that vibe right now. Try another.') }
    try {
      const code = await rpc('match_create', { p_vibe: M.vibe, p_deck: M.deck });
      M.room = { code, me: 1, them: 0, seen: 0 }; M.p = 1; M.step = 'lobby'; save(); render(); poll();
    } catch (e) { b.disabled = false; b.textContent = 'Start a room'; err("Couldn't open a room. Check your connection, or play Pass the phone instead.") }
  }
  async function joinRoom(raw) {
    const code = String(raw || '').toUpperCase().replace(/[^A-Z]/g, '');
    if (code.length !== 4) return err('Codes are four letters, like TACO.');
    err('');
    try {
      const r = await rpc('match_join', { p_code: code });
      if (!r || !r.deck) return err("That room isn't open. Check the code, rooms close after 12 hours.");
      const ids = r.deck.filter(id => byId.has(id));
      if (!ids.length) return err("That room's films aren't on this version of the site. Refresh and try again.");
      M.vibe = r.vibe || 'any'; M.deck = ids; M.order = { 1: ids.slice(), 2: shuffle(ids) };
      M.at = { 1: 0, 2: 0 }; M.keep = { 1: [], 2: [] }; M.hist = { 1: [], 2: [] }; M.match = null; M.backups = []; M.picks = {};
      M.room = { code, me: 2, them: 0, seen: 0 }; M.p = 2; M.step = 'swipe'; save(); say('Joined room ' + code); render(); poll();
    } catch (e) { err("Couldn't reach the room. Check your connection.") }
  }
  function lobby() {
    const code = M.room.code, url = location.origin + location.pathname + '?match=' + code;
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">Your room</p><p class="mn-big" aria-label="Room code ${code.split('').join(' ')}">${code}</p>
      <p class="mn-k">Text this code to the other person. They open Reel Dinner, tap Match it, then Room code, and type it in. Or send the link.</p>
      <div class="mn-actions"><button type="button" class="mn-ghost" id="mnShare">Send the code</button><button type="button" class="mn-go" id="mnGo">Start swiping</button></div>
      <p class="mn-k" id="mnThem">${M.room.them ? 'They are in.' : 'Waiting for them to join. You can start swiping now.'}</p><button type="button" class="mn-quit" id="mnQuit">Close the room</button></div>`;
    $('mnShare').onclick = async () => {
      const text = `Match night on Reel Dinner. Room code ${code}: ${url}`;
      try { if (navigator.share) { await navigator.share({ title: 'Reel Dinner Match night', text }); return } } catch (e) { return }
      try { await navigator.clipboard.writeText(text); $('mnShare').textContent = 'Copied, paste it in a text' } catch (e) { $('mnShare').textContent = url }
    };
    $('mnGo').onclick = () => { M.step = 'swipe'; save(); render() };
    $('mnQuit').onclick = quit;
  }
  const themLine = () => { const r = M.room; if (!r) return ''; if (!r.them) return 'Waiting for them to join'; return r.seen >= M.deck.length ? 'They have finished swiping' : `They are on card ${Math.min(r.seen + 1, M.deck.length)} of ${M.deck.length}` };
  function waiting() {
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">You're done</p><h2 class="mn-t">Over to them</h2><p class="mn-k" id="mnThem">${themLine()}. A match pops up the moment you both keep the same film.</p>
      <p class="mn-k">You kept ${M.keep[M.room.me].length}.</p><button type="button" class="mn-quit" id="mnBack">Back to my last card</button> <button type="button" class="mn-quit" id="mnQuit">Leave the room</button></div>`;
    $('mnBack').onclick = () => { M.step = 'swipe'; undo() };
    $('mnQuit').onclick = quit;
  }
  let timer = 0;
  function poll() { stopPoll(); if (!M.room) return; timer = setInterval(checkRoom, POLL); checkRoom() }
  function stopPoll() { if (timer) clearInterval(timer); timer = 0 }
  let checking = false;
  async function checkRoom() {
    if (!M.room || checking) return;
    checking = true;
    let st = null;
    try { st = await rpc('match_state', { p_code: M.room.code }) } catch (e) { checking = false; return }
    checking = false;
    if (!st) { stopPoll(); M.room = null; save(); panel.innerHTML = `<div class="mn-hand"><h2 class="mn-t">Room closed</h2><p class="mn-k">Rooms close after 12 hours.</p><div class="mn-actions"><button type="button" class="mn-go" id="mnAgain">New Match night</button></div></div>`; $('mnAgain').onclick = quit; return }
    const me = M.room.me, them = other(me), sw = st.swipes || [];
    const tk = sw.filter(s => s.p === them);
    M.room.them = st.players > 1 || tk.length ? 1 : 0; M.room.seen = tk.length;
    M.keep[them] = tk.filter(s => s.k).map(s => s.f);
    /* picks for the decider */
    if (st.picks) for (const k of ['1', '2']) if (st.picks[k]) M.picks[+k] = st.picks[k];
    /* the first film both kept, in the order the second keep landed */
    const mineK = new Set(M.keep[me]), theirK = new Set(M.keep[them]);
    let first = null; const both = [];
    for (const s of sw) if (s.k && mineK.has(s.f) && theirK.has(s.f) && !both.includes(s.f)) { both.push(s.f) }
    if (both.length) {
      /* order by when the film became mutual: the later of the two keeps */
      const when = f => Math.max(...sw.map((s, i) => s.f === f && s.k ? i : -1));
      both.sort((a, b) => when(a) - when(b)); first = both[0];
    }
    const el = $('mnThem'); if (el) el.textContent = M.step === 'lobby' ? (M.room.them ? 'They are in.' : 'Waiting for them to join. You can start swiping now.') : themLine() + (M.step === 'wait' ? '. A match pops up the moment you both keep the same film.' : '');
    if (first && !M.match) { M.match = first; M.backups = both.slice(1); save(); if (M.step === 'wait') M.step = 'done'; render(); reveal(first, true); return }
    if (M.match) { const bk = both.filter(x => x !== M.match); if (bk.join() !== M.backups.join()) { M.backups = bk; save(); if (M.step === 'swipe') render() } }
    const iDone = M.at[me] >= M.deck.length, theyDone = tk.length >= M.deck.length;
    if (iDone && theyDone && !M.match && M.step !== 'nomatch') { M.step = 'nomatch'; save(); render() }
    else if (M.step === 'nomatch') { const key = JSON.stringify(M.picks); if (key !== M._pk) { M._pk = key; render() } }
    if (M.step === 'done' && M.match && iDone) stopPoll();
  }

  /* a link with ?match=TACO opens straight to the join box */
  const q = new URLSearchParams(location.search).get('match');
  if (q && /^[A-Za-z]{4}$/.test(q)) { M = fresh(); M.style = 'room'; mode('match'); loadDeck().then(() => joinRoom(q)); try { history.replaceState(null, '', location.pathname) } catch (e) { } }
  else if (M.room && M.step !== 'setup') { mode('match'); poll() }
})();
