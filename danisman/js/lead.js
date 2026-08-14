/* ============================================================================
   ORTAK LEAD TESLİMATI — dn_leads (admin) + ProX /tenant/lead (sunucu) + WhatsApp
   ----------------------------------------------------------------------------
   Tek kaynak. Kullananlar: iletisim.html, prox-asistan.html.
   (ozel-portfoy.html kendi ozTalep akışını kullanır; index.html SPA submitLead.)

   dn_leads şeması, admin panelinin okuduğu alanlarla BİREBİR olmalı
   (js/app.js · renderGorusmelerD + crmFromLead):
       { id, ts, date, name, phone, email, konu, msg, src }

   Teslimat üç kanaldan yürür:
     1) localStorage dn_leads  → admin "Görüşmeler & Talepler" panosu (kesin)
     2) ProX POST /api/v1/tenant/lead → sunucu CRM (best-effort, CORS açık)
     3) WhatsApp deep-link (ön-dolu mesaj) → danışmanın telefonuna anında (kesin)
   ========================================================================== */
if(typeof window!=='undefined'&&window.EMLAK_PROXY_MODE===undefined)window.EMLAK_DEMO=true;/* üretim paketinde FALSE — sessiz fallback ve tarayıcı-anahtar akışları kapanır */
(function () {
  'use strict';

  var API_BASE = (typeof window !== 'undefined' && window.EMLAK_API_BASE) ||
                 'https://www.emlakekspertizi.com';

  /* ProX kiracı kimliği: sabit "consultant" varsayılanı → window.EMLAK_TENANT →
     tenant kimliği SUNUCUDA Host'tan çözülür (P0). */
  function tenant() {
    var t = {
      tenant_id: 'consultant',
      veriYetki: ''
    };
    try {
      if (window.EMLAK_TENANT) {
        if (window.EMLAK_TENANT.tenant_id) t.tenant_id = window.EMLAK_TENANT.tenant_id;
        if (window.EMLAK_TENANT.veriYetki) t.veriYetki = window.EMLAK_TENANT.veriYetki;
      }
    } catch (e) {}
    try {
      /* P0: tenant anahtarı tarayıcıdan okunmaz */ }catch (e) {}
    return t;
  }

  /* WhatsApp numarası: admin dn_iletisim.wa → yoksa firma varsayılanı. */
  function waNum() {
    try {
      var c = JSON.parse(localStorage.getItem('dn_iletisim') || 'null');
      if (c && c.wa) return ('' + c.wa).replace(/[^\d]/g, '');
    } catch (e) {}
    return '905320000000';
  }

  function esc(s) { return ('' + (s == null ? '' : s)).trim(); }

  /* Esnek alan adlarını kanonik dn_leads kaydına indirger. */
  function normalize(p) {
    p = p || {};
    return {
      id: 'l' + Date.now() + Math.floor(Math.random() * 1000),
      ts: Date.now(),
      date: new Date().toLocaleString('tr-TR'),
      name: esc(p.name),
      phone: esc(p.phone || p.tel),
      email: esc(p.email || p.mail),
      konu: esc(p.konu),
      msg: esc(p.msg || p.mesaj || p.message),
      src: esc(p.src || p.source) || 'form'
    };
  }

  function store(rec) {
    try {
      var K = 'dn_leads';
      var a = JSON.parse(localStorage.getItem(K) || '[]');
      if (!Array.isArray(a)) a = [];
      a.unshift(rec);
      localStorage.setItem(K, JSON.stringify(a.slice(0, 300)));
    } catch (e) {}
    /* Admin sekmesi açıksa panoyu canlı tazele. */
    try { if (typeof window.renderGorusmelerD === 'function') window.renderGorusmelerD(); } catch (e) {}
  }

  /* Sunucuya best-effort gönderim. İki şema üst kümesi (ozel-portfoy'un düz
     alanları + index SPA'nın yapılandırılmış alanları) tek gövdede. */
  function postProx(rec) {
    try {
      var t = tenant();
      return fetch(API_BASE + '/api/v1/tenant/lead', {
        method: 'POST',
        mode: 'cors',
        headers: (function(){return {'Content-Type':'application/json'};})()/* P0: tenant kimliği/anahtarı istemciden gitmez */,
        body: JSON.stringify({
          name: rec.name, phone: rec.phone, email: rec.email,
          konu: rec.konu, mesaj: rec.msg, message: rec.msg,
          kaynak: rec.src, sourcePage: 'danisman', formType: rec.src
        })
      }).catch(function () {});
    } catch (e) { return null; }
  }

  /* Ön-dolu WhatsApp mesajı. */
  function waUrl(rec) {
    var parts = [];
    parts.push('Merhaba' + (rec.name ? (', ben ' + rec.name) : '') + '.');
    if (rec.konu) parts.push('Konu: ' + rec.konu + '.');
    if (rec.msg) parts.push(rec.msg);
    if (rec.phone) parts.push('Tel: ' + rec.phone);
    return 'https://wa.me/' + waNum() + '?text=' + encodeURIComponent(parts.join(' '));
  }

  /* Ana giriş noktası.
     submit(payload, opts) → { rec, whatsappUrl }
     opts.openWhatsApp:true ise WhatsApp'ı hemen açar. */
  function submit(payload, opts) {
    opts = opts || {};
    var rec = normalize(payload);
    store(rec);
    postProx(rec);
    var url = waUrl(rec);
    if (opts.openWhatsApp) { try { window.open(url, '_blank', 'noopener'); } catch (e) {} }
    return { rec: rec, whatsappUrl: url };
  }

  window.dnLead = { submit: submit, waUrl: waUrl, waNum: waNum, normalize: normalize };
})();
