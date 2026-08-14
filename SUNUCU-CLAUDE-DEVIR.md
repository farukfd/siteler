# NADAS-WEB-2030 — Sunucu Claude'una Güncel Devir + Güvenlik Denetimi

> **Kime:** Bu repoyu sunucuda yayına alacak/yönetecek Claude ajanına.
> **Son güncelleme:** 2026-07-31. **Branch:** `feat/dwg-prox-gercek-veri` (push edildi).
> Bu belge, son çalışmaların (5-dilli i18n, ProX anahtar düzeltmesi, admin QA) **güncel özet devridir.**
> Detaylı proxy/güvenlik kurulumu için ayrıca bkz. **`DEPLOY-VE-GUVENLIK-NOTU.md`** (Cloudflare Worker iskeleti + kontrol listesi).

---

## 0) TEK CÜMLE
Beş bağımsız **statik** dikey site (build YOK, server-runtime YOK). Dosyaları olduğu gibi statik servis et; her biri kendi domainine ayrı yayınlanır. Tek kritik konu **hash-tabanlı routing** (rewrite gerekmez) ve **ProX tenant anahtarı güvenliği** (proxy modu).

---

## 1) SİTELER — GÜNCEL DURUM

| Klasör | Marka / Sektör | i18n | ProX tenant | Not |
|---|---|---|---|---|
| `danisman/` | Selin Meridyen · lüks konut danışmanı | **5 dil** TR·EN·RU·ZH·AR | `consultant` ✅ canlı | admin paneli CRM (SaaS) |
| `gayrimenkul/` | Meridyen Gayrimenkul · İzmir ofisi | **5 dil** + dinamik kart token'ları | `emlaktahadimkoy_com` ✅ canlı (**düzeltildi**) | eski `office` anahtarı geçersizdi |
| `insaat/` | Meridyen Yapı · kurumsal inşaat | **5 dil** TR·EN·RU·ZH·AR | `construction` ✅ canlı | SPA + 5 statik SEO sayfası |
| `nadas/` | NADAS · emlak veri-altyapısı | **5 dil** TR·EN·RU·ZH·AR | `nadas` ✅ canlı | ana marka; core.js motoru (i18n.js değil), 20 sayfa |
| `degerleme/` | Değerleme / ekspertiz | **5 dil** TR·EN·RU·ZH·AR | `valuation` · **`INJECT_AT_DEPLOY`** | anahtar deploy'da enjekte (güvenli desen) |

**i18n motoru** (danisman/gayrimenkul/insaat): sayfa-içi `js/i18n.js` + `js/i18n/_common.js` + `js/i18n/<sayfa>.js`; anahtar `dn_lang`/`gm_lang`/`in_lang`; `?lang=` URL > localStorage > tr; RTL (ar); post-render TreeWalker + MutationObserver. **gayrimenkul** ayrıca dinamik ilan-kartı için motor-içi güvenli **token geçişi** (kat/ilan/kişi/₺ birim kalıpları; il/ilçe/mahalle Latin + TL sabit). Statik dosyalar; server tarafı iş yok.

---

## 2) DEPLOY — SUNUCUNUN YAPMASI GEREKENLER

