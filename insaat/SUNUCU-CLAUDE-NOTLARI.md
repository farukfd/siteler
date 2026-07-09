# Meridyen Yapı (insaat/) — Sunucu Yayın Notları · Claude Ajanına Eksiksiz Devir

> Bu belge, **sunucuda deploy yapacak Claude ajanı** için tam devir dokümanıdır.
> Site: kurumsal inşaat firması "Meridyen Yapı" (anahtar teslim, kentsel dönüşüm, kat karşılığı, tadilat).
> Bu klasör (`insaat/`), il-il / firma-bağımsız beyaz-etiket emlak SaaS'ın (emlakekspertizi.com / ProX)
> **4 dikeyinden biridir** (diğerleri: `gayrimenkul/`, `danisman/`, `degerleme/`). Sadece `insaat/` yayınlanacak.
> Son güncelleme: 2026-07-09.

---

## 0) TEK CÜMLE ÖZET
Statik dosyalardan oluşan bir **SPA + overlay** sitesi. Build YOK, sunucu-tarafı runtime YOK.
Dosyaları olduğu gibi statik olarak servis et. Tek kritik konu **hash-tabanlı yönlendirme** (aşağıda) ve
birkaç **güvenlik/rotasyon** maddesi.

---

## 1) DOSYA YAPISI (ne servis edilecek)
```
insaat/
├── index.html              ← ANA SPA kabuğu (tüm overlay'ler + admin paneli + inline üyelik/hesap script)
├── js/app-core.js          ← Motor (nav/footer, router, PROJECTS/SERVICES, admin, ProX, i18n)  ~2700 satır
├── js/insaat-seo-chrome.js ← Statik SEO sayfaları için ORTAK hafif chrome (ProX Asistan + üyelik enjekte)
├── css/base.css            ← Ana stil    │  css/theme*.css → tema dosyaları (initSaaSTheme dosya takası)
├── img/insaat/…            ← Görseller (proje/hero). Yol: img/insaat/*.jpg
├── bolge.html              ← STATİK SEO sayfası (Bölge Zekası)         ┐
├── hizmetlerimiz.html      ← STATİK SEO sayfası (Hizmetler)            │ 5 gerçek, taranabilir
├── projelerimiz.html       ← STATİK SEO sayfası (Projeler)             │ SEO sayfası (canonical'lı)
├── soru-cevap.html         ← STATİK SEO sayfası (SSS / FAQPage JSON-LD)│
├── neden-biz.html          ← STATİK SEO sayfası (Neden Biz)            ┘
├── bolge/ hizmetler/ projeler/ soru-cevap/ iletisim/ asistan/  (her birinde index.html = yönlendirme stub'ı)
├── sitemap.xml · robots.txt
├── e2e-audit.mjs           ← Statik deploy denetimi (link/asset/SEO/JSON-LD/güvenlik)
├── VERSION · YAYIN-HAZIRLIK.md · SUNUCU-CLAUDE-NOTLARI.md (bu dosya)
```
Kök dizinde `smoke-test.mjs` (bütünlük testi) ve diğer dikeyler var — **sadece `insaat/` yayınlanacaksa**
diğer klasörleri (gayrimenkul/danisman/degerleme) publish etme.

---

## 2) MİMARİ (nasıl çalışıyor)
- **index.html = tek sayfa uygulama (SPA).** Ana içerik + tüm alt sayfalar `#...Page{position:fixed;inset:0;display:none}`
  **overlay**'leri olarak index.html içinde. `goPage('bolge',event)` → overlay'i render eder + `.on` ekler.
- **Zengin overlay'ler ANA deneyimdir** (kullanıcı tercihi). Nav tıklaması overlay açar, sayfa yeniden yüklenmez.
- **5 statik .html = SEO sayfaları.** Gerçek, taranabilir içerik + kendi `<link rel=canonical>` (mutlak URL).
  Google'a bunlar sunulur. SPA'nın nav'ı bunlara `href` ile de bağlanır (progressive enhancement / no-JS fallback).

