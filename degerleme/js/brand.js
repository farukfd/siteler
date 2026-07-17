/* ===================================================================
   brand.js — WHITE-LABEL marka/logo motoru (Meridyen Değerleme · TÜM sayfalar)
   Kaynak: deg_admin (localStorage) ⊕ window.DEG_PUBLISHED (yayınlanan site-config)
     • brandName    : marka adı (kısa, ör. "Meridyen" → "Didem")  → tüm "Meridyen" tokenlarını değiştirir
                      ("Meridyen Değerleme"→"Didem Değerleme", "Meridyen Gayrimenkul Değerleme A.Ş."→"Didem …")
     • brandInitial : logo/favicon harfi override (verilmezse brandName ilk harfi)
     • favicon      : yüklenen ikon (data-URI/URL) — yoksa tema renginden ÜRETİLİR
   Bu dosya: favicon (tema-duyarlı) + logo harfi (.mk) + görünür METİN sweep +
   JSON-LD/meta sweep + MutationObserver. Sayfalar app.js yüklemez; sweep BURADA.
   =================================================================== */
(function () {
  var LS_ADMIN = "deg_admin";
  var ORIG_SHORT = "Meridyen";           // capital-M brand token (coğrafi 'meridyen' küçük — güvenli)
  var DEF_NAME = "Meridyen", DEF_INITIAL = "M";

  function upper(s) { try { return (s || "").toLocaleUpperCase("tr"); } catch (e) { return (s || "").toUpperCase(); } }
  function ready(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }
  function abs(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }
  function cfg() {
    var loc = {}; try { loc = JSON.parse(localStorage.getItem(LS_ADMIN) || "{}") || {}; } catch (e) {}
    var pub = (window.DEG_PUBLISHED && typeof window.DEG_PUBLISHED === "object") ? window.DEG_PUBLISHED : {};
    return Object.assign({}, pub, loc);
  }
  function brandName() { var c = cfg(); var n = (c.brandName != null && ("" + c.brandName).trim()) ? ("" + c.brandName).trim() : DEF_NAME; return n; }
  function isCustom() { return brandName() !== DEF_NAME; }
  function initialOf() { var c = cfg(); if (c.brandInitial && ("" + c.brandInitial).trim()) return upper(("" + c.brandInitial).trim().charAt(0)); return isCustom() ? (upper(brandName().charAt(0)) || DEF_INITIAL) : DEF_INITIAL; }

  /* --- tema-duyarlı favicon (mevcut .mk stiliyle: accent→navy gradient + beyaz harf) --- */
  function themeColors() {
    var a = "#7f1d34", n = "#0b1220";
    try { var cs = getComputedStyle(document.documentElement); a = (cs.getPropertyValue("--accent") || "").trim() || a; n = (cs.getPropertyValue("--navy") || "").trim() || n; } catch (e) {}
    return { a: a, n: n };
  }
  function genFavicon(letter) {
    var L = upper((letter || DEF_INITIAL).toString().trim().charAt(0)) || "M", c = themeColors();
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + c.a + '"/><stop offset="1" stop-color="' + c.n + '"/></linearGradient></defs>' +
      '<rect width="64" height="64" rx="14" fill="url(#g)"/>' +
      '<text x="32" y="44" font-family="Arial,Helvetica,sans-serif" font-size="34" font-weight="800" fill="#ffffff" text-anchor="middle">' + L + '</text></svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }
  function setLink(rel, href, type) {
    var l = document.querySelector('link[rel="' + rel + '"]');
    if (!l) { l = document.createElement("link"); l.setAttribute("rel", rel); document.head.appendChild(l); }
    l.setAttribute("href", href); if (type) l.setAttribute("type", type); else l.removeAttribute("type");
  }
  function applyFavicon(url) {
    var isSvg = /\.svg(\?|$)/i.test(url) || /^data:image\/svg/i.test(url);
    setLink("icon", url, isSvg ? "image/svg+xml" : ""); setLink("apple-touch-icon", url);
  }

  /* --- görünür METİN + JSON-LD + meta sweep : "Meridyen" → brandName --- */
  function repl(s, nm) { if (!s || typeof s !== "string" || s.indexOf("Meridyen") < 0) return s; return s.split(ORIG_SHORT).join(nm); }
  var _base = (window.__degWlBase = window.__degWlBase || new WeakMap());
  function sweep(nm) {
    var skip = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1, INPUT: 1 };
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (skip[n.parentNode && n.parentNode.nodeName]) return NodeFilter.FILTER_REJECT;
        return (_base.has(n) || (n.nodeValue && n.nodeValue.indexOf("Meridyen") >= 0)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var nodes = [], n; while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (t) { var base = _base.has(t) ? _base.get(t) : (_base.set(t, t.nodeValue), t.nodeValue); var out = repl(base, nm); if (t.nodeValue !== out) t.nodeValue = out; });
    var attrs = ["title", "alt", "placeholder", "aria-label"];
    document.body.querySelectorAll("[title],[alt],[placeholder],[aria-label]").forEach(function (el) {
      var c = el.__degWlAttr; attrs.forEach(function (a) {
        var cur = el.getAttribute && el.getAttribute(a); if (cur == null) return;
        var cached = c && (a in c); if (!cached && cur.indexOf("Meridyen") < 0) return;
        if (!c) c = el.__degWlAttr = {}; var base = cached ? c[a] : (c[a] = cur); var out = repl(base, nm); if (cur !== out) el.setAttribute(a, out);
      });
    });
  }
  function sweepHead(nm) {
    try {
      if (document.title.indexOf("Meridyen") >= 0) document.title = repl(document.title, nm);
      document.querySelectorAll("meta[content]").forEach(function (m) { var v = m.getAttribute("content"); if (v && v.indexOf("Meridyen") >= 0) m.setAttribute("content", repl(v, nm)); });
      document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) { var v = s.textContent; if (v && v.indexOf("Meridyen") >= 0) s.textContent = repl(v, nm); });
    } catch (e) {}
  }
  /* --- logo harfi (.mk) — tek-harf mark'ları reseller harfine (yüklü logo görseli hariç) --- */
  function applyMarks(ini) {
    var all = document.querySelectorAll(".mk");
    for (var i = 0; i < all.length; i++) {
      var m = all[i]; if (m.querySelector && m.querySelector("img")) continue;   // logo görseli varsa dokunma
      var t = (m.textContent || "").trim(); if (t.length <= 1 && t !== ini) m.textContent = ini;
    }
  }

  var _obs = null, _to = null;
  function apply() {
    var ini = initialOf(), nm = brandName(), custom = isCustom() || (function () { var c = cfg(); return !!(c.brandInitial && ("" + c.brandInitial).trim()); })();
    var c = cfg();
    // favicon: yüklenen > üretilen (custom) > üretilen default 'M' (site favicon'suzdu → her hâlde ekle)
    applyFavicon(c.favicon || genFavicon(ini));
    var run = function () {
      if (_obs) _obs.disconnect();
      applyMarks(ini);
      if (custom) { sweep(nm); sweepHead(nm); }
      if (_obs) try { _obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    };
    ready(run);
    if (custom) {
      window.addEventListener("load", run); setTimeout(run, 500); setTimeout(run, 1500);
      if ("MutationObserver" in window && !_obs) {
        _obs = new MutationObserver(function () { clearTimeout(_to); _to = setTimeout(run, 150); });
        ready(function () { try { _obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {} });
      }
    }
  }
  window.degBrandRefresh = apply;   // admin marka adı değişince canlı yenile
  apply();
})();

