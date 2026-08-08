/* ===================================================================
   brand.js — WHITE-LABEL marka/logo motoru (insaat · TÜM sayfalar: SPA + statik)
   Kaynak: localStorage["meridyen_pub_v1"].BRAND = { name, name2, favicon, initial? }
     • name   : marka ilk parçası (ör. "Meridyen" → "Didem")
     • name2  : marka ikinci parçası (ör. " Yapı")   → tam ad = name + name2
     • favicon: yüklenen ikon (data-URI/URL) — yoksa harften ÜRETİLİR (turuncu 'M/D')
     • initial: logo/favicon harfi override (verilmezse name'in ilk harfi)
   Bu dosya: favicon + logo harfi (.mark) + Organization + görünür METİN sweep'ini
   (statik sayfalarda app-core.js yok → sweep'i BURASI yapar) + MutationObserver
   ile SPA'nın geç render'larını yakalar. Bağımsız (app-core gerektirmez).
   =================================================================== */
(function () {
  var STORE = "meridyen_pub_v1";
  var ORIG_FULL = "Meridyen Yapı", ORIG_SHORT = "Meridyen";
  var DEF_NAME = "Meridyen", DEF_NAME2 = " Yapı", DEF_INITIAL = "M";
  var ORG_TYPE = "GeneralContractor";        // inşaat/müteahhitlik
  var ACCENT = "#ff7a2f", INK = "#1a1205";   // insaat teması (turuncu + koyu)

  function pub() { try { return JSON.parse(localStorage.getItem(STORE) || "{}") || {}; } catch (e) { return {}; } }
  function brand() { var p = pub(); return (p.BRAND && typeof p.BRAND === "object") ? p.BRAND : {}; }
  function abs(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }
  function ready(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }
  function upper(s) { try { return (s || "").toLocaleUpperCase("tr"); } catch (e) { return (s || "").toUpperCase(); } }

  function nameOf(b) { var n = (b.name != null && ("" + b.name).trim()) ? ("" + b.name).trim() : DEF_NAME; return n; }
  function name2Of(b) { return (b.name2 != null) ? ("" + b.name2) : DEF_NAME2; }
  function fullOf(b) { return nameOf(b) + name2Of(b); }
  function isCustom(b) { return fullOf(b).trim() !== ORIG_FULL; }
  function initialOf(b) {
    if (b.initial && ("" + b.initial).trim()) return upper(("" + b.initial).trim().charAt(0));
    return isCustom(b) ? (upper(nameOf(b).charAt(0)) || DEF_INITIAL) : DEF_INITIAL;
  }

  /* --- harften SVG favicon üret (mevcut inline ikonla aynı stil: turuncu kare + koyu harf) --- */
  function genFavicon(letter) {
    var L = upper((letter || DEF_INITIAL).toString().trim().charAt(0)) || "M";
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">' +
      '<rect width="32" height="32" rx="7" fill="' + ACCENT + '"/>' +
      '<text x="16" y="23" font-family="sans-serif" font-size="20" font-weight="800" fill="' + INK + '" text-anchor="middle">' + L + '</text></svg>';
    return "data:image/svg+xml," + encodeURIComponent(svg);
  }

  function setLink(rel, href, type) {
    var l = document.querySelector('link[rel="' + rel + '"]');
    if (!l) { l = document.createElement("link"); l.setAttribute("rel", rel); document.head.appendChild(l); }
    l.setAttribute("href", href);
    if (type) l.setAttribute("type", type); else l.removeAttribute("type");
  }
  function curIcon() { var l = document.querySelector('link[rel="icon"]'); return (l && l.getAttribute("href")) || ""; }
  function applyFavicon(url) {
    var isSvg = /\.svg(\?|$)/i.test(url) || /^data:image\/svg/i.test(url);
    setLink("icon", url, isSvg ? "image/svg+xml" : "");
    setLink("apple-touch-icon", url);
  }
  function applyOrg(name, logo) {
    var id = "ins-org-ld", s = document.getElementById(id);
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = id; document.head.appendChild(s); }
    var homeUrl = location.origin + location.pathname.replace(/[^/]*$/, "") + "index.html";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": ORG_TYPE, "name": name,
      "url": homeUrl, "logo": abs(logo || ""), "image": abs(logo || "")
    });
  }

  /* --- görünür METİN sweep (statik + SPA) : "Meridyen Yapı"→tam, "Meridyen"→name --- */
  function repl(s, name, full) {
    if (!s || typeof s !== "string" || s.indexOf("Meridyen") < 0) return s;
    return s.split(ORIG_FULL).join(full).split(ORIG_SHORT).join(name);   // önce tam, sonra kısa
  }
  var _base = (window.__insWlBase = window.__insWlBase || new WeakMap());
  function sweep(name, full) {
    var skip = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1, INPUT: 1 };
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (skip[n.parentNode && n.parentNode.nodeName]) return NodeFilter.FILTER_REJECT;
        return (_base.has(n) || (n.nodeValue && n.nodeValue.indexOf("Meridyen") >= 0)) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var nodes = [], n; while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (t) { var base = _base.has(t) ? _base.get(t) : (_base.set(t, t.nodeValue), t.nodeValue); var out = repl(base, name, full); if (t.nodeValue !== out) t.nodeValue = out; });
    var attrs = ["title", "alt", "placeholder", "aria-label"];
    document.body.querySelectorAll("[title],[alt],[placeholder],[aria-label]").forEach(function (el) {
      var c = el.__insWlAttr; attrs.forEach(function (a) {
        var cur = el.getAttribute && el.getAttribute(a); if (cur == null) return;
        var cached = c && (a in c); if (!cached && cur.indexOf("Meridyen") < 0) return;
        if (!c) c = el.__insWlAttr = {}; var base = cached ? c[a] : (c[a] = cur); var out = repl(base, name, full);
        if (cur !== out) el.setAttribute(a, out);
      });
    });
  }
  function sweepHead(name, full) {
    try {
      if (document.title.indexOf("Meridyen") >= 0) document.title = repl(document.title, name, full);
      document.querySelectorAll("meta[content]").forEach(function (m) { var v = m.getAttribute("content"); if (v && v.indexOf("Meridyen") >= 0) m.setAttribute("content", repl(v, name, full)); });
      // JSON-LD yapısal veri (SEO markası) — kendi #ins-org-ld hariç sayfa şemalarını da yerelleştir
      document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) { if (s.id === "ins-org-ld") return; var v = s.textContent; if (v && v.indexOf("Meridyen") >= 0) s.textContent = repl(v, name, full); });
    } catch (e) {}
  }
  /* --- logo harfi (.mark) — tek-harf mark'ları reseller harfine çevir (görsel logo hariç) --- */
  function applyMarks(ini) {
    var all = document.querySelectorAll(".mark");
    for (var i = 0; i < all.length; i++) {
      var m = all[i]; if (m.querySelector && m.querySelector("img")) continue;
      var t = (m.textContent || "").trim(); if (t.length <= 1 && t !== ini) m.textContent = ini;
    }
  }

  /* --- TENANT TEMA (accent + font) — pub.THEME'den; statik/yasal sayfalarda app-core.js yok, sweep gibi BURASI uygular.
       Wipe-proof <style id="tenant-theme"> (base css'i kaskadta geçer) + Google Fonts. --- */
  function applyThemePub() {
    try {
      var p = pub(), th = (p.THEME && typeof p.THEME === "object") ? p.THEME : {};
      var accent = th.accent, font = th.font;
      if (accent && ("" + accent).charAt(0) === "#") {
        var lg = function (hex, amt) { try { var n = parseInt(hex.slice(1), 16); var r = Math.min(255, (n >> 16) + amt), g = Math.min(255, ((n >> 8) & 255) + amt), bb = Math.min(255, (n & 255) + amt); return "#" + ((1 << 24) + (r << 16) + (g << 8) + bb).toString(16).slice(1); } catch (e) { return hex; } };
        var lum = function (hex) { try { var n = parseInt(hex.slice(1), 16); return .2126 * ((n >> 16) / 255) + .7152 * (((n >> 8) & 255) / 255) + .0722 * ((n & 255) / 255); } catch (e) { return 1; } };
        var on = lum(accent) > .5 ? "#10151f" : "#ffffff";
        var css = ":root{--accent:" + accent + ";--accent-2:" + lg(accent, 20) + ";--on-accent:" + on + ";}";
        var st = document.getElementById("tenant-theme");
        if (!st) { st = document.createElement("style"); st.id = "tenant-theme"; }
        st.textContent = css; (document.head || document.documentElement).appendChild(st);
        /* inline root — sayfanın kendi geç-gelen :root{--accent} stillerini kaskadta YENER (app-core.js yok) */
        var rs = document.documentElement.style; rs.setProperty("--accent", accent); rs.setProperty("--accent-2", lg(accent, 20)); rs.setProperty("--on-accent", on);
      }
      if (font) {
        var FONTS = { "Inter": "Inter:wght@400;500;600;700;800", "Poppins": "Poppins:wght@400;500;600;700", "Manrope": "Manrope:wght@400;500;600;700;800", "Sora": "Sora:wght@400;500;600;700", "DM Sans": "DM+Sans:wght@400;500;600;700", "Nunito": "Nunito:wght@400;600;700;800", "Montserrat": "Montserrat:wght@400;500;600;700", "Figtree": "Figtree:wght@400;500;600;700", "Playfair Display": "Playfair+Display:wght@500;600;700" };
        if (FONTS[font]) {
          var lid = "brand-font-" + font.replace(/\s+/g, "");
          if (!document.getElementById(lid)) { var l = document.createElement("link"); l.rel = "stylesheet"; l.id = lid; l.href = "https://fonts.googleapis.com/css2?family=" + FONTS[font] + "&display=swap"; (document.head || document.documentElement).appendChild(l); }
          document.documentElement.style.setProperty("--brand-font", "'" + font + "'");
          ready(function () { if (document.body) document.body.style.fontFamily = "'" + font + "', system-ui, -apple-system, sans-serif"; });
        }
      }
    } catch (e) {}
  }

  var _obs = null, _to = null;
  function apply() {
    applyThemePub();
    var b = brand();
    var ini = initialOf(b), nm = nameOf(b), full = fullOf(b), custom = isCustom(b) || !!(b.initial && ("" + b.initial).trim());
    // favicon + Organization: HEMEN (head) — favicon yalnız custom'da (yoksa mevcut inline 'M' kalır)
    var fav = b.favicon || (custom ? genFavicon(ini) : "");
    if (fav) applyFavicon(fav);
    applyOrg(full, b.googleLogo || fav || curIcon());
    // logo harfi + görünür metin: DOM hazır + geç render'lar (SPA doc/proje) için tekrar + observer
    var run = function () {
      if (_obs) _obs.disconnect();
      applyMarks(ini);
      if (custom) { sweep(nm, full); sweepHead(nm, full); }
      if (_obs) try { _obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    };
    ready(run);
    if (custom) {
      window.addEventListener("load", run);
      setTimeout(run, 500); setTimeout(run, 1500);
      if ("MutationObserver" in window && !_obs) {
        _obs = new MutationObserver(function () { clearTimeout(_to); _to = setTimeout(run, 150); });
        ready(function () { try { _obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {} });
      }
    }
  }
  window.insBrandRefresh = apply;   // admin BRAND değişince (applyBrand) canlı yenile
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
