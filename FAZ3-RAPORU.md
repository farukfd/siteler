# FAZ 3 RAPORU — TAM ÖZELLİKLİ DEMO · MULTI-TENANT · OTOMATİK ÖZEL PORTFÖY · EİDS · NADAS
**Tarih:** 14 Ağustos 2026 · **Branch:** `feat/faz3-multitenant-demo` · **Rollback noktası:** `3e3e651` (`git reset --hard 3e3e651` veya `git revert <faz3-commit>`)
**DURUM: TAMAMLANMADI olarak işaretlenmiştir** — istemci/paket katmanındaki tüm kalemler uygulandı ve kanıtlandı (34 PASS); veritabanı/migration/BFF/edge gerektiren 11 kriter bu repoda uygulanamaz (statik front-end) ve §7'de uç sözleşmesi olarak teslim edilmiştir. Sahte PASS yoktur.

## 1) Mimari inceleme & kök neden (teslimat #1)
Keşif 5 paralel envanterle yapıldı (sağlayıcı ifşası, storage otoritesi, portföy/EİDS yüzeyi, XSS, sihirbaz-üretim zinciri). Kök nedenler:
- Tek `portfolio` düzlemi: demo kayıtlar `eids.status='dogrulandi'` temsilî değeriyle GERÇEK ilan gibi rozetleniyordu (client flag `EIDS_DEMO`).
- localStorage kurumsal otoriteydi: 323 storage çağrısının yalnız 2'si DEMO-şartlıydı; marka/firma/portföy/lead/parola-hash şartsız yazılıyordu.
- Sağlayıcı ifşası: 3 noktadan doğrudan `api.deepseek.com` çağrısı + istemcide sistem promptları + admin'de sağlayıcı adları/model kimlikleri.
- `EMLAK_DEMO` yalnız index'lerde tanımlıydı → alt sayfalarda sınıf yüklemi çöküyordu (canlı testte yakalandı, kapatıldı).

