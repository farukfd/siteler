# Performans & Hata Denetimi Raporu — 3 Site

**Tarih:** 9 Ağustos 2026 · **Yöntem:** 6 paralel denetçi (site × perf/hata mercekleri, dosya-satır kanıt zorunlu, kırık-link iddiasına `ls` kanıtı) + doğrulama + canlı konsol/ağ taraması (no-cache 8799).
Not: dn+ins doğrulayıcı ajanları aylık harcama limitine takıldı; o iki sitenin bulguları ana oturumda tek tek elle doğrulanarak uygulandı.

## Canlı tarama sonucu (3 site)
- **Yerel kaynaklarda sıfır 4xx** — tüm HTML/JS/CSS/görseller 200.
- Dış ProX uçları: anahtarsız proxy-mode istekleri 401 (gm 26 · dn 21 · ins 8; fallback'ler çalışıyor) + henüz açılmamış uçlar 404 (`rates`, `closed-deals`, `google-rating`, eski `tenant/blog/feed`). → Sunucu tarafı istekleri için PROX-API-GEREKSINIM-NOTU kapsamında.

## BU TURDA UYGULANAN DÜZELTMELER ✅

### P1 — kırık/kullanıcı-görür
| Site | Bulgu | Düzeltme |
|---|---|---|
| ins | **Kaçak MOR** `#9333ea` (.st.plan rozetleri, base.css 519+598) — marka yasağı ihlali | Kehribar `#b45309` |
| ins | `emlak-ekspertizi.html` **brand.js iki kez** yükleniyor | İkinci etiket kaldırıldı |
| dn | `emlak-ekspertizi.html` **6 script birebir çift** (head + sayfa sonu: brand/tr-grammar/content/cerez/a11y…) | Sondaki kopyalar kaldırıldı |
| gm | `ilanlar/harita/prox-asistan.html` footer'ları **tanımsız fonksiyon** çağırıyor (closeAllOverlays/openSaasPortal — stub yok) | blog.html stub deseni 3 sayfaya eklendi |
| gm | `harita.html` **wl.js + seo-chrome.js yüklemiyor** → white-label yeniden-markalama bu sayfada ölü | İki script eklendi |
| gm | `prox-asistan.html` WhatsApp **yanlış sabit numara** (905320000000; placeholder desenine de uymadığından hiç düzeltilmiyordu) | Site geneli gerçek değere (905324646464) |
| gm | 8 sayfa **var olmayan** `js/i18n/{blog,sss,urla,karsiyaka,bayrakli,bornova,konak,cesme}.js` enjekte ediyor (TR-dışı dilde 404) | 8 boş sayfa-sözlüğü oluşturuldu (chrome çevirisi _common'dan; sayfa metinleri sonra doldurulur) |
| dn | Kanonik footer'da (content.js) `referanslar.html` + `yatirim-rehberi.html` **hiç yok** — iki gerçek sayfa footer'dan erişilemiyordu | Keşfet/Kurumsal kolonlarına eklendi |
| ins | `_ovReveal` her overlay açılışında **scroll/resize dinleyicisi biriktiriyor** (bellek + perf) | Önceki dinleyiciler sökülür (`_ovRvOff`) |
| dn+ins | `blog.html` 20 statik kartın TAMAMI jenerik `#blog`a gidiyordu — kart-özel haber açılmıyordu | Kartlar **derin-link** (`index.html#blog/<id>`) — tıklanan haber doğrudan açılır (canlıda doğrulandı) |

### P2 — ölçülür performans
- **gm index: 14 script'e `defer`** (~1.02MB JS artık parse'ı bloklamıyor; sıra korunur). **ins: app-core.js (612KB) `defer`.** Duman testleri: blog/manşet/overlay/temel fonksiyonlar üç sitede sağlam.
- **dn ilanlar.html: Leaflet unpkg CDN → vendored** `../shared/vendor/leaflet/` (dış bağımlılık + gecikme gitti).

## DOĞRULANMIŞ, BİLİNÇLİ ERTELENEN (sonraki dalga)
- gm `statik-ortak.css` ↔ `base.css` %99 çatallanmış kopya (421/420 seçici aynı) — base-core/delta ayrıştırması ayrı, dikkatli bir refactor.
- gm `content-studio.js` lazy-load — public blog blocks-render bağımlılığı nedeniyle basit lazy KIRAR; ihtiyaç-anında-yükle deseni tasarlanmalı (defer şimdilik kazancı aldı).
- gm `TR_ILILCE` çift kopya (app.js gömülü + tr-iller.js) — app.js'ten söküm ayrı test ister.
- gm Leaflet'i IO-lazy başlatma (renderHaritaMap/renderIletMap fold-altı) — orta kazanç.
- dn ilanlar `oninput→ilRender` debounce + `pfReveal` IO tekilleştirme; dn/ins scroll dinleyicisi rAF-throttle; dn sayfa-özel ~22KB Stitch style bloklarının ortaklaştırılması.
- ins `index.html` JSON-LD `streetAddress` doldurulmalı; ins `emlak-ekspertizi.html` demo-band farkı; ins/dn yeni sayfaların sayfa-özel i18n sözlükleri (blog/harita/emlak-ekspertizi) — çeviri içerik işi.
- proxApi kısa-devre önerisi: `EMLAK_PROXY_MODE && !EMLAK_PROXY_URL` iken uzak isteğe hiç çıkmadan fallback (26+21+8 boşa 401'i keser) — tüm proxApi kopyalarına tek desen.

## Sunucu-tarafı istekler (emlakekspertizi.com)
1. `/api/blog/*` CORS başlığı çift `Access-Control-Allow-Origin` döndürüyor (bozuk) — düzelirse lokalde de canlı haber akar.
2. `tenant/rates`, `tenant/closed-deals`, `tenant/google-rating`, `tenant/blog/feed` uçları 404 — açılınca ilgili modüller canlıya döner.
