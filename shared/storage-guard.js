/* =====================================================================
   shared/storage-guard.js — ÜRETİM DEPOLAMA BEKÇİSİ (FAZ3 §6)
   ---------------------------------------------------------------------
   Üretimde (window.EMLAK_DEMO !== true) localStorage KURUMSAL OTORİTE
   olamaz: marka, firma, iletişim, tema-kurumsal, sosyal, portföy, ilan,
   lead/CRM/PII, paket-yetki, API anahtarı yazımları ENGELLENİR ve
   EMLAK_TELEMETRY'ye raporlanır. Kurumsal veri tek kaynaktan gelir:
   same-origin /api/v1/tenant/bootstrap (sunucu, Host'tan tenant çözer).

   İZİNLİ (zararsız kullanıcı tercihleri + kısa ömürlü önbellek):
   dil, çerez izni, tema TERCİHİ (açık/koyu), favoriler, karşılaştırma,
   görüntülenme sayacı, A/B, kur önbelleği, ProX veri önbelleği, kota.
   sessionStorage tamamen serbesttir (oturum ömürlü önbellek).
   Bu dosya her sayfaya İLK script olarak üretim paketleyicisi tarafından
   enjekte edilir; demo kaynak ortamında etkisizdir.
   ===================================================================== */
(function(){
  'use strict';
  if(typeof window==='undefined'||typeof Storage==='undefined')return;
  if(window.EMLAK_DEMO===true)return; /* demo ortamı: tam işlevli vitrin serbest */
  var IZIN=[
    /^dn_lang$/,/^in_lang$/,/^meridyen_lang$/,/^gm_lang$/,
    /^dn_cerez_consent$/,/^dn_cookie$/,/^cookieChoice$/,/cerez/i,/consent/i,
    /^dn_ab$/,/^dn_grate$/,/^ins_grate$/,
    /^lst_views$/,/^lst_compare$/,/fav/i,
    /^dn_lead_pending$/,
    /^dn_pfx_cache$/,/^dn_pfx_hist$/,/^dn_vip_ts$/,/^dn_quota$/,/_quota$/,
    /theme_pref/i,/^ui_/
  ];
  function izinli(k){ k=String(k==null?'':k); for(var i=0;i<IZIN.length;i++)if(IZIN[i].test(k))return true; return false; }
  var _si=Storage.prototype.setItem;
  Storage.prototype.setItem=function(k,v){
    try{
      if(this===window.sessionStorage)return _si.call(this,k,v);
      if(izinli(k))return _si.call(this,k,v);
      try{ if(typeof window.EMLAK_TELEMETRY==='function')window.EMLAK_TELEMETRY('storage_blocked',{key:String(k)}); }catch(e){}
      try{ if(window.console&&console.warn)console.warn('[NADAS] Üretimde kurumsal localStorage yazımı engellendi:',k); }catch(e){}
      return; /* no-op: kurumsal otorite sunucudadır */
    }catch(e){}
    return _si.call(this,k,v);
  };
})();
