/* ============================================================================
   ANA SAYFA — İMMERSİF MÜLK PUSULASI (hero)
   Gerçek Pusula motoruna (app.js) bağlı canlı karar pusulası: kullanıcı amaç/bütçe/bölge/öncelik
   seçtikçe iğne döner, merkezde canlı eşleşme sayısı + en iyi uyum, altta en iyi Özel Portföy fırsatı.
   app.js'ten SONRA yüklenir (Pusula, ILANLAR, OZEL, imgSrc, portfoyOpen, goView globalleri).
   ========================================================================== */
(function () {
  'use strict';
  var PCA = { amac: 'Satılık', butce: 0, bolge: '', oncelik: 50, tip: '' };
  function $(id) { return document.getElementById(id); }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tl(n) { try { return (+n).toLocaleString('tr-TR'); } catch (e) { return n; } }
  function money(n) { if (!n) return '—'; if (n >= 1e6) return (n / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M ₺'; return tl(n) + ' ₺'; }

  function poolCount(c) {
    try {
      var p = Pusula.pool();
      return p.filter(function (it) { return it.op === c.amac && (!c.butce || it.fiyat <= c.butce * 1.25); }).length;
    } catch (e) { return 0; }
  }

  var _first = true;
  function pcUpdate(animate) {
    var c = { amac: PCA.amac || 'Satılık', tip: PCA.tip || '', butce: PCA.butce || 0, oncelik: PCA.oncelik, bolge: PCA.bolge || '' };
    /* iğne açısı: öncelik 0 (Yaşam) → -72°, 100 (Yatırım) → +72° */
    var ang = (PCA.oncelik - 50) / 50 * 72;
    var nd = $('pc_needle'); if (nd) nd.style.transform = 'translate(-50%,-50%) rotate(' + ang + 'deg)';
    var comp = $('pc_compass'); if (comp) comp.style.setProperty('--pc-mix', (PCA.oncelik / 100).toFixed(2));
    var res = [];
    try { res = Pusula.match(c) || []; } catch (e) {}
    var cnt = poolCount(c);
    var cEl = $('pc_count'); if (cEl) cEl.textContent = cnt;
    var best = res[0];
    var bEl = $('pc_best');
    if (bEl) {
      if (best) bEl.innerHTML = '<span class="pc-best-pct">%' + best._score + ' uyum</span> · ' + esc(best.tip) + ' · ' + esc(best.mah) + (best.ozel ? ' <span class="pc-oztag">🔒 Özel</span>' : '');
      else bEl.textContent = 'Uygun eşleşme yok — filtreyi genişletin';
    }
    /* en iyi Özel Portföy fırsatı */
    var oz = null; for (var i = 0; i < res.length; i++) { if (res[i].ozel) { oz = res[i]; break; } }
    var ozEl = $('pc_ozel');
    if (ozEl) {
      if (oz) { ozEl.hidden = false; ozEl.innerHTML = '<span class="pc-ozlead">🔒 Size özel fırsat</span><b>' + esc(oz.tip) + ' · ' + esc(oz.mah) + '</b><span class="pc-ozmeta">%' + oz._score + ' uyum · ' + money(oz.fiyat) + ' · ifşasız portföy</span>'; }
      else ozEl.hidden = true;
    }
    _pcResults = res;
    if (!animate && !_first) _pcRenderResults();
    _first = false;
  }

  var _pcResults = [];
  function _card(x) {
    var img = '';
    try { if (!x.ozel && x.img && typeof imgSrc === 'function') img = imgSrc(x.img); } catch (e) {}
    var reasons = (x._reasons || []).slice(0, 2).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
    return '<div class="pcr-card' + (x.ozel ? ' oz' : '') + '">' +
      '<div class="pcr-ph">' + (img ? '<img src="' + img + '" alt="' + esc(x.title || x.tip) + '" loading="lazy">' : '<div class="pcr-oz"><span>🔒</span>Özel Portföy</div>') +
      '<span class="pcr-score">%' + x._score + '</span>' +
      '<span class="pcr-src">' + esc(x.source) + '</span></div>' +
      '<div class="pcr-b"><div class="pcr-t">' + esc(x.tip) + ' · ' + esc(x.oda || '') + '</div>' +
      '<div class="pcr-l">📍 ' + esc(x.mah) + ', ' + esc(x.ilce) + '</div>' +
      '<div class="pcr-p">' + money(x.fiyat) + '</div>' +
      (reasons ? '<ul class="pcr-why">' + reasons + '</ul>' : '') +
      '</div></div>';
  }
  function _pcRenderResults() {
    var g = $('pc_results'); if (!g) return;
    if (!_pcResults.length) { g.innerHTML = ''; return; }
    g.innerHTML = _pcResults.slice(0, 4).map(_card).join('');
  }
  function pcGoResults() {
    pcUpdate(false);
    var panel = $('pc_resultsPanel'); if (panel) { panel.hidden = false; _pcRenderResults(); }
    try { var t = $('pc_resultsPanel'); if (t) t.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {}
  }
  function pcAllListings() { try { if (typeof portfoyOpen === 'function') return portfoyOpen('ilan'); if (typeof goView === 'function') return goView('ilanlar'); } catch (e) {} }

  /* ---- kontrol bağlama ---- */
  function bindSeg(wrapId, key, cast) {
    var w = $(wrapId); if (!w) return;
    w.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      [].forEach.call(w.querySelectorAll('button'), function (x) { x.classList.toggle('on', x === b); });
      PCA[key] = cast ? cast(b.dataset[Object.keys(b.dataset)[0]]) : b.dataset[Object.keys(b.dataset)[0]];
      pcUpdate(false);
    });
  }
  function pcInit() {
    if (!$('pusulaHero')) return;
    bindSeg('pc_amac', 'amac');
    bindSeg('pc_butce', 'butce', function (v) { return +v || 0; });
    var bg = $('pc_bolge'); if (bg) bg.addEventListener('change', function () { PCA.bolge = bg.value; pcUpdate(false); });
    var pr = $('pc_oncelik'); if (pr) pr.addEventListener('input', function () { PCA.oncelik = +pr.value; pcUpdate(true); });
    pcUpdate(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(pcInit, 60); });
  else setTimeout(pcInit, 60);
  window.addEventListener('load', function () { setTimeout(pcInit, 120); });

  window.pcGoResults = pcGoResults; window.pcAllListings = pcAllListings;
})();
