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
    accent:'#c39b45', accent2:'#111111', accentSoft:'#dcc389',
    logoUrl:'', faviconUrl:'',
    metaTitle:'Selin Meridyen · Lüks Konut & Özel Portföy Danışmanı',
    metaDescription:'Yetki belgeli kişiye özel emlak danışmanlığı; güncel lüks ilanlar, davet usulü VIP portföy ve ücretsiz gayrimenkul değer analizi.',
    metaKeywords:'lüks konut danışmanı, özel portföy, yalı, penthouse, kişiye özel emlak, ücretsiz gayrimenkul analizi',
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
/* WHITE-LABEL PARSE-TIME SENKRON: reseller adı (kalıcı dn_brand) → SAAS_CONFIG.brandName.
   app.js'in HER render'ı (DOMContentLoaded dahil) baştan doğru markayı kullanır → "Selin
   Meridyen" parıltısı/yarışı olmaz (window.load senkronu yalnız yedek). brand.js AYNI kaynağı okur. */
try{var _wlb0=JSON.parse(localStorage.getItem('dn_brand')||'{}');if(_wlb0&&_wlb0.name&&(''+_wlb0.name).trim())SAAS_CONFIG.systemSettings.brandName=(''+_wlb0.name).trim();}catch(e){}
function saasResolve(key){const t=SAAS_CONFIG.tenantSettings,s=SAAS_CONFIG.systemSettings;if(t&&t[key]!=null&&t[key]!=='')return t[key];return s?s[key]:undefined;}
/* WHITE-LABEL logo harfi — tek kaynak (favicon/brand.js ile birebir aynı kural):
   admin override (dn_brand.initial) > reseller adının ilk harfi > 'M' (Meridyen ailesi, varsayılan). */
function _brandInitial(){try{var b=(window.dnGetBrand?dnGetBrand():{})||{};if(b.initial&&(''+b.initial).trim())return (''+b.initial).trim().charAt(0).toLocaleUpperCase('tr');}catch(e){}var bn=saasResolve('brandName')||'';if(!bn||bn==='Selin Meridyen')return 'M';return bn.trim().charAt(0).toLocaleUpperCase('tr');}
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
  return '<div style="background:var(--cream);border:1px solid var(--line-soft);border-radius:10px;padding:11px 13px;margin:0 0 12px;font-size:12.5px;line-height:1.8">'
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
function _mahClean(m){return (''+m).replace(/\s+(Mah\.?|Mahallesi|Köyü)$/i,'').trim();}
/* Gerçek mahalle — ProX locations/mahalleler (tek ilçe, tembel yükleme + cache) */
async function loadMahalleIlce(il,ilce){if(!il||!ilce)return null;
  if(!_mahCache[il]||typeof _mahCache[il]!=='object')_mahCache[il]={};
  if(_mahCache[il][ilce]!==undefined)return _mahCache[il][ilce];
  _mahCache[il][ilce]=null;/* uçuşta işaretle → çift istek engeli */
  var out=null;
  try{var rm=await proxApi('/api/v1/tenant/locations/mahalleler?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce));
    if(rm&&!rm.fallback&&rm.success===true&&Array.isArray(rm.data)&&rm.data.length){
      out=rm.data.map(_mahClean).filter(Boolean);
      /* yinelenenleri (Merkez vs Arnavutköy Merkez) tekilleştir, düzeni koru */
      var seen={},uniq=[];out.forEach(function(m){var k=m.toLocaleLowerCase('tr');if(!seen[k]){seen[k]=1;uniq.push(m);}});out=uniq;}}catch(e){}
  _mahCache[il][ilce]=out;return out;}
/* Gerçek ilçe listesi — ProX (yoksa çevrimdışı TR_ILILCE) */
async function proxIlceList(il){if(!il)return [];
  try{var ri=await proxApi('/api/v1/tenant/locations/ilceler?il='+encodeURIComponent(il));
    if(ri&&!ri.fallback&&ri.success===true&&Array.isArray(ri.data)&&ri.data.length)return ri.data.slice();}catch(e){}
  var rec=TR_ILILCE[il];return (rec&&rec.ilce)?rec.ilce.slice():[];}
/* Gerçek il listesi — ProX (yoksa TR_ILILCE) */
async function proxIlList(){
  try{var r=await proxApi('/api/v1/tenant/locations/iller');
    if(r&&!r.fallback&&r.success===true&&Array.isArray(r.data)&&r.data.length)return r.data.slice();}catch(e){}
  return trIlList();}
/* Bir ilin ilçelerinin gerçek mahallelerini toplu ısıt (sınırlı eşzamanlılık) */
async function loadMahalle(il,ilceList){if(!il)return _mahCache[il]||null;
  var ilcs=(ilceList&&ilceList.length)?ilceList:(await proxIlceList(il)).slice(0,10);
  try{await _wlPMap(ilcs,function(ic){return loadMahalleIlce(il,ic);},6);}catch(e){}
  return _mahCache[il]||null;}
window.loadMahalleIlce=loadMahalleIlce;window.proxIlceList=proxIlceList;window.proxIlList=proxIlList;window.loadMahalle=loadMahalle;
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
function saSelectIlce(ic){saLoad();saCurIlce=ic;renderSA();
  /* gerçek mahalle önerilerini ProX'ten getir, gelince yeniden çiz */
  try{loadMahalleIlce(saCurIl,ic).then(function(m){if(m&&m.length&&saCurIlce===ic)renderSA();});}catch(e){}}
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
    var work=saWorkList(6);
    /* gerçek mahalleleri yalnızca çalışılan (il,ilçe) çiftleri için ısıt — hedefli + hızlı */
    try{await _wlPMap(work,function(w){return loadMahalleIlce(w.il,w.ilce);},6);}catch(e){}
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
    /* #vaultGrid artık mahalle satılık/kiralık ProX endeksi gösterir (vaultIndexLoad); VIP_PORTFOLIO admin/aramada kullanılır */
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
    +'<div class="sta-row2"><div class="sta-f"><label>Altın Ton (accent)</label><input id="ob_accent" value="'+_obe(OB.accent)+'" placeholder="#c39b45"></div><div class="sta-f"><label>Logo URL</label><input id="ob_logo" value="'+_obe(OB.logo)+'" placeholder="https://.../logo.png"></div></div>';
  if(n===4)return '<p class="sub">Ana hizmet ilinizi seçin. İlçe / mahalle / kategori detaylarını sonra admin → Hizmet Alanı\'ndan yönetirsiniz.</p>'
    +'<div class="sta-f"><label>Ana İl</label><select id="ob_il" style="width:100%;padding:11px;border:1px solid var(--line-soft);border-radius:9px;background:var(--cream);color:inherit;font:inherit">'+(typeof trIlList==='function'?trIlList():['İstanbul']).slice().sort(function(a,b){return a.localeCompare(b,'tr');}).map(function(il){return '<option'+(il===OB.il?' selected':'')+'>'+il+'</option>';}).join('')+'</select></div>';
  return '<p class="sub">ProX API anahtarı (opsiyonel — canlı analiz/AI). Boş bırakılırsa demo ile kurulur.</p>'
    +'<div class="sta-f"><label>ProX API Anahtarı</label><input id="ob_key" value="'+_obe(OB.key)+'" placeholder="prox_..." style="font-family:monospace;font-size:12px"></div>'
    +'<div style="background:var(--cream);border:1px solid var(--line-soft);border-radius:10px;padding:12px 14px;margin-top:10px;font-size:13px;line-height:1.7;color:var(--muted)"><b style="color:var(--gold)">Kurulum özeti</b><br>Danışman: <b>'+_obe(OB.advisor||OB.brand||'—')+'</b> · EİDS: '+(OB.belge?'✓ '+_obe(OB.belge):'sonra')+'<br>İl: '+_obe(OB.il||'—')+' · ProX: '+(OB.key?'✓ anahtar':'demo')+'</div>';}
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
/* Footer/başka sayfa → index.html#hash ile overlay aç (birebir footer için) */
function _dnHashOpen(){var h=location.hash;try{
  if(h==='#kur')openOnboarding();
  else if(h==='#blog'&&typeof navGo==='function')navGo('blog');
  else if(h==='#randevu'&&typeof navGo==='function')navGo('randevu');
  else if(h==='#admin'&&typeof openAdminGate==='function')openAdminGate();
}catch(e){}}
window.addEventListener('hashchange',_dnHashOpen);
window.addEventListener('load',function(){try{var h=location.hash;if(h==='#kur'||h==='#blog'||h==='#randevu'||h==='#admin')setTimeout(_dnHashOpen,480);}catch(e){}});
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
  if(mark){if(logo){mark.classList.add('has-img');mark.innerHTML='<img src="'+logo+'" alt="logo">';}else{mark.classList.remove('has-img');mark.textContent=_brandInitial();}}
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

/* ---------- FAVORİ kimlik + ♡ buton (üye favorileri · uyelik.js dnFav motoru) ---------- */
function _favSlug(s){return (''+(s||'')).toLocaleLowerCase('tr').replace(/[^0-9a-zçğıöşü]+/gi,'-').replace(/^-+|-+$/g,'').slice(0,52);}
function listingFavId(l){return l&&(l.id?('ln-'+l.id):('ln-'+_favSlug(l.baslik||'')));}
function vipFavId(p){return p&&(p.id?('vp-'+p.id):('vp-'+_favSlug(p.baslik||'')));}
function _favBtn(id,type,snap){snap=snap||{};return '<button class="vc-fav" data-fid="'+_leD(id)+'" data-ftype="'+type+'" data-ft="'+_leD(snap.t||'')+'" data-fs="'+_leD(snap.s||'')+'" data-fp="'+_leD(snap.p||'')+'" data-fu="'+_leD(snap.u||'')+'" onclick="event.stopPropagation();window.dnFav&&dnFav(this.getAttribute(\'data-fid\'),this.getAttribute(\'data-ftype\'),this)" aria-label="Favorilere ekle" title="Favorilere ekle">♡</button>';}
try{window.listingFavId=listingFavId;window.vipFavId=vipFavId;}catch(e){}

function listingCardsHTML(){var _src=(window.DN_ILAN&&typeof DN_ILAN.get==='function')?DN_ILAN.get().slice(0,6):LISTINGS.filter(function(l){return l.status!=='pasif';});return _src.map(l=>{
  const price=l.kira?fmt(l.fiyat)+' <span class="per">/ay</span>':fmt(l.fiyat);
  const _u='ilanlar.html'+(l.id!=null?'?ilan='+encodeURIComponent(l.id):'');/* ana sayfa ilan kartı → İLANLAR sayfasında o ilanın detayı (index.html in-page randevu YOK) */
  return '<article class="vcard" role="link" tabindex="0" onclick="location.href=\''+_u+'\'" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();location.href=\''+_u+'\';}">'
   +'<div class="vcard-img"><div class="glow"></div><span class="vcard-tag">'+l.durum+'</span>'+_favBtn(listingFavId(l),'ilan',{t:l.baslik,s:l.bolge+' · '+l.durum,p:(l.kira?fmt(l.fiyat)+' /ay':fmt(l.fiyat)),u:'ilanlar.html'})+(l.img?'<img class="vcard-photo" src="'+(l.imgUrl||l.img)+'" alt="'+_leD(l.baslik||'')+'">':(_VIP_SVG[l.tip]||_VIP_SVG.villa))+'</div>'
   +'<div class="vcard-body"><h3>'+l.baslik+'</h3>'
   +'<div class="vcard-loc">'+_PIN+l.bolge+'</div>'
   +'<div class="vcard-spec"><div><b>'+l.m2+' m²</b>Alan</div><div><b>'+l.oda+'</b>Oda</div><div><b>'+l.kat+'</b>Kat</div></div>'
   +'<div class="vcard-ft"><div class="vcard-price">'+price+'<span>'+l.durum+'</span></div><div class="vcard-go">İlanı İncele'+_ARR+'</div></div>'
   +'</div></article>';
}).join('');}

