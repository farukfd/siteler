# Backend Referans Mimarisi — B-kovası İskeleti

> **DURUM (dürüstlük):** Bu klasör **REFERANS/İSKELET**tir — çalışan bir backend DEĞİL.
> Statik repoda backend **inşa/çalıştırma/test edilemez**. Bu dosyalar, backend
> ekibi/Sunucu Claude'un deploy edeceği tasarımı ve başlangıç kodunu verir.
> Kapsam eşlemesi: **`GAYRIMENKUL-SAAS-URETIM-HANDOFF.md`**.

## Ne HAZIR (bu repoda, dağıtılabilir/başlangıç)
| Dosya | Kapsam | Durum |
|---|---|---|
| `../_headers` | Güvenlik başlıkları (#41) | ✅ Pages/Netlify'de HEMEN çalışır |
| `../cloudflare-worker/` | Edge-proxy: gizli anahtar sunucuda (#8), allow-list + per-tenant CORS (#42) | ✅ deploy-hazır (secret'lar girilir) |
| `db/schema.sql` | Çok-kiracılı şema, `tenant_id` (#5/#7/#17) | 🟡 referans (uyarlanır) |
| `db/rls.sql` | PostgreSQL RLS izolasyonu (#5) | 🟡 referans |
| `../legal/kvkk-aydinlatma-TEMPLATE.md` | Tenant-başı KVKK (#11-14, C) | 🟡 hukukçu onayı gerekir |

## Ne EKSİK (backend ekibi kodlar/deploy eder)
Uygulama servisi (API), auth sunucusu, DB provizyonu, secret-manager, CDN, WAF,
CI/CD, testler, pen-test → aşağıdaki tasarıma göre.

---

## 1) Kiracı çözümleme (#5) — her istekte
```
Host → tenant_domains (verified_at NOT NULL) → tenants → subscriptions.active
     → izinli özellikler → SET LOCAL app.tenant_id = <uuid>  (RLS devreye girer)
İstemciden gelen tenant_id/anahtar ASLA güvenilmez (yalnız Host + oturum).
```

## 2) Auth & oturum (#2, #43)
- Parola: **argon2id** (veya bcrypt cost≥12). Düz metin/loglar/localStorage'da ASLA.
- Oturum: **HttpOnly + Secure + SameSite=Lax/Strict** cookie; sunucu-taraf oturum
  kaydı; girişte **session fixation** engeli (id rotasyonu); çıkışta sunucuda iptal.
- **MFA (TOTP)** yönetici rollerinde zorunlu; kritik işlemde yeniden-auth.
- **Brute-force**: login/parola-sıfırlama rate-limit + kilitleme.
- Parola sıfırlama token'ı **tek kullanımlık + süreli**.
- `admin/1234` ve tüm tekrar-parolalar KAPATILIR; mevcut oturum/token İPTAL;
  **sızan ProX anahtarları ROTATE** (git geçmişinde kaldılar).

## 3) Roller (#17) — `roles` + `user_roles` + uygulama yetkisi
`Super Admin · Tenant Owner · Office Manager · Consultant · Content Editor ·
Finance User · Read Only · Support`. Modül-bazlı yetki (ilan/lead/sözleşme/finans/
kullanıcı/anahtar/tenant-ayarı/yayın/silme). Danışman finans/anahtar GÖREMEZ.
RLS satır-izolasyonu verir; **rol yetkisi uygulamada** ayrıca zorlanır.

## 4) API & tenant-dışı erişim (#5)
`/api/leads/:id` → önce RLS (`app.tenant_id`) sonra uygulama sahiplik kontrolü.
Sadece ID değiştirerek başka tenant kaydına erişim İKİ katmanda engellenir.
Testi zorunlu (#47): A tenant, B tenant kaydını GÖREMEZ/İNDİREMEZ.

## 5) Sırlar (#8) & AI güvenliği (#9)
- Ham anahtar DB'de değil; `api_keys.secret_ref` → vault/secret-manager.
- Edge-proxy (`cloudflare-worker/`) `X-Tenant-Key`'i sunucuda ekler; istemci görmez.
- AI: prompt-injection filtresi, tool allowlist, PII maskeleme, insan-onaysız
  otoyayın engeli, model-sağlayıcı veri-aktarım kaydı.

## 6) Kalanlar → handoff
CDN cache-key (#6), dosya-yükleme güvenliği (#18), yedek/restore (#19), audit log
(#44 — `audit_logs`), SSR/301/canonical (#21-27), CI/CD+ortam ayrımı (#46), otomatik
+ pen-test (#47/#48). Ayrıntı ve kabul kriterleri: `GAYRIMENKUL-SAAS-URETIM-HANDOFF.md`.
