/* ============================================================================
   cerez.js — KVKK (6698) uyumlu çerez onay bandı · TEK KAYNAK (tüm sayfalar)
   ----------------------------------------------------------------------------
   • window.dnConsent  → { get, allows, open, reset, onChange }
   • Onay VERİLMEDEN analitik/pazarlama çerezleri çalışmaz (varsayılan: reddedilmiş).
   • "Tümünü Kabul Et" ile "Zorunlu Olanlar" (reddet) EŞİT belirginlikte (koyu-desen yok).
   • Granüler kategori kontrolü (Zorunlu her zaman açık · Analitik · Pazarlama).
   • Onay kaydı zaman damgalı; kullanıcı her sayfadan tercihini değiştirebilir.
   • Tasarım: Aegean Heritage Wealth (near-white + emerald + gold · IBM Plex/Playfair).
   ========================================================================== */
(function(){
  'use strict';
  var KEY='dn_cerez_consent', VER=1;
  var listeners=[];

  /* ---- durum ---- */
  function read(){
    try{var r=JSON.parse(localStorage.getItem(KEY)||'null');
      if(r&&r.v===VER&&typeof r.analytics==='boolean')return r;}catch(e){}
    return null;
  }
  function write(analytics,marketing){
    var rec={v:VER,ts:_now(),date:_iso(),necessary:true,analytics:!!analytics,marketing:!!marketing};
    try{localStorage.setItem(KEY,JSON.stringify(rec));}catch(e){}
    emit(rec);
    return rec;
  }
  function _now(){try{return Date.now();}catch(e){return 0;}}
  function _iso(){try{return new Date().toISOString();}catch(e){return '';}}
  function emit(rec){
    try{window.dispatchEvent(new CustomEvent('dn:consent',{detail:rec}));}catch(e){}
    listeners.slice().forEach(function(fn){try{fn(rec);}catch(e){}});
  }

  /* ---- public API ---- */
  var API={
    get:function(){return read();},
    allows:function(cat){
      if(cat==='necessary'||cat==='zorunlu')return true;
      var r=read(); if(!r)return false;                 // onay yoksa = reddedilmiş
      if(cat==='analytics'||cat==='analitik')return !!r.analytics;
      if(cat==='marketing'||cat==='pazarlama')return !!r.marketing;
      return false;
    },
    onChange:function(fn){ if(typeof fn==='function'){listeners.push(fn); var r=read(); if(r)try{fn(r);}catch(e){}} return API; },
    open:function(){ ensureUI(); openSettings(); return API; },
    reset:function(){ try{localStorage.removeItem(KEY);}catch(e){} ensureUI(); showBar(); return API; }
  };
  window.dnConsent=API;

  /* ---- ikonlar ---- */
  var COOKIE='<svg viewBox="0 0 24 24" width="22" height="22" fill="none" aria-hidden="true"><path d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5 3.2 3.2 0 0 1-4.2-4.2A9.5 9.5 0 0 0 12 2.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><circle cx="9" cy="10" r="1.05" fill="currentColor"/><circle cx="14.5" cy="14.5" r="1.05" fill="currentColor"/><circle cx="8.5" cy="15" r=".8" fill="currentColor"/><circle cx="13.5" cy="9" r=".8" fill="currentColor"/></svg>';

  /* ---- CSS ---- */
  function ensureCSS(){
    if(document.getElementById('dncz-css'))return;
    var s=document.createElement('style'); s.id='dncz-css';
    s.textContent=[
      '.dncz-bar{position:fixed;left:16px;right:16px;bottom:18px;z-index:2147483000;max-width:1080px;margin:0 auto;background:#fff;border:1px solid #e1e3e2;border-radius:16px;padding:18px 22px;display:flex;align-items:center;gap:22px;box-shadow:0 16px 46px -16px rgba(8,48,31,.34);font-family:"IBM Plex Sans",system-ui,-apple-system,sans-serif;color:#3a463f;transform:translateY(140%);transition:transform .5s cubic-bezier(.2,.8,.2,1);opacity:0}',
      '.dncz-bar.on{transform:none;opacity:1}',
      '.dncz-ic{flex:none;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:linear-gradient(135deg,#f4faf6,#eaf3ee);color:#c39b45;border:1px solid #e1e3e2}',
      '.dncz-tx{flex:1 1 auto;min-width:0}',
      '.dncz-tx h4{margin:0 0 4px;font:600 15px/1.25 "Playfair Display",Georgia,serif;color:#0f3d2e;letter-spacing:.2px}',
      '.dncz-tx p{margin:0;font-size:12.9px;line-height:1.5;color:#5f6f66}',
      '.dncz-tx a{color:#0e5e3e;text-decoration:underline;text-underline-offset:2px;font-weight:600}',
      '.dncz-tx a:hover{color:#c39b45}',
      '.dncz-act{flex:none;display:flex;align-items:center;gap:10px}',
      '.dncz-btn{font:600 13px/1 "IBM Plex Sans",sans-serif;padding:12px 20px;border-radius:10px;cursor:pointer;border:1.5px solid transparent;white-space:nowrap;transition:.18s;font-family:inherit}',
      '.dncz-btn.pri{background:linear-gradient(135deg,#0e5e3e,#14805a);color:#fff;box-shadow:0 8px 20px -9px rgba(14,94,62,.6)}',
      '.dncz-btn.pri:hover{filter:brightness(1.06);transform:translateY(-1px)}',
      '.dncz-btn.sec{background:#fff;border-color:#0e5e3e;color:#0e5e3e}',
      '.dncz-btn.sec:hover{background:#f4faf6}',
      '.dncz-btn.txt{background:none;border-color:transparent;color:#5f6f66;text-decoration:underline;text-underline-offset:3px;padding:12px 8px}',
      '.dncz-btn.txt:hover{color:#0e5e3e}',
      /* reopener pill */
      '.dncz-reop{position:fixed;left:16px;bottom:16px;z-index:2147482000;display:flex;align-items:center;gap:7px;padding:8px 13px 8px 10px;border-radius:999px;background:#fff;border:1px solid #e1e3e2;color:#0f3d2e;font:600 12px "IBM Plex Sans",sans-serif;cursor:pointer;box-shadow:0 8px 22px -12px rgba(8,48,31,.3);opacity:.62;transition:.2s}',
      '.dncz-reop:hover{opacity:1;border-color:#0e5e3e}',
      '.dncz-reop svg{width:17px;height:17px;color:#c39b45}',
      /* settings modal */
      '.dncz-back{position:fixed;inset:0;z-index:2147483600;background:rgba(8,40,28,.46);display:flex;align-items:center;justify-content:center;padding:20px;opacity:0;transition:.24s;font-family:"IBM Plex Sans",system-ui,sans-serif}',
      '.dncz-back.on{opacity:1}',
      '.dncz-modal{background:#fff;border:1px solid #e1e3e2;border-radius:18px;max-width:520px;width:100%;max-height:88vh;overflow:auto;transform:translateY(14px);transition:.28s cubic-bezier(.2,.8,.2,1)}',
      '.dncz-back.on .dncz-modal{transform:none}',
      '.dncz-mh{padding:22px 24px 8px;position:relative}',
      '.dncz-mh h3{margin:0 0 6px;font:600 20px "Playfair Display",Georgia,serif;color:#0f3d2e}',
      '.dncz-mh p{margin:0;font-size:12.8px;line-height:1.55;color:#5f6f66}',
      '.dncz-mh a{color:#0e5e3e;text-decoration:underline;font-weight:600}',
      '.dncz-x{position:absolute;top:16px;right:16px;width:32px;height:32px;border-radius:9px;border:1px solid #e1e3e2;background:#fff;color:#5f6f66;font-size:19px;line-height:1;cursor:pointer}',
      '.dncz-x:hover{border-color:#0e5e3e;color:#0e5e3e}',
      '.dncz-rows{padding:8px 24px 4px}',
      '.dncz-row{display:flex;align-items:flex-start;gap:14px;padding:15px 0;border-top:1px solid #eef1ef}',
      '.dncz-row:first-child{border-top:none}',
      '.dncz-rc{flex:1 1 auto}',
      '.dncz-rc b{display:block;font:600 13.5px "IBM Plex Sans",sans-serif;color:#0f3d2e;margin-bottom:3px;letter-spacing:.2px}',
      '.dncz-rc span{display:block;font-size:12.2px;line-height:1.5;color:#6a786f}',
      '.dncz-sw{flex:none;margin-top:2px;width:46px;height:26px;border-radius:999px;background:#d7ddd9;border:none;position:relative;cursor:pointer;transition:.2s;padding:0}',
      '.dncz-sw::after{content:"";position:absolute;top:3px;left:3px;width:20px;height:20px;border-radius:50%;background:#fff;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}',
      '.dncz-sw[aria-checked="true"]{background:linear-gradient(135deg,#0e5e3e,#14805a)}',
      '.dncz-sw[aria-checked="true"]::after{left:23px}',
      '.dncz-sw[disabled]{opacity:.7;cursor:not-allowed;background:#0e5e3e}',
      '.dncz-mf{display:flex;gap:10px;flex-wrap:wrap;padding:14px 24px 22px;border-top:1px solid #eef1ef;margin-top:6px}',
      '.dncz-mf .dncz-btn{flex:1 1 auto;text-align:center;padding:13px 16px}',
      '@media(max-width:720px){.dncz-bar{flex-direction:column;align-items:stretch;gap:14px;padding:18px;left:10px;right:10px;bottom:10px}.dncz-act{flex-wrap:wrap}.dncz-act .dncz-btn{flex:1 1 auto;text-align:center}.dncz-btn.txt{flex-basis:100%}}',
      '@media(prefers-reduced-motion:reduce){.dncz-bar,.dncz-back,.dncz-modal{transition:none}}'
    ].join('');
    document.head.appendChild(s);
  }

  /* ---- bar ---- */
  var barEl=null, reopEl=null;
  function buildBar(){
    if(barEl)return barEl;
    var b=document.createElement('div');
    b.className='dncz-bar'; b.setAttribute('role','region');
    b.setAttribute('aria-label','Çerez tercihleri');
    b.innerHTML=''
      +'<div class="dncz-ic">'+COOKIE+'</div>'
      +'<div class="dncz-tx"><h4>Çerez Tercihleriniz</h4>'
      +'<p>Sitenin düzgün çalışması için <b>zorunlu çerezler</b> her zaman aktiftir. Deneyimi iyileştirmek ve ziyaret istatistiği için <b>analitik</b> ve <b>pazarlama</b> çerezleri yalnızca onayınızla çalışır. Ayrıntı: '
      +'<a href="cerez.html">Çerez Politikası</a> · <a href="kvkk.html">Aydınlatma Metni</a>.</p></div>'
      +'<div class="dncz-act">'
      +'<button type="button" class="dncz-btn txt" data-cz="manage">Ayarla</button>'
      +'<button type="button" class="dncz-btn sec" data-cz="reject">Zorunlu Olanlar</button>'
      +'<button type="button" class="dncz-btn pri" data-cz="accept">Tümünü Kabul Et</button>'
      +'</div>';
    b.addEventListener('click',function(e){
      var t=e.target.closest('[data-cz]'); if(!t)return;
      var a=t.getAttribute('data-cz');
      if(a==='accept'){write(true,true);hideBar();showReopener();}
      else if(a==='reject'){write(false,false);hideBar();showReopener();}
      else if(a==='manage'){openSettings();}
    });
    document.body.appendChild(b);
    barEl=b; return b;
  }
  function showBar(){ ensureCSS(); buildBar(); if(reopEl)reopEl.remove(),reopEl=null;
    requestAnimationFrame(function(){requestAnimationFrame(function(){barEl.classList.add('on');});}); }
  function hideBar(){ if(!barEl)return; barEl.classList.remove('on');
    setTimeout(function(){if(barEl){barEl.remove();barEl=null;}},520); }

  /* ---- reopener ---- */
  function showReopener(){
    ensureCSS(); if(reopEl)return;
    var r=document.createElement('button'); r.type='button'; r.className='dncz-reop';
    r.setAttribute('aria-label','Çerez tercihlerini yönet');
    r.innerHTML=COOKIE+'<span>Çerez</span>';
    r.addEventListener('click',openSettings);
    document.body.appendChild(r); reopEl=r;
  }

  /* ---- settings modal ---- */
  var backEl=null;
  function catRow(id,title,desc,checked,locked){
    return '<div class="dncz-row"><div class="dncz-rc"><b>'+title+'</b><span>'+desc+'</span></div>'
      +'<button type="button" class="dncz-sw" data-sw="'+id+'" role="switch" aria-checked="'+(checked?'true':'false')+'"'
      +(locked?' disabled aria-disabled="true"':'')+'></button></div>';
  }
  function openSettings(){
    ensureCSS();
    if(backEl){backEl.classList.add('on');return;}
    var r=read()||{analytics:false,marketing:false};
    var back=document.createElement('div'); back.className='dncz-back';
    back.innerHTML='<div class="dncz-modal" role="dialog" aria-modal="true" aria-label="Çerez ayarları">'
      +'<div class="dncz-mh"><button class="dncz-x" data-cz="close" aria-label="Kapat">&times;</button>'
      +'<h3>Çerez Ayarları</h3>'
      +'<p>Kategori tercihlerinizi belirleyin. Seçiminiz cihazınıza kaydedilir ve dilediğiniz zaman bu ekrandan değiştirebilirsiniz. Ayrıntı için <a href="cerez.html">Çerez Politikası</a>.</p></div>'
      +'<div class="dncz-rows">'
      +catRow('necessary','Zorunlu Çerezler','Oturum, güvenlik ve temel işlevler ile dil/görüntü tercihlerinizin hatırlanması. Sitenin çalışması için gereklidir; kapatılamaz.',true,true)
      +catRow('analytics','Analitik / Performans','Sitenin nasıl kullanıldığını anonim olarak ölçer (ziyaret, sayfa performansı). Deneyimi iyileştirmemize yardımcı olur.',!!r.analytics,false)
      +catRow('marketing','Pazarlama / Reklam','İlan ve kampanyaların ilgi alanınıza göre gösterilmesi ve sosyal medya/reklam ölçümü için kullanılır.',!!r.marketing,false)
      +'</div>'
      +'<div class="dncz-mf">'
      +'<button type="button" class="dncz-btn sec" data-cz="save">Seçimi Kaydet</button>'
      +'<button type="button" class="dncz-btn pri" data-cz="acceptAll">Tümünü Kabul Et</button>'
      +'</div></div>';
    back.addEventListener('click',function(e){
      if(e.target===back){closeSettings();return;}
      var sw=e.target.closest('[data-sw]');
      if(sw&&!sw.hasAttribute('disabled')){
        sw.setAttribute('aria-checked', sw.getAttribute('aria-checked')==='true'?'false':'true'); return;
      }
      var t=e.target.closest('[data-cz]'); if(!t)return;
      var a=t.getAttribute('data-cz');
      if(a==='close'){closeSettings();}
      else if(a==='save'){
        var an=back.querySelector('[data-sw="analytics"]').getAttribute('aria-checked')==='true';
        var mk=back.querySelector('[data-sw="marketing"]').getAttribute('aria-checked')==='true';
        write(an,mk); closeSettings(); hideBar(); showReopener();
      }else if(a==='acceptAll'){ write(true,true); closeSettings(); hideBar(); showReopener(); }
    });
    document.body.appendChild(back); backEl=back;
    requestAnimationFrame(function(){back.classList.add('on');});
    _escBind();
  }
  function closeSettings(){ if(!backEl)return; backEl.classList.remove('on');
    var el=backEl; backEl=null; setTimeout(function(){el.remove();},300); _escUnbind(); }
  function _onEsc(e){ if(e.key==='Escape')closeSettings(); }
  function _escBind(){ document.addEventListener('keydown',_onEsc); }
  function _escUnbind(){ document.removeEventListener('keydown',_onEsc); }

  /* ---- UI garanti ---- */
  function ensureUI(){ ensureCSS(); }

  /* ---- init ---- */
  function init(){
    ensureCSS();
    if(read()){ showReopener(); }     // onay verilmiş → sadece yeniden-açma pili
    else { showBar(); }               // onay yok → bant
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);
  else init();
})();
