/* Reel Dinner app mode. Loaded first, in the head, by index.html.

   One switch: window.REEL_APP is true inside the iPhone and Android app (Capacitor), and in a browser opened with
   ?app=1 for testing (it sticks for the tab; ?app=0 turns it off). On the website it is false and nothing here runs
   beyond setting up window.REEL, whose helpers then fall back to the browser.

   In app mode (docs/APP-BUILD.md, docs/ARTWORK-RIGHTS.md option E):
   - No film artwork. TMDB posters, stills and title logos, the generated posters, the film frame and the menu photos
     listed in app-art.js are swapped before the page asks for them, so no request goes to image.tmdb.org. Each slot
     gets an original panel drawn here: the title and year set in that menu's own type, on its own colours.
     A per-film poster image listed in app-art.js (posters) takes the place of the drawn poster when it exists.
   - A content security policy stops any image from outside the app loading at all, as a backstop.
   - The privacy and support links and the request form go to https://reeldinner.com.
   - window.REEL gives app.js the share sheet, Save to Files, the print dialog, haptics, reminders and
     cross-site posts that work in the app. */
(function () {
  "use strict";
  var W = window, D = document, cap = W.Capacitor;
  var native = !!(cap && typeof cap.isNativePlatform === "function" && cap.isNativePlatform());
  var forced = false;
  try {
    var q = location.search.match(/[?&]app=([01])(?:&|$)/);
    if (q) sessionStorage.setItem("reel-app", q[1]);
    forced = sessionStorage.getItem("reel-app") === "1";
  } catch (e) {}
  /* REEL_APP_BUILD is set in www/index.html by scripts/build-app.cjs, so the app build is always in app mode */
  var on = native || forced || !!W.REEL_APP_BUILD, SITE = "https://reeldinner.com";
  W.REEL_APP = on; W.REEL_NATIVE = native; W.REEL_SITE = SITE;

  var plugin = function (n) { return native && cap.Plugins ? cap.Plugins[n] || null : null; };
  var b64 = function (blob) {
    return new Promise(function (ok, bad) {
      var r = new FileReader();
      r.onload = function () { ok(String(r.result).replace(/^data:[^,]*,/, "")); };
      r.onerror = function () { bad(r.error); };
      r.readAsDataURL(blob);
    });
  };
  var cancelled = function (e) { return /cancel|abort|dismiss/i.test(String(e && (e.message || e.errorMessage || e))); };
  var IOS = native && cap.getPlatform && cap.getPlatform() === "ios";

  /* ---------- helpers app.js calls; on the website each one says "not handled" so the old code runs ---------- */
  var REEL = W.REEL = {
    app: on, native: native, site: SITE,
    /* the address a shared menu link or calendar note points at */
    siteURL: function () { return on ? SITE + "/" : location.origin + location.pathname; },

    /* native share sheet. o: {title, text, url, files: [{blob, name}]}. Returns "sent", "cancel" or false (not handled) */
    share: async function (o) {
      var S = plugin("Share"), F = plugin("Filesystem");
      if (!S) return false;
      try {
        var files = [];
        for (var i = 0; o.files && i < o.files.length; i++) {
          var f = o.files[i];
          var r = await F.writeFile({ path: f.name, data: await b64(f.blob), directory: "CACHE" });
          files.push(r.uri);
        }
        var opts = { title: o.title || "", dialogTitle: o.title || "Share" };
        if (o.text) opts.text = o.text;
        if (o.url) opts.url = o.url;
        if (files.length) opts.files = files;
        await S.share(opts);
        return "sent";
      } catch (e) { if (cancelled(e)) return "cancel"; throw e; }
    },

    /* Save PDF in the app: a copy goes in the app's Documents folder (Files, On My iPhone, Reel Dinner on iPhone),
       then the share sheet opens on it, which has Save to Files on iPhone and Drive or Files on Android.
       Returns "saved", "cancel" or false (not handled) */
    saveFile: async function (blob, name) {
      var F = plugin("Filesystem"), S = plugin("Share");
      if (!F || !S) return false;
      var data = await b64(blob);
      if (IOS) { try { await F.writeFile({ path: name, data: data, directory: "DOCUMENTS" }); } catch (e) {} }
      var r = await F.writeFile({ path: name, data: data, directory: "CACHE" });
      try { await S.share({ title: name, dialogTitle: "Save " + name, files: [r.uri] }); return "saved"; }
      catch (e) { if (cancelled(e)) return IOS ? "saved" : "cancel"; throw e; }
    },

    /* the phone's own print dialog (AirPrint on iPhone, the Android print service). Returns true if handled */
    print: async function (blob, name) {
      var P = plugin("Printer");
      if (!P) return false;
      await P.printBase64({ data: await b64(blob), mimeType: "application/pdf", name: name || "Reel Dinner menu" });
      return true;
    },

    /* haptics: "tick" for each wedge past the pointer, anything else for the landing */
    haptic: function (kind) {
      var H = plugin("Haptics");
      if (!H) return false;
      try {
        if (kind === "tick") { var t = Date.now(); if (t - (REEL._lastTick || 0) < 45) return true; REEL._lastTick = t; H.selectionChanged(); }
        else H.notification({ type: "SUCCESS" });
      } catch (e) {}
      return true;
    },

    /* movie night reminders as local notifications: any prep-ahead steps, start cooking, and the showtime.
       o: {title, show: Date, start: Date, startText, steps: [{at: Date, title, body}], ask}. Asks permission the first
       time, unless ask is false (then "ask" comes back while the phone has not been asked yet).
       Returns "set:N" (N reminders, ":inexact" added on Android when Alarms and reminders is off, so they may come a
       few minutes late), "denied", "ask", "none" (nothing still ahead) or false (not handled) */
    remind: async function (o) {
      var N = plugin("LocalNotifications");
      if (!N) return false;
      var p = await N.checkPermissions(), prompt = function () { return p.display === "prompt" || p.display === "prompt-with-rationale"; };
      if (o.ask !== false && prompt()) p = await N.requestPermissions();
      if (p.display !== "granted") return o.ask === false && prompt() ? "ask" : "denied";
      await REEL.clearReminders();
      var now = Date.now(), list = [], ahead = function (d) { return d && d.getTime() > now + 60000; };
      (o.steps || []).slice(0, 3).forEach(function (s, i) {
        if (ahead(s.at)) list.push({ id: 4103 + i, title: s.title, body: s.body, schedule: { at: s.at, allowWhileIdle: true } });
      });
      if (ahead(o.start))
        list.push({ id: 4101, title: "Time to start cooking", body: o.startText || ("Movie night: " + o.title), schedule: { at: o.start, allowWhileIdle: true } });
      if (ahead(o.show))
        list.push({ id: 4102, title: "Movie night", body: o.title + " starts now. Lights down.", schedule: { at: o.show, allowWhileIdle: true } });
      if (!list.length) return "none";
      /* Android 12+: with Alarms and reminders off, the plugin opens that Settings screen on every exact schedule.
         Check first and schedule inexact instead, so a lock-in or prep tick never throws the person into Settings */
      var exact = true;
      if (!IOS && typeof N.checkExactNotificationSetting === "function") {
        try { exact = (await N.checkExactNotificationSetting()).exact_alarm === "granted"; } catch (e) {}
      }
      if (!exact) list.forEach(function (n) { n.isExactNotification = false; });
      await N.schedule({ notifications: list });
      return "set:" + list.length + (exact ? "" : ":inexact");
    },
    clearReminders: async function () {
      var N = plugin("LocalNotifications");
      if (!N) return false;
      try { await N.cancel({ notifications: [{ id: 4101 }, { id: 4102 }, { id: 4103 }, { id: 4104 }, { id: 4105 }] }); } catch (e) {}
      return true;
    },

    /* a POST to another site from inside the app (the request form to reeldinner.com, the member card sync).
       The app's own address is capacitor://localhost or https://localhost, which those servers do not allow
       for browser requests, so the app sends them through Capacitor's native HTTP instead.
       type "form" sends fields as a form, "json" as JSON. Resolves to {ok, status, json()} */
    post: async function (url, data, type) {
      var H = plugin("CapacitorHttp");
      var ct = type === "json" ? "application/json" : "application/x-www-form-urlencoded";
      if (H) {
        var r = await H.request({ url: url, method: "POST", headers: { "Content-Type": ct }, data: data });
        var body = r.data;
        return { ok: r.status >= 200 && r.status < 300, status: r.status, json: async function () { return typeof body === "string" ? JSON.parse(body) : body; } };
      }
      /* a browser testing app mode: the form still reaches the site, but its reply cannot be read from here */
      if (type !== "json") {
        await fetch(url, { method: "POST", mode: "no-cors", headers: { "Content-Type": ct }, body: new URLSearchParams(data).toString() });
        return { ok: true, status: 0, json: async function () { return {}; } };
      }
      return fetch(url, { method: "POST", headers: { "Content-Type": ct }, body: JSON.stringify(data) });
    },

    /* an original poster drawn on a canvas, for places that paint a picture themselves (the story image) */
    posterCanvas: function (f, w, h, st) { return drawPanel("poster", w, h, f, fillStyle(st), 0); }
  };

  if (!on) return;
  D.documentElement.classList.add("reel-app");

  /* ---------- backstop: nothing outside the app can load as an image ---------- */
  var csp = D.createElement("meta");
  csp.httpEquiv = "Content-Security-Policy";
  csp.content = "img-src 'self' data: blob:";
  (D.head || D.documentElement).appendChild(csp);

  var css = D.createElement("style");
  css.textContent = 'img[src*="#art:hide"]{display:none!important}.lb-credit{display:none!important}';
  (D.head || D.documentElement).appendChild(css);

  /* app-art.js: the blocked list, the shop photo swaps and any per-film poster images */
  if (!W.APP_ART) { try { D.write('<script src="app-art.js"><\/script>'); } catch (e) {} }
  var ART = function () { return W.APP_ART || { swap: {}, prefix: [], block: [], posters: {} }; };
  var blockSet = null;
  var blocked = function (p) {
    if (!blockSet) { blockSet = {}; ART().block.forEach(function (b) { blockSet[b] = 1; }); }
    return !!blockSet[p];
  };
  var posterOf = null;
  var posterFilm = function (p) {
    if (!posterOf && typeof TMDB_POSTERS !== "undefined") { posterOf = {}; for (var k in TMDB_POSTERS) posterOf[TMDB_POSTERS[k]] = k; }
    return posterOf && posterOf[p] || null;
  };

  /* ---------- the swap: every image address passes through art() before the page can ask for it ---------- */
  var BLANK = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7";
  var MARK = BLANK + "#art:";
  function art(u) {
    u = String(u || "").trim();
    if (!u || u.indexOf("#art:") > 0) return null;
    var t = u.match(/^(?:https?:)?\/\/image\.tmdb\.org\/t\/p\/([a-z0-9]+)(\/[^?#"')\s]*)/i);
    if (t) {
      if (t[1] === "w92") return MARK + "hide:";
      var kind = /\.(png|svg)$/i.test(t[2]) ? "logo" : posterFilm(t[2]) ? "poster" : "still";
      return MARK + kind + ":" + t[2];
    }
    var l = u.replace(/^(?:https?:\/\/[^/]+)?\.?\/+/, "").replace(/[?#].*$/, "");
    var A = ART();
    if (A.swap[l]) return A.swap[l];
    if (blocked(l)) return MARK + "still:" + l;
    for (var i = 0; i < A.prefix.length; i++) if (l.indexOf(A.prefix[i]) === 0) return MARK + (/menu-posters/.test(l) ? "poster:" : "still:") + l;
    return null;
  }
  function fixSrcset(v) {
    v = String(v == null ? "" : v);
    if (!/tmdb|assets\//.test(v)) return v;
    var bad = false;
    var out = v.split(",").map(function (part) {
      var bits = part.trim().split(/\s+/), r = art(bits[0]);
      if (r === null) return part.trim();
      if (r.indexOf(MARK) === 0) { bad = true; return ""; }
      bits[0] = r; return bits.join(" ");
    });
    return bad ? "" : out.join(", ");
  }
  function scrubCSS(s) {
    s = String(s == null ? "" : s);
    if (!/url\(/i.test(s)) return s;
    return s.replace(/url\(\s*(&quot;|"|'|)(.*?)\1\s*\)/gi, function (m, q, u) { var r = art(u); return r === null ? m : "url(" + q + r + q + ")"; });
  }
  function scrub(h) {
    h = String(h == null ? "" : h);
    if (!/tmdb|assets\/(era|menu-|hero)/.test(h)) return h;
    h = h.replace(/(\s(?:src|data-src|poster)=)(["'])(.*?)\2/gi, function (m, a, q, u) { var r = art(u); return r === null ? m : a + q + r + q; });
    h = h.replace(/\ssrcset=(["'])(.*?)\1/gi, function (m, q, v) { var r = fixSrcset(v); return r === v ? m : r ? " srcset=" + q + r + q : ""; });
    return scrubCSS(h);
  }
  REEL.scrub = scrub; REEL.art = art;

  function hook(proto, name, wrap) {
    var d = proto && Object.getOwnPropertyDescriptor(proto, name);
    if (!d || !d.set || !d.configurable) return null;
    Object.defineProperty(proto, name, { configurable: true, enumerable: d.enumerable, get: d.get, set: function (v) { return d.set.call(this, wrap.call(this, v)); } });
    return d;
  }
  [Element.prototype, HTMLElement.prototype].forEach(function (p) { hook(p, "innerHTML", scrub); hook(p, "outerHTML", scrub); });
  var iah = Element.prototype.insertAdjacentHTML;
  Element.prototype.insertAdjacentHTML = function (pos, h) { return iah.call(this, pos, scrub(h)); };
  var srcD = hook(HTMLImageElement.prototype, "src", function (v) { var r = art(v); return r === null ? v : r; });
  hook(HTMLImageElement.prototype, "srcset", fixSrcset);
  if (W.HTMLSourceElement) hook(HTMLSourceElement.prototype, "srcset", fixSrcset);
  var setAttr = Element.prototype.setAttribute;
  Element.prototype.setAttribute = function (n, v) {
    var k = String(n).toLowerCase();
    if (k === "src" || k === "data-src") { var r = art(v); if (r !== null) v = r; }
    else if (k === "srcset") v = fixSrcset(v);
    else if (k === "style") v = scrubCSS(v);
    return setAttr.call(this, n, v);
  };
  var SD = W.CSSStyleDeclaration && CSSStyleDeclaration.prototype;
  ["backgroundImage", "background", "cssText", "background-image"].forEach(function (n) { hook(SD, n, scrubCSS); });
  if (SD) {
    var setProp = SD.setProperty;
    SD.setProperty = function (n, v, p) { return setProp.call(this, n, /background/i.test(n) ? scrubCSS(v) : v, p); };
  }

  /* ---------- fill: draw an original panel into every swapped slot, at the size it shows ---------- */
  var SITE_STYLE = { font: '"Limelight", Georgia, serif', ink: "#f4e6c8", bg: "#3a0b16", accent: "#e7c069", page: "#160609" };
  var setSrc = function (img, v) { if (srcD) srcD.set.call(img, v); else img.src = v; };

  function rgb(c) {
    var m = String(c || "").match(/rgba?\(([^)]+)\)/);
    if (m) { var p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number); return { r: p[0], g: p[1], b: p[2], a: p.length > 3 ? p[3] : 1 }; }
    m = String(c || "").match(/^#([0-9a-f]{3,8})$/i);
    if (m) { var h = m[1]; if (h.length < 6) h = h.split("").map(function (x) { return x + x; }).join(""); return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16), a: 1 }; }
    return null;
  }
  function lum(c) { c = rgb(c); if (!c) return 0.5; var f = function (v) { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b); }
  function contrast(a, b) { var x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); }
  function hex(c) { c = rgb(c); if (!c) return null; return "#" + [c.r, c.g, c.b].map(function (v) { return ("0" + Math.round(v).toString(16)).slice(-2); }).join(""); }
  function shade(c, k) { c = rgb(c) || { r: 40, g: 20, b: 20 }; var f = function (v) { return Math.max(0, Math.min(255, k < 0 ? v * (1 + k) : v + (255 - v) * k)); }; return "rgb(" + [f(c.r), f(c.g), f(c.b)].map(Math.round).join(",") + ")"; }
  function pageBg(el) {
    for (var e = el; e && e.nodeType === 1; e = e.parentElement) {
      var c = rgb(getComputedStyle(e).backgroundColor);
      if (c && c.a > 0.6) return hex(getComputedStyle(e).backgroundColor);
    }
    return null;
  }
  /* the menu's own display type: the biggest words in the menu, which is the title or the venue name */
  var typeCache = new WeakMap();
  function menuType(box) {
    var key = box.firstElementChild, hit = typeCache.get(box);
    if (hit && hit.key === key) return hit.v;
    var best = null, bs = 0, els = box.querySelectorAll("div,span,h1,h2,h3,p,b,strong,em,i");
    for (var i = 0; i < els.length && i < 1500; i++) {
      var e = els[i], t = "";
      for (var n = e.firstChild; n; n = n.nextSibling) if (n.nodeType === 3) t += n.nodeValue;
      if (t.trim().length < 3) continue;
      var cs = getComputedStyle(e), fs = parseFloat(cs.fontSize) || 0;
      if (fs > bs && cs.visibility !== "hidden" && cs.display !== "none") { bs = fs; best = cs; }
    }
    var v = best ? { font: best.fontFamily, weight: best.fontWeight, style: best.fontStyle, ink: hex(best.color), upper: best.textTransform === "uppercase" } : null;
    typeCache.set(box, { key: key, v: v });
    return v;
  }
  function fillStyle(st) {
    st = st || {};
    return { font: st.font || SITE_STYLE.font, weight: st.weight || "400", fstyle: st.style || "normal", ink: st.ink || SITE_STYLE.ink, bg: st.bg || SITE_STYLE.bg, accent: st.accent || SITE_STYLE.accent, title: st.title || st.ink || SITE_STYLE.ink, upper: !!st.upper };
  }
  function styleFor(img, film) {
    var box = img.closest(".fx-face") || img.closest(".mcard") || img.closest("[class*=kit]");
    if (!box) return fillStyle(SITE_STYLE);
    var t = menuType(box) || {}, page = pageBg(img.parentElement) || "#f3ead6";
    var pal = film && film._lib && film._lib.palette || {};
    var title = t.ink || pal.dark || "#1d1712";
    var bg = pal.dark || (lum(title) < lum(page) ? title : shade(page, -0.72));
    var ink = lum(page) > 0.35 ? page : "#f6eedc";
    if (contrast(ink, bg) < 3.2) ink = lum(bg) > 0.3 ? "#17120e" : "#f6eedc";
    var accent = pal.accent || (title !== bg ? title : ink);
    if (contrast(accent, bg) < 1.8) accent = ink;
    return fillStyle({ font: t.font, weight: t.weight, style: t.style, upper: t.upper, ink: ink, bg: bg, accent: accent, title: title });
  }
  function currentFilm() { try { return typeof current !== "undefined" ? current : null; } catch (e) { return null; } }
  function filmFor(info) {
    var id = info.kind === "poster" && posterFilm(info.p);
    if (id && typeof FILMS !== "undefined") { for (var i = 0; i < FILMS.length; i++) if (FILMS[i].id === id) return FILMS[i]; }
    if (id) { var m = id.match(/^(.*) \((\d{4})\)$/); return { id: id, title: m ? m[1] : id, year: m ? m[2] : "" }; }
    return currentFilm();
  }

  function wrap(x, text, maxW, maxLines) {
    var words = String(text).split(/\s+/).filter(Boolean), lines = [], line = "";
    for (var i = 0; i < words.length; i++) {
      var tr = line ? line + " " + words[i] : words[i];
      if (x.measureText(tr).width > maxW && line) { lines.push(line); line = words[i]; } else line = tr;
    }
    if (line) lines.push(line);
    return lines.length <= maxLines ? lines : null;
  }
  /* biggest size at which the text fits the box in up to maxLines lines */
  function fit(x, st, text, maxW, maxH, maxLines, top, lh) {
    lh = lh || 1.08;
    for (var s = Math.min(top, maxH); s >= 7; s -= Math.max(1, s * 0.06)) {
      x.font = st.fstyle + " " + st.weight + " " + s.toFixed(1) + "px " + st.font;
      var l = wrap(x, text, maxW, maxLines);
      if (l && l.length * s * lh <= maxH && l.every(function (t) { return x.measureText(t).width <= maxW; })) return { size: s, lines: l, lh: lh };
    }
    x.font = st.fstyle + " " + st.weight + " 7px " + st.font;
    return { size: 7, lines: [String(text).slice(0, 30)], lh: lh };
  }
  function drawLines(x, f, cx, cy, col) {
    x.fillStyle = col; x.textAlign = "center"; x.textBaseline = "middle";
    var h = f.lines.length * f.size * f.lh, y = cy - h / 2 + f.size * f.lh / 2;
    f.lines.forEach(function (t, i) { x.fillText(t, cx, y + i * f.size * f.lh); });
  }
  function spaced(x, text, cx, cy, size, col, st) {
    x.font = "600 " + size + "px " + st.font; x.fillStyle = col; x.textAlign = "left"; x.textBaseline = "middle";
    var sp = size * 0.28, ch = text.split(""), w = ch.reduce(function (a, k) { return a + x.measureText(k).width; }, 0) + sp * (ch.length - 1), px = cx - w / 2;
    ch.forEach(function (k) { x.fillText(k, px, cy); px += x.measureText(k).width + sp; });
  }

  /* the panel itself. kind: poster, still or logo. idx varies the still panels in one menu */
  function drawPanel(kind, w, h, film, st, idx) {
    var k = Math.min(2.5, Math.max(1, 1400 / Math.max(w, h)));
    var c = D.createElement("canvas"); c.width = Math.max(2, Math.round(w * k)); c.height = Math.max(2, Math.round(h * k));
    var x = c.getContext("2d"); x.scale(k, k);
    var title = film ? film.title : "Reel Dinner", year = film && film.year ? String(film.year) : "";
    var L = film && film._lib || {}, fl = L.flavour || {};
    if (st.upper) title = title.toUpperCase();
    if (kind === "logo") {
      var fl0 = fit(x, st, title, w * 0.94, h * 0.9, 2, h * 0.8, 1.02);
      drawLines(x, fl0, w / 2, h / 2, st.title);
      return c;
    }
    /* paper: the colour, a soft light from the middle and a fine diagonal line */
    x.fillStyle = st.bg; x.fillRect(0, 0, w, h);
    var g = x.createRadialGradient(w / 2, h * 0.42, 0, w / 2, h * 0.42, Math.max(w, h) * 0.75);
    g.addColorStop(0, "rgba(255,255,255,.10)"); g.addColorStop(1, "rgba(0,0,0,.18)");
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    x.save(); x.globalAlpha = 0.06; x.strokeStyle = st.ink; x.lineWidth = 1;
    for (var d = -h; d < w; d += 7) { x.beginPath(); x.moveTo(d, h); x.lineTo(d + h, 0); x.stroke(); }
    x.restore();
    var m = Math.min(w, h);
    if (m < 46) { var f0 = fit(x, st, title.charAt(0), w * 0.8, h * 0.8, 1, h * 0.8); drawLines(x, f0, w / 2, h / 2, st.accent); return c; }
    var inset = Math.max(4, m * 0.05);
    x.strokeStyle = st.accent; x.globalAlpha = 0.75; x.lineWidth = Math.max(1, m * 0.008); x.strokeRect(inset, inset, w - inset * 2, h - inset * 2);
    x.globalAlpha = 1;
    var iw = w - inset * 4, ih = h - inset * 4;
    if (kind === "poster" || h > w * 1.15) {
      var eye = Math.max(7, Math.min(16, w * 0.045));
      if (h > 120) spaced(x, "NOW SHOWING", w / 2, inset * 2 + eye, eye, st.accent, st);
      var top = h > 120 ? inset * 2 + eye * 2.6 : inset * 2, bottom = h - inset * 2 - (year ? Math.min(h * 0.1, w * 0.16) : 0) - (fl.venue && h > 200 ? eye * 2.2 : 0);
      var ft = fit(x, st, title, iw, Math.max(20, bottom - top), 5, Math.min(w * 0.3, h * 0.22));
      drawLines(x, ft, w / 2, (top + bottom) / 2, st.ink);
      if (year) {
        var ys = Math.min(h * 0.07, w * 0.12), yy = bottom + Math.min(h * 0.05, w * 0.08);
        x.font = st.fstyle + " " + st.weight + " " + ys.toFixed(1) + "px " + st.font; x.fillStyle = st.accent; x.textAlign = "center"; x.textBaseline = "middle";
        x.fillText(year, w / 2, yy);
        x.fillRect(w / 2 - w * 0.18, yy - ys * 0.9, w * 0.36, Math.max(1, m * 0.006));
      }
      if (fl.venue && h > 200) spaced(x, String(fl.venue).toUpperCase().slice(0, 28), w / 2, h - inset * 2 - eye * 0.9, Math.max(6, eye * 0.8), st.accent, st);
      return c;
    }
    /* landscape panels take turns: the title, the venue, a line from the film's own notes */
    var winks = (fl.winks || []).filter(function (t) { return t && t.length < 60; });
    var v = idx % 3, line, sub;
    if (v === 1 && fl.venue) { line = String(fl.venue); sub = year; }
    else if (v === 2 && winks.length) { line = winks[Math.floor(idx / 3) % winks.length]; sub = title; }
    else { line = title; sub = year; }
    if (st.upper && line !== title) line = line.toUpperCase();
    var subS = sub && ih > 60 ? Math.max(7, Math.min(ih * 0.13, iw * 0.06)) : 0;
    var fm = fit(x, st, line, iw * 0.92, ih - subS * 2.2, 3, Math.min(ih * 0.42, iw * 0.16));
    var blockH = fm.lines.length * fm.size * fm.lh + (subS ? subS * 2 : 0), cy = h / 2 - blockH / 2 + fm.lines.length * fm.size * fm.lh / 2;
    drawLines(x, fm, w / 2, cy, st.ink);
    if (subS) spaced(x, String(sub).toUpperCase().slice(0, 34), w / 2, cy + fm.lines.length * fm.size * fm.lh / 2 + subS * 1.15, subS, st.accent, st);
    return c;
  }

  function info(src) {
    var i = String(src || "").indexOf("#art:");
    if (i < 0) return null;
    var rest = src.slice(i + 5), j = rest.indexOf(":");
    return { kind: rest.slice(0, j), p: rest.slice(j + 1).split(/["')&\s]/)[0] };
  }
  function sizeOf(el, kind) {
    var w = el.clientWidth, h = el.clientHeight;
    if (w > 1 && h > 1) return [w, h, true];
    var s = el.style, aw = parseFloat(s.width) || parseFloat(el.getAttribute("width")) || 0, ah = parseFloat(s.height) || parseFloat(el.getAttribute("height")) || 0;
    if (aw && ah) return [aw, ah, false];
    return kind === "poster" ? [300, 450, false] : kind === "logo" ? [420, 140, false] : [480, 300, false];
  }
  async function paint(el) {
    var bg = el.tagName !== "IMG";
    var inf = el.__art || (el.__art = info(bg ? el.getAttribute("style") : el.getAttribute("src")));
    if (!inf) return;
    if (inf.kind === "hide") { el.style.display = "none"; return; }
    var z = sizeOf(el, inf.kind);
    if (el.__artSize && Math.abs(el.__artSize[0] - z[0]) < 3 && Math.abs(el.__artSize[1] - z[1]) < 3) return;
    var film = filmFor(inf);
    var own = inf.kind === "poster" && film && ART().posters[film.id];
    if (own && !bg) { el.__artSize = z; setSrc(el, own); return; }
    var st = styleFor(el, film);
    try { await D.fonts.load(st.fstyle + " " + st.weight + " 40px " + st.font); } catch (e) {}
    var box = el.closest(".fx-face") || el.closest(".mcard") || D.body;
    var idx = Math.max(0, Array.prototype.indexOf.call(box.querySelectorAll("img"), el));
    var url = drawPanel(inf.kind, z[0], z[1], film, st, idx).toDataURL("image/png");
    el.__artSize = z[2] ? z : null;
    if (bg) el.style.backgroundImage = 'url("' + url + '")';
    else { el.removeAttribute("srcset"); setSrc(el, url); }
  }
  var queue = new Set(), busy = false;
  function run() {
    busy = false;
    var list = Array.from(queue); queue.clear();
    list.forEach(function (el) { if (el.isConnected) paint(el); });
  }
  function want(el) { queue.add(el); if (!busy) { busy = true; requestAnimationFrame(run); } }
  var ro = W.ResizeObserver ? new ResizeObserver(function (es) { es.forEach(function (e) { if (e.target.__art) want(e.target); }); }) : null;
  function track(el) {
    if (el.__artT) { el.__art = null; el.__artSize = null; want(el); return; }
    el.__artT = 1; if (ro) ro.observe(el); want(el);
  }
  function scan(root) {
    if (root.nodeType !== 1) return;
    var check = function (el) {
      if (el.tagName === "IMG") {
        var s = el.getAttribute("src") || "";
        if (s.indexOf("#art:") > 0) track(el);
        else { var r = art(s); if (r !== null) { setSrc(el, r); if (el.hasAttribute("srcset")) el.setAttribute("srcset", el.getAttribute("srcset")); if (r.indexOf("#art:") > 0) track(el); } }
      } else if (el.tagName === "SOURCE" && el.hasAttribute("srcset")) el.setAttribute("srcset", el.getAttribute("srcset"));
      var st = el.getAttribute && el.getAttribute("style");
      if (st && /url\(/i.test(st)) { var ns = scrubCSS(st); if (ns !== st) setAttr.call(el, "style", ns); if (ns.indexOf("#art:") > 0) track(el); }
    };
    check(root);
    var all = root.querySelectorAll("img,source,[style*='url(']");
    for (var i = 0; i < all.length; i++) check(all[i]);
  }
  new MutationObserver(function (ms) {
    ms.forEach(function (m) {
      if (m.type === "childList") m.addedNodes.forEach(scan);
      else if (m.target.nodeType === 1) {
        var v = m.target.getAttribute(m.attributeName) || "";
        if (v.indexOf("#art:") > 0) track(m.target);
      }
    });
  }).observe(D.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ["src", "style"] });
  REEL.repaint = function (root) { scan(root || D.body); };

  /* ---------- links that must reach the website, and the credits line ---------- */
  function siteLinks() {
    D.querySelectorAll('a[href^="/"]:not([href^="//"])').forEach(function (a) {
      a.href = SITE + a.getAttribute("href"); a.target = "_blank"; a.rel = "noopener";
    });
    var form = D.getElementById("reqForm");
    if (form) form.setAttribute("action", SITE + "/");
    D.querySelectorAll("p.credit").forEach(function (p) {
      var h = p.innerHTML;
      h = h.replace(/Film posters come from (<a[^>]*>TMDB<\/a>)\./, "Film details (classifications, genres, where to watch and trailer links) come from $1. No film posters or photos are used in the app.");
      h = h.replace(/Shopfront photo by (.*?), signs changed\./, "Shopfront photo by $1, signs and window flyers changed.");
      if (h !== p.innerHTML) p.innerHTML = h;
    });
  }
  if (D.readyState === "loading") D.addEventListener("DOMContentLoaded", function () { siteLinks(); scan(D.body); });
  else { siteLinks(); scan(D.body); }
})();
