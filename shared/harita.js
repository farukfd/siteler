/* ============================================================================
   GMHarita — GERÇEK harita (Leaflet) üzerinde portföy: satılık/kiralık İLAN +
   🔒 ÖZEL PORTFÖY. Uydu/Harita katman değiştirici, görselli modern kart-popup,
   fiyat-baloncuğu marker, filtre + senkron kenar liste.
   Konumlar ilçe/mahalle-merkez YAKLAŞIK (geocode yok; tam adres gizli).
   Kullanım: GMHarita.build({ mapEl, listEl?, filterEl?, countEl?, data:{ilanlar,ozel}, full }).
   ========================================================================== */
(function () {
  'use strict';

  var DIST = {
    'konak': [38.4137, 27.1287], 'karşıyaka': [38.4589, 27.1094], 'bornova': [38.4697, 27.2170],
    'buca': [38.3860, 27.1790], 'çeşme': [38.3236, 26.3050], 'urla': [38.3226, 26.7690],
    'gaziemir': [38.3190, 27.1030], 'menderes': [38.2540, 27.1350], 'çiğli': [38.4970, 27.0670],
    'karaburun': [38.6380, 26.5120], 'bayraklı': [38.4620, 27.1670], 'balçova': [38.3880, 27.0560],
    'narlıdere': [38.3980, 27.0100], 'güzelbahçe': [38.3670, 26.8830], 'torbalı': [38.1560, 27.3600],
    'seferihisar': [38.1960, 26.8390], 'foça': [38.6690, 26.7580], 'aliağa': [38.7990, 26.9720]
  };
  var MAH = {
    'alsancak': [38.4370, 27.1430], 'göztepe': [38.4030, 27.1050], 'mavişehir': [38.4880, 27.0840],
    'bostanlı': [38.4720, 27.0960], 'kazımdirik': [38.4585, 27.2100], 'erzene': [38.4560, 27.2050],
    'atıfbey': [38.3200, 27.1100], 'alaçatı': [38.2790, 26.3720], 'zeytinalanı': [38.3550, 26.7900],
    'şirinyer': [38.3900, 27.1600], 'mordoğan': [38.5860, 26.4720], 'gümüldür': [38.0680, 27.0350],
    'bademler': [38.3700, 26.8800], 'ataşehir': [38.4900, 27.0500]
  };
  /* 81 il merkezi (yaklaşık, ~4 ondalık) — İzmir-DIŞI tenant illerinde harita bu merkez etrafında
     kurulur. İzmir yolu (DIST/MAH) bu tablodan bağımsız çalışmaya devam eder — regresyon yok. */
  var TR_IL_MERKEZ = {
    'Adana': [37.0000, 35.3213], 'Adıyaman': [37.7648, 38.2786], 'Afyonkarahisar': [38.7507, 30.5567],
    'Ağrı': [39.7191, 43.0503], 'Amasya': [40.6499, 35.8353], 'Ankara': [39.9334, 32.8597],
    'Antalya': [36.8969, 30.7133], 'Artvin': [41.1828, 41.8183], 'Aydın': [37.8560, 27.8416],
    'Balıkesir': [39.6484, 27.8826], 'Bilecik': [40.1506, 29.9792], 'Bingöl': [38.8853, 40.4980],
    'Bitlis': [38.3938, 42.1232], 'Bolu': [40.7392, 31.6089], 'Burdur': [37.7203, 30.2908],
    'Bursa': [40.1826, 29.0665], 'Çanakkale': [40.1553, 26.4142], 'Çankırı': [40.6013, 33.6134],
    'Çorum': [40.5506, 34.9556], 'Denizli': [37.7765, 29.0864], 'Diyarbakır': [37.9144, 40.2306],
    'Edirne': [41.6771, 26.5557], 'Elazığ': [38.6810, 39.2264], 'Erzincan': [39.7500, 39.5000],
    'Erzurum': [39.9000, 41.2700], 'Eskişehir': [39.7767, 30.5206], 'Gaziantep': [37.0662, 37.3833],
    'Giresun': [40.9128, 38.3895], 'Gümüşhane': [40.4386, 39.5086], 'Hakkari': [37.5744, 43.7408],
    'Hatay': [36.2023, 36.1613], 'Isparta': [37.7648, 30.5566], 'Mersin': [36.8121, 34.6415],
    'İstanbul': [41.0082, 28.9784], 'İzmir': [38.4237, 27.1428], 'Kars': [40.6013, 43.0975],
    'Kastamonu': [41.3887, 33.7827], 'Kayseri': [38.7312, 35.4787], 'Kırklareli': [41.7333, 27.2167],
    'Kırşehir': [39.1425, 34.1709], 'Kocaeli': [40.8533, 29.8815], 'Konya': [37.8746, 32.4932],
    'Kütahya': [39.4242, 29.9833], 'Malatya': [38.3552, 38.3095], 'Manisa': [38.6191, 27.4289],
    'Kahramanmaraş': [37.5753, 36.9228], 'Mardin': [37.3212, 40.7245], 'Muğla': [37.2153, 28.3636],
    'Muş': [38.9462, 41.7539], 'Nevşehir': [38.6939, 34.6857], 'Niğde': [37.9667, 34.6833],
    'Ordu': [40.9839, 37.8764], 'Rize': [41.0201, 40.5234], 'Sakarya': [40.6940, 30.4358],
    'Samsun': [41.2867, 36.3300], 'Siirt': [37.9333, 41.9500], 'Sinop': [42.0231, 35.1531],
    'Sivas': [39.7477, 37.0179], 'Tekirdağ': [40.9833, 27.5167], 'Tokat': [40.3167, 36.5500],
    'Trabzon': [41.0027, 39.7168], 'Tunceli': [39.3074, 39.4388], 'Şanlıurfa': [37.1591, 38.7969],
    'Uşak': [38.6823, 29.4082], 'Van': [38.4891, 43.4089], 'Yozgat': [39.8181, 34.8147],
    'Zonguldak': [41.4564, 31.7987], 'Aksaray': [38.3687, 34.0360], 'Bayburt': [40.2552, 40.2249],
    'Karaman': [37.1759, 33.2287], 'Kırıkkale': [39.8468, 33.5153], 'Batman': [37.8812, 41.1351],
    'Şırnak': [37.4187, 42.4918], 'Bartın': [41.6344, 32.3375], 'Ardahan': [41.1105, 42.7022],
    'Iğdır': [39.9167, 44.0333], 'Yalova': [40.6500, 29.2667], 'Karabük': [41.2061, 32.6204],
    'Kilis': [36.7184, 37.1212], 'Osmaniye': [37.0742, 36.2478], 'Düzce': [40.8438, 31.1565]
  };
  /* gayrimenkul görsel anahtarları → dosya (js/app.js IMG ile birebir; yol sayfaya göreli) */
  var IMGMAP = { l1: 'img4', l2: 'img5', l3: 'img6', l4: 'img7', l5: 'img8', l6: 'img9', bolge: 'img10', pano: 'img16', hero2: 'img2', hero3: 'img3' };

  function norm(s) { return String(s == null ? '' : s).trim().toLowerCase(); }
  function hash(s) { var h = 0, x = String(s || ''); for (var i = 0; i < x.length; i++) { h = (h * 31 + x.charCodeAt(i)) | 0; } return h; }
  /* İzmir-dışı il: ilçe adından DETERMİNİSTİK sabit ofset (il merkezi çevresinde ~2.5-6km yayılım) —
     aynı ilçe adı her zaman aynı yöne/uzaklığa düşer. */
  function districtOffset(ilce) {
    var h = hash('d2|' + norm(ilce));
    var ang = ((h >>> 0) % 6283) / 1000; /* 0..~2π */
    var rad = 0.022 + (((h >>> 6) % 1000) / 1000) * 0.038; /* ~0.022–0.06° (≈2.5–6.5km) */
    return [Math.sin(ang) * rad, Math.cos(ang) * rad];
  }
  function provinceCenter(province) {
    return TR_IL_MERKEZ[String(province || '').trim()] || TR_IL_MERKEZ['İzmir'];
  }
  function coord(ilce, mah, id, province) {
    var prov = String(province || '').trim();
    var isIzmir = !prov || prov === 'İzmir';
    var h = hash((id || '') + '|' + mah + '|' + ilce);
    var jx = ((h % 1000) / 1000 - 0.5) * 0.008;
    var jy = (((h >> 10) % 1000) / 1000 - 0.5) * 0.008;
    if (isIzmir) {
      var base = MAH[norm(mah)] || DIST[norm(ilce)] || [38.4210, 27.1380];
      return [base[0] + jy, base[1] + jx];
    }
    var center = provinceCenter(prov), off = districtOffset(ilce);
    return [center[0] + off[0] + jy, center[1] + off[1] + jx];
  }
  function money(n) { try { return (typeof window.gmMoney === 'function') ? window.gmMoney(n) : (n >= 1e6 ? (n / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 1 }) + 'M ₺' : (+n).toLocaleString('tr-TR') + ' ₺'); } catch (e) { return n + ' ₺'; } }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function waHref(t) { try { return (typeof window.waHref === 'function') ? window.waHref(t) : ('https://wa.me/?text=' + encodeURIComponent(t)); } catch (e) { return '#'; } }
  function resolveImg(r) {
    if (!r || !r.img) return '';
    if (/^(https?:|data:|\.?\.?\/)/.test(r.img) || /\.(webp|jpg|jpeg|png)$/i.test(r.img)) {
      if (window.imgSrc && !/\//.test(r.img)) { try { return window.imgSrc(r.img); } catch (e) {} }
      return r.img;
    }
    if (window.imgSrc) { try { return window.imgSrc(r.img); } catch (e) {} }
    return IMGMAP[r.img] ? ('img/gayrimenkul/' + IMGMAP[r.img] + '.webp') : '';
  }

  function normItems(data) {
    var out = [];
    (data && data.ilanlar || []).forEach(function (r) {
      if (r.status && r.status !== 'aktif') return;
      out.push({ kind: r.op === 'Kiralık' ? 'kir' : 'sat', op: r.op || 'Satılık', tip: r.type || r.tip || 'İlan',
        ilce: r.ilce || '', mah: r.mah || '', m2: +r.m2 || 0, oda: r.oda || '', kat: r.kat || '', price: +r.price || +r.fiyat || 0,
        title: r.title || (r.type || 'İlan'), img: resolveImg(r), id: 'i' + (r.id != null ? r.id : hash(r.title)), ozel: false });
    });
    (data && data.ozel || []).forEach(function (o) {
      if (o.durum && o.durum !== 'aktif') return;
      out.push({ kind: 'oz', op: o.op || 'Satılık', tip: o.tip || 'Mülk', ilce: o.ilce || '', mah: o.mah || '',
        m2: +o.m2 || 0, oda: o.oda || '', kat: '', price: +o.fiyat || 0, title: (o.tip || 'Mülk') + ' · ' + (o.mah || ''),
        img: '', id: 'o' + (o.id != null ? o.id : hash(o.mah + o.tip)), ozel: true });
    });
    return out;
  }

  function bubbleIcon(it, sel) {
    var lbl = it.ozel ? '🔒' : money(it.price).replace(' ₺', '').replace('/ay', '');
    return window.L.divIcon({ className: 'gm-mk gm-mk-' + it.kind + (sel ? ' sel' : ''), html: '<span class="gm-mk-b">' + esc(lbl) + '</span>', iconSize: null, iconAnchor: [0, 0] });
  }

  function featRow(it) {
    var f = [];
    if (it.m2) f.push('<span><b>' + it.m2 + '</b> m²</span>');
    if (it.oda && it.oda !== '-') f.push('<span>' + esc(it.oda) + '</span>');
    if (it.kat && it.kat !== '-') f.push('<span>Kat ' + esc(it.kat) + '</span>');
    return f.length ? '<div class="gm-card-feat">' + f.join('') + '</div>' : '';
  }
  function popupHTML(it) {
    var loc = [it.mah, it.ilce].filter(Boolean).join(' / ');
    if (it.ozel) {
      var wa = waHref('Merhaba, Özel Portföy — ' + it.tip + ' ' + loc + ' (' + money(it.price) + ') hakkında bilgi almak istiyorum.');
      return '<article class="gm-card oz">' +
        '<div class="gm-card-img locked"><span class="gm-lock"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg></span><span class="gm-lock-tx">Özel Portföy</span><span class="gm-card-op oz">' + esc(it.op) + '</span></div>' +
        '<div class="gm-card-b">' +
          '<h4 class="gm-card-t">' + esc(it.tip) + ' · ' + esc(it.mah || it.ilce) + '</h4>' +
          '<div class="gm-card-loc">📍 ' + esc(it.ilce) + ' <span class="gm-approx">(yaklaşık)</span></div>' +
          featRow(it) +
          '<div class="gm-card-p">' + money(it.price) + (it.op === 'Kiralık' ? '<small>/ay</small>' : '') + ' <small>başlangıç</small></div>' +
          '<div class="gm-card-note">Tam adres mahremiyet gereği paylaşılmaz.</div>' +
          '<div class="gm-card-act"><a class="gm-card-btn primary" href="' + wa + '" target="_blank" rel="noopener noreferrer">Detay iste</a></div>' +
        '</div></article>';
    }
    var img = it.img ? ('<div class="gm-card-img" style="background-image:url(' + esc(it.img) + ')">') : ('<div class="gm-card-img noimg">');
    var wa2 = waHref('Merhaba, ' + it.title + ' (' + loc + ' · ' + money(it.price) + ') ilanı hakkında bilgi almak istiyorum.');
    return '<article class="gm-card">' +
      img + '<span class="gm-card-op ' + it.kind + '">' + esc(it.op) + '</span></div>' +
      '<div class="gm-card-b">' +
        '<h4 class="gm-card-t">' + esc(it.title) + '</h4>' +
        '<div class="gm-card-loc">📍 ' + esc(loc) + '</div>' +
        featRow(it) +
        '<div class="gm-card-p">' + money(it.price) + (it.op === 'Kiralık' ? '<small>/ay</small>' : '') + '</div>' +
        '<div class="gm-card-act"><a class="gm-card-btn primary" href="ilanlar.html">İncele</a>' +
          '<a class="gm-card-btn wa" href="' + wa2 + '" target="_blank" rel="noopener noreferrer">WhatsApp</a></div>' +
      '</div></article>';
  }

  /* FAZ3C: HARİCİ İÇERİK İKİ AŞAMALI ONAYI — OpenStreetMap karoları (üçüncü taraf istek)
     ziyaretçi açıkça onaylamadan YÜKLENMEZ; tercih ui_map_ok'ta hatırlanır (zararsız-tercih). */
  function _mapOnayVar(){try{return localStorage.getItem('ui_map_ok')==='1';}catch(e){return false;}}
  function build(opts) {
    if(!_mapOnayVar()){
      var el0=typeof opts.mapEl==='string'?(document.getElementById(opts.mapEl)||document.querySelector(opts.mapEl)):opts.mapEl;
      if(el0&&!el0._gmGate){
        el0._gmGate=1;
        el0.innerHTML='<div class="gm-map-gate" style="display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;height:100%;min-height:220px;padding:22px;text-align:center;background:var(--surface,#f4f6f8);border-radius:inherit">'
          +'<p style="margin:0;font-size:.8125rem;opacity:.8;max-width:420px">Harita, OpenStreetMap karolarını üçüncü taraf sunucudan yükler. Konum verisi yaklaşık bölge merkezidir; tam adres paylaşılmaz.</p>'
          +'<button type="button" style="border:0;border-radius:10px;padding:10px 18px;font-weight:700;cursor:pointer;background:var(--accent,#0e7c86);color:#fff">🗺️ Haritayı yükle (OpenStreetMap)</button></div>';
        var btn=el0.querySelector('button');
        if(btn)btn.addEventListener('click',function(){try{localStorage.setItem('ui_map_ok','1');}catch(e){}el0._gmGate=0;el0.innerHTML='';build(opts);});
      }
      return null;
    }
    return _buildIc(opts);
  }
  function _buildIc(opts) {
    opts = opts || {};
    var el = typeof opts.mapEl === 'string' ? document.getElementById(opts.mapEl) : opts.mapEl;
    if (!el) return null;
    if (!window.L) { el.innerHTML = '<div class="gm-map-fb">Harita yüklenemedi — internet bağlantısını kontrol edin.</div>'; return null; }
    if (el._gmMap) { try { el._gmMap.remove(); } catch (e) {} el._gmMap = null; }

    var items = normItems(opts.data || {});
    var province = opts.province || '';
    var isIzmir = !province || String(province).trim() === 'İzmir';
    var initCenter = isIzmir ? [38.42, 27.13] : provinceCenter(province);
    var map = window.L.map(el, {
      center: initCenter, zoom: opts.full ? 11 : 10, scrollWheelZoom: !!opts.full,
      zoomControl: opts.full !== false, attributionControl: true
    });
    el._gmMap = map;

    /* ── temel katmanlar: Harita (Voyager) ↔ Uydu (Esri World Imagery + etiket) ── */
    var R = (window.L.Browser && window.L.Browser.retina) ? '@2x' : '';
    var baseStreets = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' + R + '.png', {
      maxZoom: 20, subdomains: 'abcd', attribution: '© OpenStreetMap · © CARTO'
    });
    var baseSat = window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19, attribution: 'Görüntü © Esri, Maxar, Earthstar Geographics'
    });
    var satLabels = window.L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}' + R + '.png', {
      maxZoom: 20, subdomains: 'abcd', opacity: 0.9
    });
    baseStreets.addTo(map);
    function setBase(kind) {
      if (kind === 'sat') { if (map.hasLayer(baseStreets)) map.removeLayer(baseStreets); baseSat.addTo(map); satLabels.addTo(map); el.classList.add('gm-sat'); }
      else { if (map.hasLayer(baseSat)) map.removeLayer(baseSat); if (map.hasLayer(satLabels)) map.removeLayer(satLabels); baseStreets.addTo(map); el.classList.remove('gm-sat'); }
    }
    var BaseCtl = window.L.Control.extend({
      options: { position: 'topright' },
      onAdd: function () {
        var d = window.L.DomUtil.create('div', 'gm-basectl');
        d.innerHTML = '<button type="button" data-b="streets" class="on">🗺️ Harita</button><button type="button" data-b="sat">🛰️ Uydu</button>';
        window.L.DomEvent.disableClickPropagation(d);
        d.addEventListener('click', function (e) { var b = e.target.closest('button'); if (!b) return; setBase(b.getAttribute('data-b')); [].forEach.call(d.querySelectorAll('button'), function (x) { x.classList.toggle('on', x === b); }); });
        return d;
      }
    });
    map.addControl(new BaseCtl());

    var layer = window.L.layerGroup().addTo(map);
    var byId = {}, lastPts = [], filt = { op: '', tip: '', ilce: '' };

    function pass(it) {
      if (filt.op === 'oz') { if (!it.ozel) return false; }
      else if (filt.op && it.op !== filt.op) return false;
      if (filt.tip && it.tip !== filt.tip) return false;
      if (filt.ilce && it.ilce !== filt.ilce) return false;
      return true;
    }
    function render() {
      layer.clearLayers(); byId = {};
      var shown = items.filter(pass), pts = [];
      shown.forEach(function (it) {
        var ll = coord(it.ilce, it.mah, it.id, province);
        var mk = window.L.marker(ll, { icon: bubbleIcon(it), riseOnHover: true, keyboard: false });
        mk._it = it;
        mk.bindPopup(popupHTML(it), { className: 'gm-pop-wrap', maxWidth: 288, minWidth: 244, closeButton: true, autoPanPadding: [30, 30] });
        mk.on('popupopen', function () { mk.setIcon(bubbleIcon(it, true)); });
        mk.on('popupclose', function () { mk.setIcon(bubbleIcon(it, false)); });
        mk.addTo(layer); byId[it.id] = mk; pts.push(ll);
      });
      lastPts = pts;
      if (pts.length) { try { map.fitBounds(pts, { padding: [46, 46], maxZoom: opts.full ? 13 : 11 }); } catch (e) {} }
      if (opts.countEl) { var ce = document.getElementById(opts.countEl); if (ce) ce.textContent = shown.length + ' konum'; }
      if (opts.listEl) renderList(shown);
      return shown;
    }
    function renderList(shown) {
      var lb = document.getElementById(opts.listEl); if (!lb) return;
      if (!shown.length) { lb.innerHTML = '<p class="gm-map-empty">Seçilen filtrede konum yok.</p>'; return; }
      lb.innerHTML = shown.map(function (it) {
        var loc = [it.mah, it.ilce].filter(Boolean).join(' / ');
        var thumb = it.ozel ? '<span class="gm-ml-th oz">🔒</span>' : (it.img ? '<span class="gm-ml-th" style="background-image:url(' + esc(it.img) + ')"></span>' : '<span class="gm-ml-th noimg"></span>');
        return '<button type="button" class="gm-ml-row' + (it.ozel ? ' oz' : '') + '" data-id="' + it.id + '">' + thumb +
          '<span class="gm-ml-t">' + esc(it.title) + '<i>' + esc(loc) + (it.m2 ? ' · ' + it.m2 + ' m²' : '') + '</i></span>' +
          '<span class="gm-ml-p num">' + money(it.price) + (it.op === 'Kiralık' ? '<small>/ay</small>' : '') + '</span></button>';
      }).join('');
      [].forEach.call(lb.querySelectorAll('.gm-ml-row'), function (b) {
        b.addEventListener('click', function () {
          var mk = byId[b.getAttribute('data-id')]; if (!mk) return;
          map.setView(mk.getLatLng(), Math.max(map.getZoom(), 14), { animate: true });
          mk.openPopup();
          [].forEach.call(lb.querySelectorAll('.gm-ml-row'), function (x) { x.classList.toggle('act', x === b); });
        });
      });
    }

    if (opts.filterEl) {
      var fbox = document.getElementById(opts.filterEl);
      if (fbox) {
        fbox.addEventListener('click', function (e) {
          var b = e.target.closest('[data-fop]'); if (!b) return;
          filt.op = b.getAttribute('data-fop');
          [].forEach.call(fbox.querySelectorAll('[data-fop]'), function (x) { x.classList.toggle('on', x === b); });
          render();
        });
        var tsel = fbox.querySelector('[data-ftip]'); if (tsel) tsel.addEventListener('change', function () { filt.tip = tsel.value; render(); });
        var isel = fbox.querySelector('[data-filce]');
        if (isel) {
          var ilces = {}; items.forEach(function (it) { if (it.ilce) ilces[it.ilce] = 1; });
          isel.innerHTML = '<option value="">Tüm ilçeler</option>' + Object.keys(ilces).sort().map(function (i) { return '<option>' + esc(i) + '</option>'; }).join('');
          isel.addEventListener('change', function () { filt.ilce = isel.value; render(); });
        }
      }
    }

    render();
    function refit() { try { map.invalidateSize(); if (lastPts.length) map.fitBounds(lastPts, { padding: [46, 46], maxZoom: opts.full ? 13 : 11 }); } catch (e) {} }
    setTimeout(refit, 180);
    if (window.ResizeObserver) {
      var lastW = 0, rot = null;
      var ro = new window.ResizeObserver(function () { var w = el.clientWidth; if (w > 40 && Math.abs(w - lastW) > 8) { lastW = w; clearTimeout(rot); rot = setTimeout(refit, 90); } });
      try { ro.observe(el); } catch (e) {}
    }
    var api = { map: map, refresh: render, setBase: setBase, setData: function (d) { items = normItems(d); render(); } };
    el._gmApi = api;
    return api;
  }

  window.GMHarita = { build: build, coord: coord };
})();
