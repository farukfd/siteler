/* ============================================================================
   ORTAK ILAN VERISI - tek kaynak (ilanlar.html + ana sayfa teaser paylasir)
   ilanlar.html SEED'inden BIREBIR uretildi. Gercek veri: dn_listings_v1 (admin)
   varsa onu, yoksa SEED fallback. window.DN_ILAN.get() normalize liste doner
   (bolge + cozumlu gorsel URL). Ana sayfa son yuklenen ilk 6 ilani gosterir.
   ========================================================================== */
(function(){
  var SEED=[
  {id:1,durum:'Satılık',tip:'Daire',baslik:'Levent Deniz Manzaralı 3+1 Daire',il:'İstanbul',ilce:'Beşiktaş',mahalle:'Levent',m2:165,oda:'3+1',kat:'12',fiyat:24500000,img:'img3',isitma:'Doğalgaz Kombi',cephe:'Güney',yas:'3',ek:['Asansör','Kapalı Otopark','7/24 Güvenlik','Site İçi'],feat:1,desc:'Boğaz ve şehir manzaralı, geniş salonlu yeni nesil rezidans dairesi. Ebeveyn banyolu, ankastre mutfak ve akıllı ev altyapısıyla; ulaşım akslarına ve prestij okullara yakın konumda.'},
  {id:2,durum:'Satılık',tip:'Villa',baslik:'Zekeriyaköy Havuzlu Müstakil Villa',il:'İstanbul',ilce:'Sarıyer',mahalle:'Zekeriyaköy',m2:420,oda:'5+2',kat:'3 katlı',fiyat:58000000,img:'img1',isitma:'Yerden Isıtma',cephe:'4 Cephe',yas:'2',ek:['Özel Havuz','Geniş Bahçe','Kapalı Garaj','Akıllı Ev'],feat:1,desc:'Doğayla iç içe, özel havuzlu ve geniş bahçeli müstakil villa. Dört cephe, bol ışık, üstün yapı kalitesi; site içi güvenlikli yaşam.'},
  {id:3,durum:'Kiralık',tip:'Daire',baslik:'Cihangir Boğaz Manzaralı Eşyalı 2+1',il:'İstanbul',ilce:'Beyoğlu',mahalle:'Cihangir',m2:120,oda:'2+1',kat:'5',fiyat:65000,kira:true,img:'img5',isitma:'Klima',cephe:'Boğaz',yas:'—',ek:['Eşyalı','Yüksek Tavan','Teras'],feat:1,desc:'Karakteristik binada, Boğaz manzaralı, yüksek tavanlı eşyalı daire. Kültür-sanat aksının merkezinde, yürüyüş mesafesinde her şey.'},
  {id:4,durum:'Satılık',tip:'Ofis / İş Yeri',baslik:'Maslak A+ Plaza Ofis Katı',il:'İstanbul',ilce:'Sarıyer',mahalle:'Maslak',m2:280,oda:'Açık Ofis',kat:'18',fiyat:39000000,img:'img4',isitma:'VRV Klima',cephe:'Cam Cephe',yas:'4',ek:['Otopark','Jeneratör','Resepsiyon','Toplantı Odası'],feat:0,desc:'Prestijli plazada, cam cepheli, bölünebilir açık ofis katı. Kurumsal kimliğinize yakışan konum, otopark ve teknik altyapı.'},
  {id:5,durum:'Kiralık',tip:'Ofis / İş Yeri',baslik:'Nişantaşı Cadde Üstü Dükkan',il:'İstanbul',ilce:'Şişli',mahalle:'Nişantaşı',m2:110,oda:'Vitrinli',kat:'Zemin',fiyat:145000,kira:true,img:'img6',isitma:'Klima',cephe:'Ana Cadde',yas:'—',ek:['Yüksek Yaya Trafiği','Geniş Vitrin','Depo Alanı'],feat:0,desc:'Nişantaşı’nın en işlek caddesinde, geniş vitrinli, yüksek yaya trafiğine sahip perakende dükkanı. Marka mağazacılığa uygun.'},
  {id:6,durum:'Satılık',tip:'Arsa',baslik:'Beykoz Riva Orman Manzaralı İmarlı Arsa',il:'İstanbul',ilce:'Beykoz',mahalle:'Riva',m2:850,oda:'Villa İmarı',kat:'—',fiyat:31000000,img:'img8',isitma:'—',cephe:'Orman',yas:'—',ek:['Villa İmarı','Doğa Manzarası','Altyapı Hazır','Yola Cepheli'],fiyatGuncellendi:true,feat:0,desc:'Riva’da orman manzaralı, villa imarlı yatırımlık arsa. Altyapı hazır, yola cepheli; bölgenin değer artış potansiyeli yüksek. (Fiyatı güncellenmiş örnek kayıt.)'},
  {id:7,durum:'Satılık',tip:'Daire',baslik:'Caddebostan Bahçe Katı 4+1',il:'İstanbul',ilce:'Kadıköy',mahalle:'Caddebostan',m2:220,oda:'4+1',kat:'Bahçe Katı',fiyat:32000000,img:'img2',isitma:'Yerden Isıtma',cephe:'Güney',yas:'5',ek:['Özel Bahçe','Otopark','Asansör'],feat:0,desc:'Bağdat Caddesi’ne yakın, özel bahçeli, geniş metrekareli aile dairesi. Sahil ve sosyal yaşam bir arada.'},
  {id:8,durum:'Kiralık',tip:'Daire',baslik:'Ataşehir Site İçi Ferah 3+1',il:'İstanbul',ilce:'Ataşehir',mahalle:'Barbaros',m2:150,oda:'3+1',kat:'8',fiyat:52000,kira:true,img:'img9',isitma:'Merkezi',cephe:'Doğu',yas:'6',ek:['Site İçi','Yüzme Havuzu','Spor Salonu','Otopark'],feat:0,desc:'Sosyal olanakları geniş, güvenlikli sitede ferah ve aydınlık 3+1 kiralık daire. Finans merkezine yakın konum.'}
];
  function imgURL(v){if(!v)return 'img/gayrimenkul/img2.webp';if((''+v).indexOf('data:')===0||(''+v).indexOf('http')===0||(''+v).charAt(0)==='/'||(''+v).indexOf('../')===0)return v;if(/^img\d+$/.test(v))return 'img/gayrimenkul/'+v+'.webp';return 'img/gayrimenkul/img2.webp';}
  function catOf(t){t=(t||'').toLowerCase();if(/arsa/.test(t))return 'arsa';if(/ofis|is ?yeri|dukkan|ticari/.test(t))return 'ticari';return 'konut';}
  /* DEMO_PRIVATE_PORTFOLIO sınıfı — EİDS rozeti/kodu ÜRETİLMEZ; kart 'DEMO İLAN' etiketi taşır. 1 ilan bilinçli 'beklemede' → EİDS kapısı akışı görünür. */
  function _demoKayit(){try{if(window.EIDS&&EIDS.demoRecord)return EIDS.demoRecord();}catch(e){}return {status:'demo',listing_kind:'demo_private_portfolio',referans:'',tarih:'',mesaj:'Demo tanıtım kaydı — EİDS doğrulaması yapılmaz, gerçek Bakanlık kodu üretilmez.'};}
  function _beklemeKayit(){return {status:'beklemede',mesaj:'EİDS doğrulama bekliyor — bu ilan sitede yayınlanmaz.'};}
  function _galOf(l){var base=parseInt((''+(l.img||'img1')).replace(/\D/g,''),10)||1;var g=[];for(var k=0;k<4;k++){g.push('img'+(((base-1+k*3)%16)+1));}return g;}
  /* Demo sınıfı yalnız demo ortamında üretilir (üretim paketi her sayfada EMLAK_DEMO=false tanımlar). */
  var DEMO=(typeof window==='undefined')||(window.SITE_MODE?window.SITE_MODE==='demo':window.EMLAK_DEMO!==false);
  function get(){
    var list=SEED.slice();
    /* FAZ3E: üretim paketinde ilan kaynağı MERKEZİ SEED'dir — localStorage kurumsal depo değildir */
    if(typeof window==='undefined'||window.EMLAK_DEMO!==false){
      try{var a=JSON.parse(localStorage.getItem('dn_listings_v1')||'null');if(Array.isArray(a)&&a.length)list=a;}catch(e){}
    }
    var mapped=list.filter(function(l){return l&&l.status!=='pasif';}).map(function(l){
      var bolge=l.bolge||[l.mahalle,l.ilce].filter(Boolean).join(' · ')||l.ilce||l.il||'';
      var eids=l.eids;
      if(DEMO){ /* gerçek 'dogrulandi'/'reddedildi' KORUNUR; varsayılan/beklemede → temsilî doğrulandı */
        eids=(l.eids&&(l.eids.status==='dogrulandi'||l.eids.status==='reddedildi'))?l.eids:_demoKayit();
      } else { eids=l.eids||_beklemeKayit(); }
      return Object.assign({},l,{bolge:bolge,imgUrl:imgURL(l.img),
        gallery:(l.gallery&&l.gallery.length?l.gallery:_galOf(l)),eids:eids});
    });
    /* FAZ3C: tenant hizmet alanı DIŞI il public listede GÖRÜNMEZ (backend sorgu filtresi ayrıca zorunlu — spec) */
    try{var _sa=JSON.parse(localStorage.getItem('dn_service_area')||'null');var _il=_sa&&_sa.primary;
      if(_il){mapped=mapped.filter(function(l){return !l.il||l.il===_il;});}
      else {mapped=mapped.filter(function(l){return !l.il||l.il==='İstanbul';});}/* varsayılan tenant ili */
    }catch(e){}
    /* DEMO: EİDS kapısını göstermek için SON doğrulanmış ilanı 'beklemede' bırak — YALNIZ 6'dan fazla ilan varsa (ana sayfada hep ≥6 kalsın) */
    if(DEMO&&window.SITE_MODE!=='demo'&&mapped.length>6){for(var i=mapped.length-1;i>=0;i--){var _st=mapped[i].eids&&mapped[i].eids.status;if(_st==='dogrulandi'||_st==='demo'){mapped[i]=Object.assign({},mapped[i],{eids:_beklemeKayit()});break;}}}
    return mapped;
  }
  window.DN_ILAN={SEED:SEED,imgURL:imgURL,catOf:catOf,get:get};
})();