### 2.1) YÖNLENDİRME — SUNUCU İÇİN KRİTİK ⚠️
Overlay URL'leri **HASH tabanlıdır**: `/insaat/#bolge`, `/insaat/#hizmetler`, `/insaat/#projeler`,
`/insaat/#iletisim`, `/insaat/#soru-cevap`, `/insaat/#asistan`.
- **Reload (F5) davranışı:** `/insaat/#bolge` yenilenince tarayıcı `index.html`'i yükler, `insBoot()` hash'i
  görüp overlay'i tekrar açar. **Statik forklu sayfa YÜKLENMEZ, "eski yapı" sıçraması OLMAZ.**
- **SUNUCUYA GEREK YOK:** Hash sunucuya gitmez. Clean-URL rewrite (`/insaat/bolge` → index.html) **gerekmez**.
  Sadece dosyaları statik servis et; `index.html`'i dizin varsayılanı yap.
- `#admin` → yönetim paneli, `#giris`/`#uye` → üyelik modalı, `#hesap` → üye hesap sayfası, `#doc-*` → yasal metinler.
- **Stub klasörleri** (`insaat/bolge/index.html` vb.): eski/temiz-URL bağlantıları için `../bolge.html`'e
  `location.replace` yapar. Zararsız; kalabilir.
- Not: SPA nav'ında `href="bolge.html"` (SEO fallback) + `onclick="goPage('bolge',event)"` (overlay) birlikte.
  Normal tıkta overlay açılır; crawler/no-JS `bolge.html`'i alır.

---

## 3) ProX API (canlı veri — istemci tarafı, TASARIM GEREĞİ)
- Base: `https://emlakekspertizi.com` · Endpoint: `POST /api/v1/tenant/prox/ai` (asistan/teklif),
  `POST /api/v1/tenant/lead` (CRM), `GET /api/v1/tenant/prox/endeks?il=&ilce=&mahalle=` (bölge verisi).
- Tenant kimliği: `window.EMLAK_TENANT` (index.html ~satır 16). Key: **`prox_construction_910783dfb8dd6be9cb9549bc818a60ee`**.
- **Bu key istemci tarafında GÜVENLİDİR** (tasarım: tenant-scoped, sadece kendi verisine erişir, CORS açık).
  Gizli API anahtarı DEĞİL. Yine de sunucu tarafında rate-limit + origin kontrolü önerilir.
- **ProX = VERİTABANI, yapay zekâ değil.** +1 milyar doğrulanmış emlak verisi. Kopya metinleri buna göre;
  "ProX yapay zekâ" deme. Asistan = Meridyen Yapı satış danışmanı, ProX verisine dayanır.
- API erişilemezse her akış **çevrimdışı fallback** ile bozulmadan çalışır (simüle yanıt/localStorage).

---

## 4) YÖNETİM PANELİ (admin)
- Erişim: Nav **Giriş → "Personel girişi" → "Yönetim Paneline Giriş →"**, veya doğrudan **`/insaat/#admin`**.
- **Şifre: `1234`** (demo). Değiştirilirse admin > Ayarlar & Güvenlik'ten. Kullanıcı adı `admin`.
  - Eski kurulumlarda kayıtlı `meridyen2026` şifresi ilk yüklemede **otomatik 1234'e göç eder**
    (`ins_admpass_reset_1234` bayrağı, tek sefer). Sonraki panel değişikliklerine dokunmaz.
- **⚠️ PROD ZORUNLU:** `1234` demo şifredir. Yayında **mutlaka değiştir** ve ideal olarak admin'i
  sunucu-tarafı kimlik doğrulamayla (temel-auth veya oturum) koru. İstemci-tarafı şifre gerçek güvenlik değildir.
- Paneller: Genel Bakış, Site İçeriği, Marka&Logo, Menü&Footer, Google&Reklam, Diller (TR/EN), İletişim&Konum
  (Leaflet tıkla-seç), Soru-Cevap, Sosyal&İlan, İstatistik, Projeler, Hizmetler, Kat Karşılığı, 3D Proje,
  DWG Mimari, Sözleşmeler, **Müşteriler/Teklifler**, **💬 Görüşmeler & Teklifler (ProX)**, Tema, Ayarlar.
- "Yayınla" → tüm sayfalara uygulanan `SITE_CONFIG` üretir (localStorage `meridyen_site_v1` + publishConfig).

---

