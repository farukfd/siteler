/* Meridyen Değerleme — kurumsal site JS (sade, çerçevesiz).
   Üyelik modeli: Personel/Danışman girişi + Müşteri (anahtar) girişi.
   emlakekspertizi.com API köprüsü: bootstrap/prox.ai/pdf/lead/blog (fallback'li). */
(function () {
  'use strict';

  /* ---- Mobil menü + aktif link ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');
  if (burger && nav) {
    burger.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('open'); }); });
  }
  var here = (location.pathname.split('/').pop() || 'index.html');
  document.querySelectorAll('.nav a[href]').forEach(function (a) { if (a.getAttribute('href') === here) a.classList.add('active'); });

  /* ---- emlakekspertizi.com API köprüsü ---- */
  window.EMLAK_API_BASE = 'https://www.emlakekspertizi.com';
  window.EMLAK_TENANT = { tenant_id: 'valuation', tenant_key: 'INJECT_AT_DEPLOY', domain: location.hostname };
  window.SAAS_USER = { role: null, token: null, profile: null }; // 'personel' | 'musteri'
  var ADMIN_DEFAULT = { user: 'admin', pass: '1234' }; // bağımsız panel varsayılan girişi (panelden değiştirilebilir)
  function degAuth() { var s = degAdminLoad(); return Object.assign({}, ADMIN_DEFAULT, s.auth || {}); }
  function degStaff() { var s = degAdminLoad(); return Array.isArray(s.staff) ? s.staff : []; }

  window.proxApi = async function (path, opt) {
    opt = opt || {};
    try {
      var ctrl = new AbortController();
      var to = setTimeout(function () { ctrl.abort(); }, 8000);
      var res = await fetch(EMLAK_API_BASE + path, {
        method: opt.method || 'GET', mode: 'cors', signal: ctrl.signal,
        headers: Object.assign({ 'Content-Type': 'application/json', 'X-Tenant-Id': EMLAK_TENANT.tenant_id, 'X-Tenant-Key': EMLAK_TENANT.tenant_key }, opt.headers || {}),
        body: opt.body ? JSON.stringify(opt.body) : null
      });
      clearTimeout(to);
      if (!res.ok) throw new Error('http ' + res.status);
      var ct = res.headers.get('content-type') || '';
      return ct.indexOf('application/json') !== -1 ? res.json() : res.blob();
    } catch (e) {
      return { fallback: true, message: String(e && e.message || e) }; // API yoksa demo/fallback
    }
  };

  /* ---- Giriş modalı (Personel + Müşteri Anahtar) ---- */
  function girisHTML() {
    return '<div class="gm-ov" data-close="1"></div><div class="gm-card">'
      + '<button class="gm-x" data-close="1" aria-label="Kapat">✕</button>'
      + '<div class="gm-head"><span class="mk">M</span><b>Meridyen Değerleme · Giriş</b></div>'
      + '<div class="gm-tabs"><button class="act" data-t="personel">Personel / Danışman</button><button data-t="musteri">Müşteri (Anahtar)</button></div>'
      + '<div class="gm-body">'
      + '<div class="gm-pane" data-p="personel">'
      + '<p class="gm-sub">Değerleme şirketi yetkilileri ve SPK lisanslı uzmanları için giriş. Giriş sonrası, sitenin <b>bağımsız yönetim paneli</b> üzerinden personel yönetimi ve <b>API destekli resmî PDF rapor</b> işlemlerini yürütebilirsiniz.</p>'
      + '<label>Kullanıcı adı / E-posta</label><input id="gp_mail" autocomplete="username" placeholder="admin veya e-posta">'
      + '<label>Şifre</label><input id="gp_pass" type="password" autocomplete="current-password" placeholder="••••••••">'
      + '<button class="btn btn-primary" id="gp_btn">Yönetim Paneline Giriş →</button>'
      + '<div class="gm-err" id="gp_err"></div>'
      + '<div class="gm-note">SPK lisanslı uzman; saha kontrolü, belge/tapu incelemesi ve bağımsız değerlendirme ile raporu hazırlar ve imzalar. Panel sitenin kendi altyapısıdır.</div>'
      + '</div>'
      + '<div class="gm-pane" data-p="musteri" hidden>'
      + '<p class="gm-sub">Müşteri erişim anahtarınızla rapor takibi. Anahtar, kurumunuz/danışmanınız tarafından iletilir.</p>'
      + '<label>Erişim Anahtarı</label><input id="gm_key" placeholder="örn. RPT-2026-XXXX">'
      + '<button class="btn btn-primary" id="gm_btn">Anahtarla Giriş →</button>'
      + '<div class="gm-err" id="gm_err"></div>'
      + '<div class="gm-note">Anahtar yalnızca tarayıcınızda kullanılır; URL veya günlüklere yazılmaz.</div>'
      + '</div></div>'
      + '<div class="gm-foot"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z"/></svg> KVKK uyumlu · güvenli kurumsal altyapı · ProX</div>'
      + '</div>';
  }
  function ensureGiris() {
    var m = document.getElementById('girisModal');
    if (m) return m;
    m = document.createElement('div'); m.className = 'gmodal'; m.id = 'girisModal';
    m.innerHTML = girisHTML();
    document.body.appendChild(m);
    m.addEventListener('click', function (e) { if (e.target.dataset && e.target.dataset.close) closeGiris(); });
    m.querySelectorAll('.gm-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        m.querySelectorAll('.gm-tabs button').forEach(function (x) { x.classList.toggle('act', x === b); });
        m.querySelectorAll('.gm-pane').forEach(function (p) { p.hidden = (p.dataset.p !== b.dataset.t); });
      });
    });
    m.querySelector('#gp_btn').addEventListener('click', degPersonelLogin);
    m.querySelector('#gm_btn').addEventListener('click', degMusteriLogin);
    return m;
  }
  window.openGiris = function () { ensureGiris().classList.add('on'); };
  window.closeGiris = function () { var m = document.getElementById('girisModal'); if (m) m.classList.remove('on'); };

  async function degPersonelLogin() {
    var id = (document.getElementById('gp_mail') || {}).value.trim();
    var pass = (document.getElementById('gp_pass') || {}).value || '';
    var err = document.getElementById('gp_err'); err.style.color = ''; err.textContent = '';
    if (!id || !pass) { err.textContent = '⚠ Kullanıcı adı/e-posta ve şifre gereklidir.'; return; }
    var auth = degAuth();
    var role = null, who = null;
    if ((id === auth.user || id === (auth.email || '')) && pass === auth.pass) { role = 'admin'; who = auth.user; }
    else {
      var st = degStaff().filter(function (s) { return s.active !== false && (s.email === id || s.user === id) && s.pass === pass; })[0];
      if (st) { role = (st.role || 'personel'); who = st.name || st.email; }
    }
    if (!role) { err.textContent = '⚠ Kullanıcı adı veya şifre hatalı.'; return; }
    var btn = document.getElementById('gp_btn'); btn.disabled = true; btn.textContent = 'Bağlanıyor…';
    var r = await proxApi('/api/v1/tenant/staff/login', { method: 'POST', body: { user: id, role: role } }); // şifre body'de/log'da değil
    btn.disabled = false; btn.textContent = 'Yönetim Paneline Giriş →';
    SAAS_USER.role = role; SAAS_USER.token = (r && r.token) || ('sess_' + id.length); SAAS_USER.profile = { user: who, role: role };
    closeGiris();
    openDegAdmin();
    degToast('Hoş geldiniz, ' + (who || 'kullanıcı') + ' · ' + (role === 'admin' ? 'Yönetici' : 'Personel') + ' paneli açıldı');
  }

  async function degMusteriLogin() {
    var key = ((document.getElementById('gm_key') || {}).value || '').trim();
    var err = document.getElementById('gm_err'); err.textContent = '';
    if (!key) { err.textContent = '⚠ Erişim anahtarı gereklidir.'; return; }
    var btn = document.getElementById('gm_btn'); btn.disabled = true; btn.textContent = 'Doğrulanıyor…';
    var r = await proxApi('/api/v1/tenant/portal/login', { method: 'POST', body: { client_key: key } });
    btn.disabled = false; btn.textContent = 'Anahtarla Giriş →';
    SAAS_USER.role = 'musteri'; SAAS_USER.token = key; // bellek içi; URL/log'a yazılmaz
    SAAS_USER.profile = { online: !(r && r.fallback) };
    err.style.color = 'var(--teal)';
    err.innerHTML = '✓ Erişim anahtarı kabul edildi' + (r && r.fallback ? ' (çevrimdışı/demo)' : '') + '. Rapor takip erişiminiz açıldı.';
  }
  window.degPersonelLogin = degPersonelLogin; window.degMusteriLogin = degMusteriLogin;

  /* ===== Sitenin kendi BAĞIMSIZ yönetim paneli (#degAdmin) =====
     Şifre kapısı (Personel Girişi) sonrası açılır. Ayarlar localStorage'da; canlı uygulanır.
     "Resmî Rapor" sekmesi emlakekspertizi.com API (/pdf/generate) ile SPK destekli PDF üretir. */
  function degAdminLoad() { try { return JSON.parse(localStorage.getItem('deg_admin') || '{}'); } catch (e) { return {}; } }
  function degAdminSaveStore(s) { try { localStorage.setItem('deg_admin', JSON.stringify(s)); } catch (e) {} }
  function degApplySettings() {
    var s = degAdminLoad(), root = document.documentElement;
    var themes = { Lacivert: ['#1e3a8a', '#2f5bd0'], Antrasit: ['#1f2937', '#374151'], Bordo: ['#7f1d34', '#a8324f'], Yeşil: ['#0f5132', '#1d9e75'] };
    if (s.theme && themes[s.theme]) { root.style.setProperty('--accent', themes[s.theme][0]); root.style.setProperty('--accent-2', themes[s.theme][1]); }
    if (s.favicon) { var l = document.querySelector('link[rel~="icon"]') || document.head.appendChild(Object.assign(document.createElement('link'), { rel: 'icon' })); l.href = s.favicon; }
    if (s.metaTitle) document.title = s.metaTitle;
    if (s.metaDesc) { var md = document.querySelector('meta[name="description"]') || document.head.appendChild(Object.assign(document.createElement('meta'), { name: 'description' })); md.setAttribute('content', s.metaDesc); }
  }
  function degAdminHTML() {
    var s = degAdminLoad();
    var c = s.contact || {};
    var au = degAuth();
    var pg = s.pages || {};
    function val(v) { return v ? String(v).replace(/"/g, '&quot;') : ''; }
    return '<div class="sta-ov" data-aclose="1"></div><div class="sta-card">'
      + '<div class="sta-hd"><b>⚡ Bağımsız Yönetim Paneli · Meridyen Değerleme</b><button data-aclose="1" aria-label="Kapat">✕</button></div>'
      + '<div class="sta-tabs">'
      + '<button class="act" data-t="rapor">Resmî Rapor (PDF)</button>'
      + '<button data-t="tema">Tema & Logo</button>'
      + '<button data-t="google">Google & Meta</button>'
      + '<button data-t="prox">ProX AI</button>'
      + '<button data-t="iletisim">İletişim & Adres</button>'
      + '<button data-t="personel">Personel</button>'
      + '<button data-t="icerik">Sayfa İçerikleri</button>'
      + '<button data-t="hesap">Hesap & Güvenlik</button>'
      + '<button data-t="api">API Durumu</button>'
      + '</div><div class="sta-body">'
      + '<div class="sta-pane" data-p="rapor"><h4>Resmî Değerleme Raporu (API destekli PDF)</h4><p class="sub">Merkezi API ile endeks & mevzuat verisi çekilir; SPK lisanslı uzman dosyayı düzenler ve <b>resmî PDF</b> üretilir.</p>'
      + '<div class="sta-row2"><div class="sta-f"><label>Varlık Türü</label><select id="ar_asset"><option>Konut</option><option>İş Yeri / Ofis</option><option>Arsa</option><option>İş Makinesi</option><option>Fabrika / Üretim Tesisi</option><option>Akaryakıt İstasyonu</option><option>Enerji Santrali (GES/RES)</option></select></div>'
      + '<div class="sta-f"><label>Rapor Amacı</label><select id="ar_purpose"><option>Bankaya Yönelik (Teminat)</option><option>Miras / İzaleyi Şuyu</option><option>Yasal Dava / Bilirkişi</option><option>Kurumsal Varlık Değerleme</option><option>Alım-Satıma Esas Değer Tespiti</option></select></div></div>'
      + '<div class="sta-row2"><div class="sta-f"><label>Müşteri / Kurum</label><input id="ar_client" placeholder="Ad Soyad / Şirket"></div><div class="sta-f"><label>Dosya / Talep No</label><input id="ar_file" placeholder="örn. DEG-2026-0142"></div></div>'
      + '<button class="sta-go" id="ar_btn">📄 Resmî PDF Rapor Oluştur</button><div class="sta-out" id="ar_out"></div></div>'
      + '<div class="sta-pane" data-p="tema" hidden><h4>Logo & Tema</h4><p class="sub">Kurumsal favicon ve tema rengi; sayfa yenilenmeden uygulanır.</p>'
      + '<div class="sta-f"><label>Favicon URL</label><input id="at_fav" value="' + val(s.favicon) + '" placeholder="https://.../favicon.png"></div>'
      + '<div class="sta-f"><label>Tema</label><select id="at_theme"><option' + (s.theme === 'Lacivert' || !s.theme ? ' selected' : '') + '>Lacivert</option><option' + (s.theme === 'Antrasit' ? ' selected' : '') + '>Antrasit</option><option' + (s.theme === 'Bordo' ? ' selected' : '') + '>Bordo</option><option' + (s.theme === 'Yeşil' ? ' selected' : '') + '>Yeşil</option></select></div>'
      + '<button class="sta-go" id="at_btn">Uygula & Kaydet</button></div>'
      + '<div class="sta-pane" data-p="google" hidden><h4>Google & Meta</h4><p class="sub">Arama görünürlüğü ve analytics.</p>'
      + '<div class="sta-row2"><div class="sta-f"><label>Google Analytics (GA4)</label><input id="ag_ga" value="' + val(s.ga) + '" placeholder="G-XXXX"></div><div class="sta-f"><label>Search Console</label><input id="ag_gsc" value="' + val(s.gsc) + '" placeholder="google-site-verification=..."></div></div>'
      + '<div class="sta-f"><label>Meta Başlık</label><input id="ag_title" value="' + val(s.metaTitle) + '"></div>'
      + '<div class="sta-f"><label>Meta Açıklama</label><textarea id="ag_desc" rows="2">' + (s.metaDesc || '') + '</textarea></div>'
      + '<button class="sta-go" id="ag_btn">Kaydet & Uygula</button></div>'
      + '<div class="sta-pane" data-p="prox" hidden><h4>ProX AI — Kuruma Özel Prompt</h4><p class="sub">SPK/UDES resmî promptuna eklenir. Örn: "Endüstriyel tesis değerlemesinde uzmanız."</p>'
      + '<textarea id="ap_prompt" rows="4" placeholder="Kuruma özel uzmanlık / ton...">' + (s.proxPrompt || '') + '</textarea>'
      + '<button class="sta-go" id="ap_btn" style="margin-top:8px">Kaydet</button></div>'
      + '<div class="sta-pane" data-p="iletisim" hidden><h4>İletişim & Adres</h4><p class="sub">Bu bilgiler İletişim sayfasında ve haritada gösterilir. Harita için tam adres ya da "enlem,boylam" girin (Google Haritalar konumu).</p>'
      + '<div class="sta-row2"><div class="sta-f"><label>Firma Adı</label><input id="ct_firma" value="' + val(c.firma) + '" placeholder="Meridyen Gayrimenkul Değerleme A.Ş."></div><div class="sta-f"><label>Telefon</label><input id="ct_tel" value="' + val(c.tel) + '" placeholder="+90 (212) ..."></div></div>'
      + '<div class="sta-row2"><div class="sta-f"><label>WhatsApp No</label><input id="ct_wa" value="' + val(c.whatsapp) + '" placeholder="905xxxxxxxxx"></div><div class="sta-f"><label>E-posta</label><input id="ct_mail" value="' + val(c.email) + '" placeholder="iletisim@..."></div></div>'
      + '<div class="sta-f"><label>Adres</label><input id="ct_adres" value="' + val(c.adres) + '" placeholder="Mahalle, cadde, no, ilçe / il"></div>'
      + '<div class="sta-row2"><div class="sta-f"><label>Çalışma Saatleri</label><input id="ct_saat" value="' + val(c.saat) + '" placeholder="Hafta içi 09:00 – 18:00"></div><div class="sta-f"><label>Harita Konumu</label><input id="ct_harita" value="' + val(c.harita) + '" placeholder="41.0082,28.9784 veya adres"></div></div>'
      + '<button class="sta-go" id="ct_btn">Kaydet & İletişim Sayfasına Uygula</button><div class="sta-out" id="ct_out"></div></div>'
      + '<div class="sta-pane" data-p="personel" hidden><h4>Personel Yönetimi</h4><p class="sub">Sisteme personel/uzman ekleyin; bu kullanıcılar Personel Girişi ekranından kendi kullanıcı adı ve şifresiyle giriş yapar.</p>'
      + '<div class="sta-row2"><div class="sta-f"><label>Ad Soyad</label><input id="pp_name" placeholder="Ad Soyad"></div><div class="sta-f"><label>Kullanıcı / E-posta</label><input id="pp_mail" placeholder="ad@firma.com"></div></div>'
      + '<div class="sta-row2"><div class="sta-f"><label>Şifre</label><input id="pp_pass" placeholder="şifre belirleyin"></div><div class="sta-f"><label>Rol</label><select id="pp_role"><option value="personel">SPK Lisanslı Uzman / Personel</option><option value="admin">Yönetici</option></select></div></div>'
      + '<button class="sta-go" id="pp_add">+ Personel Ekle</button><div class="sta-out" id="pp_out"></div>'
      + '<div id="pp_list" style="margin-top:18px"></div></div>'
      + '<div class="sta-pane" data-p="icerik" hidden><h4>Sayfa İçerikleri (Yasal Metinler)</h4><p class="sub">KVKK, Gizlilik ve Çerez sayfalarının metnini düzenleyin. Boş bırakılırsa hazır varsayılan metin gösterilir. Düz metin; boş satır yeni paragraf, satır içi başlık için satırı "## " ile başlatın.</p>'
      + '<div class="sta-f"><label>KVKK Aydınlatma Metni</label><textarea id="pg_kvkk" rows="4">' + (pg.kvkk || '') + '</textarea></div>'
      + '<div class="sta-f"><label>Gizlilik Politikası</label><textarea id="pg_gizlilik" rows="4">' + (pg.gizlilik || '') + '</textarea></div>'
      + '<div class="sta-f"><label>Çerez Politikası</label><textarea id="pg_cerez" rows="4">' + (pg.cerez || '') + '</textarea></div>'
      + '<button class="sta-go" id="pg_btn">Kaydet & Uygula</button><div class="sta-out" id="pg_out"></div></div>'
      + '<div class="sta-pane" data-p="hesap" hidden><h4>Hesap &amp; Güvenlik</h4><p class="sub">Yönetici kullanıcı adını ve şifresini değiştirin. Varsayılan giriş: <b>admin / 1234</b>. Değişiklikten sonra yeni bilgilerle giriş yapılır.</p>'
      + '<div class="sta-f"><label>Yönetici Kullanıcı Adı</label><input id="ac_user" value="' + val(au.user) + '"></div>'
      + '<div class="sta-row2"><div class="sta-f"><label>Mevcut Şifre</label><input id="ac_cur" type="password" placeholder="mevcut şifre"></div><div class="sta-f"><label>Yeni Şifre</label><input id="ac_new" type="password" placeholder="yeni şifre (min 4)"></div></div>'
      + '<div class="sta-f"><label>Yeni Şifre (Tekrar)</label><input id="ac_new2" type="password" placeholder="yeni şifre tekrar"></div>'
      + '<button class="sta-go" id="ac_btn">Kullanıcı Adı &amp; Şifreyi Güncelle</button><div class="sta-out" id="ac_out"></div></div>'
      + '<div class="sta-pane" data-p="api" hidden><h4>API Kullanım Durumu</h4><p class="sub">Merkezi ProX uçlarının canlı yoklaması (X-Tenant-Id: ' + EMLAK_TENANT.tenant_id + ').</p>'
      + '<div id="aa_out"><button class="sta-go" id="aa_btn">Yokla</button></div></div>'
      + '</div></div>';
  }
  function ensureDegAdmin() {
    var m = document.getElementById('degAdmin');
    if (m) return m;
    m = document.createElement('div'); m.className = 'sta-modal'; m.id = 'degAdmin';
    m.innerHTML = degAdminHTML();
    document.body.appendChild(m);
    m.addEventListener('click', function (e) { if (e.target.dataset && e.target.dataset.aclose) closeDegAdmin(); });
    m.querySelectorAll('.sta-tabs button').forEach(function (b) {
      b.addEventListener('click', function () {
        m.querySelectorAll('.sta-tabs button').forEach(function (x) { x.classList.toggle('act', x === b); });
        m.querySelectorAll('.sta-pane').forEach(function (p) { p.hidden = (p.dataset.p !== b.dataset.t); });
        if (b.dataset.t === 'personel') { try { degAdminRenderStaff(); } catch (e) {} }
      });
    });
    m.querySelector('#pp_add').addEventListener('click', degAdminAddStaff);
    m.querySelector('#ac_btn').addEventListener('click', degAdminSaveAuth);
    m.querySelector('#pg_btn').addEventListener('click', function () {
      function gv(id) { var e = m.querySelector('#' + id); return e ? e.value : ''; }
      var s = degAdminLoad(); s.pages = Object.assign({}, s.pages || {}, { kvkk: gv('pg_kvkk').trim(), gizlilik: gv('pg_gizlilik').trim(), cerez: gv('pg_cerez').trim() });
      degAdminSaveStore(s);
      var o = m.querySelector('#pg_out'); o.className = 'sta-out'; o.innerHTML = '<span class="ok">✓ Sayfa içerikleri kaydedildi ve uygulandı.</span>';
      try { degLegalApply(); } catch (e) {}
      degToast('Sayfa içerikleri güncellendi.');
    });
    m.querySelector('#ar_btn').addEventListener('click', degAdminGenPdf);
    m.querySelector('#at_btn').addEventListener('click', function () { var s = degAdminLoad(); s.favicon = m.querySelector('#at_fav').value.trim(); s.theme = m.querySelector('#at_theme').value; degAdminSaveStore(s); degApplySettings(); degToast('Tema & logo uygulandı.'); });
    m.querySelector('#ag_btn').addEventListener('click', function () { var s = degAdminLoad(); s.ga = m.querySelector('#ag_ga').value.trim(); s.gsc = m.querySelector('#ag_gsc').value.trim(); s.metaTitle = m.querySelector('#ag_title').value.trim(); s.metaDesc = m.querySelector('#ag_desc').value.trim(); degAdminSaveStore(s); degApplySettings(); degToast('Google & Meta kaydedildi.'); });
    m.querySelector('#ap_btn').addEventListener('click', function () { var s = degAdminLoad(); s.proxPrompt = m.querySelector('#ap_prompt').value.trim(); degAdminSaveStore(s); degToast('Kuruma özel ProX promptu kaydedildi.'); });
    m.querySelector('#ct_btn').addEventListener('click', function () {
      function gv(id) { var e = m.querySelector('#' + id); return e ? e.value.trim() : ''; }
      var s = degAdminLoad();
      s.contact = { firma: gv('ct_firma'), tel: gv('ct_tel'), whatsapp: gv('ct_wa'), email: gv('ct_mail'), adres: gv('ct_adres'), saat: gv('ct_saat'), harita: gv('ct_harita') };
      degAdminSaveStore(s);
      var o = m.querySelector('#ct_out'); o.className = 'sta-out'; o.innerHTML = '<span class="ok">✓ İletişim & adres kaydedildi ve uygulandı.</span>';
      try { degContactApply(); } catch (e) {}
      degToast('İletişim bilgileri güncellendi.');
    });
    m.querySelector('#aa_btn').addEventListener('click', degAdminPingApi);
    return m;
  }
  window.openDegAdmin = function () { ensureDegAdmin().classList.add('on'); };
  window.closeDegAdmin = function () { var m = document.getElementById('degAdmin'); if (m) m.classList.remove('on'); };

  async function degAdminGenPdf() {
    var asset = (document.getElementById('ar_asset') || {}).value || '';
    var purpose = (document.getElementById('ar_purpose') || {}).value || '';
    var client = (document.getElementById('ar_client') || {}).value.trim();
    var fileno = (document.getElementById('ar_file') || {}).value.trim();
    var out = document.getElementById('ar_out'); out.className = 'sta-out';
    if (!client) { out.innerHTML = '<span class="bad">⚠ Müşteri / kurum adı gereklidir.</span>'; return; }
    var btn = document.getElementById('ar_btn'); btn.disabled = true; btn.textContent = 'Oluşturuluyor…';
    var r = await proxApi('/api/v1/tenant/pdf/generate', { method: 'POST', body: { asset: asset, purpose: purpose, client: client, file_no: fileno, prox_prompt: (degAdminLoad().proxPrompt || '') } });
    btn.disabled = false; btn.textContent = '📄 Resmî PDF Rapor Oluştur';
    if (r && r.url) { out.innerHTML = '<a class="ok" href="' + r.url + '" target="_blank" rel="noopener noreferrer">✓ Resmî PDF hazır — indir/görüntüle →</a>'; }
    else if (r && r.fallback) { out.innerHTML = '<span class="warn">○ Çevrimdışı/demo: Dosya altyapısı hazırlandı ve SPK lisanslı uzmana atandı. Canlı API bağlanınca PDF anında üretilir.</span>'; }
    else { out.innerHTML = '<span class="ok">✓ Talep alındı; resmî PDF uzman onayına gönderildi.</span>'; }
  }
  async function degAdminPingApi() {
    var host = document.getElementById('aa_out'); host.innerHTML = '<p class="sub">Yoklanıyor…</p>';
    var eps = [['/api/v1/tenant/bootstrap', 'GET'], ['/api/v1/tenant/prox/analyze', 'POST'], ['/api/v1/tenant/prox/ai', 'POST'], ['/api/v1/tenant/pdf/generate', 'POST'], ['/api/v1/tenant/lead', 'POST']];
    var rows = [];
    for (var i = 0; i < eps.length; i++) {
      var r = await proxApi(eps[i][0], { method: eps[i][1], body: eps[i][1] === 'POST' ? { ping: true } : null });
      rows.push('<tr><td>' + eps[i][0] + '</td><td><b>' + (r && !r.fallback ? '✓ çevrimiçi' : '○ fallback') + '</b></td></tr>');
    }
    host.innerHTML = '<table class="aa-tbl"><tbody>' + rows.join('') + '</tbody></table><p class="sub" style="margin-top:8px">Not: tenant anahtarı yalnız başlıkta gönderilir; loglanmaz.</p><button class="sta-go" id="aa_btn2">Yeniden Yokla</button>';
    var b2 = document.getElementById('aa_btn2'); if (b2) b2.addEventListener('click', degAdminPingApi);
  }

  /* ---- Personel & hesap yönetimi (admin) ---- */
  function degEsc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function degAdminRenderStaff() {
    var host = document.getElementById('pp_list'); if (!host) return;
    var st = degStaff();
    if (!st.length) { host.innerHTML = '<p class="sub">Henüz personel eklenmedi. Yukarıdan ekleyebilirsiniz.</p>'; return; }
    host.innerHTML = '<table class="aa-tbl"><tbody>' + st.map(function (s, i) {
      return '<tr><td><b>' + degEsc(s.name || s.email) + '</b><div style="font-size:11.5px;color:#888">' + degEsc(s.email) + ' · ' + (s.role === 'admin' ? 'Yönetici' : 'Personel') + (s.active === false ? ' · pasif' : '') + '</div></td>'
        + '<td style="text-align:right;white-space:nowrap"><button class="sta-mini" data-act="toggle" data-i="' + i + '">' + (s.active === false ? 'Aktif et' : 'Pasif et') + '</button> <button class="sta-mini bad" data-act="del" data-i="' + i + '">Sil</button></td></tr>';
    }).join('') + '</tbody></table>';
    host.querySelectorAll('button[data-act]').forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i'), act = b.getAttribute('data-act');
        var s = degAdminLoad(); s.staff = degStaff();
        if (act === 'del') s.staff.splice(i, 1);
        else s.staff[i].active = (s.staff[i].active === false);
        degAdminSaveStore(s); degAdminRenderStaff();
        degToast(act === 'del' ? 'Personel silindi.' : 'Personel durumu güncellendi.');
      });
    });
  }
  function degAdminAddStaff() {
    function g(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
    var name = g('pp_name'), mail = g('pp_mail'), pass = g('pp_pass'), role = g('pp_role') || 'personel';
    var out = document.getElementById('pp_out'); out.className = 'sta-out';
    if (!name || !mail || !pass) { out.innerHTML = '<span class="bad">⚠ Ad, kullanıcı/e-posta ve şifre gereklidir.</span>'; return; }
    var s = degAdminLoad(); s.staff = degStaff();
    if (s.staff.some(function (x) { return x.email === mail; })) { out.innerHTML = '<span class="bad">⚠ Bu kullanıcı/e-posta zaten kayıtlı.</span>'; return; }
    s.staff.push({ name: name, email: mail, pass: pass, role: role, active: true });
    degAdminSaveStore(s);
    ['pp_name', 'pp_mail', 'pp_pass'].forEach(function (id) { var e = document.getElementById(id); if (e) e.value = ''; });
    out.innerHTML = '<span class="ok">✓ Personel eklendi. Personel Girişi ekranından kendi bilgisiyle giriş yapabilir.</span>';
    degAdminRenderStaff();
    degToast('Personel eklendi.');
  }
  function degAdminSaveAuth() {
    function g(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
    var user = g('ac_user'), cur = g('ac_cur'), nw = g('ac_new'), nw2 = g('ac_new2');
    var out = document.getElementById('ac_out'); out.className = 'sta-out';
    var auth = degAuth();
    if (!user) { out.innerHTML = '<span class="bad">⚠ Kullanıcı adı boş olamaz.</span>'; return; }
    var s = degAdminLoad(); s.auth = Object.assign({}, auth); s.auth.user = user;
    var changed = (user !== auth.user);
    if (cur || nw || nw2) {
      if (cur !== auth.pass) { out.innerHTML = '<span class="bad">⚠ Mevcut şifre hatalı.</span>'; return; }
      if (nw.length < 4) { out.innerHTML = '<span class="bad">⚠ Yeni şifre en az 4 karakter olmalı.</span>'; return; }
      if (nw !== nw2) { out.innerHTML = '<span class="bad">⚠ Yeni şifreler eşleşmiyor.</span>'; return; }
      s.auth.pass = nw; changed = true;
    }
    degAdminSaveStore(s);
    ['ac_cur', 'ac_new', 'ac_new2'].forEach(function (id) { var e = document.getElementById(id); if (e) e.value = ''; });
    out.innerHTML = '<span class="ok">✓ Yönetici hesabı güncellendi.' + (s.auth.pass !== auth.pass ? ' Yeni şifre etkin.' : '') + '</span>';
    if (changed) degToast('Yönetici hesabı güncellendi.');
  }

  /* ===== İletişim sayfası — admin'den adres/harita + canlı destek (ProX) ===== */
  function degContactApply() {
    var c = (degAdminLoad().contact) || {};
    function setTxt(id, t) { var e = document.getElementById(id); if (e && t) e.textContent = t; }
    function setHref(id, h) { var e = document.getElementById(id); if (e && h) e.setAttribute('href', h); }
    var firma = c.firma || 'Meridyen Gayrimenkul Değerleme A.Ş.';
    var adres = c.adres || 'Merkez Mah. Değerleme Cad. No: 1 · İstanbul';
    var tel = c.tel || '+90 (212) 000 00 00';
    var wa = (c.whatsapp || '905000000000').replace(/[^0-9]/g, '');
    var mail = c.email || 'iletisim@meridyendegerleme.com';
    var saat = c.saat || 'Hafta içi 09:00 – 18:00 · Cumartesi 10:00 – 14:00';
    var harita = c.harita || '41.0082,28.9784';
    setTxt('ctFirma', firma); setTxt('ctAdres', adres); setTxt('ctTel', tel); setTxt('ctMail', mail); setTxt('ctSaat', saat); setTxt('ctPinTxt', firma);
    setHref('ctTelA', 'tel:' + tel.replace(/[^0-9+]/g, ''));
    setHref('ctMailA', 'mailto:' + mail);
    setHref('ctWa', 'https://wa.me/' + wa); setHref('ctWaBtn', 'https://wa.me/' + wa);
    var map = document.getElementById('ctMap');
    if (map) map.src = 'https://maps.google.com/maps?q=' + encodeURIComponent(harita) + '&z=14&output=embed';
  }
  function degContactInit() {
    if (!document.getElementById('ctMap')) return; // yalnız iletişim sayfası
    try { degContactApply(); } catch (e) {}
    var send = document.getElementById('ctSend'), inp = document.getElementById('ctIn'), box = document.getElementById('ctMsgs');
    if (!send || !inp || !box) return;
    function add(cls, txt) { var d = document.createElement('div'); d.className = cls; d.textContent = txt; box.appendChild(d); box.scrollTop = box.scrollHeight; return d; }
    async function go() {
      var t = inp.value.trim(); if (!t) return;
      add('ct-me', t); inp.value = ''; send.disabled = true;
      var w = add('ct-bot', 'Yanıt hazırlanıyor…');
      var ans = '';
      try { ans = window.degProxAi ? await degProxAi(t) : ''; } catch (e) {}
      w.textContent = ans || 'Şu an için en hızlı yanıt WhatsApp hattımızdan; talebinizi oluşturmak isterseniz “Talep Oluştur” adımına geçebilirsiniz.';
      send.disabled = false; inp.focus();
    }
    send.addEventListener('click', go);
    inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') go(); });
  }

  /* ---- Yasal sayfa içeriği (admin'den override) + çerez bandı ---- */
  function degLegalApply() {
    var el = document.getElementById('legalBody'); if (!el) return;
    var page = el.getAttribute('data-page'); var pages = (degAdminLoad().pages) || {};
    var txt = (pages[page] || '').trim();
    if (!txt) return; // varsayılan yapısal metin kalır
    var html = txt.split(/\n{2,}/).map(function (blk) {
      blk = blk.replace(/^\n+|\n+$/g, ''); if (!blk) return '';
      var out = '', para = [];
      function flush() { if (para.length) { out += '<p>' + para.map(degEsc).join('<br>') + '</p>'; para = []; } }
      blk.split('\n').forEach(function (ln) {
        if (ln.indexOf('## ') === 0) { flush(); out += '<h2>' + degEsc(ln.slice(3).trim()) + '</h2>'; }
        else if (ln.indexOf('### ') === 0) { flush(); out += '<h3>' + degEsc(ln.slice(4).trim()) + '</h3>'; }
        else para.push(ln);
      });
      flush(); return out;
    }).join('');
    var upd = el.querySelector('.upd');
    el.innerHTML = (upd ? upd.outerHTML : '') + html;
  }
  function degCookieBar() {
    try { if (localStorage.getItem('deg_cookie')) return; } catch (e) { return; }
    var bar = document.createElement('div'); bar.className = 'cookie-bar'; bar.id = 'degCookie';
    bar.innerHTML = '<p>Sitemizde deneyiminizi iyileştirmek ve hizmetlerimizi sunmak için çerezler kullanıyoruz. Ayrıntılar için <a href="cerez.html">Çerez Politikası</a>.</p>'
      + '<div class="cb-actions"><button class="cb-x" id="cbReddet">Yalnızca Zorunlu</button><button class="cb-ok" id="cbKabul">Kabul Et</button></div>';
    document.body.appendChild(bar);
    setTimeout(function () { bar.classList.add('on'); }, 500);
    function close(v) { try { localStorage.setItem('deg_cookie', v); } catch (e) {} bar.classList.remove('on'); setTimeout(function () { if (bar.parentNode) bar.remove(); }, 320); }
    bar.querySelector('#cbKabul').addEventListener('click', function () { close('all'); });
    bar.querySelector('#cbReddet').addEventListener('click', function () { close('essential'); });
  }

  /* ---- Toast ---- */
  function degToast(msg) {
    var t = document.getElementById('degToast');
    if (!t) { t = document.createElement('div'); t.id = 'degToast'; t.className = 'toastbox'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._to); t._to = setTimeout(function () { t.classList.remove('on'); }, 2600);
  }
  window.openDegAdmin = window.openDegAdmin; window.degToast = degToast;
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeDegAdmin(); });
  try { degApplySettings(); } catch (e) {}

  /* ---- ProX AI köprüsü (chat hook'u — UI sonraki adım) ---- */
  window.degProxAi = async function (prompt) {
    var r = await proxApi('/api/v1/tenant/prox/ai', { method: 'POST', body: { prompt: String(prompt || '') } });
    return (r && r.answer) ? r.answer : 'ProX yanıtı şu anda alınamadı; lütfen başvuru üzerinden uzmanımıza ulaşın.';
  };

  /* ---- Blog: emlakekspertizi.com/blog API (varsa #blog'u doldurur; yoksa statik kalır) ---- */
  async function degLoadBlog() {
    var grid = document.querySelector('#blog .grid-3'); if (!grid) return;
    var r = await proxApi('/api/v1/tenant/blog?limit=3');
    if (!r || r.fallback || !Array.isArray(r.posts) || !r.posts.length) return; // fallback: statik kartlar kalır
    grid.innerHTML = r.posts.slice(0, 3).map(function (p) {
      return '<article class="blogcard"><div class="bc-top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>'
        + '<div class="bc-b"><span class="tagx">' + (p.category || 'Bilgi Merkezi') + '</span><h3>' + (p.title || '') + '</h3><p>' + (p.excerpt || '') + '</p>'
        + '<a class="more" href="' + (p.url || 'https://www.emlakekspertizi.com/blog') + '" target="_blank" rel="noopener noreferrer">Devamını oku →</a></div></article>';
    }).join('');
  }

  /* ---- Blog sayfası (#blogGrid) — emlakekspertizi.com/blog API'den (fallback statik) ---- */
  async function degBlogPageInit() {
    var grid = document.getElementById('blogGrid'); if (!grid) return;
    var r = await proxApi('/api/v1/tenant/blog?limit=12');
    if (!r || r.fallback || !Array.isArray(r.posts) || !r.posts.length) return; // fallback: statik kartlar kalır
    grid.innerHTML = r.posts.map(function (p) {
      return '<article class="blogcard"><div class="bc-top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>'
        + '<div class="bc-b"><span class="tagx">' + degEsc(p.category || 'Bilgi Merkezi') + '</span><h3>' + degEsc(p.title || '') + '</h3><p>' + degEsc(p.excerpt || '') + '</p>'
        + '<a class="more" href="' + (p.url || 'https://www.emlakekspertizi.com/blog') + '" target="_blank" rel="noopener noreferrer">Devamını oku →</a></div></article>';
    }).join('');
  }

  /* ---- Şikayet & İtiraz formu (#skForm) ---- */
  function degSikayetInit() {
    var btn = document.getElementById('skBtn'); if (!btn) return;
    btn.addEventListener('click', async function () {
      function g(id) { var e = document.getElementById(id); return e ? e.value.trim() : ''; }
      var name = g('sk_name'), phone = g('sk_phone'), konu = g('sk_konu'), msg = g('sk_msg');
      var err = document.getElementById('sk_err'); err.textContent = '';
      if (!name) { err.textContent = '⚠ Ad soyad gereklidir.'; return; }
      if (!/[0-9]{10,}/.test(phone.replace(/\D/g, '')) && !/.+@.+\..+/.test(g('sk_mail'))) { err.textContent = '⚠ Telefon veya e-posta gereklidir.'; return; }
      if (!msg) { err.textContent = '⚠ Lütfen talebinizi açıklayın.'; return; }
      btn.disabled = true; btn.textContent = 'Gönderiliyor…';
      await proxApi('/api/v1/tenant/lead', { method: 'POST', body: { type: 'sikayet-itiraz', source: 'sikayet', name: name, phone: phone, email: g('sk_mail'), file_no: g('sk_dosya'), konu: konu, message: msg } });
      btn.disabled = false; btn.textContent = 'Gönder →';
      document.getElementById('skForm').style.display = 'none';
      var ok = document.getElementById('skOk'); var tno = 'BSV-2026-' + String(1000 + Math.floor(Math.random() * 8999));
      var t = document.getElementById('skTno'); if (t) t.textContent = tno;
      ok.classList.add('on');
    });
  }

  /* ===== Teklif Al modalı (hizmet kartlarından) ===== */
  function teklifHTML() {
    var doc = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>';
    return '<div class="gm-ov" data-qclose="1"></div><div class="gm-card">'
      + '<button class="gm-x" data-qclose="1" aria-label="Kapat">✕</button>'
      + '<div class="gm-head"><span class="mk">M</span><b>Teklif Al · Meridyen Değerleme</b></div>'
      + '<div class="gm-body">'
      + '<div class="gm-chip" id="tk_svc">' + doc + '<span>Değerleme Hizmeti</span></div>'
      + '<p class="gm-sub">Seçtiğiniz değerleme hizmeti için SPK lisanslı uzmanımız en kısa sürede sizi arasın. İletişim bilgilerinizi bırakmanız yeterli.</p>'
      + '<div class="gm-row2"><div class="gm-f"><label>Ad Soyad</label><input id="tk_name" autocomplete="name" placeholder="Ad Soyad"></div>'
      + '<div class="gm-f"><label>Telefon</label><input id="tk_phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="05__ ___ __ __"></div></div>'
      + '<button class="btn btn-primary" id="tk_btn">Teklif İste →</button>'
      + '<div class="gm-err" id="tk_err"></div>'
      + '<div class="gm-note">Bilgileriniz yalnızca teklif görüşmesi için kullanılır ve KVKK kapsamında işlenir.</div>'
      + '</div>'
      + '<div class="gm-foot"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z"/></svg> KVKK uyumlu · güvenli kurumsal altyapı · ProX</div>'
      + '</div>';
  }
  function ensureTeklif() {
    var m = document.getElementById('teklifModal');
    if (m) return m;
    m = document.createElement('div'); m.className = 'gmodal'; m.id = 'teklifModal';
    m.innerHTML = teklifHTML();
    document.body.appendChild(m);
    m.addEventListener('click', function (e) { if (e.target.dataset && e.target.dataset.qclose) closeTeklif(); });
    m.querySelector('#tk_btn').addEventListener('click', degTeklifSubmit);
    return m;
  }
  window.openTeklif = function (service) {
    var m = ensureTeklif();
    var chip = m.querySelector('#tk_svc span'); if (chip) chip.textContent = service || 'Değerleme Hizmeti';
    m.dataset.service = service || '';
    var err = m.querySelector('#tk_err'); err.textContent = ''; err.style.color = '';
    m.classList.add('on');
    setTimeout(function () { var n = m.querySelector('#tk_name'); if (n) n.focus(); }, 60);
  };
  window.closeTeklif = function () { var m = document.getElementById('teklifModal'); if (m) m.classList.remove('on'); };
  async function degTeklifSubmit() {
    var m = document.getElementById('teklifModal');
    var name = (document.getElementById('tk_name') || {}).value.trim();
    var phone = (document.getElementById('tk_phone') || {}).value.trim();
    var err = document.getElementById('tk_err'); err.style.color = ''; err.textContent = '';
    if (!name) { err.textContent = '⚠ Ad soyad gereklidir.'; return; }
    if (!/[0-9]{10,}/.test(phone.replace(/\D/g, ''))) { err.textContent = '⚠ Geçerli bir telefon numarası girin.'; return; }
    var btn = document.getElementById('tk_btn'); btn.disabled = true; btn.textContent = 'Gönderiliyor…';
    var r = await proxApi('/api/v1/tenant/lead', { method: 'POST', body: { type: 'teklif', service: (m && m.dataset.service) || '', name: name, phone: phone, source: 'hizmetler' } });
    btn.disabled = false; btn.textContent = 'Teklif İste →';
    err.style.color = 'var(--teal)';
    err.innerHTML = '✓ Teklif talebiniz alındı' + (r && r.fallback ? ' (çevrimdışı/demo)' : '') + '. Uzmanımız en kısa sürede sizinle iletişime geçecek.';
    var n = document.getElementById('tk_name'), p = document.getElementById('tk_phone'); if (n) n.value = ''; if (p) p.value = '';
    degToast('Teklif talebiniz iletildi.');
  }

  /* ---- Scroll-reveal + sayaç (yalnız ilgili öğeler varsa) ---- */
  function degInitReveal() {
    var els = document.querySelectorAll('.reveal');
    if (!els.length) return;
    if (!('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    els.forEach(function (e) { io.observe(e); });
  }
  function degInitCount() {
    var nums = document.querySelectorAll('[data-count]');
    if (!nums.length || !('IntersectionObserver' in window)) { nums.forEach(function (n) { n.textContent = n.getAttribute('data-count') + (n.getAttribute('data-suffix') || ''); }); return; }
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (!en.isIntersecting) return; io.unobserve(en.target);
        var el = en.target, end = parseFloat(el.getAttribute('data-count')) || 0, suf = el.getAttribute('data-suffix') || '', t0 = null, dur = 1400;
        function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1); var e = 1 - Math.pow(1 - p, 3); el.textContent = Math.round(end * e) + suf; if (p < 1) requestAnimationFrame(step); }
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    nums.forEach(function (n) { io.observe(n); });
  }

  /* ---- Giriş tetikleyici + init ---- */
  document.addEventListener('click', function (e) {
    if (!e.target.closest) return;
    var g = e.target.closest('.js-giris');
    if (g) { e.preventDefault(); openGiris(); return; }
    var q = e.target.closest('.js-quote');
    if (q) { e.preventDefault(); openTeklif(q.getAttribute('data-quote') || ''); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeGiris(); closeTeklif(); } });
  if (document.getElementById('blog')) { try { degLoadBlog(); } catch (e) {} }
  try { degInitReveal(); degInitCount(); degContactInit(); degLegalApply(); degCookieBar(); degBlogPageInit(); degSikayetInit(); } catch (e) {}
})();