/* ÇOK-ALAN-ADI (500-5000 domain) — canonical + OG MEVCUT domaine göre ayarlanır.
   Aynı statik paket her domainde; her domain KENDİ canonical'ını Google'a bildirir
   (yoksa Google hepsini tek domaine birleştirir → SEO ölür). Sunucu ayarı GEREKMEZ.
   ProX API tabanı (varsa) DEĞİŞMEZ — merkezî, X-Tenant-Id ile ayrışır. */
(function () {
  function run() {
    try {
      var clean = location.origin + location.pathname;
      var can = document.querySelector('link[rel="canonical"]');
      if (!can) { can = document.createElement("link"); can.rel = "canonical"; document.head.appendChild(can); }
      var oldOrigin=null;try{if(can.href)oldOrigin=new URL(can.href).origin;}catch(e){}
      can.href = clean;
      var ogu = document.querySelector('meta[property="og:url"]'); if (ogu) ogu.content = clean;
      ["meta[property=\"og:image\"]", "meta[name=\"twitter:image\"]"].forEach(function (sel) {
        var m = document.querySelector(sel); if (!m || !m.content) return;
        try { m.content = new URL(m.content.split("/").pop(), location.href).href; } catch (e) {}
      });
      if(oldOrigin&&oldOrigin!==location.origin){try{document.querySelectorAll('script[type="application/ld+json"]').forEach(function(s){if(s.textContent&&s.textContent.indexOf(oldOrigin)>=0)s.textContent=s.textContent.split(oldOrigin).join(location.origin);});}catch(e){}}
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();
