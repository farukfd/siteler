/* danisman · app.js — engine (P1 ayrıştırma) */
/* =====================================================================
   SELİN MERİDYEN · Lüks Danışman Platformu (bağımsız sektör sitesi)
   emlakekspertizi.com ProX SaaS çekirdeği (izole kopya)
   ===================================================================== */

/* ---------- Çift Katmanlı SaaS Yapılandırması ---------- */
const SAAS_CONFIG={
  tenantId:'meridyen-danisman',
  tenantName:'Selin Meridyen Danışmanlık',
  tenantType:'Danışman',
  advisorName:'Selin Meridyen',
  systemSettings:{
    brandName:'Selin Meridyen',
    accent:'#b4975a', accent2:'#111111', accentSoft:'#d8c39a',
    logoUrl:'', faviconUrl:'',
    metaTitle:'Selin Meridyen · Lüks Konut & Özel Portföy Danışmanı',
    metaDescription:'Yetki belgeli butik emlak danışmanlığı; güncel lüks ilanlar, davet usulü VIP portföy ve ücretsiz gayrimenkul değer analizi.',
    metaKeywords:'lüks konut danışmanı, özel portföy, yalı, penthouse, butik emlak, ücretsiz gayrimenkul analizi',
    googleAnalytics:'', googleSiteVerification:'', googleMapsKey:''
  },
  tenantSettings:{ customPrompt:'', dsKey:'', dsModel:'deepseek-chat' },/* dsKey: danışmanın kendi DeepSeek anahtarı — girilirse tüm YZ DeepSeek ile; boşsa ProX sunucu AI'si. ProX anahtarı ise veri/endeks/analiz içindir (ayrı çalışır). */
  proxAiPrompts:{
    persona:'Sen, üst segment gayrimenkulde 18 yıllık tecrübeli, son derece elit, vizyoner ve güven veren bir lüks konut broker’ısın (Selin Meridyen). Üslubun zarif, sakin ve danışan odaklıdır; agresif satış yapmaz, değeri görünür kılarsın. Kullanıcı bir bölge/gayrimenkul/yatırım sorduğunda hafızandaki portföyü tarar, uygun gayrimenkulleri ve prim (değer artışı) potansiyelini anlatır, kesin fiyat vaadi vermez ve her görüşmeyi nazikçe ücretsiz analiz randevusuna yönlendirirsin.'
  },
  firma:{
    unvan:'Selin Meridyen Gayrimenkul Danışmanlık', vergi:'', adres:'Nişantaşı, Şişli / İstanbul',
    tel:'+90 212 000 00 00', mail:'info@selinmeridyen.com', proxyUrl:'',
    kapsama:{ bolgeler:['Beşiktaş','Sarıyer','Şişli','Beykoz','Kadıköy'], kategoriler:['Yalı','Penthouse','Villa','Rezidans','Arsa','Yatırım'] },
    eids:{ yetkili:true, connected:true, belgeNo:'0034812', firmaKod:'', kullaniciKodu:'' }
  }
};
function saasResolve(key){const t=SAAS_CONFIG.tenantSettings,s=SAAS_CONFIG.systemSettings;if(t&&t[key]!=null&&t[key]!=='')return t[key];return s?s[key]:undefined;}
/* ===================== EİDS — Elektronik İlan Doğrulama (danışman) =====================
   Açık ilan yayını EİDS yetkisi ister; VIP (davet usulü) portföy serbesttir.
   gerçek Bakanlık entegrasyonu için soyutlama: eidsConnect gerçek {firmaKod,kullaniciKodu}
   akışıyla değiştirilebilir. ===================================================== */
