# AGENT NOTES — danisman/ (Selin Meridyen) · Claude ajanı için devir notu

> Bu dosya, `danisman/` sitesinde çalışacak **Claude ajanları** içindir. Amaç: bağlamı
> hızlı yükleyip aynı hatalara düşmemek. Son güncelleme: 2026-07-17.

## 1. Site nedir
Türkiye'de il-il ölçeklenen **beyaz-etiket gayrimenkul danışmanı** sitesi (amiral örnek: "Selin Meridyen").
Statik çok-sayfalı HTML + `index.html` içinde bir SPA (admin + hero + bölümler).
Araç zinciri: **bun**. Yerel önizleme: proje kökünde `python3 -m http.server 8799` → `http://localhost:8799/danisman/`.
Yayın hedefi: **https://www.emlakekspertizi.com/danisman/** (robots.txt + sitemap.xml bunu gösterir).

## 2. Mimari / dosya haritası
- **index.html** — ince kabuk + SPA; `js/app.js` (admin paneli + hero + tüm SPA mantığı) yükler.
- **Standalone sayfalar** (ilanlar, ozel-portfoy, iletisim, hizmetlerimiz, hakkimizda, bolge-analizi,
  prox-asistan, sss, kvkk, cerez, kullanim, 404) — `app.js` YÜKLEMEZ. Ortak scriptler:
  `js/brand.js` (white-label isim/logo), `js/content.js` (footer + WhatsApp wiring + hızlı iletişim modalı),
  `js/cerez.js` (KVKK çerez onayı), `js/a11y.js`. Bazıları ayrıca `lead.js`, `share.js`, `uyelik.js`,
  `ilan-data.js`, `ist-ilce.js`, `ist-mahalle.js`, `tr-iller.js`, `portfoy-visuals.js` yükler.
- **css/base.css** + **css/portfoy.css**. Tema Aegean Heritage Wealth: near-white `#f9f9f8`, beyaz kart,
  hairline `#e1e3e2`, emerald `#00452b/#0e5e3e/#14805a`, gold `#c39b45/#795901`, Playfair Display + IBM Plex Sans.
- **tools/gen-share-pages.mjs** — ilan başına OG paylaşım sayfası üretir → `p/<id>.html`.

## 3. localStorage anahtarları (tek gerçek kaynak)
| Anahtar | İçerik |
|---|---|
| `dn_iletisim` | `{wa, tel, mail}` — WhatsApp/telefon/e-posta (footer+nav+CTA buradan güncellenir) |
| `dn_firma` | Yasal künye: `{unvan, isletme, sicil, mersis, oda, yetkiBelge, sorumlu, kep, vergiDaire, vergi, adres, tel, mail, eids:{belgeNo}}` |
| `dn_listings_v1` | Admin ilanları (yoksa `js/ilan-data.js` SEED demo) |
| `dn_ozel_portoy` | Özel Portföy kayıtları (yayınla/kaldır) |
| `dn_content` / `dn_identity` | Sayfa metinleri / kurumsal kimlik (CMS) |
| `dn_brand` | Marka adı/logo (white-label) |
| `dn_prox` | ProX API kiracı/anahtar |
| `dn_portrait` | Danışman portre fotoğrafı (ayrı anahtar) |
| `dn_cerez_consent` | Çerez onayı `{v, ts, date, necessary, analytics, marketing}` |
| `dn_leads` | Yakalanan lead'ler (statik-site fallback) |

## 4. ALTIN KURALLAR (bunları BOZMA)
- **Nav + footer her sayfada birebir aynı** olmalı. Footer tek kaynak `content.js` `INNER`; nav her HTML'de
  elle senkron. Değiştirirsen TÜM sayfalara uygula.