## 2) Değişen dosyalar (teslimat #2)
`shared/`: eids.js (DEMO durumu+demoRecord+sandbox adaptörü+canPublish/isDemo+rozet), listing.js (_isDemoRec+publicList sınıf kapısı+DEMO mini rozet+detay disclaimer+RealEstateListing kapısı), cs-engine.js (nötr /api/ai/generate m1-m3 profilleri+media proxy+alan göçü), mahalle-endeks.js (seedExtra+Temsilî·DEMO rozeti), **storage-guard.js (YENİ)**.
`danisman/`: js/app.js (Motor-1 proxy'leşme, admin etiket nötrleme, XSS×6, GA doğrulama, proxCfgSave gate, export sır-dışlama, cfgrev, VIP sınıf damgaları, PROVINCE boot restore, footer), js/uyelik.js (üretim auth dalı), js/content.js+20 statik HTML (NADAS hak satırı), js/ilan-data.js (demoRecord), prox-asistan.html (PA_SYS söküm+nötr uç), js/content-studio.js, index.html, ozel-portfoy.html (il/WA/seedExtra bağlama), css/base.css.
`insaat/`: js/app-core.js (etiket/anahtar nötrleme, XSS×4, GA×2, demoRecord, görsel-hash determinizm), js/app-ui.js (DWG motoru nötr uç), js/admin-markup.js, js/content-studio.js, index.html (auth üretim dalı+mount il bağlama), ilanlar.html, ozel-portfoy.html, 19 statik HTML (NADAS), css/base.css+chrome.css.
Kök: **LICENSE (YENİ)**, **THIRD-PARTY-NOTICES.md (YENİ)**, scripts/uretim-paketle.py (banner+guard enjeksiyonu+SAĞLAYICI tarayıcı+sentineller), scripts/kabul-testi.py (F1–F5 blokları), **scripts/fixtures/tenant-fixtures.json (YENİ)**.

## 3) Veri modeli — üç sınıf (teslimat #3–5)
**İstemci-uygulanan:** `DEMO_PRIVATE_PORTFOLIO` — kayıtlar `listing_kind='demo_private_portfolio'`, `environment='demo'`, `source='prox_demo_market_model'`, `generation_version='g1'`, `config_version='cv<N>'` damgalı (dn rebuildVipFromProx; eids.demoRecord tüm _demoEids üreticilerinin tek kaynağı). Görünürlük: `publicList` = OFFICIAL(gerçek dogrulandi) VEYA (demo-ortam ∧ demo-sınıf). Üretimde demo kayıt LİSTELENMEZ (canlı dist kanıtı: 0 kart).
**Backend DDL sözleşmesi (uygulama sunucu tarafında):**
- `official_listing`: id, tenant_id, source_record_id, source_type, real_record BOOL NOT NULL DEFAULT false, listing_kind, owner_or_authorized_source, authorization_document_status, eids_identity_status, eids_authority_status, eids_verified_at, eids_authorization_expires_at, eids_verification_reference_encrypted (KMS), eids_last_checked_at, publication_status ENUM(draft,awaiting_eids,verified,published,suspended,expired,archived), published_at, expires_at, category, city, district, neighborhood, public_location JSONB, private_location_encrypted, property_attributes JSONB, price NUMERIC, currency, media JSONB, audit_history JSONB[]. KURAL: `published` yalnız server-side EİDS transaction'ıyla; client `verified` alanları YOK SAYILIR; servis kapalı → `awaiting_eids` (fail-closed).
- `demo_private_portfolio`: id, tenant_id, listing_kind, environment='demo' CHECK, source, config_version, brand_snapshot JSONB, city/district/neighborhood/category, property_template, size_band, room_or_usage_template, price_band, market_reference_date, market_data_count, confidence_level, generalized_location, licensed_demo_media, demo_disclaimer, generated_at, generation_version, visibility, sort_order, audit_history. AYRI TABLO — resmî feed/sitemap/schema sorguları bu tabloya HİÇ dokunmaz.
- `real_private_portfolio`: gerçek kaynak kaydı + malik izni server-side; private alanlar şifreli; EİDS'siz resmî havuza geçiş DB kısıtıyla engelli (trigger: listing_kind değişimi yalnız eids_verified_at IS NOT NULL iken).

## 4) Demo özel portföy motoru (teslimat #6)
- Üretim TAMAMEN deterministik: FNV-1a seed + xorshift RNG (`mahalle-endeks.js`), anahtar `ilçe|mahalle|amaç|seedExtra`, seedExtra=`tenant|cv<config_version>|g1`. `Math.random` portföy üretiminde SIFIR (ins yeni-ilan görseli de id-hash'e alındı). Aynı config → aynı portföy; `saApply`/sihirbaz yayını `dn_cfgrev`'i artırır → yeni immutable üretim.
- Tenant girdileri üretimi şekillendirir: il/ilçe/mahalle/kategori değişimi `_vipInstant` 700ms debounce'lı yalnız-etkilenen yeniden üretim (dn); kategori kapalıysa o tip üretilmez (`saHasCat`); il artık 4 mount'ta sabit İstanbul DEĞİL — dn `dn_service_area.primary`, ins `SETTINGS.firmaIl` (zincir kopukları kapandı), WhatsApp tenant config'inden.
- Dürüstlük: dolgu kartları görünür `Temsilî · DEMO` rozeti; kart `DEMO` mini rozeti; detay `DEMO ÖZEL PORTFÖY — ProX piyasa verileriyle oluşturulmuş tanıtım senaryosudur. Gerçek ilan veya EİDS doğrulanmış taşınmaz kaydı değildir.`; fiyatlar "…'den başlayan" bandı; ProX verisi yoksa gerçek-ilan üretilmez (ozelReal önce, dolgu işaretli).

## 5) EİDS adaptörü — fail-closed (teslimat #7)
- `EIDS.verify`: demo ortamında gerçek Bakanlık/EİDS servisine İSTEK GÖNDERİLMEZ (sandbox: `status=beklemede, sandbox=true`); üretimde same-origin `/api/v1/tenant/eids/verify`, yalnız `success && !fallback` gerçek sonuç kabul; hata/timeout → dürüst `beklemede`. Sahte kod/referans HİÇBİR yolda üretilmez.
- `canPublish`: demo sınıfı + sandbox + client-flag her koşulda RED; yalnız server-doğrulamalı `dogrulandi` geçer. Rozet: demo kayıtta EİDS rozeti YOK — gri `DEMO İLAN`.
- EİDS test matrisi (§17 komut): istemci-koşulabilir 7/12 PASS (1,2,7,8,9 kod+canlı kanıt; 6 fail-open yok; 12 rozet yalnız gerçek doğrulamada) · server-gereken 5/12 BLOCKED (3,4,5,10,11 — DDL+uç sözleşmesi yukarıda).

## 6) BFF & secret + ProX tekliği (teslimat #8)
- Sağlayıcı ifşası kaynak+dist genelinde SIFIR (F1 PASS, admin-assets dahil; canlı DOM taraması false): doğrudan `api.deepseek.com` çağrıları (dn aiChat, prox-asistan, ins DWG) → same-origin `POST /api/ai/generate {profile:'m1'|'m2'|'m3',messages,…} → {answer}`; model kimlikleri istemciden silindi (backend `PROX_RUNTIME_PROFILE` eşler); istemci sistem promptları söküldü (persona sunucuda); admin UI 'ProX Motor-1/2/3 · Görsel servisi'; BYOK depo alanları m1/m2/m3/mediaKey (yazım yalnız demo, üretimde vault: `/api/ai/keys`).
- Paketleyici SAĞLAYICI tarayıcısı (12 regex, case-insensitive) bulguda paketi DURDURUR. Pexels/Openverse atıfları lisans gereği korunur (THIRD-PARTY-NOTICES).
- storage-guard.js her üretim sayfasına enjekte: kurumsal anahtar yazımı no-op+telemetry (canlı kanıt: dn_brand/dn_firma engellendi, dn_lang serbest). Üyelik parolası üretimde tarayıcıda İŞLENMEZ (`/api/auth/user/register|login` dalı; demo'da yerel akış sürer). crmDataExport sır/parola-hash dışlar; proxCfgSave demo-gate.

## 7) SUNUCU/EDGE SÖZLEŞMESİ — BLOCKED 11 kriterin sahibi (teslimat #8/20)
Önceki URETIME-HAZIRLIK-RAPORU.md §6 geçerli + FAZ3 ekleri:
- `POST /api/ai/generate` (profil→model eşleme, vault anahtarları, kota, loglarda prompt/anahtar yok, persona enjeksiyonu server-side) · `GET /api/ai/media?q=` (lisanslı görsel proxy).
- `POST /api/auth/user/register|login` (Argon2id, HttpOnly oturum, rate-limit) — üyelik.
- `POST /api/v1/tenant/eids/verify` (Bakanlık entegrasyonu, fail-closed, audit; sandbox tenant'ları gerçek uca ASLA yönlendirilmez).
- Tenant public-config (`/api/v1/tenant/bootstrap`) FAZ3 §5 alan listesiyle genişletilir; secret/model/prompt public-config'e giremez.
- Yayın pipeline'ı (15 aşama, atomik+rollback) sunucu işidir; istemci karşılığı: config_version + deterministik üretim + son-sağlıklı-yayın koruması (dist).

## 8) Kabul matrisi — GERÇEK KOŞUCU ÇIKTISI (teslimat #10–15)
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
[PARTIAL] #10 insaat: tek H1 (statik sayım)
         0-H1:[] çok-H1:['index.html(6)'] (SPA-render H1'ler statik sayımda görünmez)
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
{'PASS': 34, 'PARTIAL': 4, 'BLOCKED': 11}

```
**Canlı kanıtlar (Chromium):**
- dn index (demo): 6/6 kart `DEMO` rozetli, 0 EİDS rozeti, NADAS satırı görünür.
- ins ilanlar (demo): 7/7 kart DEMO; detay overlay + disclaimer görünür; `RealEstateListing` LD BASILMADI; mahalle panelinde 3 `Temsilî · DEMO`.
- dist/danisman (üretim): `EMLAK_DEMO=false`; storage-guard kurumsal yazımı ENGELLEDİ (dn_brand→null), izinli tercih yazıldı; demo kartlar GİZLİ (0 — resmî ilan backend'den gelene dek boş vitrin = fail-closed); sağlayıcı DOM'da 0; dış istek 0; NADAS footer var.

## 9) Test fikstürleri (teslimat — §16)
`scripts/fixtures/tenant-fixtures.json`: 3 tamamen sentetik tenant (A construction/Bursa, B consultant/Antalya, C construction/Eskişehir) — sentineller `TENANT_A_ONLY_93K/B_61Q/C_47R`; farklı marka/unvan/il/ilçe/kategori/tema/paket/dil. Sentineller paketleyici YASAK listesinde: dist'e sızarsa paket DURUR (şu an 0). Staging'de gerçek izolasyon testi (host-spoof, cache-key) backend ister → BLOCKED listesinde.

## 10) Kalan riskler & açık eksikler (teslimat #20 — dürüst liste)
1. **11 BLOCKED kriter** (bootstrap-200, HttpOnly oturum, 404/301'ler, admin koruması, CSP, WebGL testi, SSR dilleri, klavye tam turu) — §7 sözleşmesiyle backend/edge'e.
2. PARTIAL×4: ins index çoklu-H1 (statik 6); üst-menü seti SPA-index varyantı (×2); admin FONKSİYON gövdeleri hâlâ public app.js/app-core.js içinde (markup/studio/engine ayrıldı; monolit bölme refactor'u ertelendi).
3. dn bespoke `ilanlar.html` kendi gömülü verisini kullanır (ilan-data ile senkron değil — ÖNCEDEN BERİ; kartları 'beklemede' gösterir, yanıltıcı rozet YOK).
4. dn hero'daki yetki-belgesi rozeti (`#eidsPublicBadge`) tenant beyanıdır (maskeli No 00…) — ilan doğrulaması değil; üretimde gerçek belge no'suyla beslenmesi tenant onboarding'ine bağlı.
5. Üretim vitrini resmî ilan gelene dek boştur (bilinçli fail-closed); 'yakında' iskeleti backend bootstrap'la doldurulmalı.
6. Demo fotoğraflarında kontrollü kütüphane: mevcut yerel img/ + Openverse-CC seti; ayrı 'tenant asset deposu' backend işi.
7. localStorage okumaları duruyor (yazım engelli) — üretimde temiz tarayıcı boş depo bulur; tam kaynak-HTML tenant üretimi (SSR) BLOCKED #18 kapsamında.
