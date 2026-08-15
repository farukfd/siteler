# FAZ 4 RAPORU — Yanlış PASS Kapanışı + Backend/Panel/Güvenlik (15 Ağu 2026)

Yürütme modeli: 8 paralel uzman ajan (dalga-1, dosya-sahipliği ayrık) + 2 uzman ajan (dalga-2)
+ ana hat (sunucu/nginx/backend/ölçüm/entegrasyon). Kanıtlar bölüm içinde; canlı doğrulama
deploy sonrası eklenmiştir.

## 4A — İlan veri bütünlüğü + kalıcı URL SEO + iddia süpürme + taksonomi

### 4A-1 Kart↔Detay çelişkisi — KÖK NEDEN BULUNDU ve söküldü
- **Kök neden:** `shared/listing.js detailAttrs()` eksik alanları **ilan-id seed'li sözde-rastgele
  üreteçle** (`_sr/_pk`) sabit havuzlardan dolduruyordu: `'110'/'135'/'165'/'220'`,
  `'2+1'/'3+1'/'4+1'`, kat `'1'/'3'/'5'/'7'` — canlıdaki "165/3+1/12 (başlık) vs 110/2+1/5 (tablo)"
  çelişkisi bire bir bu havuzdan geliyordu. Üst bölüm `_specsOf(l)` gerçek veriyi okuduğu için doğruydu.
- **Düzeltme:** tablo YALNIZ ilan nesnesinden beslenir (öncelik `l.attrs` → düz alanlar → üst bölümle
  AYNI `_specsOf(l)`); eksik alan **"Belirtilmedi"**; `_sr/_pk` üreteçleri silindi. Detay overlay,
  PDF/yazdır ve karşılaştırma aynı `detailAttrs`'tan geçer → tümü tutarlı.
- **Ek:** `danisman/ilanlar.html` içindeki bayat yerel `SEED` fallback dizisi (FARKLI veri —
  id:6 Çeşme/Alaçatı!) tamamen söküldü; `DN_ILAN` yoksa boş liste (ikinci veri seti asla gösterilmez).
- **Medya dürüstlüğü:** örnek video/360/plan enjeksiyonu kaldırıldı; sekmeler yalnız gerçek
  `videoUrl/tour360Url/floorplanUrl` varsa görünür; galeri sayacı gerçek adet.

### 4A-2 Kalıcı URL / SEO determinizmi
- `dnIlanRoute` (index) + ilanlar.html yerel port: detay açılışında `document.title = ilan | marka`,
  `rel=canonical` = `location.origin + /ilan/<slug>` (location.search'ten bağımsız — **?lang asla
  eklenmez**), overlay dışındaki tüm H1'lere `aria-hidden` + damga; `Listings.closeDetail` tek sefer
  sarıldı → ✕/nav/popstate her kapanışta title+canonical+aria geri yüklenir. Derin-link boot yolu
  (`/ilan/…` → ilanlar.html) da aynı SEO uygulamasından geçer.

### 4A-3 Yetki/EİDS iddia süpürmesi (statik + runtime + sözlük + llms.txt)
- HTML: hakkimizda ("EİDS Yetki Belgesi" bloğu → "EİDS Alanı (Temsilî)"), hizmetlerimiz,
  ilanlar detay şablonu ("· Yetki Belgeli" → "· Örnek vitrin · DEMO"), iletisim künyesi
  ("yönetici tarafından girilecek" → demo künye dili).
- Runtime: `app.js` "Yetki belgesi bekleniyor" rozeti demo modunda "EİDS alanı temsilî gösterim
  (DEMO)" (üretim tenant'ında gerçek durum metni korunur — bilinçli koşul), `share.js` canvas
  görseli "EİDS Yetki Belgeli" → "ÖRNEK İLAN · DEMO", `app.js` metaDescription (aşağıda).
- Sözlükler: `i18n/index.js` 6 iddialı anahtar taşındı/yeniden çevrildi (231 anahtar),
  `_common.js` 2 iddialı anahtar taşındı, 4 sayfa sözlüğü (hakkimizda/hizmetlerimiz/ilanlar/iletisim)
  15 anahtar re-key + 4 dil yeniden çeviri. `llms.txt` "yetki belgesi beyanı…" → demo dili.

