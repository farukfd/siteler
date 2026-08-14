/* =====================================================================
   shared/listing.js — Ortak PROFESYONEL İLAN çekirdeği (tüm siteler)
   • EİDS YAYIN KAPISI: yalnız EIDS.canPublish() (durum='dogrulandi') ilan
     public'te görünür. Onaysız ilan sitede yayınlanmaz.
   • Profesyonel ilan kartı + çoklu görsel galerili KAPSAMLI detay içeriği
     (özellik tablosu, açıklama, konum, EİDS rozeti, danışman CTA).
   • Site-agnostik: renkleri CSS değişkenlerinden (--accent…) miras alır;
     üst/alt menü (chrome) her sitenin KENDİ overlay'ine sarılır.
   Kullanım (site):
     var pub = Listings.publicList(ALL_ILANLAR);      // EİDS onaylılar
     grid.innerHTML = pub.map(function(L){return Listings.cardHTML(L,cfg);}).join('');
     // kart tıklaması → site kendi overlay'ini açar + Listings.detailInnerHTML(L,cfg)
   Normalleştirilmiş ilan (L) alanları — site adaptörü doldurur:
     {id,title,op,type,priceText,images[],ilce,mah,il,address,
      specs[{k,v}],features[],desc,eids,ref(sahibinden vb.)}
   cfg: {brand():s, phone():s, whatsapp():s, onOpen(id), onContact(L), mapQuery(L)}
   ===================================================================== */
