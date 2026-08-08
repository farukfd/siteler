/* ============================================================================
   KURUMSAL / ALT MENÜ TAM SAYFALARI — İletişim · Danışmanlar · Değerleme ·
   Referanslar · Fiyat Alarmı · KVKK · Çerez · Mesafeli Hizmet
   Tek overlay (#infoPage) + konu yönlendirici. app.js'ten SONRA yüklenir.
   Global (bare) bağımlılık: FIRMA, DANISMANLAR, REFS, PROVINCE, bzMahalle, ozTF,
   legalDoc, pushLead, proxSubmitLead, mountSiteChrome, brandSweep, setOverlayPage,
   _OV, _ovCloseDom, _OV_HM, IMG.
   ========================================================================== */
(function () {
  'use strict';
  function $(id) { return document.getElementById(id); }
  function esc(x) { return String(x == null ? '' : x).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(n) { try { return Math.round(n).toLocaleString('tr-TR'); } catch (e) { return '' + n; } }
  function money(n) { if (!isFinite(n) || !n) return '—'; if (n >= 1e6) return (n / 1e6).toLocaleString('tr-TR', { maximumFractionDigits: 2 }) + 'M ₺'; return fmt(n) + ' ₺'; }
  function F() { return (typeof FIRMA === 'object' && FIRMA) || {}; }
  function toasty(m) { try { if (typeof toast === 'function') return toast(m); } catch (e) {} alert(m); }

  var TITLES = {
    iletisim: 'İletişim', danismanlar: 'Danışman Kadromuz', degerleme: 'Emlak Ekspertizi',
    referans: 'Referanslar', alarm: 'Fiyat Alarmı', kvkk: 'KVKK Aydınlatma Metni',
    cerez: 'Çerez Politikası', mesafeli: 'Mesafeli Hizmet & Kullanım'
  };

  /* ---------- overlay iskeleti (tek sefer enjekte) ---------- */
  function ensurePage() {
    if ($('infoPage')) return;
    var d = document.createElement('div');
    d.innerHTML =
      '<div class="br-page oz-page info-page" id="infoPage" role="dialog" aria-label="Kurumsal">' +
      '<div class="br-hd oz-hd">' +
      '<a class="logo" href="#" onclick="closeAllOverlays();return false"><span class="mark">M</span><span class="js-logo">Meridyen<span class="lo2"> Gayrimenkul</span></span></a>' +
      '<nav class="main siteNav"></nav><div class="nav-cta siteCta"></div></div>' +
      '<div class="br-scroll" id="infoScroll">' +
      '<section class="br-hero2 info-hero" style="min-height:auto"><div class="br-hero-bg"></div><div class="grid-motif"></div>' +
      '<div class="in"><div class="eyebrow" id="info_eye" style="display:block;margin-bottom:10px">Kurumsal</div>' +
      '<h1 id="info_title" style="font-family:var(--head);font-size:clamp(28px,5vw,50px);line-height:1.06;margin-bottom:12px">—</h1>' +
      '<p id="info_lead" style="max-width:680px;color:var(--muted);font-size:16.5px;line-height:1.6"></p></div></section>' +
      '<div class="wrap hk-wrap" id="infoBody"></div>' +
      '<footer class="siteFooter"></footer></div></div>';
    document.body.appendChild(d.firstChild);
  }

  /* Ofis haritası: adresten geocode (Nominatim) → #gmOfisMap taşı + FIRMA.lat/lng cache.
     Nominatim serbest-metni sevmez → normalize + aşamalı sorgu (tam → ilçe,il → il). */
  function _gmGeoMap(adres) {
    var fr = document.getElementById('gmOfisMap'); if (!fr || !adres) return;
    var norm = String(adres).replace(/No[:.]?\s*\d+\w*/gi, '').replace(/\bKat\b[^,]*/gi, '').replace(/\bD[:.]?\s*\d+/gi, '')
      .replace(/\bCad\.?\b/gi, 'Caddesi').replace(/\bCd\.?\b/gi, 'Caddesi').replace(/\bMah\.?\b/gi, 'Mahallesi').replace(/\bMh\.?\b/gi, 'Mahallesi')
      .replace(/\bSok\.?\b/gi, 'Sokak').replace(/\bSk\.?\b/gi, 'Sokak').replace(/\bBul(v)?\.?\b/gi, 'Bulvarı').replace(/\bBlv\.?\b/gi, 'Bulvarı')
      .replace(/[\/]/g, ',').replace(/\s+/g, ' ').replace(/\s*,\s*/g, ', ').replace(/(,\s*)+/g, ', ').replace(/^[,\s]+|[,\s]+$/g, '').trim();
    var parts = norm.split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    var cands = []; if (norm) cands.push(norm); if (parts.length >= 2) cands.push(parts.slice(-2).join(', ')); if (parts.length >= 1) cands.push(parts[parts.length - 1]);
    var apply = function (lat, lng) {
      lat = +lat; lng = +lng; if (isNaN(lat) || isNaN(lng)) return;
      var bb = (lng - 0.012) + ',' + (lat - 0.008) + ',' + (lng + 0.012) + ',' + (lat + 0.008);
      fr.setAttribute('src', 'https://www.openstreetmap.org/export/embed.html?bbox=' + encodeURIComponent(bb) + '&layer=mapnik&marker=' + lat + ',' + lng);
      var lk = document.getElementById('gmOfisMapLink'); if (lk) lk.href = 'https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng + '#map=16/' + lat + '/' + lng;
      try { if (typeof FIRMA !== 'undefined' && FIRMA) { FIRMA.lat = lat; FIRMA.lng = lng; if (typeof saveAll === 'function') saveAll(); } } catch (e) {}
    };
    var tryNext = function (i) {
      if (i >= cands.length) return;
      try {
        fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=tr&accept-language=tr&q=' + encodeURIComponent(cands[i]))
          .then(function (r) { return r.ok ? r.json() : []; })
          .then(function (a) { if (a && a[0] && a[0].lat && a[0].lon) apply(a[0].lat, a[0].lon); else tryNext(i + 1); })
          ['catch'](function () { tryNext(i + 1); });
      } catch (e) {}
    };
    tryNext(0);
  }

  /* ---------- İLETİŞİM ---------- */
  function renderIletisim() {
    var f = F(), e = f.eids || {};
    var cc = '<div class="hk-contact">' +
      '<a class="hk-cc" href="tel:' + esc(f.tel || '') + '"><div class="ic">📞</div><div><b>Telefon</b><span>' + esc(f.tel || '—') + '</span></div></a>' +
      '<a class="hk-cc" href="mailto:' + esc(f.mail || '') + '"><div class="ic">✉️</div><div><b>E-posta</b><span>' + esc(f.mail || '—') + '</span></div></a>' +
      '<a class="hk-cc" href="https://wa.me/' + esc(f.wa || '') + '" target="_blank" rel="noopener noreferrer"><div class="ic">💬</div><div><b>WhatsApp</b><span>Hızlı yanıt hattı</span></div></a>' +
      '<div class="hk-cc"><div class="ic">🕑</div><div><b>Çalışma Saatleri</b><span>' + esc(f.hours || '—') + '</span></div></div></div>';
    var form = '<div class="info-form"><h3>Bize yazın</h3><p class="info-form-sub">Formu doldurun, uzman danışmanımız en kısa sürede size dönsün.</p>' +
      '<div class="if-grid"><input id="if_ad" placeholder="Adınız Soyadınız"><input id="if_tel" placeholder="Telefonunuz"><input id="if_mail" placeholder="E-posta (opsiyonel)">' +
      '<select id="if_konu"><option>Genel bilgi</option><option>Satılık ilan</option><option>Kiralık ilan</option><option>Mülkümü satmak/kiralamak</option><option>Emlak Ekspertizi talebi</option><option>Özel Portföy</option></select></div>' +
      '<textarea id="if_msg" rows="4" placeholder="Mesajınız…"></textarea>' +
      '<label class="if-kvkk"><input type="checkbox" id="if_kvkk"> <span><a href="#" onclick="goView(\'kvkk\');return false">KVKK Aydınlatma Metni</a>\'ni okudum, iletişim için onaylıyorum.</span></label>' +
      '<button class="btn btn-primary" onclick="infoContactSubmit()">Mesajı Gönder →</button></div>';
    var kunye = '<div class="info-mini-kunye"><span>' + esc(e.unvan || f.name || '') + '</span>' +
      (e.belgeNo ? '<span>Taşınmaz Ticareti Yetki Belge No: <b>' + esc(e.belgeNo) + '</b></span>' : '') +
      '<span>📍 ' + esc(f.adres || '') + '</span></div>';
    var lat = +f.lat || 38.4322, lng = +f.lng || 27.1419;
    var bbox = (lng - 0.012) + ',' + (lat - 0.008) + ',' + (lng + 0.012) + ',' + (lat + 0.008);
    /* koordinat yok ama adres varsa → render sonrası adresten geocode ile haritayı taşı (demo İzmir'e düşmesin) */
    var needGeo = !(+f.lat && +f.lng) && !!(f.adres && ('' + f.adres).trim());
    if (needGeo) { try { setTimeout(function () { _gmGeoMap(f.adres); }, 60); } catch (e) {} }
    var mapSec = '<section class="hk-block"><div class="hk-h"><span class="hk-kick">Ofisimiz</span><h2>Bizi ziyaret edin</h2><p>' + esc(f.adres || '') + '</p></div>' +
      '<div class="info-map"><iframe id="gmOfisMap" title="Ofis konumu" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=' + encodeURIComponent(bbox) + '&amp;layer=mapnik&amp;marker=' + lat + ',' + lng + '"></iframe>' +
      '<a id="gmOfisMapLink" class="info-map-link" href="https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng + '#map=16/' + lat + '/' + lng + '" target="_blank" rel="noopener noreferrer">Haritada aç · yol tarifi al ↗</a></div></section>';
    return '<section class="hk-block"><div class="hk-h"><span class="hk-kick">Bize Ulaşın</span><h2>İletişim Kanallarımız</h2><p>Telefon, e-posta veya WhatsApp ile bize ulaşın; ofisimizde de sizi ağırlamaktan memnuniyet duyarız.</p></div>' +
      cc + '</section>' +
      '<section class="hk-block if-wrap">' + form + kunye + '</section>' +
      mapSec;
  }

  /* ---------- DANIŞMANLAR ---------- */
  function danCard(d) {
    var photo = d.foto ? ((typeof IMG !== 'undefined' && IMG[d.foto]) || (('' + d.foto).indexOf('data:') === 0 ? d.foto : '')) : '';
    var av = photo ? '<img src="' + photo + '" alt="' + esc(d.name) + '" loading="lazy">' : '<span>' + esc((d.name || '?').slice(0, 1)) + '</span>';
    return '<div class="hk-tc"><div class="av">' + av + '</div><div class="ti"><div class="nm">' + esc(d.name) + '</div><div class="rl">' + esc(d.role || '') + '</div>' +
      '<div class="ar">📍 ' + esc(d.area || '') + '</div>' +
      (d.exp ? '<div class="mt">' + d.exp + ' yıl deneyim · ⭐ ' + (d.rating || '—') + (d.sales ? ' · ' + d.sales + ' işlem' : '') + '</div>' : '') +
      '<div class="tcta"><a href="tel:' + esc(d.tel || '') + '">Ara</a><a href="https://wa.me/' + esc(d.wa || '') + '" target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div></div>';
  }
  function renderDanismanlar() {
    var list = (typeof DANISMANLAR !== 'undefined' && DANISMANLAR) || [];
    return '<section class="hk-block"><div class="hk-h"><span class="hk-kick">Ekibimiz</span><h2>Uzman Danışman Kadromuz</h2><p>Her biri kendi bölgesinin uzmanı, yetki belgeli danışmanlarımızla veri odaklı, şeffaf bir hizmet sunuyoruz.</p></div>' +
      '<div class="hk-team">' + list.map(danCard).join('') + '</div>' +
      '<div class="info-cta-band"><div><b>Ekibimize katılmak ister misiniz?</b><span>Deneyimli ve gelişime açık danışmanlarla büyüyoruz.</span></div><a class="btn btn-primary" href="#" onclick="goView(\'iletisim\');return false">Başvurun →</a></div></section>';
  }

  /* ---------- EMLAK EKSPERTİZİ ---------- */
  function renderDegerleme() {
    var _pv = (typeof PROVINCE !== 'undefined' && PROVINCE && PROVINCE.name) || 'İzmir';
    var ilceler = (typeof PROVINCE !== 'undefined' && PROVINCE && PROVINCE.districts) ? Object.keys(PROVINCE.districts) : [];
    var opts = ilceler.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('');
    function d(i) { return i > 0 ? ' rv-d' + (Math.min(i, 5) + 1) : ''; }
    /* Tam-genişlik bant: her bölüm kendi zemin bandında, içerik .ek-wrap ile ortalanır */
    function band(id, cls, inner) { return '<section class="ek-band' + (cls ? ' ' + cls : '') + '" id="' + id + '"><div class="ek-wrap">' + inner + '</div></section>'; }
    /* ---------- HERO — üst menüye sıfır, koyu, animasyonlu ---------- */
    var chips = ['📍 Mahalle bazlı m² endeksi', '🛡️ Veri güven skoru', '📈 257 aylık tarihsel seri', '🗄️ 12+ veri kaynağı', '👤 Uzman + veri hibriti', '🔒 KVKK uyumlu, gizli'];
    var statBoxes = [['480', 'M+', 'veri noktası'], ['257', '', 'aylık tarihsel seri'], ['50000', '+', 'mahalle'], ['12', '+', 'veri kaynağı']];
    var hero = '<section class="ek-hero-band"><span class="ek-blob b1"></span><span class="ek-blob b2"></span><span class="ek-blob b3"></span><div class="grid-motif"></div>'
      + '<div class="ek-wrap ek-hero">'
      + '<div class="ek-hero-l"><span class="ek-kick rv">Meridyen Gayrimenkul · ProX Veri Motoru · '+esc(_pv)+'</span>'
      + '<h1 class="ek-h1 rv">Emlak <span class="ek-grad">Ekspertizi</span></h1>'
      + '<div class="ek-sub rv rv-d2">Gayrimenkulünüzün gerçeğini <b>duyguyla değil, veriyle</b> görün.</div>'
      + '<p class="ek-lead rv rv-d2">Saha keşfini ProX veri motorunun <b>480M+ veri noktasıyla</b> birleştirir; alma, satma ya da elde tutma kararınızı netleştiren bir <b>Karar Raporu</b> sunarız. Keşif de rapor da <b>ücretsizdir</b>.</p>'
      + '<div class="ek-microtrust rv rv-d3">✓ Taahhüt yok · ✓ Ödeme yok · ✓ 48 saat içinde dönüş</div>'
      + '<div class="info-chips rv rv-d3">' + chips.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>'
      + '<div class="ek-cta rv rv-d4"><button class="btn btn-primary" onclick="_ekScroll(\'ekTool\')">Ücretsiz Keşif Talep Et</button><button class="btn btn-line" onclick="_ekScroll(\'ekTool\')">Ücretsiz Karar Raporu Al</button></div>'
      + '<div class="ek-honesty rv rv-d5"><b>Emlak ekspertizi</b>, veri destekli bir karar analizidir; resmî (SPK lisanslı) değerleme gerektiğinde sizi <b>çözüm ortağımıza</b> yönlendiririz.</div></div>'
      + '<div class="ek-stats rv rv-r">' + statBoxes.map(function (s) { return '<div class="ek-stat"><b class="ek-num" data-count="' + s[0] + '" data-suf="' + s[1] + '">0</b><span>' + s[2] + '</span></div>'; }).join('') + '</div>'
      + '</div></section>';
    /* ---------- YAPIŞKAN BÖLÜM NAVİGASYONU ---------- */
    var navItems = [['ekKesif', 'Ücretsiz Keşif'], ['ekRapor', 'Karar Raporu'], ['ekUrun', 'Hizmet Katmanları'], ['ekSurec', 'Süreç & Araç'], ['ekNeden', 'Neden Meridyen'], ['ekMetod', 'Metodoloji'], ['ekSss', 'SSS']];
    /* Klavye erişimi: href'siz <a> odaklanamaz → role=button + tabindex + Enter/Space (proje a11y kalıbı) */
    var navA = function (attrs, target, label) { return '<a ' + attrs + ' role="button" tabindex="0" onclick="_ekScroll(\'' + target + '\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();_ekScroll(\'' + target + '\')}">' + label + '</a>'; };
    var secnav = '<nav class="ek-nav" aria-label="Sayfa bölümleri"><div class="ek-wrap ek-nav-in">'
      + navItems.map(function (n, i) { return navA('data-t="' + n[0] + '"' + (i === 0 ? ' class="on"' : ''), n[0], n[1]); }).join('')
      + navA('class="ek-nav-cta"', 'ekTool', 'Ücretsiz Keşif →') + '</div></nav>';
    /* ---------- ÜCRETSİZ KEŞİF ---------- */
    var kesifCover = [
      ['📍', 'Konum ve çevre', 'Mahalle dokusu, komşu kullanım, gelişim yönü, sosyal donatılara yakınlık.'],
      ['🚌', 'Ulaşım', 'Ana arter ve toplu taşımaya erişim, trafik yükü, otopark koşulları.'],
      ['🏢', 'Bina ve kat', 'Bina yaşı, kat konumu, asansör, cephe yönü, manzara, ışık ve gürültü.'],
      ['🧱', 'Cephe ve yapı durumu', 'Görünür yapısal durum, dış cephe, ortak alan bakımı, ısıtma, yıpranma.'],
      ['🔑', 'Kullanım potansiyeli', 'Konut/ofis/kira uygunluğu, tadilat/dönüşüm potansiyeli, likidite sezgisi.'],
      ['📄', 'Belge ön kontrolü', 'Tapu, imar, iskân durumunun genel çerçevede gözden geçirilmesi (hukuki inceleme değil).']
    ];
    var kesif = '<div class="hk-h rv"><span class="hk-kick">Ücretsiz Keşif · Saha Keşfi</span><h2>Önce mülkü tanırız</h2><p>Her doğru ekspertiz, mülkün ve çevresinin gerçek durumunu görmekle başlar. Veri, ancak sahayla eşleştiğinde anlam kazanır — keşif yerinde ya da uzaktan yürütülebilir.</p></div>'
      + '<div class="info-feats">' + kesifCover.map(function (f, i) { return '<div class="if-card rv' + d(i % 3) + '"><span class="if-ic">' + f[0] + '</span><b>' + f[1] + '</b><p>' + f[2] + '</p></div>'; }).join('') + '</div>'
      + '<div class="ek-two">'
      + '<div class="ek-proc rv rv-l"><h4>Süreç</h4><ol>' + ['Talep — mülk tipi ve adresi paylaşın.', 'Planlama — size uygun keşif zamanı (yerinde/uzaktan).', 'Keşif — standart kontrol listesiyle inceleme.', 'Kayıt — gözlemler ProX analiz sürecine aktarılır.'].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ol><p class="ek-dur">⏱️ Yerinde keşif 30–45 dk · uzaktan keşif belgeler ulaşınca aynı gün · <b>tamamen ücretsiz</b>.</p></div>'
      + '<div class="ek-nocover rv rv-r"><h4>⚠️ Neyi kapsamaz</h4><ul>' + ['SPK lisanslı resmî değerleme raporu yerine geçmez; emlak ekspertizi karar desteğidir.', 'Banka/ipotek/resmî işlem raporu SPK lisanslı çözüm ortağımızca hazırlanır.', 'Statik onay, hukuki tapu incelemesi ve enerji kimlik belgesi kapsam dışıdır; ilgili uzmana yönlendirilir.'].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>'
      + '</div>';
    /* ---------- ÜCRETSİZ KARAR RAPORU (10 bölüm) ---------- */
    var raporSecs = [
      ['01', 'Yönetici Özeti', 'Tüm bulgular tek bakışta: değer aralığı, güven skoru, 3 fırsat + 3 risk ve net bir öneri cümlesi.', 'Değer aralığı · güven skoru · fırsat/risk · tek cümle öneri', 0],
      ['02', 'Tahmini Değer Aralığı + Güven', 'Tek fiyat değil; alt–orta–üst aralık ve o tahminin ne kadar sağlam veriye dayandığını gösteren güven skoru.', 'Alt/orta/üst bant · ₺/m² · güven skoru · örneklem', 86],
      ['03', 'Mahalle m² Endeksi & 12 Ay Trend', 'Mahalle m² endeksi ve son 12 ayın trend eğrisi — fiyat hangi yönde, hangi hızda hareket ediyor?', 'Mahalle m² · 12 ay trend · mülk-mahalle sapması · ivme', 0],
      ['04', 'Emsal Karşılaştırma', 'En yakın özellikteki gerçek arz/işlem verisi tablo halinde; oda, m², kat, yaş ve fiyat kıyası.', 'Emsal listesi · medyan/çeyreklik · mülkün emsale göre yeri', 0],
      ['05', 'Bölgesel Risk Analizi', 'Zemin/deprem, likidite, arz-talep dengesi ve fiyat oynaklığı dört başlıkta değerlendirilir.', 'Zemin risk · likidite · arz-talep · oynaklık', 0],
      ['06', 'Yatırım Skoru & Kira Getirisi', 'Yatırım cazibesi tek skorla; kira çarpanı, brüt/net getiri ve amortisman süresi hesaplanır.', 'Skor 0–100 · kira · getiri % · çarpan · boşluk riski', 78],
      ['07', '3 Ay Projeksiyon', 'Kısa vadeli fiyat yönü iyimser / baz / temkinli üç senaryoyla — "şimdi mi, birkaç ay sonra mı?".', '3 senaryo · olasılık ağırlığı · tetikleyici faktörler', 0],
      ['08', 'Bölge Karşılaştırması', 'Mülk; mahalle, ilçe ve il geneliyle kıyaslanır — hangi ölçekte primli ya da iskontolu?', 'Mahalle/ilçe/il m² · prim/iskonto % · segment konumu', 0],
      ['09', 'Karar Destek Çerçevesi', 'Bulgular senaryonuza (sat / al / tut / kirala) uygun net bir aksiyona dönüşür. Bağlayıcı değil, öneri.', 'Senaryoya özel öneri · fiyat/aksiyon aralığı · zamanlama', 0],
      ['10', 'Kaynak & Metodoloji', 'Kaynaklar, verinin nasıl doğrulandığı ve güven skorunun nasıl hesaplandığı şeffaf biçimde açıklanır.', 'Kaynak listesi · veri tazeliği · örneklem · metodoloji', 0]
    ];
    var rapor = '<div class="hk-h rv"><span class="hk-kick">Ücretsiz Karar Raporu</span><h2>Kararınızı veriye dayandırın</h2><p>Keşif gözlemleri ProX motorunun <b>480M+ veri noktası</b> ve <b>257 aylık</b> tarihsel serisiyle birleşince premium bir karar dokümanı çıkar. Ortalama <b>12–18 sayfa</b>, sade ve okunur — aşağıdaki bölümlerin tamamını içerir.</p></div>'
      + '<div class="ek-rapor">' + raporSecs.map(function (r, i) {
        var bar = r[4] ? '<div class="ek-bar"><span class="bar-fill" data-w="' + r[4] + '"></span></div><div class="ek-barlab">örnek güven skoru · <b class="ek-num" data-count="' + r[4] + '" data-suf="%">0</b></div>' : '';
        return '<div class="ek-rsec rv' + d(i % 3) + '"><span class="ek-rn">' + r[0] + '</span><h4>' + r[1] + '</h4><p>' + r[2] + '</p>' + bar + '<div class="ek-rmetrics">' + r[3] + '</div></div>';
      }).join('') + '</div>'
      + '<div class="ek-rnote rv">🛈 Örnek rakamlar temsilîdir; canlı raporda gerçek ProX çıktısıyla gelir. Rapor karar desteği amaçlıdır ve SPK lisanslı resmî değerleme yerine geçmez.</div>';
    /* ---------- ÜRÜN AİLESİ ---------- */
    var tiers = '<div class="info-tiers">' +
      '<div class="it-card rv rv-l"><span class="it-tag">Tier 1 · Çözüm Ortağı</span><h4>SPK Lisanslı Değerleme</h4><p>Banka, ipotek, mahkeme ve resmî işlemler için gereken yasal rapor <b>SPK lisanslı çözüm ortaklarımızca</b> verilir; Meridyen yönlendirir ve koordine eder.</p><ul><li>SPK lisanslı, yasal geçerli</li><li>Banka ve resmî kurum işlemleri</li><li>Koordinasyonu Meridyen üstlenir</li></ul></div>' +
      '<div class="it-card main rv"><span class="it-tag">Tier 2 · Ana Ürün</span><h4>Gayrimenkul Karar Analizi</h4><p>Meridyen\'in asıl uzmanlık alanı: ücretsiz keşif + ProX ile hazırlanan Karar Raporu; alma/satma/elde tutma kararlarınızı veriye dayandırır.</p><ul><li>Ücretsiz keşif + Karar Raporu</li><li>Değer aralığı + güven + risk + projeksiyon</li><li>Uzman görüşmesiyle teslim</li></ul></div>' +
      '<div class="it-card rv rv-r"><span class="it-tag">Tier 3 · Kurumsal</span><h4>Kurumsal Veri Çözümleri</h4><p>Banka, GYO, geliştirici ve kurumsal portföyler için ProX API, toplu veri ve white-label çözümleri.</p><ul><li>ProX API + toplu veri</li><li>White-label panel</li><li>On-premise seçeneği</li></ul></div>' +
      '</div>';
    /* ---------- NASIL ÇALIŞIR + ARAÇ ---------- */
    var steps4 = [['1', 'Talep', 'Formu doldurun veya arayın; mülk tipi, adres ve hedefinizi (sat/al/tut) paylaşın. Taahhüt yok.'], ['2', 'Ücretsiz Keşif', 'Uzmanımız mülkü yerinde/uzaktan inceler; konum, bina, kat, cephe ve çevre gözlemlerini kaydeder.'], ['3', 'Veri Analizi · ProX', 'Saha gözlemleri 480M+ veri ve 257 aylık seriyle çapraz analiz edilir; güven skoru hesaplanır.'], ['4', 'Karar Raporu + Uzman', 'Size özel rapor PDF olarak teslim edilir ve bir uzmanla adım adım yorumlanır.']];
    var steps = '<div class="info-steps ek-steps4">' + steps4.map(function (s, i) { return '<div class="ist rv' + d(i) + '"><span class="n">' + s[0] + '</span><b>' + s[1] + '</b><p>' + s[2] + '</p></div>'; }).join('') + '</div>';
    var form = '<div class="info-valbox rv" id="ekTool"><h3>Hızlı Ekspertiz Ön Analizi</h3><div class="ivb-sub">Ücretsiz · yaklaşık 30 saniye</div>' +
      '<div class="iv-grid"><div class="iv-f"><label>İlçe</label><select id="iv_ilce" onchange="infoValMah()"><option value="">Seçin</option>' + opts + '</select></div>' +
      '<div class="iv-f"><label>Mahalle</label><select id="iv_mah"><option value="">Önce ilçe seçin</option></select></div>' +
      '<div class="iv-f"><label>Emlak Tipi</label><select id="iv_tip"><option>Daire</option><option>Villa</option><option>Müstakil Ev</option><option>İşyeri</option><option>Ofis</option><option>Arsa</option></select></div>' +
      '<div class="iv-f"><label>Brüt m²</label><input id="iv_m2" type="number" inputmode="numeric" placeholder="örn. 120" min="20" max="5000"></div></div>' +
      '<button class="btn btn-primary" onclick="infoValHesapla()">Karar Analizi Başlat →</button>' +
      '<div class="iv-result" id="iv_result" hidden><div class="ivr-lab">Tahmini Piyasa Değer Aralığı</div><div class="ivr-big" id="iv_big">—</div><div class="ivr-range" id="iv_range"></div>' +
      '<div class="iv-lead"><div class="ivl-h">Ücretsiz keşif + detaylı Karar Raporu için →</div><div class="iv-grid2"><input id="iv_ad" placeholder="Adınız Soyadınız"><input id="iv_tel" placeholder="Telefonunuz"></div>' +
      '<button class="btn btn-blue" style="width:100%" onclick="infoValLead()">Ücretsiz Keşif & Karar Raporu İste</button></div>' +
      '<div class="iv-note">⚠️ Bu, veri destekli bir ekspertiz ön analizidir; resmî değer beyanı değildir. <b>Resmî değerleme</b> yalnızca SPK lisanslı/yetkili uzman imzasıyla geçerlidir; talep halinde lisanslı çözüm ortağımıza yönlendiririz.</div></div></div>';
    /* ---------- NEDEN MERİDYEN ---------- */
    var feats = '<div class="info-feats">' + [
      ['🗺️', 'Mahalle Bazlı Veri', 'İl/ilçe ortalaması değil; mülkün mahallesi ölçeğinde analiz. 50.000+ mahalle çözünürlüğü.'],
      ['🛡️', 'Veri Güven Skoru', 'Her tahminin yanında ne kadar sağlam veriye dayandığını gösteren şeffaf skor. Belirsizliği gösteririz.'],
      ['📡', 'Canlı Piyasa Analizi', 'Arz, talep ve fiyat aylık kalibre edilir; rapor bugünün piyasasını yansıtır, geçmişin fotoğrafını değil.'],
      ['👤', 'Uzman + Veri Hibriti', 'Algoritma sahayı göremez, uzman tüm veriyi tek işleyemez. İkisini birleştiririz: insan gözü + ProX.'],
      ['🧱', 'Çok Katmanlı Veri', '12+ kaynak çapraz doğrulanır; tek bir ilan sitesine ya da kaynağa bağlı kalmayız.'],
      ['📈', 'Tarihsel Hafıza', '257 aylık seri, bir mahallenin yıllarca nasıl davrandığını hatırlar; trendi ve oynaklığı bu hafızayla okuruz.']
    ].map(function (f, i) { return '<div class="if-card rv' + d(i % 3) + '"><span class="if-ic">' + f[0] + '</span><b>' + f[1] + '</b><p>' + f[2] + '</p></div>'; }).join('') + '</div>';
    /* ---------- METODOLOJİ & GÜVEN ---------- */
    var conf = [['Örneklem büyüklüğü', 88], ['Veri tazeliği', 82], ['Emsal benzerliği', 90], ['Kaynak tutarlılığı', 85]];
    var method = '<div class="ek-method">'
      + '<div class="ek-mcol rv rv-l"><h4>🔗 Çok kaynaklı çapraz doğrulama</h4><ul>' + ['<b>İlan verisi</b> — aktif + arşiv arz sürekli derlenir.', '<b>Tapu/işlem sinyalleri</b> — kamuya açık gerçekleşmiş eğilimler.', '<b>Saha verisi</b> — ücretsiz keşif gözlemleri analize dahil.', '<b>Açık veri</b> — zemin, ulaşım, demografi, donatı katmanları.'].map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul><p class="ek-mnote">Anomali filtresi: aykırı kayıtlar <b>p2–p98</b> bandıyla elenir (~<b>%6</b> eleme); endeks <b>aylık</b> kalibre edilir.</p></div>'
      + '<div class="ek-mcol rv rv-r"><h4>🛡️ Güven skoru nasıl hesaplanır?</h4>' + conf.map(function (c) { return '<div class="ek-conf"><div class="ek-conf-t"><span>' + c[0] + '</span><b class="ek-num" data-count="' + c[1] + '" data-suf="%">0</b></div><div class="ek-bar"><span class="bar-fill" data-w="' + c[1] + '"></span></div></div>'; }).join('') + '<p class="ek-mnote">Skor bu dört faktörün ağırlıklı bileşimidir; düşük skor "az veri var, temkinli olun" demenin dürüst yoludur.</p></div>'
      + '</div>';
    /* ---------- SSS ---------- */
    var faqs = [
      ['Bu resmî değerleme mi?', 'Hayır. Karar Raporu veri destekli bir ekspertiz ve karar analizidir; SPK lisanslı resmî değerleme yerine geçmez. Kredi/ipotek/resmî işlem için değerleme gerekirse sizi SPK lisanslı çözüm ortağımıza yönlendiririz.'],
      ['Gerçekten ücretsiz mi?', 'Evet. Hem saha keşfi hem Karar Raporu ücretsizdir. Ödeme ya da mülkü bize verme zorunluluğu yoktur; amacımız önce güven oluşturmaktır.'],
      ['Ne kadar sürer?', 'Talepten teslime ortalama 48 saat. Yerinde keşif 30–45 dk, uzaktan keşif belgeler ulaştığında aynı gün tamamlanabilir.'],
      ['Hangi mülk tiplerini kapsıyor?', 'Konut (daire, müstakil), ofis/ticari ve arsa için analiz sunuyoruz. Mülk tipine göre bazı bölümler (ör. kira getirisi) farklılaşır.'],
      ['Verilerim gizli kalıyor mu?', 'Evet. Süreç KVKK\'ya uygun yürütülür; paylaştığınız bilgiler yalnızca sizin raporunuz için kullanılır, üçüncü taraflarla izinsiz paylaşılmaz.'],
      ['Rapor bağlayıcı mı?', 'Hayır. Rapor bir karar desteğidir; öneriler bağlayıcı talimat değil, veriye dayalı yol göstericidir. Kararı siz verirsiniz.'],
      ['Bankalar bu raporu kabul eder mi?', 'Kredi/ipotek için bankalar SPK lisanslı resmî değerleme ister. Karar Raporu bu işlemler için değil, sizin stratejik kararınız içindir; resmî değerleme gerektiğinde çözüm ortağımıza yönlendiririz.'],
      [esc(_pv)+' dışında hizmet var mı?', 'Merkezimiz '+esc(_pv)+' ilinde; saha keşfinde önceliğimiz '+esc(_pv)+'. ProX 81 ili kapsadığından il dışı mülkler için uzaktan keşif ve veri analizi sunabiliyoruz.']
    ];
    var faq = '<div class="ek-faq">' + faqs.map(function (q, i) { return '<details class="ek-q rv' + d(i % 3) + '"' + (i === 0 ? ' open' : '') + '><summary>' + q[0] + '</summary><div class="ek-a">' + q[1] + '</div></details>'; }).join('') + '</div>';
    /* ---------- KAPANIŞ ---------- */
    var final = '<section class="ek-final-band"><span class="ek-blob b1"></span><span class="ek-blob b2"></span><div class="ek-wrap"><div class="ek-final-in rv"><h2>Kararınızı tahmine değil, veriye emanet edin</h2>'
      + '<p>Bir mülkü almadan, satmadan ya da elde tutmadan önce gerçeği görün. Ücretsiz keşif ve ücretsiz Karar Raporu ile başlayın — taahhüt yok, sürpriz yok.</p>'
      + '<div class="ek-cta"><button class="btn btn-primary" onclick="_ekScroll(\'ekTool\')">Ücretsiz Keşif Talep Et</button><button class="btn btn-line" onclick="_ekScroll(\'ekTool\')">Ücretsiz Karar Raporu Al</button></div>'
      + '<div class="ek-microtrust">KVKK uyumlu · 48 saat içinde dönüş · Ödeme yok · Resmî işlem gerektiğinde SPK lisanslı ortağımızla</div></div></div></section>';

    return hero + secnav
      + band('ekKesif', '', kesif)
      + band('ekRapor', 'ek-band--alt', rapor)
      + band('ekUrun', '', '<div class="hk-h rv"><span class="hk-kick">Hizmet Katmanları</span><h2>İhtiyacınıza göre üç katman</h2><p>Resmî bir belgeden stratejik karara, kurumsal veri altyapısına kadar üç net katman.</p></div>' + tiers)
      + band('ekSurec', 'ek-band--alt', '<div class="hk-h rv"><span class="hk-kick">Nasıl Çalışır</span><h2>Dört adımda netlik</h2><p>Talepten karara, ortalama 48 saat.</p></div>' + steps + form)
      + band('ekNeden', '', '<div class="hk-h rv"><span class="hk-kick">Neden Meridyen</span><h2>Biri tahmin eder, diğeri ölçer. Biz ölçeriz.</h2><p>Çok katmanlı, güven skorlu ve tarihsel derinlikli emlak ekspertizi.</p></div>' + feats)
      + band('ekMetod', 'ek-band--alt', '<div class="hk-h rv"><span class="hk-kick">Metodoloji & Güven</span><h2>Rakamların arkasındaki yöntem</h2><p>Güven şeffaflıkla başlar; veriyi nasıl toplayıp doğruladığımızı gösteriyoruz.</p></div>' + method)
      + band('ekSss', '', '<div class="hk-h rv"><span class="hk-kick">SSS</span><h2>Merak edilenler</h2></div>' + faq)
      + final;
  }
  function infoValMah() {
    var ic = $('iv_ilce'), mh = $('iv_mah'); if (!ic || !mh) return;
    var list = (PROVINCE.districts[ic.value] && PROVINCE.districts[ic.value].mah) || [];
    mh.innerHTML = list.length ? list.map(function (m) { return '<option>' + esc(m) + '</option>'; }).join('') : '<option value="">—</option>';
  }
  function ozTFsafe(t) { try { if (typeof ozTF === 'function') return ozTF(t); } catch (e) {} var m = { 'Daire': 1, 'Villa': 1.16, 'Müstakil Ev': 1.1, 'İşyeri': 1.6, 'Ofis': 1.3, 'Arsa': 0.35 }; return m[t] || 1; }
  function infoValHesapla() {
    var ic = ($('iv_ilce') || {}).value, mh = ($('iv_mah') || {}).value, tip = ($('iv_tip') || {}).value, m2 = +($('iv_m2') || {}).value;
    if (!ic) { toasty('Lütfen ilçe seçin.'); return; }
    if (!m2 || m2 < 20) { toasty('Lütfen geçerli m² girin.'); return; }
    var d; try { d = bzMahalle(ic, mh || (PROVINCE.districts[ic].mah || ['Merkez'])[0]); } catch (e) { d = { m2: 40000 }; }
    var val = d.m2 * m2 * ozTFsafe(tip);
    var lo = Math.round(val * 0.9 / 50000) * 50000, hi = Math.round(val * 1.12 / 50000) * 50000;
    var r = $('iv_result'); if (r) r.hidden = false;
    if ($('iv_big')) $('iv_big').textContent = money(val);
    if ($('iv_range')) $('iv_range').innerHTML = 'Değer aralığı <b>' + money(lo) + ' – ' + money(hi) + '</b> · ~' + fmt(d.m2 * ozTFsafe(tip)) + ' ₺/m²';
    window.__ivCtx = { ic: ic, mh: mh, tip: tip, m2: m2, val: val };
  }
  function infoValLead() {
    var ad = ($('iv_ad') || {}).value, tel = ($('iv_tel') || {}).value, c = window.__ivCtx || {};
    if (!ad || !tel) { toasty('Lütfen ad ve telefon girin.'); return; }
    var label = (c.tip || 'Mülk') + ' · ' + (c.mh ? c.mh + ', ' : '') + (c.ic || '') + ' · ' + (c.m2 || '') + ' m²';
    try { if (typeof pushLead === 'function') pushLead({ ad: ad, tel: tel, konu: 'Emlak Ekspertizi: ' + label, src: 'Emlak Ekspertizi Talebi', entryLabel: label }); } catch (e) {}
    try { if (typeof proxSubmitLead === 'function') proxSubmitLead({ sourcePage: 'degerleme', formType: 'valuation', name: ad, phone: tel, location: (c.mh || '') + ', ' + (c.ic || ''), message: label, requestedService: 'Ücretsiz Karar Raporu (Emlak Ekspertizi)' }); } catch (e) {}
    toasty('Talebiniz alındı — uzman danışmanımız kısa sürede sizi arayacak.');
    if ($('iv_ad')) $('iv_ad').value = ''; if ($('iv_tel')) $('iv_tel').value = '';
  }

  /* ---------- REFERANSLAR ---------- */
  function renderReferans() {
    var refs = (typeof REFS !== 'undefined' && REFS) || [];
    var stats = '<div class="info-stats"><div class="is"><b>3.800+</b><span>tamamlanan işlem</span></div><div class="is"><b>%98</b><span>müşteri memnuniyeti</span></div><div class="is"><b>4.9</b><span>Google puanı</span></div><div class="is"><b>18 yıl</b><span>bölge tecrübesi</span></div></div>';
    var cards = '<div class="info-refs">' + refs.map(function (r) {
      return '<div class="iref"><div class="stars">★★★★★</div><p>“' + esc(r.text) + '”</p><div class="who"><span class="av">' + esc((r.name || '?').slice(0, 1)) + '</span><div><b>' + esc(r.name) + '</b><small>' + esc(r.meta || '') + '</small></div></div></div>';
    }).join('') + '</div>';
    var portals = '<div class="info-portals"><span class="lbl">İlanlarımızı ayrıca şu platformlarda da yayınlıyoruz:</span><div class="pl"><a class="fp fp-sah" href="https://www.sahibinden.com" target="_blank" rel="noopener noreferrer">sahibinden</a><a class="fp fp-hep" href="https://www.hepsiemlak.com" target="_blank" rel="noopener noreferrer">hepsiemlak</a><a class="fp fp-ejt" href="https://www.emlakjet.com" target="_blank" rel="noopener noreferrer"><b>emlak</b>jet</a></div></div>';
    return '<section class="hk-block"><div class="hk-h"><span class="hk-kick">Referanslar</span><h2>Müşterilerimiz ne diyor?</h2><p>Veriyle savunulan fiyat, şeffaf süreç ve işlem sonrası destek — memnuniyetimizin arkasındaki fark.</p></div>' +
      stats + cards + portals + '</section>';
  }

  /* ---------- FİYAT ALARMI ---------- */
  function renderAlarm() {
    var ilceler = (typeof PROVINCE !== 'undefined' && PROVINCE && PROVINCE.districts) ? Object.keys(PROVINCE.districts) : [];
    var opts = ilceler.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('');
    var steps = '<div class="info-steps"><div class="ist"><span class="n">1</span><b>Bölge seçin</b><p>Takip etmek istediğiniz ilçe/bölge.</p></div>' +
      '<div class="ist"><span class="n">2</span><b>E-posta bırakın</b><p>Bildirimleri alacağınız adres.</p></div>' +
      '<div class="ist"><span class="n">3</span><b>Haberdar olun</b><p>m² fiyatı değişince veya uygun ilan çıkınca ilk siz öğrenin.</p></div></div>';
    var form = '<div class="info-valbox alarm"><h3>Fiyat Alarmı Kur</h3><div class="ivb-sub">Ücretsiz · istediğiniz zaman iptal</div>' +
      '<div class="iv-grid"><div class="iv-f"><label>Bölge / İlçe</label><select id="ia_bolge"><option value="">Bölge seçin</option>' + opts + '</select></div>' +
      '<div class="iv-f"><label>E-posta</label><input id="ia_mail" type="email" placeholder="ornek@eposta.com"></div></div>' +
      '<button class="btn btn-primary" onclick="infoAlarmKur()">Alarmı Kur →</button></div>';
    return '<section class="hk-block"><div class="hk-h"><span class="hk-kick">Fiyat Alarmı</span><h2>Bölgenizdeki fiyatlar değişince ilk siz öğrenin</h2><p>Seçtiğiniz bölgede m² fiyatı hareketlendiğinde veya bütçenize uygun ilan çıktığında size e-posta gönderelim.</p></div>' +
      steps + form + '</section>';
  }
  function infoAlarmKur() {
    var b = ($('ia_bolge') || {}).value, m = ($('ia_mail') || {}).value;
    if (!b) { toasty('Lütfen bölge seçin.'); return; }
    if (!m || m.indexOf('@') < 0) { toasty('Lütfen geçerli e-posta girin.'); return; }
    try { if (typeof pushLead === 'function') pushLead({ ad: m, tel: '-', konu: 'Fiyat Alarmı: ' + b, src: 'Fiyat Alarmı' }); } catch (e) {}
    try { if (typeof proxSubmitLead === 'function') proxSubmitLead({ sourcePage: 'fiyat-alarmi', formType: 'priceAlarm', name: '', phone: '', email: m, location: b, message: 'Fiyat değişim bildirimi talebi', requestedService: 'Fiyat Alarmı' }); } catch (e) {}
    toasty('✓ Alarm kuruldu — ' + b + ' bölgesindeki değişimleri size ileteceğiz.');
    if ($('ia_mail')) $('ia_mail').value = '';
  }

  /* ---------- YASAL METİNLER ---------- */
  function renderLegal(kind) {
    var doc = { title: TITLES[kind] || 'Yasal', sub: '', body: '<p>İçerik hazırlanıyor.</p>' };
    try { if (typeof legalDoc === 'function') doc = legalDoc(kind) || doc; } catch (e) {}
    return '<section class="hk-block info-legal"><div class="hk-h"><span class="hk-kick">Yasal Bilgilendirme</span><h2>' + esc(doc.title) + '</h2>' + (doc.sub ? '<p>' + esc(doc.sub) + '</p>' : '') + '</div>' +
      '<div class="info-legal-body">' + (doc.body || '') + '</div></section>';
  }

  /* ---------- yönlendirici ---------- */
  var LEADS = { iletisim: 'Doğru danışmanla, doğru kanaldan buluşun. Size en hızlı biçimde dönelim.',
    danismanlar: 'Alanında uzman, yetki belgeli danışmanlarımızla tanışın.',
    degerleme: 'Veri destekli emlak ekspertizi & gayrimenkul karar analizi — ücretsiz keşif + ücretsiz Karar Raporu.',
    referans: 'Bizi tercih eden mülk sahipleri ve yatırımcıların deneyimleri.',
    alarm: 'Bölgenizdeki fiyat hareketlerini ve fırsatları kaçırmayın.',
    kvkk: '6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında aydınlatma metni.',
    cerez: 'Web sitemizde kullanılan çerezler ve tercih yönetimi hakkında bilgilendirme.',
    mesafeli: 'Hizmet kullanım koşulları ve mesafeli hizmet esasları.' };
  function render(topic) {
    switch (topic) {
      case 'iletisim': return renderIletisim();
      case 'danismanlar': return renderDanismanlar();
      case 'degerleme': return renderDegerleme();
      case 'referans': return renderReferans();
      case 'alarm': return renderAlarm();
      case 'kvkk': case 'cerez': case 'mesafeli': return renderLegal(topic);
    }
    return '<section class="hk-block"><div class="hk-h"><h2>Sayfa bulunamadı</h2></div></section>';
  }
  function infoOpen(topic) {
    ensurePage();
    var p = $('infoPage'); if (!p) return;
    document.body.style.overflow = 'hidden'; p.classList.add('open');
    var s = $('infoScroll'); if (s) s.scrollTop = 0;
    try { if (typeof mountSiteChrome === 'function') mountSiteChrome(); } catch (e) {}
    if ($('info_title')) $('info_title').textContent = TITLES[topic] || 'Kurumsal';
    if ($('info_lead')) $('info_lead').textContent = LEADS[topic] || '';
    if ($('info_eye')) $('info_eye').textContent = (topic === 'kvkk' || topic === 'cerez' || topic === 'mesafeli') ? 'Yasal' : 'Kurumsal';
    /* Emlak Ekspertizi: jenerik overlay hero'su gizlenir; sayfa kendi tam-genişlik hero'suyla
       üst menüye sıfır başlar (ek-mode bant mimarisi). */
    var isEk = topic === 'degerleme';
    p.classList.toggle('ek-mode', isEk);
    var gh = p.querySelector('.info-hero'); if (gh) gh.style.display = isEk ? 'none' : '';
    if ($('infoBody')) $('infoBody').innerHTML = render(topic);
    try { if (typeof brandSweep === 'function') brandSweep(p); } catch (e) {}
    try { if (typeof setOverlayPage === 'function') setOverlayPage(TITLES[topic] || 'Kurumsal', '#' + topic); } catch (e) {}
    try { infoMotion(); } catch (e) {}
  }
  /* ── İLERİ SEVİYE HAFİF MOTION (scroll-reveal + stagger + sayaç + animasyonlu bar) ──
     Vanilya/IntersectionObserver; reduced-motion güvenli; ağır kütüphane yok. */
  var _infoIO = null, _ekNavIO = null;
  function _ekCount(el) {
    var to = parseFloat(el.getAttribute('data-count')) || 0, dur = 1150, dec = +el.getAttribute('data-dec') || 0, suf = el.getAttribute('data-suf') || '', pre = el.getAttribute('data-pre') || '', st = null;
    if (window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches) { el.textContent = pre + to.toLocaleString('tr-TR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; return; }
    function step(t) { if (st === null) st = t; var p = Math.min((t - st) / dur, 1), e = 1 - Math.pow(1 - p, 3), v = to * e; el.textContent = pre + v.toLocaleString('tr-TR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; if (p < 1) requestAnimationFrame(step); }
    requestAnimationFrame(step);
  }
  function _infoActivate(el) {
    el.classList.add('in');
    /* Sayaç idempotency: aynı düğüm iki kez aktive edilirse (IO + güvenlik ağı yarışı)
       count-up ikinci kez 0'dan başlamasın. */
    if (el.hasAttribute('data-count') && !el.__ekc) { el.__ekc = 1; _ekCount(el); }
    if (el.querySelectorAll) el.querySelectorAll('.bar-fill[data-w]').forEach(function (b) { b.style.width = (parseFloat(b.getAttribute('data-w')) || 0) + '%'; });
    if (el.matches && el.matches('.bar-fill[data-w]')) el.style.width = (parseFloat(el.getAttribute('data-w')) || 0) + '%';
  }
  function infoMotion() {
    var sc = $('infoScroll'); if (!sc) return;
    var sel = '.rv,.rv-l,.rv-r,.rv-sc,[data-count],.bar-fill[data-w]';
    var nodes = sc.querySelectorAll(sel);
    if (!nodes.length) return;
    if (!('IntersectionObserver' in window)) { nodes.forEach(_infoActivate); return; }
    if (_infoIO) { try { _infoIO.disconnect(); } catch (e) {} }
    _infoIO = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { _infoActivate(en.target); _infoIO.unobserve(en.target); } }); }, { root: sc, threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    /* İlk açılışta (deep-link) layout henüz oturmamış olabilir → rAF ile ertele. */
    var motionOK = false;
    var pass = function () {
      var sr = sc.getBoundingClientRect(), vh = sc.clientHeight;
      /* Kapsayıcı ölçülemiyorsa (vh≈0) reveal'ları görünmez bırakma: hepsini doğrudan aç. */
      if (vh <= 1) { nodes.forEach(_infoActivate); return; }
      motionOK = true;
      nodes.forEach(function (el) { var r = el.getBoundingClientRect(); if (r.top < sr.top + vh * 0.96 && r.bottom > sr.top) _infoActivate(el); else _infoIO.observe(el); });
    };
    if (window.requestAnimationFrame) requestAnimationFrame(pass); else pass();
    /* Güvenlik ağı: yalnız layout ölçülemediyse (motionOK=false) devreye girer — sağlıklı
       durumda fold-altı reveal'lar IO'ya bırakılır ki scroll animasyonları gerçekten oynasın. */
    setTimeout(function () {
      if (motionOK) return;
      sc.querySelectorAll('.rv:not(.in),.rv-l:not(.in),.rv-r:not(.in),.rv-sc:not(.in),[data-count]:not(.in),.bar-fill[data-w]:not(.in)').forEach(_infoActivate);
    }, 1400);
    /* ek-mode: yapışkan bölüm navigasyonunda aktif bölüm takibi */
    if (_ekNavIO) { try { _ekNavIO.disconnect(); } catch (e) {} _ekNavIO = null; }
    var nv = sc.querySelector('.ek-nav');
    if (nv) {
      _ekNavIO = new IntersectionObserver(function (es) {
        es.forEach(function (en) {
          if (!en.isIntersecting) return;
          var id = en.target.id;
          nv.querySelectorAll('a[data-t]').forEach(function (a) { a.classList.toggle('on', a.getAttribute('data-t') === id); });
        });
      }, { root: sc, rootMargin: '-22% 0px -64% 0px' });
      sc.querySelectorAll('.ek-band[id]').forEach(function (b) { _ekNavIO.observe(b); });
    }
  }
  window._ekScroll = function (id) { try { var el = document.getElementById(id), sc = $('infoScroll'); if (el && sc) { var nv = sc.querySelector('.ek-nav'), off = nv ? nv.offsetHeight + 14 : 24; sc.scrollTo({ top: Math.max(0, el.offsetTop - off), behavior: 'smooth' }); } else if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (e) {} };

  function infoContactSubmit() {
    var ad = ($('if_ad') || {}).value, tel = ($('if_tel') || {}).value, mail = ($('if_mail') || {}).value, konu = ($('if_konu') || {}).value, msg = ($('if_msg') || {}).value, kv = ($('if_kvkk') || {}).checked;
    if (!ad || !tel) { toasty('Lütfen ad ve telefon girin.'); return; }
    if (!kv) { toasty('Lütfen KVKK onayını işaretleyin.'); return; }
    try { if (typeof pushLead === 'function') pushLead({ ad: ad, tel: tel, mail: mail, konu: 'İletişim: ' + konu, msg: msg, src: 'İletişim Formu' }); } catch (e) {}
    try { if (typeof proxSubmitLead === 'function') proxSubmitLead({ sourcePage: 'iletisim', formType: 'contact', name: ad, phone: tel, email: mail, message: (konu + ' — ' + (msg || '')), requestedService: konu }); } catch (e) {}
    toasty('Mesajınız alındı — en kısa sürede size döneceğiz.');
    ['if_ad', 'if_tel', 'if_mail', 'if_msg'].forEach(function (id) { if ($(id)) $(id).value = ''; }); if ($('if_kvkk')) $('if_kvkk').checked = false;
  }

  /* ---------- ADMIN: harita ile konum seçici (Leaflet lazy-load) ---------- */
  var _leafletP = null;
  function loadLeaflet() {
    if (_leafletP) return _leafletP;
    _leafletP = new Promise(function (resolve, reject) {
      if (window.L) return resolve(window.L);
      /* M7: SRI (Subresource Integrity) + crossorigin — CDN kurcalanırsa tarayıcı yüklemeyi reddeder.
         Hash'ler unpkg leaflet@1.9.4 dosyalarından hesaplandı. */
      var css = document.createElement('link'); css.rel = 'stylesheet'; css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='; css.crossOrigin = 'anonymous'; document.head.appendChild(css);
      var js = document.createElement('script'); js.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; js.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo='; js.crossOrigin = 'anonymous';
      js.onload = function () { resolve(window.L); }; js.onerror = function () { reject(new Error('leaflet')); };
      document.head.appendChild(js);
    });
    return _leafletP;
  }
  var _fmap = null, _fmarker = null;
  function setLL(lat, lng) { var la = $('cf_lat'), lo = $('cf_lng'); if (la) la.value = (+lat).toFixed(6); if (lo) lo.value = (+lng).toFixed(6); }
  function firmaMapInit() {
    var el = $('cf_map'); if (!el) return;
    el.textContent = 'Harita yükleniyor…';
    loadLeaflet().then(function (L) {
      var f = F(), lat = +f.lat || 38.4322, lng = +f.lng || 27.1419;
      if (_fmap) { try { _fmap.remove(); } catch (e) {} _fmap = null; }
      el.innerHTML = '';
      _fmap = L.map(el).setView([lat, lng], 15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap', maxZoom: 19 }).addTo(_fmap);
      _fmarker = L.marker([lat, lng], { draggable: true }).addTo(_fmap);
      setLL(lat, lng);
      _fmarker.on('dragend', function () { var p = _fmarker.getLatLng(); setLL(p.lat, p.lng); });
      _fmap.on('click', function (ev) { _fmarker.setLatLng(ev.latlng); setLL(ev.latlng.lat, ev.latlng.lng); });
      setTimeout(function () { try { _fmap.invalidateSize(); } catch (e) {} }, 250);
    }).catch(function () { el.textContent = 'Harita yüklenemedi (internet gerekli). Konumu elle enlem/boylam alanına girebilirsiniz.'; });
  }
  /* M6: Nominatim çağrıları — r.ok kontrolü + eşzamanlı istek engeli (kullanım politikası: ~1 istek/sn) */
  var _geoBusy = false;
  function firmaMapReverse() {
    var la = $('cf_lat'); if (!la || !la.value) { toasty('Önce haritadan konum seçin.'); return; }
    if (_geoBusy) { toasty('Sorgu sürüyor, lütfen bekleyin…'); return; } _geoBusy = true;
    fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&accept-language=tr&lat=' + la.value + '&lon=' + ($('cf_lng') || {}).value)
      .then(function (r) { if (!r.ok) throw new Error('nominatim ' + r.status); return r.json(); }).then(function (d) {
        if (d && d.display_name) { if ($('cf_adres')) $('cf_adres').value = d.display_name; toasty('Adres dolduruldu — “Kaydet”e basmayı unutmayın.'); } else toasty('Adres bulunamadı.');
      }).catch(function () { toasty('Adres sorgulanamadı (internet gerekli / sorgu limiti).'); }).then(function () { _geoBusy = false; });
  }
  function firmaMapGeocode() {
    var a = $('cf_adres'); if (!a || !a.value.trim()) { toasty('Önce adres girin.'); return; }
    if (_geoBusy) { toasty('Sorgu sürüyor, lütfen bekleyin…'); return; } _geoBusy = true;
    fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&accept-language=tr&q=' + encodeURIComponent(a.value))
      .then(function (r) { if (!r.ok) throw new Error('nominatim ' + r.status); return r.json(); }).then(function (d) {
        if (d && d[0]) { var lat = +d[0].lat, lng = +d[0].lon; setLL(lat, lng); if (_fmap && _fmarker) { _fmap.setView([lat, lng], 16); _fmarker.setLatLng([lat, lng]); } else firmaMapInit(); toasty('Konum bulundu — haritadan ince ayar yapıp kaydedin.'); } else toasty('Adres bulunamadı.');
      }).catch(function () { toasty('Konum sorgulanamadı (internet gerekli / sorgu limiti).'); }).then(function () { _geoBusy = false; });
  }
  window.firmaMapInit = firmaMapInit; window.firmaMapReverse = firmaMapReverse; window.firmaMapGeocode = firmaMapGeocode;

  /* ---------- _OV entegrasyonu ---------- */
  function register() {
    if (typeof _OV === 'undefined') return;
    Object.keys(TITLES).forEach(function (t) { _OV[t] = { t: TITLES[t], fn: (function (topic) { return function () { infoOpen(topic); }; })(t) }; });
    if (typeof _OV_HM !== 'undefined') Object.keys(TITLES).forEach(function (t) { _OV_HM[t] = t; });
    if (typeof window._ovCloseDom === 'function') {
      var orig = window._ovCloseDom;
      window._ovCloseDom = function () { try { orig(); } catch (e) {} var e2 = document.getElementById('infoPage'); if (e2) e2.classList.remove('open'); };
    }
  }

  window.infoOpen = infoOpen; window.infoValMah = infoValMah; window.infoValHesapla = infoValHesapla;
  window.infoValLead = infoValLead; window.infoAlarmKur = infoAlarmKur; window.infoContactSubmit = infoContactSubmit;

  /* M8: _OV/_OV_HM kaydını HEMEN yap (app.js zaten yüklü) → app.js ovBoot, ilk açılıştaki
     #iletisim/#danismanlar/#degerleme… deep-link'lerini bulur. infoOpen zaten ensurePage çağırır,
     bu yüzden #infoPage DOM'u erken olmasa da sorun değil; yine de DOMContentLoaded'da önden kur. */
  register();
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ensurePage); else ensurePage();
})();
