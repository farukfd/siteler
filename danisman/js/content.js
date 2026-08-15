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
  /* GÜVENLİK: bu fonksiyon "esc" adını taşıdığı hâlde hiçbir şey kaçırmıyordu ve
     iki innerHTML noktasını besliyordu (hz-grid kartları, [data-cms] eyebrow).
     Beslenen değerler düz metin — aynı değerin else dalı textContent kullanıyor —
     dolayısıyla kaçışlamak güvenli. Kaynak şu an site sahibinin yayın
     yapılandırması, ama adı esc olan bir no-op sonraki düzenlemede tuzaktır. */
  function esc(s) {
    return ("" + (s == null ? "" : s)).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
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
   FAZ 4C — TENANT-CONFIG İSTEMCİ TÜKETİMİ
   Sayfa açılışında /tenant-config.json çekilir (multi-tenant BFF üretir).
   Başarılıysa: window.TENANT_CONFIG + window.TENANT_CONFIG_VERSION set edilir
   ve document üzerinde 'tenant-config-ready' CustomEvent yayınlanır.
   BİLİNÇLİ KISIT: config.branding.colors.accent gelse bile mevcut accent
   CSS değişkenine DOKUNULMAZ — yalnız window.TENANT_CONFIG maruziyeti.
   Hata/404/parse hatasında sessiz güvenli düşüş: window.TENANT_CONFIG=null,
   sayfa yerleşik değerleriyle AYNEN çalışır (görsel kırılma yok).
   file:// altında fetch hiç denenmez (protokol kontrolü).
   =================================================================== */
(function () {
  window.TENANT_CONFIG = null;
  if (location.protocol === "file:") return;
  try {
    fetch("/tenant-config.json", { cache: "no-cache" })
      .then(function (r) { return (r && r.ok) ? r.json() : null; })
      .then(function (cfg) {
        if (!cfg || typeof cfg !== "object") return;      // 404/boş → yerleşik değerlerle devam
        window.TENANT_CONFIG = cfg;
        if (cfg.config_version != null) window.TENANT_CONFIG_VERSION = cfg.config_version;
        try { document.dispatchEvent(new CustomEvent("tenant-config-ready", { detail: cfg })); } catch (e) {}
      })
      .catch(function () { window.TENANT_CONFIG = null; }); // ağ/parse hatası → sessiz düşüş
  } catch (e) { window.TENANT_CONFIG = null; }
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
  var LANGSW = '<div class="dn-lang" data-noi18n role="group" aria-label="Dil / Language" style="display:inline-flex;gap:6px;align-items:center;flex-wrap:wrap;font-family:\'IBM Plex Sans\',system-ui,sans-serif;font-size:.75rem;letter-spacing:.02em">'
    +   '<a href="?lang=tr" data-lang="tr" style="color:inherit;text-decoration:none;opacity:.7">TR</a><span style="opacity:.3">·</span>'
    +   '<a href="?lang=en" data-lang="en" style="color:inherit;text-decoration:none;opacity:.7">EN</a><span style="opacity:.3">·</span>'
    +   '<a href="?lang=ru" data-lang="ru" style="color:inherit;text-decoration:none;opacity:.7">RU</a><span style="opacity:.3">·</span>'
    +   '<a href="?lang=zh" data-lang="zh" style="color:inherit;text-decoration:none;opacity:.7">中文</a><span style="opacity:.3">·</span>'
    +   '<a href="?lang=ar" data-lang="ar" style="color:inherit;text-decoration:none;opacity:.7">العربية</a>'
    + '</div>';
  var INNER = '<div class="wrap"><div class="fcols">'
    + '<div><div class="brand"><a href="index.html" style="display:flex;align-items:center;gap:12px;text-decoration:none;color:inherit"><span class="mark">M</span><span><b>Selin Meridyen</b><small>Kişiye Özel Danışman</small></span></a></div><p>Kişiye özel emlak danışmanlığı platform demosu. Güncel lüks ilanlar, davet usulü VIP özel portföy ve ücretsiz gayrimenkul değer analizi.</p>'
    + SOC
    + '<div class="fportals"><a class="fp fp-sah" href="https://www.sahibinden.com" target="_blank" rel="noopener noreferrer" aria-label="sahibinden.com ilanlarımız">sahibinden</a><a class="fp fp-hep" href="https://www.hepsiemlak.com" target="_blank" rel="noopener noreferrer" aria-label="hepsiemlak ilanlarımız">hepsiemlak</a><a class="fp fp-ejt" href="https://www.emlakjet.com" target="_blank" rel="noopener noreferrer" aria-label="emlakjet ilanlarımız"><b>emlak</b>jet</a></div>'
    + '</div>'
    + '<div><h4>Keşfet</h4><ul><li><a href="ilanlar.html">İlanlar</a></li><li><a href="harita.html">Harita</a></li><li><a href="emlak-ekspertizi.html">Emlak Ekspertizi</a></li><li><a href="ozel-portfoy.html">Özel Portföy</a></li><li><a href="bolge-analizi.html">Bölge Analizi</a></li><li><a href="index.html#blog">Blog · Haberler</a></li><li><a href="semtler.html">Semt Rehberi</a></li><li><a href="surec.html">Süreç</a></li><li><a href="yatirim-rehberi.html">Yatırım Rehberi</a></li><li><a href="randevu.html">Randevu &amp; Ücretsiz Analiz</a></li></ul></div>'
    + '<div><h4>Kurumsal</h4><ul><li><a href="index.html">Ana Sayfa</a></li><li><a href="hizmetlerimiz.html">Hizmetlerimiz</a></li><li><a href="hakkimizda.html">Hakkımda</a></li><li><a href="referanslar.html">Referanslar</a></li><li><a href="sss.html">S.S.S</a></li><li><a href="iletisim.html">İletişim</a></li><li><a href="index.html#giris">Üye Girişi / Hesabım</a></li><li><a href="https://wa.me/905320000000" target="_blank" rel="noopener noreferrer">WhatsApp</a></li></ul></div>'
    + '<div><h4>Yasal</h4><ul><li><a href="kvkk.html">KVKK Aydınlatma</a></li><li><a href="cerez.html">Çerez Politikası</a></li><li><a href="#" onclick="if(window.dnConsent){dnConsent.open();}return false;">Çerez Tercihleri</a></li><li><a href="kullanim.html">Mesafeli Hizmet &amp; Kullanım</a></li><li><a href="/demo-yonetim" rel="nofollow">Demo Yönetim (sandbox)</a></li><li><a href="index.html#admin">Yönetim Paneli</a></li></ul></div>'
    + '</div>'
    + '<div class="fbot">'
    + LANGSW
    + '<span class="fhaklar"><span>© 2026 Selin Meridyen · Lüks Konut &amp; Özel Portföy Danışmanlığı · Kurumsal marka ve içerik hakları.</span></span><a class="fprox" href="https://emlakekspertizi.com" target="_blank" rel="noopener noreferrer" aria-label="Powered by ProX"><span class="fprox-lead">Powered by</span><span class="fprox-mark"><span class="fprox-pro">Pro</span><span class="fprox-x">X</span></span></a></div>'
    + '</div>';
  window.DN_FOOTER_INNER = INNER;
  /* FAZ3D: üretimde üyelik/yönetim giriş linkleri gizlenir (auth backend'i açılana dek) */
  function _authGizle(){if(window.EMLAK_DEMO!==false)return;try{document.querySelectorAll('a[href$="#giris"],a[href$="#admin"]').forEach(function(el){var li=el.closest('li');(li||el).style.display='none';});}catch(e){}}
  setTimeout(_authGizle,300);setTimeout(_authGizle,1200);
  window.DN_FOOTER_HTML = '<footer>' + INNER + '</footer>';
  window.DN_LANG_SWITCHER = LANGSW;
  /* DEMO & KURUMSAL BANT — üstteki 'role=note' şerit alta alındı; footer öncesine kanonik enjekte (tüm sayfalar, insaat/gm ile aynı) */
  window.DN_DEMOBAND = '<style>'
    +'.demo-band{background:linear-gradient(180deg,#0b1f38,#0f2740);color:#dbeafe;border-top:1px solid rgba(255,255,255,.1);font-family:system-ui,-apple-system,sans-serif}'
    +'.demo-band .db-in{max-width:1240px;margin:0 auto;padding:18px clamp(16px,4vw,40px);display:flex;flex-wrap:wrap;align-items:center;gap:16px 26px;justify-content:space-between}'
    +'.demo-band .db-lead{flex:1 1 320px;min-width:260px}'
    +'.demo-band .db-badge{display:inline-flex;align-items:center;gap:6px;background:#22c55e;color:#052e16;font-weight:800;font-size:.65625rem;letter-spacing:.07em;padding:3px 9px;border-radius:6px;margin-bottom:8px}'
    +'.demo-band p{margin:0;font-size:.8125rem;line-height:1.55;color:#c7d6ea}'
    +'.demo-band a{color:#7dd3fc;text-decoration:none;font-weight:600}.demo-band a:hover{text-decoration:underline}'
    +'.demo-band .db-feats{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}'
    +'.demo-band .db-feats li{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);border-radius:8px;padding:6px 10px;font-size:.71875rem;font-weight:600;color:#e2ecf7;white-space:nowrap}'
    +'.demo-band .db-wa{display:inline-flex;align-items:center;gap:10px;background:#25D366;color:#04240f;padding:10px 15px;border-radius:12px;font-size:.78125rem;line-height:1.3;text-decoration:none;white-space:nowrap}'
    +'.demo-band .db-wa:hover{filter:brightness(1.06);text-decoration:none}.demo-band .db-wa b{font-size:.8125rem;font-weight:800}'
    +'@media(max-width:640px){.demo-band .db-in{flex-direction:column;align-items:flex-start}.demo-band .db-wa{width:100%;justify-content:center}}'
    +'</style>'
    +'<section class="demo-band" aria-label="Demo ve kurumsal bilgi"><div class="db-in">'
    +'<div class="db-lead"><span class="db-badge">🔎 CANLI DEMO</span>'
    +'<p>Bu, kuruma özel hazırlanmış <b>gerçek bir tanıtım sürümüdür</b> — tüm özellikleri buradan deneyimleyebilirsiniz. Kurumsal bilgi &amp; başvuru: <a href="https://www.emlakekspertizi.com" target="_blank" rel="noopener noreferrer">emlakekspertizi.com</a> · <a href="https://www.nadas.com.tr" target="_blank" rel="noopener noreferrer">nadas.com.tr</a></p></div>'
    +'<ul class="db-feats"><li>🎨 Şirkete özel arayüz</li><li>📄 Firmaya özel +5 sayfa</li><li>🗓️ Her ay +1 ek sayfa</li><li>📰 Günlük SEO uyumlu haber</li></ul>'
    +'<a class="db-wa" href="https://api.whatsapp.com/send?phone=905324919453" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile iletişim"><svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.5 14.13c-.23.65-1.36 1.25-1.87 1.3-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.91-4.64-4.09-.14-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.27c.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.47.23.56.79 1.93.86 2.07.07.14.11.3.02.48-.62 1.23-1.28 1.18-.93 1.78.66 1.13 1.32 1.52 2.33 2.03.27.14.43.12.59-.07.18-.21.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.11.07.65-.16 1.3Z"/></svg><span><b>CRM &amp; Yönetim Paneli erişimi için</b><br>WhatsApp: 0532 491 94 53</span></a>'
    +'</div></section>';
  function mountFooters() {
    // Bağımsız dil seçici yuvaları — footer'ı olmayan minimal sayfalar (404, prox-asistan) için tek kaynak
    var slots = document.querySelectorAll('[data-dn-lang-slot]');
    for (var s = 0; s < slots.length; s++) { if (!slots[s].querySelector('.dn-lang')) { try { slots[s].innerHTML = LANGSW; } catch (e) {} } }
    // #siteFooter (index/SPA kabuğu) — app.js de aynı kaynağı kullanır; burada da güvenle bas
    var sf = document.getElementById("siteFooter");
    if (sf && sf.tagName !== "FOOTER" && !sf.querySelector("footer")) { try { sf.innerHTML = window.DN_FOOTER_HTML; } catch (e) {} }
    // statik sayfaların inline <footer>'ı → kanonikle değiştir (app.js yoksa tek kaynak budur)
    var fs = document.querySelectorAll("footer");
    for (var i = 0; i < fs.length; i++) { var f = fs[i]; if (f.closest && f.closest("#pageOverlay")) continue; try { f.innerHTML = INNER; } catch (e) {} }
    /* DEMO bant — ana footer öncesine, sayfada bir kez (üst şerit alta alındı) */
    try {
      if (!document.querySelector(".demo-band")) {
        var anc = document.getElementById("siteFooter");
        if (!anc) { for (var j = 0; j < fs.length; j++) { if (!(fs[j].closest && fs[j].closest("#pageOverlay"))) { anc = fs[j]; break; } } }
        if (anc) anc.insertAdjacentHTML("beforebegin", window.DN_DEMOBAND);
      }
    } catch (e) {}
  }
  window.dnMountFooters = mountFooters;
  ready(mountFooters);
  /* WhatsApp/telefon bağlantılarını admin numarasına (dn_iletisim.wa) güncelle — TÜM sayfalar (nav+footer+CTA).
     Numara girilmemişse placeholder kalır (danışman admin'den kendi numarasını girmeli). */
  function waNumC() { try { var c = JSON.parse(localStorage.getItem("dn_iletisim") || "null"); if (c && c.wa) return ("" + c.wa).replace(/[^\d]/g, ""); } catch (e) {} return ""; }
  function _mailC() { try { var c = JSON.parse(localStorage.getItem("dn_iletisim") || "{}") || {}; if (c.mail) return c.mail; var f = JSON.parse(localStorage.getItem("dn_firma") || "{}") || {}; return f.mail || ""; } catch (e) { return ""; } }
  function applyWaLinks() {
    var n = waNumC();
    if (n) {
      [].forEach.call(document.querySelectorAll('a[href*="wa.me/"]'), function (a) { a.href = a.href.replace(/wa\.me\/\d+/, "wa.me/" + n); });
      [].forEach.call(document.querySelectorAll('a[href^="tel:"]'), function (a) { a.href = "tel:+" + n; });
    }
    /* E-POSTA: mailto href + demo 'info@selinmeridyen.com' metni/öznitelikleri (statik sayfalarda sızıyordu; applyWaLinks eskiden mailto'ya dokunmuyordu) */
    var mail = _mailC();
    if (mail) {
      [].forEach.call(document.querySelectorAll('a[href^="mailto:"]'), function (a) { a.href = "mailto:" + mail; });
      try {
        var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false), ns = [], nx;
        while (nx = w.nextNode()) { if (nx.nodeValue && nx.nodeValue.indexOf("info@selinmeridyen.com") >= 0) ns.push(nx); }
        ns.forEach(function (nn) { nn.nodeValue = nn.nodeValue.split("info@selinmeridyen.com").join(mail); });
      } catch (e) {}
    }
  }
  window.dnApplyWaLinks = applyWaLinks;
  /* SOSYAL MEDYA: dn_social'dan footer href'leri yaz; boşsa gizle. Tenant yapılandırmadıysa demo'ya dokunma. */
  function dnApplySocial() {
    var raw = null; try { raw = localStorage.getItem("dn_social"); } catch (e) {} if (!raw) return;
    var S = {}; try { S = JSON.parse(raw) || {}; } catch (e) {}
    [["fb", "facebook.com"], ["ig", "instagram.com"], ["x", "x.com"], ["li", "linkedin.com"], ["yt", "youtube.com"]].forEach(function (m) {
      var v = (S[m[0]] || "").trim();
      [].forEach.call(document.querySelectorAll('footer a[href*="' + m[1] + '"]'), function (a) {
        if (v) { a.href = /^https?:\/\//i.test(v) ? v : ("https://" + v.replace(/^\/+/, "")); a.style.display = ""; }
        else { a.style.display = "none"; }
      });
    });
  }
  window.dnApplySocial = dnApplySocial;
  /* TİPOGRAFİ: dn_theme.font → Google Fonts yükle + gövde fontu (base.css'i kırmadan). CSP _headers'ta izinli. */
  function dnApplyFont() {
    var f = ""; try { f = (JSON.parse(localStorage.getItem("dn_theme") || "{}") || {}).font || ""; } catch (e) {}
    var CF = { "Playfair Display": "Playfair+Display:wght@500;600;700", "Cormorant": "Cormorant:wght@500;600;700", "Inter": "Inter:wght@400;500;600;700;800", "Poppins": "Poppins:wght@400;500;600;700", "Manrope": "Manrope:wght@400;500;600;700;800", "Sora": "Sora:wght@400;500;600;700", "Jost": "Jost:wght@400;500;600;700" };
    if (!f || !CF[f]) return;
    var lid = "brand-font-" + f.replace(/\s+/g, "");
    if (!document.getElementById(lid)) { var l = document.createElement("link"); l.rel = "stylesheet"; l.id = lid; l.href = "https://fonts.googleapis.com/css2?family=" + CF[f] + "&display=swap"; (document.head || document.documentElement).appendChild(l); }
    if (document.body) document.body.style.fontFamily = "'" + f + "', system-ui, -apple-system, sans-serif";
  }
  window.dnApplyFont = dnApplyFont;
  /* TEMA (accent): dn_theme.accent → statik sayfalar. index initSaaSTheme accent'i
     HEM --accent HEM --gold'a yazıyor (zümrüt+altın teması); statik sayfada da öyle.
     Wipe-proof <style id=tenant-theme> + inline root (sayfanın kendi :root'unu kaskadta yener). */
  function _dnLighten(hex, amt) { try { var n = parseInt(hex.slice(1), 16); var r = Math.min(255, (n >> 16) + amt), g = Math.min(255, ((n >> 8) & 255) + amt), b = Math.min(255, (n & 255) + amt); return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); } catch (e) { return hex; } }
  function _dnDarken(hex, amt) { try { var n = parseInt(hex.slice(1), 16); var r = Math.max(0, (n >> 16) - amt), g = Math.max(0, ((n >> 8) & 255) - amt), b = Math.max(0, (n & 255) - amt); return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1); } catch (e) { return hex; } }
  function _dnRgba(hex, a) { try { var n = parseInt(hex.slice(1), 16); return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")"; } catch (e) { return hex; } }
  function dnApplyTheme() {
    var a = ""; try { a = (JSON.parse(localStorage.getItem("dn_theme") || "{}") || {}).accent || ""; } catch (e) {}
    if (!a || ("" + a).charAt(0) !== "#") return;
    /* accent → TÜM altın ailesi + gradyan. İmza altını süren TEK değişken --grad-gold;
       bütün .mark/.btn-gold/.hs-btn... var(--grad-gold) kullanır → accent seçilince altın accent'e döner.
       Zümrüt (--em*) yapısal koyu neutral olarak kalır (danışman iki-tonlu kimliği). */
    var a2 = _dnLighten(a, 18), soft = _dnLighten(a, 30), dp = _dnDarken(a, 22), ink = _dnDarken(a, 40), sf = _dnRgba(a, .14);
    var grad = "linear-gradient(135deg," + soft + "," + a + " 55%," + dp + ")";
    var css = ":root{--accent:" + a + ";--accent-2:" + a2 + ";--gold:" + a + ";--gold-soft:" + soft + ";--gold-deep:" + dp + ";--gold-ink:" + ink + ";--grad-gold:" + grad + ";--gold-a14:" + sf + ";}";
    var st = document.getElementById("tenant-theme");
    if (!st) { st = document.createElement("style"); st.id = "tenant-theme"; }
    st.textContent = css; (document.head || document.documentElement).appendChild(st);
    var r = document.documentElement.style;
    r.setProperty("--accent", a); r.setProperty("--accent-2", a2); r.setProperty("--gold", a);
    r.setProperty("--gold-soft", soft); r.setProperty("--gold-deep", dp); r.setProperty("--gold-ink", ink); r.setProperty("--grad-gold", grad);
  }
  window.dnApplyTheme = dnApplyTheme;

  /* YASAL KÜNYE TABLOSU: statik yasal sayfalara (kvkk/kullanım/çerez) TAM künye kartı enjekte et
     — demo müşterisi tüm kurumsal bilgiyi görsün (Unvan/Vergi/MERSİS/Sicil/Oda/KEP/Adres/Tel/E-posta/EİDS).
     Veri: dn_firma (+ dn_iletisim fallback). Sadece dolu alan gösterilir. Kişi-anlatısı korunur, tablo EK'tir. */
  function _kEsc(s){return ('' + (s == null ? '' : s)).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });}
  function dnLegalKunye(){
    var body = document.querySelector('.lg-body'); if (!body) return;             // yalnız yasal sayfalar
    if (document.getElementById('dnLegalKunye')) return;                          // tek sefer
    var f = {}, il = {};
    try { f = JSON.parse(localStorage.getItem('dn_firma') || '{}') || {}; } catch (e) {}
    try { il = JSON.parse(localStorage.getItem('dn_iletisim') || '{}') || {}; } catch (e) {}
    var e = f.eids || {};
    var brand = ''; try { brand = (JSON.parse(localStorage.getItem('dn_brand') || '{}') || {}).name || ''; } catch (er) {}
    var unvan = f.unvan || brand || 'Bilgi girilmedi';
    var vergiDaire = f.vergiDaire || '', vergiNo = f.vergi || '';
    var vergi = (vergiDaire || vergiNo) ? [vergiDaire, vergiNo].filter(Boolean).join(' / ') : '';
    var rows = [
      ['Ticari Unvan', unvan, 1],
      ['Danışman / Yetkili', f.advisor || brand, 0],
      ['Vergi Dairesi / No', vergi, 0],
      ['MERSİS No', f.mersis, 0],
      ['Ticaret Sicil No', f.sicil, 0],
      ['Ticaret Odası', f.oda, 0],
      ['KEP Adresi', f.kep, 0],
      ['Taşınmaz Ticareti Yetki Belgesi No', e.belgeNo, 0],
      ['Adres', f.adres || il.adres, 1],
      ['Telefon', f.tel || il.tel, 0],
      ['E-posta', f.mail || il.mail, 0]
    ].filter(function (r) { return r[1]; });
    var g = 'color:var(--gold);font-weight:700';
    var html = '<div id="dnLegalKunye" style="background:var(--cream,#f7f4ec);border:1px solid var(--line-soft,#e7e0cf);border-radius:12px;padding:16px 18px;margin:0 0 22px">'
      + '<div style="font-family:var(--serif,Georgia),serif;color:var(--gold);font-size:1.0625rem;font-weight:700;margin-bottom:10px">Veri Sorumlusu Künyesi</div>'
      + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:7px 24px;font-size:.84375rem;line-height:1.65">'
      + rows.map(function (r) { return '<div' + (r[2] ? ' style="grid-column:1/-1"' : '') + '><b style="' + g + '">' + _kEsc(r[0]) + ':</b> ' + _kEsc(r[1]) + '</div>'; }).join('')
      + '</div></div>';
    var intro = body.querySelector('.intro');
    if (intro && intro.parentNode) intro.insertAdjacentHTML('afterend', html);
    else body.insertAdjacentHTML('afterbegin', html);
  }
  window.dnLegalKunye = dnLegalKunye;

  /* İLETİŞİM HARİTASI (KONUM): tenant adresini OSM'de göster. Adres → Nominatim geocode
     (CSP connect-src'de nominatim.openstreetmap.org izinli) → OSM embed bbox+marker.
     Sonuç dn_iletisim.geo'ya cache'lenir (adres değişince yenilenir). Geocode başarısızsa
     mevcut demo iframe korunur (kırılmaz). Ayrıca "Yol Tarifi" linki adrese göre güncellenir. */
  function dnApplyMap() {
    var frame = document.querySelector('.ct-map iframe'); if (!frame) return;      // yalnız iletişim
    var il = {}, f = {};
    try { il = JSON.parse(localStorage.getItem('dn_iletisim') || '{}') || {}; } catch (e) {}
    try { f = JSON.parse(localStorage.getItem('dn_firma') || '{}') || {}; } catch (e) {}
    var adres = (il.adres || f.adres || '').trim();
    if (!adres) return;                                                            // tenant yok → demo iframe kalsın
    var setMap = function (lat, lon) {
      lat = parseFloat(lat); lon = parseFloat(lon); if (isNaN(lat) || isNaN(lon)) return;
      var w = (lon - 0.010).toFixed(5), s = (lat - 0.007).toFixed(5), e = (lon + 0.010).toFixed(5), n = (lat + 0.007).toFixed(5);
      frame.src = 'https://www.openstreetmap.org/export/embed.html?bbox=' + w + '%2C' + s + '%2C' + e + '%2C' + n + '&layer=mapnik&marker=' + lat.toFixed(5) + '%2C' + lon.toFixed(5);
      // "Yol Tarifi" / haritada aç linkleri (varsa) — OSM directions
      [].forEach.call(document.querySelectorAll('.ct-map a, a.js-map, a[data-map]'), function (a) { a.href = 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lon + '#map=16/' + lat + '/' + lon; a.target = '_blank'; a.rel = 'noopener'; });
    };
    // cache?
    var g = il.geo;
    if (g && g.q === adres && g.lat && g.lon) { setMap(g.lat, g.lon); return; }
    // Nominatim serbest-metin adresi sevmez ("No:200", "Cad.", "/") → normalize + aşamalı sorgu
    var norm = adres
      .replace(/No[:.]?\s*\d+\w*/gi, '').replace(/\bKat\b[^,]*/gi, '').replace(/\bD[:.]?\s*\d+/gi, '')
      .replace(/\bCad\.?\b/gi, 'Caddesi').replace(/\bCd\.?\b/gi, 'Caddesi').replace(/\bMah\.?\b/gi, 'Mahallesi').replace(/\bMh\.?\b/gi, 'Mahallesi')
      .replace(/\bSok\.?\b/gi, 'Sokak').replace(/\bSk\.?\b/gi, 'Sokak').replace(/\bBul(v)?\.?\b/gi, 'Bulvarı').replace(/\bBlv\.?\b/gi, 'Bulvarı')
      .replace(/[\/]/g, ',').replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').replace(/(,\s*)+/g, ', ').replace(/^[,\s]+|[,\s]+$/g, '').trim();
    var parts = norm.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var cands = [norm];                                                            // 1) tam normalize
    if (parts.length >= 2) cands.push(parts.slice(-2).join(', '));                 // 2) ilçe, il
    if (parts.length >= 1) cands.push(parts[parts.length - 1]);                    // 3) il
    var tryNext = function (i) {
      if (i >= cands.length) return;
      try {
        fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=tr&q=' + encodeURIComponent(cands[i]), { headers: { 'Accept': 'application/json' } })
          .then(function (r) { return r.ok ? r.json() : []; })
          .then(function (arr) {
            if (arr && arr[0] && arr[0].lat && arr[0].lon) {
              setMap(arr[0].lat, arr[0].lon);
              try { il.geo = { q: adres, lat: arr[0].lat, lon: arr[0].lon }; localStorage.setItem('dn_iletisim', JSON.stringify(il)); } catch (e) {}
            } else { tryNext(i + 1); }
          })["catch"](function () { tryNext(i + 1); });
      } catch (e) {}
    };
    tryNext(0);
  }
  window.dnApplyMap = dnApplyMap;

  ready(function () { applyWaLinks(); setTimeout(applyWaLinks, 350); dnApplySocial(); dnApplyFont(); dnApplyTheme(); dnLegalKunye(); dnApplyMap(); setTimeout(function(){ dnApplySocial(); dnApplyFont(); dnApplyTheme(); }, 400); });
})();

