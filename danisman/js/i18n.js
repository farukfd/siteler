/* danisman/ i18n motoru — 5 dil: TR (varsayılan) · EN · RU · ZH (简体) · AR (RTL)
   - Dil: ?lang= URL param otoriter > localStorage dn_lang > tr
   - Post-render birebir-eşleşme sözlüğü (window.__DN_I18N): text node + attr + title/meta
   - MutationObserver + gecikmeli geçişler (SPA/dinamik içerik)
   - Switcher: footer .dn-lang (content.js tek kaynak) → setLang navigasyon
   - RTL: <html dir=rtl> (ar); ProX wordmark ters dönmez (.fprox / .prox izole)
   file://+http uyumlu, bağımlılık yok. */
(function () {
  "use strict";
  var LANGS = ["tr", "en", "ru", "zh", "ar"];
  var KEY = "dn_lang";
  var RTL = { ar: true };
  var LOCALE = { tr: "tr_TR", en: "en_US", ru: "ru_RU", zh: "zh_CN", ar: "ar_AR" };
  var HREFLANG = { tr: "tr", en: "en", ru: "ru", zh: "zh-Hans", ar: "ar" };
  var LABEL = { tr: "TR", en: "EN", ru: "RU", zh: "中文", ar: "العربية" };

  var _lang = "tr";
  try {
    var q = (new URLSearchParams(location.search)).get("lang");
    if (LANGS.indexOf(q) >= 0) { _lang = q; localStorage.setItem(KEY, q); }
    else { var sl = localStorage.getItem(KEY); if (LANGS.indexOf(sl) >= 0) _lang = sl; }
  } catch (e) {}

  /* ortak (nav+footer, her sayfada) + sayfa-özel sözlük birleşir */
  var DICT = {};
  (function () {
    var srcs = [window.__DN_I18N_COMMON, window.__DN_I18N];
    for (var i = 0; i < srcs.length; i++) {
      var s = srcs[i]; if (!s || typeof s !== "object") continue;
      for (var k in s) if (Object.prototype.hasOwnProperty.call(s, k)) DICT[k] = s[k];
    }
  })();

  function norm(s) { return String(s == null ? "" : s).replace(/\s+/g, " ").trim(); }
  function t(s) {
    if (_lang === "tr") return s;
    var e = DICT[s]; if (e && e[_lang]) return e[_lang];
    var n = norm(s); if (n !== s) { e = DICT[n]; if (e && e[_lang]) return e[_lang]; }
    return s;
  }

  /* ---- <html lang/dir> ---- */
  function applyLangAttr() {
    var h = document.documentElement;
    h.setAttribute("lang", _lang);
    if (RTL[_lang]) h.setAttribute("dir", "rtl"); else h.setAttribute("dir", "ltr");
  }

  /* ---- çeviri: text node + attr + title/meta ---- */
  function skip(node) {
    var p = node.parentNode; if (!p) return true;
    var nm = p.nodeName; if (nm === "SCRIPT" || nm === "STYLE" || nm === "NOSCRIPT") return true;
    if (p.closest && p.closest(".dn-lang,[data-noi18n],.fprox,.prox-logo,.prox-x,.prox-mark,#mast-time")) return true;
    return false;
  }
  var ATTRS = ["aria-label", "title", "alt", "placeholder"];
  function apply(root) {
    if (_lang === "tr" || !root) return;
    try {
      var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null), n;
      while ((n = w.nextNode())) {
        if (skip(n)) continue;
        var raw = n.nodeValue; if (!raw || !/\S/.test(raw)) continue;
        var key = norm(raw); if (key.length < 1) continue;
        var tr = t(key);
        if (tr !== key) n.nodeValue = raw.replace(key, tr);
      }
      var els = root.querySelectorAll ? root.querySelectorAll("[aria-label],[title],[alt],[placeholder]") : [];
      [].forEach.call(els, function (el) {
        if (el.closest && el.closest(".dn-lang,[data-noi18n]")) return;
        ATTRS.forEach(function (a) {
          if (!el.hasAttribute(a)) return;
          var v = norm(el.getAttribute(a)); if (!v) return;
          var tr = t(v); if (tr !== v) el.setAttribute(a, tr);
        });
      });
    } catch (e) {}
  }
  function applyMeta() {
    if (_lang === "tr") return;
    try {
      if (document.title) { var tt = t(norm(document.title)); if (tt) document.title = tt; }
      var sels = ["meta[name='description']", "meta[property='og:title']", "meta[property='og:description']", "meta[name='twitter:title']", "meta[name='twitter:description']", "meta[property='og:image:alt']"];
      sels.forEach(function (s) {
        var m = document.querySelector(s); if (!m) return;
        var v = norm(m.getAttribute("content")); if (!v) return;
        var tr = t(v); if (tr !== v) m.setAttribute("content", tr);
      });
    } catch (e) {}
  }

  /* ---- SEO: hreflang + canonical/og lang-farkında + og:locale ---- */
  function seoAdapt() {
    try {
      var head = document.head; if (!head) return;
      var base = location.origin + location.pathname;
      function langUrl(l) { if (l === "tr") return base; return base + "?lang=" + l; }
      // eski nx-hl temizle
      [].forEach.call(head.querySelectorAll("link[data-dn-hl]"), function (n) { n.remove(); });
      LANGS.forEach(function (l) {
        var lk = document.createElement("link"); lk.setAttribute("rel", "alternate");
        lk.setAttribute("hreflang", HREFLANG[l]); lk.setAttribute("href", langUrl(l));
        lk.setAttribute("data-dn-hl", "1"); head.appendChild(lk);
      });
      var xd = document.createElement("link"); xd.setAttribute("rel", "alternate");
      xd.setAttribute("hreflang", "x-default"); xd.setAttribute("href", base);
      xd.setAttribute("data-dn-hl", "1"); head.appendChild(xd);
      // canonical + og:url (mevcut varsa lang paramı ekle)
      var can = head.querySelector("link[rel='canonical']"); if (can) can.setAttribute("href", langUrl(_lang));
      var ogu = head.querySelector("meta[property='og:url']"); if (ogu) ogu.setAttribute("content", langUrl(_lang));
      var ogl = head.querySelector("meta[property='og:locale']");
      if (!ogl) { ogl = document.createElement("meta"); ogl.setAttribute("property", "og:locale"); head.appendChild(ogl); }
      ogl.setAttribute("content", LOCALE[_lang]);
    } catch (e) {}
  }

  /* ---- switcher davranışı (footer .dn-lang, content.js tek kaynak) ---- */
  function wireSwitch(root) {
    var boxes = (root || document).querySelectorAll ? (root || document).querySelectorAll(".dn-lang") : [];
    [].forEach.call(boxes, function (box) {
      if (box.__dnWired) { markActive(box); return; }
      box.__dnWired = 1;
      [].forEach.call(box.querySelectorAll("[data-lang]"), function (a) {
        a.addEventListener("click", function (ev) { ev.preventDefault(); setLang(a.getAttribute("data-lang")); });
      });
      markActive(box);
    });
  }
  function markActive(box) {
    [].forEach.call(box.querySelectorAll("[data-lang]"), function (a) {
      if (a.getAttribute("data-lang") === _lang) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  function setLang(l) {
    if (LANGS.indexOf(l) < 0) return;
    try { localStorage.setItem(KEY, l); } catch (e) {}
    try {
      var u = new URL(location.href);
      if (l === "tr") u.searchParams.delete("lang"); else u.searchParams.set("lang", l);
      location.href = u.toString();
    } catch (e) { location.search = (l === "tr") ? "" : "?lang=" + l; }
  }

  /* ---- enjekte stil: aktif dil + RTL ProX izolasyonu ---- */
  function injectStyle() {
    if (document.getElementById("dn-i18n-style")) return;
    var css = ".dn-lang [aria-current]{opacity:1 !important;font-weight:700;color:#0e5e3e}"
      + ".dn-lang a:hover{opacity:1 !important}"
      + "html[dir='rtl'] .fprox,html[dir='rtl'] .prox-x,html[dir='rtl'] .prox-pro,html[dir='rtl'] .fprox-mark,html[dir='rtl'] .prox-logo{direction:ltr;unicode-bidi:isolate}";
    var st = document.createElement("style"); st.id = "dn-i18n-style"; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  /* ---- boot + dinamik içerik ---- */
  function run() { apply(document.body); wireSwitch(document); }
  function boot() {
    injectStyle();
    applyLangAttr(); seoAdapt();
    run(); applyMeta();
    // gecikmeli geçişler (SPA/app.js, footer mount, admin, ilan render)
    [150, 500, 1200, 2200].forEach(function (ms) { setTimeout(function () { run(); applyMeta(); }, ms); });
    // MutationObserver — yeni eklenen düğümleri çevir (throttled)
    try {
      var pend = false;
      var mo = new MutationObserver(function () {
        if (pend) return; pend = true;
        setTimeout(function () { pend = false; run(); }, 120);
      });
      mo.observe(document.body, { childList: true, subtree: true });
    } catch (e) {}
  }
  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);

  window.DNI18N = { lang: function () { return _lang; }, set: setLang, t: t, apply: apply, LANGS: LANGS };
})();
