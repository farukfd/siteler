# SaaS Siteler · White-label — Sunucu Ajanı Entegrasyon Notları

> **Kime:** `emlakekspertizi.com/admin?tab=saas-siteler` panelini ve arkasındaki
> ProX API'yi yöneten sunucu-tarafı ajan/ekip.
> **Ne için:** Bu repodaki front-end siteleri (gayrimenkul · inşaat · danışman ·
> değerleme) çalışmak için sunucudan ne bekliyor — eksiksiz sözleşme.
> **Durum:** Front-end üretim kalitesinde; sunucu uçlarının bir kısmı CANLI, bir
> kısmı front-end'de **simüle** (fallback). Aşağıda her uç için işaretli.

---

## 1) Büyük resim — Motor / Tema / Kiracı

White-label SaaS: **4 dikey** (gayrimenkul, inşaat, danışman, değerleme). Her
dikeyde **20–50+ satılan site** (kiracı/tenant), her birinin kendi tasarımı.

- **Motor** = paylaşılan kod (ör. `gayrimenkul/js/app.js`, `insaat/js/app-core.js`,
  `css/base.css`). Kiracı başına ASLA forklanmaz.
- **Tema** = `themes/<dikey>/<tema>.css` (sadece `:root` tasarım token'ları). Tasarım = veri.
- **Kiracı** = ince kabuk (`index.html`) + **config** (marka, logo, il, ProX anahtarı, tema).

**Sunucunun ana görevi:** her satılan site için bir **kiracı kaydı** tutmak
(config + ProX anahtarı + paket) ve ProX API'yi bu kiracı bağlamında sunmak.

---

## 2) Kiracı (satılan site) provizyon modeli — panelin yönetmesi gerekenler

Panelde her kiracı için tutulacak alanlar:

| Alan | Örnek | Açıklama |
|---|---|---|
| `tenant_id` | `prox_emlaktahadimkoy_com_5d31…` | Benzersiz kiracı kimliği |
| `tenant_key` | `prox_<slug>_<hash>` | API anahtarı (front-end'e gömülür — bkz. Güvenlik) |
| `dikey` | `gayrimenkul` \| `insaat` \| `danisman` \| `degerleme` | Hangi motor |
| `domain` | `tahadimkoy.com` | Yayın domaini (canonical/og:url bu olur) |
| `firma` | ad, telefon, e-posta, WhatsApp, adres, vergi/TC, yetkili | Marka künyesi |
| `il` | `Konya` | Aktif il (içerik + endeks bu ile göre) |
| `tema` | `meridyen` \| `sahil` \| `altin-lux` \| … | `themes/<dikey>/<tema>.css` |
| `logo_url` | data-URI / URL | Üst menü + footer logosu |
| `paket` | `baslangic` \| `pro` \| `kurumsal` | Feature-gating (bkz. §5) |
| `eids` | belge no, unvan, firma kodu, kullanıcı kodu | EİDS ilan doğrulama (bkz. §6) |

> Front-end bu config'i **hem localStorage'dan** (admin panelinden düzenlenebilir)
> **hem de** ideal olarak sunucudan (bootstrap) okur. Sunucu, kiracının kalıcı
> gerçek kaynağı olmalı; localStorage yalnızca oturum/önizleme.

---

## 3) ProX API sözleşmesi — front-end'in çağırdığı TÜM uçlar

**Taban:** `https://www.emlakekspertizi.com`
**Kimlik doğrulama header'ları (her istek):** `X-Tenant-Id: <tenant_id>` · `X-Tenant-Key: <tenant_key>`
**CORS:** açık olmalı (tarayıcıdan doğrudan çağrılıyor). `Access-Control-Allow-Origin`
kiracı domainlerini (veya `*`) içermeli; `X-Tenant-*` header'ları
`Access-Control-Allow-Headers`'ta olmalı.
**Fallback kuralı:** Her uç `{fallback:true}` veya hata dönerse front-end yerel
demo/simülasyona düşer (site çökmez). Yani **boş/yavaş yanıt siteyi bozmaz** ama
CANLI veri kaybolur.

### 3.1 `GET /api/v1/tenant/bootstrap` — **KRİTİK**
Kiracının paket + özellik bayraklarını + temel ayarlarını döner.
```json
{ "success": true, "package": "pro",
  "features": { "canUsePdfReports": true, "canPublishListings": true,
                "canUseAI": true, "maxListings": 500, "multiCity": true },
  "tenant": { "name": "Konya Gayrimenkul", "il": "Konya", "theme": "meridyen" } }
```
Front-end: `proxBootstrap()` yükte çağırır; premium kapıları buna göre kilitler.

### 3.2 `GET /api/v1/tenant/endeks?il=&ilce=&mahalle=&kategori=&durum=` — **KRİTİK (canlı m² verisi)**
Bölge fiyat endeksi. Kategori: `konut|ticari|arsa`; durum: `satilik|kiralik`.
```json
{ "success": true, "data": { "m2": 68750, "score": 82, "delta": 12.4,
    "trend": [61000,63500,65200,67000,68750] } }
```
Front-end kullanımı: bölge analizi kartları, "● canlı veri" rozeti, Özel Portföy
başlangıç fiyatı (m2 × katsayı), inşaat Bölge Zekası. **Alan boş/0 ise o alanda
yerel demo korunur** (kısmi yanıt güvenli).

### 3.3 `POST /api/v1/tenant/prox/ai` — ProX Yapay Zeka (DeepSeek)
```json
// istek
{ "persona": "office", "prompt": "<sistem+bayi promptu>",
  "context": "ilan|degerleme|bolge|default", "message": "<kullanıcı sorusu>" }
// yanıt
{ "success": true, "answer": "…", "powered_by": "ProX" }
```
Kullanım: kurumsal kimlik sihirbazı (slogan/hakkımızda/SEO üretimi), sohbet
asistanı, blog makale üretimi. `aiGuard()` promptu güvenlik için sarmalar.

### 3.4 `POST /api/v1/tenant/prox/analyze` — mülk değerleme analizi
Özel Portföy/değerleme fiyat aralığı (`range.min` = başlangıç fiyatı). Yanıt
`{success, data:{ range:{min,max}, m2, … }}`.

### 3.5 `POST /api/v1/tenant/pdf/generate` — profesyonel PDF rapor
```json
// istek
{ "title": "…", "pages":[{"id":"…","html":"…"}], "css":"…" }
// yanıt
{ "success": true, "pdf_base64": "JVBERi0…" }
```
38 kategorilik değerleme raporu. `canUsePdfReports` paket bayrağına bağlı.

### 3.6 `POST /api/v1/tenant/lead` — form gönderimleri → CRM
Tüm site formları (ekspertiz, iletişim, detay iste, arz) buraya POST'lar.
`{ sourcePage, formType, name, phone, email, location, message, requestedService }`.
Yanıt `{success, lead_id}`. **Sunucu CRM'e yazmalı** + kiracı gelen kutusuna düşürmeli.

### 3.7 `POST /api/v1/tenant/portal/login` · `POST /api/v1/tenant/staff/login`
Müşteri portalı / personel girişi. `{ client_key, secure:true }` → `{success, portal_token, profile:{companyName, role, regionAuth[]}}`.

### 3.8 `GET /api/v1/tenant/blog?limit=` · `/blog/feed`
Blog makale listesi/feed'i (ProX AI üretimi + yayın). `{success, data:[{title,slug,excerpt,body,cover,date}]}`.

### 3.9 Konum servisleri — `GET /api/v1/tenant/locations/{iller,ilceler,mahalleler}` · `locations?il=`
İl/ilçe/mahalle listeleri. **Şu an front-end'de 81 il + 973 ilçe GÖMÜLÜ**
(`tr-iller.js`) çünkü liste ucu yoktu; sunucu gerçek mahalle verisi verirse
front-end bağlanır (`window.EMLAK_LOCATION`). Mahalle listesi en çok istenen eksik.

### 3.10 `POST /api/v1/tenant/smart` — akıllı eşleştirme (mülk pusulası)
Bütçe/bölge/oda → uygun mülk eşleştirme.

---

## 4) Kiracı config — sunucunun saklaması/sunması gerekenler

Front-end `SAAS_CONFIG` (çift katman) modeli:
- `systemSettings` = **merkez** (sunucu) tarafından gelen, salt-okunur alanlar.
- `tenantSettings` = bayi kendi panelinden değiştirir; `allowTenantOverride` ile
  hangi alanların bayi tarafından ezilebileceği merkezden kontrol edilir.

Örnek override edilebilir alanlar: `themeColor, whatsapp, logoUrl, faviconUrl,
contactPhone, googleAnalytics, googleMapsKey, googleSiteVerification, metaTitle,
metaDescription, metaKeywords, customPrompt`.

> **Panelde bunları yönetin:** merkez varsayılanları + bayi izinleri (hangi alan
> override edilebilir) + kiracı bazlı override değerleri.

---

## 5) Paket & feature-gating

`bootstrap.features` bayrakları front-end kapılarını açar/kilitler:
`canUsePdfReports, canPublishListings, canUseAI, multiCity, maxListings, …`.
Paket düşükse front-end özelliği **kilit + upsell** gösterir (`requireFeature`,
`featUpsell`). **Sunucu bu bayrakları kiracı paketine göre doğru dönmeli** —
front-end'e güvenmeyin, sunucu tarafında da yaptırım uygulayın (özellikle
ilan yayını, PDF, AI kotası).

---

## 6) EİDS — Elektronik İlan Doğrulama (Ticaret Bakanlığı; 15 Şubat 2026'dan beri tüm gayrimenkul ilanlarında zorunlu)

**Front-end artık GERÇEK** (`shared/eids.js` → `window.EIDS`; üç ürün sitesi ortak
kullanır). Kod/durum **UYDURMAZ**; doğrulamayı backend'e devreder, canlı uç yoksa
dürüstçe `beklemede` kalır — sahte "onaylı" YOK. (Eski `eidsDemoRec`/`_eidsKod`
fabrikasyonu tamamen kaldırıldı.)

**Client'ın çağırdığı uç — sunucunun sağlaması gereken:**
`POST /api/v1/tenant/eids/verify`
- İstek gövdesi: `{ tasinmazNo, il, ilce, ada, parsel, malikTip, yetkiBelgeNo }`
  — `malikTip`: `malik` | `yakin` | `isletme`; `isletme` için `yetkiBelgeNo` zorunlu.
- Yanıt: `{ success:true, data:{ status, referans?, tarih?, mesaj? } }`
  — `status`: `dogrulandi` | `reddedildi` | `beklemede`.
- Client YALNIZCA `success===true && !fallback && data` ise sonucu kabul eder;
  aksi halde (fallback/hata/6sn timeout) durum dürüstçe `beklemede` kalır.

**Yayın kapısı:** yalnız `status==='dogrulandi'` ilan resmî yayınlanır
(`EIDS.canPublish`). Firma-düzeyi: **Taşınmaz Ticareti Yetki Belgesi No** (kurumsal).
Gerçek e-Devlet/Bakanlık entegrasyonu **sunucuda**; front-end + kapılar hazır.

---

## 7) Güvenlik — dikkat

- **`tenant_key` istemciye gömülüdür** (tarayıcıdan görülebilir). Bu yüzden:
  anahtar **yalnızca okuma + kiracıya-özel** yetkilere sahip olmalı; yazma/CRM/PDF
  gibi işlemler sunucuda ayrıca doğrulanmalı (rate-limit + kiracı izolasyonu).
- `EMLAK_PROXY_MODE` = front-end, hassas çağrıları doğrudan yerine bir **proxy**
  üzerinden geçirebilir; sunucu bu modu destekleyecekse endpoint eşlemesini koru.
- **Çok-kiracı izolasyon:** her yanıt yalnızca `X-Tenant-Id`'nin verisini içermeli;
  bir kiracı başka kiracının verisine erişememeli.
- CORS'u kiracı domainleriyle sınırla (mümkünse `*` yerine allow-list).

---

## 8) SEO & Deployment — sitelerin yapısı

- **Temiz URL'ler (# YOK):** overlay "sayfaları" temiz yol: `/gayrimenkul/analiz`,
  `/insaat/hizmetler` vb. Statik sunucuda çalışması için her slug'ın altında
  **yükleyici stub** dizini var (`<slug>/index.html` → sessionStorage + `../`'a
  yönlendirir). **Deploy'da bu dizinler korunmalı.** İdeal: sunucu rewrite ile
  `/insaat/hizmetler` → `/insaat/index.html` (stub'a gerek kalmadan, daha temiz).
- **İndekslenen gerçek SEO sayfaları:** her dikeyin `index.html` + gerçek alt
  sayfaları (gayrimenkul: `nedenbiz.html`, `hizmetlerimiz.html`, `portfoy.html`;
  inşaat: `neden-biz.html`). Overlay route stub'ları `noindex`.
- **canonical / og:url** yayın domaini olmalı (kiracı `domain` alanından).
- Kiracı bazlı **sitemap.xml + robots.txt** üretimi front-end'de mevcut
  (`genSeoFiles`); sunucu tarafında da her kiracı domaini için servis edin.
- JSON-LD (RealEstateAgent / RealEstateDevelopment / FAQPage / BreadcrumbList)
  front-end'de üretiliyor; sunucu SSR yapacaksa aynı şemayı koru.

---

## 9) CANLI vs SİMÜLE — sunucunun tamamlaması gerekenler (öncelik sırası)

| Uç | Durum | Aksiyon |
|---|---|---|
| `/endeks` | CANLI (doğrulandı) | Kapsamı genişlet (tüm il/ilçe/mahalle) |
| `/prox/ai` | CANLI (DeepSeek) | Kota/rate-limit + kiracı promptu |
| `/bootstrap` | Kısmen | Paket+feature bayraklarını netleştir |
| `/lead` | Bekliyor | CRM yazımı + kiracı gelen kutusu |
| `/pdf/generate` | Bekliyor | 38-kategori PDF motoru |
| `locations/mahalleler` | **EKSİK** | Gerçek mahalle listesi (en çok istenen) |
| `/eids/verify` | Bekliyor | Front-end GERÇEK + hazır (`shared/eids.js`); sunucu gerçek Bakanlık/e-Devlet doğrulamasını yapmalı (§6). Gelene kadar client dürüstçe `beklemede`. |
| NADAS Veri Terminali (`/endeks`) | Bekliyor | `nadas/index.html` → `EMLAK_TENANT.tenant_key`'e kurumsal ProX anahtarı ekle → terminal CANLI gerçek endekse geçer. Anahtar boşken dürüstçe **"TEMSİLÎ ÖRNEK"** gösterir (sahte "CANLI" yok). |
| EİDS doğrulama | **SİMÜLE** | Gerçek e-Devlet entegrasyonu (yasal zorunlu) |
| portal/staff login | Simüle | Gerçek kimlik doğrulama |

---

## 10) Panel (`?tab=saas-siteler`) — önerilen yetenekler

1. **Kiracı CRUD:** yeni site oluştur (dikey + domain + firma + il + tema seç) →
   `tenant_id`/`tenant_key` üret → config kaydet.
2. **Config editörü:** §4'teki alanlar + `allowTenantOverride` izinleri.
3. **Paket atama:** §5 feature bayrakları.
4. **Tema seçimi:** `themes/<dikey>/` kütüphanesinden (yeni tema = yeni `.css`).
5. **EİDS künyesi + doğrulama durumu.**
6. **Kullanım/kota + fatura:** AI çağrısı, PDF, ilan sayısı.
7. **Domain/DNS + deploy:** kiracı kabuğunu (ince) domaine bağla; SEO dosyaları.
8. **Sağlık:** her kiracının `/bootstrap` + `/endeks` canlı testi (yeşil/kırmızı).

---

### Özet
Front-end **kiracı-bağlamlı, fallback-güvenli** olarak yazıldı: sunucu uçları
CANLI olduğunda otomatik gerçek veriye geçer, olmadığında demo ile ayakta kalır.
Sunucu ajanının işi: (a) kiracı kayıtlarını + config'i tutmak, (b) §3'teki uçları
`X-Tenant-*` bağlamında doğru+izole sunmak, (c) §9'daki eksikleri (mahalle, lead,
PDF, EİDS) tamamlamak, (d) §5 feature-gating'i sunucuda da yaptırmak.
