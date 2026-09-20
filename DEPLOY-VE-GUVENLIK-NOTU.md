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
5. **SEO üretimleştirme (ZORUNLU, deploy'un son adımı):** `scripts/uretim-paketle.py` yalnız
   `danisman` + `insaat` paketler; `gayrimenkul/` şablonundan açılan müşteri siteleri bu
   adımdan geçmezse **DEMO durumunda** canlıya çıkar (her sayfada `noindex,nofollow,noarchive`,
   `robots.txt` = `Disallow: /`, sitemap demo hostuna işaret eder → Google siteyi hiç indekslemez).
   Docroot üzerinde yerinde, idempotent, markalama/içeriğe dokunmaz:
   ```sh
   python3 scripts/tenant-uretimlestir.py --docroot /var/www/<tenant> --host <tenant-alanadi> --dry-run  # önce ne değişeceğini gör
   python3 scripts/tenant-uretimlestir.py --docroot /var/www/<tenant> --host <tenant-alanadi>            # uygula (çıkış 0 = son-tarama TEMİZ)
   ```
   Yaptıkları: DEMO robots satırını söker (sayfa-bazlı bilinçli `noindex,follow` stub'ları korur),
   robots meta'sız sayfaya `index,follow,max-image-preview:large` ekler, `robots.txt`'yi Allow +
   Sitemap ile yazar, sitemap hostunu düzeltir ve noindex sayfaları sitemap'ten düşürür, demo host
   kalıntılarını (`www.emlakekspertizi.com/demo/…`, `gayrimenkul.emlakekspertizi.com`) çevirir.
   Çıkış kodu 1 = docroot'ta DEMO kalıntısı var, canlıya "bitti" denmez.

### Vaka: 10lineemlak.com (Eylül 2026)
`gayrimenkul/` şablonundan açılan ilk müşteri sitesi; canonical/OG hostu elle düzeltilmiş ama
SEO üretimleştirme yapılmamış → canlıda tüm sayfalar `noindex`, `robots.txt` `Disallow: /`,
sitemap `gayrimenkul.emlakekspertizi.com` URL'leriyle. Düzeltme (sunucuda):
1. Yerel makineden tek komut (SSH alias `nadas-prod`; yedek + kuru koşu + uygulama + canlı teyit):
   `scripts/tenant-uretimlestir-uzak.sh nadas-prod <10line docroot> 10lineemlak.com` → çıktı temizse `--apply` ekle.
   Docroot bilinmiyorsa: `ssh nadas-prod -- 'grep -rl 10lineemlak /etc/nginx/sites-enabled/ | xargs grep -h "root "'`.
   (Elle: `python3 scripts/tenant-uretimlestir.py --docroot <10line docroot> --host 10lineemlak.com --dry-run` → sonra `--dry-run`'sız.)
   Not: Claude Code bulut oturumu sunucuya ulaşamaz (sandbox yalnız HTTPS proxy; SSH port 2222 kapalı) — bu adım yerelden koşar.
2. Cloudflare/edge HTML önbelleğini temizle (bkz. §4).
3. Cache-bust'lı doğrulama: `curl -s "https://10lineemlak.com/?ts=$(date +%s)" | grep -o '<meta name="robots"[^>]*>'`
   → yalnız `index,follow,max-image-preview:large`; `curl https://10lineemlak.com/robots.txt` → `Allow: /` + Sitemap satırı;
   `curl https://10lineemlak.com/sitemap.xml` → yalnız `https://10lineemlak.com/…` ve stub (`/ozel/` vb.) yok.
4. Search Console: property doğrula → sitemap gönder → ana sayfa için "URL denetimi → dizine eklenmesini iste".

## 4) Önbellek başlıkları (Cache-Control) — HTML bayat kalmasın
Sitede tüm JS/CSS `?v=N` sürüm parametresiyle yüklenir; ancak **HTML dosyasının kendisi**
sürümlenemez. Sunucu HTML için önbellek başlığı göndermezse tarayıcılar sezgisel (heuristic)
önbellekleme yapar → kullanıcı güncellemeleri ve derin-link kapısını (ov-pre) **eski HTML**
yüzünden görmez. (Lokal `python3 -m http.server` da başlık göndermediği için aynı belirti
geliştirmede de görülür; tek seferlik sert yenileme gerekir.)

**Kural:** HTML = her istekte doğrula; sürümlü varlıklar (`?v=`) = uzun süre önbellek.

```nginx
# nginx
location ~* \.html$ { add_header Cache-Control "no-cache, must-revalidate"; }
location ~* \.(js|css)$ { add_header Cache-Control "public, max-age=31536000, immutable"; }
location ~* \.(jpg|jpeg|png|webp|svg)$ { add_header Cache-Control "public, max-age=604800"; }
```

```apache
# Apache .htaccess
<FilesMatch "\.html$">
  Header set Cache-Control "no-cache, must-revalidate"
</FilesMatch>
<FilesMatch "\.(js|css)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
```

Cloudflare kullanılıyorsa: HTML için **Cache Rule → Bypass cache** (veya Edge TTL: Respect
origin) + JS/CSS için standart cache. `?v=` bump yapılınca ekstra purge gerekmez; HTML
no-cache olduğundan yeni sürüm referansları anında yayılır.

## 5) Kontrol listesi (üretim)
- [ ] **Admin paneli üretimde İSTEMCİDEN ÇIKARILMALI** — mevcut giriş (admin/1234) tamamen istemci-taraflı ve yalnız demo içindir; gerçek dağıtımda admin ayrı origin + sunucu-taraflı kimlik doğrulama (session/JWT) arkasında olmalı, statik pakete admin markup/JS dahil edilmemeli.
- [ ] HTML `Cache-Control: no-cache, must-revalidate`; JS/CSS `max-age=31536000, immutable` (bkz. §4).
- [ ] Proxy/Edge kuruldu; `X-Tenant-Key` istemciye sızmıyor (Network sekmesinde header yok).
- [ ] Proxy yalnızca `/api/v1/tenant/*` allow-list + per-tenant CORS.
- [ ] Kiracı kotası (rate-limit) proxy’de uygulanıyor.
- [ ] `robots.txt` + `sitemap.xml` her domainde doğru (admin üretici).
- [ ] `scripts/tenant-uretimlestir.py --host <alanadi>` çıkış kodu 0 (DEMO `noindex` / `Disallow: /` / demo-host sitemap kalıntısı yok) — cache-bust'lı `curl` ile canlıda teyit (§3 adım 5).
- [ ] EİDS gerçek kimlik bilgileri girildi (Özel Portföy serbest; ilan yayını için zorunlu).
- [ ] Mahalle ucu (bkz. `PROX-API-GEREKSINIM-NOTU.md`) canlıya alındıysa gerçek mahalle otomatik gelir.

## Öncelik
**Yüksek (üretim öncesi).** Demo/pilot doğrudan modda çalışır; gerçek müşteri yayınından önce proxy modu zorunludur.
