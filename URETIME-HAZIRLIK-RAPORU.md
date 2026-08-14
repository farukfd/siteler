# ÜRETİME HAZIRLIK RAPORU — insaat & danisman.emlakekspertizi.com
**Tarih:** 14 Ağustos 2026 · **Kapsam:** istemci kod tabanı (bu repo) + üretim paketi (dist/) + sunucu-katmanı spesifikasyonu
**DURUM: TAMAMLANMADI** — istemci-tarafı P0/P1 kalemleri uygulandı ve kanıtlandı; 11 kriter sunucu/edge katmanı gerektirir (bu repoda backend yok). Aşağıdaki matris nihai gerçektir.

## 0) Kritik dürüstlük notu
Bu repo statik front-end'dir. Argon2id auth, HttpOnly oturum, CSRF, BFF, gerçek 301/404, CSP başlıkları, AI gateway ve vault **emlakekspertizi.com sunucu tarafında** uygulanmalıdır — uç sözleşmeleri §6'da hazırdır. İstemci artık bu sözleşmeye göre konuşur; sunucu gelmeden admin girişi ve canlı veri üretimde ÇALIŞMAZ (bilinçli: sessiz-demo-fallback kaldırıldı).

## 1) Değişiklik özeti (dosya bazlı)
**Credential/PII (P0.1):**
- `danisman/js/app.js` — `_ADMIN_USER/_ADMIN_PASS` silindi; `adminLogin()` → `POST /api/auth/admin/login` (same-origin, credentials). `karsiTC→karsiKimlik`.
- `insaat/js/app-core.js` — `admUser/admPass` varsayılanları + `ins_admpass_reset_1234` göç bloğu silindi; `admLogin()` → aynı sözleşme; şifre-değiştir → `POST /api/auth/admin/password`; DOM id `admPass/admUser→advPwd/advUsr` (`insaat/js/admin-markup.js` eş güncellendi); demo firma kimlik no'ları nötrlendi.
**AI anahtarları (P0.3):** `shared/cs-engine.js` — `api.anthropic/deepseek/openai` doğrudan çağrıları → same-origin `/api/ai/{anthropic|deepseek|openai}`; `x-api-key` + `anthropic-dangerous-direct-browser-access` tamamen silindi; BYOK localStorage yazımı yalnız `EMLAK_DEMO===true`.
**Same-origin tenant (P0.4):** tüm `proxApi` kopyaları (dn index/prox-asistan/ozel-portfoy/bolge-analizi/lead.js + ins index) — `X-Tenant-Id/X-Tenant-Key` başlıkları KALDIRILDI, taban `''`; `dn_prox/dn_dskey` anahtar enjeksiyonları silindi (adlar `dn_pfx*` snapshot-önbelleğine daraltıldı); `EMLAK_PROXY_MODE` → `EMLAK_DEMO` bayrağı; `(BASE||'https://www...')` mutlak-fallback desenleri temizlendi. Üretimde fallback: `{fallback:true,error:true,data:null}` + `EMLAK_TELEMETRY('api_fail')` — sahte veri üretilmez, sessiz değildir.
**Lead/PII (P0.5):** `submitLead` catch → üretimde `{ok:false,offline:true}` + telemetry; localStorage yazımı yalnız DEMO. Kullanıcıya başarı ancak API başarısında gösterilir (canlı kanıt §5).
**Public/admin ayrımı (P0.1):** `content-studio.js` + `cs-engine.js` public index'lerden çıkarıldı; `csMountDN/csMountINS` lazy `_csModulYukle` ile yükler; paketleyici bunları + `admin-markup.js`'i **`/admin-assets/`** dizinine ayırır (edge'de auth arkasına alınacak — §6).
**Paketleyici (P0.6/P1):** `scripts/uretim-paketle.py` — subdomain canonical/OG/JSON-LD/sitemap; TEK robots (`index,follow,max-image-preview:large`); `EMLAK_DEMO=false`; `EMLAK_API_BASE=""`; `../shared→shared/`; CANLI-DEMO bandı 19 sayfadan söküldü; `href="index.html→/`; robots.txt+sitemap üretimi; dn `p/` GitHub-Pages stub'ları ve ins 6 alias dizini paket-dışı; **leakage scanner** (yasak dizeler + regex çapraz-tenant, `Selin Meridyen Gayrimenkul` meşru-unvan lookbehind'lı) — bulguda paket DURUR.
**Kabul koşucusu:** `scripts/kabul-testi.py` — matris §5.