1. **Statik servis** — dosyaları olduğu gibi sun; `index.html` dizin varsayılanı.
2. **Hash routing** — overlay URL'leri (`#admin`, `#giris`, `#bolge`…) sunucuya gitmez; **clean-URL rewrite GEREKMEZ.** F5 güvenli (boot hash'i okur).
3. **Tek dikey yayını** — sadece bir klasör yayınlanacaksa (ör. `insaat/`) diğerlerini publish ETME.
4. **Cache** — HTML `no-store` veya kısa TTL (i18n/dict sürümleri `?v=` ile bust'lanıyor); statik varlıklar uzun TTL.
5. **robots.txt + sitemap.xml** her domainde doğru (admin "SEO dosyaları üret").
6. **degerleme:** deploy-zamanı `tenant_key: 'INJECT_AT_DEPLOY'` → gerçek anahtarla değiştir (secret'tan).

---

## 3) 🔴 GÜVENLİK DENETİMİ (yayın öncesi)

### P0 — İstemcide gömülü ProX tenant anahtarları  *(üretim engelleyici)*
`view-source` ile görünür, `X-Tenant-Key` header'ında gönderilir (CORS açık):
- danisman `prox_consultant_…` · gayrimenkul `prox_emlaktahadimkoy_com_…` · insaat `prox_construction_…` · nadas `prox_nadas_…`
- degerleme: **doğru** yapıyor → `INJECT_AT_DEPLOY`.

**Yayın öncesi ZORUNLU** (bkz. `DEPLOY-VE-GUVENLIK-NOTU.md`):
1. Sızan anahtarları **rotate et** (emlakekspertizi.com'da iptal + yeni üret) — git geçmişinde de kaldıkları için rotasyon şart.
2. **Proxy/Edge modunu zorla:** admin → ProX → "Proxy / Edge URL" gir → `EMLAK_PROXY_MODE=true` olur, istemci `X-Tenant-Key` GÖNDERMEZ; secret yalnız edge'de (Cloudflare Worker iskeleti hazır).
3. Proxy: yalnız `/api/v1/tenant/*` allow-list + per-tenant CORS + kiracı rate-limit; anahtarı yanıtta echo'lama.
- **Demo/pilot** doğrudan modda çalışır; **gerçek müşteri yayını proxy zorunlu.**

### P1 — Admin girişi istemci-taraf demo
`danisman/js/app.js`: `_ADMIN_USER='admin' / _ADMIN_PASS='1234'` (kodda "gerçek güvenlik için sunucu-taraf auth gerekir" notu var). Panel yalnız localStorage'a yazar (sunucu mutasyonu anahtarsız olmaz) ama **paneli açan kişi gömülü anahtarları/konfigürasyonu görür ve tenant kotasıyla AI/veri isteği atabilir.**
→ Üretimde: sunucu-taraf auth arkasına al, ya da en azından demo parolayı kaldır/değiştir + admin rotasını gizle.

### P2 — DeepSeek anahtarı localStorage
`dn_dskey` (danisman) — site sahibinin **kendi** DeepSeek anahtarı, istemcide saklanır. Self-servis için kabul edilebilir; paylaşımlı cihazda risk. Not düş.

### Temiz olanlar ✅
- **XSS:** public kullanıcı içerikleri (talep konu/mesaj/cevap) `esc()` ile HTML-kaçırılıyor.
- **EİDS:** kod/durum uydurulmuyor; backend'e devrediliyor (sahte "onaylı" yok).
- **Dürüstlük:** ProX = deterministik veri motoru (generative AI değil); "resmî değerleme SPK lisanslı"; TL/veri sabit.

### Yayın kontrol listesi
- [ ] 4 gerçek anahtar rotate edildi (consultant/emlaktahadimkoy_com/construction/nadas).
- [ ] Her tenant için proxy URL + `EMLAK_PROXY_MODE=true`; Network'te `X-Tenant-Key` YOK.
- [ ] Proxy allow-list + per-tenant CORS + rate-limit.
- [ ] Admin auth sunucu-tarafına alındı ya da demo parola kaldırıldı.
- [ ] degerleme `INJECT_AT_DEPLOY` gerçek anahtarla değiştirildi.
- [ ] robots.txt + sitemap.xml + canonical her domainde doğru.
- [ ] EİDS gerçek kimlik bilgileri (ilan yayını için).

---

## 4) PROX ENTEGRASYONU (canlı doğrulandı 2026-07-31)
- Endpoint: `https://www.emlakekspertizi.com/api/v1/tenant/{bootstrap|endeks|prox/analyze|prox/ai|locations/*|pdf/generate|lead|portal/login|blog}`
- Auth: `X-Tenant-Id` + `X-Tenant-Key`. **prox/ai gövdesi `{prompt:"…"}` bekler** (+ opsiyonel persona/context/message); yanıt `{success,answer,powered_by:"ProX"}`.
- `proxApi` **her sayfada inline ayrı tanımlı** — imza sayfaya göre değişir (`(path,{method,body})` vs `(path,body)`); çağrı incelerken o sayfanın tanımına bak. `!res.ok` → fallback (demo) döner; "API bağlantısı yok" = fetch başarısız (401/422/404/CORS/timeout).
- Canlı test: danisman/insaat/nadas/gayrimenkul bootstrap+endeks+AI **gerçek** (200); degerleme yerelde placeholder (deploy'da bağlanır). Detay: memory `prox-tenant-anahtarlari`.

---

## 5) İLGİLİ BELGELER
- **`cloudflare-worker/`** — HAZIR proxy Worker (`worker.js`) + `wrangler.toml` + `README.md` (deploy adımları). P0'ın uygulanabilir çözümü. Yerelde kanıtlandı: proxy modunda istemci `X-Tenant-Key` GÖNDERMİYOR, ProX yine canlı yanıt veriyor. Yerel test: `node scripts/prox-proxy-local.mjs` (Worker'ın node kopyası).
- `DEPLOY-VE-GUVENLIK-NOTU.md` — proxy/edge güvenli mod + Cloudflare Worker + çok-kiracı pipeline (P0 çözümü).
- `insaat/SUNUCU-CLAUDE-NOTLARI.md` — insaat dikeyi tam devir (dosya yapısı, hash routing detayı).
- `degerleme/SAAS-SUNUCU-NOTLARI.md` · `docs/SAAS-SUNUCU-AJAN-NOTLARI.md` — SaaS/backend uçları.

---

## ★ FAZ3 SONRASI YAYIN — GÜNCEL AKIŞ (15 Ağu 2026, tag `yayin-2026-08-15`)
> danisman + insaat artık **paketleyiciyle** yayınlanır; kaynak klasörleri DOĞRUDAN servis ETME (demo modudur).

```bash
git fetch --tags && git checkout yayin-2026-08-15
python3 scripts/uretim-paketle.py         # → dist/danisman + dist/insaat (leakage bulursa DURUR)
python3 scripts/kabul-testi.py            # beklenen: 52 PASS / 0 FAIL (BLOCKED'lar backend)
# dist/danisman/*  → danisman.emlakekspertizi.com vhost kökü
# dist/insaat/*    → insaat.emlakekspertizi.com   vhost kökü
```
- **/admin-assets/** dizinini auth arkasına al (401/403) — admin/stüdyo/CRM kodu lazy burada.
- Edge kuralları + backend uçları: **BACKEND-KAPANIS-LISTESI.md** (301'ler, 404, başlıklar, /api sözleşmeleri).
- 🔴 ROTASYON (hâlâ bekliyor): eski `admin/1234` çiftleri sunucuda geçersiz + ProX tenant anahtarları.
- Not: Üretimde admin/üyelik/portal/canlı-veri, backend uçları açılana dek bilinçli 'güvenli-başarısız'tır.
