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
    iletisim: 'İletişim', danismanlar: 'Danışman Kadromuz', degerleme: 'Ücretsiz Değerleme',
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
      '<select id="if_konu"><option>Genel bilgi</option><option>Satılık ilan</option><option>Kiralık ilan</option><option>Mülkümü satmak/kiralamak</option><option>Değerleme talebi</option><option>Özel Portföy</option></select></div>' +
      '<textarea id="if_msg" rows="4" placeholder="Mesajınız…"></textarea>' +
      '<label class="if-kvkk"><input type="checkbox" id="if_kvkk"> <span><a href="#" onclick="goView(\'kvkk\');return false">KVKK Aydınlatma Metni</a>\'ni okudum, iletişim için onaylıyorum.</span></label>' +
      '<button class="btn btn-primary" onclick="infoContactSubmit()">Mesajı Gönder →</button></div>';
    var kunye = '<div class="info-mini-kunye"><span>' + esc(e.unvan || f.name || '') + '</span>' +
      (e.belgeNo ? '<span>Taşınmaz Ticareti Yetki Belge No: <b>' + esc(e.belgeNo) + '</b></span>' : '') +
      '<span>📍 ' + esc(f.adres || '') + '</span></div>';
    var lat = +f.lat || 38.4322, lng = +f.lng || 27.1419;
    var bbox = (lng - 0.012) + ',' + (lat - 0.008) + ',' + (lng + 0.012) + ',' + (lat + 0.008);
    var mapSec = '<section class="hk-block"><div class="hk-h"><span class="hk-kick">Ofisimiz</span><h2>Bizi ziyaret edin</h2><p>' + esc(f.adres || '') + '</p></div>' +
      '<div class="info-map"><iframe title="Ofis konumu" loading="lazy" src="https://www.openstreetmap.org/export/embed.html?bbox=' + encodeURIComponent(bbox) + '&amp;layer=mapnik&amp;marker=' + lat + ',' + lng + '"></iframe>' +
      '<a class="info-map-link" href="https://www.openstreetmap.org/?mlat=' + lat + '&mlon=' + lng + '#map=16/' + lat + '/' + lng + '" target="_blank" rel="noopener noreferrer">Haritada aç · yol tarifi al ↗</a></div></section>';
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

  /* ---------- DEĞERLEME ---------- */
  function renderDegerleme() {
    var ilceler = (typeof PROVINCE !== 'undefined' && PROVINCE && PROVINCE.districts) ? Object.keys(PROVINCE.districts) : [];
    var opts = ilceler.map(function (k) { return '<option>' + esc(k) + '</option>'; }).join('');
    var steps = '<div class="info-steps">' +
      '<div class="ist"><span class="n">1</span><b>Bilgileri girin</b><p>İlçe, mahalle, emlak tipi ve m² bilgisini seçin.</p></div>' +
      '<div class="ist"><span class="n">2</span><b>Anlık ön tahmin</b><p>Mahalle m² endeksiyle tahmini piyasa değeri.</p></div>' +
      '<div class="ist"><span class="n">3</span><b>Uzman raporu</b><p>Danışmanımız detaylı, şirket logolu rapor hazırlar.</p></div></div>';
    var form = '<div class="info-valbox"><h3>Hızlı Değer Tahmini</h3><div class="ivb-sub">Ücretsiz · yaklaşık 30 saniye</div>' +
      '<div class="iv-grid"><div class="iv-f"><label>İlçe</label><select id="iv_ilce" onchange="infoValMah()"><option value="">Seçin</option>' + opts + '</select></div>' +
      '<div class="iv-f"><label>Mahalle</label><select id="iv_mah"><option value="">Önce ilçe seçin</option></select></div>' +
      '<div class="iv-f"><label>Emlak Tipi</label><select id="iv_tip"><option>Daire</option><option>Villa</option><option>Müstakil Ev</option><option>İşyeri</option><option>Ofis</option><option>Arsa</option></select></div>' +
      '<div class="iv-f"><label>Brüt m²</label><input id="iv_m2" type="number" inputmode="numeric" placeholder="örn. 120" min="20" max="5000"></div></div>' +
      '<button class="btn btn-primary" onclick="infoValHesapla()">Değeri Hesapla →</button>' +
      '<div class="iv-result" id="iv_result" hidden><div class="ivr-lab">Tahmini Piyasa Değeri</div><div class="ivr-big" id="iv_big">—</div><div class="ivr-range" id="iv_range"></div>' +
      '<div class="iv-lead"><div class="ivl-h">Detaylı raporu uzmanımız hazırlasın →</div><div class="iv-grid2"><input id="iv_ad" placeholder="Adınız Soyadınız"><input id="iv_tel" placeholder="Telefonunuz"></div>' +
      '<button class="btn btn-blue" style="width:100%" onclick="infoValLead()">Ücretsiz Detaylı Rapor İste</button></div>' +
      '<div class="iv-note">⚠️ Bu bir ön tahmindir; resmî değer beyanı değildir. Resmî değerleme, lisanslı değerleme uzmanı imzasıyla geçerlidir.</div></div></div>';
    return '<section class="hk-block"><div class="hk-h"><span class="hk-kick">Ücretsiz Değerleme</span><h2>Evimin değeri ne kadar?</h2><p>Türkiye\'nin en kapsamlı 81 il · 50.000+ mahalle endeks altyapısına bağlı motorumuzla anlık ön tahmin alın; sonra uzman danışmanımız sizi arasın.</p></div>' +
      steps + form + '</section>';
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
    try { if (typeof pushLead === 'function') pushLead({ ad: ad, tel: tel, konu: 'Değerleme: ' + label, src: 'Değerleme Talebi', entryLabel: label }); } catch (e) {}
    try { if (typeof proxSubmitLead === 'function') proxSubmitLead({ sourcePage: 'degerleme', formType: 'valuation', name: ad, phone: tel, location: (c.mh || '') + ', ' + (c.ic || ''), message: label, requestedService: 'Ücretsiz Değerleme Raporu' }); } catch (e) {}
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
    degerleme: 'Gayrimenkulünüzün güncel piyasa değerine dair anlık, ücretsiz ön tahmin.',
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
    if ($('infoBody')) $('infoBody').innerHTML = render(topic);
    try { if (typeof brandSweep === 'function') brandSweep(p); } catch (e) {}
    try { if (typeof setOverlayPage === 'function') setOverlayPage(TITLES[topic] || 'Kurumsal', '#' + topic); } catch (e) {}
  }

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
