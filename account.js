/* Reel Dinner member accounts (Phase 1).
   Guest by default: nothing here runs a request until someone chooses to sign in.
   Sign-in is Supabase Auth on the Reel Dinner project: an emailed code (no password) or Google.
   The card itself is saved through member_load / member_save / member_link / member_delete
   (supabase/members.sql), which only ever touch the signed-in person's own card.
   The session lives in localStorage under rd-auth. Signing out wipes the device back to a guest pass. */
(function () {
  const SB = 'https://zpcgxupmclkxbzikdnfb.supabase.co';
  const KEY = 'sb_publishable_xKYQtgzsYWRLh843SrO9bQ_CfWc30ME';
  const STORE = 'rd-auth';
  let sess = null;
  try { sess = JSON.parse(localStorage.getItem(STORE) || 'null'); } catch (e) { sess = null; }
  if (sess && (!sess.refresh_token || !sess.user || !sess.user.id)) sess = null;
  const save = () => { try { if (sess) localStorage.setItem(STORE, JSON.stringify(sess)); else localStorage.removeItem(STORE); } catch (e) { } };

  function take(t) {
    if (!t || !t.access_token || !t.refresh_token) return false;
    const u = t.user || {};
    sess = {
      access_token: t.access_token, refresh_token: t.refresh_token,
      expires_at: t.expires_at ? +t.expires_at : Math.floor(Date.now() / 1000) + (+t.expires_in || 3600),
      user: { id: u.id || (sess && sess.user && sess.user.id) || jwtSub(t.access_token), email: u.email || (sess && sess.user && sess.user.email) || jwtEmail(t.access_token) || '' }
    };
    save();
    return !!sess.user.id;
  }
  function jwt(t) { try { return JSON.parse(atob(t.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))); } catch (e) { return {}; } }
  const jwtSub = t => jwt(t).sub || '', jwtEmail = t => jwt(t).email || '';

  /* coming back from Google: Supabase puts the session in the address after # */
  let fromGoogle = false;
  try {
    const h = location.hash || '';
    if (/[#&]access_token=/.test(h)) {
      const p = new URLSearchParams(h.slice(1));
      fromGoogle = take({ access_token: p.get('access_token'), refresh_token: p.get('refresh_token'), expires_at: p.get('expires_at'), expires_in: p.get('expires_in') });
      history.replaceState(null, '', location.pathname + location.search + '#shop');
    } else if (/[#&]error=/.test(h)) {
      const p = new URLSearchParams(h.slice(1));
      window.RD_AUTH_ERROR = (p.get('error_description') || 'Sign-in was cancelled.').replace(/\+/g, ' ');
      history.replaceState(null, '', location.pathname + location.search + '#shop');
    }
  } catch (e) { }

  async function call(path, body, token) {
    const h = { apikey: KEY, 'Content-Type': 'application/json' };
    if (token) h.Authorization = 'Bearer ' + token;
    const r = await fetch(SB + path, { method: 'POST', headers: h, body: JSON.stringify(body || {}) });
    let j = null; try { j = await r.json(); } catch (e) { j = null; }
    return { ok: r.ok, status: r.status, body: j };
  }
  function friendly(res) {
    const b = res.body || {}, m = String(b.msg || b.message || b.error_description || b.error || '');
    if (res.status === 429 || /security purposes|rate limit/i.test(m)) {
      const s = (m.match(/after (\d+) seconds?/) || [])[1];
      return s ? `Hang on ${s} seconds, then ask for another code.` : 'Too many tries. Give it a minute and try again.';
    }
    if (/expired|invalid/i.test(m)) return "That code didn't work. Check it, or ask for a new one.";
    if (/email/i.test(m) && /valid|format/i.test(m)) return "That email doesn't look right.";
    if (/signups? not allowed|disabled/i.test(m)) return 'Sign-ups are switched off right now. Try again later.';
    return "Couldn't sign in. Check your connection and try again.";
  }

  let refreshing = null;
  async function token() {
    if (!sess) return null;
    if (sess.expires_at - 60 > Date.now() / 1000) return sess.access_token;
    if (!refreshing) refreshing = (async () => {
      try {
        const r = await call('/auth/v1/token?grant_type=refresh_token', { refresh_token: sess.refresh_token });
        if (r.ok && take(r.body)) return sess.access_token;
        /* a refresh token that the server no longer accepts means the account is gone or signed out elsewhere */
        if (r.status === 400 || r.status === 401 || r.status === 403) { sess = null; save(); window.dispatchEvent(new Event('rd-auth-lost')); }
        return null;
      } catch (e) { return null; } finally { refreshing = null; }
    })();
    return refreshing;
  }

  async function rpc(fn, args) {
    const t = await token();
    if (!t) throw new Error(sess ? 'offline' : 'signedout');
    const r = await call('/rest/v1/rpc/' + fn, args || {}, t);
    if (!r.ok) throw new Error(r.status === 401 ? 'signedout' : 'error');
    return r.body;
  }

  window.RDAuth = {
    signedIn: () => !!sess,
    email: () => (sess && sess.user.email) || '',
    fromGoogle: () => fromGoogle,
    /* step 1 of the email sign-in: Supabase emails a short code */
    async sendCode(email) {
      try {
        const r = await call('/auth/v1/otp', { email, create_user: true });
        return r.ok ? { ok: true } : { ok: false, msg: friendly(r) };
      } catch (e) { return { ok: false, msg: "Couldn't reach the sign-in system. Check your connection." }; }
    },
    /* step 2: the code they typed in */
    async verifyCode(email, code) {
      try {
        const r = await call('/auth/v1/verify', { type: 'email', email, token: code });
        if (r.ok && take(r.body)) return { ok: true };
        return { ok: false, msg: friendly(r) };
      } catch (e) { return { ok: false, msg: "Couldn't reach the sign-in system. Check your connection." }; }
    },
    google() {
      const back = location.origin + location.pathname;
      location.href = SB + '/auth/v1/authorize?provider=google&redirect_to=' + encodeURIComponent(back);
    },
    rpc,
    async signOut() {
      const t = sess && sess.access_token;
      sess = null; save();
      if (t) { try { await call('/auth/v1/logout?scope=local', {}, t); } catch (e) { } }
    },
    forget() { sess = null; save(); }
  };
})();
