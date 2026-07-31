/* insaat/ (Meridyen Yapı) i18n motoru — 5 dil: TR (varsayılan) · EN · RU · ZH (简体) · AR (RTL)
   gayrimenkul/js/i18n.js portu. Kurumsal inşaat sitesi.
   - Dil: ?lang= URL param otoriter > localStorage in_lang > (eski meridyen_lang migrate) > tr
   - Post-render birebir-eşleşme sözlüğü (window.__IN_I18N + __IN_I18N_COMMON): text node + attr + title/meta
   - MutationObserver + gecikmeli geçişler (index SPA app-core.js route render'ları / dinamik içerik)
   - Switcher: mevcut .lang-sw <select> (TR/EN → 5 dile yükseltilir) + opsiyonel .in-lang link grubu
   - ESKİ SİSTEM NÖTRLENİR: insaat'ta her sayfa kendi inline TR/EN çeviricisini (applyLang/nbLang/bzLang,
     anahtar=meridyen_lang) çalıştırıp metni yerinde EN'e çeviriyordu → bu, TR-anahtarlı motorumuzu bozardı.
     Çözüm: meridyen_lang='tr' zorlanır (eski sistem TR'de kalır = sözlük anahtarları korunur) ve
     applyLang/nbLang/bzLang no-op yapılır. Gerçek dil seçimi in_lang'de tutulur; tüm çeviri bu motordan.
   - RTL: <html dir=rtl> (ar); ProX wordmark ters dönmez (.prox-logo/.prox-x/.fprox izole)
   - Admin panel (#adminApp) çevrilmez (yalnız site sahibi, TR kalır).
   Bağımlılık yok, file://+http uyumlu. */
