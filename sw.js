/* Reel Dinner offline worker.
   The page itself: network first, so updates show straight away, with the saved copy when offline.
   Scripts carry a ?v= stamp that changes whenever they change, so a saved copy is always safe to use.
   Film files: carry a ?v fingerprint of their content. They live in their own store that app updates never wipe,
   so saved menus survive updates; a changed film is fetched fresh, and offline the last saved copy is used.
   Menu layouts and the dish lists carry a ?v stamp too and live in the same store.
   After the first visit the page sends the full list and the worker saves anything missing in the background, so every film works offline.
   Photos: saved on first view in their own store that updates never wipe, capped so it can't grow forever. Posters from TMDB are saved
   with permission headers, so a saved poster still works in Save PDF and Save image.
   Fonts (assets/fonts/files) and the save tools (assets/lib): saved the first time a menu or a save needs them,
   never all at once. Their names change whenever their content does, so they sit in their own store that app updates
   leave alone, and a menu that worked offline once keeps working after an update. */
const VERSION = 'mns-f5a54815';
const FILMS_CACHE = 'mns-films';
const IMAGES_CACHE = 'mns-images';
const STATIC_CACHE = 'mns-static';
const IMAGES_MAX = 600;
const FILM_RX = /data\/film\/[^/]+\.json$|data\/(dish-names|dish-notes|trivia)\.json$|(^|\/)(menu-)?formats\/[^/]+\.js$/;
const IMG_RX = /\.(webp|jpe?g|png|gif|svg|avif)$/i;
const STATIC_RX = /\/assets\/(fonts\/files|lib)\/[^/]+$/;
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'assets/app/icon-192.png', 'assets/app/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const films = await caches.open(FILMS_CACHE);
    for (const k of await caches.keys()) {
      if (k === VERSION || k === FILMS_CACHE || k === IMAGES_CACHE || k === STATIC_CACHE) continue;
      /* carry saved film files over from the old store before it goes, so offline menus survive this update */
      const old = await caches.open(k);
      for (const r of await old.keys()) if (FILM_RX.test(new URL(r.url).pathname) && !(await films.match(r, {ignoreSearch: true}))) { const res = await old.match(r); if (res) { try { await films.put(r, res); } catch (err) {} } }
      await caches.delete(k);
    }
    try { await imageTrim(); } catch (err) {}
    try { await staticTrim(); } catch (err) {}
    await self.clients.claim();
  })());
});
/* fonts and save tools are named by their content, so a new font set leaves old files behind. On each update, drop any saved
   font that assets/fonts/files.json no longer lists, and any save tool that isn't one of the two in use. Offline, nothing is dropped */
const LIBS = ['html2canvas-1.4.1.min.js', 'jspdf-2.5.1.umd.min.js'];
const staticTrim = async () => {
  const res = await fetch('assets/fonts/files.json', {cache: 'no-store'});
  if (!res.ok) return;
  const keep = new Set(await res.json());
  const cache = await caches.open(STATIC_CACHE);
  for (const r of await cache.keys()) {
    const m = new URL(r.url).pathname.match(/\/assets\/(fonts\/files|lib)\/([^/]+)$/);
    if (m && !(m[1] === 'lib' ? LIBS.includes(m[2]) : keep.has(m[2]))) await cache.delete(r);
  }
};
const filmFetch = async req => {
  const cache = await caches.open(FILMS_CACHE);
  const hit = await cache.match(req);
  if (hit) return hit;
  try {
    const res = await fetch(req);
    if (res.ok) {
      const path = new URL(req.url).pathname;
      /* review 22: save the new copy first, then drop older ones, so a full store never leaves a menu with nothing */
      try {
        await cache.put(req, res.clone());
        for (const r of await cache.keys()) if (new URL(r.url).pathname === path && r.url !== req.url) await cache.delete(r);
      } catch (err) {}
    }
    return res;
  } catch (err) { return (await cache.match(req, {ignoreSearch: true})) || Response.error(); }
};
const networkFirst = async req => {
  const cache = await caches.open(VERSION);
  try { const res = await fetch(req); if (res.ok) cache.put(req, res.clone()).catch(() => {}); return res; }
  catch (e) { return (await cache.match(req, {ignoreSearch: true})) || (await cache.match('index.html')) || Response.error(); }
};
const staleWhileRevalidate = async (req, e) => {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req);
  const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()).catch(() => {}); return res; });
  if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
  try { return await net; } catch (err) { return (await cache.match(req, {ignoreSearch: true})) || Response.error(); }
};
const cacheFirst = async (req, store = VERSION) => {
  const cache = await caches.open(store);
  const hit = await cache.match(req);
  /* a copy saved without permission headers can't be used to build a saved image, so skip it */
  if (hit && !(req.mode === 'cors' && hit.type === 'opaque')) return hit;
  let res;
  try { res = await fetch(req); } catch (err) { return (await cache.match(req, {ignoreSearch: true})) || Response.error(); }
  if (res.ok && res.type !== 'opaque') cache.put(req, res.clone()).catch(() => {});
  else if (res.type === 'opaque' && !hit) cache.put(req, res.clone()).catch(() => {});
  return res;
};
/* photos: saved copy first. Our own photos refresh in the background in case one was replaced; TMDB paths never change.
   A TMDB poster is fetched with permission headers so the saved copy can be drawn into a PDF; offline with nothing saved, the page shows its placeholder */
