/* ===================================================================
   content.js — İÇERİK UYGULAYICI (TÜM sayfalar: SPA + statik)
   Statik sayfalar app.js yüklemez → CMS içeriği (dn_content) orada uygulanmazdı.
   Bu bağımsız modül her sayfada dn_content'i (+ opsiyonel yayın-config) okuyup
   hero + [data-cms] + hizmet kartlarını (services[]) uygular. Deploy-hazır:
   assets/data/site-config.json varsa (Yayınla ile üretilir) ziyaretçilere de yansır.
   Kaynak öncelik: localStorage.dn_content  >  DN_PUBLISHED.content  (admin taslağı üstün).
   =================================================================== */
(function () {
  var CMS_KEY = "dn_content";
  function esc(s) { return (s == null ? "" : "" + s); }
  function ready(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }

  var SVC_ICONS = {
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
    key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><path d="m13 9 8 8-2 2-2-2-2 2-2-2"/></svg>',
    building: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6l8-3 8 3v14"/><path d="M4 20h16"/><path d="M9 9h.01M12 9h.01M15 9h.01M9 13h.01M12 13h.01M15 13h.01"/></svg>',
    land: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>',
    chart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="5" width="3" height="12"/></svg>',
    shield: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="M9 12l2 2 4-4"/></svg>',
    star: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z"/></svg>',
    hand: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l4-4 5 3 5-5 4 4"/><path d="M3 12v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/></svg>'
  };
  function icon(k) { return SVC_ICONS[k] || SVC_ICONS.home; }

  function content() {
    var loc = {}; try { loc = JSON.parse(localStorage.getItem(CMS_KEY) || "{}") || {}; } catch (e) {}
    var pub = (window.DN_PUBLISHED && window.DN_PUBLISHED.content && typeof window.DN_PUBLISHED.content === "object") ? window.DN_PUBLISHED.content : {};
    return Object.assign({}, pub, loc);   // admin taslağı (localStorage) yayınlanan config'i ezer
  }

  function setEyebrow(sel, v) { var el = document.querySelector(sel); if (!el || v == null || v === "") return; var dot = el.querySelector && el.querySelector(".eb-dot"); if (dot) el.innerHTML = '<span class="eb-dot"></span>' + esc(v); else el.textContent = v; }
  function setText(sel, v) { var el = document.querySelector(sel); if (el && v != null && v !== "") el.textContent = v; }

  function applyServices(arr) {
    if (!Array.isArray(arr) || !arr.length) return;
    var grid = document.querySelector(".hz-grid"); if (!grid) return;
    try {
      grid.innerHTML = arr.map(function (s, i) {
        var no = ("0" + (i + 1)).slice(-2);
        return '<a class="hz-card rv" href="#hz-' + no + '"><span class="no">' + no + '</span><span class="hz-ic">' + icon(s.icon) + '</span><h3>' + esc(s.title || "") + '</h3><p>' + esc(s.desc || "") + '</p><span class="go">İncele →</span></a>';
      }).join("");
    } catch (e) {}
  }

  function apply() {
    var c = content();
    // hero (ana sayfa)
    try { setEyebrow(".hero .eyebrow", c.heroEb); } catch (e) {}
    try { setText(".hero-title .hl", c.heroT1); } catch (e) {}
    try { setText(".hero-title em", c.heroT2); } catch (e) {}
    try { setText(".hero .lede", c.heroLede); } catch (e) {}
    // [data-cms] hooklu tüm elemanlar (statik sayfalar dahil)
    try {
      [].forEach.call(document.querySelectorAll("[data-cms]"), function (el) {
        var k = el.getAttribute("data-cms"), v = c[k]; if (v == null || v === "") return;
        var dot = el.querySelector && el.querySelector(".eb-dot");
        if (dot) el.innerHTML = '<span class="eb-dot"></span>' + esc(v); else el.textContent = v;
      });
    } catch (e) {}
    // hizmet kartları (services[])
    try { applyServices(c.services); } catch (e) {}
  }
  window.dnContentApply = apply;

  function boot() { apply(); }
  // Yayınlanan içeriği (varsa) yükle, sonra uygula. app.js VARSA (index) çakışmayı önlemek için
  // yalnız statik sayfalarda içerik uygula; index'te app.js zaten uygular (ama data-cms/services'i
  // burada da güvenle uygulamak zararsız — idempotent).
  try {
    if (location.protocol !== "file:") {
      fetch("assets/data/site-config.json", { cache: "no-cache" })
        .then(function (r) { return (r && r.ok) ? r.json() : null; })
        .then(function (j) { if (j && typeof j === "object") window.DN_PUBLISHED = j; }, function () {})
        .then(function () { ready(boot); ready(function () { setTimeout(apply, 400); }); }, function () { ready(boot); });
    } else { ready(boot); }
  } catch (e) { ready(boot); }
})();
