/* ============================================================================
   Selin Meridyen — ÜYELİK + ÜYE HESABI  (Zümrüt Prestij)
   Tek bağımsız modül; app.js'ten SONRA yüklenir (aiChat, dnPushLead, openAdminGate,
   openSaasPortal, toast, renderGorusmelerD globallerine dayanır). DOM+CSS'i KENDİ
   enjekte eder → app.js/index.html neredeyse dokunulmaz.
   • Giriş modalı: Üye Girişi · Üye Ol · Yönetim Girişi (tek noktadan)
   • Üye hesabı: Profilim · Taleplerim (ProX doğrulanmış veriyle ön değerlendirme)
   • Admin "Görüşmeler" panosuna kayıtlı üyeler + üye talepleri eklenir
   NOT: Genele görünen alanda "yapay zeka/AI" YOK — marka: ProX (yeşil-X #19c37d).
   ========================================================================== */
(function () {
  'use strict';
  var DN_USERS = 'dn_users_v1', DN_SESS = 'dn_session_v1';
  var BRAND = 'Selin Meridyen';

  function esc(x){return String(x==null?'':x).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  function _dnHome(){try{if(typeof closeAllOverlays==='function')closeAllOverlays();}catch(e){}try{if(typeof goHome==='function')goHome();}catch(e){}}

  /* ===================== 1) ÜYELİK MOTORU (FAZ3B) =====================
     Parola TARAYICIDA HİÇBİR KOŞULDA işlenmez, hash'lenmez, saklanmaz.
     Üretim: same-origin /api/auth/user/* (Argon2id + HttpOnly oturum, sunucuda).
     Demo:   parolasız ÖRNEK OTURUM — kullanıcı veritabanı yok, parola alanı yok sayılır. */
  var _eskiUserDb=DN_USERS; try{localStorage.removeItem(_eskiUserDb);}catch(e){} /* eski SHA-256 kayıtları temizlenir */
  function _users(){return {};} /* tarayıcı kullanıcı DB'si KALDIRILDI — üye kayıtları sunucudadır */
  function authSession(){try{return JSON.parse(localStorage.getItem(DN_SESS)||'null');}catch(e){return null;}}
  function _setSession(s){try{if(s)localStorage.setItem(DN_SESS,JSON.stringify(s));else localStorage.removeItem(DN_SESS);}catch(e){}applyAuthUI();try{if(s)_mergeGuestFavs();dnFavReflect();}catch(e){}}
  async function authRegister(name,email,pw){
    name=(name||'').trim();email=(email||'').trim().toLowerCase();
    if(name.length<2)return{err:'Lütfen ad soyad girin.'};
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return{err:'Geçerli bir e-posta girin.'};
    if((pw||'').length<6)return{err:'Şifre en az 6 karakter olmalı.'};
    if(window.EMLAK_DEMO!==false){ /* DEMO: parolasız örnek oturum — parola İŞLENMEZ */
      _setSession({email:email,name:name,demo:true,ts:Date.now()});
      try{if(typeof renderGorusmelerD==='function')renderGorusmelerD();}catch(e){}
      return{ok:true,demo:true};
    }
    /* ÜRETİM: parola tarayıcıda işlenmez/saklanmaz — sunucu auth */
    try{var rr=await fetch('/api/auth/user/register',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,email:email,password:pw})});
      if(rr.ok){var jj=await rr.json();if(jj&&jj.ok){_setSession({email:email,name:name,ts:Date.now()});return{ok:true};}}
      return{err:'Kayıt başarısız — bilgilerinizi kontrol edin.'};
    }catch(e){return{err:'Üyelik servisi yapılandırılmadı (auth servisine erişilemiyor).'};}
  }
  async function authLogin(email,pw){
    email=(email||'').trim().toLowerCase();
    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email))return{err:'Geçerli bir e-posta girin.'};
    if(window.EMLAK_DEMO!==false){ /* DEMO: parolasız örnek oturum — parola karşılaştırması YOK */
      _setSession({email:email,name:email.split('@')[0],demo:true,ts:Date.now()});return{ok:true,demo:true};
    }
    /* ÜRETİM: karşılaştırma sunucuda (Argon2id + HttpOnly oturum) */
    try{var rr=await fetch('/api/auth/user/login',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:email,password:pw})});
      if(rr.ok){var jj=await rr.json();if(jj&&jj.ok){_setSession({email:email,name:(jj.name||email),ts:Date.now()});return{ok:true};}}
      return{err:'E-posta veya şifre hatalı.'};
    }catch(e){return{err:'Üyelik servisi yapılandırılmadı (auth servisine erişilemiyor).'};}
  }
  function authLogout(){_setSession(null);}
  function applyAuthUI(){
    var s=authSession();
    document.querySelectorAll('.js-giris').forEach(function(g){
      if(s){g.textContent=(s.name||'').split(' ')[0]||'Hesabım';g.classList.add('logged');g.setAttribute('title',s.name+' · '+s.email);}
      else{g.textContent='Giriş';g.classList.remove('logged');g.removeAttribute('title');}
    });
  }

  /* ===================== 2) GİRİŞ MODALI ===================== */
  function openGiris(){_ensureDom();var m=document.getElementById('dnGirisModal');if(!m)return;m.classList.add('on');var s=authSession();if(s){_fillProfile();girisTab('profile');}else girisTab('login');}
  function closeGiris(){var m=document.getElementById('dnGirisModal');if(m)m.classList.remove('on');}
  function _fillProfile(){var s=authSession();if(!s)return;var n=document.getElementById('gu_pname'),e=document.getElementById('gu_pmail'),a=document.getElementById('gu_pav');if(n)n.textContent=s.name;if(e)e.textContent=s.email;if(a)a.textContent=((s.name||'M').trim()[0]||'M').toUpperCase();}
  function girisTab(t){
    ['login','register','profile','yonetim'].forEach(function(p){var el=document.getElementById('gu_'+p);if(el)el.hidden=(p!==t);});
    var lb=document.getElementById('gt_login'),rb=document.getElementById('gt_register'),tabs=document.getElementById('gu_tabs');
    if(lb)lb.classList.toggle('act',t==='login');if(rb)rb.classList.toggle('act',t==='register');
    if(tabs)tabs.style.display=(t==='login'||t==='register')?'flex':'none';
    var tt=document.getElementById('gu_title');
    if(tt)tt.textContent=BRAND+' · '+((t==='register')?'Üye Ol':(t==='profile')?'Hesabım':(t==='yonetim')?'Yönetim Girişi':'Üye Girişi');
  }
  async function authDoLogin(){var err=document.getElementById('gu_lerr');err.className='gu-err bad';var r=await authLogin((document.getElementById('gu_lemail')||{}).value,(document.getElementById('gu_lpass')||{}).value);if(r.err){err.textContent='⚠ '+r.err;return;}err.className='gu-err ok';err.textContent='✓ Giriş başarılı, hoş geldiniz.';setTimeout(closeGiris,650);}
  async function authDoRegister(){var err=document.getElementById('gu_rerr');err.className='gu-err bad';var kv=document.getElementById('gu_rkvkk');if(kv&&!kv.checked){err.textContent='⚠ Lütfen KVKK onayı verin.';return;}var r=await authRegister((document.getElementById('gu_rname')||{}).value,(document.getElementById('gu_remail')||{}).value,(document.getElementById('gu_rpass')||{}).value);if(r.err){err.textContent='⚠ '+r.err;return;}err.className='gu-err ok';err.textContent='✓ Üyeliğiniz oluşturuldu, giriş yapıldı.';setTimeout(closeGiris,780);}
  function authDoLogout(){authLogout();closeGiris();}
  function _adminGiris(){closeGiris();if(typeof openAdminGate==='function')openAdminGate();}
  function _portalGiris(){closeGiris();if(typeof openSaasPortal==='function')openSaasPortal();}

  /* ===================== 2.5) FAVORİLER (ilan · özel portföy · blog) =====================
     SNAPSHOT mimarisi: favori kaydı kendini tanımlar {id,type,t(başlık),s(alt),p(fiyat),u(url)}.
     → kaynak diziye (LISTINGS/VIP) bağımlı DEĞİL; TÜM sayfalarda (ilanlar.html, ozel-portfoy.html…)
       hem ekle hem Hesap'ta göster çalışır. Misafir favorisi girişte üye favorisiyle birleşir. */
  var DN_FAV_GUEST='dn_fav_guest';
  function _favStoreKey(){var s=authSession();return s?('dn_fav_'+s.email):DN_FAV_GUEST;}
  function _favArr(){try{var a=JSON.parse(localStorage.getItem(_favStoreKey())||'[]');return Array.isArray(a)?a:[];}catch(e){return [];}}
  function _favSave(a){try{localStorage.setItem(_favStoreKey(),JSON.stringify(a));}catch(e){}}
  function dnIsFav(id){return _favArr().some(function(f){return f.id===id;});}
  /* Favori ♡ butonu — her sayfa çağırabilir (snapshot data-attr'larıyla). */
  function dnFavBtn(id,type,snap){snap=snap||{};
    return '<button class="vc-fav" data-fid="'+esc(id)+'" data-ftype="'+esc(type||'ilan')+'" data-ft="'+esc(snap.t||'')+'" data-fs="'+esc(snap.s||'')+'" data-fp="'+esc(snap.p||'')+'" data-fu="'+esc(snap.u||'')+'" onclick="event.stopPropagation();dnFav(this.getAttribute(\'data-fid\'),this.getAttribute(\'data-ftype\'),this)" aria-label="Favorilere ekle" title="Favorilere ekle">♡</button>';}
  function dnFav(id,type,el){
    if(!id)return false;var a=_favArr(),i=-1;for(var k=0;k<a.length;k++){if(a[k].id===id){i=k;break;}}
    var on;if(i>=0){a.splice(i,1);on=false;}
    else{var rec={id:id,type:type||'ilan',ts:Date.now()};if(el&&el.getAttribute){rec.t=el.getAttribute('data-ft')||'';rec.s=el.getAttribute('data-fs')||'';rec.p=el.getAttribute('data-fp')||'';rec.u=el.getAttribute('data-fu')||'';}a.unshift(rec);on=true;}
    _favSave(a);
    try{document.querySelectorAll('.vc-fav[data-fid="'+id+'"],.pf-fav[data-fid="'+id+'"]').forEach(function(b){b.classList.toggle('on',on);b.innerHTML=on?'♥':'♡';});}catch(e){}
    if(el&&el.classList){el.classList.toggle('on',on);el.innerHTML=on?'♥':'♡';}
    if(typeof toast==='function')toast(on?'❤ Favorilere eklendi':'Favoriden çıkarıldı');
    try{var fp=document.getElementById('hs_favoriler');if(fp&&!fp.hidden)_renderFavs();var kc=document.getElementById('hs_favcount');if(kc)kc.textContent=_favArr().length;}catch(e){}
    return on;
  }
  function dnFavReflect(){try{var a=_favArr();document.querySelectorAll('.vc-fav[data-fid],.pf-fav[data-fid]').forEach(function(b){var on=a.some(function(f){return f.id===b.getAttribute('data-fid');});b.classList.toggle('on',on);b.innerHTML=on?'♥':'♡';});}catch(e){}}

  /* ── HESAP-SENKRON KÖPRÜSÜ: shared/listing.js (ns=dnil) ↔ üye snapshot favorileri ──
     Girişliyken tek kaynak üye kaydıdır (dn_fav_<email>, snapshot nesneleri);
     listing.js id-dizisi bekler → id'ye indirger, senkronda snapshot üretir. */
  window.GM_FAV_READ=function(ns){
    if(ns!=='dnil')return null; if(!authSession())return null;
    try{return _favArr().filter(function(f){return (f.type||'ilan')==='ilan';}).map(function(f){return String(f.id).replace(/^ln/,'');});}catch(e){return null;}
  };
  window.GM_FAV_SYNC=function(ns,ids){
    if(ns!=='dnil'||!authSession())return;
    try{
      ids=(ids||[]).map(String);
      var a=_favArr();
      a=a.filter(function(f){return (f.type||'ilan')!=='ilan'||ids.indexOf(String(f.id).replace(/^ln/,''))>=0;});
      var have={}; a.forEach(function(f){have[String(f.id).replace(/^ln/,'')]=1;});
      var reg=(window.Listings&&window.Listings._reg&&window.Listings._reg[ns])||null;
      var list=(reg&&reg.list&&reg.list())||[];
      ids.forEach(function(id){ if(have[id])return;
        var l=null; for(var i=0;i<list.length;i++){if(String(list[i].id)===id){l=list[i];break;}}
        a.unshift({id:'ln'+id,type:'ilan',ts:Date.now(),t:(l&&(l.title||l.baslik))||('İlan #'+id),s:l?[l.ilce,l.mah].filter(Boolean).join(' / '):'',p:(l&&(l.priceText||l.price))||'',u:''});
      });
      _favSave(a);
      try{var kc=document.getElementById('hs_favcount');if(kc)kc.textContent=_favArr().length;}catch(e){}
    }catch(e){}
  };
  function _mergeGuestFavs(){try{var g=[];try{g=JSON.parse(localStorage.getItem(DN_FAV_GUEST)||'[]');}catch(e){}if(g.length&&authSession()){var a=_favArr();g.forEach(function(f){if(!a.some(function(x){return x.id===f.id;}))a.unshift(f);});_favSave(a);localStorage.removeItem(DN_FAV_GUEST);}try{var lg=JSON.parse(localStorage.getItem('dnil_favs')||'[]')||[];if(lg.length&&authSession()){var a2=_favArr();lg.map(String).forEach(function(id){if(!a2.some(function(x){return String(x.id)===id;}))a2.unshift({id:id,type:'ilan',ts:Date.now(),t:'İlan #'+id,s:'',p:'',u:''});});_favSave(a2);localStorage.removeItem('dnil_favs');}}catch(e){}}catch(e){}}

  /* ===================== 3) ÜYE HESABI (Profil + Talepler) ===================== */
  function _uKey(p){var s=authSession();return s?('dn_'+p+'_'+s.email):null;}
  function _uGet(p,def){var k=_uKey(p);if(!k)return def;try{var v=JSON.parse(localStorage.getItem(k));return v==null?def:v;}catch(e){return def;}}
  function _uSet(p,v){var k=_uKey(p);if(k)try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}}
  async function authUpdateProfile(name,phone){var s=authSession();if(!s)return{err:'Giriş yapın.'};name=(name||'').trim();if(name.length<2)return{err:'Ad soyad gerekli.'};
    if(window.EMLAK_DEMO===false){try{var rr=await fetch('/api/auth/user/profile',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,phone:(phone||'').trim()})});if(!rr.ok)return{err:'Profil güncellenemedi.'};}catch(e){return{err:'Üyelik servisine erişilemiyor.'};}}
    _setSession({email:s.email,name:name,phone:(phone||'').trim(),demo:s.demo,ts:Date.now()});return{ok:true};}
  async function authChangePassword(cur,nw){var s=authSession();if(!s)return{err:'Giriş yapın.'};
    if(window.EMLAK_DEMO!==false)return{err:'Demo modunda parola bulunmaz — örnek oturum parolasızdır.'};
    if((nw||'').length<6)return{err:'Yeni şifre en az 6 karakter olmalı.'};
    try{var rr=await fetch('/api/auth/user/password',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({current:cur,next:nw})});
      if(rr.ok){var jj=await rr.json();if(jj&&jj.ok)return{ok:true};}return{err:'Mevcut şifre hatalı.'};
    }catch(e){return{err:'Üyelik servisine erişilemiyor.'};}}
  function authQuotes(){var q=_uGet('quotes',[]);return Array.isArray(q)?q:[];}
  async function authAddQuote(konu,mesaj){var s=authSession();if(!s)return{err:'Giriş yapın.'};var q={id:'q'+Date.now(),konu:konu||'Genel',mesaj:(mesaj||'').trim(),date:new Date().toISOString(),status:'pending',cevap:''};var arr=authQuotes();arr.unshift(q);_uSet('quotes',arr);
    try{if(typeof dnPushLead==='function'){dnPushLead({name:s.name,email:s.email,phone:s.phone||'',konu:q.konu,msg:q.mesaj,src:'Üye Talebi'});}}catch(e){}
    _quoteRespond(q.id,q.konu,q.mesaj);return{ok:true,id:q.id};}
  /* ProX yanıtı: admin Motor-1 bağlantısı etkinse app.js aiChat (Motor-1) ile, yoksa ProX çekirdeği. */
  function _proxCall(body){return (typeof window!=='undefined'&&window.aiChat)?window.aiChat(body):proxApi('/api/v1/tenant/prox/ai',{method:'POST',body:body});}
  async function _quoteRespond(id,konu,mesaj){var reply='';var m=(mesaj||'').trim();
    try{var r=await _proxCall({context:'default',prompt:'Sen '+BRAND+'\'in ProX Asistanısın — sıcak, kişiye özel bir gayrimenkul danışmanı. Üye "'+konu+'" konusunda bir talep formu doldurdu. GÖREV: mesajı dikkatle oku, ne istediğini anla. Mesaj yalnızca selam ya da çok kısa/boşsa: kibarca selam ver, kendini tanıt ("Ben '+BRAND+' ProX Asistanı") ve "'+konu+'" için ihtiyacı netleştirecek 1-2 KISA soru sor (il/ilçe, bütçe, m², oda, satılık/kiralık) — hazır uzun metin DÖKME. Gerçek talep varsa: 2-3 cümlelik samimi ön değerlendirme ver ve üyeyi ücretsiz ekspertiz / portföy görüşmesi gibi bir sonraki adıma yönlendir. Telefon bırakırsa danışman kısa sürede arar. Türkçe, kısa. Kesin fiyat verme, ücretsiz ekspertiz öner. Yanıtın ProX\'un doğrulanmış emlak verisine dayanır; ProX veri uydurmaz.',message:konu+' — '+(m||'(üye mesaj bırakmadı)')});reply=(r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))))||'';}catch(e){}
    if(!reply){reply=(m.length<8)?('Merhaba, ben '+BRAND+' ProX Asistanı 👋 “'+konu+'” konusunda yardımcı olmak isterim. Kısaca ihtiyacınızı anlatır mısınız — hangi il/ilçe, bütçe, kaç oda? Dilerseniz telefon numaranızı bırakın, en kısa sürede sizi arayayım.'):('Talebinizi aldım. “'+konu+'” için ProX doğrulanmış emlak verisiyle ön değerlendirme yapıp en kısa sürede size döneceğim. Dilerseniz ücretsiz ekspertiz planlayalım ya da telefon numaranızı bırakın, sizi arayayım.');}
    var arr=authQuotes();for(var i=0;i<arr.length;i++){if(arr[i].id===id){arr[i].status='answered';arr[i].cevap=reply;break;}}_uSet('quotes',arr);
    try{var hp=document.getElementById('dnHesapPage');if(hp&&hp.classList.contains('on')&&!document.getElementById('hs_talepler').hidden)_renderQuotes();}catch(e){}}

  function openHesap(){_ensureDom();if(!authSession()){openGiris();girisTab('login');return;}var ov=document.getElementById('dnHesapPage');if(!ov)return;_dnHome();renderHesap();ov.classList.add('on');document.body.style.overflow='hidden';document.documentElement.classList.add('dn-hide-hdr');ov.scrollTop=0;}
  function closeHesap(){var ov=document.getElementById('dnHesapPage');if(ov)ov.classList.remove('on');document.body.style.overflow='';document.documentElement.classList.remove('dn-hide-hdr');}
  function girisOrHesap(){if(authSession())openHesap();else openGiris();}
  var _hesapTabCur='talepler';
  function renderHesap(){var s=authSession();if(!s)return;var u={phone:s.phone||''};var g=function(id){return document.getElementById(id);};if(g('hs_name'))g('hs_name').value=s.name;if(g('hs_email'))g('hs_email').textContent=s.email;if(g('hs_phone'))g('hs_phone').value=u.phone||'';if(g('hs_av'))g('hs_av').textContent=((s.name||'M').trim()[0]||'M').toUpperCase();if(g('hs_welcome'))g('hs_welcome').textContent=(s.name||'').split(' ')[0];if(g('hs_qcount'))g('hs_qcount').textContent=authQuotes().length;if(g('hs_favcount'))g('hs_favcount').textContent=_favArr().length;_hesapTab(_hesapTabCur||'talepler');}
  function _hesapTab(t){_hesapTabCur=t;['profil','talepler','favoriler'].forEach(function(p){var pane=document.getElementById('hs_'+p),tab=document.getElementById('hst_'+p);if(pane)pane.hidden=(p!==t);if(tab)tab.classList.toggle('act',p===t);});if(t==='talepler')_renderQuotes();if(t==='favoriler')_renderFavs();}
  function _favCardHTML(f){var go=f.u?('<a class="fav-go" href="'+esc(f.u)+'">Gör →</a>'):'';
    return '<div class="fav-card"><div class="fav-cbody"><div class="fav-ct">'+esc(f.t||f.id)+'</div>'+(f.s?('<div class="fav-cl">'+esc(f.s)+'</div>'):'')+(f.p?('<div class="fav-cp">'+esc(f.p)+'</div>'):'')+'</div><div class="fav-cact">'+go+'<button class="fav-rm" title="Favoriden çıkar" onclick="dnFav(\''+esc(f.id)+'\',\''+esc(f.type)+'\')">♥</button></div></div>';}
  function _renderFavs(){
    var host=document.getElementById('hs_favgrid');if(!host)return;
    var arr=_favArr();var ilan=[],vip=[],blog=[];
    arr.forEach(function(f){var c=_favCardHTML(f);if(f.type==='vip')vip.push(c);else if(f.type==='blog')blog.push(c);else ilan.push(c);});
    if(!ilan.length&&!vip.length&&!blog.length){host.innerHTML='<div class="hs-empty">❤ Henüz favoriniz yok. İlan, Özel Portföy ve Blog kartlarındaki ♡ ile ekleyin — burada toplanır.</div>';return;}
    var sec=function(title,items,empty){return '<div class="fav-sec"><h4 class="fav-sech">'+title+' <span>'+items.length+'</span></h4>'+(items.length?('<div class="fav-list">'+items.join('')+'</div>'):('<div class="fav-empty">'+empty+'</div>'))+'</div>';};
    host.innerHTML=sec('🏠 Favori Portföy',ilan,'Açık ilanlardan favori eklemediniz.')+sec('🔑 Favori Özel Portföy',vip,'Özel Portföyden favori eklemediniz.')+sec('📰 Favori Blog · Haber',blog,'Blog/haberlerden favori eklemediniz.');
  }
  function _renderQuotes(){var l=document.getElementById('hs_qlist');if(!l)return;var qs=authQuotes();if(!qs.length){l.innerHTML='<div class="hs-empty">Henüz talebiniz yok — yukarıdaki formdan hızlı talep gönderin; ProX ön değerlendirme yapsın.</div>';return;}l.innerHTML=qs.map(function(q){var answered=q.status==='answered';var ds='';try{var d=new Date(q.date);ds=d.toLocaleDateString('tr-TR')+' · '+d.toLocaleTimeString('tr-TR',{hour:'2-digit',minute:'2-digit'});}catch(e){}return '<div class="hs-quote"><div class="qhead"><div><div class="qk">'+esc(q.konu)+'</div><div class="qd">'+ds+'</div></div><span class="qbadge '+(answered?'ok':'wait')+'">'+(answered?'✓ Yanıtlandı':'⏳ Yanıt bekliyor')+'</span></div>'+(q.mesaj?'<div class="qmsg">“'+esc(q.mesaj)+'”</div>':'')+(answered?'<div class="qcevap"><b>ProX ön değerlendirme</b><p>'+esc(q.cevap)+'</p></div>':'<div class="qpending"><span class="gu-typing"><i></i><i></i><i></i></span> ProX yanıt hazırlıyor…</div>')+'</div>';}).join('');}
  async function hesapSaveProfile(){var m=document.getElementById('hs_pmsg');m.className='hs-msg bad';var r=await authUpdateProfile(document.getElementById('hs_name').value,document.getElementById('hs_phone').value);if(r.err){m.textContent='⚠ '+r.err;return;}m.className='hs-msg ok';m.textContent='✓ Bilgileriniz güncellendi.';renderHesap();}
  async function hesapChangePw(){var m=document.getElementById('hs_pwmsg');m.className='hs-msg bad';var b=document.getElementById('hs_pw1').value,c=document.getElementById('hs_pw2').value;if(b!==c){m.textContent='⚠ Yeni şifreler eşleşmiyor.';return;}var r=await authChangePassword(document.getElementById('hs_pw0').value,b);if(r.err){m.textContent='⚠ '+r.err;return;}m.className='hs-msg ok';m.textContent='✓ Şifreniz güncellendi.';['hs_pw0','hs_pw1','hs_pw2'].forEach(function(id){document.getElementById(id).value='';});}
  async function hesapQuickQuote(){var m=document.getElementById('hq_msg');var r=await authAddQuote(document.getElementById('hq_konu').value,document.getElementById('hq_mesaj').value);if(r.err){m.className='hs-msg bad';m.textContent='⚠ '+r.err;return;}m.className='hs-msg ok';m.textContent='✓ Talebiniz alındı, ProX yanıt hazırlıyor.';document.getElementById('hq_mesaj').value='';_renderQuotes();}

  /* ===================== 4) ADMİN GÖRÜŞMELER'E ÜYE VERİSİ EKLE ===================== */
  function _gDate(x){try{return new Date(x).toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
  function _memberAdminHTML(){
    var users=_users();var members=Object.keys(users).map(function(e){return Object.assign({email:e},users[e]||{});});
    members.sort(function(a,b){return String(b.createdAt||'').localeCompare(String(a.createdAt||''));});
    var quotes=[];try{for(var i=0;i<localStorage.length;i++){var kk=localStorage.key(i);if(kk&&kk.indexOf('dn_quotes_')===0){var em=kk.slice(10);var arr=[];try{arr=JSON.parse(localStorage.getItem(kk)||'[]');}catch(e){}if(Array.isArray(arr))arr.forEach(function(q){quotes.push(Object.assign({_email:em},q));});}}}catch(e){}
    quotes.sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''));});
    var uname=function(e){return (users[e]&&users[e].name)||e;},uphone=function(e){return (users[e]&&users[e].phone)||'';};
    var H='<h5 class="dng-h">🧾 Üye Talepleri</h5>';
    if(!quotes.length)H+='<div class="dng-empty">Henüz üye talebi yok. Üyeler hesabından gönderince burada listelenir.</div>';
    else H+='<div class="dnu-quotes">'+quotes.map(function(q){var st=q.status==='answered';return '<div class="dnu-q"><div class="dnu-qh"><b>'+esc(q.konu||'Genel')+'</b><span class="dnu-badge '+(st?'ok':'wait')+'">'+(st?'✓ Yanıtlandı':'⏳ Bekliyor')+'</span></div><div class="dnu-qm">'+esc(uname(q._email))+' · '+esc(q._email)+(uphone(q._email)?(' · '+esc(uphone(q._email))):'')+' · '+esc(_gDate(q.date))+'</div>'+(q.mesaj?'<div class="dnu-qt">“'+esc(q.mesaj)+'”</div>':'')+(q.cevap?'<div class="dnu-qc"><b>ProX yanıtı:</b> '+esc(q.cevap)+'</div>':'')+'</div>';}).join('')+'</div>';
    H+='<h5 class="dng-h">👤 Kayıtlı Üyeler ('+members.length+')</h5>';
    if(!members.length)H+='<div class="dng-empty">Henüz kayıtlı üye yok. Ziyaretçiler siteden üye oldukça burada görünür.</div>';
    else H+='<div class="dnu-tblwrap"><table class="dnu-tbl"><thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Telefon</th><th>Kayıt</th></tr></thead><tbody>'+members.map(function(u){return '<tr><td>'+esc(u.name||'—')+'</td><td>'+esc(u.email)+'</td><td>'+esc(u.phone||'—')+'</td><td>'+esc(_gDate(u.createdAt))+'</td></tr>';}).join('')+'</tbody></table></div>';
    return '<div class="dnu-wrap">'+H+'</div>';
  }
  function _patchGorusmeler(){
    var orig=window.renderGorusmelerD;if(typeof orig!=='function'||orig._dnuP)return;
    window.renderGorusmelerD=function(){var r=orig.apply(this,arguments);try{var host=document.getElementById('dnGorusmelerBody');if(host){var ex=host.querySelector('.dnu-wrap');if(ex)ex.remove();host.insertAdjacentHTML('beforeend',_memberAdminHTML());}}catch(e){}return r;};
    window.renderGorusmelerD._dnuP=1;
  }

  /* ===================== 5) CSS + DOM ENJEKSİYONU (Zümrüt Prestij) ===================== */
  var _domReady=false;
  function _ensureDom(){if(_domReady)return;_domReady=true;_injectCSS();_injectDom();}
  function _injectCSS(){
    if(document.getElementById('dnu-css'))return;
    var INK='var(--ink,#122a20)',MUT='var(--muted,#6f7d72)',LINE='var(--line,#e8e0cf)',
        SURF='var(--panel,#fff)',SURF2='var(--panel-2,#f7f3ea)',BG='var(--cream,#faf7f0)',
        GOLD='var(--grad-gold,linear-gradient(135deg,#d8bd7f,#c39b45 55%,#a17e2d))',
        EM='var(--grad-em,linear-gradient(160deg,#0e5e3e,#14805a 72%,#0a3527))',
        PROX='var(--prox,#19c37d)',PROXD='var(--prox-deep,#0e8f5c)',GOLDTX='#241a06',
        HEAD='var(--body,"Jost",system-ui,sans-serif)',SERIF='var(--serif,"Playfair Display",Georgia,serif)',
        RED='#b3402f';
    var css=''
    +'#dnuRoot .prox-logo,#dnHesapPage .prox-logo{font-weight:800;letter-spacing:.2px;color:inherit;white-space:nowrap;display:inline-flex;align-items:center}'
    +'#dnuRoot .prox-x,#dnHesapPage .prox-x{display:inline-flex;align-items:center;justify-content:center;background:#19c37d;color:#04140c;border-radius:6px;padding:.02em .28em;margin-left:2px;line-height:1;font-size:.9em;font-weight:900}'
    /* ---- Giriş modal ---- */
    +'.gmodal{position:fixed;inset:0;z-index:520;display:none;align-items:center;justify-content:center;padding:18px;font-family:'+HEAD+'}.gmodal.on{display:flex}'
    +'.gu-ov{position:absolute;inset:0;background:rgba(6,18,13,.66);backdrop-filter:blur(4px)}'
    +'.gu-card{position:relative;width:100%;max-width:410px;background:'+SURF+';border:1px solid '+LINE+';border-radius:18px;padding:28px 26px;box-shadow:0 40px 90px -30px rgba(10,53,39,.55);color:'+INK+'}'
    +'.gu-x{position:absolute;top:13px;right:15px;background:none;border:0;color:'+MUT+';font-size:1.3125rem;cursor:pointer;line-height:1}'
    +'.gu-head{display:flex;align-items:center;gap:11px;font-weight:700;font-size:1.03125rem;margin-bottom:18px;font-family:'+SERIF+'}.gu-head .mark{width:34px;height:34px;border-radius:9px;background:'+GOLD+';color:'+GOLDTX+';display:grid;place-items:center;font-weight:800;font-family:'+SERIF+';flex:0 0 auto}'
    +'.gu-tabs{display:flex;gap:8px;margin-bottom:16px}.gu-tabs button{flex:1;background:'+SURF2+';border:1px solid '+LINE+';color:'+MUT+';border-radius:11px;padding:10px;font-weight:600;font-size:.84375rem;cursor:pointer;transition:.16s;font-family:'+HEAD+'}.gu-tabs button.act{background:'+EM+';color:#f3efe2;border-color:transparent;box-shadow:0 8px 20px -10px rgba(14,94,62,.6)}'
    +'.gu-pane label{display:block;font-size:.78125rem;color:'+MUT+';margin:12px 0 5px;font-weight:600}'
    +'.gu-pane input[type=email],.gu-pane input[type=password],.gu-pane input:not([type]){width:100%;background:'+BG+';border:1px solid '+LINE+';border-radius:11px;padding:12px 14px;color:'+INK+';font-size:.875rem;box-sizing:border-box;font-family:'+HEAD+'}'
    +'.gu-pane input:focus{outline:none;border-color:var(--em-2,#14805a);box-shadow:0 0 0 3px rgba(20,128,90,.12)}'
    +'.gu-btn{width:100%;margin-top:18px;background:'+GOLD+';color:'+GOLDTX+';border:0;border-radius:11px;padding:13px;font-weight:700;font-size:.875rem;cursor:pointer;font-family:'+HEAD+';box-shadow:0 16px 34px -18px rgba(163,126,45,.7)}.gu-btn:hover{filter:brightness(1.05)}'
    +'.gu-btn2{width:100%;margin-top:9px;background:transparent;color:'+INK+';border:1px solid '+LINE+';border-radius:11px;padding:12px;font-weight:700;font-size:.84375rem;cursor:pointer;font-family:'+HEAD+'}.gu-btn2:hover{border-color:var(--em-2,#14805a);color:var(--em,#0e5e3e)}'
    +'.gu-btn-yon{background:'+EM+';color:#f3efe2;border:0;box-shadow:0 14px 30px -16px rgba(14,94,62,.6)}'
    +'.gu-err{min-height:16px;font-size:.78125rem;margin-top:10px}.gu-err.bad{color:'+RED+'}.gu-err.ok{color:'+PROXD+'}'
    +'.gu-note{font-size:.78125rem;color:'+MUT+';margin-top:14px;line-height:1.7}.gu-note a{color:var(--em-2,#14805a);text-decoration:none;font-weight:600}.gu-note a:hover{text-decoration:underline}'
    +'.gu-div{display:flex;align-items:center;gap:12px;margin:16px 0 4px;color:'+MUT+';font-size:.71875rem;text-transform:uppercase;letter-spacing:.1em}.gu-div::before,.gu-div::after{content:"";flex:1;height:1px;background:'+LINE+'}'
    +'.gu-sub{font-size:.8125rem;color:'+MUT+';margin:0 0 10px;line-height:1.6}'
    +'.gu-kvkk{display:flex;gap:9px;align-items:flex-start;margin-top:13px}.gu-kvkk label{margin:0;font-size:.71875rem;line-height:1.5}.gu-kvkk input{margin-top:2px}'
    +'.gu-prof{display:flex;align-items:center;gap:14px}.gu-av{width:54px;height:54px;border-radius:50%;background:'+EM+';color:#f3efe2;display:grid;place-items:center;font-size:1.4375rem;font-weight:800;font-family:'+SERIF+'}.gu-pname{font-weight:700;font-size:1.03125rem;font-family:'+SERIF+'}.gu-pmail{color:'+MUT+';font-size:.8125rem}'
    +'.gu-typing i{display:inline-block;width:6px;height:6px;border-radius:50%;background:'+MUT+';margin:0 1.5px;animation:guBlink 1.2s infinite}.gu-typing i:nth-child(2){animation-delay:.2s}.gu-typing i:nth-child(3){animation-delay:.4s}@keyframes guBlink{0%,60%,100%{opacity:.25}30%{opacity:1}}'
    /* ---- Hesap sayfası (tam ekran) ---- */
    +'#dnHesapPage{position:fixed;inset:0;z-index:500;background:'+BG+';color:'+INK+';display:none;flex-direction:column;font-family:'+HEAD+';overflow-y:auto}#dnHesapPage.on{display:flex}'/* header.nav z-index:400 ÜSTÜNDE */
    +'.dnh-hdr{flex:0 0 auto;display:flex;align-items:center;gap:14px;padding:14px 26px;border-bottom:1px solid '+LINE+';background:'+SURF+';position:sticky;top:0;z-index:6}'
    +'.dnh-logo{display:inline-flex;align-items:center;gap:10px;font-weight:700;font-size:1.125rem;color:'+INK+';text-decoration:none;cursor:pointer;font-family:'+SERIF+'}.dnh-logo .mark{width:34px;height:34px;border-radius:9px;background:'+GOLD+';color:'+GOLDTX+';display:grid;place-items:center;font-weight:800}'
    +'.dnh-back{margin-left:auto;background:'+SURF2+';color:'+INK+';border:1px solid '+LINE+';border-radius:10px;padding:9px 16px;font-weight:600;font-size:.84375rem;cursor:pointer;font-family:'+HEAD+'}.dnh-back:hover{border-color:var(--em-2,#14805a);color:var(--em,#0e5e3e)}'
    +'.hs-wrap{max-width:1000px;margin:0 auto;padding:30px 20px 80px;width:100%;box-sizing:border-box}'
    +'@keyframes hsRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}.hs-rv{animation:hsRise .5s cubic-bezier(.2,.7,.2,1) both}.hs-tabs.hs-rv{animation-delay:.05s}.hs-pane.hs-rv{animation-delay:.1s}'
    +'.hs-top{display:flex;align-items:center;gap:16px;background:'+SURF+';border:1px solid '+LINE+';border-radius:16px;padding:22px 24px;flex-wrap:wrap}'
    +'.hs-avatar{width:58px;height:58px;border-radius:50%;background:'+EM+';color:#f3efe2;display:grid;place-items:center;font-size:1.5625rem;font-weight:800;font-family:'+SERIF+'}'
    +'.hs-hi .h{font-size:1.1875rem;font-weight:700;font-family:'+SERIF+'}.hs-hi .h b{color:var(--em,#0e5e3e)}.hs-hi .s{color:'+MUT+';font-size:.8125rem}'
    +'.hs-kpis{display:flex;gap:12px;margin-left:auto}.hs-kpi{background:'+BG+';border:1px solid '+LINE+';border-radius:12px;padding:11px 20px;text-align:center}.hs-kpi b{display:block;font-size:1.4375rem;font-family:'+SERIF+';color:var(--em,#0e5e3e)}.hs-kpi span{font-size:.71875rem;color:'+MUT+'}'
    +'.hs-logout{background:'+SURF2+';color:'+INK+';border:1px solid '+LINE+';border-radius:10px;padding:10px 17px;font-weight:600;cursor:pointer;font-family:'+HEAD+'}.hs-logout:hover{border-color:'+RED+';color:'+RED+'}'
    +'.hs-tabs{display:flex;gap:8px;margin:22px 0}.hs-tabs button{background:'+SURF+';border:1px solid '+LINE+';color:'+MUT+';border-radius:11px;padding:11px 20px;font-weight:600;font-size:.875rem;cursor:pointer;font-family:'+HEAD+'}.hs-tabs button.act{background:'+EM+';color:#f3efe2;border-color:transparent}'
    +'.hs-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:760px){.hs-grid{grid-template-columns:1fr}}'
    +'.hs-card{background:'+SURF+';border:1px solid '+LINE+';border-radius:16px;padding:22px 24px}.hs-card h3{margin:0 0 14px;font-size:1.03125rem;font-family:'+SERIF+'}'
    +'.hs-card label{display:block;font-size:.78125rem;color:'+MUT+';margin:12px 0 5px;font-weight:600}'
    +'.hs-card input,.hs-card select,.hs-card textarea{width:100%;background:'+BG+';border:1px solid '+LINE+';border-radius:11px;padding:12px 14px;color:'+INK+';font-size:.875rem;box-sizing:border-box;font-family:'+HEAD+'}'
    +'.hs-card input:focus,.hs-card select:focus,.hs-card textarea:focus{outline:none;border-color:var(--em-2,#14805a);box-shadow:0 0 0 3px rgba(20,128,90,.12)}.hs-card textarea{min-height:92px;resize:vertical}'
    +'.hs-ro{background:'+BG+';border:1px solid '+LINE+';border-radius:11px;padding:12px 14px;color:'+MUT+';font-size:.875rem}'
    +'.hs-btn{margin-top:17px;background:'+GOLD+';color:'+GOLDTX+';border:0;border-radius:11px;padding:12px 22px;font-weight:700;cursor:pointer;font-family:'+HEAD+';box-shadow:0 16px 34px -18px rgba(163,126,45,.7)}.hs-btn:hover{filter:brightness(1.05)}'
    +'.hs-msg{min-height:16px;font-size:.78125rem;margin-top:10px}.hs-msg.bad{color:'+RED+'}.hs-msg.ok{color:'+PROXD+'}'
    +'.hs-quickq h3{margin-bottom:6px}.hs-qnote{font-size:.71875rem;color:'+MUT+';margin-top:11px;line-height:1.55}'
    +'.hs-qlist{display:flex;flex-direction:column;gap:12px;margin-top:16px}'
    +'.hs-quote{background:'+SURF+';border:1px solid '+LINE+';border-radius:14px;padding:17px 19px}.hs-quote .qhead{display:flex;justify-content:space-between;gap:10px;align-items:flex-start}.hs-quote .qk{font-weight:700;font-size:.9375rem}.hs-quote .qd{color:'+MUT+';font-size:.75rem;margin-top:2px}'
    +'.qbadge{flex:0 0 auto;font-size:.75rem;font-weight:700;padding:5px 12px;border-radius:999px}.qbadge.ok{background:rgba(25,195,125,.16);color:'+PROXD+'}.qbadge.wait{background:rgba(195,155,69,.16);color:var(--gold-deep,#a17e2d)}'
    +'.hs-quote .qmsg{color:'+MUT+';font-size:.84375rem;font-style:italic;margin:11px 0 0}'
    +'.hs-quote .qcevap{margin-top:13px;background:'+SURF2+';border-left:3px solid '+PROX+';border-radius:0 11px 11px 0;padding:12px 15px}.hs-quote .qcevap b{font-size:.75rem;color:'+PROXD+'}.hs-quote .qcevap p{margin:5px 0 0;font-size:.875rem;line-height:1.65}'
    +'.hs-quote .qpending{margin-top:13px;color:'+MUT+';font-size:.8125rem;display:flex;align-items:center;gap:9px}'
    +'.hs-empty{color:'+MUT+';font-size:.875rem;padding:24px;text-align:center}'
    /* ---- Admin üye bloğu ---- */
    +'.dnu-wrap{margin-top:8px}.dnu-quotes{display:flex;flex-direction:column;gap:10px}'
    +'.dnu-q{background:var(--panel,#fff);border:1px solid '+LINE+';border-radius:11px;padding:13px 15px}.dnu-qh{display:flex;align-items:center;justify-content:space-between;gap:10px}.dnu-qh b{font-size:.875rem}.dnu-badge{flex:0 0 auto;font-size:.6875rem;font-weight:800;padding:4px 10px;border-radius:999px}.dnu-badge.ok{background:rgba(25,195,125,.16);color:'+PROXD+'}.dnu-badge.wait{background:rgba(195,155,69,.16);color:var(--gold-deep,#a17e2d)}'
    +'.dnu-qm{color:'+MUT+';font-size:.75rem;margin-top:5px}.dnu-qt{font-size:.84375rem;font-style:italic;margin-top:8px}.dnu-qc{margin-top:9px;background:var(--panel-2,#f7f3ea);border-left:3px solid '+PROX+';border-radius:0 9px 9px 0;padding:9px 12px;font-size:.8125rem;line-height:1.55}.dnu-qc b{color:'+PROXD+';font-size:.71875rem}'
    +'.dnu-tblwrap{overflow-x:auto;border:1px solid '+LINE+';border-radius:11px}.dnu-tbl{width:100%;border-collapse:collapse;font-size:.84375rem}.dnu-tbl th,.dnu-tbl td{text-align:left;padding:11px 14px;border-bottom:1px solid '+LINE+'}.dnu-tbl th{color:'+MUT+';font-size:.71875rem;text-transform:uppercase;letter-spacing:.03em}.dnu-tbl tr:last-child td{border-bottom:0}'
    /* ---- hesap açıkken ana header GİZLE (z-index çakışması kesin fix) ---- */
    +'html.dn-hide-hdr header.nav{display:none!important}'
    /* ---- Favorilerim (hesap) ---- */
    +'.fav-sec{margin-bottom:26px}.fav-sech{font-family:'+SERIF+';font-size:1.0625rem;margin:0 0 12px;display:flex;align-items:center;gap:9px;color:'+INK+'}.fav-sech span{font-family:'+HEAD+';font-size:.75rem;font-weight:700;background:'+SURF2+';color:'+MUT+';border-radius:999px;padding:2px 10px}'
    +'.fav-list{display:grid;grid-template-columns:1fr 1fr;gap:14px}@media(max-width:720px){.fav-list{grid-template-columns:1fr}}'
    +'.fav-card{background:'+SURF+';border:1px solid '+LINE+';border-radius:14px;padding:16px 18px;display:flex;justify-content:space-between;gap:14px;align-items:flex-start}'
    +'.fav-cbody{min-width:0;flex:1}.fav-ct{font-weight:700;font-size:.9375rem;line-height:1.3}.fav-tag{font-family:'+HEAD+';font-size:.65625rem;font-weight:700;text-transform:uppercase;letter-spacing:.05em;color:'+GOLDTX+';background:'+GOLD+';border-radius:5px;padding:2px 7px;margin-left:5px;vertical-align:middle}'
    +'.fav-cl{color:'+MUT+';font-size:.78125rem;margin:5px 0}.fav-cp{color:var(--em,#0e5e3e);font-weight:800;font-size:.9375rem}.fav-cp span{font-weight:500;font-size:.71875rem;color:'+MUT+'}.fav-cs{color:'+MUT+';font-size:.78125rem;line-height:1.5;margin-top:5px}'
    +'.fav-cact{display:flex;flex-direction:column;gap:8px;align-items:flex-end;flex:0 0 auto}.fav-go{background:none;border:0;color:var(--em-2,#14805a);font-weight:700;font-size:.8125rem;cursor:pointer;white-space:nowrap;padding:0}.fav-go:hover{text-decoration:underline}'
    +'.fav-rm{width:34px;height:34px;border-radius:50%;background:'+SURF2+';border:1px solid '+LINE+';color:#c0392b;cursor:pointer;font-size:1rem;line-height:1}.fav-rm:hover{border-color:#c0392b}'
    +'.fav-empty{color:'+MUT+';font-size:.8125rem;padding:10px 2px}';
    var s=document.createElement('style');s.id='dnu-css';s.textContent=css;(document.head||document.documentElement).appendChild(s);
  }
  function _injectDom(){
    var wrap=document.createElement('div');wrap.id='dnuRoot';
    wrap.innerHTML=
      /* Giriş modal */
      '<div class="gmodal" id="dnGirisModal"><div class="gu-ov" onclick="closeGiris()"></div><div class="gu-card">'
      +'<button class="gu-x" onclick="closeGiris()" aria-label="Kapat">✕</button>'
      +'<div class="gu-head"><span class="mark">M</span><span id="gu_title">'+BRAND+' · Üye Girişi</span></div>'
      +'<div class="gu-tabs" id="gu_tabs"><button class="act" id="gt_login" onclick="girisTab(\'login\')">Üye Girişi</button><button id="gt_register" onclick="girisTab(\'register\')">Üye Ol</button></div>'
      /* login */
      +'<div class="gu-pane" id="gu_login"><label>E-posta</label><input id="gu_lemail" type="email" placeholder="ornek@eposta.com" autocomplete="email"><label>Şifre</label><input id="gu_lpass" type="password" placeholder="••••••••" autocomplete="current-password" onkeydown="if(event.key===\'Enter\')authDoLogin()"><button class="gu-btn" onclick="authDoLogin()">Üye Girişi →</button><div class="gu-err" id="gu_lerr"></div>'
        +'<div class="gu-note">Hesabınız yok mu? <a href="#" onclick="girisTab(\'register\');return false">Hemen üye olun</a></div>'
        +'<div class="gu-div">veya</div><button class="gu-btn2 gu-btn-yon" onclick="_adminGiris()">🔐 Yönetim Girişi →</button></div>'
      /* register */
      +'<div class="gu-pane" id="gu_register" hidden><label>Ad Soyad</label><input id="gu_rname" placeholder="Adınız Soyadınız" autocomplete="name"><label>E-posta</label><input id="gu_remail" type="email" placeholder="ornek@eposta.com" autocomplete="email"><label>Şifre <span style="opacity:.6">(en az 6 karakter)</span></label><input id="gu_rpass" type="password" placeholder="••••••••" autocomplete="new-password" onkeydown="if(event.key===\'Enter\')authDoRegister()"><div class="gu-kvkk"><input type="checkbox" id="gu_rkvkk"><label for="gu_rkvkk">KVKK Aydınlatma Metni kapsamında kişisel verilerimin işlenmesini onaylıyorum.</label></div><button class="gu-btn" onclick="authDoRegister()">Üyelik Oluştur →</button><div class="gu-err" id="gu_rerr"></div><div class="gu-note">Zaten üye misiniz? <a href="#" onclick="girisTab(\'login\');return false">Üye girişi</a></div></div>'
      /* profile (logged-in) */
      +'<div class="gu-pane" id="gu_profile" hidden><div class="gu-prof"><div class="gu-av" id="gu_pav">M</div><div><div class="gu-pname" id="gu_pname">—</div><div class="gu-pmail" id="gu_pmail">—</div></div></div><div class="gu-note" style="margin-top:15px">Demo modunda örnek oturum parolasızdır; parolanız tarayıcıda işlenmez ve saklanmaz. Üretimde üyelik sunucu tarafında güvenle yönetilir. Talepleriniz ProX doğrulanmış emlak verisiyle ön değerlendirilir.</div><button class="gu-btn" onclick="closeGiris();openHesap()">Hesap Sayfam →</button><button class="gu-btn2" onclick="authDoLogout()">Çıkış Yap</button></div>'
      /* yonetim (fallback pane, erişilirse) */
      +'<div class="gu-pane" id="gu_yonetim" hidden><p class="gu-sub">Yalnızca yetkili danışman erişimi.</p><button class="gu-btn gu-btn-yon" style="color:#f3efe2" onclick="_adminGiris()">🔐 Yönetim Paneline Giriş →</button><div class="gu-note"><a href="#" onclick="girisTab(\'login\');return false">← Üye girişi</a></div></div>'
      +'</div></div>'
      /* Hesap sayfası */
      +'<div id="dnHesapPage"><div class="dnh-hdr"><a class="dnh-logo" href="#" onclick="closeHesap();_dnHome();return false"><span class="mark">M</span><span>'+BRAND+'</span></a><button class="dnh-back" onclick="closeHesap();_dnHome()">← Ana sayfaya dön</button></div>'
      +'<div class="hs-wrap">'
      +'<div class="hs-top hs-rv"><div class="hs-avatar" id="hs_av">M</div><div class="hs-hi"><div class="h">Hoş geldiniz, <b id="hs_welcome">—</b></div><div class="s">'+BRAND+' üye paneli</div></div><div class="hs-kpis"><div class="hs-kpi"><b id="hs_favcount">0</b><span>Favori</span></div><div class="hs-kpi"><b id="hs_qcount">0</b><span>Talep</span></div></div><button class="hs-logout" onclick="authDoLogout();closeHesap()">Çıkış Yap</button></div>'
      +'<div class="hs-tabs hs-rv"><button id="hst_talepler" class="act" onclick="_hesapTab(\'talepler\')">📋 Taleplerim</button><button id="hst_favoriler" onclick="_hesapTab(\'favoriler\')">❤ Favorilerim</button><button id="hst_profil" onclick="_hesapTab(\'profil\')">👤 Profilim</button></div>'
      +'<div class="hs-pane hs-rv" id="hs_talepler"><div class="hs-card hs-quickq"><h3>⚡ Hızlı Talep · ProX Ön Değerlendirme</h3><label>Konu</label><select id="hq_konu"><option>Satılık gayrimenkul arıyorum</option><option>Kiralık arıyorum</option><option>Gayrimenkulümü satmak istiyorum</option><option>Gayrimenkulümü kiraya vermek istiyorum</option><option>Değerleme / ekspertiz</option><option>Yatırım danışmanlığı</option><option>Özel Portföy erişimi</option></select><label>Mesajınız</label><textarea id="hq_mesaj" placeholder="İl/ilçe, bütçe, kaç oda, m²… kısaca yazın"></textarea><button class="hs-btn" onclick="hesapQuickQuote()">Gönder →</button><div class="hs-msg" id="hq_msg"></div><div class="hs-qnote">Talebiniz ProX’un doğrulanmış emlak verisiyle ön değerlendirilir; ardından danışmanınız kişiye özel detaylandırır.</div></div><div class="hs-qlist" id="hs_qlist"></div></div>'
      +'<div class="hs-pane hs-rv" id="hs_favoriler" hidden><div id="hs_favgrid"></div></div>'
      +'<div class="hs-pane hs-rv" id="hs_profil" hidden><div class="hs-grid"><div class="hs-card"><h3>Hesap Bilgileri</h3><label>Ad Soyad</label><input id="hs_name" autocomplete="name"><label>E-posta</label><div class="hs-ro" id="hs_email">—</div><label>Telefon</label><input id="hs_phone" placeholder="05__ ___ __ __" autocomplete="tel"><button class="hs-btn" onclick="hesapSaveProfile()">Bilgileri Kaydet</button><div class="hs-msg" id="hs_pmsg"></div></div><div class="hs-card"><h3>Şifre Değiştir</h3><label>Mevcut Şifre</label><input type="password" id="hs_pw0" autocomplete="current-password"><label>Yeni Şifre <span style="opacity:.6">(en az 6)</span></label><input type="password" id="hs_pw1" autocomplete="new-password"><label>Yeni Şifre (tekrar)</label><input type="password" id="hs_pw2" autocomplete="new-password"><button class="hs-btn" onclick="hesapChangePw()">Şifreyi Güncelle</button><div class="hs-msg" id="hs_pwmsg"></div></div></div></div>'
      +'</div></div>';
    document.body.appendChild(wrap);
  }

  /* ===================== 6) BOOT + WIRING ===================== */
  function _boot(){
    _ensureDom();
    try{applyAuthUI();}catch(e){}
    try{_patchGorusmeler();}catch(e){}
    /* Giriş nav'ı bağla (statik onclick zaten girisOrHesap çağırıyor; yine de emniyet) */
    try{document.querySelectorAll('.nav-giris').forEach(function(a){if(!a.classList.contains('js-giris'))a.classList.add('js-giris');});applyAuthUI();}catch(e){}
    /* hash kısayolları: #giris / #uye / #hesap */
    function hashRoute(){var h=location.hash||'';if(h==='#hesap')girisOrHesap();else if(h==='#giris'||h==='#uye')openGiris();}
    window.addEventListener('hashchange',hashRoute);setTimeout(hashRoute,250);
    try{dnFavReflect();}catch(e){}
    [400,1200,2200].forEach(function(d){setTimeout(function(){try{document.querySelectorAll('.nav-giris').forEach(function(a){if(!a.classList.contains('js-giris'))a.classList.add('js-giris');});applyAuthUI();_patchGorusmeler();dnFavReflect();}catch(e){}},d);});
  }
  if(document.readyState==='complete')_boot();else window.addEventListener('load',_boot);
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeGiris();});

  /* ---------- global export ---------- */
  var api={authSession:authSession,applyAuthUI:applyAuthUI,openGiris:openGiris,closeGiris:closeGiris,girisTab:girisTab,
    authDoLogin:authDoLogin,authDoRegister:authDoRegister,authDoLogout:authDoLogout,_adminGiris:_adminGiris,_portalGiris:_portalGiris,
    openHesap:openHesap,closeHesap:closeHesap,girisOrHesap:girisOrHesap,_hesapTab:_hesapTab,renderHesap:renderHesap,
    hesapSaveProfile:hesapSaveProfile,hesapChangePw:hesapChangePw,hesapQuickQuote:hesapQuickQuote,_dnHome:_dnHome,
    dnFav:dnFav,dnIsFav:dnIsFav,dnFavReflect:dnFavReflect,dnFavBtn:dnFavBtn,_renderFavs:_renderFavs};
  for(var k in api){if(api.hasOwnProperty(k))window[k]=api[k];}
})();