## 2) Mimari değişiklik diyagramı
```
ÖNCE  Tarayıcı ──X-Tenant-Key──▶ www.emlakekspertizi.com/api  (401→sessiz demo-fallback)
      Tarayıcı ──x-api-key────▶ api.anthropic.com / deepseek / openai
      admin/1234 karşılaştırması + CRM/PII → localStorage

SONRA Tarayıcı ── yalnız same-origin ──▶ https://<tenant-sub>/api/*  ─BFF(edge)─▶ merkezi API
                                            │  tenant = Host'tan; secret yalnız sunucuda
                                            ├─ /api/auth/*  (Argon2id, HttpOnly oturum, MFA)
                                            ├─ /api/ai/*    (gateway: vault-BYOK, kota, allowlist)
                                            └─ /api/v1/tenant/* (lead, bootstrap, veri)
      /admin-assets/*  = edge-auth arkasında ayrı teslim
      EMLAK_DEMO=false → fallback yok; hata görünür + EMLAK_TELEMETRY
```

## 3) Migration & rollback
**Migration:** (1) `python3 scripts/uretim-paketle.py` → `dist/<site>` yükle; (2) edge kuralları: §6 redirect/404/başlık tablosu; (3) backend uçlarını §6 sözleşmesiyle aç; (4) smoke: `scripts/kabul-testi.py` + canlı HTTP kabulleri.
**Rollback:** dist önceki sürümü geri yükle (statik, atomik); kaynak repo değişiklikleri commit-bazlı geri alınabilir (`git revert <bu-commit>`); backend uçları kapatılırsa site çalışır ama admin/canlı-veri kapalı kalır (tasarım gereği güvenli-başarısız).

## 4) Secret rotasyon listesi
1. **ProX tenant anahtarları (TÜM tenant'lar)** — git geçmişinde bulunmuştu (scripts/prox-keys.local.json'a taşınmadan önce): emlakekspertizi.com panelinden ROTATE. *(Önceden raporlanmıştı; hâlâ bekliyor.)*
2. Admin parolaları — istemcideki `admin/1234` kamuya açıktı: sunucu-auth açılırken tüm tenant admin hesapları yeni parola + Argon2id + zorunlu MFA.
3. Kullanıcıların girmiş olabileceği BYOK anahtarları (DeepSeek/OpenAI/Anthropic/Pexels) — localStorage'da durmuş olabilir: vault'a taşı + sağlayıcı panelinden rotate; ilk üretim girişinde istemci `localStorage` anahtar kalıntılarını temizlesin (öneri: sunucu login yanıtında `purgeLegacyKeys:true`).

