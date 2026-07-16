/* ============================================================================
   ERİŞİLEBİLİRLİK SHIM'İ — klavye operabilitesi (progressive enhancement)
   ----------------------------------------------------------------------------
   onclick ile tıklanabilir ama klavyeyle çalışmayan kontrolleri (href'siz
   <a onclick> CTA'lar, role=button ama tabindex'siz öğeler) klavyeye açar:
   role="button" + tabindex="0" + Enter/Space → click. Mevcut davranışı
   BOZMAZ; yalnızca eksik erişilebilirlik niteliklerini tamamlar.
   Doğal odaklanabilir öğelere (button, input, href'li a) dokunmaz.
   SPA / dinamik içerik (ilan kartları, hero CTA) için MutationObserver.
   ========================================================================== */
(function () {
  'use strict';

  function targets(root) {
    var r = root && root.querySelectorAll ? root : document;
    // 1) href'siz, tıklama-eylemli <a> (buton gibi davranan bağlantılar)
    // 2) role=button verilmiş ama klavyeye kapalı (tabindex yok) öğeler
    return r.querySelectorAll('a[onclick]:not([href]), [role="button"]:not([tabindex]):not(button):not(a[href])');
  }

  function enhance(el) {
    if (!el || el.nodeType !== 1) return;
    if (el.getAttribute('data-a11y') === '1') return;
    var tag = el.tagName;
    // doğal odaklanabilir olanları atla
    if (tag === 'BUTTON' || tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return;
    if (tag === 'A' && el.hasAttribute('href')) return;
    el.setAttribute('data-a11y', '1');
    if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar' || e.keyCode === 13 || e.keyCode === 32) {
        e.preventDefault();
        el.click();
      }
    });
  }

  function sweep(root) {
    var els = targets(root);
    for (var i = 0; i < els.length; i++) enhance(els[i]);
  }

  function run() {
    sweep(document);
    // dinamik olarak eklenen kontroller için gözlemci
    try {
      var mo = new MutationObserver(function (muts) {
        for (var i = 0; i < muts.length; i++) {
          var added = muts[i].addedNodes;
          for (var j = 0; j < added.length; j++) {
            var n = added[j];
            if (n.nodeType !== 1) continue;
            // eklenen düğümün kendisi + alt ağacı
            if (n.matches && n.matches('a[onclick]:not([href]), [role="button"]:not([tabindex])')) enhance(n);
            if (n.querySelectorAll) sweep(n);
          }
        }
      });
      mo.observe(document.body || document.documentElement, { childList: true, subtree: true });
    } catch (e) {}
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run);
  else run();

  window.dnA11y = sweep;
})();
