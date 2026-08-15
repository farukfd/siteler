/* ============================================================================
   shared/listing-extras.js — İLAN DETAY İLERİ ÖZELLİKLERİ (Faz 1-4)
   shared/listing.js motorunu HOOK'larla genişletir (window.Listings._ext*).
   Faz 1 — Medya: Video (YouTube/Vimeo/MP4/URL + yerel dosya), 360° Sanal Tur
            (Pannellum, kullanıcı equirectangular yükler), Kat/Vaziyet Planı.
            Yerel dosyalar IndexedDB'de saklanır (kalıcı, büyük kota).
   Faz 2 — Finans: Konut kredisi hesaplayıcı (peşinat/faiz/vade→taksit),
            kira getiri/amortisman, Enerji Kimlik Belgesi sınıfı (A-G).
   Faz 3 — Keşif: Benzer ilanlar, Karşılaştırma (2-4 ilan), tam-ekran Lightbox.
   Faz 4 — Kategori-bilinçli medya/etiket, PDF/yazdır, görüntülenme sayacı.
   Bağımlılık: shared/listing.js (Listings), Pannellum (window.pannellum).
   Kurumsal renk --accent'ten miras. Mobil-öncelikli. Dürüst: sahte veri yok.
   ============================================================================ */
(function(){
  if(typeof window==='undefined'||!window.Listings||window.Listings._extLoaded)return;
  var L=window.Listings; L._extLoaded=true;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function catOf(l){try{return L.catOf(l);}catch(e){return 'konut';}}
  function _num(v){var t=(''+(v==null?'':v)).replace(/[^\d]/g,'');return parseInt(t,10)||0;}
  function _tl(n){return Math.round(n).toLocaleString('tr-TR')+' ₺';}

  /* ================= IndexedDB MEDYA DEPOSU (kullanıcı yüklemeleri) ================= */
  var MediaStore=(function(){
    var DB='nadas_media', STORE='media', _db=null, _urls={};
    function open(){ return new Promise(function(res,rej){ if(_db)return res(_db);
      try{ var rq=indexedDB.open(DB,1);
        rq.onupgradeneeded=function(e){ var db=e.target.result; if(!db.objectStoreNames.contains(STORE))db.createObjectStore(STORE); };
        rq.onsuccess=function(e){ _db=e.target.result; res(_db); };
        rq.onerror=function(){ rej(rq.error); };
      }catch(err){ rej(err); } }); }
    function key(id,kind){ return String(id)+'::'+kind; }
    return {
      put:function(id,kind,blob){ return open().then(function(db){ return new Promise(function(res,rej){
        var tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put(blob,key(id,kind));
        tx.oncomplete=function(){ try{if(_urls[key(id,kind)]){URL.revokeObjectURL(_urls[key(id,kind)]);delete _urls[key(id,kind)];}}catch(e){} res(true); };
        tx.onerror=function(){ rej(tx.error); }; }); }); },
      get:function(id,kind){ return open().then(function(db){ return new Promise(function(res){
        var rq=db.transaction(STORE,'readonly').objectStore(STORE).get(key(id,kind));
        rq.onsuccess=function(){ res(rq.result||null); }; rq.onerror=function(){ res(null); }; }); })
        .catch(function(){return null;}); },
      url:function(id,kind){ var k=key(id,kind); if(_urls[k])return Promise.resolve(_urls[k]);
        return this.get(id,kind).then(function(b){ if(!b)return null; try{var u=URL.createObjectURL(b);_urls[k]=u;return u;}catch(e){return null;} }); },
      del:function(id,kind){ return open().then(function(db){ return new Promise(function(res){
        var tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE)['delete'](key(id,kind));
        tx.oncomplete=function(){ try{if(_urls[key(id,kind)]){URL.revokeObjectURL(_urls[key(id,kind)]);delete _urls[key(id,kind)];}}catch(e){} res(true); }; tx.onerror=function(){res(false);}; }); }); }
    };
  })();
  L.MediaStore=MediaStore;

  /* ================= MEDYA DÜRÜSTLÜĞÜ =================
     Video / 360° tur / kat planı YALNIZ ilanın kendi medyası varsa gösterilir:
     l.videoUrl / l.tour360Url / l.floorplanUrl veya kullanıcının yüklediği yerel
     dosya (IndexedDB, l.media bayrakları). Örnek/dolgu medya enjeksiyonu kaldırıldı;
     hiçbir ilana kendisine ait olmayan medya basılmaz. L.DEMO_MEDIA null sabitlendi
     (geriye dönük uyum: dışarıdan okunursa 'kapalı' görülür). */
  L.DEMO_MEDIA=null;
  function mediaOf(l){ var m=(l&&l.media)||{}; l=l||{};
    return {
      video: !!(l.videoUrl||m.videoUrl||m.video),
      videoUrl: l.videoUrl||m.videoUrl||'',          /* dış URL (YouTube/Vimeo/MP4) */
      videoFile: !!m.video,                          /* IndexedDB'de yerel dosya var mı */
      tour: !!(l.tour360Url||m.tour360),
      tourUrl: l.tour360Url||'',                     /* aynı-köken URL (CORS-güvenli) */
      tourFile: !!m.tour360,
      floor: !!(l.floorplanUrl||m.floorplan),
      floorUrl: l.floorplanUrl||'',
      floorFile: !!m.floorplan
    };
  }
  function floorLabel(l){ var c=catOf(l); return (c==='arsa')?'Vaziyet / İmar Planı':(c==='bina'||c==='insaat')?'Kat / Vaziyet Planı':'Kat Planı'; }
  function ytId(u){ var m=(''+u).match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/); return m?m[1]:''; }
  function vimeoId(u){ var m=(''+u).match(/vimeo\.com\/(?:video\/)?(\d+)/); return m?m[1]:''; }
  function videoEmbed(url,auto){ var a=auto?1:0; var y=ytId(url); if(y)return '<iframe src="https://www.youtube.com/embed/'+y+'?rel=0&autoplay='+a+'" title="İlan videosu" frameborder="0" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe>';
    var v=vimeoId(url); if(v)return '<iframe src="https://player.vimeo.com/video/'+v+'?autoplay='+a+'" title="İlan videosu" frameborder="0" allow="autoplay;fullscreen;picture-in-picture" allowfullscreen style="width:100%;height:100%;border:0"></iframe>';
    return '<video src="'+esc(url)+'" controls playsinline'+(auto?' autoplay':'')+' style="width:100%;height:100%;background:#000"></video>'; }

  /* ================= FAZ 1 — MEDYA-ENTEGRE GALERİ =================
     Video + 360 tur + kat planı GALERİ ÖĞESİ olarak; kapak sonrası 2. sıra video.
     Ayrı medya barı YOK (_extMedia boş döner). 20 görsel + 1 video + 1 tur + plan. */
  L._extMedia=function(l,cfg){ return ''; };

  function _thumbInner(it){
    if(it.t==='img'||it.t==='floor'||(it.t==='tour'&&it.u&&!it.file))return '<img src="'+esc(it.u)+'" alt="" loading="lazy" onerror="this.style.display=\'none\'">';
    return '<span class="lstd-th-ph">'+(it.t==='video'?'🎬':'🌐')+'</span>';
  }
  function _thumbHTML(it,i){
    var badge=it.t==='video'?'<span class="lstd-th-badge play">▶</span>':it.t==='tour'?'<span class="lstd-th-badge">360°</span>':it.t==='floor'?'<span class="lstd-th-badge">📐</span>':'';
    return '<button type="button" class="lstd-th2 '+it.t+(i===0?' on':'')+'" onclick="Listings._extGalPick('+i+')" aria-label="'+(it.t==='video'?'Video':it.t==='tour'?'360° Sanal Tur':it.t==='floor'?'Kat Planı':'Fotoğraf')+'">'+_thumbInner(it)+badge+'</button>';
  }
  function _stageHTML(it,auto){
    if(!it)return '<div class="lstd-stage-in lstd-empty"><span>🏢</span></div>';
    if(it.t==='img')return '<div class="lstd-stage-in" onclick="if(Listings._extLightbox)Listings._extLightbox(Listings._lbIdx||0)"><img id="lstdStageImg" src="'+esc(it.u)+'" alt="" onerror="this.style.display=\'none\'"><span class="lstd-zoom" aria-hidden="true">⛶</span></div>';
    if(it.t==='video')return '<div class="lstd-stage-media" id="lstdVideo">'+(it.u?videoEmbed(it.u,auto):'<div class="lstd-mload">▶ Video yükleniyor…</div>')+'</div>';
    if(it.t==='tour'){
      /* Dış tur linki (Matterport/Kuula/3D) → iframe; equirectangular görsel/dosya → Pannellum */
      var ext=it.u&&!it.file&&/^https?:/i.test(it.u)&&!/\.(jpe?g|png|webp|gif)(\?|#|$)/i.test(it.u)&&!/^blob:|^data:/i.test(it.u);
      if(ext)return '<div class="lstd-stage-media"><iframe src="'+esc(it.u)+'" title="360° Sanal Tur" frameborder="0" allowfullscreen allow="xr-spatial-tracking;gyroscope;accelerometer;fullscreen" style="width:100%;height:100%;border:0"></iframe></div>';
      return '<div class="lstd-stage-media"><div class="lstd-pano" id="lstdPano"><div class="lstd-mload">🌐 Sanal tur yükleniyor…</div></div><div class="lstd-mhint">🖱️ Sürükleyerek 360° gezin · mobilde jiroskop + dokunma</div></div>';
    }
    if(it.t==='floor')return '<div class="lstd-stage-media lstd-floor"><img src="'+esc(it.u)+'" alt="Kat Planı" onclick="Listings._extLightboxUrl(this.src)"></div>';
    return '';
  }
  L._extGallery=function(l){
    var imgs=[]; try{imgs=(l.images||[]).filter(Boolean).slice(0,20);}catch(e){}
    var M=mediaOf(l);
    var items=[];
    if(imgs.length)items.push({t:'img',u:imgs[0],imgIdx:0});
    if(M.video)items.push({t:'video',u:M.videoUrl||'',file:M.videoFile});   /* kapaktan sonra 2. sıra */
    if(M.tour)items.push({t:'tour',u:M.tourUrl||'',file:M.tourFile});
    for(var i=1;i<imgs.length;i++)items.push({t:'img',u:imgs[i],imgIdx:i});
    if(M.floor)items.push({t:'floor',u:M.floorUrl||'',file:M.floorFile});
    if(!items.length)return '';
    L._galItems=items;
    var badges='';
    if(M.video)badges+='<span class="lstd-gcount v">▶ Video</span>';
    if(M.tour)badges+='<span class="lstd-gcount t">🌐 360°</span>';
    badges+='<span class="lstd-gcount">📷 '+imgs.length+'</span>';
    return '<div class="lstd-gallery2"><div class="lstd-stage" id="lstdStage">'+_stageHTML(items[0],false)+'<div class="lstd-gbadges">'+badges+'</div></div>'
      +'<div class="lstd-thumbs2">'+items.map(_thumbHTML).join('')+'</div></div>';
  };
  L._extGalPick=function(i){
    var it=L._galItems&&L._galItems[i]; if(!it)return;
    var stage=document.getElementById('lstdStage'); if(!stage)return;
    var badges=stage.querySelector('.lstd-gbadges'); var bh=badges?badges.outerHTML:'';
    stage.innerHTML=_stageHTML(it,it.t==='video')+bh;
    try{[].forEach.call(document.querySelectorAll('.lstd-thumbs2 .lstd-th2'),function(b,idx){b.classList.toggle('on',idx===i);});}catch(e){}
    if(it.t==='img'){L._lbIdx=it.imgIdx||0;}
    if(it.t==='video'&&it.file&&!it.u){ MediaStore.url(L._cur.id,'video').then(function(u){var box=document.getElementById('lstdVideo');if(box&&u)box.innerHTML='<video src="'+u+'" controls playsinline autoplay style="width:100%;height:100%;background:#000"></video>';}); }
    if(it.t==='tour'){ L._mountPanoStage(it); }
    if(it.t==='floor'&&it.file&&!it.u){ MediaStore.url(L._cur.id,'floorplan').then(function(u){var img=stage.querySelector('.lstd-floor img');if(img&&u)img.src=u;}); }
  };
  L._mountPanoStage=function(it){ try{ var el=document.getElementById('lstdPano'); if(!el)return;
    function init(url){ if(!url){el.innerHTML='<div class="lstd-mload">Sanal tur görseli bulunamadı.</div>';return;}
      if(!window.pannellum){
        /* PERF: Pannellum (56KB) yalnız 360° tur açılınca yüklenir; yol bu script'in src'sinden türetilir */
        if(el.dataset.pnl){el.innerHTML='<div class="lstd-mload">360° görüntüleyici yüklenemedi.</div>';return;}
        el.dataset.pnl='1'; el.innerHTML='<div class="lstd-mload">360° yükleniyor…</div>';
        var base=(function(){var t=document.querySelector('script[src*="listing-extras"]');return t?t.src.replace(/listing-extras\.js.*$/,''):'../shared/';})();
        var c=document.createElement('link');c.rel='stylesheet';c.href=base+'vendor/pannellum.css?v=1';document.head.appendChild(c);
        var sc=document.createElement('script');sc.src=base+'vendor/pannellum.js?v=1';
        sc.onload=function(){el.dataset.pnl='';try{init(url);}catch(e){el.innerHTML='<div class="lstd-mload">Sanal tur başlatılamadı.</div>';}};
        sc.onerror=function(){el.innerHTML='<div class="lstd-mload">360° görüntüleyici yüklenemedi.</div>';};
        document.head.appendChild(sc);return;}
      el.innerHTML=''; try{ window.pannellum.viewer(el,{type:'equirectangular',panorama:url,autoLoad:true,showZoomCtrl:true,showFullscreenCtrl:true,autoRotate:-2,compass:false}); }catch(e){ el.innerHTML='<div class="lstd-mload">Sanal tur başlatılamadı.</div>'; } }
    if(it.u)init(it.u); else if(it.file&&L._cur)MediaStore.url(L._cur.id,'tour360').then(init); else init(null);
  }catch(e){} };

  /* ================= FAZ 2 — ENERJİ KİMLİK ROZETİ (yan kart) ================= */
  var ENERGY={A:'#16a34a',B:'#65a30d',C:'#ca8a04',D:'#d97706',E:'#ea580c',F:'#dc2626',G:'#991b1b'};
  L._extEnergy=function(l){ var e=(l&&l.energy||'').toUpperCase(); if(!ENERGY[e])return '';
    return '<div class="lstd-energy" title="Enerji Kimlik Belgesi sınıfı"><span class="lstd-energy-l">Enerji Sınıfı</span><span class="lstd-energy-b" style="background:'+ENERGY[e]+'">'+esc(e)+'</span></div>'; };

  /* ================= FAZ 3/4 — YAN BUTONLAR (karşılaştır + yazdır) ================= */
  L._extSideBtns=function(l,cfg){
    var inC=_cmpHas(cfg.ns,l.id);
    return '<button type="button" class="lstd-btn lstd-cmp'+(inC?' on':'')+'" onclick="Listings._extToggleCmp(\''+esc(cfg.ns||'')+'\',\''+esc(l.id)+'\',this)">'+(inC?'✓ Karşılaştırmada':'⇄ Karşılaştır')+'</button>'
      +'<button type="button" class="lstd-btn lstd-print" onclick="Listings._extPrint()"><span aria-hidden="true">🖨️</span> Yazdır / PDF</button>';
  };

  /* ================= META (görüntülenme · favori · tarih) ================= */
  function _views(){ try{return JSON.parse(localStorage.getItem('lst_views')||'{}')||{};}catch(e){return {};} }
  function _bumpView(id){ try{var v=_views();v[id]=(v[id]||0)+1;localStorage.setItem('lst_views',JSON.stringify(v));return v[id];}catch(e){return 0;} }
  L._extMeta=function(l,cfg){ var v=(_views()[l.id]||0);
    var favN=0; try{favN=(L.favs?L.favs(cfg.ns).length:0);}catch(e){}
    var no=(l.ilanNo||('İLN-'+(1000000+((_num(l.id)||1)*7919)%9000000)));
    return '<div class="lstd-meta"><span><span>İlan No</span>: <b>'+esc(no)+'</b></span><span>👁 <b id="lstdViews">'+v+'</b> <span>görüntülenme</span></span>'+(l.tarih?'<span>📅 '+esc(l.tarih)+'</span>':'')+'</div>';
  };

  /* ================= FAZ 2 (finans) + FAZ 3 (benzer) — ANA SÜTUN SONU ================= */
  L._extAfterMain=function(l,cfg){
    var out='';
    /* Konut kredisi hesaplayıcı — Satılık ilanlar için */
    var price=_num(l.priceText||l.price); var isRent=/kiral/i.test(''+(l.op||''));
    if(price>0&&!isRent){
      var pesin=Math.round(price*0.20);
      out+='<div class="lstd-section lstd-fin"><h3><span aria-hidden="true">💰</span> Konut Kredisi Hesaplama</h3>'
        +'<div class="lstd-fin-grid">'
          +'<label>Konut Bedeli<input type="text" id="finPrice" value="'+_tl(price)+'" data-raw="'+price+'" oninput="Listings._extCalc()"></label>'
          +'<label>Peşinat (%<span id="finDownP">20</span>)<input type="range" id="finDown" min="0" max="90" value="20" oninput="Listings._extCalc()"></label>'
          +'<label>Faiz (aylık %)<input type="number" id="finRate" value="2.99" step="0.01" min="0" oninput="Listings._extCalc()"></label>'
          +'<label>Vade (ay)<select id="finTerm" onchange="Listings._extCalc()"><option>60</option><option>84</option><option selected>120</option><option>180</option><option>240</option></select></label>'
        +'</div>'
        +'<div class="lstd-fin-out" id="finOut"></div>'
        +'<div class="lstd-fin-note">Tahminî hesaplama; kesin teklif için bankanıza danışın. Faiz ve masraflar değişkendir.</div>'
      +'</div>';
    }
    /* Benzer ilanlar */
    try{ var all=(cfg.list&&cfg.list())||[]; var pub=L.publicList?L.publicList(all):all;
      var c=catOf(l); var sim=pub.filter(function(x){return x&&String(x.id)!==String(l.id)&&catOf(x)===c;});
      sim.sort(function(a,b){ var sa=(a.ilce===l.ilce?0:1), sb=(b.ilce===l.ilce?0:1); return sa-sb; });
      sim=sim.slice(0,3);
      if(sim.length){ out+='<div class="lstd-section lstd-similar"><h3><span aria-hidden="true">🏠</span> Benzer İlanlar</h3><div class="lst-grid lstd-sim-grid">'
        +sim.map(function(s){return L.cardHTML(s,cfg);}).join('')+'</div></div>'; }
    }catch(e){}
    return out;
  };

  /* Kredi taksiti (anüite) */
  L._extCalc=function(){ try{
    var price=_num((document.getElementById('finPrice')||{}).value)||_num((document.getElementById('finPrice')||{}).getAttribute&&document.getElementById('finPrice').getAttribute('data-raw'));
    var downP=+(document.getElementById('finDown')||{}).value||0; var rate=parseFloat((document.getElementById('finRate')||{}).value)||0;
    var term=+(document.getElementById('finTerm')||{}).value||0;
    var dp=document.getElementById('finDownP'); if(dp)dp.textContent=downP;
    var loan=Math.max(0,price*(1-downP/100)); var r=rate/100;
    var m=(r>0)?(loan*r/(1-Math.pow(1+r,-term))):(term?loan/term:0);
    var total=m*term, faiz=total-loan;
    var out=document.getElementById('finOut'); if(!out)return;
    var rateStr=(''+rate).replace('.',',');
    out.innerHTML='<div class="lstd-fin-hero">'
        +'<div class="lstd-fin-hero-ic">🏦</div>'
        +'<div class="lstd-fin-hero-l">Tahminî Aylık Taksit</div>'
        +'<div class="lstd-fin-hero-v">'+_tl(m)+'</div>'
        +'<div class="lstd-fin-hero-sub">'+_tl(loan)+' kredi · '+term+' ay · aylık %'+rateStr+'</div>'
      +'</div>'
      +'<div class="lstd-fin-break">'
        +'<div class="lstd-fin-chip"><span>Kredi Tutarı</span><b>'+_tl(loan)+'</b></div>'
        +'<div class="lstd-fin-chip"><span>Peşinat</span><b>'+_tl(price-loan)+'</b></div>'
        +'<div class="lstd-fin-chip"><span>Toplam Geri Ödeme</span><b>'+_tl(total)+'</b></div>'
        +'<div class="lstd-fin-chip"><span>Toplam Faiz</span><b>'+_tl(faiz)+'</b></div>'
      +'</div>';
  }catch(e){} };

  /* ================= FAZ 3 — LIGHTBOX (tam ekran galeri) ================= */
  function _imgs(){ try{var l=L._cur;var im=(l&&(l.images||l.img))||[];return Array.isArray(im)?im:[im];}catch(e){return [];} }
  L._extLightbox=function(i){ var im=_imgs().filter(Boolean); if(!im.length)return; L._lbA=im; L._lbI=Math.max(0,Math.min(i||0,im.length-1)); _lbRender(); };
  L._extLightboxUrl=function(u){ if(!u)return; L._lbA=[u]; L._lbI=0; _lbRender(); };
  function _lbRender(){ var ov=document.getElementById('lstLightbox');
    if(!ov){ov=document.createElement('div');ov.id='lstLightbox';ov.className='lst-lb';document.body.appendChild(ov);
      ov.addEventListener('click',function(e){if(e.target===ov)L._extLbClose();}); }
    var im=L._lbA||[],i=L._lbI||0;
    ov.innerHTML='<button class="lst-lb-x" onclick="Listings._extLbClose()" aria-label="Kapat">✕</button>'
      +(im.length>1?'<button class="lst-lb-nav prev" onclick="Listings._extLbNav(-1)" aria-label="Önceki">‹</button>':'')
      +'<img src="'+esc(im[i])+'" alt="">'
      +(im.length>1?'<button class="lst-lb-nav next" onclick="Listings._extLbNav(1)" aria-label="Sonraki">›</button>':'')
      +(im.length>1?'<div class="lst-lb-count">'+(i+1)+' / '+im.length+'</div>':'');
    ov.classList.add('on');
  }
  L._extLbNav=function(d){ var im=L._lbA||[]; L._lbI=((L._lbI||0)+d+im.length)%im.length; _lbRender(); };
  L._extLbClose=function(){ var ov=document.getElementById('lstLightbox'); if(ov)ov.classList.remove('on'); };

  /* ================= FAZ 3 — KARŞILAŞTIRMA ================= */
  function _cmpLoad(){ try{return JSON.parse(localStorage.getItem('lst_compare')||'[]')||[];}catch(e){return [];} }
  function _cmpSave(a){ try{localStorage.setItem('lst_compare',JSON.stringify(a.slice(0,4)));}catch(e){} }
  function _cmpHas(ns,id){ return _cmpLoad().some(function(x){return x.ns===ns&&String(x.id)===String(id);}); }
  L._extHasCmp=function(ns,id){ return _cmpHas(ns,id); };
  L._extToggleCmp=function(ns,id,btn,ev){ if(ev&&ev.stopPropagation){ev.stopPropagation();if(ev.preventDefault)ev.preventDefault();}
    var a=_cmpLoad(); var i=a.findIndex(function(x){return x.ns===ns&&String(x.id)===String(id);});
    if(i>=0)a.splice(i,1); else { if(a.length>=4){alert('En fazla 4 ilan karşılaştırılır.');return;} a.push({ns:ns,id:String(id)}); }
    _cmpSave(a); var on=i<0;
    if(btn){ if(btn.classList.contains('lst-cmpc')){btn.classList.toggle('on',on);btn.title=on?'Karşılaştırmadan çıkar':'Karşılaştırmaya ekle';}
      else {btn.classList.toggle('on',on);btn.textContent=on?'✓ Karşılaştırmada':'⇄ Karşılaştır';} }
    _cmpBar();
  };
  function _cmpResolve(){ return _cmpLoad().map(function(x){ var c=L._reg&&L._reg[x.ns]; var arr=(c&&c.list&&c.list())||[]; var l=arr.filter(function(y){return String(y.id)===String(x.id);})[0]; return l?{l:l,cfg:c,ns:x.ns}:null; }).filter(Boolean); }
  function _cmpBar(){ var n=_cmpLoad().length; var bar=document.getElementById('lstCmpBar');
    if(!n){ if(bar)bar.remove(); return; }
    if(!bar){bar=document.createElement('div');bar.id='lstCmpBar';bar.className='lst-cmpbar';document.body.appendChild(bar);}
    bar.innerHTML='<span class="lst-cmpbar-n">⇄ <b>'+n+'</b> ilan karşılaştırmada</span>'
      +'<button class="lst-cmpbar-go" onclick="Listings._extOpenCmp()">Karşılaştır →</button>'
      +'<button class="lst-cmpbar-x" onclick="Listings._extClearCmp()" aria-label="Temizle">✕</button>';
  }
  L._extClearCmp=function(){ _cmpSave([]); _cmpBar(); try{var b=document.querySelector('.lstd-cmp.on');if(b){b.classList.remove('on');b.textContent='⇄ Karşılaştır';}}catch(e){} };
  L._extOpenCmp=function(){ var items=_cmpResolve(); if(items.length<1)return;
    var rows=[['Görsel',function(l){var im=(l.images||[])[0]||l.img;return im?'<img src="'+esc(im)+'" style="width:100%;height:80px;object-fit:cover;border-radius:8px">':'—';}],
      ['İlan',function(l){return '<b>'+esc(l.title||'')+'</b>';}],
      ['Fiyat',function(l){return esc(l.priceText||l.price||'—');}],
      ['İşlem',function(l){return esc(l.op||'—');}],
      ['Tür',function(l){return esc(l.type||L.catLabel(l));}],
      ['Konum',function(l){return esc([l.mah,l.ilce,l.il].filter(Boolean).join(', ')||'—');}],
      ['m²',function(l){var s=(l.specs||[]).filter(function(x){return /m²/.test(x.k);})[0];return esc((s&&s.v)||(l.attrs&&l.attrs.m2)||'—');}],
      ['Oda',function(l){var s=(l.specs||[]).filter(function(x){return /Oda/.test(x.k);})[0];return esc((s&&s.v)||(l.attrs&&l.attrs.oda)||'—');}],
      ['Isıtma',function(l){return esc((l.attrs&&l.attrs.isitma)||'—');}],
      ['Enerji',function(l){return l.energy?esc((''+l.energy).toUpperCase()):'—';}]];
    var html='<div class="lst-cmp-wrap"><div class="lst-cmp-head"><h3>İlan Karşılaştırma ('+items.length+')</h3><button class="lst-cmp-x" onclick="Listings._extCloseCmp()">✕</button></div>'
      +'<div class="lst-cmp-scroll"><table class="lst-cmp-tbl"><tbody>'
      +rows.map(function(r){return '<tr><th>'+esc(r[0])+'</th>'+items.map(function(it){return '<td>'+r[1](it.l)+'</td>';}).join('')+'</tr>';}).join('')
      +'<tr><th></th>'+items.map(function(it){return '<td><button class="lst-cmp-open" onclick="Listings._extCloseCmp();Listings.openDetail(\''+esc(it.ns)+'\',\''+esc(it.l.id)+'\')">İncele →</button> <button class="lst-cmp-rm" onclick="Listings._extToggleCmp(\''+esc(it.ns)+'\',\''+esc(it.l.id)+'\');Listings._extOpenCmp()" title="Çıkar">✕</button></td>';}).join('')+'</tr>'
      +'</tbody></table></div></div>';
    var ov=document.getElementById('lstCmpOv'); if(!ov){ov=document.createElement('div');ov.id='lstCmpOv';ov.className='lst-cmpov';document.body.appendChild(ov);ov.addEventListener('click',function(e){if(e.target===ov)L._extCloseCmp();});}
    ov.innerHTML=html; ov.classList.add('on');
  };
  L._extCloseCmp=function(){ var ov=document.getElementById('lstCmpOv'); if(ov)ov.classList.remove('on'); };

  /* ================= FAZ 4 — PDF / YAZDIR ================= */
  L._extPrint=function(){ try{ var l=L._cur, cfg=L._curCfg||{}; if(!l)return;
    var brand=(cfg.brand&&cfg.brand())||''; var A=L.detailAttrs?L.detailAttrs(l):[];
    var im=(l.images||[])[0]||l.img||'';
    var w=window.open('','_blank','width=820,height=1000'); if(!w)return;
    var html='<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>'+esc(l.title||'İlan')+'</title>'
      +'<style>*{box-sizing:border-box}body{font:.875rem/1.5 -apple-system,system-ui,sans-serif;color:#111;margin:0;padding:28px}'
      +'h1{font-size:1.375rem;margin:0 0 4px}.loc{color:#555;margin-bottom:8px}.price{font-size:1.5rem;font-weight:800;color:#0e7c86;margin:8px 0 16px}'
      +'img{max-width:100%;border-radius:8px;margin-bottom:14px}table{width:100%;border-collapse:collapse;margin:10px 0}td{padding:7px 10px;border-bottom:1px solid #eee}td.k{color:#666;width:45%}'
      +'.brand{margin-top:20px;padding-top:12px;border-top:2px solid #0e7c86;font-weight:700}.eids{margin-top:8px;font-size:.75rem;color:#16a34a}.desc{margin:10px 0}h3{font-size:.9375rem;margin:16px 0 6px}@media print{body{padding:0}}</style></head><body>'
      +'<h1>'+esc(l.title||'')+'</h1><div class="loc">📍 '+esc([l.mah,l.ilce,l.il].filter(Boolean).join(', '))+'</div>'
      +(im?'<img src="'+esc(im)+'">':'')
      +'<div class="price">'+esc(l.priceText||l.price||'')+' <span style="font-size:.875rem;color:#555">· '+esc(l.op||'')+' · '+esc(l.type||'')+'</span></div>'
      +(l.desc?'<h3>Açıklama</h3><div class="desc">'+esc(l.desc)+'</div>':'')
      +(A.length?'<h3>İlan Bilgileri</h3><table><tbody>'+A.map(function(x){return '<tr><td class="k">'+esc(x.k)+'</td><td>'+esc(x.v)+'</td></tr>';}).join('')+'</tbody></table>':'')
      +'<div class="brand">'+esc(brand)+((cfg.phone&&cfg.phone())?(' · '+esc(cfg.phone())):'')+'</div>'
      +((typeof L._isDemoRec==='function'&&L._isDemoRec(l))||!(l&&l.real_record&&l.eids_status==='verified')?'<div class="eids">🛡️ ÖRNEK İLAN · DEMO — Gerçek ilan veya EİDS doğrulaması değildir.</div>':'<div class="eids">🛡️ EİDS doğrulaması yayın kapısından geçmiştir.</div>')
      +'<script>window.onload=function(){setTimeout(function(){window.print();},250);}<\/script></body></html>';
    w.document.write(html); w.document.close();
  }catch(e){} };

  /* ================= AÇILIŞ SONRASI: init ================= */
  L._extAfterOpen=function(l,ov,cfg){
    L._lbIdx=0;
    try{L._bumpView(l.id); var vEl=ov.querySelector('#lstdViews'); if(vEl)vEl.textContent=(_views()[l.id]||0);}catch(e){}
    /* medya galeri thumbnail tıklamasıyla yüklenir (video/360/plan) — burada ön-mount yok */
    try{L._extCalc();}catch(e){}
    try{_cmpBar();}catch(e){}
  };

  /* ================= İLAN DÜZENLEME — MEDYA + ENERJİ FORMU ================= */
  /* Ekleme/düzenleme formuna gömülür. containerId benzersiz; listingId kaydederken gerekir. */
  L.mediaFormHTML=function(l){ l=l||{}; var _m=l.media||{}; var fl=floorLabel(l);
    /* HAM değerler (dolgu YOK) — düzenleyen kullanıcı kendi medyasını görsün/düzenlesin */
    var M={ videoUrl:(l.videoUrl||_m.videoUrl||''), videoFile:!!_m.video, tourFile:!!_m.tour360, floorFile:!!_m.floorplan };
    return '<div class="lst-mediaform"><div class="lst-mf-h">📸 Medya & Sanal Tur <span>(kullanıcı kendi bilgisayarından yükler)</span></div>'
      +'<div class="lst-mf-grid">'
        +'<label class="lst-mf-cell"><span>▶ Video URL <i>(YouTube / Vimeo / MP4)</i></span><input type="url" class="mf-videoUrl" value="'+esc(M.videoUrl)+'" placeholder="https://youtube.com/watch?v=…"></label>'
        +'<label class="lst-mf-cell"><span>▶ Video dosyası <i>(bilgisayardan)</i></span><input type="file" class="mf-videoFile" accept="video/*">'+(M.videoFile?'<em class="lst-mf-ok">✓ yüklü</em>':'')+'</label>'
        +'<label class="lst-mf-cell"><span>🌐 360° Sanal Tur <i>(equirectangular JPG)</i></span><input type="file" class="mf-tourFile" accept="image/*">'+(M.tourFile?'<em class="lst-mf-ok">✓ yüklü</em>':'')+'</label>'
        +'<label class="lst-mf-cell"><span>📐 '+esc(fl)+' <i>(görsel)</i></span><input type="file" class="mf-floorFile" accept="image/*">'+(M.floorFile?'<em class="lst-mf-ok">✓ yüklü</em>':'')+'</label>'
        +'<label class="lst-mf-cell"><span>⚡ Enerji Kimlik Sınıfı</span><select class="mf-energy"><option value="">— Belirtilmedi —</option>'+['A','B','C','D','E','F','G'].map(function(x){return '<option'+(((l.energy||'').toUpperCase()===x)?' selected':'')+'>'+x+'</option>';}).join('')+'</select></label>'
      +'</div>'
      +'<div class="lst-mf-note">Videoyu URL olarak (YouTube/Vimeo) verebilir veya dosya yükleyebilirsiniz. 360° tur için cep/kamera ile çekilmiş <b>equirectangular (2:1)</b> panorama görseli yükleyin. Dosyalar tarayıcıda (IndexedDB) saklanır.</div></div>';
  };
  /* Formu oku → l.media bayrakları + l.videoUrl + l.energy ata; dosyaları IndexedDB'ye yaz (async). */
  L.readMediaForm=function(listingId,l,scope){ l=l||{}; l.media=l.media||{}; scope=scope||document;
    var vu=((scope.querySelector('.mf-videoUrl'))||{}).value||''; l.videoUrl=vu.trim();
    var en=((scope.querySelector('.mf-energy'))||{}).value||''; l.energy=en;
    function file(cls){var e=scope.querySelector(cls);return e&&e.files&&e.files[0];}
    var vf=file('.mf-videoFile'), tf=file('.mf-tourFile'), ff=file('.mf-floorFile');
    if(vf){ l.media.video=true; MediaStore.put(listingId,'video',vf); }
    if(tf){ l.media.tour360=true; MediaStore.put(listingId,'tour360',tf); }
    if(ff){ l.media.floorplan=true; MediaStore.put(listingId,'floorplan',ff); }
    return l;
  };

  /* ================= CSS ================= */
  (function(){
    var A='var(--accent,#0e7c86)', INK='var(--ink,#12181f)', MUT='var(--muted,#6b7280)', SURF='var(--surface,#fff)', LINE='var(--line,#e6e8ec)';
    var css=''
    /* medya */
    +'.lstd-media{margin:14px 0}'
    +'.lstd-mbar{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}'
    +'.lstd-mbtn{display:inline-flex;align-items:center;gap:7px;border:1px solid '+LINE+';background:'+SURF+';color:'+INK+';border-radius:11px;padding:10px 15px;font:700 .84375rem/1 system-ui;cursor:pointer;transition:.15s}'
    +'.lstd-mbtn:hover{border-color:'+A+';color:'+A+'}'
    +'.lstd-mbtn.on{background:'+A+';color:#fff;border-color:'+A+'}'
    +'.lstd-mbtn-ic{font-size:.9375rem}'
    /* MEDYA-ENTEGRE GALERİ (sahne + thumbnail; video/360/plan gömülü) */
    +'.lstd-gallery2{margin-bottom:14px}'
    +'.lstd-stage{position:relative;width:100%;aspect-ratio:16/10;background:#0b0e13;border-radius:14px;overflow:hidden}'
    +'.lstd-stage-in{width:100%;height:100%;cursor:zoom-in;position:relative}'
    +'.lstd-stage-in img{width:100%;height:100%;object-fit:cover;display:block}'
    +'.lstd-stage-in.lstd-empty{display:grid;place-items:center;font-size:3rem;color:rgba(255,255,255,.3)}'
    +'.lstd-stage-media{width:100%;height:100%;background:#000;display:flex;flex-direction:column}'
    +'.lstd-stage-media .lstd-pano{flex:1}'
    +'.lstd-stage-media.lstd-floor{background:'+SURF+';display:grid;place-items:center;padding:10px}'
    +'.lstd-gbadges{position:absolute;top:10px;left:10px;display:flex;gap:6px;z-index:3;pointer-events:none}'
    +'.lstd-gcount{background:rgba(0,0,0,.6);color:#fff;border-radius:7px;font:700 .6875rem/1 system-ui;padding:5px 9px}'
    +'.lstd-gcount.v{background:rgba(220,38,38,.85)}.lstd-gcount.t{background:rgba(8,145,178,.9)}'
    +'.lstd-thumbs2{display:flex;gap:8px;margin-top:10px;overflow-x:auto;padding-bottom:4px}'
    +'.lstd-th2{position:relative;flex:0 0 auto;width:88px;height:62px;border-radius:9px;overflow:hidden;border:2px solid transparent;background:rgba(0,0,0,.06);cursor:pointer;padding:0}'
    +'.lstd-th2 img{width:100%;height:100%;object-fit:cover;display:block}'
    +'.lstd-th2.on{border-color:'+A+'}'
    +'.lstd-th2.video,.lstd-th2.tour{background:'+INK+'}'
    +'.lstd-th-ph{display:grid;place-items:center;width:100%;height:100%;font-size:1.5rem;color:#fff}'
    +'.lstd-th-badge{position:absolute;bottom:4px;right:4px;background:rgba(0,0,0,.75);color:#fff;border-radius:5px;font:800 .5625rem/1 system-ui;padding:3px 5px}'
    +'.lstd-th-badge.play{background:rgba(220,38,38,.92);left:4px;right:auto;top:4px;bottom:auto;border-radius:50%;width:20px;height:20px;display:grid;place-items:center;padding:0}'
    +'.lstd-pano{width:100%!important;height:100%!important;min-height:300px;position:relative}'
    +'.lstd-pano.pnlm-container{height:100%!important;min-height:300px}'
    +'.lstd-video{width:100%;height:100%;background:#000}'
    +'.lstd-video iframe,.lstd-video video{display:block;width:100%;height:100%}'
    +'.lstd-floor img{max-width:100%;max-height:100%;border-radius:8px;cursor:zoom-in}'
    +'.lstd-mload{color:#fff;opacity:.85;text-align:center;padding:40px 20px;font:600 .875rem/1.5 system-ui;margin:auto}'
    +'.lstd-mhint{background:rgba(255,255,255,.06);color:#cbd5e1;font:500 .75rem/1.4 system-ui;padding:8px 12px;text-align:center}'
    +'.lstd-cover{position:relative}.lstd-zoom{position:absolute;right:10px;bottom:10px;background:rgba(0,0,0,.55);color:#fff;border-radius:8px;padding:5px 9px;font-size:.875rem;pointer-events:none;z-index:2}'
    /* meta */
    +'.lstd-meta{display:flex;gap:16px;flex-wrap:wrap;margin-top:8px;color:'+MUT+';font:500 .78125rem/1.4 system-ui}'
    +'.lstd-meta b{color:'+INK+'}'
    /* enerji */
    +'.lstd-energy{display:flex;align-items:center;justify-content:space-between;gap:8px;margin:8px 0;padding:8px 12px;border:1px solid '+LINE+';border-radius:10px}'
    +'.lstd-energy-l{font:600 .78125rem/1 system-ui;color:'+MUT+'}'
    +'.lstd-energy-b{display:inline-grid;place-items:center;min-width:30px;height:26px;padding:0 8px;border-radius:7px;color:#fff;font:800 .9375rem/1 system-ui}'
    /* finans */
    +'.lstd-fin-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}'
    +'.lstd-fin label{display:flex;flex-direction:column;gap:5px;font:600 .78125rem/1.2 system-ui;color:'+MUT+'}'
    +'.lstd-fin input,.lstd-fin select{border:1px solid '+LINE+';border-radius:9px;padding:9px 10px;font:600 .875rem/1 system-ui;color:'+INK+';background:'+SURF+'}'
    +'.lstd-fin input[type=range]{padding:0;accent-color:'+A+'}'
    +'.lstd-fin-out{margin-top:16px}'
    +'.lstd-fin-hero{position:relative;overflow:hidden;background:linear-gradient(135deg,'+A+',color-mix(in srgb,'+A+' 74%,#000));color:#fff;border-radius:18px;padding:22px 18px;text-align:center;box-shadow:0 16px 36px -14px color-mix(in srgb,'+A+' 65%,transparent)}'
    +'.lstd-fin-hero::after{content:"";position:absolute;top:-45px;right:-45px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.10)}'
    +'.lstd-fin-hero::before{content:"";position:absolute;bottom:-50px;left:-30px;width:120px;height:120px;border-radius:50%;background:rgba(255,255,255,.06)}'
    +'.lstd-fin-hero-ic{font-size:1.375rem;position:relative}'
    +'.lstd-fin-hero-l{font:700 .75rem/1 system-ui;letter-spacing:.04em;text-transform:uppercase;opacity:.92;position:relative;margin-top:4px}'
    +'.lstd-fin-hero-v{font:800 clamp(1.75rem,7vw,2.5rem)/1 system-ui;letter-spacing:-.5px;margin:9px 0 6px;position:relative}'
    +'.lstd-fin-hero-sub{font:600 .75rem/1.4 system-ui;opacity:.9;position:relative}'
    +'.lstd-fin-break{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-top:12px}'
    +'.lstd-fin-chip{display:flex;justify-content:space-between;align-items:center;gap:8px;background:'+SURF+';border:1px solid '+LINE+';border-radius:12px;padding:12px 14px}'
    +'.lstd-fin-chip span{color:'+MUT+';font:600 .78125rem/1.2 system-ui}'
    +'.lstd-fin-chip b{color:'+INK+';font:800 .875rem/1 system-ui}'
    +'.lstd-fin-note{margin-top:10px;color:'+MUT+';font:500 .71875rem/1.5 system-ui}'
    /* benzer */
    +'.lstd-sim-grid{grid-template-columns:repeat(3,1fr)}'
    +'@media(max-width:820px){.lstd-sim-grid{grid-template-columns:1fr 1fr}}'
    +'@media(max-width:560px){.lstd-sim-grid{grid-template-columns:1fr}.lstd-fin-grid{grid-template-columns:1fr}}'
    /* lightbox */
    +'.lst-lb{position:fixed;inset:0;z-index:9999;background:rgba(6,10,16,.92);display:none;align-items:center;justify-content:center}'
    +'.lst-lb.on{display:flex}'
    +'.lst-lb img{max-width:92vw;max-height:86vh;border-radius:8px;box-shadow:0 20px 80px rgba(0,0,0,.6)}'
    +'.lst-lb-x{position:absolute;top:16px;right:18px;width:44px;height:44px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:1.375rem;cursor:pointer}'
    +'.lst-lb-nav{position:absolute;top:50%;transform:translateY(-50%);width:52px;height:52px;border-radius:50%;border:0;background:rgba(255,255,255,.14);color:#fff;font-size:2.125rem;line-height:1;cursor:pointer}'
    +'.lst-lb-nav.prev{left:16px}.lst-lb-nav.next{right:16px}'
    +'.lst-lb-count{position:absolute;bottom:20px;left:50%;transform:translateX(-50%);color:#fff;background:rgba(0,0,0,.5);border-radius:20px;padding:6px 16px;font:600 .8125rem/1 system-ui}'
    /* karşılaştırma */
    +'.lst-cmpbar{position:fixed;left:50%;transform:translateX(-50%);bottom:18px;z-index:9000;display:flex;align-items:center;gap:12px;background:'+INK+';color:#fff;border-radius:14px;padding:11px 16px;box-shadow:0 12px 40px rgba(0,0,0,.35)}'
    +'.lst-cmpbar-n{font:600 .84375rem/1 system-ui}.lst-cmpbar-n b{color:#fff}'
    +'.lst-cmpbar-go{border:0;background:'+A+';color:#fff;border-radius:9px;padding:9px 15px;font:700 .8125rem/1 system-ui;cursor:pointer}'
    +'.lst-cmpbar-x{border:0;background:rgba(255,255,255,.15);color:#fff;border-radius:8px;width:32px;height:32px;font-size:.9375rem;cursor:pointer}'
    +'.lst-cmpov{position:fixed;inset:0;z-index:9500;background:rgba(6,10,16,.6);display:none;align-items:flex-start;justify-content:center;padding:5vh 12px;overflow:auto}'
    +'.lst-cmpov.on{display:flex}'
    +'.lst-cmp-wrap{background:'+SURF+';border-radius:16px;max-width:920px;width:100%;overflow:hidden;box-shadow:0 30px 90px rgba(0,0,0,.4)}'
    +'.lst-cmp-head{display:flex;align-items:center;justify-content:space-between;padding:16px 20px;border-bottom:1px solid '+LINE+'}'
    +'.lst-cmp-head h3{margin:0;font:800 1.125rem/1 system-ui;color:'+INK+'}'
    +'.lst-cmp-x{border:0;background:rgba(0,0,0,.06);border-radius:8px;width:34px;height:34px;font-size:1rem;cursor:pointer;color:'+INK+'}'
    +'.lst-cmp-scroll{overflow-x:auto}'
    +'.lst-cmp-tbl{border-collapse:collapse;width:100%;min-width:520px}'
    +'.lst-cmp-tbl th{position:sticky;left:0;background:'+SURF+';text-align:left;color:'+MUT+';font:700 .78125rem/1.3 system-ui;padding:10px 14px;border-bottom:1px solid '+LINE+';white-space:nowrap}'
    +'.lst-cmp-tbl td{padding:10px 14px;border-bottom:1px solid '+LINE+';border-left:1px solid '+LINE+';font:500 .8125rem/1.4 system-ui;color:'+INK+';vertical-align:top;min-width:150px}'
    +'.lst-cmp-open{border:0;background:'+A+';color:#fff;border-radius:8px;padding:7px 12px;font:700 .75rem/1 system-ui;cursor:pointer}'
    +'.lst-cmp-rm{border:1px solid '+LINE+';background:'+SURF+';border-radius:8px;padding:7px 9px;cursor:pointer;color:'+MUT+'}'
    /* medya düzenleme formu */
    +'.lst-mediaform{border:1px dashed '+LINE+';border-radius:12px;padding:14px;margin:12px 0;background:rgba(0,0,0,.015)}'
    +'.lst-mf-h{font:800 .875rem/1.3 system-ui;color:'+INK+';margin-bottom:12px}.lst-mf-h span{font-weight:500;color:'+MUT+';font-size:.75rem}'
    +'.lst-mf-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}'
    +'.lst-mf-cell{display:flex;flex-direction:column;gap:5px;font:600 .78125rem/1.3 system-ui;color:'+INK+'}'
    +'.lst-mf-cell i{font-weight:500;color:'+MUT+';font-style:normal}'
    +'.lst-mf-cell input,.lst-mf-cell select{border:1px solid '+LINE+';border-radius:9px;padding:9px 10px;font:500 .8125rem/1.2 system-ui;background:'+SURF+';color:'+INK+'}'
    +'.lst-mf-ok{color:#16a34a;font:700 .71875rem/1 system-ui;font-style:normal}'
    +'.lst-mf-note{margin-top:10px;color:'+MUT+';font:500 .71875rem/1.5 system-ui}'
    +'@media(max-width:560px){.lst-mf-grid{grid-template-columns:1fr}}'
    +'@media print{.lstd-cmp,.lstd-print,.lst-cmpbar{display:none!important}}';
    var st=document.createElement('style'); st.id='lstExtCSS'; st.textContent=css;
    if(document.head)document.head.appendChild(st); else document.addEventListener('DOMContentLoaded',function(){document.head.appendChild(st);});
  })();

  /* Sayfa yüklendiğinde karşılaştırma çubuğunu geri getir */
  try{ if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){try{_cmpBar();}catch(e){}}); else setTimeout(function(){try{_cmpBar();}catch(e){}},300); }catch(e){}
  /* ESC ile lightbox/karşılaştırma kapat */
  try{ document.addEventListener('keydown',function(e){ if(e.key==='Escape'){L._extLbClose();L._extCloseCmp();} else if(e.key==='ArrowLeft'){var ov=document.getElementById('lstLightbox');if(ov&&ov.classList.contains('on'))L._extLbNav(-1);} else if(e.key==='ArrowRight'){var ov2=document.getElementById('lstLightbox');if(ov2&&ov2.classList.contains('on'))L._extLbNav(1);} }); }catch(e){}
})();
