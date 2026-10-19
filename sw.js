/* Movie Night Spinner offline worker.
   The page itself: network first, so updates show straight away, with the saved copy when offline.
   Scripts carry a ?v= stamp that changes whenever they change, so a saved copy is always safe to use.
   Film files: the saved copy straight away, refreshed in the background.
   Photos, fonts and libraries: saved on first use. */
const VERSION = 'mns-e9a16afe';
const SHELL = ['./', 'index.html', 'manifest.webmanifest', 'assets/app/icon-192.png', 'assets/app/icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
const networkFirst = async req => {
  const cache = await caches.open(VERSION);
  try { const res = await fetch(req); if (res.ok) cache.put(req, res.clone()); return res; }
  catch (e) { return (await cache.match(req, {ignoreSearch: true})) || (await cache.match('index.html')) || Response.error(); }
};
const staleWhileRevalidate = async (req, e) => {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req);
  const net = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; });
  if (hit) { e.waitUntil(net.catch(() => {})); return hit; }
  try { return await net; } catch (err) { return (await cache.match(req, {ignoreSearch: true})) || Response.error(); }
};
const cacheFirst = async req => {
  const cache = await caches.open(VERSION);
  const hit = await cache.match(req);
  /* a copy saved without permission headers can't be used to build a saved image, so skip it */
  if (hit && !(req.mode === 'cors' && hit.type === 'opaque')) return hit;
  const res = await fetch(req);
  if (res.ok && res.type !== 'opaque') cache.put(req, res.clone());
  else if (res.type === 'opaque' && !hit) cache.put(req, res.clone());
  return res;
};
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin;
  if (same && (req.mode === 'navigate' || /\.html$/.test(url.pathname) || url.pathname.endsWith('/'))) return e.respondWith(networkFirst(req));
  if (same && url.searchParams.has('v')) return e.respondWith(cacheFirst(req));
  if (same && /\.(js|json|webmanifest)$/.test(url.pathname)) return e.respondWith(staleWhileRevalidate(req, e));
  /* posters are left to the browser: routing them through here broke saving the menu as an image */
  if (same || /fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com/.test(url.host)) return e.respondWith(cacheFirst(req));
});
