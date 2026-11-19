/* Reel Dinner members area (Phase 2): the card button in the top bar opens My account, the home for friends,
   Dinner Duels (the Now Showing board), the inbox and alert settings. Guests see their guest pass and the offer.
   Everything talks to the Reel Dinner Supabase project through the functions in supabase/friends.sql, and only
   for the signed-in member. Invite links (reeldinner.com/?invite=CODE) land here: a guest sees who sent it and
   gets the member card offer, a member is added as a friend straight away (and handed the duel, if it's a duel link).
   Loads after app.js, account.js and match.js, and uses their globals: RDAuth, RDMatch, FILMS, member, saveMember,
   renderMember, openJoin, acctSignOut, acctDelete, mountModal, dismissModal, ESC, buzz. */
(function () {
  'use strict';
  const btn = document.getElementById('acctBtn');
  if (!btn) return;
  const inn = () => !!(globalThis.RDAuth && RDAuth.signedIn());
  const rpc = (fn, b) => RDAuth.rpc(fn, b || {});
  const dot = document.getElementById('acctDot');
  let FR = { friends: [], incoming: [], outgoing: [] }, frLoaded = false, DUELS = [], INBOX = [], PREFS = null, counts = { unread: 0, turns: 0 };
  let box = null, tab = 'card';

  const title = id => { const f = typeof FILMS !== 'undefined' && FILMS.find(x => x.id === id); return f ? f.title : String(id || '').replace(/ \(\d{4}\)$/, '') };
  const nm = w => (w && w.name) || 'A Galaxy Video member';
  const noFmt = n => n ? `No. ${String(n).slice(0, 3)} ${String(n).slice(3)}` : '';
  const VIBE = { comedy: 'Comedy', horror: 'Horror', family: 'Family', date: 'Date night', action: 'Action', any: 'Surprise me' };
  function ago(t) {
    const s = (Date.now() - new Date(t).getTime()) / 1000;
    if (s < 90) return 'Just now'; if (s < 3600) return `${Math.round(s / 60)} min ago`; if (s < 86400) return `${Math.round(s / 3600)}h ago`;
    const d = Math.round(s / 86400); return d === 1 ? 'Yesterday' : d < 7 ? `${d} days ago` : new Date(t).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' });
  }
  const app = () => globalThis.REEL_NATIVE || !/^https?:$/.test(location.protocol) || /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const inviteURL = c => (app() ? 'https://reeldinner.com/' : location.origin + '/') + '?invite=' + c;
  async function share(text, url, b) {
    try { if (navigator.share) { await navigator.share({ title: 'Reel Dinner', text }); return true } } catch (e) { return false }
    try { await navigator.clipboard.writeText(text); if (b) b.textContent = 'Copied, paste it in a text'; return true } catch (e) { if (b) b.textContent = url; return false }
  }
  /* a short line at the bottom of the screen */
  let toastEl = null, toastT = 0;
  function toast(t) {
    if (!toastEl) { toastEl = document.createElement('p'); toastEl.className = 'rd-toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl) }
    toastEl.textContent = t; toastEl.classList.add('on'); clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('on'), 5000);
  }

  /* ---------- the bell on the card button ---------- */
  function badge() {
    const n = inn() ? counts.unread + counts.turns : 0;
    if (dot) { dot.textContent = n > 9 ? '9+' : String(n); dot.hidden = !n }
    btn.setAttribute('aria-label', !inn() ? 'My account: guest pass' : n ? `My account: ${n} waiting` : 'My account');
    btn.classList.toggle('is-member', inn());
  }
  let pinging = false;
  async function ping() {
    if (!inn() || pinging || navigator.onLine === false) return badge();
    pinging = true;
    try {
      const r = await rpc('inbox_unread');
      if (r && r.status === 'ok') counts = { unread: +r.unread || 0, turns: +r.turns || 0 };
      if (!frLoaded) await loadFriends();
    } catch (e) { /* offline or signed out: the badge just stays as it was */ }
    pinging = false; badge();
  }
  let pt = 0;
  const startPing = () => { clearInterval(pt); if (!document.hidden && inn()) { ping(); pt = setInterval(ping, 60000) } else badge() };
  document.addEventListener('visibilitychange', startPing);
  addEventListener('rd-auth-lost', () => { counts = { unread: 0, turns: 0 }; badge() });

  async function loadFriends() {
    try { const r = await rpc('friends_list'); if (r && r.status === 'ok') { FR = r; frLoaded = true; if (globalThis.RDMatch) RDMatch.refresh() } } catch (e) { }
  }
  window.RDFriends = { friends: () => FR.friends || [], open: t => openPanel(t), refresh: () => { ping(); if (box && box.open) draw() } };

  /* ---------- My account ---------- */
  function openPanel(t) {
    if (box && box.open) { if (t) { tab = t; draw() } return }
    tab = t || (counts.turns ? 'duels' : counts.unread ? 'inbox' : 'card');
    box = document.createElement('dialog'); box.className = 'acct' + (cinema() ? ' cinema' : ''); box.setAttribute('aria-label', 'My account');
    box.innerHTML = `<div class="acct-in"><div class="acct-head" id="acctHead"></div><div class="acct-tabs" role="tablist" aria-label="My account" id="acctTabs"></div><div class="acct-body" id="acctBody" role="tabpanel"></div></div>`;
    box.addEventListener('click', e => { if (e.target === box) dismissModal(box) });
    mountModal(box, null, btn, () => { box = null });
    draw();
  }
  /* review 30: opened anywhere but Galaxy Video, the account is the cinema's (red and gold, a ticket) */
  const cinema = () => !document.body.classList.contains('in-shop');
  function head() {
    const h = box.querySelector('#acctHead');
    const brand = box.classList.contains('cinema') ? 'Reel Dinner' : 'Galaxy Video';
    if (!inn()) { h.innerHTML = `<p class="acct-k">${brand}</p><h2 class="acct-t">Guest pass</h2>`; return }
    const T = tier();
    h.innerHTML = `<p class="acct-k">${brand} <span class="acct-tier t-${T.k}">${ESC(T.name)}</span></p><h2 class="acct-t">${ESC((member && member.name) || 'Member')}</h2><p class="acct-no">${ESC(noFmt(member && member.no))}</p>`;
  }
  function tabs() {
    const T = [['card', 'My card', 0], ['duels', 'Duels', counts.turns], ['inbox', 'Inbox', counts.unread], ['friends', 'Friends', (FR.incoming || []).length], ['settings', 'Settings', 0]];
    const el = box.querySelector('#acctTabs');
    el.hidden = !inn();
    el.innerHTML = T.map(([k, l, n]) => `<button type="button" role="tab" data-tab="${k}" aria-selected="${tab === k}">${l}${n ? `<span class="acct-n" aria-label="${n} new">${n > 9 ? '9+' : n}</span>` : ''}</button>`).join('');
    el.querySelectorAll('[data-tab]').forEach(b => b.onclick = () => { tab = b.dataset.tab; sub = null; draw() });
  }
  function draw() {
    if (!box) return;
    head(); tabs();
    const body = box.querySelector('#acctBody');
    if (!inn()) return guest(body);
    if (tab === 'card') return sub ? statPage(body, sub) : card(body);
    if (tab === 'duels') return duels(body);
    if (tab === 'inbox') return inbox(body);
    if (tab === 'friends') return friends(body);
    return settings(body);
  }
  const loading = (body, t) => { body.innerHTML = `<p class="acct-wait">${t}</p>` };
  const failed = (body, again) => { body.innerHTML = `<p class="acct-wait">${navigator.onLine === false ? "You're offline. Friends and duels need a connection." : "Couldn't reach Reel Dinner. Check your connection."}</p><div class="acct-acts"><button type="button" class="acct-go" id="acctAgain">Try again</button></div>`; body.querySelector('#acctAgain').onclick = again };

  function guest(body) {
    body.innerHTML = `${cardArt(true)}<p>You're on a guest pass. Everything works, saved on this phone only.</p>
      <p>A free member card adds:</p>
      <ul class="acct-list"><li>Dinner Duel: swipe a deck, send it to a friend, and they swipe when they get to it</li><li>A friends list and an inbox for your turns and matches</li><li>Your picks, ticks and rentals on every phone you sign in on</li></ul>
      <div class="acct-acts"><button type="button" class="acct-go" id="acctJoin">Get your member card</button></div>
      <p class="acct-small"><a href="privacy.html">Privacy policy</a></p>`;
    body.querySelector('#acctJoin').onclick = () => { dismissModal(box); if (typeof openJoin === 'function') openJoin() };
  }

  /* ---------- My card: the card itself, your tier, the stats board, stamps and what you've got out ---------- */
  const TIERS = [
    { k: 'silver', name: 'Silver member', at: 0 },
    { k: 'gold', name: 'Gold member', at: 10 },
    { k: 'plat', name: 'Platinum member', at: 25 },
    { k: 'elite', name: 'Galaxy Elite', at: 50 }
  ];
  /* review 31: rentals and late fees are Galaxy Video's. Opened at the cinema the card counts films seen, on the cinema's own tiers */
  const CTIERS = [
    { k: 'silver', name: 'Matinee member', at: 0, u: 'film' },
    { k: 'gold', name: 'Gold Class', at: 10, u: 'film' },
    { k: 'plat', name: 'Front Row Club', at: 25, u: 'film' },
    { k: 'elite', name: 'Premiere Club', at: 50, u: 'film' }
  ];
  function tier() {
    const cin = !!(box && box.classList.contains('cinema'));
    const L = cin ? CTIERS : TIERS;
    const n = cin ? ((typeof watched !== 'undefined' && watched.size) || 0) : ((member && member.rentals) || 0);
    let i = 0; L.forEach((t, j) => { if (n >= t.at) i = j });
    return Object.assign({ n, u: cin ? 'film' : 'rental', cin, next: L[i + 1] || null }, L[i]);
  }
  function cardArt(guestCard) {
    const m = member || {}, no = String(m.no || '');
    if (box && box.classList.contains('cinema')) return `<div class="acct-tix" role="img" aria-label="${guestCard ? 'Your Reel Dinner guest pass' : `Your Reel Dinner member ticket, number ${ESC(no)}`}"><span class="tx-k">Admit one</span><span class="tx-n">${guestCard ? 'Guest pass' : ESC(m.name || 'Member')}</span>${guestCard ? '' : `<span class="tx-no">${ESC(noFmt(no))}</span>`}</div>`;
    const since = m.since ? new Date(m.since).toLocaleString('en-AU', { month: '2-digit', year: '2-digit' }) : '';
    return `<div class="acct-mc"><div class="mc${guestCard ? ' guest' : ''}" role="img" aria-label="${guestCard ? 'Your Galaxy Video guest pass' : `Your Galaxy Video member card, number ${ESC(no)}`}"><img class="mc-art" src="assets/brand/member-card.webp" alt="" width="1012" height="638" decoding="async">${guestCard ? '<span class="mc-guest" aria-hidden="true">Guest pass</span>' : ''}<p class="mc-no foil" aria-hidden="true">${ESC(no.slice(0, 3))} ${ESC(no.slice(3))}</p>${since ? `<p class="mc-since foil" aria-hidden="true">Member since ${ESC(since)}</p>` : ''}${typeof code39 === 'function' ? code39('GV' + no) : ''}${m.name ? `<span class="mc-sig" aria-hidden="true">${ESC(m.name)}</span><span class="mc-name-show foil" aria-hidden="true">${ESC(m.name)}</span>` : ''}</div></div>`;
  }
  /* stamps: once earned they stay on the card (saved with the member card, so they follow you to other phones) */
  const STAMPS = [
    ['rent1', 'First rental', 'Rent your first tape', s => s.rentals >= 1],
    ['rent10', 'Regular', 'Rent 10 tapes', s => s.rentals >= 10],
    ['rent25', 'Back room pass', 'Rent 25 tapes', s => s.rentals >= 25],
    ['seen25', 'Film buff', 'Tick off 25 films as seen', s => s.seen >= 25],
    ['stars10', 'Critic', 'Give 10 films your stars', s => s.rated >= 10],
    ['aisles5', 'Aisle hopper', 'Rent from 5 different aisles', s => s.aisles >= 5],
    ['friend1', 'Plus one', 'Make your first friend', s => s.friends >= 1],
    ['friend5', 'Dinner party', 'Have 5 friends', s => s.friends >= 5],
    ['match1', 'First match', 'Match a film in a Dinner Duel', s => s.matches >= 1],
    ['streak3', 'On a roll', '3 duel matches in a row with one friend', s => s.streak >= 3],
    ['clean', 'Good member', 'Rent 5 tapes with no late fees owing', s => s.rentals >= 5 && !s.late]
  ];
  function stats() {
    const m = member || {};
    const seenSet = typeof watched !== 'undefined' ? watched : new Set();
    const live = DUELS || [], fr = FR.friends || [];
    const done = live.filter(d => d.turn === 'done');
    const finished = live.filter(d => d.turn === 'done' || d.turn === 'decide');
    const late = typeof lateFees === 'function' ? lateFees() : [];
    return {
      rentals: m.rentals || 0, seen: seenSet.size || 0,
      rated: Object.keys(m.stars || {}).length, top: Object.values(m.stars || {}).filter(n => n >= 4).length,
      aisles: Object.keys(m.aisles || {}).length,
      fav: (Object.entries(m.aisles || {}).sort((a, b) => b[1] - a[1])[0] || [])[0] || '',
      friends: fr.length, streak: fr.reduce((n, f) => Math.max(n, f.streak || 0), 0),
      matches: Math.max(done.filter(d => d.state === 'matched').length, fr.some(f => (f.streak || 0) > 0) ? 1 : 0),
      duels: live.length, finished: finished.length, matchedN: done.filter(d => d.state === 'matched').length,
      late: late.length, owe: late.reduce((n, x) => n + Math.min(x.days, 10), 0),
      out: (m.out || []).filter(r => !seenSet.has(r.id)).map(r => ({ r, f: typeof FILMS !== 'undefined' && FILMS.find(x => x.id === r.id) })).filter(x => x.f)
    };
  }
  function earn(s) {
    if (!member) return [];
    member.stamps = member.stamps || {};
    const fresh = [];
    STAMPS.forEach(([k, name, , test]) => { if (!member.stamps[k] && test(s)) { member.stamps[k] = Date.now(); fresh.push(name) } });
    if (fresh.length) saveMember();
    return fresh;
  }
  async function card(body) {
    const paint = (loaded) => {
      if (!box || tab !== 'card') return;
      const s = stats(), T = tier(), fresh = loaded ? earn(s) : [];
      const got = (member && member.stamps) || {};
      const pct = T.next ? Math.min(100, Math.round((T.n - T.at) / (T.next.at - T.at) * 100)) : 100;
      const left = T.next ? T.next.at - T.n : 0;
      const dash = v => loaded ? v : '<span class="acct-dim">..</span>';
      const rate = s.finished ? `${Math.round(s.matchedN / s.finished * 100)}%` : '0%';
      const tile = (n, l, sm, key) => `<li><button type="button" class="acct-stat" data-stat="${key}" aria-label="${ESC(l)}: ${String(n).replace(/<[^>]+>/g, '')}. Open the page"><b>${n}</b><span>${l}</span>${sm ? `<small>${sm}</small>` : ''}<i class="acct-more" aria-hidden="true">More</i></button></li>`;
      body.innerHTML = `${cardArt(false)}
        <div class="acct-tierbox t-${T.k}"><div class="acct-tierrow"><b>${ESC(T.name)}</b><small>${T.n} ${T.u}${T.n === 1 ? '' : 's'}${T.cin ? ' seen' : ''}</small></div>
          <div class="acct-bar" role="progressbar" aria-label="Progress to ${ESC(T.next ? T.next.name : 'the top')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
          <p class="acct-small">${T.next ? `${left} more ${T.u}${left === 1 ? '' : 's'} to ${ESC(T.next.name)}.` : T.cin ? 'Top of the house. Best seat is yours.' : 'Top of the shop. The staff know your name.'}</p></div>
        ${fresh.length ? `<p class="acct-hint">New stamp${fresh.length > 1 ? 's' : ''}: ${fresh.map(ESC).join(', ')}.</p>` : ''}
        <h3 class="acct-h">Your stats</h3>
        <ul class="acct-stats">
          ${T.cin ? '' : tile(s.rentals, 'Rentals', s.fav ? `Usually in ${ESC(s.fav)}` : '', 'rentals')}
          ${tile(s.seen, 'Films seen', '', 'seen')}
          ${tile(s.top, 'On your top shelf', `${s.rated} rated`, 'top')}
          ${tile(dash(s.friends), 'Friends', '', 'friends')}
          ${tile(dash(s.duels), 'Duels on the board', 'Last 30 days', 'duels')}
          ${tile(dash(rate), 'Match rate', loaded ? `${s.matchedN} of ${s.finished} finished` : '', 'rate')}
          ${tile(dash(s.streak), 'Best streak', 'Matches in a row', 'streak')}
          ${T.cin ? '' : tile(s.late ? `$${s.owe}.00` : '$0.00', 'Late fees', s.late ? `${s.late} tape${s.late > 1 ? 's' : ''} overdue` : 'Good member', 'late')}
        </ul>
        ${T.cin ? '<p class="acct-small">Your Galaxy Video card, rentals and stamps live inside the store.</p>' : ''}${!T.cin && s.out.length ? `<h3 class="acct-h">Out on rental</h3><ul class="acct-cards">${s.out.map(({ r, f }) => {
          const over = r.due < Date.now();
          return `<li class="acct-card${over ? ' hot' : ''}"><div class="acct-ct"><b>${ESC(f.title)}</b><small>${over ? '<span class="acct-fee">Overdue</span>' : ''}Due ${ESC(new Date(r.due).toLocaleString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }))}</small></div><div class="acct-cb"><button type="button" class="acct-go sm" data-rent="${ESC(f.id)}">Open the menu</button></div></li>` }).join('')}</ul>` : ''}
${T.cin ? '' : `        <h3 class="acct-h">Stamps <small class="acct-small">${STAMPS.filter(x => got[x[0]]).length} of ${STAMPS.length}</small></h3>
        <ul class="acct-stamps">${STAMPS.map(([k, name, how]) => `<li class="acct-stamp${got[k] ? ' on' : ''}"><span class="acct-ink" aria-hidden="true">${got[k] ? '&#9733;' : ''}</span><b>${ESC(name)}</b><small>${got[k] ? `Earned ${ESC(new Date(got[k]).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' }))}` : ESC(how)}</small></li>`).join('')}</ul>`}
        <div class="acct-acts"><button type="button" class="acct-ghost" id="acctShop">Go to Galaxy Video</button></div>`;
      body.querySelectorAll('[data-rent]').forEach(b => b.onclick = () => { const f = FILMS.find(x => x.id === b.dataset.rent); if (!f) return; dismissModal(box); if (typeof openRentalMenu === 'function') openRentalMenu(f) });
      body.querySelector('#acctShop').onclick = () => { dismissModal(box); const b = document.getElementById('viewShopBtn'); if (b) b.click() };
      body.querySelectorAll('[data-stat]').forEach(b => b.onclick = () => {
        if (b.dataset.stat === 'duels') { tab = 'duels'; sub = null; return draw() }
        sub = b.dataset.stat; statBack = b.dataset.stat; draw(); const top = box && box.querySelector('.acct-body'); if (top) top.scrollTop = 0;
      });
      if (statBack) { const b = body.querySelector(`[data-stat="${statBack}"]`); if (loaded) statBack = null; if (b) b.focus() }
    };
    paint(false);
    try { const [r] = await Promise.all([rpc('duels_list'), loadFriends()]); if (r && r.status === 'ok') DUELS = r.duels || [] } catch (e) { }
    paint(true);
  }

  /* ---------- My card, stat pages: each tile on the stats board opens the list behind its number ---------- */
  let sub = null, statBack = null;
  const filmOf = id => typeof FILMS !== 'undefined' ? FILMS.find(x => x.id === id) : null;
  const thumb = f => typeof TMDB_POSTERS !== 'undefined' && f && TMDB_POSTERS[f.id] ? `<img class="acct-th" src="${TMDB_IMG}w92${TMDB_POSTERS[f.id]}" alt="" loading="lazy" crossorigin="anonymous" onerror="this.remove()">` : '<span class="acct-th" aria-hidden="true"></span>';
  const starsOf = id => { const n = (member && member.stars && member.stars[id]) || 0; return n ? `<span class="acct-stars" aria-label="${n} star${n > 1 ? 's' : ''}">${'&#9733;'.repeat(n)}<i>${'&#9733;'.repeat(5 - n)}</i></span>` : '' };
  const day = t => new Date(t).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
  const filmRow = (f, sm, extra) => `<li class="acct-fr">${thumb(f)}<div class="acct-frt"><b>${ESC(f.title)} <span>${f.year}</span></b>${sm ? `<small>${sm}</small>` : ''}</div><div class="acct-frb">${extra || ''}<button type="button" class="acct-go sm" data-film="${ESC(f.id)}">Menu</button></div></li>`;
  async function statPage(body, key) {
    if (!frLoaded || !DUELS.length) { try { const [r] = await Promise.all([rpc('duels_list'), frLoaded ? 0 : loadFriends()]); if (r && r.status === 'ok') DUELS = r.duels || [] } catch (e) { } }
    if (!box || tab !== 'card' || sub !== key) return;
    const s = stats(), m = member || {}, seenSet = typeof watched !== 'undefined' ? watched : new Set();
    const top = (h, k) => `<button type="button" class="acct-back" id="acctBack">Back to My card</button><h3 class="acct-h acct-sh">${h}</h3>${k ? `<p class="acct-small acct-sk">${k}</p>` : ''}`;
    const done = (DUELS || []).filter(d => d.turn === 'done' || d.turn === 'decide');
    let html = '';
    if (key === 'rentals') {
      const aisles = Object.entries(m.aisles || {}).sort((a, b) => b[1] - a[1]), most = aisles.length ? aisles[0][1] : 1;
      const log = (m.log || []).map(r => ({ r, f: filmOf(r.id) })).filter(x => x.f);
      html = top(`${s.rentals} rental${s.rentals === 1 ? '' : 's'}`, tier().next ? `${tier().next.at - s.rentals} more to ${ESC(tier().next.name)}.` : 'Top of the shop.')
        + (s.out.length ? `<h4 class="acct-h4">Out on rental</h4><ul class="acct-frs">${s.out.map(({ r, f }) => filmRow(f, `${r.due < Date.now() ? '<span class="acct-fee">Overdue</span> ' : ''}Due ${ESC(day(r.due))}`)).join('')}</ul>` : '')
        + `<h4 class="acct-h4">Recent rentals</h4>${log.length ? `<ul class="acct-frs">${log.slice(0, 30).map(({ r, f }) => filmRow(f, `Rented ${ESC(day(r.at))}`)).join('')}</ul>` : `<p class="acct-small">Your rentals show up here from your next one on. Older ones only kept a count.</p>`}`
        + (aisles.length ? `<h4 class="acct-h4">Your aisles</h4><ul class="acct-bars">${aisles.map(([a, n]) => `<li><span>${ESC(a)}</span><i style="--w:${Math.round(n / most * 100)}%"></i><b>${n}</b></li>`).join('')}</ul>` : '');
    } else if (key === 'seen') {
      const list = [...seenSet].map(filmOf).filter(Boolean).sort((a, b) => a.title.localeCompare(b.title));
      html = top(`${list.length} film${list.length === 1 ? '' : 's'} seen`, list.length ? 'Every film you\'ve ticked off, with your stars.' : 'Tick a film as seen from its menu and it lands here.')
        + (list.length > 6 ? `<input type="search" class="acct-find" id="acctFind" placeholder="Find a film" aria-label="Find a film you've seen" autocomplete="off">` : '')
        + `<ul class="acct-frs" id="acctList">${list.map(f => filmRow(f, starsOf(f.id) || '<span class="acct-dim">Not rated</span>')).join('')}</ul>`;
    } else if (key === 'top') {
      const rated = Object.entries(m.stars || {}).map(([id, n]) => ({ f: filmOf(id), n })).filter(x => x.f && x.n);
      html = top(`Your top shelf`, rated.length ? `${s.top} film${s.top === 1 ? '' : 's'} on 4 or 5 stars, ${rated.length} rated in all. Change stars from a film's menu.` : 'Give a film your stars from its menu and it lands here.')
        + [5, 4, 3, 2, 1].map(n => { const l = rated.filter(x => x.n === n).sort((a, b) => a.f.title.localeCompare(b.f.title)); return l.length ? `<h4 class="acct-h4">${'&#9733;'.repeat(n)} <small>${n} star${n > 1 ? 's' : ''}, ${l.length}</small></h4><ul class="acct-frs">${l.map(x => filmRow(x.f, '')).join('')}</ul>` : '' }).join('');
    } else if (key === 'friends' || key === 'streak') {
      const fr = (FR.friends || []).slice().sort((a, b) => key === 'streak' ? (b.streak || 0) - (a.streak || 0) || nm(a).localeCompare(nm(b)) : nm(a).localeCompare(nm(b)));
      const together = f => done.filter(d => d.friend && d.friend.id === f.id && d.state === 'matched').length;
      const best = Math.max(1, ...fr.map(f => f.streak || 0));
      html = top(key === 'streak' ? `Best streak: ${s.streak}` : `${fr.length} friend${fr.length === 1 ? '' : 's'}`, key === 'streak' ? 'Dinner Duel matches in a row with each friend.' : fr.length ? 'Your friends on Reel Dinner and how your duels go.' : 'Send your invite link from the Friends tab.')
        + (fr.length ? `<ul class="acct-cards">${fr.map(f => `<li class="acct-card"><div class="acct-ct"><b>${ESC(nm(f))}</b><small>${f.streak > 0 ? `${f.streak} match${f.streak > 1 ? 'es' : ''} in a row` : 'No streak yet'}</small></div>
            ${key === 'streak' ? `<div class="acct-bars one"><i style="--w:${Math.round((f.streak || 0) / best * 100)}%"></i></div>` : `<p class="acct-cl">${together(f)} match${together(f) === 1 ? '' : 'es'} on the board</p>`}
            <div class="acct-cb"><button type="button" class="acct-go sm" data-duelto="${ESC(f.id)}">Send a duel</button></div></li>`).join('')}</ul>` : '')
        + `<div class="acct-acts"><button type="button" class="acct-ghost" data-tabgo="friends">Manage friends</button></div>`;
    } else if (key === 'rate') {
      html = top(`Match rate: ${s.finished ? Math.round(s.matchedN / s.finished * 100) : 0}%`, s.finished ? `${s.matchedN} of ${s.finished} finished duels matched in the last 30 days.` : 'Finish a Dinner Duel and it counts here.')
        + (done.length ? `<ul class="acct-cards">${done.map(d => { const f = filmOf(d.match); return `<li class="acct-card"><div class="acct-ct"><b>${d.friend ? ESC(nm(d.friend)) : 'Link duel'}</b><small>${ESC(ago(d.at))}</small></div>
            <p class="acct-cl">${d.state === 'matched' ? `Matched on <b>${ESC(f ? f.title : title(d.match))}</b>` : d.state === 'settled' ? `No match. The wheel picked <b>${ESC(f ? f.title : title(d.match))}</b>` : 'No match yet. Spin for it.'}</p>
            ${f ? `<div class="acct-cb"><button type="button" class="acct-go sm" data-film="${ESC(f.id)}">Open the menu</button></div>` : ''}</li>` }).join('')}</ul>` : '')
        + `<div class="acct-acts"><button type="button" class="acct-ghost" data-tabgo="duels">Open the board</button></div>`;
    } else if (key === 'late') {
      const late = typeof lateFees === 'function' ? lateFees() : [];
      html = top(late.length ? `Late fees: $${s.owe}.00` : 'No late fees', late.length ? 'A dollar a day per tape, never more than $10 a tape. Joke money, real guilt. Return a tape or tick the film as seen and the fee goes.' : 'Good member. Nothing overdue.')
        + (late.length ? `<ul class="acct-frs">${late.map(x => filmRow(x.f, `<span class="acct-fee">${x.days} day${x.days > 1 ? 's' : ''} late</span> $${Math.min(x.days, 10)}.00`, `<button type="button" class="acct-ghost sm" data-return="${ESC(x.f.id)}">Return</button>`)).join('')}</ul>` : '')
        + (s.out.length && !late.length ? `<h4 class="acct-h4">Out on rental</h4><ul class="acct-frs">${s.out.map(({ r, f }) => filmRow(f, `Due ${ESC(day(r.due))}`)).join('')}</ul>` : '');
    }
    body.innerHTML = `<div class="acct-statpage">${html}</div>`;
    const back = body.querySelector('#acctBack'); back.onclick = () => { sub = null; draw() }; back.focus();
    body.querySelectorAll('[data-film]').forEach(b => b.onclick = () => { const f = filmOf(b.dataset.film); if (!f) return; dismissModal(box); if (typeof openRentalMenu === 'function') openRentalMenu(f) });
    body.querySelectorAll('[data-tabgo]').forEach(b => b.onclick = () => { tab = b.dataset.tabgo; sub = null; draw() });
    body.querySelectorAll('[data-duelto]').forEach(b => b.onclick = () => { const f = (FR.friends || []).find(x => x.id === b.dataset.duelto); dismissModal(box); if (globalThis.RDMatch) RDMatch.newDuel(f ? { id: f.id, name: nm(f) } : undefined) });
    body.querySelectorAll('[data-return]').forEach(b => b.onclick = () => { m.out = (m.out || []).filter(r => r.id !== b.dataset.return); if (typeof saveMember === 'function') saveMember(); if (typeof renderMember === 'function') renderMember(); statPage(body, key) });
    const find = body.querySelector('#acctFind');
    if (find) find.oninput = () => { const q = find.value.trim().toLowerCase(); body.querySelectorAll('#acctList .acct-fr').forEach(li => { li.hidden = !!q && !li.querySelector('b').textContent.toLowerCase().includes(q) }) };
  }

  /* Now Showing: every live duel and whose turn it is */
  async function duels(body) {
    loading(body, 'Checking the board');
    let r, qz = null; try { [r, qz] = await Promise.all([rpc('duels_list'), rpc('quiz_list').catch(() => null)]) } catch (e) { return failed(body, () => duels(body)) }
    if (!box || tab !== 'duels') return;
    DUELS = (r && r.duels) || [];
    const QZ = (qz && qz.quizzes) || [];
    counts.turns = DUELS.filter(d => d.turn === 'you' && d.friend || d.turn === 'decide').length + QZ.filter(q => q.turn === 'you').length; badge(); tabs();
    const line = d => {
      const who = d.friend ? ESC(nm(d.friend)) : 'your link';
      if (d.turn === 'done') return `${d.state === 'settled' ? 'The wheel picked' : 'Matched on'} <b>${ESC(title(d.match))}</b>`;
      if (d.turn === 'decide') return 'No match. Spin for it.';
      if (d.final && d.fc && d.fc.round > 1 || d.final && d.fc && d.fc.phase === 'h2h') { const at = d.fc.phase === 'h2h' ? 'head to head' : `round ${d.fc.round}`; return d.turn === 'you' ? `Final Cut, ${at}. Your turn.` : `Final Cut, ${at}. Waiting on ${who}.` }
      if (d.turn === 'you') return d.mine ? `Your turn. ${d.mine} of ${d.n} swiped.` : 'Your turn.';
      return d.friend ? `Waiting on ${who}. ${d.their_n} of ${d.n} swiped.` : 'Nobody has opened your link yet.';
    };
    const act = d => d.turn === 'done' ? 'Open the menu' : d.turn === 'decide' ? 'Spin for it' : d.turn === 'you' ? (d.final && d.fc && (d.fc.round > 1 || d.fc.phase === 'h2h') ? 'Play your turn' : d.mine ? 'Keep swiping' : 'Play') : d.friend ? 'Have a look' : 'Send the link';
    body.innerHTML = `<div class="acct-acts"><button type="button" class="acct-go" id="acctNewDuel">New Dinner Duel</button></div>
      ${DUELS.length ? `<ul class="acct-cards">${DUELS.map(d => `<li class="acct-card${d.turn === 'you' || d.turn === 'decide' ? ' hot' : ''}">
        <div class="acct-ct"><b>${d.friend ? ESC(nm(d.friend)) : 'Link duel'}</b><small>${d.final ? 'Final Cut · ' : ''}${ESC(VIBE[d.vibe] || 'Surprise me')} · ${ESC(ago(d.at))}</small></div>
        <p class="acct-cl">${line(d)}</p>
        <div class="acct-cb"><button type="button" class="acct-go sm" data-duel="${ESC(d.id)}">${act(d)}</button><button type="button" class="acct-ghost sm" data-close="${ESC(d.id)}">Close</button></div></li>`).join('')}</ul>`
        : `<p class="acct-wait">No duels going. Start one and send it to a friend, they swipe whenever they get to it.</p>`}
      <h3 class="acct-h">Quiz challenges</h3>
      ${QZ.length ? `<ul class="acct-cards">${QZ.map(q => { const n = ESC(nm(q.friend)), mine = q.me === 1 ? q.from_score : q.to_score, theirs = q.me === 1 ? q.to_score : q.from_score;
        const ln = q.turn === 'you' ? `${n} got ${q.from_score}/10. Your turn.` : q.turn === 'them' ? `You got ${q.from_score}/10. Waiting on ${n}.` : `You ${mine}, ${n} ${theirs}.`;
        return `<li class="acct-card${q.turn === 'you' ? ' hot' : ''}"><div class="acct-ct"><b>${n}</b><small>${ESC(ago(q.at))}</small></div><p class="acct-cl">${ln}</p>
        <div class="acct-cb"><button type="button" class="acct-go sm" data-qz="${ESC(q.id)}">${q.turn === 'you' ? 'Play' : q.turn === 'done' ? 'See the result' : 'Rematch'}</button><button type="button" class="acct-ghost sm" data-qclose="${ESC(q.id)}">Close</button></div></li>` }).join('')}</ul>`
        : `<p class="acct-wait">No quiz challenges yet. Play one in Quiz night, or tap Quiz next to a friend.</p>`}`;
    body.querySelectorAll('[data-qz]').forEach(b => b.onclick = () => {
      const q = QZ.find(x => x.id === b.dataset.qz); if (!q) return; dismissModal(box);
      if (q.turn === 'you') RDQuiz.play(q); else if (q.turn === 'done') RDQuiz.result(q); else RDQuiz.challenge({ id: q.friend && q.friend.id, name: nm(q.friend) });
    });
    body.querySelectorAll('[data-qclose]').forEach(b => b.onclick = async () => {
      if (!b.classList.contains('arm')) { b.classList.add('arm'); b.textContent = 'Tap again to close'; setTimeout(() => { if (b.isConnected) { b.classList.remove('arm'); b.textContent = 'Close' } }, 5000); return }
      b.disabled = true;
      try { await rpc('quiz_close', { p_id: b.dataset.qclose }); duels(body) } catch (e) { b.disabled = false; toast("Couldn't close it. Check your connection.") }
    });
    body.querySelector('#acctNewDuel').onclick = () => { dismissModal(box); RDMatch.newDuel() };
    body.querySelectorAll('[data-duel]').forEach(b => b.onclick = async () => {
      const d = DUELS.find(x => x.id === b.dataset.duel); if (!d) return;
      if (d.turn === 'them' && !d.friend && d.code) {
        const url = inviteURL(d.code);
        return share(`${(member && member.name) || 'Your friend'} sent you a Dinner Duel on Reel Dinner. Swipe ${d.n} films and if we both keep one, dinner's sorted: ${url}`, url, b);
      }
      dismissModal(box);
      if (d.turn === 'done' && d.match) RDMatch.openFilm(d.match); else RDMatch.openDuel(d.id);
    });
    body.querySelectorAll('[data-close]').forEach(b => b.onclick = async () => {
      if (!b.classList.contains('arm')) { b.classList.add('arm'); b.textContent = 'Tap again to close'; setTimeout(() => { if (b.isConnected) { b.classList.remove('arm'); b.textContent = 'Close' } }, 5000); return }
      b.disabled = true;
      try { await rpc('duel_close', { p_id: b.dataset.close }); duels(body) } catch (e) { b.disabled = false; toast("Couldn't close it. Check your connection.") }
    });
  }

  /* the inbox: only things a friend did */
  const LINES = {
    friend_joined: i => [`<b>${ESC(nm(i.from))}</b> opened your invite. You're friends now.`, 'Send a duel', 'duelfriend'],
    friend_request: i => [`<b>${ESC(nm(i.from))}</b> wants to add you as a friend.`, null, 'request'],
    friend_accepted: i => [`<b>${ESC(nm(i.from))}</b> said yes. You're friends now.`, 'Send a duel', 'duelfriend'],
    duel_new: i => [`<b>${ESC(nm(i.from))}</b> sent you a Dinner Duel. Your turn.`, 'Play', 'duel'],
    duel_match: i => [`You and <b>${ESC(nm(i.from))}</b> both kept <b>${ESC(title(i.film))}</b>. Dinner's sorted.`, 'Open the menu', 'film'],
    duel_turn: i => [`Your turn in your Final Cut with <b>${ESC(nm(i.from))}</b>. The shortlist got shorter.`, 'Play your turn', 'duel'],
    duel_nomatch: i => [`No match with <b>${ESC(nm(i.from))}</b>. Time for a tie-breaker spin.`, 'Spin for it', 'duel'],
    duel_settled: i => [`The wheel picked <b>${ESC(title(i.film))}</b> for you and <b>${ESC(nm(i.from))}</b>.`, 'Open the menu', 'film'],
    quiz_new: i => { const q = i.quiz || {}; return [`<b>${ESC(nm(i.from))}</b> challenged you to Quiz night. They got <b>${+q.from_score}/10</b>.${q.turn === 'done' ? ' You played it.' : ''}`, q.turn === 'you' ? 'Play' : 'See the result', 'quiz'] },
    quiz_done: i => { const q = i.quiz || {}, w = q.to_score > q.from_score || (q.to_score === q.from_score && q.to_secs < q.from_secs) ? -1 : q.to_score === q.from_score && q.to_secs === q.from_secs ? 0 : 1;
      return [`<b>${ESC(nm(i.from))}</b> played your quiz: ${ESC(nm(i.from))} ${+q.to_score}, you ${+q.from_score}. ${w > 0 ? 'You win.' : w < 0 ? 'They win.' : 'Dead heat.'}`, 'Rematch', 'quizfriend'] },
    late_fee: i => [`<span class="acct-fee">Galaxy Video late fee</span> Your copy of <b>${ESC(title(i.film))}</b> is overdue. Please be kind, rewind and swipe. <b>${ESC(nm(i.from))}</b> is waiting.`, 'Swipe now', 'duel']
  };
  async function inbox(body) {
    loading(body, 'Checking your inbox');
    let r; try { r = await rpc('inbox_list') } catch (e) { return failed(body, () => inbox(body)) }
    if (!box || tab !== 'inbox') return;
    INBOX = (r && r.items) || [];
    const pending = new Set((FR.incoming || []).map(f => f.id));
    body.innerHTML = INBOX.length ? `<ul class="acct-cards">${INBOX.map(i => {
      const L = LINES[i.kind]; if (!L) return '';
      const [text, label, kind] = L(i);
      const req = kind === 'request' && i.from && pending.has(i.from.id);
      return `<li class="acct-card${i.read ? '' : ' new'}"><p class="acct-cl">${text}</p><div class="acct-cb"><small>${ESC(ago(i.at))}</small>
        ${req ? `<button type="button" class="acct-go sm" data-yes="${ESC(i.from.id)}">Accept</button><button type="button" class="acct-ghost sm" data-no="${ESC(i.from.id)}">No thanks</button>`
          : label && (kind !== 'duel' || i.duel) && (kind !== 'film' || i.film) && (kind !== 'duelfriend' && kind !== 'quizfriend' || i.from) && (kind !== 'quiz' || i.quiz) ? `<button type="button" class="acct-go sm" data-act="${kind}" data-i="${i.id}">${label}</button>` : ''}
        <button type="button" class="acct-x" data-del="${i.id}" aria-label="Delete this line">&times;</button></div></li>`;
    }).join('')}</ul><div class="acct-acts"><button type="button" class="acct-ghost sm" id="acctClear">Clear all</button></div>` : `<p class="acct-wait">Nothing yet. Turns, matches, quiz challenges and friend requests land here.</p>`;
    wireRequests(body, () => inbox(body));
    body.querySelectorAll('[data-act]').forEach(b => b.onclick = () => {
      const i = INBOX.find(x => String(x.id) === b.dataset.i); if (!i) return;
      dismissModal(box);
      if (b.dataset.act === 'quiz') return i.quiz.turn === 'you' ? RDQuiz.play(i.quiz) : RDQuiz.result(i.quiz);
      if (b.dataset.act === 'quizfriend') return RDQuiz.challenge({ id: i.from.id, name: nm(i.from) });
      if (b.dataset.act === 'duel') RDMatch.openDuel(i.duel);
      else if (b.dataset.act === 'film') RDMatch.openFilm(i.film);
      else RDMatch.newDuel({ id: i.from.id, name: nm(i.from) });
    });
    body.querySelectorAll('[data-del]').forEach(b => b.onclick = async () => {
      b.disabled = true;
      try { await rpc('inbox_delete', { p_ids: [+b.dataset.del] }); const li = b.closest('li'); li && li.remove(); INBOX = INBOX.filter(x => String(x.id) !== b.dataset.del); if (!INBOX.length) inbox(body) }
      catch (e) { b.disabled = false; toast("Couldn't delete that. Check your connection.") }
    });
    const clr = body.querySelector('#acctClear');
    if (clr) clr.onclick = async () => {
      if (!clr.classList.contains('arm')) { clr.classList.add('arm'); clr.textContent = 'Tap again to clear all'; setTimeout(() => { if (clr.isConnected) { clr.classList.remove('arm'); clr.textContent = 'Clear all' } }, 5000); return }
      clr.disabled = true;
      try { await rpc('inbox_delete', { p_ids: null }); counts.unread = 0; badge(); tabs(); inbox(body) } catch (e) { clr.disabled = false; toast("Couldn't clear it. Check your connection.") }
    };
    if (INBOX.some(i => !i.read)) { try { await rpc('inbox_read', { p_ids: null }); counts.unread = 0; badge(); tabs() } catch (e) { } }
  }
  function wireRequests(body, after) {
    body.querySelectorAll('[data-yes],[data-no]').forEach(b => b.onclick = async () => {
      const yes = !!b.dataset.yes, id = b.dataset.yes || b.dataset.no; b.disabled = true;
      try { await rpc('friend_respond', { p_from: id, p_accept: yes }); await loadFriends(); if (yes) toast("You're friends now. Send them a duel."); after() }
      catch (e) { b.disabled = false; toast("Couldn't reach Reel Dinner. Check your connection.") }
    });
  }

  /* friends: invite link, add by member number, requests, the list */
  async function friends(body) {
    loading(body, 'Getting your friends');
    await loadFriends();
    if (!box || tab !== 'friends') return;
    if (!frLoaded) return failed(body, () => friends(body));
    const f = FR.friends || [], inc = FR.incoming || [], out = FR.outgoing || [];
    const noName = !(member && member.name && member.name.trim());
    body.innerHTML = `${noName ? `<p class="acct-hint">Friends see the name on your member card. <button type="button" class="acct-link" id="acctNameGo">Add your name</button> so they know it's you.</p>` : ''}
      <div class="acct-acts"><button type="button" class="acct-go" id="acctInvite">Invite a friend</button></div>
      <form class="acct-add" id="acctAdd"><label for="acctNo">Or add someone by their member number</label><div><input id="acctNo" inputmode="numeric" autocomplete="off" maxlength="7" placeholder="123 456"><button type="submit" class="acct-ghost">Add</button></div><p class="acct-err" id="acctErr" role="alert"></p></form>
      ${inc.length ? `<h3 class="acct-h">Want to be friends</h3><ul class="acct-cards">${inc.map(p => `<li class="acct-card new"><div class="acct-ct"><b>${ESC(nm(p))}</b><small>${ESC(noFmt(p.no))}</small></div><div class="acct-cb"><button type="button" class="acct-go sm" data-yes="${ESC(p.id)}">Accept</button><button type="button" class="acct-ghost sm" data-no="${ESC(p.id)}">No thanks</button></div></li>`).join('')}</ul>` : ''}
      <h3 class="acct-h">Your friends${f.length ? ` (${f.length})` : ''}</h3>
      ${f.length ? `<ul class="acct-cards">${f.map(p => `<li class="acct-card"><div class="acct-ct"><b>${ESC(nm(p))}</b><small>${ESC(noFmt(p.no))}${p.streak > 1 ? ` · ${p.streak} matches in a row` : ''}</small></div>
        <div class="acct-cb"><button type="button" class="acct-go sm" data-duelf="${ESC(p.id)}">Send a duel</button><button type="button" class="acct-ghost sm" data-quizf="${ESC(p.id)}">Quiz</button><button type="button" class="acct-ghost sm" data-more="${ESC(p.id)}" aria-expanded="false">More</button></div>
        <div class="acct-more" hidden><button type="button" class="acct-ghost sm" data-rm="${ESC(p.id)}">Remove</button><button type="button" class="acct-ghost sm danger" data-block="${ESC(p.id)}">Block</button><small>Blocking removes them and stops their links, requests and duels reaching you.</small></div></li>`).join('')}</ul>`
        : `<p class="acct-wait">No one yet. Send your invite link to the people you have dinner with.</p>`}
      ${out.length ? `<h3 class="acct-h">Waiting to hear back</h3><ul class="acct-cards">${out.map(p => `<li class="acct-card"><div class="acct-ct"><b>${ESC(noFmt(p.no) || nm(p))}</b><small>Asked ${ESC(ago(p.at))}</small></div><div class="acct-cb"><button type="button" class="acct-ghost sm" data-rm="${ESC(p.id)}">Take it back</button></div></li>`).join('')}</ul>` : ''}`;
    const ng = body.querySelector('#acctNameGo'); if (ng) ng.onclick = () => { tab = 'settings'; draw() };
    body.querySelector('#acctInvite').onclick = async e => {
      const b = e.currentTarget; b.disabled = true;
      let r; try { r = await rpc('friend_invite') } catch (x) { b.disabled = false; return toast("Couldn't make a link. Check your connection.") }
      b.disabled = false;
      if (!r || r.status !== 'ok') return toast(r && r.status === 'slow' ? "That's a lot of links for one day. Try again tomorrow." : "Couldn't make a link. Try again.");
      const url = inviteURL(r.code);
      share(`Add me on Reel Dinner and we can send each other Dinner Duels. Swipe films, match one, and the menu's sorted: ${url}`, url, b);
    };
    body.querySelector('#acctAdd').onsubmit = async e => {
      e.preventDefault(); const er = body.querySelector('#acctErr'), inp = body.querySelector('#acctNo'), n = inp.value.replace(/\D/g, '');
      er.textContent = '';
      if (n.length !== 6) { er.textContent = 'Member numbers are 6 numbers, like 123 456.'; return }
      let r; try { r = await rpc('friend_request_by_no', { p_no: n }) } catch (x) { er.textContent = "Couldn't reach Reel Dinner. Check your connection."; return }
      const s = r && r.status;
      if (s === 'sent') { inp.value = ''; toast(`Request sent to ${noFmt(n)}. They'll see it in their inbox.`); return friends(body) }
      if (s === 'friends') { inp.value = ''; toast(`You and ${nm(r.friend)} are friends now.`); return friends(body) }
      er.textContent = s === 'notfound' ? "No member with that number. Check it with them." : s === 'self' ? "That's your own number." : s === 'already' ? "You're already friends." : s === 'slow' ? "That's a lot of requests for one day. Try again tomorrow." : "Couldn't send that. Try again.";
    };
    wireRequests(body, () => friends(body));
    body.querySelectorAll('[data-duelf]').forEach(b => b.onclick = () => { const p = f.find(x => x.id === b.dataset.duelf); dismissModal(box); RDMatch.newDuel({ id: p.id, name: nm(p) }) });
    body.querySelectorAll('[data-quizf]').forEach(b => b.onclick = () => { const p = f.find(x => x.id === b.dataset.quizf); dismissModal(box); RDQuiz.challenge({ id: p.id, name: nm(p) }) });
    body.querySelectorAll('[data-more]').forEach(b => b.onclick = () => { const m = b.closest('li').querySelector('.acct-more'); m.hidden = !m.hidden; b.setAttribute('aria-expanded', String(!m.hidden)) });
    const arm = (b, label, go) => b.onclick = async () => {
      if (!b.classList.contains('arm')) { const was = b.textContent; b.classList.add('arm'); b.textContent = label; setTimeout(() => { if (b.isConnected) { b.classList.remove('arm'); b.textContent = was } }, 5000); return }
      b.disabled = true; try { await go(); await loadFriends(); friends(body) } catch (e) { b.disabled = false; toast("Couldn't reach Reel Dinner. Check your connection.") }
    };
    body.querySelectorAll('[data-rm]').forEach(b => arm(b, 'Tap again', () => rpc('friend_remove', { p_friend: b.dataset.rm })));
    body.querySelectorAll('[data-block]').forEach(b => arm(b, 'Tap again to block', () => rpc('friend_block', { p_user: b.dataset.block })));
  }

  /* settings: the name friends see, email alerts, late fees, the account itself */
  async function settings(body) {
    const email = (RDAuth.email && RDAuth.email()) || '';
    body.innerHTML = `<form class="acct-name" id="acctNameF"><label for="acctName">Your name for friends</label><div><input id="acctName" maxlength="24" autocomplete="nickname" value="${ESC((member && member.name) || '')}" placeholder="Add your name"><button type="submit" class="acct-ghost">Save</button></div><p class="acct-small">It's the name on your member card. Leave it blank and friends see your member number.</p></form>
      <h3 class="acct-h">Alerts</h3><div id="acctPrefs"><p class="acct-wait">Getting your settings</p></div>
      <h3 class="acct-h">Your account</h3><p class="acct-small" id="syncNote">${email ? `Signed in as ${ESC(email)}.` : ''}</p>
      <div class="acct-acts left"><button type="button" class="acct-ghost" id="acctOut">Sign out</button><button type="button" class="acct-ghost danger" id="acctDel">Delete my account</button></div>
      <p class="acct-small">Deleting removes your card, friends, duels and inbox for good, on every device. <a href="privacy.html">Privacy policy</a></p>`;
    body.querySelector('#acctNameF').onsubmit = e => {
      e.preventDefault(); const v = body.querySelector('#acctName').value.trim().slice(0, 24);
      member.name = v; saveMember(); if (typeof renderMember === 'function') renderMember(); head(); toast(v ? `Friends will see ${v}.` : 'Friends will see your member number.');
    };
    body.querySelector('#acctOut').onclick = e => acctSignOut(e.currentTarget);
    body.querySelector('#acctDel').onclick = e => acctDelete(e.currentTarget);
    let p; try { p = PREFS || await rpc('alert_prefs_get') } catch (e) { p = null }
    const el = box && box.querySelector('#acctPrefs'); if (!el) return;
    if (!p || p.status !== 'ok') { el.innerHTML = `<p class="acct-wait">Couldn't get your alert settings. Check your connection.</p>`; return }
    PREFS = p;
    const row = (k, t, s) => `<label class="acct-sw"><input type="checkbox" role="switch" data-pref="${k}" ${p[k] ? 'checked' : ''}><span><b>${t}</b><small>${s}</small></span></label>`;
    el.innerHTML = row('email', 'Email me', 'When a friend sends a duel, a match lands or someone wants to be friends. One email a day at most, never 9pm to 8am.')
      + row('digest', 'Monday catch-up', 'One email on Monday, only if a friend is waiting on you.')
      + row('late_fees', 'Galaxy Video late fees', 'A joke late fee notice when you sit on a duel for two days.');
    el.querySelectorAll('[data-pref]').forEach(c => c.onchange = async () => {
      const next = Object.assign({}, PREFS, { [c.dataset.pref]: c.checked });
      try { const r = await rpc('alert_prefs_set', { p_email: next.email, p_digest: next.digest, p_late_fees: next.late_fees }); if (r && r.status === 'ok') PREFS = r }
      catch (e) { c.checked = !c.checked; toast("Couldn't save that. Check your connection.") }
    });
  }
  btn.addEventListener('click', () => openPanel());

  /* ---------- invite links ---------- */
  let handling = false;
  async function handleInvite(code) {
    if (handling) return; handling = true;
    try {
      if (inn()) {
        try { localStorage.removeItem('rd-invite') } catch (e) { }
        let r; try { r = await rpc('invite_accept', { p_code: code }) } catch (e) { try { localStorage.setItem('rd-invite', code) } catch (x) { } return }
        const s = r && r.status;
        if (s === 'self') { if (r.duel) RDMatch.openDuel(r.duel); else toast("That's your own invite link. Send it to a friend."); return }
        if (s === 'expired') return note('That link has expired', 'Invite links last two weeks. Ask them to send a new one.');
        if (s !== 'ok') return note("That link doesn't work any more", 'Ask them to send a new one.');
        await loadFriends(); ping();
        const who = nm(r.friend);
        if (r.duel) { toast(`You and ${who} are friends now. Here's their duel.`); RDMatch.openDuel(r.duel) }
        else if (r.taken) note(`You and ${who} are friends now`, 'Someone else already took that duel, but you can send each other new ones from My account.');
        else { toast(`You and ${who} are friends now.`); openPanel('friends') }
        return;
      }
      /* a guest: show who sent it, then the member card offer. The code waits on this phone until they sign in */
      let p; try { p = await RDAuth.rpcGuest('invite_peek', { p_code: code }) } catch (e) { return }
      if (!p || p.status !== 'ok') { try { localStorage.removeItem('rd-invite') } catch (e) { } if (p && (p.status === 'expired' || p.status === 'gone')) note('That link has expired', 'Ask them to send a new one. You can still spin, match and print menus as a guest.'); return }
      await walkinGone();
      const from = ESC(p.from || 'A friend');
      offer(p.duel && !p.taken ? `${from} sent you a Dinner Duel` : `${from} wants you on their friends list`,
        p.duel && !p.taken ? `Swipe ${p.n || 20} films. If you both keep one, dinner's sorted, menu and all. Grab a free member card to play.` : 'Friends on Reel Dinner send each other Dinner Duels: swipe a deck, match a film, cook the menu. Grab a free member card to join in.');
    } finally { handling = false }
  }
  /* the walk-in welcome goes first on a first visit */
  const walkinGone = () => new Promise(res => { let n = 0; const w = document.getElementById('walkin'); const t = () => (!w || w.hidden || ++n > 120) ? res() : setTimeout(t, 500); t() });
  function note(h, k) {
    const o = document.createElement('dialog'); o.className = 'counter galaxy'; o.setAttribute('aria-label', h);
    o.innerHTML = `<div class="syncbox"><h3>${ESC(h)}</h3><p>${ESC(k)}</p><div class="acts"><button type="button" class="go" data-a="ok">OK</button></div></div>`;
    o.addEventListener('click', e => { if (e.target === o || (e.target.dataset && e.target.dataset.a)) dismissModal(o) });
    mountModal(o, '.go', document.activeElement);
  }
  function offer(h, k) {
    const o = document.createElement('dialog'); o.className = 'counter galaxy'; o.setAttribute('aria-label', 'Invite');
    o.innerHTML = `<div class="syncbox"><h3>${h}</h3><p>${ESC(k)}</p><div class="acts"><button type="button" data-a="no">Not now</button><button type="button" class="go" data-a="join">Get my card</button></div><p class="acct-small dark">Not now keeps the invite on this phone. Tap the card button up top when you're ready.</p></div>`;
    o.addEventListener('click', e => {
      const a = e.target.dataset && e.target.dataset.a;
      if (e.target === o || a === 'no') dismissModal(o);
      if (a === 'join') { dismissModal(o); if (typeof openJoin === 'function') openJoin() }
    });
    mountModal(o, '.go', document.activeElement);
  }
  addEventListener('rd-signed-in', () => {
    frLoaded = false; startPing();
    let c = null; try { c = localStorage.getItem('rd-invite') } catch (e) { }
    if (c) handleInvite(c);
  });

  /* ?invite=CODE: keep the code on this phone, tidy the address bar */
  try {
    const q = new URLSearchParams(location.search).get('invite');
    if (q && /^[A-Za-z2-9]{8}$/.test(q)) {
      localStorage.setItem('rd-invite', q.toUpperCase());
      const u = new URLSearchParams(location.search); u.delete('invite');
      history.replaceState(history.state, '', location.pathname + (u.toString() ? '?' + u : '') + location.hash);
    }
  } catch (e) { }
  let waiting = null; try { waiting = localStorage.getItem('rd-invite') } catch (e) { }
  /* a Google sign-in on its way back finishes first; its rd-signed-in event picks the invite up */
  if (waiting && !(globalThis.RDAuth && RDAuth.fromGoogle())) handleInvite(waiting);
  startPing();
})();
