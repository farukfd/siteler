# SAAS Sunucu-Tarafı Geçiş Notları (Backend Ajanı İçin Handoff)

> **Amaç:** `insaat.html` + `neden-biz.html` şu an **tek-dosya, client-side, white-label** bir tanıtım sitesi. Tüm admin/CMS verisi tarayıcının `localStorage`'ında tutuluyor. Bu doküman, siteyi **gerçek çok-kiracılı (multi-tenant) SaaS**'a taşıyacak sunucu-tarafı ajan için mevcut mimariyi, veri modelini ve yapılması gerekenleri eksiksiz anlatır. **Frontend'i baştan yazma — mevcut apply/publish boru hattını sunucuya bağla.**

---

## 0. TL;DR — Sunucuda yapılacaklar (öncelik sırası)
1. 🔴 **Admin kimlik doğrulama sunucuya** (şu an şifre client'ta düz metin: `SETTINGS.admPass='meridyen2026'` — GÜVENLİK AÇIĞI).
2. 🔴 **Config kalıcılığı sunucuya** (localStorage → tenant başına DB kaydı). `saveAll()`/`loadAll()`/`publishConfig()` fonksiyonlarını API çağrılarına köprüle.
3. 🟠 **Tenant çözümleme** (domain/subdomain → tenant_id) ve config'i sunucudan enjekte (SSR veya boot-time fetch).
4. 🟠 **Lead/form verisi sunucuya** (şu an `LEADS` localStorage'da — POST endpoint'e gönder).
5. 🟡 **Medya (logo/favicon) sunucu depolamaya** (şu an base64 dataURL localStorage'da — object storage'a).
6. 🟡 **SEO/SSR** (overlay içeriği + FAQ JSON-LD sunucuda render edilirse arama motoru taraması güçlenir).

---

## 1. Mevcut Mimari (client-side)

- **Tek HTML dosyası** (`insaat.html`, ~6000+ satır): inline `<script>` + `<style>`. Tam-ekran overlay "sayfalar" (`#projelerPage`, `#hizmetlerPage`, `#bolgePage`, `#svcDetail`, `#pjDetail`, `#iletisimPage`, `#docPage`, `#faqPage`) + admin paneli (`#adminApp`, z-index 200).
- **`neden-biz.html`**: ayrı dosya, kendi sınırlı JS'i; insaat.html'in `PUB_KEY` config'ini okur.
- Preview: `python3 -m http.server 8799` → `http://localhost:8799/insaat.html`. Admin: `#admin` (demo şifre `meridyen2026`).

### Config nesneleri (JS global, `insaat.html` içinde)
| Nesne | İçerik | Tanım satırı (yaklaşık) |
|---|---|---|
| `BRAND` | `{logo, logoFooter, favicon, name, name2}` (logo/favicon = base64 dataURL) | ~2456 |
| `MENU` | üst/mobil menü metinleri `{hizmetler,nedenBiz,projeler,bolge,giris,teklif}` | ~2457 |
| `FOOT` | footer metinleri `{desc,colKurumsal,colHizmetler,colIletisim,adres,tel,email,copyright}` | ~2458 |
| `ADS` | `{head, body}` — reklam/analytics script enjeksiyonu | ~2459 |
| `SOCIAL` | `{facebook,instagram,x,linkedin,youtube,nsosyal,sahibinden,hepsiemlak,emlakjet}` (URL'ler) | ~2459 |
| `SETTINGS` | admin şifre, Google (GA/GSC), `waNumber`, meta, firma künye (unvan/vergi/mersis/adres/tel/email/kep/oda/ticaretSicil), `mapQuery`, `firmaCalisma`, `statYil/statKonut/statProje/statSantiye/statAlan`, `certChips[]` | ~2444 |
| `I18N` | `{tr:{}, en:{}}` — kaynak-metin-anahtar çeviri override'ları | ~2716 |
| `FAQ_DATA` | 273 obje `[{c,q,a}]` — İnşaat Soru-Cevap | `FAQ_DEFAULT`'tan türetilir |
| `PROJECTS/SERVICES/LEADS/ARSALAR/CONTRACTS` | proje/hizmet/müşteri/arsa/sözleşme verisi | çeşitli |

### localStorage anahtarları (SABİT — çok-kiracılık riski burada)
| Anahtar | İçerik | Yazan/Okuyan |
|---|---|---|
| `meridyen_site_v1` (`STORE_KEY`) | **Tam ağır config**: `{PROJECTS,SERVICES,LEADS,ARSALAR,CONTRACTS,SETTINGS,BRAND,MENU,FOOT,ADS,I18N,SOCIAL,FAQ,CONTENT,THEME,savedAt}` | `saveAll()` yazar, `loadAll()` okur |
| `meridyen_pub_v1` (`PUB_KEY`) | **Yayınlanan lean config** (sayfalar-arası): `{BRAND,MENU,FOOT,I18N,SEO{title,desc,ga,gsv,wa},ADS,SOCIAL,CONTACT{tel,email,adres,wa,calisma},at}` | `publishConfig()` yazar, neden-biz.html + overlay'ler okur |
| `meridyen_lang` | aktif dil (`tr`/`en`) | `applyLang()` |

> ⚠️ **Sorun:** Anahtarlar sabit. localStorage origin-scoped olduğu için "her müşteri = ayrı domain" ise çakışma YOK. Ama: (a) aynı origin'de birden çok tenant test edilirse config karışır; (b) config cihaz/tarayıcıya bağlı — admin başka cihazdan girince BOŞ; (c) merkezi yedek/senkron yok. **SaaS için config sunucuya taşınmalı.**

---

## 2. Apply / Publish Boru Hattı (DEĞİŞTİRME — SUNUCUYA BAĞLA)

Frontend, config'i DOM'a uygulayan saf fonksiyonlara sahip. Sunucu-tarafı geçişte bu fonksiyonlar KORUNUR; sadece config'in KAYNAĞI (localStorage → API) ve KALICILIĞI (localStorage → DB) değişir.

**Apply fonksiyonları** (config → DOM), hepsi `mountInsaatMenu()` içinde `window.load`'da çağrılır:
- `applyBrand()` — logo/isim/favicon.
- `applyMenuText()` — nav/mnav/footer/dock metinleri (dil-duyarlı).
- `applyContactAll()` — **WhatsApp (tüm `a[href*="wa.me/"]`) + iletişim kartı tel/mail/adres** `SETTINGS`'ten.
- `applyStats()` / `applyCerts()` — istatistikler (`data-stat` hook'ları) + sertifika çipleri.
- `applySocial()` — footer sosyal + ilan portali linkleri.
- `applyGoogle()` / `applyAds()` — GA/GSC + reklam script enjeksiyonu.
- `applyFaqSeo()` — FAQ'tan FAQPage JSON-LD (`#faqLd`) üretir.
- `applyLang(lang)` — i18n (kaynak-metin-anahtar; `data-ik`/`data-io`).
- `_brandSubst(str)` — marka adı/firma e-postasını docPage + FAQ + JSON-LD'de dinamik ikame (varsayılanda no-op).

**Kalıcılık fonksiyonları (BUNLARI KÖPRÜLE):**
- `saveAll()` → şu an `localStorage.setItem(STORE_KEY, ...)` + `publishConfig()` + `flashSaved()`. **Sunucuda:** `PUT /api/tenant/:id/config` (tam config) + optimistic UI.
- `loadAll()` → şu an `localStorage.getItem(STORE_KEY)`. **Sunucuda:** boot'ta `GET /api/tenant/:id/config` sonucunu global nesnelere `Object.assign` et (fonksiyon zaten bu deseni kullanıyor).
- `publishConfig()` → şu an lean config'i `PUB_KEY`'e yazar. **Sunucuda:** `POST /api/tenant/:id/publish` — yayınlanan sürümü CDN/edge cache'e yaz; public sayfalar bunu okur.

> **En temiz entegrasyon:** `saveAll`/`loadAll`/`publishConfig` gövdelerini feature-flag'li yap: `if(window.__SAAS_API){ fetch(...) } else { localStorage ... }`. Böylece demo (localStorage) + prod (API) tek kod tabanında yaşar.

---

## 3. Önerilen Sunucu Mimarisi

### 3.1 Tenant çözümleme
- `meridyenyapi.com`, `acmeinsaat.com` → CNAME → SaaS edge. Edge, `Host` header'dan `tenant_id` çözer.
- Veya subdomain: `acme.senin-saas.com`.
- Boot'ta sayfaya `window.__TENANT_ID` + `window.__SAAS_API='/api'` enjekte et (SSR ya da `<script>` header).

### 3.2 Veri modeli (öneri)
```
tenants        (id, domain, plan, created_at, status)
tenant_config  (tenant_id, key, json)   -- key: 'brand'|'menu'|'foot'|'ads'|'social'|'settings'|'i18n'|'faq'|'content'
                                          -- ya da tek satır json (küçükse)
tenant_media   (tenant_id, kind, url)    -- logo/favicon → object storage (S3/R2), dataURL DEĞİL
leads          (id, tenant_id, ad, tel, konu, kaynak, created_at, meta json)
admin_users    (id, tenant_id, email, password_hash, role)   -- bcrypt/argon2; client-side şifre KALDIR
publish_snapshots (tenant_id, json, published_at)             -- yayınlanan lean config; public read
```

### 3.3 API uçları (minimum)
```
POST /api/auth/login            → JWT/session (SETTINGS.admPass'ı DEĞİŞTİRİR)
GET  /api/tenant/:id/config     → loadAll() için tam config
PUT  /api/tenant/:id/config     → saveAll() (auth gerekli)
POST /api/tenant/:id/publish    → publishConfig() → snapshot + cache invalidation
POST /api/tenant/:id/media      → logo/favicon upload → URL döner (BRAND.logo = URL)
GET  /api/pub/:domain           → public lean config (PUB_KEY eşdeğeri, cache'lenebilir)
POST /api/lead                  → form gönderimi (LEADS localStorage yerine)
```

### 3.4 Güvenlik (KRİTİK)
- 🔴 `SETTINGS.admPass` **tamamen kaldır** — auth sunucuda, JWT/httpOnly cookie. `admLogin()` fonksiyonunu `POST /api/auth/login`'a bağla.
- Config yazma uçları auth + tenant sahiplik kontrolü ister.
- `ADS.head`/`ADS.body` **keyfi script enjekte ediyor** (XSS/tenant-izolasyon riski) — sanitize et veya CSP + sandboxed iframe ile izole et, en azından sadece güvenilir admin yazabilsin.
- Lead formu: rate-limit + CAPTCHA + sunucu-tarafı validasyon.

---

## 4. Migration Adımları (önerilen sıra)
1. **Auth**: `admLogin()` → API; client şifreyi kaldır. (Tek başına deploy edilebilir.)
2. **Config read**: `loadAll()` boot'ta `GET /api/tenant/:id/config` çeksin (localStorage fallback kalsın).
3. **Config write**: `saveAll()` → `PUT`; `publishConfig()` → `POST /publish`.
4. **Media**: `brandUpload()` (base64) → `POST /media` (URL). `BRAND.logo/favicon` artık URL.
5. **Leads**: `submitLead()` → `POST /api/lead` (localStorage yedek olarak kalabilir).
6. **Tenant provisioning**: yeni müşteri → tenant kaydı + varsayılan config seed (mevcut default nesneler seed olur).
7. **SSR/SEO** (opsiyonel, ileri): overlay + FAQ içeriğini sunucuda render et; JSON-LD'yi HTML'e statik göm (şu an JS enjekte — Googlebot JS render eder ama SSR daha güçlü).

---

## 5. Dikkat Edilecekler / Tuzaklar (frontend gerçekleri)
- **Overlay'ler bağımsız scroll kabı** (`position:fixed;overflow-y:auto`). Global öğeler (`#totop`) aktif-kaydırıcıyı algılar (`_totopScroller`). SSR'de bu davranışı bozma.
- **Admin `.adm-side` desktop'ta `overflow-y:auto`** (`@media(min-width:761px)`), `.adm-dash` `grid-template-rows:minmax(0,1fr)` ile viewport'a hapsedilir — sidebar çok butonlu, bunu koru.
- **`data-stat` hook'ları** (`yil/konut/proje/santiye/alan`) hero + statsband (homepage + hizmetler) + badge'de; `applyStats` bunları besler. statsband `data-count` animatörü (rAF) değeri sayar.
- **`_brandSubst`** varsayılan markada no-op (regex "Meridyen Yapı" → BRAND.name). Sunucuda tenant markası set edilince otomatik çalışır.
- **`neden-biz.html` AYRI DOSYA** — insaat.html JS'ini çalıştırmaz, kendi `PUB_KEY` okuyucusu var. Menü/marka değişince elle senkron gerekir (ya da ortak partial'a çıkar). Server-side'da her iki dosya da aynı tenant config'i tüketmeli.
- **i18n** kaynak-metin-anahtar (gettext benzeri): `applyLang` `data-ik`(orijinal TR metin=anahtar) kullanır. Metin dinamik değişirse (marka ikamesi) EN sözlük anahtarı kayabilir — SSR'de dikkat.
- **`FAQ_DATA` 273 kayıt** publishConfig'e GİRMEZ (çok büyük); `STORE_KEY`'de tutulur. Sunucuda ayrı tablo/endpoint.
- Node kurulu değil; syntax kontrolü `bun build` ile inline script çıkarılarak yapıldı. `importmap` + three.js `await import` bun'da "hata" verir ama sahte-pozitif.

---

## 6. Kabul Kriterleri (sunucu geçişi "bitti" sayılır)
- [ ] İki farklı domain iki farklı tenant config'i gösterir (aynı kod).
- [ ] Admin girişi sunucu-tarafı auth; client'ta düz-metin şifre yok.
- [ ] Admin'de değişiklik → Kaydet → başka cihaz/tarayıcıdan girişte kalıcı.
- [ ] Logo yükleme object storage'a gider (localStorage'da base64 yok).
- [ ] Form gönderimi `leads` tablosuna düşer.
- [ ] Yayınla → public snapshot güncellenir, cache invalidate olur.
- [ ] Mevcut tüm apply davranışı (marka/menü/iletişim/stats/sosyal/FAQ/i18n) korunur.

---
*Bu doküman `feat/dwg-prox-gercek-veri` dalındaki client-side white-label sürümün mührüyle birlikte bırakılmıştır. Frontend hazır ve doğrulanmış; sunucu-tarafı bu nottaki plana göre inşa edilmelidir.*
