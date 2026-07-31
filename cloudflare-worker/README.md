# ProX Edge Proxy — Cloudflare Worker (kurulum)

Gizli ProX `X-Tenant-Key`'i istemciden gizler (P0 güvenlik bulgusunun çözümü — bkz. `../DEPLOY-VE-GUVENLIK-NOTU.md`). İstemci proxy modunda yalnız public `X-Tenant-Id` gönderir; anahtar Worker secret'ından eklenir.

## Dosyalar
- `worker.js` — proxy (allow-list + key enjeksiyon + per-tenant CORS)
- `wrangler.toml` — config (route + ORIGIN_* + secret adları)

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
