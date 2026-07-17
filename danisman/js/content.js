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

/* ===================================================================
   KANONİK FOOTER — TÜM sayfalarda BİREBİR AYNI (altın kural).
   Tek kaynak: window.DN_FOOTER_HTML. content.js her sayfanın <footer>/#siteFooter'ına
   basar; app.js (index) da footerHTML() ile AYNI kaynağı kullanır → drift YOK.
   href-tabanlı (app.js gerektirmez); overlay'ler index.html#hash + app.js hash handler.
   ÜST NAV'dan çıkarılan İletişim + Bölge Analizi burada (Keşfet/Kurumsal).
   =================================================================== */
(function () {
  function ready(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }
  var SOC = '<div class="fsocial">'
    + '<a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg></a>'
    + '<a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.89a4.29 4.29 0 1 1 0-8.58 4.29 4.29 0 0 1 0 8.58Zm6.86-11.15a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0Z"/></svg></a>'
    + '<a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"/></svg></a>'
    + '<a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.4h3.1V21H3.4V8.4Zm5.34 0h2.97v1.72h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21h-3.1V8.4Z"/></svg></a>'
    + '<a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3.02 3.02 0 0 0 2.12 2.14C4.5 20.15 12 20.15 12 20.15s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.6 24 12 24 12s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z"/></svg></a>'
    + '<a href="https://nsosyal.com" target="_blank" rel="noopener noreferrer" aria-label="NEXT Sosyal" title="NEXT Sosyal — yerli sosyal medya platformu"><svg viewBox="0 0 575 574" aria-hidden="true"><path d="M171.226 0.078125H0V573.751H171.226V0.078125Z"/><path d="M76.1875 0.0782019L191.016 300.603L275.573 520.404C289.183 552.162 326.104 573.751 367.482 573.751H501.631C538.082 573.751 574.142 535.579 574.142 494.748V0H402.917V323.053L398.458 311.632L278.858 0H76.1875V0.0782019Z"/></svg></a>'
    + '</div>';
  var INNER = '<div class="wrap"><div class="fcols">'
    + '<div><div class="brand"><a href="index.html" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit"><span class="mark">M</span><span><b>Selin Meridyen</b><small>Kişiye Özel Danışman</small></span></a></div><p>Yetki belgeli kişiye özel emlak danışmanlığı. Güncel lüks ilanlar, davet usulü VIP özel portföy ve ücretsiz gayrimenkul değer analizi.</p>'
    + SOC
    + '<div class="fportals"><a class="fp fp-sah" href="https://www.sahibinden.com" target="_blank" rel="noopener noreferrer" aria-label="sahibinden.com ilanlarımız">sahibinden</a><a class="fp fp-hep" href="https://www.hepsiemlak.com" target="_blank" rel="noopener noreferrer" aria-label="hepsiemlak ilanlarımız">hepsiemlak</a><a class="fp fp-ejt" href="https://www.emlakjet.com" target="_blank" rel="noopener noreferrer" aria-label="emlakjet ilanlarımız"><b>emlak</b>jet</a></div>'
    + '</div>'
    + '<div><h4>Keşfet</h4><ul><li><a href="ilanlar.html">İlanlar</a></li><li><a href="ozel-portfoy.html">Özel Portföy</a></li><li><a href="bolge-analizi.html">Bölge Analizi</a></li><li><a href="index.html#blog">Blog · Haberler</a></li><li><a href="index.html#surec">Süreç</a></li><li><a href="index.html#randevu">Ücretsiz Analiz</a></li></ul></div>'
    + '<div><h4>Kurumsal</h4><ul><li><a href="index.html">Ana Sayfa</a></li><li><a href="hizmetlerimiz.html">Hizmetlerimiz</a></li><li><a href="hakkimizda.html">Hakkımda</a></li><li><a href="sss.html">S.S.S</a></li><li><a href="iletisim.html">İletişim</a></li><li><a href="index.html#giris">Üye Girişi / Hesabım</a></li><li><a href="https://wa.me/905320000000" target="_blank" rel="noopener noreferrer">WhatsApp</a></li></ul></div>'
    + '<div><h4>Yasal</h4><ul><li><a href="kvkk.html">KVKK Aydınlatma</a></li><li><a href="cerez.html">Çerez Politikası</a></li><li><a href="kullanim.html">Mesafeli Hizmet &amp; Kullanım</a></li><li><a href="index.html#admin">Yönetim Paneli</a></li></ul></div>'
    + '</div>'
    + '<div class="fbot"><span>© 2026 Selin Meridyen · Lüks Konut &amp; Özel Portföy Danışmanlığı · Tüm hakları saklıdır.</span><a class="fprox" href="https://emlakekspertizi.com" target="_blank" rel="noopener noreferrer" aria-label="Powered by ProX"><span class="fprox-lead">Powered by</span><span class="fprox-mark"><span class="fprox-pro">Pro</span><span class="fprox-x">X</span></span></a></div>'
    + '</div>';
  window.DN_FOOTER_INNER = INNER;
  window.DN_FOOTER_HTML = '<footer>' + INNER + '</footer>';
  function mountFooters() {
    // #siteFooter (index/SPA kabuğu) — app.js de aynı kaynağı kullanır; burada da güvenle bas
    var sf = document.getElementById("siteFooter");
    if (sf && sf.tagName !== "FOOTER" && !sf.querySelector("footer")) { try { sf.innerHTML = window.DN_FOOTER_HTML; } catch (e) {} }
    // statik sayfaların inline <footer>'ı → kanonikle değiştir (app.js yoksa tek kaynak budur)
    var fs = document.querySelectorAll("footer");
    for (var i = 0; i < fs.length; i++) { var f = fs[i]; if (f.closest && f.closest("#pageOverlay")) continue; try { f.innerHTML = INNER; } catch (e) {} }
  }
  window.dnMountFooters = mountFooters;
  ready(mountFooters);
  /* WhatsApp/telefon bağlantılarını admin numarasına (dn_iletisim.wa) güncelle — TÜM sayfalar (nav+footer+CTA).
     Numara girilmemişse placeholder kalır (danışman admin'den kendi numarasını girmeli). */
  function waNumC() { try { var c = JSON.parse(localStorage.getItem("dn_iletisim") || "null"); if (c && c.wa) return ("" + c.wa).replace(/[^\d]/g, ""); } catch (e) {} return ""; }
  function applyWaLinks() {
    var n = waNumC(); if (!n) return;
    [].forEach.call(document.querySelectorAll('a[href*="wa.me/"]'), function (a) { a.href = a.href.replace(/wa\.me\/\d+/, "wa.me/" + n); });
    [].forEach.call(document.querySelectorAll('a[href^="tel:"]'), function (a) { a.href = "tel:+" + n; });
  }
  window.dnApplyWaLinks = applyWaLinks;
  ready(function () { applyWaLinks(); setTimeout(applyWaLinks, 350); });
})();