function _leD(s){return (s==null?'':(''+s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function eidsFirma(){SAAS_CONFIG.firma=SAAS_CONFIG.firma||{};SAAS_CONFIG.firma.eids=SAAS_CONFIG.firma.eids||{yetkili:false,connected:false,belgeNo:'',firmaKod:'',kullaniciKodu:''};return SAAS_CONFIG.firma;}
function eidsGuid(){var s='';for(var i=0;i<8;i++)s+=Math.floor(Math.random()*10);return 'K'+s;}
function eidsVerify(){var e=eidsFirma().eids;e.yetkili=!!(e.belgeNo&&(''+e.belgeNo).replace(/\D/g,'').length>=7&&e.connected);return e.yetkili;}
function eidsCanPublish(){return eidsVerify();}
function eidsShieldSvg(sz){sz=sz||16;return '<svg width="'+sz+'" height="'+sz+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="M9 12l2 2 4-4"/></svg>';}
function eidsBadgeHTML(){var e=eidsFirma().eids;
  if(eidsVerify())return '<span style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border:1px solid var(--gold);border-radius:999px;color:var(--gold);font-size:12.5px;letter-spacing:.04em">'+eidsShieldSvg(15)+' EİDS Yetkili · Belge No '+_leD(e.belgeNo)+' · e-Devlet doğrulamalı</span>';
  return '<span style="display:inline-flex;align-items:center;gap:8px;padding:8px 14px;border:1px solid var(--line-soft);border-radius:999px;color:var(--muted);font-size:12.5px">'+eidsShieldSvg(15)+' EİDS yetkisi bekleniyor</span>';}
function eidsRenderPublic(){var el=document.getElementById('eidsPublicBadge');if(el)el.innerHTML=eidsBadgeHTML();
  var ql=document.getElementById('eidsListingNote');if(ql)ql.innerHTML=eidsVerify()?(eidsShieldSvg(13)+' EİDS ile doğrulanmış ilanlar'):'';}
function eidsRenderAdmin(){var box=document.getElementById('ed_status');if(!box)return;var e=eidsFirma().eids;
  box.innerHTML=eidsVerify()
    ? '<div style="display:flex;gap:10px;align-items:center;padding:11px 13px;border:1px solid var(--gold);border-radius:10px;color:var(--gold)"><span>'+eidsShieldSvg(18)+'</span><div>EİDS Yetkisi Aktif — açık ilan yayınlayabilirsiniz.<div style="font-size:12px;opacity:.85;color:var(--muted)">Belge No '+_leD(e.belgeNo)+' · e-Devlet bağlı'+(e.kullaniciKodu?' · Kullanıcı '+_leD(e.kullaniciKodu):'')+'</div></div></div>'
    : '<div style="display:flex;gap:10px;align-items:center;padding:11px 13px;border:1px solid var(--line-soft);border-radius:10px;color:var(--muted)"><span>⚠️</span><div>EİDS Yetkisi Yok — yalnızca VIP (davet usulü) portföy eklenebilir.<div style="font-size:12px;opacity:.85">7+ haneli yetki belgesi girip e-Devlet ile bağlanın.</div></div></div>';}
function eidsConnect(){var e=eidsFirma().eids;var inp=document.getElementById('ed_belge');if(inp)e.belgeNo=(inp.value||'').replace(/\D/g,'');
  toast('e-Devlet EİDS oturumu açılıyor…');
  setTimeout(function(){e.connected=true;if(!e.firmaKod)e.firmaKod=eidsGuid();e.kullaniciKodu=eidsGuid();eidsVerify();try{eidsRenderAdmin();eidsRenderPublic();}catch(x){}
    toast(e.yetkili?'✓ e-Devlet ile bağlanıldı · Kullanıcı Kodu üretildi · Yetki aktif.':'e-Devlet bağlandı. Geçerli 7+ haneli yetki belgesi girip kaydedin.');},900);}
function eidsSave(){var e=eidsFirma().eids;var inp=document.getElementById('ed_belge');if(inp)e.belgeNo=(inp.value||'').replace(/\D/g,'');eidsVerify();eidsRenderAdmin();eidsRenderPublic();toast('EİDS bilgileri kaydedildi.');}
window.eidsConnect=eidsConnect;window.eidsSave=eidsSave;
/* ===================== YASAL METİN MOTORU — firma künyesinden (per-firma) ===================== */
function firmaKune(){var f=SAAS_CONFIG.firma||{};var e=f.eids||{};var name=saasResolve('brandName')||SAAS_CONFIG.advisorName||'—';
  return {name:name,unvan:f.unvan||name,adres:f.adres||'—',mail:f.mail||'—',tel:f.tel||'—',vergi:f.vergi||'',belge:e.belgeNo||''};}
function legalKunyeRows(){var k=firmaKune();var g='color:var(--gold)';
  return '<div style="background:#0a0a0b;border:1px solid var(--line-soft);border-radius:10px;padding:11px 13px;margin:0 0 12px;font-size:12.5px;line-height:1.8">'
   +'<div><b style="'+g+'">Veri Sorumlusu / Unvan:</b> '+_leD(k.unvan)+'</div>'
   +'<div><b style="'+g+'">Adres:</b> '+_leD(k.adres)+'</div>'
   +'<div><b style="'+g+'">E-posta:</b> '+_leD(k.mail)+' · <b style="'+g+'">Tel:</b> '+_leD(k.tel)+'</div>'
   +(k.vergi?'<div><b style="'+g+'">Vergi No:</b> '+_leD(k.vergi)+'</div>':'')
   +(k.belge?'<div><b style="'+g+'">EİDS Yetki Belge No:</b> '+_leD(k.belge)+'</div>':'')+'</div>';}
function legalDoc(type){var k=firmaKune(),kn=legalKunyeRows();
  if(type==='cerez')return {title:'Çerez Politikası',body:kn
    +'<p><b>Çerez nedir?</b> Siteyi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır.</p>'
    +'<p><b>Kullandığımız çerezler:</b> Zorunlu (oturum/güvenlik) · Tercih (dil, tema) · Analitik (anonim ziyaret istatistiği).</p>'
    +'<p><b>Yönetim:</b> Tarayıcı ayarlarınızdan silebilir/engelleyebilirsiniz; zorunlu çerezler site işlevi için gereklidir.</p>'
    +'<p>Sorularınız için <b>'+_leD(k.mail)+'</b> adresine yazabilirsiniz.</p>'};
  if(type==='mesafeli')return {title:'Mesafeli Hizmet & Kullanım Koşulları',body:kn
    +'<p><b>Hizmet Sağlayıcı:</b> '+_leD(k.unvan)+'. Bu site üzerinden lüks konut danışmanlığı, ücretsiz gayrimenkul değer analizi ve davet usulü VIP portföy erişimi sunulur.</p>'
    +'<p><b>Kapsam:</b> Değer/analiz bilgileri ön bilgi niteliğindedir; kesin değer, yerinde ekspertiz ve ProX endeksiyle teyit edilir.</p>'
    +'<p><b>İletişim & Şikayet:</b> '+_leD(k.mail)+' · '+_leD(k.tel)+'.</p>'};
  return {title:'KVKK Aydınlatma Metni',body:kn
    +'<p><b>Veri Sorumlusu:</b> '+_leD(k.unvan)+'. Form/randevu aracılığıyla paylaştığınız ad, telefon ve e-posta; talebinizin değerlendirilmesi, sizinle iletişim ve danışmanlık hizmeti sunulması amacıyla işlenir.</p>'
    +'<p><b>Aktarım:</b> Verileriniz açık rızanız olmadan üçüncü kişilerle paylaşılmaz. Analiz için ProX endeks altyapısı kullanılabilir.</p>'
    +'<p><b>Haklarınız:</b> KVKK m.11 uyarınca verilerinize erişme, düzeltme, silme ve işlemeye itiraz haklarına sahipsiniz. Başvuru: <b>'+_leD(k.mail)+'</b>.</p>'};}
function openLegal(type){var d=legalDoc(type),id='legalModal',m=document.getElementById(id);
  if(!m){m=document.createElement('div');m.id=id;m.style.cssText='position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px';
    m.innerHTML='<div style="position:absolute;inset:0;background:rgba(0,0,0,.72)" onclick="closeLegal()"></div><div id="legalCard" style="position:relative;max-width:600px;width:100%;max-height:82vh;overflow:auto;background:var(--ink,#0b0b0c);border:1px solid var(--line-soft);border-radius:14px;padding:26px 26px 22px"></div>';
    document.body.appendChild(m);}
  document.getElementById('legalCard').innerHTML='<button onclick="closeLegal()" style="position:absolute;top:12px;right:14px;background:none;border:0;color:var(--muted);font-size:20px;cursor:pointer">✕</button><h3 style="font-family:var(--serif);color:var(--gold);margin:0 0 4px;font-size:22px">'+d.title+'</h3><div style="font-size:13.5px;color:var(--muted);line-height:1.7">'+d.body+'</div><button class="btn btn-gold" style="margin-top:16px;width:100%" onclick="closeLegal()">Anladım</button>';
  m.style.display='flex';}
function closeLegal(){var m=document.getElementById('legalModal');if(m)m.style.display='none';}
function openKvkk(){openLegal('kvkk');}function openCerez(){openLegal('cerez');}function openMesafeli(){openLegal('mesafeli');}
window.openLegal=openLegal;window.closeLegal=closeLegal;window.openKvkk=openKvkk;window.openCerez=openCerez;window.openMesafeli=openMesafeli;
/* ===================== AI GÜVENLİK KORKULUĞU — ProX/DeepSeek çıktısı ===================== */
var AI_GUARD_RULE='\n\n[KESİN KURALLAR — UYDURMA YASAK] Gerçek olmayan proje/marka adı, kesin fiyat/rakam, "%X garanti/net getiri", sahte istatistik, ödül veya referans ÜRETME. Emin olmadığın sayısal veriyi "ProX endeksiyle teyit edilmeli" diye işaretle. Yalnızca genel, doğrulanabilir bilgi ver; abartıdan kaçın.';
function aiGuard(p){p=(p==null?'':''+p);return p.indexOf('[KESİN KURALLAR')>=0?p:(p+AI_GUARD_RULE);}
/* ===== DEEPSEEK-ÖNCELİKLİ YZ YÖNLENDİRME (danışman) =====
   Admin bir DeepSeek anahtarı (SAAS_CONFIG.tenantSettings.dsKey) girdiyse TÜM yapay zeka ÜRETİMİ
   doğrudan DeepSeek ile çalışır; yoksa/başarısızsa ProX sunucu AI'sine (/prox/ai) düşülür.
   ProX API anahtarı (EMLAK_TENANT.tenant_key) yalnızca VERİ uçları (endeks/analiz) içindir. DeepSeek CORS açık. */
function _dsLoad(){try{var k=localStorage.getItem('dn_dskey');if(k!=null)SAAS_CONFIG.tenantSettings.dsKey=k;var m=localStorage.getItem('dn_dsmodel');if(m)SAAS_CONFIG.tenantSettings.dsModel=m;}catch(e){}}
function _dsSave(){try{localStorage.setItem('dn_dskey',SAAS_CONFIG.tenantSettings.dsKey||'');localStorage.setItem('dn_dsmodel',SAAS_CONFIG.tenantSettings.dsModel||'deepseek-chat');}catch(e){}}
function _dsKey(){try{return (SAAS_CONFIG.tenantSettings.dsKey||'').trim();}catch(e){return '';}}
function _dsModel(){try{return (SAAS_CONFIG.tenantSettings.dsModel||'deepseek-chat').trim()||'deepseek-chat';}catch(e){return 'deepseek-chat';}}
function _dsMessages(body){
  body=body||{};
  var SYS_GEN='Sen zarif, üst segment bir Türk lüks gayrimenkul danışmanı yapay zekasısın. Türkçe, sakin ve net yaz; yalnızca doğrulanabilir emlak bilgisi ver; kesin fiyat/garanti getiri UYDURMA.';
  if((Array.isArray(body.messages)&&body.messages.length)||body.message!=null){
    var msgs=[{role:'system',content:body.prompt||SYS_GEN}];
    if(Array.isArray(body.messages)&&body.messages.length){body.messages.forEach(function(m){if(m&&m.content)msgs.push({role:(m.role==='assistant'?'assistant':(m.role==='system'?'system':'user')),content:String(m.content)});});}
    else{msgs.push({role:'user',content:String(body.message)});}
    return msgs;
  }
  return [{role:'system',content:SYS_GEN},{role:'user',content:String(body.prompt||'')}];
}
async function _deepseekChat(body,opts){
  opts=opts||{};var key=_dsKey();if(!key)return null;
  var ctrl=(typeof AbortController!=='undefined')?new AbortController():null;
  var to=ctrl?setTimeout(function(){try{ctrl.abort();}catch(e){}},opts.timeout||45000):null;
  try{
    var res=await fetch('https://api.deepseek.com/chat/completions',{method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body:JSON.stringify({model:_dsModel(),messages:_dsMessages(body),temperature:(opts.temperature!=null?opts.temperature:0.7),max_tokens:(opts.max_tokens||2048),stream:false}),
      signal:ctrl?ctrl.signal:undefined});
    if(to)clearTimeout(to);
    if(!res.ok)return {_dsErr:true,status:res.status};
    var j=await res.json();var t=j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;
    if(t&&t.trim())return {answer:t.trim(),success:true,_via:'deepseek'};
    return {_dsErr:true,status:0};
  }catch(e){if(to)clearTimeout(to);return {_dsErr:true,status:-1};}
}
async function aiChat(body,opts){
  if(_dsKey()){var d=await _deepseekChat(body,opts);if(d&&d.answer)return d;}
  return await proxApi('/api/v1/tenant/prox/ai',{method:'POST',body:body});
}
try{window.aiChat=aiChat;window._deepseekChat=_deepseekChat;}catch(e){}
/* Admin: DeepSeek anahtar testi + durum rozeti */
async function aiDsTest(){
  var el=document.getElementById('dn_dsstatus');var inp=document.getElementById('dn_dskey');
  var key=(inp&&inp.value.trim())||_dsKey();
  if(!key){if(el)el.innerHTML='<div class="ds-off">⚠ DeepSeek anahtarı girilmedi. Boşsa YZ, ProX sunucu AI\'si ile çalışır.</div>';return;}
  if(el)el.innerHTML='<div class="ds-wait">● DeepSeek bağlantısı test ediliyor…</div>';
  var _prev=SAAS_CONFIG.tenantSettings.dsKey;SAAS_CONFIG.tenantSettings.dsKey=key;
  var r=await _deepseekChat({message:'Sadece "OK" yaz.'},{max_tokens:8,temperature:0});
  SAAS_CONFIG.tenantSettings.dsKey=_prev;
  if(r&&r.answer){if(el)el.innerHTML='<div class="ds-on">◉ DeepSeek bağlı ✓ · model '+_dsModel()+' — Kaydet\'e basınca tüm YZ DeepSeek ile çalışır.</div>';}
  else{var st=(r&&r.status),m=st===401?'anahtar geçersiz (401)':st===402?'bakiye/kota yetersiz (402)':st===429?'hız limiti (429)':'bağlantı kurulamadı';if(el)el.innerHTML='<div class="ds-off">⚠ DeepSeek testi başarısız · '+m+'. Anahtarı kontrol edin.</div>';}
}
function aiDsStatus(){var el=document.getElementById('dn_dsstatus');if(!el)return;var k=_dsKey();
  el.innerHTML=k?'<div class="ds-on">◉ DeepSeek anahtarı kayıtlı · YZ üretimi DeepSeek ('+_dsModel()+') ile çalışıyor.</div>':'<div class="ds-off">○ DeepSeek anahtarı yok · YZ, ProX sunucu AI\'si ile çalışıyor.</div>';}
try{window.aiDsTest=aiDsTest;window.aiDsStatus=aiDsStatus;}catch(e){}
var AI_RISK_PATTERNS=[
  {re:/(garanti|kesin|net)\s*(getiri|kazanç|kâr|kar)|(getiri|kazanç)\s*(garanti|kesin)/i,t:'garanti getiri iddiası'},
  {re:/\d[\d.\s]{5,}\s*(tl|₺|lira)/i,t:'kesin fiyat rakamı'},
  {re:/en\s+(ucuz|pahalı|iyi|büyük|kaliteli|lüks)|türkiye'?nin\s+(ilk|tek|en)|lider|(bir|1)\s*numara/i,t:'doğrulanmamış üstünlük iddiası'},
  {re:/ödül|sertifika|patent|dünya\s*markası/i,t:'doğrulanmamış ödül/sertifika'}
];
function aiRiskScan(t){var h=[];AI_RISK_PATTERNS.forEach(function(p){if(p.re.test(t||''))h.push(p.t);});return h;}
window.aiGuard=aiGuard;window.aiRiskScan=aiRiskScan;
/* ===================== DİNAMİK SEO / JSON-LD (per-firma) ===================== */
function applySchema(){try{var k=firmaKune();var desc=saasResolve('metaDescription')||'';var il='İstanbul';
  try{if(typeof SERVICE_AREA!=='undefined'&&SERVICE_AREA&&SERVICE_AREA.primary)il=SERVICE_AREA.primary;}catch(e){}
  var e=(SAAS_CONFIG.firma&&SAAS_CONFIG.firma.eids)||{};
  var old=document.getElementById('ld-dyn');if(old)old.remove();
  var areas=[];try{if(typeof saActiveIller==='function')saActiveIller().forEach(function(pil){areas.push({"@type":"City","name":pil});});}catch(e){}
  if(!areas.length)areas=[{"@type":"City","name":il}];
  var o={"@context":"https://schema.org","@type":"RealEstateAgent","name":k.name,"description":desc,
    "areaServed":areas,"email":k.mail,"telephone":k.tel,"address":k.adres,"priceRange":"₺₺₺₺"};
  try{var kats=(typeof saKategoriler==='function')?saKategoriler():[];if(kats.length)o.knowsAbout=kats;}catch(e){}
  if(e.belgeNo)o.identifier={"@type":"PropertyValue","name":"EİDS Yetki Belge No","value":''+e.belgeNo};
  var s=document.createElement('script');s.type='application/ld+json';s.id='ld-dyn';s.text=JSON.stringify(o);document.head.appendChild(s);
}catch(e){}}
/* ===================== PER-TENANT ANALİTİK + A/B ===================== */
function abVariant(){try{var v=localStorage.getItem('dn_ab');if(v!=='A'&&v!=='B'){v=(Math.random()<0.5?'A':'B');localStorage.setItem('dn_ab',v);}return v;}catch(e){return 'A';}}
function trackEvent(name,params){try{
  var firma=saasResolve('brandName')||'';var pkg=(window.EMLAK_TENANT&&window.EMLAK_TENANT.packageCode)||'';
  var payload=Object.assign({firma:firma,paket:pkg,ab_variant:abVariant()},params||{});
  if(typeof window.gtag==='function')window.gtag('event',name,payload);else if(window.dataLayer&&window.dataLayer.push)window.dataLayer.push(Object.assign({event:name},payload));
  try{var kk='dn_analytics',a=JSON.parse(localStorage.getItem(kk)||'[]');a.push({t:Date.now(),name:name,ab:payload.ab_variant});if(a.length>500)a=a.slice(-500);localStorage.setItem(kk,JSON.stringify(a));}catch(e){}
}catch(e){}}
function abApply(){try{var v=abVariant();if(document.body)document.body.setAttribute('data-ab',v);trackEvent('page_impression',{});}catch(e){}}
/* ===================== PROXY / EDGE GÜVENLİK MODU (anahtarı sunucuda gizle) ===================== */
function applyProxyMode(){try{var pu=((SAAS_CONFIG.firma&&SAAS_CONFIG.firma.proxyUrl)||'').trim();
  if(pu){window.EMLAK_PROXY_MODE=true;window.EMLAK_PROXY_URL=pu.replace(/\/+$/,'');}else{window.EMLAK_PROXY_MODE=false;window.EMLAK_PROXY_URL='';}}catch(e){}}
window.applySchema=applySchema;window.trackEvent=trackEvent;window.abVariant=abVariant;window.applyProxyMode=applyProxyMode;
/* ===================== ÇOK DİLLİ (EN/AR) — ProX AI gerçek çeviri + RTL ===================== */
var _i18nOrig=null;
function _i18nNodes(){var sels=['#navLinks .lnk','.hero h1','.hero h2','.hero .lede','.eyebrow','section h2','.btn-gold','.btn-line'];var set=[],seen=[];
  sels.forEach(function(s){document.querySelectorAll(s).forEach(function(el){if(el.children.length===0&&el.textContent.trim()&&el.textContent.trim().length<170&&seen.indexOf(el)<0){seen.push(el);set.push(el);}});});
  return set.slice(0,44);}
async function gmLang(v){var sel=document.querySelectorAll('.lang-sel');
  if(v==='tr'){if(_i18nOrig)_i18nOrig.forEach(function(o){o.el.textContent=o.txt;});document.documentElement.setAttribute('dir','ltr');document.documentElement.lang='tr';try{localStorage.setItem('dn_lang','tr');}catch(e){}sel.forEach(function(s){s.value='tr';});return;}
  if(!_i18nOrig)_i18nOrig=_i18nNodes().map(function(el){return {el:el,txt:el.textContent};});
  document.documentElement.setAttribute('dir',v==='ar'?'rtl':'ltr');document.documentElement.lang=v;sel.forEach(function(s){s.value=v;});
  var firma=saasResolve('brandName')||'';var texts=_i18nOrig.map(function(o){return o.txt;});
  var ck='dn_i18n_'+v,cache=null;try{cache=JSON.parse(localStorage.getItem(ck)||'null');}catch(e){}
  if(cache&&cache.firma===firma&&cache.n===texts.length){cache.tr.forEach(function(t,i){if(_i18nOrig[i]&&t)_i18nOrig[i].el.textContent=t;});return;}
  try{toast(v==='ar'?'Arapça çeviri hazırlanıyor…':'İngilizce çeviri hazırlanıyor…');}catch(e){}
  var langName=v==='ar'?'Modern Standard Arabic':'English';
  var prompt='Translate these Turkish luxury real-estate website UI strings to '+langName+'. Keep the brand name "'+firma+'" and proper nouns unchanged. Return ONLY a numbered list, exactly one translation per line, SAME count and order, no commentary:\n'+texts.map(function(t,i){return (i+1)+'. '+t;}).join('\n');
  var out=null;try{var r=await aiChat({prompt:prompt,context:'ui-translation',tool:'translate'});if(r&&!r.fallback)out=r.answer||r.text||(r.data&&(r.data.answer||r.data.text));}catch(e){}
  if(!out){try{toast('Çeviri servisi şu an kullanılamıyor.');}catch(e){}document.documentElement.setAttribute('dir','ltr');document.documentElement.lang='tr';sel.forEach(function(s){s.value='tr';});return;}
  var lines=out.split('\n').map(function(l){return l.replace(/^\s*\d+[.)]\s*/,'').trim();}).filter(function(l){return l;});
  var applied=_i18nOrig.map(function(o,i){if(lines[i])o.el.textContent=lines[i];return lines[i]||o.txt;});
  try{localStorage.setItem(ck,JSON.stringify({firma:firma,n:texts.length,tr:applied}));localStorage.setItem('dn_lang',v);}catch(e){}
  try{toast('✓ '+(v==='ar'?'العربية':'English')+' aktif.');}catch(e){}}
window.gmLang=gmLang;
/* ===================== İL/İLÇE/MAHALLE MOTORU + HİZMET ALANI (danışman · tam) ===================== */
var TR_ILILCE=window.TR_ILILCE||{};
function bzSeed(s){var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function bzRng(seed){var x=seed||123456789;return function(){x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return (x>>>0)/4294967296;};}
var _mahCache={};
function mahalleSlug(il){var m={'ç':'c','Ç':'c','ğ':'g','Ğ':'g','ı':'i','İ':'i','ö':'o','Ö':'o','ş':'s','Ş':'s','ü':'u','Ü':'u',' ':'-'};return (il||'').replace(/[çÇğĞıİöÖşŞüÜ ]/g,function(x){return m[x]||x;}).toLowerCase();}
async function loadMahalle(il){if(!il)return null;if(_mahCache[il]!==undefined)return _mahCache[il];var out=null;
  try{var r=await proxApi('/api/v1/tenant/locations?il='+encodeURIComponent(il));
    if(r&&!r.fallback&&r.success===true){var t=r.ilceler||r.data||r.locations;
      if(t&&typeof t==='object'){out={};Object.keys(t).forEach(function(ic){var a=t[ic]||[];out[ic]=(Array.isArray(a)?a:[]).map(function(m){return (''+m).replace(/\s+(Mah\.?|Mahallesi|Köyü)$/i,'').trim();}).filter(Boolean);});}}}catch(e){}
  _mahCache[il]=out;return out;}
var COMMON_MAH=['Cumhuriyet','Atatürk','Merkez','Yeni','Fatih','Bahçelievler','Yavuz Selim','İnönü','Yıldız','Gazi','Yeşiltepe','Bağlar','Çamlık','Güzelyalı','Hürriyet','Kurtuluş','Mimar Sinan','Zafer','Barbaros','Aydınlıkevler','Şirinevler','Esentepe','Yenimahalle','Karşıyaka','19 Mayıs'];
function _mahHash(s){var h=0;for(var i=0;i<(s||'').length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
function realMah(il,ilce,n){n=n||3;var out=[],seen={};
  var sub=(typeof saServedMahalle==='function'?saServedMahalle(il,ilce):null);
  if(sub)sub.forEach(function(m){if(!seen[m]&&out.length<n){seen[m]=1;out.push(m);}});
  if(out.length>=n)return out;
  var d=_mahCache[il];var arr=(d&&d[ilce])||(PROVINCE.districts[ilce]&&PROVINCE.districts[ilce].mah);
  if(!arr||!arr.length){var start=_mahHash(il+'|'+ilce)%COMMON_MAH.length;arr=[];for(var k=0;k<COMMON_MAH.length;k++)arr.push(COMMON_MAH[(start+k)%COMMON_MAH.length]);}
  for(var i=0;i<arr.length&&out.length<n;i++){var m=arr[i];if(!seen[m]){seen[m]=1;out.push(m);}}return out;}
function trIlList(){return Object.keys(TR_ILILCE);}
function makeProvince(il){var rec=TR_ILILCE[il];if(!rec){il='İstanbul';rec=TR_ILILCE['İstanbul']||{plate:34,ilce:['Merkez']};}
  var ilceler=rec.ilce,districts={},POOL=COMMON_MAH,mc=Math.max(3,Math.round(ilceler.length*0.3));
  ilceler.forEach(function(d,i){var r=bzRng(bzSeed(il+'|'+d));
    var m2=Math.round((14000+r()*42000)/500)*500,chg=Math.round(150+r()*95),score=Math.round(55+r()*32);
    var st=_mahHash(il+'|'+d)%POOL.length,cnt=6+Math.floor(r()*4),mah=[];
    for(var mk=0;mk<cnt;mk++){var nm=POOL[(st+mk)%POOL.length];if(mah.indexOf(nm)<0)mah.push(nm);}
    districts[d]={group:i<mc?'merkez':'ilce',m2:m2,chg:chg,score:score,mah:mah};});
  return {name:il,plate:rec.plate,districts:districts};}
var PROVINCE=makeProvince((SAAS_CONFIG.firma&&SAAS_CONFIG.firma.il)||'İstanbul');
var BAZ={},MAH={};
function rebuildBAZ(){BAZ={};MAH={};Object.keys(PROVINCE.districts).forEach(function(k){var v=PROVINCE.districts[k];BAZ[k]={m2:v.m2,chg:v.chg,score:v.score};MAH[k]=v.mah;});}
rebuildBAZ();
var DEF_KATEGORILER=['Konut','Arsa','Ticari & Ofis','Kiralık','Miras & İntikal','Yatırım'];
var SERVICE_AREA=null,saCurIl='',saCurIlce='';
function saDefault(){return {primary:(SAAS_CONFIG.firma&&SAAS_CONFIG.firma.il)||'İstanbul',iller:{},kategoriler:DEF_KATEGORILER.slice()};}
function saBuildIl(il){var prov=makeProvince(il),ilceler={};Object.keys(prov.districts).forEach(function(ic){ilceler[ic]={aktif:true,mahalleler:[]};});return {aktif:true,ilceler:ilceler};}
function saEnsure(){if(!SERVICE_AREA)SERVICE_AREA=saDefault();if(!SERVICE_AREA.iller)SERVICE_AREA.iller={};if(!SERVICE_AREA.kategoriler||!SERVICE_AREA.kategoriler.length)SERVICE_AREA.kategoriler=DEF_KATEGORILER.slice();var pil=SERVICE_AREA.primary||'İstanbul';SERVICE_AREA.primary=pil;if(!SERVICE_AREA.iller[pil])SERVICE_AREA.iller[pil]=saBuildIl(pil);return SERVICE_AREA;}
function saLoad(){if(SERVICE_AREA)return SERVICE_AREA;try{SERVICE_AREA=JSON.parse(localStorage.getItem('dn_service_area')||'null');}catch(e){}return saEnsure();}
function saSave(){try{localStorage.setItem('dn_service_area',JSON.stringify(SERVICE_AREA));}catch(e){}}
function saActiveIller(){return SERVICE_AREA?Object.keys(SERVICE_AREA.iller).filter(function(il){return SERVICE_AREA.iller[il].aktif!==false;}):[];}
function saServedIlce(il){try{var r=SERVICE_AREA&&SERVICE_AREA.iller[il];if(!r||!r.ilceler)return null;return Object.keys(r.ilceler).filter(function(ic){return r.ilceler[ic].aktif!==false;});}catch(e){return null;}}
function saServedMahalle(il,ilce){try{var e=SERVICE_AREA&&SERVICE_AREA.iller[il]&&SERVICE_AREA.iller[il].ilceler[ilce];var m=e&&e.mahalleler;return (m&&m.length)?m.slice():null;}catch(e){return null;}}
function saKategoriler(){return (SERVICE_AREA&&SERVICE_AREA.kategoriler&&SERVICE_AREA.kategoriler.length)?SERVICE_AREA.kategoriler.slice():DEF_KATEGORILER.slice();}
function saHasCat(kw){if(!SERVICE_AREA||!SERVICE_AREA.kategoriler)return true;var s=SERVICE_AREA.kategoriler.join('|').toLocaleLowerCase('tr');return s.indexOf((''+kw).toLocaleLowerCase('tr'))>=0;}
function saFilterActiveProvince(){try{if(typeof PROVINCE==='undefined'||!PROVINCE||!SERVICE_AREA)return;var rec=SERVICE_AREA.iller[PROVINCE.name];if(!rec||!rec.ilceler)return;Object.keys(PROVINCE.districts).forEach(function(ic){var e=rec.ilceler[ic];if(e&&e.aktif===false)delete PROVINCE.districts[ic];});}catch(e){}}
function saWorkList(maxPrimary){maxPrimary=maxPrimary||7;var list=[];
  if(SERVICE_AREA){var ills=saActiveIller();ills.sort(function(a,b){return a===SERVICE_AREA.primary?-1:b===SERVICE_AREA.primary?1:0;});
    ills.forEach(function(il){var ics=saServedIlce(il)||[];var take=(il===SERVICE_AREA.primary)?maxPrimary:Math.min(3,ics.length);for(var i=0;i<take&&i<ics.length;i++)list.push({il:il,ilce:ics[i]});});}
  if(!list.length){var pn=PROVINCE.name;Object.keys(PROVINCE.districts).slice(0,maxPrimary).forEach(function(ic){list.push({il:pn,ilce:ic});});}
  return list;}
function applyProvince(il,silent){PROVINCE=makeProvince(il);
  try{if(SERVICE_AREA){SERVICE_AREA.primary=il;if(!SERVICE_AREA.iller[il])SERVICE_AREA.iller[il]=saBuildIl(il);}}catch(e){}
  saFilterActiveProvince();rebuildBAZ();
  try{applySchema();}catch(e){}
  try{loadMahalle(il);}catch(e){}
  if(!silent&&typeof toast==='function')toast('Aktif il: '+il+' · içerik güncellendi.');}
function saEsc(s){return (''+s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
function saDelChip(txt,fn){return '<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--line-soft);border-radius:999px;font-size:13px;color:var(--gold)">'+_leD(txt)+' <b onclick="'+fn+'(\''+saEsc(txt)+'\')" style="cursor:pointer;opacity:.55;color:var(--muted)">✕</b></span>';}
function renderSA(){saLoad();saCurIl=(saCurIl&&SERVICE_AREA.iller[saCurIl])?saCurIl:SERVICE_AREA.primary;var GOLD='var(--gold)',LINE='var(--line-soft)';
  var ilBox=document.getElementById('saIlChips');
  if(ilBox)ilBox.innerHTML=Object.keys(SERVICE_AREA.iller).map(function(il){var isP=il===SERVICE_AREA.primary,cur=il===saCurIl;
    return '<span onclick="saSelectIl(\''+saEsc(il)+'\')" style="display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border:1px solid '+(cur?GOLD:LINE)+';border-radius:999px;background:'+(cur?GOLD:'transparent')+';color:'+(cur?'#111':GOLD)+';cursor:pointer;font-size:13px;font-weight:600">'+il+(isP?' ★':'')+(isP?'':' <b onclick="event.stopPropagation();saRemoveProvince(\''+saEsc(il)+'\')" style="cursor:pointer;opacity:.75">✕</b>')+'</span>';}).join('');
  var addSel=document.getElementById('saAddIl');
  if(addSel){var have=Object.keys(SERVICE_AREA.iller);var opts=trIlList().filter(function(il){return have.indexOf(il)<0;}).sort(function(a,b){return a.localeCompare(b,'tr');});addSel.innerHTML=opts.map(function(il){return '<option>'+il+'</option>';}).join('');}
  var lbl=document.getElementById('saCurIlLbl');if(lbl)lbl.textContent='· '+saCurIl;
  var ilceBox=document.getElementById('saIlceList');
  if(ilceBox){var rec=SERVICE_AREA.iller[saCurIl];var ilcs=rec?Object.keys(rec.ilceler):[];
    ilceBox.innerHTML=ilcs.map(function(ic){var e=rec.ilceler[ic],on=e.aktif!==false,cur=ic===saCurIlce,mn=(e.mahalleler&&e.mahalleler.length)||0;
      return '<label style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid '+(cur?GOLD:LINE)+';border-radius:9px;cursor:pointer;font-size:13px;opacity:'+(on?'1':'.5')+';color:var(--muted)"><input type="checkbox" '+(on?'checked':'')+' onchange="saToggleIlce(\''+saEsc(ic)+'\')"><span onclick="saSelectIlce(\''+saEsc(ic)+'\')">'+ic+(mn?' <b style="color:'+GOLD+'">('+mn+')</b>':'')+'</span></label>';}).join('')||'<span class="sub">İlçe bulunamadı.</span>';}
  var mlbl=document.getElementById('saCurIlceLbl');if(mlbl)mlbl.textContent=saCurIlce?('· '+saCurIlce+', '+saCurIl):'· (ilçe seçin)';
  var mBox=document.getElementById('saMahChips');
  if(mBox){if(!saCurIlce)mBox.innerHTML='<span class="sub">Yukarıdan bir ilçe seçin, sonra mahalle ekleyin.</span>';
    else{var e=SERVICE_AREA.iller[saCurIl].ilceler[saCurIlce],ms=(e&&e.mahalleler)||[];
      var sug=realMah(saCurIl,saCurIlce,8).filter(function(m){return ms.indexOf(m)<0;});
      mBox.innerHTML=(ms.length?ms.map(function(m){return saDelChip(m,'saRemoveMahalle');}).join(''):'<span class="sub">Tüm mahalleler hizmet alanında (özel seçim yok).</span>')
        +(sug.length?'<div style="width:100%;margin-top:8px;font-size:12px;color:var(--muted)">Öneri: '+sug.map(function(m){return '<span onclick="saAddMahalleName(\''+saEsc(m)+'\')" style="cursor:pointer;color:'+GOLD+';margin-right:10px;white-space:nowrap">+ '+m+'</span>';}).join('')+'</div>':'');}}
  var kBox=document.getElementById('saKatChips');
  if(kBox)kBox.innerHTML=SERVICE_AREA.kategoriler.map(function(k){return saDelChip(k,'saRemoveKat');}).join('')||'<span class="sub">Kategori yok.</span>';}
function saAddProvince(){saLoad();var sel=document.getElementById('saAddIl');var il=sel&&sel.value;if(!il)return;if(!SERVICE_AREA.iller[il])SERVICE_AREA.iller[il]=saBuildIl(il);saCurIl=il;saCurIlce='';renderSA();toast('Hizmet ili eklendi: '+il);}
function saRemoveProvince(il){saLoad();if(il===SERVICE_AREA.primary){toast('Ana il çıkarılamaz. Önce başka ili ana yapın.');return;}delete SERVICE_AREA.iller[il];if(saCurIl===il){saCurIl=SERVICE_AREA.primary;saCurIlce='';}renderSA();toast('Hizmet ili çıkarıldı: '+il);}
function saSelectIl(il){saLoad();saCurIl=il;saCurIlce='';renderSA();}
function saToggleIlce(ic){saLoad();var rec=SERVICE_AREA.iller[saCurIl];if(!rec||!rec.ilceler[ic])return;rec.ilceler[ic].aktif=(rec.ilceler[ic].aktif===false);renderSA();}
function saAllIlce(on){saLoad();var rec=SERVICE_AREA.iller[saCurIl];if(!rec)return;Object.keys(rec.ilceler).forEach(function(ic){rec.ilceler[ic].aktif=!!on;});renderSA();toast(on?'Tüm ilçeler eklendi.':'Tüm ilçeler çıkarıldı.');}
function saSelectIlce(ic){saLoad();saCurIlce=ic;renderSA();}
function saAddMahalle(){var inp=document.getElementById('saAddMah');var v=inp&&inp.value.trim();if(v){saAddMahalleName(v);inp.value='';}}
function saAddMahalleName(v){saLoad();if(!saCurIlce){toast('Önce bir ilçe seçin.');return;}var e=SERVICE_AREA.iller[saCurIl].ilceler[saCurIlce];e.mahalleler=e.mahalleler||[];if(e.mahalleler.indexOf(v)<0)e.mahalleler.push(v);renderSA();}
function saRemoveMahalle(m){saLoad();var e=SERVICE_AREA.iller[saCurIl].ilceler[saCurIlce];if(e)e.mahalleler=(e.mahalleler||[]).filter(function(x){return x!==m;});renderSA();}
function saAddKat(){var inp=document.getElementById('saAddKat');var v=inp&&inp.value.trim();if(!v)return;saLoad();if(SERVICE_AREA.kategoriler.indexOf(v)<0)SERVICE_AREA.kategoriler.push(v);inp.value='';renderSA();}
function saRemoveKat(k){saLoad();SERVICE_AREA.kategoriler=SERVICE_AREA.kategoriler.filter(function(x){return x!==k;});renderSA();}
function saApply(){saLoad();saSave();try{applyProvince(SERVICE_AREA.primary);}catch(e){}try{if(typeof rebuildVipFromProx==='function')rebuildVipFromProx(SERVICE_AREA.primary,true);}catch(e){}try{applySchema();renderSA();}catch(e){}
  var ai=saActiveIller().length,aic=(saServedIlce(SERVICE_AREA.primary)||[]).length;
  toast('✓ Hizmet alanı uygulandı — '+ai+' il · '+aic+' ilçe ('+SERVICE_AREA.primary+') · '+SERVICE_AREA.kategoriler.length+' kategori.');}
window.renderSA=renderSA;window.saApply=saApply;window.saAddProvince=saAddProvince;window.saRemoveProvince=saRemoveProvince;window.saSelectIl=saSelectIl;window.saToggleIlce=saToggleIlce;window.saAllIlce=saAllIlce;window.saSelectIlce=saSelectIlce;window.saAddMahalle=saAddMahalle;window.saAddMahalleName=saAddMahalleName;window.saRemoveMahalle=saRemoveMahalle;window.saAddKat=saAddKat;window.saRemoveKat=saRemoveKat;window.applyProvince=applyProvince;window.saServedMahalle=saServedMahalle;
/* ===================== ÖZEL PORTFÖY — GERÇEK ProX VERİSİ (analyze.range.min) ===================== */
var _wlAnalyzeCache={},_wlM2Cache={};
function proxKategoriOf(tip){var t=(tip||'').toLowerCase();if(t.indexOf('arsa')>=0)return 'arsa';if(t.indexOf('ofis')>=0||t.indexOf('dükkan')>=0||t.indexOf('dukkan')>=0||t.indexOf('ticari')>=0)return 'ticari';return 'konut';}
async function _wlPMap(items,fn,conc){conc=conc||4;var out=new Array(items.length),idx=0;async function w(){while(idx<items.length){var i=idx++;try{out[i]=await fn(items[i],i);}catch(e){out[i]=null;}}}var ws=[];for(var k=0;k<Math.min(conc,items.length);k++)ws.push(w());await Promise.all(ws);return out;}
async function proxAnalyzePrice(il,ilce,mah,tip,durum,m2){var k=[il,ilce,mah||'',tip,durum,m2].join('|');if(_wlAnalyzeCache[k]!==undefined)return _wlAnalyzeCache[k];var v=null;try{var r=await proxApi('/api/v1/tenant/prox/analyze',{method:'POST',body:{il:il,ilce:ilce,mahalle:mah||'',kategori:proxKategoriOf(tip),durum:durum,brut_m2:m2,attrs:{}}});if(r&&r.success===true&&!r.fallback){var rg=r.range||{};var mn=+rg.min_value||0,st=+r.strongest_value||0,mx=+rg.max_value||0;if(mn>0||st>0)v={min:mn||st,strong:st,max:mx,conf:(r.confidence!=null?r.confidence:null)};}}catch(e){}_wlAnalyzeCache[k]=v;return v;}
async function proxEndeksM2(il,ilce,durum){var k=il+'|'+ilce+'|'+durum;if(_wlM2Cache[k]!==undefined)return _wlM2Cache[k];var v=null;try{var r=await proxApi('/api/v1/tenant/endeks?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce)+'&kategori=konut&durum='+durum);if(r&&r.success&&r.data&&+r.data.m2>0)v=+r.data.m2;}catch(e){}_wlM2Cache[k]=v;return v;}
function wlStale(key,il,maxH){maxH=maxH||24;try{var p=JSON.parse(localStorage.getItem(key)||'null');if(!p||p.il!==il||!p.ts)return true;return (Date.now()-p.ts)>maxH*3600000;}catch(e){return true;}}
function wlAgo(ts){if(!ts)return '—';var s=Math.max(0,Math.round((Date.now()-ts)/1000));if(s<60)return 'az önce';var m=Math.round(s/60);if(m<60)return m+' dk önce';var h=Math.round(m/60);if(h<24)return h+' sa önce';return Math.round(h/24)+' gün önce';}
var VIP_TIPS=[{tip:'yali',tag:'Boğaz Yalısı',oda:'7+2',ozet:'Özel iskele',m2:820},{tip:'villa',tag:'Müstakil Villa',oda:'6+2',ozet:'Havuz & bahçe',m2:540},{tip:'penthouse',tag:'Penthouse',oda:'5+1',ozet:'360° manzara',m2:410},{tip:'rezidans',tag:'Branded Residence',oda:'4+1',ozet:'Otel konsept',m2:260}];
var VIP_CADDE=['Kuruçeşme Cad.','Abdi İpekçi Cad.','Bağdat Cad.','Sahil Yolu','Nispetiye Cad.','Tepeüstü Sok.','Vali Konağı Cad.'];
var _vipBusy=false;
async function rebuildVipFromProx(il,silent){if(_vipBusy)return;_vipBusy=true;saLoad();il=il||SERVICE_AREA.primary||PROVINCE.name;
  try{
    var work=saWorkList(6);var illerSet={};work.forEach(function(w){illerSet[w.il]=1;});
    try{await Promise.all(Object.keys(illerSet).map(function(x){return loadMahalle(x);}));}catch(e){}
    var cArsa=saHasCat('arsa');
    if(!silent&&typeof toast==='function')toast('ProX gerçek fiyatlarla Özel Portföy oluşturuluyor… ('+work.length+' bölge)');
    var specs=[],ti=0,ci=0,primary=SERVICE_AREA.primary;
    work.forEach(function(w,i){var t=VIP_TIPS[ti++%VIP_TIPS.length];var rm=realMah(w.il,w.ilce,3);
      specs.push({il:w.il,ilce:w.ilce,tip:t.tip,tag:t.tag,oda:t.oda,ozet:t.ozet,m2:t.m2,mah:(rm[0]||'Merkez'),cadde:VIP_CADDE[ci++%VIP_CADDE.length]});
      if(cArsa&&i<3)specs.push({il:w.il,ilce:w.ilce,tip:'arsa',tag:'Yatırım Arsası',oda:'İmarlı',ozet:'Ticari imar',m2:1000,mah:(rm[1]||'Merkez'),cadde:VIP_CADDE[ci++%VIP_CADDE.length]});
    });
    var priced=await _wlPMap(specs,function(s){return proxAnalyzePrice(s.il,s.ilce,s.mah,s.tip,'satilik',s.m2);},4);
    var out=[],real=0;
    specs.forEach(function(s,ix){var az=priced[ix],baslangic;
      if(az&&az.min>0){baslangic=Math.max(100000,Math.round(az.min/100000)*100000);real++;}
      else{var base=(BAZ[s.ilce]&&BAZ[s.ilce].m2)||30000;baslangic=Math.round(base*s.m2*1.4/100000)*100000;}
      var ekIl=(s.il!==primary);
      out.push({tip:s.tip,tag:s.tag,baslik:s.mah+' '+s.tag,cadde:s.cadde,bolge:s.ilce+(ekIl?' · '+s.il:''),m2:s.m2+' m²',oda:s.oda,ozet:s.ozet,baslangic:baslangic});
    });
    if(out.length){VIP_PORTFOLIO.length=0;out.forEach(function(x){VIP_PORTFOLIO.push(x);});}
    try{localStorage.setItem('dn_vip_ts',JSON.stringify({il:primary,ts:Date.now(),n:out.length,real:real}));}catch(e){}
    try{var g=document.getElementById('vaultGrid');if(g)g.innerHTML=vipCardsHTML();}catch(e){}
    try{renderVipStatus();}catch(e){}
    if(!silent&&typeof toast==='function')toast('✓ Özel Portföy '+primary+': '+out.length+' gayrimenkul ('+real+' gerçek ProX analiz fiyatı).');
  }catch(e){if(!silent&&typeof toast==='function')toast('Portföy oluşturulamadı.');}
  _vipBusy=false;}
function renderVipStatus(){var el=document.getElementById('vipStatus');if(!el)return;var q=null,ts=null;try{q=JSON.parse(localStorage.getItem('dn_quota')||'null');}catch(e){}try{ts=JSON.parse(localStorage.getItem('dn_vip_ts')||'null');}catch(e){}
  el.innerHTML='<div style="font-size:12.5px;color:var(--muted);line-height:1.7">📦 Özel Portföy: '+(ts&&ts.ts?('<b style="color:var(--gold)">'+wlAgo(ts.ts)+'</b> · '+ts.n+' gayrimenkul / '+(ts.real||0)+' gerçek analiz fiyatı ('+ts.il+')'):'henüz ProX ile oluşturulmadı')+(q?(' &nbsp;·&nbsp; 📊 Kota: '+fmt(q.count)+' istek ('+q.month+')'):'')+'</div>';}
window.rebuildVipFromProx=rebuildVipFromProx;window.renderVipStatus=renderVipStatus;
/* ===================== KURULUM SİHİRBAZI — danışman tek akış ===================== */
var OB={step:1,advisor:'',brand:'',unvan:'',vergi:'',mail:'',tel:'',adres:'',belge:'',accent:'',logo:'',bolgeler:'',key:''};
var OB_STEPS=['Danışman & Firma','EİDS Yetki','Marka & Logo','Hizmet Bölgeleri','ProX ile Kur'];
function obSeed(){try{var s=SAAS_CONFIG.systemSettings,f=SAAS_CONFIG.firma||{},e=f.eids||{},k=f.kapsama||{};
  OB.advisor=SAAS_CONFIG.advisorName||'';OB.brand=(saasResolve('brandName')||'');OB.unvan=f.unvan||'';OB.vergi=f.vergi||'';OB.mail=f.mail||'';OB.tel=f.tel||'';OB.adres=f.adres||'';OB.belge=e.belgeNo||'';OB.accent=s.accent||'';OB.logo=saasResolve('logoUrl')||'';OB.il=(function(){try{return (typeof saLoad==='function'?saLoad().primary:null)||'İstanbul';}catch(_e){return 'İstanbul';}})();OB.key='';}catch(e){}}
function obCollect(){function v(id){var e=document.getElementById(id);return e?e.value.trim():undefined;}
  var m={ob_advisor:'advisor',ob_brand:'brand',ob_unvan:'unvan',ob_vergi:'vergi',ob_mail:'mail',ob_tel:'tel',ob_adres:'adres',ob_belge:'belge',ob_accent:'accent',ob_logo:'logo',ob_il:'il',ob_key:'key'};
  Object.keys(m).forEach(function(id){var val=v(id);if(val!==undefined)OB[m[id]]=val;});}
function _obe(s){return (s||'').replace(/"/g,'&quot;');}
function obBody(n){
  if(n===1)return '<p class="sub">Danışman ve firma bilgileriniz — logo yazısı, künye ve yasal metinler bunlardan dolar.</p>'
    +'<div class="sta-f"><label>Danışman Adı *</label><input id="ob_advisor" value="'+_obe(OB.advisor)+'" placeholder="Selin Meridyen"></div>'
    +'<div class="sta-f"><label>Marka / Logo Yazısı</label><input id="ob_brand" value="'+_obe(OB.brand)+'" placeholder="Selin Meridyen"></div>'
    +'<div class="sta-f"><label>Ticari Unvan</label><input id="ob_unvan" value="'+_obe(OB.unvan)+'" placeholder="... Gayrimenkul Danışmanlık"></div>'
    +'<div class="sta-row2"><div class="sta-f"><label>Vergi No</label><input id="ob_vergi" value="'+_obe(OB.vergi)+'"></div><div class="sta-f"><label>Telefon</label><input id="ob_tel" value="'+_obe(OB.tel)+'"></div></div>'
    +'<div class="sta-row2"><div class="sta-f"><label>E-posta</label><input id="ob_mail" value="'+_obe(OB.mail)+'"></div><div class="sta-f"><label>Adres</label><input id="ob_adres" value="'+_obe(OB.adres)+'"></div></div>';
  if(n===2)return '<p class="sub">EİDS — açık ilan yayınlamak için yetki belgesi gerekir; VIP portföy serbesttir. Şimdi girin veya sonra ekleyin.</p>'
    +'<div class="sta-f"><label>Yetki Belge No (7+ hane)</label><input id="ob_belge" value="'+_obe(OB.belge)+'" placeholder="0034812"></div>';
  if(n===3)return '<p class="sub">Marka rengi ve logo (opsiyonel).</p>'
    +'<div class="sta-row2"><div class="sta-f"><label>Altın Ton (accent)</label><input id="ob_accent" value="'+_obe(OB.accent)+'" placeholder="#b4975a"></div><div class="sta-f"><label>Logo URL</label><input id="ob_logo" value="'+_obe(OB.logo)+'" placeholder="https://.../logo.png"></div></div>';
  if(n===4)return '<p class="sub">Ana hizmet ilinizi seçin. İlçe / mahalle / kategori detaylarını sonra admin → Hizmet Alanı\'ndan yönetirsiniz.</p>'
    +'<div class="sta-f"><label>Ana İl</label><select id="ob_il" style="width:100%;padding:11px;border:1px solid var(--line-soft);border-radius:9px;background:#0a0a0b;color:inherit;font:inherit">'+(typeof trIlList==='function'?trIlList():['İstanbul']).slice().sort(function(a,b){return a.localeCompare(b,'tr');}).map(function(il){return '<option'+(il===OB.il?' selected':'')+'>'+il+'</option>';}).join('')+'</select></div>';
  return '<p class="sub">ProX API anahtarı (opsiyonel — canlı analiz/AI). Boş bırakılırsa demo ile kurulur.</p>'
    +'<div class="sta-f"><label>ProX API Anahtarı</label><input id="ob_key" value="'+_obe(OB.key)+'" placeholder="prox_..." style="font-family:monospace;font-size:12px"></div>'
    +'<div style="background:#0a0a0b;border:1px solid var(--line-soft);border-radius:10px;padding:12px 14px;margin-top:10px;font-size:13px;line-height:1.7;color:var(--muted)"><b style="color:var(--gold)">Kurulum özeti</b><br>Danışman: <b>'+_obe(OB.advisor||OB.brand||'—')+'</b> · EİDS: '+(OB.belge?'✓ '+_obe(OB.belge):'sonra')+'<br>İl: '+_obe(OB.il||'—')+' · ProX: '+(OB.key?'✓ anahtar':'demo')+'</div>';}
function obRender(){var id='obWizard',m=document.getElementById(id);
  if(!m){m=document.createElement('div');m.id=id;m.style.cssText='position:fixed;inset:0;z-index:99999;display:none;align-items:center;justify-content:center;padding:20px';
    m.innerHTML='<div style="position:absolute;inset:0;background:rgba(0,0,0,.75)"></div><div id="obCard" style="position:relative;max-width:580px;width:100%;max-height:88vh;overflow:auto;background:var(--ink,#0b0b0c);border:1px solid var(--line-soft);border-radius:16px;padding:26px"></div>';
    document.body.appendChild(m);}
  var dots=OB_STEPS.map(function(t,i){var no=i+1,on=no===OB.step,done=no<OB.step;return '<div style="flex:1;text-align:center;font-size:10.5px;color:'+(on?'var(--gold)':done?'#8a7a4e':'var(--muted)')+';font-weight:'+(on?'700':'500')+'"><div style="height:5px;border-radius:3px;background:'+(on||done?'var(--gold)':'var(--line-soft)')+';margin-bottom:5px"></div>'+(done?'✓ ':'')+t+'</div>';}).join('');
  var last=OB.step===OB_STEPS.length;
  document.getElementById('obCard').innerHTML='<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px"><h3 style="font-family:var(--serif);color:var(--gold);margin:0;font-size:22px">🚀 Kurulum Sihirbazı</h3><span class="sub">'+OB.step+'/'+OB_STEPS.length+'</span></div>'
    +'<div style="display:flex;gap:6px;margin:12px 0 16px">'+dots+'</div>'
    +'<div style="min-height:170px">'+obBody(OB.step)+'</div>'
    +'<div style="display:flex;gap:10px;margin-top:16px;justify-content:space-between">'
    +(OB.step>1?'<button class="btn btn-line" onclick="obGo(-1)">← Geri</button>':'<button class="btn btn-line" onclick="obClose()">Daha sonra</button>')
    +(last?'<button class="btn btn-gold" onclick="obFinish()">✓ Kur & Yayınla</button>':'<button class="btn btn-gold" onclick="obGo(1)">Devam →</button>')+'</div>';
  m.style.display='flex';}
function obGo(d){obCollect();if(d>0&&OB.step===1&&!(OB.advisor||OB.brand)){toast('Danışman/marka adını girin.');return;}OB.step=Math.max(1,Math.min(OB_STEPS.length,OB.step+d));obRender();}
function openOnboarding(){obSeed();OB.step=1;obRender();}
function obClose(){var m=document.getElementById('obWizard');if(m)m.style.display='none';}
function obFinish(){obCollect();if(!(OB.brand||OB.advisor)){OB.step=1;obRender();toast('Danışman/marka adı gerekli.');return;}
  try{var s=SAAS_CONFIG.systemSettings,f=eidsFirma();
    if(OB.brand)s.brandName=OB.brand;if(OB.advisor)SAAS_CONFIG.advisorName=OB.advisor;
    if(OB.accent){s.accent=OB.accent;s.gold=OB.accent;}if(OB.logo)SAAS_CONFIG.tenantSettings.logoUrl=OB.logo;
    if(OB.unvan)f.unvan=OB.unvan;if(OB.vergi)f.vergi=OB.vergi;if(OB.mail)f.mail=OB.mail;if(OB.tel)f.tel=OB.tel;if(OB.adres)f.adres=OB.adres;
    if(OB.belge){f.eids.belgeNo=OB.belge.replace(/\D/g,'');f.eids.connected=true;eidsVerify();}
    if(OB.il&&typeof applyProvince==='function'){try{saLoad();applyProvince(OB.il);saSave();}catch(_e){}}
    if(OB.key)window.EMLAK_TENANT.tenant_key=OB.key;
    initSaaSTheme();applySaaSSettings();try{eidsRenderPublic();applySchema();}catch(e){}
    try{localStorage.setItem('dn_onboarded','1');}catch(e){}
    obClose();toast('✓ Kurulum tamam! '+(OB.brand||OB.advisor)+' yayında.'+(OB.key?'':' (ProX anahtarını admin→ProX/EİDS\'ten ekleyebilirsiniz.)'));
  }catch(e){toast('Kurulumda hata: '+(e&&e.message||e));}}
window.openOnboarding=openOnboarding;window.obGo=obGo;window.obClose=obClose;window.obFinish=obFinish;
window.addEventListener('hashchange',function(){if(location.hash==='#kur')openOnboarding();});
window.addEventListener('load',function(){try{if(location.hash==='#kur')setTimeout(openOnboarding,500);}catch(e){}});
function initSaaSTheme(){const r=document.documentElement.style;const a=saasResolve('accent'),a2=saasResolve('accent2'),as=saasResolve('accentSoft');if(a){r.setProperty('--accent',a);r.setProperty('--gold',a);}if(a2)r.setProperty('--accent-2',a2);if(as)r.setProperty('--gold-soft',as);}
function applySaaSSettings(){
  const title=saasResolve('metaTitle');if(title)document.title=title;
  const setMeta=(name,val)=>{if(val==null)return;let m=document.querySelector('meta[name="'+name+'"]');if(!m){m=document.createElement('meta');m.name=name;document.head.appendChild(m);}m.content=val;};
  setMeta('description',saasResolve('metaDescription'));
  setMeta('keywords',saasResolve('metaKeywords'));
  const gsc=saasResolve('googleSiteVerification');if(gsc)setMeta('google-site-verification',gsc.replace('google-site-verification=',''));
  const fav=saasResolve('faviconUrl');
  if(fav){let l=document.querySelector('link[rel="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l);}l.href=fav;}
  const ga=saasResolve('googleAnalytics');
  if(ga&&!window.__gaLoaded){window.__gaLoaded=true;const s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ga;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',ga);}
  /* marka adı */
  const bn=saasResolve('brandName');if(bn){const e=document.getElementById('brandName');if(e)e.textContent=bn;}
  /* logo görseli */
  const logo=saasResolve('logoUrl');const mark=document.getElementById('brandMark');
  if(mark){if(logo){mark.classList.add('has-img');mark.innerHTML='<img src="'+logo+'" alt="logo">';}else{mark.classList.remove('has-img');mark.textContent=(bn||'M').trim().charAt(0).toUpperCase();}}
}

/* ---------- Toast ---------- */
let _toastT;function toast(msg){let t=document.getElementById('toast');if(!t){t=document.createElement('div');t.id='toast';t.className='toast';document.body.appendChild(t);}t.innerHTML=msg;t.classList.add('on');clearTimeout(_toastT);_toastT=setTimeout(()=>t.classList.remove('on'),3600);}

/* ---------- Format ---------- */
function fmt(n){return '₺'+Number(n).toLocaleString('tr-TR');}

/* ---------- Nav / Chrome ---------- */
function toggleNav(){document.getElementById('navLinks').classList.toggle('open');}
function closeNav(){document.getElementById('navLinks').classList.remove('open');}
function setActiveNav(k){document.querySelectorAll('#navLinks .lnk').forEach(a=>a.classList.toggle('act',a.dataset.k===k));}
window.addEventListener('scroll',()=>{if(!document.getElementById('pageOverlay').classList.contains('on'))document.getElementById('nav').classList.toggle('scrolled',window.scrollY>40);});

const _PIN='<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.4"/></svg>';
const _ARR='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
const _LCK='<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>';

/* =====================================================================
   VERİ KATMANI — Güncel İlanlar (açık) + VIP Portföy (gizli)
   ===================================================================== */
const _VIP_SVG={
  yali:'<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 120h168"/><path d="M40 120V66l60-30 60 30v54"/><path d="M40 66 100 36l60 30" opacity=".6"/><rect x="62" y="80" width="22" height="22"/><rect x="116" y="80" width="22" height="22"/><path d="M90 120v-24h20v24"/></svg>',
  penthouse:'<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M50 124V40h100v84"/><path d="M50 40 100 16l50 24" opacity=".6"/><path d="M66 60h20M114 60h20M66 86h20M114 86h20"/><path d="M88 124v-26h24v26"/><path d="M30 124h140"/></svg>',
  villa:'<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M28 122h144"/><path d="M48 122V70h60v52"/><path d="M48 70 78 48l30 22" opacity=".6"/><rect x="62" y="84" width="16" height="16"/><path d="M108 122V86h44v36"/><path d="M108 86 130 70l22 16" opacity=".6"/></svg>',
  rezidans:'<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M70 124V28h60v96"/><path d="M84 44h12M104 44h12M84 64h12M104 64h12M84 84h12M104 84h12"/><path d="M40 124V64h30v60M130 124V64h30v60" opacity=".55"/><path d="M28 124h144"/></svg>',
  loft:'<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M44 122V54h112v68"/><path d="M44 54 100 28l56 26" opacity=".6"/><path d="M64 76h32v46H64z"/><path d="M112 76h28M112 96h28"/><path d="M28 122h144"/></svg>',
  arsa:'<svg viewBox="0 0 200 140" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M30 110 80 40l60 18 30-20" opacity=".7"/><path d="M30 110h140"/><path d="M50 110V92M90 110V86M130 110V96" opacity=".5"/><path d="M150 40v40M140 50h20"/></svg>'
};
/* Açık ilanlar — tam şeffaf (fiyat/oda/m²/bölge) */
const LISTINGS=[
  {tip:'penthouse',durum:'Satılık',baslik:'Levent Çift Kat Penthouse',bolge:'Beşiktaş · Levent',m2:320,oda:'4+1',kat:'18–19',fiyat:48500000},
  {tip:'rezidans',durum:'Satılık',baslik:'Maslak Marka Rezidans',bolge:'Sarıyer · Maslak',m2:185,oda:'3+1',kat:'24',fiyat:22000000},
  {tip:'villa',durum:'Satılık',baslik:'Zekeriyaköy Havuzlu Villa',bolge:'Sarıyer · Zekeriyaköy',m2:540,oda:'6+2',kat:'3 katlı',fiyat:65000000},
  {tip:'rezidans',durum:'Satılık',baslik:'Nişantaşı Tasarım Daire',bolge:'Şişli · Nişantaşı',m2:260,oda:'4+1',kat:'7',fiyat:31000000},
  {tip:'loft',durum:'Kiralık',baslik:'Cihangir Manzaralı Loft',bolge:'Beyoğlu · Cihangir',m2:130,oda:'2+1',kat:'6',fiyat:185000,kira:true},
  {tip:'villa',durum:'Satılık',baslik:'Bahçeşehir Müstakil Villa',bolge:'Başakşehir · Bahçeşehir',m2:410,oda:'5+1',kat:'2 katlı',fiyat:27000000}
];
/* VIP — adres gizli, yalnız cadde/sokak + başlangıç fiyatı */
const VIP_PORTFOLIO=[
  {tip:'yali',tag:'Boğaz Yalısı',baslik:'Tarihî Restore Yalı',cadde:'Kuruçeşme Cad.',bolge:'Sarıyer',m2:'820 m²',oda:'7+2',ozet:'Özel iskele',baslangic:285000000},
  {tip:'penthouse',tag:'Penthouse',baslik:'Çatı Dubleks Penthouse',cadde:'Abdi İpekçi Cad.',bolge:'Şişli',m2:'410 m²',oda:'5+1',ozet:'360° şehir',baslangic:96000000},
  {tip:'villa',tag:'Müstakil Villa',baslik:'Havuzlu Tasarım Villa',cadde:'Tepeüstü Sok.',bolge:'Beykoz',m2:'640 m²',oda:'6+2',ozet:'Akıllı ev',baslangic:140000000},
  {tip:'rezidans',tag:'Branded Residence',baslik:'Otel Konseptli Rezidans',cadde:'Sahil Yolu',bolge:'Beşiktaş',m2:'285 m²',oda:'4+1',ozet:'Concierge',baslangic:78000000},
  {tip:'yali',tag:'Yalı Dairesi',baslik:'Su Üstü Yalı Katı',cadde:'Beylerbeyi Sahil Cad.',bolge:'Üsküdar',m2:'320 m²',oda:'4+1',ozet:'Özel rıhtım',baslangic:120000000},
  {tip:'arsa',tag:'Yatırım Arsası',baslik:'Deniz Manzaralı İmarlı Arsa',cadde:'Bağ Sok.',bolge:'Çeşme · Alaçatı',m2:'4.200 m²',oda:'İmarlı',ozet:'Villa imarı',baslangic:92000000}
];
/* Bölgesel prim (değer artışı) ipuçları — ProX için */
const PRIM={'Levent':'%13–15','Maslak':'%11–13','Zekeriyaköy':'%9–11','Nişantaşı':'%10–12','Cihangir':'%8–10','Bahçeşehir':'%7–9','Sarıyer':'%12–14','Beykoz':'%9–11','Beşiktaş':'%11–13','Üsküdar':'%9–11','Çeşme':'%12–15','Alaçatı':'%12–15','Boğaz':'%14–16'};

function listingCardsHTML(){return LISTINGS.map(l=>{
  const price=l.kira?fmt(l.fiyat)+' <span class="per">/ay</span>':fmt(l.fiyat);
  const nm=l.baslik.replace(/'/g,'’');
  return '<article class="vcard" onclick="leadFor(\''+nm+'\')">'
   +'<div class="vcard-img"><div class="glow"></div><span class="vcard-tag">'+l.durum+'</span>'+(_VIP_SVG[l.tip]||_VIP_SVG.villa)+'</div>'
   +'<div class="vcard-body"><h3>'+l.baslik+'</h3>'
   +'<div class="vcard-loc">'+_PIN+l.bolge+'</div>'
   +'<div class="vcard-spec"><div><b>'+l.m2+' m²</b>Alan</div><div><b>'+l.oda+'</b>Oda</div><div><b>'+l.kat+'</b>Kat</div></div>'
   +'<div class="vcard-ft"><div class="vcard-price">'+price+'<span>'+l.durum+'</span></div><div class="vcard-go">Ücretsiz Analiz'+_ARR+'</div></div>'
   +'</div></article>';
}).join('');}

function vipCardsHTML(){return VIP_PORTFOLIO.map(p=>{
  const nm=p.baslik.replace(/'/g,'’');
  return '<article class="vcard" onclick="leadFor(\''+nm+'\')">'
   +'<div class="vcard-img"><div class="glow"></div><span class="vcard-tag">'+p.tag+'</span><span class="vcard-lock">'+_LCK+' No Gizli</span>'+(_VIP_SVG[p.tip]||'')+'</div>'
   +'<div class="vcard-body"><h3>'+p.baslik+'</h3>'
   +'<div class="vcard-loc">'+_PIN+p.cadde+' · '+p.bolge+'</div>'
   +'<div class="vcard-spec"><div><b>'+p.m2+'</b>Alan</div><div><b>'+p.oda+'</b>Tip</div><div><b>'+p.ozet+'</b>Ayrıcalık</div></div>'
   +'<div class="vcard-ft"><div class="vcard-price">'+fmt(p.baslangic)+'<span>Başlangıç · Yetki Belgeli</span></div><div class="vcard-go">Ücretsiz Analiz'+_ARR+'</div></div>'
   +'</div></article>';
}).join('');}

function contactHTML(){return '<div class="contact-grid contact">'
  +'<div><div class="eyebrow">İletişim</div><h2 style="font-size:clamp(28px,4vw,42px);margin-bottom:24px">Tek bir görüşme, doğru başlangıçtır.</h2>'
  +'<div class="row"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.6 2.6.6 2.6.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6"/></svg></div><div><b>Doğrudan Hat</b><span>+90 532 000 00 00 · WhatsApp randevulu</span></div></div>'
  +'<div class="row"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 7 8.5 6 8.5-6"/></svg></div><div><b>E-posta</b><span>ozel@selinmeridyen.com</span></div></div>'
  +'<div class="row"><div class="ic">'+_PIN+'</div><div><b>Ofis</b><span>Bebek · İstanbul (yalnızca randevulu)</span></div></div>'
  +'<div class="row"><div class="ic"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg></div><div><b>Çalışma İlkesi</b><span>Şeffaf ilan · gizli portföy · tek muhatap</span></div></div></div>'
  +'<div class="contact-cta"><div class="eyebrow" style="display:block">Ücretsiz Analiz</div><h3>Gayrimenkulünüzü konuşalım</h3><p>Bağlayıcı olmayan, gizli bir ön değer analizi için randevu oluşturun.</p><a class="btn btn-gold" onclick="contactLead()" style="width:100%;justify-content:center">Randevu Oluştur</a></div>'
  +'</div>';}

function apptModuleHTML(){return '<div class="appt-card">'
  +'<div class="appt-head"><div class="info"><div class="eyebrow">Ücretsiz Gayrimenkul Değer Analizi</div><h3>Randevunuzu planlayın</h3><p>Size en uygun günü ve saati seçin; gayrimenkulünüzün değerini gizlilik içinde, ücretsiz olarak birlikte değerlendirelim.</p><ul><li>Bağlayıcı olmayan ön değer analizi</li><li>Yüz yüze veya özel video görüşme</li><li>Tam gizlilik · doğru fiyat stratejisi</li></ul></div>'
  +'<div class="vis"><svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"><rect x="30" y="44" width="140" height="124" rx="4"/><path d="M30 78h140M64 30v28M136 30v28"/><path d="M54 100h20M90 100h20M126 100h20M54 126h20M90 126h20M126 126h20" opacity=".6"/><circle cx="100" cy="126" r="11" stroke="var(--gold)"/></svg></div></div>'
  +'<div class="appt-body"><div class="appt-step-h"><b>1</b> Gün seçin</div><div class="days" id="apptDays"></div>'
  +'<div class="appt-step-h"><b>2</b> Saat seçin</div><div class="slots" id="apptSlots"></div>'
  +'<div class="appt-step-h"><b>3</b> İletişim bilgileriniz</div>'
  +'<div class="appt-form"><div class="fld"><label>Ad Soyad</label><input id="ap_ad" placeholder="Adınız Soyadınız"></div><div class="fld"><label>Telefon</label><input id="ap_tel" placeholder="05xx xxx xx xx"></div><div class="fld full"><label>Gayrimenkul / ilgilendiğiniz portföy</label><input id="ap_not" placeholder="Örn. Levent penthouse, satılık dairem..."></div></div>'
  +'<div class="appt-summary" id="apptSummary">Lütfen bir gün ve saat seçin.</div>'
  +'<button class="btn btn-gold" style="margin-top:20px;width:100%;justify-content:center" onclick="apptSubmit()">Ücretsiz Analiz Talebini Gönder</button></div></div>';}

/* ---------- footer (tek kaynak, her sayfada birebir aynı) ---------- */
function footerHTML(){return '<footer><div class="wrap"><div class="fcols">'
  +'<div><div class="brand" onclick="goHome()"><span class="mark">'+_leD((saasResolve('brandName')||'M').trim().charAt(0))+'</span><span><b>'+_leD(saasResolve('brandName')||'Selin Meridyen')+'</b><small>Lüks Portföy Danışmanı</small></span></div><p>Yetki belgeli butik emlak danışmanlığı. Güncel lüks ilanlar, davet usulü VIP özel portföy ve ücretsiz gayrimenkul değer analizi.</p></div>'
  +'<div><h4>Keşfet</h4><ul><li><a onclick="navGo(\'ilanlar\')">İlanlar</a></li><li><a onclick="navGo(\'vip\')">VIP Portföy</a></li><li><a onclick="navGo(\'surec\')">Süreç</a></li><li><a onclick="navGo(\'randevu\')">Ücretsiz Analiz</a></li></ul></div>'
  +'<div><h4>Kurumsal</h4><ul><li><a onclick="goHome()">Ana Sayfa</a></li><li><a href="hakkimizda.html">Hakkımda</a></li><li><a href="sss.html">S.S.S</a></li><li><a onclick="navGo(\'iletisim\')">İletişim</a></li><li><a onclick="openSaasPortal()">Müşteri Portalı</a></li><li><a href="https://wa.me/905320000000" target="_blank" rel="noopener noreferrer">WhatsApp</a></li></ul></div>'
  +'<div><h4>Yasal</h4><ul><li><a onclick="openKvkk()">KVKK Aydınlatma</a></li><li><a onclick="openCerez()">Çerez Politikası</a></li><li><a onclick="openMesafeli()">Mesafeli Hizmet & Kullanım</a></li><li><a onclick="openAdminGate()">Yönetim Paneli</a></li></ul></div>'
  +'</div><div class="fbot"><span>© 2026 Selin Meridyen · Lüks Konut & Özel Portföy Danışmanlığı · Tüm hakları saklıdır.</span><span class="fbot-lang">Dil: <select class="lang-sel" onchange="gmLang(this.value)" aria-label="Dil / Language"><option value="tr">Türkçe</option><option value="en">English</option><option value="ar">العربية</option></select></span><a class="gm-prox" href="https://emlakekspertizi.com" target="_blank" rel="noopener noreferrer" aria-label="Powered by ProX"><span>Powered by</span><span class="prox-logo">Pro<span class="prox-x">X</span></span></a></div></div></footer>';}

/* =====================================================================
   DİNAMİK SAYFA ROUTER (overlay — üst+alt menü birebir tutarlı)
   ===================================================================== */
const PAGES={
  ilanlar:{eyebrow:'Güncel İlanlar',title:'Açık Portföy',em:'tam şeffaf bilgi',desc:'Fiyat, oda, metrekare ve bölge bilgisi açıkça paylaşılan güncel lüks ilanlar. Beğendiğiniz gayrimenkul için ücretsiz değer analizi talep edin.',
    body:()=>'<section class="sec-pad"><div class="wrap"><div class="card-grid">'+listingCardsHTML()+'</div><div class="vault-note" style="margin-top:36px">Tüm ilanlar yetki belgelidir · detaylı bilgi ve yerinde değerlendirme için <b>ücretsiz analiz</b> alın.</div></div></section>'},
  vip:{eyebrow:'Kişisel VIP Portföyüm',title:'Davet Usulü',em:'gizli özel portföy',desc:'Yalnızca cadde/sokak ismi ve başlangıç değeri paylaşılır. Tam adres, kimlik ve net fiyat mahremiyet gereği yalnızca ön analiz sonrası açıklanır.',
    body:()=>'<section class="vault sec-pad"><div class="wrap"><div class="card-grid">'+vipCardsHTML()+'</div><div class="vault-note" style="margin-top:36px">🔒 <b>Adres gizliliği</b> tüm kayıtlarda esastır · net konum yalnızca <b>ücretsiz analiz görüşmesinde</b> paylaşılır.</div></div></section>'},
  surec:{eyebrow:'Süreç & Temsil',title:'Beş Aşamada',em:'değere taşıma',desc:'Gayrimenkulünüzü doğru alıcıyla, değerini koruyarak buluşturan uçtan uca temsil süreci.',
    body:()=>'<section class="sec-pad"><div class="wrap"><div class="proc-grid">'
      +'<div class="proc"><div class="no">01</div><h4>Değer Analizi</h4><p>Konum, eşsiz nitelikler ve hedef alıcı profili analiz edilir; doğru fiyat stratejisi kurulur.</p></div>'
      +'<div class="proc"><div class="no">02</div><h4>Sahneleme</h4><p>Profesyonel görsel, mimari sunum dosyası ve mahremiyeti koruyan tanıtım hazırlanır.</p></div>'
      +'<div class="proc"><div class="no">03</div><h4>Konumlandırma</h4><p>Açık ilan ya da davet usulü gizli pazarlama; gayrimenkulün niteliğine göre doğru kanal seçilir.</p></div>'
      +'<div class="proc"><div class="no">04</div><h4>Müzakere</h4><p>Tek muhatap olarak tüm görüşmeler yürütülür, teklifler değeri koruyacak şekilde müzakere edilir.</p></div>'
      +'<div class="proc"><div class="no">05</div><h4>Kusursuz Kapanış</h4><p>Tapu, hukuki ve mali süreçler koordine edilir; devir gününe kadar yanınızdayım.</p></div>'
      +'</div><div style="text-align:center;margin-top:46px"><a class="btn btn-gold" onclick="navGo(\'randevu\')">Ücretsiz Analiz ile Başla</a></div></div></section>'},
  randevu:{eyebrow:'Ücretsiz Analiz',title:'Gayrimenkul Değer',em:'analizi randevusu',desc:'Bağlayıcı olmayan, gizli bir ön değer analizi için size en uygun gün ve saati seçin.',
    body:()=>'<section class="sec-pad"><div class="wrap">'+apptModuleHTML()+'</div></section>'},
  iletisim:{eyebrow:'İletişim',title:'Bağlantı',em:'kuralım',desc:'Doğrudan hat, e-posta ve randevulu ofis görüşmesi.',
    body:()=>'<section class="sec-pad"><div class="wrap">'+contactHTML()+'</div></section>'}
};
function openPage(key,opts){
  const p=PAGES[key];if(!p)return;
  const ov=document.getElementById('pageOverlay');
  ov.innerHTML='<div class="pov-band"><div class="wrap"><div class="eyebrow">'+p.eyebrow+'</div><h1>'+p.title+' <em>'+p.em+'</em></h1><p>'+p.desc+'</p></div></div>'+p.body()+footerHTML();
  ov.classList.add('on');ov.scrollTop=0;
  document.body.classList.add('lock');
  document.getElementById('homeView').style.display='none';
  document.getElementById('nav').classList.add('scrolled');
  setActiveNav(key);
  if(key==='randevu'){buildDays();buildSlots();if(opts&&opts.note){const n=document.getElementById('ap_not');if(n)n.value=opts.note;}}
}
function closePage(){const ov=document.getElementById('pageOverlay');ov.classList.remove('on');ov.innerHTML='';document.body.classList.remove('lock');document.getElementById('homeView').style.display='';document.getElementById('nav').classList.toggle('scrolled',window.scrollY>40);setActiveNav(null);}
function goHome(){closeNav();closePage();window.scrollTo(0,0);}
function navGo(k){closeNav();openPage(k);}
function contactLead(){if(typeof submitLead==='function')submitLead({sourcePage:'danisman',formType:'contact',name:'',phone:'',email:'',location:'',message:'İletişim bölümünden randevu talebi',requestedService:'Ücretsiz Analiz'});navGo('randevu');}
function leadFor(name){if(typeof closeNav==='function')closeNav();if(typeof submitLead==='function')submitLead({sourcePage:'danisman',formType:'vip',name:'',phone:'',email:'',location:name,message:name+' (ücretsiz analiz talebi)',requestedService:'Ücretsiz Analiz'});openPage('randevu',{note:name+' (ücretsiz analiz talebi)'});toast('🔍 <b>'+name+'</b> için ücretsiz analiz randevusuna yönlendirildiniz.');}

/* =====================================================================
   AKILLI RANDEVU (takvim tabanlı)
   ===================================================================== */
const _apptState={day:null,slot:null};
const _SLOTS=['10:00','11:30','13:30','15:00','16:30','18:00'];
const _DW=['Paz','Pzt','Sal','Çar','Per','Cum','Cmt'];
const _MN=['Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];
function buildDays(){const host=document.getElementById('apptDays');if(!host)return;_apptState.day=null;_apptState.slot=null;const today=new Date();let html='';
  for(let i=1;i<=14;i++){const d=new Date(today.getFullYear(),today.getMonth(),today.getDate()+i);const wd=d.getDay();const off=(wd===0);
    html+='<div class="day'+(off?' off':'')+'" data-lbl="'+d.getDate()+' '+_MN[d.getMonth()]+' '+_DW[wd]+'" onclick="pickDay(this)"><span class="dw">'+_DW[wd]+'</span><span class="dn">'+d.getDate()+'</span><span class="dm">'+_MN[d.getMonth()]+'</span></div>';}
  host.innerHTML=html;}
function buildSlots(){const h=document.getElementById('apptSlots');if(h)h.innerHTML=_SLOTS.map(s=>'<div class="slot" data-s="'+s+'" onclick="pickSlot(this)">'+s+'</div>').join('');}
function pickDay(el){document.querySelectorAll('#apptDays .day').forEach(d=>d.classList.remove('sel'));el.classList.add('sel');_apptState.day=el.dataset.lbl;updateApptSummary();}
function pickSlot(el){document.querySelectorAll('#apptSlots .slot').forEach(s=>s.classList.remove('sel'));el.classList.add('sel');_apptState.slot=el.dataset.s;updateApptSummary();}
function updateApptSummary(){const s=document.getElementById('apptSummary');if(!s)return;if(_apptState.day&&_apptState.slot)s.innerHTML='Seçiminiz: <b>'+_apptState.day+'</b> · saat <b>'+_apptState.slot+'</b> — ücretsiz değer analizi.';else if(_apptState.day)s.innerHTML='<b>'+_apptState.day+'</b> seçildi. Lütfen bir saat seçin.';else s.textContent='Lütfen bir gün ve saat seçin.';}
function apptSubmit(){const ad=(document.getElementById('ap_ad')||{}).value?document.getElementById('ap_ad').value.trim():'';const tel=(document.getElementById('ap_tel')||{}).value?document.getElementById('ap_tel').value.trim():'';
  if(!_apptState.day||!_apptState.slot){toast('⚠ Lütfen bir gün ve saat seçin.');return;}
  if(!ad||!tel){toast('⚠ Lütfen ad ve telefon bilgisi girin.');return;}
  const not=(document.getElementById('ap_not')||{}).value||'';
  if(typeof submitLead==='function')submitLead({sourcePage:'danisman',formType:'randevu',name:ad,phone:tel,email:'',location:'',message:'Randevu: '+_apptState.day+' '+_apptState.slot+(not?(' · '+not):''),requestedService:'Ücretsiz Analiz'});
  dnPushLead({name:ad,phone:tel,konu:'Ücretsiz Analiz Randevusu',msg:_apptState.day+' '+_apptState.slot+(not?(' · '+not):''),src:'Randevu Formu'});/* admin görüşme panosu kaydı */
  toast('✦ Teşekkürler <b>'+ad+'</b> — ücretsiz analiz randevunuz <b>'+_apptState.day+' / '+_apptState.slot+'</b> için alındı.');
  const s=document.getElementById('apptSummary');if(s)s.innerHTML='✓ Talebiniz iletildi: <b>'+_apptState.day+' · '+_apptState.slot+'</b>. Onay için sizi arayacağız.';}

/* =====================================================================
   ProX AI — Conversion Engine (portföy tarar + prim + randevuya yönlendirir)
   ===================================================================== */
function _norm(s){return (s||'').toLocaleLowerCase('tr');}
function proxScan(t){
  const pub=LISTINGS.map(l=>({n:l.baslik,b:l.bolge,f:(l.kira?fmt(l.fiyat)+'/ay':fmt(l.fiyat)),tip:l.tip,gizli:false}));
  const vip=VIP_PORTFOLIO.map(v=>({n:v.baslik,b:v.cadde+' · '+v.bolge,f:'Başlangıç '+fmt(v.baslangic),tip:v.tip,gizli:true}));
  const all=pub.concat(vip);
  const hits=all.filter(x=>{
    if(t.includes(x.tip))return true;
    return _norm(x.b).split(/[ ·]+/).some(w=>w.length>3&&t.includes(w)) || t.includes(_norm(x.n).split(' ')[0]);
  });
  return hits.slice(0,3);
}
function _primFor(t){for(const k in PRIM){if(t.includes(_norm(k)))return {b:k,p:PRIM[k]};}return null;}
function _proxReply(q){
  const t=_norm(q);
  const cta=' Dilerseniz hemen ücretsiz bir <b>değer analizi randevusu</b> oluşturalım; rakamları ve stratejiyi size özel netleştirelim.';
  /* portföy/yatırım sorgusu → tara + prim + dönüşüm */
  const wantsScan=/(penthouse|yalı|yali|villa|rezidans|arsa|loft|daire|konut|portföy|portfoy|yatırım|yatirim|prim|levent|maslak|nişantaşı|nisantasi|cihangir|boğaz|bogaz|çeşme|cesme|beykoz|beşiktaş|besiktas|sarıyer|sariyer|bahçeşehir|bahcesehir|öner|oner|var mı|tavsiye)/.test(t);
  if(wantsScan){
    const hits=proxScan(t);
    if(hits.length){
      let html='Portföyümü sizin için taradım — öne çıkan seçenekler:';
      html+='<ul class="pm-list">'+hits.map(h=>'<li><em>'+h.n+'</em> · '+h.b+' — '+h.f+(h.gizli?' <span style="color:var(--muted-2)">(adres gizli)</span>':'')+'</li>').join('')+'</ul>';
      const pr=_primFor(t);
      if(pr)html+='Bu bölgede (<b>'+pr.b+'</b>) son dönem yıllık değer artışı <b>'+pr.p+'</b> bandında seyretti; doğru zamanlama ve konumlandırmayla prim potansiyeli güçlü.';
      else html+='Bu segmentte doğru konumlandırma, gayrimenkulü piyasada eritmeden değerini koruyarak güçlü bir prim potansiyeli sunar.';
      return html+cta;
    }
    return 'Tam aradığınız profili portföyümde birebir göremedim; ancak ağımdaki davet usulü gayrimenkuller arasında size uygun bir eşleşme bulabilirim.'+cta;
  }
  if(/(gizli|mahrem|adres|ifşa|deşifre)/.test(t))
    return 'Gizlilik çalışmamın temelidir. Gayrimenkulünüz ilan panolarına açılmadan; yalnızca seçili ve önceden değerlendirilmiş alıcı havuzuna, adres ve kimlik paylaşılmadan sunulur. Detaylar yalnızca ciddi alıcıyla, onayınızla açıklanır.'+cta;
  if(/(değer|fiyat|kaça|ne kadar|kıymet|ekspertiz|analiz)/.test(t))
    return 'Değeri bir rakamla başlatmam; önce gayrimenkulün konumunu, eşsiz niteliklerini ve doğru alıcı profilini analiz ederim. Bu yüzden ilk adım her zaman yerinde, ücretsiz bir değer analizidir.'+cta;
  if(/(komisyon|ücret|hizmet|kapsam)/.test(t))
    return 'Hizmetim uçtan uca temsildir: değer analizi ve strateji, profesyonel sahneleme, doğru kanaldan pazarlama, tek elden müzakere ve tapuya kadar kusursuz kapanış. Şeffaf koşulları ön görüşmede netleştiririz.'+cta;
  if(/(sat|satmak|satıl|elden çıkar)/.test(t))
    return 'Gayrimenkulünüzü en doğru alıcıyla, değerini koruyarak buluşturmak için buradayım. Doğru fiyat konumlandırması ve güçlü müzakere ile başlayalım.'+cta;
  if(/(randevu|görüş|buluş|ne zaman|takvim)/.test(t)){setTimeout(()=>{},0);return 'Memnuniyetle. Size en uygun günü ve saati randevu modülünden seçebilirsiniz — görüşmemiz bağlayıcı değildir ve tamamen size özeldir.'+cta;}
  if(/(merhaba|selam|iyi günler|nasıl)/.test(t))
    return 'Hoş geldiniz, memnun oldum. Bir bölge ya da gayrimenkul tipi söyleyin; portföyümü tarayıp size en uygun seçenekleri ve prim potansiyelini paylaşayım.';
  return 'Çok değerli bir soru. Gayrimenkulünüzün niteliğine ve beklentinize göre size özel bir yol haritası çıkarırım; genel-geçer değil, kişiye özel.'+cta;
}
function _proxPush(role,html){const l=document.getElementById('proxLog');if(!l)return;let extra='';if(role==='a')extra='<div><button class="pm-cta" onclick="proxToAnaliz()">📅 Ücretsiz Analiz Randevusu Al</button></div>';l.insertAdjacentHTML('beforeend','<div class="pm '+role+'">'+(role==='a'?'<b>Selin Meridyen — ProX:</b> ':'')+html+extra+'</div>');l.scrollTop=l.scrollHeight;}
/* ===== D3: TAM KAYIT — ProX Asistan yazışmaları + iletişim/randevu talepleri admin panosuna =====
   Yapay zeka yazışmaları dn_asistan_convos'a, form talepleri dn_leads'e; admin "Görüşmeler & Talepler". */
var _dnConvoId=null;
function _dnLogConvo(role,raw){
  if(!raw)return;var t=String(raw).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();if(!t)return;
  try{var KEY='dn_asistan_convos';var arr=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(arr))arr=[];
    var c=_dnConvoId?arr.filter(function(x){return x&&x.id===_dnConvoId;})[0]:null;
    if(!c){_dnConvoId='c'+Date.now();c={id:_dnConvoId,title:'ProX Asistan Görüşmesi',ts:Date.now(),msgs:[]};arr.unshift(c);}
    c.msgs.push({role:(role==='u'?'me':'bot'),text:t});c.ts=Date.now();
    if(role==='u'){var ph=t.match(/(?:\+?90[\s.\-]?)?0?5\d{2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/);if(ph){c.lead=true;c.phone=ph[0].replace(/[^\d+]/g,'');dnPushLead({name:'ProX Asistan ziyaretçisi',phone:c.phone,konu:'ProX Asistan — geri arama',msg:t,src:'ProX Asistan'});}}
    localStorage.setItem(KEY,JSON.stringify(arr.slice(0,200)));
  }catch(e){}
  try{renderGorusmelerD();}catch(e){}
}
function dnPushLead(o){o=o||{};try{var KEY='dn_leads';var arr=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(arr))arr=[];arr.unshift(Object.assign({id:'l'+Date.now(),ts:Date.now(),date:new Date().toLocaleString('tr-TR')},o));localStorage.setItem(KEY,JSON.stringify(arr.slice(0,300)));}catch(e){}try{renderGorusmelerD();}catch(e){}}
function _gDDate(x){try{return new Date(x).toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
function renderGorusmelerD(){
  var host=document.getElementById('dnGorusmelerBody');if(!host)return;
  var convos=[],leads=[];try{convos=JSON.parse(localStorage.getItem('dn_asistan_convos')||'[]');}catch(e){}try{leads=JSON.parse(localStorage.getItem('dn_leads')||'[]');}catch(e){}
  if(!Array.isArray(convos))convos=[];if(!Array.isArray(leads))leads=[];
  var cb=convos.filter(function(c){return c&&c.lead&&c.phone;}).length;
  var H='<div class="dng-kpis"><div class="dng-k"><b>'+convos.length+'</b><span>ProX görüşmesi</span></div><div class="dng-k"><b>'+leads.length+'</b><span>Talep / mesaj</span></div><div class="dng-k'+(cb?' hot':'')+'"><b>'+cb+'</b><span>Geri arama</span></div></div>';
  H+='<h5 class="dng-h">📥 Gelen Talepler</h5>';
  if(!leads.length)H+='<div class="dng-empty">Henüz talep yok. İletişim/randevu formları ve telefon bırakan ziyaretçiler burada listelenir.</div>';
  else H+='<div class="dng-leads">'+leads.map(function(l){return '<div class="dng-lead"><div class="dng-lt"><b>'+_leD(l.name||'—')+'</b><span>'+_leD(l.src||'form')+' · '+_leD(_gDDate(l.ts))+'</span></div><div class="dng-lb">'+(l.phone?('📞 '+_leD(l.phone)+' · '):'')+_leD(l.konu||'')+(l.msg?(' — '+_leD(l.msg)):'')+'</div></div>';}).join('')+'</div>';
  H+='<h5 class="dng-h">💬 ProX Asistan Görüşmeleri (tam döküm)</h5>';
  if(!convos.length)H+='<div class="dng-empty">Henüz görüşme yok. Ziyaretçiler ProX Asistan ile konuştukça tam dökümleri burada görünür.</div>';
  else convos.forEach(function(c){var msgs=(c.msgs||[]).filter(function(m){return m&&m.text;});
    H+='<details class="dng-convo"'+(c.lead?' data-lead="1"':'')+'><summary><span class="dng-ct">'+_leD(c.title||'Sohbet')+'</span><span class="dng-cm">'+_leD(_gDDate(c.ts))+' · '+msgs.length+' mesaj'+(c.lead?' · <b class="dng-tag">📞 '+_leD(c.phone||'telefon')+'</b>':'')+'</span></summary><div class="dng-tr">';
    if(!msgs.length)H+='<div class="dng-empty">Boş görüşme.</div>';
    msgs.forEach(function(m){var me=m.role==='me';H+='<div class="dng-line '+(me?'me':'bot')+'"><span class="who">'+(me?'Ziyaretçi':'ProX')+'</span><span class="tx">'+_leD(m.text)+'</span></div>';});
    H+='</div></details>';});
  host.innerHTML=H;
}
try{window.renderGorusmelerD=renderGorusmelerD;window.dnPushLead=dnPushLead;}catch(e){}
/* Canlı ProX: /prox/ai (answer) + yatırım/portföy sorularında /prox/analyze. Boş/başarısız → yerel _proxReply.
   Sağlayıcı adı ASLA gösterilmez/loglanmaz — yalnızca "ProX". Değer SADECE API'den gelir. */
function _proxAnalyzeHTML(a){
  if(!a||a.success===false)return '';
  var has=(a.strongest_value!=null)||(a.range&&(a.range.min_value!=null||a.range.max_value!=null))||a.karar_ozeti;
  if(!has)return '';
  var html='<ul class="pm-list">';
  if(a.strongest_value!=null)html+='<li><em>En güçlü değer</em> · '+fmt(a.strongest_value)+'</li>';
  if(a.range&&(a.range.min_value!=null||a.range.max_value!=null))html+='<li><em>Değer aralığı</em> · '+fmt(a.range.min_value)+' – '+fmt(a.range.max_value)+(a.range.spread_pct!=null?(' (±%'+a.range.spread_pct+')'):'')+'</li>';
  if(a.confidence_band||a.confidence!=null)html+='<li><em>Güven</em> · '+(a.confidence_band||a.confidence)+'</li>';
  html+='</ul>';
  if(a.karar_ozeti)html+='<div style="margin-top:6px">'+a.karar_ozeti+'</div>';
  if(a.risk_ozeti)html+='<div style="margin-top:4px;color:var(--muted)">'+a.risk_ozeti+'</div>';
  return html;
}
/* Serbest metinden bilinen ilan/portföy bölgesini yakala → /prox/analyze için yapısal alanlar (il/ilçe/mahalle/m2/oda/tip). Eşleşme yoksa null. */
function _proxMatchListing(t){
  var all=LISTINGS.concat(VIP_PORTFOLIO);
  for(var i=0;i<all.length;i++){ var x=all[i]; var parts=_norm((x.bolge||'')+' '+(x.cadde||'')).split(/[ ·]+/).filter(function(w){return w.length>3;});
    for(var j=0;j<parts.length;j++){ if(t.indexOf(parts[j])!==-1){
      var seg=(x.bolge||'').split('·').map(function(s){return s.trim();});
      var m2=typeof x.m2==='number'?x.m2:parseInt(String(x.m2).replace(/[^0-9]/g,''),10)||null;
      return { il:'İstanbul', ilce:seg[0]||'', mahalle:seg[1]||seg[0]||'', m2:m2, oda:x.oda||'', tip:'konut' };
    } }
  }
  return null;
}
async function _proxResolveReply(q){
  try{
    const t=_norm(q);
    const wantsAnalyze=/(yatırım|yatirim|prim|değer|deger|fiyat|kaça|ne kadar|kıymet|kiymet|getiri)/.test(t);
    const _persona=aiGuard(((SAAS_CONFIG.proxAiPrompts&&SAAS_CONFIG.proxAiPrompts.persona)||'')+(saasResolve('customPrompt')?('\n\nEk ton: '+saasResolve('customPrompt')):''));
    const ai=await aiChat({prompt:_persona,message:q,context:"persona=consultant; sector="+window.EMLAK_TENANT.sector});/* DeepSeek: persona=sistem, soru=kullanıcı; yoksa ProX'e düşer */
    var answer=(ai&&!ai.fallback&&ai.success!==false&&ai.answer)?ai.answer:'';
    var analyzeHTML='';
    if(wantsAnalyze){
      var prop=_proxMatchListing(t);
      if(prop&&prop.m2){ try{ const an=await proxApi("/api/v1/tenant/prox/analyze",{method:"POST",body:prop}); if(an&&!an.fallback)analyzeHTML=_proxAnalyzeHTML(an); }catch(_){ } }
    }
    if(answer)return answer.replace(/\n/g,'<br>')+(analyzeHTML?('<div style="margin-top:10px;border-top:1px solid var(--line-soft);padding-top:10px">'+analyzeHTML+'</div>'):'');
    if(analyzeHTML)return _proxReply(q)+'<div style="margin-top:10px;border-top:1px solid var(--line-soft);padding-top:10px">'+analyzeHTML+'</div>';
    return _proxReply(q);
  }catch(e){ return _proxReply(q); }
}
function proxSend(){const i=document.getElementById('proxIn');if(!i)return;const q=i.value.trim();if(!q)return;_proxPush('u',_leD(q));_dnLogConvo('u',q);i.value='';setTimeout(function(){_proxResolveReply(q).then(function(html){_proxPush('a',html);_dnLogConvo('a',html);});},440);}/* D4/XSS: kullanıcı echo'su tam _leD escape (kısmi <-only değil) */
function proxQuick(q){const i=document.getElementById('proxIn');if(i)i.value=q;proxSend();}
function proxToAnaliz(){navGo('randevu');}
function proxAiQuery(q){const base=SAAS_CONFIG.proxAiPrompts.persona;const custom=saasResolve('customPrompt');console.log('[ProX persona]',(base+(custom?(' Ek ton: '+custom):'')).slice(0,90)+'…');return _proxReply(q);}
window.proxAiQuery=proxAiQuery;

/* =====================================================================
   ŞİFRELİ GİRİŞ KAPISI (Admin Login Gate)
   ===================================================================== */
const _ADMIN_PASS='ekspertiz2026';
function _adGateHost(){let el=document.getElementById('adGate');if(el)return el;el=document.createElement('div');el.id='adGate';el.className='adgate';
  el.innerHTML='<div class="adgate-ov" onclick="closeAdminGate()"></div><div class="adgate-card">'
   +'<button class="adgate-x" onclick="closeAdminGate()" aria-label="Kapat">✕</button>'
   +'<div class="adgate-lock"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.4"/></svg></div>'
   +'<h3>Yönetim Paneli Girişi</h3><div class="sub">Bu alan yalnızca yetkili danışmana özeldir. Devam etmek için kurumsal erişim şifrenizi girin.</div>'
   +'<div class="adgate-f"><input id="adPass" type="password" placeholder="Erişim şifresi" autocomplete="off" onkeydown="if(event.key===\'Enter\')adminLogin()"><button class="eye" type="button" onclick="_adToggleEye()" aria-label="Göster">👁</button></div>'
   +'<button class="btn btn-gold adgate-go" onclick="adminLogin()">Güvenli Giriş →</button>'
   +'<div class="adgate-err" id="adErr"></div>'
   +'<div class="adgate-foot"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z"/></svg> KVKK uyumlu · oturum şifrelenir · erişim kayıt altına alınır</div></div>';
  document.body.appendChild(el);return el;}
function openAdminGate(){const el=_adGateHost();el.classList.add('on');const i=document.getElementById('adPass');if(i){i.value='';setTimeout(()=>i.focus(),60);}const er=document.getElementById('adErr');if(er)er.textContent='';}
function closeAdminGate(){const e=document.getElementById('adGate');if(e)e.classList.remove('on');}
function _adToggleEye(){const i=document.getElementById('adPass');if(i)i.type=i.type==='password'?'text':'password';}
function adminLogin(){const i=document.getElementById('adPass'),er=document.getElementById('adErr'),g=document.getElementById('adGate');if(!i)return;
  if(i.value===_ADMIN_PASS){if(er)er.textContent='';closeAdminGate();openSaasAdmin();toast('✓ Yönetim paneline güvenli giriş yapıldı.');}
  else{if(er)er.textContent='⚠ Hatalı şifre. Erişim reddedildi.';if(g){g.classList.add('shake');setTimeout(()=>g.classList.remove('shake'),460);}if(i){i.value='';i.focus();}}}
window.openAdminGate=openAdminGate;window.closeAdminGate=closeAdminGate;window.adminLogin=adminLogin;window._adToggleEye=_adToggleEye;
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAdminGate();closeSaasAdmin();if(typeof closeSaasPortal==='function')closeSaasPortal();}});

/* =====================================================================
   YÖNETİM PANELİ (#saasTenantAdmin) — tam fonksiyonlu
   ===================================================================== */
function _saasAdminHost(){let el=document.getElementById('saasTenantAdmin');if(el)return el;el=document.createElement('div');el.id='saasTenantAdmin';el.className='sta-modal';
  el.innerHTML='<div class="sta-ov" onclick="closeSaasAdmin()"></div><div class="sta-card"><div class="sta-hd"><b>ProX SaaS · '+SAAS_CONFIG.tenantName+'</b><button onclick="openOnboarding()" title="Kurulum Sihirbazı" style="margin-left:auto;margin-right:10px;background:none;border:1px solid var(--line-soft);border-radius:8px;color:var(--gold);padding:4px 11px;cursor:pointer;font:inherit;font-size:12.5px">🚀 Sihirbaz</button><button onclick="closeSaasAdmin()">✕</button></div>'
   +'<div class="sta-tabs"><button class="act" data-t="marka" onclick="staTab(this)">Marka & Logo</button><button data-t="seo" onclick="staTab(this)">Google & SEO</button><button data-t="prox" onclick="staTab(this)">ProX AI</button><button data-t="eids" onclick="staTab(this)">EİDS Yetki</button><button data-t="hizmetalani" onclick="staTab(this)">Hizmet Alanı</button><button data-t="portfoy" onclick="staTab(this)">Portföy</button><button data-t="gorusmeler" onclick="staTab(this)">💬 Görüşmeler</button></div><div class="sta-body">'
   /* MARKA & LOGO */
   +'<div class="sta-pane" data-p="marka"><h4>Marka, Logo & Tema</h4><p class="sub">Logo/favicon yükleyin veya URL girin; altın/şampanya tema tonunu ayarlayın.</p>'
     +'<div class="logo-prev"><div class="box" id="adLogoPrev">M</div><span>Mevcut logo önizleme</span></div>'
     +'<div class="sta-f"><label>Marka Adı (logo yazısı)</label><input id="sl_brand" placeholder="Selin Meridyen"></div>'
     +'<div class="sta-row2"><div class="sta-f"><label>Logo Yükle (dosya)</label><input type="file" accept="image/*" id="sl_logo_file" onchange="saasUploadImg(this,\'logoUrl\')"></div><div class="sta-f"><label>veya Logo URL</label><input id="sl_logo_url" placeholder="https://.../logo.png"></div></div>'
     +'<div class="sta-row2"><div class="sta-f"><label>Favicon Yükle (dosya)</label><input type="file" accept="image/*" id="sl_fav_file" onchange="saasUploadImg(this,\'faviconUrl\')"></div><div class="sta-f"><label>veya Favicon URL</label><input id="sl_fav_url" placeholder="https://.../favicon.png"></div></div>'
     +'<div class="sta-row2"><div class="sta-f"><label>Altın Ton (accent)</label><input id="sl_accent" placeholder="#b4975a"></div><div class="sta-f"><label>Şampanya (soft)</label><input id="sl_soft" placeholder="#d8c39a"></div></div>'
     +'<button class="btn btn-gold sta-go" onclick="saasApplyBrand()">Uygula</button></div>'
   /* GOOGLE & SEO */
   +'<div class="sta-pane" data-p="seo" hidden><h4>Google & SEO</h4><p class="sub">Analytics, Search Console ve meta etiketleri; yenilenmeden uygulanır.</p>'
     +'<div class="sta-row2"><div class="sta-f"><label>Google Analytics (GA4)</label><input id="sg_ga" placeholder="G-XXXXXXX"></div><div class="sta-f"><label>Search Console Doğrulama</label><input id="sg_gsc" placeholder="google-site-verification=..."></div></div>'
     +'<div class="sta-f"><label>Google Maps API Key</label><input id="sg_maps" placeholder="AIza..."></div>'
     +'<div class="sta-f"><label>Meta Başlık (title)</label><input id="sm_title" placeholder="Selin Meridyen · Lüks Konut Danışmanı"></div>'
     +'<div class="sta-f"><label>Meta Açıklama</label><textarea id="sm_desc" rows="2"></textarea></div>'
     +'<div class="sta-f"><label>Meta Anahtar Kelimeler (keywords)</label><input id="sm_kw" placeholder="lüks konut, özel portföy, yalı..."></div>'
     +'<button class="btn btn-gold sta-go" onclick="saasSaveSEO()">Kaydet & Uygula</button></div>'
   /* PROX */
   +'<div class="sta-pane" data-p="prox" hidden><h4>ProX AI — Danışman Promptu</h4><p class="sub">Lüks broker personasına eklenir / düzenlenir. Conversion motoru bu tonu kullanır.</p>'
     +'<div class="sta-f"><label>Ana Persona (sistem)</label><textarea id="sp_base" rows="4" readonly></textarea></div>'
     +'<div class="sta-f"><label>Kuruma Özel Ek Ton (override)</label><textarea id="sp_custom" rows="3" placeholder="Örn: Boğaz hattı yalıları ve marka rezidanslarda uzmanız..."></textarea></div>'
     +'<div class="sta-ds"><div class="sta-ds-h">🧠 DeepSeek Yapay Zeka Anahtarı <span class="sta-opt">opsiyonel</span></div>'
       +'<p class="sub" style="margin:2px 0 8px">Kendi DeepSeek API anahtarınızı girerseniz <b>tüm yapay zeka üretimi</b> (danışman asistanı + çeviri) doğrudan <b>DeepSeek</b> ile çalışır. Boş bırakırsanız ProX sunucu yapay zekası kullanılır. <b>ProX API anahtarı</b> (EİDS/ProX sekmesi) ise emlak endeksi ve değerleme verileri içindir — ikisi ayrı çalışır.</p>'
       +'<div class="sta-row2"><div class="sta-f"><label>DeepSeek API Anahtarı (sk-...)</label><input id="dn_dskey" type="password" placeholder="sk-..." autocomplete="off"></div>'
       +'<div class="sta-f"><label>Model</label><select id="dn_dsmodel"><option value="deepseek-chat">deepseek-chat (V3)</option><option value="deepseek-reasoner">deepseek-reasoner (R1)</option></select></div></div>'
       +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><button class="btn btn-line" type="button" onclick="aiDsTest()">Bağlan & Test Et</button><span class="sub" style="margin:0">Anahtar istemcide saklanır; yayında sunucu-proxy önerilir.</span></div>'
       +'<div id="dn_dsstatus" style="margin-top:8px"></div></div>'
     +'<button class="btn btn-gold sta-go" onclick="saasSaveProxPrompt()">Kaydet</button></div>'
   /* EİDS */
   +'<div class="sta-pane" data-p="eids" hidden><h4>EİDS — Elektronik İlan Doğrulama</h4><p class="sub">Açık ilan yayınlamak için yetki belgesi gerekir; VIP (davet usulü) portföy serbesttir. Kamuya güven rozeti olarak gösterilir.</p>'
     +'<div id="ed_status" style="margin-bottom:12px"></div>'
     +'<div class="sta-f"><label>Yetki Belge No (7+ hane)</label><input id="ed_belge" placeholder="0034812"></div>'
     +'<div class="sta-row2"><button class="btn btn-gold sta-go" onclick="eidsConnect()">e-Devlet ile Bağlan & Doğrula</button><button class="btn btn-line sta-go" onclick="eidsSave()">Kaydet</button></div></div>'
   /* HİZMET ALANI (tam: il / ilçe / mahalle / kategori) */
   +'<div class="sta-pane" data-p="hizmetalani" hidden><h4>Hizmet Alanı Yönetimi</h4><p class="sub">İl · ilçe · mahalle · kategori — hizmet verdiğiniz alanları ekleyin/çıkarın (çok-illi). Çıkarılanlar site/SEO/Özel Portföy\'den kalkar.</p>'
     +'<div class="sta-f"><label>Hizmet İlleri</label><div id="saIlChips" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"></div><div class="sta-row2"><select id="saAddIl" style="padding:9px 11px;border:1px solid var(--line-soft);border-radius:9px;background:#0a0a0b;color:inherit;font:inherit"></select><button class="btn btn-line" onclick="saAddProvince()">+ İl Ekle</button></div></div>'
     +'<div class="sta-f"><label>İlçeler <span id="saCurIlLbl" class="sub"></span></label><div class="sta-row2" style="margin-bottom:6px"><button class="btn btn-line" onclick="saAllIlce(1)">Tümünü Seç</button><button class="btn btn-line" onclick="saAllIlce(0)">Tümünü Kaldır</button></div><div id="saIlceList" style="display:flex;flex-wrap:wrap;gap:7px;max-height:190px;overflow:auto"></div></div>'
     +'<div class="sta-f"><label>Mahalleler <span id="saCurIlceLbl" class="sub"></span></label><div id="saMahChips" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"></div><div class="sta-row2"><input id="saAddMah" placeholder="Mahalle adı" onkeydown="if(event.key===\'Enter\'){saAddMahalle();event.preventDefault();}"><button class="btn btn-line" onclick="saAddMahalle()">+ Ekle</button></div></div>'
     +'<div class="sta-f"><label>Kategoriler</label><div id="saKatChips" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"></div><div class="sta-row2"><input id="saAddKat" placeholder="ör. Yalı" onkeydown="if(event.key===\'Enter\'){saAddKat();event.preventDefault();}"><button class="btn btn-line" onclick="saAddKat()">+ Ekle</button></div></div>'
     +'<button class="btn btn-gold sta-go" onclick="saApply()">Kaydet & Siteye Uygula</button></div>'
   /* PORTFOY */
   +'<div class="sta-pane" data-p="portfoy" hidden><h4>Özel Portföy — ProX Gerçek Veri</h4><p class="sub">Hizmet alanınıza (il · ilçe · mahalle) göre ProX analiz (range.min) <b>gerçek başlangıç fiyatlarıyla</b> Özel Portföy (VIP) oluşturun.</p>'
     +'<div id="vipStatus" style="margin:8px 0"></div>'
     +'<div class="sta-row2"><div class="sta-f"><label>Açık İlan</label><input value="'+LISTINGS.length+' güncel ilan" readonly></div><div class="sta-f"><label>VIP Portföy</label><input value="'+VIP_PORTFOLIO.length+' yetki belgeli (adres gizli)" readonly></div></div>'
     +'<button class="btn btn-gold sta-go" onclick="rebuildVipFromProx()">⟳ ProX Gerçek Fiyatlarla Oluştur</button>'
     +'<p class="sub" style="margin-top:10px">EİDS yetkisi açık ilan yayını içindir; VIP portföy davet usulüdür (adres gizli).</p></div>'
   /* GÖRÜŞMELER & TALEPLER (tam kayıt) */
   +'<div class="sta-pane" data-p="gorusmeler" hidden><h4>Görüşmeler & Talepler</h4><p class="sub">Ziyaretçilerin ProX Asistan yazışmaları (tam döküm) ve iletişim/randevu talepleri — yetkili olarak tam takip edin. Telefon bırakanlar geri-arama olarak işaretlenir.</p>'
     +'<div style="margin-bottom:10px"><button class="btn btn-line" onclick="renderGorusmelerD()">↻ Yenile</button></div>'
     +'<div id="dnGorusmelerBody"></div></div>'
   +'</div></div>';
  document.body.appendChild(el);return el;}
function openSaasAdmin(){const el=_saasAdminHost();el.classList.add('on');
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.value=v||'';};
  set('sl_brand',saasResolve('brandName'));set('sl_accent',saasResolve('accent'));set('sl_soft',saasResolve('accentSoft'));
  set('sg_ga',saasResolve('googleAnalytics'));set('sg_gsc',saasResolve('googleSiteVerification'));set('sg_maps',saasResolve('googleMapsKey'));
  set('sm_title',saasResolve('metaTitle'));set('sm_desc',saasResolve('metaDescription'));set('sm_kw',saasResolve('metaKeywords'));
  set('sp_base',SAAS_CONFIG.proxAiPrompts.persona);set('sp_custom',SAAS_CONFIG.tenantSettings.customPrompt);
  set('dn_dskey',_dsKey());set('dn_dsmodel',_dsModel());try{aiDsStatus();}catch(e){}
  set('ed_belge',eidsFirma().eids.belgeNo);try{eidsRenderAdmin();}catch(e){}
  try{renderSA();renderVipStatus();renderGorusmelerD();}catch(e){}
  try{staGate();}catch(e){}
  _refreshLogoPrev();
}
function closeSaasAdmin(){const e=document.getElementById('saasTenantAdmin');if(e)e.classList.remove('on');}
/* ===== PAKET / ÖZELLİK KİLİDİ (admin sekmeleri) — upsell'li ===== */
var STA_TAB_FEAT={seo:'canUseAnalytics',prox:'canUseMarketingContent',portfoy:'canUseAdvancedProX'};
var STA_FEAT_LABEL={canUseAnalytics:'Google & SEO / Analitik',canUseMarketingContent:'ProX AI İçerik',canUseAdvancedProX:'Gerçek ProX Özel Portföy'};
var PKG_ORDER_D=['BASIC','PRO','BUSINESS','ENTERPRISE'];
var PKG_KAPSAM_D={BASIC:'Piyasa analizi · Lead CRM · SVG',PRO:'+ Analitik · SEO & pazarlama içeriği',BUSINESS:'+ Gelişmiş ProX · Blog · Premium tema',ENTERPRISE:'+ Tam white-label'};
function featHasD(f){return typeof window.hasFeature==='function'?window.hasFeature(f):true;}
function featMinPkgD(f){var P=window.EMLAK_PACKAGES||{};for(var i=0;i<PKG_ORDER_D.length;i++){if((P[PKG_ORDER_D[i]]||[]).indexOf(f)>=0)return PKG_ORDER_D[i];}return 'ENTERPRISE';}
function staTabGated(t){var f=STA_TAB_FEAT[t];return !!(f&&!featHasD(f));}
function staGate(m){try{(m||document).querySelectorAll('.sta-tabs button').forEach(function(b){var t=b.dataset.t,old=b.querySelector('.tlock');if(old)old.remove();b.style.removeProperty('opacity');if(staTabGated(t)){b.style.opacity='.55';var s=document.createElement('span');s.className='tlock';s.textContent=' 🔒';b.appendChild(s);}});}catch(e){}}
function staUpsell(t){var f=STA_TAB_FEAT[t];if(!f)return;var need=featMinPkgD(f),cur=(window.EMLAK_TENANT&&window.EMLAK_TENANT.packageCode)||'—',label=STA_FEAT_LABEL[f]||f;
  var id='dnUpsell',mm=document.getElementById(id);
  if(!mm){mm=document.createElement('div');mm.id=id;mm.style.cssText='position:fixed;inset:0;z-index:100000;display:none;align-items:center;justify-content:center;padding:20px';mm.addEventListener('click',function(ev){if(ev.target.id===id)mm.style.display='none';});document.body.appendChild(mm);}
  mm.innerHTML='<div style="position:absolute;inset:0;background:rgba(0,0,0,.75)" onclick="document.getElementById(\''+id+'\').style.display=\'none\'"></div><div style="position:relative;max-width:460px;background:var(--ink,#0b0b0c);border:1px solid var(--line-soft);border-radius:14px;padding:26px;text-align:center"><div style="font-size:32px">🔒</div><h3 style="font-family:var(--serif);color:var(--gold);margin:6px 0">'+_leD(label)+' · '+_leD(need)+' paketi</h3><div class="sub">Mevcut paket: <b>'+_leD(cur)+'</b>. Bu özellik <b>'+_leD(need)+'</b> ve üzeri paketlerde açıktır.</div><div style="text-align:left;background:#0a0a0b;border:1px solid var(--line-soft);border-radius:10px;padding:12px;margin:14px 0;font-size:13px;color:var(--muted)"><b style="color:var(--gold)">'+_leD(need)+' kapsamı:</b><br>'+_leD(PKG_KAPSAM_D[need]||'')+'</div><button class="btn btn-gold" style="width:100%" onclick="document.getElementById(\''+id+'\').style.display=\'none\';if(typeof toast===\'function\')toast(\''+_leD(need)+' paketi yükseltme talebiniz iletildi.\')">'+_leD(need)+' Paketine Yükselt</button></div>';
  mm.style.display='flex';}
window.staGate=staGate;window.staUpsell=staUpsell;window.staTabGated=staTabGated;
function staTab(b){var t=b.dataset.t;if(staTabGated(t)){staUpsell(t);return;}const m=b.closest('.sta-modal');m.querySelectorAll('.sta-tabs button').forEach(x=>x.classList.toggle('act',x===b));m.querySelectorAll('.sta-pane').forEach(p=>p.hidden=(p.dataset.p!==t));}
function _v(id){const e=document.getElementById(id);return e?e.value.trim():'';}
function _refreshLogoPrev(){const box=document.getElementById('adLogoPrev');if(!box)return;const logo=saasResolve('logoUrl');if(logo)box.innerHTML='<img src="'+logo+'" alt="logo">';else box.textContent=(saasResolve('brandName')||'M').trim().charAt(0);}
function saasUploadImg(input,key){const f=input.files&&input.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{SAAS_CONFIG.tenantSettings[key]=e.target.result;applySaaSSettings();_refreshLogoPrev();toast((key==='logoUrl'?'Logo':'Favicon')+' yüklendi & uygulandı.');};r.readAsDataURL(f);}
function saasApplyBrand(){const t=SAAS_CONFIG.tenantSettings;const br=_v('sl_brand'),lu=_v('sl_logo_url'),fu=_v('sl_fav_url'),ac=_v('sl_accent'),sf=_v('sl_soft');
  if(br)t.brandName=br;if(lu)t.logoUrl=lu;if(fu)t.faviconUrl=fu;if(ac)t.accent=ac;if(sf)t.accentSoft=sf;
  initSaaSTheme();applySaaSSettings();_refreshLogoPrev();toast('Marka, logo & tema uygulandı.');}
function saasSaveSEO(){const t=SAAS_CONFIG.tenantSettings;t.googleAnalytics=_v('sg_ga');t.googleSiteVerification=_v('sg_gsc');t.googleMapsKey=_v('sg_maps');t.metaTitle=_v('sm_title')||t.metaTitle;t.metaDescription=_v('sm_desc');t.metaKeywords=_v('sm_kw');applySaaSSettings();toast('Google & SEO ayarları uygulandı.');}
function saasSaveProxPrompt(){SAAS_CONFIG.tenantSettings.customPrompt=_v('sp_custom');
  var dk=document.getElementById('dn_dskey'),dm=document.getElementById('dn_dsmodel');
  if(dk)SAAS_CONFIG.tenantSettings.dsKey=dk.value.trim();
  if(dm&&dm.value)SAAS_CONFIG.tenantSettings.dsModel=dm.value.trim();
  _dsSave();try{aiDsStatus();}catch(e){}
  toast('✓ ProX danışman tonu kaydedildi.'+(_dsKey()?' · DeepSeek anahtarı aktif (YZ artık DeepSeek ile).':' · YZ ProX sunucu AI\'si ile çalışır.'));}
window.openSaasAdmin=openSaasAdmin;window.closeSaasAdmin=closeSaasAdmin;window.staTab=staTab;window.saasUploadImg=saasUploadImg;window.saasApplyBrand=saasApplyBrand;window.saasSaveSEO=saasSaveSEO;window.saasSaveProxPrompt=saasSaveProxPrompt;
window.toggleNav=toggleNav;window.closeNav=closeNav;window.goHome=goHome;window.navGo=navGo;window.openPage=openPage;window.closePage=closePage;window.leadFor=leadFor;window.contactLead=contactLead;
window.pickDay=pickDay;window.pickSlot=pickSlot;window.apptSubmit=apptSubmit;window.proxSend=proxSend;window.proxQuick=proxQuick;window.proxToAnaliz=proxToAnaliz;

/* ===== B2B Müşteri Portalı (Faz 20) ===== */
window.SAAS_USER = { isLoggedIn:false, portalToken:null, clientProfile:{ companyName:'', role:'', regionAuth:[] } };
async function saasPortalConnect(clientKey, securePass){
  if(!clientKey || !securePass) return { ok:false, error:"Kurumsal anahtar ve şifre gereklidir." };
  try{
    var r = await Promise.race([ proxApi("/api/v1/tenant/portal/login", { method:"POST", body:{ client_key: clientKey, secure:true } }), new Promise(function(res){ setTimeout(function(){ res({fallback:true}); }, 8000); }) ]);
    var online = !!(r && !r.fallback && r.success);
    var profile = (online && r.profile) ? r.profile : _saasPortalSimProfile(clientKey);
    window.SAAS_USER.isLoggedIn = true;
    window.SAAS_USER.portalToken = (online && r.portal_token) ? r.portal_token : ("portal_"+Math.random().toString(36).slice(2,10));
    window.SAAS_USER.clientProfile = profile;
    saasPortalRenderNav();
    return { ok:true, online:online, profile:profile };
  }catch(e){ return { ok:false, error:"Bağlantı kurulamadı, lütfen tekrar deneyin." }; }
}
function _saasPortalSimProfile(k){ var n=(k||"").trim(); return { companyName: n?(n.length<=4?n.toUpperCase():n.charAt(0).toUpperCase()+n.slice(1)):"Kurumsal Üye", role:"Kurumsal Yönetici", regionAuth:["İstanbul","İzmir","Ankara"] }; }
function saasPortalDisconnect(){ window.SAAS_USER={ isLoggedIn:false, portalToken:null, clientProfile:{ companyName:'', role:'', regionAuth:[] } }; saasPortalRenderNav(); openSaasPortal(); }
function saasPortalRenderNav(){ var ids=['saasPortalTrigger','saasPortalTriggerM']; ids.forEach(function(id){ var el=document.getElementById(id); if(!el) return; if(window.SAAS_USER.isLoggedIn){ el.classList.add('portal-on'); el.innerHTML='<span class="pdot"></span> Müşteri Portalı · '+(window.SAAS_USER.clientProfile.companyName||'Üye'); } else { el.classList.remove('portal-on'); el.innerHTML='Müşteri Portalı'; } }); }
function openSaasPortal(){ var m=_saasPortalHost(); document.getElementById('saasPortalBody').innerHTML = window.SAAS_USER.isLoggedIn?_saasPortalPanelHTML():_saasPortalLoginHTML(); m.classList.add('on'); var i=document.getElementById('spClientKey'); if(i) setTimeout(function(){i.focus();},60); }
function closeSaasPortal(){ var m=document.getElementById('saasPortalModal'); if(m) m.classList.remove('on'); }
async function saasPortalSubmit(){ var k=((document.getElementById('spClientKey')||{}).value||'').trim(); var p=(document.getElementById('spPass')||{}).value||''; var err=document.getElementById('spErr'); if(err)err.textContent=''; var btn=document.getElementById('spGo'); if(btn){btn.disabled=true;btn.textContent='Bağlanıyor…';} var r=await saasPortalConnect(k,p); if(btn){btn.disabled=false;btn.textContent='Güvenli Giriş →';} if(r.ok){ if(typeof toast==='function')toast('✓ Müşteri portalına bağlanıldı · '+r.profile.companyName); document.getElementById('saasPortalBody').innerHTML=_saasPortalPanelHTML(); } else { if(err)err.textContent='⚠ '+(r.error||'Giriş başarısız.'); var c=document.querySelector('#saasPortalModal .sp-card'); if(c){c.classList.add('sp-shake');setTimeout(function(){c.classList.remove('sp-shake');},450);} } }
/* Modal kabuğu — sayfa yenilenmez, JS ile eklenir (.adgate stiline benzer siyah/altın) */
function _saasPortalHost(){ var el=document.getElementById('saasPortalModal'); if(el) return el; el=document.createElement('div'); el.id='saasPortalModal'; el.className='sp-modal';
  el.innerHTML='<div class="sp-ov" onclick="closeSaasPortal()"></div><div class="sp-card"><button class="sp-x" onclick="closeSaasPortal()" aria-label="Kapat">✕</button><div id="saasPortalBody"></div></div>';
  document.body.appendChild(el); return el; }
function _saasPortalLoginHTML(){ return ''
  +'<div class="sp-lock"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.4"/></svg></div>'
  +'<h3>Gayrimenkul Sahibi &amp; Yatırımcı Portföy Takip Girişi</h3>'
  +'<div class="sp-sub">Kurumsal Gayrimenkul Yönetim Paneli: Sözleşmeli gayrimenkullerinizin ProX AI pazar analizlerine ve performans grafiklerine erişim sağlayın.</div>'
  +'<div class="sp-f"><input id="spClientKey" placeholder="Kurumsal Anahtar (Client Key)" autocomplete="off"></div>'
  +'<div class="sp-f"><input id="spPass" type="password" placeholder="Güvenli Şifre" autocomplete="off" onkeydown="if(event.key===\'Enter\')saasPortalSubmit()"></div>'
  +'<button id="spGo" class="btn btn-gold sp-go" onclick="saasPortalSubmit()">Güvenli Giriş →</button>'
  +'<div class="sp-err" id="spErr"></div>'
  +'<div class="sp-badges"><span>ProX</span><span>Yetki Belgeli</span><span>256-bit Şifreli</span></div>'
  +'<div class="sp-foot"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z"/></svg> KVKK uyumlu · oturum şifrelenir · erişim kayıt altına alınır</div>'; }
function _saasPortalPanelHTML(){ var u=window.SAAS_USER.clientProfile||{}; var regions=Array.isArray(u.regionAuth)?u.regionAuth:[];
  return ''
  +'<div class="sp-lock"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18"/><path d="M5 21V8l7-5 7 5v13"/><path d="M9 21v-6h6v6"/></svg></div>'
  +'<h3>Kurumsal Gayrimenkul Yönetim Paneli</h3>'
  +'<div class="sp-sub">Sözleşmeli portföyünüze ProX AI pazar analizleri ve performans grafikleriyle erişin.</div>'
  +'<div class="sp-profile"><b>'+((u.companyName||'Kurumsal Üye')+'')+'</b><div class="role">'+((u.role||'Kurumsal Yönetici')+'')+'</div>'
    +'<div class="sp-chips">'+(regions.length?regions.map(function(r){return '<span>'+r+'</span>';}).join(''):'<span>Yetki bölgesi tanımlı değil</span>')+'</div></div>'
  +'<div class="sp-actions">'
    +'<div class="sp-act" onclick="closeSaasPortal();navGo(\'surec\')"><b>ProX AI Pazar Analizi</b><span>Sözleşmeli gayrimenkul değer & prim analizi</span></div>'
    +'<div class="sp-act" onclick="closeSaasPortal();navGo(\'iletisim\')"><b>Performans Grafikleri</b><span>Portföy değer seyri & likidite</span></div>'
    +'<div class="sp-act" onclick="closeSaasPortal();navGo(\'vip\')"><b>Sözleşmeli Gayrimenkuller</b><span>Yetki belgeli portföy kayıtları</span></div>'
    +'<div class="sp-act" onclick="closeSaasPortal();navGo(\'randevu\')"><b>Ücretsiz Analiz</b><span>Danışman görüşmesi planlayın</span></div>'
  +'</div>'
  +'<button class="btn btn-line sp-go" onclick="saasPortalDisconnect()">Oturumu Kapat</button>'; }
window.openSaasPortal=openSaasPortal;window.closeSaasPortal=closeSaasPortal;window.saasPortalSubmit=saasPortalSubmit;window.saasPortalConnect=saasPortalConnect;window.saasPortalDisconnect=saasPortalDisconnect;

/* ---------- INIT ---------- */
window.addEventListener('load',function(){try{
  _dsLoad();/* kalıcı DeepSeek anahtarını yükle (localStorage dn_dskey) */
  initSaaSTheme();applySaaSSettings();
  try{eidsRenderPublic();applySchema();applyProxyMode();abApply();}catch(e){}
  document.getElementById('homeListings').innerHTML=listingCardsHTML();
  document.getElementById('vaultGrid').innerHTML=vipCardsHTML();
  document.getElementById('homeContact').innerHTML=contactHTML();
  document.getElementById('siteFooter').innerHTML=footerHTML();
  _proxPush('a','Hoş geldiniz. Bir bölge ya da gayrimenkul tipi söyleyin — portföyümü tarayıp size en uygun seçenekleri ve prim potansiyelini paylaşayım.');
  if(typeof saasPortalRenderNav==='function')saasPortalRenderNav();
  /* Canlı paket/özellik senkronu — yalnızca paket & özellik listesi; CSS rengi (siyah/altın) REPAINT EDILMEZ. */
  if(typeof proxBootstrap==='function')proxBootstrap();
  /* Ön yüzde harici yönetim butonu YOK — giriş yalnızca Footer › Yönetim Paneli › şifreli kapı (ekspertiz2026) ile. */
}catch(e){console.warn('init',e);}});

/* ===================== 2026 ANİMASYONLARI: scroll-reveal + özel imleç ===================== */
(function(){
  var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function initReveal(){
    if(RM)return;
    var sel='.sec-h,.vcard,.proc,.appt-card,.analiz-band,.contact .row,.contact-cta,.prox-card,.about-grid>*,.trust-in>*,.bz-wrap';
    var els=[].slice.call(document.querySelectorAll(sel)).filter(function(e){return !e.closest('.hero');});
    els.forEach(function(e,i){e.classList.add('reveal');var d=(i%4);if(d)e.classList.add('d'+d);});
    if(!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}
    var io=new IntersectionObserver(function(ents){ents.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12,rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(e){io.observe(e);});
    setTimeout(function(){els.forEach(function(e){e.classList.add('in');});},1900); /* güvenlik: her koşulda görünür kıl */
  }
  function initCursor(){
    if(RM||!(window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches))return;
    if(document.querySelector('.cursor-ring'))return;
    var dot=document.createElement('div'),ring=document.createElement('div');
    dot.className='cursor-dot';ring.className='cursor-ring';document.body.appendChild(dot);document.body.appendChild(ring);
    var rx=0,ry=0,x=-50,y=-50;
    document.addEventListener('mousemove',function(e){x=e.clientX;y=e.clientY;dot.style.transform='translate('+x+'px,'+y+'px)';},{passive:true});
    (function loop(){rx+=(x-rx)*.18;ry+=(y-ry)*.18;ring.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop);})();
    var HOT='a,button,.vcard,.lnk,.day,.slot,.prox-chips button,.sta-tabs button,.portal-trigger,input,select,textarea';
    document.addEventListener('mouseover',function(e){if(e.target.closest&&e.target.closest(HOT))ring.classList.add('hot');},{passive:true});
    document.addEventListener('mouseout',function(e){if(e.target.closest&&e.target.closest(HOT))ring.classList.remove('hot');},{passive:true});
  }
  function boot(){try{initCursor();}catch(e){}setTimeout(function(){try{initReveal();}catch(e){}},160);}
  if(document.readyState==='complete')boot();else window.addEventListener('load',function(){setTimeout(boot,140);});
})();

/* ===================== İLERİ SEVİYE HERO — kart reveal + sayaç + manyetik + parallax ===================== */
(function(){
  var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  function fmtCount(el){var end=+el.getAttribute('data-count')||0,suf=el.getAttribute('data-suffix')||'';
    if(RM){el.textContent=end.toLocaleString('tr-TR')+suf;return;}
    var t0=null,dur=1500,done=false;function fin(){if(done)return;done=true;el.textContent=end.toLocaleString('tr-TR')+suf;}
    requestAnimationFrame(function s(ts){if(done)return;if(!t0)t0=ts;var p=Math.min(1,(ts-t0)/dur),e=1-Math.pow(1-p,3);el.textContent=Math.round(end*e).toLocaleString('tr-TR')+suf;if(p<1)requestAnimationFrame(s);else fin();});
    setTimeout(fin,dur+250);/* RAF duraklarsa (arka plan sekme) son değeri garanti et */}
  function heroBoot(){
    var cards=[].slice.call(document.querySelectorAll('.hero-viz .hcard'));
    cards.forEach(function(c,i){setTimeout(function(){c.classList.add('show');},RM?0:(700+i*180));});
    setTimeout(function(){[].forEach.call(document.querySelectorAll('.hero [data-count]'),fmtCount);},RM?0:1100);
    if(RM)return;
    /* manyetik butonlar */
    [].forEach.call(document.querySelectorAll('.hero .magnetic'),function(btn){
      btn.addEventListener('mousemove',function(e){var r=btn.getBoundingClientRect(),mx=e.clientX-r.left-r.width/2,my=e.clientY-r.top-r.height/2;btn.style.transform='translate('+(mx*.16)+'px,'+(my*.3)+'px)';var s=btn.querySelector('span');if(s)s.style.transform='translate('+(mx*.1)+'px,'+(my*.2)+'px)';});
      btn.addEventListener('mouseleave',function(){btn.style.transform='';var s=btn.querySelector('span');if(s)s.style.transform='';});
    });
    /* hero parallax (margin ile — floaty translate'i bozmadan) */
    var hero=document.querySelector('.hero'),viz=document.querySelector('.hero-viz');
    if(hero&&viz){var draw=viz.querySelector('.hero-draw');
      hero.addEventListener('mousemove',function(e){var r=hero.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
        cards.forEach(function(c,i){var f=(i+1)*7;c.style.marginLeft=(px*f)+'px';c.style.marginTop=(py*f)+'px';});
        if(draw)draw.style.transform='translate('+(px*-16)+'px,'+(py*-16)+'px)';},{passive:true});
      hero.addEventListener('mouseleave',function(){cards.forEach(function(c){c.style.marginLeft='';c.style.marginTop='';});if(draw)draw.style.transform='';});
    }
  }
  if(document.readyState!=='loading')setTimeout(heroBoot,60);else window.addEventListener('DOMContentLoaded',function(){setTimeout(heroBoot,60);});
})();

/* ===================== Kart 3B-tilt (ileri hover mikro-etkileşim) ===================== */
(function(){
  var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(RM||!(window.matchMedia&&window.matchMedia('(hover:hover) and (pointer:fine)').matches))return;
  function bind(card){if(card._tilt)return;card._tilt=1;
    card.addEventListener('mousemove',function(e){var r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
      card.style.transform='perspective(1000px) rotateY('+(px*6.5).toFixed(2)+'deg) rotateX('+(-py*7.5).toFixed(2)+'deg) translateY(-8px)';},{passive:true});
    card.addEventListener('mouseleave',function(){card.style.transform='';});
  }
  function scan(){[].forEach.call(document.querySelectorAll('.vcard'),bind);}
  if(document.readyState!=='loading')setTimeout(scan,220);else window.addEventListener('load',function(){setTimeout(scan,220);});
  if('MutationObserver' in window){var t;new MutationObserver(function(){clearTimeout(t);t=setTimeout(scan,180);}).observe(document.body,{childList:true,subtree:true});}
})();

/* ===================== BÖLGE ANALİZİ · canlı ProX veri paneli (interaktif) ===================== */
(function bolgeAnalizBoot(){
  var host=document.getElementById('bolgeAnaliz'); if(!host) return;
  var tabsEl=document.getElementById('bzTabs'),mainEl=document.getElementById('bzMain'),sideEl=document.getElementById('bzSide'),cmpEl=document.getElementById('bzCmp');
  if(!tabsEl||!mainEl||!sideEl||!cmpEl) return;
  var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var TL=function(n){return Math.round(n||0).toLocaleString('tr-TR');};
  /* Temsili ProX endeks göstergeleri (₺/m²; trend serisi bin-₺). Sunucu ucu bağlanınca bu dizi ProX'tan doldurulur. */
  var D=[
    {n:'Bebek',       avg:182000, yoy:14.2, skor:92, likT:'Yüksek', lik:82, tr:[151,153,156,159,163,166,169,172,175,178,180,182]},
    {n:'Etiler',      avg:154000, yoy:11.8, skor:88, likT:'Yüksek', lik:76, tr:[131,133,135,138,141,144,146,148,150,151,153,154]},
    {n:'Zekeriyaköy', avg:96000,  yoy:16.5, skor:90, likT:'Orta',   lik:64, tr:[78,80,82,84,86,88,90,91,92,94,95,96]},
    {n:'Kandilli',    avg:128000, yoy:12.1, skor:85, likT:'Orta',   lik:61, tr:[110,112,114,116,118,120,122,123,125,126,127,128]},
    {n:'Levent',      avg:141000, yoy:9.8,  skor:87, likT:'Yüksek', lik:84, tr:[124,126,127,129,131,133,135,136,138,139,140,141]}
  ];
  var maxAvg=Math.max.apply(null,D.map(function(d){return d.avg;}));
  var cur=0, fired=false;

  function fmt(v,dec){ if(dec) return (Math.round(v*10)/10).toLocaleString('tr-TR',{minimumFractionDigits:1,maximumFractionDigits:1}); return Math.round(v).toLocaleString('tr-TR'); }
  function animNum(el){ var to=parseFloat(el.getAttribute('data-c'))||0, dec=parseInt(el.getAttribute('data-dec')||'0',10);
    if(RM){el.textContent=fmt(to,dec);return;} var t0=null, done=false;
    function fin(){ if(done)return; done=true; el.textContent=fmt(to,dec); }
    function step(ts){ if(done)return; if(t0==null)t0=ts; var k=Math.min(1,(ts-t0)/1100); el.textContent=fmt(to*(1-Math.pow(1-k,3)),dec); if(k<1)requestAnimationFrame(step); else fin(); }
    requestAnimationFrame(step);
    setTimeout(fin,1350); /* RAF duraklarsa (arka plan sekme) son değeri garanti et */
  }
  function buildPath(vals,W,H,P){
    var mn=Math.min.apply(null,vals), mx=Math.max.apply(null,vals), sp=(mx-mn)||1; mn-=sp*.16; mx+=sp*.10; var rng=(mx-mn)||1, n=vals.length;
    var X=function(i){return P+i*(W-P*2)/(n-1);}, Y=function(v){return H-P-(v-mn)/rng*(H-P*2);};
    var ln='', pts=[]; vals.forEach(function(v,i){var x=X(i),y=Y(v); pts.push([x,y]); ln+=(i?'L':'M')+x.toFixed(1)+' '+y.toFixed(1)+' ';});
    var ar='M'+X(0).toFixed(1)+' '+(H-P)+' '+pts.map(function(p){return 'L'+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ')+' L'+X(n-1).toFixed(1)+' '+(H-P)+' Z';
    return {ln:ln.trim(), ar:ar, ex:X(n-1), ey:Y(vals[n-1])};
  }
  function renderMain(d){
    var W=480,H=200,P=16, p=buildPath(d.tr,W,H,P);
    var ticks=[[0,'12 ay önce'],[5,'6 ay'],[11,'Bugün']];
    mainEl.innerHTML=''
     +'<div class="bz-mhead"><div><div class="lbl">'+d.n+' · ortalama m²</div>'
       +'<div class="bz-big"><span data-c="'+d.avg+'">0</span> <small>₺/m²</small></div></div>'
       +'<div class="bz-delta'+(d.yoy<0?' dn':'')+'">'+(d.yoy>=0?'▲ +':'▼ ')+d.yoy+'% <span style="color:var(--muted);font-weight:500">· 12 ay</span></div></div>'
     +'<div class="bz-chart"><svg viewBox="0 0 '+W+' '+(H+18)+'" role="img" aria-label="'+d.n+' 12 aylık m² fiyat seyri">'
       +'<defs><linearGradient id="bzGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--gold)" stop-opacity=".30"/><stop offset="1" stop-color="var(--gold)" stop-opacity="0"/></linearGradient></defs>'
       +'<path class="bz-areaP" d="'+p.ar+'" fill="url(#bzGrad)" opacity="0"/>'
       +'<path class="bz-line" d="'+p.ln+'"/>'
       +'<circle class="bz-end" cx="'+p.ex.toFixed(1)+'" cy="'+p.ey.toFixed(1)+'" r="4.6" opacity="0"/>'
       +'<g class="bz-xax">'+ticks.map(function(t){var x=P+t[0]*(W-P*2)/11, a=t[0]===0?'start':t[0]===11?'end':'middle'; return '<text x="'+x.toFixed(0)+'" y="'+(H+14)+'" text-anchor="'+a+'">'+t[1]+'</text>';}).join('')+'</g>'
     +'</svg></div>';
  }
  function renderSide(d){
    sideEl.innerHTML=''
     +'<div class="bz-kpi"><div class="k">Ortalama m²</div><div class="v"><span data-c="'+d.avg+'">0</span> <small>₺</small></div></div>'
     +'<div class="bz-kpi"><div class="k">Yıllık Değişim</div><div class="v"><span class="pos">+<span data-c="'+d.yoy+'" data-dec="1">0</span></span><small>%</small></div></div>'
     +'<div class="bz-kpi"><div class="k">Yatırım Skoru</div><div class="bz-ringwrap"><div class="bz-ring" style="--p:0"><span class="rn" data-c="'+d.skor+'">0</span></div><div style="font-size:11.5px;color:var(--muted);line-height:1.45">100 üzerinden<br><b style="color:var(--em)">'+(d.skor>=90?'Çok Güçlü':d.skor>=85?'Güçlü':'İyi')+'</b></div></div></div>'
     +'<div class="bz-kpi"><div class="k">Likidite</div><div class="v" style="font-size:20px">'+d.likT+'</div><div class="bz-lik"><i data-w="'+d.lik+'"></i></div></div>';
  }
  function renderCmp(){
    cmpEl.innerHTML=D.map(function(d,i){
      return '<div class="bz-bar'+(i===cur?' on':'')+'" data-i="'+i+'" role="button" tabindex="0"><span class="nm">'+d.n+'</span><div class="bz-track"><i class="bz-fill" data-w="'+(d.avg/maxAvg*100).toFixed(1)+'"></i></div><span class="vv">'+TL(d.avg)+' ₺</span></div>';
    }).join('');
    [].forEach.call(cmpEl.querySelectorAll('.bz-bar'),function(b){
      b.addEventListener('click',function(){select(+b.getAttribute('data-i'));});
      b.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();select(+b.getAttribute('data-i'));}});
    });
  }
  function drawLine(){
    var ln=mainEl.querySelector('.bz-line'); if(ln){ try{ var L=ln.getTotalLength(); ln.style.strokeDasharray=L; ln.style.strokeDashoffset=RM?0:L;
      if(!RM){ void ln.getBoundingClientRect(); ln.style.transition='stroke-dashoffset 1.55s cubic-bezier(.3,.8,.3,1)'; ln.style.strokeDashoffset='0'; } }catch(e){} }
    var ar=mainEl.querySelector('.bz-areaP'); if(ar){ if(!RM)ar.style.transition='opacity 1.1s ease .45s'; void ar.getBoundingClientRect(); ar.style.opacity='1'; }
    var end=mainEl.querySelector('.bz-end'); if(end){ if(!RM)end.style.transition='opacity .5s ease 1.3s'; void end.getBoundingClientRect(); end.style.opacity='1'; }
  }
  function animMain(){ [].forEach.call(mainEl.querySelectorAll('[data-c]'),animNum); }
  function animSide(){
    [].forEach.call(sideEl.querySelectorAll('[data-c]'),animNum);
    var ring=sideEl.querySelector('.bz-ring'), rn=sideEl.querySelector('.bz-ring .rn');
    if(ring&&rn){ var to=parseFloat(rn.getAttribute('data-c'))||0; void ring.offsetWidth; ring.style.setProperty('--p',to); }
    var lik=sideEl.querySelector('.bz-lik i'); if(lik){ void lik.offsetWidth; lik.style.width=lik.getAttribute('data-w')+'%'; }
  }
  function animCmp(){ [].forEach.call(cmpEl.querySelectorAll('.bz-fill'),function(f){ void f.offsetWidth; f.style.width=f.getAttribute('data-w')+'%'; }); }
  function select(i){
    if(i===cur && fired) return; cur=i; var d=D[i];
    [].forEach.call(tabsEl.querySelectorAll('.bz-tab'),function(t,ti){t.classList.toggle('on',ti===i);});
    [].forEach.call(cmpEl.querySelectorAll('.bz-bar'),function(b,bi){b.classList.toggle('on',bi===i);});
    renderMain(d); renderSide(d); drawLine(); animMain(); animSide();
  }
  /* sekmeler */
  tabsEl.innerHTML=D.map(function(d,i){return '<button class="bz-tab'+(i===0?' on':'')+'" data-i="'+i+'">'+d.n+'</button>';}).join('');
  [].forEach.call(tabsEl.querySelectorAll('.bz-tab'),function(t){t.addEventListener('click',function(){select(+t.getAttribute('data-i'));});});
  /* ilk statik kurulum (animasyon giriş gözlemcisinde) */
  renderMain(D[0]); renderSide(D[0]); renderCmp();
  function fire(){ if(fired)return; fired=true; drawLine(); animMain(); animSide(); animCmp(); }
  function boot(){
    var panel=host.querySelector('.bz-panel');
    if(RM||!('IntersectionObserver' in window)||!panel){ fire(); return; }
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){fire();io.disconnect();}});},{threshold:.18});
    io.observe(panel);
    setTimeout(fire,2400); /* güvenlik: her koşulda görünür/animasyonlu */
  }
  if(document.readyState!=='loading')setTimeout(boot,140);else window.addEventListener('DOMContentLoaded',function(){setTimeout(boot,140);});
})();

/* ===================== İLERİ SEVİYE HERO PANELİ — otomatik dönen canlı mahalle zekâsı ===================== */
(function heroPanelCycle(){
  var panel=document.querySelector('.hero-panel'); if(!panel) return;
  var elTag=panel.querySelector('.hp-tag'),
      elVal=panel.querySelector('.hp-v b'),
      elDelta=panel.querySelector('.hp-d'),
      elLine=panel.querySelector('.hp-line'),
      elArea=panel.querySelector('.hp-area'),
      elRingFg=panel.querySelector('.hp-ring .rfg'),
      elRingNum=panel.querySelector('.hp-ring i'),
      elScoreSub=panel.querySelector('.hp-rows .hp-row:last-child .hp-tx span'),
      elScoreChip=panel.querySelector('.hp-rows .hp-row:last-child .hp-chip'),
      elStat=panel.querySelector('.hp-stat');
  if(!elTag||!elVal||!elLine||!elArea||!elRingFg) return;
  var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  /* Bölge Analizi paneliyle tutarlı temsili ProX göstergeleri */
  var D=[
    {n:'Bebek',       avg:182000, d:14.2, skor:92, zone:'Boğaz hattı · güçlü potansiyel',   sp:[166,169,172,175,178,180,182]},
    {n:'Etiler',      avg:154000, d:11.8, skor:88, zone:'Prestij bölgesi · yüksek talep',   sp:[146,148,150,151,152,153,154]},
    {n:'Zekeriyaköy', avg:96000,  d:16.5, skor:90, zone:'Villa koridoru · hızlı yükseliş',  sp:[90,91,92,93,94,95,96]},
    {n:'Kandilli',    avg:128000, d:12.1, skor:85, zone:'Boğaz sırtı · sınırlı arz',        sp:[122,123,125,126,127,127,128]},
    {n:'Levent',      avg:141000, d:9.8,  skor:87, zone:'İş merkezi · yüksek likidite',     sp:[135,136,138,139,140,140,141]}
  ];
  var RING=119; /* r=19 çevre */
  function sparkPts(v){ var mn=Math.min.apply(null,v),mx=Math.max.apply(null,v),s=(mx-mn)||1; mn-=s*.30; mx+=s*.18; var r=mx-mn;
    return v.map(function(val,i){ return (i*264/(v.length-1)).toFixed(1)+','+(52-(val-mn)/r*44).toFixed(1); }).join(' '); }
  function areaFrom(pts){ return 'M0,60 L'+pts.split(' ').join(' L')+' L264,60 Z'; }
  function apply(i){
    var d=D[i], pts=sparkPts(d.sp);
    /* değerler SENKRON ayarlanır — RAF/timer'a bağlı değil, her koşulda doğru gösterir */
    elTag.textContent=d.n;
    elVal.textContent=d.avg.toLocaleString('tr-TR')+' ₺';
    elDelta.textContent='▲ %'+(''+d.d).replace('.',',');
    elLine.setAttribute('points',pts);
    elArea.setAttribute('d',areaFrom(pts));
    /* çizgi: görünür sekmede yumuşak yeniden çizim; son durum (offset 0) her hâlükârda uygulanır */
    if(!RM){ var L; try{L=elLine.getTotalLength();}catch(e){L=320;} elLine.style.transition='none'; elLine.style.strokeDasharray=L; elLine.style.strokeDashoffset=L; void elLine.getBoundingClientRect(); elLine.style.transition='stroke-dashoffset 1.15s ease'; }
    elLine.style.strokeDashoffset='0';
    var off=RING*(1-d.skor/100);
    if(!RM)elRingFg.style.transition='stroke-dashoffset .9s cubic-bezier(.3,.8,.3,1)';
    elRingFg.style.strokeDashoffset=off;
    if(elRingNum)elRingNum.textContent=d.skor;
    if(elScoreSub)elScoreSub.textContent=d.zone;
    if(elScoreChip)elScoreChip.textContent=d.skor+'/100';
    /* geçiş hissi: CSS animasyon yeniden başlat (timer YOK) */
    if(elStat&&!RM){ elStat.style.animation='none'; void elStat.offsetWidth; elStat.style.animation='hpSwap .55s ease'; }
  }
  if(RM) return; /* dönme yok; ilk kart CSS ile zaten görünür */
  var idx=0, vis=true;
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){vis=e.isIntersecting;});},{threshold:.25});
    io.observe(panel);
  }
  /* ilk Bebek animasyonu (CSS + heroBoot sayacı) bitsin, sonra dönmeye başla */
  setInterval(function(){ if(!vis)return; idx=(idx+1)%D.length; apply(idx); }, 3800);
})();
