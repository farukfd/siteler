/* ============================================================================
   shared/listings-page.js — TAŞINABİLİR TAM-SAYFA İLAN LİSTESİ (standart)
   3 sitede (gayrimenkul · danışman · insaat) birebir aynı deneyim.
   • shared/listing.js motoruna bağlı (kart + kapsamlı detay + EİDS kapısı)
   • Filtre: Durum / Kategori / İl / İlçe / Arama / Sıralama + canlı sayaç
   • Kurumsal renkleri --accent'ten miras alır; mobil-öncelikli
   • Yayın kapısı: yalnız EİDS onaylı ilanlar (Listings.publicList) listelenir
   • SEO/AEO: CollectionPage + ItemList + BreadcrumbList JSON-LD (dürüst)
   Kullanım:
     ListingsPage.mount({
       mountId:'ilanlarApp', cfg:CFG, list:function(){...normalized[]...},
       title:'Satılık & Kiralık İlanlar', subtitle:'…',
       seo:{name, url, description}
     });
   ============================================================================ */
(function(){
  if(typeof window==='undefined'||window.ListingsPage)return;
  var LP={};
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function _catGroup(l){ try{ var c=(window.Listings&&Listings.catOf)?Listings.catOf(l):'konut';
    if(c==='konut'||c==='villa')return 'konut'; if(c==='ofis'||c==='dukkan')return 'ticari';
    if(c==='arsa')return 'arsa'; if(c==='bina'||c==='insaat')return 'bina'; return 'konut'; }catch(e){return 'konut';} }
  function _price(l){ var t=(''+(l.priceText||l.price||'')).replace(/[^\d]/g,''); return parseInt(t,10)||0; }
  function _num(id){ var e=document.getElementById(id); var v=e?parseFloat(e.value):NaN; return isNaN(v)?null:v; }

  /* ---- filtre durumu ---- */
  var ST={dur:'hepsi',kat:'tumu',il:'',ilce:'',q:'',sort:'oner'};

  /* ---- iskelet ---- */
  function _shell(o){
    return ''
    +'<div class="lp-toolbar">'
      +'<div class="lp-row lp-row-seg">'
        +'<div class="lp-seg" id="lpDur" data-k="dur">'
          +'<button data-v="hepsi" class="on">Tümü</button>'
          +'<button data-v="Satılık">Satılık</button>'
          +'<button data-v="Kiralık">Kiralık</button>'
        +'</div>'
        +'<div class="lp-seg" id="lpKat" data-k="kat">'
          +'<button data-v="tumu" class="on">Tüm Kategoriler</button>'
          +'<button data-v="konut">Konut</button>'
          +'<button data-v="ticari">İş Yeri</button>'
          +'<button data-v="arsa">Arsa</button>'
          +'<button data-v="bina">Bina / Proje</button>'
        +'</div>'
      +'</div>'
      +'<div class="lp-row lp-row-in">'
        +'<div class="lp-search"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>'
          +'<input id="lpSearch" placeholder="İlan başlığı, mahalle, ilçe… (ör. Levent, villa, 3+1)" autocomplete="off"></div>'
        +'<select id="lpIl" class="lp-sel" aria-label="İl"><option value="">Tüm İller</option></select>'
        +'<select id="lpIlce" class="lp-sel" aria-label="İlçe"><option value="">Tüm İlçeler</option></select>'
        +'<select id="lpSort" class="lp-sel" aria-label="Sıralama">'
          +'<option value="oner">Önerilen</option>'
          +'<option value="fiyat-artan">Fiyat (Artan)</option>'
          +'<option value="fiyat-azalan">Fiyat (Azalan)</option>'
        +'</select>'
      +'</div>'
      +'<div class="lp-meta"><span class="lp-live"><span class="lp-dot"></span>EİDS yetki belgeli</span> · <b id="lpCount">0</b> ilan listeleniyor <button type="button" class="lp-clear" id="lpClear" onclick="ListingsPage.clear()">Filtreleri temizle</button><button type="button" class="lp-savebtn" id="lpSaveBtn" onclick="ListingsPage.saveSearch()">🔔 Aramayı kaydet</button></div>'
    +'<div class="lp-saved" id="lpSaved" hidden></div>'
    +'</div>'
    +'<div class="lst-grid" id="lpGrid"><div class="lp-skel">İlanlar yükleniyor…</div></div>';
  }
  function _empty(){
    return '<div class="lp-empty"><div class="lp-empty-ic">🔍</div><h3>Aradığınız kriterlere uygun ilan bulunamadı</h3>'
      +'<p>Filtreleri genişletin ya da temizleyin. Aradığınız gayrimenkul vitrinde yoksa, henüz <em>listelenmemiş</em> olabilir — bizimle iletişime geçin, sizin için bulalım.</p>'
      +'<button type="button" class="lp-empty-btn" onclick="ListingsPage.clear()">Filtreleri Temizle</button></div>';
  }

  /* ---- İl / İlçe seçeneklerini veriden doldur (yalnız ilanı olan yerler) ---- */
  function _fillGeo(all){
    var ils={}, ilSel=document.getElementById('lpIl'); if(!ilSel)return;
    all.forEach(function(l){ if(l&&l.il){ ils[l.il]=ils[l.il]||{}; if(l.ilce)ils[l.il][l.ilce]=1; } });
    var keys=Object.keys(ils).sort(function(a,b){return a.localeCompare(b,'tr');});
    ilSel.innerHTML='<option value="">Tüm İller</option>'+keys.map(function(il){return '<option'+(il===ST.il?' selected':'')+'>'+esc(il)+'</option>';}).join('');
    LP._geo=ils; _fillIlce();
  }
  function _fillIlce(){
    var s=document.getElementById('lpIlce'); if(!s)return;
    var r=(LP._geo&&LP._geo[ST.il])?Object.keys(LP._geo[ST.il]).sort(function(a,b){return a.localeCompare(b,'tr');}):[];
    s.innerHTML='<option value="">Tüm İlçeler</option>'+r.map(function(x){return '<option'+(x===ST.ilce?' selected':'')+'>'+esc(x)+'</option>';}).join('');
    s.disabled=!ST.il;
  }

  /* ---- filtreleme ---- */
  function _filtered(pub){
    var q=(ST.q||'').toLocaleLowerCase('tr').trim();
    var out=pub.filter(function(l){
      if(ST.dur!=='hepsi'&&(''+(l.op||''))!==ST.dur)return false;
      if(ST.kat!=='tumu'&&_catGroup(l)!==ST.kat)return false;
      if(ST.il&&(l.il||'')!==ST.il)return false;
      if(ST.ilce&&(l.ilce||'')!==ST.ilce)return false;
      if(q){ var hay=((l.title||'')+' '+(l.mah||'')+' '+(l.ilce||'')+' '+(l.il||'')+' '+(l.type||'')+' '+((l.specs||[]).map(function(s){return s.v;}).join(' '))).toLocaleLowerCase('tr'); if(hay.indexOf(q)<0)return false; }
      return true;
    });
    if(ST.sort==='fiyat-artan')out.sort(function(a,b){return _price(a)-_price(b);});
    else if(ST.sort==='fiyat-azalan')out.sort(function(a,b){return _price(b)-_price(a);});
    return out;
  }

  /* ---- render ---- */
  LP.render=function(){
    var grid=document.getElementById('lpGrid'); if(!grid)return;
    var all=(LP._opts.list&&LP._opts.list())||[];
    var pub=(window.Listings&&Listings.publicList)?Listings.publicList(all):all;
    var f=_filtered(pub);
    grid.innerHTML=f.length? f.map(function(l){return (window.Listings&&Listings.cardHTML)?Listings.cardHTML(l,LP._opts.cfg):'';}).join('') : _empty();
    var c=document.getElementById('lpCount'); if(c)c.textContent=f.length;
    var cl=document.getElementById('lpClear'); if(cl)cl.style.display=(ST.dur!=='hepsi'||ST.kat!=='tumu'||ST.il||ST.ilce||ST.q||ST.sort!=='oner')?'':'none';
    try{if(LP._opts.onRender)LP._opts.onRender(f);}catch(e){}
  };

  /* ═══ KAYITLI ARAMA (üyelik kancalı: GM_SS_READ/SYNC — tanımsız sitede yerel) ═══ */
  function _ssLoad(){ try{if(window.GM_SS_READ){var r=window.GM_SS_READ();if(r)return r;}}catch(e){}
    try{return JSON.parse(localStorage.getItem('lp_saved_searches')||'[]')||[];}catch(e){return[];} }
  function _ssSave(a){ a=(a||[]).slice(0,12);
    try{localStorage.setItem('lp_saved_searches',JSON.stringify(a));}catch(e){}
    try{if(window.GM_SS_SYNC)window.GM_SS_SYNC(a);}catch(e){} }
  function _ssCount(st){ try{var all=(LP._opts.list&&LP._opts.list())||[];var pub=all.filter(function(l){return l.status!=='pasif';});
    var keep=ST; ST=st; var n=_filtered(pub).length; ST=keep; return n; }catch(e){return 0;} }
  LP.saveSearch=function(){
    var auto=[(ST.dur!=='hepsi'?ST.dur:''),(ST.kat!=='tumu'?ST.kat:''),ST.il,ST.ilce,ST.q].filter(Boolean).join(' · ')||'Tüm ilanlar';
    var name=null; try{name=prompt('Bu aramaya bir ad verin:',auto);}catch(e){name=auto;}
    if(name==null)return; name=(name||auto).trim().slice(0,48)||auto;
    var a=_ssLoad();
    a.unshift({id:'ss'+Date.now(),name:name,st:{dur:ST.dur,kat:ST.kat,il:ST.il,ilce:ST.ilce,q:ST.q,sort:ST.sort},count:_ssCount({dur:ST.dur,kat:ST.kat,il:ST.il,ilce:ST.ilce,q:ST.q,sort:ST.sort}),ts:Date.now()});
    _ssSave(a); _ssRender();
    try{if(window.toast)toast('🔔 Arama kaydedildi — yeni ilan düşünce burada rozetle göreceksiniz.');}catch(e){}
  };
  LP.applySaved=function(id){
    var a=_ssLoad(),s=null; a.forEach(function(x){if(x.id===id)s=x;}); if(!s)return;
    ST={dur:s.st.dur||'hepsi',kat:s.st.kat||'tumu',il:s.st.il||'',ilce:s.st.ilce||'',q:s.st.q||'',sort:s.st.sort||'oner'};
    /* kontrolleri eşitle */
    ['lpDur','lpKat'].forEach(function(bid){var box=document.getElementById(bid);if(!box)return;var k=box.dataset.k;
      box.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.v===ST[k]);});});
    var q=document.getElementById('lpSearch');if(q)q.value=ST.q;
    var il=document.getElementById('lpIl');if(il)il.value=ST.il; _fillIlce();
    var ic=document.getElementById('lpIlce');if(ic)ic.value=ST.ilce;
    var so=document.getElementById('lpSort');if(so)so.value=ST.sort;
    LP.render();
    /* rozet tüketildi: sayacı güncelle */
    s.count=_ssCount(s.st); _ssSave(a); _ssRender();
  };
  LP.delSaved=function(id,ev){ if(ev&&ev.stopPropagation)ev.stopPropagation();
    _ssSave(_ssLoad().filter(function(x){return x.id!==id;})); _ssRender(); };
  function _ssRender(){
    var host=document.getElementById('lpSaved'); if(!host)return;
    var a=_ssLoad(); if(!a.length){host.hidden=true;host.innerHTML='';return;}
    host.hidden=false;
    host.innerHTML='<span class="lp-ss-lab">Kayıtlı aramalarım:</span>'+a.map(function(s){
      var cur=_ssCount(s.st), diff=Math.max(0,cur-(+s.count||0));
      return '<span class="lp-ss-chip" role="button" tabindex="0" onclick="ListingsPage.applySaved(\''+s.id+'\')" onkeydown="if(event.key===\'Enter\')ListingsPage.applySaved(\''+s.id+'\')">🔔 '+esc(s.name)
        +(diff?'<b class="lp-ss-new">+'+diff+' yeni</b>':'')
        +'<i title="Sil" onclick="ListingsPage.delSaved(\''+s.id+'\',event)">✕</i></span>';
    }).join('');
  }
  LP._ssBoot=function(){ try{_ssRender();
    var t=0; _ssLoad().forEach(function(s){t+=Math.max(0,_ssCount(s.st)-(+s.count||0));});
    if(t&&window.toast)toast('🔔 Kayıtlı aramalarınızda '+t+' yeni ilan var.');
  }catch(e){} };
  LP.clear=function(){ ST={dur:'hepsi',kat:'tumu',il:'',ilce:'',q:'',sort:'oner'};
    ['lpDur','lpKat'].forEach(function(id){var box=document.getElementById(id);if(box)box.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===(id==='lpDur'?'hepsi':'tumu'));});});
    var q=document.getElementById('lpSearch');if(q)q.value=''; var so=document.getElementById('lpSort');if(so)so.value='oner';
    var il=document.getElementById('lpIl');if(il)il.value=''; _fillIlce(); LP.render();
  };

  function _bind(){
    ['lpDur','lpKat'].forEach(function(id){ var box=document.getElementById(id); if(!box)return;
      box.addEventListener('click',function(e){ var b=e.target.closest('button'); if(!b)return;
        var k=box.getAttribute('data-k'); ST[k]=b.getAttribute('data-v');
        box.querySelectorAll('button').forEach(function(x){x.classList.toggle('on',x===b);}); LP.render(); }); });
    var s=document.getElementById('lpSearch'); if(s)s.addEventListener('input',function(){ST.q=s.value;LP.render();});
    var il=document.getElementById('lpIl'); if(il)il.addEventListener('change',function(){ST.il=il.value;ST.ilce='';_fillIlce();LP.render();});
    var ilce=document.getElementById('lpIlce'); if(ilce)ilce.addEventListener('change',function(){ST.ilce=ilce.value;LP.render();});
    var so=document.getElementById('lpSort'); if(so)so.addEventListener('change',function(){ST.sort=so.value;LP.render();});
  }

  /* ---- URL parametreleri: ?op=Satılık ?kat=konut ?q= ---- */
  function _applyQuery(){ try{ var p=new URLSearchParams(location.search);
    var op=p.get('op'); if(op){ ST.dur=/kiral/i.test(op)?'Kiralık':'Satılık'; var d=document.getElementById('lpDur'); if(d)d.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===ST.dur);}); }
    var kat=p.get('kat'); if(kat){ ST.kat=kat; var kb=document.getElementById('lpKat'); if(kb)kb.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-v')===ST.kat);}); }
    var q=p.get('q'); if(q){ ST.q=q; var qi=document.getElementById('lpSearch'); if(qi)qi.value=q; }
  }catch(e){} }

  /* ---- SEO / AEO: CollectionPage + ItemList + BreadcrumbList (dürüst, yalnız yayındakiler) ---- */
  function _seo(o){
    try{
      var all=(LP._opts.list&&LP._opts.list())||[];
      var pub=(window.Listings&&Listings.publicList)?Listings.publicList(all):all;
      var base=(o.seo&&o.seo.url)||location.href.split('#')[0].split('?')[0];
      var items=pub.slice(0,24).map(function(l,i){ return {"@type":"ListItem","position":i+1,
        "url":base+'#ilan-'+encodeURIComponent(l.id),
        "name":l.title||'İlan'}; });
      var g={"@context":"https://schema.org","@type":"CollectionPage",
        "name":(o.seo&&o.seo.name)||o.title||'İlanlar',
        "description":(o.seo&&o.seo.description)||o.subtitle||'',
        "url":base,
        "mainEntity":{"@type":"ItemList","numberOfItems":pub.length,"itemListElement":items},
        "breadcrumb":{"@type":"BreadcrumbList","itemListElement":[
          {"@type":"ListItem","position":1,"name":"Ana Sayfa","item":base.replace(/ilanlar\.html.*$/,'index.html')},
          {"@type":"ListItem","position":2,"name":((o.seo&&o.seo.name)||'İlanlar'),"item":base}
        ]}};
      var el=document.getElementById('lpSeoLd'); if(!el){el=document.createElement('script');el.type='application/ld+json';el.id='lpSeoLd';document.head.appendChild(el);}
      el.textContent=JSON.stringify(g);
    }catch(e){}
  }

  var _cssDone=false;
  function _css(){
    if(_cssDone)return; _cssDone=true;
    var A='var(--accent,#0e7c86)', INK='var(--ink,#12181f)', MUT='var(--muted,#6b7280)', SURF='var(--surface,#fff)', LINE='var(--line,#e6e8ec)';
    var css=''
    +'.lp-toolbar{background:'+SURF+';border:1px solid '+LINE+';border-radius:16px;padding:16px;margin:0 0 24px;box-shadow:0 4px 24px rgba(15,23,42,.05)}'
    +'.lp-row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}'
    +'.lp-row-seg{margin-bottom:12px}'
    +'.lp-row-in{margin-bottom:4px}'
    +'.lp-seg{display:inline-flex;background:rgba(0,0,0,.04);border:1px solid '+LINE+';border-radius:12px;padding:4px;gap:2px;flex-wrap:wrap}'
    +'.lp-seg button{border:0;background:transparent;color:'+MUT+';font:600 .8125rem/1 system-ui,-apple-system,sans-serif;padding:9px 14px;border-radius:9px;cursor:pointer;transition:.15s;white-space:nowrap}'
    +'.lp-seg button:hover{color:'+INK+'}'
    +'.lp-seg button.on{background:'+A+';color:#fff;box-shadow:0 2px 8px rgba(0,0,0,.12)}'
    +'.lp-search{flex:1 1 260px;min-width:0;display:flex;align-items:center;gap:8px;background:rgba(0,0,0,.03);border:1px solid '+LINE+';border-radius:11px;padding:0 12px;color:'+MUT+'}'
    +'.lp-search input{flex:1;min-width:0;border:0;background:transparent;padding:12px 0;font:500 .875rem/1 system-ui,-apple-system,sans-serif;color:'+INK+';outline:none}'
    +'.lp-sel{border:1px solid '+LINE+';background:'+SURF+';color:'+INK+';border-radius:11px;padding:11px 12px;font:600 .8125rem/1 system-ui,-apple-system,sans-serif;cursor:pointer;min-width:130px;flex:0 1 auto}'
    +'.lp-sel:disabled{opacity:.5;cursor:not-allowed}'
    +'.lp-savebtn{margin-left:10px;border:1px solid var(--accent,#0e7490);background:#fff;color:var(--accent,#0e7490);border-radius:99px;padding:6px 13px;font:700 .78125rem inherit;cursor:pointer}.lp-savebtn:hover{background:var(--accent,#0e7490);color:#fff}.lp-saved{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 2px}.lp-ss-lab{font:700 .75rem inherit;color:#64748b;text-transform:uppercase;letter-spacing:.04em}.lp-ss-chip{display:inline-flex;align-items:center;gap:7px;background:#fff;border:1px solid #e2e8f0;border-radius:99px;padding:6px 12px;font:600 .8125rem inherit;color:#0f172a;cursor:pointer}.lp-ss-chip:hover{border-color:var(--accent,#0e7490)}.lp-ss-new{color:#fff;background:#16a34a;border-radius:99px;padding:2px 8px;font-size:.6875rem}.lp-ss-chip i{font-style:normal;color:#94a3b8;cursor:pointer;padding:0 2px}.lp-ss-chip i:hover{color:#dc2626}.lp-meta{margin-top:14px;padding-top:13px;border-top:1px dashed '+LINE+';font:500 .8125rem/1.5 system-ui,-apple-system,sans-serif;color:'+MUT+';display:flex;align-items:center;gap:8px;flex-wrap:wrap}'
    +'.lp-meta b{color:'+A+';font-size:.9375rem}'
    +'.lp-live{display:inline-flex;align-items:center;gap:6px;font-weight:700;color:'+INK+'}'
    +'.lp-dot{width:8px;height:8px;border-radius:50%;background:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.18)}'
    +'.lp-clear{margin-left:auto;border:1px solid '+LINE+';background:'+SURF+';color:'+MUT+';border-radius:8px;padding:7px 12px;font:600 .75rem/1 system-ui;cursor:pointer}'
    +'.lp-clear:hover{color:'+A+';border-color:'+A+'}'
    +'.lp-skel{grid-column:1/-1;padding:60px;text-align:center;color:'+MUT+'}'
    +'.lp-empty{grid-column:1/-1;text-align:center;padding:60px 20px;color:'+MUT+'}'
    +'.lp-empty-ic{font-size:2.75rem;margin-bottom:10px}'
    +'.lp-empty h3{color:'+INK+';font:700 1.25rem/1.3 system-ui,-apple-system,sans-serif;margin:0 0 8px}'
    +'.lp-empty p{max-width:520px;margin:0 auto 18px;font:500 .875rem/1.6 system-ui}'
    +'.lp-empty em{color:'+A+';font-style:normal;font-weight:700}'
    +'.lp-empty-btn{border:0;background:'+A+';color:#fff;border-radius:11px;padding:12px 22px;font:700 .875rem/1 system-ui;cursor:pointer}'
    +'@media(max-width:640px){.lp-toolbar{padding:12px;border-radius:14px}.lp-seg{width:100%;justify-content:stretch}.lp-seg button{flex:1;padding:9px 6px;text-align:center}.lp-sel{flex:1 1 45%;min-width:0}.lp-clear{margin-left:0;width:100%;margin-top:4px}}';
    var st=document.createElement('style'); st.id='lpCSS'; st.textContent=css; document.head.appendChild(st);
  }

  LP.mount=function(o){
    o=o||{}; LP._opts=o; _css();
    try{if(window.Listings&&Listings.injectCSS)Listings.injectCSS();}catch(e){}
    var root=document.getElementById(o.mountId||'ilanlarApp'); if(!root)return;
    root.innerHTML=_shell(o);
    var all=(o.list&&o.list())||[]; var pub=(window.Listings&&Listings.publicList)?Listings.publicList(all):all;
    _fillGeo(pub); _bind(); _applyQuery(); LP.render(); _seo(o); try{LP._ssBoot();}catch(e){}
  };
  LP.refresh=function(){ try{var all=(LP._opts.list&&LP._opts.list())||[];var pub=(window.Listings&&Listings.publicList)?Listings.publicList(all):all;_fillGeo(pub);}catch(e){} LP.render(); };

  window.ListingsPage=LP;
})();
