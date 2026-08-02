# ProX Edge Proxy — Cloudflare Worker (kurulum)

Gizli ProX `X-Tenant-Key`'i istemciden gizler (P0 güvenlik bulgusunun çözümü — bkz. `../DEPLOY-VE-GUVENLIK-NOTU.md`). İstemci proxy modunda yalnız public `X-Tenant-Id` gönderir; anahtar Worker secret'ından eklenir.

## Dosyalar
- `worker.js` — proxy (allow-list + key enjeksiyon + per-tenant CORS) **+ `/og` per-tenant OG kartı (Faz 2)**
- `og-card.js` — OG kartı SVG üreticisi (`renderOgSvg`) + URL kurucu (`buildOgUrl`)
- `wrangler.toml` — config (route + ORIGIN_* + secret adları)

## Per-tenant OG kartı (Faz 2) — `/og`
Kurumsal müşteri sihirbazda marka + renk girince sosyal paylaşım önizlemesi
(WhatsApp/LinkedIn/X/Facebook) de o markaya döner.

**Endpoint:** `GET /og?site=insaat&name=Anadolu&name2=Yapı&accent=%231e5aa8&domain=anadoluyapi.com`
→ `image/svg+xml` (1200×630), `Cache-Control: public, max-age=3600`. Tenant-key/CORS gerekmez (public görsel).

**NEDEN SERVER-SIDE:** Sosyal tarayıcılar JS çalıştırmaz; yalnız **statik HTML**'deki
`meta[og:image]`'i okuyup o URL'den görseli çeker. Bu yüzden kart bir görsel
endpoint'inden dönmeli — client JS ile `og:image` set etmek tarayıcılara ULAŞMAZ.

**Provisioning'in yapacağı (tenant oluşturma anında, sunucuda):**
`<meta property="og:image">` ve `<meta name="twitter:image">` içeriğini
`buildOgUrl(workerOrigin, {site,name,name2,accent,domain})` sonucuna set et.
Marka/renk verisi zaten sihirbazdan geliyor (client kancası hazır:
`meridyen_pub_v1` BRAND+THEME / `wl_brand_url` · `dn_brand_url` · `ins_brand_url`).

**PNG upgrade (opsiyonel):** SVG'yi WhatsApp/Telegram/Slack/Discord doğrudan
işler. Facebook/X/LinkedIn PNG tercih eder → `/og` içine `resvg-wasm` ekleyip
SVG→PNG dönüştür (satori GEREKMEZ; kart zaten hazır SVG). `Accept` veya
`?fmt=png` ile ayrılabilir. Kart üreticisi (`og-card.js`) değişmeden kalır.

**Yerel test:** `node` ile `worker.fetch(new Request(".../og?..."))` → SVG döner
(bkz. commit mesajı; `renderOgSvg` saf fonksiyon, Cloudflare olmadan çalışır).

## 1) Kurulum (bir kez)
```bash
npm i -g wrangler            # veya: npx wrangler ...
cd cloudflare-worker
wrangler login               # Cloudflare hesabınla tarayıcıda yetkilendir (SENİN adımın)
```

## 2) Gizli anahtarları ekle (secret store — repoya GİRMEZ)
Her kiracı için (anahtarlar sende; buraya YAZMA):
```bash
wrangler secret put TENANT_KEY_emlaktahadimkoy_com   # → prox_emlaktahadimkoy_com_...
wrangler secret put TENANT_KEY_consultant            # → prox_consultant_...
wrangler secret put TENANT_KEY_construction          # → prox_construction_...
wrangler secret put TENANT_KEY_nadas                 # → prox_nadas_...
wrangler secret put TENANT_KEY_valuation             # → (deploy anahtarı)
```
> ⚠️ Bu adımdan SONRA emlakekspertizi.com'da eski (git'e sızmış) anahtarları **rotate et** ve yeni değerleri secret'a koy.

## 3) İzinli origin'leri ayarla
`wrangler.toml` → `[vars] ORIGIN_<id>` değerlerini gerçek müşteri domain'leriyle güncelle.

## 4) Deploy
```bash
wrangler deploy
# workers.dev testi: https://prox-edge.<hesap>.workers.dev
# Üretim: wrangler.toml'de routes'u aç (prox.<domain>/*) ve tekrar deploy et.
```

## 5) İstemciyi proxy moduna al (her site)
Admin panel → **Firma Bilgileri** (`SAAS_CONFIG.firma.proxyUrl`) → Proxy/Edge URL alanına Worker origin'ini gir:
```
https://prox.emlaktahadimkoy.com      (ya da workers.dev URL'i)
```
Kaydet. İstemci otomatik: `EMLAK_PROXY_MODE=true`, `EMLAK_API_BASE=<proxyUrl>`, **`X-Tenant-Key` GÖNDERMEZ**.
(Kod hazır: `applyProxyMode()` + `proxApi` proxy-mode dalı.)

Kalıcı yapmak için build-time `SAAS_CONFIG.firma.proxyUrl`'i enjekte et (localStorage'a bağlı kalmasın).

## 6) Doğrulama
- Tarayıcı → Network: `/api/v1/tenant/*` istekleri **proxy origin'ine** gidiyor, header'da **`X-Tenant-Key` YOK**, yalnız `X-Tenant-Id` var.
- ProX yine canlı yanıt veriyor (bootstrap success, endeks/analiz/AI gerçek).
- Yanlış/eksik `X-Tenant-Id` → 400/403; izinsiz origin → 403; anahtar yanıtı echo'lanmıyor.

## Notlar
- Rate-limit: Cloudflare Dashboard → Security → Rate Limiting (per-route) ya da Worker içinde KV/DO sayaç.
- Yalnız `/api/v1/tenant/*` geçer; başka yol 403.
- Yerel test: repoda `scripts/prox-proxy-local.mjs` (Worker mantığının node kopyası) ile Cloudflare olmadan denenebilir (bkz. o dosyanın başı).
