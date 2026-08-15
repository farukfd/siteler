/* ============================================================================
   GMDoviz — DÖVİZ & ALTIN BANDI (bilgi amaçlı ticker/marquee)
   YALNIZCA bilgilendirme: dolar/euro/sterlin + gram/çeyrek altın kurları kayan
   bant olarak gösterilir. İlan/portföy fiyatları HER ZAMAN ₺'dir; bu bant fiyatları
   ASLA dönüştürmez (yasal zorunluluk). Kurlar ProX API'den (GET /api/v1/tenant/rates)
   gelir; ProX yoksa/erişilemezse yaklaşık fallback + "bilgi amaçlı" notu.
   Kullanım: sayfada bir <div class="doviz-bandi" id="dovizBandi"></div> olsun; bu dosya
   yüklenince otomatik doldurur. Değişiklikte window.GMDoviz.reload().
   ========================================================================== */
(function () {
  'use strict';

  /* ≈ yaklaşık fallback (serbest piyasa, 2026) — ProX gelince ezilir */
  var RATES = { USD: 41.25, EUR: 44.60, GBP: 52.10, gram_altin: 4180, ceyrek_altin: 6950 };
  var CHANGE = {};                 /* opsiyonel yüzde değişim {USD:+0.42, ...} */
  var META = { fallback: true, updatedAt: '' };

  var ITEMS = [
    { k: 'USD', ic: '💵', lbl: 'Dolar', dec: 4 },
    { k: 'EUR', ic: '💶', lbl: 'Euro', dec: 4 },
    { k: 'GBP', ic: '💷', lbl: 'Sterlin', dec: 4 },
    { k: 'gram_altin', ic: '🥇', lbl: 'Gram Altın', dec: 0 },
    { k: 'ceyrek_altin', ic: '🪙', lbl: 'Çeyrek Altın', dec: 0 }
  ];

  function tl(n, dec) { try { return (+n).toLocaleString('tr-TR', { minimumFractionDigits: dec || 0, maximumFractionDigits: dec || 0 }); } catch (e) { return '' + n; } }
  function itemHTML(it) {
    var v = RATES[it.k]; if (!(+v > 0)) return '';
    var ch = CHANGE[it.k], arrow = '';
    if (ch != null && !isNaN(+ch)) { var up = +ch >= 0; arrow = '<span class="db-ch ' + (up ? 'up' : 'dn') + '">' + (up ? '▲' : '▼') + ' %' + Math.abs(+ch).toFixed(2) + '</span>'; }
    return '<span class="db-i"><span class="db-ic" aria-hidden="true">' + it.ic + '</span><span class="db-l">' + it.lbl + '</span><span class="db-v">' + tl(v, it.dec) + ' ₺</span>' + arrow + '</span>';
  }
  function trackHTML() {
    var seq = ITEMS.map(itemHTML).filter(Boolean).join('<span class="db-sep" aria-hidden="true">•</span>');
    var note = '<span class="db-i db-note">' + (META.fallback ? '⚠ Yedek veri — güncel olmayabilir · ' : '') + 'Serbest piyasa · bilgi amaçlıdır' + (META.updatedAt ? (' · güncelleme ' + META.updatedAt) : '') + '</span>';
    return seq + '<span class="db-sep" aria-hidden="true">•</span>' + note + '<span class="db-sep" aria-hidden="true">•</span>';
  }
  function render() {
    var host = document.getElementById('dovizBandi') || document.querySelector('.doviz-bandi'); if (!host) return;
    var t = trackHTML();
    /* iki kopya → kesintisiz kayan bant (marquee) */
    host.setAttribute('role', 'marquee');
    host.setAttribute('aria-label', 'Güncel döviz ve altın kurları — bilgi amaçlıdır, fiyatlar ₺ ile gösterilir');
    host.innerHTML = '<div class="db-mask"><div class="db-track">' + t + t + '</div></div>';
  }
  function load() {
    var done = function () { render(); };
    try {
      /* FAZ3F: proxApi'ye bağımlılık YOK — her sayfa aynı same-origin uçtan aynı canlı kuru alır */
      var iste = (typeof window.proxApi === 'function')
        ? Promise.resolve(window.proxApi('/api/v1/tenant/rates'))
        : fetch((window.EMLAK_API_BASE||'') + '/api/v1/tenant/rates', {credentials:'same-origin'}).then(function(x){return x.ok?x.json():{fallback:true};}).catch(function(){return {fallback:true};});
      iste.then(function (r) {
        if (r && !r.fallback && r.rates) {
          ['USD', 'EUR', 'GBP', 'gram_altin', 'ceyrek_altin'].forEach(function (c) { if (+r.rates[c] > 0) RATES[c] = +r.rates[c]; });
          var ch = r.rates.change || r.change; if (ch && typeof ch === 'object') CHANGE = ch;
          META = { fallback: false, updatedAt: r.updatedAt || r.rates.updatedAt || '' };
        }
        done();
      }, done);
    } catch (e) { done(); }
  }
  function init() {
    /* Beyaz-etiket: sayfa GM_DOVIZ_OFF bayrağını set ettiyse bant hiç kurulmaz */
    if (window.GM_DOVIZ_OFF) { var h = document.getElementById('dovizBandi') || document.querySelector('.doviz-bandi'); if (h) h.style.display = 'none'; return; }
    render(); load();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();

  window.GMDoviz = { render: render, reload: load, rates: RATES };
})();