## 5) ÜYELİK + HESAP + GÖRÜŞME/TEKLİF TAKİBİ (şu an istemci-tarafı)
- **Üyelik:** `crypto.subtle` SHA-256 + rastgele salt. localStorage: `insaat_users_v1`, `insaat_session_v1`.
- **Üye hesabı** (`#hesap`): Tekliflerim (varsayılan sekme), Favorilerim, Profilim (ad/tel + şifre değiştir).
  Kullanıcı verisi: `insaat_fav_<email>`, `insaat_quotes_<email>`.
- **ProX Asistan** satış danışmanı: müşteriyi dinler → niyeti anlar → projeleri pazarlar → müşteriye çevirir →
  telefon isterse **CRM'e geri-arama lead'i** (`/api/v1/tenant/lead`). Görüşmeler `prox_asistan_convos_v1`.
- **Admin "💬 Görüşmeler & Teklifler" panosu:** tüm ProX görüşme dökümleri + üye teklifleri + üyeler + geri arama
  taleplerini gösterir (yetkili takibi).
- **⚠️ PROD:** Üyelik/görüşme/teklif şu an **tarayıcı-yerel** (her cihazda ayrı). Gerçek çok-kullanıcılı takip
  için sunucu-tarafı auth + merkezî CRM gerekir. İskelet hazır: tüm lead/teklif zaten `/api/v1/tenant/lead`'e
  gönderiliyor → **ProX CRM'de merkezî toplanabilir**. Panoyu bu API'den okuyacak uç eklenmeli (P1, aşağıda).

---