(function(){
  'use strict';
  var L={}; window.Listings=L;
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function _arr(x){return Array.isArray(x)?x:(x?[x]:[]);}
  function _canPub(l){ try{ return (window.EIDS&&EIDS.canPublish)?EIDS.canPublish(l&&l.eids):(l&&l.eids&&l.eids.status==='dogrulandi'); }catch(e){ return false; } }
  /* DEMO_PRIVATE_PORTFOLIO sınıfı: yalnız demo ortamında listelenir; EİDS rozeti taşıyamaz,
     RealEstateListing şeması alamaz, resmî yayına geçemez. */
  function _isDemoRec(l){ try{ return !!(l&&((window.EIDS&&EIDS.isDemo&&EIDS.isDemo(l.eids))||(l.eids&&l.eids.status==='demo')||l.listing_kind==='demo_private_portfolio')); }catch(e){ return false; } }
  L.isDemoRec=_isDemoRec;

  /* ---- TAM TÜRK EMLAK KATEGORİ TAKSONOMİSİ (sahibinden/hepsiemlak yapısı) ---- */
  L.TR_CATS={
    'Konut':['Daire','Rezidans','Villa','Müstakil Ev','Dubleks','Tripleks','Çiftlik Evi','Yazlık','Yalı','Yalı Dairesi','Köşk & Konak','Loft','Bahçeli Ev','Prefabrik Ev','Devremülk'],
    'İş Yeri':['Ofis','Büro & Home-Office','Dükkan & Mağaza','Depo & Antrepo','Fabrika & Üretim Tesisi','Plaza Katı / Ofisi','Atölye & İmalathane','Kafe & Restoran','Kantin & Büfe','Akaryakıt İstasyonu','Komple Bina'],
    'Arsa':['Konut İmarlı Arsa','Ticari İmarlı Arsa','Sanayi İmarlı Arsa','Turizm İmarlı Arsa','Tarla','Bağ & Bahçe','Zeytinlik','Villa İmarlı Arsa'],
    'Bina':['Apartman','İş Hanı','Komple Bina','Otopark & Garaj'],
    'Turistik Tesis':['Otel','Apart Otel','Butik Otel','Pansiyon','Tatil Köyü'],
    'Devremülk':['Devremülk']
  };
  L.OP_LIST=['Satılık','Kiralık','Devren Satılık','Günlük Kiralık'];
  L.typeOptionsHTML=function(sel){ sel=sel||''; var pre='',out='',found=false;
    for(var grp in L.TR_CATS){ out+='<optgroup label="'+esc(grp)+'">'; L.TR_CATS[grp].forEach(function(t){var s=(t===sel);if(s)found=true;out+='<option'+(s?' selected':'')+'>'+esc(t)+'</option>';}); out+='</optgroup>'; }
    if(sel&&!found)pre='<option selected>'+esc(sel)+'</option>'; return pre+out; };
  L.typeSelectHTML=function(id,sel){ return '<select id="'+esc(id)+'">'+L.typeOptionsHTML(sel)+'</select>'; };
  L.opSelectHTML=function(id,sel){ return '<select id="'+esc(id)+'">'+L.OP_LIST.map(function(o){return '<option'+(o===sel?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>'; };
  /* İl/İlçe (TR_ILILCE tam liste — 81 il + tüm ilçeler) seçici yardımcıları */
  L.ilOptions=function(sel){ var T=(window.TR_ILILCE)||{}; var ils=Object.keys(T).sort(function(a,b){return a.localeCompare(b,'tr');}); if(!ils.length)ils=['İstanbul','Ankara','İzmir']; return ils.map(function(il){return '<option'+(il===sel?' selected':'')+'>'+esc(il)+'</option>';}).join(''); };
  L.ilceOptions=function(il,sel){ var T=(window.TR_ILILCE)||{}; var r=T[il]&&T[il].ilce||[]; return '<option value="">İlçe seçin</option>'+r.map(function(x){return '<option'+(x===sel?' selected':'')+'>'+esc(x)+'</option>';}).join(''); };

  /* ---- KATEGORİYE GÖRE ÜCRETSİZ PROFESYONEL GÖRSELLER (Pexels CDN, hotlink-serbest) ---- */
  /* FAZ3B: Pexels hotlink KALDIRILDI — görseller lisans kaydıyla indirildi (Pexels lisansı,
     atıf gerektirmez), tenant asset deposunda yerel servis edilir (shared/img/px/<id>.jpg). */
  var _PXBASE=(function(){try{var sc=document.querySelector('script[src*="listing.js"]');if(sc&&sc.src.indexOf('/shared/')>-1)return sc.src.split('listing.js')[0]+'img/px/';}catch(e){}return '../shared/img/px/';})();
  function _px(id,slug){return _PXBASE+id+'.jpg';}
  L.CAT_IMG={
    konut:[_px(1918291),_px(1643383),_px(1080721),_px(1571468),_px(2062426),_px(2724749)],
    villa:[_px(1732414),_px(261102),_px(1396122),_px(2119713),_px(1080721)],
    ofis:[_px(1170412),_px(380769),_px(1181406),_px(1546168)],
    arsa:[_px(96715),_px(440731),_px(957024,'forest-trees-perspective-bright-957024')],
    dukkan:[_px(264636),_px(2079246),_px(380769)],
    bina:[_px(323705),_px(1546168),_px(2119713)],
    insaat:[_px(1216589),_px(159306,'construction-site-build-construction-work-159306'),_px(1105766),_px(1546168)]
  };
  function _hash(s){var h=0,i;s=''+s;for(i=0;i<s.length;i++){h=((h<<5)-h+s.charCodeAt(i))|0;}return Math.abs(h);}
  L.catOf=function(l){
    var type=((l&&(l.type||l.tip)||'')).toLocaleLowerCase('tr');
    /* 1) EXPLICIT TİP ÖNCELİKLİ — başlıktaki kelimeler (dubleks/dönüşüm) tipi EZEMEZ */
    if(type){
      if(/arsa|arazi|tarla|parsel|bağ|bahçe$/.test(type))return 'arsa';
      if(/d[üu]kkan|ma[ğg]aza/.test(type))return 'dukkan';
      if(/ofis|i[şs]\s?yeri|isyeri|plaza|b[üu]ro|ticari/.test(type))return 'ofis';
      if(/fabrika|atölye|atolye|depo|sanayi|antrepo/.test(type))return 'insaat';
      if(/otel|pansiyon|tatil|turistik|apart\b/.test(type))return 'bina';
      if(/villa|yal[ıi]|m[üu]stakil|k[öo][şs]k|çiftlik/.test(type))return 'villa';
      if(/daire|rezidans|konut|ev\b|st[üu]dyo|dubleks|tripleks|loft|flat/.test(type))return 'konut';
    }
    /* 2) TİP boş/belirsiz → başlık+işlemden çıkarım (yedek) */
    var s=(type+' '+(l&&(l.title||l.baslik)||'')+' '+(l&&(l.op||l.durum)||'')).toLocaleLowerCase('tr');
    if(/arsa|arazi|tarla|imarl/.test(s))return 'arsa';
    if(/d[üu]kkan|ma[ğg]aza|vitrin|perakende/.test(s))return 'dukkan';
    if(/ofis|i[şs]\s?yeri|plaza|ticari|b[üu]ro/.test(s))return 'ofis';
    if(/villa|yal[ıi]|m[üu]stakil|k[öo][şs]k|çiftlik/.test(s))return 'villa';
    if(/fabrika|atölye|atolye|depo|sanayi/.test(s))return 'insaat';
    if(/otel|pansiyon|turistik/.test(s))return 'bina';
    return 'konut'; };
  /* Kategoriye uygun n görsel — ilana göre farklı (id seed rotasyonu) */
  L.catImages=function(l,n){ n=n||4; var cat=L.catOf(l); var pool=(L.CAT_IMG[cat]||L.CAT_IMG.konut); if(!pool.length)return [];
    var seed=_hash((l&&(l.id||l.title||l.baslik))||cat)%pool.length; var out=[]; for(var i=0;i<Math.min(n,pool.length);i++){out.push(pool[(seed+i)%pool.length]);} return out; };

  /* ---- SAHİBİNDEN-TARZI KATEGORİ-BAZLI İLAN BİLGİLERİ (tam öznitelik tablosu) ---- */
  function _sr(seed){ var s=(_hash(''+seed)||1); return function(){ s=(s*1103515245+12345)&0x7fffffff; return s/0x7fffffff; }; }
  function _pk(r,a){ return a[Math.floor(r()*a.length)%a.length]; }
  L.detailAttrs=function(l){ var cat=L.catOf(l); var r=_sr(l.id||l.title||cat); var a=l.attrs||{}; var out=[];
    var add=function(k,v){ if(v!==undefined&&v!==null&&v!=='')out.push({k:k,v:''+v}); };
    add('İlan No', a.ilanNo||('İ'+(('0000000'+(''+(l.id||'')).replace(/\D/g,'')).slice(-7))));
    add('İlan Tarihi', a.tarih||l.date||'');
    add('Emlak Tipi', l.type||l.tip||'');
    add('İşlem', l.op||l.durum||'Satılık');
    if(cat==='arsa'){
      add('m²', a.m2||l.m2||_pk(r,['500','640','850','1200']));
      add('İmar Durumu', a.imar||_pk(r,['Konut','Ticari','Villa','Tarla','Sanayi','Turizm']));
      add('Ada No', a.ada||(''+(1000+Math.floor(r()*3000)))); add('Parsel No', a.parsel||(''+(1+Math.floor(r()*450))));
      add('Kaks (Emsal)', a.kaks||_pk(r,['0.30','0.50','1.00','1.50','2.00'])); add('Gabari', a.gabari||_pk(r,['6.50 m','9.50 m','12.50 m','Serbest']));
      add('Tapu Durumu', a.tapu||_pk(r,['Müstakil Parsel','Hisseli Tapu','Kat İrtifakı']));
      add('Krediye Uygun', a.kredi||_pk(r,['Evet','Hayır'])); add('Takas', a.takas||_pk(r,['Evet','Hayır'])); add('Kimden','Emlak Ofisinden');
    } else if(cat==='ofis'||cat==='dukkan'||cat==='bina'||cat==='insaat'){
      add('m² (Brüt)', a.m2||l.m2||_pk(r,['90','120','180','260','420'])); add('m² (Net)', a.net||(l.m2?Math.round(l.m2*0.85):''));
      add('Bölüm / Oda Sayısı', a.oda||l.oda||_pk(r,['1','2','3','Açık Ofis'])); add('Bina Yaşı', a.yas||_pk(r,['0','1-5','5-10','11-15']));
      add('Bulunduğu Kat', a.kat||l.kat||_pk(r,['Zemin','1','2','5','Bodrum'])); add('Isıtma', a.isitma||_pk(r,['Merkezi','Klima','Kombi (Doğalgaz)','VRV Sistem']));
      add('Aidat', a.aidat||(_pk(r,['1.500','2.500','4.000','6.000'])+' ₺')); add('Krediye Uygun', a.kredi||_pk(r,['Evet','Hayır']));
      add('Tapu Durumu', a.tapu||_pk(r,['Kat Mülkiyetli','Kat İrtifaklı'])); add('Kimden','Emlak Ofisinden');
    } else {
      add('m² (Brüt)', a.m2||l.m2||_pk(r,['110','135','165','220'])); add('m² (Net)', a.net||(l.m2?Math.round(l.m2*0.85):''));
      add('Oda Sayısı', a.oda||l.oda||_pk(r,['2+1','3+1','4+1'])); add('Bina Yaşı', a.yas||_pk(r,['0','1-5','5-10','11-15']));
      add('Bulunduğu Kat', a.kat||l.kat||_pk(r,['1','3','5','7','Ara Kat'])); add('Kat Sayısı', a.katSayisi||_pk(r,['3','5','8','12']));
      add('Isıtma', a.isitma||_pk(r,['Kombi (Doğalgaz)','Merkezi','Yerden Isıtma','Klima'])); add('Banyo Sayısı', a.banyo||_pk(r,['1','2','3']));
      add('Mutfak', a.mutfak||_pk(r,['Açık','Kapalı','Amerikan'])); add('Balkon', a.balkon||_pk(r,['Var','Yok']));
      add('Asansör', a.asansor||_pk(r,['Var','Yok'])); add('Otopark', a.otopark||_pk(r,['Açık Otopark','Kapalı Otopark','Yok']));
      add('Eşyalı', a.esyali||_pk(r,['Evet','Hayır'])); add('Kullanım Durumu', a.kullanim||_pk(r,['Boş','Kiracılı','Mülk Sahibi']));
      add('Site İçerisinde', a.site||_pk(r,['Evet','Hayır'])); add('Aidat', a.aidat||(_pk(r,['500','1.200','2.000','3.500'])+' ₺'));
      add('Krediye Uygun', a.kredi||_pk(r,['Evet','Hayır'])); add('Tapu Durumu', a.tapu||_pk(r,['Kat Mülkiyetli','Kat İrtifaklı']));
      add('Takas', a.takas||_pk(r,['Evet','Hayır'])); add('Kimden','Emlak Ofisinden');
    }
    return out;
  };
  L.catLabel=function(l){ var c=L.catOf(l); return {konut:'Konut',villa:'Konut · Villa',ofis:'İş Yeri',dukkan:'İş Yeri · Dükkan',arsa:'Arsa',bina:'Bina',insaat:'Proje / İnşaat'}[c]||'Konut'; };

  /* ---- MODERN İLAN-EKLE: kategoriye göre SEÇİM-tabanlı öznitelik formu (min. yazı) ---- */
  var _KONUT=[
    {k:'m2',l:'m² (Brüt)',t:'num',req:1,ph:'165'},{k:'net',l:'m² (Net)',t:'num',ph:'140'},
    {k:'oda',l:'Oda Sayısı',t:'sel',o:['1+0','1+1','2+1','3+1','3+2','4+1','4+2','5+1','5+2','6+']},
    {k:'yas',l:'Bina Yaşı',t:'sel',o:['0 (Sıfır)','1-5','5-10','11-15','16-20','21+']},
    {k:'kat',l:'Bulunduğu Kat',t:'sel',o:['Bodrum','Zemin','Bahçe Katı','1','2','3','4','5','6-10','11-20','Çatı Katı','Dubleks']},
    {k:'katSayisi',l:'Kat Sayısı',t:'sel',o:['1','2','3','4','5','6-10','11-20','20+']},
    {k:'isitma',l:'Isıtma',t:'sel',o:['Kombi (Doğalgaz)','Merkezi','Merkezi (Pay Ölçer)','Yerden Isıtma','Klima','Soba','Yok']},
    {k:'banyo',l:'Banyo Sayısı',t:'sel',o:['1','2','3','4+']},
    {k:'mutfak',l:'Mutfak',t:'sel',o:['Açık (Amerikan)','Kapalı']},
    {k:'balkon',l:'Balkon',t:'sel',o:['Var','Yok']},{k:'asansor',l:'Asansör',t:'sel',o:['Var','Yok']},
    {k:'otopark',l:'Otopark',t:'sel',o:['Açık Otopark','Kapalı Otopark','Açık & Kapalı','Yok']},
    {k:'esyali',l:'Eşyalı',t:'sel',o:['Hayır','Evet']},
    {k:'kullanim',l:'Kullanım Durumu',t:'sel',o:['Boş','Kiracılı','Mülk Sahibi Oturuyor']},
    {k:'site',l:'Site İçerisinde',t:'sel',o:['Hayır','Evet']},{k:'aidat',l:'Aidat (₺)',t:'num',ph:'1500'},
    {k:'kredi',l:'Krediye Uygun',t:'sel',o:['Evet','Hayır','Bilinmiyor']},
    {k:'tapu',l:'Tapu Durumu',t:'sel',o:['Kat Mülkiyetli','Kat İrtifaklı','Hisseli Tapu','Arsa Tapulu']},
    {k:'takas',l:'Takas',t:'sel',o:['Hayır','Evet']}
  ];
  var _ISYERI=[
    {k:'m2',l:'m² (Brüt)',t:'num',req:1},{k:'net',l:'m² (Net)',t:'num'},
    {k:'oda',l:'Bölüm / Oda Sayısı',t:'sel',o:['Açık Ofis','1','2','3','4','5+']},
    {k:'yas',l:'Bina Yaşı',t:'sel',o:['0 (Sıfır)','1-5','5-10','11-15','16+']},
    {k:'kat',l:'Bulunduğu Kat',t:'sel',o:['Bodrum','Zemin','1','2','3','4','5','6-10','11+']},
    {k:'isitma',l:'Isıtma',t:'sel',o:['Merkezi','Klima','VRV Sistem','Kombi (Doğalgaz)','Yok']},
    {k:'aidat',l:'Aidat (₺)',t:'num'},{k:'depozito',l:'Depozito (₺)',t:'num'},
    {k:'kullanim',l:'Kullanım Durumu',t:'sel',o:['Boş','Kiracılı']},
    {k:'kredi',l:'Krediye Uygun',t:'sel',o:['Evet','Hayır']},
    {k:'tapu',l:'Tapu Durumu',t:'sel',o:['Kat Mülkiyetli','Kat İrtifaklı','Hisseli Tapu']}
  ];
  var _ARSA=[
    {k:'m2',l:'m²',t:'num',req:1,ph:'640'},
    {k:'imar',l:'İmar Durumu',t:'sel',o:['Konut','Ticari','Villa','Sanayi','Turizm','Tarla','Bağ-Bahçe','İmarsız']},
    {k:'ada',l:'Ada No',t:'text',req:1,ph:'1234'},{k:'parsel',l:'Parsel No',t:'text',req:1,ph:'56'},{k:'pafta',l:'Pafta No',t:'text'},
    {k:'kaks',l:'Kaks (Emsal)',t:'sel',o:['0.10','0.20','0.30','0.50','1.00','1.50','2.00','Belirsiz']},
    {k:'gabari',l:'Gabari (Yükseklik)',t:'sel',o:['3.50 m','6.50 m','9.50 m','12.50 m','15.50 m','Serbest']},
    {k:'tapu',l:'Tapu Durumu',t:'sel',o:['Müstakil Parsel','Hisseli Tapu','Kat İrtifakı','Tahsis']},
    {k:'kredi',l:'Krediye Uygun',t:'sel',o:['Evet','Hayır']},{k:'takas',l:'Takas',t:'sel',o:['Hayır','Evet']}
  ];
  L.attrSchema=function(cat){ if(cat==='arsa')return _ARSA; if(cat==='ofis'||cat==='dukkan'||cat==='bina'||cat==='insaat')return _ISYERI; return _KONUT; };
  L.FEAT_GROUPS={
    'Cephe / Manzara':['Deniz Manzarası','Boğaz Manzarası','Şehir Manzarası','Doğa Manzarası','Göl Manzarası','Güney Cephe','Doğu Cephe','Batı Cephe'],
    'İç Özellikler':['Ankastre Mutfak','Ebeveyn Banyolu','Giyinme Odası','Şömine','Amerikan Mutfak','Parke Zemin','Kartonpiyer','Duşakabin','Küvet','Beyaz Eşyalı','Gömme Dolap'],
    'Dış / Site':['Yüzme Havuzu','Kapalı Otopark','7/24 Güvenlik','Kamera Sistemi','Spor Salonu','Çocuk Parkı','Bahçe','Teras','Asansör','Jeneratör','Sauna'],
    'Konum':['Metroya Yakın','Denize Yakın','Okula Yakın','AVM Yakını','Merkezi Konum','Hastaneye Yakın']
  };
  L.chipT=function(b){ if(b)b.classList.toggle('on'); };
  L.attrFormHTML=function(cat,attrs,feats){ attrs=attrs||{}; feats=feats||[]; var sch=L.attrSchema(cat);
    var fields=sch.map(function(f){ var val=(attrs[f.k]!=null?attrs[f.k]:''); var inner;
      if(f.t==='sel'){ inner='<select data-at="'+f.k+'"><option value="">— Seçiniz —</option>'+f.o.map(function(o){return '<option'+(String(val)===o?' selected':'')+'>'+esc(o)+'</option>';}).join('')+'</select>'; }
      else { inner='<input data-at="'+f.k+'" type="'+(f.t==='num'?'number':'text')+'" value="'+esc(val)+'" placeholder="'+esc(f.ph||'')+'">'; }
      return '<div class="at-f'+(f.req?' req':'')+'"><label>'+esc(f.l)+(f.req?' <span class="at-req">*</span>':'')+'</label>'+inner+'</div>';
    }).join('');
    var chipHtml=''; for(var grp in L.FEAT_GROUPS){ chipHtml+='<div class="at-chipgrp"><span class="at-chipgrp-l">'+esc(grp)+'</span><div class="at-chips">'+L.FEAT_GROUPS[grp].map(function(c){var on=feats.indexOf(c)>=0;return '<button type="button" class="at-chip'+(on?' on':'')+'" data-chip="'+esc(c)+'" onclick="Listings.chipT(this)">'+esc(c)+'</button>';}).join('')+'</div></div>'; }
    return '<div class="at-form"><div class="at-grid">'+fields+'</div>'
      +'<div class="at-feats"><div class="at-feats-h">✨ Özellikler <span class="at-muted">(tıklayarak seçin — yazmaya gerek yok)</span></div>'+chipHtml+'</div></div>';
  };
  L.readAttrForm=function(root){ root=root||document; var out={},feats=[];
    [].forEach.call(root.querySelectorAll('[data-at]'),function(e){var k=e.getAttribute('data-at');var v=(e.value||'').trim();if(v)out[k]=v;});
    [].forEach.call(root.querySelectorAll('.at-chip.on'),function(c){feats.push(c.getAttribute('data-chip'));});
    return {attrs:out, features:feats};
  };

  /* ---- ÜYE FAVORİ (site-başı localStorage; kalp) ---- */
  function _favKey(ns){return (ns||'lst')+'_favs';}
  L.favs=function(ns){
    /* Hesap-senkron kancası: üyelik katmanı tanımlıysa favoriler hesaptan okunur (misafirde null → yerel) */
    try{if(window.GM_FAV_READ){var r=window.GM_FAV_READ(ns);if(r)return r.slice();}}catch(e){}
    try{return JSON.parse(localStorage.getItem(_favKey(ns))||'[]')||[];}catch(e){return [];} };
  L.isFav=function(ns,id){ return L.favs(ns).indexOf(''+id)>=0; };
  L.toggleFav=function(ns,id,btn,ev){ if(ev&&ev.stopPropagation)ev.stopPropagation(); id=''+id; var f=L.favs(ns); var i=f.indexOf(id); var on; if(i>=0){f.splice(i,1);on=false;}else{f.unshift(id);on=true;} try{localStorage.setItem(_favKey(ns),JSON.stringify(f.slice(0,300)));}catch(e){}
    try{if(window.GM_FAV_SYNC)window.GM_FAV_SYNC(ns,f.slice(0,300));}catch(e){}
    try{[].forEach.call(document.querySelectorAll('.lst-fav[data-fid="'+id+'"]'),function(b){b.classList.toggle('on',on);b.innerHTML=on?'♥':'♡';});}catch(e){}
    try{[].forEach.call(document.querySelectorAll('.lst-favline[data-fid="'+id+'"]'),function(b){b.classList.toggle('on',on);b.innerHTML=on?'♥ Favorilerimde':'♡ Favorilere Ekle';});}catch(e){}
    var c=L._reg[ns]; if(c&&c.onFav){try{c.onFav(id,on);}catch(e){}} return on; };
  function _cmpCardBtn(l,cfg){ if(!(L._extToggleCmp))return ''; var ns=cfg.ns||''; var on=!!(L._extHasCmp&&L._extHasCmp(ns,l.id));
    return '<button type="button" class="lst-cmpc'+(on?' on':'')+'" data-cid="'+esc(l.id)+'" title="'+(on?'Karşılaştırmadan çıkar':'Karşılaştırmaya ekle')+'" aria-label="Karşılaştır" onclick="Listings._extToggleCmp(\''+esc(ns)+'\',\''+esc(l.id)+'\',this,event)">⇄</button>'; }
  function _favBtn(l,cfg){ var ns=cfg.ns||''; var on=L.isFav(ns,l.id); return '<button type="button" class="lst-fav'+(on?' on':'')+'" data-fid="'+esc(l.id)+'" title="Favorilere ekle" aria-label="Favori" onclick="Listings.toggleFav(\''+esc(ns)+'\',\''+esc(l.id)+'\',this,event)">'+(on?'♥':'♡')+'</button>'; }

  /* ---- AI BAŞLIK (admin) ---- */
  L.aiTitle=async function(f,aiFn){ f=f||{}; if(typeof aiFn!=='function')return null;
    var loc=[f.mah,f.ilce,f.il].filter(Boolean).join(', ');
    var p='Sahibinden tarzında, kısa, dikkat çekici ve SEO uyumlu TEK bir Türkçe emlak ilan başlığı yaz (EN FAZLA 60 karakter). Abartma/uydurma yapma. SADECE başlığı döndür, tırnak/etiket ekleme.\n'
      +'Bilgiler: '+[f.op,f.type,(f.oda?f.oda:''),(f.m2?f.m2+' m²':''),loc].filter(Boolean).join(' · ');
    var r; try{ r=await aiFn({prompt:p,message:p,persona:'office',tool:'ilan-baslik',max_tokens:60}); }catch(e){ return null; }
    var t=r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))); if(r&&r.fallback)t=null;
    if(!t)return null; return (''+t).replace(/^["'#\s]+|["'\s]+$/g,'').split('\n')[0].slice(0,70).trim();
  };

  /* ---- EİDS YAYIN KAPISI ---- */
  L.canPublish=function(l){return _canPub(l);};
  L.publicList=function(arr){ return (arr||[]).filter(function(l){
    if(!l)return false;
    if(_canPub(l))return true;                                   /* OFFICIAL_LISTING: gerçek EİDS doğrulaması */
    return window.EMLAK_DEMO!==false&&_isDemoRec(l);             /* DEMO sınıfı yalnız demo ortamında görünür (üretim paketi her sayfada false tanımlar) */
  }); };
  L.pendingList=function(arr){ return (arr||[]).filter(function(l){return l&&!_canPub(l);}); };

  /* ---- yardımcı parçalar ---- */
  function _loc(l){ return [l.mah,l.ilce,l.il].filter(Boolean).join(' · '); }
  function _cover(l){ var im=_arr(l.images); return im.length?im[0]:(l.img||l.cover||''); }
  function _specsOf(l){
    if(Array.isArray(l.specs)&&l.specs.length)return l.specs.filter(function(s){return s&&s.v;});
    var out=[];
    if(l.m2)out.push({k:'Brüt m²',v:l.m2});
    if(l.net)out.push({k:'Net m²',v:l.net});
    if(l.oda)out.push({k:'Oda',v:l.oda});
    if(l.kat!=null&&l.kat!=='')out.push({k:'Kat',v:l.kat});
    if(l.bina)out.push({k:'Bina Yaşı',v:l.bina});
    if(l.isitma)out.push({k:'Isıtma',v:l.isitma});
    if(l.cephe)out.push({k:'Cephe',v:l.cephe});
    if(l.durum)out.push({k:'Durum',v:l.durum});
    return out;
  }
  function _badge(l){ try{ return (window.EIDS&&EIDS.badgeHTML)?EIDS.badgeHTML(l.eids):''; }catch(e){ return ''; } }
  function _opClass(op){ op=(''+(op||'')).toLocaleLowerCase('tr'); return /kiral/.test(op)?'rent':/proje/.test(op)?'proj':'sale'; }

  function _waHref(cfg,l){ var wa=((cfg.whatsapp&&cfg.whatsapp())||'').replace(/[^\d]/g,''); if(!wa)return ''; return 'https://wa.me/'+wa+'?text='+encodeURIComponent((l.title||'İlan')+((_loc(l))?(' ('+_loc(l)+')'):'')+' ilanı hakkında bilgi almak istiyorum.'); }
  function _telHref(cfg){ var p=((cfg.phone&&cfg.phone())||'').replace(/[^\d+]/g,''); return p?('tel:'+p):''; }

  /* ---- PROFESYONEL KART (görsel + WhatsApp/Ara hızlı iletişim) ---- */
  L.cardHTML=function(l,cfg){
    cfg=cfg||{}; var cov=_cover(l); var specs=_specsOf(l).slice(0,3);
    var _tl=function(n){return (''+(n||0)).replace(/\B(?=(\d{3})+(?!\d))/g,'.');};
    var _dt=function(s){if(!s)return '';var p=(''+s).split('-');return p.length===3?(p[2]+'.'+p[1]+'.'+p[0]):(''+s);};
    var open=(cfg.onOpen||cfg.ns)?('Listings._open(\''+esc(cfg.ns||'')+'\',\''+esc(l.id)+'\')'):'';
    var wa=_waHref(cfg,l), tel=_telHref(cfg);
    var cta=(open||wa||tel)?('<div class="lst-cta">'
      +(open?'<button type="button" class="lst-inc" onclick="event.stopPropagation();'+open+'">İncele <span aria-hidden="true">→</span></button>':'')
      +((wa||tel)?('<div class="lst-cta2">'
      +(wa?'<a class="lst-cta-b lstwa" href="'+esc(wa)+'" target="_blank" rel="noopener noreferrer" onclick="event.stopPropagation()"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4-.1.6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6-.1 1.2Z"/></svg> WhatsApp</a>':'')
      +(tel?'<a class="lst-cta-b tel" href="'+esc(tel)+'" onclick="event.stopPropagation()"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg> Ara</a>':'')
      +'</div>'):'')
      +'</div>'):'';
    return '<article class="lst-card" '+(open?('tabindex="0" role="button" aria-label="'+esc((l.title||'İlan')+(l.priceText?(' — '+l.priceText):''))+'" onclick="'+open+'" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();'+open+'}"'):'')+'>'
      +'<div class="lst-ph">'+(cov?'<img src="'+esc(cov)+'" alt="'+esc(l.title||'')+'" loading="lazy" decoding="async" onerror="this.style.display=\'none\';this.parentNode.classList.add(\'noimg\')">':'')+'<span class="lst-ph-x">🏢</span>'
        +'<span class="lst-op '+_opClass(l.op)+'">'+esc(l.op||'Satılık')+'</span>'
        +_favBtn(l,cfg)+_cmpCardBtn(l,cfg)
        +(_canPub(l)?'<span class="lst-eids-mini" title="EİDS Doğrulandı">'+(window.EIDS&&EIDS.shield?EIDS.shield(12):'')+' EİDS</span>'
          :_isDemoRec(l)?'<span class="lst-eids-mini lst-demo-mini" title="DEMO ÖZEL PORTFÖY — ProX piyasa verileriyle oluşturulmuş tanıtım senaryosudur. Gerçek ilan veya EİDS doğrulanmış taşınmaz kaydı değildir.">DEMO</span>':'')
        +(_arr(l.images).length>1?'<span class="lst-count">📷 '+_arr(l.images).length+'</span>':'')
      +'</div>'
      +'<div class="lst-body">'
        +'<div class="lst-loc"><span class="lst-cat">'+esc(l.type||L.catLabel(l))+'</span> · 📍 '+esc(_loc(l)||'—')+'</div>'
        +'<h3 class="lst-title">'+esc(l.title||'')+'</h3>'
        +'<div class="lst-chips">'+specs.map(function(s){var v=esc(s.v)+((/m²/.test(s.k)&&!/m²/.test(''+s.v))?' m²':'');return '<span>'+v+'</span>';}).join('')+'</div>'
        +((l.endeks||l.skor)?('<div class="lst-data">'+(l.endeks?'<span class="lst-endeks" title="'+esc((l.ilce||'')+' bölge m² ortalaması — ProX endeksi')+'">📊 Bölge ort. '+_tl(l.endeks)+' ₺/m²</span>':'')+(l.skor?'<span class="lst-skor" title="Bölge yatırım skoru (0-100)">⭐ Yatırım '+esc(l.skor)+'</span>':'')+'</div>'):'')
        +'<div class="lst-foot"><span class="lst-priceblk"><span class="lst-price">'+esc(l.priceText||l.price||'')+'</span>'+(l.ppm?'<span class="lst-ppm">'+_tl(l.ppm)+' ₺/m²</span>':'')+'</span><span class="lst-go" aria-hidden="true">→</span></div>'
        +((l.ilanNo||l.tarih)?('<div class="lst-meta">'+(l.ilanNo?'<span>İlan No: '+esc(l.ilanNo)+'</span>':'')+(l.tarih?'<span>📅 '+esc(_dt(l.tarih))+'</span>':'')+'</div>'):'')
        +cta
      +'</div></article>';
  };

  /* ---- GALERİ ---- */
  function _galleryHTML(l){
    /* medya-entegre galeri (video+360 tur+kat planı galeri öğesi olarak) — listing-extras.js */
    if(L._extGallery){try{var _g=L._extGallery(l);if(_g)return _g;}catch(e){}}
    var im=_arr(l.images); if(!im.length)return '<div class="lstd-cover lstd-empty"><span>🏢</span></div>';
    var main='<div class="lstd-cover" onclick="if(Listings._extLightbox)Listings._extLightbox(Listings._lbIdx||0)" style="cursor:zoom-in"><img id="lstdMain" src="'+esc(im[0])+'" alt="'+esc(l.title||'')+'" onerror="this.style.display=\'none\'"><span class="lstd-zoom" aria-hidden="true">⛶</span></div>';
    var thumbs=im.length>1?('<div class="lstd-thumbs">'+im.map(function(u,i){return '<button type="button" class="lstd-th'+(i===0?' on':'')+'" aria-label="Fotoğraf '+(i+1)+'" onclick="Listings._pick(this,\''+esc(u)+'\')"><img src="'+esc(u)+'" alt="" loading="lazy"></button>';}).join('')+'</div>'):'';
    return main+thumbs;
  }
  L._pick=function(btn,u){ var m=document.getElementById('lstdMain'); if(m)m.src=u; try{var p=btn.parentNode;var ths=[].slice.call(p.querySelectorAll('.lstd-th'));ths.forEach(function(b,i){b.classList.toggle('on',b===btn);if(b===btn)L._lbIdx=i;});}catch(e){} };

  /* ---- KAPSAMLI DETAY İÇERİĞİ (site chrome'una sarılır) ---- */
  function _agentCard(cfg,l){
    var a=(cfg.agent&&cfg.agent(l))||null; if(!a||!a.name)return '';
    var initials=(a.name||'').trim().split(/\s+/).map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();
    var ph=a.photo?('<img src="'+esc(a.photo)+'" alt="'+esc(a.name)+'" onerror="this.style.display=\'none\';this.parentNode.classList.add(\'noimg\')"><span class="lstd-ag-ini">'+esc(initials)+'</span>')
      :('<span class="lstd-ag-ini">'+esc(initials)+'</span>');
    return '<div class="lstd-agent">'
      +'<div class="lstd-ag-ph'+(a.photo?'':' noimg')+'">'+ph+'</div>'
      +'<div class="lstd-ag-info"><b>'+esc(a.name)+'</b>'
        +(a.title?'<span class="lstd-ag-title">'+esc(a.title)+'</span>':'')
        +(a.experience?'<span class="lstd-ag-exp">⭐ '+esc(a.experience)+' yıl tecrübe</span>':'')
      +'</div></div>';
  }
  L.detailInnerHTML=function(l,cfg){
    cfg=cfg||{}; L._cur=l; L._curCfg=cfg; try{L.applyListingSEO(l,cfg);}catch(e){} var specs=_specsOf(l); var feats=_arr(l.features);
    var brand=(cfg.brand&&cfg.brand())||''; var wa=_waHref(cfg,l), tel=_telHref(cfg);
    var desc=String(l.desc||l.aciklama||'').split(/\n{2,}/).map(function(p){return '<p>'+esc(p).replace(/\n/g,'<br>')+'</p>';}).join('')||'<p class="lstd-muted">Bu ilan için detaylı açıklama yakında eklenecek.</p>';
    var mapQ=(cfg.mapQuery&&cfg.mapQuery(l))||[l.mah,l.ilce,l.il].filter(Boolean).join(', ');
    var agent=_agentCard(cfg,l);
    var h='<div class="lstd">'
      +'<div class="lstd-head"><div><span class="lst-op '+_opClass(l.op)+'">'+esc(l.op||'Satılık')+'</span>'
        +(l.type?' <span class="lstd-type">'+esc(l.type)+'</span>':'')+'</div>'
        +'<h1 class="lstd-title">'+esc(l.title||'')+'</h1>'
        +'<div class="lstd-loc">📍 '+esc(_loc(l)||l.address||'—')+'</div>'
        +(L._extMeta?L._extMeta(l,cfg):'')+'</div>'
      +'<div class="lstd-grid">'
        +'<div class="lstd-main">'+_galleryHTML(l)
          +(L._extMedia?L._extMedia(l,cfg):'')
          +'<div class="lstd-price-m">'+esc(l.priceText||l.price||'')+'</div>'
          +(specs.length?('<div class="lstd-section"><div class="lstd-specs">'+specs.slice(0,4).map(function(s){return '<div class="lstd-spec"><span class="k">'+esc(s.k)+'</span><span class="v">'+esc(s.v)+'</span></div>';}).join('')+'</div></div>'):'')
          +'<div class="lstd-section"><h3>Açıklama</h3><div class="lstd-desc">'+desc+'</div></div>'
          +(function(){var A=L.detailAttrs(l);return A.length?('<div class="lstd-section"><h3>İlan Bilgileri</h3><table class="lstd-attrs"><tbody>'+A.map(function(x){return '<tr><td class="k">'+esc(x.k)+'</td><td class="v">'+esc(x.v)+'</td></tr>';}).join('')+'</tbody></table></div>'):'';})()
          +(feats.length?('<div class="lstd-section"><h3>Özellikler</h3><ul class="lstd-feats">'+feats.map(function(f){return '<li>'+esc(f)+'</li>';}).join('')+'</ul></div>'):'')
          +(mapQ?('<div class="lstd-section"><h3>Konum</h3><div class="lstd-map"><div class="lstd-map-el" id="lstdMap" data-q="'+esc(mapQ)+'"></div><div class="lstd-map-cap">📍 '+esc(mapQ)+'</div></div></div>'):'')
          +(L._extAfterMain?L._extAfterMain(l,cfg):'')
        +'</div>'
        +'<aside class="lstd-side">'
          +'<div class="lstd-card">'
            +'<div class="lstd-price">'+esc(l.priceText||l.price||'')+'</div>'
            +'<div class="lstd-eids-row">'+_badge(l)+'</div>'   /* TEK EİDS göstergesi */
            +(L._extEnergy?L._extEnergy(l):'')
            +(agent||(brand?'<div class="lstd-brand">'+esc(brand)+'</div>':''))
            +'<button type="button" id="lstdApptBtn" class="lstd-btn pri" onclick="Listings._randevu(\''+esc(cfg.ns||'')+'\',\''+esc(l.id)+'\')"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg> Randevu Al</button>'
            +'<div class="lstd-appt" id="lstdAppt"></div>'
            +(tel?'<a class="lstd-btn tel" href="'+esc(tel)+'"><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.7 2.7a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.4-1.2a2 2 0 0 1 2.1-.5c.9.4 1.8.6 2.7.7a2 2 0 0 1 1.7 2Z"/></svg> Ara</a>':'')
            +(wa?'<a class="lstd-btn lstwa" href="'+esc(wa)+'" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4-.1.6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6-.1 1.2Z"/></svg> WhatsApp\'tan Yaz</a>':'')
            +'<button type="button" class="lstd-btn lst-favline'+(L.isFav(cfg.ns,l.id)?' on':'')+'" data-fid="'+esc(l.id)+'" onclick="Listings.toggleFav(\''+esc(cfg.ns||'')+'\',\''+esc(l.id)+'\',this,event)">'+(L.isFav(cfg.ns,l.id)?'♥ Favorilerimde':'♡ Favorilere Ekle')+'</button>'
            +(L._extSideBtns?L._extSideBtns(l,cfg):'')
            +'<div class="lstd-share"><span class="lstd-share-l">Bu ilanı paylaş</span><div class="lstd-share-b">'
              +'<button type="button" title="WhatsApp" class="lstwa" onclick="Listings.share(\'whatsapp\',this)"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.6-.6-2.8-1.2-4.6-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8 0-1.3.7-2 .9-2.2.2-.3.5-.3.7-.3h.5c.2 0 .4-.1.6.5l.8 1.9c.1.1.1.3 0 .5l-.4.5-.3.3c-.1.1-.3.3-.1.6.2.3.8 1.3 1.7 2.1 1.2 1 2.1 1.4 2.4 1.5.3.1.5.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.2.1.4.2.4.3.1.1.1.6-.1 1.2Z"/></svg></button>'
              +'<button type="button" title="X" class="x" onclick="Listings.share(\'x\',this)"><svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"/></svg></button>'
              +'<button type="button" title="Facebook" class="fb" onclick="Listings.share(\'facebook\',this)"><svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg></button>'
              +'<button type="button" title="Bağlantıyı kopyala" class="cp" onclick="Listings.share(\'copy\',this)"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg></button>'
            +'</div></div>'
          +'</div>'
          +'<div class="lstd-note">'+(window.EIDS&&EIDS.shield?EIDS.shield(13):'')+' Yalnızca <b>EİDS</b> doğrulanmış ilanlar yayınlanır.</div>'
        +'</aside>'
      +'</div></div>';
    return h;
  };
  /* Sosyal medya paylaşımı — ilana özel görsel + açıklama */
  L._cur=null; L._curCfg=null;
  L.share=function(net,btn){ var l=L._cur; if(!l)return; var cfg=L._curCfg||{};
    var url=location.origin+location.pathname+'#ilan-'+encodeURIComponent(l.id);
    var img=_cover(l)?(location.origin+'/'+String(_cover(l)).replace(/^\//,'')):'';
    var txt=(l.title||'İlan')+' — '+(l.priceText||l.price||'')+' · '+(_loc(l)||'')+((cfg.brand&&cfg.brand())?(' | '+cfg.brand()):'');
    var u=encodeURIComponent(url), t=encodeURIComponent(txt);
    var m={ whatsapp:'https://wa.me/?text='+t+'%20'+u, x:'https://twitter.com/intent/tweet?text='+t+'&url='+u, facebook:'https://www.facebook.com/sharer/sharer.php?u='+u };
    if(net==='copy'){ try{navigator.clipboard.writeText(txt+'\n'+url+(img?('\n'+img):''));}catch(e){} if(btn){var _o=btn.getAttribute('title');btn.classList.add('done');btn.setAttribute('title','Kopyalandı ✓');setTimeout(function(){btn.classList.remove('done');btn.setAttribute('title',_o||'');},1600);} return; }
    if(m[net]){try{window.open(m[net],'_blank','noopener,width=640,height=560');}catch(e){location.href=m[net];}}
  };

  /* ---- AI DESTEKLİ İLAN AÇIKLAMASI (admin) — sitenin İçerik Ajanı motorunu kullanır ---- */
  L.aiDescribe=async function(f,aiFn){ f=f||{}; if(typeof aiFn!=='function')return null;
    var specs=[]; if(f.type)specs.push(f.type); if(f.op)specs.push(f.op);
    if(f.m2)specs.push(f.m2+' m²'); if(f.oda)specs.push(f.oda+((''+f.oda).match(/oda|\+/i)?'':' oda')); if(f.kat)specs.push('Kat: '+f.kat);
    if(f.isitma)specs.push(f.isitma); if(f.cephe)specs.push(f.cephe+' cephe');
    var loc=[f.mah,f.ilce,f.il].filter(Boolean).join(', ');
    var feats=(f.features&&f.features.length)?('Öne çıkan özellikler: '+f.features.join(', ')+'. '):'';
    var p='Sen üst düzey bir Türk emlak/gayrimenkul ilan metni yazarısın. Aşağıdaki ilan için alıcıyı ikna eden, akıcı ve doğal Türkçe, 90-150 kelimelik PROFESYONEL bir ilan açıklaması yaz. '
      +'KURALLAR: kesin fiyat veya garanti getiri UYDURMA; abartılı/doğrulanamaz iddia (en iyi/tek/lider) kullanma; yalnızca verilen bilgilere ve bölgenin genel avantajlarına dayan. Selamlama, başlık, etiket veya "Açıklama:" YAZMA — sadece açıklama paragrafını döndür.\n\n'
      +'İLAN: '+(f.title||'')+'\n'+(loc?('Konum: '+loc+'\n'):'')+(specs.length?('Nitelikler: '+specs.join(' · ')+'\n'):'')+feats+(f.extra?('Ek bilgi: '+f.extra+'\n'):'');
    var r; try{ r=await aiFn({prompt:p,message:p,persona:'office',tool:'ilan',max_tokens:600}); }catch(e){ return null; }
    var t=r&&(r.answer||r.text||(r.data&&(r.data.answer||r.data.text))); if(r&&r.fallback)t=null;
    if(!t)return null;
    return (''+t).replace(/^["'#\s]*(açıklama|ilan açıklaması|başlık)\s*[:\-]\s*/i,'').trim();
  };

  /* ---- SEO / AEO / GEO — ilana özel JSON-LD + meta (detay açılınca) ---- */
  L.applyListingSEO=function(l,cfg){ try{ if(!l)return; cfg=cfg||{};
    var brand=(cfg.brand&&cfg.brand())||''; var loc=_loc(l)||l.address||'';
    var title=(l.title||'İlan')+(loc?(' · '+loc):'')+(brand?(' | '+brand):'');
    document.title=title;
    var desc=(''+(l.desc||l.sum||'')).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim().slice(0,160)||((l.title||'')+' — '+loc);
    var setMeta=function(sel,val){var m=document.querySelector(sel);if(!m){m=document.createElement('meta');var kv=sel.match(/\[(name|property)="([^"]+)"\]/);if(kv)m.setAttribute(kv[1],kv[2]);document.head.appendChild(m);}m.setAttribute('content',val);};
    setMeta('meta[name="description"]',desc); setMeta('meta[property="og:title"]',title); setMeta('meta[property="og:description"]',desc); setMeta('meta[property="og:type"]','website');
    var cov=_cover(l); if(cov){setMeta('meta[property="og:image"]',cov);setMeta('meta[name="twitter:image"]',cov);}
    /* DEMO sınıfı RealEstateListing şemasıyla İŞARETLENEMEZ — varsa eski LD temizlenir, yenisi basılmaz. */
    if(_isDemoRec(l)){ try{var old=document.getElementById('lst-ld');if(old)old.textContent='';}catch(e){} return; }
    var price=parseInt((''+(l.priceText||l.price||'')).replace(/[^\d]/g,''),10)||undefined;
    var ld={"@context":"https://schema.org","@type":"RealEstateListing","name":(l.title||''),"description":desc,"url":location.href};
    if(cov)ld.image=_arr(l.images).slice(0,4);
    if(l.date)ld.datePosted=l.date;
    if(price)ld.offers={"@type":"Offer","price":price,"priceCurrency":"TRY","availability":"https://schema.org/InStock"};
    ld.about={"@type":"Residence","name":(l.title||''),"address":{"@type":"PostalAddress","streetAddress":(l.mah||''),"addressLocality":(l.ilce||''),"addressRegion":(l.il||'İstanbul'),"addressCountry":"TR"}};
    if(brand)ld.provider={"@type":"RealEstateAgent","name":brand};
    var s=document.getElementById('lst-ld'); if(!s){s=document.createElement('script');s.type='application/ld+json';s.id='lst-ld';document.head.appendChild(s);} s.textContent=JSON.stringify(ld);
  }catch(e){} };

  /* ---- DEMO sınıfı EİDS alanı: 'demo' durumu — EİDS rozeti/kodu ASLA üretilmez ---- */
  L.demoEids=function(){ try{ if(window.EIDS&&EIDS.demoRecord)return EIDS.demoRecord(); }catch(e){}
    return {status:'demo',listing_kind:'demo_private_portfolio',referans:'',tarih:'',mesaj:'Demo tanıtım kaydı — EİDS doğrulaması yapılmaz, gerçek Bakanlık kodu üretilmez. Gerçek ilan değildir.'}; };
  L.pendingEids=function(f){ try{ return (window.EIDS&&EIDS.newRecord)?EIDS.newRecord(f||{}):{status:'beklemede'}; }catch(e){ return {status:'beklemede'}; } };

  /* ---- site kaydı: kart tıklaması/CTA'yı doğru siteye yönlendir ---- */
  L._reg={};
  L.register=function(ns,cfg){ cfg=cfg||{}; cfg.ns=ns; L._reg[ns]=cfg; return cfg; };
  L._open=function(ns,id){ var c=L._reg[ns]; if(!c)return; if(c.onOpen)c.onOpen(id); else L.openDetail(ns,id); };
  L._contact=function(ns,id){ var c=L._reg[ns]; if(c&&c.onContact)c.onContact(id); };
  /* ---- GERÇEK RANDEVU / BİLGİ TALEBİ (opt-in: cfg.appointment) ----
     Sadece cfg.appointment===true olan siteler satır-içi formu gösterir; diğerleri
     (danışman/insaat) eski _contact davranışına düşer → etkilenmez. Form gönderiminde
     cfg.onContact(id, data) çağrılır; data={name,phone,date,note,...}. */
  L._apptCss=function(){ try{ if(document.getElementById('lstApptCss'))return; var s=document.createElement('style'); s.id='lstApptCss';
    s.textContent='.lstd-appt-form{display:grid;gap:8px;margin-top:10px;padding:12px;border:1.5px solid var(--line,#e5e7eb);border-radius:12px;background:var(--surface,#f8fafc)}'
      +'.lstd-appt-t{font-weight:800;font-size:.875rem;color:var(--ink,#0f172a)}'
      +'.lstd-appt-i{width:100%;padding:9px 11px;border:1.5px solid var(--line,#e5e7eb);border-radius:9px;font-family:inherit;font-size:.875rem;color:var(--ink,#0f172a);background:#fff;box-sizing:border-box}'
      +'.lstd-appt-i:focus{outline:none;border-color:var(--accent,#1e40af)}'
      +'.lstd-appt-k{display:flex;gap:8px;align-items:flex-start;font-size:.75rem;color:var(--ink-2,#475569);line-height:1.4;cursor:pointer}'
      +'.lstd-appt-k input{margin-top:2px;flex:0 0 auto}'
      +'.lstd-appt-ok{margin-top:10px;padding:14px;border:1.5px solid var(--accent,#1e40af);border-radius:12px;background:var(--surface,#f8fafc);font-size:.875rem;color:var(--ink,#0f172a);line-height:1.5}';
    document.head.appendChild(s); }catch(e){} };
  L._randevu=function(ns,id){ var c=L._reg[ns]; if(!c)return;
    if(!c.appointment){ return L._contact(ns,id); }/* opt-in yoksa eski davranış */
    var box=document.getElementById('lstdAppt'); if(!box){ return L._contact(ns,id); }
    L._apptCss();
    var btn=document.getElementById('lstdApptBtn'); if(btn)btn.style.display='none';
    box.innerHTML=''
      +'<form class="lstd-appt-form" onsubmit="return Listings._randevuSubmit(\''+esc(ns)+'\',\''+esc(id)+'\')">'
      +'<div class="lstd-appt-t">Randevu / Bilgi Talebi</div>'
      +'<input class="lstd-appt-i" id="lstAp_name" type="text" placeholder="Ad Soyad *" aria-label="Ad Soyad" autocomplete="name" required aria-required="true">'
      +'<input class="lstd-appt-i" id="lstAp_phone" type="tel" placeholder="Telefon *" aria-label="Telefon" autocomplete="tel" required aria-required="true">'
      +'<input class="lstd-appt-i" id="lstAp_date" type="date" aria-label="Tercih edilen tarih">'
      +'<textarea class="lstd-appt-i" id="lstAp_note" rows="2" placeholder="Not (isteğe bağlı)" aria-label="Not"></textarea>'
      +'<label class="lstd-appt-k"><input type="checkbox" id="lstAp_kvkk"> <span>KVKK kapsamında tarafımla iletişim kurulmasını onaylıyorum.</span></label>'
      +'<button type="submit" class="lstd-btn pri">Talebi Gönder</button>'
      +'</form>';
    try{var e=document.getElementById('lstAp_name');if(e)e.focus();}catch(e){}
  };
  L._randevuSubmit=function(ns,id){ try{
    var c=L._reg[ns]||{}; var l=L._cur||{};
    var g=function(x){var e=document.getElementById(x);return e?(''+(e.value||'')).trim():'';};
    var name=g('lstAp_name'), phone=g('lstAp_phone'), date=g('lstAp_date'), note=g('lstAp_note');
    var kv=document.getElementById('lstAp_kvkk');
    if(!name||!phone){ try{if(typeof toast==='function')toast('Lütfen ad ve telefon girin.');}catch(e){} return false; }
    if(kv&&!kv.checked){ try{if(typeof toast==='function')toast('Lütfen KVKK onayını işaretleyin.');}catch(e){} return false; }
    var data={name:name,phone:phone,date:date,note:note,id:id,title:l.title||'',il:l.il||'',ilce:l.ilce||'',mah:l.mah||'',op:l.op||'',priceText:l.priceText||''};
    try{ if(typeof c.onContact==='function')c.onContact(id,data); }catch(e){}
    var box=document.getElementById('lstdAppt');
    if(box){ box.innerHTML='<div class="lstd-appt-ok"><b>✓ Talebiniz alındı.</b><br>'+esc(name)+', danışmanımız en kısa sürede sizinle iletişime geçecek'+(date?(' — tercih ettiğiniz tarih ('+esc(date)+') iletildi'):'')+'.</div>'; }
    return false;
  }catch(e){ return false; } };

  /* ---- GERÇEK KONUM HARİTASI (Nominatim geocode + OSM embed; dış JS YOK) ----
     Fare tekeri ile kaza zoom'u yok: harita "koruma" katmanıyla gelir; kullanıcı
     dokununca etkinleşir (pan + OSM'in +/- kontrolleri). Mobil dostu. */
  var _geoCache={};
  function _geocode(q,cb){ q=(''+(q||'')).trim(); if(!q)return cb(null); if(_geoCache[q]!==undefined)return cb(_geoCache[q]);
    try{ fetch('https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=tr&q='+encodeURIComponent(q),{headers:{'Accept':'application/json'}})
      .then(function(r){return r.ok?r.json():[];}).then(function(a){ var p=(a&&a[0])?{lat:+a[0].lat,lng:+a[0].lon}:null; _geoCache[q]=p; cb(p); }).catch(function(){cb(null);}); }catch(e){cb(null);}
  }
  L._mapOn=function(btn){ try{ var w=btn.closest('.lstd-map'); var g=w&&w.querySelector('.lstd-map-guard'); if(g)g.style.display='none'; }catch(e){} };
  function _osmEmbed(el,p){ var d=0.006; var bbox=(p.lng-d)+','+(p.lat-d)+','+(p.lng+d)+','+(p.lat+d);
    var src='https://www.openstreetmap.org/export/embed.html?bbox='+encodeURIComponent(bbox)+'&layer=mapnik&marker='+encodeURIComponent(p.lat+','+p.lng);
    el.innerHTML='<iframe title="Konum haritası" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+src+'" style="width:100%;height:100%;border:0"></iframe>'
      +'<div class="lstd-map-guard" onclick="Listings._mapOn(this)"><button type="button" onclick="Listings._mapOn(this)">🔍 Haritada gezmek için dokunun</button></div>';
  }
  L.mountMaps=function(){ var el=document.getElementById('lstdMap'); if(!el||el.getAttribute('data-mounted'))return; var q=el.getAttribute('data-q')||''; el.setAttribute('data-mounted','1');
    el.innerHTML='<div class="lstd-map-load">🗺️ Konum yükleniyor…</div>';
    _geocode(q,function(p){ _osmEmbed(el,p||{lat:41.0082,lng:28.9784}); });
  };

  /* Temiz, kendine-yeten YAPIŞKAN üst menü (site nav'ı klonlamak yerine — fixed-child'lı nav'lar bozuluyordu) */
  function _ovNav(cfg,l){
    var brand=(cfg.brand&&cfg.brand())||''; var wa=_waHref(cfg,l), tel=_telHref(cfg); var links='';
    try{ var raw=(cfg.navHTML&&cfg.navHTML())||''; if(raw){ var d=document.createElement('div'); d.innerHTML=raw; var seen={}, n=0;
      [].slice.call(d.querySelectorAll('a')).forEach(function(a){ var t=(a.textContent||'').replace(/\s+/g,' ').trim(); if(!t||t.length>22||n>=5||seen[t]||/giriş|üye|hesab|whatsapp|ProX Asistan|Ücretsiz/i.test(t))return; var href=a.getAttribute('href')||''; var real=/\.html|^https?:|^\//.test(href); seen[t]=1;n++; links+='<a href="'+esc(real?href:'javascript:void(0)')+'"'+(real?'':' onclick="Listings.closeDetail()"')+'>'+esc(t)+'</a>'; }); } }catch(e){}
    return '<header class="lstd-ovnav"><div class="lstd-ovnav-in">'
      +'<a class="lstd-ovbrand" href="javascript:void(0)" onclick="Listings.closeDetail()">'+(esc(brand)||'Geri')+'</a>'
      +'<nav class="lstd-ovlinks">'+links+'</nav>'
      +'<div class="lstd-ovcta">'+(tel?'<a href="'+esc(tel)+'" title="Ara" aria-label="Ara">📞</a>':'')+(wa?'<a href="'+esc(wa)+'" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp">💬</a>':'')+'<button type="button" class="lstd-ovx" onclick="Listings.closeDetail()" title="Kapat" aria-label="Kapat">✕</button></div>'
      +'</div></header>';
  }
  /* ---- TAM-CHROME DETAY OVERLAY (yapışkan üst menü + içerik + footer) ---- */
  L.openDetail=function(nsOrL,id){
    var cfg,l;
    if(typeof nsOrL==='string'){ cfg=L._reg[nsOrL]||{}; var arr=(cfg.list&&cfg.list())||[]; l=arr.filter(function(x){return String(x.id)===String(id);})[0]; }
    else { l=nsOrL; cfg=id||{}; }
    if(!l)return;
    L.injectCSS();
    /* SİTENİN GERÇEK üst menüsü + footer'ı (birebir) — cfg.navHTML/footerHTML gerçek header/footer'ı klonlar */
    var navHtml=(cfg.navHTML&&cfg.navHTML())||''; var foot=(cfg.footerHTML&&cfg.footerHTML())||'';
    var ov=document.getElementById('lstDetailOverlay');
    if(!ov){ ov=document.createElement('div'); ov.id='lstDetailOverlay'; ov.className='lstd-ov'; document.body.appendChild(ov); }
    var demoNote=_isDemoRec(l)?('<div class="lstd-demo-note" role="note"><b>DEMO ÖZEL PORTFÖY</b> — ProX piyasa verileriyle oluşturulmuş tanıtım senaryosudur. Gerçek ilan veya EİDS doğrulanmış taşınmaz kaydı değildir.</div>'):'';
    ov.innerHTML=(navHtml||_ovNav(cfg,l))
      +'<div class="lstd-ovwrap"><button type="button" class="lstd-back" onclick="Listings.closeDetail()">← Tüm ilanlar</button>'
      +demoNote+L.detailInnerHTML(l,cfg)+'</div>'+foot;
    ov.classList.add('on'); ov.scrollTop=0; try{document.body.style.overflow='hidden';}catch(e){}
    try{setTimeout(function(){L.mountMaps();},80);}catch(e){}
    try{if(L._extAfterOpen)setTimeout(function(){L._extAfterOpen(l,ov,cfg);},60);}catch(e){}
    /* gerçek header'daki bir bağlantıya/butona tıklanınca overlay'i kapat (site kendi sayfasına gitsin) */
    try{ var hdr=ov.firstElementChild; if(hdr&&hdr.addEventListener)hdr.addEventListener('click',function(ev){ var a=ev.target&&ev.target.closest&&ev.target.closest('a,button'); if(a&&!a.closest('.lstd-map'))setTimeout(L.closeDetail,60); }); }catch(e){}
    /* GÜVENLİK AĞI: gerçek header klonu 0-yükseklikte kaldıysa temiz bara düş */
    try{ if(navHtml)setTimeout(function(){ var f=ov.firstElementChild; if(f&&f.getBoundingClientRect().height<28){ var d=document.createElement('div'); d.innerHTML=_ovNav(cfg,l); if(d.firstChild){ov.insertBefore(d.firstChild,ov.firstChild); f.style.display='none';} } },90); }catch(e){}
    try{if(cfg.afterOpen)cfg.afterOpen(l,ov);}catch(e){}
  };
  L.closeDetail=function(){ var ov=document.getElementById('lstDetailOverlay'); if(ov){ov.classList.remove('on');ov.innerHTML='';} try{document.body.style.overflow='';}catch(e){} };

  /* ---- CSS (kurumsal renkleri --accent'ten miras alır) ---- */
  var _css=false;
  L.injectCSS=function(){
    if(_css||typeof document==='undefined')return; _css=true;
    try{if(window.EIDS&&EIDS.injectCSS)EIDS.injectCSS();}catch(e){}
    var A='var(--accent,#0e7c86)', INK='var(--ink,#12181f)', MUT='var(--muted,#6b7280)', SURF='var(--surface,#fff)', LINE='var(--line,#e6e8ec)', BG='var(--bg,#fff)';
    var css=''
    +'.lst-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:20px}'
    +'.lst-grid.home3{grid-template-columns:repeat(3,1fr)}'/* ana sayfa: 3×2 = 6 ilan simetrik */
    +'@media(max-width:980px){.lst-grid.home3{grid-template-columns:repeat(2,1fr)}}'
    +'@media(max-width:600px){.lst-grid,.lst-grid.home3{grid-template-columns:1fr}}'
    +'.lst-card{background:'+SURF+';border:1px solid '+LINE+';border-top:3px solid '+A+';border-radius:16px;overflow:hidden;cursor:pointer;transition:transform .18s,box-shadow .18s;display:flex;flex-direction:column}'
    +'.lst-card:hover{transform:translateY(-4px);box-shadow:0 14px 40px rgba(0,0,0,.13)}'
    +'.lst-card:focus-visible{outline:2px solid '+A+';outline-offset:2px}'
    +'.lst-ph{position:relative;height:150px;background:linear-gradient(135deg,rgba(0,0,0,.05),rgba(0,0,0,.12));overflow:hidden}'
    +'.lst-ph img{width:100%;height:100%;object-fit:cover;transition:transform .4s}.lst-card:hover .lst-ph img{transform:scale(1.06)}'
    +'.lst-ph-x{position:absolute;inset:0;display:grid;place-items:center;font-size:2.5rem;opacity:.4}'
    +'.lst-op{position:absolute;top:12px;left:12px;font-size:.71875rem;font-weight:800;letter-spacing:.02em;color:#fff;padding:5px 11px;border-radius:999px;text-transform:uppercase;box-shadow:0 2px 8px rgba(0,0,0,.2)}'
    +'.lst-op.sale{background:'+A+'}.lst-op.rent{background:#8a5a00}.lst-op.proj{background:#5b6470}'
    +'.lst-eids-mini{position:absolute;top:12px;right:12px;display:inline-flex;align-items:center;gap:4px;font-size:.65625rem;font-weight:800;color:#fff;background:rgba(15,122,61,.92);padding:4px 8px;border-radius:999px}'
    +'.lst-demo-mini{background:rgba(71,85,105,.92);letter-spacing:.6px}'
    +'.lstd-demo-note{margin:10px 0 14px;padding:10px 14px;border:1.5px dashed rgba(71,85,105,.45);border-radius:12px;background:rgba(100,116,139,.08);color:var(--muted,#475569);font-size:.8125rem;line-height:1.5}'
    +'.lst-count{position:absolute;bottom:12px;right:12px;font-size:.6875rem;font-weight:700;color:#fff;background:rgba(0,0,0,.55);padding:3px 9px;border-radius:999px}'
    +'.lst-body{padding:12px 14px 13px;display:flex;flex-direction:column;gap:6px;flex:1}'
    +'.lst-loc{font-size:.78125rem;color:'+MUT+';font-weight:600}'
    +'.lst-title{font-size:.90625rem;line-height:1.25;margin:0;color:'+INK+';font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}'
    +'.lst-chips{display:flex;flex-wrap:wrap;gap:7px;margin-top:2px}'
    +'.lst-chips span{font-size:.75rem;font-weight:700;color:'+INK+';background:rgba(0,0,0,.05);padding:4px 9px;border-radius:8px}.lst-chips i{font-style:normal;font-weight:500;color:'+MUT+'}'
    +'.lst-data{display:flex;flex-wrap:wrap;gap:6px}'
    +'.lst-endeks,.lst-skor{font-size:.6875rem;font-weight:700;padding:4px 8px;border-radius:7px;white-space:nowrap;font-variant-numeric:tabular-nums}'
    +'.lst-endeks{color:'+A+';background:color-mix(in srgb,'+A+' 9%,transparent);border:1px solid color-mix(in srgb,'+A+' 22%,transparent)}'
    +'.lst-skor{color:var(--success,#1e7e3a);background:var(--success-bg,rgba(30,126,58,.10));border:1px solid var(--success-line,rgba(30,126,58,.30))}'
    +'.lst-foot{display:flex;align-items:flex-end;justify-content:space-between;margin-top:auto;padding-top:10px;border-top:1px solid '+LINE+'}'
    +'.lst-priceblk{display:flex;flex-direction:column;gap:1px;min-width:0}'
    +'.lst-price{font-size:1.0625rem;font-weight:800;color:'+INK+';font-family:var(--num),var(--body),sans-serif;font-variant-numeric:tabular-nums;letter-spacing:-.01em;line-height:1.1}'
    +'.lst-ppm{font-size:.71875rem;font-weight:600;color:'+MUT+';font-variant-numeric:tabular-nums}'
    +'.lst-go{font-size:1.25rem;font-weight:800;color:'+A+';line-height:1;align-self:center}'
    +'.lst-meta{display:flex;flex-wrap:wrap;gap:10px;font-size:.65625rem;color:'+MUT+';font-weight:600;padding-top:2px;font-variant-numeric:tabular-nums}'
    /* DETAY */
    +'.lstd{max-width:1080px;margin:0 auto;padding:8px 4px 40px;color:'+INK+'}'
    +'.lstd-head{margin:0 0 18px}'
    +'.lstd-type{font-size:.75rem;font-weight:600;color:'+MUT+';margin-left:6px}'
    +'.lstd-title{font-size:clamp(1.5rem,4vw,2.375rem);line-height:1.15;margin:10px 0 6px;font-weight:800}'
    +'.lstd-loc{font-size:.90625rem;color:'+MUT+';font-weight:600}'
    +'.lstd-grid{display:grid;grid-template-columns:1fr 320px;gap:26px;align-items:start}'
    +'@media(max-width:860px){.lstd-grid{grid-template-columns:1fr}}'
    +'.lstd-cover{position:relative;aspect-ratio:16/10;border-radius:16px;overflow:hidden;background:rgba(0,0,0,.06)}'
    +'.lstd-cover img{width:100%;height:100%;object-fit:cover}'
    +'.lstd-cover.lstd-empty{display:grid;place-items:center;font-size:3.375rem;opacity:.4}'
    +'.lstd-cover-eids{position:absolute;top:12px;left:12px}'
    +'.lstd-thumbs{display:flex;gap:9px;margin-top:10px;overflow-x:auto;padding-bottom:4px}'
    +'.lstd-th{flex:0 0 92px;height:66px;border-radius:10px;overflow:hidden;border:2px solid transparent;background:none;padding:0;cursor:pointer}'
    +'.lstd-th img{width:100%;height:100%;object-fit:cover}.lstd-th.on{border-color:'+A+'}'
    +'.lstd-price-m{display:none;font-size:1.5rem;font-weight:800;color:'+A+';margin:14px 0}'
    +'@media(max-width:860px){.lstd-price-m{display:block}}'
    +'.lstd-section{margin-top:26px}.lstd-section h3{font-size:1rem;font-weight:800;margin:0 0 12px;color:'+INK+'}'
    +'.lstd-specs{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:10px}'
    +'.lstd-spec{background:'+SURF+';border:1px solid '+LINE+';border-radius:12px;padding:11px 13px;display:flex;flex-direction:column;gap:3px}'
    +'.lstd-spec .k{font-size:.71875rem;color:'+MUT+';font-weight:600}.lstd-spec .v{font-size:.96875rem;font-weight:800;color:'+INK+'}'
    +'.lstd-desc{font-size:.9375rem;line-height:1.75}.lstd-desc p{margin:0 0 14px}.lstd-muted{color:'+MUT+'}'
    +'.lstd-feats{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:9px}'
    +'.lstd-feats li{position:relative;padding-left:24px;font-size:.875rem;line-height:1.5}.lstd-feats li:before{content:"✓";position:absolute;left:0;top:0;color:'+A+';font-weight:800}'
    +'.lstd-map{aspect-ratio:16/9;border-radius:14px;overflow:hidden;border:1px solid '+LINE+';position:relative}'
    +'.lstd-map-cap{position:absolute;left:0;bottom:0;background:rgba(0,0,0,.6);color:#fff;font-size:.75rem;padding:5px 10px;z-index:500;pointer-events:none}'
    +'.lstd-map-el{width:100%;height:100%;background:#e8eef3;position:relative}'
    +'.lstd-map-el iframe{width:100%;height:100%;border:0}'
    +'.lstd-map-load{position:absolute;inset:0;display:grid;place-items:center;color:'+MUT+';font-size:.8125rem}'
    +'.lstd-map-guard{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:14px;background:rgba(0,0,0,.03);cursor:pointer}'
    +'.lstd-map-guard button{background:rgba(0,0,0,.72);color:#fff;border:0;border-radius:999px;padding:9px 16px;font-size:.78125rem;font-weight:700;cursor:pointer;pointer-events:none}'
    +'.lstd-side{position:sticky;top:90px}'
    +'@media(max-width:860px){.lstd-side{position:static}}'
    +'.lstd-card{background:'+SURF+';border:1px solid '+LINE+';border-radius:16px;padding:18px;box-shadow:0 8px 30px rgba(0,0,0,.06)}'
    +'.lstd-price{font-size:1.625rem;font-weight:800;color:'+A+';margin-bottom:10px}'
    +'.lstd-eids-row{margin-bottom:10px}'
    +'.lstd-brand{font-size:.8125rem;color:'+MUT+';font-weight:700;margin-bottom:12px}'
    +'.lstd-btn{display:block;width:100%;text-align:center;padding:12px 14px;border-radius:11px;font-size:.875rem;font-weight:700;margin-top:9px;border:1px solid '+LINE+';background:'+BG+';color:'+INK+';cursor:pointer;text-decoration:none;box-sizing:border-box}'
    +'.lstd-btn.pri{background:'+A+';color:var(--on-accent,#fff);border-color:transparent}'
    +'.lstd-btn.lstwa{background:#25d366;color:#fff;border-color:transparent}'
    +'.lstd-note{margin-top:14px;font-size:.75rem;line-height:1.6;color:'+MUT+';display:flex;gap:8px;align-items:flex-start}.lstd-note b{color:'+INK+'}'
    +'.lstd-note .eids-shield{flex:0 0 auto;color:#0f7a3d;margin-top:1px}'
    /* KART hızlı iletişim */
    +'.lst-ph img{position:relative;z-index:1}'
    +'.lst-cta{display:flex;flex-direction:column;gap:8px;margin-top:12px}'
    +'.lst-cta2{display:flex;gap:8px}'
    +'.lst-inc{width:100%;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 12px;border-radius:10px;font-size:.84375rem;font-weight:700;font-family:inherit;border:0;cursor:pointer;color:var(--on-accent,#fff);background:var(--grad-cta,'+A+');box-shadow:0 10px 22px -12px '+A+'}'
    +'.lst-inc span{transition:.18s}.lst-inc:hover span{transform:translateX(3px)}'
    +'.lst-cta-b{flex:1 1 0;min-width:0;display:inline-flex;align-items:center;justify-content:center;gap:6px;padding:10px 8px;border-radius:10px;font-size:.8125rem;font-weight:700;text-decoration:none;border:1px solid '+LINE+';cursor:pointer;box-sizing:border-box}'
    +'.lst-cta-b.lstwa{background:#25d366;color:#fff;border-color:transparent}'
    +'.lst-cta-b.tel{background:color-mix(in srgb,var(--accent) 10%,#fff);border-color:color-mix(in srgb,var(--accent) 38%,transparent);color:'+A+'}.lst-cta-b.tel:hover{background:color-mix(in srgb,var(--accent) 18%,#fff);border-color:'+A+'}'
    +'.lst-cmpc{position:absolute;top:52px;right:12px;z-index:3;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:#0e7490;font-size:.9375rem;font-weight:800;line-height:1;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.22);display:grid;place-items:center;transition:transform .12s}.lst-cmpc:hover{transform:scale(1.08)}.lst-cmpc.on{background:#0e7490;color:#fff}'
    +'.lst-fav{position:absolute;top:12px;right:12px;z-index:3;width:34px;height:34px;border-radius:50%;border:0;background:rgba(255,255,255,.92);color:#e0245e;font-size:1.0625rem;line-height:1;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.22);display:grid;place-items:center;transition:transform .12s}'
    +'.lst-fav:hover{transform:scale(1.12)}'
    +'.lst-eids-mini{right:54px}'
    +'.lst-cat{font-weight:800;color:'+A+'}'
    +'.lstd-attrs{width:100%;border-collapse:collapse;font-size:.875rem}'
    +'.lstd-attrs td{padding:10px 12px;border-bottom:1px solid '+LINE+'}'
    +'.lstd-attrs td.k{color:'+MUT+';width:46%;font-weight:600}'
    +'.lstd-attrs td.v{color:'+INK+';font-weight:700}'
    +'.lstd-attrs tr:nth-child(odd){background:rgba(0,0,0,.02)}'
    +'.lstd-btn.lst-favline.on{background:rgba(224,36,94,.10);color:#e0245e;border-color:rgba(224,36,94,.30)}'
    /* MODERN İLAN-EKLE öznitelik formu */
    +'.at-form{margin-top:6px}'
    +'.at-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:10px}'
    +'.at-f label{display:block;font-size:.75rem;font-weight:600;color:'+MUT+';margin-bottom:4px}'
    +'.at-f select,.at-f input{width:100%;padding:8px 10px;border:1px solid '+LINE+';border-radius:8px;background:'+BG+';color:'+INK+';font:inherit;box-sizing:border-box}'
    +'.at-f.req select,.at-f.req input{border-color:'+A+'}.at-req{color:#c0392b}'
    +'.at-feats{margin-top:16px}.at-feats-h{font-size:.84375rem;font-weight:800;margin-bottom:10px}.at-muted{font-weight:400;color:'+MUT+';font-size:.75rem}'
    +'.at-chipgrp{margin-bottom:12px}.at-chipgrp-l{display:block;font-size:.71875rem;color:'+MUT+';font-weight:700;margin-bottom:6px}'
    +'.at-chips{display:flex;flex-wrap:wrap;gap:7px}'
    +'.at-chip{border:1px solid '+LINE+';background:'+BG+';color:'+INK+';border-radius:999px;padding:6px 13px;font-size:.78125rem;cursor:pointer;transition:all .12s}'
    +'.at-chip:hover{border-color:'+A+'}.at-chip.on{background:'+A+';color:var(--on-accent,#fff);border-color:transparent;font-weight:700}'
    /* DANIŞMAN kartı */
    +'.lstd-agent{display:flex;align-items:center;gap:12px;padding:12px 0;margin:2px 0 12px;border-top:1px solid '+LINE+';border-bottom:1px solid '+LINE+'}'
    +'.lstd-ag-ph{position:relative;width:52px;height:52px;border-radius:50%;overflow:hidden;flex:0 0 auto;background:'+A+'}'
    +'.lstd-ag-ph img{width:100%;height:100%;object-fit:cover;position:relative;z-index:1}'
    +'.lstd-ag-ini{position:absolute;inset:0;display:grid;place-items:center;color:var(--on-accent,#fff);font-weight:800;font-size:1.125rem;z-index:0}'
    +'.lstd-ag-info{display:flex;flex-direction:column;gap:2px;min-width:0}.lstd-ag-info b{font-size:.9375rem}'
    +'.lstd-ag-title{font-size:.78125rem;color:'+MUT+'}.lstd-ag-exp{font-size:.75rem;color:'+A+';font-weight:700}'
    /* CTA ikonları + Ara */
    +'.lstd-btn.tel:hover{border-color:'+A+';color:'+A+'}'
    +'.lstd-btn svg{vertical-align:-3px;margin-right:5px}'
    /* SOSYAL PAYLAŞIM */
    +'.lstd-share{margin-top:14px;padding-top:12px;border-top:1px solid '+LINE+'}'
    +'.lstd-share-l{font-size:.75rem;color:'+MUT+';font-weight:600;display:block;margin-bottom:8px}'
    +'.lstd-share-b{display:flex;gap:8px}'
    +'.lstd-share-b button{flex:1;height:38px;border-radius:10px;border:1px solid '+LINE+';background:'+SURF+';color:'+INK+';cursor:pointer;display:grid;place-items:center;transition:transform .12s,background .12s}'
    +'.lstd-share-b button:hover{transform:translateY(-2px)}'
    +'.lstd-share-b .lstwa:hover{background:#25d366;color:#fff;border-color:transparent}'
    +'.lstd-share-b .x:hover{background:#111;color:#fff;border-color:transparent}'
    +'.lstd-share-b .fb:hover{background:#1877f2;color:#fff;border-color:transparent}'
    +'.lstd-share-b .cp.done{background:#0f7a3d;color:#fff;border-color:transparent}'
    +'.lstd-ov{position:fixed;inset:0;z-index:9000;background:'+BG+';color:'+INK+';overflow-y:auto;overflow-x:hidden;display:none}'
    +'.lstd-ov.on{display:block}'
    +'.lstd-ovwrap{max-width:1120px;margin:0 auto;padding:20px 18px 30px}'
    +'.lstd-back{background:'+SURF+';color:'+INK+';border:1px solid '+LINE+';border-radius:10px;padding:9px 16px;font-size:.84375rem;font-weight:700;cursor:pointer;margin-bottom:6px}'
    +'.lstd-back:hover{border-color:'+A+';color:'+A+'}'
    +'.lstd-ovnav{position:sticky;top:0;z-index:40;background:'+SURF+';border-bottom:1px solid '+LINE+';box-shadow:0 2px 12px rgba(0,0,0,.06)}'
    +'.lstd-ovnav-in{max-width:1120px;margin:0 auto;padding:0 18px;height:62px;display:flex;align-items:center;gap:16px}'
    +'.lstd-ovbrand{font-weight:800;font-size:1.1875rem;color:'+A+';text-decoration:none;white-space:nowrap;cursor:pointer}'
    +'.lstd-ovlinks{display:flex;gap:20px;flex:1;margin-left:8px}'
    +'.lstd-ovlinks a{color:'+INK+';text-decoration:none;font-size:.875rem;font-weight:600;white-space:nowrap}.lstd-ovlinks a:hover{color:'+A+'}'
    +'.lstd-ovcta{display:flex;align-items:center;gap:8px;margin-left:auto}'
    +'.lstd-ovcta a{width:38px;height:38px;border-radius:50%;display:grid;place-items:center;background:'+BG+';border:1px solid '+LINE+';text-decoration:none;font-size:1rem}'
    +'.lstd-ovx{width:38px;height:38px;border-radius:50%;border:1px solid '+LINE+';background:'+BG+';color:'+INK+';cursor:pointer;font-size:.9375rem}.lstd-ovx:hover{background:'+A+';color:var(--on-accent,#fff);border-color:transparent}'
    +'@media(max-width:760px){.lstd-ovlinks{display:none}.lstd-ovnav-in{gap:10px}}'
    /* GERÇEK klonlanan site header/footer overlay içinde: header üstte yapışkan, footer normal akışta */
    +'.lstd-ov>header,.lstd-ov>.siteNav,.lstd-ov>.insaatNav,.lstd-ov>nav.siteNav{position:sticky;top:0;z-index:45}'
    +'.lstd-ov>footer,.lstd-ov>.siteFooter,.lstd-ov>.insaatFooter{position:static}';
    try{var s=document.createElement('style');s.id='lst-style';s.textContent=css;(document.head||document.documentElement).appendChild(s);}catch(e){}
  };
  if(typeof document!=='undefined'){ if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',L.injectCSS); else L.injectCSS(); }
})();
