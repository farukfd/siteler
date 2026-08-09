/* =====================================================================
   shared/eids.js — Gerçek EİDS (Elektronik İlan Doğrulama Sistemi) istemci modülü
   ---------------------------------------------------------------------
   EİDS, T.C. Ticaret Bakanlığı tarafından işletilen resmî bir sistemdir.
   15 Şubat 2026'dan itibaren tüm gayrimenkul ilanlarında doğrulama zorunludur.

   BU MODÜLÜN SÖZÜ:
   • Doğrulama kodu / durumu UYDURMAZ.
   • Doğrulamayı NADAS'ın kendi sunucusuna (emlakekspertizi.com / ProX) devreder;
     asıl doğrulama orada Bakanlık + e-Devlet entegrasyonu ile yapılır.
   • Canlı EİDS ucu bağlı değilse durum dürüstçe "beklemede" kalır —
     ASLA sahte "doğrulandı" gösterilmez, sahte kod basılmaz.

   Gerçek akış (Bakanlık):
   • Malik / 1.-2. derece yakını / eş → tapudaki "Taşınmaz No" + İl/İlçe/Ada/Parsel.
   • Emlak işletmesi → "Taşınmaz Ticareti Yetki Belgesi No" + malikin e-Devlet yetkisi.
   • İlan yalnız bu kişilerce girilebilir; doğrulanan ilan EİDS rozeti taşır.
   ===================================================================== */
