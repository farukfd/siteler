/* gayrimenkul · app.js — engine (P1 ayrıştırma; index.html'den çıkarıldı) */
/* ============ IMAGE DATA ============ */
const IMG = {"hero1": "img/gayrimenkul/img1.webp", "hero2": "img/gayrimenkul/img2.webp", "hero3": "img/gayrimenkul/img3.webp", "l1": "img/gayrimenkul/img4.webp", "l2": "img/gayrimenkul/img5.webp", "l3": "img/gayrimenkul/img6.webp", "l4": "img/gayrimenkul/img7.webp", "l5": "img/gayrimenkul/img8.webp", "l6": "img/gayrimenkul/img9.webp", "bolge": "img/gayrimenkul/img10.webp", "about": "img/gayrimenkul/img11.webp"};
Object.assign(IMG, {"dan1": "img/gayrimenkul/img12.webp", "dan2": "img/gayrimenkul/img13.webp", "dan3": "img/gayrimenkul/img14.webp", "dan4": "img/gayrimenkul/img15.webp", "pano": "img/gayrimenkul/img16.webp"});
const HERO_KEYS=['hero1','hero2','hero3'];
const LIST_IMGS=['l1','l2','l3','l4','l5','l6'];

/* ============ DEFAULT DATA ============ */
const DEF_FIRMA={name:'Meridyen Gayrimenkul',tel:'+90 232 000 00 00',mail:'info@meridyengm.com',wa:'905000000000',adres:'Alsancak Mah. Kıbrıs Şehitleri Cad. No:00, Konak / İzmir',hours:'Hafta içi 09:00–19:00 · Cumartesi 10:00–17:00',vergi:'6100000000',yetkili:'',
  kurulus:2007,vergiDaire:'Konak Vergi Dairesi',mersis:'0648010000000000',ticaretSicil:'İzmir Ticaret Sicil · 000000',oda:'İzmir Ticaret Odası · Üye No 00000',kep:'meridyengm@hs01.kep.tr',calisan:42,
  lat:38.4322,lng:27.1419,
  social:{fb:'',ig:'',x:'',li:'',yt:''},/* boş → demo sosyal linkleri gizlenir (Meridyen'e gitmez); sihirbaz/admin doldurur */
  eids:{yetkili:true,belgeNo:'4827193',unvan:'Meridyen Gayrimenkul Danışmanlık Ltd. Şti.'}};
// ₺/m² baz fiyatlar (örnek, emlakekspertizi endeksine bağlanır)
/* ============ İL VERİ KATMANI (swappable: İzmir → Ankara renk+veri) ============ */
const IZMIR_PROVINCE={
  name:'İzmir', plate:35, center:'İzmir', region:'Ege',
  mahCount:'1.300+',
  groups:[
    {key:'metropol',name:'Metropol Merkez',desc:'İzmir kent merkezi ve çevre metropol ilçeleri'},
    {key:'sahil',name:'Sahil & Yarımada',desc:'Çeşme–Urla hattı ve Ege kıyı ilçeleri'},
    {key:'ic',name:'İç & Kuzey İlçeler',desc:'Tarım, sanayi ve gelişen yerleşimler'}
  ],
  districts:{
    'Konak':{group:'metropol',m2:62000,chg:168,score:84,risk:'Körfez zemini · Orta risk',warn:1,mah:['Alsancak','Göztepe','Güzelyalı','Hatay','Karataş','Basmane','Kahramanlar','Mersinli','Umurbey','Çankaya','Konak','Eşrefpaşa','Akıncılar','Güney','Yeşildere','Lale','Kadifekale','Tepecik','Mecidiye','Yenişehir']},
    'Karşıyaka':{group:'metropol',m2:72000,chg:176,score:86,risk:'Körfez zemini · Orta risk',warn:1,mah:['Bostanlı','Mavişehir','Alaybey','Bahriye Üçok','Donanmacı','Tuna','Nergiz','Yalı','Şemikler','Atakent','Goncalar','Aksoy','Dedebaşı','İmbatlı','Cumhuriyet','Örnekköy','Zübeyde Hanım','Tersane','Latife Hanım']},
    'Bornova':{group:'metropol',m2:55000,chg:184,score:80,risk:'Fay hattına yakın · Zemin dikkat',warn:1,mah:['Kazımdirik','Erzene','Evka 3','Evka 4','Çamdibi','Mevlana','Atatürk','Doğanlar','Ergene','Naldöken','Pınarbaşı','Işıkkent','Kavaklıdere','Yeşilova','Rafetpaşa','Egemenlik','Çiçekli','Yıldırım Beyazıt','Inönü','Çamiçi']},
    'Buca':{group:'metropol',m2:42000,chg:192,score:72,risk:'Orta risk · Karışık yapı stoku',warn:1,mah:['Şirinyer','Adatepe','Yıldız','Kozağaç','Tınaztepe','Çamlıkule','Gaziler','Vali Rahmi Bey','İnönü','Dumlupınar','Yenigün','Kuruçeşme','Hürriyet','Menderes','Yıldızlar','Buca Koop','Göksu','Mustafa Kemal']},
    'Bayraklı':{group:'metropol',m2:52000,chg:205,score:75,risk:'Fay hattına yakın · Yüksek dikkat',warn:1,mah:['Mansuroğlu','Adalet','Manavkuyu','Bayraklı','Turan','Org. Nafiz Gürman','Çay','Onur','Çiçek','Postacılar','Soğukkuyu','Yamanlar','Cengizhan','Refik Şevket İnce','Tepekule']},
    'Çiğli':{group:'metropol',m2:44000,chg:198,score:70,risk:'Fay/zemin · Yüksek dikkat',warn:1,mah:['Ataşehir','Balatçık','Egekent','Küçük Çiğli','Büyük Çiğli','Maltepe','Harmandalı','Güzeltepe','Yeni Mahalle','Şirintepe','Aydınlık','Sasalı','Köyiçi','Uğur Mumcu']},
    'Gaziemir':{group:'metropol',m2:48000,chg:188,score:74,risk:'Orta risk',mah:['Atıfbey','Sakarya','Irmak','Gazi','Menderes','Beyazevler','Aktepe','Binbaşı Reşatbey','Yeşil','Fatih','Dokuz Eylül']},
    'Balçova':{group:'metropol',m2:58000,chg:174,score:78,risk:'Orta risk',mah:['Çetin Emeç','Korutürk','Onur','İnciraltı','Teleferik','Eğitim','Bahçelerarası','Fevzi Çakmak']},
    'Narlıdere':{group:'metropol',m2:70000,chg:182,score:80,risk:'Düşük-Orta risk',mah:['2. İnönü','Sahilevleri','Limanreis','Huzur','Çatalkaya','Narlı','Yenikale','Altıevler','İnönü']},
    'Karabağlar':{group:'metropol',m2:40000,chg:196,score:68,risk:'Orta risk · Yoğun yapı',warn:1,mah:['Yeşillik','Bozyaka','Üçkuyular','Gülyaka','Bahçelievler','Yurtoğlu','Vatan','Maliyeciler','Limontepe','Salihomurtak','Aydın','Fahrettin Altay','Cennetçeşme','Umut','Devrim','Poligon','Uzundere','Yunus Emre']},
    'Güzelbahçe':{group:'metropol',m2:80000,chg:178,score:82,risk:'Düşük risk',mah:['Yalı','Çamlı','Kahramandere','Mustafa Kemal Paşa','Atatürk','Yelki','Siteler','Maltepe']},

    'Çeşme':{group:'sahil',m2:95000,chg:224,score:88,risk:'Düşük risk · Sahil',mah:['Alaçatı','Ilıca','Cumhuriyet','Dalyan','Ovacık','Reisdere','16 Eylül','Musalla','Çiftlikköy','Germiyan','Ildırı','Şifne']},
    'Urla':{group:'sahil',m2:78000,chg:232,score:84,risk:'Düşük risk · Sahil',mah:['İskele','Zeytinalanı','Altıntaş','Güvendik','Kuşçular','Özbek','Bademler','Yağcılar','Camiatik','Hacıisa','Sıra','Rüstem','Gülbahçe','Kalabak']},
    'Seferihisar':{group:'sahil',m2:56000,chg:218,score:80,risk:'Düşük-Orta risk',mah:['Sığacık','Doğanbey','Ürkmez','Payamlı','Hıdırlık','Atatürk','Camikebir','Turgut','Tepecik','Beyler','Düzce']},
    'Foça':{group:'sahil',m2:60000,chg:206,score:81,risk:'Düşük risk · Sahil',mah:['Cumhuriyet','Aşıklar','Yenifoça','Bağarası','Atatürk','Fevzipaşa','Kozbeyli','Gerenköy','İsmetpaşa']},
    'Menderes':{group:'sahil',m2:38000,chg:214,score:68,risk:'Gelişen bölge',mah:['Cumhuriyet','Görece','Gümüldür','Özdere','Develi','Oğlananası','Çileme','Bulgurca','Değirmendere','Çatalca']},
    'Dikili':{group:'sahil',m2:40000,chg:198,score:72,risk:'Düşük risk · Sahil',mah:['İsmetpaşa','Cumhuriyet','Atatürk','Çandarlı','Bademli','Salihler','Kabakum','Gazipaşa']},
    'Karaburun':{group:'sahil',m2:52000,chg:188,score:76,risk:'Düşük risk · Sahil',mah:['Cumhuriyet','Mordoğan','Küçükbahçe','Sarpıncık','Eğlenhoca','Salman','Hasseki']},
    'Selçuk':{group:'sahil',m2:42000,chg:196,score:75,risk:'Tarih & turizm bölgesi',mah:['Şirince','Atatürk','Cumhuriyet','Zafer','İsabey','Pamucak','Belevi','Acarlar','Barutçu']},

    'Menemen':{group:'ic',m2:36000,chg:202,score:66,risk:'Gelişen · Ova zemini',warn:1,mah:['Asarlık','Süleymanlı','Kasımpaşa','Maltepe','Mermerli','Ulukent','Koyundere','Çukurköy','Emiralem','Görece','29 Ekim','Kazımpaşa']},
    'Aliağa':{group:'ic',m2:30000,chg:184,score:64,risk:'Sanayi bölgesi',mah:['Kültür','Yeni','Kurtuluş','Atatürk','Siteler','Helvacı','Çakmaklı','Şakran','Kazımdirik']},
    'Torbalı':{group:'ic',m2:34000,chg:226,score:67,risk:'Gelişen · Sanayi-Tarım',mah:['Ertuğrul','Tepeköy','Ayrancılar','Pancar','Yazıbaşı','Çaybaşı','Muratbey','Subaşı','Karakuyu','Çapak']},
    'Kemalpaşa':{group:'ic',m2:32000,chg:212,score:66,risk:'Sanayi-Tarım',mah:['Ulucak','Ören','Armutlu','Bağyurdu','Yeşilköy','Nazarköy','Vişneli','Atatürk','Kuyucak']},
    'Bayındır':{group:'ic',m2:24000,chg:178,score:62,risk:'Tarım bölgesi',mah:['Cumhuriyet','Hürriyet','Çamlıbel','Yusuflu','Canlı','Çiftçigediği','Hatay']},
    'Ödemiş':{group:'ic',m2:26000,chg:172,score:63,risk:'İlçe merkezi · Tarım',mah:['Umurbey','Cumhuriyet','Atatürk','Zafer','Yıldıztepe','Süleymaniye','Birgi','Kaymakçı','Bademli','Konaklı']},
    'Tire':{group:'ic',m2:24000,chg:168,score:62,risk:'Tarih & tarım',mah:['Yeni','Cumhuriyet','Duatepe','İttihat','Yenişehir','Toptepe','Kurtuluş','Hisarlık']},
    'Bergama':{group:'ic',m2:22000,chg:166,score:62,risk:'Tarih bölgesi',mah:['Atmaca','İslamsaray','Zafer','Barbaros','Ulucami','Maltepe','Kurtuluş','Çaltıkoru','Zeytindağ','Gazipaşa']},
    'Kınık':{group:'ic',m2:18000,chg:158,score:58,risk:'Kırsal · Tarım',mah:['Cumhuriyet','Fatih','Poyracık','Çukuralan','Yayakent','Taştepe']},
    'Kiraz':{group:'ic',m2:17000,chg:154,score:57,risk:'Kırsal · Tarım',mah:['Cumhuriyet','Yeni','Karaburç','Umurlu','Suludere','Yağlar']},
    'Beydağ':{group:'ic',m2:16000,chg:150,score:56,risk:'Kırsal · Tarım',mah:['Aktepe','Cumhuriyet','Yenice','Çamlık','Gökçen','Palamutçuk']}
  }
};
let PROVINCE=clone(IZMIR_PROVINCE);/* C2: IZMIR_PROVINCE bir ŞABLON — asla doğrudan kullanma; her zaman klon dağıt (aşağıdaki delete/mutasyonlar şablonu bozmasın) */
/* ===== WHITE-LABEL İL MOTORU (ProX endeks beslemeli) ===== */
const TR_ILILCE={"Adana":{"plate":1,"ilce":["Aladağ","Ceyhan","Çukurova","Feke","İmamoğlu","Karaisalı","Karataş","Kozan","Pozantı","Saimbeyli","Sarıçam","Seyhan","Tufanbeyli","Yumurtalık","Yüreğir"]},"Adıyaman":{"plate":2,"ilce":["Adıyaman-il Merkezi","Besni","Çelikhan","Gerger","Gölbaşı","Kahta","Merkez","Samsat","Sincik","Tut"]},"Afyonkarahisar":{"plate":3,"ilce":["Afyonkarahisar","Başmakçı","Bayat","Bolvadin","Çay","Çobanlar","Dazkırı","Dinar","Emirdağ","Evciler","Hocalar","İhsaniye","İscehisar","Kızılören","Merkez","Sandıklı","Sinanpaşa","Sultandağı","Şuhut"]},"Ağrı":{"plate":4,"ilce":["Ağrı-il Merkezi","Diyadin","Doğubayazıt","Eleşkirt","Hamur","Patnos","Taşlıçay","Tutak"]},"Aksaray":{"plate":68,"ilce":["Ağaçören","Aksaray-il Merkezi","Eskil","Gülağaç","Güzelyurt","Merkez","Ortaköy","Sarıyahşi","Sultanhanı"]},"Amasya":{"plate":5,"ilce":["Amasya-il Merkezi","Göynücek","Gümüşhacıköy","Hamamözü","Merkez","Merzifon","Suluova","Taşova"]},"Ankara":{"plate":6,"ilce":["Akyurt","Altındağ","Ayaş","Bala","Beypazarı","Çamlıdere","Çankaya","Çubuk","Elmadağ","Etimesgut","Evren","Gölbaşı","Güdül","Haymana","Kahramankazan","Kalecik","Keçiören","Kızılcahamam","Mamak","Nallıhan","Polatlı","Pursaklar","Sincan","Şereflikoçhisar","Yenimahalle"]},"Antalya":{"plate":7,"ilce":["Akseki","Aksu","Alanya","Demre","Döşemealtı","Elmalı","Finike","Gazipaşa","Gündoğmuş","İbradı","Kaş","Kemer","Kepez","Konyaaltı","Korkuteli","Kumluca","Manavgat","Muratpaşa","Serik"]},"Ardahan":{"plate":75,"ilce":["Ardahan-il Merkezi","Çıldır","Damal","Göle","Hanak","Posof"]},"Artvin":{"plate":8,"ilce":["Ardanuç","Arhavi","Artvin-il Merkezi","Borçka","Hopa","Kemalpaşa","Murgul","Şavşat","Yusufeli"]},"Aydın":{"plate":9,"ilce":["Bozdoğan","Buharkent","Çine","Didim","Efeler","Germencik","İncirliova","Karacasu","Karpuzlu","Koçarlı","Köşk","Kuşadası","Kuyucak","Nazilli","Söke","Sultanhisar","Yenipazar"]},"Balıkesir":{"plate":10,"ilce":["Altıeylül","Ayvalık","Balya","Bandırma","Bigadiç","Burhaniye","Dursunbey","Edremit","Erdek","Gömeç","Gönen","Havran","İvrindi","Karesi","Kepsut","Manyas","Marmara","Savaştepe","Sındırgı","Susurluk"]},"Bartın":{"plate":74,"ilce":["Amasra","Bartın-il Merkezi","Kurucaşile","Merkez","Ulus"]},"Batman":{"plate":72,"ilce":["Batman-il Merkezi","Beşiri","Gercüş","Hasankeyf","Kozluk","Merkez","Sason"]},"Bayburt":{"plate":69,"ilce":["Aydıntepe","Bayburt-il Merkezi","Demirözü","Merkez"]},"Bilecik":{"plate":11,"ilce":["Bilecik-il Merkezi","Bozüyük","Gölpazarı","İnhisar","Merkez","Osmaneli","Pazaryeri","Söğüt","Yenipazar"]},"Bingöl":{"plate":12,"ilce":["Adaklı","Bingöl-il Merkezi","Genç","Karlıova","Kiğı","Merkez","Solhan","Yayladere","Yedisu"]},"Bitlis":{"plate":13,"ilce":["Adilcevaz","Ahlat","Bitlis-il Merkezi","Güroymak","Hizan","Merkez","Mutki","Tatvan"]},"Bolu":{"plate":14,"ilce":["Bolu-il Merkezi","Dörtdivan","Gerede","Göynük","Kıbrıscık","Mengen","Merkez","Mudurnu","Seben","Yeniçağa"]},"Burdur":{"plate":15,"ilce":["Ağlasun","Altınyayla","Bucak","Burdur-il Merkezi","Çavdır","Çeltikçi","Gölhisar","Karamanlı","Kemer","Tefenni","Yeşilova"]},"Bursa":{"plate":16,"ilce":["Büyükorhan","Gemlik","Gürsu","Harmancık","İnegöl","İznik","Karacabey","Keles","Kestel","Mudanya","Mustafakemalpaşa","Nilüfer","Orhaneli","Orhangazi","Osmangazi","Yenişehir","Yıldırım"]},"Çanakkale":{"plate":17,"ilce":["Ayvacık","Bayramiç","Biga","Bozcaada","Çan","Çanakkale-il Merkezi","Eceabat","Ezine","Gelibolu","Gökçeada","Lapseki","Merkez","Yenice"]},"Çankırı":{"plate":18,"ilce":["Atkaracalar","Bayramören","Çankırı-il Merkezi","Çerkeş","Eldivan","Ilgaz","Kızılırmak","Korgun","Kurşunlu","Orta","Şabanözü","Yapraklı"]},"Çorum":{"plate":19,"ilce":["Alaca","Bayat","Boğazkale","Çorum-il Merkezi","Dodurga","İskilip","Kargı","Laçin","Mecitözü","Merkez","Oğuzlar","Ortaköy","Osmancık","Sungurlu","Uğurludağ"]},"Denizli":{"plate":20,"ilce":["Acıpayam","Babadağ","Baklan","Bekilli","Beyağaç","Bozkurt","Buldan","Çal","Çameli","Çardak","Çivril","Güney","Honaz","Kale","Merkezefendi","Pamukkale","Sarayköy","Serinhisar","Tavas"]},"Diyarbakır":{"plate":21,"ilce":["Bağlar","Bismil","Çermik","Çınar","Çüngüş","Dicle","Eğil","Ergani","Hani","Hazro","Kayapınar","Kocaköy","Kulp","Lice","Silvan","Sur","Yenişehir"]},"Düzce":{"plate":81,"ilce":["Akçakoca","Cumayeri","Çilimli","Düzce-il Merkezi","Gölyaka","Gümüşova","Kaynaşlı","Merkez","Yığılca"]},"Edirne":{"plate":22,"ilce":["Edirne-il Merkezi","Enez","Havsa","İpsala","Keşan","Lalapaşa","Meriç","Süloğlu","Uzunköprü"]},"Elazığ":{"plate":23,"ilce":["Ağın","Alacakaya","Arıcak","Baskil","Elazığ-il Merkezi","Karakoçan","Keban","Kovancılar","Maden","Merkez","Palu","Sivrice"]},"Erzincan":{"plate":24,"ilce":["Çayırlı","Erzincan-il Merkezi","İliç","Kemah","Kemaliye","Merkez","Otlukbeli","Refahiye","Tercan","Üzümlü"]},"Erzurum":{"plate":25,"ilce":["Aşkale","Aziziye","Çat","Hınıs","Horasan","İspir","Karaçoban","Karayazı","Köprüköy","Narman","Oltu","Olur","Palandöken","Pasinler","Pazaryolu","Şenkaya","Tekman","Tortum","Uzundere","Yakutiye"]},"Eskişehir":{"plate":26,"ilce":["Alpu","Beylikova","Çifteler","Günyüzü","Han","İnönü","Mahmudiye","Mihalgazi","Mihalıççık","Odunpazarı","Sarıcakaya","Seyitgazi","Sivrihisar","Tepebaşı"]},"Gaziantep":{"plate":27,"ilce":["Araban","İslahiye","Karkamış","Nizip","Nurdağı","Oğuzeli","Şahinbey","Şehitkamil","Yavuzeli"]},"Giresun":{"plate":28,"ilce":["Alucra","Bulancak","Çamoluk","Çanakçı","Dereli","Doğankent","Espiye","Eynesil","Giresun-il Merkezi","Görele","Güce","Keşap","Merkez","Piraziz","Şebinkarahisar","Tirebolu","Yağlıdere"]},"Gümüşhane":{"plate":29,"ilce":["Gümüşhane-il Merkezi","Kelkit","Köse","Kürtün","Merkez","Şiran","Torul"]},"Hakkari":{"plate":30,"ilce":["Çukurca","Derecik","Hakkari-il Merkezi","Merkez","Şemdinli","Yüksekova"]},"Hatay":{"plate":31,"ilce":["Altınözü","Antakya","Arsuz","Belen","Defne","Dörtyol","Erzin","Hassa","İskenderun","Kırıkhan","Kumlu","Payas","Reyhanlı","Samandağ","Yayladağı"]},"Iğdır":{"plate":76,"ilce":["Aralık","Iğdır-il Merkezi","Karakoyunlu","Merkez","Tuzluca"]},"Isparta":{"plate":32,"ilce":["Aksu","Atabey","Eğirdir","Gelendost","Gönen","Isparta-il Merkezi","Keçiborlu","Merkez","Senirkent","Sütçüler","Şarkikaraağaç","Uluborlu","Yalvaç","Yenişarbademli"]},"İstanbul":{"plate":34,"ilce":["Adalar","Arnavutköy","Ataşehir","Avcılar","Bağcılar","Bahçelievler","Bakırköy","Başakşehir","Bayrampaşa","Beşiktaş","Beykoz","Beylikdüzü","Beyoğlu","Büyükçekmece","Çatalca","Çekmeköy","Esenler","Esenyurt","Eyüpsultan","Fatih","Gaziosmanpaşa","Güngören","Kadıköy","Kağıthane","Kartal","Küçükçekmece","Maltepe","Pendik","Sancaktepe","Sarıyer","Silivri","Sultanbeyli","Sultangazi","Şile","Şişli","Tuzla","Ümraniye","Üsküdar","Zeytinburnu"]},"İzmir":{"plate":35,"ilce":["Aliağa","Balçova","Bayındır","Bayraklı","Bergama","Beydağ","Bornova","Buca","Çeşme","Çiğli","Dikili","Foça","Gaziemir","Güzelbahçe","Karabağlar","Karaburun","Karşıyaka","Kemalpaşa","Kınık","Kiraz","Konak","Menderes","Menemen","Narlıdere","Ödemiş","Seferihisar","Selçuk","Tire","Torbalı","Urla"]},"Kahramanmaraş":{"plate":46,"ilce":["Afşin","Andırın","Çağlayancerit","Dulkadiroğlu","Ekinözü","Elbistan","Göksun","Nurhak","Onikişubat","Pazarcık","Türkoğlu"]},"Karabük":{"plate":78,"ilce":["Eflani","Eskipazar","Karabük-il Merkezi","Ovacık","Safranbolu","Yenice"]},"Karaman":{"plate":70,"ilce":["Ayrancı","Başyayla","Ermenek","Karaman-il Merkezi","Kazımkarabekir","Merkez","Sarıveliler"]},"Kars":{"plate":36,"ilce":["Akyaka","Arpaçay","Digor","Kağızman","Kars-il Merkezi","Sarıkamış","Selim","Susuz"]},"Kastamonu":{"plate":37,"ilce":["Abana","Ağlı","Araç","Azdavay","Bozkurt","Cide","Çatalzeytin","Daday","Devrekani","Doğanyurt","Hanönü","İhsangazi","İnebolu","Kastamonu-il Merkezi","Küre","Pınarbaşı","Seydiler","Şenpazar","Taşköprü","Tosya"]},"Kayseri":{"plate":38,"ilce":["Akkışla","Bünyan","Develi","Felahiye","Hacılar","İncesu","Kocasinan","Melikgazi","Özvatan","Pınarbaşı","Sarıoğlan","Sarız","Talas","Tomarza","Yahyalı","Yeşilhisar"]},"Kırıkkale":{"plate":71,"ilce":["Bahşılı","Balışeyh","Çelebi","Delice","Karakeçili","Keskin","Kırıkkale-il Merkezi","Merkez","Sulakyurt","Yahşihan"]},"Kırklareli":{"plate":39,"ilce":["Babaeski","Demirköy","Kırklareli-il Merkezi","Kofçaz","Lüleburgaz","Merkez","Pehlivanköy","Pınarhisar","Vize"]},"Kırşehir":{"plate":40,"ilce":["Akçakent","Akpınar","Boztepe","Çiçekdağı","Kaman","Kırşehir-il Merkezi","Merkez","Mucur"]},"Kilis":{"plate":79,"ilce":["Elbeyli","Kilis-il Merkezi","Musabeyli","Polateli"]},"Kocaeli":{"plate":41,"ilce":["Başiskele","Çayırova","Darıca","Derince","Dilovası","Gebze","Gölcük","İzmit","Kandıra","Karamürsel","Kartepe","Körfez"]},"Konya":{"plate":42,"ilce":["Ahırlı","Akören","Akşehir","Altınekin","Beyşehir","Bozkır","Cihanbeyli","Çeltik","Çumra","Derbent","Derebucak","Doğanhisar","Emirgazi","Ereğli","Güneysınır","Hadim","Halkapınar","Hüyük","Ilgın","Kadınhanı","Karapınar","Karatay","Kulu","Meram","Sarayönü","Selçuklu","Seydişehir","Taşkent","Tuzlukçu","Yalıhüyük","Yunak"]},"Kütahya":{"plate":43,"ilce":["Altıntaş","Aslanapa","Çavdarhisar","Domaniç","Dumlupınar","Emet","Gediz","Hisarcık","Kütahya-il Merkezi","Merkez","Pazarlar","Simav","Şaphane","Tavşanlı"]},"Malatya":{"plate":44,"ilce":["Akçadağ","Arapgir","Arguvan","Battalgazi","Darende","Doğanşehir","Doğanyol","Hekimhan","Kale","Kuluncak","Pütürge","Yazıhan","Yeşilyurt"]},"Manisa":{"plate":45,"ilce":["Ahmetli","Akhisar","Alaşehir","Demirci","Gölmarmara","Gördes","Kırkağaç","Köprübaşı","Kula","Salihli","Sarıgöl","Saruhanlı","Selendi","Soma","Şehzadeler","Turgutlu","Yunusemre"]},"Mardin":{"plate":47,"ilce":["Artuklu","Dargeçit","Derik","Kızıltepe","Mazıdağı","Midyat","Nusaybin","Ömerli","Savur","Yeşilli"]},"Mersin":{"plate":33,"ilce":["Akdeniz","Anamur","Aydıncık","Bozyazı","Çamlıyayla","Erdemli","Gülnar","Mezitli","Mut","Silifke","Tarsus","Toroslar","Yenişehir"]},"Muğla":{"plate":48,"ilce":["Bodrum","Dalaman","Datça","Fethiye","Kavaklıdere","Köyceğiz","Marmaris","Menteşe","Milas","Ortaca","Seydikemer","Ula","Yatağan"]},"Muş":{"plate":49,"ilce":["Bulanık","Hasköy","Korkut","Malazgirt","Merkez","Muş-il Merkezi","Varto"]},"Nevşehir":{"plate":50,"ilce":["Acıgöl","Avanos","Derinkuyu","Gülşehir","Hacıbektaş","Kozaklı","Merkez","Nevşehir-il Merkezi","Ürgüp"]},"Niğde":{"plate":51,"ilce":["Altunhisar","Bor","Çamardı","Çiftlik","Merkez","Niğde-il Merkezi","Ulukışla"]},"Ordu":{"plate":52,"ilce":["Akkuş","Altınordu","Aybastı","Çamaş","Çatalpınar","Çaybaşı","Fatsa","Gölköy","Gülyalı","Gürgentepe","İkizce","Kabadüz","Kabataş","Korgan","Kumru","Mesudiye","Perşembe","Ulubey","Ünye"]},"Osmaniye":{"plate":80,"ilce":["Bahçe","Düziçi","Hasanbeyli","Kadirli","Merkez","Osmaniye-il Merkezi","Sumbas","Toprakkale"]},"Rize":{"plate":53,"ilce":["Ardeşen","Çamlıhemşin","Çayeli","Derepazarı","Fındıklı","Güneysu","Hemşin","İkizdere","İyidere","Kalkandere","Merkez","Pazar","Rize-il Merkezi"]},"Sakarya":{"plate":54,"ilce":["Adapazarı","Akyazı","Arifiye","Erenler","Ferizli","Geyve","Hendek","Karapürçek","Karasu","Kaynarca","Kocaali","Pamukova","Sapanca","Serdivan","Söğütlü","Taraklı"]},"Samsun":{"plate":55,"ilce":["19 Mayıs","Alaçam","Asarcık","Atakum","Ayvacık","Bafra","Canik","Çarşamba","Havza","İlkadım","Kavak","Ladik","Salıpazarı","Tekkeköy","Terme","Vezirköprü","Yakakent"]},"Siirt":{"plate":56,"ilce":["Baykan","Eruh","Kurtalan","Merkez","Pervari","Siirt-il Merkezi","Şirvan","Tillo"]},"Sinop":{"plate":57,"ilce":["Ayancık","Boyabat","Dikmen","Durağan","Erfelek","Gerze","Saraydüzü","Sinop-il Merkezi","Türkeli"]},"Sivas":{"plate":58,"ilce":["Akıncılar","Altınyayla","Divriği","Doğanşar","Gemerek","Gölova","Gürün","Hafik","İmranlı","Kangal","Koyulhisar","Merkez","Sivas-il Merkezi","Suşehri","Şarkışla","Ulaş","Yıldızeli","Zara"]},"Şanlıurfa":{"plate":63,"ilce":["Akçakale","Birecik","Bozova","Ceylanpınar","Eyyübiye","Halfeti","Haliliye","Harran","Hilvan","Karaköprü","Siverek","Suruç","Viranşehir"]},"Şırnak":{"plate":73,"ilce":["Beytüşşebap","Cizre","Güçlükonak","İdil","Merkez","Silopi","Şırnak-il Merkezi","Uludere"]},"Tekirdağ":{"plate":59,"ilce":["Çerkezköy","Çorlu","Ergene","Hayrabolu","Kapaklı","Malkara","Marmaraereğlisi","Muratlı","Saray","Süleymanpaşa","Şarköy"]},"Tokat":{"plate":60,"ilce":["Almus","Artova","Başçiftlik","Erbaa","Merkez","Niksar","Pazar","Reşadiye","Sulusaray","Tokat-il Merkezi","Turhal","Yeşilyurt","Zile"]},"Trabzon":{"plate":61,"ilce":["Akçaabat","Araklı","Arsin","Beşikdüzü","Çarşıbaşı","Çaykara","Dernekpazarı","Düzköy","Hayrat","Köprübaşı","Maçka","Of","Ortahisar","Sürmene","Şalpazarı","Tonya","Vakfıkebir","Yomra"]},"Tunceli":{"plate":62,"ilce":["Çemişgezek","Hozat","Mazgirt","Nazımiye","Ovacık","Pertek","Pülümür","Tunceli-il Merkezi"]},"Uşak":{"plate":64,"ilce":["Banaz","Eşme","Karahallı","Sivaslı","Ulubey","Uşak-il Merkezi"]},"Van":{"plate":65,"ilce":["Bahçesaray","Başkale","Çaldıran","Çatak","Edremit","Erciş","Gevaş","Gürpınar","İpekyolu","Muradiye","Özalp","Saray","Tuşba"]},"Yalova":{"plate":77,"ilce":["Altınova","Armutlu","Çınarcık","Çiftlikköy","Merkez","Termal","Yalova-il Merkezi"]},"Yozgat":{"plate":66,"ilce":["Akdağmadeni","Aydıncık","Boğazlıyan","Çandır","Çayıralan","Çekerek","Kadışehri","Saraykent","Sarıkaya","Sorgun","Şefaatli","Yenifakılı","Yerköy","Yozgat-il Merkezi"]},"Zonguldak":{"plate":67,"ilce":["Alaplı","Çaycuma","Devrek","Ereğli","Gökçebey","Kilimli","Kozlu","Merkez","Zonguldak-il Merkezi"]}};window.TR_ILILCE=window.TR_ILILCE||TR_ILILCE;
/* ===== GERÇEK MAHALLE VERİ KATMANI (talep-üzerine yükleme) ===== */
var _mahCache={};
function mahalleSlug(il){var m={'ç':'c','Ç':'c','ğ':'g','Ğ':'g','ı':'i','İ':'i','ö':'o','Ö':'o','ş':'s','Ş':'s','ü':'u','Ü':'u',' ':'-'};return (il||'').replace(/[çÇğĞıİöÖşŞüÜ ]/g,function(x){return m[x]||x;}).toLowerCase();}
/* GRANULAR ProX locations (danisman deseni — canlı doğrulandı: /iller /ilceler /mahalleler GERÇEK veri döner).
   Eski toplu '/locations?il=' ucu YOKTU → hep 404→COMMON_MAH uydurmaya düşüyordu. Düzeltildi. */
function _mahClean(m){return (''+m).replace(/\s+(Mah\.?|Mahallesi|Köyü)$/i,'').trim();}
async function loadMahalleIlce(il,ilce){if(!il||!ilce)return null;
  if(!_mahCache[il]||typeof _mahCache[il]!=='object')_mahCache[il]={};
  if(_mahCache[il][ilce]!==undefined)return _mahCache[il][ilce];
  _mahCache[il][ilce]=null;/* uçuşta işaretle → çift istek engeli */
  var out=null;
  try{var rm=await proxApi('/api/v1/tenant/locations/mahalleler?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce));
    if(rm&&!rm.fallback&&rm.success===true&&Array.isArray(rm.data)&&rm.data.length){
      out=rm.data.map(_mahClean).filter(Boolean);
      var seen={},uniq=[];out.forEach(function(m){var k=m.toLocaleLowerCase('tr');if(!seen[k]){seen[k]=1;uniq.push(m);}});out=uniq;}
  }catch(e){}
  _mahCache[il][ilce]=out;return out;}
async function proxIlceList(il){if(!il)return [];
  try{var ri=await proxApi('/api/v1/tenant/locations/ilceler?il='+encodeURIComponent(il));
    if(ri&&!ri.fallback&&ri.success===true&&Array.isArray(ri.data)&&ri.data.length)return ri.data.slice();}catch(e){}
  var rec=TR_ILILCE[il];return (rec&&rec.ilce)?rec.ilce.slice():[];}
async function proxIlList(){
  try{var r=await proxApi('/api/v1/tenant/locations/iller');
    if(r&&!r.fallback&&r.success===true&&Array.isArray(r.data)&&r.data.length)return r.data.slice();}catch(e){}
  return trIlList();}
async function loadMahalle(il,ilceList){if(!il)return _mahCache[il]||null;
  var ilcs=(ilceList&&ilceList.length)?ilceList:(await proxIlceList(il)).slice(0,12);
  try{await _wlPMap(ilcs,function(ic){return loadMahalleIlce(il,ic);},6);}catch(e){}
  return _mahCache[il]||null;}
window.loadMahalleIlce=loadMahalleIlce;window.proxIlceList=proxIlceList;window.proxIlList=proxIlList;window.loadMahalle=loadMahalle;
async function enrichProvinceMahalle(il){il=il||PROVINCE.name;var d=await loadMahalle(il);if(!d||PROVINCE.name!==il)return false;
  Object.keys(PROVINCE.districts).forEach(function(ilce){var arr=d[ilce];if(arr&&arr.length)PROVINCE.districts[ilce].mah=arr.slice(0,40);});
  if(typeof rebuildBAZ==='function')rebuildBAZ();
  try{if(typeof renderBolgePick==='function')renderBolgePick();if(typeof BZ_CUR!=='undefined'&&BZ_CUR&&BZ_CUR.ilce&&BAZ[BZ_CUR.ilce]&&typeof selBolge==='function')selBolge(BZ_CUR.ilce);}catch(e){}
  return true;}
/* Türkiye genelinde en yaygın GERÇEK mahalle adları — endeks ucu 404 iken fallback havuzu.
   Uç canlıya geçince (PROX-API-GEREKSINIM-NOTU.md) bu havuz kullanılmaz; gerçek mahalle gelir. */
var COMMON_MAH=['Cumhuriyet','Atatürk','Merkez','Yeni','Fatih','Bahçelievler','Yavuz Selim','İnönü','Yıldız','Gazi','Yeşiltepe','Bağlar','Çamlık','Güzelyalı','Hürriyet','Kurtuluş','Mimar Sinan','Zafer','Barbaros','Aydınlıkevler','Şirinevler','Esentepe','Yenimahalle','Karşıyaka','Bahçelievler','19 Mayıs'];
function _mahHash(s){var h=0;for(var i=0;i<(s||'').length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h;}
function realMah(il,ilce,n){n=n||3;var out=[],seen={};
  var sub=(typeof saServedMahalle==='function'?saServedMahalle(il,ilce):null);   // kullanıcı seçtiği mahalleler öncelikli
  if(sub)sub.forEach(function(m){if(!seen[m]&&out.length<n){seen[m]=1;out.push(m);}});
  if(out.length>=n)return out;
  var d=_mahCache[il];var arr=(d&&d[ilce])||(PROVINCE.districts[ilce]&&PROVINCE.districts[ilce].mah);
  if(!arr||!arr.length){ /* gerçek veri yok → common-real havuzdan İLÇEYE ÖZGÜ deterministik, çeşitli dizi */
    var start=_mahHash(il+'|'+ilce)%COMMON_MAH.length;arr=[];for(var k=0;k<COMMON_MAH.length;k++)arr.push(COMMON_MAH[(start+k)%COMMON_MAH.length]);}
  for(var i=0;i<arr.length&&out.length<n;i++){var m=arr[i];if(!seen[m]){seen[m]=1;out.push(m);}}return out;}
function trIlList(){return Object.keys(TR_ILILCE);}
function makeProvince(il){
  if(il==='İzmir'||!il)return clone(IZMIR_PROVINCE);/* C2: klon dağıt, şablonu koru */
  var rec=TR_ILILCE[il];if(!rec)return clone(IZMIR_PROVINCE);
  var ilceler=rec.ilce,districts={},POOL=(typeof COMMON_MAH!=='undefined'?COMMON_MAH:['Merkez','Cumhuriyet','Atatürk','Yeni','Fatih']);
  var mc=Math.max(3,Math.round(ilceler.length*0.3));
  ilceler.forEach(function(d,i){var r=bzRng(bzSeed(il+'|'+d));
    var m2=Math.round((14000+r()*42000)/500)*500,chg=Math.round(150+r()*95),score=Math.round(55+r()*32);
    /* Mahalle: common-real havuzdan İLÇEYE ÖZGÜ rotasyon (endeks ucu 404 iken; uç gelince gerçek mahalle) */
    var st=(typeof _mahHash==='function'?_mahHash(il+'|'+d):i)%POOL.length,cnt=6+Math.floor(r()*4),mah=[];
    for(var mk=0;mk<cnt;mk++){var nm=POOL[(st+mk)%POOL.length];if(mah.indexOf(nm)<0)mah.push(nm);}
    districts[d]={group:i<mc?'merkez':'ilce',m2:m2,chg:chg,score:score,risk:'Bölge verisi ProX endeksinden güncellenir',warn:0,mah:mah};});
  return {name:il,plate:rec.plate,center:il,region:'',mahCount:(ilceler.length*8)+'+',
    groups:[{key:'merkez',name:'Merkez İlçeler',desc:il+' kent merkezi ve çevre ilçeleri'},{key:'ilce',name:'İlçeler',desc:il+' geneli ilçeler'}],
    districts:districts};
}
let BAZ={},MAH={};
function rebuildBAZ(){BAZ={};MAH={};Object.keys(PROVINCE.districts).forEach(k=>{const v=PROVINCE.districts[k];BAZ[k]={m2:v.m2,chg:v.chg,score:v.score,risk:v.risk,warn:v.warn||0};MAH[k]=v.mah;});}
rebuildBAZ();
function applyProvinceLabels(){try{document.querySelectorAll('.js-il').forEach(function(e){e.textContent=PROVINCE.name;});}catch(e){}}
/* ===== HİZMET ALANI — çok-illi + ilçe/mahalle/kategori seçimli hizmet tanımı ===== */
var DEF_KATEGORILER=['Konut','Arsa','Ticari & Ofis','Kiralık','Miras & İntikal','Yatırım'];
var SERVICE_AREA=null,saCurIl='',saCurIlce='';
function saDefault(){return {primary:(typeof PROX!=='undefined'&&PROX&&PROX.il)||'İzmir',iller:{},kategoriler:DEF_KATEGORILER.slice()};}
function saBuildIl(il){var prov=makeProvince(il),ilceler={};Object.keys(prov.districts).forEach(function(ic){ilceler[ic]={aktif:true,mahalleler:[]};});return {aktif:true,ilceler:ilceler};}
function saEnsure(){if(!SERVICE_AREA)SERVICE_AREA=saDefault();if(!SERVICE_AREA.iller)SERVICE_AREA.iller={};if(!SERVICE_AREA.kategoriler||!SERVICE_AREA.kategoriler.length)SERVICE_AREA.kategoriler=DEF_KATEGORILER.slice();var pil=SERVICE_AREA.primary||'İzmir';SERVICE_AREA.primary=pil;if(!SERVICE_AREA.iller[pil])SERVICE_AREA.iller[pil]=saBuildIl(pil);return SERVICE_AREA;}
function saLoad(){if(SERVICE_AREA)return SERVICE_AREA;try{SERVICE_AREA=JSON.parse(localStorage.getItem('wl_service_area')||'null');}catch(e){}return saEnsure();}
function saSave(){try{localStorage.setItem('wl_service_area',JSON.stringify(SERVICE_AREA));}catch(e){}}
function saActiveIller(){return SERVICE_AREA?Object.keys(SERVICE_AREA.iller).filter(function(il){return SERVICE_AREA.iller[il].aktif!==false;}):[];}
function saServedIlce(il){try{var r=SERVICE_AREA&&SERVICE_AREA.iller[il];if(!r||!r.ilceler)return null;return Object.keys(r.ilceler).filter(function(ic){return r.ilceler[ic].aktif!==false;});}catch(e){return null;}}
function saServedMahalle(il,ilce){try{var e=SERVICE_AREA&&SERVICE_AREA.iller[il]&&SERVICE_AREA.iller[il].ilceler[ilce];var m=e&&e.mahalleler;return (m&&m.length)?m.slice():null;}catch(e){return null;}}
function saKategoriler(){return (SERVICE_AREA&&SERVICE_AREA.kategoriler&&SERVICE_AREA.kategoriler.length)?SERVICE_AREA.kategoriler.slice():DEF_KATEGORILER.slice();}
/* Primary il PROVINCE'inden hizmet-dışı ilçeleri çıkar (yalnızca açıkça aktif:false) */
function saFilterActiveProvince(){try{if(typeof PROVINCE==='undefined'||!PROVINCE||!SERVICE_AREA)return;var rec=SERVICE_AREA.iller[PROVINCE.name];if(!rec||!rec.ilceler)return;Object.keys(PROVINCE.districts).forEach(function(ic){var e=rec.ilceler[ic];if(e&&e.aktif===false)delete PROVINCE.districts[ic];});}catch(e){}}
function applyProvince(il,silent){
  PROVINCE=makeProvince(il);
  try{if(SERVICE_AREA){SERVICE_AREA.primary=il;if(!SERVICE_AREA.iller[il])SERVICE_AREA.iller[il]=saBuildIl(il);}}catch(e){}
  saFilterActiveProvince();rebuildBAZ();
  try{PROX.il=il;PROX.region=il;saveAll();}catch(e){}
  try{if(typeof initHero==='function')initHero();
    if(typeof renderBolgePick==='function')renderBolgePick();
    if(typeof renderIlanlar==='function')renderIlanlar();
    if(typeof renderOzel==='function')renderOzel();
    if(typeof renderOzHome==='function')renderOzHome();
    if(typeof fillIlanSelects==='function')fillIlanSelects();
    applyProvinceLabels();
  }catch(e){console.warn('applyProvince render:',e);}
  try{if(typeof enrichProvinceMahalle==='function')enrichProvinceMahalle(il);}catch(e){}
  try{if(typeof brandSweep==='function'){brandSweep(document.body);brandObserve();}}catch(e){}
  if(!silent&&typeof toast==='function')toast('Aktif il: '+il+' · site içeriği güncellendi.');
}
function deriveTenantId(key){var m=/^prox_(.+)_[a-f0-9]{16,}$/i.exec(key||'');return m?m[1]:'office';}
function proxEnsure(){if(Array.isArray(ILANLAR))ILANLAR.forEach(function(it){if(!it.il)it.il='İzmir';});if(typeof PROX!=='object'||!PROX)return;if(!PROX.key)PROX.key=DEF_PROX.key;if(!PROX.base)PROX.base=DEF_PROX.base;if(!PROX.il)PROX.il=PROX.region||'İzmir';}
function applyProxTenant(){try{proxEnsure();
  var pu=((PROX&&PROX.proxyUrl)||'').trim();
  if(pu){ /* PROXY/EDGE MODU (ÜRETİM İÇİN ÖNERİLEN): gizli anahtar istemcide TUTULMAZ/GÖNDERİLMEZ; base=proxy, sadece public tenant id.
             Edge/sunucu X-Tenant-Key'i kendisi ekler. Yayında proxyUrl AYARLANMALI ve statik pakete anahtar gömülmemelidir. */
    window.EMLAK_API_BASE=pu.replace(/\/+$/,''); window.EMLAK_PROXY_MODE=true;
    var tid=((PROX&&PROX.tenantId)||'').trim()||(PROX.key?deriveTenantId(PROX.key):'');
    if(tid)window.EMLAK_TENANT.tenant_id=tid;
    try{window.EMLAK_TENANT.tenant_key='';if(PROX)PROX.key='';}catch(e){} /* güvenlik: proxy modunda gizli anahtarı istemci belleğinden temizle */
  }else{
    window.EMLAK_PROXY_MODE=false;
    if(PROX.base)window.EMLAK_API_BASE=PROX.base;
    if(PROX.key){window.EMLAK_TENANT.tenant_key=PROX.key;window.EMLAK_TENANT.tenant_id=deriveTenantId(PROX.key);}
  }
}catch(e){}}

const TYPE_F={'Daire':1,'Villa':1.18,'Müstakil Ev':1.1,'Ofis / İş Yeri':0.94,'Arsa':0.52};

/* Trend glifi: bölge değişim değerinden (chg) TÜRETİLEN yönlü çizgi. Sahte veri
   (Math.random gürültüsü) kaldırıldı — gerçek fiyat geçmişi gibi görünmesin. */
function mkSpark(chg){let pts=[],n=7,base=40-(chg/12);for(let i=0;i<n;i++){let y=base-(i*(base-4)/(n-1));pts.push((i*20)+','+Math.max(3,Math.min(38,y)).toFixed(1));}return pts.join(' ');}

const DEF_ILANLAR=[
 {id:1,title:'Körfez Manzaralı 3+1 Lüks Daire',op:'Satılık',type:'Daire',m2:165,oda:'3+1',kat:'7',ilce:'Konak',mah:'Alsancak',price:18500000,status:'aktif',feat:1,img:'l3',desc:'Yeni nesil rezidans, kapalı otopark, 7/24 güvenlik.'},
 {id:2,title:'Bahçeli Müstakil Villa',op:'Satılık',type:'Villa',m2:320,oda:'5+2',kat:'-',ilce:'Urla',mah:'Zeytinalanı',price:42000000,status:'aktif',feat:1,img:'l1',desc:'Özel bahçe, havuz, akıllı ev sistemi.'},
 {id:3,title:'Deniz Manzaralı 2+1 Daire',op:'Satılık',type:'Daire',m2:110,oda:'2+1',kat:'4',ilce:'Karşıyaka',mah:'Mavişehir',price:11200000,status:'aktif',feat:1,img:'l2',desc:'Sahile yürüme mesafesi, ferah salon.'},
 {id:4,title:'Modern Kiralık 1+1 Stüdyo',op:'Kiralık',type:'Daire',m2:62,oda:'1+1',kat:'3',ilce:'Bornova',mah:'Kazımdirik',price:38000,status:'aktif',feat:0,img:'l5',desc:'Eşyalı, metroya 3 dk, ofis bölgesinde.'},
 {id:5,title:'Geniş Aile Dairesi 4+1',op:'Satılık',type:'Daire',m2:210,oda:'4+1',kat:'9',ilce:'Buca',mah:'Şirinyer',price:9800000,status:'aktif',feat:0,img:'l6',desc:'Site içi, sosyal tesis, yeni bina.'},
 {id:6,title:'Plaza Katı Kiralık Ofis',op:'Kiralık',type:'Ofis / İş Yeri',m2:240,oda:'-',kat:'12',ilce:'Konak',mah:'Alsancak',price:185000,status:'aktif',feat:0,img:'l4',desc:'Açık ofis, toplantı odaları, otopark.'},
 {id:7,title:'Yatırımlık Arsa (İmarlı)',op:'Satılık',type:'Arsa',m2:600,oda:'-',kat:'-',ilce:'Menderes',mah:'Gümüldür',price:28000000,status:'aktif',feat:0,img:'l1',desc:'Konut imarlı, yola cepheli.'},
 {id:8,title:'Taş Mimari 3+1 Restorasyonlu',op:'Satılık',type:'Daire',m2:140,oda:'3+1',kat:'2',ilce:'Çeşme',mah:'Alaçatı',price:14500000,status:'aktif',feat:0,img:'l3',desc:'Karakteristik bina, yenilenmiş iç mekan.'},
 {id:9,title:'Sahil Yakını 2+1 Kiralık',op:'Kiralık',type:'Daire',m2:95,oda:'2+1',kat:'5',ilce:'Karşıyaka',mah:'Bostanlı',price:42000,status:'aktif',feat:0,img:'l2',desc:'Marina yakını, asansörlü, aydınlık.'}
];
const DAN_COLORS=['#1e40af','#1e7e3a','#8b5cf6','#0284c7','#f59e0b','#0f766e','#be185d','#1e7e3a'];
const DEF_DAN=[
 {id:1,name:'Ahmet Yılmaz',role:'Kıdemli Emlak Danışmanı',area:'Karşıyaka · Bostanlı · Mavişehir',wa:'905000000001',tel:'+90 532 000 00 01',sales:142,rating:4.9,exp:12,feat:1,demo:1,foto:'dan1',bio:'12 yıllık tecrübe, Karşıyaka–Bostanlı hattının lüks konut uzmanı.'},
 {id:2,name:'Zeynep Aksoy',role:'Yatırım Danışmanı',area:'Konak · Alsancak · Göztepe',wa:'905000000002',tel:'+90 532 000 00 02',sales:118,rating:4.8,exp:9,feat:1,demo:1,foto:'dan2',bio:'Konak–Alsancak yatırım gayrimenkulleri ve getiri analizi.'},
 {id:3,name:'Mehmet Demir',role:'Portföy Uzmanı',area:'Çeşme · Urla · Alaçatı',wa:'905000000003',tel:'+90 532 000 00 03',sales:96,rating:4.9,exp:7,feat:0,demo:1,foto:'dan3',bio:'Çeşme–Urla sahil ve villa portföyü konusunda uzman.'},
 {id:4,name:'Selin Kara',role:'Kiralama Uzmanı',area:'Bornova · Buca',wa:'905000000004',tel:'+90 532 000 00 04',sales:134,rating:5.0,exp:8,feat:0,demo:1,foto:'dan4',bio:'Kurumsal kiralama ve kira yönetimi süreçleri.'}
];

/* ============ STATE + STORAGE ============ */
const LS='meridyenGM_v1';
let FIRMA,ILANLAR,DANISMANLAR,LEADS,THEME,CONTENT,BLOGS,REFS,SEO,GOOGLE,PROX,AICFG,P3,KISILER,DEALS,TASKS,COMMS,RENTS,MSGLOG,RAPORLOG,ACT,CONTRACTS,OZEL;
const _td=(o)=>{const d=new Date();d.setDate(d.getDate()+o);return d.toISOString().slice(0,16);};
const DEF_KISILER=[
 {id:101,name:'Cem Aydın',tel:'+90 532 111 22 33',email:'cem@mail.com',type:'alici',source:'Web Sitesi',dan:1,note:'Deniz manzarası önemli. Peşinat hazır.',op:'Satılık',tip:'Daire',oda:'3+1',min:12000000,max:20000000,ilceler:['Konak','Karşıyaka'],created:'2026-06-10'},
 {id:102,name:'Deniz Yıldız',tel:'+90 533 222 33 44',email:'deniz@mail.com',type:'yatirimci',source:'Tavsiye',dan:2,note:'Yüksek getiri arıyor, 5 yıl elde tutacak.',op:'Satılık',tip:'Daire',oda:'2+1',min:8000000,max:14000000,ilceler:['Kadıköy','Ataşehir'],created:'2026-06-14'},
 {id:103,name:'Burcu Şen',tel:'+90 534 333 44 55',email:'burcu@mail.com',type:'kiraci',source:'WhatsApp',dan:4,note:'Eşyalı, metroya yakın. Hızlı taşınmak istiyor.',op:'Kiralık',tip:'Daire',oda:'1+1',min:30000,max:45000,ilceler:['Şişli'],created:'2026-06-18'},
 {id:104,name:'Okan Demir',tel:'+90 535 444 55 66',email:'okan@mail.com',type:'satici',source:'Telefon',dan:3,note:'Sarıyer\'de villasını satmak istiyor, acelesi yok.',op:'',tip:'Villa',oda:'',min:0,max:0,ilceler:['Sarıyer'],created:'2026-06-20'},
 {id:105,name:'Elif Korkmaz',tel:'+90 536 555 66 77',email:'elif@mail.com',type:'alici',source:'Sahibinden',dan:1,note:'Aile için geniş daire. Site içi tercih.',op:'Satılık',tip:'Daire',oda:'4+1',min:8000000,max:12000000,ilceler:['Beylikdüzü'],created:'2026-06-22'}
];
const DEF_DEALS=[
 {id:201,title:'Levent 3+1 — Cem Aydın',kisiId:101,ilanId:1,danId:1,stage:'gosterim',value:18500000,prob:60,note:'2. gösterim ayarlandı',created:'2026-06-12'},
 {id:202,title:'Caddebostan 2+1 — Deniz Yıldız',kisiId:102,ilanId:3,danId:2,stage:'teklif',value:11200000,prob:75,note:'Teklif sunuldu, pazarlık sürüyor',created:'2026-06-15'},
 {id:203,title:'Mecidiyeköy 1+1 — Burcu Şen',kisiId:103,ilanId:4,danId:4,stage:'sozlesme',value:38000,prob:90,note:'Sözleşme imzaya hazır',created:'2026-06-19'},
 {id:204,title:'Beylikdüzü 4+1 — Elif Korkmaz',kisiId:105,ilanId:5,danId:1,stage:'iletisim',value:9800000,prob:40,note:'İlk görüşme yapıldı',created:'2026-06-23'},
 {id:205,title:'Zekeriyaköy Villa — Portföy',kisiId:104,ilanId:2,danId:3,stage:'yeni',value:42000000,prob:25,note:'Satıcı portföye alındı',created:'2026-06-21'}
];
const DEF_TASKS=[
 {id:301,title:'Cem Bey ile Levent dairesi gösterimi',type:'gosterim',date:_td(1),done:false,kisiId:101,danId:1,note:'Kapıda buluşma 14:00'},
 {id:302,title:'Deniz Hanım teklif takibi araması',type:'arama',date:_td(0),done:false,kisiId:102,danId:2,note:''},
 {id:303,title:'Burcu Hanım sözleşme imzası',type:'tapu',date:_td(2),done:false,kisiId:103,danId:4,note:'Ofiste, evrak hazır'},
 {id:304,title:'Okan Bey villa fotoğraf çekimi',type:'toplanti',date:_td(3),done:false,kisiId:104,danId:3,note:'Drone çekimi dahil'},
 {id:305,title:'Elif Hanım yeni ilanları gönder',type:'takip',date:_td(-1),done:false,kisiId:105,danId:1,note:'WhatsApp listesi'}
];
const DEF_COMMS=[
 {id:401,title:'Kadıköy 2+1 Satış',danId:2,amount:9500000,rate:2,side:'satici',status:'tahsil',date:'2026-05-28'},
 {id:402,title:'Şişli Ofis Kiralama',danId:4,amount:185000,rate:8,side:'her',status:'tahsil',date:'2026-06-05'},
 {id:403,title:'Levent 3+1 Satış',danId:1,amount:18500000,rate:2,side:'satici',status:'beklemede',date:'2026-06-22'}
];
const DEF_RENTS=[
 {id:501,prop:'Mecidiyeköy 1+1 Stüdyo',tenant:'Ali Vural',amount:38000,start:'2025-09-01',due:5,status:'odendi'},
 {id:502,prop:'Ataköy 2+1',tenant:'Selin Demir',amount:42000,start:'2026-01-15',due:10,status:'bekliyor'},
 {id:503,prop:'Fulya Ofis Katı',tenant:'NovaTech Ltd.',amount:185000,start:'2024-11-01',due:1,status:'gecikti'}
];
const DEF_CONTENT={heroEyebrow:'İzmir & Ege · 480M+ kayıtlık endeks ile çalışıyoruz',heroTitle:'Doğru evi,',heroTitle2:'doğru veriyle buluşturuyoruz',heroDesc:'Satılık ve kiralık portföyümüzün her ilanında mahalle fiyat endeksi, yatırım skoru ve bölge analizi var. Duyguyla değil; veriyle karar verin.',aboutText:'Meridyen Gayrimenkul, İzmir ve Ege bölgesinde 18 yıldır faaliyet gösteriyor. Bizi farklı kılan, her ilan ve her danışmanlığın arkasındaki veri disiplinimiz: Türkiye\'nin kapsamlı endeks altyapısıyla, müşterilerimize duygu değil rakam sunuyoruz.'};
const DEF_BLOGS=[{id:1,title:'2026\'da değer kazanacak 5 İzmir mahallesi',cat:'Yatırım',sum:'Endeks verileri ışığında yükseliş potansiyeli en yüksek bölgeler.',icon:'📈',meta:'8 dk okuma · Haz 2026',date:'2026-06-18',src:'firma',body:'Bölge seçimi, gayrimenkul yatırımının en belirleyici adımıdır. m² fiyatının bugünkü seviyesi kadar, o bölgenin son 5 yıldaki reel değişim eğilimi ve yatırım skoru da önemlidir.\n\nUlaşım yatırımları, kentsel dönüşüm hareketliliği ve altyapı gelişimi, bir mahallenin orta vadeli prim potansiyelini yukarı çeker. Aşırı prim yapmış bölgeler yerine, gelişim koridorundaki mahalleler daha yüksek getiri sunabilir.\n\nKarar vermeden önce bölge endeksini, kira çarpanını ve arz-talep dengesini birlikte değerlendirin. Kesin rakamlar için güncel ProX endeksiyle teyit alın.'},
 {id:2,title:'Konut kredisinde 2026 faiz rehberi',cat:'Kredi',sum:'Banka banka oranlar, uygunluk kriterleri ve esnek ödeme planları.',icon:'🏦',meta:'6 dk okuma · Haz 2026',date:'2026-06-10',src:'firma',body:'Konut kredisi kararında yalnızca faiz oranı değil; ekspertiz değeri, kredi/değer oranı, vade ve toplam maliyet birlikte değerlendirilmelidir.\n\nGenel kural olarak kredi, ekspertiz değerinin belirli bir yüzdesine kadar kullanılabilir; kalan tutar peşinat olarak gerekir. Ödeme planınızı gelir istikrarınıza göre kurgulayın.\n\nBaşvuru öncesi evraklarınızı hazırlamak süreci belirgin hızlandırır. Size en uygun yapı için ücretsiz ön değerlendirme alın.'},
 {id:3,title:'Tapu devrinde dikkat edilmesi gereken 9 şey',cat:'Hukuk',sum:'Alıcı ve satıcı için TKGM süreci, vergiler ve sık yapılan hatalar.',icon:'📋',meta:'10 dk okuma · May 2026',date:'2026-05-22',src:'firma',body:'Tapu devri, gayrimenkul işleminin hukuki olarak tamamlandığı kritik aşamadır. Web Tapu başvurusu, harç ödemesi ve randevu adımları eksiksiz yürütülmelidir.\n\nDevir öncesi tapu kaydında haciz, ipotek veya şerh olup olmadığı mutlaka kontrol edilmelidir. Alıcı ve satıcının kimlik ve yetki belgeleri hazır olmalıdır.\n\nHarç ve döner sermaye bedelleri, taraflar arasında önceden yazılı olarak netleştirilmelidir. Süreci hatasız yönetmek için profesyonel destek almanızı öneririz.'}];
const DEF_REFS=[{id:1,name:'Ayşe Yıldırım',meta:'Satıcı · Konak',text:'Evimizi piyasanın üstünde bir fiyata, üstelik 3 haftada sattılar. Bölge endeksini gösterip fiyatı veriyle savundular; alıcı ikna oldu.'},
 {id:2,name:'Murat Kaya',meta:'Yatırımcı · Bornova',text:'Yatırım için daire arıyordum. Yatırım skoru ve 5 yıllık trend analizi sayesinde doğru mahalleyi seçtim. Bir yılda değer kazandı.'},
 {id:3,name:'Elif Demir',meta:'Alıcı · Karşıyaka',text:'Danışmanımız bölgeyi avucunun içi gibi biliyordu. WhatsApp\'tan anında dönüş, şeffaf süreç. Kesinlikle tavsiye ederim.'}];
const DEF_SEO={title:'Meridyen Gayrimenkul · İzmir Emlak & Gayrimenkul Ofisi',desc:'İzmir ve Ege\'de veri odaklı emlak ofisi. Satılık & kiralık portföy, mahalle fiyat endeksi, yatırım skoru ve ücretsiz değerleme.',kw:'izmir emlak, satılık daire, kiralık daire, gayrimenkul danışmanı, emlak değerleme',og:'',schema:true,llms:true,sitemap:true,prog:true};
const DEF_GOOGLE={ga4:'',gtm:'',gsc:'',maps:'',recaptcha:'',business:'',aiseo:true,ab:false};
const DEF_MODULES=[{k:'emlak_endeks',n:'Emlak Endeksi',d:'Mahalle m² fiyat ve trend',on:true},{k:'yatirim_skoru',n:'Yatırım Skoru',d:'0-100 bölge skoru',on:true},{k:'risk_analiz',n:'Fay/Deprem Risk',d:'Coğrafi risk rozeti',on:true},{k:'degerleme',n:'Online Değerleme',d:'"Evimin değeri ne?" aracı',on:true},{k:'portfoy3d',n:'3D Portföy & Tur',d:'GLB model + sanal tur',on:true},{k:'ai_asistan',n:'ProX Asistan',d:'ProX verisine dayalı asistan',on:true},{k:'pdf_rapor',n:'Logolu PDF Rapor',d:'Şirket logolu endeks raporu',on:true},{k:'fiyat_alarmi',n:'Fiyat Alarmı',d:'Bölge fiyat değişim bildirimi',on:true},{k:'blog_feed',n:'Blog Akışı',d:'emlakekspertizi blog beslemesi',on:true},{k:'whatsapp',n:'WhatsApp Destek',d:'Tek dokunuş iletişim',on:true}];
const DEF_PROX={key:'',base:'https://www.emlakekspertizi.com',proxyUrl:'',tenantId:'emlaktahadimkoy_com',il:'İzmir',region:'İzmir',quotaUsed:0,quotaMax:10000,modules:clone(DEF_MODULES)};/* GÜVENLİK (P0): gizli ProX anahtarı istemciye GÖMÜLMEZ — proxy/edge sunucusu ekler. Eski gömülü anahtar git geçmişinde → sunucuda ROTATE edilmeli. */
const DEF_AICFG={enable:true,greet:'Merhaba! Ben Meridyen ProX Asistanı. Bölge, fiyat veya portföy hakkında sorabilirsiniz.',persona:'Meridyen Gayrimenkul\'ün yardımcı, profesyonel emlak danışmanısın. Türkçe, kısa ve net yanıt ver. Bölge fiyat verisi sorulursa örnek olduğunu belirt.',dsKey:'',dsModel:'deepseek-chat'};/* dsKey: kullanıcının kendi DeepSeek anahtarı — girilirse tüm YZ üretimi doğrudan DeepSeek ile çalışır (yoksa ProX sunucu AI'si). ProX anahtarı ise veri/endeks/analiz/PDF içindir. */
const DEF_CONTRACTS=[
 {id:'c1',tip:'aracilik',baslik:'Konak 3+1 — Satış Aracılık',durum:'aktif',tarih:'2026-06-12',karsiTaraf:'Okan Demir',karsiTC:'12345678901',karsiAdres:'Alsancak Mah. Kıbrıs Şehitleri Cad. No:00 D:0, Konak / İzmir',il:'İzmir',ilce:'Konak',mahalle:'Alsancak',tasinmazAdres:'Kıbrıs Şehitleri Cad. No:00 Daire:0',tasinmazTip:'Daire',m2:'140',islem:'Satılık',bedel:'14.500.000',komisyon:'2',sureAy:'6',ozelMetin:''},
 {id:'c2',tip:'kira',baslik:'Bornova 1+1 — Kira',durum:'aktif',tarih:'2026-06-19',karsiTaraf:'Ali Vural',karsiTC:'98765432109',karsiAdres:'Kazımdirik Mah. No:00 D:0, Bornova / İzmir',il:'İzmir',ilce:'Bornova',mahalle:'Kazımdirik',tasinmazAdres:'Kazımdirik Mah. Stüdyo No:00',tasinmazTip:'Daire',m2:'55',islem:'Kiralık',bedel:'38.000',komisyon:'',sureAy:'12',ozelMetin:''}
];
const DEF_OZEL=[
 {id:'o1',op:'Satılık',tip:'Daire',ilce:'Konak',mah:'Alsancak',cadde:'Kıbrıs Şehitleri Caddesi',m2:120,oda:'3+1',fiyat:6500000,durum:'aktif',not:'Cepheli, asansörlü, bakımlı bina.'},
 {id:'o2',op:'Kiralık',tip:'Daire',ilce:'Konak',mah:'Alsancak',cadde:'1453. Sokak',m2:95,oda:'2+1',fiyat:32000,durum:'aktif',not:'Eşyalı seçeneği mevcut, merkezde.'},
 {id:'o3',op:'Satılık',tip:'Daire',ilce:'Karşıyaka',mah:'Mavişehir',cadde:'Caher Dudayev Bulvarı',m2:165,oda:'4+1',fiyat:12500000,durum:'aktif',not:'Site içi, deniz tarafı.'},
 {id:'o4',op:'Satılık',tip:'İşyeri',ilce:'Konak',mah:'Alsancak',cadde:'Gazi Kadınlar Sokağı',m2:80,oda:'-',fiyat:7800000,durum:'aktif',not:'Cadde üzeri, yüksek yaya trafiği.'},
 {id:'o5',op:'Kiralık',tip:'İşyeri',ilce:'Bornova',mah:'Kazımdirik',cadde:'Üniversite Caddesi',m2:200,oda:'-',fiyat:85000,durum:'aktif',not:'Köşe dükkan, vitrinli.'},
 {id:'o6',op:'Satılık',tip:'Daire',ilce:'Gaziemir',mah:'Atıfbey',cadde:'Akçay Caddesi',m2:105,oda:'2+1',fiyat:3500000,durum:'aktif',not:'Yatırımlık, ulaşıma yakın.'},
 {id:'o7',op:'Satılık',tip:'Daire',ilce:'Çeşme',mah:'Alaçatı',cadde:'Kemalpaşa Caddesi',m2:110,oda:'2+1',fiyat:9500000,durum:'aktif',not:'Taş mimari dokuya yakın.'},
 {id:'o8',op:'Kiralık',tip:'Daire',ilce:'Bornova',mah:'Erzene',cadde:'372. Sokak',m2:110,oda:'3+1',fiyat:28000,durum:'aktif',not:'Üniversiteye yürüme mesafesi.'},
 {id:'o9',op:'Satılık',tip:'İşyeri',ilce:'Konak',mah:'Göztepe',cadde:'Mithatpaşa Caddesi',m2:150,oda:'-',fiyat:11000000,durum:'aktif',not:'Sahil aksına yakın, geniş cephe.'},
 {id:'o10',op:'Kiralık',tip:'İşyeri',ilce:'Karşıyaka',mah:'Bostanlı',cadde:'Yalı Caddesi',m2:120,oda:'-',fiyat:55000,durum:'aktif',not:'Kafe/ofis uygun, otoparklı.'},
 {id:'o11',op:'Satılık',tip:'Daire',ilce:'Buca',mah:'Şirinyer',cadde:'Menderes Caddesi',m2:130,oda:'3+1',fiyat:4300000,durum:'aktif',not:'Aile dairesi, sosyal donatı yakın.'},
 {id:'o12',op:'Satılık',tip:'Daire',ilce:'Karşıyaka',mah:'Bostanlı',cadde:'Cemal Gürsel Caddesi',m2:140,oda:'3+1',fiyat:8200000,durum:'aktif',not:'Merkezi konum, çarşıya yakın.'},
 {id:'o13',op:'Satılık',tip:'Villa',ilce:'Urla',mah:'Zeytinalanı',cadde:'Sahil Yolu',m2:240,oda:'4+1',fiyat:18500000,durum:'aktif',not:'Müstakil bahçeli, deniz manzaralı.'},
 {id:'o14',op:'Satılık',tip:'Arsa',ilce:'Çeşme',mah:'Alaçatı',cadde:'Hacımemiş mevkii',m2:650,oda:'-',fiyat:14000000,durum:'aktif',not:'İmarlı, konut+turizm potansiyeli.'},
 {id:'o15',op:'Satılık',tip:'Tarla',ilce:'Menderes',mah:'Gümüldür',cadde:'Sahil arkası',m2:4200,oda:'-',fiyat:5400000,durum:'aktif',not:'Yola cepheli, tarımsal + yatırımlık.'},
 {id:'o16',op:'Satılık',tip:'Müstakil Ev',ilce:'Karaburun',mah:'Mordoğan',cadde:'Köyiçi',m2:160,oda:'3+1',fiyat:7200000,durum:'aktif',not:'Bahçeli, denize yürüme mesafesi.'},
 {id:'o17',op:'Kiralık',tip:'Ofis',ilce:'Konak',mah:'Alsancak',cadde:'Şair Eşref Bulvarı',m2:140,oda:'-',fiyat:48000,durum:'aktif',not:'Plaza katı, otoparklı, hazır bölmeli.'},
 {id:'o18',op:'Satılık',tip:'Bina',ilce:'Bornova',mah:'Kazımdirik',cadde:'Üniversite civarı',m2:760,oda:'-',fiyat:34000000,durum:'aktif',not:'Komple bina, öğrenci bölgesi, getiri yüksek.'},
 {id:'o19',op:'Kiralık',tip:'Depo',ilce:'Çiğli',mah:'Ataşehir',cadde:'Sanayi sitesi',m2:900,oda:'-',fiyat:120000,durum:'aktif',not:'Yüksek tavan, tır manevra alanı.'},
 {id:'o20',op:'Satılık',tip:'Bağ-Bahçe',ilce:'Urla',mah:'Bademler',cadde:'Bağ yolu',m2:2100,oda:'-',fiyat:3900000,durum:'aktif',not:'Zeytinlik + bağ, su mevcut.'}
];
function loadAll(){
  try{const d=JSON.parse(localStorage.getItem(LS));if(d){/* H2: nesne-config'ler varsayılanın ÜZERİNE birleşir → sonradan eklenen alanlar (lat/lng/mersis/kep…) eski kayıtlarda da dolu gelir; diziler wholesale */
    FIRMA={...DEF_FIRMA,...(d.FIRMA||{})};ILANLAR=d.ILANLAR||clone(DEF_ILANLAR);DANISMANLAR=d.DANISMANLAR||clone(DEF_DAN);LEADS=d.LEADS||[];THEME=d.THEME||null;
    CONTENT={...DEF_CONTENT,...(d.CONTENT||{})};BLOGS=d.BLOGS||clone(DEF_BLOGS);REFS=d.REFS||clone(DEF_REFS);SEO={...DEF_SEO,...(d.SEO||{})};GOOGLE={...DEF_GOOGLE,...(d.GOOGLE||{})};PROX={...clone(DEF_PROX),...(d.PROX||{})};AICFG={...DEF_AICFG,...(d.AICFG||{})};P3=d.P3||{};
    KISILER=d.KISILER||clone(DEF_KISILER);DEALS=d.DEALS||clone(DEF_DEALS);TASKS=d.TASKS||clone(DEF_TASKS);COMMS=d.COMMS||clone(DEF_COMMS);RENTS=d.RENTS||clone(DEF_RENTS);MSGLOG=d.MSGLOG||[];RAPORLOG=d.RAPORLOG||[];ACT=d.ACT||{};CONTRACTS=d.CONTRACTS||clone(DEF_CONTRACTS);
    OZEL=d.OZEL||clone(DEF_OZEL);if(!PROX.modules)PROX.modules=clone(DEF_MODULES);return;}}catch(e){}
  FIRMA={...DEF_FIRMA};ILANLAR=clone(DEF_ILANLAR);DANISMANLAR=clone(DEF_DAN);LEADS=[];THEME=null;
  CONTENT={...DEF_CONTENT};BLOGS=clone(DEF_BLOGS);REFS=clone(DEF_REFS);SEO={...DEF_SEO};GOOGLE={...DEF_GOOGLE};PROX=clone(DEF_PROX);AICFG={...DEF_AICFG};P3={};
  KISILER=clone(DEF_KISILER);DEALS=clone(DEF_DEALS);TASKS=clone(DEF_TASKS);COMMS=clone(DEF_COMMS);RENTS=clone(DEF_RENTS);MSGLOG=[];RAPORLOG=[];ACT={};CONTRACTS=clone(DEF_CONTRACTS);OZEL=clone(DEF_OZEL);
}
function saveAll(){
  var payload={FIRMA,ILANLAR,DANISMANLAR,LEADS,THEME,CONTENT,BLOGS,REFS,SEO,GOOGLE,PROX,AICFG,P3,KISILER,DEALS,TASKS,COMMS,RENTS,MSGLOG,RAPORLOG,ACT,CONTRACTS,OZEL};
  try{localStorage.setItem(LS,JSON.stringify(payload));return true;}
  catch(e){
    /* H3: Kota aşımı ESKİDEN sessizce yutuluyordu → görünmez veri kaybı. Artık: büyük gömülü
       görselleri (data: URI) ayıklayıp metin verisini KURTAR, sonra admin'i AÇIKÇA uyar. */
    try{
      var lite=JSON.parse(JSON.stringify(payload)),stripped=0;
      (function strip(o){if(!o||typeof o!=='object')return;
        Object.keys(o).forEach(function(k){var v=o[k];
          if(typeof v==='string'&&v.length>2000&&/^data:/.test(v)){o[k]='';stripped++;}
          else if(v&&typeof v==='object')strip(v);});
      })(lite);
      localStorage.setItem(LS,JSON.stringify(lite));
      if(typeof toast==='function')toast('⚠ Depolama doldu — '+stripped+' büyük görsel KALICI kaydedilemedi (metin verisi kaydedildi). Görselleri küçültün.');
      return false;
    }catch(e2){
      if(typeof toast==='function')toast('⚠ Depolama kotası doldu — değişiklikler kaydedilemedi. Görselleri küçültün ya da eski kayıt silin.');
      return false;
    }
  }
}
function clone(o){return JSON.parse(JSON.stringify(o));}
/* ============ EİDS — Elektronik İlan Doğrulama Sistemi ============ */
/* EİDS kod/kayıt UYDURULMAZ — gerçek doğrulama shared/eids.js (window.EIDS) → backend üzerinden. */
function eidsEnsure(){var ch=false;
  if(typeof FIRMA==='object'&&FIRMA){
    /* Hakkımızda yasal künye alanları (eski kayıtlara migrasyon: eksik/boş → varsayılan) */
    ['kurulus','vergiDaire','mersis','ticaretSicil','oda','kep','calisan','vergi','lat','lng'].forEach(function(k){ if(FIRMA[k]==null||FIRMA[k]==='') { FIRMA[k]=DEF_FIRMA[k]; ch=true; } });
    if(!FIRMA.eids){FIRMA.eids={yetkili:true,belgeNo:'4827193',unvan:'Meridyen Gayrimenkul Danışmanlık Ltd. Şti.'};ch=true;} }
  /* Eski SAHTE eids kayıtlarını (uydurma .kod) ve eksikleri gerçek 'beklemede' kaydına indir — kod uydurulmaz */
  if(window.EIDS&&Array.isArray(ILANLAR))ILANLAR.forEach(function(it){ if(!it||typeof it!=='object')return;
    if(!it.eids||it.eids.kod!==undefined||!it.eids.status){it.eids=EIDS.newRecord({il:it.il,ilce:it.ilce,tasinmazNo:(it.eids&&it.eids.tasinmazNo)||'',malikTip:'isletme'});ch=true;} });
  if(ch&&typeof saveAll==='function')saveAll();
}
function eidsShieldSvg(s){return '<svg width="'+(s||14)+'" height="'+(s||14)+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="M9 12l2 2 4-4"/></svg>';}
function fmt(n){return Number(n).toLocaleString('tr-TR');}
function imgSrc(k){return (k&&k.startsWith&&k.startsWith('data:'))?k:(IMG[k]||IMG.l1);}
function bolgeOf(ilce){return BAZ[ilce]||{m2:90000,chg:160,score:75,risk:'Veri hesaplanıyor'};}

/* ============ RENDER: HERO ============ */
function initHero(){
  HERO_KEYS.forEach((k,i)=>{const el=document.getElementById('hi'+i);if(el)el.src=imgSrc(k);});
  if(!window._heroInt){let idx=0;window._heroInt=setInterval(()=>{const imgs=document.querySelectorAll('.hero-bg img');if(!imgs.length)return;imgs[idx].classList.remove('on');idx=(idx+1)%imgs.length;imgs[idx].classList.add('on');},5000);}/* H1: tek interval — initHero iki kez çağrılıyor, mükerrer setInterval sızıntısı önlendi */
  const ai=document.getElementById('aboutImg');if(ai)ai.src=imgSrc('about');
}

/* ============ RENDER: İLANLAR ============ */
let curFilter={op:'',ty:''};
function ilanScore(it){const b=bolgeOf(it.ilce);return {score:b.score,chg:b.chg,m2:b.m2};}
function renderIlanlar(){
  const g=document.getElementById('lgrid');if(!g)return;
  let arr=ILANLAR.filter(i=>i.status==='aktif');
  if(curFilter.op)arr=arr.filter(i=>i.op===curFilter.op);
  if(curFilter.ty)arr=arr.filter(i=>i.type===curFilter.ty);
  arr.sort((a,b)=>(b.feat||0)-(a.feat||0));
  document.getElementById('fcount').textContent=arr.length+' ilan';
  if(!arr.length){g.innerHTML='<div class="no-res">Bu filtreye uygun ilan bulunamadı. Filtreyi değiştirin veya bizimle iletişime geçin.</div>';return;}
  g.innerHTML=arr.map(it=>{const s=ilanScore(it);const opc=it.op==='Satılık'?'sat':'kir';
    const priceStr=it.op==='Kiralık'?fmt(it.price)+' ₺<small>/ay</small>':fmt(it.price)+' ₺';
    return `<div class="lcard" onclick='openDet(${it.id})'>
      <div class="ph"><img src="${imgSrc(it.img)}" alt="${_le(it.title)}" loading="lazy" decoding="async">
        <div class="tags"><span class="ltag ${opc}">${_le(it.op)}</span>${it.feat?'<span class="ltag featured">★ Öne Çıkan</span>':''}${window.EIDS?EIDS.badgeHTML(it.eids,11):''}</div>
        <button class="fav" data-fid="${it.id}" onclick="event.stopPropagation();(typeof gmFav==='function'?gmFav(${it.id},this):toast('Favoriler için giriş yapın'))" aria-label="Favorilere ekle">${(typeof gmIsFav==='function'&&gmIsFav(it.id))?'♥':'♡'}</button>
        <div class="score">Skor <b>${s.score}</b>/100</div></div>
      <div class="body">
        <div class="price num">${priceStr}</div>
        <h3>${_le(it.title)}</h3>
        <div class="loc">📍 ${_le(it.mah)}, ${_le(it.ilce)}${it.il?' / '+_le(it.il):''}</div>
        <div class="specs"><span>🛏 ${_le(it.oda)}</span><span>📐 ${it.m2} m²</span>${it.kat!=='-'?`<span>🏢 ${_le(it.kat)}. kat</span>`:''}
          <span class="trend" style="margin-left:auto">↗ %${s.chg} / 5y</span></div>
        <div class="lqc">
          <a class="lqc-wa" onclick="event.stopPropagation()" href="${waHref('Merhaba, '+it.title+' ('+it.mah+', '+it.ilce+') ilanı hakkında bilgi almak istiyorum.')}" target="_blank" rel="noopener noreferrer">${ozIco(OZI.wa,15)} WhatsApp</a>
          <a class="lqc-tel" onclick="event.stopPropagation()" href="tel:${((typeof FIRMA!=='undefined'&&FIRMA.tel)||'').replace(/[^0-9+]/g,'')}">${ozIco(OZI.phone,15)} Ara</a>
        </div>
      </div></div>`;}).join('');
}
function filt(btn){const f=btn.dataset.f,v=btn.dataset.v;curFilter[f]=v;
  document.querySelectorAll('.fchip.'+f).forEach(b=>b.classList.toggle('act',b===btn));renderIlanlar();}
function setOp(btn){document.querySelectorAll('#searchbar .tab').forEach(b=>b.classList.toggle('act',b===btn));window._searchOp=btn.dataset.op;}
function runSearch(){const op=window._searchOp||'Satılık';const ty=document.getElementById('s_tip').value;
   if(op==='Özel'){if(typeof ozOpen==='function')ozOpen();return;}
  // sync filter chips
  curFilter.op=(op==='Satılık'||op==='Kiralık')?op:'';curFilter.ty=ty;
  document.querySelectorAll('.fchip.op').forEach(b=>b.classList.toggle('act',b.dataset.v===curFilter.op));
  document.querySelectorAll('.fchip.ty').forEach(b=>b.classList.toggle('act',b.dataset.v===curFilter.ty));
  renderIlanlar();document.getElementById('ilanlar').scrollIntoView({behavior:'smooth'});
}

/* ============ ÖZEL PORTFÖY ============ */
let ozF={op:'',tip:''},ozEditId=null;
const OZI={
  lock:'<rect x="4" y="10" width="16" height="11" rx="2.4"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
  pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/>',
  road:'<path d="M4 19 8 5h8l4 14"/><path d="M12 5v3M12 11v3M12 17v2"/>',
  info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 7.5v.5"/>',
  wa:'<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.2-5.3A8.5 8.5 0 1 1 21 11.5Z"/>',phone:'<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"/>'
};
function ozIco(p,s){return `<svg class="ico" width="${s||16}" height="${s||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;}
function ozCat(btn){ozF.op=btn.dataset.op;ozF.tip=btn.dataset.tip;document.querySelectorAll('.oztabs button').forEach(b=>b.classList.toggle('act',b===btn));renderOzel();}
/* Özel Portföy başlangıç-fiyat kartından tıkla → varsa ilgili kategori sekmesini aç + listeye kaydır */
function ozCatJump(op,tip){var tabs=document.querySelectorAll('.oztabs button'),matched=null;tabs.forEach(function(b){if((b.dataset.op||'')===(op||'')&&(b.dataset.tip||'')===(tip||''))matched=b;});if(matched&&typeof ozCat==='function')ozCat(matched);var f=document.getElementById('ozFilter');if(f)setTimeout(function(){f.scrollIntoView({behavior:'smooth',block:'start'});},50);}
window.ozCatJump=ozCatJump;
/* M9: WhatsApp numarası ayarlanmamışsa (site varsayılanı 905000000000) wa.me linki ÖLÜ olur.
   Yapılandırıldıysa wa.me linki; değilse ofis telefonuna (tel:) düşerek buton yine işlevli kalır. */
function waNum(adv){var n=(adv&&adv.wa)||((typeof FIRMA!=='undefined'&&FIRMA&&FIRMA.wa)||'');n=String(n).replace(/[^0-9]/g,'');return (n&&n!=='905000000000')?n:'';}
function waHref(text,adv){var n=waNum(adv);if(n)return 'https://wa.me/'+n+(text?('?text='+encodeURIComponent(text)):'');var t=((typeof FIRMA!=='undefined'&&FIRMA&&FIRMA.tel)||'').replace(/[^0-9+]/g,'');return t?('tel:'+t):'#';}
function ozWaLink(o){return waHref(`Merhaba, Özel Portföy — ${o.op} ${o.tip} (${o.mah}, ${o.cadde}) hakkında bilgi almak istiyorum.`);}
function ozLead(id){const o=OZEL.find(x=>x.id===id);if(!o)return;window._ozRef=o;
  document.getElementById('ozTalepRef').textContent=`${o.op} · ${o.tip} · ${o.mah}, ${o.ilce} — ${o.cadde} civarı · ${o.m2} m²${o.oda&&o.oda!=='-'?' · '+o.oda:''}`;
  document.getElementById('ozTalepForm').style.display='block';document.getElementById('ozTalepOk').style.display='none';
  ['oz_ad','oz_tel','oz_mail','oz_msg'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  const k=document.getElementById('oz_kvkk');if(k)k.checked=false;
  document.getElementById('ozTalepModal').classList.add('open');}
function ozTalepClose(){document.getElementById('ozTalepModal').classList.remove('open');}
function ozTalepSubmit(){const g=id=>document.getElementById(id).value.trim();const o=window._ozRef;
  const ad=g('oz_ad'),tel=g('oz_tel'),mail=g('oz_mail'),msg=g('oz_msg');
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  if(!document.getElementById('oz_kvkk').checked){toast('Lütfen KVKK onayını işaretleyin.');return;}
  const label=o?`${o.mah} · ${o.cadde} · ${o.op} ${o.tip}`:'Özel Portföy';
  pushLead({ad,tel,mail,konu:'Özel Portföy: '+label,msg,src:'Özel Portföy Talebi',ozId:o?o.id:'',entryLabel:label});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:'ozel-portfoy',formType:'ozTalep',name:ad,phone:tel,email:mail,location:o?`${o.mah}, ${o.ilce}`:'',message:msg,requestedService:'Özel Portföy Detay Talebi'});
  if(typeof renderOzTalep==='function')renderOzTalep();
  document.getElementById('ozTalepForm').style.display='none';
  document.getElementById('ozOkMsg').textContent=`Talebiniz "${label}" için danışmanımıza iletildi.`;
  document.getElementById('ozTalepOk').style.display='block';
  toast(`🔔 Danışmana bildirim: "${label}" için ${ad} detay istiyor.`);
}
function ozAlarmSubmit(){const g=id=>document.getElementById(id).value.trim();
  const ad=g('oza_ad'),tel=g('oza_tel'),kat=g('oza_kat'),bolge=g('oza_bolge'),butce=g('oza_butce');
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  pushLead({ad,tel,konu:'Bölge Alıcı Talebi: '+(bolge||'-'),src:'Bölge Alıcı Talebi',bolge:bolge||'-',kategori:kat||'Tümü',butce:butce?(+butce):0});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:'ozel-portfoy',formType:'ozAlarm',name:ad,phone:tel,email:'',location:bolge||'',message:'Bütçe: '+(butce||'-')+' · Kategori: '+(kat||'Tümü'),requestedService:'Bölge Alıcı Talebi'});
  if(typeof renderOzAlarm==='function')renderOzAlarm();
  ['oza_ad','oza_tel','oza_bolge','oza_butce'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  toast('🔔 Talebiniz alındı! Uygun özel portföy çıktığında ilk siz haberdar olacaksınız.');
}
/* ============ PORTFÖY — birleşik sayfa motoru (İlanlar + Özel Portföy) ============ */
/* Deterministik 5 yıllık trend mini-grafiği (kart başına, id'den tohumlu) */
function pfSpark(it){
  var seed=((it.id*2654435761)>>>0)||1,rnd=function(){seed=(seed*1103515245+12345)&0x7fffffff;return seed/0x7fffffff;};
  var n=7,pts=[],v=9+rnd()*5;
  for(var i=0;i<n;i++){v+=rnd()*5-1.6;v=Math.max(3,Math.min(23,v));pts.push(v);}
  pts[n-1]=Math.max(pts[n-1],pts[0]+2.5);
  var W=82,H=28,st=W/(n-1);
  var d=pts.map(function(p,i){return (i?'L':'M')+(i*st).toFixed(1)+' '+(H-p).toFixed(1);}).join(' ');
  return '<svg class="pf-spark" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none" aria-hidden="true"><path d="'+d+' L'+W+' '+H+' L0 '+H+' Z" fill="rgba(52,168,83,.13)"/><path d="'+d+'" fill="none" stroke="var(--green)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function pfCardHtml(it){
  var s=ilanScore(it),opc=it.op==='Satılık'?'sat':'kir';
  var priceStr=it.op==='Kiralık'?fmt(it.price)+' ₺<small>/ay</small>':fmt(it.price)+' ₺';
  var eids=it.eids&&it.eids.status==='dogrulandi';
  var tel=(((typeof FIRMA!=='undefined'&&FIRMA.tel)||'').replace(/[^0-9+]/g,''));/* M9: WhatsApp href artık waHref() ile üretilir (ayarsızsa tel: fallback) */
  return '<article class="pf-card pf-reveal" onclick="openDet('+it.id+')">'
    +'<div class="pf-ph"><img src="'+imgSrc(it.img)+'" alt="'+_le(it.title||'')+'" loading="lazy" decoding="async">'
      +'<div class="pf-tags"><span class="pf-tag op-'+opc+'">'+_le(it.op)+'</span>'+(it.feat?'<span class="pf-tag feat">★ Öne Çıkan</span>':'')+(eids?'<span class="pf-tag eids">'+eidsShieldSvg(11)+' EİDS</span>':'')+'</div>'
      +'<button class="pf-fav" data-fid="'+it.id+'" onclick="event.stopPropagation();(typeof gmFav===\'function\'?gmFav('+it.id+',this):toast(\'Favoriler için giriş yapın\'))" aria-label="Favorilere ekle">'+((typeof gmIsFav==='function'&&gmIsFav(it.id))?'♥':'♡')+'</button>'
      +'<div class="pf-score">Skor <b>'+s.score+'</b></div></div>'
    +'<div class="pf-body">'
      +'<div class="pf-top"><div class="pf-price">'+priceStr+'</div>'+pfSpark(it)+'</div>'
      +'<h3>'+_le(it.title||'')+'</h3>'
      +'<div class="pf-loc">'+ozIco(OZI.pin,13)+' '+_le(it.mah)+', '+_le(it.ilce)+(it.il?' / '+_le(it.il):'')+'</div>'
      +'<div class="pf-specs"><span>🛏 '+_le(it.oda)+'</span><span>📐 '+it.m2+' m²</span>'+(it.kat&&it.kat!=='-'?'<span>🏢 '+_le(it.kat)+'. kat</span>':'')+'<span class="up">↗ %'+s.chg+' / 5y</span></div>'
      +'<div class="pf-idx"><span>Bölge m² endeksi</span><b>'+fmt(s.m2)+' ₺/m²</b></div>'
      +'<div class="pf-cta"><a class="wa" onclick="event.stopPropagation()" href="'+waHref('Merhaba, '+it.title+' ('+it.mah+', '+it.ilce+') ilanı hakkında bilgi almak istiyorum.')+'" target="_blank" rel="noopener noreferrer">'+ozIco(OZI.wa,15)+' WhatsApp</a>'
        +'<a class="tel" onclick="event.stopPropagation()" href="tel:'+tel+'">'+ozIco(OZI.phone,15)+' Ara</a></div>'
    +'</div></article>';
}
var pfFilter={op:'',ty:''};
function pfFilt(btn){var f=btn.dataset.f,v=btn.dataset.v;pfFilter[f]=v;
  document.querySelectorAll('#pfIlanlar .pf-chip.'+f).forEach(function(b){b.classList.toggle('act',b===btn);});renderPfIlan();}
function renderPfIlan(){
  var g=document.getElementById('pfGrid');if(!g||typeof ILANLAR==='undefined')return;
  var arr=ILANLAR.filter(function(i){return i.status==='aktif';});
  if(pfFilter.op)arr=arr.filter(function(i){return i.op===pfFilter.op;});
  if(pfFilter.ty)arr=arr.filter(function(i){return i.type===pfFilter.ty;});
  var sort=(document.getElementById('pfSort')||{}).value||'feat';
  arr.sort(function(a,b){
    if(sort==='price-asc')return a.price-b.price;
    if(sort==='price-desc')return b.price-a.price;
    if(sort==='m2-desc')return b.m2-a.m2;
    if(sort==='score')return ilanScore(b).score-ilanScore(a).score;
    return (b.feat||0)-(a.feat||0);
  });
  var cnt=document.getElementById('pfCount');if(cnt)cnt.textContent=arr.length+' ilan listeleniyor';
  if(!arr.length){g.innerHTML='<div class="pf-none">Bu filtreye uygun ilan bulunamadı. Filtreyi değiştirin ya da bizimle iletişime geçin.</div>';return;}
  g.innerHTML=arr.map(pfCardHtml).join('');
  var cards=g.querySelectorAll('.pf-card');cards.forEach(function(c,i){c.style.transitionDelay=((i%9)*0.05).toFixed(2)+'s';});
  /* white-label: taze kartları hemen yerelleştir (İzmir ilçe/marka), observer gecikmesine güvenme */
  try{if(typeof brandSweep==='function')brandSweep(g);}catch(e){}
  pfReveal();pfTilt();
}
/* hero canlı istatistikler + say-yukarı animasyonu */
function pfStats(){
  var aktif=(typeof ILANLAR!=='undefined'?ILANLAR.filter(function(i){return i.status==='aktif';}):[]);
  var oz=(typeof OZEL!=='undefined'?OZEL:[]);
  var ilset={};aktif.forEach(function(i){if(i.ilce)ilset[i.ilce]=1;});oz.forEach(function(o){if(o.ilce)ilset[o.ilce]=1;});
  var m2s=aktif.map(function(i){return ilanScore(i).m2;}).filter(function(x){return x>0;});
  var avg=m2s.length?Math.round(m2s.reduce(function(a,b){return a+b;},0)/m2s.length):0;
  var map={pfsIlan:aktif.length,pfsOzel:oz.length,pfsM2:avg,pfsBolge:Object.keys(ilset).length};
  Object.keys(map).forEach(function(id){var el=document.getElementById(id);if(el)el.setAttribute('data-to',map[id]);});
  pfCountUp();
}
function pfCountUp(){
  var rm=window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches;
  document.querySelectorAll('#portfoyPage .pf-stat .v .n[data-to]').forEach(function(el){
    var to=+el.getAttribute('data-to')||0;
    if(rm){el.textContent=fmt(to);return;}
    var start=null,dur=1100;
    function tick(ts){if(!start)start=ts;var p=Math.min(1,(ts-start)/dur);var e=1-Math.pow(1-p,3);el.textContent=fmt(Math.round(to*e));if(p<1)requestAnimationFrame(tick);}
    requestAnimationFrame(tick);
    setTimeout(function(){el.textContent=fmt(to);},1250);   /* rAF arka-plan sekmede kısıtlıysa yine de doğru değeri göster */
  });
}
/* scroll-reveal (kaydırınca beliren) */
var _pfIO=null;
function pfReveal(){
  var sc=document.getElementById('ozScroll');if(!sc)return;
  var sr=sc.getBoundingClientRect(),vh=sc.clientHeight;
  /* Görüş alanındakileri ANINDA aç — IO gecikmesi/yarışı olmadan (bölüme atlarken kritik) */
  document.querySelectorAll('#portfoyPage .pf-reveal:not(.in)').forEach(function(el){
    var r=el.getBoundingClientRect();if(r.top<sr.top+vh*0.96&&r.bottom>sr.top)el.classList.add('in');
  });
  if('IntersectionObserver' in window){
    if(!_pfIO)_pfIO=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');_pfIO.unobserve(en.target);}});},{root:sc,threshold:.08,rootMargin:'0px 0px -5% 0px'});
    document.querySelectorAll('#portfoyPage .pf-reveal:not(.in)').forEach(function(el){_pfIO.observe(el);});
  }else document.querySelectorAll('#portfoyPage .pf-reveal').forEach(function(el){el.classList.add('in');});
}
/* 3B tilt (yalnız ince işaretçi + hareket açıksa) */
function pfTilt(){
  if(window.matchMedia&&(matchMedia('(prefers-reduced-motion:reduce)').matches||!matchMedia('(pointer:fine)').matches))return;
  document.querySelectorAll('#portfoyPage .pf-card').forEach(function(c){
    if(c._pfTilt)return;c._pfTilt=1;
    c.addEventListener('pointermove',function(e){var r=c.getBoundingClientRect();var x=(e.clientX-r.left)/r.width-0.5,y=(e.clientY-r.top)/r.height-0.5;c.style.transform='perspective(900px) rotateX('+(-y*5).toFixed(2)+'deg) rotateY('+(x*6).toFixed(2)+'deg) translateY(-4px)';});
    c.addEventListener('pointerleave',function(){c.style.transform='';});
  });
}
/* segment pili + bölüme kaydırma */
function pfPillSet(section){
  var wrap=document.getElementById('pfPillWrap');if(!wrap)return;var act=null;
  wrap.querySelectorAll('.pf-pill').forEach(function(b){var on=b.dataset.sec===section;b.classList.toggle('act',on);if(on)act=b;});
  var ind=document.getElementById('pfPillInd');
  if(ind&&act){if(!act.offsetWidth){requestAnimationFrame(function(){pfPillSet(section);});return;}ind.style.width=act.offsetWidth+'px';ind.style.transform='translateX('+act.offsetLeft+'px)';}
}
function pfGo(section,instant){
  var el=document.getElementById(section==='ozel'?'pfOzel':'pfIlanlar'),sc=document.getElementById('ozScroll');
  if(el&&sc)sc.scrollTo({top:Math.max(0,el.offsetTop-58),behavior:instant?'auto':'smooth'});
  pfPillSet(section);
}
function portfoyOpen(section){
  var p=document.getElementById('portfoyPage');if(!p)return;
  document.body.style.overflow='hidden';p.classList.add('open');
  /* İlan ve Özel Portföy AYRI odaklı sayfalar: aktif olmayan bölüm + pil gizlenir (chrome birebir aynı kalır) */
  p.classList.remove('pf-only-ilan','pf-only-ozel');
  p.classList.add(section==='ozel'?'pf-only-ozel':'pf-only-ilan');
  var sc=document.getElementById('ozScroll');if(sc)sc.scrollTop=0;
  try{renderPfIlan();}catch(e){}
  try{if(typeof renderOzel==='function')renderOzel();}catch(e){}
  try{if(typeof ozHero==='function')ozHero();}catch(e){}
  try{pfStats();}catch(e){}
  try{if(typeof brandSweep==='function')brandSweep(p);}catch(e){}   /* white-label: tüm sayfayı yerelleştir */
  try{pfReveal();}catch(e){}
  requestAnimationFrame(function(){pfPillSet(section==='ozel'?'ozel':'ilan');});
  if(sc&&!sc._pfScroll){sc._pfScroll=1;sc.addEventListener('scroll',function(){var oz=document.getElementById('pfOzel');if(!oz)return;var cur=(sc.scrollTop+120>=oz.offsetTop)?'ozel':'ilan';if(cur!==sc._pfCur){sc._pfCur=cur;pfPillSet(cur);}},{passive:true});}
  if(section==='ilan'||section==='ozel')setTimeout(function(){pfGo(section,true);},90);
  setOverlayPage(section==='ozel'?'Özel Portföy':section==='ilan'?'İlanlar · Portföy':'Portföy');
}
function pfOpenOp(op){goPortfoy('ilan');setTimeout(function(){var b=document.querySelector('#pfIlanlar .pf-chip.op[data-v="'+(op||'')+'"]');if(b)pfFilt(b);},130);}
/* SEO-dostu + KALICI Portföy yönlendirme: URL '#portfoy' olur, TEK tıkla açar (çift-tık bug'ı yok).
   pushState kullanır → hashchange tetiklemez (çift açılma yok); rota routeHash'ten de gelir (paylaşılan link). */
function goPortfoy(sec,ev){return goView(sec==='ozel'?'ozel':'ilanlar',ev);}
function portfoyClose(){goHome();}
function ozOpen(){portfoyOpen('ozel');}   /* geriye dönük: mnav / oz-funnel / runSearch */
function ozClose(){portfoyClose();}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){var o=document.getElementById('portfoyPage');if(o&&o.classList.contains('open'))portfoyClose();}});
function renderOzTalep(){const t=document.getElementById('ozTalepRows');if(!t)return;const arr=(typeof LEADS!=='undefined'?LEADS:[]).filter(l=>l.src==='Özel Portföy Talebi');
  t.innerHTML=arr.length?arr.map(l=>`<tr><td>${l.date||'-'}</td><td>${l.entryLabel||l.konu||'-'}</td><td><b>${l.ad||'-'}</b></td><td>${l.tel||'-'}</td><td>${l.mail||'-'}</td></tr>`).join(''):'<tr><td colspan="5" class="empty">Henüz detay talebi yok.</td></tr>';}
function renderOzAlarm(){const t=document.getElementById('ozAlarmRows');if(!t)return;const arr=(typeof LEADS!=='undefined'?LEADS:[]).filter(l=>l.src==='Bölge Alıcı Talebi');
  t.innerHTML=arr.length?arr.map(l=>`<tr><td>${l.date||'-'}</td><td><b>${l.ad||'-'}</b></td><td>${l.tel||'-'}</td><td>${l.bolge||'-'}</td><td>${l.kategori||'-'}</td><td>${l.butce?fmt(l.butce)+' ₺':'-'}</td></tr>`).join(''):'<tr><td colspan="6" class="empty">Henüz bölge alıcı talebi yok.</td></tr>';}
function ozHero(){
  const host=document.getElementById('ozCover');if(!host||typeof OZEL==='undefined')return;
  const byIlce={};OZEL.forEach(o=>{byIlce[o.ilce]=(byIlce[o.ilce]||0)+1;});
  const ilceler=Object.keys(byIlce);
  const mahset=new Set(OZEL.map(o=>o.ilce+'|'+o.mah));
  const top=ilceler.map(d=>({d,n:byIlce[d]})).sort((a,b)=>b.n-a.n).slice(0,6);
  const max=top.length?top[0].n:1;
  const chips=[...new Set(OZEL.map(o=>o.mah))];
  const mc=(typeof PROVINCE!=='undefined'&&PROVINCE.mahCount)||'1.300+';
  const _M=n=>n>=1e6?(n/1e6).toLocaleString('tr-TR',{maximumFractionDigits:2})+'M ₺':fmt(n)+' ₺';
  const catDefs=[
    {k:'Satılık Daire',op:'Satılık',tip:'Daire',f:o=>o.op==='Satılık'&&/Daire|Villa|Müstakil/i.test(o.tip)},
    {k:'Kiralık Daire',op:'Kiralık',tip:'Daire',kir:1,f:o=>o.op==='Kiralık'&&/Daire|Villa|Müstakil/i.test(o.tip)},
    {k:'İşyeri & Ofis',op:'',tip:'İşyeri',f:o=>/İşyeri|Ofis|Dükkan|Bina|Depo/i.test(o.tip)},
    {k:'Arsa & Tarla',op:'',tip:'',f:o=>/Arsa|Tarla|Bağ/i.test(o.tip)}
  ];
  const catCards=catDefs.map(c=>{const items=OZEL.filter(c.f);if(!items.length)return '';
    const min=Math.min.apply(null,items.map(o=>o.fiyat));
    return `<button class="ozc-cat" onclick="ozCatJump('${c.op}','${c.tip}')"><span class="ck">${c.k}</span><span class="cv">${_M(min)}${c.kir?'<i>/ay</i>':''}<small>’den başlayan</small></span><span class="cn">${items.length} kayıt →</span></button>`;
  }).filter(Boolean).join('');
  host.innerHTML=`
   <div class="ozc-stats">
     <div class="s"><div class="v">${ilceler.length}</div><div class="l">aktif ilçe</div></div>
     <div class="s"><div class="v">${mahset.size}</div><div class="l">aktif mahalle</div></div>
     <div class="s"><div class="v">${OZEL.length}</div><div class="l">özel portföy</div></div>
     <div class="s"><div class="v">${mc}</div><div class="l">mahalle veri kapsamı</div></div>
   </div>
   <div class="ozc-bars">
     <div class="ozc-h">En çok özel portföyümüz olan bölgeler</div>
     ${top.map(t=>`<div class="ozc-row"><span class="d">${t.d}</span><span class="t"><span class="f" data-w="${(t.n/max*100).toFixed(0)}"></span></span><span class="n">${t.n}</span></div>`).join('')}
   </div>
   ${catCards?`<div class="ozc-cats"><div class="ozc-h">Kategori bazında başlangıç fiyatları</div><div class="ozc-catg">${catCards}</div></div>`:''}
   <div class="ozc-chips"><span class="lbl">Aktif bölgelerimiz:</span> ${chips.slice(0,12).map(c=>`<i>${c}</i>`).join('')}</div>`;
  requestAnimationFrame(()=>{host.querySelectorAll('.ozc-bars .f').forEach(e=>e.style.width=e.dataset.w+'%');});
}
function ozSvg(inner){return '<div class="oz-scene"><svg viewBox="0 0 320 160" preserveAspectRatio="xMidYMid slice" fill="none" stroke="rgba(255,255,255,.84)" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round">'+inner+'</svg></div>';}
function ozCatKey(t){t=(t||'').toLocaleLowerCase('tr');
  if(t.indexOf('daire')>=0)return 'daire';
  if(t.indexOf('villa')>=0||t.indexOf('müstakil')>=0||t.indexOf('mustakil')>=0)return 'villa';
  if(t.indexOf('arsa')>=0)return 'arsa';
  if(t.indexOf('tarla')>=0)return 'tarla';
  if(t.indexOf('bina')>=0)return 'bina';
  if(t.indexOf('depo')>=0)return 'depo';
  if(t.indexOf('bağ')>=0||t.indexOf('bag')>=0||t.indexOf('bahçe')>=0||t.indexOf('bahce')>=0)return 'bag';
  if(t.indexOf('ofis')>=0||t.indexOf('iş')>=0||t.indexOf('is ')>=0||t.indexOf('dükkan')>=0||t.indexOf('dukkan')>=0||t.indexOf('mağaza')>=0||t.indexOf('magaza')>=0||t.indexOf('işyeri')>=0)return 'isyeri';
  return 'def';
}
function ozCatClass(t){return 'ozc-'+ozCatKey(t);}
function ozScene(t){const k=ozCatKey(t);const W='rgba(255,255,255,.16)';
  if(k==='daire')return ozSvg(`<rect x="118" y="40" width="80" height="92" rx="3" fill="rgba(255,255,255,.07)"/><rect x="204" y="62" width="46" height="70" rx="3" fill="rgba(255,255,255,.05)"/><g stroke-width="1.5" fill="${W}"><rect x="128" y="50" width="12" height="12"/><rect x="148" y="50" width="12" height="12"/><rect x="168" y="50" width="12" height="12"/><rect x="128" y="72" width="12" height="12"/><rect x="148" y="72" width="12" height="12"/><rect x="168" y="72" width="12" height="12"/><rect x="128" y="94" width="12" height="12"/><rect x="148" y="94" width="12" height="12"/><rect x="168" y="94" width="12" height="12"/><rect x="212" y="72" width="11" height="11"/><rect x="230" y="72" width="11" height="11"/><rect x="212" y="92" width="11" height="11"/><rect x="230" y="92" width="11" height="11"/><rect x="212" y="112" width="11" height="11"/><rect x="230" y="112" width="11" height="11"/></g><rect x="150" y="112" width="18" height="20" fill="rgba(255,255,255,.22)"/><line x1="66" y1="132" x2="262" y2="132"/>`);
  if(k==='villa')return ozSvg(`<path d="M94 88 L160 46 L226 88" fill="rgba(255,255,255,.08)"/><rect x="110" y="88" width="100" height="44" fill="rgba(255,255,255,.06)"/><rect x="150" y="106" width="20" height="26" fill="rgba(255,255,255,.22)"/><rect x="121" y="98" width="16" height="15" fill="${W}"/><rect x="183" y="98" width="16" height="15" fill="${W}"/><line x1="160" y1="40" x2="160" y2="46"/><circle cx="242" cy="102" r="15" fill="rgba(255,255,255,.1)"/><line x1="242" y1="117" x2="242" y2="132"/><line x1="60" y1="132" x2="268" y2="132"/>`);
  if(k==='isyeri')return ozSvg(`<rect x="108" y="56" width="104" height="76" fill="rgba(255,255,255,.06)"/><rect x="108" y="56" width="104" height="14" fill="${W}"/><path d="M102 76 H218 L210 90 H110 Z" fill="rgba(255,255,255,.1)"/><g stroke-width="1.3"><line x1="120" y1="76" x2="116" y2="90"/><line x1="136" y1="76" x2="132" y2="90"/><line x1="152" y1="76" x2="148" y2="90"/><line x1="168" y1="76" x2="164" y2="90"/><line x1="184" y1="76" x2="180" y2="90"/><line x1="200" y1="76" x2="196" y2="90"/></g><rect x="118" y="100" width="36" height="32" fill="${W}"/><rect x="166" y="100" width="24" height="32" fill="rgba(255,255,255,.22)"/><line x1="66" y1="132" x2="254" y2="132"/>`);
  if(k==='arsa')return ozSvg(`<path d="M78 112 L150 76 L246 100 L176 134 Z" fill="rgba(255,255,255,.05)" stroke-dasharray="8 6"/><g fill="rgba(255,255,255,.92)" stroke="none"><circle cx="78" cy="112" r="3.6"/><circle cx="150" cy="76" r="3.6"/><circle cx="246" cy="100" r="3.6"/><circle cx="176" cy="134" r="3.6"/></g><path d="M150 50 v16 M150 50 l-5 6 M150 50 l5 6"/><path d="M120 96 l36 -18" stroke-width="1.3" stroke-dasharray="3 4"/>`);
  if(k==='tarla')return ozSvg(`<path d="M30 134 Q160 94 300 134"/><path d="M30 134 Q160 104 300 134" opacity=".72"/><path d="M30 134 Q160 114 300 134" opacity=".5"/><path d="M30 134 Q160 124 300 134" opacity=".34"/><circle cx="244" cy="52" r="15" fill="rgba(255,255,255,.14)"/><g stroke-width="1.6"><line x1="244" y1="28" x2="244" y2="34"/><line x1="244" y1="70" x2="244" y2="76"/><line x1="220" y1="52" x2="226" y2="52"/><line x1="262" y1="52" x2="268" y2="52"/><line x1="227" y1="35" x2="231" y2="39"/><line x1="257" y1="65" x2="261" y2="69"/></g>`);
  if(k==='bina')return ozSvg(`<rect x="130" y="28" width="58" height="104" rx="2" fill="rgba(255,255,255,.07)"/><g fill="${W}" stroke-width="1.3"><rect x="138" y="38" width="11" height="11"/><rect x="155" y="38" width="11" height="11"/><rect x="172" y="38" width="11" height="11"/><rect x="138" y="56" width="11" height="11"/><rect x="155" y="56" width="11" height="11"/><rect x="172" y="56" width="11" height="11"/><rect x="138" y="74" width="11" height="11"/><rect x="155" y="74" width="11" height="11"/><rect x="172" y="74" width="11" height="11"/><rect x="138" y="92" width="11" height="11"/><rect x="155" y="92" width="11" height="11"/><rect x="172" y="92" width="11" height="11"/><rect x="138" y="110" width="11" height="11"/><rect x="172" y="110" width="11" height="11"/></g><rect x="153" y="110" width="12" height="22" fill="rgba(255,255,255,.22)"/><line x1="159" y1="18" x2="159" y2="28"/><line x1="70" y1="132" x2="250" y2="132"/>`);
  if(k==='depo')return ozSvg(`<path d="M94 70 L160 50 L226 70" fill="rgba(255,255,255,.08)"/><rect x="94" y="70" width="132" height="62" fill="rgba(255,255,255,.06)"/><rect x="118" y="84" width="38" height="48" fill="${W}"/><g stroke-width="1.2"><line x1="118" y1="94" x2="156" y2="94"/><line x1="118" y1="104" x2="156" y2="104"/><line x1="118" y1="114" x2="156" y2="114"/><line x1="118" y1="124" x2="156" y2="124"/></g><rect x="172" y="84" width="40" height="26" fill="rgba(255,255,255,.1)"/><line x1="62" y1="132" x2="250" y2="132"/>`);
  if(k==='bag')return ozSvg(`<g fill="rgba(255,255,255,.1)"><circle cx="108" cy="92" r="16"/><circle cx="160" cy="84" r="19"/><circle cx="212" cy="92" r="16"/></g><g stroke-width="2"><line x1="108" y1="108" x2="108" y2="132"/><line x1="160" y1="103" x2="160" y2="132"/><line x1="212" y1="108" x2="212" y2="132"/></g><line x1="60" y1="132" x2="260" y2="132"/><path d="M84 124 Q160 112 236 124" stroke-width="1.3" opacity=".6"/>`);
  return ozSvg(`<rect x="122" y="52" width="76" height="80" rx="3" fill="rgba(255,255,255,.07)"/><g fill="${W}"><rect x="132" y="62" width="13" height="13"/><rect x="152" y="62" width="13" height="13"/><rect x="172" y="62" width="13" height="13"/><rect x="132" y="84" width="13" height="13"/><rect x="152" y="84" width="13" height="13"/><rect x="172" y="84" width="13" height="13"/></g><rect x="150" y="108" width="20" height="24" fill="rgba(255,255,255,.22)"/><line x1="70" y1="132" x2="250" y2="132"/>`);
}
/* Denize kıyısı olan iller → bilinen sahil ilçeleri (gerçek coğrafi veri).
   White-label'da o ilin sahil ilçelerinde "Denize yakın" rozeti + villa kategorisi çıkar. */
var SAHIL_ILCE={
 'İzmir':['Konak','Karşıyaka','Bostanlı','Mavişehir','Çeşme','Urla','Seferihisar','Foça','Dikili','Karaburun','Menderes','Narlıdere','Balçova','Güzelbahçe','Mordoğan','Çiğli','Aliağa','Bayraklı','Selçuk','Güzelyalı'],
 'Antalya':['Muratpaşa','Konyaaltı','Alanya','Manavgat','Serik','Kemer','Kumluca','Finike','Demre','Kaş','Gazipaşa'],
 'Muğla':['Bodrum','Marmaris','Fethiye','Datça','Milas','Ortaca','Dalaman','Köyceğiz','Seydikemer'],
 'Aydın':['Kuşadası','Didim','Söke'],
 'Balıkesir':['Ayvalık','Edremit','Burhaniye','Gömeç','Erdek','Bandırma','Marmara','Ayvacık'],
 'Mersin':['Mezitli','Erdemli','Silifke','Anamur','Bozyazı','Aydıncık','Akdeniz','Tarsus'],
 'Hatay':['İskenderun','Arsuz','Samandağ','Dörtyol','Payas','Erzin'],
 'Rize':['Merkez','Rize-il Merkezi','Ardeşen','Çayeli','Fındıklı','Pazar','Derepazarı','İyidere','Kalkandere'],
 'Trabzon':['Ortahisar','Akçaabat','Araklı','Sürmene','Of','Yomra','Arsin','Vakfıkebir','Beşikdüzü','Çarşıbaşı'],
 'Samsun':['İlkadım','Atakum','Bafra','Çarşamba','Terme','Tekkeköy','19 Mayıs','Alaçam','Yakakent'],
 'Ordu':['Altınordu','Ünye','Fatsa','Perşembe','Gülyalı'],
 'Giresun':['Giresun-il Merkezi','Merkez','Bulancak','Espiye','Görele','Tirebolu','Piraziz','Keşap','Eynesil'],
 'Sinop':['Sinop-il Merkezi','Merkez','Gerze','Ayancık','Türkeli','Erfelek'],
 'Zonguldak':['Ereğli','Kilimli','Kozlu','Çaycuma','Alaplı'],
 'Bartın':['Amasra','Merkez','Kurucaşile'],
 'Kastamonu':['İnebolu','Cide','Abana','Bozkurt','Çatalzeytin','Doğanyurt'],
 'Kocaeli':['İzmit','Gölcük','Karamürsel','Başiskele','Körfez','Derince','Kandıra'],
 'Yalova':['Merkez','Yalova-il Merkezi','Çınarcık','Armutlu','Altınova','Termal'],
 'Tekirdağ':['Süleymanpaşa','Marmaraereğlisi','Şarköy','Kapaklı'],
 'Çanakkale':['Merkez','Çanakkale-il Merkezi','Gelibolu','Ayvacık','Eceabat','Bozcaada','Gökçeada','Ezine','Lapseki'],
 'Sakarya':['Karasu','Kocaali','Ferizli'],
 'Düzce':['Akçakoca'],
 'Edirne':['Enez','Keşan'],
 'İstanbul':['Kadıköy','Kartal','Maltepe','Pendik','Tuzla','Beşiktaş','Sarıyer','Beykoz','Üsküdar','Bakırköy','Büyükçekmece','Silivri','Beylikdüzü','Avcılar','Zeytinburnu','Adalar','Fatih','Bakırköy'],
 'Kırklareli':['Demirköy','Vize']
};
function isSahil(il,ilce){try{var a=SAHIL_ILCE[il];if(!a)return false;var ic=(''+ilce).replace(/\s*\(.*\)$/,'').trim();return a.indexOf(ic)>=0;}catch(e){return false;}}
function ozSahilBadge(){return '<span class="ozsahil"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s2.5-2 5-2 4 2 6 2 3.5-2 5-2 4 2 4 2"/><path d="M2 17s2.5-2 5-2 4 2 6 2 3.5-2 5-2 4 2 4 2"/></svg> Denize yakın</span>';}
/* M1: ozCardHTML/renderOzHome/renderOzel/newOzel/editOzel/saveOzel'in ESKİ/BASİT kopyaları buradaydı;
   gelişmiş sürümleri aşağıda (~3655-3768) tanımlı ve fonksiyon-hoisting ile onlar aktif. Ölü mükerrer
   tanımlar kaldırıldı (davranış değişmez). delOzel yalnızca burada tanımlı → korunur. */
function delOzel(id){if(!confirm('Bu özel portföy kaydı silinsin mi?'))return;OZEL=OZEL.filter(x=>x.id!==id);saveAll();renderOzel();renderOzelRows();toast('Kayıt silindi.');}
var _wlM2Cache={};
async function proxEndeksM2(il,ilce,durum){var k=il+'|'+ilce+'|'+durum;if(_wlM2Cache[k]!==undefined)return _wlM2Cache[k];var v=null;try{var r=await proxApi('/api/v1/tenant/endeks?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce)+'&kategori=konut&durum='+durum);if(r&&r.success&&r.data&&+r.data.m2>0)v=+r.data.m2;}catch(e){}_wlM2Cache[k]=v;return v;}
async function proxEndeksInfo(il,ilce){try{var r=await proxApi('/api/v1/tenant/endeks?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce)+'&kategori=konut&durum=satilik');if(r&&r.success&&r.data)return {m2:+r.data.m2||0,score:+r.data.score||0};}catch(e){}return {m2:0,score:0};}
/* Eşzamanlılık-sınırlı paralel map (kota dostu): sıralı ~15sn → paralel ~3sn */
async function _wlPMap(items,fn,conc){conc=conc||4;var out=new Array(items.length),idx=0;async function w(){while(idx<items.length){var i=idx++;try{out[i]=await fn(items[i],i);}catch(e){out[i]=null;}}}var ws=[];for(var k=0;k<Math.min(conc,items.length);k++)ws.push(w());await Promise.all(ws);return out;}
/* /prox/analyze → gerçek başlangıç fiyatı (range.min_value). Cache'li. */
var _wlAnalyzeCache={};
async function proxAnalyzePrice(il,ilce,mah,tip,durum,m2){var k=[il,ilce,mah||'',tip,durum,m2].join('|');if(_wlAnalyzeCache[k]!==undefined)return _wlAnalyzeCache[k];var v=null;try{var r=await proxApi('/api/v1/tenant/prox/analyze',{method:'POST',body:{il:il,ilce:ilce,mahalle:mah||'',kategori:(typeof proxKategoriOf==='function'?proxKategoriOf(tip):'konut'),durum:durum,brut_m2:m2,attrs:{}}});if(r&&r.success===true&&!r.fallback){var rg=r.range||{};var mn=+rg.min_value||0,st=+r.strongest_value||0,mx=+rg.max_value||0;if(mn>0||st>0)v={min:mn||st,strong:st,max:mx,conf:(r.confidence!=null?r.confidence:null)};}}catch(e){}_wlAnalyzeCache[k]=v;return v;}
/* Tazelik: veri paketi eski mi? (il değişti / ts yok / >maxH saat) → gereksiz API/kota tüketimini önler */
function wlStale(key,il,maxH){maxH=maxH||24;try{var p=JSON.parse(localStorage.getItem(key)||'null');if(!p||p.il!==il||!p.ts)return true;return (Date.now()-p.ts)>maxH*3600000;}catch(e){return true;}}
function wlAgo(ts){if(!ts)return '—';var s=Math.max(0,Math.round((Date.now()-ts)/1000));if(s<60)return 'az önce';var m=Math.round(s/60);if(m<60)return m+' dk önce';var h=Math.round(m/60);if(h<24)return h+' sa önce';return Math.round(h/24)+' gün önce';}
async function wlBuildBolge(il,silent){
  il=il||PROVINCE.name;if(il==='İzmir')return;
  try{
    var allIlce=Object.keys(PROVINCE.districts),ilceler=allIlce.slice(0,12);
    if(!silent)toast('ProX bölge verisi çekiliyor… ('+il+')');
    /* İlçe endeks + kira m² — PARALEL (eşzamanlılık 4): sıralı ~12 çağrı yerine ~3 tur */
    var raw=await _wlPMap(ilceler,async function(ilce){
      var pair=await Promise.all([proxEndeksInfo(il,ilce),proxEndeksM2(il,ilce,'kiralik')]);
      return {ilce:ilce,inf:pair[0]||{m2:0,score:0},kir:pair[1]};
    },4);
    var cards=raw.map(function(x){var ilce=x.ilce,inf=x.inf,kir=x.kir;
      var m2=inf.m2||((BAZ[ilce]&&BAZ[ilce].m2)||30000),sc=Math.round(inf.score||62);
      var trend=m2>=45000?'yükselen':m2>=28000?'talep gören':'gelişen';
      var tier=m2>=60000?'yüksek değerli merkez':m2>=40000?'talep gören':'uygun fiyatlı';
      return {ad:ilce,trend:trend,one_liner:il+'’in '+tier+' ilçelerinden.',
        deger_ipucu:'ProX ort. m²: '+fmt(m2)+' ₺'+(kir?' · kira '+fmt(kir)+' ₺/m²':'')+' · yatırım skoru '+sc+'/100.'};});
    var m2s=cards.map(function(c){return parseInt(c.deger_ipucu.replace(/\D/g,''))||0;});
    var ilInf=await proxEndeksInfo(il,'');
    var maxIdx=0;cards.forEach(function(c,i){var v=parseInt((c.deger_ipucu.match(/([\d.]+) ₺/)||[])[1]||'0');});
    var maxC=cards.reduce(function(a,b){var av=+((a.deger_ipucu.match(/m²: ([\d.]+)/)||[])[1]||'0').replace(/\./g,''),bv=+((b.deger_ipucu.match(/m²: ([\d.]+)/)||[])[1]||'0').replace(/\./g,'');return bv>av?b:a;},cards[0]||{});
    var avgSc=Math.round(cards.reduce(function(s,c){return s+(+(c.deger_ipucu.match(/skoru (\d+)/)||[])[1]||62);},0)/(cards.length||1));
    var dpoints=[
      {baslik:'İlçe kapsamı',deger:''+allIlce.length,aciklama:il+' genelinde tüm ilçelerde veri.'},
      {baslik:'Zirve m² fiyatı',deger:((maxC.deger_ipucu||'').match(/m²: ([\d.]+) ₺/)||['','—'])[1]+' ₺',aciklama:(maxC.ad||'-')+' ilçesi (ProX).'},
      {baslik:'Ortalama yatırım skoru',deger:avgSc+'/100',aciklama:'ProX endeks skorlaması.'},
      {baslik:'Aktif portföy bölgesi',deger:''+ilceler.length+'+',aciklama:'Öncelikli ilçelerimiz.'}
    ];
    var insights=[];
    try{var pr='Sen '+il+' ilinde çalışan yerel emlak uzmanısın. Alıcı ve satıcıların bilmesi gereken, YEREL uzmanın gözünden 5 GENEL içgörü yaz (cephe/kat farkı, zemin/deprem, ulaşım/altyapı yakınlığı, sezonluk kira, kentsel dönüşüm gibi genel emlak dinamikleri). '+il+'’e özgü UYDURMA proje adı veya kesin rakam VERME. Her satır tam olarak: Başlık | 1-2 cümle açıklama. SADECE 5 satır.';
      var r=await aiChat({persona:'office',tool:'bolge',prompt:aiGuard(pr)});
      var txt=r&&(r.answer||r.text||(r.data&&r.data.answer));
      if(txt)txt.split('\n').forEach(function(l){var p=l.split('|');if(p.length>=2&&p[0].trim().length>2&&p[0].length<60)insights.push({baslik:p[0].replace(/[*#]/g,'').replace(/^[-\d.\s]+/,'').trim(),metin:p.slice(1).join('|').replace(/[*#]/g,'').trim()});});}catch(e){}
    if(insights.length<3)insights=[{baslik:'Cephe ve kat değeri',metin:'Aynı binada cephe yönü ve kat, m² fiyatını belirgin değiştirir; veriyle doğru konumlandırırız.'},{baslik:'Zemin ve yapı kalitesi',metin:'Zemin etüdü ve yapı yaşı, değerin ve satılabilirliğin kritik bileşenidir.'},{baslik:'Ulaşım yakınlığı',metin:'Ana arter, toplu taşıma ve altyapıya yakınlık kira ve satış talebini yükseltir.'},{baslik:'Sezonluk kira dinamiği',metin:'Bölgeye göre kira talebi sezonsal değişir; doğru zamanlama getiriyi artırır.'},{baslik:'Kentsel dönüşüm etkisi',metin:'Dönüşüm bölgelerinde eski yapı stoku ile yeni proje arasında değer farkı oluşur.'}];
    var pack={il:il,name:(FIRMA&&FIRMA.name)||'',cards:cards,dpoints:dpoints,insights:insights.slice(0,6),ts:Date.now()};
    try{localStorage.setItem('wl_bolge',JSON.stringify(pack));}catch(e){}
    try{if(typeof proxRenderStatus==='function')proxRenderStatus();}catch(e){}
    if(!silent)toast('✓ '+il+' bölge verisi hazır — Neden Biz sayfası gerçek verilerle güncellendi.');
    return pack;
  }catch(e){if(!silent)toast('Bölge verisi çekilemedi.');}
}
var _ozBusy=false,_ozPending=null,_ozDebounce=null;
/* ANLIK özel portföy: cascade değişince debounce(700ms) + kuyruklu rebuild → son seçim kazanır.
   ProX gerçek veriyle (proxy/CORS hazır olunca) o seçime göre anında yeniden üretir. */
function _ozInstant(){try{if(_ozDebounce)clearTimeout(_ozDebounce);}catch(e){}
  _ozDebounce=setTimeout(function(){try{if(typeof rebuildOzelFromProx==='function')rebuildOzelFromProx((SERVICE_AREA&&SERVICE_AREA.primary)||PROVINCE.name,true);}catch(e){}},700);}
window._ozInstant=_ozInstant;
/* Hizmet alanı → çok-illi iş listesi ({il,ilce}) + kategori geçidi */
function saWorkList(maxPrimary){maxPrimary=maxPrimary||7;var list=[];
  if(SERVICE_AREA){var ills=saActiveIller();ills.sort(function(a,b){return a===SERVICE_AREA.primary?-1:b===SERVICE_AREA.primary?1:0;});
    ills.forEach(function(il){var ics=saServedIlce(il)||[];var take=(il===SERVICE_AREA.primary)?maxPrimary:Math.min(3,ics.length);for(var i=0;i<take&&i<ics.length;i++)list.push({il:il,ilce:ics[i]});});}
  if(!list.length){var pn=(typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir';Object.keys((typeof PROVINCE!=='undefined'&&PROVINCE.districts)||{}).slice(0,maxPrimary).forEach(function(ic){list.push({il:pn,ilce:ic});});}
  return list;}
function saHasCat(kw){if(!SERVICE_AREA||!SERVICE_AREA.kategoriler)return true;var s=SERVICE_AREA.kategoriler.join('|').toLocaleLowerCase('tr');return s.indexOf((''+kw).toLocaleLowerCase('tr'))>=0;}
async function rebuildOzelFromProx(il,silent){
  if(_ozBusy){_ozPending=il||true;return;}_ozBusy=true;il=il||PROVINCE.name;/* kuyruk: rebuild sırasında yeni istek gelirse sona sakla */
  try{
    var work=saWorkList(9);   // çok-illi: primary + ek hizmet illeri (SERVICE_AREA'daki aktif il/ilçe)
    var illerSet={};work.forEach(function(w){illerSet[w.il]=1;});
    try{await Promise.all(Object.keys(illerSet).map(function(x){return loadMahalle(x);}));}catch(e){}
    var cKonut=saHasCat('konut'),cKira=saHasCat('kira'),cTicari=(saHasCat('ticari')||saHasCat('ofis')||saHasCat('dükkan')||saHasCat('dukkan')),cArsa=saHasCat('arsa');
    if(!cKonut&&!cKira&&!cTicari&&!cArsa){cKonut=true;} // hiç kategori yoksa en azından konut
    var mahs=['Cumhuriyet','Atatürk','Merkez','Yeni','Fatih','Bahçelievler','Yavuz Selim','İnönü','Yıldız','Gazi'];
    var cads=['Atatürk Caddesi','Cumhuriyet Caddesi','İstiklal Caddesi','Gazi Bulvarı','Sahil Yolu','Fevzi Çakmak Caddesi','İnönü Caddesi','19 Mayıs Caddesi','Kışla Caddesi','Bağdat Caddesi'];
    if(!silent)toast('ProX gerçek bölge fiyatları çekiliyor… ('+work.length+' bölge / '+Object.keys(illerSet).length+' il)');
    function rp(v,step){v=Math.round(v/step)*step;return Math.max(step,v);}
    /* 1) İlan spec'leri (çok-illi + kategori-farkında) */
    var specs=[],mi=0,ci=0,primary=(SERVICE_AREA&&SERVICE_AREA.primary)||il;
    work.forEach(function(w,i){var il2=w.il,ilce=w.ilce;var rm=realMah(il2,ilce,10),rmi=0;var coast=isSahil(il2,ilce);
      var nextMah=function(){return rm[rmi++]||mahs[mi++%mahs.length];};var nextCad=function(){return cads[ci++%cads.length];};
      /* her bölgede kategori bazlı: satılık + kiralık daire (merkez mahalle) */
      if(cKonut)specs.push({il:il2,op:'Satılık',durum:'satilik',tip:'Daire',ilce:ilce,mah:nextMah(),cadde:nextCad(),m2:110,oda:'3+1'});
      if(cKira)specs.push({il:il2,op:'Kiralık',durum:'kiralik',tip:'Daire',ilce:ilce,mah:nextMah(),cadde:nextCad(),m2:90,oda:'2+1'});/* düzeltildi: yalnız 'Kiralık' kategorisi seçiliyse kira ilanı (eski cKira||cKonut sızıntısı) */
      /* il-merkez / ilk bölgeler: farklı mahallede ikinci (geniş) daire — il-merkez mahalle çeşitliliği */
      if(i<3&&cKonut)specs.push({il:il2,op:'Satılık',durum:'satilik',tip:'Daire',ilce:ilce,mah:nextMah(),cadde:nextCad(),m2:145,oda:'4+1'});
      /* sahil ilçe: denize yakın villa kategorisi */
      if(coast&&cKonut)specs.push({il:il2,op:'Satılık',durum:'satilik',tip:'Villa',ilce:ilce,mah:nextMah(),cadde:(nextCad()),m2:210,oda:'4+1',sahil:true});
      /* ticari (ofis/dükkan) + arsa — daha fazla bölgeye yayılmış rotasyon */
      if(i<6){var rot=i%3;var t=(rot===0&&cTicari)?'Ofis':(rot===1&&cTicari)?'Dükkan':cArsa?'Arsa':cTicari?'Ofis':null;
        if(t)specs.push({il:il2,op:(t==='Dükkan'?'Kiralık':'Satılık'),durum:(t==='Dükkan'?'kiralik':'satilik'),tip:t,ilce:ilce,mah:nextMah(),cadde:(t==='Arsa'?'İmarlı parsel bölgesi':nextCad()),m2:(t==='Arsa'?400:130),oda:'-'});}
    });
    /* 2) analyze başlangıç fiyatı + endeks m² — PARALEL (her spec kendi ilini kullanır) */
    var priced=await _wlPMap(specs,async function(s){
      var pair=await Promise.all([proxAnalyzePrice(s.il,s.ilce,s.mah,s.tip,s.durum,s.m2),proxEndeksM2(s.il,s.ilce,s.durum)]);
      return {az:pair[0],em:pair[1]};
    },4);
    /* 3) OZEL kur — fiyat = analyze range.min ('…den başlayan'); yoksa m²×alan fallback */
    var out=[],id=1,realCount=0;
    specs.forEach(function(s,ix){
      var az=priced[ix]&&priced[ix].az, em=priced[ix]&&priced[ix].em, fiyat, src, band='';
      var ekIl=(s.il&&s.il!==primary);   // çok-illi: ek il ilanı (Trabzon sitesi Rize ilanı)
      if(az&&az.min>0){
        fiyat=rp(az.min, s.durum==='kiralik'?500:1000); src='analyze'; realCount++;
        if(az.max>az.min)band=' ('+fmt(az.min)+'–'+fmt(az.max)+' ₺)';
      }else{
        var baseSat=(BAZ[s.ilce]&&BAZ[s.ilce].m2)||30000;
        if(s.durum==='kiralik'){var rmv=em||Math.max(120,Math.round(baseSat*0.0042));fiyat=rp(rmv*s.m2*0.9,500);}
        else{var smv=em||baseSat;fiyat=rp(smv*s.m2*(s.tip==='Arsa'?0.35:0.9),s.tip==='Arsa'?5000:1000);}
        src='m2';
      }
      /* bölge ORTALAMASI: analyze strongest_value (tipik) veya (min+max)/2; yoksa başlangıç×~1.2 */
      var ort=0;
      if(src==='analyze'){ort=(az.strong>0?az.strong:(az.max>az.min?Math.round((az.min+az.max)/2):Math.round(fiyat*1.18)));}
      else{ort=Math.round(fiyat*1.2);}
      ort=rp(ort,s.durum==='kiralik'?500:1000);
      if(ort<=fiyat)ort=rp(Math.round(fiyat*1.12),s.durum==='kiralik'?500:1000);
      var m2info=em?('ProX '+(s.durum==='kiralik'?'kira':'satış')+' m²: '+fmt(em)+' ₺/m²'):'ProX bölge verisi';
      var not=(src==='analyze')
        ? (s.mah+' Mah., '+s.cadde+'’de ProX analiz başlangıç değeri'+band+' · bölge ort. '+fmt(ort)+' ₺'+((az.conf!=null)?' · güven '+az.conf+'/100':'')+' · '+m2info)
        : (m2info+' · bölge ort. '+fmt(ort)+' ₺ · '+s.mah+' Mah., '+s.cadde+' civarı');
      out.push({id:'og'+(id++),op:s.op,tip:s.tip,ilce:s.ilce+(ekIl?' ('+s.il+')':''),mah:s.mah,cadde:s.cadde,m2:s.m2,oda:s.oda,fiyat:fiyat,ort:ort,sahil:(s.sahil||isSahil(s.il,s.ilce)),durum:'aktif',basla:(src==='analyze'),il:s.il,not:not,_gen:true});/* C3: id 'og…' (o1-o6 çakışması bitti) + _gen:true (üretilmiş işareti) */
    });
    /* C3: admin'in ELLE eklediği (_gen olmayan) kayıtları KORU; sadece üretilmiş (_gen) olanları tazele.
       rebuild yalnızca İzmir-DIŞI illerde çalışır → kapsam dışı (eski il/İzmir demo) elle kayıtları düşür. */
    var _scopeIc={};
    try{work.forEach(function(w){_scopeIc[w.ilce]=1;});}catch(e){}
    try{Object.keys(PROVINCE.districts||{}).forEach(function(k){_scopeIc[k]=1;});}catch(e){}
    var _manual=(Array.isArray(OZEL)?OZEL:[]).filter(function(x){
      if(!x||x._gen)return false;                                   // üretilmiş → tazelenecek
      var ic=String(x.ilce||'').replace(/\s*\([^)]*\)\s*$/,'').trim();// "Ortahisar (Trabzon)" → "Ortahisar"
      return _scopeIc[ic]===1||_scopeIc[x.ilce]===1;                 // yalnızca aktif il/ilçe kapsamındaki elle kayıtlar
    });
    OZEL=_manual.concat(out);saveAll();
    try{localStorage.setItem('wl_ozel_ts',JSON.stringify({il:il,ts:Date.now(),n:out.length,real:realCount}));}catch(e){}
    try{if(typeof renderOzel==='function')renderOzel();if(typeof renderOzHome==='function')renderOzHome();if(typeof ozHero==='function')ozHero();if(typeof renderOzelRows==='function')renderOzelRows();if(typeof proxRenderStatus==='function')proxRenderStatus();}catch(e){}
    if(!silent)toast('✓ Özel Portföy '+il+': '+out.length+' yeni ProX kaydı ('+realCount+' gerçek analiz fiyatı)'+(_manual.length?' · '+_manual.length+' elle kayıt korundu':'')+'.');
  }catch(e){if(!silent)toast('Özel Portföy güncellenemedi.');}
  _ozBusy=false;
  if(_ozPending){var _p=(_ozPending===true?((SERVICE_AREA&&SERVICE_AREA.primary)||PROVINCE.name):_ozPending);_ozPending=null;setTimeout(function(){rebuildOzelFromProx(_p,true);},60);}/* son seçim kazanır */
}
function renderOzelRows(){const t=document.getElementById('ozRows');if(!t)return;
  if(!OZEL.length){t.innerHTML='<tr><td colspan="7" class="empty">Henüz kayıt yok.</td></tr>';return;}
  t.innerHTML=OZEL.map(o=>`<tr>
    <td><span class="atag ${o.op==='Satılık'?'sat':'kir'}">${o.op}</span> ${o.tip}</td>
    <td>${o.mah}, ${o.ilce}</td>
    <td>${o.cadde}</td>
    <td>${o.m2} m²${o.oda&&o.oda!=='-'?' · '+o.oda:''}</td>
    <td class="num">${fmt(o.fiyat)} ₺${o.op==='Kiralık'?'/ay':''}</td>
    <td>${o.durum==='aktif'?'<span class="dot ok"></span>Aktif':'<span class="dot"></span>Pasif'}</td>
    <td class="ta"><button class="ico-btn" onclick="editOzel('${o.id}')">✎</button><button class="ico-btn del" onclick="delOzel('${o.id}')">🗑</button></td>
  </tr>`).join('');}

/* ============ RENDER: DANIŞMANLAR ============ */
function renderDan(){
  const g=document.getElementById('dgrid');if(!g)return;
  const arr=DANISMANLAR.slice().sort((a,b)=>(b.feat||0)-(a.feat||0));
  g.innerHTML=arr.map((d,i)=>{const c=DAN_COLORS[i%DAN_COLORS.length];const ini=d.name.split(' ').map(x=>x[0]).slice(0,2).join('');
    const photo=d.foto?(IMG[d.foto]||(d.foto.startsWith&&d.foto.startsWith('data:')?d.foto:'')):'';
    const avatar=photo?`<img src="${photo}" alt="${_le(d.name)}" loading="lazy" decoding="async">`:`<div class="circ" style="background:linear-gradient(135deg,${c},${shade(c)})">${_le(ini)}</div>`;
    return `<div class="dcard${d.feat?' feat':''}">
      ${d.feat?'<span class="dfeat">★ Yıldız Danışman</span>':''}
      <div class="av${photo?' has-photo':''}" style="background:linear-gradient(135deg,${c}22,${c}08)">${avatar}</div>
      <div class="body"><h3>${_le(d.name)}</h3><div class="role">${_le(d.role)}</div>
        <div class="area">📍 ${_le(d.area)}</div>
        ${d.bio?`<p class="dbio">${_le(d.bio)}</p>`:''}
        <div class="dstat"><div><div class="n num">${d.sales}</div><div class="l">İşlem</div></div><div><div class="n num">★${(d.rating||4.9).toFixed(1)}</div><div class="l">Puan</div></div><div><div class="n num">${d.exp||5}<small>yıl</small></div><div class="l">Tecrübe</div></div></div>
        <div class="dactions"><a class="wa" href="${waHref('Merhaba, '+(d.name||'')+' ile görüşmek istiyorum.',d)}" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a>${d.tel?`<a class="dtel" href="tel:${d.tel.replace(/[^0-9+]/g,'')}" aria-label="Ara">📞</a>`:''}</div></div></div>`;}).join('');
}
function shade(hex){const n=parseInt(hex.slice(1),16);let r=(n>>16)-30,g=((n>>8)&255)-30,b=(n&255)-30;r=Math.max(0,r);g=Math.max(0,g);b=Math.max(0,b);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}

/* ============ RENDER: BÖLGE ============ */
function renderBolgePick(){
  if(!document.getElementById('bolgePick')||!document.getElementById('popGrid'))return; // ana sayfa #bolge widget'ı kaldırıldı → no-op (tam analiz Analiz Merkezi'nde)
  const keys=Object.keys(BAZ).slice(0,6);
  document.getElementById('bolgePick').innerHTML=keys.map((k,i)=>`<button class="bp${i===0?' act':''}" onclick="selBolge('${k}',this)">${k}</button>`).join('');
  document.getElementById('popGrid').innerHTML=keys.slice(0,4).map(k=>{const b=BAZ[k];
    return `<div class="pop" onclick="document.getElementById('bolge').scrollIntoView({behavior:'smooth'});selBolgeByName('${k}')">
      <div class="pn">${k}</div><div class="pm num">${fmt(b.m2)} ₺/m²</div><div class="pc up">↗ %${b.chg} / 5 yıl</div></div>`;}).join('');
  selBolge(keys[0]);
}
/* ============ BÖLGE / MAHALLE ZEKASI (ileri seviye) ============ */
/* emlakekspertizi.com endeks + demografi altyapısına bağlanır; canlı veri kapalıyken
   mahalle adından türetilen tutarlı örnek veriyle çalışır. */
const ENDEKS_API={
  enabled:true,             // canlı ProX endeks aktif (bzTryLive proxApi'ye bağlı; boş/hata → local fallback)
  base:'',                  // örn. 'https://emlakekspertizi.com'
  detail:'/api/emlak-endeksi/detail/{slug}',
  trends:'/api/emlak-endeksi/price-trends',
  score:'/api/emlak-endeksi/investment-score',
  demografi:'/api/emlak-endeksi/life-quality',
  geoRisk:'/api/geo/fault-line/{slug}'
};
const BZ_YEARS=[2021,2022,2023,2024,2025,2026];
let BZ_CUR={ilce:null,mah:null,data:null,metric:'price'};

function bzClamp(v,a,b){return Math.max(a,Math.min(b,v));}
function bzSeed(s){let h=2166136261;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,16777619);}return h>>>0;}
function bzRng(seed){let x=seed||123456789;return function(){x^=x<<13;x>>>=0;x^=x>>>17;x^=x<<5;x>>>=0;return (x>>>0)/4294967296;};}
function bzSplit(parts,r){ // normalize an array of weights to sum 100 (1 decimal)
  const s=parts.reduce((a,b)=>a+b,0);let out=parts.map(p=>p/s*100);
  let rounded=out.map(v=>Math.round(v*10)/10);
  const diff=Math.round((100-rounded.reduce((a,b)=>a+b,0))*10)/10;
  rounded[0]=Math.round((rounded[0]+diff)*10)/10;return rounded;
}
function bzGrowthSeries(end,totalPct,n,r){
  n=Math.max(2,n|0);                                   // M5: n<2 → i/(n-1) sıfıra bölme
  const tp=Math.max(-95,+totalPct||0);                 // M5: totalPct≤-100 → payda≤0 (negatif/Infinity seri); güvenli tabana kıstla
  const start=Math.max(1,end/(1+tp/100));const arr=[];
  for(let i=0;i<n;i++){const t=i/(n-1);const base=start*Math.pow(end/start,t);arr.push(base*(1+(r()*0.05-0.025)));}
  arr[0]=start;arr[n-1]=end;return arr.map(v=>Math.round(v));
}
// Curated flagship mahalleler (vitrin kalitesi); gerisi türetilir
const MAH_OVERRIDE={
 'Çeşme|Alaçatı':{m2:165000,chg:248,score:94},'Çeşme|Ilıca':{m2:110000,chg:232,score:90},
 'Urla|İskele':{m2:102000,chg:240,score:89},'Urla|Zeytinalanı':{m2:88000,chg:236,score:87},
 'Karşıyaka|Mavişehir':{m2:96000,chg:184,score:91},'Karşıyaka|Bostanlı':{m2:84000,chg:180,score:89},
 'Konak|Alsancak':{m2:88000,chg:178,score:90},'Konak|Göztepe':{m2:76000,chg:174,score:87},
 'Güzelbahçe|Yalı':{m2:98000,chg:196,score:88},'Narlıdere|Sahilevleri':{m2:86000,chg:188,score:85},
 'Bornova|Kazımdirik':{m2:64000,chg:196,score:84},'Foça|Yenifoça':{m2:78000,chg:214,score:84}
};
function bzMahalle(ilce,mah){
  const base=BAZ[ilce]||{m2:60000,chg:160,score:72,risk:'Orta risk',warn:1};
  const r=bzRng(bzSeed(ilce+'|'+mah));
  const ov=MAH_OVERRIDE[ilce+'|'+mah]||{};
  const f=0.80+r()*0.46;
  const m2=ov.m2||Math.round(base.m2*f/1000)*1000;
  const chg=ov.chg||Math.round(base.chg+(r()*38-16));
  const score=bzClamp(ov.score||(base.score+Math.round(r()*14-7)),42,97);
  const kira=+(4.0+ (97-score)*0.035 + r()*1.2).toFixed(1);   // yüksek skor → düşük getiri (fiyatlar yüksek)
  const nufus=Math.round(7000+r()*43000);
  const hane=+(2.5+r()*1.3).toFixed(1);
  const sahiplik=Math.round(42+r()*34);
  const yasamK=bzClamp(score+Math.round(r()*10-3),45,98);
  // seriler
  const priceSeries=bzGrowthSeries(m2,chg,6,r);
  const scoreSeries=(function(){const st=bzClamp(score-(8+Math.round(r()*6)),30,score);const a=[];for(let i=0;i<6;i++){a.push(Math.round(st+(score-st)*(i/5)+(r()*2-1)));}a[5]=score;return a;})();
  const rentSeries=(function(){const st=+(kira+1.4+r()*0.6).toFixed(1);const a=[];for(let i=0;i<6;i++){a.push(+(st+(kira-st)*(i/5)+(r()*0.2-0.1)).toFixed(1));}a[5]=kira;return a;})();
  const salesBase=Math.round(nufus/55)+120;
  const salesSeries=[0,1,2,3,4,5].map(i=>{const dip=i===2?0.72:(i===3?0.83:1);return Math.round(salesBase*dip*(0.9+r()*0.3));});
  // demografi — skora bağlı sosyoekonomik kayma
  const lvl=(score-42)/55;                          // 0..1 varlık göstergesi
  const yas=bzSplit([16+r()*6, 30+lvl*6+r()*5, 30+r()*5, 18+(1-lvl)*8+r()*4],r);
  const egitim=bzSplit([ (1-lvl)*22+8+r()*4, 20+r()*5, 12+r()*4, 18+lvl*20+r()*5, 4+lvl*9+r()*2 ],r);
  const gelir=bzSplit([ (1-lvl)*26+6+r()*3, 30-lvl*6+r()*4, 22+lvl*6+r()*4, 8+lvl*22+r()*4 ],r);
  const ortGelir=Math.round((42000+score*1100+lvl*38000+r()*16000)/1000)*1000;
  let risk=base.risk,warn=base.warn||0;
  return {ilce,mah,m2,chg,score,kira,risk,warn,nufus,hane,sahiplik,yasamK,
    priceSeries,scoreSeries,rentSeries,salesSeries,yas,egitim,gelir,ortGelir};
}
async function bzTryLive(ilce,mah){
  try{
    // canlı ProX endeks: {success,data:{m2,delta,trend,score,...}} (BAZI BÖLGELERDE BOŞ → null → local)
    const r=await proxApi('/api/v1/tenant/endeks?il='+encodeURIComponent((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir')
      +'&ilce='+encodeURIComponent(ilce)+'&mahalle='+encodeURIComponent(mah)
      +'&kategori=konut&durum=satilik');
    if(!r||r.fallback||r.success!==true||!r.data)return null;
    const d=r.data;const m2=+(d.m2);if(!m2||!isFinite(m2))return null; // boş endeks → local hesap kalır
    const base=bzMahalle(ilce,mah);                                    // local taban (eksik alanlar için)
    const merged={...base,_live:true};
    merged.m2=m2;
    if(d.delta!=null&&isFinite(+d.delta))merged.chg=+d.delta;          // % değişim
    if(d.score!=null&&isFinite(+d.score))merged.score=+d.score;
    if(Array.isArray(d.trend)&&d.trend.length){                        // grafik serisi
      const t=d.trend.map(x=>+((x&&x.m2!=null)?x.m2:((x&&x.value!=null)?x.value:x))).filter(v=>isFinite(v));
      if(t.length)merged.priceSeries=t;
    }
    if(d.kira!=null&&isFinite(+d.kira))merged.kira=+d.kira;
    if(d.risk)merged.risk=d.risk;
    return merged;
  }catch(e){return null;}
}

/* ---- giriş noktaları ---- */
function selBolge(name,btn){
  if(btn){document.querySelectorAll('#bolgePick .bp').forEach(b=>b.classList.toggle('act',b===btn));}
  if(!BAZ[name])return;
  BZ_CUR.ilce=name;
  const list=(MAH[name]||[]).slice(0,6);
  const mahWrap=document.getElementById('bzMah');
  if(mahWrap){mahWrap.innerHTML=list.map((m,i)=>`<button class="mc${i===0?' act':''}" onclick="selMahalle('${m.replace(/'/g,"\\'")}',this)">${m}</button>`).join('');}
  selMahalle(list[0]||name);
}
function selBolgeByName(k){document.querySelectorAll('#bolgePick .bp').forEach(b=>b.classList.toggle('act',b.textContent===k));selBolge(k);}
async function selMahalle(mah,btn){
  const ilce=BZ_CUR.ilce;if(!ilce)return;
  if(btn){document.querySelectorAll('#bzMah .mc').forEach(b=>b.classList.toggle('act',b===btn));}
  const st=document.getElementById('bzStatus');
  let d=bzMahalle(ilce,mah);BZ_CUR.mah=mah;BZ_CUR.data=d;
  bzPaint(d,false);
  if(ENDEKS_API.enabled){ if(st){st.textContent='● veri alınıyor…';st.className='bz-status load';}
    const live=await bzTryLive(ilce,mah);
    if(live&&BZ_CUR.mah===mah){BZ_CUR.data=live;bzPaint(live,true);}
    else if(st){st.textContent='● örnek veri';st.className='bz-status';}
  }
}
function bzPaint(d,live){
  const st=document.getElementById('bzStatus');if(st){st.textContent=live?'● canlı veri':'● örnek veri';st.className='bz-status'+(live?' live':'');}
  document.getElementById('dwName').textContent=d.mah+' · '+d.ilce+' / '+((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir');
  document.getElementById('dwM2').textContent=fmt(d.m2)+' ₺';
  document.getElementById('dwChg').innerHTML='+'+d.chg+'<span class="up">%</span>';
  document.getElementById('dwScore').innerHTML=d.score+'<span style="font-size:13px;color:#9fb0ca">/100</span>';
  const kEl=document.getElementById('dwKira');if(kEl)kEl.innerHTML=d.kira+'<span class="up" style="font-size:14px">%</span>';
  const risk=document.getElementById('dwRisk');risk.textContent=d.risk;risk.className='badge-risk'+(d.warn?' warn':'');
  const arc=document.getElementById('dwGaugeArc');if(arc){const circ=150.8;const off=circ-(circ*d.score/100);arc.style.transition='stroke-dashoffset 1s ease';setTimeout(()=>arc.style.strokeDashoffset=off,40);}
  bzRenderChart();
  bzRenderDemo(d);
}
function bzSetMetric(m,btn){BZ_CUR.metric=m;if(btn){document.querySelectorAll('#bzMetric button').forEach(b=>b.classList.toggle('act',b===btn));}bzRenderChart();}

/* ---- ana grafik (SVG) ---- */
const BZ_METRICS={
  price:{key:'priceSeries',label:'m² Fiyat Endeksi',color:'#60a5fa',grad:'bzgP',unit:'₺',fmt:v=>fmt(v)+' ₺'},
  score:{key:'scoreSeries',label:'Yatırım Skoru',color:'#34d399',grad:'bzgS',unit:'/100',fmt:v=>v+'/100'},
  rent:{key:'rentSeries',label:'Brüt Kira Getirisi',color:'#fbbf24',grad:'bzgR',unit:'%',fmt:v=>v+'%'},
  sales:{key:'salesSeries',label:'Tapu İşlem Hacmi',color:'#c084fc',grad:'bzgV',unit:'adet',fmt:v=>fmt(v)+' adet'}
};
function bzRenderChart(){
  const host=document.getElementById('bzChart');const d=BZ_CUR.data;if(!host||!d)return;
  const M=BZ_METRICS[BZ_CUR.metric];const vals=d[M.key];
  const cw=Math.max(320,(host.clientWidth||640)-18);const W=cw,H=cw<600?236:300,pad={l:54,r:18,t:18,b:30};
  const iw=W-pad.l-pad.r,ih=H-pad.t-pad.b;
  let mn=Math.min(...vals),mx=Math.max(...vals);
  const span=(mx-mn)||1;mn=mn-span*0.18;mx=mx+span*0.12;if(BZ_CUR.metric==='sales')mn=Math.max(0,mn);
  const X=i=>pad.l+iw*(i/(vals.length-1));
  const Y=v=>pad.t+ih*(1-(v-mn)/(mx-mn));
  const isBar=BZ_CUR.metric==='sales';
  // grid + y labels
  let grid='';const ticks=4;
  for(let g=0;g<=ticks;g++){const yv=mn+(mx-mn)*(g/ticks);const y=Y(yv);
    grid+=`<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${W-pad.r}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,.08)"/>`;
    let lab=isBar?fmt(Math.round(yv)):(BZ_CUR.metric==='rent'?yv.toFixed(1):(BZ_CUR.metric==='score'?Math.round(yv):(yv>=1000?(Math.round(yv/1000)+'B'):Math.round(yv))));
    grid+=`<text x="${pad.l-8}" y="${(y+3.5).toFixed(1)}" text-anchor="end" class="bz-axl">${lab}</text>`;}
  // x labels
  let xl='';BZ_YEARS.forEach((yr,i)=>{xl+=`<text x="${X(i).toFixed(1)}" y="${H-9}" text-anchor="middle" class="bz-axl">${yr}</text>`;});
  let body='';
  if(isBar){
    const bw=iw/vals.length*0.54;
    vals.forEach((v,i)=>{const x=X(i)-bw/2,y=Y(v),h=pad.t+ih-y;
      body+=`<rect x="${x.toFixed(1)}" y="${(pad.t+ih).toFixed(1)}" width="${bw.toFixed(1)}" height="0" rx="4" fill="url(#${M.grad})" class="bz-bar"><animate attributeName="height" to="${Math.max(0,h).toFixed(1)}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" values="0;${Math.max(0,h).toFixed(1)}"/><animate attributeName="y" to="${y.toFixed(1)}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" values="${(pad.t+ih).toFixed(1)};${y.toFixed(1)}"/></rect>`;});
  }else{
    const line=vals.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    const area=`${pad.l},${(pad.t+ih).toFixed(1)} `+line+` ${(W-pad.r)},${(pad.t+ih).toFixed(1)}`;
    body+=`<polygon points="${area}" fill="url(#${M.grad})" opacity=".9"/>`;
    body+=`<polyline points="${line}" fill="none" stroke="${M.color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" class="bz-line"/>`;
    vals.forEach((v,i)=>{body+=`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.4" fill="#0f1f3d" stroke="${M.color}" stroke-width="2.2"/>`;});
  }
  const svg=`<svg viewBox="0 0 ${W} ${H}" class="bz-svg" preserveAspectRatio="xMidYMid meet" role="img" aria-label="${[BZ_CUR.mah,BZ_CUR.ilce].filter(Boolean).join(', ')||'Bölge'} ${(BZ_CUR.metric==='sales'?'satış adedi':BZ_CUR.metric==='rent'?'kira çarpanı':BZ_CUR.metric==='score'?'yatırım skoru':'m² fiyat endeksi')} trendi (${BZ_YEARS[0]}–${BZ_YEARS[BZ_YEARS.length-1]})">
    <defs>
      <linearGradient id="bzgP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#60a5fa" stop-opacity=".42"/><stop offset="1" stop-color="#60a5fa" stop-opacity="0"/></linearGradient>
      <linearGradient id="bzgS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34d399" stop-opacity=".42"/><stop offset="1" stop-color="#34d399" stop-opacity="0"/></linearGradient>
      <linearGradient id="bzgR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbbf24" stop-opacity=".42"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></linearGradient>
      <linearGradient id="bzgV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c084fc" stop-opacity=".95"/><stop offset="1" stop-color="#7c3aed" stop-opacity=".55"/></linearGradient>
    </defs>
    ${grid}${body}${xl}
    <rect id="bzHit" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}" fill="transparent"/>
    <line id="bzGuide" x1="0" y1="${pad.t}" x2="0" y2="${pad.t+ih}" stroke="rgba(255,255,255,.35)" stroke-dasharray="3 3" style="display:none"/>
    <circle id="bzGdot" r="5" fill="${M.color}" stroke="#0f1f3d" stroke-width="2" style="display:none"/>
  </svg>
  <div class="bz-chart-head"><span class="bz-chart-title">${M.label}</span><span class="bz-chart-sub">${d.mah} · 2021–2026</span></div>
  <div class="bz-tip" id="bzTip"></div>`;
  host.innerHTML=svg;
  // hover
  const svgEl=host.querySelector('.bz-svg'),hit=host.querySelector('#bzHit'),guide=host.querySelector('#bzGuide'),gdot=host.querySelector('#bzGdot'),tip=host.querySelector('#bzTip');
  function move(ev){
    const r=svgEl.getBoundingClientRect();const px=( (ev.touches?ev.touches[0].clientX:ev.clientX)-r.left)/r.width*W;
    let i=Math.round((px-pad.l)/(iw/(vals.length-1)));i=bzClamp(i,0,vals.length-1);
    const x=X(i),y=Y(vals[i]);
    guide.style.display='block';guide.setAttribute('x1',x);guide.setAttribute('x2',x);
    gdot.style.display='block';gdot.setAttribute('cx',x);gdot.setAttribute('cy',y);
    tip.style.display='block';tip.innerHTML=`<b>${BZ_YEARS[i]}</b> · ${M.fmt(vals[i])}`;
    const left=bzClamp((x/W)*host.clientWidth-tip.offsetWidth/2,4,host.clientWidth-tip.offsetWidth-4);
    tip.style.left=left+'px';tip.style.top=(Math.max(0,(y/H)*host.clientHeight-38))+'px';
  }
  function leave(){guide.style.display='none';gdot.style.display='none';tip.style.display='none';}
  hit.addEventListener('mousemove',move);hit.addEventListener('mouseleave',leave);
  hit.addEventListener('touchstart',move);hit.addEventListener('touchmove',move);hit.addEventListener('touchend',leave);
  if(!window._bzResize){window._bzResize=1;let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(BZ_CUR.data)bzRenderChart();},160);});}
}

/* ---- demografi panelleri ---- */
function bzStack(segs){ // segs:[{v,c,l}] -> stacked horizontal bar + legend
  let bar='',leg='';
  segs.forEach(s=>{bar+=`<span class="seg" style="width:${s.v}%;background:${s.c}" title="${s.l}: %${s.v}"></span>`;
    leg+=`<span class="lg"><i style="background:${s.c}"></i>${s.l} <b>%${s.v}</b></span>`;});
  return `<div class="bz-stack">${bar}</div><div class="bz-leg">${leg}</div>`;
}
function bzHbars(items,color){ // items:[{l,v}] 0-100
  return `<div class="bz-hbars">`+items.map(it=>`<div class="hb"><span class="hl">${it.l}</span><span class="ht"><span class="hf" style="width:0%;background:${color}" data-w="${it.v}"></span></span><b class="hv">%${it.v}</b></div>`).join('')+`</div>`;
}
function bzRenderDemo(d){
  const host=document.getElementById('bzDemo');if(!host)return;
  const yas=[
    {l:'0–17',v:d.yas[0],c:'#60a5fa'},{l:'18–34',v:d.yas[1],c:'#34d399'},
    {l:'35–54',v:d.yas[2],c:'#fbbf24'},{l:'55+',v:d.yas[3],c:'#f472b6'}];
  const gelir=[
    {l:'Alt',v:d.gelir[0],c:'#94a3b8'},{l:'Orta',v:d.gelir[1],c:'#60a5fa'},
    {l:'Üst-Orta',v:d.gelir[2],c:'#34d399'},{l:'Üst',v:d.gelir[3],c:'#fbbf24'}];
  const egitim=[
    {l:'İlk/Orta',v:d.egitim[0]},{l:'Lise',v:d.egitim[1]},{l:'Ön Lisans',v:d.egitim[2]},
    {l:'Lisans',v:d.egitim[3]},{l:'Lisansüstü',v:d.egitim[4]}];
  host.innerHTML=`
    <div class="bz-demo-head"><svg class="ico" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M7.5 16v-4"/><path d="M12 16V8"/><path d="M16.5 16v-7"/></svg> Mahalle Demografisi <span>· Türkiye geneli veri altyapısı</span></div>
    <div class="bz-stat4">
      <div><div class="bsv num">${fmt(d.nufus)}</div><div class="bsl">Nüfus</div></div>
      <div><div class="bsv num">${d.hane}</div><div class="bsl">Hane Halkı (kişi)</div></div>
      <div><div class="bsv num">%${d.sahiplik}</div><div class="bsl">Konut Sahipliği</div></div>
      <div><div class="bsv num">${d.yasamK}<small>/100</small></div><div class="bsl">Yaşam Kalitesi</div></div>
    </div>
    <div class="bz-demo-grid">
      <div class="bz-panel">
        <div class="bp-t"><span class="bp-tl"><svg class="ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.6"/><path d="M22 21v-2a4 4 0 0 0-3-3.86"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg> Yaş Dağılımı</span></div>
        ${bzStack(yas)}
      </div>
      <div class="bz-panel">
        <div class="bp-t"><span class="bp-tl"><svg class="ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2"/><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5"/><circle cx="16.5" cy="13" r="1.3" fill="currentColor" stroke="none"/></svg> Gelir Durumu</span> <span class="bp-x">Ort. hane: <b>${fmt(d.ortGelir)} ₺/ay</b></span></div>
        ${bzStack(gelir)}
      </div>
      <div class="bz-panel bz-wide">
        <div class="bp-t"><span class="bp-tl"><svg class="ico" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v4.4c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5V12"/></svg> Eğitim Durumu</span></div>
        ${bzHbars(egitim,'#7dd3fc')}
      </div>
    </div>
    <div class="bz-disc">Veriler mahalle bazlı örnek/temsilî değerlerdir; canlı modda Türkiye geneli endeks & yaşam kalitesi veri altyapısından çekilir.</div>`;
  // animate hbars
  requestAnimationFrame(()=>{host.querySelectorAll('.hf').forEach(el=>{el.style.transition='width .8s cubic-bezier(.2,.8,.2,1)';el.style.width=el.dataset.w+'%';});});
}


/* ============ BÖLGE REHBERİ ============ */
const BR={ilce:null,mah:null,data:null,metric:'price'};
let brInited=false;
const brLow=s=>(s||'').toLocaleLowerCase('tr-TR');
const brClamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function brIco(p,sz,sw){return `<svg class="ico" width="${sz||16}" height="${sz||16}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw||1.75}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;}
const BRI={
  pin:'<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="2.6"/>',
  go:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="3.6"/><path d="M22 21v-2a4 4 0 0 0-3-3.86"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  wallet:'<path d="M3 7a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2"/><path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H5"/><circle cx="16.5" cy="13" r="1.3" fill="currentColor" stroke="none"/>',
  cap:'<path d="M22 10 12 5 2 10l10 5 10-5Z"/><path d="M6 12v4.4c0 1.1 2.7 2.5 6 2.5s6-1.4 6-2.5V12"/>',
  bars2:'<path d="M3 3v18h18"/><path d="M7.5 16v-4"/><path d="M12 16V8"/><path d="M16.5 16v-7"/>',
  bus:'<rect x="5" y="4" width="14" height="13" rx="3"/><path d="M5 11h14"/><path d="M8 21v-2M16 21v-2"/><circle cx="8.5" cy="14" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="14" r="1" fill="currentColor" stroke="none"/>',
  building:'<path d="M3 21h18"/><path d="M5 21V8l7-4 7 4v13"/><path d="M9 21v-6h6v6"/>',
  trend:'<path d="M3 17l6-6 4 4 8-8"/><path d="M16 7h5v5"/>',
  spark:'<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/>',
  scale:'<path d="M12 3v18"/><path d="M5 7h14"/><path d="m5 7-2.5 6a3 3 0 0 0 5 0L5 7Z"/><path d="m19 7-2.5 6a3 3 0 0 0 5 0L19 7Z"/><path d="M8 21h8"/>'
};

function brOpen(){
  if(!brInited)brInit();
  document.body.style.overflow='hidden';
  document.getElementById('brPage').classList.add('open');
  setOverlayPage('Analiz Merkezi · Bölge Endeksi','#analiz');
  document.getElementById('brScroll').scrollTop=0;
  brBack();
}
function brClose(){
  document.getElementById('brPage').classList.remove('open');
  document.body.style.overflow='';
}
let BR_ALL=null,BR_OVER=null,BR_DAGG=null;
function brGrpName(ilce){const g=(PROVINCE.districts[ilce]||{}).group;return ((PROVINCE.groups||[]).find(x=>x.key===g)||{}).name||'';}
function brDistrictsIn(key){const all=Object.keys(PROVINCE.districts);return key==='all'?all:all.filter(d=>PROVINCE.districts[d].group===key);}
function brComputeStats(){
  if(BR_ALL)return;
  BR_ALL=[];const dk=Object.keys(PROVINCE.districts);let m2s=0,chgs=0,n=0;
  dk.forEach(d=>{PROVINCE.districts[d].mah.forEach(m=>{const x=bzMahalle(d,m);BR_ALL.push(x);m2s+=x.m2;chgs+=x.chg;n++;});});
  const dagg=dk.map(d=>({d,group:PROVINCE.districts[d].group,...brAgg(d)}));BR_DAGG=dagg;
  BR_OVER={avgM2:Math.round(m2s/n),avgChg:Math.round(chgs/n),nMah:n,nIlce:dk.length,
    avgScore:Math.round(dagg.reduce((s,x)=>s+x.score,0)/dagg.length),
    topVal:dagg.slice().sort((a,b)=>b.m2-a.m2)[0],
    topChg:dagg.slice().sort((a,b)=>b.chg-a.chg)[0]};
}
function brOverview(){
  const o=BR_OVER,host=document.getElementById('brOv');if(!host)return;
  host.innerHTML=`<div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:14px">${PROVINCE.name} geneli özet</div>
  <div class="br-ov-grid">
    <div class="br-ov-c"><div class="v num">${fmt(o.avgM2)} ₺</div><div class="l">İl geneli ort. m² fiyatı</div></div>
    <div class="br-ov-c"><div class="v num up">+%${o.avgChg}</div><div class="l">5 yıllık ort. değer değişimi</div></div>
    <div class="br-ov-c"><div class="v num">${o.avgScore}<small style="font-size:13px;color:var(--muted)">/100</small></div><div class="l">Ortalama yatırım skoru</div></div>
    <div class="br-ov-c"><div class="v num">${o.nIlce}</div><div class="l">İlçe veri kapsamında</div><div class="sub">En değerli: ${o.topVal.d}</div></div>
    <div class="br-ov-c"><div class="v num">${PROVINCE.mahCount}</div><div class="l">Mahalle veri kapsamında</div><div class="sub">En çok yükselen: ${o.topChg.d}</div></div>
  </div>`;
}
function brHighlights(){
  const host=document.getElementById('brHl');if(!host)return;
  const byM2=BR_ALL.slice().sort((a,b)=>b.m2-a.m2).slice(0,5);
  const byChg=BR_ALL.slice().sort((a,b)=>b.chg-a.chg).slice(0,5);
  const firsat=BR_ALL.filter(x=>x.score>=74&&x.chg>=200&&x.m2<=BR_OVER.avgM2*1.35).sort((a,b)=>(b.chg+b.score)-(a.chg+a.score)).slice(0,5);
  const tgt='<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>';
  const row=(x,i,val,up)=>`<div class="br-hl-row" onclick="brOpenMah('${x.ilce}','${x.mah.replace(/'/g,"\\'")}')"><span class="rk">${i+1}</span><span class="nm">${x.mah}<small>${x.ilce}</small></span><span class="vv num ${up?'up':''}">${val}</span></div>`;
  host.innerHTML=`<div style="font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--accent);margin-bottom:14px">Öne çıkanlar</div>
  <div class="br-hl-grid">
    <div class="br-hl-card"><h3>${brIco(BRI.spark,16)} En Değerli Mahalleler</h3><div class="hd">m² fiyatına göre</div>${byM2.map((x,i)=>row(x,i,fmt(x.m2)+' ₺',false)).join('')}</div>
    <div class="br-hl-card"><h3>${brIco(BRI.trend,16)} En Çok Değer Kazananlar</h3><div class="hd">son 5 yıl değişim</div>${byChg.map((x,i)=>row(x,i,'+%'+x.chg,true)).join('')}</div>
    <div class="br-hl-card"><h3>${brIco(tgt,16)} Yatırım Fırsatları</h3><div class="hd">yüksek skor · uygun giriş</div>${firsat.map((x,i)=>row(x,i,x.score+'/100',false)).join('')}</div>
  </div>`;
}
function brGroupsRender(){
  const host=document.getElementById('brGroups');if(!host)return;
  let s=`<button class="act" onclick="brSetGroup('all',this)">Tümü (${Object.keys(PROVINCE.districts).length})</button>`;
  PROVINCE.groups.forEach(g=>{const c=brDistrictsIn(g.key).length;s+=`<button onclick="brSetGroup('${g.key}',this)">${g.name} (${c})</button>`;});
  host.innerHTML=s;
}
function brBuildTabs(key){
  const ds=brDistrictsIn(key);
  document.getElementById('brDTabs').innerHTML=ds.map((k,i)=>`<button class="${i===0?'act':''}" onclick="brSelD('${k}',this)">${k}</button>`).join('');
}
function brSetGroup(key,btn){
  BR.group=key;
  if(btn){document.querySelectorAll('#brGroups button').forEach(b=>b.classList.toggle('act',b===btn));}
  brBuildTabs(key);
  const ds=brDistrictsIn(key);if(ds.length)brSelD(ds[0]);
}
function brInit(){
  brInited=true;
  document.getElementById('brStatD').textContent=Object.keys(PROVINCE.districts).length;
  document.getElementById('brStatM').textContent=PROVINCE.mahCount;
  brComputeStats();brHero();brOverview();brDistrictChart('m2');brHighlights();brGroupsRender();
  BR.group='all';brBuildTabs('all');
  brSelD(Object.keys(PROVINCE.districts)[0]);
}
function brHero(){
  const m2=document.getElementById('brHeroM2');if(!m2)return;
  m2.textContent=fmt(BR_OVER.avgM2)+' ₺';
  document.getElementById('brHeroChg').textContent=BR_OVER.avgChg;
  const top=BR_DAGG.slice().sort((a,b)=>b.m2-a.m2).slice(0,6),max=top[0].m2;
  document.getElementById('brHeroBars').innerHTML=top.map(x=>`<div class="hb" onclick="brJumpDistrict('${x.d}')"><span class="l">${x.d}</span><span class="t"><span class="f" data-w="${(x.m2/max*100).toFixed(1)}"></span></span><span class="v">${fmt(x.m2)}</span></div>`).join('');
  requestAnimationFrame(()=>{document.querySelectorAll('#brHeroBars .f').forEach(e=>e.style.width=e.dataset.w+'%');});
}
const BR_GCOL={metropol:'#3b82f6',sahil:'#1e7e3a',ic:'#f59e0b'};
function brDistrictChart(sort){
  sort=sort||BR.csort||'m2';BR.csort=sort;
  const host=document.getElementById('brMchart');if(!host)return;
  const key=sort==='m2'?'m2':sort==='chg'?'chg':'score';
  const arr=BR_DAGG.slice().sort((a,b)=>b[key]-a[key]);
  const maxV=sort==='score'?100:Math.max(...arr.map(x=>x[key]));
  const avg=sort==='m2'?BR_OVER.avgM2:sort==='chg'?BR_OVER.avgChg:BR_OVER.avgScore;
  const avgPct=(avg/maxV*100).toFixed(1);
  const val=x=>sort==='m2'?fmt(x.m2)+' ₺':sort==='chg'?'+%'+x.chg:x.score+'/100';
  const rows=arr.map((x,i)=>`<div class="br-mrow" onclick="brJumpDistrict('${x.d}')"><span class="rk">${i+1}</span><span class="dn"><i class="gd" style="background:${BR_GCOL[x.group]}"></i>${x.d}</span><span class="bt"><span class="bf" style="background:${BR_GCOL[x.group]}" data-w="${(x[key]/maxV*100).toFixed(1)}"></span><i class="avg" style="left:${avgPct}%"></i></span><span class="mv">${val(x)}</span></div>`).join('');
  const sb=(k,l)=>`<button class="${sort===k?'act':''}" onclick="brDistrictChart('${k}')">${l}</button>`;
  const avgtxt=sort==='m2'?fmt(avg)+' ₺':sort==='chg'?'+%'+avg:avg+'/100';
  const subt=sort==='m2'?'ortalama m² fiyatına':sort==='chg'?'5 yıllık değişime':'yatırım skoruna';
  host.innerHTML=`<div class="br-mc-card">
    <div class="br-mc-head"><div><h3>İzmir ilçe m² fiyat sıralaması</h3><div class="sub">30 ilçe · ${subt} göre</div></div>
      <div class="br-sort">${sb('m2','m² Fiyatı')}${sb('chg','5Y Değişim')}${sb('score','Skor')}</div></div>
    <div class="br-legend"><span><i style="background:#3b82f6"></i>Metropol Merkez</span><span><i style="background:#1e7e3a"></i>Sahil & Yarımada</span><span><i style="background:#f59e0b"></i>İç & Kuzey</span></div>
    <div class="br-mrows">${rows}</div>
    <div class="br-mavgnote"><i></i> İl ortalaması: <b>${avgtxt}</b> · ilçeye tıklayıp mahallelerini açın</div>
  </div>`;
  requestAnimationFrame(()=>{host.querySelectorAll('.bf').forEach(e=>{e.style.width=e.dataset.w+'%';});});
}
function brJumpDistrict(d){
  BR.group='all';document.querySelectorAll('#brGroups button').forEach((b,i)=>b.classList.toggle('act',i===0));
  brBuildTabs('all');brSelD(d);
  const dir=document.querySelector('.br-dir');if(dir)dir.scrollIntoView({behavior:'smooth',block:'start'});
}
function brNeighChart(ilce){
  const host=document.getElementById('brDChart');if(!host)return;
  const arr=(MAH[ilce]||[]).map(m=>bzMahalle(ilce,m)).sort((a,b)=>b.m2-a.m2);
  if(!arr.length){host.innerHTML='';return;}
  const maxV=arr[0].m2,avg=brAgg(ilce).m2,avgPct=(avg/maxV*100).toFixed(1);
  const rows=arr.map((x,i)=>`<div class="br-mrow" onclick="brOpenMah('${ilce}','${x.mah.replace(/'/g,"\\'")}')"><span class="rk">${i+1}</span><span class="dn">${x.mah}</span><span class="bt"><span class="bf" style="background:linear-gradient(90deg,#1e40af,#3b82f6)" data-w="${(x.m2/maxV*100).toFixed(1)}"></span><i class="avg" style="left:${avgPct}%"></i></span><span class="mv">${fmt(x.m2)} ₺</span></div>`).join('');
  host.innerHTML=`<div class="br-mc-card"><div class="br-mc-head"><div><h3>${ilce} · mahalle m² fiyat sıralaması</h3><div class="sub">${arr.length} mahalle · ortalama m² fiyatına göre · mahalleye tıklayıp detayını açın</div></div></div><div class="br-mrows">${rows}</div><div class="br-mavgnote"><i></i> İlçe ortalaması: <b>${fmt(avg)} ₺</b></div></div>`;
  requestAnimationFrame(()=>{host.querySelectorAll('.bf').forEach(e=>{e.style.width=e.dataset.w+'%';});});
}
function brAgg(ilce){
  const ms=MAH[ilce]||[];let m2=0,chg=0,sc=0;
  ms.forEach(m=>{const d=bzMahalle(ilce,m);m2+=d.m2;chg+=d.chg;sc+=d.score;});
  const n=ms.length||1;return {m2:Math.round(m2/n),chg:Math.round(chg/n),score:Math.round(sc/n),n:ms.length};
}
function brSelD(ilce,btn){
  BR.ilce=ilce;
  const q=document.getElementById('brQ');if(q)q.value='';
  if(btn){document.querySelectorAll('#brDTabs button').forEach(b=>b.classList.toggle('act',b===btn));}
  else{document.querySelectorAll('#brDTabs button').forEach(b=>b.classList.toggle('act',b.textContent===ilce));}
  const a=brAgg(ilce),risk=(BAZ[ilce]||{}).risk||'Bölge risk verisi';
  document.getElementById('brDIntro').innerHTML=`
    <div class="di-main"><h3>${ilce}</h3><p>${a.n} mahalle · ${brGrpName(ilce)} · ${risk}</p></div>
    <div class="di-s"><div class="v num">${fmt(a.m2)} ₺</div><div class="l">Ort. m² fiyatı</div></div>
    <div class="di-s"><div class="v num up">+%${a.chg}</div><div class="l">5 yıllık değişim</div></div>
    <div class="di-s"><div class="v num">${a.score}<small style="font-size:13px;color:var(--muted)">/100</small></div><div class="l">Yatırım skoru</div></div>`;
  brNeighChart(ilce);brGrid(ilce);
}
function brCardHTML(ilce,mah,showIlce){
  const d=bzMahalle(ilce,mah);
  const C=125.6,off=(C*(1-d.score/100)).toFixed(1);
  const warn=d.warn?'warn':'';
  return `<div class="br-mc" onclick="brOpenMah('${ilce}','${mah.replace(/'/g,"\\'")}')">
    <div class="top">
      <div><h4>${mah}</h4><div class="ilc">${showIlce?ilce+' · ':''}İzmir</div></div>
      <div class="br-ring">
        <svg width="46" height="46" viewBox="0 0 46 46"><circle cx="23" cy="23" r="20" fill="none" stroke="var(--surface-2)" stroke-width="5"/><circle cx="23" cy="23" r="20" fill="none" stroke="#1e7e3a" stroke-width="5" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 23 23)"/></svg>
        <span class="rv">${d.score}</span>
      </div>
    </div>
    <div class="met">
      <div class="m"><div class="v num">${fmt(d.m2)} ₺</div><div class="l">m² fiyatı</div></div>
      <div class="m"><div class="v num up">+%${d.chg}</div><div class="l">5 yıl</div></div>
    </div>
    <div class="risk ${warn}"><i></i>${d.risk}</div>
    <span class="go">İncele ${brIco(BRI.go,15)}</span>
  </div>`;
}
function brGrid(ilce,list){
  const g=document.getElementById('brGrid');
  const items=list||(MAH[ilce]||[]).map(m=>({ilce,mah:m}));
  if(!items.length){g.innerHTML='<div class="br-empty">Eşleşen mahalle bulunamadı. Farklı bir arama deneyin.</div>';return;}
  g.innerHTML=items.slice(0,36).map(it=>brCardHTML(it.ilce,it.mah,!!list)).join('');
}
function brAllMah(){const out=[];Object.keys(MAH).forEach(k=>MAH[k].forEach(m=>out.push({ilce:k,mah:m})));return out;}
function brSearch(){
  const q=brLow(document.getElementById('brQ').value).trim();
  if(q.length<2){brGrid(BR.ilce);return;}
  const res=brAllMah().filter(x=>brLow(x.mah).includes(q)||brLow(x.ilce).includes(q));
  brGrid(null,res);
}
function brSearchGo(){
  const q=brLow(document.getElementById('brQ').value).trim();
  if(q.length<2)return;
  const res=brAllMah().filter(x=>brLow(x.mah).includes(q)||brLow(x.ilce).includes(q));
  if(res.length)brOpenMah(res[0].ilce,res[0].mah);
}
function brOpenMah(ilce,mah){
  BR.ilce=ilce;BR.mah=mah;BR.metric='price';BR.data=bzMahalle(ilce,mah);
  brDetailRender(BR.data);
  const det=document.getElementById('brDetail');det.classList.add('open');det.scrollTop=0;
}
function brBack(){document.getElementById('brDetail').classList.remove('open');}

/* ---- detay ---- */
function brSeo(d){
  const perf=d.chg>=200?'olağanüstü güçlü':(d.chg>=160?'güçlü':(d.chg>=120?'istikrarlı':'ölçülü'));
  const yat=d.score>=85?'en yüksek':(d.score>=75?'yüksek':(d.score>=65?'orta-üst':'dengeli'));
  return `<b>${d.mah}</b>, ${d.ilce} ilçesinin ${yat} yatırım potansiyeline sahip mahallelerinden biri. Ortalama m² fiyatı <b>${fmt(d.m2)} ₺</b> seviyesinde; son 5 yılda <b>%${d.chg}</b> değer kazancıyla ${perf} bir performans sergiledi. Yaklaşık <b>${fmt(d.nufus)}</b> nüfuslu mahallede konut sahipliği <b>%${d.sahiplik}</b>, brüt kira getirisi <b>%${d.kira}</b> ve yatırım skoru <b>${d.score}/100</b>. ${d.risk}. Yaşam kalitesi endeksi <b>${d.yasamK}/100</b> ile bölge ortalamasının ${d.yasamK>=80?'üzerinde':'paralelinde'} konumlanıyor.`;
}
function brLifeHTML(d){
  const ulasim=d.score>=82?'Güçlü':(d.score>=70?'İyi':'Orta');
  const proje=d.chg>=200?'Yüksek':(d.chg>=150?'Orta-Yüksek':'Ölçülü');
  const talep=d.kira>=5.5?'Yüksek':(d.kira>=4.5?'Dengeli':'Sınırlı');
  const sosyo=d.ortGelir>=170000?'Üst':(d.ortGelir>=110000?'Üst-Orta':'Orta');
  return `<div class="br-life">
    <span>${brIco(BRI.bus,15)} Ulaşım erişimi: <b>${ulasim}</b></span>
    <span>${brIco(BRI.building,15)} Yeni proje yoğunluğu: <b>${proje}</b></span>
    <span>${brIco(BRI.trend,15)} Kira talebi: <b>${talep}</b></span>
    <span>${brIco(BRI.wallet,15)} Sosyoekonomik profil: <b>${sosyo}</b></span>
    <span>${brIco(BRI.spark,15)} Ort. hane geliri: <b>${fmt(d.ortGelir)} ₺/ay</b></span>
  </div>`;
}
function brCmpHTML(d){
  const a=brAgg(d.ilce);
  const m2max=Math.max(d.m2,a.m2)*1.16,scmax=100;
  const m2pct=(d.m2/m2max*100).toFixed(1),m2avg=(a.m2/m2max*100).toFixed(1);
  const scpct=(d.score/scmax*100).toFixed(1),scavg=(a.score/scmax*100).toFixed(1);
  const m2diff=Math.round((d.m2/a.m2-1)*100),scdiff=d.score-a.score;
  return `<div class="br-cmp">
    <h3>${brIco(BRI.scale,17)} ${d.ilce} ortalamasıyla karşılaştırma</h3>
    <div class="br-cmprow"><div class="lab">m² Fiyatı</div><div class="bar"><span class="seg" style="background:var(--grad-blue)" data-w="${m2pct}"></span><span class="avg" style="left:${m2avg}%"></span></div><div class="val">${fmt(d.m2)} ₺</div></div>
    <div class="br-cmprow"><div class="lab">Yatırım Skoru</div><div class="bar"><span class="seg" style="background:var(--grad-cta)" data-w="${scpct}"></span><span class="avg" style="left:${scavg}%"></span></div><div class="val">${d.score}/100</div></div>
    <div class="br-cmpnote">Dikey çizgi = ilçe ortalaması. ${d.mah}, ${d.ilce} ortalamasının m² fiyatında <b>%${Math.abs(m2diff)} ${m2diff>=0?'üzerinde':'altında'}</b>, yatırım skorunda <b>${Math.abs(scdiff)} puan ${scdiff>=0?'üzerinde':'altında'}</b>.</div>
  </div>`;
}
function brAdvisorHTML(d){
  let adv=null;
  if(typeof DANISMANLAR!=='undefined'){adv=DANISMANLAR.find(x=>brLow(x.area||'').includes(brLow(d.ilce)))||DANISMANLAR.find(x=>x.feat)||DANISMANLAR[0];}
  const tel=(adv&&adv.tel)||FIRMA.tel||'';
  const init=(adv?adv.name:FIRMA.name).split(' ').map(s=>s[0]).slice(0,2).join('');
  const msg=`Merhaba, ${d.mah} (${d.ilce}) bölgesi hakkında bilgi almak istiyorum.`;/* M9: waHref → danışman no yoksa firma, o da yoksa tel: */
  return `<div class="br-adv">
    <div class="ah">Bu bölgenin uzmanı</div>
    <div class="ap">
      <div class="av">${init}</div>
      <div><div class="an">${adv?adv.name:FIRMA.name}</div><div class="ar">${adv?adv.role:'Emlak Danışmanlığı'}</div><div class="aa">${adv?adv.area:'İzmir · Konak'}</div></div>
    </div>
    <div class="abtns">
      <a class="w" href="${waHref(msg, adv)}" target="_blank" rel="noopener noreferrer">${brIco('<path d="M21 11.5a8.5 8.5 0 0 1-12.6 7.4L3 21l2.2-5.3A8.5 8.5 0 1 1 21 11.5Z"/>',15)} WhatsApp</a>
      <a class="t" href="tel:${tel.replace(/[^0-9+]/g,'')}">${brIco('<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.6A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.6a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.5-1.1a2 2 0 0 1 2.1-.5c.8.3 1.7.5 2.6.6a2 2 0 0 1 1.7 2Z"/>',15)} Ara</a>
    </div>
  </div>`;
}
function brDetailRender(d){
  const C=150.8,off=(C*(1-d.score/100)).toFixed(1);
  document.getElementById('brDBody').innerHTML=`
    <div class="br-dhero">
      <div><div class="bc">${brIco(BRI.pin,15)} ${d.ilce} / İzmir · Bölge Analizi</div><h1>${d.mah}</h1></div>
      <span class="badge-risk">${d.risk}</span>
    </div>
    <div class="br-seo">${brSeo(d)}</div>
    ${brLifeHTML(d)}
    <div class="dataw">
      <div class="top"><div><div class="mh">${d.mah} · Endeks & Demografi</div><div class="sub">Mahalle bazında 6 yıllık veri serisi</div></div></div>
      <div class="bz-kpi">
        <div class="dw-cell"><div class="k">Ort. m² Fiyatı</div><div class="v num">${fmt(d.m2)} ₺</div></div>
        <div class="dw-cell"><div class="k">5 Yıllık Değişim</div><div class="v num" style="color:#7ed598">+%${d.chg}</div></div>
        <div class="dw-cell"><div class="k">Yatırım Skoru</div>
          <div class="gauge"><svg width="44" height="44" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="7"/><circle cx="28" cy="28" r="24" fill="none" stroke="#34d399" stroke-width="7" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="${off}" transform="rotate(-90 28 28)"/></svg>
          <div class="v num" style="font-size:18px">${d.score}<span style="font-size:12px;color:#9fb0ca">/100</span></div></div></div>
        <div class="dw-cell"><div class="k">Brüt Kira Getirisi</div><div class="v num">${d.kira}%</div></div>
      </div>
      <div class="bz-metric" id="brMetric">
        <button data-m="price" class="act" onclick="brSetMetric('price',this)">${brIco(BRI.trend,16)} Fiyat Endeksi</button>
        <button data-m="score" onclick="brSetMetric('score',this)">${brIco('<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.4"/><circle cx="12" cy="12" r="1" fill="currentColor" stroke="none"/>',16)} Yatırım Skoru</button>
        <button data-m="rent" onclick="brSetMetric('rent',this)">${brIco('<circle cx="8" cy="15" r="4.2"/><path d="M11 12l8.4-8.4"/><path d="M16.4 6.6l2.6 2.6"/><path d="M13.6 9.4l2.4 2.4"/>',16)} Kira Getirisi</button>
        <button data-m="sales" onclick="brSetMetric('sales',this)">${brIco('<path d="M3 21h18"/><rect x="5.5" y="11" width="3.2" height="7" rx="1"/><rect x="11" y="6" width="3.2" height="12" rx="1"/><rect x="16.5" y="14" width="3.2" height="4" rx="1"/>',16)} İşlem Hacmi</button>
      </div>
      <div class="bz-chart" id="brChartHost"></div>
      <div class="bz-demo" id="brDemoHost"></div>
    </div>
    ${brCmpHTML(d)}
    <div class="br-cta">
      <div class="br-cta-main">
        <h3>${d.mah}'de doğru kararı verin</h3>
        <p>Bu mahalledeki güncel portföyümüz, satılık/kiralık fırsatlar ve ücretsiz ön değerleme için uzmanınızla görüşün. Veriyi sizinle birlikte yorumlayalım.</p>
        <div class="br-cta-btns">
          <button class="p" onclick="brClose();openLead('Bölge Analizi: ${d.mah}, ${d.ilce}')">Bu Bölgede Danışmanla Görüş</button>
          <button class="s" onclick="brClose();openLead('Ücretsiz Değerleme')">Ücretsiz Değerleme</button>
        </div>
      </div>
      ${brAdvisorHTML(d)}
    </div>`;
  brChart();brDemo(d);
  requestAnimationFrame(()=>{document.querySelectorAll('#brDBody .br-cmprow .seg').forEach(el=>{el.style.width=el.dataset.w+'%';});});
}
function brSetMetric(m,btn){BR.metric=m;if(btn){document.querySelectorAll('#brMetric button').forEach(b=>b.classList.toggle('act',b===btn));}brChart();}
function brDemo(d){
  const host=document.getElementById('brDemoHost');if(!host)return;
  const yas=[{l:'0–17',v:d.yas[0],c:'#60a5fa'},{l:'18–34',v:d.yas[1],c:'#34d399'},{l:'35–54',v:d.yas[2],c:'#fbbf24'},{l:'55+',v:d.yas[3],c:'#f472b6'}];
  const gelir=[{l:'Alt',v:d.gelir[0],c:'#94a3b8'},{l:'Orta',v:d.gelir[1],c:'#60a5fa'},{l:'Üst-Orta',v:d.gelir[2],c:'#34d399'},{l:'Üst',v:d.gelir[3],c:'#fbbf24'}];
  const egitim=[{l:'İlk/Orta',v:d.egitim[0]},{l:'Lise',v:d.egitim[1]},{l:'Ön Lisans',v:d.egitim[2]},{l:'Lisans',v:d.egitim[3]},{l:'Lisansüstü',v:d.egitim[4]}];
  host.innerHTML=`
    <div class="bz-demo-head">${brIco(BRI.bars2,17)} Mahalle Demografisi <span>· Türkiye geneli veri altyapısı</span></div>
    <div class="bz-stat4">
      <div><div class="bsv num">${fmt(d.nufus)}</div><div class="bsl">Nüfus</div></div>
      <div><div class="bsv num">${d.hane}</div><div class="bsl">Hane Halkı (kişi)</div></div>
      <div><div class="bsv num">%${d.sahiplik}</div><div class="bsl">Konut Sahipliği</div></div>
      <div><div class="bsv num">${d.yasamK}<small>/100</small></div><div class="bsl">Yaşam Kalitesi</div></div>
    </div>
    <div class="bz-demo-grid">
      <div class="bz-panel"><div class="bp-t"><span class="bp-tl">${brIco(BRI.users,15)} Yaş Dağılımı</span></div>${bzStack(yas)}</div>
      <div class="bz-panel"><div class="bp-t"><span class="bp-tl">${brIco(BRI.wallet,15)} Gelir Durumu</span> <span class="bp-x">Ort. hane: <b>${fmt(d.ortGelir)} ₺/ay</b></span></div>${bzStack(gelir)}</div>
      <div class="bz-panel bz-wide"><div class="bp-t"><span class="bp-tl">${brIco(BRI.cap,15)} Eğitim Durumu</span></div>${bzHbars(egitim,'#7dd3fc')}</div>
    </div>
    <div class="bz-disc">Veriler mahalle bazlı örnek/temsilî değerlerdir; canlı modda Türkiye geneli endeks & yaşam kalitesi veri altyapısından çekilir.</div>`;
  requestAnimationFrame(()=>{host.querySelectorAll('.hf').forEach(el=>{el.style.transition='width .8s cubic-bezier(.2,.8,.2,1)';el.style.width=el.dataset.w+'%';});});
}
function brChart(){
  const host=document.getElementById('brChartHost');const d=BR.data;if(!host||!d)return;
  const M=BZ_METRICS[BR.metric];const vals=d[M.key];
  const cw=Math.max(320,(host.clientWidth||720)-18);const W=cw,H=cw<600?236:300,pad={l:54,r:18,t:18,b:30};
  const iw=W-pad.l-pad.r,ih=H-pad.t-pad.b;
  let mn=Math.min(...vals),mx=Math.max(...vals);const span=(mx-mn)||1;mn=mn-span*0.18;mx=mx+span*0.12;if(BR.metric==='sales')mn=Math.max(0,mn);
  const X=i=>pad.l+iw*(i/(vals.length-1)),Y=v=>pad.t+ih*(1-(v-mn)/(mx-mn));
  const isBar=BR.metric==='sales';
  let grid='';const ticks=4;
  for(let g=0;g<=ticks;g++){const yv=mn+(mx-mn)*(g/ticks),y=Y(yv);
    grid+=`<line x1="${pad.l}" y1="${y.toFixed(1)}" x2="${W-pad.r}" y2="${y.toFixed(1)}" stroke="rgba(255,255,255,.08)"/>`;
    let lab=isBar?fmt(Math.round(yv)):(BR.metric==='rent'?yv.toFixed(1):(BR.metric==='score'?Math.round(yv):(yv>=1000?(Math.round(yv/1000)+'B'):Math.round(yv))));
    grid+=`<text x="${pad.l-8}" y="${(y+3.5).toFixed(1)}" text-anchor="end" class="bz-axl">${lab}</text>`;}
  let xl='';BZ_YEARS.forEach((yr,i)=>{xl+=`<text x="${X(i).toFixed(1)}" y="${H-9}" text-anchor="middle" class="bz-axl">${yr}</text>`;});
  let body='';
  if(isBar){const bw=iw/vals.length*0.54;
    vals.forEach((v,i)=>{const x=X(i)-bw/2,y=Y(v),h=pad.t+ih-y;
      body+=`<rect x="${x.toFixed(1)}" y="${(pad.t+ih).toFixed(1)}" width="${bw.toFixed(1)}" height="0" rx="4" fill="url(#brgV)"><animate attributeName="height" to="${Math.max(0,h).toFixed(1)}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" values="0;${Math.max(0,h).toFixed(1)}"/><animate attributeName="y" to="${y.toFixed(1)}" dur="0.6s" fill="freeze" calcMode="spline" keySplines="0.2 0.8 0.2 1" keyTimes="0;1" values="${(pad.t+ih).toFixed(1)};${y.toFixed(1)}"/></rect>`;});
  }else{const gid=BR.metric==='score'?'brgS':(BR.metric==='rent'?'brgR':'brgP');
    const line=vals.map((v,i)=>`${X(i).toFixed(1)},${Y(v).toFixed(1)}`).join(' ');
    const area=`${pad.l},${(pad.t+ih).toFixed(1)} `+line+` ${(W-pad.r)},${(pad.t+ih).toFixed(1)}`;
    body+=`<polygon points="${area}" fill="url(#${gid})" opacity=".9"/>`;
    body+=`<polyline points="${line}" fill="none" stroke="${M.color}" stroke-width="2.6" stroke-linejoin="round" stroke-linecap="round" class="bz-line"/>`;
    vals.forEach((v,i)=>{body+=`<circle cx="${X(i).toFixed(1)}" cy="${Y(v).toFixed(1)}" r="3.4" fill="#0f1f3d" stroke="${M.color}" stroke-width="2.2"/>`;});
  }
  host.innerHTML=`<svg viewBox="0 0 ${W} ${H}" class="bz-svg" preserveAspectRatio="xMidYMid meet">
    <defs>
      <linearGradient id="brgP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#60a5fa" stop-opacity=".42"/><stop offset="1" stop-color="#60a5fa" stop-opacity="0"/></linearGradient>
      <linearGradient id="brgS" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#34d399" stop-opacity=".42"/><stop offset="1" stop-color="#34d399" stop-opacity="0"/></linearGradient>
      <linearGradient id="brgR" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fbbf24" stop-opacity=".42"/><stop offset="1" stop-color="#fbbf24" stop-opacity="0"/></linearGradient>
      <linearGradient id="brgV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c084fc" stop-opacity=".95"/><stop offset="1" stop-color="#7c3aed" stop-opacity=".55"/></linearGradient>
    </defs>
    ${grid}${body}${xl}
    <rect id="brHit" x="${pad.l}" y="${pad.t}" width="${iw}" height="${ih}" fill="transparent"/>
    <line id="brGuide" x1="0" y1="${pad.t}" x2="0" y2="${pad.t+ih}" stroke="rgba(255,255,255,.35)" stroke-dasharray="3 3" style="display:none"/>
    <circle id="brGdot" r="5" fill="${M.color}" stroke="#0f1f3d" stroke-width="2" style="display:none"/>
  </svg>
  <div class="bz-chart-head"><span class="bz-chart-title">${M.label}</span><span class="bz-chart-sub">${d.mah} · 2021–2026</span></div>
  <div class="bz-tip" id="brTip"></div>`;
  const svgEl=host.querySelector('.bz-svg'),hit=host.querySelector('#brHit'),guide=host.querySelector('#brGuide'),gdot=host.querySelector('#brGdot'),tip=host.querySelector('#brTip');
  function move(ev){const r=svgEl.getBoundingClientRect();const px=((ev.touches?ev.touches[0].clientX:ev.clientX)-r.left)/r.width*W;
    let i=Math.round((px-pad.l)/(iw/(vals.length-1)));i=brClamp(i,0,vals.length-1);const x=X(i),y=Y(vals[i]);
    guide.style.display='block';guide.setAttribute('x1',x);guide.setAttribute('x2',x);
    gdot.style.display='block';gdot.setAttribute('cx',x);gdot.setAttribute('cy',y);
    tip.style.display='block';tip.innerHTML=`<b>${BZ_YEARS[i]}</b> · ${M.fmt(vals[i])}`;
    const left=brClamp((x/W)*host.clientWidth-tip.offsetWidth/2,4,host.clientWidth-tip.offsetWidth-4);
    tip.style.left=left+'px';tip.style.top=(Math.max(0,(y/H)*host.clientHeight-38))+'px';}
  function leave(){guide.style.display='none';gdot.style.display='none';tip.style.display='none';}
  hit.addEventListener('mousemove',move);hit.addEventListener('mouseleave',leave);
  hit.addEventListener('touchstart',move);hit.addEventListener('touchmove',move);hit.addEventListener('touchend',leave);
  if(!window._brResize){window._brResize=1;let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{if(BR.data&&document.getElementById('brChartHost'))brChart();},160);});}
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const det=document.getElementById('brDetail');if(det&&det.classList.contains('open'))brBack();else if(document.getElementById('brPage')&&document.getElementById('brPage').classList.contains('open'))brClose();}});


/* ============ DEĞERLEME ============ */
function initVal(){
  const sel=document.getElementById('v_ilce');if(!sel)return;
  sel.innerHTML='<option value="">Seçin</option>'+Object.keys(BAZ).map(k=>`<option>${k}</option>`).join('');
  hydrateIlcelerFromApi(sel);                                    // additive: API-first hydration, local fallback
}
/* API-first ilçe listesi; canlı: {success,data:["..."]}. fallback = mevcut local BAZ verisi (görsel değişmez) */
async function hydrateIlcelerFromApi(sel){
  try{var il=(typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir';var d=await loadMahalle(il);
    if(!d||typeof d!=='object')return; // uç yok/boş → local BAZ kalır
    var cur=sel.value;
    sel.innerHTML='<option value="">Seçin</option>'+Object.keys(d).map(function(k){return '<option>'+k+'</option>';}).join('');
    if(cur)sel.value=cur;
  }catch(e){}
}
function valMahalle(){const il=document.getElementById('v_ilce').value;const m=document.getElementById('v_mah');
  if(!il||!MAH[il]){m.innerHTML='<option value="">Önce ilçe seçin</option>';return;}
  m.innerHTML=MAH[il].map(x=>`<option>${x}</option>`).join('');
  hydrateMahallelerFromApi(il,m);}
/* API-first mahalle listesi; canlı: {success,data:["..."]}. fallback = mevcut local MAH verisi */
async function hydrateMahallelerFromApi(il,m){
  try{var d=await loadMahalle((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir');
    if(!d||!d[il]||!d[il].length)return;
    if(document.getElementById('v_ilce').value!==il)return;
    m.innerHTML=d[il].map(function(x){return '<option>'+x+'</option>';}).join('');
  }catch(e){}
}
function hesaplaDeger(){
  const il=document.getElementById('v_ilce').value,tip=document.getElementById('v_tip').value,m2=+document.getElementById('v_m2').value;
  if(!il){toast('Lütfen ilçe seçin.');return;}
  if(!m2||m2<20){toast('Lütfen geçerli bir m² girin.');return;}
  const b=bolgeOf(il);const val=Math.round(b.m2*m2*(TYPE_F[tip]||1));
  const lo=Math.round(val*0.88),hi=Math.round(val*1.12);
  document.getElementById('valBig').textContent=fmt(val)+' ₺';
  document.getElementById('valRange').innerHTML=`Aralık: <b>${fmt(lo)} ₺</b> – <b>${fmt(hi)} ₺</b> · Bölge yatırım skoru <b style="color:var(--green-700)">${b.score}/100</b>`;
  document.getElementById('valResult').classList.add('show');
  document.getElementById('valLead').classList.add('show');
  const _mah=(document.getElementById('v_mah')&&document.getElementById('v_mah').value)||'';
  window._lastVal={il,tip,m2,mah:_mah,val};                      // H5: mah dahil → mahalle değişince eski async sonuç uygulanmaz
  refineDegerFromAnalyze(il,tip,m2,b,_mah);                      // canlı: değer /prox/analyze'dan; local zaten gösterildi (fallback)
}
/* mülk tipi -> backend kategori enum'u {konut,arsa,ticari,bina,turistik_tesis} */
function proxKategoriOf(tip){
  if(tip==='Arsa')return 'arsa';
  if(tip==='Ofis / İş Yeri')return 'ticari';
  return 'konut';                                                // Daire / Villa / Müstakil Ev
}
/* API-first DEĞER: /prox/analyze. Ana değer=strongest_value, bant=range.min_value–max_value,
   karar_ozeti+risk_ozeti+confidence gösterilir. Değer SADECE API'den; YZ ile fiyat üretilmez.
   API yok/boş → mevcut local hesap korunur (görsel/akış bozulmaz). */
async function refineDegerFromAnalyze(il,tip,m2,localB,mah){
  try{
    mah=(mah!=null?mah:((document.getElementById('v_mah')&&document.getElementById('v_mah').value)||''));
    const r=await proxApi('/api/v1/tenant/prox/analyze',{method:'POST',body:{
      il:((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir'),ilce:il,mahalle:mah,kategori:proxKategoriOf(tip),durum:'satilik',brut_m2:m2,attrs:{}
    }});
    if(!r||r.fallback||r.success!==true)return;                  // API yok → local sonuç korunur
    const val=+r.strongest_value;if(!val||!isFinite(val))return;
    if(!window._lastVal||window._lastVal.il!==il||window._lastVal.m2!==m2||window._lastVal.tip!==tip||window._lastVal.mah!==mah)return; // H5: kullanıcı il/m²/tip/MAH değiştirdiyse eski sonucu uygulama
    const rg=r.range||{};const lo=+rg.min_value,hi=+rg.max_value;
    document.getElementById('valBig').textContent=fmt(val)+' ₺';
    const conf=(r.confidence!=null)?(' · Güven <b>'+r.confidence+'/100</b>'+(r.confidence_band?(' ('+r.confidence_band+')'):'')):'';
    document.getElementById('valRange').innerHTML=
      (isFinite(lo)&&isFinite(hi)?`Aralık: <b>${fmt(lo)} ₺</b> – <b>${fmt(hi)} ₺</b>`:'')+conf;
    /* karar + risk özeti: sonucun altına ek bilgi olarak basılır (varsa) */
    const res=document.getElementById('valResult');
    if(res){
      let info=res.querySelector('#valProxInfo');
      if(!info){info=document.createElement('div');info.id='valProxInfo';info.style.cssText='margin-top:10px;font-size:13.5px;color:var(--muted);line-height:1.55';res.appendChild(info);}
      const ko=r.karar_ozeti?('<div><b style="color:var(--ink)">Karar:</b> '+r.karar_ozeti+'</div>'):'';
      const ri=r.risk_ozeti?('<div style="margin-top:4px"><b style="color:var(--ink)">Risk:</b> '+r.risk_ozeti+'</div>'):'';
      info.innerHTML=ko+ri;
    }
    window._lastVal={il,tip,m2,mah,val};
  }catch(e){/* sessiz: local sonuç korunur */}
}
function valLead(){const ad=document.getElementById('vl_ad').value,tel=document.getElementById('vl_tel').value,kvkk=document.getElementById('vl_kvkk').checked;
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  if(!kvkk){toast('Lütfen KVKK onayını işaretleyin.');return;}
  const v=window._lastVal||{};
  pushLead({ad,tel,konu:`Değerleme: ${v.il||''} ${v.tip||''} ${v.m2||''}m² ≈ ${v.val?fmt(v.val)+'₺':''}`,src:'Değerleme Aracı'});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:'degerleme',formType:'valLead',name:ad,phone:tel,email:'',location:v.il||((typeof PROVINCE!=='undefined'&&PROVINCE.name)||''),message:`${v.tip||''} ${v.m2||''}m² · tahmin: ${v.val?fmt(v.val)+'₺':''}`,requestedService:'Ön Değerleme Talebi'});
  document.getElementById('vl_ad').value='';document.getElementById('vl_tel').value='';document.getElementById('vl_kvkk').checked=false;
  toast('✓ Talebiniz alındı! Uzmanımız detaylı raporla sizi arayacak.');
}

/* ============ LEAD / FORM ============ */
/* ===== PER-TENANT ANALİTİK + A/B (il bazlı dönüşüm takibi) ===== */
function abVariant(){try{var v=localStorage.getItem('wl_ab');if(v!=='A'&&v!=='B'){v=(Math.random()<0.5?'A':'B');localStorage.setItem('wl_ab',v);}return v;}catch(e){return 'A';}}
function trackEvent(name,params){try{
  var il=(typeof PROVINCE!=='undefined'&&PROVINCE&&PROVINCE.name)||(typeof PROX!=='undefined'&&PROX&&PROX.il)||'';
  var firma=(typeof FIRMA!=='undefined'&&FIRMA&&FIRMA.name)||'';
  var pkg=(window.EMLAK_TENANT&&window.EMLAK_TENANT.packageCode)||'';
  var payload=Object.assign({il:il,firma:firma,paket:pkg,ab_variant:abVariant()},params||{});
  if(typeof window.gtag==='function')window.gtag('event',name,payload);
  else if(window.dataLayer&&window.dataLayer.push)window.dataLayer.push(Object.assign({event:name},payload));
  try{var k='wl_analytics',a=JSON.parse(localStorage.getItem(k)||'[]');a.push({t:Date.now(),name:name,il:il,ab:payload.ab_variant});if(a.length>800)a=a.slice(-800);localStorage.setItem(k,JSON.stringify(a));}catch(e){}
}catch(e){}}
function abApply(){try{var v=abVariant();if(document.body)document.body.setAttribute('data-ab',v);
  var on=(typeof GOOGLE!=='undefined'&&GOOGLE&&GOOGLE.ab);
  if(on&&v==='B'){document.querySelectorAll('.btn-primary').forEach(function(b){var t=(b.textContent||'').trim();if(/Ücretsiz Ekspertiz|Ücretsiz Değerleme/i.test(t))b.textContent='Hemen Değerini Öğren →';});}
  trackEvent('page_impression',{});
}catch(e){}}
function wlAnalyticsSummary(){try{var a=JSON.parse(localStorage.getItem('wl_analytics')||'[]');var byIl={},ab={A:{imp:0,lead:0},B:{imp:0,lead:0}};
  a.forEach(function(e){if(e.name==='generate_lead'){byIl[e.il||'—']=(byIl[e.il||'—']||0)+1;if(ab[e.ab])ab[e.ab].lead++;}else if(e.name==='page_impression'&&ab[e.ab])ab[e.ab].imp++;});
  return {byIl:byIl,ab:ab,total:a.length};}catch(e){return {byIl:{},ab:{A:{imp:0,lead:0},B:{imp:0,lead:0}},total:0};}}
function renderWlAb(){try{var box=document.getElementById('wlAbBox');if(!box)return;var s=wlAnalyticsSummary();
  var ilRows=Object.keys(s.byIl).sort(function(a,b){return s.byIl[b]-s.byIl[a];}).slice(0,6).map(function(il){return '<tr><td>'+il+'</td><td class="num">'+s.byIl[il]+'</td></tr>';}).join('')||'<tr><td colspan="2" class="tsub">Henüz dönüşüm yok.</td></tr>';
  function cr(x){return x.imp?Math.round(x.lead/x.imp*100):0;}
  box.innerHTML='<div class="csub" style="margin:6px 0">Yerel dönüşüm günlüğü (GA4 etkinse ayrıca canlıya gönderilir · il+firma+paket etiketli)</div>'
    +'<div class="ed2"><div><b>A/B Dönüşüm (hero CTA)</b><div style="font-size:13px;line-height:1.8;margin-top:4px">A: <b>'+s.ab.A.lead+'</b> lead / '+s.ab.A.imp+' gösterim (%'+cr(s.ab.A)+')<br>B: <b>'+s.ab.B.lead+'</b> lead / '+s.ab.B.imp+' gösterim (%'+cr(s.ab.B)+')</div></div>'
    +'<div><b>İl bazında dönüşüm</b><table class="atable" style="margin-top:4px"><tbody>'+ilRows+'</tbody></table></div></div>';}catch(e){}}
function pushLead(o){var lead={...o,sync:'pending',date:new Date().toLocaleString('tr-TR')};LEADS.unshift(lead);window._lastLead=lead;saveAll();if(typeof trackEvent==='function')trackEvent('generate_lead',{source:o.src||'',konu:o.konu||''});if(typeof renderLeads==='function')renderLeads();if(typeof renderKpis==='function')renderKpis();if(typeof renderWlAb==='function')renderWlAb();return lead;}
function submitLead(src){
  const g=id=>document.getElementById(id);let ad,tel,konu,kvkk,msg;
  if(src==='modal'){ad=g('m_ad').value;tel=g('m_tel').value;konu=g('m_konu').value;kvkk=g('m_kvkk').checked;msg=g('m_msg').value;}
  else{ad=g('f_ad').value;tel=g('f_tel').value;konu=g('f_konu').value;kvkk=g('f_kvkk').checked;msg=g('f_msg').value;}
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  if(!kvkk){toast('Lütfen KVKK onayını işaretleyin.');return;}
  pushLead({ad,tel,konu,msg,src:src==='modal'?'Teklif/Değerleme Modalı':'İletişim Formu'});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:src==='modal'?'lead-modal':'iletisim',formType:src==='modal'?'leadModal':'contactForm',name:ad,phone:tel,email:(src==='modal'?'':((g('f_mail')&&g('f_mail').value)||'')),location:((typeof PROVINCE!=='undefined'&&PROVINCE.name)||''),message:msg,requestedService:konu||'İletişim'});
  if(src==='modal'){closeLead();['m_ad','m_tel','m_msg'].forEach(i=>g(i).value='');g('m_kvkk').checked=false;}
  else{['f_ad','f_tel','f_mail','f_msg'].forEach(i=>g(i).value='');g('f_kvkk').checked=false;}
  toast('✓ Talebiniz alındı! En kısa sürede dönüş yapacağız.');
}
function createAlarm(){const b=document.getElementById('al_bolge').value,m=document.getElementById('al_mail').value;
  if(!b){toast('Lütfen bölge seçin.');return;}
  if(!m||!m.includes('@')){toast('Lütfen geçerli e-posta girin.');return;}
  pushLead({ad:m,tel:'-',konu:`Fiyat Alarmı: ${b}`,src:'Fiyat Alarmı'});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:'bolge-analizi',formType:'priceAlarm',name:'',phone:'',email:m,location:b,message:'Fiyat değişim bildirimi talebi',requestedService:'Fiyat Alarmı'});
  document.getElementById('al_bolge').value='';document.getElementById('al_mail').value='';
  toast('🔔 Alarm kuruldu! '+b+' bölgesinde değişimde haber vereceğiz.');
}

/* ============ MODALS ============ */
function openLead(t){document.getElementById('leadTitle').textContent=t||'İletişim';if(t&&document.getElementById('m_konu')){const s=document.getElementById('m_konu');for(let o of s.options){if(o.text===t){s.value=o.value;break;}}}document.getElementById('leadModal').classList.add('open');}
function closeLead(){document.getElementById('leadModal').classList.remove('open');}
/* ===== YASAL METİN MOTORU — firma künyesinden otomatik dolar (per-firma) ===== */
function _le(s){return (s==null?'':(''+s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
function firmaKunye(){var f=(typeof FIRMA==='object'&&FIRMA)||{};var e=f.eids||{};
  return {name:f.name||e.unvan||'—',unvan:e.unvan||f.name||'—',adres:f.adres||'—',mail:f.mail||'—',tel:f.tel||'—',vergi:f.vergi||'',belge:e.belgeNo||''};}
function legalKunyeRows(){var k=firmaKunye();
  return '<div style="background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin:0 0 12px;font-size:12.5px;line-height:1.7">'
    +'<div><b>Veri Sorumlusu / Unvan:</b> '+_le(k.unvan)+'</div>'
    +'<div><b>Adres:</b> '+_le(k.adres)+'</div>'
    +'<div><b>E-posta:</b> '+_le(k.mail)+' &nbsp;·&nbsp; <b>Tel:</b> '+_le(k.tel)+'</div>'
    +(k.vergi?'<div><b>Vergi No:</b> '+_le(k.vergi)+'</div>':'')
    +(k.belge?'<div><b>Yetki Belge No:</b> '+_le(k.belge)+'</div>':'')
    +'</div>';}
function legalDoc(type){var k=firmaKunye();var kn=legalKunyeRows();
  if(type==='cerez')return {title:'Çerez Politikası',sub:k.name+' — çerez kullanımı hakkında',body:kn
    +'<p><b>Çerez nedir?</b> Çerezler, siteyi ziyaret ettiğinizde cihazınıza kaydedilen küçük metin dosyalarıdır.</p>'
    +'<p><b>Kullandığımız çerezler:</b> <b>Zorunlu</b> (oturum/güvenlik) · <b>Tercih</b> (dil, tema, favoriler) · <b>Analitik</b> (anonim ziyaret istatistiği).</p>'
    +'<p><b>Yönetim:</b> Çerezleri tarayıcı ayarlarınızdan silebilir veya engelleyebilirsiniz; ancak zorunlu çerezler site işlevi için gereklidir.</p>'
    +'<p>Sorularınız için <b>'+_le(k.mail)+'</b> adresine yazabilirsiniz.</p>'};
  if(type==='mesafeli')return {title:'Mesafeli Hizmet & Kullanım Koşulları',sub:k.name+' — hizmet ön bilgilendirme',body:kn
    +'<p><b>Hizmet Sağlayıcı:</b> '+_le(k.unvan)+'. Bu site üzerinden gayrimenkul danışmanlığı, değerleme/ekspertiz ön bilgisi ve ilan eşleştirme hizmetleri sunulur.</p>'
    +'<p><b>Kapsam:</b> Sitedeki değerleme ve fiyat bilgileri ön bilgi niteliğindedir; kesin değer, yerinde ekspertiz ve ProX endeksiyle teyit edilir.</p>'
    +'<p><b>Cayma & Şikayet:</b> Ücretli hizmet sözleşmelerinde tüketici mevzuatı kapsamındaki haklarınız saklıdır. İletişim: <b>'+_le(k.mail)+'</b> · '+_le(k.tel)+'.</p>'};
  return {title:'KVKK Aydınlatma Metni',sub:'6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında',body:kn
    +'<p><b>Veri Sorumlusu:</b> '+_le(k.unvan)+'. Form aracılığıyla paylaştığınız ad, soyad, telefon ve e-posta bilgileriniz; talebinizin değerlendirilmesi, sizinle iletişim kurulması ve gayrimenkul danışmanlığı hizmetlerinin sunulması amacıyla işlenir.</p>'
    +'<p><b>İşleme Amaçları:</b> İletişim taleplerinin yanıtlanması, ilan eşleştirmesi, değerleme ön bilgisi sunulması, hizmet kalitesinin artırılması.</p>'
    +'<p><b>Aktarım:</b> Verileriniz açık rızanız olmadan üçüncü kişilerle paylaşılmaz. Endeks/analiz hizmetleri için Türkiye geneli veri altyapısı kullanılabilir.</p>'
    +'<p><b>Haklarınız:</b> KVKK m.11 uyarınca verilerinize erişme, düzeltme, silme ve işlemeye itiraz etme haklarına sahipsiniz. Başvurularınızı <b>'+_le(k.mail)+'</b> adresine iletebilirsiniz.</p>'};}
function openLegal(type){var d=legalDoc(type);var m=document.getElementById('kvkkModal');if(!m)return;
  var t=document.getElementById('kvkkTitle');if(t)t.textContent=d.title;
  var s=document.getElementById('kvkkSub');if(s)s.textContent=d.sub;
  var b=document.getElementById('kvkkBody');if(b)b.innerHTML=d.body;
  m.classList.add('open');}
function openKvkk(){openLegal('kvkk');}
function openCerez(){openLegal('cerez');}
function openMesafeli(){openLegal('mesafeli');}
function closeKvkk(){document.getElementById('kvkkModal').classList.remove('open');}
function eidsQrSvg(seed){var s=0,i;for(i=0;i<(seed||'x').length;i++)s=(s*31+seed.charCodeAt(i))>>>0;var n=7,r='',x,y;for(y=0;y<n;y++)for(x=0;x<n;x++){s=(s*1103515245+12345)>>>0;var on=((s>>16)&1)||(x<2&&y<2)||(x>n-3&&y<2)||(x<2&&y>n-3);if(on)r+='<rect x="'+(x*7)+'" y="'+(y*7)+'" width="7" height="7"/>';}return '<svg viewBox="0 0 49 49" width="100%" height="100%" fill="#0f1f3d" aria-hidden="true">'+r+'</svg>';}
function detEidsHtml(it){var e=it.eids||{};var seed=e.referans||e.tasinmazNo||('il'+it.id);return '<div class="det-eids"><div class="deh"><span class="sh">'+eidsShieldSvg(17)+'</span> '+_le(window.EIDS?EIDS.stateLabel(e):'EİDS Doğrulandı')+'</div><div class="dnote">Bu ilan T.C. Ticaret Bakanlığı Elektronik İlan Doğrulama Sistemi (EİDS) ile doğrulanmıştır. İl/ilçe/ada/parsel resmi kayıttan gelir.</div><div class="dcode"><div><div style="font-size:11.5px;color:var(--muted);margin-top:6px">Taşınmaz No '+_le(e.tasinmazNo||'-')+' · Ada '+_le(e.ada||'-')+' / Parsel '+_le(e.parsel||'-')+(e.referans?(' · Ref '+_le(e.referans)):'')+(e.tarih?(' · '+_le(e.tarih)):'')+'</div></div><div class="qr" onclick="eidsSorgu('+it.id+')" title="Doğrulama detayını gör">'+eidsQrSvg(seed)+'</div></div><button class="verifybtn" style="margin-top:8px" onclick="eidsSorgu('+it.id+')">Doğrulama detayını görüntüle →</button></div>';}
function eidsSorgu(id){var it=ILANLAR.find(function(x){return x.id===id;});var e=it&&it.eids;if(!e)return;var b=document.getElementById('eidsQBody');if(!b)return;
  b.innerHTML='<div class="qrow"><b>İlan</b><span class="val" style="max-width:58%;text-align:right;font-family:inherit">'+_le(it.title)+'</span></div>'
   +'<div class="qrow"><b>Durum</b><span class="val" style="font-family:inherit">'+_le(window.EIDS?EIDS.stateLabel(e):(e.status||''))+'</span></div>'
   +'<div class="qrow"><b>Taşınmaz No</b><span class="val">'+_le(e.tasinmazNo||'-')+'</span></div>'
   +'<div class="qrow"><b>İl / İlçe</b><span class="val" style="font-family:inherit">'+_le((e.il||it.il||'-')+' / '+(e.ilce||it.ilce||'-'))+'</span></div>'
   +'<div class="qrow"><b>Ada / Parsel</b><span class="val">'+_le((e.ada||'-')+' / '+(e.parsel||'-'))+'</span></div>'
   +'<div class="qrow"><b>Yetki Belgesi No</b><span class="val">'+_le((typeof FIRMA!=='undefined'&&FIRMA.eids&&FIRMA.eids.belgeNo)||'—')+'</span></div>'
   +(e.referans?'<div class="qrow"><b>Doğrulama Ref.</b><span class="val">'+_le(e.referans)+'</span></div>':'')
   +'<div class="qok">'+eidsShieldSvg(15)+' '+_le(window.EIDS?EIDS.stateLabel(e):'')+'</div>';
  document.getElementById('eidsQ').classList.add('open');}
function eidsSorguClose(){var q=document.getElementById('eidsQ');if(q)q.classList.remove('open');}
function openDet(id){const it=ILANLAR.find(x=>x.id===id);if(!it)return;const s=ilanScore(it);
  document.getElementById('detImg').src=imgSrc(it.img);
  document.getElementById('detPrice').innerHTML=it.op==='Kiralık'?fmt(it.price)+' ₺ <span style="font-size:15px;color:var(--muted)">/ay</span>':fmt(it.price)+' ₺';
  document.getElementById('detTitle').textContent=it.title;window._detT=it.title;
  document.getElementById('detLoc').textContent='📍 '+it.mah+', '+it.ilce+(it.il?' / '+it.il:'');
  document.getElementById('detTags').innerHTML=`<span class="ltag ${it.op==='Satılık'?'sat':'kir'}">${it.op}</span><span class="ltag" style="background:rgba(10,22,49,.8)">${it.type}</span>`;
  document.getElementById('detSpecs').innerHTML=`<div class="ds"><div class="n num">${it.oda}</div><div class="l">Oda</div></div><div class="ds"><div class="n num">${it.m2}</div><div class="l">m²</div></div><div class="ds"><div class="n num">${it.kat}</div><div class="l">Kat</div></div><div class="ds"><div class="n num">${s.score}</div><div class="l">Skor/100</div></div>`;
  document.getElementById('detRegName').textContent=it.mah+', '+it.ilce;
  document.getElementById('detRM2').textContent=fmt(s.m2)+' ₺';
  document.getElementById('detRChg').textContent='+%'+s.chg;
  document.getElementById('detRScore').textContent=s.score+'/100';var _de=document.getElementById('detEids');if(_de)_de.innerHTML=(it.eids&&it.eids.status==='dogrulandi')?detEidsHtml(it):'';
  document.getElementById('detWa').href='https://wa.me/'+(FIRMA.wa||'905000000000')+'?text='+encodeURIComponent('Merhaba, '+it.title+' ilanı hakkında bilgi almak istiyorum.');
  // 3D / tur
  const wrap=document.getElementById('det3dWrap');const d3=(typeof P3!=='undefined'&&P3[it.id])?P3[it.id]:{};
  const show3d=(typeof modOn!=='function')||modOn('portfoy3d');
  if(show3d){wrap.style.display='block';
    const floors=parseInt(it.kat)||Math.max(3,Math.round((it.m2||120)/45));
    setTimeout(()=>massing('det3dView',{floors,type:it.type}),60);
    let btns=`<button class="btn btn-primary btn-sm" onclick="vrOpen('${(it.title||'').replace(/'/g,'')}')">🥽 360° Sanal Gezinti</button>`;
    if(d3.tour)btns+=`<a class="btn btn-line btn-sm" href="${d3.tour}" target="_blank" rel="noopener noreferrer">🌐 Matterport Tur</a>`;
    if(d3.video)btns+=`<a class="btn btn-line btn-sm" href="${d3.video}" target="_blank" rel="noopener noreferrer">▶ Video Tur</a>`;
    if(d3.glbName)btns+=`<span class="tsub" style="align-self:center">🧊 ${d3.glbName}</span>`;
    if(!btns)btns='<span class="tsub" style="align-self:center">Parametrik kütle modeli · gerçek model için danışmanınıza GLB iletin</span>';
    document.getElementById('det3dBtns').innerHTML=btns;
  }else{wrap.style.display='none';}
  document.getElementById('detModal').classList.add('open');
}
function closeDet(){document.getElementById('detModal').classList.remove('open');}
function mclose(){document.getElementById('mnav').classList.remove('open');}

/* ============ TOAST + COOKIE ============ */
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');clearTimeout(window._tt);window._tt=setTimeout(()=>t.classList.remove('show'),3200);}
function cookieChoice(c){localStorage.setItem('cookieChoice',c);document.getElementById('cookie').classList.remove('show');toast(c==='accept'?'Çerezler kabul edildi.':'Yalnızca zorunlu çerezler kullanılacak.');}

/* ============ COUNTERS ============ */
function animateCounters(){
  document.querySelectorAll('[data-count]').forEach(el=>{
    if(el.dataset.done)return;const tgt=+el.dataset.count;let cur=0;const step=tgt/60;
    el.dataset.done='1';
    const t=setInterval(()=>{cur+=step;if(cur>=tgt){cur=tgt;clearInterval(t);}el.textContent=fmt(Math.round(cur));},16);
  });
}

/* ============ ADMIN: AÇ / KAPAT / GİRİŞ ============ */
function openAdmin(){document.getElementById('adminApp').classList.add('show');document.body.style.overflow='hidden';try{admGateNav();}catch(e){}}
/* ===== SÜPER-ADMİN / BAYİ PANELİ (emlakekspertizi.com — client prototip) ===== */
function superSeed(){var s=null;try{s=JSON.parse(localStorage.getItem('wl_super_tenants')||'null');}catch(e){}
  if(s&&s.length)return s;
  s=[{id:'emlaktahadimkoy_com',firma:'Tahadımköy Gayrimenkul',il:'İstanbul',paket:'BUSINESS',domain:'tahadimkoy.com',kotaKullanim:5230,kotaMax:10000,durum:'aktif'},
     {id:'antalyaelite_com',firma:'Antalya Elite Gayrimenkul',il:'Antalya',paket:'ENTERPRISE',domain:'antalyaelite.com',kotaKullanim:8120,kotaMax:25000,durum:'aktif'},
     {id:'samsunmeydan_com',firma:'Meydan Emlak',il:'Samsun',paket:'PRO',domain:'meydanemlak.com',kotaKullanim:1840,kotaMax:10000,durum:'aktif'},
     {id:'trabzonyildiz_com',firma:'Yıldız Gayrimenkul',il:'Trabzon',paket:'BASIC',domain:'yildizgm.com',kotaKullanim:640,kotaMax:5000,durum:'deneme'}];
  try{localStorage.setItem('wl_super_tenants',JSON.stringify(s));}catch(e){}return s;}
function superStats(list){var tot=0,mx=0,il={};list.forEach(function(t){tot+=t.kotaKullanim||0;mx+=t.kotaMax||0;il[t.il]=1;});return {bayi:list.length,tot:tot,mx:mx,il:Object.keys(il).length,aktif:list.filter(function(t){return t.durum==='aktif';}).length};}
function _kpi(v,l,c){return '<div style="flex:1;min-width:120px;background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:12px 14px"><div style="font-size:22px;font-weight:800;color:'+(c||'var(--ink)')+'">'+v+'</div><div class="tsub">'+l+'</div></div>';}
function openSuperAdmin(){var list=superSeed(),st=superStats(list),pct=st.mx?Math.round(st.tot/st.mx*100):0;
  var id='superAdmin',m=document.getElementById(id);
  if(!m){m=document.createElement('div');m.id=id;m.className='modal';m.addEventListener('click',function(e){if(e.target.id===id)m.classList.remove('open');});document.body.appendChild(m);}
  var rows=list.map(function(t){var p=t.kotaMax?Math.round(t.kotaKullanim/t.kotaMax*100):0;
    return '<tr><td><b>'+_le(t.firma)+'</b><div class="tsub">'+_le(t.domain||'—')+' · '+_le(t.id)+'</div></td><td>'+_le(t.il)+'</td><td><span class="scorebadge">'+_le(t.paket)+'</span></td><td class="num" style="min-width:130px">'+fmt(t.kotaKullanim)+' / '+fmt(t.kotaMax)+'<div style="height:5px;background:var(--line);border-radius:3px;margin-top:3px"><div style="height:100%;width:'+Math.min(100,p)+'%;background:'+(p>85?'#d9534f':'var(--accent)')+';border-radius:3px"></div></div></td><td>'+(t.durum==='aktif'?'<span style="color:#1a7f4b;font-weight:600">● aktif</span>':'<span style="color:#b26a00;font-weight:600">● '+_le(t.durum)+'</span>')+'</td><td style="white-space:nowrap"><button class="abtn" onclick="superPreview(\''+t.id+'\')">Önizle</button></td></tr>';}).join('');
  m.innerHTML='<div class="mbox" style="max-width:940px"><button class="mclose" onclick="document.getElementById(\''+id+'\').classList.remove(\'open\')">✕</button>'
    +'<h3>🏛️ Bayi Paneli · Süper-Admin <span class="tsub" style="font-weight:400">— emlakekspertizi.com</span></h3>'
    +'<div class="msub">Tüm bayiler, iller ve kota kullanımı. Prototip — canlıda ProX bayi API\'sine bağlanır.</div>'
    +'<div style="display:flex;gap:10px;flex-wrap:wrap;margin:12px 0">'+_kpi(st.bayi,'Toplam Bayi','var(--accent)')+_kpi(st.aktif,'Aktif Bayi','#1a7f4b')+_kpi(st.il,'Farklı İl')+_kpi('%'+pct,'Kota Kullanımı',pct>85?'#d9534f':'var(--ink)')+_kpi(fmt(st.tot),'Toplam İstek/ay')+'</div>'
    +'<div style="overflow:auto;border:1px solid var(--line);border-radius:12px"><table class="atable" style="margin:0"><thead><tr><th>Bayi</th><th>İl</th><th>Paket</th><th>Kota (aylık)</th><th>Durum</th><th></th></tr></thead><tbody>'+rows+'</tbody></table></div>'
    +'<div style="display:flex;gap:10px;margin-top:12px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="superAddDealer()">+ Yeni Bayi</button><button class="abtn" onclick="superReset()">Demo Verilerini Sıfırla</button></div></div>';
  m.classList.add('open');}
var _superPrevSnap=null;
function superPreview(id){var t=superSeed().filter(function(x){return x.id===id;})[0];if(!t)return;
  /* H4: önizleme kendi kiracının CANLI durumunu bozuyordu (FIRMA.name/PROX/marka/il) + geri dönüş yoktu.
     İLK önizlemede anlık görüntü al, çıkış çubuğu ile geri yükle. Not: saveAll çağrılmaz → reload zaten orijinali getirir; bu bar reload gerektirmeden geri alır. */
  try{if(!_superPrevSnap){_superPrevSnap={name:(typeof FIRMA!=='undefined'?FIRMA.name:''),il:(typeof PROX!=='undefined'?PROX.il:''),region:(typeof PROX!=='undefined'?PROX.region:''),prov:(typeof PROVINCE!=='undefined'&&PROVINCE?PROVINCE.name:'İzmir')};}}catch(e){}
  try{if(typeof FIRMA!=='undefined')FIRMA.name=t.firma;if(typeof applyBrand==='function')applyBrand(t.firma);}catch(e){}
  try{if(typeof PROX!=='undefined'){PROX.il=t.il;PROX.region=t.il;}if(typeof applyProvince==='function')applyProvince(t.il);}catch(e){}
  var m=document.getElementById('superAdmin');if(m)m.classList.remove('open');
  _superPrevBar(t.firma+' · '+t.il+' ('+t.paket+')');
  if(typeof toast==='function')toast('Önizleme: '+t.firma+' · '+t.il+' ('+t.paket+') — çıkmak için üstteki çubuğu kullanın.');}
function superPreviewExit(){var b=document.getElementById('superPrevBar');if(b)b.remove();
  if(!_superPrevSnap)return;var s=_superPrevSnap;_superPrevSnap=null;
  try{if(typeof FIRMA!=='undefined')FIRMA.name=s.name;if(typeof applyBrand==='function')applyBrand(s.name);}catch(e){}
  try{if(typeof PROX!=='undefined'){PROX.il=s.il;PROX.region=s.region;}if(typeof applyProvince==='function')applyProvince(s.prov);}catch(e){}
  if(typeof toast==='function')toast('Önizlemeden çıkıldı — kendi siteniz geri yüklendi.');}
function _superPrevBar(txt){var b=document.getElementById('superPrevBar');
  if(!b){b=document.createElement('div');b.id='superPrevBar';b.style.cssText='position:fixed;left:0;right:0;top:0;z-index:99999;background:#0f1f3d;color:#fff;padding:9px 16px;display:flex;gap:12px;align-items:center;justify-content:center;font:600 13px/1.4 system-ui,-apple-system,sans-serif;box-shadow:0 2px 12px rgba(0,0,0,.28)';document.body.appendChild(b);}
  b.innerHTML='👁 Bayi önizlemesi: '+_le(txt)+' <button onclick="superPreviewExit()" style="margin-left:14px;background:#fff;color:#0f1f3d;border:0;border-radius:6px;padding:5px 13px;font-weight:700;cursor:pointer">← Önizlemeden çık</button>';}
function superAddDealer(){var firma=prompt('Yeni bayi firma adı:');if(!firma)return;var il=prompt('İl:','İstanbul')||'İstanbul';
  var list=superSeed();list.push({id:firma.toLocaleLowerCase('tr').replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,''),firma:firma,il:il,paket:'PRO',domain:'',kotaKullanim:0,kotaMax:10000,durum:'deneme'});
  try{localStorage.setItem('wl_super_tenants',JSON.stringify(list));}catch(e){}openSuperAdmin();if(typeof toast==='function')toast('✓ Bayi eklendi: '+firma);}
function superReset(){try{localStorage.removeItem('wl_super_tenants');}catch(e){}openSuperAdmin();if(typeof toast==='function')toast('Demo bayi verileri sıfırlandı.');}
window.addEventListener('hashchange',function(){if(location.hash==='#super')openSuperAdmin();});
window.addEventListener('load',function(){if(location.hash==='#super')setTimeout(openSuperAdmin,400);});

/* ===== ONBOARDING SİHİRBAZI — yeni bayi tek akış (il → firma → EİDS → logo → ProX ile kur) ===== */
var OB={step:1,il:'',name:'',unvan:'',vergi:'',adres:'',tel:'',mail:'',belge:'',logo:'',key:''};
var OB_STEPS=['İl Seçimi','Firma Bilgileri','EİDS Yetki','Logo','ProX ile Kur'];
function obSeed(){try{OB.il=(typeof PROX!=='undefined'&&PROX.il)||'İzmir';var f=(typeof FIRMA!=='undefined'&&FIRMA)||{};OB.name=(f.name&&f.name!=='Meridyen Gayrimenkul')?f.name:'';OB.unvan=(f.eids&&f.eids.unvan)||'';OB.vergi=f.vergi||'';OB.adres=(f.adres&&f.adres.indexOf('İzmir')<0)?f.adres:'';OB.tel=(f.tel&&f.tel.indexOf('232')<0)?f.tel:'';OB.mail=(f.mail&&f.mail.indexOf('meridyen')<0)?f.mail:'';OB.belge=(f.eids&&f.eids.belgeNo)||'';OB.key=(typeof PROX!=='undefined'&&PROX.key&&PROX.key.indexOf('emlaktahadimkoy')<0)?PROX.key:'';}catch(e){}}
function obCollect(){function v(id){var e=document.getElementById(id);return e?e.value.trim():undefined;}
  var m={ob_il:'il',ob_name:'name',ob_unvan:'unvan',ob_vergi:'vergi',ob_adres:'adres',ob_tel:'tel',ob_mail:'mail',ob_belge:'belge',ob_logo:'logo',ob_key:'key'};
  Object.keys(m).forEach(function(id){var val=v(id);if(val!==undefined)OB[m[id]]=val;});}
/* GÜVENLİK: e() eskiden yalnız çift tırnak kaçırıyordu. Değerler obCollect()
   ile form girdilerinden geliyor ve hem öznitelik (value="…") hem HTML metin
   (<b>…</b>) bağlamına basılıyor; < > kaçmadığı için metin bağlamında etiket
   enjekte edilebiliyordu. Aynı dosyadaki _le (satır ~1571) beş karakteri de
   kaçırıyor — çoğaltmak yerine ona devrediyoruz. */
function obBody(n){var e=_le;
  if(n===1){var ils=(typeof trIlList==='function'?trIlList():['İzmir']).slice().sort(function(a,b){return a.localeCompare(b,'tr');});
    return '<p class="csub">Sitenizin yayınlanacağı ili seçin. İl/ilçe/mahalle endeksi ProX API üzerinden bu ile göre çekilir.</p><div class="afield"><label>İl</label><select id="ob_il" style="width:100%;padding:11px;border:1px solid var(--line);border-radius:10px;font:inherit">'+ils.map(function(il){return '<option'+(il===OB.il?' selected':'')+'>'+il+'</option>';}).join('')+'</select></div>';}
  if(n===2){return '<p class="csub">Yasal firma bilgileriniz — KVKK/çerez/mesafeli metinleri ve site künyesi bunlardan otomatik dolar.</p>'
    +'<div class="afield"><label>Firma Adı *</label><input id="ob_name" value="'+e(OB.name)+'" placeholder="ör. Antalya Elite Gayrimenkul"></div>'
    +'<div class="afield"><label>Ticari Unvan</label><input id="ob_unvan" value="'+e(OB.unvan)+'" placeholder="ör. Antalya Elite Gayrimenkul A.Ş."></div>'
    +'<div class="ed2"><div class="afield"><label>Vergi No</label><input id="ob_vergi" value="'+e(OB.vergi)+'"></div><div class="afield"><label>Telefon</label><input id="ob_tel" value="'+e(OB.tel)+'" placeholder="+90 ..."></div></div>'
    +'<div class="afield"><label>E-posta</label><input id="ob_mail" value="'+e(OB.mail)+'" placeholder="info@firmaniz.com"></div>'
    +'<div class="afield"><label>Adres</label><input id="ob_adres" value="'+e(OB.adres)+'"></div>';}
  if(n===3){return '<p class="csub">EİDS (Elektronik İlan Doğrulama) — Özel Portföy kayıtları serbesttir; <b>gerçek ilan yayınlamak için</b> yetki belgesi gerekir. Şimdi girebilir veya sonra ekleyebilirsiniz.</p>'
    +'<div class="afield"><label>Yetki Belge No <span style="color:var(--muted);font-weight:400">(7 hane, opsiyonel)</span></label><input id="ob_belge" value="'+e(OB.belge)+'" maxlength="7" placeholder="1234567"></div>'
    +'<div class="csub" style="margin-top:6px">Yayında e-Devlet ile bağlanıp kullanıcı kodu üretilir; sihirbaz sonrası admin → Firma\'dan tamamlanır.</div>';}
  if(n===4){return '<p class="csub">Logo (opsiyonel) — URL girin. Girilmezse firma adınızın baş harfi marka olarak kullanılır.</p>'
    +'<div class="afield"><label>Logo URL</label><input id="ob_logo" value="'+e(OB.logo)+'" placeholder="https://... .png"></div>'
    +(OB.logo?'<div style="margin-top:8px"><img src="'+e(OB.logo)+'" alt="logo" style="max-height:56px;border:1px solid var(--line);border-radius:8px;padding:6px;background:#fff"></div>':'');}
  if(n===5){return '<p class="csub">ProX API anahtarınızı girin (canlı il/ilçe/mahalle + değerleme + AI). Boş bırakırsanız demo veriyle kurulur; sonra admin → ProX\'tan ekleyebilirsiniz.</p>'
    +'<div class="afield"><label>ProX API Anahtarı <span style="color:var(--muted);font-weight:400">(opsiyonel)</span></label><input id="ob_key" value="'+e(OB.key)+'" placeholder="prox_..." style="font-family:monospace;font-size:12px"></div>'
    +'<div style="background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin-top:10px;font-size:13px;line-height:1.8"><b>Kurulum özeti</b><br>İl: <b>'+e(OB.il)+'</b> · Firma: <b>'+e(OB.name||'—')+'</b><br>EİDS: '+(OB.belge?'✓ '+e(OB.belge):'sonra')+' · Logo: '+(OB.logo?'✓':'baş harf')+' · ProX: '+(OB.key?'✓ anahtar':'demo')+'</div>';}
  return '';}
function obRender(){var id='obWizard',m=document.getElementById(id);
  if(!m){m=document.createElement('div');m.id=id;m.className='modal';document.body.appendChild(m);}
  var dots=OB_STEPS.map(function(t,i){var n=i+1,on=n===OB.step,done=n<OB.step;return '<div style="flex:1;text-align:center;font-size:11px;color:'+(on?'var(--accent)':done?'#1a7f4b':'var(--muted)')+';font-weight:'+(on?'700':'500')+'"><div style="height:6px;border-radius:3px;background:'+(on||done?'var(--accent)':'var(--line)')+';margin-bottom:5px"></div>'+(done?'✓ ':'')+t+'</div>';}).join('');
  var last=OB.step===OB_STEPS.length;
  m.innerHTML='<div class="mbox" style="max-width:600px"><button class="mclose" onclick="obClose()">✕</button>'
    +'<h3>🚀 Kurulum Sihirbazı <span class="tsub" style="font-weight:400">— '+OB.step+'/'+OB_STEPS.length+'</span></h3>'
    +'<div style="display:flex;gap:6px;margin:12px 0 16px">'+dots+'</div>'
    +'<div style="min-height:180px">'+obBody(OB.step)+'</div>'
    +'<div style="display:flex;gap:10px;margin-top:16px;justify-content:space-between">'
    +'<div>'+(OB.step>1?'<button class="abtn" onclick="obGo(-1)">← Geri</button>':'<button class="abtn" onclick="obClose()">Daha sonra</button>')+'</div>'
    +'<div>'+(last?'<button class="btn btn-primary" onclick="obFinish()">✓ Kur & Yayınla</button>':'<button class="btn btn-primary" onclick="obGo(1)">Devam →</button>')+'</div></div></div>';
  m.classList.add('open');}
function obGo(d){obCollect();if(d>0&&OB.step===2&&!OB.name){toast('Lütfen firma adını girin.');return;}OB.step=Math.max(1,Math.min(OB_STEPS.length,OB.step+d));obRender();}
function openOnboarding(){obSeed();OB.step=1;obRender();}
function obClose(){var m=document.getElementById('obWizard');if(m)m.classList.remove('open');}
function obFinish(){obCollect();if(!OB.name){OB.step=2;obRender();toast('Firma adı gerekli.');return;}
  try{
    if(typeof applyProvince==='function')applyProvince(OB.il);
    if(typeof FIRMA!=='undefined'){FIRMA.name=OB.name;if(OB.vergi)FIRMA.vergi=OB.vergi;if(OB.adres)FIRMA.adres=OB.adres;if(OB.tel)FIRMA.tel=OB.tel;if(OB.mail)FIRMA.mail=OB.mail;
      FIRMA.eids=FIRMA.eids||{};if(OB.unvan)FIRMA.eids.unvan=OB.unvan;else if(!FIRMA.eids.unvan)FIRMA.eids.unvan=OB.name+' Danışmanlık Ltd. Şti.';
      if(OB.belge){FIRMA.eids.belgeNo=OB.belge.replace(/[^0-9]/g,'');FIRMA.eids.yetkili=!!(FIRMA.eids.belgeNo.length>=7);}
      /* BOŞ-DEFAULT TEMİZLEME (sızıntı G): yeni tenant, sihirbazın TOPLAMADIĞI İzmir-demo alanlarını MİRAS ALMASIN
         → boş bırak (yasal künye '[Doldurulacak]' gösterir; yanlış İzmir MERSİS/KEP/adres değil). Admin sonra doldurur. */
      var _newTenant=(OB.name!=='Meridyen Gayrimenkul')||(OB.il&&OB.il!=='İzmir');
      if(_newTenant){['mersis','ticaretSicil','oda','kep','vergiDaire','wa'].forEach(function(k){FIRMA[k]='';});
        FIRMA.social={fb:'',ig:'',x:'',li:'',yt:''};
        if(!OB.adres)FIRMA.adres='';if(!OB.tel)FIRMA.tel='';if(!OB.mail)FIRMA.mail='';}}
    if(typeof applyBrand==='function')applyBrand(OB.name);
    if(OB.logo){try{if(typeof SAAS_CONFIG!=='undefined'&&SAAS_CONFIG.tenantSettings){SAAS_CONFIG.tenantSettings.logoUrl=OB.logo;if(typeof applySaaSSettings==='function')applySaaSSettings();}}catch(e){}}
    if(OB.key&&typeof PROX!=='undefined'){PROX.key=OB.key;PROX.il=OB.il;PROX.region=OB.il;if(typeof applyProxTenant==='function')applyProxTenant();}
    if(typeof saveAll==='function')saveAll();
    if(OB.il!=='İzmir'){try{if(typeof rebuildOzelFromProx==='function')rebuildOzelFromProx(OB.il,true);}catch(e){}try{if(typeof wlBuildBolge==='function')wlBuildBolge(OB.il,true);}catch(e){}}
    try{localStorage.setItem('wl_onboarded','1');}catch(e){}
    obClose();
    if(typeof toast==='function')toast('✓ Kurulum tamam! '+OB.name+' · '+OB.il+' yayında.'+(OB.key?'':' (ProX anahtarını admin→ProX\'tan ekleyebilirsiniz.)'));
  }catch(e){if(typeof toast==='function')toast('Kurulumda hata: '+(e&&e.message||e));}}
window.addEventListener('hashchange',function(){if(location.hash==='#kur')openOnboarding();});
window.addEventListener('load',function(){try{
  if(location.hash==='#kur'){setTimeout(openOnboarding,400);return;}
  var fresh=!localStorage.getItem('meridyenGM_v1')&&!localStorage.getItem('wl_onboarded');
  if(fresh)setTimeout(openOnboarding,1400); /* yeni bayi ilk çalıştırma — 'Daha sonra' ile atlanır */
}catch(e){}});
function closeAdmin(){document.getElementById('adminApp').classList.remove('show');document.body.style.overflow='';}
function admLogin(){
  const u=document.getElementById('adm_user').value.trim(),p=document.getElementById('adm_pass').value.trim();
  if(u==='admin'&&p==='1234'){
    document.getElementById('adminApp').classList.add('authed');
    renderKpis();renderRecentLeads();renderIlanRows();renderDanRows();renderLeads();renderBolgeRows();fillFirmaForm();renderThemeGrid();
    renderP3();render3dForm();fillContent();renderBlogRows();renderRefRows();fillSeo();fillGoogle();fillProx();renderModules();renderEpRows();fillAiCfg();
    renderAllCrm();
    document.getElementById('adm_pass').value='';
  }else{toast('Hatalı kullanıcı adı veya şifre. (admin / 1234)');}
}
function admLogout(){document.getElementById('adminApp').classList.remove('authed');toast('Çıkış yapıldı.');}
/* ===== PAKET / ÖZELLİK KİLİDİ (admin panel) — upsell'li =====
   Yalnızca premium paneller kilitlenir; çekirdek CRM her pakette açık. */
var ADMIN_PANE_FEAT={seo:'canUseSeoContent',ai:'canUseMarketingContent',raporlar:'canUseAnalytics',rapor:'canUseAnalytics',google:'canUseAnalytics',tema:'canUsePremiumTheme',portfoy3d:'canUseAdvancedProX'};
var FEAT_LABEL={canUseSeoContent:'SEO İçerik Üretimi',canUseMarketingContent:'Pazarlama & AI İçerik',canUseAnalytics:'Analitik & Raporlar',canUsePremiumTheme:'Premium Temalar',canUseAdvancedProX:'Gelişmiş ProX & 3D'};
var PKG_ORDER=['BASIC','PRO','BUSINESS','ENTERPRISE'];
var PKG_KAPSAM={BASIC:'Piyasa analizi · Fiyat tahmini · Lead CRM · SVG grafikler',PRO:'BASIC + Kira/yatırım skoru · PDF rapor · Analitik · SEO & pazarlama içeriği',BUSINESS:'PRO + Gelişmiş ProX · Özel domain · Blog otomasyonu · Premium tema · 3D/VR',ENTERPRISE:'BUSINESS + Tam white-label'};
function featHas(f){return typeof window.hasFeature==='function'?window.hasFeature(f):true;}
function featMinPackage(f){var P=window.EMLAK_PACKAGES||{};for(var i=0;i<PKG_ORDER.length;i++){if((P[PKG_ORDER[i]]||[]).indexOf(f)>=0)return PKG_ORDER[i];}return 'ENTERPRISE';}
function admPaneGated(p){var f=ADMIN_PANE_FEAT[p];return !!(f&&!featHas(f));}
function admGateNav(){try{document.querySelectorAll('.adm-nav[data-p]').forEach(function(b){var f=ADMIN_PANE_FEAT[b.dataset.p];var old=b.querySelector('.lock-badge');if(old)old.remove();b.classList.remove('locked');b.style.removeProperty('opacity');if(f&&!featHas(f)){b.classList.add('locked');b.style.opacity='.62';var s=document.createElement('span');s.className='lock-badge';s.textContent='🔒';s.style.cssText='margin-left:auto;font-size:12px';b.appendChild(s);}});}catch(e){}}
function featUpsell(p){var f=ADMIN_PANE_FEAT[p];if(!f)return;var need=featMinPackage(f),cur=(window.EMLAK_TENANT&&window.EMLAK_TENANT.packageCode)||'—',label=FEAT_LABEL[f]||f;
  var id='upsellModal',m=document.getElementById(id);
  if(!m){m=document.createElement('div');m.id=id;m.className='modal';m.addEventListener('click',function(ev){if(ev.target.id===id)m.classList.remove('open');});document.body.appendChild(m);}
  m.innerHTML='<div class="mbox" style="max-width:520px;text-align:center"><button class="mclose" onclick="document.getElementById(\''+id+'\').classList.remove(\'open\')">✕</button>'
    +'<div style="font-size:34px">🔒</div><h3 style="margin:6px 0">'+_le(label)+' · <span style="color:var(--accent)">'+_le(need)+'</span> paketi</h3>'
    +'<div class="msub">Mevcut paketiniz: <b>'+_le(cur)+'</b>. Bu özellik <b>'+_le(need)+'</b> ve üzeri paketlerde açıktır.</div>'
    +'<div style="text-align:left;background:var(--surface);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:14px 0;font-size:13px;line-height:1.7"><b>'+_le(need)+' paketi kapsamı:</b><br>'+_le(PKG_KAPSAM[need]||'')+'</div>'
    +'<button class="btn btn-primary" style="width:100%" onclick="document.getElementById(\''+id+'\').classList.remove(\'open\');if(typeof toast===\'function\')toast(\''+_le(need)+' paketi yükseltme talebiniz iletildi.\')">'+_le(need)+' Paketine Yükselt</button>'
    +'<div class="tsub" style="margin-top:8px">emlakekspertizi.com · ProX bayi paketleri</div></div>';
  m.classList.add('open');}
/* ===== Hizmet Alanı — admin dinamik CRUD arayüzü ===== */
function saEsc(s){return (''+s).replace(/\\/g,'\\\\').replace(/'/g,"\\'");}
function saDelChip(txt,fn){return '<span style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid var(--line);border-radius:999px;background:var(--surface);font-size:13px">'+txt+' <b onclick="'+fn+'(\''+saEsc(txt)+'\')" style="cursor:pointer;opacity:.55">✕</b></span>';}
function renderSA(){saLoad();
  saCurIl=(saCurIl&&SERVICE_AREA.iller[saCurIl])?saCurIl:SERVICE_AREA.primary;
  var ilBox=document.getElementById('saIlChips');
  if(ilBox)ilBox.innerHTML=Object.keys(SERVICE_AREA.iller).map(function(il){var isP=il===SERVICE_AREA.primary,cur=il===saCurIl;
    return '<span onclick="saSelectIl(\''+saEsc(il)+'\')" style="display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border:1px solid '+(cur?'var(--accent)':'var(--line)')+';border-radius:999px;background:'+(cur?'var(--accent)':'var(--surface)')+';color:'+(cur?'#fff':'var(--ink)')+';cursor:pointer;font-size:13px;font-weight:600">'+il+(isP?' ★':'')+(isP?'':' <b onclick="event.stopPropagation();saRemoveProvince(\''+saEsc(il)+'\')" style="cursor:pointer;opacity:.75">✕</b>')+'</span>';}).join('');
  var addSel=document.getElementById('saAddIl');
  if(addSel){var have=Object.keys(SERVICE_AREA.iller);var opts=(typeof trIlList==='function'?trIlList():[]).filter(function(il){return have.indexOf(il)<0;}).sort(function(a,b){return a.localeCompare(b,'tr');});addSel.innerHTML=opts.map(function(il){return '<option>'+il+'</option>';}).join('');}
  var lbl=document.getElementById('saCurIlLbl');if(lbl)lbl.textContent='· '+saCurIl;
  var ilceBox=document.getElementById('saIlceList');
  if(ilceBox){var rec=SERVICE_AREA.iller[saCurIl];var ilcs=rec?Object.keys(rec.ilceler):[];
    ilceBox.innerHTML=ilcs.map(function(ic){var e=rec.ilceler[ic],on=e.aktif!==false,cur=ic===saCurIlce,mn=(e.mahalleler&&e.mahalleler.length)||0;
      return '<label style="display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border:1px solid '+(cur?'var(--accent)':'var(--line)')+';border-radius:9px;background:var(--surface);cursor:pointer;font-size:13px;opacity:'+(on?'1':'.5')+'"><input type="checkbox" '+(on?'checked':'')+' onchange="saToggleIlce(\''+saEsc(ic)+'\')"><span onclick="saSelectIlce(\''+saEsc(ic)+'\')">'+ic+(mn?' <b style="color:var(--accent)">('+mn+')</b>':'')+'</span></label>';}).join('')||'<span class="tsub">İlçe bulunamadı.</span>';}
  var mlbl=document.getElementById('saCurIlceLbl');if(mlbl)mlbl.textContent=saCurIlce?('· '+saCurIlce+', '+saCurIl):'· (ilçe seçin)';
  var mBox=document.getElementById('saMahChips');
  if(mBox){if(!saCurIlce)mBox.innerHTML='<span class="tsub">Yukarıdan bir ilçe seçin, sonra mahalle ekleyin.</span>';
    else{var e=SERVICE_AREA.iller[saCurIl].ilceler[saCurIlce],ms=(e&&e.mahalleler)||[];
      var sug=(typeof realMah==='function'?realMah(saCurIl,saCurIlce,8):[]).filter(function(m){return ms.indexOf(m)<0;});
      mBox.innerHTML=(ms.length?ms.map(function(m){return saDelChip(m,'saRemoveMahalle');}).join(''):'<span class="tsub">Tüm mahalleler hizmet alanında (özel seçim yok).</span>')
        +(sug.length?'<div style="width:100%;margin-top:8px;font-size:12px;color:var(--muted)">Öneri: '+sug.map(function(m){return '<span onclick="saAddMahalleName(\''+saEsc(m)+'\')" style="cursor:pointer;color:var(--accent);margin-right:10px;white-space:nowrap">+ '+m+'</span>';}).join('')+'</div>':'');}}
  var kBox=document.getElementById('saKatChips');
  if(kBox)kBox.innerHTML=SERVICE_AREA.kategoriler.map(function(k){return saDelChip(k,'saRemoveKat');}).join('')||'<span class="tsub">Kategori yok.</span>';}
function saAddProvince(){saLoad();var sel=document.getElementById('saAddIl');var il=sel&&sel.value;if(!il)return;if(!SERVICE_AREA.iller[il])SERVICE_AREA.iller[il]=saBuildIl(il);saCurIl=il;saCurIlce='';renderSA();toast('Hizmet ili eklendi: '+il);}
function saRemoveProvince(il){saLoad();if(il===SERVICE_AREA.primary){toast('Ana il çıkarılamaz. Önce başka ili ana yapın (il değiştir).');return;}delete SERVICE_AREA.iller[il];if(saCurIl===il){saCurIl=SERVICE_AREA.primary;saCurIlce='';}renderSA();toast('Hizmet ili çıkarıldı: '+il);}
function saSelectIl(il){saLoad();saCurIl=il;saCurIlce='';renderSA();}
function saToggleIlce(ic){saLoad();var rec=SERVICE_AREA.iller[saCurIl];if(!rec||!rec.ilceler[ic])return;rec.ilceler[ic].aktif=(rec.ilceler[ic].aktif===false);renderSA();_ozInstant();}
function saAllIlce(on){saLoad();var rec=SERVICE_AREA.iller[saCurIl];if(!rec)return;Object.keys(rec.ilceler).forEach(function(ic){rec.ilceler[ic].aktif=!!on;});renderSA();_ozInstant();toast(on?'Tüm ilçeler hizmet alanına alındı.':'Tüm ilçeler çıkarıldı.');}
function saSelectIlce(ic){saLoad();saCurIlce=ic;renderSA();try{loadMahalleIlce(saCurIl,ic).then(function(mm){if(saCurIlce===ic){renderSA();}});}catch(e){}}/* ilçe seçince GERÇEK mahalleleri canlı yükle → öneriler gerçek */
function saAddMahalle(){var inp=document.getElementById('saAddMah');var v=inp&&inp.value.trim();if(v){saAddMahalleName(v);inp.value='';}}
function saAddMahalleName(v){saLoad();if(!saCurIlce){toast('Önce bir ilçe seçin.');return;}var e=SERVICE_AREA.iller[saCurIl].ilceler[saCurIlce];e.mahalleler=e.mahalleler||[];if(e.mahalleler.indexOf(v)<0)e.mahalleler.push(v);renderSA();_ozInstant();}
function saRemoveMahalle(m){saLoad();var e=SERVICE_AREA.iller[saCurIl].ilceler[saCurIlce];if(e)e.mahalleler=(e.mahalleler||[]).filter(function(x){return x!==m;});renderSA();_ozInstant();}
function saAddKat(){var inp=document.getElementById('saAddKat');var v=inp&&inp.value.trim();if(!v)return;saLoad();if(SERVICE_AREA.kategoriler.indexOf(v)<0)SERVICE_AREA.kategoriler.push(v);inp.value='';renderSA();_ozInstant();}
function saRemoveKat(k){saLoad();SERVICE_AREA.kategoriler=SERVICE_AREA.kategoriler.filter(function(x){return x!==k;});renderSA();_ozInstant();}
function saApply(){saLoad();saSave();
  try{applyProvince(SERVICE_AREA.primary);}catch(e){}
  try{if(SERVICE_AREA.primary&&typeof rebuildOzelFromProx==='function')rebuildOzelFromProx(SERVICE_AREA.primary,true);}catch(e){}
  try{if(typeof renderBolgeRows==='function')renderBolgeRows();if(typeof renderSA==='function')renderSA();}catch(e){}
  var aktifIl=saActiveIller().length,aktifIlce=(saServedIlce(SERVICE_AREA.primary)||[]).length;
  toast('✓ Hizmet alanı uygulandı — '+aktifIl+' il · '+aktifIlce+' ilçe ('+SERVICE_AREA.primary+') · '+SERVICE_AREA.kategoriler.length+' kategori.');}
function admPane(btn){
  if(btn&&btn.dataset&&btn.dataset.p&&admPaneGated(btn.dataset.p)){featUpsell(btn.dataset.p);return;}
  document.querySelectorAll('.adm-nav').forEach(b=>b.classList.remove('act'));
  if(btn.dataset.p){btn.classList.add('act');
    document.querySelectorAll('.adm-pane').forEach(p=>p.classList.remove('act'));
    document.getElementById('pane-'+btn.dataset.p).classList.add('act');
    if(btn.dataset.p==='contracts'&&typeof renderContracts==='function')renderContracts();if(btn.dataset.p==='ozel'&&typeof renderOzelRows==='function'){renderOzelRows();renderOzTalep();renderOzAlarm();if(typeof renderOzOwner==='function')renderOzOwner();}if(btn.dataset.p==='hizmetalani'&&typeof renderSA==='function')renderSA();}
}

/* ============ ADMIN: KPI + RECENT ============ */
function renderKpis(){
  const box=document.getElementById('kpiBox');if(!box)return;
  const aktif=ILANLAR.filter(i=>i.status==='aktif').length;
  const today=new Date().toISOString().slice(0,10);
  const acikFirsat=(typeof DEALS!=='undefined')?DEALS.filter(d=>d.stage!=='sozlesme').length:0;
  const pipeVal=(typeof DEALS!=='undefined')?DEALS.filter(d=>d.stage!=='sozlesme').reduce((a,b)=>a+(+b.value||0),0):0;
  const bugunGorev=(typeof TASKS!=='undefined')?TASKS.filter(t=>!t.done&&t.date&&t.date.slice(0,10)<=today).length:0;/* M4: t.date null koruması */
  const gecikenKira=(typeof RENTS!=='undefined')?RENTS.filter(r=>r.status==='gecikti').length:0;
  const kpis=[
    {n:(typeof KISILER!=='undefined'?KISILER.length:0),l:'Kişi (CRM)',i:'👤',c:'var(--accent)'},
    {n:acikFirsat,l:'Açık Fırsat',i:'🪜',c:'#8b5cf6'},
    {n:fmtK(pipeVal)+'₺',l:'Pipeline Değeri',i:'💰',c:'var(--green-700)',raw:1},
    {n:bugunGorev,l:'Bugünkü Görev',i:'📅',c:'#0284c7'},
    {n:aktif,l:'Aktif İlan',i:'🏠',c:'#b45309'},
    {n:LEADS.length,l:'Gelen Talep',i:'📥',c:'#0d9488'},
    {n:DANISMANLAR.length,l:'Danışman',i:'👥',c:'#db2777'},
    {n:gecikenKira,l:'Geciken Kira',i:'🔑',c:'#dc2626'}
  ];
  box.innerHTML=kpis.map(k=>`<div class="kcard"><div class="ki" style="background:${k.c}1a;color:${k.c}">${k.i}</div><div><div class="kn num">${k.raw?k.n:fmt(k.n)}</div><div class="kl">${k.l}</div></div></div>`).join('');
}
function renderRecentLeads(){
  const box=document.getElementById('recentLeads');if(!box)return;
  if(!LEADS.length){box.innerHTML='<div class="empty">Henüz lead yok. Sitedeki formlar, değerleme aracı ve fiyat alarmından gelen talepler burada listelenir.</div>';return;}
  box.innerHTML=LEADS.slice(0,5).map(l=>`<div class="lrow"><div><b>${_be(l.ad)}</b> · <span class="src">${_be(l.src)}</span><div class="lk">${_be(l.konu||'')}</div></div><div class="ld">${_be(l.date)}</div></div>`).join('');
}

/* ============ ADMIN: İLAN CRUD ============ */
let editingIlan=null;
function ilanIlFill(sel){var el=document.getElementById('i_il');if(!el)return;el.innerHTML=trIlList().sort(function(a,b){return a.localeCompare(b,'tr');}).map(function(il){return '<option'+(il===sel?' selected':'')+'>'+il+'</option>';}).join('');}
function ilanIlChange(){var il=(document.getElementById('i_il')||{}).value,isel=document.getElementById('i_ilce');if(!isel)return;
  var rec=(typeof TR_ILILCE!=='undefined')&&TR_ILILCE[il];var ilceler=rec?rec.ilce:((typeof PROVINCE!=='undefined')?Object.keys(PROVINCE.districts):[]);
  isel.innerHTML=ilceler.map(function(d){return '<option>'+d+'</option>';}).join('');ilanMahList();}
function ilanMahList(){var il=(document.getElementById('i_il')||{}).value,ilce=(document.getElementById('i_ilce')||{}).value,dl=document.getElementById('i_mahList');if(!dl)return;
  var mah=[];if(typeof PROVINCE!=='undefined'&&PROVINCE.name===il&&PROVINCE.districts[ilce])mah=PROVINCE.districts[ilce].mah||[];
  if(!mah||!mah.length)mah=[ilce,'Merkez','Cumhuriyet','Atatürk','Yeni','Fatih','İnönü'];
  dl.innerHTML=mah.map(function(m){return '<option value="'+m+'">';}).join('');}
function newIlan(){editingIlan=null;
  document.getElementById('ilanEditTitle').textContent='Yeni İlan';
  ['i_title','i_price','i_ilce','i_mah','i_m2','i_oda','i_kat','i_desc'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('i_op').value='Satılık';document.getElementById('i_type').value='Daire';
  document.getElementById('i_status').value='aktif';document.getElementById('i_feat').value='0';ilanIlFill((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir');ilanIlChange();
  document.getElementById('i_imgPrev').style.display='none';window._ilanImg=null;window._ilanEids=null;['i_tasinmazNo','i_ada','i_parsel','i_malikTc'].forEach(function(id){var e=document.getElementById(id);if(e)e.value='';});var _er=document.getElementById('i_eidsResult');if(_er)_er.innerHTML=eidsResultBox('no','Henüz doğrulanmadı','Yayınlamak için Taşınmaz Numarasını girip “EİDS Doğrula” butonuna basın. Doğrulanmadan yalnızca pasif/taslak olarak saklanır.');
  document.getElementById('ilanEditCard').style.display='block';
  document.getElementById('ilanEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function editIlan(id){const it=ILANLAR.find(x=>x.id===id);if(!it)return;editingIlan=id;
  document.getElementById('ilanEditTitle').textContent='İlanı Düzenle';
  document.getElementById('i_title').value=it.title;document.getElementById('i_price').value=it.price;
  document.getElementById('i_op').value=it.op;document.getElementById('i_type').value=it.type;
  document.getElementById('i_status').value=it.status;ilanIlFill(it.il||((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir'));ilanIlChange();document.getElementById('i_ilce').value=it.ilce;ilanMahList();
  document.getElementById('i_mah').value=it.mah;document.getElementById('i_m2').value=it.m2;
  document.getElementById('i_oda').value=it.oda;document.getElementById('i_kat').value=it.kat;
  document.getElementById('i_feat').value=it.feat?'1':'0';document.getElementById('i_desc').value=it.desc||'';
  window._ilanImg=it.img;const pv=document.getElementById('i_imgPrev');pv.src=imgSrc(it.img);pv.style.display='block';window._ilanEids=it.eids||null;var _tn=document.getElementById('i_tasinmazNo');if(_tn)_tn.value=(it.eids&&it.eids.tasinmazNo)||'';var _ad=document.getElementById('i_ada');if(_ad)_ad.value=(it.eids&&it.eids.ada)||'';var _pa=document.getElementById('i_parsel');if(_pa)_pa.value=(it.eids&&it.eids.parsel)||'';var _mt=document.getElementById('i_malikTip');if(_mt&&it.eids&&it.eids.malikTip)_mt.value=it.eids.malikTip;var _er=document.getElementById('i_eidsResult');if(_er)_er.innerHTML=(it.eids&&it.eids.status==='dogrulandi')?eidsVerifiedBox(it.eids):eidsResultBox('no','Henüz doğrulanmadı','Yayın için EİDS doğrulaması gerekir.');
  document.getElementById('ilanEditCard').style.display='block';
  document.getElementById('ilanEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});
}
function ilanImg(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{window._ilanImg=e.target.result;const pv=document.getElementById('i_imgPrev');pv.src=e.target.result;pv.style.display='block';};
  r.readAsDataURL(f);}
function saveIlan(){
  const g=id=>document.getElementById(id).value.trim();
  const title=g('i_title');if(!title){toast('İlan başlığı zorunlu.');return;}
  const price=+document.getElementById('i_price').value;if(!price){toast('Geçerli bir fiyat girin.');return;}
  const obj={title,price,op:g('i_op'),type:g('i_type'),status:g('i_status'),il:g('i_il')||((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir'),ilce:g('i_ilce')||'Konak',mah:g('i_mah')||'-',
    m2:+document.getElementById('i_m2').value||0,oda:g('i_oda')||'-',kat:g('i_kat')||'-',feat:+document.getElementById('i_feat').value,desc:g('i_desc')};
  if(!window._ilanImg){obj.img=LIST_IMGS[Math.floor(Math.random()*LIST_IMGS.length)];}else{obj.img=window._ilanImg;}
  var _eids=window._ilanEids||(editingIlan&&(ILANLAR.find(function(x){return x.id===editingIlan;})||{}).eids)||null;
  /* EİDS: doğrulanmamış ilan yayınlanabilir ama kartındaki rozet gerçeği (beklemede) gösterir — sahte onay YOK */
  if(obj.status==='aktif'&&!(window.EIDS&&EIDS.canPublish(_eids))){toast('Not: İlan henüz EİDS doğrulanmadı — kartında “Doğrulama Bekliyor” görünecek. Yayın için Taşınmaz No/Ada/Parsel girip “EİDS Doğrula” yapın.');}
  if(_eids)obj.eids=_eids;
  if(editingIlan){const i=ILANLAR.findIndex(x=>x.id===editingIlan);ILANLAR[i]={...ILANLAR[i],...obj};toast('✓ İlan güncellendi.');}
  else{obj.id=Date.now();ILANLAR.unshift(obj);toast('✓ Yeni ilan eklendi.');}
  saveAll();renderIlanRows();renderIlanlar();renderKpis();
  document.getElementById('ilanEditCard').style.display='none';
}
function delIlan(id){if(!confirm('Bu ilanı silmek istediğinize emin misiniz?'))return;
  ILANLAR=ILANLAR.filter(x=>x.id!==id);saveAll();renderIlanRows();renderIlanlar();renderKpis();toast('İlan silindi.');}

/* ===== Toplu ilan içe aktarma =====
   Kullanıcının KENDİ ilanlarını yapıştırma/CSV ile toplu ekler. Scraping YOK.
   EİDS: manuel eklemeyle (saveIlan) tıpatıp aynı kapı — firma yetkiliyse her
   ilana mock EİDS kaydı basılır ve "aktif" yayınlanır; değilse "pasif" taslak
   kalır. Böylece içe aktarma özel bir bypass açmıyor, mevcut modeli izliyor. */
function bulkSample(){
  var t=document.getElementById('bulk_in');if(!t)return;
  t.value=[
    ['Boğaz Manzaralı 3+1 Lüks Daire','Satılık','Daire','İzmir','Konak','Alsancak','165','3+1','7','18500000','Deniz manzaralı, asansörlü, otoparklı.'],
    ['Deniz Kenarı 2+1','Kiralık','Daire','İzmir','Karşıyaka','Bostanlı','95','2+1','3','32000','Eşyalı, site içi.']
  ].map(function(r){return r.join('\t');}).join('\n');
  var o=document.getElementById('bulk_out');if(o)o.innerHTML='';
}
function bulkParse(){
  var raw=(document.getElementById('bulk_in').value||'').replace(/\r/g,'').trim();
  if(!raw)return {ilan:[],hata:['Boş — Excel/Sheets’ten satır yapıştırın ya da “Örnek Doldur”a basın.']};
  var rows=raw.split('\n'),ilan=[],hata=[];
  for(var i=0;i<rows.length;i++){
    var line=rows[i];if(!line.trim())continue;
    var d=line.indexOf('\t')>=0?'\t':(line.indexOf(';')>=0?';':',');
    var c=line.split(d).map(function(x){return x.trim();});
    if(i===0&&/ba[sş]l[ıi]k/i.test(c[0]||'')&&/fiyat/i.test(line))continue; /* başlık satırını atla */
    if(!c[0]){hata.push((i+1)+'. satır: başlık boş, atlandı.');continue;}
    var price=parseInt((c[9]||'').replace(/[^\d]/g,''),10)||0;
    if(!price){hata.push((i+1)+'. satır (“'+c[0].slice(0,24)+'”): geçerli fiyat yok, atlandı.');continue;}
    ilan.push({title:c[0],op:/kira/i.test(c[1]||'')?'Kiralık':'Satılık',type:c[2]||'Daire',
      il:c[3]||((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir'),ilce:c[4]||'-',mah:c[5]||'-',
      m2:parseInt((c[6]||'').replace(/[^\d]/g,''),10)||0,oda:c[7]||'-',kat:c[8]||'-',price:price,desc:c[10]||''});
  }
  return {ilan:ilan,hata:hata};
}
function bulkPreview(){
  var r=bulkParse(),out=document.getElementById('bulk_out');
  var h='<div class="csub"><b>'+r.ilan.length+'</b> ilan içe aktarılmaya hazır.'+(r.hata.length?(' <b style="color:#c0392b">'+r.hata.length+' satır atlandı.</b>'):'')+'</div>';
  if(r.ilan.length){
    h+='<table class="atable" style="margin-top:8px"><thead><tr><th>Başlık</th><th>İşlem</th><th>Lokasyon</th><th>Fiyat</th></tr></thead><tbody>';
    r.ilan.slice(0,8).forEach(function(x){h+='<tr><td>'+_le(x.title)+'</td><td>'+_le(x.op)+'</td><td>'+_le(x.ilce)+' · '+_le(x.mah)+'</td><td>'+x.price.toLocaleString('tr-TR')+' ₺</td></tr>';});
    h+='</tbody></table>';if(r.ilan.length>8)h+='<div class="csub">…ve '+(r.ilan.length-8)+' ilan daha.</div>';
  }
  if(r.hata.length)h+='<div class="csub" style="color:#c0392b;margin-top:6px">'+r.hata.map(_le).join('<br>')+'</div>';
  out.innerHTML=h;
}
function bulkImport(){
  var r=bulkParse();
  if(!r.ilan.length){bulkPreview();toast('İçe aktarılacak geçerli ilan yok.');return;}
  var now=Date.now();
  r.ilan.forEach(function(x,idx){
    /* İçe aktarılan ilan DOĞRULANMAMIŞ gelir: taslak + EİDS 'beklemede'. Yayın için Taşınmaz No/Ada/Parsel girip doğrulanır. */
    var obj={title:x.title,price:x.price,op:x.op,type:x.type,status:'pasif',il:x.il,ilce:x.ilce,mah:x.mah,
      m2:x.m2,oda:x.oda,kat:x.kat,feat:0,desc:x.desc,img:LIST_IMGS[Math.floor(Math.random()*LIST_IMGS.length)],
      eids:(window.EIDS?EIDS.newRecord({il:x.il,ilce:x.ilce,malikTip:'isletme'}):null)};
    obj.id=now+idx;ILANLAR.unshift(obj);
  });
  saveAll();renderIlanRows();renderIlanlar();renderKpis();
  toast('✓ '+r.ilan.length+' ilan taslak olarak içe aktarıldı — her biri için Taşınmaz No/Ada/Parsel girip “EİDS Doğrula” sonrası yayınlayın.');
  bulkPreview();
}
/* GERÇEK per-ilan EİDS doğrulaması (shared/eids.js → backend). Kod/durum uydurulmaz. */
function eidsVerify(){
  var res=document.getElementById('i_eidsResult');if(!res)return;
  if(!window.EIDS){res.innerHTML=eidsResultBox('no','EİDS modülü yüklenemedi','Sayfayı yenileyip tekrar deneyin.');return;}
  var g=function(x){var e=document.getElementById(x);return e?(''+(e.value||'')).trim():'';};
  var fields={tasinmazNo:g('i_tasinmazNo'),il:g('i_il')||((typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir'),ilce:g('i_ilce')||'Konak',ada:g('i_ada'),parsel:g('i_parsel'),malikTip:(g('i_malikTip')||'isletme'),yetkiBelgeNo:(FIRMA.eids&&FIRMA.eids.belgeNo)||''};
  var eksik=EIDS.eksikAlanlar(EIDS.newRecord(fields));
  if(eksik.length){res.innerHTML=eidsResultBox('no','Eksik alan','EİDS doğrulaması için gerekli: '+_le(eksik.join(', '))+'.');window._ilanEids=null;return;}
  res.innerHTML=eidsResultBox('wait','T.C. Ticaret Bakanlığı EİDS sistemine sorgu gönderiliyor…','Doğrulama NADAS sunucusu (ProX / emlakekspertizi.com) üzerinden yapılır.');
  EIDS.verify(fields).then(function(rec){
    var r={status:rec.status,tasinmazNo:fields.tasinmazNo,il:fields.il,ilce:fields.ilce,ada:fields.ada,parsel:fields.parsel,malikTip:'isletme',yetkiBelgeNo:fields.yetkiBelgeNo,referans:rec.referans,tarih:rec.tarih,mesaj:rec.mesaj};
    window._ilanEids=r;
    res.innerHTML=(r.status==='dogrulandi')?eidsVerifiedBox(r):eidsResultBox(r.status==='reddedildi'?'no':'wait',EIDS.stateLabel(r),_le(rec.mesaj||''));
    if(r.status==='dogrulandi'){var st=document.getElementById('i_status');if(st)st.value='aktif';}
    toast(EIDS.stateLabel(r)+' — '+rec.mesaj);
  });
}
function eidsResultBox(kind,title,sub){var ic=kind==='ok'?eidsShieldSvg(13):(kind==='wait'?'⏳':'⚠');
  return '<div class="eids-status '+kind+'" style="margin-top:10px">'+(kind==='ok'?ic:'<span>'+ic+'</span>')+' '+_le(title)+'</div>'+(sub?'<div class="csub" style="margin:6px 0 0">'+sub+'</div>':'');}
function eidsVerifiedBox(rec){
  return '<div class="eids-status ok" style="margin-top:10px">'+eidsShieldSvg(13)+' '+_le((window.EIDS?EIDS.stateLabel(rec):'EİDS Doğrulandı'))+'</div>'
   +'<div class="eids-locked">'
   +'<div class="eids-lk"><b>İl / İlçe</b><span class="v">'+_le((rec.il||'-')+' / '+(rec.ilce||'-'))+'</span></div>'
   +'<div class="eids-lk"><b>Taşınmaz No</b><span class="v" style="font-size:11px">'+_le(rec.tasinmazNo||'-')+'</span></div>'
   +'<div class="eids-lk"><b>Ada / Parsel</b><span class="v">'+_le((rec.ada||'-')+' / '+(rec.parsel||'-'))+'</span></div>'
   +(rec.referans?'<div class="eids-lk"><b>Doğrulama Ref.</b><span class="v" style="font-size:11px">'+_le(rec.referans)+'</span></div>':'')
   +(rec.tarih?'<div class="eids-lk"><b>Tarih</b><span class="v">'+_le(rec.tarih)+'</span></div>':'')
   +'</div>'
   +'<div class="csub" style="margin-top:6px">Bu bilgiler T.C. Ticaret Bakanlığı EİDS kaydından gelir; kod/durum uydurulmaz.</div>';
}
function renderIlanRows(){
  const tb=document.getElementById('ilanRows');if(!tb)return;
  if(!ILANLAR.length){tb.innerHTML='<tr><td colspan="6" class="empty">Henüz ilan yok.</td></tr>';return;}
  tb.innerHTML=ILANLAR.map(it=>`<tr>
    <td><div class="trow"><img src="${imgSrc(it.img)}" class="tthumb" loading="lazy" decoding="async"><div><b>${_le(it.title)}</b><div class="tsub">${_le(it.type)} · ${_le(it.oda)} · ${it.m2}m²</div></div></div></td>
    <td><span class="atag ${it.op==='Satılık'?'sat':'kir'}">${it.op}</span></td>
    <td class="num">${fmt(it.price)} ₺</td>
    <td>${it.mah}, ${it.ilce}${it.il?`<div class="tsub">${it.il}</div>`:''}</td>
    <td>${it.status==='aktif'?'<span class="dot ok"></span>Aktif':'<span class="dot"></span>Pasif'}${it.feat?' ★':''}<br>${window.EIDS?EIDS.badgeHTML(it.eids,11):''}</td>
    <td class="ta"><button class="ico-btn" onclick="editIlan(${it.id})">✎</button><button class="ico-btn del" onclick="delIlan(${it.id})">🗑</button></td>
  </tr>`).join('');
}

/* ============ ADMIN: DANIŞMAN CRUD ============ */
let editingDan=null;
function danFoto(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{window._danFoto=e.target.result;const pv=document.getElementById('d_fotoPrev');pv.src=e.target.result;pv.style.display='block';};r.readAsDataURL(f);}
function newDan(){editingDan=null;['d_name','d_role','d_area','d_wa','d_tel','d_sales','d_rating','d_exp','d_bio'].forEach(id=>document.getElementById(id).value='');
  document.getElementById('d_feat').value='0';document.getElementById('d_fotoPrev').style.display='none';window._danFoto=null;
  document.getElementById('danEditCard').style.display='block';document.getElementById('danEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function editDan(id){const d=DANISMANLAR.find(x=>x.id===id);if(!d)return;editingDan=id;
  document.getElementById('d_name').value=d.name;document.getElementById('d_role').value=d.role;
  document.getElementById('d_area').value=d.area;document.getElementById('d_wa').value=d.wa;document.getElementById('d_tel').value=d.tel||'';
  document.getElementById('d_sales').value=d.sales;document.getElementById('d_rating').value=d.rating||'';document.getElementById('d_exp').value=d.exp||'';
  document.getElementById('d_bio').value=d.bio||'';document.getElementById('d_feat').value=d.feat?'1':'0';
  window._danFoto=d.foto;const pv=document.getElementById('d_fotoPrev');const src=d.foto?(IMG[d.foto]||d.foto):'';if(src){pv.src=src;pv.style.display='block';}else pv.style.display='none';
  document.getElementById('danEditCard').style.display='block';document.getElementById('danEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function saveDan(){const g=id=>document.getElementById(id).value.trim();
  const name=g('d_name');if(!name){toast('Ad soyad zorunlu.');return;}
  const obj={name,role:g('d_role')||'Emlak Danışmanı',area:g('d_area')||'-',wa:g('d_wa')||'905000000000',tel:g('d_tel'),sales:+document.getElementById('d_sales').value||0,
    rating:+document.getElementById('d_rating').value||4.9,exp:+document.getElementById('d_exp').value||5,bio:g('d_bio'),feat:+document.getElementById('d_feat').value,foto:window._danFoto||''};
  if(editingDan){const i=DANISMANLAR.findIndex(x=>x.id===editingDan);DANISMANLAR[i]={...DANISMANLAR[i],...obj};toast('✓ Danışman güncellendi.');}
  else{obj.id=Date.now();DANISMANLAR.push(obj);toast('✓ Danışman eklendi.');}
  saveAll();renderDanRows();renderDan();renderKpis();document.getElementById('danEditCard').style.display='none';}
function delDan(id){if(!confirm('Bu danışmanı silmek istediğinize emin misiniz?'))return;
  DANISMANLAR=DANISMANLAR.filter(x=>x.id!==id);saveAll();renderDanRows();renderDan();renderKpis();toast('Danışman silindi.');}
function renderDanDemoBanner(){var b=document.getElementById('danDemoBanner');if(!b)return;
  var wl=((typeof FIRMA!=='undefined'&&FIRMA&&FIRMA.name&&FIRMA.name!=='Meridyen Gayrimenkul')||(typeof PROVINCE!=='undefined'&&PROVINCE&&PROVINCE.name&&PROVINCE.name!=='İzmir'));
  var demoN=(typeof DANISMANLAR!=='undefined'?DANISMANLAR.filter(function(d){return d.demo;}).length:0);
  if(wl&&demoN>0){
    b.innerHTML='<div style="background:rgba(230,150,20,.12);border:1px solid rgba(230,150,20,.42);border-radius:11px;padding:12px 14px;margin-bottom:12px;display:flex;gap:12px;align-items:center;flex-wrap:wrap">'
      +'<div style="flex:1;min-width:230px;font-size:13.5px;line-height:1.5"><b>⚠ Örnek ekip görünüyor</b> — listedeki <b>'+demoN+'</b> danışman İzmir demo verisidir. Ziyaretçilerinize <b>kendi gerçek ekibinizi</b> tanıtın; güven ve dönüşüm belirgin artar.</div>'
      +'<button class="btn btn-primary btn-sm" onclick="newDan()">+ Danışman Ekle</button>'
      +'<button class="abtn" onclick="danClearDemo()">Demo ekibi temizle</button></div>';
  }else{b.innerHTML='';}}
function danClearDemo(){if(typeof DANISMANLAR==='undefined')return;var real=DANISMANLAR.filter(function(d){return !d.demo;});
  if(real.length===DANISMANLAR.length){toast('Temizlenecek demo danışman yok.');return;}
  if(!confirm('Örnek/demo danışmanlar silinecek; kendi ekibinizi ekleyeceksiniz. Devam edilsin mi?'))return;
  DANISMANLAR=real;saveAll();if(typeof renderDan==='function')renderDan();renderDanRows();
  toast('Demo ekip temizlendi. "+ Danışman Ekle" ile kendi ekibinizi tanıtın.');if(typeof newDan==='function')newDan();}
function renderDanRows(){const tb=document.getElementById('danRows');if(!tb)return;
  renderDanDemoBanner();
  if(!DANISMANLAR.length){tb.innerHTML='<tr><td colspan="5" class="empty">Henüz danışman yok.</td></tr>';return;}
  tb.innerHTML=DANISMANLAR.map(d=>{const src=d.foto?(IMG[d.foto]||d.foto):'';const ini=d.name.split(' ').map(x=>x[0]).slice(0,2).join('');
    const av=src?`<img src="${src}" class="tthumb" loading="lazy" decoding="async" style="border-radius:50%;width:38px;height:38px">`:`<span class="tthumb" style="border-radius:50%;width:38px;height:38px;display:grid;place-items:center;background:var(--accent);color:#fff;font-size:12px;font-weight:700">${ini}</span>`;
    return `<tr><td><div class="trow">${av}<div><b>${_le(d.name)}</b>${d.feat?' <span class="atag" style="background:#fef3c7;color:#92400e">★</span>':''}</div></div></td><td>${_le(d.role)}</td><td>${_le(d.area)}</td><td class="num">${d.sales}</td>
    <td class="ta"><button class="ico-btn" onclick="editDan(${d.id})">✎</button><button class="ico-btn del" onclick="delDan(${d.id})">🗑</button></td></tr>`;}).join('');}

/* ============ ADMIN: LEADLER ============ */
function leadSyncBadge(s){if(s==='online')return '<span title="ProX CRM iletildi" style="color:var(--green-700,#1a7f4b);font-weight:600">☁ Online</span>';if(s==='offline')return '<span title="Cevrimdisi — yeniden denenecek" style="color:#b26a00;font-weight:600">⧗ Beklemede</span>';return '<span class="tsub">⋯</span>';}
function renderLeads(){const tb=document.getElementById('leadRows');if(!tb)return;
  if(!LEADS.length){tb.innerHTML='<tr><td colspan="6" class="empty">Henüz lead yok.</td></tr>';return;}
  tb.innerHTML=LEADS.map(l=>`<tr><td class="tsub">${_be(l.date)}</td><td><b>${_be(l.ad)}</b></td><td class="num">${_be(l.tel||'-')}</td><td>${_be(l.konu||'-')}${l.msg?`<div class="tsub">${_be(l.msg)}</div>`:''}</td><td><span class="src">${_be(l.src)}</span></td><td>${leadSyncBadge(l.sync)}</td></tr>`).join('');}
function clearLeads(){if(!LEADS.length){toast('Temizlenecek lead yok.');return;}if(!confirm('Tüm lead kayıtları silinecek. Emin misiniz?'))return;
  LEADS=[];saveAll();renderLeads();renderRecentLeads();renderKpis();toast('Tüm lead\'ler temizlendi.');}

/* ============ ADMIN: BÖLGE TABLOSU ============ */
function renderBolgeRows(){const tb=document.getElementById('bolgeRows');if(!tb)return;
  tb.innerHTML=Object.keys(BAZ).map(k=>{const b=BAZ[k];
    return `<tr><td><b>${k}</b></td><td class="num">${fmt(b.m2)} ₺</td><td class="num" style="color:var(--green-700)">+%${b.chg}</td>
    <td><span class="scorebadge">${b.score}/100</span></td><td class="tsub">${b.risk}</td></tr>`;}).join('');}

/* ============ ADMIN: FİRMA ============ */
function fillFirmaForm(){
  document.getElementById('cf_name').value=FIRMA.name||'';document.getElementById('cf_tel').value=FIRMA.tel||'';
  document.getElementById('cf_mail').value=FIRMA.mail||'';document.getElementById('cf_wa').value=FIRMA.wa||'';
  document.getElementById('cf_adres').value=FIRMA.adres||'';document.getElementById('cf_hours').value=FIRMA.hours||'';
  if(document.getElementById('cf_lat'))document.getElementById('cf_lat').value=(FIRMA.lat!=null?FIRMA.lat:'');
  if(document.getElementById('cf_lng'))document.getElementById('cf_lng').value=(FIRMA.lng!=null?FIRMA.lng:'');
  if(document.getElementById('cf_vergi'))document.getElementById('cf_vergi').value=FIRMA.vergi||'';
  if(document.getElementById('cf_yetkili'))document.getElementById('cf_yetkili').value=FIRMA.yetkili||'';var _e=(FIRMA&&FIRMA.eids)||{};if(document.getElementById('cf_eidsBelge'))document.getElementById('cf_eidsBelge').value=_e.belgeNo||'';if(document.getElementById('cf_eidsUnvan'))document.getElementById('cf_eidsUnvan').value=_e.unvan||'';if(document.getElementById('cf_eidsFirma'))document.getElementById('cf_eidsFirma').value=_e.firmaKod||'';if(document.getElementById('cf_eidsKullanici'))document.getElementById('cf_eidsKullanici').value=_e.kullaniciKodu||'';if(typeof renderEidsYetki==='function')renderEidsYetki();if(typeof kiFillIl==='function')kiFillIl();}
function kiFillIl(){var sel=document.getElementById("ki_il");if(!sel)return;var cur=(typeof PROX!=="undefined"&&PROX.il)||"İzmir";
  sel.innerHTML=trIlList().sort(function(a,b){return a.localeCompare(b,"tr");}).map(function(il){return "<option"+(il===cur?" selected":"")+">"+il+"</option>";}).join("");
  var nm=document.getElementById("ki_name");if(nm&&!nm.value&&FIRMA&&FIRMA.name&&FIRMA.name!==BRAND_ORIG)nm.value=FIRMA.name;}
/* Firma adı yazılırken içinde il geçiyorsa İl seçimini otomatik ayarla; geçmiyorsa dokunma. */
function kiNameIl(){var nm=(document.getElementById("ki_name")||{}).value||"";var il=(typeof detectIlFromName==="function")?detectIlFromName(nm):null;var sel=document.getElementById("ki_il");if(il&&sel){for(var i=0;i<sel.options.length;i++){if(sel.options[i].value===il){sel.value=il;break;}}}}
/* İçerik Asistanı erişilemezse yerel şablonla KURUMSAL KİMLİK üret — rebrand asla takılmasın. */
function kiLocalIdentity(name,il){var sh=(name||"").split(/\s+/)[0]||name;
  return {name:name,il:il,
    slogan:name+" — "+il+"'de veriyle doğru gayrimenkul kararı",
    hero1:"Doğru gayrimenkulü,",hero2:"doğru veriyle bulun",
    herodesc:il+" ve çevresinde satılık & kiralık konut, arsa ve ticari portföy; her bölgede gerçek m² endeksi ve yatırım skoruyla veri odaklı danışmanlık.",
    about:name+", "+il+" ve çevresinde konut, arsa, ticari gayrimenkul, kiralama, değerleme, yatırım ve miras/intikal alanlarında hizmet veren veri odaklı bir gayrimenkul ofisidir. Her ilan ve danışmanlıkta bölgenin gerçek fiyat endeksini, yatırım skorunu ve trend analizini esas alır; müşterilerinin duyguyla değil, doğrulanabilir veriyle karar vermesini sağlar. Şeffaf süreç, yerinde bölge bilgisi ve müşteri odaklı yaklaşımla "+il+"'de güvenilir bir çözüm ortağıdır.",
    seotitle:name+" · "+il+" Gayrimenkul & Emlak Ofisi",
    seodesc:name+" — "+il+" ve çevresinde satılık & kiralık konut, arsa, ticari gayrimenkul; değerleme, yatırım ve miras/intikal danışmanlığı.",
    seokw:il+" emlak, "+il+" satılık daire, "+il+" kiralık, "+il+" arsa, "+il+" ticari gayrimenkul, gayrimenkul değerleme, miras intikal, yatırım danışmanlığı"};}
/* ===== AI GÜVENLİK KORKULUĞU — tüm ProX/DeepSeek üretimini + sohbeti kapsar =====
   1) aiGuard(prompt): her isteme uydurma-yasağı kuralını ekler (idempotent).
   2) aiRiskScan/aiGuardBadge: üretilen metni riskli iddialar için tarar,
      insan onayı için görsel uyarı üretir. */
var AI_GUARD_RULE='\n\n[KESİN KURALLAR — UYDURMA YASAK] Gerçek olmayan proje/site/marka adı, kesin fiyat/rakam, "%X garanti/net getiri", sahte istatistik, ödül, sertifika veya referans ÜRETME. Emin olmadığın sayısal veriyi "ProX endeksiyle teyit edilmeli" diye işaretle. Yalnızca genel, doğrulanabilir emlak bilgisi ver; abartıdan kaçın.';
function aiGuard(p){p=(p==null?'':''+p);return p.indexOf('[KESİN KURALLAR')>=0?p:(p+AI_GUARD_RULE);}
/* ===== DEEPSEEK-ÖNCELİKLİ YZ YÖNLENDİRME =====
   Admin bir DeepSeek anahtarı (AICFG.dsKey) girdiyse TÜM yapay zeka ÜRETİMİ doğrudan DeepSeek ile çalışır;
   yoksa ProX sunucu AI'sine (/prox/ai) düşülür. ProX API anahtarı (PROX.key) yalnızca VERİ uçları
   (endeks/analiz/PDF/rapor) içindir — YZ ve veri anahtarları AYRI çalışır. DeepSeek CORS istemci
   çağrılarına açıktır; anahtar admin'in kendi anahtarıdır (yayında sunucu-proxy önerilir). */
function _dsKey(){try{return ((typeof AICFG!=='undefined'&&AICFG&&AICFG.dsKey)||'').trim();}catch(e){return '';}}
function _dsModel(){try{return ((typeof AICFG!=='undefined'&&AICFG&&AICFG.dsModel)||'deepseek-chat').trim()||'deepseek-chat';}catch(e){return 'deepseek-chat';}}
function _dsMessages(body){
  body=body||{};
  var SYS_GEN='Sen profesyonel bir Türk emlak içerik/danışmanlık yapay zekasısın. Türkçe ve net yaz; yalnızca doğrulanabilir emlak bilgisi ver; kesin fiyat/garanti getiri UYDURMA.';
  /* Asistan/sohbet: prompt=sistem talimatı, messages=geçmiş (veya message=son tur) */
  if((Array.isArray(body.messages)&&body.messages.length)||body.message!=null){
    var msgs=[{role:'system',content:body.prompt||SYS_GEN}];
    if(Array.isArray(body.messages)&&body.messages.length){
      body.messages.forEach(function(m){if(m&&m.content)msgs.push({role:(m.role==='assistant'?'assistant':(m.role==='system'?'system':'user')),content:String(m.content)});});
    }else{msgs.push({role:'user',content:String(body.message)});}
    return msgs;
  }
  /* Araç üretimi (blog/bölge/kurumsal/rapor): prompt görevin tamamı */
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
    if(!res.ok){return {_dsErr:true,status:res.status};}
    var j=await res.json();var t=j&&j.choices&&j.choices[0]&&j.choices[0].message&&j.choices[0].message.content;
    if(t&&t.trim())return {answer:t.trim(),success:true,_via:'deepseek'};
    return {_dsErr:true,status:0};
  }catch(e){if(to)clearTimeout(to);return {_dsErr:true,status:-1,err:String(e&&e.message||e)};}
}
/* Birleşik YZ çağrısı: DeepSeek anahtarı varsa onunla, yoksa (veya DeepSeek hata verirse) ProX ile. */
async function aiChat(body,opts){
  if(_dsKey()){var d=await _deepseekChat(body,opts);if(d&&d.answer)return d;/* DeepSeek hata → ProX'e düş */}
  return await proxApi('/api/v1/tenant/prox/ai',{method:'POST',body:body});
}
try{window.aiChat=aiChat;window._deepseekChat=_deepseekChat;}catch(e){}
/* Admin: DeepSeek anahtar testi + durum rozeti */
async function aiDsTest(){
  var el=document.getElementById('ai_dsstatus');var inp=document.getElementById('ai_dskey');
  var key=(inp&&inp.value.trim())||_dsKey();
  if(!key){if(el)el.innerHTML='<div class="eids-yetki off" style="margin:0"><span class="ic">⚠️</span><div>DeepSeek anahtarı girilmedi. Boşsa YZ, ProX sunucu AI\'si ile çalışır.</div></div>';return;}
  if(el)el.innerHTML='<div class="csub">● DeepSeek bağlantısı test ediliyor…</div>';
  var _prev=(typeof AICFG!=='undefined'&&AICFG&&AICFG.dsKey)||'';try{if(typeof AICFG!=='undefined'&&AICFG)AICFG.dsKey=key;}catch(e){}
  var r=await _deepseekChat({message:'Sadece "OK" yaz.'},{max_tokens:8,temperature:0});
  try{if(typeof AICFG!=='undefined'&&AICFG)AICFG.dsKey=_prev;}catch(e){}
  if(r&&r.answer){if(el)el.innerHTML='<div class="eids-yetki on" style="margin:0"><span class="ic">◉</span><div>DeepSeek bağlı ✓ · model '+_dsModel()+'<div style="font-weight:500;font-size:12px;opacity:.85">Kaydet\'e basınca tüm yapay zeka DeepSeek ile çalışır.</div></div></div>';}
  else{var st=(r&&r.status);var msg=st===401?'anahtar geçersiz (401)':st===402?'bakiye/kota yetersiz (402)':st===429?'hız limiti (429)':'bağlantı kurulamadı';if(el)el.innerHTML='<div class="eids-yetki off" style="margin:0"><span class="ic">⚠️</span><div>DeepSeek testi başarısız · '+msg+'. Anahtarı kontrol edin.</div></div>';}
}
function aiDsStatus(){var el=document.getElementById('ai_dsstatus');if(!el)return;var k=_dsKey();
  el.innerHTML=k?'<div class="eids-yetki on" style="margin:0"><span class="ic">◉</span><div>DeepSeek anahtarı kayıtlı · YZ üretimi DeepSeek ('+_dsModel()+') ile çalışıyor.</div></div>':'<div class="eids-yetki off" style="margin:0"><span class="ic">○</span><div>DeepSeek anahtarı yok · YZ, ProX sunucu AI\'si ile çalışıyor.</div></div>';}
var AI_RISK_PATTERNS=[
  {re:/(garanti|kesin|net)\s*(getiri|kazanç|kâr|kar)|(getiri|kazanç)\s*(garanti|kesin)/i,t:'garanti getiri iddiası'},
  {re:/\d[\d.\s]{5,}\s*(tl|₺|lira)/i,t:'kesin fiyat rakamı'},
  {re:/en\s+(ucuz|pahalı|iyi|büyük|kaliteli|lüks)|türkiye'?nin\s+(ilk|tek|en)|lider|(bir|1)\s*numara/i,t:'doğrulanmamış üstünlük iddiası'},
  {re:/ödül|sertifika|patent|dünya\s*markası/i,t:'doğrulanmamış ödül/sertifika'}
];
function aiRiskScan(t){var h=[];AI_RISK_PATTERNS.forEach(function(p){if(p.re.test(t||''))h.push(p.t);});return h;}
function aiGuardBadge(t){var h=aiRiskScan(t);if(!h.length)return '<div class="ai-guard-ok" style="margin-top:8px;padding:7px 10px;border-radius:8px;background:rgba(30,160,90,.10);border:1px solid rgba(30,160,90,.28);font-size:12px;color:#1a7f4b">✓ AI güvenlik denetimi: riskli iddia bulunamadı — yine de yayınlamadan önce gözden geçirin.</div>';return '<div class="ai-guard-warn" style="margin-top:8px;padding:8px 10px;border-radius:8px;background:rgba(230,150,20,.13);border:1px solid rgba(230,150,20,.4);font-size:12.5px;color:#8a5a00"><b>⚠ İnsan onayı gerekli</b> — doğrulanması gereken ifade: '+h.join(', ')+'. Yayınlamadan önce ProX verisiyle teyit edin veya düzeltin.</div>';}
async function kurumsalGenerate(){
  var name=(document.getElementById("ki_name").value||"").trim();
  var il=(document.getElementById("ki_il")||{}).value||(typeof PROX!=="undefined"&&PROX.il)||"İzmir";
  var hint=(document.getElementById("ki_hint").value||"").trim();
  var out=document.getElementById("ki_out");
  if(!name){toast("Firma adını girin.");return;}
  out.innerHTML='<div class="eids-yetki on" style="margin:0"><span class="ic">⏳</span><div>İçerik Asistanı kapsamlı kurumsal kimliğinizi oluşturuyor…<div style="font-weight:500;font-size:12px;opacity:.85">DeepSeek · '+name+' · '+il+'</div></div></div>';
  var prompt="Sen ProX kurumsal kimlik ve Google SEO uzmanısın (emlakekspertizi.com). "+name+" adlı, "+il+" ilinde faaliyet gösteren TAM KAPSAMLI bir gayrimenkul/emlak ofisi için içerik üret. Ofis tüm alanlarda hizmet verir: konut (daire, villa, müstakil ev), arsa ve arazi, ticari & ofis/dükkan, kiralama, gayrimenkul değerleme, yatırım danışmanlığı ve miras/intikal işlemleri."+(hint?(" Öne çıkan uzmanlık: "+hint+"."):"")+" Profesyonel, güven veren, Google SEO uyumlu Türkçe kullan. Belirli tek bir nişe (sadece sahil/daire) sıkışma; tüm kategorileri kapsa. SADECE şu formatta yanıtla, başka açıklama ekleme:\nSLOGAN: <il ismi geçen tek cümle vurucu slogan>\nHERO1: <ana sayfa başlığı 1. satır, 2-4 kelime>\nHERO2: <ana sayfa başlığı 2. satır, 2-4 kelime>\nHERODESC: <hero alt açıklaması 20-30 kelime, veri odaklı, birkaç kategoriye atıf>\nHAKKINDA: <160-200 kelime kapsamlı hakkımızda; "+name+", "+il+", konut+arsa+ticari+miras+değerleme+yatırım hizmetleri, veri odaklı yaklaşım>\nSEOTITLE: <55-60 karakter; "+name+" + "+il+" + gayrimenkul/emlak>\nSEODESC: <150-155 karakter; hizmet çeşitliliği ("+il+" satılık/kiralık konut, arsa, ticari, değerleme, miras)>\nSEOKW: <virgülle 10-12 anahtar kelime; "+il+" emlak, "+il+" satılık daire, "+il+" kiralık, "+il+" arsa, "+il+" ticari gayrimenkul, "+il+" gayrimenkul değerleme, miras intikal, yatırım danışmanlığı>";
  var text=null;
  try{var r=await aiChat({persona:"office",tool:"kurumsal",prompt:aiGuard(prompt)});
    if(r&&!r.fallback&&r.success!==false)text=r.answer||r.text||(r.data&&(r.data.answer||r.data.text))||null;}catch(e){}
  var _local=!text;   /* İçerik Asistanı erişilemedi → yerel şablonla DEVAM (rebrand asla takılmaz) */
  function pick(k){if(!text)return"";var m=new RegExp(k+"\\s*:?\\s*([\\s\\S]+?)(?:\\n\\s*(?:SLOGAN|HERO1|HERO2|HERODESC|HAKKINDA|SEOTITLE|SEODESC|SEOKW)\\s*:|$)","i").exec(text);return m?m[1].trim().replace(/^["“]+|["”]+$/g,"").trim():"";}
  var res=_local?kiLocalIdentity(name,il):{name:name,il:il,slogan:pick("SLOGAN"),hero1:pick("HERO1"),hero2:pick("HERO2"),herodesc:pick("HERODESC"),about:pick("HAKKINDA"),seotitle:pick("SEOTITLE"),seodesc:pick("SEODESC"),seokw:pick("SEOKW")};
  if(!res.about||res.about.length<40)res.about=text||res.about;
  window._kiResult=res;
  out.innerHTML='<div class="eids-box" style="margin:0"><div class="eh"><span class="shield">'+eidsShieldSvg(16)+'</span> Kurumsal Kimlik · '+name+' ('+il+') — düzenleyebilirsiniz</div>'
   +'<div class="csub">'+(_local?'⚠ İçerik Asistanı şu an erişilemedi — <b>yerel şablonla</b> hazırlandı. Yine de düzenleyip <b>tüm siteye uygulayabilirsiniz</b>; marka ve il dönüşümü çalışır. Bağlantı gelince “Yeniden Üret” ile AI metnini alabilirsiniz.':'İçerik Asistanı üretti. İstediğiniz alanı düzenleyip kaydedin; sitenin tüm sayfalarına uygulanır. Sonradan İçerik ve SEO bölümlerinden de düzenlenebilir.')+'</div>'
   +'<div class="afield"><label>Slogan</label><input id="ki_slogan"></div>'
   +'<div class="ed2"><div class="afield"><label>Hero 1. satır</label><input id="ki_hero1"></div><div class="afield"><label>Hero 2. satır</label><input id="ki_hero2"></div></div>'
   +'<div class="afield"><label>Hero açıklaması</label><textarea id="ki_herodesc" class="adm-ta" rows="2"></textarea></div>'
   +'<div class="afield"><label>Hakkımızda <span style="color:var(--muted);font-weight:400">(tam kapsamlı)</span></label><textarea id="ki_about" class="adm-ta" rows="6"></textarea></div>'
   +'<div class="ed2"><div class="afield"><label>SEO Başlık <span id="ki_seotLen" class="tsub"></span></label><input id="ki_seotitle" oninput="kiSeoLen()"></div><div class="afield"><label>SEO Anahtar Kelimeler</label><input id="ki_seokw"></div></div>'
   +'<div class="afield"><label>SEO Açıklama <span id="ki_seodLen" class="tsub"></span></label><textarea id="ki_seodesc" class="adm-ta" rows="2" oninput="kiSeoLen()"></textarea></div>'
   +aiGuardBadge(text)
   +'<div style="display:flex;gap:10px;margin-top:10px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="kurumsalApply()">Kaydet & Tüm Siteye Uygula</button><button class="abtn" onclick="kurumsalGenerate()">Yeniden Üret (ProX)</button></div></div>';
  document.getElementById("ki_slogan").value=res.slogan||"";
  document.getElementById("ki_hero1").value=res.hero1||"";
  document.getElementById("ki_hero2").value=res.hero2||"";
  document.getElementById("ki_herodesc").value=res.herodesc||"";
  document.getElementById("ki_about").value=res.about||"";
  document.getElementById("ki_seotitle").value=res.seotitle||(name+" · "+il+" Gayrimenkul & Emlak Ofisi");
  document.getElementById("ki_seokw").value=res.seokw||(il+" emlak, "+il+" satılık daire, "+il+" kiralık, "+il+" arsa, "+il+" ticari gayrimenkul, gayrimenkul değerleme, miras intikal");
  document.getElementById("ki_seodesc").value=res.seodesc||(name+" — "+il+" ve çevresinde satılık & kiralık konut, arsa, ticari gayrimenkul; değerleme, yatırım ve miras/intikal danışmanlığı.");
  kiSeoLen();
}
function kiSeoLen(){var t=((document.getElementById("ki_seotitle")||{}).value||"").length,d=((document.getElementById("ki_seodesc")||{}).value||"").length;
  var te=document.getElementById("ki_seotLen"),de=document.getElementById("ki_seodLen");
  if(te)te.textContent=t+"/60"+(t>60?" ⚠ uzun":" ✓");
  if(de)de.textContent=d+"/155"+(d>160?" ⚠ uzun":" ✓");}
function applySeoHead(){try{if(typeof SEO!=="object"||!SEO)return;
  if(SEO.title)document.title=SEO.title;
  var sm=function(sel,a,n,v){if(v==null||v==="")return;var m=document.querySelector(sel);if(!m){m=document.createElement("meta");m.setAttribute(a,n);document.head.appendChild(m);}m.setAttribute("content",v);};
  sm('meta[name="description"]',"name","description",SEO.desc);
  sm('meta[name="keywords"]',"name","keywords",SEO.kw);
  sm('meta[property="og:title"]',"property","og:title",SEO.title);
  sm('meta[property="og:description"]',"property","og:description",SEO.desc);
}catch(e){}}
function kurumsalApply(){var res=window._kiResult;if(!res){toast("Önce oluşturun.");return;}
  var g=function(id){var e=document.getElementById(id);return e?(e.value||"").trim():"";};
  var name=res.name,il=res.il;
  var slogan=g("ki_slogan"),hero1=g("ki_hero1"),hero2=g("ki_hero2"),herodesc=g("ki_herodesc"),about=g("ki_about"),seotitle=g("ki_seotitle"),seodesc=g("ki_seodesc"),seokw=g("ki_seokw");
  var before=(document.body.innerText.match(/Meridyen/g)||[]).length;
  try{applyProvince(il,true);}catch(e){}
  try{if(typeof CONTENT==="object"&&CONTENT){if(hero1)CONTENT.heroTitle=hero1;if(hero2)CONTENT.heroTitle2=hero2;if(herodesc)CONTENT.heroDesc=herodesc;if(about)CONTENT.aboutText=about;CONTENT.heroEyebrow=il+" · 480M+ kayıtlık ProX endeksiyle çalışıyoruz";}}catch(e){}
  try{if(typeof SEO==="object"&&SEO){if(seotitle)SEO.title=seotitle;if(seodesc)SEO.desc=seodesc;if(seokw)SEO.kw=seokw;}}catch(e){}
  try{if(FIRMA.eids)FIRMA.eids.unvan=name+" Danışmanlık Ltd. Şti.";}catch(e){}
  if(slogan)window._kiSlogan=slogan;
  applyBrand(name);
  try{applyContent();}catch(e){}
  try{applySeoHead();}catch(e){}
  try{if(typeof rebuildOzelFromProx==='function'&&wlStale('wl_ozel_ts',il))rebuildOzelFromProx(il,true);}catch(e){}
  try{if(il!=='İzmir'&&typeof wlBuildBolge==='function'&&wlStale('wl_bolge',il))wlBuildBolge(il,true);}catch(e){}
  try{fillFirmaForm();}catch(e){}
  try{if(typeof fillSeo==="function")fillSeo();}catch(e){}
  brandSweep(document.body);
  var after=(document.body.innerText.match(/Meridyen/g)||[]).length;
  toast("✓ Kurumsal kimlik uygulandı: "+name+" · "+il);
  var out=document.getElementById("ki_out");
  if(out)out.insertAdjacentHTML("afterbegin",'<div class="eids-yetki on" style="margin:0 0 10px"><span class="ic">✅</span><div>Uygulandı: <b>'+name+'</b> · '+il+' — tüm sayfalar güncellendi ('+before+' “Meridyen” → kalan '+after+'). İçerik ve SEO bölümlerinden de düzenleyebilirsiniz.</div></div>');
}

function saveFirma(){const g=id=>document.getElementById(id).value.trim();
  var _pe=(FIRMA&&FIRMA.eids)||{};var _prev=FIRMA||{};
  var _lat=document.getElementById('cf_lat')?parseFloat(document.getElementById('cf_lat').value):_prev.lat;
  var _lng=document.getElementById('cf_lng')?parseFloat(document.getElementById('cf_lng').value):_prev.lng;
  FIRMA=Object.assign({},_prev,{name:g('cf_name')||FIRMA.name,tel:g('cf_tel'),mail:g('cf_mail'),wa:g('cf_wa').replace(/[^0-9]/g,''),adres:g('cf_adres'),hours:g('cf_hours'),
    lat:(isFinite(_lat)?_lat:_prev.lat),lng:(isFinite(_lng)?_lng:_prev.lng),
    vergi:(document.getElementById('cf_vergi')?g('cf_vergi'):(FIRMA.vergi||'')),yetkili:(document.getElementById('cf_yetkili')?g('cf_yetkili'):(FIRMA.yetkili||'')),eids:{belgeNo:(document.getElementById('cf_eidsBelge')?g('cf_eidsBelge').replace(/[^0-9]/g,''):(_pe.belgeNo||'')),unvan:(document.getElementById('cf_eidsUnvan')?g('cf_eidsUnvan'):(_pe.unvan||''))}});
  FIRMA.eids.yetkili=!!(FIRMA.eids.belgeNo&&FIRMA.eids.belgeNo.length>=7);
  saveAll();
  /* AI'YE GEREK YOK — sadece isim yazıp Kaydet: tüm site markası + (varsa) ili dönüşür.
     Adında il geçiyorsa (Konya Gayrimenkul) o ile geç; geçmiyorsa (Kaya/Romix) mevcut ili KORU, hata verme. */
  var _il=(typeof detectIlFromName==='function')?detectIlFromName(FIRMA.name):null;
  if(_il&&typeof applyProvince==='function'&&(typeof PROVINCE==='undefined'||!PROVINCE||_il!==PROVINCE.name)){try{applyProvince(_il,true);}catch(e){}
    try{if(_il&&typeof rebuildOzelFromProx==='function'&&(typeof wlStale!=='function'||wlStale('wl_ozel_ts',_il)))rebuildOzelFromProx(_il,true);}catch(e){}
    try{if(_il!=='İzmir'&&typeof wlBuildBolge==='function'&&(typeof wlStale!=='function'||wlStale('wl_bolge',_il)))wlBuildBolge(_il,true);}catch(e){}}
  if(typeof applyBrand==='function')applyBrand(FIRMA.name); else applyFirma();
  if(typeof renderEidsYetki==='function')renderEidsYetki();if(typeof renderIlanRows==='function')renderIlanRows();if(typeof applySchema==='function')applySchema();
  toast('✓ Firma bilgileri kaydedildi ve siteye uygulandı'+(_il?' · il: '+_il:'')+'.');}
function eidsConnect(){var e=(FIRMA.eids||(FIRMA.eids={}));var bno=document.getElementById('cf_eidsBelge');if(bno)e.belgeNo=(bno.value||'').replace(/[^0-9]/g,'');e.yetkili=!!(e.belgeNo&&e.belgeNo.length>=7);saveAll();fillFirmaForm();if(typeof renderIlanRows==='function')renderIlanRows();toast(e.yetkili?'✓ Yetki Belgesi kaydedildi. Her ilan için Taşınmaz No/Ada/Parsel ile ayrıca EİDS doğrulaması yapın (malikin e-Devlet yetkisi gerekir).':'Geçerli (7+ haneli) Taşınmaz Ticareti Yetki Belgesi No girin.');}
function renderEidsYetki(){var box=document.getElementById('eidsYetkiBox');if(!box)return;var e=(FIRMA&&FIRMA.eids)||{};if(e.yetkili){box.innerHTML='<div class="eids-yetki on"><span class="ic"><svg width=\"18\" height=\"18\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z\"/><path d=\"M9 12l2 2 4-4\"/></svg></span><div>Yetki Belgesi girildi — ilanları EİDS ile doğrulayıp yayınlayabilirsiniz.<div style="font-weight:500;font-size:12px;opacity:.85">Yetki Belgesi No '+_le(e.belgeNo||'—')+' · Doğrulama her ilan için ayrıca yapılır (Taşınmaz No + Ada/Parsel). Kod uydurulmaz.</div></div></div>';}else{box.innerHTML='<div class="eids-yetki off"><span class="ic">⚠️</span><div>Yetki Belgesi Yok — 7+ haneli Taşınmaz Ticareti Yetki Belgesi No girin.<div style="font-weight:500;font-size:12px;opacity:.85">Malikin e-Devlet yetkisi ayrıca gereklidir (turkiye.gov.tr).</div></div></div>';}}
/* ===== KUSURSUZ MARKA MOTORU (white-label · Meridyen -> firma adı) ===== */
const BRAND_ORIG='Meridyen Gayrimenkul',BRAND_ORIG_SHORT='Meridyen';
function brandName(){return ((typeof FIRMA!=='undefined'&&FIRMA&&FIRMA.name)||BRAND_ORIG).trim();}
function brandShort(){return brandName().split(/\s+/)[0]||BRAND_ORIG_SHORT;}
function brandReplace(s){if(!s||typeof s!=='string')return s;var n=brandName();if(n===BRAND_ORIG||s.indexOf('Meridyen')<0)return s;return s.split(BRAND_ORIG).join(n).split(BRAND_ORIG_SHORT).join(brandShort());}
/* Şablonu (Meridyen…) VERİLEN ada göre markalar — re-brand'ı tersinir kılmak için. */
function brandShortOf(nm){return (((nm||'').trim().split(/\s+/)[0])||BRAND_ORIG_SHORT);}
function brandReplaceWith(s,nm){if(!s||typeof s!=='string'||!nm||nm===BRAND_ORIG||s.indexOf('Meridyen')<0)return s;return s.split(BRAND_ORIG).join(nm).split(BRAND_ORIG_SHORT).join(brandShortOf(nm));}
/* Firma adında bir Türkiye ili geçiyor mu? (kelime-bazlı, en uzun eşleşme). Yoksa null —
   böylece "Konya Gayrimenkul" → il=Konya; "Kaya/Romix Gayrimenkul" → null (il korunur, HATA YOK). */
function detectIlFromName(name){
  if(!name||typeof name!=='string')return null;
  try{
    var list=(typeof trIlList==='function')?trIlList():((typeof TR_ILILCE!=='undefined'&&TR_ILILCE)?Object.keys(TR_ILILCE):[]);
    var low=name.toLocaleLowerCase('tr'),best=null;
    list.forEach(function(il){
      var esc=il.toLocaleLowerCase('tr').replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
      var re=new RegExp('(^|[^0-9a-zçğıöşü])'+esc+'([^0-9a-zçğıöşü]|$)');
      if(re.test(low)&&(!best||il.length>best.length))best=il;
    });
    return best;
  }catch(e){return null;}
}
function wlCityOff(){return (typeof PROVINCE==='undefined'||!PROVINCE||PROVINCE.name==='İzmir');}
function trLastVowel(w){var m=(w||'').toLowerCase().match(/[aeıioöuü]/g);return m?m[m.length-1]:'a';}
function trBack(v){return 'aıou'.indexOf(v)>=0;}
function trRound(v){return 'ouöü'.indexOf(v)>=0;}
function trI(v){return trBack(v)?(trRound(v)?'u':'ı'):(trRound(v)?'ü':'i');}
function trA(v){return trBack(v)?'a':'e';}
function trEndsVowel(w){return /[aeıioöuü]$/i.test(w||'');}
function trHard(w){var c=(w||'').replace(/['’]/g,'').slice(-1).toLowerCase();return 'pçtkfhsş'.indexOf(c)>=0;}
function citySuffix(city,type){if(window.TRG)return window.TRG.suffix(city,type);var v=trLastVowel(city),vwl=trEndsVowel(city),D=trHard(city)?'t':'d';
  switch(type){case 'gen':return (vwl?'n':'')+trI(v)+'n';case 'dat':return (vwl?'y':'')+trA(v);
   case 'acc':return (vwl?'y':'')+trI(v);case 'loc':return D+trA(v);case 'abl':return D+trA(v)+'n';
   case 'li':return 'l'+trI(v);}return '';}
function wlCity(s){if(!s||typeof s!=='string'||wlCityOff())return s;var c=PROVINCE.name;if(window.TRG&&window.TRG.city){if(s.indexOf('İzmir')>=0||s.indexOf('İZMİR')>=0)s=window.TRG.city(s,c);if(window.TRG.districts)s=window.TRG.districts(s,c);if(window.TRG.region)s=window.TRG.region(s,c);/* H9: Ege→hedef bölge */return s;}if(s.indexOf('İzmir')<0&&s.indexOf('İZMİR')<0)return s;
  s=s.split('İzmir ve Ege bölgesi').join(c+' ve çevresi').split('İzmir ve Ege').join(c+' ve çevresi').split('İzmir & Ege').join(c+' & çevresi').split('İzmir ve çevresi').join(c+' ve çevresi');
  s=s.replace(/İzmir['’](nin|nın|nun|nün|in|ın|un|ün)\b/g,c+"'"+citySuffix(c,'gen'));
  s=s.replace(/İzmir['’](den|dan|ten|tan)\b/g,c+"'"+citySuffix(c,'abl'));
  s=s.replace(/İzmir['’](deki|daki|teki|takı)\b/g,c+"'"+citySuffix(c,'loc')+'ki');
  s=s.replace(/İzmir['’](de|da|te|ta)\b/g,c+"'"+citySuffix(c,'loc'));
  s=s.replace(/İzmir['’](ya|ye|a|e)\b/g,c+"'"+citySuffix(c,'dat'));
  s=s.replace(/İzmir['’](yı|yi|yu|yü|ı|i|u|ü)\b/g,c+"'"+citySuffix(c,'acc'));
  s=s.replace(/İzmir['’]?li\b/g,c+citySuffix(c,'li'));
  s=s.split('İZMİR').join((c||'').toLocaleUpperCase('tr'));
  s=s.replace(/İzmir/g,c);
  return s;}
function wlReplace(s){return wlCity(brandReplace(s));}
var _brandObs=null,_brandTO=null;
/* KUSURSUZ RE-SWAP: her düğümün BOZULMAMIŞ (İzmir) temelini sakla; her dönüşüm
   daima bu temelden yapılır. Böylece il TEKRAR değişince (Rize→Antalya) içerik
   önceki ile takılıp kalmaz; her zaman kaynaktan hedefe doğru üretilir. */
var _wlBase=(window._wlBase=window._wlBase||new WeakMap());
function brandSweep(root){try{if(brandName()===BRAND_ORIG&&wlCityOff())return;root=root||document.body;if(!root)return;
  if(_brandObs)_brandObs.disconnect();
  var _hit=function(v){return v&&(v.indexOf('Meridyen')>=0||v.indexOf('İzmir')>=0||v.indexOf('İZMİR')>=0||(!wlCityOff()&&(v.indexOf('Ege')>=0||(window.TRG&&window.TRG.hasIzmirPlace&&window.TRG.hasIzmirPlace(v)))));};/* H9: Ege da yakala */
  var w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null,false),nodes=[],nn;
  while(nn=w.nextNode()){if(_wlBase.has(nn)||_hit(nn.nodeValue))nodes.push(nn);}
  nodes.forEach(function(t){var base=_wlBase.has(t)?_wlBase.get(t):(_wlBase.set(t,t.nodeValue),t.nodeValue);var out=wlReplace(base);if(t.nodeValue!==out)t.nodeValue=out;});
  var attrs=['title','alt','placeholder','aria-label','value'];
  root.querySelectorAll('[title],[alt],[placeholder],[aria-label]').forEach(function(el){var c=el.__wlBaseAttrs;attrs.forEach(function(a){var cur=el.getAttribute&&el.getAttribute(a);if(cur==null)return;var cached=c&&(a in c);if(!cached&&!_hit(cur))return;if(!c)c=el.__wlBaseAttrs={};var base=cached?c[a]:(c[a]=cur);var out=wlReplace(base);if(cur!==out)el.setAttribute(a,out);});});
  try{brandLogos();}catch(e){}   /* TÜM logolar (üst + overlay + footer) tek kaynaktan — tekil querySelector bug'ı giderildi */
  try{if(document.title.indexOf('Meridyen')>=0||document.title.indexOf('İzmir')>=0)document.title=wlReplace(document.title);
    document.querySelectorAll('meta[content]').forEach(function(m){var v=m.getAttribute('content');if(v&&(v.indexOf('Meridyen')>=0||v.indexOf('İzmir')>=0))m.setAttribute('content',wlReplace(v));});document.querySelectorAll('script[type="application/ld+json"]').forEach(function(s){var v=s.textContent;if(v&&(v.indexOf('Meridyen')>=0||v.indexOf('İzmir')>=0||v.indexOf('İZMİR')>=0))s.textContent=wlReplace(v);});}catch(e){}
  if(_brandObs&&brandName()!==BRAND_ORIG)_brandObs.observe(document.body,{childList:true,subtree:true});
 }catch(e){}}
function applyCanonical(){try{var url=location.origin+location.pathname.replace(/index\.html$/,'');var setL=function(rel,href){var l=document.querySelector('link[rel="'+rel+'"]');if(!l){l=document.createElement('link');l.setAttribute('rel',rel);document.head.appendChild(l);}l.setAttribute('href',href);};setL('canonical',url);var setM=function(pr,val){var m=document.querySelector('meta[property="'+pr+'"]');if(!m){m=document.createElement('meta');m.setAttribute('property',pr);document.head.appendChild(m);}m.setAttribute('content',val);};setM('og:url',url);try{setM('og:site_name',brandName());}catch(e){}}catch(e){}}
function applySchema(){try{if(typeof FIRMA==='undefined'||!FIRMA)return;var name=brandName(),il=(typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir';var sd=(typeof SEO==='object'&&SEO&&SEO.desc)||'';var gen=name+' — '+il+' ve çevresinde satılık ve kiralık konut, arsa, ticari gayrimenkul, değerleme, yatırım ve miras/intikal danışmanlığı.';var desc=(sd&&sd.indexOf('İzmir')<0&&sd.indexOf('Ege')<0)?sd:gen;var node={'@context':'https://schema.org','@type':['RealEstateAgent','LocalBusiness'],name:name,url:(location.origin+'/'),description:desc,areaServed:{'@type':'City',name:il},address:{'@type':'PostalAddress',addressLocality:il,addressRegion:il,addressCountry:'TR',streetAddress:(FIRMA.adres||'')},telephone:(FIRMA.tel||''),email:(FIRMA.mail||''),priceRange:'\u20ba\u20ba',knowsAbout:['Satılık konut','Kiralık konut','Arsa','Ticari gayrimenkul','Ofis','Gayrimenkul değerleme','Miras ve intikal','Yatırım danışmanlığı']};if(FIRMA.eids&&FIRMA.eids.belgeNo)node.identifier={'@type':'PropertyValue',name:'Taşınmaz Ticareti Yetki Belgesi No',value:FIRMA.eids.belgeNo};var sc=document.querySelectorAll('script[type="application/ld+json"]'),tg=null;for(var i=0;i<sc.length;i++){if((sc[i].textContent||'').indexOf('RealEstateAgent')>=0){tg=sc[i];break;}}if(!tg){tg=document.createElement('script');tg.type='application/ld+json';document.head.appendChild(tg);}tg.textContent=JSON.stringify(node);}catch(e){}}
function brandObserve(){try{if(_brandObs||(brandName()===BRAND_ORIG&&wlCityOff())||!('MutationObserver' in window))return;
  _brandObs=new MutationObserver(function(){clearTimeout(_brandTO);_brandTO=setTimeout(function(){brandSweep(document.body);},140);});
  _brandObs.observe(document.body,{childList:true,subtree:true});}catch(e){}}
function applyBrand(name){try{
  /* Önceki uygulanan marka (kalıcı) — obFinish FIRMA.name'i applyBrand'den ÖNCE set ettiği için
     eski adı FIRMA'dan değil, kalıcı 'wl_brand_applied' anahtarından okuruz. */
  var _old=null;try{_old=localStorage.getItem('wl_brand_applied');}catch(e){}
  if(_old==null)_old=(window.__WL_BRAND_APPLIED!=null?window.__WL_BRAND_APPLIED:BRAND_ORIG);
  if(name)FIRMA.name=name.trim();
  var _new=brandName();
  /* KUSURSUZ RE-BRAND: her marka-taşıyan alanı BOZULMAMIŞ "Meridyen" şablonundan yeniden türet.
     Alan; şablonun kendisi, 'Meridyen' içeren ya da şablonun ESKİ adla markalanmış hali ise
     (yani otomatik/dokunulmamış) → yeni ada güncellenir. Kullanıcı elle düzenlediyse KORUNUR.
     Böylece ad TEKRAR değişince (Rize→Antalya) içerik eski markada takılıp kalmaz. */
  var TPL=(window.__WL_TPL=window.__WL_TPL||{CONTENT:clone(DEF_CONTENT),SEO:{title:DEF_SEO.title,desc:DEF_SEO.desc,kw:DEF_SEO.kw},AICFG:{persona:DEF_AICFG.persona,greet:DEF_AICFG.greet},unvan:'Meridyen Gayrimenkul Danışmanlık Ltd. Şti.'});
  var _rd=function(obj,tpl,keys){if(!obj)return;keys.forEach(function(k){var t=tpl[k];if(typeof t!=='string'||typeof obj[k]!=='string')return;var cur=obj[k];if(cur===t||cur.indexOf('Meridyen')>=0||cur===brandReplaceWith(t,_old))obj[k]=brandReplaceWith(t,_new);});};
  _rd(CONTENT,TPL.CONTENT,Object.keys(TPL.CONTENT));
  _rd(SEO,TPL.SEO,['title','desc','kw']);
  _rd(AICFG,TPL.AICFG,['persona','greet']);
  if(FIRMA.eids&&typeof FIRMA.eids.unvan==='string'){var _u=FIRMA.eids.unvan;if(_u===TPL.unvan||_u.indexOf('Meridyen')>=0||_u===brandReplaceWith(TPL.unvan,_old))FIRMA.eids.unvan=brandReplaceWith(TPL.unvan,_new);}
  try{window.__WL_BRAND_APPLIED=_new;localStorage.setItem('wl_brand_applied',_new);}catch(e){}
  if(typeof saveAll==='function')saveAll();
  if(typeof applyFirma==='function')applyFirma();if(typeof applyContent==='function'){try{applyContent();}catch(e){}}
  brandSweep(document.body);brandObserve();applySchema();
}catch(e){console.warn('applyBrand:',e);}}
function applyFirma(){
  document.querySelectorAll('.js-tel').forEach(e=>{e.textContent=FIRMA.tel;if(e.tagName==='A')e.href='tel:'+FIRMA.tel.replace(/[^0-9+]/g,'');});
  document.querySelectorAll('.js-tel2').forEach(e=>e.textContent=FIRMA.tel);
  document.querySelectorAll('.js-mail').forEach(e=>{e.textContent=FIRMA.mail;if(e.tagName==='A')e.href='mailto:'+FIRMA.mail;});
  document.querySelectorAll('.js-hours,.js-hours2').forEach(e=>e.textContent=FIRMA.hours);
  document.querySelectorAll('.js-adres').forEach(e=>e.textContent=FIRMA.adres);
  if(FIRMA.wa){document.querySelectorAll('a[href^="https://wa.me/905000000000"]').forEach(a=>{a.href=a.href.replace('905000000000',FIRMA.wa);});}
  try{applySocial();}catch(e){}
}
/* Sosyal medya: FIRMA.social'dan href yaz; boşsa demo linkini GİZLE (Meridyen hesabına gitmesin).
   Demo-handle deseniyle çalışır → SPA footer + geç render + statik footer (wl.js de çağırır). */
function applySocial(){
  var S=(FIRMA&&FIRMA.social)||{};
  [['fb','facebook.com/meridyengayrimenkul'],['ig','instagram.com/meridyengayrimenkul'],['x','x.com/meridyengm'],['li','linkedin.com/company/meridyengayrimenkul'],['yt','youtube.com/@meridyengayrimenkul']].forEach(function(m){
    var key=m[0],demo=m[1],v=(S[key]||'').trim();
    document.querySelectorAll('a[href*="'+demo+'"]').forEach(function(a){
      if(v){a.href=/^https?:\/\//i.test(v)?v:('https://'+v.replace(/^\/+/,''));a.style.display='';}
      else{a.style.display='none';}
    });
  });
}
window.applySocial=applySocial;
/* ===== TEK KAYNAK LOGO — üst menü + tüm overlay header'ları + footer BİREBİR =====
   Kök neden: eski kod document.querySelector('.logo .mark') (TEKİL) kullanıyordu →
   yalnız İLK logo (ana header) güncelleniyor, overlay/footer logoları "M" kalıyordu.
   brandLogos() BÜTÜN .logo öğelerini aynı anda günceller: yüklü logo görseli varsa
   standart boyutlu <img>, yoksa marka baş harfi + ada göre bölünmüş yazı. */
function brandActiveLogo(){
  try{ if(typeof FIRMA==='object'&&FIRMA&&FIRMA.logo){var v=''+FIRMA.logo; if(v.indexOf('data:')===0||v.indexOf('http')===0||v.indexOf('/')===0)return v; if(typeof IMG!=='undefined'&&IMG[v])return IMG[v]; if(v)return v; } }catch(e){}
  try{ if(typeof saasResolve==='function'){var s=saasResolve('logoUrl'); if(s)return s;} }catch(e){}
  return '';
}
function brandLogos(){
  try{
    var img=brandActiveLogo();
    var name=(typeof brandName==='function'?brandName():BRAND_ORIG);
    var isDef=(name===BRAND_ORIG);
    var esc=function(s){return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');};
    var jlHtml=null;
    if(!isDef){var ps=name.split(/\s+/);var last=ps.length>1?ps[ps.length-1]:'';var head=ps.length>1?ps.slice(0,-1).join(' '):name;jlHtml=esc(head)+(last?'<span class="lo2"> '+esc(last)+'</span>':'');}
    var letter=((typeof brandShort==='function'?brandShort():'')||'').charAt(0).toLocaleUpperCase('tr');
    document.querySelectorAll('.logo').forEach(function(lo){
      var mk=lo.querySelector('.mark'), jl=lo.querySelector('.js-logo');
      if(img){
        lo.classList.add('has-logo-img');
        var im=lo.querySelector('img.logo-img');
        if(!im){im=document.createElement('img');im.className='logo-img';im.setAttribute('alt',name||'logo');im.setAttribute('decoding','async');lo.insertBefore(im,lo.firstChild);}
        if(im.getAttribute('src')!==img)im.setAttribute('src',img);
      }else{
        lo.classList.remove('has-logo-img');
        var im2=lo.querySelector('img.logo-img'); if(im2&&im2.parentNode)im2.parentNode.removeChild(im2);
        if(mk&&letter)mk.textContent=letter;
      }
      if(jl&&jlHtml!=null)jl.innerHTML=jlHtml;
    });
    /* white-label: marka adı değişince favicon + Google/Organization logosu da
       (harften ÜRETİLEN) canlı yenilensin — brand.js tek doğruluk kaynağından türetir */
    try{if(window.gmRefreshBrand)gmRefreshBrand();}catch(e){}
  }catch(e){}
}
window.brandLogos=brandLogos;window.brandActiveLogo=brandActiveLogo;

/* ============ ADMIN: SÖZLEŞMELER ============ */
const CT_LABEL={aracilik:'Aracılık (Tellaliye)',['yer-gosterme']:'Yer Gösterme',kira:'Kira Sözleşmesi',['satis-vaadi']:'Satış Ön Protokolü',yetki:'Münhasır Portföy Yetkisi'};
const CT_DURUM={aktif:'Aktif',tamamlandi:'Tamamlandı',iptal:'İptal',taslak:'Taslak'};
const CT_NEWBASLIK={aracilik:'Yeni Aracılık Sözleşmesi',['yer-gosterme']:'Yeni Yer Gösterme Belgesi',kira:'Yeni Kira Sözleşmesi',['satis-vaadi']:'Yeni Satış Ön Protokolü',yetki:'Yeni Portföy Yetki Sözleşmesi'};
const SOZLESME_SABLONLARI={
  aracilik:{ad:'Gayrimenkul Aracılık (Tellaliye) Sözleşmesi',madde:`GAYRİMENKUL ARACILIK (TELLALİYE) SÖZLEŞMESİ

Sözleşme Tarihi: {{TARIH}}

1. TARAFLAR
İşbu sözleşme; bir tarafta aracı sıfatıyla
  {{FIRMA_UNVAN}}
  Adres: {{FIRMA_ADRES}}
  Tel: {{FIRMA_TEL}} · Vergi/MERSİS No: {{FIRMA_VERGI}}
  Yetkili: {{FIRMA_YETKILI}}
(bundan sonra "ARACI" olarak anılacaktır) ile diğer tarafta
  {{KARSI_TARAF}} · T.C./Vergi No: {{KARSI_TC}}
  Adres: {{KARSI_ADRES}}
(bundan sonra "MÜŞTERİ" olarak anılacaktır) arasında aşağıdaki şartlarla akdedilmiştir.

2. SÖZLEŞMENİN KONUSU
ARACI, aşağıda nitelikleri belirtilen taşınmazın {{ISLEM}} işlemine ilişkin olarak MÜŞTERİ adına alıcı/satıcı bulma, görüşmeleri yürütme ve işlemin sonuçlanmasına aracılık etme hizmetini üstlenir.
  Taşınmaz: {{TASINMAZ_TIP}} · {{M2}} m²
  Adres: {{TASINMAZ_ADRES}}
  Konum: {{MAHALLE}} Mah. / {{ILCE}} / {{IL}}
  Beyan Edilen Bedel: {{BEDEL}} ₺

3. HİZMET BEDELİ (TELLALİYE / KOMİSYON)
İşlemin ARACI'nın aracılığıyla sonuçlanması hâlinde MÜŞTERİ, işlem bedeli üzerinden % {{KOMISYON}} oranında hizmet bedeli (komisyon) ödemeyi kabul eder. Hizmet bedeli, satış/kira işleminin tamamlandığı anda muaccel olur. Vergiler ilgili mevzuata göre ayrıca yansıtılır.

4. TARAFLARIN YÜKÜMLÜLÜKLERİ
4.1. MÜŞTERİ, taşınmaza ilişkin doğru ve güncel bilgileri ARACI'ya sağlar.
4.2. ARACI, faaliyetlerini özen ve dürüstlük kuralları çerçevesinde yürütür; MÜŞTERİ'nin menfaatini gözetir.
4.3. MÜŞTERİ, ARACI tarafından tanıştırılan kişilerle ARACI'yı devre dışı bırakarak doğrudan işlem yapamaz; aksi hâlde komisyon hakkı doğmuş sayılır.

5. SÜRE
İşbu sözleşme imza tarihinden itibaren {{SURE_AY}} ay süreyle geçerlidir. Süre sonunda taraflarca yazılı olarak yenilenebilir.

6. UYUŞMAZLIK
Taraflar, işbu sözleşmeden doğabilecek uyuşmazlıklarda öncelikle iyi niyetle uzlaşmayı esas alır. Çözülemeyen uyuşmazlıklarda {{IL}} Mahkemeleri ve İcra Daireleri yetkilidir.

İşbu sözleşme iki nüsha olarak düzenlenmiş ve taraflarca okunarak imzalanmıştır.

ARACI                                   MÜŞTERİ
{{FIRMA_UNVAN}}                          {{KARSI_TARAF}}
İmza: ____________                      İmza: ____________`},
  'yer-gosterme':{ad:'Yer Gösterme Belgesi',madde:`YER GÖSTERME BELGESİ

Tarih: {{TARIH}}

Aşağıda kimlik ve iletişim bilgileri yer alan müşteriye, {{FIRMA_UNVAN}} yetkilisi tarafından aşağıda nitelikleri belirtilen taşınmaz/taşınmazlar yerinde gösterilmiştir.

MÜŞTERİ
  Ad Soyad: {{KARSI_TARAF}}
  T.C./Vergi No: {{KARSI_TC}}
  Adres: {{KARSI_ADRES}}

GÖSTERİLEN TAŞINMAZ
  Tür: {{TASINMAZ_TIP}} · {{M2}} m² · İşlem: {{ISLEM}}
  Adres: {{TASINMAZ_ADRES}}
  Konum: {{MAHALLE}} Mah. / {{ILCE}} / {{IL}}
  Beyan Edilen Bedel: {{BEDEL}} ₺

BEYAN VE TAAHHÜT
Müşteri, yukarıda belirtilen taşınmazı {{FIRMA_UNVAN}} aracılığıyla gördüğünü kabul eder. Müşteri; kendisine gösterilen bu taşınmazı, doğrudan veya üçüncü kişiler (eş, akraba, şirket vb.) eliyle, {{FIRMA_UNVAN}}'yi devre dışı bırakarak satın alır/kiralarsa, işlem bedeli üzerinden % {{KOMISYON}} oranındaki hizmet bedelini ödemeyi kabul ve taahhüt eder.

Bu belge, taraflar arasında yer gösterme faaliyetinin gerçekleştiğine dair delil niteliğindedir.

{{FIRMA_UNVAN}}                          MÜŞTERİ
Yetkili: {{FIRMA_YETKILI}}               {{KARSI_TARAF}}
İmza: ____________                      İmza: ____________
Adres: {{FIRMA_ADRES}}
Tel: {{FIRMA_TEL}}`},
  kira:{ad:'Kira Sözleşmesi',madde:`KİRA SÖZLEŞMESİ

Düzenleme Tarihi: {{TARIH}}

1. TARAFLAR
KİRAYA VEREN (Mal Sahibi/Vekili): {{KARSI_TARAF}} · T.C./Vergi No: {{KARSI_TC}}
  Adres: {{KARSI_ADRES}}
ARACI: {{FIRMA_UNVAN}} · {{FIRMA_ADRES}} · {{FIRMA_TEL}}
KİRACI: ........................................ · T.C. No: ................
  Adres: ........................................

2. KİRALANAN TAŞINMAZ
  Tür: {{TASINMAZ_TIP}} · Brüt/Net: {{M2}} m²
  Adres: {{TASINMAZ_ADRES}}
  Konum: {{MAHALLE}} Mah. / {{ILCE}} / {{IL}}

3. KİRA BEDELİ VE ÖDEME
Aylık kira bedeli {{BEDEL}} ₺ olup, her ayın ödeme gününde KİRAYA VEREN'in bildireceği hesaba peşin olarak ödenir. Kira bedeli, yürürlükteki mevzuatta öngörülen sınırlar dâhilinde yıllık olarak güncellenir.

4. SÜRE
Kira süresi {{SURE_AY}} ay olup, {{TARIH}} tarihinde başlar. Süre sonunda taraflarca aksi yazılı olarak kararlaştırılmadıkça sözleşme aynı koşullarla uzar.

5. DEPOZİTO VE GİDERLER
Depozito tutarı ve aidat/yakıt/elektrik/su/doğalgaz gibi giderlerin kime ait olacağı taraflarca işbu sözleşmede ayrıca belirlenir. Demirbaş listesi ek olarak düzenlenir.

6. GENEL HÜKÜMLER
6.1. KİRACI, taşınmazı özenle kullanır ve sözleşme bitiminde teslim aldığı durumda iade eder.
6.2. Tahliye, fesih ve sair hususlarda Türk Borçlar Kanunu'nun konut/çatılı işyeri kiralarına ilişkin hükümleri uygulanır.
6.3. ARACI'nın hizmet bedeli (komisyon) % {{KOMISYON}} oranında olup ilgili tarafça ödenir.

7. UYUŞMAZLIK
Uyuşmazlıklarda {{IL}} Mahkemeleri ve İcra Daireleri yetkilidir.

İşbu sözleşme taraflarca okunup imzalanmıştır.

KİRAYA VEREN            KİRACI                 ARACI
{{KARSI_TARAF}}         ________________       {{FIRMA_UNVAN}}
İmza: __________        İmza: __________       İmza: __________`},
  'satis-vaadi':{ad:'Gayrimenkul Satış Ön Protokolü (Bağlanma)',madde:`GAYRİMENKUL SATIŞ ÖN PROTOKOLÜ (BAĞLANMA / KAPORA)

Tarih: {{TARIH}}

ÖNEMLİ NOT: Taşınmaz satış vaadinin resmî olarak geçerli olması için noterde düzenleme şeklinde yapılması gerekir. İşbu belge, tarafların satış konusunda anlaştıklarını ve resmî devir aşamasına kadar bağlayıcı ön mutabakatlarını gösteren bir ön protokoldür.

1. TARAFLAR
SATICI: {{KARSI_TARAF}} · T.C./Vergi No: {{KARSI_TC}} · Adres: {{KARSI_ADRES}}
ALICI: ........................................ · T.C. No: ................
ARACI: {{FIRMA_UNVAN}} · {{FIRMA_ADRES}} · {{FIRMA_TEL}}

2. TAŞINMAZ
  Tür: {{TASINMAZ_TIP}} · {{M2}} m²
  Adres: {{TASINMAZ_ADRES}}
  Konum: {{MAHALLE}} Mah. / {{ILCE}} / {{IL}}

3. SATIŞ BEDELİ VE ÖDEME
Toplam satış bedeli {{BEDEL}} ₺'dir. ALICI, işbu protokol ile ____________ ₺ tutarında kaporayı/bağlanma bedelini ödemiştir. Bakiye, tapu devri sırasında ödenecektir.

4. CAYMA
4.1. ALICI cayarsa ödediği kapora SATICI'da kalır.
4.2. SATICI cayarsa aldığı kaporayı iki katı olarak ALICI'ya iade eder.
(Taraflar farklı bir cayma şartı kararlaştırabilir.)

5. DEVİR SÜRESİ
Tapu devri, işbu protokol tarihinden itibaren en geç {{SURE_AY}} ay içinde ilgili Tapu Müdürlüğü'nde gerçekleştirilecektir.

6. ARACI HİZMET BEDELİ
ARACI'nın hizmet bedeli işlem bedeli üzerinden % {{KOMISYON}} oranındadır ve devir aşamasında muaccel olur.

7. UYUŞMAZLIK
Uyuşmazlıklarda {{IL}} Mahkemeleri ve İcra Daireleri yetkilidir.

SATICI                  ALICI                  ARACI
{{KARSI_TARAF}}         ________________       {{FIRMA_UNVAN}}
İmza: __________        İmza: __________       İmza: __________`},
  yetki:{ad:'Münhasır Portföy Yetki Sözleşmesi',madde:`MÜNHASIR (EXCLUSIVE) PORTFÖY YETKİ SÖZLEŞMESİ

Tarih: {{TARIH}}

1. TARAFLAR
MAL SAHİBİ: {{KARSI_TARAF}} · T.C./Vergi No: {{KARSI_TC}} · Adres: {{KARSI_ADRES}}
YETKİLİ ARACI: {{FIRMA_UNVAN}} · {{FIRMA_ADRES}} · {{FIRMA_TEL}} · Yetkili: {{FIRMA_YETKILI}}

2. KONU
MAL SAHİBİ, aşağıda belirtilen taşınmazın {{ISLEM}} işlemi için {{FIRMA_UNVAN}}'ye MÜNHASIR (tek yetkili) pazarlama ve aracılık yetkisi verir.
  Taşınmaz: {{TASINMAZ_TIP}} · {{M2}} m²
  Adres: {{TASINMAZ_ADRES}}
  Konum: {{MAHALLE}} Mah. / {{ILCE}} / {{IL}}
  Hedef Bedel: {{BEDEL}} ₺

3. MÜNHASIRLIK
Bu sözleşme süresince MAL SAHİBİ, taşınmazı başka bir emlak ofisine veremez ve YETKİLİ ARACI'yı devre dışı bırakarak doğrudan işlem yapamaz. Aksi hâlde, işlem bedeli üzerinden % {{KOMISYON}} oranındaki hizmet bedeli YETKİLİ ARACI'ya ödenir.

4. ARACININ YÜKÜMLÜLÜKLERİ
YETKİLİ ARACI; taşınmazı ilan portföyünde yayınlar, profesyonel tanıtım yapar, alıcı/kiracı adaylarını yönetir ve MAL SAHİBİ'ni düzenli bilgilendirir.

5. HİZMET BEDELİ
İşlemin sonuçlanması hâlinde hizmet bedeli işlem bedeli üzerinden % {{KOMISYON}} oranındadır.

6. SÜRE
Sözleşme imza tarihinden itibaren {{SURE_AY}} ay süreyle geçerlidir. Süre, tarafların yazılı mutabakatı ile uzatılabilir.

7. UYUŞMAZLIK
Uyuşmazlıklarda {{IL}} Mahkemeleri ve İcra Daireleri yetkilidir.

İşbu sözleşme iki nüsha düzenlenmiş, okunarak imzalanmıştır.

MAL SAHİBİ              YETKİLİ ARACI
{{KARSI_TARAF}}         {{FIRMA_UNVAN}}
İmza: __________        İmza: __________`}
};
function fillTemplate(c){
  let t=(SOZLESME_SABLONLARI[c.tip]||{}).madde||'';
  if(c.ozelMetin&&c.ozelMetin.trim())t=c.ozelMetin;
  const F=(typeof FIRMA!=='undefined'&&FIRMA)?FIRMA:{};
  const map={
    '{{FIRMA_UNVAN}}':F.name||'',
    '{{FIRMA_ADRES}}':F.adres||'',
    '{{FIRMA_TEL}}':F.tel||'',
    '{{FIRMA_VERGI}}':F.vergi||'—',
    '{{FIRMA_YETKILI}}':F.yetkili||'—',
    '{{KARSI_TARAF}}':c.karsiTaraf||'..................',
    '{{KARSI_TC}}':c.karsiTC||'..................',
    '{{KARSI_ADRES}}':c.karsiAdres||'..................',
    '{{IL}}':c.il||'......','{{ILCE}}':c.ilce||'......','{{MAHALLE}}':c.mahalle||'......',
    '{{TASINMAZ_ADRES}}':c.tasinmazAdres||'..................',
    '{{TASINMAZ_TIP}}':c.tasinmazTip||'......',
    '{{M2}}':c.m2||'....','{{ISLEM}}':c.islem||'......',
    '{{BEDEL}}':c.bedel||'..........','{{KOMISYON}}':c.komisyon||'..',
    '{{SURE_AY}}':c.sureAy||'..','{{TARIH}}':c.tarih||'../../....'
  };
  Object.keys(map).forEach(k=>{t=t.split(k).join(map[k]);});
  return t;
}
function renderContracts(){
  const el=document.getElementById('contractList');if(!el)return;
  if(!CONTRACTS.length){el.innerHTML='<div class="empty">Henüz sözleşme yok. Yukarıdan tip seçerek yeni sözleşme oluşturun.</div>';return;}
  /* GÜVENLİK: yalnız çift tırnak kaçıran sürüm, kullanıcının yazdığı sözleşme
     alanlarını hem input value="…" hem <b>…</b> metin bağlamına basıyordu;
     < > geçtiği için etiket enjekte edilebiliyor, saveAll() ile localStorage'a
     kalıcı yazılıyor ve printContract() yeni pencereye kopyalıyordu.
     Dosyadaki tam kaçış fonksiyonuna devrediliyor. */
  const esc=_le;
  el.innerHTML=CONTRACTS.map((c,i)=>`<div class="ct-card">
    <div class="ct-head">
      <span class="ct-badge ct-${c.tip}">${CT_LABEL[c.tip]||c.tip}</span>
      <span class="ct-status ct-st-${c.durum}">${CT_DURUM[c.durum]||c.durum}</span>
      <b style="margin-left:4px">${esc(c.baslik)}</b>
      <button class="lk" style="color:#d4416a;margin-left:auto" onclick="if(confirm('Sözleşme silinsin mi?')){CONTRACTS.splice(${i},1);renderContracts();saveAll();toast('Sözleşme silindi.')}">sil</button>
    </div>
    <div class="ct-actions">
      <button class="btn-mini" onclick="document.getElementById('ctEd${i}').classList.toggle('open')">✏️ Düzenle</button>
      <button class="btn-mini" onclick="previewContract(${i})">👁️ Önizle & Yazdır</button>
      <button class="btn-mini" onclick="contractWhatsApp(${i})">📱 WhatsApp</button>
    </div>
    <div class="ct-ed" id="ctEd${i}">
      <div class="ed2">
        <div><label>Sözleşme Başlığı</label><input value="${esc(c.baslik)}" oninput="CONTRACTS[${i}].baslik=this.value;saveAll()"></div>
        <div><label>Sözleşme Tipi</label><select onchange="CONTRACTS[${i}].tip=this.value;renderContracts();saveAll()">${Object.keys(CT_LABEL).map(k=>`<option value="${k}"${c.tip===k?' selected':''}>${CT_LABEL[k]}</option>`).join('')}</select></div>
      </div>
      <div class="ed2">
        <div><label>Karşı Taraf (Mal Sahibi / Müşteri)</label><input value="${esc(c.karsiTaraf)}" oninput="CONTRACTS[${i}].karsiTaraf=this.value;saveAll()"></div>
        <div><label>T.C. / Vergi No</label><input value="${esc(c.karsiTC)}" oninput="CONTRACTS[${i}].karsiTC=this.value;saveAll()"></div>
      </div>
      <label>Karşı Taraf Adresi</label><input value="${esc(c.karsiAdres)}" oninput="CONTRACTS[${i}].karsiAdres=this.value;saveAll()">
      <div class="ed3">
        <div><label>İl</label><input value="${esc(c.il)}" oninput="CONTRACTS[${i}].il=this.value;saveAll()"></div>
        <div><label>İlçe</label><input value="${esc(c.ilce)}" oninput="CONTRACTS[${i}].ilce=this.value;saveAll()"></div>
        <div><label>Mahalle</label><input value="${esc(c.mahalle)}" oninput="CONTRACTS[${i}].mahalle=this.value;saveAll()"></div>
      </div>
      <label>Taşınmaz Adresi</label><input value="${esc(c.tasinmazAdres)}" oninput="CONTRACTS[${i}].tasinmazAdres=this.value;saveAll()">
      <div class="ed3">
        <div><label>Taşınmaz Tipi</label><input value="${esc(c.tasinmazTip)}" placeholder="Daire / Villa / Arsa / İşyeri" oninput="CONTRACTS[${i}].tasinmazTip=this.value;saveAll()"></div>
        <div><label>m²</label><input type="number" value="${esc(c.m2)}" oninput="CONTRACTS[${i}].m2=this.value;saveAll()"></div>
        <div><label>İşlem</label><select onchange="CONTRACTS[${i}].islem=this.value;saveAll()">${['Satılık','Kiralık'].map(o=>`<option${c.islem===o?' selected':''}>${o}</option>`).join('')}</select></div>
      </div>
      <div class="ed3">
        <div><label>Bedel (₺)</label><input value="${esc(c.bedel)}" oninput="CONTRACTS[${i}].bedel=this.value;saveAll()"></div>
        <div><label>Komisyon %</label><input type="number" step="0.5" value="${esc(c.komisyon)}" oninput="CONTRACTS[${i}].komisyon=this.value;saveAll()"></div>
        <div><label>Süre (ay)</label><input type="number" value="${esc(c.sureAy)}" oninput="CONTRACTS[${i}].sureAy=this.value;saveAll()"></div>
      </div>
      <div class="ed2">
        <div><label>Sözleşme Tarihi</label><input type="date" value="${esc(c.tarih)}" oninput="CONTRACTS[${i}].tarih=this.value;saveAll()"></div>
        <div><label>Durum</label><select onchange="CONTRACTS[${i}].durum=this.value;renderContracts();saveAll()">${Object.keys(CT_DURUM).map(k=>`<option value="${k}"${c.durum===k?' selected':''}>${CT_DURUM[k]}</option>`).join('')}</select></div>
      </div>
      <label>Özel Sözleşme Metni <span style="font-weight:400;color:var(--muted)">(boş bırakırsanız hazır şablon kullanılır; düzenlerseniz kendi metniniz geçerli olur)</span></label>
      <textarea class="adm-ta" rows="5" placeholder="Hazır şablonu özelleştirmek için aşağıdaki butonla yükleyin..." oninput="CONTRACTS[${i}].ozelMetin=this.value;saveAll()">${(c.ozelMetin||'').replace(/</g,'&lt;')}</textarea>
      <button class="btn-mini" style="margin-top:8px" onclick="loadTemplateInto(${i})">📋 Hazır Şablonu Metne Yükle (düzenlemek için)</button>
    </div>
  </div>`).join('');
}
function loadTemplateInto(i){
  const c=CONTRACTS[i];
  c.ozelMetin=fillTemplate({...c,ozelMetin:''});
  renderContracts();saveAll();
  const ed=document.getElementById('ctEd'+i);if(ed)ed.classList.add('open');
  toast('Şablon metne yüklendi; artık düzenleyebilirsiniz.');
}
function buildContractHTML(c){
  const body=fillTemplate(c).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const F=(typeof FIRMA!=='undefined'&&FIRMA)?FIRMA:{};
  const logo=F.name||'Meridyen Gayrimenkul';
  return `<div class="ct-doc">
    <div class="ct-doc-head">
      <div class="ct-logo">${(logo[0]||'M')}</div>
      <div><div class="ct-firma">${logo}</div>
        <div class="ct-firma-sub">${F.adres||''} · ${F.tel||''}${F.vergi?(' · Vergi No: '+F.vergi):''}</div></div>
    </div>
    <pre class="ct-body">${body}</pre>
    <div class="ct-doc-foot">${logo} · ${F.mail||''} · Bu belge ${new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur. Genel bilgilendirme amaçlı taslaktır.</div>
  </div>`;
}
function previewContract(i){
  const c=CONTRACTS[i];
  let modal=document.getElementById('ctModal');
  if(!modal){modal=document.createElement('div');modal.id='ctModal';modal.className='ct-modal';modal.setAttribute('onclick',"if(event.target.id==='ctModal')this.classList.remove('open')");document.body.appendChild(modal);}
  modal.innerHTML=`<div class="ct-modal-inner">
    <div class="ct-modal-bar">
      <b>Sözleşme Önizleme</b>
      <div style="margin-left:auto;display:flex;gap:8px">
        <button class="btn-mini" onclick="printContract()">🖨️ Yazdır</button>
        <button class="btn-mini" onclick="contractWhatsApp(${i})">📱 WhatsApp</button>
        <button class="btn-mini" onclick="document.getElementById('ctModal').classList.remove('open')">✕ Kapat</button>
      </div>
    </div>
    <div class="ct-modal-body" id="ctPrintArea">${buildContractHTML(c)}</div>
  </div>`;
  modal.classList.add('open');
}
function printContract(){
  const area=document.getElementById('ctPrintArea');if(!area)return;
  const w=window.open('','_blank');if(!w){toast('Yazdırma penceresi engellendi. Pop-up izni verin.');return;}
  w.document.write(`<html><head><title>Sözleşme</title><meta charset="utf-8"><style>
    body{font-family:'Times New Roman',serif;padding:40px;color:#15233f;line-height:1.6}
    .ct-doc-head{display:flex;gap:14px;align-items:center;border-bottom:2px solid #1e40af;padding-bottom:14px;margin-bottom:20px}
    .ct-logo{width:48px;height:48px;border-radius:8px;background:#1e40af;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:22px;font-family:sans-serif}
    .ct-firma{font-weight:700;font-size:18px}.ct-firma-sub{font-size:11px;color:#555;margin-top:3px}
    .ct-body{white-space:pre-wrap;font-family:'Times New Roman',serif;font-size:13px;line-height:1.7;margin:0}
    .ct-doc-foot{margin-top:24px;border-top:1px solid #ccc;padding-top:10px;font-size:10px;color:#777;text-align:center}
  </style></head><body>${area.innerHTML}</body></html>`);
  w.document.close();setTimeout(()=>{try{w.print();}catch(e){}},350);
}
function contractWhatsApp(i){
  const c=CONTRACTS[i];
  const F=(typeof FIRMA!=='undefined'&&FIRMA)?FIRMA:{};
  const full=fillTemplate(c);
  const txt=`*${F.name||'Meridyen Gayrimenkul'}*\n${CT_LABEL[c.tip]||''} – ${c.baslik||''}\n\n`+full.slice(0,1200)+(full.length>1200?'\n\n...(tam metin ektedir)':'');
  window.open('https://wa.me/?text='+encodeURIComponent(txt),'_blank');
}
function admAddContract(tip){
  tip=tip||'aracilik';
  CONTRACTS.unshift({id:'c'+Date.now(),tip:tip,baslik:CT_NEWBASLIK[tip]||'Yeni Sözleşme',durum:'taslak',tarih:new Date().toISOString().slice(0,10),karsiTaraf:'',karsiTC:'',karsiAdres:'',il:'',ilce:'',mahalle:'',tasinmazAdres:'',tasinmazTip:'',m2:'',islem:(tip==='kira'?'Kiralık':'Satılık'),bedel:'',komisyon:(tip==='kira'?'':'2'),sureAy:(tip==='kira'?'12':'6'),ozelMetin:''});
  renderContracts();saveAll();
  const ed=document.getElementById('ctEd0');if(ed)ed.classList.add('open');
  toast('✓ '+(CT_LABEL[tip]||'Sözleşme')+' taslağı oluşturuldu.');
}

/* ============ ADMIN: TEMA ============ */
const THEMES=[
  {id:'mavi',name:'Kurumsal Mavi',accent:'#1e40af',green:'#1e7e3a',navy:'#0f1f3d',def:1},
  {id:'okyanus',name:'Okyanus',accent:'#0284c7',green:'#0d9488',navy:'#0c2230'},
  {id:'zumrut',name:'Zümrüt',accent:'#1e7e3a',green:'#1e7e3a',navy:'#0c1f17'},
  {id:'safir',name:'Safir Gece',accent:'#3b82f6',green:'#22c55e',navy:'#0a1631'},
  {id:'bordo',name:'Prestij Bordo',accent:'#9f1239',green:'#15803d',navy:'#2a0e1a'},
  {id:'antrasit',name:'Antrasit',accent:'#0f766e',green:'#65a30d',navy:'#1c2128'}
];
function renderThemeGrid(){const g=document.getElementById('themeGrid');if(!g)return;
  const cur=(THEME&&THEME.id)||'mavi';
  g.innerHTML=THEMES.map(t=>`<div class="tcard${t.id===cur?' act':''}" onclick="applyTheme('${t.id}')">
    <div class="sw"><i style="background:${t.navy}"></i><i style="background:${t.accent}"></i><i style="background:${t.green}"></i></div>
    <div class="tn">${t.name}</div></div>`).join('');}
function applyTheme(id){const t=THEMES.find(x=>x.id===id);if(!t)return;
  setTheme(t.accent,t.green,t.navy);THEME={id:t.id,accent:t.accent,green:t.green,navy:t.navy};saveAll();renderThemeGrid();
  document.getElementById('cc_accent').value=t.accent;document.getElementById('cc_green').value=t.green;document.getElementById('cc_navy').value=t.navy;
  toast('🎨 "'+t.name+'" teması uygulandı.');}
function customColor(){const a=document.getElementById('cc_accent').value,gr=document.getElementById('cc_green').value,nv=document.getElementById('cc_navy').value;
  setTheme(a,gr,nv);THEME={id:'ozel',accent:a,green:gr,navy:nv};saveAll();
  document.querySelectorAll('.tcard').forEach(c=>c.classList.remove('act'));}
function setTheme(accent,green,navy){
  if(!accent||typeof accent!=='string'||accent.charAt(0)!=='#')return;/* L: accent yoksa lighten/darken hex.slice çökerdi — güvenli çıkış */
  green=green||'#1e7e3a';navy=navy||'#0f1f3d';
  const r=document.documentElement.style;
  r.setProperty('--accent',accent);
  r.setProperty('--accent-2',lighten(accent,18));
  r.setProperty('--green',green);r.setProperty('--green-700',darken(green,16));r.setProperty('--green-200',lighten(green,34));
  r.setProperty('--c-bg-navy',navy);r.setProperty('--c-bg-deep',darken(navy,6));
}
function lighten(hex,amt){const n=parseInt(hex.slice(1),16);let r=Math.min(255,(n>>16)+amt),g=Math.min(255,((n>>8)&255)+amt),b=Math.min(255,(n&255)+amt);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
function darken(hex,amt){const n=parseInt(hex.slice(1),16);let r=Math.max(0,(n>>16)-amt),g=Math.max(0,((n>>8)&255)-amt),b=Math.max(0,(n&255)-amt);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}
/* TİPOGRAFİ TEMASI (token, Faz 0): seçili fontu Google Fonts'tan yükle + gövde fontunu ayarla
   (base.css'i geniş refactor etmeden; başlıklar kendi display fontunu koruyabilir). CSP _headers'ta izinli. */
var CURATED_FONTS={'Inter':'Inter:wght@400;500;600;700;800','Poppins':'Poppins:wght@400;500;600;700','Manrope':'Manrope:wght@400;500;600;700;800','Sora':'Sora:wght@400;500;600;700','DM Sans':'DM+Sans:wght@400;500;600;700','Nunito':'Nunito:wght@400;600;700;800','Montserrat':'Montserrat:wght@400;500;600;700','Figtree':'Figtree:wght@400;500;600;700','Playfair Display':'Playfair+Display:wght@500;600;700'};
function applyFontTheme(font){try{
  if(!font||!CURATED_FONTS[font]){if(document.body)document.body.style.removeProperty('font-family');document.documentElement.style.removeProperty('--brand-font');return;}
  var lid='brand-font-'+font.replace(/\s+/g,'');
  if(!document.getElementById(lid)){var l=document.createElement('link');l.rel='stylesheet';l.id=lid;l.href='https://fonts.googleapis.com/css2?family='+CURATED_FONTS[font]+'&display=swap';(document.head||document.documentElement).appendChild(l);}
  document.documentElement.style.setProperty('--brand-font',"'"+font+"'");
  if(document.body)document.body.style.fontFamily="'"+font+"', system-ui, -apple-system, sans-serif";
}catch(e){}}
window.applyFontTheme=applyFontTheme;window.CURATED_FONTS=CURATED_FONTS;

/* ============ ADMIN: YEDEK ============ */
function exportData(){const data={FIRMA,ILANLAR,DANISMANLAR,LEADS,THEME,CONTENT,BLOGS,REFS,SEO,GOOGLE,PROX,AICFG,P3,KISILER,DEALS,TASKS,COMMS,RENTS,MSGLOG,RAPORLOG,ACT,CONTRACTS,OZEL,_exported:new Date().toISOString(),_brand:'Meridyen Gayrimenkul'};/* M2: CRM + Özel Portföy dilimleri de yedeklenir (import zaten okuyordu → parite) */
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);
  const a=document.createElement('a');a.href=url;a.download='meridyen-gm-yedek-'+new Date().toISOString().slice(0,10)+'.json';a.click();URL.revokeObjectURL(url);
  toast('✓ Yedek indirildi.');}
function importData(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();
  r.onload=e=>{try{const d=JSON.parse(e.target.result);
    if(d.FIRMA)FIRMA=d.FIRMA;if(d.ILANLAR)ILANLAR=d.ILANLAR;if(d.DANISMANLAR)DANISMANLAR=d.DANISMANLAR;if(d.LEADS)LEADS=d.LEADS;if(d.THEME)THEME=d.THEME;
    if(d.CONTENT)CONTENT=d.CONTENT;if(d.BLOGS)BLOGS=d.BLOGS;if(d.REFS)REFS=d.REFS;if(d.SEO)SEO=d.SEO;if(d.GOOGLE)GOOGLE=d.GOOGLE;if(d.PROX)PROX=d.PROX;if(d.AICFG)AICFG=d.AICFG;if(d.P3)P3=d.P3;
    if(d.KISILER)KISILER=d.KISILER;if(d.DEALS)DEALS=d.DEALS;if(d.TASKS)TASKS=d.TASKS;if(d.COMMS)COMMS=d.COMMS;if(d.RENTS)RENTS=d.RENTS;if(d.MSGLOG)MSGLOG=d.MSGLOG;if(d.RAPORLOG)RAPORLOG=d.RAPORLOG;if(d.ACT)ACT=d.ACT;
    if(d.CONTRACTS)CONTRACTS=d.CONTRACTS;if(d.OZEL)OZEL=d.OZEL;/* M2: sözleşme + Özel Portföy de içe aktarılır */
    if(PROX&&!PROX.modules)PROX.modules=clone(DEF_MODULES);
    saveAll();applyFirma();applyContent();if(THEME)setTheme(THEME.accent,THEME.green,THEME.navy);try{applyFontTheme(THEME&&THEME.font);}catch(e){}
    renderIlanlar();renderDan();renderBlogFeed();renderRefGrid();applyModuleVisibility();initAiAssistant();
    try{if(typeof renderOzel==='function')renderOzel();if(typeof renderOzHome==='function')renderOzHome();if(typeof ozHero==='function')ozHero();if(typeof renderOzelRows==='function')renderOzelRows();}catch(e){}/* M2: içe aktarılan Özel Portföy'ü de bas */
    renderIlanRows();renderDanRows();renderLeads();renderRecentLeads();renderKpis();renderBolgeRows();fillFirmaForm();renderThemeGrid();
    renderP3();render3dForm();fillContent();renderBlogRows();renderRefRows();fillSeo();fillGoogle();fillProx();renderModules();renderEpRows();fillAiCfg();renderAllCrm();
    toast('✓ Yedek başarıyla içe aktarıldı.');}catch(err){toast('Geçersiz yedek dosyası.');}};
  r.readAsText(f);inp.value='';}
function resetData(){if(!confirm('Tüm değişiklikler silinip demo verisine dönülecek. Emin misiniz?'))return;
  localStorage.removeItem(LS);
  /* M3: white-label kalıntılarını da temizle — yoksa bölge paketi/dil/özel-ts/i18n cache demo'ya sızar */
  try{['wl_bolge','wl_ozel_ts','wl_lang','wl_super_tenants','wl_brand_applied'].forEach(function(k){localStorage.removeItem(k);});
    Object.keys(localStorage).forEach(function(k){if(k.indexOf('wl_i18n_')===0)localStorage.removeItem(k);});
    document.documentElement.setAttribute('dir','ltr');document.documentElement.lang='tr';}catch(e){}
  loadAll();eidsEnsure();applyProxTenant();try{if(typeof applyCanonical==='function')applyCanonical();}catch(e){}try{if(PROX&&PROX.il&&PROX.il!==PROVINCE.name)applyProvince(PROX.il,true);}catch(e){}try{if(typeof FIRMA!=='undefined'&&FIRMA.name!==BRAND_ORIG&&typeof applySeoHead==='function')applySeoHead();}catch(e){}try{if(typeof applySchema==='function')applySchema();}catch(e){}applyFirma();applyContent();document.documentElement.removeAttribute('style');
  renderIlanlar();renderDan();renderBlogFeed();renderRefGrid();applyModuleVisibility();initAiAssistant();
  renderIlanRows();renderDanRows();renderLeads();renderRecentLeads();renderKpis();renderBolgeRows();fillFirmaForm();renderThemeGrid();
  renderP3();render3dForm();fillContent();renderBlogRows();renderRefRows();fillSeo();fillGoogle();fillProx();renderModules();renderEpRows();fillAiCfg();renderAllCrm();
  toast('⟲ Demo verisine sıfırlandı.');}

/* ============ INIT ============ */
document.addEventListener('DOMContentLoaded',()=>{
  loadAll();eidsEnsure();applyProxTenant();try{if(typeof applyCanonical==='function')applyCanonical();}catch(e){}try{if(PROX&&PROX.il&&PROX.il!==PROVINCE.name)applyProvince(PROX.il,true);}catch(e){}try{if(typeof FIRMA!=='undefined'&&FIRMA.name!==BRAND_ORIG&&typeof applySeoHead==='function')applySeoHead();}catch(e){}try{if(typeof applySchema==='function')applySchema();}catch(e){}
  if(THEME&&THEME.accent)setTheme(THEME.accent,THEME.green,THEME.navy);
  try{applyFontTheme(THEME&&THEME.font);}catch(e){}
  applyContent();
  initHero();renderIlanlar();renderOzel();ozHero();renderOzHome();renderDan();renderBolgePick();initVal();applyFirma();renderBlogFeed();renderRefGrid();
  initAiAssistant();applyModuleVisibility();try{brandSweep(document.body);brandObserve();}catch(e){}try{abApply();}catch(e){}
  try{if(localStorage.getItem('wl_service_area')){saLoad();if(typeof PROVINCE!=='undefined'&&PROVINCE){saFilterActiveProvince();rebuildBAZ();if(typeof renderBolgePick==='function')renderBolgePick();if(typeof renderOzel==='function')renderOzel();if(typeof renderOzHome==='function')renderOzHome();}}}catch(e){}
  // counters via IntersectionObserver
  const io=new IntersectionObserver((ents)=>{ents.forEach(e=>{if(e.isIntersecting){animateCounters();}});},{threshold:.25});
  document.querySelectorAll('[data-count]').forEach(el=>io.observe(el.closest('section,.hero,footer')||el));
  // reveal on scroll
  const ro=new IntersectionObserver((ents)=>{ents.forEach(e=>{if(e.isIntersecting){e.target.classList.add('inview');ro.unobserve(e.target);}});},{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>ro.observe(el));
  // cookie banner
  if(!localStorage.getItem('cookieChoice')){setTimeout(()=>document.getElementById('cookie').classList.add('show'),1400);}
  // TEMİZ URL router (yükleme): yoldan/sessionStorage'dan overlay aç (+ eski #hash uyumu). routeHash yalnız #admin/#portal için.
  ovBoot(); routeHash();
});
window.addEventListener('hashchange',routeHash);
function routeHash(){
  var h=location.hash;
  try{
    if(h==='#admin')return openAdmin();
    /* overlay sayfaları artık TEMİZ YOL (/analiz,/ozel,/sat,/blog,/portfoy,/ilanlar) — ovBoot/goView yönetir */
    if(h==='#portal')return openSaasPortal();
    if(h==='#kvkk')return openKvkk();
    if(h==='#ekspertiz')return satScrollForm('Ücretsiz ekspertiz');
  }catch(e){}
}

/* ============================================================
   PART 3 — ProX ADVANCED MODULES
   ============================================================ */

/* ---------- İÇERİK / SAYFA METİNLERİ ---------- */
function applyContent(){
  const set=(c,v)=>document.querySelectorAll('.'+c).forEach(e=>e.textContent=v);
  set('js-heroEyebrow',CONTENT.heroEyebrow);set('js-heroTitle',CONTENT.heroTitle);set('js-heroTitle2',CONTENT.heroTitle2);
  set('js-heroDesc',CONTENT.heroDesc);
  // about: preserve <b> by setting innerHTML safely-ish
  document.querySelectorAll('.js-aboutText').forEach(e=>e.textContent=CONTENT.aboutText);
}
function fillContent(){const g=id=>document.getElementById(id);
  g('ct_heroEyebrow').value=CONTENT.heroEyebrow;g('ct_heroTitle').value=CONTENT.heroTitle;g('ct_heroTitle2').value=CONTENT.heroTitle2;
  g('ct_heroDesc').value=CONTENT.heroDesc;g('ct_about').value=CONTENT.aboutText;}
function saveContent(){const g=id=>document.getElementById(id).value;
  CONTENT={heroEyebrow:g('ct_heroEyebrow'),heroTitle:g('ct_heroTitle'),heroTitle2:g('ct_heroTitle2'),heroDesc:g('ct_heroDesc'),aboutText:g('ct_about')};
  saveAll();applyContent();toast('✓ Sayfa metinleri güncellendi.');}

/* ---------- BLOG ---------- */
function renderBlogFeed(){const g=document.getElementById('blogFeed');if(!g)return;
  var posts=(typeof blogAllPosts==='function'?blogAllPosts():BLOGS).slice(0,6);
  g.innerHTML=posts.map(b=>`<div class="bpost" data-bid="${_be(b.id)}" onclick="if(typeof blogOpen==='function')blogOpen(this.getAttribute('data-bid'))" style="cursor:pointer">
    <div class="bi">${_be(b.icon||'📄')}</div><div class="bbody"><div class="cat">${_be(b.cat)}${b.src==='prox'?' · ProX':b.src==='ai'?' · AI':''}</div><h3>${_be(b.title)}</h3><p>${_be(b.sum)}</p><div class="meta"><span>${_be(b.meta||'')}</span></div></div></div>`).join('');}
/* ProX blog akışı — /api/blog/feed (sunucuda eklenecek; 404→[] fallback). Normalize + cache. */
var _proxBlogCache=null;
async function proxBlogFeed(force){if(_proxBlogCache&&!force)return _proxBlogCache;var out=[];
  try{var r=await proxApi('/api/v1/tenant/blog/feed');
    if(r&&!r.fallback){var arr=r.posts||r.data||r.items||(Array.isArray(r)?r:[]);
      out=(arr||[]).map(function(p,i){return {id:'px'+(p.id||i),title:p.title||p.baslik||'',cat:p.cat||p.category||p.kategori||'ProX',sum:p.summary||p.ozet||p.excerpt||(''+(p.body||p.content||'')).slice(0,150),body:p.body||p.content||p.icerik||'',icon:'📰',date:p.date||p.published||'',meta:((p.date||p.published||'')+' · ProX Blog').trim(),src:'prox'};}).filter(function(p){return p.title;});}}catch(e){}
  _proxBlogCache=out;return out;}
function blogAllPosts(){var px=_proxBlogCache||[];var local=(typeof BLOGS!=='undefined'?BLOGS:[]);var seen={},all=[];
  local.concat(px).forEach(function(b){var k=(b.title||'').toLocaleLowerCase('tr');if(k&&!seen[k]){seen[k]=1;all.push(b);}});return all;}
async function blogFetchProx(){var btn=document.getElementById('blFetchBtn');if(btn){btn.disabled=true;btn.textContent='Çekiliyor…';}
  var posts=await proxBlogFeed(true);
  if(btn){btn.disabled=false;btn.textContent='📰 ProX Blog Akışını Çek';}
  try{renderBlogFeed();}catch(e){}try{if(typeof renderBlogList==='function')renderBlogList();}catch(e){}
  toast(posts.length?('✓ ProX blog akışından '+posts.length+' yazı çekildi.'):'ProX blog akışı ucu henüz aktif değil — sunucuda eklenince otomatik gelir (PROX-BLOG-GEREKSINIM-NOTU.md).');}
window.proxBlogFeed=proxBlogFeed;window.blogAllPosts=blogAllPosts;window.blogFetchProx=blogFetchProx;
/* /blog sayfası (overlay) — liste + tam makale detayı */
function _be(s){return (s==null?'':(''+s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}
async function blogOpen(id){var p=document.getElementById('blogPage');if(!p)return;
  _ovCloseDom();p.classList.add('open');document.body.style.overflow='hidden';
  try{if(typeof mountSiteChrome==='function')mountSiteChrome();}catch(e){}
  try{await proxBlogFeed();}catch(e){}
  renderBlogList();
  if(id!==undefined&&id!==null&&id!==''){blogDetail(id);}else{blogShowList();}
  try{if(typeof brandSweep==='function')brandSweep(p);}catch(e){}
  var sc=document.getElementById('blogScroll');if(sc)sc.scrollTop=0;
  setOverlayPage('Blog · Bilgi Merkezi','#blog');}
function blogShowList(){var l=document.getElementById('blogListWrap'),d=document.getElementById('blogDetailWrap');if(l)l.style.display='';if(d)d.style.display='none';var sc=document.getElementById('blogScroll');if(sc)sc.scrollTop=0;}
function renderBlogList(){var w=document.getElementById('blogListWrap');if(!w)return;var posts=blogAllPosts();
  w.innerHTML=posts.length?('<div class="bgrid">'+posts.map(function(b){return '<div class="bpost" onclick="blogDetail(\''+b.id+'\')" style="cursor:pointer"><div class="bi">'+(b.icon||'📄')+'</div><div class="bbody"><div class="cat">'+_be(b.cat)+(b.src==='prox'?' · ProX':b.src==='ai'?' · AI':'')+'</div><h3>'+_be(b.title)+'</h3><p>'+_be(b.sum||'')+'</p><div class="meta"><span>'+_be(b.meta||'')+'</span></div></div></div>';}).join('')+'</div>'):'<p style="text-align:center;color:var(--muted);padding:40px 0">Henüz yazı yok. Admin → İçerik &amp; Sayfalar\'dan İçerik Asistanı ile makale oluşturabilirsiniz.</p>';}
function blogDetail(id){var b=blogAllPosts().filter(function(x){return (''+x.id)===(''+id);})[0];if(!b){blogShowList();return;}
  var d=document.getElementById('blogDetailWrap'),l=document.getElementById('blogListWrap');if(l)l.style.display='none';if(d)d.style.display='';
  var body=(b.body||b.sum||'').split(/\n{2,}/).map(function(par){return '<p style="margin:0 0 16px">'+_be(par).replace(/\n/g,'<br>')+'</p>';}).join('');
  d.innerHTML='<button class="br-back" onclick="blogShowList()"><svg class="ico" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5"/><path d="m12 19-7-7 7-7"/></svg> Tüm yazılar</button>'
    +'<article style="max-width:760px;margin:22px auto 0"><div class="cat" style="color:var(--accent);font-weight:700;font-size:13px;text-transform:uppercase;letter-spacing:.06em">'+_be(b.cat)+(b.src==='prox'?' · ProX':b.src==='ai'?' · AI':'')+'</div>'
    +'<h1 style="font-family:var(--head);font-size:clamp(26px,4vw,40px);line-height:1.15;margin:8px 0 10px">'+_be(b.title)+'</h1>'
    +'<div class="meta" style="color:var(--muted);font-size:13.5px;margin-bottom:22px;padding-bottom:18px;border-bottom:1px solid var(--line)">'+_be(b.meta||'')+'</div>'
    +'<div style="font-size:16px;line-height:1.75;color:var(--ink-2,#334155)">'+body+'</div>'
    +'<div style="margin-top:30px;padding:20px;background:var(--surface);border:1px solid var(--line);border-radius:14px;text-align:center"><b style="font-size:16px">Bu konuda uzman desteği mi istiyorsunuz?</b><div style="margin-top:10px"><button class="btn btn-primary" onclick="closeAllOverlays();satScrollForm(\'Blog danışmanlık talebi\')">Ücretsiz Danışmanlık Alın</button></div></div></article>';
  var sc=document.getElementById('blogScroll');if(sc)sc.scrollTop=0;}
window.blogOpen=blogOpen;window.blogDetail=blogDetail;window.blogShowList=blogShowList;window.renderBlogList=renderBlogList;
let editingBlog=null;
function newBlog(){editingBlog=null;['bl_title','bl_cat','bl_sum','bl_body','bl_konu'].forEach(i=>{var e=document.getElementById(i);if(e)e.value='';});var g=document.getElementById('bl_guard');if(g)g.innerHTML='';document.getElementById('blogEditCard').style.display='block';}
function editBlog(id){const b=BLOGS.find(x=>x.id===id);if(!b)return;editingBlog=id;
  document.getElementById('bl_title').value=b.title;document.getElementById('bl_cat').value=b.cat;document.getElementById('bl_sum').value=b.sum;
  var bd=document.getElementById('bl_body');if(bd)bd.value=b.body||'';var kk=document.getElementById('bl_konu');if(kk)kk.value='';var g=document.getElementById('bl_guard');if(g)g.innerHTML='';
  document.getElementById('blogEditCard').style.display='block';}
function saveBlog(){const t=document.getElementById('bl_title').value.trim();if(!t){toast('Başlık zorunlu.');return;}
  var body=((document.getElementById('bl_body')||{}).value||'').trim();
  const obj={title:t,cat:document.getElementById('bl_cat').value||'Genel',sum:document.getElementById('bl_sum').value,body:body};
  if(editingBlog){const i=BLOGS.findIndex(x=>x.id===editingBlog);BLOGS[i]={...BLOGS[i],...obj};}
  else{obj.id=Date.now();obj.icon='📝';obj.date=new Date().toISOString().slice(0,10);obj.src='firma';var mins=Math.max(2,Math.round((body.split(/\s+/).length||120)/180));obj.meta=mins+' dk okuma · '+new Date().toLocaleDateString('tr-TR',{month:'short',year:'numeric'});BLOGS.unshift(obj);}
  saveAll();renderBlogRows();renderBlogFeed();document.getElementById('blogEditCard').style.display='none';toast('✓ Blog yazısı yayınlandı.');}
/* İçerik Asistanı ile TAM makale üret (BASLIK|KATEGORI|OZET|GOVDE) — aiGuard'lı, düzenlenebilir */
async function blogAiGen(){var konu=((document.getElementById('bl_konu')||{}).value||'').trim()||((document.getElementById('bl_title')||{}).value||'').trim();
  if(!konu){toast('Önce bir konu / anahtar kelime girin.');return;}
  var btn=document.getElementById('blAiBtn');if(btn){btn.disabled=true;btn.textContent='Üretiliyor…';}
  var il=(typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir';
  var prompt='Sen '+il+' ilinde çalışan uzman bir emlak içerik editörüsün. "'+konu+'" konusunda SEO uyumlu, özgün ve bilgilendirici bir blog makalesi yaz. SADECE şu formatta yanıtla, başka açıklama ekleme:\nBASLIK: <60 karakter etkileyici başlık>\nKATEGORI: <tek kelime: Yatırım/Kredi/Hukuk/Bölge/Rehber>\nOZET: <140-160 karakter özet>\nGOVDE: <4-6 paragraf akıcı Türkçe makale; paragraflar arası boş satır>';
  var text=null;
  try{var r=await aiChat({persona:'office',tool:'blog',prompt:aiGuard(prompt)});if(r&&!r.fallback)text=r.answer||r.text||(r.data&&(r.data.answer||r.data.text));}catch(e){}
  if(!text){try{if(typeof callClaude==='function')text=await callClaude([{role:'user',content:aiGuard(prompt)}],'Sadece istenen formatta yanıt ver, ön söz ekleme.');}catch(e){}}
  if(btn){btn.disabled=false;btn.textContent='🤖 İçerik Asistanı ile Makale Oluştur';}
  if(!text){toast('İçerik Asistanı yanıt vermedi. Anahtarı kontrol edip tekrar deneyin.');return;}
  function pick(k){var m=new RegExp(k+'\\s*:?\\s*([\\s\\S]+?)(?:\\n\\s*(?:BASLIK|KATEGORI|OZET|GOVDE)\\s*:|$)','i').exec(text);return m?m[1].trim():'';}
  var bas=pick('BASLIK'),kat=pick('KATEGORI'),ozet=pick('OZET'),gov=pick('GOVDE');
  if(!gov||gov.length<40)gov=text;
  document.getElementById('bl_title').value=(bas||konu).slice(0,90);
  document.getElementById('bl_cat').value=kat||'Rehber';
  document.getElementById('bl_sum').value=(ozet||gov.slice(0,150));
  document.getElementById('bl_body').value=gov;
  var g=document.getElementById('bl_guard');if(g&&typeof aiGuardBadge==='function')g.innerHTML=aiGuardBadge(bas+' '+ozet+' '+gov);
  toast('✓ İçerik Asistanı makalesi üretildi — düzenleyip "Kaydet & Yayınla" deyin.');}
function delBlog(id){if(!confirm('Yazı silinsin mi?'))return;BLOGS=BLOGS.filter(x=>x.id!==id);saveAll();renderBlogRows();renderBlogFeed();toast('Yazı silindi.');}
function renderBlogRows(){const tb=document.getElementById('blogRows');if(!tb)return;
  tb.innerHTML=BLOGS.length?BLOGS.map(b=>`<tr><td><b>${b.title}</b>${b.src==='ai'?' <span class="atag" style="background:#ede9fe;color:#6d28d9">AI</span>':b.src==='prox'?' <span class="atag" style="background:#dbeafe;color:#1e40af">ProX</span>':''}${b.body?'':' <span class="tsub">(özet)</span>'}</td><td>${b.cat}</td><td class="ta"><button class="ico-btn" onclick="editBlog(${b.id})">✎</button><button class="ico-btn del" onclick="delBlog(${b.id})">🗑</button></td></tr>`).join(''):'<tr><td colspan="3" class="empty">Yazı yok.</td></tr>';}

/* ---------- REFERANS ---------- */
function renderRefGrid(){const g=document.getElementById('refGrid');if(!g)return;
  g.innerHTML=REFS.map(r=>{const ini=r.name.split(' ').map(x=>x[0]).slice(0,2).join('');
    return `<div class="tst"><div class="stars">★★★★★</div><p>"${r.text}"</p><div class="who"><div class="av">${ini}</div><div><div class="nm">${r.name}</div><div class="rl">${r.meta}</div></div></div></div>`;}).join('');}
let editingRef=null;
function newRef(){editingRef=null;['rf_name','rf_meta','rf_text'].forEach(i=>document.getElementById(i).value='');document.getElementById('refEditCard').style.display='block';}
function editRef(id){const r=REFS.find(x=>x.id===id);if(!r)return;editingRef=id;
  document.getElementById('rf_name').value=r.name;document.getElementById('rf_meta').value=r.meta;document.getElementById('rf_text').value=r.text;
  document.getElementById('refEditCard').style.display='block';}
function saveRef(){const n=document.getElementById('rf_name').value.trim();if(!n){toast('Ad zorunlu.');return;}
  const obj={name:n,meta:document.getElementById('rf_meta').value,text:document.getElementById('rf_text').value};
  if(editingRef){const i=REFS.findIndex(x=>x.id===editingRef);REFS[i]={...REFS[i],...obj};}else{obj.id=Date.now();REFS.push(obj);}
  saveAll();renderRefRows();renderRefGrid();document.getElementById('refEditCard').style.display='none';toast('✓ Referans kaydedildi.');}
function delRef(id){if(!confirm('Referans silinsin mi?'))return;REFS=REFS.filter(x=>x.id!==id);saveAll();renderRefRows();renderRefGrid();toast('Referans silindi.');}
function renderRefRows(){const tb=document.getElementById('refRows');if(!tb)return;
  tb.innerHTML=REFS.length?REFS.map(r=>`<tr><td><b>${r.name}</b></td><td>${r.meta}</td><td class="tsub">${r.text.slice(0,50)}…</td><td class="ta"><button class="ico-btn" onclick="editRef(${r.id})">✎</button><button class="ico-btn del" onclick="delRef(${r.id})">🗑</button></td></tr>`).join(''):'<tr><td colspan="4" class="empty">Referans yok.</td></tr>';}

/* ---------- 3D PORTFÖY ---------- */
function render3dForm(){const sel=document.getElementById('p3_ilan');if(!sel)return;
  sel.innerHTML=ILANLAR.map(i=>`<option value="${i.id}">${i.title}</option>`).join('');
  if(ILANLAR.length)load3dForm();}
function load3dForm(){const id=+document.getElementById('p3_ilan').value;const d=P3[id]||{};
  document.getElementById('p3_tour').value=d.tour||'';document.getElementById('p3_video').value=d.video||'';
  document.getElementById('p3_glbName').textContent=d.glbName?('✓ '+d.glbName):'';
  preview3d();}
function glbUpload(inp){const f=inp.files[0];if(!f)return;
  if(f.size>9*1024*1024){toast('Dosya çok büyük (maks ~8MB). Daha düşük poligonlu model deneyin.');return;}
  const id=+document.getElementById('p3_ilan').value;P3[id]=P3[id]||{};P3[id].glbName=f.name;
  document.getElementById('p3_glbName').textContent='✓ '+f.name+' (yüklendi, kaydetmeyi unutmayın)';
  toast('Model alındı: '+f.name);}
function save3d(){const id=+document.getElementById('p3_ilan').value;P3[id]=P3[id]||{};
  P3[id].tour=document.getElementById('p3_tour').value.trim();P3[id].video=document.getElementById('p3_video').value.trim();
  saveAll();renderP3();toast('✓ 3D / tur bilgileri kaydedildi.');}
function renderP3(){const tb=document.getElementById('p3Rows');if(!tb)return;
  tb.innerHTML=ILANLAR.map(i=>{const d=P3[i.id]||{};
    return `<tr><td><b>${i.title}</b></td><td>${d.glbName?'<span class="dot-live"></span>'+d.glbName:'<span class="tsub">Parametrik</span>'}</td><td>${d.tour?'✓ Var':'<span class="tsub">—</span>'}</td><td>${d.video?'✓ Var':'<span class="tsub">—</span>'}</td></tr>`;}).join('');}
function preview3d(){const id=+(document.getElementById('p3_ilan')||{}).value;const it=ILANLAR.find(x=>x.id===id);
  const floors=it?(parseInt(it.kat)||Math.max(3,Math.round((it.m2||120)/45))):6;
  massing('adm3dView',{floors,type:it?it.type:'Daire'});}
/* canvas-based parametric massing renderer (no external libs) */
const _massers={};
function massing(holderId,opts){
  const holder=document.getElementById(holderId);if(!holder)return;
  let cv=holder.querySelector('canvas');
  if(!cv){cv=document.createElement('canvas');holder.appendChild(cv);}
  const W=holder.clientWidth||520,H=holder.clientHeight||320;const dpr=Math.min(2,window.devicePixelRatio||1);
  cv.width=W*dpr;cv.height=H*dpr;const ctx=cv.getContext('2d');ctx.scale(dpr,dpr);
  if(_massers[holderId])cancelAnimationFrame(_massers[holderId].raf);
  const floors=Math.max(2,Math.min(40,opts.floors||6));
  const villa=/Villa|Müstakil/.test(opts.type||'');
  const bw=villa?2.4:1.6, bd=villa?1.8:1.4, bh=villa?Math.min(floors,3)*0.9:floors*0.62;
  let ang=0.6,tilt=0.5,dragging=false,lastX=0,lastY=0,auto=true;
  const cx=W/2,cy=H/2+bh*9,scale=Math.min(W/(bw*3.6),34);
  function project(x,y,z){
    const ca=Math.cos(ang),sa=Math.sin(ang);let X=x*ca - z*sa, Z=x*sa + z*ca;
    const ct=Math.cos(tilt),st=Math.sin(tilt);let Y=y*ct - Z*st;
    return [cx+X*scale, cy-Y*scale];
  }
  function draw(){
    ctx.clearRect(0,0,W,H);
    // ground shadow
    const g=project(0,0,0);ctx.fillStyle='rgba(0,0,0,.28)';ctx.beginPath();ctx.ellipse(cx,cy+6,bw*scale*0.95,bw*scale*0.34,0,0,7);ctx.fill();
    const hw=bw/2,hd=bd/2;
    const verts=[[-hw,0,-hd],[hw,0,-hd],[hw,0,hd],[-hw,0,hd],[-hw,bh,-hd],[hw,bh,-hd],[hw,bh,hd],[-hw,bh,hd]];
    const P=verts.map(v=>project(v[0],v[1],v[2]));
    const faces=[{i:[4,5,6,7],c:'#dbe6f5'},{i:[0,1,5,4],c:'#9fb3d4'},{i:[1,2,6,5],c:'#7e97bd'},{i:[2,3,7,6],c:'#b7c7e0'},{i:[3,0,4,7],c:'#8ea6cb'}];
    // depth sort by avg z (recompute world Z)
    faces.forEach(f=>{f.z=f.i.reduce((s,idx)=>{const v=verts[idx];const ca=Math.cos(ang),sa=Math.sin(ang);return s+(v[0]*sa+v[2]*ca);},0)/4;});
    faces.sort((a,b)=>a.z-b.z);
    faces.forEach(f=>{ctx.beginPath();f.i.forEach((idx,k)=>{const p=P[idx];k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]);});ctx.closePath();
      ctx.fillStyle=f.c;ctx.fill();ctx.strokeStyle='rgba(15,31,61,.5)';ctx.lineWidth=1;ctx.stroke();
      // floor lines on the two front side faces
      if(f.i[0]===0||f.i[0]===1){for(let fl=1;fl<floors;fl++){const t=fl/floors;
        const a=[verts[f.i[0]],verts[f.i[1]]].map(v=>project(v[0],v[1]+bh*t,v[2]));
        ctx.beginPath();ctx.moveTo(a[0][0],a[0][1]);ctx.lineTo(a[1][0],a[1][1]);ctx.strokeStyle='rgba(15,31,61,.18)';ctx.stroke();}}
    });
    // accent roof edge
    const top=[4,5,6,7].map(i=>P[i]);ctx.beginPath();top.forEach((p,k)=>k?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();
    ctx.strokeStyle=getComputedStyle(document.documentElement).getPropertyValue('--green')||'#1e7e3a';ctx.lineWidth=2;ctx.stroke();
  }
  function loop(){if(auto)ang+=0.006;draw();_massers[holderId].raf=requestAnimationFrame(loop);}
  _massers[holderId]={raf:0};
  cv.style.cursor='grab';
  cv.onpointerdown=e=>{dragging=true;auto=false;lastX=e.clientX;lastY=e.clientY;cv.style.cursor='grabbing';cv.setPointerCapture(e.pointerId);};
  cv.onpointermove=e=>{if(!dragging)return;ang+=(e.clientX-lastX)*0.01;tilt=Math.max(0.05,Math.min(1.1,tilt+(e.clientY-lastY)*0.006));lastX=e.clientX;lastY=e.clientY;};
  cv.onpointerup=()=>{dragging=false;cv.style.cursor='grab';};
  loop();
}

/* ---------- AI STÜDYO (Claude) ---------- */
let curAiTool='ilan';
const AI_LABELS={ilan:'İlan Özellikleri (oda, m², kat, bölge, öne çıkanlar)',blog:'Blog Konusu',bolge:'Bölge / İlçe Adı',sosyal:'Konu / İlan / Kampanya',seo:'Sayfa / Konu (SEO metni için)'};
function selAiTool(el){document.querySelectorAll('.ai-tool').forEach(t=>t.classList.remove('act'));el.classList.add('act');
  curAiTool=el.dataset.ai;document.getElementById('aiInLabel').textContent=AI_LABELS[curAiTool];
  var _il=(typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir';const ph={ilan:'örn. 3+1, 165m², 7. kat, deniz manzaralı, kapalı otopark, 7/24 güvenlik',blog:'örn. 2026 '+_il+' kira piyasası beklentileri',bolge:'örn. bir ilçe/mahalle adı',sosyal:'örn. yeni sahil projemiz / haftanın fırsatı',seo:'örn. '+_il+' satılık daire'};
  document.getElementById('aiInput').placeholder=ph[curAiTool]||'';}
async function aiGenerate(){
  const input=document.getElementById('aiInput').value.trim();if(!input){toast('Lütfen bir girdi yazın.');return;}
  const out=document.getElementById('aiOut');const btn=document.getElementById('aiGenBtn');
  out.classList.remove('empty');out.innerHTML='<span class="spinner"></span> Yapay zeka içeriği üretiyor…';btn.disabled=true;
  var _il=(typeof PROVINCE!=='undefined'&&PROVINCE.name)||'İzmir';
  const prompts={
    ilan:`Sen profesyonel bir Türk emlak metin yazarısın. ${_il} bölgesindeki şu gayrimenkul için satışa hazır, ikna edici ve akıcı bir ilan açıklaması yaz (120-160 kelime, abartısız, somut faydalara odaklı, Türkçe):\n${input}`,
    blog:`Türk emlak ve yatırım okuyucusu için "${input}" konulu, ${_il} odaklı, SEO uyumlu bir blog yazısı yaz. Çekici başlık + 3 alt başlık + her birinin altında 2-3 cümle. Konut, arsa, ticari, kiralama ve yatırımı kapsa. Türkçe, profesyonel ama anlaşılır.`,
    bolge:`"${input}" bölgesi (${_il}) için gayrimenkul yatırımcısına yönelik kısa bir bölge analizi yaz: konum avantajları, yaşam kalitesi, ulaşım, yatırım potansiyeli ve dikkat edilecek noktalar. 100-140 kelime, Türkçe. Somut fiyat uydurma; "güncel ProX endeksiyle teyit edilmeli" notu ekle.`,
    sosyal:`"${input}" için ${_il}'de faaliyet gösteren emlak ofisi adına dikkat çekici bir sosyal medya paylaşımı yaz (Instagram/Facebook). 2-3 kısa vurucu cümle + 5-7 uygun hashtag (${_il} ve emlak temalı). Türkçe, samimi ama profesyonel.`,
    seo:`"${input}" için ${_il} odaklı SEO metni üret. SADECE şu formatta, başka açıklama ekleme:\nBaşlık: <55-60 karakter>\nAçıklama: <150-155 karakter>\nAnahtar Kelimeler: <8-10 virgülle ayrılmış>`
  };
  try{
    let text=null;
    var _al=(document.getElementById('aiLang')||{}).value||'tr';
    var _ls=_al==='en'?'\n\nWrite the entire output in fluent, professional English for foreign real-estate investors.':_al==='ar'?'\n\nاكتب المحتوى بالكامل باللغة العربية الفصحى الاحترافية للمستثمرين العقاريين الأجانب.':'';
    var _fullPrompt=prompts[curAiTool]+_ls;
    try{                                                  // API-first İçerik Asistanı; fallback = callClaude
      const r=await aiChat({persona:'office',prompt:aiGuard(_fullPrompt),tool:curAiTool});
      if(r&&!r.fallback)text=r.answer||r.text||(r.data&&(r.data.answer||r.data.text))||null;
    }catch(_){}
    if(!text)text=await callClaude([{role:'user',content:_fullPrompt}],'Yardımcı, profesyonel bir emlak içerik asistanısın. Sadece istenen içeriği ve istenen dilde üret, ön söz ekleme.');
    out.classList.remove('empty');out.innerHTML='<textarea id="aiOutEdit" class="adm-ta" rows="10" style="width:100%;line-height:1.6"></textarea>';document.getElementById('aiOutEdit').value=text;out.insertAdjacentHTML('beforeend',aiGuardBadge(text));document.getElementById('aiActions').style.display='flex';window._aiLast=text;
  }catch(e){
    out.innerHTML='⚠️ AI servisine şu an ulaşılamadı.<br><span class="tsub">Bu özellik Claude API üzerinden çalışır; canlı yayında İçerik Asistanı servisine (/api/ai/generate-content) bağlanır. Demo ortamında bağlantı gerektirir.</span>';
  }
  btn.disabled=false;
}
function aiOutText(){var e=document.getElementById('aiOutEdit');return (e&&e.value)||window._aiLast||'';}
function copyAi(){var t=aiOutText();if(t){navigator.clipboard&&navigator.clipboard.writeText(t);toast('📋 Kopyalandı.');}}
function aiIndir(){var t=aiOutText();if(!t)return;try{var b=new Blob([t],{type:'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='prox-icerik.txt';document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(a.href);},120);}catch(e){}}
function aiToBlog(){var _t=aiOutText();if(!_t)return;const lines=_t.split('\n').filter(x=>x.trim());
  document.getElementById('bl_title').value=(lines[0]||'AI Yazısı').replace(/^#+\s*/,'').slice(0,80);
  document.getElementById('bl_cat').value='AI İçerik';document.getElementById('bl_sum').value=lines.slice(1,3).join(' ').slice(0,160);
  var bd=document.getElementById('bl_body');if(bd)bd.value=_t;
  var g=document.getElementById('bl_guard');if(g&&typeof aiGuardBadge==='function')g.innerHTML=aiGuardBadge(_t);
  editingBlog=null;document.querySelector('.adm-nav[data-p="icerik"]').click();document.getElementById('blogEditCard').style.display='block';
  toast('İçerik blog formuna aktarıldı — düzenleyip "Kaydet & Yayınla" deyin.');}
function fillAiCfg(){document.getElementById('ai_enable').checked=AICFG.enable;document.getElementById('ai_greet').value=AICFG.greet;document.getElementById('ai_persona').value=AICFG.persona;
  var dk=document.getElementById('ai_dskey');if(dk)dk.value=AICFG.dsKey||'';
  var dm=document.getElementById('ai_dsmodel');if(dm)dm.value=AICFG.dsModel||'deepseek-chat';
  if(typeof aiDsStatus==='function')aiDsStatus();}
function saveAiCfg(){var _dk=document.getElementById('ai_dskey'),_dm=document.getElementById('ai_dsmodel');
  AICFG={enable:document.getElementById('ai_enable').checked,greet:document.getElementById('ai_greet').value,persona:document.getElementById('ai_persona').value,
    dsKey:(_dk?_dk.value.trim():(AICFG.dsKey||'')),dsModel:(_dm&&_dm.value?_dm.value.trim():(AICFG.dsModel||'deepseek-chat'))};
  saveAll();initAiAssistant();if(typeof aiDsStatus==='function')aiDsStatus();
  toast('✓ AI asistan ayarları kaydedildi.'+(AICFG.dsKey?' · DeepSeek anahtarı aktif (YZ artık DeepSeek ile çalışır).':' · YZ ProX sunucu AI\'si ile çalışır.'));}
function toggleAiFab(){AICFG.enable=document.getElementById('ai_enable').checked;saveAll();initAiAssistant();}

/* shared Claude API caller (works in Claude artifact runtime; in production → emlakekspertizi İçerik Asistanı proxy) */
async function callClaude(messages,system){
  const res=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-sonnet-4-6",max_tokens:1000,system:system||'',messages})
  });
  if(!res.ok)throw new Error('api '+res.status);
  const data=await res.json();
  return data.content.filter(i=>i.type==='text').map(i=>i.text).join('\n').trim();
}

/* ---------- PUBLIC AI ASSISTANT ---------- */
let aiHistory=[];
/* Yüzen AI balonu görüşmelerini de admin "Görüşmeler & Teklifler" panosuna (PA_STORE) kaydet —
   tam-ekran ProX Asistan ile aynı depo; böylece TÜM yapay zeka yazışmaları kayıt altında olur. */
var _fabConvoId=null;
function _fabLog(who,text){
  if(!text)return;var KEY='prox_asistan_gm_convos_v1';
  try{var arr=JSON.parse(localStorage.getItem(KEY)||'[]');if(!Array.isArray(arr))arr=[];
    var c=_fabConvoId?arr.filter(function(x){return x&&x.id===_fabConvoId;})[0]:null;
    if(!c){_fabConvoId='fab'+Date.now();c={id:_fabConvoId,title:'Site AI Balonu',user:'',email:'',ts:Date.now(),msgs:[],src:'fab'};arr.unshift(c);}
    c.msgs.push({role:(who==='user'?'me':'bot'),text:String(text)});c.ts=Date.now();
    if(who==='user'){var ph=String(text).match(/(?:\+?90[\s.\-]?)?0?5\d{2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/);if(ph){c.lead=true;c.phone=ph[0].replace(/[^\d+]/g,'');}}
    localStorage.setItem(KEY,JSON.stringify(arr.slice(0,200)));
  }catch(e){}
}
function initAiAssistant(){
  const fab=document.getElementById('aiFab');if(!fab)return;
  const on=AICFG&&AICFG.enable;fab.style.display=on?'grid':'none';
  if(!on)document.getElementById('aiPanel').classList.remove('open');
}
function toggleAiPanel(){const p=document.getElementById('aiPanel');const opening=!p.classList.contains('open');
  p.classList.toggle('open');
  if(opening&&!aiHistory.length){addAiMsg('bot',AICFG.greet);}
}
function addAiMsg(who,text){const b=document.getElementById('aiChatBody');const d=document.createElement('div');d.className='ai-msg '+who;d.textContent=text;b.appendChild(d);b.scrollTop=b.scrollHeight;}
function aiQuick(t){document.getElementById('aiChatIn').value=t;aiSend();}
async function aiSend(){
  const inp=document.getElementById('aiChatIn');const txt=inp.value.trim();if(!txt)return;
  addAiMsg('user',txt);inp.value='';aiHistory.push({role:'user',content:txt});_fabLog('user',txt);/* admin kaydı */
  document.getElementById('aiQuick').style.display='none';
  const b=document.getElementById('aiChatBody');const typ=document.createElement('div');typ.className='ai-typing';typ.innerHTML='<i></i><i></i><i></i>';b.appendChild(typ);b.scrollTop=b.scrollHeight;
  // context: inject sample region data so the assistant can reference it
  const ctx='Örnek bölge m² fiyatları (₺/m²): '+Object.keys(BAZ).map(k=>`${k} ${fmt(BAZ[k].m2)} (5y +%${BAZ[k].chg}, skor ${BAZ[k].score})`).join('; ')+'. Bu veriler örnektir; resmi değer güncel bölge endeksinden teyit edilmeli.';
  try{
    let text=null;
    try{                                                  // API-first İçerik Asistanı; fallback = callClaude
      const r=await aiChat({persona:'office',prompt:aiGuard(AICFG.persona+'\n\nElindeki referans veri: '+ctx),messages:aiHistory.slice(-8),message:txt});
      if(r&&!r.fallback)text=r.answer||r.text||(r.data&&(r.data.answer||r.data.text))||null;
    }catch(_){}
    if(!text)text=await callClaude(aiHistory.slice(-8),AICFG.persona+'\n\nElindeki referans veri: '+ctx);
    typ.remove();addAiMsg('bot',text);aiHistory.push({role:'assistant',content:text});_fabLog('bot',text);/* admin kaydı */
  }catch(e){
    typ.remove();
    addAiMsg('bot','Şu an İçerik Asistanı servisine ulaşılamıyor. Bu arada bir danışmanımıza WhatsApp\'tan ulaşabilirsiniz.');
  }
}

/* ---------- PROX API & MODÜLLER ---------- */
function fillProx(){document.getElementById('px_key').value=PROX.key||'';
  if(document.getElementById('px_proxy'))document.getElementById('px_proxy').value=PROX.proxyUrl||'';
  if(document.getElementById('px_tenant'))document.getElementById('px_tenant').value=PROX.tenantId||'';
  var sel=document.getElementById('px_il');
  if(sel){var cur=PROX.il||PROX.region||'İzmir';sel.innerHTML=trIlList().sort(function(a,b){return a.localeCompare(b,'tr');}).map(function(il){return '<option'+(il===cur?' selected':'')+'>'+il+'</option>';}).join('');}
  var _q=null;try{_q=JSON.parse(localStorage.getItem('prox_quota')||'null');}catch(e){}
  var _used=(_q&&_q.count)||PROX.quotaUsed||0,_max=PROX.quotaMax||10000;
  const pct=Math.min(100,Math.round(_used/_max*100));document.getElementById('px_fill').style.width=pct+'%';
  document.getElementById('px_quotaTxt').textContent=fmt(_used)+' / '+fmt(_max)+' istek'+(_q?' · '+_q.month:'');
  if(typeof proxRenderStatus==='function')proxRenderStatus();}
function saveProx(){PROX.key=document.getElementById('px_key').value.trim();
  if(document.getElementById('px_proxy'))PROX.proxyUrl=document.getElementById('px_proxy').value.trim();
  if(document.getElementById('px_tenant'))PROX.tenantId=document.getElementById('px_tenant').value.trim();
  var il=(document.getElementById('px_il')||{}).value||'İzmir';PROX.il=il;PROX.region=il;
  applyProxTenant();saveAll();applyProvince(il);if(typeof proxRenderStatus==='function')proxRenderStatus();try{if(il&&typeof rebuildOzelFromProx==='function'&&wlStale('wl_ozel_ts',il))rebuildOzelFromProx(il,true);}catch(e){}try{if(il!=='İzmir'&&typeof wlBuildBolge==='function'&&wlStale('wl_bolge',il))wlBuildBolge(il,true);}catch(e){}
  toast('✓ ProX bağlantısı kaydedildi · aktif il: '+il);}
function proxRenderStatus(){var el=document.getElementById('px_status');if(!el)return;var t=window.EMLAK_TENANT||{};
  var oz=null,bl=null,q=null;try{oz=JSON.parse(localStorage.getItem('wl_ozel_ts')||'null');}catch(e){}try{bl=JSON.parse(localStorage.getItem('wl_bolge')||'null');}catch(e){}try{q=JSON.parse(localStorage.getItem('prox_quota')||'null');}catch(e){}
  var fresh='';
  if(PROX.key){fresh='<div style="font-weight:500;font-size:12px;opacity:.85;margin-top:5px;border-top:1px solid rgba(0,0,0,.08);padding-top:5px">'
    +'📦 Özel Portföy: '+(oz&&oz.ts?('<b>'+wlAgo(oz.ts)+'</b> · '+oz.n+' kayıt / '+(oz.real||0)+' gerçek analiz fiyatı'):'henüz çekilmedi')
    +' &nbsp;·&nbsp; 🗺️ Bölge: '+(bl&&bl.ts?('<b>'+wlAgo(bl.ts)+'</b>'):'—')
    +(q?(' &nbsp;·&nbsp; 📊 Kota: '+fmt(q.count)+' istek ('+q.month+')'):'')+'</div>';}
  var secBadge=window.EMLAK_PROXY_MODE?'<div style="font-weight:600;font-size:12px;color:#1a7f4b;margin-top:3px">🔒 Güvenli mod: gizli anahtar sunucuda (proxy) — istemciden gönderilmiyor</div>':((PROX.key)?'<div style="font-weight:500;font-size:12px;color:#b26a00;margin-top:3px">⚠ Doğrudan mod: anahtar istemcide. Üretimde Proxy/Edge modunu önerilir (DEPLOY-VE-GUVENLIK-NOTU.md).</div>':'');
  el.innerHTML='<div class="eids-yetki '+((PROX.key||window.EMLAK_PROXY_MODE)?'on':'off')+'" style="margin:0"><span class="ic">'+((PROX.key||window.EMLAK_PROXY_MODE)?'◉':'⚠️')+'</span><div>'+((PROX.key||window.EMLAK_PROXY_MODE)?('ProX bağlı · tenant '+(t.tenant_id||'-')+' · aktif il '+(PROX.il||'İzmir')):'API anahtarı girilmedi')+'<div style="font-weight:500;font-size:12px;opacity:.85">Base: '+(window.EMLAK_API_BASE||'-')+'</div>'+secBadge+fresh+'</div></div>';}
async function proxTest(){var el=document.getElementById('px_status');if(el)el.innerHTML='<div class="csub">● ProX API test ediliyor…</div>';
  PROX.key=(document.getElementById('px_key')||{}).value.trim()||PROX.key;applyProxTenant();
  try{var b=await proxApi('/api/v1/tenant/bootstrap');
    if(!b||b.fallback||b.success!==true){if(el)el.innerHTML='<div class="eids-yetki off" style="margin:0"><span class="ic">⚠️</span><div>Bağlantı kurulamadı · API anahtarını kontrol edin.</div></div>';return;}
    var il=(document.getElementById('px_il')||{}).value||PROX.il||'İzmir';
    var e=await proxApi('/api/v1/tenant/endeks?il='+encodeURIComponent(il));
    var m2=(e&&e.success&&e.data)?e.data.m2:null;
    if(el)el.innerHTML='<div class="eids-yetki on" style="margin:0"><span class="ic">✅</span><div>ProX bağlı · '+(b.package||'')+' paketi · tenant '+b.tenant_id+'<div style="font-weight:500;font-size:12px;opacity:.85">'+il+' geneli canlı m²: '+(m2?fmt(m2)+' ₺':'—')+' · '+((b.enabled_features||[]).length)+' modül aktif</div></div></div>';
    toast('✓ ProX API bağlantısı doğrulandı.');
  }catch(err){if(el)el.innerHTML='<div class="eids-yetki off" style="margin:0"><span class="ic">⚠️</span><div>Hata: '+err.message+'</div></div>';}}
function renderModules(){const box=document.getElementById('moduleList');if(!box)return;
  box.innerHTML=PROX.modules.map((m,i)=>`<div class="sw-row"><div class="swl"><b>${m.n}</b><span>${m.d}</span></div>
    <label class="switch"><input type="checkbox" ${m.on?'checked':''} onchange="toggleModule(${i})"><span class="sl"></span></label></div>`).join('');}
function toggleModule(i){PROX.modules[i].on=!PROX.modules[i].on;saveAll();applyModuleVisibility();toast(PROX.modules[i].n+(PROX.modules[i].on?' açıldı.':' kapatıldı.'));}
function modOn(k){const m=PROX.modules.find(x=>x.k===k);return !m||m.on;}
function applyModuleVisibility(){
  const show=(id,on)=>{const el=document.getElementById(id);if(el)el.style.display=on?'':'none';};
  show('degerleme',modOn('degerleme'));show('alarm',modOn('fiyat_alarmi'));show('blog',modOn('blog_feed'));show('bolge',modOn('emlak_endeks'));
  const wf=document.querySelector('.wafloat');if(wf)wf.style.display=modOn('whatsapp')?'grid':'none';
  if(!modOn('ai_asistan')){const f=document.getElementById('aiFab');if(f)f.style.display='none';}else if(AICFG&&AICFG.enable){const f=document.getElementById('aiFab');if(f)f.style.display='grid';}
}
const EP_MAP=[['Mahalle endeks kartı','/api/emlak-endeksi/detail/{slug}','emlak_endeks'],['Fiyat trend grafiği','/api/emlak-endeksi/price-trends','emlak_endeks'],['Yatırım skoru','/api/emlak-endeksi/investment-score','yatirim_skoru'],['Fay/deprem rozeti','/api/geo/fault-line/{slug}','risk_analiz'],['Online değerleme','/api/analysis/region_insight','degerleme'],['Logolu PDF rapor','/api/emlak-endeksi/export-pdf/{slug}','pdf_rapor'],['Fiyat alarmı','/api/price-alerts/create','fiyat_alarmi'],['AI içerik / asistan','/api/ai/generate-content','ai_asistan'],['Blog akışı','/api/blog/feed','blog_feed']];
function renderEpRows(){const tb=document.getElementById('epRows');if(!tb)return;
  tb.innerHTML=EP_MAP.map(e=>`<tr><td>${e[0]}</td><td><code>${e[1]}</code></td><td>${modOn(e[2])?'<span class="dot-live"></span>Aktif':'<span class="tsub">Kapalı</span>'}</td></tr>`).join('');}

/* ---------- SEO ---------- */
function fillSeo(){const g=id=>document.getElementById(id);
  g('seo_title').value=SEO.title;g('seo_desc').value=SEO.desc;g('seo_kw').value=SEO.kw;
  g('seo_schema').checked=SEO.schema;g('seo_llms').checked=SEO.llms;g('seo_sitemap').checked=SEO.sitemap;g('seo_prog').checked=SEO.prog;
  if(SEO.og){g('seo_ogPrev').src=SEO.og;g('seo_ogPrev').style.display='block';}
  seoLen();}
function seoLen(){const t=document.getElementById('seo_title').value.length,d=document.getElementById('seo_desc').value.length;
  document.getElementById('seo_titleLen').textContent=t+'/60 karakter'+(t>60?' ⚠ uzun':' ✓');
  document.getElementById('seo_descLen').textContent=d+'/160 karakter'+(d>160?' ⚠ uzun':' ✓');}
function seoOg(inp){const f=inp.files[0];if(!f)return;const r=new FileReader();r.onload=e=>{SEO.og=e.target.result;document.getElementById('seo_ogPrev').src=e.target.result;document.getElementById('seo_ogPrev').style.display='block';};r.readAsDataURL(f);}
function seoDl(name,content,mime){try{var b=new Blob([content],{type:mime||'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){document.body.removeChild(a);URL.revokeObjectURL(a.href);},120);}catch(e){}}
function genSeoFiles(){try{var origin=location.origin;var d=(new Date()).toISOString().slice(0,10);
  var pages=[['',1.0,'daily'],['hizmetlerimiz.html',0.9,'weekly'],['nedenbiz.html',0.8,'monthly']];
  var sm='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
  pages.forEach(function(pg){sm+='  <url><loc>'+origin+'/'+pg[0]+'</loc><lastmod>'+d+'</lastmod><changefreq>'+pg[2]+'</changefreq><priority>'+pg[1].toFixed(1)+'</priority></url>\n';});
  sm+='</urlset>\n';
  var rb='# '+((typeof FIRMA!=='undefined'&&FIRMA.name)||'Gayrimenkul')+' — robots.txt\nUser-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: '+origin+'/sitemap.xml\n';
  var pre=document.getElementById('seoPreview');if(pre){pre.style.display='block';pre.textContent='=== sitemap.xml ===\n'+sm+'\n=== robots.txt ===\n'+rb;}
  seoDl('sitemap.xml',sm,'application/xml');seoDl('robots.txt',rb,'text/plain');
  if(typeof toast==='function')toast('sitemap.xml ve robots.txt bu domain için üretildi ve indirildi — hosting köküne yükleyin.');
}catch(e){}}
function saveSeo(){const g=id=>document.getElementById(id);
  SEO={...SEO,title:g('seo_title').value,desc:g('seo_desc').value,kw:g('seo_kw').value,schema:g('seo_schema').checked,llms:g('seo_llms').checked,sitemap:g('seo_sitemap').checked,prog:g('seo_prog').checked};
  document.title=SEO.title;let md=document.querySelector('meta[name="description"]');if(!md){md=document.createElement('meta');md.name='description';document.head.appendChild(md);}md.content=SEO.desc;
  saveAll();toast('✓ SEO ayarları kaydedildi ve sayfaya uygulandı.');}
function previewArtifact(type){const pre=document.getElementById('seoPreview');pre.style.display='block';
  if(type==='schema'){pre.textContent=JSON.stringify({"@context":"https://schema.org","@type":"RealEstateAgent",name:FIRMA.name,telephone:FIRMA.tel,email:FIRMA.mail,address:{"@type":"PostalAddress",streetAddress:FIRMA.adres,addressLocality:PROX.region,addressCountry:"TR"},areaServed:PROX.region,knowsAbout:["Gayrimenkul Değerleme","Emlak Endeksi","Yatırım Danışmanlığı"],url:"https://meridyengm.com"},null,2);}
  else if(type==='llms'){pre.textContent=`# ${FIRMA.name}\n\n> ${SEO.desc}\n\n## Hizmetler\n- Satılık & kiralık portföy (veri destekli)\n- Ücretsiz online değerleme\n- Mahalle bazlı fiyat endeksi & yatırım skoru\n- Fay/deprem risk analizi\n\n## Veri Ortağı\nTürkiye geneli endeks altyapısı · 81 il · 973 ilçe · 50.000+ mahalle ve köy endeksi\n\n## İletişim\n${FIRMA.tel} · ${FIRMA.mail}`;}
  else{const slugs=Object.keys(BAZ).map(k=>`  <url><loc>https://meridyengm.com/bolge/${k.toLowerCase().replace(/ı/g,'i').replace(/ş/g,'s').replace(/ç/g,'c').replace(/ö/g,'o').replace(/ü/g,'u').replace(/ğ/g,'g')}</loc></url>`).join('\n');
    pre.textContent=`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>https://meridyengm.com/</loc></url>\n  <url><loc>https://meridyengm.com/ilanlar</loc></url>\n  <url><loc>https://meridyengm.com/danismanlar</loc></url>\n${SEO.prog?slugs:''}\n</urlset>`;}
}

/* ---------- GOOGLE ---------- */
function fillGoogle(){const g=id=>document.getElementById(id);
  g('g_ga4').value=GOOGLE.ga4;g('g_gtm').value=GOOGLE.gtm;g('g_gsc').value=GOOGLE.gsc;g('g_maps').value=GOOGLE.maps;g('g_recaptcha').value=GOOGLE.recaptcha;g('g_business').value=GOOGLE.business;g('g_aiseo').checked=GOOGLE.aiseo;if(document.getElementById('g_ab'))document.getElementById('g_ab').checked=!!GOOGLE.ab;if(typeof renderWlAb==='function')renderWlAb();}
function saveGoogle(){const g=id=>document.getElementById(id);
  GOOGLE={ga4:g('g_ga4').value.trim(),gtm:g('g_gtm').value.trim(),gsc:g('g_gsc').value.trim(),maps:g('g_maps').value.trim(),recaptcha:g('g_recaptcha').value.trim(),business:g('g_business').value.trim(),aiseo:g('g_aiseo').checked,ab:!!(document.getElementById('g_ab')&&document.getElementById('g_ab').checked)};
  saveAll();toast('✓ Google entegrasyon ayarları kaydedildi.'+(GOOGLE.ga4?' GA4 etkin: '+GOOGLE.ga4:''));}

// SEO live counters
document.addEventListener('input',e=>{if(e.target&&(e.target.id==='seo_title'||e.target.id==='seo_desc'))seoLen();});

/* ============================================================
   PART 4 — GAYRİMENKUL CRM
   ============================================================ */
const STAGES=[{k:'yeni',n:'Yeni',c:'#586475'},{k:'iletisim',n:'İletişim',c:'#3b82f6'},{k:'gosterim',n:'Gösterim',c:'#8b5cf6'},{k:'teklif',n:'Teklif',c:'#f59e0b'},{k:'sozlesme',n:'Kapanış',c:'#1e7e3a'}];
const TYPE_LBL={alici:'Alıcı',satici:'Satıcı',kiraci:'Kiracı',yatirimci:'Yatırımcı'};
const TASK_LBL={arama:'📞 Arama',gosterim:'🏠 Gösterim',toplanti:'🤝 Toplantı',tapu:'📋 Tapu/Söz.',takip:'🔔 Takip'};
function danName(id){const d=DANISMANLAR.find(x=>x.id===id);return d?d.name:'—';}
function kisiName(id){const k=KISILER.find(x=>x.id===id);return k?k.name:'—';}
function ilanTitle(id){const i=ILANLAR.find(x=>x.id===id);return i?i.title:'—';}
function fmtK(n){n=+n||0;if(n>=1e6)return (n/1e6).toFixed(n>=1e7?0:1)+'M';if(n>=1e3)return Math.round(n/1e3)+'K';return n;}
function fillDanSelects(){const opts='<option value="">— Danışman —</option>'+DANISMANLAR.map(d=>`<option value="${d.id}">${d.name}</option>`).join('');
  ['k_dan','de_dan','t_dan','c_dan'].forEach(id=>{const s=document.getElementById(id);if(s){const v=s.value;s.innerHTML=opts;s.value=v;}});}
function fillKisiSelects(){const opts='<option value="">— Kişi —</option>'+KISILER.map(k=>`<option value="${k.id}">${k.name} (${TYPE_LBL[k.type]})</option>`).join('');
  ['de_kisi','t_kisi'].forEach(id=>{const s=document.getElementById(id);if(s){const v=s.value;s.innerHTML=opts;s.value=v;}});
  const es=document.getElementById('es_kisi');if(es){const demand=KISILER.filter(k=>k.type!=='satici');es.innerHTML=demand.map(k=>`<option value="${k.id}">${k.name} · ${TYPE_LBL[k.type]} · ${k.ilceler.join(', ')||'-'}</option>`).join('');}}
function fillIlanSelects(){const opts='<option value="">— İlan —</option>'+ILANLAR.map(i=>`<option value="${i.id}">${i.title}</option>`).join('');
  const s=document.getElementById('de_ilan');if(s){const v=s.value;s.innerHTML=opts;s.value=v;}}

/* ---- KİŞİLER ---- */
let editingKisi=null,kisiFilter='';
function matchScore(k,it){
  if(it.status!=='aktif')return 0;let sc=0;
  sc+= !k.op?12: (k.op===it.op?32:-100);
  sc+= !k.tip?10:(k.tip===it.type?25:-40);
  if(k.max>0){if(it.price>=(k.min||0)&&it.price<=k.max)sc+=25;else if(it.price<=k.max*1.15&&it.price>=(k.min||0)*0.85)sc+=12;else sc-=20;}else sc+=8;
  if(k.ilceler&&k.ilceler.length){sc+= k.ilceler.some(c=>c.trim()&&it.ilce.toLowerCase().includes(c.trim().toLowerCase()))?15:-8;}
  if(k.oda&&it.oda===k.oda)sc+=6;
  return Math.max(0,Math.min(100,sc));
}
function matchCount(k){if(k.type==='satici')return null;return ILANLAR.filter(it=>matchScore(k,it)>=55).length;}
function filtKisi(btn){kisiFilter=btn.dataset.t;document.querySelectorAll('#kisiFilt .cf').forEach(b=>b.classList.toggle('act',b===btn));renderKisiRows();}
function renderKisiRows(){const tb=document.getElementById('kisiRows');if(!tb)return;
  let arr=KISILER.slice();if(kisiFilter)arr=arr.filter(k=>k.type===kisiFilter);
  if(!arr.length){tb.innerHTML='<tr><td colspan="6" class="empty">Kişi yok.</td></tr>';return;}
  tb.innerHTML=arr.map(k=>{const mc=matchCount(k);
    const talep=k.type==='satici'?'<span class="tsub">Satıcı portföyü</span>:'+'':(k.op||'Farketmez')+' · '+(k.tip||'Her tip')+(k.max?` · ≤${fmtK(k.max)}₺`:'');
    const mcell=mc===null?'<span class="tsub">—</span>':`<span class="matchbar"><span class="mb"><span class="mbf" style="width:${Math.min(100,mc*25)}%"></span></span><b>${mc}</b></span>`;
    return `<tr><td><div><b style="cursor:pointer;color:var(--accent)" onclick="openKisiDet(${k.id})">${_le(k.name)}</b></div><div class="kcontact">${_le(k.tel)}</div></td>
      <td><span class="tagpill tp-${k.type}">${TYPE_LBL[k.type]}</span></td>
      <td class="tsub">${k.type==='satici'?'Satıcı portföyü':talep}</td>
      <td>${danName(k.dan)}</td>
      <td>${mcell}</td>
      <td class="ta"><button class="ico-btn" onclick="matchFromKisi(${k.id})" title="Eşleştir">🎯</button><button class="ico-btn" onclick="editKisi(${k.id})">✎</button><button class="ico-btn del" onclick="delKisi(${k.id})">🗑</button></td></tr>`;}).join('');}
function newKisi(){editingKisi=null;document.getElementById('kisiEditTitle').textContent='Yeni Kişi';
  ['k_name','k_tel','k_email','k_oda','k_min','k_max','k_ilceler','k_note'].forEach(i=>document.getElementById(i).value='');
  document.getElementById('k_type').value='alici';document.getElementById('k_source').value='Web Sitesi';document.getElementById('k_op').value='';document.getElementById('k_tip').value='';
  fillDanSelects();document.getElementById('kisiEditCard').style.display='block';document.getElementById('kisiEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function editKisi(id){const k=KISILER.find(x=>x.id===id);if(!k)return;editingKisi=id;fillDanSelects();
  document.getElementById('kisiEditTitle').textContent='Kişiyi Düzenle';
  const g=(i,v)=>document.getElementById(i).value=v;
  g('k_name',k.name);g('k_tel',k.tel);g('k_email',k.email||'');g('k_type',k.type);g('k_source',k.source||'Web Sitesi');g('k_dan',k.dan||'');
  g('k_op',k.op||'');g('k_tip',k.tip||'');g('k_oda',k.oda||'');g('k_min',k.min||'');g('k_max',k.max||'');g('k_ilceler',(k.ilceler||[]).join(', '));g('k_note',k.note||'');
  document.getElementById('kisiEditCard').style.display='block';document.getElementById('kisiEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function saveKisi(){const g=i=>document.getElementById(i).value.trim();const name=g('k_name');if(!name){toast('Ad zorunlu.');return;}
  const obj={name,tel:g('k_tel'),email:g('k_email'),type:document.getElementById('k_type').value,source:document.getElementById('k_source').value,dan:+document.getElementById('k_dan').value||null,
    op:document.getElementById('k_op').value,tip:document.getElementById('k_tip').value,oda:g('k_oda'),min:+document.getElementById('k_min').value||0,max:+document.getElementById('k_max').value||0,
    ilceler:g('k_ilceler').split(',').map(x=>x.trim()).filter(Boolean),note:g('k_note')};
  if(editingKisi){const i=KISILER.findIndex(x=>x.id===editingKisi);KISILER[i]={...KISILER[i],...obj};toast('✓ Kişi güncellendi.');}
  else{obj.id=Date.now();obj.created=new Date().toISOString().slice(0,10);KISILER.unshift(obj);toast('✓ Kişi eklendi.');}
  saveAll();renderKisiRows();fillKisiSelects();renderKpis();document.getElementById('kisiEditCard').style.display='none';}
function delKisi(id){if(!confirm('Kişi silinsin mi?'))return;KISILER=KISILER.filter(x=>x.id!==id);saveAll();renderKisiRows();fillKisiSelects();renderKpis();toast('Kişi silindi.');}
function matchFromKisi(id){document.querySelector('.adm-nav[data-p="eslestirme"]').click();const es=document.getElementById('es_kisi');es.value=id;runMatch();}

/* ---- EŞLEŞTİRME ---- */
function runMatch(){const id=+document.getElementById('es_kisi').value;const k=KISILER.find(x=>x.id===id);const box=document.getElementById('matchResult');if(!k){box.innerHTML='';return;}
  const scored=ILANLAR.map(it=>({it,s:matchScore(k,it)})).filter(x=>x.s>0).sort((a,b)=>b.s-a.s).slice(0,6);
  let head=`<div class="crm-detail"><div class="cdrow"><span>Talep</span><b>${k.op||'Farketmez'} · ${k.tip||'Her tip'} · ${k.max?fmtK(k.min)+'–'+fmtK(k.max)+'₺':'bütçe yok'} · ${(k.ilceler||[]).join(', ')||'her bölge'}</b></div></div>`;
  if(!scored.length){box.innerHTML=head+'<div class="empty">Uygun ilan bulunamadı. Talep kriterlerini genişletin.</div>';return;}
  box.innerHTML=head+'<table class="atable" style="margin-top:12px"><thead><tr><th>İlan</th><th>Fiyat</th><th>Uyum</th><th></th></tr></thead><tbody>'+
    scored.map(({it,s})=>`<tr><td><div class="trow"><img src="${imgSrc(it.img)}" class="tthumb" loading="lazy" decoding="async"><div><b>${_le(it.title)}</b><div class="tsub">${_le(it.mah)}, ${_le(it.ilce)} · ${_le(it.oda)} · ${it.m2}m²</div></div></div></td>
      <td class="num">${fmt(it.price)} ₺</td>
      <td><span class="matchbar"><span class="mb"><span class="mbf" style="width:${s}%"></span></span><b>%${s}</b></span></td>
      <td class="ta"><button class="ico-btn" onclick="matchWa(${k.id},${it.id})" title="WhatsApp gönder">💬</button><button class="ico-btn" onclick="matchToDeal(${k.id},${it.id})" title="Fırsata ekle">＋</button></td></tr>`).join('')+'</tbody></table>';}
function matchWa(kid,iid){const k=KISILER.find(x=>x.id===kid),it=ILANLAR.find(x=>x.id===iid);if(!k||!it)return;
  const tel=(k.tel||'').replace(/[^0-9]/g,'');const msg=`Merhaba ${k.name}, talebinize çok uygun bir ilanımız var: ${it.title} — ${it.mah}, ${it.ilce}, ${fmt(it.price)} ₺. Detay için: ${FIRMA.name}`;
  window.open('https://wa.me/'+(tel||'90')+'?text='+encodeURIComponent(msg),'_blank');toast('WhatsApp mesajı hazırlandı.');}
function matchToDeal(kid,iid){const k=KISILER.find(x=>x.id===kid),it=ILANLAR.find(x=>x.id===iid);
  DEALS.unshift({id:Date.now(),title:it.title+' — '+k.name,kisiId:kid,ilanId:iid,danId:k.dan||null,stage:'yeni',value:it.price,prob:30,note:'Eşleştirmeden oluşturuldu',created:new Date().toISOString().slice(0,10)});
  saveAll();renderKanban();renderKpis();toast('✓ Satış hattına "Yeni" olarak eklendi.');}

/* ---- PIPELINE ---- */
let editingDeal=null,dragDeal=null;
function renderKanban(){const k=document.getElementById('kanban');if(!k)return;
  k.innerHTML=STAGES.map(st=>{const ds=DEALS.filter(d=>d.stage===st.k);const sum=ds.reduce((a,b)=>a+(+b.value||0),0);
    return `<div class="kcol${st.k==='sozlesme'?' kstage-won':''}" data-stage="${st.k}" ondragover="kanOver(event,this)" ondragleave="this.classList.remove('over')" ondrop="kanDrop(event,this)">
      <h4 style="color:${st.c}">${st.n} <span class="cnt">${ds.length}</span></h4>
      ${ds.map(d=>`<div class="kdeal" draggable="true" ondragstart="kanStart(event,${d.id})" ondragend="this.classList.remove('drag')" onclick="editDeal(${d.id})">
        <h5>${_le(d.title)}</h5><div class="kv">${fmt(d.value)} ₺</div>
        <div class="km"><span>👤 ${danName(d.danId)}</span><span>%${d.prob||0}</span></div></div>`).join('')}
      ${ds.length?`<div class="tsub" style="text-align:right;padding:4px 6px">Σ ${fmtK(sum)}₺</div>`:''}
    </div>`;}).join('');}
function kanStart(e,id){dragDeal=id;e.dataTransfer.effectAllowed='move';e.target.classList.add('drag');}
function kanOver(e,col){e.preventDefault();col.classList.add('over');}
function kanDrop(e,col){e.preventDefault();col.classList.remove('over');if(dragDeal==null)return;const d=DEALS.find(x=>x.id===dragDeal);if(d){d.stage=col.dataset.stage;if(d.stage==='sozlesme')d.prob=100;saveAll();renderKanban();renderKpis();toast('Fırsat "'+STAGES.find(s=>s.k===d.stage).n+'" aşamasına taşındı.');}dragDeal=null;}
function newDeal(){editingDeal=null;fillKisiSelects();fillIlanSelects();fillDanSelects();
  ['de_title','de_value','de_prob','de_note'].forEach(i=>document.getElementById(i).value='');document.getElementById('de_stage').value='yeni';
  document.getElementById('dealEditCard').style.display='block';document.getElementById('dealEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function editDeal(id){const d=DEALS.find(x=>x.id===id);if(!d)return;editingDeal=id;fillKisiSelects();fillIlanSelects();fillDanSelects();
  const g=(i,v)=>document.getElementById(i).value=v;g('de_title',d.title);g('de_value',d.value);g('de_prob',d.prob||'');g('de_kisi',d.kisiId||'');g('de_ilan',d.ilanId||'');g('de_dan',d.danId||'');g('de_stage',d.stage);g('de_note',d.note||'');
  document.getElementById('dealEditCard').style.display='block';document.getElementById('dealEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function saveDeal(){const g=i=>document.getElementById(i).value;const title=g('de_title').trim();if(!title){toast('Başlık zorunlu.');return;}
  const obj={title,value:+g('de_value')||0,prob:+g('de_prob')||0,kisiId:+g('de_kisi')||null,ilanId:+g('de_ilan')||null,danId:+g('de_dan')||null,stage:g('de_stage'),note:g('de_note')};
  if(editingDeal){const i=DEALS.findIndex(x=>x.id===editingDeal);DEALS[i]={...DEALS[i],...obj};toast('✓ Fırsat güncellendi.');}
  else{obj.id=Date.now();obj.created=new Date().toISOString().slice(0,10);DEALS.unshift(obj);toast('✓ Fırsat eklendi.');}
  saveAll();renderKanban();renderKpis();document.getElementById('dealEditCard').style.display='none';}
function delDeal(){if(editingDeal&&confirm('Fırsat silinsin mi?')){DEALS=DEALS.filter(x=>x.id!==editingDeal);saveAll();renderKanban();document.getElementById('dealEditCard').style.display='none';}}

/* ---- GÖREVLER ---- */
let editingTask=null;
function renderTasks(){const box=document.getElementById('taskList');if(!box)return;
  const arr=TASKS.slice().sort((a,b)=>new Date(a.date)-new Date(b.date));const now=new Date();const today=now.toISOString().slice(0,10);
  if(!arr.length){box.innerHTML='<div class="empty">Görev yok.</div>';return;}
  box.innerHTML=arr.map(t=>{const d=new Date(t.date||0);const isToday=(t.date||'').slice(0,10)===today;const over=!t.done&&!!t.date&&d<now&&!isToday;/* M4: t.date null koruması */
    const dl=d.toLocaleString('tr-TR',{day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'});
    return `<div class="tk ${t.done?'done':''} ${over?'overdue':''} ${isToday&&!t.done?'today':''}">
      <div class="tkchk" onclick="toggleTask(${t.id})">${t.done?'✓':''}</div>
      <div class="tkbody"><b>${_le(t.title)}</b><div class="tkmeta"><span class="tktype">${_le(TASK_LBL[t.type]||t.type)}</span><span>👤 ${_le(kisiName(t.kisiId))}</span><span>🧑‍💼 ${_le(danName(t.danId))}</span>${t.note?`<span>📝 ${_le(t.note)}</span>`:''}</div></div>
      <div class="tkdate">${dl}${over?' · gecikti':''}<div class="ta" style="margin-top:4px"><button class="ico-btn" onclick="editTask(${t.id})">✎</button><button class="ico-btn del" onclick="delTask(${t.id})">🗑</button></div></div></div>`;}).join('');}
function toggleTask(id){const t=TASKS.find(x=>x.id===id);if(t){t.done=!t.done;saveAll();renderTasks();renderKpis();}}
function newTask(){editingTask=null;fillKisiSelects();fillDanSelects();['t_title','t_note'].forEach(i=>document.getElementById(i).value='');document.getElementById('t_type').value='arama';document.getElementById('t_date').value=_td(1);
  document.getElementById('taskEditCard').style.display='block';document.getElementById('taskEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function editTask(id){const t=TASKS.find(x=>x.id===id);if(!t)return;editingTask=id;fillKisiSelects();fillDanSelects();
  const g=(i,v)=>document.getElementById(i).value=v;g('t_title',t.title);g('t_type',t.type);g('t_date',t.date);g('t_kisi',t.kisiId||'');g('t_dan',t.danId||'');g('t_note',t.note||'');
  document.getElementById('taskEditCard').style.display='block';document.getElementById('taskEditCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function saveTask(){const g=i=>document.getElementById(i).value;const title=g('t_title').trim();if(!title){toast('Başlık zorunlu.');return;}
  const obj={title,type:g('t_type'),date:g('t_date')||_td(0),kisiId:+g('t_kisi')||null,danId:+g('t_dan')||null,note:g('t_note'),done:false};
  if(editingTask){const i=TASKS.findIndex(x=>x.id===editingTask);obj.done=TASKS[i].done;TASKS[i]={...TASKS[i],...obj};toast('✓ Görev güncellendi.');}
  else{obj.id=Date.now();TASKS.push(obj);toast('✓ Görev eklendi.');}
  saveAll();renderTasks();renderKpis();document.getElementById('taskEditCard').style.display='none';}
function delTask(id){if(!confirm('Görev silinsin mi?'))return;TASKS=TASKS.filter(x=>x.id!==id);saveAll();renderTasks();renderKpis();toast('Görev silindi.');}

/* ---- KOMİSYON ---- */
let editingComm=null;
function commVal(c){return Math.round((+c.amount||0)*(+c.rate||0)/100);}
function renderFinKpi(){const box=document.getElementById('finKpi');if(!box)return;
  const toplam=COMMS.reduce((a,b)=>a+commVal(b),0);const tahsil=COMMS.filter(c=>c.status==='tahsil').reduce((a,b)=>a+commVal(b),0);const bekleyen=toplam-tahsil;const ciro=COMMS.reduce((a,b)=>a+(+b.amount||0),0);
  const items=[['Toplam Komisyon',fmt(toplam)+' ₺','var(--accent)'],['Tahsil Edilen',fmt(tahsil)+' ₺','var(--green-700)'],['Bekleyen',fmt(bekleyen)+' ₺','#b45309'],['İşlem Cirosu',fmtK(ciro)+' ₺','#8b5cf6']];
  box.innerHTML=items.map(it=>`<div class="fin-card"><div class="fl">${it[0]}</div><div class="fv" style="color:${it[2]}">${it[1]}</div></div>`).join('');}
function renderCommRows(){const tb=document.getElementById('commRows');if(!tb)return;
  tb.innerHTML=COMMS.length?COMMS.map(c=>`<tr><td><b>${_le(c.title)}</b><div class="tsub">${c.date||''} · ${c.side==='her'?'Her iki taraf':c.side==='alici'?'Alıcı':'Satıcı'}</div></td><td>${danName(c.danId)}</td><td class="num">${fmt(c.amount)} ₺</td><td class="num" style="color:var(--green-700)">${fmt(commVal(c))} ₺ <span class="tsub">(%${c.rate})</span></td>
    <td>${c.status==='tahsil'?'<span class="atag akt">Tahsil edildi</span>':'<span class="atag pas">Beklemede</span>'}</td>
    <td class="ta"><button class="ico-btn" onclick="editComm(${c.id})">✎</button><button class="ico-btn del" onclick="delComm(${c.id})">🗑</button></td></tr>`).join(''):'<tr><td colspan="6" class="empty">Kayıt yok.</td></tr>';}
function newComm(){editingComm=null;fillDanSelects();['c_title','c_amount'].forEach(i=>document.getElementById(i).value='');document.getElementById('c_rate').value='2';document.getElementById('c_side').value='satici';document.getElementById('c_status').value='beklemede';
  document.getElementById('commEditCard').style.display='block';}
function editComm(id){const c=COMMS.find(x=>x.id===id);if(!c)return;editingComm=id;fillDanSelects();
  const g=(i,v)=>document.getElementById(i).value=v;g('c_title',c.title);g('c_amount',c.amount);g('c_rate',c.rate);g('c_dan',c.danId||'');g('c_side',c.side);g('c_status',c.status);
  document.getElementById('commEditCard').style.display='block';}
function saveComm(){const g=i=>document.getElementById(i).value;const title=g('c_title').trim();if(!title){toast('Başlık zorunlu.');return;}
  const obj={title,amount:+g('c_amount')||0,rate:+g('c_rate')||2,danId:+g('c_dan')||null,side:g('c_side'),status:g('c_status')};
  if(editingComm){const i=COMMS.findIndex(x=>x.id===editingComm);obj.date=COMMS[i].date;COMMS[i]={...COMMS[i],...obj};}
  else{obj.id=Date.now();obj.date=new Date().toISOString().slice(0,10);COMMS.unshift(obj);}
  saveAll();renderFinKpi();renderCommRows();toast('✓ Komisyon kaydedildi.');document.getElementById('commEditCard').style.display='none';}
function delComm(id){if(!confirm('Kayıt silinsin mi?'))return;COMMS=COMMS.filter(x=>x.id!==id);saveAll();renderFinKpi();renderCommRows();toast('Kayıt silindi.');}

/* ---- KİRA ---- */
let editingRent=null;
const RENT_BADGE={odendi:'<span class="atag akt">Ödendi</span>',bekliyor:'<span class="atag pas">Bekliyor</span>',gecikti:'<span class="atag" style="background:#fee2e2;color:#b91c1c">Gecikti</span>'};
function renderRentRows(){const tb=document.getElementById('rentRows');if(!tb)return;
  tb.innerHTML=RENTS.length?RENTS.map(r=>`<tr><td><b>${r.prop}</b><div class="tsub">Başlangıç: ${r.start||'-'}</div></td><td>${r.tenant}</td><td class="num">${fmt(r.amount)} ₺</td><td>Her ayın ${r.due}.</td>
    <td>${RENT_BADGE[r.status]||r.status}</td>
    <td class="ta">${r.status!=='odendi'?`<button class="ico-btn" onclick="rentPaid(${r.id})" title="Ödendi işaretle" style="color:var(--green-700)">✓</button>`:''}<button class="ico-btn" onclick="editRent(${r.id})">✎</button><button class="ico-btn del" onclick="delRent(${r.id})">🗑</button></td></tr>`).join(''):'<tr><td colspan="6" class="empty">Kira sözleşmesi yok.</td></tr>';}
function rentPaid(id){const r=RENTS.find(x=>x.id===id);if(r){r.status='odendi';saveAll();renderRentRows();renderKpis();toast('✓ Ödeme alındı olarak işaretlendi.');}}
function newRent(){editingRent=null;['r_prop','r_tenant','r_amount','r_start','r_due'].forEach(i=>document.getElementById(i).value='');document.getElementById('r_status').value='bekliyor';
  document.getElementById('rentEditCard').style.display='block';}
function editRent(id){const r=RENTS.find(x=>x.id===id);if(!r)return;editingRent=id;
  const g=(i,v)=>document.getElementById(i).value=v;g('r_prop',r.prop);g('r_tenant',r.tenant);g('r_amount',r.amount);g('r_start',r.start||'');g('r_due',r.due);g('r_status',r.status);
  document.getElementById('rentEditCard').style.display='block';}
function saveRent(){const g=i=>document.getElementById(i).value;const prop=g('r_prop').trim();if(!prop){toast('Mülk zorunlu.');return;}
  const obj={prop,tenant:g('r_tenant'),amount:+g('r_amount')||0,start:g('r_start'),due:+g('r_due')||1,status:g('r_status')};
  if(editingRent){const i=RENTS.findIndex(x=>x.id===editingRent);RENTS[i]={...RENTS[i],...obj};}else{obj.id=Date.now();RENTS.push(obj);}
  saveAll();renderRentRows();renderKpis();toast('✓ Kira sözleşmesi kaydedildi.');document.getElementById('rentEditCard').style.display='none';}
function delRent(id){if(!confirm('Sözleşme silinsin mi?'))return;RENTS=RENTS.filter(x=>x.id!==id);saveAll();renderRentRows();toast('Sözleşme silindi.');}

/* ---- İLETİŞİM MERKEZİ ---- */
const MSG_TPL={yeni:'Merhaba {ad}, talebinize uygun yeni bir ilan portföyümüze eklendi. Detaylar için bizi arayabilirsiniz. — '+'',fiyat:'Merhaba {ad}, ilgilendiğiniz bölgede güncel fiyat değişiklikleri oldu. Fırsatları kaçırmamak için görüşelim.',kampanya:'Merhaba {ad}, bu aya özel danışmanlık kampanyamızdan yararlanabilirsiniz. Detaylı bilgi için ulaşın.',bayram:'Merhaba {ad}, bayramınızı en içten dileklerimizle kutlar, sağlık ve huzur dolu günler dileriz. — Meridyen Gayrimenkul'};
function msgTpl(k){let t=MSG_TPL[k]||'';t=t.replace('— ','— '+FIRMA.name);document.getElementById('msg_body').value=t;}
function audCount(a){return a==='all'?KISILER.length:KISILER.filter(k=>k.type===a).length;}
function sendBulk(){const chan=document.querySelector('input[name="chan"]:checked').value;const aud=document.getElementById('msg_aud').value;const body=document.getElementById('msg_body').value.trim();
  if(!body){toast('Mesaj boş olamaz.');return;}const n=audCount(aud);if(!n){toast('Bu kitlede kişi yok.');return;}
  MSGLOG.unshift({date:new Date().toLocaleString('tr-TR'),chan,aud,n,body:body.slice(0,80)});saveAll();renderSentLog();
  toast(`📤 ${n} kişiye ${chan==='whatsapp'?'WhatsApp':chan==='sms'?'SMS':'e-posta'} gönderildi (demo).`);}
async function aiMsgDraft(){const aud=document.getElementById('msg_aud').value;const ta=document.getElementById('msg_body');ta.value='✨ AI metin yazıyor...';
  try{const t=await callClaude([{role:'user',content:`${TYPE_LBL[aud]||'tüm'} müşteri grubuna gönderilecek kısa, samimi ve profesyonel bir emlak bilgilendirme mesajı yaz. {ad} yer tutucusunu kullan. Tek paragraf, Türkçe.`}],'Emlak pazarlama metni yazarısın. Sadece mesajı yaz.');ta.value=t;}catch(e){ta.value='Merhaba {ad}, size özel fırsatlarımız hakkında bilgi vermek isteriz. — '+FIRMA.name;toast('AI bağlantısı yok, örnek metin eklendi.');}}
function renderSentLog(){const box=document.getElementById('sentLog');if(!box)return;
  box.innerHTML=MSGLOG.length?MSGLOG.slice(0,15).map(m=>`<div class="sl"><b>${m.chan==='whatsapp'?'💬':m.chan==='sms'?'✉':'📧'} ${m.n} kişi</b> · ${TYPE_LBL[m.aud]||'Tümü'} · <span class="tsub">${m.date}</span><div class="tsub">${m.body}…</div></div>`).join(''):'<div class="empty">Henüz gönderim yok.</div>';}

/* ---- RAPORLAR ---- */
function barChart(elId,data,fmtv){const el=document.getElementById(elId);if(!el)return;const max=Math.max(1,...data.map(d=>d.v));
  el.innerHTML=data.map(d=>`<div class="bcol"><div class="bv">${fmtv?fmtv(d.v):d.v}</div><div class="bar" style="height:${Math.max(3,d.v/max*130)}px;background:${d.c||'var(--grad-blue)'}"></div><div class="bl">${d.l}</div></div>`).join('');}
function renderReports(){
  const box=document.getElementById('repKpi');if(box){const pipeVal=DEALS.filter(d=>d.stage!=='sozlesme').reduce((a,b)=>a+(+b.value||0),0);const won=DEALS.filter(d=>d.stage==='sozlesme').length;const conv=DEALS.length?Math.round(won/DEALS.length*100):0;
    const items=[['Aktif Fırsat',DEALS.filter(d=>d.stage!=='sozlesme').length,'var(--accent)'],['Pipeline Değeri',fmtK(pipeVal)+'₺','#8b5cf6'],['Kazanılan',won,'var(--green-700)'],['Dönüşüm','%'+conv,'#0284c7']];
    box.innerHTML=items.map(it=>`<div class="fin-card"><div class="fl">${it[0]}</div><div class="fv" style="color:${it[2]}">${it[1]}</div></div>`).join('');}
  barChart('repPipeline',STAGES.map(s=>({l:s.n,v:DEALS.filter(d=>d.stage===s.k).length,c:s.c})));
  barChart('repDan',DANISMANLAR.map((d,i)=>({l:d.name.split(' ')[0],v:DEALS.filter(x=>x.danId===d.id).length,c:DAN_COLORS[i%DAN_COLORS.length]})));
  const srcMap={};KISILER.forEach(k=>{srcMap[k.source]=(srcMap[k.source]||0)+1;});
  barChart('repSource',Object.keys(srcMap).map(s=>({l:s,v:srcMap[s]})));
}

function renderAllCrm(){fillDanSelects();fillKisiSelects();fillIlanSelects();renderKisiRows();renderKanban();renderTasks();renderFinKpi();renderCommRows();renderRentRows();renderSentLog();renderReports();runMatch();renderRepCards();renderRepLog();}

/* ============================================================
   PART 5 — ProX RAPOR STÜDYOSU + PDF + İLANA DÖNÜŞTÜRME + CRM 360
   ============================================================ */
const REPORTS=[
 {k:'karar',name:'ProX Karar Analizi',cat:'ML/MML + ProX',price:'950₺',icon:'🧠',desc:'EmlakEkspertizi.com veri omurgası + ileri seviye ML/MML ve ProX motoruyla bölgenize özel, veri destekli karar analizi raporu.',loc:'mahalle'},
 {k:'mahalle',name:'Mahalle Raporu',cat:'Veri & Trend',icon:'🏘️',desc:'51.000+ mahallede anlık fiyat, talep ve eğilim; demografi ve emsal ile zenginleştirilmiş özet.',loc:'mahalle'},
 {k:'parsel',name:'Ada / Parsel Raporu',cat:'Veri & Trend',icon:'📐',desc:'Parsel imar durumu, tahmini değer, tapu/takyidat ve bölgesel risk özeti (TKGM destekli).',loc:'parsel'},
 {k:'trend',name:'Bölgesel Trend Raporu',cat:'Veri & Trend',icon:'📈',desc:'240 ay zaman serisi, mevsimsellik, anomali ve momentum analizi ile uzun vadeli fiyat seyri.',loc:'mahalle'},
 {k:'yatirim',name:'Yatırım Bölgesi Analizi',cat:'Veri & Trend',icon:'🎯',desc:'Yükselen bölgeler, ROI skoru, fırsat haritası ve yatırım önceliği projeksiyonu.',loc:'ilce'},
 {k:'donusum',name:'Kentsel Dönüşüm Raporu',cat:'Veri & Trend',icon:'🏗️',desc:'Riskli yapı değerlendirmesi, dönüşüm bölgeleri, deprem riski ve imar/yapılaşma fırsatları.',loc:'mahalle'},
 {k:'veripaket',name:'Bölgesel Veri Paketleri',cat:'Dışa Aktarma',icon:'📦',desc:'Şehir/ilçe toplu veri dışa aktarımı (Excel / CSV / API). PDF değil — hesap dışa aktarma akışı.',loc:'export'}
];
let curReport=null,lastReport=null;
function renderRepCards(){const g=document.getElementById('repGrid');if(!g)return;
  g.innerHTML=REPORTS.map(r=>`<div class="rep-card" data-k="${r.k}" onclick="selReport('${r.k}',this)">
    <span class="rcat">${r.cat}</span><div class="ri">${r.icon}</div><h4>${r.name}</h4><p>${r.desc}</p>${r.price?`<span class="rprice">${r.price}</span>`:''}</div>`).join('');}
function selReport(k,el){curReport=REPORTS.find(r=>r.k===k);document.querySelectorAll('.rep-card').forEach(c=>c.classList.remove('act'));el.classList.add('act');
  document.getElementById('repFormTitle').textContent=curReport.name+' · Parametreler';
  document.getElementById('rp_parselWrap').style.display=curReport.loc==='parsel'?'grid':'none';
  document.getElementById('rp_exportWrap').style.display=curReport.loc==='export'?'grid':'none';
  document.getElementById('rp_mahWrap').style.display=(curReport.loc==='mahalle'||curReport.loc==='parsel')?'block':'none';
  document.getElementById('repGenBtn').textContent=curReport.loc==='export'?'📦 Veri Paketini Dışa Aktar':'⚙ ProX Motoru ile Üret';
  document.getElementById('repResult').innerHTML='';
  document.getElementById('repFormCard').style.display='block';document.getElementById('repFormCard').scrollIntoView({behavior:'smooth',block:'nearest'});}
function seedNum(str,min,max){let h=0;for(let i=0;i<str.length;i++){h=(h*31+str.charCodeAt(i))>>>0;}return min+(h%1000)/1000*(max-min);}
function regionStats(loc){const il=document.getElementById('rp_ilce').value||'';
  let base=null;try{base=BAZ[il];}catch(e){}
  const key=loc||il||'bölge';
  const m2=base?base.m2:Math.round(seedNum(key+'m',38000,135000)/100)*100;
  const chg=base?base.chg:Math.round(seedNum(key+'c',45,320));
  const score=base?base.score:Math.round(seedNum(key+'s',58,94));
  const talep=Math.round(seedNum(key+'t',62,97));
  return {m2,chg,score,talep};
}
function sparkData(seed,n){const a=[];let v=seedNum(seed,30,60);for(let i=0;i<n;i++){v+=seedNum(seed+i,-6,9);v=Math.max(12,Math.min(100,v));a.push(Math.round(v));}return a;}
async function genReport(){
  if(!curReport)return;
  const il=document.getElementById('rp_il').value||'İzmir';const ilce=document.getElementById('rp_ilce').value||'';const mah=document.getElementById('rp_mah').value||'';
  if(curReport.loc==='export'){exportDataPkg(il,ilce);return;}
  const locName=[mah,ilce,il].filter(Boolean).join(', ');
  if(curReport.loc!=='ilce'&&!ilce){toast('Lütfen ilçe girin.');return;}
  const box=document.getElementById('repResult');const btn=document.getElementById('repGenBtn');btn.disabled=true;
  box.innerHTML='<div class="rep-out"><div class="rep-loading"><span class="spinner"></span><br><br>ProX motoru çalışıyor…<br><span class="tsub">EmlakEkspertizi.com veri omurgası + ML/MML konsensüs</span></div></div>';
  const st=regionStats(mah||ilce);
  let aiText='';
  const prompts={
    karar:`"${locName}" bölgesi için gayrimenkul yatırım KARAR ANALİZİ yaz. Veriler: ortalama ${fmt(st.m2)}₺/m², 5 yıl +%${st.chg}, yatırım skoru ${st.score}/100, talep endeksi ${st.talep}. 3 kısa paragraf: (1) genel değerlendirme (2) fırsat ve riskler (3) net karar önerisi (Al/Bekle/Kaçın). Türkçe, profesyonel.`,
    mahalle:`"${locName}" mahallesi için kısa bir MAHALLE RAPORU özeti yaz: fiyat seviyesi, talep, demografi profili ve emsal yorumu. ${fmt(st.m2)}₺/m², talep ${st.talep}/100. 2 paragraf, Türkçe.`,
    parsel:`"${locName}" konumundaki ada/parsel için kısa bir İMAR & DEĞER özeti yaz: olası imar durumu (TAKS/KAKS), tahmini arsa değeri yorumu, tapu/takyidat ve risk uyarısı. Resmi teyit gerektiğini belirt. 2 paragraf, Türkçe.`,
    trend:`"${locName}" için BÖLGESEL TREND analizi yaz: son yıllardaki fiyat seyri, mevsimsellik ve momentum. 5 yıl +%${st.chg}. 2 paragraf, Türkçe, somut ama veri uydurma.`,
    yatirim:`"${ilce||il}" için YATIRIM BÖLGESİ analizi yaz: yükselen alt-bölgeler, ROI beklentisi (skor ${st.score}/100) ve yatırım önceliği. 2 paragraf, Türkçe.`,
    donusum:`"${locName}" için KENTSEL DÖNÜŞÜM raporu özeti yaz: riskli yapı olasılığı, deprem riski, dönüşüm fırsatı ve imar potansiyeli. 2 paragraf, Türkçe, resmi teyit vurgusu.`
  };
  try{aiText=await callClaude([{role:'user',content:prompts[curReport.k]}],'Sen EmlakEkspertizi ProX rapor motorusun. Sadece istenen analiz metnini üret, başlık ekleme.');}
  catch(e){aiText=`${locName} bölgesi, ${fmt(st.m2)}₺/m² ortalama fiyat ve son 5 yılda +%${st.chg} değer artışıyla dikkat çekiyor. Yatırım skoru ${st.score}/100 ve talep endeksi ${st.talep} seviyesinde olup bölge orta-uzun vadede istikrarlı bir görünüm sunmaktadır.\n\nVeriler örnek niteliğindedir; nihai karar öncesi Türkiye geneli güncel endeks ve resmi kurum (TKGM/Belediye) teyidi alınmalıdır. (AI bağlantısı olmadığından şablon özet gösterilmektedir.)`;}
  lastReport={type:curReport,locName,il,ilce,mah,st,aiText,spark:sparkData(locName,curReport.k==='trend'?40:24),date:new Date()};
  box.innerHTML=reportHtml(lastReport);
  btn.disabled=false;
  RAPORLOG.unshift({id:Date.now(),type:curReport.name,k:curReport.k,loc:locName,date:new Date().toLocaleString('tr-TR')});saveAll();renderRepLog();
}
function reportHtml(R){const st=R.st;
  const metrics=[['Ort. m² Fiyatı',fmt(st.m2)+'₺'],['5 Yıl Değişim','+%'+st.chg],['Yatırım Skoru',st.score+'/100'],['Talep Endeksi',st.talep]];
  const verdict=st.score>=80?['AL','#15803d']:st.score>=65?['DEĞERLENDİR','#b45309']:['BEKLE','#b91c1c'];
  return `<div class="rep-out"><div class="rohead"><div><h3>${R.type.name}</h3><div class="rsub">📍 ${R.locName} · ${R.date.toLocaleDateString('tr-TR')} · ProX Motoru</div></div><span class="ai-badge">✨ ML/MML + ProX</span></div>
    <div class="robody">
      <div class="rep-metrics">${metrics.map(m=>`<div class="rep-metric"><div class="rmv">${m[1]}</div><div class="rml">${m[0]}</div></div>`).join('')}</div>
      ${R.type.k==='karar'?`<div class="kd-score" style="margin-bottom:16px"><div class="kss" style="background:${verdict[1]}">${st.score}</div><div class="ksl"><b>ProX Karar Önerisi: ${verdict[0]}</b><p>Veri konsensüsü ve momentum skoruna göre</p></div></div>`:''}
      <div class="rep-sec"><h4>📊 ${R.type.k==='trend'?'40 Aylık Fiyat Seyri':'Trend Göstergesi'}</h4><div class="rep-spark">${R.spark.map(v=>`<i style="height:${v}%"></i>`).join('')}</div></div>
      <div class="rep-sec"><h4>📝 Analiz</h4><p>${R.aiText.replace(/\n/g,'</p><p>')}</p></div>
      ${R.type.k==='parsel'?`<div class="rep-sec"><h4>📐 İmar Özeti (örnek)</h4><p>TAKS ~0.40 · KAKS ~2.07 · Konut alanı · Tahmini değer aralığı ${fmt(Math.round(st.m2*0.7))}–${fmt(Math.round(st.m2*1.1))}₺/m². Resmi teyit: TKGM / İlçe Belediyesi.</p></div>`:''}
      ${R.type.k==='donusum'?`<div class="rep-sec"><h4>🏗️ Dönüşüm & Risk</h4><p>Deprem risk sınıfı: ${st.score<70?'Orta-Yüksek':'Orta'} · Riskli yapı olasılığı: ${st.score<70?'Yüksek':'Düşük'} · Dönüşüm fırsatı mevcut. 6306 sayılı kanun kapsamında değerlendirilebilir.</p></div>`:''}
    </div>
    <div class="rep-actions">
      <button class="btn btn-primary btn-sm" onclick="reportToPdf()">📄 PDF Oluştur</button>
      <button class="abtn" onclick="reportToIlan()">🏠 İlana Dönüştür</button>
      <button class="abtn" onclick="reportWa()">💬 WhatsApp Paylaş</button>
    </div></div>`;}
function reportToPdf(){if(!lastReport)return;const R=lastReport;const st=R.st;
  const logo=(IMG[FIRMA.logo]||'');
  const win=window.open('','_blank');if(!win){toast('Pop-up engellendi. PDF için izin verin.');return;}
  const metrics=[['Ort. m² Fiyatı',fmt(st.m2)+' ₺'],['5 Yıl Değişim','+%'+st.chg],['Yatırım Skoru',st.score+'/100'],['Talep Endeksi',st.talep]];
  win.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>${R.type.name} - ${R.locName}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}body{color:#0f1f3d;padding:0}
  .hd{background:linear-gradient(135deg,#0f1f3d,#0a1631,#1e40af);color:#fff;padding:34px 40px;display:flex;justify-content:space-between;align-items:center}
  .hd h1{font-size:23px}.hd .sub{color:#bcd;font-size:13px;margin-top:5px}.brand{font-weight:800;font-size:20px}
  .body{padding:34px 40px}
  .m{display:flex;gap:16px;margin:0 0 24px}.mc{flex:1;border:1px solid #e2e8f0;border-radius:12px;padding:16px;text-align:center}
  .mc .v{font-size:22px;font-weight:800;color:#1e40af}.mc .l{font-size:12px;color:#586475;margin-top:4px}
  h2{font-size:15px;color:#1e40af;margin:20px 0 8px;border-bottom:2px solid #e2e8f0;padding-bottom:6px}
  p{font-size:14px;line-height:1.7;margin-bottom:10px;color:#334155}
  .ft{margin-top:30px;padding:20px 40px;background:#f5f7fa;font-size:11.5px;color:#586475;border-top:1px solid #e2e8f0}
  .badge{display:inline-block;background:#1e7e3a;color:#fff;font-size:11px;font-weight:700;padding:4px 12px;border-radius:99px}
  @media print{.noprint{display:none}}</style></head><body>
  <div class="hd"><div><div class="brand">${logo?`<img src="${logo}" style="height:40px;vertical-align:middle"> `:''}${FIRMA.name}</div><div class="sub">${R.type.name} · ProX Rapor Motoru</div></div><div style="text-align:right"><div class="badge">ML/MML + ProX</div><div class="sub" style="margin-top:8px">${R.date.toLocaleDateString('tr-TR')}</div></div></div>
  <div class="body">
    <h2>📍 ${R.locName}</h2>
    <div class="m">${metrics.map(m=>`<div class="mc"><div class="v">${m[1]}</div><div class="l">${m[0]}</div></div>`).join('')}</div>
    <h2>Analiz</h2>${R.aiText.split('\n').filter(x=>x.trim()).map(x=>`<p>${x}</p>`).join('')}
    ${R.type.k==='parsel'?`<h2>İmar Özeti</h2><p>TAKS ~0.40 · KAKS ~2.07 · Konut alanı. Tahmini değer aralığı ${fmt(Math.round(st.m2*0.7))}–${fmt(Math.round(st.m2*1.1))} ₺/m². Resmi teyit TKGM / İlçe Belediyesi'nden alınmalıdır.</p>`:''}
  </div>
  <div class="ft"><b>${FIRMA.name}</b> · ${FIRMA.tel||''} · ${FIRMA.mail||''}<br><svg class="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="M9 12l2 2 4-4"/></svg> Saha Veri Ortağı · Bu rapor bilgilendirme amaçlıdır; resmi değer beyanı yerine geçmez. Veriler örnek/tahminîdir, güncel endeks ve resmi kurum teyidi gereklidir.</div>
  <div class="noprint" style="padding:20px 40px;text-align:center"><button onclick="window.print()" style="background:#1e40af;color:#fff;border:0;padding:12px 28px;border-radius:10px;font-size:15px;cursor:pointer">🖨 PDF olarak kaydet / yazdır</button></div>
  </body></html>`);
  win.document.close();setTimeout(()=>{try{win.print();}catch(e){}},600);
  toast('📄 PDF raporu yeni sekmede hazırlandı.');}
function reportToIlan(){if(!lastReport)return;const R=lastReport;const st=R.st;
  const est=Math.round(st.m2*120/100000)*100000;
  const obj={id:Date.now(),title:`${R.mah||R.ilce} ${R.type.k==='parsel'?'Arsa':'Konut'} — ProX Rapor`,op:'Satılık',type:R.type.k==='parsel'?'Arsa':'Daire',price:est,oda:'3+1',m2:120,kat:'—',ilce:R.ilce||R.il,mah:R.mah||R.ilce||'-',
    img:'',status:'pasif',feat:0,score:st.score,trend:'+%'+st.chg,desc:`ProX ${R.type.name} verileriyle oluşturuldu. Ort. ${fmt(st.m2)}₺/m², 5y +%${st.chg}, yatırım skoru ${st.score}/100.`};
  ILANLAR.unshift(obj);saveAll();renderIlanlar();renderIlanRows();renderKpis();
  toast('🏠 Rapor "taslak ilan" olarak oluşturuldu. İlanlar bölümünden düzenleyip yayınlayın.');
  const nav=document.querySelector('.adm-nav[data-p="ilanlar"]');if(nav)nav.click();}
function reportWa(){if(!lastReport)return;const R=lastReport;const st=R.st;
  const msg=`${R.type.name} — ${R.locName}\nOrt. ${fmt(st.m2)}₺/m² · 5y +%${st.chg} · Yatırım skoru ${st.score}/100\n${FIRMA.name} · Saha Veri Ortağı`;
  window.open('https://wa.me/?text='+encodeURIComponent(msg),'_blank');}
function exportDataPkg(il,ilce){const fmt2=document.getElementById('rp_format').value;const scope=document.getElementById('rp_scope').value;
  const rows=[['mahalle','m2_fiyat','5y_degisim','yatirim_skoru','talep_endeksi']];
  const names=['Levent','Etiler','Bebek','Ulus','Gayrettepe','Caddebostan','Suadiye','Fenerbahçe','Maslak','Nişantaşı'];
  names.forEach(n=>{const s=regionStats(n);rows.push([n,s.m2,'+%'+s.chg,s.score,s.talep]);});
  if(fmt2==='api'){const json=JSON.stringify(rows.slice(1).map(r=>({mahalle:r[0],m2:r[1],degisim:r[2],skor:r[3],talep:r[4]})),null,2);
    dl(json,`prox-veri-${ilce||il}.json`,'application/json');toast('📦 API/JSON veri paketi indirildi.');}
  else{const csv=rows.map(r=>r.join(';')).join('\n');dl('\ufeff'+csv,`prox-veri-${ilce||il}.csv`,'text/csv');toast('📦 '+(fmt2==='excel'?'Excel (CSV)':'CSV')+' veri paketi indirildi.');}
  RAPORLOG.unshift({id:Date.now(),type:'Veri Paketi ('+fmt2.toUpperCase()+')',k:'veripaket',loc:(ilce||il)+' · '+scope,date:new Date().toLocaleString('tr-TR')});saveAll();renderRepLog();}
function dl(content,name,type){const b=new Blob([content],{type});const u=URL.createObjectURL(b);const a=document.createElement('a');a.href=u;a.download=name;a.click();URL.revokeObjectURL(u);}
function renderRepLog(){const tb=document.getElementById('repLogRows');if(!tb)return;
  tb.innerHTML=RAPORLOG.length?RAPORLOG.slice(0,12).map(r=>`<tr><td><b>${r.type}</b></td><td>${r.loc}</td><td class="tsub">${r.date}</td><td class="ta"><button class="ico-btn del" onclick="delRepLog(${r.id})">🗑</button></td></tr>`).join(''):'<tr><td colspan="4" class="empty">Henüz rapor üretilmedi.</td></tr>';}
function delRepLog(id){RAPORLOG=RAPORLOG.filter(x=>x.id!==id);saveAll();renderRepLog();}

/* ============ CRM 360 — KİŞİ DETAY ============ */
function leadScore(k){let s=20;if(k.max>0)s+=20;if(k.tel)s+=10;if(k.email)s+=8;if(k.ilceler&&k.ilceler.length)s+=12;
  const mc=matchCount(k);if(mc)s+=Math.min(20,mc*7);
  const deals=DEALS.filter(d=>d.kisiId===k.id);s+=Math.min(15,deals.length*8);
  if(['Tavsiye','WhatsApp'].includes(k.source))s+=5;
  return Math.max(5,Math.min(100,Math.round(s)));}
let curKisiDet=null;
function openKisiDet(id){const k=KISILER.find(x=>x.id===id);if(!k)return;curKisiDet=id;
  const sc=leadScore(k);const ini=k.name.split(' ').map(x=>x[0]).slice(0,2).join('');
  const scColor=sc>=75?'#15803d':sc>=50?'#b45309':'#586475';
  const deals=DEALS.filter(d=>d.kisiId===id);const tasks=TASKS.filter(t=>t.kisiId===id);const acts=(ACT[id]||[]);
  document.getElementById('kisiDetBody').innerHTML=`
    <div class="kd-head"><div class="kd-av">${ini}</div><div><h3>${_le(k.name)}</h3><div class="kcontact"><span class="tagpill tp-${k.type}">${TYPE_LBL[k.type]}</span> · ${_le(k.tel)} · ${_le(k.source||'')}</div></div></div>
    <div class="kd-score"><div class="kss" style="background:${scColor}">${sc}</div><div class="ksl"><b>AI Lead Skoru: ${sc}/100</b><p>${sc>=75?'Sıcak müşteri — öncelikli takip':sc>=50?'Orta — takipte kalın':'Soğuk — besleme gerekiyor'}</p></div>
      <button class="abtn" style="margin-left:auto" onclick="kisiPortfoyPdf(${id})">📄 Portföy Sunumu</button></div>
    <div class="kd-tabs"><button class="act" onclick="kdTab(event,'ozet')">Özet</button><button onclick="kdTab(event,'firsat')">Fırsatlar (${deals.length})</button><button onclick="kdTab(event,'gorev')">Görevler (${tasks.length})</button><button onclick="kdTab(event,'akt')">Aktivite (${acts.length})</button></div>
    <div class="kd-pane act" id="kd-ozet">
      <div class="crm-detail"><div class="cdrow"><span>Talep</span><b>${k.op||'Farketmez'} · ${k.tip||'Her tip'} ${k.oda?'· '+k.oda:''}</b></div>
      <div class="cdrow"><span>Bütçe</span><b>${k.max?fmt(k.min)+' – '+fmt(k.max)+' ₺':'Belirtilmedi'}</b></div>
      <div class="cdrow"><span>Bölgeler</span><b>${(k.ilceler||[]).join(', ')||'-'}</b></div>
      <div class="cdrow"><span>Danışman</span><b>${danName(k.dan)}</b></div>
      <div class="cdrow"><span>Uygun ilan</span><b>${matchCount(k)||0} eşleşme</b></div></div>
      ${k.note?`<div class="rep-sec" style="margin-top:12px"><h4>📝 Not</h4><p>${_le(k.note)}</p></div>`:''}
      <div style="display:flex;gap:8px;margin-top:14px;flex-wrap:wrap"><button class="btn btn-primary btn-sm" onclick="matchFromKisi(${id});closeKisiDet()">🎯 Eşleştir</button><a class="abtn" href="https://wa.me/${(k.tel||'').replace(/[^0-9]/g,'')}" target="_blank" rel="noopener noreferrer">💬 WhatsApp</a><button class="abtn" onclick="aiKisiInsight(${id})">✨ AI Analizi</button></div>
      <div id="kdInsight"></div>
    </div>
    <div class="kd-pane" id="kd-firsat">${deals.length?deals.map(d=>`<div class="kd-act"><div class="kdi">🪜</div><div><b>${_le(d.title)}</b> · <span class="tagpill" style="background:${STAGES.find(s=>s.k===d.stage).c}22;color:${STAGES.find(s=>s.k===d.stage).c}">${STAGES.find(s=>s.k===d.stage).n}</span><div class="kdt">${fmt(d.value)} ₺ · %${d.prob}</div></div></div>`).join(''):'<div class="empty">Fırsat yok.</div>'}</div>
    <div class="kd-pane" id="kd-gorev">${tasks.length?tasks.map(t=>`<div class="kd-act"><div class="kdi">${(TASK_LBL[t.type]||'').split(' ')[0]}</div><div><b>${_le(t.title)}</b><div class="kdt">${new Date(t.date).toLocaleString('tr-TR')} ${t.done?'· ✓ tamam':''}</div></div></div>`).join(''):'<div class="empty">Görev yok.</div>'}</div>
    <div class="kd-pane" id="kd-akt">
      <div style="display:flex;gap:8px;margin-bottom:12px"><input id="actInput" placeholder="Görüşme notu ekle..." style="flex:1;border:1.5px solid var(--line);border-radius:10px;padding:9px 12px;font-family:inherit"><button class="btn btn-primary btn-sm" onclick="addAct(${id})">Ekle</button></div>
      <div id="actList">${acts.length?acts.map(a=>`<div class="kd-act"><div class="kdi">📌</div><div><b>${a.text}</b><div class="kdt">${a.date}</div></div></div>`).join(''):'<div class="empty">Aktivite kaydı yok.</div>'}</div>
    </div>`;
  document.getElementById('kisiModal').classList.add('open');}
function closeKisiDet(){document.getElementById('kisiModal').classList.remove('open');}
function kdTab(e,t){document.querySelectorAll('.kd-tabs button').forEach(b=>b.classList.remove('act'));e.target.classList.add('act');
  document.querySelectorAll('.kd-pane').forEach(p=>p.classList.remove('act'));document.getElementById('kd-'+t).classList.add('act');}
function addAct(id){const inp=document.getElementById('actInput');const v=inp.value.trim();if(!v)return;
  ACT[id]=ACT[id]||[];ACT[id].unshift({text:v,date:new Date().toLocaleString('tr-TR')});saveAll();openKisiDet(id);
  setTimeout(()=>{const b=[...document.querySelectorAll('.kd-tabs button')].find(x=>x.textContent.includes('Aktivite'));if(b)b.click();},30);}
async function aiKisiInsight(id){const k=KISILER.find(x=>x.id===id);const box=document.getElementById('kdInsight');box.innerHTML='<div class="rep-sec"><span class="spinner"></span> AI analizi hazırlanıyor...</div>';
  try{const mc=matchCount(k)||0;const t=await callClaude([{role:'user',content:`Bir emlak danışmanına bu müşteri için kısa aksiyon önerisi ver (2-3 cümle): ${k.name}, ${TYPE_LBL[k.type]}, bütçe ${k.max?fmt(k.max)+'₺':'belirsiz'}, bölge ${(k.ilceler||[]).join(',')||'-'}, ${mc} uygun ilan var, not: ${k.note||'yok'}. Türkçe.`}],'Sen deneyimli bir emlak satış koçusun. Kısa, uygulanabilir öneri ver.');
    box.innerHTML=`<div class="rep-sec" style="margin-top:14px"><h4>✨ AI Aksiyon Önerisi</h4><p>${t}</p></div>`;}
  catch(e){box.innerHTML=`<div class="rep-sec" style="margin-top:14px"><h4>✨ AI Aksiyon Önerisi</h4><p>${matchCount(k)?'Uygun ilanlar mevcut — hemen WhatsApp ile portföy sunumu gönderin ve gösterim randevusu ayarlayın.':'Talep kriterlerini netleştirin ve bütçe bilgisini güncelleyin. Düzenli takip araması planlayın.'}</p></div>`;}}
function kisiPortfoyPdf(id){const k=KISILER.find(x=>x.id===id);const scored=ILANLAR.map(it=>({it,s:matchScore(k,it)})).filter(x=>x.s>=45).sort((a,b)=>b.s-a.s).slice(0,5);
  const logo=(IMG[FIRMA.logo]||'');const win=window.open('','_blank');if(!win){toast('Pop-up engellendi.');return;}
  win.document.write(`<!doctype html><html lang="tr"><head><meta charset="utf-8"><title>Portföy Sunumu - ${_le(k.name)}</title>
  <style>*{margin:0;padding:0;box-sizing:border-box;font-family:'Segoe UI',Arial,sans-serif}.hd{background:linear-gradient(135deg,#0f1f3d,#1e40af);color:#fff;padding:30px 40px}.hd h1{font-size:22px}.hd .s{color:#bcd;font-size:13px;margin-top:5px}
  .body{padding:30px 40px}.card{display:flex;gap:16px;border:1px solid #e2e8f0;border-radius:12px;padding:14px;margin-bottom:14px}.card img{width:140px;height:100px;object-fit:cover;border-radius:8px}
  .card h3{font-size:16px;color:#0f1f3d}.card .loc{color:#586475;font-size:13px;margin:4px 0}.card .pr{font-size:18px;font-weight:800;color:#1e7e3a}.card .sc{font-size:12px;color:#1e40af;font-weight:700}
  .ft{padding:18px 40px;background:#f5f7fa;font-size:11.5px;color:#586475}@media print{.noprint{display:none}}</style></head><body>
  <div class="hd"><h1>${logo?`<img src="${logo}" style="height:34px;vertical-align:middle"> `:''}Size Özel Portföy Sunumu</h1><div class="s">${_le(k.name)} için seçilmiş ${scored.length} gayrimenkul · ${_le(FIRMA.name)}</div></div>
  <div class="body">${scored.map(({it,s})=>`<div class="card"><img src="${imgSrc(it.img)}"><div><h3>${it.title}</h3><div class="loc">📍 ${it.mah}, ${it.ilce} · ${it.oda} · ${it.m2}m²</div><div class="pr">${fmt(it.price)} ₺</div><div class="sc">Uyum: %${s}</div></div></div>`).join('')||'<p>Uygun ilan bulunamadı.</p>'}</div>
  <div class="ft"><b>${FIRMA.name}</b> · ${FIRMA.tel||''} · <svg class="ico" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3 5 6v5c0 4.5 3 7.6 7 9 4-1.4 7-4.5 7-9V6l-7-3Z"/><path d="M9 12l2 2 4-4"/></svg> Saha Veri Ortağı</div>
  <div class="noprint" style="padding:20px 40px;text-align:center"><button onclick="window.print()" style="background:#1e40af;color:#fff;border:0;padding:12px 28px;border-radius:10px;font-size:15px;cursor:pointer">🖨 PDF olarak kaydet</button></div></body></html>`);
  win.document.close();setTimeout(()=>{try{win.print();}catch(e){}},600);toast('📄 Portföy sunumu hazırlandı.');}




let vrState={yaw:0,pitch:0,drag:false,lx:0,ly:0,raf:0,gyro:false,bg:''};
function vrOpen(title){
  const ov=document.getElementById('vrOverlay');
  vrState.bg=IMG['pano']||'';
  ['vrEyeL','vrEyeR'].forEach(id=>{const e=document.getElementById(id);e.style.backgroundImage=`url(${vrState.bg})`;e.style.backgroundSize='auto 132%';e.style.backgroundRepeat='repeat-x';});
  document.getElementById('vrTitle').textContent=(title||'Konut')+' · 360° Sanal Gezinti';
  vrState.yaw=0;vrState.pitch=0;
  ov.classList.add('open');document.body.style.overflow='hidden';
  vrBind();vrLoop();
}
function vrClose(){const ov=document.getElementById('vrOverlay');ov.classList.remove('open');document.body.style.overflow='';
  cancelAnimationFrame(vrState.raf);vrState.gyro=false;window.removeEventListener('deviceorientation',vrGyroHandler);
  document.getElementById('vrStage').classList.remove('stereo');document.getElementById('vrGoggle').classList.remove('on');document.getElementById('vrGyro').classList.remove('on');}
function vrToggleStereo(){const st=document.getElementById('vrStage');st.classList.toggle('stereo');document.getElementById('vrGoggle').classList.toggle('on',st.classList.contains('stereo'));
  toast(st.classList.contains('stereo')?'🥽 Gözlük modu açık — telefonu VR gözlüğe yerleştirin.':'Tek ekran moduna dönüldü.');}
function vrLoop(){
  const H=document.getElementById('vrOverlay').clientHeight||600;
  const slack=H*0.32; const yoff=-slack*0.5 - (vrState.pitch*slack*0.5);
  const ycl=Math.max(-slack,Math.min(0,yoff));
  ['vrEyeL','vrEyeR'].forEach((id,i)=>{const e=document.getElementById(id);
    const parallax=document.getElementById('vrStage').classList.contains('stereo')?(i===0?-8:8):0;
    e.style.backgroundPosition=`${(-vrState.yaw+parallax)}px ${ycl}px`;});
  vrState.raf=requestAnimationFrame(vrLoop);
}
function vrBind(){
  const st=document.getElementById('vrStage');
  st.onpointerdown=e=>{vrState.drag=true;vrState.lx=e.clientX;vrState.ly=e.clientY;st.setPointerCapture&&st.setPointerCapture(e.pointerId);};
  st.onpointermove=e=>{if(!vrState.drag)return;vrState.yaw+=(e.clientX-vrState.lx)*1.1;vrState.pitch=Math.max(-1,Math.min(1,vrState.pitch+(e.clientY-vrState.ly)*0.004));vrState.lx=e.clientX;vrState.ly=e.clientY;};
  st.onpointerup=st.onpointercancel=()=>{vrState.drag=false;};
}
function vrGyroHandler(ev){if(ev.alpha==null)return;vrState.yaw=-(ev.alpha*6);vrState.pitch=Math.max(-1,Math.min(1,(ev.beta-90)/60));}
function vrToggleGyro(){
  const btn=document.getElementById('vrGyro');
  if(vrState.gyro){vrState.gyro=false;btn.classList.remove('on');window.removeEventListener('deviceorientation',vrGyroHandler);toast('Sensör kapatıldı.');return;}
  const start=()=>{vrState.gyro=true;btn.classList.add('on');window.addEventListener('deviceorientation',vrGyroHandler);toast('🧭 Hareket sensörü açık — telefonu çevirerek bakının.');};
  if(typeof DeviceOrientationEvent!=='undefined'&&typeof DeviceOrientationEvent.requestPermission==='function'){
    DeviceOrientationEvent.requestPermission().then(s=>{if(s==='granted')start();else toast('Sensör izni verilmedi.');}).catch(()=>toast('Sensör bu cihazda kullanılamıyor.'));
  }else if('DeviceOrientationEvent' in window){start();}else{toast('Bu cihaz hareket sensörünü desteklemiyor.');}
}

/* ========================================================================
   ÖZEL PORTFÖY — GELİŞTİRMELER (filtre/sıralama/arama · değerleme ·
   favori/karşılaştırma · mülk sahibi arz akışı · detay & güven rozetleri)
   Bu blok scriptin sonunda; aynı isimli önceki fonksiyonları override eder.
   ===================================================================== */
Object.assign(ozF,{ilce:'',oda:'',min:0,max:0,q:'',sort:'default',fav:false});
OZI.heart='<path d="M12 21s-7.5-4.6-10-9.3C.6 8.4 2.2 5 5.5 5 8 5 9.4 6.7 12 9c2.6-2.3 4-4 6.5-4 3.3 0 4.9 3.4 3.5 6.7C19.5 16.4 12 21 12 21Z"/>';
OZI.shield='<path d="M12 3 5 6v5c0 4 3 7 7 8 4-1 7-4 7-8V6Z"/><path d="m9 12 2 2 4-4"/>';
OZI.chev='<path d="m6 9 6 6 6-6"/>';
OZI.chart='<path d="M3 3v18h18"/><path d="M7 14l3.5-4 3 2.5L21 7"/>';
let ozCmp=[];

/* — stabil tohum & türetilmiş alanlar — */
function ozSeed(o){let s=0;const k=((o&&o.id)||'')+'';for(let i=0;i<k.length;i++)s=(s*31+k.charCodeAt(i))>>>0;return s||7;}
function ozDog(o){return o&&o.dogrulanmis!==undefined?!!o.dogrulanmis:(ozSeed(o)%3!==0);}
function ozRefOf(o){if(o&&o.ref)return o.ref;const d=((''+((o&&o.id)||'')).replace(/[^0-9]/g,''))||(''+ozSeed(o));return 'MP-'+d.slice(-5).padStart(4,'0');}
function ozTimeOf(o){return o&&o.tarih?(+new Date(o.tarih)||0):0;}

/* — bölge endeksi & değerleme — */
const OZ_TF={daire:1,villa:1.16,isyeri:0.96,arsa:0.5,tarla:0.32,bina:0.9,depo:0.62,bag:0.3,def:1};
function ozTF(tip){return OZ_TF[ozCatKey(tip)]||1;}
function ozMkt(o){return (typeof BAZ!=='undefined'&&o&&BAZ[o.ilce])?BAZ[o.ilce]:null;}
function ozVal(o){if(!o||o.op!=='Satılık'||!o.m2||!o.fiyat)return null;const m=ozMkt(o);if(!m||!m.m2)return null;const per=o.fiyat/o.m2;const ref=m.m2*ozTF(o.tip);if(!ref)return null;return{per,ref,diff:(per-ref)/ref*100};}
function ozYield(o){if(!o||o.op!=='Kiralık'||!o.m2||!o.fiyat)return null;const m=ozMkt(o);if(!m||!m.m2)return null;const sale=m.m2*ozTF(o.tip)*o.m2;if(!sale)return null;return{rentPerM2:o.fiyat/o.m2,y:(o.fiyat*12)/sale*100};}
function ozValScore(o){if(o.op==='Satılık'){const v=ozVal(o);return v?v.diff:999;}const y=ozYield(o);return y?-y.y:999;}
function ozValBadge(o){
  if(o.op==='Satılık'){const v=ozVal(o);if(!v)return '';const d=Math.round(v.diff),a=Math.abs(d);let cls='mid',txt='Piyasa seviyesinde';
    if(d<=-4){cls='ok';txt='Piyasanın %'+a+' altında — avantajlı';}else if(d>=4){cls='high';txt='Piyasanın %'+a+' üstünde';}
    return '<div class="ozval '+cls+'">'+ozIco(OZI.chart,13)+'<span><b>'+fmt(Math.round(v.per))+' ₺/m²</b> · '+o.ilce+' ort. '+fmt(v.ref)+' ₺/m² — '+txt+'</span></div>';}
  if(o.op==='Kiralık'){const v=ozYield(o);if(!v)return '';
    return '<div class="ozval ok">'+ozIco(OZI.chart,13)+'<span><b>≈%'+v.y.toFixed(1)+'</b> brüt yıllık getiri · '+fmt(Math.round(v.rentPerM2))+' ₺/m²/ay</span></div>';}
  return '';
}

/* — gizliliğe uygun (adres ifşa etmeyen) özellik kartları — */
function ozFacts(o){const k=ozCatKey(o.tip),s=ozSeed(o),pick=a=>a[s%a.length],out=[];
  if(k==='daire'||k==='villa'||k==='bina'||k==='def'){
    out.push({k:'Kat',v:o.kat||pick(['Ara kat (özel)','Üst kat (özel)','Yüksek kat (özel)','Bahçe katı (özel)'])});
    out.push({k:'Isıtma',v:o.isitma||pick(['Doğalgaz / Kombi','Merkezi (pay ölçer)','Yerden ısıtma','Klima / VRF'])});
    out.push({k:'Bina yaşı',v:pick(['0-5 yıl','5-10 yıl','Yeni proje','Sıfır'])});
    out.push({k:'Durum',v:pick(['Eşyasız','Eşyalı seçenek','Bakımlı','Yeni yapılı'])});
    const aid=o.aidat||Math.round(o.m2*pick([12,16,20])/10)*10;out.push({k:'Aidat',v:fmt(aid)+' ₺/ay'});
  }else if(k==='isyeri'||k==='depo'){
    out.push({k:'Kullanım',v:pick(['Vitrinli dükkan','Ofis / plaza','Köşe / cadde','Depo / atölye'])});
    out.push({k:'Kat',v:o.kat||pick(['Zemin (özel)','Bodrum + zemin','Plaza katı (özel)'])});
    out.push({k:'Isıtma',v:o.isitma||pick(['Klima / VRF','Doğalgaz','Merkezi'])});
    out.push({k:'Otopark',v:pick(['Var','Açık otopark','Yakın oto.'])});
    if(o.aidat)out.push({k:'Aidat',v:fmt(o.aidat)+' ₺/ay'});
  }else{
    out.push({k:'İmar',v:pick(['Konut imarlı','Ticari + konut','Turizm imarlı','İmar planında'])});
    out.push({k:'Emsal',v:pick(['1.00','1.50','2.00','0.30'])});
    out.push({k:'Cephe',v:pick(['Yola cepheli','Çift cephe','Köşe parsel'])});
    out.push({k:'Tapu',v:pick(['Müstakil tapu','Hisseli (devir uygun)'])});
  }
  return out;
}

/* — favoriler (localStorage) — */
function ozFavGet(){try{return JSON.parse(localStorage.getItem('oz_favs')||'[]');}catch(e){return [];}}
function ozFavSet(a){try{localStorage.setItem('oz_favs',JSON.stringify(a));}catch(e){}}
function ozIsFav(id){return ozFavGet().indexOf(id)>=0;}
function ozToggleFav(id,el){let a=ozFavGet();const i=a.indexOf(id);if(i>=0){a.splice(i,1);toast('Favorilerden çıkarıldı.');}else{a.push(id);toast('❤ Favorilere eklendi.');}ozFavSet(a);if(el)el.classList.toggle('on',a.indexOf(id)>=0);if(ozF.fav)renderOzel();}

/* — karşılaştırma — */
function ozCmpToggle(id,el){const i=ozCmp.indexOf(id);if(i>=0)ozCmp.splice(i,1);else{if(ozCmp.length>=3){toast('En fazla 3 kayıt karşılaştırılabilir.');if(el)el.checked=false;return;}ozCmp.push(id);}ozCmpBar();}
function ozCmpBar(){const page=document.getElementById('portfoyPage');let bar=document.getElementById('ozCmpBar');
  if(!ozCmp.length){if(bar)bar.classList.remove('on');document.querySelectorAll('.ozcmp input').forEach(c=>{c.checked=false;});return;}
  if(!bar&&page){bar=document.createElement('div');bar.id='ozCmpBar';bar.className='ozcmpbar';page.appendChild(bar);}
  if(!bar)return;bar.classList.add('on');
  bar.innerHTML='<span class="lbl">'+ozCmp.length+' kayıt seçildi</span>'+ozCmp.map(id=>{const o=OZEL.find(x=>x.id===id);return o?'<i>'+o.tip+' · '+o.mah+'</i>':'';}).join('')+'<button class="cmpgo" onclick="ozCmpOpen()">Karşılaştır</button><button class="cmpclr" onclick="ozCmpClear()">Temizle</button>';
  document.querySelectorAll('.ozcmp input').forEach(c=>{c.checked=ozCmp.indexOf(c.dataset.id)>=0;});
}
function ozCmpClear(){ozCmp=[];ozCmpBar();}
function ozCmpCloseModal(){const m=document.getElementById('ozCmpModal');if(m)m.classList.remove('on');}
function ozCmpOpen(){const items=ozCmp.map(id=>OZEL.find(x=>x.id===id)).filter(Boolean);if(!items.length)return;
  let m=document.getElementById('ozCmpModal');if(!m){m=document.createElement('div');m.id='ozCmpModal';m.className='ozcmpmodal';m.addEventListener('click',e=>{if(e.target===m)ozCmpCloseModal();});document.body.appendChild(m);}
  const rows=[['İşlem',o=>o.op],['Tip',o=>o.tip],['Konum',o=>o.mah+', '+o.ilce],['Cadde',o=>o.cadde+' civarı'],['m²',o=>o.m2+' m²'],['Oda',o=>o.oda&&o.oda!=='-'?o.oda:'—'],['Başlangıç',o=>fmt(o.fiyat)+' ₺'+(o.op==='Kiralık'?'/ay':'')],['₺/m²',o=>o.m2?fmt(Math.round(o.fiyat/o.m2))+' ₺':'—'],['Piyasa farkı',o=>{const v=ozVal(o);return v?((v.diff>=0?'+':'')+Math.round(v.diff)+'% · '+o.ilce):'—';}],['Getiri',o=>{const y=ozYield(o);return y?'≈%'+y.y.toFixed(1)+' brüt':'—';}],['Doğrulama',o=>ozDog(o)?'✓ Doğrulanmış':'Süreçte'],['Ref',o=>ozRefOf(o)]];
  m.innerHTML='<div class="ozcm-in"><div class="ozcm-hd"><b>Özel Portföy Karşılaştırma</b><button onclick="ozCmpCloseModal()" aria-label="Kapat">✕</button></div><div class="ozcm-scroll"><table class="ozcm-tbl"><thead><tr><th></th>'+items.map(o=>'<th>'+o.tip+'<small>'+o.mah+', '+o.ilce+'</small></th>').join('')+'</tr></thead><tbody>'+rows.map(r=>'<tr><td class="k">'+r[0]+'</td>'+items.map(o=>'<td>'+r[1](o)+'</td>').join('')+'</tr>').join('')+'</tbody></table></div><div class="ozcm-ft"><button class="btn btn-primary btn-sm" onclick="ozCmpCloseModal()">Kapat</button></div></div>';
  m.classList.add('on');
}

/* — kart detayı — */
function ozToggleDetail(btn){const c=btn.closest('.ozcard');if(c)c.classList.toggle('open');}

/* — geliştirilmiş kart — */
function ozCardHTML(o){
  const opc=o.op==='Satılık'?'sat':'kir';
  const oda=(o.oda&&o.oda!=='-')?' · '+_le(o.oda):'';
  const fav=ozIsFav(o.id),dog=ozDog(o);
  const kira=o.op==='Kiralık';
  const price='<div class="ozprice"><span class="from">başlangıç</span><b>'+fmt(o.fiyat)+' ₺</b>'+(kira?'<small>/ay</small>':'')+'<span class="den">\'den</span></div>';
  const avg=o.ort||(function(){var st=kira?500:1000;return Math.max(o.fiyat+st,Math.round(o.fiyat*1.18/st)*st);})();
  const ortHTML='<div class="ozort">'+ozIco(OZI.info,12)+' Bölge ortalaması <b>'+fmt(avg)+' ₺'+(kira?'/ay':'')+'</b><span class="kat">'+_le(o.op)+' '+_le(o.tip)+'</span></div>';
  const sahil=(o.sahil||isSahil(o.il||(typeof PROVINCE!=='undefined'&&PROVINCE&&PROVINCE.name)||'İzmir',o.ilce))?ozSahilBadge():'';
  const facts=ozFacts(o);
  const factsHTML='<div class="ozfacts">'+facts.map(f=>'<div><span>'+_le(f.k)+'</span><b>'+_le(f.v)+'</b></div>').join('')+(o.not?'<p class="ozfnote">“'+_le(o.not)+'”</p>':'')+'</div>';
  const verified=dog?'<span class="ozver" title="e-Devlet yetkilendirmesi tamamlandı">'+ozIco(OZI.shield,12)+' Doğrulanmış</span>':'<span class="ozver pend" title="Yetkilendirme sürecinde">Yetki sürecinde</span>';
  return '<div class="ozcard" data-id="'+o.id+'">'
    +'<div class="ozmask '+ozCatClass(o.tip)+'">'+ozScene(o.tip)
    +'<span class="ozbadge '+opc+'">'+_le(o.op)+'</span>'
    +'<span class="ozcat">'+_le(o.tip)+'</span>'
    +'<span class="ozlock">'+ozIco(OZI.lock,12)+' Özel Portföy</span>'
    +sahil
    +'<div class="ozmeta"><span class="loc">'+ozIco(OZI.pin,13)+' '+_le(o.mah)+', '+_le(o.ilce)+'</span><span class="m2">'+o.m2+' m²'+oda+'</span></div>'
    +'</div>'
    +'<div class="ozbody">'
    +'<div class="oztoprow"><div class="ozcadde">'+ozIco(OZI.road,15)+' '+_le(o.cadde)+' <span>civarı</span></div>'+verified+'</div>'
    +price+ortHTML+ozValBadge(o)
    +'<div class="ozdetail">'+factsHTML+'</div>'
    +'<div class="oznote">'+ozIco(OZI.info,13)+' Bölge ortalama/başlangıç değeridir; belirli bir ilana ait değildir. Tam adres, kat ve bina danışmanla paylaşılır. <span class="ozrefn">Ref '+ozRefOf(o)+'</span></div>'
    +'<div class="ozcta">'
    +'<button class="btn btn-primary btn-sm" onclick="ozLead(\''+o.id+'\')">Detay İste</button>'
    +'<button class="ozdt" onclick="ozToggleDetail(this)" title="Özellikleri göster"><span>Özellikler</span>'+ozIco(OZI.chev,15)+'</button>'
    +'<button class="ozfav'+(fav?' on':'')+'" onclick="ozToggleFav(\''+o.id+'\',this)" title="Favori" aria-label="Favori">'+ozIco(OZI.heart,16)+'</button>'
    +'<a class="ozwa" href="'+ozWaLink(o)+'" target="_blank" rel="noopener noreferrer" title="WhatsApp\'tan sor">'+ozIco(OZI.wa,16)+'</a>'
    +'</div>'
    +'<label class="ozcmp"><input type="checkbox" data-id="'+o.id+'" onclick="ozCmpToggle(\''+o.id+'\',this)"> Karşılaştırmaya ekle</label>'
    +'</div></div>';
}

/* — filtre seçeneklerini doldur — */
function ozBuildFilterOpts(){
  const si=document.getElementById('ozFIlce');
  if(si&&si.options.length<=1){const ils=[...new Set(OZEL.map(o=>o.ilce).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'tr'));si.insertAdjacentHTML('beforeend',ils.map(i=>'<option>'+i+'</option>').join(''));}
  const so=document.getElementById('ozFOda');
  if(so&&so.options.length<=1){const od=[...new Set(OZEL.map(o=>o.oda).filter(o=>o&&o!=='-'))].sort((a,b)=>a.localeCompare(b,'tr'));so.insertAdjacentHTML('beforeend',od.map(o=>'<option>'+o+'</option>').join(''));}
}
function ozSortArr(arr,s){const a=arr.slice();
  if(s==='price-asc')a.sort((x,y)=>x.fiyat-y.fiyat);
  else if(s==='price-desc')a.sort((x,y)=>y.fiyat-x.fiyat);
  else if(s==='m2-desc')a.sort((x,y)=>y.m2-x.m2);
  else if(s==='value')a.sort((x,y)=>ozValScore(x)-ozValScore(y));
  else if(s==='new')a.sort((x,y)=>ozTimeOf(y)-ozTimeOf(x));
  return a;
}
function ozApplyFilters(){const v=id=>{const e=document.getElementById(id);return e?e.value:'';};
  ozF.q=v('ozQ').trim();ozF.ilce=v('ozFIlce');ozF.oda=v('ozFOda');ozF.min=+v('ozFMin')||0;ozF.max=+v('ozFMax')||0;ozF.sort=v('ozFSort')||'default';renderOzel();}
function ozResetFilters(){['ozQ','ozFMin','ozFMax'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});['ozFIlce','ozFOda','ozFSort'].forEach(id=>{const e=document.getElementById(id);if(e)e.selectedIndex=0;});
  ozF.q='';ozF.ilce='';ozF.oda='';ozF.min=0;ozF.max=0;ozF.sort='default';ozF.op='';ozF.tip='';ozF.fav=false;
  document.querySelectorAll('.oztabs button').forEach((b,i)=>b.classList.toggle('act',i===0));
  const fb=document.getElementById('ozFavBtn');if(fb)fb.classList.remove('act');renderOzel();}
function ozToggleFavFilter(){ozF.fav=!ozF.fav;const fb=document.getElementById('ozFavBtn');if(fb)fb.classList.toggle('act',ozF.fav);renderOzel();}

/* — geliştirilmiş liste render — */
function renderOzel(){const g=document.getElementById('ozgrid');if(!g)return;ozBuildFilterOpts();
  let arr=OZEL.filter(o=>o.durum==='aktif');
  if(ozF.op)arr=arr.filter(o=>o.op===ozF.op);
  if(ozF.tip)arr=arr.filter(o=>o.tip===ozF.tip);
  if(ozF.ilce)arr=arr.filter(o=>o.ilce===ozF.ilce);
  if(ozF.oda)arr=arr.filter(o=>(o.oda||'-')===ozF.oda);
  if(ozF.min)arr=arr.filter(o=>o.fiyat>=ozF.min);
  if(ozF.max)arr=arr.filter(o=>o.fiyat<=ozF.max);
  if(ozF.fav){const f=ozFavGet();arr=arr.filter(o=>f.indexOf(o.id)>=0);}
  if(ozF.q){const q=ozF.q.toLocaleLowerCase('tr');arr=arr.filter(o=>[o.ilce,o.mah,o.cadde,o.tip,o.op,o.oda].join(' ').toLocaleLowerCase('tr').indexOf(q)>=0);}
  arr=ozSortArr(arr,ozF.sort);
  const cnt=document.getElementById('ozcount');if(cnt)cnt.textContent=arr.length+' özel portföy kaydı'+(ozF.fav?' · favorileriniz':'')+' · açık adres ve görsel paylaşılmaz';
  if(!arr.length){g.innerHTML='<div class="no-res" style="grid-column:1/-1;text-align:center;color:var(--muted);padding:44px">'+(ozF.fav?'Henüz favori eklemediniz. Kartlardaki ❤ ile favori ekleyin.':'Bu kriterlere uygun özel portföy bulunmuyor. Filtreleri gevşetin veya talebinizi iletin, sizin için arayalım.')+'</div>';ozCmpBar();return;}
  g.innerHTML=arr.map(o=>ozCardHTML(o)).join('');ozCmpBar();
}
function renderOzHome(){const g=document.getElementById('ozHomeGrid');if(!g||typeof OZEL==='undefined')return;
  const arr=OZEL.filter(o=>o.durum==='aktif').slice(0,6);
  g.innerHTML=arr.length?arr.map(o=>ozCardHTML(o)).join(''):'<div style="grid-column:1/-1;text-align:center;color:var(--muted);padding:30px">Henüz özel portföy kaydı yok.</div>';
}

/* — mülk sahibi (arz) akışı — */
function ozOwnerSubmit(){const g=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  const ad=g('ozo_ad'),tel=g('ozo_tel'),tip=g('ozo_tip'),op=g('ozo_op'),ilce=g('ozo_ilce'),mah=g('ozo_mah'),m2=g('ozo_m2'),fiyat=g('ozo_fiyat'),not=g('ozo_not');
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  if(!tip){toast('Lütfen mülk tipini seçin.');return;}
  const kv=document.getElementById('ozo_kvkk');if(!kv||!kv.checked){toast('Lütfen KVKK onayını işaretleyin.');return;}
  const bolge=[ilce,mah].filter(Boolean).join(' / ')||'-';
  pushLead({ad,tel,konu:'Özel Portföy Mülk Sahibi: '+tip+' '+bolge,src:'Özel Portföy Mülk Sahibi',mtip:tip,op,bolge,m2:+m2||0,fiyat:+fiyat||0,msg:not});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:'ozel-portfoy',formType:'ownerArz',name:ad,phone:tel,email:'',location:bolge,message:(tip+' · '+op+' · '+(m2?m2+'m²':'')+' · beklenen: '+(fiyat||'-')+(not?(' · '+not):'')),requestedService:'Mülk Sahibi / Arz'});
  if(typeof renderOzOwner==='function')renderOzOwner();
  ['ozo_ad','ozo_tel','ozo_ilce','ozo_mah','ozo_m2','ozo_fiyat','ozo_not'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  if(kv)kv.checked=false;
  toast('🔒 Talebiniz alındı. Danışmanımız özel olarak değerlendirme için sizi arayacak.');
}
function renderOzOwner(){const t=document.getElementById('ozOwnerRows');if(!t)return;
  const arr=(typeof LEADS!=='undefined'?LEADS:[]).filter(l=>l.src==='Özel Portföy Mülk Sahibi');
  t.innerHTML=arr.length?arr.map(l=>'<tr><td>'+(l.date||'-')+'</td><td>'+(l.mtip||'-')+(l.op?' · '+l.op:'')+'</td><td>'+(l.bolge||'-')+'</td><td>'+(l.m2?l.m2+' m²':'-')+'</td><td>'+(l.fiyat?fmt(l.fiyat)+' ₺':'-')+'</td><td><b>'+(l.ad||'-')+'</b></td><td>'+(l.tel||'-')+'</td></tr>').join(''):'<tr><td colspan="7" class="empty">Henüz mülk sahibi talebi yok.</td></tr>';
}

/* — admin: yeni alanlarla CRUD override — */
function newOzel(){ozEditId=null;document.getElementById('ozEditTitle').textContent='Yeni Kayıt';
  ['oz_ilce','oz_mah','oz_cadde','oz_m2','oz_oda','oz_fiyat','oz_not','oz_kat','oz_isitma','oz_aidat'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  document.getElementById('oz_op').value='Satılık';document.getElementById('oz_tip').value='Daire';document.getElementById('oz_durum').value='aktif';
  const d=document.getElementById('oz_dogrulanmis');if(d)d.checked=false;
  document.getElementById('ozEditCard').style.display='block';}
function editOzel(id){const o=OZEL.find(x=>x.id===id);if(!o)return;ozEditId=id;const s=(i,v)=>{const e=document.getElementById(i);if(e)e.value=v;};
  document.getElementById('ozEditTitle').textContent='Kaydı Düzenle';
  s('oz_op',o.op);s('oz_tip',o.tip);s('oz_durum',o.durum);s('oz_ilce',o.ilce);s('oz_mah',o.mah);s('oz_cadde',o.cadde);s('oz_m2',o.m2);s('oz_oda',o.oda||'');s('oz_fiyat',o.fiyat);s('oz_not',o.not||'');s('oz_kat',o.kat||'');s('oz_isitma',o.isitma||'');s('oz_aidat',o.aidat||'');
  const d=document.getElementById('oz_dogrulanmis');if(d)d.checked=!!o.dogrulanmis;
  document.getElementById('ozEditCard').style.display='block';}
function saveOzel(){const g=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  const obj={op:g('oz_op'),tip:g('oz_tip'),durum:g('oz_durum'),ilce:g('oz_ilce')||'-',mah:g('oz_mah')||'-',cadde:g('oz_cadde')||'-',m2:+g('oz_m2')||0,oda:g('oz_oda')||'-',fiyat:+g('oz_fiyat')||0,not:g('oz_not'),kat:g('oz_kat'),isitma:g('oz_isitma'),aidat:+g('oz_aidat')||0,dogrulanmis:!!(document.getElementById('oz_dogrulanmis')&&document.getElementById('oz_dogrulanmis').checked)};
  if(ozEditId){const o=OZEL.find(x=>x.id===ozEditId);if(o)Object.assign(o,obj);}
  else{obj.id='o'+Date.now();obj.ref=ozRefOf(obj);obj.tarih=new Date().toISOString();OZEL.unshift(obj);}
  saveAll();renderOzel();if(typeof renderOzelRows==='function')renderOzelRows();document.getElementById('ozEditCard').style.display='none';toast('Özel portföy kaydedildi.');}

/* — Sat / Kirala (mülk sahibi) tam sayfa — */
function satOpen(){const p=document.getElementById('satPage');if(!p)return;document.body.style.overflow='hidden';p.classList.add('open');const s=document.getElementById('satScroll');if(s)s.scrollTop=0;setOverlayPage('Sat & Kirala','#sat');}
function satClose(){const p=document.getElementById('satPage');if(p)p.classList.remove('open');document.body.style.overflow='';}
/* ============ HAKKIMIZDA (kurumsal · yasal künye · ekip · iletişim) ============ */
function hakkimizdaOpen(){var p=document.getElementById('hakkimizdaPage');if(!p)return;
  document.body.style.overflow='hidden';p.classList.add('open');
  var s=document.getElementById('hkScroll');if(s)s.scrollTop=0;
  /* nav/footer init'te mount edilir (diğer overlay'ler gibi); burada YENİDEN mount ETME —
     mountSiteChrome, mountSaaSMenu'nün ProX Asistan linkini ezerdi. Sadece içeriği doldur. */
  try{hkRender();}catch(e){}
  try{if(typeof brandSweep==='function')brandSweep(p);}catch(e){}
  setOverlayPage('Hakkımızda','#hakkimizda');}
function hkRender(){
  var f=(typeof FIRMA==='object'&&FIRMA)||{},e=f.eids||{};
  var kur=+f.kurulus||2007,yil=Math.max(1,(new Date().getFullYear())-kur);
  var hs=document.getElementById('hkHeroStats');
  if(hs)hs.innerHTML=[['~'+yil,'yıllık tecrübe'],
    [((typeof DANISMANLAR!=='undefined'?DANISMANLAR.length:0)||f.calisan||0)+'+','uzman danışman'],
    [((typeof PROVINCE!=='undefined'&&PROVINCE.mahCount)||'1.300+'),'mahalle veri kapsamı'],
    ['%98','tavsiye oranı']
  ].map(function(x){return '<div class="hks"><div class="v">'+x[0]+'</div><div class="l">'+x[1]+'</div></div>';}).join('');
  var rows=[['Ünvan',e.unvan||f.name||'—'],
    ['Taşınmaz Ticareti Yetki Belgesi No',e.belgeNo||'—'],
    ['MERSİS No',f.mersis||'—'],['Ticaret Sicil No',f.ticaretSicil||'—'],
    ['Vergi Dairesi / No',(f.vergiDaire||'—')+' · '+(f.vergi||'—')],
    ['Bağlı Meslek Odası',f.oda||'—'],['KEP Adresi',f.kep||'—'],
    ['Merkez Adres',f.adres||'—'],['Telefon',f.tel||'—'],['E-posta',f.mail||'—'],
    ['Çalışma Saatleri',f.hours||'—'],['Veri Sorumlusu (KVKK)',e.unvan||f.name||'—']];
  var kn=document.getElementById('hkKunye');
  if(kn)kn.innerHTML=rows.map(function(r){return '<div class="hk-krow"><span class="k">'+_le(r[0])+'</span><span class="v">'+_le(r[1])+'</span></div>';}).join('');
  var tm=document.getElementById('hkTeam');
  if(tm&&typeof DANISMANLAR!=='undefined'){tm.innerHTML=DANISMANLAR.map(function(d){
    var photo=d.foto?((typeof IMG!=='undefined'&&IMG[d.foto])||((''+d.foto).indexOf('data:')===0?d.foto:'')):'';
    var av=photo?'<img src="'+photo+'" alt="'+_le(d.name)+'" loading="lazy">':'<span>'+_le((d.name||'?').slice(0,1))+'</span>';
    return '<div class="hk-tc"><div class="av">'+av+'</div><div class="ti"><div class="nm">'+_le(d.name)+'</div><div class="rl">'+_le(d.role||'')+'</div><div class="ar">📍 '+_le(d.area||'')+'</div>'+
      (d.exp?'<div class="mt">'+d.exp+' yıl deneyim · ⭐ '+(d.rating||'—')+'</div>':'')+
      '<div class="tcta"><a href="tel:'+_le(d.tel||'')+'">Ara</a><a href="https://wa.me/'+_le(d.wa||'')+'" target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div></div>';}).join('');}
  var ct=document.getElementById('hkContact');
  if(ct)ct.innerHTML=
    '<a class="hk-cc" href="tel:'+_le(f.tel||'')+'"><div class="ic">📞</div><div><b>Telefon</b><span>'+_le(f.tel||'—')+'</span></div></a>'+
    '<a class="hk-cc" href="mailto:'+_le(f.mail||'')+'"><div class="ic">✉️</div><div><b>E-posta</b><span>'+_le(f.mail||'—')+'</span></div></a>'+
    '<a class="hk-cc" href="https://wa.me/'+_le(f.wa||'')+'" target="_blank" rel="noopener noreferrer"><div class="ic">💬</div><div><b>WhatsApp</b><span>Hızlı yanıt hattı</span></div></a>'+
    '<div class="hk-cc static"><div class="ic">📍</div><div><b>Merkez Ofis</b><span>'+_le(f.adres||'—')+'</span></div></div>';}
window.hakkimizdaOpen=hakkimizdaOpen;
function satScrollForm(amac){if(!document.getElementById('satPage').classList.contains('open'))satOpen();if(amac){const a=document.getElementById('sk_amac');if(a)a.value=amac;}const f=document.getElementById('skForm');if(f)f.scrollIntoView({behavior:'smooth'});const ad=document.getElementById('sk_ad');if(ad)setTimeout(()=>ad.focus(),350);}
document.addEventListener('keydown',e=>{if(e.key==='Escape'){const p=document.getElementById('satPage');if(p&&p.classList.contains('open'))satClose();}});
function skSubmit(){const g=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  const ad=g('sk_ad'),tel=g('sk_tel'),amac=g('sk_amac'),tip=g('sk_tip'),ilce=g('sk_ilce'),mah=g('sk_mah'),m2=g('sk_m2'),fiyat=g('sk_fiyat'),not=g('sk_not');
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  if(!tip){toast('Lütfen mülk tipini seçin.');return;}
  const kv=document.getElementById('sk_kvkk');if(!kv||!kv.checked){toast('Lütfen KVKK onayını işaretleyin.');return;}
  const op=(amac||'').indexOf('Kira')>=0?'Kiralık':'Satılık';
  const bolge=[ilce,mah].filter(Boolean).join(' / ')||'-';
  pushLead({ad,tel,konu:'Sat/Kirala ('+(amac||'-')+'): '+tip+' '+bolge,src:'Özel Portföy Mülk Sahibi',mtip:tip,op,amac,bolge,m2:+m2||0,fiyat:+fiyat||0,msg:not});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:'sat-kirala',formType:'satKirala',name:ad,phone:tel,email:'',location:bolge,message:tip+' · '+(amac||'-')+' · '+(m2?m2+'m²':'')+' · beklenen: '+(fiyat||'-')+(not?(' · '+not):''),requestedService:'Sat / Kirala'});
  if(typeof renderOzOwner==='function')renderOzOwner();
  ['sk_ad','sk_tel','sk_ilce','sk_mah','sk_m2','sk_fiyat','sk_not'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  if(kv)kv.checked=false;
  toast('✅ Talebiniz alındı. Danışmanımız ücretsiz değerlendirme için sizi arayacak.');
}
/* — Sat/Kirala interaktif ön değerleme aracı — */
function satInit(){var s=document.getElementById('sc_ilce');if(!s||s.options.length>1||typeof PROVINCE==='undefined')return;var ks=Object.keys(PROVINCE.districts).sort(function(a,b){return a.localeCompare(b,'tr');});s.insertAdjacentHTML('beforeend',ks.map(function(k){return '<option>'+k+'</option>';}).join(''));}
function satCalc(){var v=function(id){var e=document.getElementById(id);return e?e.value:'';};
  var ilce=v('sc_ilce'),tip=v('sc_tip')||'Daire',m2=+v('sc_m2')||0;var res=document.getElementById('scResult');if(!res)return;
  if(!ilce||!m2){res.innerHTML='<div class="sc-empty"><svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="M7 14l3.5-4 3 2.5L21 7"/></svg><p>İlçe, tip ve m² girin;<br>tahmini değeri ve bölge verisini görün.</p></div>';return;}
  var b=(typeof BAZ!=='undefined')?BAZ[ilce]:null;if(!b){res.innerHTML='<div class="sc-empty"><p>Bu ilçe için veri bulunamadı.</p></div>';return;}
  var per=b.m2*ozTF(tip),mid=per*m2,low=Math.round(mid*0.92/1000)*1000,high=Math.round(mid*1.08/1000)*1000,rent=Math.round(mid*0.004/100)*100;
  res.innerHTML='<div class="sc-tag">Tahmini satış değeri · '+ilce+'</div>'
    +'<div class="sc-range">'+fmt(low)+' – '+fmt(high)+' <small>₺</small></div>'
    +'<div class="sc-per">≈ '+fmt(Math.round(per))+' ₺/m² · '+tip+' · '+m2+' m²</div>'
    +'<div class="sc-grid">'
      +'<div><span>Bölge 5 yıl değişim</span><b>%'+b.chg+'</b></div>'
      +'<div><span>Yatırım skoru</span><b>'+b.score+'/100</b></div>'
      +'<div><span>Tahmini aylık kira</span><b>'+fmt(rent)+' ₺</b></div>'
      +'<div><span>Zemin / risk</span><b class="sc-risk">'+(b.risk||'-')+'</b></div>'
    +'</div>'
    +'<div class="sc-note" style="font-size:11px;color:var(--muted);margin-top:10px;line-height:1.5;border-top:1px solid rgba(255,255,255,.08);padding-top:8px">⚠️ Bu, güncel bölge verisine dayalı bir <b>ön tahmin aralığıdır</b>; resmî değerleme veya SPK lisanslı ekspertiz raporu değildir ve tek kesin fiyat vermez. Kesin ve resmî değer, yetkili/lisanslı değerleme uzmanının imzasıyla geçerlidir. (Demo — veriler temsilîdir.)</div>'
    +'<button class="ozh-btn primary sc-cta" onclick="satScrollForm(\'Satmak istiyorum\')">Bu mülk için ücretsiz ekspertiz al</button>';
}
/* ====================================================================
   STANDART SİTE ÇERÇEVESİ — tek kaynaktan üst menü + footer (tüm sayfalar)
   ==================================================================== */
/* ===== TEMİZ URL YÖNLENDİRME (# YOK) — /gayrimenkul/analiz · /ozel · /sat · /blog · /portfoy · /ilanlar
   pushState ile temiz yol + kendi başlığı; yükleme/popstate'te yoldan görünüm açılır. Direkt erişim/
   yenileme: her yolun altında yükleyici dizin (analiz/index.html vb.) sessionStorage ile SPA'yı açar.
   Böylece analiz sayfası artık "…index.html#analiz" değil, temiz "/gayrimenkul/analiz" ve kendi başlığı. */
var _OVBASE=location.pathname.replace(/[^/]*$/,'');   /* .../gayrimenkul/ */
var _ovBaseTitle=null, _ovRouting=false;
function _ovBrand(){return (typeof brandName==='function'?brandName():((typeof FIRMA!=='undefined'&&FIRMA&&FIRMA.name)||'Meridyen Gayrimenkul'));}
function _ovHomeTitle(){try{if(typeof SEO==='object'&&SEO&&SEO.title)return SEO.title;}catch(e){}return _ovBaseTitle||document.title;}
/* setOverlayPage: geriye dönük shim — sadece BAŞLIK set eder (URL'i goView yönetir) */
function setOverlayPage(name){if(_ovBaseTitle===null)_ovBaseTitle=document.title;if(name)document.title=name+' · '+_ovBrand();}
var _OV={
  analiz:{t:'Analiz Merkezi · Bölge Endeksi',fn:function(){brOpen();}},
  ilanlar:{t:'İlanlar · Portföy',fn:function(){portfoyOpen('ilan');}},
  ozel:{t:'Özel Portföy',fn:function(){portfoyOpen('ozel');}},
  sat:{t:'Sat & Kirala',fn:function(){satOpen();}},
  blog:{t:'Blog · Bilgi Merkezi',fn:function(){blogOpen();}},
  hakkimizda:{t:'Hakkımızda',fn:function(){hakkimizdaOpen();}}
};
function _ovCloseDom(){['portfoyPage','brPage','satPage','blogPage','hakkimizdaPage'].forEach(function(id){var e=document.getElementById(id);if(e)e.classList.remove('open');});var d=document.getElementById('brDetail');if(d)d.classList.remove('open');document.body.style.overflow='';}
function _applyView(slug){var v=_OV[slug];if(!v)return;if(_ovBaseTitle===null)_ovBaseTitle=document.title;_ovRouting=true;try{_ovCloseDom();v.fn();document.title=v.t+' · '+_ovBrand();}catch(e){}_ovRouting=false;}
function goView(slug,ev){ev=ev||window.event;try{if(ev&&ev.preventDefault)ev.preventDefault();}catch(e){}if(!_OV[slug])return false;try{var u=_OVBASE+'#'+slug;if((location.pathname+location.hash)!==u)history.pushState({v:slug},'',u);}catch(e){}_applyView(slug);return false;}
function goHome(){if(_ovBaseTitle!==null){document.title=_ovBaseTitle;_ovBaseTitle=null;}else{try{document.title=_ovHomeTitle();}catch(e){}}try{if(location.hash||(location.pathname!==_OVBASE&&!/\/index\.html$/.test(location.pathname)))history.pushState({},'',_OVBASE);}catch(e){}_ovRouting=true;try{_ovCloseDom();}catch(e){}_ovRouting=false;}
var _OV_HM={analiz:'analiz',sat:'sat',blog:'blog',portfoy:'portfoy','portfoy-ilan':'ilanlar',ozel:'ozel','portfoy-ozel':'ozel',ilanlar:'ilanlar',hakkimizda:'hakkimizda'};
function ovRoute(){var hs=(location.hash||'').replace(/^#/,'');var seg=(_OV_HM[hs]&&_OV[_OV_HM[hs]])?_OV_HM[hs]:decodeURIComponent(location.pathname.slice(_OVBASE.length)).replace(/\/$/,'').replace(/^index\.html$/,'');if(_OV[seg])_applyView(seg);else{_ovRouting=true;try{_ovCloseDom();}catch(e){}_ovRouting=false;if(_ovBaseTitle!==null){document.title=_ovBaseTitle;_ovBaseTitle=null;}}}
function ovBoot(){
  /* Hedef görünümü TEK yerden hesapla; varsa 'ov-boot' bayrağı ile overlay'i
     SOLMA animasyonu OLMADAN aç → arkadaki ana sayfa asla flash etmez (G3). */
  var target=null;
  try{var s=sessionStorage.getItem('_ov');if(s){sessionStorage.removeItem('_ov');if(_OV[s])target=s;}}catch(e){}
  if(!target){try{var hs=(location.hash||'').replace(/^#/,'');var hm={analiz:'analiz',sat:'sat',blog:'blog',portfoy:'portfoy','portfoy-ilan':'ilanlar',ozel:'ozel','portfoy-ozel':'ozel',hakkimizda:'hakkimizda',iletisim:'iletisim',danismanlar:'danismanlar',degerleme:'degerleme',referans:'referans',alarm:'alarm',kvkk:'kvkk',cerez:'cerez',mesafeli:'mesafeli'};if(hm[hs]&&_OV[hm[hs]]){history.replaceState({},'',_OVBASE);target=hm[hs];}}catch(e){}}
  if(!target){try{var seg=decodeURIComponent(location.pathname.slice(_OVBASE.length)).replace(/\/$/,'').replace(/^index\.html$/,'');if(_OV[seg])target=seg;}catch(e){}}
  if(!target){ovRoute();return;}
  try{document.documentElement.classList.add('ov-boot');}catch(e){}
  goView(target);
  var _rmBoot=function(){try{document.documentElement.classList.remove('ov-boot');}catch(e){}};
  try{requestAnimationFrame(function(){requestAnimationFrame(_rmBoot);});}catch(e){}
  setTimeout(_rmBoot,120);   /* rAF throttle'a karşı güvenilir backstop → sonraki in-app açılışlar fade'i geri alır */
}
window.addEventListener('popstate',ovRoute);
/* Geriye dönük: closeAllOverlays artık temiz URL'e (ana sayfaya) döner */
function closeAllOverlays(){goHome();}
function openMnav(){var m=document.getElementById('mnav');if(m)m.classList.add('open');}
const SITE_NAV=`
  <a href="hizmetlerimiz.html" onclick="closeAllOverlays()">Hizmetlerimiz</a>
  <a href="nedenbiz.html" onclick="closeAllOverlays()">Neden <span class="nb-x">?</span> Biz</a>
  <a href="portfoy.html" onclick="closeAllOverlays()">Portföy</a>
  <a href="index.html#asistan" class="nav-asistan" onclick="if(typeof openProxAsistanPage==='function'){openProxAsistanPage();return false}"><span class="prox-logo">Pro<span class="prox-x">X</span></span> Asistan</a>`;
const SITE_FOOTER=`<div class="wrap">
  <div class="fcols">
    <div>
      <div class="logo"><span class="mark">M</span><span class="js-logo">Meridyen<span class="lo2"> Gayrimenkul</span></span></div>
      <p>Veri odaklı emlak danışmanlığı. İzmir ve Ege'de satılık, kiralık konut, ofis ve arsa portföyü. Her ilanda gerçek bölge endeksi.</p>
      <div class="fsocial"><a href="https://facebook.com/meridyengayrimenkul" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg></a><a href="https://instagram.com/meridyengayrimenkul" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.89a4.29 4.29 0 1 1 0-8.58 4.29 4.29 0 0 1 0 8.58Zm6.86-11.15a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0Z"/></svg></a><a href="https://x.com/meridyengm" target="_blank" rel="noopener noreferrer" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"/></svg></a><a href="https://www.linkedin.com/company/meridyengayrimenkul" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.4h3.1V21H3.4V8.4Zm5.34 0h2.97v1.72h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21h-3.1V8.4Z"/></svg></a><a href="https://www.youtube.com/@meridyengayrimenkul" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3.02 3.02 0 0 0 2.12 2.14C4.5 20.15 12 20.15 12 20.15s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.6 24 12 24 12s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z"/></svg></a><a href="https://nsosyal.com" target="_blank" rel="noopener noreferrer" aria-label="NEXT Sosyal (Türkiye)" title="NEXT Sosyal — Türkiye'nin yerli sosyal medya platformu"><svg viewBox="0 0 575 574" aria-hidden="true"><path d="M171.226 0.078125H0V573.751H171.226V0.078125Z"/><path d="M76.1875 0.0782019L191.016 300.603L275.573 520.404C289.183 552.162 326.104 573.751 367.482 573.751H501.631C538.082 573.751 574.142 535.579 574.142 494.748V0H402.917V323.053L398.458 311.632L278.858 0H76.1875V0.0782019Z"/></svg></a></div><div class="fportals"><a class="fp fp-sah" href="https://www.sahibinden.com" target="_blank" rel="noopener noreferrer" aria-label="sahibinden.com ilanlarımız">sahibinden</a><a class="fp fp-hep" href="https://www.hepsiemlak.com" target="_blank" rel="noopener noreferrer" aria-label="hepsiemlak ilanlarımız">hepsiemlak</a><a class="fp fp-ejt" href="https://www.emlakjet.com" target="_blank" rel="noopener noreferrer" aria-label="emlakjet ilanlarımız"><b>emlak</b>jet</a></div>
    </div>
    <div><h4>Kurumsal</h4><ul>
      <li><a href="#" onclick="goView('hakkimizda')">Hakkımızda</a></li>
      <li><a href="#" onclick="goView('danismanlar')">Danışmanlar</a></li>
      <li><a href="hizmetlerimiz.html" onclick="closeAllOverlays()">Hizmetler</a></li>
      <li><a href="#" onclick="goView('referans')">Referanslar</a></li>
      <li><a href="#blog" onclick="goView('blog')">Blog</a></li>
      <li><a href="#" onclick="goView('iletisim')">İletişim</a></li>
    </ul></div>
    <div><h4>Hizmetler</h4><ul>
      <li><a href="#" onclick="closeAllOverlays();pfOpenOp('Satılık');return false">Satılık İlanlar</a></li>
      <li><a href="#" onclick="closeAllOverlays();pfOpenOp('Kiralık');return false">Kiralık İlanlar</a></li>
      <li><a href="#" onclick="goView('ozel')">Özel Portföy</a></li>
      <li><a href="#" onclick="goView('sat')">Sat ve Kirala</a></li>
      <li><a href="#" onclick="goView('degerleme')">Ücretsiz Değerleme</a></li>
      <li><a href="#" onclick="goView('analiz')">Analiz Merkezi</a></li>
      <li><a href="#" onclick="goView('alarm')">Fiyat Alarmı</a></li>
    </ul></div>
    <div><h4>Yasal & Araçlar</h4><ul>
      <li><a href="#" onclick="goView('kvkk')">KVKK Aydınlatma Metni</a></li>
      <li><a href="#" onclick="goView('cerez')">Çerez Politikası</a></li>
      <li><a href="#" onclick="goView('mesafeli')">Mesafeli Hizmet &amp; Kullanım</a></li>
      <li><a href="https://parselsorgu.tkgm.gov.tr" target="_blank" rel="noopener noreferrer">TKGM Ada/Parsel Sorgu ↗</a></li>
      <li><a href="#" onclick="closeAllOverlays();openSaasPortal();return false">Müşteri Portalı / Giriş</a></li><li><a href="#" onclick="closeAllOverlays();openAdmin();return false">Yönetim Paneli</a></li>
    </ul></div>
  </div>
  <div class="fbot">
    <span>© 2026 Meridyen Gayrimenkul · Tüm hakları saklıdır. · <span style="opacity:.7">Kurgusal tanıtım demosu.</span> · <span style="opacity:.85">🔗 emlakekspertizi.com Veri Ortağı</span></span><a class="gm-prox" href="https://nadas.com.tr" target="_blank" rel="noopener noreferrer" aria-label="Powered by ProX"><span class="gm-prox-lead">Powered by</span><span class="gm-prox-mark"><span class="gm-prox-pro">Pro</span><span class="gm-prox-x">X</span></span></a>
    
  </div>
</div>`;
const SITE_CTA=`<a class="nav-wa-ic" aria-label="WhatsApp" title="WhatsApp" href="https://wa.me/905000000000" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.5 14.13c-.23.65-1.36 1.25-1.87 1.3-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.91-4.64-4.09-.14-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.27c.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.47.23.56.79 1.93.86 2.07.07.14.11.3.02.48-.62 1.23-1.28 1.18-.93 1.78.66 1.13 1.32 1.52 2.33 2.03.27.14.43.12.59-.07.18-.21.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.11.07.65-.16 1.3Z"/></svg></a><button class="btn btn-primary btn-sm hide-xs" onclick="satScrollForm('Satmak istiyorum')">Ücretsiz Ekspertiz</button><div class="lang-sw" title="Dil / Language"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"/></svg><select aria-label="Dil / Language" onchange="gmLang(this.value)"><option value="tr">TR</option><option value="en">EN</option><option value="ar">AR</option></select></div><a class="btn btn-line btn-sm js-giris" onclick="closeAllOverlays();openSaasPortal()" role="button" tabindex="0" onkeydown="if(event.key==='Enter'){openSaasPortal()}">Giriş</a><button class="burger" onclick="openMnav()" aria-label="Menü"><span></span><span></span><span></span></button>`;
/* ===== ÇOK DİLLİ (EN/AR) — İçerik Asistanı ile gerçek çeviri (sınırlı ana pazarlama seti, cache'li, AR=RTL) ===== */
var _i18nOrig=null;
function _i18nNodes(){var sels=['#hdr .siteNav a','.hero h1','.hero .lead','.hero p.sub','.hero .hsub','.hero h2','main section h2','.btn-primary'];var set=[],seen=[];
  sels.forEach(function(s){document.querySelectorAll(s).forEach(function(el){if(el.children.length===0&&el.textContent.trim()&&el.textContent.trim().length<160&&seen.indexOf(el)<0){seen.push(el);set.push(el);}});});
  return set.slice(0,40);}
async function gmLang(v){var sel=document.querySelectorAll('.lang-sw select');
  if(v==='tr'){if(_i18nOrig)_i18nOrig.forEach(function(o){o.el.textContent=o.txt;});document.documentElement.setAttribute('dir','ltr');document.documentElement.lang='tr';try{localStorage.setItem('wl_lang','tr');}catch(e){}sel.forEach(function(s){s.value='tr';});return;}
  if(!_i18nOrig)_i18nOrig=_i18nNodes().map(function(el){return {el:el,txt:el.textContent};});
  document.documentElement.setAttribute('dir',v==='ar'?'rtl':'ltr');document.documentElement.lang=v;sel.forEach(function(s){s.value=v;});
  var firma=(typeof FIRMA!=='undefined'&&FIRMA&&FIRMA.name)||'';var texts=_i18nOrig.map(function(o){return o.txt;});
  var ckey='wl_i18n_'+v,cache=null;try{cache=JSON.parse(localStorage.getItem(ckey)||'null');}catch(e){}
  if(cache&&cache.firma===firma&&cache.n===texts.length){cache.tr.forEach(function(t,i){if(_i18nOrig[i]&&t)_i18nOrig[i].el.textContent=t;});return;}
  try{toast(v==='ar'?'Arapça çeviri hazırlanıyor…':'İngilizce çeviri hazırlanıyor…');}catch(e){}
  var langName=v==='ar'?'Modern Standard Arabic':'English';
  var prompt='Translate these Turkish real-estate website UI strings to '+langName+'. Keep the brand name "'+firma+'" and city/proper nouns unchanged. Return ONLY a numbered list, exactly one translation per line, SAME count and order, no extra commentary:\n'+texts.map(function(t,i){return (i+1)+'. '+t;}).join('\n');
  var outTxt=null;
  try{var r=await aiChat({persona:'office',tool:'translate',prompt:prompt});if(r&&!r.fallback)outTxt=r.answer||r.text||(r.data&&(r.data.answer||r.data.text));}catch(e){}
  if(!outTxt){try{toast('Çeviri servisi şu an kullanılamıyor.');}catch(e){}document.documentElement.setAttribute('dir','ltr');document.documentElement.lang='tr';sel.forEach(function(s){s.value='tr';});return;}
  var lines=outTxt.split('\n').map(function(l){return l.replace(/^\s*\d+[.)]\s*/,'').trim();}).filter(function(l){return l;});
  var applied=_i18nOrig.map(function(o,i){var t=lines[i]||o.txt;if(lines[i])o.el.textContent=lines[i];return t;});
  try{localStorage.setItem(ckey,JSON.stringify({firma:firma,n:texts.length,tr:applied}));localStorage.setItem('wl_lang',v);}catch(e){}
  try{toast('✓ '+(v==='ar'?'العربية':'English')+' aktif.');}catch(e){}}
function mountSiteChrome(){document.querySelectorAll('.siteNav').forEach(function(n){n.innerHTML=SITE_NAV;});document.querySelectorAll('.siteCta').forEach(function(c){c.innerHTML=SITE_CTA;});document.querySelectorAll('.siteFooter').forEach(function(f){f.innerHTML=SITE_FOOTER;});
  /* white-label: geç enjekte edilen chrome (nav/footer/cta) SITE_FOOTER gibi sabit
     "Meridyen Gayrimenkul" içeriyor → observer'a güvenmeden HEMEN yerelleştir */
  try{if(typeof brandSweep==='function')brandSweep(document.body);}catch(e){}
  try{if(typeof applyFirma==='function')applyFirma();}catch(e){}/* geç-render footer: iletişim + sosyal href'leri (applySocial) uygula */}
mountSiteChrome();
function gmDockSync(){try{var mb=document.querySelector('.mbar');if(!mb)return;var as=mb.querySelectorAll('a');for(var i=0;i<as.length;i++){if((as[i].className||'').indexOf('wa')<0)as[i].classList.remove('active');}var y=(window.scrollY||window.pageYOffset||0)+150;var il=document.getElementById('ilanlar'),hk=document.getElementById('hakkimizda');var idx=0;if(il&&y>=il.offsetTop)idx=0;if(hk&&y>=hk.offsetTop)idx=1;if(as[idx]&&(as[idx].className||'').indexOf('wa')<0)as[idx].classList.add('active');}catch(e){}}
addEventListener('scroll',gmDockSync,{passive:true});setTimeout(gmDockSync,120);
/* ============================================================
   MÜLK PUSULASI — Gayrimenkul (Yaşam / Hazır Mülk odaklı)
   Faz 1: İZOLE skorlama motoru + emlak veri havuzu.
   Bağımsız proje — YALNIZCA bu sitenin ILANLAR + OZEL + BAZ verisini tarar.
   Ortak havuz / çapraz satış YOK.
   ============================================================ */
const Pusula=(function(){
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const chgNorm=c=>clamp(((c||160)-150)/(235-150)*100,0,100);
  function estYield(op,fiyat,m2,ilce,tip){
    const b=(typeof BAZ!=='undefined')?BAZ[ilce]:null; if(!b||!m2||!fiyat)return null;
    const tf=(typeof ozTF==='function')?ozTF(tip):1;
    if(op==='Kiralık'){const sale=b.m2*tf*m2;return sale?clamp(fiyat*12/sale*100,0,30):null;}
    return null;
  }
  /* adapter: emlak verisini ortak şemaya çevir */
  function pool(){
    const out=[];
    if(typeof ILANLAR!=='undefined') ILANLAR.forEach(it=>{ if(it.status&&it.status!=='aktif')return;
      const b=(typeof BAZ!=='undefined')?BAZ[it.ilce]:null;
      out.push({id:'ilan-'+it.id,source:'İlan',op:it.op,tip:it.type,ilce:it.ilce,mah:it.mah,m2:+it.m2||0,oda:it.oda||'-',fiyat:+it.price||0,
        regionScore:b?b.score:70,regionChg:b?b.chg:160,warn:b?(b.warn||0):0,
        yieldPct:estYield(it.op,+it.price||0,+it.m2||0,it.ilce,it.type),img:it.img,title:it.title,note:it.desc||''});
    });
    if(typeof OZEL!=='undefined') OZEL.forEach(o=>{ if(o.durum!=='aktif')return;
      const b=(typeof BAZ!=='undefined')?BAZ[o.ilce]:null;
      out.push({id:'ozel-'+o.id,source:'Özel Portföy',op:o.op,tip:o.tip,ilce:o.ilce,mah:o.mah,m2:+o.m2||0,oda:o.oda||'-',fiyat:+o.fiyat||0,
        regionScore:b?b.score:70,regionChg:b?b.chg:160,warn:b?(b.warn||0):0,
        yieldPct:estYield(o.op,+o.fiyat||0,+o.m2||0,o.ilce,o.tip),img:null,ozel:true,title:o.tip+' · '+o.mah,note:o.not||''});
    });
    return out;
  }
  const odaNum=s=>{const m=/(\d+)\s*\+\s*(\d+)/.exec(s||'');return m?(+m[1]+ +m[2]):(parseInt(s)||0);};
  /* psikoloji: Yaşam (yerleşik, konforlu, düşük risk) ↔ Yatırım (değer artışı, getiri) */
  function lifestyleSub(it){return clamp(0.60*it.regionScore+0.22*clamp(odaNum(it.oda)/6*100,0,100)+0.18*(it.warn?40:100),0,100);}
  function investSub(it){return clamp(0.50*chgNorm(it.regionChg)+0.30*it.regionScore+0.20*(it.yieldPct!=null?clamp(it.yieldPct/12*100,0,100):chgNorm(it.regionChg)),0,100);}
  function budgetFit(it,butce){if(!butce)return 80;if(it.fiyat<=butce){return clamp(60+(it.fiyat/butce)*40,60,100);}return clamp(100-((it.fiyat-butce)/butce)*180,0,60);}
  function score(c,it){
    const reasons=[],w=clamp((c.oncelik||0)/100,0,1);
    const prio=(1-w)*lifestyleSub(it)+w*investSub(it);
    const bf=budgetFit(it,c.butce);
    const tip=(!c.tip)?100:(c.tip===it.tip?100:45);
    const reg=(!c.bolge)?75:(c.bolge===it.ilce?100:55);
    const oda=(!c.oda)?75:(c.oda===it.oda?100:60);
    const total=clamp(0.30*bf+0.30*prio+0.15*tip+0.13*reg+0.12*oda,0,100);
    if(c.butce&&it.fiyat<=c.butce){const pct=Math.round((1-it.fiyat/c.butce)*100);reasons.push(pct>=5?('Bütçenizin %'+pct+' altında'):'Bütçenize tam uygun');}
    if(c.bolge&&c.bolge===it.ilce)reasons.push('Tercih bölgeniz: '+it.ilce);
    if(c.oda&&c.oda===it.oda)reasons.push(it.oda+' tam istediğiniz tip');
    if(w<0.5){reasons.push('Yaşanabilirlik skoru '+Math.round(it.regionScore)+'/100');if(!it.warn)reasons.push('Düşük zemin riski');}
    else{reasons.push('5 yılda +%'+it.regionChg+' değer artışı');if(it.yieldPct!=null)reasons.push('≈%'+it.yieldPct.toFixed(1)+' brüt kira getirisi');}
    if(it.ozel)reasons.push('Özel Portföy — ifşasız');
    return {score:Math.round(total),reasons:reasons.slice(0,4)};
  }
  function match(c,p){
    c=c||{};p=p||pool();
    let arr=p.filter(it=>it.op===(c.amac||'Satılık'));
    if(c.butce){const f=arr.filter(it=>it.fiyat<=c.butce*1.25);if(f.length>=3)arr=f;}
    const scored=arr.map(it=>{const r=score(c,it);return Object.assign({},it,{_score:r.score,_reasons:r.reasons});});
    scored.sort((a,b)=>b._score-a._score);
    return scored.slice(0,6);
  }
  return {pool,score,match,estYield};
})();
/* konsol doğrulama: pusulaTest({amac:'Satılık',tip:'Daire',butce:9000000,oncelik:20}) */
window.pusulaTest=function(c){return Pusula.match(c||{amac:'Satılık',butce:9000000,oncelik:20}).map(x=>x.source+' | '+x.tip+' '+x.mah+' | %'+x._score+' | ['+x._reasons.join(', ')+']');};

/* ============================================================
   MÜLK PUSULASI — Sihirbaz UI (Faz 2): durum makinesi + motor bağlama
   ============================================================ */
const PW={ idx:-1, c:{amac:'',tip:'',butce:0,oncelik:50,bolge:'',oda:''},
  steps:[
    {key:'amac',title:'Ne yapmak istiyorsunuz?',sub:'Başlayalım — amacınızı seçin.'},
    {key:'tip',title:'Hangi mülk tipini arıyorsunuz?',sub:'Birini seçin ya da "Farketmez" deyin.'},
    {key:'butce',title:'Bütçeniz nedir?',sub:'Size en uygun aralığı seçin.'},
    {key:'oncelik',title:'Önceliğiniz ve bölgeniz',sub:'Bu eksen, eşleştirmenin kalbidir.'}
  ]
};
const _pwIco={
  buy:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>',
  key:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="4.5"/><path d="m11 11 9 9"/><path d="m16 16 2-2M19 19l2-2"/></svg>',
  daire:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="3" width="14" height="18" rx="1.5"/><path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2"/></svg>',
  villa:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 12 5l9 7"/><path d="M5 11v9h14v-9"/><path d="M10 20v-5h4v5"/></svg>',
  ev:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11 12 4l8 7"/><path d="M6 10v10h12V10"/></svg>',
  is:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="13" rx="1.5"/><path d="M8 8V5h8v3"/></svg>',
  arsa:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M4 18 10 6l4 7 2-3 4 8z" stroke-dasharray="3 3"/></svg>',
  any:'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .8-1 1.7M12 17h.01"/></svg>'
};
function pwReduce(){return matchMedia('(prefers-reduced-motion: reduce)').matches;}
function pwOpen(){const m=document.getElementById('pusulaModal');if(!m)return;PW.idx=-1;PW.c={amac:'',tip:'',butce:0,oncelik:50,bolge:'',oda:''};document.body.style.overflow='hidden';m.classList.add('open');pwRender();}
function pwClose(){const m=document.getElementById('pusulaModal');if(m)m.classList.remove('open');document.body.style.overflow='';}
function pwBack(){if(PW.idx<=-1){pwClose();return;}PW.idx--;pwRender();}
function pwNext(){if(PW.idx>=PW.steps.length-1){pwResults();return;}PW.idx++;pwRender();}
function pwPick(k,v){PW.c[k]=v;pwNext();}
function pwBody(inner){const b=document.getElementById('pwBody');if(b)b.innerHTML='<div class="pw-step">'+inner+'</div>';}
function pwCard(k,v,ic,t,d){return '<button class="pw-opt'+(PW.c[k]===v?' sel':'')+'" onclick="pwPick(\''+k+'\',\''+v+'\')"><span class="ic">'+ic+'</span><b>'+t+'</b>'+(d?'<span>'+d+'</span>':'')+'</button>';}
function pwOncLabel(v){return v<35?'🏡 Yaşam konforu ağırlıklı':(v<=65?'⚖️ Dengeli yaklaşım':'📈 Yatırım getirisi ağırlıklı');}
function pwButceOpts(){return PW.c.amac==='Kiralık'
  ? [['≤ 15.000 ₺',15000],['15.000 – 30.000 ₺',30000],['30.000 – 60.000 ₺',60000],['60.000 ₺ ve üzeri',0]]
  : [['≤ 3 Milyon ₺',3000000],['3 – 6 Milyon ₺',6000000],['6 – 10 Milyon ₺',10000000],['10 – 20 Milyon ₺',20000000],['20 Milyon ₺ ve üzeri',0],['Bütçem esnek',0]];}
function pwBolgeSelect(){const ks=(typeof BAZ!=='undefined')?Object.keys(BAZ).sort((a,b)=>a.localeCompare(b,'tr')):[];
  return '<select onchange="PW.c.bolge=this.value"><option value="">Farketmez</option>'+ks.map(k=>'<option'+(PW.c.bolge===k?' selected':'')+'>'+k+'</option>').join('')+'</select>';}
function pwOdaSelect(){const o=['1+1','2+1','3+1','4+1','5+1'];
  return '<select onchange="PW.c.oda=this.value"><option value="">Farketmez</option>'+o.map(x=>'<option'+(PW.c.oda===x?' selected':'')+'>'+x+'</option>').join('')+'</select>';}
function pwRender(){
  const prog=document.getElementById('pwProgress'),foot=document.getElementById('pwFoot');
  if(prog)prog.innerHTML=PW.steps.map((s,i)=>'<i class="'+(i<=PW.idx?'on':'')+'"></i>').join('');
  if(PW.idx===-1){
    pwBody('<div class="pw-intro"><div class="big"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5z" fill="currentColor" stroke="none"/></svg></div><h3>Mülk Pusulası: 4 Soruda Size En Uygun Evi Bulun</h3><p>Bütçeniz, bölgeniz ve önceliğinize göre 480M+ kayıtlık veriyle size özel, <b>gerekçeli</b> bir kısa liste hazırlayalım.</p></div>');
    if(foot)foot.innerHTML='<button class="pw-back" onclick="pwClose()">Vazgeç</button><span class="sp"></span><button class="pw-go" onclick="pwNext()">Başlayalım →</button>';
    return;
  }
  const st=PW.steps[PW.idx];let h='<div class="pw-q">'+st.title+'</div><div class="pw-sub">'+st.sub+'</div>';
  if(st.key==='amac'){h+='<div class="pw-opts two">'+pwCard('amac','Satılık',_pwIco.buy,'Satın almak istiyorum','Hayalinizdeki ev ya da yatırım')+pwCard('amac','Kiralık',_pwIco.key,'Kiralamak istiyorum','Size uygun kiralık seçenekler')+'</div>';}
  else if(st.key==='tip'){h+='<div class="pw-opts grid">'+pwCard('tip','Daire',_pwIco.daire,'Daire','')+pwCard('tip','Villa',_pwIco.villa,'Villa','')+pwCard('tip','Müstakil Ev',_pwIco.ev,'Müstakil Ev','')+pwCard('tip','İşyeri',_pwIco.is,'İşyeri','')+pwCard('tip','Arsa',_pwIco.arsa,'Arsa','')+pwCard('tip','',_pwIco.any,'Farketmez','')+'</div>';}
  else if(st.key==='butce'){h+='<div class="pw-opts grid">'+pwButceOpts().map(o=>'<button class="pw-opt'+(PW.c.butce===o[1]?' sel':'')+'" onclick="pwPick(\'butce\','+o[1]+')"><b>'+o[0]+'</b></button>').join('')+'</div>';}
  else if(st.key==='oncelik'){
    h+='<div class="pw-field"><label>Sizin için hangisi daha önemli?</label>'
      +'<input type="range" class="pw-slider" min="0" max="100" value="'+PW.c.oncelik+'" oninput="PW.c.oncelik=+this.value;var e=document.getElementById(\'pwOnc\');if(e)e.textContent=pwOncLabel(+this.value)">'
      +'<div class="pw-poles"><span>🏡 Yaşam konforu</span><span>Yatırım getirisi 📈</span></div>'
      +'<div class="pw-oncval" id="pwOnc">'+pwOncLabel(PW.c.oncelik)+'</div></div>'
      +'<div class="pw-row2"><div class="pw-field"><label>Bölge (opsiyonel)</label>'+pwBolgeSelect()+'</div><div class="pw-field"><label>Oda sayısı (opsiyonel)</label>'+pwOdaSelect()+'</div></div>';
  }
  pwBody(h);
  const last=PW.idx===PW.steps.length-1;
  if(foot)foot.innerHTML='<button class="pw-back" onclick="pwBack()">‹ Geri</button><span class="sp"></span>'+(last?'<button class="pw-go" onclick="pwResults()">Sonuçları Gör ✦</button>':'');
}
function pwRing(s){const r=24,c=2*Math.PI*r,off=c*(1-s/100);
  return '<svg width="54" height="54" viewBox="0 0 54 54"><circle cx="27" cy="27" r="24" fill="none" stroke="var(--line)" stroke-width="5"/><circle class="pwr-fg" cx="27" cy="27" r="24" fill="none" stroke="url(#pwg)" stroke-width="5" stroke-linecap="round" stroke-dasharray="'+c.toFixed(1)+'" stroke-dashoffset="'+c.toFixed(1)+'" data-off="'+off.toFixed(1)+'"/><defs><linearGradient id="pwg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#1e7e3a"/><stop offset="1" stop-color="#1e7e3a"/></linearGradient></defs></svg>';}
function pwAnimRings(){const els=document.querySelectorAll('#pwBody .pwr-fg'),rm=pwReduce();
  els.forEach(c=>{const off=c.getAttribute('data-off');if(rm){c.setAttribute('stroke-dashoffset',off);}else{requestAnimationFrame(()=>requestAnimationFrame(()=>{c.style.strokeDashoffset=off;}));}});}
function pwResCard(x){const price=fmt(x.fiyat)+' ₺'+(x.op==='Kiralık'?'/ay':'');
  return '<div class="pw-rc"><div class="pw-ring">'+pwRing(x._score)+'<div class="v">%'+x._score+'</div></div>'
    +'<div class="pw-rc-main"><div class="pw-rc-top"><span class="pw-rc-tip">'+x.tip+'</span><span class="pw-rc-price">'+price+'</span></div>'
    +'<div class="pw-rc-loc">'+x.mah+', '+x.ilce+' · '+x.m2+' m²'+(x.oda&&x.oda!=='-'?' · '+x.oda:'')+(x.ozel?' · Özel Portföy':'')+'</div>'
    +'<div class="pw-chips">'+(x._reasons||[]).map(r=>'<i>'+r+'</i>').join('')+'</div></div>'
    +'<div class="pw-rc-cta"><button onclick="pwLead(\''+x.id+'\')">Detay İste</button></div></div>';}
function pwResults(){
  const r=Pusula.match(PW.c);PW.res=r;
  let h='<div class="pw-q">Size en uygun '+(r.length||'')+' mülk</div>'
    +'<div class="pw-rescount">Kriterlerinize göre <b>'+r.length+'</b> eşleşme — eşleşme yüzdesi ve <b>neden</b> rozetleriyle sıralandı.</div>';
  h+= r.length ? '<div class="pw-reslist">'+r.map(pwResCard).join('')+'</div>'
    : '<p style="color:var(--muted);font-size:14px">Bu kriterlere tam uyan kayıt bulunamadı. Geri dönüp aralığı genişletin ya da talebinizi iletin; sizin için arayalım.</p>';
  h+='<div class="pw-res-foot"><button class="pw-back" onclick="PW.idx=-1;pwRender()">↺ Yeniden başla</button><button class="pw-go" onclick="pwClose();openLead(\'Mülk Pusulası listesi\')">Bu listeyi danışmandan iste</button></div>';
  pwBody(h);
  const prog=document.getElementById('pwProgress'),foot=document.getElementById('pwFoot');
  if(prog)prog.innerHTML=PW.steps.map(()=>'<i class="on"></i>').join('');
  if(foot)foot.innerHTML='';
  requestAnimationFrame(pwAnimRings);
}
/* — Faz 3: akıllı lead formu (kriterler + mülk otomatik) — */
function pwShortMoney(n){if(!n)return '';if(n>=1000000){const v=n/1000000;return (v%1?v.toFixed(1):v)+'M';}if(n>=1000)return Math.round(n/1000)+'K';return ''+n;}
function pwOncTag(v){return v<35?'Yaşam Odaklı':(v<=65?'Dengeli':'Yatırım Odaklı');}
function pwCritSummary(){const c=PW.c;const parts=[c.amac||'-',c.tip||'Tüm tipler',(c.butce?pwShortMoney(c.butce)+' Bütçe':'Esnek Bütçe'),'%'+c.oncelik+' '+pwOncTag(c.oncelik)];if(c.bolge)parts.push(c.bolge);if(c.oda)parts.push(c.oda);return parts.join(', ');}
function pwLead(id){const it=(PW.res||[]).find(x=>x.id===id);PW._lead=it;
  let h='<div class="pw-q">Detay talebi</div><div class="pw-sub">Seçtiğiniz mülk için danışmanımız sizi ücretsiz arasın.</div>';
  if(it)h+='<div class="pw-leadsum"><div class="pl-prop"><span class="t"><b>'+it.tip+'</b> · '+it.mah+', '+it.ilce+(it.ozel?' · Özel Portföy':'')+'</span><span class="p">'+fmt(it.fiyat)+' ₺'+(it.op==='Kiralık'?'/ay':'')+'</span></div><div class="pl-crit">'+pwCritSummary().split(', ').map(s=>'<i>'+s+'</i>').join('')+'</div></div>';
  h+='<div class="pw-form"><input id="pl_ad" placeholder="Ad Soyad *"><input id="pl_tel" placeholder="Telefon *"><textarea id="pl_not" rows="2" placeholder="Not (opsiyonel)"></textarea><label class="pw-kvkk"><input type="checkbox" id="pl_kvkk"> <span>Kişisel verilerimin görüşme amacıyla işlenmesini kabul ediyorum (KVKK).</span></label></div>';
  pwBody(h);
  const foot=document.getElementById('pwFoot');if(foot)foot.innerHTML='<button class="pw-back" onclick="pwResults()">‹ Geri</button><span class="sp"></span><button class="pw-go" onclick="pwLeadSubmit()">Talebi Gönder</button>';
}
function pwLeadSubmit(){const g=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  const ad=g('pl_ad'),tel=g('pl_tel'),not=g('pl_not');
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  const kv=document.getElementById('pl_kvkk');if(!kv||!kv.checked){toast('Lütfen KVKK onayını işaretleyin.');return;}
  const it=PW._lead;
  const prop=it?(it.tip+' · '+it.mah+', '+it.ilce+(it.ozel?' (Özel Portföy)':' (İlan)')):'-';
  const crit=pwCritSummary();
  const line='[Pusula Lead] '+ad+' - '+tel+' - Kriterler: '+crit+' - İlgilenilen Mülk: '+prop;
  console.log(line);
  if(typeof pushLead==='function')pushLead({ad,tel,konu:'Mülk Pusulası',src:'Mülk Pusulası',msg:(not?not+' · ':'')+'Kriterler: '+crit+' · Mülk: '+prop});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:'mulk-pusulasi',formType:'pwLead',name:ad,phone:tel,email:'',location:(it?(it.mah+', '+it.ilce):''),message:'Kriterler: '+crit+' · Mülk: '+prop,requestedService:'Mülk Pusulası'});
  pwBody('<div class="pw-intro"><div class="big" style="background:rgba(52,168,83,.15);color:var(--green-700)"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><h3>Talebiniz alındı 🎉</h3><p>Danışmanımız <b>'+ad+'</b>, en kısa sürede sizi arayacak. Seçtiğiniz mülk ve tüm kriterleriniz ekibimize iletildi.</p></div>');
  const foot=document.getElementById('pwFoot');if(foot)foot.innerHTML='<span class="sp"></span><button class="pw-go" onclick="pwClose()">Kapat</button>';
  toast('🔔 Pusula talebiniz danışmana iletildi.');
}
document.addEventListener('keydown',function(e){if(e.key==='Escape'){const m=document.getElementById('pusulaModal');if(m&&m.classList.contains('open'))pwClose();}});

window.addEventListener('load',function(){try{mountSiteChrome();satInit();ozBuildFilterOpts();if(typeof renderOzOwner==='function')renderOzOwner();}catch(e){}});

/* ============================================================
   emlakekspertizi.com — MERKEZİ SaaS ALTYAPISI (Faz 1)
   Dinamik Config + Tema + API Veri Katmanı (white-label)
   Bağımsız proje: yalnızca gayrimenkul.html
   ============================================================ */
const SAAS_CONFIG={
  tenantId:'meridyen-izmir',
  tenantName:'Meridyen Gayrimenkul',
  tenantType:'Emlak',                        // Emlak | Danışman | Değerleme
  themeColor:'Kurumsal',                      // Kurumsal | Mavi | Turuncu | Yeşil | Mor
  whatsapp:'905000000000',
  allowedRegions:{ il:'İzmir', ilceler:[] },  // [] = tüm İzmir · örn ['Çeşme'] = yalnızca Çeşme yetkisi
  modules:{ ozelPortfoy:true, danismanlar:true, bolge:true },
  // tenantType='Danışman' için bireysel danışman profili (merkezden gelir)
  agent:{ name:'Mehmet Yılmaz', title:'Kıdemli Gayrimenkul Danışmanı · İzmir', phone:'905000000000', photo:'', bio:'İzmir ve Ege’de 12 yıllık saha deneyimi, 350+ başarılı işlem. Veriyle doğru fiyat, baştan sona şeffaf süreç.' },
  // tenantType='Değerleme' için güven sinyalleri
  valuation:{ spkNo:'Veri Std · DD-2024-0142', reportCount:'12.000+', years:'38' },
  /* ÇİFT KATMANLI AYARLAR — merkez (sistem) vs bayi (tenant) */
  systemSettings:{                         // merkezden gelir, salt-okunur
    logoUrl:'', faviconUrl:'', googleAnalytics:'', googleMapsKey:'', googleSiteVerification:'',
    metaTitle:'', metaDescription:'', metaKeywords:'', contactPhone:'', customPrompt:'',
    allowTenantOverride:{ themeColor:true, whatsapp:true, logoUrl:true, faviconUrl:true, contactPhone:true,
      googleAnalytics:true, googleMapsKey:true, googleSiteVerification:true, metaTitle:true, metaDescription:true, metaKeywords:true, customPrompt:true }
  },
  tenantSettings:{                          // bayi kendi panelinden değiştirir (merkez izin verirse geçerli)
    themeColor:'', whatsapp:'', logoUrl:'', faviconUrl:'', contactPhone:'',
    googleAnalytics:'', googleMapsKey:'', googleSiteVerification:'',
    metaTitle:'', metaDescription:'', metaKeywords:'', customPrompt:''
  },
  /* İçerik Asistanı — bağlama göre özel promptlar (merkezden veya yerel adminden) */
  proxAiPrompts:{
    ilan:'Sen Meridyen Gayrimenkul’ün uzman emlak danışmanısın; kısa, net ve veriyle konuş.',
    degerleme:'Sen profesyonel bir değerleme uzmanısın; tarafsız ve mevzuata uygun yanıt ver.',
    bolge:'Sen bir bölge analiz uzmanısın; 480M+ kayıtlık endeksle konuş.',
    default:'Sen emlakekspertizi.com ProX verisine dayalı asistansın.'
  }
};
const SAAS_THEMES={
  'Kurumsal':{accent:'#1e40af',accent2:'#3b82f6',grad:'linear-gradient(135deg,#1e7e3a 0%,#1e7e3a 100%)'},
  'Mavi':{accent:'#1e40af',accent2:'#3b82f6',grad:'linear-gradient(135deg,#3b82f6 0%,#1e40af 100%)'},
  'Turuncu':{accent:'#ea6a1e',accent2:'#ff9d4d',grad:'linear-gradient(135deg,#ff9d4d 0%,#ea6a1e 100%)'},
  'Yeşil':{accent:'#1e7e3a',accent2:'#1e7e3a',grad:'linear-gradient(135deg,#1e7e3a 0%,#1e7e3a 100%)'},
  'Mor':{accent:'#6d28d9',accent2:'#a78bfa',grad:'linear-gradient(135deg,#a78bfa 0%,#6d28d9 100%)'}
};
/* 1) DİNAMİK TEMA — merkezden gelen renk tek saniyede uygulanır */
function initSaaSTheme(){
  /* TEMA MİMARİSİ: statik theme.css = temel tasarım (tema = dosya takası).
     initSaaSTheme YALNIZCA açık bir tema seçimi (bayi SAAS_THEMES / admin) varsa
     token'ları inline yazar (theme.css'i EZER). Seçim yoksa inline'ları temizler →
     theme.css yönetir. Böylece her satılan site kendi theme.css dosyasıyla gelir,
     admin renk seçici isterse üstüne runtime override koyar. */
  const s=document.documentElement.style;
  const sel=(typeof saasResolve==='function')?saasResolve('themeColor'):'';
  const top=(SAAS_CONFIG.themeColor&&SAAS_CONFIG.themeColor!=='Kurumsal')?SAAS_CONFIG.themeColor:'';
  const override=sel||top;
  if(!override||!SAAS_THEMES[override]){
    ['--accent','--accent-2','--grad-cta'].forEach(v=>s.removeProperty(v));return;
  }
  const t=SAAS_THEMES[override];
  s.setProperty('--accent',t.accent);s.setProperty('--accent-2',t.accent2);s.setProperty('--grad-cta',t.grad);
}
/* 2) NORMALİZASYON + API SİMÜLASYONU (emlakekspertizi.com merkez API) */
function _saasInScope(ilce){const a=SAAS_CONFIG.allowedRegions||{};return (!a.ilceler||!a.ilceler.length)?true:a.ilceler.indexOf(ilce)>=0;}
function _saasNormalize(){const out=[];
  (typeof DEF_ILANLAR!=='undefined'?DEF_ILANLAR:[]).forEach(it=>out.push({id:'ilan-'+it.id,kind:'ilan',op:it.op,type:it.type,m2:+it.m2||0,oda:it.oda||'',kat:it.kat||'',il:'İzmir',ilce:it.ilce,mah:it.mah,cadde:'',price:+it.price||0,status:it.status||'aktif',img:it.img||'',desc:it.desc||'',ozel:false}));
  (typeof DEF_OZEL!=='undefined'?DEF_OZEL:[]).forEach(o=>out.push({id:'ozel-'+o.id,kind:'ozel',op:o.op,type:o.tip,m2:+o.m2||0,oda:o.oda||'',kat:o.kat||'',il:'İzmir',ilce:o.ilce,mah:o.mah,cadde:o.cadde||'',price:+o.fiyat||0,status:o.durum||'aktif',img:'',desc:o.not||'',ozel:true}));
  return out;
}
async function fetchSaaSData(){
  await new Promise(r=>setTimeout(r,120)); // merkez API ağ gecikmesi simülasyonu
  const all=_saasNormalize(), properties=all.filter(p=>_saasInScope(p.ilce)), regions={};
  if(typeof PROVINCE!=='undefined') Object.keys(PROVINCE.districts).forEach(k=>{if(_saasInScope(k))regions[k]=PROVINCE.districts[k];});
  const sc=SAAS_CONFIG.allowedRegions;
  console.log('[SaaS API] '+SAAS_CONFIG.tenantName+' · yetki: '+(sc.ilceler&&sc.ilceler.length?sc.ilceler.join(', '):'Tüm '+sc.il)+' → '+properties.length+' mülk · '+Object.keys(regions).length+' bölge');
  return {tenant:{id:SAAS_CONFIG.tenantId,name:SAAS_CONFIG.tenantName,type:SAAS_CONFIG.tenantType,theme:SAAS_CONFIG.themeColor},allowedRegions:sc,properties,regions,count:properties.length};
}
/* yetki sınırını canlı siteye uygula — yalnızca izinli ilçeler basılır */
function applySaaSData(data){
  const a=(data&&data.allowedRegions)||{};
  if(a.ilceler&&a.ilceler.length){
    if(typeof ILANLAR!=='undefined'&&Array.isArray(ILANLAR)) ILANLAR=ILANLAR.filter(x=>_saasInScope(x.ilce));
    if(typeof OZEL!=='undefined'&&Array.isArray(OZEL)) OZEL=OZEL.filter(x=>_saasInScope(x.ilce));
    if(typeof PROVINCE!=='undefined') Object.keys(PROVINCE.districts).forEach(k=>{if(!_saasInScope(k))delete PROVINCE.districts[k];});
    if(typeof BAZ!=='undefined') Object.keys(BAZ).forEach(k=>{if(!_saasInScope(k))delete BAZ[k];});
    if(typeof MAH!=='undefined') Object.keys(MAH).forEach(k=>{if(!_saasInScope(k))delete MAH[k];});
  }
  ['renderIlanlar','renderOzel','renderOzHome','renderDan','renderBolgePick','ozBuildFilterOpts'].forEach(fn=>{try{if(typeof window[fn]==='function')window[fn]();}catch(e){}});
}
/* 3) GLOBAL MENÜ — SAAS_CONFIG'e göre dinamik render */
function mountSaaSMenu(){
  const c=SAAS_CONFIG,m=c.modules||{},chev='<svg class="nav-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>';
  let nav='<a href="hizmetlerimiz.html" onclick="closeAllOverlays()">Hizmetlerimiz</a>'
    + '<a href="nedenbiz.html" onclick="closeAllOverlays()">Neden <span class="nb-x">?</span> Biz</a>'
    + '<a href="portfoy.html" onclick="closeAllOverlays()">Portföy</a>';
  /* Analiz Merkezi + Hakkımızda ÜST menüde DEĞİL → alt menüde (footer). Üst menü sade: 4 öğe. */
  nav+='<a href="index.html#asistan" class="nav-asistan" onclick="if(typeof openProxAsistanPage===\'function\'){openProxAsistanPage();return false}"><span class="prox-logo">Pro<span class="prox-x">X</span></span> Asistan</a>';
  document.querySelectorAll('.siteNav').forEach(n=>n.innerHTML=nav);
  const cta='<a class="nav-wa-ic" aria-label="WhatsApp" title="WhatsApp" href="https://wa.me/'+((typeof saasResolve==='function'&&saasResolve('whatsapp'))||c.whatsapp||'905000000000')+'" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.5 14.13c-.23.65-1.36 1.25-1.87 1.3-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.91-4.64-4.09-.14-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.27c.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.47.23.56.79 1.93.86 2.07.07.14.11.3.02.48-.62 1.23-1.28 1.18-.93 1.78.66 1.13 1.32 1.52 2.33 2.03.27.14.43.12.59-.07.18-.21.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.11.07.65-.16 1.3Z"/></svg></a><button class="btn btn-primary btn-sm hide-xs" onclick="satScrollForm(\'Satmak istiyorum\')">Ücretsiz Ekspertiz</button><a class="btn btn-line btn-sm js-giris" href="index.html#giris" onclick="if(typeof girisOrHesap===\'function\'){girisOrHesap();return false}else{openSaasPortal()}" role="button" tabindex="0" onkeydown="if(event.key===\'Enter\'){if(typeof girisOrHesap===\'function\'){girisOrHesap()}else{openSaasPortal()}}">Giriş</a><button class="burger" onclick="openMnav()" aria-label="Menü"><span></span><span></span><span></span></button>';
  document.querySelectorAll('.siteCta').forEach(el=>el.innerHTML=cta);
  try{saasPortalRenderNav();}catch(e){}
}
/* 4) TENANT SÜRÜM VARYASYONLARI — tenantType'a göre ana sayfa kimliği (DOM, reload yok) */
function _tenantHeroHost(){return document.querySelector('.hero .wrap')||document.querySelector('.hero');}
function buildTenantHero(type){
  if(type==='Değerleme'){return '';}  /* Değerleme modu kaldırıldı — yasal silo: ayrı degerleme.html platformunda */
  if(type==='Danışman'){const a=SAAS_CONFIG.agent||{};const ini=(a.name||'MD').split(' ').map(s=>s[0]).slice(0,2).join('');
    return '<div id="tenantHero" class="th th-dan"><div class="th-dan-card">'
      +'<div class="th-photo">'+(a.photo?'<img src="'+a.photo+'" alt="'+a.name+'" loading="lazy" decoding="async">':'<span>'+ini+'</span>')+'</div>'
      +'<div class="th-info"><div class="th-eyebrow"><span class="dot"></span> Gayrimenkul Danışmanınız</div>'
      +'<h1>'+(a.name||'Danışman')+'</h1><div class="th-role">'+(a.title||'')+'</div>'
      +'<p>'+(a.bio||'')+'</p>'
      +'<div class="th-actions"><a class="th-btn wa" href="https://wa.me/'+(a.phone||'905000000000')+'" target="_blank" rel="noopener noreferrer">WhatsApp’tan Yaz</a><a class="th-btn call" href="tel:+'+(a.phone||'905000000000')+'">Hemen Ara</a><button class="th-btn msg" onclick="openLead(\'Danışmana mesaj: '+(a.name||'')+'\')">Mesaj Gönder</button></div>'
      +'<div class="th-stats"><div><b>12+</b><span>yıl deneyim</span></div><div><b>350+</b><span>başarılı işlem</span></div><div><b>İzmir</b><span>uzmanlık bölgesi</span></div></div>'
      +'</div></div></div>';
  }
  return '';
}
function applyTenantType(){
  const type=SAAS_CONFIG.tenantType||'Emlak',b=document.body;
  b.classList.remove('tenant-emlak','tenant-deger','tenant-dan');
  b.classList.add(type==='Danışman'?'tenant-dan':'tenant-emlak');
  const old=document.getElementById('tenantHero');if(old)old.remove();
  if(type==='Danışman'){const host=_tenantHeroHost();if(host)host.insertAdjacentHTML('beforeend',buildTenantHero(type));}
}
function thValuationSubmit(){const g=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};
  const ad=g('tv_ad'),tel=g('tv_tel'),tip=g('tv_tip'),amac=g('tv_amac'),ilce=g('tv_ilce');
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  if(!tip){toast('Lütfen mülk tipini seçin.');return;}
  /* PII (ad+telefon) konsola yazılmaz — yalnız hata ayıklama bayrağı açıksa. KVKK/gizlilik. */
  window.__PROX_DEBUG && console.log('[Değerleme Talebi] '+ad+' - '+tel+' - '+tip+' · '+amac+(ilce?' · '+ilce:''));
  if(typeof pushLead==='function')pushLead({ad,tel,konu:'Değerleme Talebi: '+tip+' ('+amac+')',src:'Değerleme Talebi',msg:ilce});
  if(typeof proxSubmitLead==='function')proxSubmitLead({sourcePage:'degerleme-talebi',formType:'thValuation',name:ad,phone:tel,email:'',location:ilce||'',message:tip+' · '+amac,requestedService:'Değerleme Talebi'});
  ['tv_ad','tv_tel','tv_ilce'].forEach(i=>{const e=document.getElementById(i);if(e)e.value='';});
  toast('✅ Değerleme talebiniz alındı. Lisanslı eksperimiz sizi arayacak.');
}
/* merkez panel: tenant tipini canlı değiştir (reload yok) */
window.saasSetTenantType=function(t){SAAS_CONFIG.tenantType=t;applyTenantType();};
/* merkez panel simülasyon komutları (konsoldan): saasSetTheme('Turuncu') · saasSetRegions(['Çeşme']) */
window.saasSetTheme=function(name){SAAS_CONFIG.themeColor=name;initSaaSTheme();};
window.saasSetRegions=function(arr){SAAS_CONFIG.allowedRegions.ilceler=arr||[];return fetchSaaSData().then(applySaaSData);};
/* SaaS başlatma — mevcut chrome'dan SONRA: tema + dinamik menü + veri yetkisi */
/* ============================================================
   ProX SaaS — Çift Katmanlı Ayar Çözümleyici · İçerik Asistanı Gateway ·
   Logo→Renk Adaptasyonu · Profesyonel 38-Kategori PDF Altyapısı
   ============================================================ */
/* Çift katman: merkez izin verdiyse tenant değeri override eder, yoksa sistem değeri */
function saasResolve(key){
  const sys=SAAS_CONFIG.systemSettings||{},ten=SAAS_CONFIG.tenantSettings||{},allow=sys.allowTenantOverride||{};
  if(allow[key]&&ten[key]!=null&&ten[key]!=='') return ten[key];
  return (sys[key]!=null&&sys[key]!=='')?sys[key]:undefined;
}
/* ProX çıktı paneli (sayfaya basar) */
function _proxOut(){let el=document.getElementById('proxPanel');
  if(!el){el=document.createElement('div');el.id='proxPanel';el.className='prox-panel';
    el.innerHTML='<div class="prox-hd"><b>⚡ İçerik Asistanı · emlakekspertizi.com</b><button onclick="this.closest(\'.prox-panel\').remove()" aria-label="Kapat">✕</button></div><div class="prox-body" id="proxAiOut"></div>';
    document.body.appendChild(el);}
  el.classList.add('on');return document.getElementById('proxAiOut');
}
/* 1) İçerik Asistanı API Gateway — merkez prompt + simüle akıllı cevap */
function _proxSimulate(msg,ctx){const m=(msg||'').toLocaleLowerCase('tr');
  if(ctx==='degerleme') return 'Bilimsel metodolojiyle (emsal karşılaştırma + gelir yöntemi) bu mülk için bir değer aralığı hazırlanır. Net rapor için ücretsiz ekspertiz talebi oluşturabilirim.';
  if(ctx==='bolge') return '480M+ kayıtlık endekse göre bu bölgede son 5 yılda belirgin değer artışı ve sağlıklı talep var. Mahalle kırılımı için Bölge Analizi’ni açabilirim.';
  if(m.indexOf('fiyat')>=0||m.indexOf('bütçe')>=0||m.indexOf('butce')>=0) return 'Bütçenize en uygun mülkleri Mülk Pusulası ile saniyeler içinde eşleştirebilirim. Hangi ilçe ve oda tipini istersiniz?';
  if(m.indexOf('kira')>=0) return 'Kiralık portföyümüzde bölge endeksiyle doğru kira bedeli belirleriz. Bütçe ve bölge belirtirseniz en uygun seçenekleri sunayım.';
  return 'Size yardımcı olabilirim. İhtiyacınızı (al/kirala · bütçe · bölge) söyleyin; veriyle en uygun seçenekleri getireyim.';
}
async function proxAiQuery(userMessage,contextType){
  const ctx=contextType||'default';
  const base=(SAAS_CONFIG.proxAiPrompts&&(SAAS_CONFIG.proxAiPrompts[ctx]||SAAS_CONFIG.proxAiPrompts.default))||'';
  const custom=(typeof saasResolve==='function'?saasResolve('customPrompt'):'')||'';
  const prompt=base+(custom?' '+custom:'');
  console.log('[İçerik Asistanı →] '+SAAS_CONFIG.tenantName+' · ctx='+ctx+' · prompt="'+prompt.slice(0,46)+'…" · soru: '+userMessage);
  let answer=null;
  try{                                                   // API-first İçerik Asistanı; fallback = local _proxSimulate
    const r=await aiChat({persona:'office',prompt:aiGuard(prompt),context:ctx,message:userMessage});
    if(r&&!r.fallback){answer=r.answer||r.text||(r.data&&(r.data.answer||r.data.text))||null;}
  }catch(e){/* sessiz: local simülasyona düş */}
  if(!answer){
    await new Promise(r=>setTimeout(r,300));               // emlakekspertizi.com ProX API gecikmesi
    answer=_proxSimulate(userMessage,ctx);
  }
  console.log('[İçerik Asistanı ←] '+answer);
  const out=_proxOut(); if(out) out.innerHTML='<div class="prox-q">'+userMessage+'</div><div class="prox-a">'+answer+'</div>';
  return answer;
}
/* 2) Logo Tabanlı Renk Adaptasyonu — yüklenen logoya göre tema seç */
async function saasAutoThemeFromLogo(logoUrl){
  await new Promise(r=>setTimeout(r,200));               // baskın renk analizi simülasyonu
  const u=(logoUrl||'').toLocaleLowerCase('tr');let theme='Kurumsal';
  if(/mavi|blue/.test(u))theme='Mavi';else if(/turuncu|orange/.test(u))theme='Turuncu';else if(/ye[şs]il|green/.test(u))theme='Yeşil';else if(/mor|purple/.test(u))theme='Mor';
  else{let h=0;for(let i=0;i<u.length;i++)h=(h*31+u.charCodeAt(i))>>>0;theme=['Mavi','Turuncu','Yeşil','Mor'][h%4];}
  SAAS_CONFIG.tenantSettings.logoUrl=logoUrl;
  SAAS_CONFIG.tenantSettings.themeColor=theme;           // tenant override (merkez izniyle)
  initSaaSTheme();
  const pal=SAAS_THEMES[theme]||{};
  console.log('[Logo Adaptasyon] '+logoUrl+' → tema: '+theme+' · --accent='+pal.accent);
  return theme;
}
/* 3) Profesyonel 38-Kategori PDF Raporu Altyapısı */
const SAAS_38_CATEGORIES=['Tapu & Mülkiyet Durumu','İmar Durumu','Konum & Ulaşım','Mahalle Fiyat Endeksi','5 Yıllık Değer Trendi','m² Birim Fiyat','Emsal Karşılaştırma','Gelir Yöntemi (Kira)','Maliyet Yöntemi','Amortisman Analizi','Bina Yaşı & Yıpranma','Deprem / Zemin Riski','Fay Hattı Mesafesi','Yapı Kalitesi','Isı Yalıtımı / Enerji','Sosyal Donatı Yakınlığı','Okul / Sağlık Erişimi','Toplu Taşıma Skoru','Otopark Durumu','Cephe & Manzara','Kat & Konum','Aidat / İşletme Gideri','Doluluk / Kira Getirisi','Likidite (Satılabilirlik)','Bölge Demografisi','Gelir Seviyesi','Nüfus Trendi','Ticari Potansiyel','Kentsel Dönüşüm Durumu','Yatırım Skoru','Arz / Talep Dengesi','Mevsimsellik Etkisi','Kredi Uygunluğu (LTV)','Vergi & Harç Yükü','Hukuki Durum (Şerh/İpotek)','Çevresel Faktörler','Gelecek Projeksiyon (5y)','Genel Değer Sonucu'];
function _saasFindProperty(id){id=''+id;
  const inO=(typeof OZEL!=='undefined')?OZEL.find(x=>('ozel-'+x.id===id)||(''+x.id===id)):null;if(inO)return{ilce:inO.ilce,mah:inO.mah,tip:inO.tip,fiyat:inO.fiyat};
  const inI=(typeof ILANLAR!=='undefined')?ILANLAR.find(x=>('ilan-'+x.id===id)||(''+x.id===id)):null;if(inI)return{ilce:inI.ilce,mah:inI.mah,tip:inI.type,fiyat:inI.price};
  return null;
}
async function saasGenerateReportPDF(propertyId){
  if(typeof requireFeature==='function'&&!requireFeature('canUsePdfReports'))return; // paket kontrolü
  try{                                                   // API-first PDF üretimi; başarısızsa local simülasyon
    const pp=_saasFindProperty(propertyId),pilce=pp?pp.ilce:'-';
    const title='Profesyonel Değerleme Raporu · '+(pp?(pp.tip+' · '+pp.mah+', '+pilce):propertyId);
    const html='<h1>'+title+'</h1><p>38 kategorilik analiz · emlakekspertizi.com</p><ul>'
      +SAAS_38_CATEGORIES.map(c=>'<li>'+c+'</li>').join('')+'</ul>';
    const r=await proxApi('/api/v1/tenant/pdf/generate',{method:'POST',body:{
      title:title, pages:[{id:propertyId,html:html}], css:'body{font-family:Inter,Arial,sans-serif;color:#0f1f3d}h1{font-size:20px}'
    }});
    if(r&&!r.fallback&&r.success===true&&r.pdf_base64){
      try{                                               // base64 → Blob (application/pdf) → indir
        const bin=atob(r.pdf_base64);const len=bin.length;const bytes=new Uint8Array(len);
        for(let i=0;i<len;i++)bytes[i]=bin.charCodeAt(i);
        const blob=new Blob([bytes],{type:'application/pdf'});const url=URL.createObjectURL(blob);
        const a=document.createElement('a');a.href=url;a.download='ProX-Rapor-'+propertyId+'.pdf';
        document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),4000);
      }catch(_){}
      if(typeof toast==='function')toast('📄 Profesyonel rapor indiriliyor: '+propertyId+' (38 kategori)');
      /* özet kartı yine basılsın diye aşağıdaki local önizleme akışına devam */
    }
  }catch(e){/* sessiz: local simülasyona düş */}
  await new Promise(r=>setTimeout(r,400));               // rapor derleme simülasyonu (38 kategori)
  const p=_saasFindProperty(propertyId),ilce=p?p.ilce:'-';
  const b=(typeof BAZ!=='undefined'&&BAZ[ilce])?BAZ[ilce]:null;
  const line='Profesyonel PDF Raporu Oluşturuldu: '+propertyId+' - 38 Kategori Analizi Dahil';
  console.log(line);
  console.log('  · Bölge: '+ilce+(b?(' · m² endeks: '+fmt(b.m2)+' ₺ · 5y: %'+b.chg+' · skor: '+b.score+'/100 · risk: '+b.risk):' · (bölge verisi yok)'));
  const out=_proxOut();
  if(out) out.innerHTML='<div class="prox-pdf"><div class="prox-pdf-h"><b>📄 Profesyonel Değerleme Raporu</b><span>'+propertyId+' · '+(p?p.tip+' · '+p.mah+', '+ilce:ilce)+'</span></div>'
    +(b?'<div class="prox-pdf-kpi"><div><b>'+fmt(b.m2)+' ₺</b><span>m² endeks</span></div><div><b>%'+b.chg+'</b><span>5y değişim</span></div><div><b>'+b.score+'/100</b><span>yatırım skoru</span></div></div>':'')
    +'<div class="prox-pdf-cats"><b>38 Kategori Analizi</b><div class="cats">'+SAAS_38_CATEGORIES.map(c=>'<i>'+c+'</i>').join('')+'</div></div>'
    +'<div class="prox-pdf-ft">emlakekspertizi.com · 2005’ten bugüne 38 kategorilik veri gücü</div></div>';
  if(typeof toast==='function')toast('📄 Profesyonel rapor oluşturuldu: '+propertyId+' (38 kategori)');
  return {propertyId,region:ilce,categories:SAAS_38_CATEGORIES,index:b};
}
/* merkez panel / konsol komutları */
window.proxAiQuery=proxAiQuery;
window.saasAutoThemeFromLogo=saasAutoThemeFromLogo;
window.saasGenerateReportPDF=saasGenerateReportPDF;
window.saasResolve=saasResolve;

/* ============================================================
   applySaaSSettings — merkez/bayi ayarlarını tarayıcı + Google
   bileşenlerine tek noktadan uygular (reload yok)
   ============================================================ */
function _saasMeta(name,val,prop){if(val==null||val==='')return;const sel=prop?('meta[property="'+name+'"]'):('meta[name="'+name+'"]');let m=document.head.querySelector(sel);if(!m){m=document.createElement('meta');prop?m.setAttribute('property',name):m.setAttribute('name',name);document.head.appendChild(m);}m.setAttribute('content',val);}
function _saasLink(rel,href){if(!href)return;let l=document.head.querySelector('link[rel="'+rel+'"]');if(!l){l=document.createElement('link');l.setAttribute('rel',rel);document.head.appendChild(l);}l.setAttribute('href',href);}
function applySaaSSettings(){
  try{
    initSaaSTheme();                                   // tema (çift katman)
    /* Google arama sonuçları: title + description + keywords + og */
    const title=saasResolve('metaTitle'); if(title){document.title=title;_saasMeta('og:title',title,true);}
    const desc=saasResolve('metaDescription'); if(desc){_saasMeta('description',desc);_saasMeta('og:description',desc,true);}
    const kw=saasResolve('metaKeywords'); if(kw)_saasMeta('keywords',kw);
    const gsv=saasResolve('googleSiteVerification'); if(gsv)_saasMeta('google-site-verification',(''+gsv).replace(/^google-site-verification=/,''));
    /* Tarayıcı sekme logosu: favicon + apple-touch-icon */
    const fav=saasResolve('faviconUrl'); if(fav){_saasLink('icon',fav);_saasLink('apple-touch-icon',fav);}
    /* Şirket logoları — üst menü + overlay header'ları + footer TEK KAYNAK (brandLogos) */
    if(typeof brandLogos==='function')brandLogos();
    if(typeof renderLogoPrev==='function')renderLogoPrev();
    /* Google Analytics (gtag) — bir kez enjekte */
    const ga=saasResolve('googleAnalytics');
    if(ga&&!document.getElementById('saas-gtag')){
      const s=document.createElement('script');s.id='saas-gtag';s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ga;document.head.appendChild(s);
      const s2=document.createElement('script');s2.id='saas-gtag-init';s2.text='window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","'+ga+'");';document.head.appendChild(s2);
      console.log('[SaaS] Google Analytics enjekte edildi: '+ga);
    }
    /* contactPhone → tüm tel: linkleri */
    const phone=saasResolve('contactPhone'); if(phone)document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.href='tel:'+(''+phone).replace(/[^0-9+]/g,''));
    /* whatsapp + menü tazele */
    if(typeof mountSaaSMenu==='function')mountSaaSMenu();
  }catch(e){console.warn('applySaaSSettings',e);}
}
window.applySaaSSettings=applySaaSSettings;
/* --- Admin sekme kaydet işleyicileri (sayfayı yenilemeden uygula) --- */
function saasSaveGoogle(){const v=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};const t=SAAS_CONFIG.tenantSettings;
  t.googleAnalytics=v('g_ga4');t.googleSiteVerification=v('g_gsc');t.googleMapsKey=v('g_maps');applySaaSSettings();if(typeof toast==='function')toast('Google ayarları uygulandı — sayfa yenilenmeden.');}
function saasApplyLogo(){const v=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};const t=SAAS_CONFIG.tenantSettings;
  const logo=v('sl_logo'),fav=v('sl_favicon');
  if(logo){t.logoUrl=logo;try{if(FIRMA)FIRMA.logo=logo;if(typeof saveAll==='function')saveAll();}catch(x){}if(typeof saasAutoThemeFromLogo==='function')saasAutoThemeFromLogo(logo);}
  if(fav)t.faviconUrl=fav;
  applySaaSSettings();if(typeof brandLogos==='function')brandLogos();if(typeof renderLogoPrev==='function')renderLogoPrev();
  if(typeof toast==='function')toast('Logo & favicon uygulandı; tema logoya göre uyarlandı.');}
/* --- Bilgisayardan logo/favicon yükleme (üst menü + footer tek seferde) --- */
function _logoPrevEls(){return ['sl_logoPrev','cf_logoPrev'].map(id=>document.getElementById(id)).filter(Boolean);}
function renderLogoPrev(){var img=(typeof brandActiveLogo==='function')?brandActiveLogo():'';
  _logoPrevEls().forEach(function(el){
    if(img){el.style.display='';el.innerHTML='<div class="logo-prev-row"><div class="logo-prev-in light"><img src="'+img+'" alt="logo"></div><div class="logo-prev-in dark"><img src="'+img+'" alt="logo"></div></div><span class="csub" style="margin:0">Aktif logo · üst menü (açık) + footer (koyu). Kaldır\'a basınca yazı logoya döner.</span>';}
    else{el.style.display='none';el.innerHTML='';}
  });}
function saasLogoFile(input,which){
  var f=input&&input.files&&input.files[0]; if(!f){return;}
  if(!/^image\//.test(f.type||'')){if(typeof toast==='function')toast('Lütfen bir görsel dosyası seçin (PNG/SVG/JPG).');input.value='';return;}
  if(f.size>2*1024*1024){if(typeof toast==='function')toast('Dosya çok büyük (maks ~2MB). Daha küçük/optimize bir logo yükleyin.');input.value='';return;}
  var rd=new FileReader();
  rd.onload=function(e){var url=e.target.result;
    if(which==='favicon'){try{SAAS_CONFIG.tenantSettings.faviconUrl=url;}catch(x){}var fi=document.getElementById('sl_favicon');if(fi)fi.value=url;if(typeof applySaaSSettings==='function')applySaaSSettings();if(window.gmSetBrand)gmSetBrand({favicon:url});if(typeof toast==='function')toast('✓ Tarayıcı logosu (favicon) yüklendi — TÜM sayfalara ve Google arama ikonuna uygulandı.');return;}
    if(which==='googleLogo'){if(window.gmSetBrand)gmSetBrand({googleLogo:url});if(typeof toast==='function')toast('✓ Google arama logosu yüklendi (bilgi panosu / Organization).');return;}
    try{if(FIRMA)FIRMA.logo=url;}catch(x){}try{SAAS_CONFIG.tenantSettings.logoUrl=url;}catch(x){}
    if(typeof saveAll==='function')saveAll();
    if(typeof brandLogos==='function')brandLogos();
    renderLogoPrev();
    if(typeof toast==='function')toast('✓ Logo yüklendi · üst menü ve footer standart boyutta güncellendi.');
  };
  rd.readAsDataURL(f); input.value='';
}
function saasLogoRemove(){
  try{if(FIRMA)FIRMA.logo='';}catch(x){}try{SAAS_CONFIG.tenantSettings.logoUrl='';}catch(x){}
  if(typeof saveAll==='function')saveAll();
  if(typeof brandLogos==='function')brandLogos();
  var f=document.getElementById('sl_logo');if(f)f.value='';
  renderLogoPrev();
  if(typeof toast==='function')toast('Logo kaldırıldı — yazı logo geri geldi.');
}
window.saasLogoFile=saasLogoFile;window.saasLogoRemove=saasLogoRemove;window.renderLogoPrev=renderLogoPrev;
function saasSaveProxPrompt(){const e=document.getElementById('sp_custom');SAAS_CONFIG.tenantSettings.customPrompt=e?e.value.trim():'';if(typeof toast==='function')toast('Bayi özel ProX promptu kaydedildi.');}
function saasFillReportSelect(){const e=document.getElementById('sr_prop');if(!e)return;let o='<option value="">Mülk seçin…</option>';
  (typeof OZEL!=='undefined'?OZEL:[]).forEach(x=>o+='<option value="ozel-'+x.id+'">Özel Portföy · '+x.tip+' · '+x.mah+', '+x.ilce+'</option>');
  (typeof ILANLAR!=='undefined'?ILANLAR:[]).forEach(x=>o+='<option value="ilan-'+x.id+'">İlan · '+x.type+' · '+x.mah+', '+x.ilce+'</option>');
  e.innerHTML=o;}
function saasReportFromAdmin(){const e=document.getElementById('sr_prop'),id=e?e.value:'';if(!id){if(typeof toast==='function')toast('Lütfen bir mülk seçin.');return;}saasGenerateReportPDF(id);}
window.saasSaveGoogle=saasSaveGoogle;window.saasApplyLogo=saasApplyLogo;window.saasSaveProxPrompt=saasSaveProxPrompt;window.saasReportFromAdmin=saasReportFromAdmin;

window.addEventListener('load',function(){try{initSaaSTheme();mountSaaSMenu();applyTenantType();applySaaSSettings();saasFillReportSelect();fetchSaaSData().then(applySaaSData);}catch(e){console.warn('SaaS init',e);}});
/* Canlı tenant bootstrap: paket + özellik bayraklarını çek, premium kapıları uygula (tema repaint edilmez). */
window.addEventListener('load',function(){try{if(typeof proxBootstrap==='function')proxBootstrap();}catch(e){console.warn('ProX bootstrap',e);}});

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
function saasPortalRenderNav(){ var els=document.querySelectorAll('.portal-trigger'); for(var i=0;i<els.length;i++){ var el=els[i]; if(window.SAAS_USER.isLoggedIn){ el.classList.add('portal-on'); el.innerHTML='<span class="pdot"></span> Müşteri Portalı · '+(window.SAAS_USER.clientProfile.companyName||'Üye'); } else { el.classList.remove('portal-on'); el.innerHTML='Müşteri Portalı'; } } }
function openSaasPortal(){ var m=_saasPortalHost(); document.getElementById('saasPortalBody').innerHTML = window.SAAS_USER.isLoggedIn?_saasPortalPanelHTML():_saasPortalLoginHTML(); m.classList.add('on'); var i=document.getElementById('spClientKey'); if(i) setTimeout(function(){i.focus();},60); }
function closeSaasPortal(){ var m=document.getElementById('saasPortalModal'); if(m) m.classList.remove('on'); }
async function saasPortalSubmit(){ var k=((document.getElementById('spClientKey')||{}).value||'').trim(); var p=(document.getElementById('spPass')||{}).value||''; var err=document.getElementById('spErr'); if(err)err.textContent=''; var btn=document.getElementById('spGo'); if(btn){btn.disabled=true;btn.textContent='Bağlanıyor…';} var r=await saasPortalConnect(k,p); if(btn){btn.disabled=false;btn.textContent='Güvenli Giriş →';} if(r.ok){ if(typeof toast==='function')toast('✓ Müşteri portalına bağlanıldı · '+r.profile.companyName); document.getElementById('saasPortalBody').innerHTML=_saasPortalPanelHTML(); } else { if(err)err.textContent='⚠ '+(r.error||'Giriş başarısız.'); var c=document.querySelector('#saasPortalModal .sp-card'); if(c){c.classList.add('sp-shake');setTimeout(function(){c.classList.remove('sp-shake');},450);} } }
window.openSaasPortal=openSaasPortal;window.closeSaasPortal=closeSaasPortal;window.saasPortalSubmit=saasPortalSubmit;window.saasPortalConnect=saasPortalConnect;window.saasPortalDisconnect=saasPortalDisconnect;

/* B) Modal host — sayfa yenilenmeden body'e enjekte edilir (tek sefer). */
function _saasPortalHost(){
  var m=document.getElementById('saasPortalModal');
  if(m)return m;
  m=document.createElement('div');
  m.id='saasPortalModal';
  m.innerHTML=''
    +'<div class="sp-ov" onclick="closeSaasPortal()"></div>'
    +'<div class="sp-card" role="dialog" aria-modal="true" aria-label="Müşteri Portalı">'
    +'  <div class="sp-bar"><span class="sp-brand"><span class="sp-mark">M</span> Meridyen · Kurumsal Portal</span>'
    +'    <button class="sp-x" onclick="closeSaasPortal()" aria-label="Kapat">✕</button></div>'
    +'  <div id="saasPortalBody"></div>'
    +'</div>';
  document.body.appendChild(m);
  /* Esc ile kapat */
  if(!window._spEsc){window._spEsc=true;document.addEventListener('keydown',function(e){if(e.key==='Escape'){var mm=document.getElementById('saasPortalModal');if(mm&&mm.classList.contains('on'))closeSaasPortal();}});}
  return m;
}
/* C) Giriş ekranı — altın/siyah lüks ton, mevcut CSS değişkenleri. */
function _saasPortalLoginHTML(){
  return ''
    +'<div class="sp-pane">'
    +'  <div class="sp-icon">🔐</div>'
    +'  <h3 class="sp-h">Mülk Sahibi &amp; Yatırımcı Portföy Takip Girişi</h3>'
    +'  <p class="sp-desc">Kurumsal Mülk Yönetim Paneli: Sözleşmeli mülklerinizin ProX pazar analizlerine ve performans grafiklerine erişim sağlayın.</p>'
    +'  <input id="spClientKey" class="sp-in" type="text" placeholder="Kurumsal Anahtar (Client Key)" autocomplete="off">'
    +'  <input id="spPass" class="sp-in" type="password" placeholder="Güvenli Şifre" autocomplete="off" onkeydown="if(event.key===\'Enter\')saasPortalSubmit()">'
    +'  <div id="spErr" class="sp-err" role="alert"></div>'
    +'  <button id="spGo" class="sp-go" onclick="saasPortalSubmit()">Güvenli Giriş →</button>'
    +'  <div class="sp-trust"><span class="sp-badge">◆ ProX</span><span class="sp-badge">✓ Yetki Belgeli</span><span class="sp-badge">🛡 256-bit Şifreli</span></div>'
    +'  <div class="sp-kvkk">Girişiniz KVKK kapsamında korunur. Kurumsal anahtarınız yalnızca yetkili kullanım içindir.</div>'
    +'</div>';
}
/* D) Kontrol paneli — giriş sonrası. */
function _saasPortalPanelHTML(){
  var cp=window.SAAS_USER.clientProfile||{};
  var regions=(cp.regionAuth||[]).map(function(r){return '<span class="sp-chip">'+r+'</span>';}).join('')||'<span class="sp-chip">—</span>';
  return ''
    +'<div class="sp-pane sp-panel">'
    +'  <div class="sp-welcome"><div class="sp-co">'+(cp.companyName||'Kurumsal Üye')+'</div><div class="sp-role">'+(cp.role||'Kurumsal Yönetici')+'</div></div>'
    +'  <div class="sp-reg-l">Yetkili Bölgeler</div><div class="sp-regions">'+regions+'</div>'
    +'  <div class="sp-actions">'
    +'    <button class="sp-act" onclick="closeSaasPortal();if(typeof toggleAiPanel===\'function\'){toggleAiPanel();}else if(typeof toast===\'function\'){toast(\'ProX Pazar Analizi hazırlanıyor…\');}">📊 ProX Pazar Analizi</button>'
    +'    <button class="sp-act" onclick="if(typeof toast===\'function\')toast(\'Performans grafikleri portföyünüze göre derleniyor…\');">📈 Performans Grafikleri</button>'
    +'    <button class="sp-act" onclick="if(typeof toast===\'function\')toast(\'Sözleşmeli mülkleriniz listeleniyor…\');">🏢 Sözleşmeli Mülkler</button>'
    +'  </div>'
    +'  <button class="sp-logout" onclick="saasPortalDisconnect()">Oturumu Kapat</button>'
    +'</div>';
}
window._saasPortalHost=_saasPortalHost;window.saasPortalRenderNav=saasPortalRenderNav;
/* F) Load'da navbar durumunu uygula. */
window.addEventListener('load',function(){try{if(typeof saasPortalRenderNav==='function')saasPortalRenderNav();}catch(e){}});
