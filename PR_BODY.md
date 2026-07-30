## NADAS — 4 Dil (TR·EN·中文·العربية) + İleri AEO/GEO + Kapsamlı Çeviri QA (feat/dwg-prox-gercek-veri)

Türkiye emlak **veri & yazılım** şirketi NADAS için premium, **dürüst** tek-dosya HTML sitesi (20 sayfa + paylaşılan `nadas/js/core.js`, vanilla JS, build yok, `file://` uyumlu). Bu branch, sitenin tam çok-dilli dönüşümü, 2026-07 seviyesinde AEO/GEO yapısal veri katmanı ve uçtan uca çeviri QA'sını içerir.

### Dürüstlük disiplini
- Uydurma veri/sertifika/süperlatif yok. **ProX** = deterministik ML/MML veri motoru (üretici AI değil).
- Depolama-boyutu (TB) iddiaları yok → **kapsam çerçevesi**: 480M+ veri · 81 il · 973 ilçe · 50.000+ mahalle · 257 ay.
- KDV %20 dahil; SPK/BDDK yetkisi NADAS tarafından verilmez; veri lisanslanır, devredilmez.

### 1) Çok-dilli sistem (TR varsayılan · EN · ZH 简体 · AR RTL)
- **20/20 içerik sayfası** dört dilde — ~6.740 benzersiz metin × 3 dil.
- Dil seçici **footer'da, WhatsApp'ın solunda**; URL `?lang=` otoriter, localStorage yedek.
- `hreflang` (tr·en·zh-Hans·ar·x-default) + `og:locale` + JSON-LD `inLanguage`; **sitemap.xml** her URL için 5 `xhtml:link` alternatifi (20×5).
- Arapça **RTL** (ProX wordmark `unicode-bidi:isolate` ile korunur).
- **Tüm gayrimenkul kategorileri çevrildi** — hiçbiri Türkçe kalmadı (Veri Terminali dropdown'ları numerik `value` ile API-güvenli).
- Yasal sayfalar **tam nötr çeviri**. Mimari: sayfa-içi birebir-eşleşme sözlüğü (`js/i18n/<page>.js`) + `translateBody` (dinamik içerik için MutationObserver + gecikmeli geçişler).

### 2) İleri AEO/GEO (core.js v47)
- Her sayfada entity grafiği: **Organization + WebSite + WebPage(speakable) + BreadcrumbList** (dile göre), `sameAs`, `availableLanguage`.
- Primary entity zenginleştirme (`#organization`'a bağlı): **Dataset** (temporalCoverage · Place+geo spatialCoverage · variableMeasured · measurementTechnique · distribution · license · datePublished/dateModified), **SoftwareApplication** (prox v2.0, crm), **WebAPI** (kurumsal-api), **Service** (web-yazilim, veri-lisansi, yapay-zeka).
- **Tüm şema metinleri 4 dilli** (deep-translate). AI-tarayıcı `robots.txt` + `llms.txt` + FAQPage.

### 3) Link denetimi & emlakekspertizi.com derin analiz
- İç linkler, `karar-analizi-ornek.pdf` ve emlakekspertizi.com deep-link'lerinin **hepsi canlı 200 doğrulandı** (/uyelik, /spk-talep, /demo, /ekspertiz-talep, /emlak-endeksi, /blog…). `/yapay-zeka`→`/prox-asistan` bilinçli redirect.

### 4) Kapsamlı çeviri QA
- **TB/depolama ifadesi temiz.** 20 sayfa × dict-diff taraması: dinamik içerik çeviri boşlukları (Veri Terminali kategori kodları + kart etiketleri + DNA sinyalleri + ML/MML pipeline; index 97 + diğer 7 sayfada 15 metin) 4 dile çevrildi.

### Reviewer notları
- `core.js` değişince tüm sayfalarda `?v=N` cache-bust bump (şu an **v47**); her sayfanın i18n dosyası ayrıca `?v` ile versiyonlanır.
- Palet `C.violet` ismi yanıltıcıdır; **değeri cyan #22D3EE** döndürür (mor yasağı).
- Bilinçli ertelenen: PDF/PNG rapor kapaklarındaki "372M+" görseli yeni PDF'ler geldiğinde yenilenecek (kod tarafı güncel 480M+ kullanır).
- Bundan sonra her yeni ekleme 4 dilde yapılacak.

### Test
Her sayfa 4 dilde tarayıcıda doğrulandı: kalan Türkçe = yalnız özel adlar (il/ilçe/mahalle/marka), 5 hreflang, RTL, geçerli JSON-LD, temiz konsol.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
