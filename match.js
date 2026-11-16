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
   Dinner Duel (members only, Phase 2): the same deck, played a turn each instead of together. You swipe your 20 and
   send it to a friend (or as a link). They swipe whenever they get to it. The database (supabase/friends.sql) keeps
   the swipes and calls the match, so it works across days and phones. No match: a tie-breaker spin on both keeps.
   Loads after app.js and uses its globals: FILMS, TMDB_POSTERS, TMDB_IMG, show, spin, ESC, shuffle, pick, buzz, fanfare.
   friends.js (loads after this) opens duels through window.RDMatch. */
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
  const fresh = () => ({ step: 'setup', vibe: 'any', style: 'pass', deck: [], order: {}, at: { 1: 0, 2: 0 }, keep: { 1: [], 2: [] }, hist: { 1: [], 2: [] }, p: 1, match: null, backups: [], picks: {}, room: null, duel: null, flipped: false });
  M = fresh();
  /* the night survives a reload (a locked phone or Safari dropping the tab at handover), Pass the phone included.
     A saved night whose films are no longer on the site is dropped */
  try { const s = JSON.parse(sessionStorage.getItem('rd-match') || 'null'); if (s && s.step && s.step !== 'setup' && Array.isArray(s.deck) && s.deck.length && s.deck.every(id => byId.has(id))) M = Object.assign(fresh(), s) } catch (e) { }
  const save = () => { try { if (M.room || M.step !== 'setup') sessionStorage.setItem('rd-match', JSON.stringify(M)); else sessionStorage.removeItem('rd-match') } catch (e) { } };
  const say = t => { if (live) { live.textContent = ''; setTimeout(() => { live.textContent = t }, 30) } };
  const film = id => byId.get(id);
  const vibeName = k => (VIBES.find(v => v[0] === k) || VIBES[5])[1];
  const who = p => M.duel ? (p === M.duel.me ? 'You' : duelName()) : M.room ? (p === M.room.me ? 'You' : 'Them') : M.style === 'solo' ? 'You' : p === 1 ? 'Player one' : 'Player two';
  const duelName = () => (M.duel && M.duel.friend && M.duel.friend.name) || 'Your friend';

  /* Just me: one person swipes, the keeps go on the wheel. The phone remembers the shortlist (films kept and not
     yet picked) and every film already swiped, so a new deck never repeats one until that vibe runs out. No sign-in */
  const SOLO_MAX = 60, WHEEL_MAX = 8;
  const solo = (() => { try { const s = JSON.parse(localStorage.getItem('rd-solo') || 'null'); if (s && Array.isArray(s.seen) && Array.isArray(s.keep)) return s } catch (e) { } return { seen: [], keep: [] } })();
  const soloSave = () => { try { localStorage.setItem('rd-solo', JSON.stringify(solo)) } catch (e) { } };
  const allowed = id => byId.has(id) && DATA && DATA.films[id] && !(typeof kidsMode !== 'undefined' && kidsMode && typeof isKidSafe === 'function' && !isKidSafe(film(id)));
  const shortlist = () => solo.keep.filter(allowed);
  const other = p => p === 1 ? 2 : 1;
  const poster = id => typeof TMDB_POSTERS !== 'undefined' && TMDB_POSTERS[id] ? TMDB_IMG + 'w500' + TMDB_POSTERS[id] : '';
  /* this phone's id for the room: lets the second player back in after a reload, and keeps a third phone out */
  const DEV = (() => { try { let d = localStorage.getItem('rd-dev'); if (!d) { d = Math.random().toString(36).slice(2, 12) + Date.now().toString(36); localStorage.setItem('rd-dev', d) } return d } catch (e) { return '' } })();
  const rpc = (fn, body) => fetch(RPC + fn, { method: 'POST', headers: { apikey: KEY, Authorization: 'Bearer ' + KEY, 'Content-Type': 'application/json' }, body: JSON.stringify(body) }).then(r => { if (!r.ok) throw new Error(r.status); return r.json() });

  /* room writes (swipes, undos, picks) queue up in order and stay queued until the room has them: a dropped
     signal can't lose a keep, and an undo can never land before the swipe it takes back */
  let flushing = false;
  const send = (fn, body) => { if (!M.room) return; (M.room.q || (M.room.q = [])).push([fn, body]); save(); flush() };
  async function flush() {
    if (flushing || !M.room || !M.room.q || !M.room.q.length) return;
    flushing = true;
    try { while (M.room && M.room.q && M.room.q.length) { const [fn, b] = M.room.q[0]; await rpc(fn, b); if (M.room && M.room.q) { M.room.q.shift(); save() } } }
    catch (e) { /* offline for now: the next room check tries again */ }
    flushing = false;
  }

  /* ---------- Spin it or Match it ---------- */
  const spinBtn = $('modeSpin'), matchBtn = $('modeMatch'), deckEl = panel.closest('.deck');
  function mode(m) {
    const on = m === 'match';
    spinBtn.setAttribute('aria-selected', String(!on)); matchBtn.setAttribute('aria-selected', String(on));
    deckEl.classList.toggle('matching', on); document.body.classList.toggle('matching', on); panel.hidden = !on;
    if (on) { loadDeck().then(render, () => { panel.innerHTML = `<p class="mn-k">Match night needs the film list. Check your connection and try again.</p>` }); render(); if (M.room) poll(); if (M.duel) duelPoll() }
    else { stopPoll(); duelStop() }
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
    let all = pool(M.vibe), ids;
    if (M.style === 'solo') {
      /* fresh films first; once a vibe is nearly used up, its films come round again */
      const seen = new Set(solo.seen), fresh = all.filter(id => !seen.has(id));
      if (fresh.length < Math.min(DECK, all.length)) { const vb = new Set(all); solo.seen = solo.seen.filter(id => !vb.has(id)); soloSave(); M.lapped = 1; all = shuffle(all) } else { M.lapped = 0; all = fresh }
    }
    ids = shuffle(all).slice(0, DECK);
    M.deck = ids; M.order = { 1: ids.slice(), 2: shuffle(ids) };
    /* person two gets the same films in a different order: no peeking at what the first card was */
    if (ids.length > 2) while (M.order[2][0] === M.order[1][0]) M.order[2] = shuffle(ids);
    M.at = { 1: 0, 2: 0 }; M.keep = { 1: [], 2: [] }; M.hist = { 1: [], 2: [] }; M.p = 1; M.match = null; M.backups = []; M.picks = {}; M.flipped = false; M.decided = null;
    M.had = M.style === 'solo' ? solo.keep.slice() : [];
  }

  /* ---------- Just me: the end of the deck ---------- */
  function soloEnd() {
    const tonight = M.listOnly ? [] : M.keep[1].filter(allowed), older = shortlist().filter(id => !tonight.includes(id));
    const li = id => `<li><span class="mn-li">${ESC(film(id).title)} <span>${film(id).year}</span></span><button type="button" class="mn-x" data-drop="${ESC(id)}" aria-label="Take ${ESC(film(id).title)} off the shortlist">${ICON.x}</button></li>`;
    const spinSet = tonight.length > 1 ? tonight : tonight.length ? [] : older;
    let head, k, main = '';
    if (!M.listOnly && tonight.length === 1) { head = 'Only one made the cut'; k = `${ESC(film(tonight[0]).title)} it is. No spin needed.`; main = `<button type="button" class="mn-go" id="mnOne">Open the menu</button>` }
    else if (spinSet.length > 1) { head = M.listOnly ? 'Your shortlist' : `You kept ${tonight.length}`; k = spinSet.length > WHEEL_MAX ? `${WHEEL_MAX} of them go on the wheel at random.` : 'They all go on the wheel.'; main = `<button type="button" class="mn-go" id="mnSpinK">Spin for it</button>` }
    else if (spinSet.length === 1) { head = 'Your shortlist'; k = `Just ${ESC(film(spinSet[0]).title)} on it.`; main = `<button type="button" class="mn-go" id="mnOneL">Open the menu</button>` }
    else { head = 'Nothing grabbed you'; k = 'No keeps this time. Deal another 20, you won\'t see these again for a while.' }
    panel.innerHTML = `<div class="mn-nm"><p class="mn-tk">Just me</p><h2 class="mn-t">${head}</h2><p class="mn-k" aria-live="polite">${k}</p>
      <div class="mn-cols mn-solo">${!M.listOnly && tonight.length ? `<div class="mn-col"><p class="mn-tk">Kept tonight</p><ul>${tonight.map(li).join('')}</ul></div>` : ''}${older.length ? `<div class="mn-col"><p class="mn-tk">${M.listOnly ? 'On your shortlist' : 'Still on your shortlist'}</p><ul>${older.map(li).join('')}</ul></div>` : ''}</div>
      <div class="mn-actions">${main}<button type="button" class="mn-ghost" id="mnMoreD">Deal ${tonight.length || older.length ? 'another' : 'me another'} ${Math.min(DECK, pool(M.vibe).length) || DECK}</button>${!M.listOnly && tonight.length && older.length ? `<button type="button" class="mn-ghost" id="mnSpinAll">Spin the whole shortlist</button>` : ''}</div>
      <button type="button" class="mn-quit" id="mnQuit">Back to the start</button></div>`;
    const one = $('mnOne'); if (one) one.onclick = () => chosen(tonight[0]);
    const oneL = $('mnOneL'); if (oneL) oneL.onclick = () => chosen(spinSet[0]);
    const sk = $('mnSpinK'); if (sk) sk.onclick = () => decider(spinSet);
    const sa = $('mnSpinAll'); if (sa) sa.onclick = () => decider([...tonight, ...older]);
    $('mnMoreD').onclick = () => { deal(); if (!M.deck.length) return; M.step = 'swipe'; M.listOnly = 0; save(); say(`${M.deck.length} more films dealt`); render() };
    $('mnQuit').onclick = quit;
    panel.querySelectorAll('[data-drop]').forEach(b => b.onclick = () => { const id = b.dataset.drop; solo.keep = solo.keep.filter(x => x !== id); M.keep[1] = M.keep[1].filter(x => x !== id); soloSave(); save(); say(`${film(id).title} is off the shortlist`); render() });
  }
  /* the film picked for tonight comes off the shortlist */
  function chosen(id) { solo.keep = solo.keep.filter(x => x !== id); soloSave(); M.match = id; openMenu(id) }

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
    if (s === 'solo') return soloEnd();
    if (s === 'duelsent') return duelSent();
    if (s === 'duelnomatch') return duelNoMatch();
  }

  function setup() {
    panel.innerHTML = `<div class="mn-head"><h2 class="mn-t">Match night</h2><p class="mn-k">${M.style === 'duel' ? `Swipe ${Math.min(DECK, pool(M.vibe).length) || DECK} films now and send them to a friend. They swipe the same films whenever they get to it, and the first one you both keep is dinner, menu and all.` : M.style === 'solo' ? `Swipe ${Math.min(DECK, pool(M.vibe).length) || DECK} films on your own. The ones you keep go on the wheel, and it picks tonight's feature, menu and all.` : `Two of you swipe the same ${Math.min(DECK, pool(M.vibe).length) || DECK} films. The first one you both keep is tonight's feature, menu and all.`}</p></div>
      <fieldset class="mn-set"><legend>Pick a vibe</legend><div class="mn-chips" role="radiogroup" aria-label="Vibe">${VIBES.map(([k, l]) => `<button type="button" role="radio" class="mn-chip" data-vibe="${k}" aria-checked="${M.vibe === k}">${l}<small>${pool(k).length}</small></button>`).join('')}</div></fieldset>
      <fieldset class="mn-set"><legend>How you're playing</legend><div class="mn-chips mn-styles" role="radiogroup" aria-label="How you're playing">
        <button type="button" role="radio" class="mn-chip wide" data-style="pass" aria-checked="${M.style === 'pass'}">Pass the phone<small>One phone, take turns</small></button>
        <button type="button" role="radio" class="mn-chip wide" data-style="solo" aria-checked="${M.style === 'solo'}">Just me<small>Swipe, then spin your keeps</small></button>
        <button type="button" role="radio" class="mn-chip wide" data-style="room" aria-checked="${M.style === 'room'}">Room code<small>A phone each, together</small></button>
        <button type="button" role="radio" class="mn-chip wide" data-style="duel" aria-checked="${M.style === 'duel'}">Dinner Duel<small>Send it, they swipe later</small></button></div></fieldset>
      ${M.style === 'duel' ? duelSetup() : M.style === 'room' ? `<div class="mn-actions"><button type="button" class="mn-go" id="mnStart">Start a room</button></div>
        <form class="mn-join" id="mnJoin"><label for="mnCode">Got a code?</label><input id="mnCode" maxlength="4" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="TACO" inputmode="text"><button type="submit" class="mn-ghost">Join</button></form>`
        : `<div class="mn-actions"><button type="button" class="mn-go" id="mnDeal">Deal ${Math.min(DECK, pool(M.vibe).length) || DECK} films</button>${M.style === 'solo' && shortlist().length > 1 ? `<button type="button" class="mn-ghost" id="mnList">Spin my shortlist (${shortlist().length})</button>` : ''}</div>`}
      <p class="mn-err" id="mnErr" role="alert"></p>`;
    panel.querySelectorAll('[data-vibe]').forEach(b => b.onclick = () => { M.vibe = b.dataset.vibe; setup() });
    panel.querySelectorAll('[data-style]').forEach(b => b.onclick = () => { M.style = b.dataset.style; setup() });
    const d = $('mnDeal'); if (d) d.onclick = () => { deal(); if (!M.deck.length) return err('No films for that vibe right now. Try another.'); M.step = 'swipe'; M.listOnly = 0; save(); say(M.style === 'solo' ? `${M.deck.length} films dealt${M.lapped ? ". You've seen every film in this vibe, so they're coming round again" : ''}.` : `${M.deck.length} films dealt. ${who(1)} first.`); render() };
    const sl = $('mnList'); if (sl) sl.onclick = () => { M.step = 'solo'; M.listOnly = 1; save(); render() };
    const st = $('mnStart'); if (st) st.onclick = startRoom;
    panel.querySelectorAll('[data-to]').forEach(b => b.onclick = () => { const t = b.dataset.to; M.duelTo = t === 'link' ? 'link' : (duelFriends().find(f => f.id === t) || null); setup() });
    const dj = $('mnDJoin'); if (dj) dj.onclick = () => { if (typeof openJoin === 'function') openJoin() };
    const dg = $('mnDuelGo'); if (dg) dg.onclick = duelStart;
    const j = $('mnJoin'); if (j) j.onsubmit = e => { e.preventDefault(); joinRoom($('mnCode').value) };
  }
  const err = t => { const e = $('mnErr'); if (e) e.textContent = t };

  /* the teaser follows the diet toggles like the printed menu: Vegetarian shows the vegetarian versions,
     No alcohol (and Kids mode) shows the alcohol-free versions or leaves a dish or the drink off (data/match-deck.json dx, k.an) */
  function teaser(id) {
    const d = DATA.films[id] || {}, veg = typeof DIET !== 'undefined' && DIET.veg, af = typeof dietAF === 'function' && dietAF();
    const key = veg && af ? 'veg_af' : veg ? 'veg' : af ? 'af' : '';
    return { d: (key && d.dx && d.dx[key]) || d.d || [], k: d.k ? (af && d.k.a ? d.k.an || '' : d.k.n) : '' };
  }
  /* the card: poster on the front, the menu teaser on the back in the film's colours */
  function cardHTML(id, top) {
    const f = film(id), d = DATA.films[id] || {}, [dark, acc] = d.c || ['#2a0d0d', '#c9a227'], src = poster(id);
    const t = teaser(id), drink = t.k;
    return `<div class="mn-card${top ? ' mn-top' : ''}${top && M.flipped ? ' flip' : ''}" data-id="${ESC(id)}" ${top ? `tabindex="0" role="button" aria-label="${ESC(f.title)} (${f.year}). Tap to ${M.flipped ? 'see the poster' : 'see the menu'}"` : 'aria-hidden="true"'} style="--mn-dark:${dark};--mn-acc:${acc}">
      <div class="mn-face mn-front">${src ? `<img src="${src}" alt="" loading="${top ? 'eager' : 'lazy'}" crossorigin="anonymous" onerror="this.remove()">` : ''}<div class="mn-fb"><b>${ESC(f.title)}</b><span>${f.year}</span></div><div class="mn-cap"><b>${ESC(f.title)}</b> <span>${f.year}</span></div><i class="mn-stamp keep">Keep</i><i class="mn-stamp skip">Skip</i></div>
      <div class="mn-face mn-back"><p class="mn-tk">Tonight at</p><p class="mn-ve">${ESC(d.ve || f.title)}</p><p class="mn-fl">${ESC(f.title)} <span>${f.year}</span></p>
        <p class="mn-tk">On the menu</p><ul class="mn-dish">${t.d.map(n => `<li>${ESC(n)}</li>`).join('')}</ul>
        ${drink ? `<p class="mn-tk">House drink</p><p class="mn-dr">${ESC(drink)}</p>` : ''}<p class="mn-flipk">Tap for the poster</p><i class="mn-stamp keep">Keep</i><i class="mn-stamp skip">Skip</i></div></div>`;
  }

  function swipe() {
    const p = M.p, ord = M.order[p], i = M.at[p];
    if (i >= ord.length) return finish(p);
    const next = ord[i + 1];
    panel.innerHTML = `<div class="mn-bar"><span class="mn-who">${who(p)}</span><span class="mn-n">${i + 1} of ${ord.length}</span>${M.room ? `<span class="mn-code" title="Room code">Room ${M.room.code}</span>` : ''}${M.duel ? `<span class="mn-code">Duel</span>` : ''}<span class="mn-vb">${vibeName(M.vibe)}</span></div>
      ${M.room ? `<p class="mn-them" id="mnThem">${themLine()}</p>` : ''}${M.duel ? `<p class="mn-them" id="mnThem">${ESC(duelLine())}</p>` : ''}
      <div class="mn-stack">${next ? cardHTML(next, false) : ''}${cardHTML(ord[i], true)}</div>
      <p class="mn-hint">Tap the card for the menu. Swipe right to keep, left to skip.</p>
      <div class="mn-btns"><button type="button" class="mn-b skip" id="mnSkip" aria-label="Skip">${ICON.x}<span>Skip</span></button><button type="button" class="mn-b undo" id="mnUndo" aria-label="Undo" ${M.hist[p].length && !(M.duel && M.match) ? '' : 'disabled'}>${ICON.undo}<span>Undo</span></button><button type="button" class="mn-b keep" id="mnKeep" aria-label="Keep">${ICON.heart}<span>Keep</span></button></div>
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
  function flip(card) { M.flipped = !M.flipped; card.classList.toggle('flip', M.flipped); card.setAttribute('aria-label', card.getAttribute('aria-label').replace(/Tap to .*$/, 'Tap to ' + (M.flipped ? 'see the poster' : 'see the menu'))); if (M.flipped) say('Menu: ' + teaser(card.dataset.id).d.join(', ')) }
  addEventListener('keydown', e => {
    if (panel.hidden || M.step !== 'swipe' || e.altKey || e.ctrlKey || e.metaKey || document.querySelector('.mn-reveal')) return;
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
    if (M.style === 'solo' && !M.room) {
      solo.seen = [...solo.seen.filter(x => x !== id), id].slice(-2000);
      if (keep) solo.keep = [id, ...solo.keep.filter(x => x !== id)].slice(0, SOLO_MAX);
      soloSave();
    }
    if (M.room) send('match_swipe', { p_code: M.room.code, p_player: p, p_film: id, p_keep: keep });
    if (M.duel) dsend('duel_swipe', { p_id: M.duel.id, p_film: id, p_keep: keep });
    save();
    setTimeout(() => {
      busy = false;
      /* pass the phone: player two keeping a film player one kept is a match */
      if (keep && !M.room && !M.duel && p === 2 && M.keep[1].includes(id)) { if (!M.match) { M.match = id; render(); return reveal(id, true) } M.backups.push(id); say(`Backup: ${film(id).title}`) }
      if (M.room) checkRoom();
      render();
    }, reduce ? 60 : 260);
  }
  function undo() {
    /* a duel match is a match: once the database has called it, it can't be swiped back */
    if (M.duel && M.match) return;
    const p = M.p, id = M.hist[p].pop(); if (!id) return;
    M.at[p]--; M.keep[p] = M.keep[p].filter(x => x !== id); M.backups = M.backups.filter(x => x !== id);
    if (M.style === 'solo' && !M.room) { solo.seen = solo.seen.filter(x => x !== id); if (!(M.had || []).includes(id)) solo.keep = solo.keep.filter(x => x !== id); soloSave() }
    if (M.match === id) M.match = null;
    M.flipped = false;
    if (M.room) send('match_unswipe', { p_code: M.room.code, p_player: p, p_film: id });
    if (M.duel) dsend('duel_unswipe', { p_id: M.duel.id, p_film: id });
    save(); say('Back one card'); render();
  }
  function finish(p) {
    if (M.duel) { M.step = M.match ? 'done' : M.duel.state === 'nomatch' ? 'duelnomatch' : 'duelsent'; save(); dflush(); duelPoll(); return render() }
    if (M.style === 'solo' && !M.room) { M.step = 'solo'; save(); return render() }
    if (M.room) { M.step = 'wait'; save(); checkRoom(); return render() }
    if (p === 1) { M.step = 'hand'; save(); return render() }
    M.step = M.match ? 'done' : 'nomatch'; save(); render();
  }

  function handover() {
    const n = M.keep[1].length;
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">Player one is done</p><h2 class="mn-t">Pass the phone</h2><p class="mn-k">${n ? `${n} kept, and no peeking.` : 'Nothing kept yet, so it is all on player two.'} Player two gets the same ${M.deck.length} films in a different order.</p>
      <div class="mn-actions"><button type="button" class="mn-go" id="mnP2">I'm player two, deal me in</button></div><button type="button" class="mn-quit" id="mnBack">Back to my cards</button></div>`;
    $('mnP2').onclick = () => { M.p = 2; M.step = 'swipe'; save(); say('Player two, your turn'); render() };
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
      <p class="mn-rw">${fromSpin ? 'The wheel has spoken.' : M.duel ? `You and ${ESC(duelName())} both kept it.` : 'You both kept it.'}</p>
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
    setTimeout(() => { const b = $('mnOpen'); if (b) b.focus() }, 50);
  }
  function openMenu(id, already) {
    const f = film(id);
    stopPoll(); duelStop(); M.step = 'done'; save();
    if (typeof goView === 'function' && document.getElementById('viewWheel').hidden) goView('wheel', true);
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
    panel.innerHTML = `<div class="mn-nm"><p class="mn-tk">No match in ${M.deck.length}</p><h2 class="mn-t">Meet in the middle</h2><p class="mn-k" aria-live="polite">${line}</p><div class="mn-cols">${lists}</div>
      ${ready ? `<div class="mn-actions"><button type="button" class="mn-go" id="mnDecide">${picks.length === 2 && picks[0] !== picks[1] ? 'Spin for it' : 'Open the menu'}</button></div>` : ''}<button type="button" class="mn-quit" id="mnQuit">Start over</button></div>`;
    panel.querySelectorAll('[data-pick]').forEach(b => b.onclick = () => {
      M.picks[mine] = b.dataset.pick; save();
      if (M.room) send('match_pick', { p_code: M.room.code, p_player: mine, p_film: b.dataset.pick });
      render();
    });
    const dc = $('mnDecide'); if (dc) dc.onclick = () => picks.length === 2 && picks[0] !== picks[1] ? decider(picks) : (M.match = picks[0], M.decided = { pair: picks[0], win: picks[0] }, save(), openMenu(picks[0]));
    $('mnQuit').onclick = quit;
  }
  /* the two-slot spin: the real wheel with the two picks on alternate wedges. In a room both phones land on
     the same film: the winner comes from the room code and the two picks, not from chance on each phone */
  function decider(pair) {
    let win;
    if (pair.length > WHEEL_MAX) pair = shuffle(pair).slice(0, WHEEL_MAX);
    const key = pair.slice().sort().join('|');
    if (M.decided && M.decided.pair === key) win = M.decided.win;
    else if (M.room) { let h = 0; for (const ch of M.room.code + pair.slice().sort().join('|')) h = (h * 31 + ch.charCodeAt(0)) >>> 0; win = pair.slice().sort()[h % 2] }
    else win = pick(pair);
    M.decided = { pair: key, win }; M.match = win; save();
    if (M.style === 'solo' && !M.room) { solo.keep = solo.keep.filter(x => x !== win); soloSave() }
    mode('spin');
    const t = document.querySelector('.wheel-wrap'); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    window.spinForce = { pair: pair.map(film), win: film(win), done: () => reveal(win, false, true) };
    setTimeout(() => spin(), reduce ? 0 : 500);
  }

  function quit() { stopPoll(); duelStop(); const keepVibe = M.vibe, keepStyle = M.style; M = fresh(); M.vibe = keepVibe; M.style = keepStyle; save(); render() }

  /* ---------- Dinner Duel ---------- */
  const DPOLL = 6000;
  const arpc = (fn, body) => globalThis.RDAuth && RDAuth.signedIn() ? RDAuth.rpc(fn, body) : Promise.reject(new Error('signedout'));
  const duelFriends = () => (globalThis.RDFriends && RDFriends.friends()) || [];
  const duelLine = () => {
    const d = M.duel, n = M.deck.length; if (!d) return '';
    if (!d.friend) return 'Nobody has opened your link yet.';
    return d.their >= n ? `${duelName()} has swiped all ${n}.` : d.their ? `${duelName()} is on card ${Math.min(d.their + 1, n)} of ${n}.` : `${duelName()} hasn't started yet.`;
  };
  /* the second player gets the same films in their own order, the same on every phone and every reload */
  function seeded(ids, seed) {
    let h = 2166136261; for (const ch of seed) h = Math.imul(h ^ ch.charCodeAt(0), 16777619) >>> 0;
    const a = ids.slice();
    for (let i = a.length - 1; i > 0; i--) { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; const j = h % (i + 1); [a[i], a[j]] = [a[j], a[i]] }
    return a;
  }
  /* line this phone up with the database. Returns null if the duel can't be played here, else true when a match just landed */
  function duelApply(v, fromLoad) {
    if (!v || v.status !== 'ok' || !Array.isArray(v.deck)) return null;
    const known = v.deck.filter(id => byId.has(id));
    if (!known.length) return null;
    const me = v.me, them = other(me), had = M.match;
    M.duel = Object.assign(M.duel || {}, { id: v.id, me, friend: v.friend || null, their: v.their_n || 0, code: v.code || null, state: v.state, theirs: v.theirs || null });
    M.style = 'duel'; if (v.vibe) M.vibe = v.vibe;
    if (fromLoad) {
      const swiped = (v.mine || []).map(s => s.f).filter(id => byId.has(id));
      const base = me === 1 ? known : seeded(known, v.id);
      M.deck = known;
      M.order = { 1: [], 2: [] }; M.order[me] = [...swiped, ...base.filter(id => !swiped.includes(id))];
      M.at = { 1: 0, 2: 0 }; M.at[me] = swiped.length;
      M.hist = { 1: [], 2: [] }; M.hist[me] = swiped.slice();
      M.keep = { 1: [], 2: [] }; M.keep[me] = (v.mine || []).filter(s => s.k && byId.has(s.f)).map(s => s.f);
      M.p = me; M.flipped = false; M.picks = {}; M.decided = null;
    }
    M.keep[them] = (v.theirs || []).filter(id => byId.has(id));
    M.match = v.match && byId.has(v.match) ? v.match : null;
    M.backups = (v.both || []).filter(id => id !== M.match && byId.has(id));
    return !had && !!M.match && v.state === 'matched';
  }
  const duelStepFor = () => M.duel.state === 'matched' || M.duel.state === 'settled' ? 'done' : M.duel.state === 'nomatch' ? 'duelnomatch' : M.at[M.duel.me] >= M.deck.length ? 'duelsent' : 'swipe';

  /* swipes queue up like room swipes: a dropped signal can't lose a keep */
  let dflushing = false;
  const dsend = (fn, body) => { if (!M.duel) return; (M.duel.q || (M.duel.q = [])).push([fn, body]); save(); dflush() };
  async function dflush() {
    if (dflushing || !M.duel || !M.duel.q || !M.duel.q.length) return;
    dflushing = true; let v = null;
    try { while (M.duel && M.duel.q && M.duel.q.length) { const [fn, b] = M.duel.q[0]; v = await arpc(fn, b); if (M.duel && M.duel.q) { M.duel.q.shift(); save() } } }
    catch (e) { if (e.message === 'signedout') { dflushing = false; return duelMsg('Sign in again to keep playing', 'Your swipes are saved on this phone and go up once you sign back in.') } }
    dflushing = false;
    if (v && M.duel) duelSeen(v);
  }
  function duelSeen(v) {
    if (!v || v.status === 'gone') return duelMsg("That duel's closed", 'Your friend closed it, or it sat untouched for a month.');
    if (v.status !== 'ok') return;
    const fresh = duelApply(v, false); save();
    if (fresh) { if (M.step === 'duelsent') M.step = 'done'; save(); render(); return reveal(M.match, M.step === 'swipe') }
    if (M.step === 'duelsent' && v.state === 'nomatch') { M.step = 'duelnomatch'; save(); return render() }
    if ((M.step === 'duelsent' || M.step === 'duelnomatch') && (v.state === 'settled' || v.state === 'matched')) { M.step = 'done'; save(); return render() }
    if (M.step === 'duelsent') return render();
    const el = $('mnThem'); if (el) el.textContent = duelLine();
  }
  function duelMsg(head, k) {
    duelStop();
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">Dinner Duel</p><h2 class="mn-t">${ESC(head)}</h2><p class="mn-k">${ESC(k)}</p><div class="mn-actions"><button type="button" class="mn-go" id="mnAgain">New Match night</button></div></div>`;
    $('mnAgain').onclick = quit;
  }
  let dtimer = 0;
  function duelPoll() { duelStop(); if (!M.duel || document.hidden || panel.hidden) return; if (M.step === 'done' && M.duel.state !== 'open') return; dtimer = setInterval(duelCheck, DPOLL) }
  function duelStop() { if (dtimer) clearInterval(dtimer); dtimer = 0 }
  async function duelCheck() {
    if (!M.duel || panel.hidden) return duelStop();
    if (M.step === 'done' && M.duel.state !== 'open') return duelStop();
    await dflush();
    if (!M.duel || (M.duel.q && M.duel.q.length)) return;
    try { duelSeen(await arpc('duel_state', { p_id: M.duel.id })) } catch (e) { /* offline: try again next time */ }
  }

  /* the picker on the Match night start screen */
  function duelSetup() {
    const n = Math.min(DECK, pool(M.vibe).length) || DECK;
    if (!(globalThis.RDAuth && RDAuth.signedIn())) return `<p class="mn-k">Dinner Duel is for members. Swipe your ${n} now and send them to a friend. They swipe whenever they get to it, and a match pops up for you both. The member card is free.</p><div class="mn-actions"><button type="button" class="mn-go" id="mnDJoin">Get your member card</button></div>`;
    const list = duelFriends().slice();
    const to = M.duelTo, sel = to === 'link' ? 'link' : to && to.id;
    if (to && to !== 'link' && !list.some(f => f.id === to.id)) list.unshift(to);
    return `<fieldset class="mn-set"><legend>Who's it for</legend><div class="mn-chips" role="radiogroup" aria-label="Who's it for">${list.map(f => `<button type="button" role="radio" class="mn-chip" data-to="${ESC(f.id)}" aria-checked="${sel === f.id}">${ESC(f.name)}${f.streak > 1 ? `<small>${f.streak} matches in a row</small>` : ''}</button>`).join('')}<button type="button" role="radio" class="mn-chip" data-to="link" aria-checked="${sel === 'link'}">Send a link<small>Text it to anyone</small></button></div></fieldset>
      ${list.length ? '' : `<p class="mn-k">No friends on your list yet. Send a link: whoever opens it gets the duel and lands on your friends list.</p>`}
      <div class="mn-actions"><button type="button" class="mn-go" id="mnDuelGo" ${sel ? '' : 'disabled'}>Deal ${n} and start</button></div>`;
  }
  async function duelStart() {
    err(''); const b = $('mnDuelGo'); const back = () => { if (b) { b.disabled = false; b.textContent = 'Try again' } };
    if (b) { b.disabled = true; b.textContent = 'Dealing' }
    deal(); if (!M.deck.length) { back(); return err('No films for that vibe right now. Try another.') }
    const to = M.duelTo;
    let v;
    try { v = await arpc('duel_create', { p_friend: to && to !== 'link' ? to.id : null, p_vibe: M.vibe, p_deck: M.deck }) }
    catch (e) { back(); return err(e.message === 'signedout' ? 'Sign in again to start a duel.' : "Couldn't reach Reel Dinner. Check your connection and try again.") }
    if (!v || v.status !== 'ok') { back(); return err(v && v.status === 'toomany' ? 'You already have three duels going with them. Finish one first.' : v && v.status === 'slow' ? "That's a lot of duels for one day. Try again tomorrow." : v && v.status === 'notfriends' ? "You're not on each other's friends list any more." : "Couldn't start the duel. Try again.") }
    M.duel = null;
    if (duelApply(v, true) === null) { back(); return err("Couldn't start the duel. Try again.") }
    M.step = 'swipe'; save(); say(`${M.deck.length} films dealt. Swipe yours, then it goes to ${M.duel.friend ? duelName() : 'whoever opens your link'}.`); render(); duelPoll();
  }
  const shareURL = c => ((globalThis.REEL_NATIVE || !/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname)) ? 'https://reeldinner.com/' : location.origin + '/') + '?invite=' + c;
  function duelSent() {
    const d = M.duel, link = !d.friend && d.code, open = d.state === 'open';
    panel.innerHTML = `<div class="mn-hand"><p class="mn-tk">Dinner Duel</p><h2 class="mn-t">${link ? 'Now send it' : `Over to ${ESC(duelName())}`}</h2>
      <p class="mn-k" id="mnThem">${link ? `Send the link to whoever you're having dinner with. They swipe the same ${M.deck.length} films whenever they get to it, and a match pops up for both of you.` : `${ESC(duelLine())} A match lands in your inbox, and pops up here if you're on.`}</p>
      <p class="mn-k">You kept ${M.keep[d.me].length}.</p>
      <div class="mn-actions">${link ? '<button type="button" class="mn-go" id="mnDShare">Send the link</button>' : ''}<button type="button" class="${link ? 'mn-ghost' : 'mn-go'}" id="mnBoard">My duels</button></div>
      ${open ? '<button type="button" class="mn-quit" id="mnBack">Back to my last card</button> ' : ''}<button type="button" class="mn-quit" id="mnQuit">New Match night</button></div>`;
    const sh = $('mnDShare'); if (sh) sh.onclick = async () => {
      const me = (typeof member !== 'undefined' && member && member.name) || 'Your friend';
      const text = `${me} sent you a Dinner Duel on Reel Dinner. Swipe ${M.deck.length} films and if we both keep one, dinner's sorted: ${shareURL(d.code)}`;
      try { if (navigator.share) { await navigator.share({ title: 'Reel Dinner Dinner Duel', text }); return } } catch (e) { return }
      try { await navigator.clipboard.writeText(text); sh.textContent = 'Copied, paste it in a text' } catch (e) { sh.textContent = shareURL(d.code) }
    };
    $('mnBoard').onclick = () => { if (globalThis.RDFriends) RDFriends.open('duels') };
    const bk = $('mnBack'); if (bk) bk.onclick = () => { M.step = 'swipe'; undo() };
    $('mnQuit').onclick = quit;
  }
  function duelNoMatch() {
    const d = M.duel, mine = M.keep[d.me].filter(id => byId.has(id)), theirs = M.keep[other(d.me)];
    const all = [...new Set([...mine, ...theirs])];
    const li = id => `<li><span class="mn-li">${ESC(film(id).title)} <span>${film(id).year}</span></span></li>`;
    panel.innerHTML = `<div class="mn-nm"><p class="mn-tk">No match in ${M.deck.length}</p><h2 class="mn-t">Tie-breaker</h2><p class="mn-k">${all.length ? `Nothing you both kept. Everything either of you kept goes on the wheel${all.length > WHEEL_MAX ? ` (${WHEEL_MAX} at random)` : ''}, and it picks dinner for both of you.` : 'Neither of you kept a single film. Tough crowd.'}</p>
      <div class="mn-cols"><div class="mn-col"><p class="mn-tk">You kept ${mine.length}</p><ul>${mine.map(li).join('') || '<li class="mn-none">Nothing</li>'}</ul></div><div class="mn-col"><p class="mn-tk">${ESC(duelName())} kept ${theirs.length}</p><ul>${theirs.map(li).join('') || '<li class="mn-none">Nothing</li>'}</ul></div></div>
      <div class="mn-actions">${all.length ? '<button type="button" class="mn-go" id="mnDSpin">Spin for it</button>' : ''}<button type="button" class="mn-ghost" id="mnBoard">My duels</button></div><p class="mn-err" id="mnErr" role="alert"></p>
      <button type="button" class="mn-quit" id="mnQuit">New Match night</button></div>`;
    const sp = $('mnDSpin'); if (sp) sp.onclick = () => duelSpin(all, sp);
    $('mnBoard').onclick = () => { if (globalThis.RDFriends) RDFriends.open('duels') };
    $('mnQuit').onclick = quit;
  }
  /* the database picks the winner (so both phones land on the same film), then the real wheel spins to it */
  async function duelSpin(all, btn) {
    btn.disabled = true; btn.textContent = 'Loading the wheel';
    let v;
    try { v = await arpc('duel_settle', { p_id: M.duel.id }) } catch (e) { btn.disabled = false; btn.textContent = 'Spin for it'; return err("Couldn't reach Reel Dinner. Check your connection and try again.") }
    if (!v || v.status !== 'ok' || !v.match || !byId.has(v.match)) { btn.disabled = false; btn.textContent = 'Spin for it'; return err("Couldn't spin. Try again.") }
    duelApply(v, false);
    const win = v.match; M.step = 'done'; M.decided = { pair: 'duel', win }; save();
    let pair = shuffle(all.filter(id => id !== win && byId.has(id))).slice(0, WHEEL_MAX - 1); pair.push(win); pair = shuffle(pair);
    if (pair.length < 2) return openMenu(win);
    mode('spin');
    const t = document.querySelector('.wheel-wrap'); if (t) t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
    window.spinForce = { pair: pair.map(film), win: film(win), done: () => reveal(win, false, true) };
    setTimeout(() => spin(), reduce ? 0 : 500);
  }
  /* opened from the inbox, the Now Showing board or a duel link */
  async function duelOpen(id) {
    stopPoll(); duelStop();
    if (typeof goView === 'function' && document.getElementById('viewWheel').hidden) goView('wheel', true);
    M = fresh(); M.style = 'duel'; mode('match');
    panel.innerHTML = `<p class="mn-k">Getting your duel</p>`;
    deckEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    try { await loadDeck() } catch (e) { return duelMsg("Couldn't get the films", 'Check your connection and try again.') }
    let v;
    try { v = await arpc('duel_state', { p_id: id }) } catch (e) { return duelMsg("Couldn't get that duel", e.message === 'signedout' ? 'Sign in again to play.' : 'Check your connection and try again.') }
    if (!v || v.status === 'gone') return duelMsg("That duel's closed", 'Your friend closed it, or it sat untouched for a month.');
    if (duelApply(v, true) === null) return duelMsg("This duel needs the latest films", 'Refresh the page and try again.');
    M.step = duelStepFor(); save(); render(); duelPoll();
  }
  window.RDMatch = {
    /* start a new duel: friend is {id, name}, null for a link, or left out to pick on the start screen */
    newDuel(friend) {
      stopPoll(); duelStop();
      if (typeof goView === 'function' && document.getElementById('viewWheel').hidden) goView('wheel', true);
      const v = M.vibe; M = fresh(); M.vibe = v; M.style = 'duel'; M.duelTo = friend === undefined ? null : (friend || 'link'); save(); mode('match');
      deckEl.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    },
    openDuel: duelOpen,
    openFilm(id) { if (byId.has(id)) { if (typeof goView === 'function' && document.getElementById('viewWheel').hidden) goView('wheel', true); openMenu(id) } },
    refresh() { if (!panel.hidden && M.step === 'setup') render() }
  };

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
      const r = await rpc('match_join', DEV ? { p_code: code, p_dev: DEV } : { p_code: code });
      if (r && r.full) return err('That room already has two people swiping. Start your own room instead.');
      if (!r || !r.deck) return err("That room isn't open. Check the code, rooms close after 12 hours.");
      const ids = r.deck.filter(id => byId.has(id));
      if (!ids.length) return err("That room's films aren't on this version of the site. Refresh and try again.");
      M.vibe = r.vibe || 'any'; M.deck = ids; M.order = { 1: ids.slice(), 2: shuffle(ids) };
      M.at = { 1: 0, 2: 0 }; M.keep = { 1: [], 2: [] }; M.hist = { 1: [], 2: [] }; M.match = null; M.backups = []; M.picks = {};
      M.room = { code, me: 2, them: 0, seen: 0 }; M.p = 2; M.step = 'swipe'; save(); say('Joined room ' + code); render(); poll();
    } catch (e) { err("Couldn't reach the room. Check your connection.") }
  }
  function lobby() {
    const app = globalThis.REEL_NATIVE || !/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
    const code = M.room.code, url = (app ? 'https://reeldinner.com/' : location.origin + location.pathname) + '?match=' + code;
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
  let timer = 0, paused = false;
  function poll() { stopPoll(); paused = false; if (!M.room) return; if (document.hidden) { paused = true; return } timer = setInterval(checkRoom, POLL); checkRoom() }
  /* no checking every 2 seconds while the phone is locked or the tab is hidden; pick straight back up on return */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { if (timer) { stopPoll(); paused = true } duelStop() }
    else { if (paused && M.room && !panel.hidden) poll(); if (M.duel && !panel.hidden) { duelCheck(); duelPoll() } }
  });
  function stopPoll() { if (timer) clearInterval(timer); timer = 0 }
  let checking = false;
  async function checkRoom() {
    if (!M.room || checking) return;
    checking = true;
    await flush();
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
    if (M.match && !M.decided && !both.includes(M.match)) {
      /* someone took the match back with Undo: the next film you both kept steps up, or the night carries on */
      M.match = both[0] || null; M.backups = both.slice(1);
      if (!M.match && M.step === 'done') M.step = M.at[me] >= M.deck.length ? 'wait' : 'swipe';
      save(); say(M.match ? `Tonight's feature is now ${film(M.match).title}` : 'That match was taken back'); render();
    }
    else if (M.match) { const bk = both.filter(x => x !== M.match); if (bk.join() !== M.backups.join()) { M.backups = bk; save(); if (M.step === 'swipe') render() } }
    const iDone = M.at[me] >= M.deck.length, theyDone = tk.length >= M.deck.length;
    if (iDone && theyDone && !M.match && M.step !== 'nomatch') { M.step = 'nomatch'; save(); render() }
    else if (M.step === 'nomatch') { const key = JSON.stringify(M.picks); if (key !== M._pk) { M._pk = key; render() } }
    if (M.step === 'done' && M.match && iDone && theyDone && !(M.room.q && M.room.q.length)) stopPoll();
  }

  /* a link with ?match=TACO opens straight to the join box */
  const q = new URLSearchParams(location.search).get('match');
  if (q && /^[A-Za-z]{4}$/.test(q)) {
    try { history.replaceState(null, '', location.pathname) } catch (e) { }
    if (M.room && M.room.code === q.toUpperCase()) { mode('match'); poll() }
    else { M = fresh(); M.style = 'room'; mode('match'); loadDeck().then(() => joinRoom(q)) }
  }
  else if (M.duel && M.duel.id) { if (M.step !== 'done') { mode('match'); duelCheck() } }
  else if (M.step !== 'setup' && M.step !== 'done') { mode('match'); if (M.room) poll() }
})();
