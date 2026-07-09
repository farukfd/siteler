/* Meridyen Gayrimenkul — STATİK SEO SAYFALARI için ORTAK hafif chrome (app.js YÜKLEMEDEN).
   hizmetlerimiz/nedenbiz/portfoy.html: üst menüyü index ile STANDART yapar:
     (1) dil seçiciyi üst menüden footer'a taşır (sağa dayalı, şık) + "Veri Ortağı" yazısını kaldırır,
     (2) nav'a ProX Asistan linki ekler (→ index.html#asistan),
     (3) Giriş'i üyeliğe yönlendirir (→ index.html#giris).
   Bu sayfalarda gmLang YERELDİR; dil seçici DOM'u taşıdığımız için onchange korunur. */
(function () {
  'use strict';
  function injectCSS() {
    if (document.getElementById('gsc-css')) return;
    var s = document.createElement('style'); s.id = 'gsc-css';
    s.textContent =
      '.siteCta .lang-sw,.main .lang-sw,header .lang-sw,nav .lang-sw{display:none!important}' +
      '.fbot .gsc-footlang,.fbot .lang-sw.gsc-footlang{display:inline-flex!important;align-items:center;gap:6px;margin-left:auto;margin-right:14px;opacity:.9}' +
      '.gsc-footlang select{cursor:pointer;background:transparent;border:1px solid currentColor;border-radius:8px;padding:3px 7px;font-weight:700;font-size:12px;color:inherit}' +
      '.gsc-asistan{display:inline-flex;align-items:center}.gsc-asistan .gsc-x{display:inline-grid;place-items:center;width:1.3em;height:1.3em;background:var(--green,#34a853);color:#04140c;border-radius:6px;margin-left:2px;font-weight:900;font-size:.85em}';
    (document.head || document.documentElement).appendChild(s);
  }
  function run() {
    try {
      injectCSS();
      /* 1) "emlakekspertizi.com Veri Ortağı" yazısını kaldır */
      document.querySelectorAll('.fbot span, footer span').forEach(function (sp) {
        if (sp.children.length === 0 && /Veri\s*Ort/i.test(sp.textContent || '')) {
          var pv = sp.previousSibling; if (pv && pv.nodeType === 3) pv.textContent = (pv.textContent || '').replace(/[·|]\s*$/, '');
          sp.remove();
        }
      });
      /* 2) nav dil seçicisini footer'a taşı (sağa dayalı) — bir kez */
      var foot = document.querySelector('.fbot') || document.querySelector('.siteFooter, footer');
      if (foot && !foot.querySelector('.gsc-footlang')) {
        var navLang = document.querySelector('.siteCta .lang-sw, .main .lang-sw, header .lang-sw, nav .lang-sw');
        if (navLang) {
          navLang.classList.add('gsc-footlang');
          var prox = foot.querySelector('.gm-prox');
          if (prox && prox.parentNode) prox.parentNode.insertBefore(navLang, prox); else foot.appendChild(navLang);
        }
      }
      /* 3) nav'a ProX Asistan linki ekle → index'teki tam ekran asistan */
      document.querySelectorAll('.siteNav').forEach(function (nav) {
        if (nav.querySelector('.gsc-asistan')) return;
        var a = document.createElement('a'); a.href = 'index.html#asistan'; a.className = 'gsc-asistan';
        a.innerHTML = 'Pro<span class="gsc-x">X</span>&nbsp;Asistan'; nav.appendChild(a);
      });
      /* 4) Giriş → üyelik (index.html#giris) */
      document.querySelectorAll('.js-giris').forEach(function (g) {
        g.setAttribute('href', 'index.html#giris');
        g.onclick = function (e) { if (e && e.preventDefault) e.preventDefault(); location.href = 'index.html#giris'; return false; };
      });
    } catch (e) { /* SEO içeriğini asla bozma */ }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  window.addEventListener('load', run);
})();
