#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""ÜRETİM PAKETLEYİCİ — tenant subdomain dist'i üretir + leakage scanner (bulursa DURUR).

  python3 scripts/uretim-paketle.py            → dist/danisman + dist/insaat

Dönüşümler (kaynak repo = demo; dist = üretim):
  1. www.emlakekspertizi.com/demo/<site>  →  https://<site>.emlakekspertizi.com   (canonical/OG/JSON-LD/sitemap/llms)
  2. Çift robots meta → TEK üretim satırı (index,follow,max-image-preview:large)
  3. window.EMLAK_DEMO=true → false  ·  EMLAK_API_BASE → "" (same-origin BFF)
  4. '../shared/' → 'shared/' + kullanılan shared dosyaları dist içine kopyalanır
  5. Admin-only varlıklar (admin-markup.js, content-studio.js, cs-engine.js) → dist/<site>/admin-assets/
     (edge'de auth arkasına alınacak dizin; lazy-loader yolları güncellenir)
  6. 'CANLI DEMO' bandı (demo-band section) HTML'lerden sökülür
  7. href="index.html..." → href="/..."  (kök kanonikleştirme; edge 301 ile birlikte)
  8. robots.txt + sitemap.xml üretim değerleriyle yazılır
  9. LEAKAGE SCANNER: yasak dizeler + çapraz-tenant marka/host + /demo/ kalıntısı → paket DURUR
"""
import re, os, sys, shutil, glob, json

KOK = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DIST = os.path.join(KOK, 'dist')

SITELER = {
    'danisman': {'host': 'danisman.emlakekspertizi.com', 'marka': 'Selin Meridyen'},
    'insaat':   {'host': 'insaat.emlakekspertizi.com',   'marka': 'Meridyen Yapı'},
}
ADMIN_VARLIK = ['admin-markup.js', 'content-studio.js']          # site js/ içinden
# Üretim paketine GİRMEYECEK eski/alias yollar: dn p/ (GitHub-Pages stub'ları, yabancı canonical),
# ins alias dizinleri (soft-duplicate — edge'de 301'e çevrilir; redirect tablosu raporda)
PAKET_DISI = {
    'danisman': ('p/',),
    'insaat':   ('bolge/', 'iletisim/', 'hizmetler/', 'projeler/', 'soru-cevap/', 'asistan/'),
}
ADMIN_SHARED = ['cs-engine.js']                                   # shared/ içinden
KOPYALAMA_DISI = ('.md', '.py', '.json', '.mjs', 'VERSION')                          # not/rapor/veri dosyaları dist'e girmez

YASAK = ["_ADMIN_PASS","admPass","ins_admpass_reset_1234","anthropic-dangerous-direct-browser-access",
         "x-api-key","dn_dskey","dn_prox","karsiTC","12345678901",
         "X-Tenant-Key","EMLAK_DEMO=true","/demo/danisman","/demo/insaat","www.emlakekspertizi.com/demo",
         # FAZ3: staging fikstür sentinelleri hiçbir pakete giremez
         "TENANT_A_ONLY_93K","TENANT_B_ONLY_61Q","TENANT_C_ONLY_47R",
         # FAZ3C son-tarama desenleri
         "EIDS_DEMO","_insDemoEids","_demoEids","0034812","tenant_key","system prompt","sistem promptu"]

# FAZ3 §13: first-party build dosyalarında minification sonrası da korunan mülkiyet banner'ı.
NADAS_BANNER = ("/*! Yazılım ve altyapı © 2005–2026 NADAS Gayrimenkul Bilgi "
                "İletişim Sistemleri Ltd. Şti. Tüm hakları saklıdır. Proprietary software. */\n")

def banner_ekle(s):
    if s.startswith('/*! Yaz'): return s
    if s.startswith('#!'):  # olası shebang'li js yok ama güvenli kalsın
        i = s.find('\n') + 1
        return s[:i] + NADAS_BANNER + s[i:]
    return NADAS_BANNER + s
# FAZ3 §10/§12: üçüncü-taraf AI sağlayıcı/model İFŞASI paket genelinde (admin-assets DAHİL) sıfır olmalı.
# 'pexels'/'openverse' görsel-lisans atıfları meşru olduğundan taranmaz.
SAGLAYICI = [r'deepseek', r'anthropic', r'\bopenai\b', r'\bclaude\b', r'gpt-4', r'gpt-3', r'sk-ant',
             r'dangerous-direct', r'\bgemini\b', r'chatgpt', r'api\.deepseek', r'api\.openai']

# Çapraz-tenant desenleri REGEX'tir. dn'nin meşru unvanı "Selin Meridyen Gayrimenkul ..." olduğundan
# 'Meridyen Gayrimenkul' yalnız 'Selin ' öneki OLMADAN sızıntı sayılır (lookbehind).
CAPRAZ = {
    'danisman': [r"Meridyen Yapı", r"insaat\.emlakekspertizi", r"(?<!Selin )Meridyen Gayrimenkul", r"gayrimenkul\.emlakekspertizi"],
    'insaat':   [r"Selin Meridyen", r"danisman\.emlakekspertizi", r"Meridyen Gayrimenkul", r"gayrimenkul\.emlakekspertizi"],
}

def oku(p):
    with open(p, encoding='utf-8') as f: return f.read()
def yaz(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f: f.write(s)

def donustur_metin(s, site, host, html=False):
    # 1) hostname
    s = s.replace(f'https://www.emlakekspertizi.com/demo/{site}/', f'https://{host}/')
    s = s.replace(f'https://www.emlakekspertizi.com/demo/{site}',  f'https://{host}')
    # 2) çift robots → tek üretim
    s = re.sub(r'<meta name="robots" content="noindex[^"]*">\s*(<!--[^>]*-->)?\s*', '', s)
    s = re.sub(r'<meta name="robots" content="index,follow[^"]*">\s*<!--[^>]*-->', '<meta name="robots" content="index,follow,max-image-preview:large">', s)
    s = s.replace('<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">', '<meta name="robots" content="index,follow,max-image-preview:large">')
    # 3) demo bayrağı + same-origin taban
    s = s.replace('window.EMLAK_DEMO=true;', 'window.EMLAK_DEMO=false;')
    s = re.sub(r'window\.EMLAK_API_BASE\s*=\s*"https://www\.emlakekspertizi\.com";', 'window.EMLAK_API_BASE="";/* same-origin BFF */', s)
    # 4) shared düzleştirme
    s = s.replace('../shared/', 'shared/')
    # 4b) FAZ3: üretim depolama bekçisi her SAYFAYA (yalnız HTML — JS içindeki şablon string'lerine dokunma!)
    if html and '</head>' in s and 'storage-guard' not in s:
        s = s.replace('</head>', '<script>window.EMLAK_DEMO=false;</script><script src="shared/storage-guard.js?v=1"></script>\n</head>', 1)
    # 7) index.html → kök
    s = re.sub(r'href="(?:\./)?index\.html', 'href="/', s)
    s = s.replace("location.href='index.html", "location.href='/")
    s = s.replace('location.href="index.html', 'location.href="/')
    return s

# FAZ3-KAPANIŞ: monolit admin bölgeleri public bundle'dan ayrılır (kaynak tek-dosya kalır).
# İşaretli /*__ADMIN_BLOK__*/…/*__ADMIN_BLOK_SON__*/ bölgeleri admin-assets/<ad>-admin.js'e taşınır;
# public dosyaya lazy köprü eklenir: giriş fonksiyonları yükler, diğer stub'lar yükleme başlamadıysa
# no-op (boot zinciri kırılmaz), başladıysa kuyruğa girip gerçek fonksiyonla koşar.
ADMIN_SPLIT = {'danisman': ('js/app.js', 'app-admin.js', ['openSaasAdmin']),
               'insaat':   ('js/app-core.js', 'app-core-admin.js', [])}
_BLOK_RE = re.compile(r'/\*__ADMIN_BLOK__\*/[^\n]*\n([\s\S]*?)/\*__ADMIN_BLOK_SON__\*/\n?')

def admin_split(s, admin_dosya, giris):
    bloklar = _BLOK_RE.findall(s)
    if not bloklar:
        return s, None
    admin_js = '\n/* ── admin blok ── */\n'.join(bloklar)
    fns = sorted(set(re.findall(r'function\s+([A-Za-z_$][\w$]*)\s*\(', admin_js)))
    s = _BLOK_RE.sub('/* admin bölgesi → admin-assets/%s (lazy) */\n' % admin_dosya, s)
    kopru = ("\n/* NADAS admin-lazy köprüsü — admin kodu yalnız gerektiğinde iner */\n"
        "(function(){var YOL='admin-assets/" + admin_dosya + "?v=1';var GIRIS=" + json.dumps(giris) + ";\n"
        "var _p=null,_ok=false;function yukle(){if(_ok)return Promise.resolve();if(!_p){_p=new Promise(function(res){var sc=document.createElement('script');sc.src=YOL;sc.onload=function(){_ok=true;res();};sc.onerror=function(){res();};document.head.appendChild(sc);});}return _p;}\n"
        "window.__adminYukle=yukle;\n"
        "var F=" + json.dumps(fns) + ";\n"
        "F.forEach(function(ad){if(window[ad]!==undefined)return;var st=function(){var a=arguments,self=this;\n"
        "  if(!_p&&GIRIS.indexOf(ad)<0)return;/* boot no-op: yükleme başlamadıysa sessiz */\n"
        "  return yukle().then(function(){var f=window[ad];if(f&&!f.__stub)return f.apply(self,a);});};\n"
        " st.__stub=1;window[ad]=st;});})();\n")
    return s + kopru, admin_js

def demo_band_sok(s):
    # <section class="demo-band" ...> ... </section> (+ öncesindeki kabuk-ortak link satırı kalabilir)
    return re.sub(r'<section class="demo-band"[\s\S]*?</section>\s*', '', s)

def admin_yollari(s):
    for a in ADMIN_VARLIK:
        s = s.replace(f'js/{a}', f'admin-assets/{a}')
    for a in ADMIN_SHARED:
        s = s.replace(f'shared/{a}', f'admin-assets/{a}')
    return s

def paketle(site, cfg):
    kaynak = os.path.join(KOK, site)
    hedef  = os.path.join(DIST, site)
    if os.path.exists(hedef): shutil.rmtree(hedef)
    host = cfg['host']
    sayac = {'html':0,'js':0,'css':0,'diger':0,'admin':0,'demo_band':0}

    for yol in glob.glob(os.path.join(kaynak, '**', '*'), recursive=True):
        if os.path.isdir(yol): continue
        rel = os.path.relpath(yol, kaynak)
        if rel.endswith(KOPYALAMA_DISI): continue
        if any(rel.startswith(px) for px in PAKET_DISI.get(site, ())): continue
        ad = os.path.basename(rel)
        # admin varlıkları ayrı dizine
        if ad in ADMIN_VARLIK:
            dst = os.path.join(hedef, 'admin-assets', ad)
            s = banner_ekle(donustur_metin(oku(yol), site, host))
            yaz(dst, s); sayac['admin'] += 1; continue
        dst = os.path.join(hedef, rel)
        if rel.endswith('.html'):
            s = oku(yol)
            once = s
            s = donustur_metin(s, site, host, html=True)
            s2 = demo_band_sok(s)
            if s2 != s: sayac['demo_band'] += 1
            s = admin_yollari(s2)
            yaz(dst, s); sayac['html'] += 1
        elif rel.endswith(('.js', '.css', '.xml', '.txt')):
            s = admin_yollari(donustur_metin(oku(yol), site, host))
            # FAZ3-KAPANIŞ: monolit admin-split (işaretli bölgeler admin-assets'e)
            sp = ADMIN_SPLIT.get(site)
            if sp and rel == sp[0]:
                s, admin_js = admin_split(s, sp[1], sp[2])
                if admin_js is not None:
                    yaz(os.path.join(hedef, 'admin-assets', sp[1]), banner_ekle(admin_js))
                    sayac['admin'] += 1
            if rel.endswith(('.js', '.css')): s = banner_ekle(s)
            yaz(dst, s); sayac['js' if rel.endswith('.js') else 'css' if rel.endswith('.css') else 'diger'] += 1
        else:
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            shutil.copy2(yol, dst); sayac['diger'] += 1

    # shared kopyası (kullanılanlar; admin-shared → admin-assets)
    for sp in glob.glob(os.path.join(KOK, 'shared', '*')):
        if os.path.isdir(sp):  # vendor gibi alt dizinler
            for alt in glob.glob(os.path.join(sp, '**', '*'), recursive=True):
                if os.path.isdir(alt): continue
                rel = os.path.relpath(alt, os.path.join(KOK, 'shared'))
                dst = os.path.join(hedef, 'shared', rel)
                os.makedirs(os.path.dirname(dst), exist_ok=True); shutil.copy2(alt, dst)
            continue
        ad = os.path.basename(sp)
        if ad.endswith(KOPYALAMA_DISI): continue
        icerik = banner_ekle(donustur_metin(oku(sp), site, host)) if ad.endswith(('.js','.css')) else None
        if ad in ADMIN_SHARED:
            yaz(os.path.join(hedef, 'admin-assets', ad), icerik); sayac['admin'] += 1
        elif icerik is not None:
            yaz(os.path.join(hedef, 'shared', ad), icerik)
        else:
            os.makedirs(os.path.join(hedef, 'shared'), exist_ok=True)
            shutil.copy2(sp, os.path.join(hedef, 'shared', ad))

    # robots.txt (üretim)
    yaz(os.path.join(hedef, 'robots.txt'),
        f"User-agent: *\nAllow: /\nDisallow: /admin-assets/\n\nSitemap: https://{host}/sitemap.xml\n")
    # sitemap: index.html → /
    smp = os.path.join(hedef, 'sitemap.xml')
    if os.path.exists(smp):
        s = oku(smp).replace(f'https://{host}/index.html', f'https://{host}/')
        yaz(smp, s)
    return sayac

def leakage_tara(site):
    hedef = os.path.join(DIST, site)
    bulgular = []
    for yol in glob.glob(os.path.join(hedef, '**', '*'), recursive=True):
        if os.path.isdir(yol) or not yol.endswith(('.html', '.js', '.css', '.xml', '.txt', '.json')): continue
        rel = os.path.relpath(yol, hedef)
        admin_mi = rel.startswith('admin-assets')
        s = oku(yol)
        for pat in YASAK:
            if pat in s:
                bulgular.append((rel, pat))
        for pat in SAGLAYICI:  # sağlayıcı ifşası: admin-assets dahil tüm paket
            if re.search(pat, s, re.I):
                bulgular.append((rel, 'SAĞLAYICI-İFŞA: ' + pat))
        if not admin_mi:  # çapraz-tenant yalnız public yüzeyde
            for pat in CAPRAZ[site]:
                if re.search(pat, s):
                    bulgular.append((rel, 'ÇAPRAZ-TENANT: ' + pat))
    return bulgular

if __name__ == '__main__':
    genel_hata = False
    for site, cfg in SITELER.items():
        print(f'══════ {site} → https://{cfg["host"]}/ ══════')
        sayac = paketle(site, cfg)
        print('  paket:', sayac)
        bulgular = leakage_tara(site)
        if bulgular:
            genel_hata = True
            print(f'  ✗ LEAKAGE — {len(bulgular)} bulgu (paket GEÇERSİZ):')
            for rel, pat in bulgular[:20]: print(f'      {rel} ← {pat}')
        else:
            print('  ✓ leakage taraması TEMİZ')
    if genel_hata:
        print('\nSONUÇ: PAKET DURDURULDU (leakage)'); sys.exit(1)
    print('\nSONUÇ: dist/ üretim paketleri hazır'); sys.exit(0)
