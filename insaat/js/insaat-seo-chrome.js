/* Meridyen Yapı — STATİK SEO SAYFALARI için ORTAK CHROME (hafif tek-kaynak).
   Amaç: bolge/hizmetlerimiz/projelerimiz/soru-cevap/neden-biz.html sayfalarında,
   app-core.js/base.css YÜKLEMEDEN (CSS/global çakışması olmadan) chrome'u SPA ile tutarlı yapmak:
     (1) Nav'a ProX Asistan linkini enjekte eder (yeşil-X logolu, SPA ile aynı).
     (2) Canlı ÜYELİK durumunu uygular: giriş yapan kullanıcının adı + yeşil nokta, Giriş→Hesap.
   Böylece bu 5 sayfanın DİNAMİK chrome'u tek dosyadan yönetilir (fork'un asıl drift kaynağı biter).
   Yalnızca bu statik sayfalarda yüklenir; SPA (index.html) bunları app-core.js'ten zaten alır. */
(function () {
  'use strict';
  function firstName(n) { return (String(n || '').trim().split(/\s+/)[0]) || 'Hesabım'; }
  function session() { try { return JSON.parse(localStorage.getItem('insaat_session_v1') || 'null'); } catch (e) { return null; } }

  function injectCSS() {
    if (document.getElementById('seo-chrome-css')) return;
    var s = document.createElement('style');
    s.id = 'seo-chrome-css';
    s.textContent =
      '.prox-logo{font-family:var(--head,"Space Grotesk",system-ui,sans-serif);font-weight:800;letter-spacing:.2px;color:inherit;white-space:nowrap;display:inline-flex;align-items:center}' +
      '.prox-x{display:inline-flex;align-items:center;justify-content:center;background:#19c37d;color:#04140c;border-radius:6px;padding:.02em .28em;margin-left:2px;line-height:1;font-size:.9em}' +
      '.js-giris.logged::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:#19c37d;margin-right:7px;vertical-align:middle}' +
      'footer.insaatFooter .fbot .lang-sw{display:inline-flex!important;align-items:center}'; // dil seçici footer'da her ekranda görünür
    (document.head || document.documentElement).appendChild(s);
  }

  function makeAsistan(cls, mobile) {
    var a = document.createElement('a');
    a.href = 'index.html#asistan';
    if (cls) a.className = cls;
    a.setAttribute('data-seo-asistan', '1');
    a.innerHTML = '<span class="prox-logo">Pro<span class="prox-x">X</span></span>&nbsp;Asistan';
    if (mobile) a.addEventListener('click', function () { var m = document.getElementById('mnav'); if (m) m.classList.remove('open'); });
    return a;
  }

  function injectAsistan() {
    // Masaüstü nav: Bölge Zekası'ndan sonra ekle
    document.querySelectorAll('nav.insaatNav, .insaatNav').forEach(function (nav) {
      if (nav.querySelector('[data-seo-asistan]')) return;
      nav.appendChild(makeAsistan('nav-asistan', false));
    });
    // Mobil menü: Giriş linkinden önce ekle
    document.querySelectorAll('.mnav .panel').forEach(function (p) {
      if (p.querySelector('[data-seo-asistan]')) return;
      var giris = p.querySelector('a[href="#giris"], a.js-giris, a[href*="#giris"]');
      var link = makeAsistan('', true);
      if (giris && giris.parentNode === p) p.insertBefore(link, giris); else p.appendChild(link);
    });
  }

  function applyAuth() {
    var s = session();
    document.querySelectorAll('.js-giris').forEach(function (g) {
      if (s) {
        var nm = firstName(s.name);
        if (g.textContent !== nm) g.textContent = nm; // sadece gerekince yaz (observer döngüsünü önler)
        g.classList.add('logged');
        g.setAttribute('href', 'index.html#hesap');
        g.setAttribute('title', (s.name || '') + ' · ' + (s.email || ''));
        g.onclick = function (e) { if (e && e.preventDefault) e.preventDefault(); location.href = 'index.html#hesap'; return false; };
      } else {
        g.classList.remove('logged');
        g.setAttribute('href', 'index.html#giris');
      }
    });
  }

  // Statik sayfaların kendi i18n'i (bzLang vb.) DOMContentLoaded'da .js-giris metnini "Giriş"e
  // sıfırlıyor + dil değişiminde tekrar yazıyor. Giriş yapılıysa adı geri koymak için gözlemle.
  function watchAuth() {
    if (!session() || typeof MutationObserver !== 'function') return;
    document.querySelectorAll('.js-giris').forEach(function (g) {
      try { new MutationObserver(function () { if (session()) applyAuth(); }).observe(g, { childList: true, characterData: true, subtree: true }); } catch (e) {}
    });
  }

  // Dil seçiciyi nav'dan footer'a taşı (SPA ile aynı: [© copy] [dil] [Powered by ProX]).
  function relocateLang() {
    var sw = document.querySelector('header .lang-sw, .nav-cta .lang-sw, .bar .lang-sw');
    var fbot = document.querySelector('footer.insaatFooter .fbot');
    if (!sw || !fbot || fbot.querySelector('.lang-sw')) return;
    var prox = fbot.querySelector('.fprox');
    if (prox) fbot.insertBefore(sw, prox); else fbot.appendChild(sw);
  }

  function run() { try { injectCSS(); injectAsistan(); relocateLang(); applyAuth(); } catch (e) { /* chrome enjeksiyonu SEO içeriğini asla bozmamalı */ } }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else run();
  // window.load, sayfanın kendi DOMContentLoaded i18n'inden SONRA çalışır → üyelik adı kazanır.
  window.addEventListener('load', function () { try { applyAuth(); watchAuth(); } catch (e) {} });
})();
