# Meridyen Değerleme — SaaS Sunucu-Tarafı Geçiş Notları (Backend Ajanı İçin Handoff)

> **Amaç:** `degerleme/` çok-sayfalı SPK-lisanslı gayrimenkul değerleme sitesini **gerçek çok-kiracılı (multi-tenant) white-label SaaS**'a taşıyacak sunucu-tarafı ajan için eksiksiz rehber. İnşaat sitesinden (bkz. `../SAAS-SUNUCU-NOTLARI.md`) **daha ileri** bir yapı: publish pipeline, degMerge, i18n, ProX API entegrasyonu zaten mevcut. **Frontend'i baştan yazma — mevcut apply/publish boru hattını sunucuya bağla.**

---

## 0. TL;DR — Öncelik sırası
1. 🔴 **Admin auth sunucuya** — şu an client'ta düz-metin (`admin/1234`, `deg_admin.auth`). GÜVENLİK AÇIĞI.
2. 🔴 **Per-tenant config depolama** — `deg_admin` (localStorage) + `site-config.json` (tek dosya) → tenant başına DB/objede.
3. 🟠 **Tenant çözümleme** — domain/subdomain → tenant_id → doğru config + `EMLAK_TENANT.tenant_id/tenant_key` (ProX).
4. 🟠 **Lead/başvuru verisi sunucuya** — başvuru formu (basvuru.html) → POST endpoint + DB.
5. 🟠 **SPK lisans/künye doğrulama** — her tenant kendi SPK lisans no + künyesini girer; **yasal olarak kritik** (yanlış lisans no gösterimi hukuki risk).
6. 🟡 **Medya (logo/favicon) object storage** — base64 dataURL yerine URL.
7. 🟡 **ProX/DeepSeek anahtarları sunucuda** — client'ta password input, ama SaaS'ta tenant_key sunucu-tarafı proxy'den geçmeli.

---

## 1. Mevcut Mimari (bu site inşaattan İLERİ)

- **24 statik HTML** (`index/hizmetler/iletisim/basvuru/blog/kvkk/...`) + **paylaşımlı** `assets/js/degerleme.js` (inline kaynağı — sayfalara gömülü), `assets/css/degerleme.css`, `assets/i18n/{tr,en,ru,zh,ar}.json`, `assets/data/site-config.json`, `assets/data/content-map.json`, `assets/data/faq/*.json`.
- **İki admin:** (a) `admin.html` (ProX CRM, tam yönetim); (b) sayfa-içi gömülü panel `window.openDegAdmin()` / **`#yonetim` hash** / `openDegAdmin()` (giriş admin/1234). İkisi de aynı `localStorage.deg_admin` JSON'una yazar.
- **Config anahtarları (localStorage):** `deg_admin` (tam config), `deg_lang` (dil).
- **`deg_admin` şeması:** `{auth{user,pass}, staff[], articles[], pages{}, content{}, contact{firma,tel,whatsapp,email,adres,saat,harita}, social{facebook,instagram,x,linkedin,youtube,nsosyal}, theme, favicon, metaTitle, metaDesc, proxPrompt, spkLicense, logoHeader(dataURL), logoFooter(dataURL), seo{ga4,gtm,adsId,adsense,gsc,bing,yandex,robotsIndex,headCode}, proxKey, deepseekKey}`.

## 2. Apply / Publish Boru Hattı (KORU — SUNUCUYA BAĞLA)

