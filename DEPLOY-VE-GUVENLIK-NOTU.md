# Çok-Kiracı Deploy & Tenant Anahtar Güvenliği (SUNUCU/DEVOPS EKİBİNE)

> **🔴 ACİL (P0 · denetim bulgusu C4).** Demo tenant anahtarları **git geçmişinde açık** ve varsayılan modda istemciden `X-Tenant-Key` olarak gönderiliyor:
> - `gayrimenkul/index.html`: `prox_office_...` / `prox_emlaktahadimkoy_com_...`
> - `danisman/index.html`: `prox_consultant_a383eb07bb544ce3db7323150370bb46` (tenant `consultant`)
>
> Yayına almadan önce:
> 1. **Sızan anahtarı ROTATE edin** (emlakekspertizi.com'da iptal + yeni anahtar üret).
> 2. **Proxy/Edge modunu zorunlu yapın** — her tenant için `proxyUrl` ayarlayın; anahtar statik pakete GÖMÜLMESİN.
> 3. Kod tarafı hazır: proxy modunda istemci artık `window.EMLAK_TENANT.tenant_key` + `PROX.key`'i **bellekten temizliyor** (`applyProxTenant`) ve `X-Tenant-Key` GÖNDERMİYOR; secret yalnızca edge sunucuda durur.

> Bu belge, white-label gayrimenkul sitesinin (`gayrimenkul.html` + `hizmetlerimiz.html` + `nedenbiz.html` + `wl.js`) her müşteri için ayrı domainde, ProX API anahtarı **istemcide sızmadan** yayınlanmasını anlatır.

## 1) Sorun: İstemci-taraflı tenant anahtarı

Bugün ProX API çağrıları tarayıcıdan doğrudan yapılıyor ve `X-Tenant-Key` header'ı istemcide görünür (CORS zaten açık). Demo/pilot için kabul edilebilir; **üretimde gizli anahtar sunucuda tutulmalı.**

İstemci artık **proxy-hazır**: admin → ProX panel → “🔒 Gelişmiş: Proxy / Edge güvenli mod”.

## 2) Çözüm: Edge/Proxy modu (istemci hazır)

Admin’de **Proxy / Edge URL** girildiğinde istemci:
- `window.EMLAK_API_BASE = <proxyUrl>` yapar,
- `window.EMLAK_PROXY_MODE = true` → **`X-Tenant-Key` header’ını GÖNDERMEZ**,
- yalnızca genel **`X-Tenant-Id`** (public tenant id) gönderir.

Gizli anahtar yalnızca proxy/edge sunucuda (secret olarak) durur ve isteğe orada eklenir.

### İstenen proxy davranışı (sunucu)
```
POST/GET  https://proxy.<musteri-domain>/prox/*   →  https://www.emlakekspertizi.com/api/v1/tenant/*
```
- Gelen `X-Tenant-Id`’yi doğrula → o kiracının gizli `X-Tenant-Key`’ini **sunucu secret store’undan** ekle.
- Yalnızca `/api/v1/tenant/*` uçlarına izin ver (allow-list); rate-limit uygula (kiracı kotası).
- CORS: yalnızca o kiracının domain(ler)ine `Access-Control-Allow-Origin`.
- Anahtarı asla yanıtta/echo’da döndürme.

### Örnek — Cloudflare Worker (iskelet)
```js
export default {
  async fetch(req, env) {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/prox/, "/api/v1/tenant");
    const tenantId = req.headers.get("X-Tenant-Id");
    const key = env["KEY_" + tenantId];           // secret store: KEY_emlaktahadimkoy_com
    if (!key) return new Response("unknown tenant", { status: 403 });
    const h = new Headers(req.headers);
    h.set("X-Tenant-Key", key);                    // gizli anahtar SUNUCUDA eklenir
    const r = await fetch("https://www.emlakekspertizi.com" + path + url.search, {
      method: req.method, headers: h,
      body: ["GET","HEAD"].includes(req.method) ? undefined : await req.text()
    });
    const out = new Headers(r.headers);
    out.set("Access-Control-Allow-Origin", env["ORIGIN_" + tenantId] || "*");
    return new Response(r.body, { status: r.status, headers: out });
  }
}
```
İstemci tarafında ek değişiklik gerekmez — sadece admin’e proxy URL + public tenant id girilir.

## 3) Çok-kiracı dağıtım (tek repo → per-tenant)

Tek dosya mimarisi her müşteri için ayrı domaine kopyalanır; farklılıklar **config enjeksiyonu** ile verilir (kaynak kod çatallanmaz):

| Katman | Kaynak |
|---|---|
| Firma adı, il, logo, iletişim | Admin (localStorage `meridyenGM_v1`) veya build-time `SAAS_CONFIG` enjeksiyonu |
| ProX erişimi | Proxy URL + public Tenant ID (yukarıdaki güvenli mod) |
| Domain / canonical / sitemap | `wl.js` otomatik (deploy domaini) + admin “SEO dosyaları üret” |
| EİDS yetki | Firma bazında admin (Bakanlık kimlik bilgileri) |

### Önerilen pipeline
1. `main` repo = kaynak (bu repo).
2. Her kiracı için CI: `gayrimenkul.html` + `hizmetlerimiz.html` + `nedenbiz.html` + `wl.js` → kiracı domainine deploy.
3. Kiracıya özel `tenant.json` (firma, il, proxyUrl, tenantId, EİDS) → deploy sonrası admin’den bir kez yüklenir **veya** build-time enjekte edilir.
4. Proxy secret’ları (KEY_*) merkezi secret store’da; repoya asla girmez.

## 4) Kontrol listesi (üretim)
- [ ] Proxy/Edge kuruldu; `X-Tenant-Key` istemciye sızmıyor (Network sekmesinde header yok).
- [ ] Proxy yalnızca `/api/v1/tenant/*` allow-list + per-tenant CORS.
- [ ] Kiracı kotası (rate-limit) proxy’de uygulanıyor.
- [ ] `robots.txt` + `sitemap.xml` her domainde doğru (admin üretici).
- [ ] EİDS gerçek kimlik bilgileri girildi (Özel Portföy serbest; ilan yayını için zorunlu).
- [ ] Mahalle ucu (bkz. `PROX-API-GEREKSINIM-NOTU.md`) canlıya alındıysa gerçek mahalle otomatik gelir.

## Öncelik
**Yüksek (üretim öncesi).** Demo/pilot doğrudan modda çalışır; gerçek müşteri yayınından önce proxy modu zorunludur.
