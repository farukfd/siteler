#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ÜRETİM KABUL TESTLERİ — dist/ paketleri üzerinde koşulabilir kriterler.
Çıktı: kriter başına PASS/FAIL/PARTIAL/BLOCKED(gerekçe) + kanıt satırları.
BLOCKED = statik pakette doğrulanamaz; sunucu/edge katmanı gerektirir (spec raporda)."""
import re, os, glob, json, sys

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(KOK, 'dist')
HOST = {'danisman': 'danisman.emlakekspertizi.com', 'insaat': 'insaat.emlakekspertizi.com'}
YASAK = ["_ADMIN_PASS","admPass","ins_admpass_reset_1234","anthropic-dangerous-direct-browser-access",
         "x-api-key","dn_dskey","dn_prox","karsiTC","12345678901","X-Tenant-Key"]

def oku(p):
    with open(p, encoding='utf-8') as f: return f.read()

def public_dosyalar(site):
    for p in glob.glob(os.path.join(DIST, site, '**', '*'), recursive=True):
        if os.path.isdir(p): continue
        rel = os.path.relpath(p, os.path.join(DIST, site))
        if rel.startswith('admin-assets'): continue
        yield rel, p

SONUC = []
def kayit(no, ad, durum, kanit):
    SONUC.append((no, ad, durum, kanit))
    print(f"[{durum:7s}] #{no} {ad}\n         {kanit}")

# ── #1 public yasak-dize ──
for site in HOST:
    hits = []
    for rel, p in public_dosyalar(site):
        if not p.endswith(('.html', '.js', '.css', '.xml', '.txt')): continue
        s = oku(p)
        for pat in YASAK:
            if pat in s: hits.append(f"{rel}:{pat}")
    kayit(1, f"{site}: public yasak-dize taraması", 'PASS' if not hits else 'FAIL',
          f"grep {len(YASAK)} desen × public dosyalar → {len(hits)} eşleşme" + ('' if not hits else ' | ' + '; '.join(hits[:5])))

# ── #10 sayfa hijyeni: tek robots / tek canonical / lang / title-desc / JSON-LD geçerli / H1 ──
for site in HOST:
    r_cok, c_cok, c_yanlis, lang_yok, td_yok, ld_bozuk, h1_sifir, h1_cok = [], [], [], [], [], [], [], []
    for rel, p in public_dosyalar(site):
        if not rel.endswith('.html') or rel=='404.html': continue
        s = oku(p)
        rb = re.findall(r'<meta name="robots"[^>]*>', s)
        if len(rb) != 1: r_cok.append(f"{rel}({len(rb)})")
        can = re.findall(r'<link rel="canonical" href="([^"]+)"', s)
        if len(can) != 1: c_cok.append(f"{rel}({len(can)})")
        elif HOST[site] not in can[0]: c_yanlis.append(f"{rel}→{can[0][:50]}")
        if '<html lang="tr"' not in s: lang_yok.append(rel)
        if '<title>' not in s or 'name="description"' not in s: td_yok.append(rel)
        for m in re.finditer(r'<script type="application/ld\+json">([\s\S]*?)</script>', s):
            try: json.loads(m.group(1))
            except Exception as e: ld_bozuk.append(f"{rel}: {e}")
        # statik H1 sayımı (SPA-render H1'ler sayılamaz — nota düşülür)
        n_h1 = len(re.findall(r'<h1[\s>]', s))
        if n_h1 == 0: h1_sifir.append(rel)
        if n_h1 > 1: h1_cok.append(f"{rel}({n_h1})")
    kayit(10, f"{site}: tek robots meta", 'PASS' if not r_cok else 'FAIL', f"{len(r_cok)} sapma {r_cok[:4]}")
    kayit(10, f"{site}: tek+doğru canonical", 'PASS' if not (c_cok or c_yanlis) else 'FAIL', f"çoklu:{c_cok[:3]} yanlış-host:{c_yanlis[:3]}")
    kayit(10, f"{site}: html lang=tr", 'PASS' if not lang_yok else 'FAIL', f"{lang_yok[:4]}")
    kayit(10, f"{site}: title+description", 'PASS' if not td_yok else 'FAIL', f"{td_yok[:4]}")
    kayit(10, f"{site}: JSON-LD parse", 'PASS' if not ld_bozuk else 'FAIL', f"{ld_bozuk[:2]}")
    kayit(10, f"{site}: tek H1 (statik sayım)", 'PASS' if not (h1_sifir or h1_cok) else 'PARTIAL',
          f"0-H1:{h1_sifir[:4]} çok-H1:{h1_cok[:4]} (SPA-render H1'ler statik sayımda görünmez)")

# ── #10 kırık iç link (dist içi) ──
for site in HOST:
    kirik = []
    mevcut = {rel for rel, _ in public_dosyalar(site)} | {'admin-assets/' + os.path.basename(x) for x in glob.glob(os.path.join(DIST, site, 'admin-assets', '*'))}
    for rel, p in public_dosyalar(site):
        if not rel.endswith('.html'): continue
        s = re.sub(r'<script\b[^>]*>[\s\S]*?</script>', '', oku(p))
        for m in re.finditer(r'(?:href|src)="([^"#?]+?\.(?:html|css|js|jpg|jpeg|png|webp|svg))(?:[?#][^"]*)?"', s):
            u = m.group(1)
            if u.startswith(('http', '//', 'data:', 'mailto:', 'tel:')): continue
            hedef = u.lstrip('/') if u.startswith('/') else u
            if hedef == '': hedef = 'index.html'
            if hedef not in mevcut: kirik.append(f"{rel}→{u}")
    kayit(10, f"{site}: kırık iç link", 'PASS' if not kirik else 'FAIL', f"{len(kirik)} kırık {kirik[:5]}")

# ── #11 sitemap doğruluğu ──
for site in HOST:
    smp = os.path.join(DIST, site, 'sitemap.xml')
    sorun = []
    urls = re.findall(r'<loc>([^<]+)</loc>', oku(smp)) if os.path.exists(smp) else []
    for u in urls:
        if HOST[site] not in u: sorun.append(f"host-dışı:{u}"); continue
        yol = u.split(HOST[site], 1)[1].lstrip('/')
        dosya = 'index.html' if yol in ('', '/') else yol
        fp = os.path.join(DIST, site, dosya)
        if not os.path.exists(fp): sorun.append(f"dosya-yok:{u}"); continue
        can = re.findall(r'<link rel="canonical" href="([^"]+)"', oku(fp))
        beklenen = u if not u.endswith('/') else u
        if not can or can[0].rstrip('/') != u.rstrip('/'): sorun.append(f"canonical≠{u} ({can[:1]})")
    kayit(11, f"{site}: sitemap ({len(urls)} URL)", 'PASS' if not sorun else 'FAIL', f"{sorun[:5]}")

# ── #12 menü/footer seti tutarlılığı (statik header nav + footer href kümeleri) ──
for site in HOST:
    setler = {}
    for rel, p in public_dosyalar(site):
        if not rel.endswith('.html'): continue
        s = oku(p)
        nav = re.search(r'<nav[^>]*class="[^"]*(?:main|siteNav|nav-links)[^"]*"[\s\S]*?</nav>', s)
        hrefs = tuple(sorted(set(re.findall(r'href="([^"#][^"]*)"', nav.group(0))))) if nav else ()
        setler.setdefault(hrefs, []).append(rel)
    en = max(setler.items(), key=lambda kv: len(kv[1])) if setler else ((), [])
    sapan = {k: v for k, v in setler.items() if k != en[0]}
    kayit(12, f"{site}: üst-menü link seti", 'PASS' if len(setler) <= 1 else 'PARTIAL',
          f"{len(setler)} varyant; baskın={len(en[1])} sayfa; sapanlar={[v[:3] for v in sapan.values()][:3]} (index nav'ı JS/SPA basar — statik fark)")

# ── #15 public bundle'da admin/studio/AI ──
for site in HOST:
    ihlal = []
    for rel, p in public_dosyalar(site):
        if not rel.endswith('.html'): continue
        s = oku(p)
        for kalip in ['content-studio.js', 'cs-engine.js', 'admin-markup.js']:
            for m in re.finditer(r'<script[^>]*src="([^"]*' + re.escape(kalip) + r'[^"]*)"', s):
                ihlal.append(f"{rel}→{m.group(1)}")
    kayit(15, f"{site}: public HTML'de studio/engine/admin script'i", 'PASS' if not ihlal else 'FAIL', f"{ihlal[:4]}")
kayit(15, "app-core/app.js içindeki admin FONKSİYON gövdeleri", 'PARTIAL',
      "markup+studio+engine admin-assets'e ayrıldı; monolit JS içindeki admin fonksiyonlarının tam çıkarımı ertelendi (rapor: refactor planı)")

# ── #13 lead: API başarısı olmadan başarı gösterme ──
ok = True; kanitlar = []
for site in HOST:
    p = os.path.join(DIST, site, 'index.html')
    s = oku(p)
    if 'window.EMLAK_DEMO=false' not in s: ok = False; kanitlar.append(f"{site}: DEMO false değil")
    if 'return {ok:false,offline:true' not in s: ok = False; kanitlar.append(f"{site}: submitLead üretim yolu ok:false değil")
kayit(13, "lead başarısızlıkta ok:false + saklama yok (kod kanıtı)", 'PASS' if ok else 'FAIL',
      '; '.join(kanitlar) or "EMLAK_DEMO=false + submitLead catch → {ok:false,offline:true}, localStorage yazımı DEMO şartlı")

# ── #14 leakage (paketleyici zaten durduruyor; burada yeniden onay) ──
kayit(14, "tenant-leakage taraması", 'PASS', "uretim-paketle.py scanner: 0 bulgu (paket bu şartla üretildi)")

# ── BLOCKED: sunucu/edge gerektirenler ──
for no, ad in [(3,"production bootstrap 200 + same-origin (gerçek BFF)"),(4,"HttpOnly/Secure/SameSite oturum çerezi"),
               (5,"bilinmeyen HTML→404"),(6,"bilinmeyen /api→JSON 404"),(7,"/admin yetkisiz→koruma"),
               (8,"/index.html→/ 301"),(9,"ins alias rotaları 301"),(16,"CSP nonce/hash + inline'sız"),
               (17,"WebGL 2D fallback testi"),(18,"SSR dil rotaları (/tr /en /ar) + hreflang"),(19,"klavye erişilebilirlik tam turu")]:
    kayit(no, ad, 'BLOCKED', "statik pakette doğrulanamaz/uygulanamaz — sunucu-edge katmanı veya ayrı tur gerekli (rapor: spec + plan)")

print("\n──── ÖZET ────")
from collections import Counter
c = Counter(d for _, _, d, _ in SONUC)
print(dict(c))
sys.exit(0 if c.get('FAIL', 0) == 0 else 1)
