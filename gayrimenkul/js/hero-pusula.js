/* ============================================================================
   ANA SAYFA — CANLI KARAR KONSOLU (hero "Pusula")
   Gerçek Pusula motoruna (app.js) bağlı: kullanıcı amaç/bütçe/bölge/öncelik seçtikçe
   canlı eşleşme sayısı, %uyum güven halkası, en iyi uyum spot kartı ve piyasa nabzı
   (bölge ₺/m² · yatırım skoru · kira getirisi / zemin riski) gerçek veriden güncellenir.
   app.js'ten SONRA yüklenir (Pusula, ILANLAR, OZEL, imgSrc, portfoyOpen, goView globalleri).
   ========================================================================== */
(function () {
  'use strict';
  var PCA = { amac: 'Satılık', butce: 0, bolge: '', oncelik: 50, tip: '' };
  function $(id) { return document.getElementById(id); }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function tl(n) { try { return (+n).toLocaleString('tr-TR'); } catch (e) { return n; } }
  function money(n) { if (!n) return '—'; if (typeof window.gmMoney === 'function') return window.gmMoney(n); if (n >= 1e6) return (n / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M ₺'; return tl(n) + ' ₺'; }
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

  var _first = true, _pcBest = null;
  function pcUpdate(animate) {
    var c = { amac: PCA.amac || 'Satılık', tip: PCA.tip || '', butce: PCA.butce || 0, oncelik: PCA.oncelik, bolge: PCA.bolge || '' };
    var res = [];
    try { res = Pusula.match(c) || []; } catch (e) {}
    var best = res[0]; _pcBest = best || null;

    /* canlı eşleşme sayısı */
    var cEl = $('pc_count'); if (cEl) cEl.textContent = poolCount(c);

    /* %uyum güven halkası (en iyi eşleşmenin skoru) */
    var conf = $('pc_conf');
    if (conf) {
      if (best) {
        conf.hidden = false;
        var sc = best._score;
        var cv = $('pc_confv'); if (cv) cv.textContent = '%' + sc;
        var ring = conf.querySelector('.kk-ring');
        if (ring) ring.style.background = 'conic-gradient(var(--accent-bright,#22d3ee) 0 ' + sc + '%, rgba(255,255,255,.12) ' + sc + '% 100%)';
      } else conf.hidden = true;
    }

    /* en iyi uyum spot kartı */
    var sp = $('pc_spot');
    if (sp) {
      sp.hidden = false;
      if (best) {
        var img = '';
        try { if (!best.ozel && best.img && typeof imgSrc === 'function') img = imgSrc(best.img); } catch (e) {}
        var ph = img ? '<img src="' + img + '" alt="" loading="lazy">' : '<span class="kk-lock">🔒</span>';
        var tag = best.ozel ? 'EN İYİ UYUM · ÖZEL PORTFÖY' : 'EN İYİ UYUM';
        var meta = [
          (best.mah ? best.mah + (best.ilce ? ' / ' + best.ilce : '') : best.ilce || ''),
          (best.oda && best.oda !== '-' ? best.oda : ''),
          (best.m2 ? best.m2 + ' m²' : ''),
          (best.ozel ? 'ifşasız portföy' : '')
        ].filter(Boolean).join(' · ');
        sp.innerHTML =
          '<div class="kk-spot-ph' + (best.ozel ? ' oz' : '') + '">' + ph + (best.ozel ? '<span class="kk-oztag">🔒 ÖZEL</span>' : '') + '</div>' +
          '<div class="kk-spot-info">' +
            '<span class="kk-spot-tag">' + esc(tag) + '</span>' +
            '<h4>' + esc(best.tip) + ' · ' + esc(best.mah || best.ilce || '') + '</h4>' +
            '<div class="kk-spot-meta">' + esc(meta) + '</div>' +
            '<div class="kk-spot-pr">' + money(best.fiyat) + '</div>' +
          '</div>' +
          '<span class="kk-spot-sc">%' + best._score + '</span>';
      } else {
        sp.innerHTML = '<div class="kk-spot-empty">Uygun eşleşme yok — bütçeyi veya bölgeyi genişletin.</div>';
      }
    }

    /* piyasa nabzı — en iyi eşleşmenin bölge/mülk gerçekleri */
    var pulse = $('pc_pulse');
    if (pulse) {
      if (best) {
        pulse.hidden = false;
        var m2p = (best.fiyat && best.m2) ? Math.round(best.fiyat / best.m2) : null;
        var mEl = $('pc_m2'); if (mEl) mEl.innerHTML = m2p ? tl(m2p) + '<small> ₺</small>' : '—';
        var sEl = $('pc_skor'); if (sEl) sEl.innerHTML = (best.regionScore != null ? Math.round(best.regionScore) : '—') + '<small>/100</small>';
        var yk = $('pc_yk'), yEl = $('pc_yield');
        if (best.yieldPct != null) { if (yk) yk.textContent = 'Kira Getirisi'; if (yEl) yEl.innerHTML = '%' + best.yieldPct.toFixed(1); }
        else { if (yk) yk.textContent = 'Zemin Riski'; if (yEl) yEl.innerHTML = best.warn ? 'Dikkat' : 'Düşük'; }
      } else pulse.hidden = true;
    }

    _pcResults = res;
    if (!animate && !_first) _pcRenderResults();
    _first = false;
  }

  var _pcResults = [];
  function pcOpenMatch(x) {
    if (!x) return;
    /* İncele: İlan → İlanlar sayfası · Özel Portföy → Özel Portföy sayfası (site nav'ıyla aynı) */
    try {
      if (x.ozel) { if (typeof goPortfoy === 'function') return goPortfoy('ozel'); location.href = 'ozel/'; return; }
      location.href = 'ilanlar.html';
    } catch (e) { try { location.href = x.ozel ? 'ozel/' : 'ilanlar.html'; } catch (e2) {} }
  }
  function _card(x, i) {
    var img = '';
    try { if (!x.ozel && x.img && typeof imgSrc === 'function') img = imgSrc(x.img); } catch (e) {}
    var reasons = (x._reasons || []).slice(0, 1).map(function (r) { return '<li>' + esc(r) + '</li>'; }).join('');
    var titleTxt = (x.tip || 'Mülk') + (x.oda ? ' · ' + x.oda : '') + ' · ' + (x.mah || '') + (x.ilce ? ', ' + x.ilce : '');
    var phInner = img
      ? '<img src="' + img + '" alt="' + esc(titleTxt) + '" loading="lazy">'
      : '<span class="pcr-ozinfo"><span class="pcr-oz-grid">'
        + '<span class="pcr-oz-kv"><i>Mahalle</i><b>' + esc(x.mah || x.ilce || '—') + '</b></span>'
        + '<span class="pcr-oz-kv"><i>Kategori</i><b>' + esc(x.tip || 'Mülk') + (x.oda && x.oda !== '-' ? ' · ' + esc(x.oda) : '') + '</b></span>'
        + '<span class="pcr-oz-kv"><i>m²</i><b>' + (x.m2 || '—') + '</b></span>'
        + '</span></span>';
    var tag = x.ozel
      ? '<span class="pcr-tag oz">🔒 Özel Portföy</span>'
      : '<span class="pcr-tag op ' + ((x.op === 'Kiralık') ? 'kir' : (x.op === 'Günlük' ? 'gun' : 'sat')) + '">' + esc(x.op || 'Satılık') + '</span>';
    var waMsg = x.ozel
      ? 'Merhaba, Özel Portföy — ' + (x.tip || '') + ' ' + (x.mah || '') + '/' + (x.ilce || '') + ' (' + money(x.fiyat) + ') hakkında bilgi almak istiyorum.'
      : 'Merhaba, ' + (x.tip || '') + ' ' + (x.mah || '') + '/' + (x.ilce || '') + ' (' + money(x.fiyat) + ') hakkında bilgi almak istiyorum.';
    var waUrl = _wa(waMsg);
    var incLbl = 'İncele — ' + titleTxt;
    return '<article class="pcr-card' + (x.ozel ? ' oz' : '') + '" data-i="' + i + '">' +
      '<button type="button" class="pcr-go pcr-media" aria-label="' + esc(titleTxt) + ' — detayları incele">' +
        '<span class="pcr-ph">' + phInner +
          (x.ozel
            ? '<span class="pcr-op ' + ((x.op === 'Kiralık') ? 'kir' : (x.op === 'Günlük' ? 'gun' : 'sat')) + '">' + esc(x.op || 'Satılık') + '</span><span class="pcr-score oz2">%' + x._score + ' uyum</span>'
            : '<span class="pcr-score">%' + x._score + ' uyum</span>') + tag +
        '</span>' +
      '</button>' +
      '<div class="pcr-b">' +
        '<div class="pcr-l"><b>' + esc(x.tip || 'Mülk') + '</b> · 📍 ' + esc(x.mah || x.ilce || '') + (x.mah && x.ilce ? ', ' + esc(x.ilce) : '') + '</div>' +
        '<div class="pcr-t">' + esc(x.title || ((x.tip || 'Mülk') + (x.oda && x.oda !== '-' ? ' · ' + x.oda : ''))) + '</div>' +
        '<div class="pcr-meta">' +
          (x.m2 ? '<span>' + x.m2 + ' m²</span>' : '') +
          (x.oda && x.oda !== '-' ? '<span>' + esc(x.oda) + '</span>' : '') +
          (x.regionScore != null ? '<span>⭐ ' + Math.round(x.regionScore) + '</span>' : '') +
        '</div>' +
        '<div class="pcr-p num">' + money(x.fiyat) + '</div>' +
        '<div class="pcr-act">' +
          '<button type="button" class="pcr-go pcr-inc" aria-label="' + esc(incLbl) + '">İncele <span aria-hidden="true">→</span></button>' +
          '<div class="pcr-act2">' +
            '<a class="pcr-wa" href="' + waUrl + '" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()" aria-label="WhatsApp ile bilgi al">' + ICO_WA + '<span>WhatsApp</span></a>' +
            '<a class="pcr-tel" href="' + _telHref() + '" onclick="event.stopPropagation()" aria-label="Telefonla ara">' + ICO_TEL + '<span>Ara</span></a>' +
          '</div>' +
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

  /* ---- KAYITLI ARAMA (saved search) — kriterleri sakla, tek dokunuşla yeniden çalıştır ----
     Yerel (localStorage 'gm_saved_search'); canlı eşleşme sayısı her render'da yeniden hesaplanır.
     Cihazlar-arası eşitleme + yeni-ilan bildirimi backend işidir (PROX-API notu bırakıldı). */
  var SS_KEY = 'gm_saved_search';
  function ssLoad() { try { return JSON.parse(localStorage.getItem(SS_KEY) || '[]') || []; } catch (e) { return []; } }
  function ssSave(arr) { try { localStorage.setItem(SS_KEY, JSON.stringify(arr)); } catch (e) {} }
  function ssLabel(s) {
    var b = (+s.butce) ? '≤' + ((+s.butce) / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M' : 'Bütçe farketmez';
    return (s.amac || 'Satılık') + ' · ' + b + ' · ' + (s.bolge || 'Tüm İzmir');
  }
  function ssCount(s) {
    try {
      var p = Pusula.pool();
      return p.filter(function (it) {
        return it.op === s.amac && (!s.butce || it.fiyat <= s.butce * 1.25) && (!s.bolge || it.ilce === s.bolge);
      }).length;
    } catch (e) { return 0; }
  }
  function renderSavedSearches() {
    var box = $('pc_saved'); if (!box) return;
    var arr = ssLoad();
    if (!arr.length) { box.hidden = true; box.innerHTML = ''; return; }
    box.hidden = false;
    box.innerHTML = '<span class="pc-saved-h">🔖 Kayıtlı aramalarım</span>' +
      arr.map(function (s, i) {
        var n = ssCount(s);
        return '<span class="ss-chip" role="group">' +
          '<button type="button" class="ss-go" onclick="pcApplySaved(' + i + ')" aria-label="' + esc(ssLabel(s)) + ' aramasını uygula">' +
            esc(ssLabel(s)) + '<b class="ss-n">' + n + '</b></button>' +
          '<button type="button" class="ss-x" onclick="pcDelSaved(' + i + ')" aria-label="Kayıtlı aramayı sil" title="Sil">×</button>' +
        '</span>';
      }).join('');
  }
  function pcSaveSearch() {
    var s = { amac: PCA.amac || 'Satılık', butce: +PCA.butce || 0, bolge: PCA.bolge || '', oncelik: PCA.oncelik, tip: PCA.tip || '' };
    var arr = ssLoad();
    var key = function (x) { return (x.amac || '') + '|' + (x.butce || 0) + '|' + (x.bolge || ''); };
    if (arr.some(function (x) { return key(x) === key(s); })) { if (typeof toast === 'function') toast('Bu arama zaten kayıtlı.'); renderSavedSearches(); return; }
    arr.unshift(s); if (arr.length > 6) arr = arr.slice(0, 6);
    ssSave(arr); renderSavedSearches();
    try { var b = $('pc_saved'); if (b) b.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); } catch (e) {}
    if (typeof toast === 'function') toast('🔖 Arama kaydedildi — ' + ssLabel(s));
    try { if (typeof proxSaveSearch === 'function') proxSaveSearch(s); } catch (e) {}
  }
  function pcReflectUI() {
    try {
      var a = $('pc_amac'); if (a) [].forEach.call(a.querySelectorAll('button'), function (x) { x.classList.toggle('on', x.dataset.a === PCA.amac); });
      var bt = $('pc_butce'); if (bt) [].forEach.call(bt.querySelectorAll('button'), function (x) { x.classList.toggle('on', (+x.dataset.b || 0) === (+PCA.butce || 0)); });
      var bg = $('pc_bolge'); if (bg) bg.value = PCA.bolge || '';
      var pr = $('pc_oncelik'); if (pr && PCA.oncelik != null) pr.value = PCA.oncelik;
    } catch (e) {}
  }
  function pcApplySaved(i) {
    var arr = ssLoad(); var s = arr[i]; if (!s) return;
    PCA.amac = s.amac || 'Satılık'; PCA.butce = +s.butce || 0; PCA.bolge = s.bolge || ''; PCA.oncelik = (s.oncelik != null ? s.oncelik : 50); PCA.tip = s.tip || '';
    pcReflectUI(); pcGoResults();
  }
  function pcDelSaved(i) {
    var arr = ssLoad(); if (i < 0 || i >= arr.length) return;
    arr.splice(i, 1); ssSave(arr); renderSavedSearches();
  }
  window.pcSaveSearch = pcSaveSearch; window.pcApplySaved = pcApplySaved; window.pcDelSaved = pcDelSaved; window.renderSavedSearches = renderSavedSearches;

  /* ---- ana sayfa "Özel Portföy'den fırsatlar" mini-ızgarası (ifşasız modern kartlar) ---- */
  function _ozHomeCard(o) {
    var mah = o.mah || o.ilce || '—';
    var tipOda = (o.tip || 'Mülk') + (o.oda && o.oda !== '-' ? ' · ' + o.oda : '');
    var priceN = +o.fiyat || 0;
    var waMsg = 'Merhaba, Özel Portföy — ' + (o.tip || '') + ' ' + (o.mah || '') + '/' + (o.ilce || '') + ' (' + money(priceN) + ') hakkında bilgi almak istiyorum.';
    return '<article class="pcr-card oz ozh-card">' +
      '<div class="pcr-media" role="button" tabindex="0" aria-label="Özel Portföy — ' + esc(tipOda + ' · ' + mah) + '" onclick="if(typeof goPortfoy===\'function\')goPortfoy(\'ozel\')" onkeydown="if((event.key===\'Enter\'||event.key===\' \')&&typeof goPortfoy===\'function\'){event.preventDefault();goPortfoy(\'ozel\')}">' +
        '<span class="pcr-ph">' +
          '<span class="pcr-ozinfo"><span class="pcr-oz-grid">' +
            '<span class="pcr-oz-kv"><i>Mahalle</i><b>' + esc(mah) + '</b></span>' +
            '<span class="pcr-oz-kv"><i>Kategori</i><b>' + esc(tipOda) + '</b></span>' +
            '<span class="pcr-oz-kv"><i>m²</i><b>' + (o.m2 || '—') + '</b></span>' +
          '</span></span>' +
          '<span class="pcr-op ' + (o.op === 'Kiralık' ? 'kir' : (o.op === 'Günlük' ? 'gun' : 'sat')) + '">' + esc(o.op || 'Satılık') + '</span>' +
          '<span class="pcr-tag oz">🔒 Özel Portföy</span>' +
        '</span>' +
      '</div>' +
      '<div class="pcr-b">' +
        '<div class="pcr-l"><b>' + esc(o.op || 'Satılık') + '</b> · 📍 ' + esc(mah) + (o.ilce && o.mah ? ', ' + esc(o.ilce) : '') + '</div>' +
        '<div class="pcr-t">İfşasız portföy — mahremiyet korunur</div>' +
        '<div class="pcr-meta">' + (o.m2 ? '<span>' + o.m2 + ' m²</span>' : '') + (o.oda && o.oda !== '-' ? '<span>' + esc(o.oda) + '</span>' : '') + '<span>🔒 Özel</span></div>' +
        '<div class="pcr-p num">' + money(priceN) + '</div>' +
        '<div class="pcr-act">' +
          '<button type="button" class="pcr-inc" onclick="if(typeof goPortfoy===\'function\')goPortfoy(\'ozel\')">İncele <span aria-hidden="true">→</span></button>' +
          '<div class="pcr-act2">' +
            '<a class="pcr-wa" href="' + _wa(waMsg) + '" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp ile bilgi al">' + ICO_WA + '<span>WhatsApp</span></a>' +
            '<a class="pcr-tel" href="' + _telHref() + '" aria-label="Telefonla ara">' + ICO_TEL + '<span>Ara</span></a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }
  function renderOzHomeCards() {
    var g = $('ozHomeCards'), wrap = $('ozHomeWrap'); if (!g) return;
    var arr = [];
    try { arr = (typeof OZEL !== 'undefined' && OZEL && OZEL.length) ? OZEL : (typeof DEF_OZEL !== 'undefined' ? DEF_OZEL : []); } catch (e) {}
    arr = (arr || []).filter(function (o) { return !o.durum || o.durum === 'aktif'; }).slice(0, 9);
    if (!arr.length) { if (wrap) wrap.hidden = true; return; }
    g.innerHTML = arr.map(_ozHomeCard).join('');
    if (wrap) wrap.hidden = false;
  }
  window.renderOzHomeCards = renderOzHomeCards;

  /* Fiyat Alarmı — bölge chip'i seçimi gizli <select id="al_bolge">'ye yazar (createAlarm uyumu) */
  window.alChip = function (b) {
    try {
      var p = b && b.parentNode; if (p) [].forEach.call(p.children, function (x) { x.classList.toggle('on', x === b); });
      var s = document.getElementById('al_bolge'); if (s) s.value = b.getAttribute('data-b') || '';
    } catch (e) {}
  };

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
      rg.addEventListener('click', function (e) { var go = e.target.closest('.pcr-go'); if (!go) return; var c = go.closest('.pcr-card'); if (!c) return; pcOpenMatch(_pcResults[+c.getAttribute('data-i')]); });
    }
    /* spot kart (en iyi uyum) → tıkla → detay / özel portföyde Detay İste */
    var sp = $('pc_spot'); if (sp) sp.addEventListener('click', function () { if (_pcBest) pcOpenMatch(_pcBest); });
    pcUpdate(true);
    try { renderOzHomeCards(); } catch (e) {}
    try { renderSavedSearches(); } catch (e) {}
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(pcInit, 60); });
  else setTimeout(pcInit, 60);
  window.addEventListener('load', function () { setTimeout(pcInit, 120); });

  window.pcGoResults = pcGoResults; window.pcAllListings = pcAllListings;
})();
