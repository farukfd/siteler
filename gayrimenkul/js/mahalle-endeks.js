/* ============================================================================
   gayrimenkul — MAHALLE ENDEKSİ bootstrap → shared/mahalle-endeks.js
   Ortak modülü gm globalleriyle (proxApi · PROVINCE · OZEL · bzMahalle · goView ·
   ozLead · waHref) #mahEndeks host'una bağlar. gm veri kalitesi bzMahalle=localModel
   ile korunur. app.js + shared/mahalle-endeks.js'ten SONRA yüklenir.
   ========================================================================== */
(function () {
  'use strict';
  var _inst = null;
  function _PROV() { return (typeof PROVINCE !== 'undefined' && PROVINCE) ? PROVINCE : null; }
  function districts() {
    var d = {};
    try { var P = _PROV(); if (P && P.districts) Object.keys(P.districts).forEach(function (k) { d[k] = ((P.districts[k] && P.districts[k].mah) || []).slice(); }); } catch (e) {}
    return d;
  }
  function servedDistricts() {
    /* SERVICE_AREA farkındalığı: yalnız hizmet verilen ilçe/mahalle (varsa) */
    var d = districts();
    try {
      if (typeof saServedIlce === 'function') {
        var prov = (_PROV() && PROVINCE.name) || 'İzmir';
        var si = saServedIlce(prov);
        if (si && si.length) { var f = {}; si.forEach(function (k) { if (d[k]) f[k] = (typeof saServedMahalle === 'function' && saServedMahalle(prov, k) || d[k]); }); if (Object.keys(f).length) return f; }
      }
    } catch (e) {}
    return d;
  }
  function boot() {
    var host = document.getElementById('mahEndeks');
    if (!host || !window.MahalleEndeks) return;
    if (_inst) { try { _inst.refresh(); } catch (e) {} return; }
    var accent = '';
    try { accent = (getComputedStyle(document.documentElement).getPropertyValue('--accent') || '').trim(); } catch (e) {}
    _inst = window.MahalleEndeks.mount(host, {
      proxApi: function (u, o) { return (typeof proxApi === 'function') ? proxApi(u, o) : Promise.resolve(null); },
      province: function () { return (_PROV() && PROVINCE.name) || 'İzmir'; },
      districts: servedDistricts,
      ozData: function () { return (typeof OZEL !== 'undefined' && OZEL) || []; },
      localModel: function (ilce, mah) { try { return (typeof bzMahalle === 'function') ? bzMahalle(ilce, mah) : null; } catch (e) { return null; } },
      goOzel: function () { try { if (typeof goView === 'function') goView('ozel'); } catch (e) {} },
      onLead: function (id) { try { if (id && typeof ozLead === 'function') ozLead(id); else if (typeof goView === 'function') goView('ozel'); } catch (e) {} },
      waHref: function (t) { try { return (typeof waHref === 'function') ? waHref(t) : '#'; } catch (e) { return '#'; } },
      accent: accent || '#0e7c86',
      hideOzelBand: true   /* gm ana sayfa: endeks widget'ta özel/sokak bant KAPALI — özel portföy alttaki tek-tip fırsat kartlarıyla */
    });
  }
  /* geriye dönük stub'lar (eski markup onchange'leri) */
  window.mahEndeksBoot = boot; window.mahEndeksIlce = function () {}; window.mahEndeksRender = function () {};
  /* renderOzHome her çalıştığında paneli tazele (il değişimi / admin) */
  var _orig = window.renderOzHome;
  window.renderOzHome = function () { try { if (_orig) _orig.apply(this, arguments); } catch (e) {} try { boot(); } catch (e) {} };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', function () { setTimeout(boot, 120); });
  else setTimeout(boot, 120);
  window.addEventListener('load', function () { setTimeout(boot, 240); });
})();