- **ProX yeşili `#19c37d`** (rgb 25,195,125) korunur (prox-logo/prox-x).
- **prox-asistan** çıktısında "yapay zeka" / "AI" kelimesi GÖRÜNMEZ (ProX = veritabanı personası). `scrubProx()` filtresi var.
- Terminoloji: "mülk" DEĞİL **"gayrimenkul"**.
- `SAAS_CONFIG` app.js'te **modül-scope**, `window.SAAS_CONFIG` DEĞİL → başka scriptten erişme; localStorage'dan oku.
- JS/CSS değiştirince **`?v=` sürümünü artır** (HTML cache'lenir). Güncel: app.js?v=31, content.js?v=5,
  cerez.js?v=2, base.css?v=21, portfoy.css?v=9, share.js?v=5, ilan-data.js?v=1.
- Değişiklikler **yerel commit** (push YOK, kullanıcı istemedikçe).
- Doğrulama: `bun build <dosya> --target=browser` ile parse; `mcp__Claude_Browser__*` ile runtime (claude-in-chrome KULLANMA).

## 5. Sosyal medya paylaşımı (2026) — nasıl çalışır
- **Gerçek: sosyal ağ paylaşımı yalnızca CANLI (public) URL'de çalışır.** Facebook/WhatsApp crawler'ı
  `localhost`'u OKUYAMAZ. Boş görünmesi kod hatası değil — deploy şart.
- **OG paylaşım sayfaları**: `p/<id>.html` statik `og:title/description/image(kapak)` + Product JSON-LD +
  canonical(ilan) + `noindex`. Paylaş linkleri buraya gider → platform kartı otomatik gösterir. İnsan tıklayınca
  `../ilanlar.html?ilan=<id>`'e yönlenir (deep-link detay açar). **Yeni ilan eklenince jeneratörü tekrar çalıştır:**
  `bun tools/gen-share-pages.mjs https://www.emlakekspertizi.com` (origin argümanı = yayın alan adı).
- **Web Share API L2** (`share.js`): mobilde tek dokunuş — kompoze kart + metin native ekranda hazır (dosya
  olduğu için localhost'ta bile çalışır). `dnShare(item)` cihaz destekliyorsa native, yoksa yardımlı sayfa.
- **Kompoze kart**: `composeShareImage()` 1080×1350 canvas. **TUZAK: `canvas.toBlob('image/jpeg')` bazı
  Chromium'da ~11sn** → `toDataURL('image/jpeg')` (~45ms) + senkron `dataURLtoBlob(base64)` kullan. toBlob KULLANMA.
- Gerçek sunucu-otomatik yayın (danışmanın kendi FB Sayfası/IG'sine) = Meta Graph API + backend + app review (ayrı faz).

## 6. WhatsApp/telefon wiring
`content.js` `dnApplyWaLinks()`: tüm `a[href*="wa.me/"]` + `a[href^="tel:"]` linklerini `dn_iletisim.wa`'ya
yeniden yazar (nav+footer+CTA). Placeholder `905320000000` girilmemiş demek. ilanlar detay render'ından sonra da
`dnApplyWaLinks()` çağrılır. Hardcoded numarayı JS şablonlarına YAZMA.

## 7. Çerez onayı (KVKK)
`cerez.js` — tek KVKK granüler bant (Zorunlu/Analitik/Pazarlama) `dn_cerez_consent`. Onay yoksa varsayılan
REDDEDİLMİŞ. `window.dnConsent = {get, allows, open, reset, onChange}`. Analitik (gtag/GA) yalnız
`dnConsent.allows('analytics')` ise yüklenir. **Köşe pili KALDIRILDI** — yeniden-açma her sayfada footer
"Çerez Tercihleri" linkinde (`dnConsent.open()`). (Eski `content.js` `#dnCookieBar` DEVRE DIŞI — çift bant olmasın.)

## 8. Hızlı iletişim & Yayın sihirbazı
- **Hızlı iletişim modalı** (`content.js` `window.dnQuickContact()`): üst "Ücretsiz Ekspertiz" nav CTA'sı
  bunu açar (Ad+Telefon+not → WhatsApp'tan Gönder / Talebi Gönder). Lead: `dnLead.submit` varsa o, yoksa `dn_leads`.
- **Admin Yayın Sihirbazı** (`app.js` `renderYayin()`, sidebar "🚀 Yayın Hazırlığı"): eksik künye/WhatsApp/ilan/
  portre kontrolü + % + "Düzelt →" ilgili sekmeye atlar.

## 9. YAYIN ÖNCESİ — KALAN İŞLER
**Kod hazır. Kalanlar = VERİ + DEPLOY:**
1. Danışman admin'den **gerçek veriyi** girmeli (Yayın Sihirbazı yol gösterir): WhatsApp/telefon, yasal künye
   (Yetki Belge No, Vergi No/Dairesi, MERSİS, Ünvan, EİDS, KEP, adres), gerçek marka adı, gerçek ilanlar,
   danışman portresi, e-posta.
2. **Deploy** → emlakekspertizi.com/danisman/. Farklı domain ise gen-share-pages'i o domainle çalıştır.
   FB Sharing Debugger ile OG kartını doğrula.
3. **VERİFY-ON-DEPLOY: lead teslimi** — iletisim/asistan/hızlı-iletişim formları ProX `/api/v1/tenant/lead`'e
   gider; canlıda bu uç erişilebilir olmalı, yoksa lead sadece ziyaretçinin tarayıcısında (dn_leads) kalır
   (statik sitenin backend'siz sınırı). WhatsApp kanalı her durumda çalışır.

## 10. Denetim durumu (2026-07-17)
Konsol hatası YOK (8 JS-yoğun sayfa) · kırık iç link/asset YOK · SEO/OG/robots/sitemap/favicon TAM ·
çift çerez bandı düzeltildi · WhatsApp wiring tamam. Detaylı geçmiş: kullanıcı hafızası
`danisman-denetim-backlog` + repo kökü `GAYRIMENKUL-DANISMAN-MIGRASYON-NOTU.md`.

---

## 11. ÇOK-ALAN-ADI (500–5000 domain) — multi-tenant SEO

**Gereksinim:** Aynı statik `danisman/` paketi 500–5000 farklı alan adında AYNI ANDA servis edilir (giderek 5000).

**Zaten domain-bağımsız (kod tarafı):**
- Tüm asset yolları GÖRECELİ (herhangi bir domain/alt-yolda çalışır: `domain.com/` kökü de `domain.com/danisman/` de).
- Kiracı kimliği domainden: `EMLAK_TENANT.domain = location.hostname`, ProX çağrıları `X-Tenant-Id`/`X-Tenant-Key(SUNUCU-TARAFINA TAŞINDI)` ile ayrışır.
- **`EMLAK_API_BASE = https://www.emlakekspertizi.com` MERKEZÎ kalır** (tüm tenant'lar aynı ProX API'yi çağırır; domain başına değişMEZ). CORS açık.
- **canonical + og:url + og:image + twitter:image → çalışma-zamanı JS ile MEVCUT domaine ayarlanır** (content.js, tüm ana sayfalar). Böylece her domain Google'a KENDİ canonical'ını bildirir (yoksa Google hepsini tek domaine birleştirir → SEO ölür). Sunucu ayarı GEREKMEZ.

**Crawler-tam (Facebook OG kartları + sitemap) için sunucu tek-satır kuralı:**
Facebook/WhatsApp OG crawler'ı JS çalıştırmaz; `p/<id>.html` paylaşım sayfaları ve `sitemap.xml`/`robots.txt`
statik `https://www.emlakekspertizi.com` TEMPLATE origin'i içerir. Sunucu, Host'a göre bunu değiştirmeli:
```nginx
# nginx — html + xml + txt yanıtlarında template origin'i istek Host'una çevir
sub_filter 'https://www.emlakekspertizi.com' 'https://$host';
sub_filter_once off;
sub_filter_types text/html application/xml text/plain;
```
(Cloudflare Worker / edge fonksiyonu ile de aynı `replace` yapılabilir.) Böylece TEK kural: main sayfa OG'si + `p/*.html` Facebook kartları + sitemap URL'leri hepsi domain-doğru olur. sub_filter YOKSA: JS zaten Google+tarayıcıyı domain-doğru kılar; yalnız Facebook per-ilan kartı template-domaini (emlakekspertizi.com) gösterir — görsel yine yüklenir (aynı API sunucusundan), link template-domaine gider.

**gen-share-pages.mjs:** hâlâ tek origin argümanı alır (template için `https://www.emlakekspertizi.com` bırakılabilir; sub_filter Host'a çevirir). Ayrı bir "her domain için ayrı dosya" üretimine GEREK YOK — tek paket + sub_filter.