/* ===================================================================
   ÇEREZ ONAY BANDI (KVKK/ePrivacy) — tüm sayfalarda; seçim localStorage.dn_cookie'de.
   Bağımsız, hafif; app.js gerektirmez. Zorunlu/tüm çerez ayrımı.
   =================================================================== */
(function () {
  function ready(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }
  var KEY = "dn_cookie";
  function choice() { try { return localStorage.getItem(KEY); } catch (e) { return "1"; } }
  window.dnCookieChoose = function (v) { try { localStorage.setItem(KEY, v); } catch (e) {} var el = document.getElementById("dnCookieBar"); if (el) el.classList.remove("on"); };
  ready(function () {
    return; /* ESKİ çerez bandı DEVRE DIŞI — KVKK granüler onay bandı artık js/cerez.js'te (dn_cerez_consent). Çift bant olmasın. */
    if (choice()) return;
    if (document.getElementById("dnCookieBar")) return;
    var st = document.createElement("style");
    st.textContent = "#dnCookieBar{position:fixed;left:16px;right:16px;bottom:16px;z-index:9998;max-width:760px;margin:0 auto;background:#0a3527;color:#f4efe4;border:1px solid rgba(220,195,137,.4);border-radius:14px;box-shadow:0 18px 50px rgba(0,0,0,.4);padding:18px 20px;display:none;font-family:'Jost',system-ui,sans-serif}"
      + "#dnCookieBar.on{display:flex;flex-wrap:wrap;align-items:center;gap:14px}"
      + "#dnCookieBar p{margin:0;flex:1;min-width:240px;font-size:14px;line-height:1.6;font-weight:300}"
      + "#dnCookieBar a{color:#dcc389;text-decoration:underline}"
      + "#dnCookieBar .dnck-act{display:flex;gap:10px;flex-wrap:wrap}"
      + "#dnCookieBar button{cursor:pointer;border-radius:999px;padding:10px 18px;font-size:13.5px;font-weight:500;border:1px solid rgba(220,195,137,.5);background:transparent;color:#f4efe4;transition:.2s}"
      + "#dnCookieBar button.p{background:linear-gradient(160deg,#dcc389,#b8912f);color:#0a3527;border-color:transparent}"
      + "#dnCookieBar button:hover{transform:translateY(-1px)}"
      + "@media(max-width:560px){#dnCookieBar .dnck-act{width:100%}#dnCookieBar button{flex:1}}";
    document.head.appendChild(st);
    var bar = document.createElement("div");
    bar.id = "dnCookieBar"; bar.setAttribute("role", "dialog"); bar.setAttribute("aria-label", "Çerez tercihi");
    bar.innerHTML = '<p>Bu sitede deneyiminizi iyileştirmek için çerezler kullanıyoruz. Ayrıntılar için <a href="cerez.html">Çerez Politikası</a>\'na göz atabilirsiniz.</p>'
      + '<div class="dnck-act"><button onclick="dnCookieChoose(\'essential\')">Yalnızca Zorunlu</button><button class="p" onclick="dnCookieChoose(\'accept\')">Tümünü Kabul Et</button></div>';
    document.body.appendChild(bar);
    setTimeout(function () { bar.classList.add("on"); }, 900);
  });
})();