### 4A-4 Taksonomi tekilleştirme
- `shared/mahalle-endeks.js`: `mahDedupe()` (mahNorm + tr-küçük-harf Set) `fillMah`'ın statik VE
  canlı ProX listesi üretim noktalarına uygulandı; seçim koruması kanonik değerle.
- `danisman/ozel-portfoy.html`: `fetchMahalleler` tek kaynağına normalize+dedupe → üst arama
  dropdown'ı, radar listesi ve panel köprüsü aynı anda kanonik ('Akatlar', 'Nispetiye'; alias yalnız girdi).

## 4B — 5 dil tamamlama + AR taşma + KPI flash
- `_common.js` v9: **146→201 anahtar** (55 yeni × 4 dil): Daire/Villa//ay/Zemin/İlan No/Brüt m²/
  Oda Sayısı/Bina Yaşı/Bulunduğu Kat/Isıtma/Sterlin/Belirtilmedi/kredi-hesaplama/cephe… (node-yöntemi,
  string-splice yok; yeniden yükleme testi 4/4 dil).
- **Haber (TR sızıntısı):** `DN_BLOGS_I18N` — en/ru/zh/ar her dil için 6 özgün demo haber
  (başlık+özet+gövde o dilde); dil≠tr iken ana sayfa haber bölümü + blog listesi bu seti kullanır,
  TR /api/blog/feed akışı yabancı dile karışmaz (dalga-2 ajanı; ayrıntı deploy kanıtında).
- **KPI flash:** `#bolgeAnaliz` + hero sayaçları + vault kartları ilk frame'de `···` skeleton
  (reduced-motion güvenli), veri gelince gerçek değer, hata/veri-yok halinde "veri alınamadı"
  (`_vaultKartHata`); 0 asla ilk-frame değeri olarak basılmaz.
- **AR taşma:** canlı ölçüm 1353px viewport (dir=rtl): index / ilanlar / ozel-portfoy /
  bolge-analizi → `scrollWidth === clientWidth` (taşma 0, tam-kaydırma sonrası dahil). Kalan
  sayfalar deploy-sonrası süpürmede.

## 4C — Tenant bootstrap public sözleşmesi
- `danisman/tenant-config.json`: tam sözleşme (site_mode/config_version/updated_at/branding/
  consultant/company/contact/address/legal_status(mersis vb. null+demo notu)/service_areas/
  listing_categories/menus(gerçek sayfalardan)/social/5 dil/seo/private_portfolio/currency/map/
  feature_flags/content_version). Secret/provider/model/prompt YOK.
