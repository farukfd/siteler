/* ============================================================================
   ANA SAYFA — MAHALLE EMLAK ENDEKSİ (ileri seviye · ProX gerçek veri)
   Seçili mahalle için ProX endeks API'sinden TÜM kategoriler canlı çekilir:
     • Daire satılık / kiralık  • İşyeri satılık / kiralık  • Arsa
   + yıllık artış, mahalle demografi pastaları (yaş/eğitim/gelir/sahiplik)
   + "bu mahallede X'ten başlayan Özel Portföyümüz var" vitrini + cadde/sokak örnekleri.
   Canlı veri gelmezse yerel modele düşer (kesintisiz). app.js'ten SONRA yüklenir.
   Bağımlılık (app.js global): PROVINCE, bzMahalle, bzGrowthSeries, bzSeed, bzRng,
   proxApi, OZEL, goView, ozLead, portfoyOpen.
   ========================================================================== */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { try { return Math.round(n).toLocaleString('tr-TR'); } catch (e) { return '' + n; } }
  function M(n) { if (!isFinite(n) || !n) return '—'; if (n >= 1e6) return (n / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + 'M ₺'; return fmt(n) + ' ₺'; }
  function rng(s) { return bzRng(bzSeed(s)); }
  function annual(chg5) { return Math.max(0, (Math.pow(1 + (chg5 || 0) / 100, 1 / 5) - 1) * 100); }
  function periodTR(p) { if (!p) return ''; var s = String(p); return s.length === 6 ? s.slice(0, 4) + '-' + s.slice(4) : s; }

  var _il = '', _mh = '', _gid = 0, _cache = {}, _req = 0;

  var BLUE = ['#1e40af', '#3b82f6', '#60a5fa', '#93c5fd', '#cfe0ff'];
  var TEAL = ['#0e7490', '#0891b2', '#22a5c4', '#67cbe0', '#b6ecf6'];
  var GOLD = ['#b8860b', '#d4af37', '#e6c766', '#f2dd9a'];
  var OWN = ['#1e40af', '#dfe6f2'];

  /* ---- mini trend grafiği ---- */
  function spark(series, color) {
    if (!series || series.length < 2) return '';
    var w = 132, h = 38, min = Math.min.apply(null, series), max = Math.max.apply(null, series), rg = (max - min) || 1;
    var pts = series.map(function (v, i) { return [(i / (series.length - 1)) * w, h - 5 - ((v - min) / rg) * (h - 12)]; });
    var line = pts.map(function (p) { return p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join(' ');
    var area = '0,' + h + ' ' + line + ' ' + w + ',' + h, last = pts[pts.length - 1], id = 'meg' + (++_gid);
    return '<svg class="me-spark" viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" aria-hidden="true">' +
      '<defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + color + '" stop-opacity=".24"/><stop offset="1" stop-color="' + color + '" stop-opacity="0"/></linearGradient></defs>' +
      '<polygon points="' + area + '" fill="url(#' + id + ')"/>' +
      '<polyline points="' + line + '" fill="none" stroke="' + color + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>' +
      '<circle cx="' + last[0].toFixed(1) + '" cy="' + last[1].toFixed(1) + '" r="3" fill="' + color + '"/></svg>';
  }
  /* ---- çok segmentli donut (pasta) ---- */
  function donut(segs, colors, center) {
    var r = 52, cx = 60, cy = 60, C = 2 * Math.PI * r, off = 0, w = 17;
    var arcs = segs.map(function (v, i) {
      var len = (v / 100) * C;
      var el = '<circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="none" stroke="' + colors[i % colors.length] + '" stroke-width="' + w + '" stroke-dasharray="' + len.toFixed(2) + ' ' + (C - len).toFixed(2) + '" stroke-dashoffset="' + (-off).toFixed(2) + '" transform="rotate(-90 ' + cx + ' ' + cy + ')"/>';
      off += len; return el;
    }).join('');
    return '<svg class="me-donut-svg" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="#eef2f8" stroke-width="17"/>' + arcs +
      (center ? '<text x="60" y="61" text-anchor="middle" dominant-baseline="central" class="me-donut-c">' + center + '</text>' : '') + '</svg>';
  }
  function legend(labels, vals, colors) {
    return '<ul class="me-legend">' + labels.map(function (l, i) {
      return '<li><span class="sw" style="background:' + colors[i % colors.length] + '"></span>' + esc(l) + '<b>%' + Math.round(vals[i]) + '</b></li>';
    }).join('') + '</ul>';
  }

  /* ============ VERİ KATMANI ============ */
  var CATS = [
    { key: 'daireSat', kat: 'konut', dur: 'satilik' },
    { key: 'daireKira', kat: 'konut', dur: 'kiralik' },
    { key: 'ticariSat', kat: 'ticari', dur: 'satilik' },
    { key: 'ticariKira', kat: 'ticari', dur: 'kiralik' },
    { key: 'arsa', kat: 'arsa', dur: 'satilik' }
  ];
  function provName() { return (typeof PROVINCE !== 'undefined' && PROVINCE && PROVINCE.name) || 'İzmir'; }

  /* yerel model — canlı gelmeden anında dolum + fallback */
  function localModel(ilce, mah) {
    var d = bzMahalle(ilce, mah), b = d.m2, kmo = b * (d.kira / 100) / 12;
    return {
      source: 'local', period: '', score: d.score, chg5: d.chg, ilce: ilce, mah: mah, base: b,
      cats: {
        daireSat: { m2: b, live: false, ilan: 0 },
        daireKira: { m2: kmo, live: false, ilan: 0 },
        ticariSat: { m2: b * 1.9, live: false, ilan: 0 },
        ticariKira: { m2: kmo * 1.15, live: false, ilan: 0 },
        arsa: { m2: b * 0.18, live: false, ilan: 0 }
      },
      demo: { yas: d.yas, egitim: d.egitim, gelir: d.gelir, sahiplik: d.sahiplik, ortGelir: d.ortGelir, nufus: d.nufus, hane: d.hane, yasamK: d.yasamK }
    };
  }

  /* tek kategori canlı çek — mantık dışı/boş değerde null döner */
  function fetchCat(ilce, mah, c, base) {
    var url = '/api/v1/tenant/endeks?il=' + encodeURIComponent(provName()) + '&ilce=' + encodeURIComponent(ilce) + '&mahalle=' + encodeURIComponent(mah) + '&kategori=' + c.kat + '&durum=' + c.dur;
    return proxApi(url).then(function (r) {
      if (!r || r.fallback || r.success !== true || !r.data) return null;
      var m2 = +r.data.m2, ilan = +r.data.ilan_sayisi || 0, delta = +r.data.delta || 0, score = +r.data.score || 0;
      if (!isFinite(m2) || m2 <= 0) return null;
      // makullük kapıları (base = daire satış m²) — kira için üst sınır yıllık getiriyi
      // gerçekçi tutar; turizm bölgelerinde günlük kiralık verisi ₺/m²·ay'ı şişirir → yerel modele düş.
      if (c.key === 'daireSat' && m2 < 1000) return null;
      if (c.key === 'daireKira' && (m2 < 40 || (base && m2 > base * 0.012))) return null;   // ≤ ~%14/yıl brüt
      if (c.key === 'ticariSat' && base && (m2 < base * 0.9 || m2 > base * 4)) return null;
      if (c.key === 'ticariKira' && (m2 < 40 || (base && m2 > base * 0.02))) return null;    // ticari getiri daha yüksek olabilir
      if (c.key === 'arsa' && base && (m2 < base * 0.05 || m2 > base * 0.7)) return null;
      return { m2: m2, ilan: ilan, delta: delta, score: score, period: (r.data.trend && r.data.trend[0] && r.data.trend[0].period) || '' };
    }).catch(function () { return null; });
  }

  /* ProX Değerleme (analyze) — değer aralığı + güven + piyasa yönü (90 m² daire) */
  function fetchAnalyze(ilce, mah) {
    return proxApi('/api/v1/tenant/prox/analyze', { method: 'POST', body: { il: provName(), ilce: ilce, mahalle: mah, kategori: 'konut', durum: 'satilik', brut_m2: 90, attrs: {} } }).then(function (r) {
      if (!r || r.fallback || r.success !== true) return null;
      var rg = r.range || {}, min = +rg.min_value || 0, max = +rg.max_value || 0;
      if (!min && !max) return null;
      return { min: min, max: max, strong: +r.strongest_value || 0, spread: +rg.spread_pct || 0, conf: (r.confidence != null ? +r.confidence : null), band: r.confidence_band || '', yon: r.piyasa_yonu || '', veri: +r.veri_adedi || 0 };
    }).catch(function () { return null; });
  }

  /* canlı model — daire satış'ı önce çek (base), sonra diğer kategoriler + analyze paralel; localModel'e bindir */
  function liveModel(ilce, mah) {
    var key = provName() + '|' + ilce + '|' + mah;
    if (_cache[key]) return Promise.resolve(_cache[key]);
    var m = localModel(ilce, mah);
    return fetchCat(ilce, mah, CATS[0], m.base).then(function (ds) {
      var base = (ds && ds.m2) || m.base;
      return Promise.all([
        Promise.all(CATS.slice(1).map(function (c) { return fetchCat(ilce, mah, c, base); })),
        fetchAnalyze(ilce, mah)
      ]).then(function (res) {
        var rest = res[0], az = res[1], all = [ds].concat(rest), anyLive = false, ilanTot = 0, period = '', dsScore = 0, dsDelta = 0;
        CATS.forEach(function (c, i) {
          var r = all[i]; if (r) { m.cats[c.key] = { m2: r.m2, live: true, ilan: r.ilan }; anyLive = true; ilanTot += r.ilan; if (r.period) period = r.period; if (i === 0) { dsScore = r.score; dsDelta = r.delta; } }
        });
        if (az) m.analyze = az;
        if (anyLive || az) { m.source = 'live'; m.period = period; m.ilanTot = ilanTot; if (dsScore) m.score = dsScore; if (dsDelta) m.deltaYr = dsDelta; }
        _cache[key] = m; return m;
      });
    });
  }

  /* ============ ÖZEL PORTFÖY (province-aware · gerçek OZEL + canlı türetme) ============ */
  var TIP_CAT = { 'Daire': 'Konut', 'Villa': 'Konut', 'Müstakil Ev': 'Konut', 'İşyeri': 'Ticari', 'Ofis': 'Ticari', 'Dükkan': 'Ticari', 'Arsa': 'Arsa', 'Tarla': 'Arsa', 'Bağ-Bahçe': 'Arsa', 'Bina': 'Ticari', 'Depo': 'Ticari' };
  function baseIlce(x) { return String(x || '').replace(/\s*\(.*\)\s*$/, '').trim(); }   // 'Konak (Rize)' → 'Konak'
  /* gerçek OZEL envanteri — tam mahalle > ilçe > il geneli sırasıyla; SADECE aktif il (çapraz-il sızıntısı yasak) */
  function ozelReal(ilce, mah) {
    if (typeof OZEL === 'undefined' || !Array.isArray(OZEL)) return { exact: [], inIlce: [], rest: [] };
    var prov = provName();
    var act = OZEL.filter(function (o) { return o.durum === 'aktif' && (o.il || 'İzmir') === prov; });
    var exact = act.filter(function (o) { return baseIlce(o.ilce) === ilce && o.mah === mah; });
    var inIlce = act.filter(function (o) { return baseIlce(o.ilce) === ilce && exact.indexOf(o) < 0; });
    var rest = act.filter(function (o) { return exact.indexOf(o) < 0 && inIlce.indexOf(o) < 0; });
    return { exact: exact, inIlce: inIlce, rest: rest };
  }
  var _OZ_CAD = ['Atatürk Cd.', 'Cumhuriyet Cd.', 'İstiklal Cd.', 'Gazi Blv.', 'Sahil Yolu', 'Fevzi Çakmak Cd.', 'İnönü Cd.', '19 Mayıs Cd.', 'Kışla Cd.'];
  /* seçili mahalle için CANLI ProX fiyatlarından temsili özel portföy türet (her mahallede içerik garanti) */
  function ozelGen(m, n) {
    var r = rng(m.ilce + '|' + m.mah + '|ozgen'), base = m.cats.daireSat.m2, kmo = m.cats.daireKira.m2, tic = m.cats.ticariSat.m2, out = [], cad = function () { return _OZ_CAD[Math.floor(r() * _OZ_CAD.length)]; };
    var m2a = 95 + Math.round(r() * 40);
    out.push({ gen: true, op: 'Satılık', tip: 'Daire', ilce: m.ilce, mah: m.mah, cadde: cad(), m2: m2a, oda: m2a > 120 ? '3+1' : '2+1', fiyat: Math.round(base * m2a * 0.88 / 50000) * 50000 });
    var m2k = 80 + Math.round(r() * 30);
    out.push({ gen: true, op: 'Kiralık', tip: 'Daire', ilce: m.ilce, mah: m.mah, cadde: cad(), m2: m2k, oda: '2+1', fiyat: Math.round(kmo * m2k * 0.9 / 500) * 500 });
    var m2t = 70 + Math.round(r() * 60);
    out.push({ gen: true, op: 'Satılık', tip: 'İşyeri', ilce: m.ilce, mah: m.mah, cadde: cad(), m2: m2t, oda: '-', fiyat: Math.round(tic * m2t * 0.85 / 50000) * 50000 });
    return out.slice(0, n || 3);
  }
  /* birleşik liste: tam-mahalle gerçek + eksiği canlı türetmeyle tamamla + çevre gerçek */
  function ozelList(m) {
    var R = ozelReal(m.ilce, m.mah), out = R.exact.slice();
    var need = Math.max(0, 3 - out.length);
    if (need) out = out.concat(ozelGen(m, need));
    R.inIlce.concat(R.rest).forEach(function (o) { if (out.length < 6) out.push(o); });
    return out.slice(0, 6);
  }

  /* ============ SOKAK ÖRNEKLERİ ============ */
  var _STR = ['Atatürk Cd.', 'Cumhuriyet Cd.', 'Kıbrıs Şehitleri Cd.', '1418. Sk.', 'Gül Sk.', 'Zafer Sk.', 'Sahil Blv.', 'İstasyon Cd.', 'Menekşe Sk.', 'Papatya Sk.', 'Lale Cd.', 'Çınar Sk.', '2. Sk.', 'Şair Eşref Blv.'];
  var _KAT = ['Giriş Kat', 'Ara Kat', 'Orta Kat', 'Orta Kat', 'Yüksek Kat', 'Çatı Dubleks'];
  var _ODA = ['1+1', '2+1', '2+1', '3+1', '3+1', '4+1'];
  function streets(mdl) {
    var r = rng(mdl.ilce + '|' + mdl.mah + '|st'), out = [], used = {}, base = mdl.cats.daireSat.m2, kmo = mdl.cats.daireKira.m2, i, n;
    for (i = 0; i < 4; i++) {
      var name; n = 0; do { name = _STR[Math.floor(r() * _STR.length)]; n++; } while (used[name] && n < 30); used[name] = 1;
      var m2 = 85 + Math.round(r() * 55), kat = _KAT[Math.floor(r() * _KAT.length)], oda = _ODA[Math.floor(r() * _ODA.length)];
      var katF = /Giriş/.test(kat) ? 0.93 : (/Yüksek|Çatı/.test(kat) ? 1.07 : 1.0);
      var sale = base * m2 * katF * (0.95 + r() * 0.12), rent = kmo * m2 * katF * (0.95 + r() * 0.12);
      out.push({ name: name, m2: m2, kat: kat, oda: oda, sale: Math.round(sale / 50000) * 50000, rent: Math.round(rent / 500) * 500 });
    }
    return out;
  }

  /* ============ RENDER ============ */
  function catCard(lab, val, unit, series, color, chgTxt, ilan, live) {
    return '<div class="me-cc">' +
      '<div class="me-cc-top"><span class="me-cc-lab">' + esc(lab) + '</span>' +
      '<span class="me-cc-dot ' + (live ? 'on' : 'off') + '" title="' + (live ? 'Canlı ProX verisi' : 'Modellenmiş tahmin') + '"></span></div>' +
      '<div class="me-cc-val">' + val + '</div><div class="me-cc-unit">' + unit + '</div>' +
      spark(series, color) +
      '<div class="me-cc-foot"><span class="me-chg up">▲ ' + chgTxt + '</span>' + (ilan ? '<span class="me-cc-ilan">' + ilan + ' ilan</span>' : '<span class="me-cc-ilan mut">endeks</span>') + '</div></div>';
  }

  function paint(m) {
    var yr = m.deltaYr && m.deltaYr > 0 ? m.deltaYr : annual(m.chg5);
    var yrTxt = '%' + yr.toFixed(1) + '<i>/yıl</i>';
    var ds = m.cats.daireSat, dk = m.cats.daireKira, ts = m.cats.ticariSat, tk = m.cats.ticariKira, ar = m.cats.arsa;
    var per90 = ds.m2 * 90, kira90 = dk.m2 * 90, R = rng(m.ilce + '|' + m.mah);
    var ser = function (end, cf) { return bzGrowthSeries(Math.max(1, end), (m.chg5 || 120) * (cf || 1), 6, rng(m.ilce + '|' + m.mah + '|' + end)); };

    /* --- başlık --- */
    var hEl = $('me_head');
    if (hEl) hEl.innerHTML =
      '<div class="me-h-l"><div class="me-h-mah">' + esc(m.mah) + ' <span>· ' + esc(m.ilce) + ' / ' + esc(provName()) + '</span></div>' +
      '<div class="me-h-big"><b>' + M(per90) + '</b><span>ortalama 90 m² daire</span></div>' +
      '<div class="me-h-meta"><span class="me-chg up big">▲ ' + yrTxt + '</span><span class="me-score">Bölge skoru <b>' + Math.round(m.score) + '</b>/100</span><span class="me-m2">~' + fmt(ds.m2) + ' ₺/m²</span></div></div>' +
      '<div class="me-h-r"><div class="me-donut" style="--v:' + Math.round(m.score) + '"><span>' + Math.round(m.score) + '</span></div><small>ProX yatırım<br>skoru</small></div>';

    /* --- ProX Değerleme (analyze) şeridi --- */
    var vEl = $('me_val'), az = m.analyze;
    if (vEl) {
      if (az && (az.min || az.max)) {
        var yonMap = { yatay: '→ Yatay seyir', yukari: '▲ Yükselen', artan: '▲ Yükselen', dusuk: '▼ Gevşeyen', azalan: '▼ Gevşeyen', dusen: '▼ Gevşeyen' };
        var bandMap = { genis: 'geniş bant', dar: 'dar bant', orta: 'orta bant' };
        var yon = yonMap[(az.yon || '').toLowerCase()] || (az.yon ? esc(az.yon) : '');
        var band = bandMap[(az.band || '').toLowerCase()] || (az.band ? esc(az.band) : '');
        vEl.hidden = false;
        vEl.innerHTML = '<span class="me-val-lab">🎯 ProX Değerleme · 90 m² daire</span>' +
          '<div class="me-val-items">' +
          '<span class="me-val-i"><small>Değer aralığı</small><b>' + M(az.min) + ' – ' + M(az.max) + '</b></span>' +
          (az.conf != null ? '<span class="me-val-i"><small>Güven</small><b>%' + az.conf + (band ? ' · ' + band : '') + '</b></span>' : '') +
          (yon ? '<span class="me-val-i"><small>Piyasa yönü</small><b>' + yon + '</b></span>' : '') +
          (az.veri ? '<span class="me-val-i"><small>Veri noktası</small><b>' + fmt(az.veri) + '</b></span>' : '') +
          '</div>';
      } else { vEl.hidden = true; vEl.innerHTML = ''; }
    }

    /* --- kategori endeksi (5 kart) --- */
    var cEl = $('me_cats');
    if (cEl) cEl.innerHTML =
      catCard('Daire · Satılık', M(per90), '90 m² · ' + fmt(ds.m2) + ' ₺/m²', ser(ds.m2), '#1e40af', yrTxt, ds.ilan, ds.live) +
      catCard('Daire · Kiralık', fmt(kira90) + ' ₺<small>/ay</small>', '90 m² · ' + fmt(dk.m2) + ' ₺/m²·ay', ser(dk.m2, 0.6), '#34a853', yrTxt, dk.ilan, dk.live) +
      catCard('İşyeri · Satılık', fmt(ts.m2) + ' ₺<small>/m²</small>', 'dükkan · ofis · vitrin', ser(ts.m2), '#0891b2', yrTxt, ts.ilan, ts.live) +
      catCard('İşyeri · Kiralık', fmt(tk.m2) + ' ₺<small>/m²·ay</small>', 'ticari kira', ser(tk.m2, 0.6), '#7c3aed', yrTxt, tk.ilan, tk.live) +
      catCard('Arsa', fmt(ar.m2) + ' ₺<small>/m²</small>', 'imarlı · yatırım', ser(ar.m2, 1.15), '#d4af37', yrTxt, ar.ilan, ar.live);

    /* --- mahalle profili (pastalar) --- */
    var dm = m.demo, pEl = $('me_profile');
    if (pEl) {
      var pie = function (t, labels, vals, colors, center) {
        return '<div class="me-pie"><div class="me-pie-t">' + t + '</div>' + donut(vals, colors, center) + legend(labels, vals, colors) + '</div>';
      };
      pEl.innerHTML =
        '<div class="me-prof-head">Mahalle profili · demografi & yaşam <em>(tahmini profil)</em></div>' +
        '<div class="me-prof-grid">' +
        pie('Yaş dağılımı', ['0–17', '18–34', '35–54', '55+'], dm.yas, BLUE) +
        pie('Eğitim', ['İlköğretim', 'Lise', 'Ön Lisans', 'Lisans', 'Lisansüstü'], dm.egitim, TEAL) +
        pie('Gelir grubu', ['Alt', 'Alt-Orta', 'Orta-Üst', 'Üst'], dm.gelir, GOLD) +
        pie('Mülk sahipliği', ['Ev sahibi', 'Kiracı'], [dm.sahiplik, 100 - dm.sahiplik], OWN, '%' + Math.round(dm.sahiplik)) +
        '</div>' +
        '<div class="me-stats">' +
        '<div class="me-stat"><span>Nüfus</span><b>' + fmt(dm.nufus) + '</b></div>' +
        '<div class="me-stat"><span>Ort. hane</span><b>' + dm.hane + ' kişi</b></div>' +
        '<div class="me-stat"><span>Ort. hane geliri</span><b>' + fmt(dm.ortGelir) + ' ₺</b></div>' +
        '<div class="me-stat"><span>Yaşam kalitesi</span><b>' + dm.yasamK + '/100</b></div>' +
        '</div>';
    }

    /* --- Özel Portföy vitrin --- */
    var oEl = $('me_ozel');
    if (oEl) {
      var list = ozelList(m);
      // "başlayan" fiyatlar: gerçek + canlı-türetilmiş Özel Portföy envanterinin tabanı, yoksa endeksten türet
      var minOf = function (pred) { var v = 0; list.forEach(function (o) { if (pred(o) && (!v || o.fiyat < v)) v = o.fiyat; }); return v; };
      var startDaire = minOf(function (o) { return o.op === 'Satılık' && TIP_CAT[o.tip] === 'Konut'; }) || Math.round(per90 * 0.72 / 50000) * 50000;
      var startKira = minOf(function (o) { return o.op === 'Kiralık' && TIP_CAT[o.tip] === 'Konut'; }) || Math.round(kira90 * 0.6 / 500) * 500;
      var startTicari = minOf(function (o) { return TIP_CAT[o.tip] === 'Ticari'; }) || Math.round(ts.m2 * 60 * 0.8 / 50000) * 50000;
      var startArsa = minOf(function (o) { return TIP_CAT[o.tip] === 'Arsa'; }) || Math.round(ar.m2 * 200 * 0.8 / 50000) * 50000;
      var chips = '<div class="me-oz-chips">' +
        '<span class="me-oz-chip">Satılık daire <b>' + M(startDaire) + '</b>’den</span>' +
        '<span class="me-oz-chip">Kiralık daire <b>' + fmt(startKira) + ' ₺</b>’den</span>' +
        '<span class="me-oz-chip">İşyeri <b>' + M(startTicari) + '</b>’den</span>' +
        '<span class="me-oz-chip">Arsa <b>' + M(startArsa) + '</b>’den</span></div>';
      var cards = list.map(function (o) {
        var money = o.op === 'Kiralık' ? (fmt(o.fiyat) + ' ₺') : M(o.fiyat);
        return '<div class="me-oz-card" role="button" tabindex="0" ' + (o.id ? 'data-oz="' + esc(o.id) + '"' : 'data-gen="1"') + '>' +/* H6: türetilmiş kartlarda id yok → data-oz="undefined" yerine data-gen; tıklama Özel Portföy sayfasına gider */
          '<div class="me-oz-op ' + (o.op === 'Kiralık' ? 'k' : 's') + '">' + esc(o.op) + '</div>' +
          '<div class="me-oz-tip">' + esc(o.tip) + '</div>' +
          '<div class="me-oz-loc">📍 ' + esc(o.mah) + ' · ' + esc(o.cadde || o.ilce) + '</div>' +
          '<div class="me-oz-tech"><span>' + o.m2 + ' m²</span>' + (o.oda && o.oda !== '-' ? '<span>' + esc(o.oda) + '</span>' : '') + '</div>' +
          '<div class="me-oz-price">' + money + '<small>’den başlayan</small></div>' +
          '<div class="me-oz-cta">🔒 Detay İste →</div></div>';
      }).join('');
      oEl.innerHTML =
        '<div class="me-oz-band"><div class="me-oz-h"><span class="me-oz-lock">🔒 Özel Portföy · ' + esc(m.mah) + '</span>' +
        '<p>Bu mahalle ve çevresinde <b>açık ilana koymadan</b> sattığımız/kiraladığımız, size özel mülkler. Aşağıdaki fiyatlardan başlar:</p></div>' +
        chips + '<div class="me-oz-grid">' + cards + '</div>' +
        '<button class="me-oz-all" onclick="goView(\'ozel\')">Tüm Özel Portföyü Gör →</button></div>';
    }

    /* --- cadde/sokak örnekleri --- */
    var st = streets(m), sEl = $('me_streets');
    if (sEl) sEl.innerHTML = st.map(function (s) {
      return '<div class="me-st">' +
        '<div class="me-st-name">📍 ' + esc(m.mah) + ' · <b>' + esc(s.name) + '</b></div>' +
        '<div class="me-st-tech"><span>' + s.m2 + ' m²</span><span>' + esc(s.oda) + '</span><span>' + esc(s.kat) + '</span></div>' +
        '<div class="me-st-prices"><span class="me-pr sale">Satılık <b>' + M(s.sale) + '</b>’den</span>' +
        '<span class="me-pr rent">Kiralık <b>' + fmt(s.rent) + ' ₺</b>’den</span></div>' +
        '<button class="me-st-cta" onclick="goView(\'ozel\')">Özel Portföy →</button></div>';
    }).join('');

    /* --- canlı rozet --- */
    var lv = $('me_live');
    if (lv) {
      if (m.source === 'live') lv.innerHTML = '<span class="dot"></span> Canlı ProX endeksi · ' + (m.ilanTot || 0) + ' ilan taranıyor' + (m.period ? ' · ' + periodTR(m.period) : '');
      else lv.innerHTML = '<span class="dot load"></span> ProX endeksi bağlanıyor…';
    }
  }

  function render() {
    if (typeof bzMahalle !== 'function' || !_il || !_mh) return;
    var my = ++_req;
    paint(localModel(_il, _mh));                       // anında yerel dolum (flash yok)
    if (typeof proxApi !== 'function') return;
    liveModel(_il, _mh).then(function (m) { if (my === _req) paint(m); }).catch(function () {});
  }

  /* SERVICE_AREA farkındalığı: admin ekle-çıkart yaptıysa yalnız hizmet verilen ilçe/mahalle */
  function servedMah(ilce) {
    var sm = (typeof saServedMahalle === 'function') ? saServedMahalle(provName(), ilce) : null;
    if (sm && sm.length) return sm;
    return (PROVINCE.districts[ilce] && PROVINCE.districts[ilce].mah) || [];
  }
  function servedIlceKeys() {
    var all = Object.keys(PROVINCE.districts);
    var si = (typeof saServedIlce === 'function') ? saServedIlce(provName()) : null;
    var keys = (si && si.length) ? si.filter(function (k) { return PROVINCE.districts[k]; }) : all.slice();
    if (!keys.length) keys = all.slice();
    return keys.sort(function (a, b) { return ((PROVINCE.districts[b] || {}).m2 || 0) - ((PROVINCE.districts[a] || {}).m2 || 0); });
  }
  function fillMah() {
    var mh = $('me_mah'); if (!mh) return;
    var list = servedMah(_il);
    mh.innerHTML = list.slice(0, 30).map(function (mm) { return '<option>' + esc(mm) + '</option>'; }).join('');
    _mh = mh.value || list[0] || '';
  }
  function boot() {
    var ic = $('me_ilce'); if (!ic || typeof PROVINCE === 'undefined' || !PROVINCE || !PROVINCE.districts) return;
    var keys = servedIlceKeys();
    /* M11: boot birden çok kez çağrılıyor (DOMContentLoaded + load + her renderOzHome). Seçim listesini
       yalnızca ilçe kümesi GERÇEKTEN değiştiyse (ilk kurulum / il değişimi) yeniden kur → kullanıcı seçimini ezme. */
    var cur = Array.prototype.map.call(ic.options, function (o) { return o.value; }).join('|');
    if (cur !== keys.join('|')) {
      ic.innerHTML = keys.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('');
      _il = ic.value || keys[0] || '';
      fillMah();
    }
    render();
  }
  function onIlce() { var ic = $('me_ilce'); if (ic) { _il = ic.value; fillMah(); render(); } }
  function onMah() { var mh = $('me_mah'); if (mh) { _mh = mh.value; render(); } }

  /* Özel Portföy kartına tıkla → Detay İste (ifşasız) */
  document.addEventListener('click', function (e) {
    var c = e.target.closest && e.target.closest('.me-oz-card'); if (!c) return;
    var id = c.getAttribute('data-oz'); if (id && id !== 'undefined' && typeof ozLead === 'function') ozLead(id);
    else if (typeof goView === 'function') goView('ozel');
  });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    var c = e.target.closest && e.target.closest('.me-oz-card'); if (!c) return; e.preventDefault();
    var id = c.getAttribute('data-oz'); if (id && id !== 'undefined' && typeof ozLead === 'function') ozLead(id);
    else if (typeof goView === 'function') goView('ozel');
  });

  window.mahEndeksBoot = boot; window.mahEndeksIlce = onIlce; window.mahEndeksRender = onMah;
  var _orig = window.renderOzHome;
  window.renderOzHome = function () { try { if (_orig) _orig.apply(this, arguments); } catch (e) {} try { boot(); } catch (e) {} };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 80); });
  else setTimeout(boot, 80);
  window.addEventListener('load', function () { setTimeout(boot, 160); });
})();
