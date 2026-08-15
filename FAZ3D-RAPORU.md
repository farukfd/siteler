# FAZ 3D RAPORU — ÜRETİM KAPANIŞ (danisman + insaat CANLI)
**Tarih:** 15 Ağustos 2026 · **main:** `158e6bd` · **Sunucu:** nginx @50.114.185.239 (conf yedekleri: `.bak_faz3d_20260815`)
**Rollback:** nginx conf yedeklerini geri koy + `git revert 158e6bd` + önceki dist'i rsync.

## Kabul tablosu (yalnız kanıtlı PASS)
| Kriter | Durum | Test/komut | Kanıt | Kalan risk |
|---|---|---|---|---|
| Global noindex kalktı (dn+ins, llms dahil) | **PASS** | canli-denetim T2 + curl -I | `x-robots-tag` başlığı yok; demo siteler noindex korunuyor | CF cache eski başlığı kısa süre gösterebilir |
| Sitemap 41 URL: 200+self-canonical+index,follow+title | **PASS** | canli-denetim T1 | dn 21 + ins 20, sorun listesi boş | — |
| ins 4 bozuk route (+2 alias) | **PASS** | T5 | 6/6 → 301 kanonik hedefe (JS kapalı çalışır) | — |
| Auth uçları ölü 404 değil | **PASS** | T4 | 3/3 → 501 `auth_not_configured` | Gerçek auth backend'i hâlâ yok |
| Üretimde çalışmayan üyelik/portal/yönetim UI gizli | **PASS(kod)+canlı örneklem** | dist grep + tarayıcı | `_dnAuthUiGizle` + ins `.js-giris` gizleme EMLAK_DEMO=false'ta | Tam UI turu CF purge sonrası |
| Public onboarding anonim ziyaretçiye açılmıyor | **PASS(kod)** | app-core load-guard | `EMLAK_DEMO===false → return` (auto+#kur iki sitede) | Canlı 1.4s senaryosu CF purge sonrası doğrulanacak |
| admin-assets anonim kapalı | **PASS** | T3 | dn+ins 403 | Eski CF cache bazı path'lerde 200 gösterebilir → purge |
| /index.html→/ 301 · /api bilinmeyen→JSON 404 · .bak→404 | **PASS(origin)** | origin-443 curl | 301 ✓ · `{"error":"not_found"}` ✓ · .bak `HTTP/2 404` ✓ | Canlı .bak CF cache'te 200 → **purge gerekli** |
| Public bundle: sağlayıcı/model/prompt/sysPrompt/eski-anahtar sıfır | **PASS(origin)** | origin-443 grep + dist tarama | origin js'te 0; `sysPrompt→yonerge` (16) | Canlı js CF cache'te eski → **purge gerekli** |
| Form sahte başarı yok (randevu) | **PASS(kod)** | app.js diff | Başarı yalnız `submitLead` ok'unda; aksi 'gönderilemedi' + form korunur | Lead-ID/receipt backend sözleşmesi bekliyor |
| Gelecek tarihli içerik (19/28 Ağu) | **PASS** | T7 + kaynak | Canlı ins blog'da 0; statik kartlar da düzeltildi | — |
| EİDS: doğrulanmamış kayıt public/schema dışı; demo kartlar DEMO etiketli | **PASS** | FAZ3B/C kanıtları + dist F3 | Üretim vitrini fail-closed boş; RealEstateListing demo'ya basılmıyor | 'Boş durum' metni eklenmedi (kart yerine boş bölüm) |
| NADAS sahiplik + banner + LICENSE | **PASS** | T9 + dist F2 | İlk HTML'de nadas-c; tüm first-party dosyalarda banner | — |
| BFF same-origin bootstrap | **PASS** | T10 | `success:true`, tenant Host'tan (nginx enjekte) | Sözleşme genişletmesi (§bootstrap alanları) backend'te |
| CSP sıkılaştırma | **KISMİ PASS** | curl -I | Reklam/posthog domainleri çıktı; frame-ancestors/form-action/X-Frame eklendi | `unsafe-inline` kaldı (inline-mimari); Report-Only `unsafe-eval` CF-panel kaynaklı → **UNVERIFIED** |
| WebGL fallback | **PASS(kod)** | index.html guard | capability-once + statik fallback + tek uyarı | WebGL'siz gerçek cihaz testi UNVERIFIED |
| Tenant bootstrap TAM sözleşme, SSR ilk-HTML, hostname-spoof, RBAC/oturum, lead receipt+CRM, hreflang/dil-SSR, Lighthouse ≥85/95/95/100 | **UNVERIFIED/BLOCKED** | — | Backend/merkezi API işi; FAZ3 raporlarındaki sözleşmeler + BACKEND-KAPANIS-LISTESI güncel | Üretim onayının kalan yarısı |

## Değişen dosyalar / sunucu
İstemci: app-core.js, app.js, content.js, cs-engine.js, content-studio×2, blog.html(ins), llms.txt×2, index.html(ins WebGL), + scripts/canli-denetim.py (YENİ).
Sunucu: `_saas_sec_prod.conf` (YENİ), `siteler-subdomains.conf` (dn/ins include→prod), `prox_api/{danisman,insaat}.conf` (auth-501, alias-301, hassas-uzantı-404, index-301 regex fix).

## Bilinen tuzaklar (bu turda yaşandı/kapandı)
`^/index\.html` regex'i `.bak`'ı da yakalıyordu → `(\?|$)` sınırı. Cloudflare **query-string'i cache-key'e katmıyor** — cache-buster'lı test yanıltıcı; canlı doğrulamada purge şart.

## TEK KALAN ADIM (kullanıcı)
Cloudflare panel → emlakekspertizi.com → Caching → **Purge Everything**. Sonrasında `python3 scripts/canli-denetim.py` → beklenen 12/12 PASS.