**Public runtime apply fonksiyonları** (`assets/js/degerleme.js`, sayfa init'inde `degMerge()` okur):
| Fonksiyon | Ne yapar |
|---|---|
| `degApplySeo()` | GA4/GTM/Ads/AdSense/doğrulama meta/robots + headCode → `<head>` (crm'de çalışmaz) |
| `degApplyLogo()` | `.brand .mk` → logoHeader/logoFooter görseli |
| `degApplyWhatsApp()` | tüm `a[href*=wa.me]` → `contact.whatsapp` (?text korunur) |
| `degSpkApply()` | `.spk-lic` → `spkLicense` |
| `degContactApply()` | iletişim/adres/harita alanları |
| `degContentApply()` | `data-ce` işaretli metinler → `content{}` |
| `degApplySocial()` | footer `.fsocial` + portal linkleri → `social{}` |
| `degApplyLang()` | i18n (metin-düğümü tabanlı; `_i18n[lang]`, assets/i18n/*.json) |

**`degMerge()` = `Object.assign({}, DEG_PUBLISHED, localStorage.deg_admin)`** — ziyaretçi yayınlananı görür, admin localStorage'ı üste yazar (canlı önizleme). **Bu desen SaaS için ideal:** `DEG_PUBLISHED`'ı sunucudan gelen tenant config'iyle doldur.

**Publish akışı (mevcut):** Admin → "Yayınla" → public-safe config'i `site-config.json` olarak İNDİRİR (gizli hariç: proxKey/deepseekKey/auth/staff/leads) → dosya `assets/data/`'ya konur → ziyaretçi fetch eder → `window.DEG_PUBLISHED`. `bun tools/apply-config.mjs` SEO'yu ham HTML'e gömer (idempotent, `<!--deg-seo-start/end-->`).

> **En temiz sunucu entegrasyonu:** `DEG_PUBLISHED`'ı statik `site-config.json` yerine `GET /api/pub/:domain`'den doldur. "Yayınla" → dosya indirme yerine `POST /api/tenant/:id/publish`. `deg_admin` okuma/yazma → `GET/PUT /api/tenant/:id/config`. Feature-flag: `if(window.__SAAS_API){fetch(...)}else{localStorage...}`.

## 3. ProX API — SaaS için hazır avantaj
- `window.degAi(prompt, system)` → `proxApi('/api/v1/tenant/prox/ai')`, `X-Tenant-Key = deg_admin.proxKey`, `X-Tenant-Id = EMLAK_TENANT.tenant_id`. Kota/hata → kullanıcı DeepSeek anahtarına düşer.
- `degApplyApiKeys()` proxKey'i `EMLAK_TENANT.tenant_key`'e yazar.
- **SaaS'ta:** tenant_id/tenant_key sunucudan (session'dan) enjekte edilmeli; client'ta proxKey tutulmamalı → **anahtarları sunucu-tarafı proxy arkasına al** (client sadece kendi session'ıyla `/api/ai` çağırır, sunucu tenant_key ekler).

## 4. Önerilen Sunucu Mimarisi

### 4.1 Veri modeli
```
tenants          (id, domain, plan, spk_license_no, status, created_at)
tenant_config    (tenant_id, json)          -- deg_admin public-safe eşdeğeri
tenant_secrets   (tenant_id, prox_key, deepseek_key, admin_pass_hash)  -- ASLA client'a gitmez
tenant_media     (tenant_id, kind, url)     -- logoHeader/logoFooter/favicon → S3/R2 (dataURL DEĞİL)
tenant_staff     (tenant_id, ...)           -- personel
articles         (id, tenant_id, ...)       -- blog
leads            (id, tenant_id, ad, tel, email, varlik_turu, amac, dosya_no, created_at, meta)
publish_snapshots(tenant_id, json, published_at)
```

### 4.2 API uçları
```
POST /api/auth/login          → JWT/httpOnly cookie (deg_admin.auth admin/1234 KALDIR)
GET  /api/tenant/:id/config   → degMerge için tenant config (secrets HARİÇ)
PUT  /api/tenant/:id/config   → admin kaydet (auth+sahiplik)
POST /api/tenant/:id/publish  → snapshot + cache invalidation
POST /api/tenant/:id/media    → logo/favicon upload → URL
GET  /api/pub/:domain         → public snapshot (DEG_PUBLISHED, cache'lenebilir, secrets yok)
POST /api/lead                → başvuru formu (rate-limit + validasyon)
POST /api/ai                  → ProX proxy (sunucu tenant_key ekler; client key görmez)
```

### 4.3 Güvenlik (KRİTİK — yasal boyut var)
- 🔴 `deg_admin.auth` (admin/1234) **kaldır** → sunucu-tarafı auth. `degAuth()`/giriş modalını `/api/auth/login`'e bağla.
- 🔴 **SPK lisans no / künye tenant-doğrulamalı olmalı** — her tenant kendi geçerli SPK lisansını girer; yanlış/başkasının lisansını gösterme **hukuki risk**. Provisioning'de lisans no doğrula, `.spk-lic` + künye sunucu config'inden.
- 🔴 `seo.headCode` + `ADS` **keyfi script enjekte ediyor** → XSS/tenant izolasyonu riski. Sanitize / CSP / sadece doğrulanmış admin.
- proxKey/deepseekKey **client'tan çıkar** → sunucu proxy.
- Lead formu: CAPTCHA + rate-limit + sunucu validasyon.

## 5. Migration Adımları
1. **Auth** → `/api/auth/login`; client şifre kaldır.
2. **Config read** → init'te `DEG_PUBLISHED = GET /api/pub/:domain`; `deg_admin` admin oturumunda `GET /api/tenant/:id/config`.
3. **Config write** → "Yayınla"/kaydet → `PUT/POST` uçları (dosya indirme yerine).
4. **Media** → logo upload → object storage URL (base64 kaldır).
5. **Leads** → başvuru → `POST /api/lead`.
6. **ProX** → `/api/ai` proxy; client'tan tenant_key kaldır.
7. **Provisioning** → yeni tenant: kayıt + SPK lisans doğrulama + varsayılan config seed (mevcut default'lar).
8. **i18n** → assets/i18n/*.json tenant-bağımsız (çeviriler ortak); tenant metinleri content{} üzerinden.

## 6. Frontend Gerçekleri / Tuzaklar (backend'in bilmesi gereken)
- **degMerge = published + localStorage** — apply fonksiyonları bundan okur. SaaS'ta published'ı sunucu doldurur; admin localStorage canlı-önizleme kalabilir.
- **i18n metin-düğümü tabanlı** (`_collect`+`nodeValue`, TR kaynak metin = anahtar). Dinamik DOM değişimi (ör. `degNedenBiz` yeşil "?" kutusu) çeviri anahtarını kırar → `_i18n[lang]` sözlüğünden çeviri türet. SSR'de dikkat.
- **Chrome (header/footer/menü) 24 sayfada BYTE-ÖZDEŞ**, `sync-chrome→inline-assets` boru hattıyla senkron (bkz. [[degerleme-altin-kural]]). Sayfa eklerken/değiştirirken tüm sayfalara uygula.
- **Gömülü admin panel her public sayfada** (`openDegAdmin`, `#yonetim`); `admin.html` ayrı CRM. İkisi de `deg_admin`'e yazar → sunucuda tek config kaynağı.
- **`.crm-app`/`body.crm`** sayfalarında degMobileNav/degApplySeo çalışmaz (guard). 
- **apply-config.mjs** SEO'yu ham HTML'e gömer (`__DEG_BAKED=1` → degApplySeo erken return). Logo/WhatsApp/SPK/içerik runtime'da kalır.
- Node kurulu değil (bun var). Yerel önizleme: `python3 -m http.server 8799` → `localhost:8799/degerleme/`.

## 7. WHITE-LABEL HARDCODED EKSİKLER (statik-analiz ile doğrulandı, dosya:satır)

### 7a. Hızlı client-side kazanımlar (sunucu GEREKMEZ — hemen düzeltilebilir)
- **[BUG] `degContactApply` `degMerge()` yerine `degAdminLoad()` okuyor** — `degerleme.js:365` — iletişim bilgisi (firma/tel/mail/adres/saat/harita) **yalnız yöneticinin tarayıcısında** görünür; publish'e girse bile ziyaretçilerde uygulanmaz. **Fix:** `degAdminLoad()`→`degMerge()` (degApplySocial'da yapıldığı gibi). _(Bu oturumda uygulandı.)_
- **[BUG] `social` publish listesinde yok** — `admin.html:1361` — kiracının sosyal linkleri ziyaretçide görünmez, Meridyen defaultları kalır. **Fix:** publish listesine `social` ekle. _(Bu oturumda uygulandı.)_

### 7b. Admin alanı EKLENMESİ gereken (firma-özel, şu an değişmiyor)
- 🔴 **Kurumsal künye (Vergi No / MERSİS / Ticaret Sicil) — admin alanı YOK** — `bilgi-toplumu.html:1063-1069`, `surekli-bilgilendirme.html` metni *"— (yönetim panelinden güncellenir)"* diyor **ama panelde karşılığı yok** → yasal-zorunlu bilgi hiçbir kiracı için doldurulamıyor. **Fix:** admin'e künye alanları (`content.mersis/vergiNo/ticaretSicil`) + `data-ce` bağla + publish'e al.
- 🟠 **Firma adı + footer copyright hardcoded** — header/footer marka metni (`index.html:~1034`), footer `© 2026 Meridyen Gayrimenkul Değerleme A.Ş.` (`index.html:1312`, 23 sayfa). `degContactApply` firma adını yalnız iletişim sayfası `#ctFirma`'ya yazar; header/footer/copyright'a DOKUNMAZ (logo yüklenince marka metni sadece *gizlenir*, `degerleme.js:663`). **Fix:** marka+copyright'a `.brand-name`/`.ft-firma` sınıfı ver, degContactApply yamalasın.
- 🟠 **Firma-özel istatistikler sabit** — `neden-biz.html:1141-1144,1214-1234` (`2005'ten beri`, `500M+ veri`, `81 il`, `47 hizmet`, `20 yıl`) `data-ce` DEĞİL → her kiracı Meridyen rakamlarını gösterir. **Fix:** `data-ce` yap / config'ten besle.
- 🟠 **SPK Lisans No `DD-2024-0142` admin placeholder'ı da Meridyen numarası** — `admin.html:1357,1373` — boş bırakılırsa Meridyen no kalır; ayrıca `sertifikalar.html:1061`, `bilgi-toplumu.html:1061` düz metin (`.spk-lic` sınıfı yok). **Fix:** placeholder'ı jenerik yap; `.spk-lic`'i tüm geçtiği yerlere uygula. _(Yasal risk: yanlış lisans no gösterimi.)_
- 🟠 **Kanonik URL / og:url / Schema.org domain gömülü** — `index.html:8` canonical `emlakekspertizi.com/degerleme/`, `index.html:17` Schema.org `name:"Meridyen..."`, her sayfada. **Fix:** apply-config.mjs canonical domain + schema firma adını config'ten üretsin.
- 🟡 **Yetki rozetleri (BDDK/SPK/TDUB/SPL/LİDEBİR)** footer'da statik SVG — tenant hepsine üye olmayabilir → admin'den aç/kapa gerekebilir.
- 🟡 **`proxPrompt`, `articles` (blog) publish edilmiyor** — `admin.html:1361` listesinde yok (blog zaten ProX API'den geldiği için tutarlı, ama not).

### 7c. Kod ikizlenmesi (bakım riski)
- `admin.html` JS'i `degerleme.js`'in **kopyası** (`degContactApply`/`degMerge`/`degApply*` iki yerde). **Fix:** admin.html paylaşılan `assets/js/degerleme.js`'i import etsin, kopyalamasın.

---
*Bu doküman client-side white-label sürümün yanında bırakılmıştır. Frontend hazır ve doğrulanmış; sunucu-tarafı bu plana göre inşa edilmelidir. İnşaat karşılığı: `../SAAS-SUNUCU-NOTLARI.md`.*