(function(){
  'use strict';
  var STATES={ BEKLEMEDE:'beklemede', DOGRULANDI:'dogrulandi', REDDEDILDI:'reddedildi' };
  var LABEL={ beklemede:'EİDS Doğrulama Bekliyor', dogrulandi:'EİDS Doğrulandı', reddedildi:'EİDS Doğrulanamadı' };
  /* Kim ilan verebilir (gerçek EİDS malik tipleri) */
  var MALIK_TIPLERI=[
    {k:'malik',   ad:'Malik (tapu sahibi)'},
    {k:'yakin',   ad:'Malikin 1.–2. derece yakını / eşi'},
    {k:'isletme', ad:'Yetki verilen emlak işletmesi'}
  ];
  /* Canlı doğrulama ucu — backend hazır olduğunda buraya cevap döner. */
  var VERIFY_PATH='/api/v1/tenant/eids/verify';

  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function todayISO(){try{return new Date().toISOString().slice(0,10);}catch(e){return '';}}
  function digits(s){return String(s==null?'':s).replace(/[^\d]/g,'');}

  function shield(sz){sz=sz||14;return '<svg class="eids-shield" width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="M9 12l2 2 4-4"/></svg>';}

  /* Doğrulanmamış (beklemede) yeni kayıt — alanlar kullanıcıdan gelir, kod UYDURULMAZ. */
  function newRecord(f){
    f=f||{};
    return {
      status:      STATES.BEKLEMEDE,
      tasinmazNo:  (f.tasinmazNo!=null?String(f.tasinmazNo):''),
      il:          f.il||'', ilce:f.ilce||'', ada:(f.ada!=null?String(f.ada):''), parsel:(f.parsel!=null?String(f.parsel):''),
      malikTip:    f.malikTip||'malik',
      yetkiBelgeNo:(f.yetkiBelgeNo!=null?String(f.yetkiBelgeNo):''),
      referans:    '',          // backend gerçek doğrulama referansı döndürürse buraya
      tarih:       '',
      mesaj:       'Henüz doğrulanmadı — “EİDS Doğrula” ile Ticaret Bakanlığı sistemine gönderin.'
    };
  }

  /* Zorunlu alan kontrolü (gerçek EİDS zorunlulukları). Eksikleri dizi döndürür. */
  function eksikAlanlar(rec){
    var eksik=[];
    if(!digits(rec.tasinmazNo))eksik.push('Taşınmaz No');
    if(!String(rec.il).trim())eksik.push('İl');
    if(!String(rec.ilce).trim())eksik.push('İlçe');
    if(!digits(rec.ada))eksik.push('Ada');
    if(!digits(rec.parsel))eksik.push('Parsel');
    if(rec.malikTip==='isletme'&&!digits(rec.yetkiBelgeNo))eksik.push('Yetki Belgesi No');
    return eksik;
  }

  /* GERÇEK doğrulama: alanları backend'e gönderir. proxApi yoksa/canlı değilse dürüst 'beklemede'. */
  function verify(fields){
    var rec=newRecord(fields);
    var eksik=eksikAlanlar(rec);
    if(eksik.length){
      rec.status=STATES.BEKLEMEDE;
      rec.mesaj='Doğrulama için eksik alan: '+eksik.join(', ')+'.';
      return Promise.resolve(rec);
    }
    var body={ tasinmazNo:digits(rec.tasinmazNo), il:rec.il, ilce:rec.ilce, ada:digits(rec.ada), parsel:digits(rec.parsel), malikTip:rec.malikTip, yetkiBelgeNo:digits(rec.yetkiBelgeNo) };
    if(typeof proxApi!=='function'){
      rec.status=STATES.BEKLEMEDE;
      rec.mesaj='Canlı EİDS bağlantısı bekleniyor — doğrulama Ticaret Bakanlığı sistemi üzerinden yapılır.';
      return Promise.resolve(rec);
    }
    var live=Promise.resolve(proxApi(VERIFY_PATH,{method:'POST',body:body})).then(function(r){
      /* Canlı backend gerçek sonucu döndürdü mü? (fallback = demo/sahte → kabul etme) */
      if(r&&r.success===true&&!r.fallback&&r.data){
        var d=r.data;
        var st=(d.status||(d.dogrulandi===true?STATES.DOGRULANDI:(d.dogrulandi===false?STATES.REDDEDILDI:''))||'').toLowerCase();
        if(st===STATES.DOGRULANDI||st===STATES.REDDEDILDI||st===STATES.BEKLEMEDE){
          rec.status=st;
          rec.referans=d.referans||d.dogrulamaNo||d.eidsNo||'';
          rec.tarih=d.tarih||todayISO();
          rec.mesaj=d.mesaj||(st===STATES.DOGRULANDI?'İlan Ticaret Bakanlığı EİDS sisteminde doğrulandı.':st===STATES.REDDEDILDI?'Doğrulama başarısız — taşınmaz/yetki bilgileri eşleşmedi.':'Doğrulama sürüyor.');
          return rec;
        }
      }
      /* Canlı sonuç yok → dürüst beklemede (sahte onay YOK) */
      rec.status=STATES.BEKLEMEDE;
      rec.mesaj='Canlı EİDS bağlantısı bekleniyor — doğrulama Ticaret Bakanlığı sistemi üzerinden yapılır.';
      return rec;
    }).catch(function(){
      rec.status=STATES.BEKLEMEDE;
      rec.mesaj='EİDS servisine ulaşılamadı — doğrulama daha sonra tekrar denenecek.';
      return rec;
    });
    /* 6 sn timeout → asılı kalma yok */
    var to=new Promise(function(res){setTimeout(function(){var r2=newRecord(fields);r2.status=STATES.BEKLEMEDE;r2.mesaj='EİDS servisi zaman aşımına uğradı — doğrulama beklemede.';res(r2);},6000);});
    return Promise.race([live,to]);
  }

  /* Yayın kapısı: yalnız GERÇEKTEN doğrulanmış ilan yayınlanabilir. */
  function canPublish(eids){return !!(eids&&eids.status===STATES.DOGRULANDI);}
  function isVerified(eids){return !!(eids&&eids.status===STATES.DOGRULANDI);}
  function stateLabel(eids){return (eids&&LABEL[eids.status])||LABEL.beklemede;}

  /* Rozet — durum ne ise onu gösterir; kod uydurmaz. */
  function badgeHTML(eids,sz){
    var st=(eids&&eids.status)||STATES.BEKLEMEDE;
    var cls=st===STATES.DOGRULANDI?'ok':st===STATES.REDDEDILDI?'no':'wait';
    var ttl=st===STATES.DOGRULANDI&&eids&&eids.tasinmazNo?(' · Taşınmaz No: '+esc(eids.tasinmazNo)):'';
    return '<span class="eids-b '+cls+'" title="'+esc(LABEL[st]||'')+ttl+'">'+shield(sz)+' '+esc(LABEL[st]||'')+'</span>';
  }

  var _cssDone=false;
  function injectCSS(){
    if(_cssDone||typeof document==='undefined')return;_cssDone=true;
    var css=''
      +'.eids-b{display:inline-flex;align-items:center;gap:5px;font-size:.71875rem;font-weight:700;padding:3px 9px;border-radius:999px;line-height:1.2;white-space:nowrap}'
      +'.eids-b .eids-shield{flex:0 0 auto}'
      +'.eids-b.ok{color:#0f7a3d;background:rgba(22,163,74,.13)}'
      +'.eids-b.no{color:#c0392b;background:rgba(192,57,43,.12)}'
      +'.eids-b.wait{color:#b45309;background:rgba(217,119,6,.13)}'
      +'.eids-b.solid.ok{color:#fff;background:#0f7a3d}'
      +'.eids-b.solid.wait{color:#fff;background:#b45309}'
      +'.eids-b.solid.no{color:#fff;background:#c0392b}';
    try{var s=document.createElement('style');s.id='eids-style';s.textContent=css;(document.head||document.documentElement).appendChild(s);}catch(e){}
  }
  if(typeof document!=='undefined'){
    if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',injectCSS);else injectCSS();
  }

  window.EIDS={
    STATES:STATES, LABEL:LABEL, MALIK_TIPLERI:MALIK_TIPLERI, VERIFY_PATH:VERIFY_PATH,
    newRecord:newRecord, eksikAlanlar:eksikAlanlar, verify:verify,
    canPublish:canPublish, isVerified:isVerified, stateLabel:stateLabel,
    badgeHTML:badgeHTML, shield:shield, esc:esc, injectCSS:injectCSS
  };
})();