let imgPuts = 0;
const imgFresh = new Set();
/* review 22: the count restarts whenever the browser stops the worker, so the trim also runs on each start and on activate.
   The site's own photos are few and needed for the shop, so TMDB photos go first, oldest saved first */
const imageTrim = async cache => {
  cache = cache || await caches.open(IMAGES_CACHE);
  const keys = await cache.keys(), over = keys.length - IMAGES_MAX;
  if (over <= 0) return;
  const own = r => new URL(r.url).origin === self.location.origin;
  const order = keys.filter(r => !own(r)).concat(keys.filter(own));
  for (const r of order.slice(0, over)) await cache.delete(r);
};
let trimmed = false;
const imageFetch = async (req, e) => {
  const cache = await caches.open(IMAGES_CACHE);
  const url = new URL(req.url), same = url.origin === self.location.origin;
  const hit = await caches.match(req.url);
  const get = async () => {
    /* TMDB only sends permission headers when asked, so a poster the browser already holds from a plain load fails here once: ask the network again */
    const cors = how => fetch(new Request(req.url, {mode: 'cors', credentials: 'omit', cache: how}));
    const res = same ? await fetch(req) : await cors('default').catch(() => cors('reload')).catch(() => fetch(req));
    if (res.ok && res.status !== 206 && res.type !== 'opaque') {
      /* review 22: a full store must not cost the photo it just fetched */
      try { await cache.put(req.url, res.clone()); } catch (err) {}
      if (!trimmed || ++imgPuts % 50 === 0) { trimmed = true; imageTrim(cache).catch(() => {}); }
    }
    return res;
  };
  if (hit) {
    if (same && !imgFresh.has(req.url)) { imgFresh.add(req.url); e.waitUntil(get().catch(() => {})); }
    return hit;
  }
  try { return await get(); } catch (err) { return Response.error(); }
};
/* the page sends every film file, layout and dish list once it's in; anything not saved yet is fetched quietly, a few at a time */
let warming = null;
const warm = async urls => {
  const cache = await caches.open(FILMS_CACHE);
  const have = new Set(), byPath = {};
  for (const r of await cache.keys()) { have.add(r.url); const p = new URL(r.url).pathname; (byPath[p] = byPath[p] || []).push(r); }
  const todo = urls.map(u => new URL(u, self.location.href).href).filter(u => !have.has(u));
  let i = 0, saved = 0, full = false;
  const lane = async () => {
    while (i < todo.length) {
      const u = todo[i++];
      try {
        const res = await fetch(u);
        if (!res.ok) continue;
        /* review 22: save first, then the older copy of the same file goes, as in filmFetch. A full store ends the whole save */
        try { await cache.put(u, res); } catch (err) { full = true; break; }
        for (const r of byPath[new URL(u).pathname] || []) if (r.url !== u) await cache.delete(r);
        saved++;
      } catch (err) { if (!navigator.onLine) break; }
      if (full) break;
    }
  };
  await Promise.all([lane(), lane(), lane(), lane()]);
  for (const c of await self.clients.matchAll()) c.postMessage({warmed: saved, missing: todo.length - saved});
};
self.addEventListener('message', e => {
  if (!e.data || !Array.isArray(e.data.warm)) return;
  if (!warming) warming = warm(e.data.warm).finally(() => { warming = null; });
  e.waitUntil(warming);
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (same && (req.mode === 'navigate' || /\.html$/.test(url.pathname) || url.pathname.endsWith('/'))) return e.respondWith(networkFirst(req));
  if (same && FILM_RX.test(url.pathname)) return e.respondWith(filmFetch(req));
  if (same && STATIC_RX.test(url.pathname)) return e.respondWith(cacheFirst(req, STATIC_CACHE));
  if (same && url.searchParams.has('v')) return e.respondWith(cacheFirst(req));
  if (same && /\.(js|json|webmanifest)$/.test(url.pathname)) return e.respondWith(staleWhileRevalidate(req, e));
  if ((same && IMG_RX.test(url.pathname) && !url.searchParams.has('v')) || url.host === 'image.tmdb.org') return e.respondWith(imageFetch(req, e));
  if (same) return e.respondWith(cacheFirst(req));
});
