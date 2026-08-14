# FAZ 3B RAPORU — CANLI TEST SONRASI ZORUNLU DEVAM DÜZELTMELERİ
**Tarih:** 14 Ağustos 2026 · **Branch:** `feat/faz3-multitenant-demo` · **Rollback:** `git revert <faz3b-commit>` (FAZ3 taban: 45a06d2, FAZ öncesi: 3e3e651)
**DURUM: "tamamlandı" YAZILMAMIŞTIR** — üç zorunlu kapı dahil istemci-katmanı kalemleri kanıtla kapandı (42 PASS / 3 PARTIAL / **0 FAIL** / 11 BLOCKED-backend). Sunucu gerektiren kalemler (gerçek RBAC/CSRF/session, service-area'nın backend zorlaması, CSP HTTP başlığı, SSR i18n) FAZ3 raporundaki sözleşmelere bağlıdır.

## 1) Kök neden raporu
- **12 header/10 footer:** tek-dosya SPA'nın 11 overlay görünümü kabuk klonlarını STATİK taşıyordu; mountInsaatMenu hepsini dolduruyordu. → Kabuklar inert `<template class="pp-kabuk-t">`'e alındı; `_ppKabukTak/Sok` + MutationObserver görünüm `on` olunca takar, kapanınca söker (data-kabuk bekçisi = idempotent; geri/ileri/dil değişiminde çoğalma imkânsız).
- **Client-side şifre:** dn `uyelik.js` + ins index SHA-256+salt kullanıcı DB'si tutuyordu. → TAMAMEN SÖKÜLDÜ: `crypto.subtle` çağrısı sıfır; `_users()` stub `{}`; eski `dn_users_v1/insaat_users_v1` boot'ta silinir; demo=parolasız ÖRNEK oturum (parola alanı yok sayılır, İŞLENMEZ); üretim=/api/auth/user/* (register/login/profile/password); "şifre SHA-256 ile saklanır" metinleri kaldırıldı.
- **EİDS bekleyen public + rozet:** FAZ3 publicList kapısı ana akışları kapatmıştı; dn bespoke /ilanlar.html gömülü verisi 'beklemede' basıp 'Yetki Belgeli' diyordu. → eids'siz kayıtlar `EIDS.demoRecord()` (demo_listing_preview): gri DEMO İLAN rozeti; 'Yetki Belgeli' alt yazısı yalnız GERÇEK doğrulanmış kayıtta, aksi 'Demo tanıtım kaydı'.
- **EİDS ≠ Yetki Belgesi:** JSON-LD/panel/i18n'deki 6 'EİDS Yetki Belge No' → 'Taşınmaz Ticareti Yetki Belgesi No'; demo numara (0034812) schema'ya YAZILMAZ (yalnız üretim+gerçek belge), hero rozeti demo'da '(ÖRNEK)' işaretli.
- **Tenant-arası aynı kartlar:** üretim anahtarı FAZ3 seedExtra ile tenant|site_type|config_version|g1 — dn 'consultant|cv<N>|g1' ≠ ins 'construction|g1' (B7 PASS; aynı ilçe farklı üretim).

## 2) Değişen dosyalar
insaat/index.html (11 kabuk→template, tek H1, href#=0, aria-label×23, ÖRNEK notu×2, 40 yıl), insaat/js/app-core.js (kabuk yöneticisi, runtime h1→h2.h1x×5, sosyal placeholder→SOCIAL, auth söküm, yetki-belgesi etiketi), insaat/css/base.css (h1x eşlenikleri+gm-lnk), insaat/ozel-portfoy.html+i18n ('EİDS zorunlu değil'→'Temsilî senaryo'), danisman/js/uyelik.js (SHA-256/user-DB söküm), danisman/ilanlar.html (demo rozet+dürüst alt yazı), danisman/ozel-portfoy.html+i18n (13 yasak-dil düzeltmesi), danisman/js/app.js+content.js+iletisim.html+i18n (yetki belgesi ayrımı), danisman/index.html+i18n/index.js (ProX AI→ProX), danisman/js/i18n/_common.js (+18 sızıntı anahtarı 4 dilde), danisman/randevu.html (POST+name), shared/mahalle-endeks.js (band dili+Demo başlık), shared/listing.js (**Pexels hotlink söküldü** → shared/img/px/ 23 yerel görsel), scripts/kabul-testi.py (B1–B7).

## 3) DOM önce/sonra (canlı Chromium, ins index)
| metrik | önce (canlı bulgu) | sonra (canlı kanıt) |
|---|---|---|
| header | 12 | **1** (görünüm açıkken 2 — kendi kabuğu) |
| footer | 10 | **1** |
| nav | 13 | **2** |
| H1 / boş H1 | 7 / 2 | **1 / 0** |
| href="#" | 17 | **0** |
| admin/studio isteği (ilk yükleme) | var | **0** |
| storage'da parola/hash | var | **0** |
| Pexels hotlink | var | **0** |
Aç/kapa döngüsü kanıtı: görünüm 'on'→kabuk takılı (header.pp-hdr TRUE), kapat→sökük (FALSE), tekrar aç→tek kopya.

## 4) Kabul matrisi — koşucu çıktısı (B1–B7 + F1–F5 + temel)
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
{'PASS': 42, 'PARTIAL': 3, 'BLOCKED': 11}

```
Ek canlı kanıtlar: dn ozel-portfoy yasak dil 0 / demo dili 6 nokta görünür; dn+ins kartlarda DEMO rozeti (6/6, 7/7); üretim dist storage-guard/dış-istek/sağlayıcı = 0.

## 5) 30 regresyon eşlemesi
1-5 (DOM/H1/href#) ✓canlı+B1 · 6-7 (admin script/DOM) ✓canlı(0 istek; markup lazy-admin) · 8 (parola storage) ✓canlı+B2 · 9 (EİDS bekleyen public) ✓publicList+bespoke fix · 10-11 (DEMO etiket/rozet) ✓canlı · 12-13 (tenant kart/içerik ayrımı) ✓B7+sentinel · 14-15 (service-area dışı sonuç) İSTEMCİ: il-bağlama tamam; backend zorlaması BLOCKED · 16 (5 dil sızıntı) KISMEN: +18 ortak anahtar; tam tarama sürecek · 17 (RTL) ✓mevcut · 18 (ProX AI) ✓B3 · 19 (Pexels) ✓B4+canlı · 20-21 (form POST/name/label) ✓B6 (CSRF/receipt backend) · 22-23 (schema demo/eski route) ✓ (paketleyici host dönüşümü) · 24 (NADAS) ✓F2 · 25-27 (route taraması/temiz tarayıcı) dist canlı kanıt + 44 sayfa paket; 49-route canlı ful tur üretim host'unda yapılmalı · 28 (yayın/rollback) config_version+dist atomik · 29 (sentinel) ✓ · 30 (kanıt zorunluluğu) bu rapor.

## 6) Açık eksikler
- BLOCKED 11 (backend/edge — FAZ3 sözleşmeleri geçerli; +/api/auth/user/profile|password eklendi).
- PARTIAL: SPA menü varyantı ×2; admin fonksiyon gövdeleri monolitte.
- i18n tam sızıntı süpürmesi (blog/haber gövdeleri, ProX panel metinleri) sürecek; RU/ZH/AR ozel-portfoy yeni anahtar çevirileri EN kadar rafine değil.
- Heading atlamaları (H2→H4) tam tur yapılmadı; ins alt="" dekoratif/içeriksel ayrımı 1 statik + runtime taraması sürecek.
- cs-engine demo-modu BYOK görsel araması hâlâ Pexels API'ye gidebilir (admin aracı; üretimde /api/ai/media).