/* ===================================================================
   HIZLI İLETİŞİM MODALI — "Ücretsiz Ekspertiz" üst CTA (tüm sayfalar).
   window.dnQuickContact(); Ad+Telefon+not → WhatsApp'tan Gönder / Talebi Gönder.
   Lead: dnLead.submit (varsa) → yoksa dn_leads. WhatsApp: dn_iletisim.wa.
   =================================================================== */
(function () {
  function _ts() { try { return Date.now(); } catch (e) { return 0; } }
  function _iso() { try { return new Date().toISOString(); } catch (e) { return ''; } }
  function esc(s) { return ('' + (s == null ? '' : s)).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function waNum() { try { var c = JSON.parse(localStorage.getItem('dn_iletisim') || 'null'); if (c && c.wa) return ('' + c.wa).replace(/[^\d]/g, ''); } catch (e) {} return '905320000000'; }
  function qcToast(m) { if (typeof window.toast === 'function') { window.toast(m); return; } var t = document.createElement('div'); t.textContent = m; t.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:#0e5e3e;color:#fff;padding:12px 18px;border-radius:10px;font:500 .875rem system-ui;z-index:2147483647;box-shadow:0 10px 30px rgba(0,0,0,.3)'; document.body.appendChild(t); setTimeout(function () { t.style.opacity = '0'; t.style.transition = 'opacity .4s'; setTimeout(function () { t.remove(); }, 400); }, 2400); }
  function saveLead(rec) {
    var lead = Object.assign({ id: 'q' + _ts(), ts: _ts(), date: _iso(), src: 'hizli-iletisim' }, rec);
    try { if (window.dnLead && window.dnLead.submit) { window.dnLead.submit(lead); return true; } } catch (e) {}
    try { var a = JSON.parse(localStorage.getItem('dn_leads') || '[]'); if (!Array.isArray(a)) a = []; a.unshift(lead); localStorage.setItem('dn_leads', JSON.stringify(a.slice(0, 500))); return true; } catch (e) {}
    return false;
  }
  function css() {
    if (document.getElementById('dnqc-css')) return;
    var s = document.createElement('style'); s.id = 'dnqc-css';
    s.textContent = [
      '.dnqc-back{position:fixed;inset:0;z-index:2147483200;background:rgba(8,40,28,.5);display:flex;align-items:center;justify-content:center;padding:18px;opacity:0;transition:.22s;font-family:"IBM Plex Sans",system-ui,sans-serif}',
      '.dnqc-back.on{opacity:1}',
      '.dnqc{background:#fff;border:1px solid #e1e3e2;border-radius:16px;max-width:440px;width:100%;max-height:92vh;overflow:auto;transform:translateY(14px);transition:.26s cubic-bezier(.2,.8,.2,1)}',
      '.dnqc-back.on .dnqc{transform:none}',
      '.dnqc-h{padding:22px 24px 6px;position:relative}',
      '.dnqc-h h3{margin:0 0 5px;font:600 1.3125rem "Playfair Display",Georgia,serif;color:#0f3d2e}',
      '.dnqc-h p{margin:0;font-size:.8rem;line-height:1.5;color:#5f6f66}',
      '.dnqc-x{position:absolute;top:15px;right:16px;width:32px;height:32px;border-radius:9px;border:1px solid #e1e3e2;background:#fff;color:#5f6f66;font-size:1.1875rem;line-height:1;cursor:pointer}',
      '.dnqc-x:hover{border-color:#0e5e3e;color:#0e5e3e}',
      '.dnqc-b{padding:14px 24px 8px;display:flex;flex-direction:column;gap:11px}',
      '.dnqc-f label{display:block;font-size:.75rem;font-weight:600;color:#0f3d2e;margin:0 0 5px}',
      '.dnqc-f input,.dnqc-f textarea{width:100%;box-sizing:border-box;border:1px solid #e1e3e2;border-radius:9px;padding:11px 13px;font:400 .875rem "IBM Plex Sans",system-ui,sans-serif;color:#191c1c;background:#fbfbfa}',
      '.dnqc-f input:focus,.dnqc-f textarea:focus{outline:none;border-color:#0e5e3e;background:#fff}',
      '.dnqc-act{display:flex;gap:10px;padding:6px 24px 12px;flex-wrap:wrap}',
      '.dnqc-btn{flex:1 1 auto;min-width:150px;padding:13px 16px;border-radius:10px;font:700 .8125rem "IBM Plex Sans",system-ui,sans-serif;cursor:pointer;border:1.5px solid transparent;text-align:center;transition:.16s}',
      '.dnqc-btn.wa{background:#0b7a4f;color:#fff}.dnqc-btn.wa:hover{filter:brightness(1.08)}',
      '.dnqc-btn.go{background:linear-gradient(135deg,#0e5e3e,#14805a);color:#fff}.dnqc-btn.go:hover{filter:brightness(1.06)}',
      '.dnqc-note{padding:0 24px 20px;font-size:.6875rem;color:#8a968e;line-height:1.5}',
      '@media(prefers-reduced-motion:reduce){.dnqc-back,.dnqc{transition:none}}'
    ].join('');
    document.head.appendChild(s);
  }
  var backEl = null;
  function close() { if (!backEl) return; backEl.classList.remove('on'); var el = backEl; backEl = null; setTimeout(function () { el.remove(); }, 260); }
  window.dnQuickContact = function (opts) {
    opts = opts || {}; css(); if (backEl) return;
    var b = document.createElement('div'); b.className = 'dnqc-back';
    b.innerHTML = '<div class="dnqc" role="dialog" aria-modal="true" aria-label="Hızlı iletişim">'
      + '<div class="dnqc-h"><button class="dnqc-x" aria-label="Kapat">&times;</button><h3>' + esc(opts.title || 'Ücretsiz Ekspertiz · Hızlı İletişim') + '</h3><p>' + esc(opts.sub || 'Bilgilerinizi bırakın, danışmanınız en kısa sürede ulaşsın. Dilerseniz WhatsApp’tan anında yazın.') + '</p></div>'
      + '<div class="dnqc-b">'
      + '<div class="dnqc-f"><label for="dnqc_ad">Ad Soyad *</label><input id="dnqc_ad" placeholder="Adınız Soyadınız" autocomplete="name"></div>'
      + '<div class="dnqc-f"><label for="dnqc_tel">Telefon *</label><input id="dnqc_tel" inputmode="tel" placeholder="05xx xxx xx xx" autocomplete="tel"></div>'
      + '<div class="dnqc-f"><label for="dnqc_not">Kısa not (ops.)</label><textarea id="dnqc_not" rows="2" placeholder="Gayrimenkul, bölge veya ihtiyacınız…"></textarea></div>'
      + '</div>'
      + '<div class="dnqc-act"><button type="button" class="dnqc-btn wa" data-a="wa">WhatsApp’tan Gönder</button><button type="button" class="dnqc-btn go" data-a="go">Talebi Gönder</button></div>'
      + '<div class="dnqc-note">Bilgileriniz yalnızca danışmanınıza iletilir; devam ederek iletişime geçilmesini kabul edersiniz.</div>'
      + '</div>';
    document.body.appendChild(b); backEl = b;
    requestAnimationFrame(function () { b.classList.add('on'); });
    setTimeout(function () { var f = document.getElementById('dnqc_ad'); if (f) f.focus(); }, 120);
    b.addEventListener('click', function (e) {
      if (e.target === b || e.target.classList.contains('dnqc-x')) { close(); return; }
      var btn = e.target.closest('[data-a]'); if (!btn) return;
      var ad = (document.getElementById('dnqc_ad') || {}).value || '', tel = (document.getElementById('dnqc_tel') || {}).value || '', not = (document.getElementById('dnqc_not') || {}).value || '';
      if (!ad.trim() || !tel.trim()) { qcToast('Lütfen ad ve telefon girin.'); return; }
      saveLead({ name: ad, phone: tel, message: not, konu: 'Ücretsiz Ekspertiz' });
      if (btn.getAttribute('data-a') === 'wa') {
        var msg = 'Merhaba, ücretsiz ekspertiz/danışmanlık istiyorum.%0AAd: ' + encodeURIComponent(ad) + '%0ATelefon: ' + encodeURIComponent(tel) + (not ? '%0ANot: ' + encodeURIComponent(not) : '');
        try { window.open('https://wa.me/' + waNum() + '?text=' + msg, '_blank', 'noopener'); } catch (e) {}
        close();
      } else { close(); qcToast('✓ Talebiniz alındı — danışmanınız en kısa sürede ulaşacak.'); }
    });
    document.addEventListener('keydown', function esc2(e) { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', esc2); } });
  };
})();

/* ===================================================================
   ÇOK-ALAN-ADI (500–5000 domain) — canonical + OG MEVCUT domaine göre ayarlanır.
   Aynı statik paket her domainde servis edilir; her domain kendi canonical'ını
   Google'a bildirir (aksi halde Google hepsini tek domaine birleştirir → SEO ölür).
   Sunucu tarafı 'sub_filter' varsa crawler'lar da domain-doğru görür (AGENT-NOTES);
   bu JS, sunucu ayarı OLMADAN da Google + tarayıcı için domain-doğru kılar.
   ProX API tabanı (EMLAK_API_BASE) DEĞİŞMEZ — merkezî, X-Tenant-Id ile ayrışır.
   =================================================================== */
(function () {
  function run() {
    try {
      var clean = location.origin + location.pathname;
      var can = document.querySelector('link[rel="canonical"]');
      if (!can) { can = document.createElement("link"); can.rel = "canonical"; document.head.appendChild(can); }
      var oldOrigin=null;try{if(can.href)oldOrigin=new URL(can.href).origin;}catch(e){}
      can.href = clean;
      var ogu = document.querySelector('meta[property="og:url"]'); if (ogu) ogu.content = clean;
      ['meta[property="og:image"]', 'meta[name="twitter:image"]'].forEach(function (sel) {
        var m = document.querySelector(sel); if (!m || !m.content) return;
        try { m.content = new URL(m.content.split("/").pop(), location.href).href; } catch (e) {}
      });
      if(oldOrigin&&oldOrigin!==location.origin){try{document.querySelectorAll('script[type="application/ld+json"]').forEach(function(s){if(s.textContent&&s.textContent.indexOf(oldOrigin)>=0)s.textContent=s.textContent.split(oldOrigin).join(location.origin);});}catch(e){}}
    } catch (e) {}
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", run); else run();
})();

/* ===================================================================
   İL WHITE-LABEL — İstanbul → aktif il (GRAMER-FARKINDA), tüm sayfalar.
   Kaynak "İstanbul"; hedef dn_service_area.primary ya da dn_firma.il.
   Metin düğümleri + <title> + meta(desc/og/twitter/keywords) + JSON-LD.
   Gramer: window.TRG.suffix (tr-grammar.js) → "İstanbul'u"→"Ankara'yı" vb.
   İsim (Selin Meridyen) yerelleştirmesi ayrı: js/brand.js.
   =================================================================== */
(function () {
  function ready(fn) { if (document.body) fn(); else document.addEventListener("DOMContentLoaded", fn); }
  var SRC = "İstanbul";
  function activeIl() {
    try { var sa = JSON.parse(localStorage.getItem("dn_service_area") || "null"); if (sa && sa.primary && ("" + sa.primary).trim()) return ("" + sa.primary).trim(); } catch (e) {}
    try { var f = JSON.parse(localStorage.getItem("dn_firma") || "null"); if (f && f.il && ("" + f.il).trim()) return ("" + f.il).trim(); } catch (e) {}
    return SRC;
  }
  function sfx(il, t) { try { if (window.TRG && TRG.suffix) return TRG.suffix(il, t); } catch (e) {} return ""; }
  function ilText(s, il) {
    if (!s || (s.indexOf(SRC) < 0 && s.indexOf("İSTANBUL") < 0)) return s;
    if (il === SRC) return s;
    s = s.split("İstanbul ve çevresi").join(il + " ve çevresi");
    s = s.replace(/İstanbul['’](nin|nın|nun|nün|in|ın|un|ün)\b/g, il + "'" + sfx(il, "gen"));
    s = s.replace(/İstanbul['’](den|dan|ten|tan)\b/g, il + "'" + sfx(il, "abl"));
    s = s.replace(/İstanbul['’](deki|daki|teki|takı)\b/g, il + "'" + sfx(il, "loc") + "ki");
    s = s.replace(/İstanbul['’](de|da|te|ta)\b/g, il + "'" + sfx(il, "loc"));
    s = s.replace(/İstanbul['’](ya|ye|a|e)\b/g, il + "'" + sfx(il, "dat"));
    s = s.replace(/İstanbul['’](yı|yi|yu|yü|ı|i|u|ü)\b/g, il + "'" + sfx(il, "acc"));
    s = s.replace(/İstanbul['’]?l[iıuü]\b/g, il + sfx(il, "li"));
    s = s.split("İSTANBUL").join((il || "").toLocaleUpperCase("tr"));
    s = s.replace(/İstanbul/g, il);
    return s;
  }
  window.dnIlText = ilText; window.dnActiveIl = activeIl;
  var _running = false;
  function localizeAll() {
    var il = activeIl(); if (il === SRC) return;
    _running = true;
    try {
      var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
        var v = n.nodeValue; if (!v || (v.indexOf("İstanbul") < 0 && v.indexOf("İSTANBUL") < 0)) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode; if (p && /^(SCRIPT|STYLE|TEXTAREA|INPUT|CODE|NOSCRIPT)$/.test(p.nodeName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      } });
      var nodes = [], x; while (x = w.nextNode()) nodes.push(x);
      nodes.forEach(function (n) { var v = ilText(n.nodeValue, il); if (v !== n.nodeValue) n.nodeValue = v; });
    } catch (e) {}
    try { if (document.title && document.title.indexOf("İstanbul") >= 0) document.title = ilText(document.title, il); } catch (e) {}
    try { ['meta[name="description"]', 'meta[property="og:title"]', 'meta[property="og:description"]', 'meta[name="twitter:title"]', 'meta[name="twitter:description"]', 'meta[name="keywords"]'].forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (m) { if (m.content && m.content.indexOf("İstanbul") >= 0) m.content = ilText(m.content, il); });
    }); } catch (e) {}
    try { document.querySelectorAll('script[type="application/ld+json"]').forEach(function (s) { if (s.textContent && s.textContent.indexOf("İstanbul") >= 0) s.textContent = ilText(s.textContent, il); }); } catch (e) {}
    _running = false;
  }
  window.dnLocalizeProvince = localizeAll;
  ready(function () {
    localizeAll(); setTimeout(localizeAll, 450);
    try {
      var mo = new MutationObserver(function () { if (_running || window.__dnLocTO) return; window.__dnLocTO = setTimeout(function () { window.__dnLocTO = 0; localizeAll(); }, 300); });
      mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    } catch (e) {}
  });
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
      + "#dnCookieBar p{margin:0;flex:1;min-width:240px;font-size:.875rem;line-height:1.6;font-weight:300}"
      + "#dnCookieBar a{color:#dcc389;text-decoration:underline}"
      + "#dnCookieBar .dnck-act{display:flex;gap:10px;flex-wrap:wrap}"
      + "#dnCookieBar button{cursor:pointer;border-radius:999px;padding:10px 18px;font-size:.84375rem;font-weight:500;border:1px solid rgba(220,195,137,.5);background:transparent;color:#f4efe4;transition:.2s}"
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
