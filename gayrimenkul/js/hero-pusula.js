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
  /* iletişim yardımcıları — app.js global'lerine güvenli erişim (yoksa nazik fallback) */
  function _wa(text) { try { return (typeof waHref === 'function') ? waHref(text) : '#'; } catch (e) { return '#'; } }
  function _telHref() { try { var t = String((typeof FIRMA !== 'undefined' && FIRMA && FIRMA.tel) || '').replace(/[^0-9+]/g, ''); return t ? 'tel:' + t : '#'; } catch (e) { return '#'; } }
  var ICO_WA = '<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.03-.2-.31a8.2 8.2 0 0 1-1.26-4.37c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.42a8.2 8.2 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.23 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.17.04-.31-.02-.43-.06-.13-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.42l-.48-.01c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.24 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z"/></svg>';
  var ICO_TEL = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>';

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
  function pcOpenMatch(x) {
    if (!x) return;
    try {
      var raw = String(x.id || '');
      if (x.ozel) { var oid = raw.replace(/^ozel-/, ''); if (typeof ozLead === 'function') return ozLead(oid); if (typeof ozOpen === 'function') return ozOpen(); }
      var iid = +raw.replace(/^ilan-/, ''); if (typeof openDet === 'function') return openDet(iid);
    } catch (e) {}
  }
  function _card(x, i) {
    var img = '';
    try { if (!x.ozel && x.img && typeof imgSrc === 'function') img = imgSrc(x.img); } catch (e) {}
    var reasons = (x._reasons || []).slice(0, 2).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
    var titleTxt = (x.tip || 'Mülk') + (x.oda ? ' · ' + x.oda : '') + ' · ' + (x.mah || '') + (x.ilce ? ', ' + x.ilce : '');
    /* kart görseli / ifşasız özel portföy yer tutucu */
    var phInner = img
      ? '<img src="' + img + '" alt="' + esc(titleTxt) + '" loading="lazy">'
      : '<span class="pcr-oz"><span class="pcr-oz-ic">🔒</span>Özel Portföy</span>';
    var tag = x.ozel
      ? '<span class="pcr-tag oz">🔒 Özel Portföy</span>'
      : '<span class="pcr-tag">İlan</span>';
    /* WhatsApp mesajı — özel portföyde ifşasız dil */
    var waMsg = x.ozel
      ? 'Merhaba, Özel Portföy — ' + (x.tip || '') + ' ' + (x.mah || '') + '/' + (x.ilce || '') + ' (' + money(x.fiyat) + ') hakkında bilgi almak istiyorum.'
      : 'Merhaba, ' + (x.tip || '') + ' ' + (x.mah || '') + '/' + (x.ilce || '') + ' (' + money(x.fiyat) + ') hakkında bilgi almak istiyorum.';
    var waUrl = _wa(waMsg);
    var incLbl = 'İncele — ' + titleTxt;
    return '<article class="pcr-card' + (x.ozel ? ' oz' : '') + '" data-i="' + i + '">' +
      /* görsel = gerçek denetim (buton); tüm kart artık role=button DEĞİL (nested-interactive giderildi) */
      '<button type="button" class="pcr-go pcr-media" aria-label="' + esc(titleTxt) + ' — detayları incele">' +
        '<span class="pcr-ph">' + phInner +
          '<span class="pcr-score">%' + x._score + ' uyum</span>' + tag +
        '</span>' +
      '</button>' +
      '<div class="pcr-b">' +
        '<div class="pcr-t">' + esc(x.tip) + (x.oda ? ' · ' + esc(x.oda) : '') + '</div>' +
        '<div class="pcr-l">📍 ' + esc(x.mah) + (x.ilce ? ', ' + esc(x.ilce) : '') + '</div>' +
        '<div class="pcr-p num">' + money(x.fiyat) + '</div>' +
        (reasons ? '<ul class="pcr-why">' + reasons + '</ul>' : '') +
        '<div class="pcr-act">' +
          '<a class="pcr-wa" href="' + waUrl + '" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" aria-label="WhatsApp ile bilgi al">' + ICO_WA + '<span>WhatsApp</span></a>' +
          '<a class="pcr-tel" href="' + _telHref() + '" onclick="event.stopPropagation()" aria-label="Telefonla ara">' + ICO_TEL + '<span>Ara</span></a>' +
          '<button type="button" class="pcr-go pcr-inc" aria-label="' + esc(incLbl) + '">İncele <span aria-hidden="true">→</span></button>' +
        '</div>' +
      '</div>' +
    '</article>';
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
    var rg = $('pc_results');
    if (rg) {
      /* yalnızca 'İncele'/görsel butonları (.pcr-go) detaya yönlendirir; WhatsApp/Ara native <a> olarak çalışır */
      rg.addEventListener('click', function (e) { var go = e.target.closest('.pcr-go'); if (!go) return; var c = go.closest('.pcr-card'); if (!c) return; pcOpenMatch(_pcResults[+c.getAttribute('data-i')]); });
    }
    /* en iyi Özel Portföy fırsat kartı → tıkla → Detay İste */
    var ozc = $('pc_ozel'); if (ozc) ozc.addEventListener('click', function () { var oz = null; for (var i = 0; i < _pcResults.length; i++) { if (_pcResults[i].ozel) { oz = _pcResults[i]; break; } } pcOpenMatch(oz); });
    pcUpdate(true);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(pcInit, 60); });
  else setTimeout(pcInit, 60);
  window.addEventListener('load', function () { setTimeout(pcInit, 120); });

  window.pcGoResults = pcGoResults; window.pcAllListings = pcAllListings;
})();
