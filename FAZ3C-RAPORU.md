# FAZ 3C RAPORU — KRİTİK GÜVENLİK, EİDS GERÇEKLİK, KURUMSAL TEMİZLİK VE ÜRETİM KAPANIŞI
**Tarih:** 14 Ağustos 2026 · **Branch:** `feat/faz3-multitenant-demo` · **Rollback:** `git revert <faz3c-commit>`
## ⛔ ÜRETİM ONAYI VERİLMEMİŞTİR
İstemci/paket katmanında 3C'nin uygulanabilir tüm kalemleri kanıtla kapandı (**49 PASS / 3 PARTIAL / 0 FAIL / 11 BLOCKED**). Argon2id+MFA+RBAC auth, SSR tenant çözümleme, backend service-area/paket zorlaması, CSP HTTP başlıkları, Lighthouse canlı ölçümü, backup-restore/RPO-RTO, TLS/özel alan adı, DAST — bunlar bu statik repoda UYGULANAMAZ; FAZ3 raporundaki uç sözleşmeleri geçerlidir ve bu kalemler kapanmadan üretim onayı verilemez.

## 1) Bu turda kapatılan KRİTİK açıklar
**P0.3 — Portal fail-open AÇIĞI (gerçek ve ciddiydi):** `saasPortalConnect` API kesik/timeout'ta `_saasPortalSimProfile` + `portal_+Math.random()` token üretip OTURUM AÇIYORDU; `securePass` sunucuya hiç gitmiyordu. → Söküldü: parola `secure_pass` olarak `/api/v1/tenant/portal/login`'e gider; `success+portal_token+profile` gelmeden giriş YOK; timeout/fallback/4xx-5xx → "giriş yapılamadı". Canlı kanıt: backend yokken `ok:false`, oturum kapalı, token null.
**P0 — EİDS gerçeklik:** `window.EIDS_DEMO` bayrağı tamamen söküldü (tek bayrak `EMLAK_DEMO`); `_insDemoEids/_demoEids/_pendEids` → nötr adlar; örnek belge no `0034812` HER yerden kaldırıldı (hero/hakkımızda/sihirbaz placeholder/JSON-LD/i18n); `eidsVerify` artık uzunlukla yetki SAYMAZ — yalnız sunucu-onaylı (`approved===true && üretim`) beyan rozet basar.
**P0 — Service-area:** dn ilan kaynağına il filtresi — tenant ilinin dışındaki kayıt (Çeşme/Alaçatı) public listeye GİREMEZ (canlı: İzmir kaydı 0, sayfada Çeşme/Alaçatı 0). Backend sorgu zorlaması sözleşmede.
**P1 — İçerik zamanlama:** 19/28 Ağustos 2026 tarihli 4 seed makale 14 Ağustos'ta yayındaydı → tarihler düzeltildi + her iki birleştiriciye kalıcı YAYIN KAPISI (`published_at<=now`, TR ay adları çözümlü); gelecek tarihli içerik public listede/sitemap kartlarında görünmez. Canlı: gelecekli 0.
**P1 — Consent fail-closed:** ins GA/site-verification/reklam enjeksiyonu `cookieChoice==='accept'` olmadan YÜKLENMEZ (dn'de zaten vardı). OpenStreetMap karoları iki aşamalı onay: `GMHarita.build` tık-kapısı — onay öncesi 0 harici istek (canlı kanıt), tercih `ui_map_ok`.
**Son-tarama:** `EIDS_DEMO · _insDemoEids · _demoEids · 0034812 · tenant_key(→veriYetki, 14 nokta) · admin/1234 · system prompt/sistem promptu` kaynak+dist genelinde SIFIR; paketleyici YASAK listesine eklendi (bulguda paket DURUR) — tarayıcı benim dokümantasyon yorumlarımı bile yakalayıp düzelttirdi.

## 2) Kabul matrisi (C1–C5 + tüm bloklar)
```
[PASS   ] #1 danisman: public yasak-dize taraması
         grep 10 desen × public dosyalar → 0 eşleşme
[PASS   ] #1 insaat: public yasak-dize taraması
         grep 10 desen × public dosyalar → 0 eşleşme
[PASS   ] #10 danisman: tek robots meta
         0 sapma []
[PASS   ] #10 danisman: tek+doğru canonical
         çoklu:[] yanlış-host:[]
[PASS   ] #10 danisman: html lang=tr
         []
[PASS   ] #10 danisman: title+description
         []
[PASS   ] #10 danisman: JSON-LD parse
         []
[PASS   ] #10 danisman: tek H1 (statik sayım)
         0-H1:[] çok-H1:[] (SPA-render H1'ler statik sayımda görünmez)
[PASS   ] #10 insaat: tek robots meta
         0 sapma []
[PASS   ] #10 insaat: tek+doğru canonical
         çoklu:[] yanlış-host:[]
[PASS   ] #10 insaat: html lang=tr
         []
[PASS   ] #10 insaat: title+description
         []
[PASS   ] #10 insaat: JSON-LD parse
         []
[PASS   ] #10 insaat: tek H1 (statik sayım)
         0-H1:[] çok-H1:[] (SPA-render H1'ler statik sayımda görünmez)
[PASS   ] #10 danisman: kırık iç link
         0 kırık []
[PASS   ] #10 insaat: kırık iç link
         0 kırık []
[PASS   ] #11 danisman: sitemap (21 URL)
         []
[PASS   ] #11 insaat: sitemap (20 URL)
         []
[PARTIAL] #12 danisman: üst-menü link seti
         2 varyant; baskın=21 sayfa; sapanlar=[['404.html']] (index nav'ı JS/SPA basar — statik fark)
[PARTIAL] #12 insaat: üst-menü link seti
         4 varyant; baskın=14 sayfa; sapanlar=[['index.html'], ['neden-biz.html'], ['soru-cevap.html', 'projelerimiz.html', 'hizmetlerimiz.html']] (index nav'ı JS/SPA basar — statik fark)
[PASS   ] #15 danisman: public HTML'de studio/engine/admin script'i
         []
[PASS   ] #15 insaat: public HTML'de studio/engine/admin script'i
         []
[PARTIAL] #15 app-core/app.js içindeki admin FONKSİYON gövdeleri
         markup+studio+engine admin-assets'e ayrıldı; monolit JS içindeki admin fonksiyonlarının tam çıkarımı ertelendi (rapor: refactor planı)
[PASS   ] #13 lead başarısızlıkta ok:false + saklama yok (kod kanıtı)
         EMLAK_DEMO=false + submitLead catch → {ok:false,offline:true}, localStorage yazımı DEMO şartlı
[PASS   ] #14 tenant-leakage taraması
         uretim-paketle.py scanner: 0 bulgu (paket bu şartla üretildi)
[PASS   ] #F1 danisman: sağlayıcı/model ifşası (admin dahil)
         9 desen(ci) → 0 eşleşme []
[PASS   ] #F1 insaat: sağlayıcı/model ifşası (admin dahil)
         9 desen(ci) → 0 eşleşme []
[PASS   ] #F2 LICENSE + THIRD-PARTY-NOTICES
         repo kökünde proprietary LICENSE + lisans bildirimleri
[PASS   ] #F2 danisman: first-party banner
         0 bannersız []
[PASS   ] #F2 danisman: footer NADAS hak satırı
         0 sayfada yok [] (JS-mount footer'lar runtime'da basar)
[PASS   ] #F2 insaat: first-party banner
         0 bannersız []
[PASS   ] #F2 insaat: footer NADAS hak satırı
         0 sayfada yok [] (JS-mount footer'lar runtime'da basar)
[PASS   ] #F3 danisman: demo sınıfı + EİDS fail-closed + schema kapısı
         eids demo durumu + sandbox + kart/detay disclaimer + RealEstateListing kapısı kaynakta
[PASS   ] #F3 insaat: demo sınıfı + EİDS fail-closed + schema kapısı
         eids demo durumu + sandbox + kart/detay disclaimer + RealEstateListing kapısı kaynakta
[PASS   ] #F4 danisman: storage-guard enjeksiyonu
         0 sayfada yok []
[PASS   ] #F4 insaat: storage-guard enjeksiyonu
         0 sayfada yok []
[PASS   ] #F4 sentinel sızıntısı (TENANT_A/B/C)
         uretim-paketle.py YASAK listesi — paket bu şartla üretildi (0 bulgu)
[PASS   ] #F5 portföy üretimi deterministik (seeded, config_version katkılı)
         FNV+xorshift seed + cfg.seedExtra (tenant|cv|g1); Math.random üretimde yok
[PASS   ] #B1 ins index: header=1 footer=1 h1=1 href#=0 (statik)
         {'header': 1, 'footer': 1, 'h1': 1, 'hrefdiez': 0, 'tmpl': 0}
[PASS   ] #B2 tarayıcıda parola hash/karşılaştırma sıfır
         crypto.subtle taraması → []
[PASS   ] #B3 'ProX AI' ifadesi sıfır
         []
[PASS   ] #B4 harici Pexels hotlink sıfır (public)
         []
[PASS   ] #B5 demo portföy yasaklı iddia dili sıfır
         []
[PASS   ] #B6 dn randevu formu POST same-origin + name/label
         method=post action=/api/v1/tenant/lead + name alanları + label for/id
[PASS   ] #B7 tenant-özgü üretim anahtarı (site_type+config_version seed)
         dn seedExtra='consultant|cv<N>|g1' ≠ ins 'construction|g1' → aynı bölgede farklı üretim
[PASS   ] #B8 danisman: i18n sızıntı anahtarları + tek dict sürümü
         eksik:[] sürümler:['5']
[PASS   ] #B8 insaat: i18n sızıntı anahtarları + tek dict sürümü
         eksik:[] sürümler:['7']
[PASS   ] #C1 FAZ3C son-tarama desenleri sıfır
         []
[PASS   ] #C2 portal fail-closed: sim profil/rastgele token YOK, parola sunucuya
         securePass→/portal/login; başarısızlık=giriş yok
[PASS   ] #C3 içerik zamanlama: yayın kapısı + gelecek tarihli seed sıfır
         gelecekli:[]
[PASS   ] #C4 analitik/pazarlama fail-closed + harita tık-kapısı
         onay yoksa GA/ads yüklenmez; OSM karoları tıkla-yükle
[PASS   ] #C5 tenant ili dışındaki ilan public listede görünmez (istemci katmanı)
         dn ilan-data il filtresi; backend sorgu zorlaması BLOCKED-spec
[BLOCKED] #3 production bootstrap 200 + same-origin (gerçek BFF)
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #4 HttpOnly/Secure/SameSite oturum çerezi
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #5 bilinmeyen HTML→404
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #6 bilinmeyen /api→JSON 404
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #7 /admin yetkisiz→koruma
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #8 /index.html→/ 301
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #9 ins alias rotaları 301
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #16 CSP nonce/hash + inline'sız
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #17 WebGL 2D fallback testi
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #18 SSR dil rotaları (/tr /en /ar) + hreflang
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)
[BLOCKED] #19 klavye erişilebilirlik tam turu
         statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)

──── ÖZET ────
{'PASS': 49, 'PARTIAL': 3, 'BLOCKED': 11}

```

## 3) Test matrisi (3 tenant)
`scripts/fixtures/tenant-fixtures.json` 3C profillerine güncellendi: A=İnşaat İstanbul/Beşiktaş/Levent · B=Danışman İzmir/Çeşme/Alaçatı · C=Kurumsal ofis Ankara/Çankaya/Oran (farklı marka/tema/paket/dil; sentineller dist'e sızarsa paket durur). Çapraz-tenant/host-spoof/cache canlı testleri backend ortamı ister — BLOCKED.

## 4) 3C teslim listesi durumu
1-3 (dosyalar/silinen akışlar) bu rapor+commit · 4 test sonuçları: koşucu çıktısı+canlı kanıtlar · 5 tenant izolasyonu: sentinel+seedExtra istemci kanıtı, staging BLOCKED · 6 EİDS ±testler: F3/C1 + sandbox (olumlu senaryo backend ister) · 7 auth/portal: C2+canlı fail-closed · 8 SEO çıktıları: dist robots/sitemap/canonical (F/B blokları) · 9 Lighthouse: BLOCKED (canlı host; yerel Chromium ölçümü temsili olmaz — dürüstçe verilmedi) · 10 secret-scan: paketleyici tarayıcısı (SAST/DAST harici araç — BLOCKED) · 11 backup-restore: BLOCKED · 12 kalan riskler: BLOCKED 11 + PARTIAL 3 (SPA menü varyantı, monolit admin gövdeleri, ins statik H1'ler alt sayfalarda) + cs-engine demo BYOK görsel araması + haber içerik dili (backend çeviri).
