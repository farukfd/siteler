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
# FAZ-KAPANIŞ: DEMO host sitemap'i BOŞ olmalı (Google demo'yu indekslemez; sayfalar taranabilir)
kayit("T1 DEMO sitemap boş (0 URL)", st == 200 and len(urls) == 0, f"{len(urls)} URL")
SAYFALAR = ["", "ilanlar.html", "ozel-portfoy.html", "harita.html", "bolge-analizi.html",
            "emlak-ekspertizi.html", "blog.html", "hakkimizda.html", "hizmetlerimiz.html",
            "referanslar.html", "sss.html", "iletisim.html", "randevu.html", "semtler.html",
            "surec.html", "yatirim-rehberi.html", "kvkk.html", "cerez.html", "kullanim.html",
            "gizlilik.html", "prox-asistan.html"]
sayfa_urls = [HOST + "/" + p for p in SAYFALAR]
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
SLUGLAR = ["levent-deniz-manzarali-3-1-daire-1","zekeriyakoy-havuzlu-mustakil-villa-2",
           "cihangir-bogaz-manzarali-esyali-2-1-3","maslak-a-plaza-ofis-kati-4",
           "nisantasi-cadde-ustu-dukkan-5","beykoz-riva-orman-manzarali-imarli-arsa-6",
           "caddebostan-bahce-kati-4-1-7","atasehir-site-ici-ferah-3-1-8",
           "emirgan-koru-manzarali-kiralik-villa-9"]
kotu = [sl for sl in SLUGLAR if al(HOST + "/ilan/" + sl)[0] != 200]
kayit("T3 kalıcı ilan URL'leri 9/9", not kotu, f"{9-len(kotu)}/9")

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


# ── FAZ4.1 ek kriterler
# T10: bootstrap TEK SÖZLEŞME — package + 16 alan + tenant-config paritesi
s10, h10, g10 = al(HOST + "/api/v1/tenant/bootstrap")
try: b10 = json.loads(g10)
except Exception: b10 = {}
kayit("T10 bootstrap package+sözleşme", s10 == 200 and b10.get("package") and all(k in b10 for k in zorunlu),
      f"package={b10.get('package')} eksik={[k for k in zorunlu if k not in b10][:3]}")
kayit("T10b bootstrap ETag var", any(k.lower() == "etag" for k in h10),
      next((v for k, v in h10.items() if k.lower() == "etag"), ""))
kayit("T10c tenant-config == bootstrap (tek kaynak)",
      s5 == 200 and s10 == 200 and cfg.get("config_version") == b10.get("config_version") and cfg.get("package") == b10.get("package"))

# T11: /demo-yonetim/ → 301 → /demo-yonetim
import urllib.request as _ur
class _NoRedir(_ur.HTTPRedirectHandler):
    def redirect_request(self, *a, **k): return None
_op = _ur.build_opener(_NoRedir)
try:
    r11 = _op.open(_ur.Request(HOST + "/demo-yonetim/", headers=UA), timeout=20)
    k11, l11 = r11.status, r11.headers.get("Location", "")
except Exception as e:
    k11 = getattr(e, "code", -1); l11 = getattr(e, "headers", {}).get("Location", "") if hasattr(e, "headers") else ""
kayit("T11 /demo-yonetim/ → 301 /demo-yonetim", k11 == 301 and l11.rstrip("/").endswith("/demo-yonetim"), f"kod={k11} loc={l11}")

# T12: yanlış EİDS cümlesi canlı bundle'da 0
_le = re.search(r'(shared/listing-extras\.h[0-9a-f]{8}\.js)', ana)
g12 = al(HOST + "/" + _le.group(1))[2] if _le else ""
kayit("T12 'Yalnızca EİDS doğrulanmış' bundle=0", _le is not None and "Yalnızca EİDS doğrulanmış" not in g12)

# T13: F6 ek tokenlar canlı bundle'da 0
tihlal2 = []
for v in sorted(varliklar):
    _, _, jg = al(HOST + "/" + v.lstrip("/"))
    for t in ["m1Key", "customPrompt", "proxPersona", "proxAiPrompts"]:
        if t.lower() in jg.lower(): tihlal2.append(f"{v}: {t}")
kayit("T13 m1Key/customPrompt/proxPersona/proxAiPrompts=0", not tihlal2, "; ".join(tihlal2[:3]))


# ── KAPANIŞ kriterleri
NADAS_C = "Yazılım ve altyapı © 2005–2026 NADAS Gayrimenkul Bilgi İletişim Sistemleri Ltd. Şti."
gb, hb, gbody = al(HOST + "/?gbot")
xr = next((v for k, v in hb.items() if k.lower() == "x-robots-tag"), "")
kayit("T14 X-Robots-Tag noindex,follow (HTML)", "noindex" in xr and "follow" in xr, xr)
kayit("T15 meta robots noindex,follow,noarchive", 'content="noindex,follow,noarchive"' in gbody)
kayit("T16 NADAS makine-yüzeyi: kaynak yorum+meta+JSON-LD", NADAS_C in gbody and 'name="generator" content="NADAS / ProX"' in gbody and '"Site Mode"' in gbody and '"DEMO"' in gbody)
# görünür katman: nadas-c span'ı kalmamalı (render metni tarayıcıda ayrıca doğrulanır)
kayit("T17 görünür footer'da nadas-c yok", 'class="nadas-c"' not in gbody)
s18, _, g18 = al(HOST + "/llms.txt"); s19, _, g19 = al(HOST + "/humans.txt")
kayit("T18 llms.txt: demo+NADAS+ProX", s18 == 200 and NADAS_C in g18 and "PLATFORM DEMOSU" in g18 and "ProX" in g18)
kayit("T19 humans.txt: NADAS+DEMO", s19 == 200 and NADAS_C in g19 and "DEMO" in g19)
# title dürüstlüğü
kayit("T20 title (DEMO) içerir", re.search(r"<title>[^<]*DEMO[^<]*</title>", gbody) is not None)

print()
fails = [s for s in SONUC if not s[1]]
print(f"TOPLAM: {len(SONUC)-len(fails)}/{len(SONUC)} PASS")
sys.exit(1 if fails else 0)
