/* ===================================================================
   smoke-test.js — Tarayıcı DOM-akış smoke testi (canlı SPA'ya karşı)
   Kullanım (gayrimenkul.html açıkken, konsolda):
     fetch('smoke-test.js').then(r=>r.text()).then(eval).then(()=>runSmokeTests())
   veya sayfaya <script src="smoke-test.js"></script> ekleyip runSmokeTests().
   NOT: Bu test sayfa durumunu MUTASYONA uğratır (tanılama amaçlı) —
   üretim değil, doğrulama ortamında çalıştırın. Sonunda özet döndürür.
   Saf/headless kısımlar için: `bun smoke-test.mjs`.
   =================================================================== */
window.runSmokeTests = async function(){
  var R=[], P=0, F=0;
  function ok(n,c){ R.push((c?'✅ ':'❌ ')+n); c?P++:F++; return c; }

  /* 0) Altyapı */
  ok('TRG (gramer modülü) yüklü', !!window.TRG && typeof window.TRG.city==='function');
  ok('wlCity fonksiyonu var', typeof wlCity==='function');

  /* 1) İl swap → PROVINCE + BAZ yeniden kurulur */
  if(typeof applyProvince==='function'){
    applyProvince('Trabzon');
    ok('il swap: PROVINCE.name=Trabzon', typeof PROVINCE!=='undefined' && PROVINCE.name==='Trabzon');
    ok('il swap: BAZ dolu', typeof BAZ!=='undefined' && Object.keys(BAZ||{}).length>0);
  }

  /* 2) Marka + şehir sweep = 0 kalıntı (white-label çekirdeği) */
  try{
    if(typeof FIRMA!=='undefined'){ FIRMA.name='Trabzon Elite Gayrimenkul'; }
    if(typeof applyBrand==='function') applyBrand(FIRMA.name);
    if(typeof brandSweep==='function') brandSweep(document.body);
    await new Promise(function(r){ setTimeout(r,300); });
    var t=document.body.innerText;
    ok('marka sweep: 0 kalan "Meridyen"', (t.match(/Meridyen/g)||[]).length===0);
    ok('şehir sweep: 0 kalan "İzmir"', (t.match(/İzmir|İZMİR/g)||[]).length===0);
    ok('logo tam firma adı', ((document.querySelector('.js-logo')||{}).textContent||'').indexOf('Trabzon Elite')>=0);
  }catch(e){ ok('marka/şehir sweep', false); }

  /* 3) EİDS yayın kapısı — yetki mekanizması yerinde */
  ok('EİDS doğrulama fonksiyonu (eidsVerify)', typeof eidsVerify==='function');
  ok('EİDS yetki bayrağı (FIRMA.eids.yetkili)', typeof FIRMA!=='undefined' && FIRMA.eids && ('yetkili' in FIRMA.eids));

  /* 4) KVKK/yasal per-firma otomatik dolum */
  if(typeof legalDoc==='function'){
    var kv=legalDoc('kvkk');
    ok('KVKK firma unvanı/adı dolu', kv.body.indexOf(FIRMA.name)>=0 || kv.body.indexOf('Trabzon Elite')>=0);
    ok('Çerez + Mesafeli doküman var', legalDoc('cerez').title.length>0 && legalDoc('mesafeli').title.length>0);
  }

  /* 5) AI güvenlik korkuluğu */
  if(typeof aiRiskScan==='function'){
    ok('AI risk: garanti getiri yakalanır', aiRiskScan('%30 garanti getiri sağlar').length>0);
    ok('AI risk: temiz metin 0 uyarı', aiRiskScan('Bölgede ulaşım ve altyapı gelişmiştir.').length===0);
  }

  /* 6) Paket/özellik kilidi */
  if(typeof admPaneGated==='function' && typeof EMLAK_PACKAGES!=='undefined'){
    var pc=window.EMLAK_TENANT.packageCode, pf=window.EMLAK_TENANT.enabledFeatures;
    window.EMLAK_TENANT.packageCode='BASIC'; window.EMLAK_TENANT.enabledFeatures=EMLAK_PACKAGES.BASIC;
    ok('BASIC: tema paneli kilitli', admPaneGated('tema')===true);
    window.EMLAK_TENANT.packageCode='ENTERPRISE'; window.EMLAK_TENANT.enabledFeatures=EMLAK_PACKAGES.ENTERPRISE;
    ok('ENTERPRISE: tema paneli açık', admPaneGated('tema')===false);
    window.EMLAK_TENANT.packageCode=pc; window.EMLAK_TENANT.enabledFeatures=pf;
  }

  /* 7) Analitik + A/B + Proxy güvenlik + Süper-admin */
  ok('Analitik (trackEvent)', typeof trackEvent==='function');
  ok('A/B (abVariant)', typeof abVariant==='function' && ['A','B'].indexOf(abVariant())>=0);
  ok('Proxy güvenlik modu bayrağı', 'EMLAK_PROXY_MODE' in window);
  ok('Süper-admin bayi paneli', typeof openSuperAdmin==='function');

  /* 8) Çok dilli */
  ok('Çok dilli (gmLang)', typeof gmLang==='function');

  console.log(R.join('\n'));
  console.log('\n'+P+' geçti, '+F+' başarısız'+(F?'':' ✓'));
  return { pass:P, fail:F, results:R };
};