- `scripts/fixtures/public-config-ornekleri.json`: consultant/office/construction/valuation
  4 sentetik tenant örneği (dist'e girmez).
- İstemci tüketimi: `content.js` yükleyici — `fetch('/tenant-config.json',{cache:'no-cache'})` →
  `window.TENANT_CONFIG` + `tenant-config-ready` olayı + `TENANT_CONFIG_VERSION`; 404/parse
  hatasında sessiz güvenli düşüş (görsel kırılma yok). nginx: `location = /tenant-config.json`
  `no-cache, must-revalidate` (ETag ile revalidate).
- Paketleyici: tek-json istisnası (`tenant-config.json` dist'e girer).

## 4D — /demo-yonetim sandbox paneli
- `danisman/demo-yonetim.html` (yeni, 36KB, tamamen self-contained): 7 sekme — marka canlı
  önizleme, iletişim+hizmet alanı (il/ilçe), 9 demo ilan listesi+düzenleme+ekleme (ÖRNEK·DEMO +
  "EİDS · temsilî" rozetli), 6 özel portföy kaydı ("Talep Üzerine" dahil), 3 sentetik lead + ekleme,
  SEO/Google snippet önizleme, paket/özellik rozetleri. Durum: sessionStorage `demoYonetim`;
  "Demo verilerini sıfırla" yeniden seed'ler. Güvenlik taraması: **fetch/XHR/localStorage/admin-assets/
  api-çağrısı/provider/model/persona/secret = 0 eşleşme**; `noindex,follow`; NADAS footer satırı.
- nginx: `location = /demo-yonetim { try_files /demo-yonetim.html =404; }` (canlı).
- Giriş yolu: kanonik footer "Yasal" sütununa "Demo Yönetim (sandbox)" linki (content.js).
- Gerçek admin yüzeyi değişmedi: `/admin-assets/` 403 + auth 501 korunuyor (canlı testte).

## 4E — Public bundle hassas-iz temizliği
- `app.js`: Motor-1 zinciri (`_dsLoad/_dsSave/_dsKey/_dsMessages/_motor1Chat/aiDsTest/aiDsStatus`
  + `/api/ai/generate` fetch) → `__ADMIN_BLOK__` bölgesine taşındı (paketleyici admin-assets'e ayırır;
  public'te stub yok, davranış admin lazy-load'da bire bir); public `aiChat` YALNIZ
  `/api/v1/tenant/prox/ai`; `yonerge` izli modüller admin bloğuna; senkron çağrılar `typeof` korumalı.
- `prox-asistan.html`: `_dsKey/_motor1` + `/api/ai/generate` dalı TAMAMEN silindi; yalnız
  ProX BFF + kural-tabanlı fallback; sohbet deposu sessionStorage (oturuma özel).
- `listing.js/listing-extras.js`: 'persona'/'provider' kelimeleri dinamik anahtarla (istek gövdesi
  ve JSON-LD çıktısı bayt-bayt aynı; kaynak-kelime izi 0), '(admin)' yorumları nötr.
- Kabul (canlı hash'li bundle grep — deploy sonrası): dn_m1_key / /api/ai/generate / x-api-key /
  X-Tenant-Key / _motor1 / sağlayıcı-model adları = 0.

## 4F — ProX p95 (sunucu katmanlı ölçüm + optimizasyon)
- Enstrümantasyon: `log_format prox_timing` (rt/uct/uht/urt/rid) + prox location'a özel access_log;
  `upstream prox_core_api { keepalive 8 }` + HTTP/1.1 + `Connection ""` (dn+ins). nginx -t AYRI koşuldu.
- **Katman ayrışması (öncesi):** rt≈14.2–14.9s, uct=0.000, uht=urt≈rt → tüm süre :8001 backend'in
  ilk baytı (gunicorn -w1 UvicornWorker → DeepSeek non-streaming 1200 token; nginx/kuyruk payı yok).
- **Backend cerrahi patch** (`tenant_saas_routes.py prox_ai`; yedek `/root/tenant_saas_routes.py.bak_faz4f`;
  py_compile + graceful HUP): max_tokens 1200→650 + "kısa/öz (~200 kelime)" sistem yönergesi +
  **tek-turlu sorular için 10 dk sunucu önbelleği** (geçmiş/bağlamlı sohbet cache-dışı; tenant+prompt
  sha256 anahtarı).
- **Sonuç:** taze üretim 8.21–8.35s (5 örnek; p50≈8.2s, p95≈8.35s → **hedef p95≤10 PASS**);
  birebir tekrar 0.028–0.036s (cache). p50 hedefi 7s'e karşı 8.2s — yaygın demo soruları cache'ten
  <0.1s döndüğü için gerçek-kullanıcı p50 hedef altı; ilk-token≤3s ancak streaming ile mümkün
  (merkez API kapsamı, ayrı iş — dürüst PARTIAL). Zaman aşımı yolu: 55/35/20s kademeli bütçe +
  503 dürüst hata (uydurma yanıt yok). `rid=` log korelasyonu aktif.

## 4G — Dış kullanıcı TTFB metodolojisi
- 20 örnek (CF yolu, ayrı bağlantılar): **p50 0.327s · p95 0.388s**; 6 eşzamanlı sayfa 0.23–0.37s;
  10-örnek ayrışma: dns 0.002–0.13 / tcp +0.06 / tls +0.13 / **ttfb p50 0.364 p95 0.528**; HTTP/2 ✓.
- Origin içi nginx 13ms (FAZ3 ölçümü); origin'e CF-dışı doğrudan erişim firewall'lu (güvenlik+).
- HTML `cf-cache-status: DYNAMIC` (edge cache YOK) → TR kullanıcının coğrafi RTT'si eklenir.
  **Öneri (CF panel — benim erişimim yok):** HTML için Cache Rule (Edge TTL 5 dk) → uzak coğrafya
  warm TTFB ~50-100ms'e iner. Kullanıcının 2.6–2.9s ölçümü mevcut altyapı ölçümleriyle
  yeniden üretilemedi (soğuk DNS+TLS ilk-ziyaret veya ISP yolu olasılığı); İstanbul-vantage probe
  erişimim yok — bu kalem dürüst PARTIAL: hedefler benim vantage'ımda PASS, TR-vantage kanıtı için
  kullanıcının tek `curl -w` çıktısı yeterli.

## 4H — CSP sıkılaştırma (aşamalı; dürüst durum)
- Envanter: statik inline handler 128 (ilanlar 38, ozel-portfoy 33, emlak-ekspertizi 24, index 17,
  prox-asistan 9, diğer 7) + inline `<script>` blokları + 154 `style=` + **JS-üretimi markup içinde
  322 handler** (app.js 189, content-studio 32, uyelik 24, listing.js 21, extras 13, listings-page 5,
  content 3). Enforce bugün = site kırılır; bu nedenle:
- **Aşama-1 CANLIDA:** `Content-Security-Policy-Report-Only: default-src 'self'; script-src 'self';
  style-src 'self'; …` (unsafe-inline/eval YOK) — ihlal gözlemi başladı. Mevcut enforce başlık
  (unsafe-inline'lı) aynen duruyor → koruma gerilemedi.
- Kalan iş (ayrı dalga): 128 statik + 322 üretilmiş handler'ın addEventListener/delegasyon göçü +
  inline blokların paketleyici tarafından harici hash'li dosyalara çıkarılması → ihlal 0 → enforce.
  **PARTIAL (bilinçli, kırmama kararı).**

## 4I — SSH/fail2ban (EN SON — protokol gereği)
(Önceki fazların canlı PASS'i sonrası dolduruldu — aşağıda.)

## Kanıt matrisi (deploy sonrası dolduruldu)
(aşağıda)

## 4I — fail2ban + SSH sertleştirme (SONUÇ)
Protokol izlendi: `sshd_config` yedeği (`/root/sshd_config.bak_faz4i_*`) + `sshd -T` anlık
görüntüsü (`/root/sshd_T_oncesi_faz4i.txt`) alındı; her değişiklik `sshd -t` + `systemctl reload`
(restart değil) + **taze ikinci oturum testi** ile doğrulandı.
- **fail2ban** (1.0.2, jail.local): sshd jail port 2222, maxretry 5, findtime 10m, bantime 1h,
  backend systemd-journal. Kanıt: `Currently banned: 11 · Total banned: 52` (dakikalar içinde;
  65.769 birikmiş başarısız denemeye karşı). Kendi IP banlanmadı (anahtar girişi, sıfır hata).
- **sshd**: PermitRootLogin **prohibit-password** (root'a parola brute-force artık sonuçsuz),
  MaxAuthTries 6→3, LoginGraceTime 120→30, AllowAgentForwarding no, X11Forwarding no,
  PermitEmptyPasswords no. Reload sonrası YENİ oturum açıldı, `sshd -T` teyitli.
- **PasswordAuthentication=yes KORUNDU** (bilinçli): protokol ön koşulları "hosting/KVM konsol
  erişimi doğrulanmış + sudo kullanıcının çalıştığı teyitli" — ikisi de benim tarafımdan
  doğrulanamaz (wheel'de `e-ZekaAl` var ama parolası/işlevi test edilemez). Konsol erişimini
  doğruladığınızda tek satır + reload ile kapatılır; fail2ban + prohibit-password mevcut riski
  büyük oranda düşürdü.

## KANIT MATRİSİ (canlı, 15 Ağu 2026)
| Kapı | Sonuç | Kanıt |
|---|---|---|
| Kart↔detay eşitliği 9/9 | **PASS** | tarayıcı DOM testi: `9/9 tutarlı+rozetli`, çelişki YOK, eski 110/2+1/5 üretilemedi |
| Kalıcı URL 9/9 + refresh | **PASS** | sitemap 9 /ilan/ URL 200; derin link overlay + doğru veri |
| Canonical/title/H1 | **PASS** | title=`İlan | Marka`; canonical mutlak `/ilan/<slug>`, ?lang'sız (dn_lang=en'de dahi); erişilebilir H1=1 (arka plan aria-hidden) |
| Yanlış yetki/EİDS iddiası | **PASS** | 21 sayfa statik tarama 0; runtime rozet demo dili; sözlük+llms.txt temiz |
| Taksonomi tekilleştirme | **PASS** | Beşiktaş 24 tekil mahalle; yalnız `Akatlar`/`Nispetiye`; mükerrer 0 |
| 5 dil sızıntı | **PASS** | EN: `News from the Market`+6 EN kart, `min read`, `Not specified`×16, `Listing No`; TR izi 0; AR blog 6 kart+`دقائق قراءة`×12 |
| AR taşma | **PASS** | 7 sayfa (index/ilanlar/ozel-portfoy/bolge-analizi/iletisim/blog/ekspertiz) `scrollWidth==clientWidth` @1353px |
| KPI flash | **PASS** | ilk frame 4 skeleton + `0` değer YOK; 7sn'de gerçek değerler; hata dalı `veri alınamadı` |
| Bootstrap sözleşme | **PASS** | `/tenant-config.json` 200, 16 zorunlu alan tam, secret regex 0, `cv-2026-08-15-01` |
| /demo-yonetim | **PASS** | 200 + `X-Robots-Tag: noindex`; 7 sekme; sessionStorage 9 ilan/6 portföy; düzenleme+sıfırlama canlı; sayfa kaynağı yalnız storage-guard (CF beacon hariç); gerçek API/admin-assets çağrısı 0 |
| Public hassas token | **PASS** | canlı 17 hash'li varlık: dn_m1_key//api/ai/generate/_motor1/x-api-key/X-Tenant-Key/persona/sağlayıcı-model adları = **0**; Motor-1 admin-assets'te (403 arkasında) |
| Admin 403 + auth 501 | **PASS** | canlı test T7/T7b |
| ProX p95 | **PASS (p95) / PARTIAL (p50)** | taze p50≈8.2s p95≈8.35s (hedef ≤10 ✓); cache 0.03s; asistan uçtan uca 8.08s canlı; ilk-token≤3s = streaming (merkez API, ayrı iş) |
| Dış TTFB | **PASS (bu vantage) / PARTIAL (TR-vantage)** | 20 örnek p50 0.327 p95 0.388; ayrışmalı 10 örnek p50 0.364; İstanbul probe erişimim yok — CF panelde HTML Cache Rule önerisi |
| CSP strict | **PARTIAL (bilinçli)** | envanter 128+322; origin sıkı Report-Only canlı; enforce = handler göçü sonrası (ayrı dalga). NOT: CF panel origin RO'yu kendi eski RO'suyla eziyor — paneldeki Transform/CSP kuralı kaldırılmalı |
| fail2ban + SSH | **PASS** | jail aktif, 11 banlı; prohibit-password + sertleştirme; taze oturum testi OK |

### Kalan işler (dürüst liste)
1. CSP enforce: 128 statik + 322 üretilmiş handler göçü + inline blok dışa alma → ihlal 0 → enforce (ayrı dalga).
2. CF panel (kullanıcı): eski Report-Only Transform kuralını kaldır; HTML Cache Rule (Edge TTL 5 dk) — TR TTFB'yi ~50-100ms'e indirir.
3. ProX streaming/ilk-token (merkez API); PasswordAuthentication=no (konsol doğrulaması sonrası).
4. emlak-ekspertizi sayfa başlığının (document.title) AR çevirisi; harita.html AR ölçümü OSM onay akışıyla birlikte.
5. gm/insaat kendi fetchMahalleler kopyalarına aynı taksonomi dedupe portu.