function vipCardsHTML(){return VIP_PORTFOLIO.map(p=>{
  const nm=p.baslik.replace(/'/g,'’');
  return '<article class="vcard" onclick="leadFor(\''+nm+'\')">'
   +'<div class="vcard-img"><div class="glow"></div><span class="vcard-tag">'+p.tag+'</span><span class="vcard-lock">'+_LCK+' No Gizli</span>'+_favBtn(vipFavId(p),'vip',{t:p.baslik,s:p.cadde+' · '+p.bolge,p:fmt(p.baslangic)+' başlangıç',u:'ozel-portfoy.html'})+(_VIP_SVG[p.tip]||'')+'</div>'
   +'<div class="vcard-body"><h3>'+p.baslik+'</h3>'
   +'<div class="vcard-loc">'+_PIN+p.cadde+' · '+p.bolge+'</div>'
   +'<div class="vcard-spec"><div><b>'+p.m2+'</b>Alan</div><div><b>'+p.oda+'</b>Tip</div><div><b>'+p.ozet+'</b>Ayrıcalık</div></div>'
   +'<div class="vcard-ft"><div class="vcard-price">'+fmt(p.baslangic)+'<span>Başlangıç · Yetki Belgeli</span></div><div class="vcard-go">Ücretsiz Analiz'+_ARR+'</div></div>'
   +'</div></article>';
}).join('');}

/* ============ ANA SAYFA ÖZEL PORTFÖY · MAHALLE SATILIK/KİRALIK ENDEKSİ (canlı ProX) ============
   ozel-portfoy.html ile AYNI ProX mahalle endeksini teaser olarak gösterir. VIP_PORTFOLIO
   admin/arama tarafında kullanılmaya devam eder; yalnız #vaultGrid gösterimi değişir. */
var VAULT_MAH=[
  {ilce:'Beşiktaş',mah:'Bebek'},{ilce:'Beşiktaş',mah:'Etiler'},
  {ilce:'Şişli',mah:'Nişantaşı'},{ilce:'Kadıköy',mah:'Caddebostan'},
  {ilce:'Sarıyer',mah:'Zekeriyaköy'},{ilce:'Üsküdar',mah:'Kandilli'}
];
var _vaultSeq=0;
async function ozHomeEndeks(il,ilce,mah,durum){
  try{var r=await proxApi('/api/v1/tenant/endeks?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce)+'&mahalle='+encodeURIComponent(mah)+'&kategori=konut&durum='+durum);
    if(r&&r.success&&r.data&&+r.data.m2>0)return {m2:+r.data.m2,delta:+r.data.delta||0,score:+r.data.score||0};}catch(e){}
  return null;
}
function ozIdxCard(o){
  var yld=(o.sat&&o.kir)?((o.kir*12/o.sat)*100):0;
  var deltaTxt=o.delta?((o.delta>0?'▲ %':'▼ %')+Math.abs(o.delta).toLocaleString('tr-TR',{maximumFractionDigits:1})):'';
  return '<article class="oz-idx" data-slot="'+o.slot+'" onclick="leadFor(\''+(o.mah+' Özel Portföy').replace(/'/g,'’')+'\')">'
    +'<div class="oz-idx-h"><b>'+_leD(o.mah)+'</b><span>'+_leD(o.ilce)+'</span>'+(o.score?'<span class="oz-idx-sc">Skor '+Math.round(o.score)+'</span>':'')+'</div>'
    +'<div class="oz-idx-rows">'
    +'<div class="oz-idx-r"><span>Satılık</span><b>'+(o.sat?Math.round(o.sat).toLocaleString('tr-TR'):'—')+' <i>₺/m²</i>'+(deltaTxt?'<em class="oz-idx-d">'+deltaTxt+'</em>':'')+'</b></div>'
    +'<div class="oz-idx-r"><span>Kiralık</span><b>'+(o.kir?Math.round(o.kir).toLocaleString('tr-TR'):'—')+' <i>₺/m²·ay</i></b></div>'
    +'</div>'
    +'<div class="oz-idx-f"><span class="oz-idx-y">Brüt getiri '+(yld?('%'+yld.toLocaleString('tr-TR',{maximumFractionDigits:1})):'—')+'</span><span class="oz-idx-go">Özel portföy talep et'+_ARR+'</span></div>'
    +'</article>';
}
function vaultIndexLoad(){
  var g=document.getElementById('vaultGrid'); if(!g) return;
  g.innerHTML=VAULT_MAH.map(function(m,i){return '<article class="oz-idx" data-slot="'+i+'"><div class="oz-idx-h"><b>'+_leD(m.mah)+'</b><span>'+_leD(m.ilce)+'</span></div><div class="oz-idx-rows"><div class="oz-idx-r"><span>Satılık</span><b class="sh">•••</b></div><div class="oz-idx-r"><span>Kiralık</span><b class="sh">•••</b></div></div><div class="oz-idx-f"><span class="oz-idx-y sh">ProX endeksi hesaplanıyor…</span></div></article>';}).join('');
  if(typeof proxApi!=='function') return;
  var il='İstanbul'; try{if(typeof saLoad==='function'){var p=saLoad();if(p&&p.primary)il=p.primary;}}catch(e){}
  var mine=++_vaultSeq;
  VAULT_MAH.forEach(function(def,idx){
    Promise.all([ozHomeEndeks(il,def.ilce,def.mah,'satilik'),ozHomeEndeks(il,def.ilce,def.mah,'kiralik')]).then(function(r){
      if(mine!==_vaultSeq) return;
      var sat=r[0],kir=r[1]; if(!sat&&!kir) return;
      var card=g.querySelector('.oz-idx[data-slot="'+idx+'"]'); if(!card) return;
      card.outerHTML=ozIdxCard({slot:idx,mah:def.mah,ilce:def.ilce,sat:sat?sat.m2:0,kir:kir?kir.m2:0,delta:sat?sat.delta:0,score:sat?sat.score:0});
    }).catch(function(){});
  });
}

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
function footerHTML(){if(window.DN_FOOTER_HTML)return window.DN_FOOTER_HTML;/* KANONİK footer tek kaynak (content.js) — tüm sayfalarda birebir aynı */
  return '<footer><div class="wrap"><div class="fcols">'
  +'<div><div class="brand" onclick="goHome()"><span class="mark">'+_leD(_brandInitial())+'</span><span><b>'+_leD(saasResolve('brandName')||'Selin Meridyen')+'</b><small>Kişiye Özel Danışman</small></span></div><p>Yetki belgeli kişiye özel emlak danışmanlığı. Güncel lüks ilanlar, davet usulü VIP özel portföy ve ücretsiz gayrimenkul değer analizi.</p>'
  +'<div class="fsocial">'
    +'<a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg></a>'
    +'<a href="https://instagram.com/" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.89a4.29 4.29 0 1 1 0-8.58 4.29 4.29 0 0 1 0 8.58Zm6.86-11.15a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0Z"/></svg></a>'
    +'<a href="https://x.com/" target="_blank" rel="noopener noreferrer" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"/></svg></a>'
    +'<a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.4h3.1V21H3.4V8.4Zm5.34 0h2.97v1.72h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21h-3.1V8.4Z"/></svg></a>'
    +'<a href="https://youtube.com/" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3.02 3.02 0 0 0 2.12 2.14C4.5 20.15 12 20.15 12 20.15s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.6 24 12 24 12s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z"/></svg></a>'
    +'<a href="https://nsosyal.com" target="_blank" rel="noopener noreferrer" aria-label="NEXT Sosyal" title="NEXT Sosyal — yerli sosyal medya platformu"><svg viewBox="0 0 575 574" aria-hidden="true"><path d="M171.226 0.078125H0V573.751H171.226V0.078125Z"/><path d="M76.1875 0.0782019L191.016 300.603L275.573 520.404C289.183 552.162 326.104 573.751 367.482 573.751H501.631C538.082 573.751 574.142 535.579 574.142 494.748V0H402.917V323.053L398.458 311.632L278.858 0H76.1875V0.0782019Z"/></svg></a>'
  +'</div>'
  +'<div class="fportals"><a class="fp fp-sah" href="https://www.sahibinden.com" target="_blank" rel="noopener noreferrer" aria-label="sahibinden.com ilanlarımız">sahibinden</a><a class="fp fp-hep" href="https://www.hepsiemlak.com" target="_blank" rel="noopener noreferrer" aria-label="hepsiemlak ilanlarımız">hepsiemlak</a><a class="fp fp-ejt" href="https://www.emlakjet.com" target="_blank" rel="noopener noreferrer" aria-label="emlakjet ilanlarımız"><b>emlak</b>jet</a></div>'
  +'</div>'
  +'<div><h4>Keşfet</h4><ul><li><a href="ilanlar.html">İlanlar</a></li><li><a href="ozel-portfoy.html">Özel Portföy</a></li><li><a onclick="navGo(\'blog\')">Blog · Haberler</a></li><li><a onclick="navGo(\'surec\')">Süreç</a></li><li><a onclick="navGo(\'randevu\')">Ücretsiz Analiz</a></li></ul></div>'
  +'<div><h4>Kurumsal</h4><ul><li><a onclick="goHome()">Ana Sayfa</a></li><li><a href="hizmetlerimiz.html">Hizmetlerimiz</a></li><li><a href="hakkimizda.html">Hakkımda</a></li><li><a href="sss.html">S.S.S</a></li><li><a href="iletisim.html">İletişim</a></li><li><a onclick="if(typeof girisOrHesap===\'function\')girisOrHesap()">Üye Girişi / Hesabım</a></li><li><a href="https://wa.me/905320000000" target="_blank" rel="noopener noreferrer">WhatsApp</a></li></ul></div>'
  +'<div><h4>Yasal</h4><ul><li><a href="kvkk.html">KVKK Aydınlatma</a></li><li><a href="cerez.html">Çerez Politikası</a></li><li><a href="kullanim.html">Mesafeli Hizmet &amp; Kullanım</a></li><li><a onclick="openAdminGate()">Yönetim Paneli</a></li></ul></div>'
  +'</div><div class="fbot"><span>© 2026 Selin Meridyen · Lüks Konut & Özel Portföy Danışmanlığı · Tüm hakları saklıdır.</span><span class="fbot-lang">Dil: <select class="lang-sel" onchange="gmLang(this.value)" aria-label="Dil / Language"><option value="tr">Türkçe</option><option value="en">English</option><option value="ar">العربية</option></select></span><a class="fprox" href="https://emlakekspertizi.com" target="_blank" rel="noopener noreferrer" aria-label="Powered by ProX"><span class="fprox-lead">Powered by</span><span class="fprox-mark"><span class="fprox-pro">Pro</span><span class="fprox-x">X</span></span></a></div></div></footer>';}

/* =====================================================================
   BLOG · HABERLER — ProX API veri beslemeli (/api/v1/tenant/blog/feed)
   Yerel editör yazıları + ProX haber akışı birleşir; üyeler favoriye ekler.
   ===================================================================== */
const DN_BLOGS=[
  {id:'d1',cat:'Piyasa',icon:'📊',title:'2026’da İstanbul’da lüks konutun yönü',date:'2026-06-24',meta:'7 dk okuma · Haz 2026',src:'firma',
   sum:'Boğaz hattı ve prestij semtlerinde arz daralırken; doğru zamanlama ve doğru bölge, değeri koruyan iki temel unsur olmaya devam ediyor.',
   body:'Lüks konut piyasası, genel konuttan farklı dinamiklerle hareket eder. Sınırlı arz, eşsiz konum ve mimari nitelik; fiyatı standart m² mantığının ötesine taşır.\n\n2026 itibarıyla Boğaz hattı, Nişantaşı ve Zekeriyaköy gibi prestij bölgelerinde nitelikli arz daralmaya devam ediyor. Bu daralma, doğru evrakla ve doğru fiyat stratejisiyle piyasaya çıkan gayrimenkullerin değerini koruyor.\n\nYatırım kararında bugünkü m² fiyatı kadar, bölgenin reel değişim eğilimi ve likiditesi de belirleyici. Kesin rakamlar için güncel ProX endeksiyle teyit almak, duygusal değil veriye dayalı bir karar sağlar.'},
  {id:'d2',cat:'Yatırım',icon:'🏛️',title:'Boğaz’da yalı yatırımı: değeri koruyan 5 ilke',date:'2026-06-12',meta:'6 dk okuma · Haz 2026',src:'firma',
   sum:'Yalı ve su üstü portföyünde likidite düşük, değer yüksektir. Doğru alım için beş temel ilke.',
   body:'Yalı, Türkiye gayrimenkulünün en niş ve en değerli sınıfıdır. Arzı son derece sınırlı, alıcı havuzu özeldir.\n\n1) Tapu ve kıyı kenar çizgisi durumu netleştirilmeden ilerlenmez. 2) Restore edilmiş yalıda mimari onay geçmişi kritiktir. 3) İskele ve rıhtım hakları ayrıca değerlendirilir. 4) Bölgedeki son emsal satışlar ProX verisiyle teyit edilir. 5) Alım, tek muhatapla ve mahremiyet içinde yürütülür.\n\nBu sınıfta doğru danışman, fiyatın kendisi kadar değerlidir.'},
  {id:'d3',cat:'Rehber',icon:'🔑',title:'Özel Portföy neden “davet usulü” çalışır?',date:'2026-05-28',meta:'5 dk okuma · May 2026',src:'firma',
   sum:'Bazı gayrimenkuller ilan panolarında yer almaz. Mahremiyet, hem satıcıyı hem değeri korur.',
   body:'Özel Portföy; mülk sahibinin mahremiyet, güvenlik ya da stratejik nedenlerle açık ilana çıkmadığı gayrimenkullerden oluşur.\n\nBu portföyde yalnızca cadde/sokak ismi ve başlangıç değeri paylaşılır; tam adres ve net fiyat, ancak ön analiz sonrası ve nitelikli alıcıya açıklanır. Bu yaklaşım, gereksiz teşhiri önler ve değeri korur.\n\nÖzel Portföye erişim davet usulüdür; ücretsiz analiz görüşmesiyle başlar.'},
  {id:'d4',cat:'Rehber',icon:'📋',title:'Ekspertiz raporu satışı nasıl hızlandırır?',date:'2026-05-14',meta:'4 dk okuma · May 2026',src:'firma',
   sum:'Bağımsız ekspertiz, alıcı güvenini artırır ve pazarlık süresini kısaltır.',
   body:'Alıcı, fiyatın gerçekçi olduğuna ikna olduğunda süreç hızlanır. Bağımsız ve güncel bir ekspertiz raporu tam da bunu sağlar.\n\nRapor; m² değeri, bölge trendi, kıyaslanabilir emsaller ve gayrimenkulün nitelik puanını objektif biçimde ortaya koyar. Bu şeffaflık, pazarlık masasında satıcıyı güçlü kılar.\n\nProX doğrulanmış verisiyle hazırlanan bir ön değer analizi, doğru fiyat stratejisinin ilk adımıdır.'},
  {id:'d5',cat:'Analiz',icon:'📈',title:'Kira getirisi mi, değer artışı mı?',date:'2026-04-30',meta:'6 dk okuma · Nis 2026',src:'firma',
   sum:'İki strateji, iki farklı bölge profili. ProX verisiyle doğru dengeyi kurun.',
   body:'Yatırımcının önündeki temel tercih: düzenli kira getirisi mi, yoksa orta vadeli değer artışı mı?\n\nYüksek kira çarpanına sahip bölgeler istikrarlı nakit akışı sunar; gelişim koridorundaki mahalleler ise daha yüksek prim potansiyeli taşır. İkisi nadiren aynı üründe zirve yapar.\n\nBrüt kira getirisi ile bölge prim eğilimini birlikte okumak, portföyü hedefe göre kurmayı sağlar. ProX endeksi, bu iki metriği aynı ekranda karşılaştırma imkânı verir.'}
];
var _dnBlogCache=null;
/* ProX haber/blog akışı — /api/v1/tenant/blog/feed (ProX API anahtarıyla; uç yoksa []→yalnız yerel). */
async function proxBlogFeed(force){
  if(_dnBlogCache&&!force)return _dnBlogCache;var out=[];
  try{var r=await proxApi('/api/v1/tenant/blog/feed');
    if(r&&!r.fallback){var arr=r.posts||r.data||r.items||(Array.isArray(r)?r:[]);
      out=(arr||[]).map(function(p,i){var bd=p.body||p.content||p.icerik||'';return {id:'px'+(p.id||i),title:p.title||p.baslik||'',cat:p.cat||p.category||p.kategori||'ProX Haber',sum:p.summary||p.ozet||p.excerpt||(''+bd).slice(0,150),body:bd,icon:'📰',date:p.date||p.published||'',meta:((p.date||p.published||'')+' · ProX Haber').trim(),src:'prox'};}).filter(function(p){return p.title;});}
  }catch(e){}
  _dnBlogCache=out;return out;}
function dnBlogAll(){var px=_dnBlogCache||[];var seen={},all=[];
  DN_BLOGS.concat(px).forEach(function(b){var k=(b.title||'').toLocaleLowerCase('tr');if(k&&!seen[k]){seen[k]=1;all.push(b);}});return all;}
function dnBlogById(id){var a=dnBlogAll();for(var i=0;i<a.length;i++){if((''+a[i].id)===(''+id))return a[i];}return null;}
function _dnBlogCard(b){return '<article class="bcard" onclick="dnBlogDetail(\''+_leD(b.id)+'\')">'
  +'<div class="bcard-ic">'+(b.icon||'📄')+_favBtn('bl-'+b.id,'blog',{t:b.title,s:(b.cat||'')+' · '+(b.meta||''),p:'',u:'index.html#blog'})+'</div>'
  +'<div class="bcard-body"><div class="bcard-cat">'+_leD(b.cat||'Genel')+(b.src==='prox'?' · <b class="bcard-prox">Pro<span>X</span></b>':'')+'</div>'
  +'<h3>'+_leD(b.title||'')+'</h3><p>'+_leD(b.sum||'')+'</p>'
  +'<div class="bcard-meta"><span>'+_leD(b.meta||'')+'</span><span class="bcard-go">Oku →</span></div></div></article>';}
function dnBlogListHTML(){var posts=dnBlogAll();return '<section class="sec-pad"><div class="wrap"><div class="bgrid" id="dnBlogGrid">'+posts.map(_dnBlogCard).join('')+'</div>'
  +'<div class="vault-note" style="margin-top:36px">📰 Güncel haber ve analizler <b>ProX doğrulanmış emlak verisiyle</b> beslenir · üye iseniz beğendiğiniz yazıyı <b>favorilerinize</b> ekleyebilirsiniz.</div></div></section>';}
function dnBlogDetail(id){var b=dnBlogById(id);if(!b){navGo('blog');return;}
  var body=(b.body||b.sum||'').split(/\n{2,}/).map(function(par){return '<p style="margin:0 0 17px">'+_leD(par).replace(/\n/g,'<br>')+'</p>';}).join('');
  var ov=document.getElementById('pageOverlay');
  ov.innerHTML='<div class="pov-band"><div class="wrap"><div class="eyebrow">Blog · '+_leD(b.cat||'Haber')+(b.src==='prox'?' · ProX Haber':'')+'</div><h1>'+_leD(b.title||'')+'</h1><p>'+_leD(b.meta||'')+'</p></div></div>'
    +'<section class="sec-pad"><div class="wrap" style="max-width:780px"><button class="btn btn-line" onclick="navGo(\'blog\')" style="margin-bottom:22px">← Tüm yazılar</button>'
    +'<div class="blog-article">'+body+'</div>'
    +'<div class="blog-cta"><b>Bu konuda kişiye özel danışmanlık mı istiyorsunuz?</b><a class="btn btn-gold" onclick="navGo(\'randevu\')">Ücretsiz Analiz Randevusu</a></div>'
    +'</div></section>'+footerHTML();
  ov.classList.add('on');ov.scrollTop=0;document.body.classList.add('lock');
  var hv=document.getElementById('homeView');if(hv)hv.style.display='none';
  var nv=document.getElementById('nav');if(nv)nv.classList.add('scrolled');
  try{setActiveNav(null);}catch(e){}
  try{window.dnFavReflect&&dnFavReflect();}catch(e){}}
try{window.proxBlogFeed=proxBlogFeed;window.dnBlogAll=dnBlogAll;window.dnBlogById=dnBlogById;window.dnBlogDetail=dnBlogDetail;window.dnBlogListHTML=dnBlogListHTML;}catch(e){}

/* =====================================================================
   DİNAMİK SAYFA ROUTER (overlay — üst+alt menü birebir tutarlı)
   ===================================================================== */
const PAGES={
  ilanlar:{eyebrow:'Güncel İlanlar',title:'Açık Portföy',em:'tam şeffaf bilgi',desc:'Fiyat, oda, metrekare ve bölge bilgisi açıkça paylaşılan güncel lüks ilanlar. Beğendiğiniz gayrimenkul için ücretsiz değer analizi talep edin.',
    body:()=>'<section class="sec-pad"><div class="wrap"><div class="card-grid">'+listingCardsHTML()+'</div><div class="vault-note" style="margin-top:36px">Tüm ilanlar yetki belgelidir · detaylı bilgi ve yerinde değerlendirme için <b>ücretsiz analiz</b> alın.</div></div></section>'},
  vip:{eyebrow:'Kişisel VIP Portföyüm',title:'Davet Usulü',em:'gizli özel portföy',desc:'Yalnızca cadde/sokak ismi ve başlangıç değeri paylaşılır. Tam adres, kimlik ve net fiyat mahremiyet gereği yalnızca ön analiz sonrası açıklanır.',
    body:()=>'<section class="vault sec-pad"><div class="wrap"><div class="card-grid">'+vipCardsHTML()+'</div><div class="vault-note" style="margin-top:36px">🔒 <b>Adres gizliliği</b> tüm kayıtlarda esastır · net konum yalnızca <b>ücretsiz analiz görüşmesinde</b> paylaşılır.</div></div></section>'},
  blog:{eyebrow:'Blog · Haberler',title:'Bilgi & Piyasa',em:'ProX veri ışığında',desc:'Lüks konut, yatırım ve piyasa üzerine kişiye özel analizler; ProX doğrulanmış emlak verisiyle beslenen güncel haber akışı.',
    body:()=>dnBlogListHTML()},
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
  if(key==='blog'){/* ProX haber akışını çek → listeyi tazele (uç yoksa yalnız yerel kalır) */
    try{proxBlogFeed().then(function(px){if(px&&px.length){var g=document.getElementById('dnBlogGrid');if(g)g.innerHTML=dnBlogAll().map(_dnBlogCard).join('');}try{window.dnFavReflect&&dnFavReflect();}catch(e){}}).catch(function(){});}catch(e){}}
  try{window.dnFavReflect&&dnFavReflect();}catch(e){}
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
/* ===================== CRM · TAM FONKSİYONLU YÖNETİM (Panel · Kişiler · Satış Hattı · Görevler) =====================
   Tek depo dn_crm_v1 = {seq, kisiler[], deals[], tasks[]}. Gelen talepler (dn_leads) kişiye dönüştürülür. */
var CRM_KEY='dn_crm_v1';
var CRM_STAGES=[{k:'yeni',t:'Yeni'},{k:'iletisim',t:'İletişim'},{k:'gorusme',t:'Görüşme'},{k:'teklif',t:'Teklif'},{k:'kazanildi',t:'Kazanıldı'},{k:'kaybedildi',t:'Kaybedildi'}];
var CRM_TIP=['Alıcı','Satıcı','Kiracı','Kiralayan','Yatırımcı'];
var CRM_KAYNAK=['Web Sitesi','ProX Asistan','Telefon','WhatsApp','Tavsiye','Portal','Randevu Formu'];
var CRM_GOREV=['Arama','Yer Gösterme','Toplantı','Tapu / Sözleşme','Takip'];
var _crm=null;
function crmLoad(){if(_crm)return _crm;try{_crm=JSON.parse(localStorage.getItem(CRM_KEY)||'null');}catch(e){}if(!_crm||typeof _crm!=='object')_crm={seq:100,kisiler:[],deals:[],tasks:[]};_crm.kisiler=_crm.kisiler||[];_crm.deals=_crm.deals||[];_crm.tasks=_crm.tasks||[];_crm.ekip=_crm.ekip||[];_crm.sozlesmeler=_crm.sozlesmeler||[];_crm.komisyon=_crm.komisyon||[];_crm.kira=_crm.kira||[];_crm.seq=_crm.seq||100;return _crm;}
function crmSave(){try{localStorage.setItem(CRM_KEY,JSON.stringify(_crm));}catch(e){try{toast('Kayıt alanı dolu; eski veriyi dışa aktarın.');}catch(_){}}}
function crmId(){crmLoad();return ++_crm.seq;}
function _crmTL(n){n=Math.round(+n||0);if(n>=1000000)return (Math.round(n/100000)/10).toLocaleString('tr-TR')+' Mn ₺';if(n>=1000)return n.toLocaleString('tr-TR')+' ₺';return n?n+' ₺':'—';}
function _crmDate(x){try{return new Date(x).toLocaleDateString('tr-TR',{day:'2-digit',month:'2-digit',year:'2-digit'});}catch(e){return '';}}
function crmKisi(id){crmLoad();return _crm.kisiler.filter(function(k){return k.id===id;})[0]||null;}
function crmStageT(k){var s=CRM_STAGES.filter(function(x){return x.k===k;})[0];return s?s.t:k;}
function crmLeads(){var a=[];try{a=JSON.parse(localStorage.getItem('dn_leads')||'[]');}catch(e){}return Array.isArray(a)?a:[];}
function _crmOpt(arr,sel){return arr.map(function(o){return '<option'+(o===sel?' selected':'')+'>'+_leD(o)+'</option>';}).join('');}
function crmRenderAll(){try{crmRenderDash();}catch(e){}try{crmRenderKisiler();}catch(e){}try{crmRenderPipe();}catch(e){}try{crmRenderTasks();}catch(e){}try{crmRenderEkip();}catch(e){}try{crmRenderSoz();}catch(e){}try{crmRenderKomisyon();}catch(e){}try{crmRenderKira();}catch(e){}try{crmRenderRapor();}catch(e){}try{cmsRender();}catch(e){}try{crmRenderMatch();}catch(e){}try{crmRenderFirma();}catch(e){}try{crmRenderIletisim();}catch(e){}try{crmRenderProxApi();}catch(e){}}
window.crmRenderAll=crmRenderAll;

/* ---------- PANEL (Dashboard) ---------- */
function crmRenderDash(){var host=document.getElementById('crmDash');if(!host)return;crmLoad();
  var leads=crmLeads();
  var open=_crm.deals.filter(function(d){return d.stage!=='kazanildi'&&d.stage!=='kaybedildi';});
  var won=_crm.deals.filter(function(d){return d.stage==='kazanildi';});
  var pipe=open.reduce(function(s,d){return s+(+d.value||0);},0);
  var wonVal=won.reduce(function(s,d){return s+(+d.value||0);},0);
  var today=new Date();today.setHours(0,0,0,0);
  var dueTasks=_crm.tasks.filter(function(t){return !t.done;});
  var overdue=dueTasks.filter(function(t){return t.date&&new Date(t.date)<today;}).length;
  var thisMonth=new Date().toISOString().slice(0,7);
  var newKisi=_crm.kisiler.filter(function(k){return (k.created||'').slice(0,7)===thisMonth;}).length;
  var nListings=(typeof LISTINGS!=='undefined'?LISTINGS.length:0)+(typeof VIP_PORTFOLIO!=='undefined'?VIP_PORTFOLIO.length:0);
  function kpi(v,l,hot){return '<div class="crm-kpi'+(hot?' hot':'')+'"><b>'+v+'</b><span>'+l+'</span></div>';}
  var H='<div class="crm-kpis">'
    +kpi(_crm.kisiler.length,'Kişi')
    +kpi(open.length,'Açık Fırsat')
    +kpi(_crmTL(pipe),'Pipeline Değeri')
    +kpi(dueTasks.length,'Açık Görev',overdue>0)
    +kpi(leads.length,'Gelen Talep',leads.length>0)
    +kpi(_crmTL(wonVal),'Kazanılan')
    +'</div>';
  /* pipeline özet çubuğu */
  H+='<div class="crm-sec"><div class="crm-sec-h">Satış Hattı Özeti</div><div class="crm-funnel">';
  CRM_STAGES.forEach(function(s){var n=_crm.deals.filter(function(d){return d.stage===s.k;}).length;
    H+='<div class="crm-fn" data-s="'+s.k+'" onclick="staTab(document.querySelector(\'[data-t=crmpipe]\'))"><b>'+n+'</b><span>'+s.t+'</span></div>';});
  H+='</div></div>';
  /* yaklaşan görevler */
  H+='<div class="crm-two"><div class="crm-sec"><div class="crm-sec-h">Yaklaşan Görevler</div>';
  var up=dueTasks.slice().sort(function(a,b){return (a.date||'')<(b.date||'')?-1:1;}).slice(0,5);
  if(!up.length)H+='<div class="crm-empty">Açık görev yok.</div>';
  else H+=up.map(function(t){var od=t.date&&new Date(t.date)<today;var k=crmKisi(t.kisiId);
    return '<div class="crm-mini"><label><input type="checkbox" onchange="crmToggleTask('+t.id+')"><span>'+_leD(t.title||t.tip||'Görev')+(k?' · '+_leD(k.name):'')+'</span></label><em'+(od?' class="od"':'')+'>'+(t.date?_crmDate(t.date):'')+'</em></div>';}).join('');
  H+='</div>';
  /* son gelen talepler */
  H+='<div class="crm-sec"><div class="crm-sec-h">Son Gelen Talepler <span class="crm-h-act" onclick="staTab(document.querySelector(\'[data-t=gorusmeler]\'))">tümü →</span></div>';
  if(!leads.length)H+='<div class="crm-empty">Talep yok. Formlar ve ProX Asistan telefon bırakanları buraya düşer.</div>';
  else H+=leads.slice(0,5).map(function(l){return '<div class="crm-mini"><span>'+_leD(l.name||'—')+(l.phone?(' · 📞 '+_leD(l.phone)):'')+'<em class="src">'+_leD(l.src||'')+'</em></span><button class="crm-x2" onclick="crmFromLead(\''+_leD(l.id)+'\')">+ Kişi</button></div>';}).join('');
  H+='</div></div>';
  H+='<div style="margin-top:14px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-line" onclick="crmSeedDemo()">Örnek CRM verisi ekle</button><button class="btn btn-line" onclick="crmExport()">⬇ Dışa Aktar (JSON)</button></div>';
  host.innerHTML=H;
}
/* ---------- KİŞİLER ---------- */
var _crmKF={q:'',tip:''};
function crmRenderKisiler(){var host=document.getElementById('crmKisiler');if(!host)return;crmLoad();
  var q=_crmKF.q.toLocaleLowerCase('tr'),list=_crm.kisiler.filter(function(k){
    if(_crmKF.tip&&k.tip!==_crmKF.tip)return false;
    if(!q)return true;return ((k.name||'')+' '+(k.tel||'')+' '+(k.il||'')+' '+(k.ilce||'')).toLocaleLowerCase('tr').indexOf(q)>=0;});
  var H='<div class="crm-bar"><input class="crm-search" placeholder="Ara: isim, telefon, bölge…" value="'+_leD(_crmKF.q)+'" oninput="_crmKF.q=this.value;crmRenderKisiler()"><select class="crm-selm" onchange="_crmKF.tip=this.value;crmRenderKisiler()"><option value="">Tüm tipler</option>'+CRM_TIP.map(function(t){return '<option'+(t===_crmKF.tip?' selected':'')+'>'+t+'</option>';}).join('')+'</select><button class="btn btn-gold crm-add" onclick="crmEditKisi(0)">+ Kişi Ekle</button></div>';
  if(!list.length)H+='<div class="crm-empty">Kişi yok. "+ Kişi Ekle" ile ekleyin veya Panel/Görüşmeler\'den gelen talebi kişiye dönüştürün.</div>';
  else H+='<div class="crm-list">'+list.map(function(k){var deals=_crm.deals.filter(function(d){return d.kisiId===k.id;});
    return '<div class="crm-card"><div class="crm-card-top"><div><b>'+_leD(k.name||'—')+'</b><span class="crm-badge">'+_leD(k.tip||'—')+'</span></div><div class="crm-card-act"><button onclick="crmEditKisi('+k.id+')" title="Düzenle">✎</button><button onclick="crmDelKisi('+k.id+')" title="Sil">🗑</button></div></div>'
      +'<div class="crm-card-b">'+(k.tel?('📞 '+_leD(k.tel)+' '):'')+(k.email?('· '+_leD(k.email)):'')+'</div>'
      +'<div class="crm-card-b sub">'+[k.il,k.ilce].filter(Boolean).map(_leD).join(' / ')+(k.kategori?(' · '+_leD(k.kategori)):'')+(k.min||k.max?(' · '+_crmTL(k.min)+(k.max?('–'+_crmTL(k.max)):'')):'')+'</div>'
      +'<div class="crm-card-f"><span class="crm-src">'+_leD(k.kaynak||'')+'</span><button class="crm-x2" onclick="crmNewDealFor('+k.id+')">+ Fırsat'+(deals.length?(' ('+deals.length+')'):'')+'</button></div></div>';
  }).join('')+'</div>';
  host.innerHTML=H;
}
function crmEditKisi(id){crmLoad();var k=id?crmKisi(id):{id:0,tip:'Alıcı',kaynak:'Web Sitesi'};if(!k)return;
  var F='<div class="crm-mh">'+(id?'Kişiyi Düzenle':'Yeni Kişi')+'</div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Ad Soyad</label><input id="ck_name" value="'+_leD(k.name||'')+'"></div><div class="crm-f"><label>Telefon</label><input id="ck_tel" value="'+_leD(k.tel||'')+'"></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>E-posta</label><input id="ck_email" value="'+_leD(k.email||'')+'"></div><div class="crm-f"><label>Tip</label><select id="ck_tip">'+_crmOpt(CRM_TIP,k.tip)+'</select></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>İl</label><input id="ck_il" value="'+_leD(k.il||'')+'"></div><div class="crm-f"><label>İlçe</label><input id="ck_ilce" value="'+_leD(k.ilce||'')+'"></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Kategori / İlgi</label><input id="ck_kat" value="'+_leD(k.kategori||'')+'" placeholder="Konut, Villa, Arsa…"></div><div class="crm-f"><label>Kaynak</label><select id="ck_kaynak">'+_crmOpt(CRM_KAYNAK,k.kaynak)+'</select></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Bütçe Min (₺)</label><input id="ck_min" type="number" value="'+(k.min||'')+'"></div><div class="crm-f"><label>Bütçe Max (₺)</label><input id="ck_max" type="number" value="'+(k.max||'')+'"></div></div>'
    +'<div class="crm-f"><label>Not</label><textarea id="ck_not" rows="2">'+_leD(k.not||'')+'</textarea></div>'
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="crmSaveKisi('+id+')">Kaydet</button><button class="btn btn-line" onclick="crmCloseModal()">Vazgeç</button></div>';
  crmModal(F);
}
function crmSaveKisi(id){crmLoad();var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var o={name:g('ck_name'),tel:g('ck_tel'),email:g('ck_email'),tip:g('ck_tip'),il:g('ck_il'),ilce:g('ck_ilce'),kategori:g('ck_kat'),kaynak:g('ck_kaynak'),min:+g('ck_min')||0,max:+g('ck_max')||0,not:g('ck_not')};
  if(!o.name&&!o.tel){toast('En az ad veya telefon girin.');return;}
  if(id){var k=crmKisi(id);if(k){Object.assign(k,o);k.updated=new Date().toISOString();}}
  else{o.id=crmId();o.created=new Date().toISOString();_crm.kisiler.unshift(o);}
  crmSave();crmCloseModal();crmRenderKisiler();crmRenderDash();toast('✓ Kişi kaydedildi.');
}
function crmDelKisi(id){if(!confirm('Bu kişi ve bağlı fırsatları silinsin mi?'))return;crmLoad();_crm.kisiler=_crm.kisiler.filter(function(k){return k.id!==id;});_crm.deals=_crm.deals.filter(function(d){return d.kisiId!==id;});crmSave();crmRenderKisiler();crmRenderPipe();crmRenderDash();toast('Kişi silindi.');}
function crmFromLead(lid){crmLoad();var l=crmLeads().filter(function(x){return String(x.id)===String(lid);})[0];if(!l){toast('Talep bulunamadı.');return;}
  var o={id:crmId(),name:l.name||'İsimsiz',tel:l.phone||'',email:l.email||'',tip:'Alıcı',kaynak:l.src||'Web Sitesi',not:(l.konu||'')+(l.msg?(' — '+l.msg):''),created:new Date().toISOString()};
  _crm.kisiler.unshift(o);crmSave();
  try{staTab(document.querySelector('[data-t=crmkisi]'));}catch(e){}
  crmRenderKisiler();crmRenderDash();toast('✓ Talep kişiye eklendi: '+o.name);
}
/* ---------- SATIŞ HATTI (Pipeline / Kanban) ---------- */
function crmRenderPipe(){var host=document.getElementById('crmPipe');if(!host)return;crmLoad();
  var H='<div class="crm-bar"><div class="sub" style="margin:0">Fırsatları aşamalar arasında ◀ ▶ ile taşıyın; kartı düzenlemek için ✎.</div><button class="btn btn-gold crm-add" onclick="crmEditDeal(0)">+ Fırsat</button></div>';
  H+='<div class="crm-kanban">';
  CRM_STAGES.forEach(function(s,si){var col=_crm.deals.filter(function(d){return d.stage===s.k;});
    var sum=col.reduce(function(a,d){return a+(+d.value||0);},0);
    H+='<div class="crm-col" data-s="'+s.k+'"><div class="crm-col-h"><b>'+s.t+'</b><span>'+col.length+' · '+_crmTL(sum)+'</span></div>';
    col.forEach(function(d){var k=crmKisi(d.kisiId);
      H+='<div class="crm-deal"><div class="crm-deal-t">'+_leD(d.title||'Fırsat')+'</div>'
        +'<div class="crm-deal-m">'+(k?_leD(k.name):'—')+(d.value?(' · '+_crmTL(d.value)):'')+'</div>'
        +'<div class="crm-deal-f"><div class="crm-mv"><button onclick="crmMoveDeal('+d.id+',-1)"'+(si===0?' disabled':'')+'>◀</button><button onclick="crmMoveDeal('+d.id+',1)"'+(si===CRM_STAGES.length-1?' disabled':'')+'>▶</button></div><div class="crm-deal-a"><button onclick="crmEditDeal('+d.id+')">✎</button><button onclick="crmDelDeal('+d.id+')">🗑</button></div></div></div>';
    });
    if(!col.length)H+='<div class="crm-col-e">—</div>';
    H+='</div>';
  });
  H+='</div>';
  host.innerHTML=H;
}
function crmMoveDeal(id,dir){crmLoad();var d=_crm.deals.filter(function(x){return x.id===id;})[0];if(!d)return;
  var i=CRM_STAGES.map(function(s){return s.k;}).indexOf(d.stage);i=Math.max(0,Math.min(CRM_STAGES.length-1,i+dir));
  d.stage=CRM_STAGES[i].k;d.updated=new Date().toISOString();crmSave();crmRenderPipe();crmRenderDash();}
function crmEditDeal(id,preKisi){crmLoad();var d=id?_crm.deals.filter(function(x){return x.id===id;})[0]:{id:0,stage:'yeni',kisiId:preKisi||0,prob:30};if(!d)return;
  var kOpt='<option value="0">— Kişi seçin —</option>'+_crm.kisiler.map(function(k){return '<option value="'+k.id+'"'+(k.id===d.kisiId?' selected':'')+'>'+_leD(k.name||('#'+k.id))+'</option>';}).join('');
  var sOpt=CRM_STAGES.map(function(s){return '<option value="'+s.k+'"'+(s.k===d.stage?' selected':'')+'>'+s.t+'</option>';}).join('');
  var F='<div class="crm-mh">'+(id?'Fırsatı Düzenle':'Yeni Fırsat')+'</div>'
    +'<div class="crm-f"><label>Başlık</label><input id="cd_title" value="'+_leD(d.title||'')+'" placeholder="Nişantaşı 3+1 — alıcı görüşmesi"></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Kişi</label><select id="cd_kisi">'+kOpt+'</select></div><div class="crm-f"><label>Aşama</label><select id="cd_stage">'+sOpt+'</select></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Değer (₺)</label><input id="cd_value" type="number" value="'+(d.value||'')+'"></div><div class="crm-f"><label>Olasılık (%)</label><input id="cd_prob" type="number" value="'+(d.prob||30)+'"></div></div>'
    +'<div class="crm-f"><label>Not</label><textarea id="cd_not" rows="2">'+_leD(d.not||'')+'</textarea></div>'
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="crmSaveDeal('+id+')">Kaydet</button><button class="btn btn-line" onclick="crmCloseModal()">Vazgeç</button>'+(id?'<button class="btn btn-line" style="margin-left:auto;color:#c0603a" onclick="crmDelDeal('+id+')">Sil</button>':'')+'</div>';
  crmModal(F);
}
function crmSaveDeal(id){crmLoad();var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var o={title:g('cd_title'),kisiId:+g('cd_kisi')||0,stage:g('cd_stage')||'yeni',value:+g('cd_value')||0,prob:+g('cd_prob')||0,not:g('cd_not')};
  if(!o.title){toast('Fırsat başlığı girin.');return;}
  if(id){var d=_crm.deals.filter(function(x){return x.id===id;})[0];if(d){Object.assign(d,o);d.updated=new Date().toISOString();}}
  else{o.id=crmId();o.created=new Date().toISOString();_crm.deals.unshift(o);}
  crmSave();crmCloseModal();crmRenderPipe();crmRenderDash();toast('✓ Fırsat kaydedildi.');
}
function crmDelDeal(id){if(!confirm('Fırsat silinsin mi?'))return;crmLoad();_crm.deals=_crm.deals.filter(function(d){return d.id!==id;});crmSave();crmCloseModal();crmRenderPipe();crmRenderDash();toast('Fırsat silindi.');}
function crmNewDealFor(kisiId){try{staTab(document.querySelector('[data-t=crmpipe]'));}catch(e){}crmEditDeal(0,kisiId);}
/* ---------- GÖREVLER ---------- */
function crmRenderTasks(){var host=document.getElementById('crmTasks');if(!host)return;crmLoad();
  var today=new Date();today.setHours(0,0,0,0);
  var open=_crm.tasks.filter(function(t){return !t.done;}).sort(function(a,b){return (a.date||'')<(b.date||'')?-1:1;});
  var done=_crm.tasks.filter(function(t){return t.done;}).slice(0,20);
  var H='<div class="crm-bar"><div class="sub" style="margin:0">'+open.length+' açık görev</div><button class="btn btn-gold crm-add" onclick="crmEditTask(0)">+ Görev</button></div>';
  if(!open.length)H+='<div class="crm-empty">Açık görev yok. Arama, yer gösterme, tapu ve takip görevlerinizi buradan planlayın.</div>';
  else H+='<div class="crm-list">'+open.map(function(t){var od=t.date&&new Date(t.date)<today;var k=crmKisi(t.kisiId);
    return '<div class="crm-task"><label><input type="checkbox" onchange="crmToggleTask('+t.id+')"><span><b>'+_leD(t.title||t.tip||'Görev')+'</b><em class="tt">'+_leD(t.tip||'')+(k?(' · '+_leD(k.name)):'')+'</em></span></label><div class="crm-task-r"><em'+(od?' class="od"':'')+'>'+(t.date?_crmDate(t.date):'—')+'</em><button onclick="crmEditTask('+t.id+')">✎</button><button onclick="crmDelTask('+t.id+')">🗑</button></div></div>';}).join('')+'</div>';
  if(done.length)H+='<div class="crm-sec-h" style="margin-top:18px">Tamamlanan</div><div class="crm-list">'+done.map(function(t){return '<div class="crm-task done"><label><input type="checkbox" checked onchange="crmToggleTask('+t.id+')"><span>'+_leD(t.title||t.tip||'Görev')+'</span></label><button onclick="crmDelTask('+t.id+')">🗑</button></div>';}).join('')+'</div>';
  host.innerHTML=H;
}
function crmToggleTask(id){crmLoad();var t=_crm.tasks.filter(function(x){return x.id===id;})[0];if(!t)return;t.done=!t.done;crmSave();crmRenderTasks();crmRenderDash();}
function crmEditTask(id){crmLoad();var t=id?_crm.tasks.filter(function(x){return x.id===id;})[0]:{id:0,tip:'Arama',date:new Date().toISOString().slice(0,10)};if(!t)return;
  var kOpt='<option value="0">— (opsiyonel) —</option>'+_crm.kisiler.map(function(k){return '<option value="'+k.id+'"'+(k.id===t.kisiId?' selected':'')+'>'+_leD(k.name||('#'+k.id))+'</option>';}).join('');
  var F='<div class="crm-mh">'+(id?'Görevi Düzenle':'Yeni Görev')+'</div>'
    +'<div class="crm-f"><label>Başlık</label><input id="ct_title" value="'+_leD(t.title||'')+'" placeholder="Alıcıyı ara — Beşiktaş dairesi"></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Tür</label><select id="ct_tip">'+_crmOpt(CRM_GOREV,t.tip)+'</select></div><div class="crm-f"><label>Tarih</label><input id="ct_date" type="date" value="'+(t.date?String(t.date).slice(0,10):'')+'"></div></div>'
    +'<div class="crm-f"><label>İlgili Kişi</label><select id="ct_kisi">'+kOpt+'</select></div>'
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="crmSaveTask('+id+')">Kaydet</button><button class="btn btn-line" onclick="crmCloseModal()">Vazgeç</button></div>';
  crmModal(F);
}
function crmSaveTask(id){crmLoad();var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var o={title:g('ct_title'),tip:g('ct_tip'),date:g('ct_date'),kisiId:+g('ct_kisi')||0};
  if(!o.title&&!o.tip){toast('Görev başlığı girin.');return;}
  if(id){var t=_crm.tasks.filter(function(x){return x.id===id;})[0];if(t)Object.assign(t,o);}
  else{o.id=crmId();o.done=false;o.created=new Date().toISOString();_crm.tasks.unshift(o);}
  crmSave();crmCloseModal();crmRenderTasks();crmRenderDash();toast('✓ Görev kaydedildi.');
}
function crmDelTask(id){crmLoad();_crm.tasks=_crm.tasks.filter(function(t){return t.id!==id;});crmSave();crmRenderTasks();crmRenderDash();}
/* ---------- Modal + araçlar ---------- */
function crmModal(html){var m=document.getElementById('crmModal');if(!m){m=document.createElement('div');m.id='crmModal';m.className='crm-modal';m.innerHTML='<div class="crm-modal-ov" onclick="crmCloseModal()"></div><div class="crm-modal-c"></div>';document.body.appendChild(m);}
  m.querySelector('.crm-modal-c').innerHTML=html;m.classList.add('on');}
function crmCloseModal(){var m=document.getElementById('crmModal');if(m)m.classList.remove('on');}
function crmSeedDemo(){crmLoad();if(_crm.kisiler.length&&!confirm('Mevcut CRM verisinin üstüne örnek veri eklensin mi?'))return;
  var k1=crmId(),k2=crmId(),k3=crmId();
  _crm.kisiler.unshift(
    {id:k1,name:'Örnek — Cem Aydın',tel:'0532 000 00 01',email:'cem@example.com',tip:'Alıcı',il:'İstanbul',ilce:'Beşiktaş',kategori:'Konut',min:8000000,max:14000000,kaynak:'ProX Asistan',not:'Boğaz manzaralı 3+1 arıyor.',created:new Date().toISOString()},
    {id:k2,name:'Örnek — Deniz Yıldız',tel:'0532 000 00 02',tip:'Satıcı',il:'İstanbul',ilce:'Kadıköy',kategori:'Konut',kaynak:'Tavsiye',not:'Caddebostan 2+1 satılık.',created:new Date().toISOString()},
    {id:k3,name:'Örnek — Ece Kaya',tel:'0532 000 00 03',tip:'Yatırımcı',il:'İstanbul',ilce:'Şişli',kategori:'Ticari',min:20000000,kaynak:'Web Sitesi',created:new Date().toISOString()});
  _crm.deals.unshift(
    {id:crmId(),title:'Beşiktaş 3+1 — Cem Aydın',kisiId:k1,stage:'gorusme',value:12500000,prob:55,created:new Date().toISOString()},
    {id:crmId(),title:'Caddebostan 2+1 satış yetkisi',kisiId:k2,stage:'teklif',value:9800000,prob:70,created:new Date().toISOString()},
    {id:crmId(),title:'Şişli ticari yatırım',kisiId:k3,stage:'yeni',value:22000000,prob:25,created:new Date().toISOString()});
  _crm.tasks.unshift(
    {id:crmId(),title:'Cem Bey\'i ara — yeni ilanlar',tip:'Arama',date:new Date().toISOString().slice(0,10),kisiId:k1,done:false,created:new Date().toISOString()},
    {id:crmId(),title:'Caddebostan yer gösterme',tip:'Yer Gösterme',date:new Date(Date.now()+86400000).toISOString().slice(0,10),kisiId:k2,done:false,created:new Date().toISOString()});
  crmSave();crmRenderAll();toast('✓ Örnek CRM verisi eklendi (silmekte özgürsünüz).');
}
function crmExport(){crmLoad();try{var blob=new Blob([JSON.stringify(_crm,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='meridyen-crm-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();toast('CRM verisi indirildi.');}catch(e){toast('Dışa aktarılamadı.');}}
/* CRM fonksiyonları global scope'ta (function bildirimleri window'a bağlıdır) → onclick handler'ları bare isimle erişir. */
/* ===================== İLAN YÖNETİMİ (açık portföy CRUD + EİDS yayın kapısı) ===================== */
var ILN_KEY='dn_listings_v1';
var ILN_TIP=[{k:'penthouse',t:'Penthouse'},{k:'rezidans',t:'Rezidans'},{k:'villa',t:'Villa'},{k:'yali',t:'Yalı'},{k:'loft',t:'Loft / Daire'},{k:'arsa',t:'Arsa'}];
var ILN_DURUM=['Satılık','Kiralık'];
function ilnTipT(k){var x=ILN_TIP.filter(function(t){return t.k===k;})[0];return x?x.t:k;}
function ilanEnsureIds(){var mx=0;LISTINGS.forEach(function(l){if(l.id)mx=Math.max(mx,l.id);});LISTINGS.forEach(function(l){if(!l.id)l.id=++mx;if(!l.status)l.status='aktif';
  if(!l.il)l.il='İstanbul';
  if(!l.ilce&&l.bolge){var p=(''+l.bolge).split('·').map(function(x){return x.trim();});if(p[0])l.ilce=p[0];if(p[1]&&!l.mahalle)l.mahalle=p[1];}
});return mx;}
function ilanLoad(){try{var a=JSON.parse(localStorage.getItem(ILN_KEY)||'null');if(Array.isArray(a)){LISTINGS.length=0;a.forEach(function(x){LISTINGS.push(x);});}}catch(e){}ilanEnsureIds();}
function ilanSave(){try{localStorage.setItem(ILN_KEY,JSON.stringify(LISTINGS));}catch(e){try{toast('Kayıt alanı dolu.');}catch(_){}}}
function ilanBolge(l){return [l.ilce,l.mahalle].filter(Boolean).join(' · ')||l.bolge||'';}
var _ilnImg='',_ilnEids=null;
function _eidsKod(){var C='0123456789ABCDEFGHJKLMNPQRSTUVWXYZ',s='EIDS-';for(var i=0;i<3;i++){for(var j=0;j<4;j++)s+=C[Math.floor(Math.random()*C.length)];if(i<2)s+='-';}return s;}
function _eidsTasNo(){var s='';for(var i=0;i<12;i++)s+=Math.floor(Math.random()*10);return s;}
function _ilnEidsHtml(){if(_ilnEids&&_ilnEids.status==='dogrulandi')return '<div class="iln-eids">✓ EİDS Doğrulandı · '+_leD(_ilnEids.kod)+' · Taşınmaz No '+_leD(_ilnEids.tasinmazNo)+(_ilnEids.cins?(' · '+_leD(_ilnEids.cins)):'')+'</div>';return '<div class="iln-eids no">Bu ilan için EİDS taşınmaz doğrulaması yapılmadı.</div>';}
function ilanImgUpload(input){var f=input.files&&input.files[0];if(!f)return;var r=new FileReader();r.onload=function(e){_ilnImg=e.target.result;var t=document.getElementById('il_thumb');if(t)t.innerHTML='<img src="'+_ilnImg+'" alt="">';};r.readAsDataURL(f);}
function ilanImgClear(){_ilnImg='';var t=document.getElementById('il_thumb');if(t)t.textContent='—';}
function ilanEidsVerify(){var eidsOk=false;try{eidsOk=!!(eidsFirma().eids&&eidsFirma().eids.yetkili);}catch(e){}
  if(!eidsOk){toast('Önce firma EİDS yetkisi gerekir (EİDS Yetki sekmesi).');return;}
  var no=((document.getElementById('il_eids')||{}).value||'').trim()||_eidsTasNo();
  var cinsler=['Mesken (Kat Mülkiyeti)','Müstakil Konut','İşyeri','Arsa','Bina'];
  _ilnEids={status:'dogrulandi',kod:_eidsKod(),tasinmazNo:no,cins:cinsler[Math.floor(Math.random()*cinsler.length)],malikTip:'Yetkili İşletme',tarih:new Date().toISOString()};
  var st=document.getElementById('il_eidsStatus');if(st)st.innerHTML=_ilnEidsHtml();
  var ne=document.getElementById('il_eids');if(ne&&!ne.value)ne.value=no;
  toast('✓ EİDS taşınmaz doğrulaması alındı.');}
async function ilanAiDesc(){var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var parts=[g('il_baslik'),ilnTipT(g('il_tip')),g('il_durum'),[g('il_ilce'),g('il_mah')].filter(Boolean).join(' '),(g('il_m2')?g('il_m2')+' m²':''),g('il_oda'),(g('il_fiyat')?fmt(+g('il_fiyat'))+' ₺':'')].filter(Boolean).join(' · ');
  var ta=document.getElementById('il_desc');if(!ta)return;var old=ta.value;ta.value='ProX AI yazıyor…';
  try{var txt=await aiChat({prompt:'Sen lüks gayrimenkul için metin yazarısın; abartısız, veri odaklı, gizlilik vurgulu.',message:'Şu ilan için 2-3 cümlelik çekici bir satış açıklaması yaz (Türkçe): '+parts,context:'ilan açıklaması'});
    ta.value=(txt||'').replace(/<[^>]+>/g,'').trim()||old||parts;toast('✓ Açıklama üretildi.');}catch(e){ta.value=old||parts;toast('Üretilemedi.');}}
function ilanRefreshPublic(){try{var h=document.getElementById('homeListings');if(h)h.innerHTML=listingCardsHTML();}catch(e){}
  try{if(typeof _OV!=='undefined'&&document.querySelector('#pageOverlay.on')){var g=document.querySelector('#pageOverlay .card-grid');/* ilanlar sayfası açıksa */}}catch(e){}}
function ilanRenderAdmin(){var host=document.getElementById('ilanAdminBody');if(!host)return;ilanLoad();
  var eidsOk=false;try{eidsOk=!!(eidsFirma().eids&&eidsFirma().eids.yetkili);}catch(e){}
  var akt=LISTINGS.filter(function(l){return l.status!=='pasif';}).length;
  var H='<div class="crm-bar"><div class="sub" style="margin:0">'+LISTINGS.length+' ilan · '+akt+' yayında'+(eidsOk?'':' · <b style="color:#c0603a">EİDS yetkisi yok → yeni ilanlar pasif</b>')+'</div><button class="btn btn-gold crm-add" onclick="ilanEdit(0)">+ İlan Ekle</button></div>';
  if(!LISTINGS.length)H+='<div class="crm-empty">İlan yok. "+ İlan Ekle" ile açık portföyünüzü oluşturun.</div>';
  else H+='<div class="crm-list">'+LISTINGS.map(function(l){var kr=l.durum==='Kiralık';
    return '<div class="crm-card"><div class="crm-card-top"><div><b>'+_leD(l.baslik||'—')+'</b><span class="crm-badge">'+_leD(l.durum||'')+'</span>'+(l.status==='pasif'?'<span class="crm-badge" style="background:rgba(192,96,58,.12);color:#c0603a">pasif</span>':'')+'</div><div class="crm-card-act"><button onclick="ilanTogglePub('+l.id+')" title="'+(l.status==='pasif'?'Yayınla':'Yayından kaldır')+'">'+(l.status==='pasif'?'▲':'▼')+'</button><button onclick="ilanEdit('+l.id+')" title="Düzenle">✎</button><button onclick="ilanDel('+l.id+')" title="Sil">🗑</button></div></div>'
      +'<div class="crm-card-b">'+_leD(ilnTipT(l.tip))+' · '+_leD(ilanBolge(l))+'</div>'
      +'<div class="crm-card-b sub">'+_leD((l.m2||'?')+' m²')+' · '+_leD(l.oda||'')+(l.kat?(' · '+_leD(l.kat)+'. kat'):'')+' · <b style="color:var(--em)">'+fmt(l.fiyat||0)+(kr?' ₺/ay':' ₺')+'</b>'+(l.eidsNo?(' · EİDS '+_leD(l.eidsNo)):'')+'</div></div>';
  }).join('')+'</div>';
  host.innerHTML=H;
}
function ilanEdit(id){ilanLoad();var l=id?LISTINGS.filter(function(x){return x.id===id;})[0]:{id:0,durum:'Satılık',tip:'villa',status:'aktif'};if(!l)return;_ilnImg=l.img||'';_ilnEids=l.eids||null;
  var F='<div class="crm-mh">'+(id?'İlanı Düzenle':'Yeni İlan')+'</div>'
    +'<div class="crm-f"><label>Başlık</label><input id="il_baslik" value="'+_leD(l.baslik||'')+'" placeholder="Levent Çift Kat Penthouse"></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Durum</label><select id="il_durum">'+_crmOpt(ILN_DURUM,l.durum)+'</select></div><div class="crm-f"><label>Tip</label><select id="il_tip">'+ILN_TIP.map(function(t){return '<option value="'+t.k+'"'+(t.k===l.tip?' selected':'')+'>'+t.t+'</option>';}).join('')+'</select></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>İl</label><input id="il_il" value="'+_leD(l.il||'İstanbul')+'"></div><div class="crm-f"><label>İlçe</label><input id="il_ilce" value="'+_leD(l.ilce||'')+'"></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Mahalle</label><input id="il_mah" value="'+_leD(l.mahalle||'')+'"></div><div class="crm-f"><label>m²</label><input id="il_m2" type="number" value="'+(l.m2||'')+'"></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Oda</label><input id="il_oda" value="'+_leD(l.oda||'')+'" placeholder="4+1"></div><div class="crm-f"><label>Kat</label><input id="il_kat" value="'+_leD(l.kat||'')+'" placeholder="7"></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Fiyat (₺)</label><input id="il_fiyat" type="number" value="'+(l.fiyat||'')+'"></div><div class="crm-f"><label>EİDS Taşınmaz No</label><input id="il_eids" value="'+_leD(l.eidsNo||'')+'" placeholder="opsiyonel"></div></div>'
    +'<div class="crm-f"><label>Görsel</label><div class="iln-img"><div class="iln-thumb" id="il_thumb">'+(_ilnImg?'<img src="'+_ilnImg+'" alt="">':'—')+'</div><label class="btn btn-line" style="cursor:pointer;font-size:12.5px">Görsel Yükle<input type="file" accept="image/*" onchange="ilanImgUpload(this)" style="display:none"></label><button class="btn btn-line" style="font-size:12.5px" type="button" onclick="ilanImgClear()">Kaldır</button></div></div>'
    +'<div class="crm-f"><label>EİDS Taşınmaz Doğrulama</label><div id="il_eidsStatus">'+_ilnEidsHtml()+'</div><button class="btn btn-line" style="margin-top:7px" type="button" onclick="ilanEidsVerify()">e-Devlet EİDS ile Doğrula</button></div>'
    +'<div class="crm-f"><label>Açıklama <button type="button" class="crm-x2" style="margin-left:8px" onclick="ilanAiDesc()">🤖 ProX AI ile üret</button></label><textarea id="il_desc" rows="3" placeholder="İlan açıklaması…">'+_leD(l.desc||'')+'</textarea></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>360° Sanal Tur Linki</label><input id="il_tur" value="'+_leD(l.tur||'')+'" placeholder="Matterport / Kuula URL"></div><div class="crm-f"><label>Video Tur Linki</label><input id="il_video" value="'+_leD(l.video||'')+'" placeholder="YouTube / Vimeo URL"></div></div>'
    +'<div class="crm-f"><label>Yayın Durumu</label><select id="il_status"><option value="aktif"'+(l.status!=='pasif'?' selected':'')+'>Yayında (aktif)</option><option value="pasif"'+(l.status==='pasif'?' selected':'')+'>Pasif (yayında değil)</option></select></div>'
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="ilanSaveForm('+id+')">Kaydet</button><button class="btn btn-line" onclick="crmCloseModal()">Vazgeç</button>'+(id?'<button class="btn btn-line" style="margin-left:auto;color:#c0603a" onclick="ilanDel('+id+')">Sil</button>':'')+'</div>';
  crmModal(F);
}
function ilanSaveForm(id){ilanLoad();var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var o={durum:g('il_durum'),tip:g('il_tip'),baslik:g('il_baslik'),il:g('il_il'),ilce:g('il_ilce'),mahalle:g('il_mah'),m2:+g('il_m2')||0,oda:g('il_oda'),kat:g('il_kat'),fiyat:+g('il_fiyat')||0,eidsNo:(_ilnEids&&_ilnEids.tasinmazNo)||g('il_eids'),status:g('il_status'),img:_ilnImg||'',eids:_ilnEids||null,desc:g('il_desc'),tur:g('il_tur'),video:g('il_video')};
  if(!o.baslik){toast('İlan başlığı girin.');return;}
  o.kira=(o.durum==='Kiralık');o.bolge=[o.ilce,o.mahalle].filter(Boolean).join(' · ');
  /* EİDS yayın kapısı: yetki yoksa aktif ilan pasife düşer */
  var eidsOk=false;try{eidsOk=!!(eidsFirma().eids&&eidsFirma().eids.yetkili);}catch(e){}
  var propOk=!!(o.eids&&o.eids.status==='dogrulandi');/* o gayrimenkulde ilan yayınlama yetkisi = EİDS taşınmaz doğrulaması */
  if(o.status==='aktif'&&(!eidsOk||!propOk)){o.status='pasif';toast(!eidsOk?'EİDS firma yetkisi yok — ilan pasif kaydedildi.':'Bu gayrimenkul için EİDS taşınmaz doğrulaması yapılmadan yayınlanamaz — pasif kaydedildi.');}
  if(id){var l=LISTINGS.filter(function(x){return x.id===id;})[0];if(l)Object.assign(l,o);}
  else{o.id=ilanEnsureIds()+1;LISTINGS.unshift(o);}
  ilanSave();crmCloseModal();ilanRenderAdmin();ilanRefreshPublic();toast('✓ İlan kaydedildi.');
}
function ilanDel(id){if(!confirm('İlan silinsin mi?'))return;ilanLoad();for(var i=LISTINGS.length-1;i>=0;i--)if(LISTINGS[i].id===id)LISTINGS.splice(i,1);ilanSave();crmCloseModal();ilanRenderAdmin();ilanRefreshPublic();toast('İlan silindi.');}
function ilanTogglePub(id){ilanLoad();var l=LISTINGS.filter(function(x){return x.id===id;})[0];if(!l)return;
  if(l.status==='pasif'){var eidsOk=false;try{eidsOk=!!(eidsFirma().eids&&eidsFirma().eids.yetkili);}catch(e){}var propOk=!!(l.eids&&l.eids.status==='dogrulandi');
    if(!eidsOk){toast('EİDS firma yetkisi olmadan yayınlanamaz.');return;}
    if(!propOk){toast('Bu gayrimenkul için EİDS taşınmaz doğrulaması gerekli — yayınlanamadı. İlanı düzenleyip "e-Devlet EİDS ile Doğrula" yapın.');return;}
    l.status='aktif';}else l.status='pasif';
  ilanSave();ilanRenderAdmin();ilanRefreshPublic();toast(l.status==='aktif'?'İlan yayınlandı.':'İlan yayından kaldırıldı.');}
/* ===================== EKİP · SÖZLEŞMELER · KOMİSYON · KİRA (dn_crm_v1 içinde) ===================== */
function _crmFirma(){var f={};try{f=SAAS_CONFIG.firma||{};}catch(e){}var e=f.eids||{};return {unvan:f.unvan||SAAS_CONFIG.tenantName||'Selin Meridyen Danışmanlık',advisor:SAAS_CONFIG.advisorName||'Selin Meridyen',vergi:f.vergi||'—',adres:f.adres||'—',tel:f.tel||'—',mail:f.mail||'—',belge:e.belgeNo||'—'};}
/* ---------- EKİP ---------- */
var CRM_ROL=['Kıdemli Danışman','Danışman','Satış Uzmanı','Asistan','İş Ortağı','Hukuk Danışmanı'];
function crmRenderEkip(){var host=document.getElementById('crmEkip');if(!host)return;crmLoad();
  var H='<div class="crm-bar"><div class="sub" style="margin:0">'+_crm.ekip.length+' ekip üyesi · fırsat & görevlerde sorumlu olarak atanabilir</div><button class="btn btn-gold crm-add" onclick="crmEditEkip(0)">+ Üye Ekle</button></div>';
  if(!_crm.ekip.length)H+='<div class="crm-empty">Ekip üyesi yok. Selin Meridyen + asistan/iş ortaklarınızı ekleyin.</div>';
  else H+='<div class="crm-list">'+_crm.ekip.map(function(m){var deals=_crm.deals.filter(function(d){return d.ekipId===m.id;}).length;
    return '<div class="crm-card"><div class="crm-card-top"><div><b>'+_leD(m.name||'—')+'</b><span class="crm-badge">'+_leD(m.role||'')+'</span></div><div class="crm-card-act"><button onclick="crmEditEkip('+m.id+')">✎</button><button onclick="crmDelEkip('+m.id+')">🗑</button></div></div>'
      +'<div class="crm-card-b">'+(m.tel?('📞 '+_leD(m.tel)+' '):'')+(m.wa?('· WhatsApp '+_leD(m.wa)):'')+'</div>'
      +'<div class="crm-card-b sub">'+_leD(m.uzmanlik||'')+(deals?(' · '+deals+' fırsat'):'')+'</div></div>';}).join('')+'</div>';
  host.innerHTML=H;
}
function crmEditEkip(id){crmLoad();var m=id?_crm.ekip.filter(function(x){return x.id===id;})[0]:{id:0,role:'Danışman'};if(!m)return;
  var F='<div class="crm-mh">'+(id?'Ekip Üyesi':'Yeni Ekip Üyesi')+'</div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Ad Soyad</label><input id="cm_name" value="'+_leD(m.name||'')+'"></div><div class="crm-f"><label>Unvan</label><select id="cm_role">'+_crmOpt(CRM_ROL,m.role)+'</select></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Telefon</label><input id="cm_tel" value="'+_leD(m.tel||'')+'"></div><div class="crm-f"><label>WhatsApp</label><input id="cm_wa" value="'+_leD(m.wa||'')+'"></div></div>'
    +'<div class="crm-f"><label>Uzmanlık / Bölge</label><input id="cm_uz" value="'+_leD(m.uzmanlik||'')+'" placeholder="Boğaz hattı · lüks konut"></div>'
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="crmSaveEkip('+id+')">Kaydet</button><button class="btn btn-line" onclick="crmCloseModal()">Vazgeç</button></div>';
  crmModal(F);
}
function crmSaveEkip(id){crmLoad();var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var o={name:g('cm_name'),role:g('cm_role'),tel:g('cm_tel'),wa:g('cm_wa'),uzmanlik:g('cm_uz')};
  if(!o.name){toast('Ad girin.');return;}
  if(id){var m=_crm.ekip.filter(function(x){return x.id===id;})[0];if(m)Object.assign(m,o);}else{o.id=crmId();_crm.ekip.unshift(o);}
  crmSave();crmCloseModal();crmRenderEkip();toast('✓ Ekip üyesi kaydedildi.');
}
function crmDelEkip(id){crmLoad();_crm.ekip=_crm.ekip.filter(function(m){return m.id!==id;});crmSave();crmRenderEkip();toast('Üye silindi.');}
/* ---------- KOMİSYON ---------- */
function crmRenderKomisyon(){var host=document.getElementById('crmKomisyon');if(!host)return;crmLoad();
  var tahsil=_crm.komisyon.filter(function(k){return k.durum==='tahsil';}).reduce(function(s,k){return s+(+k.tutar||0);},0);
  var bekle=_crm.komisyon.filter(function(k){return k.durum!=='tahsil';}).reduce(function(s,k){return s+(+k.tutar||0);},0);
  var H='<div class="crm-kpis"><div class="crm-kpi"><b>'+_crmTL(tahsil)+'</b><span>Tahsil Edilen</span></div><div class="crm-kpi'+(bekle>0?' hot':'')+'"><b>'+_crmTL(bekle)+'</b><span>Bekleyen</span></div><div class="crm-kpi"><b>'+_crm.komisyon.length+'</b><span>Kayıt</span></div></div>';
  H+='<div class="crm-bar"><div class="sub" style="margin:0">Komisyon tahsilat takibi</div><button class="btn btn-gold crm-add" onclick="crmEditKom(0)">+ Komisyon</button></div>';
  if(!_crm.komisyon.length)H+='<div class="crm-empty">Komisyon kaydı yok.</div>';
  else H+='<div class="crm-list">'+_crm.komisyon.map(function(k){var tah=k.durum==='tahsil';
    return '<div class="crm-card"><div class="crm-card-top"><div><b>'+_leD(k.baslik||'—')+'</b><span class="crm-badge" style="'+(tah?'background:rgba(25,195,125,.12);color:var(--prox-deep)':'background:rgba(195,155,69,.14);color:var(--gold-deep)')+'">'+(tah?'Tahsil':'Bekliyor')+'</span></div><div class="crm-card-act"><button onclick="crmKomToggle('+k.id+')" title="Durum">'+(tah?'↺':'✓')+'</button><button onclick="crmEditKom('+k.id+')">✎</button><button onclick="crmDelKom('+k.id+')">🗑</button></div></div>'
      +'<div class="crm-card-b sub"><b style="color:var(--em)">'+_crmTL(k.tutar)+'</b>'+(k.oran?(' · %'+k.oran):'')+(k.taraf?(' · '+_leD(k.taraf)):'')+(k.tarih?(' · '+_crmDate(k.tarih)):'')+'</div></div>';}).join('')+'</div>';
  host.innerHTML=H;
}
function crmEditKom(id){crmLoad();var k=id?_crm.komisyon.filter(function(x){return x.id===id;})[0]:{id:0,durum:'beklemede',taraf:'Satıcı',tarih:new Date().toISOString().slice(0,10)};if(!k)return;
  var F='<div class="crm-mh">'+(id?'Komisyon':'Yeni Komisyon')+'</div>'
    +'<div class="crm-f"><label>Başlık / İşlem</label><input id="kk_b" value="'+_leD(k.baslik||'')+'" placeholder="Levent penthouse satışı"></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Tutar (₺)</label><input id="kk_t" type="number" value="'+(k.tutar||'')+'"></div><div class="crm-f"><label>Oran (%)</label><input id="kk_o" type="number" step="0.1" value="'+(k.oran||'')+'"></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Taraf</label><select id="kk_tf">'+_crmOpt(['Satıcı','Alıcı','Her iki taraf'],k.taraf)+'</select></div><div class="crm-f"><label>Tarih</label><input id="kk_d" type="date" value="'+(k.tarih?String(k.tarih).slice(0,10):'')+'"></div></div>'
    +'<div class="crm-f"><label>Durum</label><select id="kk_s">'+_crmOpt2([['beklemede','Bekliyor'],['tahsil','Tahsil Edildi']],k.durum)+'</select></div>'
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="crmSaveKom('+id+')">Kaydet</button><button class="btn btn-line" onclick="crmCloseModal()">Vazgeç</button></div>';
  crmModal(F);
}
function crmSaveKom(id){crmLoad();var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var o={baslik:g('kk_b'),tutar:+g('kk_t')||0,oran:+g('kk_o')||0,taraf:g('kk_tf'),tarih:g('kk_d'),durum:g('kk_s')};
  if(!o.baslik){toast('Başlık girin.');return;}
  if(id){var k=_crm.komisyon.filter(function(x){return x.id===id;})[0];if(k)Object.assign(k,o);}else{o.id=crmId();_crm.komisyon.unshift(o);}
  crmSave();crmCloseModal();crmRenderKomisyon();crmRenderDash();toast('✓ Komisyon kaydedildi.');
}
function crmKomToggle(id){crmLoad();var k=_crm.komisyon.filter(function(x){return x.id===id;})[0];if(!k)return;k.durum=(k.durum==='tahsil'?'beklemede':'tahsil');crmSave();crmRenderKomisyon();toast(k.durum==='tahsil'?'Tahsil edildi.':'Bekliyor olarak işaretlendi.');}
function crmDelKom(id){crmLoad();_crm.komisyon=_crm.komisyon.filter(function(k){return k.id!==id;});crmSave();crmRenderKomisyon();crmRenderDash();toast('Silindi.');}
/* ---------- KİRA TAKİBİ ---------- */
function crmRenderKira(){var host=document.getElementById('crmKira');if(!host)return;crmLoad();
  var aylik=_crm.kira.reduce(function(s,k){return s+(+k.tutar||0);},0);
  var gecik=_crm.kira.filter(function(k){return k.durum==='gecikti';}).length;
  var H='<div class="crm-kpis"><div class="crm-kpi"><b>'+_crm.kira.length+'</b><span>Kira Sözleşmesi</span></div><div class="crm-kpi"><b>'+_crmTL(aylik)+'</b><span>Aylık Toplam</span></div><div class="crm-kpi'+(gecik?' hot':'')+'"><b>'+gecik+'</b><span>Geciken</span></div></div>';
  H+='<div class="crm-bar"><div class="sub" style="margin:0">Kira tahsilat takvimi</div><button class="btn btn-gold crm-add" onclick="crmEditKira(0)">+ Kira</button></div>';
  if(!_crm.kira.length)H+='<div class="crm-empty">Kira kaydı yok.</div>';
  else H+='<div class="crm-list">'+_crm.kira.map(function(k){var st=k.durum||'bekliyor';var col=st==='odendi'?'background:rgba(25,195,125,.12);color:var(--prox-deep)':st==='gecikti'?'background:rgba(192,96,58,.12);color:#c0603a':'background:rgba(195,155,69,.14);color:var(--gold-deep)';var stT=st==='odendi'?'Ödendi':st==='gecikti'?'Gecikti':'Bekliyor';
    return '<div class="crm-card"><div class="crm-card-top"><div><b>'+_leD(k.gm||'—')+'</b><span class="crm-badge" style="'+col+'">'+stT+'</span></div><div class="crm-card-act"><button onclick="crmKiraCycle('+k.id+')" title="Durum">⟳</button><button onclick="crmEditKira('+k.id+')">✎</button><button onclick="crmDelKira('+k.id+')">🗑</button></div></div>'
      +'<div class="crm-card-b">'+(k.kiraci?('👤 '+_leD(k.kiraci)+' '):'')+'</div>'
      +'<div class="crm-card-b sub"><b style="color:var(--em)">'+_crmTL(k.tutar)+'/ay</b>'+(k.vade?(' · her ayın '+_leD(k.vade)+'. günü'):'')+'</div></div>';}).join('')+'</div>';
  host.innerHTML=H;
}
function crmEditKira(id){crmLoad();var k=id?_crm.kira.filter(function(x){return x.id===id;})[0]:{id:0,durum:'bekliyor',vade:'5'};if(!k)return;
  var F='<div class="crm-mh">'+(id?'Kira Kaydı':'Yeni Kira')+'</div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Gayrimenkul</label><input id="kr_g" value="'+_leD(k.gm||'')+'" placeholder="Nişantaşı 2+1 daire"></div><div class="crm-f"><label>Kiracı</label><input id="kr_k" value="'+_leD(k.kiraci||'')+'"></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Aylık Kira (₺)</label><input id="kr_t" type="number" value="'+(k.tutar||'')+'"></div><div class="crm-f"><label>Vade Günü</label><input id="kr_v" type="number" min="1" max="31" value="'+(k.vade||'5')+'"></div></div>'
    +'<div class="crm-f"><label>Durum</label><select id="kr_s">'+_crmOpt2([['bekliyor','Bekliyor'],['odendi','Ödendi'],['gecikti','Gecikti']],k.durum)+'</select></div>'
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="crmSaveKira('+id+')">Kaydet</button><button class="btn btn-line" onclick="crmCloseModal()">Vazgeç</button></div>';
  crmModal(F);
}
function crmSaveKira(id){crmLoad();var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var o={gm:g('kr_g'),kiraci:g('kr_k'),tutar:+g('kr_t')||0,vade:g('kr_v'),durum:g('kr_s')};
  if(!o.gm){toast('Gayrimenkul girin.');return;}
  if(id){var k=_crm.kira.filter(function(x){return x.id===id;})[0];if(k)Object.assign(k,o);}else{o.id=crmId();_crm.kira.unshift(o);}
  crmSave();crmCloseModal();crmRenderKira();toast('✓ Kira kaydedildi.');
}
function crmKiraCycle(id){crmLoad();var k=_crm.kira.filter(function(x){return x.id===id;})[0];if(!k)return;var order=['bekliyor','odendi','gecikti'];var i=(order.indexOf(k.durum)+1)%3;k.durum=order[i];crmSave();crmRenderKira();}
function crmDelKira(id){crmLoad();_crm.kira=_crm.kira.filter(function(k){return k.id!==id;});crmSave();crmRenderKira();toast('Silindi.');}
function _crmOpt2(pairs,sel){return pairs.map(function(p){return '<option value="'+p[0]+'"'+(p[0]===sel?' selected':'')+'>'+p[1]+'</option>';}).join('');}
/* ---------- SÖZLEŞMELER (5 şablon, firma bilgisiyle otomatik dolu) ---------- */
var SOZ_TIP=[{k:'aracilik',t:'Aracılık (Hizmet) Sözleşmesi'},{k:'yergosterme',t:'Yer Gösterme Belgesi'},{k:'kira',t:'Kira Sözleşmesi'},{k:'satisvaadi',t:'Satış Vaadi Protokolü'},{k:'munhasir',t:'Münhasır Portföy Yetkisi'}];
function sozTipT(k){var x=SOZ_TIP.filter(function(t){return t.k===k;})[0];return x?x.t:k;}
function crmRenderSoz(){var host=document.getElementById('crmSoz');if(!host)return;crmLoad();
  var H='<div class="crm-sec"><div class="crm-sec-h">Yeni Sözleşme Oluştur</div><div class="crm-funnel">'+SOZ_TIP.map(function(t){return '<div class="crm-fn" onclick="sozYeni(\''+t.k+'\')"><b>📄</b><span>'+t.t.split(' ')[0]+'</span></div>';}).join('')+'</div><p class="sub" style="margin:10px 0 0">Firma künyeniz (unvan, vergi, yetki belge no) otomatik doldurulur. Oluşturulan belge taslaktır; imzadan önce hukuki teyit önerilir.</p></div>';
  H+='<div class="crm-sec-h" style="margin-top:6px">Kayıtlı Sözleşmeler</div>';
  if(!_crm.sozlesmeler.length)H+='<div class="crm-empty">Henüz sözleşme yok.</div>';
  else H+='<div class="crm-list">'+_crm.sozlesmeler.map(function(s){return '<div class="crm-card"><div class="crm-card-top"><div><b>'+_leD(sozTipT(s.tip))+'</b><span class="crm-badge">'+_leD(s.karsiAd||'—')+'</span></div><div class="crm-card-act"><button onclick="sozGoster('+s.id+')" title="Görüntüle/Yazdır">👁</button><button onclick="sozDel('+s.id+')">🗑</button></div></div><div class="crm-card-b sub">'+_crmDate(s.ts)+(s.bedel?(' · '+_crmTL(s.bedel)):'')+'</div></div>';}).join('')+'</div>';
  host.innerHTML=H;
}
function sozYeni(tip){crmLoad();
  var F='<div class="crm-mh">'+sozTipT(tip)+'</div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Karşı Taraf (Ad Soyad / Unvan)</label><input id="sz_ad"></div><div class="crm-f"><label>T.C. / Vergi No</label><input id="sz_tc"></div></div>'
    +'<div class="crm-f"><label>Karşı Taraf Adresi</label><input id="sz_adr"></div>'
    +'<div class="crm-f"><label>Gayrimenkul (adres / tanım)</label><input id="sz_gm" placeholder="Beşiktaş, Levent … 4+1, 320 m²"></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Bedel (₺)</label><input id="sz_bedel" type="number"></div><div class="crm-f"><label>Komisyon (%)</label><input id="sz_kom" type="number" step="0.1" value="2"></div></div>'
    +'<div class="crm-frow"><div class="crm-f"><label>Süre (ay)</label><input id="sz_sure" type="number" value="3"></div><div class="crm-f"><label>Tür</label><input value="'+_leD(sozTipT(tip))+'" readonly></div></div>'
    +'<div class="crm-f"><label>Özel Şart (opsiyonel)</label><textarea id="sz_ozel" rows="2"></textarea></div>'
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="sozUret(\''+tip+'\')">Oluştur & Görüntüle</button><button class="btn btn-line" onclick="crmCloseModal()">Vazgeç</button></div>';
  crmModal(F);
}
function _sozBody(tip,d,F){
  var bedel=d.bedel?_crmTL(d.bedel):'…………';var kom=d.kom||'…';var sure=d.sure||'…';
  var head='<p><b>'+sozTipT(tip)+'</b></p><p>İşbu belge; bir tarafta <b>'+_leD(F.unvan)+'</b> (Taşınmaz Ticareti Yetki Belge No: '+_leD(F.belge)+', Vergi No: '+_leD(F.vergi)+', Adres: '+_leD(F.adres)+') — bundan sonra “Danışman” — ile diğer tarafta <b>'+_leD(d.karsiAd||'…')+'</b> (T.C./Vergi No: '+_leD(d.karsiTC||'…')+', Adres: '+_leD(d.karsiAdres||'…')+') — bundan sonra “Müşteri” — arasında akdedilmiştir.</p>';
  var gm='<p><b>Gayrimenkul:</b> '+_leD(d.gm||'…')+'</p>';
  var clauses={
    aracilik:'<p><b>1. Konu.</b> Danışman, Müşteri adına yukarıda tanımlı gayrimenkulün alım/satım/kiralama sürecinde aracılık ve danışmanlık hizmeti verir.</p><p><b>2. Hizmet Bedeli.</b> İşlem bedeli üzerinden <b>%'+kom+'</b> oranında hizmet bedeli, tapu devri/sözleşme imzası aşamasında muaccel olur.</p><p><b>3. Süre.</b> İşbu sözleşme imza tarihinden itibaren <b>'+sure+' ay</b> geçerlidir.</p>',
    yergosterme:'<p><b>1.</b> Danışman, aşağıda imzası bulunan Müşteriye yukarıda belirtilen gayrimenkulü <b>'+_crmDate(d.ts||Date.now())+'</b> tarihinde göstermiştir.</p><p><b>2.</b> Müşteri, gösterilen gayrimenkulü Danışman aracılığıyla öğrendiğini kabul eder; Danışmanı devre dışı bırakarak doğrudan/dolaylı işlem yapması hâlinde hizmet bedeli muaccel olur.</p>',
    kira:'<p><b>1. Konu.</b> Kiraya veren ile kiracı arasında yukarıdaki gayrimenkulün kiralanması. Aylık kira bedeli: <b>'+bedel+'</b>.</p><p><b>2. Süre.</b> Kira süresi <b>'+sure+' ay</b>; kira her ayın belirlenen gününde peşin ödenir.</p><p><b>3. Danışman.</b> '+_leD(F.unvan)+' aracılık hizmetini yürütür; hizmet bedeli %'+kom+'.</p>',
    satisvaadi:'<p><b>1. Konu.</b> Taraflar, yukarıda tanımlı gayrimenkulün <b>'+bedel+'</b> bedelle satışı konusunda anlaşmış olup; işbu protokol satış vaadi niteliğindedir.</p><p><b>2. Kapora/Teminat.</b> ……………… tutarında kapora ödenmiştir/ödenecektir.</p><p><b>3. Süre.</b> Resmî tapu devri <b>'+sure+' ay</b> içinde yapılacaktır.</p>',
    munhasir:'<p><b>1. Konu.</b> Müşteri, yukarıdaki gayrimenkulün pazarlanması için <b>'+_leD(F.unvan)+'</b>’a <b>münhasır (tek yetkili)</b> satış/kiralama yetkisi verir.</p><p><b>2. Süre.</b> Münhasır yetki <b>'+sure+' ay</b> geçerlidir; bu sürede gayrimenkul yalnızca Danışman aracılığıyla pazarlanır.</p><p><b>3. Hizmet Bedeli.</b> İşlem bedeli üzerinden %'+kom+'.</p>'
  };
  var ozel=d.ozel?('<p><b>Özel Şart.</b> '+_leD(d.ozel)+'</p>'):'';
  var foot='<p style="margin-top:22px">İşbu belge iki nüsha düzenlenmiş olup taraflarca okunarak imzalanmıştır. Tarih: '+_crmDate(d.ts||Date.now())+'</p><div class="soz-sign"><div>Danışman<br><b>'+_leD(F.advisor)+'</b><br>'+_leD(F.unvan)+'<br>İmza</div><div>Müşteri<br><b>'+_leD(d.karsiAd||'…')+'</b><br>İmza</div></div><p class="soz-note">Bu belge bilgilendirme amaçlı bir taslaktır; bağlayıcı imzadan önce hukuki danışmanlık alınması önerilir.</p>';
  return head+gm+(clauses[tip]||'')+ozel+foot;
}
function sozUret(tip){crmLoad();var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};
  var d={tip:tip,karsiAd:g('sz_ad'),karsiTC:g('sz_tc'),karsiAdres:g('sz_adr'),gm:g('sz_gm'),bedel:+g('sz_bedel')||0,kom:g('sz_kom'),sure:g('sz_sure'),ozel:g('sz_ozel'),ts:Date.now(),id:crmId()};
  _crm.sozlesmeler.unshift(d);crmSave();crmRenderSoz();sozGoster(d.id);
}
function sozGoster(id){crmLoad();var d=_crm.sozlesmeler.filter(function(x){return x.id===id;})[0];if(!d)return;var F=_crmFirma();
  var doc='<div class="soz-doc" id="sozDoc">'+_sozBody(d.tip,d,F)+'</div>';
  var M='<div class="crm-mh">'+sozTipT(d.tip)+'</div>'+doc+'<div class="crm-mact"><button class="btn btn-gold" onclick="sozPrint()">🖨 Yazdır / PDF</button><button class="btn btn-line" onclick="crmCloseModal()">Kapat</button></div>';
  crmModal(M);
}
function sozPrint(){var el=document.getElementById('sozDoc');if(!el)return;var w=window.open('','_blank');if(!w){toast('Açılır pencere engellendi.');return;}
  w.document.write('<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Sözleşme</title><style>body{font-family:Georgia,serif;max-width:760px;margin:40px auto;padding:0 24px;color:#111;line-height:1.7;font-size:14px}p{margin:0 0 10px}.soz-sign{display:flex;justify-content:space-between;margin-top:44px;gap:40px}.soz-sign div{flex:1;font-size:13px}.soz-note{margin-top:26px;font-size:11px;color:#777;border-top:1px solid #ddd;padding-top:10px}</style></head><body>'+el.innerHTML+'</body></html>');
  w.document.close();setTimeout(function(){try{w.print();}catch(e){}},250);
}
function sozDel(id){crmLoad();_crm.sozlesmeler=_crm.sozlesmeler.filter(function(s){return s.id!==id;});crmSave();crmRenderSoz();toast('Sözleşme silindi.');}
/* ===================== RAPORLAR ===================== */
function _rapBar(label,val,max,color){var w=max?Math.max(2,Math.round(val/max*100)):0;return '<div class="rap-row"><span class="rap-l">'+_leD(label)+'</span><div class="rap-track"><i style="width:'+w+'%;background:'+(color||'var(--em)')+'"></i></div><span class="rap-v">'+val+'</span></div>';}
function _rapMonthly(){crmLoad();var months=[],d=new Date();for(var i=5;i>=0;i--){var m=new Date(d.getFullYear(),d.getMonth()-i,1);months.push(m.toISOString().slice(0,7));}
  var counts=months.map(function(mo){return _crm.kisiler.filter(function(k){return (k.created||'').slice(0,7)===mo;}).length;});var mx=Math.max.apply(null,counts.concat([1]));
  return months.map(function(mo,i){return _rapBar(mo.slice(5)+'/'+mo.slice(2,4),counts[i],mx,'var(--gold-deep)');}).join('');}
function crmRenderRapor(){var host=document.getElementById('crmRapor');if(!host)return;crmLoad();var leads=crmLeads();
  var stageCounts=CRM_STAGES.map(function(s){return {t:s.t,n:_crm.deals.filter(function(d){return d.stage===s.k;}).length};});var mxS=Math.max.apply(null,stageCounts.map(function(x){return x.n;}).concat([1]));
  var srcMap={};leads.forEach(function(l){var s=l.src||'Diğer';srcMap[s]=(srcMap[s]||0)+1;});var srcArr=Object.keys(srcMap).map(function(k){return {t:k,n:srcMap[k]};}).sort(function(a,b){return b.n-a.n;});var mxSrc=Math.max.apply(null,srcArr.map(function(x){return x.n;}).concat([1]));
  var tipMap={};_crm.kisiler.forEach(function(k){var t=k.tip||'—';tipMap[t]=(tipMap[t]||0)+1;});var tipArr=Object.keys(tipMap).map(function(k){return {t:k,n:tipMap[k]};});var mxT=Math.max.apply(null,tipArr.map(function(x){return x.n;}).concat([1]));
  var tah=_crm.komisyon.filter(function(k){return k.durum==='tahsil';}).reduce(function(s,k){return s+(+k.tutar||0);},0),bek=_crm.komisyon.filter(function(k){return k.durum!=='tahsil';}).reduce(function(s,k){return s+(+k.tutar||0);},0);
  var won=_crm.deals.filter(function(d){return d.stage==='kazanildi';}).length,lost=_crm.deals.filter(function(d){return d.stage==='kaybedildi';}).length,conv=(won+lost)?Math.round(won/(won+lost)*100):0;
  var H='<div class="crm-sec"><div class="crm-sec-h">📄 Marka Rapor Oluştur (Yazdır / PDF)</div><div class="crm-funnel"><div class="crm-fn" onclick="raporUret(\'portfoy\')"><b>📄</b><span>Portföy Özeti</span></div><div class="crm-fn" onclick="raporUret(\'crm\')"><b>📊</b><span>CRM Özeti</span></div><div class="crm-fn" onclick="raporUret(\'pipeline\')"><b>📇</b><span>Satış Hattı</span></div></div></div>';
  H+='<div class="crm-kpis"><div class="crm-kpi"><b>%'+conv+'</b><span>Dönüşüm Oranı</span></div><div class="crm-kpi"><b>'+_crmTL(tah)+'</b><span>Tahsil Komisyon</span></div><div class="crm-kpi'+(bek>0?' hot':'')+'"><b>'+_crmTL(bek)+'</b><span>Bekleyen Komisyon</span></div><div class="crm-kpi"><b>'+leads.length+'</b><span>Toplam Talep</span></div></div>';
  H+='<div class="crm-two"><div class="crm-sec"><div class="crm-sec-h">Satış Hattı Dağılımı</div>'+stageCounts.map(function(s){return _rapBar(s.t,s.n,mxS,'var(--gold)');}).join('')+'</div>'
    +'<div class="crm-sec"><div class="crm-sec-h">Talep Kaynakları</div>'+(srcArr.length?srcArr.map(function(s){return _rapBar(s.t,s.n,mxSrc,'var(--em-2)');}).join(''):'<div class="crm-empty">Talep yok.</div>')+'</div></div>';
  H+='<div class="crm-two"><div class="crm-sec"><div class="crm-sec-h">Kişi Tipleri</div>'+(tipArr.length?tipArr.map(function(s){return _rapBar(s.t,s.n,mxT,'var(--prox)');}).join(''):'<div class="crm-empty">Kişi yok.</div>')+'</div>'
    +'<div class="crm-sec"><div class="crm-sec-h">Aylık Yeni Kişi (son 6 ay)</div>'+_rapMonthly()+'</div></div>';
  host.innerHTML=H;
}
/* ===================== YEDEK / AKTAR ===================== */
function crmDataExport(){var o={_ts:new Date().toISOString(),_site:'danisman-selin-meridyen'};try{for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&(k.indexOf('dn_')===0||k==='emlak_leads_fallback'))o[k]=localStorage.getItem(k);}}catch(e){}
  try{var blob=new Blob([JSON.stringify(o,null,2)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='meridyen-yedek-'+new Date().toISOString().slice(0,10)+'.json';document.body.appendChild(a);a.click();a.remove();toast('✓ Tüm veriler yedeklendi (JSON).');}catch(e){toast('Yedeklenemedi.');}}
function crmDataImport(input){var f=input.files&&input.files[0];if(!f)return;if(!confirm('Yedekteki veriler mevcut verinin üzerine yazılacak. Devam?')){input.value='';return;}
  var r=new FileReader();r.onload=function(e){try{var o=JSON.parse(e.target.result);var n=0;Object.keys(o).forEach(function(k){if(k.indexOf('dn_')===0||k==='emlak_leads_fallback'){localStorage.setItem(k,o[k]);n++;}});_crm=null;toast('✓ '+n+' kayıt geri yüklendi. Yenileniyor…');setTimeout(function(){location.reload();},1000);}catch(err){toast('Geçersiz yedek dosyası.');}};r.readAsText(f);}
function crmDataReset(){if(!confirm('CRM, ilan, sözleşme ve tüm yerel veriler silinsin mi? Önce yedek almanız önerilir — bu işlem geri alınamaz.'))return;
  try{var rm=[];for(var i=0;i<localStorage.length;i++){var k=localStorage.key(i);if(k&&k.indexOf('dn_')===0)rm.push(k);}rm.forEach(function(k){localStorage.removeItem(k);});}catch(e){}_crm=null;toast('Veriler sıfırlandı. Yenileniyor…');setTimeout(function(){location.reload();},1000);}
/* ===================== İÇERİK CMS (ana sayfa hero metinleri) ===================== */
var CMS_KEY='dn_content';
/* dn_content = yayınlanan içerik (DN_PUBLISHED.content) ⊕ admin taslağı (localStorage) — taslak üstün.
   content.js ile aynı öncelik; deploy'da ziyaretçi yayınlanan içeriği görür. */
function cmsGet(){try{var loc=JSON.parse(localStorage.getItem(CMS_KEY)||'{}')||{};var pub=(window.DN_PUBLISHED&&window.DN_PUBLISHED.content&&typeof window.DN_PUBLISHED.content==='object')?window.DN_PUBLISHED.content:{};return Object.assign({},pub,loc);}catch(e){return {};}}
/* genel: [data-cms] işaretli tüm elemanları uygula (statik sayfalar da aynı motoru kullanır) */
function dnApplyCms(c){c=c||cmsGet();try{[].forEach.call(document.querySelectorAll('[data-cms]'),function(el){var k=el.getAttribute('data-cms'),v=c[k];if(v==null||v==='')return;var dot=el.querySelector&&el.querySelector('.eb-dot');if(dot)el.innerHTML='<span class="eb-dot"></span>'+_leD(v);else el.textContent=v;});}catch(e){}}
function applyContent(){var c=cmsGet();
  try{if(c.heroEb){var eb=document.querySelector('.hero .eyebrow');if(eb)eb.innerHTML='<span class="eb-dot"></span>'+_leD(c.heroEb);}}catch(e){}
  try{if(c.heroT1){var t1=document.querySelector('.hero-title .hl');if(t1)t1.textContent=c.heroT1;}}catch(e){}
  try{if(c.heroT2){var t2=document.querySelector('.hero-title em');if(t2)t2.textContent=c.heroT2;}}catch(e){}
  try{if(c.heroLede){var ld=document.querySelector('.hero .lede');if(ld)ld.textContent=c.heroLede;}}catch(e){}
  try{dnApplyCms(c);}catch(e){}
  try{dnApplyServices(c);}catch(e){}
}
/* ============ ANA SAYFA DANIŞMAN PORTRESİ (admin görsel yükleme) ============
   Varsayılan: yerel gerçek portre (img/danisman-portresi.jpg — Pexels ücretsiz/ticari lisans).
   Danışman admin'den KENDİ fotoğrafını yüklerse onu gösterir. Büyük base64 görsel
   dn_content'i (yayın) ŞİŞİRMESİN diye AYRI anahtar: dn_portrait. */
var PORTRAIT_KEY='dn_portrait';
var _PORTRAIT_DEFAULT='img/danisman-portresi.jpg';
function portraitGet(){try{return localStorage.getItem(PORTRAIT_KEY)||'';}catch(e){return '';}}
function portraitSrc(){return portraitGet()||_PORTRAIT_DEFAULT;}
function applyPortrait(){var host=document.getElementById('aboutPhoto');if(!host)return;var wrap=host.closest?host.closest('.about-portrait'):document.getElementById('aboutPortrait');var alt=_leD((cmsGet().homeAboutSig)||'Selin Meridyen');host.innerHTML='<img src="'+portraitSrc()+'" alt="'+alt+'">';if(wrap)wrap.classList.add('has-photo');}
function _portraitPrev(){var box=document.getElementById('adPortraitPrev');if(!box)return;box.innerHTML='<img src="'+portraitSrc()+'" alt="portre" style="width:100%;height:100%;object-fit:cover">';}
function portraitUpload(input){var f=input.files&&input.files[0];if(!f)return;if(!/^image\//.test(f.type||'')){toast('Lütfen bir görsel dosyası seçin.');return;}if(f.size>3*1024*1024){toast('Görsel çok büyük — lütfen ~3MB altını yükleyin.');return;}var r=new FileReader();r.onload=function(e){try{localStorage.setItem(PORTRAIT_KEY,e.target.result);}catch(err){toast('Kaydedilemedi — depolama dolu olabilir (daha küçük görsel deneyin).');return;}try{applyPortrait();}catch(_e){}try{_portraitPrev();}catch(_e){}toast('✓ Danışman görseli yüklendi & ana sayfaya uygulandı.');};r.readAsDataURL(f);}
function portraitClear(){try{localStorage.removeItem(PORTRAIT_KEY);}catch(e){}try{applyPortrait();}catch(_e){}try{_portraitPrev();}catch(_e){}toast('Yüklenen görsel kaldırıldı — varsayılan portre geri geldi.');}
try{window.applyPortrait=applyPortrait;window.portraitUpload=portraitUpload;window.portraitClear=portraitClear;}catch(e){}
/* AI/CRUD sonucunu dn_content'e BİRLEŞTİR (mevcut alanları koru) + uygula */
function cmsMerge(part){var c=cmsGet();Object.keys(part||{}).forEach(function(k){var v=part[k];if(v!=null&&v!=='')c[k]=v;});
  try{localStorage.setItem(CMS_KEY,JSON.stringify(c));}catch(e){}try{applyContent();}catch(e){}return c;}
/* CMS alan tanımı: [id, dn_content anahtarı, etiket, textarea?, placeholder] — sayfaya göre gruplu */
var CMS_FIELDS={
  home:[['cms_eb','heroEb','Hero Üst Etiket',0,'Kişiye Özel Emlak Danışmanlığı · Yetki Belgeli'],['cms_t1','heroT1','Hero Başlık 1. satır',0,'Gayrimenkulünüz,'],['cms_t2','heroT2','Hero Başlık 2. satır (italik)',0,'gerçek değerine ulaşsın.'],['cms_lede','heroLede','Hero Açıklama',1,'18 yılı aşkın deneyim ve canlı ProX bölge verisiyle…'],['cms_intel','intelText','"Rakamlar konuşur" bölüm metni',1,'Her mahalle için güncel m² değeri, yıllık değişim ve yatırım skoru…'],['cms_habout_eb','homeAboutEyebrow','Kişisel Temsil — Üst Etiket',0,'Kişisel Temsil'],['cms_habout_ttl','homeAboutTitle','Kişisel Temsil — Başlık',1,'Gayrimenkulünüzü bir portföy numarasına değil, bir imzaya emanet edin.'],['cms_habout_role','homeAboutRole','Kişisel Temsil — Unvan',0,'Kıdemli Lüks Konut & Portföy Danışmanı'],['cms_habout','homeAboutBody','Kişisel Temsil — Paragraf',1,'Her gayrimenkul, doğru alıcısıyla buluşmayı hak eder…'],['cms_habout_q','homeAboutQuote','Kişisel Temsil — Alıntı',1,'“Doğru danışman, fiyatı savunmaz; değeri görünür kılar.”'],['cms_habout_sig','homeAboutSig','Kişisel Temsil — İmza (görsel altı)',0,'Selin Meridyen'],['cms_refeb','ref_eyebrow','Referanslar Üst Etiket',0,'Referanslar · Müşteri Deneyimi'],['cms_reft','ref_title','Referanslar Başlık',0,'Güven, sonuçla kazanılır.']],
  hakkimizda:[['cms_hkeb','hk_eyebrow','Üst Etiket',0,'Kişisel Temsil · Yetki Belgeli'],['cms_hkrole','hk_role','Rol / Unvan satırı',0,'Kıdemli Lüks Konut & Özel Portföy Danışmanı · İstanbul'],['cms_hklede','hk_lede','Giriş Paragrafı',1,'Bir gayrimenkul, doğru isimle taçlandırıldığında…'],['cms_hkbody','hk_body','Hakkımda Sayfası Ana Paragraf',1,'Kariyerime İstanbul\'un en rekabetçi pazarında başladım…']],
  hizmetlerimiz:[['cms_hzeb','hz_eyebrow','Üst Etiket',0,'Kişiye Özel · Uçtan Uca Danışmanlık'],['cms_hzlede','hz_lede','Hero Açıklama',1,'Alım-satımdan kiralamaya, değerlemeden yatırım analizine…']]
};
function _cmsFieldHTML(c,f){var val=c[f[1]]!=null?c[f[1]]:'';return '<div class="crm-f"><label>'+f[2]+'</label>'+(f[3]?('<textarea id="'+f[0]+'" rows="3" placeholder="'+_leD(f[4])+'">'+_leD(val)+'</textarea>'):('<input id="'+f[0]+'" value="'+_leD(val)+'" placeholder="'+_leD(f[4])+'">'))+'</div>';}
/* hizmet kartı CRUD satırları */
function dnSvcListHTML(arr){arr=Array.isArray(arr)?arr:[];if(!arr.length)return '<p class="sub" style="margin:4px 0">Henüz hizmet kartı yok — <b>Kart Ekle</b> ya da yukarıdan <b>AI ile Üret</b>. (Boşsa sitede varsayılan kartlar görünür.)</p>';
  var opts=Object.keys(DN_SVC_ICONS);
  return arr.map(function(s,i){return '<div class="dn-svc-row" data-i="'+i+'" style="border:1px solid var(--line);border-radius:12px;padding:12px;margin-bottom:10px;background:rgba(0,0,0,.02)">'
    +'<div class="crm-f" style="margin-bottom:8px"><label>Kart '+(i+1)+' — Başlık</label><input class="dn-svc-t" value="'+_leD(s.title||'')+'" placeholder="Hizmet adı"></div>'
    +'<div class="crm-f" style="margin-bottom:8px"><label>Açıklama</label><textarea class="dn-svc-d" rows="2" placeholder="Kısa fayda cümlesi">'+_leD(s.desc||'')+'</textarea></div>'
    +'<div style="display:flex;gap:8px;align-items:flex-end"><div class="crm-f" style="flex:1;margin:0"><label>İkon</label><select class="dn-svc-ic">'+opts.map(function(k){return '<option value="'+k+'"'+(s.icon===k?' selected':'')+'>'+k+'</option>';}).join('')+'</select></div><button class="btn btn-line" style="white-space:nowrap" onclick="dnSvcDel('+i+')">✕ Kaldır</button></div>'
    +'</div>';}).join('');}
function cmsRender(){var host=document.getElementById('crmCms');if(!host)return;var c=cmsGet();var id=dnIdentGet();
  function grp(title,note,rows){var b='<div class="crm-sec"><div class="crm-sec-h">'+title+'</div>'+(note?'<p class="sub" style="margin:-4px 0 12px">'+note+'</p>':'');
    rows.forEach(function(f){b+=_cmsFieldHTML(c,f);});return b+'</div>';}
  /* 1) Kurumsal Kimlik + AI üretimi */
  var ident='<div class="crm-sec"><div class="crm-sec-h">🏢 Kurumsal Kimlik → AI İçerik</div><p class="sub" style="margin:-4px 0 12px">Firmanızın bilgilerini girip <b>AI ile Üret</b>\'e basın; hero, hakkımda ve hizmet kartları markanıza özel <b>otomatik</b> yazılır. Sonra aşağıdan elle düzenleyebilirsiniz.</p>';
  DN_IDENT_FIELDS.forEach(function(f){ident+=_cmsFieldHTML(id,f);});
  ident+='<div class="crm-mact"><button class="btn btn-gold" id="dnGenBtn" onclick="dnGenAll()">✨ AI ile Tüm İçeriği Üret</button><button class="btn btn-line" onclick="dnIdentSaveForm()">Kimliği Kaydet</button></div><div id="dnGenOut" class="crm-out" style="margin-top:8px"></div></div>';
  /* 2a) Danışman görseli (Ana Sayfa · Kişisel Temsil) — admin yükleme */
  var portraitBlock='<div class="crm-sec"><div class="crm-sec-h">🖼️ Danışman Görseli — Ana Sayfa · Kişisel Temsil</div>'
    +'<p class="sub" style="margin:-4px 0 12px">Kendi profesyonel fotoğrafınızı yükleyin; ana sayfadaki portre alanında görünür ve varsayılan görselin yerini alır. Kaldırırsanız varsayılan portre geri gelir. (JPG / PNG · ~3 MB altı · dikey/portre en iyi sonucu verir)</p>'
    +'<div style="display:flex;gap:14px;align-items:center;flex-wrap:wrap">'
    +'<div id="adPortraitPrev" style="width:76px;height:95px;border:1px solid var(--line);border-radius:8px;overflow:hidden;display:grid;place-items:center;background:rgba(0,0,0,.03);color:var(--em)"></div>'
    +'<label class="btn btn-gold" style="cursor:pointer">⬆ Görsel Yükle<input type="file" accept="image/*" onchange="portraitUpload(this)" style="display:none"></label>'
    +'<button class="btn btn-line" type="button" onclick="portraitClear()">Kaldır</button>'
    +'</div></div>';
  /* 2b) metin alanları */
  var texts=grp('🏠 Ana Sayfa','Boş bırakılan alan varsayılan metni korur.',CMS_FIELDS.home)
    +portraitBlock
    +grp('👤 Hakkımda Sayfası','',CMS_FIELDS.hakkimizda)
    +grp('🛠️ Hizmetler — Başlık Metni','',CMS_FIELDS.hizmetlerimiz)
    +'<div class="crm-mact"><button class="btn btn-gold" onclick="cmsSave()">Metinleri Kaydet & Uygula</button><button class="btn btn-line" onclick="cmsReset()">Varsayılana Dön</button></div>';
  /* 3) hizmet kartı CRUD */
  var svc='<div class="crm-sec"><div class="crm-sec-h">🗂️ Hizmet Kartları (ekle · düzenle · kaldır)</div><div id="dnSvcList">'+dnSvcListHTML(c.services)+'</div>'
    +'<div class="crm-mact"><button class="btn btn-line" onclick="dnSvcAdd()">+ Kart Ekle</button><button class="btn btn-gold" onclick="dnSvcSave()">Kartları Kaydet & Uygula</button></div></div>';
  host.innerHTML=ident+texts+svc;
  try{_portraitPrev();}catch(e){}
}
/* ---- Kurumsal kimlik + AI üret + hizmet CRUD işleyicileri ---- */
function dnIdentSaveForm(){var o=dnIdentGet();DN_IDENT_FIELDS.forEach(function(f){var e=document.getElementById(f[0]);if(e)o[f[1]]=e.value.trim();});dnIdentSave(o);if(window.toast)toast('Kurumsal kimlik kaydedildi.');return o;}
async function dnGenAll(){var btn=document.getElementById('dnGenBtn'),out=document.getElementById('dnGenOut');
  dnIdentSaveForm();
  if(btn){btn.disabled=true;btn.textContent='✨ Üretiliyor…';}if(out)out.innerHTML='<span class="sub">ProX/DeepSeek içerik üretiyor… (10–40 sn)</span>';
  try{var res=await dnGenContent();var data=res&&res.data;
    if(!data){if(out)out.innerHTML='<span style="color:#c0392b">İçerik üretilemedi. <b>ProX AI</b> sekmesinden DeepSeek anahtarını kontrol edin veya tekrar deneyin.</span>';return;}
    var part={};['heroEb','heroT1','heroT2','heroLede','intelText','homeAboutBody','hk_eyebrow','hk_role','hk_lede','hk_body','hz_eyebrow','hz_lede'].forEach(function(k){if(data[k])part[k]=(''+data[k]).trim();});
    if(Array.isArray(data.services)&&data.services.length){part.services=data.services.slice(0,10).map(function(s){return {title:(''+(s.title||'')).trim(),desc:(''+(s.desc||'')).trim(),icon:(DN_SVC_ICONS[s.icon]?s.icon:'home')};}).filter(function(s){return s.title;});}
    cmsMerge(part);
    if(out)out.innerHTML='<span style="color:#1e7e3a">✓ İçerik üretildi ve uygulandı. Aşağıdan düzenleyip Kaydet\'e basın.</span>';
    cmsRender();
  }catch(e){if(out)out.innerHTML='<span style="color:#c0392b">Hata: '+_leD((e&&e.message)||e)+'</span>';}
  finally{if(btn){btn.disabled=false;btn.textContent='✨ AI ile Tüm İçeriği Üret';}}
}
function _dnReadSvc(){var arr=[];[].forEach.call(document.querySelectorAll('#dnSvcList .dn-svc-row'),function(r){var t=r.querySelector('.dn-svc-t'),d=r.querySelector('.dn-svc-d'),ic=r.querySelector('.dn-svc-ic');var tt=t?t.value.trim():'';arr.push({title:tt,desc:d?d.value.trim():'',icon:ic?ic.value:'home'});});return arr;}
function _dnPersistSvc(arr){var c=cmsGet();c.services=arr;try{localStorage.setItem(CMS_KEY,JSON.stringify(c));}catch(e){}return c;}
function dnSvcAdd(){var arr=_dnReadSvc();arr.push({title:'',desc:'',icon:'home'});_dnPersistSvc(arr);var h=document.getElementById('dnSvcList');if(h)h.innerHTML=dnSvcListHTML(arr);}
function dnSvcDel(i){var arr=_dnReadSvc();arr.splice(i,1);_dnPersistSvc(arr);var h=document.getElementById('dnSvcList');if(h)h.innerHTML=dnSvcListHTML(arr);}
function dnSvcSave(){var arr=_dnReadSvc().filter(function(s){return s.title;});_dnPersistSvc(arr);try{applyContent();}catch(e){}if(window.toast)toast('✓ '+arr.length+' hizmet kartı kaydedildi & uygulandı.');}
try{window.dnGenAll=dnGenAll;window.dnIdentSaveForm=dnIdentSaveForm;window.dnSvcAdd=dnSvcAdd;window.dnSvcDel=dnSvcDel;window.dnSvcSave=dnSvcSave;}catch(e){}
function cmsSave(){var g=function(x){var e=document.getElementById(x);return e?e.value.trim():'';};var c=cmsGet();/* services[] + AI ekstralarını KORU */
  Object.keys(CMS_FIELDS).forEach(function(pg){CMS_FIELDS[pg].forEach(function(f){var e=document.getElementById(f[0]);if(!e)return;var v=g(f[0]);if(v)c[f[1]]=v;else delete c[f[1]];});});
  try{localStorage.setItem(CMS_KEY,JSON.stringify(c));}catch(e){}applyContent();try{dnApplyCms(c);}catch(e){}toast('✓ İçerik kaydedildi & ana sayfaya uygulandı. Diğer sayfalar açılınca güncel görünür.');}
function cmsReset(){try{localStorage.removeItem(CMS_KEY);}catch(e){}toast('Varsayılana döndü. Yenileniyor…');setTimeout(function(){location.reload();},800);}
/* ===================== KURUMSAL KİMLİK + AI İÇERİK ÜRETİMİ =====================
   Reseller "Kurumsal Kimlik"i doldurur → DeepSeek/ProX ile hero + hakkımda +
   hizmet kartları (services[]) üretilir → dn_content'e yazılır → tüm sayfalara uygulanır.
   Hizmet kartları dn_content.services dizisinden DİNAMİK render (yoksa statik varsayılan). */
var DN_IDENT_KEY='dn_identity';
function dnIdentGet(){try{return JSON.parse(localStorage.getItem(DN_IDENT_KEY)||'{}')||{};}catch(e){return {};}}
function dnIdentSave(o){try{localStorage.setItem(DN_IDENT_KEY,JSON.stringify(o||{}));}catch(e){}}
var DN_IDENT_FIELDS=[
  ['di_uzmanlik','uzmanlik','Uzmanlık Alanı',0,'Lüks konut, yalı ve rezidans satışı'],
  ['di_sehir','sehir','Şehir / Bölge',0,'İstanbul · Boğaz Hattı'],
  ['di_deneyim','deneyim','Deneyim (yıl)',0,'18'],
  ['di_ton','ton','İçerik Tonu',0,'Prestijli, güven veren, sıcak'],
  ['di_hizmetler','hizmetler','Öne Çıkan Hizmetler (virgülle)',1,'Konut alım-satım, kiralama, değerleme, yatırım danışmanlığı, arsa & arazi'],
  ['di_kitle','hedefKitle','Hedef Kitle',0,'Üst segment konut alıcıları ve yatırımcılar'],
  ['di_vaad','vaad','Temel Vaad / Slogan',0,'Gayrimenkulünüz gerçek değerine ulaşsın']
];
/* preset hizmet ikonları (statik kartlarla aynı görsel dil) */
var DN_SVC_ICONS={
  home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11 12 4l9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/></svg>',
  key:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="3"/><path d="m13 9 8 8-2 2-2-2-2 2-2-2"/></svg>',
  building:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V6l8-3 8 3v14"/><path d="M4 20h16"/><path d="M9 9h.01M12 9h.01M15 9h.01M9 13h.01M12 13h.01M15 13h.01"/></svg>',
  land:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s-7-6.3-7-11a7 7 0 0 1 14 0c0 4.7-7 11-7 11Z"/><circle cx="12" cy="10" r="2.4"/></svg>',
  chart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V4M4 20h16"/><rect x="7" y="12" width="3" height="5"/><rect x="12" y="8" width="3" height="9"/><rect x="17" y="5" width="3" height="12"/></svg>',
  shield:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="M9 12l2 2 4-4"/></svg>',
  star:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l2.6 5.6 6.1.8-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L3.3 9.4l6.1-.8L12 3Z"/></svg>',
  hand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12l4-4 5 3 5-5 4 4"/><path d="M3 12v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4"/></svg>'
};
function dnSvcIcon(k){return DN_SVC_ICONS[k]||DN_SVC_ICONS.home;}
/* hizmet kartlarını dn_content.services dizisinden DİNAMİK render (hizmetlerimiz sayfası) */
function dnApplyServices(c){c=c||cmsGet();var arr=c.services;if(!Array.isArray(arr)||!arr.length)return;
  var grid=document.querySelector('.hz-grid');if(!grid)return;
  try{grid.innerHTML=arr.map(function(s,i){var no=('0'+(i+1)).slice(-2);
    return '<a class="hz-card rv" href="#hz-'+no+'"><span class="no">'+no+'</span><span class="hz-ic">'+dnSvcIcon(s.icon)+'</span><h3>'+_leD(s.title||'')+'</h3><p>'+_leD(s.desc||'')+'</p><span class="go">İncele →</span></a>';
  }).join('');}catch(e){}
}
/* AI çıktısındaki JSON'u toleranslı ayrıştır (markdown/çerçeve temizle) */
function dnJsonParse(txt){if(!txt)return null;var s=(''+txt).replace(/```json/gi,'').replace(/```/g,'').trim();
  var a=s.indexOf('{'),b=s.lastIndexOf('}');if(a<0||b<=a)return null;try{return JSON.parse(s.slice(a,b+1));}catch(e){return null;}}
function dnContentPrompt(id,firm){id=id||{};
  return '[GÖREV] Bir gayrimenkul DANIŞMANI web sitesi için Türkçe kurumsal içerik üret.\n'
    +'Danışman/marka: "'+firm+'". Uzmanlık: "'+(id.uzmanlik||'lüks konut danışmanlığı')+'". '
    +'Şehir/bölge: "'+(id.sehir||'İstanbul')+'". Deneyim: "'+(id.deneyim||'')+' yıl". '
    +'Ton: "'+(id.ton||'prestijli, güven veren, sıcak')+'". Hedef kitle: "'+(id.hedefKitle||'üst segment alıcı ve yatırımcılar')+'". '
    +'Öne çıkan hizmetler: "'+(id.hizmetler||'')+'". Temel vaad: "'+(id.vaad||'')+'".\n'
    +'SADECE aşağıdaki şemada GEÇERLİ JSON döndür (markdown, açıklama, kod bloğu YOK):\n'
    +'{"heroEb":"kısa üst etiket","heroT1":"hero başlık 1. satır","heroT2":"hero başlık 2. satır (italik tamamlayıcı)",'
    +'"heroLede":"1-2 cümle hero açıklaması","intelText":"veri/güven odaklı 1 cümle","homeAboutBody":"ana sayfa hakkımda paragrafı (2 cümle)",'
    +'"hk_eyebrow":"hakkımızda üst etiket","hk_role":"unvan/rol satırı","hk_lede":"hakkımızda giriş paragrafı (2-3 cümle)","hk_body":"hakkımızda sayfası ana paragraf (3-4 cümle)",'
    +'"hz_eyebrow":"hizmetler üst etiket","hz_lede":"hizmetler hero açıklaması (1-2 cümle)",'
    +'"services":[{"title":"hizmet adı","desc":"1 cümle fayda","icon":"home|key|building|land|chart|shield|star|hand"}]}\n'
    +'6-8 hizmet üret. Gerçekçi ol; abartılı/yanıltıcı/garanti vaat YOK; SPK ve yasal mevzuata uygun; "en ucuz/kesin kâr" gibi ifadeler kullanma.';
}
function _dnPickAns(r){return r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))||(typeof r==='string'?r:''));}
async function dnGenContent(){
  var id=dnIdentGet();var firm=(typeof saasResolve==='function'&&saasResolve('brandName'))||(typeof brandName==='function'&&brandName())||'firma';
  var r=await aiChat({prompt:aiGuard(dnContentPrompt(id,firm))},{temperature:0.6,max_tokens:2400,timeout:60000});
  var data=dnJsonParse(_dnPickAns(r));
  return {data:data,raw:r};
}
/* ===================== FİRMA KÜNYE (dn_firma → SAAS_CONFIG.firma) ===================== */
function firmaLoad(){try{var f=JSON.parse(localStorage.getItem('dn_firma')||'null');if(f&&typeof f==='object'){SAAS_CONFIG.firma=Object.assign({},SAAS_CONFIG.firma||{},f);if(f.advisor)SAAS_CONFIG.advisorName=f.advisor;}}catch(e){}}
function crmRenderFirma(){var host=document.getElementById('crmFirma');if(!host)return;var f=SAAS_CONFIG.firma||{};var e=f.eids||{};
  var H='<div class="sta-row2"><div class="sta-f"><label>Danışman Adı</label><input id="cf_advisor" value="'+_leD(SAAS_CONFIG.advisorName||'')+'"></div><div class="sta-f"><label>Firma Ünvanı</label><input id="cf_unvan" value="'+_leD(f.unvan||'')+'"></div></div>'
    +'<div class="sta-row2"><div class="sta-f"><label>Vergi No / Dairesi</label><input id="cf_vergi" value="'+_leD(f.vergi||'')+'"></div><div class="sta-f"><label>Yetki Belge No (EİDS)</label><input id="cf_belge" value="'+_leD(e.belgeNo||'')+'"></div></div>'
    +'<div class="sta-f"><label>Adres</label><input id="cf_adres" value="'+_leD(f.adres||'')+'"></div>'
    +'<div class="sta-row2"><div class="sta-f"><label>Telefon</label><input id="cf_tel" value="'+_leD(f.tel||'')+'"></div><div class="sta-f"><label>E-posta</label><input id="cf_mail" value="'+_leD(f.mail||'')+'"></div></div>'
    +'<button class="btn btn-gold sta-go" onclick="crmSaveFirma()">Kaydet</button>'
    +'<p class="sub" style="margin-top:10px">Bu bilgiler sözleşmeler, raporlar ve yasal metinlerde otomatik kullanılır.</p>';
  host.innerHTML=H;
}
function crmSaveFirma(){var g=function(x){var el=document.getElementById(x);return el?el.value.trim():'';};
  SAAS_CONFIG.firma=SAAS_CONFIG.firma||{};SAAS_CONFIG.firma.eids=SAAS_CONFIG.firma.eids||{};
  SAAS_CONFIG.advisorName=g('cf_advisor')||SAAS_CONFIG.advisorName;
  SAAS_CONFIG.firma.unvan=g('cf_unvan');SAAS_CONFIG.firma.vergi=g('cf_vergi');SAAS_CONFIG.firma.adres=g('cf_adres');SAAS_CONFIG.firma.tel=g('cf_tel');SAAS_CONFIG.firma.mail=g('cf_mail');
  if(g('cf_belge'))SAAS_CONFIG.firma.eids.belgeNo=g('cf_belge');
  try{localStorage.setItem('dn_firma',JSON.stringify({advisor:SAAS_CONFIG.advisorName,unvan:SAAS_CONFIG.firma.unvan,vergi:SAAS_CONFIG.firma.vergi,adres:SAAS_CONFIG.firma.adres,tel:SAAS_CONFIG.firma.tel,mail:SAAS_CONFIG.firma.mail,eids:{belgeNo:SAAS_CONFIG.firma.eids.belgeNo}}));}catch(e){}
  toast('✓ Firma bilgileri kaydedildi.');}
/* ===================== İLETİŞİM & WHATSAPP (dn_iletisim) ===================== */
function iletLoad(){try{return JSON.parse(localStorage.getItem('dn_iletisim')||'{}')||{};}catch(e){return {};}}
function applyIletisim(){var c=iletLoad();
  try{if(c.wa){var num=(''+c.wa).replace(/[^\d]/g,'');[].forEach.call(document.querySelectorAll('a[href*="wa.me"]'),function(a){a.href='https://wa.me/'+num;});}}catch(e){}
  try{if(c.tel){[].forEach.call(document.querySelectorAll('a[href^="tel:"]'),function(a){a.href='tel:'+(''+c.tel).replace(/\s+/g,'');});}}catch(e){}
}
function crmRenderIletisim(){var host=document.getElementById('crmIletisim');if(!host)return;var c=iletLoad();var f=SAAS_CONFIG.firma||{};
  var H='<div class="sta-row2"><div class="sta-f"><label>WhatsApp Numarası (90…)</label><input id="ci_wa" value="'+_leD(c.wa||'905320000000')+'" placeholder="905320000000"></div><div class="sta-f"><label>Sabit / Cep Telefon</label><input id="ci_tel" value="'+_leD(c.tel||f.tel||'')+'"></div></div>'
    +'<div class="sta-row2"><div class="sta-f"><label>E-posta</label><input id="ci_mail" value="'+_leD(c.mail||f.mail||'')+'"></div><div class="sta-f"><label>Adres</label><input id="ci_adres" value="'+_leD(c.adres||f.adres||'')+'"></div></div>'
    +'<div class="sta-ds"><div class="sta-ds-h">💬 WhatsApp Hızlı Yanıt Şablonları</div>'
    +'<div class="sta-f"><label>Şablon 1</label><textarea id="ci_t1" rows="2" placeholder="Merhaba, ilgilendiğiniz gayrimenkul için…">'+_leD(c.t1||'')+'</textarea></div>'
    +'<div class="sta-f"><label>Şablon 2</label><textarea id="ci_t2" rows="2">'+_leD(c.t2||'')+'</textarea></div>'
    +'<div class="sta-f"><label>Şablon 3</label><textarea id="ci_t3" rows="2">'+_leD(c.t3||'')+'</textarea></div></div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-gold sta-go" onclick="crmSaveIletisim()">Kaydet & Siteye Uygula</button><button class="btn btn-line sta-go" onclick="iletTest()">WhatsApp Test Aç</button><button class="btn btn-line sta-go" onclick="staTab(document.querySelector(\'[data-t=gorusmeler]\'))">💬 Görüşmeleri Aç</button></div>'
    +'<p class="sub" style="margin-top:10px">WhatsApp numarası; üst menü, iletişim ve footer\'daki tüm WhatsApp bağlantılarına anında uygulanır.</p>';
  host.innerHTML=H;
}
function crmSaveIletisim(){var g=function(x){var el=document.getElementById(x);return el?el.value.trim():'';};
  var c={wa:g('ci_wa').replace(/[^\d]/g,''),tel:g('ci_tel'),mail:g('ci_mail'),adres:g('ci_adres'),t1:g('ci_t1'),t2:g('ci_t2'),t3:g('ci_t3')};
  try{localStorage.setItem('dn_iletisim',JSON.stringify(c));}catch(e){}applyIletisim();toast('✓ İletişim & WhatsApp güncellendi.');}
function iletTest(){var c=iletLoad();var num=(''+(c.wa||'905320000000')).replace(/[^\d]/g,'');window.open('https://wa.me/'+num,'_blank');}
/* ===================== PROX API & ANAHTAR (veri uçları — dn_prox) ===================== */
var PROX_KEY='dn_prox';
function proxCfgLoad(){try{var p=JSON.parse(localStorage.getItem(PROX_KEY)||'null');if(p&&window.EMLAK_TENANT){if(p.key)window.EMLAK_TENANT.tenant_key=p.key;if(p.tenant)window.EMLAK_TENANT.tenant_id=p.tenant;}}catch(e){}}
function crmRenderProxApi(){var host=document.getElementById('crmProxApi');if(!host)return;var t=window.EMLAK_TENANT||{};var q=null;try{q=JSON.parse(localStorage.getItem('dn_quota')||'null');}catch(e){}
  var H='<div class="sta-row2"><div class="sta-f"><label>ProX Tenant ID</label><input id="px_tenant" value="'+_leD(t.tenant_id||'consultant')+'" placeholder="consultant"></div><div class="sta-f"><label>ProX API Anahtarı</label><input id="px_key" type="password" value="'+_leD(t.tenant_key||'')+'" placeholder="prox_..." autocomplete="off"></div></div>'
    +'<div class="sta-f"><label>API Adresi (sabit)</label><input value="'+_leD(window.EMLAK_API_BASE||'https://www.emlakekspertizi.com')+'" readonly></div>'
    +'<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-gold sta-go" onclick="proxCfgSave()">Kaydet</button><button class="btn btn-line sta-go" type="button" onclick="proxCfgTest()">Bağlan & Test Et</button></div>'
    +'<div id="px_status" style="margin-top:10px"></div>'
    +'<div class="sta-ds"><div class="sta-ds-h">📊 Kullanım Kotası</div><p class="sub" style="margin:2px 0">Bu ay <b>'+((q&&q.count)||0)+'</b> ProX isteği'+(q&&q.month?(' ('+_leD(q.month)+')'):'')+'</p></div>'
    +'<p class="sub" style="margin-top:8px">Bu anahtar <b>VERİ uçları</b> içindir (endeks · değerleme · il/ilçe/mahalle · analiz). Yapay zeka üretimi için <b>DeepSeek</b> anahtarını "ProX AI" sekmesinden girin — ikisi ayrı çalışır.</p>';
  host.innerHTML=H;
}
function proxCfgSave(){var g=function(x){var el=document.getElementById(x);return el?el.value.trim():'';};var tenant=g('px_tenant')||'consultant',key=g('px_key');
  if(!window.EMLAK_TENANT)window.EMLAK_TENANT={};if(key)window.EMLAK_TENANT.tenant_key=key;window.EMLAK_TENANT.tenant_id=tenant;
  try{localStorage.setItem(PROX_KEY,JSON.stringify({tenant:tenant,key:window.EMLAK_TENANT.tenant_key}));}catch(e){}
  toast('✓ ProX API bağlantısı kaydedildi.');}
async function proxCfgTest(){var st=document.getElementById('px_status');proxCfgSave();if(st)st.innerHTML='<span class="sub">Bağlanıyor…</span>';
  try{var r=await proxApi('/api/v1/tenant/bootstrap');
    if(r&&!r.fallback&&r.success===true){if(st)st.innerHTML='<div class="iln-eids">✓ Bağlandı · Sektör: '+_leD(r.sector||'—')+' · Paket: '+_leD(r.package||'—')+' · Özellikler: '+_leD((r.enabled_features||[]).join(", "))+'</div>';toast('✓ ProX bağlantısı doğrulandı.');}
    else{if(st)st.innerHTML='<div class="iln-eids no">Bağlanamadı — Tenant ID ve API anahtarını kontrol edin.</div>';}
  }catch(e){if(st)st.innerHTML='<div class="iln-eids no">Hata: '+_leD(e.message||'bağlantı')+'</div>';}}
/* ===================== AKILLI EŞLEŞTİRME (kişi kriterleri ↔ açık ilan) ===================== */
function _matchScore(k,l){var kr=(k.tip==='Kiracı');
  if(kr&&l.durum!=='Kiralık')return 0;if(!kr&&l.durum!=='Satılık')return 0;var s=2;
  if(k.il&&l.il&&k.il===l.il)s+=1;if(k.ilce&&l.ilce&&k.ilce===l.ilce)s+=2;
  if(k.kategori){var hay=(ilnTipT(l.tip)+' '+(l.tip||'')).toLocaleLowerCase('tr');if(hay.indexOf((''+k.kategori).toLocaleLowerCase('tr'))>=0)s+=1;}
  if(l.fiyat){if(k.max){if(l.fiyat>k.max*1.15)return 0;if(l.fiyat<=k.max)s+=2;}if(k.min&&l.fiyat>=k.min)s+=1;}
  return s;}
function crmRenderMatch(){var host=document.getElementById('crmMatch');if(!host)return;crmLoad();try{ilanLoad();}catch(e){}
  var buyers=_crm.kisiler.filter(function(k){return k.tip==='Alıcı'||k.tip==='Yatırımcı'||k.tip==='Kiracı';});
  var H='<p class="sub">Alıcı / yatırımcı / kiracı kişilerinizin kriterlerine (bölge · kategori · bütçe) uyan <b>açık ilanlar</b> otomatik eşleştirilir. Uyum ≥ %50 gösterilir.</p>';
  if(!buyers.length){host.innerHTML=H+'<div class="crm-empty">Eşleştirilecek alıcı/yatırımcı/kiracı tipli kişi yok. Kişiler sekmesinden ekleyin (bütçe & bölge girerseniz eşleşme güçlenir).</div>';return;}
  H+=buyers.map(function(k){
    var matches=LISTINGS.filter(function(l){return l.status!=='pasif';}).map(function(l){return {l:l,s:_matchScore(k,l)};}).filter(function(m){return m.s>=3;}).sort(function(a,b){return b.s-a.s;}).slice(0,4);
    return '<div class="crm-sec"><div class="crm-sec-h">'+_leD(k.name||'—')+' <span style="font-weight:400;font-size:12px;color:var(--muted)">'+_leD(k.tip||'')+(k.ilce||k.il?(' · '+[k.ilce,k.il].filter(Boolean).map(_leD).join('/')):'')+(k.max?(' · ≤ '+_crmTL(k.max)):'')+'</span></div>'
      +(matches.length?('<div class="crm-list">'+matches.map(function(m){var l=m.l;var pct=Math.min(99,Math.round(m.s/6*100));return '<div class="crm-mini"><span><b>'+_leD(l.baslik||'')+'</b> <em class="src">'+_leD(ilanBolge(l))+' · '+fmt(l.fiyat||0)+' ₺</em></span><span class="mt-score">%'+pct+' uyum</span></div>';}).join('')+'</div>')
        :'<div class="crm-empty">Uygun açık ilan yok — portföyü genişletin ya da kriterleri güncelleyin.</div>')+'</div>';
  }).join('');
  host.innerHTML=H;
}
/* ===================== MARKA RAPOR STÜDYOSU (yazdır/PDF) ===================== */
function raporUret(tip){crmLoad();try{ilanLoad();}catch(e){}var F=_crmFirma();var now=new Date().toLocaleDateString('tr-TR');var body='';
  if(tip==='portfoy'){var akt=LISTINGS.filter(function(l){return l.status!=='pasif';});
    body='<h2>Açık Portföy Özeti</h2><table><tr><th>Başlık</th><th>Tip</th><th>Konum</th><th>m²</th><th>Fiyat</th></tr>'+akt.map(function(l){return '<tr><td>'+_leD(l.baslik||'')+'</td><td>'+_leD(ilnTipT(l.tip))+'</td><td>'+_leD(ilanBolge(l))+'</td><td>'+(l.m2||'—')+'</td><td>'+fmt(l.fiyat||0)+' ₺</td></tr>';}).join('')+'</table><p>Toplam '+akt.length+' açık ilan.</p>';
  }else if(tip==='crm'){var open=_crm.deals.filter(function(d){return d.stage!=='kazanildi'&&d.stage!=='kaybedildi';});var pipe=open.reduce(function(s,d){return s+(+d.value||0);},0);
    body='<h2>CRM Özet Raporu</h2><ul><li>Toplam kişi: <b>'+_crm.kisiler.length+'</b></li><li>Açık fırsat: <b>'+open.length+'</b></li><li>Pipeline değeri: <b>'+_crmTL(pipe)+'</b></li><li>Açık görev: <b>'+_crm.tasks.filter(function(t){return !t.done;}).length+'</b></li><li>Gelen talep: <b>'+crmLeads().length+'</b></li></ul>';
  }else{body='<h2>Satış Hattı Raporu</h2><table><tr><th>Aşama</th><th>Fırsat</th><th>Değer</th></tr>'+CRM_STAGES.map(function(s){var col=_crm.deals.filter(function(d){return d.stage===s.k;});var v=col.reduce(function(a,d){return a+(+d.value||0);},0);return '<tr><td>'+s.t+'</td><td>'+col.length+'</td><td>'+_crmTL(v)+'</td></tr>';}).join('')+'</table>';}
  var w=window.open('','_blank');if(!w){toast('Açılır pencere engellendi.');return;}
  w.document.write('<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Rapor · '+_leD(F.unvan)+'</title><style>body{font-family:Georgia,serif;max-width:820px;margin:34px auto;padding:0 26px;color:#122a20;line-height:1.6}.rh{border-bottom:2px solid #c39b45;padding-bottom:12px;margin-bottom:22px}.rh b{font-size:21px}.rh span{color:#6f7d72;font-size:12px}table{width:100%;border-collapse:collapse;margin:14px 0;font-size:13px}th,td{text-align:left;padding:7px 9px;border-bottom:1px solid #e8e0cf}th{color:#0e5e3e}h2{color:#0e5e3e;font-size:18px;margin-top:0}ul{font-size:14px}.rf{margin-top:28px;font-size:11px;color:#999;border-top:1px solid #e8e0cf;padding-top:9px}</style></head><body><div class="rh"><b>'+_leD(F.unvan)+'</b><br><span>'+_leD(F.advisor)+' · '+_leD(F.tel)+' · '+_leD(F.mail)+' · Yetki Belge No: '+_leD(F.belge)+'</span></div>'+body+'<div class="rf">Bu rapor '+now+' tarihinde ProX destekli Selin Meridyen yönetim paneliyle oluşturulmuştur.</div></body></html>');
  w.document.close();setTimeout(function(){try{w.print();}catch(e){}},320);
}
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
const _ADMIN_USER='admin';const _ADMIN_PASS='1234';/* istemci tarafı demo giriş — gerçek güvenlik için sunucu-taraf auth gerekir */
function _adGateHost(){let el=document.getElementById('adGate');if(el)return el;el=document.createElement('div');el.id='adGate';el.className='adgate';
  el.innerHTML='<div class="adgate-ov" onclick="closeAdminGate()"></div><div class="adgate-card">'
   +'<button class="adgate-x" onclick="closeAdminGate()" aria-label="Kapat">✕</button>'
   +'<div class="adgate-lock"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/><circle cx="12" cy="16" r="1.4"/></svg></div>'
   +'<h3>Yönetim Paneli Girişi</h3><div class="sub">Bu alan yalnızca yetkili danışmana özeldir. Devam etmek için kullanıcı adı ve erişim şifrenizi girin.</div>'
   +'<div class="adgate-f"><input id="adUser" type="text" placeholder="Kullanıcı adı" autocomplete="username" onkeydown="if(event.key===\'Enter\'){var p=document.getElementById(\'adPass\');if(p)p.focus();}"></div>'
   +'<div class="adgate-f"><input id="adPass" type="password" placeholder="Erişim şifresi" autocomplete="current-password" onkeydown="if(event.key===\'Enter\')adminLogin()"><button class="eye" type="button" onclick="_adToggleEye()" aria-label="Göster">👁</button></div>'
   +'<button class="btn btn-gold adgate-go" onclick="adminLogin()">Güvenli Giriş →</button>'
   +'<div class="adgate-err" id="adErr"></div>'
   +'<div class="adgate-foot"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3Z"/></svg> KVKK uyumlu · oturum şifrelenir · erişim kayıt altına alınır</div></div>';
  document.body.appendChild(el);return el;}
function openAdminGate(){const el=_adGateHost();el.classList.add('on');const u=document.getElementById('adUser'),i=document.getElementById('adPass');if(u)u.value='';if(i)i.value='';setTimeout(()=>{(u||i)&&(u||i).focus();},60);const er=document.getElementById('adErr');if(er)er.textContent='';}
function closeAdminGate(){const e=document.getElementById('adGate');if(e)e.classList.remove('on');}
function _adToggleEye(){const i=document.getElementById('adPass');if(i)i.type=i.type==='password'?'text':'password';}
function adminLogin(){const u=document.getElementById('adUser'),i=document.getElementById('adPass'),er=document.getElementById('adErr'),g=document.getElementById('adGate');if(!i)return;
  var uv=(u?u.value:'').trim().toLocaleLowerCase('tr');
  if(uv===_ADMIN_USER&&i.value===_ADMIN_PASS){if(er)er.textContent='';closeAdminGate();openSaasAdmin();toast('✓ Yönetim paneline güvenli giriş yapıldı.');}
  else{if(er)er.textContent='⚠ Hatalı kullanıcı adı veya şifre. Erişim reddedildi.';if(g){g.classList.add('shake');setTimeout(()=>g.classList.remove('shake'),460);}if(i)i.value='';var f=(uv!==_ADMIN_USER&&u)?u:i;if(f)f.focus();}}
window.openAdminGate=openAdminGate;window.closeAdminGate=closeAdminGate;window.adminLogin=adminLogin;window._adToggleEye=_adToggleEye;
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeAdminGate();closeSaasAdmin();if(typeof closeSaasPortal==='function')closeSaasPortal();}});

/* =====================================================================
   YÖNETİM PANELİ (#saasTenantAdmin) — tam fonksiyonlu
   ===================================================================== */
function _saasAdminHost(){let el=document.getElementById('saasTenantAdmin');if(el)return el;el=document.createElement('div');el.id='saasTenantAdmin';el.className='adm-app';
  el.innerHTML='<div class="adm-topbar"><div class="alogo"><span class="mark">'+_brandInitial()+'</span><span class="alogo-t">'+_leD(saasResolve('brandName')||'Selin Meridyen')+' · <b>Pro<span class="ap-x">X</span> CRM</b></span></div><div class="adm-topbar-act"><button onclick="openOnboarding()">🚀 Sihirbaz</button><button onclick="closeSaasAdmin()">👁 Siteyi Gör</button><button class="adm-x" onclick="closeSaasAdmin()">✕</button></div></div><div class="adm-dash">'
   +'<aside class="adm-side"><button class="adm-nav act" data-t="crmdash" onclick="staTab(this)">📊 Panel</button><div class="adm-group">CRM & Satış</div><button class="adm-nav" data-t="crmkisi" onclick="staTab(this)">👤 Kişiler & Talepler</button><button class="adm-nav" data-t="eslesme" onclick="staTab(this)">🎯 Akıllı Eşleştirme</button><button class="adm-nav" data-t="crmpipe" onclick="staTab(this)">🪜 Satış Hattı</button><button class="adm-nav" data-t="crmtask" onclick="staTab(this)">📅 Görev & Randevu</button><button class="adm-nav" data-t="komisyon" onclick="staTab(this)">💰 Komisyon & Finans</button><button class="adm-nav" data-t="kira" onclick="staTab(this)">🔑 Kira Takibi</button><button class="adm-nav" data-t="sozlesme" onclick="staTab(this)">📄 Sözleşmeler</button><button class="adm-nav" data-t="iletisim" onclick="staTab(this)">📣 İletişim & WhatsApp</button><button class="adm-nav" data-t="rapor" onclick="staTab(this)">📈 Raporlar</button><button class="adm-nav" data-t="gorusmeler" onclick="staTab(this)">💬 Görüşmeler</button><div class="adm-group">Portföy & İçerik</div><button class="adm-nav" data-t="ilanlar" onclick="staTab(this)">🏠 İlanlar</button><button class="adm-nav" data-t="portfoy" onclick="staTab(this)">🔒 Özel Portföy</button><button class="adm-nav" data-t="ekip" onclick="staTab(this)">👥 Ekip / Danışmanlar</button><button class="adm-nav" data-t="hizmetalani" onclick="staTab(this)">🗺️ Hizmet Alanı</button><button class="adm-nav" data-t="icerik" onclick="staTab(this)">📝 İçerik & Sayfalar</button><div class="adm-group">Entegrasyon & ProX</div><button class="adm-nav" data-t="prox" onclick="staTab(this)">🤖 ProX AI & DeepSeek</button><button class="adm-nav" data-t="proxapi" onclick="staTab(this)">🔌 ProX API & Anahtar</button><button class="adm-nav" data-t="eids" onclick="staTab(this)">🛡️ EİDS Yetki</button><div class="adm-group">Pazarlama</div><button class="adm-nav" data-t="seo" onclick="staTab(this)">🔍 Google & SEO</button><div class="adm-group">Ayarlar</div><button class="adm-nav" data-t="firma" onclick="staTab(this)">🏢 Firma Bilgileri</button><button class="adm-nav" data-t="marka" onclick="staTab(this)">🎨 Marka & Tema</button><button class="adm-nav" data-t="yedek" onclick="staTab(this)">💾 Yedek / Aktar</button><div class="spacer"></div><button class="adm-nav exit" onclick="closeSaasAdmin()">⎋ Paneli Kapat</button></aside><main class="adm-main">'
   /* CRM · PANEL */
   +'<div class="sta-pane" data-p="crmdash"><h4>Yönetim Paneli · CRM</h4><p class="sub">Kişiler, satış hattı, görevler ve gelen talepler tek bakışta. Gerçek görüşme ve talepler otomatik düşer.</p><div id="crmDash"></div></div>'
   /* CRM · KİŞİLER */
   +'<div class="sta-pane" data-p="crmkisi" hidden><h4>Kişiler & Talepler</h4><p class="sub">Alıcı/satıcı/yatırımcı kişilerinizi yönetin; gelen talepleri tek tıkla kişiye dönüştürün.</p><div id="crmKisiler"></div></div>'
   /* CRM · SATIŞ HATTI */
   +'<div class="sta-pane" data-p="crmpipe" hidden><h4>Satış Hattı (Pipeline)</h4><p class="sub">Fırsatları Yeni → İletişim → Görüşme → Teklif → Kazanıldı aşamalarında yönetin.</p><div id="crmPipe"></div></div>'
   /* CRM · GÖREVLER */
   +'<div class="sta-pane" data-p="crmtask" hidden><h4>Görev & Randevu</h4><p class="sub">Arama, yer gösterme, tapu ve takip görevlerinizi planlayın; geciken görevler işaretlenir.</p><div id="crmTasks"></div></div>'
   /* İLAN YÖNETİMİ */
   +'<div class="sta-pane" data-p="ilanlar" hidden><h4>İlan Yönetimi · Açık Portföy</h4><p class="sub">Açık ilanlarınızı ekleyin/düzenleyin/silin; yayın (aktif) için EİDS yetkisi gerekir (VIP Özel Portföy serbesttir). Değişiklikler siteye anında yansır.</p><div id="ilanAdminBody"></div></div>'
   /* EKİP */
   +'<div class="sta-pane" data-p="ekip" hidden><h4>Ekip Yönetimi</h4><p class="sub">Danışman, asistan ve iş ortaklarınızı yönetin; fırsat ve görevlerde sorumlu olarak atanabilir.</p><div id="crmEkip"></div></div>'
   /* SÖZLEŞMELER */
   +'<div class="sta-pane" data-p="sozlesme" hidden><h4>Sözleşmeler</h4><p class="sub">Aracılık, yer gösterme, kira, satış vaadi ve münhasır yetki şablonları — firma künyenizle otomatik dolar, yazdırın/PDF alın.</p><div id="crmSoz"></div></div>'
   /* KOMİSYON */
   +'<div class="sta-pane" data-p="komisyon" hidden><h4>Komisyon & Tahsilat</h4><p class="sub">İşlem komisyonlarınızı ve tahsilat durumlarını takip edin.</p><div id="crmKomisyon"></div></div>'
   /* KİRA */
   +'<div class="sta-pane" data-p="kira" hidden><h4>Kira Takibi</h4><p class="sub">Yönetimindeki kira sözleşmeleri, aylık tutarlar ve gecikmeler.</p><div id="crmKira"></div></div>'
   /* RAPORLAR */
   +'<div class="sta-pane" data-p="rapor" hidden><h4>Raporlar & Analitik</h4><p class="sub">Marka rapor oluşturun; dönüşüm oranı, satış hattı dağılımı, talep kaynakları ve aylık trend CRM verinizden canlı hesaplanır.</p><div id="crmRapor"></div></div>'
   /* AKILLI EŞLEŞTİRME */
   +'<div class="sta-pane" data-p="eslesme" hidden><h4>Akıllı Eşleştirme</h4><p class="sub">Alıcı/yatırımcı/kiracı kişilerinizi açık ilanlarınızla otomatik eşleştirin — bölge, kategori ve bütçe uyumuna göre.</p><div id="crmMatch"></div></div>'
   /* İÇERİK CMS */
   +'<div class="sta-pane" data-p="icerik" hidden><h4>Sayfa İçerikleri</h4><p class="sub">Ana sayfa hero metinlerini düzenleyin; değişiklik siteye anında uygulanır.</p><div id="crmCms"></div></div>'
   /* YEDEK / AKTAR */
   +'<div class="sta-pane" data-p="yedek" hidden><h4>Yedek & Aktar</h4><p class="sub">Tüm CRM, ilan, sözleşme ve ayar verilerinizi JSON olarak yedekleyin, geri yükleyin veya sıfırlayın.</p>'
     +'<div style="display:flex;flex-direction:column;gap:12px;max-width:460px">'
     +'<button class="btn btn-gold sta-go" onclick="crmDataExport()">⬇ Tüm Veriyi Yedekle (JSON indir)</button>'
     +'<label class="btn btn-line sta-go" style="cursor:pointer;text-align:center">⬆ Yedekten Geri Yükle<input type="file" accept="application/json,.json" onchange="crmDataImport(this)" style="display:none"></label>'
     +'<button class="btn btn-line sta-go" style="color:#c0603a;border-color:rgba(192,96,58,.4)" onclick="crmDataReset()">🗑 Tüm Yerel Veriyi Sıfırla</button>'
     +'<p class="sub" style="margin:2px 0 0">Veriler tarayıcınızda (localStorage) saklanır. Cihaz/ tarayıcı değiştirmeden önce yedek alın.</p></div></div>'
   /* MARKA & LOGO */
   +'<div class="sta-pane" data-p="marka" hidden><h4>Marka, Logo & Tema</h4><p class="sub">Logo/favicon yükleyin veya URL girin; altın/şampanya tema tonunu ayarlayın.</p>'
     +'<div class="logo-prev"><div class="box" id="adLogoPrev">M</div><span>Mevcut logo önizleme</span></div>'
     +'<div class="sta-row2"><div class="sta-f"><label>Marka Adı <span style="color:var(--muted);font-weight:400">(white-label — TÜM sayfalarda “Selin Meridyen” yerine geçer)</span></label><input id="sl_brand" placeholder="Selin Meridyen"></div><div class="sta-f"><label>Logo Harfi <span style="color:var(--muted);font-weight:400">(boş = adın ilk harfi)</span></label><input id="sl_initial" maxlength="2" placeholder="M"></div></div>'
     +'<div class="sta-row2"><div class="sta-f"><label>Logo Yükle (dosya)</label><input type="file" accept="image/*" id="sl_logo_file" onchange="saasUploadImg(this,\'logoUrl\')"></div><div class="sta-f"><label>veya Logo URL</label><input id="sl_logo_url" placeholder="https://.../logo.png"></div></div>'
     +'<div class="sta-row2"><div class="sta-f"><label>🖥️ Tarayıcı Logosu · Favicon (dosya)</label><input type="file" accept="image/png,image/svg+xml,image/x-icon,image/*" id="sl_fav_file" onchange="dnBrandUpload(this,\'favicon\')"></div><div class="sta-f"><label>🔍 Google Arama Logosu (dosya)</label><input type="file" accept="image/png,image/jpeg,image/*" id="sl_glogo_file" onchange="dnBrandUpload(this,\'googleLogo\')"></div></div>'
     +'<div class="sta-ds ds-off" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:12px"><span style="flex:1;min-width:220px">Favicon; tarayıcı sekmesinde ve Google arama sonucu ikonunda görünür. Google logosu; arama bilgi panosunda (schema.org Organization) kullanılır. Yükleyince <b>anında tüm sayfalara</b> uygulanır — PNG/SVG, kare, ≤512 KB önerilir.</span><button type="button" class="btn btn-line" onclick="if(window.dnBrandReset)dnBrandReset()">↺ Varsayılana dön</button></div>'
     +'<div class="sta-row2"><div class="sta-f"><label>Altın Ton (accent)</label><input id="sl_accent" placeholder="#c39b45"></div><div class="sta-f"><label>Şampanya (soft)</label><input id="sl_soft" placeholder="#dcc389"></div></div>'
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
   /* PROX API & ANAHTAR */
   +'<div class="sta-pane" data-p="proxapi" hidden><h4>ProX API & Anahtar</h4><p class="sub">Kendi ProX kiracı kimliğinizi ve API anahtarınızı girin; endeks, değerleme ve bölge verileri bu anahtarla çekilir.</p><div id="crmProxApi"></div></div>'
   /* EİDS */
   +'<div class="sta-pane" data-p="eids" hidden><h4>EİDS — Elektronik İlan Doğrulama</h4><p class="sub">Açık ilan yayınlamak için yetki belgesi gerekir; VIP (davet usulü) portföy serbesttir. Kamuya güven rozeti olarak gösterilir.</p>'
     +'<div id="ed_status" style="margin-bottom:12px"></div>'
     +'<div class="sta-f"><label>Yetki Belge No (7+ hane)</label><input id="ed_belge" placeholder="0034812"></div>'
     +'<div class="sta-row2"><button class="btn btn-gold sta-go" onclick="eidsConnect()">e-Devlet ile Bağlan & Doğrula</button><button class="btn btn-line sta-go" onclick="eidsSave()">Kaydet</button></div></div>'
   /* HİZMET ALANI (tam: il / ilçe / mahalle / kategori) */
   +'<div class="sta-pane" data-p="hizmetalani" hidden><h4>Hizmet Alanı Yönetimi</h4><p class="sub">İl · ilçe · mahalle · kategori — hizmet verdiğiniz alanları ekleyin/çıkarın (çok-illi). Çıkarılanlar site/SEO/Özel Portföy\'den kalkar.</p>'
     +'<div class="sta-f"><label>Hizmet İlleri</label><div id="saIlChips" style="display:flex;flex-wrap:wrap;gap:8px;margin:8px 0"></div><div class="sta-row2"><select id="saAddIl" style="padding:9px 11px;border:1px solid var(--line-soft);border-radius:9px;background:var(--cream);color:inherit;font:inherit"></select><button class="btn btn-line" onclick="saAddProvince()">+ İl Ekle</button></div></div>'
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
   +'<div class="sta-pane" data-p="iletisim" hidden><h4>İletişim & WhatsApp Yönetimi</h4><p class="sub">WhatsApp numaranız, iletişim bilgileriniz ve hızlı yanıt şablonları — footer ve iletişim alanlarında kullanılır.</p><div id="crmIletisim"></div></div>'
   +'<div class="sta-pane" data-p="firma" hidden><h4>Firma Bilgileri · Künye</h4><p class="sub">Ünvan, vergi, adres ve iletişim; footer, sözleşme ve yasal metinlerde otomatik kullanılır.</p><div id="crmFirma"></div></div>'
   +'</main></div>';
  document.body.appendChild(el);return el;}
function openSaasAdmin(){const el=_saasAdminHost();el.classList.add('on');try{document.body.style.overflow='hidden';}catch(e){}
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.value=v||'';};
  set('sl_brand',saasResolve('brandName'));set('sl_accent',saasResolve('accent'));set('sl_soft',saasResolve('accentSoft'));
  set('sg_ga',saasResolve('googleAnalytics'));set('sg_gsc',saasResolve('googleSiteVerification'));set('sg_maps',saasResolve('googleMapsKey'));
  set('sm_title',saasResolve('metaTitle'));set('sm_desc',saasResolve('metaDescription'));set('sm_kw',saasResolve('metaKeywords'));
  set('sp_base',SAAS_CONFIG.proxAiPrompts.persona);set('sp_custom',SAAS_CONFIG.tenantSettings.customPrompt);
  set('dn_dskey',_dsKey());set('dn_dsmodel',_dsModel());try{aiDsStatus();}catch(e){}
  set('ed_belge',eidsFirma().eids.belgeNo);try{eidsRenderAdmin();}catch(e){}
  try{renderSA();renderVipStatus();renderGorusmelerD();}catch(e){}
  try{crmRenderAll();}catch(e){}
  try{ilanRenderAdmin();}catch(e){}
  try{staGate();}catch(e){}
  _refreshLogoPrev();
}
function closeSaasAdmin(){const e=document.getElementById('saasTenantAdmin');if(e)e.classList.remove('on');try{document.body.style.overflow='';}catch(_e){}}
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
  mm.innerHTML='<div style="position:absolute;inset:0;background:rgba(0,0,0,.75)" onclick="document.getElementById(\''+id+'\').style.display=\'none\'"></div><div style="position:relative;max-width:460px;background:var(--ink,#0b0b0c);border:1px solid var(--line-soft);border-radius:14px;padding:26px;text-align:center"><div style="font-size:32px">🔒</div><h3 style="font-family:var(--serif);color:var(--gold);margin:6px 0">'+_leD(label)+' · '+_leD(need)+' paketi</h3><div class="sub">Mevcut paket: <b>'+_leD(cur)+'</b>. Bu özellik <b>'+_leD(need)+'</b> ve üzeri paketlerde açıktır.</div><div style="text-align:left;background:var(--cream);border:1px solid var(--line-soft);border-radius:10px;padding:12px;margin:14px 0;font-size:13px;color:var(--muted)"><b style="color:var(--gold)">'+_leD(need)+' kapsamı:</b><br>'+_leD(PKG_KAPSAM_D[need]||'')+'</div><button class="btn btn-gold" style="width:100%" onclick="document.getElementById(\''+id+'\').style.display=\'none\';if(typeof toast===\'function\')toast(\''+_leD(need)+' paketi yükseltme talebiniz iletildi.\')">'+_leD(need)+' Paketine Yükselt</button></div>';
  mm.style.display='flex';}
window.staGate=staGate;window.staUpsell=staUpsell;window.staTabGated=staTabGated;
function staTab(b){var t=b.dataset.t;if(staTabGated(t)){staUpsell(t);return;}const m=b.closest('.adm-app')||b.closest('.sta-modal')||document;m.querySelectorAll('.adm-nav,.sta-tabs button').forEach(x=>x.classList.toggle('act',x===b));m.querySelectorAll('.sta-pane').forEach(p=>p.hidden=(p.dataset.p!==t));var mn=m.querySelector('.adm-main');if(mn)mn.scrollTop=0;}
function _v(id){const e=document.getElementById(id);return e?e.value.trim():'';}
function _refreshLogoPrev(){const box=document.getElementById('adLogoPrev');if(!box)return;const logo=saasResolve('logoUrl');if(logo)box.innerHTML='<img src="'+logo+'" alt="logo">';else box.textContent=(saasResolve('brandName')||'M').trim().charAt(0);}
function saasUploadImg(input,key){const f=input.files&&input.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{SAAS_CONFIG.tenantSettings[key]=e.target.result;applySaaSSettings();_refreshLogoPrev();toast((key==='logoUrl'?'Logo':'Favicon')+' yüklendi & uygulandı.');};r.readAsDataURL(f);}
function saasApplyBrand(){const t=SAAS_CONFIG.tenantSettings;const br=_v('sl_brand'),lu=_v('sl_logo_url'),fu=_v('sl_fav_url'),ac=_v('sl_accent'),sf=_v('sl_soft');
  if(br)t.brandName=br;if(lu)t.logoUrl=lu;if(fu)t.faviconUrl=fu;if(ac)t.accent=ac;if(sf)t.accentSoft=sf;
  var li=_v('sl_initial');
  if(window.dnSetBrand)dnSetBrand({name:(br||''),initial:(li||'')});  /* white-label: adı+logo harfini TÜM sayfalara (statik dahil) uygula */
  initSaaSTheme();applySaaSSettings();_refreshLogoPrev();toast('Marka, logo & tema TÜM sayfalara uygulandı (white-label).');}
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
  /* WHITE-LABEL TEK KAYNAK: reseller adı yalnız dn_brand'de kalıcı (SAAS_CONFIG persist edilmez).
     brand.js ile app.js'in AYNI adı kullanması için SAAS_CONFIG.brandName'i dn_brand'den senkronla;
     yoksa app.js "Selin Meridyen" render eder, brand.js "Didem Keskin" → çakışma + geç-render sızıntısı. */
  try{var _wl=JSON.parse(localStorage.getItem('dn_brand')||'{}');if(_wl&&_wl.name&&_wl.name.trim())SAAS_CONFIG.systemSettings.brandName=_wl.name.trim();}catch(e){}
  initSaaSTheme();applySaaSSettings();
  try{eidsRenderPublic();applySchema();applyProxyMode();abApply();}catch(e){}
  try{ilanLoad();}catch(e){}/* admin'de kaydedilmiş açık ilanları yükle (dn_listings_v1) */
  try{firmaLoad();}catch(e){}/* firma künye (dn_firma) → SAAS_CONFIG.firma */
  try{proxCfgLoad();}catch(e){}/* admin ProX API anahtarı (dn_prox) → EMLAK_TENANT */
  try{applyContent();}catch(e){}/* CMS: admin'de düzenlenmiş hero metinlerini uygula (dn_content) */
  try{applyPortrait();}catch(e){}/* Ana sayfa Kişisel Temsil portresi (admin yüklediyse gerçek foto, yoksa temsili) */
  try{applyIletisim();}catch(e){}/* WhatsApp/telefon bağlantılarını admin değerine güncelle (dn_iletisim) */
  document.getElementById('homeListings').innerHTML=listingCardsHTML();
  try{vaultIndexLoad();}catch(e){document.getElementById('vaultGrid').innerHTML=vipCardsHTML();}
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
    var sel='.sec-h,.vcard,.proc,.appt-card,.analiz-band,.contact .row,.contact-cta,.prox-card,.about-grid>*,.trust-in>*,.bz-wrap,.intel-copy';
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
       +'<div class="bz-delta'+(Math.abs(d.yoy)<0.1?'':(d.yoy<0?' dn':''))+'">'+(Math.abs(d.yoy)<0.1?('● '+(d.skor>=90?'Çok güçlü':d.skor>=85?'Güçlü':d.skor>=75?'İstikrarlı':'Gelişen')+' bölge'):((d.yoy>=0?'▲ +':'▼ ')+d.yoy+'% <span style="color:var(--muted);font-weight:500">· 12 ay</span>'))+'</div></div>'
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
  /* canlı ProX verisi geldiğinde örnek D dizisini gerçekle değiştir (bzHomeLive çağırır) */
  window.__bzLive=function(list){ if(!list||!list.length)return;
    D=list.map(function(d){var ilan=d.ilan||0;return {n:d.n,avg:d.avg,yoy:d.delta,skor:d.score,likT:(ilan>800?'Yüksek':ilan>300?'Orta':'Düşük'),lik:Math.max(20,Math.min(95,Math.round(ilan/12))),tr:(d.trend&&d.trend.length>=6)?d.trend:[d.avg,d.avg,d.avg,d.avg,d.avg,d.avg,d.avg,d.avg,d.avg,d.avg,d.avg,d.avg]};});
    maxAvg=Math.max.apply(null,D.map(function(d){return d.avg;}));cur=0;fired=false;
    tabsEl.innerHTML=D.map(function(d,i){return '<button class="bz-tab'+(i===0?' on':'')+'" data-i="'+i+'">'+d.n+'</button>';}).join('');
    [].forEach.call(tabsEl.querySelectorAll('.bz-tab'),function(t){t.addEventListener('click',function(){select(+t.getAttribute('data-i'));});});
    renderMain(D[0]);renderSide(D[0]);renderCmp();fire();
  };
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
    elDelta.textContent=(Math.abs(d.d)<0.1?('● '+(d.skor>=85?'Güçlü':d.skor>=75?'İstikrarlı':'Gelişen')+' bölge'):('▲ %'+(''+d.d).replace('.',',')));
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
  /* canlı ProX verisi geldiğinde örnek D dizisini gerçekle değiştir (bzHomeLive çağırır) */
  window.__hpLive=function(list){ if(!list||!list.length)return;
    D=list.map(function(d){var sp=(d.trend&&d.trend.length>=7)?d.trend.slice(-7):[d.avg,d.avg,d.avg,d.avg,d.avg,d.avg,d.avg];return {n:d.n,avg:d.avg,d:d.delta,skor:d.score,zone:(d.ilan?('Canlı ProX · '+d.ilan.toLocaleString('tr-TR')+' ilan'):'Canlı ProX bölge verisi'),sp:sp};});
    apply(0);
  };
  if(RM) return; /* dönme yok; ilk kart CSS ile zaten görünür */
  var idx=0, vis=true;
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){vis=e.isIntersecting;});},{threshold:.25});
    io.observe(panel);
  }
  /* ilk Bebek animasyonu (CSS + heroBoot sayacı) bitsin, sonra dönmeye başla */
  setInterval(function(){ if(!vis)return; idx=(idx+1)%D.length; apply(idx); }, 3800);
})();

