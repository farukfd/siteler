# Meridyen Yapı (insaat) — Sunucuya Yayın Hazırlık Rehberi

**Sürüm:** v3.0 · **Denetim tarihi:** 2026-07-08 · **Durum:** ✅ Yayına hazır

Bu belge, `insaat/` sitesinin canlı sunucuya (meridyenyapi.com) sorunsuz alınması
için gereken her şeyi içerir. Uçtan uca testler yapıldı; aşağıdaki adımlar izlenirse
site eksiksiz çalışır.

---

## 1. Uçtan uca test sonuçları (hepsi ✅)

| Test | Sonuç |
|---|---|
| Statik denetim (link/asset/SEO/güvenlik) — `bun insaat/e2e-audit.mjs` | **221 geçti · 0 uyarı · 0 hata** |
| Smoke test — `bun smoke-test.mjs` | **137/137** |
| 6 sayfa yükleme + konsol | 6/6 · **0 konsol hatası** |
| Temiz-URL yönlendirme (nav + loader stub'ları) | Tüm hedefler **200** |
| Ana sayfa OSM haritası | Render ✓ (200) |
| Teklif formu gönderimi | ✓ "Talebiniz alındı" |
| Çok dilli (TR↔EN) | ✓ metin değişip geri dönüyor |
| Admin girişi → 19 pane | ✓ |
| Admin harita tıkla-seç + reverse-geocode | ✓ konum→adres otomatik |
| Kaydet → ana sayfa haritası senkron | ✓ seçilen konum yansıyor |
| Görseller (yol normalizasyonu sonrası) | **0 kırık** |
| Mobil 375px (burger, mdock, taşma yok) | ✓ |

---

## 2. ⚠️ DEPLOY YAPISI (EN KRİTİK ADIM)

Tüm `canonical`, `og:url`, `sitemap.xml` ve `robots.txt` URL'leri siteyi **alan adı
KÖKÜNDE** varsayar (örn. `https://www.meridyenyapi.com/hizmetlerimiz.html`, `/insaat/…` DEĞİL).

Bu yüzden **`insaat/` klasörünün İÇERİĞİ web köküne** kopyalanmalı, `img/` de köke:

```
Sunucu web kökü (örn. /var/www/meridyenyapi)  →  meridyenyapi.com/
├── index.html            ←  insaat/index.html
├── hizmetlerimiz.html    ←  insaat/hizmetlerimiz.html
├── projelerimiz.html     ←  insaat/projelerimiz.html
├── bolge.html            ←  insaat/bolge.html
├── soru-cevap.html       ←  insaat/soru-cevap.html
├── neden-biz.html        ←  insaat/neden-biz.html
├── css/                  ←  insaat/css/
├── js/                   ←  insaat/js/
├── hizmetler/ projeler/ bolge/ iletisim/ soru-cevap/   ←  insaat/<temiz-url stub'ları>
├── sitemap.xml robots.txt VERSION   ←  insaat/<aynı>
└── img/insaat/*.jpg      ←  img/insaat/  (repo KÖKÜNDEN, insaat/ içinden değil)
```

**Örnek yükleme komutu (rsync):**
```sh
rsync -av --exclude='*.md' --exclude='e2e-audit.mjs' insaat/  kullanici@sunucu:/var/www/meridyenyapi/
rsync -av img/insaat/  kullanici@sunucu:/var/www/meridyenyapi/img/insaat/
```

> Görsel yolları bu hazırlıkta `../img/insaat/` → **`/img/insaat/`** (mutlak-kök) olarak
> düzeltildi; böylece kök deploy'da kırılmaz. Alt-dizine (örn. `site.com/insaat/`) kurmayın —
> canonical'lar ve `/img/` mutlak yolları köke bağlıdır.

### Web sunucusu ayarı
- **Statik site** — PHP/Node/build gerekmez. Nginx/Apache/Caddy veya statik host (Netlify,
  Vercel, Cloudflare Pages) yeterli.
- **HTTPS zorunlu** (Let's Encrypt). OSM/Nominatim, bazı CDN'ler ve SEO için gerekli.
- **`www` → apex veya tersi** tek bir kanonik host'a 301 yönlendir (canonical `www.meridyenyapi.com`).
- **Temiz URL'ler** zaten `hizmetler/index.html` gibi stub'larla çalışır; ek rewrite gerekmez.
  (İstenirse `.html`'siz URL için nginx `try_files $uri $uri.html $uri/ =404;` eklenebilir.)
- **MIME + cache:** `.js .css .json .xml .woff2` doğru MIME; görsel/CSS/JS'e uzun cache,
  HTML'e kısa/no-cache önerilir.

---

## 3. Harici bağımlılıklar (kullanıcı tarayıcısından erişilebilir olmalı)

Hepsi ücretsiz/anahtarsız kamu servisleri; sunucu tarafında ayar GEREKMEZ, ama internet
erişimi kapalı kurumsal ağlarda beyaz-listeye alınmalı:

| Servis | Kullanım | Kritiklik |
|---|---|---|
| fonts.googleapis.com / fonts.gstatic.com | Google Fonts | Orta (fallback font var) |
| cdnjs.cloudflare.com | GSAP + eklentiler (animasyon) | Düşük (yoksa içerik yine görünür — kurşun-geçirmez reveal) |
| cdn.jsdelivr.net | Three.js (3B), Leaflet (admin harita) | Düşük (3B/picker sadece) |
| unpkg.com | Lenis (yumuşak kaydırma) | Çok düşük |
| openstreetmap.org + *.tile.openstreetmap.org | Harita gömme + karolar | Orta (ana sayfa + iletişim haritası) |
| nominatim.openstreetmap.org | Admin adres arama/reverse-geocode | Düşük (sadece admin; 1 istek/sn limiti) |
| **www.emlakekspertizi.com** | **ProX canlı endeks/veri API'si** | **Yüksek — bkz. §4** |

> Dayanıklılık (opsiyonel): kritik CDN'ler self-host + SRI ile sabitlenebilir. Şu an
> animasyon motoru düşse bile içerik görünür kalır (reveal kurşun-geçirmez).

---

## 4. ProX API / kiracı (tenant) yapılandırması

Site canlı emlak/endeks verisini `www.emlakekspertizi.com` üzerinden `X-Tenant-Id` /
`X-Tenant-Key` başlıklarıyla çeker. **Yayından önce gerçek üretim kiracısı sağlanmalı:**

- Üretim `X-Tenant-Id` + `X-Tenant-Key` alın (demo anahtar üretimde kullanılmamalı).
- Detaylı entegrasyon: repo kökündeki `PROX-API-GEREKSINIM-NOTU.md` ve
  `docs/SAAS-SUNUCU-AJAN-NOTLARI.md`.
- API erişilemezse site çöker değil — statik/temsilî verilere düşer (graceful degrade).

---

## 5. Güvenlik

- ✅ **Sızmış sır yok** — eski DeepSeek anahtarı koddan kaldırıldı. (Not: anahtar git
  geçmişinde; DeepSeek konsolundan **iptal edilmeli**.)
- ✅ **Görünür şifre ipucu yok.**
- ⚠️ **Admin şifresi `meridyen2026`** — üretimde **değiştirin** (admin panel → Ayarlar).
  Bu admin **istemci-taraflı** bir demo CMS'tir (localStorage); gerçek güvenlik değildir —
  hassas veriyi buraya koymayın. Gerçek çok-kiracı yönetim sunucu-ajanı ile yapılır.
- ⚠️ Admin `#admin` hash ile açılır ve `robots`'ta indekslenmez; yine de üretimde
  sunucu tarafı koruma (IP allowlist / basic-auth) önerilir.
- ✅ HTTPS + güvenlik başlıkları (HSTS, X-Content-Type-Options, Referrer-Policy) eklenmeli.

---

## 6. SEO / yayın sonrası

- ✅ Her public sayfada: `<title>`, meta description, mutlak canonical, OpenGraph,
  favicon, geçerli JSON-LD, `lang="tr"`, viewport.
- ✅ `sitemap.xml` (6 URL) + `robots.txt` (stub'lar disallow, sitemap referansı).
- **Yayından sonra:** Google Search Console'a alan adını doğrulayın, `sitemap.xml`'i
  gönderin. Admin → Google alanına Analytics + Search Console doğrulama kodu girin.
- Sosyal/portal linkleri (nsosyal, sahibinden, hepsiemlak, emlakjet, LinkedIn…) admin →
  Sosyal panelinden gerçek hesaplarla güncellenmeli.

---

## 7. Yayın öncesi kontrol listesi

- [ ] `insaat/*` → web kökü, `img/insaat/` → `/img/insaat/` kopyalandı (§2)
- [ ] HTTPS + www↔apex 301 kanonik host ayarlandı
- [ ] `bun insaat/e2e-audit.mjs` ve `bun smoke-test.mjs` yeşil (CI'de de)
- [ ] Admin şifresi değiştirildi; DeepSeek anahtarı iptal edildi
- [ ] Üretim ProX `X-Tenant-Id/Key` girildi (§4)
- [ ] Admin'den logo/favicon, iletişim (harita konumu tıkla-seç), künye, sosyal linkler dolduruldu → **Yayınla**
- [ ] Search Console + Analytics doğrulaması yapıldı, sitemap gönderildi
- [ ] Canlıda mobil + masaüstü son göz kontrolü

---
*Bu rehber `insaat/` sitesi içindir. Deploy-only; gerçek çok-kiracı sunucu mimarisi için
`docs/SAAS-SUNUCU-AJAN-NOTLARI.md`.*