## 5) Kabul matrisi — GERÇEK KOŞUCU ÇIKTISI (scripts/kabul-testi.py)
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
[PARTIAL] #10 insaat: tek H1 (statik sayım)
         0-H1:[] çok-H1:['index.html(6)'] (SPA-render H1'ler statik sayımda görünmez)
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
{'PASS': 21, 'PARTIAL': 4, 'BLOCKED': 11}

```
**Canlı dist kabulleri (Chromium, http://localhost:8802 = dist/danisman):**
- #2 storage: `pii:[] anahtar:[]` (4 kayıt: tema/i18n tercihleri) — PASS
- #3 istemci ayağı: `disKaynak:[]` (fontlar hariç dış istek SIFIR), tenant-key ağda YOK — PASS (bootstrap-200 → BLOCKED-backend)
- #13 canlı: API'siz `submitLead → {ok:false, offline:true}`, storage'a yazmadı — PASS

## 6) SUNUCU/EDGE GEREKSİNİM SPESİFİKASYONU (BLOCKED kalemlerin sahibi)
**Uçlar (same-origin, tenant=Host):**
- `POST /api/auth/admin/login {user,pass}` → 200 `{ok:true}` + `Set-Cookie: sid=…; HttpOnly; Secure; SameSite=Strict; Max-Age≤3600` · Argon2id · 5 deneme/15dk kilit · audit-log · MFA(TOTP) tercihen. 401 genel mesaj.
- `POST /api/auth/admin/password {current,next,user}` · oturum + CSRF token zorunlu.
- `POST /api/ai/{anthropic|deepseek|openai}` `{model?,messages,max_tokens?,temperature?}` → vault-BYOK/tenant anahtarı sunucu ekler; model-allowlist, kota, 30sn timeout, 64KB gövde sınırı; loglarda prompt/PII/anahtar YOK.
- `GET /api/v1/tenant/bootstrap` → 200 `{package,enabled_features,brand…}` (Host→tenant); başarısızlık = izlenebilir hata (istemci artık demoya düşmez).
- `POST /api/v1/tenant/lead` → rate-limit + bot koruması + idempotency-key + boyut sınırı + KVKK rıza versiyon/zaman damgası kaydı + saklama/silme politikası.
- `GET /api/blog/posts…` → BFF merkezi habere proxy'ler (çift-ACAO CORS bozukluğu da böylece kapanır).
- Bilinmeyen `/api/*` → `404 {"error":"not_found"}` (JSON).
**Edge kuralları:** `/index.html→/ 301` · ins alias `/bolge,/hizmetler,/iletisim,/projeler,/soru-cevap,/asistan → ilgili .html 301 (tek adım)` · bilinmeyen HTML→gerçek 404 (404.html, noindex) · `/admin-assets/*` auth'suz→401/403 · `X-Robots-Tag` çelişkisiz · CSP (nonce'lu script-src; inline'ların nonce'lanması Faz-2 refactor) + `frame-ancestors 'none'` + HSTS · statik varlıklara immutable cache (?v= hashli), HTML no-cache; cache-key'e Host dahil (tenant karışmaz).

## 7) Sayfa SEO matrisi / menü raporu / bundle
- SEO hijyeni: koşucu §5 — tek-robots/tek-canonical/lang/title/JSON-LD/kırık-link/sitemap iki sitede PASS (dist).
- Menü: statik alt-sayfalar site-içinde birebir aynı sete normalize; kalan varyantlar SPA-index nav'ının JS basımından (koşucu PARTIAL notu) — TenantHeader/Footer tam merkezileştirme refactor'u ertelenenlerde.
- Bundle: public HTML'lerden studio+engine+admin çıkarıldı (dn index ~-165KB istek; admin-assets: dn 2 · ins 3 dosya). 200KB/route gzip bütçesi ve monolit `app-core(602KB)/app.js(596KB)` bölünmesi ertelenen-listede.

## 8) BAŞARISIZ / ERTELENEN kriterler (açık liste)
1. (#3/4/5/6/7/8/9/16 kısmen/19) Sunucu-edge kalemleri — §6 spec'iyle BLOCKED.
2. (#15 PARTIAL) app.js/app-core içindeki admin FONKSİYON gövdeleri hâlâ public JS'te (markup/studio/engine ayrıldı) — monolit bölme refactor'u.
3. (#18) SSR dil rotaları (/tr,/en,/ar + hreflang + RTL kaynak-HTML) — istemci i18n mevcut; SSR üretimi ayrı iş.
4. (#10 PARTIAL) SPA-render H1'ler statik sayımda görünmez; ins index'te çoklu-H1 (statik 6) temizliği yapılmadı.
5. (#16) Inline-script'lerin nonce/hash'e taşınması (büyük refactor) — CSP başlığı edge'de Report-Only ile başlamalı.
6. (#12 PARTIAL) SPA-index nav varyantı; (#17) WebGL fallback testi; Lighthouse/RUM ölçümü (canlı ortam ister).
