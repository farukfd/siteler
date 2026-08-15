#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""FAZ4 canlı kabul koşucusu — HTTP katmanı (DOM/JS katmanı tarayıcıyla ayrıca koşulur).

Kullanım: python3 scripts/faz4-canli-test.py
Çıkış kodu 0 = tüm HTTP kriterleri PASS.
"""
import json, re, sys, urllib.request, urllib.error

HOST = "https://danisman.emlakekspertizi.com"
UA = {"User-Agent": "Mozilla/5.0 (faz4-kabul)"}

def al(url, timeout=25):
    req = urllib.request.Request(url, headers=UA)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, dict(r.headers), r.read().decode("utf-8", "replace")
    except urllib.error.HTTPError as e:
        return e.code, dict(e.headers), ""
    except Exception as e:
        return -1, {}, str(e)

SONUC = []
def kayit(ad, ok, detay=""):
    SONUC.append((ad, ok, detay))
    print(("PASS  " if ok else "FAIL  ") + ad + ("  — " + detay if detay else ""))

# ── T1: sitemap sayfaları + yasak iddia taraması (kaynak-HTML düzeyi)
YASAK_IDDIA = ["Yetki Belgeli", "Yetki belgeli", "EİDS yetki belgeli", "EİDS Yetki Belgeli",
               "Yetki belgesi bekleniyor", "yönetici tarafından girilecek",
               "Yalnızca EİDS doğrulanmış ilanlar yayınlanır"]
st, _, smap = al(HOST + "/sitemap.xml")
urls = re.findall(r"<loc>([^<]+)</loc>", smap) if st == 200 else []
kayit("T1 sitemap erişimi", st == 200 and len(urls) >= 20, f"{len(urls)} URL")
sayfa_urls = [u for u in urls if "/ilan/" not in u]
ihlal = []
for u in sayfa_urls:
    s2, _, gov = al(u)
    if s2 != 200:
        ihlal.append(f"{u}→{s2}")
        continue
    for y in YASAK_IDDIA:
        if y in gov:
            ihlal.append(f"{u}: '{y}'")
kayit("T2 yetki/EİDS iddiası=0 (statik HTML, tüm sitemap)", not ihlal, "; ".join(ihlal[:4]))

# ── T3: /ilan/ kalıcı URL'ler 9/9
ilan_urls = [u for u in urls if "/ilan/" in u]
kotu = [u for u in ilan_urls if al(u)[0] != 200]
kayit("T3 kalıcı ilan URL'leri 9/9", len(ilan_urls) == 9 and not kotu, f"{len(ilan_urls)-len(kotu)}/{len(ilan_urls)}")

# ── T4: /demo-yonetim sandbox
s4, _, g4 = al(HOST + "/demo-yonetim")
_h4 = al(HOST + "/demo-yonetim")[1]
h4n = next((v for k, v in _h4.items() if k.lower() == "x-robots-tag"), "")
kayit("T4 /demo-yonetim 200 + sandbox içerik + noindex", s4 == 200 and "sessionStorage" in g4 and "noindex" in h4n,
      f"kod={s4} x-robots={h4n}")
kayit("T4b sandbox'ta admin-assets/gerçek-API izi yok",
      s4 == 200 and "admin-assets" not in g4 and "/api/v1/tenant/lead" not in g4)

# ── T5: tenant-config sözleşmesi
s5, h5, g5 = al(HOST + "/tenant-config.json")
try:
    cfg = json.loads(g5) if s5 == 200 else {}
except Exception:
    cfg = {}
zorunlu = ["site_mode", "config_version", "branding", "consultant", "contact", "legal_status",
           "service_areas", "listing_categories", "menus", "supported_languages",
           "default_language", "seo_settings", "private_portfolio_settings",
           "currency_settings", "map_settings", "feature_flags"]
eksik = [k for k in zorunlu if k not in cfg]
gizli = re.search(r"(api[_-]?key|secret|token|tenant_key|password)", g5, re.I)
kayit("T5 tenant-config tam sözleşme", s5 == 200 and not eksik, "eksik: " + ",".join(eksik) if eksik else cfg.get("config_version", ""))
kayit("T5b tenant-config'te secret yok", s5 == 200 and not gizli)

# ── T6: public bundle hassas token taraması (canlı hash'li dosyalar)
s6, _, ana = al(HOST + "/?kabul")
varliklar = set(re.findall(r'(?:src|href)="(/?[^"]+\.h[0-9a-f]{8}\.js)"', ana))
TOKENLER = ["dn_m1_key", "/api/ai/generate", "x-api-key", "X-Tenant-Key", "_motor1",
            "deepseek", "anthropic", "openai", "claude", "gpt-", "sk-ant", "gemini"]
tihlal = []
for v in sorted(varliklar):
    _, _, jg = al(HOST + "/" + v.lstrip("/"))
    for t in TOKENLER:
        if t.lower() in jg.lower():
            tihlal.append(f"{v}: {t}")
kayit("T6 public bundle hassas token=0", not tihlal, "; ".join(tihlal[:4]) or f"{len(varliklar)} varlık tarandı")

# ── T7: admin 403 + auth 501 regresyonu
kayit("T7 admin-assets 403", al(HOST + "/admin-assets/app-admin.js")[0] == 403)
kayit("T7b auth 501", al(HOST + "/api/auth/login")[0] == 501)

# ── T8: CSP report-only başlığı canlı
s8, h8, _ = al(HOST + "/?csp")
cro = h8.get("Content-Security-Policy-Report-Only", "")
kayit("T8 CSP Report-Only sıkı politika canlı", "script-src 'self'" in cro and "unsafe-inline" not in cro, cro[:70])

# ── T9: canonical'da ?lang kirliliği yok (statik)
kayit("T9 canonical temiz", 'rel="canonical"' in ana and "?lang" not in re.search(r'<link rel="canonical"[^>]+>', ana).group(0))

print()
fails = [s for s in SONUC if not s[1]]
print(f"TOPLAM: {len(SONUC)-len(fails)}/{len(SONUC)} PASS")
sys.exit(1 if fails else 0)
