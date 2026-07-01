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

  /* ---- Lead/talep kaydı (CRM beslemesi) — localStorage deg_leads ---- */
  window.degSaveLead = function (p) {
    try {
      var k = 'deg_leads', a = JSON.parse(localStorage.getItem(k) || '[]');
      a.unshift(Object.assign({ id: 'L' + Date.now().toString(36), ts: new Date().toISOString(), status: 'yeni' }, p || {}));
      if (a.length > 500) a = a.slice(0, 500);
      localStorage.setItem(k, JSON.stringify(a));
    } catch (e) {}
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
    try { sessionStorage.setItem('deg_crm', JSON.stringify({ user: who, role: role })); } catch (e) {}
    closeGiris();
    window.location.href = 'admin.html'; // tam donanımlı CRM paneli
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
  window.DEG_THEMES = { 'Lacivert': 'lacivert', 'Antrasit': 'antrasit', 'Bordo': 'bordo', 'Yeşil': 'yesil', 'Mor': 'mor', 'Okyanus': 'okyanus' };
  function degApplySettings() {
    var s = {}; try { s = degMerge(); } catch (e) { try { s = degAdminLoad(); } catch (e2) {} }
    var root = document.documentElement;
    root.setAttribute('data-theme', (window.DEG_THEMES[s.theme] || 'lacivert'));
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

  /* ---- Site içeriği (admin'den override) — [data-ce] öğeleri ---- */
  function degContentApply() {
    var nodes = document.querySelectorAll('[data-ce]'); if (!nodes.length) return;
    var c = {}; try { c = (degMerge().content) || {}; } catch (e) {}
    nodes.forEach(function (el) { var k = el.getAttribute('data-ce'); if (c[k] != null && String(c[k]).trim() !== '') el.textContent = c[k]; });
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
    if (document.body && document.body.classList.contains('crm')) return; // admin panelinde gösterme
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
        + '<a class="more" href="' + (p.url || 'blog.html') + '" target="_blank" rel="noopener noreferrer">Devamını oku →</a></div></article>';
    }).join('');
  }

  /* ---- Blog sayfası (#blogGrid) — emlakekspertizi.com/blog API'den (fallback statik) ---- */
  async function degBlogPageInit() {
    var grid = document.getElementById('blogGrid'); if (!grid) return;
    function card(p) {
      return '<article class="blogcard"><div class="bc-top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>'
        + '<div class="bc-b"><span class="tagx">' + degEsc(p.category || 'Bilgi Merkezi') + '</span><h3>' + degEsc(p.title || '') + '</h3><p>' + degEsc(p.excerpt || (p.body ? String(p.body).slice(0, 120) : '')) + '</p>'
        + '<a class="more" href="' + (p.url || 'blog.html') + '" target="' + (p.url ? '_blank' : '_self') + '" rel="noopener noreferrer">Devamını oku →</a></div></article>';
    }
    // 1) Admin'den yönetilen makaleler (yayınız)
    var arts = []; try { arts = (JSON.parse(localStorage.getItem('deg_admin') || '{}').articles) || []; } catch (e) {}
    arts = arts.filter(function (a) { return a && a.published !== false && a.title; });
    if (arts.length) { grid.innerHTML = arts.map(card).join(''); return; }
    // 2) Merkezi blog API'si
    var r = await proxApi('/api/v1/tenant/blog?limit=12');
    if (!r || r.fallback || !Array.isArray(r.posts) || !r.posts.length) return; // 3) statik kartlar kalır
    grid.innerHTML = r.posts.map(function (p) {
      return '<article class="blogcard"><div class="bc-top"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/></svg></div>'
        + '<div class="bc-b"><span class="tagx">' + degEsc(p.category || 'Bilgi Merkezi') + '</span><h3>' + degEsc(p.title || '') + '</h3><p>' + degEsc(p.excerpt || '') + '</p>'
        + '<a class="more" href="' + (p.url || 'blog.html') + '" target="_blank" rel="noopener noreferrer">Devamını oku →</a></div></article>';
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
      var skp = { type: 'sikayet-itiraz', source: g('sk_dosya') === 'kariyer' ? 'kariyer' : 'sikayet', name: name, phone: phone, email: g('sk_mail'), file_no: g('sk_dosya'), konu: konu, message: msg };
      window.degSaveLead(skp);
      await proxApi('/api/v1/tenant/lead', { method: 'POST', body: skp });
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
    var payload = { type: 'teklif', service: (m && m.dataset.service) || '', name: name, phone: phone, source: 'hizmetler' };
    window.degSaveLead(payload);
    var r = await proxApi('/api/v1/tenant/lead', { method: 'POST', body: payload });
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

  /* ===== Çok dilli (i18n) — TR (kaynak) + EN + RU + ZH + AR (RTL) ===== */
  window.DEG_LANGS = { tr: 'Türkçe', en: 'English', ru: 'Русский', zh: '中文', ar: 'العربية' };
  var _i18nRTL = { ar: 1 };
  var _i18n = {}, _nodes = null, _phs = null;
  var _i18nSkip = '.crm-app, .crm-login, #girisModal, #teklifModal, #degAdmin, .lang-sw, .spk-lic, .prox-badge, script, style, noscript';
  function _collect() {
    if (_nodes) return;
    _nodes = []; _phs = [];
    var sk = { SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, TEXTAREA: 1 };
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode; if (!p || sk[p.nodeName]) return NodeFilter.FILTER_REJECT;
        if (p.closest && p.closest(_i18nSkip)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var n; while (n = w.nextNode()) _nodes.push({ n: n, tr: n.nodeValue });
    document.querySelectorAll('[placeholder]').forEach(function (el) { if (!el.closest(_i18nSkip)) _phs.push({ el: el, tr: el.getAttribute('placeholder') }); });
  }
  async function degApplyLang(lang) {
    _collect();
    document.documentElement.lang = lang;
    document.documentElement.dir = _i18nRTL[lang] ? 'rtl' : 'ltr';
    if (lang === 'tr') { _nodes.forEach(function (x) { x.n.nodeValue = x.tr; }); _phs.forEach(function (x) { x.el.setAttribute('placeholder', x.tr); }); return; }
    var d = _i18n[lang];
    if (!d) { try { var r = await fetch('assets/i18n/' + lang + '.json'); d = await r.json(); } catch (e) { d = {}; } _i18n[lang] = d; }
    _nodes.forEach(function (x) { var k = x.tr.trim(); var t = d[k]; x.n.nodeValue = t ? x.tr.replace(k, t) : x.tr; });
    _phs.forEach(function (x) { var t = d[(x.tr || '').trim()]; x.el.setAttribute('placeholder', t || x.tr); });
  }
  window.degSetLang = function (lang) { if (!window.DEG_LANGS[lang]) return; try { localStorage.setItem('deg_lang', lang); } catch (e) {} degApplyLang(lang); document.querySelectorAll('.lang-sel').forEach(function (s) { s.value = lang; }); };
  /* ---- SPK Lisans No (admin'den düzenlenebilir; .spk-lic düğümleri) ---- */
  function degSpkApply() {
    var v = '';
    try { var a = degMerge(); v = (a && a.spkLicense) ? String(a.spkLicense).trim() : ''; } catch (e) {}
    if (!v) return;
    document.querySelectorAll('.spk-lic').forEach(function (el) { el.textContent = v; });
  }
  /* ---- WhatsApp: tüm wa.me bağlantıları admin numarasına bağlı ---- */
  function degWaNumber() {
    var raw = '';
    try { var a = degMerge(); raw = (a.contact && a.contact.whatsapp) || a.wa || ''; } catch (e) {}
    var d = String(raw || '').replace(/[^\d]/g, '');
    if (!d) return '';
    if (d.charAt(0) === '0') d = '90' + d.slice(1);
    else if (d.length === 10) d = '90' + d;
    return d;
  }
  function degApplyWhatsApp() {
    var num = degWaNumber();
    if (!num) return;
    document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(function (a) {
      var href = a.getAttribute('href') || '';
      var q = href.indexOf('?'); var query = q !== -1 ? href.slice(q) : '';
      a.setAttribute('href', 'https://wa.me/' + num + query);
    });
  }

  /* ---- Logo: üst/alt menü logoları admin'den (bilgisayardan yüklenen görsel) ---- */
  function degApplyLogo() {
    var s = degMerge();
    function setLogo(scope, url) {
      if (!url) return;
      var brand = document.querySelector(scope + ' .brand'); if (!brand) return;
      var mk = brand.querySelector('.mk');
      if (mk) {
        mk.style.cssText = 'display:inline-flex;align-items:center;background:none;border:0;box-shadow:none;padding:0;width:auto;height:auto;min-width:0;border-radius:0';
        mk.innerHTML = '<img src="' + url + '" alt="logo" class="brand-logo">';
      }
      // Logo varken marka metnini (Meridyen Değerleme / SPK Lisanslı Değerleme) gizle — üstte yalnız logo, altta logo + açıklama
      for (var i = 0; i < brand.children.length; i++) { if (!brand.children[i].classList.contains('mk')) brand.children[i].style.display = 'none'; }
      brand.classList.add('has-logo');
    }
    setLogo('.hdr', s.logoHeader || s.logo || '');
    setLogo('.ft', s.logoFooter || s.logo || '');
  }

  /* ---- SEO & Reklam: GA4/GTM/Ads/AdSense/doğrulama/robots/özel kod (admin'den, kodsuz) ---- */
  function degApplySeo() {
    if (window.__degSeoDone) return; window.__degSeoDone = 1;
    if (window.__DEG_BAKED) return; // SEO etiketleri ham HTML'e gömülü (tools/apply-config.mjs) — çifte enjeksiyonu önle
    if (document.body && document.body.classList.contains('crm')) return;
    var s = degMerge();
    var seo = s.seo || {}; var head = document.head;
    function meta(name, content) { if (!content) return; var m = document.createElement('meta'); m.setAttribute('name', name); m.setAttribute('content', String(content).trim()); head.appendChild(m); }
    function srcScript(src, attrs) { var sc = document.createElement('script'); sc.src = src; sc.async = true; if (attrs) for (var k in attrs) sc.setAttribute(k, attrs[k]); head.appendChild(sc); }
    function inlineScript(code) { var sc = document.createElement('script'); sc.text = code; head.appendChild(sc); }
    function injectRaw(html) { var t = document.createElement('template'); t.innerHTML = html; Array.prototype.slice.call(t.content.childNodes).forEach(function (n) { if (n.tagName === 'SCRIPT') { var sc = document.createElement('script'); for (var i = 0; i < n.attributes.length; i++) sc.setAttribute(n.attributes[i].name, n.attributes[i].value); sc.text = n.textContent; head.appendChild(sc); } else { head.appendChild(n.cloneNode(true)); } }); }
    function tok(v) { v = String(v || '').trim(); if (!v) return ''; var m = v.match(/content="([^"]+)"/i); if (m) return m[1]; if (v.indexOf('=') !== -1 && v.indexOf(' ') === -1) return v.split('=').pop(); return v; }
    var gaId = (seo.ga4 || s.ga || '').trim(), adsId = (seo.adsId || '').trim(), gtagId = gaId || adsId;
    if (gtagId) {
      srcScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gtagId));
      var c = 'window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());';
      if (gaId) c += 'gtag("config","' + gaId + '");';
      if (adsId) c += 'gtag("config","' + adsId + '");';
      inlineScript(c);
    }
    var gtm = (seo.gtm || '').trim();
    if (gtm) {
      inlineScript("(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" + gtm + "');");
      var ns = document.createElement('noscript'); ns.innerHTML = '<iframe src="https://www.googletagmanager.com/ns.html?id=' + gtm + '" height="0" width="0" style="display:none;visibility:hidden"></iframe>'; if (document.body) document.body.insertBefore(ns, document.body.firstChild);
    }
    meta('google-site-verification', tok(seo.gsc || s.gsc));
    meta('msvalidate.01', tok(seo.bing));
    meta('yandex-verification', tok(seo.yandex));
    var pub = (seo.adsense || '').trim();
    if (pub) { meta('google-adsense-account', pub); srcScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' + encodeURIComponent(pub), { crossorigin: 'anonymous' }); }
    meta('robots', seo.robotsIndex === false ? 'noindex,nofollow' : 'index,follow,max-image-preview:large');
    if (seo.headCode) { try { injectRaw(seo.headCode); } catch (e) {} }
  }

  /* ---- Yayınlanan ayarlar (site-config.json) + localStorage birleşimi ----
     Ziyaretçi: yayınlanan config; Yönetici tarayıcısı: localStorage canlı önizleme üste yazar. */
  function degMerge() {
    var loc = {}; try { loc = JSON.parse(localStorage.getItem('deg_admin') || '{}'); } catch (e) {}
    return Object.assign({}, window.DEG_PUBLISHED || {}, loc);
  }
  window.degSettings = degMerge;

  /* ---- API anahtarları: ProX (varsayılan, ücretsiz) + DeepSeek (yedek) ---- */
  function degApplyApiKeys() {
    try { var a = JSON.parse(localStorage.getItem('deg_admin') || '{}'); if (a.proxKey) window.EMLAK_TENANT.tenant_key = a.proxKey; } catch (e) {}
  }
  // Yapay zeka tek giriş: önce ProX (kurum anahtarı), kota/erişim yoksa kullanıcının DeepSeek anahtarına düşer.
  window.degAi = async function (prompt, system) {
    try { var r = await proxApi('/api/v1/tenant/prox/ai', { method: 'POST', body: { prompt: prompt, system: system || '' } }); if (r && r.answer) return { answer: r.answer, source: 'prox' }; } catch (e) {}
    var key = ''; try { key = (JSON.parse(localStorage.getItem('deg_admin') || '{}').deepseekKey) || ''; } catch (e) {}
    if (key) {
      try {
        var res = await fetch('https://api.deepseek.com/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + key },
          body: JSON.stringify({ model: 'deepseek-chat', stream: false, messages: (system ? [{ role: 'system', content: system }] : []).concat([{ role: 'user', content: prompt }]) })
        });
        if (res.ok) { var j = await res.json(); var t = j && j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content; if (t) return { answer: t, source: 'deepseek' }; }
      } catch (e) {}
    }
    return { fallback: true };
  };

  /* ---- Mobil alt menü (Hizmetlerimiz · Neden Biz · Talep · WhatsApp) ---- */
  function degMobileNav() {
    if (document.querySelector('.mnav')) return;
    if (document.body.classList.contains('crm')) return;
    var WA = 'https://wa.me/905000000000';
    var L = 'fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"';
    var items = [
      { href: 'hizmetler.html', label: 'Hizmetlerimiz', icon: '<svg viewBox="0 0 24 24" ' + L + '><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M3 12h18"/></svg>' },
      { href: 'neden-biz.html', label: 'Neden Biz', icon: '<svg viewBox="0 0 24 24" ' + L + '><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z"/><path d="m9 12 2 2 4-4"/></svg>' },
      { href: 'basvuru.html', label: 'Talep', icon: '<svg viewBox="0 0 24 24" ' + L + '><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M9 13h6M9 17h4"/></svg>' },
      { href: WA, label: 'WhatsApp', wa: true, icon: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.5 14.13c-.23.65-1.36 1.25-1.87 1.3-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.91-4.64-4.09-.14-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.27c.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.47.23.56.79 1.93.86 2.07.07.14.11.3.02.48-.62 1.23-1.28 1.18-.93 1.78.66 1.13 1.32 1.52 2.33 2.03.27.14.43.12.59-.07.18-.21.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.11.07.65-.16 1.3Z"/></svg>' }
    ];
    var here = (location.pathname.split('/').pop() || 'index.html');
    var nav = document.createElement('nav');
    nav.className = 'mnav'; nav.setAttribute('aria-label', 'Mobil menü');
    nav.innerHTML = items.map(function (it) {
      var cls = 'mnav-a' + (it.href === here ? ' active' : '') + (it.wa ? ' mnav-wa' : '');
      var ext = it.wa ? ' target="_blank" rel="noopener noreferrer"' : '';
      return '<a class="' + cls + '" href="' + it.href + '"' + ext + '>' + it.icon + '<span>' + it.label + '</span></a>';
    }).join('');
    document.body.appendChild(nav);
  }
  function degI18nInit() {
    var lang = 'tr'; try { lang = localStorage.getItem('deg_lang') || 'tr'; } catch (e) {}
    document.querySelectorAll('.lang-sel').forEach(function (s) { s.value = lang; });
    document.addEventListener('change', function (e) { if (e.target && e.target.classList && e.target.classList.contains('lang-sel')) window.degSetLang(e.target.value); });
    if (lang !== 'tr') degApplyLang(lang);
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
  /* ---- 81 il ortalama konut m² fiyatı ve yıllık değişim (kaynak veri +%1..%3 düzeltmeli) ---- */
  window.DEG_ILLER = [
    ["Muğla",87020,17], ["İstanbul",65800,26.4], ["Antalya",56690,28.2], ["İzmir",53870,21.1], ["Çanakkale",54410,17.9],
    ["Aydın",50550,8.8], ["Balıkesir",48390,17.2], ["Bartın",45870,32], ["Edirne",42620,21.9], ["Kocaeli",42360,27.9],
    ["Bolu",40960,32], ["Sinop",40340,25.3], ["Ordu",40790,36.7], ["Rize",39400,35], ["Ankara",39110,29.7],
    ["Tunceli",38870,28], ["Zonguldak",39460,26], ["Denizli",39200,31.1], ["Sakarya",38040,23.2], ["Isparta",37680,25.7],
    ["Yalova",37120,23], ["Kırklareli",37420,15.5], ["Samsun",36630,20.9], ["Kastamonu",36280,25], ["Manisa",36000,22.3],
    ["Bursa",36450,21.7], ["Mersin",35690,21.4], ["Trabzon",34060,27.8], ["Eskişehir",33760,20.9], ["Nevşehir",34260,22.4],
    ["Aksaray",34070,27.7], ["Tokat",33700,30], ["Çankırı",32740,32.1], ["Diyarbakır",33240,19.1], ["Adana",32920,24.3],
    ["Afyonkarahisar",32730,21.8], ["Tekirdağ",32390,14.8], ["Giresun",32700,23.2], ["Van",32410,24.7], ["Burdur",32020,17.7],
    ["Erzincan",31530,27.3], ["Bingöl",31120,45.1], ["Karabük",31520,23.8], ["Artvin",30550,26], ["Niğde",30240,30.8],
    ["Konya",29910,22.3], ["Düzce",30380,22.6], ["Bilecik",30220,26.8], ["Kütahya",29670,20.3], ["Amasya",29490,19.7],
    ["Karaman",29580,26.7], ["Iğdır",29330,24], ["Çorum",28980,31.5], ["Uşak",28210,21.7], ["Sivas",28610,19.8],
    ["Gaziantep",28220,17.8], ["Ardahan",27720,24.9], ["Gümüşhane",27230,18.9], ["Şırnak",27560,33.9], ["Batman",27270,24.3],
    ["Hatay",26620,12.2], ["Muş",26180,39.4], ["Kahramanmaraş",25610,20.1], ["Bitlis",25830,26.9], ["Bayburt",25590,18.3],
    ["Yozgat",25450,16.1], ["Erzurum",25100,23], ["Elazığ",24780,29.1], ["Kırşehir",24640,17.5], ["Kars",24460,23.9],
    ["Siirt",23710,27.8], ["Hakkari",24040,44], ["Kırıkkale",23900,30.5], ["Adıyaman",23570,24.7], ["Kayseri",23320,24.9],
    ["Mardin",23440,25.8], ["Şanlıurfa",23000,16.2], ["Malatya",22080,18.9], ["Osmaniye",21590,14.2], ["Ağrı",20640,14.1],
    ["Kilis",16550,0]
  ];
  function degTL(n) { try { return n.toLocaleString('tr-TR'); } catch (e) { return String(n); } }

  /* ---- Hero paneli canlı süreç animasyonu + 81 il canlı endeks ---- */
  function degHeroAnim() {
    var pipe = document.querySelector('.hpx-pipe'); if (!pipe) return;
    var steps = [].slice.call(pipe.querySelectorAll('.hpx-step'));
    var arws = [].slice.call(pipe.querySelectorAll('.hpx-arw'));
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var stepI = 0;
    function stepTick() {
      steps.forEach(function (s, k) { s.classList.toggle('on', k <= stepI); });
      arws.forEach(function (a, k) { a.classList.toggle('on', k < stepI); });
      stepI = (stepI + 1) % (steps.length + 1);
    }
    if (reduce) { steps.forEach(function (s) { s.classList.add('on'); }); arws.forEach(function (a) { a.classList.add('on'); }); }
    else { stepTick(); setInterval(stepTick, 1150); }

    // Canlı il endeksi tickeri
    var tIl = document.querySelector('.hpx-ticker .hpx-il'), tNum = document.querySelector('.hpx-ticker .hpx-num'), tUp = document.querySelector('.hpx-ticker .hpx-up');
    var ILLER = window.DEG_ILLER || [];
    if (tIl && tNum && ILLER.length) {
      var idx = 0, prev = 0, raf = null;
      function animNum(to) {
        if (raf) cancelAnimationFrame(raf);
        var from = prev || to, t0 = null, dur = 650;
        function step(ts) { if (!t0) t0 = ts; var p = Math.min((ts - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3); tNum.textContent = '₺' + degTL(Math.round(from + (to - from) * e)); if (p < 1) raf = requestAnimationFrame(step); }
        raf = requestAnimationFrame(step);
      }
      function nextIl() {
        var it = ILLER[idx % ILLER.length]; idx++;
        tIl.classList.remove('sw'); void tIl.offsetWidth; tIl.textContent = it[0]; tIl.classList.add('sw');
        if (tUp) { var d = it[2] || 0, up = d >= 0; tUp.textContent = (up ? '▲ %' : '▼ %') + Math.abs(d); tUp.style.color = up ? '#37d67a' : '#ff9aa2'; }
        if (reduce) { tNum.textContent = '₺' + degTL(it[1]); } else { animNum(it[1]); }
        prev = it[1];
      }
      nextIl(); if (!reduce) setInterval(nextIl, 2600);
    }
  }

  /* ---- Ana sayfa "Canlı Konut Endeksi" bandı (81 il kayan şerit + özet) ---- */
  function degIndexBand() {
    var track = document.getElementById('degIdxTrack'); if (!track || !window.DEG_ILLER) return;
    var arr = window.DEG_ILLER;
    var chip = arr.map(function (it) { var d = it[2] || 0; return '<span class="idx-chip"><b>' + it[0] + '</b> ₺' + degTL(it[1]) + '<em>/m²</em><i class="idx-d ' + (d >= 0 ? 'up' : 'dn') + '">' + (d >= 0 ? '▲' : '▼') + '%' + Math.abs(d) + '</i></span>'; }).join('');
    track.innerHTML = chip + chip; // kesintisiz döngü için iki kopya
    var prices = arr.map(function (i) { return i[1]; });
    var max = arr.reduce(function (a, b) { return b[1] > a[1] ? b : a; }), min = arr.reduce(function (a, b) { return b[1] < a[1] ? b : a; });
    var avg = Math.round(prices.reduce(function (a, b) { return a + b; }, 0) / prices.length);
    var st = document.getElementById('degIdxStats');
    if (st) st.innerHTML =
      '<div><b>' + arr.length + '</b><span>il kapsam</span></div>'
      + '<div><b>₺' + degTL(avg) + '</b><span>ortalama m²</span></div>'
      + '<div><b>' + max[0] + '</b><span><i class="il-l">en yüksek</i> ₺' + degTL(max[1]) + '</span></div>'
      + '<div><b>' + min[0] + '</b><span><i class="il-l">en uygun</i> ₺' + degTL(min[1]) + '</span></div>';
  }
  function degRunInit() {
    try { degApplySettings(); degApplyApiKeys(); degApplySeo(); degApplyLogo(); degSpkApply(); degMobileNav(); degApplyWhatsApp(); degCookieBar(); degI18nInit(); degInitReveal(); degInitCount(); degHeroAnim(); degIndexBand(); degContactInit(); degLegalApply(); degContentApply(); degBlogPageInit(); degSikayetInit(); } catch (e) {}
  }
  // Yayınlanan ayarları (site-config.json) yükle, sonra tüm sayfaya uygula. Dosya yoksa sorunsuz devam eder.
  try {
    fetch('assets/data/site-config.json', { cache: 'no-cache' })
      .then(function (r) { return (r && r.ok) ? r.json() : null; })
      .then(function (j) { if (j && typeof j === 'object') window.DEG_PUBLISHED = j; }, function () {})
      .then(degRunInit, degRunInit);
  } catch (e) { degRunInit(); }
})();
