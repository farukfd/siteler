/* ============================================================================
   shared/mahalle-endeks.js — MAHALLE EMLAK ENDEKSİ + ÖZEL PORTFÖY (taşınabilir)
   3 sitede (gayrimenkul · danışman · insaat) birebir aynı: seçili mahalle için
   ProX gerçek verisinden canlı endeks + değerleme + demografi/makro grafikleri +
   mahalle-öncelikli "…dan başlayan" Özel Portföy vitrini (gizli/ifşasız) + sokaklar.
   Kendine-yeten: kendi sentetik model + markup + CSS. Sadece config gerekir.

   Kullanım:
     MahalleEndeks.mount(hostEl, {
       proxApi, province:()=> 'İzmir', districts:()=>({ilce:[mah,...]}),
       loadMah:async(il,ilce)=>[mah], ozData:()=>OZEL, localModel:(ilce,mah)=>{...}|null,
       goOzel:()=>{}, onLead:(id)=>{}, waHref:(t)=>url, phone:()=>'+90…', accent:'#0e7c86'
     });
   ============================================================================ */
(function(){
  if(typeof window==='undefined'||window.MahalleEndeks)return;
  function esc(x){return String(x==null?'':x).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function fmt(n){try{return Math.round(n).toLocaleString('tr-TR');}catch(e){return ''+n;}}
  function M(n){if(!isFinite(n)||!n)return '—';if(n>=1e6)return (n/1e6).toLocaleString('tr-TR',{maximumFractionDigits:2})+'M ₺';return fmt(n)+' ₺';}
  function periodTR(p){if(!p)return '';var s=String(p);return s.length===6?s.slice(0,4)+'-'+s.slice(4):s;}
  function annual(chg5){return Math.max(0,(Math.pow(1+(chg5||0)/100,1/5)-1)*100);}
  function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
  /* seeded RNG (site-bağımsız) */
  function seed(s){s=String(s);var h=2166136261;for(var i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
  function rngOf(s){var x=seed(s)||1;return function(){x^=x<<13;x^=x>>>17;x^=x<<5;x>>>=0;return x/4294967296;};}
  function growth(end,chg5,n,r){var start=end/Math.pow(1+(chg5||0)/100,1);var a=[];for(var i=0;i<n;i++){var t=i/(n-1);a.push(Math.round((start+(end-start)*t)*(0.97+r()*0.06)));}a[n-1]=Math.round(end);return a;}

  var _MAHNORM={'Akat':'Akatlar','Nisbetiye':'Nispetiye','Nisbetiye Mah.':'Nispetiye'};
  function mahNorm(x){x=String(x||'').trim();return _MAHNORM[x]||x;}
  var _gid=0;
  /* ---- mini trend ---- */
  function spark(series,color){
    if(!series||series.length<2)return '';
    var w=132,h=38,min=Math.min.apply(null,series),max=Math.max.apply(null,series),rg=(max-min)||1;
    var pts=series.map(function(v,i){return [(i/(series.length-1))*w,h-5-((v-min)/rg)*(h-12)];});
    var line=pts.map(function(p){return p[0].toFixed(1)+','+p[1].toFixed(1);}).join(' ');
    var area='0,'+h+' '+line+' '+w+','+h,last=pts[pts.length-1],id='meg'+(++_gid);
    return '<svg class="me-spark" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true">'+
      '<defs><linearGradient id="'+id+'" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="'+color+'" stop-opacity=".24"/><stop offset="1" stop-color="'+color+'" stop-opacity="0"/></linearGradient></defs>'+
      '<polygon points="'+area+'" fill="url(#'+id+')"/>'+
      '<polyline points="'+line+'" fill="none" stroke="'+color+'" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>'+
      '<circle cx="'+last[0].toFixed(1)+'" cy="'+last[1].toFixed(1)+'" r="3" fill="'+color+'"/></svg>';
  }
  function donut(segs,colors,center){
    var r=52,cx=60,cy=60,C=2*Math.PI*r,off=0,w=17;
    var arcs=segs.map(function(v,i){var len=(v/100)*C;
      var el='<circle cx="'+cx+'" cy="'+cy+'" r="'+r+'" fill="none" stroke="'+colors[i%colors.length]+'" stroke-width="'+w+'" stroke-dasharray="'+len.toFixed(2)+' '+(C-len).toFixed(2)+'" stroke-dashoffset="'+(-off).toFixed(2)+'" transform="rotate(-90 '+cx+' '+cy+')"/>';
      off+=len;return el;}).join('');
    return '<svg class="me-donut-svg" viewBox="0 0 120 120" aria-hidden="true"><circle cx="60" cy="60" r="52" fill="none" stroke="rgba(0,0,0,.06)" stroke-width="17"/>'+arcs+
      (center?'<text x="60" y="61" text-anchor="middle" dominant-baseline="central" class="me-donut-c">'+center+'</text>':'')+'</svg>';
  }
  function legend(labels,vals,colors){
    return '<ul class="me-legend">'+labels.map(function(l,i){
      return '<li><span class="sw" style="background:'+colors[i%colors.length]+'"></span>'+esc(l)+'<b>%'+Math.round(vals[i])+'</b></li>';}).join('')+'</ul>';
  }
  var BLUE=['#1e40af','#3b82f6','#60a5fa','#93c5fd','#cfe0ff'],
      TEAL=['#0e7490','#0891b2','#22a5c4','#67cbe0','#b6ecf6'],
      GOLD=['#b8860b','#d4af37','#e6c766','#f2dd9a'],
      OWN=['var(--me-accent,#0e7c86)','#e3e8ef'];

  var CATS=[{key:'daireSat',kat:'konut',dur:'satilik'},{key:'daireKira',kat:'konut',dur:'kiralik'},
    {key:'ticariSat',kat:'ticari',dur:'satilik'},{key:'ticariKira',kat:'ticari',dur:'kiralik'},{key:'arsa',kat:'arsa',dur:'satilik'}];

  /* ============ KENDİNE-YETEN SENTETİK MODEL (fallback + anında dolum) ============ */
  function builtinModel(prov,ilce,mah){
    var r=rngOf(prov+'|'+ilce+'|'+mah);
    var m2=Math.round((28000+r()*72000)/1000)*1000;
    var chg=Math.round(120+(r()*70-24));
    var score=clamp(Math.round(58+r()*36),42,97);
    var kira=+(4.0+(97-score)*0.035+r()*1.2).toFixed(1);
    var nufus=Math.round(7000+r()*43000), hane=+(2.5+r()*1.3).toFixed(1);
    var sahiplik=Math.round(42+r()*34), yasamK=clamp(score+Math.round(r()*10-3),45,98);
    var ortGelir=Math.round((28000+score*900+r()*12000)/500)*500;
    /* demografi (skora bağlı sosyoekonomik kayma) */
    function norm(a){var s=a.reduce(function(x,y){return x+y;},0);return a.map(function(v){return Math.round(v/s*100);});}
    var yas=norm([14+r()*10,30+r()*12,26+r()*8,16+r()*10]);
    var egitim=norm([10+r()*10,24+r()*10,14+r()*6,26+(score-58)*0.5+r()*10,8+(score-58)*0.3+r()*6]);
    var gelir=norm([18-(score-58)*0.2+r()*8,30+r()*8,26+(score-58)*0.2+r()*8,14+(score-58)*0.35+r()*8]);
    return {m2:m2,chg5:chg,score:score,kira:kira,nufus:nufus,hane:hane,sahiplik:sahiplik,yasamK:yasamK,ortGelir:ortGelir,yas:yas,egitim:egitim,gelir:gelir};
  }
  function modelOf(cfg,ilce,mah){
    var prov=cfg.province?cfg.province():'İzmir';
    var d=(cfg.localModel&&cfg.localModel(ilce,mah))||builtinModel(prov,ilce,mah);
    var b=d.m2, kmo=b*(d.kira/100)/12;
    return { source:'local',period:'',score:d.score,chg5:d.chg5!=null?d.chg5:d.chg,ilce:ilce,mah:mah,base:b,prov:prov,kiraPct:(d.kira!=null?d.kira:4.5),
      cats:{daireSat:{m2:b,live:false,ilan:0},daireKira:{m2:kmo,live:false,ilan:0},ticariSat:{m2:b*1.9,live:false,ilan:0},ticariKira:{m2:kmo*1.15,live:false,ilan:0},arsa:{m2:b*0.18,live:false,ilan:0}},
      demo:{yas:d.yas,egitim:d.egitim,gelir:d.gelir,sahiplik:d.sahiplik,ortGelir:d.ortGelir,nufus:d.nufus,hane:d.hane,yasamK:d.yasamK} };
  }

  /* ============ CANLI ProX ============ */
  function fetchCat(cfg,ilce,mah,c,base){
    var prov=cfg.province?cfg.province():'İzmir';
    var url='/api/v1/tenant/endeks?il='+encodeURIComponent(prov)+'&ilce='+encodeURIComponent(ilce)+'&mahalle='+encodeURIComponent(mah)+'&kategori='+c.kat+'&durum='+c.dur;
    return cfg.proxApi(url).then(function(r){
      if(!r||r.fallback||r.success!==true||!r.data)return null;
      var m2=+r.data.m2,ilan=+r.data.ilan_sayisi||0,delta=+r.data.delta||0,score=+r.data.score||0;
      if(!isFinite(m2)||m2<=0)return null;
      if(c.key==='daireSat'&&m2<1000)return null;
      if(c.key==='daireKira'&&(m2<40||(base&&m2>base*0.012)))return null;
      if(c.key==='ticariSat'&&base&&(m2<base*0.9||m2>base*4))return null;
      if(c.key==='ticariKira'&&(m2<40||(base&&m2>base*0.02)))return null;
      if(c.key==='arsa'&&base&&(m2<base*0.05||m2>base*0.7))return null;
      return {m2:m2,ilan:ilan,delta:delta,score:score,period:(r.data.trend&&r.data.trend[0]&&r.data.trend[0].period)||''};
    }).catch(function(){return null;});
  }
  function fetchAnalyze(cfg,ilce,mah){
    var prov=cfg.province?cfg.province():'İzmir';
    return cfg.proxApi('/api/v1/tenant/prox/analyze',{method:'POST',body:{il:prov,ilce:ilce,mahalle:mah,kategori:'konut',durum:'satilik',brut_m2:90,attrs:{}}}).then(function(r){
      if(!r||r.fallback||r.success!==true)return null;
      var rg=r.range||{},min=+rg.min_value||0,max=+rg.max_value||0;
      if(!min&&!max)return null;
      return {min:min,max:max,strong:+r.strongest_value||0,conf:(r.confidence!=null?+r.confidence:null),band:r.confidence_band||'',yon:r.piyasa_yonu||'',veri:+r.veri_adedi||0};
    }).catch(function(){return null;});
  }
  function liveModel(cfg,ilce,mah,cache){
    var key=(cfg.province?cfg.province():'')+'|'+ilce+'|'+mah;
    if(cache[key])return Promise.resolve(cache[key]);
    var m=modelOf(cfg,ilce,mah);
    if(typeof cfg.proxApi!=='function')return Promise.resolve(m);
    return fetchCat(cfg,ilce,mah,CATS[0],m.base).then(function(ds){
      var base=(ds&&ds.m2)||m.base;
      return Promise.all([Promise.all(CATS.slice(1).map(function(c){return fetchCat(cfg,ilce,mah,c,base);})),fetchAnalyze(cfg,ilce,mah)]).then(function(res){
        var rest=res[0],az=res[1],all=[ds].concat(rest),anyLive=false,ilanTot=0,period='',dsScore=0,dsDelta=0;
        CATS.forEach(function(c,i){var r=all[i];if(r){m.cats[c.key]={m2:r.m2,live:true,ilan:r.ilan};anyLive=true;ilanTot+=r.ilan;if(r.period)period=r.period;if(i===0){dsScore=r.score;dsDelta=r.delta;}}});
        if(az)m.analyze=az;
        if(anyLive||az){m.source='live';m.period=period;m.ilanTot=ilanTot;if(dsScore)m.score=dsScore;if(dsDelta)m.deltaYr=dsDelta;}
        cache[key]=m;return m;
      });
    }).catch(function(){return m;});
  }

  /* ============ ÖZEL PORTFÖY (mahalle-öncelikli · gerçek + canlı türetme) ============ */
  var TIP_CAT={'Daire':'Konut','Villa':'Konut','Müstakil Ev':'Konut','İşyeri':'Ticari','Ofis':'Ticari','Dükkan':'Ticari','Arsa':'Arsa','Tarla':'Arsa','Bağ-Bahçe':'Arsa','Bina':'Ticari','Depo':'Ticari'};
  function baseIlce(x){return String(x||'').replace(/\s*\(.*\)\s*$/,'').trim();}
  function ozelReal(cfg,ilce,mah){
    var arr=(cfg.ozData&&cfg.ozData())||[]; if(!Array.isArray(arr))return {exact:[],inIlce:[],rest:[]};
    var prov=cfg.province?cfg.province():'İzmir';
    var act=arr.filter(function(o){return (o.durum==='aktif'||o.status==='aktif'||o.durum===undefined)&&((o.il||prov)===prov);})
      .map(function(o){return {id:o.id,op:o.op||o.durum,tip:o.tip||o.type,ilce:o.ilce,mah:o.mah||o.mahalle,cadde:o.cadde,m2:o.m2,oda:o.oda,fiyat:o.fiyat||o.price,not:o.not};});
    var exact=act.filter(function(o){return baseIlce(o.ilce)===ilce&&o.mah===mah;});
    var inIlce=act.filter(function(o){return baseIlce(o.ilce)===ilce&&exact.indexOf(o)<0;});
    var rest=act.filter(function(o){return exact.indexOf(o)<0&&inIlce.indexOf(o)<0;});
    return {exact:exact,inIlce:inIlce,rest:rest};
  }
  var _CAD=['Atatürk Cd.','Cumhuriyet Cd.','İstiklal Cd.','Gazi Blv.','Sahil Yolu','Fevzi Çakmak Cd.','İnönü Cd.','19 Mayıs Cd.','Kışla Cd.'];
  /* FAZ3E: runtime rastgele üretim KALDIRILDI — kayıtlar merkezi build-time seed'den gelir.
     Seed yoksa dolgu YAPILMAZ (filtreyle uyuşmayan kart üretmemek için). */
  function ozelGen(m,n,extra){
    var S=(window.DN_OZEL_SEED||window.INS_OZEL_SEED||{});
    var a=S[m.ilce+'|'+m.mah]||[];
    return a.slice(0,n||3).map(function(x){return Object.assign({gen:true},x);});
  }
  /* FAZ3E: seçilen mahalleyle UYUŞMAYAN kayıt ana listeye KARIŞMAZ.
     Dönen: {list: seçili-mahalle kayıtları, oneri: yakın bölge önerileri (ayrı başlıkla)} */
  function ozelList(cfg,m){
    var R=ozelReal(cfg,m.ilce,m.mah),out=R.exact.slice();
    var need=Math.max(0,3-out.length); if(need)out=out.concat(ozelGen(m,need,(cfg&&cfg.seedExtra)||''));
    var oneri=R.inIlce.concat(R.rest).slice(0,3);
    return {list:out.slice(0,6),oneri:oneri};
  }
  var _STR=['Atatürk Cd.','Cumhuriyet Cd.','Kıbrıs Şehitleri Cd.','1418. Sk.','Gül Sk.','Zafer Sk.','Sahil Blv.','İstasyon Cd.','Menekşe Sk.','Papatya Sk.','Lale Cd.','Çınar Sk.','2. Sk.','Şair Eşref Blv.'];
  var _KAT=['Giriş Kat','Ara Kat','Orta Kat','Orta Kat','Yüksek Kat','Çatı Dubleks'],_ODA=['1+1','2+1','2+1','3+1','3+1','4+1'];
  function streets(m,extra){
    var r=rngOf(m.ilce+'|'+m.mah+'|st|'+(extra||'')),out=[],used={},base=m.cats.daireSat.m2,kmo=m.cats.daireKira.m2,i,n;
    for(i=0;i<4;i++){var name;n=0;do{name=_STR[Math.floor(r()*_STR.length)];n++;}while(used[name]&&n<30);used[name]=1;
      var mm=85+Math.round(r()*55),kat=_KAT[Math.floor(r()*_KAT.length)],oda=_ODA[Math.floor(r()*_ODA.length)];
      var kf=/Giriş/.test(kat)?0.93:(/Yüksek|Çatı/.test(kat)?1.07:1.0);
      out.push({name:name,m2:mm,kat:kat,oda:oda,sale:Math.round(base*mm*kf*(0.95+r()*0.12)/50000)*50000,rent:Math.round(kmo*mm*kf*(0.95+r()*0.12)/500)*500});}
    return out;
  }

  /* ============ INSTANCE ============ */
  function make(host,cfg){
    cfg=cfg||{}; var cache={},_il='',_mh='',_req=0;
    var accent=cfg.accent||'#0e7c86';
    var waHref=cfg.waHref||function(t){return '#';};
    function $(id){return host.querySelector('#'+id);}
    function scaffold(){
      host.classList.add('me-root'); host.style.setProperty('--me-accent',accent);
      host.innerHTML=''
        +'<div class="me-bar"><div class="me-bar-l"><span class="me-badge"><span class="me-dot"></span> Mahalle Emlak Endeksi · ProX</span>'
          +'<div class="me-sels"><label>İlçe <select id="me_ilce"></select></label><label>Mahalle <select id="me_mah"></select></label></div></div>'
          +'<div class="me-live" id="me_live"><span class="dot"></span> ProX endeksi bağlanıyor…</div></div>'
        +'<div class="me-head" id="me_head"></div>'
        +'<div class="me-val" id="me_val" hidden></div>'
        +'<div class="me-sec-h">📊 Tüm kategori endeksi · ProX gerçek veri</div>'
        +'<div class="me-cats" id="me_cats"></div>'
        +'<div class="me-profile" id="me_profile"></div>'
        /* me-ozel (özel portföy kartları) + me-streets (sokak kartları) yalnız cfg.hideOzelBand!==true iken.
           gm ana sayfasında bunlar KAPALI (hideOzelBand:true) — özel portföy alttaki tek-tip "fırsatlar"
           (ozHomeCards) kartlarıyla sunuluyor; endeks widget yalnız ENDEKS verisine odaklanır.
           insaat/danışman özel-portföy sayfalarında bant açık kalır (varsayılan). */
        +(cfg.hideOzelBand ? '' : (''
          +'<div class="me-ozel" id="me_ozel"></div>'
          +'<div class="me-sec-h">📍 Bu mahallede cadde/sokak bazında başlangıç fiyatları</div>'
          +'<div class="me-streets" id="me_streets"></div>'));
      var ic=$('me_ilce'),mh=$('me_mah');
      if(ic)ic.onchange=function(){_il=ic.value;fillMah();render();};
      if(mh)mh.onchange=function(){_mh=mh.value;render();};
      host.addEventListener('click',function(e){
        var b=e.target.closest&&e.target.closest('[data-me-act]'); if(!b)return;
        var act=b.getAttribute('data-me-act');
        if(act==='oz'){var id=b.getAttribute('data-oz'); if(id&&id!=='undefined'&&cfg.onLead)cfg.onLead(id); else if(cfg.goOzel)cfg.goOzel();}
        else if(act==='all'&&cfg.goOzel)cfg.goOzel();
      });
    }
    function districts(){ try{return (cfg.districts&&cfg.districts())||{};}catch(e){return {};} }
    function fillIlce(){
      var ic=$('me_ilce'); if(!ic)return; var d=districts(); var keys=Object.keys(d);
      if(!keys.length){keys=['Merkez'];}
      var cur=Array.prototype.map.call(ic.options,function(o){return o.value;}).join('|');
      if(cur!==keys.join('|')){ ic.innerHTML=keys.map(function(k){return '<option>'+esc(k)+'</option>';}).join(''); _il=ic.value||keys[0]||''; fillMah(); }
    }
    function fillMah(){
      var mh=$('me_mah'); if(!mh)return; var d=districts(); var list=(d[_il]||[]);
      mh.innerHTML=(list.length?list:['Merkez']).slice(0,40).map(function(m){return '<option>'+esc(m)+'</option>';}).join('');
      _mh=mh.value||list[0]||'Merkez';
      /* canlı gerçek mahalle yükleyici varsa güncelle */
      if(cfg.loadMah){ try{ cfg.loadMah(cfg.province?cfg.province():'',_il).then(function(arr){ if(arr&&arr.length&&mh.value===_mh){ var keep=mh.value; mh.innerHTML=arr.slice(0,40).map(function(m){return '<option>'+esc(m)+'</option>';}).join(''); mh.value=keep&&arr.indexOf(keep)>=0?keep:arr[0]; _mh=mh.value; render(); } }); }catch(e){} }
    }

    function catCard(lab,val,unit,series,color,chgTxt,ilan,live){
      return '<div class="me-cc"><div class="me-cc-top"><span class="me-cc-lab">'+esc(lab)+'</span><span class="me-cc-dot '+(live?'on':'off')+'" title="'+(live?'Canlı ProX verisi':'Modellenmiş tahmin')+'"></span></div>'
        +'<div class="me-cc-val">'+val+'</div><div class="me-cc-unit">'+unit+'</div>'+spark(series,color)
        +'<div class="me-cc-foot"><span class="me-chg up">▲ '+chgTxt+'</span>'+(ilan?'<span class="me-cc-ilan">'+ilan+' ilan</span>':'<span class="me-cc-ilan mut">endeks</span>')+'</div></div>';
    }
    function paint(m){
      /* KİRA-SATIŞ TUTARLILIĞI: kira endeksi (canlı/sentetik), satış fiyatına göre gerçekçi
         brüt getiri bandında olmalı. ProX'ta satış-kira endeksleri bağımsız gelir; tutarsız
         olursa (ör. %9+ getiri) absürt kira çıkar → satıştan modelin getirisiyle yeniden türet. */
      (function(){ try{
        var ty=clamp((m.kiraPct||4.5)/100,0.032,0.058);
        var s=m.cats.daireSat.m2, k=m.cats.daireKira.m2;
        if(s>0&&k>0){ var y=k*12/s; if(y<0.028||y>0.062){ m.cats.daireKira.m2=s*ty/12; m.cats.daireKira.adj=true; } }
        var ts=m.cats.ticariSat.m2, tk=m.cats.ticariKira.m2;
        if(ts>0&&tk>0){ var y2=tk*12/ts; var tyT=Math.max(ty*1.05,0.04); if(y2<0.03||y2>0.09){ m.cats.ticariKira.m2=ts*tyT/12; m.cats.ticariKira.adj=true; } }
      }catch(e){} })();
      var yr=m.deltaYr&&m.deltaYr>0?m.deltaYr:annual(m.chg5);
      var yrTxt='%'+yr.toFixed(1)+'<i>/yıl</i>';
      var ds=m.cats.daireSat,dk=m.cats.daireKira,ts=m.cats.ticariSat,tk=m.cats.ticariKira,ar=m.cats.arsa;
      var per90=ds.m2*90,kira90=dk.m2*90,prov=m.prov;
      var ser=function(end,cf){return growth(Math.max(1,end),(m.chg5||120)*(cf||1),6,rngOf(m.ilce+'|'+m.mah+'|'+end));};
      var h=$('me_head');
      if(h)h.innerHTML='<div class="me-h-l"><div class="me-h-mah">'+esc(m.mah)+' <span>· '+esc(m.ilce)+' / '+esc(prov)+'</span></div>'
        +'<div class="me-h-big"><b>'+M(per90)+'</b><span>ortalama 90 m² daire</span></div>'
        +'<div class="me-h-meta"><span class="me-chg up big">▲ '+yrTxt+'</span><span class="me-m2">~'+fmt(ds.m2)+' ₺/m²</span></div></div>'
        +'<div class="me-h-r"><div class="me-score-ring" style="--v:'+Math.round(m.score)+'"><span>'+Math.round(m.score)+'</span></div><small>ProX mahalle<br>skoru /100</small></div>';
      var v=$('me_val'),az=m.analyze;
      if(v){ if(az&&(az.min||az.max)){
          var yonMap={yatay:'→ Yatay seyir',yukari:'▲ Yükselen',artan:'▲ Yükselen',dusuk:'▼ Gevşeyen',azalan:'▼ Gevşeyen',dusen:'▼ Gevşeyen'};
          var bandMap={genis:'geniş bant',dar:'dar bant',orta:'orta bant'};
          var yon=yonMap[(az.yon||'').toLowerCase()]||(az.yon?esc(az.yon):''),band=bandMap[(az.band||'').toLowerCase()]||(az.band?esc(az.band):'');
          v.hidden=false;
          v.innerHTML='<span class="me-val-lab">🎯 ProX Değerleme · 90 m² daire</span><div class="me-val-items">'
            +'<span class="me-val-i"><small>Değer aralığı</small><b>'+M(az.min)+' – '+M(az.max)+'</b></span>'
            +(az.conf!=null?'<span class="me-val-i"><small>Güven</small><b>%'+az.conf+(band?' · '+band:'')+'</b></span>':'')
            +(yon?'<span class="me-val-i"><small>Piyasa yönü</small><b>'+yon+'</b></span>':'')
            +(az.veri?'<span class="me-val-i"><small>Veri noktası</small><b>'+fmt(az.veri)+'</b></span>':'')+'</div>';
        } else { v.hidden=true; v.innerHTML=''; } }
      var c=$('me_cats');
      if(c)c.innerHTML=catCard('Daire · Satılık',M(per90),'90 m² · '+fmt(ds.m2)+' ₺/m²',ser(ds.m2),'#0e7490',yrTxt,ds.ilan,ds.live)
        +catCard('Daire · Kiralık',fmt(kira90)+' ₺<small>/ay</small>','90 m² · '+fmt(dk.m2)+' ₺/m²·ay',ser(dk.m2,0.6),'#1e7e3a',yrTxt,dk.ilan,dk.live)
        +catCard('İşyeri · Satılık',fmt(ts.m2)+' ₺<small>/m²</small>','dükkan · ofis · vitrin',ser(ts.m2),'#0891b2',yrTxt,ts.ilan,ts.live)
        +catCard('İşyeri · Kiralık',fmt(tk.m2)+' ₺<small>/m²·ay</small>','ticari kira',ser(tk.m2,0.6),'#ea580c',yrTxt,tk.ilan,tk.live)
        +catCard('Arsa',fmt(ar.m2)+' ₺<small>/m²</small>','imarlı · yatırım',ser(ar.m2,1.15),'#d4af37',yrTxt,ar.ilan,ar.live);
      var dm=m.demo,p=$('me_profile');
      if(p){ var pie=function(t,labels,vals,colors,center){return '<div class="me-pie"><div class="me-pie-t">'+t+'</div>'+donut(vals,colors,center)+legend(labels,vals,colors)+'</div>';};
        p.innerHTML='<div class="me-prof-head">👥 Mahalle profili · demografi & yaşam <em>(tahmini profil)</em></div>'
          +'<div class="me-prof-grid">'
          +pie('Yaş dağılımı',['0–17','18–34','35–54','55+'],dm.yas,TEAL)
          +pie('Eğitim',['İlköğretim','Lise','Ön Lisans','Lisans','Lisansüstü'],dm.egitim,TEAL)
          +pie('Gelir grubu',['Alt','Alt-Orta','Orta-Üst','Üst'],dm.gelir,GOLD)
          +pie('Mülk sahipliği',['Ev sahibi','Kiracı'],[dm.sahiplik,100-dm.sahiplik],OWN,'%'+Math.round(dm.sahiplik))+'</div>'
          +'<div class="me-stats">'
          +'<div class="me-stat"><span>Nüfus</span><b>'+fmt(dm.nufus)+'</b></div>'
          +'<div class="me-stat"><span>Ort. hane</span><b>'+dm.hane+' kişi</b></div>'
          +'<div class="me-stat"><span>Ort. hane geliri</span><b>'+fmt(dm.ortGelir)+' ₺</b></div>'
          +'<div class="me-stat"><span>Yaşam kalitesi</span><b>'+dm.yasamK+'/100</b></div></div>';
      }
      var o=$('me_ozel');
      if(o){ var _oz=ozelList(cfg,m); var list=_oz.list; var oneriler=_oz.oneri||[];
        var minOf=function(pred){var val=0;list.forEach(function(x){if(pred(x)&&(!val||x.fiyat<val))val=x.fiyat;});return val;};
        var sD=minOf(function(x){return x.op==='Satılık'&&TIP_CAT[x.tip]==='Konut';})||Math.round(per90*0.72/50000)*50000;
        var sK=minOf(function(x){return x.op==='Kiralık'&&TIP_CAT[x.tip]==='Konut';})||Math.round(kira90*0.6/500)*500;
        var sT=minOf(function(x){return TIP_CAT[x.tip]==='Ticari';})||Math.round(ts.m2*60*0.8/50000)*50000;
        var sA=minOf(function(x){return TIP_CAT[x.tip]==='Arsa';})||Math.round(ar.m2*200*0.8/50000)*50000;
        var chips='<div class="me-oz-chips">'
          +'<span class="me-oz-chip">Satılık daire <b>'+M(sD)+'</b>’den</span>'
          +'<span class="me-oz-chip">Kiralık daire <b>'+fmt(sK)+' ₺</b>’den</span>'
          +'<span class="me-oz-chip">İşyeri <b>'+M(sT)+'</b>’den</span>'
          +'<span class="me-oz-chip">Arsa <b>'+M(sA)+'</b>’den</span></div>';
        var cards=list.map(function(x){
          var money=x.op==='Kiralık'?(fmt(x.fiyat)+' ₺'):M(x.fiyat);
          var wtxt='Özel Portföy — '+x.op+' '+x.tip+' ('+m.mah+', '+(x.cadde||m.ilce)+') '+x.m2+' m² hakkında bilgi almak istiyorum.';
          return '<div class="me-oz-card">'
            +'<div class="me-oz-op '+(x.op==='Kiralık'?'k':'s')+'">'+esc(x.op)+'</div>'
            +'<div class="me-oz-tip">'+esc(x.tip)+(x.gen?' <span class="me-oz-gen" title="Merkezi demo seed kaydı — gerçek ilan veya EİDS doğrulaması değildir.">ÖZEL PORTFÖY · DEMO</span>':'')+'</div>'
            +'<div class="me-oz-loc">📍 '+esc(m.mah)+' · '+esc(x.cadde||x.ilce)+'</div>'
            +'<div class="me-oz-tech"><span>'+x.m2+' m²</span>'+(x.oda&&x.oda!=='-'?'<span>'+esc(x.oda)+'</span>':'')+'</div>'
            +'<div class="me-oz-price">'+money+'<small>’den başlayan</small></div>'
            +'<div class="me-oz-cta"><button type="button" class="me-oz-detail" data-me-act="oz" '+(x.id?'data-oz="'+esc(x.id)+'"':'')+'>🔒 Detay İste</button>'
            +'<a class="me-oz-wa" href="'+esc(waHref(wtxt))+'" target="_blank" rel="noopener noreferrer" title="WhatsApp"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4-.1.6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6-.1 1.2Z"/></svg></a></div></div>';
        }).join('');
        o.innerHTML='<div class="me-oz-band"><div class="me-oz-h"><span class="me-oz-lock">🔒 Demo Özel Portföy · '+esc(m.mah)+'</span>'
          +'<p><b>Demo portföy gösterimi.</b> Bu mahalle için ProX piyasa verileriyle oluşturulan tanıtım senaryoları — <b>gerçek taşınmaz veya resmî ilan değildir</b>. Fiyat bantları şu değerlerden başlar:</p></div>'
          +chips+'<div class="me-oz-grid">'+cards+'</div>'
          +(oneriler.length?('<div class="me-oz-oneri-h" style="margin-top:14px;font-size:.75rem;font-weight:800;opacity:.75">📍 Yakın bölge önerileri <span style="font-weight:600;opacity:.8">(seçtiğiniz mahalle dışından — ayrı listelenir)</span></div><div class="me-oz-grid">'+oneriler.map(function(x){return '<div class="me-oz-card" style="opacity:.85"><div class="me-oz-op '+(x.op==='Kiralık'?'k':'s')+'">'+esc(x.op||'')+'</div><div class="me-oz-tip">'+esc(x.tip||'')+' <span class="me-oz-gen">ÖZEL PORTFÖY · DEMO</span></div><div class="me-oz-loc">📍 '+esc((x.mah||'')+' · '+(x.ilce||''))+'</div><div class="me-oz-tech"><span>'+(x.m2||'—')+' m²</span></div></div>';}).join('')+'</div>'):'')
          +'<div class="me-oz-actions"><button class="me-oz-all" data-me-act="all">Tüm Özel Portföyü Gör →</button>'
          +'<a class="me-oz-owner" href="'+esc(waHref('Merhaba, mülkümü ifşa etmeden Özel Portföy\'e eklemek / değer analizi almak istiyorum.'))+'" target="_blank" rel="noopener noreferrer">🏠 Mülkümü gizli portföye ekle</a></div></div>';
      }
      var st=streets(m,(cfg&&cfg.seedExtra)||''),s=$('me_streets');
      if(s)s.innerHTML=st.map(function(x){
        var wtxt='Özel Portföy — '+m.mah+' '+x.name+' civarı '+x.m2+' m² '+x.oda+' hakkında bilgi almak istiyorum.';
        return '<div class="me-st"><div class="me-st-name">📍 '+esc(m.mah)+' · <b>'+esc(x.name)+'</b></div>'
          +'<div class="me-st-tech"><span>'+x.m2+' m²</span><span>'+esc(x.oda)+'</span><span>'+esc(x.kat)+'</span></div>'
          +'<div class="me-st-prices"><span class="me-pr sale">Satılık <b>'+M(x.sale)+'</b>’den</span><span class="me-pr rent">Kiralık <b>'+fmt(x.rent)+' ₺</b>’den</span></div>'
          +'<div class="me-st-cta"><button type="button" data-me-act="all">Detay</button><a href="'+esc(waHref(wtxt))+'" target="_blank" rel="noopener noreferrer" class="me-st-wa">WhatsApp</a></div></div>';
      }).join('');
      var lv=$('me_live');
      if(lv){ if(m.source==='live')lv.innerHTML='<span class="dot"></span> Canlı ProX endeksi · '+(m.ilanTot||0)+' ilan taranıyor'+(m.period?' · '+periodTR(m.period):'');
        else lv.innerHTML='<span class="dot load"></span> ProX endeksi bağlanıyor…'; }
    }
    function render(){
      if(!_il||!_mh)return; var my=++_req;
      paint(modelOf(cfg,_il,_mh));
      liveModel(cfg,_il,_mh,cache).then(function(m){if(my===_req)paint(m);}).catch(function(){});
    }
    scaffold(); fillIlce(); render();
    return {render:render,refresh:function(){fillIlce();render();},setIlce:function(i){var ic=$('me_ilce');if(ic){ic.value=i;_il=i;fillMah();render();}}};
  }

  /* ============ CSS ============ */
  var _css=false;
  function injectCSS(){
    if(_css)return; _css=true; var A='var(--me-accent,#0e7c86)';
    var css=''
    +'.me-root{--me-ink:#12181f;--me-mut:#64748b;--me-line:#e6eaf0;--me-surf:#fff;background:var(--me-surf);border:1px solid var(--me-line);border-radius:20px;padding:20px;box-shadow:0 10px 40px -18px rgba(15,23,42,.22);color:var(--me-ink);font-family:system-ui,-apple-system,sans-serif}'
    +'.me-bar{display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px}'
    +'.me-badge{display:inline-flex;align-items:center;gap:7px;font:800 .75rem/1 system-ui;letter-spacing:.03em;color:'+A+';background:color-mix(in srgb,'+A+' 12%,transparent);padding:8px 12px;border-radius:999px;text-transform:uppercase}'
    +'.me-dot{width:7px;height:7px;border-radius:50%;background:'+A+';box-shadow:0 0 0 3px color-mix(in srgb,'+A+' 22%,transparent)}'
    +'.me-sels{display:inline-flex;gap:10px;margin-top:10px;flex-wrap:wrap}'
    +'.me-sels label{font:700 .6875rem/1 system-ui;color:var(--me-mut);display:flex;flex-direction:column;gap:4px;text-transform:uppercase;letter-spacing:.03em}'
    +'.me-sels select{border:1px solid var(--me-line);border-radius:10px;padding:9px 11px;font:600 .875rem/1 system-ui;color:var(--me-ink);background:var(--me-surf);cursor:pointer;min-width:150px}'
    +'.me-live{font:600 .75rem/1.3 system-ui;color:var(--me-mut);display:inline-flex;align-items:center;gap:7px}'
    +'.me-live .dot{width:8px;height:8px;border-radius:50%;background:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.18)}'
    +'.me-live .dot.load{background:#f59e0b;animation:mepulse 1s infinite}@keyframes mepulse{50%{opacity:.4}}'
    +'.me-head{display:flex;justify-content:space-between;align-items:center;gap:16px;flex-wrap:wrap;background:linear-gradient(135deg,color-mix(in srgb,'+A+' 8%,#fff),var(--me-surf));border:1px solid var(--me-line);border-radius:16px;padding:18px}'
    +'.me-h-mah{font:800 .9375rem/1.2 system-ui}.me-h-mah span{color:var(--me-mut);font-weight:600}'
    +'.me-h-big{margin:6px 0 8px}.me-h-big b{font:800 1.875rem/1 system-ui;color:'+A+'}.me-h-big span{color:var(--me-mut);font:600 .8125rem/1 system-ui;margin-left:8px}'
    +'.me-h-meta{display:flex;gap:14px;flex-wrap:wrap;align-items:center;font:600 .8125rem/1 system-ui}'
    +'.me-chg.up{color:#16a34a}.me-chg.up.big{font-size:.9375rem;font-weight:800}.me-chg i{font-style:normal;opacity:.7;font-weight:600}'
    +'.me-m2{color:var(--me-mut)}'
    +'.me-score-ring{width:74px;height:74px;border-radius:50%;display:grid;place-items:center;background:conic-gradient('+A+' calc(var(--v)*1%),#eef2f8 0);position:relative}'
    +'.me-score-ring::after{content:"";position:absolute;inset:8px;background:var(--me-surf);border-radius:50%}'
    +'.me-score-ring span{position:relative;font:800 1.375rem/1 system-ui;color:'+A+'}'
    +'.me-h-r{display:flex;align-items:center;gap:10px}.me-h-r small{color:var(--me-mut);font:600 .6875rem/1.3 system-ui}'
    +'.me-val{margin-top:14px;background:color-mix(in srgb,'+A+' 6%,#fff);border:1px dashed color-mix(in srgb,'+A+' 40%,transparent);border-radius:14px;padding:14px}'
    +'.me-val-lab{font:800 .8125rem/1 system-ui;color:'+A+'}'
    +'.me-val-items{display:flex;gap:20px;flex-wrap:wrap;margin-top:10px}'
    +'.me-val-i{display:flex;flex-direction:column;gap:3px}.me-val-i small{font:600 .6875rem/1 system-ui;color:var(--me-mut);text-transform:uppercase;letter-spacing:.02em}.me-val-i b{font:800 .9375rem/1 system-ui}'
    +'.me-sec-h{font:800 .8125rem/1 system-ui;color:var(--me-mut);text-transform:uppercase;letter-spacing:.04em;margin:20px 0 12px}'
    +'.me-cats{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}'
    +'@media(max-width:900px){.me-cats{grid-template-columns:repeat(2,1fr)}}@media(max-width:520px){.me-cats{grid-template-columns:1fr}}'
    +'.me-cc{border:1px solid var(--me-line);border-radius:14px;padding:13px;background:var(--me-surf);transition:.15s}.me-cc:hover{border-color:'+A+';transform:translateY(-2px)}'
    +'.me-cc-top{display:flex;justify-content:space-between;align-items:center}.me-cc-lab{font:700 .75rem/1.2 system-ui;color:var(--me-mut)}'
    +'.me-cc-dot{width:8px;height:8px;border-radius:50%}.me-cc-dot.on{background:#16a34a;box-shadow:0 0 0 3px rgba(22,163,74,.16)}.me-cc-dot.off{background:#cbd5e1}'
    +'.me-cc-val{font:800 1.1875rem/1.1 system-ui;margin:8px 0 2px}.me-cc-val small{font-size:.75rem;color:var(--me-mut);font-weight:700}'
    +'.me-cc-unit{font:600 .6875rem/1.3 system-ui;color:var(--me-mut)}'
    +'.me-spark{width:100%;height:34px;margin:6px 0}'
    +'.me-cc-foot{display:flex;justify-content:space-between;align-items:center;font:700 .71875rem/1 system-ui}'
    +'.me-cc-ilan{color:var(--me-mut);font-weight:600}.me-cc-ilan.mut{opacity:.7}'
    +'.me-profile{margin-top:18px;border:1px solid var(--me-line);border-radius:16px;padding:16px}'
    +'.me-prof-head{font:800 .875rem/1 system-ui;margin-bottom:14px}.me-prof-head em{font-style:normal;color:var(--me-mut);font-weight:600;font-size:.75rem}'
    +'.me-prof-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}@media(max-width:820px){.me-prof-grid{grid-template-columns:1fr 1fr}}@media(max-width:480px){.me-prof-grid{grid-template-columns:1fr}}'
    +'.me-pie{text-align:center}.me-pie-t{font:700 .75rem/1 system-ui;color:var(--me-mut);margin-bottom:8px}'
    +'.me-donut-svg{width:108px;height:108px}.me-donut-c{font:800 1.125rem/1 system-ui;fill:var(--me-ink)}'
    +'.me-legend{list-style:none;margin:8px 0 0;padding:0;display:flex;flex-direction:column;gap:4px;text-align:left;max-width:170px;margin-inline:auto}'
    +'.me-legend li{display:flex;align-items:center;gap:6px;font:600 .71875rem/1.3 system-ui;color:var(--me-mut)}.me-legend b{margin-left:auto;color:var(--me-ink)}'
    +'.me-legend .sw{width:10px;height:10px;border-radius:3px;flex:none}'
    +'.me-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-top:16px;padding-top:14px;border-top:1px solid var(--me-line)}@media(max-width:520px){.me-stats{grid-template-columns:1fr 1fr}}'
    +'.me-stat{text-align:center}.me-stat span{display:block;font:600 .6875rem/1.3 system-ui;color:var(--me-mut)}.me-stat b{font:800 1rem/1.2 system-ui;color:'+A+'}'
    /* özel portföy */
    +'.me-ozel{margin-top:18px}'
    +'.me-oz-band{background:linear-gradient(135deg,#0f2740,#12181f);color:#e6eef7;border-radius:18px;padding:20px}'
    +'.me-oz-lock{font:800 .9375rem/1 system-ui;color:#fff}'
    +'.me-oz-h p{margin:8px 0 0;font:500 .8125rem/1.6 system-ui;color:#c3d0e0;max-width:640px}.me-oz-h b{color:#fff}'
    +'.me-oz-chips{display:flex;gap:8px;flex-wrap:wrap;margin:14px 0}'
    +'.me-oz-chip{background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.14);border-radius:999px;padding:7px 13px;font:600 .75rem/1 system-ui;color:#dbe6f5}.me-oz-chip b{color:#fff;font-weight:800}'
    +'.me-oz-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px}@media(max-width:820px){.me-oz-grid{grid-template-columns:1fr 1fr}}@media(max-width:520px){.me-oz-grid{grid-template-columns:1fr}}'
    +'.me-oz-card{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:13px;padding:13px;transition:.15s}.me-oz-card:hover{border-color:'+A+';background:rgba(255,255,255,.08)}'
    +'.me-oz-op{display:inline-block;font:800 .625rem/1 system-ui;padding:4px 8px;border-radius:6px;text-transform:uppercase}.me-oz-op.s{background:'+A+';color:#fff}.me-oz-op.k{background:#c99a2e;color:#1a1206}'
    +'.me-oz-tip{font:700 .8125rem/1 system-ui;color:#fff;margin:8px 0 4px}.me-oz-gen{display:inline-block;font-size:.59375rem;font-weight:800;letter-spacing:.5px;color:#475569;background:rgba(100,116,139,.16);border-radius:999px;padding:2px 7px;margin-left:6px;vertical-align:middle}.me-oz-loc{font:600 .75rem/1.3 system-ui;color:#aebfd2}'
    +'.me-oz-tech{display:flex;gap:6px;margin:8px 0}.me-oz-tech span{background:rgba(255,255,255,.08);border-radius:6px;padding:3px 8px;font:600 .6875rem/1 system-ui;color:#cdd9e8}'
    +'.me-oz-price{font:800 1.0625rem/1 system-ui;color:#fff;margin:6px 0 10px}.me-oz-price small{display:block;font-size:.65625rem;color:#9fb0c4;font-weight:600;margin-top:3px}'
    +'.me-oz-cta{display:flex;gap:6px}'
    +'.me-oz-detail{flex:1;border:0;background:'+A+';color:#fff;border-radius:9px;padding:9px;font:700 .75rem/1 system-ui;cursor:pointer}'
    +'.me-oz-wa{display:grid;place-items:center;width:38px;border-radius:9px;background:#25D366;color:#fff;text-decoration:none}'
    +'.me-oz-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:14px}'
    +'.me-oz-all{border:0;background:#fff;color:#12181f;border-radius:10px;padding:11px 18px;font:800 .8125rem/1 system-ui;cursor:pointer}'
    +'.me-oz-owner{display:inline-flex;align-items:center;gap:6px;border:1px solid rgba(255,255,255,.25);color:#fff;border-radius:10px;padding:11px 16px;font:700 .8125rem/1 system-ui;text-decoration:none}.me-oz-owner:hover{background:rgba(255,255,255,.1)}'
    /* sokaklar */
    +'.me-streets{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}@media(max-width:820px){.me-streets{grid-template-columns:1fr 1fr}}@media(max-width:480px){.me-streets{grid-template-columns:1fr}}'
    +'.me-st{border:1px solid var(--me-line);border-radius:13px;padding:13px;background:var(--me-surf)}'
    +'.me-st-name{font:600 .78125rem/1.3 system-ui;color:var(--me-mut)}.me-st-name b{color:var(--me-ink)}'
    +'.me-st-tech{display:flex;gap:6px;margin:8px 0}.me-st-tech span{background:color-mix(in srgb,'+A+' 8%,transparent);border-radius:6px;padding:3px 7px;font:600 .6875rem/1 system-ui;color:var(--me-ink)}'
    +'.me-st-prices{display:flex;flex-direction:column;gap:3px;font:600 .75rem/1.4 system-ui;margin-bottom:10px}.me-pr b{font-weight:800}.me-pr.sale{color:'+A+'}.me-pr.rent{color:#1e7e3a}'
    +'.me-st-cta{display:flex;gap:6px}.me-st-cta button{flex:1;border:1px solid var(--me-line);background:var(--me-surf);border-radius:8px;padding:8px;font:700 .71875rem/1 system-ui;cursor:pointer;color:var(--me-ink)}'
    +'.me-st-wa{display:grid;place-items:center;padding:0 12px;border-radius:8px;background:#25D366;color:#fff;text-decoration:none;font:700 .71875rem/1 system-ui}';
    /* ── MODERN / İLERİ SEVİYE: widget'ı site tasarım sistemine hizala (Sora/Hanken/Space Grotesk) + cila ── */
    css = css.replace(/system-ui,-apple-system,sans-serif/g, 'var(--me-body)').replace(/ system-ui\b/g, ' var(--me-body)');
    css += '.me-root{--me-body:var(--body,"Hanken Grotesk",ui-sans-serif,system-ui,sans-serif);border-radius:22px;box-shadow:0 26px 64px -32px rgba(15,23,42,.32)}'
      + '.me-h-big b,.me-h-big,.me-cc-val,.me-stat b,.me-score-ring span,.me-donut-c,.me-val-i b{font-family:var(--num,"Space Grotesk",ui-monospace,system-ui);letter-spacing:-.01em}'
      + '.me-badge,.me-sec-h,.me-prof-head,.me-h-mah,.me-cc-lab,.me-prof-head{font-family:var(--head,"Sora",system-ui,sans-serif)}'
      + '.me-head{border-radius:18px;padding:20px 22px}.me-h-big b{font-size:2.125rem}'
      + '.me-score-ring{width:84px;height:84px}.me-score-ring span{font-size:1.5625rem}'
      + '.me-live{background:color-mix(in srgb,var(--me-accent) 8%,#fff);padding:7px 13px;border-radius:999px;border:1px solid color-mix(in srgb,var(--me-accent) 18%,transparent);font-weight:700}'
      + '.me-cc{border-radius:16px;position:relative;overflow:hidden}.me-cc::before{content:"";position:absolute;inset:0 0 auto 0;height:3px;background:var(--me-accent);opacity:.85}.me-cc-val{font-size:1.3125rem}'
      + '.me-sec-h{font-size:.75rem}';
    var st=document.createElement('style'); st.id='meSharedCSS'; st.textContent=css;
    (document.head||document.documentElement).appendChild(st);
  }

  window.MahalleEndeks={
    mount:function(host,cfg){ if(typeof host==='string')host=document.getElementById(host)||document.querySelector(host); if(!host)return null; injectCSS(); try{return make(host,cfg);}catch(e){try{host.innerHTML='<div style="padding:20px;color:#64748b">Mahalle endeksi yüklenemedi.</div>';}catch(e2){} return null;} },
    injectCSS:injectCSS
  };
})();
