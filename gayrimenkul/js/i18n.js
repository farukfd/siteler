/* gayrimenkul/ i18n motoru — 5 dil: TR (varsayılan) · EN · RU · ZH (简体) · AR (RTL)
   danisman/js/i18n.js portu. Meridyen Gayrimenkul.
   - Dil: ?lang= URL param otoriter > localStorage gm_lang > tr
   - Post-render birebir-eşleşme sözlüğü (window.__GM_I18N + __GM_I18N_COMMON): text node + attr + title/meta
   - MutationObserver + gecikmeli geçişler (SPA app.js / dinamik ilan-render)
   - Switcher: footer .gm-lang (link) + mevcut .lang-sw <select> (5 dile yükseltilir)
   - Eski wlLang (TR/EN/AR çalışma-zamanı AI çeviri) nötrlenir: wl_lang→gm_lang migrate, window.gmLang override
   - RTL: <html dir=rtl> (ar); ProX wordmark ters dönmez (.prox-logo/.prox-x/.fprox izole)
   Bağımlılık yok, file://+http uyumlu. */
(function () {
  "use strict";
  var LANGS = ["tr", "en", "ru", "zh", "ar"];
  var KEY = "gm_lang";
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
        // eski beyaz-etiket wl_lang'ı tek seferlik migrate et
        var wl = localStorage.getItem("wl_lang");
        if (LANGS.indexOf(wl) >= 0 && wl !== "tr") { _lang = wl; localStorage.setItem(KEY, wl); }
      }
    }
  } catch (e) {}
  // eski wlLang oto-uygulamasını devre dışı bırak (çift-çeviri çakışmasını önle)
  try { localStorage.removeItem("wl_lang"); Object.keys(localStorage).forEach(function (k) { if (k.indexOf("wl_i18n_") === 0) localStorage.removeItem(k); }); } catch (e) {}

  /* ortak (nav+footer, her sayfada) + sayfa-özel sözlük birleşir */
  var DICT = {};
  (function () {
    var srcs = [window.__GM_I18N_COMMON, window.__GM_I18N];
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

  function skip(node) {
    var p = node.parentNode; if (!p) return true;
    var nm = p.nodeName; if (nm === "SCRIPT" || nm === "STYLE" || nm === "NOSCRIPT") return true;
    if (p.closest && p.closest(".gm-lang,.lang-sw,[data-noi18n],.fprox,.prox-logo,.prox-x,.prox-mark,#mast-time")) return true;
    return false;
  }
  var ATTRS = ["aria-label", "title", "alt", "placeholder"];

  /* ---- Token geçişi: exact-match başarısız (karışık düğüm: sayı/ilçe/₺ + çevrilebilir kelime) olunca
     sıralı, dilbilgisi-doğru kalıp kuralları uygulanır. İl/ilçe/mahalle (Latin) ve ₺ fiyat/rakam dokunulmaz.
     Zaten çevrilmiş düğümde Türkçe token kalmadığı için tekrar tetiklenmez (kararlı). ---- */
  var TOKENS = [
    // kat (sayı-sıralı, dile göre konum): "7. kat"
    { re: /(\d+)\.\s*kat\b/g, en: "$1. floor", ru: "$1-й этаж", zh: "第$1层", ar: "الطابق $1" },
    // sayaç ifadeleri (uzun → kısa)
    { re: /ilan listeleniyor/g, en: "listings shown", ru: "объявлений показано", zh: "条房源", ar: "إعلان معروض" },
    { re: /ilan bulunamadı/g, en: "listings found", ru: "объявлений найдено", zh: "条房源", ar: "إعلان" },
    { re: /özel portföy kaydı/g, en: "private-portfolio records", ru: "записей закрытого портфеля", zh: "条专属房源记录", ar: "سجل محفظة خاصة" },
    { re: /kayıt seçildi/g, en: "selected", ru: "выбрано", zh: "项已选", ar: "محدد" },
    { re: /kayıt →/g, en: "records →", ru: "записей →", zh: "条记录 →", ar: "سجل ←" },
    { re: /ifşasız portföy/g, en: "undisclosed portfolio", ru: "непубличный портфель", zh: "不公开房源", ar: "محفظة غير مُفصح عنها" },
    { re: /’den başlayan/g, en: "starting from", ru: "от", zh: "起", ar: "ابتداءً من" },
    // etiket/kategori kelimeleri (sınır-korumalı; ilçe/mahalle/sokak Latin kalır)
    { re: /Özel Portföy/g, en: "Private Portfolio", ru: "Закрытый портфель", zh: "专属房源", ar: "المحفظة الخاصة" },
    { re: /(^|[ ·(])İlan(?=[ ·).,]|$)/g, en: "$1Listing", ru: "$1Объявление", zh: "$1房源", ar: "$1إعلان" },
    { re: /(^|[ ·(])Villa(?=[ ·).,]|$)/g, en: "$1Villa", ru: "$1Вилла", zh: "$1别墅", ar: "$1فيلا" },
    { re: /(^|[ ·(])Daire(?=[ ·).,]|$)/g, en: "$1Apartment", ru: "$1Квартира", zh: "$1公寓", ar: "$1شقة" },
    { re: /(^|[ ·(])Ofis(?=[ ·).,]|$)/g, en: "$1Office", ru: "$1Офис", zh: "$1办公室", ar: "$1مكتب" },
    { re: /(^|[ ·(])Arsa(?=[ ·).,]|$)/g, en: "$1Land", ru: "$1Участок", zh: "$1土地", ar: "$1أرض" },
    { re: /(^|[ ·(])Dükkan(?=[ ·).,]|$)/g, en: "$1Shop", ru: "$1Магазин", zh: "$1店铺", ar: "$1محل" },
    { re: /(^|[ ·(])Stüdyo(?=[ ·).,]|$)/g, en: "$1Studio", ru: "$1Студия", zh: "$1开间", ar: "$1استوديو" },
    { re: /Puanı/g, en: "Rating", ru: "рейтинг", zh: "评分", ar: "تقييم" },
    // ekler / birimler
    { re: /\/m²·ay/g, en: "/m²·mo", ru: "/м²·мес", zh: "/㎡·月", ar: "/م²·شهر" },
    { re: /\/yıl/g, en: "/yr", ru: "/год", zh: "/年", ar: "/سنة" },
    { re: /\/ay\b/g, en: "/mo", ru: "/мес", zh: "/月", ar: "/شهر" },
    { re: /’den/g, en: " and up", ru: " и выше", zh: " 起", ar: " فأكثر" },
    // tekil kelimeler (kelime-sınırı korumalı)
    { re: /\bkayıt\b/g, en: "records", ru: "записей", zh: "条记录", ar: "سجل" },
    { re: /\bilan\b/g, en: "listings", ru: "объявлений", zh: "条房源", ar: "إعلان" },
    { re: /\bkişi\b/g, en: "people", ru: "чел.", zh: "人", ar: "أشخاص" },
    { re: /\bendeks\b/g, en: "index", ru: "индекс", zh: "指数", ar: "مؤشر" },
    { re: /\buyum\b/g, en: "match", ru: "совпадение", zh: "匹配", ar: "تطابق" },
    { re: /\bcivarı\b/g, en: "area", ru: "район", zh: "一带", ar: "محيط" },
    { re: /\bbaşlangıç\b/g, en: "starting", ru: "старт", zh: "起价", ar: "البداية" },
    { re: /(\d+)\s*[Yy]ıl\b/g, en: "$1 years", ru: "$1 лет", zh: "$1 年", ar: "$1 سنوات" }
  ];
  function tokenize(raw) {
    var out = raw, hit = false;
    for (var i = 0; i < TOKENS.length; i++) {
      var r = TOKENS[i]; if (!r[_lang]) continue;
      if (r.re.test(out)) { out = out.replace(r.re, r[_lang]); hit = true; }
      r.re.lastIndex = 0;
    }
    return hit ? out : null;
  }

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
        } else {
          var tok = tokenize(raw);
          if (tok !== null && tok !== raw) n.nodeValue = tok;
        }
      }
      var els = root.querySelectorAll ? root.querySelectorAll("[aria-label],[title],[alt],[placeholder]") : [];
      [].forEach.call(els, function (el) {
        if (el.closest && el.closest(".gm-lang,.lang-sw,[data-noi18n]")) return;
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
      [].forEach.call(head.querySelectorAll("link[data-gm-hl]"), function (n) { n.remove(); });
      LANGS.forEach(function (l) {
        var lk = document.createElement("link"); lk.setAttribute("rel", "alternate");
        lk.setAttribute("hreflang", HREFLANG[l]); lk.setAttribute("href", langUrl(l));
        lk.setAttribute("data-gm-hl", "1"); head.appendChild(lk);
      });
      var xd = document.createElement("link"); xd.setAttribute("rel", "alternate");
      xd.setAttribute("hreflang", "x-default"); xd.setAttribute("href", base);
      xd.setAttribute("data-gm-hl", "1"); head.appendChild(xd);
      var can = head.querySelector("link[rel='canonical']"); if (can) can.setAttribute("href", langUrl(_lang));
      var ogu = head.querySelector("meta[property='og:url']"); if (ogu) ogu.setAttribute("content", langUrl(_lang));
      var ogl = head.querySelector("meta[property='og:locale']");
      if (!ogl) { ogl = document.createElement("meta"); ogl.setAttribute("property", "og:locale"); head.appendChild(ogl); }
      ogl.setAttribute("content", LOCALE[_lang]);
    } catch (e) {}
  }

  /* ---- switcher: (a) .gm-lang link grubu (b) mevcut .lang-sw <select> ---- */
  function wireSwitch(root) {
    var scope = root || document;
    // (a) link tabanlı .gm-lang
    var boxes = scope.querySelectorAll ? scope.querySelectorAll(".gm-lang") : [];
    [].forEach.call(boxes, function (box) {
      if (!box.__gmWired) {
        box.__gmWired = 1;
        [].forEach.call(box.querySelectorAll("[data-lang]"), function (a) {
          a.addEventListener("click", function (ev) { ev.preventDefault(); setLang(a.getAttribute("data-lang")); });
        });
      }
      markActive(box);
    });
    // (b) mevcut .lang-sw select → 5 dile yükselt + yönlendir
    var sels = scope.querySelectorAll ? scope.querySelectorAll(".lang-sw select") : [];
    [].forEach.call(sels, function (sel) {
      if (!sel.__gmWired) {
        sel.__gmWired = 1;
        sel.setAttribute("data-noi18n", "");
        // seçenekleri 5 dile tamamla
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
    if (document.getElementById("gm-i18n-style")) return;
    var css = ".gm-lang [aria-current]{opacity:1 !important;font-weight:700;color:#1e7e3a}"
      + ".gm-lang a:hover{opacity:1 !important}"
      + "html[dir='rtl'] .fprox,html[dir='rtl'] .prox-x,html[dir='rtl'] .prox-pro,html[dir='rtl'] .prox-logo,html[dir='rtl'] .prox-mark{direction:ltr;unicode-bidi:isolate}";
    var st = document.createElement("style"); st.id = "gm-i18n-style"; st.textContent = css;
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
  // eski wl.js gmLang stub'ını ele geçir → gerçek 5-dilli engine
  try { window.gmLang = function (l) { setLang(l); }; } catch (e) {}

  if (document.body) boot();
  else document.addEventListener("DOMContentLoaded", boot);

  window.GMI18N = { lang: function () { return _lang; }, set: setLang, t: t, apply: apply, LANGS: LANGS };
})();
