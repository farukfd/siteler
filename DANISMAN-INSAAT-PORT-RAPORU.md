# Danışman + İnşaat Port Raporu
### gayrimenkul yeniliklerinin iki siteye taşınması — koddan doğrulanmış envanter & plan

> Yöntem: 28 maddelik kontrol listesi, iki paralel denetçi ajanla **dosya-dosya koddan** doğrulandı (bellekten değil). Tarih: Ağu 2026 · Referans: `feat/kurulum-sihirbazi` @ `52cdd6f`.

---

## 1) Kaynak: gayrimenkul'de yapılan yenilikler (özet envanter)

| Kategori | Yenilikler |
|---|---|
| Güvenlik | proxApi PROXY_MODE anahtar koruması · content-studio XSS (`_safeUrl`+`_saniInline`) · secrets→gitignore · admin uyarısı belgelendi |
| Performans | 133KB özdeş inline CSS→harici · 77KB admin markup lazy · Leaflet/Pannellum lazy · i18n sözlükleri koşullu (TR'ye 0 bayt) · defer'ler · görsel küçültme · hero LCP preload |
| SEO/AEO | Sayfaya-özgü JSON-LD ×8 · sitemap tamamlama · llms.txt · 8 güzel-URL ailesi · ov-pre derin-link kapısı |
| Parite/UI | 13 sayfa kanonik nav+footer · 5-dil seçici · akıllı sosyal gizleme · çalışan iletişim formu · prox-asistan footer düzeni · favicon marka+`?v` |
| Sihirbaz/WL | Ofis lat/lng+Nominatim geocode · döviz bandı aç/kapa · il-farkında blog/arşiv/harita/ekspertiz · ofis haritası FIRMA.lat/lng |
| Faz-1/2 | Kart karşılaştırma ⇄ · 🔔 kayıtlı arama+rozet · hesap-senkron favori/arama kancaları · canlı Google puanı |
| Renk | Mor sıfır · eski-mavi→marka göçü · WCAG kontrast · tema varsayılanı |

## 2) 🎁 Otomatik gelenler (shared modüller — sürümler normalize edildi, İKİ SİTEDE ZATEN AKTİF)

| Özellik | danışman | insaat |
|---|---|---|
| Pannellum lazy-yükleme motoru (extras v9) | ✅ aktif* | ✅ aktif* |
| Kayıtlı arama motoru (listings-page v2) | ⚠️ sayfa bespoke — motor devrede değil | ✅ **AKTİF** (mount doğrulandı) |
| Kart karşılaştırma ⇄ (listing v24) | ⚠️ bespoke kartlar — görünmüyor | ✅ **AKTİF** (kartlarda doğrulandı) |
| Hesap-senkron kanca altyapısı | 🔌 kanca hazır, tanım yok | 🔌 kanca hazır, tanım yok |
| İl-farkında harita (harita.js v5) · doviz.js gate | modül hazır, sayfada yok | modül hazır, sayfada yok |

\* statik `<script>` etiketleri hâlâ duruyor → silinince tasarruf gerçekleşir (Faz-0).

## 3) Site matrisleri (denetçi kanıtlarıyla)

### 3a. DANIŞMAN (13 sayfa) — genel durum: SEO/parite GÜÇLÜ, perf/kancalar eksik
**Zaten TAM (port gerekmez):** C1 sayfa-özgü JSON-LD 12/12 · C2 sitemap birebir · C3 llms.txt · D1 nav parite **bayt-bazında mükemmel** · D2 5-dil tutarlı · D4 çalışan iletişim formu · C4 "güzel URL" kavramı zaten mimaride (her özellik gerçek .html sayfası) · H1 mor sıfır · G1 5-dil motor.

| # | Boşluk | Kanıt | Efor |
|---|---|---|---|
| A1 | proxApi anahtar koruması **4/5 dosyada eksik** (ozel-portfoy:408, bolge-analizi:647, prox-asistan:204, lead.js:86) — admin gerçek anahtar girerse Network'te çıplak gider | kismi | küçük |
| A2 | content-studio **XSS yamasız eski sürüm** — gm dosyası kopyalanır | yok | küçük |
| D3 | `dnApplySocial` **hiç tanımlanmamış ölü guard** (app.js:520) — sosyal white-label sessiz no-op | yok | küçük |
| D5 | prox-asistan **aynı 100vh footer-ezme bug'ı** (gm'de düzeltilen desenin eski hali) | kismi | küçük |
| C5 | ov-pre derin-link kapısı yok — ≥480ms ana sayfa flash'ı | yok | küçük |
| B3 | 2 sayfada statik Pannellum (~66KB gereksiz) | kismi | küçük |
| B4 | i18n sözlükleri koşulsuz (hizmetlerimiz.js **114KB!**) — koşullu yükleme portu | yok | orta |
| B5 | Hiçbir sayfada `defer` yok (index head'de 9 bloklayıcı script) | yok | küçük |
| B1/B6/D6 | Yasal-sayfa CSS kopyası ~6.7KB · og-image.png 340KB→webp · favicon `?v` yok | kismi | küçük |
| E1-E4 | Sihirbazda lat/lng+geocode yok · döviz bandı yok · `topicPool` 12 konu **İstanbul/Boğaz-sabit** (il-farkında değil) · iletişim haritası **hardcoded Boğaz iframe** | yok | orta |
| F3/F4 | Hesap-senkron kancaları tanımsız (iki kopuk favori deposu: `dn_fav_<email>` ↔ listing detay) · Google puan rozeti yok | yok | küçük |
| F1/F2 | **En büyük iş:** ilanlar+ozel-portfoy kartları bespoke (`ilCard`, `_ozFxCard`) — `Listings.cardHTML`'e geçilirse karşılaştırma+kayıtlı arama otomatik gelir | yok | **büyük** |
| B2 | Admin, app.js (310KB) içinde runtime-üretim (~76KB admin kodu herkese iniyor) — bölme | kismi | orta |
| H2 | Admin'de tek gm-teal sızıntısı (İçerik Stüdyosu düğmesi) — lüks palete uyarlanır | kismi | küçük |

**Ek bulgular:** Lead teslimatı 3 paralel implementasyon (index SPA / lead.js / ozTalep) — A1'in kök nedeni; konsolidasyon önerilir.

### 3b. İNŞAAT (17 sayfa) — genel durum: SEO/işlev GÜÇLÜ, perf/kalıntı + sihirbaz-işlevsizliği sorunlu
**Zaten TAM:** C1 JSON-LD 17/17 · C2 sitemap 17/17 · C3 llms.txt · C4 **6 güzel-URL stub'ı zaten var** · D3 sosyal gizleme doğru · D4 uçtan-uca lead akışı · F1 **listings-page mount** · F2 **karşılaştırma aktif** · D6 marka-turuncu favicon · B6/B7 görsel+CSS temiz · G1 5-dil motor.

| # | Boşluk | Kanıt | Efor |
|---|---|---|---|
| **H1** | 🔴 **CANLI MOR**: `DURUM_COLOR['arsa-sahibi']=#7c3aed` + `SAAS_THEMES.Mor` (#6d28d9) — **mor yasak**, gm'de temizlendi burada duruyor | tam(mor var) | küçük |
| A1 | `EMLAK_PROXY_MODE=true` tanımlı ama proxApi **bayrağı hiç kontrol etmiyor** — koruma etkisiz | kismi | küçük |
| A2 | content-studio XSS yamasız eski sürüm | yok | küçük |
| B1 | **17 sayfada birebir 1571B kabuk** (25KB israf) + yasal sayfalarda ek özdeş bloklar → harici CSS | tam | orta |
| B2 | `#adminApp` **48.3KB = index'in %23.4'ü** her ziyaretçiye iniyor → gm lazy kalıbı | tam | orta |
| B3 | index+ilanlar'da statik Pannellum (~66KB) | kismi | küçük |
| B4 | i18n koşulsuz — `js/i18n/` **toplam 735KB** (soru-cevap.js tek başına 235KB!) → koşullu yükleme büyük kazanç | kismi | orta |
| B5 | brand.js 16 sayfada defer'siz | tam(sorun) | küçük |
| C5 | ov-boot sınıfı ekleniyor ama **CSS'i hiç yok** — derin-linkte flash | yok | orta |
| D1 | Statik footer 8/9 uyumlu AMA **dinamik parite kırık**: admin'den değişen telefon/adres/sosyal yalnız index'e yansıyor, 16 statik sayfa bayat kalıyor | kismi | orta |
| E1 | Sihirbazda lat/lng yok — ama admin İletişim panelinde **Leaflet tıkla-seç + Nominatim ZATEN VAR** → sihirbaza bağlamak kolay | yok | orta |
| E3 | 🔴 Sihirbazdaki **İl seçici tamamen dekoratif** — obFinish hiçbir yere yazmıyor; il değişse de içerik İstanbul-sabit | yok | orta |
| E4 | Konum `SETTINGS.mapQuery` hardcoded Levent — sihirbaz güncellemiyor | yok | orta |
| E2 | Döviz bandı yok (ilanlar/ozel-portfoy gayrimenkul içeriği taşıdığından anlamlı, opsiyonel) | yok | küçük |
| F3/F4 | Hesap-senkron kancaları tanımsız (kendi üyeliği `insaat_session_v1` var, bağlı değil) · Google puan yok | yok | küçük-orta |
| G2/temizlik | 16 sayfada **ölü 2-dilli select + nbLang/bzLang** kalıntıları (no-op) | kismi | küçük |

**Ek bulgular:** `SUNUCU-CLAUDE-NOTLARI.md`'de `prox_construction_***REDACTED-ROTATE***` izi — **rotasyon hatırlatması geçerli**.

## 4) Port Planı (önerilen fazlar)

| Faz | İş paketi | Site | Efor |
|---|---|---|---|
| **0 — Kritik/hızlı** (yarım gün) | İnşaat mor süpürme (H1) · A1 proxApi koruması (dn 4 dosya + ins 1) · A2 XSS'li content-studio kopyala (2 site) · B3 statik Pannellum sil (2 site) · dn D3 ölü sosyal guard→gerçek fonksiyon · dn D5 prox-asistan footer fix · dn H2 admin renk | ikisi | ~0.5g |
| **1 — Performans** (1 gün) | B5 defer (2 site) · B4 i18n koşullu yükleme (dn 13 + ins 17 sayfa; ins 735KB!) · ins B1 ortak kabuk→harici CSS · dn B1 legal.css · dn og-image webp · favicon `?v` | ikisi | ~1g |
| **2 — UI/işlev** (1 gün) | C5 ov-pre kapısı (2 site; ins'e CSS de) · F3 hesap-senkron kancaları (site-önekli: `dn_*`/`insaat_*`) · F4 Google puan rozeti (2 site) · dn E2 döviz bandı · ins D1 dinamik parite (applyContact→16 sayfa wl katmanı) | ikisi | ~1g |
| **3 — Sihirbaz/WL** (1 gün) | E1 lat/lng+geocode (ins: mevcut admin Leaflet'i sihirbaza bağla) · ins E3 il seçiciyi İŞLEVSELLEŞTİR + il-farkında içerik · E4 harita konum senkronu · dn E3 topicPool il-farkında | ikisi | ~1g |
| **4 — Büyük/isteğe bağlı** | dn F1/F2 kart-katmanı `Listings.cardHTML` geçişi (karşılaştırma+kayıtlı arama otomatik kazanılır) · B2 admin lazy bölme (2 site) · ins ölü 2-dil select temizliği | ikisi | 1-2g |
| Platform | A3 sunucu-taraflı admin auth (3 site birlikte, sunucu ekibi) · ProX anahtar rotasyonu (**sizde**) | — | — |

## 5) Mayınlar / riskler
- **İnşaat 3 header sistemi** (index app-core / 9 self-contained / ilanlar chrome.css) + kıpırdama-önleme kuralları — parite işleri sayfa-sayfa dikkat ister
- **Danışman lüks/gold palet KASITLI** — gm teal'i dayatılmaz; yalnız yabancı sızıntılar (H2) düzeltilir
- Danışman 3 paralel lead yolu — A1 düzeltirken konsolide etmek doğru an
- İnşaat dinamik parite (D1) çözümü wl-katmanı ister; statik sayfalara script eklemek "kıpırdama" kurallarıyla test edilmeli
- defer/koşullu-i18n script sıra-bağımlılıkları (dict→motor) her sayfada doğrulanmalı

## 6) Skor özeti

| | danışman | insaat |
|---|---|---|
| Zaten tam | 11 madde | 14 madde |
| Küçük efor | 10 | 7 |
| Orta efor | 5 | 7 |
| Büyük efor | 2 (F1/F2, A3) | 1 (A3) |
| Kritik | A1 anahtar koruması | **H1 canlı mor** + E3 işlevsiz il |
