# Danışman SaaS — Üretime Hazırlık Devir Notu

> **Site:** danisman/ (Selin Meridyen · lüks konut danışmanı — kişisel marka demosu, 13 sayfa).
> **Tarih:** 2026-08-01 · **Branch:** `feat/dn-saas-p0-hardening` (main'den, izole).
> **Bağlam:** Statik demo. **B-kovası (backend) ve C-kovası (hukuk) gayrimenkul ile BİREBİR aynıdır** — bkz. **`GAYRIMENKUL-SAAS-URETIM-HANDOFF.md`** (o belge tenant izolasyonu/DB/auth/MFA/secret/CDN/WAF/SSR/301/KVKK vb. tüm B/C maddelerini kapsar; danışman için de geçerli).

## ✅ Bu repoda yapıldı (A-kovası)
- **P0-8:** Canlı ProX anahtarı (`prox_consultant_a383…`) 4 sayfa + `js/lead.js`'ten kaldırıldı; `tenant_key:""` + `EMLAK_PROXY_MODE=true`. Tüm ağaçta canlı anahtar = 0. **⚠️ Anahtar git geçmişinde → sunucuda ROTATE.**
- **P0-3/24:** Demo noindex (13/13) + `robots.txt` Disallow.
- **Demo sinyali:** 13/13 sayfaya statik DEMO bildirimi (ilan/portföy/danışman/yorum/istatistik temsilîdir) — kullanıcı + Google sinyali; **tüm özellikler korundu** (kullanıcı kararı).
- **P0-10 (EİDS):** `ilanlar.html` "her ilan EİDS ile doğrulanır" (canlı doğrulama izlenimi) → durum-takibi; resmî doğrulama yetkili EİDS/TTBS bağlantısıyla. (app.js akışı zaten dürüst: "beklemede" + doğrulamayı devrediyor.)
- **#23:** Kırık dosya linki yok. Tam clean-URL/routing = B (SPA).
- **#36:** Değerleme uyarısı mevcut (hizmetlerimiz + app.js: "SPK lisanslı ekspertize yönlendiririm" / "ön tahmin").
- **#40:** Erişilebilirlik iyi — lang 13/13, tek h1/sayfa (404 hariç), img-alt eksiği 0.

## Danışman gayrimenkulden DAHA TEMİZ
Taramada **YOK:** sahte "Google Puanı", izinsiz müşteri logosu, "50.000+ mahalle" (köysüz), kredi modülü overclaim, public `/api/` endpoint ifşası. Bu yüzden gm'deki uydurma-içerik pass'i burada gerekmedi.

## 🔴 Kalan = gayrimenkul handoff ile aynı (B/C)
admin/1234 (danışman'da yalnız istemci JS `app.js:1691`, kamusal ifşa yok) → sunucu auth+MFA = B. Tenant izolasyonu, DB, secret manager, CDN, WAF, SSR, 301, KVKK tenant-başı vb. → **GAYRIMENKUL-SAAS-URETIM-HANDOFF.md** B/C bölümleri.