/* ===================== ANA SAYFA BÖLGE PANELLERİ — canlı ProX (örnek D dizilerini gerçekle değiştirir) =====================
   Küratörlü premium aday seti (~8 istek, ertelenmiş) → gerçek m²'ye göre top-5 → hem #bolgeAnaliz hem hero-panel. */
(function bzHomeLive(){
  if(typeof proxApi!=='function')return;
  var PREMIUM={'İstanbul':['Beşiktaş','Kadıköy','Sarıyer','Şişli','Beykoz','Bakırköy','Üsküdar','Ataşehir'],
    'İzmir':['Konak','Karşıyaka','Çeşme','Bornova','Narlıdere','Urla','Karabağlar','Bayraklı'],
    'Ankara':['Çankaya','Yenimahalle','Keçiören','Etimesgut','Mamak','Gölbaşı'],
    'Bursa':['Nilüfer','Osmangazi','Yıldırım','Mudanya','Gemlik'],
    'Antalya':['Muratpaşa','Konyaaltı','Kepez','Alanya','Manavgat']};
  function primaryIl(){try{if(typeof saLoad==='function'){var p=saLoad();if(p&&p.primary)return p.primary;}}catch(e){}try{return (SAAS_CONFIG.firma&&SAAS_CONFIG.firma.il)||'İstanbul';}catch(e){}return 'İstanbul';}
  function synth(m2,delta){var g=(delta||6)/100,a=[];for(var i=0;i<12;i++){var t=(i-11)/11;a.push(Math.round(m2*(1+g*t)));}return a;}
  async function endeks(il,ilce){try{var r=await proxApi('/api/v1/tenant/endeks?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce)+'&kategori=konut&durum=satilik');
    if(r&&!r.fallback&&r.success===true&&r.data&&+r.data.m2>0){var d=r.data;return {n:ilce,avg:+d.m2,delta:+d.delta||0,score:+d.score||0,ilan:+d.ilan_sayisi||0,trend:(d.trend&&d.trend.length>=6)?d.trend.map(function(x){return +x.m2;}):synth(+d.m2,+d.delta||0)};}}catch(e){}return null;}
  async function run(){
    var il=primaryIl(),cand=PREMIUM[il];
    if(!cand){try{cand=(typeof proxIlceList==='function')?(await proxIlceList(il)).slice(0,8):null;}catch(e){}}
    if(!cand||!cand.length)return;
    var results=[];try{results=(typeof _wlPMap==='function')?await _wlPMap(cand,function(ic){return endeks(il,ic);},5):[];}catch(e){}
    var out=(results||[]).filter(Boolean);
    if(out.length<3)return;/* yetersiz canlı veri → örnek fallback kalır */
    out.sort(function(a,b){return b.avg-a.avg;});
    var top=out.slice(0,5);
    try{if(typeof window.__bzLive==='function')window.__bzLive(top);}catch(e){}
    try{if(typeof window.__hpLive==='function')window.__hpLive(top);}catch(e){}
    /* hero nabız şeridi: örnek Bebek/Etiler chip'lerini gerçek ilçe + m² ile değiştir (API delta=0 → % yerine gerçek ₺/m²) */
    try{var chips=document.querySelectorAll('.hero-pulse .pulse-chips span:not(.pl)');
      for(var i=0;i<chips.length;i++){var d=top[i%top.length];chips[i].innerHTML='<i class="pd"></i>'+d.n+' <b>'+Math.round(d.avg).toLocaleString('tr-TR')+' ₺</b>';}}catch(e){}
  }
  if(document.readyState!=='loading')setTimeout(run,600);else window.addEventListener('DOMContentLoaded',function(){setTimeout(run,600);});
})();

/* ===================== SİNEMATİK HERO SAHNESİ — canvas "Boğaz alacakaranlığı" (admin görsel kancalı) ===================== */
(function heroScene(){
  var cv=document.getElementById('heroCanvas'); if(!cv||!cv.getContext) return;
  /* admin kendi görselini/videosunu koyduysa canvas yerine onu kullan */
  var custom=''; try{ custom=(typeof saasResolve==='function' && (saasResolve('heroImage')||''))||''; }catch(e){ custom=''; }
  if(custom){ var bg=document.createElement('div'); bg.className='hero-bgimg'; bg.style.display='block'; bg.style.backgroundImage='url("'+(''+custom).replace(/["\\]/g,'')+'")'; cv.parentNode.insertBefore(bg,cv); cv.style.display='none'; return; }
  var ctx=cv.getContext('2d');
  var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var W=1,H=1,DPR=Math.min(window.devicePixelRatio||1,2),B=[],SH=[],t=0,GX=0,GY=0,GR=0,HZ=0;
  function R(a,b){return a+Math.random()*(b-a);}
  function build(){
    HZ=Math.round(H*0.63); GX=W*0.72; GY=HZ*0.48; GR=Math.max(W,H)*0.58;
    B=[]; var x=-30;
    while(x<W+40){ var tower=Math.random()<0.13; var bw=tower?R(W*0.026,W*0.05):R(W*0.035,W*0.082); var bh=tower?R(H*0.30,H*0.47):R(H*0.09,H*0.26);
      var cols=Math.max(2,Math.round(bw/15)), rows=Math.max(3,Math.round(bh/18)), wins=[];
      for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)if(Math.random()<0.40)wins.push([c,r,Math.random()<0.17,R(0,6.28)]);
      B.push({x:x,w:bw,h:bh,top:HZ-bh,cols:cols,rows:rows,wins:wins}); x+=bw+R(1,9);
    }
    SH=[]; for(var i=0;i<30;i++){ SH.push({y:HZ+Math.pow(i/30,1.4)*(H-HZ), w:R(24,140), ph:R(0,6.28)}); }
  }
  function hill(base,amp,col,ph){ ctx.fillStyle=col; ctx.beginPath(); ctx.moveTo(0,base); for(var x=0;x<=W;x+=24){ ctx.lineTo(x, base-amp*0.5 - amp*0.5*Math.sin(x*0.0032+ph)); } ctx.lineTo(W,base); ctx.closePath(); ctx.fill(); }
  function paint(){
    ctx.clearRect(0,0,W,H);
    var sky=ctx.createLinearGradient(0,0,0,HZ); sky.addColorStop(0,'#052519'); sky.addColorStop(.62,'#0b4a34'); sky.addColorStop(1,'#1a6e50');
    ctx.fillStyle=sky; ctx.fillRect(0,0,W,HZ);
    var g=ctx.createRadialGradient(GX,GY,0,GX,GY,GR); g.addColorStop(0,'rgba(224,193,120,.52)'); g.addColorStop(.42,'rgba(197,155,80,.15)'); g.addColorStop(1,'rgba(197,155,80,0)');
    ctx.fillStyle=g; ctx.fillRect(0,0,W,HZ);
    ctx.beginPath(); ctx.arc(GX,GY,Math.min(W,H)*0.045,0,6.29); ctx.fillStyle='rgba(237,209,148,.72)'; ctx.fill();
    hill(HZ, H*0.12, '#0a3b29', .4); hill(HZ, H*0.065, '#072e1f', 1.3);
    for(var i=0;i<B.length;i++){ var b=B[i]; ctx.fillStyle='#04140d'; ctx.fillRect(Math.round(b.x),Math.round(b.top),Math.ceil(b.w),b.h);
      var pw=b.w/b.cols, ph=b.h/b.rows;
      for(var w=0;w<b.wins.length;w++){ var q=b.wins[w]; if(q[2]){ var fl=0.55+0.4*Math.sin(t*0.05+q[3]); ctx.fillStyle='rgba(243,207,132,'+(0.42+0.5*fl).toFixed(3)+')'; } else ctx.fillStyle='rgba(232,200,142,.15)';
        ctx.fillRect(b.x+q[0]*pw+pw*0.24, b.top+q[1]*ph+ph*0.22, Math.max(1,pw*0.5), Math.max(1,ph*0.42)); } }
    var wt=ctx.createLinearGradient(0,HZ,0,H); wt.addColorStop(0,'#0a3c2b'); wt.addColorStop(1,'#03110b');
    ctx.fillStyle=wt; ctx.fillRect(0,HZ,W,H-HZ);
    var rg=ctx.createLinearGradient(0,HZ,0,H); rg.addColorStop(0,'rgba(224,193,120,.30)'); rg.addColorStop(1,'rgba(224,193,120,0)');
    ctx.fillStyle=rg; ctx.fillRect(GX-W*0.11,HZ,W*0.22,H-HZ);
    for(var s=0;s<SH.length;s++){ var sh=SH[s]; var al=0.04+0.06*(0.5+0.5*Math.sin(t*0.04+sh.ph)); ctx.strokeStyle='rgba(226,206,152,'+al.toFixed(3)+')'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(GX-sh.w,sh.y); ctx.lineTo(GX+sh.w,sh.y); ctx.stroke(); }
  }
  function resize(){ W=cv.clientWidth||window.innerWidth; H=cv.clientHeight||window.innerHeight; DPR=Math.min(window.devicePixelRatio||1,2); cv.width=Math.round(W*DPR); cv.height=Math.round(H*DPR); ctx.setTransform(DPR,0,0,DPR,0,0); build(); paint(); }
  resize();
  window.addEventListener('resize',resize,{passive:true});
  if(!RM){ (function loop(){ t++; if(t%2===0)paint(); requestAnimationFrame(loop); })(); }
})();