## 6) DEPLOY ADIMLARI
1. **Build gerekmez.** Dosyaları statik servis et (Nginx/Apache/CDN/Netlify/Vercel-static farketmez).
2. `index.html`'i dizin varsayılanı yap. `/insaat/` → `insaat/index.html`.
3. **MIME/başlıklar:** `.mjs` gerekmez (test dosyaları, yayına konmaz). `.js`/`.css` → uzun cache + hash/versiyon
   query ile bust (index.html script/link'e `?v=<VERSION>` eklenebilir). `index.html` → `no-cache` öner.
4. **HTTPS zorunlu** (crypto.subtle + geolocation + güven).
5. **Test et** (aşağı). Yeşil değilse yayınlama.
6. Deploy sonrası: gerçek domain'e göre `sitemap.xml` + canonical URL'leri kontrol et (şu an `www.meridyenyapi.com`).

### Yayınlanmayacaklar (opsiyonel temizlik)
`*.mjs` (test), `*-NOTLARI.md` / `*-NOTU.md` / `YAYIN-HAZIRLIK.md` (iç dokümanlar), diğer dikey klasörleri.

---

## 7) TESTLER (yeşil olmadan yayınlama)
```sh
bun smoke-test.mjs        # bütünlük değişmezleri  → beklenen: "137 geçti, 0 başarısız ✓"
bun insaat/e2e-audit.mjs  # statik deploy denetimi → beklenen: "224 geçti · 0 uyarı · 0 HATA"
bun build insaat/js/app-core.js --target=browser  # JS söz dizimi kontrolü (çıktı atılır)
```
Manuel duman testi (tarayıcı): `/insaat/` aç → nav (Hizmetler/Projeler/Bölge/ProX Asistan) → **F5 ile yenile:
overlay tekrar açılmalı, eski/farklı sayfa GELMEMELİ** → Giriş → Kayıt/Giriş → Hesap (Tekliflerim) →
`/insaat/#admin` → `1234` → paneller.

Bu oturumda **canlı doğrulanan** akışlar: kayıt/giriş/çıkış, profil+şifre, favori, teklif→ProX yanıt,
admin 1234 + 10 panel, i18n TR↔EN, OSM harita, hash router + geri/ileri, F5-yenile overlay geri gelir.

---

## 8) GÜVENLİK / ROTASYON — ⚠️ YAYIN ÖNCESİ
1. **Admin şifresi `1234`** → değiştir + tercihen sunucu-auth (bkz. §4).
2. **DeepSeek API anahtarı git GEÇMİŞİNDE** olabilir (DWG çözümleme özelliğinden). Mevcut kaynak dosyalarda
   **yok** (temizlendi) ama **git history'de kalmışsa kullanıcı tarafından İPTAL/rotate edilmeli.** Yeni key
   asla repoya koyma; gerekiyorsa admin'den girilen/sunucu-proxy'li kullan.
3. **ProX tenant key** istemcide güvenli (tenant-scoped) ama sunucuda **origin allow-list + rate-limit** ekle.
4. **CSP/başlıklar öner:** `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`,
   `X-Frame-Options: SAMEORIGIN` (OSM/Leaflet iframe'i kendi origin'inde). HSTS.
5. KVKK/çerez banner'ı ve yasal metinler (`#doc-kvkk`, `#doc-gizlilik`, `#doc-cerez`) mevcut — domain'e göre gözden geçir.

---

## 9) SEO
- 5 statik sayfa gerçek içerikli + `canonical` (mutlak URL) + OG + JSON-LD (soru-cevap: FAQPage).
- `sitemap.xml` (8 URL) + `robots.txt` mevcut → domain'e göre güncelle.
- Overlay'ler hash (`#bolge`) → arama motoru için ayrı URL DEĞİL; SEO değeri **statik .html sayfalarında**.
- Google'dan statik sayfaya düşen ziyaretçi ilk nav tıklamasında SPA'ya geçer (nav `index.html#slug`'a yönlendirir).

---

## 10) BİLİNEN SINIRLAMALAR / SIRADAKİ İŞLER (öncelik sırasıyla)
- **P3 (indirildi) — Statik sayfa CSS/gövde un-fork:** 5 statik SEO sayfasının DİNAMİK chrome'u artık ORTAK
  `js/insaat-seo-chrome.js` ile yönetiliyor: ProX Asistan linki + canlı üyelik durumu (giriş adı) enjekte ediliyor,
  nav SPA'ya yönleniyor → chrome SPA ile TUTARLI. Geriye yalnızca her sayfanın KENDİ inline CSS'i (~200-280 satır,
  base.css'ten forklanmış ama token'ları birleşik) + kendi gövde renderer'ı kalıyor. Bunları da base.css'e
  taşımak SEO gövdesini riske atar; **düşük öncelik**. Not: app-core.js'i bu sayfalara doğrudan yükleme
  (CSS cascade + global çakışması → RİSKLİ); gerekirse chrome'u yine `insaat-seo-chrome.js` üzerinden genişlet.
- **P1 — Merkezî görüşme/teklif takibi:** admin panosunu localStorage yerine ProX CRM API'sinden okut
  (lead'ler zaten `/api/v1/tenant/lead`'e gidiyor; okuma ucu + panoya bağlama gerek).
- **P2 — Sunucu-tarafı üyelik/oturum** (şu an istemci SHA-256 + localStorage; tek-cihaz).
- **P2 — Admin sunucu-auth** (§4/§8).
- **P3 — Diğer dikeylerde (gayrimenkul/danisman/degerleme) EN i18n tamamlama** (bu site TR/EN tam).
- **P3 — Gerçek mahalle verisi:** ProX endeks endpoint'i canlı; il/ilçe/mahalle kademeli genişletme.

---

## 11) HIZLI BAŞVURU — anahtar semboller (app-core.js / index.html)
- Router: `_INS_OV` (overlay kaydı), `_insUrl`=hash, `goPage`, `insBoot`, `insRoute`, `checkHash`, `_INS_HM`.
- Nav/footer tek kaynak: `INSAAT_NAV/CTA/MNAV/FOOTER` + `mountInsaatMenu()` (statik sayfalar hariç).
- Üyelik: `authRegister/authLogin/authLogout/authSession`, `applyAuthUI`. Hesap: `openHesap/renderHesap`.
- ProX Asistan: `paSend`, `PA_SYS` (satış davranışı), `_paBizContext` (proje kataloğu), `_paHistCtx` (bağlam).
- Admin: `showAdmin`, `admLogin` (şifre 1234), `admNav`, `renderGorusmeler` (görüşme/teklif panosu).
- Depolama: `meridyen_site_v1` (admin/config), `insaat_users_v1`, `insaat_session_v1`,
  `insaat_fav_<email>`, `insaat_quotes_<email>`, `prox_asistan_convos_v1`, `emlak_leads_fallback`.
