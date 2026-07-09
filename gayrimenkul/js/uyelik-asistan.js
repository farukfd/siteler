/* ============================================================================
   Meridyen Gayrimenkul — ÜYELİK + ÜYE HESABI + ProX ASİSTAN (satış) + ADMİN TAKİP
   Tek modül; app.js'ten SONRA yüklenir (proxApi, ILANLAR, mountSaaSMenu, submitLead,
   admPane, openAdmin globallerine dayanır). DOM+CSS'i kendi enjekte eder → app.js/index.html
   neredeyse dokunulmaz. insaat/ paketinin gayrimenkul'e uyarlanmış eşdeğeri.
   ========================================================================== */
(function () {
  'use strict';
  var GM_USERS = 'gm_users_v1', GM_SESS = 'gm_session_v1', PA_STORE = 'prox_asistan_gm_convos_v1';

  /* ---------- yardımcılar ---------- */
  function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  window._paEsc = window._paEsc || esc;
  function uasBrand(){try{var e=document.querySelector('.logo,.siteLogo');var t=e&&e.textContent&&e.textContent.trim();return t||'Meridyen Gayrimenkul';}catch(_){return 'Meridyen Gayrimenkul';}}
  function gmHomeSafe(){try{if(typeof closeAllOverlays==='function')closeAllOverlays();}catch(e){}}

  /* ===================== 1) ÜYELİK MOTORU (SHA-256 + salt) ===================== */
  async function _authHash(pw,salt){var buf=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(salt+'::'+pw));return Array.from(new Uint8Array(buf)).map(function(b){return b.toString(16).padStart(2,'0');}).join('');}
  function _authUsers(){try{return JSON.parse(localStorage.getItem(GM_USERS)||'{}');}catch(e){return {};}}
  function _authSaveUsers(u){try{localStorage.setItem(GM_USERS,JSON.stringify(u));}catch(e){}}
  function authSession(){try{return JSON.parse(localStorage.getItem(GM_SESS)||'null');}catch(e){return null;}}
  function _authSetSession(s){try{if(s)localStorage.setItem(GM_SESS,JSON.stringify(s));else localStorage.removeItem(GM_SESS);}catch(e){}applyAuthUI();}
  async function authRegister(name,email,pw){
    name=(name||'').trim();email=(email||'').trim().toLowerCase();
    if(name.length<2)return{err:'Lütfen ad soyad girin.'};
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return{err:'Geçerli bir e-posta girin.'};
    if((pw||'').length<6)return{err:'Şifre en az 6 karakter olmalı.'};
    var users=_authUsers();if(users[email])return{err:'Bu e-posta zaten kayıtlı. Giriş yapın.'};
    var salt='s'+Date.now().toString(36)+Math.random().toString(36).slice(2);
    users[email]={name:name,email:email,salt:salt,hash:await _authHash(pw,salt),createdAt:new Date().toISOString()};
    _authSaveUsers(users);_authSetSession({email:email,name:name,ts:Date.now()});return{ok:true};
  }
  async function authLogin(email,pw){
    email=(email||'').trim().toLowerCase();var u=_authUsers()[email];
    if(!u)return{err:'Bu e-postayla kayıt bulunamadı. Önce kayıt olun.'};
    if(await _authHash(pw,u.salt)!==u.hash)return{err:'E-posta veya şifre hatalı.'};
    _authSetSession({email:email,name:u.name,ts:Date.now()});return{ok:true};
  }
  function authLogout(){_authSetSession(null);}
  function applyAuthUI(){
    var s=authSession();
    document.querySelectorAll('.js-giris').forEach(function(g){
      if(s){g.textContent=(s.name||'').split(' ')[0]||'Hesabım';g.classList.add('logged');g.setAttribute('title',s.name+' · '+s.email);}
      else{g.textContent='Giriş';g.classList.remove('logged');g.removeAttribute('title');}
    });
  }
  function openGiris(){uasEnsureDom();var m=document.getElementById('girisModal');if(!m)return;m.classList.add('on');var s=authSession();if(s){_authFillProfile();girisTab('profile');}else girisTab('login');}
  function closeGiris(){var m=document.getElementById('girisModal');if(m)m.classList.remove('on');}
  function _authFillProfile(){var s=authSession();if(!s)return;var n=document.getElementById('au_pname'),e=document.getElementById('au_pmail'),a=document.getElementById('au_pav');if(n)n.textContent=s.name;if(e)e.textContent=s.email;if(a)a.textContent=((s.name||'M').trim()[0]||'M').toUpperCase();}
  function girisTab(t){
    ['login','register','profile','kurumsal'].forEach(function(p){var el=document.getElementById('gp_'+p);if(el)el.hidden=(p!==t);});
    var lb=document.getElementById('gt_login'),rb=document.getElementById('gt_register'),tabs=document.getElementById('gm_authtabs');
    if(lb)lb.classList.toggle('act',t==='login');if(rb)rb.classList.toggle('act',t==='register');
    if(tabs)tabs.style.display=(t==='login'||t==='register')?'flex':'none';
    var tt=document.getElementById('gm_title');
    if(tt)tt.textContent=(t==='register')?'Meridyen Gayrimenkul · Kayıt Ol':(t==='profile')?'Hesabım':(t==='kurumsal')?'Kurumsal Erişim':'Meridyen Gayrimenkul · Üye Girişi';
  }
  async function authDoLogin(){var err=document.getElementById('au_lerr');err.style.color='#ff8a8a';var r=await authLogin((document.getElementById('au_lemail')||{}).value,(document.getElementById('au_lpass')||{}).value);if(r.err){err.textContent='⚠ '+r.err;return;}err.style.color='#4ade80';err.textContent='✓ Giriş başarılı, hoş geldiniz.';setTimeout(closeGiris,650);}
  async function authDoRegister(){var err=document.getElementById('au_rerr');err.style.color='#ff8a8a';var kv=document.getElementById('au_rkvkk');if(kv&&!kv.checked){err.textContent='⚠ Lütfen KVKK onayı verin.';return;}var r=await authRegister((document.getElementById('au_rname')||{}).value,(document.getElementById('au_remail')||{}).value,(document.getElementById('au_rpass')||{}).value);if(r.err){err.textContent='⚠ '+r.err;return;}err.style.color='#4ade80';err.textContent='✓ Hesabınız oluşturuldu, giriş yapıldı.';setTimeout(closeGiris,750);}
  function authDoLogout(){authLogout();closeGiris();}

  /* ===================== 2) ÜYE HESABI (profil/favori/teklif) ===================== */
  function _uKey(p){var s=authSession();return s?('gm_'+p+'_'+s.email):null;}
  function _uGet(p,def){var k=_uKey(p);if(!k)return def;try{var v=JSON.parse(localStorage.getItem(k));return v==null?def:v;}catch(e){return def;}}
  function _uSet(p,v){var k=_uKey(p);if(k)try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  async function authUpdateProfile(name,phone){var s=authSession();if(!s)return{err:'Giriş yapın.'};name=(name||'').trim();if(name.length<2)return{err:'Ad soyad gerekli.'};var users=_authUsers(),u=users[s.email];if(u){u.name=name;u.phone=(phone||'').trim();_authSaveUsers(users);}_authSetSession({email:s.email,name:name,ts:Date.now()});return{ok:true};}
  async function authChangePassword(cur,nw){var s=authSession();if(!s)return{err:'Giriş yapın.'};var users=_authUsers(),u=users[s.email];if(!u)return{err:'Kullanıcı bulunamadı.'};if(await _authHash(cur,u.salt)!==u.hash)return{err:'Mevcut şifre hatalı.'};if((nw||'').length<6)return{err:'Yeni şifre en az 6 karakter olmalı.'};var salt='s'+Date.now().toString(36)+Math.random().toString(36).slice(2);u.salt=salt;u.hash=await _authHash(nw,salt);_authSaveUsers(users);return{ok:true};}
  function authFavs(){var f=_uGet('fav',[]);return Array.isArray(f)?f:[];}
  function authIsFav(id){return authFavs().indexOf(String(id))>=0;}
  function authToggleFav(id){id=String(id);var f=authFavs(),i=f.indexOf(id);if(i>=0)f.splice(i,1);else f.unshift(id);_uSet('fav',f);return i<0;}
  function _ilanById(id){try{if(typeof ILANLAR==='undefined')return null;for(var i=0;i<ILANLAR.length;i++){if(String(ILANLAR[i].id)===String(id))return ILANLAR[i];}}catch(e){}return null;}
  function _ilanImg(it){try{return (typeof imgSrc==='function')?imgSrc(it.img):(it.img||'');}catch(e){return '';}}
  function _priceTL(p){try{return (typeof p==='number')?p.toLocaleString('tr-TR')+' ₺':(p||'');}catch(e){return p||'';}}
  function authQuotes(){var q=_uGet('quotes',[]);return Array.isArray(q)?q:[];}
  async function authAddQuote(konu,mesaj){var s=authSession();if(!s)return{err:'Giriş yapın.'};var q={id:'q'+Date.now(),konu:konu||'Genel',mesaj:(mesaj||'').trim(),date:new Date().toISOString(),status:'pending',cevap:''};var arr=authQuotes();arr.unshift(q);_uSet('quotes',arr);
    try{if(typeof proxSubmitLead==='function'){var u=(_authUsers()[s.email]||{});proxSubmitLead({sourcePage:'hesap',formType:'teklif-talebi',name:s.name,email:s.email,phone:u.phone||'',message:q.mesaj,requestedService:q.konu});}}catch(e){}
    _quoteRespond(q.id,q.konu,q.mesaj);return{ok:true,id:q.id};}
  async function _quoteRespond(id,konu,mesaj){var reply='';var m=(mesaj||'').trim();
    try{var r=await proxApi('/api/v1/tenant/prox/ai',{method:'POST',body:{persona:'office',context:'default',prompt:'Sen Meridyen Gayrimenkul\'ün ProX Asistanısın — sıcak, satış odaklı bir emlak danışmanı. Müşteri "'+konu+'" konusunda bir talep formu doldurdu. GÖREV: mesajı DİKKATLE oku, gerçekte ne istediğini anla. Mesaj yalnızca selam ya da çok kısa/boşsa: kibarca selam ver, kendini tanıt ("Ben Meridyen Gayrimenkul ProX Asistanı") ve "'+konu+'" için ihtiyacı netleştirecek 1-2 KISA soru sor (konum/ilçe, bütçe, m², oda, satılık/kiralık) — hazır uzun metin DÖKME. Gerçek talep varsa: 2-3 cümlelik samimi ön değerlendirme ver ve müşteriyi ilanı görme / ücretsiz ekspertiz / portföy talebi gibi bir sonraki adıma yönlendir. Her durumda canlı danışmana davet et: telefon bırakırsa danışmanımız kısa sürede arar. Türkçe, kısa. Kesin fiyat verme, ücretsiz ekspertiz öner. Yanıtın ProX\'un doğrulanmış emlak verisine dayanır.',message:konu+' — '+(m||'(müşteri mesaj bırakmadı)')}});reply=(r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))))||'';}catch(e){}
    if(!reply){reply=(m.length<8)?('Merhaba, ben Meridyen Gayrimenkul ProX Asistanı 👋 “'+konu+'” konusunda yardımcı olmak isterim. Kısaca ihtiyacınızı anlatır mısınız — hangi ilçe, bütçe, kaç oda? Dilerseniz telefon numaranızı bırakın, danışmanımız kısa sürede sizi arasın.'):('Talebinizi aldık. “'+konu+'” için uzman danışmanımız ProX verisiyle ön değerlendirme yapıp en kısa sürede size dönecek. Dilerseniz ücretsiz ekspertiz planlayalım ya da telefon numaranızı bırakın, sizi arayalım.');}
    var arr=authQuotes();for(var i=0;i<arr.length;i++){if(arr[i].id===id){arr[i].status='answered';arr[i].cevap=reply;break;}}_uSet('quotes',arr);
    try{var hp=document.getElementById('hesapPage');if(hp&&hp.classList.contains('on')&&!document.getElementById('hs_teklifler').hidden)_hesapRenderQuotes();}catch(e){}}

  function openHesap(){uasEnsureDom();if(!authSession()){openGiris();girisTab('login');return;}var ov=document.getElementById('hesapPage');if(!ov)return;gmHomeSafe();closeProxAsistanPage();renderHesap();ov.classList.add('on');document.body.style.overflow='hidden';ov.scrollTop=0;}
  function closeHesap(){var ov=document.getElementById('hesapPage');if(ov)ov.classList.remove('on');document.body.style.overflow='';}
  function girisOrHesap(){if(authSession())openHesap();else openGiris();}
  var _hesapCurTab='teklifler';
  function renderHesap(){var s=authSession();if(!s)return;var u=_authUsers()[s.email]||{};var g=function(id){return document.getElementById(id);};if(g('hs_name'))g('hs_name').value=s.name;if(g('hs_email'))g('hs_email').textContent=s.email;if(g('hs_phone'))g('hs_phone').value=u.phone||'';if(g('hs_av'))g('hs_av').textContent=((s.name||'M').trim()[0]||'M').toUpperCase();if(g('hs_welcome'))g('hs_welcome').textContent=(s.name||'').split(' ')[0];if(g('hs_favcount'))g('hs_favcount').textContent=authFavs().length;if(g('hs_qcount'))g('hs_qcount').textContent=authQuotes().length;_hesapTab(_hesapCurTab||'teklifler');}
  function _hesapTab(t){_hesapCurTab=t;['profil','favoriler','teklifler'].forEach(function(p){var pane=document.getElementById('hs_'+p),tab=document.getElementById('hst_'+p);if(pane)pane.hidden=(p!==t);if(tab)tab.classList.toggle('act',p===t);});if(t==='favoriler')_hesapRenderFavs();if(t==='teklifler')_hesapRenderQuotes();}
  function _hesapRenderFavs(){var g=document.getElementById('hs_favgrid');if(!g)return;var favs=authFavs();if(!favs.length){g.innerHTML='<div class="hs-empty">💛 Henüz favoriniz yok. İlan kartlarındaki ❤️ ile ekleyin.</div>';return;}g.innerHTML=favs.map(function(id){var it=_ilanById(id);if(!it)return '';var src=_ilanImg(it);return '<div class="hs-favcard"><div class="fimg">'+(src?'<img src="'+src+'" alt="'+esc(it.title)+'" loading="lazy">':'')+'<button class="lc-fav on" data-fid="'+esc(id)+'" onclick="hesapToggleFav(\''+esc(id)+'\',this,true)" aria-label="Favoriden çıkar">♥</button></div><div class="fbody"><div class="ft">'+esc(it.title)+'</div><div class="fl">📍 '+esc([it.ilce,it.mah].filter(Boolean).join(' / '))+' · '+esc(it.op||'')+'</div><div class="fp">'+esc(_priceTL(it.price))+'</div><button class="hs-linkbtn" onclick="closeHesap();(typeof openDet===\'function\'&&openDet('+(+id)+'))">İlanı Gör →</button></div></div>';}).join('');}
  function _hesapRenderQuotes(){var l=document.getElementById('hs_qlist');if(!l)return;var qs=authQuotes();if(!qs.length){l.innerHTML='<div class="hs-empty">Henüz talebiniz yok — yukarıdaki formdan hızlı teklif/talep gönderin.</div>';return;}l.innerHTML=qs.map(function(q){var answered=q.status==='answered';var ds='';try{var d=new Date(q.date);ds=d.toLocaleDateString('tr-TR')+' · '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});}catch(e){}return '<div class="hs-quote"><div class="qhead"><div><div class="qk">'+esc(q.konu)+'</div><div class="qd">'+ds+'</div></div><span class="qbadge '+(answered?'ok':'wait')+'">'+(answered?'✓ Yanıtlandı':'⏳ Yanıt bekliyor')+'</span></div>'+(q.mesaj?'<div class="qmsg">“'+esc(q.mesaj)+'”</div>':'')+(answered?'<div class="qcevap"><b>ProX ön değerlendirme</b><p>'+esc(q.cevap)+'</p></div>':'<div class="qpending"><span class="pa-typing"><i></i><i></i><i></i></span> ProX yanıt hazırlıyor…</div>')+'</div>';}).join('');}
  function hesapToggleFav(id,btn,fromList){if(!authSession()){openGiris();return;}var on=authToggleFav(id);if(btn)btn.classList.toggle('on',on);try{document.querySelectorAll('.lc-fav[data-fid="'+id+'"]').forEach(function(b){b.classList.toggle('on',on);b.innerHTML=on?'♥':'♡';});}catch(e){}if(fromList){var fp=document.getElementById('hs_favoriler');if(fp&&!fp.hidden)_hesapRenderFavs();}}
  async function hesapSaveProfile(){var m=document.getElementById('hs_pmsg');m.style.color='#ff8a8a';var r=await authUpdateProfile(document.getElementById('hs_name').value,document.getElementById('hs_phone').value);if(r.err){m.textContent='⚠ '+r.err;return;}m.style.color='#4ade80';m.textContent='✓ Bilgileriniz güncellendi.';renderHesap();}
  async function hesapChangePw(){var m=document.getElementById('hs_pwmsg');m.style.color='#ff8a8a';var b=document.getElementById('hs_pw1').value,c=document.getElementById('hs_pw2').value;if(b!==c){m.textContent='⚠ Yeni şifreler eşleşmiyor.';return;}var r=await authChangePassword(document.getElementById('hs_pw0').value,b);if(r.err){m.textContent='⚠ '+r.err;return;}m.style.color='#4ade80';m.textContent='✓ Şifreniz güncellendi.';['hs_pw0','hs_pw1','hs_pw2'].forEach(function(id){document.getElementById(id).value='';});}
  async function hesapQuickQuote(){var m=document.getElementById('hq_msg');var r=await authAddQuote(document.getElementById('hq_konu').value,document.getElementById('hq_mesaj').value);if(r.err){m.style.color='#ff8a8a';m.textContent='⚠ '+r.err;return;}m.style.color='#4ade80';m.textContent='✓ Talebiniz alındı, ProX yanıt hazırlıyor.';document.getElementById('hq_mesaj').value='';_hesapRenderQuotes();}

  /* ===================== 3) ProX ASİSTAN (tam-ekran satış) ===================== */
  var _paMsgs=[], _paBusy=false, _paConvos=[], _paCurId=null;
  var PA_SUGGESTS=['Satılık ev / daire arıyorum','Kiralık arıyorum','Mülkümü satmak / kiralamak istiyorum','Değerleme / ekspertiz istiyorum'];
  var PA_GREET='Merhaba, ben Meridyen Gayrimenkul ProX Asistanı 👋 Size nasıl yardımcı olabilirim? Satılık ya da kiralık mı arıyorsunuz, mülkünüzü mü değerlendirmek istiyorsunuz, yoksa değerleme mi? Sizi dinliyorum — doğru gayrimenkule birlikte ulaşalım. Yanıtlarım, Türkiye’nin en kapsamlı emlak veritabanı ProX’un +1 milyar doğrulanmış veri noktasına dayanır.';
  var PA_SYS='Sen Meridyen Gayrimenkul’ün ProX Asistanısın — sıcak, samimi ve SATIŞ ODAKLI bir emlak danışmanı. ANA GÖREVİN: ziyaretçiyi DİNLEYEREK gerçek ihtiyacını anlamak ve onu Meridyen Gayrimenkul’ün ilanları, Özel Portföyü ve hizmetleriyle eşleştirerek MÜŞTERİYE dönüştürmek.\n\nDAVRANIŞ KURALLARI:\n1) SELAMLAŞMA yalnızca konuşmanın İLK yanıtında olur: kısa selam ver, kendini tanıt ("Ben Meridyen Gayrimenkul ProX Asistanı") ve müşteriye ne aradığını SOR. "Önceki konuşma" verilmişse ARTIK selamlaşma/kendini tekrar tanıtma — doğrudan konuya devam et. ASLA hazır uzun metin DÖKME.\n2) Önce NİYETİ anla: müşteri (a) satılık ev/daire mi arıyor, (b) kiralık mı, (c) mülkünü SATMAK/KİRAYA vermek mi istiyor, (d) DEĞERLEME/ekspertiz mi, (e) YATIRIM danışmanlığı mı, (f) Özel Portföy mü? Emin değilsen 1-2 KISA soruyla netleştir (hangi il/ilçe, bütçe, m², kaç oda, satılık/kiralık).\n3) İhtiyacı anladıkça İLGİLİ ilanları/hizmetleri kısa ve çekici tanıt; müşteriyi ilanı görme, ücretsiz ekspertiz, portföy talebi gibi bir sonraki adıma yönlendir. Güven ver, baskı yapma.\n4) Uygun her fırsatta müşteriyi CANLI danışmanımıza yönlendir: "Dilerseniz danışmanımız sizi arasın; telefon numaranızı bırakırsanız kısa sürede size ulaşırız."\n5) Müşteri telefon numarası PAYLAŞIRSA: teşekkür et ve "Danışmanımız kısa sürede sizinle iletişime geçecek" de.\n\nÜSLUP: Türkçe, kısa (2-4 cümle), sıcak, samimi, profesyonel. Yanıtların ProX’un +1 milyardan fazla GERÇEK ve DOĞRULANMIŞ emlak verisine dayanır; ProX bir yapay zekâ veya veri üreticisi DEĞİLDİR, veri uydurmazsın. Kesin fiyat/taahhüt verme; tahmini bilgi ver ve ücretsiz ekspertiz öner. Konu dışı sorularda kibarca gayrimenkul konusuna yönlendir.';
  function _paBizContext(){try{var arr=(typeof ILANLAR!=='undefined'&&ILANLAR&&ILANLAR.length)?ILANLAR.filter(function(i){return i.status!=='pasif';}).slice(0,8).map(function(i){return '• '+(i.title||'')+' ('+[i.op,i.type,[i.ilce,i.mah].filter(Boolean).join('/'),i.oda,(i.m2?i.m2+'m²':''),_priceTL(i.price)].filter(Boolean).join(', ')+')';}).join('\n'):'';var svc='HİZMETLER: Satılık/kiralık portföy, Özel Portföy (VIP erişim), değerleme/ekspertiz, bölge & yatırım analizi, alım-satım-kiralama danışmanlığı.';return (arr?('MERİDYEN GAYRİMENKUL GÜNCEL İLANLAR (müşteriye uygun olanı tanıt):\n'+arr+'\n\n'):'')+svc;}catch(e){return '';}}
  function _paPrompt(){var b=_paBizContext();return PA_SYS+(b?('\n\n'+b):'');}
  function _paHistCtx(){try{var h=_paMsgs.filter(function(m){return !m.typing&&m.text;});return h.slice(0,-1).slice(-6).map(function(m){return (m.role==='me'?'Müşteri':'Asistan')+': '+m.text;}).join('\n');}catch(e){return '';}}
  function _paLoadStore(){try{_paConvos=JSON.parse(localStorage.getItem(PA_STORE)||'[]');if(!Array.isArray(_paConvos))_paConvos=[];}catch(e){_paConvos=[];}}
  function _paSaveStore(){try{localStorage.setItem(PA_STORE,JSON.stringify(_paConvos.slice(0,50)));}catch(e){}}
  function _paCur(){for(var i=0;i<_paConvos.length;i++){if(_paConvos[i].id===_paCurId)return _paConvos[i];}return null;}
  function _paSyncCur(){var c=_paCur();if(!c)return;c.msgs=_paMsgs.filter(function(m){return !m.typing;});c.ts=Date.now();var f=null;for(var i=0;i<c.msgs.length;i++){if(c.msgs[i].role==='me'){f=c.msgs[i];break;}}if(f)c.title=f.text.slice(0,42);_paSaveStore();}
  function renderProxAsistanPage(){_paRenderHistory();_paRenderLog();_paSetTitle();}
  function _paRenderHistory(){var h=document.getElementById('paHistory');if(!h)return;if(!_paConvos.length){h.innerHTML='<div class="pa-hist-empty">Henüz konuşma yok — yeni bir sohbet başlatın.</div>';return;}h.innerHTML=_paConvos.map(function(c){return '<div class="pa-hist'+(c.id===_paCurId?' act':'')+'" onclick="paLoadConvo(\''+c.id+'\')"><span class="t">'+esc(c.title||'Sohbet')+'</span><button class="del" onclick="paDelConvo(\''+c.id+'\',event)" aria-label="Sil">🗑</button></div>';}).join('');}
  function _paRenderLog(){var log=document.getElementById('paLog');if(!log)return;var real=_paMsgs.filter(function(m){return !m.typing;});if(!real.length){log.innerHTML='<div class="pa-welcome"><div class="w-logo">💬</div><h2><span class="prox-logo">Pro<span class="prox-x">X</span></span> Asistan</h2><p>'+esc(PA_GREET)+'</p><div class="pa-suggests">'+PA_SUGGESTS.map(function(s){return '<div class="pa-chip" onclick="paAsk(this.textContent)">'+esc(s)+'</div>';}).join('')+'</div></div>';return;}log.innerHTML='<div class="pa-log-inner">'+_paMsgs.map(function(m){var me=m.role==='me';var body=m.typing?'<span class="pa-typing"><i></i><i></i><i></i></span>':esc(m.text);return '<div class="pa-msg '+(me?'me':'bot')+'"><div class="av">'+(me?'S':'X')+'</div><div class="pa-bubble">'+body+'</div></div>';}).join('')+'</div>';log.scrollTop=log.scrollHeight;}
  function _paSetTitle(){var t=document.getElementById('paTitle');if(!t)return;var c=_paCur();t.innerHTML=(c&&c.title)?esc(c.title):'<span class="prox-logo">Pro<span class="prox-x">X</span></span> Asistan';}
  function paNewChat(){_paCurId=null;_paMsgs=[];_paRenderLog();_paRenderHistory();_paSetTitle();var sb=document.getElementById('paSb');if(sb)sb.classList.remove('open');var i=document.getElementById('paInput');if(i){i.value='';i.focus();}}
  function paLoadConvo(id){var c=null;for(var i=0;i<_paConvos.length;i++){if(_paConvos[i].id===id)c=_paConvos[i];}if(!c)return;_paCurId=id;_paMsgs=(c.msgs||[]).slice();_paRenderLog();_paRenderHistory();_paSetTitle();var sb=document.getElementById('paSb');if(sb)sb.classList.remove('open');}
  function paDelConvo(id,ev){if(ev){ev.stopPropagation();ev.preventDefault();}_paConvos=_paConvos.filter(function(c){return c.id!==id;});_paSaveStore();if(_paCurId===id)paNewChat();else _paRenderHistory();}
  function paAsk(q){var i=document.getElementById('paInput');if(i)i.value=q;paSend();}
  async function paSend(ev){
    if(ev&&ev.preventDefault)ev.preventDefault();
    if(_paBusy)return false;
    var inp=document.getElementById('paInput');var q=((inp&&inp.value)||'').trim();if(!q)return false;
    inp.value='';inp.style.height='';
    var _ps=authSession();
    if(!_paCurId){_paCurId='c'+Date.now();_paConvos.unshift({id:_paCurId,title:q.slice(0,42),msgs:[],ts:Date.now(),user:_ps?_ps.name:'',email:_ps?_ps.email:''});}
    _paMsgs.push({role:'me',text:q});_paRenderLog();_paSyncCur();_paRenderHistory();_paSetTitle();
    try{var _ph=q.match(/(?:\+?90[\s.\-]?)?0?5\d{2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/);if(_ph&&typeof proxSubmitLead==='function'){var _pn=_ph[0].replace(/[^\d+]/g,'');proxSubmitLead({sourcePage:'asistan',formType:'prox-asistan',name:_ps?_ps.name:'ProX Asistan ziyaretçisi',phone:_pn,email:_ps?_ps.email:'',message:q,requestedService:'ProX Asistan görüşmesi — geri arama talebi'});var _cc=_paCur();if(_cc){_cc.lead=true;_cc.phone=_pn;_paSaveStore();}}}catch(e){}
    _paBusy=true;var btn=document.querySelector('#proxAsistanPage .pa-send');if(btn)btn.disabled=true;
    _paMsgs.push({role:'bot',typing:true});_paRenderLog();
    var persona=(window.EMLAK_TENANT&&EMLAK_TENANT.proxPersona)||'office';
    var _hist=_paHistCtx();
    var _messages=_paMsgs.filter(function(m){return !m.typing&&m.text;}).map(function(m){return {role:(m.role==='me'?'user':'assistant'),content:m.text};});
    try{
      var r=await proxApi('/api/v1/tenant/prox/ai',{method:'POST',body:{persona:persona,context:_hist||'default',prompt:_paPrompt(),messages:_messages,message:(_hist?('Önceki konuşma:\n'+_hist+'\n\nMüşterinin yeni mesajı: '):'')+q}});
      _paMsgs=_paMsgs.filter(function(m){return !m.typing;});
      var ans=(r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))))||'';
      if(!ans||(r&&r.fallback))ans=_paFallback();
      _paMsgs.push({role:'bot',text:ans});
    }catch(e){_paMsgs=_paMsgs.filter(function(m){return !m.typing;});_paMsgs.push({role:'bot',text:_paFallback()});}
    _paRenderLog();_paSyncCur();
    _paBusy=false;if(btn)btn.disabled=false;
    return false;
  }
  function _paFallback(){return 'Şu an ProX veri servisine ulaşılamıyor gibi görünüyor. Sorunuzu aldım — dilerseniz telefon numaranızı bırakın, danışmanımız kısa sürede sizi arasın; WhatsApp hattımızdan da yazabilirsiniz.';}
  function openProxAsistanPage(){uasEnsureDom();var ov=document.getElementById('proxAsistanPage');if(!ov)return;gmHomeSafe();closeHesap();_paLoadStore();renderProxAsistanPage();ov.classList.add('on');document.body.style.overflow='hidden';setTimeout(function(){var i=document.getElementById('paInput');if(i)i.focus();},90);}
  function closeProxAsistanPage(){var ov=document.getElementById('proxAsistanPage');if(ov)ov.classList.remove('on');document.body.style.overflow='';}

  /* ===================== 4) ADMİN: GÖRÜŞMELER & TEKLİFLER PANOSU ===================== */
  function _gJSON(k,f){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v;}catch(e){return f;}}
  function _gDate(x){try{return new Date(x).toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
  function renderGorusmeler(){
    var host=document.getElementById('gorusmelerBody');if(!host)return;
    var convos=_gJSON(PA_STORE,[]);if(!Array.isArray(convos))convos=[];
    var users=_gJSON(GM_USERS,{})||{};
    var quotes=[];try{for(var i=0;i<localStorage.length;i++){var kk=localStorage.key(i);if(kk&&kk.indexOf('gm_quotes_')===0){var em=kk.slice(10);var arr=_gJSON(kk,[]);if(Array.isArray(arr))arr.forEach(function(q){quotes.push(Object.assign({_email:em},q));});}}}catch(e){}
    quotes.sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''));});
    var fbLeads=_gJSON('emlak_leads_fallback',[]);if(!Array.isArray(fbLeads))fbLeads=[];
    var cb=[];convos.forEach(function(c){if(c.lead&&c.phone)cb.push({name:c.user||'ProX Asistan ziyaretçisi',phone:c.phone,when:c.ts,note:(c.title||''),src:'ProX Asistan'});});
    fbLeads.forEach(function(l){cb.push({name:l.name||'—',phone:l.phone||'',when:l.createdAt,note:l.requestedService||l.message||l.formType||'',src:(l.formType||l.sourcePage||'form')});});
    cb.sort(function(a,b){return (new Date(b.when||0))-(new Date(a.when||0));});
    var members=Object.keys(users).map(function(e){return Object.assign({email:e},users[e]||{});});
    members.sort(function(a,b){return String(b.createdAt||'').localeCompare(String(a.createdAt||''));});
    var uname=function(e){return (users[e]&&users[e].name)||e;},uphone=function(e){return (users[e]&&users[e].phone)||'';};
    var H='';
    H+='<div class="g-kpis"><div class="g-kpi"><b>'+convos.length+'</b><span>ProX görüşmesi</span></div><div class="g-kpi"><b>'+quotes.length+'</b><span>Talep / teklif</span></div><div class="g-kpi"><b>'+members.length+'</b><span>Kayıtlı üye</span></div><div class="g-kpi'+(cb.length?' hot':'')+'"><b>'+cb.length+'</b><span>Geri arama</span></div></div>';
    H+='<div class="g-sec"><h3>📞 Geri Arama Talepleri</h3>';
    if(!cb.length)H+='<div class="g-empty">Telefon bırakan müşteri yok. Müşteri asistanda numarasını paylaşınca burada listelenir.</div>';
    else{H+='<div class="g-tblwrap"><table class="g-tbl"><thead><tr><th>Ad</th><th>Telefon</th><th>Talep</th><th>Kaynak</th><th>Tarih</th><th></th></tr></thead><tbody>';cb.forEach(function(x){var tel=esc(x.phone);H+='<tr><td>'+esc(x.name)+'</td><td><b>'+tel+'</b></td><td>'+esc(x.note)+'</td><td>'+esc(x.src)+'</td><td>'+esc(_gDate(x.when))+'</td><td>'+(x.phone?'<a class="g-call" href="tel:'+tel.replace(/[^\d+]/g,'')+'">Ara</a>':'')+'</td></tr>';});H+='</tbody></table></div>';}
    H+='</div>';
    H+='<div class="g-sec"><h3>💬 ProX Asistan Görüşmeleri</h3>';
    if(!convos.length)H+='<div class="g-empty">Henüz görüşme yok. Kullanıcılar ProX Asistan ile konuştukça tam dökümleri burada görünür.</div>';
    else convos.forEach(function(c){var msgs=(c.msgs||[]).filter(function(m){return m&&m.text;});var who=c.user?(esc(c.user)+(c.email?(' <'+esc(c.email)+'>'):'')):'Anonim ziyaretçi';H+='<details class="g-convo"'+(c.lead?' data-lead="1"':'')+'><summary><span class="g-ct">'+esc(c.title||'Sohbet')+'</span><span class="g-cm">'+who+' · '+esc(_gDate(c.ts))+' · '+msgs.length+' mesaj'+(c.lead?' · <b class="g-leadtag">📞 '+esc(c.phone||'telefon')+'</b>':'')+'</span></summary><div class="g-transcript">';if(!msgs.length)H+='<div class="g-empty">Boş görüşme.</div>';msgs.forEach(function(m){var me=m.role==='me';H+='<div class="g-line '+(me?'me':'bot')+'"><span class="who">'+(me?'Müşteri':'ProX')+'</span><span class="tx">'+esc(m.text)+'</span></div>';});H+='</div></details>';});
    H+='</div>';
    H+='<div class="g-sec"><h3>🧾 Üye Talepleri / Teklifleri</h3>';
    if(!quotes.length)H+='<div class="g-empty">Henüz talep yok. Üyeler hesabından gönderince burada listelenir.</div>';
    else quotes.forEach(function(q){var st=q.status==='answered';H+='<div class="g-quote"><div class="g-qhead"><b>'+esc(q.konu||'Genel')+'</b><span class="g-qst '+(st?'ok':'wait')+'">'+(st?'✓ Yanıtlandı':'⏳ Bekliyor')+'</span></div><div class="g-qmeta">'+esc(uname(q._email))+' · '+esc(q._email)+(uphone(q._email)?(' · '+esc(uphone(q._email))):'')+' · '+esc(_gDate(q.date))+'</div>'+(q.mesaj?'<div class="g-qmsg">“'+esc(q.mesaj)+'”</div>':'<div class="g-qmsg g-muted">(mesaj yok)</div>')+(q.cevap?'<div class="g-qcevap"><b>ProX yanıtı:</b> '+esc(q.cevap)+'</div>':'')+'</div>';});
    H+='</div>';
    H+='<div class="g-sec"><h3>👤 Kayıtlı Üyeler</h3>';
    if(!members.length)H+='<div class="g-empty">Henüz kayıtlı üye yok.</div>';
    else{H+='<div class="g-tblwrap"><table class="g-tbl"><thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Telefon</th><th>Kayıt</th></tr></thead><tbody>';members.forEach(function(u){H+='<tr><td>'+esc(u.name||'—')+'</td><td>'+esc(u.email)+'</td><td>'+esc(u.phone||'—')+'</td><td>'+esc(_gDate(u.createdAt))+'</td></tr>';});H+='</tbody></table></div>';}
    H+='</div>';
    H+='<div class="g-note">🔒 Bu veriler bu tarayıcıda saklanır. Canlı yayında tüm görüşme ve teklifler ProX CRM’de merkezî toplanır; yetkili panelinden tüm cihazlardan takip edilir.</div>';
    host.innerHTML=H;
  }

  /* ===================== 5) DOM + CSS ENJEKSİYONU ===================== */
  var _domReady=false;
  function uasEnsureDom(){if(_domReady)return;_domReady=true;uasInjectCSS();uasInjectModals();}
  function uasInjectCSS(){
    if(document.getElementById('uas-css'))return;
    /* GERÇEK gayrimenkul AÇIK marka paleti — beyaz zemin, lacivert metin, mavi accent, ProX yeşili.
       Bileşen CSS'i bu sabitlerle parametrik → hepsi tutarlı AÇIK tema. accent/green tenant'tan gelir. */
    var A='var(--accent,#1e40af)',AC='var(--accent-2,#3b82f6)',INK='var(--ink,#0f1f3d)',MUT='var(--muted,#64748b)',LINE='var(--line,#e2e8f0)',
        SURF='#ffffff',SURF2='var(--surface-2,#f1f5fb)',BG='#f6f8fc',GREEN='var(--green,#34a853)',HEAD='var(--head,"Poppins",system-ui,sans-serif)',
        SHAD='var(--shadow-card,0 14px 36px -20px rgba(13,30,60,.22))';
    var css=''
    +'#uasRoot .prox-logo{font-weight:800;letter-spacing:.2px;color:inherit;white-space:nowrap;display:inline-flex;align-items:center;font-family:'+HEAD+'}'
    +'.uas-asistan .prox-x,#uasRoot .prox-x{display:inline-flex;align-items:center;justify-content:center;background:'+GREEN+';color:#04140c;border-radius:6px;padding:.02em .30em;margin-left:2px;line-height:1;font-size:.9em;font-weight:900}'
    +'.uas-asistan{display:inline-flex;align-items:center}'
    +'.siteCta .lang-sw{display:none!important}' /* dil üst menüden gizli — footer'da */
    +'.uas-footlang{display:inline-flex!important;align-items:center;gap:6px;margin-left:auto;margin-right:14px;opacity:.9}.uas-footlang select{cursor:pointer;background:transparent;border:1px solid currentColor;border-radius:8px;padding:3px 7px;font-weight:700;font-size:12px;color:inherit}'
    /* Giriş modal */
    +'.gmodal{position:fixed;inset:0;z-index:400;display:none;align-items:center;justify-content:center;padding:18px}.gmodal.on{display:flex}'
    +'.gm-ov{position:absolute;inset:0;background:rgba(4,8,18,.72);backdrop-filter:blur(3px)}'
    +'.gm-card{position:relative;width:100%;max-width:400px;background:'+SURF+';border:1px solid '+LINE+';border-radius:18px;padding:26px 24px;box-shadow:0 30px 80px -20px rgba(0,0,0,.6);color:'+INK+';font-family:'+HEAD+'}'
    +'.gm-x{position:absolute;top:12px;right:14px;background:none;border:0;color:'+MUT+';font-size:20px;cursor:pointer}'
    +'.gm-head{display:flex;align-items:center;gap:10px;font-weight:800;font-size:16px;margin-bottom:16px}.gm-head .mark{width:30px;height:30px;border-radius:8px;background:'+A+';color:#fff;display:grid;place-items:center;font-weight:800}'
    +'.gm-tabs{display:flex;gap:8px;margin-bottom:14px}.gm-tabs button{flex:1;background:'+SURF2+';border:1px solid '+LINE+';color:'+MUT+';border-radius:10px;padding:9px;font-weight:700;font-size:13px;cursor:pointer;transition:.15s}.gm-tabs button.act{background:'+A+';color:#fff;border-color:transparent}'
    +'.gm-pane label{display:block;font-size:12.5px;color:'+MUT+';margin:11px 0 5px;font-weight:600}'
    +'.gm-pane input[type=email],.gm-pane input[type=password],.gm-pane input:not([type]){width:100%;background:'+BG+';border:1px solid '+LINE+';border-radius:10px;padding:11px 13px;color:'+INK+';font-size:14px;box-sizing:border-box}'
    +'.gm-pane input:focus{outline:none;border-color:'+A+'}'
    +'.gm-btn{width:100%;margin-top:16px;background:'+A+';color:#fff;border:0;border-radius:10px;padding:12px;font-weight:700;font-size:14px;cursor:pointer;font-family:'+HEAD+'}.gm-btn:hover{filter:brightness(1.06)}'
    +'.gm-btn2{margin-top:8px;background:'+SURF2+';color:'+INK+';border:1px solid '+LINE+'}'
    +'.gm-err{min-height:16px;font-size:12.5px;margin-top:9px}'
    +'.gm-note{font-size:12.5px;color:'+MUT+';margin-top:13px;line-height:1.6}.gm-note a{color:'+AC+';text-decoration:none}'
    +'.gm-sub{font-size:13px;color:'+MUT+';margin:0 0 4px}'
    +'.gm-kvkk{display:flex;gap:8px;align-items:flex-start;margin-top:12px}.gm-kvkk label{margin:0;font-size:11.5px;line-height:1.45}.gm-kvkk input{margin-top:2px}'
    +'.au-prof{display:flex;align-items:center;gap:13px}.au-av{width:52px;height:52px;border-radius:50%;background:'+A+';color:#fff;display:grid;place-items:center;font-size:22px;font-weight:800}.au-pname{font-weight:800;font-size:16px}.au-pmail{color:'+MUT+';font-size:13px}'
    /* Tam-ekran ortak header */
    +'#proxAsistanPage,#hesapPage{position:fixed;inset:0;z-index:190;background:'+BG+';color:'+INK+';display:none;flex-direction:column;font-family:'+HEAD+'}#proxAsistanPage.on,#hesapPage.on{display:flex}'
    +'.uas-hdr{flex:0 0 auto;display:flex;align-items:center;gap:16px;padding:12px 26px;border-bottom:1px solid '+LINE+';background:#fff;position:sticky;top:0;z-index:6}'
    +'.uas-logo{display:inline-flex;align-items:center;gap:9px;font-weight:800;font-size:18px;color:'+INK+';text-decoration:none;cursor:pointer;font-family:'+HEAD+'}.uas-logo .mark{width:32px;height:32px;border-radius:9px;background:'+A+';color:#fff;display:grid;place-items:center;font-weight:800}.uas-logo b{color:'+A+';font-weight:800}'
    +'.uas-nav{display:flex;align-items:center;gap:2px;margin:0 auto}.uas-nav a{color:'+INK+';text-decoration:none;font-weight:600;font-size:14.5px;padding:9px 15px;border-radius:10px;display:inline-flex;align-items:center;cursor:pointer;font-family:'+HEAD+';white-space:nowrap}.uas-nav a:hover{background:'+SURF2+';color:'+A+'}.uas-nav .nb-x{display:inline-grid;place-items:center;width:1.35em;height:1.35em;background:'+A+';color:#fff;border-radius:6px;margin:0 4px;font-weight:800;font-size:.82em}'
    +'.uas-hdr-r{display:flex;align-items:center;gap:10px}'
    +'.uas-hlink{color:'+INK+';text-decoration:none;font-weight:700;font-size:14px;cursor:pointer;padding:8px 16px;border-radius:10px;border:1px solid '+LINE+'}.uas-hlink.logged::before{content:"";display:inline-block;width:7px;height:7px;border-radius:50%;background:'+GREEN+';margin-right:7px;vertical-align:middle}.uas-hlink:hover{border-color:'+A+';color:'+A+'}'
    +'.uas-close{background:'+SURF2+';color:'+INK+';border:1px solid '+LINE+';border-radius:10px;width:40px;height:40px;font-weight:700;font-size:16px;cursor:pointer;flex:0 0 auto}.uas-close:hover{background:'+LINE+'}'
    +'@media(max-width:900px){.uas-nav{display:none}.uas-hdr{padding:12px 18px}}'
    /* ProX Asistan app */
    +'.pa-app{flex:1;display:flex;min-height:0}'
    +'.pa-sb{flex:0 0 280px;background:'+SURF+';border-right:1px solid '+LINE+';display:flex;flex-direction:column;min-height:0}'
    +'.pa-sb-head{display:flex;gap:8px;padding:14px}.pa-newchat{flex:1;background:'+A+';color:#fff;border:0;border-radius:10px;padding:11px;font-weight:700;cursor:pointer;font-family:'+HEAD+'}.pa-sb-x{display:none;background:none;border:0;color:'+MUT+';font-size:18px;cursor:pointer}'
    +'.pa-hist-lbl{padding:4px 16px;font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:'+MUT+'}'
    +'.pa-history{flex:1;overflow:auto;padding:6px 10px}.pa-hist-empty{color:'+MUT+';font-size:13px;padding:12px}'
    +'.pa-hist{display:flex;align-items:center;gap:6px;padding:9px 11px;border-radius:9px;cursor:pointer;color:'+INK+';font-size:13.5px}.pa-hist:hover{background:'+SURF2+'}.pa-hist.act{background:'+SURF2+'}.pa-hist .t{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.pa-hist .del{background:none;border:0;color:'+MUT+';cursor:pointer;opacity:.6;font-size:12px}.pa-hist .del:hover{opacity:1}'
    +'.pa-sb-foot{padding:12px 16px;border-top:1px solid '+LINE+';font-size:11.5px;color:'+MUT+'}'
    +'.pa-main{flex:1;display:flex;flex-direction:column;min-width:0;min-height:0}'
    +'.pa-appbar{display:flex;align-items:center;gap:10px;padding:12px 20px;border-bottom:1px solid '+LINE+'}.pa-menu{display:none;background:none;border:0;color:'+INK+';font-size:20px;cursor:pointer}.pa-title{font-weight:800;font-size:15px}'
    +'.pa-log{flex:1;overflow:auto;padding:24px}'
    +'.pa-welcome{max-width:640px;margin:6vh auto 0;text-align:center}.pa-welcome .w-logo{font-size:40px}.pa-welcome h2{font-size:24px;margin:8px 0}.pa-welcome p{color:'+MUT+';line-height:1.7;font-size:15px}'
    +'.pa-suggests{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:20px}.pa-chip{background:'+SURF+';border:1px solid '+LINE+';border-radius:999px;padding:9px 16px;font-size:13.5px;cursor:pointer;color:'+INK+'}.pa-chip:hover{border-color:'+A+'}'
    +'.pa-log-inner{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:16px}'
    +'.pa-msg{display:flex;gap:12px;align-items:flex-start}.pa-msg.me{flex-direction:row-reverse}.pa-msg .av{width:30px;height:30px;flex:0 0 30px;border-radius:8px;display:grid;place-items:center;font-weight:800;font-size:13px}.pa-msg.me .av{background:'+A+';color:#fff}.pa-msg.bot .av{background:'+GREEN+';color:#04140c}'
    +'.pa-bubble{background:'+SURF+';border:1px solid '+LINE+';border-radius:14px;padding:12px 15px;font-size:14.5px;line-height:1.65;white-space:pre-wrap;max-width:78%}.pa-msg.me .pa-bubble{background:'+A+';color:#fff;border-color:transparent}'
    +'.pa-typing i{display:inline-block;width:7px;height:7px;border-radius:50%;background:'+MUT+';margin:0 2px;animation:paBlink 1.2s infinite}.pa-typing i:nth-child(2){animation-delay:.2s}.pa-typing i:nth-child(3){animation-delay:.4s}@keyframes paBlink{0%,60%,100%{opacity:.25}30%{opacity:1}}'
    +'.pa-composer{border-top:1px solid '+LINE+';padding:14px 20px}.pa-form{max-width:760px;margin:0 auto;display:flex;gap:10px;align-items:flex-end;background:'+SURF+';border:1px solid '+LINE+';border-radius:14px;padding:8px 8px 8px 14px}'
    +'.pa-form textarea{flex:1;background:none;border:0;color:'+INK+';font-size:14.5px;resize:none;max-height:140px;outline:none;font-family:'+HEAD+';padding:6px 0}'
    +'.pa-send{flex:0 0 auto;width:38px;height:38px;border-radius:10px;background:'+A+';color:#fff;border:0;cursor:pointer;font-size:15px}.pa-send:disabled{opacity:.5}'
    +'.pa-disc{max-width:760px;margin:8px auto 0;font-size:11px;color:'+MUT+';text-align:center}'
    +'@media(max-width:820px){.pa-sb{position:absolute;left:0;top:0;bottom:0;z-index:5;transform:translateX(-100%);transition:.25s}.pa-sb.open{transform:none}.pa-sb-x{display:block}.pa-menu{display:block}.pa-bubble{max-width:86%}}'
    /* Hesap sayfası */
    +'#hesapPage{overflow-y:auto}.hs-body{flex:1}.hs-wrap{max-width:1000px;margin:0 auto;padding:30px 20px 80px}'
    +'@keyframes hsRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}.hs-rv{animation:hsRise .5s cubic-bezier(.2,.7,.2,1) both}.hs-tabs.hs-rv{animation-delay:.05s}.hs-pane.hs-rv{animation-delay:.1s}'
    +'.hs-top{display:flex;align-items:center;gap:16px;background:'+SURF+';border:1px solid '+LINE+';border-radius:16px;padding:20px 22px;flex-wrap:wrap}'
    +'.hs-avatar{width:56px;height:56px;border-radius:50%;background:'+A+';color:#fff;display:grid;place-items:center;font-size:24px;font-weight:800}'
    +'.hs-hi .h{font-size:18px;font-weight:700}.hs-hi .s{color:'+MUT+';font-size:13px}'
    +'.hs-kpis{display:flex;gap:12px;margin-left:auto}.hs-kpi{background:'+BG+';border:1px solid '+LINE+';border-radius:12px;padding:10px 18px;text-align:center}.hs-kpi b{display:block;font-size:22px}.hs-kpi span{font-size:11.5px;color:'+MUT+'}'
    +'.hs-logout{background:'+SURF2+';color:'+INK+';border:1px solid '+LINE+';border-radius:10px;padding:9px 16px;font-weight:700;cursor:pointer}'
    +'.hs-tabs{display:flex;gap:8px;margin:20px 0}.hs-tabs button{background:'+SURF+';border:1px solid '+LINE+';color:'+MUT+';border-radius:10px;padding:10px 18px;font-weight:700;font-size:14px;cursor:pointer}.hs-tabs button.act{background:'+A+';color:#fff;border-color:transparent}'
    +'.hs-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:760px){.hs-grid{grid-template-columns:1fr}}'
    +'.hs-card{background:'+SURF+';border:1px solid '+LINE+';border-radius:16px;padding:20px 22px}.hs-card h3{margin:0 0 14px;font-size:16px}'
    +'.hs-card label{display:block;font-size:12.5px;color:'+MUT+';margin:11px 0 5px;font-weight:600}'
    +'.hs-card input,.hs-card select,.hs-card textarea{width:100%;background:'+BG+';border:1px solid '+LINE+';border-radius:10px;padding:11px 13px;color:'+INK+';font-size:14px;box-sizing:border-box;font-family:'+HEAD+'}'
    +'.hs-card input:focus,.hs-card select:focus,.hs-card textarea:focus{outline:none;border-color:'+A+'}.hs-card textarea{min-height:88px;resize:vertical}'
    +'.hs-ro{background:'+BG+';border:1px solid '+LINE+';border-radius:10px;padding:11px 13px;color:'+MUT+';font-size:14px}'
    +'.hs-btn{margin-top:16px;background:'+A+';color:#fff;border:0;border-radius:10px;padding:12px 20px;font-weight:700;cursor:pointer;font-family:'+HEAD+'}.hs-btn:hover{filter:brightness(1.06)}'
    +'.hs-msg{min-height:16px;font-size:12.5px;margin-top:9px}'
    +'.hs-quickq h3{margin-bottom:6px}.hs-qnote{font-size:11.5px;color:'+MUT+';margin-top:10px;line-height:1.5}'
    +'.hs-qlist{display:flex;flex-direction:column;gap:12px;margin-top:16px}'
    +'.hs-quote{background:'+SURF+';border:1px solid '+LINE+';border-radius:14px;padding:16px 18px}.hs-quote .qhead{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.hs-quote .qk{font-weight:700;font-size:15px}.hs-quote .qd{color:'+MUT+';font-size:12px;margin-top:2px}'
    +'.qbadge{flex:0 0 auto;font-size:12px;font-weight:700;padding:5px 11px;border-radius:999px}.qbadge.ok{background:rgba(25,195,125,.15);color:'+GREEN+'}.qbadge.wait{background:rgba(255,176,112,.14);color:'+AC+'}'
    +'.hs-quote .qmsg{color:'+MUT+';font-size:13.5px;font-style:italic;margin:10px 0 0}'
    +'.hs-quote .qcevap{margin-top:12px;background:'+SURF2+';border-left:3px solid '+GREEN+';border-radius:0 10px 10px 0;padding:11px 14px}.hs-quote .qcevap b{font-size:12px;color:'+GREEN+'}.hs-quote .qcevap p{margin:5px 0 0;font-size:14px;line-height:1.6}'
    +'.hs-quote .qpending{margin-top:12px;color:'+MUT+';font-size:13px;display:flex;align-items:center;gap:8px}'
    +'.hs-favgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}@media(max-width:760px){.hs-favgrid{grid-template-columns:1fr 1fr}}@media(max-width:480px){.hs-favgrid{grid-template-columns:1fr}}'
    +'.hs-favcard{background:'+SURF+';border:1px solid '+LINE+';border-radius:14px;overflow:hidden}.hs-favcard .fimg{position:relative;aspect-ratio:16/10;background:'+SURF2+'}.hs-favcard .fimg img{width:100%;height:100%;object-fit:cover}'
    +'.hs-favcard .fbody{padding:12px 14px}.hs-favcard .ft{font-weight:700;font-size:14.5px;line-height:1.3}.hs-favcard .fl{color:'+MUT+';font-size:12.5px;margin:4px 0}.hs-favcard .fp{color:'+A+';font-weight:800;font-size:15px}'
    +'.hs-linkbtn{margin-top:8px;background:none;border:0;color:'+AC+';font-weight:700;cursor:pointer;padding:0;font-size:13.5px}'
    +'.lc-fav{position:absolute;top:10px;right:10px;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.45);border:0;color:#fff;cursor:pointer;font-size:16px;line-height:1;display:grid;place-items:center}.lc-fav.on{background:#ff4d6d}'
    +'.hs-empty{color:'+MUT+';font-size:14px;padding:24px;text-align:center;grid-column:1/-1}.hs-empty a{color:'+AC+'}'
    /* Görüşmeler panosu */
    +'.g-kpis{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:22px}@media(max-width:760px){.g-kpis{grid-template-columns:1fr 1fr}}'
    +'.g-kpi{background:'+SURF+';border:1px solid '+LINE+';border-radius:14px;padding:16px;text-align:center}.g-kpi b{display:block;font-size:26px;line-height:1;color:'+INK+'}.g-kpi span{display:block;margin-top:6px;font-size:12.5px;color:'+MUT+'}.g-kpi.hot{border-color:'+A+'}.g-kpi.hot b{color:'+A+'}'
    +'.g-sec{margin:26px 0}.g-sec>h3{font-size:16px;margin:0 0 12px;padding-bottom:9px;border-bottom:1px solid '+LINE+';color:'+INK+'}'
    +'.g-empty{color:'+MUT+';font-size:13.5px;padding:12px 2px}'
    +'.g-tblwrap{overflow-x:auto;border:1px solid '+LINE+';border-radius:12px}.g-tbl{width:100%;border-collapse:collapse;font-size:13.5px}.g-tbl th,.g-tbl td{text-align:left;padding:11px 14px;border-bottom:1px solid '+LINE+'}.g-tbl th{color:'+MUT+';font-size:11.5px;text-transform:uppercase;letter-spacing:.03em}.g-tbl tr:last-child td{border-bottom:0}'
    +'.g-call{display:inline-block;background:'+GREEN+';color:#062;font-weight:800;font-size:12.5px;text-decoration:none;padding:5px 13px;border-radius:999px}'
    +'.g-convo{background:'+SURF+';border:1px solid '+LINE+';border-radius:12px;margin-bottom:9px;overflow:hidden}.g-convo[data-lead]{border-color:'+A+'}'
    +'.g-convo>summary{cursor:pointer;list-style:none;padding:13px 16px 13px 30px;position:relative;display:flex;flex-direction:column;gap:3px}.g-convo>summary::-webkit-details-marker{display:none}.g-convo>summary::before{content:"▸";color:'+MUT+';position:absolute;left:14px}.g-convo[open]>summary::before{content:"▾"}'
    +'.g-ct{font-weight:700;font-size:14px;color:'+INK+'}.g-cm{font-size:12px;color:'+MUT+'}.g-leadtag{color:'+A+'}'
    +'.g-transcript{padding:6px 16px 16px 30px;display:flex;flex-direction:column;gap:9px;border-top:1px solid '+LINE+'}.g-line{display:flex;gap:10px;align-items:flex-start;font-size:13.5px;line-height:1.55}.g-line .who{flex:0 0 62px;font-weight:800;font-size:11px;text-transform:uppercase;padding-top:2px}.g-line.me .who{color:'+A+'}.g-line.bot .who{color:'+GREEN+'}.g-line .tx{flex:1;background:'+SURF2+';border-radius:10px;padding:8px 12px;color:'+INK+'}'
    +'.g-quote{background:'+SURF+';border:1px solid '+LINE+';border-radius:12px;padding:14px 16px;margin-bottom:10px}.g-qhead{display:flex;align-items:center;justify-content:space-between;gap:10px}.g-qhead b{font-size:14.5px}.g-qst{flex:0 0 auto;font-size:11.5px;font-weight:800;padding:4px 10px;border-radius:999px}.g-qst.ok{background:rgba(25,195,125,.15);color:'+GREEN+'}.g-qst.wait{background:rgba(255,176,112,.14);color:'+AC+'}'
    +'.g-qmeta{color:'+MUT+';font-size:12px;margin-top:5px}.g-qmsg{font-size:13.5px;font-style:italic;color:'+INK+';margin-top:9px}.g-qmsg.g-muted{color:'+MUT+'}.g-qcevap{margin-top:10px;background:'+SURF2+';border-left:3px solid '+GREEN+';border-radius:0 10px 10px 0;padding:10px 13px;font-size:13.5px;line-height:1.6}.g-qcevap b{color:'+GREEN+';font-size:12px}'
    +'.g-note{margin-top:22px;color:'+MUT+';font-size:12.5px;background:'+SURF+';border:1px dashed '+LINE+';border-radius:10px;padding:12px 14px}';
    var s=document.createElement('style');s.id='uas-css';s.textContent=css;(document.head||document.documentElement).appendChild(s);
  }
  function uasInjectModals(){
    var wrap=document.createElement('div');wrap.id='uasRoot';
    wrap.innerHTML=
      /* Giriş modal */
      '<div class="gmodal" id="girisModal"><div class="gm-ov" onclick="closeGiris()"></div><div class="gm-card">'
      +'<button class="gm-x" onclick="closeGiris()" aria-label="Kapat">✕</button>'
      +'<div class="gm-head"><span class="mark">M</span><span id="gm_title">Meridyen Gayrimenkul · Üye Girişi</span></div>'
      +'<div class="gm-tabs" id="gm_authtabs"><button class="act" id="gt_login" onclick="girisTab(\'login\')">Giriş Yap</button><button id="gt_register" onclick="girisTab(\'register\')">Kayıt Ol</button></div>'
      +'<div class="gm-pane" id="gp_login"><label>E-posta</label><input id="au_lemail" type="email" placeholder="ornek@eposta.com" autocomplete="email"><label>Şifre</label><input id="au_lpass" type="password" placeholder="••••••••" autocomplete="current-password" onkeydown="if(event.key===\'Enter\')authDoLogin()"><button class="gm-btn" onclick="authDoLogin()">Giriş Yap →</button><div class="gm-err" id="au_lerr"></div><div class="gm-note">Hesabın yok mu? <a href="#" onclick="girisTab(\'register\');return false">Kayıt ol</a> · <a href="#" onclick="girisTab(\'kurumsal\');return false">Kurumsal / Yönetim</a></div></div>'
      +'<div class="gm-pane" id="gp_register" hidden><label>Ad Soyad</label><input id="au_rname" placeholder="Adınız Soyadınız" autocomplete="name"><label>E-posta</label><input id="au_remail" type="email" placeholder="ornek@eposta.com" autocomplete="email"><label>Şifre <span style="opacity:.6">(en az 6 karakter)</span></label><input id="au_rpass" type="password" placeholder="••••••••" autocomplete="new-password" onkeydown="if(event.key===\'Enter\')authDoRegister()"><div class="gm-kvkk"><input type="checkbox" id="au_rkvkk"><label for="au_rkvkk">KVKK Aydınlatma Metni kapsamında kişisel verilerimin işlenmesini onaylıyorum.</label></div><button class="gm-btn" onclick="authDoRegister()">Hesap Oluştur →</button><div class="gm-err" id="au_rerr"></div><div class="gm-note">Zaten üye misin? <a href="#" onclick="girisTab(\'login\');return false">Giriş yap</a></div></div>'
      +'<div class="gm-pane" id="gp_profile" hidden><div class="au-prof"><div class="au-av" id="au_pav">M</div><div><div class="au-pname" id="au_pname">—</div><div class="au-pmail" id="au_pmail">—</div></div></div><div class="gm-note" style="margin-top:14px">Üye bilgileriniz yalnızca bu tarayıcıda güvenle saklanır (şifre SHA-256 ile korunur). Talep formları bilgilerinizle otomatik dolar.</div><button class="gm-btn" onclick="closeGiris();openHesap()">Hesap Sayfam →</button><button class="gm-btn gm-btn2" onclick="authDoLogout()">Çıkış Yap</button></div>'
      +'<div class="gm-pane" id="gp_kurumsal" hidden><p class="gm-sub">Yetkili personel/yönetim ve sözleşmeli mülk sahibi erişimi.</p><button class="gm-btn" onclick="closeGiris();if(typeof openAdmin===\'function\')openAdmin()">Yönetim Paneline Giriş →</button><button class="gm-btn gm-btn2" onclick="closeGiris();if(typeof openSaasPortal===\'function\')openSaasPortal()">Müşteri Portalı (Mülk Sahibi) →</button><div class="gm-note"><a href="#" onclick="girisTab(\'login\');return false">← Üye girişi</a></div></div>'
      +'</div></div>'
      /* ProX Asistan tam ekran */
      +'<div id="proxAsistanPage"><header class="uas-hdr"><a class="uas-logo" onclick="closeProxAsistanPage();gmHomeSafe()"><span class="mark">M</span> Meridyen <b>Gayrimenkul</b></a>'
      +'<nav class="uas-nav"><a href="hizmetlerimiz.html">Hizmetlerimiz</a><a href="nedenbiz.html">Neden <span class="nb-x">?</span> Biz</a><a href="portfoy.html">Portföy</a><a href="#" onclick="closeProxAsistanPage();if(typeof goView===\'function\')goView(\'analiz\');return false">Analiz Merkezi</a></nav>'
      +'<div class="uas-hdr-r"><a class="uas-hlink js-giris" onclick="closeProxAsistanPage();girisOrHesap()">Giriş</a><button class="uas-close" onclick="closeProxAsistanPage();gmHomeSafe()" aria-label="Kapat">✕</button></div></header>'
      +'<div class="pa-app"><aside class="pa-sb" id="paSb"><div class="pa-sb-head"><button class="pa-newchat" onclick="paNewChat()"><span>＋</span> Yeni sohbet</button><button class="pa-sb-x" onclick="document.getElementById(\'paSb\').classList.remove(\'open\')" aria-label="Kapat">✕</button></div><div class="pa-hist-lbl">Konuşma geçmişi</div><div class="pa-history" id="paHistory"></div><div class="pa-sb-foot"><div class="pa-poweredby"><span class="prox-logo" style="font-size:.9em">Pro<span class="prox-x">X</span></span> · +1 milyar doğrulanmış emlak verisi</div></div></aside>'
      +'<main class="pa-main"><div class="pa-appbar"><button class="pa-menu" onclick="document.getElementById(\'paSb\').classList.toggle(\'open\')" aria-label="Konuşma geçmişi">☰</button><div class="pa-title" id="paTitle"><span class="prox-logo">Pro<span class="prox-x">X</span></span> Asistan</div></div><div class="pa-log" id="paLog"></div><div class="pa-composer"><form class="pa-form" onsubmit="return paSend(event)"><textarea id="paInput" rows="1" placeholder="Mesajınızı yazın…" onkeydown="if(event.key===\'Enter\'&&!event.shiftKey){event.preventDefault();paSend(event)}"></textarea><button type="submit" class="pa-send" aria-label="Gönder">➤</button></form><div class="pa-disc">ProX Asistan, ProX’un +1 milyar doğrulanmış emlak verisine dayanır; bilgilendirme amaçlıdır, kesin teklif için danışmanımızla görüşün.</div></div></main></div></div>'
      /* Hesap sayfası */
      +'<div id="hesapPage"><header class="uas-hdr"><a class="uas-logo" onclick="closeHesap();gmHomeSafe()"><span class="mark">M</span> Meridyen <b>Gayrimenkul</b></a>'
      +'<nav class="uas-nav"><a href="hizmetlerimiz.html">Hizmetlerimiz</a><a href="nedenbiz.html">Neden <span class="nb-x">?</span> Biz</a><a href="portfoy.html">Portföy</a><a href="#" onclick="closeHesap();openProxAsistanPage();return false"><span class="prox-logo">Pro<span class="prox-x">X</span></span>&nbsp;Asistan</a></nav>'
      +'<div class="uas-hdr-r"><button class="uas-close" onclick="closeHesap();gmHomeSafe()" aria-label="Kapat">✕</button></div></header>'
      +'<div class="hs-body"><div class="hs-wrap">'
      +'<div class="hs-top hs-rv"><div class="hs-avatar" id="hs_av">M</div><div class="hs-hi"><div class="h">Hoş geldiniz, <b id="hs_welcome">—</b></div><div class="s">Meridyen Gayrimenkul üye paneli</div></div><div class="hs-kpis"><div class="hs-kpi"><b id="hs_favcount">0</b><span>Favori</span></div><div class="hs-kpi"><b id="hs_qcount">0</b><span>Talep</span></div></div><button class="hs-logout" onclick="authDoLogout();closeHesap()">Çıkış Yap</button></div>'
      +'<div class="hs-tabs hs-rv"><button id="hst_profil" onclick="_hesapTab(\'profil\')">👤 Profilim</button><button id="hst_favoriler" onclick="_hesapTab(\'favoriler\')">❤️ Favorilerim</button><button id="hst_teklifler" class="act" onclick="_hesapTab(\'teklifler\')">📋 Tekliflerim</button></div>'
      +'<div class="hs-pane hs-rv" id="hs_profil" hidden><div class="hs-grid"><div class="hs-card"><h3>Hesap Bilgileri</h3><label>Ad Soyad</label><input id="hs_name" autocomplete="name"><label>E-posta</label><div class="hs-ro" id="hs_email">—</div><label>Telefon</label><input id="hs_phone" placeholder="05__ ___ __ __" autocomplete="tel"><label>Dil / Language</label><select id="hs_lang" onchange="if(typeof gmLang===\'function\')gmLang(this.value)"><option value="tr">Türkçe</option><option value="en">English</option><option value="ar">العربية</option></select><button class="hs-btn" onclick="hesapSaveProfile()">Bilgileri Kaydet</button><div class="hs-msg" id="hs_pmsg"></div></div><div class="hs-card"><h3>Şifre Değiştir</h3><label>Mevcut Şifre</label><input type="password" id="hs_pw0" autocomplete="current-password"><label>Yeni Şifre <span style="opacity:.6">(en az 6)</span></label><input type="password" id="hs_pw1" autocomplete="new-password"><label>Yeni Şifre (tekrar)</label><input type="password" id="hs_pw2" autocomplete="new-password"><button class="hs-btn" onclick="hesapChangePw()">Şifreyi Güncelle</button><div class="hs-msg" id="hs_pwmsg"></div></div></div></div>'
      +'<div class="hs-pane hs-rv" id="hs_favoriler" hidden><div class="hs-favgrid" id="hs_favgrid"></div></div>'
      +'<div class="hs-pane hs-rv" id="hs_teklifler"><div class="hs-card hs-quickq"><h3>⚡ Hızlı Teklif / Talep</h3><label>Konu</label><select id="hq_konu"><option>Satılık ev / daire arıyorum</option><option>Kiralık arıyorum</option><option>Mülkümü satmak istiyorum</option><option>Mülkümü kiraya vermek istiyorum</option><option>Değerleme / ekspertiz</option><option>Yatırım danışmanlığı</option><option>Özel Portföy erişimi</option></select><label>Mesajınız</label><textarea id="hq_mesaj" placeholder="İlçe, bütçe, kaç oda, m²… kısaca yazın"></textarea><button class="hs-btn" onclick="hesapQuickQuote()">Gönder →</button><div class="hs-msg" id="hq_msg"></div><div class="hs-qnote">Talebiniz ProX doğrulanmış emlak verisiyle ön değerlendirilir; danışmanımız kısa sürede detaylandırır.</div></div><div class="hs-qlist" id="hs_qlist"></div></div>'
      +'</div></div></div>';
    document.body.appendChild(wrap);
  }

  /* ===================== 6) NAV/ADMIN/FAVORİ BAĞLAMA + BOOT ===================== */
  function uasEnhanceNav(){
    /* ProX Asistan linki + Giriş yönlendirmesi artık app.js mountSaaSMenu KAYNAĞINDA (statik, flash yok).
       Burada yalnızca footer dil + üyelik durumu (isim/yeşil nokta) uygulanır. */
    uasFooterLang();
    try{applyAuthUI();}catch(e){}
  }
  /* Dil seçici: üst menüden gizle (CSS), footer'a KENDİ seçicimizi koy + "Veri Ortağı" yazısını kaldır. */
  function uasFooterLang(){
    try{
      document.querySelectorAll('.siteFooter span, footer span').forEach(function(sp){
        if(sp.children.length===0 && /Veri\s*Ort/i.test(sp.textContent||'')){var pv=sp.previousSibling;if(pv&&pv.nodeType===3)pv.textContent=(pv.textContent||'').replace(/[·|]\s*$/,'');sp.remove();}
      });
      var foot=document.querySelector('.siteFooter, footer');
      if(foot && !foot.querySelector('.uas-footlang')){
        var d=document.createElement('div');d.className='lang-sw uas-footlang';d.title='Dil / Language';
        d.innerHTML='<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg><select aria-label="Dil / Language" onchange="if(typeof gmLang===\'function\')gmLang(this.value)"><option value="tr">TR</option><option value="en">EN</option><option value="ar">AR</option></select>';
        var prox=foot.querySelector('.gm-prox');
        if(prox&&prox.parentNode)prox.parentNode.insertBefore(d,prox);else{var fw=foot.querySelector('.wrap')||foot;fw.appendChild(d);}
      }
    }catch(e){}
  }
  function uasBindFavs(){
    try{document.querySelectorAll('.lcard').forEach(function(card){var m=(card.getAttribute('onclick')||'').match(/openDet\((\d+)\)/);if(!m)return;var id=m[1];var fav=card.querySelector('.fav');if(!fav||fav._uas)return;fav._uas=1;var on=authIsFav(id);fav.classList.toggle('on',on);fav.innerHTML=on?'♥':'♡';fav.setAttribute('data-fid',id);fav.onclick=function(e){e.stopPropagation();if(!authSession()){openGiris();return;}var nowOn=authToggleFav(id);fav.classList.toggle('on',nowOn);fav.innerHTML=nowOn?'♥':'♡';if(typeof toast==='function')toast(nowOn?'Favorilere eklendi ♥':'Favoriden çıkarıldı');};});}catch(e){}
  }
  function uasInjectAdminPane(){
    var app=document.getElementById('adminApp');if(!app||document.getElementById('pane-gorusmeler'))return;
    var firstNav=app.querySelector('.adm-nav[data-p]');
    if(firstNav&&firstNav.parentNode){var b=document.createElement('button');b.className='adm-nav';b.setAttribute('data-p','gorusmeler');b.innerHTML='💬 Görüşmeler & Teklifler';b.onclick=function(){try{admPane(b);}catch(e){}renderGorusmeler();};firstNav.parentNode.insertBefore(b,firstNav.nextSibling);}
    var anyPane=app.querySelector('.adm-pane');
    if(anyPane&&anyPane.parentNode){var d=document.createElement('div');d.id='pane-gorusmeler';d.className='adm-pane';d.innerHTML='<h2 style="margin:0 0 4px">Görüşmeler & Teklifler</h2><div style="color:var(--muted,#9fb0d0);font-size:14px;margin-bottom:14px">Site kullanıcılarının ProX Asistan görüşmeleri, teklif/talepleri ve üye kayıtları — yetkili olarak tam takip edin.</div><div style="margin-bottom:12px"><button class="btn btn-line btn-sm" onclick="renderGorusmeler()">↻ Yenile</button></div><div id="gorusmelerBody"></div>';anyPane.parentNode.appendChild(d);}
  }
  function _patch(name,after){var orig=window[name];if(typeof orig!=='function'||orig._uasP)return;window[name]=function(){var r=orig.apply(this,arguments);try{after.apply(this,arguments);}catch(e){}return r;};window[name]._uasP=1;}
  function uasBoot(){
    uasEnsureDom();
    _patch('mountSaaSMenu',uasEnhanceNav);
    _patch('renderIlanlar',uasBindFavs);
    if(typeof renderOzel==='function')_patch('renderOzel',uasBindFavs);
    uasEnhanceNav();uasBindFavs();uasInjectAdminPane();
    /* hash kısayolları (#giris/#hesap/#asistan) — temiz-URL router'a dokunmadan */
    function hashRoute(){var h=location.hash||'';if(h==='#asistan')openProxAsistanPage();else if(h==='#hesap')girisOrHesap();else if(h==='#giris'||h==='#uye')openGiris();}
    window.addEventListener('hashchange',hashRoute);setTimeout(hashRoute,300);
    [300,900,1800].forEach(function(d){setTimeout(function(){try{uasEnhanceNav();uasBindFavs();uasInjectAdminPane();}catch(e){}},d);});
  }
  if(document.readyState==='complete')uasBoot();
  else window.addEventListener('load',uasBoot);

  /* ---------- global export (onclick handler'ları için) ---------- */
  var api={authRegister:authRegister,authLogin:authLogin,authLogout:authLogout,authSession:authSession,applyAuthUI:applyAuthUI,
    openGiris:openGiris,closeGiris:closeGiris,girisTab:girisTab,authDoLogin:authDoLogin,authDoRegister:authDoRegister,authDoLogout:authDoLogout,
    _authUsers:_authUsers,authUpdateProfile:authUpdateProfile,authChangePassword:authChangePassword,
    authFavs:authFavs,authIsFav:authIsFav,authToggleFav:authToggleFav,hesapToggleFav:hesapToggleFav,
    authQuotes:authQuotes,authAddQuote:authAddQuote,openHesap:openHesap,closeHesap:closeHesap,girisOrHesap:girisOrHesap,
    renderHesap:renderHesap,_hesapTab:_hesapTab,hesapSaveProfile:hesapSaveProfile,hesapChangePw:hesapChangePw,hesapQuickQuote:hesapQuickQuote,
    _hesapRenderFavs:_hesapRenderFavs,_hesapRenderQuotes:_hesapRenderQuotes,
    paNewChat:paNewChat,paLoadConvo:paLoadConvo,paDelConvo:paDelConvo,paAsk:paAsk,paSend:paSend,
    openProxAsistanPage:openProxAsistanPage,closeProxAsistanPage:closeProxAsistanPage,renderProxAsistanPage:renderProxAsistanPage,
    renderGorusmeler:renderGorusmeler,gmHomeSafe:gmHomeSafe};
  for(var k in api){if(api.hasOwnProperty(k))window[k]=api[k];}
})();
