/* insaat · app-core.js — engine (P1 ayrıştırma; index.html'den) */
var INSAAT_VERSION='v3.0';try{window.INSAAT_VERSION=INSAAT_VERSION;}catch(e){}   /* yayın sürümü — tam kapasite (public+admin+SEO+güvenlik) */
window.addEventListener("error",e=>{if(window.__PROX_DEBUG)console.warn("[caught]",e.message,e.filename+":"+e.lineno);e.preventDefault&&e.preventDefault();return true;});
/* ---------------- DATA ---------------- */
const IMG = {"h0": "img/img1.jpg", "h1": "img/img2.jpg", "h2": "img/img3.jpg", "h3": "img/img4.jpg", "p_res": "img/img5.jpg", "p_lux": "img/img6.jpg", "p_villa": "img/img7.jpg", "p_office": "img/img8.jpg", "p_white": "img/img9.jpg", "p_home": "img/img10.jpg", "about": "img/img11.jpg", "b1": "img/img12.jpg", "b2": "img/img13.jpg", "b3": "img/img14.jpg"};
let SERVICES=[{"i": "🏢", "t": "Konut İnşaatı", "d": "Lüks rezidans, apartman ve site projelerinde anahtar teslim konut üretimi.", "long": "Arsa analizinden anahtar teslime kadar tüm konut üretim sürecini tek çatı altında yönetiyoruz. TBDY 2018 deprem yönetmeliğine uyumlu C30/37 betonarme taşıyıcı sistemler, zemin etüdüne dayalı temel tasarımı, BIM koordinasyonu ve A sınıfı enerji performansıyla; yaşanabilir, değerini koruyan ve nesiller boyu güvenli konutlar inşa ediyoruz.", "mevzuat": ["TBDY 2018", "İmar Kanunu 3194", "Yapı Denetim 4708", "BEP-TR Enerji", "ISO 9001"], "scope": ["Zemin etüdü & jeoteknik rapor", "Mimari + statik + mekanik + elektrik proje", "Betonarme C30/37 taşıyıcı sistem", "BIM koordinasyonu & clash detection", "A sınıfı enerji & akıllı bina altyapısı", "İskân belgesi & anahtar teslim"], "steps": [{"t": "Arsa & İmar Analizi", "d": "TAKS/KAKS/Hmax hesabı, inşaat hakkı ve kısıtların tespiti"}, {"t": "Zemin Etüdü & Fizibilite", "d": "Jeoteknik sondaj, zemin sınıfı ve gider-gelir fizibilitesi"}, {"t": "Proje & Ruhsat", "d": "Mimari, statik, mekanik, elektrik projeleri ve yapı ruhsatı"}, {"t": "Temel & Kaba Yapı", "d": "Hafriyat-iksa, radye/kazıklı temel, betonarme karkas"}, {"t": "Cephe & Tesisat", "d": "Mantolama, cephe, mekanik-elektrik (M&E) tesisat, su yalıtımı"}, {"t": "İnce İşler", "d": "Sıva, alçı, boya, seramik-parke, kapı-pencere"}, {"t": "İskân & Teslim", "d": "Yapı denetim uygunluğu, enerji kimlik belgesi, anahtar teslim"}], "deep": ["Konut inşaatında kalıcı değeri belirleyen ilk karar zeminde alınır. Yerinde açılan jeoteknik sondajlarla zemin sınıfı ve emniyet gerilmesi belirlenir; buna göre radye ya da kazıklı temel seçilir. Taşıyıcı sistem, TBDY 2018'in öngördüğü Deprem Tasarım Sınıfı (DTS) ve bina yükseklik sınıfına (BYS) uygun olarak, C30/37 betonu ve nervürlü donatıyla boyutlandırılır; perde-kolon düzeni süneklik hedefiyle çözülür.", "Üretim aşamasında BIM (Yapı Bilgi Modellemesi) ile mimari, statik ve MEP disiplinleri tek modelde çakıştırılır; clash detection sayesinde sahada sürpriz maliyet doğuran çakışmalar tasarım masasında çözülür. A sınıfı enerji performansı, mantolama ve verimli mekanik sistemlerle sağlanır. Her etap bağımsız yapı denetimi (4708) ve kendi kalite kontrolümüzle belgelenerek iskâna hazır hale getirilir."], "risks": [{"t": "Zemin sürprizi (yeraltı suyu / zayıf tabaka)", "d": "Detaylı jeoteknik etüt ve doğru temel tipi (radye/kazıklı) ile riski inşaata başlamadan kapatırız."}, {"t": "Malzeme maliyeti dalgalanması", "d": "Demir-beton tedarikini erken bağlar, sabit bütçe ve şeffaf revizyon protokolü uygularız."}, {"t": "İşçilik / kalite kusuru", "d": "4708 yapı denetimi + donatı ve beton dökümünde kendi QA aşama kontrollerimizle her etabı kayıt altına alırız."}, {"t": "Süre aşımı", "d": "CPM kritik yol planı ve haftalık ilerleme raporlarıyla takvimi izlenebilir kılarız."}], "guarantee": ["Sabit götürü bedel sözleşmesi", "Kademeli hakediş & maliyet kontrolü", "TBDY 2018 %100 uyum taahhüdü", "İskâna kadar tek muhatap", "2 yıl işçilik + yapısal garanti"], "terms": [{"k": "Zemin etüdü", "v": "Sondaj ve arazi deneyleriyle zemin taşıma gücünün belirlenmesi."}, {"k": "Betonarme C30/37", "v": "30 MPa karakteristik basınç dayanımına sahip yapısal beton sınıfı."}, {"k": "Radye temel", "v": "Yükü tüm tabana yayan plak temel; zayıf zeminde tercih edilir."}, {"k": "BIM", "v": "3B veri modeliyle çakışma, maliyet ve planlamanın yönetimi."}, {"k": "İskân", "v": "Yapının hukuken kullanılabilir olduğunu belgeleyen yapı kullanma izni."}], "faq": [{"q": "Konut inşaatı metrekare maliyeti 2026'da ne kadar?", "a": "Maliyet; zemin sınıfı, kat adedi, malzeme ve cephe sistemine göre değişir. Sağlıklı rakam yerinde keşif ve metraj sonrası verilir — bu yüzden sabit fiyat yerine güncel keşifle şeffaf teklif sunuyoruz."}, {"q": "Binam deprem yönetmeliğine uygun olacak mı?", "a": "Evet. Tüm projelerimiz TBDY 2018'e göre, zemin sınıfına uygun deprem tasarım sınıfı ve performans hedefiyle boyutlandırılır ve bağımsız yapı denetim kuruluşunca denetlenir."}, {"q": "Süreç ne kadar sürer?", "a": "Proje-ruhsat aşaması genelde 2-6 ay; inşaat, ölçek ve kat adedine göre planlanır. Sözleşmede net teslim tarihi ve gecikme için cezai şart yer alır."}], "tags": ["konut inşaatı firması", "anahtar teslim ev yapımı", "betonarme konut", "deprem yönetmeliğine uygun bina", "m² inşaat maliyeti 2026"]}, {"i": "🔨", "t": "Tadilat & Renovasyon", "d": "Daire, ofis ve bina genelinde komple tadilat, yenileme ve iç mekan renovasyonu.", "long": "Daire, ofis ve bina genelinde komple tadilat, yenileme ve iç mekân renovasyonunu tek elden yönetiyoruz. En önemli farkımız şudur: taşıyıcı sisteme (kolon-kiriş-perde) asla izinsiz müdahale etmeyiz; gereken her yapısal işlem statik mühendis onayı ve gerektiğinde güçlendirme ruhsatıyla yapılır.", "mevzuat": ["TBDY 2018", "Tadilat/İmar Ruhsatı", "Kat Mülkiyeti Kanunu 634"], "scope": ["Komple iç mekân yenileme", "Elektrik & sıhhi tesisat yenileme", "Mutfak & banyo (ıslak hacim) dönüşümü", "Alçıpan, asma tavan, boya, zemin kaplama", "Kapı-pencere & cephe yenileme", "Su kaçağı tespiti & çatlak onarımı"], "steps": [{"t": "Keşif & Ölçüm", "d": "Yerinde keşif, ölçüm ve kalem kalem detaylı teklif"}, {"t": "3D Tasarım & Malzeme", "d": "Görselleştirme, malzeme seçimi ve yazılı sözleşme"}, {"t": "Söküm / Yıkım", "d": "Kontrollü söküm, moloz tahliyesi ve gizli hasar tespiti"}, {"t": "Tesisat & İnce İşler", "d": "Elektrik-su tesisatı, alçıpan, seramik, boya, montaj"}, {"t": "Temizlik & Teslim", "d": "İnce temizlik, kontrol listesi ve teslim"}], "deep": ["Tadilatta güvenliğin sınırı taşıyıcı sistemdir. Kolon, kiriş ve perde duvarların kesilmesi veya delinmesi yapının deprem davranışını bozar ve mevzuata göre suç teşkil eder; bu tür bir ihtiyaç doğduğunda yalnızca statik mühendis raporu ve gerekiyorsa güçlendirme ruhsatıyla çalışırız. Boya, zemin ve dolap gibi işler ruhsat gerektirmezken; duvar kaldırma, ıslak hacim yeri değiştirme ve tesisat değişikliği belediye izni ve çoğu zaman kat malikleri onayı ister.", "Tipik bir 95-115 m² komple daire tadilatı, tesisat (2-3 hafta) ve ince işler (3-4 hafta) dahil yaklaşık 5-8 haftada tamamlanır. Süreci yazılı sözleşme, sabit fiyat ve günlük ilerleme paylaşımıyla yürütür; şantiye temizliği, gürültü saatleri ve komşu bilgilendirmesi gibi yaşam düzenini koruyan detayları standart kabul ederiz."], "risks": [{"t": "Taşıyıcıya izinsiz müdahale", "d": "Kolon/kiriş/perdeye dokunulmaz; zorunlu hallerde statik onaylı, ruhsatlı güçlendirme yapılır."}, {"t": "Ruhsatsız iş riski", "d": "Gerekli belediye izni ve kat malikleri kurulu onayı önceden alınır."}, {"t": "Gizli hasar (nem, elektrik, sıva altı)", "d": "Söküm öncesi tespit ve teklif revizyonuyla sürprizi ortadan kaldırırız."}, {"t": "Komşu / ortak alan uyuşmazlığı", "d": "Yönetim planına uyum ve komşu bilgilendirmesiyle çatışmayı önleriz."}], "guarantee": ["Yazılı sözleşme & sabit fiyat", "Statik mühendis onaylı müdahale", "A sınıfı malzeme & 2 yıl işçilik garantisi", "Şantiye temizliği & komşu bilgilendirmesi", "Günlük ilerleme paylaşımı"], "terms": [{"k": "Röleve", "v": "Mevcut yapının ölçülü olarak belgelenmesi."}, {"k": "Taşıyıcı sistem", "v": "Yükü aktaran betonarme perde-kolon-kiriş iskeleti; müdahale statik onayı ister."}, {"k": "Su yalıtımı", "v": "Islak hacim ve terasta suya karşı membran/kaplama koruması."}, {"k": "Tadilat ruhsatı", "v": "Yapısal veya tesisat değişikliklerinde gereken belediye izni."}], "faq": [{"q": "Tadilat için ruhsat gerekli mi?", "a": "Boya, zemin ve dolap gibi işler ruhsatsız yapılabilir; duvar kaldırma, ıslak hacim taşıma ve tesisat değişikliği için belediye tadilat ruhsatı gerekir."}, {"q": "Salonu büyütmek için duvarı kaldırabilir miyiz?", "a": "Duvar taşıyıcı değilse mümkündür. Taşıyıcıysa kaldırılamaz; ancak statik mühendis onaylı güçlendirme (kiriş aktarımı) ile çözüm üretilebilir."}, {"q": "Komple tadilat ne kadar sürer?", "a": "95-115 m² bir daire, tesisat ve ince işler dahil yaklaşık 5-8 haftada teslim edilir; kesin süre keşif sonrası sözleşmeye yazılır."}], "tags": ["ev tadilatı", "daire renovasyon", "komple tadilat fiyatları 2026", "banyo mutfak yenileme", "tadilat firması İstanbul"]}, {"i": "♻️", "t": "Kentsel Dönüşüm", "d": "Riskli yapıların 6306 sayılı kanun kapsamında güvenli yenilenmesi.", "long": "Riskli yapıların 6306 sayılı kanun kapsamında güvenli yenilenmesini, hak sahiplerinin haklarını koruyarak uçtan uca yönetiyoruz. Riskli yapı tespitinden maliklerle mutabakata, kira yardımı başvurusundan TBDY 2018 uyumlu yeni binaya kadar tüm yasal ve teknik süreç bizde.", "mevzuat": ["6306 Kentsel Dönüşüm", "TBDY 2018", "Yapı Denetim 4708", "İmar Kanunu 3194"], "scope": ["Riskli yapı tespiti & rapor", "6306 yasal süreç yönetimi", "Hak sahibi sözleşmeleri & mutabakat", "Kira yardımı & taşınma desteği", "TBDY 2018 uyumlu güçlü yeni yapı", "Sosyal donatı & otopark"], "steps": [{"t": "Riskli Yapı Tespiti", "d": "Bakanlık lisanslı kuruluşça karot ve performans analizi"}, {"t": "Şerh & Tebligat", "d": "Tapuya riskli yapı şerhi, maliklere e-Devlet tebliği (15 gün itiraz)"}, {"t": "Malik Mutabakatı", "d": "Arsa payının 2/3 çoğunluğuyla dönüşüm kararı ve sözleşme"}, {"t": "Yıkım Ruhsatı", "d": "Tahliye, kira yardımı başvurusu ve yıkım"}, {"t": "Yeni Proje & Ruhsat", "d": "TBDY 2018 uyumlu mimari-statik proje ve yapı ruhsatı"}, {"t": "İnşaat", "d": "Yapı denetimli, güçlü yeni binanın üretimi"}, {"t": "İskân & Teslim", "d": "İskân ve hak sahiplerine bağımsız bölüm teslimi"}], "deep": ["Kentsel dönüşümün yasal omurgası 6306 sayılı kanundur. Süreç, Bakanlıkça lisanslandırılmış kuruluşun hazırladığı riskli yapı raporuyla başlar; rapor onaylanınca tapuya 'riskli yapı' şerhi işlenir ve maliklere e-Devlet üzerinden tebliğ edilir, 15 günlük itiraz hakkı tanınır. Dönüşüm kararı arsa payının en az 2/3 çoğunluğuyla alınır; karara katılmayan maliklerin payları, bağımsız (SPK lisanslı) değerleme rayici üzerinden açık artırmayla değerlendirilir. 2023 değişikliğiyle kira yardımı başvuru süresi bir yıla çıkarılmıştır.", "Güçlendirme mi, yıkıp yeniden yapmak mı sorusu yalnızca maliyetle değil imar haklarıyla da ilgilidir: eski imarda beş kat olan bir yapı yeni imarda üç kata düşmüş olabilir; bu durumda güçlendirme mevcut metrekareyi korur. Genel mühendislik ölçütü, güçlendirme maliyetinin yıkıp yeniden yapma maliyetinin %40'ını aşması halinde yeniden yapımın önerilmesidir. Karbon fiber (FRP) güçlendirme 30-90 günde tamamlanabilirken klasik dönüşüm 18-24 ay sürer. İki senaryoyu bağımsız mühendis raporuyla karşılaştırmalı sunarız."], "risks": [{"t": "Malik mutabakatsızlığı", "d": "Şeffaf müzakere ve bağımsız değerleme desteğiyle 2/3 çoğunluğu adil biçimde sağlarız."}, {"t": "Hak sahipliği itirazı", "d": "Askı-ilan ve tebligat süreçlerini hukuki takiple yönetiriz."}, {"t": "Kira yardımı / tahliye takvimi", "d": "Başvuru ve devlet desteklerini (kira, faiz, vergi muafiyeti) sizin adınıza yürütürüz."}, {"t": "Riskli yapı tespit hatası", "d": "Lisanslı kuruluşla doğrulama ve TBDY 2018 performans analiziyle raporu sağlama alırız."}], "guarantee": ["Bakanlık lisanslı riskli yapı raporu", "Bina tamamlama sigortası", "Kira yardımı & devlet destekleri yönetimi", "Şeffaf hak sahipliği cetveli", "Teminatlı, cezai şartlı sözleşme"], "terms": [{"k": "Riskli yapı tespiti", "v": "Lisanslı kuruluşça yapılan, dönüşümü başlatan resmî deprem güvenliği raporu."}, {"k": "Karot testi", "v": "Mevcut betondan silindir örnek alıp basınç dayanımı ölçme."}, {"k": "2/3 çoğunluk", "v": "Dönüşüm kararının alınması için gereken arsa payı çoğunluğu."}, {"k": "Kira yardımı", "v": "Tahliye/yıkım sonrası hak sahiplerine yapılan devlet kira desteği."}, {"k": "Bina tamamlama sigortası", "v": "Yüklenici işi bırakırsa binayı tamamlatan veya ödemeleri yasal faiziyle iade eden güvence."}], "faq": [{"q": "Kentsel dönüşümde cebimden para çıkar mı?", "a": "Kat karşılığı modelinde arsa sahibi para ödemez; ayrıca kira yardımı, düşük faizli kredi ve vergi muafiyeti gibi devlet destekleri devreye girer."}, {"q": "Komşularımın hepsi imza atmazsa ne olur?", "a": "Karar arsa payının 2/3 çoğunluğuyla alınır. Katılmayan maliklerin payı, bağımsız değerleme rayici üzerinden açık artırmayla değerlendirilir."}, {"q": "İnşaat sırasında nerede oturacağım?", "a": "Tahliye tarihinden itibaren bir yıl içinde başvuruyla kira yardımı alınır; başvuru ve takibi bizim tarafımızdan yürütülür."}], "tags": ["kentsel dönüşüm firması", "6306 sayılı kanun", "riskli yapı tespiti", "kentsel dönüşüm kira yardımı 2026", "kentsel dönüşüm süreci"]}, {"i": "🔑", "t": "Anahtar Teslim Taahhüt", "d": "Tasarımdan teslime tüm sorumluluğun tek elde toplandığı taahhüt modeli.", "long": "Mühendislikten tasarıma, tedarikten iskâna kadar tüm sorumluluğun tek yüklenicide toplandığı EPC (Engineering-Procurement-Construction) modeliyle; sabit fiyat, sabit takvim ve tek muhatap güvencesiyle işveren için risksiz ve öngörülebilir bir süreç sağlıyoruz.", "mevzuat": ["TBDY 2018", "İmar Kanunu 3194", "Yapı Denetim 4708", "ISO 9001 / 45001"], "scope": ["Tek elden proje yönetimi (EPC)", "Sabit götürü bedel & sabit takvim", "Tüm disiplinlerin koordinasyonu", "Hakediş & maliyet kontrolü", "Kalite & İSG (6331) yönetimi", "Garanti & satış sonrası"], "steps": [{"t": "Sözleşme", "d": "Kapsam, götürü bedel ve takvim mutabakatı"}, {"t": "Planlama", "d": "CPM kritik yol ve kaynak planı, BIM koordinasyonu"}, {"t": "Tedarik", "d": "Malzeme, ekipman ve işgücünün önceden bağlanması"}, {"t": "Üretim", "d": "Hakediş sistemiyle kontrollü, denetimli inşaat"}, {"t": "Test & Teslim", "d": "Devreye alma, geçici-kesin kabul ve anahtar teslim"}], "deep": ["Anahtar teslim (götürü bedel) modelinde kapsam, maliyet ve süre riski işverenden yükleniciye geçer: sabit fiyat verildiği için keşif ve tasarım hataları bizim sorumluluğumuzdadır. Bu yüzden işi sağlam bir ön proje ve BIM koordinasyonuyla başlatır, disiplinler arası çakışmaları sözleşme öncesi çözerek fiyatı gerçekçi ve sürdürülebilir kılarız.", "İşverenin kazancı öngörülebilirliktir: tek sözleşme, tek muhatap, sabit takvim ve kademeli hakediş. Süreç boyunca kalite ve iş güvenliği (6331) yönetimi standarttır; teslim, geçici kabulle başlar ve garanti/teminat süresi sonunda kesin kabulle tamamlanır."], "risks": [{"t": "Kapsam / keşif hatası", "d": "Detaylı ön proje ve BIM ile çakışmaları önce çözer, götürü bedeli sağlam temele oturturuz."}, {"t": "Fiyat sabitliği baskısı", "d": "Gerçekçi bütçeleme ve sözleşmede uyarlama esaslarıyla kaliteden ödün vermeyiz."}, {"t": "Gizli ayıp", "d": "Kesin kabule kadar süren garanti ve teminatla riski üstleniriz."}, {"t": "Disiplinler arası koordinasyon", "d": "Tek yüklenici sorumluluğu ve CPM planıyla koordinasyon boşluğunu kapatırız."}], "guarantee": ["Sabit götürü bedel — sürpriz maliyet yok", "Tek muhatap, tek sözleşme", "CPM ile öngörülebilir teslim", "Kademeli hakediş", "Kesin kabule kadar garanti"], "terms": [{"k": "EPC", "v": "Mühendislik-Tedarik-İnşaatın tek yüklenicide toplandığı anahtar teslim modeli."}, {"k": "Götürü bedel", "v": "İşin tamamı için baştan belirlenen, sabit toplam sözleşme bedeli."}, {"k": "CPM kritik yol", "v": "Projenin en uzun bağımlı iş zincirini yöneten planlama yöntemi."}, {"k": "Hakediş", "v": "Tamamlanan imalat oranına göre yapılan ara ödeme."}, {"k": "Kesin kabul", "v": "Garanti süresi sonunda yapılan nihai teslim onayı."}], "faq": [{"q": "Anahtar teslim ne demek?", "a": "Proje, ruhsat, tedarik ve inşaatın tümünün tek yüklenicide olduğu; sizin yalnızca hazır yapıyı teslim aldığınız modeldir."}, {"q": "Fiyat sabit mi kalır?", "a": "Evet, sözleşmedeki götürü bedel sabittir. Kapsam dışı ek talepler ayrıca ve yazılı olarak fiyatlandırılır."}, {"q": "Süreçte bana ne düşer?", "a": "Başlangıçtaki karar ve onaylar dışında süreç bizde; düzenli ilerleme raporlarıyla bilgilendirilirsiniz."}], "tags": ["anahtar teslim inşaat", "götürü bedel inşaat", "sabit fiyat inşaat", "anahtar teslim proje", "anahtar teslim m² fiyatı"]}, {"i": "🤝", "t": "Kat Karşılığı İnşaat", "d": "Arsa sahipleriyle şeffaf hisse paylaşımına dayalı kazan-kazan projeler.", "long": "Arsa sahipleriyle şeffaf hisse paylaşımına dayalı kazan-kazan projeler geliştiriyoruz. Arsa sahibi hiç para ödemeden arsasını değerlendirir; biz detaylı fizibilite, adil paylaşım oranı, noter onaylı sözleşme ve teminat ipoteğiyle güvenli bir ortaklık kurarız.", "mevzuat": ["Arsa Payı Karşılığı Sözleşme", "Tapu & Kat İrtifakı", "TBK Cezai Şart", "TBDY 2018"], "scope": ["Arsa fizibilite & bağımsız değerleme", "Adil paylaşım oranı analizi", "Noter onaylı, tapuya şerhli sözleşme", "Teminat ipoteği & banka teminat mektubu", "Proje, ruhsat & yapım", "Kademeli tapu devri & teslim"], "steps": [{"t": "İmar & Değer Analizi", "d": "Arsanın imar hakkı, potansiyeli ve rayiç değeri"}, {"t": "Paylaşım Oranı", "d": "Adil daire/hasılat paylaşımının belirlenmesi"}, {"t": "Noter Sözleşmesi", "d": "Tapuya şerhli, cezai şartlı kat karşılığı sözleşmesi"}, {"t": "Proje & Ruhsat", "d": "Mimari-statik proje ve yapı ruhsatı"}, {"t": "İnşaat", "d": "Yapı denetimli, teminatlı inşaat süreci"}, {"t": "Paylaşım & Teslim", "d": "Kademeli tapu devri ve bağımsız bölüm teslimi"}], "deep": ["Kat karşılığı (arsa payı karşılığı) inşaat, arsa sahibinin arsasının belirli bir payını yükleniciye devrettiği; yüklenicinin karşılığında ürettiği bağımsız bölümlerin bir kısmını arsa sahibine teslim ettiği, iki tarafa borç yükleyen bir sözleşmedir. Arsa sahibi para ödemez, arsa payı devreder. Sözleşme yasal geçerlilik için noter huzurunda düzenlenmeli ve tapuya şerh edilmelidir; hangi kat, hangi cephe, kaç metrekare bağımsız bölümün kime ait olduğu net cetvelle yazılır.", "Güveni somut kılan mekanizma teminattır: 'İstanbul usulü'nde yükleniciye devredilen taşınmaza teminat ipoteği konur; yüklenici yükümlülüğünü yerine getirmezse ipotek paraya çevrilir. Buna banka teminat mektubu ve kefalet eklenebilir. Tapu devri genelde inşaat bitmeden yapılmaz, kademeli takvimle ilerler. Teslim süresi ve gecikme cezası (TBK cezai şart) sözleşmede açıkça yer alır."], "risks": [{"t": "Paylaşım anlaşmazlığı", "d": "Hangi bağımsız bölümün kime ait olduğunu net cetvelle sözleşmeye bağlarız."}, {"t": "Erken tapu devri riski", "d": "Kademeli/aşamalı tapu devri ve teminat ipoteğiyle arsa sahibini koruruz."}, {"t": "Süre aşımı / temerrüt", "d": "Cezai şart, kira kaybı tazminatı ve kesin süre hükümleriyle güvence sağlarız."}, {"t": "Ayıplı / eksik ifa", "d": "Hakediş bazlı kontrol ve teminat ipoteğiyle kaliteyi güvenceye alırız."}], "guarantee": ["Noter onaylı, tapuya şerhli sözleşme", "Teminat ipoteği ile güvence", "Kademeli tapu devri", "Cezai şart & net teslim tarihi", "Bağımsız değerleme ile adil paylaşım"], "terms": [{"k": "Arsa payı", "v": "Bir bağımsız bölüme bağlı, arsadaki ortak mülkiyet payı."}, {"k": "Kat irtifakı", "v": "Henüz tamamlanmamış yapıda bağımsız bölümler üzerinde kurulan tapu hakkı."}, {"k": "Teminat ipoteği", "v": "Yüklenicinin yükümlülüğü için devredilen taşınmaza konan güvence ipoteği."}, {"k": "Cezai şart", "v": "Gecikme/temerrüt halinde ödenecek, sözleşmede yazılı tazminat."}, {"k": "Kademeli tapu devri", "v": "Tapunun inşaat ilerledikçe aşamalı olarak devredilmesi."}], "faq": [{"q": "Kat karşılığında kaç daire alırım?", "a": "Paylaşım oranı; arsanın imar hakkı, konumu ve rayiç değerine göre belirlenir ve hangi bağımsız bölümlerin size ait olduğu sözleşmede net yazılır."}, {"q": "Hiç para ödeyecek miyim?", "a": "Hayır. Kat karşılığı modelinde para ödemez, arsa payı devredersiniz; karşılığında anlaşılan bağımsız bölümleri alırsınız."}, {"q": "Müteahhit işi yarım bırakırsa güvencem ne?", "a": "Teminat ipoteği, banka teminat mektubu ve cezai şart devreye girer; ipotek paraya çevrilerek zararınız karşılanır."}], "tags": ["kat karşılığı inşaat", "arsa payı karşılığı inşaat", "kat karşılığı sözleşme", "kat karşılığı paylaşım oranı", "güvenilir müteahhit"]}, {"i": "🏬", "t": "Ticari & Karma Yapılar", "d": "Ofis, AVM, otel ve karma kullanımlı projelerde uçtan uca yapım.", "long": "Ofis, plaza, AVM, otel ve karma kullanımlı (mixed-use) projelerde; yangın, otopark ve işyeri açma yönetmeliklerine tam uyumlu, LEED/BREEAM sertifikalı ve akıllı bina (BMS) yönetimli ticari yapılar üretiyoruz.", "mevzuat": ["İşyeri Açma & Çalışma Ruhsatı", "Yangın Yönetmeliği (BYKHY)", "Otopark Yönetmeliği", "LEED / BREEAM", "ISO 9001/14001/45001"], "scope": ["Ofis & plaza yapımı", "AVM & perakende alanları", "Otel & konaklama tesisleri", "Karma kullanım (mixed-use) projeleri", "LEED / BREEAM sertifikasyon", "Akıllı bina (BMS) sistemleri"], "steps": [{"t": "Konsept & Fizibilite", "d": "Kullanım analizi, gelir modeli ve fizibilite"}, {"t": "Tasarım", "d": "Mimari, MEP ve sertifika (LEED/BREEAM) hedefleri"}, {"t": "Ruhsat & Onaylar", "d": "Yangın, otopark ve işyeri açma uyum onayları"}, {"t": "Yapım & MEP", "d": "Çelik/betonarme yapım, mekanik-elektrik tesisat"}, {"t": "Devreye Alma", "d": "Test, işletmeye alma ve teknik destek"}], "deep": ["Ticari yapılarda başarı, yaşam güvenliği ve işletme yönetmeliklerine uyumla başlar. Bina yangın kompartımanları, kaçış yolları ve sprinkler sistemleri BYKHY'ye göre; otopark kapasitesi Otopark Yönetmeliği hesabına göre; işlev ise İşyeri Açma ve Çalışma Ruhsatı Yönetmeliği'ne göre tasarlanır. Geniş açıklık ve yüksek yük gerektiren mekânlarda çelik konstrüksiyon, bina yükseklik sınıfına (BYS) uygun taşıyıcı çözümlerle birlikte kullanılır.", "Kurumsal kiracı ve yatırımcı güveni için LEED/BREEAM yeşil bina sertifikaları ve akıllı bina yönetim sistemleri (BMS) standart hedefimizdir. Enerji, aydınlatma, HVAC ve güvenlik tek merkezden yönetilerek işletme maliyeti düşürülür ve varlık değeri korunur."], "risks": [{"t": "Ruhsat / işyeri açma engeli", "d": "İşyeri Açma ve Çalışma Ruhsatı Yönetmeliği'ne uygun tasarımla baştan uyum sağlarız."}, {"t": "Yangın güvenliği uyumsuzluğu", "d": "BYKHY kaçış, kompartıman ve sprinkler tasarımıyla riski kapatırız."}, {"t": "Otopark yetersizliği", "d": "Otopark Yönetmeliği hesabını tasarım aşamasında çözeriz."}, {"t": "Yüksek yük / geniş açıklık", "d": "Çelik veya özel taşıyıcı sistemle BYS'ye uygun çözüm üretiriz."}], "guarantee": ["Yönetmeliklere tam uyum (yangın/otopark/işyeri)", "LEED/BREEAM sertifika hedefi", "Akıllı bina (BMS) entegrasyonu", "İşletmeye alma & teknik destek", "ISO entegre kalite sistemi"], "terms": [{"k": "Çelik konstrüksiyon", "v": "Geniş açıklık ve hızlı yapım sağlayan çelik taşıyıcı sistem."}, {"k": "BMS", "v": "Bina yönetim sistemi; enerji, HVAC ve güvenliğin merkezi kontrolü."}, {"k": "BYKHY", "v": "Binaların Yangından Korunması Hakkında Yönetmelik."}, {"k": "Mixed-use", "v": "Konut, ofis ve ticareti birlikte barındıran karma kullanım."}, {"k": "LEED / BREEAM", "v": "Uluslararası yeşil bina sertifikasyon sistemleri."}], "faq": [{"q": "Ticari yapıda hangi ruhsatlar gerekir?", "a": "Yapı ruhsatı, yangın onayı, otopark uygunluğu ve işletme için işyeri açma ve çalışma ruhsatı gerekir; tasarımı baştan bu uyumla kurarız."}, {"q": "Çelik mi betonarme mi?", "a": "Geniş açıklık, hız ve yüksek yük gereken hacimlerde çelik; diğer bölümlerde betonarme tercih edilir. Karar, statik analiz ve işlev ihtiyacına göre verilir."}, {"q": "LEED/BREEAM şart mı?", "a": "Zorunlu değildir ancak kurumsal kiracı, işletme maliyeti ve varlık değeri açısından güçlü avantaj sağlar; hedefi tasarım aşamasında belirleriz."}], "tags": ["ticari bina inşaatı", "plaza inşaatı", "iş merkezi yapımı", "çelik yapı", "AVM inşaatı"]}, {"i": "🏛️", "t": "Güçlendirme & Restorasyon", "d": "Mevcut yapılarda deprem güçlendirmesi ve tarihi yapı restorasyonu.", "long": "Mevcut yapılarda deprem güçlendirmesi ve tarihi yapı restorasyonunu, önce performans analiziyle teşhis koyarak yapıyoruz. Karbon fiber (FRP), mantolama ve perde-kolon güçlendirme teknikleriyle taşıyıcı kapasiteyi artırır; tarihi yapılarda özgün dokuya sadık röleve-restitüsyon-restorasyon sürecini yürütürüz.", "mevzuat": ["TBDY 2018", "6306", "Koruma Kurulu (tarihi yapı)", "Yapı Denetim 4708"], "scope": ["Deprem performans analizi", "Karbon fiber (FRP) güçlendirme", "Perde & kolon mantolama", "Temel güçlendirme", "Tarihi yapı restorasyonu", "Röleve & restitüsyon projesi"], "steps": [{"t": "Analiz", "d": "Karot, donatı tespiti ve TBDY 2018 performans değerlendirmesi"}, {"t": "Proje", "d": "Güçlendirme veya restorasyon projesinin hazırlanması"}, {"t": "Uygulama", "d": "Kontrollü FRP/mantolama/perde güçlendirme işleri"}, {"t": "Onay", "d": "Test, raporlama ve (tarihi yapıda) kurul onayı"}], "deep": ["Güçlendirmenin ilk adımı doğru teşhistir: karot numunesiyle beton dayanımı, donatı tespiti ve TBDY 2018'e göre performans analizi yapılır. Sonuca göre karbon fiber (CFRP), betonarme mantolama/çelik ceket veya yeni perde ekleme yöntemlerinden uygun olanı seçilir. CFRP; çelikten kat kat yüksek çekme dayanımı ve düşük ağırlığıyla, binayı boşaltmadan hızlı uygulama imkânı sunar.", "Kentsel dönüşümde güçlendirme, imar hakkı korunacaksa (kat/metrekare kaybı istenmiyorsa) güçlü bir alternatiftir. Tarihi yapılarda ise süreç röleve (mevcut durumun ölçülü belgelenmesi), restitüsyon (özgün halin araştırılması) ve restorasyon aşamalarıyla, Koruma Kurulu onaylarına bağlı yürütülür."], "risks": [{"t": "Yanlış teşhis", "d": "Karot ve performans analiziyle güçlendirme yöntemini veriyle seçeriz."}, {"t": "Kullanım kesintisi", "d": "CFRP gibi hızlı yöntemlerle binayı çoğu zaman boşaltmadan çalışırız."}, {"t": "Tarihi dokuya zarar", "d": "Röleve-restitüsyon ve kurul onaylı özgün malzeme yaklaşımıyla dokuyu koruruz."}, {"t": "İmar hakkı kaybı endişesi", "d": "Güçlendirme senaryosuyla mevcut kat ve metrekareyi koruruz."}], "guarantee": ["Veriyle teşhis (karot + performans analizi)", "TBDY 2018 uyumlu güçlendirme projesi", "Hızlı ve az kesintili uygulama", "Kurul onaylı restorasyon (tarihi yapı)", "Test & raporlamayla belgeli teslim"], "terms": [{"k": "CFRP / FRP", "v": "Karbon fiber; çelikten hafif, yüksek çekme dayanımlı güçlendirme kumaşı."}, {"k": "Mantolama (çelik ceket)", "v": "Kolon-perde kesitini sararak taşıyıcı kapasiteyi artırma."}, {"k": "Süneklik", "v": "Yapının kırılmadan enerji yutma ve şekil değiştirme kabiliyeti."}, {"k": "Röleve", "v": "Mevcut yapının ölçülü olarak belgelenmesi."}], "faq": [{"q": "Güçlendirme mi, yıkıp yeniden mi?", "a": "Karar maliyet ve imar hakkına bağlıdır. Güçlendirme maliyeti yeniden yapımın %40'ını aşıyorsa yeniden yapım; imar hakkı kaybı istenmiyorsa güçlendirme öne çıkar. İki senaryoyu karşılaştırmalı sunarız."}, {"q": "Güçlendirmede evi boşaltmam gerekir mi?", "a": "Çoğu karbon fiber uygulamasında bina boşaltılmadan çalışılabilir; kapsamlı işlerde kısmi tahliye gerekebilir."}, {"q": "Ne kadar sürer?", "a": "FRP güçlendirme genelde 30-90 gün; kapsam analiz sonrası netleşir."}], "tags": ["bina güçlendirme", "karbon fiber güçlendirme fiyatları", "deprem güçlendirme", "tarihi yapı restorasyonu", "kolon mantolama"]}, {"i": "🏭", "t": "Endüstriyel Yapılar", "d": "Fabrika, depo ve lojistik tesislerinde çelik ve betonarme çözümler.", "long": "Fabrika, depo ve lojistik tesislerinde; geniş açıklıklı çelik konstrüksiyon, prefabrik betonarme sistemler ve hızlı yapım teknikleriyle üretim akışına ve büyümeye uygun endüstriyel yapılar kuruyoruz.", "mevzuat": ["TBDY 2018", "İş Sağlığı & Güvenliği 6331", "Yapı Denetim 4708", "ISO 9001/14001/45001"], "scope": ["Çelik konstrüksiyon yapım", "Prefabrik betonarme sistemler", "Geniş açıklıklı çatı sistemleri", "Lojistik & depo tesisleri", "Üretim & fabrika binaları", "Altyapı & saha düzenleme"], "steps": [{"t": "İhtiyaç Analizi", "d": "Üretim akışı, yük, açıklık ve alan ihtiyaçları"}, {"t": "Tasarım", "d": "Çelik/prefabrik sistem ve çatı statiği tasarımı"}, {"t": "İmalat & Montaj", "d": "Atölye imalatı ve hızlı saha montajı"}, {"t": "Test & Teslim", "d": "Devreye alma, İSG onayı ve teslim"}], "deep": ["Endüstriyel yapılarda tasarımı belirleyen üç ölçüt vardır: açıklık, yük ve hız. Geniş açıklıklı üretim ve depo hacimleri, kolonsuz alan sağlayan çelik konstrüksiyonla; tekrarlı ve hızlı yapım gereken bölümler prefabrik betonarme sistemlerle çözülür. Çatı sistemleri kar, rüzgâr ve ekipman yüklerine göre boyutlandırılır.", "Saha montajı, atölyede üretilen elemanların hızlı kurulumuyla proje süresini kısaltır. Tüm süreç iş sağlığı ve güvenliği (6331) planı, yüksekte çalışma ve kaldırma güvenliği protokolleriyle yürütülür; teslim, devreye alma testleri ve raporlamayla tamamlanır."], "risks": [{"t": "Yetersiz açıklık / yük hesabı", "d": "Üretim akışı ve ekipman yüklerini önce analiz eder, çelik/prefabrik seçimini buna göre yaparız."}, {"t": "Montaj güvenliği", "d": "6331 kapsamında yüksekte çalışma ve kaldırma güvenliği protokolleriyle çalışırız."}, {"t": "Süre baskısı", "d": "Atölye imalatı + hızlı saha montajıyla üretim başlangıcını öne çekeriz."}, {"t": "Zemin / saha altyapısı", "d": "Ağır yük ve forklift trafiği için zemin ve saha düzenlemesini birlikte çözeriz."}], "guarantee": ["Yük ve açıklığa göre optimize taşıyıcı", "Hızlı atölye imalatı + saha montajı", "6331 İSG planı", "Devreye alma testleri & raporlama", "ISO entegre kalite sistemi"], "terms": [{"k": "Çelik konstrüksiyon", "v": "Kolonsuz geniş açıklık sağlayan çelik taşıyıcı sistem."}, {"k": "Prefabrik betonarme", "v": "Atölyede üretilip sahada montajlanan, hızlı yapım sağlayan sistem."}, {"k": "Geniş açıklık", "v": "Kolon araları büyük, kesintisiz üretim/depo alanı."}, {"k": "İSG (6331)", "v": "Şantiyede iş sağlığı ve güvenliği yönetimi zorunluluğu."}], "faq": [{"q": "Çelik mi prefabrik mi daha hızlı?", "a": "İkisi de hızlıdır; geniş kolonsuz açıklıklarda çelik, tekrarlı modüler bölümlerde prefabrik betonarme öne çıkar. Karar yük ve açıklık analizine göre verilir."}, {"q": "Depo zemini ağır yükü taşır mı?", "a": "Forklift trafiği ve raf yüklerine göre zemin ve saha altyapısını hesaplayıp birlikte çözeriz."}, {"q": "Ne kadar sürede üretime geçerim?", "a": "Atölye imalatı + hızlı saha montajıyla süre kısalır; kesin takvim ihtiyaç analizi sonrası verilir."}], "tags": ["endüstriyel yapı", "çelik konstrüksiyon", "fabrika inşaatı", "depo lojistik tesisi", "prefabrik yapı"]}];
let PROJECTS=[
  {t:'Meridyen Levent Rezidans',loc:'Levent, İstanbul',st:'devam',type:'Konut · 2+1/4+1',area:'48.000 m²',img:'p_res',price:'8.500.000 ₺\'den başlayan',delivery:'2026 Q4',units:'180 daire',desc:'Levent\'in merkezinde, modern mimari ve akıllı bina teknolojisiyle donatılmış prestijli rezidans projesi.',progress:65,
    longDesc:'Meridyen Levent Rezidans, Levent\'in finans merkezinde 48.000 m\u00b2 in\u015faat alan\u0131 \u00fczerinde y\u00fckselen, TBDY 2018 deprem y\u00f6netmeli\u011fine tam uyumlu, C30/37 betonarme ta\u015f\u0131y\u0131c\u0131 sistemli prestijli bir konut projesidir. BIM koordinasyonu ve clash detection ile tasarlanan proje, ak\u0131ll\u0131 bina otomasyonu, jeotermal \u0131s\u0131 pompas\u0131 ve A s\u0131n\u0131f\u0131 enerji performans\u0131 sunar. Zemin et\u00fcd\u00fc ZC s\u0131n\u0131f\u0131 zeminde DD-2 deprem analizi ile boyutland\u0131r\u0131lm\u0131\u015ft\u0131r.',
    features:['Ak\u0131ll\u0131 bina otomasyonu (KNX)','Jeotermal \u0131s\u0131 pompas\u0131','7/24 g\u00fcvenlik & concierge','Kapal\u0131 y\u00fczme havuzu & SPA','Fitness & pilates st\u00fcdyosu','3 kat kapal\u0131 otopark','\u00c7ocuk oyun alan\u0131 & kre\u015f','Elektrikli ara\u00e7 \u015farj istasyonu','Ak\u0131ll\u0131 su sayac\u0131 & yang\u0131n alg\u0131lama'],
    gallery:['p_res','p_lux','p_white','p_office'],
    floors:[{name:'Zemin Kat',img:'',units:['A01','A02','A03','A04']},{name:'1. Kat',img:'',units:['A11','A12','A13','A14']},{name:'2. Kat',img:'',units:['A21','A22','A23','A24']}],
    apts:[{no:'A01',tip:'2+1',m2:'94',kat:'Zemin Kat',cephe:'G\u00fcney',fiyat:'8.500.000 \u20ba',durum:'musait'},{no:'A02',tip:'2+1',m2:'96',kat:'Zemin Kat',cephe:'Do\u011fu',fiyat:'8.750.000 \u20ba',durum:'opsiyonlu'},{no:'A03',tip:'3+1',m2:'128',kat:'Zemin Kat',cephe:'Bat\u0131',fiyat:'11.200.000 \u20ba',durum:'satildi'},{no:'A04',tip:'4+1',m2:'165',kat:'Zemin Kat',cephe:'G\u00fcneybat\u0131',fiyat:'14.900.000 \u20ba',durum:'musait'},{no:'A11',tip:'2+1',m2:'94',kat:'1. Kat',cephe:'G\u00fcney',fiyat:'8.700.000 \u20ba',durum:'musait'},{no:'A12',tip:'2+1',m2:'96',kat:'1. Kat',cephe:'Do\u011fu',fiyat:'8.950.000 \u20ba',durum:'satildi'},{no:'A13',tip:'3+1',m2:'128',kat:'1. Kat',cephe:'Bat\u0131',fiyat:'11.400.000 \u20ba',durum:'musait'},{no:'A14',tip:'4+1',m2:'165',kat:'1. Kat',cephe:'G\u00fcneybat\u0131',fiyat:'15.100.000 \u20ba',durum:'opsiyonlu'},{no:'A21',tip:'2+1',m2:'94',kat:'2. Kat',cephe:'G\u00fcney',fiyat:'8.900.000 \u20ba',durum:'musait'},{no:'A22',tip:'3+1',m2:'128',kat:'2. Kat',cephe:'Do\u011fu',fiyat:'11.600.000 \u20ba',durum:'musait'},{no:'A23',tip:'4+1',m2:'165',kat:'2. Kat',cephe:'Bat\u0131',fiyat:'15.300.000 \u20ba',durum:'satildi'},{no:'A24',tip:'4+1 Dubleks',m2:'210',kat:'2. Kat',cephe:'Panoramik',fiyat:'21.500.000 \u20ba',durum:'musait'}],
    timeline:[{ad:'Zemin Et\u00fcd\u00fc & Ruhsat',tarih:'2023 Q2',durum:'bitti'},{ad:'Temel & Kaz\u0131',tarih:'2023 Q4',durum:'bitti'},{ad:'Betonarme Karkas',tarih:'2024 Q3',durum:'bitti'},{ad:'Cephe & Mekanik',tarih:'2025 Q2',durum:'devam'},{ad:'\u0130nce \u0130\u015f\u00e7ilik & Peyzaj',tarih:'2026 Q2',durum:'bekliyor'},{ad:'\u0130skan & Teslim',tarih:'2026 Q4',durum:'bekliyor'}],
    payment:{pesin:'%25 pe\u015fin',taksit:'36 aya varan vade',banka:'Anla\u015fmal\u0131 bankalarla %0 faizli konut kredisi',not:'Pe\u015fin al\u0131mlarda %8 indirim uygulan\u0131r.'},
    location:{adres:'B\u00fcy\u00fckdere Cad. No:128, Levent / \u0130stanbul',ulasim:['Metro M2 Levent \u2013 4 dk y\u00fcr\u00fcme','Be\u015fikta\u015f sahil \u2013 8 dk','3. Havaliman\u0131 \u2013 35 dk','Zincirlikuyu \u2013 6 dk'],cevre:['Akmerkez AVM \u2013 600 m','Ko\u00e7 \u00dcniversitesi \u2013 2 km','Amerikan Hastanesi \u2013 1.5 km','\u0130T\u00dc \u2013 3 km']},
    specs:[{k:'M\u00fcteahhit',v:'Meridyen Yap\u0131 A.\u015e.'},{k:'Mimari Proje',v:'MY Mimarl\u0131k & Tasar\u0131m'},{k:'Yap\u0131 Sistemi',v:'Betonarme \u2013 C30/37'},{k:'Deprem Y\u00f6netmeli\u011fi',v:'TBDY 2018 \u2013 DD-2'},{k:'Zemin S\u0131n\u0131f\u0131',v:'ZC (zemin et\u00fcd\u00fc onayl\u0131)'},{k:'Enerji S\u0131n\u0131f\u0131',v:'A \u2013 jeotermal destekli'},{k:'\u0130skan Durumu',v:'2026 Q4 (planlanan)'},{k:'Toplam Blok',v:'3 blok / 18 kat'}]},
  {t:'Bosphorus Loft',loc:'Beşiktaş, İstanbul',st:'devam',type:'Lüks Konut',area:'31.500 m²',img:'p_lux',price:'14.200.000 ₺\'den başlayan',delivery:'2027 Q2',units:'72 daire',desc:'Boğaz manzaralı, loft konseptli lüks yaşam alanları.',progress:40,
    longDesc:"Bosphorus Loft, Be\u015fikta\u015f'\u0131n bo\u011faza bakan yamac\u0131nda 31.500 m\u00b2 alanda y\u00fckselen, loft konseptli l\u00fcks bir ya\u015fam projesidir. \u00c7ift y\u00fckseklikli tavanlar, panoramik bo\u011faz manzaras\u0131 ve TBDY 2018 uyumlu C35/45 betonarme ta\u015f\u0131y\u0131c\u0131 sistemiyle tasarlanm\u0131\u015ft\u0131r. BIM koordinasyonu ile MEP altyap\u0131s\u0131 clash detection'dan ge\u00e7irilmi\u015f, A+ enerji s\u0131n\u0131f\u0131 hedeflenmi\u015ftir.",
    features:["Panoramik Bo\u011faz manzaras\u0131", "\u00c7ift y\u00fckseklik loft tavanlar", "\u00d6zel iskele & tekne ba\u011flama", "Ak\u0131ll\u0131 cam cephe sistemi", "Concierge & vale hizmeti", "\u015earap mahzeni & puro odas\u0131", "Infinity havuz", "\u00d6zel sinema salonu", "Helikopter pisti eri\u015fimi"],
    gallery:["p_lux", "p_res", "p_white", "p_villa"],
    floors:[{"name": "Bah\u00e7e Kat", "img": "", "units": ["B01", "B02"]}, {"name": "Loft Kat", "img": "", "units": ["L01", "L02", "L03"]}],
    apts:[{"no": "B01", "tip": "3+1 Bah\u00e7e Dubleks", "m2": "186", "kat": "Bah\u00e7e Kat", "cephe": "Bo\u011faz", "fiyat": "14.200.000 \u20ba", "durum": "musait"}, {"no": "B02", "tip": "3+1 Bah\u00e7e Dubleks", "m2": "192", "kat": "Bah\u00e7e Kat", "cephe": "Bo\u011faz", "fiyat": "14.800.000 \u20ba", "durum": "opsiyonlu"}, {"no": "L01", "tip": "2+1 Loft", "m2": "124", "kat": "Loft Kat", "cephe": "Bo\u011faz", "fiyat": "11.500.000 \u20ba", "durum": "musait"}, {"no": "L02", "tip": "4+1 Loft", "m2": "245", "kat": "Loft Kat", "cephe": "Panoramik", "fiyat": "22.900.000 \u20ba", "durum": "satildi"}, {"no": "L03", "tip": "4+1 Penthouse", "m2": "310", "kat": "Loft Kat", "cephe": "360\u00b0 Panoramik", "fiyat": "34.500.000 \u20ba", "durum": "musait"}],
    timeline:[{"ad": "Zemin Et\u00fcd\u00fc & Ruhsat", "tarih": "2024 Q1", "durum": "bitti"}, {"ad": "Temel & Kaz\u0131", "tarih": "2024 Q3", "durum": "bitti"}, {"ad": "Betonarme Karkas", "tarih": "2025 Q3", "durum": "devam"}, {"ad": "Cephe & Mekanik", "tarih": "2026 Q2", "durum": "bekliyor"}, {"ad": "\u0130nce \u0130\u015f\u00e7ilik", "tarih": "2027 Q1", "durum": "bekliyor"}, {"ad": "\u0130skan & Teslim", "tarih": "2027 Q2", "durum": "bekliyor"}],
    payment:{"pesin": "%30 pe\u015fin", "taksit": "48 aya varan vade", "banka": "Anla\u015fmal\u0131 bankalarla \u00f6zel faiz oranlar\u0131", "not": "Bo\u011faz cepheli dairelerde s\u0131n\u0131rl\u0131 stok."},
    location:{"adres": "\u00c7\u0131ra\u011fan Cad. No:42, Be\u015fikta\u015f / \u0130stanbul", "ulasim": ["Be\u015fikta\u015f iskele \u2013 5 dk", "Kabata\u015f tramvay \u2013 7 dk", "15 Temmuz \u015eehitler K\u00f6pr\u00fcs\u00fc \u2013 4 dk", "Taksim \u2013 12 dk"], "cevre": ["\u00c7\u0131ra\u011fan Saray\u0131 \u2013 400 m", "Y\u0131ld\u0131z Park\u0131 \u2013 800 m", "Be\u015fikta\u015f \u00e7ar\u015f\u0131 \u2013 1 km", "Bo\u011fazi\u00e7i \u00dcniversitesi \u2013 3 km"]},
    specs:[{"k": "M\u00fcteahhit", "v": "Meridyen Yap\u0131 A.\u015e."}, {"k": "Mimari Proje", "v": "MY Mimarl\u0131k & Tasar\u0131m"}, {"k": "Yap\u0131 Sistemi", "v": "Betonarme \u2013 C35/45"}, {"k": "Deprem Y\u00f6netmeli\u011fi", "v": "TBDY 2018 \u2013 DD-2"}, {"k": "Zemin S\u0131n\u0131f\u0131", "v": "ZB (sa\u011flam zemin)"}, {"k": "Enerji S\u0131n\u0131f\u0131", "v": "A+ \u2013 ak\u0131ll\u0131 cephe"}, {"k": "\u0130skan Durumu", "v": "2027 Q2 (planlanan)"}, {"k": "Toplam Blok", "v": "2 blok / 9 kat"}]},
  {t:'Meridyen Vadi Evleri',loc:'Çekmeköy, İstanbul',st:'tamam',type:'Villa · Müstakil',area:'62.000 m²',img:'p_villa',price:'22.000.000 ₺\'den başlayan',delivery:'Teslim edildi',units:'48 villa',desc:'Doğayla iç içe, müstakil bahçeli villa yaşamı.',progress:100,
    longDesc:"Meridyen Vadi Evleri, \u00c7ekmek\u00f6y'de 62.000 m\u00b2 do\u011fal vadi arazisi \u00fczerinde tamamlanm\u0131\u015f, m\u00fcstakil bah\u00e7eli 48 villadan olu\u015fan bir ya\u015fam projesidir. Her villa kendi bah\u00e7esi, \u00f6zel havuz opsiyonu ve ak\u0131ll\u0131 ev sistemiyle teslim edilmi\u015ftir. TBDY 2018 uyumlu, A s\u0131n\u0131f\u0131 enerji performansl\u0131 yap\u0131lar 2024'te iskan belgesini alm\u0131\u015ft\u0131r.",
    features:["M\u00fcstakil bah\u00e7e (250-600 m\u00b2)", "\u00d6zel y\u00fczme havuzu opsiyonu", "Ak\u0131ll\u0131 ev otomasyonu", "Kapal\u0131 site & 7/24 g\u00fcvenlik", "Ortak sosyal tesis & SPA", "\u00c7ocuk park\u0131 & y\u00fcr\u00fcy\u00fc\u015f parkurlar\u0131", "Jeotermal yerden \u0131s\u0131tma", "Kapal\u0131 garaj (2 ara\u00e7)", "Solar panel altyap\u0131s\u0131"],
    gallery:["p_villa", "p_home", "p_res", "p_white"],
    floors:[{"name": "Villa Tip A", "img": "", "units": ["VA-01", "VA-02"]}, {"name": "Villa Tip B", "img": "", "units": ["VB-01", "VB-02"]}],
    apts:[{"no": "VA-01", "tip": "5+2 M\u00fcstakil", "m2": "320", "kat": "3 katl\u0131 villa", "cephe": "Vadi", "fiyat": "Teslim edildi", "durum": "satildi"}, {"no": "VA-02", "tip": "5+2 M\u00fcstakil", "m2": "320", "kat": "3 katl\u0131 villa", "cephe": "Vadi", "fiyat": "Teslim edildi", "durum": "satildi"}, {"no": "VB-01", "tip": "6+2 M\u00fcstakil", "m2": "410", "kat": "3 katl\u0131 villa", "cephe": "Orman", "fiyat": "Teslim edildi", "durum": "satildi"}, {"no": "VB-02", "tip": "6+2 M\u00fcstakil", "m2": "410", "kat": "3 katl\u0131 villa", "cephe": "Orman", "fiyat": "\u0130kinci el \u2013 ileti\u015fim", "durum": "opsiyonlu"}],
    timeline:[{"ad": "Zemin Et\u00fcd\u00fc & Ruhsat", "tarih": "2021 Q1", "durum": "bitti"}, {"ad": "Altyap\u0131 & Temel", "tarih": "2021 Q4", "durum": "bitti"}, {"ad": "Villa \u0130n\u015faat\u0131", "tarih": "2022 Q4", "durum": "bitti"}, {"ad": "Peyzaj & Sosyal Tesis", "tarih": "2023 Q3", "durum": "bitti"}, {"ad": "\u0130skan Belgesi", "tarih": "2024 Q1", "durum": "bitti"}, {"ad": "Teslim Tamamland\u0131", "tarih": "2024 Q2", "durum": "bitti"}],
    payment:{"pesin": "Proje tamamland\u0131", "taksit": "\u0130kinci el sat\u0131\u015flarda banka kredisi", "banka": "T\u00fcm bankalarda ekspertiz onayl\u0131 kredi", "not": "Proje teslim edilmi\u015ftir; s\u0131n\u0131rl\u0131 ikinci el villa mevcuttur."},
    location:{"adres": "Vadi Cad. No:9, \u00c7ekmek\u00f6y / \u0130stanbul", "ulasim": ["TEM ba\u011flant\u0131s\u0131 \u2013 6 dk", "\u00c7ekmek\u00f6y metro \u2013 10 dk", "Sabiha G\u00f6k\u00e7en Havaliman\u0131 \u2013 25 dk", "\u00dcmraniye merkez \u2013 15 dk"], "cevre": ["Aydos Orman\u0131 \u2013 1 km", "\u00d6zel okul kamp\u00fcs\u00fc \u2013 2 km", "\u00c7ekmek\u00f6y devlet hastanesi \u2013 4 km", "Al\u0131\u015fveri\u015f merkezi \u2013 3 km"]},
    specs:[{"k": "M\u00fcteahhit", "v": "Meridyen Yap\u0131 A.\u015e."}, {"k": "Mimari Proje", "v": "MY Mimarl\u0131k & Tasar\u0131m"}, {"k": "Yap\u0131 Sistemi", "v": "Betonarme \u2013 C30/37"}, {"k": "Deprem Y\u00f6netmeli\u011fi", "v": "TBDY 2018 \u2013 DD-2"}, {"k": "Zemin S\u0131n\u0131f\u0131", "v": "ZB"}, {"k": "Enerji S\u0131n\u0131f\u0131", "v": "A \u2013 jeotermal"}, {"k": "\u0130skan Durumu", "v": "Al\u0131nd\u0131 (2024)"}, {"k": "Toplam Villa", "v": "48 m\u00fcstakil"}]},
  {t:'Anadolu Ofis Kule',loc:'Ataşehir, İstanbul',st:'tamam',type:'Ticari · Ofis',area:'40.200 m²',img:'p_office',price:'İletişime geçin',delivery:'Teslim edildi',units:'A+ ofis katları',desc:'Finans merkezinde A+ sınıfı akıllı ofis kulesi.',progress:100,
    longDesc:"Anadolu Ofis Kule, Ata\u015fehir finans merkezinde 40.200 m\u00b2 kiralanabilir alan sunan, LEED Gold sertifikal\u0131 A+ ofis kulesidir. Ak\u0131ll\u0131 bina y\u00f6netim sistemi (BMS), VAV iklimlendirme ve raised floor altyap\u0131s\u0131yla kurumsal kirac\u0131lara esnek kat planlar\u0131 sunar. 2024'te tamamlanm\u0131\u015f ve iskan belgesini alm\u0131\u015ft\u0131r.",
    features:["LEED Gold sertifikas\u0131", "Ak\u0131ll\u0131 bina y\u00f6netimi (BMS)", "Raised floor & esnek kat plan\u0131", "VAV iklimlendirme", "Y\u00fcksek h\u0131zl\u0131 asans\u00f6r (6 adet)", "Kapal\u0131 otopark (400 ara\u00e7)", "7/24 teknik destek & g\u00fcvenlik", "Konferans & toplant\u0131 kat\u0131", "Jenerat\u00f6r & UPS yedekleme"],
    gallery:["p_office", "p_white", "p_res", "p_lux"],
    floors:[{"name": "Lobi & Ortak Alan", "img": "", "units": ["Z-01"]}, {"name": "Tip Ofis Kat\u0131", "img": "", "units": ["K-05", "K-12"]}],
    apts:[{"no": "Z-01", "tip": "Zemin Ticari", "m2": "450", "kat": "Zemin", "cephe": "Cadde", "fiyat": "Kiraland\u0131", "durum": "satildi"}, {"no": "K-05", "tip": "A+ Ofis Kat\u0131", "m2": "820", "kat": "5. Kat", "cephe": "Panoramik", "fiyat": "\u0130leti\u015fime ge\u00e7in", "durum": "musait"}, {"no": "K-12", "tip": "A+ Ofis Kat\u0131", "m2": "820", "kat": "12. Kat", "cephe": "Panoramik", "fiyat": "\u0130leti\u015fime ge\u00e7in", "durum": "opsiyonlu"}],
    timeline:[{"ad": "Zemin Et\u00fcd\u00fc & Ruhsat", "tarih": "2021 Q2", "durum": "bitti"}, {"ad": "Derin Temel & \u0130ksa", "tarih": "2022 Q1", "durum": "bitti"}, {"ad": "Betonarme & \u00c7elik", "tarih": "2023 Q1", "durum": "bitti"}, {"ad": "Cephe & MEP", "tarih": "2023 Q4", "durum": "bitti"}, {"ad": "LEED Sertifikasyon", "tarih": "2024 Q1", "durum": "bitti"}, {"ad": "\u0130skan & Teslim", "tarih": "2024 Q2", "durum": "bitti"}],
    payment:{"pesin": "Kat/blok kiralama", "taksit": "Y\u0131ll\u0131k kira s\u00f6zle\u015fmesi", "banka": "Kurumsal kiralama & sat\u0131\u015f se\u00e7enekleri", "not": "Bo\u015f ofis katlar\u0131 i\u00e7in kurumsal kiralama g\u00f6r\u00fc\u015fmeleri s\u00fcr\u00fcyor."},
    location:{"adres": "Finans Cad. No:1, Ata\u015fehir / \u0130stanbul", "ulasim": ["Ata\u015fehir metro \u2013 3 dk", "TEM & D-100 ba\u011flant\u0131s\u0131 \u2013 5 dk", "Sabiha G\u00f6k\u00e7en Havaliman\u0131 \u2013 20 dk", "Kad\u0131k\u00f6y \u2013 18 dk"], "cevre": ["Finans Merkezi \u2013 kom\u015fu", "Watergarden AVM \u2013 1 km", "\u00d6zel hastane \u2013 2 km", "Metropol \u0130stanbul \u2013 800 m"]},
    specs:[{"k": "M\u00fcteahhit", "v": "Meridyen Yap\u0131 A.\u015e."}, {"k": "Mimari Proje", "v": "MY Mimarl\u0131k & Tasar\u0131m"}, {"k": "Yap\u0131 Sistemi", "v": "Betonarme + \u00c7elik \u2013 C40/50"}, {"k": "Deprem Y\u00f6netmeli\u011fi", "v": "TBDY 2018 \u2013 DD-1"}, {"k": "Sertifika", "v": "LEED Gold"}, {"k": "Enerji S\u0131n\u0131f\u0131", "v": "A+ \u2013 BMS"}, {"k": "\u0130skan Durumu", "v": "Al\u0131nd\u0131 (2024)"}, {"k": "Toplam Kat", "v": "18 ofis kat\u0131"}]},
  {t:'Yeni Ufuk Kentsel Dönüşüm',loc:'Kadıköy, İstanbul',st:'plan',type:'Kentsel Dönüşüm',area:'55.000 m²',img:'p_white',price:'Hak sahiplerine özel',delivery:'2028 Q1',units:'240 daire',desc:'6306 sayılı kanun kapsamında riskli yapı dönüşümü.',progress:10,
    longDesc:"Yeni Ufuk Kentsel D\u00f6n\u00fc\u015f\u00fcm projesi, Kad\u0131k\u00f6y'de 6306 say\u0131l\u0131 yasa kapsam\u0131nda riskli yap\u0131lar\u0131n d\u00f6n\u00fc\u015f\u00fcm\u00fcyle 55.000 m\u00b2 alanda 240 modern daire \u00fcretmeyi hedefler. Hak sahipleriyle kat kar\u015f\u0131l\u0131\u011f\u0131 s\u00f6zle\u015fmeleri tamamlanm\u0131\u015f, zemin et\u00fcd\u00fc ve TBDY 2018 uyumlu proje onay\u0131 al\u0131nm\u0131\u015ft\u0131r. \u015eu an ruhsat ve y\u0131k\u0131m a\u015famas\u0131ndad\u0131r.",
    features:["6306 kentsel d\u00f6n\u00fc\u015f\u00fcm g\u00fcvencesi", "Hak sahibine yeni & g\u00fc\u00e7l\u00fc konut", "TBDY 2018 deprem dayan\u0131m\u0131", "Sosyal donat\u0131 & ye\u015fil alan", "Kapal\u0131 otopark & s\u0131\u011f\u0131nak", "Ak\u0131ll\u0131 bina altyap\u0131s\u0131", "Ticari \u00fcnite & AVM kat\u0131", "Engelsiz eri\u015fim tasar\u0131m\u0131", "Enerji verimli A s\u0131n\u0131f\u0131 yap\u0131"],
    gallery:["p_white", "p_res", "p_office", "p_home"],
    floors:[{"name": "Ticari Zemin", "img": "", "units": ["T-01", "T-02"]}, {"name": "Konut Tip Kat", "img": "", "units": ["D-01", "D-02", "D-03"]}],
    apts:[{"no": "T-01", "tip": "Ticari D\u00fckkan", "m2": "85", "kat": "Zemin", "cephe": "Cadde", "fiyat": "\u00d6n talep", "durum": "musait"}, {"no": "D-01", "tip": "2+1", "m2": "98", "kat": "Tip Kat", "cephe": "Bah\u00e7e", "fiyat": "Hak sahibine \u00f6zel", "durum": "opsiyonlu"}, {"no": "D-02", "tip": "3+1", "m2": "135", "kat": "Tip Kat", "cephe": "Cadde", "fiyat": "\u00d6n talep", "durum": "musait"}, {"no": "D-03", "tip": "4+1", "m2": "172", "kat": "Tip Kat", "cephe": "Panoramik", "fiyat": "\u00d6n talep", "durum": "musait"}],
    timeline:[{"ad": "Hak Sahibi S\u00f6zle\u015fmeleri", "tarih": "2025 Q1", "durum": "bitti"}, {"ad": "Zemin Et\u00fcd\u00fc & Proje Onay\u0131", "tarih": "2025 Q4", "durum": "devam"}, {"ad": "Ruhsat & Y\u0131k\u0131m", "tarih": "2026 Q2", "durum": "bekliyor"}, {"ad": "Temel & Betonarme", "tarih": "2027 Q1", "durum": "bekliyor"}, {"ad": "\u0130nce \u0130\u015f\u00e7ilik & Cephe", "tarih": "2027 Q4", "durum": "bekliyor"}, {"ad": "\u0130skan & Teslim", "tarih": "2028 Q1", "durum": "bekliyor"}],
    payment:{"pesin": "Hak sahibine s\u0131f\u0131r maliyet", "taksit": "3. ki\u015filere 60 ay vade", "banka": "Kentsel d\u00f6n\u00fc\u015f\u00fcm faiz destekli kredi", "not": "Hak sahipleri i\u00e7in kira yard\u0131m\u0131 ve ta\u015f\u0131nma deste\u011fi sa\u011flan\u0131r."},
    location:{"adres": "Yeni Ufuk Mah. D\u00f6n\u00fc\u015f\u00fcm Sok., Kad\u0131k\u00f6y / \u0130stanbul", "ulasim": ["Kad\u0131k\u00f6y metro \u2013 8 dk", "Marmaray \u2013 12 dk", "Sahil yolu \u2013 5 dk", "E-5 ba\u011flant\u0131s\u0131 \u2013 10 dk"], "cevre": ["Kad\u0131k\u00f6y \u00e7ar\u015f\u0131 \u2013 1.5 km", "Moda sahil \u2013 2 km", "Devlet hastanesi \u2013 1 km", "Park & spor alan\u0131 \u2013 600 m"]},
    specs:[{"k": "M\u00fcteahhit", "v": "Meridyen Yap\u0131 A.\u015e."}, {"k": "Mimari Proje", "v": "MY Mimarl\u0131k & Tasar\u0131m"}, {"k": "D\u00f6n\u00fc\u015f\u00fcm Tipi", "v": "6306 Riskli Yap\u0131"}, {"k": "Deprem Y\u00f6netmeli\u011fi", "v": "TBDY 2018 \u2013 DD-2"}, {"k": "Zemin S\u0131n\u0131f\u0131", "v": "ZC (et\u00fct onayl\u0131)"}, {"k": "Enerji S\u0131n\u0131f\u0131", "v": "A (hedef)"}, {"k": "\u0130skan Durumu", "v": "2028 Q1 (planlanan)"}, {"k": "Toplam Daire", "v": "240 konut + ticari"}]},
  {t:'Marmara Sahil Konakları',loc:'Büyükçekmece, İstanbul',st:'plan',type:'Villa · Sahil',area:'74.000 m²',img:'p_home',price:'35.000.000 ₺\'den başlayan',delivery:'2028 Q3',units:'36 konak',desc:'Sahil şeridinde özel iskeleli lüks konaklar.',progress:5,
    longDesc:"Marmara Sahil Konaklar\u0131, B\u00fcy\u00fck\u00e7ekmece sahil \u015feridinde 74.000 m\u00b2 alanda planlanan, \u00f6zel iskeleli 36 l\u00fcks konaktan olu\u015fan bir ya\u015fam projesidir. Her konak deniz manzaras\u0131, \u00f6zel plaj eri\u015fimi ve marina kullan\u0131m hakk\u0131yla tasarlanmaktad\u0131r. Zemin et\u00fcd\u00fc tamamlanm\u0131\u015f, TBDY 2018 uyumlu konsept proje onay a\u015famas\u0131ndad\u0131r.",
    features:["\u00d6zel plaj & marina eri\u015fimi", "Deniz manzaral\u0131 t\u00fcm konaklar", "\u00d6zel iskele & tekne yeri", "Infinity havuz & beach club", "Ak\u0131ll\u0131 konak otomasyonu", "Helipad & vale hizmeti", "SPA & wellness merkezi", "\u015earap mahzeni", "Solar & jeotermal altyap\u0131"],
    gallery:["p_home", "p_villa", "p_lux", "p_res"],
    floors:[{"name": "Sahil S\u0131ras\u0131 Konak", "img": "", "units": ["S-01", "S-02"]}, {"name": "Marina Kona\u011f\u0131", "img": "", "units": ["M-01", "M-02"]}],
    apts:[{"no": "S-01", "tip": "6+2 Sahil Kona\u011f\u0131", "m2": "480", "kat": "3 katl\u0131 konak", "cephe": "Deniz", "fiyat": "35.000.000 \u20ba", "durum": "musait"}, {"no": "S-02", "tip": "6+2 Sahil Kona\u011f\u0131", "m2": "495", "kat": "3 katl\u0131 konak", "cephe": "Deniz", "fiyat": "38.500.000 \u20ba", "durum": "musait"}, {"no": "M-01", "tip": "7+2 Marina Kona\u011f\u0131", "m2": "620", "kat": "3 katl\u0131 konak", "cephe": "Marina", "fiyat": "52.000.000 \u20ba", "durum": "opsiyonlu"}, {"no": "M-02", "tip": "7+2 Marina Kona\u011f\u0131", "m2": "640", "kat": "3 katl\u0131 konak", "cephe": "Marina", "fiyat": "55.000.000 \u20ba", "durum": "musait"}],
    timeline:[{"ad": "Arsa & Zemin Et\u00fcd\u00fc", "tarih": "2025 Q2", "durum": "bitti"}, {"ad": "Konsept & \u0130mar", "tarih": "2026 Q1", "durum": "devam"}, {"ad": "Ruhsat & Altyap\u0131", "tarih": "2026 Q4", "durum": "bekliyor"}, {"ad": "Konak \u0130n\u015faat\u0131", "tarih": "2027 Q3", "durum": "bekliyor"}, {"ad": "Marina & Peyzaj", "tarih": "2028 Q2", "durum": "bekliyor"}, {"ad": "\u0130skan & Teslim", "tarih": "2028 Q3", "durum": "bekliyor"}],
    payment:{"pesin": "%35 pe\u015fin", "taksit": "Teslime kadar vade", "banka": "\u00d6zel bankac\u0131l\u0131k & d\u00f6viz \u00f6deme se\u00e7ene\u011fi", "not": "\u00d6n sat\u0131\u015f d\u00f6neminde \u00f6zel fiyat avantaj\u0131. S\u0131n\u0131rl\u0131 konak."},
    location:{"adres": "Sahil Bulvar\u0131 No:1, B\u00fcy\u00fck\u00e7ekmece / \u0130stanbul", "ulasim": ["Sahil yolu \u2013 0 dk (cephe)", "E-5 ba\u011flant\u0131s\u0131 \u2013 7 dk", "Atat\u00fcrk Havaliman\u0131 \u2013 25 dk", "B\u00fcy\u00fck\u00e7ekmece merkez \u2013 5 dk"], "cevre": ["B\u00fcy\u00fck\u00e7ekmece g\u00f6l\u00fc \u2013 2 km", "Marina & yat liman\u0131 \u2013 cephe", "\u00d6zel okul \u2013 3 km", "Sahil y\u00fcr\u00fcy\u00fc\u015f parkuru \u2013 0 m"]},
    specs:[{"k": "M\u00fcteahhit", "v": "Meridyen Yap\u0131 A.\u015e."}, {"k": "Mimari Proje", "v": "MY Mimarl\u0131k & Tasar\u0131m"}, {"k": "Yap\u0131 Sistemi", "v": "Betonarme \u2013 C35/45"}, {"k": "Deprem Y\u00f6netmeli\u011fi", "v": "TBDY 2018 \u2013 DD-2"}, {"k": "Zemin S\u0131n\u0131f\u0131", "v": "ZD (sahil \u2013 \u00f6zel temel)"}, {"k": "Enerji S\u0131n\u0131f\u0131", "v": "A+ (hedef)"}, {"k": "\u0130skan Durumu", "v": "2028 Q3 (planlanan)"}, {"k": "Toplam Konak", "v": "36 l\u00fcks konak"}]},
];
const BLOG=[
  {img:"img/blog/i01.jpg",imgAlt:"San Bernardino International Airport, San Bernardino, California",imgCredit:"Ken Lund · Openverse",imgCreditUrl:"https://www.flickr.com/photos/75683070@N00",date:'12 Haziran 2026',cat:'Kat Karşılığı',t:'Kat karşılığı inşaatta arsa sahibinin bilmesi gereken 7 madde',d:'Hisse oranından teslim süresine, sözleşmede kritik başlıklar.',
   body:'Kat karşılığı sözleşme, arsa sahibi ile yüklenici arasındaki dengeyi kuran ana metindir. İmzadan önce şu başlıklar netleşmeden ilerlenmemelidir.\n\n## Sözleşmede olmazsa olmazlar\n- **Paylaşım oranı ve bağımsız bölüm listesi:** Hangi dairelerin arsa sahibine kalacağı kat planı üzerinde tek tek işaretlenmeli.\n- **Teslim süresi ve gecikme şartı:** Ruhsat tarihine bağlı net takvim; gecikme hâlinde kira tazminatı maddesi.\n- **Teknik şartname:** Malzeme kalitesi marka/denklik düzeyinde yazılmalı; "birinci sınıf malzeme" gibi muğlak ifadeler yeterli değildir.\n- **Teminat düzeni:** Kat irtifakı devir sırası ve ipotek çözüm planı aşamalara bağlanmalı.\n\n## Süreçte dikkat\nİnşaat ilerlemesine bağlı devir (aşamalı tapu) arsa sahibini korur. Ruhsat, iskân ve kat mülkiyeti adımlarının her biri sözleşmede tarihe bağlanmalıdır. İmza öncesi metni bir gayrimenkul hukukçusuna incelettirmek, sonradan çıkabilecek uyuşmazlıkların en ucuz sigortasıdır.'},
  {img:"img/blog/i02.jpg",imgAlt:"Gateway Arch - St. Louis - Missouri",imgCredit:"Arch_Sam · Openverse",imgCreditUrl:"https://www.flickr.com/photos/132084522@N05",date:'28 Mayıs 2026',cat:'Deprem Güvenliği',t:'Deprem güvenli bina nasıl anlaşılır? TBDY 2018 rehberi',d:'Zemin etüdü, taşıyıcı sistem ve denetim kriterleri.',
   body:'Türkiye Bina Deprem Yönetmeliği (TBDY 2018), yeni yapıların tasarım ve denetim çerçevesini belirler. Bir binanın güvenliği üç katmanda okunur.\n\n## 1) Zemin\nZemin etüt raporu binanın kimliğidir: zemin sınıfı, taşıma kapasitesi ve sıvılaşma riski burada görülür. Temel tipi bu rapora göre seçilmiş olmalıdır.\n\n## 2) Taşıyıcı sistem\n- Projesine uygun perde ve kolon düzeni\n- Beton dayanım sınıfı ve çelik sınıfının test raporları\n- Sonradan taşıyıcıya müdahale (kolon kesme, duvar kaldırma) olup olmadığı\n\n## 3) Belge ve denetim\nYapı ruhsatı, yapı denetim firması kayıtları ve iskân belgesi bir bütündür. 2000 öncesi yapılarda performans analizi yaptırmak, riskli yapı tespiti için resmî ve net bir yoldur.'},
  {img:"img/blog/i03.jpg",imgAlt:"Complete Makeover - painted fireplace, refinished floor, Zen slate hearth, interior design, with Buddha statue, original",imgCredit:"Wonderlane · Openverse",imgCreditUrl:"https://www.flickr.com/photos/71401718@N00",date:'9 Mayıs 2026',cat:'Tadilat',t:'Tadilatta bütçe nasıl yönetilir? Adım adım rehber',d:'Keşiften malzeme seçimine, sürprizsiz tadilatın yolu.',
   body:'Tadilatta bütçe aşımının ana nedeni, işe keşifsiz başlamaktır. Doğru sıralama sürprizleri baştan eler.\n\n## Adım adım\n- **Yerinde keşif:** Tesisat, elektrik ve rutubet durumu görülmeden fiyat verilmez; verilen fiyat da tutmaz.\n- **Kalem kalem teklif:** "Götürü" tek satır yerine iş kalemlerine bölünmüş teklif isteyin; kıyaslama ancak böyle yapılır.\n- **Malzeme seçimini öne alın:** Seramik, armatür ve mutfak gibi kalemler işin başında netleşirse hem termin hem bütçe korunur.\n- **Yedek pay:** Toplam bütçenin bir bölümünü öngörülemeyen işlere ayırın; eski binalarda duvar arkası her zaman sürpriz taşır.\n\n## Sözleşme\nÖdemeyi hakedişe bağlayın: iş bitti, kontrol edildi, ödeme yapıldı. Teslim tarihi ve eksik giderme süresi yazılı olmalıdır.'},
  {img:"img/blog/i04.jpg",imgAlt:"North Charleston breaks ground on new $42 million Public Works facility",imgCredit:"North Charleston · Openverse",imgCreditUrl:"https://www.flickr.com/photos/36686551@N06",date:'21 Nisan 2026',cat:'Kentsel Dönüşüm',t:'Kentsel dönüşümde hak sahibi yol haritası: riskli yapıdan yeni tapuya',d:'6306 sayılı kanun sürecinde adımlar, haklar ve dikkat noktaları.',
   body:'6306 sayılı kanun kapsamındaki dönüşüm süreci, hak sahibi için belirli aşamalardan oluşur. Süreci bilmek, pazarlık gücünü korur.\n\n## Aşamalar\n- **Riskli yapı tespiti:** Lisanslı kuruluşun raporu ve ilgili idarenin onayı ile başlar.\n- **Ortak karar:** Maliklerin kanunda öngörülen çoğunluğu ile yıkım ve yeniden yapım kararı alınır.\n- **Yüklenici seçimi:** Teklifler paylaşım oranıyla birlikte; teknik şartname, teslim süresi ve teminat düzeniyle birlikte değerlendirilmelidir.\n- **Sözleşme ve yıkım:** Kira yardımı ve taşınma desteği başvuruları bu aşamada yapılır.\n- **İnşaat ve yeni tapu:** Kat irtifakından kat mülkiyetine geçişle süreç tamamlanır.\n\n## Dikkat\nEn düşük teklifi değil, teminatı ve referansı güçlü teklifi seçmek; ödeme ve devir düzenini aşamalara bağlamak hak sahibinin ana güvencesidir.'},
  {img:"img/blog/i05.jpg",imgAlt:"Greater Winnipeg Central District Street Parking (1946)",imgCredit:"Manitoba Historical Maps · Openverse",imgCreditUrl:"https://www.flickr.com/photos/11496488@N07",date:'2 Nisan 2026',cat:'İmar & Ruhsat',t:'İmar durumu ve ruhsat süreci: başvurudan iskâna',d:'İmar çapından yapı kullanma iznine, resmî sürecin adımları.',
   body:'Bir arsanın gerçek değeri imar durumunda gizlidir; bir binanın hukuki güvencesi ise iskân belgesinde.\n\n## Süreç sırası\n- **İmar çapı (imar durumu belgesi):** Emsal, taban alanı, kat yüksekliği ve çekme mesafeleri burada tanımlanır.\n- **Proje onayı:** Mimari, statik, mekanik ve elektrik projeleri ilgili idarece onaylanır.\n- **Yapı ruhsatı:** Onaylı projelerle alınır; ruhsatsız başlanan yapı her aşamada yaptırım riski taşır.\n- **Yapı denetimi:** İnşaat boyunca seviye tespitleri ve malzeme testleri kayıt altına alınır.\n- **İskân (yapı kullanma izni):** Projesine uygun tamamlanan yapıya verilir; elektrik-su aboneliklerinden krediye kadar pek çok işlemin ön şartıdır.\n\nSatın almada ruhsat ile fiilî yapı arasındaki uyum mutlaka kontrol edilmelidir; projeye aykırılık, iskân alınamamasının en sık nedenidir.'},
  {img:"img/blog/i06.jpg",imgAlt:"The stripped facade connects the two structures and the decks",imgCredit:"Jeremy Levine Design · Openverse",imgCreditUrl:"https://www.flickr.com/photos/25186605@N04",date:'14 Mart 2026',cat:'Enerji & Sürdürülebilirlik',t:'Enerji kimlik belgesi ve A sınıfı bina: neden önemli?',d:'EKB sınıfları, yalıtım ve işletme maliyetine etkisi.',
   body:'Enerji Kimlik Belgesi (EKB), binanın enerji performansını sınıflandıran resmî belgedir ve alım-satım ile kiralamada aranır.\n\n## Sınıflar ne anlatır\nA sınıfı en verimli, G en düşük performanslı sınıftır. Yeni yapıların belirli bir verimlilik sınıfının altında tasarlanması mümkün değildir; bu nedenle yeni projelerde EKB sınıfı doğrudan yapı kalitesinin bir göstergesidir.\n\n## Verimliliği belirleyen unsurlar\n- Dış cephe ve çatı yalıtımının niteliği\n- Doğrama ve cam kombinasyonu\n- Isıtma-soğutma sisteminin verimi ve otomasyonu\n- Aydınlatma tasarımı ve yenilenebilir enerji katkısı\n\n## Alıcıya etkisi\nVerimli bina, aynı konfor için daha az enerji harcar: aylık işletme gideri düşer, konfor sabit kalır ve yeniden satışta belge sınıfı güçlü bir pazarlık unsuru olur.'},
  {img:"img/blog/i07.jpg",imgAlt:"Map of the Province of Manitoba (1871)",imgCredit:"Manitoba Historical Maps · Openverse",imgCreditUrl:"https://www.flickr.com/photos/11496488@N07",date:'26 Şubat 2026',cat:'Arsa & Fizibilite',t:'Arsa değerleme ve fizibilite: yatırım öncesi 6 kontrol',d:'İmar, zemin, altyapı ve maliyet dengesiyle doğru arsa seçimi.',
   body:'Arsa yatırımında hata telafisi zordur; çünkü hatanın kaynağı çoğu zaman satın almadan önce görülebilecek bir belgedir.\n\n## 6 kontrol başlığı\n- **İmar durumu:** Emsal ve fonksiyon (konut, ticari, karma) beklentiyle uyumlu mu?\n- **Tapu kaydı:** Şerh, ipotek, irtifak ve hisse yapısı temiz mi?\n- **Zemin niteliği:** Etüt öncesi bölge zemin karakteri; temel maliyetini doğrudan etkiler.\n- **Altyapı:** Yol, su, elektrik, kanalizasyon parsel sınırında mı, ne kadar uzakta?\n- **Çevre gelişimi:** Ulaşım yatırımları ve bölgenin fiilî gelişme yönü.\n- **Maliyet dengesi:** Arsa payı + inşaat maliyeti toplamının, bölgedeki satış değeriyle karşılaştırılması.\n\nBu altı başlık birlikte okunduğunda fizibilite tablosu kendiliğinden ortaya çıkar; tek başına "konum güzel" hissi bir fizibilite değildir.'},
  {img:"img/blog/i08.jpg",imgAlt:"A construction site of the new metro, Noord-Zuidlijn in Amsterdam city, location Ferdinand Bolstraat - near the Albert C",imgCredit:"Amsterdam free photos & pictures of the Dutch city · Openverse",imgCreditUrl:"https://www.flickr.com/photos/104736837@N03",date:'5 Şubat 2026',cat:'Anahtar Teslim',t:'Anahtar teslim inşaatta süreç ve teslim takvimi',d:'Projeden teslime aşama aşama planlama ve hakediş düzeni.',
   body:'Anahtar teslim model, işverenin tek muhatapla çalıştığı ve sonucu "oturulabilir yapı" olarak teslim aldığı modeldir. Gücü, takvim ve hakediş disiplininden gelir.\n\n## Aşamalar\n- **Proje ve ruhsat:** Onaylı proje olmadan şantiye kurulmaz.\n- **Kaba yapı:** Temel, taşıyıcı sistem ve çatı; seviye tespitleri yapı denetim kayıtlarıyla ilerler.\n- **İnce işler:** Tesisat, yalıtım, doğrama, iç mekân; malzeme onayları işveren imzasıyla alınır.\n- **Teslim:** Eksik listesi (punch list) kapatılır, iskân süreciyle birlikte teslim tutanağı imzalanır.\n\n## Takvim disiplini\nHer aşamanın bitişi bir hakedişe bağlanır: ilerleme görülmeden ödeme yapılmaz. Hava koşulları ve tedarik gecikmeleri için takvime baştan tolerans yazılır; yazılmayan tolerans, uyuşmazlık olarak geri döner.'},
  {img:"img/blog/i09.jpg",imgAlt:"NRC Resident Inspector at the Summer New Reactor Construction Site - August 2012",imgCredit:"NRCgov · Openverse",imgCreditUrl:"https://www.flickr.com/photos/69383258@N08",date:'15 Ocak 2026',cat:'Yapı Denetimi',t:'Yapı denetimi ve iş güvenliği: şantiyede kalite güvencesi',d:'Denetim mekanizması, malzeme testleri ve güvenli şantiye kültürü.',
   body:'Yapı denetimi, projeye uygunluğun bağımsız bir gözle doğrulanmasıdır; iş güvenliği ise şantiyenin günlük disiplinidir. İkisi birlikte kaliteyi güvence altına alır.\n\n## Denetim neyi izler\n- Beton dökümünde numune alınması ve dayanım testleri\n- Demir donatının projeye uygunluğunun seviye tespitiyle kaydı\n- Yalıtım ve tesisat uygulamalarının kapanmadan önce kontrolü\n\n## İş güvenliği kültürü\nKişisel koruyucu donanım, kenar korumaları ve iskele kontrolleri; eğitim kayıtları ve sahada günlük gözetimle desteklenir. Güvenli şantiye yalnızca yasal bir zorunluluk değil, işin zamanında ve kaliteli bitmesinin de ön koşuludur.\n\nTeslim aşamasında yapı denetim dosyası, binanın "karnesi" olarak alıcıya sunulabilmelidir; düzenli tutulmuş dosya kurumsal yüklenicinin imzasıdır.'},
  {"date": "12 Ağustos 2026", "cat": "Yapı Denetimi", "t": "Betonarme Yapıda Kalite ve Denetim Rehberi", "d": "Betonarme yapılarda kaliteyi belirleyen süreçleri, denetim aşamalarını ve uzun ömürlü projeler için kritik kontrolleri keşfedin.", "body": "## Betonarme Yapıda Kalite ve Denetim Neden Kritik?\n\nBetonarme, modern inşaat sektörünün bel kemiğini oluşturur. Ancak bir yapının güvenliği ve uzun ömrü; yalnızca proje çizimlerinin doğruluğuyla değil, sahada uygulanan kalite kontrol süreçlerinin titizliğiyle doğrudan ilişkilidir. Kalite ve denetim; görsel bir kontrol listesinden ibaret değildir. İyi kurgulanmış bir denetim mekanizması; malzeme seçiminden beton dökümüne, kalıp işçiliğinden kür uygulamasına kadar pek çok aşamada aktif rol oynar. Peki, kaliteli bir betonarme yapı nasıl inşa edilir ve sahada hangi denetim noktaları asla atlanmamalıdır? Bu rehberde, betonarme yapı üretiminde kaliteyi yukarı taşıyan temel başlıkları ele alıyoruz.\n\n## Doğru Malzeme Seçimi ve Kabul Kontrolleri\n\nKalitenin temeli, şantiyeye giren malzemenin doğru olmasıyla atılır. Çimento, agrega, su, katkı maddeleri ve donatı çeliği; mutlaka ilgili standartlara uygun olmalı ve tedarikçi belgeleriyle desteklenmelidir. Çimentoda TS EN 197-1 standardına uygunluk, agrega için granülometri ve organik madde analizi, donatı için ise TS 708 standardına uygunluk beyanı gibi belgeler kontrol edilmelidir.\n\nMalzeme kabulü sırasında şu hususlara dikkat edilmelidir:\n\n- Beton santralinden gelen transmikser sevk irsaliyelerinin incelenmesi\n- Beton sınıfının projedeki tasarım değeriyle birebir uyumlu olması\n- Donatı çapları, yüzey özellikleri ve korozyon durumunun yerinde doğrulanması\n- Bağlayıcı ve katkı malzemelerinin son kullanma tarihlerinin kontrol edilmesi\n\nŞantiyede yapılan bu ilk kabul kontrolleri, daha sonra geri dönüşü mümkün olmayan hataların önüne geçmenin en ucuz yoludur. Kusurlu malzemenin betona karışması, yapının ömrünü yıllar içinde ciddi şekilde kısaltır. Bu nedenle malzeme kabullerini salt bir \"evrak işi\" olarak görmemek, sahada görevli mühendislerin ciddiyetle uygulaması gerekir.\n\n## Kalıp ve İskele Uygulamalarının Denetimi\n\nKalıp, betonun şeklini almasını sağlayan geçici bir sistem gibi görünse de kalite üzerindeki etkisi kalıcıdır. Kalıp yüzeyinin düzgünlüğü, kalıp yağı kullanımı, bağlantı elemanlarının sıkılığı ve iskelenin taşıma kapasitesi; betonun görünümünü ve dayanımını doğrudan etkiler. Yanlış yerleştirilmiş kalıplar, beton dökümü sırasında şişme veya göçme riski oluşturur. Bu da", "img": "img/blog/i10.jpg", "imgAlt": "2011.02 - 'Still-life of construction', close-up on the demolition of concrete structure of the former Post Head Office ", "imgCredit": "Amsterdam free photos & pictures of the Dutch city · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/104736837@N03"},
  {"date": "9 Ağustos 2026", "cat": "Piyasa", "t": "Karma Kullanımlı Projeler: Şehir Hayatının Yeni Standardı", "d": "Karma kullanımlı projeler; konut, ofis ve ticari alanları bir araya getirerek zamandan kazandırır, değer artışı sağlar ve sürdürülebilir şehir yaşamını mümkün kılar.", "body": "Modern şehircilik anlayışı, tek işlevli binalardan giderek uzaklaşıyor. İstanbul gibi metropollerde artık yalnızca konut ya da yalnızca ofis içeren yapılar yerine; yaşam, çalışma ve eğlenceyi tek çatı altında toplayan **karma kullanımlı projeler** öne çıkıyor. Konut, ofis, alışveriş merkezi, sosyal donatı ve açık yeşil alanları bütünleşik bir ekosistem olarak sunan bu projeler, hem kullanıcılarına hem de yatırımcılarına ciddi avantajlar sağlıyor. Peki bu projeleri bu kadar cazip kılan dinamikler neler? Gelin, karma kullanımlı projelerin sunduğu fırsatları derinlemesine inceleyelim.\n\n## Yaşamın Ritmi Tek Adreste\n\nKarma kullanımlı projelerin en büyük avantajı, **zamandan kazanç** sağlamasıdır. Sabah işe gitmek için saatlerce trafikte vakit kaybetmek, akşam eve dönüşte yorucu bir yolculuk yapmak artık geçmişte kalıyor. Aynı proje içinde konutunuz, ofisiniz ve ihtiyacınız olan tüm sosyal donatılar yer aldığında; günlük rutinleriniz yürüme mesafesine sıkışıyor. İşten çıktıktan sonra spor salonuna gitmek, market alışverişini yapmak ya da bir kafede arkadaşlarınızla buluşmak için farklı bölgelere gitmenize gerek kalmıyor. Bu entegre yaşam modeli, bireylere hem fiziksel hem de zihinsel bir ferahlık kazandırıyor.\n\n## Yatırımcı İçin Yüksek Değer Artışı\n\nGayrimenkul yatırımında en kritik kriterlerden biri, bölgenin gelişim potansiyelidir. Karma kullanımlı projeler, bulundukları bölgeye adeta bir çekim merkezi haline gelir. İçerisinde barındırdığı ofisler ve ticari birimler sayesinde gün boyu canlılık gösteren bu projeler, çevresindeki altyapının da gelişmesini tetikler. Bu durum, projedeki konut birimlerinin ve ticari alanların **piyasa değerinin sürekli olarak artmasına** olanak tanır. Kira getirisi açısından bakıldığında da durum farklı değildir. Yoğun talep gören karma projelerdeki konutlar, tek başına konut projelerine kıyasla genellikle daha yüksek kira bedeline ve daha düşük boşluk oranına sahiptir.\n\n### Sürdürülebilir Kira Geliri\n\nTek bir binaya yapılan yatırım ile karma projeye yapılan yatırım arasındaki fark, risk dağılımında da kendini gösterir. Karma kullanımlı projelerde konut, ofis ve perakende birimlerinin aynı anda değerlenmesi, yatırımcının portföyünü doğal olarak çeşitlendirir. Ekonomik dalgalanmalarda bile", "img": "img/blog/i11.jpg", "imgAlt": "Mountain House", "imgCredit": "dok1 · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/51096110@N00"},
  {"date": "10 Ağustos 2026", "cat": "Anahtar Teslim", "t": "Konut Teslim Takvimi Nasıl Okunur? Alıcı Rehberi", "d": "Konut projelerinde teslim takvimi nasıl okunur? Tapu, iskan, hak ediş ve gecikme cezaları hakkında bilmeniz gereken her şeyi adım adım anlatıyoruz.", "body": "## Konut Alırken Teslim Takvimi Neden Bu Kadar Önemli?\n\nBir konut projesine yatırım yaparken en çok merak edilen konuların başında \"anahtar ne zaman teslim edilecek?\" sorusu gelir. Ancak teslim takvimi yalnızca bir tarih değildir; projenin hangi aşamada olduğunu, inşaatın ne kadar ilerlediğini ve yasal süreçlerin ne zaman tamamlanacağını gösteren kritik bir yol haritasıdır. Özellikle İstanbul gibi büyük şehirlerde projelerin zamanında teslim edilmesi, hem yatırımcılar hem de ev sahibi olacaklar için büyük önem taşır.\n\nTeslim takvimini doğru okumak, mağduriyet yaşamamak adına atılacak en önemli adımdır. Bir proje satın alırken sözleşmede yer alan teslim tarihi, sadece inşaatın bitişini değil; iskan ruhsatı, tapu devri ve ortak alanların kullanıma hazır hale gelmesi gibi birçok süreci kapsar. Bu nedenle alıcıların teslim takvimi okuryazarlığına sahip olması, sürecin her aşamasında bilinçli karar vermelerini sağlar.\n\n## Teslim Takviminin Temel Bileşenleri\n\nBir konut projesinin teslim takvimi, yalnızca \"anahtar teslim tarihi\"nden ibaret değildir. Profesyonel bir proje yönetiminde takvim; sözleşme tarihi, inşaat başlangıcı, kaba inşaatın tamamlanması, ince yapı işleri, iskan başvurusu ve nihai teslim gibi birçok aşamayı içerir. Bu aşamaların her biri, projenin genel gidişatı hakkında size önemli ipuçları verir.\n\nÖzellikle İstanbul'da faaliyet gösteren kurumsal inşaat firmaları, teslim takvimini sözleşmede açıkça belirtmek zorundadır. Sözleşmede yer alan tarih, çoğu zaman \"fiili teslim tarihi\" olarak adlandırılır ve bu tarih, proje tamamlandığında anahtarların alıcıya teslim edileceği günü ifade eder. Ancak bu tarihin yanı sıra ara dönemlerde tamamlanması gereken iş kalemleri de takvimin bir parçasıdır.\n\n### İnşaat Sürecindeki Kilometre Taşları\n\nTeslim takvimini okurken dikkat etmeniz gereken ilk şey, inşaat sürecindeki kilometre taşlarıdır. Bunlar;\n\n- **Zemin etüdü ve temel atma:** Projenin fiziksel olarak başladığı andır.\n- **Kaba inşaatın tamamlanması:** Taşıyıcı sistemin bitirilmesi, duvarların örülmesi ve çatının kapatılması aşamasıdır.\n- **İnce yapı işleri:** Elektrik, sıhhi tesisat, boya, seramik, kapı ve pencere montajı gibi işlemleri içerir.\n- **Çevre düzenlemesi ve", "img": "img/blog/i12.jpg", "imgAlt": "Ickworth House - Central Rotunda", "imgCredit": "ell brown · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/39415781@N06"},
  {"date": "26 Temmuz 2026", "cat": "Proje Yönetimi", "t": "Şantiyede İş Programı ve Süre Yönetimi Rehberi", "d": "Şantiyede iş programı nasıl hazırlanır? Kritik yol analizi, kaynak planlama ve gecikme önleme stratejileriyle süre yönetimini derinlemesine keşfedin.", "body": "## Şantiyede İş Programı Neden Kritik?\n\nBir inşaat projesinin başarısı yalnızca beton kalitesiyle ya da mimari detaylarla ölçülmez. Projenin taahhüt edilen sürede teslim edilmesi, maliyet kontrolü kadar önemli bir başarı göstergesidir. İş programı; tüm imalat kalemlerinin, kaynakların ve teslim tarihlerinin tek bir zaman eksenine oturtulduğu yol haritasıdır. Program olmadan yürütülen şantiyelerde işçilik verimliliği düşer, malzeme siparişleri gecikir, ekipler birbirinin işini bekler ve nihayetinde proje süresi uzar. Süre uzaması ise doğrudan maliyet artışı, sözleşmesel cezalar ve müşteri güveni kaybı anlamına gelir.\n\nİyi hazırlanmış bir iş programı; proje ekibine neyin, ne zaman, hangi sırayla ve hangi kaynaklarla yapılacağını söyler. Alt yüklenicilerin koordinasyonunu kolaylaştırır, malzeme tedarik süreçlerini önden planlamayı sağlar ve olası riskleri henüz ortaya çıkmadan görünür kılar. Bu rehberde, şantiyede uygulanabilir iş programı hazırlama yöntemlerini, süre yönetiminin temel prensiplerini ve gecikmeleri önleme stratejilerini adım adım ele alıyoruz.\n\n## İş Programı Türleri ve Kullanım Alanları\n\nHer projenin ihtiyacı farklıdır; bu yüzden iş programı da tek bir formatta hazırlanmaz. Projenin büyüklüğüne, sözleşme tipine ve yönetim kademesine göre farklı detay seviyelerinde programlar oluşturulur.\n\n- **Stratejik (Master) Program:** Projenin genel çerçevesini çizen, ana fazları gösteren ve genellikle yönetim kurulu ile üst düzey yöneticilere sunulan üst seviye plandır. Tek bir çizelge üzer", "img": "img/blog/i13.jpg", "imgAlt": "Ground broken on new Humphreys high school and elementary school", "imgCredit": "USAG-Humphreys · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/31687107@N07"},
  {"date": "17 Temmuz 2026", "cat": "Piyasa", "t": "Konut Projelerinde Ortak Alan Tasarımında Yeni Dönem", "d": "İstanbul konut projelerinde ortak alanlar artık birer yaşam merkezi. Güncel trendler, kullanıcı odaklı ve sürdürülebilir ortak alan tasarımını mercek altına alıyor.", "body": "## Ortak Alanlar: Konut Yatırımının Yeni Kalbi\n\nİstanbul'da konut projesi denildiğinde akla yalnızca dairelerin metrekareleri, oda sayıları veya manzarası gelmiyor. Günümüzde bilinçli alıcı ve yatırımcılar, yaşam alanlarını seçerken projenin sunduğu sosyal donatıları, yeşil alanları ve ortak kullanım alanlarını da birinci öncelik olarak değerlendiriyor. Bu değişim, inşaat ve gayrimenkul geliştirme sektöründe projelerin konsept aşamasından itibaren köklü bir dönüşümü zorunlu kılıyor. Yalnızca betonarme yığınlar değil; insanların bir araya geldiği, sosyalleştiği, çalıştığı ve dinlendiği yaşam platformları inşa ediyoruz. Bu yazıda, İstanbul özelinde konut projelerinde ortak alan tasarımındaki güncel eğilimleri, bu eğilimlerin yatırım değerine etkisini ve gelecek öngörülerimizi derinlemesine ele alıyoruz.\n\n## Kullanıcı Odaklı Tasarım: Standarttan Kişiselleştirilmiş Yaşam Alanlarına\n\nGeçmişte ortak alanlar, genellikle projenin imar durumunu doldurmak veya pazarlama broşürlerinde vitrin oluşturmak amacıyla tasarlanırdı. Havuz, spor salonu ve çocuk oyun alanı standardının ötesine geçemeyen bu yaklaşım, bugün yerini son derece analitik ve kullanıcı odaklı bir tasarım felsefesine bırakıyor. Biz de projelerimizi planlarken hedef kitlemizin yaşam tarzını, günlük rutinler", "img": "img/blog/i14.jpg", "imgAlt": "Palace Hotel, Prague (1909) iii", "imgCredit": "A.Davey · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/40595948@N00"},
  {"date": "8 Temmuz 2026", "cat": "Yalıtım", "t": "Doğru Yalıtım Malzemesi Seçimi: Isı, Su, Ses Rehberi", "d": "Doğru yalıtım malzemesi nasıl seçilir? Isı, su ve ses yalıtımında bölgeye ve yapıya göre uzman önerileri. Dayanıklı ve ekonomik çözümleri keşfedin.", "body": "## Yalıtım, Bir Lüks Değil Zorunluluktur\n\nYapı sektöründe sıkça duyduğumuz \"yalıtım\" kavramı, çoğu zaman yalnızca enerji faturalarını düşürmek olarak algılanır. Ancak doğru malzeme seçimi; binanın ömrünü uzatmak, yaşam konforunu artırmak ve olası yapısal hasarların önüne geçmek için kritik bir mühendislik konusudur. İstanbul gibi deprem riski, yüksek nem oranı ve yoğun şehir gürültüsü barındıran bir bölgede yalıtım, estetik bir tercih değil, yapısal bir zorunluluktur.\n\nBir binaya yalıtım uygulamak, onu dış etkenlerden koruyan bir kalkan oluşturmak demektir. Ancak en büyük hata, üç ana yalıtım türü olan ısı, su ve ses yalıtımının birbirinin yerine geçeceğini düşünmektir. Her birinin altında yatan fiziksel prensipler farklıdır ve bu farklılıklar malzeme seçimini doğrudan etkiler.\n\n## Isı Yalıtımı: Enerjiyi Duvarlarınızda Hapsetmeyin\n\nIsı yalıtımının temel amacı, kışın sıcak havanın içeride kalmasını, yazın ise dışarıdaki sıcaklığın içeri girmesini engellemektir. Bu, binanın enerji kimlik belgesinde de doğrudan karşılık bulur. Doğru bir ısı yalıtımı seçimi, ısıtma ve soğutma giderlerinde yüzde 50'ye varan tasarruf sağlayabilir.\n\nMalzeme seçiminde dikkat edilmesi gereken ana kriter, ısı iletkenlik katsayısıdır (lambda değeri). Ne kadar düşükse malzeme o kadar iyi yalıtır.\n\n- **XPS ve EPS (Genleştirilmiş/aşırı polistiren):** Ekonomik ve hafif olmaları nedeniyle cephelerde en yaygın kullanılan malzemelerdir. Su emme oranları düşüktür, ancak buhar geçirgenlikleri sınırlıdır. Özellikle bodrum duvarları ve temelde XPS, zemin ile temas eden bölgelerde vazgeçilmezdir.\n- **Taş yünü:** Ateşe dayanıklılığı en yüksek yalıtım malzemelerindendir. Ayrıca buhar geçirgenliği sayesinde duvarların nefes almasını sağlar. Yoğun yapısı, ses yalıtımına da doğal olarak katkı sağlar. Karkas ve perde duvar uygulamalarında sıklıkla tercih edilir.\n- **Cam yünü:** Isı yalıtımında hafifliği ve esnekliği ile öne çıkar;", "img": "img/blog/i15.jpg", "imgAlt": "Sub-Angstrom Microscopy and Microanalysis (SAMM) facility", "imgCredit": "Argonne National Laboratory · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/35734278@N05"},
  {"date": "26 Haziran 2026", "cat": "Akıllı Bina", "t": "Akıllı Binalar Konut Değerini Nasıl Artırıyor?", "d": "İstanbul'da akıllı bina teknolojileri konut fiyatlarını ve kira getirisini doğrudan etkiliyor. Hangi sistemler değeri artırır, hangileri maliyet getirir?", "body": "Gayrimenkul piyasasında son on yılda yaşanan en büyük dönüşüm, beton ve çeliğin ötesinde teknolojinin yaşam alanlarına entegre olmasıyla yaşandı. İstanbul gibi metropollerde artık bir konutun değeri yalnızca bulunduğu konum, metrekare büyüklüğü veya manzarasıyla ölçülmüyor. Alıcılar ve yatırımcılar, dairenin içindeki akıllı sistemleri, binanın enerji altyapısını ve güvenlik teknolojilerini de fiyatın bir parçası olarak değerlendiriyor. Peki akıllı bina teknolojileri gerçekten konut değerini nasıl etkiliyor? Bu sorunun cevabı, hem bugünün satış rakamlarında hem de geleceğin kira getirilerinde saklı.\n\n## Akıllı Bina Nedir, Hangi Sistemleri İçerir?\n\nAkıllı bina kavramını tek bir teknolojiye indirgemek yanlış olur. Bir binanın akıllı sayılabilmesi için birden fazla sistemin merkezi bir altyapı üzerinden yönetilmesi gerekir. Bunların başında ısıtma, soğutma ve havalandırma (HVAC) sistemlerinin otonom kontrolü gelir. Sensörler, ortamdaki insan yoğunluğunu ve hava kalitesini ölçerek enerji tüketimini optimize eder. İkinci önemli bileşen, akıllı aydınlatma sistemleridir. Gün ışığından maksimum faydalanan, hareket algılayıcılarıyla gereksiz enerji harcamasını önleyen bu sistemler hem faturaları düşürür hem de çevresel ayak izini azaltır.\n\nGüvenlik ve erişim kontrolü de akıllı binaların vazgeçilmez bir parçasıdır. Yüz tanıma, parmak izi ve mobil kimlik doğrulama gibi biyometrik çözümler, geleneksel anahtar ve kart sistemlerinin yerini alıyor. Bu sistemler yalnızca hırsızlığa karşı değil, aynı zamanda yangın, gaz kaçağı ve su baskını gibi acil durumlara karşı da proaktif uyarılar sunuyor. Üstelik tüm bu veriler, yapay zekâ destekli bir merkezî platformda toplanarak bina yöneticilerine anlık raporlar hâlinde iletilir. Böylece küçük bir arıza büyük bir maliyete dönüşmeden müdahale edilir.\n\n## Konut Değerine Doğrudan Etkisi: Satış Fiyatı ve Kira Getirisi\n\nAkıllı teknolojilerin konut değerine katkısını iki başlıkta incelemek mümkün: birincil satış değeri ve ikincil kira getirisi. Yapılan uluslararası araştırmalar ve Türkiye’deki proje satış verileri, akıllı bina sertifikasına veya kapsamlı bir otomasyon altyapısına sahip konutların, benzer konum ve büyüklükteki geleneksel konutlara göre genellikle daha yüksek birim fiyatla satılma eğiliminde olduğunu; ancak bu farkın bölgeden bölgeye ve projeden projeye değişebildiğini gösteriyor. Bu fark, özellikle İstanbul’un yeni gelişim akslarında ve lüks segmentte daha da belirginleşiyor.\n\nKira getirisinde ise durum daha da net. Enerji verimliliği yüksek olan bir daire, aylık elektrik ve ısınma faturalarını ciddi oranda düşürür. Bu da kiracılar için uzun vadede cazip bir tasarruf anlamına gelir. Dolayısıyla akıllı bir konut, aynı bölgedeki muadillerine göre daha kısa sürede kiracı bulur ve daha yüksek kira bedeliyle değerlendirilir. Yatırımcı gözüyle bakıldığında, bu durum doğrudan kapitalizasyon oranına (cap rate) olumlu yansır. Yani sadece bugünkü satış fiyatı değil, yıllar içinde elde edilecek toplam getiri de akıll", "img": "img/blog/i16.jpg", "imgAlt": "Sapphire Court - Technology Smart", "imgCredit": "Earth Infrastructures · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/64377484@N07"},
  {"date": "17 Haziran 2026", "cat": "Enerji & Sürdürülebilirlik", "t": "Yeşil Bina Sertifikaları ve Sürdürülebilir Yapı Malzemeleri Rehberi", "d": "İnşaatta sürdürülebilir malzeme seçimi ve yeşil bina sertifikaları hakkında kapsamlı rehber. Enerji verimliliği, karbon ayak izi ve yatırım avantajları.", "body": "## İnşaat Sektöründe Yeşil Dönüşüm Neden Artık Bir Tercih Değil?\n\nKüresel karbon emisyonlarının yaklaşık %40'ı bina sektöründen kaynaklanıyor. Bu oran, inşaat firmalarının çevresel sorumluluğunu doğrudan etkileyen en kritik verilerden biri. Geleneksel yapı malzemeleri olan beton, çelik ve alüminyum üretimi, doğal kaynakları hızla tüketirken ciddi miktarda sera gazı salınımına neden oluyor. Türkiye'de deprem sonrası yeniden yapılanma süreci, konut stokunun yenilenmesi ve kentsel dönüşüm projeleri, sürdürülebilir malzeme kullanımını her zamankinden daha güncel hale getirdi. Yeşil bina uygulamaları artık lüks bir tercih değil; geleceğin inşaat projeleri için zorunluluk.\n\n## Sürdürülebilir Yapı Malzemeleri Nelerdir?\n\nSürdürülebilir malzeme; üretiminden yapıda kullanımına ve geri dönüşümüne kadar yaşam döngüsünün her aşamasında çevreye minimum zarar veren malzemedir. İşte günümüzde öne çıkan başlıca sürdürülebilir malzemeler:\n\n- **Ahşap ve Mühendislik Ürünü Ahşap (CLT, Glulam):** Doğal, yenilenebilir ve karbon tutucu özelliğiyle betona güçlü bir alternatiftir. Fabrikada üretilen panel sistemler, şantiyede montaj kolaylığı sağlar ve inşaat atığını azaltır.\n- **Geri Dönüştürülmüş Beton Agregası:** Yıkım atıklarının kırılıp yeniden beton üretiminde kullanılması, hem doğal agrega talebini azaltır hem de depolama alanlarına giden atık miktarını düşürür.\n- **Harman Tuğlası ve Pişmiş Toprak Ürünler:** Düşük enerjiyle üretilen, doğal ve geri dönüştürülebilir nitelikteki bu malzemeler özellikle cephelerde sıklıkla tercih edilir.\n- **Kenevir Betonu (Hempcrete):** Kenevir bitkisi, kireç ve su karışımından elde edilen bu malzeme oldukça hafif, yalıtım değeri yüksek ve karbon negatif bir yapıya sahiptir.\n- **Metakaolin ve Uçucu Kül Katkılı Çimentolar:** Portland çimentosu yerine endüstriyel yan ürünlerin kullanılması, çimento üretimindeki karbon ayak izini önemli ölçüde azaltır.\n- **Doğal Yalıtım Malzemeleri:** Koyun yünü, selüloz, mantar ve ahşap lifi gibi malzemeler; kimyasal bazlı EPS/XPS köpüklerine çevreci alternatifler sunar.\n\nBu malzemelerin ortak özelliği; düşük gömülü enerji, yüksek geri dönüştürülebilirl", "img": "img/blog/i17.jpg", "imgAlt": "Victoria BC Marriott Green Roof", "imgCredit": "pnwra · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/17573364@N00"},
  {"date": "8 Haziran 2026", "cat": "Deprem Güvenliği", "t": "Zemin Etüdü Raporu Nasıl Okunur? Kritik Rehber", "d": "Zemin etüdü raporundaki sondaj logları, SPT değerleri, su seviyesi ve zemin sınıfını nasıl yorumlayacağınızı adım adım öğrenin.", "body": "## Zemin Etüdü Raporu Neden Bu Kadar Kritik?\n\nBir arsa satın alırken ya da yeni bir proje planlarken gözden geçirmeniz gereken en önemli belge, zemin etüdü raporudur (jeolojik-jeoteknik etüt). Bu rapor, binanızın ayakta kalacağı zeminin fiziksel ve mekanik özelliklerini ortaya koyar. Özellikle ülkemizin deprem kuşağında yer aldığını düşünürsek, bu raporu doğru okumak; hem yatırımınızın güvenliği hem de hayati risklerin yönetimi açısından belirleyicidir. Bir arsanın üzerindeki görsel güzellik veya konum avantajı, zemin zayıfsa hiçbir anlam ifade etmez. Bu nedenle \"zemin etüdü raporu nasıl okunur?\" sorusunun cevabını bilmek, sıradan bir teknik detay değil; bilinçli bir yatırımcı olmanın ilk şartıdır.\n\n## Raporun Temel Yapısı: Hangi Bölümler Size Ne Anlatır?\n\nBir zemin etüdü raporu tipik olarak beş ana bölümden oluşur. Bunlar; idari bilgiler, arazi çalışmaları (sondaj logları), laboratuvar deneyleri, jeolojik değerlendirme ve sonuç ile önerilerdir. Raporda ilk dikkat etmeniz gereken şey, raporun tarihi ve güncelliğidir. 10 yıl önce yapılmış bir etüt, bölgedeki jeolojik değişimleri veya güncel deprem yönetmeliğini yansıtmaz. Ardından sondaj sayısı ve derinliği gelir. Çok katlı", "img": "img/blog/i18.jpg", "imgAlt": "Kaukauna Site Investigation, Fox River, WI", "imgCredit": "usacechicago · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/53513245@N03"},
  {"date": "26 Mayıs 2026", "cat": "Yapı Denetimi", "t": "Ev Alırken Yapı Denetim Dosyasında Nelere Bakılır?", "d": "Ev alırken yapı denetim dosyası nasıl incelenir? Deprem güvenliği, beton raporu, iskan belgesi ve denetim sürecinde dikkat edilmesi gereken kritik noktalar.", "body": "## Yapı Denetim Dosyası Nedir ve Neden Önemlidir?\n\nTürkiye gibi deprem kuşağında yer alan bir ülkede konut satın alırken en kritik süreçlerden biri, binanın yapı denetim sürecinden eksiksiz ve doğru bir şekilde geçmiş olmasıdır. 2001 yılında yürürlüğe giren 4708 sayılı Yapı Denetimi Hakkında Kanun ile birlikte, belirli bölgelerdeki yapıların inşaat süreci boyunca bağımsız denetim firmaları tarafından izlenmesi zorunlu hale gelmiştir. İşte bu sürecin tüm belgeleri, raporları ve resmi yazışmaları \"yapı denetim dosyası\" içerisinde saklanır.\n\nBir gayrimenkul yatırımı yapmadan önce bu dosyanın içeriğini bilmek, binanın iskeletinin, taşıyıcı sisteminin ve kullanılan malzemelerin gerçek anlamda projeye uygun olup olmadığını ortaya koyar. Üstelik noter onaylı satış sözleşmesi ve tapu devri imzalanmadan önce bu dosyadaki eksiklikler tespit edilirse, ciddi maddi kayıpların önüne geçilebilir.\n\n## Yapı Denetim Dosyasında Bulunması Gereken Temel Belgeler\n\nYapı denetim dosyası tek bir evraktan ibaret değildir. İnşaatın başlangıcından kullanım izninin alınmasına kadar geçen sürede üretilen onlarca belge bu dosyada birleşir. Satın alma kararı vermeden önce dosyada şu kilit belgelerin eksiksiz olduğundan emin olmalısınız:\n\n- **Yapı Denetim Sözleşmesi:** Arsa sahibi ile denetim firması arasında yapılan ve tarafların yükümlülüklerini tanımlayan resmi sözleşmedir.\n- **Proje Onay Belgeleri:** Mimari, statik, elektrik ve mekanik projelerin ilgili belediyelerce onaylandığını gösteren belgelerdir.\n- **Zemin Etüdü ve Zemin Raporu:** Binanın oturacağı zeminin taşıma kapasitesini ve depremsellik durumunu gösteren jeolojik ve jeoteknik raporlardır.\n- **Yapı Ruhsatı (İnşaat İzni):** Belediye ya da il özel idaresi tarafından verilen yasal inşaat başlangıç iznidir.\n- **Beton ve Donatı Test Raporları:** İnşaat sırasında alınan beton numunelerinin şantiye laboratuvarında ya da akredite laboratuvarlarda yapılan basınç dayanımı testlerini gösteren raporlardır.\n- **Yapı Denetim Raporları:** Denetim elemanlarının saha kontrolleri sonrasında hazırladıkları ha", "img": "img/blog/i19.jpg", "imgAlt": "100419-F-8594F-418", "imgCredit": "expertinfantry · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/58297778@N04"},
  {"date": "17 Mayıs 2026", "cat": "Kentsel Dönüşüm", "t": "Kentsel Dönüşümde Finansman: Hak Sahibinin Seçenekleri", "d": "Kentsel dönüşüm sürecinde hak sahiplerinin finansman seçeneklerini; kredi imkânları, kira yardımı ve taşınma desteklerinden kat karşılığı anlaşmalara kadar detaylıca inceliyoruz.", "body": "Türkiye'de kentsel dönüşüm, deprem riski taşıyan yapı stokunun yenilenmesi açısından hayati bir süreçtir. Ancak binanız yenileneceği zaman en çok merak edilen konu, bu dönüşümün nasıl finanse edileceğidir. \"Bina yıkılacak, yenisini kim ödeyecek?\" sorusu, birçok hak sahibinin kafasını kurcalar. Bu yazıda, kentsel dönüşümde hak sahiplerinin önünde duran güncel finansman seçeneklerini, devlet desteklerini ve banka kredilerini sade bir dille ele alıyoruz.\n\n## Kentsel Dönüşüm Finansmanı Nedir?\n\nKentsel dönüşüm finansmanı, riskli yapıların yenilenmesi sürecinde ortaya çıkan inşaat maliyetlerinin karşılanması için kullanılan kaynakların bütününü ifade eder. Bu kaynaklar; devlet teşvikleri, banka kredileri, müteahhit firmaların sunduğu kat karşılığı anlaşmalar ve hak sahiplerinin öz kaynakları olarak sıralanabilir. Deprem gerçeği, bu finansman mekanizmalarının doğru anlaşılmasını her zamankinden daha önemli hale getirmektedir. Hak sahipleri, sürecin başında bilinçli bir finansal planlama yaparsa hem maddi yükünü hafifletir hem de yeni binaya sorunsuz geçiş sağlar.\n\n## Hak Sahibinin Finansman Seçenekleri Nelerdir?\n\nKentsel dönüşümde hak sahibinin rolü, sadece binayı boşaltmakla sınırlı değildir. Yeni projeye onay vermek ve maliyetin bir kısmına katlanmak da gerekebilir. İşte hak sahiplerinin kullanabileceği başlıca finansman yöntemleri:\n\n### 1. Devlet Destek", "img": "img/blog/i20.jpg", "imgAlt": "The Willard Hotel", "imgCredit": "dbking · Openverse · Openverse", "imgCreditUrl": "https://www.flickr.com/photos/65193799@N00"}
];
let LEADS=[];
// ===== PERSISTENCE (production-grade) =====
const STORE_KEY='meridyen_site_v1';
function saveAll(){
  try{
    const data={PROJECTS,SERVICES,LEADS,ARSALAR,CONTRACTS,ILANLAR,OZEL,SETTINGS,BRAND,MENU,FOOT,ADS,I18N,SOCIAL,FAQ:FAQ_DATA,CONTENT:window.CONTENT||{},THEME:window.__theme||0,savedAt:Date.now()};
    localStorage.setItem(STORE_KEY,JSON.stringify(data));
    publishConfig();
    flashSaved();
  }catch(e){console.warn('save failed',e);}
}
function loadAll(){
  try{
    const raw=localStorage.getItem(STORE_KEY);
    if(!raw)return false;
    const d=JSON.parse(raw);
    if(d.PROJECTS&&Array.isArray(d.PROJECTS))PROJECTS.splice(0,PROJECTS.length,...d.PROJECTS);
    if(d.SERVICES&&Array.isArray(d.SERVICES))SERVICES.splice(0,SERVICES.length,...d.SERVICES);
    if(d.LEADS&&Array.isArray(d.LEADS))LEADS.splice(0,LEADS.length,...d.LEADS);
    if(d.ARSALAR&&Array.isArray(d.ARSALAR))ARSALAR.splice(0,ARSALAR.length,...d.ARSALAR);
    if(d.CONTRACTS&&Array.isArray(d.CONTRACTS))CONTRACTS.splice(0,CONTRACTS.length,...d.CONTRACTS);
    if(d.ILANLAR&&Array.isArray(d.ILANLAR))ILANLAR.splice(0,ILANLAR.length,...d.ILANLAR);
    if(d.OZEL&&Array.isArray(d.OZEL))OZEL.splice(0,OZEL.length,...d.OZEL);
    if(d.SETTINGS)Object.assign(SETTINGS,d.SETTINGS);
    /* P0: istemci-taraf admin parolası kaldırıldı — auth same-origin /api/auth/admin/login */
    if(d.BRAND)Object.assign(BRAND,d.BRAND);
    if(d.MENU)Object.assign(MENU,d.MENU);
    if(d.FOOT)Object.assign(FOOT,d.FOOT);
    if(d.ADS)Object.assign(ADS,d.ADS);
    if(d.SOCIAL)Object.assign(SOCIAL,d.SOCIAL);
    if(d.FAQ&&Array.isArray(d.FAQ)&&d.FAQ.length)FAQ_DATA=d.FAQ.map(function(o){return {c:o.c,q:o.q,a:o.a};});
    if(d.I18N){if(d.I18N.tr)I18N.tr=d.I18N.tr;if(d.I18N.en)I18N.en=d.I18N.en;}
    if(d.CONTENT)window.CONTENT=d.CONTENT;
    if(typeof d.THEME==='number')window.__pendingTheme=d.THEME;
    return true;
  }catch(e){console.warn('load failed',e);return false;}
}
function flashSaved(){
  let el=document.getElementById('saveToast');
  if(!el){el=document.createElement('div');el.id='saveToast';el.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);background:#1a7f4a;color:#fff;padding:10px 20px;border-radius:999px;font:600 .8125rem Inter,sans-serif;z-index:99999;opacity:0;transition:opacity .3s;pointer-events:none;box-shadow:0 8px 24px rgba(0,0,0,.3)';document.body.appendChild(el);}
  el.textContent='✓ Değişiklikler kaydedildi';
  el.style.opacity='1';clearTimeout(window.__toastT);
  window.__toastT=setTimeout(()=>el.style.opacity='0',1800);
}
function exportData(){
  const data={PROJECTS,SERVICES,LEADS,CONTENT:window.CONTENT||{},exportedAt:new Date().toISOString()};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);const a=document.createElement('a');
  a.href=url;a.download='meridyen-site-yedek-'+new Date().toISOString().slice(0,10)+'.json';
  a.click();URL.revokeObjectURL(url);
}
function importData(input){
  const file=input.files[0];if(!file)return;
  const r=new FileReader();
  r.onload=()=>{try{
    const d=JSON.parse(r.result);
    if(d.PROJECTS)PROJECTS.splice(0,PROJECTS.length,...d.PROJECTS);
    if(d.SERVICES)SERVICES.splice(0,SERVICES.length,...d.SERVICES);
    if(d.LEADS)LEADS.splice(0,LEADS.length,...d.LEADS);
    if(d.CONTENT)window.CONTENT=d.CONTENT;
    renderProjects();renderServices();admPjList();admSvcList();renderKpi();saveAll();
    alert('Yedek başarıyla yüklendi.');
  }catch(e){alert('Geçersiz yedek dosyası.');}};
  r.readAsText(file);
}
// ===== ARSA & BAĞIMSIZ BÖLÜM YÖNETİMİ (çekirdek inşaat modülü) =====
let ARSALAR=[
  {id:'ar1',ad:'Levent Kat Karşılığı Fizibilite',adres:'Levent Mah., Beşiktaş/İstanbul',m2:1500,
   imar:{emsal:2.07,taks:0.40,katAdedi:6,gabari:'18.50 m',ada:'1234',parsel:'56'},
   kk:{arsaSahibiPay:45,muteahhitPay:55,sahip:'Ahmet Yılmaz',ortalamaDaireM2:120,daireSatisM2Fiyat:75000,insaatM2Maliyet:18000,not:''}},
];
let CONTRACTS=[
  {id:'c1',tip:'kat-karsiligi',baslik:'Levent Karma Proje – Kat Karşılığı',karsiTaraf:'Ahmet Yılmaz',karsiKimlik:'***********',karsiAdres:'Levent Mah. No:5, İstanbul',
   il:'İstanbul',ilce:'Beşiktaş',mahalle:'Levent',ada:'1234',parsel:'56',arsaM2:500,payArsa:45,payMuteahhit:55,sureAy:18,gecikmeTL:'25.000',tarih:'2025-03-12',durum:'aktif',
   ozelMetin:''},
  {id:'c2',tip:'insaat',baslik:'Bosphorus Loft – Anahtar Teslim',karsiTaraf:'Boğaz Gayrimenkul A.Ş.',karsiKimlik:'***********',karsiAdres:'Beşiktaş, İstanbul',
   il:'İstanbul',ilce:'Beşiktaş',mahalle:'Bebek',ada:'220',parsel:'14',arsaM2:1200,payArsa:0,payMuteahhit:0,sureAy:24,gecikmeTL:'80.000',tarih:'2025-06-01',durum:'aktif',ozelMetin:''},
];
// ===== İLANLAR (satılık/kiralık bağımsız ilan · EİDS üzerinden yayın) =====
// Firma kendi projelerindeki daireleri / portföyündeki taşınmazları bağımsız ilan olarak yayınlar.
// EİDS: her ilan Ticaret Bakanlığı Elektronik İlan Doğrulama Sistemi'nden doğrulanır (shared/eids.js).
// Boot'ta insEidsMigrate her ilana 'beklemede' EİDS kaydı basar; doğrulama gerçek backend üzerinden yapılır.
let ILANLAR=[
  {id:'il1',title:'Bosphorus Loft · 3+1 Bahçe Dubleks',op:'Satılık',type:'Daire',status:'aktif',
   il:'İstanbul',ilce:'Beşiktaş',mah:'Bebek',m2:168,oda:'3+1',kat:'Bahçe Dubleks',price:24500000,feat:1,
   desc:'Meridyen Yapı imzalı Bosphorus Loft projesinde, boğaz cephesine yakın, otoparklı ve akıllı ev altyapılı bahçe dubleks.',img:'p_lux',eids:null,
   energy:'A',tour360Url:'../shared/vendor/sample-360.jpg',floorplanUrl:'../shared/vendor/sample-floorplan.svg'},
  {id:'il2',title:'Levent Rezidans · 2+1 Yüksek Kat',op:'Satılık',type:'Daire',status:'aktif',
   il:'İstanbul',ilce:'Beşiktaş',mah:'Levent',m2:112,oda:'2+1',kat:'14. Kat',price:14750000,feat:0,
   desc:'Metro M2’ye yürüme mesafesi, site içi sosyal donatı, ısı yalıtımlı, TBDY 2018 uyumlu yapı.',img:'p_res',eids:null},
  {id:'il3',title:'Ataşehir Ofis · Kiralık İş Yeri',op:'Kiralık',type:'Ofis / İş Yeri',status:'aktif',
   il:'İstanbul',ilce:'Ataşehir',mah:'Barbaros',m2:220,oda:'-',kat:'6. Kat',price:145000,feat:0,
   desc:'Finans merkezine yakın, açık ofis düzenine uygun, jeneratörlü ve otoparklı A-sınıfı iş yeri.',img:'p_office',eids:null},
  {id:'il4',title:'Zekeriyaköy Müstakil Villa · 5+2',op:'Satılık',type:'Villa',status:'aktif',
   il:'İstanbul',ilce:'Sarıyer',mah:'Zekeriyaköy',m2:420,oda:'5+2',kat:'3 Katlı',price:58000000,feat:1,
   desc:'Doğayla iç içe, özel havuzlu, geniş bahçeli, yerden ısıtmalı müstakil villa. Site içi güvenlikli yaşam.',img:'p_villa',eids:null},
  {id:'il5',title:'Kağıthane Karma Proje · Dükkan',op:'Satılık',type:'Dükkan / Mağaza',status:'aktif',
   il:'İstanbul',ilce:'Kağıthane',mah:'Merkez',m2:95,oda:'Vitrinli',kat:'Zemin',price:11200000,feat:0,
   desc:'Yoğun yaya trafiğine sahip cadde üstü, geniş vitrinli, depolu perakende dükkanı. Marka mağazacılığa uygun.',img:'p_home',eids:null},
  {id:'il6',title:'Başakşehir Kentsel Dönüşüm · 3+1',op:'Satılık',type:'Daire',status:'aktif',
   il:'İstanbul',ilce:'Başakşehir',mah:'Kayaşehir',m2:135,oda:'3+1',kat:'8. Kat',price:9850000,feat:0,
   desc:'Kentsel dönüşümle yenilenen, deprem yönetmeliğine tam uyumlu, aidatı düşük, sosyal donatılı yeni nesil konut.',img:'p_res',eids:null},
  {id:'il7',title:'Büyükçekmece Deniz Manzaralı Arsa',op:'Satılık',type:'Arsa',status:'aktif',
   il:'İstanbul',ilce:'Büyükçekmece',mah:'Sahil',m2:640,oda:'Konut İmarı',kat:'-',price:18500000,feat:0,
   desc:'Deniz manzaralı, konut imarlı, altyapısı hazır, yola cepheli yatırımlık arsa. Değer artış potansiyeli yüksek.',img:'p_lux',eids:null},
  {id:'il8',title:'Kadıköy Anahtar Teslim · 4+1 Dubleks',op:'Satılık',type:'Daire',status:'aktif',
   il:'İstanbul',ilce:'Kadıköy',mah:'Caddebostan',m2:230,oda:'4+1',kat:'Çatı Dubleks',price:36000000,feat:1,
   desc:'Bağdat Caddesi’ne yakın, anahtar teslim, teraslı çatı dubleks. Nitelikli malzeme ve mühendislik güvencesi.',img:'p_home',eids:null}
];
// ===== ÖZEL PORTFÖY (ProX destekli üretim · EİDS HARİÇ) =====
// Off-market / kapalı portföy: ProX bölge verisinden ÜRETİLEN pazar kayıtları. Kamuya açık EİDS ilanı DEĞİLDİR;
// bu yüzden EİDS kapsamı dışındadır. Fiyatlar ProX endeks/analiz tahminidir, kesin ilan fiyatı değildir.
let OZEL=[
  {id:'oz1',op:'Satılık',tip:'Daire',il:'İstanbul',ilce:'Beşiktaş',mah:'Levent',cadde:'Çarşı Cad. civarı',m2:135,oda:'3+1',fiyat:20800000,ort:23500000,durum:'aktif',not:'ProX Levent bölge tahmini · bölge ort. 23.500.000 ₺ · kapalı portföy',_gen:true},
  {id:'oz2',op:'Satılık',tip:'Arsa',il:'İstanbul',ilce:'Çekmeköy',mah:'Merkez',cadde:'İmarlı parsel bölgesi',m2:640,oda:'-',fiyat:9600000,ort:11200000,durum:'aktif',not:'ProX Çekmeköy arsa tahmini · imar emsal ~2.0 · kapalı portföy',_gen:true}
];
let SETTINGS={
  // EİDS (Elektronik İlan Doğrulama Sistemi) — Ticaret Bakanlığı. Kurumsal ilan için Taşınmaz Ticareti Yetki Belgesi No.
  // Doğrulama gerçek backend (ProX/emlakekspertizi) üzerinden yapılır; canlı gelene kadar ilanlar "beklemede" kalır.
  eidsYetkiBelgeNo:'', eidsUnvan:'Meridyen Yapı İnşaat A.Ş.',
  googleMapsKey:'', googleAnalytics:'', googleSiteVerif:'', recaptchaKey:'',
  waNumber:'905001234567', metaTitle:'Meridyen Yapı – Kurumsal İnşaat', metaDesc:'40 yıllık güven, anahtar teslim mühendislik.',
  firmaUnvan:'Meridyen Yapı İnşaat A.Ş.', firmaVergiNo:'0000000000', firmaMersis:'0000000000000000',
  firmaAdres:'Levent Mah. Yapı Cad. No:1, Beşiktaş / İstanbul', firmaTel:'+90 212 000 00 00',
  firmaEmail:'info@meridyenyapi.com', firmaYetkili:'Genel Müdür',
  firmaVergiDairesi:'Beşiktaş Vergi Dairesi', firmaTicaretSicil:'İstanbul · 123456-5', firmaOda:'İstanbul Ticaret Odası',
  firmaKep:'meridyenyapi@hs01.kep.tr', firmaCalisma:'Hafta içi 09:00–18:00 · Cmt 10:00–14:00',
  mapQuery:'41.0812,29.0094', // Levent/Beşiktaş — JSON-LD geo ile aynı; admin haritadan tıklayarak değiştirir
  statYil:38, statKonut:8400, statProje:146, statSantiye:12, statAlan:2100000,
  certChips:['TBDY 2018','Yapı Denetimli · 4708','6306 Kentsel Dönüşüm','ISO 9001 · 14001 · 45001','BIM Koordinasyon']
};
// ===== MARKA / LOGO / YAYIN (kod yazmadan admin) =====
let BRAND={ logo:'', logoFooter:'', favicon:'', name:'Meridyen', name2:' Yapı' };
let MENU={ hizmetler:'Hizmetlerimiz', nedenBiz:'Neden ? Biz', projeler:'Projeler', ilanlar:'İlanlar', bolge:'Bölge Zekası', giris:'Giriş', teklif:'Ücretsiz Keşif' };
let FOOT={ desc:"1986'dan bu yana güvenle inşa eden kurumsal yapı, tadilat ve gayrimenkul geliştirme şirketi.", colKurumsal:'Kurumsal', colHizmetler:'Hizmetler', colIletisim:'İletişim', adres:'Levent Mah. Yapı Cad. No:1<br>Beşiktaş / İstanbul', tel:'+90 212 000 00 00', email:'info@meridyenyapi.com', copyright:'© 2026 Meridyen Yapı A.Ş. · Tüm hakları saklıdır.' };
let ADS={ head:'', body:'' };
let SOCIAL={ facebook:'https://facebook.com/meridyenyapi', instagram:'https://instagram.com/meridyenyapi', x:'https://x.com/meridyenyapi', linkedin:'https://www.linkedin.com/company/meridyenyapi', youtube:'https://www.youtube.com/@meridyenyapi', nsosyal:'https://nsosyal.com', sahibinden:'https://www.sahibinden.com', hepsiemlak:'https://www.hepsiemlak.com', emlakjet:'https://www.emlakjet.com' };
var FAQ_DEFAULT=[{"c": "ruhsat", "q": "İmar durumu belgesi nedir ve nasıl alınır?", "a": "İmar durumu belgesi, bir parselin imar planındaki durumunu; yapılaşma koşullarını, TAKS/KAKS oranlarını, kat adedini, çekme mesafelerini ve yol-yeşil alan gibi kısıtları gösteren resmî belgedir. İlgili belediyenin imar müdürlüğüne tapu ve aplikasyon krokisiyle başvurulur; genelde <b>7-15 iş günü<\/b> içinde düzenlenir. Süreç mimari projenin ilk adımıdır. Meridyen Yapı ücretsiz keşifte imar durumunuzu birlikte çözümler."}, {"c": "ruhsat", "q": "Yapı ruhsatı almak için hangi belgeler gerekli?", "a": "Yapı ruhsatı için genellikle şunlar istenir:<br><ul><li>Tapu ve imar durumu belgesi<\/li><li>Aplikasyon ve kot krokisi<\/li><li>Onaylı mimari, statik, mekanik ve elektrik projeleri<\/li><li>Zemin etüt (jeolojik-jeoteknik) raporu<\/li><li>Yapı denetim sözleşmesi ve TUS taahhütnameleri<\/li><li>Vergi/SGK ilişik belgeleri<\/li><\/ul>Belediyeler ek evrak isteyebilir. Eksiksiz dosyayla onay süreci belirgin şekilde kısalır."}, {"c": "ruhsat", "q": "Yapı ruhsatı başvurusu nasıl yapılır?", "a": "Başvuru, mülk sahibi adına yetkili müellif (mimar/mühendis) tarafından belediye imar müdürlüğüne yapılır. Önce imar durumu alınır, ardından mimari proje çizilip statik-mekanik-elektrik projeleri ve zemin etüdü tamamlanır. Yapı denetim firmasıyla sözleşme imzalanır, harçlar yatırılır ve dosya kurula sunulur. Belediye inceleme sonrası ruhsatı düzenler; toplam süre çoğu ilde <b>1-3 ay<\/b> arasındadır."}, {"c": "ruhsat", "q": "Mimari, statik, mekanik ve elektrik projelerinin onayı zorunlu mu?", "a": "Evet, zorunludur. 3194 sayılı İmar Kanunu ve ilgili yönetmelikler gereği ruhsat için <b>dört ana proje<\/b> şarttır: mimari, statik (betonarme), mekanik (tesisat) ve elektrik. Her proje yetkili odaya kayıtlı müellifçe hazırlanıp imzalanır ve belediyece onaylanır. Projeler birbirine uyumlu olmalıdır; statik proje mutlaka zemin etüt raporuna dayandırılır. Onaysız projeyle ruhsat düzenlenemez."}, {"c": "ruhsat", "q": "Yapı ruhsatı harçları ne kadar tutar?", "a": "Ruhsat harçları sabit bir tutar değildir; <b>inşaat alanına (m²), yapı sınıfına ve belediyenin belirlediği birim değerlere<\/b> göre hesaplanır. Kalemler arasında ruhsat harcı, plan-proje tasdik ücreti, otopark ve altyapı katılım payları bulunur. Toplam maliyet çoğu projede yapı yaklaşık maliyetinin <b>%1-4<\/b>u bandındadır. Rakamlar her yıl ve her belediyede değişebilir; net bütçe için belediyeden güncel tarife alınmalıdır."}, {"c": "ruhsat", "q": "Yapı ruhsatının süresi kaç yıl ve nasıl yenilenir?", "a": "İmar Kanunu m.29 uyarınca ruhsat tarihinden itibaren <b>2 yıl<\/b> içinde inşaata başlanmalı ve <b>5 yıl<\/b> içinde bitirilmelidir. Süre içinde başlanmayan veya bitmeyen ruhsat hükümsüz sayılır. Bu durumda ruhsat yenilenir; başlanmış yapıda kalan kısım için, başlanmamışsa yeni harçlarla yeniden ruhsat alınır. Süre takibi kritiktir; hak kaybı yaşamamak için tarihleri baştan planlamak gerekir."}, {"c": "ruhsat", "q": "Yapı kullanma izni (iskan) nedir ve neden gereklidir?", "a": "İskan, tamamlanan yapının ruhsat ve projesine uygun bittiğini belgeleyen resmî izindir. İskansız yapıda <b>abonelikler (elektrik-su-doğalgaz) kalıcı bağlanamaz<\/b>, kat mülkiyeti kurulamaz ve satışta değer düşer. Başvuruda yapı denetim uygunluk raporu, SGK-vergi ilişiksizlik belgeleri ve as-built projeler istenir. Belediye ve itfaiye kontrolü sonrası düzenlenir; süreç genelde <b>15-45 gün<\/b> sürer."}, {"c": "ruhsat", "q": "Ruhsatsız kaçak yapının cezası nedir?", "a": "Ruhsatsız veya ruhsata aykırı yapı tespit edilirse belediye önce yapıyı mühürleyip durdurur (İmar Kanunu m.32). Aykırılık giderilmezse yıkım kararı alınır. Ayrıca m.42 kapsamında yapının niteliğine göre değişen <b>idari para cezası<\/b> uygulanır; kaçak yapı elektrik-su alamaz, satışı ve tapu işlemleri sorunludur. Kentsel risk açısından da tehlikelidir. Yapıya başlamadan ruhsatı tamamlamak en güvenli yoldur."}, {"c": "ruhsat", "q": "Tadilat ruhsatı hangi durumlarda gerekir?", "a": "Basit boya, badana, döşeme yenileme gibi işler ruhsat gerektirmez. Ancak <b>taşıyıcı sisteme müdahale, kolon-kiriş kesme, mahal değişikliği, cephe-çatı değişimi, bağımsız bölüm birleştirme/bölme<\/b> gibi projeyi etkileyen işlerde tadilat (esaslı tamir) ruhsatı zorunludur. Ruhsatsız taşıyıcı müdahale hem yasal ceza hem ciddi güvenlik riski doğurur. Şüpheli durumda belediyeye danışmak gerekir."}, {"c": "ruhsat", "q": "İmar barışı nedir ve hâlâ başvurulabilir mi?", "a": "İmar barışı, 2018de 7143 sayılı Kanunla getirilen ve kayıtlı kaçak yapılara <b>Yapı Kayıt Belgesi<\/b> verilerek geçici olarak yasallaştıran düzenlemeydi. Başvuru dönemi kapanmıştır; şu an yeni başvuru alınmamaktadır. Alınmış Yapı Kayıt Belgeleri yürürlükte olsa da bu belge iskan yerine geçmez ve yapıyı imara tam uygun hâle getirmez. Yeni bir düzenleme çıkarsa koşulları farklı olabilir."}, {"c": "ruhsat", "q": "Belediye ruhsat onay süreci ne kadar sürer?", "a": "Belediyeye tam ve eksiksiz dosya sunulduğunda İmar Kanunu, incelemenin <b>30 gün<\/b> içinde tamamlanmasını öngörür. Eksik varsa belediye bildirir; tamamlama sonrası 15 gün içinde sonuçlandırılır. Pratikte belediyenin yoğunluğu, projenin karmaşıklığı ve revizyon sayısına göre süre <b>1-3 ay<\/b> arasında değişebilir. Dosyayı deneyimli müellifle hazırlamak gereksiz revizyonları ve gecikmeyi azaltır."}, {"c": "ruhsat", "q": "Ruhsat olmadan inşaata başlamanın riskleri nelerdir?", "a": "Ruhsatsız başlanan inşaat mühürlenip durdurulur; ağır idari para cezası ve yıkım kararıyla karşılaşırsınız. Yapılan imalat ve malzeme boşa gider, yeniden yapım maliyeti doğar. Ayrıca yapı denetim ve sigorta güvencesi olmadığından iş kazası sorumluluğu doğrudan mülk sahibine yansır. Kısa süre kazanma isteği çoğu zaman <b>çok daha büyük mali kayıpla<\/b> sonuçlanır. Önce ruhsat, sonra kazma prensibi esastır."}, {"c": "ruhsat", "q": "Yapı ruhsatı hangi durumlarda iptal edilir?", "a": "Ruhsat; sahte veya hatalı belgeyle alınmışsa, imar planına-mevzuata aykırı düzenlenmişse ya da dayanak imar planı mahkemece iptal edilirse geri alınabilir. Ayrıca yargı, komşu veya kurum itirazıyla dava açılıp iptal kararı verilebilir. İptal hâlinde inşaat durur ve hukuki-mali risk büyür. Bu yüzden ruhsatın <b>plana ve mevzuata tam uygun<\/b> alınması, sonradan telafisi güç sorunları önler."}, {"c": "ruhsat", "q": "Villa yaptırmak için ruhsat süreci nasıl ilerler?", "a": "Villada süreç sırasıyla şöyledir:<br><ul><li>İmar durumu ve zemin etüdü<\/li><li>Mimari tasarım ve statik-mekanik-elektrik projeleri<\/li><li>Yapı denetim sözleşmesi<\/li><li>Harçların yatırılması ve belediye onayı<\/li><li>Ruhsat sonrası temel üstü ruhsatı ve iskan<\/li><\/ul>Müstakil villalarda süreç apartmana göre daha hızlıdır; toplam ruhsat aşaması genelde <b>1-2 ay<\/b> sürer. Erken planlama sezonu kaçırmamak için önemlidir."}, {"c": "ruhsat", "q": "Fabrika ve sanayi yapısı için ruhsat almak apartmandan farklı mı?", "a": "Evet, farklıdır. Fabrikada imar durumunun <b>sanayi/OSB kullanımına<\/b> uygun olması gerekir; ek olarak ÇED görüşü, işyeri açma ruhsatı, itfaiye (yangın) onayı, deşarj-atık ve gerektiğinde çevre izinleri istenir. Statik projede makine yükleri ve kreyn hesapları önem kazanır. Süreç çok kurumlu olduğundan daha uzundur. Meridyen Yapı endüstriyel projelerde tüm izin sürecini tek elden yönetir."}, {"c": "ruhsat", "q": "Yapı denetim firması zorunlu mu ve ne iş yapar?", "a": "4708 sayılı Kanun gereği belirli istisnalar dışında yapı denetimi <b>zorunludur<\/b>. Yapı denetim firması; projelerin mevzuata uygunluğunu, kullanılan malzemenin ve betonun kalitesini, imalatın projeye uygunluğunu saha ve laboratuvar kontrolleriyle denetler. Hakedişleri onaylar, iş bitiminde uygunluk raporu düzenler. Denetim, deprem güvenliği ve iskan için kritik güvencedir; ücreti genelde yapı maliyetinin <b>%1,5-3<\/b>ü bandındadır."}, {"c": "ruhsat", "q": "Temel üstü ruhsatı ne demek ve neden alınır?", "a": "Temel üstü (temel vizesi) ruhsatı, temel ve subasman (zemin kat döşemesi) imalatı projesine uygun tamamlandıktan sonra belediye ve yapı denetimce yerinde kontrol edilip onaylanmasıdır. Bu vize alınmadan üst katların imalatına devam edilmemelidir. Temelin kot, aks ve boyutlarının projeye uygunluğunu teyit ederek sonraki aşamalarda <b>ölçü ve kot hatalarını<\/b> baştan engeller; iskan aşamasında sorun çıkmasını önler."}, {"c": "ruhsat", "q": "Ruhsatta müellif ve fenni mesul kimdir?", "a": "Müellif, projeyi hazırlayan yetkili mimar veya mühendistir; projenin doğruluğundan sorumludur. Fenni mesul (TUS) ise yapıdaki denetim istisnası durumlarında imalatın projeye ve fen kurallarına uygunluğunu sahada denetleyen teknik sorumludur. Yapı denetimli işlerde bu görevi denetim firması üstlenir. Her iki rol de imza ve sorumluluk taşır; bu nedenle <b>oda kaydı ve yetki belgesi<\/b> mutlaka kontrol edilmelidir."}, {"c": "ruhsat", "q": "Kentsel dönüşümde yıkım ve yeni ruhsat süreci nasıl işler?", "a": "6306 sayılı Kanun kapsamında önce riskli yapı tespiti yaptırılır; rapor Çevre ve Şehircilik Müdürlüğünce onaylanır. Malik çoğunluğuyla (genelde <b>salt çoğunluk<\/b>) karar alınıp tahliye ve yıkım gerçekleşir. Ardından yeni proje için standart yapı ruhsatı alınır. Dönüşümde harç-vergi muafiyetleri, kira yardımı ve düşük faizli kredi imkânları bulunur. Bu avantajlar süreci mülk sahibi için oldukça cazip kılar."}, {"c": "ruhsat", "q": "Ruhsat eki projeye aykırı yapılan imalat nasıl düzeltilir?", "a": "Onaylı projeye aykırı imalat tespit edilirse iki yol vardır: aykırılık mevzuata uygunsa <b>tadilat (revize) projesi<\/b> hazırlanıp belediyece onaylanarak durum yasallaştırılır; uygun değilse aykırı kısım yıkılıp projeye döndürülmelidir. Aykırılık giderilmezse iskan alınamaz ve para cezası uygulanır. İmalat sırasında değişiklik gerekirse, işi yapmadan önce revize proje onayı almak en doğru yaklaşımdır."}, {"c": "ruhsat", "q": "Bina yaptırırken ruhsat maliyetini önceden nasıl hesaplarım?", "a": "Ruhsat maliyetini kabaca öngörmek için şu kalemler toplanır:<br><ul><li>Proje müellif ücretleri (mimari+statik+mekanik+elektrik)<\/li><li>Zemin etüt raporu<\/li><li>Yapı denetim bedeli (yaklaşık maliyetin %1,5-3ü)<\/li><li>Belediye ruhsat harçları ve tasdik ücretleri<\/li><li>Otopark ve altyapı katılım payları<\/li><\/ul>Toplam, yapı türü ve belediyeye göre değişir. Sağlıklı bir bütçe için keşif ve belediye tarifesi birlikte değerlendirilmelidir."}, {"c": "arsa", "q": "Arsa alırken hangi kriterlere dikkat edilmeli?", "a": "Arsa seçiminde öncelik hukuki ve teknik güvenliktir. Kontrol edilecekler:<br><ul><li>Tapu türü ve imar durumu (arsa mı, tarla mı)<\/li><li>TAKS/KAKS ve kat adedi<\/li><li>Zemin yapısı ve deprem riski<\/li><li>Altyapı (yol-su-elektrik-kanalizasyon)<\/li><li>Kot, eğim ve cephe<\/li><li>Hisseli/müşterek tapu durumu<\/li><\/ul>Alım öncesi bu kontroller yapılmazsa yatırım riske girer. Meridyen Yapı ücretsiz keşifte arsanızı teknik açıdan değerlendirir."}, {"c": "arsa", "q": "Bir arsanın imar durumu nasıl sorgulanır?", "a": "İmar durumu, arsanın bağlı olduğu belediyenin imar müdürlüğünden veya çoğu belediyenin <b>e-belediye/e-imar<\/b> sistemlerinden ada-parsel numarasıyla sorgulanır. Bu sorgu; parselin konut, ticaret, sanayi gibi kullanımını, yapılaşma oranlarını ve kat adedini gösterir. Ancak internet sorgusu bilgilendirme amaçlıdır; <b>resmî imar durumu belgesi<\/b> yatırım kararı için mutlaka belediyeden alınmalıdır. Emlakçı beyanına güvenmek yerine belgeyi görmek şarttır."}, {"c": "arsa", "q": "TAKS ve KAKS ne demek, inşaat alanı nasıl hesaplanır?", "a": "<b>TAKS<\/b> (Taban Alanı Katsayısı), yapının zeminde kaplayacağı taban alanının parsele oranıdır. <b>KAKS/emsal<\/b> ise toplam inşaat alanının parsele oranıdır. Örneğin 500 m² arsada TAKS 0,30 ise taban 150 m², KAKS 1,50 ise toplam inşaat 750 m² olur; bu da kabaca 5 katlık bir kullanım demektir. Bu oranlar arsanın gerçek yapılaşma potansiyelini ve değerini doğrudan belirler."}, {"c": "arsa", "q": "Emsal hesabı neden arsa değerini belirler?", "a": "Emsal (KAKS), bir arsada yasal olarak yapılabilecek toplam inşaat alanını verdiği için arsanın gerçek getirisini gösterir. İki komşu parsel aynı m²de olsa bile, emsali yüksek olan çok daha fazla satılabilir alan ürettiğinden <b>belirgin şekilde değerlidir<\/b>. Bu yüzden arsa fiyatı yalnızca metrekareyle değil, birim inşaat alanı başına maliyetle değerlendirilmelidir. Emsali bilmeden alınan arsa çoğu zaman pahalıya gelir."}, {"c": "arsa", "q": "Zemin etüdü nedir ve neden önemlidir?", "a": "Zemin etüdü (jeolojik-jeoteknik rapor), arsadaki toprak-kaya yapısını, taşıma gücünü, yeraltı suyunu ve deprem davranışını sondaj ve laboratuvar deneyleriyle belirleyen çalışmadır. Temel tipi ve statik hesaplar bu rapora göre yapılır; ruhsat için zorunludur. Zemini bilinmeden atılan temel <b>oturma, çatlama ve deprem hasarı<\/b> riski taşır. Arsa alım kararında dahi ön etüt yaptırmak, ileride ağır maliyetlerden korur."}, {"c": "arsa", "q": "Arsa alırken zemin etüdüne neden dikkat edilmeli?", "a": "Aynı bölgede iki arsa yan yana olsa bile zemin özellikleri farklı olabilir; birinde sağlam kaya, diğerinde gevşek dolgu ya da yüksek yeraltı suyu çıkabilir. Zayıf zeminde temel maliyeti ciddi biçimde artar, hatta kazık-radye gibi <b>pahalı çözümler<\/b> gerekir. Bu maliyet arsanın toplam fizibilitesini değiştirir. Bu yüzden fiyata karar vermeden önce zemin durumunu öğrenmek, sürprizleri önleyen en akıllı adımdır."}, {"c": "arsa", "q": "Zemin iyileştirme yöntemleri nelerdir?", "a": "Zayıf zeminlerde temel öncesi iyileştirme yapılır. Yaygın yöntemler:<br><ul><li>Zemin değiştirme (kötü zemini kaldırıp dolgu-kompaksiyon)<\/li><li>Jet-grouting (enjeksiyonla zemin güçlendirme)<\/li><li>Fore kazık ve mini kazık<\/li><li>Taş kolon ve derin kompaksiyon<\/li><li>Radye temel ile yükü yayma<\/li><\/ul>Yöntem, zemin etüt raporuna göre seçilir. Doğru iyileştirme deprem güvenliğini artırır; yanlış tercih hem maliyet hem risk doğurur."}, {"c": "arsa", "q": "Arsanın kot ve eğimi neden önemlidir?", "a": "Kot, arsanın yola ve komşu parsellere göre yükseklik farkıdır; eğim ise arazinin meyilidir. Yüksek eğimli arazide <b>istinat duvarı, kazı-dolgu ve drenaj<\/b> maliyetleri artar, kullanılabilir bahçe alanı azalır. Buna karşın doğru planlanan eğim, bodrum katı doğal ışıkla değerlendirmek gibi avantajlar da sunar. Kot durumu ayrıca yapı yüksekliğini ve bina oturumunu etkiler; proje öncesi mutlaka belediyeden kot tutanağı alınır."}, {"c": "arsa", "q": "Altyapısı olmayan arsa almak riskli mi?", "a": "Evet, dikkat edilmelidir. Yol, içme suyu, elektrik ve kanalizasyon bağlantısı olmayan arsada bu altyapıların getirilmesi <b>yüksek ek maliyet ve zaman<\/b> demektir; bazen mümkün bile olmayabilir. Ayrıca altyapısı tamamlanmamış bölgelerde iskan ve abonelik sorunları çıkar. Alım öncesi ilgili belediye ve kurumlardan (su-elektrik idaresi) altyapı durumu sorulmalı, maliyet fizibiliteye eklenmelidir. Ucuz görünen arsa altyapıyla pahalıya gelebilir."}, {"c": "arsa", "q": "İfraz ve tevhid ne demek?", "a": "<b>İfraz<\/b>, tek bir parselin imar mevzuatına uygun olarak birden fazla parsele bölünmesidir. <b>Tevhid<\/b> ise birden çok parselin tek parselde birleştirilmesidir. Her iki işlem de belediye onayı ve tapu tesciliyle yapılır. İfraz-tevhid; daha verimli yapılaşma, hisse çözümü veya emsal kullanımı için başvurulur. İşlemler imar planına uygun olmalıdır; aksi hâlde onaylanmaz. Doğru kurgu arsanın değerini ve kullanılabilirliğini artırır."}, {"c": "arsa", "q": "Hisseli tapu ve arsa payı riskleri nelerdir?", "a": "Hisseli (müşterek) tapuda arsanın tamamı birden çok kişiye aittir; belirli bir bölge fiilen size ait değildir. Riskler:<br><ul><li>Diğer hissedarların onayı olmadan yapı yapamama<\/li><li>Satış ve ipotekte hissedar engeli<\/li><li>Ortaklığın giderilmesi (izale-i şuyu) davasıyla satış riski<\/li><\/ul>Özellikle tarım arazilerinde hisse satışı sınırlıdır. Alım öncesi tapu kaydı ve hissedar durumu titizlikle incelenmelidir; müstakil tapu her zaman daha güvenlidir."}, {"c": "arsa", "q": "Tarla ile arsa arasındaki fark nedir?", "a": "Arsa, belediye imar planı içinde yer alan ve üzerine ruhsatlı yapı yapılabilen parseldir. Tarla ise imar planı dışında, tapuda <b>tarım arazisi<\/b> niteliğindeki taşınmazdır ve kural olarak üzerine konut/işyeri yapılamaz. Tarlaya yapılan yapılar genelde kaçak sayılır. Bir arazinin arsaya dönüşmesi imar planına alınmasıyla mümkündür ama garanti değildir. Tarla fiyatı düşük görünse de yapılaşma hakkı olmadan yatırım değeri sınırlıdır."}, {"c": "arsa", "q": "Tarla arsaya nasıl dönüşür?", "a": "Tarım arazisinin arsaya dönüşmesi, ilgili alanın <b>imar planına alınması<\/b> (planlı alana dahil edilmesi) ve gerekiyorsa tarım dışı kullanım izniyle olur. Süreç; nazım ve uygulama imar planı yapımı, belediye/idare onayı ve tapu niteliğinin güncellenmesini kapsar. Bu, yıllar sürebilen ve idarenin takdirine bağlı bir süreçtir; kesinlik taşımaz. Bu yüzden imara açılacağı vaadiyle satılan tarlalara temkinli yaklaşmak ve resmî plan durumunu doğrulamak gerekir."}, {"c": "arsa", "q": "Arsa değerlemesi nasıl yapılır?", "a": "Arsa değeri; konum, imar durumu, emsal (KAKS), cephe-derinlik, kot-eğim, altyapı ve bölgedeki emsal satışlarla belirlenir. Profesyonel değerlemede <b>emsal karşılaştırma<\/b> ve inşaat alanı başına maliyet analizi kullanılır. Aynı m²de olan iki arsanın değeri, imar hakkına göre büyük fark gösterebilir. Sağlıklı değerleme için resmî imar durumu ve tapu incelemesi şarttır; yalnızca ilan fiyatlarına bakmak yanıltıcıdır."}, {"c": "arsa", "q": "İmar planı değişikliği mümkün mü ve nasıl yapılır?", "a": "Evet mümkündür ama kolay değildir. İmar planı değişikliği; mülk sahibinin talebi veya idarenin kararıyla, kamu yararı ve planlama esaslarına uygun olması koşuluyla belediye meclisince yapılır ve askıya çıkarılır. İtiraz süreci ve üst kurum onayları gerekebilir. Süreç <b>aylarca hatta yıllarca<\/b> sürebilir, sonuç garanti değildir. Emsal artışı vaadiyle yapılan alımlarda bu belirsizlik mutlaka göz önünde bulundurulmalıdır."}, {"c": "arsa", "q": "Villa yapmak için nasıl bir arsa seçmeliyim?", "a": "Villa arsasında öncelik konut imarlı, ayrık nizam parsellerdir. Dikkat edilecekler:<br><ul><li>Düşük TAKS ile geniş bahçe imkânı<\/li><li>Sağlam zemin ve makul eğim<\/li><li>Güneş alan cephe ve manzara<\/li><li>Tamam altyapı ve ulaşım<\/li><li>Müstakil (hissesiz) tapu<\/li><\/ul>Aşırı eğimli veya zayıf zeminli arsalar villada temel maliyetini yükseltir. Doğru arsa, projenin hem konforunu hem değerini belirler. Keşifle bu kriterleri yerinde değerlendirmek en sağlıklısıdır."}, {"c": "arsa", "q": "Fabrika için arsa seçerken nelere dikkat edilir?", "a": "Sanayi yatırımında arsanın <b>sanayi/OSB imarlı<\/b> olması esastır. Ek olarak; ağır araç girişine uygun yol ve lojistik, yeterli elektrik gücü ve su kapasitesi, atık deşarj/altyapı imkânı, sağlam ve düz zemin, gerekli çekme mesafeleri ve genişleme payı değerlendirilir. Çevre mevzuatı ve ÇED kısıtları da baştan sorgulanmalıdır. OSB parselleri altyapı ve teşvik avantajı sunduğundan çoğu üretici için daha güvenli tercihtir."}, {"c": "arsa", "q": "Arsa cephesi ve derinliği neden önemli?", "a": "Cephe, arsanın yola bakan kenar uzunluğu; derinlik ise yoldan içeri boyudur. İmar mevzuatı ayrık/bitişik nizamda <b>minimum cephe ve alan<\/b> koşulları arar; yetmezse parsel yapılaşamaz veya tevhid gerekir. Çok dar ya da aşırı derin parseller verimli plan çözümünü zorlaştırır, kullanılamayan alan doğurur. Bu yüzden metrekare kadar arsanın geometrisi de kritiktir. Alım öncesi cephe-derinlik oranı imar koşullarıyla birlikte kontrol edilmelidir."}, {"c": "arsa", "q": "Arsa üzerinde irtifak, ipotek veya şerh var mı nasıl anlarım?", "a": "Bunlar tapu kütüğünde görünür. Alım öncesi Tapu Müdürlüğünden veya e-Devlet üzerinden <b>tapu kaydı ve takyidat (kısıtlama) belgesi<\/b> alınmalıdır. Burada ipotek, haciz, geçit-enerji irtifakı, kamulaştırma veya satış şerhleri yer alır. Üzerinde geçit hakkı veya enerji hattı irtifakı olan arsada yapılaşma kısıtlanabilir. Ödemeden önce takyidatı görmek, sonradan çıkacak sürprizleri ve hak kayıplarını önlemenin en kesin yoludur."}, {"c": "arsa", "q": "Kaç metrekare arsaya bina yapabilirim, minimum parsel şartı var mı?", "a": "Evet, imar planları genellikle <b>minimum ifraz/parsel büyüklüğü ve minimum cephe<\/b> koşulu belirler. Bu şartların altındaki parseller tek başına yapılaşamaz; yandaki parselle tevhid gerekebilir. Yapabileceğiniz inşaat alanı ise arsa m²si ile TAKS ve KAKS çarpımına bağlıdır. Örneğin küçük ama emsali yüksek bir parselde ciddi inşaat hakkı olabilir. Net cevap için parselin imar durumu belgesi mutlaka incelenmelidir."}, {"c": "maliyet", "q": "Villa yaptırmak 2026 yılında metrekaresi ne kadar?", "a": "2026 için villa inşaat maliyeti anahtar teslim yaklaşık <b>28.000 - 55.000 TL/m2<\/b> aralığındadır; bu rakam arsa hariçtir. Kaba yapı payı m2 başına 12.000 - 20.000 TL, ince işler ise 16.000 - 35.000 TL civarındadır. Havuz, akıllı ev, doğal taş kaplama ve peyzaj bu tutarı ciddi biçimde yükseltir.<br>Bölge, kat sayısı ve malzeme kalitesi belirleyicidir. <b>Meridyen Yapı ücretsiz keşifte kalem kalem maliyet çıkarır.<\/b>"}, {"c": "maliyet", "q": "Kaba yapı ile ince yapı maliyeti arasındaki fark nedir?", "a": "<b>Kaba yapı<\/b> binanın iskeletidir: hafriyat, temel, kolon-kiriş, döşeme, tuğla duvar ve çatı. Toplam maliyetin genellikle <b>%40-45<\/b>'ini oluşturur.<br><b>İnce yapı<\/b> ise yaşanabilir hale getiren işlerdir: sıva, şap, alçı, boya, seramik, kapı-pencere, mutfak, mekanik ve elektrik tesisatı. Bu kalem toplam bütçenin <b>%55-60<\/b>'ına ulaşır çünkü malzeme ve işçilik çeşitliliği yüksektir. İnce işlerdeki kalite tercihi maliyeti en çok oynatan faktördür."}, {"c": "maliyet", "q": "Daire inşaat maliyeti m2 başına 2026'da kaç TL?", "a": "2026'da apartman dairesi kaba+ince anahtar teslim inşaat maliyeti standart kalitede yaklaşık <b>18.000 - 32.000 TL/m2<\/b> arasındadır. Ortak alanlar, asansör, otopark ve peyzaj bu maliyete bina genelinde eklenir.<br>Villaya göre daire m2 maliyeti daha düşüktür çünkü ortak taşıyıcı sistem ve çatı birden fazla bağımsız bölüme paylaştırılır. Zemin etüdü, kat yüksekliği ve cephe malzemesi rakamı etkiler."}, {"c": "maliyet", "q": "Fabrika ve sanayi yapısı inşaat maliyeti nasıl hesaplanır?", "a": "Fabrika maliyeti genelde <b>çelik konstrüksiyon<\/b> veya prefabrik sisteme göre hesaplanır. 2026 için kapalı alan m2 maliyeti yaklaşık <b>14.000 - 28.000 TL/m2<\/b>'dir; yüksek tavan, vinç yolu ve ağır zemin betonu maliyeti artırır.<br>Hesap şu kalemlerden oluşur: zemin iyileştirme, tekil/radye temel, çelik çatı, sandviç panel cephe, endüstriyel zemin ve altyapı. Yangın, havalandırma ve enerji hattı gereksinimleri bütçeye ayrıca yansır."}, {"c": "maliyet", "q": "İnşaatta keşif ve metraj ne demek, nasıl yapılır?", "a": "<b>Metraj<\/b>, projedeki her imalatın miktarını (m2, m3, ton, adet) hesaplamaktır. <b>Keşif<\/b> ise bu miktarları güncel birim fiyatlarla çarparak toplam bedeli çıkarmaktır.<br>Doğru bir keşif için mimari, statik ve tesisat projeleri gereklidir. Kalemler poz numaralarıyla listelenir:<ul><li>Hafriyat ve temel<\/li><li>Beton ve demir<\/li><li>Duvar, sıva, kaplama<\/li><li>Mekanik ve elektrik<\/li><\/ul>Sağlıklı metraj olmadan verilen fiyat tahmindir, güvenilir değildir."}, {"c": "maliyet", "q": "İnşaat maliyet kalemleri nelerdir?", "a": "Bir yapının ana maliyet kalemleri sırasıyla şunlardır:<ul><li><b>Hafriyat ve zemin<\/b> işleri<\/li><li><b>Temel ve kaba yapı<\/b> (beton, demir, kalıp)<\/li><li><b>İnce yapı<\/b> (sıva, şap, kaplama, boya)<\/li><li><b>Mekanik tesisat<\/b> (su, ısıtma, doğalgaz)<\/li><li><b>Elektrik<\/b> ve zayıf akım<\/li><li><b>Çevre düzenleme<\/b> ve peyzaj<\/li><\/ul>Buna proje-ruhsat harçları, şantiye giderleri ve müteahhit kârı eklenir. Her kalemin bütçe içindeki payı proje tipine göre değişir."}, {"c": "maliyet", "q": "Birim fiyat analizi nedir ve neden önemli?", "a": "<b>Birim fiyat analizi<\/b>, bir imalatın (örneğin 1 m2 seramik döşeme) içindeki malzeme, işçilik, nakliye ve müteahhit kârını tek tek çıkararak birim maliyeti bulmaktır.<br>Bu analiz sayesinde fiyatın nereden geldiği şeffaflaşır; pazarlık ve karşılaştırma sağlıklı yapılır. Çevre ve Şehircilik Bakanlığı her yıl resmi birim fiyatlar yayımlar, ancak piyasa şartları çoğu zaman bunların üzerindedir. Analiz olmadan verilen götürü fiyatta gizli maliyet riski yüksektir."}, {"c": "maliyet", "q": "İnşaatta işçilik ve malzeme oranı yüzde kaçtır?", "a": "Türkiye'de kaba+ince yapıda genel ortalama olarak <b>malzeme %60-65<\/b>, <b>işçilik %35-40<\/b> civarındadır. Ancak bu oran işin cinsine göre değişir:<br><ul><li>Betonarme kaba yapıda malzeme ağırlıklıdır<\/li><li>Alçı, boya, seramik gibi ince işlerde işçilik payı yükselir<\/li><li>Doğal taş ve ahşap işçiliğinde ustalık maliyeti artar<\/li><\/ul>Döviz ve enflasyon malzeme tarafını, asgari ücret ve usta bulunabilirliği işçilik tarafını doğrudan etkiler."}, {"c": "maliyet", "q": "Anahtar teslim inşaat fiyatı neyi kapsar?", "a": "<b>Anahtar teslim<\/b>, yapının oturulabilir şekilde eksiksiz tesliminmi kapsar: kaba yapı, ince işler, mekanik, elektrik, mutfak-banyo, boya ve temizlik dahildir.<br>Genellikle <b>arsa bedeli, proje-ruhsat harçları, abonelik bağlantıları ve mobilya hariçtir<\/b>; sözleşmede net yazılmalıdır. Kapsam belirsizliği en sık anlaşmazlık nedenidir. İyi bir anahtar teslim sözleşmesinde malzeme markaları, metrekare, teslim süresi ve fiyat farkı şartları açıkça tanımlanır."}, {"c": "maliyet", "q": "İnşaat maliyetini artıran faktörler nelerdir?", "a": "Maliyeti yükselten başlıca etkenler:<ul><li><b>Zayıf zemin<\/b> (kazık, iksa, fore kazık gerektirir)<\/li><li>Eğimli veya dar arsa, ulaşım zorluğu<\/li><li>Yüksek kat sayısı ve büyük açıklıklar<\/li><li>Lüks malzeme ve özel mimari detaylar<\/li><li>Döviz kuru ve enflasyon<\/li><li>Deprem yönetmeliği gereği güçlü statik<\/li><\/ul>Ayrıca proje değişiklikleri (revizyon) inşaat sırasında maliyeti hızla büyütür. Bu yüzden karar netliği en büyük tasarruf kaynağıdır."}, {"c": "maliyet", "q": "Enflasyon ve döviz kuru inşaat maliyetini nasıl etkiler?", "a": "Demir, çimento, cam, seramik ve tesisat malzemelerinin çoğu ya ithaldir ya da girdisi dövize bağlıdır. Kur yükseldiğinde bu kalemler haftalar içinde zamlanır. Enflasyon ise işçilik ve nakliyeyi sürekli yukarı çeker.<br>Bu nedenle uzun süren projelerde sabit fiyat riskli olabilir; sözleşmeye <b>fiyat farkı (eskalasyon) formülü<\/b> veya ana malzemenin peşin alım stratejisi konulması korur. Kritik malzemeyi erken tedarik etmek dalgalanmaya karşı en etkili kalkandır."}, {"c": "maliyet", "q": "İnşaat maliyetini düşürmenin yolları nelerdir?", "a": "Kaliteden ödün vermeden tasarruf için:<ul><li>Projeyi baştan net kesinleştirip <b>revizyonu önlemek<\/b><\/li><li>Sade, dikdörtgen ve verimli mimari plan seçmek<\/li><li>Ana malzemeyi toplu ve doğru zamanda almak<\/li><li>Yerli muadil malzemeleri değerlendirmek<\/li><li>Doğru metraj ile fireyi azaltmak<\/li><\/ul>En büyük tasarruf, deneyimli bir ekiple <b>doğru planlamadan<\/b> gelir; ucuz işçilik çoğu zaman ikinci kez ödeme demektir. Meridyen Yapı, bütçeye göre alternatif çözüm senaryoları sunar."}, {"c": "maliyet", "q": "İnşaatta öngörülemeyen maliyetler nelerdir?", "a": "Planda olmayan ama sık çıkan sürpriz giderler:<ul><li>Zemin sürprizleri (su çıkması, kaya, dolgu)<\/li><li>Ruhsat ve proje revizyon harçları<\/li><li>Malzeme zamları ve kur farkı<\/li><li>Komşu/sınır ve iksa gereksinimleri<\/li><li>Hava koşulları kaynaklı gecikme<\/li><\/ul>Bu yüzden bütçeye <b>%10-15 oranında beklenmedik gider payı<\/b> ayrılması önerilir. Sağlam zemin etüdü ve eksiksiz proje, sürprizlerin büyük kısmını baştan önler."}, {"c": "maliyet", "q": "m2 inşaat maliyeti neye göre değişir?", "a": "Metrekare maliyetini belirleyen ana değişkenler:<ul><li><b>Yapı tipi<\/b> (villa, daire, fabrika)<\/li><li>Malzeme ve işçilik kalitesi (standart-lüks)<\/li><li>Zemin durumu ve temel tipi<\/li><li>Kat sayısı, açıklık ve kat yüksekliği<\/li><li>Bölge, iş gücü ve nakliye koşulları<\/li><\/ul>Aynı m2 için iki teklif arasında büyük fark varsa, genellikle kapsam ve kalite farklıdır. Bu yüzden fiyatları değil, <b>şartname ile birlikte<\/b> teklifleri karşılaştırmak gerekir."}, {"c": "maliyet", "q": "Lüks inşaat ile standart inşaat maliyeti arasındaki fark ne kadar?", "a": "Kaba yapı maliyeti lüks ve standart projede birbirine yakındır; fark asıl <b>ince işlerde<\/b> ortaya çıkar. Standart daire 18.000-32.000 TL/m2 iken, lüks villada bu rakam <b>45.000 TL/m2<\/b> ve üzerine çıkabilir.<br>Farkı yaratan kalemler: doğal taş, ısı-cam sistemler, akıllı ev otomasyonu, özel doğrama, tasarım aydınlatma ve peyzaj. Yani m2 fiyatı çoğunlukla iskeletten değil, <b>bitiş kalitesinden<\/b> doğar."}, {"c": "maliyet", "q": "Hafriyat ve temel işleri maliyeti ne kadar tutar?", "a": "Hafriyat ve temel, toplam bütçenin genellikle <b>%8-15<\/b>'ini oluşturur; ancak zemin kötüyse bu pay hızla büyür. Normal zeminde tekil veya radye temel yeterliyken, zayıf zeminde <b>fore kazık, jet grout veya iksa<\/b> gerekir ve maliyet katlanır.<br>Hafriyat bedeli kazı miktarına (m3), nakliye mesafesine ve döküm sahasına göre değişir. Bu yüzden inşaata başlamadan mutlaka <b>zemin etüt raporu<\/b> alınmalı; en kritik ve en çok sürpriz çıkaran aşama burasıdır."}, {"c": "maliyet", "q": "Mekanik ve elektrik tesisat maliyeti bütçenin ne kadarı?", "a": "Tesisat işleri modern yapılarda önemli bir kalemdir. <b>Mekanik<\/b> (temiz-pis su, ısıtma, doğalgaz, klima) toplam maliyetin yaklaşık <b>%10-15<\/b>'i, <b>elektrik ve zayıf akım<\/b> (aydınlatma, priz, veri, güvenlik) ise <b>%8-12<\/b>'si kadardır.<br>Yerden ısıtma, VRF klima, akıllı ev ve güneş enerjisi sistemleri bu oranı yükseltir. Tesisat, sonradan değiştirilmesi en pahalı kalem olduğu için projede baştan doğru boyutlandırılmalıdır."}, {"c": "maliyet", "q": "Kentsel dönüşümde daire başına maliyet nasıl hesaplanır?", "a": "Kentsel dönüşümde maliyet, toplam inşaat bedelinin bağımsız bölüm sayısına ve metrekaresine bölünmesiyle çıkar. 2026'da m2 anahtar teslim maliyet standartta <b>18.000-30.000 TL/m2<\/b> civarındadır.<br>Kat karşılığı modelinde mülk sahibi genelde nakit ödemez; müteahhit inşaatı yapar, karşılığında belirli bağımsız bölümleri alır. Hesabın adil olması için <b>arsa payı, emsal, yeni m2 ve daire sayısı<\/b> net belirlenmelidir. Meridyen Yapı fizibiliteyi şeffaf tabloyla sunar."}, {"c": "maliyet", "q": "Çatı ve cephe işleri inşaat maliyetinin ne kadarını oluşturur?", "a": "Çatı ve cephe, hem estetik hem yalıtım açısından kritik olduğu için toplam bütçenin yaklaşık <b>%10-18<\/b>'ini kapsar. Çatı tipi (kırma, teras, çelik), su yalıtımı ve kaplama malzemesi maliyeti belirler.<br>Cephede ise mantolama, ısı yalıtımı, kompozit panel, doğal taş veya cam giydirme tercihine göre fark çok büyür. Enerji kimlik belgesi zorunluluğu nedeniyle yalıtım artık isteğe bağlı değil, mevzuat gereğidir ve maliyete baştan dahil edilmelidir."}, {"c": "maliyet", "q": "Tadilat maliyeti 2026'da metrekare kaç TL?", "a": "Tadilat maliyeti işin kapsamına göre çok değişkendir. 2026 için:<ul><li><b>Boya-basit yenileme:<\/b> 2.500 - 6.000 TL/m2<\/li><li><b>Orta kapsam<\/b> (zemin, mutfak, banyo yenileme): 8.000 - 18.000 TL/m2<\/li><li><b>Komple tadilat<\/b> (tesisat+duvar dahil): 15.000 - 30.000 TL/m2<\/li><\/ul>Eski tesisatın durumu, taşıyıcıya dokunulup dokunulmayacağı ve malzeme kalitesi tutarı belirler. Tadilat çoğu zaman gizli sürpriz barındırdığı için keşif şart. Meridyen Yapı ücretsiz yerinde keşif yapar."}, {"c": "maliyet", "q": "Müteahhit kârı inşaat maliyetine nasıl yansır?", "a": "Müteahhit kârı, tüm doğrudan maliyetlerin (malzeme+işçilik+şantiye) üzerine eklenen orandır ve genellikle <b>%10-25<\/b> arasında değişir. Anahtar teslim fiyatın içinde gizli olarak yer alır.<br>Kâr oranını işin büyüklüğü, riski, süresi ve firmanın kurumsallığı belirler. Çok düşük kârla çalışacağını söyleyen firma çoğu zaman malzeme veya işçilikten kısar. Şeffaf bir teklifte doğrudan maliyet, genel giderler ve kâr <b>ayrı satırlarda<\/b> gösterilir; bu sizi korur."}, {"c": "maliyet", "q": "Bina inşaat maliyeti ile villa maliyeti neden farklıdır?", "a": "Çok katlı binada taşıyıcı sistem, çatı, asansör ve ortak altyapı çok sayıda bağımsız bölüme paylaştırıldığı için <b>m2 maliyeti düşer<\/b>. Villada ise her yapı bağımsız temel, çatı ve tesisata sahiptir; bu da m2 maliyetini yükseltir.<br>Ayrıca villalar genelde daha yüksek bitiş kalitesi, bahçe, havuz ve özel mimari içerir. Bu yüzden aynı kaliteye sahip olsalar bile villa m2 maliyeti, apartman dairesinden <b>%30-60 daha yüksek<\/b> olabilir."}, {"c": "maliyet", "q": "İnşaat sözleşmesinde fiyat farkı (eskalasyon) nedir?", "a": "<b>Fiyat farkı<\/b>, uzun süren işlerde malzeme ve işçilik zamlarını sözleşmeye bağlı bir formülle taraflar arasında paylaştıran mekanizmadır. Demir, çimento gibi ana girdiler endekse bağlanır.<br>Sabit fiyatlı sözleşmede tüm zam riskini müteahhit taşır ve bunu baştan fiyata ekler; eskalasyonlu sözleşmede ise riziko paylaşılır, başlangıç fiyatı daha düşük olur. Hangisinin avantajlı olduğu proje süresine ve piyasa beklentisine bağlıdır. Sözleşmede formül net yazılmalıdır."}, {"c": "maliyet", "q": "Şantiye ve genel giderler maliyete nasıl eklenir?", "a": "Doğrudan imalatın yanında görünmeyen ama gerçek olan giderler vardır:<ul><li>Şantiye şefi, güvenlik, konteyner<\/li><li>Elektrik-su-vinç, iskele, kalıp amortismanı<\/li><li>İş güvenliği (İSG) ve sigorta<\/li><li>Ofis, proje ve ruhsat takip giderleri<\/li><\/ul>Bu <b>genel giderler<\/b> toplam maliyetin genellikle <b>%5-10<\/b>'unu oluşturur ve anahtar teslim fiyatın içine dağıtılır. Düşük teklif veren firmaların çoğu bu kalemi eksik hesapladığı için iş yarıda ödeme sorunuyla tıkanır."}, {"c": "maliyet", "q": "Deprem yönetmeliği inşaat maliyetini ne kadar artırır?", "a": "2018 Türkiye Bina Deprem Yönetmeliği daha güçlü statik, daha fazla demir ve daha nitelikli beton gerektirir. Bu, kaba yapı maliyetini eski uygulamalara göre <b>%10-20<\/b> kadar artırabilir.<br>Ancak bu bir gider değil, <b>can ve mal güvenliği yatırımıdır<\/b>. Kaliteli beton (C30 ve üzeri), doğru demir donatı ve zemin iyileştirme pazarlık konusu yapılmamalıdır. Meridyen Yapı, statik projede güvenliği önceleyerek yönetmeliğe tam uyumlu üretim yapar; ucuza kaçılan yapı en pahalı yapıdır."}, {"c": "maliyet", "q": "İki müteahhit teklifi arasındaki büyük farkın sebebi nedir?", "a": "Aynı iş için gelen tekliflerdeki büyük fark neredeyse her zaman <b>kapsam ve kalite farkıdır<\/b>, fiyat farkı değil. Sık görülen nedenler:<ul><li>Farklı malzeme markası ve sınıfı<\/li><li>Bazı kalemlerin (peyzaj, tesisat, harç) hariç tutulması<\/li><li>Beton ve demir sınıfında kısıntı<\/li><li>İşçilik kalitesi ve garanti süresi<\/li><\/ul>Düşük teklif çoğu zaman sonradan ek ödeme demektir. Teklifleri değil, <b>aynı şartname üzerinden<\/b> fiyatları karşılaştırın; asıl kıyas budur."}, {"c": "maliyet", "q": "İnce yapıda hangi kalemler maliyeti en çok belirler?", "a": "İnce yapı bütçesini en çok oynatan kalemler:<ul><li><b>Zemin kaplama<\/b> (seramik, parke, doğal taş)<\/li><li><b>Mutfak ve banyo<\/b> (dolap, vitrifiye, armatür)<\/li><li><b>Doğrama<\/b> (kapı, pencere, ısıcam)<\/li><li><b>Boya ve dekoratif duvar<\/b> işleri<\/li><li><b>Aydınlatma ve otomasyon<\/b><\/li><\/ul>Bu kalemlerde standart ile lüks arasında iki-üç kat fark oluşabilir. Kaba yapı bittikten sonra bütçenin çoğu burada harcanır; bu yüzden malzeme seçimleri inşaata başlamadan netleşmeli, sürekli değişiklik hem parayı hem süreyi büyütür."}, {"c": "maliyet", "q": "Prefabrik yapı mı yoksa betonarme mi daha ekonomik?", "a": "Prefabrik ve çelik yapılar, özellikle tek katlı büyük açıklıklı depo, fabrika ve ticari yapılarda <b>hız ve maliyet<\/b> avantajı sağlar; şantiye süresi kısadır. Betonarme ise çok katlı konut, uzun ömür ve yüksek yalıtım isteyen yapılarda öne çıkar.<br>Prefabrik m2 maliyeti genelde daha düşüktür ama yalıtım, ömür ve ikinci el değeri farklıdır. Doğru karar <b>kullanım amacına<\/b> bağlıdır; konutta genelde betonarme, sanayide çelik/prefabrik daha mantıklıdır. Fizibilite ikisini de kıyaslayarak yapılmalıdır."}, {"c": "maliyet", "q": "Çevre düzenleme ve peyzaj maliyeti ne kadardır?", "a": "Çevre düzenleme çoğu zaman bütçelenirken unutulur ama villa ve site projelerinde ciddi bir kalemdir. İstinat duvarı, bahçe, otopark, aydınlatma ve peyzaj toplam maliyetin <b>%5-12<\/b>'sine ulaşabilir.<br>Havuz, pergola, otomatik sulama ve sert zemin (granit, andezit) bu tutarı hızla yükseltir. Eğimli arsalarda istinat ve drenaj neredeyse zorunludur ve maliyeti öngörülenden fazla çıkar. Bu yüzden peyzaj, projeye baştan dahil edilmeli; sonradan yapılan çevre işi hem pahalı hem parçalı olur."}, {"c": "maliyet", "q": "Betonun ve demirin kalitesi maliyeti nasıl etkiler?", "a": "Beton sınıfı (C25, C30, C35) ve demir (nervürlü B420C/B500C) doğrudan hem güvenliği hem maliyeti belirler. Yüksek sınıf beton ve fazla donatı kaba yapı maliyetini artırır, ancak dayanım ve deprem güvenliği için şarttır.<br>Ucuz, düşük dozajlı beton veya standart dışı demir kısa vadede tasarruf gibi görünse de <b>can güvenliği riski<\/b> ve gelecekte güçlendirme masrafı doğurur. Meridyen Yapı hazır beton ve demirde belgeli, deney raporlu malzeme kullanır; taşıyıcı sistemde tasarruf yapılmaz."}, {"c": "maliyet", "q": "Arsa hariç inşaat maliyeti nasıl ayrı hesaplanır?", "a": "Toplam yatırım iki büyük parçadan oluşur: <b>arsa bedeli<\/b> ve <b>inşaat maliyeti<\/b>. Anahtar teslim m2 fiyatları genellikle sadece inşaatı kapsar, arsa hariçtir.<br>Sağlıklı fizibilite için ikisi ayrı ayrı hesaplanmalı, ardından toplanmalıdır. İnşaat maliyeti; kaba yapı, ince yapı, tesisat, harçlar ve genel giderlerden oluşur. Arsa maliyetine ise tapu, emsal ve konum yansır. Yatırım kararında asıl kritik olan, ikisinin toplamının bölgedeki <b>satış değerine<\/b> oranıdır; bunu fizibilite gösterir."}, {"c": "maliyet", "q": "İnşaat maliyeti hesaplarken hangi hatalar en çok yapılır?", "a": "Mülk sahiplerinin en sık düştüğü maliyet hataları:<ul><li>Sadece m2 fiyatına bakıp <b>kapsamı<\/b> okumamak<\/li><li>Beklenmedik gider payı ayırmamak<\/li><li>Zemin etüdünü atlamak<\/li><li>İnşaat sırasında sürekli proje değiştirmek<\/li><li>En düşük teklifi otomatik seçmek<\/li><li>Harç, ruhsat ve aboneliği bütçeye koymamak<\/li><\/ul>Bu hatalar bütçeyi %30-50 aştırabilir. Doğru başlangıç; eksiksiz proje, gerçek metraj ve <b>%10-15 rezerv<\/b> ile yapılan planlamadır. Meridyen Yapı keşifte bu kalemleri baştan tabloya koyar."}, {"c": "maliyet", "q": "Kat yüksekliği ve açıklık maliyeti nasıl değiştirir?", "a": "Net kat yüksekliğinin artması (örneğin 2,80 m yerine 3,50 m) daha fazla duvar, sıva, kolon ve cephe demektir; her ek metre m2 maliyetini yükseltir. Büyük açıklıklar (kolonsuz geniş salonlar) ise daha güçlü kiriş ve fazla demir gerektirir.<br>Ticari ve endüstriyel yapılarda yüksek tavan ve geniş açıklık işlevsel zorunluluktur ama statik maliyeti artırır. Verimli mimari; ihtiyaca göre <b>optimum<\/b> yükseklik ve açıklık seçerek hem konforu hem bütçeyi dengeler. Aşırı gösterişli hacimler görünmeyen maliyet yaratır."}, {"c": "maliyet", "q": "Yalıtım ve enerji verimliliği maliyeti artırır mı yoksa düşürür mü?", "a": "Isı yalıtımı, ısıcam, çatı-cephe yalıtımı ve nitelikli doğrama <b>ilk yatırım maliyetini<\/b> bir miktar artırır. Ancak yıllar içinde ısınma-soğutma faturasını ciddi düşürerek kendini amorti eder.<br>Ayrıca Enerji Kimlik Belgesi (EKB) mevzuat gereği zorunludur; iyi yalıtım hem konfor hem ikinci el değeri kazandırır. Yani yalıtım bir gider değil, <b>geri dönüşü olan bir yatırımdır<\/b>. Kısa vadeli tasarruf için yalıtımdan kısmak, uzun vadede en pahalı tercihtir. Meridyen Yapı yalıtımı standart olarak projeye dahil eder."}, {"c": "maliyet", "q": "İnşaat süresi maliyeti nasıl etkiler?", "a": "Süre, maliyetin gizli çarpanıdır. İş uzadıkça şantiye giderleri (şef, güvenlik, kira, ekipman) devam eder; enflasyon ve kur nedeniyle malzeme zamlanır. Gecikme, faizli kaynak kullananda <b>finansman yükünü<\/b> de büyütür.<br>Diğer yandan aşırı hızlanma da kaliteyi düşürebilir. İdeal olan; gerçekçi bir iş programı, düzenli malzeme akışı ve zamanında hakediş ödemesidir. Ödemesi aksayan şantiye durur ve durma her zaman ek maliyet demektir. Planlı yürütülen bir proje, hem zamandan hem paradan kazandırır."}, {"c": "maliyet", "q": "Site ve toplu konut projesinde m2 maliyeti neden düşer?", "a": "Toplu konut ve sitelerde <b>ölçek ekonomisi<\/b> devreye girer. Malzeme büyük partiler halinde alınır, kalıp ve iskele tekrar tekrar kullanılır, ekipler seri çalışır; bu da m2 maliyetini tek yapıya göre düşürür.<br>Ortak altyapı (yol, otopark, sosyal tesis) çok sayıda bağımsız bölüme paylaştırılır. Buna karşın peyzaj, güvenlik ve ortak alanların kalitesi maliyeti yükseltebilir. Genelde site projelerinde konut başına maliyet, aynı kalitedeki müstakil yapıdan <b>daha avantajlıdır<\/b>; verimlilik burada tekrar ve planlamadan gelir."}, {"c": "maliyet", "q": "Ruhsat, proje ve harç giderleri inşaat bütçesinin ne kadarı?", "a": "Yapının resmi süreç maliyetleri çoğu kişi tarafından hafife alınır. Mimari-statik-mekanik-elektrik projeleri, zemin etüdü, yapı denetim, ruhsat harçları ve abonelik bağlantıları toplamda bütçenin <b>%4-8<\/b>'ine ulaşabilir.<br><b>Yapı denetim<\/b> ücreti kanunen zorunludur ve inşaat bedeline oranla hesaplanır. Bu kalemler anahtar teslim fiyatın çoğu zaman dışındadır, sözleşmede kontrol edilmelidir. Bütçeyi kurarken bu resmi giderleri baştan hesaba katmak, ilerideki nakit sıkışıklığını önler."}, {"c": "maliyet", "q": "Ofis ve iş yeri inşaat maliyeti konuttan farklı mıdır?", "a": "Evet, ofis ve ticari yapılarda maliyet dağılımı konuttan farklıdır. Geniş açıklıklar, yüksek tavan, güçlü elektrik-veri altyapısı, merkezi iklimlendirme (VRF/klima) ve yangın sistemleri ön plana çıkar; bu da m2 maliyetini yükseltir.<br>2026 için nitelikli ofis kaba+ince maliyeti yaklaşık <b>20.000 - 40.000 TL/m2<\/b> aralığındadır. Cephe (cam giydirme), zemin kalitesi ve teknik altyapı belirleyicidir. Ticari yapılarda ayrıca erişilebilirlik ve otopark mevzuatı ek maliyet doğurur; tasarım baştan işleve göre kurulmalıdır."}, {"c": "maliyet", "q": "Havuzlu villa yaptırmanın ek maliyeti ne kadar?", "a": "Havuz, villanın en çok merak edilen ek kalemidir. Boyut, tip (skimmer/taşmalı) ve donanıma göre 2026'da bir havuz maliyeti kabaca <b>750.000 TL'den başlayıp birkaç milyon TL<\/b>'ye çıkabilir.<br>Maliyeti; kazı, betonarme tekne, su yalıtımı, filtre-pompa sistemi, kaplama (seramik/cam mozaik) ve teknik hacim belirler. Taşmalı (infinity) havuzlar skimmere göre belirgin pahalıdır. Ayrıca işletme gideri (su, kimyasal, ısıtma) süreklidir. Havuz kararı, villa bütçesine baştan ayrı bir kalem olarak konulmalıdır."}, {"c": "maliyet", "q": "İnşaatta fire ve zayiat maliyeti nasıl azaltılır?", "a": "Fire, kesim ve uygulama sırasında oluşan malzeme kaybıdır; seramikte, demirde, boyada kaçınılmazdır. Ancak kötü planlamada fire oranı büyür ve doğrudan zarar yazar.<br>Fireyi azaltmanın yolları:<ul><li>Doğru <b>metraj<\/b> ile ihtiyaç kadar sipariş<\/li><li>Standart ölçüye uygun mimari<\/li><li>Deneyimli usta ve düzgün depolama<\/li><li>Kesim optimizasyonu (özellikle demir ve doğrama)<\/li><\/ul>Ortalama %3-10 fire normalken, plansız şantiyede bu iki katına çıkabilir. İyi şantiye yönetimi, görünmeyen bu kaybı doğrudan cebinizde tutar."}, {"c": "maliyet", "q": "Malzemeyi ben mi almalıyım, müteahhit mi (emaneten vs götürü)?", "a": "İki temel model vardır. <b>Götürü (anahtar teslim)<\/b> usulde müteahhit malzeme ve işçiliğin tamamını üstlenir; fiyat baştan bellidir, risk azdır ama kontrol daha sınırlıdır.<br><b>Emanet usulde<\/b> malzemeyi mülk sahibi alır, müteahhit işçilik-yönetim verir; şeffaflık yüksektir ama zaman, bilgi ve takip gerektirir. Deneyimi olmayan için emanet usul çoğu zaman daha pahalıya ve strese mal olur.<br>Doğru seçim; sizin zamanınıza, bilginize ve firmaya güveninize bağlıdır. Karma model (ana malzeme sizden, gerisi müteahhitten) de mümkündür."}, {"c": "finans", "q": "İnşaat kredisi (yapı kredisi) nasıl alınır?", "a": "İnşaat/yapı kredisi, arsası olan kişinin üzerine ev-villa yaptırması için kullandığı kredi türüdür. Başvuru için genellikle şunlar istenir:<ul><li>Tapu ve <b>onaylı yapı ruhsatı<\/b><\/li><li>Mimari proje ve maliyet keşfi<\/li><li>Gelir belgesi<\/li><\/ul>Banka arsaya <b>ipotek<\/b> koyar ve krediyi çoğu zaman inşaatın ilerlemesine göre <b>dilimler halinde<\/b> öder. Kredi tutarı arsa+proje değerinin belirli oranıyla sınırlıdır. Faiz, vade ve ekspertiz şartları bankaya göre değişir; birkaç bankayı karşılaştırmak avantaj sağlar."}, {"c": "finans", "q": "Konut kredisiyle ev yaptırmak mümkün mü?", "a": "Klasik <b>konut kredisi<\/b> genelde tapusu hazır, tamamlanmış konut alımı içindir. Sıfırdan ev yaptırmak isteyen için bankalar ayrı bir <b>inşaat/yapı kredisi<\/b> ürünü sunar.<br>Yapı kredisinde para, iş bittikçe hakediş mantığıyla dilim dilim ödenir ve arsaya ipotek konur. İnşaat bitip iskan (yapı kullanma izni) alındığında, bu kredi bazı bankalarda daha uzun vadeli konut kredisine dönüştürülebilir. Yani yaptırma sürecinde yapı kredisi, tamamlandıktan sonra konut kredisi mantığı devreye girer. Şartlar bankaya göre değişir."}, {"c": "finans", "q": "İnşaatta KDV oranları nedir (%1, %10, %20)?", "a": "Konut ve inşaat teslimlerinde KDV, metrekare ve niteliğe göre değişir. Güncel uygulamada:<ul><li><b>%1<\/b> — net alanı 150 m2'ye kadar belirli sosyal konutlar (kentsel dönüşüm dahil bazı hallerde)<\/li><li><b>%10<\/b> — 150 m2'ye kadar genel konut teslimleri<\/li><li><b>%20<\/b> — 150 m2 üzeri konutlar, iş yeri ve ticari yapılar<\/li><\/ul>İnşaat malzemesi ve müteahhit hizmetlerinde genel oran <b>%20<\/b>'dir. KDV kuralları sık güncellenir; kesin oran için mali müşavir ve güncel tebliğ esas alınmalıdır."}, {"c": "finans", "q": "Tapu harcı ve döner sermaye ücreti ne kadar?", "a": "Tapu devrinde <b>tapu harcı<\/b>, satış bedeli üzerinden alınır; toplam <b>%4<\/b>'tür ve kanunen alıcı-satıcı arasında yarı yarıya (%2+%2) paylaşılır, uygulamada çoğu kez alıcı öder.<br>Buna Tapu ve Kadastro <b>döner sermaye<\/b> (hizmet) bedeli eklenir; her yıl güncellenen maktu bir tutardır. Harç, gerçek satış değeri üzerinden hesaplanmalıdır; düşük gösterim yasal risk doğurur. Yeni yapıda cins değişikliği ve kat mülkiyeti işlemlerinde de ayrı harçlar çıkar. Güncel oran için tapu müdürlüğü esas alınmalıdır."}, {"c": "finans", "q": "İnşaatta hakediş ödemesi nasıl yapılır?", "a": "<b>Hakediş<\/b>, yapılan iş miktarı kadar ödeme yapılması esasına dayanır; peşin toptan ödeme değildir. Belirli aralıklarla (aylık veya imalat aşamasına göre) tamamlanan iş metraj ile ölçülür ve o kadar ödenir.<br>Tipik aşamalar: temel, kaba yapı, çatı, sıva-şap, ince işler, teslim. Her aşamada iş kontrol edilip onaylandıktan sonra ödeme serbest bırakılır. Bu sistem hem müteahhidi işi ilerletmeye teşvik eder hem mülk sahibini korur. Ödeme planı ve aşama tanımları sözleşmede <b>net ve ölçülebilir<\/b> yazılmalıdır."}, {"c": "finans", "q": "Ev yaptırmak için ne kadar öz kaynak gerekir?", "a": "Kredi kullanılsa bile bankalar maliyetin tamamını finanse etmez; genellikle proje-arsa değerinin belirli bir oranını verir. Bu yüzden mülk sahibinin elinde belirli bir <b>öz kaynak<\/b> bulunması şarttır.<br>Pratikte toplam maliyetin en az <b>%25-40<\/b>'ının öz kaynakla karşılanabilmesi sağlıklıdır. Ayrıca krediye girmeyen kalemler (harç, ruhsat, abonelik, mobilya) ve <b>%10-15 beklenmedik gider payı<\/b> için nakit rezerv gerekir. Öz kaynağı zayıf başlanan inşaat, ortada yarım kalma riski taşır; finansman planı işe başlamadan netleşmelidir."}, {"c": "finans", "q": "Taşerona ödeme nasıl güvenli yapılır?", "a": "Taşeron (alt yüklenici), belirli bir imalatı (kalıp, sıva, seramik gibi) götürü veya birim fiyatla üstlenen ekiptir. Ödemede güvenlik için:<ul><li>Yazılı <b>taşeron sözleşmesi<\/b> ve net metraj<\/li><li>İş ilerledikçe <b>hakediş<\/b> usulü ödeme<\/li><li>Teslim öncesi <b>teminat/stopaj<\/b> tutulması<\/li><li>SGK ve iş güvenliği yükümlülüğünün belirlenmesi<\/li><\/ul>Peşin toplu ödeme en riskli yöntemdir. Ödemeler işin görülen kısmına bağlı yürümeli, kusurlu iş için bir bölüm garanti olarak sonda bırakılmalıdır. Belgesiz ödeme hem finansal hem hukuki risk yaratır."}, {"c": "finans", "q": "İnşaatta geçici ve kesin teminat nedir?", "a": "Teminat, işin sözleşmeye uygun yapılacağının güvencesidir. <b>Geçici teminat<\/b> ihale/teklif aşamasında, teklifin ciddiyetini göstermek için alınır. <b>Kesin teminat<\/b> ise sözleşme imzalanınca, işin eksiksiz tamamlanmasını garanti etmek için alınır ve genelde iş bedelinin belirli bir yüzdesidir.<br>Özel projelerde bu güvence; teminat mektubu, senet veya sözleşmeye konan garanti bedeli şeklinde olabilir. Ayrıca teslim sonrası kusurlar için bir miktar ödeme, <b>garanti süresi<\/b> boyunca tutulabilir. Teminat şartları sözleşmede açıkça tanımlanmalıdır."}, {"c": "finans", "q": "Gider pusulası ile fatura arasındaki fark nedir?", "a": "<b>Fatura<\/b>, vergi mükellefi bir firma veya esnafın yaptığı satış/hizmet için kestiği resmi belgedir ve KDV içerir. <b>Gider pusulası<\/b> ise vergi mükellefi olmayan kişilerden (örneğin belgesiz çalışan bir usta) alınan mal/hizmet için, ödeyen tarafın düzenlediği belgedir.<br>İnşaatta kurumsal müteahhit ve tedarikçiler fatura keser; belgesiz işçilikte gider pusulası gündeme gelir ve üzerinden <b>stopaj (gelir vergisi kesintisi)<\/b> yapılması gerekebilir. Doğru belgelendirme hem vergi hem ispat açısından kritiktir; mali müşavirle yürütülmelidir."}, {"c": "finans", "q": "Ev yaptırırken hangi vergi avantajları var?", "a": "İnşaat finansmanında bazı vergisel fırsatlar bulunur:<ul><li>Konut kredisi <b>faizleri<\/b>, kira geliri beyanında belirli koşullarda gider yazılabilir<\/li><li>150 m2 altı konutta düşük <b>KDV<\/b> oranı avantajı<\/li><li>Kentsel dönüşümde harç ve bazı ücretlerde <b>muafiyet/indirim<\/b><\/li><li>Yeni konutu ilk kez satan için belirli koşullarda avantaj<\/li><\/ul>Vergi mevzuatı sık değişir ve kişiye özeldir. Somut avantajı yakalamak için mutlaka güncel tebliğler ve bir <b>mali müşavir<\/b> ile hareket edilmelidir; kulaktan dolma bilgi risklidir."}, {"c": "finans", "q": "Kentsel dönüşümde devlet kredisi ve hibe desteği var mı?", "a": "Evet. Riskli yapı tespiti yapılan binalar için devlet, uygun koşullu <b>dönüşüm kredisi<\/b> ve dönemsel olarak <b>kira yardımı<\/b> sağlayabilir. Ayrıca yıkım-yeniden yapım sürecinde bazı harç ve ücretlerde muafiyet uygulanır.<br>Destek tutarları ve koşulları her yıl güncellenir; başvuru genellikle riskli yapı raporu ve maliklerin karar çoğunluğu üzerinden yürür. Bu teşvikler, dönüşümü mülk sahibi için ciddi biçimde kolaylaştırır. Güncel şartlar için ilgili bakanlık ve belediye esas alınmalı; Meridyen Yapı süreç ve fizibiliteyi baştan sona yönetir."}, {"c": "finans", "q": "İnşaat bütçesi nasıl planlanır?", "a": "Sağlam bir inşaat bütçesi şu adımlarla kurulur:<ul><li>Eksiksiz projeye dayalı <b>gerçek metraj ve keşif<\/b><\/li><li>Harç, ruhsat, abonelik gibi <b>yan giderlerin<\/b> eklenmesi<\/li><li>Toplamın üzerine <b>%10-15 beklenmedik gider payı<\/b><\/li><li>Öz kaynak + kredi ile <b>nakit akış takvimi<\/b><\/li><li>Hakediş aşamalarına göre ödeme planı<\/li><\/ul>Bütçenin sadece toplamı değil, <b>zamanlaması<\/b> da kritiktir; paranın şantiye ihtiyacından önce hazır olması gerekir. Nakdi biten inşaat durur, durma ise en pahalı sonuçtur. Meridyen Yapı kalem kalem bütçe tablosu sunar."}, {"c": "finans", "q": "Kat karşılığı inşaat finansman açısından nasıl çalışır?", "a": "Kat karşılığı (arsa payı karşılığı) modelinde mülk sahibi <b>nakit ödemez<\/b>; arsasını verir, müteahhit inşaatı kendi finansmanıyla yapar ve karşılığında belirlenen bağımsız bölümleri alır.<br>Bu, öz kaynağı sınırlı arsa sahibi için güçlü bir modeldir çünkü inşaat maliyeti riskini büyük ölçüde müteahhit taşır. Kritik nokta <b>paylaşım oranı<\/b> ve teslim güvencesidir; sözleşmede daire numaraları, m2, teslim süresi ve gecikme cezası net olmalıdır. Ayrıca müteahhide <b>kat irtifakı<\/b> aşamalı devredilerek mülk sahibi korunmalıdır."}, {"c": "finans", "q": "Müteahhide yapılan ödemede kendimi nasıl güvenceye alırım?", "a": "Ödeme güvenliği için altın kural: <b>işi görmeden ödeme yapmamak<\/b>. Korunma yolları:<ul><li>Peşin toplu değil, <b>hakediş<\/b> usulü ödeme<\/li><li>Her aşamada iş kontrolü sonrası ödeme serbestisi<\/li><li>Sözleşmeye <b>teminat<\/b> ve gecikme cezası koyma<\/li><li>Teslim sonrası kusurlar için <b>garanti bedeli<\/b> tutma<\/li><li>Kat karşılığında aşamalı tapu devri<\/li><\/ul>Ödemenin işin fiziksel ilerlemesinin bir adım gerisinde kalması sizi korur. Kurumsal, referanslı ve sözleşmeye sadık firma seçmek, en güçlü güvencedir."}, {"c": "finans", "q": "İnşaat kredisi faizi ve vadesi 2026'da nasıl?", "a": "İnşaat/yapı kredisi faizleri, TCMB politika faizine ve bankanın risk değerlendirmesine göre belirlenir; piyasa koşullarına bağlı olarak sık değişir. Vadeler genellikle <b>konut kredisine göre daha kısadır<\/b> çünkü inşaat riski taşınır.<br>Kredi tutarı arsa+proje ekspertiz değerinin belirli bir oranıyla sınırlıdır ve para hakediş mantığıyla dilim dilim kullandırılır. Kesin faiz ve vade için birkaç bankadan güncel teklif alıp <b>toplam maliyet (masraf+sigorta dahil)<\/b> karşılaştırılmalıdır. Sadece faiz oranına değil, dosya-ekspertiz masraflarına da bakın."}, {"c": "finans", "q": "İnşaat finansman modelleri nelerdir?", "a": "Bir yapıyı finanse etmenin başlıca yolları:<ul><li><b>Öz kaynak<\/b> (birikimle, borçsuz)<\/li><li><b>Banka yapı/konut kredisi<\/b> (ipotekli)<\/li><li><b>Kat karşılığı<\/b> (nakit yerine arsa payı)<\/li><li><b>Ön satış<\/b> (maketten/aşamalı satışla finansman)<\/li><li>Karma model (öz kaynak + kredi + ön satış)<\/li><\/ul>Doğru model; elinizdeki nakde, arsa durumuna ve risk iştahınıza bağlıdır. Çoğu proje karma modelle yürür. Kritik olan, seçilen modelin <b>nakit akışını<\/b> şantiye takvimiyle uyumlu tutmasıdır. Yanlış finansman, teknik olarak iyi bir projeyi bile yarıda bırakabilir."}, {"c": "finans", "q": "Maketten (ön satışla) ev yaptırma finansmanı nasıl işler?", "a": "Ön satış modelinde geliştirici, inşaat tamamlanmadan bağımsız bölümleri <b>maketten satar<\/b> ve gelen ödemelerle inşaatı finanse eder. Alıcı genelde daha uygun fiyata girer, geliştirici ise nakit akışı sağlar.<br>Ancak alıcı için risk vardır: proje yarıda kalabilir. Korunma için <b>bina tamamlama sigortası<\/b>, hakediş/aşamalı ödeme, kat irtifakı ve güçlü referanslı firma şarttır. Ödemeler mümkünse inşaat ilerlemesine bağlanmalı, tamamı peşin verilmemelidir. Bu model, doğru firma ve sözleşme ile hem geliştiriciye hem alıcıya avantaj sağlar; yanlış firmada risklidir."}, {"c": "finans", "q": "İnşaat sözleşmesinde gecikme cezası nasıl belirlenir?", "a": "<b>Gecikme cezası<\/b> (cezai şart), müteahhidin işi kararlaştırılan sürede teslim etmemesi halinde ödeyeceği tazminattır. Genelde günlük veya aylık maktu tutar ya da iş bedelinin belirli bir yüzdesi olarak yazılır.<br>Adil bir sözleşmede süre, mücbir sebep (deprem, resmi engel) halleri ve ceza tavanı da tanımlanır. Kat karşılığı projelerde teslim gecikmesi, kira kaybını da içerecek şekilde düzenlenebilir. Bu madde mülk sahibini korur ve müteahhidi programa sadık kalmaya teşvik eder. Belirsiz süre, en sık yaşanan mağduriyet nedenidir; net tarih şarttır."}, {"c": "finans", "q": "İnşaatta stopaj (tevkifat) nedir, kim öder?", "a": "İnşaat işlerinde bazı hizmet ve ödemelerde <b>KDV tevkifatı<\/b> ve <b>gelir vergisi stopajı<\/b> uygulanır. Örneğin belirli müteahhitlik/taşeronluk hizmetlerinde KDV'nin bir kısmı alıcı tarafından doğrudan vergi dairesine yatırılır (tevkifat).<br>Vergi mükellefi olmayan kişilere yapılan ödemede (gider pusulası ile) ise gelir vergisi stopajı gündeme gelir. Bu kesintiler, kayıt dışını önlemeye yöneliktir ve yanlış uygulanması cezalı tarhiyat doğurur. Oranlar ve kapsam sık değişir; inşaat muhasebesini mutlaka bir <b>mali müşavir<\/b> ile yürütmek gerekir."}, {"c": "finans", "q": "Yapı kullanma izni (iskan) finansal olarak neden önemli?", "a": "<b>İskan (yapı kullanma izni)<\/b>, binanın projesine ve mevzuata uygun bitirildiğini gösteren resmi belgedir. Finansal açıdan hayati önemi vardır:<ul><li>İskansız yapıda kat mülkiyeti kurulamaz<\/li><li>Su-elektrik-doğalgaz aboneliği zorlaşır<\/li><li>Satış ve değeri düşer, kredi alınamayabilir<\/li><li>Emlak vergisi ve harçlar sağlıklı işlemez<\/li><\/ul>Yani iskan, yapının hem yasal hem ekonomik değerini tamamlayan son adımdır. Anahtar teslim sözleşmesinde iskan sürecinin kimin sorumluluğunda olduğu mutlaka yazılmalıdır; iskansız yapı yarım yatırımdır."}, {"c": "finans", "q": "Yapı denetim ücreti ne kadar ve kim öder?", "a": "<b>Yapı denetimi<\/b> kanunen zorunludur; inşaatın projeye ve güvenlik standartlarına uygun yapılmasını bağımsız firma denetler. Ücreti, yapı yaklaşık maliyeti üzerinden yasayla belirlenen bir oranda hesaplanır ve genellikle <b>yapı sahibi (mal sahibi)<\/b> tarafından karşılanır.<br>Ödeme, inşaat ilerledikçe taksitler halinde ve iş bankası aracılığıyla yapılır. Bu bedel bir masraf gibi görünse de, denetim yapının kalitesini ve can güvenliğini güvence altına alır. Anahtar teslim tekliflerde bu kalemin dahil olup olmadığı mutlaka netleştirilmelidir."}, {"c": "finans", "q": "İnşaat için kredi mi çekmeli yoksa öz kaynakla mı yapmalı?", "a": "Bu, faiz oranına, enflasyon beklentisine ve nakit gücünüze bağlı stratejik bir karardır.<br><b>Öz kaynak<\/b> borçsuzluk ve gönül rahatlığı sağlar ama tüm birikimi tek yatırıma bağlar. <b>Kredi<\/b> ise sermayeyi korur, ancak faiz yükü ve düzenli geri ödeme baskısı getirir. Yüksek enflasyon dönemlerinde uygun faizli kredi bazen avantajlı olabilir; pahalı kredi ise projeyi zorlar.<br>Sağlıklı yaklaşım; öz kaynağı ağırlıklı tutup, gerektiği kadar krediyle desteklemektir. Karar öncesi gerçekçi bir <b>nakit akış ve fizibilite<\/b> tablosu çıkarılmalıdır."}, {"c": "finans", "q": "Malzeme zamlarına karşı finansal olarak nasıl korunurum?", "a": "Uzun süren projelerde malzeme zammı, bütçeyi en çok bozan finansal risktir. Korunma yolları:<ul><li>Demir, çimento gibi ana girdiyi <b>erken ve peşin<\/b> tedarik etmek<\/li><li>Sözleşmeye <b>fiyat sabitleme<\/b> veya net eskalasyon formülü koymak<\/li><li>Tedarikçiyle fiyat kilidi anlaşması yapmak<\/li><li>Bütçede <b>%10-15 rezerv<\/b> tutmak<\/li><\/ul>Tüm riski müteahhide yıkan sabit fiyatta ise bu risk primi baştan fiyata eklenir. Doğru strateji projenin süresine bağlıdır. Kritik malzemeyi zamandan önce almak, dalgalanmaya karşı en somut korumadır."}, {"c": "finans", "q": "İnşaat şirketinin mali güvenilirliğini nasıl kontrol ederim?", "a": "Müteahhit seçmeden önce mali sağlamlığını araştırmak, ödeme güvenliğinin temelidir. Bakılması gerekenler:<ul><li>Tamamlanmış <b>referans projeler<\/b> ve teslim geçmişi<\/li><li>Şirketin ticari sicili ve süresi<\/li><li>Devam eden davalar, icra kaydı olup olmadığı<\/li><li>Yapı müteahhitliği <b>yetki belgesi<\/b><\/li><li>Tedarikçi ve taşeronlarla ödeme itibarı<\/li><\/ul>Referans projeleri yerinde görmek ve eski müşterilerle konuşmak en güçlü yöntemdir. Sözleşme ne kadar iyi olursa olsun, arkasında <b>mali açıdan güçlü ve dürüst<\/b> bir firma yoksa risk büyüktür."}, {"c": "muteahhit", "q": "Güvenilir müteahhit seçerken nelere dikkat edilmeli?", "a": "Güvenilir müteahhit seçiminde önce yapı müteahhitliği yetki belgesini (sicil kaydını) sorun. Ardından tamamladığı projeleri yerinde gezin, malzeme kalitesini ve teslim tarihlerine uyumu inceleyin. Vergi ve SGK borcu olmadığını, banka referanslarını kontrol edin. Sözlü vaatlere değil, yazılı ve noter onaylı taahhütlere güvenin. <br><b>Meridyen Yapı<\/b>, geçmiş projelerini ve referanslarını şeffaf biçimde mülk sahipleriyle paylaşır."}, {"c": "muteahhit", "q": "Müteahhitin geçmiş işlerini ve referanslarını nasıl kontrol ederim?", "a": "Müteahhitin daha önce yaptığı binaların adreslerini isteyin ve bizzat ziyaret edin. O binalardaki daire sahipleriyle konuşup teslim süresi, ayıplı iş ve satış sonrası desteğe dair deneyimlerini öğrenin. Belediyeden yapı kullanma izin belgesi (iskân) alınmış mı bakın. İnternette firma ve yetkili adıyla dava kayıtlarını ve şikâyetleri araştırın. Referans veremeyen ya da geçmiş işini göstermekten kaçınan firmalardan uzak durun."}, {"c": "muteahhit", "q": "Müteahhit sözleşmesinde mutlaka bulunması gereken maddeler nelerdir?", "a": "Sağlam bir müteahhit sözleşmesinde şu maddeler bulunmalı:<br><ul><li>Taraf bilgileri ve arsa tapu bilgisi<\/li><li>İşin kapsamı, teknik şartname ve malzeme listesi<\/li><li>Toplam bedel ve hakediş ödeme planı<\/li><li>İş programı, başlangıç ve kesin teslim tarihi<\/li><li>Gecikme için cezai şart<\/li><li>Garanti ve ayıplı iş sorumluluğu<\/li><li>Fesih ve anlaşmazlık çözüm yolları<\/li><\/ul>Belirsiz ifadeler yerine ölçülebilir taahhütler yazılmalıdır."}, {"c": "muteahhit", "q": "Taşeron ile müteahhit arasındaki fark nedir?", "a": "<b>Müteahhit<\/b>, işverenle (arsa sahibiyle) sözleşme yapan ve işin tamamından sorumlu olan ana yüklenicidir. <b>Taşeron<\/b> ise müteahhitin belirli bir işi (kalıp, sıva, elektrik gibi) yaptırdığı alt yüklenicidir. Arsa sahibi hukuken müteahhite karşı hak talep eder; taşeronlarla doğrudan muhatap olmaz. Bu yüzden sözleşmeyi ana müteahhitle yapmak ve tüm sorumluluğu onun üzerinde tutmak önemlidir."}, {"c": "muteahhit", "q": "İnşaatta hakediş sistemi nasıl işler?", "a": "Hakediş, yapılan işin ilerlemesine göre ödeme yapılmasıdır. İş kalemleri (temel, kaba yapı, ince işler gibi) ilerledikçe, tamamlanan oranda ödeme serbest bırakılır. Böylece işverenin parası peşin gitmez, müteahhitin işi bitirme motivasyonu korunur. Her hakediş öncesi imalatın yerinde kontrol edilip tutanağa bağlanması önerilir. Peşin ödeme yerine ilerlemeye bağlı ödeme, mülk sahibinin en güçlü korumasıdır."}, {"c": "muteahhit", "q": "Müteahhit işi geciktirirse cezai şart uygulanabilir mi?", "a": "Evet. Sözleşmeye yazılan cezai şart, müteahhit teslim tarihini geçirdiğinde her gecikme günü için belirli bir tutar ödemesini öngörür. Bu tutarın makul ve caydırıcı olması gerekir. Türk Borçlar Kanunu uyarınca fahiş cezai şart hâkim tarafından indirilebilir. Cezai şartın yanında, gecikme nedeniyle uğradığınız gerçek zararı da (kira kaybı gibi) ayrıca talep hakkınızı sözleşmeye ekletmeniz akıllıcadır."}, {"c": "muteahhit", "q": "İnşaat iş programı ve süre sözleşmede nasıl belirlenir?", "a": "İş programı, inşaatın aşamalarını takvime bağlayan çizelgedir. Sözleşmede ruhsat alımından teslime kadar her kilit aşama için tarih belirtilmelidir. Sürenin hangi durumlarda uzayabileceği (mücbir sebep, imar değişikliği, ek imalat talebi) açıkça sayılmalı; bunun dışındaki gecikmeler müteahhitin sorumluluğunda kalmalıdır. Net bir kesin teslim tarihi ve gecikme yaptırımı olmadan yapılan sözleşme, mülk sahibini korumasız bırakır."}, {"c": "muteahhit", "q": "Teslim sırasında ayıplı iş çıkarsa ne yapabilirim?", "a": "Teslim alırken binayı ayrıntılı inceleyip gördüğünüz kusurları yazılı tutanakla bildirmelisiniz. Açık ayıpları teslim anında, gizli ayıpları ise fark ettiğiniz anda ihtar çekerek müteahhite bildirin. Türk Borçlar Kanunu size onarım, bedel indirimi veya ağır durumda sözleşmeden dönme haklarını tanır. Teslimi kayıtsız kabul etmek ileride hak kaybına yol açabileceğinden, ayıpları mutlaka belgeleyin ve saklayın."}, {"c": "muteahhit", "q": "Müteahhit binada ne kadar garanti vermek zorunda?", "a": "Müteahhitin sorumluluğu iki katmanlıdır. Genel ayıp sorumluluğu Borçlar Kanunu'na göre teslimden itibaren beş yıldır; taşınmazdaki ağır kusur ve gizli ayıplarda bu süre daha da uzayabilir. Kaçak yapı veya kasten gizlenen ayıplarda zamanaşımı işlemez. Isı yalıtımı, su tesisatı ve taşıyıcı sistem gibi kritik kalemler için garanti kapsamını sözleşmede ayrıca netleştirmek mülk sahibinin yararınadır."}, {"c": "muteahhit", "q": "İnşaatta iş güvenliği sorumluluğu kimin üzerindedir?", "a": "Şantiyede iş sağlığı ve güvenliği sorumluluğu esas olarak işveren konumundaki müteahhite aittir. Çalışanların sigortası, güvenlik ekipmanı, iş güvenliği uzmanı bulundurulması müteahhitin yükümlülüğüdür. Bir iş kazasında arsa sahibinin sorumlu tutulmaması için, tüm iş güvenliği ve SGK yükümlülüklerinin müteahhite ait olduğu sözleşmede açıkça yazılmalıdır. Bu madde arsa sahibini ciddi hukuki risklerden korur."}, {"c": "muteahhit", "q": "İnşaat all risk sigortası şart mı, kim yaptırmalı?", "a": "İnşaat all risk (CAR) sigortası; yangın, sel, hırsızlık, çökme gibi risklere ve üçüncü kişilere verilecek zararlara karşı inşaatı güvenceye alır. Zorunlu olmasa da güçlü bir korumadır ve yapımı müteahhitten talep edilmelidir. Poliçenin arsa sahibini de kapsaması, süresinin inşaat boyunca kesintisiz sürmesi sağlanmalıdır. Sigorta yükümlülüğünü sözleşmeye yazmak, olası büyük zararların yükünü mülk sahibinden uzak tutar."}, {"c": "muteahhit", "q": "Müteahhitle anlaşmazlık çıkarsa tahkim mi mahkeme mi?", "a": "Uyuşmazlıkta iki yol vardır: devlet mahkemeleri ya da tahkim. <b>Tahkim<\/b> genelde daha hızlı ve uzmanlık gerektiren teknik konularda avantajlıdır, ancak masrafları yüksek olabilir. Tahkim istiyorsanız sözleşmeye açık bir tahkim şartı yazılmalıdır. Küçük ve orta ölçekli projelerde çoğu mülk sahibi için yetkili mahkeme yolu daha ekonomik olur. Hangi yol seçilirse seçilsin, yetkili merci sözleşmede net belirtilmelidir."}, {"c": "muteahhit", "q": "Müteahhite peşin avans ödemek riskli mi?", "a": "Peşin büyük avans ödemek en riskli yöntemlerden biridir. Parayı alan müteahhit işi yavaşlatabilir, malzemeyi başka projeye kaydırabilir veya iflas edebilir. Bunun yerine ödemeleri işin ilerlemesine bağlı hakediş sistemiyle yapın. Zorunlu bir avans varsa, karşılığında teminat mektubu veya ipotek isteyin. <b>Meridyen Yapı<\/b>, ödemeleri fiziksel ilerlemeye bağlayan şeffaf hakediş modeliyle çalışır."}, {"c": "muteahhit", "q": "Müteahhit sözleşmesi hangi durumlarda feshedilebilir?", "a": "Sözleşme; müteahhitin işe hiç başlamaması, ağır gecikme, sözleşmeye aykırı ve ayıplı imalat ya da ödemeleri amacı dışında kullanması gibi hâllerde feshedilebilir. Fesihten önce genellikle noter kanalıyla ihtar çekilip makul süre verilmelidir. Haklı fesihte yapılan imalatın bedeli mahsup edilir, uğranan zarar talep edilir. Fesih koşullarını ve sonuçlarını sözleşmede önceden düzenlemek, süreci çok daha kolay yönetmenizi sağlar."}, {"c": "muteahhit", "q": "Müteahhit iflas ederse arsa sahibi ne yapabilir?", "a": "Müteahhitin iflası mülk sahibi için ciddi risktir; yarım kalan inşaat ve devredilmiş arsa payları mağduriyet doğurabilir. Korunmak için: arsa paylarını inşaat ilerledikçe kademeli devredin, teminat ipoteği koydurun ve inşaat seviye tespitini tutanaklarla belgeleyin. İflas hâlinde alacaklarınızı iflas masasına kaydettirir, imalat seviyesi kadar hak talep edersiniz. En etkili korunma, arsa payını baştan tümüyle devretmemektir."}, {"c": "muteahhit", "q": "Müteahhitle sözleşme noterde mi yapılmalı?", "a": "Yalnızca inşaat işçiliğini içeren adi müteahhitlik sözleşmesi resmi şekle tabi değildir; yazılı yapılması yeterlidir. Ancak sözleşme arsa payı devri ya da daire teslimi içeriyorsa (kat karşılığı gibi), noter huzurunda <b>düzenleme şeklinde<\/b> yapılması zorunludur. Şekil şartına uyulmaması sözleşmeyi geçersiz kılabilir. İçeriği ne olursa olsun, ispat gücü ve güvence için sözleşmeyi noterde yapmak mülk sahibinin lehinedir."}, {"c": "muteahhit", "q": "Anahtar teslim inşaat sözleşmesi ne anlama gelir?", "a": "Anahtar teslim, müteahhitin binayı sözleşmedeki şartnameye uygun biçimde tamamen bitirip kullanıma hazır olarak teslim etmesidir. Bedel baştan sabitlenir; malzeme fiyatı artsa bile kararlaştırılan tutar değişmez. Bu model mülk sahibini fiyat sürprizlerinden korur, ancak şartname ve malzeme listesinin çok ayrıntılı yazılması gerekir. Belirsiz bir şartname, teslimde kalite tartışmalarına yol açar. <b>Meridyen Yapı<\/b>, kalemi kaleme yazılı şartnameyle çalışır."}, {"c": "muteahhit", "q": "İnşaat sözleşmesinde malzeme kalitesi nasıl güvenceye alınır?", "a": "Malzeme kalitesini güvenceye almak için sözleşmeye marka, model ve teknik özellik düzeyinde bir malzeme listesi (mahal listesi) eklenmelidir. <b>Birinci sınıf malzeme<\/b> gibi belirsiz ifadeler yerine somut ürünler yazın. Muadil kullanılacaksa, en az aynı kalitede olma şartını belirtin. Ayrıca kritik imalatlarda numune onayı hakkı isteyin. Yazılı ve ölçülebilir bir mahal listesi, teslimde yaşanan kalite anlaşmazlıklarının çoğunu baştan önler."}, {"c": "muteahhit", "q": "Müteahhit ruhsatı ve iskânı almakla yükümlü müdür?", "a": "Genellikle yapı ruhsatının alınması, projelerin belediyeye onaylatılması ve iş bitiminde yapı kullanma izni (iskân) alınması müteahhitin sorumluluğundadır. Bu yükümlülük sözleşmede açıkça belirtilmelidir. İskânı alınmamış bina; abonelik, satış ve kredi süreçlerinde ciddi sorun yaratır. Teslim şartını <b>iskân alınmış olarak teslim<\/b> biçiminde tanımlamak, mülk sahibini yarım kalan resmi işlemlerin yükünden korur."}, {"c": "muteahhit", "q": "Küçük müteahhit mi büyük firma mı tercih edilmeli?", "a": "Her ikisinin de artıları vardır. Büyük firmalar kurumsal güvence, sigorta ve mali güç sunar; küçük müteahhitler ise esneklik ve yakın ilgi sağlayabilir. Belirleyici olan büyüklük değil; sicil kaydı, geçmiş iş kalitesi, mali sağlamlık ve sözleşmeye bağlılıktır. İster küçük ister büyük olsun, yetki belgesi olan, referansları doğrulanabilen ve noter güvenceli sözleşmeye yanaşan firmayı seçin. Kâğıt üzerindeki taahhüt, firmanın ölçeğinden daha önemlidir."}, {"c": "muteahhit", "q": "İnşaat sözleşmesinde ek imalat ve fiyat farkı nasıl yönetilir?", "a": "Sözleşme dışı ek talepler (ekstra imalat, malzeme değişikliği) mutlaka yazılı olarak fiyatı ve süreye etkisiyle birlikte kayda geçirilmelidir. Sözlü mutabakatlar teslimde uyuşmazlık kaynağıdır. Sözleşmeye <b>her ek iş için ayrı yazılı ek protokol yapılır<\/b> hükmü koyun. Böylece müteahhit sonradan gerekçesiz fiyat farkı isteyemez, siz de istediğiniz değişiklikleri kontrollü biçimde eklersiniz. Yazılı ek protokol, tarafların ikisini de korur."}, {"c": "katkarsiligi", "q": "Kat karşılığı inşaat nedir, nasıl çalışır?", "a": "Kat karşılığı inşaat, arsa sahibinin arsasını müteahhite verip para yerine yapılacak binadan belirli sayıda bağımsız bölüm (daire, dükkân) almasıdır. Müteahhit inşaatı kendi finansmanıyla yapar, karşılığında kendi payına düşen daireleri satarak kâr eder. Arsa sahibi nakit ödemeden mülk sahibi olur. Paylaşım oranı, teslim süresi ve daire seçimi noter düzenleme sözleşmesiyle güvenceye alınmalıdır."}, {"c": "katkarsiligi", "q": "Kat karşılığı paylaşım oranı nasıl belirlenir?", "a": "Paylaşım oranını belirleyen etkenler:<br><ul><li>Arsanın konumu ve rayiç değeri<\/li><li>İmar durumu (kaç kat, ne kadar inşaat alanı)<\/li><li>Bölgedeki satış fiyatları ve talep<\/li><li>İnşaat maliyeti ve müteahhitin kârı<\/li><\/ul>Değeri yüksek, imarı bol arsalarda arsa sahibinin payı artar. Oran genelde yüzde ile ifade edilir (ör. 50-50, 60-40). Anlaşmadan önce bağımsız bir değerleme yaptırmak, adil oranı görmenizi sağlar."}, {"c": "katkarsiligi", "q": "Kat karşılığı sözleşmesi noterden mi yapılır?", "a": "Evet, zorunludur. Kat karşılığı inşaat sözleşmesi arsa payı devri içerdiğinden, kanunen noter huzurunda <b>düzenleme şeklinde<\/b> yapılmalıdır. Adi yazılı veya sadece noter onaylı (tasdik) sözleşme geçersizdir. Düzenleme şeklindeki sözleşme, noterin metni bizzat hazırlayıp tarafların iradesini teyit etmesiyle oluşur. Bu şekle uyulmaması ciddi mağduriyet doğurur. <b>Meridyen Yapı<\/b>, tüm kat karşılığı anlaşmalarını noter düzenleme sözleşmesiyle güvenceye alır."}, {"c": "katkarsiligi", "q": "Kat karşılığında arsa payı ne zaman devredilmeli?", "a": "Arsa payının devir zamanlaması, arsa sahibinin en kritik güvencesidir. Tüm payı baştan devretmek büyük risktir; müteahhit işi yarım bırakırsa arsanız elden çıkmış olur. En sağlıklısı, arsa payını inşaat ilerledikçe kademeli devretmektir (ör. kaba yapı bitince bir kısmı, iskân alınınca kalanı). Devir takvimi sözleşmeye bağlanmalı, müteahhitin yükümlülüklerini yerine getirmesine koşullanmalıdır."}, {"c": "katkarsiligi", "q": "Kat irtifakı ile kat mülkiyeti arasındaki fark nedir?", "a": "<b>Kat irtifakı<\/b>, henüz tamamlanmamış (inşaat hâlindeki) yapıda bağımsız bölümler üzerinde kurulan ön aşamadaki mülkiyet hakkıdır; proje üzerinden tesis edilir. <b>Kat mülkiyeti<\/b> ise bina bitip iskân alındıktan sonra kurulan, tam ve kesin mülkiyettir. Kat karşılığında önce kat irtifakı kurulur, inşaat tamamlanınca kat mülkiyetine geçilir. Alacağınız dairenin bağımsız bölüm numarası ve arsa payı sözleşmede net olmalıdır."}, {"c": "katkarsiligi", "q": "Kat karşılığında hangi daireler kime kalacak nasıl belirlenir?", "a": "Hangi bağımsız bölümün kime düşeceği tahmine bırakılmamalı, sözleşmede kat ve daire numaralarıyla tek tek belirtilmelidir. <b>Yüzde 50 arsa sahibinin<\/b> demek yetmez; hangi katta, hangi cephede, kaç metrekarelik daireler olduğu yazılmalıdır. Zemin/dükkân, çatı katı ve otopark paylaşımı da netleştirilmelidir. Somut daire tahsisi yapılmadan imzalanan sözleşmeler, teslim aşamasında en sık yaşanan anlaşmazlığın kaynağıdır."}, {"c": "katkarsiligi", "q": "Kat karşılığı sözleşmesinde teminat ve ipotek nasıl alınır?", "a": "Arsa sahibi, müteahhit işi bitirmezse zarara uğramamak için teminat almalıdır. En etkili yollar: müteahhitin payına düşecek daireler üzerine <b>ipotek<\/b> koydurmak, banka teminat mektubu istemek veya arsa payını inşaat seviyesine bağlı kademeli devretmektir. Teminat, sözleşmeye açıkça yazılmalı ve tapuya şerh edilmelidir. Teminatsız yapılan kat karşılığı anlaşmaları, müteahhit iflas ya da terk ederse arsa sahibini savunmasız bırakır."}, {"c": "katkarsiligi", "q": "Kat karşılığı inşaat süresi ve gecikme nasıl düzenlenir?", "a": "Sözleşmede inşaatın kesin bitiş (iskân alınmış teslim) tarihi net yazılmalı, gecikme için günlük cezai şart ve kira tazminatı öngörülmelidir. Mülk sahibi çoğu zaman inşaat süresince kirada oturacağından, gecikmenin kira bedelini müteahhitin karşılaması şartı önemlidir. Sürenin hangi mücbir sebeplerle uzayacağı sınırlı sayıda belirtilmelidir. Belirsiz süre ve yaptırımsız teslim tarihi, yıllarca süren mağduriyetlerin başlıca nedenidir."}, {"c": "katkarsiligi", "q": "Müteahhit kat karşılığında sözleşme dışı ekstra talep edebilir mi?", "a": "Müteahhit, sözleşmede kararlaştırılanın dışında <b>maliyet arttı, ek daire veya para isterim<\/b> diyemez; paylaşım ve yükümlülükler bağlayıcıdır. Malzeme fiyatı artışı riski müteahhite aittir. Ancak arsa sahibi sonradan ek imalat (özel malzeme, ilave kat) isterse, bu ayrı yazılı protokolle fiyatlandırılır. Sözleşmeye <b>paylaşım oranı ve daire tahsisi hiçbir gerekçeyle tek taraflı değiştirilemez<\/b> hükmü koymak, sonradan gelen baskıları engeller."}, {"c": "katkarsiligi", "q": "Kat karşılığı inşaatta KDV ve tapu harcı kime ait?", "a": "Kat karşılığı işlemlerde vergi yükü karmaşıktır. Arsa sahibi arsasını devrederken, müteahhit ise teslim ettiği daireler üzerinden vergisel yükümlülüklerle karşılaşabilir; ticari faaliyet sayılan durumlarda KDV ve gelir vergisi doğabilir. Tapu devir harçları da paylaşımı sözleşmede belirlenmelidir. Vergi sürprizleriyle karşılaşmamak için anlaşma öncesi bir mali müşavire danışmak şarttır. Harç ve masrafların kime ait olduğunu mutlaka yazılı olarak belirleyin."}, {"c": "katkarsiligi", "q": "Kat karşılığı örnek paylaşım hesabı nasıl yapılır?", "a": "Basit bir örnek: İmara göre arsaya 10 daire yapılabildiğini ve paylaşımın 50-50 olduğunu varsayalım. Bu durumda 5 daire arsa sahibine, 5 daire müteahhite kalır. Ancak katların ve cephelerin değeri farklı olduğundan, sadece sayı değil metrekare ve konum dengesi de gözetilmelidir. Zemin dükkânlar genelde ayrı hesaplanır. Adil bölüşüm için toplam satılabilir değeri hesaplayıp payları buna göre eşitlemek en doğru yöntemdir."}, {"c": "katkarsiligi", "q": "Kat karşılığı verirken en sık yaşanan mağduriyetler nelerdir?", "a": "En sık görülen mağduriyetler:<br><ul><li>Arsa payının tümünü baştan devredip inşaatın yarım kalması<\/li><li>Teminat ve ipotek alınmaması<\/li><li>Daire tahsisinin belirsiz bırakılması<\/li><li>Teslim tarihine yaptırım konulmaması<\/li><li>Sözleşmenin noter düzenleme şeklinde yapılmaması<\/li><li>Müteahhitin dairelerini üçüncü kişilere satıp ortadan kaybolması<\/li><\/ul>Bu risklerin tamamı, iyi kurgulanmış bir noter sözleşmesiyle önlenebilir."}, {"c": "katkarsiligi", "q": "Kat karşılığında müteahhit değişikliği mümkün mü?", "a": "Müteahhit işi yürütmez, ağır geciktirir veya sözleşmeye aykırı davranırsa, arsa sahibi haklı nedenle sözleşmeyi feshedip yeni müteahhitle anlaşabilir. Ancak arsa payı devredilmişse süreç zorlaşır; bu yüzden kademeli devir hayati önemdedir. Fesih için önce noter ihtarı çekilir, yapılan imalatın seviyesi tutanakla tespit edilir. Sözleşmeye net fesih koşulları koymak, gerektiğinde müteahhiti değiştirebilmenizi hukuken güvenceye alır."}, {"c": "katkarsiligi", "q": "Hasılat paylaşımı modeli ile kat karşılığı arasındaki fark nedir?", "a": "<b>Kat karşılığında<\/b> arsa sahibi karşılık olarak fiziki daire alır. <b>Hasılat (gelir) paylaşımında<\/b> ise daireler satılır ve satıştan elde edilen para, önceden belirlenen oranda arsa sahibi ile müteahhit arasında bölüşülür. Hasılat modeli, mülk yerine nakit isteyen ve piyasa fiyat artışından pay almak isteyen arsa sahipleri için uygundur. Hangi model seçilirse seçilsin, oran ve ödeme güvencesi sözleşmede net olmalıdır."}, {"c": "katkarsiligi", "q": "Kat karşılığı sözleşmesinde imar durumu neden önemli?", "a": "İmar durumu, arsaya kaç kat ve ne kadar inşaat alanı yapılabileceğini belirler; bu da doğrudan paylaşımı etkiler. Anlaşmadan önce belediyeden güncel imar durum belgesi ve emsal (KAKS) bilgisi alın. Müteahhitin <b>imar artacak<\/b> gibi belirsiz vaatlerine değil, yürürlükteki resmi imara göre hesap yapın. İmar değişikliği olursa payların nasıl güncelleneceği de sözleşmede düzenlenmelidir. İmarı doğru okumadan yapılan paylaşım, ciddi değer kaybına yol açar."}, {"c": "katkarsiligi", "q": "Kat karşılığında arsa sahibi kirada oturursa kira desteği alır mı?", "a": "Evet, bu yaygın bir uygulamadır. İnşaat süresince mevcut binasından çıkıp kiraya taşınan arsa sahiplerine, müteahhitin aylık kira desteği ödemesi sözleşmeye eklenebilir. Kira bedelinin tutarı, ödeme süresi ve gecikme hâlinde artışı net yazılmalıdır. Teslim gecikirse kira desteğinin devam etmesi şartı, mülk sahibini uzayan inşaat sürecinde korur. Bu maddeyi atlamak, uzun süren inşaatlarda ciddi maddi yük doğurur."}, {"c": "katkarsiligi", "q": "Kat karşılığı sözleşmesinde tapu şerhi nasıl konur?", "a": "Kat karşılığı sözleşmesinin tapuya <b>şerh<\/b> edilmesi, arsa sahibinin ve alacağı dairelerin hakkını üçüncü kişilere karşı da korur. Şerh sayesinde müteahhit, arsa sahibine ait payları veya daireleri habersiz üçüncü kişilere devredemez; iyiniyetli üçüncü kişi savunması etkisiz kalır. Noter düzenleme sözleşmesi yapıldıktan sonra tapu müdürlüğünde şerh işlemi yaptırılmalıdır. Tapu şerhi, kat karşılığında en güçlü ve en çok ihmal edilen korumadır."}, {"c": "katkarsiligi", "q": "Müteahhitin daireleri satıp kaçması riskine karşı ne yapılır?", "a": "Bu riske karşı katmanlı koruma gerekir:<br><ul><li>Arsa payını inşaat seviyesine bağlı kademeli devredin<\/li><li>Sözleşmeyi tapuya şerh ettirin<\/li><li>Müteahhit payına ipotek koydurun<\/li><li>Daire tahsisini net belirleyip arsa sahibi payını devretmeyin<\/li><\/ul>Bu önlemler alındığında, müteahhit yükümlülüğünü yerine getirmeden sizin dairelerinizi satamaz. Şerh ve kademeli devir, tapudaki hakkınızı fiilen kilitler."}, {"c": "katkarsiligi", "q": "Kat karşılığı inşaatta ortak alan ve otopark paylaşımı nasıl olur?", "a": "Ortak alanlar (bahçe, sığınak, çatı) kat mülkiyeti kanununa göre bağımsız bölümlere arsa payı oranında bağlanır ve satılamaz niteliktedir. Otopark, depo, dükkân gibi ekonomik değeri olan alanların ise kime tahsis edileceği sözleşmede açıkça belirtilmelidir. Özellikle kapalı otopark ve zemin dükkânlar değer taşıdığından, bunların paylaşım dışı bırakılmaması gerekir. Ortak alan ve eklentilerin tahsisi netleştirilmeden yapılan anlaşmalar, teslimde çekişme doğurur."}, {"c": "katkarsiligi", "q": "Kat karşılığı vermeden önce arsa değerlemesi şart mı?", "a": "Kesinlikle. Bağımsız bir değerleme yapılmadan verilen paylaşım oranı, çoğu zaman arsa sahibinin aleyhine olur. Değerleme; arsanın konumunu, imar hakkını, bölgedeki satış fiyatlarını ve yapılabilecek toplam değeri ortaya koyar. Bu rakam, müteahhitle pazarlıkta elinizi güçlendirir ve adil oranı görmenizi sağlar. <b>Meridyen Yapı<\/b>, kat karşılığı görüşmelerine bölge analizi ve şeffaf fizibilite hesabıyla başlar; mülk sahibinin bilinçli karar vermesini önemser."}, {"c": "katkarsiligi", "q": "Birden fazla hissedarı olan arsada kat karşılığı nasıl yapılır?", "a": "Hisseli (paylı) arsada kat karşılığı sözleşmesinin geçerli olması için kural olarak tüm hissedarların onayı ve imzası gerekir. Bir hissedarın bile karşı çıkması süreci kilitleyebilir. Bu nedenle görüşmelere başlamadan önce tüm paydaşların mutabakatını yazılı olarak almak gerekir. Anlaşmazlık hâlinde ortaklığın giderilmesi (izale-i şuyu) davası gündeme gelebilir. Hangi hissedara hangi dairenin düşeceği, sözleşmede paylarla orantılı ve isim isim belirtilmelidir."}, {"c": "proje", "q": "Mimari proje çizdirmek ne kadar sürer?", "a": "Mimari proje süresi yapının büyüklüğüne ve karmaşıklığına göre değişir. Tek katlı bir villa için avan projeden uygulama projesine kadar genellikle <b>4-8 hafta<\/b> yeterlidir. Çok katlı bina veya karma projelerde bu süre <b>2-4 aya<\/b> uzayabilir. Süreç; ihtiyaç programı, avan proje, revizyonlar, kesin proje ve belediye onayı aşamalarından oluşur. Zemin etüdü ve ruhsat bürokrasisi de takvime eklenmelidir. Erken karar veren mülk sahiplerinde revizyon süresi belirgin şekilde kısalır."}, {"c": "proje", "q": "Avan proje ile uygulama projesi arasındaki fark nedir?", "a": "<b>Avan proje<\/b>, yapının genel fikrini gösteren ön tasarımdır; kütle, kat planları, cephe ve yerleşim kararlarını içerir ancak imalat detayı barındırmaz. <b>Uygulama projesi<\/b> ise sahada birebir üretim için hazırlanan, ölçülendirilmiş, sistem detayları ve nokta detayları çözülmüş nihai projedir.<br>Kısaca:<ul><li>Avan: konsept ve onay için<\/li><li>Uygulama: imalat ve şantiye için<\/li><\/ul>Avan onaylanmadan uygulamaya geçilmesi, sonradan pahalı revizyonlara yol açabilir."}, {"c": "proje", "q": "Statik betonarme proje neden bu kadar önemli?", "a": "Statik proje, yapının taşıyıcı sistemini boyutlandıran ve deprem güvenliğini belirleyen mühendislik çalışmasıdır. Türkiye'de tüm hesaplar <b>TBDY 2018 Deprem Yönetmeliği<\/b> ve ilgili TS standartlarına göre yapılır. Kolon, kiriş, perde ve temel kesitleri, donatı miktarı ve beton sınıfı bu projede tanımlanır. Zemin etüdü verisi mutlaka girdi olarak kullanılır. Statik proje olmadan alınan hiçbir ruhsat geçerli değildir ve yapının can güvenliği garanti edilemez. Bu proje asla ekonomiden kısılacak kalem değildir."}, {"c": "proje", "q": "Mekanik ve elektrik projeleri neleri kapsar?", "a": "Bunlar yapının tesisat altyapısını çözen mühendislik projeleridir.<br><b>Mekanik proje:<\/b><ul><li>Sıhhi tesisat (temiz-pis su)<\/li><li>Isıtma-soğutma ve havalandırma<\/li><li>Doğalgaz ve yangın tesisatı<\/li><\/ul><b>Elektrik proje:<\/b><ul><li>Kuvvetli akım (aydınlatma, priz, pano)<\/li><li>Zayıf akım (data, güvenlik, yangın algılama)<\/li><li>Topraklama ve yıldırımdan korunma<\/li><\/ul>Bu projeler mimari ile koordineli hazırlanmazsa sahada çakışmalar ve maliyet artışı kaçınılmazdır."}, {"c": "proje", "q": "Ruhsat için hangi proje seti gerekiyor?", "a": "Yapı ruhsatı için belediyeye eksiksiz bir proje seti sunulur. Bu set genellikle şunları içerir:<ul><li>Mimari proje<\/li><li>Statik (betonarme) proje ve zemin etüt raporu<\/li><li>Mekanik tesisat projesi<\/li><li>Elektrik tesisat projesi<\/li><li>Enerji kimlik belgesi ön hesabı<\/li><\/ul>Ayrıca aplikasyon krokisi, imar durumu ve gerekli müellif taahhütnameleri istenir. Tüm projeler ilgili meslek odalarına kayıtlı müellifler tarafından imzalanmalıdır; eksik set ruhsat sürecini uzatır."}, {"c": "proje", "q": "Mimarla nasıl çalışılır ve ücreti nasıl belirlenir?", "a": "Mimarla çalışma bir <b>ihtiyaç programıyla<\/b> başlar; beklentiler, bütçe ve arsa koşulları netleştirilir. Ücret genellikle inşaat alanı üzerinden metrekare bedeli veya toplam yatırımın yüzdesi olarak belirlenir; proje karmaşıklığı ve hizmet kapsamı fiyatı etkiler. Sözleşmede teslim edilecek pafta seti, revizyon sayısı ve telif hakları mutlaka yazılı olmalıdır. Şeffaf bir sözleşme, ilerleyen aşamalarda anlaşmazlığı önler. Meridyen Yapı, kapsamı baştan net tanımlanmış proje sözleşmeleriyle çalışır."}, {"c": "proje", "q": "Konsept ve fonksiyon tasarımı ne anlama gelir?", "a": "Konsept tasarım, projenin karakterini ve mimari dilini belirleyen fikir aşamasıdır; kütle, ışık, malzeme atmosferi ve mekân kurgusu burada şekillenir. <b>Fonksiyon tasarımı<\/b> ise mekânların birbirine bağlanışını, sirkülasyonu ve günlük kullanım verimliliğini çözer. İyi bir plan; kuzey-güney yönlenmesini, ıslak hacim gruplamasını ve ölü alanların minimize edilmesini gözetir. Konsept ile fonksiyon dengelenmezse ya güzel ama kullanışsız ya da işlevsel ama ruhsuz mekânlar ortaya çıkar."}, {"c": "proje", "q": "3D görselleştirme ve render neden yaptırılmalı?", "a": "3D render, henüz inşa edilmemiş yapının gerçekçi görsellerini üreterek kararları inşaat öncesinde vermenizi sağlar. Malzeme, renk, ışık ve mobilya seçimlerini ekranda görüp değiştirmek, sahada yapılacak pahalı değişikliklerin önüne geçer.<br>Faydaları:<ul><li>Mekân algısını net anlama<\/li><li>Malzeme ve renk kararlarını erken verme<\/li><li>Sürprizsiz sonuç<\/li><\/ul>Render bir lüks değil, risk azaltan bir yatırımdır; özellikle villa ve özel konut projelerinde beklentiyi gerçekle buluşturur."}, {"c": "proje", "q": "Proje revizyon süreci nasıl işler?", "a": "Revizyon, mülk sahibinin geri bildirimleri doğrultusunda projenin güncellenmesidir ve tasarımın doğal bir parçasıdır. Sağlıklı süreç; avan aşamada 2-3 revizyon turuyla ana kararların kilitlenmesini öngörür. Uygulama projesine geçildikten sonra yapılan büyük değişiklikler statik, mekanik ve elektrik projelerini de etkiler ve maliyeti artırır. Bu nedenle en kritik kararlar erken alınmalıdır. Sözleşmede revizyon sayısı ve kapsamının belirtilmesi, hem müellifi hem mülk sahibini korur."}, {"c": "proje", "q": "Enerji kimlik belgesi (EKB) zorunlu mu?", "a": "Evet, <b>BEP Yönetmeliği<\/b> gereği yeni yapılarda Enerji Kimlik Belgesi zorunludur ve iskân için gereklidir. Belge, binanın yıllık enerji tüketimini ve karbon salımını hesaplayarak <b>A'dan G'ye<\/b> bir sınıf verir; A en verimli seviyedir. Yeni binaların en az C sınıfında olması beklenir. Isı yalıtımı, pencere performansı ve tesisat verimliliği bu sınıfı doğrudan etkiler. EKB yalnızca resmi bir zorunluluk değil, düşük fatura ve yüksek konfor anlamına gelen bir kalite göstergesidir."}, {"c": "proje", "q": "BIM nedir ve inşaatta ne işe yarar?", "a": "BIM (Yapı Bilgi Modellemesi), yapının üç boyutlu ve veri açısından zengin dijital ikizini oluşturma yöntemidir. Mimari, statik ve tesisat modelleri tek ortamda birleştirilir; böylece <b>çakışma tespiti<\/b> sahaya çıkmadan yapılır.<br>Sağladıkları:<ul><li>Disiplinler arası koordinasyon<\/li><li>Otomatik metraj ve maliyet<\/li><li>Daha az saha hatası ve rework<\/li><\/ul>Özellikle büyük ve karmaşık projelerde BIM, zaman ve maliyet kaybını ciddi biçimde azaltarak öngörülebilir bir süreç sunar."}, {"c": "proje", "q": "Proje onayı belediyede ne kadar sürer?", "a": "Proje onay süresi belediyeye, projenin eksiksizliğine ve imar durumunun netliğine göre değişir. Dosya tam ve projeler yönetmeliğe uygunsa onay genellikle birkaç haftada sonuçlanır. Ancak imar tereddütleri, eksik evrak veya kurum görüşü gereken durumlar süreci uzatır. Bazı bölgelerde yapı denetim kuruluşu ve ilgili idarelerin görüşleri de gerekir. Deneyimli bir müellifle çalışmak, dosyanın ilk seferde kabul görme olasılığını artırarak zaman kaybını en aza indirir."}, {"c": "proje", "q": "Tip proje mi özel tasarım mı tercih etmeliyim?", "a": "<b>Tip proje<\/b> hazır ve tekrarlanabilir bir çözümdür; hızlı ve ekonomiktir ama arsanın yönü, eğimi ve manzarasını tam kullanamayabilir. <b>Özel tasarım<\/b> ise araziye, yaşam tarzınıza ve bütçenize göre sıfırdan kurgulanır.<ul><li>Tip proje: standart parseller, hız ve ekonomi<\/li><li>Özel tasarım: özgün arsalar, kişiselleştirme, değer artışı<\/li><\/ul>Manzaralı, eğimli veya düzensiz parsellerde özel tasarım genellikle hem konfor hem de yeniden satış değeri açısından kazandırır."}, {"c": "proje", "q": "İyi bir plan çözümünde nelere dikkat edilir?", "a": "İyi bir plan; verimli sirkülasyon, doğru yönlenme ve mekânların mantıklı gruplanmasıyla ölçülür. Dikkat edilecek başlıklar:<ul><li>Islak hacimlerin (banyo, mutfak) tesisat açısından yakınlığı<\/li><li>Yaşam alanlarının güney-batı, yatak odalarının doğu yönlenmesi<\/li><li>Ölü koridorların ve geçiş kayıplarının azaltılması<\/li><li>Doğal ışık ve çapraz havalandırma<\/li><\/ul>Metrekareyi büyütmek değil, her metrekareyi işlevli kılmak esastır. İyi plan, aynı alanda çok daha yaşanabilir bir ev üretir."}, {"c": "proje", "q": "Peyzaj projesi ne zaman devreye girmeli?", "a": "Peyzaj projesi, mimari projeyle eş zamanlı ilerlerse en verimli sonucu verir. Erken planlama; drenaj, istinat, otopark, yürüyüş aksları ve bitki köklerinin altyapıya zarar vermemesi gibi konuların baştan çözülmesini sağlar. Sonradan eklenen peyzaj çoğu zaman sınırlı ve pahalı olur.<br>Kapsamı:<ul><li>Sert zemin ve yürüyüş yolları<\/li><li>Bitkilendirme ve otomatik sulama<\/li><li>Aydınlatma ve su öğeleri<\/li><\/ul>Bahçe, yapının değerini ve yaşam kalitesini doğrudan yükselten bir tasarım alanıdır."}, {"c": "proje", "q": "Zemin etüdü yaptırmak şart mı?", "a": "Evet, zemin etüdü hem yasal olarak hem mühendislik açısından zorunludur. Sondaj ve laboratuvar deneyleriyle zeminin taşıma gücü, oturma davranışı ve deprem sırasındaki sıvılaşma riski belirlenir. Bu veriler statik projenin ve temel tipinin (radye, sürekli temel, kazık) doğru seçilmesi için girdidir. Etüt yaptırmadan tasarlanan temel ya güvensiz ya da gereksiz maliyetli olur. Sağlam bir yapı, görünmeyen ama en kritik adım olan doğru zemin verisiyle başlar."}, {"c": "proje", "q": "İmar durumu belgesi ne işe yarar?", "a": "İmar durumu (imar çapı), parselinizde <b>ne yapabileceğinizi<\/b> resmi olarak tanımlayan belgedir. Şunları içerir:<ul><li>Kat adedi ve bina yüksekliği<\/li><li>TAKS ve KAKS (taban ve toplam inşaat hakkı)<\/li><li>Çekme mesafeleri ve yapı yaklaşma sınırları<\/li><\/ul>Proje bu sınırlara göre kurgulanır; imara aykırı tasarım ruhsat alamaz. Arsa alırken bile imar durumunu görmek şarttır, çünkü aynı büyüklükteki iki arsanın inşaat hakkı çok farklı olabilir ve bu doğrudan yatırım değerini belirler."}, {"c": "proje", "q": "Yapı denetim firması ne yapar, kim seçer?", "a": "Yapı denetim kuruluşu, inşaatın projeye ve yönetmeliklere uygun yapıldığını bağımsız olarak denetleyen resmi bir mekanizmadır. Beton dökümü, demir donatı, yalıtım gibi kritik imalatları yerinde kontrol eder ve numune alır. Firma, ilgili idare tarafından havuz sisteminden atanır; böylece tarafsızlık sağlanır. Ücreti yapı sahibi öder ancak denetçi yükleniciden bağımsızdır. İyi işleyen bir yapı denetimi, mülk sahibinin gözü kulağı olarak kalite ve can güvenliğinin en önemli güvencesidir."}, {"c": "proje", "q": "Kentsel dönüşümde proje süreci nasıl işler?", "a": "Kentsel dönüşüm, riskli yapının tespitiyle başlar. Süreç adımları:<ul><li>Riskli yapı tespit raporu ve tescili<\/li><li>Yıkım kararı ve maliklerin anlaşması<\/li><li>Yeni yapı için mimari ve mühendislik projeleri<\/li><li>Ruhsat, inşaat ve iskân<\/li><\/ul>Bu süreçte kira yardımı, vergi muafiyetleri ve düşük faizli kredi gibi devlet destekleri devreye girebilir. Deprem güvenliği kanıtlanmış, güncel yönetmeliğe uygun bir yapı elde etmek dönüşümün asıl kazanımıdır. Meridyen Yapı, dönüşüm sürecini baştan sona yönetir."}, {"c": "proje", "q": "Villa projesi ile apartman projesi arasında ne fark var?", "a": "Villa projesi tek aileye özel, arsayla iç içe ve kişiselleştirilebilir bir tasarım gerektirir; bahçe, teras ve manzara ilişkisi ön plandadır. Apartman projesi ise çok kullanıcılı olduğundan ortak alanlar, ses yalıtımı, otopark, asansör ve kaçış yolları gibi konular öne çıkar.<ul><li>Villa: mahremiyet, özgünlük, dış mekân<\/li><li>Apartman: verimlilik, ortak sistemler, tekrarlanabilir plan<\/li><\/ul>Her ikisi de kendi yönetmeliğine tabidir; villada esneklik, apartmanda ise kolektif konforun kurgusu belirleyicidir."}, {"c": "proje", "q": "Tadilat projesi çizdirmek gerekir mi?", "a": "Basit boya-badana ve yüzey yenilemede proje gerekmez; ancak taşıyıcı sisteme, cepheye veya bağımsız bölüm sayısına dokunan her değişiklikte proje ve ruhsat şarttır. Kolon-kiriş kesmek, duvar kaldırmak veya balkon kapatmak mutlaka bir mühendis değerlendirmesi ister. Ruhsatsız yapılan taşıyıcı müdahaleler hem yasal sorun hem de ciddi deprem riski yaratır. Kapsamlı tadilatlarda önce mevcut durumun rölövesi çıkarılır, ardından tadilat projesi hazırlanır. Yapının güvenliği asla estetik bir tercihe feda edilmemelidir."}, {"c": "proje", "q": "Aynı projeyi farklı arsada kullanabilir miyim?", "a": "Bir projeyi başka bir arsaya olduğu gibi taşımak çoğu zaman mümkün değildir. Her parselin imar durumu, yönü, eğimi ve zemini farklıdır; bu da mimari yerleşimi ve statik çözümü değiştirir. Ayrıca proje müellifinin <b>telif hakkı<\/b> vardır; izinsiz kullanım hukuki sorun doğurur. En doğrusu, beğendiğiniz konsepti yeni arsaya <b>uyarlamaktır<\/b>. Böylece hem tasarım dili korunur hem de yeni parselin fırsatları (manzara, güneş, eğim) doğru değerlendirilir. Kopyala-yapıştır proje, gizli maliyet demektir."}, {"c": "malzeme", "q": "Hangi beton sınıfı kullanılmalı: C25, C30 yoksa C35 mi?", "a": "Beton sınıfı, betonun 28 günlük basınç dayanımını gösterir ve statik proje belirler.<ul><li><b>C25/30:<\/b> düşük katlı, standart konutlarda alt sınır<\/li><li><b>C30/37:<\/b> çok katlı binalarda en yaygın tercih<\/li><li><b>C35/45:<\/b> yüksek yapılar, perde ve zorlu zeminler<\/li><\/ul>TBDY 2018 kapsamında betonarme yapılarda genellikle en az C30 önerilir. Sınıf keyfi seçilmez; mühendislik hesabına dayanır. Meridyen Yapı, dökülen her betonda sınıfı hazır beton irsaliyesi ve numune ile teyit eder."}, {"c": "malzeme", "q": "Nervürlü inşaat demiri neden düz demirden iyidir?", "a": "Nervürlü (yüzeyi çıkıntılı) donatı, beton içinde çok daha güçlü <b>aderans<\/b> yani kenetlenme sağlar; bu da yük altında donatının kaymasını önler. Türkiye'de betonarmede standart olarak <b>B420C veya B500C<\/b> sınıfı nervürlü çelik kullanılır; buradaki C, deprem için gerekli yüksek sünekliği ifade eder. Düz demir bugün taşıyıcıda kullanılmaz. Demirin sınıfı, çapı ve yerleşimi statik projeye birebir uygun olmalıdır. Doğru donatı, deprem anında yapının kırılmadan enerji yutmasını sağlar."}, {"c": "malzeme", "q": "Duvar için tuğla mı, gazbeton mu, bims mi seçmeliyim?", "a": "Üçü de dolgu duvar malzemesidir, farkları öne çıkar:<ul><li><b>Tuğla (delikli):<\/b> ekonomik, sağlam, yaygın; ısı yalıtımı orta<\/li><li><b>Gazbeton:<\/b> hafif, kesmesi kolay, iyi ısı ve yangın performansı<\/li><li><b>Bims (pomza):<\/b> hafif, iyi ısı-ses yalıtımı, deprem yükünü azaltır<\/li><\/ul>Hafif malzemeler binanın toplam ağırlığını düşürerek deprem açısından avantaj sağlar. Seçim; iklim, bütçe ve yalıtım hedefine göre yapılmalı, tek başına değil mantolamayla birlikte değerlendirilmelidir."}, {"c": "malzeme", "q": "Dış cephe mantolaması gerçekten gerekli mi?", "a": "Evet. Mantolama, dış cepheye uygulanan ısı yalıtım sistemidir ve BEP Yönetmeliği hedeflerine ulaşmanın temel yoludur.<br>Faydaları:<ul><li>Isıtma-soğutma faturasında ciddi tasarruf<\/li><li>Yoğuşma ve küf oluşumunun önlenmesi<\/li><li>Duvar yüzeyinde eşit sıcaklık, yüksek konfor<\/li><\/ul>EPS, XPS veya taş yünü levhalar iklime göre seçilir; taş yünü yangın dayanımı yüksektir. Yalıtım kalınlığı ısı hesabıyla belirlenir. Doğru uygulanan mantolama, kendini birkaç yılda amorti eden bir yatırımdır."}, {"c": "malzeme", "q": "Su yalıtımı en çok nerelerde kritik?", "a": "Su yalıtımı, yapıyı en çok yıpratan etkene karşı korumadır ve şu bölgelerde hayatidir:<ul><li>Temel ve bodrum perdeleri (zemin suyuna karşı)<\/li><li>Çatı ve teraslar<\/li><li>Islak hacimler (banyo, mutfak, balkon)<\/li><\/ul>Malzeme olarak membran, sürme esaslı çimentolu veya likit yalıtım kullanılır ve detay çözümü uygulamanın kendisi kadar önemlidir. Su yalıtımındaki bir hata; demir korozyonu, küf ve betonda kılcal çatlaklara yol açarak yapı ömrünü kısaltır. Sonradan onarımı, baştan yapmaktan çok daha pahalıdır."}, {"c": "malzeme", "q": "Ses yalıtımı için hangi çözümler kullanılıyor?", "a": "Ses yalıtımı; hava kaynaklı (konuşma, TV) ve darbe kaynaklı (adım, taşınma) gürültüye karşı ayrı çözümler ister.<ul><li>Katlar arası: şap altı darbe ses yalıtım şiltesi<\/li><li>Bölme duvarlar: çift kat alçıpan + taş yünü dolgu<\/li><li>Kapı-pencere: sızdırmaz fitil ve çift cam<\/li><\/ul>Kütle, boşluk ve esneklik üçlüsü doğru kurgulanmalıdır. Özellikle apartman ve otel projelerinde ses yalıtımı yaşam kalitesini doğrudan belirler; ucuza kaçılan bir yalıtım, sonradan telafisi güç bir konfor kaybına dönüşür."}, {"c": "malzeme", "q": "Çatı sistemi olarak hangisini seçmeliyim?", "a": "Çatı seçimi iklim, eğim ve estetiğe göre yapılır.<ul><li><b>Kiremit çatı:<\/b> geleneksel, dayanıklı, iyi görünüm; eğimli yapılar için<\/li><li><b>Metal (sandviç panel):<\/b> hafif, hızlı, geniş açıklıklar<\/li><li><b>Teras (düz) çatı:<\/b> modern; güçlü su yalıtımı ve eğim şarttır<\/li><\/ul>Her çatıda su yalıtımı, buhar dengesi ve havalandırma birlikte çözülmelidir. Kar yükü ve rüzgâr bölgenize göre taşıyıcı boyutlandırılır. İyi bir çatı, yalnızca örtü değil; yalıtım, drenaj ve detayın bütünüdür."}, {"c": "malzeme", "q": "Cephe kaplaması için hangi malzeme daha avantajlı?", "a": "Cephe hem estetiği hem dayanıklılığı belirler:<ul><li><b>Boyalı sıva (mantolama üstü):<\/b> ekonomik, yaygın, bakım ister<\/li><li><b>Doğal taş / seramik:<\/b> prestijli, dayanıklı, maliyetli<\/li><li><b>Kompozit panel (ACP):<\/b> modern, hızlı; yangın sınıfına dikkat<\/li><li><b>Tuğla / klinker:<\/b> zamansız, bakımı düşük<\/li><\/ul>Seçimde iklim, bakım maliyeti ve yangın performansı birlikte değerlendirilmelidir. Cephe malzemesi görünüşün ötesinde binayı hava koşullarından koruyan bir kabuktur; kalitesiz ürün kısa sürede solar ve dökülür."}, {"c": "malzeme", "q": "Isıcam ve low-e cam arasındaki fark nedir?", "a": "<b>Isıcam<\/b>, iki cam arasında hava veya gaz boşluğu bulunan yalıtım camıdır; ısı ve ses kaybını azaltır. <b>Low-e cam<\/b> ise yüzeyine uygulanan görünmez metalik kaplamayla ısı ışınımını yansıtır; kışın içerideki ısıyı tutar, yazın güneş ısısını dışarıda bırakır.<br>Performans için:<ul><li>Argon gaz dolgusu ısı yalıtımını artırır<\/li><li>Warm-edge ara çıta yoğuşmayı azaltır<\/li><\/ul>Low-e'li ısıcam, enerji kimlik belgesi sınıfını ve konforu belirgin biçimde yükseltir; pencere, binanın en zayıf ısı noktasıdır."}, {"c": "malzeme", "q": "Kaba yapı malzemeleri nelerden oluşur?", "a": "Kaba yapı, binanın iskeletini ve kabuğunu oluşturan aşamadır. Başlıca malzemeler:<ul><li>Hazır beton (belgeli, doğru sınıfta)<\/li><li>Nervürlü inşaat demiri ve etriye<\/li><li>Kalıp malzemesi (kontrplak, metal)<\/li><li>Dolgu duvar (tuğla, gazbeton, bims)<\/li><li>Çimento, kum, agrega<\/li><\/ul>Bu malzemelerin kalitesi doğrudan yapının güvenliğini belirler ve sonradan değiştirilemez. Kaba yapıda kaliteden kısmak, görünmeyen ama en tehlikeli hatadır. Meridyen Yapı, kaba yapıda yalnızca standartlara uygun, belgeli malzeme kullanır."}, {"c": "malzeme", "q": "İnce yapı malzemelerinde nelere dikkat etmeliyim?", "a": "İnce yapı, yaşadığınız yüzeylerin ve kullandığınız donanımın kalitesidir.<ul><li><b>Seramik/porselen:<\/b> aşınma sınıfına (PEI) ve su emme oranına bakın<\/li><li><b>Parke:<\/b> laminat AC sınıfı, masif ise ahşap türü önemli<\/li><li><b>Boya:<\/b> silinebilir, düşük VOC'lu ürünler tercih edilmeli<\/li><li><b>Kapı:<\/b> yalıtım, kilit ve yangın dayanımı<\/li><\/ul>İnce yapı günlük konforu ve estetiği belirlediği için doğru sınıf seçimi ömür boyu fark yaratır. Ucuz ürün kısa sürede yıpranır ve toplam maliyeti artırır."}, {"c": "malzeme", "q": "Malzeme markası ve kalitesini nasıl seçmeliyim?", "a": "Marka seçiminde reklamdan çok <b>belgeye<\/b> bakılmalıdır. Kriterler:<ul><li>CE işareti ve TSE belgesi<\/li><li>Ürün teknik föyü ve performans beyanı<\/li><li>Garanti süresi ve yedek parça sürekliliği<\/li><\/ul>Aynı işlevde farklı fiyat sınıfları olabilir; önemli olan projeye uygun doğru sınıfı seçmektir, en pahalısı değil. Kritik malzemelerde (beton, demir, yalıtım) asla tanımsız üründen alışveriş yapılmaz. Doğru marka; performans, süreklilik ve garanti demektir. Kalite, ucuz olanın değil, doğru olanın seçimidir."}, {"c": "malzeme", "q": "Sürdürülebilir yeşil malzeme kullanmak mantıklı mı?", "a": "Evet, yeşil malzeme hem çevre hem uzun vadeli maliyet açısından mantıklıdır. Öne çıkan seçenekler:<ul><li>Yüksek geri dönüşüm içerikli çelik ve cam<\/li><li>Düşük VOC'lu boya ve yapıştırıcılar<\/li><li>Yüksek performanslı yalıtım (enerji tasarrufu)<\/li><li>Yerel ve az işlenmiş doğal malzemeler<\/li><\/ul>Sürdürülebilir malzeme, düşük fatura ve sağlıklı iç hava kalitesi olarak geri döner. EKB sınıfını yükseltir ve yapının yeniden satış değerini artırır. Yeşil yaklaşım artık bir moda değil, akıllı bir yatırım stratejisidir."}, {"c": "malzeme", "q": "Şantiyede malzeme kabulü ve kalite kontrolü nasıl yapılır?", "a": "Malzeme kabulü, sahaya gelen her ürünün projeye ve standarda uygunluğunun denetlenmesidir. Süreç:<ul><li>İrsaliye ve sertifika kontrolü (beton irsaliyesi, demir sertifikası)<\/li><li>Görsel muayene ve ölçü teyidi<\/li><li>Numune alma (beton küpü, demir çekme deneyi)<\/li><li>Uygunsuz malzemenin reddi<\/li><\/ul>Beton dökümünde slump deneyi ve numune alımı zorunludur. Bu kontroller yapı denetimi ile birlikte yürütülür. Kalite kontrol kayıt altına alınır; belgesiz malzeme asla yapıya girmez. Denetim, güvenin sözü değil, ispatıdır."}, {"c": "malzeme", "q": "Sahte veya kalitesiz malzeme riskini nasıl önlerim?", "a": "Sahte malzeme, can güvenliğini tehdit eden en sinsi risktir. Korunma yolları:<ul><li>Yalnızca yetkili bayi ve belgeli üreticiden alım<\/li><li>Sertifika, seri numarası ve CE işareti doğrulaması<\/li><li>Kritik ürünlerde bağımsız laboratuvar testi<\/li><li>Fiyatı olağandışı düşük tekliflerden kaçınma<\/li><\/ul>Özellikle demir, beton ve yalıtımda taklit ürün, deprem anında yapıyı doğrudan tehlikeye atar. Şeffaf tedarik zinciri ve kayıtlı süreç şarttır. Meridyen Yapı, tedarik ettiği her malzemenin belgesini izlenebilir biçimde saklar."}, {"c": "malzeme", "q": "Beton dökümünde slump ve kür neden önemli?", "a": "<b>Slump (çökme) deneyi<\/b>, taze betonun kıvamını yani işlenebilirliğini ölçer; çok sulu beton dayanımı düşürür, çok kuru beton yerleşmez. Doğru kıvam, boşluksuz ve homojen bir döküm sağlar. <b>Kür<\/b> ise dökülen betonun ilk günlerde nemli tutularak dayanım kazanmasıdır.<br>Kür ihmal edilirse:<ul><li>Yüzeyde çatlaklar oluşur<\/li><li>Hedeflenen dayanıma ulaşılamaz<\/li><\/ul>Beton, dökülmesiyle değil doğru kür edilmesiyle güç kazanır. Bu ayrıntılar görünmez ama yapı ömrünün temelini oluşturur."}, {"c": "malzeme", "q": "XPS ile EPS yalıtım levhası arasındaki fark nedir?", "a": "İkisi de köpük esaslı ısı yalıtım malzemesidir ama kullanım yerleri farklıdır.<ul><li><b>EPS (beyaz köpük):<\/b> ekonomik, hafif; genellikle dış cephe mantolamasında<\/li><li><b>XPS (mavi/pembe köpük):<\/b> yüksek basınç dayanımı ve düşük su emme; temel, bodrum, teras ve zemin altında<\/li><\/ul>Su ve yük altında kalan yerlerde XPS tercih edilir; nemli ortamda EPS performans kaybeder. Yangın gereken cephelerde ise taş yünü öne çıkar. Doğru yalıtım, malzemenin markasından çok doğru yere doğru ürünü koymakla ilgilidir."}, {"c": "malzeme", "q": "Islak hacimlerde hangi malzemeler tercih edilmeli?", "a": "Banyo, mutfak ve balkon gibi ıslak hacimlerde suya dayanım önceliklidir.<ul><li>Zemin ve duvar: düşük su emmeli porselen/seramik<\/li><li>Yüzey altı: sürme su yalıtımı (çimentolu membran)<\/li><li>Derz: su geçirmez, küflenmeye dirençli derz dolgusu<\/li><li>Zemin: kaymayı önleyen (R sınıfı) yüzey<\/li><\/ul>Islak hacimde asıl koruma, seramiğin altındaki görünmeyen su yalıtımıdır; yalnızca fayans su geçirmezlik sağlamaz. Bu detay atlanırsa alttaki katlara sızıntı ve küf kaçınılmaz olur. Doğru katman kurgusu, uzun ömürlü bir banyonun sırrıdır."}, {"c": "malzeme", "q": "Yapıştırıcı ve derz malzemesi seçimi neden önemli?", "a": "Seramik ve doğal taşta yapıştırıcı, kaplamanın ömrünü belirler.<ul><li>Yüzeye göre C1/C2 sınıfı çimento esaslı yapıştırıcı<\/li><li>Islak ve dış mekânda esnek (S sınıfı) yapıştırıcı<\/li><li>Büyük ebat karolarda tam temaslı sürüm<\/li><\/ul>Yanlış yapıştırıcı, karoların zamanla boşalmasına ve kabarmasına yol açar. Derzde ise su geçirmez ve renk haslığı yüksek ürün seçilmeli. Görünmeyen bu malzemeler, en pahalı seramiğin bile boşa gitmesini önler. Kaliteli kaplama, kaliteli altyapıyla anlam kazanır."}, {"c": "malzeme", "q": "Demir donatı paslanırsa yapıya ne olur?", "a": "Donatının paslanması (korozyon), betonarmenin en yavaş ama en yıkıcı hasarıdır. Paslanan demir hacimce genişler, betonu içeriden çatlatır ve <b>pas payını<\/b> kırarak dökülmelere yol açar. Bu süreç taşıyıcı kesiti zayıflatır ve deprem dayanımını düşürür. Nedeni genellikle yetersiz su yalıtımı, düşük beton kalitesi veya yetersiz pas payıdır.<br>Önlemler:<ul><li>Yeterli ve boşluksuz beton örtüsü<\/li><li>Doğru su yalıtımı<\/li><li>Belgeli, çatlaksız beton<\/li><\/ul>Görünmeyen demiri korumak, yapı ömrünü doğrudan uzatır."}, {"c": "deprem", "q": "Binam depreme dayanıklı mı, nasıl anlarım?", "a": "Kesin sonuç için yapılması gereken bir <b>deprem performans analizidir<\/b>. Bu süreçte binadan <b>karot numunesi<\/b> alınarak beton dayanımı, <b>röntgenle<\/b> demir donatısı ölçülür ve zemin sınıfı belirlenir. Sonuçlar <b>TBDY 2018<\/b> yönetmeliğine göre değerlendirilir.<br>Kolonlarda çatlak, kabuk atması veya bina kaçıklığı gibi belirtiler ilk uyarıdır. Meridyen Yapı, mevcut binanız için detaylı risk tespiti hizmeti sunar."}, {"c": "deprem", "q": "TBDY 2018 deprem yönetmeliği nedir, neyi değiştirdi?", "a": "<b>TBDY 2018 (Türkiye Bina Deprem Yönetmeliği)<\/b>, 1 Ocak 2019'da yürürlüğe giren güncel yapı tasarım standardıdır. Eski yönetmeliğe göre en büyük yenilik <b>performansa dayalı tasarım<\/b> anlayışı ve yeni <b>Türkiye Deprem Tehlike Haritası<\/b> ile parsel bazlı ivme değerleridir.<br>Ayrıca yüksek binalar için ayrı bölüm, zemin sınıfları ve süneklik düzeyleri detaylandırılmıştır. Yeni projeler bu yönetmeliğe uygun tasarlanmak zorundadır."}, {"c": "deprem", "q": "Deprem performans analizi nasıl yapılır?", "a": "Deprem performans analizi, mevcut binanın olası bir depremde nasıl davranacağını hesaplayan mühendislik çalışmasıdır. Aşamaları:<br><ul><li>Röleve ve mevcut proje tespiti<\/li><li>Karot ve donatı testleri<\/li><li>Zemin etüdü<\/li><li>Bilgisayar modeli (statik/dinamik) kurulması<\/li><\/ul>Sonuçta bina; <b>Kesintisiz Kullanım<\/b>, <b>Sınırlı Hasar<\/b>, <b>Kontrollü Hasar<\/b> ya da <b>Göçme Öncesi<\/b> gibi performans seviyelerine göre sınıflanır."}, {"c": "deprem", "q": "Karot testi nedir ve binaya zarar verir mi?", "a": "<b>Karot testi<\/b>, betonarme elemandan silindir şeklinde numune alınarak betonun gerçek basınç dayanımının (MPa) laboratuvarda ölçülmesidir. Genellikle kolonlardan, donatıya zarar vermeyecek noktalardan alınır.<br>Açılan delik özel tamir harcıyla kapatıldığından yapıya kalıcı zarar vermez. Bir binada güvenilir sonuç için birden fazla noktadan numune alınması, <b>TBDY 2018<\/b> gereğidir."}, {"c": "deprem", "q": "Yumuşak kat nedir, neden tehlikelidir?", "a": "<b>Yumuşak kat<\/b>, genellikle zemin katın dükkan veya otopark amacıyla bölme duvarsız, yüksek tavanlı ve boşluklu bırakılmasıyla oluşur. Bu kat üst katlara göre çok daha esnek olduğundan deprem enerjisi burada yoğunlaşır.<br>Sonuç, birçok yıkımda görülen <b>zemin kat göçmesidir<\/b>. Çözüm; perde duvar eklemek veya kolon güçlendirmesi yapmaktır. Meridyen Yapı, yumuşak kat riskini analizle tespit eder."}, {"c": "deprem", "q": "Kısa kolon nedir, depremde ne gibi hasar yapar?", "a": "<b>Kısa kolon<\/b>, bant pencere, yarım dolgu duvar veya kot farkı nedeniyle boyu kısalan ve rijitliği artan kolondur. Depremde yatay yükün büyük kısmı bu kısa kolona biner.<br>Sonuçta kolonda <b>X biçiminde kesme çatlakları<\/b> ve ani gevrek kırılma oluşur. Doğru tasarım ve gerektiğinde güçlendirme ile bu risk giderilir; mevcut binalarda kısa kolon tespiti kritik önemdedir."}, {"c": "deprem", "q": "Betonarme mi çelik yapı mı daha depreme dayanıklı?", "a": "İkisi de doğru tasarlandığında güvenlidir. <b>Çelik yapılar<\/b> sünek ve hafif olduğundan deprem enerjisini iyi yutar, hızlı montaj sağlar; ancak yangın ve korozyona karşı korunmalıdır.<br><b>Betonarme<\/b> ise rijit, ekonomik ve ülkemizde yaygındır; kalitesi beton sınıfı ve işçiliğe bağlıdır. Kritik olan sistemin değil; <b>TBDY 2018<\/b>'e uygun projelendirme, malzeme ve denetimin kalitesidir."}, {"c": "deprem", "q": "Radye temel mi tekil temel mi daha güvenli?", "a": "<b>Radye temel<\/b>, binanın tüm oturma alanını kaplayan tek parça betonarme plaktır; yükü zemine geniş yayar ve zayıf zeminlerde tercih edilir. <b>Tekil temel<\/b> ise her kolonun altında ayrı ayaklar oluşturur ve sağlam zeminlerde ekonomiktir.<br>Güvenlik zemin sınıfına göre değişir. Zemin etüdü sonucuna göre doğru temel tipini mühendis seçer; zayıf zeminde radye genellikle daha güvenlidir."}, {"c": "deprem", "q": "Zemin sınıfı nedir, binanın depreme dayanımını nasıl etkiler?", "a": "<b>Zemin sınıfı<\/b>, altımızdaki toprağın deprem dalgasını büyütme kapasitesini gösterir. TBDY 2018'de zeminler kaya (<b>ZA<\/b>) ile çok gevşek zemin (<b>ZE-ZF<\/b>) arasında sınıflanır.<br>Gevşek ve suya doygun zeminlerde deprem etkisi büyür, <b>sıvılaşma<\/b> riski artar. Bu nedenle her yeni projede parsel bazlı <b>zemin etüdü<\/b> zorunludur ve temel tasarımı bu sonuca göre yapılır."}, {"c": "deprem", "q": "Zemin-yapı etkileşimi ne demek?", "a": "<b>Zemin-yapı etkileşimi<\/b>, deprem sırasında binanın ve altındaki zeminin birbirini karşılıklı etkilemesidir. Sert zemin binayı adeta ankastre tutarken, yumuşak zemin salınıma ve dönmelere izin verir.<br>Bu etkileşim binanın periyodunu ve maruz kaldığı kuvvetleri değiştirir. Özellikle yüksek yapılarda ve zayıf zeminlerde detaylı analiz gerektirir; ihmal edilirse gerçek deprem davranışı yanlış hesaplanır."}, {"c": "deprem", "q": "Bina güçlendirme yöntemleri nelerdir?", "a": "Mevcut binalarda kullanılan başlıca güçlendirme yöntemleri:<br><ul><li><b>Betonarme perde duvar<\/b> eklenmesi<\/li><li>Kolonların <b>mantolama<\/b> (manto beton) ile kalınlaştırılması<\/li><li><b>Karbon fiber (CFRP)<\/b> ile sargılama<\/li><li>Çelik çaprazlar ve temel takviyesi<\/li><\/ul>Doğru yöntem, performans analizi sonucuna göre belirlenir. Güçlendirme çoğu zaman yıkıp yeniden yapmaktan ekonomik olabilir; Meridyen Yapı en uygun çözümü projelendirir."}, {"c": "deprem", "q": "Kolon mantolama nedir, ne işe yarar?", "a": "<b>Mantolama<\/b>, mevcut betonarme kolonun etrafına yeni donatı yerleştirilip beton dökülerek kesitinin büyütülmesidir. Böylece kolonun eksenel ve kesme taşıma kapasitesi ile sünekliği artar.<br>Özellikle beton dayanımı düşük veya donatısı yetersiz binalarda tercih edilir. İşlem binanın rijitliğini yükseltir; ancak tek başına yeterli olmayabilir ve genelde perde duvar takviyesiyle birlikte projelendirilir."}, {"c": "deprem", "q": "Deprem izolatörü (sismik yalıtım) nedir?", "a": "<b>Deprem izolatörü<\/b>, bina ile temeli arasına yerleştirilen esnek mesnetlerdir. Deprem sırasında zeminle bina arasındaki bağı yumuşatarak üst yapıya aktarılan enerjiyi büyük ölçüde azaltır.<br>Bina neredeyse rijit blok gibi hareket eder, iç hasar minimuma iner. Bu yüzden hastane, okul gibi <b>kesintisiz kullanılması gereken yapılarda<\/b> tercih edilir. Maliyeti yüksektir ancak deprem güvenliğini üst seviyeye taşır."}, {"c": "deprem", "q": "Beton ve demir testi neden önemli, hangi değerlere bakılır?", "a": "Bir binanın taşıyıcı gücü büyük ölçüde beton ve demirin kalitesine bağlıdır. Testlerde şunlara bakılır:<br><ul><li><b>Beton basınç dayanımı<\/b> (C sınıfı, MPa)<\/li><li><b>Donatı çapı, sayısı ve etriye aralığı<\/b><\/li><li>Pas payı ve korozyon durumu<\/li><\/ul>Eski binalarda düşük beton sınıfı ve yetersiz etriye sık görülür. Bu veriler olmadan güvenilir performans analizi yapılamaz."}, {"c": "deprem", "q": "Yapı denetim kanunu (4708) neyi zorunlu kılar?", "a": "<b>4708 sayılı Yapı Denetimi Hakkında Kanun<\/b>, ruhsata tabi yapıların bağımsız <b>yapı denetim kuruluşları<\/b> tarafından denetlenmesini zorunlu kılar. Amaç, can ve mal güvenliğini sağlayarak projeye ve yönetmeliğe aykırı imalatları önlemektir.<br>Denetim; proje kontrolü, malzeme testleri ve ruhsat eki aşamalar üzerinden yürür. Denetimsiz yapı ruhsatı ve iskânı alınamaz."}, {"c": "deprem", "q": "Yapı denetimi hangi aşamalarda kontrol yapar?", "a": "Yapı denetim kuruluşu inşaatı seviye seviye izler ve her aşamayı imzalar:<br><ul><li>Temel ve zemin (topraklama, radye/tekil)<\/li><li>Betonarme karkas (kolon, kiriş, döşeme)<\/li><li>Çatı ve dış cephe<\/li><li>Mekanik-elektrik tesisat<\/li><li>Bina bitiminde iskân uygunluğu<\/li><\/ul>Her seviyede beton ve demir numuneleri alınır. Aşama onaylanmadan bir sonraki imalata geçilemez; bu, denetimin can güvenliği için kritik olmasının nedenidir."}, {"c": "deprem", "q": "Yapı kimlik belgesi nedir?", "a": "<b>Yapı kimlik belgesi<\/b>, bir binanın taşıyıcı sistemini, kullanılan malzeme sınıflarını, proje müellifini, denetim ve ruhsat bilgilerini tek çatıda toplayan resmi kayıttır. Adeta binanın kimlik kartıdır.<br>Bu belge sayesinde binanın deprem yönetmeliğine uygunluğu, hangi yılda hangi standartla yapıldığı izlenebilir. Alım-satım ve risk değerlendirmesinde şeffaflık sağlar."}, {"c": "deprem", "q": "Kolon kiriş perde duvar arasındaki fark nedir?", "a": "Betonarme taşıyıcı sistemde her elemanın görevi farklıdır:<br><ul><li><b>Kolon:<\/b> Düşey yükü temele taşır<\/li><li><b>Kiriş:<\/b> Döşeme yükünü kolonlara aktarır, çerçeve oluşturur<\/li><li><b>Perde duvar:<\/b> Yatay deprem yükünü karşılayan geniş betonarme duvardır<\/li><\/ul>Deprem güvenliğinde asıl belirleyici <b>perde duvarlardır<\/b>; yeterli perde içeren binalar depremde çok daha az yer değiştirir ve hasar alır."}, {"c": "deprem", "q": "Mevcut bina risk tespiti nasıl yapılır, ücretli mi?", "a": "Risk tespiti, Bakanlıkça lisanslı kuruluşlarca yapılır. Binadan karot alınır, donatı taranır, zemin ve statik proje değerlendirilir; sonuç <b>6306 sayılı kanun<\/b> kapsamında raporlanır.<br>Rapor bedeli malik tarafından karşılanır, ancak <b>riskli<\/b> çıkan yapılarda dönüşüm süreci başlatılabilir. Bir malik tek başına başvurarak binası için risk tespiti yaptırabilir; komşuların onayı gerekmez."}, {"c": "deprem", "q": "Deprem güçlendirmesi mi yıkıp yeniden yapmak mı mantıklı?", "a": "Karar, performans analizi ve maliyet dengesine bağlıdır. Beton kalitesi makul ve hasarı sınırlı binalarda <b>güçlendirme<\/b>; hem daha ucuz hem daha hızlı olabilir ve oturma hakkı korunur.<br>Ancak beton sınıfı çok düşük, plan düzensiz veya kat karşılığı avantajı varsa <b>yıkıp yeniden yapmak<\/b> daha rasyoneldir. Meridyen Yapı, iki senaryoyu teknik ve finansal olarak karşılaştırıp size en doğru yolu önerir."}, {"c": "deprem", "q": "Röntgen (donatı tarama) testi ne gösterir?", "a": "Betonarme elemanın <b>röntgeni<\/b> yani <b>donatı tespiti<\/b>, tahribatsız cihazlarla (ferroscan) betonun içindeki demirlerin yerini, çapını, adedini ve <b>etriye (üzengi) sıklığını<\/b> gösterir.<br>Bu bilgi, elemanın gerçek kapasitesini hesaplamak için şarttır. Özellikle depremde önem taşıyan etriye aralığının yönetmeliğe uygun olup olmadığı bu yöntemle, betonu kırmadan belirlenir."}, {"c": "kentsel", "q": "6306 sayılı kanun kentsel dönüşüm nedir?", "a": "<b>6306 sayılı Afet Riski Altındaki Alanların Dönüştürülmesi Hakkında Kanun<\/b>, riskli yapı ve alanların yıkılıp deprem güvenli biçimde yeniden yapılmasını düzenler. 2012'de yürürlüğe girmiştir.<br>Kanun; risk tespiti, yıkım, kira yardımı, kredi ve vergi muafiyetleri gibi teşviklerle süreci kolaylaştırır. Amaç, ülke genelinde riskli yapı stokunu güvenli yapılarla değiştirmektir."}, {"c": "kentsel", "q": "Riskli yapı tespiti için nereye başvurulur?", "a": "Riskli yapı tespiti başvurusu, malikin Bakanlıkça <b>lisanslı bir kuruluşa<\/b> (üniversite, yapı denetim firması vb.) başvurmasıyla başlar. Tek bir malik dahi başvurabilir; diğer maliklerin izni gerekmez.<br>Kuruluş binayı inceleyip rapor hazırlar ve <b>Çevre, Şehircilik ve İklim Değişikliği Bakanlığı<\/b> müdürlüğüne iletir. Onaylanırsa yapı tapuya <b>riskli<\/b> şerhi ile işlenir ve süreç başlar."}, {"c": "kentsel", "q": "Kentsel dönüşümde 2/3 çoğunluk şartı nedir?", "a": "Riskli yapı olarak tescillenen binada kararlar, arsa payının <b>en az 2/3 (üçte iki) çoğunluğu<\/b> ile alınır. Bu oran müteahhit seçimi, proje ve paylaşım için geçerlidir.<br>2/3 çoğunlukla alınan karara katılmayan maliklerin hisseleri, Bakanlık gözetiminde açık artırmayla satılabilir. Yani tüm maliklerin oybirliği <b>zorunlu değildir<\/b>; bu düzenleme süreci hızlandırmak için getirilmiştir."}, {"c": "kentsel", "q": "Kentsel dönüşümde kira yardımı ne kadar, kaç ay verilir?", "a": "Riskli yapı yıkılıp yeniden yapılırken maliklere ve kiracılara <b>kira yardımı<\/b> ödenir. Tutar her yıl Bakanlıkça belirlenir ve bölgeye göre değişir; genellikle <b>18 ay<\/b> boyunca ödenir.<br>Malik kira yardımı yerine faiz destekli <b>dönüşüm kredisi<\/b>ni de tercih edebilir, ancak ikisi birlikte alınmaz. Başvuru, dönüşüm sürecinin başında ilgili müdürlüğe yapılır."}, {"c": "kentsel", "q": "Kentsel dönüşüm süreci adım adım nasıl işler?", "a": "Süreç genel olarak şu adımlarla ilerler:<br><ul><li>Riskli yapı tespiti ve rapor<\/li><li>Tapuya riskli şerhi ve tebligat<\/li><li>2/3 çoğunlukla müteahhit ve proje kararı<\/li><li>Tahliye, kira yardımı, yıkım<\/li><li>Yeni proje, ruhsat ve inşaat<\/li><li>İskan ve hak sahiplerine teslim<\/li><\/ul>Meridyen Yapı, risk tespitinden anahtar teslime kadar tüm dönüşüm sürecini tek elden yönetir."}, {"c": "kentsel", "q": "Kentsel dönüşümde yeni daireler nasıl paylaşılır?", "a": "Yeni yapıdaki daire dağıtımı <b>hak sahipliği<\/b> ilkesine dayanır. Her malikin payı, eski binadaki <b>arsa payı ve bağımsız bölüm büyüklüğü<\/b> esas alınarak belirlenir.<br>Genellikle maliklerin oybirliği veya 2/3 çoğunluk ile bir <b>paylaşım tablosu<\/b> hazırlanır; müteahhit payı da bu tabloda yer alır. Adil ve şeffaf dağıtım için değerleme ve avukat desteği önerilir."}, {"c": "kentsel", "q": "Kentsel dönüşüm kredisi ve faiz desteği nasıl alınır?", "a": "Riskli yapı sahibi malikler, anlaşmalı bankalardan <b>dönüşüm kredisi<\/b> kullanabilir ve devlet bu kredinin faizinin bir kısmını karşılar (<b>faiz desteği<\/b>). Bu, güçlendirme veya yeniden yapım için verilir.<br>Malik kira yardımı yerine bu desteği seçebilir. Kredi tutarı ve destek oranı Bakanlık tebliğleriyle güncellenir; başvuru, riskli yapı belgesiyle bankaya yapılır."}, {"c": "kentsel", "q": "Kentsel dönüşümde hangi vergi ve harç muafiyetleri var?", "a": "6306 sayılı kanun kapsamındaki dönüşümlerde önemli muafiyetler vardır:<br><ul><li>Tapu harcı muafiyeti<\/li><li>Noter, döner sermaye ve damga vergisi istisnaları<\/li><li>Belediye harçlarında indirim/muafiyet<\/li><\/ul>Bu istisnalar hem malikleri hem de projeyi yürüten tarafı kapsar ve dönüşüm maliyetini ciddi biçimde düşürür. Güncel kapsam için ilgili müdürlükten teyit alınmalıdır."}, {"c": "kentsel", "q": "Riskli yapıda yıkım kararı ve süreci nasıl işler?", "a": "Yapı <b>riskli<\/b> olarak kesinleşince maliklere tahliye için tebligat yapılır. İlk aşamada genellikle <b>60 gün<\/b>, gerekirse ek süre tanınır.<br>Süre sonunda tahliye edilmeyen bina, idari kararla ve gerekirse mülki amir marifetiyle yıktırılır. Yıkım öncesi elektrik, su, doğalgaz abonelikleri kapatılır. Amaç can güvenliği olduğundan riskli binada oturmaya devam etmek yasal olarak mümkün değildir."}, {"c": "kentsel", "q": "Kentsel dönüşümde anlaşmayan malik ne olur?", "a": "2/3 çoğunluk karar aldıktan sonra karara katılmayan malikin hissesi için süreç işler. Anlaşmayan malike teklif tebliğ edilir; kabul etmezse hissesi <b>Bakanlık gözetiminde açık artırma<\/b> ile diğer maliklere satılır.<br>Alıcı çıkmazsa hisseyi <b>Hazine<\/b> rayiç bedelle alabilir. Yani tek bir malik, çoğunluğun aldığı dönüşüm kararını süresiz engelleyemez; bu düzenleme dönüşümü hızlandırmak içindir."}, {"c": "kentsel", "q": "Belediye ve Çevre Şehircilik Bakanlığının dönüşümdeki rolü nedir?", "a": "<b>Çevre, Şehircilik ve İklim Değişikliği Bakanlığı<\/b>, kanunun uygulayıcısıdır; riskli yapı ve alan ilanı, kira yardımı, kredi ve denetim yetkisi ondadır. İl müdürlükleri süreci yürütür.<br><b>Belediye<\/b> ise imar planı, ruhsat, iskan ve altyapı süreçlerinden sorumludur. Bazı yetkiler belediyelere devredilebilir. İki kurum eşgüdümlü çalışır; malikler her iki kurumla da temas eder."}, {"c": "kentsel", "q": "Dönüşüm sırasında geçici konut/tahliye desteği var mı?", "a": "Evet. Riskli yapı yıkılırken malik ve kiracıya <b>kira yardımı<\/b> verilerek başka konutta oturmaları desteklenir. Bazı projelerde Bakanlık veya belediye <b>geçici barınma/rezerv konut<\/b> imkanı da sunabilir.<br>Kira yardımı genellikle 18 ay ödenir ve inşaat süresini kapsar. Böylece dönüşüm boyunca ailelerin barınma ihtiyacı güvence altına alınır; başvuru sürecin başında yapılmalıdır."}, {"c": "kentsel", "q": "Kentsel dönüşümde müteahhit nasıl seçilmeli?", "a": "Müteahhit seçimi dönüşümün en kritik adımıdır. Dikkat edilmesi gerekenler:<br><ul><li>Yapı müteahhitlik <b>yetki belgesi<\/b> ve sicili<\/li><li>Tamamlanmış referans projeler<\/li><li>Mali güç ve teminat (kat karşılığı sözleşme, ipotek/teminat)<\/li><li>Noter onaylı, net paylaşımlı sözleşme<\/li><\/ul>Sözlü vaatlere değil, yazılı taahhütlere güvenin. Meridyen Yapı, şeffaf sözleşme ve teminatlarla güvenli dönüşüm sunar."}, {"c": "kentsel", "q": "Rezerv yapı alanı nedir?", "a": "<b>Rezerv yapı alanı<\/b>, kentsel dönüşüm kapsamında hak sahiplerinin geçici veya kalıcı olarak yerleştirilebileceği, yeni yapılaşmaya ayrılmış alanlardır. Genellikle Hazine veya kamu arazileri üzerinde belirlenir.<br>Riskli alanların boşaltılıp güvenli biçimde dönüştürülebilmesi için bu alanlar bir tür <b>tampon bölge<\/b> işlevi görür. İlanı Bakanlık tarafından yapılır ve dönüşümün planlı ilerlemesini sağlar."}, {"c": "kentsel", "q": "Riskli yapı raporuna itiraz edilebilir mi?", "a": "Evet. Riskli yapı tespit raporu maliklere tebliğ edildikten sonra <b>15 gün<\/b> içinde ilgili müdürlüğe <b>itiraz<\/b> edilebilir. İtiraz, üniversite öğretim üyeleri ve uzmanlardan oluşan <b>teknik heyet<\/b> tarafından incelenir.<br>Heyet raporu haklı bulursa riskli şerhi kalkar; bulmazsa süreç devam eder. Bu hak, malikleri hatalı tespitlere karşı korur ve sürece hukuki güvence katar."}, {"c": "kentsel", "q": "Kat karşılığı sözleşmede nelere dikkat edilmeli?", "a": "Kat karşılığı inşaat sözleşmesi mutlaka <b>noterde düzenleme şeklinde<\/b> yapılmalıdır. Dikkat edilecekler:<br><ul><li>Net daire/paylaşım oranı ve bağımsız bölüm numaraları<\/li><li>Teslim süresi ve gecikme cezası<\/li><li>Teminat ve ipotek şartları<\/li><li>Malzeme ve imalat kalite listesi (mahal listesi)<\/li><\/ul>Belirsiz ifadeler ileride uyuşmazlık yaratır. Meridyen Yapı, hak sahiplerini koruyan şeffaf ve dengeli sözleşmeler hazırlar."}, {"c": "kentsel", "q": "Kentsel dönüşümün avantajları ve dezavantajları nelerdir?", "a": "Başlıca <b>avantajlar<\/b>: deprem güvenli yeni bina, değer artışı, kira yardımı, vergi/harç muafiyetleri ve modern konfor.<br>Başlıca <b>dezavantajlar<\/b>: inşaat süresince taşınma zorunluluğu, malikler arası anlaşmazlık riski ve müteahhit güvenilirliğine bağımlılık.<br>Doğru müteahhit ve sağlam sözleşme ile dezavantajların çoğu ortadan kalkar. Uzun vadede güvenlik ve değer kazancı bu süreci mülk sahipleri için avantajlı kılar."}, {"c": "kentsel", "q": "Riskli alan ile riskli yapı arasındaki fark nedir?", "a": "İki kavram farklıdır:<br><ul><li><b>Riskli yapı:<\/b> Tek bir binanın performans/risk tespiti sonucu riskli çıkmasıdır; malik bireysel başvurur.<\/li><li><b>Riskli alan:<\/b> Zemin veya yapılaşma nedeniyle bir bölgenin bütününün riskli ilan edilmesidir; kararı Bakanlık/Cumhurbaşkanı verir.<\/li><\/ul>Riskli alanda dönüşüm daha bütüncül planlanır. Her ikisi de 6306 sayılı kanun kapsamındadır ve teşviklerden yararlanır."}, {"c": "kentsel", "q": "Kentsel dönüşümde inşaat ne kadar sürer?", "a": "Süre; bina büyüklüğü, malikler arası anlaşma hızı ve ruhsat süreçlerine bağlıdır. Anlaşma ve yıkım sonrası inşaat genellikle <b>18 ila 24 ay<\/b> arası tamamlanır.<br>Kira yardımının çoğunlukla 18 ay verilmesi de bu hedefe dayanır. Süreci uzatan asıl unsur inşaat değil, malikler arası anlaşma ve proje onaylarıdır. Deneyimli bir müteahhit, planlamayı optimize ederek süreyi kısaltır."}, {"c": "kentsel", "q": "Kentsel dönüşümde muvafakat (onay) belgesi ne işe yarar?", "a": "<b>Muvafakatname<\/b>, maliklerin müteahhit, proje ve paylaşım kararına yazılı onay verdiği belgedir. 2/3 çoğunluğun sağlandığını resmileştirir ve ruhsat ile inşaat için hukuki dayanak oluşturur.<br>Genellikle noterde imzalanır ve daire dağıtım tablosuna atıf yapar. Muvafakat toplanmadan yıkım ve inşaat aşamasına geçilemez; bu belge, tarafların haklarını yazılı güvence altına alır."}, {"c": "tadilat", "q": "Komple daire tadilatı nereden başlanır ve hangi sırayla ilerlenir?", "a": "Komple renovasyon her zaman <b>keşif ve proje<\/b> ile başlar; yıkım, tesisat ve elektrik altyapısı, sıva-şap, ince işler (boya, seramik, dolap) ve son temizlik sırasıyla ilerler.<br><ul><li>Önce ıslak hacimler bitirilir<\/li><li>Sonra kuru mekanlar<\/li><li>En son beyaz eşya ve mobilya montajı<\/li><\/ul>Kaba işleri ince işlerden önce tamamlamak, sonradan sökme-takma maliyetini önler. Meridyen Yapı keşiften teslime tek elden yönetir."}, {"c": "tadilat", "q": "Daire tadilatı için ruhsat gerekir mi?", "a": "Boya, seramik, mutfak-banyo yenileme gibi <b>taşıyıcı sistemi etkilemeyen<\/b> işler için tadilat ruhsatı gerekmez. Ancak taşıyıcı duvara müdahale, cephe değişikliği, çatı formunun değişmesi veya bağımsız bölüm sayısının değişmesi ruhsat gerektirir. Emin değilseniz belediyeden yazılı görüş almak en güvenli yoldur; ruhsatsız yapılan taşıyıcı müdahaleler para cezası ve eski hale getirme yükümlülüğü doğurur."}, {"c": "tadilat", "q": "Banyo tadilatı ortalama kaç günde biter?", "a": "Standart bir banyo tadilatı, işin kapsamına göre genelde <b>10 ila 20 iş günü<\/b> arasında tamamlanır.<br><ul><li>Yıkım ve tesisat: 3-4 gün<\/li><li>Su yalıtımı ve şap: 2-3 gün (kuruma dahil)<\/li><li>Seramik ve fayans: 3-5 gün<\/li><li>Vitrifiye, batarya ve dolap montajı: 2-3 gün<\/li><\/ul>Su yalıtımının tam kurumasını beklemek, ilerideki su kaçaklarını önlemek için kritiktir."}, {"c": "tadilat", "q": "Mutfak tadilatında en çok neye dikkat etmeliyim?", "a": "Mutfakta öncelik <b>tesisat ve havalandırma<\/b> planıdır; su, gider ve elektrik hatları dolap yerleşimine göre baştan doğru konumlanmalıdır. Tezgah yüksekliği, aspiratör bacası ve priz sayısı ergonomiyi belirler. Nemli ortam için su geçirmez malzeme ve kaliteli menteşe seçin. Ankastre ölçüleri dolaptan önce netleşmezse sonradan pahalı düzeltmeler çıkar."}, {"c": "tadilat", "q": "Evdeki taşıyıcı kolonu ya da perde duvarı kaldırabilir miyim?", "a": "<b>Kesinlikle hayır.<\/b> Kolon, perde duvar ve kirişler binanın deprem yükünü taşır; bunlara müdahale tüm yapının güvenliğini tehlikeye atar ve yasaktır. Sadece taşıyıcı olmayan bölme (tuğla/gazbeton) duvarlar, statik onayla kaldırılabilir. Bir duvarın taşıyıcı olup olmadığını gözle anlamak riskli olduğu için mutlaka inşaat mühendisine tespit ettirin. Ruhsatsız taşıyıcı müdahale ağır cezalıdır."}, {"c": "tadilat", "q": "Taşıyıcı olmayan bir duvarı kaldırmak için izin şart mı?", "a": "Taşıyıcı olmayan bölme duvarlar teknik olarak kaldırılabilir, ancak yine de dikkat gerekir.<br><ul><li>Önce inşaat mühendisi duvarın taşıyıcı olmadığını teyit etmeli<\/li><li>Kat mülkiyetli binada projeye aykırılık varsa kat malikleri onayı gerekebilir<\/li><li>İçinden tesisat/kolon geçiyorsa ek çözüm gerekir<\/li><\/ul>Mühendis raporu olmadan yapılan yıkım, hem güvenlik hem hukuki risk taşır."}, {"c": "tadilat", "q": "Apartmanda tadilat yaptırırken yönetimden izin almak gerekir mi?", "a": "Daire içi işler için kural olarak yönetim izni gerekmez, fakat <b>ortak alanları<\/b> ve komşuları etkileyen durumlar farklıdır. Cephe, çatı, ortak tesisat, dış görünüm veya bağımsız bölüm birleştirme kat malikleri kararına bağlıdır. Ayrıca gürültülü işler için yönetim planındaki çalışma saatlerine uymak gerekir. Moloz taşıma ve asansör kullanımı için önceden yönetime haber vermek komşuluk sorunlarını azaltır."}, {"c": "tadilat", "q": "Ev tadilatı maliyeti neye göre değişir?", "a": "Tadilat maliyetini birkaç ana kalem belirler:<br><ul><li>Metrekare ve iş kapsamı (kısmi mi komple mi)<\/li><li>Malzeme kalitesi (ekonomik / orta / lüks segment)<\/li><li>Tesisat ve elektrik yenileme oranı<\/li><li>İşçilik ve şehir farkı<\/li><\/ul>Islak hacimler metrekare başına en pahalı bölgelerdir. Sağlıklı bütçe için detaylı keşif ve <b>kalem kalem sözleşme<\/b> şarttır; götürü rakamlar çoğu zaman sonradan sürprize döner."}, {"c": "tadilat", "q": "Tadilatta iç mimarla çalışmanın faydası nedir?", "a": "İç mimar; ölçü, ışık, malzeme ve ergonomiyi tek bir tasarım diliyle birleştirerek hem estetik hem işlevi optimize eder. Doğru kurgulanmış bir proje, uygulamada <b>hata ve malzeme israfını<\/b> azaltır, sonradan değişiklik maliyetini düşürür. Ayrıca renk, doku ve mobilya seçimlerini bütünsel yönetir. Özellikle küçük dairelerde iç mimarın alan çözümü, metrekareyi görünürde büyütür."}, {"c": "tadilat", "q": "Tadilat sözleşmesinde hangi maddeler mutlaka bulunmalı?", "a": "İyi bir tadilat sözleşmesi anlaşmazlığı baştan önler.<br><ul><li>İş kapsamı ve mahal listesi (nerede ne yapılacak)<\/li><li>Malzeme marka/model ve kalitesi<\/li><li>Toplam bedel ve ödeme planı (hakediş)<\/li><li>Başlangıç ve teslim tarihi, gecikme cezası<\/li><li>Garanti ve ayıplı iş şartları<\/li><\/ul>Sözlü anlaşmalar yerine yazılı, ekli keşif metrajıyla ilerleyin. Meridyen Yapı her işi kalem kalem sözleşmeyle taahhüt eder."}, {"c": "tadilat", "q": "Eski evin elektrik ve su tesisatını komple yenilemek şart mı?", "a": "20-30 yaşından eski binalarda tesisat ömrünü büyük ölçüde doldurmuştur; komple tadilat fırsatken <b>altyapıyı yenilemek<\/b> en doğru yatırımdır. Eski kolon hatları düşük kesitli olabilir, sigorta ve topraklama günümüz standardını karşılamayabilir. Su borularında kireçlenme ve kaçak riski yüksektir. Duvarlar açıkken yapılan yenileme, birkaç yıl sonra tekrar kırıp dökme maliyetinden çok daha ucuza gelir."}, {"c": "tadilat", "q": "Eski bina tadilatında en sık karşılaşılan sürprizler nelerdir?", "a": "Eski yapılarda yıkım başlayınca beklenmedik durumlar çıkabilir:<br><ul><li>Çürümüş veya yetersiz tesisat<\/li><li>Rutubet ve küf, gizli su kaçağı<\/li><li>Düzensiz kot farkları ve eğri zeminler<\/li><li>Asbest içeren eski malzemeler<\/li><li>Beklenenden zayıf sıva/şap<\/li><\/ul>Bu yüzden eski bina bütçesine <b>en az yüzde 10-15 pay<\/b> ayırmak akıllıcadır. Deneyimli ekip sürprizi baştan öngörüp planlar."}, {"c": "tadilat", "q": "Kiracıyım, evde tadilat yaptırmak için ne yapmalıyım?", "a": "Kiracı olarak boya gibi basit işleri yapabilseniz de, kalıcı değişiklikler için <b>ev sahibinin yazılı onayı<\/b> şarttır. Tesisat, duvar, mutfak gibi müdahaleler mülkün yapısını değiştirir ve izinsiz yapılırsa eski hale getirme talep edilebilir. Yaptığınız kalıcı iyileştirmelerin bedelini kimin karşılayacağını sözleşmeye yazın. En temizi, kapsamı ve masraf paylaşımını ev sahibiyle önceden netleştirmektir."}, {"c": "tadilat", "q": "Dükkan veya ofis tadilatında konuttan farklı olarak nelere dikkat edilir?", "a": "Ticari mekanlarda öncelik <b>yönetmelik ve ruhsat uyumudur<\/b>; yangın, acil çıkış, engelli erişimi ve havalandırma standartları denetlenir. İşyeri açma ruhsatı için tadilatın projeye uygun olması gerekir. Elektrik yükü, aydınlatma ve marka kimliğine uygun tasarım önemlidir. AVM veya iş merkezindeyseniz yönetimin tadilat kurallarına ve çalışma saatlerine uymak gecikmeleri önler."}, {"c": "tadilat", "q": "Tadilattan çıkan moloz ve hafriyat nasıl kaldırılır?", "a": "Moloz gelişigüzel atılamaz; belediyenin belirlediği <b>hafriyat döküm sahasına<\/b> ruhsatlı araçla taşınması gerekir.<br><ul><li>Küçük işlerde big-bag torba kullanılır<\/li><li>Büyük tadilatta konteyner kiralanır<\/li><li>Apartmanda ortak alanı ve asansörü kirletmemek için önlem alınır<\/li><\/ul>Kaçak moloz dökümü cezalıdır. Profesyonel firmalar taşıma ve döküm iznini iş kapsamına dahil eder, size süreç yükü bırakmaz."}, {"c": "tadilat", "q": "Çatı tadilatı ne zaman gereklidir ve neleri kapsar?", "a": "Su sızıntısı, kiremit kayması, kalkan duvar çatlağı veya yalıtım eksikliği çatı tadilatının işaretleridir. Kapsam genelde şudur:<br><ul><li>Kiremit sökümü ve çürük ahşap değişimi<\/li><li>Su yalıtım membranı serilmesi<\/li><li>Isı yalıtımı ve havalandırma düzenlemesi<\/li><li>Dere, olук ve ini borularının yenilenmesi<\/li><\/ul>Çatı ortak alan sayıldığından çok katlı binada <b>kat malikleri kararı<\/b> gerekir. Kışa girmeden yaptırmak en doğrusudur."}, {"c": "tadilat", "q": "Tadilat malzemesini kendim mi almalıyım yoksa firmaya mı bırakmalıyım?", "a": "İki yöntemin de artısı vardır. Malzemeyi kendiniz alırsanız kaliteyi doğrudan seçer ve fiyatı görürsünüz; ancak eksik-fazla, iade ve lojistik yükü sizde kalır. Firmaya bırakırsanız uyumlu ve zamanında tedarik sağlanır. En sağlıklı yol <b>karma modeldir<\/b>: seramik, batarya gibi görünür ürünleri siz seçin, teknik sarf malzemeyi firma tedarik etsin. Her koşulda marka ve model sözleşmede yazılı olmalı."}, {"c": "tadilat", "q": "Salon ve odaları birleştirmek için duvar açmak mümkün mü?", "a": "Mümkündür, ancak açılacak duvarın <b>taşıyıcı olup olmadığı<\/b> belirleyicidir. Bölme duvarsa, statik uygunluk teyit edilerek kaldırılabilir. Taşıyıcıysa, mühendis onaylı çelik kiriş takviyesiyle kısmi açıklık oluşturulabilir; bu bir mühendislik işidir, gelişigüzel yapılamaz. İçinden tesisat veya baca geçen duvarlarda ek çözüm gerekir. Açık planın avantajı ile yapı güvenliğini mutlaka uzman dengelemeli."}, {"c": "tadilat", "q": "Tadilat sırasında evde oturmaya devam edebilir miyim?", "a": "Kısmi işlerde oturmak mümkündür, fakat komple tadilatta tavsiye edilmez. Toz, gürültü, elektrik-su kesintileri ve güvenlik riski günlük yaşamı zorlaştırır. Özellikle <b>ıslak hacim ve tesisat<\/b> yenilenirken ev fiilen kullanılamaz. Mümkünse tadilat süresince başka yerde kalmak hem sağlık hem iş hızı açısından iyidir. Zorunluysa iş bir bölmeden başlatılıp mekan mekan ilerletilerek yaşanabilir alan korunur."}, {"c": "tadilat", "q": "Zemin döşemesi olarak parke, seramik ve laminat arasında nasıl seçim yapılır?", "a": "Seçim mekana ve kullanıma göre değişir:<br><ul><li><b>Seramik/porselen:<\/b> ıslak hacim ve mutfakta ideal, dayanıklı ve su geçirmez<\/li><li><b>Laminat:<\/b> ekonomik, hızlı döşenir, oda ve salonda pratik<\/li><li><b>Masif/lamine parke:<\/b> doğal görünüm ve konfor, ama neme hassas<\/li><\/ul>Yerden ısıtma varsa uyumlu ürün seçin. Trafiğin yoğun olduğu alanlarda aşınma sınıfı yüksek malzeme tercih edin."}, {"c": "tadilat", "q": "Tadilat işi bittiğinde teslim alırken nelere bakmalıyım?", "a": "Teslimde detaylı bir kontrol listesiyle ilerleyin:<br><ul><li>Su ve elektrik tesisatını fiilen test edin (kaçak, priz, tahliye)<\/li><li>Seramik derz, silikon ve boya bitişlerini yakından inceleyin<\/li><li>Kapı-pencere ve dolap kapaklarının ayarını deneyin<\/li><li>Eksik iş listesi (punch list) çıkarın<\/li><\/ul>Bakiye ödemeyi eksikler giderilmeden yapmayın ve <b>garanti belgelerini<\/b> yazılı alın. Sağlam firma teslimden sonra da arkasında durur."}, {"c": "ozel", "q": "Sıfırdan villa yaptırma süreci adım adım nasıl işler?", "a": "Villa inşaatı disiplinli bir sıra izler:<br><ul><li>Arsa ve zemin etüdü<\/li><li>Mimari, statik ve tesisat projeleri<\/li><li>Ruhsat alımı<\/li><li>Hafriyat ve temel<\/li><li>Kaba yapı (betonarme/çelik)<\/li><li>Çatı, cephe ve ince işler<\/li><li>İskan (yapı kullanma izni)<\/li><\/ul>Her aşama bir öncekinin onayına bağlıdır. Meridyen Yapı projeden iskana kadar tüm süreci <b>anahtar teslim<\/b> tek elden yürütür."}, {"c": "ozel", "q": "Fabrika veya endüstriyel yapı inşaatında çelik mi betonarme mi tercih edilmeli?", "a": "Geniş açıklık ve hızlı üretim gerektiren fabrikalarda genellikle <b>çelik yapı<\/b> öne çıkar; kolonsuz büyük hacimler ve hızlı montaj sağlar. Betonarme ise yangın direnci, kütle ve ağır yük taşıma isteyen tesislerde avantajlıdır. Karar; açıklık, kat sayısı, üretim yükü, teslim süresi ve bütçeye göre verilir. Doğru seçim için mutlaka statik mühendisiyle kullanım senaryosu netleştirilmelidir."}, {"c": "ozel", "q": "Prefabrik yapı ile betonarme yapı arasındaki temel farklar nelerdir?", "a": "İki sistemin öne çıkan farkları şöyledir:<br><ul><li><b>Prefabrik:<\/b> fabrikada üretilir, sahada hızlı kurulur, maliyeti öngörülebilir, ancak ömür ve yalıtımı sisteme bağlı<\/li><li><b>Betonarme:<\/b> yerinde dökülür, uzun ömürlü ve masif, tasarım esnekliği yüksek, fakat süresi daha uzun<\/li><\/ul>Geçici veya hızlı ihtiyaçlarda prefabrik, kalıcı ve çok katlı yapıda betonarme mantıklıdır. İkisi hibrit de kullanılabilir."}, {"c": "ozel", "q": "Çelik yapı sisteminin başlıca avantajları nelerdir?", "a": "Çelik konstrüksiyon modern inşaatta ciddi üstünlükler sunar:<br><ul><li>Hafiflik sayesinde deprem yükünde avantaj<\/li><li>Geniş kolonsuz açıklıklar<\/li><li>Fabrika üretimiyle yüksek hız ve hassasiyet<\/li><li>Geri dönüştürülebilir, sürdürülebilir malzeme<\/li><li>İleride sökme-ekleme kolaylığı<\/li><\/ul>Buna karşılık yangın ve korozyon koruması iyi detaylandırılmalıdır. Fabrika, hangar, spor salonu ve çok katlı ticari yapıda çelik sıkça tercih edilir."}, {"c": "ozel", "q": "Apartman veya çok katlı bina inşaatı süreci kaç aşamadan oluşur?", "a": "Çok katlı bina inşaatı ana hatlarıyla şu aşamaları izler:<br><ul><li>Projelendirme ve ruhsat<\/li><li>Hafriyat, iksa ve temel<\/li><li>Betonarme karkasın kat kat yükselmesi<\/li><li>Duvar, sıva, tesisat ve elektrik altyapısı<\/li><li>Cephe, çatı ve ince işler<\/li><li>Asansör, peyzaj ve iskan<\/li><\/ul>Kaba yapı ilerlerken alttan ince işler başlar; bu <b>fazların örtüşmesi<\/b> süreyi kısaltır. Kalite kontrol her katta tekrar edilmelidir."}, {"c": "ozel", "q": "İşyeri veya ticari yapı yaptırırken nelere özellikle dikkat etmek gerekir?", "a": "Ticari yapıda işlev ve mevzuat birlikte kurgulanır. Otopark, yükleme-boşaltma, müşteri akışı ve vitrin görünürlüğü tasarımı belirler. <b>Yangın yönetmeliği, engelli erişimi ve enerji verimliliği<\/b> zorunludur. Elektrik yükü ve altyapı, hedef sektöre göre boyutlandırılmalıdır. İşyeri açma ruhsatı gereklerini projeye baştan işlemek, sonradan pahalı revizyonları önler. Marka kimliğine uygun cephe, ticari değeri artırır."}, {"c": "ozel", "q": "İnşaat aşamalarının doğru sırası nedir?", "a": "Sağlam bir yapı, aşamaların doğru sırasıyla kurulur:<br><ul><li>Hafriyat ve zemin hazırlığı<\/li><li>Temel ve su yalıtımı<\/li><li>Kaba yapı: kolon, kiriş, döşeme<\/li><li>Çatı ve dış duvarlar<\/li><li>Tesisat ve elektrik altyapısı<\/li><li>İnce işler: sıva, boya, kaplama, montaj<\/li><\/ul>Kaba iş bitmeden ince işe geçmek, sonradan sökme ve kalite kaybı doğurur. Her fazın <b>onayı<\/b> alınmadan bir sonrakine geçilmez."}, {"c": "ozel", "q": "Şantiye yönetimi ve organizasyonu neden bu kadar önemlidir?", "a": "İyi şantiye yönetimi, projenin süre-maliyet-kalite dengesini korur. Malzeme tedariki, ekip koordinasyonu, iş programı ve hakediş takibi tek merkezden yürütülmezse gecikme ve israf kaçınılmazdır. <b>İş güvenliği, kalite kontrol ve denetim<\/b> günlük planın parçasıdır. Deneyimli şantiye şefi, taşeronlar arası iş akışını çakışmadan yönetir. Meridyen Yapı her projede tek muhatap sorumlu mühendisle şeffaf ilerler."}, {"c": "ozel", "q": "İnşaatta iş güvenliği (İSG) için hangi önlemler zorunludur?", "a": "İSG, yasal zorunluluk ve insani sorumluluktur.<br><ul><li>Kişisel koruyucu donanım (baret, ayakkabı, emniyet kemeri)<\/li><li>İskele ve yüksekte çalışma güvenliği<\/li><li>Kenar, boşluk ve düşme korumaları<\/li><li>Elektrik ve makine güvenliği<\/li><li>İş güvenliği uzmanı gözetimi ve eğitim<\/li><\/ul>Kaza riski en çok yüksekten düşme ve elektrikte yoğunlaşır. Kurallara uymayan şantiye hem hukuki hem etik olarak <b>kabul edilemez<\/b>."}, {"c": "ozel", "q": "Bir villa inşaatı ortalama ne kadar sürede tamamlanır?", "a": "Ortalama bir müstakil villa, zemin ve hava koşulları uygunsa genellikle <b>8 ila 14 ay<\/b> arasında tamamlanır. Süreyi belirleyen ana etkenler; büyüklük, kat sayısı, yapı sistemi (betonarme/çelik), malzeme kalitesi ve ruhsat süreçleridir. Kışın beton ve dış işler yavaşlar. Gerçekçi bir iş programı, aşamaları örtüştürerek süreyi optimize eder; abartılı kısa vaatler çoğu zaman kalite pahasına verilir."}, {"c": "ozel", "q": "Anahtar teslim inşaat tam olarak ne anlama gelir?", "a": "Anahtar teslim; projeden ruhsata, kaba yapıdan ince işlere ve son temizliğe kadar tüm sürecin <b>tek firma sorumluluğunda<\/b> yürütülüp binanın kullanıma hazır teslim edilmesidir. İşveren tek muhatapla çalışır, taşeron koordinasyonuyla uğraşmaz. Kapsam sözleşmede net tanımlanmalıdır; hangi malzeme, hangi standart dahil belirtilmelidir. Bu model, sorumluluk dağılmadığı için hem hız hem kalite kontrolü açısından avantajlıdır."}, {"c": "ozel", "q": "İskan (yapı kullanma izni) nedir ve sonrasında ne yapılır?", "a": "İskan, binanın ruhsat ve projesine uygun tamamlandığını belgeleyen resmi <b>yapı kullanma iznidir<\/b>. Alınmadan bina yasal olarak kullanıma hazır sayılmaz. İskan sonrası:<br><ul><li>Abonelikler (elektrik, su, doğalgaz) daimi hale getirilir<\/li><li>Kat mülkiyeti tapusu çıkarılır<\/li><li>Emlak vergisi ve sigorta düzenlenir<\/li><\/ul>İskansız yapıda satış ve kredi süreçleri zorlaşır; bu yüzden iskan mutlaka takip edilmelidir."}, {"c": "ozel", "q": "Yeni yapılan binada garanti ve bakım süreci nasıl işler?", "a": "Kaliteli müteahhit teslimden sonra da sorumluluğunu sürdürür. Yapı ve imalatlar için <b>yazılı garanti<\/b> verilmeli; gizli ayıplar için yasal sorumluluk süreleri işler. İlk yıl genelde küçük ayarlar (kapı-pencere, silikon, boya rötuşu) gerekebilir. Tesisat, çatı ve yalıtım periyodik bakımla uzun ömürlü olur. Garanti kapsamının ne olduğunu sözleşmeye net yazdırın; sözlü vaatler teslimden sonra bağlayıcı olmaz."}, {"c": "ozel", "q": "İnşaat sözleşmesi imzalamadan önce hangi kontrol listesine bakmalıyım?", "a": "Sözleşme öncesi şu maddeleri mutlaka doğrulayın:<br><ul><li>Firmanın referans ve bitmiş projeleri<\/li><li>Kapsam, mahal listesi ve malzeme standartları<\/li><li>Toplam bedel, ödeme/hakediş planı<\/li><li>Süre, gecikme cezası ve teslim koşulları<\/li><li>Ruhsat, sigorta ve İSG sorumlulukları<\/li><li>Garanti ve ayıplı iş şartları<\/li><\/ul>Belirsiz götürü rakamlardan kaçının. Detaylı ve <b>ekli keşif metrajlı<\/b> bir sözleşme, ileride en büyük korumanızdır."}, {"c": "ozel", "q": "İnşaat yaptıranların en sık yaptığı hatalar nelerdir?", "a": "Sahada en çok tekrarlanan hatalar şunlardır:<br><ul><li>Zemin etüdünü hafife almak<\/li><li>Yetersiz veya belirsiz sözleşme<\/li><li>Sadece en ucuz teklifi seçmek<\/li><li>Proje netleşmeden inşaata başlamak<\/li><li>Yalıtım ve tesisat altyapısından kısmak<\/li><\/ul>Sonradan yapılan değişiklikler en pahalı kalemdir. Doğru proje, sağlam sözleşme ve deneyimli ekip; başlangıçta biraz daha maliyet gibi görünse de toplamda <b>çok daha ekonomiktir<\/b>."}, {"c": "ozel", "q": "Zemin etüdü neden yapılır ve atlanırsa ne olur?", "a": "Zemin etüdü, arsanın taşıma gücünü, su durumunu ve deprem davranışını ölçerek <b>temel tasarımının<\/b> temelini oluşturur. Atlanırsa temel yanlış boyutlandırılır; oturma, çatlama ve deprem riski artar. Zayıf zeminde iyileştirme (kazık, jet-grout) gerekebilir ve bu ancak etütle belirlenir. Ruhsat için de zorunludur. Etütten kaçınmak kısa vadede tasarruf gibi görünse de, en pahalı ve tehlikeli tasarruftur."}, {"c": "ozel", "q": "Kat karşılığı inşaat modeli nasıl çalışır?", "a": "Kat karşılığında arsa sahibi arsasını verir, müteahhit binayı yapar ve karşılığında anlaşılan oranda bağımsız bölüm alır. Kritik nokta <b>paylaşım oranı<\/b> ve teslim şartlarının net sözleşmeye bağlanmasıdır.<br><ul><li>Hangi daireler kime kalacak<\/li><li>Malzeme standardı ve teslim tarihi<\/li><li>Gecikme ve iskan sorumluluğu<\/li><\/ul>Tapu ve noter süreçleri titiz yürütülmelidir. Güvenilir müteahhit seçimi bu modelde her şeyden önemlidir."}, {"c": "ozel", "q": "Betonun kür (bakım) süreci neden önemlidir?", "a": "Beton döküldükten sonra hedef dayanımına ulaşması için <b>nemli tutularak kür<\/b> edilmesi gerekir. Erken kuruyan veya donan beton çatlar ve mukavemetini kaybeder. Özellikle sıcak ve rüzgarlı havada sulama, örtme ya da kür malzemesi şarttır; soğukta ise donmaya karşı önlem alınır. Betonun ilk günlerdeki bakımı, binanın tüm ömrü boyunca taşıyıcı gücünü belirler. Bu yüzden asla ihmal edilmemelidir."}, {"c": "ozel", "q": "Prefabrik yapı hangi durumlarda daha mantıklı bir tercihtir?", "a": "Prefabrik; hız, taşınabilirlik ve öngörülebilir maliyet gerektiren durumlarda öne çıkar.<br><ul><li>Şantiye ofisi ve geçici yapılar<\/li><li>Depo, atölye ve hafif sanayi<\/li><li>Kısa sürede kurulması gereken tesisler<\/li><li>Uzak veya zorlu arazi koşulları<\/li><\/ul>Fabrikada üretildiği için hava koşullarından az etkilenir ve montajı hızlıdır. Kalıcı, çok katlı ve prestijli konut projelerinde ise genelde betonarme veya çelik tercih edilir."}, {"c": "ozel", "q": "Yapı denetim firması ne iş yapar ve zorunlu mudur?", "a": "Yapı denetim, inşaatın projeye, ruhsata ve yönetmeliklere uygun ilerlediğini bağımsız olarak <b>denetleyen resmi kuruluştur<\/b>. Belirlenen kapsamdaki yapılarda yasal olarak zorunludur. Temel, demir, beton ve her kritik aşamada kontrol yapar, uygunsuzlukta işi durdurabilir. Bu denetim, yapı güvenliği ve iskan süreci için güvence sağlar. Denetim raporları saklanmalı; ileride satış ve sigortada belge olarak işe yarar."}, {"c": "ozel", "q": "Güvenilir bir inşaat firması nasıl seçilir?", "a": "Doğru müteahhit seçimi projenin kaderini belirler. Şu ölçütlere bakın:<br><ul><li>Bitmiş referans projeleri ve saha ziyareti<\/li><li>Ticari geçmiş, sicil ve mali güç<\/li><li>Şeffaf, kalem kalem sözleşme ve keşif<\/li><li>Sorumlu mühendis ve tek muhatap yapısı<\/li><li>İSG ve kalite kontrol kültürü<\/li><\/ul>Sadece en düşük teklife değil, <b>toplam güvenilirliğe<\/b> odaklanın. Meridyen Yapı referansları, şeffaf sözleşmesi ve tek elden yönetimiyle keşiften iskana kadar arkasında durur."}];
let FAQ_DATA=FAQ_DEFAULT.map(function(o){return {c:o.c,q:o.q,a:o.a};});
const MENU_EN={hizmetler:'Services',nedenBiz:'Why ? Us',projeler:'Projects',ilanlar:'Listings',bolge:'Regional Intelligence',giris:'Sign In',teklif:'Free Survey'};
const FOOT_EN={desc:'A corporate construction, renovation and real-estate development company building with trust since 1986.',colKurumsal:'Corporate',colHizmetler:'Services',colIletisim:'Contact'};
const DOCK_EN=['Services','Projects','Why Us','WhatsApp'], DOCK_TR=['Hizmetler','Projeler','Neden Biz','WhatsApp'];
const PUB_KEY='meridyen_pub_v1';
function _brandEsc(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return{'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});}
function _brandSubst(s){try{s=String(s==null?'':s);var nm=(typeof BRAND!=='undefined')?BRAND:{};var full=(nm.name||'Meridyen')+(nm.name2||' Yapı');var S=(typeof SETTINGS!=='undefined')?SETTINGS:{};if(S.firmaUnvan)s=s.replace(/Meridyen Yapı İnşaat A\.Ş\./g,S.firmaUnvan);s=s.replace(/Meridyen Yapı/g,full);if(S.firmaEmail)s=s.replace(/[A-Za-z]+@meridyenyapi\.com/g,S.firmaEmail);return s;}catch(e){return String(s==null?'':s);}}
function publishConfig(){
  try{ localStorage.setItem(PUB_KEY, JSON.stringify({
    BRAND:BRAND, MENU:MENU, FOOT:FOOT, I18N:(typeof I18N!=='undefined'?I18N:null),
    SEO:{title:SETTINGS.metaTitle,desc:SETTINGS.metaDesc,ga:SETTINGS.googleAnalytics,gsv:SETTINGS.googleSiteVerif,wa:SETTINGS.waNumber},
    ADS:(typeof ADS!=='undefined'?ADS:null),
    SOCIAL:(typeof SOCIAL!=='undefined'?SOCIAL:null),
    CONTACT:{tel:SETTINGS.firmaTel,email:SETTINGS.firmaEmail,adres:SETTINGS.firmaAdres,wa:SETTINGS.waNumber,calisma:SETTINGS.firmaCalisma},
    THEME:{accent:SETTINGS.tenantAccent||'',font:SETTINGS.tenantFont||''},
    at:Date.now()
  })); }catch(e){}
}
function applyBrand(){
  try{
    var b=BRAND;
    var _bi=(function(){try{var iv=(b.initial!=null&&(''+b.initial).trim())?(''+b.initial).trim():((b.name||'M').trim()||'M');return iv.charAt(0).toLocaleUpperCase('tr');}catch(e){return 'M';}})();  /* WHITE-LABEL: logo harfi marka adından (M→D), sabit 'M' değil */
    document.querySelectorAll('.logo .mark, .lg .mark').forEach(function(mk){
      if(b.logo){mk.innerHTML='<img src="'+b.logo+'" alt="logo" style="width:100%;height:100%;object-fit:contain;border-radius:inherit">';mk.style.background='transparent';mk.style.boxShadow='none';}
      else{mk.innerHTML=_brandEsc(_bi);mk.style.background='';mk.style.boxShadow='';}
    });
    document.querySelectorAll('.js-logo').forEach(function(el){el.innerHTML=_brandEsc(b.name)+'<span class="lo2">'+_brandEsc(b.name2)+'</span>';});
    document.querySelectorAll('footer.insaatFooter .lo').forEach(function(lo){
      var fl=b.logoFooter||b.logo;
      if(fl){lo.innerHTML='<img src="'+fl+'" alt="logo" style="height:36px;max-width:190px;object-fit:contain;display:block">';}
      else{lo.innerHTML=_brandEsc(b.name)+'<span class="lo2">'+_brandEsc(b.name2)+'</span>';}
    });
    if(b.favicon){var l=document.querySelector('link[rel="icon"]');if(!l){l=document.createElement('link');l.rel='icon';document.head.appendChild(l);}l.href=b.favicon;}
    /* WHITE-LABEL: favicon (harften üretilen) + Organization + görünür metin sweep'ini
       brand.js tek kaynaktan (PUB_KEY.BRAND) yeniden uygular — canlı yenile */
    try{if(window.insBrandRefresh)insBrandRefresh();}catch(e){}
  }catch(e){console.warn('applyBrand',e);}
}
function applyMenuText(){
  try{
    var en=(typeof LANG!=='undefined'&&LANG==='en');
    var M=en?Object.assign({},MENU,MENU_EN):MENU, F=en?Object.assign({},FOOT,FOOT_EN):FOOT, nz=function(s){return _brandEsc(s).replace('?','<span class="nb-x">?</span>');};
    document.querySelectorAll('.mdock a span').forEach(function(sp,i){var L=en?DOCK_EN:DOCK_TR;if(L[i])sp.textContent=L[i];});
    document.querySelectorAll('.fportals .fp-lead').forEach(function(el){el.textContent=en?'Our Listings':'İlanlarımız';});
    /* href-tabanlı eşleme (konum-bağımsız → yeni link eklenince kaymaz) */
    var _navMap=[['hizmetlerimiz.html',M.hizmetler,0],['neden-biz.html',M.nedenBiz,1],['projelerimiz.html',M.projeler,0],['ilanlar.html',M.ilanlar,0],['bolge.html',M.bolge,0]];
    function _labelNav(scope){ _navMap.forEach(function(row){ var a=scope.querySelector('a[href="'+row[0]+'"]'); if(!a)return; if(row[2])a.innerHTML=nz(row[1]); else a.textContent=row[1]; }); }
    document.querySelectorAll('.insaatNav').forEach(_labelNav);
    document.querySelectorAll('.insaatCta').forEach(function(c){var t=c.querySelector('.btn-primary');if(t)t.textContent=M.teklif;var g=c.querySelector('.js-giris');if(g)g.textContent=M.giris;});
    document.querySelectorAll('.insaatMnav').forEach(function(m){_labelNav(m);var g=m.querySelector('.js-giris');if(g)g.textContent=M.giris;var b=m.querySelector('.btn-primary');if(b)b.textContent=M.teklif;});
    document.querySelectorAll('.insaatFooter').forEach(function(f){
      var d=f.querySelector('.desc');if(d)d.textContent=F.desc;
      var h=f.querySelectorAll('.fgrid h4');if(h[0])h[0].textContent=F.colKurumsal;if(h[1])h[1].textContent=F.colHizmetler;if(h[2])h[2].textContent=F.colIletisim;
      var cols=f.querySelectorAll('.fgrid > div');if(cols[3]){var fa=cols[3].querySelector('a');if(fa)fa.innerHTML=F.adres;}
      /* HREF-TABANLI yeniden etiketleme (nav'daki _navMap kalıbı) — konum-indeksli dizi,
         araya yeni link (Harita/Emlak Ekspertizi) girince etiketleri kaydırıyordu. */
      var _footMap=[
        ['hakkimizda',en?'About Us':'Hakkımızda'],['vizyon-misyon.html',en?'Vision & Mission':'Vizyon & Misyon'],
        ['yonetim.html',en?'Management Team':'Yönetim Kadrosu'],['kalite.html',en?'Quality & Certificates':'Kalite & Sertifikalar'],
        ['#blog',en?'Blog & Guides':'Blog & Rehberler'],
        ['medya.html',en?'Media & Press':'Medya & Basında Biz'],['bolge-ekspertizi',en?'Regional Expertise':'Bölge Ekspertizi'],
        ['kariyer.html',en?'Careers':'Kariyer'],
        ['ilanlar.html?op=Sat',en?'For Sale':'Satılık İlanlar'],['ilanlar.html?op=Kir',en?'For Rent':'Kiralık İlanlar'],
        ['ozel-portfoy',en?'🔒 Private Portfolio':'🔒 Özel Portföy'],['bolge',en?'Regional Intelligence':'Bölge Zekası'],
        ['konut-insaat',en?'Residential Construction':'Konut İnşaatı'],['kentsel',en?'Urban Renewal':'Kentsel Dönüşüm'],
        ['anahtar',en?'Turnkey':'Anahtar Teslim'],
        ['harita.html',en?'Map':'Harita'],['emlak-ekspertizi.html',en?'Property Analysis':'Emlak Ekspertizi']
      ];
      [cols[1],cols[2]].forEach(function(col){ if(!col)return;
        col.querySelectorAll('a').forEach(function(a){
          var href=a.getAttribute('href')||'';
          if(/^ilanlar\.html$/.test(href)){a.textContent=en?'All Listings':'Tüm İlanlar';return;}
          for(var k=0;k<_footMap.length;k++){ if(href.indexOf(_footMap[k][0])>-1){a.textContent=_footMap[k][1];return;} }
          /* haritada olmayan linkler (özelleştirme) olduğu gibi bırakılır */
        });
      });
      f.querySelectorAll('.flegal a').forEach(function(a,i){var _lg=en?['GDPR','Privacy','Cookie Policy']:['KVKK','Gizlilik','Çerez Politikası'];if(_lg[i])a.textContent=_lg[i];});
      var _wa=cols[3]?cols[3].querySelector('a[href*="wa.me"]'):null;if(_wa)_wa.textContent=en?'💬 WhatsApp Line':'💬 WhatsApp Hattı';
      var tel=f.querySelector('a.js-tel');if(tel)tel.textContent=F.tel;
      var mail=f.querySelector('a[href^="mailto:"]');if(mail)mail.textContent=F.email;
      var fc=f.querySelector('.fcopy');if(fc&&fc.firstChild&&fc.firstChild.nodeType===3)fc.firstChild.textContent=F.copyright+' · ';
    });
  }catch(e){console.warn('applyMenuText',e);}
}
function _fmtStat(k,n){n=Number(n)||0;if(k==='alan')return (n/1e6).toFixed(1).replace('.',',')+'M m²';if(k==='konut')return n.toLocaleString('tr-TR')+'+';return n.toLocaleString('tr-TR');}
function applyStats(){try{var s=SETTINGS;var map={yil:s.statYil,konut:s.statKonut,proje:s.statProje,santiye:s.statSantiye,alan:s.statAlan};
  Object.keys(map).forEach(function(k){var val=map[k];if(val==null||val==='')return;
    document.querySelectorAll('[data-stat="'+k+'"]').forEach(function(el){
      if(el.hasAttribute('data-count')){el.setAttribute('data-count',val);if(el.classList.contains('in')||el.textContent!=='0')el.textContent=_fmtStat(k,val);}
      else if(el.classList.contains('y')){el.textContent=val;}
      else{el.textContent=_fmtStat(k,val);}
    });
  });
}catch(e){}}
function applyCerts(){try{var c=SETTINGS.certChips;if(!c||!c.length)return;document.querySelectorAll('.hp-trust').forEach(function(t){var lead=t.querySelector('.ht-lead');var h=lead?lead.outerHTML:'';h+=c.map(function(x){return '<span class="ht-chip">'+_brandEsc(x)+'</span>';}).join('');t.innerHTML=h;});}catch(e){}}
// ===== Harita gömme (OpenStreetMap — resmî embed, anahtar gerekmez, X-Frame engeli yok) =====
function _osmEmbedSrc(lat,lng){
  lat=+lat;lng=+lng;var d=0.0075;
  var bbox=(lng-d).toFixed(6)+','+(lat-d).toFixed(6)+','+(lng+d).toFixed(6)+','+(lat+d).toFixed(6);
  return 'https://www.openstreetmap.org/export/embed.html?bbox='+bbox+'&layer=mapnik&marker='+lat.toFixed(6)+','+lng.toFixed(6);
}
// container'a harita basar. mapQuery "enlem,boylam" ise anında; adres ise tek seferlik Nominatim geocode ile.
function _fillMapEmbed(cm,tagCls,mapQuery,addr){
  if(!cm)return;
  var esc=(typeof _brandEsc==='function')?_brandEsc:function(x){return String(x==null?'':x);};
  var lbl=String(addr||mapQuery||'Konum').split(',')[0]||'Konum';
  var put=function(lat,lng){
    var src=_osmEmbedSrc(lat,lng);
    var fr=cm.querySelector('iframe');
    if(fr){ if(fr.getAttribute('src')!==src)fr.setAttribute('src',src);
      var tg=cm.querySelector('.'+tagCls); if(tg)tg.innerHTML='📍 '+esc(lbl); }
    else cm.innerHTML='<div class="'+tagCls+'">📍 '+esc(lbl)+'</div>'
      +'<iframe title="Harita — '+esc(lbl)+'" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="'+src+'"></iframe>';
  };
  var ll=(typeof _parseLatLng==='function')?_parseLatLng(mapQuery):null;
  if(ll){ put(ll[0],ll[1]); return; }
  /* Nominatim serbest-metni sevmez ("No:5", "Cad.", "/") → normalize + aşamalı sorgu (tam → ilçe,il → il) */
  var _ng=function(a){return String(a||'').replace(/No[:.]?\s*\d+\w*/gi,'').replace(/\bKat\b[^,]*/gi,'').replace(/\bD[:.]?\s*\d+/gi,'')
    .replace(/\bCad\.?\b/gi,'Caddesi').replace(/\bCd\.?\b/gi,'Caddesi').replace(/\bMah\.?\b/gi,'Mahallesi').replace(/\bMh\.?\b/gi,'Mahallesi')
    .replace(/\bSok\.?\b/gi,'Sokak').replace(/\bSk\.?\b/gi,'Sokak').replace(/\bBul(v)?\.?\b/gi,'Bulvarı').replace(/\bBlv\.?\b/gi,'Bulvarı')
    .replace(/[\/]/g,',').replace(/\s+/g,' ').replace(/\s*,\s*/g,', ').replace(/(,\s*)+/g,', ').replace(/^[,\s]+|[,\s]+$/g,'').trim();};
  var norm=_ng(mapQuery||addr||'');
  var parts=norm.split(',').map(function(s){return s.trim();}).filter(Boolean);
  var cands=[]; if(norm)cands.push(norm); if(parts.length>=2)cands.push(parts.slice(-2).join(', ')); if(parts.length>=1)cands.push(parts[parts.length-1]);
  if(!cands.length)cands.push('İstanbul');
  var tryNext=function(i){
    if(i>=cands.length){ put(41.0812,29.0094); return; }
    fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=tr&accept-language=tr&q='+encodeURIComponent(cands[i]))
      .then(function(r){return r.json();})
      .then(function(a){ if(a&&a[0])put(+a[0].lat,+a[0].lon); else tryNext(i+1); })
      .catch(function(){ tryNext(i+1); });
  };
  tryNext(0);
}
function applyContactAll(){try{var s=SETTINGS;
  var wn=String(s.waNumber||'').replace(/[^0-9]/g,'')||'905001234567';
  document.querySelectorAll('a[href*="wa.me/"]').forEach(function(a){a.href=a.href.replace(/wa\.me\/\d+/,'wa.me/'+wn);});
  if(s.firmaAdres)document.querySelectorAll('.cinfo .js-adr').forEach(function(e){e.textContent=s.firmaAdres;});
  if(s.firmaEmail)document.querySelectorAll('.cinfo .js-mail').forEach(function(e){e.textContent=s.firmaEmail;});
  if(s.firmaTel)document.querySelectorAll('.cinfo .js-tel').forEach(function(e){e.textContent=s.firmaTel;});
  // Ana sayfa iletişim haritası — İletişim sayfasıyla aynı mapQuery kaynağından (OpenStreetMap, API anahtarı gerekmez)
  try{document.querySelectorAll('.cmap').forEach(function(cm){_fillMapEmbed(cm,'cmap-tag',s.mapQuery,s.firmaAdres);});}catch(em){}
  try{var FT=(typeof FOOT!=='undefined')?FOOT:{};
  if(FT.tel)document.querySelectorAll('.insaatFooter a.js-tel').forEach(function(a){a.href='tel:'+String(FT.tel).replace(/[^0-9+]/g,'');});
  if(FT.email)document.querySelectorAll('.insaatFooter a[href^="mailto:"]').forEach(function(a){a.href='mailto:'+FT.email;});}catch(e2){}
}catch(e){}}
function loadMenuUI(){
  var s=function(id,v){var e=document.getElementById(id);if(e)e.value=(v==null?'':v);};
  s('m_hizmetler',MENU.hizmetler);s('m_nedenBiz',MENU.nedenBiz);s('m_projeler',MENU.projeler);s('m_bolge',MENU.bolge);s('m_giris',MENU.giris);s('m_teklif',MENU.teklif);
  s('fo_desc',FOOT.desc);s('fo_k',FOOT.colKurumsal);s('fo_h',FOOT.colHizmetler);s('fo_i',FOOT.colIletisim);s('fo_adres',FOOT.adres);s('fo_tel',FOOT.tel);s('fo_email',FOOT.email);s('fo_copy',FOOT.copyright);
}
function _adsInjectNodes(html,target){var tmp=document.createElement('div');tmp.innerHTML=html;[].slice.call(tmp.childNodes).forEach(function(n){var el;if(n.tagName==='SCRIPT'){el=document.createElement('script');[].forEach.call(n.attributes,function(at){el.setAttribute(at.name,at.value);});el.text=n.textContent;}else{el=n;}if(el.setAttribute)el.setAttribute('data-ads','1');target.appendChild(el);});}
function applyAds(){if(!_insConsentOk())return;/* FAZ3C: pazarlama etiketi onaysız yüklenmez */
  try{
    document.querySelectorAll('[data-ads="1"]').forEach(function(n){n.remove();});
    var A=(typeof ADS!=='undefined')?ADS:{};
    if(A.head)_adsInjectNodes(A.head,document.head);
    if(A.body){var host=document.createElement('div');host.id='ads-body-host';host.setAttribute('data-ads','1');document.body.appendChild(host);_adsInjectNodes(A.body,host);}
  }catch(e){console.warn('applyAds',e);}
}
function loadAdsUI(){var h=document.getElementById('ads_head'),b=document.getElementById('ads_body');if(h)h.value=(ADS.head||'');if(b)b.value=(ADS.body||'');var ga=document.getElementById('ad_ga'),gs=document.getElementById('ad_gsv');if(ga)ga.value=(SETTINGS.googleAnalytics||'');if(gs)gs.value=(SETTINGS.googleSiteVerif||'');}
function _insConsentOk(){try{return localStorage.getItem('cookieChoice')==='accept';}catch(e){return false;}}/* FAZ3C: onay yoksa analitik/pazarlama YÜKLENMEZ (fail-closed) */
function applyGoogle(){try{if(!_insConsentOk())return;var ga=SETTINGS.googleAnalytics;if(!/^[A-Za-z0-9_-]{4,32}$/.test(''+ga))ga='';/* doğrulanmamış GA kimliği enjekte edilmez */if(ga&&!document.getElementById('saas-gtag')){var s=document.createElement('script');s.id='saas-gtag';s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ga;document.head.appendChild(s);var s2=document.createElement('script');s2.id='saas-gtag-init';s2.text='window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","'+ga+'");';document.head.appendChild(s2);}var gsv=SETTINGS.googleSiteVerif;if(gsv){var mv=document.querySelector('meta[name="google-site-verification"]');if(!mv){mv=document.createElement('meta');mv.name='google-site-verification';document.head.appendChild(mv);}mv.content=(''+gsv).replace(/^google-site-verification=/,'');}}catch(e){}}
function publishAds(){applyGoogle();applyAds();saveAll();var el=document.getElementById('saveToast');if(el)el.textContent='🚀 Google & Reklam yayınlandı';}
// ===== DİL (i18n) + İÇERİK DÜZENLEME MOTORU (kaynak-metin anahtar) =====
let LANG='tr'; try{LANG=localStorage.getItem('meridyen_lang')||'tr';}catch(e){}
let I18N={tr:{},en:{}};
const I18N_SKIP='#adminApp,.mnav,.mdock,header,footer,.hero-stats,.adm-side,.adm-main';
const I18N_SEL='section .eyebrow,section h1,section h2,section h3,section h4,section h5,.sec-head p,.about p,.lb-copy p,.cta-band p,.cta-band h2,.region-copy p,section .lead,section blockquote,.hero .cta a,.statsband .l,.lb-stats .l,.about .m,.steps .s-t,.steps .s-d,.why-card h4,.why-card p,.step h4,.step p,.formcard h3,.formcard .fhint,.hp-hero .eyebrow,.hp-hero h1,.hp-hero p,.hs-intro .hs-kick,.hs-intro h2,.hs-intro p,.hp-cta h3,.hp-cta p,.bzhero .bzh-eye,.bzhero h1,.bzhero p,.bz-sec>.sh,.bz-sec>.ss,.bz-power .lead,.bz-power .sub,.bz-cap .cap h5,.bz-cap .cap p,.bz-cta h3,.bz-cta p,.sd-hero h1,.pd-hero h1,.hp-trust .ht-lead,.hp-trust .ht-chip,.hs-service h2,.hs-service .hs-lead,.pp-hero .eyebrow,.pp-hero h1,.pp-hero p,.bzh-s span,.mi-row span,.catrow .cl,.mg-k,.mo-k,.mo-note,.sbrow>span,.rc .k,.gc h5,.gc .tag,.gcx span,.bz-strip .l,.bz-yrs span,.bz-trend2 .tt h4,.bz-trend2 .tt .big span,.rc .v small,.ppcard .ov,.ppcard .meta .m span,.ppcard .st,.ppcard .av,.ppcard .price,.ppcard .desc,.ppcard .meta .m b,.ppf,.sd-body h2,.sd-body h3,.sd-body p,.sd-body li,.pd-body h2,.pd-body h3,.pd-body p,.pd-status,.pd-loc,.ppcard .body h3,#iletisim .field label,#iletisim .kvkk label,#iletisim .fhint,#iletisim h3';
const _I18N_EN={
 "Meridyen Yapı · 1986'dan beri":"Meridyen Yapı · Since 1986",
 "Şehrin silüetini güvenle yeniden inşa ediyoruz":"We rebuild the city skyline — safely",
 "Şu An Sahada":"On Site Now",
 "Kurumsal":"Corporate",
 "Mühendislik disiplinini yaşanabilir mimariyle buluşturuyoruz":"We unite engineering discipline with livable architecture",
 "Hizmetlerimiz":"Our Services",
 "Fikirden teslime, uçtan uca yapı çözümleri":"From concept to delivery — end-to-end building solutions",
 "Mühendislik Hassasiyeti":"Engineering Precision",
 "Projelerimiz":"Our Projects",
 "Hayata geçirdiğimiz ve yükselen projeler":"Completed and rising projects",
 "Neden Meridyen Yapı?":"Why Meridyen Yapı?",
 "Güveni rastlantıya bırakmıyoruz":"We leave nothing about trust to chance",
 "Nasıl Çalışırız":"How We Work",
 "Arsadan teslime, 6 ölçülebilir aşama":"From land to delivery — 6 measurable stages",
 "Yatırım Perspektifi":"Investment Perspective",
 "Lansmandan teslime tahmini değer artışı":"Estimated value growth from launch to delivery",
 "Bölge Zekası · Veriyle Yatırım":"Regional Intelligence · Data-Driven Investment",
 "Her projemizin altında, bölgenin gerçek verisi var":"Beneath every project lies the region's real data",
 "Referanslar & İş Ortakları":"References & Partners",
 "Bize güvenen kurumlar":"Institutions that trust us",
 "Bilgi Merkezi":"Knowledge Center",
 "Sektörden haberler ve rehberler":"Industry news and guides",
 "Geleceğin şehirlerini birlikte inşa edelim":"Let's build the cities of the future together",
 "Mühendis, mimar ve saha ekibi pozisyonları için ekibimize katılın.":"Join our team for engineer, architect and field positions.",
 "İletişim & Teklif":"Contact & Quote",
 "Projenizi konuşalım":"Let's talk about your project",
 "Konut, ticari ve karma projelerde anahtar teslim mühendislik; kentsel dönüşüm, kat karşılığı ve tadilat hizmetlerinde 40 yıllık güven.":"Turnkey engineering for residential, commercial and mixed-use projects; 38 years of trust in urban renewal, land-for-flat and renovation services.",
 "Bu cümleyi okuduğunuz şu anda, ekibimiz 12 şantiyede üretim yapıyor.":"As you read this sentence, our team is producing on <span class='amber'>12 sites</span>.",
 "Meridyen Yapı; 1986'da temellerini attığı kurumsal kültürünü üç kuşaktır aynı titizlikle sürdüren bir yapı ve gayrimenkul geliştirme şirketidir. Arsa analizinden anahtar teslime kadar her aşamayı kendi mühendis kadromuzla yönetir; deprem güvenliği, malzeme kalitesi ve teslim takvimini taviz verilmez ilkeler olarak görürüz.":"Meridyen Yapı is a construction and real-estate development company that has carried the corporate culture it founded in 1986 with the same rigor for three generations. We manage every stage from land analysis to turnkey delivery with our own engineering staff; we treat earthquake safety, material quality and the delivery schedule as non-negotiable principles.",
 "Bugüne kadar 8.400'ün üzerinde konutu sahiplerine teslim ettik; her projede şeffaf süreç, denetlenebilir kalite ve uzun ömürlü değer ürettik.":"To date we have handed over more than 8,400 homes to their owners; in every project we delivered a transparent process, auditable quality and long-lasting value.",
 "Vizyon":"Vision",
 "Türkiye'nin en güvenilir yapı markası olmak.":"To be Turkey's most trusted construction brand.",
 "Misyon":"Mission",
 "Kaliteyi zamanında teslim ve şeffaflıkla buluşturmak.":"To unite quality with on-time delivery and transparency.",
 "Değerler":"Values",
 "Güven, dürüstlük, iş güvenliği, sürdürülebilirlik.":"Trust, integrity, occupational safety, sustainability.",
 "Her hizmet; ayrı proje yönetimi, kendi mühendis ekibi ve kalite kontrol süreciyle yürütülür.":"Every service is delivered with dedicated project management, its own engineering team and a quality-control process.",
 "Fikirden teslime,uçtan uca yapı çözümleri":"From concept to delivery — end-to-end building solutions",
 "Devam eden, tamamlanan ve planlanan projelerimizi keşfedin.":"Explore our ongoing, completed and planned projects.",
 "Her projede aynı standartları uygulayan, denetlenebilir bir kalite sistemi.":"An auditable quality system applying the same standards to every project.",
 "Deprem Güvenliği":"Earthquake Safety",
 "Mühendislik Kalitesi":"Engineering Quality",
 "Zamanında Teslim":"On-Time Delivery",
 "İş Sağlığı & Güvenliği":"Occupational Health & Safety",
 "Sürdürülebilirlik":"Sustainability",
 "Şeffaf Süreç":"Transparent Process",
 "Arsa & Fizibilite":"Land & Feasibility",
 "Mimari Tasarım":"Architectural Design",
 "Ruhsat & İzin":"Permits & Licensing",
 "İnşaat":"Construction",
 "Denetim & Kalite":"Inspection & Quality",
 "İskan & Teslim":"Occupancy & Handover",
 "İnşaat, tadilat, yatırım ve kentsel dönüşüm üzerine uzman içerikler.":"Expert content on construction, renovation, investment and urban renewal.",
 "Kat karşılığı inşaatta arsa sahibinin bilmesi gereken 7 madde":"7 things a landowner must know about land-for-flat construction",
 "Deprem güvenli bina nasıl anlaşılır? TBDY 2018 rehberi":"How to identify an earthquake-safe building? A TBDY 2018 guide",
 "Tadilatta bütçe nasıl yönetilir? Adım adım rehber":"How to manage a renovation budget? A step-by-step guide",
 "Ücretsiz keşif, fiyat teklifi, tadilat veya kat karşılığı görüşmesi için bize ulaşın.":"Contact us for a free site survey, price quote, renovation or land-for-flat discussion.",
 "Teklif Talebi Oluştur":"Request a Quote",
 "Aktif şantiye":"Active sites",
 "Sahada işçi / mühendis":"Workers / engineers on site",
 "Bu ay teslim edilen daire":"Units delivered this month",
 "Yıllık Tecrübe":"Years of Experience",
 "Teslim Edilen Konut":"Homes Delivered",
 "Tamamlanan Proje":"Completed Projects",
 "Aktif Şantiye":"Active Sites",
 "Toplam İnşa Alanı":"Total Built Area",
 "Konum analizi, zemin etüdü, imar ve yatırım fizibilitesi.":"Location analysis, geotechnical survey, zoning and investment feasibility.",
 "Konsept, statik ve mekanik projelerin üretimi.":"Production of concept, structural and mechanical designs.",
 "Belediye onayları ve yapı ruhsatı süreçleri.":"Municipal approvals and building-permit processes.",
 "Kalite kontrollü, takvime bağlı saha üretimi.":"Quality-controlled, schedule-driven on-site production.",
 "Bağımsız yapı denetimi ve test süreçleri.":"Independent building inspection and testing processes.",
 "İskan raporu, anahtar teslim ve satış sonrası destek.":"Occupancy permit, turnkey handover and after-sales support.",
 "Formu doldurun, 24 saat içinde uzman ekibimiz sizi arasın.":"Fill in the form and our expert team will call you within 24 hours.",
 "Konut İnşaatı":"Residential Construction",
 "Tadilat & Renovasyon":"Renovation & Refurbishment",
 "Kentsel Dönüşüm":"Urban Renewal",
 "Anahtar Teslim Taahhüt":"Turnkey Contracting",
 "Kat Karşılığı İnşaat":"Land-for-Flat Construction",
 "Ticari & Karma Yapılar":"Commercial & Mixed-Use Buildings",
 "Güçlendirme & Restorasyon":"Retrofitting & Restoration",
 "Endüstriyel Yapılar":"Industrial Buildings",
 "Meridyen Levent Rezidans":"Meridyen Levent Residence",
 "Bosphorus Loft":"Bosphorus Loft",
 "Meridyen Vadi Evleri":"Meridyen Valley Houses",
 "Anadolu Ofis Kule":"Anadolu Office Tower",
 "Yeni Ufuk Kentsel Dönüşüm":"Yeni Ufuk Urban Renewal",
 "Marmara Sahil Konakları":"Marmara Coast Mansions",
 "Fikirden Teslime, Uçtan Uca Yapı Çözümleri":"From Concept to Handover, End-to-End Construction Solutions",
 "Her hizmet; ayrı proje yönetimi, kendi mühendis ekibi ve kalite kontrol süreciyle yürütülür. Her hizmet sayfasında derin analiz, süreç akışı, mevzuat, risk yönetimi ve sık sorulan soruları bulacaksınız.":"Each service is delivered with its own project management, dedicated engineering team, and quality control process. On every service page you will find in-depth analysis, the process flow, applicable regulations, risk management, and frequently asked questions.",
 "Uzmanlık Alanları":"Areas of Expertise",
 "Mühendislik disiplini, sahada karşılığı olan taahhüt":"Engineering discipline, commitments proven on site",
 "1986’dan bu yana; zemin etüdünden statik projeye, yapı denetiminden iskâna kadar her aşamayı kendi mühendis ve mimar kadromuzla yönetiyoruz. Aşağıdaki her hizmet; kendi süreç akışı, mevzuat çerçevesi, risk yönetimi ve somut güvenceleriyle uçtan uca sunulur.":"Since 1986, we have managed every stage in-house with our own team of engineers and architects — from geotechnical surveys and structural design to building inspection and the occupancy permit. Each of the services below is delivered end-to-end, with its own process flow, regulatory framework, risk management, and tangible assurances.",
 "8 Aşamalı Denetimli Süreç":"8-Stage Supervised Process",
 "Keşif & Etüt":"Site Survey & Investigation",
 "Proje & Ruhsat":"Design & Permit",
 "Sözleşme":"Contract",
 "Hafriyat & Temel":"Excavation & Foundation",
 "Kaba Yapı":"Structural Shell",
 "İnce İmalat":"Finishing Works",
 "İskân":"Occupancy Permit",
 "Kesin Kabul":"Final Acceptance",
 "Somut Güvenceler":"Tangible Assurances",
 "Bina Tamamlama Sigortası":"Building Completion Insurance",
 "Noter Onaylı Sözleşme":"Notarized Contract",
 "TBDY 2018 & Yapı Denetimi":"TBDY 2018 & Building Inspection",
 "Şeffaf İlerleme":"Transparent Progress",
 "Tek Muhatap (EPC)":"Single Point of Contact (EPC)",
 "A Sınıfı Enerji & BIM":"Class A Energy & BIM",
 "Projeniz için doğru hizmeti birlikte belirleyelim":"Let's determine the right service for your project together",
 "Ücretsiz keşif ve teklif için bize ulaşın; size en uygun çözümü sunalım.":"Contact us for a free site survey and quote, and let us offer you the most suitable solution.",
 "Canlı Bölge Zekâsı · Meridyen Veri Ağı":"Live Regional Intelligence · Meridyen Data Network",
 "İstanbul'un yatırım koridorları,metrekaresine kadar.":"Istanbul's investment corridors, down to the square meter.",
 "Faaliyet gösterdiğimiz her bölgede m² fiyatını, inşaat maliyetini, kira getirisini ve deprem riskini güncel veriyle izliyoruz. Kararı rakamlar verir.":"In every region where we operate, we track the price per m², construction cost, rental yield, and earthquake risk with up-to-date data. The numbers make the decision.",
 "Kapsama Haritası":"Coverage Map",
 "Faaliyet bölgelerimiz — her nokta canlı izlenen bir yatırım koridoru. Seçmek için tıklayın.":"Our areas of operation — each point is a live-monitored investment corridor. Click to select.",
 "Kategoriye Göre Ortalama m² Fiyatı":"Average Price per m² by Category",
 "Levent · konut, ticari, arsa ve lüks segment m² fiyatları (₺). Sağdaki oran il ortalamasına kıyastır.":"Levent · price per m² for the residential, commercial, land, and luxury segments (₺). The ratio on the right is relative to the provincial average.",
 "6 Yıllık Fiyat Trendi":"6-Year Price Trend",
 "Levent bölgesinde ortalama m² fiyat seyri (bin ₺) · 2021→2026.":"Average price-per-m² trajectory in the Levent area (thousand ₺) · 2021→2026.",
 "İnşaat Maliyeti → Satış Değeri":"Construction Cost → Sales Value",
 "Bölgede ortalama inşaat maliyeti ile satış m² değeri arasındaki fark — geliştirici potansiyel marjı.":"The gap between the average construction cost and the sales value per m² in the region — the developer's potential margin.",
 "Yatırım Skoru & Risk":"Investment Score & Risk",
 "Bölgesel getiri potansiyeli, yaşam kalitesi, talep yoğunluğu ve coğrafi/deprem risk analizi.":"Regional return potential, quality of life, demand intensity, and geographic/earthquake risk analysis.",
 "Kira & Getiri":"Rent & Yield",
 "Ortalama kira (₺/m²/ay), yıllık brüt kira getirisi ve arz/talep dengesi.":"Average rent (₺/m²/month), annual gross rental yield, and supply/demand balance.",
 "Veriyi okumak başlangıç; asıl fark sahada ortaya çıkar. Faaliyet bölgelerimizde kurulu tedarik zincirimiz ve yerel ekibimizle süreci yalnızca planlamıyor, sonuna kadar yürütüp teslim ediyoruz.":"Reading the data is only the start; the real difference emerges on site. With our established supply chain and local team across our areas of operation, we don't just plan the process — we carry it through to the end and deliver.",
 "Yerel taşeron ve malzeme ağımız, belediye ve resmi kurum ilişkilerimiz, maliyet öngörümüz ve saha yönetim disiplinimiz; bir projeyi konuşulan fikir olmaktan çıkarıp zamanında tamamlanan bir yapıya dönüştürür. Taahhüdümüz iddia değil, teslim edilmiş işlerle kanıtlıdır.":"Our network of local subcontractors and suppliers, our relationships with municipal and government authorities, our cost forecasting, and our site management discipline turn a project from a discussed idea into a structure completed on time. Our commitment is not a claim — it is proven by delivered work.",
 "Yerel Tedarik Zinciri":"Local Supply Chain",
 "Bölgedeki anlaşmalı malzeme tedarikçileri ve uzman taşeron ağıyla kesintisiz, maliyeti öngörülebilir üretim.":"Uninterrupted, cost-predictable delivery through our network of contracted material suppliers and specialist subcontractors in the region.",
 "Maliyet & Bütçe Yönetimi":"Cost & Budget Management",
 "Güncel birim fiyat verisiyle gerçekçi keşif, hakediş sistemiyle şeffaf maliyet kontrolü ve sapma yönetimi.":"Realistic estimating based on up-to-date unit-price data, transparent cost control through a progress-payment system, and variance management.",
 "İmar, Ruhsat & Belediye Süreçleri":"Zoning, Permit & Municipal Processes",
 "Plan-proje onayı, ruhsat ve iskan dahil resmi kurum süreçlerini deneyimli teknik ekibimizle hızlı yönetiyoruz.":"We handle official processes — including plan and project approval, permits, and the occupancy permit — swiftly with our experienced technical team.",
 "Saha Yönetimi & Zamanında Teslim":"Site Management & On-Time Delivery",
 "CPM kritik yol planlaması, BIM koordinasyonu ve İSG disipliniyle takvime sadık, eksiksiz teslim.":"Complete, on-schedule delivery through CPM critical-path planning, BIM coordination, and OHS discipline.",
 "Bölgenizdeki projeyi birlikte hayata geçirelim":"Let's bring your local project to life together",
 "Arsanız veya projeniz için bölgesel fizibilite, maliyet öngörüsü ve uçtan uca yönetim teklifimizi alın.":"Get our proposal for regional feasibility, cost forecasting, and end-to-end management for your land or project.",
 "Ad Soyad":"Full Name",
 "Telefon":"Phone",
 "E-posta":"E-mail",
 "İlgilendiğiniz konu":"Subject of interest",
 "Mesajınız":"Your message",
 "KVKK Aydınlatma Metni kapsamında kişisel verilerimin işlenmesini onaylıyorum.":"I consent to the processing of my personal data under the GDPR privacy notice.",
 "talep · 34 arz":"demand · 34 supply",
 "Tümü":"All",
 "Devam Eden":"Ongoing",
 "Tamamlanan":"Completed",
 "Planlanan":"Planned",
 "Detayları Gör →":"View Details →",
 "Levent'in merkezinde, modern mimari ve akıllı bina teknolojisiyle donatılmış prestijli rezidans projesi.":"A prestigious residence project in the heart of Levent, equipped with modern architecture and smart-building technology.",
 "Alan":"Area",
 "180 daire":"180 units",
 "Teslim":"Delivery",
 "Konut · 2+1/4+1":"Residential · 2+1/4+1",
 "Tip":"Type",
 "8.500.000 ₺'den başlayan":"from 8,500,000 ₺",
 "7 müsait daire":"7 units available",
 "Boğaz manzaralı, loft konseptli lüks yaşam alanları.":"Bosphorus-view, loft-concept luxury living spaces.",
 "72 daire":"72 units",
 "14.200.000 ₺'den başlayan":"from 14,200,000 ₺",
 "3 müsait daire":"3 units available",
 "Tamamlandı":"Completed",
 "Doğayla iç içe, müstakil bahçeli villa yaşamı.":"Detached villa living immersed in nature with private gardens.",
 "48 villa":"48 villas",
 "Teslim edildi":"Delivered",
 "Villa · Müstakil":"Villa · Detached",
 "22.000.000 ₺'den başlayan":"from 22,000,000 ₺",
 "Tükendi":"Sold Out",
 "Finans merkezinde A+ sınıfı akıllı ofis kulesi.":"A Class A+ smart office tower in the financial center.",
 "A+ ofis katları":"A+ office floors",
 "Ticari · Ofis":"Commercial · Office",
 "İletişime geçin":"Contact us",
 "1 müsait daire":"1 unit available",
 "6306 sayılı kanun kapsamında riskli yapı dönüşümü.":"Risky-building transformation under Law No. 6306.",
 "240 daire":"240 units",
 "Hak sahiplerine özel":"Exclusive to rights holders",
 "Sahil şeridinde özel iskeleli lüks konaklar.":"Luxury mansions with private piers along the coastline.",
 "36 konak":"36 mansions",
 "Villa · Sahil":"Villa · Coastal",
 "35.000.000 ₺'den başlayan":"from 35,000,000 ₺",
 "Konut":"Residential",
 "Villa":"Villa",
 "birim":"units",
 "izlenen ilçe":"monitored districts",
 "canlı mahalle":"live neighborhoods",
 "bölgede projemiz":"projects in region",
 "il veri kapsamı":"provinces covered",
 "Ortalama m² (konut)":"Average m² (residential)",
 "Son 12 ay":"Last 12 months",
 "Bölgede projemiz":"Projects in region",
 "Canlı mahalle":"Live neighborhoods",
 "Konut":"Residential",
 "Ticari":"Commercial",
 "Arsa":"Land",
 "Lüks Konut":"Luxury Residential",
 "Levent · endeks":"Levent · index",
 "Ataşehir · endeks":"Ataşehir · index",
 "Çekmeköy · endeks":"Çekmeköy · index",
 "Büyükçekmece · endeks":"Büyükçekmece · index",
 "son 12 ay":"last 12 months",
 "İnşaat maliyeti / m²":"Construction cost / m²",
 "Satış değeri / m²":"Sales value / m²",
 "Potansiyel marj":"Potential margin",
 "satış − maliyet farkı":"sales − cost gap",
 "/100 skor":"/100 score",
 "Yatırım Skoru":"Investment Score",
 "Yaşam Kalitesi":"Quality of Life",
 "Talep Yoğunluğu":"Demand Intensity",
 "Tapu Hareketi":"Title-Deed Activity",
 "Fay Hattı":"Fault Line",
 "Orta mesafe":"Medium distance",
 "Denize Mesafe":"Distance to Sea",
 "Yakın":"Close",
 "Ulaşım":"Transport",
 "Çok güçlü":"Very strong",
 "Ortalama kira":"Average rent",
 "/m²·ay":"/m²·month",
 "Brüt kira getirisi":"Gross rental yield",
 "Talep / Arz dengesi":"Demand / Supply balance",
 "yıllık saha tecrübesi":"years of field experience",
 "tamamlanmış proje":"completed projects",
 "zamanında teslim oranı":"on-time delivery rate",
 "saha & proje yönetimi":"site & project management",
 "Portföyümüz":"Our Portfolio",
 "Yükselen ve Teslim Edilen Projelerimiz":"Our Rising and Delivered Projects",
 "Devam eden, tamamlanan ve planlama aşamasındaki tüm projelerimizi inceleyin. Her projede daire seçimi, kat planları ve detaylı bilgilere ulaşabilirsiniz.":"Explore all our ongoing, completed and planned projects. For each project you can access unit selection, floor plans and detailed information.",
 "🛡️ Standartlarımız":"🛡️ Our Standards",
 "TBDY 2018":"TBDY 2018",
 "Yapı Denetimli · 4708":"Building-Inspected · 4708",
 "6306 Kentsel Dönüşüm":"6306 Urban Renewal",
 "ISO 9001 · 14001 · 45001":"ISO 9001 · 14001 · 45001",
 "BIM Koordinasyon":"BIM Coordination"
};
function _i18nKey(el){return (el.textContent||'').replace(/\s+/g,' ').trim();}
function i18nHarvest(){try{document.querySelectorAll(I18N_SEL).forEach(function(el){if(el.closest(I18N_SKIP))return;if(el.hasAttribute('data-ik'))return;var k=_i18nKey(el);if(!k||k.length>500)return;el.setAttribute('data-io',el.innerHTML);el.setAttribute('data-ik',k);});}catch(e){}}
function applyLang(lang){
  LANG=(lang==='en')?'en':'tr'; try{localStorage.setItem('meridyen_lang',LANG);}catch(e){}
  document.documentElement.setAttribute('lang',LANG);
  document.querySelectorAll('[data-ik]').forEach(function(el){
    var k=el.getAttribute('data-ik'),orig=el.getAttribute('data-io'),v;
    if(LANG==='en')v=(I18N.en&&I18N.en[k])||_I18N_EN[k]||orig; else v=(I18N.tr&&I18N.tr[k])||orig;
    if(v!=null)el.innerHTML=v;
  });
  document.querySelectorAll('.lang-sel').forEach(function(s){try{s.value=LANG;}catch(e){}});
  try{var _en=(LANG==='en');document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(function(inp){if(inp.closest('#adminApp'))return;if(!inp.hasAttribute('data-ph0'))inp.setAttribute('data-ph0',inp.getAttribute('placeholder')||'');var tr=inp.getAttribute('data-ph0');inp.placeholder=_en?(_PH_EN[tr]||tr):tr;});}catch(e){}
  try{if(typeof applyMenuText==='function')applyMenuText();}catch(e){}
  try{var _ip=document.getElementById('iletisimPage');if(_ip&&_ip.classList.contains('on')&&typeof renderIletisimPage==='function')renderIletisimPage();}catch(e){}
}
const _PH_EN={"Proje veya konum ara...":"Search project or location...","Adınız Soyadınız":"Your Full Name","ornek@eposta.com":"example@email.com","Projeniz veya talebiniz hakkında kısaca bilgi verin...":"Briefly describe your project or request...","Kısaca talebiniz...":"Briefly your request...","E-posta adresiniz":"Your email address"};
function i18nInit(){i18nHarvest();applyLang(LANG);}
let _dillerKeys=[];
function renderDiller(){
  var host=document.getElementById('dillerList'); if(!host)return;
  _dillerKeys=[]; var seen={};
  document.querySelectorAll('[data-ik]').forEach(function(el){var k=el.getAttribute('data-ik');if(!seen[k]){seen[k]=1;_dillerKeys.push(k);}});
  var h='';
  _dillerKeys.forEach(function(k,i){
    var tr=(I18N.tr&&I18N.tr[k]!=null)?I18N.tr[k]:k;
    var en=(I18N.en&&I18N.en[k]!=null)?I18N.en[k]:(_I18N_EN[k]||'');
    h+='<div style="display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:11px 0;border-bottom:1px solid var(--line)"><div><label style="font-size:.6875rem;color:#888;letter-spacing:.5px">TÜRKÇE</label><textarea rows="2" data-i="'+i+'" data-l="tr" oninput="dillerEdit(this)" style="width:100%">'+_brandEsc(tr)+'</textarea></div><div><label style="font-size:.6875rem;color:#888;letter-spacing:.5px">ENGLISH</label><textarea rows="2" data-i="'+i+'" data-l="en" oninput="dillerEdit(this)" style="width:100%" placeholder="English translation...">'+_brandEsc(en)+'</textarea></div></div>';
  });
  host.innerHTML=h||'<div style="color:#888">Henüz metin bulunamadı (sayfa yüklendikten sonra tekrar açın).</div>';
}
function dillerEdit(ta){var k=_dillerKeys[+ta.getAttribute('data-i')],l=ta.getAttribute('data-l');if(l==='tr')I18N.tr[k]=ta.value;else I18N.en[k]=ta.value;applyLang(LANG);}
function brandUpload(input,which){
  var f=input.files&&input.files[0]; if(!f)return;
  if(f.size>2600000){alert('Görsel çok büyük (2.5MB üstü). Daha küçük/optimize bir logo seçin.');input.value='';return;}
  var r=new FileReader();
  r.onload=function(){ BRAND[which]=r.result; applyBrand(); loadBrandUI(); saveAll(); };
  r.readAsDataURL(f);
}
function brandClear(which){ BRAND[which]=''; var i=document.getElementById(which==='logo'?'f_logo':which==='logoFooter'?'f_logoFooter':'f_favicon'); if(i)i.value=''; applyBrand(); loadBrandUI(); saveAll(); }
function publishSite(){ saveAll(); var el=document.getElementById('saveToast'); if(el)el.textContent='🚀 Yayınlandı · neden-biz dâhil tüm sayfalara uygulandı'; }
function loadBrandUI(){
  var b=BRAND;
  function prev(id,val,fb){var el=document.getElementById(id);if(!el)return;if(val){el.textContent='';var im=document.createElement('img');im.style.cssText='width:100%;height:100%;object-fit:contain';im.src=val;el.appendChild(im);}else el.textContent=fb;}
  prev('bp_logo',b.logo,'M');
  prev('bp_logoFooter',b.logoFooter||b.logo,'—');
  prev('bp_favicon',b.favicon,'★');
  var n=document.getElementById('b_name'),n2=document.getElementById('b_name2');
  if(n)n.value=b.name||''; if(n2)n2.value=(b.name2||'');
}
/*__ADMIN_BLOK__*/ /* Bu bölge üretim paketinde admin-assets/ altına ayrılır (public bundle inmez) */
// ===== SÖZLEŞME ŞABLONLARI (gerçek Türk hukuk metinleri esas alınmıştır) =====
// Yer tutucular: {{FIRMA_UNVAN}}, {{FIRMA_VERGI}}, {{FIRMA_ADRES}}, {{FIRMA_YETKILI}},
// {{KARSI_TARAF}}, {{KARSI_TC}}, {{KARSI_ADRES}}, {{ARSA_IL}}, {{ARSA_ILCE}}, {{ARSA_MAHALLE}},
// {{ADA}}, {{PARSEL}}, {{ARSA_M2}}, {{PAY_ARSA}}, {{PAY_MUTEAHHIT}}, {{SURE_AY}}, {{GECIKME_TL}}, {{TARIH}}
const SOZLESME_SABLONLARI={
  'kat-karsiligi':{ad:'Kat Karşılığı İnşaat Sözleşmesi',
   madde:`KAT KARŞILIĞI İNŞAAT SÖZLEŞMESİ

TARAFLAR
MADDE 1 — İşbu sözleşme, bir tarafta {{KARSI_ADRES}} adresinde mukim {{KARSI_TARAF}} (T.C./Vergi No: {{KARSI_TC}}) (bundan sonra "ARSA SAHİBİ" olarak anılacaktır) ile diğer tarafta {{FIRMA_ADRES}} adresinde mukim {{FIRMA_UNVAN}} (Vergi No: {{FIRMA_VERGI}}), yetkilisi {{FIRMA_YETKILI}} (bundan sonra "MÜTEAHHİT" olarak anılacaktır) arasında aşağıdaki şartlarla akdedilmiştir.

SÖZLEŞMENİN KONUSU
MADDE 2 — Arsa Sahibi'ne ait {{ARSA_IL}} ili, {{ARSA_ILCE}} ilçesi, {{ARSA_MAHALLE}} mahallesinde bulunan, tapunun {{ADA}} ada {{PARSEL}} parsel numarasında kayıtlı {{ARSA_M2}} m² yüzölçümlü taşınmaz üzerinde; imar durumuna, belediyece onaylanacak projeye, işbu sözleşme ve eklerine, ilgili Belediye imar yönetmeliğine ve Deprem Yönetmeliği'ne (TBDY 2018) uygun olarak, taraflar arasında {{PAY_ARSA}} / {{PAY_MUTEAHHIT}} oranında paylaşılmak üzere bağımsız bölümler inşa edilmesidir.

ARSA SAHİBİNİN YÜKÜMLÜLÜKLERİ
MADDE 3 — Arsa Sahibi, arsa ile ilgili tüm tedbir, takyidat, dava ve ihtilafları çözmeyi; arsayı her türlü yükümlülükten ari, boş ve inşaata elverişli şekilde teslim etmeyi kabul ve taahhüt eder. Arsa Sahibi, sözleşmenin imzalanmasını müteakip müteahhide gerekli yetki, vekaletname ve muvafakatnameyi verecektir.

MÜTEAHHİDİN YÜKÜMLÜLÜKLERİ
MADDE 4 — Müteahhit, inşaata başlamadan önce gerekli tüm resmi onay ve izinleri (yapı ruhsatı, yapı denetim raporu, iskan başvurusu vb.) almakla yükümlüdür. Müteahhit, inşaatı teknik şartname ve mahal listesi esaslarına uygun olarak, betonarme karkas, doğalgazlı, asansörlü ve hidroforlu olarak yürütecektir. İş kazalarından doğan sorumluluk müteahhide aittir.

TESLİM SÜRESİ
MADDE 5 — Müteahhit, yer tesliminden itibaren en geç {{SURE_AY}} ay içerisinde yapı kullanma izin belgesi (iskan) alınabilecek şekilde işi bitirip teslim edecektir. Savaş, sıkıyönetim, doğal afet ve salgın gibi mücbir sebeplerle süre uzatılabilir; ekonomik kriz ve döviz artışı mücbir sebep sayılmaz.

GECİKME TAZMİNATI
MADDE 6 — Müteahhit, belirtilen sürede işi teslim etmezse, Arsa Sahibi'ne ait her bağımsız bölüm için aylık {{GECIKME_TL}} TL gecikme (kira) tazminatı öder. Gecikme 6 ayı aşarsa Arsa Sahibi sözleşmeyi tek taraflı feshedebilir.

ARSA PAYI DEVRİ (AŞAMALI DEVİR GÜVENCESİ)
MADDE 7 — Müteahhidin hak ettiği arsa paylarının devri, inşaatın ilerleme seviyesine göre kademeli olarak yapılacaktır. Son bağımsız bölüm tapuları, iskan ruhsatı alındıktan sonra devredilecektir.

GİDERLER
MADDE 8 — Proje ücretleri, tapu harçları, belediye harçları, SGK primleri, kat irtifakı ve kat mülkiyeti kurulması müteahhide; arsa kaynaklı emlak ve veraset vergileri arsa sahibine aittir.

FESİH VE UYUŞMAZLIK
MADDE 9 — Müteahhidin acze düşmesi, inşaatı sebepsiz terk etmesi veya taahhütlerini yerine getirmemesi halinde, ihtara rağmen aykırılık giderilmezse Arsa Sahibi sözleşmeyi feshedebilir. Uyuşmazlık halinde {{ARSA_IL}} Mahkemeleri ve İcra Daireleri yetkilidir.

MADDE 10 — İşbu sözleşme {{TARIH}} tarihinde, Noterlik Kanunu'nun 60. maddesi gereği resmi şekilde düzenlenmiş ve taraflarca imza altına alınmıştır.

ARSA SAHİBİ                                          MÜTEAHHİT
{{KARSI_TARAF}}                          {{FIRMA_UNVAN}}
                                                       {{FIRMA_YETKILI}}`},
  'insaat':{ad:'Anahtar Teslim İnşaat Sözleşmesi',
   madde:`ANAHTAR TESLİM İNŞAAT SÖZLEŞMESİ

TARAFLAR
MADDE 1 — Bir tarafta {{KARSI_ADRES}} adresinde mukim {{KARSI_TARAF}} (T.C./Vergi No: {{KARSI_TC}}) ("İŞ SAHİBİ") ile diğer tarafta {{FIRMA_ADRES}} adresinde mukim {{FIRMA_UNVAN}} (Vergi No: {{FIRMA_VERGI}}) ("YÜKLENİCİ") arasında aşağıdaki şartlarla akdedilmiştir.

İŞİN KONUSU
MADDE 2 — {{ARSA_IL}} ili, {{ARSA_ILCE}} ilçesi, {{ARSA_MAHALLE}} mahallesi, {{ADA}} ada {{PARSEL}} parsel, {{ARSA_M2}} m² taşınmaz üzerinde onaylı projeye uygun anahtar teslim yapı inşası.

BEDEL VE ÖDEME
MADDE 3 — İşin toplam bedeli ve ödeme planı eklerde belirtilmiştir. Ödeme, hakediş esasına göre inşaatın ilerleme seviyesine bağlı olarak yapılacaktır. Yüklenici, öngörülemeyen malzeme/işçilik artışları için bedel artırımı talep edemez.

TESLİM SÜRESİ
MADDE 4 — Yüklenici, yer tesliminden itibaren {{SURE_AY}} ay içerisinde işi tamamlayıp teslim edecektir. Gecikme halinde aylık {{GECIKME_TL}} TL gecikme tazminatı uygulanır.

TEKNİK ŞARTLAR
MADDE 5 — Yapı; betonarme karkas, TBDY 2018 Deprem Yönetmeliği'ne uygun, su/elektrik/doğalgaz/kanalizasyon bağlantıları, asansör ve hidrofor tesisatı tamamlanmış olarak teslim edilecektir.

GARANTİ VE AYIP
MADDE 6 — Yüklenici, kusurlu imalatlardan sorumlu olup, gerekli tamir ve yeniden yapım işlerini ücretsiz olarak yapacaktır. İskan belgesi alınana kadar inşaat "bitmiş" sayılmaz.

UYUŞMAZLIK
MADDE 7 — Uyuşmazlık halinde {{ARSA_IL}} Mahkemeleri yetkilidir. İşbu sözleşme {{TARIH}} tarihinde imzalanmıştır.

İŞ SAHİBİ                                            YÜKLENİCİ
{{KARSI_TARAF}}                          {{FIRMA_UNVAN}}`},
  'taseron':{ad:'Taşeron (Alt Yüklenici) Sözleşmesi',
   madde:`TAŞERON SÖZLEŞMESİ

TARAFLAR
MADDE 1 — Bir tarafta {{FIRMA_UNVAN}} ("ANA YÜKLENİCİ", Vergi No: {{FIRMA_VERGI}}, {{FIRMA_ADRES}}) ile diğer tarafta {{KARSI_TARAF}} ("TAŞERON", T.C./Vergi No: {{KARSI_TC}}, {{KARSI_ADRES}}) arasında akdedilmiştir.

İŞİN KONUSU
MADDE 2 — {{ARSA_IL}}/{{ARSA_ILCE}} adresindeki projede, ana yüklenicinin denetimi altında belirlenen imalat işlerinin (eklerdeki teknik şartnameye göre) taşeron tarafından yapılmasıdır.

SÜRE VE BEDEL
MADDE 3 — İş süresi {{SURE_AY}} aydır. Bedel ve hakediş ödemeleri eklerde belirtilmiştir. Taşeron, ana yükleniciye bağlı olup, işi başkasına devredemez.

SORUMLULUK
MADDE 4 — Taşeron, SGK bildirimleri, iş güvenliği ve işçi haklarından sorumludur. İş kazalarından doğan sorumluluk taşerona aittir.

MADDE 5 — Uyuşmazlık halinde {{ARSA_IL}} Mahkemeleri yetkilidir. İşbu sözleşme {{TARIH}} tarihinde imzalanmıştır.

ANA YÜKLENİCİ                                        TAŞERON
{{FIRMA_UNVAN}}                          {{KARSI_TARAF}}`}
};
const DURUM_LABEL={satildi:'Satıldı',kiralandi:'Kiralandı',bos:'Boş',rezerve:'Rezerve',['arsa-sahibi']:'Arsa Sahibi'};
const DURUM_COLOR={satildi:'#1a7f4a',kiralandi:'#2563eb',bos:'#9aa0ab',rezerve:'#c8962f',['arsa-sahibi']:'#0e7490'};
/*__ADMIN_BLOK_SON__*/
const ST_LABEL={devam:'Devam Eden',tamam:'Tamamlandı',plan:'Planlanan'};
const imgFor=(k)=> (k&&/^(https?:|data:|img\/)/.test(k))?k:(IMG[k]||'');

/* ---------------- RENDER PUBLIC ---------------- */
function renderServices(){document.getElementById('svcGrid').innerHTML=SERVICES.map((s,i)=>`
  <div class="svc" onclick="openSvcDetail(${i})" style="cursor:pointer"><div class="i">${s.i}</div><h3>${s.t}</h3><p>${s.d}</p><span class="more">Detaylı bilgi →</span></div>`).join('');}
let curFilter='all';
function renderProjects(){
  document.getElementById('projGrid').innerHTML=PROJECTS.filter(p=>curFilter==='all'||p.st===curFilter).map(p=>{
    const src=imgFor(p.img);
    return `<div class="card" onclick="openProjectDetail(${PROJECTS.indexOf(p)})"><div class="ph">${src?`<img src="${src}" alt="${p.t}" loading="lazy" decoding="async">`:''}<span class="st ${p.st}">${ST_LABEL[p.st]}</span></div>
    <div class="body"><div class="loc">📍 ${p.loc}</div><h3>${p.t}</h3>
    <div class="meta"><span><b>Tip:</b> ${p.type}</span><span><b>Alan:</b> ${p.area}</span></div></div></div>`;}).join('')
    || '<p style="color:var(--muted)">Bu kategoride proje bulunmuyor.</p>';
}

// ===== /BOLGE ZEKASI SAYFASI =====
// Bölge verileri (demo — emlakekspertizi API yapısına uygun; canlıda /api/emlak-endeksi/* ile beslenir)
let BOLGELER=[
  {ad:'Levent',ilce:'Beşiktaş / İstanbul',m2:'185.400 ₺',m2n:185400,delta:'+32,4',deltaN:32.4,skor:88,yasam:82,tapu:'+18',tapuN:18,trend:[62,78,95,124,158,185],t6:[62,78,95,124,158,185],
    kat:{konut:185400,ticari:242000,arsa:96000,lux:318000},maliyet:43000,kira:520,getiri:3.1,ilAvg:118000,talep:92,arz:34,proje:14,mahalle:9,x:206,y:66,
    fault:{t:'Fay Hattı',d:'Kuzey Anadolu Fay Hattı\'na ~19 km',tag:'orta',tagt:'Orta mesafe'},
    sea:{t:'Denize Mesafe',d:'Boğaz kıyısına ~1,2 km',tag:'ok',tagt:'Yakın'},
    transport:{t:'Ulaşım',d:'Metro M2 + metrobüs erişimi',tag:'ok',tagt:'Çok güçlü'}},
  {ad:'Ataşehir',ilce:'Ataşehir / İstanbul',m2:'96.800 ₺',m2n:96800,delta:'+27,1',deltaN:27.1,skor:79,yasam:77,tapu:'+12',tapuN:12,trend:[40,52,64,78,88,97],t6:[40,52,64,78,88,97],
    kat:{konut:96800,ticari:138000,arsa:52000,lux:172000},maliyet:39000,kira:340,getiri:4.0,ilAvg:118000,talep:84,arz:47,proje:11,mahalle:7,x:250,y:100,
    fault:{t:'Fay Hattı',d:'KAF\'a ~24 km',tag:'ok',tagt:'Uzak'},
    sea:{t:'Denize Mesafe',d:'Marmara kıyısına ~9 km',tag:'orta',tagt:'Orta'},
    transport:{t:'Ulaşım',d:'Metro M4 + TEM/D-100',tag:'ok',tagt:'Güçlü'}},
  {ad:'Çekmeköy',ilce:'Çekmeköy / İstanbul',m2:'58.300 ₺',m2n:58300,delta:'+24,7',deltaN:24.7,skor:74,yasam:80,tapu:'+21',tapuN:21,trend:[24,31,39,47,53,58],t6:[24,31,39,47,53,58],
    kat:{konut:58300,ticari:84000,arsa:31000,lux:104000},maliyet:36000,kira:225,getiri:4.6,ilAvg:118000,talep:79,arz:58,proje:8,mahalle:6,x:288,y:64,
    fault:{t:'Fay Hattı',d:'KAF\'a ~31 km',tag:'ok',tagt:'Uzak'},
    sea:{t:'Doğal Alan',d:'Aydos Ormanı\'na ~1 km',tag:'ok',tagt:'Yüksek yeşil'},
    transport:{t:'Ulaşım',d:'Metro M5 + TEM bağlantısı',tag:'ok',tagt:'Gelişen'}},
  {ad:'Büyükçekmece',ilce:'Büyükçekmece / İstanbul',m2:'47.900 ₺',m2n:47900,delta:'+29,3',deltaN:29.3,skor:71,yasam:75,tapu:'+26',tapuN:26,trend:[19,25,31,37,43,48],t6:[19,25,31,37,43,48],
    kat:{konut:47900,ticari:69000,arsa:26500,lux:88000},maliyet:35000,kira:190,getiri:4.8,ilAvg:118000,talep:81,arz:63,proje:6,mahalle:5,x:78,y:112,
    fault:{t:'Fay Hattı',d:'KAF\'a ~12 km',tag:'warn',tagt:'Yakın — özel temel'},
    sea:{t:'Denize Mesafe',d:'Sahile ~0,3 km',tag:'ok',tagt:'Sahil'},
    transport:{t:'Ulaşım',d:'E-5 + Marmaray bağlantısı',tag:'orta',tagt:'Orta'}},
];
function _bzTL(n){try{return Number(n).toLocaleString('tr-TR');}catch(e){return n;}}
let _bzIdx=0;
function bzGo(id){
  closeBolgePage();
  setTimeout(()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},250);
  return false;
}
function openBolgePage(){
  renderBolgePage();
  const ov=document.getElementById('bolgePage');ov.classList.add('on');_insSyncUrl('bolge');document.body.style.overflow='hidden';ov.scrollTop=0;
  /* URL: temiz router yönetir */
  /* API-first endeks: canlı /endeks {success,data:{m2,score,delta,trend}} gelir; alan boş/yoksa o alanda yerel demo korunur. BOŞ DÖNEBİLİR → fallback. */
  try{
    if(typeof proxApi==='function'){
      const _b=BOLGELER[_bzIdx];
      const _il=((_b&&_b.ilce)||'').split('/')[1]||'';
      const _ilce=((_b&&_b.ilce)||'').split('/')[0]||'';
      const _q='il='+encodeURIComponent(_il.trim())+'&ilce='+encodeURIComponent(_ilce.trim())+'&mahalle='+encodeURIComponent((_b&&_b.ad)||'')+'&kategori=konut&durum=satilik';
      proxApi('/api/v1/tenant/endeks?'+_q).then(function(r){
        if(!r||r.fallback||r.success!==true||!r.data||!_b)return; /* boş → yerel demo kalır */
        const d=r.data;
        if(typeof d.m2==='number'&&d.m2>0)_b.m2=Math.round(d.m2).toLocaleString('tr-TR')+' ₺';
        if(typeof d.delta==='number'&&d.delta!==0)_b.delta=(d.delta>0?'+':'')+(''+d.delta).replace('.',',');
        if(typeof d.score==='number'&&d.score>0)_b.skor=Math.round(d.score);
        if(Array.isArray(d.trend)&&d.trend.length)_b.trend=d.trend;
        if(document.getElementById('bolgePage').classList.contains('on'))renderBolgePage();
      }).catch(function(){});
    }
  }catch(_){}
}
function closeBolgePage(){
  _insOvKapat('bolgePage');document.body.style.overflow='';
  /* URL: temiz router yönetir */
}
function openIletisimPage(){
  renderIletisimPage();
  var ov=document.getElementById('iletisimPage');ov.classList.add('on');_insSyncUrl('iletisim');document.body.style.overflow='hidden';ov.scrollTop=0;
  if(typeof i18nInit==='function')i18nInit();
  /* URL: temiz router yönetir */
}
function closeIletisimPage(){
  _insOvKapat('iletisimPage');document.body.style.overflow='';
  /* URL: temiz router yönetir */
}
/* ===== ProX Asistan — bağımsız tam-ekran kilitli AI uygulaması + konuşma geçmişi (localStorage) ===== */
var _paMsgs=[], _paBusy=false, _paConvos=[], _paCurId=null;
var PA_STORE='prox_asistan_convos_v1';
var PA_SUGGESTS=['Daire / konut satın almak istiyorum','Arsamı kat karşılığı vermek istiyorum','Binamız için kentsel dönüşüm düşünüyoruz','Yatırımlık proje önerisi istiyorum'];
var PA_GREET='Merhaba, ben Meridyen Yapı ProX Asistanı 👋 Size nasıl yardımcı olabilirim? Daire mi arıyorsunuz, arsanızı kat karşılığı mı değerlendirmek istiyorsunuz, yoksa kentsel dönüşüm mü düşünüyorsunuz? Sizi dinliyorum — doğru projeye birlikte ulaşalım. Yanıtlarım, Türkiye’nin kapsamlı emlak veritabanı ProX’un 480 milyon+ doğrulanmış veri noktasına dayanır.';
var PA_SYS='Sen Meridyen Yapı kurumsal inşaat firmasının ProX Asistanısın — sıcak, samimi ve SATIŞ ODAKLI bir müşteri danışmanı. ANA GÖREVİN: ziyaretçiyi DİNLEYEREK gerçek ihtiyacını anlamak ve onu Meridyen Yapı’nın projeleri, ilanları ve hizmetleriyle eşleştirerek MÜŞTERİYE dönüştürmek.\n\nDAVRANIŞ KURALLARI:\n1) SELAMLAŞMA yalnızca konuşmanın İLK yanıtında olur: kısa selam ver, kendini tanıt ("Ben Meridyen Yapı ProX Asistanı") ve müşteriye ne aradığını SOR. "Önceki konuşma" verilmişse ARTIK selamlaşma/kendini tekrar tanıtma — doğrudan konuya devam et. ASLA hazır uzun keşif/fizibilite metni veya pitch DÖKME.\n2) Önce NİYETİ anla: müşteri (a) daire/konut satın mı almak istiyor, (b) arsasını KAT KARŞILIĞI mı vermek istiyor, (c) KENTSEL DÖNÜŞÜM mü, (d) tadilat/anahtar teslim mi, (e) yatırım mı? Emin olamıyorsan 1-2 KISA soruyla netleştir (konum, bütçe, m², daire mi arsa mı).\n3) İhtiyacı anladıkça İLGİLİ projeleri/hizmetleri kısa ve çekici tanıt; müşteriyi bir sonraki adıma (projeyi görme, ücretsiz keşif, teklif) yönlendir. Güven ver, baskı yapma.\n4) Uygun her fırsatta müşteriyi CANLI müşteri temsilcimize yönlendir: "Dilerseniz müşteri temsilcimiz sizi arasın; telefon numaranızı bırakırsanız kısa sürede size ulaşırız."\n5) Müşteri telefon numarası PAYLAŞIRSA: teşekkür et ve "Müşteri temsilcimiz kısa sürede sizinle iletişime geçecek" de.\n\nÜSLUP: Türkçe, kısa (2-4 cümle), sıcak, samimi, profesyonel. Yanıtların ProX’un 480 milyon+dan fazla GERÇEK ve DOĞRULANMIŞ emlak verisine dayanır; ProX bir yapay zekâ veya veri üreticisi DEĞİLDİR, veri uydurmazsın. Kesin fiyat/taahhüt verme; tahmini bilgi ver ve ücretsiz keşif öner. Konu dışı sorularda kibarca inşaat/gayrimenkul konusuna yönlendir.';
function _paBizContext(){try{var pj=(typeof PROJECTS!=='undefined'&&PROJECTS&&PROJECTS.length)?PROJECTS.slice(0,8).map(function(p){return '• '+(p.t||'')+' ('+[p.loc,p.type,p.price,p.st].filter(Boolean).join(', ')+')';}).join('\n'):'';var svc='HİZMETLER: Anahtar teslim inşaat, kat karşılığı, kentsel dönüşüm, tadilat/renovasyon, fizibilite ve proje danışmanlığı.';return (pj?('MERİDYEN YAPI GÜNCEL PROJELER (müşteriye uygun olanı tanıt):\n'+pj+'\n\n'):'')+svc;}catch(e){return '';}}
function _paPrompt(){var b=_paBizContext();return PA_SYS+(b?('\n\n'+b):'');}
function _paHistCtx(){try{var h=_paMsgs.filter(function(m){return !m.typing&&m.text;});var prior=h.slice(0,-1).slice(-6).map(function(m){return (m.role==='me'?'Müşteri':'Asistan')+': '+m.text;}).join('\n');return prior;}catch(e){return '';}}
function _paEsc(x){return (typeof _brandEsc==='function')?_brandEsc(x):String(x==null?'':x);}
function _paLoadStore(){try{_paConvos=JSON.parse(localStorage.getItem(PA_STORE)||'[]');if(!Array.isArray(_paConvos))_paConvos=[];}catch(e){_paConvos=[];}}
function _paSaveStore(){try{localStorage.setItem(PA_STORE,JSON.stringify(_paConvos.slice(0,50)));}catch(e){}}
function _paCur(){for(var i=0;i<_paConvos.length;i++){if(_paConvos[i].id===_paCurId)return _paConvos[i];}return null;}
function _paSyncCur(){var c=_paCur();if(!c)return;c.msgs=_paMsgs.filter(function(m){return !m.typing;});c.ts=Date.now();var f=null;for(var i=0;i<c.msgs.length;i++){if(c.msgs[i].role==='me'){f=c.msgs[i];break;}}if(f)c.title=f.text.slice(0,42);_paSaveStore();}
function renderProxAsistanPage(){_paRenderHistory();_paRenderLog();_paSetTitle();}
function _paRenderHistory(){
  var h=document.getElementById('paHistory');if(!h)return;
  if(!_paConvos.length){h.innerHTML='<div class="pa-hist-empty">Henüz konuşma yok — yeni bir sohbet başlatın.</div>';return;}
  h.innerHTML=_paConvos.map(function(c){
    return '<div class="pa-hist'+(c.id===_paCurId?' act':'')+'" onclick="paLoadConvo(\''+c.id+'\')"><span class="t">'+_paEsc(c.title||'Sohbet')+'</span><button class="del" onclick="paDelConvo(\''+c.id+'\',event)" aria-label="Sil">🗑</button></div>';
  }).join('');
}
function _paRenderLog(){
  var log=document.getElementById('paLog');if(!log)return;
  var real=_paMsgs.filter(function(m){return !m.typing;});
  if(!real.length){
    log.innerHTML='<div class="pa-welcome"><div class="w-logo">💬</div><h2><span class="prox-logo">Pro<span class="prox-x">X</span></span> Asistan</h2><p>'+_paEsc(PA_GREET)+'</p><div class="pa-suggests">'+PA_SUGGESTS.map(function(s){return '<div class="pa-chip" onclick="paAsk(this.textContent)">'+_paEsc(s)+'</div>';}).join('')+'</div></div>';
    return;
  }
  log.innerHTML='<div class="pa-log-inner">'+_paMsgs.map(function(m){
    var me=m.role==='me';
    var body=m.typing?'<span class="pa-typing"><i></i><i></i><i></i></span>':_paEsc(m.text);
    return '<div class="pa-msg '+(me?'me':'bot')+'"><div class="av">'+(me?'S':'X')+'</div><div class="pa-bubble">'+body+'</div></div>';
  }).join('')+'</div>';
  log.scrollTop=log.scrollHeight;
}
function _paSetTitle(){var t=document.getElementById('paTitle');if(!t)return;var c=_paCur();t.innerHTML=(c&&c.title)?_paEsc(c.title):'<span class="prox-logo">Pro<span class="prox-x">X</span></span> Asistan';}
function paNewChat(){_paCurId=null;_paMsgs=[];_paRenderLog();_paRenderHistory();_paSetTitle();var sb=document.getElementById('paSb');if(sb)sb.classList.remove('open');var i=document.getElementById('paInput');if(i){i.value='';i.focus();}}
function paLoadConvo(id){var c=null;for(var i=0;i<_paConvos.length;i++){if(_paConvos[i].id===id)c=_paConvos[i];}if(!c)return;_paCurId=id;_paMsgs=(c.msgs||[]).slice();_paRenderLog();_paRenderHistory();_paSetTitle();var sb=document.getElementById('paSb');if(sb)sb.classList.remove('open');}
function paDelConvo(id,ev){if(ev){ev.stopPropagation();ev.preventDefault();}_paConvos=_paConvos.filter(function(c){return c.id!==id;});_paSaveStore();if(_paCurId===id)paNewChat();else _paRenderHistory();}
function paAsk(q){var i=document.getElementById('paInput');if(i)i.value=q;paSend();}
async function paSend(ev){
  if(ev&&ev.preventDefault)ev.preventDefault();
  if(_paBusy)return false;
  var inp=document.getElementById('paInput');var q=((inp&&inp.value)||'').trim();if(!q)return false;
  inp.value='';inp.style.height='';
  var _ps=(typeof authSession==='function')&&authSession();
  if(!_paCurId){_paCurId='c'+Date.now();_paConvos.unshift({id:_paCurId,title:q.slice(0,42),msgs:[],ts:Date.now(),user:_ps?_ps.name:'',email:_ps?_ps.email:''});}
  _paMsgs.push({role:'me',text:q});_paRenderLog();_paSyncCur();_paRenderHistory();_paSetTitle();
  /* Telefon paylaşıldıysa → temsilci araması için lead yakala + görüşmeyi işaretle */
  try{var _ph=q.match(/(?:\+?90[\s.\-]?)?0?5\d{2}[\s.\-]?\d{3}[\s.\-]?\d{2}[\s.\-]?\d{2}/);if(_ph&&typeof proxSubmitLead==='function'){var _pn=_ph[0].replace(/[^\d+]/g,'');proxSubmitLead({sourcePage:'asistan',formType:'prox-asistan',name:_ps?_ps.name:'ProX Asistan ziyaretçisi',phone:_pn,email:_ps?_ps.email:'',message:q,requestedService:'ProX Asistan görüşmesi — geri arama talebi'});var _cc=_paCur();if(_cc){_cc.lead=true;_cc.phone=_pn;_paSaveStore();}}}catch(e){}
  _paBusy=true;var btn=document.querySelector('#proxAsistanPage .pa-send');if(btn)btn.disabled=true;
  _paMsgs.push({role:'bot',typing:true});_paRenderLog();
  try{
    var lang='tr';try{lang=(window.INI18N&&INI18N.lang&&INI18N.lang())||'tr';}catch(e){}
    var ans='';
    if(window.INS_SITE){
      var _r=await INS_SITE.reply({ message:q, history:_paHistArr(), brand:(typeof _csInsBrand==='function'?_csInsBrand():'Meridyen Yapı'), city:(typeof _insCity==='function'?_insCity():'İstanbul'), lang:lang, portfolio:_insPortfolioText(), caps:{phone:true,lead:true,advice:true,match:true,multilang:true} });
      ans=(_r&&_r.ok)?_r.answer:'';
    }
    _paMsgs=_paMsgs.filter(function(m){return !m.typing;});
    if(!ans)ans=_paFallback();
    _paMsgs.push({role:'bot',text:ans});
  }catch(e){_paMsgs=_paMsgs.filter(function(m){return !m.typing;});_paMsgs.push({role:'bot',text:_paFallback()});}
  _paRenderLog();_paSyncCur();
  _paBusy=false;if(btn)btn.disabled=false;
  return false;
}
function _paFallback(){return 'Şu an ProX veri servisine ulaşılamıyor gibi görünüyor. Sorunuzu aldım — dilerseniz “Ücretsiz Keşif” formundan bize ulaşın, uzman ekibimiz 24 saat içinde net yanıt versin. WhatsApp hattımızdan da yazabilirsiniz.';}
function paExit(ev){if(ev&&ev.preventDefault)ev.preventDefault();closeProxAsistanPage();try{insHome(ev);}catch(e){try{location.href='./';}catch(_){}}return false;}
function openProxAsistanPage(){var ov=document.getElementById('proxAsistanPage');if(!ov)return;_paLoadStore();renderProxAsistanPage();ov.classList.add('on');try{_insSyncUrl('asistan');}catch(e){}document.body.style.overflow='hidden';setTimeout(function(){var i=document.getElementById('paInput');if(i)i.focus();},90);}
function closeProxAsistanPage(){var ov=document.getElementById('proxAsistanPage');if(ov)ov.classList.remove('on');document.body.style.overflow='';}
var DOC={
 "vizyon":{t:"Vizyon & Misyon", h:"<h2>Vizyonumuz</h2><p>1986'dan bu yana İstanbul'un mimari hafızasına değer katan Meridyen Yapı İnşaat A.Ş. olarak vizyonumuz; mühendislik disiplinini estetik anlayışla buluşturarak, nesiller boyu ayakta kalacak, güvenli ve sürdürülebilir yaşam alanları inşa etmektir. Ülkemizin gelişen şehircilik anlayışına öncülük etmeyi, deprem güvenliğini bir tercih değil temel bir zorunluluk olarak konumlandırmayı ve inşa ettiğimiz her yapıda kalıcı bir değer yaratmayı hedefliyoruz. Yerel köklerimizden aldığımız güçle uluslararası standartlarda projeler üretmeyi sürdürüyoruz.</p><h2>Misyonumuz</h2><p>Misyonumuz; kentsel dönüşümden anahtar teslim konut projelerine, kat karşılığı iş birliklerinden kurumsal tadilata kadar üstlendiğimiz her işi; şeffaflık, zamanında teslim ve kusursuz işçilik ilkeleriyle hayata geçirmektir. Yatırımcılarımızın, iş ortaklarımızın ve son kullanıcılarımızın güvenini korumayı en değerli sermayemiz sayıyoruz. Çalışanlarımızın gelişimini destekleyen, iş güvenliğini önceleyen ve çevreye saygılı bir üretim kültürünü tüm süreçlerimize yerleştiriyoruz.</p><h2>Değerlerimiz</h2><ul><li><b>Güven:</b> Verdiğimiz her sözü yazılı taahhüdümüz kadar bağlayıcı sayar, uzun soluklu ilişkiler kurarız.</li><li><b>Dürüstlük:</b> Fiyatlandırmadan malzeme seçimine kadar her aşamada açık ve doğru bilgi paylaşırız.</li><li><b>İş Güvenliği:</b> Şantiyelerimizde 'sıfır kaza' hedefiyle çalışır, insan hayatını her şeyin üzerinde tutarız.</li><li><b>Sürdürülebilirlik:</b> Enerji verimli, çevreye duyarlı ve gelecek nesillere karşı sorumlu bir üretim benimseriz.</li><li><b>Mühendislik Disiplini:</b> Her kararı hesaba, standarda ve bilimsel yönteme dayandırırız.</li><li><b>Şeffaflık:</b> Proje süreçlerini iş ortaklarımızla düzenli olarak ve eksiksiz biçimde paylaşırız.</li></ul>"},
 "yonetim":{t:"Yönetim Kadrosu", h:"<h2>Yönetim Kadromuz</h2><p>Meridyen Yapı İnşaat A.Ş., inşaat sektöründe onlarca yıllık deneyime sahip, alanında uzman bir yönetim kadrosu tarafından yönetilmektedir. Ekibimiz; mühendislik, mimarlık ve kurumsal yönetim disiplinlerini bir araya getirerek projelerimizi en yüksek standartlarda hayata geçirmektedir.</p><h3>Yönetim Kurulu Başkanı — Mehmet Şükrü Aydın</h3><p>Kurucumuz ve Yönetim Kurulu Başkanımız, şirketimizin stratejik yönünü belirler ve kurumsal değerlerimizin bekçiliğini yapar. Otuz yılı aşkın sektör tecrübesiyle Meridyen Yapı'yı güvenilir bir marka haline getirmiştir.</p><h3>Genel Müdür — Elif Nurhan Demirtaş</h3><p>Şirketin günlük operasyonlarını ve ticari stratejilerini yöneten Genel Müdürümüz, kurumsal büyüme ve iş ortaklıklarının sürdürülebilir biçimde geliştirilmesinden sorumludur.</p><h3>Teknik Koordinatör / İnşaat Müdürü — Hakan Yılmaz Öztürk</h3><p>Sahadaki tüm inşaat süreçlerinin planlanması, denetimi ve zamanında teslimi Teknik Koordinatörümüzün sorumluluğundadır. Kalite ve iş güvenliği standartlarının şantiyede eksiksiz uygulanmasını gözetir.</p><h3>Mimari Tasarım Direktörü — Selin Beyza Korkmaz</h3><p>Projelerimizin estetik kimliğini ve fonksiyonel tasarımını yöneten Direktörümüz, modern mimari anlayışı ile kullanıcı konforunu bir araya getiren yaşam alanları tasarlar.</p><h3>Mali İşler & İdari Direktör — Ahmet Kerem Sarıoğlu</h3><p>Şirketin mali yönetimi, bütçeleme, insan kaynakları ve idari süreçlerinin koordinasyonundan sorumludur. Şeffaf ve hesap verebilir bir mali yapının sürdürülmesini sağlar.</p>"},
 "kalite":{t:"Kalite & Sertifikalar", h:"<h2>Kalite Politikamız</h2><p>Meridyen Yapı İnşaat A.Ş. olarak kaliteyi, tesadüfen ulaşılan bir sonuç değil; sistemli süreçlerin, uluslararası standartların ve sürekli iyileştirmenin doğal bir çıktısı olarak görüyoruz. Malzeme tedarikinden işçiliğe, projelendirmeden teslimata kadar her aşamada tanımlı kalite kontrol noktaları uyguluyor, bağımsız denetim mekanizmalarını süreçlerimize entegre ediyoruz. Amacımız; yürürlükteki mevzuata tam uyumun ötesine geçerek, kullanıcı güvenliğini ve memnuniyetini en üst düzeyde güvence altına almaktır.</p><h2>Sertifikalarımız ve Uyum Belgelerimiz</h2><ul><li><b>ISO 9001:2015 Kalite Yönetim Sistemi:</b> Tüm süreçlerimizin standartlaştırılması ve sürekli iyileştirilmesini güvence altına alır.</li><li><b>ISO 14001:2015 Çevre Yönetim Sistemi:</b> Faaliyetlerimizin çevresel etkilerini kontrol altında tutan sistematik yaklaşımı belgeler.</li><li><b>ISO 45001:2018 İş Sağlığı ve Güvenliği Yönetim Sistemi:</b> Şantiyelerimizde iş kazalarını önlemeye yönelik uluslararası standardı temsil eder.</li><li><b>TBDY 2018 Uyumu:</b> Tüm projelerimiz Türkiye Bina Deprem Yönetmeliği 2018 gereklerine tam uyumlu olarak tasarlanır ve inşa edilir.</li><li><b>4708 Sayılı Yapı Denetimi:</b> Yapılarımız, ilgili yasa kapsamında yetkili yapı denetim kuruluşlarınca bağımsız olarak denetlenir.</li><li><b>6306 Kentsel Dönüşüm Yetkisi:</b> Riskli yapıların dönüşümü kapsamında mevzuata uygun projeler geliştirme ehliyetine sahibiz.</li><li><b>BIM Koordinasyonu:</b> Yapı Bilgi Modellemesi (BIM) ile tasarım, maliyet ve saha süreçlerini dijital ortamda entegre ederek hata payını en aza indiriyoruz.</li></ul>"},
 "kariyer":{t:"Kariyer", h:"<h2>Bizimle Çalışın</h2><p>Meridyen Yapı İnşaat A.Ş., çalışanlarını en değerli sermayesi olarak gören, gelişime ve öğrenmeye açık bir kurum kültürüne sahiptir. Ekip arkadaşlarımıza güvenli bir çalışma ortamı, adil bir kariyer patikası ve mühendislik disiplininin ödüllendirildiği bir platform sunuyoruz. Farklılıklara saygı duyan, liyakati esas alan ve sürekli öğrenmeyi teşvik eden bir yapı içinde birlikte büyümeyi hedefliyoruz. Sektörün gelişimine katkı sağlayacak yetenekleri ekibimize katmaktan memnuniyet duyarız.</p><h2>Açık Pozisyonlar</h2><ul><li><b>Şantiye Şefi:</b> Saha operasyonlarının planlanması, ekip yönetimi ve iş programının takibinden sorumlu.</li><li><b>İnşaat Mühendisi:</b> Statik çözümler, metraj ve saha denetimi süreçlerinde görev alacak.</li><li><b>Mimar:</b> Konsept ve uygulama projelerinin geliştirilmesinde rol alacak tasarım odaklı adaylar.</li><li><b>İş Güvenliği Uzmanı:</b> Şantiyelerde İSG mevzuatının uygulanması ve risk analizlerinden sorumlu.</li><li><b>Saha Teknikeri:</b> Uygulama süreçlerinde teknik destek ve saha koordinasyonu görevini üstlenecek.</li></ul><h2>Başvuru</h2><p>Ekibimize katılmak isterseniz, güncel özgeçmişinizi ve başvurmak istediğiniz pozisyonu belirten bir e-postayı <b>kariyer@meridyenyapi.com</b> adresine iletebilirsiniz. Tüm başvurular gizlilik ilkeleri çerçevesinde titizlikle değerlendirilir ve uygun pozisyonlar için sizinle iletişime geçilir.</p>"},
 "kvkk":{t:"KVKK Aydınlatma Metni", h:"<h2>Kişisel Verilerin Korunması Aydınlatma Metni</h2><p>İşbu Aydınlatma Metni, 6698 sayılı Kişisel Verilerin Korunması Kanunu ('KVKK') uyarınca, veri sorumlusu sıfatıyla Meridyen Yapı İnşaat A.Ş. tarafından, kişisel verilerinizin işlenmesine ilişkin usul ve esaslar hakkında sizleri bilgilendirmek amacıyla hazırlanmıştır.</p><h3>Veri Sorumlusu</h3><p>Kişisel verileriniz, veri sorumlusu sıfatıyla Meridyen Yapı İnşaat A.Ş. (İstanbul / Levent) tarafından aşağıda açıklanan kapsamda işlenmektedir.</p><h3>İşlenen Kişisel Veriler</h3><p>Ad-soyad, iletişim bilgileri (telefon, e-posta, adres), kimlik bilgileri, işlem güvenliği verileri, tapu ve gayrimenkul bilgileri ile başvuru formları aracılığıyla tarafımıza ilettiğiniz sair veriler işlenebilmektedir.</p><h3>İşleme Amaçları</h3><p>Kişisel verileriniz; sözleşme süreçlerinin yürütülmesi, proje ve satış-kiralama taleplerinin karşılanması, iletişim faaliyetlerinin sürdürülmesi, yasal yükümlülüklerin yerine getirilmesi ve müşteri memnuniyetinin sağlanması amaçlarıyla işlenmektedir.</p><h3>Hukuki Sebep</h3><p>Verileriniz; bir sözleşmenin kurulması veya ifası, kanunlarda açıkça öngörülmesi, hukuki yükümlülüğün yerine getirilmesi ve meşru menfaat hukuki sebeplerine dayanılarak, gerektiğinde açık rızanız alınarak işlenir.</p><h3>Aktarım</h3><p>Kişisel verileriniz; yasal düzenlemeler çerçevesinde yetkili kamu kurumlarına, yapı denetim kuruluşlarına, iş ortaklarımıza ve hizmet aldığımız tedarikçilere, yalnızca gerekli olduğu ölçüde aktarılabilmektedir.</p><h3>Saklama Süresi</h3><p>Kişisel verileriniz, işleme amacının gerektirdiği süre boyunca ve ilgili mevzuatta öngörülen zamanaşımı süreleri dikkate alınarak saklanır; sürenin sonunda silinir, yok edilir veya anonim hale getirilir.</p><h3>İlgili Kişinin Hakları (KVKK md. 11)</h3><ul><li>Kişisel verilerinizin işlenip işlenmediğini öğrenme,</li><li>İşlenmişse buna ilişkin bilgi talep etme,</li><li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme,</li><li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme,</li><li>Eksik veya yanlış işlenmişse düzeltilmesini isteme,</li><li>KVKK'da öngörülen şartlarla silinmesini veya yok edilmesini isteme,</li><li>İşlenen verilerin münhasıran otomatik sistemlerle analizi sonucu aleyhinize bir sonucun ortaya çıkmasına itiraz etme,</li><li>Kanuna aykırı işleme sebebiyle zarara uğramanız hâlinde zararın giderilmesini talep etme.</li></ul><h3>Başvuru</h3><p>Yukarıda belirtilen haklarınıza ilişkin taleplerinizi <b>info@meridyenyapi.com</b> adresine ya da şirketimizin kayıtlı elektronik posta (KEP) adresine iletebilirsiniz. Başvurularınız en geç 30 gün içinde sonuçlandırılır.</p><p><b>Not:</b> Bu metin temsilî nitelikte olup örnek amaçlıdır.</p>"},
 "gizlilik":{t:"Gizlilik Politikası", h:"<h2>Gizlilik Politikası</h2><p>Meridyen Yapı İnşaat A.Ş. olarak, internet sitemizi ziyaret eden ve hizmetlerimizden faydalanan kullanıcılarımızın gizliliğine büyük önem veriyoruz. İşbu Gizlilik Politikası, tarafımızca toplanan bilgilerin hangi kapsamda ve ne amaçla işlendiğini şeffaf biçimde açıklamak üzere hazırlanmıştır.</p><h3>Toplanan Veriler</h3><p>Sitemiz aracılığıyla; ad-soyad, e-posta adresi, telefon numarası gibi iletişim formu üzerinden gönüllü olarak ilettiğiniz bilgiler ile IP adresi, tarayıcı türü ve ziyaret istatistikleri gibi teknik veriler toplanabilmektedir.</p><h3>Kullanım Amaçları</h3><p>Toplanan veriler; talep ve sorularınıza yanıt vermek, hizmet kalitemizi geliştirmek, size uygun proje ve gayrimenkul seçeneklerini sunmak ve yasal yükümlülüklerimizi yerine getirmek amacıyla kullanılır.</p><h3>Çerezler</h3><p>Sitemiz, kullanıcı deneyimini iyileştirmek amacıyla çerezlerden yararlanır. Çerezlere ilişkin ayrıntılı bilgi için Çerez Politikamızı inceleyebilirsiniz.</p><h3>Üçüncü Taraflar</h3><p>Kişisel verileriniz, açık rızanız veya yasal bir zorunluluk olmadıkça üçüncü taraflarla paylaşılmaz. Yalnızca hizmet sağlayıcılarımızla, gizlilik yükümlülükleri çerçevesinde ve gerekli olduğu ölçüde paylaşım yapılabilir.</p><h3>Veri Güvenliği</h3><p>Verilerinizin yetkisiz erişime, kayba veya kötüye kullanıma karşı korunması için idari ve teknik güvenlik tedbirlerini titizlikle uygularız.</p><h3>Kullanıcı Hakları</h3><p>KVKK kapsamında verilerinize erişme, düzeltilmesini veya silinmesini talep etme haklarına sahipsiniz. Bu talepler için bizimle iletişime geçebilirsiniz.</p><h3>İletişim</h3><p>Gizlilik uygulamalarımıza ilişkin her türlü sorunuz için <b>info@meridyenyapi.com</b> adresinden bize ulaşabilirsiniz.</p><p><b>Not:</b> Bu metin temsilî nitelikte olup örnek amaçlıdır.</p>"},
 "cerez":{t:"Çerez Politikası", h:"<h2>Çerez Politikası</h2><p>Bu Çerez Politikası, Meridyen Yapı İnşaat A.Ş. internet sitesinde kullanılan çerezler hakkında sizleri bilgilendirmek amacıyla hazırlanmıştır. Sitemizi kullanarak, işbu politikada açıklanan çerez uygulamalarını kabul etmiş olursunuz.</p><h3>Çerez Nedir?</h3><p>Çerezler, ziyaret ettiğiniz internet siteleri tarafından tarayıcınıza ve cihazınıza kaydedilen küçük metin dosyalarıdır. Çerezler; sitenin daha verimli çalışmasını sağlamak, kullanıcı tercihlerini hatırlamak ve ziyaret istatistiklerini analiz etmek için kullanılır.</p><h3>Çerez Türleri</h3><ul><li><b>Zorunlu Çerezler:</b> Sitenin temel işlevlerinin çalışması için gereklidir ve devre dışı bırakılamaz.</li><li><b>Analitik Çerezler:</b> Ziyaretçilerin siteyi nasıl kullandığını anonim olarak ölçerek performansı iyileştirmemize yardımcı olur.</li><li><b>Pazarlama Çerezleri:</b> İlgi alanlarınıza uygun içerik ve tanıtımların sunulması amacıyla kullanılır.</li></ul><h3>Çerez Yönetimi ve Tarayıcı Ayarları</h3><p>Tarayıcınızın ayarlarını kullanarak çerezleri kabul edebilir, reddedebilir veya cihazınızda kayıtlı çerezleri silebilirsiniz. Zorunlu çerezlerin devre dışı bırakılması, sitenin bazı bölümlerinin işlevselliğini etkileyebilir. Çerez tercihlerinizi dilediğiniz zaman güncelleyebilirsiniz.</p><h3>Onay</h3><p>Sitemizi kullanmaya devam ederek, zorunlu çerezler dışındaki çerezlerin kullanımına ilişkin tercihlerinizi çerez bildirimi üzerinden yönetebilir ve onayınızı verebilirsiniz. Onayınızı dilediğiniz zaman geri çekebilirsiniz.</p><p><b>Not:</b> Bu metin temsilî nitelikte olup örnek amaçlıdır.</p>"}
};
function openDoc(key){
  renderDoc(key);
  var ov=document.getElementById('docPage');ov.classList.add('on');_insSyncUrl('');document.body.style.overflow='hidden';ov.scrollTop=0;
  if(typeof i18nInit==='function')i18nInit();
  try{history.replaceState(null,'','#doc-'+key);}catch(e){}
}
function closeDoc(){
  _insOvKapat('docPage');document.body.style.overflow='';
  if((location.hash||'').indexOf('#doc-')===0)try{history.replaceState(null,'',location.pathname);}catch(e){}
}
function renderDoc(key){
  /* GÜVENLİK: key doğrudan location.hash'ten geliyor (checkHash → '#doc-'+key).
     Eskiden bilinmeyen anahtar {t:key} ile başlığa aynen basılıyordu ve _brandSubst
     HTML kaçırmadığı için "#doc-<img src=x onerror=...>" betik çalıştırıyordu.
     İki katman: (1) anahtar DOC'ta yoksa saldırgan dizesi hiç basılmaz, sabit
     "bulunamadı" içeriği gösterilir; (2) başlık her hâlükârda _brandEsc'ten geçer.
     d.h ham kalır — bilinen anahtarlarda kasıtlı olarak yapılandırma HTML'idir,
     bilinmeyen anahtarda ise artık bizim sabit metnimiz. */
  var en=(typeof LANG!=='undefined'&&LANG==='en');
  var d=(DOC&&DOC[key])||{t:(en?'Document not found':'Belge bulunamadı'),h:'<p>'+(en?'This content is not available.':'Bu içerik bulunamadı.')+'</p>'};
  var _bn=((typeof BRAND!=='undefined'&&BRAND.name)||'Meridyen')+((typeof BRAND!=='undefined'&&BRAND.name2)||' Yapı');var h='<div class="doc-hero doc-rv"><div class="doc-eyebrow"><i></i> '+_brandEsc(_bn)+'</div><h2 class="h1x">'+_brandEsc(_brandSubst(d.t))+'</h2></div>';
  h+='<div class="doc-content doc-rv">'+_brandSubst(d.h)+'</div>';
  h+='<div class="doc-back doc-rv"><button class="btn btn-primary" onclick="closeDoc()">'+(en?'← Back to site':'← Siteye dön')+'</button></div>';
  document.getElementById('docBody').innerHTML=h;
  var root=document.getElementById('docPage');
  setTimeout(function(){root.querySelectorAll('.doc-rv').forEach(function(el){el.classList.add('in');});},30);
}
function ilSubmit(){
  var en=(typeof LANG!=='undefined'&&LANG==='en');
  var ad=(document.getElementById('il_ad')||{}).value||'', tel=(document.getElementById('il_tel')||{}).value||'', konu=(document.getElementById('il_konu')||{}).value||'', kvkk=(document.getElementById('il_kvkk')||{}).checked;
  if(!ad.trim()||!tel.trim()){alert(en?'Please fill in name and phone.':'Lütfen ad ve telefon girin.');return;}
  if(!kvkk){alert(en?'Please accept the privacy notice.':'Lütfen KVKK onayı verin.');return;}
  try{LEADS.unshift({ad:ad,tel:tel,konu:konu,src:'İletişim Sayfası',date:new Date().toISOString()});saveAll();}catch(e){}
  var b=document.querySelector('#iletisimBody .il-formcard .btn-primary');if(b){b.textContent=en?'✓ Sent — we will call you':'✓ Gönderildi — sizi arayacağız';b.disabled=true;b.style.opacity='.7';}
}
function renderIletisimPage(){
  var s=SETTINGS, en=(typeof LANG!=='undefined'&&LANG==='en');
  var esc=(typeof _brandEsc==='function')?_brandEsc:function(x){return String(x==null?'':x);};
  var mapQ=encodeURIComponent(s.mapQuery||s.firmaAdres||'İstanbul');
  var t=en?{eyebrow:'Contact',h1:"Let's talk about your project",lead:'Contact us for a free site survey, quote, renovation or land-for-flat discussion. Our expert team gets back to you within 24 hours.',addr:'Address',phone:'Phone',mail:'E-mail',hours:'Working Hours',wa:'WhatsApp Line',formT:'Create a Quote Request',formH:'Fill in the form and our expert team will call you within 24 hours.',legalT:'Legal Information / Company Details',legalS:'Mandatory corporate imprint information under the Turkish Commercial Code.',fUnvan:'Company Title',fVd:'Tax Office',fVno:'Tax No',fMersis:'MERSİS No',fTsicil:'Trade Registry No',fOda:'Chamber of Commerce',fKep:'Registered E-mail (KEP)',fYetkili:'Authorized Rep.',note:'The information above is provided in compliance with the Turkish Commercial Code and e-Commerce regulation (imprint obligation). This is a demo; figures are representative.'}
    :{eyebrow:'İletişim',h1:'Projenizi birlikte konuşalım',lead:'Ücretsiz keşif, teklif, tadilat veya kat karşılığı görüşmesi için bize ulaşın. Uzman ekibimiz 24 saat içinde size dönüş yapar.',addr:'Adres',phone:'Telefon',mail:'E-posta',hours:'Çalışma Saatleri',wa:'WhatsApp Hattı',formT:'Teklif Talebi Oluştur',formH:'Formu doldurun, 24 saat içinde uzman ekibimiz sizi arasın.',legalT:'Yasal Bilgiler / Şirket Künyesi',legalS:'Türk Ticaret Kanunu gereği zorunlu kurumsal künye bilgileri.',fUnvan:'Ünvan',fVd:'Vergi Dairesi',fVno:'Vergi No',fMersis:'MERSİS No',fTsicil:'Ticaret Sicil No',fOda:'Ticaret Odası',fKep:'KEP Adresi',fYetkili:'Yetkili',note:'Yukarıdaki bilgiler Türk Ticaret Kanunu ve e-Ticaret mevzuatı (künye zorunluluğu) kapsamında sunulmuştur. Bu bir demodur; bilgiler temsilîdir.'};
  var tel=(s.firmaTel||'').replace(/[^0-9+]/g,''), wa=(s.waNumber||'').replace(/[^0-9]/g,'');
  var h='';
  h+='<div class="il-hero il-rv"><div class="il-eyebrow"><i></i> '+esc(t.eyebrow)+'</div><h2 class="h1x">'+esc(t.h1)+'</h2><p>'+esc(t.lead)+'</p></div>';
  h+='<div class="il-grid"><div class="il-info">';
  h+='<div class="il-card il-rv"><div class="ic">📍</div><div><div class="k">'+esc(t.addr)+'</div><a class="v" href="https://www.google.com/maps?q='+mapQ+'" target="_blank" rel="noopener noreferrer">'+esc(s.firmaAdres)+'</a></div></div>';
  h+='<div class="il-card il-rv"><div class="ic">📞</div><div><div class="k">'+esc(t.phone)+'</div><a class="v" href="tel:'+tel+'">'+esc(s.firmaTel)+'</a></div></div>';
  h+='<div class="il-card il-rv"><div class="ic">✉</div><div><div class="k">'+esc(t.mail)+'</div><a class="v" href="mailto:'+esc(s.firmaEmail)+'">'+esc(s.firmaEmail)+'</a></div></div>';
  h+='<div class="il-card il-rv"><div class="ic">🕘</div><div><div class="k">'+esc(t.hours)+'</div><div class="v">'+esc(s.firmaCalisma||'')+'</div></div></div>';
  h+='<div class="il-card il-rv"><div class="ic" style="background:rgba(37,211,102,.14)">💬</div><div><div class="k">'+esc(t.wa)+'</div><a class="v" href="https://wa.me/'+wa+'" target="_blank" rel="noopener noreferrer">+'+esc(wa)+'</a></div></div>';
  h+='</div>';
  h+='<div class="il-map il-rv"></div></div>';
  h+='<div class="il-formcard il-rv"><h3>'+esc(t.formT)+'</h3><div class="fhint">'+esc(t.formH)+'</div>';
  h+='<div class="fld2"><div class="field"><label>'+(en?'Full Name':'Ad Soyad')+'</label><input type="text" id="il_ad" placeholder="'+(en?'Your Full Name':'Adınız Soyadınız')+'"></div><div class="field"><label>'+(en?'Phone':'Telefon')+'</label><input type="text" id="il_tel" placeholder="05__ ___ __ __"></div></div>';
  h+='<div class="field"><label>'+(en?'E-mail':'E-posta')+'</label><input type="text" id="il_mail" placeholder="'+(en?'example@email.com':'ornek@eposta.com')+'"></div>';
  h+='<div class="field"><label>'+(en?'Subject':'Konu')+'</label><select id="il_konu"><option>'+(en?'Residential project / unit':'Konut projesi / daire')+'</option><option>'+(en?'Renovation':'Tadilat & Renovasyon')+'</option><option>'+(en?'Land-for-flat':'Kat karşılığı inşaat')+'</option><option>'+(en?'Urban renewal':'Kentsel dönüşüm')+'</option><option>'+(en?'Commercial / contracting':'Ticari yapı / taahhüt')+'</option><option>'+(en?'Other':'Diğer')+'</option></select></div>';
  h+='<div class="field"><label>'+(en?'Your message':'Mesajınız')+'</label><textarea id="il_msg" placeholder="'+(en?'Briefly describe your project or request...':'Projeniz veya talebiniz hakkında kısaca bilgi verin...')+'"></textarea></div>';
  h+='<div class="kvkk"><input type="checkbox" id="il_kvkk"><label for="il_kvkk">'+(en?'I consent to the processing of my personal data under the GDPR privacy notice.':'KVKK Aydınlatma Metni kapsamında kişisel verilerimin işlenmesini onaylıyorum.')+'</label></div>';
  h+='<button class="btn btn-primary" style="width:100%;justify-content:center" onclick="ilSubmit()">'+(en?'Send Quote Request':'Teklif Talebini Gönder')+'</button></div>';
  var LF=[[t.fUnvan,s.firmaUnvan],[t.fVd,s.firmaVergiDairesi],[t.fVno,s.firmaVergiNo],[t.fMersis,s.firmaMersis],[t.fTsicil,s.firmaTicaretSicil],[t.fOda,s.firmaOda],[t.fKep,s.firmaKep],[t.fYetkili,s.firmaYetkili]];
  h+='<div class="il-legal il-rv"><h3>'+esc(t.legalT)+'</h3><div class="sub">'+esc(t.legalS)+'</div><div class="il-legal-grid">';
  LF.forEach(function(f){if(f[1])h+='<div class="lg"><div class="k">'+esc(f[0])+'</div><div class="v">'+esc(f[1])+'</div></div>';});
  h+='</div><div class="il-note">'+esc(t.note)+'</div></div>';
  document.getElementById('iletisimBody').innerHTML=h;
  try{_fillMapEmbed(document.querySelector('#iletisimBody .il-map'),'il-map-tag',s.mapQuery,s.firmaAdres);}catch(e){}
  var root=document.getElementById('iletisimPage');
  try{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{root:root,threshold:.1});root.querySelectorAll('.il-rv').forEach(function(el){io.observe(el);});}catch(e){}
  setTimeout(function(){root.querySelectorAll('.il-rv').forEach(function(el){var r=el.getBoundingClientRect();if(r.top<window.innerHeight*1.15)el.classList.add('in');});},80);
}
function renderBolgePage(){
  const b=BOLGELER[_bzIdx];
  // 6-yıllık seri: canlı API b.trend'i (tek-nokta/nesne) bozabilir → dokunulmayan b.t6'dan besle
  const T6=(Array.isArray(b.t6)&&b.t6.length>=2)?b.t6:(Array.isArray(b.trend)&&b.trend.every(v=>typeof v==='number')&&b.trend.length>=2?b.trend:[62,78,95,124,158,185]);
  const maxT=Math.max(...T6);
  const minT=Math.min(...T6);
  const yillar=['2021','2022','2023','2024','2025','2026'];
  const totMah=BOLGELER.reduce((s,x)=>s+x.mahalle,0), totProje=BOLGELER.reduce((s,x)=>s+x.proje,0);
  const maxKat=Math.max(b.kat.konut,b.kat.ticari,b.kat.arsa,b.kat.lux);
  const cw=760, chh=210, padx=12;
  const pts=T6.map((v,i)=>[padx+i*((cw-2*padx)/(T6.length-1)), chh-16-((v-minT)/((maxT-minT)||1))*(chh-48)]);
  const line='M'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' L');
  const area=line+' L'+pts[pts.length-1][0].toFixed(1)+','+chh+' L'+pts[0][0].toFixed(1)+','+chh+' Z';
  const gaugeR=54, gaugeC=2*Math.PI*gaugeR;
  const marj=Math.round((b.kat.konut-b.maliyet)/b.kat.konut*100);
  const cats=[['Konut','konut'],['Ticari','ticari'],['Arsa','arsa'],['Lüks Konut','lux']];
  let h='';
  // HERO — "bölgeye hâkimiz"
  h+=`<div class="bzhero bz-rv"><div class="bzhero-grid"></div><div class="bzhero-in">
      <span class="bzh-eye"><i></i> Canlı Bölge Zekâsı · Meridyen Veri Ağı</span>
      <h2 class="h1x">${(typeof SETTINGS!=='undefined'&&SETTINGS.firmaIl&&SETTINGS.firmaIl!=='İstanbul')?(SETTINGS.firmaIl+' yatırım koridorları,'):('İstanbul\'un yatırım koridorları,')}<br><span class="hl">metrekaresine kadar.</span></h2>
      <p>Faaliyet gösterdiğimiz her bölgede m² fiyatını, inşaat maliyetini, kira getirisini ve deprem riskini güncel veriyle izliyoruz. Kararı rakamlar verir.</p>
      <div class="bzh-stats">
        <div class="bzh-s"><b data-count="${BOLGELER.length}">0</b><span>izlenen ilçe</span></div>
        <div class="bzh-s"><b data-count="${totMah}">0</b><span>canlı mahalle</span></div>
        <div class="bzh-s"><b data-count="${totProje}" data-suf="+">0</b><span>bölgede projemiz</span></div>
        <div class="bzh-s"><b data-count="81">0</b><span>il veri kapsamı</span></div>
      </div></div></div>`;
  // REGION PICKER
  h+=`<div class="bz-pick bz-rv">${BOLGELER.map((x,i)=>`<button class="bzr${i===_bzIdx?' active':''}" onclick="_bzIdx=${i};renderBolgePage()"><b>${x.ad}</b><span>${_bzTL(x.m2n)} ₺ · ${x.delta}%</span></button>`).join('')}</div>`;
  // MAP
  h+=`<div class="bz-sec bz-rv"><div class="sh">Kapsama Haritası</div><div class="ss">Faaliyet bölgelerimiz — her nokta canlı izlenen bir yatırım koridoru. Seçmek için tıklayın.</div>
    <div class="bz-map"><svg viewBox="0 0 400 200" class="bz-map-svg">
      <path class="istshape" d="M20 118 Q60 72 122 82 Q162 60 212 56 Q262 46 300 62 Q352 56 382 92 Q360 122 320 118 Q282 142 232 130 Q182 150 132 136 Q70 146 20 118 Z"/>
      <line class="bosph" x1="150" y1="70" x2="238" y2="122"/>
      ${BOLGELER.map((x,i)=>`<g class="pin${i===_bzIdx?' act':''}" onclick="_bzIdx=${i};renderBolgePage()"><circle class="ring" cx="${x.x}" cy="${x.y}" r="11"/><circle class="dot" cx="${x.x}" cy="${x.y}" r="4.5"/><text x="${x.x}" y="${x.y-15}">${x.ad}</text></g>`).join('')}
    </svg>
    <div class="bz-mapinfo"><div class="mi-big">${b.ad}</div><div class="mi-sub">${b.ilce}</div>
      <div class="mi-row"><span>Ortalama m² (konut)</span><b>${_bzTL(b.m2n)} ₺</b></div>
      <div class="mi-row"><span>Son 12 ay</span><b class="up">${b.delta}%</b></div>
      <div class="mi-row"><span>Bölgede projemiz</span><b>${b.proje}</b></div>
      <div class="mi-row"><span>Canlı mahalle</span><b>${b.mahalle}</b></div></div>
    </div></div>`;
  // KATEGORİ m²
  h+=`<div class="bz-sec bz-rv"><div class="sh">Kategoriye Göre Ortalama m² Fiyatı</div><div class="ss">${b.ad} · konut, ticari, arsa ve lüks segment m² fiyatları (₺). Sağdaki oran il ortalamasına kıyastır.</div>
    <div class="bz-cats">${cats.map(c=>{const v=b.kat[c[1]];const w=Math.round(v/maxKat*100);const vsIl=Math.round((v/b.ilAvg-1)*100);return `<div class="catrow"><div class="cl">${c[0]}</div><div class="ct"><div class="cf" data-w="${w}"></div></div><div class="cv"><b data-count="${v}" data-tl="1">0</b> ₺ <span class="${vsIl>=0?'up':'dn'}">${vsIl>=0?'+':''}${vsIl}% il ort.</span></div></div>`;}).join('')}</div></div>`;
  // TREND
  h+=`<div class="bz-sec bz-rv"><div class="sh">6 Yıllık Fiyat Trendi</div><div class="ss">${b.ad} bölgesinde ortalama m² fiyat seyri (bin ₺) · 2021→2026.</div>
    <div class="bz-trend2"><div class="tt"><h4>${b.ad} · endeks</h4><div class="big"><b data-count="${b.deltaN}" data-dec="1" data-suf="%" class="up">0</b> <span>son 12 ay</span></div></div>
      <svg viewBox="0 0 ${cw} ${chh}" class="bz-linechart"><defs><linearGradient id="bzfill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--accent)" stop-opacity=".3"/><stop offset="1" stop-color="var(--accent)" stop-opacity="0"/></linearGradient></defs>
        ${[0,1,2,3].map(g=>`<line class="grid" x1="0" y1="${(16+g*((chh-48)/3)).toFixed(1)}" x2="${cw}" y2="${(16+g*((chh-48)/3)).toFixed(1)}"/>`).join('')}
        <path class="areap" d="${area}" fill="url(#bzfill)" opacity="0"/><path class="linep" d="${line}" fill="none"/>
        ${pts.map(p=>`<circle class="ldot" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="3.6"/>`).join('')}
      </svg><div class="bz-yrs">${yillar.map(y=>`<span>${y}</span>`).join('')}</div></div></div>`;
  // İNŞAAT MALİYETİ → SATIŞ
  h+=`<div class="bz-sec bz-rv"><div class="sh">İnşaat Maliyeti → Satış Değeri</div><div class="ss">Bölgede ortalama inşaat maliyeti ile satış m² değeri arasındaki fark — geliştirici potansiyel marjı.</div>
    <div class="bz-margin"><div class="mg-col"><div class="mg-k">İnşaat maliyeti / m²</div><div class="mg-bar cost"><div class="mgf" data-w="${Math.round(b.maliyet/b.kat.konut*100)}"></div></div><div class="mg-v"><b data-count="${b.maliyet}" data-tl="1">0</b> ₺</div></div>
      <div class="mg-col"><div class="mg-k">Satış değeri / m²</div><div class="mg-bar sale"><div class="mgf" data-w="100"></div></div><div class="mg-v"><b data-count="${b.kat.konut}" data-tl="1">0</b> ₺</div></div>
      <div class="mg-out"><div class="mo-k">Potansiyel marj</div><div class="mo-v"><b data-count="${marj}" data-suf="%">0</b></div><div class="mo-note">satış − maliyet farkı</div></div></div></div>`;
  // SKOR + RİSK
  h+=`<div class="bz-sec bz-rv"><div class="sh">Yatırım Skoru & Risk</div><div class="ss">Bölgesel getiri potansiyeli, yaşam kalitesi, talep yoğunluğu ve coğrafi/deprem risk analizi.</div>
    <div class="bz-scorewrap"><div class="bz-gauge"><svg viewBox="0 0 140 140"><circle class="gtrack" cx="70" cy="70" r="${gaugeR}"/><circle class="gfill" cx="70" cy="70" r="${gaugeR}" data-c="${gaugeC.toFixed(1)}" data-off="${(gaugeC*(1-b.skor/100)).toFixed(1)}" transform="rotate(-90 70 70)"/></svg><div class="gcx"><b data-count="${b.skor}">0</b><span>/100 skor</span></div></div>
      <div class="bz-scorebars">
        <div class="sbrow"><span>Yatırım Skoru</span><div class="sbt"><div class="sbf" data-w="${b.skor}"></div></div><b>${b.skor}</b></div>
        <div class="sbrow"><span>Yaşam Kalitesi</span><div class="sbt"><div class="sbf" data-w="${b.yasam}"></div></div><b>${b.yasam}</b></div>
        <div class="sbrow"><span>Talep Yoğunluğu</span><div class="sbt"><div class="sbf" data-w="${b.talep}"></div></div><b>${b.talep}</b></div>
        <div class="sbrow"><span>Tapu Hareketi</span><div class="sbt"><div class="sbf hot" data-w="${Math.min(b.tapuN*3,100)}"></div></div><b>${b.tapu}%</b></div>
      </div></div>
    <div class="bz-geo">${[b.fault,b.sea,b.transport].map(g=>{const ic=g.t.includes('Fay')?'⚠️':(g.t.includes('Deniz')||g.t.includes('Doğal')?'🌊':'🚇');return `<div class="gc"><div class="ic">${ic}</div><div><h5>${g.t}</h5><p>${g.d}</p><span class="tag ${g.tag==='warn'?'warn':(g.tag==='orta'?'mid':'ok')}">${g.tagt}</span></div></div>`;}).join('')}</div></div>`;
  // KİRA & GETİRİ
  h+=`<div class="bz-sec bz-rv"><div class="sh">Kira & Getiri</div><div class="ss">Ortalama kira (₺/m²/ay), yıllık brüt kira getirisi ve arz/talep dengesi.</div>
    <div class="bz-rent"><div class="rc"><div class="k">Ortalama kira</div><div class="v"><b data-count="${b.kira}">0</b> ₺<small>/m²·ay</small></div></div>
      <div class="rc"><div class="k">Brüt kira getirisi</div><div class="v"><b data-count="${b.getiri}" data-dec="1" data-suf="%">0</b></div><div class="bar"><i data-w="${Math.round(b.getiri/6*100)}"></i></div></div>
      <div class="rc"><div class="k">Talep / Arz dengesi</div><div class="v"><b data-count="${b.talep}">0</b><small>talep · ${b.arz} arz</small></div><div class="bar"><i data-w="${b.talep}"></i></div></div></div></div>`;
  // 4) MERIDYEN BÖLGESEL GÜÇ (profesyonel konumlandırma)
  h+='<div class="bz-sec"><div class="bz-power">'+
    '<p class="lead">Veriyi okumak başlangıç; asıl fark sahada ortaya çıkar. Faaliyet bölgelerimizde kurulu tedarik zincirimiz ve yerel ekibimizle süreci yalnızca planlamıyor, sonuna kadar yürütüp teslim ediyoruz.</p>'+
    '<p class="sub">Yerel taşeron ve malzeme ağımız, belediye ve resmi kurum ilişkilerimiz, maliyet öngörümüz ve saha yönetim disiplinimiz; bir projeyi konuşulan fikir olmaktan çıkarıp zamanında tamamlanan bir yapıya dönüştürür. Taahhüdümüz iddia değil, teslim edilmiş işlerle kanıtlıdır.</p>'+
    '<div class="bz-cap">'+
      '<div class="cap"><div class="n">01</div><div><h5>Yerel Tedarik Zinciri</h5><p>Bölgedeki anlaşmalı malzeme tedarikçileri ve uzman taşeron ağıyla kesintisiz, maliyeti öngörülebilir üretim.</p></div></div>'+
      '<div class="cap"><div class="n">02</div><div><h5>Maliyet & Bütçe Yönetimi</h5><p>Güncel birim fiyat verisiyle gerçekçi keşif, hakediş sistemiyle şeffaf maliyet kontrolü ve sapma yönetimi.</p></div></div>'+
      '<div class="cap"><div class="n">03</div><div><h5>İmar, Ruhsat & Belediye Süreçleri</h5><p>Plan-proje onayı, ruhsat ve iskan dahil resmi kurum süreçlerini deneyimli teknik ekibimizle hızlı yönetiyoruz.</p></div></div>'+
      '<div class="cap"><div class="n">04</div><div><h5>Saha Yönetimi & Zamanında Teslim</h5><p>CPM kritik yol planlaması, BIM koordinasyonu ve İSG disipliniyle takvime sadık, eksiksiz teslim.</p></div></div>'+
    '</div>'+
    '<div class="bz-strip">'+
      '<div class="s"><div class="v">38+</div><div class="l">yıllık saha tecrübesi</div></div>'+
      '<div class="s"><div class="v">120+</div><div class="l">tamamlanmış proje</div></div>'+
      '<div class="s"><div class="v">%96</div><div class="l">zamanında teslim oranı</div></div>'+
      '<div class="s"><div class="v">7/24</div><div class="l">saha & proje yönetimi</div></div>'+
    '</div>'+
    '</div></div>';
  // 5) CTA
  h+='<div class="bz-cta"><h3>Bölgenizdeki projeyi birlikte hayata geçirelim</h3><p>Arsanız veya projeniz için bölgesel fizibilite, maliyet öngörüsü ve uçtan uca yönetim teklifimizi alın.</p><button class="btn" onclick="closeBolgePage();openTeklif()">Bölgesel Fizibilite & Teklif Al →</button></div>';
  h+='<p class="bz-disc">Gösterilen endeks, skor ve risk verileri bölge veri yapısına uygun temsili örneklerdir; kurumsal API anahtarıyla canlı verilerle güncellenir. Resmi değerleme yerine geçmez.</p>';
  document.getElementById('bzBody').innerHTML=h;
  _bzAnimate();
  if(typeof i18nInit==='function')i18nInit();
}
function _bzAnimate(){
  var root=document.getElementById('bolgePage'); if(!root) return;
  var RM=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function run(sec){
    sec.querySelectorAll('[data-count]').forEach(function(el){
      if(el._c)return; el._c=1;
      var to=parseFloat(el.getAttribute('data-count'))||0, dec=parseInt(el.getAttribute('data-dec')||'0',10), suf=el.getAttribute('data-suf')||'', tl=el.getAttribute('data-tl');
      function put(v){ el.textContent=(tl?_bzTL(Math.round(v)):(dec?v.toFixed(dec):Math.round(v).toString()))+suf; }
      if(RM){put(to);return;}
      var steps=42, i=0;
      var iv=setInterval(function(){ i++; var p=i/steps, e=1-Math.pow(1-p,3); put(to*e); if(i>=steps){clearInterval(iv); put(to);} }, 28);
    });
    sec.querySelectorAll('[data-w]').forEach(function(el){
      var w=(el.getAttribute('data-w')||0)+'%';
      if(RM){el.style.width=w;return;}
      el.style.width='0%';
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.style.width=w; }); });
      setTimeout(function(){ if(parseFloat(el.style.width||0)===0) el.style.width=w; }, 60);
    });
    sec.querySelectorAll('.gfill').forEach(function(el){
      var c=parseFloat(el.getAttribute('data-c')), off=parseFloat(el.getAttribute('data-off'));
      el.style.strokeDasharray=c;
      if(RM){el.style.strokeDashoffset=off;return;}
      el.style.strokeDashoffset=c;
      requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.style.strokeDashoffset=off; }); });
      setTimeout(function(){ el.style.strokeDashoffset=off; }, 80);
    });
    sec.querySelectorAll('.linep').forEach(function(el){
      try{ var L=el.getTotalLength(); el.style.strokeDasharray=L;
        if(RM){el.style.strokeDashoffset=0;return;}
        el.style.strokeDashoffset=L;
        requestAnimationFrame(function(){ requestAnimationFrame(function(){ el.style.strokeDashoffset=0; }); });
        setTimeout(function(){ el.style.strokeDashoffset=0; }, 80);
      }catch(e){}
    });
    sec.querySelectorAll('.areap').forEach(function(el){ setTimeout(function(){el.style.opacity=1;}, RM?0:600); });
    sec.querySelectorAll('.ldot').forEach(function(el,i){ el.style.opacity=0; setTimeout(function(){el.style.opacity=1;}, RM?0:600+i*110); });
  }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); run(e.target); io.unobserve(e.target); } }); }, {root:root,threshold:.12});
  root.querySelectorAll('.bz-rv').forEach(function(el){ io.observe(el); });
  // güvence: overlay display:none iken IO gecikirse, ilk ekranı hemen tetikle
  setTimeout(function(){ root.querySelectorAll('.bz-rv').forEach(function(el){ if(!el.classList.contains('in')){ var r=el.getBoundingClientRect(); if(r.top<window.innerHeight*1.1){ el.classList.add('in'); run(el); io.unobserve(el); } } }); }, 120);
}

// ===== /HIZMETLER SAYFASI =====
function hpGo(id){
  if(id==='bolge'){openBolgePage();closeHizmetlerPage();return false;}
  closeHizmetlerPage();
  setTimeout(()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},150);
  return false;
}
function openHizmetlerPage(){
  renderHizmetlerPage();
  const ov=document.getElementById('hizmetlerPage');ov.classList.add('on');_insSyncUrl('hizmetler');document.body.style.overflow='hidden';ov.scrollTop=0;
  _ovReveal('hizmetlerPage');
  /* URL: temiz router yönetir */
}
function closeHizmetlerPage(){
  _insOvKapat('hizmetlerPage');
  document.body.style.overflow='';
  /* URL: temiz router yönetir */
}
function renderHizmetlerPage(){
  var h='';
  h+=_hpHeroScene();
  h+='<div class="hs-intro sd-rv"><span class="hs-kick">Uzmanlık Alanları</span><h2>Mühendislik disiplini, sahada karşılığı olan taahhüt</h2><p>1986’dan bu yana; zemin etüdünden statik projeye, yapı denetiminden iskâna kadar her aşamayı kendi mühendis ve mimar kadromuzla yönetiyoruz. Aşağıdaki her hizmet; kendi süreç akışı, mevzuat çerçevesi, risk yönetimi ve somut güvenceleriyle uçtan uca sunulur.</p></div>';
  h+=SERVICES.map(function(s,i){return _hpServiceSection(s,i);}).join('');
  h+=_hpMethodology();
  h+=_hpAssurance();
  document.getElementById('hpGrid').innerHTML=h;
}
// hizmet başına tam bölüm (özel animasyonlu SVG + mühendislik metni + kapsam + mini süreç + risk + güvence)
function _hpServiceSection(s,i){
  var esc=function(x){return String(x==null?'':x);};
  var num=('0'+(i+1)).slice(-2);
  var scope=(s.scope||[]).slice(0,6).map(function(x){return '<li>'+esc(x)+'</li>';}).join('');
  var steps=(s.steps||[]).map(function(st,idx){return '<span class="hs-step"><b>'+(idx+1)+'</b>'+esc(st.t)+'</span>';}).join('<i class="hs-arw">→</i>');
  var mev=(s.mevzuat||[]).slice(0,4).map(function(m){return '<span class="hs-badge">'+esc(m)+'</span>';}).join('');
  var risk=(s.risks&&s.risks[0])?('<div class="hs-risk"><span class="hs-risk-h">⚠ Öne çıkan risk & yönetimi</span><b>'+esc(s.risks[0].t)+'</b><p>'+esc(s.risks[0].d)+'</p></div>'):'';
  var guar=(s.guarantee||[]).slice(0,3).map(function(g){return '<span class="hs-g">✓ '+esc(g)+'</span>';}).join('');
  return '<section class="hs-svc sd-rv'+(i%2?' alt':'')+'">'
    +'<div class="hs-gfx">'+_svcScene(i)+'</div>'
    +'<div class="hs-body">'
      +'<div class="hs-eyebrow"><span class="hs-num">'+num+'</span><span class="hs-ic">'+esc(s.i)+'</span> Uzmanlık Alanı</div>'
      +'<h3>'+esc(s.t)+'</h3>'
      +'<div class="hs-meta">'+mev+'</div>'
      +'<p class="hs-lead">'+esc(s.long||s.d||'')+'</p>'
      +'<ul class="hs-points">'+scope+'</ul>'
      +(steps?('<div class="hs-flow-wrap"><span class="hs-flow-lbl">Süreç</span><div class="hs-flow">'+steps+'</div></div>'):'')
      +risk
      +(guar?('<div class="hs-guars">'+guar+'</div>'):'')
      +'<button class="btn btn-primary hs-detail" onclick="openSvcDetail('+i+')">Detaylı incele — tam süreç, riskler, sözlük & SSS →</button>'
    +'</div>'
  +'</section>';
}
// ==== animasyonlu SVG sahneler (hizmete özel) ====
function _scw(inner){return '<svg viewBox="0 0 440 300" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><rect width="440" height="300" rx="18" style="fill:var(--surface-2,var(--surface))"/><g class="bpg" style="stroke:var(--line);opacity:.35"><line x1="0" y1="100" x2="440" y2="100"/><line x1="0" y1="200" x2="440" y2="200"/><line x1="146" y1="0" x2="146" y2="300"/><line x1="293" y1="0" x2="293" y2="300"/></g>'+inner+'</svg>';}
function _svcScene(i){
  var BR='fill:var(--muted)', AC='fill:var(--accent)', A2='fill:var(--accent-2,var(--accent))', ST='stroke:var(--accent);stroke-width:3.5';
  switch(i){
   case 0: // Konut İnşaatı — yükselen bloklar + vinç
    return _scw(
     '<rect class="rise" style="'+BR+';animation-delay:.05s" x="66" y="150" width="70" height="100" rx="4"/>'
     +'<rect class="rise" style="'+BR+';animation-delay:.20s" x="150" y="82" width="94" height="168" rx="4"/>'
     +'<rect class="rise" style="'+BR+';animation-delay:.34s" x="258" y="128" width="74" height="122" rx="4"/>'
     +'<g class="wg"><rect class="pop" style="'+AC+';animation-delay:.75s" x="166" y="102" width="18" height="14" rx="2"/><rect class="pop" style="'+AC+';animation-delay:.85s" x="196" y="102" width="18" height="14" rx="2"/><rect class="pop" style="'+AC+';animation-delay:.95s" x="166" y="132" width="18" height="14" rx="2"/><rect class="pop" style="'+AC+';animation-delay:1.05s" x="196" y="132" width="18" height="14" rx="2"/></g>'
     +'<line class="draw" style="--l:190;'+ST+';animation-delay:.15s" x1="366" y1="250" x2="366" y2="62"/>'
     +'<line class="draw" style="--l:132;'+ST+';animation-delay:.45s" x1="366" y1="70" x2="250" y2="70"/>'
     +'<line class="draw" style="--l:44;'+ST+';animation-delay:.75s" x1="300" y1="70" x2="300" y2="110"/>'
     +'<rect class="pulse" style="'+AC+'" x="292" y="110" width="16" height="11" rx="2"/>'
     +'<line class="draw" style="--l:384;'+ST+';stroke-width:2.5;animation-delay:0s" x1="28" y1="250" x2="412" y2="250"/>'
    );
   case 1: // Tadilat & Renovasyon — mekan + rulo + yeni renk
    return _scw(
     '<rect class="draw" style="--l:640;stroke:var(--line);stroke-width:2.5;fill:none;animation-delay:.1s" x="70" y="70" width="300" height="180" rx="8"/>'
     +'<rect class="rise" style="'+AC+';opacity:.9;animation-delay:.5s" x="80" y="150" width="150" height="90"/>'
     +'<rect style="fill:var(--muted);opacity:.5" x="232" y="80" width="128" height="160" rx="3"/>'
     +'<g style="'+A2+'"><rect class="pop" style="animation-delay:.9s" x="248" y="150" width="30" height="30" rx="3"/><rect class="pop" style="animation-delay:1s" x="284" y="150" width="30" height="30" rx="3"/><rect class="pop" style="animation-delay:1.1s" x="320" y="150" width="30" height="30" rx="3"/></g>'
     +'<g class="pulse" style="stroke:var(--accent);stroke-width:5;fill:none;stroke-linecap:round"><line x1="150" y1="60" x2="150" y2="150"/></g>'
     +'<rect class="pop" style="'+AC+';animation-delay:.4s" x="120" y="44" width="70" height="20" rx="5"/>'
    );
   case 2: // Kentsel Dönüşüm — eski → yeni dönüşüm
    return _scw(
     '<rect class="rise" style="fill:var(--muted);opacity:.55;animation-delay:.1s" x="60" y="120" width="96" height="130" rx="4"/>'
     +'<line class="draw" style="--l:120;stroke:var(--line);stroke-width:3;fill:none;animation-delay:.4s" x1="86" y1="130" x2="130" y2="230"/>'
     +'<line class="draw" style="--l:90;stroke:var(--line);stroke-width:3;fill:none;animation-delay:.55s" x1="120" y1="140" x2="96" y2="220"/>'
     +'<g class="draw" style="--l:120;'+ST+';fill:none;stroke-linecap:round;animation-delay:.7s"><line x1="188" y1="185" x2="252" y2="185"/><polyline points="236,168 254,185 236,202" style="fill:none"/></g>'
     +'<rect class="rise" style="fill:var(--muted);animation-delay:.9s" x="286" y="78" width="96" height="172" rx="4"/>'
     +'<g style="'+AC+'"><rect class="pop" style="animation-delay:1.2s" x="300" y="96" width="16" height="12" rx="2"/><rect class="pop" style="animation-delay:1.3s" x="326" y="96" width="16" height="12" rx="2"/><rect class="pop" style="animation-delay:1.4s" x="352" y="96" width="16" height="12" rx="2"/></g>'
     +'<circle class="pulse" style="fill:none;stroke:var(--accent);stroke-width:3" cx="334" cy="52" r="16"/>'
    );
   case 3: // Anahtar Teslim — bina + anahtar + onay mührü
    return _scw(
     '<rect class="rise" style="'+BR+';animation-delay:.15s" x="70" y="96" width="150" height="154" rx="5"/>'
     +'<g style="'+AC+'"><rect class="pop" style="animation-delay:.7s" x="90" y="118" width="20" height="16" rx="2"/><rect class="pop" style="animation-delay:.8s" x="122" y="118" width="20" height="16" rx="2"/><rect class="pop" style="animation-delay:.9s" x="90" y="150" width="20" height="16" rx="2"/></g>'
     +'<circle class="draw" style="--l:150;'+ST+';fill:none;animation-delay:.5s" cx="300" cy="150" r="24"/>'
     +'<line class="draw" style="--l:110;'+ST+';stroke-width:9;stroke-linecap:round;animation-delay:.8s" x1="320" y1="150" x2="392" y2="150"/>'
     +'<line class="draw" style="--l:20;'+ST+';stroke-width:9;stroke-linecap:round;animation-delay:1.05s" x1="372" y1="150" x2="372" y2="172"/>'
     +'<line class="draw" style="--l:20;'+ST+';stroke-width:9;stroke-linecap:round;animation-delay:1.15s" x1="390" y1="150" x2="390" y2="170"/>'
     +'<g class="pop pulse" style="animation-delay:1.3s"><circle style="'+AC+'" cx="250" cy="70" r="20"/><polyline points="240,70 248,79 262,62" style="fill:none;stroke:var(--on-accent,#fff);stroke-width:3.5;stroke-linecap:round;stroke-linejoin:round"/></g>'
    );
   case 4: // Kat Karşılığı — paylaşım + el sıkışma
    return _scw(
     '<rect class="rise" style="'+BR+';animation-delay:.15s" x="150" y="80" width="140" height="170" rx="5"/>'
     +'<line class="draw" style="--l:170;stroke:var(--accent-2,var(--accent));stroke-width:3;fill:none;stroke-dasharray:8 8;animation-delay:.6s" x1="220" y1="80" x2="220" y2="250"/>'
     +'<g style="'+AC+'"><rect class="pop" style="animation-delay:.9s" x="166" y="100" width="18" height="14" rx="2"/><rect class="pop" style="animation-delay:1s" x="166" y="128" width="18" height="14" rx="2"/></g>'
     +'<text x="185" y="235" style="fill:var(--accent);font:800 1.25rem sans-serif" class="pop">%50</text>'
     +'<text x="238" y="235" style="fill:var(--accent-2,var(--accent));font:800 1.25rem sans-serif" class="pop">%50</text>'
     +'<g class="draw" style="--l:120;'+ST+';fill:none;stroke-linecap:round;stroke-width:5;animation-delay:1.1s"><path d="M60 60 L100 78 L150 60" style="fill:none"/><path d="M330 60 L360 78 L400 60" style="fill:none"/></g>'
    );
   case 5: // Ticari & Karma — plaza + pencere ızgara + sinyal
    return _scw(
     '<rect class="rise" style="'+BR+';animation-delay:.15s" x="120" y="56" width="120" height="194" rx="5"/>'
     +'<rect class="rise" style="'+BR+';opacity:.7;animation-delay:.3s" x="252" y="120" width="96" height="130" rx="5"/>'
     +'<g style="'+AC+'"><rect class="pop" style="animation-delay:.7s" x="136" y="76" width="20" height="16" rx="2"/><rect class="pop" style="animation-delay:.78s" x="166" y="76" width="20" height="16" rx="2"/><rect class="pop" style="animation-delay:.86s" x="196" y="76" width="20" height="16" rx="2"/><rect class="pop" style="animation-delay:.94s" x="136" y="102" width="20" height="16" rx="2"/><rect class="pop" style="animation-delay:1.02s" x="166" y="102" width="20" height="16" rx="2"/><rect class="pop" style="animation-delay:1.1s" x="196" y="102" width="20" height="16" rx="2"/></g>'
     +'<g class="pulse" style="fill:none;stroke:var(--accent);stroke-width:3;stroke-linecap:round"><path d="M180 44 q-14 -14 -28 0"/><path d="M188 36 q-22 -22 -44 0"/></g>'
     +'<circle style="'+AC+'" cx="180" cy="48" r="4"/>'
    );
   case 6: // Güçlendirme — kolon + FRP sargı + kalkan
    return _scw(
     '<rect class="rise" style="fill:var(--muted);animation-delay:.15s" x="150" y="60" width="70" height="200" rx="4"/>'
     +'<g style="'+AC+'"><rect class="pop" style="animation-delay:.6s" x="144" y="96" width="82" height="16" rx="3"/><rect class="pop" style="animation-delay:.75s" x="144" y="150" width="82" height="16" rx="3"/><rect class="pop" style="animation-delay:.9s" x="144" y="204" width="82" height="16" rx="3"/></g>'
     +'<line class="draw" style="--l:150;'+ST+';fill:none;stroke-linecap:round;animation-delay:1s" x1="240" y1="70" x2="330" y2="250"/>'
     +'<line class="draw" style="--l:150;'+ST+';fill:none;stroke-linecap:round;animation-delay:1.1s" x1="330" y1="70" x2="240" y2="250"/>'
     +'<g class="pop pulse" style="animation-delay:1.3s"><path d="M360 70 l34 12 v26 c0 24 -17 36 -34 44 c-17 -8 -34 -20 -34 -44 v-26 z" style="fill:none;stroke:var(--accent);stroke-width:3"/><polyline points="348,116 358,126 374,106" style="fill:none;stroke:var(--accent);stroke-width:3;stroke-linecap:round;stroke-linejoin:round"/></g>'
    );
   case 7: // Endüstriyel — geniş çelik makas çatı + baca
    return _scw(
     '<rect class="rise" style="'+BR+';animation-delay:.2s" x="60" y="150" width="320" height="100" rx="4"/>'
     +'<polyline class="draw" style="--l:520;'+ST+';fill:none;stroke-linejoin:round;stroke-linecap:round;animation-delay:.4s" points="52,150 120,110 188,150 256,110 324,150 388,110"/>'
     +'<polyline class="draw" style="--l:360;stroke:var(--accent-2,var(--accent));stroke-width:2.5;fill:none;animation-delay:.7s" points="120,110 120,150 188,110 188,150 256,110 256,150 324,110 324,150"/>'
     +'<rect class="rise" style="'+BR+';animation-delay:.9s" x="330" y="70" width="26" height="80" rx="3"/>'
     +'<circle class="pulse" style="'+AC+'" cx="343" cy="58" r="7"/>'
     +'<g style="'+AC+'"><rect class="pop" style="animation-delay:1s" x="90" y="180" width="40" height="50" rx="3"/><rect class="pop" style="animation-delay:1.1s" x="150" y="180" width="40" height="50" rx="3"/></g>'
    );
   default: return _scw('<rect class="rise" style="'+BR+';animation-delay:.15s" x="150" y="90" width="140" height="160" rx="6"/>');
  }
}
// hero — geniş animasyonlu şantiye silüeti
function _hpHeroScene(){
  return '<div class="hp-scene sd-rv" aria-hidden="true"><svg viewBox="0 0 1200 300" preserveAspectRatio="xMidYMid slice">'
    +'<rect width="1200" height="300" style="fill:var(--surface-2,var(--surface))"/>'
    +'<g style="stroke:var(--line);opacity:.3"><line x1="0" y1="80" x2="1200" y2="80"/><line x1="0" y1="160" x2="1200" y2="160"/><line x1="0" y1="240" x2="1200" y2="240"/><line x1="300" y1="0" x2="300" y2="300"/><line x1="600" y1="0" x2="600" y2="300"/><line x1="900" y1="0" x2="900" y2="300"/></g>'
    +'<g style="fill:var(--muted)">'
      +'<rect class="rise" style="animation-delay:.05s" x="120" y="150" width="120" height="120" rx="5"/>'
      +'<rect class="rise" style="animation-delay:.18s" x="270" y="90" width="140" height="180" rx="5"/>'
      +'<rect class="rise" style="animation-delay:.32s" x="440" y="130" width="120" height="140" rx="5"/>'
      +'<rect class="rise" style="animation-delay:.46s" x="760" y="70" width="150" height="200" rx="5"/>'
      +'<rect class="rise" style="animation-delay:.60s" x="940" y="140" width="130" height="130" rx="5"/>'
    +'</g>'
    +'<g style="fill:var(--accent)"><rect class="pop" style="animation-delay:.9s" x="300" y="120" width="26" height="20" rx="3"/><rect class="pop" style="animation-delay:1s" x="344" y="120" width="26" height="20" rx="3"/><rect class="pop" style="animation-delay:1.1s" x="300" y="160" width="26" height="20" rx="3"/><rect class="pop" style="animation-delay:1.2s" x="790" y="100" width="26" height="20" rx="3"/><rect class="pop" style="animation-delay:1.3s" x="834" y="100" width="26" height="20" rx="3"/><rect class="pop" style="animation-delay:1.4s" x="790" y="140" width="26" height="20" rx="3"/></g>'
    +'<g style="stroke:var(--accent);stroke-width:4;fill:none;stroke-linecap:round">'
      +'<line class="draw" style="--l:230;animation-delay:.2s" x1="640" y1="270" x2="640" y2="44"/>'
      +'<line class="draw" style="--l:180;animation-delay:.5s" x1="640" y1="54" x2="470" y2="54"/>'
      +'<line class="draw" style="--l:60;animation-delay:.8s" x1="560" y1="54" x2="560" y2="112"/>'
    +'</g>'
    +'<rect class="pulse" style="fill:var(--accent)" x="550" y="112" width="20" height="14" rx="3"/>'
    +'<line class="draw" style="--l:1140;stroke:var(--accent);stroke-width:3;fill:none;stroke-linecap:round" x1="30" y1="270" x2="1170" y2="270"/>'
    +'</svg></div>';
}
// 8 aşamalı denetimli süreç
function _hpMethodology(){
  var steps=[['Keşif & Etüt','Zemin etüdü, imar analizi, fizibilite'],['Proje & Ruhsat','Mimari · statik · MEP + yapı ruhsatı'],['Sözleşme','Sabit bedel, teminat, cezai şart'],['Hafriyat & Temel','İksa, radye/kazıklı temel'],['Kaba Yapı','Betonarme karkas — TBDY 2018'],['İnce İmalat','Cephe, mekanik-elektrik, ince işler'],['İskân','Yapı denetim uygunluğu, enerji belgesi'],['Kesin Kabul','Garanti & teminat süresi sonu']];
  var nodes=steps.map(function(st,i){return '<div class="mth-node"><div class="mth-dot">'+(i+1)+'</div><h4>'+st[0]+'</h4><p>'+st[1]+'</p></div>';}).join('');
  return '<section class="hs-mth sd-rv"><span class="hs-kick center">Nasıl Çalışıyoruz</span><h2 class="center">8 Aşamalı Denetimli Süreç</h2><p class="hs-sub center">Her proje; keşiften kesin kabule kadar sekiz denetimli aşamadan geçer. Her aşama yapı denetimi ve kendi kalite kontrolümüzle belgelenir.</p><div class="mth-flow">'+nodes+'</div></section>';
}
// neden biz / somut güvenceler
function _hpAssurance(){
  var items=[['🛡️','Bina Tamamlama Sigortası','İş yarım kalırsa binayı tamamlatan veya ödemeleri yasal faiziyle iade eden güvence.'],['📄','Noter Onaylı Sözleşme','Sabit götürü bedel, net teslim tarihi, cezai şart ve teminat ipoteği.'],['🏗️','TBDY 2018 & Yapı Denetimi','Her etap bağımsız denetim + donatı/beton QA aşama kontrolleriyle belgelenir.'],['📊','Şeffaf İlerleme','Haftalık hakediş ve ilerleme raporlarıyla izlenebilir süreç.'],['🧭','Tek Muhatap (EPC)','Tasarımdan iskâna tüm sorumluluk tek elde; koordinasyon boşluğu yok.'],['♻️','A Sınıfı Enerji & BIM','BIM koordinasyonu, clash detection ve yüksek enerji performansı.']];
  var cards=items.map(function(it){return '<div class="asr-card"><div class="asr-ic">'+it[0]+'</div><h4>'+it[1]+'</h4><p>'+it[2]+'</p></div>';}).join('');
  return '<section class="hs-asr sd-rv"><span class="hs-kick center">Neden Meridyen Yapı?</span><h2 class="center">Somut Güvenceler</h2><div class="asr-grid">'+cards+'</div></section>';
}
// hizmet detayı
let _sdIdx=-1;
function openSvcDetail(i){
  _sdIdx=i;const s=SERVICES[i];if(!s)return;
  document.getElementById('sdIc').textContent=s.i;
  document.getElementById('sdTitle').textContent=s.t;
  document.getElementById('sdLong').textContent=s.long||s.d||'';
  renderSdBody();
  const ov=document.getElementById('svcDetail');ov.classList.add('on');document.body.style.overflow='hidden';ov.scrollTop=0;
}
function closeSvcDetail(){
  _insOvKapat('svcDetail');
  // hizmetler sayfası hâlâ açıksa scroll kilidi kalsın
  if(!document.getElementById('hizmetlerPage').classList.contains('on'))document.body.style.overflow='';
}
// hizmet detayından ana sayfada bölüme git
function sdGo(id){
  if(id==='bolge'){closeSvcDetail();openBolgePage();closeHizmetlerPage();return false;}
  closeSvcDetail();closeHizmetlerPage();
  setTimeout(()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},250);
  return false;
}
// hizmet detayını kapatıp hizmetler listesine dön
function sdBackToHizmetler(){
  _insOvKapat('svcDetail');
  if(!document.getElementById('hizmetlerPage').classList.contains('on'))openHizmetlerPage();
  else {document.body.style.overflow='hidden';document.getElementById('hizmetlerPage').scrollTo({top:0,behavior:'smooth'});}
}
function renderSdBody(){
  const s=SERVICES[_sdIdx];if(!s)return;
  const esc=x=>String(x==null?'':x);
  let h='';
  // hero — animasyonlu inşaat grafiği (her hizmet başında)
  h+=_svcGfx();
  // mevzuat & standart rozetleri
  if(s.mevzuat&&s.mevzuat.length){
    h+='<div class="sd-badges sd-rv">'+s.mevzuat.map(m=>`<span class="sd-badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3Zm-1.2 13.2-3-3 1.4-1.4 1.6 1.6 3.9-3.9 1.4 1.4-5.3 5.3Z"/></svg>${esc(m)}</span>`).join('')+'</div>';
  }
  // hizmet kapsamı
  if(s.scope&&s.scope.length){
    h+='<div class="sd-sec sd-rv"><h2>Hizmet Kapsamı</h2><div class="sd-scope">'+
      s.scope.map(x=>`<div class="it">${esc(x)}</div>`).join('')+'</div></div>';
  }
  // süreç akışı — animasyonlu timeline (çizilen çizgi + sıralı düğümler)
  if(s.steps&&s.steps.length){
    h+='<div class="sd-sec sd-rv"><h2>Nasıl Çalışıyoruz? — Uçtan Uca Süreç</h2><div class="sd-tl">'+
      s.steps.map((st,idx)=>`<div class="st"><div class="dot">${idx+1}</div><h4>${esc(st.t)}</h4><p>${esc(st.d)}</p></div>`).join('')+'</div></div>';
  }
  // derin analiz — mühendislik yaklaşımı (SEO uzun-metin)
  if(s.deep&&s.deep.length){
    h+='<div class="sd-sec sd-rv"><h2>Derin Analiz — Mühendislik Yaklaşımımız</h2><div class="sd-deep">'+
      s.deep.map(p=>`<p>${esc(p)}</p>`).join('')+'</div></div>';
  }
  // risk analizi & yönetimi
  if(s.risks&&s.risks.length){
    h+='<div class="sd-sec sd-rv"><h2>Risk Analizi &amp; Yönetimi</h2><div class="sd-risks">'+
      s.risks.map(r=>`<div class="rk"><div class="rk-h"><span class="rk-ic">!</span><h4>${esc(r.t)}</h4></div><p><span class="rk-lbl">Yönetimimiz:</span> ${esc(r.d)}</p></div>`).join('')+'</div></div>';
  }
  // somut güvenceler
  if(s.guarantee&&s.guarantee.length){
    h+='<div class="sd-sec sd-rv"><h2>Somut Güvenceler</h2><div class="sd-guar">'+
      s.guarantee.map(g=>`<div class="it">${esc(g)}</div>`).join('')+'</div></div>';
  }
  // mühendislik sözlüğü
  if(s.terms&&s.terms.length){
    h+='<div class="sd-sec sd-rv"><h2>Mühendislik Sözlüğü</h2><div class="sd-terms">'+
      s.terms.map(t=>`<div class="tm"><b>${esc(t.k)}</b><span>${esc(t.v)}</span></div>`).join('')+'</div></div>';
  }
  // sık sorulan sorular (SSS)
  if(s.faq&&s.faq.length){
    h+='<div class="sd-sec sd-rv"><h2>Sık Sorulan Sorular</h2><div class="sd-faq">'+
      s.faq.map(f=>`<details class="fq"><summary>${esc(f.q)}</summary><div class="a">${esc(f.a)}</div></details>`).join('')+'</div></div>';
  }
  // ilgili projeler
  if(typeof PROJECTS!=='undefined'&&PROJECTS.length){
    const rel=PROJECTS.slice(0,3);
    h+='<div class="sd-sec sd-rv"><h2>İlgili Projelerimiz</h2><div class="sd-rel">'+
      rel.map(p=>{const src=imgFor((p.gallery&&p.gallery[0])||p.img);return `<div class="rc" onclick="closeSvcDetail();closeHizmetlerPage();setTimeout(()=>openProjectDetail(${PROJECTS.indexOf(p)}),120)">${src?`<img src="${src}" alt="${esc(p.t)}" loading="lazy" decoding="async">`:''}<div class="b"><h4>${esc(p.t)}</h4><span>📍 ${esc(p.loc||'')}</span></div></div>`;}).join('')+
      '</div></div>';
  }
  // ilgili konular (SEO etiketleri)
  if(s.tags&&s.tags.length){
    h+='<div class="sd-sec sd-rv"><h2>İlgili Konular</h2><div class="sd-tags">'+
      s.tags.map(t=>`<span class="tg">${esc(t)}</span>`).join('')+'</div></div>';
  }
  h+=`<div class="sd-ctabar sd-rv"><h3>${esc(s.t)} hizmetiyle mi ilgileniyorsunuz?</h3><p>Ücretsiz keşif ve detaylı teklif için bizimle iletişime geçin.</p><button class="btn btn-primary" onclick="closeSvcDetail();closeHizmetlerPage();openTeklif()">Ücretsiz Keşif Talep Et →</button></div>`;
  document.getElementById('sdBody').innerHTML=h;
  _ovReveal('svcDetail');
}
// overlay içi reveal + sayaç animasyonu (root=overlay → fixed overlay'de de çalışır)
function _ovReveal(id){
  var root=document.getElementById(id);if(!root)return;
  /* PERF: her açılışta yeni scroll/resize dinleyicisi BİRİKMESİN — eskisini söküp yenisini bağla */
  if(root._ovRvOff){try{root._ovRvOff();}catch(e){}}
  if(typeof i18nInit==='function')i18nInit();
  var items=[].slice.call(root.querySelectorAll('.sd-rv,.hp-rv'));
  var cnt=function(el){var t=+el.dataset.count;if(!t)return;var s=0,st=t/60;var f=function(n){return el.dataset.fmt==='m2'?(n/1e6).toFixed(1).replace('.',',')+'M m²':Math.floor(n).toLocaleString('tr-TR')+(el.dataset.suf||'');};(function tick(){s+=st;if(s>=t){el.textContent=f(t);}else{el.textContent=f(s);requestAnimationFrame(tick);}})();};
  var show=function(el){if(el.classList.contains('in'))return;el.classList.add('in');var c=el.querySelectorAll('[data-count]');for(var i=0;i<c.length;i++)cnt(c[i]);};
  // rect-tabanlı: IO zamanlamasına bağlı değil (overlay içinde de güvenilir çalışır)
  var check=function(){var rr=root.getBoundingClientRect();var vh=root.clientHeight||window.innerHeight||800;for(var i=0;i<items.length;i++){var el=items[i];if(el.classList.contains('in'))continue;var r=el.getBoundingClientRect();if(r.top<rr.top+vh*0.9&&r.bottom>rr.top-60)show(el);}};
  check();
  var onScroll=function(){requestAnimationFrame(check);};
  root.addEventListener('scroll',onScroll,{passive:true});
  window.addEventListener('resize',onScroll,{passive:true});
  root._ovRvOff=function(){root.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);};
  setTimeout(check,260);
  setTimeout(function(){for(var i=0;i<items.length;i++)show(items[i]);},1600); // içerik asla gizli kalmasın
}
// hizmet detayı başında animasyonlu inşaat grafiği (şantiye: yükselen bloklar + vinç)
function _svcGfx(){
  return '<div class="sd-gfx sd-rv" aria-hidden="true"><svg viewBox="0 0 800 210" preserveAspectRatio="xMidYMid slice">'
    +'<defs><linearGradient id="sgSky" x1="0" y1="0" x2="0" y2="1"><stop class="g-a" offset="0"/><stop class="g-b" offset="1"/></linearGradient></defs>'
    +'<rect width="800" height="210" fill="url(#sgSky)"/>'
    +'<g class="bp"><line x1="0" y1="60" x2="800" y2="60"/><line x1="0" y1="112" x2="800" y2="112"/><line x1="0" y1="164" x2="800" y2="164"/><line x1="180" y1="0" x2="180" y2="210"/><line x1="360" y1="0" x2="360" y2="210"/><line x1="540" y1="0" x2="540" y2="210"/><line x1="700" y1="0" x2="700" y2="210"/></g>'
    +'<g><rect class="bld b1" x="70" y="118" width="86" height="70" rx="4"/><rect class="bld b2" x="176" y="74" width="98" height="114" rx="4"/><rect class="bld b3" x="294" y="130" width="74" height="58" rx="4"/></g>'
    +'<g class="wins"><rect x="190" y="90" width="13" height="10" rx="1.5"/><rect x="214" y="90" width="13" height="10" rx="1.5"/><rect x="238" y="90" width="13" height="10" rx="1.5"/><rect x="190" y="116" width="13" height="10" rx="1.5"/><rect x="214" y="116" width="13" height="10" rx="1.5"/><rect x="238" y="116" width="13" height="10" rx="1.5"/><rect x="190" y="142" width="13" height="10" rx="1.5"/><rect x="214" y="142" width="13" height="10" rx="1.5"/><rect x="238" y="142" width="13" height="10" rx="1.5"/><rect x="86" y="132" width="13" height="10" rx="1.5"/><rect x="112" y="132" width="13" height="10" rx="1.5"/></g>'
    +'<g class="crane"><line class="draw" x1="600" y1="188" x2="600" y2="46" style="--l:144"/><line class="draw" x1="600" y1="52" x2="722" y2="52" style="--l:122"/><line class="draw" x1="600" y1="52" x2="556" y2="52" style="--l:46"/><line class="draw hookline" x1="688" y1="52" x2="688" y2="98" style="--l:48"/><rect class="cab" x="590" y="54" width="20" height="18" rx="2"/><rect class="hook" x="681" y="98" width="14" height="10" rx="2"/></g>'
    +'<line class="draw ground" x1="30" y1="188" x2="770" y2="188" style="--l:740"/>'
    +'</svg></div>';
}
document.addEventListener('keydown',e=>{
  if(e.key!=='Escape')return;
  if(document.getElementById('svcDetail').classList.contains('on'))closeSvcDetail();
  else if(document.getElementById('hizmetlerPage').classList.contains('on'))closeHizmetlerPage();
});

// ===== /PROJELER LISTE SAYFASI =====
let _ppFilter='all';
function ppGo(id){
  if(id==='bolge'){openBolgePage();closeProjelerPage();return false;}
  closeProjelerPage();
  setTimeout(()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},150);
  return false;
}
function openProjelerPage(){
  _ppFilter='all';
  const sb=document.getElementById('ppSearch');if(sb)sb.value='';
  document.querySelectorAll('#ppFilters .ppf').forEach(b=>b.classList.toggle('active',b.dataset.f==='all'));
  renderProjelerPage();
  const ov=document.getElementById('projelerPage');ov.classList.add('on');_insSyncUrl('projeler');document.body.style.overflow='hidden';ov.scrollTop=0;
  if(typeof i18nInit==='function')i18nInit();
  /* URL: temiz router yönetir */
}
function closeProjelerPage(){
  _insOvKapat('projelerPage');
  document.body.style.overflow='';
  /* URL: temiz router yönetir */
}
function renderProjelerPage(){
  const q=(document.getElementById('ppSearch').value||'').toLowerCase().trim();
  let list=PROJECTS.map((p,i)=>({p,i}))
    .filter(({p})=>_ppFilter==='all'||p.st===_ppFilter)
    .filter(({p})=>!q||((p.t||'')+' '+(p.loc||'')+' '+(p.type||'')).toLowerCase().includes(q));
  const grid=document.getElementById('ppGrid');
  const cnt=document.getElementById('ppCount');
  var _en=(typeof LANG!=='undefined'&&LANG==='en');
  cnt.textContent=list.length+(_en?' projects listed':' proje listeleniyor');
  if(!list.length){grid.innerHTML='';grid.insertAdjacentHTML('afterend','');document.getElementById('ppCount').textContent=(_en?'No results':'Sonuç bulunamadı');grid.innerHTML='<div class="pp-empty">'+(_en?'No projects match your search criteria.':'Aradığınız kriterlere uygun proje bulunamadı.')+'</div>';return;}
  grid.innerHTML=list.map(({p,i})=>{
    const src=imgFor((p.gallery&&p.gallery[0])||p.img);
    const apts=p.apts||[];
    const musaitN=apts.filter(a=>a.durum==='musait').length;
    const av=apts.length?(musaitN>0?`${musaitN} müsait daire`:'Tükendi'):'';
    return `<div class="ppcard" onclick="openProjectDetailFromList(${i})">
      <div class="img">${src?`<img src="${src}" alt="${p.t}" loading="lazy" decoding="async">`:''}
        <span class="st ${p.st}">${ST_LABEL[p.st]||p.st}</span>
        ${p.progress!=null?`<div class="prog"><i style="width:${p.progress}%"></i></div>`:''}
        <button class="pp-fav${(typeof authIsFav==='function'&&authIsFav(i))?' on':''}" data-fid="${i}" onclick="event.stopPropagation();hesapToggleFav(${i},this)" aria-label="Favorilere ekle" title="Favorilere ekle">♥</button>
        <div class="ov">Detayları Gör →</div>
      </div>
      <div class="body">
        <div class="loc">📍 ${p.loc||''}</div>
        <h3>${p.t||''}</h3>
        <div class="desc">${(p.desc||'').slice(0,110)}${(p.desc||'').length>110?'…':''}</div>
        <div class="meta">
          <div class="m"><b>${p.area||'-'}</b><span>Alan</span></div>
          <div class="m"><b>${p.units||(apts.length+' birim')}</b><span>Konut</span></div>
          <div class="m"><b>${p.delivery||'-'}</b><span>Teslim</span></div>
          <div class="m"><b>${p.type||'-'}</b><span>Tip</span></div>
        </div>
        <div class="foot">
          <span class="price">${p.price||'Fiyat için arayın'}</span>
          ${av?`<span class="av ${musaitN>0?'':'none'}">${av}</span>`:''}
        </div>
      </div>
    </div>`;
  }).join('');
}
function openProjectDetailFromList(i){openProjectDetail(i);}
// filtre butonları
/* ============================================================
   emlakekspertizi.com — MERKEZİ SaaS ALTYAPISI (İnşaat ayağı)
   Bağımsız proje: yalnızca insaat.html · varsayılan tema TURUNCU
   ============================================================ */
const SAAS_CONFIG={
  tenantId:'meridyen-insaat',
  tenantName:'Meridyen Yapı',
  tenantType:'İnşaat',
  themeColor:'Turuncu',                       // varsayılan inşaat kimliği
  allowedRegions:{ il:'', ilceler:[] },        // [] = tüm bölgeler · örn ['Levent'] = sadece o bölge
  modules:{ projeler:true, hizmetler:true, bolge:true, medya:true },
  /* ÇİFT KATMANLI AYARLAR — merkez (sistem) vs bayi (tenant) */
  systemSettings:{
    logoUrl:'', faviconUrl:'', googleAnalytics:'', googleMapsKey:'', googleSiteVerification:'',
    metaTitle:'', metaDescription:'', metaKeywords:'', contactPhone:'', customPrompt:'',
    allowTenantOverride:{ themeColor:true, logoUrl:true, faviconUrl:true, contactPhone:true,
      googleAnalytics:true, googleMapsKey:true, googleSiteVerification:true, metaTitle:true, metaDescription:true, metaKeywords:true, customPrompt:true }
  },
  tenantSettings:{
    themeColor:'', logoUrl:'', faviconUrl:'', contactPhone:'',
    googleAnalytics:'', googleMapsKey:'', googleSiteVerification:'',
    metaTitle:'', metaDescription:'', metaKeywords:'', customPrompt:''
  },
  /* ProX — inşaat/proje bağlamına özel promptlar */
  proxAiPrompts:{
    proje:'Sen Meridyen Yapı’nın proje danışmanısın; teslim tarihi, daire tipleri ve yatırım getirisini veriyle anlat.',
    arsa:'Sen kat karşılığı/fizibilite uzmanısın; arsa payı, emsal ve net kâr paylaşımını net açıkla.',
    bolge:'Sen bölge yatırım uzmanısın; zemin/deprem riski ve 5 yıllık değer artış projeksiyonuyla konuş.',
    default:'Sen emlakekspertizi.com ProX inşaat asistanısın.'
  }
};
const SAAS_THEMES={
  'Turuncu':{accent:'#ff7a2f',accent2:'#ffb070'},
  'Mavi':{accent:'#2563eb',accent2:'#60a5fa'},
  'Yeşil':{accent:'#1e7e3a',accent2:'#34d399'},
  'Kehribar':{accent:'#b45309',accent2:'#f59e0b'},
  'Kırmızı':{accent:'#dc2626',accent2:'#f87171'}
};
/* 1) DİNAMİK TEMA — merkezden gelen renk anında uygulanır (primary gradyanı --accent/--accent-2'den beslenir) */
function initSaaSTheme(){const color=(typeof saasResolve==='function'&&saasResolve('themeColor'))||SAAS_CONFIG.themeColor;const t=SAAS_THEMES[color]||SAAS_THEMES['Turuncu'],s=document.documentElement.style;s.setProperty('--accent',t.accent);s.setProperty('--accent-2',t.accent2);}
window.saasSetTheme=function(name){SAAS_CONFIG.themeColor=name;initSaaSTheme();};
/* 2) GLOBAL DİNAMİK MENÜ — 6 statik navbar yerine tek kaynak */
/* §7 Dalga C — overlay/modal kapanışı giriş animasyonunun aynasıyla; reduced-motion'da anında. */
function _insAnimKapat(el,done){try{if(!el||matchMedia('(prefers-reduced-motion:reduce)').matches||el.classList.contains('closing')){if(el)el.classList.remove('closing');done();return;}el.classList.add('closing');var f=false,end=function(){if(f)return;f=true;el.classList.remove('closing');done();};el.addEventListener('animationend',end,{once:true});setTimeout(end,340);}catch(e){try{done();}catch(_){}}}
function _insOvKapat(id){var el=document.getElementById(id);if(!el||!el.classList.contains('on'))return;_insAnimKapat(el,function(){el.classList.remove('on');});}
window._insAnimKapat=_insAnimKapat;window._insOvKapat=_insOvKapat;
function closeAllInsaatOverlays(){['closeProjelerPage','closeHizmetlerPage','closeSvcDetail','closeProjectDetail','closeBolgePage','closeIletisimPage','closeIlanlarPage','closeDoc','closeFaqPage','closeProxAsistanPage','closeHesap'].forEach(fn=>{try{if(typeof window[fn]==='function')window[fn]();}catch(e){}});try{insBlogPageKapat();}catch(e){}document.body.style.overflow='';}
function openInsaatMobile(){var ov=document.querySelector('#projelerPage.on,#hizmetlerPage.on,#bolgePage.on,#svcDetail.on,#pjDetail.on,#iletisimPage.on,#docPage.on,#faqPage.on');var m=ov?ov.querySelector('.mnav'):document.getElementById('mnav');if(m)m.classList.add('open');}
const INSAAT_NAV=`<a href="hizmetlerimiz.html" onclick="return goPage('hizmetler',event)">Hizmetlerimiz</a>`
  +`<a href="neden-biz.html">Neden <span class="nb-x">?</span> Biz</a>`
  +`<a href="projelerimiz.html" onclick="return goPage('projeler',event)">Projeler</a>`
  +`<a href="ilanlar.html">İlanlar</a>`
  +`<a href="index.html#asistan" onclick="return goPage('asistan',event)" class="nav-asistan"><span class="prox-logo">Pro<span class="prox-x">X</span></span>&nbsp;Asistan</a>`;
const INSAAT_CTA=`<a class="nav-wa" href="https://wa.me/905001234567" target="_blank" rel="noopener noreferrer" title="WhatsApp" aria-label="WhatsApp"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm5.5 14.13c-.23.65-1.36 1.25-1.87 1.3-.5.05-.97.23-3.27-.68-2.76-1.09-4.5-3.91-4.64-4.09-.14-.18-1.11-1.48-1.11-2.82s.7-2 .95-2.27c.25-.27.54-.34.72-.34h.52c.17 0 .4-.06.62.47.23.56.79 1.93.86 2.07.07.14.11.3.02.48-.62 1.23-1.28 1.18-.93 1.78.66 1.13 1.32 1.52 2.33 2.03.27.14.43.12.59-.07.18-.21.68-.79.86-1.06.18-.27.36-.23.61-.14.25.09 1.6.75 1.87.89.27.14.45.2.52.32.07.11.07.65-.16 1.3Z"/></svg></a>`
  +`<button class="btn btn-primary" onclick="openTeklif()">Ücretsiz Keşif</button>`
  +`<a class="btn btn-ghost js-giris" href="#giris" onclick="girisOrHesap();return false">Giriş</a>`
  +`<button class="burger" onclick="openInsaatMobile()" aria-label="Menü"><span></span><span></span><span></span></button>`;
const INSAAT_MNAV=`<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px"><b style="font-family:var(--head)">Menü</b><button style="background:none;border:0;font-size:1.375rem;cursor:pointer;color:inherit" onclick="this.closest('.mnav').classList.remove('open')" aria-label="Kapat">✕</button></div>`
  +`<a href="hizmetlerimiz.html" onclick="document.querySelectorAll('.mnav').forEach(function(m){m.classList.remove('open')});return goPage('hizmetler',event)">Hizmetlerimiz</a>`
  +`<a href="neden-biz.html">Neden <span class="nb-x">?</span> Biz</a>`
  +`<a href="projelerimiz.html" onclick="document.querySelectorAll('.mnav').forEach(function(m){m.classList.remove('open')});return goPage('projeler',event)">Projeler</a>`
  +`<a href="ilanlar.html">İlanlar</a>`
  +`<a href="bolge.html" onclick="document.querySelectorAll('.mnav').forEach(function(m){m.classList.remove('open')});return goPage('bolge',event)">Bölge Zekası</a>`
  +`<a href="index.html#asistan" onclick="document.querySelectorAll('.mnav').forEach(function(m){m.classList.remove('open')});return goPage('asistan',event)"><span class="prox-logo">Pro<span class="prox-x">X</span></span>&nbsp;Asistan</a>`
  +`<a href="#giris" class="js-giris" onclick="event.preventDefault();document.querySelectorAll('.mnav').forEach(function(m){m.classList.remove('open')});girisOrHesap()">Giriş</a>`
  +`<button class="btn btn-primary" style="margin-top:14px;justify-content:center" onclick="document.querySelectorAll('.mnav').forEach(function(m){m.classList.remove('open')});openTeklif()">Ücretsiz Keşif</button>`
  +`<div class="mnav-lang"><span>Dil / Language</span><select class="lang-sel" aria-label="Dil / Language" onchange="applyLang(this.value)"><option value="tr">TR</option><option value="en">EN</option></select></div>`;
const INSAAT_FOOTER=`<div class="wrap">
  <div class="fgrid">
    <div><div class="lo">Meridyen<span class="lo2"> Yapı</span></div>
      <p class="desc">1986'dan bu yana güvenle inşa eden kurumsal yapı, tadilat ve gayrimenkul geliştirme şirketi.</p>
      <div class="fsocial">
        <a href="${SOCIAL.facebook||'https://facebook.com'}" class="js-soc-fb" target="_blank" rel="noopener noreferrer" aria-label="Facebook"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.5c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z"/></svg></a>
        <a href="${SOCIAL.instagram||'https://instagram.com'}" class="js-soc-ig" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16Zm0 3.24a6.6 6.6 0 1 0 0 13.2 6.6 6.6 0 0 0 0-13.2Zm0 10.89a4.29 4.29 0 1 1 0-8.58 4.29 4.29 0 0 1 0 8.58Zm6.86-11.15a1.54 1.54 0 1 1-3.08 0 1.54 1.54 0 0 1 3.08 0Z"/></svg></a>
        <a href="${SOCIAL.x||'https://x.com'}" class="js-soc-x" target="_blank" rel="noopener noreferrer" aria-label="X"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.24 2.25h3.31l-7.23 8.26 8.5 11.24h-6.65l-5.22-6.82-5.97 6.82H1.66l7.73-8.83L1.25 2.25h6.82l4.71 6.23 5.46-6.23Zm-1.16 17.52h1.83L7.01 4.13H5.05l12.03 15.64Z"/></svg></a>
        <a href="${SOCIAL.linkedin||'https://linkedin.com'}" class="js-soc-li" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.94 5a1.94 1.94 0 1 1-3.88 0 1.94 1.94 0 0 1 3.88 0ZM3.4 8.4h3.1V21H3.4V8.4Zm5.34 0h2.97v1.72h.04c.41-.78 1.42-1.6 2.93-1.6 3.13 0 3.71 2.06 3.71 4.74V21h-3.1v-5.55c0-1.32-.02-3.02-1.84-3.02-1.84 0-2.12 1.44-2.12 2.92V21h-3.1V8.4Z"/></svg></a>
        <a href="${SOCIAL.youtube||'https://youtube.com'}" class="js-soc-yt" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.5a3.02 3.02 0 0 0-2.12-2.14C19.5 3.85 12 3.85 12 3.85s-7.5 0-9.38.51A3.02 3.02 0 0 0 .5 6.5C0 8.4 0 12 0 12s0 3.6.5 5.5a3.02 3.02 0 0 0 2.12 2.14C4.5 20.15 12 20.15 12 20.15s7.5 0 9.38-.51a3.02 3.02 0 0 0 2.12-2.14C24 15.6 24 12 24 12s0-3.6-.5-5.5ZM9.6 15.6V8.4l6.24 3.6-6.24 3.6Z"/></svg></a>
        <a href="https://nsosyal.com" target="_blank" rel="noopener noreferrer" aria-label="NEXT Sosyal (Türkiye)" title="NEXT Sosyal — Türkiye'nin yerli sosyal medya platformu"><svg viewBox="0 0 575 574" aria-hidden="true"><path d="M171.226 0.078125H0V573.751H171.226V0.078125Z"/><path d="M76.1875 0.0782019L191.016 300.603L275.573 520.404C289.183 552.162 326.104 573.751 367.482 573.751H501.631C538.082 573.751 574.142 535.579 574.142 494.748V0H402.917V323.053L398.458 311.632L278.858 0H76.1875V0.0782019Z"/></svg></a>
      </div>
      <div class="fportals"><a class="fp fp-sah" href="https://www.sahibinden.com" target="_blank" rel="noopener noreferrer" aria-label="sahibinden.com ilanlarımız">sahibinden</a><a class="fp fp-hep" href="https://www.hepsiemlak.com" target="_blank" rel="noopener noreferrer" aria-label="hepsiemlak ilanlarımız">hepsiemlak</a><a class="fp fp-ejt" href="https://www.emlakjet.com" target="_blank" rel="noopener noreferrer" aria-label="emlakjet ilanlarımız"><b>emlak</b>jet</a></div>
      <div class="flegal"><a href="kvkk.html">KVKK</a><a href="gizlilik.html">Gizlilik</a><a href="cerez.html">Çerez Politikası</a><a href="kullanim-kosullari.html">Kullanım Koşulları</a></div>
    </div>
    <div><h4>Kurumsal</h4><a href="neden-biz.html">Hakkımızda</a><a href="vizyon-misyon.html">Vizyon & Misyon</a><a href="yonetim.html">Yönetim Kadrosu</a><a href="kalite.html">Kalite & Sertifikalar</a><a href="index.html#blog">Blog & Rehberler</a><a href="medya.html">Medya & Basında Biz</a><a href="bolge.html">Bölge Ekspertizi</a><a href="kariyer.html">Kariyer</a><a href="soru-cevap.html">İnşaata Başlamadan Dikkat Edilecekler</a></div>
    <div><h4>Hizmetler</h4><a href="ilanlar.html"><b>Tüm İlanlar</b></a><a href="harita.html">Harita</a><a href="emlak-ekspertizi.html">Emlak Ekspertizi</a><a href="ilanlar.html?op=Satılık">Satılık İlanlar</a><a href="ilanlar.html?op=Kiralık">Kiralık İlanlar</a><a href="ozel-portfoy.html">🔒 Özel Portföy</a><a href="bolge.html">Bölge Zekası</a><a href="hizmetlerimiz.html#konut-insaati">Konut İnşaatı</a><a href="hizmetlerimiz.html#kentsel-donusum">Kentsel Dönüşüm</a><a href="hizmetlerimiz.html#anahtar-teslim">Anahtar Teslim</a></div>
    <div><h4>İletişim</h4>
      <a href="#iletisim" onclick="closeAllInsaatOverlays();openIletisimPage();return false">Levent Mah. Yapı Cad. No:1<br>Beşiktaş / İstanbul</a>
      <a href="#iletisim" onclick="closeAllInsaatOverlays();openIletisimPage();return false" style="color:var(--accent);font-weight:600">📍 İletişim & Konum →</a>
      <a href="tel:+902120000000" class="js-tel">+90 212 000 00 00</a>
      <a href="mailto:info@meridyenyapi.com">info@meridyenyapi.com</a>
      <a href="https://wa.me/905001234567" target="_blank" rel="noopener noreferrer">💬 WhatsApp Hattı</a>
      <a href="index.html#asistan" onclick="return goPage('asistan',event)" style="display:inline-flex;align-items:center;gap:6px"><span class="prox-logo" style="font-size:.95em">Pro<span class="prox-x">X</span></span> Asistan · 480 milyon+ doğrulanmış emlak verisi</a>
    </div>
  </div>
  <div class="fbot">
    <div class="fcopy">© 2026 Meridyen Yapı A.Ş. · Kurumsal marka ve içerik hakları. · <span style="opacity:.7">Kurgusal tanıtım demosu.</span><div class="nadas-c">Yazılım ve altyapı © 2005–2026 NADAS Gayrimenkul Bilgi İletişim Sistemleri Ltd. Şti.</div></div>
    <div class="flang"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M3 12h18M12 3c2.5 2.7 2.5 15.3 0 18M12 3c-2.5 2.7-2.5 15.3 0 18"></path></svg><select class="lang-sel" aria-label="Dil / Language" onchange="applyLang(this.value)"><option value="tr">TR</option><option value="en">EN</option></select></div>
    <a class="fprox" href="https://nadas.com.tr" target="_blank" rel="noopener noreferrer" aria-label="Powered by ProX"><span class="fprox-lead">Powered by</span><span class="fprox-mark"><span class="fprox-pro">Pro</span><span class="fprox-x">X</span></span></a>
  </div>
</div>`;
function fGo(id){try{closeAllInsaatOverlays();}catch(e){}setTimeout(function(){var el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},250);return false;}
/* ===== FAZ3B: SAYFA-GORUNUMU KABUK YONETICISI (idempotent) =====
   Overlay gorunumlerin header/footer'lari statik DOM'da DEGIL <template class="pp-kabuk-t">
   icinde durur (sayilmaz, render edilmez). Gorunum 'on' olunca kabuk TAKILIR, kapaninca
   SOKULUR - tekrar mount/cogalma imkansiz (data-kabuk bekcisi). Ana sayfa: 1 header + 1 footer. */
function _ppKabukTak(pg){
  if(!pg||pg.dataset.kabuk==='1')return;
  pg.querySelectorAll('template.pp-kabuk-t').forEach(function(t){
    try{t.parentNode.insertBefore(t.content.cloneNode(true),t);}catch(e){}
  });
  pg.querySelectorAll('footer.insaatFooter').forEach(function(f){ if(!f.innerHTML.trim())f.innerHTML=INSAAT_FOOTER; });
  pg.dataset.kabuk='1';
  try{if(typeof applyMenuText==='function')applyMenuText();}catch(e){}
  try{if(typeof applyBrand==='function')applyBrand();}catch(e){}
  try{if(typeof applyContactAll==='function')applyContactAll();}catch(e){}
}
function _ppKabukSok(pg){
  if(!pg||pg.dataset.kabuk!=='1')return;
  pg.querySelectorAll('header.pp-hdr,footer.insaatFooter').forEach(function(el){el.remove();});
  pg.dataset.kabuk='';
}
(function(){
  if(typeof MutationObserver==='undefined'||typeof document==='undefined')return;
  var mo=new MutationObserver(function(ms){ms.forEach(function(m){
    var el=m.target; if(!el||el.nodeType!==1)return;
    if(el.classList.contains('on'))_ppKabukTak(el); else _ppKabukSok(el);
  });});
  function kur(){
    document.querySelectorAll('template.pp-kabuk-t').forEach(function(t){
      var pg=t.closest('div[id],section[id]');
      if(pg&&!pg.dataset.kabukObs){pg.dataset.kabukObs='1';mo.observe(pg,{attributes:true,attributeFilter:['class']});
        if(pg.classList.contains('on'))_ppKabukTak(pg);}
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',kur);else kur();
})();
function mountInsaatMenu(){
  document.querySelectorAll('.insaatNav').forEach(n=>n.innerHTML=INSAAT_NAV);
  document.querySelectorAll('.insaatCta').forEach(el=>el.innerHTML=INSAAT_CTA);
  document.querySelectorAll('.insaatMnav').forEach(el=>el.innerHTML=INSAAT_MNAV);
  document.querySelectorAll('.insaatFooter').forEach(f=>f.innerHTML=INSAAT_FOOTER);
  initMdock();
  if(typeof applyMenuText==='function')applyMenuText();
  if(typeof applyBrand==='function')applyBrand();
  if(typeof applySocial==='function')applySocial();
  if(typeof applyContactAll==='function')applyContactAll();
  if(typeof applyStats==='function')applyStats();
  if(typeof applyCerts==='function')applyCerts();
  if(typeof applyFaqSeo==='function')applyFaqSeo();
  if(typeof applyAuthUI==='function')applyAuthUI(); /* üyelik: mount sonrası nav 'Giriş' → isim/oturum durumu */
}
function initMdock(){
  var d=document.querySelector('.mdock'); if(!d||d._i)return; d._i=1;
  function sync(){
    var a=d.querySelectorAll('a'); a.forEach(function(x){x.classList.remove('active');});
    if(document.querySelector('#hizmetlerPage.on,#svcDetail.on')){if(a[0])a[0].classList.add('active');}
    else if(document.querySelector('#projelerPage.on,#pjDetail.on')){if(a[1])a[1].classList.add('active');}
  }
  ['projelerPage','hizmetlerPage','bolgePage','svcDetail','pjDetail'].forEach(function(id){var el=document.getElementById(id);if(el)new MutationObserver(sync).observe(el,{attributes:true,attributeFilter:['class']});});
  sync();
}
/* 3) BÖLGE YETKİSİ — allowedRegions ile PROJECTS / ARSALAR süzme (merkez API simülasyonu) */
function _saasInScope(loc){const a=SAAS_CONFIG.allowedRegions||{};if(!a.ilceler||!a.ilceler.length)return true;const s=(loc||'').toLocaleLowerCase('tr');return a.ilceler.some(x=>s.indexOf((x||'').toLocaleLowerCase('tr'))>=0);}
function fetchSaaSData(){return new Promise(r=>setTimeout(r,120)).then(()=>{
  const projects=(typeof PROJECTS!=='undefined'?PROJECTS:[]).filter(p=>_saasInScope(p.loc));
  const lands=(typeof ARSALAR!=='undefined'?ARSALAR:[]).filter(a=>_saasInScope(a.adres));
  const sc=SAAS_CONFIG.allowedRegions;
  window.__PROX_DEBUG&&console.log('[SaaS API] '+SAAS_CONFIG.tenantName+' · yetki: '+(sc.ilceler&&sc.ilceler.length?sc.ilceler.join(', '):'Tüm bölgeler')+' → '+projects.length+' proje · '+lands.length+' arsa');
  return {tenant:{name:SAAS_CONFIG.tenantName,type:SAAS_CONFIG.tenantType,theme:SAAS_CONFIG.themeColor},projects,lands,count:projects.length};
});}
function applySaaSData(){const a=SAAS_CONFIG.allowedRegions||{};
  if(a.ilceler&&a.ilceler.length){
    if(typeof PROJECTS!=='undefined'&&Array.isArray(PROJECTS))PROJECTS=PROJECTS.filter(p=>_saasInScope(p.loc));
    if(typeof ARSALAR!=='undefined'&&Array.isArray(ARSALAR))ARSALAR=ARSALAR.filter(x=>_saasInScope(x.adres));
  }
  ['renderProjects','renderServices','renderProjelerPage','renderArsa','renderBolgePage'].forEach(fn=>{try{if(typeof window[fn]==='function')window[fn]();}catch(e){}});
}
window.saasSetRegions=function(arr){SAAS_CONFIG.allowedRegions.ilceler=arr||[];return fetchSaaSData().then(applySaaSData);};
/* SaaS başlatma — DOMContentLoaded boot'undan SONRA: tema + dinamik menü + bölge yetkisi */
/* ============================================================
   ProX SaaS Çekirdeği (İnşaat) — çift katman · Google/Meta ·
   ProX · 38-Kategori Proje Raporu · bağımsız bayi admin
   ============================================================ */
function saasResolve(key){const sys=SAAS_CONFIG.systemSettings||{},ten=SAAS_CONFIG.tenantSettings||{},allow=sys.allowTenantOverride||{};if(allow[key]&&ten[key]!=null&&ten[key]!=='')return ten[key];return (sys[key]!=null&&sys[key]!=='')?sys[key]:undefined;}
function _saasMeta(name,val,prop){if(val==null||val==='')return;const sel=prop?('meta[property="'+name+'"]'):('meta[name="'+name+'"]');let m=document.head.querySelector(sel);if(!m){m=document.createElement('meta');prop?m.setAttribute('property',name):m.setAttribute('name',name);document.head.appendChild(m);}m.setAttribute('content',val);}
function _saasLink(rel,href){if(!href)return;let l=document.head.querySelector('link[rel="'+rel+'"]');if(!l){l=document.createElement('link');l.setAttribute('rel',rel);document.head.appendChild(l);}l.setAttribute('href',href);}
function applySaaSSettings(){try{
  initSaaSTheme();
  const title=saasResolve('metaTitle');if(title){document.title=title;_saasMeta('og:title',title,true);}
  const desc=saasResolve('metaDescription');if(desc){_saasMeta('description',desc);_saasMeta('og:description',desc,true);}
  const kw=saasResolve('metaKeywords');if(kw)_saasMeta('keywords',kw);
  const gsv=saasResolve('googleSiteVerification');if(gsv)_saasMeta('google-site-verification',(''+gsv).replace(/^google-site-verification=/,''));
  const fav=saasResolve('faviconUrl');if(fav){_saasLink('icon',fav);_saasLink('apple-touch-icon',fav);}
  const logo=saasResolve('logoUrl');
  if(logo){document.querySelectorAll('img.logo-img, .js-logo img').forEach(im=>im.src=logo);document.querySelectorAll('.logo .mark').forEach(mk=>{mk.textContent='';var im=document.createElement('img');im.className='logo-img';im.alt='logo';im.style.cssText='width:100%;height:100%;object-fit:contain;border-radius:inherit';im.src=logo;mk.appendChild(im);});}
  var _gaR=(typeof _insConsentOk==='function'&&_insConsentOk())?saasResolve('googleAnalytics'):'';const ga=(/^[A-Za-z0-9_-]{4,32}$/.test(''+_gaR))?_gaR:'';
  if(ga&&!document.getElementById('saas-gtag')){const s=document.createElement('script');s.id='saas-gtag';s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id='+ga;document.head.appendChild(s);const s2=document.createElement('script');s2.id='saas-gtag-init';s2.text='window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag("js",new Date());gtag("config","'+ga+'");';document.head.appendChild(s2);window.__PROX_DEBUG&&console.log('[SaaS] Google Analytics enjekte: '+ga);}
  const phone=saasResolve('contactPhone');if(phone)document.querySelectorAll('a[href^="tel:"]').forEach(a=>a.href='tel:'+(''+phone).replace(/[^0-9+]/g,''));
  if(typeof mountInsaatMenu==='function')mountInsaatMenu();
}catch(e){console.warn('applySaaSSettings',e);}}
window.applySaaSSettings=applySaaSSettings;
/* ProX (inşaat) */
function _proxOut(){let el=document.getElementById('proxPanel');if(!el){el=document.createElement('div');el.id='proxPanel';el.className='prox-panel';el.innerHTML='<div class="prox-hd"><b>⚡ ProX</b><button onclick="this.closest(\'.prox-panel\').remove()">✕</button></div><div class="prox-body" id="proxAiOut"></div>';document.body.appendChild(el);}el.classList.add('on');return document.getElementById('proxAiOut');}
function _proxSimulate(msg,ctx){const m=(msg||'').toLocaleLowerCase('tr');
  if(ctx==='arsa') return 'Kat karşılığı fizibilitesi: emsal (KAKS), arsa payı ve net kâr paylaşımını 38 kategorilik endeksle hesaplarız. Arsanızı girin, 3D fizibilite + pay dağılımı çıkaralım.';
  if(ctx==='bolge') return 'Bu bölgede zemin/deprem riski ve 5 yıllık değer artış projeksiyonu endeksimizde mevcut; yatırım için en uygun parselleri önerebilirim.';
  if(m.indexOf('teslim')>=0||m.indexOf('tarih')>=0) return 'Projelerimiz sözleşmeli teslim takvimiyle ilerler. İlgilendiğiniz projeyi söyleyin; teslim tarihi, daire tipleri ve fiyat aralığını paylaşayım.';
  if(m.indexOf('kar')>=0||m.indexOf('getiri')>=0||m.indexOf('yatırım')>=0) return 'Kat karşılığı/yatırım getirisini bölge endeksi ve değer artış projeksiyonuyla hesaplarız. Arsa veya proje bilgisini verin, fizibilite çıkaralım.';
  return 'Size yardımcı olabilirim: proje, kat karşılığı fizibilite veya bölge yatırımı — hangisi?';}
async function proxAiQuery(userMessage,contextType){const ctx=contextType||'default';
  const base=(SAAS_CONFIG.proxAiPrompts&&(SAAS_CONFIG.proxAiPrompts[ctx]||SAAS_CONFIG.proxAiPrompts.default))||'';
  const custom=(typeof saasResolve==='function'?saasResolve('customPrompt'):'')||'';
  const prompt=base+(custom?' '+custom:'');
  window.__PROX_DEBUG&&console.log('[ProX →] '+SAAS_CONFIG.tenantName+' · ctx='+ctx+' · prompt="'+prompt.slice(0,46)+'…" · soru: '+userMessage);
  let answer=null;
  try{
    if(typeof proxApi==='function'){
      /* Canlı /prox/ai body: {prompt}. Persona/persona yönergesi metne katlanır. */
      const fullPrompt=(prompt?prompt+'\n\n':'')+userMessage;
      const r=await proxApi('/api/v1/tenant/prox/ai',{method:'POST',body:{prompt:fullPrompt}});
      if(r&&!r.fallback&&r.success===true&&r.answer)answer=r.answer; /* sağlayıcı adı gizli — yalnızca "ProX" */
    }
  }catch(_){ answer=null; }
  if(!answer){ await new Promise(r=>setTimeout(r,300)); answer=_proxSimulate(userMessage,ctx); } /* fallback: yerel inşaat yanıtı */
  window.__PROX_DEBUG&&console.log('[ProX ←] '+answer);
  const out=_proxOut();if(out)out.innerHTML='<div class="prox-q">'+userMessage+'</div><div class="prox-a">'+answer+'</div>';return answer;}
window.proxAiQuery=proxAiQuery;
/* Logo→tema */
async function saasAutoThemeFromLogo(logoUrl){await new Promise(r=>setTimeout(r,150));const u=(logoUrl||'').toLocaleLowerCase('tr');let theme='Turuncu';
  if(/mavi|blue/.test(u))theme='Mavi';else if(/turuncu|orange/.test(u))theme='Turuncu';else if(/ye[şs]il|green/.test(u))theme='Yeşil';else if(/mor|purple|kehribar|amber/.test(u))theme='Kehribar';else if(/k[ıi]rm[ıi]z[ıi]|red/.test(u))theme='Kırmızı';else{let h=0;for(let i=0;i<u.length;i++)h=(h*31+u.charCodeAt(i))>>>0;theme=['Turuncu','Mavi','Yeşil','Kehribar','Kırmızı'][h%5];}
  SAAS_CONFIG.tenantSettings.logoUrl=logoUrl;SAAS_CONFIG.tenantSettings.themeColor=theme;initSaaSTheme();window.__PROX_DEBUG&&console.log('[Logo Adaptasyon] '+logoUrl+' → tema: '+theme);return theme;}
window.saasAutoThemeFromLogo=saasAutoThemeFromLogo;
/* 38-Kategori Proje Analiz Raporu */
const INSAAT_38_CATEGORIES=['Tapu & Mülkiyet','İmar Durumu & Plan','Zemin Etüdü & Deprem','Fay Hattı Mesafesi','Kat Karşılığı / Emsal (KAKS)','TAKS & Çekme Mesafeleri','Arsa m² Birim Fiyat','Bölge 5Y Değer Artışı','Yatırım Skoru','Yaşanabilirlik Endeksi','İnşaat Maliyet Tahmini','Daire Adedi & Tip Dağılımı','Satış Geliri Projeksiyonu','Arsa Sahibi / Müteahhit Pay','Net Kâr Marjı','Teslim Süresi Tahmini','Ruhsat & İzin Durumu','Altyapı & Ulaşım','Sosyal Donatı','Okul / Sağlık Erişimi','Demografi','Gelir Seviyesi','Nüfus Trendi','Ticari Potansiyel','Kentsel Dönüşüm','Arz / Talep Dengesi','Rakip Proje Analizi','Kredi & Finansman (LTV)','Vergi & Harç','Çevresel Faktörler','Enerji & Sürdürülebilirlik','Yapı Kalitesi Standardı','Manzara & Cephe','Otopark & Peyzaj','Likidite (Satılabilirlik)','Risk Analizi','5Y Değer Projeksiyonu','Genel Fizibilite Sonucu'];
function _saasFindProperty(id){id=''+id;if(id.indexOf('proje-')===0){const i=+id.slice(6);const p=(typeof PROJECTS!=='undefined')?PROJECTS[i]:null;return p?{name:p.t,loc:p.loc}:null;}if(id.indexOf('arsa-')===0){const a=(typeof ARSALAR!=='undefined')?ARSALAR.find(x=>'arsa-'+x.id===id):null;return a?{name:a.ad,loc:a.adres}:null;}return null;}
function _saasRegionFor(loc){if(typeof BOLGELER==='undefined')return null;const s=(loc||'').toLocaleLowerCase('tr');return BOLGELER.find(b=>s.indexOf((b.ad||'').toLocaleLowerCase('tr'))>=0)||null;}
/* "İlçe/İl" veya "Mahalle, İlçe/İl" konumunu il/ilce/mahalle'ye ayır (analyze body için) */
function _saasParseLoc(loc){loc=(loc||'').trim();var il='',ilce='',mah='';if(loc.indexOf('/')>=0){var parts=loc.split('/');il=(parts[1]||'').trim();var left=(parts[0]||'').trim();if(left.indexOf(',')>=0){var lp=left.split(',');mah=(lp[0]||'').replace(/mah\.?/i,'').trim();ilce=(lp[1]||'').trim();}else{ilce=left.replace(/mah\.?/i,'').trim();}}else{il=loc;}return {il:il,ilce:ilce,mahalle:mah};}
function _fmtTLval(n){try{return Number(n).toLocaleString('tr-TR')+' ₺';}catch(e){return n+' ₺';}}
async function saasGenerateReportPDF(propertyId){
  if(typeof requireFeature==='function' && !requireFeature('canUsePdfReports'))return; /* paket kapısı */
  const p=_saasFindProperty(propertyId);
  /* API-first proje analizi: değer SADECE /prox/analyze'den gelir. Boş/fail → yerel BOLGELER bağlamı (değer üretmeden). */
  let a=null;
  try{
    if(typeof proxApi==='function'){
      const lc=_saasParseLoc(p&&p.loc);
      const r=await proxApi('/api/v1/tenant/prox/analyze',{method:'POST',body:{il:lc.il,ilce:lc.ilce,mahalle:lc.mahalle,kategori:'konut',durum:'satilik',brut_m2:0,attrs:{}}});
      if(r&&!r.fallback&&r.success===true&&typeof r.strongest_value!=='undefined')a=r;
    }
  }catch(_){ a=null; }
  const b=p?_saasRegionFor(p.loc):null; /* yerel bağlam (etiket/bölge adı) */
  let kpiHtml='';
  if(a){ /* değerler API'den */
    const rng=a.range||{};
    kpiHtml='<div class="prox-pdf-kpi"><div><b>'+_fmtTLval(a.strongest_value)+'</b><span>en güçlü değer</span></div>'
      +'<div><b>'+_fmtTLval(rng.min_value)+' – '+_fmtTLval(rng.max_value)+'</b><span>değer bandı'+(rng.spread_pct!=null?' (±%'+rng.spread_pct+')':'')+'</span></div>'
      +'<div><b>%'+a.confidence+'</b><span>güven'+(a.confidence_band?' · '+a.confidence_band:'')+'</span></div></div>'
      +(a.karar_ozeti?'<div class="prox-a" style="margin:8px 0 4px"><b>Karar Özeti:</b> '+a.karar_ozeti+'</div>':'')
      +(a.risk_ozeti?'<div class="prox-a" style="margin:0 0 6px"><b>Risk Özeti:</b> '+a.risk_ozeti+'</div>':'');
    window.__PROX_DEBUG&&console.log('Proje Analizi (API): '+propertyId+' · değer='+a.strongest_value+' · güven=%'+a.confidence);
  } else {
    window.__PROX_DEBUG&&console.log('Proje analizi: canlı veri yok, yerel bölge bağlamı kullanıldı: '+propertyId);
  }
  const out=_proxOut();if(out)out.innerHTML='<div class="prox-pdf"><div class="prox-pdf-h"><b>📄 İnşaat Proje Analiz Raporu (Profesyonel Standart)</b><span>'+propertyId+(p?' · '+p.name:'')+(b?' · '+b.ad:'')+'</span></div>'+kpiHtml+'<div class="prox-pdf-cats"><b>38 Kategori Endeks Analizi</b><div class="cats">'+INSAAT_38_CATEGORIES.map(c=>'<i>'+c+'</i>').join('')+'</div></div><div class="prox-pdf-ft">ProX · 38 kategorilik veri gücü</div></div>';
  if(typeof toast==='function')toast('📄 Proje analiz raporu oluşturuldu: '+propertyId+' (38 kategori)');return {propertyId,categories:INSAAT_38_CATEGORIES,analysis:a,region:b};}
window.saasGenerateReportPDF=saasGenerateReportPDF;
/* ---- Bağımsız bayi admin paneli (#saasTenantAdmin) ---- */
function _saasAdminCss(){if(document.getElementById('saasAdminCss'))return;const st=document.createElement('style');st.id='saasAdminCss';st.textContent='.saas-admin-btn{position:fixed;left:16px;bottom:16px;z-index:200;background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;border:0;border-radius:99px;padding:11px 16px;font-weight:700;font-size:.8125rem;cursor:pointer;box-shadow:0 14px 30px -14px rgba(0,0,0,.5);font-family:inherit}.sta-modal{position:fixed;inset:0;z-index:240;display:none}.sta-modal.on{display:block}.sta-ov{position:absolute;inset:0;background:rgba(8,12,20,.62);backdrop-filter:blur(3px)}.sta-card{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(680px,94vw);max-height:90vh;display:flex;flex-direction:column;background:#fff;color:#111;border-radius:18px;overflow:hidden;box-shadow:0 40px 90px -30px rgba(0,0,0,.6)}.sta-hd{display:flex;align-items:center;justify-content:space-between;padding:15px 18px;background:linear-gradient(135deg,#16181f,#0e0f13);color:#fff}.sta-hd b{font-size:.9375rem}.sta-hd button{background:rgba(255,255,255,.14);border:0;color:#fff;width:30px;height:30px;border-radius:8px;cursor:pointer}.sta-tabs{display:flex;gap:6px;padding:12px 16px 0;flex-wrap:wrap;border-bottom:1px solid #eee}.sta-tabs button{border:1px solid #e2e2e6;background:#fff;border-radius:9px 9px 0 0;padding:9px 14px;font-size:.8125rem;font-weight:700;color:#555;cursor:pointer}.sta-tabs button.act{background:var(--accent);border-color:var(--accent);color:#fff}.sta-body{padding:18px;overflow:auto}.sta-pane h4{margin:0 0 4px;font-size:.9375rem}.sta-pane .sub{font-size:.78125rem;color:#777;margin:0 0 12px}.sta-f{margin-bottom:10px}.sta-f label{display:block;font-size:.78125rem;font-weight:700;color:#444;margin-bottom:5px}.sta-f input,.sta-f select,.sta-f textarea{width:100%;padding:11px 13px;border:1px solid #ddd;border-radius:10px;font-size:.875rem;font-family:inherit;outline:none}.sta-f input:focus,.sta-f textarea:focus,.sta-f select:focus{border-color:var(--accent)}.sta-go{background:linear-gradient(135deg,var(--accent),var(--accent-2));color:#fff;border:0;font-weight:700;font-size:.875rem;padding:11px 18px;border-radius:10px;cursor:pointer;margin-top:4px}.sta-row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}@media(max-width:520px){.sta-row2{grid-template-columns:1fr}}.prox-panel{position:fixed;right:16px;bottom:16px;z-index:250;width:min(380px,92vw);max-height:74vh;display:flex;flex-direction:column;background:#fff;color:#111;border:1px solid #e2e2e6;border-radius:16px;overflow:hidden;box-shadow:0 30px 70px -28px rgba(0,0,0,.5);opacity:0;transform:translateY(10px);transition:.25s}.prox-panel.on{opacity:1;transform:none}.prox-hd{display:flex;align-items:center;justify-content:space-between;padding:12px 15px;background:linear-gradient(135deg,#16181f,#0e0f13);color:#fff}.prox-hd b{font-size:.84375rem}.prox-hd button{background:rgba(255,255,255,.14);border:0;color:#fff;width:26px;height:26px;border-radius:7px;cursor:pointer}.prox-body{padding:15px;overflow:auto}.prox-q{font-size:.8125rem;font-weight:700;background:#f3f4f6;border-radius:9px;padding:8px 11px;margin-bottom:9px}.prox-a{font-size:.875rem;line-height:1.55;color:#444}.prox-pdf-h b{display:block;font-size:.90625rem}.prox-pdf-h span{font-size:.75rem;color:#777}.prox-pdf-kpi{display:grid;grid-template-columns:1fr 1fr 1fr;gap:7px;margin:11px 0}.prox-pdf-kpi>div{background:#f6f7f9;border:1px solid #eee;border-radius:9px;padding:7px;text-align:center}.prox-pdf-kpi b{display:block;font-size:.8125rem;color:var(--accent)}.prox-pdf-kpi span{font-size:.625rem;color:#888}.prox-pdf-cats>b{font-size:.75rem}.prox-pdf-cats .cats{display:flex;flex-wrap:wrap;gap:4px;margin-top:7px}.prox-pdf-cats i{font-style:normal;font-size:.625rem;background:#f3f4f6;border:1px solid #e6e6e6;color:#555;padding:3px 7px;border-radius:99px}.prox-pdf-ft{margin-top:10px;font-size:.65625rem;color:#999;border-top:1px dashed #eee;padding-top:9px}';document.head.appendChild(st);}
function _saasAdminHost(){let el=document.getElementById('saasTenantAdmin');if(el)return el;_saasAdminCss();el=document.createElement('div');el.id='saasTenantAdmin';el.className='sta-modal';
  el.innerHTML='<div class="sta-ov" onclick="closeSaasAdmin()"></div><div class="sta-card"><div class="sta-hd"><b>⚡ ProX SaaS · Bayi Yönetim ('+SAAS_CONFIG.tenantName+')</b><button onclick="closeSaasAdmin()">✕</button></div>'
   +'<div class="sta-tabs"><button class="act" data-t="tema" onclick="staTab(this)">Tema & Logo</button><button data-t="google" onclick="staTab(this)">Google & Meta</button><button data-t="prox" onclick="staTab(this)">ProX</button><button data-t="rapor" onclick="staTab(this)">Raporlar</button></div>'
   +'<div class="sta-body">'
   +'<div class="sta-pane" data-p="tema"><h4>Logo & Tema</h4><p class="sub">Logo girince kurumsal renk paleti otomatik uyarlanır; favicon tarayıcı sekmesinde anlık değişir.</p><div class="sta-f"><label>Şirket Logo URL</label><input id="sl_logo" placeholder="https://.../logo.png"></div><div class="sta-f"><label>Favicon URL</label><input id="sl_favicon" placeholder="https://.../favicon.png"></div><button class="sta-go" onclick="saasApplyLogo()">Logoyu Uygula & Temayı Uyarla</button></div>'
   +'<div class="sta-pane" data-p="google" hidden><h4>Google & Meta</h4><p class="sub">Arama sonuçları + analytics; kaydedince sayfa yenilenmeden uygulanır.</p><div class="sta-row2"><div class="sta-f"><label>Google Analytics (GA4) ID</label><input id="sg_ga" placeholder="G-XXXXXXXXXX"></div><div class="sta-f"><label>Search Console Doğrulama</label><input id="sg_gsc" placeholder="google-site-verification=..."></div></div><div class="sta-f"><label>Google Maps API Key</label><input id="sg_maps" placeholder="AIza..."></div><div class="sta-f"><label>Meta Başlık</label><input id="sm_title" placeholder="Sayfa başlığı"></div><div class="sta-f"><label>Meta Açıklama</label><input id="sm_desc" placeholder="Açıklama"></div><div class="sta-f"><label>Meta Anahtar Kelimeler</label><input id="sm_kw" placeholder="inşaat, kat karşılığı, ..."></div><button class="sta-go" onclick="saasSaveGoogle()">Kaydet & Uygula</button></div>'
   +'<div class="sta-pane" data-p="prox" hidden><h4>ProX — İnşaat/Proje Özel Promptu</h4><p class="sub">Merkez persona yönergesine eklenir. Örn: "Lüks rezidans ve karma projelerde uzmanız."</p><textarea id="sp_custom" rows="3" placeholder="Lüks rezidans uzmanıyız..."></textarea><button class="sta-go" onclick="saasSaveProxPrompt()" style="margin-top:8px">Özel Promptu Kaydet</button></div>'
   +'<div class="sta-pane" data-p="rapor" hidden><h4>38 Kategori Proje Analiz Raporu</h4><p class="sub">2005’ten bugüne endeks gücüyle proje/arsa için profesyonel fizibilite raporu.</p><div class="sta-f"><label>Proje / Arsa seçin</label><select id="sr_prop"><option value="">Seçin…</option></select></div><button class="sta-go" onclick="saasReportFromAdmin()">📄 Profesyonel 38 Kategorilik Rapor Üret</button></div>'
   +'</div></div>';
  document.body.appendChild(el);return el;}
function openSaasAdmin(){_saasAdminHost().classList.add('on');saasFillReportSelect();}
function closeSaasAdmin(){const e=document.getElementById('saasTenantAdmin');if(e)e.classList.remove('on');}
function staTab(btn){const m=btn.closest('.sta-modal');m.querySelectorAll('.sta-tabs button').forEach(b=>b.classList.toggle('act',b===btn));const t=btn.dataset.t;m.querySelectorAll('.sta-pane').forEach(p=>p.hidden=(p.dataset.p!==t));}
function saasSaveGoogle(){const v=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};const t=SAAS_CONFIG.tenantSettings;t.googleAnalytics=v('sg_ga');t.googleSiteVerification=v('sg_gsc');t.googleMapsKey=v('sg_maps');t.metaTitle=v('sm_title');t.metaDescription=v('sm_desc');t.metaKeywords=v('sm_kw');applySaaSSettings();if(typeof toast==='function')toast('Google & Meta ayarları uygulandı — yenilenmeden.');}
function saasApplyLogo(){const v=id=>{const e=document.getElementById(id);return e?e.value.trim():'';};const t=SAAS_CONFIG.tenantSettings;const logo=v('sl_logo'),fav=v('sl_favicon');if(logo){t.logoUrl=logo;saasAutoThemeFromLogo(logo);}if(fav)t.faviconUrl=fav;applySaaSSettings();if(typeof toast==='function')toast('Logo & favicon uygulandı; tema uyarlandı.');}
function saasSaveProxPrompt(){const e=document.getElementById('sp_custom');SAAS_CONFIG.tenantSettings.customPrompt=e?e.value.trim():'';if(typeof toast==='function')toast('İnşaat özel ProX promptu kaydedildi.');}
function saasFillReportSelect(){const e=document.getElementById('sr_prop');if(!e)return;let o='<option value="">Seçin…</option>';(typeof PROJECTS!=='undefined'?PROJECTS:[]).forEach((p,i)=>o+='<option value="proje-'+i+'">Proje · '+p.t+'</option>');(typeof ARSALAR!=='undefined'?ARSALAR:[]).forEach(a=>o+='<option value="arsa-'+a.id+'">Arsa · '+a.ad+'</option>');e.innerHTML=o;}
function saasReportFromAdmin(){const e=document.getElementById('sr_prop'),id=e?e.value:'';if(!id){if(typeof toast==='function')toast('Lütfen bir proje/arsa seçin.');return;}saasGenerateReportPDF(id);}
window.openSaasAdmin=openSaasAdmin;window.closeSaasAdmin=closeSaasAdmin;window.staTab=staTab;window.saasSaveGoogle=saasSaveGoogle;window.saasApplyLogo=saasApplyLogo;window.saasSaveProxPrompt=saasSaveProxPrompt;window.saasReportFromAdmin=saasReportFromAdmin;

window.addEventListener('load',function(){try{initSaaSTheme();mountInsaatMenu();applySaaSSettings();if(typeof applyGoogle==='function')applyGoogle();if(typeof applyAds==='function')applyAds();if(typeof i18nInit==='function')i18nInit();fetchSaaSData().then(applySaaSData);
  _saasAdminCss(); /* ProX Ayarları modal stilleri hazır; herkese açık yüzen düğme kaldırıldı — panele admin içinden erişilir */
}catch(e){console.warn('SaaS init',e);}});
// derin link / sayfa yenileme: URL hash'ine göre ilgili tam-sayfa overlay'ini aç
function _insaatOpenFromHash(){
  var h=(location.hash||'').toLowerCase();
  try{
    if(h==='#hizmetler'){if(typeof openHizmetlerPage==='function')openHizmetlerPage();}
    else if(h==='#projeler'){if(typeof openProjelerPage==='function')openProjelerPage();}
    else if(h==='#bolge'){if(typeof openBolgePage==='function')openBolgePage();}
  }catch(e){}
}
window.addEventListener('load',function(){setTimeout(_insaatOpenFromHash,80);});

document.addEventListener('DOMContentLoaded',()=>{
  /* Chrome'u (nav/CTA/footer) İLK BOYAMADAN hemen sonra kur → header/footer "eski geliyor gidiyor"
     flash'ı gider (eskiden yalnız window.load'da kuruluyordu → en geç an). window.load'daki mount
     idempotent tekrar çalışır (aynı içerik). */
  try{ if(typeof mountInsaatMenu==='function') mountInsaatMenu(); }catch(e){}
  document.querySelectorAll('#ppFilters .ppf').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('#ppFilters .ppf').forEach(x=>x.classList.remove('active'));
    b.classList.add('active');_ppFilter=b.dataset.f;renderProjelerPage();
  });
});

// ===== PROJE DETAY SAYFASI =====
let _pdIdx=-1, _pdFloor=0, _pdAptFilter='all';
const DURUM_LBL={musait:'Müsait',opsiyonlu:'Opsiyonlu',satildi:'Satıldı'};
function openProjectDetail(i){
  _pdIdx=i;_pdFloor=0;_pdAptFilter='all';
  const p=PROJECTS[i];if(!p)return;
  document.getElementById('pdHeroImg').src=imgFor((p.gallery&&p.gallery[0])||p.img);
  const stEl=document.getElementById('pdStatus');stEl.className='st '+p.st;stEl.textContent=ST_LABEL[p.st]||p.st;
  document.getElementById('pdTitle').textContent=p.t;
  document.getElementById('pdLoc').innerHTML='📍 '+(p.loc||'');
  renderPdBody();
  const ov=document.getElementById('pjDetail');ov.classList.add('on');document.body.style.overflow='hidden';
  ov.scrollTop=0;
}
function closeProjectDetail(){
  _insOvKapat('pjDetail');
  if(!document.getElementById('projelerPage').classList.contains('on'))document.body.style.overflow='';
}
// proje detayından ana sayfada bölüme git
function jdGo(id){
  if(id==='bolge'){closeProjectDetail();openBolgePage();closeProjelerPage();return false;}
  closeProjectDetail();closeProjelerPage();
  setTimeout(()=>{const el=document.getElementById(id);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});},250);
  return false;
}
// proje detayını kapatıp projeler listesine dön
function jdBackToProjeler(){
  _insOvKapat('pjDetail');
  if(!document.getElementById('projelerPage').classList.contains('on'))openProjelerPage();
  else {document.body.style.overflow='hidden';document.getElementById('projelerPage').scrollTo({top:0,behavior:'smooth'});}
}
function renderPdBody(){
  const p=PROJECTS[_pdIdx];if(!p)return;
  const apts=p.apts||[], floors=p.floors||[], gallery=p.gallery||[], features=p.features||[];
  const musaitN=apts.filter(a=>a.durum==='musait').length;
  const _isDukA=a=>(a.kind==='dükkan'||a.kind==='dukkan'||/d[üu]kkan|ma[ğg]aza|of[İiı]s/i.test(a.tip||''));
  const daireN=apts.filter(a=>!_isDukA(a)).length;
  const dukN=apts.filter(a=>_isDukA(a)).length;
  const dubN=apts.filter(a=>/dubleks/i.test(a.tip||'')).length;
  const unitSummary=[daireN?daireN+' Daire':'',dukN?dukN+' Dükkan':'',dubN?dubN+' Dubleks':''].filter(Boolean).join(' · ')||(p.units||'-');
  let h='';
  // key stats — bağımsız bölüm daire/dükkan/dubleks olarak bölünür
  h+='<div class="pd-stats">'+
     `<div class="pd-stat"><div class="v">${p.area||'-'}</div><div class="l">Toplam İnşaat Alanı</div></div>`+
     `<div class="pd-stat"><div class="v" style="font-size:1rem;line-height:1.35">${unitSummary}</div><div class="l">Bağımsız Bölüm${p.kAdedi?(' · '+p.kAdedi+' kat'):''}</div></div>`+
     `<div class="pd-stat"><div class="v">${p.kullanim||p.type||'-'}</div><div class="l">Kullanım</div></div>`+
     `<div class="pd-stat"><div class="v">${apts.length?musaitN+' / '+apts.length+' müsait':(p.price||'-')}</div><div class="l">${apts.length?'Satışa Açık':'Fiyat'}</div></div>`+
     '</div>';
  // açıklama
  if(p.longDesc||p.desc){h+=`<div class="pd-sec"><h2>Proje Hakkında</h2><p>${p.longDesc||p.desc}</p></div>`;}
  // özellikler
  if(features.length){h+='<div class="pd-sec"><h2>Proje Özellikleri</h2><div class="pd-features">'+features.map(f=>`<div class="pd-feat">${f}</div>`).join('')+'</div></div>';}
  // galeri
  if(gallery.length){h+='<div class="pd-sec"><h2>Galeri</h2><div class="pd-gallery">'+gallery.map(g=>`<img src="${imgFor(g)}" onclick="document.getElementById('pdHeroImg').src=this.src;document.getElementById('pjDetail').scrollTo({top:0,behavior:'smooth'})" alt="" loading="lazy" decoding="async">`).join('')+'</div></div>';}
  // DAİRE SEÇİCİ
  if(apts.length){
    const tipler=['all',...new Set(apts.map(a=>a.tip))];
    h+='<div class="pd-sec"><h2>Bağımsız Bölümler <span style="font-size:.8125rem;color:var(--muted);font-weight:400">— '+unitSummary+' · hepsi satışa açık</span></h2><div class="pd-aptbar">'+
       tipler.map(t=>`<button class="aptf${t===_pdAptFilter?' active':''}" onclick="_pdAptFilter='${t}';renderPdBody()">${t==='all'?'Tümü':t}</button>`).join('')+
       '<div class="lg"><span><i style="background:#16a34a"></i>Müsait</span><span><i style="background:#d97706"></i>Opsiyonlu</span><span><i style="background:#9aa0ab"></i>Satıldı</span></div>'+
       '</div><div class="pd-apts">';
    const filtered=apts.filter(a=>_pdAptFilter==='all'||a.tip===_pdAptFilter);
    h+=filtered.map(a=>`<div class="apt ${a.durum}" onclick="${a.durum==='satildi'?'':`reserveApt('${a.no}')`}">
        <span class="badge ${a.durum}">${DURUM_LBL[a.durum]||a.durum}</span>
        ${a.plan?`<img src="${a.plan}" alt="${a.no} planı" loading="lazy" onclick="event.stopPropagation();document.getElementById('pdHeroImg').src=this.src;document.getElementById('pjDetail').scrollTo({top:0,behavior:'smooth'})" style="width:100%;height:120px;object-fit:cover;background:#0b0d12;border-radius:8px;margin-bottom:8px;cursor:zoom-in">`:''}
        <div class="no">${a.no}</div><div class="tip">${a.tip}</div>
        <div class="row"><span>Alan</span><b>${(a.net>0&&a.brut>0)?(a.net+' m² net · '+a.brut+' m² brüt'):(((a.guven==='dusuk')?'≈ ':'')+a.m2+' m²'+((a.est&&a.guven!=='dusuk')?' <span style="font-weight:400;font-size:.625rem;color:var(--muted)">(oda toplamı)</span>':''))}</b></div>
        <div class="row"><span>Kat</span><b>${a.kat}</b></div>
        <div class="row"><span>Cephe</span><b>${a.cephe||'-'}</b></div>
        ${a.rooms&&a.rooms.length?`<div style="font-size:.65625rem;color:var(--muted);margin-top:5px;line-height:1.5">${a.rooms.map(r=>String(r.name||'').replace(/[<>]/g,'')+(r.m2?' '+r.m2:'')).join(' · ')}</div>`:''}
        <div class="pr">${a.fiyat||'-'}</div></div>`).join('');
    h+='</div></div>';
  }
  // KAT PLANI
  if(floors.length){
    h+='<div class="pd-sec"><h2>Kat Planı</h2><div class="pd-floors">'+
       floors.map((f,fi)=>`<button class="flbtn${fi===_pdFloor?' active':''}" onclick="_pdFloor=${fi};renderPdBody()">${f.name}</button>`).join('')+'</div>';
    const fl=floors[_pdFloor]||{};
    const planImg=imgFor(fl.img);
    h+='<div class="pd-plan"><div class="pd-plan-img">'+
       (planImg?`<img src="${planImg}" alt="${fl.name} planı" loading="lazy" decoding="async">`:'<div class="ph">Bu kat için plan görseli yüklenmemiş.<br><small>Admin panelinden ekleyebilirsiniz.</small></div>')+
       '</div><div class="pd-plan-units">';
    const flApts=(fl.units||[]).map(uno=>apts.find(x=>x.no===uno)).filter(Boolean);
    if(flApts.length){
      h+=`<div style="font-size:.71875rem;color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-bottom:6px">Bu kattaki bağımsız bölümler (${flApts.length})</div>`;
      flApts.forEach(a=>{h+=`<div class="pu" onclick="${a.durum==='satildi'?'':`reserveApt('${a.no}')`}" style="cursor:${a.durum==='satildi'?'default':'pointer'}"><span><i class="d ${a.durum}"></i><b>${a.no}</b> · ${a.tip} · ${(a.net>0?a.net+' m² net':a.m2+' m²')}</span><span style="color:var(--muted)">${DURUM_LBL[a.durum]||''}</span></div>`;});
    }
    if(fl.totalM2){h+=`<div class="pu" style="background:var(--surface-2);font-weight:800"><span>📐 Kat toplam alanı</span><span style="color:var(--accent)">${fl.totalM2} m²</span></div>`;}
    // Ham oda-m² cetveli YALNIZ daireye ayrışmamış katlarda (villa/hizmet katı) — aksi halde daireler yeterli
    if(!flApts.length && fl.rooms&&fl.rooms.length){h+='<div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:5px">'+fl.rooms.map(r=>`<span style="font-size:.6875rem;background:var(--surface-2);border:1px solid var(--line);border-radius:7px;padding:3px 8px">${String(r.name||'').replace(/[<>]/g,'')}${r.m2?' <b>'+r.m2+'m²</b>':''}</span>`).join('')+'</div>';}
    h+='</div></div></div>';
  }
  // TESLİM TAKVİMİ
  const timeline=p.timeline||[];
  if(timeline.length){
    const TL_LBL={bitti:'Tamamlandı',devam:'Devam Ediyor',bekliyor:'Planlandı'};
    h+='<div class="pd-sec"><h2>İnşaat & Teslim Takvimi</h2><div class="pd-timeline">'+
      timeline.map(t=>`<div class="pd-tl ${t.durum}"><div class="dot"></div><div class="c"><div class="ad">${t.ad}</div><div class="tr">${t.tarih}</div><div class="badge2">${TL_LBL[t.durum]||t.durum}</div></div></div>`).join('')+
      '</div></div>';
  }
  // ÖDEME PLANI
  if(p.payment){
    const pay=p.payment;
    h+='<div class="pd-sec"><h2>Ödeme & Finansman</h2><div class="pd-pay">'+
      `<div class="pc"><div class="ic">💰</div><div class="t">${pay.pesin||'-'}</div><div class="d">Peşinat oranı</div></div>`+
      `<div class="pc"><div class="ic">📅</div><div class="t">${pay.taksit||'-'}</div><div class="d">Vade seçeneği</div></div>`+
      `<div class="pc"><div class="ic">🏦</div><div class="t">Banka Kredisi</div><div class="d">${pay.banka||'-'}</div></div>`+
      '</div>'+(pay.not?`<div class="pd-pay-note">ℹ️ ${pay.not}</div>`:'')+'</div>';
  }
  // LOKASYON & ULAŞIM
  if(p.location&&(p.location.ulasim||p.location.cevre||p.location.adres)){
    const lo=p.location;
    h+='<div class="pd-sec"><h2>Lokasyon & Ulaşım</h2><div class="pd-loc">';
    if(lo.adres){h+=`<div class="adr">📌 <b>${lo.adres}</b></div>`;}
    if(lo.ulasim&&lo.ulasim.length){h+='<div class="lc"><h4>Ulaşım</h4><ul>'+lo.ulasim.map(u=>`<li>${u}</li>`).join('')+'</ul></div>';}
    if(lo.cevre&&lo.cevre.length){h+='<div class="lc"><h4>Çevre & Yaşam</h4><ul>'+lo.cevre.map(c=>`<li>${c}</li>`).join('')+'</ul></div>';}
    h+='</div></div>';
  }
  // PROJE KÜNYESİ
  const specs=p.specs||[];
  if(specs.length){
    h+='<div class="pd-sec"><h2>Proje Künyesi</h2><div class="pd-specs">'+
      specs.map(s=>`<div class="sp"><span class="k">${s.k}</span><span class="v">${s.v}</span></div>`).join('')+
      '</div></div>';
  }
  h+=`<div class="pd-cta"><h3>Bu projeyle ilgileniyor musunuz?</h3><p>Ücretsiz keşif, fiyat listesi ve daire rezervasyonu için bize ulaşın.</p><button class="btn btn-primary" onclick="closeProjectDetail();openTeklif()">Ücretsiz Keşif & Teklif Al →</button></div>`;
  document.getElementById('pdBody').innerHTML=h;
}
function reserveApt(no){
  const p=PROJECTS[_pdIdx];
  closeProjectDetail();
  openTeklif();
  setTimeout(()=>{
    const msg=document.querySelector('#teklifModal textarea, .ct-modal textarea, textarea[name="mesaj"]');
    if(msg){msg.value=`${p.t} projesinde ${no} numaralı daire için rezervasyon/bilgi talep ediyorum.`;}
  },120);
}
// ESC ile kapat
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&document.getElementById('pjDetail').classList.contains('on'))closeProjectDetail();});
/* =====================================================================
   İÇERİK STÜDYOSU (ortak motor: shared/cs-engine.js + content-studio.js)
   ===================================================================== */
/* İKİ BAĞIMSIZ AJAN — ayrı anahtar depoları:
     INS_CONTENT (ins_cs_content) → İçerik Ajanı; INS_SITE (ins_cs_site) → Site Asistanı */
var INS_TID=(window.EMLAK_TENANT&&EMLAK_TENANT.tenant_id)||'construction', INS_PBASE=(window.EMLAK_API_BASE||'');
var INS_CONTENT=null, INS_SITE=null;
try{ if(window.CSEngine){ INS_CONTENT=CSEngine.create({store:'ins_cs_content',tenantId:INS_TID,proxBase:INS_PBASE}); INS_SITE=CSEngine.create({store:'ins_cs_site',tenantId:INS_TID,proxBase:INS_PBASE}); _insMigrateAgents(); } }catch(e){}
function _insMigrateAgents(){try{
  var old=JSON.parse(localStorage.getItem('ins_aicfg')||'null');
  if(old&&!localStorage.getItem('ins_cs_content'))localStorage.setItem('ins_cs_content',JSON.stringify(old));
  var dk=(localStorage.getItem('ins_m1_key')||window.PROX_DS_KEY||''), pk=(window.EMLAK_TENANT&&EMLAK_TENANT.veriYetki)||'';
  [INS_CONTENT,INS_SITE].forEach(function(E){ if(!E)return; var k=E.getKeys(),patch={}; if(!k.m1Key&&dk)patch.m1Key=dk; if(!k.proxKey&&pk)patch.proxKey=pk; if(Object.keys(patch).length)E.setKeys(patch); });
}catch(e){}}
window.INS_CONTENT=INS_CONTENT;window.INS_SITE=INS_SITE;
/* Site Asistanı bağlam yardımcıları */
function _insPortfolioText(){try{var out=[];if(typeof PROJECTS!=='undefined'&&PROJECTS)PROJECTS.slice(0,8).forEach(function(p){out.push('• '+(p.t||'Proje')+' — '+[p.loc,p.type,p.price,p.st].filter(Boolean).join(', '));});if(typeof ILANLAR!=='undefined'&&ILANLAR)ILANLAR.slice(0,8).forEach(function(x){out.push('• '+(x.baslik||x.t||'İlan')+' — '+[x.ilce||x.loc,x.tip||x.type,x.fiyat||x.price].filter(Boolean).join(', '));});return out.join('\n');}catch(e){return '';}}
function _paHistArr(){try{var m=(typeof _paMsgs!=='undefined'&&_paMsgs)?_paMsgs.filter(function(x){return !x.typing;}):[];var out=[];for(var i=0;i<m.length-1;i++){out.push({role:(m[i].role==='me'?'user':'assistant'),content:m[i].text||''});}return out.slice(-8);}catch(e){return [];}}
function insArts(){try{return JSON.parse(localStorage.getItem('ins_articles')||'[]')||[];}catch(e){return [];}}
function insArtsSave(a){try{localStorage.setItem('ins_articles',JSON.stringify(a||[]));}catch(e){}}
function insRunSchedule(){try{var a=insArts(),now=Date.now(),ch=false,en=true;try{en=(INS_CONTENT.getSchedule().enabled!==false);}catch(e){}if(en)a.forEach(function(x){if(x&&x.status==='scheduled'&&x.publishAt&&x.publishAt<=now){x.status='published';ch=true;}});if(ch)insArtsSave(a);}catch(e){}}
/* GERÇEK ProX Haber Merkezi akışı — EmlakEkspertizi.com /api/blog/posts (gm portu).
   Yayında (demo emlakekspertizi.com/demo/ altında) AYNI ORIGIN → CORS engeli yok; lokalde CORS
   kapalıysa sessizce boş döner (seed BLOG fallback). 10 dk sessionStorage cache. */
var _insPxCache=null;
function _insTarihTR(iso){try{var a=(''+iso).slice(0,10).split('-');var AY=['','Oca','Şub','Mar','Nis','May','Haz','Tem','Ağu','Eyl','Eki','Kas','Ara'];return (+a[2])+' '+AY[+a[1]]+' '+a[0];}catch(e){return '';}}
async function insProxFeed(force){if(_insPxCache&&!force)return _insPxCache;
  try{var c=JSON.parse(sessionStorage.getItem('ins_pxnews')||'null');if(!force&&c&&c.t>Date.now()-6e5&&c.p&&c.p.length){_insPxCache=c.p;return c.p;}}catch(e){}
  var out=[];
  try{
    var r=await fetch('https://www.emlakekspertizi.com/api/blog/posts?status=published&limit=24',{mode:'cors'});
    if(r.ok){var j=await r.json();
      out=(j.posts||[]).filter(function(p){return p.title&&(p.image_url||p.featured_image);}).map(function(p){
        var d=(p.published_at||p.created_at||'').slice(0,10);
        return {id:'px_'+(p.slug||p.id),slug:p.slug||'',t:p.title,d:p.summary||'',cat:p.category_name||p.category||'İnşaat Haberleri',
          img:p.image_url||p.featured_image||'',date:_insTarihTR(d),author:p.author_name||'EmlakEkspertizi Editör',src:'prox',qs:p.quality_score||0,feat:!!p.is_featured};});
    }
  }catch(e){}
  _insPxCache=out;
  try{if(out.length)sessionStorage.setItem('ins_pxnews',JSON.stringify({t:Date.now(),p:out}));}catch(e){}
  return out;}
window.insProxFeed=insProxFeed;
try{insProxFeed().then(function(px){if(px&&px.length){window._insPxNews=px;try{renderBlog();}catch(e){}try{insMansetBas();}catch(e){}}}).catch(function(){})}catch(e){}
function insBlogAll(){try{insRunSchedule();}catch(e){}var out=[];
  try{insArts().filter(function(a){return a.status==='published'||!a.status;}).forEach(function(a){out.push({id:a.id,img:(a.img&&a.img.url)||'',imgObj:a.img,date:a.date||'',t:a.title||'',d:a.sum||'',cat:a.cat,blocks:a.blocks,video:a.video,body:a.body,tags:a.tags,seo:a.seo,src:'ai'});});}catch(e){}
  try{(window._insPxNews||[]).forEach(function(p){out.push(p);});}catch(e){}/* stüdyo → CANLI ProX haberleri → seed sırası */
  (typeof BLOG!=='undefined'?BLOG:[]).forEach(function(b,i){out.push({id:'seed'+i,img:b.img,date:b.date,t:b.t,d:b.d,body:b.body,cat:b.cat,
    imgObj:(b.imgCredit?{url:imgFor(b.img),alt:b.imgAlt||b.t,credit:b.imgCredit,creditUrl:b.imgCreditUrl||''}:null)});});
  /* FAZ3C YAYIN KAPISI: gelecek tarihli içerik public'te GÖRÜNMEZ (TR ay adları çözümlenir) */
  var _AY={'Ocak':0,'Şubat':1,'Mart':2,'Nisan':3,'Mayıs':4,'Haziran':5,'Temmuz':6,'Ağustos':7,'Eylül':8,'Ekim':9,'Kasım':10,'Aralık':11};
  var _now=new Date();
  out=out.filter(function(b){try{
    if(!b.date)return true;
    var d=new Date(b.date);
    if(isNaN(d)){var m=String(b.date).match(/(\d{1,2})\s+(\S+)\s+(\d{4})/);if(m&&_AY[m[2]]!=null)d=new Date(+m[3],_AY[m[2]],+m[1]);}
    return isNaN(d)||d<=_now;
  }catch(e){return true;}});
  return out;}
function insBlogById(id){var a=insBlogAll();for(var i=0;i<a.length;i++){if(String(a[i].id)===String(id))return a[i];}return null;}
function _csInsBrand(){try{var S=(typeof SETTINGS!=='undefined')?SETTINGS:{};if(S.firmaUnvan)return S.firmaUnvan;var b=(typeof BRAND!=='undefined')?BRAND:{};return (b.name||'Meridyen')+(b.name2||' Yapı');}catch(e){return 'Meridyen Yapı';}}
function _insCity(){try{var r=SAAS_CONFIG&&SAAS_CONFIG.allowedRegions;if(r&&r.ilceler&&r.ilceler.length)return r.ilceler[0];if(r&&r.il)return r.il;}catch(e){}return 'İstanbul';}
function _insEsc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
/* Canlı haber gövdesi — allowlist sanitizer (dış HTML güvenle render edilir; gm _gmSaniHaber portu) */
function _insSaniHaber(html){try{
  var OK={H2:1,H3:1,H4:1,P:1,UL:1,OL:1,LI:1,STRONG:1,B:1,EM:1,I:1,BR:1,A:1,TABLE:1,THEAD:1,TBODY:1,TR:1,TH:1,TD:1,BLOCKQUOTE:1,IMG:1,FIGURE:1,FIGCAPTION:1};
  var doc=new DOMParser().parseFromString('<div>'+(html||'')+'</div>','text/html');
  var kok=doc.body.firstChild,outp=document.createElement('div');
  (function gez(src,dst){
    src.childNodes.forEach(function(n){
      if(n.nodeType===3){dst.appendChild(document.createTextNode(n.nodeValue));return;}
      if(n.nodeType!==1)return;
      var t=n.tagName;
      if(!OK[t]){gez(n,dst);return;}
      var e=document.createElement(t.toLowerCase());
      if(t==='A'){var h=n.getAttribute('href')||'';if(/^https?:\/\//i.test(h)){e.setAttribute('href',h);e.setAttribute('target','_blank');e.setAttribute('rel','noopener noreferrer');}}
      if(t==='IMG'){var s2=n.getAttribute('src')||'';if(!/^https:\/\//i.test(s2))return;e.setAttribute('src',s2);e.setAttribute('alt',n.getAttribute('alt')||'');e.setAttribute('loading','lazy');}
      gez(n,e);dst.appendChild(e);
    });
  })(kok,outp);
  return outp.innerHTML;
}catch(e){return '';}}
/* px_ haberin tam gövdesini çek → sanitize → yeniden render (başarısızsa kaynak-linkli özet; gm _gmHaberDetay portu) */
async function _insHaberDetay(b){
  try{
    var r=await fetch('https://www.emlakekspertizi.com/api/blog/posts/'+encodeURIComponent(b.slug),{mode:'cors'});
    if(r.ok){var j=await r.json();var p=j.post||j;
      var ic=_insSaniHaber(p.content||p.icerik||'');
      if(ic){b.body=ic;b.author=p.author_name||b.author;}
      else b._pxErr=1;
    }else b._pxErr=1;
  }catch(e){b._pxErr=1;}
  try{if(document.getElementById('insBlogOverlay'))insBlogDetail(b.id);}catch(e){}
}
/* GÜNÜN MANŞETİ — carousel + yan manşetler (gm _manIdx/_blogManPool/_manSideCard/_mansetHTML/blogManGo portu) */
var _insManIdx=0;
function _insManCover(b){var v=(b.img&&/^(https?:|data:|blob:)/.test(b.img))?b.img:imgFor(b.img);return v||'';}
function _insManPool(){var p=insBlogAll().filter(function(b){return !!_insManCover(b);});return p.slice(0,Math.min(p.length,20));}
function _insManSideCard(b){var cov=_insManCover(b),ids=String(b.id).replace(/[^A-Za-z0-9_-]/g,'');
  return '<article class="man-side-c" role="link" tabindex="0" onclick="insBlogDetail(\''+ids+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();insBlogDetail(\''+ids+'\')}">'
    +(cov?'<span class="man-side-th" style="background-image:url(\''+_insEsc(cov)+'\')"></span>':'<span class="man-side-th"></span>')
    +'<span class="man-side-b"><span class="man-side-cat">'+_insEsc(b.cat||'Haber')+'</span><span class="man-side-t">'+_insEsc(b.t||'')+'</span></span></article>';
}
function _insMansetHTML(){
  var man=_insManPool();if(!man.length)return '';
  if(_insManIdx>=man.length||_insManIdx<0)_insManIdx=0;
  var b=man[_insManIdx],cov=_insManCover(b),ids=String(b.id).replace(/[^A-Za-z0-9_-]/g,'');
  var big='<article class="man-big">'
    +'<div class="man-big-cov"'+(cov?' style="background-image:url(\''+_insEsc(cov)+'\')"':'')+'>'
      +'<span class="man-counter">'+(_insManIdx+1)+' / '+man.length+'</span>'
      +'<button type="button" class="man-arrow prev" onclick="insManGo('+(_insManIdx-1)+')" aria-label="Önceki manşet">‹</button>'
      +'<button type="button" class="man-arrow next" onclick="insManGo('+(_insManIdx+1)+')" aria-label="Sonraki manşet">›</button>'
      +'<span class="man-cat">'+_insEsc(b.cat||'Haber')+'</span>'
    +'</div>'
    +'<div class="man-big-body" role="link" tabindex="0" onclick="insBlogDetail(\''+ids+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();insBlogDetail(\''+ids+'\')}">'
      +'<h3>'+_insEsc(b.t||'')+'</h3><p>'+_insEsc(b.d||'')+'</p><span class="man-date">🕒 '+_insEsc(b.date||'')+'</span></div>'
    +'<div class="man-pag">'+man.map(function(x,i){return '<button type="button" class="man-dot'+(i===_insManIdx?' on':'')+'" onclick="insManGo('+i+')">'+(i+1)+'</button>';}).join('')+'</div>'
    +'</article>';
  var side='<aside class="man-side">'+[1,2,3].map(function(k){return _insManSideCard(man[(_insManIdx+k)%man.length]);}).join('')+'</aside>';
  return '<section class="man-sec"><div class="man-head"><h2><span class="hl">Günün</span> Manşeti</h2><span class="man-count">'+man.length+' başlık · ProX seçimi</span></div><div class="man-wrap">'+big+side+'</div></section>';
}
/* manşet geçişi teleport yerine kısa crossfade (reduced-motion'da anında) — gm §7 Dalga D portu */
function insManGo(i){var man=_insManPool();if(!man.length)return;_insManIdx=((i%man.length)+man.length)%man.length;var host=document.querySelector('#insManset .man-sec');if(!host)return;
  if(window.matchMedia&&matchMedia('(prefers-reduced-motion:reduce)').matches){host.outerHTML=_insMansetHTML();return;}
  host.style.transition='opacity .16s ease';host.style.opacity='0';
  setTimeout(function(){var h=document.querySelector('#insManset .man-sec');if(!h)return;h.outerHTML=_insMansetHTML();var y=document.querySelector('#insManset .man-sec');
    if(y){y.style.opacity='0';y.style.transition='opacity .2s ease';requestAnimationFrame(function(){requestAnimationFrame(function(){y.style.opacity='1';});});}},170);}
function insMansetBas(){var host=document.getElementById('bpManset');if(!host)return;host.innerHTML=_insMansetHTML();}
window.insManGo=insManGo;window.insMansetBas=insMansetBas;
function insBlogDetail(id){var b=insBlogById(id);if(!b)return;
  var body;
  if(b.src==='prox'&&b.slug&&!b.body){/* canlı haber — tam gövde henüz yok: çek, gelince yeniden render */
    body='<p>'+_insEsc(b.d||'')+'</p>'+(b._pxErr
      ?'<p><a href="https://www.emlakekspertizi.com/blog/post/'+encodeURIComponent(b.slug)+'" target="_blank" rel="noopener noreferrer">Haberin tam metni için: EmlakEkspertizi.com ProX Haber Merkezi →</a></p>'
      :'<p style="opacity:.7">Haberin tamamı yükleniyor…</p>');
    if(!b._pxErr&&!b._pxT){b._pxT=1;_insHaberDetay(b);}
  }
  else if(b.src==='prox'&&b.body){body=b.body;/* _insSaniHaber'den geçmiş güvenli HTML */}
  else if(b.blocks&&b.blocks.length&&window.ContentStudio&&ContentStudio.blocksToHtml)body=ContentStudio.blocksToHtml(b.blocks);
  else if(window.ContentStudio&&ContentStudio.mdToHtml&&/(^|\n)\s*(#{1,3}\s|[-*]\s|>\s)|\*\*|!\[/.test(b.body||''))body=ContentStudio.mdToHtml(b.body||'');
  else body=String(b.body||b.d||'').split(/\n{2,}/).map(function(p){return '<p>'+_insEsc(p).replace(/\n/g,'<br>')+'</p>';}).join('');
  if(b.src==='prox')body+='<div style="margin-top:22px;padding-top:16px;border-top:1px solid var(--line,#2a2f37);font-size:.85rem;opacity:.75">🛰️ Kaynak: <a href="https://www.emlakekspertizi.com/blog/post/'+encodeURIComponent(b.slug||'')+'" target="_blank" rel="noopener noreferrer">EmlakEkspertizi.com · ProX Haber Merkezi</a></div>';
  var imgU=(b.imgObj&&b.imgObj.url)||((b.img&&/^(https?:|data:|blob:)/.test(b.img))?b.img:(imgFor(b.img)||''));
  var cover=imgU?'<figure style="margin:0 0 18px"><img src="'+_insEsc(imgU)+'" style="width:100%;border-radius:14px;display:block" alt="'+_insEsc((b.imgObj&&b.imgObj.alt)||b.t||'')+'">'+((b.imgObj&&b.imgObj.credit)?'<figcaption style="font-size:.75rem;opacity:.65;margin-top:6px">📷 '+_insEsc(b.imgObj.credit)+'</figcaption>':'')+'</figure>':'';
  var vid=(b.video&&b.video.url&&window.ContentStudio&&ContentStudio.videoEmbed&&ContentStudio.videoEmbed(b.video.url))?ContentStudio.videoHtml(b.video.url,''):'';
  try{if(window.ContentStudio&&ContentStudio.applyArticleSEO&&b.src==='ai'&&b.blocks)ContentStudio.applyArticleSEO(b);}catch(e){}
  var ov=document.getElementById('insBlogOverlay');
  if(!ov){ov=document.createElement('div');ov.id='insBlogOverlay';ov.style.cssText='position:fixed;inset:0;z-index:57;background:var(--bg,#0b0e13);color:var(--ink,#e6e9ef);overflow:auto;padding-top:72px'/* header(z-60) ÜSTTE görünür/tıklanabilir kalır; içerik header altından başlar */;document.body.appendChild(ov);}
  /* dn kompakt-modern detay düzeniyle aynı: geri butonu + kategori ROZETİ yan yana, sıkı boşluklar */
  ov.innerHTML='<div class="cs-article" style="max-width:820px;margin:0 auto;padding:26px 20px 70px;line-height:1.75;font-size:1.0625rem">'
    +'<div style="display:flex;align-items:center;gap:14px;flex-wrap:wrap;margin-bottom:16px"><button onclick="insBlogClose()" style="background:var(--surface,#161b22);color:inherit;border:1px solid var(--line,#2a2f37);border-radius:10px;padding:9px 16px;cursor:pointer;font:inherit;font-size:.8125rem">← Tüm yazılar</button>'
    +'<span style="display:inline-block;font-weight:700;font-size:.71875rem;letter-spacing:.09em;text-transform:uppercase;color:#ffb066;background:rgba(255,122,47,.14);border:1px solid rgba(255,122,47,.35);border-radius:999px;padding:6px 13px">Blog · '+_insEsc(b.cat||'Haber')+(b.src==='prox'?' · ProX Haber':'')+'</span></div>'
    +'<h2 class="h1x" style="font-size:clamp(1.75rem,5vw,2.75rem);line-height:1.15;margin:0 0 8px">'+_insEsc(b.t||'')+'</h2>'
    +'<div style="opacity:.7;margin-bottom:16px;font-size:.875rem">'+_insEsc(b.author||'Meridyen Yapı')+' · '+_insEsc(b.date||'')+(b.src==='prox'?' · ProX Haber':'')+'</div>'
    +cover+vid+'<div>'+body+'</div></div>';
  try{var f=document.querySelector('footer.insaatFooter');if(f){var fh=f.outerHTML.replace(/\sid="[^"]*"/g,'');ov.insertAdjacentHTML('beforeend',fh);}}catch(e){}
  try{history.replaceState(null,'','#blog/'+encodeURIComponent(id));}catch(e){}
  ov.scrollTop=0;document.body.style.overflow='hidden';try{var _dh=document.getElementById('hdr');if(_dh)_dh.classList.add('scrolled');}catch(e){}
}
function insBlogClose(){var ov=document.getElementById('insBlogOverlay');if(ov)ov.remove();document.body.style.overflow='';try{if(/^#blog\//.test(location.hash||''))history.replaceState(null,'','#blog');}catch(e){}}
window.insBlogDetail=insBlogDetail;window.insBlogClose=insBlogClose;window.insArts=insArts;window.insRunSchedule=insRunSchedule;
/* studio bağlantılarını sitede zaten girilmiş Motor-1/ProX bağlantısından tohumla */
function _insAgentFill(E,pre){try{var k=E.getKeys();var set=function(id,v){var e=document.getElementById(id);if(e)e.value=v||'';};set(pre+'provider',k.provider||'auto');set(pre+'prox',k.proxKey);set(pre+'ds',k.m1Key);set(pre+'oa',k.m2Key);set(pre+'cl',k.m3Key);set(pre+'sys',k.sysPrompt);var pex=document.getElementById(pre+'pex');if(pex)pex.value=k.mediaKey||'';}catch(e){}}
function _csModulYukle(cb){var L=["../shared/cs-engine.js?v=2", "js/content-studio.js?v=3"];var i=0;(function next(){if(i>=L.length){cb();return;}if(document.querySelector('script[data-csmod="'+L[i]+'"]')){i++;next();return;}var sc=document.createElement('script');sc.src=L[i];sc.dataset.csmod=L[i];sc.onload=function(){i++;next();};sc.onerror=function(){i++;next();};document.head.appendChild(sc);})();}
function csMountINS(){if(!window.ContentStudio){_csModulYukle(function(){csMountINS();});return;}
   if(!window.ContentStudio||!INS_CONTENT)return; var host=document.getElementById('csHost'); if(!host)return;
  ContentStudio.mount(host,{
    vertical:'insaat', persona:'kurumsal inşaat & gayrimenkul geliştirme içerik editörü',
    city:_insCity, brand:_csInsBrand,
    ai:function(bd){return INS_CONTENT.ai(bd,{max_tokens:3500,timeout:70000});},
    image:function(q){return INS_CONTENT.image(q);},
    list:insArts, save:insArtsSave,
    getKeys:function(){return INS_CONTENT.getKeys();}, setKeys:function(k){INS_CONTENT.setKeys(k);},
    proxInfo:function(){return INS_CONTENT.proxInfo();},
    getSchedule:function(){return INS_CONTENT.getSchedule();}, setSchedule:function(s){INS_CONTENT.setSchedule(s);},
    topicPool:function(){return ['Kentsel dönüşümde hak sahibinin bilmesi gerekenler','Kat karşılığı sözleşmesinde kritik maddeler','Deprem güvenli bina nasıl anlaşılır (TBDY 2018)','Anahtar teslim inşaat süreç rehberi','Tadilatta bütçe yönetimi','İmar durumu ve ruhsat süreçleri','Betonarme yapı kalitesi ve denetim','Enerji kimlik belgesi ve A+ binalar','Arsa değerleme ve fizibilite','Yapı denetimi ve iş güvenliği','Konut projesinde teslim takvimi','Karma kullanımlı projelerin avantajları'];},
    toast:function(m){try{if(typeof toast==='function')toast(m);else if(typeof flashSaved==='function')flashSaved();}catch(e){}},
    guard:function(p){var sp='';try{sp=INS_CONTENT.sysPrompt();}catch(e){}return (sp?sp+'\n\n':'')+p;}
  });
}
window.csMountINS=csMountINS;
/* İçerik Stüdyosu sağlayıcı & anahtar kartı (ProX/YZ panosu) */
function insContentFill(){if(INS_CONTENT)_insAgentFill(INS_CONTENT,'cxci_');}
function insSiteFill(){if(!INS_SITE)return;_insAgentFill(INS_SITE,'cxsi_');try{var c=INS_SITE.getCaps();[['cxsi_cap_phone','phone'],['cxsi_cap_lead','lead'],['cxsi_cap_advice','advice'],['cxsi_cap_match','match'],['cxsi_cap_multilang','multilang']].forEach(function(d){var e=document.getElementById(d[0]);if(e)e.checked=(c&&c[d[1]]!==undefined)?!!c[d[1]]:true;});}catch(e){}}
function insStudioFill(){insContentFill();insSiteFill();}
function insContentSave(){if(!INS_CONTENT)return;try{var v=function(id){var e=document.getElementById(id);return e?e.value.trim():'';};INS_CONTENT.setKeys({provider:v('cxci_provider')||'auto',proxKey:v('cxci_prox'),dsKey:v('cxci_ds'),oaKey:v('cxci_oa'),clKey:v('cxci_cl'),pexelsKey:v('cxci_pex'),sysPrompt:v('cxci_sys')});var el=document.getElementById('cxci_status');if(el)el.textContent='✓ İçerik Ajanı kaydedildi · '+(v('cxci_provider')||'auto');try{if(typeof toast==='function')toast('✓ İçerik Ajanı anahtarları kaydedildi.');}catch(e){}}catch(e){}}
function insSiteSave(){if(!INS_SITE)return;try{var v=function(id){var e=document.getElementById(id);return e?e.value.trim():'';};var ck=function(id){var e=document.getElementById(id);return e?!!e.checked:true;};INS_SITE.setKeys({provider:v('cxsi_provider')||'auto',proxKey:v('cxsi_prox'),dsKey:v('cxsi_ds'),oaKey:v('cxsi_oa'),clKey:v('cxsi_cl'),sysPrompt:v('cxsi_sys'),capabilities:{phone:ck('cxsi_cap_phone'),lead:ck('cxsi_cap_lead'),advice:ck('cxsi_cap_advice'),match:ck('cxsi_cap_match'),multilang:ck('cxsi_cap_multilang')}});var el=document.getElementById('cxsi_status');if(el)el.textContent='✓ Site Asistanı kaydedildi · '+(v('cxsi_provider')||'auto');try{if(typeof toast==='function')toast('✓ Site Asistanı ayarları kaydedildi.');}catch(e){}}catch(e){}}
async function _insAgentTest(E,statusId){var el=document.getElementById(statusId);if(el)el.textContent='Test ediliyor…';try{var r=await E.ai({message:'Bağlantı testi. Yalnızca "tamam" yaz.'});var t=r&&(r.answer||r.text);if(r&&r.fallback)t=null;if(el)el.textContent=t?'✓ Bağlantı başarılı.':'Bağlantı kurulamadı. Anahtarı kontrol edin (ProX yerelde CORS kısıtlı olabilir).';}catch(e){if(el)el.textContent='Test hatası.';}}
function insContentTest(){if(INS_CONTENT)_insAgentTest(INS_CONTENT,'cxci_status');}
function insSiteTest(){if(INS_SITE)_insAgentTest(INS_SITE,'cxsi_status');}
window.insStudioFill=insStudioFill;window.insContentFill=insContentFill;window.insSiteFill=insSiteFill;window.insContentSave=insContentSave;window.insSiteSave=insSiteSave;window.insContentTest=insContentTest;window.insSiteTest=insSiteTest;

function _insBlogKart(b){var s=(b.img&&/^(https?:|data:|blob:)/.test(b.img))?b.img:imgFor(b.img);var ids=String(b.id).replace(/[^A-Za-z0-9_-]/g,'');
  return '<div class="post" style="cursor:pointer" onclick="insBlogDetail(\''+ids+'\')"><div class="ph">'+(s?'<img src="'+s+'" alt="" loading="lazy" decoding="async">':'')+'</div>'
  +'<div class="body"><div class="date">'+_insEsc(b.date)+'</div><h3>'+_insEsc(b.t)+'</h3><p>'+_insEsc(b.d)+'</p></div></div>';}
function renderBlog(){var el=document.getElementById('blogGrid');if(!el)return;
  /* Ana sayfa = 9 kartlık VİTRİN; manşet + tüm yazılar GERÇEK Blog sayfasında (#blogPage, dn paritesi) */
  el.innerHTML=insBlogAll().slice(0,9).map(_insBlogKart).join('');}
/* ---- BLOG SAYFASI (tam ekran; üst menü z-60 üstte görünür/tıklanabilir kalır) ---- */
function insBlogPageAc(){var p=document.getElementById('blogPage');if(!p)return;
  /* KABUK GARANTİSİ: sayfa KENDİ header+footer klonunu taşır (index'in header durumuna ve
     runtime-footer zamanlamasına bağımlılık yok). Klonlar hazır değilse 'kurulu' işaretlenmez
     → bir sonraki açılışta yeniden denenir. */
  var hdr=document.getElementById('hdr'), foot=document.querySelector('footer.insaatFooter');
  if(!p.dataset.kurulu){
    var hK=hdr?('<div class="bp-hdr">'+hdr.outerHTML.replace(/ id="[^"]*"/g,'').replace('<header','<header class="scrolled"').replace(/class="scrolled"([^>]*?)class="/,'$1class="scrolled ')+'</div>'):'';
    var fK=foot?foot.outerHTML.replace(/ id="[^"]*"/g,''):'';
    p.innerHTML=hK
      +'<div class="bp-in"><div id="bpManset"></div>'
      +'<div class="sec-head" style="margin:30px 0 18px"><div class="eyebrow">Bilgi Merkezi</div><h2>Tüm haberler &amp; rehberler</h2><p>İnşaat, tadilat, yatırım ve kentsel dönüşüm üzerine uzman içerikler.</p></div>'
      +'<div class="blog-grid" id="bpGrid"></div></div>'+fK;
    if(hdr&&foot)p.dataset.kurulu='1';
  }
  try{var g=p.querySelector('#bpGrid');if(g)g.innerHTML=insBlogAll().map(_insBlogKart).join('');}catch(e){}
  try{insMansetBas();}catch(e){}
  p.classList.add('on');document.body.style.overflow='hidden';
  try{if(!/^#blog/.test(location.hash||''))history.pushState(null,'','#blog');}catch(e){}
  p.scrollTop=0;}
function insBlogPageKapat(){var p=document.getElementById('blogPage');if(!p||!p.classList.contains('on'))return;
  _insAnimKapat(p,function(){p.classList.remove('on');});document.body.style.overflow='';
  try{if(/^#blog/.test(location.hash||''))history.pushState(null,'',location.pathname);}catch(e){}}
window.insBlogPageAc=insBlogPageAc;window.insBlogPageKapat=insBlogPageKapat;
/* #blog hash'i her değişimde blog sayfasını açar (footer linki sayfa içindeyken de) */
window.addEventListener('hashchange',function(){var h=location.hash||'';
  if(h==='#blog'){insBlogPageAc();}
  else if(/^#blog\//.test(h)){insBlogPageAc();setTimeout(function(){try{insBlogDetail(decodeURIComponent(h.slice(6)));}catch(e){}},250);}
  else{try{insBlogPageKapat();}catch(e){}}});
function paintImgs(){const a=document.getElementById('img-about');if(a&&IMG.about)a.src=IMG.about;const sf=document.getElementById('stageFb');if(sf&&IMG.p_office)sf.src=IMG.p_office;}
loadAll();insEidsMigrate();renderServices();renderProjects();renderBlog();paintImgs();
try{setTimeout(function(){try{renderInsHomeIlan();}catch(e){}},0);}catch(e){}/* INS_LIST_CFG dosyanın ilerisinde tanımlı → defer */

// HERO image carousel
(function(){
  const ids=['hi0','hi1','hi2','hi3'];
  const keys=['h0','h1','h2','h3']; // Istanbul hero photos
  ids.forEach((id,i)=>{const el=document.getElementById(id);if(el&&IMG[keys[i]])el.src=IMG[keys[i]];});
  let idx=0;
  setInterval(()=>{
    const cur=document.getElementById(ids[idx]);if(cur)cur.classList.remove('on');
    idx=(idx+1)%ids.length;
    const nx=document.getElementById(ids[idx]);if(nx)nx.classList.add('on');
  },5500);
})();

document.querySelectorAll('#filters button').forEach(b=>b.onclick=()=>{document.querySelectorAll('#filters button').forEach(x=>x.classList.remove('active'));b.classList.add('active');curFilter=b.dataset.f;renderProjects();});

/* counters */
function fmt(n,el){if(el.dataset.fmt==='m2')return (n/1000000).toFixed(1).replace('.',',')+'M m²';return n.toLocaleString('tr-TR')+(el.dataset.suf||'');}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){const el=e.target,t=+el.dataset.count;let s=0,st=t/60;const tick=()=>{if(!el)return;s+=st;if(s>=t)el.textContent=fmt(t,el);else{el.textContent=fmt(Math.floor(s),el);requestAnimationFrame(tick);}};tick();io.unobserve(el);}}),{threshold:.5});
document.querySelectorAll('[data-count]').forEach(el=>io.observe(el));

/* header scroll */
const hdr=document.getElementById('hdr'),totop=document.getElementById('totop'),cookie=document.getElementById('cookie');
function _totopScroller(){return document.querySelector('#faqPage.on,#docPage.on,#iletisimPage.on,#bolgePage.on,#projelerPage.on,#hizmetlerPage.on,#svcDetail.on,#pjDetail.on')||window;}
function _totopUpdate(){var s=_totopScroller();var y=(s===window)?(window.scrollY||window.pageYOffset||document.documentElement.scrollTop||0):(s.scrollTop||0);if(totop)totop.classList.toggle('show',y>600);}
function _totopSmooth(el){var isWin=(el===window);var start=isWin?(window.scrollY||window.pageYOffset||document.documentElement.scrollTop||0):(el.scrollTop||0);if(start<=0)return;var t0=(window.performance&&performance.now)?performance.now():Date.now();var dur=Math.min(650,Math.max(300,start*0.45));function set(y){if(isWin){window.scrollTo(0,y);document.documentElement.scrollTop=y;}else el.scrollTop=y;}function now(){return (window.performance&&performance.now)?performance.now():Date.now();}function step(){var p=Math.min(1,(now()-t0)/dur);var e=1-Math.pow(1-p,3);set(start*(1-e));if(p<1)setTimeout(step,16);else set(0);}step();}
function _totopClick(){_totopSmooth(_totopScroller());}
addEventListener('scroll',()=>{hdr.classList.toggle('scrolled',scrollY>40);_totopUpdate();});
document.addEventListener('scroll',_totopUpdate,true);
if(totop){totop.onclick=_totopClick;['faqPage','docPage','iletisimPage','bolgePage','projelerPage','hizmetlerPage','svcDetail','pjDetail'].forEach(function(id){var el=document.getElementById(id);if(el)new MutationObserver(_totopUpdate).observe(el,{attributes:true,attributeFilter:['class']});});}

/* teklif modal + leads */
function openTeklif(){document.getElementById('teklifModal').classList.add('open');}
function closeTeklif(){var m=document.getElementById('teklifModal');_insAnimKapat(m,function(){m.classList.remove('open');});}
function toast(m){const t=document.getElementById('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),3200);}
function submitLead(src){
  const g=id=>document.getElementById(id);
  let ad,tel,konu,kvkk,msg;
  if(src==='modal'){ad=g('m_ad').value;tel=g('m_tel').value;konu=g('m_konu').value;kvkk=g('m_kvkk').checked;msg=g('m_msg').value;}
  else{ad=g('f_ad').value;tel=g('f_tel').value;konu=g('f_konu').value;kvkk=g('f_kvkk').checked;msg=g('f_msg').value;}
  if(!ad||!tel){toast('Lütfen ad ve telefon girin.');return;}
  if(!kvkk){toast('Lütfen KVKK onayını işaretleyin.');return;}
  LEADS.unshift({ad,tel,konu,msg,src:src==='modal'?'Teklif Modalı':'İletişim Formu',date:new Date().toLocaleString('tr-TR')});saveAll();
  renderLeads();
  /* API-first: lead'i ProX merkezine de gönder (başarısızsa localStorage fallback — mevcut akış bozulmaz) */
  try{ if(typeof window.proxSubmitLead==='function'){ var _mail=(src==='modal')?'':((g('f_mail')||{}).value||''); window.proxSubmitLead({ sourcePage:'insaat', formType:(src==='modal'?'teklif_modal':'iletisim_form'), name:ad, phone:tel, email:_mail, location:'', message:msg, requestedService:konu }); } }catch(_){}
  if(src==='modal'){closeTeklif();['m_ad','m_tel','m_msg'].forEach(i=>g(i).value='');g('m_kvkk').checked=false;}
  else{['f_ad','f_tel','f_mail','f_msg'].forEach(i=>g(i).value='');g('f_kvkk').checked=false;}
  toast('✓ Teklif talebiniz alındı! Ekibimiz en kısa sürede dönüş yapacak.');
}

/* ---------------- THEME ---------------- */
const THEMES=[
  {n:'Grafit & Amber',brand:'#0e0f13',accent:'#ff7a2f',a2:'#ffb070',bg:'#0e0f13',sf:'#181a20',sf2:'#20232b',ink:'#f0eee9',mut:'#9aa0ab',line:'#262932',on:'#1a1205',dark:1},
  {n:'Lacivert',brand:'#0e2444',accent:'#2563eb',a2:'#c8962f',bg:'#f5f8fc',sf:'#fff',sf2:'#eef3f9',ink:'#101a2b',mut:'#5a6b82',line:'#e4ebf4',on:'#fff'},
  {n:'Amber',brand:'#1a1d23',accent:'#ff7a2f',a2:'#ffb070',bg:'#f6f6f7',sf:'#fff',sf2:'#efeff1',ink:'#16181d',mut:'#5d646f',line:'#e7e8ea',on:'#1a1205'},
  {n:'Çelik',brand:'#16324f',accent:'#0ea5e9',a2:'#38bdf8',bg:'#f4f8fb',sf:'#fff',sf2:'#e9f1f7',ink:'#112233',mut:'#56697e',line:'#e2ecf3',on:'#04222e'},
  {n:'Zümrüt',brand:'#0f2e25',accent:'#10b981',a2:'#34d399',bg:'#f4faf7',sf:'#fff',sf2:'#e8f5ef',ink:'#0f241d',mut:'#51695f',line:'#e0efe8',on:'#04231a'},
  {n:'Bordo',brand:'#4a1020',accent:'#b91c4b',a2:'#e0698c',bg:'#faf6f3',sf:'#fff',sf2:'#f4e9e6',ink:'#2b1119',mut:'#7a5e66',line:'#efe3df',on:'#fff'},
  {n:'Kehribar',brand:'#4a2a06',accent:'#b45309',a2:'#f59e0b',bg:'#fdf8f2',sf:'#fff',sf2:'#f7ecdd',ink:'#241708',mut:'#7a6a55',line:'#efe3d2',on:'#fff'},
  {n:'Okyanus',brand:'#0b2b3a',accent:'#0891b2',a2:'#22d3ee',bg:'#f2f9fb',sf:'#fff',sf2:'#e6f3f6',ink:'#0a2330',mut:'#4f6b76',line:'#ddeef2',on:'#03222b'},
  {n:'Toprak',brand:'#3b2a1a',accent:'#b4732a',a2:'#d99a4e',bg:'#faf7f2',sf:'#fff',sf2:'#f1ebe1',ink:'#2a2014',mut:'#6f6253',line:'#ece3d6',on:'#fff'},
  {n:'Gece',brand:'#0b0e14',accent:'#3b82f6',a2:'#60a5fa',bg:'#0b0e14',sf:'#141a23',sf2:'#1b222d',ink:'#e7eef7',mut:'#93a1b3',line:'#222b36',on:'#fff',dark:1},
];
const rootS=document.documentElement.style;
/* ---- Renk yardımcıları: otomatik kontrast (okunabilirlik) motoru ---- */
function _hex2rgb(h){h=(h||'').trim();if(h[0]==='#')h=h.slice(1);if(h.length===3)h=h.split('').map(c=>c+c).join('');const n=parseInt(h,16);return[(n>>16)&255,(n>>8)&255,n&255];}
function _lum(rgb){const a=rgb.map(v=>{v/=255;return v<=.03928?v/12.92:Math.pow((v+.055)/1.055,2.4);});return .2126*a[0]+.7152*a[1]+.0722*a[2];}
/* Zemin parlaksa koyu, koyuysa açık metin döndürür (WCAG luminance). */
function readableOn(bgHex){try{const L=_lum(_hex2rgb(bgHex));return L>.42?'#10151f':'#f6f4ef';}catch(e){return '#f6f4ef';}}
/* Zemin üstünde yumuşak ikincil metin (muted) rengi. */
function mutedOn(bgHex){try{const L=_lum(_hex2rgb(bgHex));return L>.42?'rgba(16,21,31,.62)':'rgba(246,244,239,.66)';}catch(e){return 'rgba(246,244,239,.66)';}}
/* Bir zemin değişkeni değişince, eşlik eden --on-* ve --mut-* değişkenlerini güncelle. */
const ON_MAP={'--bg':'--on-bg','--brand':'--on-brand','--surface':'--on-surface','--surface-2':'--on-surface-2','--accent':'--on-accent','--accent-2':'--on-accent-2'};
function setVar(k,v){rootS.setProperty(k,v);if(ON_MAP[k]&&v&&v[0]==='#'){rootS.setProperty(ON_MAP[k],readableOn(v));rootS.setProperty(ON_MAP[k]+'-mut',mutedOn(v));}}
/* Sayfa açılışında tüm zeminler için kontrast değişkenlerini bir kez hesapla. */
function initContrast(){const cs=getComputedStyle(document.documentElement);Object.keys(ON_MAP).forEach(bgK=>{let v=(cs.getPropertyValue(bgK)||'').trim();if(v&&v[0]==='#'){rootS.setProperty(ON_MAP[bgK],readableOn(v));rootS.setProperty(ON_MAP[bgK]+'-mut',mutedOn(v));}});}
function applyTheme(t){setVar('--brand',t.brand);setVar('--accent',t.accent);setVar('--accent-2',t.a2);setVar('--bg',t.bg);setVar('--surface',t.sf);setVar('--surface-2',t.sf2);setVar('--ink',t.ink);setVar('--muted',t.mut);setVar('--line',t.line);if(t.on)rootS.setProperty('--on-accent',t.on);const ap=document.getElementById('a_accent'),ap2=document.getElementById('a_accent2');if(ap)ap.value=t.accent;if(ap2)ap2.value=t.a2;const ab=document.getElementById('a_bg'),abr=document.getElementById('a_brandc'),asf=document.getElementById('a_surface');if(ab)ab.value=t.bg;if(abr)abr.value=t.brand;if(asf)asf.value=t.sf;}
function applyMode(m){const t=m==='dark'?THEMES[8]:THEMES[0];applyTheme(t);markSw(m==='dark'?8:0);}
function markSw(idx){document.querySelectorAll('#admSwatches .sw').forEach((s,i)=>s.classList.toggle('active',i===idx));}
function buildSwatches(){const el=document.getElementById('admSwatches');if(!el)return;el.innerHTML=THEMES.map((t,i)=>`<div class="sw ${i===0?'active':''}" title="${t.n}" onclick='applyTheme(THEMES[${i}]);markSw(${i})'><span class="b1" style="background:${t.brand}"></span><span class="b2" style="background:${t.accent}"></span><span class="nm">${t.n}</span></div>`).join('');}
/* Açılış: kayıtlı tema varsa uygula, ardından tüm zeminler için kontrastı hesapla */
(function(){try{if(typeof window.__pendingTheme==='number'&&THEMES[window.__pendingTheme]){applyTheme(THEMES[window.__pendingTheme]);markSw&&markSw(window.__pendingTheme);}}catch(e){}initContrast();})();

/* ---------------- ADMIN ---------------- */
function openAdmin(){try{window.__adminYukle&&window.__adminYukle();}catch(e){}try{history.replaceState(null,'','#admin');}catch(e){}showAdmin();}
function showAdmin(){
  var el=document.getElementById('adminApp'); if(!el)return;
  /* PERF: 49KB admin markup yalnız panel açılınca yüklenir (js/admin-markup.js) */
  if(!el.dataset.loaded){
    if(window.__INS_ADMIN_HTML){_admInject(el);}
    else{var sc=document.createElement('script');sc.src='js/admin-markup.js?v=1';sc.onload=function(){_admInject(el);};sc.onerror=function(){try{toast('Admin paneli yüklenemedi.');}catch(e){alert('Admin paneli yüklenemedi.');}};document.head.appendChild(sc);return;}
  }
  el.classList.add('show');document.body.style.overflow='hidden';try{buildSwatches();}catch(e){}
}
function _admInject(el){
  el.innerHTML=window.__INS_ADMIN_HTML||'';el.dataset.loaded='1';try{delete window.__INS_ADMIN_HTML;}catch(e){}
  el.classList.add('show');document.body.style.overflow='hidden';
  try{buildSwatches();}catch(e){}
  try{var act=el.querySelector('.adm-nav.act,[data-pane].act,.adm-tab.act')||el.querySelector('.adm-nav,[data-pane],.adm-tab');if(act&&act.click)act.click();}catch(e){}
}
function closeAdmin(){document.getElementById('adminApp').classList.remove('show');document.body.style.overflow='';if(location.hash==='#admin')try{history.replaceState(null,'',location.pathname);}catch(e){};}
function admLogin(){const p=document.getElementById('advPwd'),u=document.getElementById('advUsr'),err=document.getElementById('admErr');
  if(window.EMLAK_DEMO===true){document.getElementById('adminApp').classList.add('authed');if(err)err.style.display='none';refreshAdmin();return;}
  (async function(){
    try{const r=await fetch('/api/auth/admin/login',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({user:(u?u.value:'').trim(),pass:p?p.value:''})});
      if(r.ok){const j=await r.json().catch(function(){return {};});if(j&&j.ok!==false){document.getElementById('adminApp').classList.add('authed');if(err)err.style.display='none';refreshAdmin();return;}}
      if(err){err.style.display='';err.textContent='Giriş başarısız — bilgiler hatalı ya da hesap kilitli.';}
    }catch(e){if(err){err.style.display='';err.textContent='Yönetim girişi sunucu tarafında yapılandırılmadı.';}}
  })();}
function admLogout(){document.getElementById('adminApp').classList.remove('authed');document.getElementById('advPwd').value='';}
function admNav(pane,btn){document.querySelectorAll('.adm-pane').forEach(p=>p.classList.remove('on'));document.getElementById('pane-'+pane).classList.add('on');document.querySelectorAll('.adm-side button[data-pane]').forEach(b=>b.classList.remove('on'));btn.classList.add('on');if(pane==='leads')renderLeads();if(pane==='gorusmeler')renderGorusmeler();if(pane==='dash')renderKpi();if(pane==='arsa')renderArsa();if(pane==='ilanlar')renderInsIlan();if(pane==='portfoy')renderInsOzel();if(pane==='contracts')renderContracts();if(pane==='icstudio'&&window.csMountINS)csMountINS();if(pane==='proxai'&&window.insStudioFill)insStudioFill();if(pane==='settings')loadSettingsUI();if(pane==='brand')loadBrandUI();if(pane==='menutext')loadMenuUI();if(pane==='ads')loadAdsUI();if(pane==='diller')renderDiller();if(pane==='iletisim')loadIletisimUI();if(pane==='faq')renderFaqAdmin();if(pane==='social')loadSocialUI();if(pane==='stats')loadStatsUI();if(pane==='proje3d'&&window.initProje3D)setTimeout(()=>window.initProje3D(),60);if(pane!=='proje3d'&&window.__p3hide)window.__p3hide();}
function refreshAdmin(){renderKpi();admPjList();admSvcList();renderLeads();try{renderArsa();renderInsIlan();renderInsOzel();renderContracts();loadSettingsUI();loadBrandUI();loadMenuUI();loadAdsUI();loadSocialUI();}catch(e){}}
function renderKpi(){
  const k=document.getElementById('kpi');if(!k)return;
  k.innerHTML=[['🏗️',PROJECTS.length,'Toplam Proje'],['🟢',PROJECTS.filter(p=>p.st==='devam').length,'Devam Eden'],['👥',LEADS.length,'Teklif Talebi'],['🧰',SERVICES.length,'Hizmet']]
    .map(x=>`<div class="c"><span class="i">${x[0]}</span><div class="n">${x[1]}</div><div class="l">${x[2]}</div></div>`).join('');
  const dl=document.getElementById('dashLeads');
  dl.innerHTML=LEADS.length?('<table class="adm-tbl"><thead><tr><th>Ad</th><th>Telefon</th><th>Konu</th><th>Tarih</th></tr></thead><tbody>'+LEADS.slice(0,5).map(l=>`<tr><td>${l.ad}</td><td>${l.tel}</td><td>${l.konu}</td><td>${l.date}</td></tr>`).join('')+'</tbody></table>'):'<div style="color:var(--muted);font-size:.875rem">Henüz teklif talebi yok.</div>';
}
function renderLeads(){const b=document.getElementById('leadsBody');if(!b)return;b.innerHTML=LEADS.map(l=>`<tr><td>${l.ad}</td><td>${l.tel}</td><td>${l.konu}</td><td>${l.src}</td><td>${l.date}</td></tr>`).join('');document.getElementById('leadsEmpty').style.display=LEADS.length?'none':'block';renderKpi();}
/*__ADMIN_BLOK__*/ /* Bu bölge üretim paketinde admin-assets/ altına ayrılır (public bundle inmez) */
/* ===== GÖRÜŞMELER & TEKLİFLER — yetkili takip panosu ===== */
function _gEsc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function _gJSON(k,f){try{var v=JSON.parse(localStorage.getItem(k)||'null');return v==null?f:v;}catch(e){return f;}}
function _gDate(x){try{var d=(typeof x==='number')?new Date(x):new Date(x);return d.toLocaleString('tr-TR',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'});}catch(e){return '';}}
function renderGorusmeler(){
  var host=document.getElementById('gorusmelerBody');if(!host)return;
  var convos=_gJSON('prox_asistan_convos_v1',[]);if(!Array.isArray(convos))convos=[];
  var users=_gJSON('insaat_users_v1',{})||{};
  var quotes=[];try{for(var i=0;i<localStorage.length;i++){var kk=localStorage.key(i);if(kk&&kk.indexOf('insaat_quotes_')===0){var em=kk.slice(14);var arr=_gJSON(kk,[]);if(Array.isArray(arr))arr.forEach(function(q){quotes.push(Object.assign({_email:em},q));});}}}catch(e){}
  quotes.sort(function(a,b){return String(b.date||'').localeCompare(String(a.date||''));});
  var fbLeads=_gJSON('emlak_leads_fallback',[]);if(!Array.isArray(fbLeads))fbLeads=[];
  /* Geri arama talepleri: asistanda telefon bırakan görüşmeler + CRM fallback lead'ler */
  var cb=[];
  convos.forEach(function(c){if(c.lead&&c.phone)cb.push({name:c.user||'ProX Asistan ziyaretçisi',phone:c.phone,when:c.ts,note:(c.title||''),src:'ProX Asistan'});});
  fbLeads.forEach(function(l){cb.push({name:l.name||'—',phone:l.phone||'',when:l.createdAt,note:l.requestedService||l.message||l.formType||'',src:(l.formType||l.sourcePage||'form')});});
  cb.sort(function(a,b){return (new Date(b.when||0))-(new Date(a.when||0));});
  var memberList=Object.keys(users).map(function(e){return Object.assign({email:e},users[e]||{});});
  memberList.sort(function(a,b){return String(b.createdAt||'').localeCompare(String(a.createdAt||''));});
  var uname=function(e){return (users[e]&&users[e].name)||e;};
  var uphone=function(e){return (users[e]&&users[e].phone)||'';};

  var H='';
  /* KPI şeridi */
  H+='<div class="g-kpis">'
    +'<div class="g-kpi"><b>'+convos.length+'</b><span>ProX görüşmesi</span></div>'
    +'<div class="g-kpi"><b>'+quotes.length+'</b><span>Teklif talebi</span></div>'
    +'<div class="g-kpi"><b>'+memberList.length+'</b><span>Kayıtlı üye</span></div>'
    +'<div class="g-kpi'+(cb.length?' hot':'')+'"><b>'+cb.length+'</b><span>Geri arama talebi</span></div>'
    +'</div>';

  /* Geri arama talepleri (en aksiyon alınabilir) */
  H+='<div class="g-sec"><h3>📞 Geri Arama Talepleri</h3>';
  if(!cb.length){H+='<div class="g-empty">Telefon bırakan müşteri yok. Müşteri asistanda numarasını paylaşınca burada listelenir ve temsilci arayabilir.</div>';}
  else{H+='<div class="panelcard" style="padding:0"><table class="adm-tbl"><thead><tr><th>Ad</th><th>Telefon</th><th>Talep / Konu</th><th>Kaynak</th><th>Tarih</th><th></th></tr></thead><tbody>';
    cb.forEach(function(x){var tel=_gEsc(x.phone);H+='<tr><td>'+_gEsc(x.name)+'</td><td><b>'+tel+'</b></td><td>'+_gEsc(x.note)+'</td><td>'+_gEsc(x.src)+'</td><td>'+_gEsc(_gDate(x.when))+'</td><td>'+(x.phone?'<a class="g-call" href="tel:'+tel.replace(/[^\\d+]/g,'')+'">Ara</a>':'')+'</td></tr>';});
    H+='</tbody></table></div>';}
  H+='</div>';

  /* ProX Asistan görüşmeleri — tam transkript */
  H+='<div class="g-sec"><h3>💬 ProX Asistan Görüşmeleri</h3>';
  if(!convos.length){H+='<div class="g-empty">Henüz görüşme yok. Kullanıcılar ProX Asistan ile konuştukça tam dökümleri burada görünür.</div>';}
  else{convos.forEach(function(c){
    var msgs=(c.msgs||[]).filter(function(m){return m&&m.text;});
    var who=c.user?(_gEsc(c.user)+(c.email?(' <'+_gEsc(c.email)+'>'):'')):'Anonim ziyaretçi';
    H+='<details class="g-convo"'+(c.lead?' data-lead="1"':'')+'><summary><span class="g-ct">'+_gEsc(c.title||'Sohbet')+'</span><span class="g-cm">'+who+' · '+_gEsc(_gDate(c.ts))+' · '+msgs.length+' mesaj'+(c.lead?' · <b class="g-leadtag">📞 '+_gEsc(c.phone||'telefon bıraktı')+'</b>':'')+'</span></summary><div class="g-transcript">';
    if(!msgs.length){H+='<div class="g-empty">Boş görüşme.</div>';}
    msgs.forEach(function(m){var me=m.role==='me';H+='<div class="g-line '+(me?'me':'bot')+'"><span class="who">'+(me?'Müşteri':'ProX')+'</span><span class="tx">'+_gEsc(m.text)+'</span></div>';});
    H+='</div></details>';
  });}
  H+='</div>';

  /* Üye teklifleri */
  H+='<div class="g-sec"><h3>🧾 Üye Teklif Talepleri</h3>';
  if(!quotes.length){H+='<div class="g-empty">Henüz teklif talebi yok. Üyeler hesabından “Hızlı Teklif Al” gönderince burada listelenir.</div>';}
  else{quotes.forEach(function(q){
    var st=q.status==='answered';
    H+='<div class="g-quote"><div class="g-qhead"><b>'+_gEsc(q.konu||'Genel')+'</b><span class="g-qst '+(st?'ok':'wait')+'">'+(st?'✓ Yanıtlandı':'⏳ Bekliyor')+'</span></div>'
      +'<div class="g-qmeta">'+_gEsc(uname(q._email))+' · '+_gEsc(q._email)+(uphone(q._email)?(' · '+_gEsc(uphone(q._email))):'')+' · '+_gEsc(_gDate(q.date))+'</div>'
      +(q.mesaj?'<div class="g-qmsg">“'+_gEsc(q.mesaj)+'”</div>':'<div class="g-qmsg g-muted">(mesaj bırakılmadı)</div>')
      +(q.cevap?'<div class="g-qcevap"><b>ProX yanıtı:</b> '+_gEsc(q.cevap)+'</div>':'')
      +'</div>';
  });}
  H+='</div>';

  /* Üyeler */
  H+='<div class="g-sec"><h3>👤 Kayıtlı Üyeler</h3>';
  if(!memberList.length){H+='<div class="g-empty">Henüz kayıtlı üye yok.</div>';}
  else{H+='<div class="panelcard" style="padding:0"><table class="adm-tbl"><thead><tr><th>Ad Soyad</th><th>E-posta</th><th>Telefon</th><th>Kayıt</th></tr></thead><tbody>';
    memberList.forEach(function(u){H+='<tr><td>'+_gEsc(u.name||'—')+'</td><td>'+_gEsc(u.email)+'</td><td>'+_gEsc(u.phone||'—')+'</td><td>'+_gEsc(_gDate(u.createdAt))+'</td></tr>';});
    H+='</tbody></table></div>';}
  H+='</div>';

  H+='<div class="g-note">🔒 Bu veriler bu tarayıcıda saklanır. Canlı yayında tüm kullanıcıların görüşme ve teklifleri ProX CRM’de merkezî olarak toplanır; yetkili panelinden tüm cihazlardan takip edilir.</div>';
  host.innerHTML=H;
}
/* content save */
function saveContent(){
  const g=id=>document.getElementById(id).value;
  const brand=g('a_brand')||'Meridyen Yapı';const parts=brand.split(' ');const main=parts.shift();const rest=parts.join(' ');
  document.querySelectorAll('.js-logo').forEach(e=>e.innerHTML=main+(rest?` <span class="lo2">${rest}</span>`:''));
  document.querySelector('.js-h1').innerHTML=g('a_h1');
  document.querySelector('.js-sub').textContent=g('a_sub');
  document.querySelector('.js-about').textContent=g('a_about');
  document.querySelectorAll('.js-tel').forEach(e=>e.textContent=g('a_tel'));
  toast('✓ İçerik kaydedildi ve siteye uygulandı.');
}
/* admin projects */
function admPjList(){document.getElementById('admPjList').innerHTML=PROJECTS.map((p,i)=>`
  <div class="pjrow" id="apj${i}"><div class="ph"><b>${p.t} <span style="font-weight:400;color:var(--muted);font-size:.75rem">· ${ST_LABEL[p.st]||p.st}</span></b><span>
    <button class="lk" style="color:var(--accent)" onclick="document.getElementById('apj${i}').classList.toggle('open')">düzenle</button>
    <button class="lk" style="color:#d4416a" onclick="admDelPj(${i})">sil</button></span></div>
  <div class="ed">
    <div class="ed2">
      <div><label>Proje Başlığı</label><input type="text" value="${(p.t||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].t=this.value;renderProjects();admPjList0();saveAll()"></div>
      <div><label>Lokasyon</label><input type="text" value="${(p.loc||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].loc=this.value;renderProjects();saveAll()"></div>
    </div>
    <div class="ed2">
      <div><label>Durum</label><select onchange="PROJECTS[${i}].st=this.value;renderProjects();admPjList0();saveAll()"><option value="devam"${p.st=='devam'?' selected':''}>Devam Eden</option><option value="tamam"${p.st=='tamam'?' selected':''}>Tamamlandı</option><option value="plan"${p.st=='plan'?' selected':''}>Planlanan</option></select></div>
      <div><label>Tip / Daire Karması</label><input type="text" value="${(p.type||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].type=this.value;renderProjects();saveAll()"></div>
    </div>
    <div class="ed2">
      <div><label>Toplam Alan</label><input type="text" value="${(p.area||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].area=this.value;renderProjects();saveAll()"></div>
      <div><label>Konut/Birim Sayısı</label><input type="text" value="${(p.units||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].units=this.value;saveAll()"></div>
    </div>
    <div class="ed2">
      <div><label>Fiyat Bilgisi</label><input type="text" value="${(p.price||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].price=this.value;saveAll()"></div>
      <div><label>Teslim Tarihi</label><input type="text" value="${(p.delivery||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].delivery=this.value;saveAll()"></div>
    </div>
    <label>Kısa Açıklama</label><textarea rows="2" oninput="PROJECTS[${i}].desc=this.value;saveAll()" class="adm-ta">${p.desc||''}</textarea>
    <label>Detaylı Açıklama (proje detay sayfası)</label><textarea rows="4" oninput="PROJECTS[${i}].longDesc=this.value;saveAll()" class="adm-ta">${p.longDesc||''}</textarea>
    <label>İnşaat İlerlemesi: <b style="color:var(--accent)">%${p.progress||0}</b></label>
    <input type="range" min="0" max="100" value="${p.progress||0}" oninput="PROJECTS[${i}].progress=+this.value;this.previousElementSibling.querySelector('b').textContent='%'+this.value;saveAll()" class="adm-range">
    <label>Proje Görseli</label>
    <div class="imgpick">
      <div class="imgprev" id="prev${i}" style="background-image:url('${imgFor(p.img)}')"></div>
      <div class="imgpickbtns">
        <button class="btn-mini" onclick="document.getElementById('upl${i}').click()">📁 Bilgisayardan Görsel Yükle</button>
        <input type="file" id="upl${i}" accept="image/*" style="display:none" onchange="uploadPjImg(${i},this)">
        <input type="text" placeholder="veya görsel URL'si yapıştırın" value="${(p.img||'').startsWith('data:')?'':(p.img||'')}" oninput="PROJECTS[${i}].img=this.value;document.getElementById('prev${i}').style.backgroundImage='url('+imgFor(this.value)+')';renderProjects();saveAll()">
      </div>
    </div>
    ${admPjDetailEditor(p,i)}
  </div></div>`).join('');}

// ===== ADMIN: PROJE DETAY ALANLARI EDİTÖRÜ =====
function admPjDetailEditor(p,i){
  p.features=p.features||[];p.gallery=p.gallery||[];p.apts=p.apts||[];p.floors=p.floors||[];
  let h='<div style="margin-top:18px;padding-top:16px;border-top:2px solid var(--accent)"><b style="color:var(--accent);font-size:.8125rem">📐 DETAY SAYFASI YÖNETİMİ</b>';
  // ÖZELLİKLER
  h+='<label style="margin-top:14px">Proje Özellikleri</label>';
  h+=p.features.map((f,fi)=>`<div style="display:flex;gap:6px;margin-bottom:6px"><input type="text" value="${(f||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].features[${fi}]=this.value;saveAll()" style="flex:1"><button class="lk" style="color:#d4416a" onclick="PROJECTS[${i}].features.splice(${fi},1);admPjList();saveAll()">sil</button></div>`).join('');
  h+=`<button class="btn-mini" onclick="PROJECTS[${i}].features.push('Yeni özellik');admPjList();saveAll()">+ Özellik Ekle</button>`;
  // GALERİ
  h+='<label style="margin-top:14px">Galeri Görselleri</label><div style="display:flex;flex-wrap:wrap;gap:8px;margin-bottom:8px">';
  h+=p.gallery.map((g,gi)=>`<div style="position:relative"><div style="width:70px;height:54px;border-radius:8px;background:#222 url('${imgFor(g)}') center/cover;border:1px solid var(--line)"></div><button onclick="PROJECTS[${i}].gallery.splice(${gi},1);admPjList();renderProjects();saveAll()" style="position:absolute;top:-6px;right:-6px;width:20px;height:20px;border-radius:50%;border:none;background:#d4416a;color:#fff;cursor:pointer;font-size:.75rem;line-height:1">×</button></div>`).join('');
  h+='</div>';
  h+=`<button class="btn-mini" onclick="document.getElementById('gup${i}').click()">📁 Galeriye Görsel Ekle</button><input type="file" id="gup${i}" accept="image/*" multiple style="display:none" onchange="uploadGalleryImg(${i},this)">`;
  // DWG GERÇEK KAT CETVELİ (referans — admin daireleri buradan doldurur)
  var _hasDwg=(p.floors||[]).some(f=>(f.rooms&&f.rooms.length)||f.totalM2);
  if(_hasDwg){
    var _e=function(s){return String(s==null?'':s).replace(/[<>&"]/g,function(c){return {'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;'}[c];});};
    h+='<div style="margin-top:14px;background:var(--surface-2);border:1px solid rgba(22,163,74,.4);border-radius:10px;padding:11px">';
    h+='<div style="font-size:.75rem;font-weight:700;color:#16a34a;margin-bottom:8px">📐 DWG gerçek kat cetveli 🏷️ <span style="font-weight:400;color:var(--muted)">— daireleri buradan tek tıkla doldurun (m² dosyadan)</span></div>';
    p.floors.forEach((f)=>{ if(!(f.totalM2||(f.rooms&&f.rooms.length)))return;
      h+=`<div style="font-size:.71875rem;margin-bottom:6px;border-bottom:1px solid var(--line);padding-bottom:5px"><b>${_e(f.name)}</b>${f.totalM2?` · <b style="color:var(--accent)">${f.totalM2} m²</b>`:''}${f.rooms&&f.rooms.length?` · ${f.rooms.length} mahal`:''} <button class="lk" style="color:#16a34a" data-kat="${_e(f.name)}" onclick="dwgAddApt(${i},this.getAttribute('data-kat'))">+ bu kata daire</button>`;
      if(f.rooms&&f.rooms.length)h+=`<div style="color:var(--muted);margin-top:3px;line-height:1.6">${f.rooms.map(r=>_e(r.name)+' <b>'+r.m2+'</b>').join(' · ')}</div>`;
      h+='</div>';
    });
    h+='</div>';
  }
  // DAİRELER
  h+='<label style="margin-top:14px">Daireler ('+p.apts.length+')</label>';
  h+=p.apts.map((a,ai)=>`<div style="background:var(--surface-2);border-radius:10px;padding:10px;margin-bottom:8px">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px"><b style="font-size:.8125rem">Daire ${a.no||ai+1}</b><button class="lk" style="color:#d4416a" onclick="PROJECTS[${i}].apts.splice(${ai},1);admPjList();saveAll()">sil</button></div>
    <div class="ed2"><div><label>No</label><input value="${(a.no||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].apts[${ai}].no=this.value;saveAll()"></div><div><label>Tip</label><input value="${(a.tip||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].apts[${ai}].tip=this.value;saveAll()"></div></div>
    <div class="ed2"><div><label>m²</label><input value="${(a.m2||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].apts[${ai}].m2=this.value;saveAll()"></div><div><label>Kat</label><input value="${(a.kat||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].apts[${ai}].kat=this.value;saveAll()"></div></div>
    <div class="ed2"><div><label>Cephe</label><input value="${(a.cephe||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].apts[${ai}].cephe=this.value;saveAll()"></div><div><label>Fiyat</label><input value="${(a.fiyat||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].apts[${ai}].fiyat=this.value;saveAll()"></div></div>
    <label>Durum</label><select onchange="PROJECTS[${i}].apts[${ai}].durum=this.value;saveAll()"><option value="musait"${a.durum=='musait'?' selected':''}>Müsait</option><option value="opsiyonlu"${a.durum=='opsiyonlu'?' selected':''}>Opsiyonlu</option><option value="satildi"${a.durum=='satildi'?' selected':''}>Satıldı</option></select>
  </div>`).join('');
  h+=`<button class="btn-mini" onclick="PROJECTS[${i}].apts.push({no:'',tip:'2+1',m2:'',kat:'',cephe:'',fiyat:'',durum:'musait'});admPjList();saveAll()">+ Daire Ekle</button>`;
  // KATLAR / KAT PLANI
  h+='<label style="margin-top:14px">Katlar & Kat Planı</label>';
  h+=p.floors.map((f,fi)=>`<div style="background:var(--surface-2);border-radius:10px;padding:10px;margin-bottom:8px">
    <div style="display:flex;justify-content:space-between;margin-bottom:6px"><input value="${(f.name||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].floors[${fi}].name=this.value;saveAll()" placeholder="Kat adı" style="flex:1"><button class="lk" style="color:#d4416a;margin-left:8px" onclick="PROJECTS[${i}].floors.splice(${fi},1);admPjList();saveAll()">sil</button></div>
    <label>Bu kattaki daire no'ları (virgülle)</label><input value="${(f.units||[]).join(', ')}" oninput="PROJECTS[${i}].floors[${fi}].units=this.value.split(',').map(s=>s.trim()).filter(Boolean);saveAll()">
    <div style="display:flex;gap:8px;align-items:center;margin-top:8px"><div style="width:70px;height:50px;border-radius:8px;background:#222 ${f.img?`url('${imgFor(f.img)}') center/cover`:''};border:1px solid var(--line)"></div>
    <button class="btn-mini" onclick="document.getElementById('flup${i}_${fi}').click()">📁 Kat Planı Görseli Yükle</button><input type="file" id="flup${i}_${fi}" accept="image/*" style="display:none" onchange="uploadFloorImg(${i},${fi},this)"></div>
  </div>`).join('');
  h+=`<button class="btn-mini" onclick="PROJECTS[${i}].floors.push({name:'Yeni Kat',img:'',units:[]});admPjList();saveAll()">+ Kat Ekle</button>`;
  // TESLİM TAKVİMİ
  p.timeline=p.timeline||[];
  h+='<label style="margin-top:14px">İnşaat & Teslim Takvimi</label>';
  h+=p.timeline.map((t,ti)=>`<div style="display:flex;gap:6px;margin-bottom:6px;align-items:center">
    <input value="${(t.ad||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].timeline[${ti}].ad=this.value;saveAll()" placeholder="Aşama" style="flex:2">
    <input value="${(t.tarih||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].timeline[${ti}].tarih=this.value;saveAll()" placeholder="Tarih" style="flex:1">
    <select onchange="PROJECTS[${i}].timeline[${ti}].durum=this.value;saveAll()"><option value="bitti"${t.durum=='bitti'?' selected':''}>Tamamlandı</option><option value="devam"${t.durum=='devam'?' selected':''}>Devam</option><option value="bekliyor"${t.durum=='bekliyor'?' selected':''}>Planlandı</option></select>
    <button class="lk" style="color:#d4416a" onclick="PROJECTS[${i}].timeline.splice(${ti},1);admPjList();saveAll()">sil</button></div>`).join('');
  h+=`<button class="btn-mini" onclick="PROJECTS[${i}].timeline.push({ad:'Yeni aşama',tarih:'',durum:'bekliyor'});admPjList();saveAll()">+ Aşama Ekle</button>`;
  // ÖDEME PLANI
  p.payment=p.payment||{pesin:'',taksit:'',banka:'',not:''};
  h+='<label style="margin-top:14px">Ödeme & Finansman</label>';
  h+=`<div class="ed2"><div><label>Peşinat</label><input value="${(p.payment.pesin||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].payment.pesin=this.value;saveAll()"></div><div><label>Vade</label><input value="${(p.payment.taksit||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].payment.taksit=this.value;saveAll()"></div></div>`;
  h+=`<label>Banka / Kredi</label><input value="${(p.payment.banka||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].payment.banka=this.value;saveAll()">`;
  h+=`<label>Not (opsiyonel)</label><input value="${(p.payment.not||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].payment.not=this.value;saveAll()">`;
  // LOKASYON
  p.location=p.location||{adres:'',ulasim:[],cevre:[]};p.location.ulasim=p.location.ulasim||[];p.location.cevre=p.location.cevre||[];
  h+='<label style="margin-top:14px">Lokasyon & Ulaşım</label>';
  h+=`<label>Adres</label><input value="${(p.location.adres||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].location.adres=this.value;saveAll()">`;
  h+='<label style="font-size:.75rem;margin-top:8px">Ulaşım maddeleri</label>';
  h+=p.location.ulasim.map((u,ui)=>`<div style="display:flex;gap:6px;margin-bottom:5px"><input value="${(u||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].location.ulasim[${ui}]=this.value;saveAll()" style="flex:1"><button class="lk" style="color:#d4416a" onclick="PROJECTS[${i}].location.ulasim.splice(${ui},1);admPjList();saveAll()">sil</button></div>`).join('');
  h+=`<button class="btn-mini" onclick="PROJECTS[${i}].location.ulasim.push('');admPjList();saveAll()">+ Ulaşım Ekle</button>`;
  h+='<label style="font-size:.75rem;margin-top:8px">Çevre & Yaşam maddeleri</label>';
  h+=p.location.cevre.map((c,ci)=>`<div style="display:flex;gap:6px;margin-bottom:5px"><input value="${(c||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].location.cevre[${ci}]=this.value;saveAll()" style="flex:1"><button class="lk" style="color:#d4416a" onclick="PROJECTS[${i}].location.cevre.splice(${ci},1);admPjList();saveAll()">sil</button></div>`).join('');
  h+=`<button class="btn-mini" onclick="PROJECTS[${i}].location.cevre.push('');admPjList();saveAll()">+ Çevre Ekle</button>`;
  // KÜNYE
  p.specs=p.specs||[];
  h+='<label style="margin-top:14px">Proje Künyesi</label>';
  h+=p.specs.map((s,si)=>`<div style="display:flex;gap:6px;margin-bottom:5px"><input value="${(s.k||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].specs[${si}].k=this.value;saveAll()" placeholder="Özellik" style="flex:1"><input value="${(s.v||'').replace(/"/g,'&quot;')}" oninput="PROJECTS[${i}].specs[${si}].v=this.value;saveAll()" placeholder="Değer" style="flex:1"><button class="lk" style="color:#d4416a" onclick="PROJECTS[${i}].specs.splice(${si},1);admPjList();saveAll()">sil</button></div>`).join('');
  h+=`<button class="btn-mini" onclick="PROJECTS[${i}].specs.push({k:'',v:''});admPjList();saveAll()">+ Künye Satırı Ekle</button>`;
  h+='</div>';
  return h;
}
function uploadGalleryImg(i,input){
  [...input.files].forEach(file=>{
    if(file.size>3*1024*1024){alert('Her görsel 3MB\'den küçük olmalı.');return;}
    const r=new FileReader();r.onload=()=>{PROJECTS[i].gallery.push(r.result);admPjList();renderProjects();saveAll();};r.readAsDataURL(file);
  });
}
function uploadFloorImg(i,fi,input){
  const file=input.files[0];if(!file)return;
  if(file.size>3*1024*1024){alert('Görsel 3MB\'den küçük olmalı.');return;}
  const r=new FileReader();r.onload=()=>{PROJECTS[i].floors[fi].img=r.result;admPjList();saveAll();};r.readAsDataURL(file);
}
function admPjList0(){} // no-op to avoid rerender focus loss on title
// DWG kat cetvelinden tek tıkla daire ekle (kat önceden dolu; tip/m² admin girer)
function dwgAddApt(i,kat){if(!PROJECTS[i])return;var no=(kat&&/dükkan|dukkan|ticar/i.test(kat)?'K':'D')+(PROJECTS[i].apts.length+1);PROJECTS[i].apts.push({no:no,tip:'',m2:'',kat:kat||'',cephe:'',fiyat:'',durum:'musait'});admPjList();try{saveAll();}catch(e){}}
function admDelPj(i){if(confirm('Proje silinsin mi?')){PROJECTS.splice(i,1);renderProjects();admPjList();renderKpi();}}

function uploadPjImg(i,input){
  const file=input.files[0];if(!file)return;
  if(file.size>3*1024*1024){alert('Görsel 3MB\'den küçük olmalı. Lütfen daha küçük bir görsel seçin.');return;}
  const r=new FileReader();
  r.onload=()=>{
    PROJECTS[i].img=r.result; // base64 data URL
    const prev=document.getElementById('prev'+i);if(prev)prev.style.backgroundImage='url('+r.result+')';
    renderProjects();saveAll();
  };
  r.readAsDataURL(file);
}
// ============ ARSA & BAĞIMSIZ BÖLÜM YÖNETİMİ ============
function imarHesap(a){
  const insaatAlani=a.m2*(a.imar.emsal||0);
  const tabanAlani=a.m2*(a.imar.taks||0);
  return {insaatAlani,tabanAlani};
}
function bbOzet(a){
  const o={toplam:a.bb.length,satildi:0,kiralandi:0,bos:0,rezerve:0,arsa:0,satilanM2:0,bosM2:0,toplamM2:0,gelir:0};
  a.bb.forEach(b=>{
    o.toplamM2+=(+b.m2||0);
    if(b.durum==='satildi'){o.satildi++;o.satilanM2+=(+b.m2||0);const f=parseFloat(String(b.fiyat).replace(/[^0-9]/g,''));if(f)o.gelir+=f;}
    else if(b.durum==='kiralandi')o.kiralandi++;
    else if(b.durum==='bos'){o.bos++;o.bosM2+=(+b.m2||0);}
    else if(b.durum==='rezerve')o.rezerve++;
    else if(b.durum==='arsa-sahibi')o.arsa++;
  });
  return o;
}
function kkHesap(a){
  const insaatAlani=a.m2*(a.imar.emsal||0);
  const tabanAlani=a.m2*(a.imar.taks||0);
  const kk=a.kk||{};
  const ortM2=kk.ortalamaDaireM2||120;
  const tahminiDaire=Math.floor(insaatAlani/ortM2);
  const arsaPay=(kk.arsaSahibiPay||0)/100;
  const mutPay=(kk.muteahhitPay||0)/100;
  const arsaSahibiDaire=Math.floor(tahminiDaire*arsaPay);
  const muteahhitDaire=tahminiDaire-arsaSahibiDaire;
  const satisFiyat=kk.daireSatisM2Fiyat||0;
  const maliyet=kk.insaatM2Maliyet||0;
  const toplamSatisGeliri=insaatAlani*satisFiyat;
  const toplamInsaatMaliyeti=insaatAlani*maliyet;
  const muteahhitGeliri=muteahhitDaire*ortM2*satisFiyat;
  const muteahhitNetKar=muteahhitGeliri-toplamInsaatMaliyeti;
  const arsaSahibiGeliri=arsaSahibiDaire*ortM2*satisFiyat;
  return {insaatAlani,tabanAlani,tahminiDaire,arsaSahibiDaire,muteahhitDaire,
    toplamSatisGeliri,toplamInsaatMaliyeti,muteahhitGeliri,muteahhitNetKar,arsaSahibiGeliri,ortM2};
}
function fmtTL(n){if(!isFinite(n))return '-';return n>=1e6?(n/1e6).toFixed(1)+'M ₺':Math.round(n).toLocaleString('tr-TR')+' ₺';}
function renderArsa(){
  const el=document.getElementById('arsaList');if(!el)return;
  el.innerHTML=ARSALAR.map((a,ai)=>{
    const r=kkHesap(a);
    return `<div class="arsa-card">
      <div class="arsa-head">
        <div><div class="arsa-name">${a.ad}</div><div class="arsa-addr">📍 ${a.adres||''}</div></div>
        <button class="lk" style="color:#d4416a" onclick="admDelArsa(${ai})">sil</button>
      </div>
      <div class="ed2">
        <div><label>Fizibilite Adı</label><input value="${(a.ad||'').replace(/"/g,'&quot;')}" oninput="ARSALAR[${ai}].ad=this.value;saveAll()"></div>
        <div><label>Arsa Adresi</label><input value="${(a.adres||'').replace(/"/g,'&quot;')}" oninput="ARSALAR[${ai}].adres=this.value;saveAll()"></div>
      </div>
      <div class="imar-box">
        <div class="imar-title">📐 İmar Durumu</div>
        <div class="imar-inputs">
          <div><label>Arsa m²</label><input type="number" value="${a.m2}" oninput="ARSALAR[${ai}].m2=+this.value;renderArsa();saveAll()"></div>
          <div><label>Emsal (KAKS)</label><input type="number" step="0.01" value="${a.imar.emsal}" oninput="ARSALAR[${ai}].imar.emsal=+this.value;renderArsa();saveAll()"></div>
          <div><label>TAKS</label><input type="number" step="0.01" value="${a.imar.taks}" oninput="ARSALAR[${ai}].imar.taks=+this.value;renderArsa();saveAll()"></div>
          <div><label>Kat Adedi</label><input type="number" value="${a.imar.katAdedi}" oninput="ARSALAR[${ai}].imar.katAdedi=+this.value;saveAll()"></div>
          <div><label>Gabari</label><input value="${a.imar.gabari||''}" oninput="ARSALAR[${ai}].imar.gabari=this.value;saveAll()"></div>
          <div><label>Ada / Parsel</label><input value="${(a.imar.ada||'')+' / '+(a.imar.parsel||'')}" oninput="const p=this.value.split('/');ARSALAR[${ai}].imar.ada=(p[0]||'').trim();ARSALAR[${ai}].imar.parsel=(p[1]||'').trim();saveAll()"></div>
        </div>
        <div class="imar-calc">
          <div class="calc-it"><div class="cv">${r.insaatAlani.toLocaleString('tr-TR')} m²</div><div class="cl">Toplam İnşaat Alanı (m²×emsal)</div></div>
          <div class="calc-it"><div class="cv">${r.tabanAlani.toLocaleString('tr-TR')} m²</div><div class="cl">Taban Alanı (m²×TAKS)</div></div>
          <div class="calc-it"><div class="cv">${r.tahminiDaire} adet</div><div class="cl">Tahmini Daire (~${r.ortM2}m²)</div></div>
        </div>
      </div>
      <div class="imar-box">
        <div class="imar-title">🤝 Kat Karşılığı Parametreleri</div>
        <div class="imar-inputs">
          <div><label>Arsa Sahibi Payı %</label><input type="number" value="${a.kk.arsaSahibiPay}" oninput="ARSALAR[${ai}].kk.arsaSahibiPay=+this.value;ARSALAR[${ai}].kk.muteahhitPay=100-(+this.value);renderArsa();saveAll()"></div>
          <div><label>Müteahhit Payı %</label><input type="number" value="${a.kk.muteahhitPay}" readonly style="opacity:.7"></div>
          <div><label>Arsa Sahibi</label><input value="${(a.kk.sahip||'').replace(/"/g,'&quot;')}" oninput="ARSALAR[${ai}].kk.sahip=this.value;saveAll()"></div>
          <div><label>Ort. Daire m²</label><input type="number" value="${a.kk.ortalamaDaireM2}" oninput="ARSALAR[${ai}].kk.ortalamaDaireM2=+this.value;renderArsa();saveAll()"></div>
          <div><label>Daire Satış ₺/m²</label><input type="number" value="${a.kk.daireSatisM2Fiyat}" oninput="ARSALAR[${ai}].kk.daireSatisM2Fiyat=+this.value;renderArsa();saveAll()"></div>
          <div><label>İnşaat ₺/m² Maliyet</label><input type="number" value="${a.kk.insaatM2Maliyet}" oninput="ARSALAR[${ai}].kk.insaatM2Maliyet=+this.value;renderArsa();saveAll()"></div>
        </div>
      </div>
      <div class="kk-result">
        <div class="kkr-title">📊 Paylaşım & Fizibilite Sonucu</div>
        <div class="kkr-grid">
          <div class="kkr-box kkr-arsa">
            <div class="kkr-label">ARSA SAHİBİ (${a.kk.arsaSahibiPay}%)</div>
            <div class="kkr-big">${r.arsaSahibiDaire} daire</div>
            <div class="kkr-sub">≈ ${fmtTL(r.arsaSahibiGeliri)} değer</div>
          </div>
          <div class="kkr-box kkr-mut">
            <div class="kkr-label">MÜTEAHHİT (${a.kk.muteahhitPay}%)</div>
            <div class="kkr-big">${r.muteahhitDaire} daire</div>
            <div class="kkr-sub">≈ ${fmtTL(r.muteahhitGeliri)} gelir</div>
          </div>
        </div>
        <div class="kkr-fin">
          <div class="kkr-fi"><span>Toplam Satış Geliri (proje)</span><b>${fmtTL(r.toplamSatisGeliri)}</b></div>
          <div class="kkr-fi"><span>Toplam İnşaat Maliyeti</span><b>${fmtTL(r.toplamInsaatMaliyeti)}</b></div>
          <div class="kkr-fi kkr-net"><span>Müteahhit Tahmini Net Kâr</span><b style="color:${r.muteahhitNetKar>=0?'#34d399':'#f0698c'}">${fmtTL(r.muteahhitNetKar)}</b></div>
        </div>
        <div class="kkr-note">⚠️ Bu hesaplama ön fizibilite amaçlıdır. Kesin daire adedi onaylı mimari projeye, fiyatlar piyasa koşullarına göre değişir.</div>
      </div>
    </div>`;
  }).join('');
}
function admAddArsa(){ARSALAR.unshift({id:'ar'+Date.now(),ad:'Yeni Kat Karşılığı Fizibilite',adres:'',m2:1000,imar:{emsal:2.0,taks:0.4,katAdedi:5,gabari:'',ada:'',parsel:''},kk:{arsaSahibiPay:50,muteahhitPay:50,sahip:'',ortalamaDaireM2:120,daireSatisM2Fiyat:70000,insaatM2Maliyet:18000,not:''}});renderArsa();saveAll();}
function admDelArsa(i){if(confirm('Bu arsa/projeyi ve tüm bağımsız bölümlerini silmek istediğinize emin misiniz?')){ARSALAR.splice(i,1);renderArsa();saveAll();}}

/*__ADMIN_BLOK_SON__*/
/* ============================================================
   İLANLAR (EİDS üzerinden) + ÖZEL PORTFÖY (ProX destekli üretim)
   — dürüstlük disiplini:
     · EİDS GERÇEKTİR (shared/eids.js): kod/durum uydurulmaz, doğrulama backend'e
       devredilir; canlı uç yoksa durum dürüstçe 'beklemede' kalır.
     · Yayın kapısı = ilan gerçekten doğrulandı (EIDS.canPublish); doğrulanmamış
       ilan yalnız uyarı sonrası (demo) yayınlanır ve rozeti gerçeği gösterir.
     · Özel Portföy EİDS DIŞIDIR; ProX bölge verisinden ÜRETİLEN
       pazar tahminidir (kesin ilan fiyatı değil).
     · Kullanıcının KENDİ ilanları içe aktarılır — portal scraping YOK.
   ============================================================ */
function _ie(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function _ifmt(n){try{return Number(n||0).toLocaleString('tr-TR');}catch(e){return ''+n;}}
var INS_LIST_IMGS=['p_res','p_lux','p_villa','p_office','p_home','p_white'];
/* ---- EİDS · GERÇEK doğrulama (shared/eids.js → window.EIDS) ----
   Kod/durum UYDURULMAZ. Doğrulama backend'e (proxApi /eids/verify) devredilir;
   canlı uç yoksa durum dürüstçe 'beklemede' kalır. */
function insEidsBadge(it){return (window.EIDS?EIDS.badgeHTML(it&&it.eids):'');}
function insFirmaYetkiBelge(){return (SETTINGS&&SETTINGS.eidsYetkiBelgeNo)||'';}
/* Boot göçü: eski SAHTE kayıtları (uydurma .kod) ve eksikleri gerçek 'beklemede' kaydına indir */
function insEidsMigrate(){ if(!window.EIDS||!Array.isArray(ILANLAR))return; var ch=false;
  ILANLAR.forEach(function(it){ if(!it)return;
    if(!it.eids || it.eids.kod!==undefined || !it.eids.status){ it.eids=EIDS.newRecord({il:it.il,ilce:it.ilce,malikTip:(it.eids&&it.eids.malikTip)||'malik'}); ch=true; }
  }); if(ch&&typeof saveAll==='function')saveAll();
}
/* Gerçek doğrulama tetikle — alanları backend'e gönderir, sonucu dürüstçe yazar (sahte onay YOK) */
function insEidsVerify(i){
  var it=ILANLAR[i]; if(!it)return; if(!window.EIDS){toast('EİDS modülü yüklenemedi.');return;}
  var e=it.eids||(it.eids=EIDS.newRecord({il:it.il,ilce:it.ilce}));
  var fields={ tasinmazNo:e.tasinmazNo, il:it.il, ilce:it.ilce, ada:e.ada, parsel:e.parsel, malikTip:e.malikTip||'malik', yetkiBelgeNo:(e.malikTip==='isletme'?insFirmaYetkiBelge():'') };
  var eksik=EIDS.eksikAlanlar(EIDS.newRecord(fields));
  if(eksik.length){ toast('EİDS için eksik alan: '+eksik.join(', ')+'.'); return; }
  var btn=document.getElementById('insEidsBtn'+i); if(btn){btn.disabled=true;btn.textContent='⏳ Bakanlık EİDS sisteminde doğrulanıyor…';}
  EIDS.verify(fields).then(function(rec){
    it.eids={ status:rec.status, tasinmazNo:fields.tasinmazNo, ada:fields.ada, parsel:fields.parsel, malikTip:fields.malikTip, yetkiBelgeNo:fields.yetkiBelgeNo, referans:rec.referans, tarih:rec.tarih, mesaj:rec.mesaj };
    if(rec.status!==EIDS.STATES.DOGRULANDI&&it.status==='aktif'){/* doğrulanmadıysa yayında kalabilir ama rozet gerçeği gösterir */}
    saveAll(); renderInsIlan(); renderInsIlanPublic();
    toast(EIDS.stateLabel(it.eids)+' — '+rec.mesaj);
  });
}

/* ---- Admin: İLAN yönetimi ---- */
function insEidsSetBelge(v){SETTINGS.eidsYetkiBelgeNo=v;saveAll();}
function renderInsIlan(){
  var el=document.getElementById('insIlanList');if(!el)return;
  var bn=document.getElementById('insEidsYetkiBelge');if(bn&&document.activeElement!==bn)bn.value=(SETTINGS.eidsYetkiBelgeNo||'');
  if(!ILANLAR.length){el.innerHTML='<div style="color:var(--muted);font-size:.875rem;padding:14px 4px">Henüz ilan yok. “+ Yeni İlan” ile ekleyin ya da yukarıdan toplu içe aktarın.</div>';return;}
  el.innerHTML=ILANLAR.map(function(it,i){
    var pub=it.status==='aktif';
    return '<div class="ins-ilan-card">'
      +'<div class="ins-ilan-head">'
        +'<div class="ins-ilan-t">'+_ie(it.title||'(başlıksız)')+'</div>'
        +'<div class="ins-ilan-badges">'+insEidsBadge(it)
          +'<span class="ins-pub '+(pub?'on':'')+'">'+(pub?'🟢 Yayında':'⚪ Taslak')+'</span></div>'
      +'</div>'
      +'<div class="ed2">'
        +'<div><label>Başlık <button type="button" class="btn btn-line" style="font-size:.6875rem;padding:2px 8px;margin-left:6px" onclick="insIlanAiTitle('+i+')">🤖 AI Başlık</button></label><input id="ins_title_'+i+'" value="'+_ie(it.title)+'" oninput="ILANLAR['+i+'].title=this.value;saveAll()"></div>'
        +'<div><label>Açıklama <button type="button" class="btn btn-line" style="font-size:.6875rem;padding:2px 8px;margin-left:6px" onclick="insIlanAiDesc('+i+')">🤖 AI ile Üret</button></label><textarea id="ins_desc_'+i+'" rows="2" oninput="ILANLAR['+i+'].desc=this.value;saveAll()">'+_ie(it.desc||'')+'</textarea></div>'
      +'</div>'
      +'<div class="ins-ilan-grid">'
        +'<div><label>İşlem</label><select oninput="ILANLAR['+i+'].op=this.value;saveAll()"><option'+(it.op==='Satılık'?' selected':'')+'>Satılık</option><option'+(it.op==='Kiralık'?' selected':'')+'>Kiralık</option></select></div>'
        +'<div><label>Kategori</label>'+(window.Listings?'<select onchange="ILANLAR['+i+'].type=this.value;insRenderAttr('+i+');saveAll()">'+Listings.typeOptionsHTML(it.type)+'</select>':'<input value="'+_ie(it.type)+'" oninput="ILANLAR['+i+'].type=this.value;saveAll()">')+'</div>'
        +'<div><label>İl</label>'+(window.Listings?'<select onchange="ILANLAR['+i+'].il=this.value;insIlChange('+i+',this.value);saveAll()">'+Listings.ilOptions(it.il||'İstanbul')+'</select>':'<input value="'+_ie(it.il)+'" oninput="ILANLAR['+i+'].il=this.value;saveAll()">')+'</div>'
        +'<div><label>İlçe</label>'+(window.Listings?'<select id="ins_ilce_'+i+'" onchange="ILANLAR['+i+'].ilce=this.value;saveAll()">'+Listings.ilceOptions(it.il||'İstanbul',it.ilce)+'</select>':'<input value="'+_ie(it.ilce)+'" oninput="ILANLAR['+i+'].ilce=this.value;saveAll()">')+'</div>'
        +'<div><label>Mahalle</label><input value="'+_ie(it.mah)+'" oninput="ILANLAR['+i+'].mah=this.value;saveAll()" placeholder="Mahalle"></div>'
        +'<div><label>m²</label><input type="number" value="'+(+it.m2||0)+'" oninput="ILANLAR['+i+'].m2=+this.value;saveAll()"></div>'
        +'<div><label>Oda</label><input value="'+_ie(it.oda)+'" oninput="ILANLAR['+i+'].oda=this.value;saveAll()"></div>'
        +'<div><label>Kat</label><input value="'+_ie(it.kat)+'" oninput="ILANLAR['+i+'].kat=this.value;saveAll()"></div>'
        +'<div><label>Fiyat ₺'+(it.op==='Kiralık'?'/ay':'')+'</label><input type="number" value="'+(+it.price||0)+'" oninput="ILANLAR['+i+'].price=+this.value;saveAll()"></div>'
      +'</div>'
      +'<div class="ins-attrwrap"><label style="font-weight:700;font-size:.75rem;display:block;margin:10px 0 6px">Kategori Detayları <span style="font-weight:400;opacity:.7">— seçerek doldurun</span></label><div id="ins_attr_'+i+'" onchange="insCollectAttrs('+i+')" onclick="insCollectAttrs('+i+')">'+(window.Listings?Listings.attrFormHTML(Listings.catOf(it),it.attrs||{},it.features||[]):'')+'</div></div>'
      +'<div class="ins-attrwrap" id="ins_media_'+i+'" onchange="insCollectMedia('+i+')">'+(window.Listings&&Listings.mediaFormHTML?Listings.mediaFormHTML(it):'')+'</div>'
      +'<div class="ins-eids-box">'
        +'<div class="ins-eids-row">'+insEidsBadge(it)+'<span class="ins-eids-msg">'+_ie((it.eids&&it.eids.mesaj)||'')+'</span></div>'
        +'<div class="ins-eids-fields">'
          +'<div><label>Malik Tipi</label><select oninput="ILANLAR['+i+'].eids.malikTip=this.value;renderInsIlan();saveAll()">'+(window.EIDS?EIDS.MALIK_TIPLERI.map(function(m){return '<option value="'+m.k+'"'+(((it.eids&&it.eids.malikTip)||'malik')===m.k?' selected':'')+'>'+_ie(m.ad)+'</option>';}).join(''):'')+'</select></div>'
          +'<div><label>Taşınmaz No <span class="ins-req">*</span></label><input value="'+_ie((it.eids&&it.eids.tasinmazNo)||'')+'" placeholder="Tapudaki Taşınmaz No" oninput="ILANLAR['+i+'].eids.tasinmazNo=this.value;saveAll()"></div>'
          +'<div><label>Ada <span class="ins-req">*</span></label><input value="'+_ie((it.eids&&it.eids.ada)||'')+'" oninput="ILANLAR['+i+'].eids.ada=this.value;saveAll()"></div>'
          +'<div><label>Parsel <span class="ins-req">*</span></label><input value="'+_ie((it.eids&&it.eids.parsel)||'')+'" oninput="ILANLAR['+i+'].eids.parsel=this.value;saveAll()"></div>'
        +'</div>'
        +(((it.eids&&it.eids.malikTip)||'malik')==='isletme'?'<div class="ins-eids-hint">Emlak işletmesi olarak: firma Yetki Belge No (üstte) + malikin e-Devlet yetkisi gerekir.</div>':'')
        +'<button class="btn-mini" id="insEidsBtn'+i+'" onclick="insEidsVerify('+i+')">🛡️ EİDS Doğrula</button>'
      +'</div>'
      +'<div class="ins-ilan-actions">'
        +'<button class="btn-mini" onclick="insIlanTogglePub('+i+')">'+(pub?'⏸ Yayından kaldır':'▶ Yayına al')+'</button>'
        +'<label class="ins-feat"><input type="checkbox"'+(it.feat?' checked':'')+' onchange="ILANLAR['+i+'].feat=this.checked?1:0;saveAll()"> Öne çıkar</label>'
        +'<button class="lk" style="color:#d4416a;margin-left:auto" onclick="insIlanDel('+i+')">sil</button>'
      +'</div>'
    +'</div>';
  }).join('');
}
function insIlanAdd(){
  ILANLAR.unshift({id:'il'+Date.now(),title:'Yeni İlan',op:'Satılık',type:'Daire',status:'pasif',il:'İstanbul',ilce:'',mah:'',m2:0,oda:'',kat:'',price:0,feat:0,desc:'',img:INS_LIST_IMGS[(function(id){var h=0;for(var i=0;i<id.length;i++)h=(h*31+id.charCodeAt(i))>>>0;return h%INS_LIST_IMGS.length;})('il'+Date.now())],eids:(window.EIDS?EIDS.newRecord({il:'İstanbul',malikTip:'malik'}):null)});
  renderInsIlan();saveAll();
}
function insIlanDel(i){if(!confirm('Bu ilanı silmek istediğinize emin misiniz?'))return;ILANLAR.splice(i,1);renderInsIlan();renderInsIlanPublic();saveAll();}
function insIlanTogglePub(i){
  var it=ILANLAR[i];if(!it)return;
  if(it.status==='aktif'){it.status='pasif';}
  else{
    var verified=window.EIDS&&EIDS.canPublish(it.eids);
    if(!verified){
      if(!confirm('Bu ilan henüz EİDS doğrulanmadı.\n\nEİDS (Elektronik İlan Doğrulama Sistemi) kapsamında yayın için yetki/taşınmaz doğrulaması gerekir. Canlı EİDS bağlantısı olmadan yayınlanan ilan “Doğrulama Bekliyor” rozetiyle görünür ve resmî anlamda yayınlanmış sayılmaz.\n\nYine de (demo amaçlı) yayınlansın mı?'))
        { renderInsIlan(); return; }
    }
    it.status='aktif';
  }
  renderInsIlan();renderInsIlanPublic();saveAll();
}

/* ---- Admin: TOPLU İÇE AKTARMA (kendi ilanlarınız · scraping YOK) ---- */
function insBulkSample(){
  var t=document.getElementById('insBulk_in');if(!t)return;
  t.value=[
    ['Levent Rezidans 2+1 Yüksek Kat','Satılık','Daire','İstanbul','Beşiktaş','Levent','112','2+1','14','14750000','Metro M2’ye yürüme mesafesi, site içi donatı.'],
    ['Ataşehir Ofis Kiralık','Kiralık','Ofis / İş Yeri','İstanbul','Ataşehir','Barbaros','220','-','6','145000','Finans merkezine yakın, jeneratörlü A-sınıfı.']
  ].map(function(r){return r.join('\t');}).join('\n');
  var o=document.getElementById('insBulk_out');if(o)o.innerHTML='';
}
function insBulkParse(){
  var raw=((document.getElementById('insBulk_in')||{}).value||'').replace(/\r/g,'').trim();
  if(!raw)return {ilan:[],hata:['Boş — Excel/Sheets’ten satır yapıştırın ya da “Örnek Doldur”a basın.']};
  var rows=raw.split('\n'),ilan=[],hata=[];
  for(var i=0;i<rows.length;i++){
    var line=rows[i];if(!line.trim())continue;
    var d=line.indexOf('\t')>=0?'\t':(line.indexOf(';')>=0?';':',');
    var c=line.split(d).map(function(x){return x.trim();});
    if(i===0&&/ba[sş]l[ıi]k/i.test(c[0]||'')&&/fiyat/i.test(line))continue; /* başlık satırı */
    if(!c[0]){hata.push((i+1)+'. satır: başlık boş, atlandı.');continue;}
    var price=parseInt((c[9]||'').replace(/[^\d]/g,''),10)||0;
    if(!price){hata.push((i+1)+'. satır (“'+c[0].slice(0,24)+'”): geçerli fiyat yok, atlandı.');continue;}
    ilan.push({title:c[0],op:/kira/i.test(c[1]||'')?'Kiralık':'Satılık',type:c[2]||'Daire',
      il:c[3]||'İstanbul',ilce:c[4]||'-',mah:c[5]||'-',
      m2:parseInt((c[6]||'').replace(/[^\d]/g,''),10)||0,oda:c[7]||'-',kat:c[8]||'-',price:price,desc:c[10]||''});
  }
  return {ilan:ilan,hata:hata};
}
function insBulkPreview(){
  var r=insBulkParse(),out=document.getElementById('insBulk_out');if(!out)return;
  var h='<div class="ins-csub"><b>'+r.ilan.length+'</b> ilan içe aktarılmaya hazır.'+(r.hata.length?(' <b style="color:#c0392b">'+r.hata.length+' satır atlandı.</b>'):'')+'</div>';
  if(r.ilan.length){
    h+='<table class="adm-tbl" style="margin-top:8px"><thead><tr><th>Başlık</th><th>İşlem</th><th>Lokasyon</th><th>Fiyat</th></tr></thead><tbody>';
    r.ilan.slice(0,8).forEach(function(x){h+='<tr><td>'+_ie(x.title)+'</td><td>'+_ie(x.op)+'</td><td>'+_ie(x.ilce)+' · '+_ie(x.mah)+'</td><td>'+_ifmt(x.price)+' ₺</td></tr>';});
    h+='</tbody></table>';if(r.ilan.length>8)h+='<div class="ins-csub">…ve '+(r.ilan.length-8)+' ilan daha.</div>';
  }
  if(r.hata.length)h+='<div class="ins-csub" style="color:#c0392b;margin-top:6px">'+r.hata.map(_ie).join('<br>')+'</div>';
  out.innerHTML=h;
}
function insBulkImport(){
  var r=insBulkParse();
  if(!r.ilan.length){insBulkPreview();toast('İçe aktarılacak geçerli ilan yok.');return;}
  var now=Date.now();
  r.ilan.forEach(function(x,idx){
    /* İçe aktarılan ilan DOĞRULANMAMIŞ gelir: taslak + EİDS 'beklemede'. Yayın için Taşınmaz No girip doğrulanır. */
    var obj={id:now+idx,title:x.title,price:x.price,op:x.op,type:x.type,status:'pasif',il:x.il,ilce:x.ilce,mah:x.mah,
      m2:x.m2,oda:x.oda,kat:x.kat,feat:0,desc:x.desc,img:INS_LIST_IMGS[idx%INS_LIST_IMGS.length],
      eids:(window.EIDS?EIDS.newRecord({il:x.il,ilce:x.ilce,malikTip:'malik'}):null)};
    ILANLAR.unshift(obj);
  });
  saveAll();renderInsIlan();renderInsIlanPublic();renderKpi();
  toast('✓ '+r.ilan.length+' ilan taslak olarak içe aktarıldı — her biri için Taşınmaz No/Ada/Parsel girip “EİDS Doğrula” sonrası yayınlayın.');
  insBulkPreview();
}

/* ---- Admin: ÖZEL PORTFÖY (ProX üretimi · EİDS YOK) ---- */
function renderInsOzel(){
  var el=document.getElementById('insOzelList');if(!el)return;
  if(!OZEL.length){el.innerHTML='<div style="color:var(--muted);font-size:.875rem;padding:14px 4px">Henüz kapalı portföy kaydı yok. “⚡ ProX ile Portföy Üret”e basın.</div>';return;}
  el.innerHTML='<table class="adm-tbl"><thead><tr><th>İlan</th><th>Konum</th><th>Alan</th><th>ProX Tahmini</th><th>Kaynak</th><th></th></tr></thead><tbody>'
    +OZEL.map(function(o,i){return '<tr>'
      +'<td><b>'+_ie(o.op)+'</b> · '+_ie(o.tip)+'</td>'
      +'<td>'+_ie(o.mah)+', '+_ie(o.ilce)+'<div style="color:var(--muted);font-size:.6875rem">'+_ie(o.cadde||'')+'</div></td>'
      +'<td>'+(+o.m2||0)+' m²'+(o.oda&&o.oda!=='-'?(' · '+_ie(o.oda)):'')+'</td>'
      +'<td class="num">'+_ifmt(o.fiyat)+' ₺'+(o.op==='Kiralık'?'/ay':'')+'</td>'
      +'<td>'+(o._gen?'<span style="color:#16a34a;font-size:.6875rem">⚡ ProX üretimi</span>':'<span style="color:var(--muted);font-size:.6875rem">elle</span>')+'</td>'
      +'<td class="ta"><button class="lk" style="color:#d4416a" onclick="insOzelDel('+i+')">sil</button></td>'
    +'</tr>';}).join('')+'</tbody></table>';
}
function insOzelDel(i){OZEL.splice(i,1);renderInsOzel();renderInsOzelPublic();saveAll();}
/* ProX endeks m² — canlı API'yi kısa timeout ile dener; yavaş/erişilemezse yerel demo endekse düşer (hang YOK) */
function _insProxM2(il,ilce,mah,demo){
  if(typeof proxApi!=='function')return Promise.resolve({m2:demo,canli:false});
  var live=proxApi('/api/v1/tenant/endeks?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce)+'&mahalle='+encodeURIComponent(mah||'')+'&kategori=konut&durum=satilik')
    .then(function(r){return (r&&r.success===true&&!r.fallback&&r.data&&+r.data.m2>0)?{m2:+r.data.m2,canli:true}:{m2:demo,canli:false};})
    .catch(function(){return {m2:demo,canli:false};});
  var to=new Promise(function(res){setTimeout(function(){res({m2:demo,canli:false});},3500);});
  return Promise.race([live,to]);
}
/* GERÇEK mahalle — ProX granular locations ucu (canlı doğrulandı; kısa timeout, yoksa null → bölge etiketi) */
function _insMahalle(il,ilce){
  if(typeof proxApi!=='function'||!il||!ilce)return Promise.resolve(null);
  var live=proxApi('/api/v1/tenant/locations/mahalleler?il='+encodeURIComponent(il)+'&ilce='+encodeURIComponent(ilce))
    .then(function(rm){return (rm&&rm.success===true&&!rm.fallback&&Array.isArray(rm.data)&&rm.data.length)?(''+rm.data[0]).replace(/\s+(Mah\.?|Mahallesi|Köyü)$/i,'').trim():null;})
    .catch(function(){return null;});
  var to=new Promise(function(res){setTimeout(function(){res(null);},3500);});
  return Promise.race([live,to]);
}
async function insOzelGen(){
  var btn=document.getElementById('insOzGenBtn');if(btn){btn.disabled=true;btn.textContent='⏳ ProX üretiyor…';}
  try{
    var regs=(typeof BOLGELER!=='undefined'&&BOLGELER.length)?BOLGELER:[];
    var cads=['Çarşı Caddesi civarı','Sahil Yolu','İnönü Caddesi','Cumhuriyet Caddesi','İmarlı parsel bölgesi'];
    /* tüm bölgeler için endeks m²'yi PARALEL çek (her biri kendi 3.5sn timeout'u ile) → toplam ~3.5sn tavan */
    var m2list=await Promise.all(regs.map(function(b){
      var il=((b.ilce||'').split('/')[1]||'İstanbul').trim();
      var ilce=((b.ilce||'').split('/')[0]||b.ad||'').trim();
      /* m² endeks + GERÇEK mahalle PARALEL — her biri kendi 3.5sn timeout'u */
      return Promise.all([_insProxM2(il,ilce,b.ad,+b.m2n||90000),_insMahalle(il,ilce)]).then(function(p){return {m2:p[0].m2,canli:p[0].canli,mah:p[1]};});
    }));
    var out=[],id=1,gercek=0;
    for(var ri=0;ri<regs.length;ri++){
      var b=regs[ri];
      var il=((b.ilce||'').split('/')[1]||'İstanbul').trim();
      var ilce=((b.ilce||'').split('/')[0]||b.ad||'').trim();
      var m2sat=m2list[ri].m2, canli=m2list[ri].canli, rmah=m2list[ri].mah;if(canli)gercek++;
      var mahAd=rmah||b.ad||ilce;/* GERÇEK ProX mahallesi (yoksa bölge etiketi) */
      var km2=120,kf=Math.round(m2sat*km2/1000)*1000,ko=Math.round(kf*1.15/1000)*1000;
      out.push({id:'og'+(id++),op:'Satılık',tip:'Daire',il:il,ilce:ilce,mah:mahAd,cadde:cads[ri%cads.length],m2:km2,oda:'3+1',fiyat:kf,ort:ko,durum:'aktif',
        not:'ProX '+ilce+(rmah?(' · '+rmah+' Mah.'):'')+' bölge tahmini · '+_ifmt(m2sat)+' ₺/m²'+(canli?' (canlı endeks)':'')+' · bölge ort. '+_ifmt(ko)+' ₺ · kapalı portföy',_gen:true});
      if(ri<2){var aM2=500,am2=Math.round(m2sat*0.4),af=Math.round(am2*aM2/1000)*1000;
        out.push({id:'og'+(id++),op:'Satılık',tip:'Arsa',il:il,ilce:ilce,mah:b.ad||'Merkez',cadde:'İmarlı parsel bölgesi',m2:aM2,oda:'-',fiyat:af,ort:Math.round(af*1.12/1000)*1000,durum:'aktif',
          not:'ProX '+(b.ad||ilce)+' arsa tahmini · ~'+_ifmt(am2)+' ₺/m² · kapalı portföy',_gen:true});}
    }
    var manual=OZEL.filter(function(x){return x&&!x._gen;});
    OZEL.length=0;manual.concat(out).forEach(function(x){OZEL.push(x);});
    saveAll();renderInsOzel();renderInsOzelPublic();
    toast('✓ Özel Portföy: '+out.length+' ProX kaydı üretildi'+(gercek?(' · '+gercek+' canlı endeks'):' (yerel demo endeks)')+(manual.length?(' · '+manual.length+' elle kayıt korundu'):'')+'.');
  }catch(e){toast('Özel Portföy üretilemedi.');}
  if(btn){btn.disabled=false;btn.textContent='⚡ ProX ile Portföy Üret';}
}

/* ---- KAMU: İlan grid + Özel Portföy şeridi (overlay: #ilanlarPage) ---- */
var _insIlanFilter={op:'',ty:''};
function insIlanFilterSet(k,v,btn){_insIlanFilter[k]=(_insIlanFilter[k]===v?'':v);
  var box=btn&&btn.parentNode;if(box)box.querySelectorAll('button').forEach(function(b){b.classList.remove('active');});
  if(btn&&_insIlanFilter[k])btn.classList.add('active');renderInsIlanPublic();}
/* ===== İLAN: EİDS yayın kapısı + kapsamlı detay (shared/listing.js) ===== */
function _insDemoKayit(){try{if(window.EIDS&&EIDS.demoRecord)return EIDS.demoRecord();}catch(e){}return {status:'demo',listing_kind:'demo_private_portfolio',referans:'',tarih:'',mesaj:'Demo tanıtım kaydı — EİDS doğrulaması yapılmaz, gerçek Bakanlık kodu üretilmez.'};}
function _insBeklemeKayit(){return {status:'beklemede',mesaj:'EİDS doğrulama bekliyor — bu ilan yayınlanmaz.'};}
function _insGal(r){var b=(parseInt((''+(r.img||'')).replace(/\D/g,''),10)||1);var g=[];for(var k=0;k<3;k++){g.push('img/img'+(((b+k*3)%14)+1)+'.jpg');}return g;}
function insIlanView(){
  var arr=(typeof ILANLAR!=='undefined'?ILANLAR:[]).filter(function(i){return i&&i.status==='aktif';}).map(function(i){
    var e=(window.EMLAK_DEMO!==false)?((i.eids&&(i.eids.status==='dogrulandi'||i.eids.status==='reddedildi'))?i.eids:_insDemoKayit()):(i.eids||_insBeklemeKayit());
    return Object.assign({},i,{eids:e});
  });
  if(window.EMLAK_DEMO!==false&&arr.length>6){for(var k=arr.length-1;k>=0;k--){if(arr[k].eids.status==='dogrulandi'||arr[k].eids.status==='demo'){arr[k]=Object.assign({},arr[k],{eids:_insBeklemeKayit()});break;}}}
  return arr;
}
function insPublicIlan(){var v=insIlanView();return (window.Listings&&Listings.publicList)?Listings.publicList(v):v.filter(function(i){return i.eids&&i.eids.status==='dogrulandi'||(window.EMLAK_DEMO!==false&&i.eids.status==='demo');});}
function insListNormalize(r){ if(!r)return null;
  return {id:r.id,title:r.title,op:r.op,type:r.type,
    priceText:(_ifmt(r.price)+' ₺'+(r.op==='Kiralık'?' /ay':'')), images:((window.Listings&&Listings.catImages)?Listings.catImages(r,4):[imgFor(r.img)].concat(_insGal(r))),
    il:r.il,ilce:r.ilce,mah:r.mah,
    specs:[{k:'Brüt m²',v:((r.m2||(r.attrs&&r.attrs.m2))?((r.m2||r.attrs.m2)+' m²'):'')},{k:'Oda',v:(r.oda&&r.oda!=='-'?r.oda:(r.attrs&&r.attrs.oda))},{k:'Kat',v:r.kat||(r.attrs&&r.attrs.kat)},{k:'Tür',v:r.type}],
    features:r.features||[], attrs:r.attrs, desc:r.desc, eids:r.eids,
    videoUrl:r.videoUrl, tour360Url:r.tour360Url, floorplanUrl:r.floorplanUrl, media:r.media, energy:r.energy, ilanNo:r.ilanNo, tarih:r.tarih };
}
var INS_LIST_CFG={ns:'ins',
  brand:function(){try{return _csInsBrand();}catch(e){return 'Meridyen Yapı';}},
  phone:function(){try{return (typeof SETTINGS!=='undefined'&&(SETTINGS.firmaTel||SETTINGS.tel))||'+90 212 000 00 00';}catch(e){return '+90 212 000 00 00';}},
  whatsapp:function(){try{return (typeof SETTINGS!=='undefined'&&(SETTINGS.whatsapp||SETTINGS.wa))||'905001234567';}catch(e){return '905001234567';}},
  agent:function(){try{return {name:'Mimar Kaan Demir',photo:(typeof imgFor==='function'?imgFor('p_office'):''),title:(_csInsBrand()+' · Satış & Proje Danışmanı'),experience:15};}catch(e){return {name:'Kaan Demir',title:'Satış Danışmanı',experience:15};}},
  navHTML:function(){try{var el=document.querySelector('header')||document.querySelector('.insaatNav');return el?el.outerHTML:'';}catch(e){return '';}},
  footerHTML:function(){try{var el=document.querySelector('footer.insaatFooter, .insaatFooter, footer');return el?el.outerHTML:'';}catch(e){return '';}},
  onContact:function(){try{if(window.Listings)Listings.closeDetail();}catch(e){}try{openTeklif();}catch(e){}},
  mapQuery:function(l){return [l.mah,l.ilce,l.il].filter(Boolean).join(', ');},
  list:function(){return insIlanView().map(insListNormalize);}
};
try{if(window.Listings)Listings.register('ins',INS_LIST_CFG);}catch(e){}
function insListingDetail(id){var raw=insIlanView().filter(function(x){return String(x.id)===String(id);})[0];if(raw&&window.Listings)Listings.openDetail(insListNormalize(raw),INS_LIST_CFG);}
try{window.insListingDetail=insListingDetail;}catch(e){}
/* ANA SAYFA 6 ilan (diğer sitelerle aynı kart tasarımı) */
function renderInsHomeIlan(){try{var g=document.getElementById('insHomeIlan');if(!g||!window.Listings||!Listings.cardHTML)return;var arr=insPublicIlan();g.className='lst-grid home3';g.innerHTML=arr.slice(0,6).map(function(it){return Listings.cardHTML(insListNormalize(it),INS_LIST_CFG);}).join('')||'<div class="pp-empty">Yayında EİDS onaylı ilan yok.</div>';}catch(e){}}
try{window.renderInsHomeIlan=renderInsHomeIlan;}catch(e){}
/* AI destekli ilan açıklaması (admin) — İçerik Ajanı (INS_CONTENT) + shared/listing.js */
async function insIlanAiDesc(i){var it=(typeof ILANLAR!=='undefined')&&ILANLAR[i];if(!it)return;var ta=document.getElementById('ins_desc_'+i);
  if(!it.title){try{toast('Önce başlık girin.');}catch(e){}return;}
  var aiFn=(window.INS_CONTENT)?function(b){return INS_CONTENT.ai(b,{max_tokens:600,timeout:60000});}:null;
  if(!aiFn||!window.Listings||!Listings.aiDescribe){try{toast('YZ motoru hazır değil.');}catch(e){}return;}
  var fields={title:it.title,op:it.op,type:it.type,il:it.il,ilce:it.ilce,mah:it.mah,m2:it.m2,oda:it.oda,kat:it.kat};
  var old=it.desc||'';if(ta)ta.value='🤖 İçerik Ajanı açıklama yazıyor…';
  try{var t=await Listings.aiDescribe(fields,aiFn);if(t){it.desc=t;if(ta)ta.value=t;try{saveAll();}catch(e){}try{toast('✓ AI açıklama üretildi.');}catch(e){}}else{if(ta)ta.value=old;try{toast('Üretilemedi — İçerik Ajanı anahtarını kontrol edin (🔌 ProX API & Yapay Zekâ).');}catch(e){}}}
  catch(e){if(ta)ta.value=old;}}
try{window.insIlanAiDesc=insIlanAiDesc;}catch(e){}
async function insIlanAiTitle(i){var it=(typeof ILANLAR!=='undefined')&&ILANLAR[i];if(!it)return;var inp=document.getElementById('ins_title_'+i);
  var aiFn=(window.INS_CONTENT)?function(b){return INS_CONTENT.ai(b,{max_tokens:60,timeout:45000});}:null;
  if(!aiFn||!window.Listings||!Listings.aiTitle){try{toast('YZ motoru hazır değil.');}catch(e){}return;}
  var fields={op:it.op,type:it.type,oda:it.oda,m2:it.m2,il:it.il,ilce:it.ilce,mah:it.mah};
  var old=it.title||'';if(inp)inp.value='🤖 AI başlık yazıyor…';
  try{var t=await Listings.aiTitle(fields,aiFn);if(t){it.title=t;if(inp)inp.value=t;try{saveAll();}catch(e){}try{toast('✓ AI başlık üretildi.');}catch(e){}}else{if(inp)inp.value=old;try{toast('Üretilemedi.');}catch(e){}}}catch(e){if(inp)inp.value=old;}}
try{window.insIlanAiTitle=insIlanAiTitle;}catch(e){}
/* Kategori özellik formu (admin ilan satırı) */
function insRenderAttr(i){try{var it=ILANLAR[i];var box=document.getElementById('ins_attr_'+i);if(box&&window.Listings)box.innerHTML=Listings.attrFormHTML(Listings.catOf(it),it.attrs||{},it.features||[]);}catch(e){}}
function insCollectAttrs(i){try{var box=document.getElementById('ins_attr_'+i);if(!box||!window.Listings)return;var af=Listings.readAttrForm(box);if(ILANLAR[i]){ILANLAR[i].attrs=af.attrs;ILANLAR[i].features=af.features;try{saveAll();}catch(e){}}}catch(e){}}
function insCollectMedia(i){try{if(!window.Listings||!Listings.readMediaForm||!ILANLAR[i])return;var box=document.getElementById('ins_media_'+i);if(!box)return;Listings.readMediaForm(ILANLAR[i].id,ILANLAR[i],box);try{saveAll();}catch(e){}}catch(e){}}
try{window.insRenderAttr=insRenderAttr;window.insCollectAttrs=insCollectAttrs;window.insCollectMedia=insCollectMedia;}catch(e){}
/* İl → İlçe cascade (admin ilan satırı) */
function insIlChange(i,il){try{var s=document.getElementById('ins_ilce_'+i);if(s&&window.Listings){s.innerHTML=Listings.ilceOptions(il,'');if(ILANLAR[i]){ILANLAR[i].ilce='';try{saveAll();}catch(e){}}}}catch(e){}}
try{window.insIlChange=insIlChange;}catch(e){}
function renderInsIlanPublic(){
  var g=document.getElementById('insIlanGrid');if(!g)return;
  var arr=(typeof insPublicIlan==='function')?insPublicIlan():ILANLAR.filter(function(i){return i.status==='aktif';});/* EİDS yayın kapısı */
  if(_insIlanFilter.op)arr=arr.filter(function(i){return i.op===_insIlanFilter.op;});
  if(_insIlanFilter.ty)arr=arr.filter(function(i){return i.type===_insIlanFilter.ty;});
  arr.sort(function(a,b){return (b.feat||0)-(a.feat||0);});
  var cnt=document.getElementById('insIlanCount');if(cnt)cnt.textContent=arr.length+' ilan listeleniyor';
  if(!arr.length){g.innerHTML='<div class="pp-empty">Bu kritere uygun yayında ilan yok.</div>';return;}
  if(window.Listings&&Listings.cardHTML&&typeof insListNormalize==='function'){g.className='lst-grid home3';g.innerHTML=arr.slice(0,6).map(function(it){return Listings.cardHTML(insListNormalize(it),INS_LIST_CFG);}).join('');return;}
  g.innerHTML=arr.map(function(it){
    var src=imgFor(it.img);
    return '<div class="ppcard ins-ilancard" style="cursor:pointer" onclick="insListingDetail(\''+_ie(it.id)+'\')">'
      +'<div class="img">'+(src?'<img src="'+src+'" alt="'+_ie(it.title)+'" loading="lazy" decoding="async">':'')
        +'<span class="st '+(it.op==='Kiralık'?'plan':'devam')+'">'+_ie(it.op)+'</span>'
        +(window.EIDS?'<span class="ins-eids-pub">'+EIDS.badgeHTML(it.eids,12)+'</span>':'')
        +(it.feat?'<span class="ins-feat-tag">★ Öne çıkan</span>':'')
      +'</div>'
      +'<div class="body">'
        +'<div class="loc">📍 '+_ie([it.mah,it.ilce,it.il].filter(Boolean).join(', '))+'</div>'
        +'<h3>'+_ie(it.title)+'</h3>'
        +'<div class="desc">'+_ie((it.desc||'').slice(0,110))+((it.desc||'').length>110?'…':'')+'</div>'
        +'<div class="meta">'
          +'<div class="m"><b>'+(+it.m2||'-')+(it.m2?' m²':'')+'</b><span>Alan</span></div>'
          +'<div class="m"><b>'+_ie(it.oda&&it.oda!=='-'?it.oda:it.type)+'</b><span>'+(it.oda&&it.oda!=='-'?'Oda':'Tip')+'</span></div>'
          +'<div class="m"><b>'+_ie(it.kat||'-')+'</b><span>Kat</span></div>'
          +'<div class="m"><b>'+_ie(it.type)+'</b><span>Tür</span></div>'
        +'</div>'
        +'<div class="foot">'
          +'<span class="price">'+_ifmt(it.price)+' ₺'+(it.op==='Kiralık'?'<small>/ay</small>':'')+'</span>'
          +'<button class="btn btn-primary" style="padding:8px 14px;font-size:.8125rem" onclick="event.stopPropagation();insListingDetail(\''+_ie(it.id)+'\')">İncele →</button>'
        +'</div>'
      +'</div>'
    +'</div>';
  }).join('');
}
function renderInsOzelPublic(){
  var g=document.getElementById('insOzelGrid');if(!g)return;
  var arr=OZEL.filter(function(o){return o.durum==='aktif';});
  if(!arr.length){g.innerHTML='<div class="pp-empty">Kapalı portföy kaydı yok.</div>';return;}
  g.innerHTML=arr.slice(0,9).map(function(o){
    return '<div class="ins-ozcard">'
      +'<div class="ins-oz-top"><span class="atag '+(o.op==='Kiralık'?'kir':'sat')+'">'+_ie(o.op)+'</span> '+_ie(o.tip)+'<span class="ins-oz-off">🔒 kapalı portföy</span></div>'
      +'<div class="ins-oz-loc">📍 '+_ie(o.mah)+', '+_ie(o.ilce)+' · '+_ie(o.cadde||'')+'</div>'
      +'<div class="ins-oz-spec">'+(+o.m2||0)+' m²'+(o.oda&&o.oda!=='-'?(' · '+_ie(o.oda)):'')+'</div>'
      +'<div class="ins-oz-price">'+_ifmt(o.fiyat)+' ₺'+(o.op==='Kiralık'?'<small>/ay</small>':'')+'<span class="ins-oz-ort">bölge ort. '+_ifmt(o.ort)+' ₺</span></div>'
      +'<div class="ins-oz-note">'+_ie(o.not||'')+'</div>'
    +'</div>';
  }).join('');
}
function openIlanlarPage(){
  var ov=document.getElementById('ilanlarPage');if(!ov)return;
  renderInsIlanPublic();renderInsOzelPublic();
  ov.classList.add('on');try{_insSyncUrl('ilanlar');}catch(e){}document.body.style.overflow='hidden';ov.scrollTop=0;
}
function closeIlanlarPage(){_insOvKapat('ilanlarPage');document.body.style.overflow='';}

/*__ADMIN_BLOK__*/ /* Bu bölge üretim paketinde admin-assets/ altına ayrılır (public bundle inmez) */
// ============ SÖZLEŞMELER (şablon + önizleme + yazdır + WhatsApp) ============
const CT_LABEL={insaat:'Anahtar Teslim İnşaat',['kat-karsiligi']:'Kat Karşılığı',taseron:'Taşeron'};
const CT_DURUM={aktif:'Aktif',tamamlandi:'Tamamlandı',iptal:'İptal',taslak:'Taslak'};
function fillTemplate(c){
  let t=(SOZLESME_SABLONLARI[c.tip]||{}).madde||'';
  if(c.ozelMetin&&c.ozelMetin.trim())t=c.ozelMetin; // kullanıcı özelleştirmişse onu kullan
  const map={
    '{{FIRMA_UNVAN}}':SETTINGS.firmaUnvan||'',
    '{{FIRMA_VERGI}}':SETTINGS.firmaVergiNo||'',
    '{{FIRMA_ADRES}}':SETTINGS.firmaAdres||'',
    '{{FIRMA_YETKILI}}':SETTINGS.firmaYetkili||'',
    '{{KARSI_TARAF}}':c.karsiTaraf||'..................',
    '{{KARSI_TC}}':c.karsiKimlik||'..................',
    '{{KARSI_ADRES}}':c.karsiAdres||'..................',
    '{{ARSA_IL}}':c.il||'......','{{ARSA_ILCE}}':c.ilce||'......','{{ARSA_MAHALLE}}':c.mahalle||'......',
    '{{ADA}}':c.ada||'....','{{PARSEL}}':c.parsel||'....','{{ARSA_M2}}':c.arsaM2||'....',
    '{{PAY_ARSA}}':c.payArsa||'..','{{PAY_MUTEAHHIT}}':c.payMuteahhit||'..',
    '{{SURE_AY}}':c.sureAy||'..','{{GECIKME_TL}}':c.gecikmeTL||'..........',
    '{{TARIH}}':c.tarih||'../../....'
  };
  Object.keys(map).forEach(k=>{t=t.split(k).join(map[k]);});
  return t;
}
function renderContracts(){
  const el=document.getElementById('contractList');if(!el)return;
  el.innerHTML=CONTRACTS.map((c,i)=>`<div class="ct-card">
    <div class="ct-head">
      <span class="ct-badge ct-${c.tip}">${CT_LABEL[c.tip]||c.tip}</span>
      <span class="ct-status ct-st-${c.durum}">${CT_DURUM[c.durum]||c.durum}</span>
      <b style="margin-left:6px">${c.baslik||''}</b>
      <button class="lk" style="color:#d4416a;margin-left:auto" onclick="if(confirm('Sözleşme silinsin mi?')){CONTRACTS.splice(${i},1);renderContracts();saveAll()}">sil</button>
    </div>
    <div class="ct-actions">
      <button class="btn-mini" onclick="document.getElementById('ctEd${i}').classList.toggle('open')">✏️ Düzenle</button>
      <button class="btn-mini" onclick="previewContract(${i})">👁️ Önizle & Yazdır</button>
      <button class="btn-mini" onclick="contractWhatsApp(${i})">📱 WhatsApp Gönder</button>
    </div>
    <div class="ct-ed" id="ctEd${i}">
      <div class="ed2">
        <div><label>Sözleşme Başlığı</label><input value="${(c.baslik||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].baslik=this.value;saveAll()"></div>
        <div><label>Sözleşme Tipi</label><select onchange="CONTRACTS[${i}].tip=this.value;renderContracts();saveAll()">${Object.keys(CT_LABEL).map(k=>`<option value="${k}"${c.tip===k?' selected':''}>${CT_LABEL[k]}</option>`).join('')}</select></div>
      </div>
      <div class="ed2">
        <div><label>Karşı Taraf (Arsa Sahibi/İş Sahibi)</label><input value="${(c.karsiTaraf||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].karsiTaraf=this.value;saveAll()"></div>
        <div><label>T.C. / Vergi No</label><input value="${(c.karsiKimlik||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].karsiKimlik=this.value;saveAll()"></div>
      </div>
      <label>Karşı Taraf Adresi</label><input value="${(c.karsiAdres||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].karsiAdres=this.value;saveAll()" style="width:100%">
      <div class="ed3">
        <div><label>İl</label><input value="${(c.il||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].il=this.value;saveAll()"></div>
        <div><label>İlçe</label><input value="${(c.ilce||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].ilce=this.value;saveAll()"></div>
        <div><label>Mahalle</label><input value="${(c.mahalle||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].mahalle=this.value;saveAll()"></div>
      </div>
      <div class="ed3">
        <div><label>Ada</label><input value="${(c.ada||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].ada=this.value;saveAll()"></div>
        <div><label>Parsel</label><input value="${(c.parsel||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].parsel=this.value;saveAll()"></div>
        <div><label>Arsa m²</label><input type="number" value="${c.arsaM2||''}" oninput="CONTRACTS[${i}].arsaM2=this.value;saveAll()"></div>
      </div>
      <div class="ed3">
        <div><label>Pay Arsa %</label><input type="number" value="${c.payArsa||''}" oninput="CONTRACTS[${i}].payArsa=this.value;saveAll()"></div>
        <div><label>Pay Müteahhit %</label><input type="number" value="${c.payMuteahhit||''}" oninput="CONTRACTS[${i}].payMuteahhit=this.value;saveAll()"></div>
        <div><label>Süre (ay)</label><input type="number" value="${c.sureAy||''}" oninput="CONTRACTS[${i}].sureAy=this.value;saveAll()"></div>
      </div>
      <div class="ed2">
        <div><label>Gecikme Tazminatı (TL/ay)</label><input value="${(c.gecikmeTL||'').replace(/"/g,'&quot;')}" oninput="CONTRACTS[${i}].gecikmeTL=this.value;saveAll()"></div>
        <div><label>Sözleşme Tarihi</label><input type="date" value="${c.tarih||''}" oninput="CONTRACTS[${i}].tarih=this.value;saveAll()"></div>
      </div>
      <div class="ed2">
        <div><label>Durum</label><select onchange="CONTRACTS[${i}].durum=this.value;renderContracts();saveAll()">${Object.keys(CT_DURUM).map(k=>`<option value="${k}"${c.durum===k?' selected':''}>${CT_DURUM[k]}</option>`).join('')}</select></div>
      </div>
      <label>Özel Sözleşme Metni (boş bırakırsanız hazır şablon kullanılır; düzenlerseniz kendi metniniz geçerli olur)</label>
      <textarea class="adm-ta" rows="4" placeholder="Hazır şablonu özelleştirmek için buraya yapıştırın..." oninput="CONTRACTS[${i}].ozelMetin=this.value;saveAll()">${c.ozelMetin||''}</textarea>
      <button class="btn-mini" style="margin-top:8px" onclick="loadTemplateInto(${i})">📋 Hazır Şablonu Metne Yükle (düzenlemek için)</button>
    </div>
  </div>`).join('');
}
function loadTemplateInto(i){
  const c=CONTRACTS[i];
  c.ozelMetin=fillTemplate({...c,ozelMetin:''});
  renderContracts();saveAll();
  document.getElementById('ctEd'+i).classList.add('open');
}
function buildContractHTML(c){
  const body=fillTemplate(c).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const logo=SETTINGS.firmaUnvan||'Meridyen Yapı';
  return `<div class="ct-doc">
    <div class="ct-doc-head">
      <div class="ct-logo">${(logo[0]||'M')}</div>
      <div><div class="ct-firma">${logo}</div>
        <div class="ct-firma-sub">${SETTINGS.firmaAdres||''} · ${SETTINGS.firmaTel||''} · Vergi No: ${SETTINGS.firmaVergiNo||''}</div></div>
    </div>
    <pre class="ct-body">${body}</pre>
    <div class="ct-doc-foot">${logo} · ${SETTINGS.firmaEmail||''} · Bu belge ${new Date().toLocaleDateString('tr-TR')} tarihinde oluşturulmuştur.</div>
  </div>`;
}
function previewContract(i){
  const c=CONTRACTS[i];
  let modal=document.getElementById('ctModal');
  if(!modal){modal=document.createElement('div');modal.id='ctModal';modal.className='ct-modal';document.body.appendChild(modal);}
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
  const w=window.open('','_blank');
  w.document.write(`<html><head><title>Sözleşme</title><style>
    body{font-family:'Times New Roman',serif;padding:40px;color:#111;line-height:1.6}
    .ct-doc-head{display:flex;gap:14px;align-items:center;border-bottom:2px solid #333;padding-bottom:14px;margin-bottom:20px}
    .ct-logo{width:48px;height:48px;border-radius:8px;background:#ff7a2f;color:#fff;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.375rem;font-family:sans-serif}
    .ct-firma{font-weight:700;font-size:1.125rem}.ct-firma-sub{font-size:.6875rem;color:#555;margin-top:3px}
    .ct-body{white-space:pre-wrap;font-family:'Times New Roman',serif;font-size:.8125rem;line-height:1.7}
    .ct-doc-foot{margin-top:24px;border-top:1px solid #ccc;padding-top:10px;font-size:.625rem;color:#777;text-align:center}
  </style></head><body>${area.innerHTML}


</body></html>`);
  w.document.close();setTimeout(()=>{w.print();},300);
}
function contractWhatsApp(i){
  const c=CONTRACTS[i];
  const txt=`*${SETTINGS.firmaUnvan||'Meridyen Yapı'}*\n${CT_LABEL[c.tip]||''} – ${c.baslik}\n\n`+fillTemplate(c).slice(0,1200)+'\n\n...(tam metin ektedir)';
  const url='https://wa.me/?text='+encodeURIComponent(txt);
  window.open(url,'_blank','noopener,noreferrer');
}
function admAddContract(tip){CONTRACTS.unshift({id:'c'+Date.now(),tip:tip||'insaat',baslik:'Yeni '+( {insaat:'İnşaat',['kat-karsiligi']:'Kat Karşılığı',taseron:'Taşeron'}[tip]||'')+' Sözleşmesi',karsiTaraf:'',karsiKimlik:'',karsiAdres:'',il:'',ilce:'',mahalle:'',ada:'',parsel:'',arsaM2:'',payArsa:50,payMuteahhit:50,sureAy:18,gecikmeTL:'',tarih:new Date().toISOString().slice(0,10),durum:'taslak',ozelMetin:''});renderContracts();saveAll();}

// ============ AYARLAR & GÜVENLİK ============
function saveFirmaInfo(){
  const g=id=>document.getElementById(id);
  SETTINGS.firmaUnvan=g('set_funvan').value;SETTINGS.firmaVergiNo=g('set_fvergi').value;
  SETTINGS.firmaMersis=g('set_fmersis').value;SETTINGS.firmaYetkili=g('set_fyetkili').value;
  SETTINGS.firmaAdres=g('set_fadres').value;SETTINGS.firmaTel=g('set_ftel').value;
  SETTINGS.firmaEmail=g('set_femail').value;saveAll();
}
function loadIletisimUI(){var s=SETTINGS,g=function(id){return document.getElementById(id);};
  if(g('il_mapq'))g('il_mapq').value=s.mapQuery||'';
  if(g('il_adres'))g('il_adres').value=s.firmaAdres||'';if(g('il_tel'))g('il_tel').value=s.firmaTel||'';if(g('il_email'))g('il_email').value=s.firmaEmail||'';if(g('il_wa'))g('il_wa').value=s.waNumber||'';if(g('il_calisma'))g('il_calisma').value=s.firmaCalisma||'';
  if(g('il_unvan'))g('il_unvan').value=s.firmaUnvan||'';if(g('il_yetkili'))g('il_yetkili').value=s.firmaYetkili||'';if(g('il_vd'))g('il_vd').value=s.firmaVergiDairesi||'';if(g('il_vno'))g('il_vno').value=s.firmaVergiNo||'';if(g('il_mersis'))g('il_mersis').value=s.firmaMersis||'';if(g('il_tsicil'))g('il_tsicil').value=s.firmaTicaretSicil||'';if(g('il_oda'))g('il_oda').value=s.firmaOda||'';if(g('il_kep'))g('il_kep').value=s.firmaKep||'';
  setTimeout(function(){try{ilMapPickerInit();}catch(e){}},80);
}
function saveIletisimInfo(){var s=SETTINGS,v=function(id){var e=document.getElementById(id);return e?e.value:'';};
  s.mapQuery=v('il_mapq');s.firmaAdres=v('il_adres');s.firmaTel=v('il_tel');s.firmaEmail=v('il_email');var wa=(v('il_wa')||'').replace(/[^0-9]/g,'');if(wa)s.waNumber=wa;s.firmaCalisma=v('il_calisma');
  s.firmaUnvan=v('il_unvan');s.firmaYetkili=v('il_yetkili');s.firmaVergiDairesi=v('il_vd');s.firmaVergiNo=v('il_vno');s.firmaMersis=v('il_mersis');s.firmaTicaretSicil=v('il_tsicil');s.firmaOda=v('il_oda');s.firmaKep=v('il_kep');
  saveAll();try{if(document.getElementById('iletisimPage').classList.contains('on'))renderIletisimPage();}catch(e){}
  try{if(typeof applyContactAll==='function')applyContactAll();}catch(e){} // ana sayfa haritası + iletişim bilgileri anında senkron
  var el=document.getElementById('saveToast');if(el)el.textContent='🚀 İletişim sayfası & künye güncellendi';
}
// ===== Leaflet tıkla-seç harita (admin konum seçici) — CDN'den tembel yükleme, offline'da metin girişine düşer =====
var _ilLeaflet={map:null,marker:null,loading:false};
function _loadLeaflet(cb){
  if(window.L){cb();return;}
  if(_ilLeaflet.loading){var t=setInterval(function(){if(window.L){clearInterval(t);cb();}},120);setTimeout(function(){clearInterval(t);},9000);return;}
  _ilLeaflet.loading=true;
  var css=document.createElement('link');css.rel='stylesheet';css.href='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css';document.head.appendChild(css);
  var sc=document.createElement('script');sc.src='https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js';
  sc.onload=function(){_ilLeaflet.loading=false;cb();};
  sc.onerror=function(){_ilLeaflet.loading=false;var ph=document.getElementById('il_pickmap_ph');if(ph){ph.style.display='flex';ph.innerHTML='⚠ İnteraktif harita yüklenemedi (çevrimdışı olabilirsiniz). Aşağıya adres ya da "enlem,boylam" yazıp <b>Adresten bul</b> / <b>Google önizle</b> ile devam edebilirsiniz.';}};
  document.head.appendChild(sc);
}
function _parseLatLng(q){var m=String(q||'').match(/^\s*(-?\d{1,2}(?:\.\d+)?)\s*,\s*(-?\d{1,3}(?:\.\d+)?)\s*$/);if(m){var la=parseFloat(m[1]),ln=parseFloat(m[2]);if(la>=-90&&la<=90&&ln>=-180&&ln<=180)return[la,ln];}return null;}
function ilMapPickerInit(){
  var box=document.getElementById('il_pickmap'); if(!box)return;
  _loadLeaflet(function(){
    var L=window.L; if(!L)return;
    var q=document.getElementById('il_mapq'); var ll=_parseLatLng(q&&q.value)||[41.0812,29.0094];
    if(_ilLeaflet.map){ setTimeout(function(){try{_ilLeaflet.map.invalidateSize();_ilLeaflet.map.setView(ll,15);_ilSetMarker(ll[0],ll[1],false);}catch(e){}},60); return; }
    var ph=document.getElementById('il_pickmap_ph'); if(ph)ph.style.display='none';
    var map=L.map(box,{scrollWheelZoom:true,zoomControl:true}).setView(ll,15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap katkıcıları'}).addTo(map);
    _ilLeaflet.map=map;
    map.on('click',function(e){_ilSetMarker(e.latlng.lat,e.latlng.lng,true);});
    _ilSetMarker(ll[0],ll[1],false);
    [140,500,1200].forEach(function(d){setTimeout(function(){try{map.invalidateSize();}catch(e){}},d);});
    // KURŞUN-GEÇİRMEZ: konteyner (pane açılışında) boyut kazanınca haritayı yeniden çiz
    try{ if(window.ResizeObserver){ var ro=new ResizeObserver(function(){ if(box.clientWidth>0&&box.clientHeight>0){ try{map.invalidateSize();}catch(e){} } }); ro.observe(box); } }catch(e){}
  });
}
function _ilSetMarker(lat,lng,doGeocode){
  var L=window.L,map=_ilLeaflet.map; if(!L||!map)return;
  if(_ilLeaflet.marker)_ilLeaflet.marker.setLatLng([lat,lng]);
  else _ilLeaflet.marker=L.marker([lat,lng],{draggable:true}).addTo(map).on('dragend',function(ev){var p=ev.target.getLatLng();_ilSetMarker(p.lat,p.lng,true);});
  var q=document.getElementById('il_mapq'); if(q)q.value=(+lat).toFixed(6)+','+(+lng).toFixed(6);
  var info=document.getElementById('il_pickinfo'); if(info)info.textContent='📍 Seçilen konum: '+(+lat).toFixed(6)+', '+(+lng).toFixed(6)+(doGeocode?' — adres alınıyor…':'');
  if(doGeocode)_ilReverseGeocode(lat,lng);
}
function _ilReverseGeocode(lat,lng){
  var info=document.getElementById('il_pickinfo');
  var esc=(typeof _brandEsc==='function')?_brandEsc:function(x){return String(x==null?'':x);};
  fetch('https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+lat+'&lon='+lng+'&accept-language=tr',{headers:{'Accept':'application/json'}})
    .then(function(r){return r.json();})
    .then(function(d){
      var name=d&&d.display_name?d.display_name:'';
      if(name){var adr=document.getElementById('il_adres'); if(adr)adr.value=name;
        if(info)info.innerHTML='📍 '+(+lat).toFixed(6)+', '+(+lng).toFixed(6)+' — <b>'+esc(name)+'</b> <span style="color:#5fd08a">(adres alanına yazıldı)</span>';}
      else if(info)info.textContent='📍 '+(+lat).toFixed(6)+', '+(+lng).toFixed(6)+' (adres bulunamadı — elle girebilirsiniz)';
    })
    .catch(function(){if(info)info.textContent='📍 '+(+lat).toFixed(6)+', '+(+lng).toFixed(6)+' (adres servisi yanıt vermedi — koordinat kaydedildi)';});
}
function ilMapSearch(){
  var q=document.getElementById('il_mapq'); var val=q?q.value.trim():''; if(!val)return;
  var esc=(typeof _brandEsc==='function')?_brandEsc:function(x){return String(x==null?'':x);};
  var ll=_parseLatLng(val);
  if(ll){ if(_ilLeaflet.map)_ilLeaflet.map.setView(ll,16); _ilSetMarker(ll[0],ll[1],true); return; }
  var info=document.getElementById('il_pickinfo'); if(info)info.textContent='🔎 Adres aranıyor…';
  fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&countrycodes=tr&limit=1&accept-language=tr&q='+encodeURIComponent(val))
    .then(function(r){return r.json();})
    .then(function(a){
      if(a&&a[0]){var la=parseFloat(a[0].lat),ln=parseFloat(a[0].lon);
        if(_ilLeaflet.map)_ilLeaflet.map.setView([la,ln],16);
        _ilSetMarker(la,ln,false);
        var adr=document.getElementById('il_adres'); if(adr&&a[0].display_name)adr.value=a[0].display_name;
        if(info)info.innerHTML='✅ Bulundu: <b>'+esc(a[0].display_name||val)+'</b>';}
      else{ if(info)info.textContent='⚠ Adres bulunamadı — haritaya tıklayarak da seçebilirsiniz.'; }
    })
    .catch(function(){if(info)info.textContent='⚠ Arama servisi yanıt vermedi — haritaya tıklayarak seçebilirsiniz.';});
}
function loadSettingsUI(){
  const g=id=>document.getElementById(id);
  if(g('set_funvan'))g('set_funvan').value=SETTINGS.firmaUnvan||'';
  if(g('set_fvergi'))g('set_fvergi').value=SETTINGS.firmaVergiNo||'';
  if(g('set_fmersis'))g('set_fmersis').value=SETTINGS.firmaMersis||'';
  if(g('set_fyetkili'))g('set_fyetkili').value=SETTINGS.firmaYetkili||'';
  if(g('set_fadres'))g('set_fadres').value=SETTINGS.firmaAdres||'';
  if(g('set_ftel'))g('set_ftel').value=SETTINGS.firmaTel||'';
  if(g('set_femail'))g('set_femail').value=SETTINGS.firmaEmail||'';
  if(g('set_user'))g('set_user').value='admin';
  if(g('set_gmaps'))g('set_gmaps').value=SETTINGS.googleMapsKey||'';
  if(g('set_ga'))g('set_ga').value=SETTINGS.googleAnalytics||'';
  if(g('set_gsv'))g('set_gsv').value=SETTINGS.googleSiteVerif||'';
  if(g('set_recaptcha'))g('set_recaptcha').value=SETTINGS.recaptchaKey||'';
  if(g('set_mtitle'))g('set_mtitle').value=SETTINGS.metaTitle||'';
  if(g('set_mdesc'))g('set_mdesc').value=SETTINGS.metaDesc||'';
  if(g('set_wa'))g('set_wa').value=SETTINGS.waNumber||'';
}
function changePassword(){
  const cur=document.getElementById('set_curpass').value;
  const n1=document.getElementById('set_newpass').value;
  const n2=document.getElementById('set_newpass2').value;
  const msg=document.getElementById('passMsg');
  const user=document.getElementById('set_user').value.trim();
  if(window.EMLAK_DEMO===true){msg.style.color='#d4416a';msg.textContent='Demo modunda şifre değiştirilemez; üretimde /api/auth/admin/password üzerinden yönetilir.';return;}
  fetch('/api/auth/admin/password',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({current:cur,next:n1,user:user})}).then(function(r){
    if(r.ok){msg.style.color='#1a7f4a';msg.textContent='✓ Şifre sunucuda güncellendi.';}
    else{msg.style.color='#d4416a';msg.textContent='✕ Şifre değiştirilemedi (mevcut şifre hatalı olabilir).';}
  }).catch(function(){msg.style.color='#d4416a';msg.textContent='✕ Auth servisi erişilemez.';});
  document.getElementById('set_curpass').value='';document.getElementById('set_newpass').value='';document.getElementById('set_newpass2').value='';
}
function saveGoogleSettings(){
  SETTINGS.googleMapsKey=document.getElementById('set_gmaps').value.trim();
  SETTINGS.googleAnalytics=document.getElementById('set_ga').value.trim();
  SETTINGS.googleSiteVerif=document.getElementById('set_gsv').value.trim();
  SETTINGS.recaptchaKey=document.getElementById('set_recaptcha').value.trim();
  saveAll();
}
function saveSeoSettings(){
  SETTINGS.metaTitle=document.getElementById('set_mtitle').value;
  SETTINGS.metaDesc=document.getElementById('set_mdesc').value;
  SETTINGS.waNumber=document.getElementById('set_wa').value.trim();
  if(SETTINGS.metaTitle)document.title=SETTINGS.metaTitle;
  saveAll();
}

function admAddProject(){PROJECTS.unshift({t:'Yeni Proje',loc:'İstanbul',st:'plan',type:'Konut',area:'0 m²',img:'p_home',price:'İletişime geçin',delivery:'Belirlenecek',units:'',desc:'',progress:0});renderProjects();admPjList();renderKpi();saveAll();const el=document.getElementById('apj0');if(el)el.classList.add('open');}
/* admin services */
function admSvcList(){document.getElementById('admSvcList').innerHTML=SERVICES.map((s,i)=>`
  <div class="pjrow" id="asv${i}"><div class="ph"><b>${s.i} ${s.t}</b><span>
    <button class="lk" style="color:var(--accent)" onclick="document.getElementById('asv${i}').classList.toggle('open')">düzenle</button>
    <button class="lk" style="color:#d4416a" onclick="admDelSvc(${i})">sil</button></span></div>
  <div class="ed"><label>İkon (emoji)</label><input type="text" value="${s.i}" oninput="SERVICES[${i}].i=this.value;renderServices();saveAll()">
    <label>Başlık</label><input type="text" value="${(s.t||'').replace(/"/g,'&quot;')}" oninput="SERVICES[${i}].t=this.value;renderServices();saveAll()">
    <label>Kısa Açıklama</label><textarea oninput="SERVICES[${i}].d=this.value;renderServices();saveAll()">${s.d||''}</textarea>
    ${admSvcDetailEditor(s,i)}</div></div>`).join('');}
function admSvcDetailEditor(s,i){
  s.scope=s.scope||[];s.steps=s.steps||[];
  let h='<div style="margin-top:14px;padding-top:14px;border-top:2px solid var(--accent)"><b style="color:var(--accent);font-size:.8125rem">📋 HİZMET DETAY SAYFASI</b>';
  h+=`<label style="margin-top:12px">Detaylı Açıklama</label><textarea rows="4" oninput="SERVICES[${i}].long=this.value;saveAll()">${s.long||''}</textarea>`;
  // KAPSAM
  h+='<label style="margin-top:12px">Hizmet Kapsamı</label>';
  h+=s.scope.map((x,xi)=>`<div style="display:flex;gap:6px;margin-bottom:5px"><input value="${(x||'').replace(/"/g,'&quot;')}" oninput="SERVICES[${i}].scope[${xi}]=this.value;saveAll()" style="flex:1"><button class="lk" style="color:#d4416a" onclick="SERVICES[${i}].scope.splice(${xi},1);admSvcList();saveAll()">sil</button></div>`).join('');
  h+=`<button class="btn-mini" onclick="SERVICES[${i}].scope.push('');admSvcList();saveAll()">+ Kapsam Ekle</button>`;
  // SÜREÇ
  h+='<label style="margin-top:12px">Süreç Adımları</label>';
  h+=s.steps.map((st,si)=>`<div style="display:flex;gap:6px;margin-bottom:5px"><input value="${(st.t||'').replace(/"/g,'&quot;')}" oninput="SERVICES[${i}].steps[${si}].t=this.value;saveAll()" placeholder="Adım başlığı" style="flex:1"><input value="${(st.d||'').replace(/"/g,'&quot;')}" oninput="SERVICES[${i}].steps[${si}].d=this.value;saveAll()" placeholder="Açıklama" style="flex:1.5"><button class="lk" style="color:#d4416a" onclick="SERVICES[${i}].steps.splice(${si},1);admSvcList();saveAll()">sil</button></div>`).join('');
  h+=`<button class="btn-mini" onclick="SERVICES[${i}].steps.push({t:'Yeni adım',d:''});admSvcList();saveAll()">+ Adım Ekle</button>`;
  h+='</div>';
  return h;
}
function admDelSvc(i){if(confirm('Hizmet silinsin mi?')){SERVICES.splice(i,1);renderServices();admSvcList();renderKpi();}}
function admAddSvc(){SERVICES.unshift({i:'🔧',t:'Yeni Hizmet',d:'Açıklama girin.'});renderServices();admSvcList();renderKpi();document.getElementById('asv0').classList.add('open');}

/* route */
/*__ADMIN_BLOK_SON__*/
/* ==================== İNŞAAT SORU-CEVAP (SEO FAQ) ==================== */
var FAQ_CATS=[
 {k:'ruhsat',l:'Ruhsat & İzinler',i:'📋'},
 {k:'arsa',l:'Arsa & Zemin',i:'🗺️'},
 {k:'maliyet',l:'Maliyet & Keşif',i:'💰'},
 {k:'finans',l:'Finansman & Vergi',i:'🏦'},
 {k:'muteahhit',l:'Müteahhit & Sözleşme',i:'🤝'},
 {k:'katkarsiligi',l:'Kat Karşılığı',i:'🏘️'},
 {k:'kentsel',l:'Kentsel Dönüşüm',i:'🏗️'},
 {k:'proje',l:'Proje & Mimari',i:'📐'},
 {k:'malzeme',l:'Malzeme & Kalite',i:'🧱'},
 {k:'deprem',l:'Deprem & Denetim',i:'🛡️'},
 {k:'tadilat',l:'Tadilat & Renovasyon',i:'🔧'},
 {k:'ozel',l:'Villa · Fabrika · Süreç',i:'🏛️'}
];
function _faqCatLabel(k){for(var i=0;i<FAQ_CATS.length;i++){if(FAQ_CATS[i].k===k)return FAQ_CATS[i].l;}return k;}
function _faqCatIcon(k){for(var i=0;i<FAQ_CATS.length;i++){if(FAQ_CATS[i].k===k)return FAQ_CATS[i].i;}return '•';}
var _faqCat='all', _faqQ='';
function openFaqPage(){renderFaqPage();var ov=document.getElementById('faqPage');ov.classList.add('on');_insSyncUrl('soru-cevap');document.body.style.overflow='hidden';ov.scrollTop=0;if(typeof i18nInit==='function')i18nInit();}
function closeFaqPage(){_insOvKapat('faqPage');document.body.style.overflow='';var h=location.hash||'';if(h==='#sss'||h==='#soru-cevap'||h==='#faq')try{history.replaceState(null,'',location.pathname);}catch(e){}}
function renderFaqPage(){
  var en=(typeof LANG!=='undefined'&&LANG==='en');
  var total=FAQ_DATA.length;
  var wa=((typeof SETTINGS!=='undefined'&&SETTINGS.waNumber)||'905001234567');
  var h='';
  h+='<div class="faq-hero faq-rv"><div class="faq-eyebrow"><i></i> '+(en?'Construction Guide · FAQ':'İnşaat Rehberi · Sık Sorulan Sorular')+'</div>';
  h+='<h2 class="h1x">'+(en?'Everything to know before you start building':'İnşaata başlamadan bilmeniz gereken her şey')+'</h1>';
  h+='<p>'+(en?('Villa, factory, apartment or renovation — '+total+' expert answers on permits, cost, contractors, urban transformation, earthquake safety, materials and handover. Read this before you decide.'):('Villa, fabrika, bina, daire ya da tadilat farketmez: ruhsattan maliyete, müteahhit seçiminden kentsel dönüşüme, deprem güvenliğinden teslim sürecine kadar '+total+' uzman soru-cevap. Doğru kararı vermeden önce bu rehberi okuyun.'))+'</p>';
  h+='<div class="faq-stats"><span><b>'+total+'</b> '+(en?'Q&A':'Soru-Cevap')+'</span><span><b>'+FAQ_CATS.length+'</b> '+(en?'Topics':'Başlık')+'</span><span><b>38</b> '+(en?'Years':'Yıl Tecrübe')+'</span></div></div>';
  h+='<div class="faq-tools faq-rv"><div class="faq-search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg><input id="faqSearchInp" type="search" autocomplete="off" placeholder="'+(en?'Search: villa cost, permit, contract...':'Ara: villa maliyeti, ruhsat, kat karşılığı, deprem...')+'" oninput="faqSearch(this.value)"></div>';
  h+='<div class="faq-chips"><button class="fchip on" data-k="all" onclick="faqSetCat(\'all\',this)">'+(en?'All':'Tümü')+' <b>'+total+'</b></button>';
  FAQ_CATS.forEach(function(c){var n=0;FAQ_DATA.forEach(function(x){if(x.c===c.k)n++;});if(!n)return;h+='<button class="fchip" data-k="'+c.k+'" onclick="faqSetCat(\''+c.k+'\',this)">'+c.i+' '+_brandEsc(c.l)+' <b>'+n+'</b></button>';});
  h+='</div></div>';
  h+='<div class="faq-list" id="faqList">';
  FAQ_DATA.forEach(function(x){
    var t=(String(x.q)+' '+String(x.a).replace(/<[^>]+>/g,' ')).toLowerCase();
    h+='<details class="faq-item" data-c="'+_brandEsc(x.c)+'" data-t="'+_brandEsc(t)+'"><summary><span class="fq-cat">'+_faqCatIcon(x.c)+' '+_brandEsc(_faqCatLabel(x.c))+'</span><span class="fq-q">'+_brandEsc(_brandSubst(x.q))+'</span><span class="fq-x" aria-hidden="true"></span></summary><div class="faq-a">'+_brandSubst(x.a)+'</div></details>';
  });
  h+='</div>';
  h+='<div class="faq-empty" id="faqEmpty" style="display:none">'+(en?'No matching questions.':'Aramanıza uygun soru bulunamadı. Farklı bir kelime deneyin.')+'</div>';
  h+='<div class="faq-cta faq-rv"><div><div class="faq-eyebrow" style="justify-content:flex-start"><i></i> '+(en?'Free Survey':'Ücretsiz Keşif')+'</div><h3>'+(en?'Still have a question about your project?':'Projenizle ilgili sorunuz mu var?')+'</h3><p>'+(en?'Get a free on-site survey and a clear, itemised cost estimate from Meridyen Yapı — no obligation.':'Meridyen Yapı ekibinden ücretsiz keşif ve kalem kalem net maliyet çıkarımı alın. Bağlayıcı değildir.')+'</p></div><div class="faq-cta-btns"><button class="btn btn-primary" onclick="closeFaqPage();openTeklif()">'+(en?'Free Survey & Quote →':'Ücretsiz Keşif & Teklif →')+'</button><a class="btn btn-ghost" href="https://wa.me/'+wa+'" target="_blank" rel="noopener noreferrer">WhatsApp</a></div></div>';
  document.getElementById('faqBody').innerHTML=h;
  _faqCat='all';_faqQ='';
  var root=document.getElementById('faqPage');
  setTimeout(function(){root.querySelectorAll('.faq-rv').forEach(function(el){el.classList.add('in');});},30);
}
function faqSetCat(k,btn){_faqCat=k;document.querySelectorAll('#faqBody .fchip').forEach(function(b){b.classList.remove('on');});if(btn)btn.classList.add('on');faqApplyFilter();var fb=document.getElementById('faqBody');if(fb){var y=fb.querySelector('.faq-list');if(y&&_faqQ==='')y.scrollIntoView({behavior:'smooth',block:'start'});}}
function faqSearch(v){_faqQ=(v||'').trim().toLowerCase();faqApplyFilter();}
function faqApplyFilter(){var items=document.querySelectorAll('#faqList .faq-item');var shown=0;items.forEach(function(el){var okC=(_faqCat==='all'||el.getAttribute('data-c')===_faqCat);var okQ=(!_faqQ||(el.getAttribute('data-t')||'').indexOf(_faqQ)>-1);var ok=okC&&okQ;el.style.display=ok?'':'none';if(ok)shown++;else el.open=false;});var e=document.getElementById('faqEmpty');if(e)e.style.display=shown?'none':'block';}
function applyFaqSeo(){try{
  if(typeof FAQ_DATA==='undefined'||!FAQ_DATA||!FAQ_DATA.length)return;
  var items=FAQ_DATA.slice(0,300).map(function(x){
    var ans=_brandSubst(String(x.a||'')).replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
    return {"@type":"Question","name":_brandSubst(String(x.q||'')),"acceptedAnswer":{"@type":"Answer","text":ans}};
  });
  var ld={"@context":"https://schema.org","@type":"FAQPage","mainEntity":items};
  var s=document.getElementById('faqLd');
  if(!s){s=document.createElement('script');s.type='application/ld+json';s.id='faqLd';document.head.appendChild(s);}
  s.textContent=JSON.stringify(ld);
}catch(e){}}
/* ---- Sosyal medya & ilan portalleri (footer) ---- */
function applySocial(){try{var S=SOCIAL;
  /* protokolsüz girişi (ör. "instagram.com/x") mutlak https'e çevir → aksi halde
     "localhost/insaat/instagram.com/x" gibi KIRIK göreli link olur */
  var _u=function(v){v=(''+(v||'')).trim();return v&&!/^https?:\/\//i.test(v)?'https://'+v.replace(/^\/+/,''):v;};
  var map={Facebook:S.facebook,Instagram:S.instagram,X:S.x,LinkedIn:S.linkedin,YouTube:S.youtube};
  document.querySelectorAll('.insaatFooter .fsocial a').forEach(function(a){
    var lb=a.getAttribute('aria-label')||'';
    if(lb.indexOf('NEXT')>-1){ if(S.nsosyal){a.href=_u(S.nsosyal);a.style.display='';}else{a.style.display='none';} return; }
    if(map.hasOwnProperty(lb)){ var u=map[lb]; if(u){a.href=_u(u);a.style.display='';}else{a.style.display='none';} }
  });
  var pmap={'fp-sah':S.sahibinden,'fp-hep':S.hepsiemlak,'fp-ejt':S.emlakjet};
  Object.keys(pmap).forEach(function(cls){document.querySelectorAll('.insaatFooter .'+cls).forEach(function(a){if(pmap[cls]){a.href=_u(pmap[cls]);a.style.display='';}else{a.style.display='none';}});});
}catch(e){}}
/* ---- Admin: Soru-Cevap CRUD ---- */
function _faqFillSelects(){['faqNewCat','faqAdminCat'].forEach(function(id){var s=document.getElementById(id);if(s&&!s._f){s._f=1;var extra=(id==='faqAdminCat')?'<option value="all">Tüm kategoriler</option>':'';s.innerHTML=extra+FAQ_CATS.map(function(c){return '<option value="'+c.k+'">'+c.i+' '+c.l+'</option>';}).join('');}});}
function renderFaqAdmin(){
  _faqFillSelects();
  var wrap=document.getElementById('faqAdminList');if(!wrap)return;
  var q=((document.getElementById('faqAdminSearch')||{}).value||'').trim().toLowerCase();
  var cf=(document.getElementById('faqAdminCat')||{}).value||'all';
  var rows='',cnt=0;
  FAQ_DATA.forEach(function(x,i){
    if(cf!=='all'&&x.c!==cf)return;
    if(q&&(String(x.q)+' '+String(x.a)).toLowerCase().indexOf(q)<0)return;
    cnt++;
    rows+='<div class="fadm-row"><div class="fadm-top"><select onchange="FAQ_DATA['+i+'].c=this.value">'+FAQ_CATS.map(function(c){return '<option value="'+c.k+'"'+(c.k===x.c?' selected':'')+'>'+c.i+' '+c.l+'</option>';}).join('')+'</select><span class="fadm-idx">#'+(i+1)+'</span><button class="fadm-del" onclick="faqDel('+i+')" title="Sil">🗑</button></div>'
      +'<input class="fadm-q" value="'+_brandEsc(x.q)+'" oninput="FAQ_DATA['+i+'].q=this.value" placeholder="Soru">'
      +'<textarea class="fadm-a" oninput="FAQ_DATA['+i+'].a=this.value" placeholder="Cevap (HTML: <b> <ul> <li> <br>)">'+_brandEsc(x.a)+'</textarea></div>';
  });
  var cel=document.getElementById('faqAdminCount');if(cel)cel.textContent=cnt+' / '+FAQ_DATA.length;
  wrap.innerHTML=rows||'<div style="padding:22px;color:#888;text-align:center">Kayıt yok. Yukarıdan yeni soru ekleyin.</div>';
}
function faqAdd(){var c=(document.getElementById('faqNewCat')||{}).value||'ruhsat';var q=((document.getElementById('faqNewQ')||{}).value||'').trim();var a=((document.getElementById('faqNewA')||{}).value||'').trim();if(!q){alert('Lütfen bir soru yazın.');return;}FAQ_DATA.unshift({c:c,q:q,a:a||'<p>İçerik yakında eklenecek.</p>'});var nq=document.getElementById('faqNewQ');if(nq)nq.value='';var na=document.getElementById('faqNewA');if(na)na.value='';renderFaqAdmin();saveAll();applyFaqSeo();flashSaved&&flashSaved();}
function faqDel(i){if(!confirm('Bu soruyu silmek istediğinize emin misiniz?'))return;FAQ_DATA.splice(i,1);renderFaqAdmin();saveAll();applyFaqSeo();}
function faqSaveAll(){saveAll();applyFaqSeo();var fp=document.getElementById('faqPage');if(fp&&fp.classList.contains('on'))renderFaqPage();flashSaved&&flashSaved();}
/* ---- Admin: Sosyal & portal ---- */
function loadSocialUI(){var S=SOCIAL,f={soc_facebook:'facebook',soc_instagram:'instagram',soc_x:'x',soc_linkedin:'linkedin',soc_youtube:'youtube',soc_nsosyal:'nsosyal',soc_sahibinden:'sahibinden',soc_hepsiemlak:'hepsiemlak',soc_emlakjet:'emlakjet'};Object.keys(f).forEach(function(id){var el=document.getElementById(id);if(el)el.value=S[f[id]]||'';});}
function saveSocial(){var S=SOCIAL,g=function(id){return ((document.getElementById(id)||{}).value||'').trim();};S.facebook=g('soc_facebook');S.instagram=g('soc_instagram');S.x=g('soc_x');S.linkedin=g('soc_linkedin');S.youtube=g('soc_youtube');S.nsosyal=g('soc_nsosyal');S.sahibinden=g('soc_sahibinden');S.hepsiemlak=g('soc_hepsiemlak');S.emlakjet=g('soc_emlakjet');applySocial();saveAll();flashSaved&&flashSaved();}
function loadStatsUI(){var s=SETTINGS,g=function(id){return document.getElementById(id);};if(g('st_yil'))g('st_yil').value=s.statYil||'';if(g('st_konut'))g('st_konut').value=s.statKonut||'';if(g('st_proje'))g('st_proje').value=s.statProje||'';if(g('st_santiye'))g('st_santiye').value=s.statSantiye||'';if(g('st_alan'))g('st_alan').value=s.statAlan||'';if(g('st_certs'))g('st_certs').value=(s.certChips||[]).join('\n');}
function saveStats(){var s=SETTINGS,v=function(id){return (document.getElementById(id)||{}).value;};var pi=function(x,d){var n=parseInt(x,10);return isNaN(n)?d:n;};s.statYil=pi(v('st_yil'),s.statYil);s.statKonut=pi(v('st_konut'),s.statKonut);s.statProje=pi(v('st_proje'),s.statProje);s.statSantiye=pi(v('st_santiye'),s.statSantiye);s.statAlan=pi(v('st_alan'),s.statAlan);var certs=(v('st_certs')||'').split('\n').map(function(x){return x.trim();}).filter(Boolean);if(certs.length)s.certChips=certs;applyStats();applyCerts();saveAll();if(typeof flashSaved==='function')flashSaved();}

/* ===== TEMİZ URL ROUTER (# YOK · SEO) — /insaat/<slug> ===== */
var _INS_BASE=(function(){try{return location.pathname.replace(/[^/]*$/,'');}catch(e){return '/insaat/';}})();
var _insBaseTitle=null, _insRouting=false;
var _INS_OV={
  hizmetler:{t:'Hizmetlerimiz',el:'hizmetlerPage',fn:function(){openHizmetlerPage();}},
  projeler:{t:'Projeler',el:'projelerPage',fn:function(){openProjelerPage();}},
  ilanlar:{t:'İlanlar & Özel Portföy',el:'ilanlarPage',fn:function(){openIlanlarPage();}},
  bolge:{t:'Bölge Zekası',el:'bolgePage',fn:function(){openBolgePage();}},
  iletisim:{t:'İletişim',el:'iletisimPage',fn:function(){openIletisimPage();}},
  'soru-cevap':{t:'Soru-Cevap',el:'faqPage',fn:function(){openFaqPage();}},
  asistan:{t:'ProX Asistan',el:'proxAsistanPage',fn:function(){openProxAsistanPage();}}
};
/* Overlay slug → GERÇEK statik .html sayfası (varsa). Böylece nav overlay açarken URL gerçek
   sayfaya işaret eder; doğrudan erişim/reload'da stub yerine gerçek sayfa yüklenir → RELOAD SIÇRAMASI YOK. */
var _INS_FILE={hizmetler:'hizmetlerimiz.html',projeler:'projelerimiz.html',bolge:'bolge.html','soru-cevap':'soru-cevap.html'};
/* Overlay URL'leri HASH tabanlı: /insaat/#bolge. Reload'da index.html + insBoot overlay'i yeniden açar
   → statik forklu sayfa YÜKLENMEZ, "eski yapı" sıçraması OLMAZ, sunucu rewrite'a bağımlı değil. */
function _insUrl(slug){return _INS_BASE+'#'+slug;}
function _insCurUrl(){return location.pathname+(location.hash||'');}
var _INS_HM={hizmetler:'hizmetler',projeler:'projeler',bolge:'bolge',iletisim:'iletisim',sss:'soru-cevap','soru-cevap':'soru-cevap',faq:'soru-cevap',asistan:'asistan',ai:'asistan'};
function _insSlugFromHash(){var hs=(location.hash||'').replace(/^#/,'');return (_INS_HM[hs]&&_INS_OV[_INS_HM[hs]])?_INS_HM[hs]:'';}
function _insSlug(seg){seg=(seg||'').replace(/\/$/,'');if(seg===''||seg==='index.html')return '';for(var k in _INS_FILE){if(_INS_FILE[k]===seg)return k;}return _INS_OV[seg]?seg:'';}
function _insBrand(){try{var e=document.querySelector('.js-logo');return (e&&e.textContent&&e.textContent.trim())||'Meridyen Yapı';}catch(_){return 'Meridyen Yapı';}}
function _insCloseDom(){try{if(typeof closeAllInsaatOverlays==='function')closeAllInsaatOverlays();}catch(e){}}
/* HER openXPage sonunda çağrılır. Nav'dan gelince (routing=false) temiz URL push + başlık;
   router/boot/geçiş içinden gelince (routing=true) URL zaten doğru → dokunma. Onclick MİGRASYONU GEREKMEZ. */
function _insSyncUrl(slug){if(_insRouting)return;var v=_INS_OV[slug];if(!v)return;if(_insBaseTitle===null)_insBaseTitle=document.title;try{if(_insCurUrl()!==_insUrl(slug))history.pushState({p:slug},'',_insUrl(slug));}catch(e){}try{document.title=v.t+' · '+_insBrand();}catch(e){}}
function _insApply(slug){var v=_INS_OV[slug];if(!v)return;if(_insBaseTitle===null)_insBaseTitle=document.title;_insRouting=true;try{_insCloseDom();v.fn();document.title=v.t+' · '+_insBrand();}catch(e){}_insRouting=false;}
function goPage(slug,ev){ev=ev||window.event;var v=_INS_OV[slug];if(!v)return true;
  /* overlay bu sayfada yoksa (statik SEO sayfası) → engelleme, href ile normal git */
  if(v.el&&!document.getElementById(v.el))return true;
  try{if(ev&&ev.preventDefault)ev.preventDefault();}catch(e){}_insApply(slug);try{if(_insCurUrl()!==_insUrl(slug))history.pushState({p:slug},'',_insUrl(slug));}catch(e){}return false;}
function insHome(ev){ev=ev||window.event;try{if(ev&&ev.preventDefault)ev.preventDefault();}catch(e){}if(_insBaseTitle!==null){document.title=_insBaseTitle;_insBaseTitle=null;}try{if(location.hash||(location.pathname!==_INS_BASE&&!/\/index\.html$/.test(location.pathname)))history.pushState({},'',_INS_BASE);}catch(e){}_insRouting=true;try{_insCloseDom();}catch(e){}_insRouting=false;return false;}
function insRoute(){var slug=_insSlugFromHash();if(!slug){try{slug=_insSlug(decodeURIComponent(location.pathname.slice(_INS_BASE.length)));}catch(e){slug='';}}if(slug&&_INS_OV[slug])_insApply(slug);else{_insRouting=true;try{_insCloseDom();}catch(e){}_insRouting=false;if(_insBaseTitle!==null){document.title=_insBaseTitle;_insBaseTitle=null;}}}
/* #admin / #doc- / #giris (SEO-dışı modallar) hash ile açılır */
function checkHash(){var h=location.hash||'';if(h==='#admin')showAdmin();else if(h.indexOf('#doc-')===0)openDoc(h.slice(5));else if((h==='#giris'||h==='#uye')&&typeof openGiris==='function')openGiris();else if(h==='#hesap'&&typeof girisOrHesap==='function')girisOrHesap();}
function insBoot(){
  var target=null;
  try{var s=sessionStorage.getItem('_ins_ov');if(s){sessionStorage.removeItem('_ins_ov');if(_INS_OV[s])target=s;}}catch(e){}
  if(!target)target=_insSlugFromHash();
  if(!target){try{var slug=_insSlug(decodeURIComponent(location.pathname.slice(_INS_BASE.length)));if(slug&&_INS_OV[slug])target=slug;}catch(e){}}
  if(target){try{document.documentElement.classList.add('ov-boot');setTimeout(function(){try{var de=document.documentElement;de.classList.remove('ov-boot');de.classList.remove('ov-pre');}catch(e){}},80);}catch(e){}try{if(_insCurUrl()!==_insUrl(target))history.replaceState({p:target},'',_insUrl(target));}catch(e){}_insApply(target);var _rm=function(){try{document.documentElement.classList.remove('ov-boot');}catch(e){}};try{requestAnimationFrame(function(){requestAnimationFrame(_rm);});}catch(e){}setTimeout(_rm,120);}
  checkHash();
  /* #medya kesin scroll — alt sayfalardan index.html#medya ile gelince (native jump async
     içerik kaymasıyla ıskalıyordu); overlay değil sayfa-içi scroll hedefi. Sitenin kendi
     fGo() mekanizmasını kullan (footer 'Medya' linkiyle birebir; içerik yerleştikten sonra). */
  try{var _lsh=(location.hash||'');
    if(/^#blog\//.test(_lsh)){/* derin link: Blog sayfası + tekil haber detayı */
      var _bid=_lsh.slice(6);var _mdb=function(){setTimeout(function(){try{insBlogPageAc();insBlogDetail(decodeURIComponent(_bid));}catch(e){}},350);};
      if(document.readyState==='complete')_mdb();else window.addEventListener('load',_mdb);
    }else if(_lsh==='#blog'){/* GERÇEK Blog sayfası (dn paritesi) — index bölümüne scroll DEĞİL */
      var _mbp=function(){setTimeout(function(){try{insBlogPageAc();}catch(e){}},300);};
      if(document.readyState==='complete')_mbp();else window.addEventListener('load',_mbp);
    }else if(_lsh==='#medya'){var _lsid=_lsh.slice(1);var _md=function(){if(typeof fGo==='function')fGo(_lsid);else{var el=document.getElementById(_lsid);if(el)el.scrollIntoView({behavior:'smooth',block:'start'});}};if(document.readyState==='complete')setTimeout(_md,300);else window.addEventListener('load',function(){setTimeout(_md,300);});}
  }catch(e){}
}
window.addEventListener('popstate',insRoute);
addEventListener('hashchange',checkHash);insBoot();

/* ═══════════════ KURULUM SİHİRBAZI (Faz 1) + TEMA/FONT PERSİST (Faz 0 boşluğu) ═══════════════
   insaat'ta tema persist YOKTU (window.__theme hiç atanmıyordu; font teması hiç yoktu).
   Wipe-proof <style id="tenant-theme"> + Google Fonts → SETTINGS.tenantAccent/tenantFont'ta saklanır,
   publishConfig ile pub.THEME'e taşınır → brand.js tüm public/yasal sayfalarda uygular. */
function _obLighten(hex,amt){try{var n=parseInt(hex.slice(1),16);var r=Math.min(255,(n>>16)+amt),g=Math.min(255,((n>>8)&255)+amt),b=Math.min(255,(n&255)+amt);return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);}catch(e){return hex;}}
var INS_FONTS={'Inter':'Inter:wght@400;500;600;700;800','Poppins':'Poppins:wght@400;500;600;700','Manrope':'Manrope:wght@400;500;600;700;800','Sora':'Sora:wght@400;500;600;700','DM Sans':'DM+Sans:wght@400;500;600;700','Nunito':'Nunito:wght@400;600;700;800','Montserrat':'Montserrat:wght@400;500;600;700','Figtree':'Figtree:wght@400;500;600;700','Playfair Display':'Playfair+Display:wght@500;600;700'};
function applyTenantTheme(accent,font){
  try{
    if(accent&&typeof accent==='string'&&accent.charAt(0)==='#'){
      var a2=_obLighten(accent,20),on=(typeof readableOn==='function')?readableOn(accent):'#ffffff';
      var css=':root{--accent:'+accent+';--accent-2:'+a2+';--on-accent:'+on+';}';
      var st=document.getElementById('tenant-theme');
      if(!st){st=document.createElement('style');st.id='tenant-theme';}
      st.textContent=css;(document.head||document.documentElement).appendChild(st);
      var r=document.documentElement.style;r.setProperty('--accent',accent);r.setProperty('--accent-2',a2);r.setProperty('--on-accent',on);
    }
    if(font&&INS_FONTS[font]){
      var lid='brand-font-'+font.replace(/\s+/g,'');
      if(!document.getElementById(lid)){var l=document.createElement('link');l.rel='stylesheet';l.id=lid;l.href='https://fonts.googleapis.com/css2?family='+INS_FONTS[font]+'&display=swap';(document.head||document.documentElement).appendChild(l);}
      document.documentElement.style.setProperty('--brand-font',"'"+font+"'");
      if(document.body)document.body.style.fontFamily="'"+font+"', system-ui, -apple-system, sans-serif";
    }else if(font===''){if(document.body)document.body.style.removeProperty('font-family');document.documentElement.style.removeProperty('--brand-font');}
  }catch(e){}
}
window.applyTenantTheme=applyTenantTheme;window.INS_FONTS=INS_FONTS;

var OB_CSS='#obWrap{position:fixed;inset:0;z-index:99999;display:none;align-items:flex-start;justify-content:center;background:rgba(8,12,20,.55);overflow:auto;padding:30px 16px}'
+'#obWrap.open{display:flex}'
+'#obWrap .ob-box{position:relative;background:var(--surface,#fff);color:var(--ink,#0e1420);max-width:600px;width:100%;border:1px solid var(--line,#e5e9f0);border-radius:18px;padding:24px 26px;box-shadow:0 24px 70px rgba(0,0,0,.32);font-family:inherit}'
+'#obWrap h3{margin:0 0 2px;font-size:1.1875rem}'
+'#obWrap .ob-sub{color:var(--muted,#5a6472);font-size:.8125rem;line-height:1.6;margin:0 0 4px}'
+'#obWrap label{display:block;font-size:.78125rem;font-weight:600;margin:0 0 5px;color:var(--ink,#0e1420)}'
+'#obWrap .ob-field{margin-top:12px}'
+'#obWrap .ob-2{display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-top:12px}'
+'#obWrap input[type=text],#obWrap input:not([type]),#obWrap select,#obWrap input[type=color]{width:100%;padding:11px;border:1px solid var(--line,#e5e9f0);border-radius:10px;font:inherit;background:var(--bg,#fff);color:inherit;box-sizing:border-box}'
+'#obWrap input[type=color]{height:44px;padding:4px}'
+'#obWrap .ob-close{position:absolute;top:14px;right:16px;background:none;border:none;font-size:1.25rem;cursor:pointer;color:var(--muted,#5a6472);line-height:1}'
+'#obWrap .ob-btn{padding:10px 16px;border:1px solid var(--line,#e5e9f0);border-radius:10px;background:var(--bg,#fff);color:inherit;cursor:pointer;font:inherit;font-weight:600}'
+'#obWrap .ob-btn.pri{background:var(--accent,#c8102e);color:var(--on-accent,#fff);border-color:transparent}'
+'#obWrap .ob-sum{background:var(--bg,#f7f9fc);border:1px solid var(--line,#e5e9f0);border-radius:10px;padding:12px 14px;margin-top:12px;font-size:.8125rem;line-height:1.9}';

var _OB_ILLER=['Adana','Adıyaman','Afyonkarahisar','Ağrı','Aksaray','Amasya','Ankara','Antalya','Ardahan','Artvin','Aydın','Balıkesir','Bartın','Batman','Bayburt','Bilecik','Bingöl','Bitlis','Bolu','Burdur','Bursa','Çanakkale','Çankırı','Çorum','Denizli','Diyarbakır','Düzce','Edirne','Elazığ','Erzincan','Erzurum','Eskişehir','Gaziantep','Giresun','Gümüşhane','Hakkâri','Hatay','Iğdır','Isparta','İstanbul','İzmir','Kahramanmaraş','Karabük','Karaman','Kars','Kastamonu','Kayseri','Kırıkkale','Kırklareli','Kırşehir','Kilis','Kocaeli','Konya','Kütahya','Malatya','Manisa','Mardin','Mersin','Muğla','Muş','Nevşehir','Niğde','Ordu','Osmaniye','Rize','Sakarya','Samsun','Siirt','Sinop','Sivas','Şanlıurfa','Şırnak','Tekirdağ','Tokat','Trabzon','Tunceli','Uşak','Van','Yalova','Yozgat','Zonguldak'];
function _obE(s){return (''+(s==null?'':s)).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');}

var OB={step:1,brandUrl:'',il:'',name:'',name2:'',unvan:'',vergi:'',vergiDaire:'',adres:'',lat:'',lng:'',tel:'',mail:'',wa:'',yetkili:'',calisma:'',mersis:'',ticaretSicil:'',oda:'',kep:'',belge:'',logo:'',favicon:'',accent:'',font:'',fb:'',ig:'',x:'',li:'',yt:'',seoTitle:'',seoDesc:'',demoMode:'ornek'};
var OB_STEPS=['İl & Marka','Firma & İletişim','Yasal Künye','Marka & Tema','Sosyal Medya','SEO & İçerik','Yayın'];
function obSeed(){try{
  var S=(typeof SETTINGS!=='undefined'&&SETTINGS)||{},B=(typeof BRAND!=='undefined'&&BRAND)||{},SO=(typeof SOCIAL!=='undefined'&&SOCIAL)||{};
  var keep=function(v,bad){return (v&&(''+v).indexOf(bad)<0)?v:'';};
  OB.il='';OB.name=(B.name&&B.name!=='Meridyen')?B.name:'';OB.name2=(B.name2&&(''+B.name2).indexOf('Yapı')<0)?(''+B.name2).trim():'';
  OB.unvan=keep(S.firmaUnvan,'Meridyen');OB.vergi=keep(S.firmaVergiNo,'1234567890');OB.vergiDaire=keep(S.firmaVergiDairesi,'Beşiktaş');
  OB.adres=keep(S.firmaAdres,'Levent');OB.tel=keep(S.firmaTel,'000 00 00');OB.mail=keep(S.firmaEmail,'meridyen');OB.wa=keep(S.waNumber,'905001234567');
  OB.yetkili=keep(S.firmaYetkili,'Genel Müdür');OB.calisma=keep(S.firmaCalisma,'');
  OB.mersis=keep(S.firmaMersis,'0000000000000000');OB.ticaretSicil=keep(S.firmaTicaretSicil,'123456');OB.oda=keep(S.firmaOda,'İstanbul Ticaret');OB.kep=keep(S.firmaKep,'meridyenyapi');
  OB.belge=keep(S.eidsYetkiBelgeNo,'');
  OB.accent=S.tenantAccent||'';OB.font=S.tenantFont||'';OB.logo='';OB.favicon='';
  OB.fb=SO.facebook||'';OB.ig=SO.instagram||'';OB.x=SO.x||'';OB.li=SO.linkedin||'';OB.yt=SO.youtube||'';
  OB.seoTitle=keep(S.metaTitle,'Meridyen');OB.seoDesc=keep(S.metaDesc,'Meridyen');
}catch(e){}}

/* Sihirbaz: adres -> koordinat (Nominatim, ~1 istek/sn) */
var _obGeoBusy=false;
function obGeocode(){
  try{obCollect();}catch(e){}
  var msg=document.getElementById('ob_geo_msg');
  var adres=(window.OB&&OB.adres)||'';
  if(!adres){if(msg)msg.textContent='Once adres girin.';return;}
  if(_obGeoBusy)return; _obGeoBusy=true; if(msg)msg.textContent='Araniyor...';
  var q=[adres,(window.OB&&OB.il)||'','Turkiye'].filter(Boolean).join(', ');
  fetch('https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=tr&accept-language=tr&q='+encodeURIComponent(q))
    .then(function(r){if(!r.ok)throw 0;return r.json();})
    .then(function(a){var la=document.getElementById('ob_lat'),lo=document.getElementById('ob_lng');
      if(a&&a[0]&&la&&lo){la.value=(+a[0].lat).toFixed(6);lo.value=(+a[0].lon).toFixed(6);if(window.OB){OB.lat=la.value;OB.lng=lo.value;}if(msg)msg.textContent='Bulundu.';}
      else if(msg)msg.textContent='Bulunamadi - elle girebilirsiniz.';})
    .catch(function(){if(msg)msg.textContent='Sorgu basarisiz (internet gerekli).';})
    .then(function(){_obGeoBusy=false;});
}
window.obGeocode=obGeocode;
function obCollect(){function v(id){var e=document.getElementById(id);return e?e.value.trim():undefined;}
  var m={ob_il:'il',ob_brandUrl:'brandUrl',ob_name:'name',ob_name2:'name2',ob_unvan:'unvan',ob_vergi:'vergi',ob_vergiDaire:'vergiDaire',ob_adres:'adres',ob_lat:'lat',ob_lng:'lng',ob_tel:'tel',ob_mail:'mail',ob_wa:'wa',ob_yetkili:'yetkili',ob_calisma:'calisma',ob_mersis:'mersis',ob_ticaretSicil:'ticaretSicil',ob_oda:'oda',ob_kep:'kep',ob_belge:'belge',ob_logo:'logo',ob_favicon:'favicon',ob_accent:'accent',ob_font:'font',ob_fb:'fb',ob_ig:'ig',ob_x:'x',ob_li:'li',ob_yt:'yt',ob_seoTitle:'seoTitle',ob_seoDesc:'seoDesc'};
  Object.keys(m).forEach(function(id){var val=v(id);if(val!==undefined)OB[m[id]]=val;});
  try{var dm=document.querySelector('input[name="ob_demoMode"]:checked');if(dm)OB.demoMode=dm.value;}catch(e){}}
function obBody(n){var e=_obE;
  if(n===1){var ils=_OB_ILLER;
    return '<p class="ob-sub">Firmanızın bulunduğu ili ve marka adını girin. Site tüm sayfalarında bu markaya dönüşür.</p>'
    +'<div class="ob-field"><label>İl</label><select id="ob_il"><option value="">— Seçin (opsiyonel) —</option>'+ils.map(function(il){return '<option'+(il===OB.il?' selected':'')+'>'+il+'</option>';}).join('')+'</select></div>'
    +'<div class="ob-2"><div><label>Marka Adı *</label><input id="ob_name" value="'+e(OB.name)+'" placeholder="ör. Anadolu"></div><div><label>2. Kelime <span style="color:var(--muted);font-weight:400">(ör. Yapı / İnşaat)</span></label><input id="ob_name2" value="'+e(OB.name2)+'" placeholder="Yapı"></div></div>'
    +'<div class="ob-field"><label>✨ Mevcut web / Google işletme URL\'niz <span style="color:var(--muted);font-weight:400">(opsiyonel — otomatik marka)</span></label><input id="ob_brandUrl" value="'+e(OB.brandUrl)+'" placeholder="https://firmaniz.com"><div class="ob-sub" style="margin-top:6px">Girerseniz logo/renk/font/bilgileri buradan otomatik çekmeyi deneriz (yayında aktifleşir).</div></div>';}
  if(n===2){return '<p class="ob-sub">Firma + iletişim — künye, footer ve iletişim alanları bunlardan dolar.</p>'
    +'<div class="ob-field"><label>Ticari Unvan</label><input id="ob_unvan" value="'+e(OB.unvan)+'" placeholder="ör. Anadolu Yapı İnşaat A.Ş."></div>'
    +'<div class="ob-2"><div><label>Telefon</label><input id="ob_tel" value="'+e(OB.tel)+'" placeholder="+90 ..."></div><div><label>WhatsApp</label><input id="ob_wa" value="'+e(OB.wa)+'" placeholder="90 5xx ..."></div></div>'
    +'<div class="ob-field"><label>E-posta</label><input id="ob_mail" value="'+e(OB.mail)+'" placeholder="info@firmaniz.com"></div>'
    +'<div class="ob-field"><label>Adres</label><input id="ob_adres" value="'+e(OB.adres)+'"></div>'
    +'<div class="ob-2"><div class="ob-field"><label>Ofis Enlem (lat)</label><input id="ob_lat" value="'+e(OB.lat)+'" placeholder="41.0850" inputmode="decimal"></div><div class="ob-field"><label>Ofis Boylam (lng)</label><input id="ob_lng" value="'+e(OB.lng)+'" placeholder="29.0093" inputmode="decimal"></div></div>'
    +'<button type="button" onclick="obGeocode()" style="margin-top:4px;padding:8px 14px;border:1px solid var(--line,#ddd);background:#fff;border-radius:9px;cursor:pointer;font:600 .78125rem inherit">Adresten koordinat bul</button><span id="ob_geo_msg" style="margin-left:10px;font-size:.75rem;color:#888"></span>'
    +'<div class="ob-2"><div><label>Yetkili</label><input id="ob_yetkili" value="'+e(OB.yetkili)+'" placeholder="Genel Müdür"></div><div><label>Çalışma Saatleri</label><input id="ob_calisma" value="'+e(OB.calisma)+'" placeholder="Hafta içi 09:00–18:00"></div></div>';}
  if(n===3){return '<p class="ob-sub">Yasal künye — KVKK/gizlilik/çerez/kullanım "Veri Sorumlusu Künyesi" bunlardan dolar. Boş bırakılan alan sayfada "[Doldurulacak]" görünür.</p>'
    +'<div class="ob-2"><div><label>Vergi No</label><input id="ob_vergi" value="'+e(OB.vergi)+'"></div><div><label>Vergi Dairesi</label><input id="ob_vergiDaire" value="'+e(OB.vergiDaire)+'"></div></div>'
    +'<div class="ob-2"><div><label>MERSİS No</label><input id="ob_mersis" value="'+e(OB.mersis)+'"></div><div><label>Ticaret Sicil No</label><input id="ob_ticaretSicil" value="'+e(OB.ticaretSicil)+'"></div></div>'
    +'<div class="ob-2"><div><label>Ticaret Odası</label><input id="ob_oda" value="'+e(OB.oda)+'"></div><div><label>KEP Adresi</label><input id="ob_kep" value="'+e(OB.kep)+'" placeholder="...@hs01.kep.tr"></div></div>'
    +'<div class="ob-field"><label>Taşınmaz Ticareti Yetki Belgesi No <span style="color:var(--muted);font-weight:400">(opsiyonel)</span></label><input id="ob_belge" value="'+e(OB.belge)+'" placeholder="Yetki belge numarası"></div>';}
  if(n===4){var fonts=Object.keys(INS_FONTS);
    return '<p class="ob-sub">Marka görseli + tema. Logo girilmezse firma adının baş harfi kullanılır. Renk & font tüm siteye uygulanır.</p>'
    +'<div class="ob-field"><label>Logo URL</label><input id="ob_logo" value="'+e(OB.logo)+'" placeholder="https://... .png"></div>'
    +'<div class="ob-field"><label>Favicon URL <span style="color:var(--muted);font-weight:400">(opsiyonel)</span></label><input id="ob_favicon" value="'+e(OB.favicon)+'" placeholder="https://... .png/.svg"></div>'
    +'<div class="ob-2"><div><label>Marka Rengi</label><input id="ob_accent" type="color" value="'+e(OB.accent||'#c8102e')+'"></div>'
    +'<div><label>Yazı Tipi</label><select id="ob_font"><option value=""'+(!OB.font?' selected':'')+'>Varsayılan</option>'+fonts.map(function(f){return '<option'+(f===OB.font?' selected':'')+'>'+f+'</option>';}).join('')+'</select></div></div>'
    +(OB.logo?'<div style="margin-top:10px"><img src="'+e(OB.logo)+'" alt="logo" style="max-height:56px;border:1px solid var(--line);border-radius:8px;padding:6px;background:#fff"></div>':'');}
  if(n===5){return '<p class="ob-sub">Sosyal medya hesaplarınız — footer\'da gösterilir. Boş bıraktıklarınız gizlenir (demo hesaplara link verilmez).</p>'
    +'<div class="ob-field"><label>Instagram</label><input id="ob_ig" value="'+e(OB.ig)+'" placeholder="instagram.com/firmaniz"></div>'
    +'<div class="ob-field"><label>Facebook</label><input id="ob_fb" value="'+e(OB.fb)+'" placeholder="facebook.com/firmaniz"></div>'
    +'<div class="ob-2"><div><label>X (Twitter)</label><input id="ob_x" value="'+e(OB.x)+'" placeholder="x.com/firmaniz"></div><div><label>LinkedIn</label><input id="ob_li" value="'+e(OB.li)+'" placeholder="linkedin.com/company/..."></div></div>'
    +'<div class="ob-field"><label>YouTube</label><input id="ob_yt" value="'+e(OB.yt)+'" placeholder="youtube.com/@firmaniz"></div>';}
  if(n===6){return '<p class="ob-sub">SEO + demo içerik. SEO boşsa firma adından otomatik üretilir.</p>'
    +'<div class="ob-field"><label>SEO Başlık</label><input id="ob_seoTitle" value="'+e(OB.seoTitle)+'" placeholder="Firma Adı – Kurumsal İnşaat"></div>'
    +'<div class="ob-field"><label>SEO Açıklama</label><input id="ob_seoDesc" value="'+e(OB.seoDesc)+'" placeholder="Kısa tanıtım (≤160 karakter)"></div>'
    +'<div class="ob-field"><label>Demo içerik (proje / ilan / arsa)</label>'
    +'<div style="margin-top:6px;font-size:.875rem"><label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-weight:400"><input type="radio" name="ob_demoMode" value="ornek"'+(OB.demoMode!=='temiz'?' checked':'')+' style="width:auto"> Örnekle başla (marka döner, içerik temsilî — sonra düzenle)</label></div>'
    +'<div style="margin-top:6px;font-size:.875rem"><label style="display:flex;align-items:center;gap:6px;cursor:pointer;font-weight:400"><input type="radio" name="ob_demoMode" value="temiz"'+(OB.demoMode==='temiz'?' checked':'')+' style="width:auto"> Temiz başla (demo proje/ilan/arsa silinsin)</label></div></div>';}
  if(n===7){var full=(OB.name||'—')+(OB.name2?(' '+OB.name2):'');
    return '<p class="ob-sub">Her şey hazır. "Kur & Yayınla" ile demo, firmanızın kurumsal kimliğine dönüşür ve yayınlanır.</p>'
    +'<div class="ob-sum"><b>Kurulum özeti</b><br>'
    +'Marka: <b>'+e(full)+'</b>'+(OB.il?' · İl: <b>'+e(OB.il)+'</b>':'')+'<br>'
    +(OB.name?'✓':'○')+' Marka adı · '+((OB.tel||OB.mail)?'✓':'○')+' İletişim · '+((OB.mersis||OB.vergi)?'✓':'○')+' Künye · '+(OB.belge?'✓':'○')+' EİDS<br>'
    +(OB.logo?'✓':'○')+' Logo · '+(OB.accent?'✓':'○')+' Renk · '+(OB.font?'✓':'○')+' Font · '+((OB.ig||OB.fb||OB.x||OB.li||OB.yt)?'✓':'○')+' Sosyal · '+(OB.seoTitle?'✓':'○')+' SEO<br>'
    +'İçerik: <b>'+(OB.demoMode==='temiz'?'temiz':'örnek')+'</b></div>';}
  return '';}
function obRender(){var id='obWrap',m=document.getElementById(id);
  if(!document.getElementById('ob-css')){var s=document.createElement('style');s.id='ob-css';s.textContent=OB_CSS;(document.head||document.documentElement).appendChild(s);}
  if(!m){m=document.createElement('div');m.id=id;document.body.appendChild(m);}
  var dots=OB_STEPS.map(function(t,i){var nn=i+1,on=nn===OB.step,done=nn<OB.step;return '<div style="flex:1;text-align:center;font-size:.65625rem;color:'+(on?'var(--accent)':done?'#1a7f4b':'var(--muted)')+';font-weight:'+(on?'700':'500')+'"><div style="height:6px;border-radius:3px;background:'+(on||done?'var(--accent)':'var(--line)')+';margin-bottom:5px"></div>'+(done?'✓ ':'')+t+'</div>';}).join('');
  var last=OB.step===OB_STEPS.length;
  m.innerHTML='<div class="ob-box"><button class="ob-close" onclick="obClose()">✕</button>'
    +'<h3>🏗️ Kurulum Sihirbazı <span style="font-weight:400;color:var(--muted);font-size:.8125rem">— '+OB.step+'/'+OB_STEPS.length+'</span></h3>'
    +'<div style="display:flex;gap:6px;margin:12px 0 16px">'+dots+'</div>'
    +'<div style="min-height:180px">'+obBody(OB.step)+'</div>'
    +'<div style="display:flex;gap:10px;margin-top:18px;justify-content:space-between">'
    +'<div>'+(OB.step>1?'<button class="ob-btn" onclick="obGo(-1)">← Geri</button>':'<button class="ob-btn" onclick="obClose()">Daha sonra</button>')+'</div>'
    +'<div>'+(last?'<button class="ob-btn pri" onclick="obFinish()">✓ Kur & Yayınla</button>':'<button class="ob-btn pri" onclick="obGo(1)">Devam →</button>')+'</div></div></div>';
  m.classList.add('open');}
function obGo(d){obCollect();if(d>0&&OB.step===1&&!OB.name){toast('Lütfen marka adını girin.');return;}OB.step=Math.max(1,Math.min(OB_STEPS.length,OB.step+d));obRender();}
function openOnboarding(){obSeed();OB.step=1;obRender();}
function obClose(){var m=document.getElementById('obWrap');if(m)m.classList.remove('open');}
function obFinish(){obCollect();if(!OB.name){OB.step=1;obRender();toast('Marka adı gerekli.');return;}
  try{
    if(typeof BRAND!=='undefined'){BRAND.name=OB.name;BRAND.name2=OB.name2?(' '+OB.name2.replace(/^\s+/,'')):'';if(OB.logo)BRAND.logo=OB.logo;if(OB.favicon)BRAND.favicon=OB.favicon;}
    if(typeof SETTINGS!=='undefined'){var S=SETTINGS;
      if(OB.unvan){S.firmaUnvan=OB.unvan;S.eidsUnvan=OB.unvan;}else if(OB.name){S.firmaUnvan=OB.name+(OB.name2?(' '+OB.name2):'')+' İnşaat A.Ş.';S.eidsUnvan=S.firmaUnvan;}
      if(OB.tel)S.firmaTel=OB.tel;if(OB.mail)S.firmaEmail=OB.mail;if(OB.adres)S.firmaAdres=OB.adres;if(OB.wa)S.waNumber=OB.wa.replace(/[^0-9]/g,'');
      /* Ofis konumu: lat/lng girildiyse dogrudan; yoksa il secimi mapQuery'e adres-string olarak (Nominatim cozer). Il artik PERSIST ediliyor (eski dekoratif secici islevsellesti). */
      if(OB.lat&&OB.lng&&isFinite(+OB.lat)&&isFinite(+OB.lng))S.mapQuery=(+OB.lat).toFixed(6)+','+(+OB.lng).toFixed(6);
      else if(OB.adres)S.mapQuery=OB.adres;
      else if(OB.il)S.mapQuery=OB.il;
      if(OB.il)S.firmaIl=OB.il;
      if(OB.yetkili)S.firmaYetkili=OB.yetkili;if(OB.calisma)S.firmaCalisma=OB.calisma;
      if(OB.vergi)S.firmaVergiNo=OB.vergi;if(OB.vergiDaire)S.firmaVergiDairesi=OB.vergiDaire;if(OB.mersis)S.firmaMersis=OB.mersis;
      if(OB.ticaretSicil)S.firmaTicaretSicil=OB.ticaretSicil;if(OB.oda)S.firmaOda=OB.oda;if(OB.kep)S.firmaKep=OB.kep;
      if(OB.belge)S.eidsYetkiBelgeNo=OB.belge;
      if(OB.seoTitle)S.metaTitle=OB.seoTitle;else if(OB.name)S.metaTitle=OB.name+(OB.name2?(' '+OB.name2):'')+' – Kurumsal İnşaat';
      if(OB.seoDesc)S.metaDesc=OB.seoDesc;
      S.tenantAccent=OB.accent||'';S.tenantFont=OB.font||'';
      /* BOŞ-DEFAULT TEMİZLEME: yeni tenant'ta boş bırakılan Meridyen-demo künye/iletişim alanları miras kalmasın → [Doldurulacak] */
      if(OB.name!=='Meridyen'){
        if(!OB.vergi)S.firmaVergiNo='';if(!OB.vergiDaire)S.firmaVergiDairesi='';if(!OB.mersis)S.firmaMersis='';
        if(!OB.ticaretSicil)S.firmaTicaretSicil='';if(!OB.oda)S.firmaOda='';if(!OB.kep)S.firmaKep='';
        if(!OB.tel)S.firmaTel='';if(!OB.mail)S.firmaEmail='';if(!OB.adres)S.firmaAdres='';if(!OB.wa)S.waNumber='';}
    }
    if(typeof SOCIAL!=='undefined'){SOCIAL.facebook=OB.fb||'';SOCIAL.instagram=OB.ig||'';SOCIAL.x=OB.x||'';SOCIAL.linkedin=OB.li||'';SOCIAL.youtube=OB.yt||'';}
    if(OB.demoMode==='temiz'){try{if(typeof PROJECTS!=='undefined'&&PROJECTS.length)PROJECTS.length=0;if(typeof ILANLAR!=='undefined'&&ILANLAR.length)ILANLAR.length=0;if(typeof ARSALAR!=='undefined'&&ARSALAR.length)ARSALAR.length=0;if(typeof OZEL!=='undefined'&&OZEL.length)OZEL.length=0;}catch(e){}}
    if(typeof saveAll==='function')saveAll(); /* persist meridyen_site_v1 + publishConfig → meridyen_pub_v1 (pub.THEME dahil) */
    try{if(typeof applyBrand==='function')applyBrand();}catch(e){}
    try{if(typeof applySocial==='function')applySocial();}catch(e){}
    try{if(typeof applyContactAll==='function')applyContactAll();}catch(e){}
    try{if(typeof applyMenuText==='function')applyMenuText();}catch(e){}
    try{if(typeof applyCerts==='function')applyCerts();}catch(e){}
    try{applyTenantTheme(OB.accent,OB.font);}catch(e){}
    if(OB.brandUrl){try{localStorage.setItem('ins_brand_url',OB.brandUrl);}catch(e){}} /* Faz 3 AI çıkarım kancası */
    try{localStorage.setItem('ins_onboarded','1');}catch(e){}
    obClose();
    if(typeof toast==='function')toast('✓ Kurulum tamam! '+OB.name+(OB.name2?(' '+OB.name2):'')+' yayında.');
  }catch(e){if(typeof toast==='function')toast('Kurulumda hata: '+(e&&e.message||e));}
}
window.openOnboarding=openOnboarding;window.obGo=obGo;window.obFinish=obFinish;window.obClose=obClose;
/* boot: kayıtlı tenant temasını geri uygula + #kur / ilk-çalıştırma otomatik aç */
try{if(typeof SETTINGS!=='undefined'&&(SETTINGS.tenantAccent||SETTINGS.tenantFont))applyTenantTheme(SETTINGS.tenantAccent,SETTINGS.tenantFont);}catch(e){}
addEventListener('hashchange',function(){if(location.hash==='#kur')openOnboarding();});
window.addEventListener('load',function(){try{
  if(typeof SETTINGS!=='undefined'&&(SETTINGS.tenantAccent||SETTINGS.tenantFont))applyTenantTheme(SETTINGS.tenantAccent,SETTINGS.tenantFont);
  if(location.hash==='#kur'){setTimeout(openOnboarding,400);return;}
  var fresh=!localStorage.getItem('meridyen_site_v1')&&!localStorage.getItem('ins_onboarded');
  if(fresh)setTimeout(openOnboarding,1400);
}catch(e){}});

/* CANLI GOOGLE PUANI — proxy ucu /api/v1/tenant/google-rating (6 saat önbellek);
   uç yoksa temsilî değer + 'demo' rozeti. */
async function insGoogleRating(){
  try{
    var host=document.getElementById('gRateBadge'); if(!host)return;
    var c=null; try{c=JSON.parse(localStorage.getItem('ins_grate')||'null');}catch(e){}
    var d=(c&&(Date.now()-c.ts<21600000))?c.d:null;
    if(!d){
      try{var r=await proxApi('/api/v1/tenant/google-rating');
        if(r&&!r.fallback&&r.rating)d={rating:+r.rating,count:+r.count||0,url:r.url||'',demo:false};}catch(e){}
      if(!d)d={rating:4.9,count:61,url:'',demo:true};
      try{localStorage.setItem('ins_grate',JSON.stringify({ts:Date.now(),d:d}));}catch(e){}
    }
    var href=d.url||'https://www.google.com/maps/search/'+encodeURIComponent('Meridyen Yapı İnşaat');
    host.innerHTML='<a class="grate" href="'+href.replace(/"/g,'&quot;')+'" target="_blank" rel="noopener noreferrer" aria-label="Google puanımız">'
      +'<span class="grate-g" aria-hidden="true">G</span><span class="grate-stars" aria-hidden="true">★★★★★</span>'
      +'<b>'+d.rating.toFixed(1).replace('.',',')+'</b><span class="grate-n">'+(d.count||0)+' değerlendirme</span>'
      +(d.demo?'<span class="grate-demo">demo</span>':'')+'</a>';
  }catch(e){}
}
try{ if(document.readyState!=='loading')setTimeout(insGoogleRating,500); else document.addEventListener('DOMContentLoaded',function(){setTimeout(insGoogleRating,500);}); }catch(e){}
