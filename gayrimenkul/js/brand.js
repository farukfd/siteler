/* ===================================================================
   brand.js — WHITE-LABEL marka logosu motoru (TÜM sayfalarda: SPA + statik)
   Yönetim: admin panelinden (Firma künye "Marka Adı" + logo yüklemeleri).
   • Ad kaynağı: localStorage["meridyenGM_v1"].FIRMA.name  (app.js/wl.js ile AYNI
     tek doğruluk kaynağı) → marka adı değişince favicon+logo harfi OTOMATİK döner.
   • Override deposu: localStorage["gm_brand"] = { name, initial, favicon, googleLogo }
       name       : marka adı override (normalde FIRMA.name kullanılır)
       initial    : logo/favicon harfi (verilmezse adın ilk harfi)
       favicon    : yüklenen tarayıcı ikonu (data-URI/URL) — yoksa harften ÜRETİLİR
       googleLogo : Google arama (Organization) logosu — yoksa favicon kullanılır
   Metin yayılımını (Meridyen Gayrimenkul → reseller adı) app.js (brandSweep) +
   wl.js (sweep) yapar; bu dosya LOGO HARFİ + favicon + Organization ile ilgilenir.
   Bağımsız (app.js gerektirmez) — her sayfanın <head>'inde yüklenir.
   =================================================================== */
(function () {
  var KEY = "gm_brand";
  var STORE = "meridyenGM_v1";          // app.js/wl.js ana deposu (FIRMA.name)
  var DEFAULT_NAME = "Meridyen Gayrimenkul";
  var DEFAULT_INITIAL = "M";            // markanın yerleşik kimliği (Meridyen)
  var DEFAULT_FAVICON = "favicon.svg";
  var ORG_TYPE = "RealEstateAgent";

  function get() { try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; } }
  function abs(u) { try { return new URL(u, location.href).href; } catch (e) { return u; } }
  function ready(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }
  function upper(s) { try { return (s || "").toLocaleUpperCase("tr"); } catch (e) { return (s || "").toUpperCase(); } }

  /* FIRMA.name — app.js/wl.js ile aynı depodan (tek doğruluk kaynağı) */
  function firmaName() { try { var d = JSON.parse(localStorage.getItem(STORE) || "{}"); return ((d.FIRMA && d.FIRMA.name) || "").trim(); } catch (e) { return ""; } }

  function nameOf(b) { var n = (b.name && b.name.trim()) || firmaName(); return n || DEFAULT_NAME; }
  function isCustom(b) { return nameOf(b) !== DEFAULT_NAME; }
  function initialOf(b) {
    if (b.initial && b.initial.toString().trim()) return upper(b.initial.toString().trim().charAt(0));
    var nm = nameOf(b);
    // brandShort ile hizala: ilk KELİMENİN ilk harfi ("Didem Keskin" → "D")
    return nm !== DEFAULT_NAME ? (upper(nm.split(/\s+/)[0].charAt(0)) || DEFAULT_INITIAL) : DEFAULT_INITIAL;
  }

  /* --- harften SVG favicon üret (lacivert + yeşil nokta · favicon.svg ile aynı stil) --- */
  function genFavicon(letter) {
    var L = upper((letter || DEFAULT_INITIAL).toString().trim().charAt(0)) || "M";
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">' +
      '<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e40af"/><stop offset="1" stop-color="#0f1f3d"/></linearGradient></defs>' +
      '<rect width="64" height="64" rx="15" fill="url(#g)"/>' +
      '<text x="31" y="45" font-family="Poppins,Segoe UI,sans-serif" font-size="36" font-weight="800" fill="#ffffff" text-anchor="middle">' + L + '</text>' +
      '<circle cx="49" cy="46" r="6" fill="#1e7e3a"/></svg>';
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
    var id = "gm-org-ld", s = document.getElementById(id);
    if (!s) { s = document.createElement("script"); s.type = "application/ld+json"; s.id = id; document.head.appendChild(s); }
    var homeUrl = location.origin + location.pathname.replace(/[^/]*$/, "") + "index.html";
    s.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": ORG_TYPE, "name": name,
      "url": homeUrl, "logo": abs(logo), "image": abs(logo)
    });
  }

  /* --- logo harfi (.mark) — tek-harf mark'ları reseller harfine çevir --- */
  /* wl.js metin sweep'i lone "M"'e dokunmaz; app.js SPA'da .logo .mark yapar.
     Burada TÜM tek-harf .mark'ları (statik sayfalar dahil) hizalarız (idempotent). */
  function applyMark(ini) {
    var marks = document.querySelectorAll(".mark");
    for (var i = 0; i < marks.length; i++) {
      var m = marks[i];
      if (m.querySelector && m.querySelector("img")) continue;      // görsel logo — dokunma
      var t = (m.textContent || "").trim();
      if (t.length <= 1 && t !== ini) m.textContent = ini;          // yalnız tek-harf mark
    }
  }

  function apply() {
    var b = get();
    var ini = initialOf(b);
    var custom = isCustom(b) || !!(b.initial && b.initial.toString().trim());
    // favicon + Organization: HEMEN (head)
    var fav = b.favicon || (custom ? genFavicon(ini) : DEFAULT_FAVICON);
    applyFavicon(fav);
    applyOrg(nameOf(b), b.googleLogo || fav);
    // logo harfi: DOM hazır olunca + SPA/MutationObserver geç render'larını yakala
    var run = function () { applyMark(ini); };
    ready(run);
    if (custom) { window.addEventListener("load", run); setTimeout(run, 500); setTimeout(run, 1500); }
  }

  /* ---- ADMİN API ---- */
  window.gmSetBrand = function (o) {
    var b = get();
    ["name", "initial", "favicon", "googleLogo"].forEach(function (k) { if (o && k in o) b[k] = o[k]; });
    try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) { if (window.toast) toast("Kaydedilemedi (depolama kotası)."); }
    apply(); return b;
  };
  window.gmGetBrand = get;
  window.gmRefreshBrand = apply;        // admin FIRMA.name kaydettiğinde canlı yenile
  window.gmBrandUpload = function (input, which) {
    var f = input && input.files && input.files[0]; if (!f) return;
    if (f.size > 512 * 1024) { if (window.toast) toast("Görsel çok büyük (max 512 KB). PNG/SVG önerilir."); return; }
    var r = new FileReader();
    r.onload = function () { var o = {}; o[which] = r.result; window.gmSetBrand(o); if (window.toast) toast(which === "googleLogo" ? "Google arama logosu güncellendi." : "Tarayıcı logosu (favicon) güncellendi."); };
    r.readAsDataURL(f);
  };
  window.gmBrandReset = function (which) {
    var b = get(); if (which) delete b[which]; else b = {};
    try { localStorage.setItem(KEY, JSON.stringify(b)); } catch (e) {}
    apply(); if (window.toast) toast("Varsayılan logoya dönüldü.");
  };

  apply();
})();
