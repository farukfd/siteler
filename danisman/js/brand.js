/* ===================================================================
   brand.js — WHITE-LABEL marka motoru (TÜM sayfalarda: SPA + statik)
   Yönetim: admin panelinden. Depo: localStorage["dn_brand"] =
     { name, initial, favicon, googleLogo }   (hepsi opsiyonel)
   • name       : marka adı (ör. "Didem Keskin") — tüm "Selin Meridyen" alanlarını değiştirir
   • initial    : logo/favicon harfi (verilmezse adın ilk harfi)
   • favicon    : yüklenen tarayıcı ikonu (data-URI/URL) — yoksa harften ÜRETİLİR
   • googleLogo : Google arama (Organization) logosu — yoksa favicon kullanılır
   Bağımsız (app.js gerektirmez) — her sayfanın <head>'inde yüklenir.
   =================================================================== */
(function () {
  var KEY = "dn_brand";
  var DEFAULT_NAME = "Selin Meridyen";
  var DEFAULT_INITIAL = "M";            // markanın yerleşik kimliği (Meridyen)
  var DEFAULT_FAVICON = "favicon.svg";
  var ORG_TYPE = "RealEstateAgent";

  function get() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function abs(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }
  function ready(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }

  function isCustom(b) { return !!(b.name && b.name.trim() && b.name.trim() !== DEFAULT_NAME); }
  function nameOf(b) { return isCustom(b) ? b.name.trim() : DEFAULT_NAME; }
  function initialOf(b) {
    if (b.initial && b.initial.toString().trim()) return b.initial.toString().trim().charAt(0).toUpperCase();
    return isCustom(b) ? b.name.trim().charAt(0).toUpperCase() : DEFAULT_INITIAL;
  }

  /* --- harften SVG favicon üret (zümrüt + altın · favicon.svg ile aynı stil) --- */
  function genFavicon(letter) {
    var L = (letter || DEFAULT_INITIAL).toString().trim().charAt(0).toUpperCase() || "M";
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e5e3e"/><stop offset="1" stop-color="#0a3527"/></linearGradient></defs>' +
      '<rect width="64" height="64" rx="15" fill="url(#g)"/>' +
      '<text x="32" y="45" font-family="Georgia,serif" font-size="38" font-weight="800" fill="#dcc389" text-anchor="middle">' + L + '</text></svg>';
    return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
  }

  function setLink(rel, href, type) {
    var l = document.querySelector('link[rel="' + rel + '"]');
    if (!l) { l = document.createElement("link"); l.setAttribute("rel", rel); document.head.appendChild(l); }
    l.setAttribute("href", href);
    if (type) l.setAttribute("type", type); else l.removeAttribute("type");
  }
  function applyFavicon(url) {
    var isSvg = /\.svg(\?|$)/i.test(url) || /^data:image\/svg/i.test(url);
    setLink("icon", url, isSvg ? "image/svg+xml" : "");
    setLink("apple-touch-icon", url);
  }
  function applyOrg(name, logo) {
    var id = "dn-org-ld", s = document.getElementById(id);
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = id; document.head.appendChild(s); }
    var homeUrl = location.origin + location.pathname.replace(/[^/]*$/, "") + "index.html";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": ORG_TYPE, "name": name,
      "url": homeUrl, "logo": abs(logo), "image": abs(logo)
    });
  }

  /* --- marka ADI'nı tüm görünür alanlara yay (yalnız white-label ad girildiyse) --- */
  function replaceTextNodes(root, from, to) {
    var skip = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, NOSCRIPT: 1, CODE: 1, INPUT: 1 };
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (skip[n.parentNode && n.parentNode.nodeName]) return NodeFilter.FILTER_REJECT;
        return (n.nodeValue && n.nodeValue.indexOf(from) >= 0) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    var nodes = [], n;
    while ((n = w.nextNode())) nodes.push(n);
    nodes.forEach(function (nd) { nd.nodeValue = nd.nodeValue.split(from).join(to); });
  }
  function applyMarks(ini) {
    // #brandMark (nav) + TÜM tek-harf .mark'lar (footer/overlay) — görsel logo hariç
    var mk = document.getElementById("brandMark"); if (mk && !mk.querySelector("img")) mk.textContent = ini;
    var all = document.querySelectorAll(".mark");
    for (var i = 0; i < all.length; i++) {
      var m = all[i]; if (m.querySelector && m.querySelector("img")) continue;
      var t = (m.textContent || "").trim(); if (t.length <= 1 && t !== ini) m.textContent = ini;
    }
  }
  function applyNameDom(b) {
    var custom = isCustom(b), nm = nameOf(b), ini = initialOf(b);
    applyMarks(ini);
    if (!custom) return;
    var bn = document.getElementById("brandName"); if (bn) bn.textContent = nm;
    try { document.title = document.title.split(DEFAULT_NAME).join(nm); } catch (e) {}
    ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[property="og:site_name"]', 'meta[name="author"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]'].forEach(function (sel) {
      var m = document.querySelector(sel); if (m && m.content && m.content.indexOf(DEFAULT_NAME) >= 0) m.content = m.content.split(DEFAULT_NAME).join(nm);
    });
    if (document.body) replaceTextNodes(document.body, DEFAULT_NAME, nm);
  }

  var _obs = null, _to = null;
  function apply() {
    var b = get();
    // favicon + Organization: HEMEN (head)
    var fav = b.favicon || ((isCustom(b) || b.initial) ? genFavicon(initialOf(b)) : DEFAULT_FAVICON);
    applyFavicon(fav);
    applyOrg(nameOf(b), b.googleLogo || fav);
    // ad + logo harfi + görünür metin: DOM hazır olunca (idempotent — bitince no-op)
    var run = function () {
      if (_obs) _obs.disconnect();
      applyNameDom(b);
      if (_obs) try { _obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {}
    };
    ready(run);
    // SPA/app.js geç render'ları (footer, overlay, kartlar) — tekrar + MutationObserver ile
    // KUSURSUZ yakala (observer disconnect/reconnect ile döngü yok; convergence'ta susar)
    if (isCustom(b) || b.initial) {
      window.addEventListener("load", run);
      setTimeout(run, 500); setTimeout(run, 1500);
      if ("MutationObserver" in window && !_obs) {
        _obs = new MutationObserver(function () { clearTimeout(_to); _to = setTimeout(run, 150); });
        ready(function () { try { _obs.observe(document.body, { childList: true, subtree: true }); } catch (e) {} });
      }
    }
  }

  /* ---- ADMİN API ---- */
  window.dnSetBrand = function (o) {
    var b = get();
    ["name", "initial", "favicon", "googleLogo"].forEach(function (k) { if (o && k in o) b[k] = o[k]; });
    try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) { if (window.toast) toast("Kaydedilemedi (depolama kotası)."); }
    apply(); return b;
  };
  window.dnGetBrand = get;
  window.dnBrandUpload = function (input, which) {
    var f = input && input.files && input.files[0]; if (!f) return;
    if (f.size > 512 * 1024) { if (window.toast) toast("Görsel çok büyük (max 512 KB)."); return; }
    var r = new FileReader();
    r.onload = function () { var o = {}; o[which] = r.result; window.dnSetBrand(o); if (window.toast) toast(which === "googleLogo" ? "Google arama logosu güncellendi." : "Tarayıcı logosu (favicon) güncellendi."); };
    r.readAsDataURL(f);
  };
  window.dnBrandReset = function (which) {
    var b = get(); if (which) delete b[which]; else b = {};
    try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) {}
    apply(); if (window.toast) toast("Sıfırlandı. Sayfayı yenileyin (metinler için).");
  };

  apply();
})();