(function () {
  "use strict";
  var LANGS = ["tr", "en", "ru", "zh", "ar"];
  var KEY = "in_lang";
  var LEGACY_KEY = "meridyen_lang";
  var RTL = { ar: true };
  var LOCALE = { tr: "tr_TR", en: "en_US", ru: "ru_RU", zh: "zh_CN", ar: "ar_AR" };
  var HREFLANG = { tr: "tr", en: "en", ru: "ru", zh: "zh-Hans", ar: "ar" };
  var LABEL = { tr: "TR", en: "EN", ru: "RU", zh: "中文", ar: "العربية" };

  var _lang = "tr";
  try {
    var q = (new URLSearchParams(location.search)).get("lang");
    if (LANGS.indexOf(q) >= 0) { _lang = q; localStorage.setItem(KEY, q); }
    else {
      var sl = localStorage.getItem(KEY);
      if (LANGS.indexOf(sl) >= 0) _lang = sl;
      else {
        // eski 2-dilli meridyen_lang'ı tek seferlik migrate et (en → en)
        var ml = localStorage.getItem(LEGACY_KEY);
        if (LANGS.indexOf(ml) >= 0 && ml !== "tr") { _lang = ml; localStorage.setItem(KEY, ml); }
      }
    }
  } catch (e) {}

  /* ---- ESKİ inline TR/EN çeviriciyi nötrle: TR'de sabitle + apply fonksiyonlarını no-op yap ----
     Bu blok parse-anında (gövde sonu) çalışır; eski init'ler DOMContentLoaded/load'da tetiklenir → biz önce geliriz. */
  try { localStorage.setItem(LEGACY_KEY, "tr"); } catch (e) {}
  (function () {
    var noop = function () {};
    ["applyLang", "nbLang", "bzLang"].forEach(function (fn) {
      try { Object.defineProperty(window, fn, { value: noop, writable: false, configurable: true }); }
      catch (e) { try { window[fn] = noop; } catch (e2) {} }
    });
  })();

  /* ortak (nav+footer, her sayfada) + sayfa-özel sözlük birleşir */
  var DICT = {};
  (function () {
    var srcs = [window.__IN_I18N_COMMON, window.__IN_I18N];
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

  function applyLangAttr() {
    var h = document.documentElement;
    h.setAttribute("lang", _lang);
    if (RTL[_lang]) h.setAttribute("dir", "rtl"); else h.setAttribute("dir", "ltr");
  }

  var SKIP_SEL = ".in-lang,.lang-sw,[data-noi18n],#adminApp,.adm-side,.adm-main,.fprox,.prox-logo,.prox-x,.prox-mark";
  function skip(node) {
    var p = node.parentNode; if (!p) return true;
    var nm = p.nodeName; if (nm === "SCRIPT" || nm === "STYLE" || nm === "NOSCRIPT") return true;
    if (p.closest && p.closest(SKIP_SEL)) return true;
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
        if (tr !== key) {
          var idx = raw.indexOf(key);
          if (idx >= 0) { n.nodeValue = raw.slice(0, idx) + tr + raw.slice(idx + key.length); }
          else { var lead = (raw.match(/^\s*/) || [""])[0], trail = (raw.match(/\s*$/) || [""])[0]; n.nodeValue = lead + tr + trail; }
        }
      }
      var els = root.querySelectorAll ? root.querySelectorAll("[aria-label],[title],[alt],[placeholder]") : [];
      [].forEach.call(els, function (el) {
        if (el.closest && el.closest(SKIP_SEL)) return;
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

  function seoAdapt() {
    try {
      var head = document.head; if (!head) return;
      var base = location.origin + location.pathname;
      function langUrl(l) { if (l === "tr") return base; return base + "?lang=" + l; }
      [].forEach.call(head.querySelectorAll("link[data-in-hl]"), function (n) { n.remove(); });
      LANGS.forEach(function (l) {
        var lk = document.createElement("link"); lk.setAttribute("rel", "alternate");
        lk.setAttribute("hreflang", HREFLANG[l]); lk.setAttribute("href", langUrl(l));
        lk.setAttribute("data-in-hl", "1"); head.appendChild(lk);
      });
      var xd = document.createElement("link"); xd.setAttribute("rel", "alternate");
      xd.setAttribute("hreflang", "x-default"); xd.setAttribute("href", base);
      xd.setAttribute("data-in-hl", "1"); head.appendChild(xd);
      var can = head.querySelector("link[rel='canonical']"); if (can) can.setAttribute("href", langUrl(_lang));
      var ogu = head.querySelector("meta[property='og:url']"); if (ogu) ogu.setAttribute("content", langUrl(_lang));
      var ogl = head.querySelector("meta[property='og:locale']");
      if (!ogl) { ogl = document.createElement("meta"); ogl.setAttribute("property", "og:locale"); head.appendChild(ogl); }
      ogl.setAttribute("content", LOCALE[_lang]);
    } catch (e) {}
  }

  /* ---- switcher: mevcut .lang-sw <select> (5 dile yükselt) + opsiyonel .in-lang link grubu ---- */
  function wireSwitch(root) {
    var scope = root || document;
    var boxes = scope.querySelectorAll ? scope.querySelectorAll(".in-lang") : [];
    [].forEach.call(boxes, function (box) {
      if (!box.__inWired) {
        box.__inWired = 1;
        [].forEach.call(box.querySelectorAll("[data-lang]"), function (a) {
          a.addEventListener("click", function (ev) { ev.preventDefault(); setLang(a.getAttribute("data-lang")); });
        });
      }
      markActive(box);
    });
    var sels = scope.querySelectorAll ? scope.querySelectorAll(".lang-sw select, select.lang-sel") : [];
    [].forEach.call(sels, function (sel) {
      if (!sel.__inWired) {
        sel.__inWired = 1;
        sel.setAttribute("data-noi18n", "");
        var have = {}; [].forEach.call(sel.options, function (o) { have[o.value] = 1; });
        LANGS.forEach(function (l) {
          if (!have[l]) { var op = document.createElement("option"); op.value = l; op.textContent = LABEL[l]; sel.appendChild(op); }
          else { [].forEach.call(sel.options, function (o) { if (o.value === l) o.textContent = LABEL[l]; }); }
        });
        sel.onchange = function () { setLang(sel.value); };
      }
      try { sel.value = _lang; } catch (e) {}
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

  function injectStyle() {
    if (document.getElementById("in-i18n-style")) return;
    var css = ".in-lang [aria-current]{opacity:1 !important;font-weight:700}"
      + "html[dir='rtl'] .fprox,html[dir='rtl'] .prox-x,html[dir='rtl'] .prox-pro,html[dir='rtl'] .prox-logo,html[dir='rtl'] .prox-mark{direction:ltr;unicode-bidi:isolate}";
    var st = document.createElement("style"); st.id = "in-i18n-style"; st.textContent = css;
    (document.head || document.documentElement).appendChild(st);
  }

  function run() { apply(document.body); wireSwitch(document); }
  function boot() {
    injectStyle();
    applyLangAttr(); seoAdapt();
    run(); applyMeta();
    [150, 500, 1200, 2200].forEach(function (ms) { setTimeout(function () { run(); applyMeta(); }, ms); });
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

  window.INI18N = { lang: function () { return _lang; }, set: setLang, t: t, apply: apply, LANGS: LANGS };
})();
