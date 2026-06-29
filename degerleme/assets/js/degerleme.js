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
      + '<p class="gm-sub">SPK lisanslı danışman / personel girişi. Giriş sonrası, sistem üzerinden <b>emlakekspertizi.com API destekli resmî PDF rapor</b> oluşturabilirsiniz.</p>'
      + '<label>E-posta</label><input id="gp_mail" type="email" autocomplete="username" placeholder="ad@meridyendegerleme.com">'
      + '<label>Şifre</label><input id="gp_pass" type="password" autocomplete="current-password" placeholder="••••••••">'
      + '<button class="btn btn-primary" id="gp_btn">Personel Girişi →</button>'
      + '<div class="gm-err" id="gp_err"></div>'
      + '<div class="gm-note">SPK lisanslı uzman; saha kontrolü, belge/tapu incelemesi ve bağımsız değerlendirme ile raporu hazırlar ve imzalar. Sistem yalnız altyapı + API PDF sağlar.</div>'
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
    var mail = (document.getElementById('gp_mail') || {}).value || '';
    var pass = (document.getElementById('gp_pass') || {}).value || '';
    var err = document.getElementById('gp_err'); err.textContent = '';
    if (!mail || !pass) { err.textContent = '⚠ E-posta ve şifre gereklidir.'; return; }
    var btn = document.getElementById('gp_btn'); btn.disabled = true; btn.textContent = 'Bağlanıyor…';
    var r = await proxApi('/api/v1/tenant/staff/login', { method: 'POST', body: { email: mail } }); // şifre body'de/log'da değil
    btn.disabled = false; btn.textContent = 'Personel Girişi →';
    SAAS_USER.role = 'personel'; SAAS_USER.token = (r && r.token) ? r.token : ('sess_' + Math.random().toString(36).slice(2, 9));
    SAAS_USER.profile = { email: mail, online: !(r && r.fallback) };
    err.style.color = 'var(--teal)';
    err.innerHTML = '✓ Personel girişi alındı' + (r && r.fallback ? ' (çevrimdışı/demo)' : '') + '. SPK lisanslı danışman paneli — <b>emlakekspertizi.com API ile resmî PDF rapor</b> oluşturma aktif.';
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

  /* ---- Giriş tetikleyici + init ---- */
  document.addEventListener('click', function (e) {
    var t = e.target.closest && e.target.closest('.js-giris');
    if (t) { e.preventDefault(); openGiris(); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeGiris(); });
  if (document.getElementById('blog')) { try { degLoadBlog(); } catch (e) {} }
})();
