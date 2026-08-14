# BACKEND KAPANIŞ LİSTESİ — danisman & insaat.emlakekspertizi.com
**Devir tarihi:** 14 Ağustos 2026 · **İstemci durumu:** kabul 51 PASS / 1 PARTIAL / 0 FAIL (main `a1702bc`+)
Bu tek sayfa, üretim onayı öncesi SUNUCU ekibinin kapatması gereken 11 BLOCKED kalemin özetidir.
Ayrıntılı sözleşmeler: `URETIME-HAZIRLIK-RAPORU.md §6` · `FAZ3-RAPORU.md §3/§7` · `FAZ3C-RAPORU.md`.
İstemci bu sözleşmelere göre KONUŞUR durumda; uçlar açıldığı an özellikler canlanır (kod değişikliği gerekmez).

## 1) Kimlik & Oturum (P0)
| Uç | Sözleşme |
|---|---|
| `POST /api/auth/admin/login` | Argon2id · 5 deneme/15dk kilit · MFA(TOTP) · `Set-Cookie: sid; HttpOnly; Secure; SameSite=Strict` · audit |
| `POST /api/auth/admin/password` | oturum + CSRF zorunlu |
| `POST /api/auth/user/{register,login,profile,password}` | üyelik; Argon2id; rate-limit; jj `{ok:true,name}` |
| `POST /api/v1/tenant/portal/login` | body `{client_key, secure_pass}` → `{success:true, portal_token(imzalı+süreli), profile}`; 401 genel mesaj; bölge/portföy yetkisi HER istekte sunucuda |
İstemci fail-closed: bu uçlar 200+sözleşme dönmeden hiçbir oturum/panel açılmaz.

## 2) Tenant çözümleme & SSR (P0)
- Host → tenant_id sunucuda; `GET /api/v1/tenant/bootstrap` → FAZ3 §5 alan listesi (secret/model/prompt ASLA).
- İlk HTML doğru tenant verisiyle SSR/SSG (marka flash'ı yok); paket/özellik yetkisi HER uçta sunucuda (`enabledFeatures` yalnız görsel ipucu).
- Ayrı: veri yetkisi · medya alanı · CRM · EİDS yetkisi · sitemap/canonical · cache-namespace (cache-key'de Host) · kota · audit.

## 3) AI Gateway (P0)
- `POST /api/ai/generate` `{profile:'m1'|'m2'|'m3', persona?, messages, temperature?, max_tokens?, format?}` → `{answer}`. Profil→sağlayıcı/model eşleme + anahtarlar YALNIZ sunucuda (vault); persona yönergeleri sunucuda; loglarda prompt/anahtar yok; kota+timeout+64KB sınır.
- `GET /api/ai/media?q=` lisanslı görsel proxy · `POST /api/ai/keys` BYOK vault (rotasyon/iptal sunucuda).

## 4) EİDS (P0)
- `POST /api/v1/tenant/eids/verify` → Bakanlık entegrasyonu; kayıt: tenant_id, listing_id, taşınmazNo, durum, resmî referans, tarih, doğrulayan servis, geçerlilik/iptal; fail-closed (servis kapalı → `awaiting_eids`); sandbox tenant'ları GERÇEK uca asla yönlendirilmez.
- DB kısıtı: `published` yalnız sunucu-doğrulamalı transaction'la; client `verified` alanları yok sayılır. DDL: FAZ3-RAPORU §3.

## 5) Lead/CRM (P0)
- `POST /api/v1/tenant/lead` → `{lead_id, received_at}`; idempotency-key; rate-limit+bot; KVKK rıza damgası; saklama politikası; tenant CRM kutusu; demo ortamında `sandbox:true` işareti.
- İstemci sunucu onayı olmadan "iletildi" DEMEZ (kod kanıtı mevcut).

## 6) Edge / HTTP (P1)
- 301: `/index.html→/` · ins alias `/bolge /hizmetler /iletisim /projeler /soru-cevap /asistan → *.html`.
- Gerçek 404 (404.html, noindex) · `/admin-assets/*` auth'suz 401/403 · bilinmeyen `/api/*` → JSON 404.
- Başlıklar: `X-Robots-Tag` tenant politikası (demo `indexingMode=private` ise noindex) · HSTS · `frame-ancestors 'none'` · `form-action 'self'` · `object-src 'none'` · `base-uri 'self'` · CSP nonce/hash (Report-Only ile başla; inline'ların nonce'lanması Faz-2) · Trusted Types uygun alanlarda · prod'da source map kapalı.
- Statik varlık immutable cache (?v= hash), HTML no-cache; cache-key Host içerir.

## 7) SEO/İçerik servisleri (P1)
- `GET /platform-statistics` → her sayı `{value, as_of, scope, source_status}` (480M+/50.000+ sabitleri buradan beslenir).
- Yayın motoru: `status=published ∧ published_at<=now(Europe/Istanbul)`; idempotent job + retry + audit; Article `datePublished/dateModified`; sitemap `lastmod`; hreflang yalnız GERÇEK dil rotaları (SSR) açılınca.
- `approved_claims` tablosu: ISO/kuruluş yılı/yorum/ödül yalnız kanıt+geçerlilik tarihli kayıtla render edilir.

## 8) Operasyon kapıları (P2)
Tenant CRUD+askıya alma · özel alan adı+oto TLS · cache invalidation · paket upgrade/downgrade+kota · günlük yedek+GERÇEK restore tatbikatı (RPO/RTO) · log/metric/trace/alarm · job queue retry/DLQ · e-posta teslim/bounce · veri export/silme (KVKK) · secrets rotation (İLK İŞ: eski `admin/1234` çiftleri + ProX tenant anahtarları — hâlâ bekliyor) · deploy & migration rollback · yük/rate-limit testi.

## 9) Doğrulama
Uçlar açıldıkça: `python3 scripts/kabul-testi.py` (BLOCKED kalemleri canlı HTTP ile PASS'e döner) + FAZ3C test matrisi (3 sentetik tenant: İst/Beşiktaş/Levent inşaat · İzmir/Çeşme/Alaçatı danışman · Ankara/Çankaya/Oran ofis) + Lighthouse canlı host ölçümü (hedef P≥90/A≥95/SEO≥95/BP≥95, LCP≤2.5s INP≤200ms CLS≤0.1).
