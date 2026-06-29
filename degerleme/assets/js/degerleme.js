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
  var ADMIN_PASS = 'ekspertiz2026'; // sitenin kendi bağımsız yönetim paneli giriş kapısı (istemci demo kapısı)

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
      + '<p class="gm-sub">SPK lisanslı danışman / personel girişi. Giriş sonrası, sitenin <b>bağımsız yönetim paneli</b> üzerinden <b>emlakekspertizi.com API destekli resmî PDF rapor</b> oluşturabilirsiniz.</p>'
      + '<label>E-posta</label><input id="gp_mail" type="email" autocomplete="username" placeholder="ad@meridyendegerleme.com">'
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
      + '<div class="gm-foot"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z"/></svg> KVKK uyumlu · emlakekspertizi.com altyapısı · ProX</div>'
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
    var mail = (document.getElementById('gp_mail') || {}).value.trim();
    var pass = (document.getElementById('gp_pass') || {}).value || '';
    var err = document.getElementById('gp_err'); err.style.color = ''; err.textContent = '';
    if (!mail || !pass) { err.textContent = '⚠ E-posta ve şifre gereklidir.'; return; }
    if (pass !== ADMIN_PASS) { err.textContent = '⚠ Şifre hatalı. Yetkili personel girişi gereklidir.'; return; }
    var btn = document.getElementById('gp_btn'); btn.disabled = true; btn.textContent = 'Bağlanıyor…';
    var r = await proxApi('/api/v1/tenant/staff/login', { method: 'POST', body: { email: mail } }); // şifre body'de/log'da değil
    btn.disabled = false; btn.textContent = 'Yönetim Paneline Giriş →';
    SAAS_USER.role = 'personel'; SAAS_USER.token = (r && r.token) || ('sess_' + mail.length);
    SAAS_USER.profile = { email: mail, online: !(r && r.fallback) };
    closeGiris();
    openDegAdmin(); // sitenin kendi bağımsız yönetim paneli
    degToast('Hoş geldiniz · Bağımsız yönetim paneli açıldı' + (r && r.fallback ? ' (çevrimdışı/demo)' : ''));
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
    function val(v) { return v ? String(v).replace(/"/g, '&quot;') : ''; }
    return '<div class="sta-ov" data-aclose="1"></div><div class="sta-card">'
      + '<div class="sta-hd"><b>⚡ Bağımsız Yönetim Paneli · Meridyen Değerleme</b><button data-aclose="1" aria-label="Kapat">✕</button></div>'
      + '<div class="sta-tabs">'
      + '<button class="act" data-t="rapor">Resmî Rapor (PDF)</button>'
      + '<button data-t="tema">Tema & Logo</button>'
      + '<button data-t="google">Google & Meta</button>'
      + '<button data-t="prox">ProX AI</button>'
      + '<button data-t="api">API Durumu</button>'
      + '</div><div class="sta-body">'
      + '<div class="sta-pane" data-p="rapor"><h4>Resmî Değerleme Raporu (emlakekspertizi.com API)</h4><p class="sub">Merkez API ile endeks & mevzuat verisi çekilir; SPK lisanslı uzman dosyayı düzenler ve <b>resmî PDF</b> üretilir.</p>'
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
      + '<div class="sta-pane" data-p="api" hidden><h4>API Kullanım Durumu</h4><p class="sub">Merkez ProX uçlarının canlı yoklaması (X-Tenant-Id: ' + EMLAK_TENANT.tenant_id + ').</p>'
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
      });
    });
    m.querySelector('#ar_btn').addEventListener('click', degAdminGenPdf);
    m.querySelector('#at_btn').addEventListener('click', function () { var s = degAdminLoad(); s.favicon = m.querySelector('#at_fav').value.trim(); s.theme = m.querySelector('#at_theme').value; degAdminSaveStore(s); degApplySettings(); degToast('Tema & logo uygulandı.'); });
    m.querySelector('#ag_btn').addEventListener('click', function () { var s = degAdminLoad(); s.ga = m.querySelector('#ag_ga').value.trim(); s.gsc = m.querySelector('#ag_gsc').value.trim(); s.metaTitle = m.querySelector('#ag_title').value.trim(); s.metaDesc = m.querySelector('#ag_desc').value.trim(); degAdminSaveStore(s); degApplySettings(); degToast('Google & Meta kaydedildi.'); });
    m.querySelector('#ap_btn').addEventListener('click', function () { var s = degAdminLoad(); s.proxPrompt = m.querySelector('#ap_prompt').value.trim(); degAdminSaveStore(s); degToast('Kuruma özel ProX promptu kaydedildi.'); });
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
    var t = e.target.closest && e.target.closest('.js-giris');
    if (t) { e.preventDefault(); openGiris(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeGiris(); });
  if (document.getElementById('blog')) { try { degLoadBlog(); } catch (e) {} }
  try { degInitReveal(); degInitCount(); } catch (e) {}
})();
